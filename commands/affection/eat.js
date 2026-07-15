import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { buildYesNoRow } from '../../utils/buttons.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('eat')
    .setDescription('Share food or force-feed someone.')
    .addSubcommand(sub =>
        sub.setName('share')
            .setDescription('Share something to eat with someone.')
            .addUserOption(o => o.setName('user').setDescription('Who to share with').setRequired(true))
    )
    .addSubcommand(sub =>
        sub.setName('force')
            .setDescription('Force-feed someone something questionable.')
            .addUserOption(o => o.setName('user').setDescription('Unwilling target').setRequired(true))
    );

export async function execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === 'share') return eatShare(interaction);
    if (sub === 'force') return eatForce(interaction);
}

async function eatShare(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('affection', '🌙 Eating alone is fine. But sharing is the point.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const row = buildYesNoRow('eat_share', sender, target.id);
    await interaction.reply({
        content: `<@${target.id}>`,
        embeds: [buildEmbed('affection', pick(replies.prompts.eat_share)(sender, target.id), { title: '🍱 Share a Meal?' })],
        components: [row],
    });
    setTimeout(async () => { try { await interaction.editReply({ components: [] }); } catch {} }, 60_000);
}

async function eatForce(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('chaos', '🌙 Force-feeding yourself is just eating with extra steps.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (score < 31) return interaction.reply({
        embeds: [buildEmbed('chaos', pick(replies.eat.force.failure)(sender))],
        ephemeral: true,
    });

    const backfired = rollBackfire();
    const text = backfired
        ? pick(replies.eat.force.backfire)(sender, target.id)
        : pick(replies.eat.force.success)(sender, target.id);

    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
