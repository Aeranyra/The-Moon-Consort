import pool from '../index.js';

export async function ensureGatherTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS gather_cooldowns (
            user_id VARCHAR(20) NOT NULL,
            guild_id VARCHAR(20) NOT NULL,
            last_used TIMESTAMP NOT NULL,
            PRIMARY KEY (user_id, guild_id)
        );
    `);
}

export async function getLastGather(userId, guildId) {
    const res = await pool.query(
        'SELECT last_used FROM gather_cooldowns WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    return res.rows[0]?.last_used ?? null;
}

export async function useGather(userId, guildId) {
    await pool.query(
        `INSERT INTO gather_cooldowns (user_id, guild_id, last_used)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET last_used = NOW()`,
        [userId, guildId]
    );
}
