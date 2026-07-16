import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser, updateHighestBond } from '../../database/queries/users.js';
import { updateBond } from '../../database/queries/bonds.js';
import { hasConfessed, createConfession, checkMutual, markRevealed, deleteConfession } from '../../database/queries/confessions.js';
import { createLetter } from '../../database/queries/letters.js';
import { buildEmbed } from '../../utils/embeds.js';
import { getDailyMood, getMoodColor, getMoodFooter } from '../../utils/mood.js';

export const data = new SlashCommandBuilder()
    .setName('confess')
    .setDescription('Send an anonymous confession to someone.')
    .addSubcommand(sub =>
        sub.setName('send')
            .setDescription('Send an anonymous confession.')
            .addUserOption(o => o.setName('user').setDescription('Who to confess to').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('reset')
            .setDescription('Reset a stuck confession so you can try again.')
            .addUserOption(o => o.setName('user').setDescription('Who you confessed to').setRequired(true))
    );

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'reset') return resetConfess(interaction);
    return sendConfess(interaction);
}

async function resetConfess(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    await deleteConfession(sender, target.id, guildId);

    await interaction.reply({
        embeds: [buildEmbed('affection', `🌙 Your confession to <@${target.id}> has been cleared. You can send it again now.`)],
        ephemeral: true,
    });
}

async function sendConfess(interaction) {
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
        embeds: [buildEmbed('affection',
            `🌙 You have already sent a confession to <@${target.id}>.\n\nUse \`/confess reset\` if you need to start over.`
        )],
    });

    await createConfession(sender, target.id, guildId);

    const mutual = await checkMutual(sender, target.id, guildId);
    const mood = await getDailyMood(guildId);

    if (mutual) {
        await markRevealed(sender, target.id, guildId);
        const newScore = await updateBond(sender, target.id, guildId, 10);
        await updateHighestBond(sender, guildId, newScore);
        await updateHighestBond(target.id, guildId, newScore);

        // Send letter to target using sender's ID (valid user ID)
        await createLetter(sender, target.id, guildId,
            `💞 The moon kept both your secrets long enough. You confessed to <@${sender}> — and they confessed to you. It was mutual all along. Bond +10.`
        );
        // Send letter to sender
        await createLetter(target.id, sender, guildId,
            `💞 The moon kept both your secrets long enough. You confessed to <@${target.id}> — and they confessed to you. It was mutual all along. Bond +10.`
        );

        await interaction.editReply({
            embeds: [new EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle('💞 A Mutual Confession')
                .setDescription(`The moon has kept both your secrets long enough.\n\n<@${target.id}> also confessed to you.\n\nYou'll both find the full reveal in your \`/letter inbox\`.\n\n✨ Bond +10`)
                .setFooter({ text: getMoodFooter(mood) })],
        });

        return;
    }

    // Not mutual — drop anonymous letter in target's inbox
    // Use sender's ID as sender so the letter table is happy, but content stays anonymous
    await createLetter(sender, target.id, guildId,
        `💌 Someone has a confession for you. The moon will not say who.\n\nIf you feel something for someone, use \`/confess send\` — if it's mutual, the moon will reveal you both.`
    );

    await interaction.editReply({
        embeds: [buildEmbed('affection',
            `💌 Your confession has been sealed and placed in <@${target.id}>'s \`/letter inbox\`. They'll find it when they check.\n\nThe moon will keep your secret — until the stars decide otherwise.`,
            { title: '💌 Confession Sent' }
        )],
    });
}
