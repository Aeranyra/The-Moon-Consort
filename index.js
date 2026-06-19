import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import { registerCommands } from './events/ready.js';
import { handleInteraction } from './events/interactionCreate.js';
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

client.commands = new Collection();

client.once('ready', async () => {
    console.log(`🌙 ${client.user.tag} is online.`);
    await registerCommands(client);
});

client.on('interactionCreate', handleInteraction);

client.login(process.env.DISCORD_TOKEN);
