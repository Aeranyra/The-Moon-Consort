import { SlashCommandBuilder } from 'discord.js';
import { getUser } from '../../database/queries/users.js';
import { getMarriages } from '../../database/queries/marriages.js';
import { getButterflies } from '../../database/queries/butterflies.js';
import pool from '../../database/index.js';
import { getBondLevel } from '../../utils/bondLevel.js';
import { calcReputation } from '../../utils/reputation.js';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your Moon Consort profile.');

export async function execute(interaction) {
    const userId  = interaction.user.id;
    const guildId = interaction.guildId;

    const user      = await getUser(userId, guildId);
    const marriages = await getMarriages(userId, guildId);
    const b         = await getButterflies(userId, guildId);
    const blessRes  = await pool.query('SELECT * FROM blessings WHERE user_id=$1 AND guild_id=$2', [userId, guildId]);
    const giftRes   = await pool.query('SELECT * FROM gifts WHERE user_id=$1 AND guild_id=$2', [userId, guildId]);
    const vowRes    = await pool.query('SELECT content FROM vows WHERE user_id=$1 AND guild_id=$2', [userId, guildId]);
    const childRes  = await pool.query('SELECT COUNT(*) FROM family WHERE parent_id=$1 AND guild_id=$2', [userId, guildId]);

    const reputation = calcReputation({
        ...user,
        blessings_given: blessRes.rows[0]?.blessings_given ?? 0,
    });

    const bondLevel   = getBondLevel(user.highest_bond);
    const totalBflies = b.white + b.pink + b.black + b.silver + b.gold;
    const spouses     = marriages.map(m => `<@${m.user1_id === userId ? m.user2_id : m.user1_id}>`).join(', ') || 'None';

    const lines = [
        `🌙 **${interaction.user.username}'s Profile**`,
        `💍 Spouses: ${spouses}`,
        `👶 Children: ${childRes.rows[0].count}`,
        `💞 Highest Bond: ${user.highest_bond} (${bondLevel.label})`,
        `🦋 Butterflies: ${totalBflies} (⚪${b.white} 🩷${b.pink} ⚫${b.black} 🩶${b.silver} 🟡${b.gold})`,
        `🎁 Gifts Given: ${giftRes.rows[0]?.gifts_given ?? 0}`,
        `🌸 Blessings Given: ${blessRes.rows[0]?.blessings_given ?? 0}`,
        `😈 Mischief Count: ${user.mischief_count}`,
        `💔 Divorces: ${user.divorce_count}`,
        `🎖️ Reputation: ${reputation}`,
        vowRes.rows[0]?.content ? `📜 Vow: "${vowRes.rows[0].content}"` : `📜 Vow: None`,
    ];

    await interaction.reply({ content: lines.join('\n'), ephemeral: true });
}
