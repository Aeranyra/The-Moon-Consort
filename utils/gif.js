// Fetches a random GIF from Klipy for a given search term.
// Klipy's API structure mirrors Tenor — just a different base URL.
// Returns a GIF URL string, or null if the fetch fails.

const KLIPY_BASE = 'https://api.klipy.com/api/v1';

export async function fetchGif(searchTerm) {
    const key = process.env.KLIPY_API_KEY;
    if (!key) return null;

    try {
        const url = `${KLIPY_BASE}/${key}/gifs/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        const results = data?.data;
        if (!results?.length) return null;

        // Pick a random result from the top 10 so we get variety
        const item = results[Math.floor(Math.random() * results.length)];

        // Klipy returns media formats similar to Tenor
        return item?.media_formats?.gif?.url
            ?? item?.media_formats?.mediumgif?.url
            ?? item?.url
            ?? null;
    } catch {
        return null;
    }
}

// GIF search terms per command — tuned for anime-style results
export const GIF_TERMS = {
    // Affection
    kiss:    'anime kiss',
    hug:     'anime hug',
    cuddle:  'anime cuddle',
    snuggle: 'anime snuggle',
    pat:     'anime headpat',
    comfort: 'anime comfort',
    tease:   'anime tease',
    // Chaos
    slap:    'anime slap',
    step:    'anime step on',
    poke:    'anime poke',
    yeet:    'anime yeet throw',
    bonk:    'anime bonk',
    banish:  'anime explosion send away',
    haunt:   'anime ghost spooky',
    ignore:  'anime ignore look away',
    stalk:   'anime spy peek',
    steal:   'anime steal snatch',
    choke:   'anime dramatic choke',
    spank:   'anime spank',
    punish:  'anime punishment corner',
    // Social
    bless:   'anime blessing glow',
    gift:    'anime gift give',
    // Relationship
    propose: 'anime propose ring',
};
