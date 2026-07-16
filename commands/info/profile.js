import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUser } from '../../database/queries/users.js';
import { getMarriages } from '../../database/queries/marriages.js';
import { getButterflies } from '../../database/queries/butterflies.js';
import { getMoonFragments } from '../../utils/festival.js';
import pool from '../../database/index.js';
import { getBondLevel } from '../../utils/bondLevel.js';
import { calcReputation } from '../../utils/reputation.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your Moon Consort profile.')
    .addUserOption(o => o.setName('user').setDescription('View someone else\'s profile').setRequired(false));

export async function execute(interaction) {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const userId = target.id;
    const guildId = interaction.guildId;

    const [user, marriages, b, blessRes, giftRes, vowRes, childRes, fragments] = await Promise.all([
        getUser(userId, guildId),
        getMarriages(userId, guildId),
        getButterflies(userId, guildId),
        pool.query('SELECT * FROM blessings WHERE user_id=$1 AND guild_id=$2', [userId, guildId]),
        pool.query('SELECT * FROM gifts WHERE user_id=$1 AND guild_id=$2', [userId, guildId]),
        pool.query('SELECT content FROM vows WHERE user_id=$1 AND guild_id=$2', [userId, guildId]),
        pool.query('SELECT COUNT(*) FROM family WHERE parent_id=$1 AND guild_id=$2', [userId, guildId]),
        getMoonFragments(userId, guildId),
    ]);

    const reputation = calcReputation({ ...user, blessings_given: blessRes.rows[0]?.blessings_given ?? 0 });
    const bondLevel = getBondLevel(user.highest_bond);
    const totalBflies = b.white + b.pink + b.black + b.silver + b.gold;
    const spouses = marriages.map(m => `<@${m.user1_id === userId ? m.user2_id : m.user1_id}>`).join(', ') || 'None';
    const mood = await getDailyMood(guildId);

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`🌙 ${target.username}'s Profile`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '💍 Spouses',      value: spouses,                                                inline: false },
                { name: '👶 Children',     value: childRes.rows[0].count,                                inline: true },
                { name: '💔 Divorces',     value: `${user.divorce_count}`,                               inline: true },
                { name: '💞 Highest Bond', value: `${user.highest_bond} — ${bondLevel.label}`,           inline: false },
                { name: '🦋 Butterflies',  value: `⚪${b.white} 🩷${b.pink} ⚫${b.black} 🩶${b.silver} 🟡${b.gold} (${totalBflies} total)`, inline: false },
                { name: '🌸 Blessings',    value: `${blessRes.rows[0]?.blessings_given ?? 0} given`,     inline: true },
                { name: '🎁 Gifts',        value: `${giftRes.rows[0]?.gifts_given ?? 0} given`,          inline: true },
                { name: '😈 Mischief',     value: `${user.mischief_count}`,                              inline: true },
                { name: '🌙 Moon Fragments', value: `${fragments}`,                                      inline: true },
                { name: '🎖️ Reputation',  value: reputation,                                            inline: true },
                { name: '📜 Vow',          value: vowRes.rows[0]?.content ? `"${vowRes.rows[0].content}"` : 'None', inline: false },
            )
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });
}
