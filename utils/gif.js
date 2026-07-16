const KLIPY_BASE = 'https://api.klipy.com/api/v1';

// Log on startup so we know if the key is present
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
            console.error(`❌ Klipy API error: ${res.status} ${res.statusText} for "${searchTerm}"`);
            return null;
        }

        const data = await res.json();
        console.log(`🎬 Klipy raw keys: ${Object.keys(data).join(', ')}`);

        const results = data?.results ?? data?.data ?? [];
        if (!results.length) {
            console.warn(`⚠️ Klipy: no results for "${searchTerm}"`);
            return null;
        }

        const item = results[Math.floor(Math.random() * results.length)];
        console.log(`🎬 Klipy item keys: ${Object.keys(item).join(', ')}`);

        // Try every known Tenor/Klipy response field
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
            console.log(`✅ Klipy GIF found: ${gifUrl.slice(0, 60)}...`);
        } else {
            console.warn(`⚠️ Klipy: no GIF URL found. Item: ${JSON.stringify(item).slice(0, 300)}`);
        }

        return gifUrl;
    } catch (err) {
        console.error(`❌ Klipy fetch exception: ${err.message}`);
        return null;
    }
}

export const GIF_TERMS = {
    kiss:        'anime kiss',
    hug:         'anime hug',
    cuddle:      'anime cuddle',
    snuggle:     'anime snuggle',
    pat:         'anime headpat',
    comfort:     'anime comfort',
    tease:       'anime tease',
    drink_share: 'anime share drink',
    eat_share:   'anime share food',
    slap:        'anime slap',
    step:        'anime step on',
    poke:        'anime poke',
    yeet:        'anime throw',
    bonk:        'anime bonk',
    banish:      'anime explosion',
    haunt:       'anime ghost',
    ignore:      'anime ignore',
    stalk:       'anime spy',
    steal:       'anime steal',
    choke:       'anime dramatic',
    spank:       'anime spank',
    punish:      'anime punishment',
    propose:     'anime propose',
    bless:       'anime blessing',
    gift:        'anime gift',
};
