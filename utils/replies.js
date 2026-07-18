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
            (s,t,w) => `🌙 ${mention(s)} smacks ${mention(t)} with ${w}. The moon files an incident report.`,
            (s,t,w) => `😈 ${mention(s)} unleashes ${w} on ${mention(t)}. Witnesses are stunned.`,
            (s,t,w) => `✨ ${mention(t)} did NOT see ${w} coming from ${mention(s)}.`,
            (s,t,w) => `💢 A slap, delivered via ${w}. ${mention(s)} has no remorse for ${mention(t)}.`,
            (s,t,w) => `🌙 The Moon Consort gasps as ${mention(s)} slaps ${mention(t)} with ${w}. Iconic.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} swings ${w} at ${mention(t)}... and slaps themselves instead. Physics: undefeated.`,
            (s,t,w) => `😬 ${w} ricochets off ${mention(t)} and boomerangs straight into ${mention(s)}'s face.`,
            (s,t,w) => `✨ The moon redirects ${mention(s)}'s ${w}. ${mention(s)} is now the victim of their own crime.`,
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
            (s,t,w) => `😈 ${mention(s)} steps on ${mention(t)} while holding ${w}. Maximum gremlin achieved.`,
            (s,t,w) => `🌙 The Moon Consort sighs as ${mention(s)} commits a crime with ${w} nearby.`,
            (s,t,w) => `✨ ${mention(t)} felt that. ${mention(s)} remains unrepentant, ${w} in hand.`,
            (s,t,w) => `💢 Gremlin behavior from ${mention(s)}, witnessed by ${w}.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} trips over ${w} mid-step and faceplants in front of ${mention(t)}.`,
            (s,t,w) => `😬 Karma redirects ${mention(s)}'s foot. ${w} was not enough to save them.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, even chaos requires a foundation.*`,
            (s) => `😈 *Earn the right to be a gremlin first, ${mention(s)}.*`,
        ],
    },

    poke: {
        success: [
            (s,t,w) => `👉 ${mention(s)} pokes ${mention(t)} with ${w}. Bold choice of tool.`,
            (s,t,w) => `🌙 ${mention(t)} has been poked via ${w}, courtesy of ${mention(s)}.`,
            (s,t,w) => `💞 Annoying, but affectionate. Classic ${mention(s)}, classic ${w}.`,
            (s,t,w) => `✨ ${mention(t)} felt that. ${w} makes everything worse, somehow.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} pokes the air. ${mention(t)} steps aside. ${w} pokes ${mention(s)} instead, mysteriously.`,
            (s,t,w) => `😬 ${w} has a mind of its own and jabs ${mention(s)} back.`,
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
            (s,t) => `🦋 ${mention(s)}'s hand was quick. A butterfly stolen from ${mention(t)}, no weapon needed — just vibes.`,
            (s,t) => `😈 ${mention(t)} didn't even notice. Yet.`,
            (s,t) => `🌙 The moon saw ${mention(s)} do that. It said nothing. It's tired.`,
            (s,t) => `✨ ${mention(t)}'s collection is now one lighter. Thanks to ${mention(s)}.`,
        ],
        failRoll: [
            (s,t) => `🦋 ${mention(s)}'s hand reached for ${mention(t)}'s butterfly... and grabbed a moth instead. Tragic.`,
            (s,t) => `😈 Almost, ${mention(s)}. The butterfly filed a restraining order.`,
            (s,t) => `🌙 The moon tripped ${mention(s)} at the last second. Petty, but effective.`,
        ],
        failEmpty: [
            (s,t) => `🦋 ${mention(t)} has nothing to steal, ${mention(s)}. Embarrassing for everyone involved.`,
            (s,t) => `🌙 Empty hands. ${mention(t)} had no butterflies. ${mention(s)} stole nothing but shame.`,
        ],
        failure: [
            (s) => `🌑 *${mention(s)}, you haven't earned enough trust to betray it yet.*`,
            (s) => `😈 *Strangers don't steal, ${mention(s)}. Earn first.*`,
            (s) => `🌙 *The moon doesn't enable this level of chaos yet, ${mention(s)}.*`,
        ],
    },

    stalk: {
        success: [
            (s,t) => `🌑 The moon whispers to ${mention(s)}... ${mention(t)} was last seen arguing with a vending machine.`,
            (s,t) => `👀 ${mention(s)} now knows ${mention(t)} sleeps with three pillows. Use this power wisely.`,
            (s,t) => `😈 Interesting intel, ${mention(s)}. ${mention(t)} once cried during a cereal commercial.`,
            (s,t) => `🌙 The stars spilled ${mention(t)}'s secret to ${mention(s)}: they talk to plants. Often.`,
        ],
        noData: [
            (s,t) => `🌙 The moon searched for ${mention(t)}'s trail, ${mention(s)}... and found absolutely nothing. Suspicious.`,
            (s,t) => `👀 ${mention(t)} has been suspiciously quiet, ${mention(s)}. Almost like they knew.`,
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

    // ── LETTERS ────────────────────────────────────────────

    letter: {
        send: {
            success: [
                (s,t) => `💌 A sealed letter slips into the moonlight, bound for ${mention(t)}.`,
                (s,t) => `🌙 ${mention(s)}'s words are folded into silence and sent toward ${mention(t)}.`,
                (s,t) => `✨ The letter vanishes into shadow, carrying ${mention(s)}'s secret to ${mention(t)}.`,
                (s,t) => `🦋 A sealed letter drifts away, unseen, toward ${mention(t)}.`,
            ],
            self: [
                (s) => `🌙 *${mention(s)}, even the moon won't deliver a letter to yourself.*`,
            ],
        },
        inbox: {
            empty: [
                (s) => `🌙 *No sealed letters await you tonight, ${mention(s)}.*`,
                (s) => `💌 *The moon has nothing to deliver to ${mention(s)} right now.*`,
            ],
        },
        burn: {
            success: [
                () => `🔥 The moon shall keep this secret.`,
            ],
            notFound: [
                (s) => `🌙 *${mention(s)}, that letter doesn't exist, or it isn't yours to burn.*`,
            ],
        },
    },

    // ── NEW CHAOS COMMANDS ─────────────────────────────────

    yeet: {
        success: [
            (s,t,w) => `🌙 ${mention(s)} yeets ${mention(t)} clean off the lunar balcony using ${w}. Gravity is a suggestion tonight.`,
            (s,t,w) => `😈 ${mention(t)} achieves brief, unscheduled flight courtesy of ${mention(s)} and ${w}.`,
            (s,t,w) => `✨ The stars watch ${mention(t)} sail into the void, launched by ${mention(s)} wielding ${w}.`,
            (s,t,w) => `💢 ${mention(s)} yeets with intent. ${w} was merely an accessory to the crime.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} winds up to yeet ${mention(t)} with ${w}... and yeets themselves instead. Rookie mistake.`,
            (s,t,w) => `😬 ${w} slips. ${mention(s)} is the one now sailing into the void.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you need history before you launch someone into the void.*`,
            (s) => `😈 *Earn the right to yeet, ${mention(s)}.*`,
        ],
    },

    bonk: {
        success: [
            (s,t,w) => `🔨 ${mention(s)} bonks ${mention(t)} with ${w}. Go to normal jail.`,
            (s,t,w) => `🌙 A clean bonk, courtesy of ${mention(s)} and ${w}. ${mention(t)} respects the technique.`,
            (s,t,w) => `😈 ${mention(t)} has been bonked via ${w}. ${mention(s)} feels powerful.`,
            (s,t,w) => `✨ The moon awards ${mention(s)} style points for bonking ${mention(t)} with ${w}.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} raises ${w} to bonk ${mention(t)}... and bonks themselves on the way up.`,
            (s,t,w) => `😬 ${w} has had enough of ${mention(s)}'s nonsense and bonks back.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, bonk privileges require a bond first.*`,
            (s) => `🔨 *Not yet, ${mention(s)}. The moon confiscates the bonk stick.*`,
        ],
    },

    banish: {
        success: [
            (s,t,w) => `🌑 ${mention(s)} banishes ${mention(t)} to the Shadow Realm using ${w}. They'll be back in five minutes, probably.`,
            (s,t,w) => `😈 ${mention(t)} has been temporarily yeeted into another dimension by ${mention(s)} and ${w}.`,
            (s,t,w) => `🌙 The moon dims as ${mention(s)} casts ${mention(t)} into the void, ${w} in hand.`,
            (s,t,w) => `✨ A dramatic banishment. ${mention(s)} really committed to the bit with ${w}.`,
        ],
        backfire: [
            (s,t,w) => `🌑 ${mention(s)} opens a portal with ${w} to banish ${mention(t)}... and falls in themselves.`,
            (s,t,w) => `😬 The Shadow Realm rejects ${mention(t)} and takes ${mention(s)} instead. Awkward.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, banishment is a serious power. Earn it.*`,
            (s) => `🌑 *The Shadow Realm doesn't take requests from strangers, ${mention(s)}.*`,
        ],
    },

    // ── FUN ────────────────────────────────────────────────

    choke: {
        success: [
            (s,t,w) => `😤 ${mention(s)} dramatically chokes ${mention(t)} with ${w}. Very telenovela of them.`,
            (s,t,w) => `🌙 ${mention(t)} clutches their throat theatrically. ${mention(s)} takes a bow with ${w} still in hand.`,
            (s,t,w) => `✨ Pure soap-opera energy from ${mention(s)}, ${w} included at no extra charge.`,
            (s,t,w) => `😈 ${mention(t)} gasps SO dramatically the moon gives ${mention(s)} a standing ovation.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} reaches for ${mention(t)} with ${w} and trips over their own drama instead.`,
            (s,t,w) => `😬 ${mention(t)} dodges. ${mention(s)} chokes on their own ambition.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, that's WAY too dramatic for a stranger.*`,
            (s) => `😈 *Earn the theatrics, ${mention(s)}.*`,
        ],
    },

    spank: {
        success: [
            (s,t,w) => `👋 ${mention(s)} spanks ${mention(t)} with ${w}. A bold, silly choice.`,
            (s,t,w) => `🌙 ${mention(t)} yelps. ${mention(s)} grins, ${w} still swinging.`,
            (s,t,w) => `😈 Pure chaos energy from ${mention(s)}, courtesy of ${w}.`,
            (s,t,w) => `✨ ${mention(t)} did not consent to this ${w}-based nonsense, but here we are.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} winds up with ${w} and smacks their own hand instead. Ow.`,
            (s,t,w) => `😬 ${w} betrays ${mention(s)} at the worst possible moment.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, that level of silliness requires a bond first.*`,
            (s) => `😈 *Strangers don't get the ${mention(s)} treatment yet.*`,
        ],
    },

    punish: {
        success: [
            (s,t,w) => `😤 ${mention(s)} sentences ${mention(t)} to the Corner of Shame, ${w} confiscated as evidence.`,
            (s,t,w) => `🌙 The Moon Consort presides over ${mention(s)}'s punishment of ${mention(t)}. ${w} is Exhibit A.`,
            (s,t,w) => `✨ ${mention(t)} has been formally punished. The crime: existing near ${mention(s)} and ${w}.`,
            (s,t,w) => `😈 Justice, served by ${mention(s)}, garnished with ${w}.`,
        ],
        backfire: [
            (s,t,w) => `🌙 ${mention(s)} attempts to punish ${mention(t)} with ${w}... and gets sent to the corner instead.`,
            (s,t,w) => `😬 The gavel (${w}) backfires. ${mention(s)} is now on trial.`,
        ],
        failure: [
            (s) => `🌙 *${mention(s)}, you have no authority over a stranger.*`,
            (s) => `😈 *Earn the right to punish, ${mention(s)}.*`,
        ],
    },

    ship: {
        high: [
            (a,b) => `💞 The stars are practically screaming. ${mention(a)} and ${mention(b)} are basically destiny at this point.`,
            (a,b) => `🌙 The Moon Consort nods approvingly at ${mention(a)} and ${mention(b)}. Soulmate behavior.`,
            (a,b) => `✨ Off the charts. ${mention(a)} and ${mention(b)} should probably just elope.`,
        ],
        mid: [
            (a,b) => `🌸 There's something here between ${mention(a)} and ${mention(b)}. Not nothing, not everything.`,
            (a,b) => `🌙 The moon shrugs. ${mention(a)} and ${mention(b)} could go either way, honestly.`,
            (a,b) => `✨ Decent odds for ${mention(a)} and ${mention(b)}. Worth a coffee date, at least.`,
        ],
        low: [
            (a,b) => `😬 The stars are... politely declining to comment on ${mention(a)} and ${mention(b)}.`,
            (a,b) => `🌙 The moon suggests ${mention(a)} and ${mention(b)} stay friends. Just friends.`,
            (a,b) => `✨ Compatibility: questionable. ${mention(a)} and ${mention(b)}, maybe try a different ship.`,
        ],
    },

    eightball: {
        answers: [
            () => `🌙 The moon says: yes, obviously.`,
            () => `🎱 Signs point to... absolutely not.`,
            () => `✨ Ask again when Mercury isn't in retrograde.`,
            () => `😈 The moon refuses to answer that one. Too spicy.`,
            () => `🌑 Outlook hazy. Try yelling at the sky instead.`,
            () => `💫 It is decided: yes, but you won't like it.`,
            () => `🌸 The stars say maybe. Helpful, I know.`,
        ],
    },

    roast: {
        lines: [
            (t) => `🔥 ${mention(t)}, you bring everyone so much joy... when you leave the room.`,
            (t) => `😈 ${mention(t)} has the energy of a Wi-Fi signal with one bar.`,
            (t) => `🌙 The moon looked at ${mention(t)} and decided to set early.`,
            (t) => `✨ ${mention(t)} is proof that evolution can, in fact, take a break.`,
            (t) => `💀 ${mention(t)}, the gene pool called. It wants a lifeguard.`,
        ],
    },

    fortune: {
        nothing: [
            (s) => `🌙 *The moon offers only silence tonight, ${mention(s)}. Sometimes that's the message.*`,
            (s) => `✨ *No omens today, ${mention(s)}. The stars are on break.*`,
            (s) => `🌑 *${mention(s)}, today is simply... a day. Average. Unremarkable. Go outside.*`,
        ],
        butterfly: [
            (s) => `🦋 A white butterfly drifts down to ${mention(s)}, a small gift from the moon.`,
            (s) => `✨ Fortune smiles on ${mention(s)}. A butterfly appears, unbothered and free.`,
        ],
        blessing: [
            (s) => `🌸 The moon bestows a rare blessing upon ${mention(s)} tonight.`,
            (s) => `🌙 ${mention(s)} has been noticed by the moon itself. A blessing follows.`,
        ],
    },

    pet: {
        adopt: {
            success: [
                (s, species, name) => `🧸 ${mention(s)} adopts ${species}, naming it **${name}**. A bond begins.`,
                (s, species, name) => `🌙 The moon presents ${mention(s)} with ${species}. They've named it **${name}**.`,
                (s, species, name) => `✨ ${species} chose ${mention(s)} just as much as the other way around. Welcome, **${name}**.`,
            ],
            alreadyHave: [
                (s) => `🌙 *${mention(s)}, you already have a companion. One moonlit pet at a time.*`,
            ],
        },
        feed: {
            success: [
                (s, name) => `🍎 **${name}** seems happy after being fed by ${mention(s)}.`,
                (s, name) => `🌙 **${name}** nuzzles closer to ${mention(s)}.`,
                (s, name) => `✨ **${name}** gains affection for ${mention(s)}.`,
            ],
            cooldown: [
                (s) => `🌙 *Your pet isn't hungry yet, ${mention(s)}. Give it some time.*`,
            ],
        },
        play: {
            success: [
                (s, name) => `🦋 ${mention(s)} plays with **${name}**. Pure joy.`,
                (s, name) => `🎁 **${name}** brings ${mention(s)} a small gift mid-play.`,
                (s, name) => `🌸 A blessed little moment between ${mention(s)} and **${name}**.`,
            ],
            cooldown: [
                (s) => `🌙 *Your pet is tired, ${mention(s)}. Let it rest a while.*`,
            ],
        },
        noPet: [
            (s) => `🌙 *${mention(s)}, you don't have a pet yet. Try \`/pet adopt\`.*`,
        ],
    },


    // ── BUTTON RESPONSES ────────────────────────────────────
    button: {
        decline: [
            (s,t) => `🌙 ${mention(t)} steps back gently. Perhaps another time, ${mention(s)}.`,
            (s,t) => `✨ ${mention(t)} lets the moment pass. The moon understands.`,
            (s,t) => `🌸 Not tonight. ${mention(t)} has spoken.`,
            (s,t) => `😶 ${mention(s)} is left standing alone. The stars look away politely.`,
        ],
    },


    // ── BUTTON PROMPTS (shown before target accepts/declines) ────
    prompts: {
        kiss:    [(s,t) => `💋 <@${s}> leans in toward <@${t}>... the moon holds its breath.`,
                  (s,t) => `🌙 <@${s}> wants to kiss <@${t}>. Will they allow it?`,
                  (s,t) => `✨ <@${s}> reaches for <@${t}>'s cheek. The stars await.`],
        hug:     [(s,t) => `🤗 <@${s}> opens their arms toward <@${t}>. Do you step in?`,
                  (s,t) => `🌙 <@${s}> would like to hug <@${t}>. The moon watches warmly.`],
        cuddle:  [(s,t) => `🧸 <@${s}> wants to cuddle up with <@${t}>. Will you let them?`,
                  (s,t) => `🌙 <@${s}> edges closer to <@${t}>. Your move.`],
        snuggle: [(s,t) => `🥰 <@${s}> wants to snuggle <@${t}>. Do you allow it?`,
                  (s,t) => `🌙 <@${s}> has chosen <@${t}> as their snuggle target.`],
        pat:     [(s,t) => `🐾 <@${s}> raises a hand toward <@${t}>'s head. Pat incoming.`,
                  (s,t) => `✨ <@${s}> wants to pat <@${t}>. Do you accept?`],
        comfort: [(s,t) => `🌸 <@${s}> reaches out to comfort <@${t}>. Will you let them?`,
                  (s,t) => `💞 <@${s}> wants to be there for <@${t}>. Do you accept?`],
        tease:   [(s,t) => `😏 <@${s}> has that look. <@${t}>, you're the target.`,
                  (s,t) => `😈 <@${s}> is about to tease <@${t}>. Brace yourself.`],
        slap:    [(s,t) => `👋 <@${s}> is winding up to slap <@${t}>. Dare you stand there?`,
                  (s,t) => `😈 <@${s}> has chosen violence. <@${t}>, you've been warned.`],
        step:    [(s,t) => `🦶 <@${s}> is about to step on <@${t}>. Intentionally.`,
                  (s,t) => `😈 <@${s}> eyes <@${t}>'s foot. This is going to happen.`],
        poke:    [(s,t) => `👉 <@${s}> extends a finger toward <@${t}>. You feel it coming.`,
                  (s,t) => `🌙 <@${s}> is going to poke <@${t}>. Resistance is futile.`],
        yeet:    [(s,t) => `🌙 <@${s}> is preparing to yeet <@${t}> into the void.`,
                  (s,t) => `😈 <@${s}> has acquired a launch trajectory for <@${t}>.`],
        bonk:    [(s,t) => `🔨 <@${s}> raises something at <@${t}>. A bonk is imminent.`,
                  (s,t) => `😈 <@${s}> has selected <@${t}> for bonking.`],
        banish:  [(s,t) => `🌑 <@${s}> is opening a portal. <@${t}>, pack your bags.`,
                  (s,t) => `😈 <@${s}> points at <@${t}>. The shadow realm awaits.`],
        haunt:   [(s,t) => `👻 <@${s}> has chosen to haunt <@${t}> from the shadows.`,
                  (s,t) => `🌙 <@${s}> fades into the dark near <@${t}>.`],
        ignore:  [(s,t) => `😶 <@${s}> is about to very deliberately not look at <@${t}>.`,
                  (s,t) => `🌙 <@${s}> turns away from <@${t}>. Cold.`],
        stalk:   [(s,t) => `👀 <@${s}> has their eyes on <@${t}>. Very closely.`,
                  (s,t) => `🌑 <@${s}> is asking the moon about <@${t}>'s secrets.`],
        steal:   [(s,t) => `🦋 <@${s}> eyes <@${t}>'s butterflies. The hand is already moving.`,
                  (s,t) => `😈 <@${s}> has spotted <@${t}>'s collection. Suspicious.`],
        choke:   [(s,t) => `😤 <@${s}> is doing their best telenovela impression at <@${t}>.`,
                  (s,t) => `🌙 <@${s}> reaches dramatically toward <@${t}>'s throat.`],
        spank:   [(s,t) => `👋 <@${s}> has chosen <@${t}> as today's chaos target.`,
                  (s,t) => `😈 <@${s}> grins at <@${t}>. This is going to be silly.`],
        punish:  [(s,t) => `😤 <@${s}> raises the gavel at <@${t}>. Court is in session.`,
                  (s,t) => `🌙 <@${s}> sentences <@${t}> to the Corner of Shame.`],
        drink_share: [
            (s,t) => `🍵 <@${s}> slides a warm cup toward <@${t}>. Something moonlit and faintly glowing.`,
            (s,t) => `🌙 <@${s}> offers <@${t}> a drink beneath the stars. Will you accept?`,
            (s,t) => `✨ <@${s}> has prepared something for <@${t}>. It smells like nightjasmine and stardew.`,
        ],
        eat_share: [
            (s,t) => `🍱 <@${s}> holds out something warm toward <@${t}>. Moon-touched and carefully made.`,
            (s,t) => `🌙 <@${s}> wants to share a meal with <@${t}>. Something soft and silver-plated.`,
            (s,t) => `✨ <@${s}> has food for <@${t}>. It looks suspicious in the best way.`,
        ],
    },


    // ── DRINK ──────────────────────────────────────────────
    drink: {
        share: {
            success: [
                (s,t) => `🍵 <@${s}> and <@${t}> share a drink under silver light. Something warm passes between them.`,
                (s,t) => `🌙 The Moon Consort watches <@${s}> and <@${t}> clink cups. A quiet toast to being here.`,
                (s,t) => `✨ <@${t}> accepts the cup from <@${s}>. It tastes like moonlight and something almost remembered.`,
                (s,t) => `🍵 A drink shared between <@${s}> and <@${t}>. The night feels warmer for it.`,
            ],
        },
        force: {
            success: [
                (s,t) => `😈 <@${s}> shoves a mysterious vial at <@${t}>. It's bubbling. It's probably fine.`,
                (s,t) => `🌙 <@${t}> didn't agree to this. <@${s}> didn't ask. The potion is already halfway down.`,
                (s,t) => `✨ <@${s}> force-feeds <@${t}> something that glows faintly purple. Medical advice not included.`,
                (s,t) => `😬 The liquid <@${s}> poured into <@${t}> smelled like regret and tasted worse. They'll be fine. Probably.`,
            ],
            backfire: [
                (s,t) => `🌙 <@${s}> goes to force a drink on <@${t}> and inhales the fumes instead. Classic.`,
                (s,t) => `😬 The suspicious potion slips and <@${s}> drinks the whole thing themselves. <@${t}> watches in horror.`,
            ],
            failure: [
                (s) => `🌙 *<@${s}>, you cannot force-feed a stranger. Build the bond first.*`,
                (s) => `😈 *The moon confiscates the potion from <@${s}>. Not yet.*`,
            ],
        },
    },

    // ── EAT ────────────────────────────────────────────────
    eat: {
        share: {
            success: [
                (s,t) => `🍱 <@${s}> and <@${t}> share a quiet meal. The food is moon-touched and inexplicably perfect.`,
                (s,t) => `🌙 Something about eating together with <@${s}> and <@${t}> makes the night feel like it matters.`,
                (s,t) => `✨ <@${t}> accepts food from <@${s}>. It tastes like somewhere safe.`,
                (s,t) => `🍱 <@${s}> and <@${t}> eat in comfortable silence. The Moon Consort approves of this.`,
            ],
        },
        force: {
            success: [
                (s,t) => `😈 <@${s}> shoves something unidentified into <@${t}>'s mouth. It's moving slightly. Bon appétit.`,
                (s,t) => `🌙 <@${t}> didn't open their mouth willingly. <@${s}> was not deterred. The moon sighs.`,
                (s,t) => `😬 <@${s}> force-feeds <@${t}> a moonherb dumpling that was definitely not inspected.`,
                (s,t) => `✨ Whatever <@${s}> fed <@${t}>, it glowed. That is not necessarily a good sign.`,
            ],
            backfire: [
                (s,t) => `🌙 <@${s}> trips while approaching <@${t}> and eats the questionable food themselves. Karma.`,
                (s,t) => `😬 <@${t}> ducks. <@${s}> gets a face full of their own suspicious cooking.`,
            ],
            failure: [
                (s) => `🌙 *<@${s}>, you cannot force-feed a stranger. That requires trust — or at least familiarity.*`,
                (s) => `😈 *Build a bond before you weaponize food, <@${s}>.*`,
            ],
        },
    },


    // ── SEDUCE ─────────────────────────────────────────────
    seduce: {
        prompts: [
            (s,t) => `💋 <@${s}> turns the full force of their attention toward <@${t}>. The moon dims slightly.`,
            (s,t) => `🌙 <@${s}> has chosen <@${t}> as tonight's target. Dangerously.`,
            (s,t) => `✨ <@${s}> leans in toward <@${t}> with entirely too much confidence.`,
            (s,t) => `😈 Something about <@${s}>'s expression makes <@${t}> nervous. In a specific way.`,
        ],
        success: [
            (s,t) => `💞 <@${t}> didn't stand a chance. <@${s}> is simply built different.`,
            (s,t) => `🌙 The Moon Consort watches <@${s}> succeed with quiet, knowing amusement.`,
            (s,t) => `✨ <@${t}> folds completely. <@${s}> accepts this as their due.`,
            (s,t) => `😈 <@${s}> didn't even try that hard. <@${t}> is simply weak to this.`,
            (s,t) => `💋 The air in the room changes. <@${t}> notices. <@${s}> knew they would.`,
        ],
        failure: [
            (s,t) => `🌙 <@${t}> raises an eyebrow at <@${s}>. One eyebrow. That's all they get.`,
            (s,t) => `😶 <@${t}> looks <@${s}> up and down and simply walks away.`,
            (s,t) => `✨ The stars tried to warn <@${s}>. They did not listen.`,
            (s,t) => `💔 <@${s}>'s attempt lands with all the grace of a wet sock. <@${t}> is unmoved.`,
        ],
    },

    // ── SLEEP ──────────────────────────────────────────────
    sleep: {
        prompts: [
            (s,t) => `🌙 <@${s}> holds out a blanket toward <@${t}>. It's time to rest.`,
            (s,t) => `✨ <@${s}> wants to tuck <@${t}> in tonight. The moon approves.`,
            (s,t) => `🌸 <@${s}> appears with something warm and soft for <@${t}>. Sleep?`,
        ],
        success: [
            (s,t) => `🌙 <@${s}> tucks <@${t}> in gently. The moon dims to a hush.`,
            (s,t) => `✨ <@${t}> is settled. <@${s}> stays a moment longer than necessary.`,
            (s,t) => `🌸 A blanket, a quiet room, and <@${s}>'s presence. <@${t}> drifts off.`,
            (s,t) => `💞 <@${s}> watches over <@${t}> until sleep finds them. The stars keep watch too.`,
            (s,t) => `🌙 Good night, <@${t}>. <@${s}> made sure of it.`,
        ],
    },

    // ── DARE ───────────────────────────────────────────────
    dare: {
        dares: [
            (t) => `😈 <@${t}> must compliment the last person who annoyed them. Out loud.`,
            (t) => `🌙 <@${t}> must speak exclusively in questions for the next 5 minutes.`,
            (t) => `✨ <@${t}> must confess their most unhinged opinion about a fictional character.`,
            (t) => `😈 <@${t}> must describe their current vibe as a weather report.`,
            (t) => `🌙 <@${t}> must send a voice message saying "I am the moon" with full commitment.`,
            (t) => `✨ <@${t}> must rate everyone they've interacted with today out of 10. No context.`,
            (t) => `😈 <@${t}> must tell the chat something they've never admitted before. It can be small. It must be true.`,
            (t) => `🌙 <@${t}> must write a one-sentence review of their own personality.`,
            (t) => `✨ <@${t}> must choose: fight one moon-sized duck, or one hundred duck-sized moons.`,
            (t) => `😈 <@${t}> must describe their sleep schedule as if it were a crime scene.`,
            (t) => `🌙 <@${t}> must assign everyone currently online a moon phase. No explanations.`,
            (t) => `✨ <@${t}> must explain what they would do if they woke up as the Moon Consort for a day.`,
        ],
    },

    // ── DAILY ──────────────────────────────────────────────
    daily: {
        butterfly: [
            (s) => `🦋 The moon left something at your door, <@${s}>. A white butterfly, unclaimed.`,
            (s) => `✨ <@${s}> checked in and the moon noticed. A butterfly drifts over.`,
        ],
        blessing: [
            (s) => `🌸 The moon bestows a quiet blessing on <@${s}> today.`,
            (s) => `✨ Something soft settles around <@${s}>. A blessing, given freely.`,
        ],
        nothing: [
            (s) => `🌙 The moon sees you, <@${s}>. Today it offers only presence. That's enough.`,
            (s) => `✨ <@${s}> checked in. The stars noted it. The night continues.`,
            (s) => `🌑 Nothing today, <@${s}>. But the moon remembers you came.`,
        ],
        cooldown: [
            (s) => `🌙 *<@${s}>, you've already checked in today. The moon will see you again tomorrow.*`,
        ],
    },

    // ── TAROT ──────────────────────────────────────────────
    tarot: {
        cards: [
            { name: '0 — The Fool', emoji: '🌟', text: 'A beginning. Unearned confidence and absolute potential. The moon says: step off the edge. The ground may or may not be there. That\'s the point.' },
            { name: 'I — The Magician', emoji: '✨', text: 'Everything you need is already in your hands. The moon says: stop waiting for permission to begin.' },
            { name: 'II — The High Priestess', emoji: '🌙', text: 'The answer exists. You already know it. The moon says: sit with the silence until you remember.' },
            { name: 'III — The Empress', emoji: '🌸', text: 'Something is growing. Slowly, surely, without your interference. The moon says: tend it gently.' },
            { name: 'IV — The Emperor', emoji: '👑', text: 'Structure. Order. The shape a life takes when someone decides to take it seriously. The moon says: build something that lasts.' },
            { name: 'V — The Hierophant', emoji: '📜', text: 'Tradition speaks. Whether you listen is up to you. The moon says: know the rules before you decide which ones to break.' },
            { name: 'VI — The Lovers', emoji: '💞', text: 'A choice presented as a feeling. The moon says: the heart already knows. The mind is just stalling.' },
            { name: 'VII — The Chariot', emoji: '🔥', text: 'Forward. No matter what. The moon says: the direction is right even if the road is rough.' },
            { name: 'VIII — Strength', emoji: '🦁', text: 'Not force. Something quieter. The moon says: the hardest thing you\'ll ever hold is yourself, gently.' },
            { name: 'IX — The Hermit', emoji: '🕯️', text: 'Solitude with purpose. The moon says: find the lantern inside yourself before you try to light the way for others.' },
            { name: 'X — Wheel of Fortune', emoji: '🌀', text: 'Things change. They always have. The moon says: learn to move with the turning rather than clinging to any one point on the wheel.' },
            { name: 'XI — Justice', emoji: '⚖️', text: 'What is owed will be settled. The moon says: the accounting is already underway, whether or not you can see it.' },
            { name: 'XII — The Hanged Man', emoji: '🌑', text: 'Stillness chosen willingly. The moon says: sometimes surrender is the only way through.' },
            { name: 'XIII — Death', emoji: '🍂', text: 'An ending that makes room. The moon says: let the thing that is already over be over.' },
            { name: 'XIV — Temperance', emoji: '🌊', text: 'Balance. Flow. The space between too much and not enough. The moon says: you already know which way you\'re tilting.' },
            { name: 'XV — The Devil', emoji: '😈', text: 'The chain you\'re wearing is one you put on yourself. The moon says: the clasp is right there. You can take it off whenever you decide to.' },
            { name: 'XVI — The Tower', emoji: '⚡', text: 'Something falls. It was going to fall anyway. The moon says: what couldn\'t hold you up was never a foundation.' },
            { name: 'XVII — The Star', emoji: '⭐', text: 'After everything — hope. Quiet, persistent, unreasonable hope. The moon says: this one is not a question.' },
            { name: 'XVIII — The Moon', emoji: '🌕', text: 'Illusion. Instinct. The way things look at 3am. The moon says: not everything in the dark is a threat. Some of it is just the truth waiting for you to adjust your eyes.' },
            { name: 'XIX — The Sun', emoji: '☀️', text: 'Clarity. Joy without explanation. The moon says: you are allowed to feel this without waiting for the other shoe.' },
            { name: 'XX — Judgement', emoji: '🔔', text: 'The call has come. The moon says: you\'ve been given enough time to prepare. You are more ready than you think.' },
            { name: 'XXI — The World', emoji: '🌍', text: 'Completion. The long thing is done. The moon says: stand in it for a moment before you start the next one.' },
        ],
    },

    // ── TRUTH OR DARE ──────────────────────────────────────
    tod: {
        truths: [
            (t) => `🌙 <@${t}>, what's something you've never admitted in this server?`,
            (t) => `✨ <@${t}>, who here do you think about most? You don't have to say why.`,
            (t) => `🌙 <@${t}>, what's the most unhinged thing you've done for someone you liked?`,
            (t) => `💞 <@${t}>, have you ever had feelings for someone in this server? Don't name names. Just: yes or no.`,
            (t) => `😈 <@${t}>, what's a lie you've told that you never corrected?`,
            (t) => `🌙 <@${t}>, what's something you wish someone here would say to you?`,
            (t) => `✨ <@${t}>, describe your type in three words. No elaboration.`,
            (t) => `🌙 <@${t}>, what's the most embarrassing thing you've done online?`,
            (t) => `💞 <@${t}>, have you ever sent a message and immediately regretted it? What was the vibe?`,
            (t) => `😈 <@${t}>, what's something you pretend not to care about but actually care about deeply?`,
            (t) => `🌙 <@${t}>, who in this server would you trust with a secret?`,
            (t) => `✨ <@${t}>, what's your most irrational fear? The moon demands honesty.`,
            (t) => `🌙 <@${t}>, what's something you find attractive that you've never told anyone?`,
            (t) => `💞 <@${t}>, if you could tell someone here something anonymously, what would it be?`,
            (t) => `😈 <@${t}>, what's the pettiest thing you've ever done and felt zero guilt about?`,
            (t) => `🌙 <@${t}>, what's a version of yourself you've left behind that you kind of miss?`,
            (t) => `✨ <@${t}>, what's the last thing that made you genuinely emotional?`,
            (t) => `🌙 <@${t}>, if someone here could read your mind right now, who would that be the most awkward for?`,
            (t) => `💞 <@${t}>, what do you think people misunderstand about you?`,
            (t) => `😈 <@${t}>, what's a thought you had recently that surprised even you?`,
            (t) => `🌙 <@${t}>, is there something unsaid between you and someone in this server right now?`,
            (t) => `✨ <@${t}>, what's something small someone did that you'll never forget?`,
        ],
    },

    // ── TRUTH OR DARE ──────────────────────────────────────
    tod: {
        truths: [
            (t) => `🌙 <@${t}>, what is something you have never told anyone in this server?`,
            (t) => `✨ <@${t}>, what is the most embarrassing thing you have done for someone you liked?`,
            (t) => `🌙 <@${t}>, who in this server do you think about the most and why?`,
            (t) => `✨ <@${t}>, what is a habit you have that you hope no one has noticed?`,
            (t) => `🌙 <@${t}>, what is the last lie you told and who was it to?`,
            (t) => `✨ <@${t}>, if you had to describe your current situation as a weather forecast, what would it be?`,
            (t) => `🌙 <@${t}>, what is something you pretend to like but actually cannot stand?`,
            (t) => `✨ <@${t}>, what is your most irrational fear that you have never admitted out loud?`,
            (t) => `🌙 <@${t}>, who was your first real crush and what happened?`,
            (t) => `✨ <@${t}>, what is the most dramatic thing you have done when you were upset?`,
            (t) => `🌙 <@${t}>, what is something about yourself that took you a long time to accept?`,
            (t) => `✨ <@${t}>, if the Moon Consort could reveal one of your secrets right now, what would you be most afraid of?`,
            (t) => `🌙 <@${t}>, what is the most childish thing you still do?`,
            (t) => `✨ <@${t}>, who in your life have you hurt and never properly apologized to?`,
            (t) => `🌙 <@${t}>, what is something you want but are too proud to ask for?`,
            (t) => `✨ <@${t}>, what is your most toxic trait and do you think you are working on it?`,
            (t) => `🌙 <@${t}>, what is a version of yourself you left behind that you still miss?`,
            (t) => `✨ <@${t}>, what is one thing someone said to you that you still think about?`,
            (t) => `🌙 <@${t}>, what is your love language and do you think the people close to you know it?`,
            (t) => `✨ <@${t}>, if you could send an anonymous message to anyone in this server right now, what would it say?`,
            (t) => `🌙 <@${t}>, what is a belief you used to hold that you are now embarrassed by?`,
            (t) => `✨ <@${t}>, when was the last time you cried and what was it about?`,
            (t) => `🌙 <@${t}>, what is the most petty thing you have done and do you regret it?`,
        ],
    },


};
