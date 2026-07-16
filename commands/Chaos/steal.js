import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { stealButterfly } from '../../database/queries/butterflies.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Attempt to steal a butterfly.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('chaos', '🌙 You cannot steal from yourself.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (score < 61) return interaction.reply({
        embeds: [buildEmbed('chaos', pick(replies.steal.failure)(sender))],
        ephemeral: true,
    });

    const result = await stealButterfly(target.id, sender, guildId);

    let text;
    if (result.empty) {
        text = pick(replies.steal.failEmpty)(sender, target.id);
    } else if (!result.success) {
        await updateBond(sender, target.id, guildId, -3);
        await incrementField(sender, guildId, 'mischief_count');
        text = pick(replies.steal.failRoll)(sender, target.id);
    } else {
        await updateBond(sender, target.id, guildId, -3);
        await incrementField(sender, guildId, 'mischief_count');
        text = pick(replies.steal.success)(sender, target.id);
    }

    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
