import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { addMemory } from '../../database/queries/memories.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('adopt')
    .setDescription('Adopt someone as your child.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot adopt yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 61) {
        return interaction.reply({ content: pick(replies.adopt.failure)(sender), ephemeral: true });
    }

    const existing = await pool.query(
        'SELECT * FROM family WHERE parent_id=$1 AND child_id=$2 AND guild_id=$3',
        [sender, target, guildId]
    );
    if (existing.rows.length) {
        return interaction.reply({ content: '🌙 You have already adopted this person.', ephemeral: true });
    }

    await pool.query(
        'INSERT INTO family (parent_id, child_id, guild_id) VALUES ($1, $2, $3)',
        [sender, target, guildId]
    );
    await addMemory(sender, guildId, 'first_child', target);

    await interaction.reply({ content: pick(replies.adopt.success)(sender, target) });
}
