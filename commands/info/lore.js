import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser, getUser } from '../../database/queries/users.js';
import { getUnlockedLore, unlockLoreEntries, LORE_ENTRIES } from '../../database/queries/lore.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('lore')
    .setDescription('Read the Moon Consort\'s lore book. Entries unlock as your bonds deepen.');

export async function execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    await ensureUser(userId, guildId);
    const user = await getUser(userId, guildId);

    const highestBond = user.highest_bond ?? 0;
    const actionCount = (user.mischief_count ?? 0) + (user.haunt_count ?? 0);

    // Unlock any newly eligible entries
    await unlockLoreEntries(userId, guildId, highestBond, actionCount);

    const unlockedIds = await getUnlockedLore(userId, guildId);

    if (!unlockedIds.length) {
        const mood = await getDailyMood(guildId);
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle('📚 The Lore Book')
                .setDescription('🌙 *The pages are blank for now. Deepen your bonds and let the moon see more of you.*\n\nThe first entries unlock at bond score **11**.')
                .setFooter({ text: getMoodFooter(mood) })],
            ephemeral: true,
        });
    }

    // Pick a random unlocked entry
    const randomId = unlockedIds[Math.floor(Math.random() * unlockedIds.length)];
    const entry = LORE_ENTRIES.find(e => e.id === randomId);

    const mood = await getDailyMood(guildId);
    const totalEntries = LORE_ENTRIES.length;
    const nextLocked = LORE_ENTRIES.find(e => !unlockedIds.includes(e.id));

    const hint = nextLocked
        ? `*Next entry unlocks at bond **${nextLocked.bondRequired}** and **${nextLocked.actionsRequired}** actions.*`
        : `*You have unlocked all ${totalEntries} entries. The moon is impressed.*`;

    await interaction.reply({
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle(entry.title)
            .setDescription(entry.text)
            .addFields({ name: '\u200b', value: hint })
            .setFooter({ text: `${getMoodFooter(mood)} • Entry ${entry.id}/${totalEntries} • ${unlockedIds.length} unlocked` })],
    });
}
