import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getMemories } from '../../database/queries/memories.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

const LABELS = {
    first_kiss:       '💋 First Kiss',
    first_marriage:   '💍 First Marriage',
    first_child:      '👶 First Child',
    first_blessing:   '🌸 First Blessing',
    longest_marriage: '🏅 Longest Marriage',
    highest_bond:     '💞 Highest Bond',
};

export const data = new SlashCommandBuilder()
    .setName('memories')
    .setDescription('View your moon memories.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const mood = await getDailyMood(guildId);

    const memories = await getMemories(userId, guildId);
    if (!memories.length) return interaction.reply({
        embeds: [new EmbedBuilder().setColor(getMoodColor(mood)).setTitle('📜 Moon Memories').setDescription('🌙 The moon holds no memories of you yet.').setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });

    const fields = memories.map(m => ({
        name: LABELS[m.event_type] ?? m.event_type,
        value: `${m.related_user_id ? `with <@${m.related_user_id}>` : ''} ${new Date(m.occurred_at).toLocaleDateString()}`.trim(),
        inline: true,
    }));

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(`📜 ${interaction.user.username}'s Memories`)
            .addFields(fields)
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: true,
    });
}
