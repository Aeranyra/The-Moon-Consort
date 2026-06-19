import { RANDOM_EVENT_CHANCE, RANDOM_EVENTS } from './constants.js';
import { pick } from './helpers.js';

export function rollRandomEvent() {
    if (Math.random() > RANDOM_EVENT_CHANCE) return null;
    return pick(RANDOM_EVENTS);
}

export function getRandomEventMessage(event, userId) {
    const messages = {
        full_moon_blessing: `🌕 The full moon blesses <@${userId}>. Bond +2.`,
        butterfly_appears:  `🦋 A butterfly drifts toward <@${userId}>.`,
        unexpected_gift:    `🎁 An unexpected gift finds <@${userId}>.`,
        soulbound_awakening:`💞 Something stirs in <@${userId}>'s heart.`,
        moons_favor:        `🌙 The moon smiles upon <@${userId}> tonight.`,
        fates_thread:       `✨ Fate's thread pulls gently at <@${userId}>.`,
    };
    return messages[event] ?? null;
}
