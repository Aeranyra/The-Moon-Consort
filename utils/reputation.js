export function calcReputation(user) {
    if (user.divorce_count >= 5)        return '💔 Serial Divorcee';
    if (user.divorce_count >= 2)        return '😈 Heartbreaker';
    if (user.blessings_given >= 10)     return '🎁 Generous Spirit';
    if (user.highest_bond >= 150)       return '💞 Beloved Companion';
    if (user.moon_favor)                return '🌙 Moon Favorite';
    return                                     '🌸 Faithful Soul';
}
