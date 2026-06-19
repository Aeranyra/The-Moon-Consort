import pool from '../index.js';

// Get bond score between two users (order-independent)
export async function getBond(user1, user2, guildId) {
    const [a, b] = [user1, user2].sort();
    const res = await pool.query(
        'SELECT score FROM bonds WHERE user1_id=$1 AND user2_id=$2 AND guild_id=$3',
        [a, b, guildId]
    );
    return res.rows[0]?.score ?? 0;
}

// Add or subtract bond score
export async function updateBond(user1, user2, guildId, amount) {
    const [a, b] = [user1, user2].sort();
    await pool.query(
        `INSERT INTO bonds (user1_id, user2_id, guild_id, score, updated_at)
         VALUES ($1, $2, $3, GREATEST(0, $4), NOW())
         ON CONFLICT (user1_id, user2_id, guild_id)
         DO UPDATE SET score = GREATEST(0, bonds.score + $4), updated_at = NOW()`,
        [a, b, guildId, amount]
    );
    return await getBond(a, b, guildId);
}
