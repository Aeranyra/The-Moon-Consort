import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('draw')
    .setDescription('Draw a tarot card from the Moon Consort\'s deck.');

export async function execute(interaction) {
    const guildId = interaction.guildId;
    const card = pick(replies.tarot.cards);
    const mood = await getDailyMood(guildId);

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`${card.emoji} ${card.name}`)
            .setDescription(card.text)
            .setFooter({ text: getMoodFooter(mood) })],
    });
}
