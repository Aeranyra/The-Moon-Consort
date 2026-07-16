import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { addButterfly } from '../../database/queries/butterflies.js';
import { getLastDaily, useDaily } from '../../database/queries/daily.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Check in with the moon. Once per day.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    await ensureUser(userId, guildId);

    const last = await getLastDaily(userId, guildId);
    if (last) {
        const remaining = COOLDOWN_MS - (Date.now() - new Date(last).getTime());
        if (remaining > 0) {
            const hours = Math.ceil(remaining / (60 * 60 * 1000));
            const mood = await getDailyMood(guildId);
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(getMoodColor(mood))
                    .setDescription(pick(replies.daily.cooldown)(userId) + `\n\n*Return in ~${hours}h.*`)
                    .setFooter({ text: getMoodFooter(mood) })],
                ephemeral: true,
            });
        }
    }

    await useDaily(userId, guildId);
    const mood = await getDailyMood(guildId);
    const roll = Math.random();

    let text, title;
    if (roll < 0.15) {
        // 15% — blessing
        await pool.query(
            `INSERT INTO blessings (user_id, guild_id, blessings_received)
             VALUES ($1, $2, 1)
             ON CONFLICT (user_id, guild_id)
             DO UPDATE SET blessings_received = blessings.blessings_received + 1`,
            [userId, guildId]
        );
        text = pick(replies.daily.blessing)(userId);
        title = '🌸 A Blessing';
    } else if (roll < 0.40) {
        // 25% — butterfly
        await addButterfly(userId, guildId, 'white');
        text = pick(replies.daily.butterfly)(userId);
        title = '🦋 A Gift';
    } else {
        // 60% — nothing but flavor
        text = pick(replies.daily.nothing)(userId);
        title = '🌙 Daily Check-in';
    }

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(title)
            .setDescription(text)
            .setFooter({ text: getMoodFooter(mood) })],
    });
}
