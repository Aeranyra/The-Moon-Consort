import pool from '../database/index.js';
import { addButterfly } from '../database/queries/butterflies.js';

export async function ensureMilestoneTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS milestones (
            user_id VARCHAR(20) NOT NULL,
            guild_id VARCHAR(20) NOT NULL,
            milestone VARCHAR(50) NOT NULL,
            awarded_at TIMESTAMP DEFAULT NOW(),
            PRIMARY KEY (user_id, guild_id, milestone)
        );
    `);
}

// Returns true if milestone was newly awarded, false if already claimed
export async function awardMilestone(userId, guildId, milestone, butterflies = 1) {
    const res = await pool.query(
        `INSERT INTO milestones (user_id, guild_id, milestone)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING
         RETURNING milestone`,
        [userId, guildId, milestone]
    );
    if (!res.rows.length) return false;

    for (let i = 0; i < butterflies; i++) {
        await addButterfly(userId, guildId, 'white');
    }
    return true;
}

// Check bond milestones after any bond update — returns array of reward messages
export async function checkBondMilestones(userId, guildId, bondScore) {
    const rewards = [];
    if (bondScore >= 50) {
        const got = await awardMilestone(userId, guildId, 'bond_50', 1);
        if (got) rewards.push('🦋 Bond milestone 50 reached! +1 butterfly');
    }
    if (bondScore >= 100) {
        const got = await awardMilestone(userId, guildId, 'bond_100', 2);
        if (got) rewards.push('🦋🦋 Bond milestone 100 reached! +2 butterflies');
    }
    if (bondScore >= 200) {
        const got = await awardMilestone(userId, guildId, 'bond_200', 3);
        if (got) rewards.push('🦋🦋🦋 Bond milestone 200 reached! +3 butterflies');
    }
    return rewards;
}
