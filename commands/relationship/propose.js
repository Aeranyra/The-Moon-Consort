import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { getMarriages, getProposal, createProposal } from '../../database/queries/marriages.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { MAX_MARRIAGES } from '../../utils/constants.js';

export const data = new SlashCommandBuilder()
    .setName('propose')
    .setDescription('Send a marriage proposal.')
    .addUserOption(o => o.setName('user').setDescription('Who to propose to').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot propose to yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 31) {
        return interaction.reply({ content: pick(replies.propose.failure)(sender), ephemeral: true });
    }

    const count = await getMarriages(sender, guildId);
    if (count.length >= MAX_MARRIAGES) {
        return interaction.reply({ content: `🌙 You have reached the maximum of ${MAX_MARRIAGES} marriages.`, ephemeral: true });
    }

    const existing = await getProposal(sender, target, guildId);
    if (existing) return interaction.reply({ content: '💌 You already have a pending proposal to this person.', ephemeral: true });

    await createProposal(sender, target, guildId);
    await interaction.reply({ content: pick(replies.propose.success)(sender, target) });
}
