import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { stealButterfly } from '../../database/queries/butterflies.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Attempt to steal a butterfly.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot steal from yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 61) {
        return interaction.reply({ content: pick(replies.steal.failure)(sender), ephemeral: true });
    }

    const result = await stealButterfly(target, sender, guildId);

    if (result.empty) {
        return interaction.reply({ content: pick(replies.steal.failEmpty)(sender, target) });
    }

    if (!result.success) {
        await updateBond(sender, target, guildId, -3);
        await incrementField(sender, guildId, 'mischief_count');
        return interaction.reply({ content: pick(replies.steal.failRoll)(sender, target) });
    }

    await updateBond(sender, target, guildId, -3);
    await incrementField(sender, guildId, 'mischief_count');
    await interaction.reply({ content: pick(replies.steal.success)(sender, target) });
}
