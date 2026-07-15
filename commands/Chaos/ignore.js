import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';

export const data = new SlashCommandBuilder()
    .setName('ignore')
    .setDescription('ignore someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({ embeds: [buildEmbed('chaos', '🌙 You cannot do this to yourself.')], ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    const failKey = replies['ignore']?.failure;
    const threshold = { slap:31, step:31, poke:0, yeet:31, bonk:31, banish:31, haunt:11, ignore:11, stalk:11 }['ignore'] ?? 0;

    if (threshold > 0 && score < threshold) {
        return interaction.reply({ embeds: [buildEmbed('chaos', pick(failKey)(sender))], ephemeral: true });
    }

    const row = buildYesNoRow('ignore', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('chaos', `😈 <@${sender}> wants to ignore <@${target.id}>!`)],
        components: [row],
    });

    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}
