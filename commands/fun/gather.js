import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { addButterfly } from '../../database/queries/butterflies.js';
import { awardMilestone } from '../../utils/milestones.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

const OUTCOMES = [
    { type: 'white', chance: 0.45, emoji: '⚪', text: [
        (s) => `🌙 <@${s}> searches the moonlit garden and finds a white butterfly resting on a stone.`,
        (s) => `✨ <@${s}> follows a trail of silver light and catches a white butterfly mid-flight.`,
        (s) => `🌸 A white butterfly lands on <@${s}>'s hand as if it were waiting.`,
    ]},
    { type: 'pink', chance: 0.15, emoji: '🩷', text: [
        (s) => `🌙 <@${s}> ventures deeper into the garden and discovers a rare pink butterfly among the night flowers.`,
        (s) => `✨ The moon guides <@${s}>'s eyes to a pink butterfly hidden in the shadows.`,
    ]},
    { type: null, chance: 0.40, emoji: '🌑', text: [
        (s) => `🌙 <@${s}> searches the moonlit garden... and finds only silence tonight.`,
        (s) => `✨ The butterflies are hiding from <@${s}> tonight. Try again later.`,
        (s) => `🌑 <@${s}> wanders the garden paths and returns empty-handed. The moon offers no apology.`,
    ]},
];

export const data = new SlashCommandBuilder()
    .setName('gather')
    .setDescription('Search the moonlit garden for butterflies.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    await ensureUser(userId, guildId);

    // Roll outcome
    const roll = Math.random();
    let cumulative = 0;
    let outcome = OUTCOMES[OUTCOMES.length - 1];
    for (const o of OUTCOMES) {
        cumulative += o.chance;
        if (roll < cumulative) { outcome = o; break; }
    }

    if (outcome.type) {
        await addButterfly(userId, guildId, outcome.type);
    }

    const milestoneGot = await awardMilestone(userId, guildId, 'first_gather', 1);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const text = pick(outcome.text)(userId);
    const bonus = outcome.type ? `\n\n${outcome.emoji} **+1 ${outcome.type} butterfly**` : '';
    const milestone = milestoneGot ? '\n\n🦋 First gather milestone! +1 bonus butterfly' : '';

    const mood = await getDailyMood(guildId);
    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle('🌿 Moonlit Garden')
            .setDescription(text + bonus + milestone)
            .setFooter({ text: getMoodFooter(mood) })],
    });
}
