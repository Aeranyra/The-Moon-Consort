import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Start a staring contest. First to /yield loses.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot challenge yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 61) {
        return interaction.reply({ content: pick(replies.challenge.failure)(sender), ephemeral: true });
    }

    // Check for existing challenge
    const existing = await pool.query(
        `SELECT * FROM challenges
         WHERE ((challenger_id=$1 AND target_id=$2) OR (challenger_id=$2 AND target_id=$1))
         AND guild_id=$3`,
        [sender, target, guildId]
    );
    if (existing.rows.length) {
        return interaction.reply({ content: '👁️ A staring contest is already in progress.', ephemeral: true });
    }

    await pool.query(
        'INSERT INTO challenges (challenger_id, target_id, guild_id, channel_id) VALUES ($1,$2,$3,$4)',
        [sender, target, guildId, interaction.channelId]
    );

    await interaction.reply({ content: pick(replies.challenge.start)(sender, target) });
}
