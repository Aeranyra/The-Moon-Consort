import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { randomWeapon } from '../../utils/weapons.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('step')
    .setDescription('Step on someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) {
        return interaction.reply({ embeds: [buildEmbed('chaos', '🌙 You cannot step on yourself.')], ephemeral: true });
    }

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < 31) {
        return interaction.reply({ embeds: [buildEmbed('chaos', pick(replies.step.failure)(sender))], ephemeral: true });
    }

    const weapon = randomWeapon();
    const backfired = rollBackfire();

    await updateBond(sender, target, guildId, -1);
    await incrementField(sender, guildId, 'mischief_count');

    const text = backfired
        ? pick(replies.step.backfire)(sender, target, weapon)
        : pick(replies.step.success)(sender, target, weapon);

    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
