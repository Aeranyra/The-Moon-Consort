import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';

export const data = new SlashCommandBuilder()
    .setName('tease')
    .setDescription('Tease someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({ embeds: [buildEmbed('affection', '🌙 You cannot do this to yourself.')], ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (score < 11) {
        return interaction.reply({ embeds: [buildEmbed('affection', pick(replies.tease.failure)(sender))], ephemeral: true });
    }

    const row = buildYesNoRow('tease', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(replies.prompts['tease'])(sender, target.id), { title: '...' })],
        components: [row],
    });
    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}
