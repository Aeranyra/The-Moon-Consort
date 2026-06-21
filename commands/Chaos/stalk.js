import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

const BOND_THRESHOLD = 11; // adjust if your original /stalk used a different value

export const data = new SlashCommandBuilder()
    .setName('stalk')
    .setDescription('The moon whispers secrets about someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) {
        return interaction.reply({
            embeds: [buildEmbed('chaos', '🌙 Stalking yourself is just called "having a mirror."')],
            ephemeral: true,
        });
    }

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < BOND_THRESHOLD) {
        return interaction.reply({
            embeds: [buildEmbed('chaos', pick(replies.stalk.failure)(sender))],
            ephemeral: true,
        });
    }

    // NOTE: simplified version. Your original /stalk likely pulled a real
    // "last seen with" fact from database/queries/memories.js, which I didn't
    // have access to. This version generates absurd fake "intel" instead of
    // real interaction history. Send me memories.js and I'll wire in the real one.
    const text = Math.random() < 0.8
        ? pick(replies.stalk.success)(sender, target)
        : pick(replies.stalk.noData)(sender, target);

    await interaction.reply({ embeds: [buildEmbed('chaos', text)], ephemeral: true });
}
