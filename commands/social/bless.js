import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { addMemory } from '../../database/queries/memories.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
    .setName('bless')
    .setDescription('Bestow a moonlight blessing. 24h cooldown.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot bless yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 31) {
        return interaction.reply({ content: pick(replies.bless.failure)(sender), ephemeral: true });
    }

    const res = await pool.query(
        'SELECT last_blessed_at FROM blessings WHERE user_id=$1 AND guild_id=$2',
        [sender, guildId]
    );
    if (res.rows[0]?.last_blessed_at) {
        const diff = Date.now() - new Date(res.rows[0].last_blessed_at).getTime();
        if (diff < COOLDOWN_MS) {
            return interaction.reply({ content: pick(replies.bless.cooldown)(sender), ephemeral: true });
        }
    }

    await updateBond(sender, target, guildId, 10);
    await pool.query(
        `INSERT INTO blessings (user_id, guild_id, blessings_given, last_blessed_at)
         VALUES ($1, $2, 1, NOW())
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET blessings_given = blessings.blessings_given + 1, last_blessed_at = NOW()`,
        [sender, guildId]
    );
    await pool.query(
        `INSERT INTO blessings (user_id, guild_id, blessings_received)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET blessings_received = blessings.blessings_received + 1`,
        [target, guildId]
    );

    await addMemory(sender, guildId, 'first_blessing', target);

    await interaction.reply({ content: pick(replies.bless.success)(sender, target) });
}
