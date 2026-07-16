import { SlashCommandBuilder } from 'discord.js';
import { getBond, updateBond } from '../../database/queries/bonds.js';
import { ensureUser, incrementField } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { randomWeapon } from '../../utils/weapons.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Use /slap on someone.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('chaos', '🌙 You cannot do this to yourself.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const score = await getBond(sender, target.id, guildId);
    if (31 > 0 && score < 31) {
        return interaction.reply({
            embeds: [buildEmbed('chaos', pick(replies['slap'].failure)(sender))],
            ephemeral: true,
        });
    }

    const weapon = randomWeapon();
    const backfired = rollBackfire();
    const text = backfired
        ? pick(replies['slap'].backfire)(sender, target.id, weapon)
        : pick(replies['slap'].success)(sender, target.id, weapon);

    await updateBond(sender, target.id, guildId, -1);
    await incrementField(sender, guildId, 'mischief_count');
    await interaction.reply({ embeds: [buildEmbed('chaos', text)] });
}
