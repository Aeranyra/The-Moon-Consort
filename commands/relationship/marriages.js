import { SlashCommandBuilder } from 'discord.js';
import { getMarriages } from '../../database/queries/marriages.js';
import { MAX_MARRIAGES } from '../../utils/constants.js';

export const data = new SlashCommandBuilder()
    .setName('marriages')
    .setDescription('View your current marriages.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const marriages = await getMarriages(userId, guildId);
    if (!marriages.length) {
        return interaction.reply({ content: '💍 You have no current vows.', ephemeral: true });
    }

    const spouseIds = marriages.map(m => m.user1_id === userId ? m.user2_id : m.user1_id);
    const list = spouseIds.map(id => `<@${id}>`).join('\n');

    await interaction.reply({
        content: `💍 **Current Vows: ${marriages.length}/${MAX_MARRIAGES}**\n${list}`,
        ephemeral: true
    });
}
