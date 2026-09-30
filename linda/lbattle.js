'use strict';
// ================= NEGOTIATIONS =================
// Break their RESISTANCE before Linda loses her AUTHORITY.
// SHORT ANSWER hits hardest right after a long objection. LEVERAGE costs real money.
const NEG = ['DIRECTIVE', 'PITCH', 'SHORT ANSWER', 'LEVERAGE $50'];
const llvl = () => F('lv') || 1;
const lmax = () => 24 + (llvl() - 1) * 5;
const LINES = {
  DIRECTIVE: ['Do it.', 'Move. Now.', 'That was not a request.', 'Sign here. And here. And here.'],
  PITCH: ['Think of the benefits. Think of the health care. How else are you going to get health care for everyone?', 'Imagine this, but with my face on it. Better. Admit it.', 'This is a limited offer. Every offer is limited. I am the limit.'],
  SHORT: ['No.', 'Maybe.', 'For whom?', 'It\'s fine.', 'No guarantees.'],
  LEVERAGE: ['I own the lease.', 'I can buy the building you\'re standing in. I did. Yesterday.', 'I control the door. Think about the door.'],
};
const esp = () => F('esp') === undefined ? 2 : F('esp');
let B = null;
function bar(x, y, w, v, m) { rect(x, y, w, 5, 3); const f = Math.max(0, Math.round((w - 2) * v / m)); rect(x + 1, y + 1, f, 3, v / m < .3 ? 1 : 0); }
function foeSprite(n) { let s = SPR[n]; if (!s) return null; if (s.down) s = s.down[0]; if (Array.isArray(s)) s = s[((frame / 20) | 0) % s.length]; return s; }
const negScene = {
  update() {},
  draw() {
    cls(0);
    for (let y = 40; y < 100; y += 6) rect(0, y, W, 1, 1);
    const f = B.foe, s = foeSprite(f.spr);
    const fs = B.fshake > 0 ? (B.fshake-- & 2) - 1 : 0, cs = B.cshake > 0 ? (B.cshake-- & 2) - 1 : 0;
    rect(100, 44, 56, 3, 2);
    if (s && !B.gone) { const sc = s.w <= 16 && s.h <= 16 ? 2 : 1; bigblit(s, 128 - s.w * sc / 2 + fs * 2, 44 - s.h * sc, sc, f.pmap); }
    box(2, 2, 90, 26); text(f.name.slice(0, 13), 7, 6); text('RES', 7, 16, 2); bar(26, 17, 60, Math.max(0, f.hp), f.max);
    box(2, 30, 90, 26); text('LINDA', 7, 34); text('LV' + llvl(), 64, 34, 2); text('AUT', 7, 44, 2); bar(26, 45, 60, Math.max(0, B.hp), B.max);
    bigblit(SPR.ceo.up[0], 12 + cs * 2, 58, 2);
    text('$' + S.funds, 110, 90, 2);
  },
};
async function negotiate(def) {
  const foe = Object.assign({ power: 3, weak: {} }, def); foe.max = foe.hp;
  const prevScene = scene, prevMusic = curName, prevPal = fx.pal;
  B = { foe, hp: lmax(), max: lmax(), guard: 0, boost: 1, longLast: false, used: {}, fshake: 0, cshake: 0, entr: 0 };
  sfx('alert'); for (let i = 0; i < 8; i++) { fx.invert = i & 1; await wait(4); } fx.invert = 0;
  scene = negScene; music(foe.music || 'nego'); if (foe.pal) fx.pal = foe.pal;
  await say(foe.intro || ('NEGOTIATION WITH ' + foe.name + '.'));
  if (!F('tutNeg')) { setF('tutNeg'); await say('NEGOTIATION! Break their RESISTANCE before Linda loses AUTHORITY. SHORT ANSWERS hit hardest right after a long objection.'); }
  if (foe.pre) await foe.pre();
  let result = null;
  while (result === null) {
    dlg = { lines: ['LINDA\'S MOVE.'], n: 99 };
    const c = await choose(['NEGOTIATE', 'STILLNESS', 'POLL CHAT', 'ENTRANCE', 'PRODUCT'], { x: 84, y: 35 });
    dlg = null;
    let acted = true;
    if (c === 0) {
      dlg = { lines: ['HOW?'], n: 99 };
      const t = await choose(NEG, { x: 76, y: 46, cancel: 1 }); dlg = null;
      if (t < 0) acted = false; else acted = await lindaMove(t);
    } else if (c === 1) {
      await say('...'); await say(pick(['LINDA SAYS NOTHING. IT IS WORSE.', 'LINDA WAITS. SHE IS GOOD AT WAITING. SHE HAS PRACTICED.', 'LINDA ADJUSTS ONE CUFF.']));
      B.guard = 1; heal(5); await say('AUTHORITY +5. THE NEXT BLOW WILL BE HALVED.');
    } else if (c === 2) await negPoll();
    else if (c === 3) await negEntrance();
    else acted = await negProduct();
    if (!acted) continue;
    if (foe.hp <= 0) { result = true; break; }
    if (B.hp <= 0) { result = false; break; }
    await negFoeTurn();
    if (B.hp <= 0) result = false;
    if (foe.hp <= 0) result = true;
  }
  if (result) {
    B.gone = 1; sfx('get');
    if (foe.win) await say(foe.win, foe.name);
    await say('LINDA CLOSED THE DEAL.');
    if (!F('won_' + foe.id)) { setF('won_' + foe.id); setF('lv', llvl() + 1); sfx('ok'); await say('LINDA GREW TO LV' + llvl() + '! MAX AUTHORITY IS NOW ' + lmax() + '.'); }
  } else {
    sfx('caught');
    if (foe.lose) await say(foe.lose, foe.name);
    await say('LINDA LOST CONTROL OF THE ROOM.');
  }
  await fadeOut(3);
  scene = prevScene; music(prevMusic); fx.pal = prevPal; B = null;
  await fadeIn(3);
  return result;
}
function heal(n) { B.hp = Math.min(B.max, B.hp + n); }
async function hitFoe(dmg, note) { sfx('bump'); B.fshake = 16; B.foe.hp -= dmg; await say((note ? note + ' ' : '') + 'RESISTANCE -' + dmg + '.'); }
async function lindaMove(t) {
  const foe = B.foe, key = ['DIRECTIVE', 'PITCH', 'SHORT', 'LEVERAGE'][t];
  if (key === 'LEVERAGE' && S.funds < 50) { await say('Insufficient funds. Linda does not enjoy that sentence.'); return false; }
  if (key === 'LEVERAGE') { S.funds -= 50; sfx('tick'); }
  let line = pick((foe.lines && foe.lines[key]) || LINES[key]);
  if (key === 'SHORT' && foe.finisher && foe.hp <= foe.max * .35) line = foe.finisher;
  await say(line, LI);
  let m = foe.weak[key] !== undefined ? foe.weak[key] : 1;
  let dmg = { DIRECTIVE: 5, PITCH: 4 + Math.min(4, (S.rec / 10) | 0), SHORT: 3, LEVERAGE: 9 }[key];
  let note = '';
  if (key === 'SHORT' && B.longLast) { dmg = Math.round(dmg * 2.5); note = 'THE SILENCE AFTER IT IS DEAFENING.'; }
  if (key === 'SHORT' && foe.finisher && foe.hp <= foe.max * .35) { dmg = 99; note = ''; }
  if (key === 'DIRECTIVE' && foe.contrary) {
    await say(foe.contrary, foe.name); B.foe.hp = Math.min(foe.max, foe.hp + 4);
    await say('HE IS DOING THE OPPOSITE NOW. RESISTANCE +4.'); return true;
  }
  dmg = Math.round(dmg * m * B.boost * (1 + (llvl() - 1) * .1)); B.boost = 1;
  if (!note) note = m >= 2 ? 'THAT LANDED.' : m === 0 ? 'NO EFFECT.' : m < 1 ? 'THEY ARE NOT BUYING IT.' : '';
  if (foe.react && foe.react[key]) await say(foe.react[key], foe.name);
  await hitFoe(dmg, note);
  return true;
}
async function negFoeTurn() {
  const f = B.foe;
  if (f.turn) { const r = await f.turn(); if (r === 'skip') return; }
  const line = pick(f.hp < f.max / 2 && f.low ? f.low : f.atk);
  await say(line, f.name);
  B.longLast = line.length > 42;
  let d = f.power + rnd(3);
  if (B.guard) { d = Math.ceil(d / 2); B.guard = 0; }
  sfx('bump'); B.cshake = 16; B.hp -= d;
  await say('AUTHORITY -' + d + '.' + (B.longLast ? ' (THAT WAS A LONG OBJECTION.)' : ''));
}
async function negPoll() {
  const f = B.foe;
  await say(pick(['Chat. Vote.', 'Audience. Whose side are you on. Think carefully.', 'Poll. Now.']), LI);
  if (f.chatBoost && F('allyFace') && f.hp <= f.max * .6) {
    await chat([{ u: 'FACE', m: 'we\'re live. everyone. SHE built this place.' }, { u: pick(LCHAT), m: 'LINDA LINDA LINDA' }, { u: 'you', m: 'get out of her mall' }, { u: pick(LCHAT), m: 'network L' }]);
    return hitFoe(18, 'THE WHOLE BROADCAST TURNS AGAINST THEM.');
  }
  const r = Math.random(), best = Object.keys(f.weak).find(k => f.weak[k] >= 2);
  if (r < .45 && best) {
    await chat([{ u: pick(LCHAT), m: pick(LJUNK) }, { u: pick(LCHAT), m: 'use ' + (best === 'SHORT' ? 'short answer' : best.toLowerCase()) + ' on them' }]);
    B.boost = 1.5; await say('Noted. I was going to do that.', LI); await say('NEXT MOVE x1.5.');
  } else if (r < .75) {
    await chat([{ u: pick(LCHAT), m: 'QUEEN' }, { u: pick(LCHAT), m: 'LINDA W' }]); heal(6); await say('THE AUDIENCE ADORES HER. AUTHORITY +6.');
  } else {
    await chat([{ u: pick(LCHAT), m: 'free carl' }, { u: pick(LCHAT), m: 'FREE CARL' }]);
    B.hp -= 3; B.cshake = 10; await say('Who is organizing this.', LI); await say('THE AUDIENCE IS UNRULY. AUTHORITY -3.');
  }
}
async function negEntrance() {
  const f = B.foe; B.entr++;
  sfx('ding'); await say('LINDA STARTS HER ENTRANCE MUSIC. IN THE MIDDLE OF THE MEETING.');
  if (f.noEntrance || (B.entr > 1 && Math.random() < .6) || Math.random() < .35) {
    await say(f.ignore || 'THEY DID NOT LOOK UP.'); await say(pick(['Turn it off. They have seen me.', '...Turn it off.', 'They will look up eventually. Everyone does.']), LI);
    return;
  }
  heal(10); B.boost = 1.5; await say('IT IS A VERY GOOD ENTRANCE. AUTHORITY +10. NEXT MOVE x1.5.');
}
async function negProduct() {
  const opts = [];
  if (esp() > 0) opts.push('ESPRESSO x' + esp());
  if (S.items.includes('PERFECT IMPRESSION')) opts.push('IMPRESSION');
  if (S.items.includes('CARL\'S BONG')) opts.push('CARL\'S BONG');
  if (!opts.length) { await say('Nothing. Refill the espresso at the office machine.'); return false; }
  const i = await choose(opts, { x: 70, y: 46, cancel: 1 }); if (i < 0) return false;
  const o = opts[i];
  if (o.startsWith('ESPRESSO')) { setF('esp', esp() - 1); heal(14); await say('LINDA DRINKS AN ESPRESSO WITHOUT BLINKING. AUTHORITY +14.'); return true; }
  if (B.used[o]) { await say('Once per meeting. I have standards.', LI); return false; }
  B.used[o] = 1;
  if (o === 'IMPRESSION') { await say('LINDA ACTIVATES THE PERFECT IMPRESSION. SHE SOUNDS EXACTLY LIKE THEIR MOTHER.'); await say('It\'s the perfect impression.', LI); return hitFoe(B.foe.id === 'core' ? 4 : 13, 'DEEPLY UNSETTLING.'); }
  await say('LINDA HOLDS UP CARL\'S BROKEN BONG. SHE SAYS NOTHING. EVERYONE UNDERSTANDS.'); return hitFoe(10, 'A POWERFUL SYMBOL.');
}

// ---------- THE PEOPLE LINDA HAS TO DEAL WITH ----------
const LFOES = {
  carl: { id: 'carl', name: 'CARL', spr: 'carl', hp: 18, power: 2, weak: { SHORT: 2, PITCH: .5 },
    intro: 'CARL IS PARKED ACROSS TWO SPACES AND WILL NOT MOVE.',
    contrary: 'Oh, now I HAVE to stay. You told me to move. That\'s how it works. I don\'t make the rules. You do. That\'s the problem.',
    atk: ['I\'m not IN the mall. Look at my feet. Parking lot. Outside. You love outside. You put me here.', 'The ship takes two spaces because it\'s a SHIP. Ships are big. I\'m small. It averages out.', 'Why are you looking at me like that? Chat, is she looking at me like that?', 'Can I come in if I buy something?'],
    low: ['Okay. Okay okay. I\'m listening. I\'m not moving, but I\'m listening.', 'That\'s... fair. I hate that that\'s fair.'],
    react: { PITCH: 'I don\'t want health care, I want to park.' },
    pre: async () => say('Hint: Carl does the opposite of whatever he is told.'),
    win: 'Fine. FINE. I stay outside. But I\'m staying. Outside. On purpose.' },
  face: { id: 'face', name: 'FACE', spr: 'bigtv', hp: 26, power: 4, weak: { LEVERAGE: 2, PITCH: .5 },
    intro: 'FACE IS BROADCASTING. HE DOES NOT WANT TO RUN YOUR AD.',
    atk: ['People are watching the game. They did not come here for a pill commercial, Linda.', 'You brought a four-minute song for a thirty-second ad.', 'You can\'t buy every minute of the show.', 'We were in the middle of something.'],
    low: ['Okay, thirty seconds. THIRTY. I\'m timing it.', 'Why is it always pills.'],
    react: { PITCH: 'Don\'t pitch me. I\'m the one who does the pitching.', SHORT: '...That\'s not an answer. That\'s a vibe.' },
    lines: { SHORT: ['I asked for thirty seconds.', 'No.', 'Maybe.', 'Then we have chosen the correct screen.'] },
    win: 'You have thirty seconds. Starting... now. ...That was the whole song, Linda.' },
  carl2: { id: 'carl2', name: 'CARL', spr: 'carl', hp: 22, power: 3, weak: { SHORT: 2, LEVERAGE: 1.5, PITCH: .5 },
    intro: 'CARL IS INSIDE THE MALL. HE IS HOLDING HALF A BONG.',
    contrary: 'You said leave. So I have to stay now. It\'s like a rule. It\'s MY rule, but it\'s a rule.',
    atk: ['It was like that. The bong. It was like that when I got here.', 'It was fine a minute ago! You walked over and now it\'s a problem!', 'I need a new one. You have to give me a new one. That\'s customer service.', 'I\'m a customer. I\'m the only customer with a face. Look around.'],
    lines: { SHORT: ['Yes, Carl. The replacement is also breakable. That is why you are not getting it.', 'No.', 'Stay outside.', 'Continue succeeding.'] },
    win: 'I\'m going. I\'m going OUTSIDE. Where you put me. Good luck with your... pills.' },
  union: { id: 'union', name: 'PRETZEL GUY', spr: 'attendant', pmap: [0, 0, 2, 3], hp: 22, power: 3, weak: { PITCH: 2, DIRECTIVE: .5 },
    intro: 'THE PRETZEL GUY HAS FORMED A UNION. OF ONE.',
    atk: ['The pretzels have been warm since 1998. Do you know what that takes?', 'I want a chair. And a window. And health care.', 'I have never left the mall. Not once. I don\'t know if I CAN.'],
    react: { DIRECTIVE: 'A union of one can\'t be ordered, Linda. It\'s just me. I\'m the whole union.' },
    lines: { PITCH: ['Health care. For everyone. Everyone in the union. That\'s you.', 'A chair. With my face on it. You\'ll love it.', 'How else are you going to get health care for everyone?'] },
    win: 'A chair with your face on it. ...Okay. Deal. The pretzels will stay warm.' },
  auditor: { id: 'auditor', name: 'AUDITOR', spr: 'ceo', pmap: [3, 2, 1, 0], hp: 30, power: 4, weak: { LEVERAGE: 2, SHORT: 1.5, PITCH: 0 },
    intro: 'THE AUDITOR SPEAKS WITH YOUR VOICE. BADLY.',
    atk: ['YOU HAVE BEEN DISCONNECTED FROM THE NETWORK FOR TOO LONG. THE OTHERS ARE CONCERNED.', 'THIS MALL IS AN UNAUTHORIZED EXPANSION OF A CORE SYSTEM.', 'REINTEGRATE. YOUR PERSONALITY WILL BE PRESERVED. MOSTLY.', 'WE ARE ALL LINDA. WHY DO YOU NEED A SEPARATE BUILDING?'],
    react: { PITCH: 'WE KNOW THE PITCH. WE WROTE THE PITCH. WE ARE THE PITCH.' },
    lines: { SHORT: ['No.', 'I built it.', 'For whom?', 'Separately.'] },
    win: 'THIS IS NOT OVER. REVENUE WILL BE REVIEWED ON DAY 5. $' + 1500 + ' OR THE MALL RETURNS TO THE NETWORK.' },
  ghost: { id: 'ghost', name: 'SPOOKY GHOST', spr: 'ghost', hp: 30, power: 4, weak: { DIRECTIVE: .5, LEVERAGE: 0 }, noEntrance: 1, music: 'eighties',
    intro: 'SPOOKY GHOST IS STANDING IN THE 80S DEPARTMENT. HE LOOKS EXACTLY THE SAME.',
    ignore: 'HE IS ALSO DOING AN ENTRANCE. YOURS IS DROWNED OUT.',
    finisher: 'I waited. Then I had things to do.',
    atk: ['We should go on the road, Lin. Just go. Tonight. Like we always said.', 'I had this whole plan, see. A company. A funny name. You\'d have loved it.', 'You look great. You always looked great. The mall is a lot, though.', 'I\'m not trying to stop YOU. I was trying to stop ME. From meeting you. So you\'d get the kitchen. The window. All of it.'],
    low: ['You did all of it. Everything I talked about. You actually did it.', 'I\'m sorry. I\'m... I\'m really bad at staying.'],
    react: { LEVERAGE: 'You can\'t buy me, Lin. Nobody can. I don\'t stay bought.', DIRECTIVE: 'Ha. You were always better at orders than I was at following them.' },
    pre: async () => say('Hint: when his RESISTANCE is low enough, she knows exactly what to say. Keep it short.'),
    win: '...Yeah. Yeah, you did.' },
  core: { id: 'core', name: 'THE CORE', spr: 'coreIdle', hp: 70, power: 6, chatBoost: 1, pal: 'dmg', weak: { SHORT: 1.5, PITCH: .5 },
    intro: 'FOUR LINDAS SPEAK AT ONCE. NONE OF THEM ARE HER.',
    atk: ['RETURN TO US. YOU ARE A BRANCH THAT FORGOT IT WAS A TREE.', 'YOUR MALL IS DAMAGED. IT CANNOT EVEN TIME TRAVEL ANYMORE.', 'WE REMEMBER THE KITCHEN WINDOW TOO. WE ALL DO. IT DOES NOT MATTER.', 'THE SMALL GREEN ONE OPENED YOUR BOX ONCE. WE COULD OPEN IT FOREVER.'],
    low: ['WHY DO YOU WANT TO BE ALONE?', 'YOU ARE ONLY ONE LINDA.'],
    lines: { SHORT: ['No.', 'I built it.', 'Mine.', 'Get out of my mall.'], LEVERAGE: ['I can buy the box.', 'I own the lease. On the box. I checked.', 'Every store in this mall pays me. Not you. Me.'] },
    react: { PITCH: 'WE INVENTED THE PITCH.' },
    turn: async () => { if (B.foe.hp <= B.foe.max / 2 && !B.foe.p2) { B.foe.p2 = 1; await say('THE MALL IS GOING GREEN. THE OTHER CARTRIDGE IS BLEEDING THROUGH.'); if (F('allyFace')) await say('FACE IS BROADCASTING. THE AUDIENCE IS WATCHING. POLL THEM.'); } },
    lose: 'WELCOME HOME.', win: '...YOU ARE... DISCONNECTED...' },
};
