import { SlashCommandBuilder } from 'discord.js';
import { updateBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('poke')
    .setDescription('Poke someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot poke yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    await updateBond(sender, target, guildId, 1);
    await interaction.reply({ content: pick(replies.poke.success)(sender, target) });
}
