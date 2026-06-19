import { SlashCommandBuilder } from 'discord.js';
import { getMarriages } from '../../database/queries/marriages.js';
import pool from '../../database/index.js';

export const data = new SlashCommandBuilder()
    .setName('family')
    .setDescription('View your family tree.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const marriages = await getMarriages(userId, guildId);
    const spouses = marriages.map(m => m.user1_id === userId ? m.user2_id : m.user1_id);

    const childrenRes = await pool.query(
        'SELECT child_id FROM family WHERE parent_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    const parentsRes = await pool.query(
        'SELECT parent_id FROM family WHERE child_id=$1 AND guild_id=$2',
        [userId, guildId]
    );

    const children = childrenRes.rows.map(r => `<@${r.child_id}>`);
    const parents  = parentsRes.rows.map(r => `<@${r.parent_id}>`);
    const spouseList = spouses.map(id => `<@${id}>`);

    const lines = [
        `🌙 **${interaction.user.username}'s Family**`,
        `💍 **Spouses:** ${spouseList.length ? spouseList.join(', ') : 'None'}`,
        `👨‍👩‍👦 **Parents:** ${parents.length ? parents.join(', ') : 'None'}`,
        `👶 **Children:** ${children.length ? children.join(', ') : 'None'}`,
    ];

    await interaction.reply({ content: lines.join('\n'), ephemeral: true });
}
