// ── Moon Consort Front-Desk Changelog ────────────────────────────────────
// Edit VERSION_LABEL and NOTES before each deploy.
// The bot will post this to #front-desk automatically on startup.

export const BOT_NAME = '🌙 Moon Consort';
export const EMBED_COLOR = 0x9B59B6; // moon purple
export const VERSION_LABEL = 'v2.5.0';
export const FRONT_DESK_CHANNEL_NAME = 'front-desk';

export const NOTES = {
    newCommands: [
        '/gather — search the moonlit garden for butterflies (no cooldown)',
        '/tod — truth or dare, you pick which one',
        '/draw — draw one of 22 Major Arcana tarot cards',
        '/daily — daily check-in for a butterfly or blessing',
        '/seduce — turn your full attention on someone',
        '/sleep — tuck someone in for the night',
        '/dare — dare someone to do something absurd',
        '/lore — read the Moon Consort lore book (22 unlockable entries)',
        '/mood — check the Moon Consort mood today',
        '/confess send/reset — anonymous confessions via letter inbox',
        '/drink share/force — share a moonlit drink or force one on someone',
        '/eat share/force — share food or force-feed someone',
    ],
    newFeatures: [
        'Butterfly milestones — first kiss (+1), first marriage (+2), bond 50/100/200',
        'Random events now actually drop butterflies',
        '8 daily moods with unique colors and flavor text',
        'Full Moon Festival auto-triggers on real full moon dates',
        'Yes/No buttons on affection commands',
        'Embeds on every command with mood-colored borders',
        'Lore Book — 22 entries unlocking as your bonds grow',
    ],
    bugFixes: [
        'Fixed /drink and /eat not responding',
        'Fixed /confess timeout issues',
        'Fixed button interactions timing out',
    ],
    changes: [],
    maintenance: [],
};

export const CATEGORY_LABELS = {
    newCommands: '🆕 New Commands',
    newFeatures: '✨ New Features',
    bugFixes: '🔧 Bug Fixes',
    changes: '🛠️ Changes',
    maintenance: '📢 Maintenance',
};
