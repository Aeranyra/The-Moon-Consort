import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';

export const data = new SlashCommandBuilder()
    .setName('sleep')
    .setDescription('Tuck someone in for the night.')
    .addUserOption(o => o.setName('user').setDescription('Who to tuck in').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 You can tuck yourself in. The moon won\'t judge.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const row = buildYesNoRow('sleep', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(replies.sleep.prompts)(sender, target.id), { title: '🌙 Bedtime?' })],
        components: [row],
    });
    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}
