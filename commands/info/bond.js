import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { getBondLevel } from '../../utils/bondLevel.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('bond')
    .setDescription('Check bond level with someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    const score = await getBond(sender, target.id, guildId);
    const level = getBondLevel(score);
    const mood = await getDailyMood(guildId);

    const filled = Math.min(10, Math.floor(score / 10));
    const bar = '💞'.repeat(filled) + '🖤'.repeat(10 - filled);

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`💞 Bond with ${target.username}`)
            .setDescription(`${bar}\n\n**Score:** ${score} — ${level.label}`)
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });
}
