import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { ensureUser, updateHighestBond } from '../../database/queries/users.js';
import { updateBond } from '../../database/queries/bonds.js';
import { hasConfessed, createConfession, checkMutual, markRevealed } from '../../database/queries/confessions.js';
import { createLetter } from '../../database/queries/letters.js';
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
        // Both confessed — reveal to both via letter inbox
        await markRevealed(sender, target.id, guildId);
        const newScore = await updateBond(sender, target.id, guildId, 10);
        await updateHighestBond(sender, guildId, newScore);
        await updateHighestBond(target.id, guildId, newScore);

        // Send each a letter revealing the other
        await createLetter(
            'MOON_CONSORT', target.id, guildId,
            `💞 The moon has been keeping a secret. <@${sender}> confessed to you — and you confessed to them. It was mutual all along. Bond +10.`
        );
        await createLetter(
            'MOON_CONSORT', sender, guildId,
            `💞 The moon has been keeping a secret. <@${target.id}> also confessed to you. It was mutual all along. Bond +10.`
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

    // Not mutual yet — drop an anonymous letter in the target's inbox
    await createLetter(
        'MOON_CONSORT', target.id, guildId,
        `💌 Someone has a confession for you. The moon will not say who.\n\nIf you feel something for someone, use \`/confess\` — if it's mutual, the moon will reveal you both.`
    );

    await interaction.editReply({
        embeds: [buildEmbed('affection',
            `💌 Your confession has been sealed and placed in <@${target.id}>'s \`/letter inbox\`. They'll find it when they check.\n\nThe moon will keep your secret — until the stars decide otherwise.`,
            { title: '💌 Confession Sent' }
        )],
    });
}
