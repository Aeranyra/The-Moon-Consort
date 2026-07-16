import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getButterflies } from '../../database/queries/butterflies.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('butterflies')
    .setDescription('View your butterfly collection.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const b = await getButterflies(userId, guildId);
    const total = b.white + b.pink + b.black + b.silver + b.gold;
    const mood = await getDailyMood(guildId);

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`🦋 ${interaction.user.username}'s Butterflies`)
            .setDescription(`**Total: ${total}**`)
            .addFields(
                { name: '⚪ White',  value: `${b.white}`,  inline: true },
                { name: '🩷 Pink',   value: `${b.pink}`,   inline: true },
                { name: '⚫ Black',  value: `${b.black}`,  inline: true },
                { name: '🩶 Silver', value: `${b.silver}`, inline: true },
                { name: '🟡 Gold',   value: `${b.gold}`,   inline: true },
            )
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });
}
