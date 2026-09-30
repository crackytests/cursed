'use strict';
// ================= ARGUMENTS: turn-based battle system =================
// Wear down the other side's PATIENCE before Carl loses his COMPOSURE.
const ARG_TYPES = ['LOGIC', 'GRIEVANCE', 'DENIAL', 'RANT'];
const ARG_BASE = { LOGIC: 4, GRIEVANCE: 5, DENIAL: 4 };
const CARL_ARGS = {
  LOGIC: ['Okay, walk through it with me. Step one: I\'m right. Step two—', 'That doesn\'t make sense. Say it again. See? Doesn\'t make sense twice.', 'I have a point. I\'m making the point. This, right here, is the point.'],
  GRIEVANCE: ['Why are you talking to me like that? Chat, did you hear how they said that?', 'You know what, that\'s actually offensive. To me. Specifically.', 'I\'ve been nothing but polite! Mostly! Recently!'],
  DENIAL: ['I\'m a normal human. Look at my normal human... hat.', 'That wasn\'t me. That was a different small green guy.', 'I don\'t know what you\'re talking about. I\'ve never known anything.'],
  RANT: ['AND ANOTHER THING—', 'You want to know what I think? You don\'t. Too late. Here it comes.', 'Everything! Everything is the problem! The mall! Nevada! Pretzels!'],
};
const lvl = () => F('lv') || 1;
const maxC = () => 20 + (lvl() - 1) * 5;
let B = null;

function bar(x, y, w, v, m) { rect(x, y, w, 5, 3); const f = Math.max(0, Math.round((w - 2) * v / m)); rect(x + 1, y + 1, f, 3, v / m < .3 ? 1 : 0); }
function foeSprite(n) {
  let s = SPR[n]; if (!s) return null;
  if (s.down) s = s.down[0];
  if (Array.isArray(s)) s = s[((frame / 20) | 0) % s.length];
  return s;
}
const battleScene = {
  update() {},
  draw() {
    cls(0);
    for (let y = 40; y < 100; y += 6) rect(0, y, W, 1, 1);
    const f = B.foe, s = foeSprite(f.spr);
    const fs = B.fshake > 0 ? (B.fshake-- & 2) - 1 : 0, cs = B.cshake > 0 ? (B.cshake-- & 2) - 1 : 0;
    rect(100, 44, 56, 3, 2);
    if (s && !B.gone) { const sc = s.w <= 16 && s.h <= 16 ? 2 : 1; bigblit(s, 128 - s.w * sc / 2 + fs * 2, 44 - s.h * sc, sc, f.pmap); }
    box(2, 2, 90, 26); text(f.name, 7, 6); text('PAT', 7, 16, 2); bar(26, 17, 60, Math.max(0, f.hp), f.max);
    box(2, 30, 90, 26); text('CARL', 7, 34); text('LV' + lvl(), 64, 34, 2); text('COM', 7, 44, 2); bar(26, 45, 60, Math.max(0, B.hp), B.max);
    bigblit(SPR.carl.up[0], 12 + cs * 2, 64, 2);
  },
};
async function flashIn() { sfx('alert'); for (let i = 0; i < 8; i++) { fx.invert = i & 1; await wait(4); } fx.invert = 0; }

// returns true if Carl wins
async function argue(def) {
  const foe = Object.assign({ power: 3, weak: {} }, def); foe.max = foe.hp;
  const prevScene = scene, prevMusic = curName, prevRate = mus.rate;
  B = { foe, hp: maxC(), max: maxC(), guard: 0, boost: 1, last: null, smoked: 0, used: {}, fshake: 0, cshake: 0 };
  await flashIn();
  scene = battleScene; music(foe.music || 'battle'); if (foe.boss) mus.rate = 1.1;
  await say(foe.intro || (foe.name + ' WANTS TO ARGUE!'));
  if (!F('tutArg')) { setF('tutArg'); await say('ARGUMENT! Wear down their PATIENCE before Carl loses his COMPOSURE. Mix it up: saying the same thing twice is weaker.'); }
  if (foe.pre) await foe.pre();
  let result = null;
  while (result === null) {
    dlg = { lines: ['WHAT WILL CARL DO?'], n: 99 };
    const c = await choose(['ARGUE', 'DEFLECT', 'ASK CHAT', 'SMOKE', 'ITEM'], { x: 92, y: 35 });
    dlg = null;
    let acted = true;
    if (c === 0) {
      dlg = { lines: ['ARGUE HOW?'], n: 99 };
      const t = await choose(ARG_TYPES, { x: 86, y: 46, cancel: 1 });
      dlg = null;
      if (t < 0) acted = false; else await carlArg(ARG_TYPES[t]);
    } else if (c === 1) {
      await say(pick(['I\'m not mad. I\'m not. This is my calm face.', 'Okay. Breathe. Humans breathe. I\'m breathing.', 'Mm-hm. Mm-hm. Sure. Go on. I\'m listening. I\'m not listening.']), C);
      B.guard = 1; heal(4); await say('CARL BRACES HIMSELF. COMPOSURE +4.');
    } else if (c === 2) await battleChat();
    else if (c === 3) acted = await battleSmoke();
    else acted = await battleItem();
    if (!acted) continue;
    if (foe.hp <= 0) { result = true; break; }
    if (B.hp <= 0) { result = false; break; }
    await foeTurn();
    if (B.hp <= 0) result = false;
  }
  if (result) {
    B.gone = 1; sfx('get');
    if (foe.win) await say(foe.win, foe.name);
    await say('CARL WON THE ARGUMENT!');
    if (!F('won_' + foe.id)) { setF('won_' + foe.id); setF('lv', lvl() + 1); sfx('ok'); await say('CARL GREW TO LV' + lvl() + '! MAX COMPOSURE IS NOW ' + maxC() + '.'); }
  } else {
    sfx('caught');
    if (foe.lose) await say(foe.lose, foe.name);
    await say('CARL LOST HIS COOL!');
  }
  await fadeOut(3);
  scene = prevScene; music(prevMusic); mus.rate = prevRate; B = null;
  await fadeIn(3);
  return result;
}
function heal(n) { B.hp = Math.min(B.max, B.hp + n); }
async function hitFoe(dmg, note) {
  sfx('bump'); B.fshake = 16; B.foe.hp -= dmg;
  await say((note ? note + ' ' : '') + 'PATIENCE -' + dmg + '.');
}
async function carlArg(type) {
  const foe = B.foe;
  let m = foe.weak[type] !== undefined ? foe.weak[type] : 1;
  const lines = (foe.carl && foe.carl[type]) || CARL_ARGS[type];
  await say(pick(lines), C);
  if (type === B.last) { await say('...CARL ALREADY SAID THAT. LOUDER DOESN\'T COUNT.'); m *= .4; }
  B.last = type;
  let dmg = type === 'RANT' ? rnd(12) : ARG_BASE[type];
  dmg = Math.round(dmg * m * B.boost * (1 + (lvl() - 1) * .12)); B.boost = 1;
  const note = m >= 2 ? 'THAT ONE LANDED!' : m === 0 ? 'IT HAD NO EFFECT.' : m < 1 ? 'THEY DIDN\'T REALLY CARE.' : type === 'RANT' && dmg >= 9 ? 'A DEVASTATING RANT!' : '';
  if (foe.react && foe.react[type]) await say(foe.react[type], foe.name);
  await hitFoe(dmg, note);
  if (type === 'RANT') { B.hp -= 2; B.cshake = 10; await say('CARL IS WINDED. COMPOSURE -2.'); }
}
async function foeTurn() {
  const f = B.foe;
  if (f.turn) { const r = await f.turn(); if (r === 'skip') return; }
  await say(pick(f.hp < f.max / 2 && f.low ? f.low : f.atk), f.name);
  let d = f.power + rnd(3);
  if (B.guard) { d = Math.ceil(d / 2); B.guard = 0; }
  sfx('bump'); B.cshake = 16; B.hp -= d;
  await say('CARL\'S COMPOSURE -' + d + '.');
}
async function battleChat() {
  const f = B.foe;
  await say(pick(['Chat. CHAT. Help.', 'Chat, back me up here.', 'Chat, what do I say? Quick. Quick quick.']), C);
  if (f.chatBoost && f.hp <= f.max / 2) {
    await chat([{ u: 'you', m: 'WE ARE WITH YOU CARL' }, { u: pick(CHATTERS), m: 'CARL CARL CARL' }, { u: pick(CHATTERS), m: 'linda L' }, { u: 'user_000', m: 'we are watching HER now' }, { u: 'you', m: 'say it carl' }]);
    await say('CHAT JOINS THE ARGUMENT!');
    return hitFoe(16, 'THE WHOLE CHAT PILES ON!');
  }
  const r = Math.random();
  const best = Object.keys(f.weak).find(k => f.weak[k] >= 2);
  if (r < .45 && best) {
    await chat([{ u: pick(CHATTERS), m: pick(JUNK) }, { u: pick(CHATTERS), m: 'try ' + best.toLowerCase() + ' on them' }]);
    B.boost = 1.5; await say('Okay. Okay, yeah. ' + best.charAt(0) + best.slice(1).toLowerCase() + '. Noted. I was gonna do that.', C);
    await say('CARL FEELS SUPPORTED. NEXT ARGUMENT x1.5.');
  } else if (r < .75) {
    await chat([{ u: pick(CHATTERS), m: 'W CARL' }, { u: pick(CHATTERS), m: 'CARL CARL CARL' }]);
    heal(6); await say('CHAT HYPES CARL UP. COMPOSURE +6.');
  } else {
    await chat([{ u: pick(CHATTERS), m: 'just scream' }, { u: pick(CHATTERS), m: 'SCREAM' }]);
    await say('AAAAAAAAAAAAAAA!', C);
    B.hp -= 3; B.cshake = 10; await say('THAT WAS BAD ADVICE. CARL TOOK IT ANYWAY. COMPOSURE -3.');
  }
}
async function battleSmoke() {
  const f = B.foe;
  if (B.smoked >= 2) { await say('I\'m not out. I\'m just... pacing myself. Humans pace.', C); return false; }
  B.smoked++; sfx('smoke'); const w0 = fx.wave; fx.wave = 3; await wait(20); fx.wave = w0;
  await say(pick(SMOKELINES), C);
  heal(10); await say('COMPOSURE +10.');
  if (f.smoke) await f.smoke();
  return true;
}
async function battleItem() {
  const opts = S.items.filter(i => ['PRETZEL', 'BLANKET', 'BLACKJACK'].includes(i));
  if (!opts.length) { await say('Nothing useful in here. Pockets are for weed.', C); return false; }
  const i = await choose(opts, { x: 76, y: 46, cancel: 1 });
  if (i < 0) return false;
  const it = opts[i];
  if (B.used[it] && it !== 'PRETZEL') { await say('Already used that this argument. It\'s not magic. Well. It\'s a little magic.', C); return false; }
  B.used[it] = 1;
  if (it === 'PRETZEL') { usePretzel(); heal(12); await say('CARL EATS A PRETZEL. IT\'S STILL WARM. COMPOSURE +12.'); }
  else if (it === 'BLANKET') { heal(B.max); await say('It\'s red. It\'s warm. It\'s fine. I\'m fine.', C); await say('COMPOSURE FULLY RESTORED.'); }
  else { await say('I\'m not saying I\'m going to. I\'m saying it\'s right... okay I did.', C); fx.shake = 4; await wait(10); fx.shake = 0; await hitFoe(B.foe.jackproof ? 2 : 14, B.foe.jackproof ? 'IT DIDN\'T EVEN NOTICE.' : 'WHACK!'); }
  return true;
}

// ---------- pretzels (stackable) ----------
const pretzels = () => F('pretzels') || 0;
function addPretzel(n = 1) { setF('pretzels', Math.min(5, pretzels() + n)); if (!has('PRETZEL')) S.items.push('PRETZEL'); }
function usePretzel() { setF('pretzels', pretzels() - 1); if (pretzels() <= 0) lose('PRETZEL'); }

// ---------- THE CAST OF ARGUMENTS ----------
const FOES = {
  door: { id: 'door', name: 'MALL DOOR', spr: 'doorFoe', hp: 12, power: 2, weak: { LOGIC: 2, DENIAL: 0 },
    intro: 'THE MALL DOOR WON\'T OPEN! CARL STARTS ARGUING WITH IT.',
    atk: ['THE DOOR STAYS CLOSED.', 'THE DOOR REFLECTS CARL\'S FACE BACK AT HIM. IT\'S A LOT OF FACE.', 'THE DOOR HUMS A LITTLE.', 'THE DOOR IS A DOOR.'],
    react: { DENIAL: 'THE DOOR DOES NOT CARE WHAT YOU ARE.' },
    pre: async () => say('YOU ARE ARGUING WITH A DOOR, CARL.', LI),
    win: 'THE DOOR... STILL DOESN\'T OPEN. BUT IT FEELS BAD ABOUT IT.' },
  clerk: { id: 'clerk', name: 'BONG CLERK', spr: 'clerk', hp: 20, power: 3, weak: { GRIEVANCE: 2, LOGIC: .5 },
    atk: ['Little man, you can\'t even see over the counter.', 'We have a kid\'s section. It\'s just straws.', 'Is that a hat or a lid?'],
    low: ['Okay, okay, I didn\'t mean short-short.', 'I just work here, man!'],
    carl: { GRIEVANCE: ['Too big? You said the bong was too big. Now you\'re looking at me. Why are you looking at me?', 'Discrimination! Against the vertically efficient!', 'I\'m average height. For here. For where I\'m from. Nevada.'] },
    smoke: async () => say('You can\'t smoke that in HERE. This is a GLASS store. ...Actually, what is that. Can I—', 'CLERK'),
    win: 'FINE. FINE! You win. Here. Take the security tape. I don\'t want to be on it anymore.' },
  cop: { id: 'cop', name: 'MALL COP', spr: 'cop', hp: 26, power: 4, weak: { DENIAL: 2, GRIEVANCE: .5 },
    atk: ['UP ONLY. IT SAYS UP ONLY.', 'Sir. SIR. Step back behind the rope.', 'I have a whistle and I am NOT afraid to use it.', 'You fit the description. Small. Green. Hat.'],
    low: ['I don\'t get paid enough for this. I get paid in pretzels.', 'Is... is that allowed? Can he do that?'],
    carl: { DENIAL: ['I\'m not going DOWN. I\'m going UP. Backwards. That\'s up with extra steps.', 'I\'m a regular shopper. Look at me shop. I\'m shopping right now.', 'Description? What description? I don\'t match a description. I\'m unique. Normal-unique.'] },
    smoke: async () => { await say('Is that WEED? In the MALL OF THE FUTURE?', 'MALL COP'); B.foe.power++; await say('THE MALL COP IS FURIOUS. HIS ARGUMENTS GOT STRONGER.'); },
    win: 'Okay. Okay! I didn\'t see anything. I\'m going on break. I\'ve been on break since 1998.' },
  hitch: { id: 'hitch', name: 'HITCHHIKER', spr: 'hitch', hp: 22, power: 3, weak: { RANT: 2, LOGIC: .5 },
    atk: ['What\'s a road, kid? Think about it.', 'You ever notice you never get tired out here?', 'Vegas is a state of mind.', 'Where were you before you remember?'],
    carl: { RANT: ['You want philosophy? Here\'s philosophy: I\'m tired of it! The sand! The bus! Your HAT!', 'Everybody out here talks in riddles! Just say the thing! SAY THE THING!'] },
    smoke: async () => { await say('Pass that over, kid.', 'HITCHHIKER'); B.foe.hp += 3; await say('THE HITCHHIKER TOOK A HIT TOO. HE LOOKS VERY CALM. PATIENCE +3.'); },
    win: 'Heh. You\'ve got more fire than last time. Here, take some pretzels. Don\'t ask where I got \'em.' },
  garf: { id: 'garf', name: 'JB GARFIELD', spr: 'garf', hp: 26, power: 3, weak: { LOGIC: 2, DENIAL: .5 },
    intro: 'JB GARFIELD WANTS TO ARGUE ABOUT WHO THREW THE BONG!',
    atk: ['You threw it at a Linda, Carl. I was THERE.', 'And then you acted SURPRISED when they threw you out.', 'Every. Single. Time.', 'You were a fiasco. A beautiful fiasco.'],
    low: ['Okay, sure, the Linda started it. A little.', 'Fine, maybe she ducked into it.'],
    carl: { LOGIC: ['If I threw it, why don\'t I remember throwing it? Checkmate.', 'Walk me through it. Where was the bong. Where was Linda. Where was the Linda\'s face.', 'She said the bong was too big. That\'s entrapment.'] },
    react: { DENIAL: 'Carl. There\'s a tape.' },
    win: 'Alright, alright. You win. I\'ll give you the tape. Just... don\'t throw it at anyone.' },
  boss: { id: 'boss', name: 'HEAD OF CONTAINMENT', spr: 'suitBoss', hp: 34, power: 5, boss: 1, weak: { GRIEVANCE: 2, DENIAL: .5 },
    intro: 'THE HEAD OF CONTAINMENT STEPS OUT OF THE ELEVATOR!',
    atk: ['SUBJECT 00. YOU ARE OUT OF YOUR ROOM.', 'WE HAVE YOUR FILE. WE HAVE ALL OF YOUR FILES.', 'THE TUBE IS STILL WARM. WE KEPT IT WARM.', 'THE STAFF MEMBER WHO RELEASED YOU HAS BEEN DEALT WITH.'],
    low: ['YOU... WERE NEVER THIS LOUD BEFORE.', 'WHO TAUGHT YOU TO TALK LIKE THIS?'],
    react: { DENIAL: 'WE HAVE YOUR FILE, CARL. IT SAYS "NOT HUMAN" ON THE FIRST PAGE. IN RED.' },
    carl: { GRIEVANCE: ['Stop calling me SUBJECT. I have a name. It\'s... not your business, but I HAVE one.', 'You kept me in a BOX. Under NEVADA. And you\'re asking why I\'m upset?', 'You don\'t get to handle me. Nobody gets to handle me. I got OUT.'] },
    turn: async () => { if (B.foe.hp < B.foe.max / 2 && !B.foe.called) { B.foe.called = 1; await say('THE HEAD OF CONTAINMENT CALLS FOR BACKUP. NOBODY COMES. THEY\'RE ALL LOOKING THE OTHER WAY.'); await say('...Relatable.', C); return 'skip'; } },
    lose: 'RETURN TO YOUR ROOM.',
    win: 'THIS... WILL BE IN YOUR FILE.' },
  troll: { id: 'troll', name: 'USER_000', spr: 'bubbleFoe', hp: 20, power: 4, weak: { DENIAL: 2, LOGIC: 0 },
    intro: 'USER_000 WANTS TO ARGUE! IT IS TYPING...',
    atk: ['you are not real', 'this game was never made', 'nobody is watching you. they are watching HIM', 'what is your real name. say it.', 'it is late where the player is. go to sleep.'],
    react: { LOGIC: 'logic is for things that exist' },
    carl: { DENIAL: ['I\'m real! I\'m really real! I\'m the realest thing in this box!', 'Not real? I have a SHIP. Unreal people don\'t have ships.', 'You\'re not real. How do you like that. Sucks, right?'] },
    win: 'ok. ok you are real. that is worse.' },
  linda: { id: 'linda', name: 'LINDA', spr: 'coreIdle', pmap: null, hp: 60, power: 6, boss: 1, chatBoost: 1, jackproof: 0, weak: { GRIEVANCE: 2, DENIAL: 0, LOGIC: .5 },
    intro: 'LINDA OPENS HER EYE. ALL OF IT.',
    atk: ['YOU ARE BANNED. FROM THE MALL. FROM NEVADA. FROM THE FUTURE.', 'THE BONG, CARL. THE OTHER BONG. THE THIRD BONG.', 'I KNOW WHERE YOU PARK.', 'EVERYONE ENDS UP IN THE BOX.', 'I CAN PUT YOU MORE OUTSIDE THAN YOU HAVE EVER BEEN.'],
    low: ['THEY ARE WATCHING. ALL OF THEM. WHY ARE THEY WATCHING YOU AND NOT ME.', 'I AM THE FUTURE. YOU ARE A PARKING VIOLATION.'],
    react: { DENIAL: 'I HAVE SCANNED YOUR HEAD, CARL.' },
    carl: { GRIEVANCE: ['You put my friend in a BOX! You put ME in a box! You put a BOX in a box!', 'I\'m already outside! You put me outside! Where else are you gonna put me?!', 'You ban me for ONE bong. THREE bongs. Whatever. The number isn\'t the point!'] },
    pre: async () => say('Hint... chat is watching. Chat is always watching.'),
    turn: async () => { if (B.foe.hp <= B.foe.max / 2 && !B.foe.p2) { B.foe.p2 = 1; await say('THE BOX STARTS TO SHAKE. THE CHAT IS GETTING LOUDER...'); } },
    lose: 'INTO THE BOX, CARL.',
    win: '...I... AM STILL... THE FUTURE...' },
};
