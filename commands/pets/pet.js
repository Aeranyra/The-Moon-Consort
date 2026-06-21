import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { addButterfly } from '../../database/queries/butterflies.js';
import { getPet, createPet, feedPet, playWithPet, PET_SPECIES } from '../../database/queries/pets.js';
import { replies } from '../../utils/replies.js';
import { pick, mention } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

const FEED_COOLDOWN_MS = 60 * 60 * 1000;       // 1 hour — adjust if you want a different pace
const PLAY_COOLDOWN_MS = 2 * 60 * 60 * 1000;   // 2 hours
const PLAY_BUTTERFLY_CHANCE = 0.3;

export const data = new SlashCommandBuilder()
    .setName('pet')
    .setDescription('Your moonlit companion.')
    .addSubcommand(sub =>
        sub.setName('adopt')
            .setDescription('Adopt a random pet.')
            .addStringOption(o => o.setName('name').setDescription('Name your pet').setRequired(false).setMaxLength(32))
    )
    .addSubcommand(sub => sub.setName('feed').setDescription('Feed your pet.'))
    .addSubcommand(sub => sub.setName('play').setDescription('Play with your pet.'))
    .addSubcommand(sub => sub.setName('view').setDescription('View your pet.'));

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'adopt') return adopt(interaction);
    if (sub === 'feed') return feed(interaction);
    if (sub === 'play') return play(interaction);
    if (sub === 'view') return view(interaction);
}

async function adopt(interaction) {
    const ownerId = interaction.user.id;
    const guildId = interaction.guildId;
    await ensureUser(ownerId, guildId);

    const existing = await getPet(ownerId, guildId);
    if (existing) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.adopt.alreadyHave)(ownerId))],
            ephemeral: true,
        });
    }

    const choice = PET_SPECIES[Math.floor(Math.random() * PET_SPECIES.length)];
    const name = interaction.options.getString('name') || choice.name;

    await createPet(ownerId, guildId, name, choice.name);

    await interaction.reply({
        embeds: [buildEmbed('pets', pick(replies.pet.adopt.success)(ownerId, `${choice.emoji} ${choice.name}`, name), {
            title: '🧸 A New Companion',
        })],
    });
}

async function feed(interaction) {
    const ownerId = interaction.user.id;
    const guildId = interaction.guildId;
    await ensureUser(ownerId, guildId);

    const pet = await getPet(ownerId, guildId);
    if (!pet) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.noPet)(ownerId))],
            ephemeral: true,
        });
    }

    if (pet.last_fed && Date.now() - new Date(pet.last_fed).getTime() < FEED_COOLDOWN_MS) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.feed.cooldown)(ownerId))],
            ephemeral: true,
        });
    }

    await feedPet(ownerId, guildId);

    await interaction.reply({
        embeds: [buildEmbed('pets', pick(replies.pet.feed.success)(ownerId, pet.name))],
    });
}

async function play(interaction) {
    const ownerId = interaction.user.id;
    const guildId = interaction.guildId;
    await ensureUser(ownerId, guildId);

    const pet = await getPet(ownerId, guildId);
    if (!pet) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.noPet)(ownerId))],
            ephemeral: true,
        });
    }

    if (pet.last_played && Date.now() - new Date(pet.last_played).getTime() < PLAY_COOLDOWN_MS) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.play.cooldown)(ownerId))],
            ephemeral: true,
        });
    }

    await playWithPet(ownerId, guildId);

    let bonus = '';
    if (Math.random() < PLAY_BUTTERFLY_CHANCE) {
        await addButterfly(ownerId, guildId, 'white');
        bonus = '\n\n🦋 Your pet found a butterfly and brought it to you!';
    }

    await interaction.reply({
        embeds: [buildEmbed('pets', pick(replies.pet.play.success)(ownerId, pet.name) + bonus)],
    });
}

async function view(interaction) {
    const ownerId = interaction.user.id;
    const guildId = interaction.guildId;
    await ensureUser(ownerId, guildId);

    const pet = await getPet(ownerId, guildId);
    if (!pet) {
        return interaction.reply({
            embeds: [buildEmbed('pets', pick(replies.pet.noPet)(ownerId))],
            ephemeral: true,
        });
    }

    const ageDays = Math.floor((Date.now() - new Date(pet.created_at).getTime()) / (1000 * 60 * 60 * 24));

    await interaction.reply({
        embeds: [buildEmbed('pets', '', {
            title: `🧸 ${pet.name}`,
            fields: [
                { name: 'Species', value: pet.species, inline: true },
                { name: 'Affection', value: `${pet.affection}`, inline: true },
                { name: 'Age', value: `${ageDays} day${ageDays === 1 ? '' : 's'}`, inline: true },
                { name: 'Owner', value: mention(ownerId), inline: true },
            ],
        })],
    });
}
