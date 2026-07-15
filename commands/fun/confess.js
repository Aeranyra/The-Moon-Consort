import { SlashCommandBuilder } from 'discord.js';
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

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const already = await hasConfessed(sender, target.id, guildId);
    if (already) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 You have already sent your confession. The moon is keeping it safe.')],
        ephemeral: true,
    });

    await createConfession(sender, target.id, guildId);

    const mutual = await checkMutual(sender, target.id, guildId);
    const mood = await getDailyMood(guildId);

    if (mutual) {
        // Both confessed — reveal to both
        await markRevealed(sender, target.id, guildId);
        const newScore = await updateBond(sender, target.id, guildId, 10);
        await updateHighestBond(sender, guildId, newScore);
        await updateHighestBond(target.id, guildId, newScore);

        const embed = new (await import('discord.js')).EmbedBuilder()
            .setColor(getMoodColor(mood))
            .setTitle('💞 A Mutual Confession')
            .setDescription(`The moon has kept both your secrets long enough.\n\n<@${sender}> and <@${target.id}> have confessed to each other.\n\n✨ Bond +10`)
            .setFooter({ text: getMoodFooter(mood) });

        await interaction.reply({ embeds: [embed] });

        // Also DM the target if possible
        try {
            await target.send({
                embeds: [new (await import('discord.js')).EmbedBuilder()
                    .setColor(getMoodColor(mood))
                    .setTitle('💞 A Mutual Confession')
                    .setDescription(`<@${sender}> confessed to you — and you had already confessed to them. The moon revealed the secret.`)
                    .setFooter({ text: '🌙 Moon Consort' })]
            });
        } catch {}

        return;
    }

    // Not mutual yet — notify target anonymously via DM
    try {
        await target.send({
            embeds: [new (await import('discord.js')).EmbedBuilder()
                .setColor(getMoodColor(mood))
                .setTitle('💌 A Sealed Confession')
                .setDescription(`Someone in **${interaction.guild.name}** has confessed something to you.\n\nThe moon will not say who. If you feel the same for someone — use \`/confess\` and let fate decide.\n\n*If you confess to the same person, the moon will reveal you both.*`)
                .setFooter({ text: getMoodFooter(mood) })]
        });
    } catch {}

    await interaction.reply({
        embeds: [buildEmbed('affection',
            '💌 Your confession has been sealed and carried by moonlight. The moon will keep your secret — until the stars decide otherwise.',
            { title: '💌 Confession Sent' }
        )],
        ephemeral: true,
    });
}
