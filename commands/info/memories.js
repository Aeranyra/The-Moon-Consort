import { SlashCommandBuilder } from 'discord.js';
import { getMemories } from '../../database/queries/memories.js';

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

    const memories = await getMemories(userId, guildId);
    if (!memories.length) {
        return interaction.reply({ content: '🌙 The moon holds no memories of you yet.', ephemeral: true });
    }

    const lines = memories.map(m => {
        const label = LABELS[m.event_type] ?? m.event_type;
        const with_ = m.related_user_id ? ` with <@${m.related_user_id}>` : '';
        const date  = new Date(m.occurred_at).toLocaleDateString();
        return `${label}${with_} — ${date}`;
    });

    await interaction.reply({
        content: `📜 **${interaction.user.username}'s Memories**\n${lines.join('\n')}`,
        ephemeral: true
    });
}
