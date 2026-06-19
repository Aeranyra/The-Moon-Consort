import { SlashCommandBuilder } from 'discord.js';
import { deleteMarriage, getMarriages } from '../../database/queries/marriages.js';
import { updateBond } from '../../database/queries/bonds.js';
import { incrementField } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('divorce')
    .setDescription('End a marriage.')
    .addUserOption(o => o.setName('user').setDescription('Who to divorce').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    const marriages = await getMarriages(sender, guildId);
    const isMarried = marriages.find(m =>
        (m.user1_id === sender && m.user2_id === target) ||
        (m.user1_id === target && m.user2_id === sender)
    );

    if (!isMarried) return interaction.reply({ content: '🌙 You are not married to this person.', ephemeral: true });

    await deleteMarriage(sender, target, guildId);
    await updateBond(sender, target, guildId, -25);
    await incrementField(sender, guildId, 'divorce_count');
    await incrementField(target, guildId, 'divorce_count');

    await interaction.reply({ content: pick(replies.divorce.success)(sender, target) });
}
