import { parseButtonId } from '../utils/buttons.js';
import { buildEmbed } from '../utils/embeds.js';
import { replies } from '../utils/replies.js';
import { pick } from '../utils/helpers.js';
import { getBond, updateBond } from '../database/queries/bonds.js';
import { ensureUser, updateHighestBond, incrementField } from '../database/queries/users.js';
import { addMemory } from '../database/queries/memories.js';
import { addButterfly } from '../database/queries/butterflies.js';
import { rollRandomEvent, getRandomEventMessage } from '../utils/randomEvent.js';
import { checkBondMilestones, awardMilestone } from '../utils/milestones.js';

const BUTTON_COMMANDS = {
    kiss:        { threshold: 11, delta: 3,  category: 'affection', memory: 'first_kiss', replyKey: ['kiss', 'success'] },
    hug:         { threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['hug', 'success'] },
    cuddle:      { threshold: 11, delta: 2,  category: 'affection', memory: null,         replyKey: ['cuddle', 'success'] },
    snuggle:     { threshold: 11, delta: 2,  category: 'affection', memory: null,         replyKey: ['snuggle', 'success'] },
    pat:         { threshold: 0,  delta: 1,  category: 'affection', memory: null,         replyKey: ['pat', 'success'] },
    comfort:     { threshold: 0,  delta: 1,  category: 'affection', memory: null,         replyKey: ['comfort', 'success'] },
    tease:       { threshold: 11, delta: 1,  category: 'affection', memory: null,         replyKey: ['tease', 'success'] },
    drink_share: { threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['drink', 'share', 'success'] },
    eat_share:   { threshold: 0,  delta: 2,  category: 'affection', memory: null,         replyKey: ['eat', 'share', 'success'] },
    seduce:      { threshold: 0,  delta: 1,  category: 'fun',       memory: null,         replyKey: ['seduce', 'success'] },
    sleep:       { threshold: 0,  delta: 1,  category: 'affection', memory: null,         replyKey: ['sleep', 'success'] },
};

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

        if (interaction.user.id !== targetId) {
            return interaction.reply({
                embeds: [buildEmbed('error', '🌙 These buttons are not meant for you.')],
                ephemeral: true,
            });
        }

        const prefix = interaction.customId.split('_').slice(0, -3).join('_');
        const cmd = BUTTON_COMMANDS[prefix];

        if (!cmd) return interaction.update({ components: [] });

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

            const replyArr = resolveReply(cmd.replyKey);
            const text = replyArr
                ? pick(replyArr)(senderId, targetId)
                : `💞 <@${senderId}> and <@${targetId}>.`;

            // Random event — 30% chance of butterfly drop when event fires
            const event = rollRandomEvent();
            let eventMsg = '';
            if (event) {
                const baseMsg = getRandomEventMessage(event, senderId) ?? '';
                eventMsg = '\n\n' + baseMsg;

                // Actually drop a butterfly on butterfly events
                if (event === 'butterfly_appears') {
                    await addButterfly(senderId, guildId, 'white');
                    eventMsg += '\n🦋 +1 white butterfly';
                }
            }

            // DB updates
            let milestoneMsg = '';
            if (cmd.delta) {
                const newScore = await updateBond(senderId, targetId, guildId, cmd.delta);
                await updateHighestBond(senderId, guildId, newScore);
                await updateHighestBond(targetId, guildId, newScore);

                // Check bond milestones for both users
                const senderMilestones = await checkBondMilestones(senderId, guildId, newScore);
                const targetMilestones = await checkBondMilestones(targetId, guildId, newScore);
                const allMilestones = [...senderMilestones, ...targetMilestones];
                if (allMilestones.length) {
                    milestoneMsg = '\n\n' + allMilestones.join('\n');
                }
            }

            // First kiss milestone
            if (cmd.memory === 'first_kiss') {
                const got = await awardMilestone(senderId, guildId, 'first_kiss', 1);
                if (got) milestoneMsg += '\n\n🦋 First kiss milestone! +1 butterfly';
                await addMemory(senderId, guildId, cmd.memory, targetId);
            } else if (cmd.memory) {
                await addMemory(senderId, guildId, cmd.memory, targetId);
            }

            await interaction.editReply({
                embeds: [buildEmbed(cmd.category, text + eventMsg + milestoneMsg)],
                components: [],
            });

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
