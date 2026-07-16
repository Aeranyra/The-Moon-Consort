import pool from '../index.js';

export async function ensureConfessionTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS confessions (
            id SERIAL PRIMARY KEY,
            sender_id VARCHAR(20) NOT NULL,
            recipient_id VARCHAR(20) NOT NULL,
            guild_id VARCHAR(20) NOT NULL,
            revealed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE (sender_id, recipient_id, guild_id)
        );
    `);
}

// Returns true if confession already exists
export async function hasConfessed(senderId, recipientId, guildId) {
    const res = await pool.query(
        'SELECT 1 FROM confessions WHERE sender_id=$1 AND recipient_id=$2 AND guild_id=$3',
        [senderId, recipientId, guildId]
    );
    return res.rows.length > 0;
}

export async function createConfession(senderId, recipientId, guildId) {
    await pool.query(
        `INSERT INTO confessions (sender_id, recipient_id, guild_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [senderId, recipientId, guildId]
    );
}

// Check if both users have confessed to each other — returns true if mutual
export async function checkMutual(userA, userB, guildId) {
    const res = await pool.query(
        `SELECT COUNT(*) FROM confessions
         WHERE guild_id=$3
         AND ((sender_id=$1 AND recipient_id=$2)
           OR (sender_id=$2 AND recipient_id=$1))`,
        [userA, userB, guildId]
    );
    return parseInt(res.rows[0].count) >= 2;
}

export async function markRevealed(userA, userB, guildId) {
    await pool.query(
        `UPDATE confessions SET revealed=TRUE
         WHERE guild_id=$3
         AND ((sender_id=$1 AND recipient_id=$2)
           OR (sender_id=$2 AND recipient_id=$1))`,
        [userA, userB, guildId]
    );
}

// Delete a specific confession (for admin reset)
export async function deleteConfession(senderId, recipientId, guildId) {
    await pool.query(
        'DELETE FROM confessions WHERE sender_id=$1 AND recipient_id=$2 AND guild_id=$3',
        [senderId, recipientId, guildId]
    );
}

// Delete ALL confessions for a user in a guild (full reset)
export async function resetConfessions(userId, guildId) {
    await pool.query(
        'DELETE FROM confessions WHERE (sender_id=$1 OR recipient_id=$1) AND guild_id=$2',
        [userId, guildId]
    );
}
