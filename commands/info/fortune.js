import { SlashCommandBuilder } from 'discord.js';
import { pick } from '../../utils/helpers.js';

const FORTUNES = [
    '🌙 The moon promises a new connection tonight.',
    '✨ A bond you cherish will grow stronger.',
    '💞 Someone is thinking of you beneath the silver light.',
    '🌸 Give a gift today. The stars will remember.',
    '😈 Trouble follows those who don\'t listen to the moon.',
    '🦋 A butterfly will find you soon.',
    '💌 An unexpected message changes everything.',
    '🌑 The moon says: be patient. Good things take time.',
    '💍 A vow made sincerely lasts forever.',
    '👻 Someone is closer than you think.',
];

export const data = new SlashCommandBuilder()
    .setName('fortune')
    .setDescription('Receive your daily moon fortune.');

export async function execute(interaction) {
    await interaction.reply({ content: pick(FORTUNES) });
}
