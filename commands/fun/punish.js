import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { randomWeapon } from '../../utils/weapons.js';
import { rollBackfire } from '../../utils/chaos.js';

const BOND_THRESHOLD = 31;

export const data = new SlashCommandBuilder()
    .setName('punish')
    .setDescription('Sentence someone to the Corner of Shame.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) {
        return interaction.reply({
            embeds: [buildEmbed('fun', '🌙 You cannot punish yourself. That\'s just guilt.')],
            ephemeral: true,
        });
    }

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < BOND_THRESHOLD) {
        return interaction.reply({
            embeds: [buildEmbed('fun', pick(replies.punish.failure)(sender))],
            ephemeral: true,
        });
    }

    const weapon = randomWeapon();
    const backfired = rollBackfire();

    await updateBond(sender, target, guildId, -1);
    await incrementField(sender, guildId, 'mischief_count');

    const text = backfired
        ? pick(replies.punish.backfire)(sender, target, weapon)
        : pick(replies.punish.success)(sender, target, weapon);

    await interaction.reply({ embeds: [buildEmbed('fun', text)] });
}
