import pool from '../index.js';

// Creates the letters table if it doesn't exist yet.
// Safe to call every time the bot starts — does nothing if the table is already there.
export async function ensureLetterTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS letters (
            id SERIAL PRIMARY KEY,
            guild_id TEXT NOT NULL,
            sender_id TEXT NOT NULL,
            recipient_id TEXT NOT NULL,
            content TEXT NOT NULL,
            read BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `);
    await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_letters_recipient
            ON letters (recipient_id, guild_id, read);
    `);
}

export async function createLetter(senderId, recipientId, guildId, content) {
    const res = await pool.query(
        `INSERT INTO letters (guild_id, sender_id, recipient_id, content)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [guildId, senderId, recipientId, content]
    );
    return res.rows[0].id;
}

export async function getUnreadLetters(recipientId, guildId, limit = 5) {
    const res = await pool.query(
        `SELECT * FROM letters
         WHERE recipient_id=$1 AND guild_id=$2 AND read=FALSE
         ORDER BY created_at ASC
         LIMIT $3`,
        [recipientId, guildId, limit]
    );
    return res.rows;
}

export async function markLettersRead(ids) {
    if (!ids.length) return;
    await pool.query(
        `UPDATE letters SET read=TRUE WHERE id = ANY($1::int[])`,
        [ids]
    );
}

export async function burnLetter(id, recipientId, guildId) {
    const res = await pool.query(
        `DELETE FROM letters
         WHERE id=$1 AND recipient_id=$2 AND guild_id=$3
         RETURNING id`,
        [id, recipientId, guildId]
    );
    return res.rowCount > 0;
}
