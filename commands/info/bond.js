import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { getBondLevel } from '../../utils/bondLevel.js';

export const data = new SlashCommandBuilder()
    .setName('bond')
    .setDescription('Check bond level with someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    const score = await getBond(sender, target, guildId);
    const level = getBondLevel(score);

    await interaction.reply({
        content: `💞 **Bond with <@${target}>**\nScore: ${score} — ${level.label}`,
        ephemeral: true
    });
}
