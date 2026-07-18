import { Client, GatewayIntentBits, Collection } from 'discord.js';
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

client.once('ready', async () => {
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
    await ensureMilestonesTable();
    await ensureFestivalTable();

    await registerCommands(client);

    // Full Moon Festival check — runs once on startup per day
    if (isFullMoon()) {
        for (const guild of client.guilds.cache.values()) {
            const alreadyRan = await festivalRanToday(guild.id);
            if (alreadyRan) continue;

            const count = await distributeFestivalRewards(guild.id);
            await markFestivalRan(guild.id);

            // Announce in first available text channel
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
