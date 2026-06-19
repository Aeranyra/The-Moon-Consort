import pool from '../index.js';

export async function getMarriages(userId, guildId) {
    const res = await pool.query(
        `SELECT * FROM marriages
         WHERE (user1_id=$1 OR user2_id=$1) AND guild_id=$2`,
        [userId, guildId]
    );
    return res.rows;
}

export async function countMarriages(userId, guildId) {
    const res = await pool.query(
        `SELECT COUNT(*) FROM marriages
         WHERE (user1_id=$1 OR user2_id=$1) AND guild_id=$2`,
        [userId, guildId]
    );
    return parseInt(res.rows[0].count);
}

export async function createMarriage(user1, user2, guildId) {
    await pool.query(
        'INSERT INTO marriages (user1_id, user2_id, guild_id) VALUES ($1, $2, $3)',
        [user1, user2, guildId]
    );
}

export async function deleteMarriage(user1, user2, guildId) {
    await pool.query(
        `DELETE FROM marriages
         WHERE ((user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1))
         AND guild_id=$3`,
        [user1, user2, guildId]
    );
}

export async function getProposal(fromId, toId, guildId) {
    const res = await pool.query(
        'SELECT * FROM proposals WHERE from_id=$1 AND to_id=$2 AND guild_id=$3',
        [fromId, toId, guildId]
    );
    return res.rows[0];
}

export async function getPendingProposal(toId, guildId) {
    const res = await pool.query(
        'SELECT * FROM proposals WHERE to_id=$1 AND guild_id=$2 ORDER BY created_at DESC LIMIT 1',
        [toId, guildId]
    );
    return res.rows[0];
}

export async function createProposal(fromId, toId, guildId) {
    await pool.query(
        'INSERT INTO proposals (from_id, to_id, guild_id) VALUES ($1, $2, $3)',
        [fromId, toId, guildId]
    );
}

export async function deleteProposal(fromId, toId, guildId) {
    await pool.query(
        'DELETE FROM proposals WHERE from_id=$1 AND to_id=$2 AND guild_id=$3',
        [fromId, toId, guildId]
    );
}
