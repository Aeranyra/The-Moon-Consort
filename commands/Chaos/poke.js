import { SlashCommandBuilder } from 'discord.js';
import { updateBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { randomWeapon } from '../../utils/weapons.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('poke')
    .setDescription('Poke someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('chaos', '🌙 You cannot poke yourself.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const weapon = randomWeapon();
    const backfired = rollBackfire();
    const text = backfired
        ? pick(replies.poke.backfire)(sender, target.id, weapon)
        : pick(replies.poke.success)(sender, target.id, weapon);

    await updateBond(sender, target.id, guildId, 1);
    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
