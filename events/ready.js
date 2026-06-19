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
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );
    console.log(`✅ Registered ${commands.length} slash commands.`);
}
