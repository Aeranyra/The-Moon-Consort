import pool from '../index.js';

export const PET_SPECIES = [
    { name: 'Mooncat', emoji: '🐈' },
    { name: 'Dream Butterfly', emoji: '🦋' },
    { name: 'Spirit Fox', emoji: '🦊' },
    { name: 'Lunar Bunny', emoji: '🐇' },
    { name: 'Star Finch', emoji: '🐦' },
    { name: 'Tiny Moon Dragon', emoji: '🐉' },
];

// Safe to call on every startup — does nothing if the table already exists.
export async function ensurePetTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS pets (
            owner_id TEXT NOT NULL,
            guild_id TEXT NOT NULL,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            affection INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            last_fed TIMESTAMP,
            last_played TIMESTAMP,
            PRIMARY KEY (owner_id, guild_id)
        );
    `);
}

export async function getPet(ownerId, guildId) {
    const res = await pool.query(
        'SELECT * FROM pets WHERE owner_id=$1 AND guild_id=$2',
        [ownerId, guildId]
    );
    return res.rows[0] ?? null;
}

export async function createPet(ownerId, guildId, name, species) {
    await pool.query(
        `INSERT INTO pets (owner_id, guild_id, name, species)
         VALUES ($1, $2, $3, $4)`,
        [ownerId, guildId, name, species]
    );
}

export async function feedPet(ownerId, guildId) {
    const res = await pool.query(
        `UPDATE pets SET affection = affection + 1, last_fed = NOW()
         WHERE owner_id=$1 AND guild_id=$2
         RETURNING *`,
        [ownerId, guildId]
    );
    return res.rows[0];
}

export async function playWithPet(ownerId, guildId) {
    const res = await pool.query(
        `UPDATE pets SET affection = affection + 2, last_played = NOW()
         WHERE owner_id=$1 AND guild_id=$2
         RETURNING *`,
        [ownerId, guildId]
    );
    return res.rows[0];
}
