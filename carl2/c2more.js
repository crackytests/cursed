'use strict';
// ================= CARL 2: the content pass. Episode 3 gets the marina, episode 5 the commune, episode 7 the backstage. =================
// Loaded after c2story2.js: it adds maps, people, enemies and story, and rewires a few existing beats (see the bottom of the file).

// ---------------- people + portraits ----------------
Object.assign(PEOPLE, {
  coolguy: { skin: '#dbb692', hair: '#101010', top: '#242424', top2: '#101010', bottom: '#24246d', hairStyle: 'short', extra: g => { g.r(6, 10, 4, 3, 8); g.r(4, 2, 9, 2, 3); g.p(12, 3, 3); } },
  oldsalt: { skin: '#dbb692', hair: '#ffffff', top: '#ffdb24', top2: '#dbb624', bottom: '#ffdb24', hat: '#ffdb24', hatStyle: 'fedora', extra: g => { g.r(5, 7, 7, 3, 8); g.r(6, 10, 5, 2, 8); } },
  lifeguard: { skin: '#db9249', hair: '#ffdb49', top: '#db9249', top2: '#b66d24', bottom: '#db2424', hairStyle: 'short', extra: g => { g.r(5, 11, 1, 4, 8); g.r(5, 15, 2, 2, 11); g.r(4, 4, 9, 2, 11); } },
  choir: { skin: '#dbb692', hair: '#6d2424', top: '#b62424', top2: '#921a1a', bottom: '#b62424', hairStyle: 'hood', extra: (g, f) => { g.r(4, 10, 8, 2, 11); g.r(5 + f, 7, 2, 2, 9); } },
  stagemgr: { skin: '#f0c8a0', hair: '#242424', top: '#242424', top2: '#101010', bottom: '#101010', hairStyle: 'bob', extra: g => { g.r(2, 3, 2, 5, 9); g.r(3, 7, 3, 1, 9); g.r(9, 12, 3, 4, 8); } },
});
for (const k of ['coolguy', 'oldsalt', 'lifeguard', 'choir', 'stagemgr']) CS.people[k] = [0, 1].map(f => person(PEOPLE[k], f));
// a head-and-shoulders portrait from a few colors: bg, skin, skin shade, hair, top, white, eyes, accent, bg stripe
function bustPort(c, o = {}) {
  const P = pal(c.bg, c.skin, c.shade, c.hair, c.top, '#ffffff', '#101010', c.acc || c.top, c.bg2 || c.bg);
  const s = portrait(g => {
    g.r(0, 0, 48, 48, 1); for (let y = 2; y < 48; y += 10) g.r(0, y, 48, 3, 9);
    g.e(24, 52, 22, 13, 5); if (o.collar) { g.line(18, 39, 22, 44, 8); g.line(30, 39, 26, 44, 8); }
    g.e(24, 23, 13, 15, 2); g.e(29, 25, 7, 13, 3);
    if (o.hair === 'beard') { g.e(24, 33, 12, 8, 4); g.r(18, 30, 12, 2, 2); }
    if (o.hair !== 'bald') { g.e(24, 10, 15, 7, 4); if (o.hair === 'slick') { g.e(24, 7, 16, 6, 4); g.r(8, 8, 5, 10, 4); g.r(35, 8, 5, 10, 4); } if (o.hair === 'hood') { g.e(24, 17, 18, 14, 4); g.e(24, 24, 12, 13, 2); } }
    if (o.hat) { g.r(6, 6, 36, 4, 8); g.r(12, 0, 24, 7, 8); }
    if (o.shades) { g.r(13, 20, 22, 5, 7); g.r(16, 21, 4, 1, 6); } else { g.r(17, 20, 4, 3, 7); g.r(28, 20, 4, 3, 7); g.p(18, 20, 6); g.p(29, 20, 6); }
    if (o.headset) { g.r(8, 14, 3, 14, 7); g.line(10, 27, 18, 32, 7); g.r(17, 31, 3, 2, 8); }
    g.r(20, 31, 9, 2, 3); if (o.whistle) { g.line(24, 36, 24, 42, 8); g.r(22, 42, 5, 3, 8); }
  });
  return { s, P };
}
Object.assign(PORT, {
  'COOL GUY': bustPort({ bg: '#241010', skin: '#dbb692', shade: '#b6926d', hair: '#101010', top: '#242424', acc: '#6d6d6d', bg2: '#3a1a1a' }, { hair: 'slick', shades: 1, collar: 1 }),
  'OLD SALT': bustPort({ bg: '#10243a', skin: '#dbb692', shade: '#b6926d', hair: '#ffffff', top: '#ffdb24', acc: '#dbb624', bg2: '#1a3a5a' }, { hair: 'beard', hat: 1 }),
  'CHAD (LIFEGUARD)': bustPort({ bg: '#1a6db6', skin: '#db9249', shade: '#b66d24', hair: '#ffdb49', top: '#db9249', acc: '#db2424', bg2: '#2492db' }, { shades: 1, whistle: 1 }),
  'THE CHOIR': bustPort({ bg: '#240008', skin: '#dbb692', shade: '#b6926d', hair: '#b62424', top: '#b62424', acc: '#ffdb24', bg2: '#3a0010' }, { hair: 'hood' }),
  'STAGE MANAGER': bustPort({ bg: '#101024', skin: '#f0c8a0', shade: '#c8a07a', hair: '#242424', top: '#242424', acc: '#6dff24', bg2: '#1a1a36' }, { headset: 1 }),
});
Object.assign(VOICE, { 'COOL GUY': [240, 30], 'OLD SALT': [200, 60], 'CHAD (LIFEGUARD)': [420, 40], 'THE CHOIR': [620, 220], 'STAGE MANAGER': [520, 20] });
const CG = 'COOL GUY', OS = 'OLD SALT', LGD = 'CHAD (LIFEGUARD)', CHO = 'THE CHOIR', SM = 'STAGE MANAGER';

// ---------------- new enemies (drawn, not sprites: they're cheap props) ----------------
function drawFoeBase(e, w, fn) {
  const x = e.x - camX, y = e.y - camY - (e.z || 0);
  rectA(x - w / 2, e.y - camY - 2, w, 3, BLACK, .35);
  fn(x, y, e.fl && (e.fl & 2));
  if (e.hp < e.maxhp && !e.boss) { rectF(x - 8, y - 26, 16, 2, hex('#400000')); rectF(x - 8, y - 26, 16 * Math.max(0, e.hp) / e.maxhp, 2, hex('#ff4949')); }
}
function drawJetski(e) {
  drawFoeBase(e, 18, (x, y, hit) => {
    const c = hit ? WHITE : hex('#db2424'), f = e.vx < 0 ? -1 : 1;
    rectF(x - 10, y - 8, 20, 6, c); rectF(x - 8 * f - (f < 0 ? 4 : 0), y - 12, 4, 4, hex('#242424')); rectF(x + 6 * f - (f < 0 ? 3 : 0), y - 10, 3, 2, hex('#ffdb24'));
    rectF(x - 3, y - 18, 6, 7, hex('#242424')); rectF(x - 3, y - 21, 6, 3, hex('#dbb692')); // the guy
    if ((WD.t >> 2) & 1) { rectF(x - 12 * f - (f < 0 ? 4 : 0), y - 4, 4, 2, hex('#92dbff')); }
  });
}
function drawGull(e, sc = 1) {
  drawFoeBase(e, 10 * sc, (x, y, hit) => {
    const flap = ((WD.t + (e.id || 0)) >> 3) & 1, c = hit ? hex('#ff4949') : WHITE, yy = y - 14 * sc;
    lineF(x - 8 * sc, yy - (flap ? 4 : -2) * sc, x, yy, c); lineF(x, yy, x + 8 * sc, yy - (flap ? 4 : -2) * sc, c);
    lineF(x - 8 * sc, yy - (flap ? 4 : -2) * sc + 1, x, yy + 1, c); lineF(x, yy + 1, x + 8 * sc, yy - (flap ? 4 : -2) * sc + 1, c);
    rectF(x - 2 * sc, yy - 1, 4 * sc, 3 * sc, c); rectF(x + 2 * sc, yy, 2 * sc, sc, hex('#ffdb24'));
    if (sc > 1) { rectF(x - 3 * sc, yy - 3 * sc, 6 * sc, 2 * sc, hex('#ffdb24')); text('W', x - 3, yy - 3 * sc - 9, hex('#ffdb24')); } // the crown. it's a W. it's a gull's idea of a crown
  });
}
function drawWeevil(e) {
  drawFoeBase(e, 14, (x, y, hit) => {
    const c = hit ? WHITE : hex('#6d2492'), leg = (WD.t >> 3) & 1;
    for (let i = -1; i <= 1; i++) { lineF(x + i * 4, y - 6, x + i * 5 - 3, y - (leg ? 1 : 3), hex('#242424')); lineF(x + i * 4, y - 6, x + i * 5 + 3, y - (leg ? 3 : 1), hex('#242424')); }
    circF(x, y - 8, 6, c); circF(x + 6, y - 9, 3, c); rectF(x + 8, y - 9, 4, 1, hex('#242424')); pset(x + 7, y - 10, hex('#6dff24'));
  });
}
Object.assign(ENEMY, {
  jetski: { name: 'JET SKI GUY', hp: 8, spd: 1.9, ai: 'roll', dmg: 3, xp: 4, bux: [2, 4], hw: 8, draw: e => drawJetski(e) },
  gull: { name: 'SEAGULL', hp: 5, spd: 1.3, ai: 'orbit', dmg: 2, xp: 3, bux: [0, 2], fly: 1, draw: e => drawGull(e), shoot: { every: 220, spd: 1.4, kind: 'note', dmg: 1 } },
  weevil: { name: 'SPACE WEEVIL', hp: 7, spd: 2, ai: 'hop', dmg: 2, xp: 3, bux: [1, 3], draw: e => drawWeevil(e) },
});

// ---------------- loot crates: something for poking around ----------------
function lootCrate(id, tx, ty, label, bonus = 0) {
  return { id: 'loot_' + id, tx, ty, label, if: () => !F2('loot_' + id), hw: 8, hh: 5,
    draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 9, y - 12, 18, 12, hex('#926d49')); rectF(x - 9, y - 12, 18, 2, hex('#b6926d')); rectF(x - 1, y - 10, 2, 8, hex('#492410')); if ((WD.t >> 4) & 1) pset(x + 6, y - 14, hex('#ffffdb')); },
    talk: async () => { setF2('loot_' + id); sfx('object'); const b = genBong(C2.ep + 1 + bonus); giveBong(b); await say('INSIDE: ' + b.name + '. ' + bongStats(b).join(', ') + '.'); } };
}

// ---------------- music ----------------
Object.assign(TRACKS, {
  marina: { bpm: 150, ch: [
    { ins: 'surf', n: 'A4 . A4 C5 . E5 . D5 C5 . A4 . G4 . A4 . F4 . F4 A4 . C5 . B4 A4 . G4 . E4 . G4 .' },
    { ins: 'bass', n: 'A2 . . A2 . . E2 . A2 . . A2 . . E2 . F2 . . F2 . . C2 . G2 . . G2 . . D2 .' },
    { ins: 'organ', vol: .5, n: 'E4 - - - - - - - E4 - - - - - - - F4 - - - - - - - D4 - - - - - - -' },
    { drum: 1, vol: .6, n: 'k . h k s . h . k . h k s . h h' }] },
  backstage: { bpm: 120, ch: [
    { ins: 'slap', n: 'D2 . D3 . . D2 F2 . G2 . . G2 F2 . D2 C2 D2 . D3 . . D2 F2 . A2 . G2 . E2 . A1 .' },
    { ins: 'epiano', n: 'D4 F4 A4 . . . . . G4 A#4 D5 . . . . . D4 F4 A4 . . . . . E4 G4 A#4 . A4 . . .' },
    { ins: 'brass', vol: .7, n: '. . . . A4 - - - . . . . A#4 - - - . . . . A4 - - - . . . . C#5 - - -' },
    { drum: 1, vol: .55, n: 'k . h . s . h . k k h . s . h h' }] },
});

// ================= EPISODE 3: THE MARINA (jacket, skis, ramp) =================
function marinaObj() {
  const n = ['gotJacket', 'gotSkis', 'gotRamp'].filter(k => F2(k)).length;
  if (n === 3) return setObj('Bring the jacket, skis and ramp to the Committee (beach)', 'lake', 14, 10);
  const t = !F2('gotJacket') ? ['Get a JACKET from the leather stand', 'marina', 9, 4]
    : !F2('gotRamp') ? (F2('gullsDown') ? ['Take the RAMP (boathouse)', 'boathouse', 10, 3] : F2('rampAsked') ? ['Clear the gulls out of the boathouse', 'boathouse', 10, 8] : ['Ask the bait shop about a RAMP', 'marina', 20, 4])
    : ['Win the SKIS from the lifeguard (the far pier)', 'marina', 27, 13];
  setObj(t[0] + ' (' + n + '/3)', t[1], t[2], t[3]);
}
async function lakeCommittee() {
  if (F2('jacket')) return say(pick(['The A.S.S. is at the end of the dock. It is a boat now.', 'Ratings are waiting, Carl.']), HOC);
  if (!F2('marinaQuest')) {
    await say('Carl. The parcel is across the lake. Dock 219. Also, ratings are down.', HOC);
    await say('You\'re going to jump a shark.', HOC);
    await C('A what.', 'w'); await C('A WHAT.', 'a');
    await say('The A.S.S. has been reclassified as a boat. Boats are fine. You may ride behind it. On skis. In a jacket. Off a ramp.', LG);
    await say('The network provides nothing. The marina has everything. It\'s a marina. Jacket. Skis. Ramp.', HOC);
    await C('Why do I need a jacket to jump a shark. Why do I need to jump a shark. Chat, is this a thing? Is this a thing shows do?', 'w');
    if (C2.comp === 'garf') await say('It\'s a thing shows do. It\'s usually the end of them.', GF);
    setF2('marinaQuest'); return marinaObj();
  }
  if (!(F2('gotJacket') && F2('gotSkis') && F2('gotRamp'))) { await say(pick(['Jacket. Skis. Ramp. The marina is east. It\'s always east.', 'We\'ll wait. We have the budget for waiting. We don\'t have the budget for anything else.']), HOC); return marinaObj(); }
  await say('Jacket. Skis. Ramp. You did the whole bit. The network is moved. The network is never moved.', HOC);
  await say('Put the jacket on.', HOC);
  await say('CARL PUTS ON THE LEATHER JACKET. IT\'S NINETY DEGREES. HE LOOKS INCREDIBLE. HE FEELS TERRIBLE.');
  await C('Okay. Okay. Chat, how do I look. Don\'t answer that. Answer that.', 'h');
  setF2('jacket'); setObj('Get on the A.S.S. (end of the dock)', 'lake', 17, 20);
}
async function marinaEnter() {
  if (F2('marinaIntro')) return; setF2('marinaIntro');
  await C('The marina. Boats. Boardwalk. A man selling jackets in July. A tower with a guy on it. Everything a lake needs.', 'n');
  if (!F2('marinaQuest')) await C('...The Committee was on the beach. I should probably go see what they want. I never want to. I always go.', 'w');
}
async function coolGuyTalk() {
  if (F2('gotJacket')) return say(pick(['Wear it like you didn\'t try. You tried. Wear it like you didn\'t.', 'Ayyy.', 'The jacket chooses the guy. It chose you. I\'m as surprised as you are.']), CG);
  if (!F2('marinaQuest')) return say('FONZ-O-RAMA LEATHER. Jackets for guys about to do something they shouldn\'t. Come back when you\'re about to.', CG);
  await say('You want a jacket. Everybody wants a jacket. Not everybody\'s cool enough for the jacket.', CG);
  await C('I need it for a shark. It\'s for work. I don\'t even want to be cool. I want to be done.', 'w');
  await say('...That\'s the coolest thing anybody\'s said at this stand. Prove it. Argue me.', CG);
  const won = await argue2({ name: 'THE COOL GUY', port: CG, hp: 34, power: 3, weak: { DENIAL: 2, RANT: 1.4, LOGIC: .6 }, bg: ['#3a1a1a', '#100808'],
    intro: 'THE COOL GUY WANTS TO ARGUE! HE IS LEANING ON SOMETHING. THERE IS NOTHING THERE.', atk: ['You\'re trying. I can see you trying.', 'Cool is a feeling. You have a different feeling.', 'Ayyy.', 'I don\'t argue. I lean. You\'re losing to a lean.'],
    low: ['Hey. Hey. That was... hey.', 'I\'m still cool. I\'m checking. Still cool.'], react: { DENIAL: 'You\'re not trying to be cool? That\'s... that\'s the move. That\'s the whole move.', LOGIC: 'Facts aren\'t cool, man.' },
    carl: { DENIAL: ['I\'m not cool. I\'m green. I\'m short. I\'m wearing a tie on a beach.', 'I don\'t care about the jacket. I care about the shark. The shark is the problem.'] },
    win: '...Take it. Take the jacket. Don\'t thank me. Thanking is warm. We\'re cool.', lose: 'Come back when you mean it less.' });
  if (!won) return;
  setF2('gotJacket'); sfx('get');
  await say('CARL GOT: A LEATHER JACKET. IT\'S HOT. IT\'S A LAKE. IT\'S NINETY DEGREES.');
  marinaObj();
}
async function oldSaltTalk() {
  if (F2('gotRamp')) return say(pick(['That ramp\'s jumped three sharks and a car. Treat her right.', 'Gulls\'ll be back. Gulls are always back. Like reruns.']), OS);
  if (!F2('marinaQuest')) return say('Bait. Tackle. Ramp. Mostly ramp. Nobody fishes here. Everybody jumps things.', OS);
  if (F2('rampAsked')) return say(F2('gullsDown') ? 'You cleared \'em? Then she\'s yours. The ramp. In the boathouse. Go on.' : 'Boathouse. On the left pier. Mind the big one. He\'s got a crown. He made it himself.', OS);
  await say('A ramp? For a shark? Son, every show that\'s ever come through here wanted my ramp.', OS);
  await say('A cop show. A family show. A show about a talking car. They all jumped the shark off my ramp. None of \'em came back.', OS);
  await C('That\'s not encouraging. That\'s the opposite of encouraging.', 'w');
  await say('Ramp\'s in the boathouse. Problem is, the gulls moved in. There\'s a king now. Clear \'em out and she\'s yours.', OS);
  setF2('rampAsked'); marinaObj();
}
async function lifeguardIntro() {
  music('boss');
  await say('HEY. HEY. NO RUNNING ON THE PIER.', LGD);
  await C('I\'m walking! I\'m walking in a jacket! It\'s very hot!', 'a');
  await say('You want the skis? The skis are for lifeguards and the jet ski guys. You\'re neither. Jet ski guys: GET HIM.', LGD);
}
function lifeguardUpd(e) {
  if (e.dead) return; const ph = e.hp < e.maxhp / 2 ? 2 : 1; e.tt = (e.tt || 0) + 1; e.spr = CS.people.lifeguard;
  if (e.dash > 0) { e.dash--; const m = moveBox(e, e.dx, e.dy, 10, 6); if (m.hitX || m.hitY) e.dash = 0; }
  else towardPL(e, ph === 2 ? .8 : .6);
  if (e.tt % 90 === 0) aimShots(e, ph === 2 ? 3 : 2, 2, .3, 'net', 2);
  if (e.tt % 230 === 0) { tickChat(LGD, pick(['*WHISTLE*', 'NO HORSEPLAY', 'ADULT SWIM', 'WALK'])); ringShots(e, ph === 2 ? 12 : 8, 1.7, 'note', 2, e.tt * .01); sfx('alert'); }
  if (ph === 2 && e.tt % 160 === 80) { const a = Math.atan2(PL.y - e.y, PL.x - e.x); e.dx = Math.cos(a) * 3.2; e.dy = Math.sin(a) * 3.2; e.dash = 26; sfx('power'); }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 16) hurtPlayer(3, e.x, e.y);
}
function lifeguardBoss() {
  bossEnt({ id: 'chad', name: 'CHAD THE LIFEGUARD', x: 28 * 16, y: 13 * 16, hp: 120 + C2.lv * 8, spr: CS.people.lifeguard, P: CS.people.lifeguard[0].P, scale: 1.5, anim: 20, box: [20, 34], hitY: 18, upd: lifeguardUpd, onDie: () => {} });
  sfx('alert');
}
async function lifeguardDown() {
  music('marina'); for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('Okay. OKAY. Take the skis. Nobody\'s ever beaten me. Nobody\'s ever tried. Everybody just walks.', LGD);
  await C('I was walking! The whole time!', 'a');
  setF2('gotSkis'); sfx('get'); await say('CARL GOT: WATER SKIS. THEY\'RE LONGER THAN HE IS. MOST THINGS ARE.');
  marinaObj();
}
async function boathouseEnter() {
  if (F2('bhIntro')) return; setF2('bhIntro');
  await C('It smells like fish. And feathers. And ambition. Something in here has ambition.', 'w');
}
async function gullStart() {
  await say('SQUAWK.', 'THE GULL KING');
  await C('Is that a crown? Is that bird wearing a CROWN? It\'s a W. The crown is the letter W.', 'w');
  if (C2.comp === 'bruce') await say('I know this guy. He took a fry off me once. I\'m a shark.', BR);
  music('boss');
}
function gullKingUpd(e) {
  if (e.dead) return; const ph = e.hp < e.maxhp / 2 ? 2 : 1; e.tt = (e.tt || 0) + 1;
  if (e.swoop > 0) { e.swoop--; e.x += e.dx; e.y += e.dy; e.x = clamp(e.x, 24, WD.w * 16 - 24); e.y = clamp(e.y, 40, WD.h * 16 - 40); }
  else { e.ang = (e.ang || 0) + .025; const tx = PL.x + Math.cos(e.ang) * 80, ty = PL.y - 30 + Math.sin(e.ang) * 40; e.x += clamp(tx - e.x, -1.3, 1.3); e.y += clamp(ty - e.y, -1.3, 1.3); }
  e.z = 10 + Math.sin(e.t * .1) * 4;
  if (e.tt % (ph === 2 ? 160 : 210) === 0) { const a = Math.atan2(PL.y - e.y, PL.x - e.x); e.dx = Math.cos(a) * 3; e.dy = Math.sin(a) * 3; e.swoop = 32; sfx('power'); }
  if (e.tt % 120 === 60) aimShots(e, ph === 2 ? 4 : 3, 1.7, .35, 'note', 2);
  if (ph === 2 && e.tt % 300 === 150 && enemiesAlive() < 4) { spawnEnemy('gull', e.x - 20, e.y); spawnEnemy('gull', e.x + 20, e.y); }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 18) hurtPlayer(2, e.x, e.y);
}
async function gullsDown() {
  music('marina'); for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('THE GULL KING DROPS HIS CROWN. IT WAS A FRENCH FRY BENT INTO A W.');
  await C('He was just a bird. He was just a bird with a dream.', 's');
  marinaObj();
}
async function takeRamp() {
  setF2('gotRamp'); sfx('get');
  await say('CARL GOT: A RAMP. IT FOLDS. IT DOES NOT FOLD SMALL. IT HAS NAMES SCRATCHED IN IT. ONE OF THEM IS A CAR.');
  marinaObj();
}

// ================= EPISODE 5: THE COMMUNE (three shifts before Comrade Carl talks) =================
const SHIFTS = [['shiftField', 'THE POTATO FIELD'], ['shiftChoir', 'THE BLANKET CHOIR'], ['shiftReactor', 'THE REACTOR']];
const valvesOpen = () => [1, 2, 3].filter(i => F2('valve' + i)).length;
function moonObj() {
  const n = SHIFTS.filter(([k]) => F2(k)).length;
  if (n === 3) { setF2('collective'); return setObj('Talk to Comrade Carl', 'moon', 17, 11); }
  let t;
  if (!F2('shiftField')) t = ['Shift 1: clear the potato field (southwest)', 'moon', 5, 21];
  else if (!F2('shiftChoir')) t = ['Shift 2: sing with the blanket choir (the hall)', 'moonhall', 17, 6];
  else if (valvesOpen() < 3) { const i = [1, 2, 3].find(k => !F2('valve' + k)), v = VALVES[i - 1]; t = ['Shift 3: open the reactor valves (' + valvesOpen() + '/3)', 'reactor', v[0], v[1] + 1]; }
  else t = ['Shift 3: deal with whatever\'s in the reactor core', 'reactor', 12, 5];
  setObj(t[0] + ' [' + n + '/3 shifts]', t[1], t[2], t[3]);
}
async function workBoard() {
  sfx('tick');
  await say('THE WORK BOARD. ' + SHIFTS.map(([k, s]) => (F2(k) ? '[DONE] ' : '[OPEN] ') + s).join('. ') + '.');
  if (F2('shiftAsked') && !F2('collective')) await say('AT THE BOTTOM, IN CRAYON: "EVERYBODY DOES A SHIFT. EVEN VISITORS. ESPECIALLY VISITORS."');
}
async function choirTalk() {
  if (F2('shiftChoir')) return say(pick(['Red, red, red. That\'s the song. You know the song now.', 'You sang with us. Now you\'re a little bit red. Inside.']), CHO);
  if (!F2('shiftAsked')) return say('We are the Blanket Choir. We sing the blanket song. You may listen. Listening is not a shift.', CHO);
  await say('The blanket song is a dance. Everything on this moon is a dance. Follow us.', CHO);
  await C('I can dance. I think I can dance. I\'ve never danced. I\'ve been in a lot of situations where I should have danced.', 'w');
  const r = await boogaloo({ rounds: 3, partner: { name: 'THE CHOIR', title: 'BLANKET SONG', spr: CS.people.choir, P: CS.people.choir[0].P } });
  if (!r.win) return say('...That was a different song. Again. Songs are for everyone. Even the wrong one.', CHO);
  setF2('shiftChoir'); sfx('get'); C2.pretzels += 1;
  await say('Red, red, red! You\'re in the choir now. Here: a ration. It\'s a pretzel. Everything here is a pretzel.', CHO);
  moonObj();
}
async function fieldStart() {
  await say('THE POTATO FIELD. SOMETHING IS EATING THE POTATOES. SOMETHING WITH A LOT OF LEGS.');
  await C('Space weevils. Of course. Everything in space is a bug or a guy in a suit.', 'w');
}
async function fieldDone() {
  setF2('shiftField'); sfx('get');
  await say('THE POTATOES ARE SAFE. THE POTATOES DO NOT THANK YOU. THEY ARE POTATOES.');
  giveBong(genBong(C2.ep + 2)); moonObj();
}
const VALVES = [[3, 9], [22, 9], [12, 13]];
async function turnValve(i) {
  if (F2('valve' + i)) return say('THIS VALVE IS OPEN. IT HUMS A LITTLE. IT\'S HUMMING THE BLANKET SONG.');
  setF2('valve' + i); sfx('switch'); WD.shake = 6;
  banner('VALVE ' + valvesOpen() + '/3 OPEN', 120);
  if (valvesOpen() === 3) { sfx('door'); await say('SOMEWHERE IN THE MIDDLE OF THE REACTOR, A BLAST DOOR OPENS. SOMETHING BEHIND IT CLEARS ITS THROAT.'); }
  moonObj();
}
async function reactorEnter() {
  if (F2('reactorIntro')) return; setF2('reactorIntro');
  await C('The reactor. It runs on... potatoes? It runs on potatoes and singing. That\'s not how reactors work. That\'s how this one works.', 'w');
  moonObj();
}
async function planStart() {
  await say('I AM THE FIVE-YEAR PLAN. I HAVE BEEN RUNNING FOR TWELVE YEARS.', 'THE FIVE-YEAR PLAN');
  await C('You\'re a CLIPBOARD. You\'re a clipboard with LEGS.', 'a');
  await say('QUOTA: ONE (1) CARL. QUOTA STATUS: BEHIND.', 'THE FIVE-YEAR PLAN');
  music('boss');
  bossEnt({ id: 'plan', name: 'THE FIVE-YEAR PLAN', x: 13 * 16, y: 3 * 16 + 14, hp: 170 + C2.lv * 10, draw: e => drawPlan(e), box: [30, 36], hitY: 20, upd: planUpd, onDie: () => {} });
}
function drawPlan(e) {
  const x = e.x - camX, y = e.y - camY - 6 + Math.sin(WD.t * .06) * 2, hit = e.fl && (e.fl & 2);
  rectA(x - 14, e.y - camY - 2, 28, 4, BLACK, .4);
  for (const dx of [-8, 6]) rectF(x + dx, y - 8, 3, 8 + ((WD.t >> 3) & 1) * 2, hex('#6d6d6d'));
  rectF(x - 15, y - 42, 30, 36, hit ? WHITE : hex('#926d49')); rectF(x - 12, y - 39, 24, 31, hex('#f0f0f0')); rectF(x - 5, y - 45, 10, 5, hex('#b6b6b6'));
  for (let i = 0; i < 5; i++) { const h = 3 + ((i * 7 + (WD.t >> 5)) % 9); rectF(x - 10 + i * 4, y - 12 - h, 3, h, hex(['#db2424', '#ffdb24'][i & 1])); }
  rectF(x - 10, y - 35, 20, 2, hex('#242424')); rectF(x - 10, y - 31, 14, 2, hex('#242424'));
  rectF(x - 7, y - 26, 4, 3, hex('#db2424')); rectF(x + 3, y - 26, 4, 3, hex('#db2424'));
}
function planUpd(e) {
  if (e.dead) return; const ph = e.hp < e.maxhp / 2 ? 2 : 1; e.tt = (e.tt || 0) + 1;
  e.dir2 = e.dir2 || 1; const m = moveBox(e, e.dir2 * (ph === 2 ? 1.1 : .7), 0, 14, 6); if (m.hitX) e.dir2 = -e.dir2;
  if (e.tt % 70 === 0) aimShots(e, 3, 2.1, .25, 'orb', 2);
  if (e.tt % 210 === 0) { ringShots(e, ph === 2 ? 14 : 10, 1.6, 'note', 2, e.tt * .02); tickChat('THE FIVE-YEAR PLAN', pick(['QUOTA', 'AHEAD OF SCHEDULE', 'BEHIND SCHEDULE', 'REVISED ESTIMATE'])); }
  if (ph === 2 && e.tt % 400 === 200 && enemiesAlive() < 3) { spawnEnemy('cosmo', 8 * 16, 4 * 16); spawnEnemy('cosmo', 18 * 16, 4 * 16); }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 20) hurtPlayer(3, e.x, e.y);
}
async function planDown() {
  music('facility'); for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('QUOTA... MET...? QUOTA... REVISED... DOWNWARD... THANK YOU... FOR YOUR... SHIFT...', 'THE FIVE-YEAR PLAN');
  await C('I beat a plan. I\'ve never had a plan. Now I\'ve beaten one.', 'h');
  setF2('shiftReactor'); sfx('get'); moonObj();
}
async function moonHallEnter() {
  if (F2('hallIntro')) return; setF2('hallIntro');
  await C('The commune hall. It\'s warm in here. There\'s a choir. There\'s a board. There\'s soup. It smells like a home. I don\'t know what a home smells like.', 's');
}
async function comradeShift() {
  if (!F2('shiftAsked')) {
    await say('Comrade. Welcome to the Red Moon. You look like me. You look like me if I was worried about everything.', CC);
    await C('I AM worried about everything. Who are you. Why do you have my face. Why do you have a HAT.', 'w');
    await say('Everyone who wants to talk to me does a shift first. Everyone. It\'s fair. Fair is the whole idea.', CC);
    await say('The board is in the hall. Three shifts. Field, choir, reactor. Then we talk. Then we talk about everything.', CC);
    setF2('shiftAsked'); return moonObj();
  }
  await say(pick(['Shifts first. Talking after. The talking will still be here. It\'s a moon. Nothing leaves.', 'The board is in the hall. Through the big door. The big door is for everyone.']), CC);
  moonObj();
}

// ================= EPISODE 7: BACKSTAGE (two segments before the stage) =================
function finaleObj() {
  if (!F2('segA')) return setObj('Segment A: the cold open (left door)', 'segA', 10, 7);
  if (!F2('segB')) return setObj('Segment B: the montage (right door)', 'segB', 10, 7);
  setObj('Go on stage (the big door in the middle)', 'studio', 12, 8);
}
async function stageMgrTalk() {
  if (F2('segA') && F2('segB')) return say(pick(['You\'re on. You\'re ON. Go. Why are you talking to me. GO.', 'Hit your mark. Your mark is the whole stage.']), SM);
  await say(pick(['Two segments, then you\'re on. Cold open, left. Montage, right. Don\'t touch the craft services, they\'re for the talent. You\'re the talent. Touch them.', 'Live television waits for no one. It\'s waiting for you. Hurry up.']), SM);
  finaleObj();
}
async function stageDoorNo() {
  await say('NOT YET. Two segments first. Cold open, montage, THEN the stage. It\'s a show. Shows have an order.', SM);
}
async function craftServices() {
  if (!F2('craftPretzel')) { setF2('craftPretzel'); C2.pretzels += 2; sfx('get'); await say('CRAFT SERVICES. A TABLE OF PRETZELS. A SIGN: "TALENT ONLY." CARL TAKES TWO. HE IS THE TALENT.'); }
  await bongShop();
}
async function backstageCameo(who) {
  const L = {
    face: [['NEW FACE', 'I already ended a generation. You\'re ending a show. It\'s smaller. It\'s still a lot. Break a leg. You don\'t have a lot of leg.']],
    pk: [['PEE KID', 'Do they have a bathroom back here? Asking for the whole franchise.']],
    yoko: [[YOKO_TRUE ? 'YOKO' : 'EMPRESS YOKO', YOKO_TRUE ? 'Go on. Be loud. Somebody should be loud on the way out.' : 'If you lose, the network belongs to me. If you win, also me. Go on.']],
    ghost: [['SPOOKY GHOST', 'BOO. That was for luck. Theater ghosts do that.']],
    linda: [[LI, 'I\'m in the booth. I\'m always in the booth. Every camera is mine. Smile, Carl. That\'s an order and a merchandising opportunity.']],
    garf: [[GF, 'I\'m watching from the wings. I\'m writing the report. The report says "he went on anyway."']],
    bruce: [[BR, 'Every show thinks the finale is the end. It\'s just the last one they film. Go get \'em.']],
  }[who];
  for (const [n, l] of L) await say(l, n);
}
async function backstageEnter() {
  if (C2.ep === 7) music('backstage');
  finaleObj();
}
async function segStart(k) {
  await say(k === 'A' ? 'SEGMENT A: THE COLD OPEN. IT\'S THE PILOT AGAIN, BUT FASTER. THE AUDIENCE LIKES IT FASTER.' : 'SEGMENT B: THE MONTAGE. THE WHOLE SEASON IN ONE ROOM. SOMEBODY CUE THE MUSIC.', 'ANNOUNCER');
  laugh('[APPLAUSE]'); music(k === 'A' ? 'boss' : 'road');
}
function roboRerun() {
  const b = addEnt({ id: 'robo', kind: 'boss', boss: 1, x: 11 * 16, y: 5 * 16, hp: 60 + C2.lv * 6, spr: CS.robo, P: CP.robo, anim: 12, hw: 14, hh: 6, box: [30, 36], hitY: 22, name: 'ROBO MALL COP (RERUN)', upd: roboUpd, onDie: () => {} });
  b.maxhp = b.hp; WD.bossE = b; sfx('glitch'); tickChat('ROBO MALL COP', 'CITATION: SEQUEL. CITATION: RERUN.');
}
async function segDone(k) {
  music('backstage'); for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  laugh('[APPLAUSE]');
  await say(k === 'A' ? 'THAT\'S A WRAP ON THE COLD OPEN!' : 'THAT\'S A WRAP ON THE MONTAGE! NOBODY KNOWS WHAT HAPPENED! IT WAS GREAT!', 'ANNOUNCER');
  await C(k === 'A' ? 'I did the whole pilot in a minute. That took me a WEEK the first time.' : 'That was everything. That was the whole year. Why did it go so fast. It went so fast.', k === 'A' ? 'h' : 's');
  finaleObj();
}
async function studioEnter() {
  if (C2.ep !== 7 || F2('huDown')) return;
  if (F2('finaleOn')) return say('LIVE, FROM STUDIO 219: THE SERIES FINALE. (AGAIN.)', 'ANNOUNCER');
  laugh('[APPLAUSE]');
  await say('LIVE, FROM STUDIO 219: THE SERIES FINALE OF CARL 2!', 'ANNOUNCER');
  await C('It\'s a studio. There\'s an audience. There was never an audience. There was always an audience.', 'w');
  await say('Ladies and gentlemen... HU-MAN!', 'ANNOUNCER');
  await say('Nobody tells me what to do.', HU); laugh('[AUDIENCE CHEERS]');
  await C('Everybody tells you what to do! That\'s your whole thing! You\'re a NOTE! You\'re a note with a CHIN!', 'a');
  setF2('finaleOn'); setObj('Beat HU-MAN. On live television.', 'studio', 12, 8);
}
async function startEp7() {
  C2.ep = 7;
  await epCard(7, 'SERIES FINALE', 'Give them what they want.');
  delete C2.flags.special;
  scene = worldScene; loadMap('backstage', 14, 10, 'u'); post.fade = 1; music('backstage'); await fadeIn(.06);
  laugh('[APPLAUSE]');
  await say('PLACES, EVERYBODY. WE ARE LIVE IN TEN.', SM);
  await C('Live? Live live? The whole thing? There\'s no second take?', 'w');
  await say('There\'s always a second take. We just don\'t air it. Two segments, then the big finish. Cold open, left. Montage, right. Then you go on.', SM);
  finaleObj(); saveC2();
}

// ================= maps =================
const MARINA_ROWS = [
  '#'.repeat(36), '#'.repeat(36),
  '#....T...................T.........#',
  '#.......____.......____............#',
  '#..................................#',
  '...................................#',
  '..........o.............o..........#',
  '#::::::::::::::::::::::::::::::::::#',
  '#::::::::::::::::::::::::::::::::::#',
  '#~~~~~~::~~~~~~~~~~~~~~~~~~::~~~~~~#',
  '#~~~~~~::~~~~~~~~~~~~~~~~~~::~~~~~~#',
  '#~~~###DD##~~~~~~~~~~~::::::::::::~#',
  '#~~~#######~~~~~~~~~~~::::::::::::~#',
  '#~~~#######~~~~~~~~~~~::::::::::::~#',
  '#~~~~~~~~~~~~~~~~~~~~~::::::::::::~#',
  '#~~~~~~~~~~~~~~~~~~~~~::::::::::::~#',
  '#~~~~~~~~~~~~~~~~~~~~~::::::::::::~#',
  '#'.repeat(36)];
MAPS2.marina = { theme: 'lake', name: 'LAKE MEAD MARINA', music: () => WD.arena ? 'boss' : F2('special') ? 'special' : 'marina', rows: MARINA_ROWS,
  exits: [{ x: 0, y: 5, w: 1, h: 2, to: 'lake', tx: 34, ty: 5, dir: 'l' }, { x: 7, y: 11, w: 2, h: 1, to: 'boathouse', tx: 10, ty: 11, dir: 'u' }],
  enter: () => marinaEnter(),
  arena: { x: 22, y: 11, w: 12, h: 6, flag: 'skisWon', if: () => F2('marinaQuest'), start: () => lifeguardIntro(), waves: [[['jetski', 24, 12], ['jetski', 31, 15], ['jetski', 27, 14]], [['jetski', 23, 15], ['jetski', 32, 12], ['gull', 27, 12]], () => lifeguardBoss()], done: () => lifeguardDown() },
  ents: () => [
    { id: 'coolguy', tx: 9, ty: 2, spr: () => CS.people.coolguy, anim: 40, label: 'FONZ-O-RAMA', reach: 18, talk: () => coolGuyTalk() },
    { id: 'oldsalt', tx: 20, ty: 2, spr: () => CS.people.oldsalt, anim: 46, label: 'BAIT, TACKLE & RAMP', reach: 18, talk: () => oldSaltTalk() },
    { id: 'tower', tx: 32, ty: 12, solid: 1, hw: 8, hh: 5, draw: e => { const x = e.x - camX, y = e.y - camY; for (const dx of [-7, 5]) rectF(x + dx, y - 30, 2, 30, WHITE); rectF(x - 9, y - 34, 18, 5, hex('#db2424')); rectF(x - 8, y - 40, 16, 6, WHITE); if (!F2('skisWon') && !WD.arena) { const s = CS.people.lifeguard[(WD.t >> 5) & 1]; draw(s, x - 8, y - 62, s.P); } } },
    { id: 'rope', tx: 27, ty: 10, hw: 16, hh: 6, solid: 1, if: () => !!WD.arena, draw: e => { const x = e.x - camX + 8, y = e.y - camY; for (const dx of [-15, 13]) rectF(x + dx, y - 14, 2, 14, hex('#b6926d')); for (let i = 0; i < 7; i++) rectF(x - 14 + i * 4, y - 11 + (i & 1), 4, 2, i & 1 ? WHITE : hex('#db2424')); } },
    lootCrate('marina1', 33, 2, 'LOST & FOUND BIN'),
  ],
  spawns: [{ k: 'gull', x: 14, y: 7, if: () => F2('marinaQuest') }, { k: 'gull', x: 26, y: 8, if: () => F2('marinaQuest') }, { k: 'jetski', x: 18, y: 8, if: () => F2('marinaQuest') && !F2('skisWon') }],
  signs: { '9,3': () => say('FONZ-O-RAMA LEATHER. "IF YOU HAVE TO ASK, YOU\'RE NOT COOL. ASK ANYWAY. WE HAVE BILLS."'), '20,3': () => say('BAIT, TACKLE & RAMP. THE RAMP IS NOT FOR SALE. THE RAMP IS FOR DESTINY.'), '33,6': () => say('LIFEGUARD ON DUTY: CHAD. NO RUNNING. NO HORSEPLAY. NO SHARK JUMPING WITHOUT A PERMIT.') },
};
MAPS2.boathouse = { theme: 'lake', name: 'THE BOATHOUSE', music: () => WD.arena ? 'boss' : 'marina', dark: 1,
  rows: [
    '#'.repeat(22), '#'.repeat(22),
    '#::::::::::::::::::::#',
    '#::o::::::::::::::o::#',
    '#::::~~~~~~~~~~~~::::#',
    '#::::~~~~~~~~~~~~::::#',
    '#::::~~~~~~~~~~~~::::#',
    '#::::::::::::::::::::#',
    '#::o::::::::::::::o::#',
    '#::::::::::::::::::::#',
    '#::::::::::::::::::::#',
    '#::::::::::::::::::::#',
    '#'.repeat(10) + 'DD' + '#'.repeat(10)],
  exits: [{ x: 10, y: 12, w: 2, h: 1, to: 'marina', tx: 7, ty: 10, dir: 'd' }],
  enter: () => boathouseEnter(),
  arena: { x: 1, y: 2, w: 20, h: 8, flag: 'gullsDown', if: () => F2('marinaQuest'), start: () => gullStart(), waves: [[['gull', 4, 3], ['gull', 16, 3], ['gull', 10, 8]], [['gull', 3, 8], ['gull', 17, 8], ['gull', 10, 2]], () => bossEnt({ id: 'gullking', name: 'THE GULL KING', x: 10 * 16, y: 3 * 16, hp: 70 + C2.lv * 5, draw: e => drawGull(e, 2.4), box: [36, 20], hitY: 22, upd: gullKingUpd, onDie: () => {} })], done: () => gullsDown() },
  ents: () => [
    { id: 'ramp', tx: 10, ty: 3, label: 'THE RAMP', if: () => F2('gullsDown') && !F2('gotRamp'), draw: e => { const x = e.x - camX, y = e.y - camY; triF(x - 16, y, x + 16, y, x + 16, y - 14, hex('#926d49')); lineF(x - 16, y, x + 16, y - 14, hex('#b6926d')); }, talk: () => takeRamp() },
    lootCrate('boat1', 19, 10, 'COOLER', 1),
  ],
};
MAPS2.moonhall = { theme: 'moon', name: 'THE COMMUNE HALL', music: 'moon',
  rows: [
    '#'.repeat(24), '#'.repeat(20) + 'DD##',
    '#......................#',
    '#..o................o..#',
    '#......................#',
    '#......______..........#',
    '#......................#',
    '#......................#',
    '#..o................o..#',
    '#......................#',
    '#......................#',
    '#......................#',
    '#'.repeat(11) + 'DD' + '#'.repeat(11)],
  exits: [{ x: 11, y: 12, w: 2, h: 1, to: 'moon', tx: 17, ty: 8, dir: 'd' }, { x: 20, y: 1, w: 2, h: 1, to: 'reactor', tx: 12, ty: 14, dir: 'u' }],
  enter: () => moonHallEnter(),
  ents: () => [
    { id: 'board', tx: 5, ty: 2, label: 'WORK BOARD', reach: 6, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 14, y - 24, 28, 18, hex('#6d4924')); for (let i = 0; i < 3; i++) rectF(x - 11 + i * 8, y - 21, 6, 8, F2(SHIFTS[i][0]) ? hex('#6dff24') : hex('#f0f0f0')); rectF(x - 2, y - 6, 4, 6, hex('#492410')); }, talk: () => workBoard() },
    { id: 'ch1', tx: 15, ty: 5, spr: () => CS.people.choir, anim: 30, talk: () => choirTalk() },
    { id: 'ch2', tx: 17, ty: 5, spr: () => CS.people.choir, anim: 34, label: 'THE BLANKET CHOIR', talk: () => choirTalk() },
    { id: 'ch3', tx: 19, ty: 5, spr: () => CS.people.choir, anim: 38, talk: () => choirTalk() },
    { id: 'soup', tx: 9, ty: 4, label: 'SOUP', reach: 14, noPrompt: 0, draw: e => { const x = e.x - camX, y = e.y - camY; circF(x, y - 6, 6, hex('#6d6d6d')); circF(x, y - 7, 4, hex('#db2424')); if ((WD.t >> 4) & 1) pset(x + 1, y - 14, WHITE); }, talk: async () => { if (C2.hp < C2.maxhp) { C2.hp = C2.maxhp; sfx('get'); await say('SOUP. IT\'S BEET SOUP. IT\'S FOR EVERYONE. COMPOSURE RESTORED.'); } else await say('BEET SOUP. YOU\'RE FULL. THE SOUP UNDERSTANDS.'); } },
    lootCrate('hall1', 2, 11, 'SUPPLY LOCKER'),
  ],
  signs: { '20,2': () => say('REACTOR. "AUTHORIZED COMRADES ONLY. ALL COMRADES ARE AUTHORIZED."') },
};
MAPS2.reactor = { theme: 'lab', name: 'THE POTATO REACTOR', music: () => WD.arena ? 'boss' : 'facility', dark: 1,
  rows: [
    '#'.repeat(26), '#'.repeat(26),
    '######..............######',
    '######..............######',
    '######..............######',
    '######..............######',
    '############..############',
    '#........................#',
    '#..T..................T..#',
    '#........................#',
    '#...####..........####...#',
    '#...####..........####...#',
    '#........................#',
    '#..T..................T..#',
    '#........................#',
    '#'.repeat(12) + 'DD' + '#'.repeat(12)],
  exits: [{ x: 12, y: 15, w: 2, h: 1, to: 'moonhall', tx: 20, ty: 2, dir: 'd' }],
  enter: () => reactorEnter(),
  arena: { x: 6, y: 2, w: 14, h: 4, flag: 'planDown', if: () => valvesOpen() === 3, start: () => planStart(), waves: [], done: () => planDown() },
  ents: () => [
    ...VALVES.map(([x, y], i) => ({ id: 'valve' + (i + 1), tx: x, ty: y, label: 'VALVE', draw: e => { const X = e.x - camX, Y = e.y - camY, on = F2('valve' + (i + 1)); rectF(X - 2, Y - 14, 4, 14, hex('#6d6d80')); ringF(X, Y - 16, 6, on ? hex('#6dff24') : hex('#db2424')); lineF(X - 6, Y - 16, X + 6, Y - 16, on ? hex('#6dff24') : hex('#db2424')); }, talk: () => turnValve(i + 1) })),
    { id: 'blast', tx: 12, ty: 6, hw: 16, hh: 6, solid: 1, if: () => valvesOpen() < 3, draw: e => { const x = e.x - camX + 8, y = e.y - camY; rectF(x - 16, y - 16, 32, 16, hex('#6d6d80')); for (let i = 0; i < 4; i++) rectF(x - 14 + i * 8, y - 14, 4, 12, hex('#ffdb24')); }, talk: () => say('A BLAST DOOR. THREE LIGHTS ABOVE IT. ' + valvesOpen() + ' ARE GREEN.') },
    lootCrate('reactor1', 23, 14, 'RATION CRATE', 1),
  ],
  spawns: [{ k: 'cosmo', x: 6, y: 9 }, { k: 'cosmo', x: 19, y: 12 }, { k: 'drone', x: 12, y: 8 }, { k: 'cosmo', x: 18, y: 13 }, { k: 'drone', x: 20, y: 7 }],
};
const SEG_ROWS = [
  '#'.repeat(22), '#'.repeat(22),
  '#....................#',
  '#....................#',
  '#..o..............o..#',
  '#....................#',
  '#....................#',
  '#....................#',
  '#....................#',
  '#....................#',
  '#..o..............o..#',
  '#....................#',
  '#....................#',
  '#....................#',
  '#'.repeat(10) + 'DD' + '#'.repeat(10)];
MAPS2.segA = { theme: 'mall', name: 'SEGMENT A: THE COLD OPEN', music: () => WD.arena ? 'boss' : 'backstage', rows: SEG_ROWS, noHuman: 0,
  exits: [{ x: 10, y: 14, w: 2, h: 1, to: 'backstage', tx: 5, ty: 2, dir: 'd' }],
  arena: { x: 1, y: 2, w: 20, h: 11, flag: 'segA', start: () => segStart('A'), waves: [[['focus', 4, 4], ['focus', 16, 4], ['cop', 10, 3], ['cart', 6, 8]], [['cart', 14, 8], ['tumble', 4, 6], ['tumble', 16, 6], ['lite', 10, 4]], () => roboRerun()], done: () => segDone('A') },
  ents: () => [],
};
MAPS2.segB = { theme: 'backlot', name: 'SEGMENT B: THE MONTAGE', music: () => WD.arena ? 'road' : 'backstage', rows: SEG_ROWS,
  exits: [{ x: 10, y: 14, w: 2, h: 1, to: 'backstage', tx: 24, ty: 2, dir: 'd' }],
  arena: { x: 1, y: 2, w: 20, h: 11, flag: 'segB', start: () => segStart('B'), waves: [[['jack', 5, 5], ['jack', 15, 5], ['figure', 10, 4], ['figure', 8, 8]], [['drone', 6, 4], ['drone', 14, 4], ['cosmo', 10, 3], ['weevil', 4, 9], ['weevil', 16, 9]], [['yokoid', 5, 4], ['yokoid', 15, 4], ['mask', 10, 6], ['gull', 8, 3], ['jetski', 12, 9]], [['lite', 6, 4], ['lite', 14, 4], ['suit', 10, 3]]], done: () => segDone('B') },
  ents: () => [],
};
MAPS2.backstage = { theme: 'studio', name: 'BACKSTAGE', music: 'backstage',
  rows: [
    '#'.repeat(30),
    '#####DD#######DD#######DD#####',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,____,,,,,,,,,,,,,,,,____,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,o,,,,,,,,,,,,,,,,,,,,,,o,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,o,,,,,,,,,,,,,,,,,,,,,,o,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#',
    '#'.repeat(30)],
  exits: [
    { x: 5, y: 1, w: 2, h: 1, to: 'segA', tx: 10, ty: 13, dir: 'u' },
    { x: 14, y: 1, w: 2, h: 1, to: 'studio', tx: 12, ty: 15, dir: 'u', if: () => F2('segA') && F2('segB'), no: () => stageDoorNo() },
    { x: 23, y: 1, w: 2, h: 1, to: 'segB', tx: 10, ty: 13, dir: 'u' }],
  enter: () => backstageEnter(),
  ents: () => [
    { id: 'sm', tx: 12, ty: 3, spr: () => CS.people.stagemgr, anim: 30, label: 'STAGE MANAGER', talk: () => stageMgrTalk() },
    { id: 'craft', tx: 4, ty: 3, spr: () => CS.people.clerk, anim: 40, label: 'CRAFT SERVICES', reach: 18, talk: () => craftServices() },
    { id: 'saveB', tx: 9, ty: 3, spr: CS.savebox, P: CP.item, label: 'SAVE', talk: () => saveBox() },
    { id: 'wings_face', tx: 3, ty: 9, label: 'NEW FACE', draw: e => drawFaceHead(e), talk: () => backstageCameo('face') },
    { id: 'wings_pk', tx: 7, ty: 12, label: 'PEE KID', draw: e => drawPK(e), talk: () => backstageCameo('pk') },
    { id: 'wings_yoko', tx: 22, ty: 12, label: YOKO_TRUE ? 'YOKO' : 'EMPRESS YOKO', draw: e => drawYoko2(e), talk: () => backstageCameo('yoko') },
    { id: 'wings_ghost', tx: 26, ty: 9, spr: CS.ghost, P: YOKO_TRUE ? CP.ghost : legacyPal(CP.ghost, 'red'), anim: 20, label: 'SPOOKY GHOST', talk: () => backstageCameo('ghost') },
    { id: 'wings_linda', tx: 15, ty: 12, label: 'THE BOOTH', draw: e => drawLindaScreen(e), talk: () => backstageCameo('linda') },
    { id: 'wings_garf', tx: 19, ty: 7, spr: CS.garf, P: CP.garf, anim: 40, label: 'JB GARFIELD', talk: () => backstageCameo('garf'), if: () => C2.comp !== 'garf' && F2('garfJoined') },
    { id: 'wings_bruce', tx: 10, ty: 7, spr: CS.shark, P: CP.shark, anim: 30, label: 'BRUCE', talk: () => backstageCameo('bruce'), if: () => C2.comp !== 'bruce' && F2('bruceMet') },
    lootCrate('back1', 27, 3, 'PROP TRUNK', 2),
  ],
  signs: { '5,2': () => say('SEGMENT A: THE COLD OPEN.'), '14,2': () => say('STAGE. RED LIGHT MEANS LIVE. THE RED LIGHT IS ALWAYS ON.'), '23,2': () => say('SEGMENT B: THE MONTAGE.'), '24,5': () => say('WARDROBE. A RACK OF HU-MAN TIES. HUNDREDS. THEY\'RE CLIP-ONS.') },
};

// ================= rewiring the existing maps =================
{ // Lake Mead gets a way east to the marina
  const R = MAPS2.lake.rows; for (const y of [5, 6]) R[y] = R[y].slice(0, -1) + '.';
  MAPS2.lake.exits.push({ x: 35, y: 5, w: 1, h: 2, to: 'marina', tx: 1, ty: 5, dir: 'r' });
  MAPS2.lake.signs['34,4'] = () => say('MARINA → "JACKETS. SKIS. RAMPS. DESTINY."');
}
{ // the Red Moon: the big doors lead into the commune hall; the potato field is a fight; Comrade Carl wants a shift first
  MAPS2.moon.exits.push({ x: 17, y: 7, w: 2, h: 1, to: 'moonhall', tx: 11, ty: 11, dir: 'u' });
  MAPS2.moon.signs['17,7'] = () => say('THE COMMUNE HALL. "EVERYBODY DOES A SHIFT."');
  MAPS2.moon.arena = { x: 1, y: 19, w: 9, h: 6, flag: 'weevilsDown', if: () => F2('shiftAsked'), start: () => fieldStart(), waves: [[['weevil', 3, 20], ['weevil', 7, 21], ['weevil', 5, 23]], [['weevil', 2, 23], ['weevil', 8, 20], ['weevil', 4, 21], ['weevil', 6, 23]], [['weevil', 3, 21], ['weevil', 7, 23], ['jack', 5, 20], ['weevil', 8, 22], ['weevil', 2, 20]]], done: () => fieldDone() };
  MAPS2.moon.music = () => WD.arena ? 'boss' : 'moon';
  const comrade0 = comradeTalk;
  comradeTalk = async () => { if (!F2('collective') && !F2('comradeDone')) return comradeShift(); if (!F2('comradeIntro2') && !F2('comradeDone')) { setF2('comradeIntro2'); await say('You did a shift. Three shifts. Nobody does three. Okay. Now we talk.', CC); } return comrade0(); };
  const ents0 = MAPS2.moon.ents; MAPS2.moon.ents = () => ents0().map(d => d.id === 'comrade' ? Object.assign(d, { talk: () => comradeTalk() }) : d).concat([lootCrate('moon1', 33, 3, 'SUPPLY DROP', 1)]);
}
MAPS2.studio.enter = () => studioEnter();
MAPS2.studio.exits = [{ x: 12, y: 17, w: 2, h: 1, to: 'backstage', tx: 14, ty: 2, dir: 'd' }];
