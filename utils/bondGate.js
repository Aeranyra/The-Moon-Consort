import { getBond } from '../database/queries/bonds.js';
import { meetsRequirement } from './bondLevel.js';
import { pick } from './helpers.js';

export async function checkBondGate(senderId, targetId, guildId, required, failReplies) {
    const score = await getBond(senderId, targetId, guildId);
    if (meetsRequirement(score, required)) {
        return { passed: true, score };
    }
    return { passed: false, score, reply: pick(failReplies) };
}
