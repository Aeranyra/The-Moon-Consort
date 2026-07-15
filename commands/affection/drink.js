import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';
import { randomWeapon } from '../../utils/weapons.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('drink')
    .setDescription('Share a drink or force one on someone.')
    .addSubcommand(sub =>
        sub.setName('share')
            .setDescription('Offer someone a moonlit drink.')
            .addUserOption(o => o.setName('user').setDescription('Who to share with').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('force')
            .setDescription('Force a suspicious drink on someone.')
            .addUserOption(o => o.setName('user').setDescription('Unwilling target').setRequired(true))
    );

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'share') return drinkShare(interaction);
    if (sub === 'force') return drinkForce(interaction);
}

async function drinkShare(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 Drinking alone is fine, but this command needs a companion.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const row = buildYesNoRow('drink_share', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(replies.prompts.drink_share)(sender, target.id), { title: '🍵 A Drink?' })],
        components: [row],
    });
    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}

async function drinkForce(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('chaos', '🌙 You cannot force a drink on yourself. That\'s just drinking.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (score < 31) return interaction.reply({
        embeds: [buildEmbed('chaos', pick(replies.drink.force.failure)(sender))],
        ephemeral: true,
    });

    const backfired = rollBackfire();
    const text = backfired
        ? pick(replies.drink.force.backfire)(sender, target.id)
        : pick(replies.drink.force.success)(sender, target.id);

    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
