import { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import http from 'http';
import { registerCommands } from './events/ready.js';
import { handleInteraction } from './events/interactionCreate.js';
import { ensureLetterTable } from './database/queries/letters.js';
import { ensurePetTable } from './database/queries/pets.js';
import { ensureFortuneTable } from './database/queries/fortune.js';
import { ensureConfessionTable } from './database/queries/confessions.js';
import { ensureLoreTable } from './database/queries/lore.js';
import { ensureMoodTable } from './utils/mood.js';
import { ensureMilestoneTable } from './utils/milestones.js';
import { ensureGatherTable } from './database/queries/gather.js';
import { ensureDailyTable } from './database/queries/daily.js';
import { ensureFestivalTable, isFullMoon, festivalRanToday, markFestivalRan, distributeFestivalRewards } from './utils/festival.js';
import { findChannelByName } from './utils/channelMatch.js';
import { getLastPostedVersion, setLastPostedVersion } from './utils/changelogStore.js';
import { BOT_NAME, EMBED_COLOR, VERSION_LABEL, NOTES, CATEGORY_LABELS, FRONT_DESK_CHANNEL_NAME } from './config/changelog.js';
dotenv.config();

// Tiny web server so Render's free tier sees this as "alive"
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

client.commands = new Collection();

// ── Front-Desk: startup announcement ─────────────────────────────────────
async function postFrontDeskUpdate(readyClient) {
    const hasAnyNotes = Object.values(NOTES).some(list => Array.isArray(list) && list.length > 0);

    for (const guild of readyClient.guilds.cache.values()) {
        try {
            const channel = findChannelByName(guild, FRONT_DESK_CHANNEL_NAME);
            if (!channel) continue;

            const botPerms = channel.permissionsFor(readyClient.user);
            if (!botPerms?.has(PermissionFlagsBits.SendMessages) || !botPerms?.has(PermissionFlagsBits.ViewChannel)) continue;

            const embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setTitle(`✅ ${BOT_NAME} is back online`)
                .setDescription(`Systems restored and ready in **${guild.name}**.`)
                .setTimestamp();

            const alreadyPosted = getLastPostedVersion(guild.id) === VERSION_LABEL;

            if (hasAnyNotes && !alreadyPosted) {
                embed.addFields({ name: `📋 What's New — ${VERSION_LABEL}`, value: '\u200b' });
                for (const [key, label] of Object.entries(CATEGORY_LABELS)) {
                    const items = NOTES[key];
                    if (!items?.length) continue;
                    embed.addFields({ name: label, value: items.map(n => `• ${n}`).join('\n') });
                }
            }

            await channel.send({ embeds: [embed] });
            if (!alreadyPosted) setLastPostedVersion(guild.id, VERSION_LABEL);

        } catch (err) {
            console.error(`[FrontDesk] Startup post failed in "${guild.name}":`, err.message);
        }
    }
}

// ── Front-Desk: shutdown announcement ────────────────────────────────────
async function postFrontDeskShutdown() {
    if (!client.user) return;

    for (const guild of client.guilds.cache.values()) {
        try {
            const channel = findChannelByName(guild, FRONT_DESK_CHANNEL_NAME);
            if (!channel) continue;

            const botPerms = channel.permissionsFor(client.user);
            if (!botPerms?.has(PermissionFlagsBits.SendMessages) || !botPerms?.has(PermissionFlagsBits.ViewChannel)) continue;

            await channel.send({
                embeds: [new EmbedBuilder()
                    .setColor(EMBED_COLOR)
                    .setTitle(`🔧 ${BOT_NAME} is stepping away for maintenance`)
                    .setDescription(`Restarting to apply updates in **${guild.name}** — back shortly.`)
                    .setTimestamp()],
            });
        } catch (err) {
            console.error(`[FrontDesk] Shutdown post failed in "${guild.name}":`, err.message);
        }
    }
}

let isShuttingDown = false;
async function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`[Shutdown] ${signal} received — posting maintenance notice.`);
    await Promise.race([
        postFrontDeskShutdown().catch(err => console.error('[Shutdown] Error:', err)),
        new Promise(resolve => setTimeout(resolve, 8000)),
    ]);
    process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

// ── Bot startup ───────────────────────────────────────────────────────────
client.once('ready', async (readyClient) => {
    console.log(`🌙 ${client.user.tag} is online.`);

    // Self-migrating tables
    await ensureLetterTable();
    await ensurePetTable();
    await ensureFortuneTable();
    await ensureConfessionTable();
    await ensureLoreTable();
    await ensureMoodTable();
    await ensureMilestoneTable();
    await ensureGatherTable();
    await ensureDailyTable();
    await ensureFestivalTable();

    await registerCommands(client);

    // Front-Desk startup post
    await postFrontDeskUpdate(readyClient);

    // Full Moon Festival check
    if (isFullMoon()) {
        for (const guild of client.guilds.cache.values()) {
            const alreadyRan = await festivalRanToday(guild.id);
            if (alreadyRan) continue;

            const count = await distributeFestivalRewards(guild.id);
            await markFestivalRan(guild.id);

            const channel = guild.channels.cache.find(
                c => c.isTextBased() && c.permissionsFor(guild.members.me)?.has('SendMessages')
            );
            if (channel) {
                await channel.send({
                    embeds: [{
                        color: 0xFFD700,
                        title: '🌕 Full Moon Festival',
                        description: `The moon is full tonight.\n\n✨ All ${count} active members have received:\n🦋 2 White Butterflies\n🌸 1 Blessing\n🌙 1 Moon Fragment\n\nThe Moon Consort is watching. And celebrating.`,
                        footer: { text: '🌙 Moon Consort • Full Moon Festival' },
                    }],
                }).catch(() => {});
            }
            console.log(`🌕 Full Moon Festival ran in ${guild.name}`);
        }
    }
});

client.on('interactionCreate', handleInteraction);
client.login(process.env.DISCORD_TOKEN);
