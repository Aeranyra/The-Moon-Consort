import { SlashCommandBuilder } from 'discord.js';
import { getButterflies } from '../../database/queries/butterflies.js';

export const data = new SlashCommandBuilder()
    .setName('butterflies')
    .setDescription('View your butterfly collection.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const b = await getButterflies(userId, guildId);
    const total = b.white + b.pink + b.black + b.silver + b.gold;

    const lines = [
        `🦋 **${interaction.user.username}'s Butterflies** (Total: ${total})`,
        `⚪ White: ${b.white}`,
        `🩷 Pink: ${b.pink}`,
        `⚫ Black: ${b.black}`,
        `🩶 Silver: ${b.silver}`,
        `🟡 Gold: ${b.gold}`,
    ];

    await interaction.reply({ content: lines.join('\n'), ephemeral: true });
}
