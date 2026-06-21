import { SlashCommandBuilder } from 'discord.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the moon a yes-or-no question.')
    .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true));

export async function execute(interaction) {
    const question = interaction.options.getString('question');

    await interaction.reply({
        embeds: [buildEmbed('fun', pick(replies.eightball.answers)(), {
            title: `🎱 "${question}"`,
        })],
    });
}
