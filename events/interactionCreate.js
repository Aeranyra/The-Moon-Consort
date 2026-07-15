import { parseButtonId } from '../utils/buttons.js';
import { buildEmbed } from '../utils/embeds.js';
import { fetchGif, GIF_TERMS } from '../utils/gif.js';
import { replies } from '../utils/replies.js';
import { pick } from '../utils/helpers.js';
import { getBond, updateBond } from '../database/queries/bonds.js';
import { ensureUser, updateHighestBond } from '../database/queries/users.js';
import { addMemory } from '../database/queries/memories.js';
import { rollRandomEvent, getRandomEventMessage } from '../utils/randomEvent.js';
import { incrementField } from '../database/queries/users.js';
import { randomWeapon } from '../utils/weapons.js';
import { rollBackfire } from '../utils/chaos.js';
import { stealButterfly } from '../database/queries/butterflies.js';

// Which commands get Yes/No buttons, their bond threshold, bond delta, category, and memory key
const BUTTON_COMMANDS = {
    // Affection
    kiss:    { threshold: 11,  delta: 3,  category: 'affection', memory: 'first_kiss',   chaos: false },
    hug:     { threshold: 0,   delta: 2,  category: 'affection', memory: null,            chaos: false },
    cuddle:  { threshold: 11,  delta: 2,  category: 'affection', memory: null,            chaos: false },
    snuggle: { threshold: 11,  delta: 2,  category: 'affection', memory: null,            chaos: false },
    pat:     { threshold: 0,   delta: 1,  category: 'affection', memory: null,            chaos: false },
    comfort: { threshold: 0,   delta: 1,  category: 'affection', memory: null,            chaos: false },
    tease:   { threshold: 11,  delta: 1,  category: 'affection', memory: null,            chaos: false },
    // Chaos
    slap:    { threshold: 31,  delta: -2, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    step:    { threshold: 31,  delta: -1, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    poke:    { threshold: 0,   delta: 1,  category: 'chaos',     memory: null,            chaos: false },
    yeet:    { threshold: 31,  delta: -1, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    bonk:    { threshold: 31,  delta: -1, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    banish:  { threshold: 31,  delta: -1, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    haunt:   { threshold: 11,  delta: 1,  category: 'chaos',     memory: null,            chaos: false, mischief: 'haunt_count' },
    ignore:  { threshold: 11,  delta: -1, category: 'chaos',     memory: null,            chaos: false },
    stalk:   { threshold: 11,  delta: 0,  category: 'chaos',     memory: null,            chaos: false },
    steal:   { threshold: 61,  delta: -3, category: 'chaos',     memory: null,            chaos: true,  mischief: 'mischief_count' },
    choke:   { threshold: 31,  delta: -1, category: 'fun',       memory: null,            chaos: true,  mischief: 'mischief_count' },
    drink_share: { threshold: 0, delta: 2,  category: 'affection', memory: null,            chaos: false },
    eat_share:   { threshold: 0, delta: 2,  category: 'affection', memory: null,            chaos: false },
    spank:   { threshold: 31,  delta: -1, category: 'fun',       memory: null,            chaos: true,  mischief: 'mischief_count' },
    punish:  { threshold: 31,  delta: -1, category: 'fun',       memory: null,            chaos: true,  mischief: 'mischief_count' },
};

export async function handleInteraction(interaction) {
    // ── Slash commands ────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error in /${interaction.commandName}:`, error);
            const msg = { content: '🌙 The moon encountered an error. Try again later.', ephemeral: true };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(msg);
            } else {
                await interaction.reply(msg);
            }
        }
        return;
    }

    // ── Button interactions ───────────────────────────────────
    if (interaction.isButton()) {
        const parsed = parseButtonId(interaction.customId);
        if (!parsed) return;

        const { action, senderId, targetId } = parsed;
        const guildId = interaction.guildId;

        // Only the target can click the buttons
        if (interaction.user.id !== targetId) {
            return interaction.reply({
                embeds: [buildEmbed('error', '🌙 These buttons are not meant for you.')],
                ephemeral: true,
            });
        }

        // Work out which command this button belongs to
        const prefix = interaction.customId.split('_').slice(0, -3).join('_');
        const cmd = BUTTON_COMMANDS[prefix];

        if (action === 'decline') {
            await interaction.update({
                embeds: [buildEmbed(cmd?.category ?? 'affection',
                    pick(replies.button.decline)(senderId, targetId))],
                components: [],
            });
            return;
        }

        // ── Accept ───────────────────────────────────────────
        // steal has special butterfly logic — handle separately
        if (prefix === 'steal') {
            return handleStealAccept(interaction, senderId, targetId, guildId);
        }

        await interaction.deferUpdate();

        // Fetch GIF (non-blocking — if it fails, we still post without one)
        const gifUrl = await fetchGif(GIF_TERMS[prefix] ?? prefix);

        const score = await getBond(senderId, targetId, guildId);
        let text;

        if (cmd?.chaos) {
            const weapon = randomWeapon();
            const backfired = rollBackfire();
            text = backfired
                ? pick(replies[prefix]?.backfire ?? replies[prefix]?.success)(senderId, targetId, weapon)
                : pick(replies[prefix]?.success)(senderId, targetId, weapon);
        } else {
            text = pick(replies[prefix]?.success)(senderId, targetId);
        }

        // Apply bond delta
        if (cmd?.delta) {
            const newScore = await updateBond(senderId, targetId, guildId, cmd.delta);
            if (cmd.delta > 0) {
                await updateHighestBond(senderId, guildId, newScore);
                await updateHighestBond(targetId, guildId, newScore);
            }
        }

        // Track memory if needed
        if (cmd?.memory) {
            await addMemory(senderId, guildId, cmd.memory, targetId);
        }

        // Track mischief if needed
        if (cmd?.mischief) {
            await incrementField(senderId, guildId, cmd.mischief);
        }

        // Random event (affection only)
        let eventMsg = '';
        if (!cmd?.chaos) {
            const event = rollRandomEvent();
            if (event) eventMsg = '\n' + getRandomEventMessage(event, senderId);
        }

        const embed = buildEmbed(
            cmd?.category ?? 'affection',
            text + eventMsg,
            gifUrl ? { image: gifUrl } : {}
        );

        await interaction.editReply({ embeds: [embed], components: [] });
    }
}

// Override handler for steal (needs stealButterfly logic)
async function handleStealAccept(interaction, senderId, targetId, guildId) {
    await interaction.deferUpdate();
    const gifUrl = await fetchGif(GIF_TERMS['steal']);
    const result = await stealButterfly(targetId, senderId, guildId);

    let text;
    if (result.empty) {
        text = pick(replies.steal.failEmpty)(senderId, targetId);
    } else if (!result.success) {
        await updateBond(senderId, targetId, guildId, -3);
        await incrementField(senderId, guildId, 'mischief_count');
        text = pick(replies.steal.failRoll)(senderId, targetId);
    } else {
        await updateBond(senderId, targetId, guildId, -3);
        await incrementField(senderId, guildId, 'mischief_count');
        text = pick(replies.steal.success)(senderId, targetId);
    }

    const embed = buildEmbed('chaos', text, gifUrl ? { image: gifUrl } : {});
    await interaction.editReply({ embeds: [embed], components: [] });
}
