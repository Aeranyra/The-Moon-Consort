import { mention } from './helpers.js';

export const replies = {

    // ── AFFECTION ──────────────────────────────────────────

    kiss: {
        success: [
            (s,t) => `💋 ${mention(s)} pressed their lips to ${mention(t)}'s cheek. A blush lingers.`,
            (s,t) => `🌙 The Moon Consort watched ${mention(s)} and ${mention(t)} with quiet amusement.`,
            (s,t) => `✨ ${mention(t)} didn't seem to mind. Not even a little.`,
            (s,t) => `💞 ${mention(s)} has made their feelings known.`,
            (s,t) => `😈 Bold move, ${mention(s)}. Very bold.`,
        ],
        failure: [
            (s) => `🌙 *The moon steps between ${mention(s)} and their target. Not yet.*`,
            (s) => `✨ *The stars look away awkwardly from ${mention(s)}.*`,
            (s) => `🌸 *Too soon, ${mention(s)}. The moon remembers everything.*`,
            (s) => `😶 *That was bold, ${mention(s)}. Rejected by moonlight.*`,
            (s) => `💞 *Strangers don't kiss, ${mention(s)}. Build something first.*`,
        ],
    },

    hug: {
        success: [
            (s,t) => `🤗 ${mention(s)} pulls ${mention(t)} into a warm embrace.`,
            (s,t) => `🌙 The moon watches quietly as ${mention(s)} hugs ${mention(t)}.`,
            (s,t) => `💞 ${mention(t)} feels a little warmer. Thanks to ${mention(s)}.`,
            (s,t) => `✨ Even the stars seem softer watching ${mention(s)} and ${mention(t)}.`,
            (s,t) => `😈 ${mention(s)} clearly needed that. ${mention(t)} didn't complain.`,
        ],
    },

    snuggle: {
        success: [
            (s,t) => `🥰 ${mention(s)} has made themselves very comfortable next to ${mention(t)}.`,
            (s,t) => `💞 The stars approve of ${mention(s)} and ${mention(t)}.`,
            (s,t) => `🌙 Moonlight settles around ${mention(s)} and ${mention(t)}.`,
            (s,t) => `😈 Personal space has been defeated by ${mention(s)}.`,
            (s,t) => `✨ A peaceful moment is shared between ${mention(s)} and ${mention(t)}.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, the moon suggests building a friendship first.*`,
            (s) => `💞 *Too close too soon, ${mention(s)}.*`,
        ],
    },

    cuddle: {
        success: [
            (s,t) => `🧸 ${mention(s)} and ${mention(t)} share a peaceful moment.`,
            (s,t) => `🌙 The moon smiles quietly at ${mention(s)} and ${mention(t)}.`,
            (s,t) => `💞 The bond between ${mention(s)} and ${mention(t)} grows warmer.`,
            (s,t) => `✨ Comfort settles in for ${mention(s)} and ${mention(t)}.`,
            (s,t) => `😈 No escape now, ${mention(t)}.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, earn the closeness first.*`,
            (s) => `💞 *Not yet, ${mention(s)}. The moon requires more history.*`,
        ],
    },

    pat: {
        success: [
            (s,t) => `🐾 ${mention(s)} pats ${mention(t)}. Pat pat.`,
            (s,t) => `🌸 ${mention(s)} has granted ${mention(t)} their approval.`,
            (s,t) => `💞 A gentle touch from ${mention(s)} brightens ${mention(t)}'s mood.`,
            (s,t) => `🌙 The moon approves of ${mention(s)}'s gesture.`,
            (s,t) => `✨ Headpats from ${mention(s)} are powerful.`,
        ],
    },

    comfort: {
        success: [
            (s,t) => `🌸 ${mention(s)} pulls ${mention(t)} close. You are not alone tonight.`,
            (s,t) => `💞 ${mention(t)} feels lighter. ${mention(s)} made sure of it.`,
            (s,t) => `🌙 The moon shines a little softer on ${mention(t)} tonight.`,
            (s,t) => `✨ The burden feels lighter for ${mention(t)} now.`,
            (s,t) => `🤗 ${mention(s)} is here. ${mention(t)} is not alone.`,
        ],
    },

    tease: {
        success: [
            (s,t) => `😏 ${mention(s)} is being mischievous toward ${mention(t)}.`,
            (s,t) => `🌙 Trouble has entered the conversation. Thanks, ${mention(s)}.`,
            (s,t) => `💞 The teasing from ${mention(s)} seems effective on ${mention(t)}.`,
            (s,t) => `😈 Dangerous levels of confidence from ${mention(s)}.`,
            (s,t) => `✨ A playful grin from ${mention(s)} aimed at ${mention(t)}.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you need to know someone to tease them.*`,
            (s) => `😈 *Earn the right to be annoying first, ${mention(s)}.*`,
        ],
    },

    // ── CHAOS ──────────────────────────────────────────────

    slap: {
        success: [
            (s,t) => `👋 ${mention(s)} slapped ${mention(t)}. The moon winced.`,
            (s,t) => `😈 ${mention(t)} felt that. So did everyone watching.`,
            (s,t) => `✨ ${mention(s)} has no regrets. ${mention(t)} has questions.`,
            (s,t) => `💢 ${mention(t)} will remember this.`,
            (s,t) => `🌙 The Moon Consort pretends not to have seen ${mention(s)} do that.`,
        ],
        failure: [
            (s) => `🌸 *${mention(s)}, you can't slap a stranger. That's just assault.*`,
            (s) => `🌙 *The moon blocks ${mention(s)}'s hand. Not yet.*`,
            (s) => `😈 *Build a bond before you destroy it, ${mention(s)}.*`,
            (s) => `✨ *The stars are judging ${mention(s)}.*`,
        ],
    },

    step: {
        success: [
            (s,t) => `😈 ${mention(s)} steps on ${mention(t)}. Intentionally.`,
            (s,t) => `🌙 The Moon Consort sighs at ${mention(s)}.`,
            (s,t) => `✨ ${mention(t)} felt that. ${mention(s)} is unrepentant.`,
            (s,t) => `💢 Gremlin behavior detected from ${mention(s)}.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, even chaos requires a foundation.*`,
            (s) => `😈 *Earn the right to be a gremlin first, ${mention(s)}.*`,
        ],
    },

    poke: {
        success: [
            (s,t) => `👉 ${mention(s)} pokes ${mention(t)}.`,
            (s,t) => `🌙 ${mention(t)} has been poked by ${mention(s)}.`,
            (s,t) => `💞 Annoying, but affectionate. Classic ${mention(s)}.`,
            (s,t) => `✨ ${mention(t)} felt that.`,
        ],
    },

    haunt: {
        success: [
            (s,t) => `👻 ${mention(s)} haunts ${mention(t)} from the shadows.`,
            (s,t) => `🌙 A ghostly presence from ${mention(s)} lingers near ${mention(t)}.`,
            (s,t) => `✨ ${mention(t)} feels watched. They are.`,
            (s,t) => `😈 ${mention(s)} has chosen the spooky approach with ${mention(t)}.`,
            (s,t) => `💞 Strange affection from ${mention(s)}. ${mention(t)} doesn't hate it.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you can't haunt someone you don't know.*`,
            (s) => `👻 *Earn the right to be creepy first, ${mention(s)}.*`,
        ],
    },

    ignore: {
        success: [
            (s,t) => `🌙 ${mention(s)} looks away from ${mention(t)}. They noticed.`,
            (s,t) => `😶 Cold move from ${mention(s)}. ${mention(t)} felt that.`,
            (s,t) => `💞 ${mention(s)} said nothing to ${mention(t)}. That was the message.`,
            (s,t) => `✨ Silence is its own answer. ${mention(s)} delivered it.`,
            (s,t) => `😈 Brutal, ${mention(s)}. But legal.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you can't ignore someone you never knew.*`,
            (s) => `😶 *Ignoring a stranger just looks confused, ${mention(s)}.*`,
        ],
    },

    steal: {
        success: [
            (s,t) => `🦋 ${mention(s)}'s hand was quick. A butterfly stolen from ${mention(t)}.`,
            (s,t) => `😈 ${mention(t)} didn't even notice. Yet.`,
            (s,t) => `🌙 The moon saw ${mention(s)} do that. It said nothing.`,
            (s,t) => `✨ ${mention(t)}'s collection is now one lighter. Thanks to ${mention(s)}.`,
        ],
        failRoll: [
            (s,t) => `🦋 ${mention(s)}'s hand reached for ${mention(t)}'s butterfly... and missed.`,
            (s,t) => `😈 Almost, ${mention(s)}. The butterfly escaped.`,
            (s,t) => `🌙 The moon tripped ${mention(s)} at the last second.`,
            (s,t) => `✨ Not tonight, ${mention(s)}. The stars weren't on your side.`,
        ],
        failEmpty: [
            (s,t) => `🦋 ${mention(t)} has nothing to steal, ${mention(s)}.`,
            (s,t) => `🌙 Empty hands. ${mention(t)} had no butterflies.`,
        ],
        failure: [
            (s) => `🌑 *${mention(s)}, you haven't earned enough trust to betray it yet.*`,
            (s) => `😈 *Strangers don't steal, ${mention(s)}. Earn first.*`,
            (s) => `🌙 *The moon doesn't enable this level of chaos yet, ${mention(s)}.*`,
        ],
    },

    stalk: {
        success: [
            (s,t,u) => `🌑 The moon whispers to ${mention(s)}... ${mention(t)} was last seen with ${mention(u)}.`,
            (s,t)   => `👀 ${mention(s)} now knows more than they should about ${mention(t)}.`,
            (s,t)   => `😈 Interesting information, ${mention(s)}. Use it carefully.`,
            (s,t)   => `🌙 The stars spilled ${mention(t)}'s secret to ${mention(s)}.`,
        ],
        noData: [
            (s,t) => `🌙 The moon searched for ${mention(t)}'s trail, ${mention(s)}... and found nothing.`,
            (s,t) => `👀 ${mention(t)} has been suspiciously quiet, ${mention(s)}.`,
        ],
        failure: [
            (s) => `🌑 *The moon only watches those who matter, ${mention(s)}.*`,
            (s) => `👀 *${mention(s)}, you haven't earned the right to be this nosy.*`,
            (s) => `😈 *Strangers don't get to spy. Yet, ${mention(s)}.*`,
        ],
    },

    challenge: {
        start: [
            (s,t) => `👁️ ${mention(s)} and ${mention(t)} lock eyes. First to /yield loses.`,
            (s,t) => `😈 ${mention(s)} has challenged ${mention(t)}. The moon holds its breath.`,
            (s,t) => `🌙 The tension between ${mention(s)} and ${mention(t)} is visible from space.`,
        ],
        win: [
            (w,l) => `😈 ${mention(l)} broke first. ${mention(w)} wins.`,
            (w,l) => `👁️ ${mention(l)}'s eyes fell. ${mention(w)} remains undefeated.`,
            (w,l) => `🌙 The moon nods at ${mention(w)}. ${mention(l)} is shamed.`,
        ],
        failure: [
            (s) => `😈 *${mention(s)}, you can't challenge someone you barely know.*`,
            (s) => `👁️ *The moon refuses to referee strangers, ${mention(s)}.*`,
        ],
    },

    // ── SOCIAL ─────────────────────────────────────────────

    gift: {
        success: [
            (s,t,g) => `🎁 ${mention(s)} gives ${mention(t)} a ${g}.`,
            (s,t,g) => `🌸 ${mention(t)} receives ${g} from ${mention(s)}. The Moon Consort approves.`,
            (s,t,g) => `💞 ${mention(s)} offers ${mention(t)} ${g}. Small gestures matter.`,
            (s,t,g) => `✨ A smile appears on ${mention(t)}'s face. Thanks to ${mention(s)} and ${g}.`,
            (s,t,g) => `😈 Bribery from ${mention(s)}? ${g} delivered to ${mention(t)}. Effective.`,
        ],
    },

    bless: {
        success: [
            (s,t) => `🌸 ${mention(s)} bestows moonlight upon ${mention(t)}.`,
            (s,t) => `🌙 A rare blessing from ${mention(s)} reaches ${mention(t)}.`,
            (s,t) => `✨ Fortune follows ${mention(t)}'s path tonight.`,
            (s,t) => `💞 The bond between ${mention(s)} and ${mention(t)} shines brighter.`,
        ],
        cooldown: [
            (s) => `🌙 *${mention(s)}, the moon's blessing needs time to restore. Return tomorrow.*`,
            (s) => `✨ *${mention(s)}, you've given all you can for now.*`,
            (s) => `🌸 *Blessings are rare, ${mention(s)}. The moon is still recovering.*`,
        ],
        failure: [
            (s) => `🌙 *Blessings are sacred, ${mention(s)}. Earn the bond first.*`,
            (s) => `✨ *The moon doesn't bless strangers, ${mention(s)}.*`,
        ],
    },

    butterfly: {
        success: [
            (s,t) => `🦋 A butterfly drifts from ${mention(s)}'s hands to ${mention(t)}'s.`,
            (s,t) => `✨ The gift lands softly. ${mention(s)} gave ${mention(t)} something beautiful.`,
            (s,t) => `🌙 The moon watches ${mention(s)} and ${mention(t)}'s exchange warmly.`,
            (s,t) => `💞 Something freely given by ${mention(s)}. ${mention(t)} will remember.`,
        ],
        empty: [
            (s) => `🦋 *${mention(s)}'s hands are empty. Earn some butterflies first.*`,
            (s) => `🌙 *Nothing to give, ${mention(s)}. The moon suggests earning more.*`,
        ],
        failure: [
            (s) => `🦋 *Butterflies don't fly toward strangers, ${mention(s)}.*`,
            (s) => `🌙 *Build the bond first, ${mention(s)}.*`,
        ],
    },

    // ── RELATIONSHIPS ──────────────────────────────────────

    propose: {
        success: [
            (s,t) => `💌 ${mention(s)} has offered a moonlit vow to ${mention(t)}.`,
            (s,t) => `🌙 The moon awaits ${mention(t)}'s answer.`,
            (s,t) => `💞 ${mention(s)}'s heart has spoken. ${mention(t)} must decide.`,
            (s,t) => `✨ Destiny pauses to listen as ${mention(s)} proposes to ${mention(t)}.`,
            (s,t) => `😈 This could go very well for ${mention(s)}... or very badly.`,
        ],
        failure: [
            (s) => `🌙 *The moon does not rush hearts that are still strangers, ${mention(s)}.*`,
            (s) => `💌 *A vow means nothing without history behind it, ${mention(s)}.*`,
            (s) => `💞 *Build something real before you promise forever, ${mention(s)}.*`,
            (s) => `✨ *The stars aren't convinced yet, ${mention(s)}.*`,
        ],
    },

    accept: {
        success: [
            (s,t) => `💍 ${mention(s)} accepts ${mention(t)}'s vow beneath silver light.`,
            (s,t) => `🌙 The Moon Consort records the promise between ${mention(s)} and ${mention(t)}.`,
            (s,t) => `✨ The stars bear witness. ${mention(s)} and ${mention(t)} are bound.`,
            (s,t) => `💞 ${mention(s)} and ${mention(t)} choose the same path.`,
            (s,t) => `🌸 The vow is accepted. ${mention(s)} and ${mention(t)} are wed.`,
        ],
    },

    decline: {
        success: [
            (s,t) => `🌙 ${mention(s)} lets the moon stay silent. ${mention(t)}'s vow fades.`,
            (s,t) => `🍂 The proposal from ${mention(t)} fades before it begins.`,
            (s,t) => `😔 Not every story becomes a legend. ${mention(s)} has chosen.`,
            (s,t) => `✨ Fate chooses another path for ${mention(s)}.`,
            (s,t) => `💌 The answer from ${mention(s)} is no.`,
        ],
    },

    divorce: {
        success: [
            (s,t) => `💔 ${mention(s)} and ${mention(t)}'s vow fades into memory.`,
            (s,t) => `🌙 Not all stories last forever. ${mention(s)} and ${mention(t)} part ways.`,
            (s,t) => `🍂 Another chapter quietly closes for ${mention(s)} and ${mention(t)}.`,
            (s,t) => `😔 The moon lowers its gaze at ${mention(s)} and ${mention(t)}.`,
            (s,t) => `😈 Well... that was awkward. ${mention(s)} and ${mention(t)} are done.`,
        ],
    },

    // ── FAMILY ─────────────────────────────────────────────

    adopt: {
        success: [
            (s,t) => `👶 ${mention(s)} forms a family bond with ${mention(t)}.`,
            (s,t) => `🌙 The Eternal Record welcomes ${mention(t)} as ${mention(s)}'s child.`,
            (s,t) => `💞 A home grows larger. ${mention(s)} and ${mention(t)} are family.`,
            (s,t) => `✨ Family is more than blood. ${mention(s)} and ${mention(t)} prove it.`,
            (s,t) => `🌸 Another branch grows. ${mention(t)} joins ${mention(s)}'s family.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you can't adopt a stranger. Build trust first.*`,
            (s) => `👶 *The moon doesn't recognize this family yet, ${mention(s)}.*`,
            (s) => `💞 *A parent-child bond needs history behind it, ${mention(s)}.*`,
        ],
    },

};
