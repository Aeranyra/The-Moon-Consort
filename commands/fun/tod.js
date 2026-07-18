import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('tod')
    .setDescription('Truth or Dare — you pick.')
    .addUserOption(o => o.setName('user').setDescription('Who to challenge').setRequired(true))
    .addStringOption(o =>
        o.setName('choice')
            .setDescription('Truth or Dare?')
            .setRequired(true)
            .addChoices(
                { name: '🌙 Truth', value: 'truth' },
                { name: '😈 Dare', value: 'dare' }
            )
    );

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const choice = interaction.options.getString('choice');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        content: '🌙 You cannot challenge yourself. That\'s just called thinking.',
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const mood = await getDailyMood(guildId);

    if (choice === 'truth') {
        const truth = pick(replies.tod.truths)(target.id);
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle(`🌙 Truth — <@${sender}> challenges <@${target.id}>`)
                .setDescription(truth)
                .setFooter({ text: getMoodFooter(mood) })],
        });
    } else {
        const dare = pick(replies.dare.dares)(target.id);
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle(`😈 Dare — <@${sender}> challenges <@${target.id}>`)
                .setDescription(dare)
                .setFooter({ text: getMoodFooter(mood) })],
        });
    }
}
