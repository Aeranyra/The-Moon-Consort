// Tracks which VERSION_LABEL was last posted per guild
// so restarts don't repost the same changelog notes

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'config', 'changelogPosted.json');

function readAll() {
    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(raw || '{}');
    } catch {
        return {};
    }
}

function writeAll(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('[ChangelogStore] Failed to persist version:', err.message);
    }
}

export function getLastPostedVersion(guildId) {
    return readAll()[guildId] || null;
}

export function setLastPostedVersion(guildId, version) {
    const all = readAll();
    all[guildId] = version;
    writeAll(all);
}
