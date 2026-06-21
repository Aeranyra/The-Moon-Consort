import pool from '../index.js';

// Safe to call on every startup — does nothing if the table already exists.
export async function ensureFortuneTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS fortune_cooldowns (
            user_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            last_used TIMESTAMP NOT NULL,
            PRIMARY KEY (user_id, guild_id)
        );
    `);
}

export async function getLastFortune(userId, guildId) {
    const res = await pool.query(
        'SELECT last_used FROM fortune_cooldowns WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    return res.rows[0]?.last_used ?? null;
}

export async function useFortune(userId, guildId) {
    await pool.query(
        `INSERT INTO fortune_cooldowns (user_id, guild_id, last_used)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET last_used = NOW()`,
        [userId, guildId]
    );
}
