import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getMarriages } from '../../database/queries/marriages.js';
import { MAX_MARRIAGES } from '../../utils/constants.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('marriages')
    .setDescription('View your current marriages.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const mood = await getDailyMood(guildId);

    const marriages = await getMarriages(userId, guildId);
    if (!marriages.length) return interaction.reply({
        embeds: [new EmbedBuilder().setColor(getMoodColor(mood)).setDescription('💍 You have no current vows.').setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });

    const spouseIds = marriages.map(m => m.user1_id === userId ? m.user2_id : m.user1_id);
    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`💍 Current Vows: ${marriages.length}/${MAX_MARRIAGES}`)
            .setDescription(spouseIds.map(id => `<@${id}>`).join('\n'))
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });
}
