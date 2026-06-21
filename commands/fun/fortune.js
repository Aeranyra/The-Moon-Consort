import { SlashCommandBuilder } from 'discord.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { addButterfly } from '../../database/queries/butterflies.js';
import { getLastFortune, useFortune } from '../../database/queries/fortune.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Receive your daily moon fortune.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    await ensureUser(userId, guildId);

    const last = await getLastFortune(userId, guildId);
    if (last) {
        const remaining = COOLDOWN_MS - (Date.now() - new Date(last).getTime());
        if (remaining > 0) {
            const hours = Math.ceil(remaining / (60 * 60 * 1000));
            return interaction.reply({
                embeds: [buildEmbed('fortune', `🌙 *The moon has already spoken to you today. Return in ~${hours}h.*`)],
                ephemeral: true,
            });
        }
    }

    await useFortune(userId, guildId);

    const roll = Math.random();
    let text, title;
    if (roll < 0.10) {
        // 10% — blessing
        await incrementField(userId, guildId, 'blessings');
        text = pick(replies.fortune.blessing)(userId);
        title = '🌸 A Blessing';
    } else if (roll < 0.30) {
        // 20% — butterfly
        await addButterfly(userId, guildId, 'white');
        text = pick(replies.fortune.butterfly)(userId);
        title = '🦋 A Gift';
    } else {
        // 70% — nothing
        text = pick(replies.fortune.nothing)(userId);
        title = '🌙 Your Fortune';
    }

    await interaction.reply({
        embeds: [buildEmbed('fortune', text, { title })],
    });
}
