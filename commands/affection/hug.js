import { SlashCommandBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';

export const data = new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({ embeds: [buildEmbed('affection', '🌙 You cannot do this to yourself.')], ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const row = buildYesNoRow('hug', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(replies.prompts['hug'])(sender, target.id), { title: '...' })],
        components: [row],
    });
    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}
