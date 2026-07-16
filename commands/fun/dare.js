import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('dare')
    .setDescription('Dare someone to do something.')
    .addUserOption(o => o.setName('user').setDescription('Who to dare').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('fun', '🌙 You cannot dare yourself. That\'s just making decisions.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const dare = pick(replies.dare.dares)(target.id);

    await interaction.reply({
        embeds: [buildEmbed('fun', `<@${sender}> dares ${dare}`, { title: '😈 A Dare' })],
    });
}
