// Finds a guild channel by name, ignoring emoji/separator prefixes
// e.g. "📝︱front-desk" matches "front-desk"

function normalizeChannelName(str) {
    if (!str) return '';
    return str
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

export function findChannelByName(guild, targetName) {
    const target = normalizeChannelName(targetName);
    if (!target || !guild) return undefined;

    const channels = [...guild.channels.cache.values()];
    const exact = channels.find(c => normalizeChannelName(c.name) === target);
    if (exact) return exact;
    return channels.find(c => normalizeChannelName(c.name).includes(target));
}
