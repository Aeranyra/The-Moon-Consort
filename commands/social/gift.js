import { SlashCommandBuilder } from 'discord.js';
import { updateBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import pool from '../../database/index.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { GIFT_TYPES } from '../../utils/constants.js';
import { rollRandomEvent, getRandomEventMessage } from '../../utils/randomEvent.js';

export const data = new SlashCommandBuilder()
    .setName('gift')
    .setDescription('Give someone a gift.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) return interaction.reply({ content: '🌙 You cannot gift yourself.', ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const giftType = pick(GIFT_TYPES);
    await updateBond(sender, target, guildId, 5);

    await pool.query(
        `INSERT INTO gifts (user_id, guild_id, gifts_given, last_gift)
         VALUES ($1, $2, 1, $3)
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET gifts_given = gifts.gifts_given + 1, last_gift = $3`,
        [sender, guildId, giftType]
    );
    await pool.query(
        `INSERT INTO gifts (user_id, guild_id, gifts_received)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, guild_id)
         DO UPDATE SET gifts_received = gifts.gifts_received + 1`,
        [target, guildId]
    );

    const event = rollRandomEvent();
    const eventMsg = event ? '\n' + getRandomEventMessage(event, sender) : '';

    await interaction.reply({ content: pick(replies.gift.success)(sender, target, giftType) + eventMsg });
}
