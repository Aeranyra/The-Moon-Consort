const KLIPY_BASE = 'https://api.klipy.com/api/v1';

const _key = process.env.KLIPY_API_KEY;
if (_key) {
    console.log(`🎬 Klipy GIF API ready (key: ${_key.slice(0, 6)}...)`);
} else {
    console.warn('⚠️ KLIPY_API_KEY is not set — GIFs will be disabled.');
}

export async function fetchGif(searchTerm) {
    const key = process.env.KLIPY_API_KEY;
    if (!key) return null;

    try {
        const url = `${KLIPY_BASE}/${key}/gifs/search?q=${encodeURIComponent(searchTerm)}&limit=10`;
        console.log(`🎬 Klipy fetch: ${searchTerm}`);
        const res = await fetch(url);

        if (!res.ok) {
            console.error(`❌ Klipy error: ${res.status} for "${searchTerm}"`);
            return null;
        }

        const data = await res.json();

        // Klipy returns { result: [...], data: {...} }
        // "result" is the array of GIFs
        const results = data?.result ?? data?.results ?? data?.data ?? [];
        if (!Array.isArray(results) || !results.length) {
            console.warn(`⚠️ Klipy: no results for "${searchTerm}" — keys: ${Object.keys(data).join(', ')}`);
            return null;
        }

        const item = results[Math.floor(Math.random() * results.length)];

        const gifUrl =
            item?.media_formats?.gif?.url
            ?? item?.media_formats?.mediumgif?.url
            ?? item?.media_formats?.tinygif?.url
            ?? item?.media?.[0]?.gif?.url
            ?? item?.media?.[0]?.mediumgif?.url
            ?? item?.url
            ?? item?.gif_url
            ?? item?.src
            ?? null;

        if (gifUrl) {
            console.log(`✅ Klipy GIF: ${gifUrl.slice(0, 60)}...`);
        } else {
            console.warn(`⚠️ Klipy: item has no URL. Keys: ${Object.keys(item).join(', ')}`);
        }

        return gifUrl;
    } catch (err) {
        console.error(`❌ Klipy exception: ${err.message}`);
        return null;
    }
}

// Simpler search terms — no "anime" prefix which Klipy may filter
export const GIF_TERMS = {
    kiss:        'kiss',
    hug:         'hug',
    cuddle:      'cuddle',
    snuggle:     'snuggle',
    pat:         'headpat',
    comfort:     'comfort',
    tease:       'tease',
    drink_share: 'sharing drink',
    eat_share:   'sharing food',
    slap:        'slap',
    step:        'step on',
    poke:        'poke',
    yeet:        'throw',
    bonk:        'bonk',
    banish:      'explosion',
    haunt:       'ghost spooky',
    ignore:      'ignore',
    stalk:       'spy watching',
    steal:       'steal',
    choke:       'dramatic',
    spank:       'spank',
    punish:      'punishment',
    propose:     'propose marriage',
    bless:       'blessing',
    gift:        'gift giving',
};
