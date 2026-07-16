import { parseButtonId } from '../utils/buttons.js';
import { buildEmbed } from '../utils/embeds.js';
import { fetchGif, GIF_TERMS } from '../utils/gif.js';
import { replies } from '../utils/replies.js';
import { pick } from '../utils/helpers.js';
import { getBond, updateBond } from '../database/queries/bonds.js';
import { ensureUser, updateHighestBond, incrementField } from '../database/queries/users.js';
import { addMemory } from '../database/queries/memories.js';
import { rollRandomEvent, getRandomEventMessage } from '../utils/randomEvent.js';
import { randomWeapon } from '../utils/weapons.js';
import { rollBackfire } from '../utils/chaos.js';
import { stealButterfly } from '../database/queries/butterflies.js';

// ONLY affection/social commands get Yes/No buttons
// Chaos commands (slap, bonk, etc.) are instant — no buttons
const BUTTON_COMMANDS = {
    kiss:       { threshold: 11, delta: 3,  category: 'affection', memory: 'first_kiss', replyKey: ['kiss', 'success'] },
    hug:        { threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['hug', 'success'] },
    cuddle:     { threshold: 11, delta: 2,  category: 'affection', memory: null,         replyKey: ['cuddle', 'success'] },
    snuggle:    { threshold: 11, delta: 2,  category: 'affection', memory: null,         replyKey: ['snuggle', 'success'] },
    pat:        { threshold: 0,  delta: 1,  category: 'affection', memory: null,         replyKey: ['pat', 'success'] },
    comfort:    { threshold: 0,  delta: 1,  category: 'affection', memory: null,         replyKey: ['comfort', 'success'] },
    tease:      { threshold: 11, delta: 1,  category: 'affection', memory: null,         replyKey: ['tease', 'success'] },
    drink_share:{ threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['drink', 'share', 'success'] },
    eat_share:  { threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['eat', 'share', 'success'] },
};

// Resolve a nested reply array from replies.js using a key path
// e.g. ['drink', 'share', 'success'] → replies.drink.share.success
function resolveReply(keyPath) {
    return keyPath.reduce((obj, key) => obj?.[key], replies);
}

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

        if (!cmd) {
            // Unknown button — just remove it
            return interaction.update({ components: [] });
        }

        // ── Decline ──────────────────────────────────────────
        if (action === 'decline') {
            return interaction.update({
                embeds: [buildEmbed(cmd.category, pick(replies.button.decline)(senderId, targetId))],
                components: [],
            });
        }

        // ── Accept ───────────────────────────────────────────
        try {
            await interaction.deferUpdate();

            // Fetch GIF — non-blocking, falls back gracefully if no key or API down
            const gifTerm = GIF_TERMS[prefix] ?? GIF_TERMS[prefix.split('_')[0]] ?? prefix;
            const gifUrl = await fetchGif(gifTerm);

            // Get reply text
            const replyArr = resolveReply(cmd.replyKey);
            const text = replyArr ? pick(replyArr)(senderId, targetId) : `💞 <@${senderId}> and <@${targetId}>.`;

            // Apply bond delta
            if (cmd.delta) {
                const newScore = await updateBond(senderId, targetId, guildId, cmd.delta);
                await updateHighestBond(senderId, guildId, newScore);
                await updateHighestBond(targetId, guildId, newScore);
            }

            // Track memory if needed
            if (cmd.memory) {
                await addMemory(senderId, guildId, cmd.memory, targetId);
            }

            // Random event (affection only)
            let eventMsg = '';
            const event = rollRandomEvent();
            if (event) eventMsg = '\n\n' + (getRandomEventMessage(event, senderId) ?? '');

            const embed = buildEmbed(
                cmd.category,
                text + eventMsg,
                gifUrl ? { image: gifUrl } : {}
            );

            await interaction.editReply({ embeds: [embed], components: [] });

        } catch (err) {
            console.error(`Button handler error [${prefix}]:`, err);
            try {
                await interaction.editReply({
                    content: '🌙 The moon encountered an error.',
                    components: [],
                });
            } catch {}
        }
    }
}
