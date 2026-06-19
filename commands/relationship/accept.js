import { SlashCommandBuilder } from 'discord.js';
import { getPendingProposal, createMarriage, deleteProposal } from '../../database/queries/marriages.js';
import { addMemory } from '../../database/queries/memories.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('accept')
    .setDescription('Accept a pending marriage proposal.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const proposal = await getPendingProposal(userId, guildId);
    if (!proposal) return interaction.reply({ content: '🌙 You have no pending proposals.', ephemeral: true });

    await createMarriage(proposal.from_id, userId, guildId);
    await deleteProposal(proposal.from_id, userId, guildId);
    await addMemory(userId, guildId, 'first_marriage', proposal.from_id);
    await addMemory(proposal.from_id, guildId, 'first_marriage', userId);

    await interaction.reply({ content: pick(replies.accept.success)(userId, proposal.from_id) });
}
