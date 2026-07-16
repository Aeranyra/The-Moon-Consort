import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

const CATEGORIES = [
    {
        name: '💞 Affection',
        commands: [
            ['comfort',     'Comfort someone.'],
            ['cuddle',      'Cuddle someone. Needs Friend bond (11+).'],
            ['drink share', 'Share a moonlit drink with someone.'],
            ['drink force', 'Force a drink on someone. Needs Close bond (31+).'],
            ['eat share',   'Share a meal with someone.'],
            ['eat force',   'Force-feed someone. Needs Close bond (31+).'],
            ['hug',         'Hug someone.'],
            ['kiss',        'Kiss someone. Needs Friend bond (11+).'],
            ['pat',         'Pat someone.'],
            ['snuggle',     'Snuggle someone. Needs Friend bond (11+).'],
            ['tease',       'Tease someone. Needs Friend bond (11+).'],
        ],
    },
    {
        name: '😈 Chaos',
        commands: [
            ['banish',    'Banish someone to the Shadow Realm. Needs Close bond (31+).'],
            ['bonk',      'Bonk someone. Needs Close bond (31+).'],
            ['challenge', 'Start a staring contest. Needs Cherished bond (61+).'],
            ['choke',     'Dramatically choke someone. Needs Close bond (31+).'],
            ['haunt',     'Haunt someone. Needs Friend bond (11+).'],
            ['ignore',    'Ignore someone coldly. Needs Friend bond (11+). Lowers bond.'],
            ['poke',      'Poke someone. Always available.'],
            ['punish',    'Sentence someone to the Corner of Shame. Needs Close bond (31+).'],
            ['slap',      'Slap someone. Needs Close bond (31+). Lowers bond.'],
            ['spank',     'Spank someone. Needs Close bond (31+).'],
            ['stalk',     'Dig up intel on someone. Needs Friend bond (11+).'],
            ['steal',     'Steal a butterfly. Needs Cherished bond (61+). Risky.'],
            ['step',      'Step on someone. Needs Close bond (31+). Lowers bond.'],
            ['yeet',      'Yeet someone into the void. Needs Close bond (31+).'],
        ],
    },
    {
        name: '👨‍👩‍👦 Family',
        commands: [
            ['adopt',  'Adopt someone as your child. Needs Cherished bond (61+).'],
            ['family', 'View your family tree.'],
        ],
    },
    {
        name: '🎭 Fun',
        commands: [
            ['8ball',   'Ask the moon a yes-or-no question.'],
            ['confess', 'Send an anonymous confession. Revealed only if both confess to each other.'],
            ['fortune', 'Daily moon fortune. May reward a butterfly or blessing.'],
            ['roast',   'Roast someone lovingly.'],
            ['ship',    'Calculate compatibility between two people.'],
        ],
    },
    {
        name: '📜 Info',
        commands: [
            ['bond',        'Check your bond level with someone.'],
            ['butterflies', 'View your butterfly collection.'],
            ['lore',        'Read the lore book. 22 entries unlock as bonds deepen.'],
            ['memories',    'View your moon memories.'],
            ['mood',        'Check the Moon Consort mood today.'],
            ['profile',     'View your profile. Optional: @user to view others.'],
            ['reputation',  'Check your reputation title.'],
            ['vow',         'Write or view your personal vow.'],
        ],
    },
    {
        name: '💍 Relationships',
        commands: [
            ['accept',    'Accept a pending marriage proposal.'],
            ['decline',   'Decline a pending proposal.'],
            ['divorce',   'End a marriage. Lowers bond by 25.'],
            ['marriages', 'View your current marriages.'],
            ['propose',   'Send a proposal. Needs Close bond (31+). Max 10 marriages.'],
        ],
    },
    {
        name: '🎁 Social',
        commands: [
            ['bless',     'Bestow a blessing. Needs Close bond (31+). 24h cooldown.'],
            ['butterfly', 'Send a butterfly. Needs Close bond (31+).'],
            ['gift',      'Give someone a random gift.'],
        ],
    },
    {
        name: '🐾 Pets',
        commands: [
            ['pet adopt', 'Adopt a random moonlit pet.'],
            ['pet feed',  'Feed your pet. 1h cooldown.'],
            ['pet play',  'Play with your pet. May find a butterfly. 2h cooldown.'],
            ['pet view',  'View your pet stats.'],
        ],
    },
    {
        name: '💌 Letters',
        commands: [
            ['letter send',  'Send an anonymous sealed letter.'],
            ['letter inbox', 'Read your unread letters.'],
            ['letter burn',  'Destroy a letter forever.'],
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
    '🌸 **Faithful Soul** — everyone starts here',
    '🌙 **Moon Favorite** — earned through moon favor',
    '💞 **Beloved Companion** — highest bond 150+',
    '🎁 **Generous Spirit** — 10+ blessings given',
    '😈 **Heartbreaker** — 2+ divorces',
    '💔 **Serial Divorcee** — 5+ divorces',
].join('\n');

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Learn how Moon Consort works and view all commands.');

export async function execute(interaction) {
    const guildId = interaction.guildId;
    const mood = await getDailyMood(guildId);
    const color = getMoodColor(mood);
    const footer = getMoodFooter(mood);

    const introEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🌙 How Moon Consort Works')
        .setDescription(
            'Moon Consort is a relationship roleplay bot. Interact with others to build a **bond score** — ' +
            'the higher it climbs, the more commands unlock.\n\n' +
            '💞 **Affection commands** show Accept/Decline buttons — the target must respond first.\n' +
            '😈 **Chaos commands** are instant — 15% chance to backfire on the sender.\n' +
            '🌕 **Full Moon Festival** auto-triggers on real full moon dates for everyone.'
        )
        .addFields(
            { name: '💞 Bond Levels', value: BOND_LEVELS_TEXT, inline: true },
            {
                name: '🦋 Butterflies',
                value: '5 tiers: ⚪ White → 🩷 Pink → ⚫ Black → 🩶 Silver → 🟡 Gold.\n' +
                       'Earn through interactions, `/fortune`, `/pet play`, or Full Moon Festival.',
                inline: true,
            },
            {
                name: '🌙 Mood System',
                value: '8 daily moods — each changes the embed color and footer. Check with `/mood`.',
                inline: false,
            },
            {
                name: '📚 Lore Book',
                value: '22 moon stories that unlock based on your bond score + actions. Use `/lore`.',
                inline: false,
            },
            {
                name: '💌 Confessions & Letters',
                value: '`/confess` sends an anonymous confession — revealed only if both confess to each other.\n`/letter send` sends an anonymous sealed letter.',
                inline: false,
            },
            {
                name: '🎖️ Reputation',
                value: REPUTATION_TEXT,
                inline: false,
            },
        )
        .setFooter({ text: `${footer} • Command list below 👇` });

    const totalCmds = CATEGORIES.reduce((n, c) => n + c.commands.length, 0);

    const commandsEmbed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🌙 Moon Consort — All Commands')
        .setFooter({ text: `${totalCmds} commands total • ${footer}` });

    for (const category of CATEGORIES) {
        const lines = category.commands
            .map(([name, desc]) => `**/${name}** — ${desc}`)
            .join('\n');
        commandsEmbed.addFields({ name: category.name, value: lines, inline: false });
    }

    await interaction.reply({ embeds: [introEmbed, commandsEmbed], ephemeral: true });
}
