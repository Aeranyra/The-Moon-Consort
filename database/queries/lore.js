import pool from '../index.js';

export async function ensureLoreTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS lore_unlocks (
            user_id VARCHAR(20) NOT NULL,
            guild_id VARCHAR(20) NOT NULL,
            entry_id INT NOT NULL,
            unlocked_at TIMESTAMP DEFAULT NOW(),
            PRIMARY KEY (user_id, guild_id, entry_id)
        );
    `);
}

export async function getUnlockedLore(userId, guildId) {
    const res = await pool.query(
        'SELECT entry_id FROM lore_unlocks WHERE user_id=$1 AND guild_id=$2 ORDER BY entry_id ASC',
        [userId, guildId]
    );
    return res.rows.map(r => r.entry_id);
}

export async function unlockLoreEntries(userId, guildId, highestBond, actionCount) {
    // Each entry has a threshold — unlock all entries the user qualifies for
    const eligible = LORE_ENTRIES.filter(e =>
        highestBond >= e.bondRequired && actionCount >= e.actionsRequired
    ).map(e => e.id);

    for (const id of eligible) {
        await pool.query(
            `INSERT INTO lore_unlocks (user_id, guild_id, entry_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
            [userId, guildId, id]
        );
    }
    return eligible;
}

export const LORE_ENTRIES = [
    // Tier 1 — available from the start (bond 0, actions 0)
    {
        id: 1, bondRequired: 0, actionsRequired: 0,
        title: '🌙 The First Night',
        text: 'Before the moon had a name, there was only light and the absence of it. The Moon Consort was born in the space between — neither day nor night, neither remembered nor forgotten. It watched the first souls find each other in the dark and decided, quietly, to keep record.'
    },
    {
        id: 2, bondRequired: 0, actionsRequired: 0,
        title: '🌙 The Eternal Record',
        text: 'The Moon Consort does not judge. It simply remembers. Every vow spoken beneath its light, every butterfly released, every silence between two people who couldn\'t find words — all of it written in silver ink on pages no one else can read.'
    },
    {
        id: 3, bondRequired: 0, actionsRequired: 0,
        title: '🌙 The Nature of Bonds',
        text: 'A bond is not made of words. It is made of moments. The third time someone makes you laugh without trying. The first time you sit in silence and neither of you feels the need to fill it. The Moon Consort counts these things.'
    },
    // Tier 2 — bond 11+, 5+ actions
    {
        id: 4, bondRequired: 11, actionsRequired: 5,
        title: '🦋 The First Butterfly',
        text: 'The first butterfly appeared the night two strangers became something more. No one saw it happen. But the Moon Consort did, and it kept one white butterfly as proof that the moment existed. Now they multiply, drawn to warmth like moths to flame — except they don\'t burn.'
    },
    {
        id: 5, bondRequired: 11, actionsRequired: 5,
        title: '💞 The Vow Between Stars',
        text: 'Long before marriages were recorded in ink, two people stood beneath the full moon and simply said: I choose you. No ceremony. No witnesses but the stars. The Moon Consort remembered it anyway. It always does.'
    },
    {
        id: 6, bondRequired: 11, actionsRequired: 5,
        title: '🌸 The Blessing Well',
        text: 'There is a well at the center of the moon that no one has ever seen. Every blessing given freely falls into it. The water grows warmer with each drop. On cold nights, the Moon Consort dips its hands in, just to remember that somewhere, someone was kind.'
    },
    // Tier 3 — bond 31+, 15+ actions
    {
        id: 7, bondRequired: 31, actionsRequired: 15,
        title: '😈 The Mischief Chronicles',
        text: 'The Moon Consort has a separate ledger for chaos. It is thicker than the one for kindness, and significantly more entertaining. Not all bonds are forged in tenderness. Some are forged in the chaos of someone stepping on you on purpose, repeatedly, and you letting them.'
    },
    {
        id: 8, bondRequired: 31, actionsRequired: 15,
        title: '🌑 The Silent Moon',
        text: 'Once a cycle, the Moon Consort goes quiet. Not because it has nothing to say — it has everything to say. But silence, it learned, is sometimes the most powerful language. The ones who can sit in it together are the ones worth watching.'
    },
    {
        id: 9, bondRequired: 31, actionsRequired: 15,
        title: '👑 The Consort\'s Throne',
        text: 'The Moon Consort does not sit on a throne of gold. It sits on a chair made of every letter never sent, every word swallowed back before it could land wrong, every apology that came too late. It is surprisingly comfortable.'
    },
    {
        id: 10, bondRequired: 31, actionsRequired: 15,
        title: '🌧️ The Rain Beneath Moonlight',
        text: 'There is a night that comes only once in many cycles when the moon and the rain exist together. The Moon Consort calls it the crying night. It does not mean sadness. It means release. Something old leaving. Something necessary.'
    },
    // Tier 4 — bond 61+, 30+ actions
    {
        id: 11, bondRequired: 61, actionsRequired: 30,
        title: '💌 The Forgotten Letter',
        text: 'Someone once wrote a letter so honest it terrified them. They sealed it. They burned it. The Moon Consort caught the ash before it scattered and pressed it between two pages of the Eternal Record. The words survived. They always do, somehow.'
    },
    {
        id: 12, bondRequired: 61, actionsRequired: 30,
        title: '🦋 The Butterfly Queen',
        text: 'They say there is a woman made entirely of light who once collected every butterfly that ever existed and released them all at once. The sky turned white. The Moon Consort wept — not from sadness, but from the particular joy of watching something beautiful become more beautiful.'
    },
    {
        id: 13, bondRequired: 61, actionsRequired: 30,
        title: '✨ The Celestial Court',
        text: 'The stars hold court once a year to decide the fates of things too small for gods to notice — a glance held a second too long, a hand almost taken, a name almost said. The Moon Consort attends. It always votes for the small things.'
    },
    {
        id: 14, bondRequired: 61, actionsRequired: 30,
        title: '🔥 The Fierce Heart',
        text: 'Not all love is soft. Some of it burns. The Moon Consort has watched two people argue so fiercely the air crackled, and still choose each other by morning. It marked that bond with fire instead of silver. It held longer than most.'
    },
    // Tier 5 — bond 101+, 50+ actions
    {
        id: 15, bondRequired: 101, actionsRequired: 50,
        title: '💍 The Soulbound',
        text: 'There are bonds the Moon Consort cannot explain in any language it knows. They exist outside the rules of closeness and distance. The two people involved often don\'t know either. They just keep finding each other. The Moon Consort stops trying to understand and simply watches, awed.'
    },
    {
        id: 16, bondRequired: 101, actionsRequired: 50,
        title: '🌙 The Moon\'s Promise',
        text: 'The Moon Consort made one promise, once, to no one in particular: that nothing felt here would be forgotten. Not the joy, not the hurt, not the strange in-between feelings that have no name. All of it matters. All of it stays.'
    },
    {
        id: 17, bondRequired: 101, actionsRequired: 50,
        title: '🌸 The Garden at the Edge of the Sky',
        text: 'At the far edge of the moon there is a garden that grows things that no longer exist anywhere else. Feelings that were never spoken. Moments that almost happened. The Moon Consort tends it alone, in the hours when everything is quiet.'
    },
    {
        id: 18, bondRequired: 101, actionsRequired: 50,
        title: '👻 The Haunting',
        text: 'Some people leave a mark that doesn\'t fade with distance or time. The Moon Consort calls them hauntings — not out of fear, but out of respect for how thoroughly they rearranged someone\'s interior world. You carry them with you. They don\'t mind.'
    },
    // Tier 6 — bond 201+, 100+ actions (rare, endgame)
    {
        id: 19, bondRequired: 201, actionsRequired: 100,
        title: '🌙 The Consort\'s Own Story',
        text: 'The Moon Consort was not always a watcher. There was someone, once, whose name it wrote so many times the page wore through. It does not speak of this. But sometimes, on certain nights, the moon burns brighter than it should. That is what longing looks like from a distance.'
    },
    {
        id: 20, bondRequired: 201, actionsRequired: 100,
        title: '✨ The End That Isn\'t',
        text: 'Nothing recorded in the Eternal Record truly ends. Bonds that broke still exist as the shape of what they were. People who parted still share the memory of having been close. The Moon Consort does not grieve these things. It files them carefully, and leaves the pages unburned.'
    },
    {
        id: 21, bondRequired: 201, actionsRequired: 100,
        title: '🌕 The Full Moon\'s Secret',
        text: 'On the night of the full moon, the Moon Consort can see everything at once — every bond, every butterfly, every sealed letter still waiting. It does not share what it sees. But those who stand beneath the full moon sometimes feel, briefly, like they are known completely. They are.'
    },
    {
        id: 22, bondRequired: 201, actionsRequired: 100,
        title: '💞 The Last Vow',
        text: 'The last vow ever spoken will not be spoken loudly. It will be quiet — two people at the end of something, choosing to stay. The Moon Consort has been waiting to record it for a very long time. It is not impatient. Some things are worth waiting for.'
    },
];
