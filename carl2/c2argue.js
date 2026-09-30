'use strict';
// ================= CARL 2: ARGUMENTS (turn-based). wear down their PATIENCE before Carl loses his COMPOSURE =================
const ARG2 = ['LOGIC', 'GRIEVANCE', 'DENIAL', 'RANT'];
const ARG2_BASE = { LOGIC: 5, GRIEVANCE: 6, DENIAL: 5 };
const CARL_ARGS2 = {
  LOGIC: ['Okay, walk through it with me. Step one: I\'m right. Step two—', 'That doesn\'t make sense. Say it again. See? Doesn\'t make sense twice.', 'I have a point. I\'m making it. This, right here, is the point.', 'Hold on. If that\'s true then why are you— no, answer that. Answer that one.'],
  GRIEVANCE: ['Why are you talking to me like that? Chat, did you hear how they said that?', 'You know what, that\'s actually offensive. To me. Specifically.', 'I\'ve been nothing but polite! Mostly! Recently!', 'You said it with your face. I saw your face say it.'],
  DENIAL: ['I\'m a normal human. Look at my normal human... hat.', 'That wasn\'t me. That was a different small green guy.', 'I don\'t know what you\'re talking about. I\'ve never known anything.', 'I\'m from Nevada. Above and below. That\'s a place.'],
  RANT: ['AND ANOTHER THING—', 'You want to know what I think? You don\'t. Too late. Here it comes.', 'Everything! Everything is the problem! The mall! Nevada! Pretzels! Sequels!', 'NOBODY asked for a second one! I didn\'t! I was THERE!'],
};
// HU-MAN's lines: every one of them is a line a writer should have cut
const QUIPS = ['Nobody tells me what to do.', 'Great job, genius.', 'Relax. Everything went exactly as planned.', 'Your knight in shining armor has arrived.', 'I come in peace, earthling.', 'Their firewall is no match for me.', 'I\'m right and everyone else is an idiot.', 'Let\'s blow up the universe!'];
let AB = null;
const argueScene = {
  update() { AB.t++; for (const c of AB.chat) c.t--; AB.chat = AB.chat.filter(c => c.t > 0); if (post.flash > 0 && !DLG) post.flash = Math.max(0, post.flash - .05); },
  draw() {
    const f = AB.foe; skyD(0, H, f.bg ? f.bg[0] : '#241040', f.bg ? f.bg[1] : '#000010');
    for (let i = 0; i < 12; i++) { const x = (i * 57 + AB.t * (i % 3 + 1) * .3) % (W + 40) - 20; rectA(x, 30 + (i * 23) % 120, 2, 60, WHITE, .06); }
    rectF(0, 0, W, 14, BLACK); rectF(4, 3, 26, 9, hex('#db2440')); text('LIVE', 6, 4, WHITE, 0); text('ARGUMENT: CARL VS ' + f.name, 36, 4, UI.name, 0); text((12000 + AB.t * 3 + C2.lv * 777) + ' WATCHING', W - 110, 4, UI.dim, 0);
    // foe
    const fs = AB.fshake > 0 ? (AB.fshake-- & 2) * 2 - 2 : 0, fp = f.portP || PORT[f.port];
    if (fp && !AB.gone) { rectF(186 + fs, 26, 100, 100, BLACK); drawScaled(fp.s, 188 + fs, 28, fp.P, 2); frameRect(186 + fs, 26, 100, 100, UI.edge); }
    text(f.name, 186, 130, UI.name); rectF(186, 140, 100, 6, hex('#301010')); rectF(186, 140, 100 * Math.max(0, f.hp) / f.max, 6, hex('#ff6d49')); text('PATIENCE', 186, 148, UI.dim);
    // Carl
    const cs = AB.cshake > 0 ? (AB.cshake-- & 2) * 2 - 2 : 0;
    rectF(22 + cs, 26, 76, 76, BLACK); drawScaled(carlMood(AB.mood), 24 + cs, 28, CP.carlPort, 1.5); frameRect(22 + cs, 26, 76, 76, UI.edge);
    text('CARL', 22, 106, UI.name); text('LV' + C2.lv, 70, 106, UI.dim); rectF(22, 116, 76, 6, hex('#102030')); rectF(22, 116, 76 * Math.max(0, AB.hp) / AB.max, 6, AB.hp < AB.max * .3 ? hex('#ff4949') : hex('#6dff92')); text('COMPOSURE', 22, 124, UI.dim);
    if (AB.boost > 1) text('x' + AB.boost, 100, 116, hex('#ffdb24'));
    if (AB.weakShown) text('WEAK: ' + AB.weakShown, 104, 26, hex('#ffdb24'));
    // chat panel
    AB.chat.slice(-6).forEach((c, i) => { const s = (c.u + ': ' + c.m).toUpperCase().slice(0, 26); text(s, 108, 40 + i * 10, c.u === 'user_000' ? hex('#ff4949') : UI.dim, 0); });
    if (WD.laugh && WD.laugh.t > 0) { WD.laugh.t--; ctext(WD.laugh.s, 16, hex('#ffffdb')); }
  },
};
function achat(m, u) { AB.chat.push({ u: u || pick(CHATTERS2), m, t: 400 }); if (AB.chat.length > 8) AB.chat.shift(); }
const amax = () => 20 + (C2.lv - 1) * 4;
async function argue2(def) {
  const foe = Object.assign({ power: 3, weak: {}, atk: ['...'] }, def); foe.max = foe.hp;
  const prevScene = scene, prevMusic = curName;
  AB = { foe, hp: amax(), max: amax(), guard: 0, boost: 1, last: null, smoked: 0, fshake: 0, cshake: 0, t: 0, chat: [], mood: 'n', turns: 0, quips: 0 };
  DBG.mode = 'argue'; DBG.argue = AB;
  sfx('alert'); for (let i = 0; i < 8; i++) { post.flash = i & 1 ? .8 : 0; await wait(3); } post.flash = 0;
  scene = argueScene; post.fade = 0; music(foe.music || 'argue');
  await say(foe.intro || (foe.name + ' WANTS TO ARGUE!'));
  if (!F2('tutArg2')) { setF2('tutArg2'); await say('ARGUMENT! Wear down their PATIENCE before Carl loses his COMPOSURE. Mix it up: saying the same thing twice is weaker. Chat can help. Chat can also not help.'); }
  if (foe.pre) await foe.pre();
  let result = null;
  while (result === null) {
    const opts = ['ARGUE', 'DEFLECT', 'ASK CHAT', 'SMOKE', 'PRETZEL (' + C2.pretzels + ')'];
    if (F2('power')) opts.splice(1, 0, 'HU-MAN QUIP');
    if (C2.comp === 'garf') opts.push('GARFIELD: EVIDENCE'); if (C2.comp === 'bruce') opts.push('BRUCE: CHOMP');
    if (foe.extra) opts.push(...foe.extra.map(x => x.label));
    DLG = { who: null, lines: ['WHAT WILL CARL DO?'], n: 99, arrow: 0 };
    const c = opts[await choose(opts, { x: 108, y: 70 })]; DLG = null;
    let acted = true;
    if (c === 'ARGUE') { DLG = { who: null, lines: ['ARGUE HOW?'], n: 99 }; const t = await choose(ARG2, { x: 112, y: 82, cancel: 1 }); DLG = null; if (t < 0) acted = false; else await carlArg2(ARG2[t]); }
    else if (c === 'HU-MAN QUIP') await humanQuip();
    else if (c === 'DEFLECT') { AB.mood = 'n'; await C(pick(['I\'m not mad. I\'m not. This is my calm face.', 'Okay. Breathe. Humans breathe. I\'m breathing.', 'Mm-hm. Mm-hm. Sure. Go on. I\'m listening. I\'m not listening.'])); AB.guard = 1; aheal(5); await say('CARL BRACES HIMSELF. COMPOSURE +5.'); }
    else if (c === 'ASK CHAT') await argueChat();
    else if (c === 'SMOKE') acted = await argueSmoke();
    else if (c && c.startsWith('PRETZEL')) { if (C2.pretzels <= 0) { await C('No pretzels. I ate them. I was stressed. I\'m still stressed.'); acted = false; } else { C2.pretzels--; aheal(12); sfx('get'); await say('CARL EATS A PRETZEL. STILL WARM. COMPOSURE +12.'); } }
    else if (c === 'GARFIELD: EVIDENCE') { await say(pick(['Hm.', 'Let me see that.', 'Interesting. For a Tuesday.']), 'JB GARFIELD'); const best = Object.keys(foe.weak).find(k => foe.weak[k] >= 2); AB.weakShown = best || 'NOTHING'; AB.boost = 1.5; await say(best ? 'GARFIELD PRESENTS EVIDENCE. THEIR WEAK SPOT IS ' + best + '. NEXT ARGUMENT x1.5.' : 'GARFIELD PRESENTS EVIDENCE. THERE IS NO WEAK SPOT. NEXT ARGUMENT x1.5 ANYWAY. IT\'S A CONFIDENCE THING.'); }
    else if (c === 'BRUCE: CHOMP') { await say(pick(['Chomp.', 'I\'m going to bite them. Emotionally.', 'Sharks don\'t argue. We just do this.']), 'BRUCE'); await ahit(8 + C2.lv, 'CHOMP.'); }
    else if (foe.extra) { const x = foe.extra.find(q => q.label === c); if (x) acted = (await x.fn()) !== false; }
    if (!acted) continue;
    AB.turns++;
    if (foe.hp <= 0) { result = true; break; }
    if (AB.hp <= 0) { result = false; break; }
    await argueFoeTurn();
    if (foe.hp <= 0) result = true; else if (AB.hp <= 0) result = false;
  }
  if (result) { AB.gone = 1; sfx('get'); if (foe.win) await say(foe.win, foe.who || foe.name); await say('CARL WON THE ARGUMENT!'); gainXP(foe.xp || 12); DBG.argWins = (DBG.argWins || 0) + 1; }
  else { sfx('powerdown'); if (foe.lose) await say(foe.lose, foe.who || foe.name); await say('CARL LOST HIS COOL!'); DBG.argLosses = (DBG.argLosses || 0) + 1; }
  await fadeOut(.08); scene = prevScene; music(prevMusic); DBG.mode = 'world'; const quips = AB.quips; AB = null; await fadeIn(.08);
  DBG.lastQuips = quips;
  return result;
}
function aheal(n) { AB.hp = Math.min(AB.max, AB.hp + n); }
async function ahit(d, note) { sfx('hurt'); AB.fshake = 18; AB.foe.hp -= d; await say((note ? note + ' ' : '') + 'PATIENCE -' + d + '.'); }
async function carlArg2(type) {
  const foe = AB.foe; let m = foe.weak[type] !== undefined ? foe.weak[type] : 1;
  AB.mood = type === 'GRIEVANCE' || type === 'RANT' ? 'a' : type === 'DENIAL' ? 'w' : 'n';
  const lines = (foe.carl && foe.carl[type]) || CARL_ARGS2[type];
  await C(pick(lines), AB.mood);
  if (type === AB.last) { await say('...CARL ALREADY SAID THAT. LOUDER DOESN\'T COUNT.'); m *= .4; }
  AB.last = type;
  let dmg = type === 'RANT' ? 2 + rnd(13) : ARG2_BASE[type];
  dmg = Math.round(dmg * m * AB.boost * (1 + (C2.lv - 1) * .1)); AB.boost = 1;
  const nt = m >= 2 ? 'THAT ONE LANDED!' : m === 0 ? 'IT HAD NO EFFECT.' : m < 1 ? 'THEY DIDN\'T REALLY CARE.' : type === 'RANT' && dmg >= 10 ? 'A DEVASTATING RANT!' : '';
  if (foe.react && foe.react[type]) await say(foe.react[type], foe.who || foe.name);
  achat(m >= 2 ? pick(['OHHHH', 'HE GOT EM', 'W', 'CARL CARL CARL']) : m === 0 ? pick(['L', 'bro', 'that did nothing']) : pick(['ok', 'lol', 'sure']));
  await ahit(Math.max(0, dmg), nt);
  if (type === 'RANT') { AB.hp -= 2; AB.cshake = 10; await say('CARL IS WINDED. COMPOSURE -2.'); }
}
async function humanQuip() {
  const foe = AB.foe; AB.mood = 'jaw'; AB.quips++;
  const q = pick(QUIPS); await say(q, 'CARL', { port: { s: CS.carlPorts.jaw, P: CP.carlPort } });
  addHuman(3, 'quip');
  achat(pick(['...what', 'who wrote that', 'that\'s not carl', 'cringe', 'he sounds like the billboard']));
  if (foe.immuneQuip) { await say(foe.immuneQuip, foe.who || foe.name); await say('IT HAD NO EFFECT. HUMAN +3%.'); return; }
  laugh('[CANNED LAUGHTER]');
  await ahit(Math.round(11 + C2.lv * 2), 'IT\'S VERY SLICK.');
  await C(pick(['...Why did I say that. That wasn\'t mine. It came out polished.', 'I don\'t talk like that. Do I talk like that? Chat, do I talk like that now?', 'That worked. I hate that that worked.']), 'w');
}
async function argueChat() {
  const f = AB.foe; await C(pick(['Chat. CHAT. Help.', 'Chat, back me up here.', 'Chat, what do I say? Quick. Quick quick.']), 'w');
  if (f.chatBoost && f.hp <= f.max / 2) { for (const m of ['WE ARE WITH YOU CARL', 'CARL CARL CARL', 'say it carl', f.name.toLowerCase() + ' L']) { achat(m); await wait(14); } achat('we are watching them now', 'user_000'); await say('CHAT JOINS THE ARGUMENT!'); return ahit(18, 'THE WHOLE CHAT PILES ON!'); }
  const r = Math.random(), best = Object.keys(f.weak).find(k => f.weak[k] >= 2);
  if (r < .45 && best) { achat('try ' + best.toLowerCase()); await wait(20); AB.boost = 1.5; AB.weakShown = best; await C('Okay. Okay, yeah. ' + best.charAt(0) + best.slice(1).toLowerCase() + '. Noted. I was gonna do that.'); await say('CARL FEELS SUPPORTED. NEXT ARGUMENT x1.5.'); }
  else if (r < .75) { achat('W CARL'); achat('CARL CARL CARL'); aheal(7); await say('CHAT HYPES CARL UP. COMPOSURE +7.'); }
  else { achat('just scream'); achat('SCREAM'); await wait(20); await C('AAAAAAAAAAAAAAA!', 'a'); AB.hp -= 3; AB.cshake = 10; await say('THAT WAS BAD ADVICE. CARL TOOK IT ANYWAY. COMPOSURE -3.'); }
}
async function argueSmoke() {
  if (AB.smoked >= 2) { await C('I\'m not out. I\'m just... pacing myself. Humans pace.'); return false; }
  AB.smoked++; sfx('crowd'); post.wave = 3; await wait(24); post.wave = 0; AB.mood = 'h';
  await C(pick(['Just a little. For my nerves. My regular human nerves.', 'Okay. Okay. Better. Everything\'s wobbly, but better.', 'Hold on. Hold on. I think I see... no. Yeah. No. Hold on.']), 'h');
  aheal(10); await say('COMPOSURE +10.');
  if (AB.foe.smoke) await AB.foe.smoke();
  return true;
}
async function argueFoeTurn() {
  const f = AB.foe;
  if (f.turn) { const r = await f.turn(AB); if (r === 'skip') return; }
  await say(pick(f.hp < f.max / 2 && f.low ? f.low : f.atk), f.who || f.name);
  let d = f.power + rnd(3); if (AB.guard) { d = Math.ceil(d / 2); AB.guard = 0; }
  sfx('hurt'); AB.cshake = 16; AB.hp -= d; AB.mood = 'w';
  if (Math.random() < .5) achat(pick(['oof', 'she got him', 'L', 'carl respond', 'he is NOT taking that', 'ratio']));
  await say('CARL\'S COMPOSURE -' + d + '.');
}
