import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import http from 'http';
import { registerCommands } from './events/ready.js';
import { handleInteraction } from './events/interactionCreate.js';
import { ensureLetterTable } from './database/queries/letters.js';
import { ensurePetTable } from './database/queries/pets.js';
import { ensureFortuneTable } from './database/queries/fortune.js';
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
    await ensureLetterTable();
    await ensurePetTable();
    await ensureFortuneTable();
    await registerCommands(client);
});

client.on('interactionCreate', handleInteraction);

client.login(process.env.DISCORD_TOKEN);
