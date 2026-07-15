import pool from '../database/index.js';
import { addButterfly } from '../database/queries/butterflies.js';
import { incrementField } from '../database/queries/users.js';

export async function ensureFestivalTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS festival_log (
            guild_id VARCHAR(20) NOT NULL,
            festival_date DATE NOT NULL,
            PRIMARY KEY (guild_id, festival_date)
        );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS moon_fragments (
            user_id VARCHAR(20) NOT NULL,
            guild_id VARCHAR(20) NOT NULL,
            count INT DEFAULT 0,
            PRIMARY KEY (user_id, guild_id)
        );
    `);
}

// Returns true if today is within 1 day of a full moon
// Uses the known full moon cycle (29.53059 days) anchored to a known full moon
export function isFullMoon() {
    const KNOWN_FULL_MOON = new Date('2000-01-06T18:14:00Z').getTime();
    const LUNAR_CYCLE_MS = 29.53059 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const phase = ((now - KNOWN_FULL_MOON) % LUNAR_CYCLE_MS + LUNAR_CYCLE_MS) % LUNAR_CYCLE_MS;
    const phaseDay = phase / (24 * 60 * 60 * 1000);
    // Full moon is at day ~14.765; within 1 day counts
    return Math.abs(phaseDay - 14.765) < 1.0;
}

// Check if festival already ran today for this guild
export async function festivalRanToday(guildId) {
    const today = new Date().toISOString().slice(0, 10);
    const res = await pool.query(
        'SELECT 1 FROM festival_log WHERE guild_id=$1 AND festival_date=$2',
        [guildId, today]
    );
    return res.rows.length > 0;
}

export async function markFestivalRan(guildId) {
    const today = new Date().toISOString().slice(0, 10);
    await pool.query(
        `INSERT INTO festival_log (guild_id, festival_date) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [guildId, today]
    );
}

// Give rewards to all active users in the guild (active = interacted in last 30 days)
export async function distributeFestivalRewards(guildId) {
    const res = await pool.query(
        `SELECT DISTINCT user_id FROM bonds
         WHERE (user1_id IS NOT NULL OR user2_id IS NOT NULL) AND guild_id=$1`,
        [guildId]
    );

    // Fallback: get all users in this guild
    const usersRes = await pool.query(
        'SELECT user_id FROM users WHERE guild_id=$1',
        [guildId]
    );

    const users = usersRes.rows.map(r => r.user_id);

    for (const userId of users) {
        await addButterfly(userId, guildId, 'white');
        await addButterfly(userId, guildId, 'white');
        await incrementField(userId, guildId, 'blessings');
        await addMoonFragment(userId, guildId);
    }

    return users.length;
}

export async function addMoonFragment(userId, guildId) {
    await pool.query(
        `INSERT INTO moon_fragments (user_id, guild_id, count)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET count = moon_fragments.count + 1`,
        [userId, guildId]
    );
}

export async function getMoonFragments(userId, guildId) {
    const res = await pool.query(
        'SELECT count FROM moon_fragments WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    return res.rows[0]?.count ?? 0;
}
