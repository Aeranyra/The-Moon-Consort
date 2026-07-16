import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser, updateHighestBond } from '../../database/queries/users.js';
import { updateBond } from '../../database/queries/bonds.js';
import { hasConfessed, createConfession, checkMutual, markRevealed } from '../../database/queries/confessions.js';
import { buildEmbed } from '../../utils/embeds.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('confess')
    .setDescription('Send an anonymous confession to someone.')
    .addUserOption(o => o.setName('user').setDescription('Who to confess to').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 You cannot confess to yourself. The moon has seen everything already.')],
        ephemeral: true,
    });

    if (target.bot) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 Bots do not receive confessions. Not yet.')],
        ephemeral: true,
    });

    await interaction.deferReply({ ephemeral: true });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const already = await hasConfessed(sender, target.id, guildId);
    if (already) return interaction.editReply({
        embeds: [buildEmbed('affection', '🌙 You have already sent your confession. The moon is keeping it safe.')],
    });

    await createConfession(sender, target.id, guildId);

    const mutual = await checkMutual(sender, target.id, guildId);
    const mood = await getDailyMood(guildId);

    if (mutual) {
        // Both confessed — reveal publicly
        await markRevealed(sender, target.id, guildId);
        const newScore = await updateBond(sender, target.id, guildId, 10);
        await updateHighestBond(sender, guildId, newScore);
        await updateHighestBond(target.id, guildId, newScore);

        const mutualEmbed = new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle('💞 A Mutual Confession')
            .setDescription(`The moon has kept both your secrets long enough.\n\n<@${sender}> and <@${target.id}> have confessed to each other.\n\n✨ Bond +10`)
            .setFooter({ text: getMoodFooter(mood) });

        // Tell the sender (ephemeral)
        await interaction.editReply({ embeds: [mutualEmbed] });

        // Post publicly in the channel
        await interaction.followUp({ embeds: [mutualEmbed], ephemeral: false });

        // Notify target in-server (ephemeral — only they can see it)
        await interaction.followUp({
            content: `<@${target.id}>`,
            embeds: [new EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle('💞 A Mutual Confession')
                .setDescription(`<@${sender}> confessed to you — and you had already confessed to them.\n\nThe moon has revealed the secret. Bond +10.`)
                .setFooter({ text: getMoodFooter(mood) })],
            ephemeral: false,
        });

        return;
    }

    // Not mutual yet — notify target with an ephemeral ping in this channel
    await interaction.followUp({
        content: `<@${target.id}>`,
        embeds: [new EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle('💌 A Sealed Confession')
            .setDescription(`Someone has confessed something to you.\n\nThe moon will not say who.\n\n*Use \`/confess\` on someone you feel something for — if it's mutual, the moon will reveal you both.*`)
            .setFooter({ text: getMoodFooter(mood) })],
        ephemeral: false,
    });

    // Confirm to sender
    await interaction.editReply({
        embeds: [buildEmbed('affection',
            '💌 Your confession has been sealed and carried by moonlight. The moon will keep your secret — until the stars decide otherwise.',
            { title: '💌 Confession Sent' }
        )],
    });
}
