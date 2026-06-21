import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { createLetter, getUnreadLetters, markLettersRead, burnLetter } from '../../database/queries/letters.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('letter')
    .setDescription('Secret letters carried by moonlight.')
    .addSubcommand(sub =>
        sub.setName('send')
            .setDescription('Send a sealed, anonymous letter.')
            .addUserOption(o => o.setName('user').setDescription('Recipient').setRequired(true))
            .addStringOption(o => o.setName('message').setDescription('Your letter').setRequired(true).setMaxLength(1000))
    )
    .addSubcommand(sub =>
        sub.setName('inbox')
            .setDescription('Read your sealed letters.')
    )
    .addSubcommand(sub =>
        sub.setName('burn')
            .setDescription('Destroy a letter forever.')
            .addIntegerOption(o => o.setName('id').setDescription('Letter ID (shown in /letter inbox)').setRequired(true))
    );

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'send') return sendLetter(interaction);
    if (sub === 'inbox') return showInbox(interaction);
    if (sub === 'burn') return burnTheLetter(interaction);
}

async function sendLetter(interaction) {
    const senderId = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;
    const message = interaction.options.getString('message');

    if (target.id === senderId) {
        return interaction.reply({
            embeds: [buildEmbed('letters', pick(replies.letter.send.self)(senderId))],
            ephemeral: true,
        });
    }

    await ensureUser(senderId, guildId);
    await ensureUser(target.id, guildId);

    await createLetter(senderId, target.id, guildId, message);

    await interaction.reply({
        embeds: [buildEmbed('letters', pick(replies.letter.send.success)(senderId, target.id), { title: '💌 Letter Sent' })],
        ephemeral: true,
    });
}

async function showInbox(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    await ensureUser(userId, guildId);

    const letters = await getUnreadLetters(userId, guildId, 5);

    if (!letters.length) {
        return interaction.reply({
            embeds: [buildEmbed('letters', pick(replies.letter.inbox.empty)(userId), { title: '🌙 Sealed Letters' })],
            ephemeral: true,
        });
    }

    const fields = letters.map(l => ({
        name: `Letter #${l.id}`,
        value: l.content,
    }));

    await markLettersRead(letters.map(l => l.id));

    await interaction.reply({
        embeds: [buildEmbed('letters', 'Use `/letter burn id:<number>` to destroy any of these forever.', {
            title: '🌙 Sealed Letters',
            fields,
        })],
        ephemeral: true,
    });
}

async function burnTheLetter(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const id = interaction.options.getInteger('id');

    const success = await burnLetter(id, userId, guildId);

    if (!success) {
        return interaction.reply({
            embeds: [buildEmbed('letters', pick(replies.letter.burn.notFound)(userId))],
            ephemeral: true,
        });
    }

    await interaction.reply({
        embeds: [buildEmbed('letters', pick(replies.letter.burn.success)(userId), { title: '🔥 Letter Burned' })],
        ephemeral: true,
    });
}
