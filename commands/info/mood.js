import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDailyMood, getMoodColor, getMoodFooter, MOODS } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('mood')
    .setDescription('Check the Moon Consort\'s mood today.');

export async function execute(interaction) {
    const guildId = interaction.guildId;
    const moodName = await getDailyMood(guildId);
    const moodData = MOODS.find(m => m.name === moodName);

    const descriptions = {
        Regal:       'The Moon Consort sits high tonight, surveying all beneath its gaze. Responses will carry the weight of silver and quiet authority.',
        Romantic:    'The Moon Consort feels the pull of something tender tonight. Words will be warmer. Bonds feel closer.',
        Mischievous: 'Something wicked this way watches. The Moon Consort is in a mood to cause small, beautiful trouble.',
        Silent:      'The Moon Consort speaks only in shadows tonight. Replies will be brief, cryptic, and somehow more meaningful for it.',
        Melancholic: 'The Moon Consort carries something heavy across the sky tonight. There is beauty in the ache.',
        Celestial:   'The Moon Consort burns with ancient light tonight. Everything feels a little more infinite.',
        Fierce:      'Do not test the Moon Consort tonight. It is bright, it is burning, and it has no patience for half-measures.',
        Gentle:      'The Moon Consort is soft tonight. Careful with you. It wants everyone to feel held.',
    };

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(moodName))
            .setTitle(`${moodData?.emoji ?? '🌙'} Tonight's Mood: ${moodName}`)
            .setDescription(descriptions[moodName] ?? 'The moon is feeling something tonight.')
            .setFooter({ text: getMoodFooter(moodName) })],
    });
}
