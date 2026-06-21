import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Roast someone. Lovingly. Mostly.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    await interaction.reply({
        embeds: [buildEmbed('fun', pick(replies.roast.lines)(target))],
    });
}
