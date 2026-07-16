import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { transferButterfly } from '../../database/queries/butterflies.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('butterfly')
    .setDescription('Send a butterfly from your collection.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ embeds: [buildEmbed('social', '🌙 You cannot send a butterfly to yourself.')], ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 31) return interaction.reply({ embeds: [buildEmbed('social', pick(replies.butterfly.failure)(sender))], ephemeral: true });

    const transferred = await transferButterfly(sender, target, guildId);
    if (!transferred) return interaction.reply({ embeds: [buildEmbed('social', pick(replies.butterfly.empty)(sender))], ephemeral: true });

    await interaction.reply({ embeds: [buildEmbed('social', pick(replies.butterfly.success)(sender, target))] });
}
