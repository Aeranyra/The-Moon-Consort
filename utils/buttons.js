import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Builds an Accept/Decline action row.
// customIdPrefix: e.g. 'kiss' — becomes 'kiss_accept_<senderId>_<targetId>'
export function buildYesNoRow(customIdPrefix, senderId, targetId) {
    const accept = new ButtonBuilder()
        .setCustomId(`${customIdPrefix}_accept_${senderId}_${targetId}`)
        .setLabel('Accept')
        .setEmoji('💞')
        .setStyle(ButtonStyle.Success);

    const decline = new ButtonBuilder()
        .setCustomId(`${customIdPrefix}_decline_${senderId}_${targetId}`)
        .setLabel('Decline')
        .setEmoji('🌙')
        .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder().addComponents(accept, decline);
}

// Parse a button customId back into its parts.
// Returns { action: 'accept'|'decline', senderId, targetId } or null if unrecognised.
export function parseButtonId(customId) {
    const parts = customId.split('_');
    // format: <prefix>_accept/decline_<senderId>_<targetId>
    // prefix itself may contain underscores (e.g. "eight_ball") so we read from the end
    if (parts.length < 4) return null;
    const targetId = parts[parts.length - 1];
    const senderId = parts[parts.length - 2];
    const action   = parts[parts.length - 3];
    if (action !== 'accept' && action !== 'decline') return null;
    return { action, senderId, targetId };
}
