import { SlashCommandBuilder } from 'discord.js';
import { getUser } from '../../database/queries/users.js';
import pool from '../../database/index.js';
import { calcReputation } from '../../utils/reputation.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('reputation')
    .setDescription('Check your current reputation.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const user = await getUser(userId, guildId);
    const blessRes = await pool.query('SELECT blessings_given FROM blessings WHERE user_id=$1 AND guild_id=$2', [userId, guildId]);
    const rep = calcReputation({ ...user, blessings_given: blessRes.rows[0]?.blessings_given ?? 0 });
    await interaction.reply({ embeds: [buildEmbed('social', `🎖️ **${interaction.user.username}'s Reputation:** ${rep}`)], ephemeral: true });
}
