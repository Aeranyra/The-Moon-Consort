import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';

const PROMPTS = [
    (s, t) => `💋 <@${s}> leans in toward <@${t}>... the moon holds its breath.`,
    (s, t) => `🌙 <@${s}> wants to kiss <@${t}>. Will they allow it?`,
    (s, t) => `✨ <@${s}> reaches for <@${t}>'s cheek. The stars await the answer.`,
];

export const data = new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Kiss someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 You cannot do this to yourself.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (score < 11) {
        return interaction.reply({
            embeds: [buildEmbed('affection', pick(replies.kiss.failure)(sender))],
            ephemeral: true,
        });
    }

    const row = buildYesNoRow('kiss', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(PROMPTS)(sender, target.id), { title: '💋 A Kiss?' })],
        components: [row],
    });

    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}
