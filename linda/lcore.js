'use strict';
// ================= CEO LINDA — core: palette, art, music, state, menus, boot/title =================
PALS.pink = [[255, 232, 242], [238, 148, 190], [150, 48, 112], [38, 8, 34]];
PALS.offPink = Array(4).fill([170, 128, 146]);
fx.pal = 'pink';
const LI = 'LINDA', LL = 'LINDA LITE', C = 'CARL';
HERO = LI;
VOICE = { _: [650, 60], LINDA: [520, 15], 'LINDA LITE': [1500, 120], CARL: [980, 180], FACE: [450, 40], 'SPOOKY GHOST': [1300, 400],
  '???': [180, 40], 'THE CORE': [140, 10], AUDITOR: [300, 5], 'PRETZEL GUY': [760, 60], ATTENDANT: [600, 60], CLERK: [760, 60], SCIENTIST: [900, 30] };
for (const k in TILES) delete TILES[k].look; // Carl's commentary lives in the other cartridge

// ---------- shared helpers (same studio, same habits) ----------
const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toUpperCase();
const nth = (k, arr) => { const n = F(k) || 0; setF(k, n + 1); return arr[Math.min(n, arr.length - 1)]; };
function bigtext(s, x, y, c, sc) {
  for (const ch of s) { const g = FONT[ch.toUpperCase()]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) rect(x + i * sc, y + j * sc, sc, sc, c); x += 6 * sc; }
}
function bigblit(s, x, y, sc, map) {
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const c = s.d[j * s.w + i]; if (c !== 255) rect(x + i * sc, y + j * sc, sc, sc, map ? map[c] : c); }
}
async function get(it, quiet) { if (!has(it)) S.items.push(it); sfx('get'); await wait(10); if (!quiet) await say('LINDA ACQUIRED ' + it + '.'); }
const lose = it => { S.items = S.items.filter(i => i !== it); };

// ---------- LINDA ----------
const ceoD = ['....33333333....', '...3111111113...', '..311111111113..', '.31111111111113.', '.31100000000113.', '.31033000033013.', '.31023000032013.', '.31000000000013.', '.31100022000113.', '..311000000113..', '...3333333333...', '..331313131333..', '.30313131313103.', '..331313131333..', '...3333333333...', '....333..333....'];
const ceoU = rowsSwap(ceoD, { 4: '.31111111111113.', 5: '.31111111111113.', 6: '.31111333311113.', 7: '.31111111111113.', 8: '.31111111111113.', 9: '..311111111113..', 12: '.33313131313133.' });
const ceoS = ['....33333333....', '...3111111113...', '..311111111113..', '.3111111111113..', '3111111000003...', '3111110033003...', '3111110023003...', '.311110000003...', '.311110002203...', '..3111000003....', '....33333333....', '....31313133....', '....31313103....', '....31313133....', '....33333333....', '.....33..33.....'];
// the old chibi build is now LINDA LITE (the product: 20% of her)
SPR.lite = { down: legs(ceoD, '...333....333...', '....333..333....'), up: legs(ceoU, '...333....333...', '....333..333....'), side: legs(ceoS, '....33...33.....', '.....3333.......') };
// CEO LINDA: 16x24, adult proportions. bun + waves, high collar, striped blouse, puffed shoulders, cape
const lindaD = ['......3333......', '.....311113.....', '...3311111133...','..311111111113..', '..311111111113..', '..311000000113..', '..311330033113..', '..311030030113..',
  '..311000000113..', '..311002200113..', '.31113000031113.', '.31133333333113.', '.33333232323333.', '1333332323233331', '1333332323233331', '1333332323233331',
  '1333311111133331', '1103333333333011', '11..33333333..11', '111.33333333.111', '111..333333..111', '1111..3..3..1111', '1111..3..3..1111', '111..33..33..111'];
const lindaU = ['......3333......', '.....311113.....', '...3311111133...','..311111111113..', '..311111111113..', '..311111111113..', '..311113311113..', '..311111111113..',
  '..311111111113..', '..311111111113..', '.31111111111113.', '.31111111111113.', '.33311111111333.', '3333111111113333', '3331111111111333', '3331111111111333',
  '3311111111111133', '0311111111111130', '.31111111111113.', '.31111111111113.', '.31111111111113.', '..311111111113..', '...3333333333...', '....33....33....'];
const lindaS = ['......33333.....', '.....3111113....', '....311111113...', '...31111111113..', '..311111111113..', '.3111111100003..', '.3111111330003..', '.3111111030003..',
  '31111111000003..', '3111111110223...', '311111113003....', '3111113333......', '31111333323.....', '3111333332333...', '3113333332333...', '3113333332333...',
  '3113311113333...', '3113333333033...', '311.33333333....', '311.33333333....', '31..3333333.....', '3...33...33.....', '....33...33.....', '....33...33.....'];
P.spr = 'ceo'; // the shared engine defaults the player to Carl
const legs24 =(rows, a, b) => [R(rows), R(rowsSwap(rows, { 22: a[0], 23: a[1] })), R(rowsSwap(rows, { 22: b[0], 23: b[1] }))];
SPR.ceo = {
  down: legs24(lindaD, ['1111.3....3.1111', '111.33....33.111'], ['1111...33...1111', '111...3333...111']),
  up: legs24(lindaU, ['...3333333333...', '...33......33...'], ['...3333333333...', '.....33..33.....']),
  side: legs24(lindaS, ['...33.....33....', '...33.....33....'], ['.....3333.......', '.....3333.......']),
};
SPR.page = mk(16, 16, g => { g.r(4, 3, 9, 11, 3); g.r(5, 4, 7, 9, 0); for (let y = 6; y < 12; y += 2) g.r(6, y, 5, 1, 2); g.p(11, 4, 3); });
SPR.bigtv = [0, 1].map(k => mk(32, 32, g => {
  g.r(0, 2, 32, 26, 3); g.r(2, 4, 28, 20, 1); g.r(9, 10, 4, 4, 3); g.r(19, 10, 4, 4, 3);
  if (k) g.e(16, 19, 4, 2, 3); else g.r(11, 18, 10, 2, 3);
  g.r(6, 28, 4, 4, 3); g.r(22, 28, 4, 4, 3); g.r(28, 25, 2, 2, 0);
}));
SPR.cameraBot = [0, 1].map(k => mk(16, 16, g => { g.r(2, 3, 10, 7, 3); g.r(12, 4, 3, 5, 3); g.r(4, 5, 4, 3, 2); g.p(3, 4, k ? 0 : 3); g.r(7, 10, 2, 5, 3); g.r(4, 14, 8, 1, 3); }));

// ---------- TILES ----------
const carpet = g => g.each((x, y) => ((x + y) % 8 === 0 || (x - y + 16) % 8 === 0) ? 2 : 1);
tile('carpet', T(carpet));
tile('owall', T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(0, 10, 16, 1, 3); g.r(0, 11, 16, 5, 2); g.r(0, 15, 16, 1, 3); }), { solid: 1 });
tile('owin', [0, 1].map(k => T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(1, 2, 14, 9, 3); g.each((x, y) => x > 1 && x < 15 && y > 2 && y < 10 && hash(x, y, 60 + k) < .06 ? 0 : null); g.r(3, 7, 3, 3, 2); g.r(7, 5, 3, 5, 2); g.r(11, 6, 2, 4, 2); g.r(0, 11, 16, 5, 2); })), { solid: 1, spd: 50 });
tile('portrait', T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(2, 1, 12, 10, 3); g.r(3, 2, 10, 8, 2); g.e(8, 5, 4, 3.5, 1); g.e(8, 6, 2.5, 2.5, 0); g.r(6, 8, 4, 2, 3); g.r(0, 11, 16, 5, 2); }), { solid: 1 });
tile('oboard', T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(1, 2, 14, 8, 3); g.r(2, 3, 12, 6, 0); g.r(3, 4, 8, 1, 2); g.r(3, 6, 6, 1, 2); g.r(3, 8, 9, 1, 2); g.r(0, 11, 16, 5, 2); }), { solid: 1 });
tile('omon', [0, 1, 2].map(k => T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(2, 2, 12, 8, 3); g.r(3, 3, 10, 6, k === 2 ? 3 : 2); if (k === 1) { g.r(5, 5, 2, 2, 1); g.r(9, 5, 2, 2, 1); } g.r(0, 11, 16, 5, 2); })), { solid: 1, spd: 45 });
tile('osafe', T(g => { g.fill(2); g.r(2, 2, 12, 12, 3); g.r(3, 3, 10, 10, 1); g.e(8, 8, 3, 3, 3); g.r(8, 6, 1, 3, 0); }), { solid: 1 });
tile('odeskL', T(g => { carpet(g); g.r(0, 3, 16, 10, 3); g.r(1, 4, 15, 8, 2); g.r(3, 5, 6, 4, 0); g.r(4, 6, 4, 1, 1); g.r(11, 5, 3, 3, 1); }), { solid: 1 });
tile('odeskR', T(g => { carpet(g); g.r(0, 3, 16, 10, 3); g.r(0, 4, 15, 8, 2); g.r(3, 5, 5, 5, 3); g.r(4, 6, 3, 3, 0); g.r(10, 6, 3, 2, 1); }), { solid: 1 });
tile('coffee', [0, 1].map(k => T(g => { carpet(g); g.r(3, 1, 10, 13, 3); g.r(4, 2, 8, 4, 2); g.r(5, 3, 2, 1, k ? 0 : 1); g.r(6, 8, 4, 4, 0); g.r(7, 7, 2, 1, 2); })), { solid: 1, spd: 30 });
const storefront = icon => T(g => { g.fill(3); g.r(0, 0, 16, 4, 1); for (let x = 0; x < 16; x += 4) g.r(x, 0, 2, 4, 2); g.r(1, 5, 14, 10, 0); icon(g); });
tile('lease', T(g => { g.fill(3); g.r(0, 0, 16, 4, 2); g.r(1, 5, 14, 10, 1); g.r(3, 7, 10, 5, 0); g.r(4, 8, 8, 1, 3); g.r(4, 10, 5, 1, 3); }), { solid: 1 });
tile('st_pretzel', storefront(g => { g.e(6, 10, 3, 3, 2); g.e(10, 10, 3, 3, 2); g.e(6, 10, 1.5, 1.5, 0); g.e(10, 10, 1.5, 1.5, 0); }), { solid: 1 });
tile('st_pills', storefront(g => { g.e(8, 10, 5, 2.6, 3); g.e(8, 10, 4, 1.7, 1); g.r(8, 9, 4, 2, 2); }), { solid: 1 });
tile('st_bong', storefront(g => { g.r(7, 6, 3, 6, 2); g.e(8.5, 12, 3, 2.5, 2); }), { solid: 1 });
tile('st_arcade', storefront(g => { g.r(4, 6, 8, 8, 3); g.r(5, 7, 6, 4, 1); g.p(6, 8, 0); g.p(9, 9, 0); }), { solid: 1 });
tile('st_comp', [0, 1].map(k => storefront(g => { g.rows(['.33.33.', '3113113', '3111113', '.31113.', '..313..', '...3...'], 5, 7); if (k) g.r(7, 9, 2, 1, 0); })), { solid: 1, spd: 25 });
tile('st_photo', storefront(g => { g.r(4, 8, 8, 6, 3); g.e(8, 11, 2, 2, 1); g.r(5, 7, 3, 1, 3); }), { solid: 1 });
tile('stage', T(g => g.each((x, y) => y % 4 === 0 ? 3 : 2)));
tile('spot', [0, 1].map(k => T(g => { g.each((x, y) => y % 4 === 0 ? 3 : 2); g.e(8, 8, 7, 6, k ? 0 : 1); })), { spd: 20 });
tile('tcam', T(g => { g.each((x, y) => y % 4 === 0 ? 3 : 2); g.r(2, 2, 9, 6, 3); g.r(11, 3, 3, 4, 3); g.r(4, 4, 4, 2, 1); g.r(6, 8, 2, 7, 3); g.r(3, 14, 8, 1, 3); }), { solid: 1 });
tile('seat', T(g => { g.fill(1); g.r(1, 2, 14, 12, 3); g.r(2, 3, 12, 5, 2); g.r(2, 9, 12, 4, 2); }), { solid: 1 });
tile('neon', [0, 1, 2].map(k => T(g => { g.fill(3); g.r(0, 3 + k, 16, 1, 1); g.r(0, 8 + k, 16, 1, 0); g.r(0, 12, 16, 1, 1); g.r(0, 15, 16, 1, 2); })), { solid: 1, spd: 14 });
tile('disco', [0, 1, 2].map(k => T(g => g.each((x, y) => ((((x >> 2) + (y >> 2) + k) % 3) === 0 ? 0 : (((x >> 2) + (y >> 2)) & 1) ? 1 : 2)))), { spd: 22 });
tile('boombox', [0, 1].map(k => T(g => { g.fill(1); g.r(1, 4, 14, 9, 3); g.e(4.5, 9, 2.5 + k * .5, 2.5 + k * .5, 2); g.e(11.5, 9, 2.5 + k * .5, 2.5 + k * .5, 2); g.r(6, 5, 4, 2, 0); g.r(3, 2, 10, 2, 3); })), { solid: 1, spd: 8 });

// ---------- MUSIC ----------
Object.assign(TRACKS, {
  ltitle: { bpm: 112, ch: [
    { w: 'p25', vol: .42, n: 'E5 - - - B4 - E5 - G5 - F#5 - E5 - D5 - E5 - - - - - - - B4 - D5 - E5 - G5 - A5 - - - G5 - F#5 - D5 - - - E5 - - - B4 - G4 - A4 - B4 - - - - - - - - -' },
    { w: 'p12', vol: .16, n: 'E4 G4 B4 G4 E4 G4 B4 G4 C4 E4 G4 E4 C4 E4 G4 E4 D4 F#4 A4 F#4 D4 F#4 A4 F#4 B3 D#4 F#4 D#4 B3 D#4 F#4 D#4' },
    { type: 'triangle', vol: .75, n: 'E2 E2 E3 E2 E2 E2 E3 E2 C2 C2 C3 C2 C2 C2 C3 C2 D2 D2 D3 D2 D2 D2 D3 D2 B1 B1 B2 B1 B1 B1 B2 B1' },
    { drum: 1, vol: .6, n: 'k . h . s . h . k . h k s . h h' },
  ] },
  office: { bpm: 90, ch: [
    { w: 'p12', vol: .17, n: 'D4 F4 A4 C5 . . . . G4 B4 D5 F5 . . . . C4 E4 G4 B4 . . . . A3 C#4 E4 G4 . . . .' },
    { w: 'p25', vol: .3, n: '. . . . A4 - C5 - . . . . B4 - - - . . . . G4 - E4 - . . . . A4 - - -' },
    { type: 'triangle', vol: .7, n: 'D2 - - A2 - - D3 - G2 - - D2 - - G2 - C2 - - G2 - - C3 - A2 - - E2 - - A2 -' },
    { drum: 1, vol: .45, n: 'k . h . s . h . k k h . s . h .' },
  ] },
  entrance: { bpm: 120, ch: [
    { w: 'p50', vol: .4, n: 'C5 - - - C5 - G5 - - - F5 - E5 - D5 - C5 - - - C5 - A5 - - - G5 - F5 - E5 - F5 - - - F5 - A5 - C6 - - - B5 - A5 - G5 - - - - - E5 - C5 - D5 - - - G4 -' },
    { type: 'triangle', vol: .8, n: 'C3 - C3 - C3 - C3 - C3 - C3 - C3 - C3 - A2 - A2 - A2 - A2 - A2 - A2 - A2 - A2 - F2 - F2 - F2 - F2 - F2 - F2 - F2 - F2 - G2 - G2 - G2 - G2 - G2 - G2 - G2 - G2 -' },
    { w: 'p12', vol: .15, n: 'E4 G4 C5 G4 E4 G4 C5 G4 E4 G4 C5 G4 E4 G4 C5 G4 E4 A4 C5 A4 E4 A4 C5 A4 E4 A4 C5 A4 E4 A4 C5 A4 F4 A4 C5 A4 F4 A4 C5 A4 F4 A4 C5 A4 F4 A4 C5 A4 D4 G4 B4 G4 D4 G4 B4 G4 D4 G4 B4 G4 D4 G4 B4 G4' },
    { drum: 1, vol: .7, n: 'k . . . s . . . k . k . s . . h' },
  ] },
  nego: { bpm: 132, ch: [
    { w: 'p25', vol: .38, n: 'D5 - F5 - A5 - - - G5 - F5 - E5 - C5 - D5 - - - A4 - - - C5 - D5 - E5 - F5 - - - E5 - D5 - C5 - - - A4 - C5 - D5 - - - - - - - - - - - - - - - - -' },
    { type: 'triangle', vol: .8, n: 'D2 D2 D3 D2 D2 D2 D3 D2 A#1 A#1 A#2 A#1 A#1 A#1 A#2 A#1 C2 C2 C3 C2 C2 C2 C3 C2 A1 A1 A2 A1 A1 A1 A2 A1' },
    { drum: 1, vol: .7, n: 'k . h h s . h . k . k h s . h h' },
  ] },
  eighties: { bpm: 118, ch: [
    { w: 'p50', vol: .3, n: 'A4 - C5 - E5 - C5 - A4 - G4 - A4 - - - F4 - A4 - C5 - A4 - F4 - E4 - F4 - - - G4 - B4 - D5 - B4 - G4 - F#4 - G4 - - - E4 - G#4 - B4 - E5 - - - - - - - - -' },
    { type: 'triangle', vol: .75, n: 'A2 A3 A2 A3 A2 A3 A2 A3 F2 F3 F2 F3 F2 F3 F2 F3 G2 G3 G2 G3 G2 G3 G2 G3 E2 E3 E2 E3 E2 E3 E2 E3' },
    { drum: 1, vol: .65, n: 'k . h . s . h . k . h . s . h h' },
  ] },
  lend: { bpm: 70, ch: [
    { w: 'p25', vol: .38, n: 'B4 - - - A4 - - - G4 - - - F#4 - - - E4 - - - F#4 - G4 - A4 - - - - - - - G4 - - - F#4 - - - E4 - - - D4 - - - E4 - - - - - - - - - - - - - - -' },
    { type: 'triangle', vol: .7, n: 'E2 - - - - - - - C2 - - - - - - - D2 - - - - - - - B1 - - - - - - - C2 - - - - - - - A1 - - - - - - - B1 - - - - - - - E2 - - - - - - -' },
  ] },
});

// ---------- STATE / SAVE ----------
const lState = () => ({ map: 'office', x: 4, y: 4, dir: 'up', flags: {}, items: ['ESPRESSO'], time: 0, haze: 0, steps: 0, funds: 500, rec: 0, day: 1, units: { u1: 'pills', u2: 'bong' } });
function lsave() { S.map = M.id; S.x = P.x; S.y = P.y; S.dir = P.dir; store('linda_sav', S); }
let LMETA = fetchStore('linda_meta') || { boots: 0, endings: 0 };
const saveLMeta = () => store('linda_meta', LMETA);
const carlBeaten = () => ((fetchStore('carl_meta') || {}).endings || 0) > 0;
async function money(n, why) { S.funds += n; sfx(n >= 0 ? 'ok' : 'tick'); banner((n >= 0 ? '+$' : '-$') + Math.abs(n) + (why ? ' ' + why : ''), 70); }
async function fame(n) { S.rec = Math.max(0, S.rec + n); if (n) banner((n > 0 ? '+' : '') + n + ' RECOGNITION', 70); }
const espresso = () => F('espresso') === undefined ? 1 : F('espresso');

// ---------- MENU ----------
async function startMenu() {
  sfx('tick');
  for (;;) {
    const i = await choose(['DIRECTIVES', 'PORTFOLIO', 'CAMERAS', 'POLL CHAT', 'DIARY', 'STATUS', 'SAVE', 'CLOSE'], { x: W - 80, y: 2, cancel: 1 });
    if (i === 0) { await showDirectives(); continue; }
    if (i === 1) { await portfolio(); continue; }
    if (i === 2) return cameras();
    if (i === 3) return pollChat();
    if (i === 4) { await diaryMenu(); continue; }
    if (i === 5) { await lstatus(); continue; }
    if (i === 6) { lsave(); sfx('ok'); return say(F('act') >= 5 ? 'SAVED. THE NETWORK HAS A COPY.' : 'PROGRESS SAVED. LINDA DOES NOT LOSE PROGRESS.'); }
    return;
  }
}
async function cameras() {
  if (M.def.noCams) return say('No cameras here. I never put cameras here. That was a choice.', LI);
  sfx('static'); S.haze = 900;
  await say(pick(['Cameras.', 'Show me.', 'Every angle.', 'I built this building. It looks where I tell it to.']), LI);
}
async function lstatus() {
  const prev = scene, t = Math.floor(S.time / 60);
  const goals = openGoals();
  scene = { draw() {
    cls(0); box(0, 0, W, H);
    text('CEO LINDA', 8, 7); text('DAY ' + S.day, 110, 7, 2);
    text('LV ' + llvl(), 8, 20); text('AUTHORITY ' + lmax(), 50, 20);
    text('FUNDS $' + S.funds, 8, 31); text('RECOG. ' + S.rec, 92, 31);
    text('STORES ' + Object.keys(S.units).length + '/6', 8, 42); text('PAGES ' + pages().length + '/8', 86, 42);
    text('TIME ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'), 8, 53);
    text('AUDIT TARGET $' + AUDIT_TARGET, 8, 64, 2);
    rect(6, 76, W - 12, 1, 2); text('OPEN DIRECTIVES', 8, 81);
    (goals.length ? goals.slice(0, 5) : ['NONE. END THE DAY AT YOUR DESK.']).forEach((g, i) => text(('- ' + g).slice(0, 25), 8, 92 + i * 10, 3));
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}
async function pollChat() {
  await say(pick(['Audience. I have a question. You may answer it.', 'Chat. Report.', 'You are watching. Make yourselves useful.']), LI);
  const hint = HINTS_L[S.day] || ['end the day at your desk'];
  const msgs = [{ u: pick(LCHAT), m: pick(LJUNK) }, { u: pick(LCHAT), m: pick(hint) }, { u: pick(LCHAT), m: pick(LJUNK) }];
  if (S.day >= 4) msgs.push({ u: 'you', m: pick(['its ' + clock() + ' here', 'is carl okay', 'we saw the other cartridge', 'the green is coming back']) });
  const tpm = fetchStore('tp_mem');
  if (tpm && tpm.msgs && tpm.msgs.length && Math.random() < .35) msgs.push({ u: 'you', m: pick(tpm.msgs).toLowerCase() });
  await chat(msgs);
  await say(pick(['Acceptable.', 'Half of that was useful. I will pay you in exposure.', 'Stop typing about my hair. Thank you.', 'That is the correct answer. I was testing you.']), LI);
}
const LCHAT = ['shareholder_1', 'mallrat99', 'linda_stan', 'fascism_inc_hr', 'propPillsFan', 'carl_defender', 'pretzel_union', 'lurker'];
const LJUNK = ['QUEEN', 'LINDA W', 'she would fire me instantly', 'is this the carl game??', 'same studio as carl!!', 'the pink is so good', 'i had this one too',
  'ceo mode', 'she is so mean lol', 'free carl', 'where is the ghost', 'buy my mixtape linda', 'yes maam', 'the entrance music slaps'];
const HINTS_L = {
  1: ['make an entrance at the studio (left door)', 'lease a store, the FOR LEASE ones', 'carl is in the parking lot (bottom exit)'],
  2: ['face is in the studio. get your ad on', 'r&d is the right door', 'the bong shop has a problem'],
  3: ['the auditor is in your office', 'ghost sighting at the fountain. use CAMERAS', 'the pretzel guy is striking'],
  4: ['escalator to the 80s dept', 'the trap got triggered!!', 'go down linda'],
  5: ['the office monitor', 'the box. go into the box', 'save the mall'],
};

// ---------- DIARY (8 pages of the woman before the company) ----------
const DIARY = [
  ['THE MAGICIAN', 'He does card tricks at the bar and tells everyone he\'s going on the road. Everyone laughs. I laugh. I think he means it.'],
  ['THE ROAD', 'He talks about the road like it\'s a person. I want a house. I want a kitchen with a window. I want kids running through it. I told him. He did a trick instead.'],
  ['THE PLANTS', 'He had a whole plan for growing weed. Lights, timers, everything. He talked about it for a year. I bought the lights. They\'re growing.'],
  ['THE NAME', 'He used to joke that if he ever started a company he\'d call it Fascism Inc. so nobody could say they weren\'t warned. I filed the paperwork today. Nobody laughed.'],
  ['THE LEAVING', 'He left. He was very good at it. Good entrance, good exit. I waited. Then I had things to do.'],
  ['THE COMPANIONS', 'He said someday people would have AI girlfriends. He said it like a joke. I\'m building one. I\'m using my own voice. It\'s the only voice I trust to show up.'],
  ['THE FACE ON THE BILLBOARD', 'They put my face on a billboard. Then on a lunchbox. People wear me now. It\'s not the same as being chosen. It\'s close. It\'s closer than waiting.'],
  ['THE KITCHEN', 'I drove past a house with a kitchen window today. A family inside. I didn\'t stop. I had a meeting. The company is doing very well. [[[[['],
];
const pages = () => F('pages') || [];
async function givePage(i) {
  if (pages().includes(i)) return;
  setF('pages', pages().concat(i)); sfx('get'); await wait(10);
  await say('LINDA FOUND A DIARY PAGE: "' + DIARY[i][0] + '" (' + pages().length + '/8)');
  if (pages().length === 1) { await say('That is my handwriting. From before.', LI); await say('Diary pages can be read from the START menu.'); }
}
async function diaryMenu() {
  if (!pages().length) return say('The diary is locked in the safe. The pages are not. They get out. I don\'t know how.', LI);
  const list = pages().slice().sort((a, b) => a - b);
  const i = await choose(list.map(n => DIARY[n][0].slice(0, 17)), { x: 4, y: 4, cancel: 1 });
  if (i < 0) return;
  sfx('tick'); await say(DIARY[list[i]][1]);
  await say(pick(['...', 'Moving on.', 'I remember writing that. I remember the pen.', 'That was somebody else. She had my handwriting.']), LI);
}

// ---------- ENTRANCE (rhythm) ----------
// notes are lead-melody onsets from TRACKS.entrance (16th-note grid), played twice
async function entrance(where = 'THE STUDIO') {
  const lead = TRACKS.entrance.ch[0].n.trim().split(/\s+/), on = [];
  lead.forEach((k, i) => { if (k !== '-' && k !== '.') on.push([i, nf(k)]); });
  const notes = [], HIT = 20, TRAVEL = 90, STEP = 7.5, START = 100;
  const DIRN = ['up', 'down', 'left', 'right'], GLY = { up: '^', down: 'v', left: '<', right: '>' };
  for (let rep = 0; rep < 2; rep++) on.forEach(([i, f], n) => {
    const prev = on[n - 1] ? on[n - 1][1] : f;
    const d = f > prev * 1.2 ? 'up' : f < prev / 1.2 ? 'down' : n % 2 ? 'right' : 'left';
    notes.push({ t: START + (rep * 64 + i) * STEP, d, res: null });
  });
  let t = 0, score = 0, combo = 0, msg = '', msgT = 0, go = false;
  const prev = scene, pm = curName; music(null);
  scene = {
    update() {
      if (!go) return;
      t++;
      if (t === START - 6) music('entrance');
      for (const d of DIRN) if (pressed[d]) {
        const n = notes.find(n => !n.res && n.d === d && Math.abs(n.t - t) <= 8);
        if (n) { const good = Math.abs(n.t - t) <= 3; n.res = good ? 2 : 1; score += n.res; combo++; msg = good ? 'PERFECT' : 'GOOD'; msgT = 20; }
        else { combo = 0; msg = 'OFF BEAT'; msgT = 20; sfx('bump'); }
      }
      for (const n of notes) if (!n.res && t - n.t > 8) { n.res = -1; combo = 0; msg = 'MISS'; msgT = 20; }
    },
    draw() {
      cls(0);
      for (let i = 0; i < 5; i++) { const x = 20 + i * 30 + Math.sin(t / 30 + i) * 8; for (let y = 60; y < 128; y++) if ((y + i) % 3 === 0) px(x + (y - 60) * (i - 2) * .15, y, 1); }
      rect(0, 118, W, 26, 2); rect(0, 118, W, 1, 3);
      bigblit(SPR.ceo.down[(t >> 4) % 3 === 1 ? 1 : 0], 64, 70 + (Math.sin(t / 8) > .9 ? -2 : 0), 2);
      DIRN.forEach((d, r) => { const y = 6 + r * 12; rect(0, y + 4, W, 1, 1); rect(HIT - 5, y - 2, 12, 11, 3); rect(HIT - 4, y - 1, 10, 9, 0); text(GLY[d], HIT - 2, y, 2); });
      for (const n of notes) {
        if (n.res) continue;
        const x = HIT + (n.t - t) * (140 / TRAVEL); if (x > W || x < -8) continue;
        const r = DIRN.indexOf(n.d); rect(x - 4, 4 + r * 12, 11, 11, 3); text(GLY[n.d], x - 2, 6 + r * 12, 0);
      }
      if (msgT > 0) { msgT--; ctext(msg, 54, 3); }
      if (combo > 4) ctext(combo + ' COMBO', 108, 0);
    },
  };
  await say('ENTRANCE at ' + where + '! Press the arrow when it reaches the box. On the beat.');
  go = true; DBG.mode = 'rhythm'; DBG.rh = { notes, t: () => t };
  const end = notes[notes.length - 1].t + 40;
  while (t < end) await nextFrame();
  DBG.mode = null;
  await wait(30);
  const acc = score / (notes.length * 2);
  scene = prev; music(pm);
  const grade = acc > .9 ? 'S' : acc > .75 ? 'A' : acc > .55 ? 'B' : acc > .35 ? 'C' : 'D';
  await say('ENTRANCE GRADE: ' + grade + ' (' + Math.round(acc * 100) + '%)');
  if (acc > (F('bestEntrance') || 0)) setF('bestEntrance', acc);
  return acc;
}

// ---------- BOOT / TITLE / FILES ----------
async function boot() {
  fx.pal = 'offPink'; fx.fade = 0;
  scene = { draw() { cls(0); } };
  fit(); requestAnimationFrame(loop);
  while (!anyKey) await nextFrame();
  await wait(20);
  fx.pal = 'pink'; LMETA.boots++; saveLMeta();
  const bad = carlBeaten() && Math.random() < .3;
  let y = -16;
  scene = { draw() { cls(0); bigtext('PRETEND CO', 21, y, 3, 2); if (y >= 60) text('(R)', 136, y + 1); } };
  while (y < 60) { y++; await wait(2); }
  await wait(12); sfx('ding');
  if (bad) { await wait(40); fx.pal = 'dmg'; await wait(3); fx.pal = 'pink'; }
  await wait(90);
  await fadeOut(4); ltitle(); await fadeIn(4);
}
function ltitle() {
  music('ltitle'); mus.rate = 1; mus.det = 0; mus.wob = 0; fx.pal = 'pink';
  let t = 0, flash = 0;
  const after = LMETA.endings > 0;
  scene = {
    update() { t++; if (!busy && t > 30 && (pressed.start || pressed.a)) { sfx('ok'); run(lfiles); } if (carlBeaten() && rnd(1600) === 0) flash = 3; },
    draw() {
      cls(0);
      for (let i = 0; i < 6; i++) rect(0, 100 + i * 7, W, 3, i & 1 ? 1 : 0);
      for (let x = 0; x < W; x += 8) rect(x, 96 - ((x * 7 + t) % 20 < 3 ? 2 : 0), 6, 4, 2);
      text('FASCISM INC. PRESENTS', 17, 4, 2);
      bigtext('CEO', 10, 18, 2, 3); bigtext('LINDA', 8, 42, 3, 3);
      ctext('THE MALL OF THE FUTURE', 72, 3);
      if (flash > 0) { flash--; fx.pal = 'dmg'; bigblit(SPR.carlback, 104, 76, 1); } else fx.pal = 'pink';
      bigblit(after ? SPR.ceo.up[0] : SPR.ceo.down[0], 118, 20 + (Math.sin(t * .04) * 2 | 0), 2);
      if ((t >> 5) & 1) ctext(after ? 'SHE REMEMBERS YOU' : 'PUSH START', 118, 3);
      ctext('(C)1999 PRETEND CO.', 132, 2);
    },
  };
}
async function lfiles() {
  const sv = fetchStore('linda_sav');
  const prev = scene.draw;
  scene = { draw() {
    prev(); box(8, 20, 144, 60);
    text('FILE 1  ' + (sv ? 'LINDA  DAY ' + sv.day : '-EMPTY-'), 16, 28); if (sv) text('FUNDS $' + sv.funds, 64, 38, 2);
    text('FILE 2  ' + (carlBeaten() ? 'CARL' : '????'), 16, 52); text(carlBeaten() ? 'NOT THIS CART.' : 'TIME 999:59', 64, 62, 2);
  } };
  const opts = sv ? ['CONTINUE', 'NEW GAME', 'FILE 2'] : ['NEW GAME', 'FILE 2'];
  const i = await choose(opts, { x: 40, y: 86, cancel: 1 });
  if (i < 0) return ltitle();
  const o = opts[i];
  if (o === 'FILE 2') {
    sfx('glitch'); fx.pal = 'dmg'; await wait(4); fx.pal = 'pink';
    await say(carlBeaten() ? 'THIS FILE BELONGS TO ANOTHER CARTRIDGE. HE IS STILL LOOKING FOR THEM.' : 'THIS IS NOT YOUR FILE. THIS IS NOT YOUR MALL.');
    return ltitle();
  }
  if (o === 'NEW GAME' && sv) {
    await say('LIQUIDATE LINDA\'S COMPANY?', null, { keep: 1 });
    const c = await choose(['NO', 'YES']); dlg = null;
    if (c !== 1) return ltitle();
  }
  await fadeOut(4);
  if (o === 'CONTINUE') { S = sv; scene = worldScene; loadMap(S.map, S.x, S.y, S.dir); await fadeIn(4); return; }
  lnewGame();
}
