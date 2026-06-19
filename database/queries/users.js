import pool from '../index.js';

export async function ensureUser(userId, guildId) {
    await pool.query(
        `INSERT INTO users (user_id, guild_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [userId, guildId]
    );
}

export async function getUser(userId, guildId) {
    await ensureUser(userId, guildId);
    const res = await pool.query(
        'SELECT * FROM users WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    return res.rows[0];
}

export async function incrementField(userId, guildId, field) {
    await pool.query(
        `UPDATE users SET ${field} = ${field} + 1
         WHERE user_id=$1 AND guild_id=$2`,
        [userId, guildId]
    );
}

export async function updateReputation(userId, guildId, reputation) {
    await pool.query(
        'UPDATE users SET reputation=$3 WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId, reputation]
    );
}

export async function updateHighestBond(userId, guildId, score) {
    await pool.query(
        `UPDATE users SET highest_bond = GREATEST(highest_bond, $3)
         WHERE user_id=$1 AND guild_id=$2`,
        [userId, guildId, score]
    );
}
