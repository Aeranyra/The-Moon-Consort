import pool from '../database/index.js';

export const MOODS = [
    { name: 'Regal',      emoji: '👑', color: 0x9B59B6 },
    { name: 'Romantic',   emoji: '💞', color: 0xFF8FB1 },
    { name: 'Mischievous',emoji: '😈', color: 0xE74C3C },
    { name: 'Silent',     emoji: '🌑', color: 0x2C3E50 },
    { name: 'Melancholic',emoji: '🌧️', color: 0x5D6D7E },
    { name: 'Celestial',  emoji: '✨', color: 0xF7DC6F },
    { name: 'Fierce',     emoji: '🔥', color: 0xE67E22 },
    { name: 'Gentle',     emoji: '🌸', color: 0xFFC0CB },
];

// Mood-flavored footer text
export const MOOD_FOOTERS = {
    Regal:       '👑 The Moon Consort regards you from above.',
    Romantic:    '💞 The Moon Consort feels something in the air tonight.',
    Mischievous: '😈 The Moon Consort is watching. And planning.',
    Silent:      '🌑 ...',
    Melancholic: '🌧️ The Moon Consort carries something heavy tonight.',
    Celestial:   '✨ The Moon Consort shines across infinite skies.',
    Fierce:      '🔥 The Moon Consort burns bright and without apology.',
    Gentle:      '🌸 The Moon Consort holds space for you tonight.',
};

export async function ensureMoodTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bot_state (
            guild_id VARCHAR(20) PRIMARY KEY,
            mood VARCHAR(20) DEFAULT 'Regal',
            mood_date DATE DEFAULT CURRENT_DATE,
            updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
    // Add mood_date column if it doesn't exist yet (safe migration)
    await pool.query(`
        ALTER TABLE bot_state ADD COLUMN IF NOT EXISTS mood_date DATE DEFAULT CURRENT_DATE;
    `);
}

export async function getDailyMood(guildId) {
    const res = await pool.query(
        'SELECT mood, mood_date FROM bot_state WHERE guild_id=$1',
        [guildId]
    );

    const today = new Date().toISOString().slice(0, 10);

    if (res.rows.length && res.rows[0].mood_date?.toISOString?.().slice(0, 10) === today) {
        return res.rows[0].mood;
    }

    // New day — pick a new random mood
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)].name;
    await pool.query(
        `INSERT INTO bot_state (guild_id, mood, mood_date, updated_at)
         VALUES ($1, $2, CURRENT_DATE, NOW())
         ON CONFLICT (guild_id) DO UPDATE
         SET mood=EXCLUDED.mood, mood_date=EXCLUDED.mood_date, updated_at=NOW()`,
        [guildId, mood]
    );
    return mood;
}

export function getMoodColor(moodName) {
    return MOODS.find(m => m.name === moodName)?.color ?? 0x9B59B6;
}

export function getMoodFooter(moodName) {
    return MOOD_FOOTERS[moodName] ?? '🌙 Moon Consort';
}
