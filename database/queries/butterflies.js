import pool from '../index.js';

export async function getButterflies(userId, guildId) {
    const res = await pool.query(
        'SELECT * FROM butterflies WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    return res.rows[0] ?? { white:0, pink:0, black:0, silver:0, gold:0 };
}

export async function addButterfly(userId, guildId, type) {
    await pool.query(
        `INSERT INTO butterflies (user_id, guild_id, ${type})
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET ${type} = butterflies.${type} + 1`,
        [userId, guildId]
    );
}

export async function transferButterfly(fromId, toId, guildId) {
    // Returns false if sender has no butterflies
    const b = await getButterflies(fromId, guildId);
    const types = ['white','pink','black','silver','gold'];
    const available = types.filter(t => b[t] > 0);
    if (!available.length) return false;
    const type = available[0]; // transfer lowest tier first
    await pool.query(
        `UPDATE butterflies SET ${type} = ${type} - 1
         WHERE user_id=$1 AND guild_id=$2`,
        [fromId, guildId]
    );
    await addButterfly(toId, guildId, type);
    return type;
}

export async function stealButterfly(fromId, toId, guildId) {
    // 50% chance
    if (Math.random() < 0.5) return { success: false };
    const b = await getButterflies(fromId, guildId);
    const types = ['white','pink','black','silver','gold'];
    const available = types.filter(t => b[t] > 0);
    if (!available.length) return { success: false, empty: true };
    const type = available[0];
    await pool.query(
        `UPDATE butterflies SET ${type} = ${type} - 1
         WHERE user_id=$1 AND guild_id=$2`,
        [fromId, guildId]
    );
    await addButterfly(toId, guildId, type);
    return { success: true, type };
}
