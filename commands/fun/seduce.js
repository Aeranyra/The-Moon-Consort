import { SlashCommandBuilder } from 'discord.js';
import { getBond } from '../../database/queries/bonds.js';
import { ensureUser } from '../../database/queries/users.js';
import { replies } from '../../utils/replies.js';
import { pick } from '../../utils/helpers.js';
import { buildEmbed } from '../../utils/embeds.js';
import { rollBackfire } from '../../utils/chaos.js';

export const data = new SlashCommandBuilder()
    .setName('seduce')
    .setDescription('Turn your full attention on someone. Results may vary.')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true));

export async function execute(interaction) {
    const sender = interaction.user.id;
    const target = interaction.options.getUser('user');
    const guildId = interaction.guildId;

    if (target.id === sender) return interaction.reply({
        embeds: [buildEmbed('fun', '🌙 You cannot seduce yourself. That\'s just confidence.')],
        ephemeral: true,
    });

    await ensureUser(sender, guildId);
    await ensureUser(target.id, guildId);

    const backfired = rollBackfire();
    let text;

    if (backfired) {
        text = pick(replies.seduce.failure)(sender, target.id);
    } else {
        text = pick(replies.seduce.success)(sender, target.id);
    }

    await interaction.reply({ embeds: [buildEmbed('fun', text)] });
}
