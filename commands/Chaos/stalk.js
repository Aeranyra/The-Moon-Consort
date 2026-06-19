import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

export const data = new SlashCommandBuilder()
    .setName('stalk')
    .setDescription("Reveal someone's last interaction partner.")
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot stalk yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 61) {
        return interaction.reply({ content: pick(replies.stalk.failure)(sender), ephemeral: true });
    }

    // Find last bond update involving target
    const res = await pool.query(
        `SELECT * FROM bonds
         WHERE (user1_id=$1 OR user2_id=$1) AND guild_id=$2
         ORDER BY updated_at DESC LIMIT 1`,
        [target, guildId]
    );

    if (!res.rows.length) {
        return interaction.reply({ content: pick(replies.stalk.noData)(sender, target) });
    }

    const bond = res.rows[0];
    const lastSeen = bond.user1_id === target ? bond.user2_id : bond.user1_id;

    await interaction.reply({ content: pick(replies.stalk.success)(sender, target, lastSeen) });
}
