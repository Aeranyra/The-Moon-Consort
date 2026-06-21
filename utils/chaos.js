// Returns true if a chaos action should backfire onto the sender instead.
export function rollBackfire(chance = 0.15) {
    return Math.random() < chance;
}
