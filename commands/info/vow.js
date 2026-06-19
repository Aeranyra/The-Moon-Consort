import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import pool from '../../database/index.js';

export const data = new SlashCommandBuilder()
    .setName('vow')
    .setDescription('Write or view your personal vow.')
    .addSubcommand(s => s.setName('write').setDescription('Write your vow.')
        .addStringOption(o => o.setName('text').setDescription('Your vow').setRequired(true)))
    .addSubcommand(s => s.setName('view').setDescription('Read your vow.'));

export async function execute(interaction) {
    const sub    = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    if (sub === 'write') {
        const text = interaction.options.getString('text');
        await pool.query(
            `INSERT INTO vows (user_id, guild_id, content, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id, guild_id)
             DO UPDATE SET content=$3, updated_at=NOW()`,
            [userId, guildId, text]
        );
        return interaction.reply({ content: `📜 Your vow has been recorded by the moon.`, ephemeral: true });
    }

    const res = await pool.query(
        'SELECT content FROM vows WHERE user_id=$1 AND guild_id=$2',
        [userId, guildId]
    );
    if (!res.rows[0]?.content) {
        return interaction.reply({ content: '📜 You have written no vow yet.', ephemeral: true });
    }
    await interaction.reply({ content: `📜 **Your Vow:**\n${res.rows[0].content}`, ephemeral: true });
}
