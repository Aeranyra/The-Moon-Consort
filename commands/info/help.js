import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const CATEGORIES = [
    {
        name: '💞 Affection',
        commands: [
            ['comfort', 'Comfort someone.'],
            ['cuddle', 'Cuddle someone. Needs Friend bond (11+).'],
            ['hug', 'Hug someone.'],
            ['kiss', 'Kiss someone. Needs Friend bond (11+).'],
            ['pat', 'Pat someone.'],
            ['snuggle', 'Snuggle someone. Needs Friend bond (11+).'],
            ['tease', 'Tease someone. Needs Friend bond (11+).'],
        ],
    },
    {
        name: '😈 Chaos',
        commands: [
            ['challenge', 'Start a staring contest. Needs Cherished bond (61+). First to /yield loses.'],
            ['haunt', 'Haunt someone from the shadows. Needs Friend bond (11+).'],
            ['ignore', 'Ignore someone coldly. Needs Friend bond (11+). Lowers bond.'],
            ['poke', 'Poke someone.'],
            ['slap', 'Slap someone. Needs Close bond (31+). Lowers bond.'],
            ['stalk', "Reveal someone's last interaction partner. Needs Cherished bond (61+)."],
            ['steal', 'Attempt to steal a butterfly. Needs Cherished bond (61+). Risky — can fail.'],
            ['step', 'Step on someone. Needs Close bond (31+). Lowers bond.'],
        ],
    },
    {
        name: '👨‍👩‍👦 Family',
        commands: [
            ['adopt', 'Adopt someone as your child. Needs Cherished bond (61+).'],
            ['family', 'View your family tree — spouses, parents, children.'],
        ],
    },
    {
        name: '📜 Info',
        commands: [
            ['bond', 'Check your bond level with someone.'],
            ['butterflies', 'View your butterfly collection.'],
            ['fortune', 'Receive your daily moon fortune.'],
            ['memories', 'View your moon memories — milestones like first kiss or marriage.'],
            ['profile', 'View your full Moon Consort profile.'],
            ['reputation', 'Check your current reputation title.'],
            ['vow', 'Write or view your personal vow.'],
        ],
    },
    {
        name: '💍 Relationships',
        commands: [
            ['accept', 'Accept a pending marriage proposal.'],
            ['decline', 'Decline a pending marriage proposal.'],
            ['divorce', 'End a marriage. Lowers bond by 25.'],
            ['marriages', 'View your current marriages.'],
            ['propose', 'Send a marriage proposal. Needs Close bond (31+). Max 10 marriages.'],
        ],
    },
    {
        name: '🎁 Social',
        commands: [
            ['bless', 'Bestow a moonlight blessing. Needs Close bond (31+). 24h cooldown.'],
            ['butterfly', 'Send a butterfly from your collection. Needs Close bond (31+).'],
            ['gift', 'Give someone a random gift.'],
        ],
    },
];

const BOND_LEVELS_TEXT = [
    '0–10 — **Stranger**',
    '11–30 — **Friend**',
    '31–60 — **Close**',
    '61–100 — **Cherished**',
    '101–200 — **Loved**',
    '201+ — **Soulbound**',
].join('\n');

const REPUTATION_TEXT = [
    '🌸 **Faithful Soul** — the default, everyone starts here',
    '🌙 **Moon Favorite** — earned through favor with the moon',
    '💞 **Beloved Companion** — reach a highest bond of 150+',
    '🎁 **Generous Spirit** — give 10+ blessings',
    '😈 **Heartbreaker** — 2+ divorces',
    '💔 **Serial Divorcee** — 5+ divorces',
].join('\n');

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Learn how Moon Consort works and view all commands.');

export async function execute(interaction) {
    const introEmbed = new EmbedBuilder()
        .setColor(0x9b8cff)
        .setTitle('🌙 How Moon Consort Works')
        .setDescription(
            'Moon Consort is a relationship roleplay bot. Interact with others to build a **bond score** — ' +
            'the higher it climbs, the more commands unlock between you two. Some actions raise your bond, ' +
            'some lower it, and a few (like `/slap` or `/steal`) are pure chaos with real risk.'
        )
        .addFields(
            { name: '💞 Bond Levels', value: BOND_LEVELS_TEXT, inline: true },
            {
                name: '🦋 Butterflies',
                value: 'Collect 5 kinds — ⚪ White, 🩷 Pink, ⚫ Black, 🩶 Silver, 🟡 Gold — by chance through ' +
                       'interactions, or send/steal them with others.',
                inline: true,
            },
            {
                name: '💍 Marriages & Family',
                value: '`/propose` to marry someone (needs Close bond, max 10 spouses at once). ' +
                       '`/adopt` to bring someone into your family as a child.',
                inline: false,
            },
            {
                name: '🎖️ Reputation',
                value: REPUTATION_TEXT,
                inline: false,
            },
            {
                name: '📜 Memories & Vows',
                value: 'The moon remembers milestones — first kiss, first marriage, first child, first ' +
                       'blessing, and your highest ever bond. Write a personal `/vow` that shows on your profile.',
                inline: false,
            },
            {
                name: '✨ Random Events',
                value: 'A small chance triggers on affectionate actions — extra surprises from the moon itself.',
                inline: false,
            }
        )
        .setFooter({ text: 'Full command list below 👇' });

    const commandsEmbed = new EmbedBuilder()
        .setColor(0x9b8cff)
        .setTitle('🌙 Moon Consort — Commands')
        .setFooter({ text: `${CATEGORIES.reduce((n, c) => n + c.commands.length, 0)} commands total` });

    for (const category of CATEGORIES) {
        const lines = category.commands
            .map(([name, desc]) => `**/${name}** — ${desc}`)
            .join('\n');
        commandsEmbed.addFields({ name: category.name, value: lines, inline: false });
    }

    await interaction.reply({ embeds: [introEmbed, commandsEmbed], ephemeral: true });
}
