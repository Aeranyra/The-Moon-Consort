import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

export const data = new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Calculate cosmic compatibility between two people.')
    .addUserOption(o => o.setName('user1').setDescription('First user').setRequired(true))
    .addUserOption(o => o.setName('user2').setDescription('Second user').setRequired(true));

export async function execute(interaction) {
    const guildId = interaction.guildId;
    const u1 = interaction.options.getUser('user1');
    const u2 = interaction.options.getUser('user2');

    if (u1.id === u2.id) {
        return interaction.reply({
            embeds: [buildEmbed('fun', '🌙 Shipping someone with themselves is just self-love. Valid, but not what this command is for.')],
            ephemeral: true,
        });
    }

    await ensureUser(u1.id, guildId);
    await ensureUser(u2.id, guildId);

    const bond = await getBond(u1.id, u2.id, guildId);

    let percent;
    if (bond > 0) {
        // Nudge toward the real bond, with some randomness layered in
        const base = Math.min(95, bond * 2);
        percent = Math.max(0, Math.min(100, base + Math.floor(Math.random() * 21) - 10));
    } else {
        // No bond on record — fully random
        percent = Math.floor(Math.random() * 101);
    }

    const filled = Math.round(percent / 10);
    const bar = '💗'.repeat(filled) + '🖤'.repeat(10 - filled);
    const tier = percent >= 80 ? replies.ship.high : percent >= 40 ? replies.ship.mid : replies.ship.low;

    await interaction.reply({
        embeds: [buildEmbed('fun', `${bar}\n\n${pick(tier)(u1.id, u2.id)}`, {
            title: `💞 ${percent}% Compatible`,
        })],
    });
}
