// Klipy GIF fetcher — mirrors the Tenor API structure since Klipy is Tenor-compatible
const KLIPY_BASE = 'https://api.klipy.com/api/v1';

export async function fetchGif(searchTerm) {
    const key = process.env.KLIPY_API_KEY;
    if (!key) return null;

    try {
        const url = `${KLIPY_BASE}/${key}/gifs/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`Klipy API error: ${res.status} ${res.statusText}`);
            return null;
        }

        const data = await res.json();

        // Klipy mirrors Tenor's response format: { results: [...] }
        const results = data?.results ?? data?.data ?? [];
        if (!results.length) return null;

        const item = results[Math.floor(Math.random() * results.length)];

        // Try every possible GIF URL field in Klipy/Tenor response format
        const gifUrl =
            item?.media_formats?.gif?.url           // Tenor v2 format
            ?? item?.media_formats?.mediumgif?.url  // Tenor v2 medium
            ?? item?.media?.[0]?.gif?.url           // Tenor v1 format
            ?? item?.media?.[0]?.mediumgif?.url     // Tenor v1 medium
            ?? item?.url                            // Direct URL
            ?? item?.gif_url                        // Alternative field
            ?? null;

        if (!gifUrl) {
            // Log the structure so we can debug what Klipy actually returns
            console.log('Klipy item structure (no url found):', JSON.stringify(item, null, 2).slice(0, 500));
        }

        return gifUrl;
    } catch (err) {
        console.error('Klipy fetch error:', err.message);
        return null;
    }
}

// GIF search terms per command — anime-style
export const GIF_TERMS = {
    kiss:       'anime kiss',
    hug:        'anime hug',
    cuddle:     'anime cuddle',
    snuggle:    'anime snuggle',
    pat:        'anime headpat',
    comfort:    'anime comfort',
    tease:      'anime tease',
    drink_share:'anime share drink',
    eat_share:  'anime share food',
    slap:       'anime slap',
    step:       'anime step on',
    poke:       'anime poke',
    yeet:       'anime throw',
    bonk:       'anime bonk',
    banish:     'anime explosion',
    haunt:      'anime ghost',
    ignore:     'anime ignore',
    stalk:      'anime spy',
    steal:      'anime steal',
    choke:      'anime dramatic',
    spank:      'anime spank',
    punish:     'anime punishment',
    propose:    'anime propose',
    bless:      'anime blessing',
    gift:       'anime gift',
};
