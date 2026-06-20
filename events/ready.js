import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function registerCommands(client) {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const folders = readdirSync(commandsPath);

    for (const folder of folders) {
        const files = readdirSync(path.join(commandsPath, folder)).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const filePath = path.join(commandsPath, folder, file);
            const command = await import(pathToFileURL(filePath).href);
            if (command.data && command.execute) {
                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);
            }
        }
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    // One-time cleanup: wipe any leftover GLOBAL commands from before we switched
    // to guild-scoped registration. Safe to leave this in permanently — clearing
    // an already-empty global command list is a harmless no-op.
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: [] }
    );
    console.log('🧹 Cleared old global commands.');

    if (process.env.GUILD_ID) {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log(`✅ Registered ${commands.length} slash commands to guild ${process.env.GUILD_ID}.`);
    } else {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log(`✅ Registered ${commands.length} slash commands globally.`);
    }
}
