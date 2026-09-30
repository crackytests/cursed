'use strict';
// ================= SPOOKY GHOST — core: palette, art, music, haunting, phasing, minigames, title =================
PALS.red = [[255, 226, 220], [236, 88, 104], [138, 22, 64], [22, 2, 14]];
PALS.offRed = Array(4).fill([120, 70, 78]);
fx.pal = 'red';
const G = 'SPOOKY GHOST';
HERO = G;
VOICE = Object.assign({}, VOICE, { 'SPOOKY GHOST': [1250, 350], COLLECTOR: [260, 10], TOURIST: [900, 90], WIFE: [820, 60], GUEST: [760, 80], YOKO: [1700, 30], 'RED FACE': [380, 60], TECH: [700, 40], SHOPPER: [900, 60], DANCER: [1000, 80], ANNOUNCER: [500, 10] });
SFX.scream = () => { tone(900, .45, { w: 'p25', slide: 2.4, vol: .45 }); nz(.3, { hp: 3000, vol: .25 }); };
SFX.phase = () => { tone(300, .25, { type: 'sine', slide: 3, vol: .4 }); nz(.2, { lp: 1200, vol: .2 }); };

// ---------- SPOOKY GHOST (player) ----------
const sgD = ['.....333333.....', '...3300000033...', '..300000000003..', '.30000000000003.', '.30033000033003.', '.30033000033003.', '.30033000033003.', '.30000000000003.', '.30300000000303.', '.30033333333003.', '.30003033030003.', '.30000333300003.', '3000000000000003'];
const sgU = sgD.map((r, i) => i >= 4 && i <= 11 ? '.30000000000003.' : r);
const sgS = sgD.slice(0, 4).concat(['.30000033003303.', '.30000033003303.', '.30000033003303.', '.30000000000003.', '.30000030000303.', '.30000000333303.', '.30000000303003.', '.30000000033003.', '3000000000000003']);
const HEM_A = ['3000300000300003', '3003.30003.30033', '33...333...33...'], HEM_B = ['3000030000030003', '303.300003.3003.', '.3...3333...33..'];
const hem = rows => [R(rows.concat(HEM_A)), R(rows.concat(HEM_B)), R(rows.concat(HEM_A))];
SPR.spooky = { down: hem(sgD), up: hem(sgU), side: hem(sgS) };
P.spr = 'spooky'; P.anim = 1; P.bob = 1;
SPR.ghostBig = [0, 1].map(k => mk(32, 32, g => {
  g.e(16, 11, 10, 10, 3); g.r(6, 11, 20, 14, 3); g.e(16, 11, 9, 9, 0); g.r(7, 11, 18, 14, 0);
  for (let i = 0; i < 7; i++) { g.r(1 + i, 3 + i - k, 3, 3, 3); } for (let i = 0; i < 7; i++) g.r(2 + i, 4 + i - k, 2, 2, 0);
  for (let x = 6; x < 26; x++) { const d = ((x + k * 3) % 6 < 3) ? 3 : 6; g.r(x, 24, 1, d + 1, 3); if (x > 6 && x < 25) g.r(x, 24, 1, d, 0); }
  g.e(12.5, 9, 2, 3, 3); g.e(19.5, 9, 2, 3, 3);
  g.e(16, 16, 5.5, 3.5, 3); g.r(10, 12, 12, 4, 0); g.p(13, 16, 0); g.p(14, 17, 0); g.p(18, 16, 0); g.p(17, 17, 0);
  g.r(26, 13, 3, 2, 3); g.r(27, 15, 2, 3, 3); g.r(27, 14, 1, 1, 0);
}));

// ---------- CAST ----------
const colD = ['.....333333.....', '....33333333....', '..333333333333..', '....31111113....', '....31311313....', '....31111113....', '.....311113.....', '....33300333....', '...3333033333...', '...3333333333...', '...1333333331...', '.2223333333333..', '.2223333333333..', '....33333333....', '....333..333....', '....333..333....'];
SPR.collector = {
  down: legs(colD, '...333....333...', '....333..333....'),
  up: legs(rowsSwap(colD, { 3: '....33333333....', 4: '....33333333....', 5: '....33333333....' }), '...333....333...', '....333..333....'),
  side: legs(rowsSwap(colD, { 3: '.....31111113...', 4: '.....31113113...', 5: '.....31111113...' }), '....33...33.....', '.....3333.......'),
};
const tourD = ['.....333333.....', '....33333333....', '...3333333333...', '....31111113....', '....31311313....', '....31111113....', '.....311113.....', '......3333......', '.....322223.....', '....32222223....', '...3222332223...', '...3122332213...', '...3122222213...', '....32222223....', '....3223.3223...', '....333..333....'];
SPR.tourist = {
  down: legs(tourD, '...333....333...', '....333..333....'),
  up: legs(rowsSwap(tourD, { 3: '....33333333....', 4: '....33333333....', 5: '....33333333....', 10: '...3222222223...', 11: '...3122222213...' }), '...333....333...', '....333..333....'),
  side: legs(rowsSwap(tourD, { 3: '.....31111113...', 4: '.....31113113...', 5: '.....31111113...', 10: '....32222333....', 11: '....31222333....' }), '....33...33.....', '.....3333.......'),
};
SPR.veil = R(['.....333333.....', '....30000003....', '...3000000003...', '...3011111103...', '...3013113103...', '...3011111103...', '...3001111003...', '...3000000003...', '..300022220003..', '..300222222003..', '..302222222203..', '..312222222213..', '...3222222223...', '...3222222223...', '..322222222223..', '..333333333333..']);
SPR.curse = [0, 1].map(k => mk(16, 16, g => {
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28 + k * .3; g.r(8 + Math.cos(a) * 7 - 1, 8 + Math.sin(a) * 7 - 1, 2, 2, 3); }
  g.e(8, 8, 6, 6, 3); g.e(8, 8, 4.5, 4.5, 2); g.r(4, 6, 3, 1, 0); g.r(9, 6, 3, 1, 0); g.r(5, 10 + k, 6, 1, 0);
}));
SPR.coreIdle = [0, 0, 0, 0, 0, 0, 1].map(i => SPR.core[i]);
SPR.card = mk(16, 16, g => { g.r(2, 4, 12, 9, 3); g.r(3, 5, 10, 7, 0); g.r(4, 6, 7, 1, 2); g.r(4, 8, 5, 1, 2); g.r(4, 10, 6, 1, 2); });
SPR.yoko = [0, 1, 2].map(k => mk(16, 16, g => { g.e(8, 8, 6 + (k & 1), 6 + (k & 1), 1); g.e(8, 8, 3.5, 3.5, 0); g.p(8, 1 + k, 0); g.p(14 - k, 8, 0); g.p(2 + k, 9, 0); }));
SPR.redface = [0, 1].map(k => mk(32, 32, g => { g.r(0, 2, 32, 26, 3); g.r(2, 4, 28, 20, 2); g.r(9, 10, 4, 4, 0); g.r(19, 10, 4, 4, 0); if (k) g.e(16, 19, 5, 2, 0); else g.r(10, 18, 12, 2, 0); g.r(6, 28, 4, 4, 3); g.r(22, 28, 4, 4, 3); }));

// ---------- TILES ----------
const crack = (g, c = 0) => { const pts = [[7, 1], [5, 4], [8, 6], [6, 9], [9, 12], [7, 15]]; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = pts[i], [c2, d] = pts[i + 1]; for (let s = 0; s <= 6; s++) { const x = Math.round(a + (c2 - a) * s / 6), y = Math.round(b + (d - b) * s / 6); g.p(x, y, c); g.p(x + 1, y, 3); } } };
const wallp = g => { g.fill(2); g.each((x, y) => ((x + 2) % 6 === 0 && (y + 1) % 5 === 0) || ((x + 5) % 6 === 0 && (y + 3) % 5 === 0) ? 1 : null); g.r(0, 0, 16, 2, 3); g.r(0, 13, 16, 3, 3); };
const wood = g => g.each((x, y) => y % 8 === 7 ? 2 : ((x + (y >> 3) * 7) % 16 === 0 ? 2 : 1));
tile('wood', T(wood));
tile('wallp', T(wallp), { solid: 1, look: ['Wallpaper. I picked it. It\'s called "Regret, but Tasteful."', 'The walls are thin in here. Some of them. I can feel which ones.'] });
tile('thin', T(g => { wallp(g); crack(g); }), { solid: 1, thin: 1, look: 'A cracked wall. Hold B and float into it. That\'s phasing. It costs ECTO.' });
tile('rug', T(g => { g.fill(2); g.o(1, 1, 14, 14, 1); g.e(8, 8, 3, 3, 1); g.p(8, 8, 3); }));
tile('candle', [0, 1].map(k => T(g => { wood(g); g.r(5, 9, 6, 6, 3); g.r(7, 4, 2, 6, 0); g.r(7, 2 - k, 2, 2, 1); g.p(8, 1 - k + 1, 0); })), { solid: 1, spd: 9, look: ['A candle. It\'s been lit since I died. That\'s not a metaphor. Somebody keeps lighting it.', 'Mood lighting. The mood is: me.'] });
tile('piano', T(g => { g.fill(3); g.r(1, 1, 14, 9, 2); for (let x = 1; x < 15; x += 2) g.r(x, 11, 1, 4, 0); g.r(1, 10, 14, 1, 3); }), { solid: 1, look: ['My piano. I wrote a song for every one of my wives. Same song. Different names.', 'I could play something. It\'s not the time. It\'s always almost the time.'] });
tile('curtain', T(g => g.each((x, y) => (x % 4 === 0) ? 3 : (x % 4 === 1 ? 1 : 2))), { solid: 1, look: 'The curtain. I\'ve been behind it my whole life. Waiting for the cue.' });
tile('sigil', [0, 1, 2].map(k => T(g => { g.fill(3); g.e(8, 8, 6 + (k === 1 ? .5 : 0), 6, 2); g.e(8, 8, 5, 5, 3); g.r(7, 3, 2, 10, k === 2 ? 0 : 1); g.r(3, 7, 10, 2, k === 2 ? 0 : 1); g.p(8, 8, 0); })), { solid: 1, spd: 20 });
tile('opened', T(g => { g.fill(3); g.e(8, 8, 6, 6, 2); g.e(8, 8, 5, 5, 3); }));
tile('exitG', [0, 1].map(k => T(g => { g.fill(3); g.r(2, 1, 12, 15, 2); g.r(3, 2, 10, 13, 1); g.rows(['..3..', '.303.', '30003', '.303.', '..3..'].map(r => r.replace(/0/g, k ? '0' : '1')), 6, 5); })), { solid: 1, spd: 30 });
tile('btable', T(g => { mfloor(g); g.e(8, 8, 7, 6, 3); g.e(8, 8, 6, 5, 0); g.r(5, 6, 2, 2, 1); g.r(9, 8, 2, 2, 1); }), { solid: 1, look: ['The reception tables. Every place card has a different name. Every name is a wife.', 'The centerpieces are dead flowers. On purpose. It\'s a theme.'] });
tile('cake', T(g => { mfloor(g); g.e(8, 11, 7, 4, 3); g.e(8, 11, 6, 3, 0); g.r(4, 5, 8, 6, 3); g.r(5, 6, 6, 4, 0); g.r(6, 2, 4, 4, 3); g.r(7, 3, 2, 2, 0); }), { solid: 1, look: 'The cake. Five tiers. One for each wedding. The top tier is still frozen.' });
tile('fthin', T(g => { g.fill(1); g.r(0, 0, 16, 2, 0); g.r(0, 12, 16, 4, 3); g.r(0, 11, 16, 1, 2); crack(g, 0); }), { solid: 1, thin: 1 });
tile('ithin', T(g => { g.fill(2); g.r(0, 0, 16, 4, 3); g.r(0, 15, 16, 1, 3); crack(g, 1); }), { solid: 1, thin: 1 });
tile('nthin', [0, 1].map(k => T(g => { g.fill(3); g.r(0, 3 + k, 16, 1, 1); g.r(0, 8 + k, 16, 1, 0); crack(g, 1); })), { solid: 1, thin: 1, spd: 14 });
tile('fchair', T(g => { lfloor(g); g.r(2, 1, 12, 14, 3); g.r(3, 2, 10, 7, 2); g.r(4, 10, 8, 4, 2); g.r(1, 8, 2, 6, 3); g.r(13, 8, 2, 6, 3); }), { solid: 1 });
tile('intercom', [0, 1].map(k => T(g => { g.fill(2); g.r(0, 0, 16, 4, 3); g.r(3, 4, 10, 11, 3); g.r(4, 5, 8, 5, 1); g.e(8, 12, 2, 2, k ? 0 : 1); g.r(7, 7, 2, 1, 3); })), { solid: 1, spd: 24 });

// ---------- MUSIC ----------
Object.assign(TRACKS, {
  gtitle: { bpm: 96, ch: [
    { w: 'p25', vol: .42, n: 'D5 - - A4 - - F4 - - A4 - - D5 - - E5 - F5 - E5 - D5 - - C#5 - - - - - A4 - - - - - D5 - - A4 - - F4 - - D4 - - G4 - - A#4 - - A4 - - G4 - - F4 - - - - - - - - - - -' },
    { w: 'p12', vol: .15, n: '. . . F4 . . . . . A4 . . . . . F4 . . . . . A4 . . . . . E4 . . . . . A4 . . . . . F4 . . . . . A4 . . . . . G4 . . . . . A#4 . . . . . F4 . . . . . A4 . .' },
    { type: 'triangle', vol: .75, n: 'D2 - - - - - A2 - - - - - A#1 - - - - - A2 - - - - - A1 - - - - - E2 - - - - - D2 - - - - - A2 - - - - - G2 - - - - - A#1 - - - - - A1 - - - - - - - - - - -' },
  ] },
  gshow: { bpm: 150, ch: [
    { w: 'p50', vol: .35, n: 'C5 - E5 - G5 - A5 - G5 - E5 - C5 - - - D5 - F5 - A5 - B5 - A5 - F5 - D5 - - - E5 - G5 - C6 - B5 - A5 - G5 - F5 - E5 - D5 - - - G4 - - - C5 - - - - - - -' },
    { type: 'triangle', vol: .8, n: 'C3 - G2 - C3 - G2 - C3 - G2 - C3 - E3 - D3 - A2 - D3 - A2 - D3 - A2 - D3 - F3 - C3 - G2 - C3 - G2 - F2 - C3 - F2 - A2 - G2 - D3 - G2 - B2 - C3 - G2 - C3 - - -' },
    { drum: 1, vol: .6, n: 'k . h . s . h h k . h . s . h .' },
  ] },
  ghouse: { bpm: 76, ch: [
    { w: 'p25', vol: .35, n: 'A4 - - - - - - - G#4 - - - - - - - F4 - - - - - - - E4 - - - - - - - . . . . . . . . C5 - - - B4 - - - A4 - - - - - - - - - - - - - - -' },
    { w: 'p12', vol: .12, n: 'E5 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' },
    { type: 'triangle', vol: .75, n: 'A1 - - - - - - - - - - - - - - - F1 - - - - - - - - - - - - - - - D2 - - - - - - - - - - - - - - - E1 - - - - - - - - - - - - - - -' },
    { drum: 1, vol: .5, n: 'k . . . . . . . . . . . . . . . . . . . . . . . k . . . . . . .' },
  ] },
  grecep: { bpm: 100, ch: [
    { w: 'p25', vol: .38, n: 'E5 - - - - - D5 - - C5 - - B4 - - - - - A4 - - - - - C5 - - - - - B4 - - A4 - - G#4 - - - - - - - - - - -' },
    { type: 'triangle', vol: .75, n: 'A2 - - E3 - - E3 - - . . . E2 - - B2 - - B2 - - . . . A2 - - E3 - - E3 - - . . . E2 - - G#2 - - B2 - - . . .' },
  ] },
  gend: { bpm: 80, ch: [
    { w: 'p25', vol: .4, n: 'C5 - - - E5 - - - G5 - - - E5 - D5 - C5 - - - - - - - A4 - C5 - D5 - E5 - D5 - - - C5 - - - - - - - - - - -' },
    { w: 'p12', vol: .14, n: 'C4 E4 G4 E4 C4 E4 G4 E4 C4 E4 G4 E4 A3 C4 E4 C4 A3 C4 E4 C4 A3 C4 E4 C4 F3 A3 C4 A3 F3 A3 C4 A3 G3 B3 D4 B3 G3 B3 D4 B3 C4 E4 G4 E4 C4 E4 G4 E4' },
    { type: 'triangle', vol: .7, n: 'C3 - - - - - - - G2 - - - - - - - A2 - - - - - - - F2 - - - - - - - G2 - - - - - - - C3 - - - - - - -' },
  ] },
});

// ---------- STATE ----------
const gState = () => ({ map: 'house', x: 2, y: 8, dir: 'up', flags: {}, items: [], time: 0, haze: 0, steps: 0, ep: 1, applause: 0, total: 0, honesty: 0, ecto: 100, cards: [] });
function gsave() { S.map = M.id; S.x = P.x; S.y = P.y; S.dir = P.dir; store('ghost_sav', S); }
let GMETA = fetchStore('ghost_meta') || { boots: 0, endings: 0 };
const saveGMeta = () => store('ghost_meta', GMETA);
const lindaBeaten = () => ((fetchStore('linda_meta') || {}).endings || 0) > 0;

// phasing: hold B into a cracked wall
P.phase = (x, y) => {
  const T0 = tdef(x, y);
  if (!T0 || !T0.thin || !held.b) return false;
  if (M.ents.some(e => e.solid && visible(e) && covers(e, x, y))) return false;
  if (S.ecto < 25) { if (!P.bumpT) { banner('NOT ENOUGH ECTO', 50); P.bumpT = 30; } return false; }
  S.ecto -= 25; sfx('phase'); return true;
};

// every Ghost stage: ECTO regen, palette, HUD, cue-card pickup
function gmap(d) {
  const t0 = d.tick, st0 = d.step;
  d.tick = () => { S.ecto = Math.min(100, S.ecto + .18); fx.pal = d.pal || 'red'; if (t0) t0(); };
  d.draw = () => {
    if (d.hud === false) return;
    rect(0, 0, W, 9, 3); text('CLAP ' + S.applause + '/' + d.quota, 2, 1, S.applause >= d.quota ? 0 : 1);
    text('ECTO', 90, 1, 1); rect(116, 2, 42, 5, 2); rect(117, 3, Math.round(40 * S.ecto / 100), 3, S.ecto >= 25 ? 0 : 1);
  };
  d.step = (x, y) => { const c = M.ents.find(e => e.card !== undefined && visible(e) && e.x === x && e.y === y); if (c) return () => giveCard(c.card); return st0 && st0(x, y); };
  d.caught = d.caught || served;
  return d;
}

// ---------- HAUNTING ----------
function wander(e) {
  if (e.wait > 0) { e.wait--; return; }
  e.wait = 40 + rnd(90);
  if (Math.random() < .5) { e.dir = pick(['up', 'down', 'left', 'right']); return; }
  const [dx, dy] = DIRS[e.dir], nx = e.x + dx, ny = e.y + dy;
  if (Math.abs(nx - e.home[0]) + Math.abs(ny - e.home[1]) > 3 || blocked(nx, ny, e)) return;
  e.x = nx; e.y = ny; e.mv = 1;
}
const mark = (id, x, y, who, lines, o = {}) => Object.assign({ id, x, y, spr: 'tourist', who, lines, dir: pick(['up', 'down', 'left', 'right']), home: [x, y],
  if: () => !F('scared_' + S.ep + '_' + id), update: wander, talk: hauntMark }, o);
async function hauntMark(e) {
  const rel = e.dir === P.dir ? 'back' : e.dir === OPP[P.dir] ? 'front' : 'side';
  if (F('meh_' + S.ep + '_' + e.id)) return say(pick(['Still a guy in a sheet.', '...', 'I SAW YOU THE FIRST TIME.']), e.who);
  if (rel === 'front') {
    setF('meh_' + S.ep + '_' + e.id); sfx('bump');
    await say(pick(['Oh. A guy in a sheet.', 'Is this part of the tour?', 'Cool costume, man.', 'Are you with the venue?']), e.who);
    await say(pick(['No, look— I wasn\'t ready. You looked too early.', 'I can\'t start from here. You saw the setup.', 'This is a real sheet. I\'m a real ghost. Why is that not enough.']), G);
    if (!F('tutFront')) { setF('tutFront'); await say('Haunt people from BEHIND for a perfect scare. From the side is half a scare. From the front... is just a guy in a sheet.'); }
    return;
  }
  const pts = rel === 'back' ? 3 : 1;
  sfx('scream'); fx.shake = 2; e.emote = '!'; e.emoteT = 40; await wait(24); fx.shake = 0;
  S.applause += pts; S.total += pts;
  await say((rel === 'back' ? 'A PERFECT HAUNT! +' : 'A DECENT HAUNT. +') + pts + ' APPLAUSE.');
  if (e.lines) await say(pick(e.lines), e.who);
  setF('scared_' + S.ep + '_' + e.id); e.gone = 1;
  if (S.applause >= M.def.quota && !F('quota_' + S.ep)) { setF('quota_' + S.ep); sfx('get'); await say('THE CROWD HAS SEEN ENOUGH. THE STAGE DOOR IS OPEN.'); }
}
const collector = (id, x, y, path, o = {}) => Object.assign({ id, x, y, spr: 'collector', path, vision: 3, pause: 30, update: patrol, turns: 1,
  talk: async () => { await say(pick(['SPOOKY ALIMONY. SIGN HERE.', 'I HAVE PAPERS FROM SEVERAL REALITIES.', 'THE PAYMENTS ARE RETROACTIVE. TO BEFORE YOU DIED.']), 'COLLECTOR'); await served(ent(id)); } }, o);
async function served(e) {
  sfx('alert'); if (e) await emote(e, '!', 30);
  sfx('caught');
  await say(pick(['SPOOKY ALIMONY. YOU\'VE BEEN SERVED.', 'SIR. THESE ARE FOR YOU. ALL OF THEM.', 'WE HAVE PAPERWORK FROM SEVERAL REALITIES.']), 'COLLECTOR');
  await say(pick(['I\'m not hiding. I\'m unavailable in this reality.', 'Not me. Wrong ghost. There\'s a lot of us. There\'s one of us.', 'Can we do this after the show?']), G);
  const loss = Math.min(S.applause, 1); S.applause -= loss;
  if (loss) await say('-1 APPLAUSE. THE AUDIENCE SAW THAT.');
  await fadeOut(3); const [sx, sy] = M.def.start; loadMap(M.id, sx, sy, 'up'); await fadeIn(3);
}
const cardEnt = (n, x, y) => ({ id: 'card' + n, x, y, spr: 'card', card: n, solid: false, floor: 1, bob: 1, if: () => !S.cards.includes(n) });
const CARDS = ['GOOD EVENING. PAUSE FOR APPLAUSE. KEEP PAUSING.', 'OUR GUEST TONIGHT IS... (HE IS NOT HERE.)', 'DO NOT MENTION ALIMONY.',
  'REMIND THEM YOU ARE THE SOUL OF THE SHOW.', 'SAY SOMETHING NICE ABOUT FACE. (DO NOT IMPROVISE.)', 'THIS IS WHERE THE MUSIC STOPS.',
  'LOOK INTO CAMERA TWO. THERE IS NO CAMERA TWO.', 'READ THE FAN MAIL. (DO NOT READ THE FAN MAIL.)', 'THANK THE SPONSORS. ALL OF THEM. EVEN THE PILLS.',
  'THIS CARD IS BLANK ON PURPOSE. STAND THERE.', 'DO THE TRICK. THE TRICK WORKS. THE TIMING IS WHAT\'S HUMILIATING.', 'MENTION THE ROAD. EVERYONE LOVES THE ROAD.',
  'IF LINDA IS WATCHING: SMILE. IF LINDA IS WATCHING: DON\'T.', 'THANK CARL. (OPTIONAL.) (NOT OPTIONAL.)', 'I KNEW YOU WERE WAITING.'];
async function giveCard(n) {
  if (S.cards.includes(n)) return;
  S.cards.push(n); sfx('get'); await wait(8);
  await say('FOUND CUE CARD ' + (n + 1) + '! (' + S.cards.length + '/15)');
  await say('"' + CARDS[n] + '"');
  await say(pick(['I\'m just following the cards.', 'Who writes these. I write these. Why do I write these.', 'Okay. Noted. Filed. Ignored.', 'That one\'s good. Keep that one.']), G);
}

// ---------- SIGIL (memory puzzle) ----------
async function sigil(len) {
  const DIRN = ['up', 'down', 'left', 'right'], GLY = { up: '^', down: 'v', left: '<', right: '>' }, PITCH = { up: 880, down: 440, left: 587, right: 659 };
  const seq = Array.from({ length: len }, () => pick(DIRN));
  let show = -1, got = 0, state = 'show', flash = 0;
  const prev = scene;
  scene = { update() {}, draw() {
    prev.draw(); box(20, 26, 120, 70); ctext(state === 'show' ? 'WATCH THE SIGIL' : 'DRAW IT BACK', 32);
    for (let a = 0; a < 48; a++) px(80 + Math.cos(a / 48 * 6.28) * 22, 62 + Math.sin(a / 48 * 6.28) * 16, 2);
    if (state === 'show' && show >= 0) bigtext(GLY[seq[show]], 75, 55, 3, 2);
    if (state === 'input') { if (flash > 0) { flash--; bigtext(GLY[seq[got - 1]], 75, 55, 3, 2); } text(seq.slice(0, got).map(d => GLY[d]).join(' '), 28, 84, 3); }
  } };
  await wait(30);
  for (let i = 0; i < len; i++) { show = i; tone(PITCH[seq[i]], .25, { w: 'p25', vol: .5 }); await wait(28); show = -1; await wait(8); }
  state = 'input'; DBG.mode = 'sigil'; DBG.sg = { seq, got: () => got };
  const done = r => { DBG.mode = null; scene = prev; return r; };
  while (got < len) {
    await nextFrame();
    if (pressed.b) return done(false);
    for (const d of DIRN) if (pressed[d]) {
      if (d === seq[got]) { got++; flash = 14; tone(PITCH[d], .15, { w: 'p25', vol: .5 }); }
      else { sfx('bump'); await wait(20); return done(false); }
    }
  }
  await wait(20); sfx('get'); return done(true);
}
async function sigilDoor(x, y, key, len) {
  if (F(key)) return;
  await say('A SIGIL. It works like math, but older. The formula is ' + len + ' strokes long.');
  if (!F('tutSigil')) { setF('tutSigil'); await say('Watch the strokes, then draw them back with the arrows. B gives up.'); }
  if (await sigil(len)) { setF(key); setTile(x, y, 'opened'); sfx('door'); await say(pick(['And THAT is not a trick. That\'s a formula. Write it down. Credit me.', 'Real magic. Nobody clapped. Nobody was watching. Typical.']), G); }
  else await say(pick(['The trick works. The timing is what\'s humiliating.', 'I can read it. Give me a second. Stop touching the circle.']), G);
}

// ---------- THE ENTRANCE (descend into the spotlight) ----------
async function descend() {
  let t = 0, gx = 64, gy = -34, sx = 80, go = false, landed = false;
  const prev = scene, pm = curName; music('gshow');
  scene = {
    update() { t++; sx = 80 + Math.sin(t / 32) * 52; if (!go || landed) return; if (held.left) gx -= 1.4; if (held.right) gx += 1.4; gx = clamp(gx, 0, W - 32); gy += .5; if (gy >= 74) landed = true; },
    draw() {
      cls(3);
      for (let x = 0; x < W; x += 8) { rect(x, 0, 4, 24, 2); rect(x + 4, 0, 4, 24, 1); }
      rect(0, 24, W, 2, 2); rect(0, 106, W, 38, 2); rect(0, 106, W, 1, 1);
      for (let y = 26; y < 106; y++) { const w = (y - 26) / 80 * 12 + 3; for (let x = sx - w; x < sx + w; x++) if (((x | 0) + y) % 2 === 0) px(x, y, 1); }
      rect(sx - 15, 104, 30, 4, 0);
      bigblit(SPR.ghostBig[(t >> 4) & 1], gx, gy, 1);
      rect(0, 0, W, 9, 3); text('THE ENTRANCE', 2, 1, 0);
    },
  };
  await say('THE ENTRANCE! Float down into the spotlight. LEFT and RIGHT to steer.');
  go = true; DBG.mode = 'descend'; DBG.ds = () => ({ gx, sx });
  while (!landed) await nextFrame();
  DBG.mode = null;
  const dist = Math.abs(gx + 16 - sx), pts = dist < 7 ? 5 : dist < 18 ? 3 : 0;
  sfx(pts ? 'get' : 'bump');
  await say('ENTRANCE: ' + (pts === 5 ? 'PERFECT' : pts === 3 ? 'GOOD' : 'MISSED THE LIGHT') + '. +' + pts + ' APPLAUSE.');
  S.applause += pts; S.total += pts;
  await say(pts === 5 ? pick(['Thank you. Thank you. Hold it. Hold the applause. No, keep it.', 'That. THAT is how you arrive.'])
    : pts === 3 ? pick(['Close. The light moved. Lights shouldn\'t move.', 'Good. Good is a word. It\'s not my word, but it\'s a word.'])
    : pick(['No, look up. You missed the whole descent. I can\'t start from here.', 'The spotlight was over there. I was over here. That\'s the show now.']), G);
  scene = prev; music(pm);
  return pts;
}

// ---------- MENU ----------
const GHINT = {
  1: 'Haunt the tour group from BEHIND. Cracked walls: hold B and float through. When the CLAP number is full, the star door opens.',
  2: 'Scare the wedding guests. The side rooms have sigils. The wives are by the cake. So is the door.',
  3: 'Scare the technicians. The chair is at the top. Do not let the red thing touch me. It is not me. It is not.',
  4: 'Scare the shoppers. The intercom booth is at the top of the mall. The cameras are Linda\'s.',
  5: 'Scare the dancers. The time door is in the room in the middle. The only way in is a crack in the top.',
};
async function startMenu() {
  sfx('tick');
  for (;;) {
    const i = await choose(['CUE CARDS', 'NARRATE', 'STATUS', 'SAVE', 'CLOSE'], { x: W - 72, y: 10, cancel: 1 });
    if (i === 0) {
      if (!S.cards.length) { await say('No cards. I\'m improvising. This is what improvising looks like. It looks great.', G); continue; }
      const list = S.cards.slice().sort((a, b) => a - b);
      const j = await choose(list.map(n => 'CARD ' + (n + 1)), { x: 6, y: 10, cancel: 1 });
      if (j >= 0) await say('"' + CARDS[list[j]] + '"');
      continue;
    }
    if (i === 1) { await say(pick(['Picture it. A ghost. Alone. With a goal. Here is the goal:', 'Let me narrate. It helps. It helps me.', 'In a darkness deeper than— okay, fine, the practical version:']), G); return say(GHINT[S.ep] || 'Go home. Wherever that is.', G); }
    if (i === 2) { await gstatus(); continue; }
    if (i === 3) { gsave(); sfx('ok'); return say('SAVED. THE SHOW WILL RESUME AFTER THESE MESSAGES.'); }
    return;
  }
}
async function gstatus() {
  const prev = scene, t = Math.floor(S.time / 60);
  scene = { draw() {
    cls(0); box(0, 0, W, H);
    text('SPOOKY GHOST', 8, 7); text('EP ' + S.ep + '/5', 116, 7, 2);
    text('APPLAUSE ' + S.applause + ' / ' + (M && M.def.quota || 0), 8, 22);
    text('CAREER APPLAUSE ' + S.total, 8, 34);
    text('CUE CARDS ' + S.cards.length + '/15', 8, 46);
    text('ECTO ' + Math.round(S.ecto) + '%', 8, 58);
    text('TIME ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'), 8, 70);
    text('SOUL OF THE SHOW: YES', 8, 86, 2); text('ACCOUNTABILITY: ???', 8, 98, 2);
    text('HUMAN NAME: [[[[[', 8, 110, 2);
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}

// ---------- BOOT / TITLE / FILES ----------
async function boot() {
  fx.pal = 'offRed'; fx.fade = 0;
  scene = { draw() { cls(0); } };
  fit(); requestAnimationFrame(loop);
  while (!anyKey) await nextFrame();
  await wait(20);
  fx.pal = 'red'; GMETA.boots++; saveGMeta();
  let y = -16, gy = -40;
  scene = { draw() { cls(0); bigtext('PRETEND CO', 21, y, 3, 2); if (y >= 60) text('(R)', 136, y + 1); bigblit(SPR.ghostBig[(frame >> 4) & 1], 64, gy, 1); } };
  while (y < 60) { y++; await wait(2); }
  await wait(12); sfx('ding'); await wait(40);
  // his entrance. over the logo.
  while (gy < 50) { gy += 1.5; await nextFrame(); }
  await wait(90);
  if ((carlBeaten() || lindaBeaten()) && Math.random() < .4) { fx.pal = carlBeaten() ? 'dmg' : 'pink'; await wait(3); fx.pal = 'red'; }
  while (gy > -40) { gy -= 3; await nextFrame(); }
  await wait(20);
  await fadeOut(4); gtitle(); await fadeIn(4);
}
function gtitle() {
  music('gtitle'); mus.rate = 1; mus.det = 0; mus.wob = 0; fx.pal = 'red';
  let t = 0, flash = 0;
  const after = GMETA.endings > 0;
  scene = {
    update() { t++; if (!busy && t > 30 && (pressed.start || pressed.a)) { sfx('ok'); run(gfiles); } if ((carlBeaten() || lindaBeaten()) && rnd(1500) === 0) flash = 3; },
    draw() {
      cls(3);
      for (let i = 0; i < 30; i++) px((hash(i, 1) * W + t * .2 * hash(i, 4)) % W, hash(i, 2) * 90, 1);
      for (let x = 0; x < W; x += 8) { rect(x, 118, 4, 26, 2); rect(x + 4, 118, 4, 26, 1); }
      text('PRETEND CO. PRESENTS', 20, 4, 2);
      bigtext('SPOOKY', 6, 16, 1, 3); bigtext('GHOST', 6, 40, 0, 3);
      ctext(after ? 'STILL LIVE FROM BEYOND' : 'LIVE FROM BEYOND', 66, 0);
      if (flash > 0) { flash--; fx.pal = carlBeaten() ? 'dmg' : 'pink'; } else fx.pal = 'red';
      bigblit(SPR.ghostBig[(t >> 4) & 1], 122, 18 + (Math.sin(t * .05) * 3 | 0), 1);
      if ((t >> 5) & 1) ctext(after ? 'THE MUSIC NEVER STOPS' : 'PUSH START', 84, 1);
      ctext('(C)2000 PRETEND CO.', 106, 2);
    },
  };
}
async function gfiles() {
  const sv = fetchStore('ghost_sav');
  const prev = scene.draw;
  const both = carlBeaten() && lindaBeaten();
  scene = { draw() {
    prev(); box(8, 20, 144, 60);
    text('FILE 1  ' + (sv ? 'GHOST  EP ' + sv.ep : '-EMPTY-'), 16, 28); if (sv) text('CLAP ' + sv.total, 64, 38, 2);
    text('FILE 2  ' + (both ? 'FACE' : '????'), 16, 52); text(both ? 'CORRUPTED' : 'TIME 999:59', 64, 62, 2);
  } };
  const opts = sv ? ['CONTINUE', 'NEW SHOW', 'FILE 2'] : ['NEW SHOW', 'FILE 2'];
  const i = await choose(opts, { x: 40, y: 86, cancel: 1 });
  if (i < 0) return gtitle();
  const o = opts[i];
  if (o === 'FILE 2') {
    sfx('glitch'); fx.pal = 'dmg'; await wait(4); fx.pal = 'red';
    await say(both ? 'THIS FILE WAS SUPPOSED TO BE FACE. SOMEONE ELSE IS SITTING IN IT.' : 'THIS SLOT IS RESERVED FOR THE GUEST. THE GUEST HAS NOT ARRIVED.');
    return gtitle();
  }
  if (o === 'NEW SHOW' && sv) {
    await say('CANCEL THE SHOW?', null, { keep: 1 });
    const c = await choose(['NO', 'YES']); dlg = null;
    if (c !== 1) return gtitle();
  }
  await fadeOut(4);
  if (o === 'CONTINUE') { S = sv; return playEpisode(S.ep); }
  S = gState(); gnewGame();
}
