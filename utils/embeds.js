import { EmbedBuilder } from 'discord.js';

const CATEGORY_COLORS = {
    affection:     0xFF8FB1,
    chaos:         0xE74C3C,
    social:        0xF1C40F,
    relationships: 0xC2185B,
    family:        0x8E44AD,
    fortune:       0xFFD700,
    pets:          0x4FC3F7,
    letters:       0x7E57C2,
    fun:           0xFF7F50,
    error:         0x636E72,
};

// opts: { title, fields, thumbnail, image }
export function buildEmbed(category, description, opts = {}) {
    const embed = new EmbedBuilder()
        .setColor(CATEGORY_COLORS[category] ?? 0x9B59B6)
        .setDescription(description || null)
        .setFooter({ text: '🌙 Moon Consort' });

    if (opts.title)     embed.setTitle(opts.title);
    if (opts.fields)    embed.addFields(opts.fields);
    if (opts.thumbnail) embed.setThumbnail(opts.thumbnail);
    if (opts.image)     embed.setImage(opts.image);

    return embed;
}
