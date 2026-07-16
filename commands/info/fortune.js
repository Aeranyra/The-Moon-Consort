import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { addButterfly } from '../../database/queries/butterflies.js';
import { getLastFortune, useFortune } from '../../database/queries/fortune.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

const COOLDOWN_MS = 24 * 60 * 60 * 1000;

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
            const mood = await getDailyMood(guildId);
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor(getMoodColor(mood)).setDescription(`🌙 *The moon has already spoken to you today. Return in ~${hours}h.*`).setFooter({ text: getMoodFooter(mood) })],
                ephemeral: true,
            });
        }
    }

    await useFortune(userId, guildId);
    const mood = await getDailyMood(guildId);
    const roll = Math.random();

    let text, title;
    if (roll < 0.10) {
        await incrementField(userId, guildId, 'blessings');
        text = pick(replies.fortune.blessing)(userId);
        title = '🌸 A Blessing';
    } else if (roll < 0.30) {
        await addButterfly(userId, guildId, 'white');
        text = pick(replies.fortune.butterfly)(userId);
        title = '🦋 A Gift';
    } else {
        text = pick(replies.fortune.nothing)(userId);
        title = '🌙 Your Fortune';
    }

    await interaction.reply({
        embeds: [new EmbedBuilder().setColor(getMoodColor(mood)).setTitle(title).setDescription(text).setFooter({ text: getMoodFooter(mood) })],
    });
}
