import pool from '../index.js';

export async function addMemory(userId, guildId, eventType, relatedUserId = null) {
    // Only store the first occurrence of each event type
    const exists = await pool.query(
        'SELECT id FROM memories WHERE user_id=$1 AND guild_id=$2 AND event_type=$3',
        [userId, guildId, eventType]
    );
    if (exists.rows.length > 0) return;
    await pool.query(
        'INSERT INTO memories (user_id, guild_id, event_type, related_user_id) VALUES ($1,$2,$3,$4)',
        [userId, guildId, eventType, relatedUserId]
    );
}

export async function getMemories(userId, guildId) {
    const res = await pool.query(
        'SELECT * FROM memories WHERE user_id=$1 AND guild_id=$2 ORDER BY occurred_at ASC',
        [userId, guildId]
    );
    return res.rows;
}
