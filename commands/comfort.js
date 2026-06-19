import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, updateHighestBond } from '../../database/queries/users.js';
import { addMemory } from '../../database/queries/memories.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { rollRandomEvent, getRandomEventMessage } from '../../utils/randomEvent.js';

export const data = new SlashCommandBuilder()
    .setName('comfort')
    .setDescription('Comfort someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot do this to yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);

    

    const newScore = await updateBond(sender, target, guildId, 5);
    await updateHighestBond(sender, guildId, newScore);
    await updateHighestBond(target, guildId, newScore);

    

    const replyText = pick(replies.comfort.success)(sender, target);
    const event = rollRandomEvent();
    const eventMsg = event ? '\n' + getRandomEventMessage(event, sender) : '';

    await interaction.reply({ content: replyText + eventMsg });
}
