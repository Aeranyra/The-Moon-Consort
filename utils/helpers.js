// Pick a random item from an array
export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Format a mention
export function mention(userId) {
    return `<@${userId}>`;
}
