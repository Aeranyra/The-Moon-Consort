import { BOND_LEVELS } from './constants.js';

export function getBondLevel(score) {
    if (score >= 201) return BOND_LEVELS.SOULBOUND;
    if (score >= 101) return BOND_LEVELS.LOVED;
    if (score >= 61)  return BOND_LEVELS.CHERISHED;
    if (score >= 31)  return BOND_LEVELS.CLOSE;
    if (score >= 11)  return BOND_LEVELS.FRIEND;
    return BOND_LEVELS.STRANGER;
}

export function meetsRequirement(score, required) {
    return score >= required;
}
