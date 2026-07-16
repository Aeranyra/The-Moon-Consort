import { SlashCommandBuilder } from 'discord.js';
import { getPendingProposal, deleteProposal } from '../../database/queries/marriages.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('decline')
    .setDescription('Decline a pending marriage proposal.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const proposal = await getPendingProposal(userId, guildId);
    if (!proposal) return interaction.reply({ embeds: [buildEmbed('relationships', '🌙 You have no pending proposals to decline.')], ephemeral: true });

    await deleteProposal(proposal.from_id, userId, guildId);
    await interaction.reply({ embeds: [buildEmbed('relationships', pick(replies.decline.success)(userId, proposal.from_id))] });
}
