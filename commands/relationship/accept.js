import { SlashCommandBuilder } from 'discord.js';
import { getPendingProposal, createMarriage, deleteProposal } from '../../database/queries/marriages.js';
import { addMemory } from '../../database/queries/memories.js';
import { awardMilestone } from '../../utils/milestones.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('accept')
    .setDescription('Accept a pending marriage proposal.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const proposal = await getPendingProposal(userId, guildId);
    if (!proposal) return interaction.reply({
        embeds: [buildEmbed('relationships', '🌙 You have no pending proposals.')],
        ephemeral: true,
    });

    await createMarriage(proposal.from_id, userId, guildId);
    await deleteProposal(proposal.from_id, userId, guildId);
    await addMemory(userId, guildId, 'first_marriage', proposal.from_id);
    await addMemory(proposal.from_id, guildId, 'first_marriage', userId);

    // First marriage milestone — both get butterflies
    const senderGot = await awardMilestone(proposal.from_id, guildId, 'first_marriage', 2);
    const targetGot = await awardMilestone(userId, guildId, 'first_marriage', 2);
    const milestoneMsg = (senderGot || targetGot)
        ? '\n\n🦋🦋 First marriage milestone! Both receive +2 butterflies'
        : '';

    await interaction.reply({
        embeds: [buildEmbed('relationships', pick(replies.accept.success)(userId, proposal.from_id) + milestoneMsg)],
    });
}
