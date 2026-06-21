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
    .setName('choke')
    .setDescription('Dramatically, theatrically "choke" someone. Soap-opera style.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user').id;
    const guildId = interaction.guildId;

    if (sender === target) {
        return interaction.reply({
            embeds: [buildEmbed('fun', '🌙 You cannot dramatically choke yourself. Save the theatrics.')],
            ephemeral: true,
        });
    }

    await ensureUser(sender, guildId);
    await ensureUser(target, guildId);

    const score = await getBond(sender, target, guildId);
    if (score < BOND_THRESHOLD) {
        return interaction.reply({
            embeds: [buildEmbed('fun', pick(replies.choke.failure)(sender))],
            ephemeral: true,
        });
    }

    const weapon = randomWeapon();
    const backfired = rollBackfire();

    await updateBond(sender, target, guildId, -1);
    await incrementField(sender, guildId, 'mischief_count');

    const text = backfired
        ? pick(replies.choke.backfire)(sender, target, weapon)
        : pick(replies.choke.success)(sender, target, weapon);

    await interaction.reply({ embeds: [buildEmbed('fun', text)] });
}
