'use strict';
// ================= PEE KID³ — art: 16-color sprites, portraits, legacy (gen-1) relics =================
// kid palettes (shared by sprites and portraits), from the reference art:
//  PEE KID: dark bowl cut, big dark eyes, white sailor shirt, blue collar, brown neckerchief, satchel + envelope
//  PEE-WEE KID: short dark hair, big ears, gray eyes, cream suit, red bow tie
//  PEE BOY: black sailor cap, messy black hair, sharp eyes, black striped sailor collar, red kerchief, black tie
// 1 outline 2 skin 3 skin-shade 4 hair 5 hair-hi 6 main 7 main-shade 8 collar/bright 9 collar-shade/stripe 10 tie 11 tie-shade 12 iris 13 accent 14 bg 15 bg2
const KIDPAL = {
  kid: pal('#1a1218', '#f6d6c0', '#d8a890', '#2a1c1a', '#5c443c', '#f2f2f2', '#b8c0cc', '#7090c0', '#48608c', '#a06a3c', '#6c4424', '#3a2418', '#e8c060', '#243048', '#2c3a58'),
  wee: pal('#181418', '#f4dccc', '#d0aa98', '#242424', '#494949', '#ffffdc', '#dcdcb6', '#ffffff', '#d0d4dc', '#e02828', '#9c1414', '#7c8894', '#8c3c3c', '#3a2030', '#4a2a3c'),
  boy: pal('#101014', '#f8e2d0', '#d4b09c', '#121218', '#3a3a48', '#f4f4f8', '#aab4c4', '#1a1a22', '#e8e8f0', '#d82020', '#8c1010', '#262020', '#a0a0a8', '#182028', '#202a34'),
};
function kidSprite(asp, pose, f) {
  const boy = asp === 'boy', kid = asp === 'kid', wee = asp === 'wee';
  return outline(spr(24, (boy ? 38 : 32) + 2, g => {
    const run = pose === 'run', y0 = run && (f & 1) ? 1 : 0;
    const legL = run ? [-3, 1, 3, 1][f & 3] : 0, legR = run ? [3, 1, -3, 1][f & 3] : 0;
    const hr = boy ? 5.5 : 6.5, hy = y0 + (boy ? 10 : 8), bodyY = y0 + (boy ? 15 : 14), hipY = y0 + (boy ? 27 : 23), legLen = boy ? 9 : 7;
    const [leg, legS, shorts, shoe] = { kid: [2, 3, 9, 11], wee: [6, 7, 6, 4], boy: [8, 8, 8, 4] }[asp];
    // legs
    if (pose === 'jump') { g.r(8, hipY, 3, legLen - 2, leg); g.r(13, hipY - 1, 3, legLen - 3, legS); g.r(7, hipY + legLen - 2, 5, 2, shoe); g.r(13, hipY + legLen - 4, 5, 2, shoe); }
    else {
      g.r(8 + (legL > 0 ? 1 : 0), hipY, 3, legLen, leg); g.r(13 - (legR > 0 ? 1 : 0), hipY, 3, legLen, legS);
      g.r(6 + legL, hipY + legLen, 6, 2, shoe); g.r(12 + legR, hipY + legLen, 6, 2, shoe);
    }
    if (kid) { g.r(7, hipY - 1, 10, 3, shorts); g.r(14, hipY - 1, 3, 3, 1); }
    // torso
    const tb = hipY - bodyY + (kid ? 0 : 1);
    g.r(6, bodyY, 12, tb, 6); g.r(15, bodyY, 3, tb, 7);
    if (kid) { // sailor collar, neckerchief, satchel strap + envelope
      g.r(5, bodyY, 14, 2, 8); g.r(5, bodyY + 1, 14, 1, 9); g.p(9, bodyY + 2, 8); g.p(14, bodyY + 2, 8); g.p(10, bodyY + 3, 9); g.p(13, bodyY + 3, 9);
      g.r(11, bodyY + 1, 2, 5, 10); g.p(10, bodyY + 5, 10); g.p(13, bodyY + 5, 11); g.p(12, bodyY + 5, 11);
      g.line(17, bodyY + 1, 8, hipY - 3, 11); g.r(4, hipY - 4, 5, 4, 13); g.r(4, hipY - 4, 5, 1, 11);
    }
    if (wee) { // cream suit, white shirt V, red bow tie
      g.r(10, bodyY, 4, 5, 8); g.p(11, bodyY + 5, 8); g.p(12, bodyY + 5, 8); g.line(9, bodyY, 11, bodyY + 6, 7); g.line(14, bodyY, 12, bodyY + 6, 7);
      g.r(8, bodyY, 3, 2, 10); g.r(13, bodyY, 3, 2, 10); g.r(11, bodyY, 2, 2, 11); g.p(12, bodyY + 7, 7); g.p(12, bodyY + 9, 7);
    }
    if (boy) { // black sailor collar with a white stripe, red kerchief, black tie
      g.r(5, bodyY, 14, 3, 8); g.r(5, bodyY + 1, 14, 1, 9); g.r(10, bodyY, 4, 3, 10); g.r(11, bodyY + 3, 2, 1, 10);
      g.r(11, bodyY + 4, 2, 6, 8); g.p(11, bodyY + 10, 8); g.r(6, hipY - 1, 12, 1, 8);
    }
    // arms
    const arm = (x, y, len, sh) => {
      if (kid) { g.r(x, y, 3, 2, sh ? 7 : 6); g.r(x, y + 2, 3, 1, 8); g.r(x, y + 3, 3, len - 3, sh ? 3 : 2); }
      else { g.r(x, y, 3, len - 2, sh ? 7 : 6); g.r(x, y + len - 2, 3, 2, sh ? 3 : 2); }
    };
    if (pose === 'ask') { g.r(18, bodyY - 10, 3, 2, 2); g.r(18, bodyY - 8, 3, 8, kid ? 2 : 6); if (kid) g.r(18, bodyY - 2, 3, 3, 6); arm(4, bodyY + 1, 8, 0); }
    else if (pose === 'act') { const k = (f & 1) * 3; g.r(1, bodyY - 4 + k, 5, 3, 6); g.r(18, bodyY - 1 - k, 5, 3, 6); g.r(0, bodyY - 5 + k, 2, 2, 2); g.r(22, bodyY - 2 - k, 2, 2, 2); }
    else { const sw = run ? [2, 0, -2, 0][f & 3] : 0; arm(4, bodyY + 1 + sw, 9, 0); arm(17, bodyY + 1 - sw, 9, 1); }
    // head
    if (kid) { // bowl cut with jagged bangs
      g.e(12, hy - 1.5, hr + 1, hr, 4); g.e(12, hy + 1, hr - .5, hr - 1.5, 2); g.r(16, hy, 2, 4, 3);
      g.r(6, hy - 5, 12, 3, 4); for (const x of [7, 10, 12, 15]) g.p(x, hy - 2, 4); g.r(5, hy - 3, 2, 6, 4); g.r(17, hy - 3, 2, 5, 4);
      g.r(9, hy - 6, 4, 1, 5); g.p(14, hy - 5, 5);
      g.r(8, hy - 1, 2, 3, 12); g.r(14, hy - 1, 2, 3, 12); g.p(8, hy - 1, 6); g.p(14, hy - 1, 6); g.r(11, hy + 3, 2, 1, 3);
    }
    if (wee) { // short hair, high forehead, big ears
      g.e(12, hy - 2, hr, hr - 1, 4); g.e(12, hy + .5, hr - .5, hr - 1, 2); g.p(8, hy - 8, 4); g.p(11, hy - 8, 4); g.p(14, hy - 8, 4);
      g.r(6, hy - 5, 12, 1, 4); g.p(6, hy - 4, 4); g.p(17, hy - 4, 4); g.r(8, hy - 7, 5, 1, 5);
      g.e(5, hy + 1, 1.5, 2, 2); g.e(19, hy + 1, 1.5, 2, 3);
      g.r(8, hy - 2, 3, 1, 4); g.r(13, hy - 2, 3, 1, 4);
      g.r(8, hy, 2, 2, 12); g.r(14, hy, 2, 2, 12); g.p(9, hy + 1, 1); g.p(15, hy + 1, 1); g.r(11, hy + 3, 2, 1, 3);
    }
    if (boy) { // messy black hair under a black sailor cap
      g.e(12, hy - 1, hr + 1.5, hr, 4); for (const [x, y] of [[4, 2], [5, 3], [4, 4], [19, 2], [20, 3], [19, 4]]) g.p(x, hy + y, 4);
      g.e(12, hy + 1, hr - .5, hr - 1, 2); g.r(15, hy, 2, 4, 3);
      g.r(7, hy - 4, 10, 1, 4); for (const x of [8, 11, 15]) g.p(x, hy - 3, 4);
      g.r(4, hy - 5, 16, 1, 8); g.r(6, hy - 9, 12, 4, 8); g.r(7, hy - 10, 10, 1, 8); g.r(6, hy - 6, 12, 1, 9); g.p(12, hy - 8, 9);
      g.p(8, hy - 1, 4); g.p(9, hy - 1, 4); g.p(14, hy - 1, 4); g.p(15, hy - 1, 4);
      g.r(8, hy, 3, 1, 12); g.r(13, hy, 3, 1, 12); g.r(11, hy + 3, 2, 1, 10);
    }
  }), 1);
}
const KID = {};
for (const a of ['kid', 'wee', 'boy']) KID[a] = { stand: kidSprite(a, 'stand', 0), run: [0, 1, 2, 3].map(f => kidSprite(a, 'run', f)), jump: kidSprite(a, 'jump', 0), ask: kidSprite(a, 'ask', 0), act: [0, 1].map(f => kidSprite(a, 'act', f)) };

// adults: taller than the kid on purpose. 1 outline 2 skin 3 skin-shade 4 hair 5 coat 6 coat-shade 7 pants 8 shoes 9 accent 10 white 11 prop
const ADULTPAL = {
  tech: pal('#101018', '#f0c8a0', '#c89878', '#503020', '#f0f0f8', '#b8b8d0', '#303848', '#181820', '#40a0f0', '#ffffff', '#a07038'),
  teacher: pal('#101018', '#f0c8a0', '#c89878', '#a02818', '#e8a0c0', '#b87090', '#503858', '#181820', '#f8d820', '#ffffff', '#704020'),
  cop: pal('#101018', '#d8a078', '#b07858', '#181818', '#2838a0', '#182070', '#182070', '#101010', '#f8d000', '#ffffff', '#303030'),
  star: pal('#101018', '#a06840', '#784830', '#101010', '#f8f0d0', '#d0c090', '#f8f0d0', '#806020', '#f8c800', '#ffffff', '#101010'),
  monitor: pal('#101018', '#f0c8a0', '#c89878', '#707070', '#f89020', '#c06010', '#403020', '#181820', '#f8f800', '#ffffff', '#f8f8f8'),
};
function adultSprite(kind, f) {
  return outline(spr(24, 44, g => {
    const step = f & 1;
    g.r(8 + step, 30, 3, 11, 7); g.r(13 - step, 30, 3, 11, 7); g.r(7 + step * 2, 40, 6, 3, 8); g.r(12 - step * 2 + 1, 40, 6, 3, 8);
    g.r(5, 13, 14, 19, 5); g.r(15, 13, 4, 19, 6); g.r(10, 13, 4, 4, 10);
    if (kind === 'cop') { g.p(8, 17, 9); g.p(8, 18, 9); g.r(5, 26, 14, 2, 1); g.r(6, 3, 12, 3, 5); g.r(4, 6, 16, 1, 5); g.p(11, 4, 9); }
    if (kind === 'tech' || kind === 'monitor') { g.r(3, 18, 4, 9, 11); g.r(3, 18, 4, 1, 1); }
    if (kind === 'teacher') { g.r(9, 13, 6, 2, 9); }
    if (kind === 'monitor') { g.r(5, 20, 14, 3, 9); }
    g.r(3, 14, 3, 12, 5); g.r(18, 14, 3, 12, 6); g.r(3, 25, 3, 3, 2); g.r(18, 25, 3, 3, 3);
    g.e(12, 8, 5.5, 6.5, 2); g.r(15, 5, 2, 7, 3);
    if (kind === 'star') { g.r(7, 6, 10, 3, 1); g.r(8, 7, 3, 1, 9); g.r(13, 7, 3, 1, 9); g.r(9, 11, 6, 2, 10); }
    else { g.r(9, 7, 2, 2, 1); g.r(14, 7, 2, 2, 1); g.r(10, 11, 4, 1, 3); }
    if (kind !== 'cop') { g.e(12, 3, 6, 3, 4); g.r(6, 2, 3, 6, 4); if (kind === 'teacher') { g.r(5, 3, 3, 10, 4); g.r(16, 3, 3, 10, 4); } }
  }), 1);
}
const ADULT = {}; for (const k in ADULTPAL) ADULT[k] = [0, 1].map(f => adultSprite(k, f));

// ---------- legacy relics: gen-1 characters, still in 4 shades, can't be upgraded ----------
const LEGPAL = pal('#9bbc0f', '#8bac0f', '#306230', '#0f380f');
const LEG = s => spr(s[0].length, s.length, g => g.rows(s.map(r => r.replace(/[0-3]/g, c => String(+c + 1)))));
const LEGACY = {
  carl: LEG(['.....333333.....', '...3333333333...', '..333333333333..', '..322222222223..', '.31111111111113.', '.31333311333313.', '.31303311303313.', '.31333311333313.', '..311111111113..', '...3111331113...', '....33111133....', '....30033003....', '...3222332223...', '..312222222213..', '...3222222223...', '....333..333....']),
  ghost: LEG(['.....333333.....', '...3300000033...', '..300000000003..', '.30000000000003.', '.30033000033003.', '.30033000033003.', '.30000000000003.', '.30000033000003.', '.30000333300003.', '.30000033000003.', '.30000000000003.', '.30000000000003.', '.30000000000003.', '.30300030003003.', '.33.33333.333.3.', '................']),
  face: LEG(['..333333333333..', '.30000000000003.', '.30111111111103.', '.30133111133103.', '.30133111133103.', '.30111111111103.', '.30113333331103.', '.30111111111103.', '.30000000000003.', '..333333333333..', '.....33..33.....', '....3333333.....', '................', '................', '................', '................']),
  linda: LEG(['......3333......', '.....311113.....', '...3311111133...', '..311111111113..', '..311111111113..', '..311000000113..', '..311330033113..', '..311030030113..', '..311000000113..', '..311002200113..', '.31113000031113.', '.31133333333113.', '.33333232323333.', '1333332323233331', '1333311111133331', '1103333333333011']),
  tp: LEG(['....33333333....', '...3000000003...', '..30022222200 3.'.replace(' ', ''), '..300000000003..', '..301000000103..', '..300000000003..', '..301030030103..', '..300000000003..', '..301003300103..', '..300000000003..', '..301000000103..', '..300000000003..', '..333333333333..', '................', '................', '................']),
};
LEGACY.tp = LEG(['....33333333....', '...3000000003...', '..300222222003..', '..300000000003..', '..301000000103..', '..300000000003..', '..301030030103..', '..300000000003..', '..301003300103..', '..300000000003..', '..301000000103..', '..300000000003..', '..333333333333..', '................', '................', '................']);

// ---------- portraits (48x48) ----------
function portrait(f) { return spr(48, 48, f); }
function scaleSpr(s, k) { return spr(s.w * k, s.h * k, g => g.each((x, y) => s.d[((y / k) | 0) * s.w + ((x / k) | 0)])); }
function kidPortrait(asp, shock) {
  return portrait(g => {
    g.r(0, 0, 48, 48, 14); for (let y = 0; y < 48; y += 4) g.r(0, y, 48, 1, 15);
    const V = (y, a) => Math.max(0, (y - a) * .85); // half-width of the neckline V at row y
    if (asp === 'kid') {
      g.e(24, 52, 23, 14, 6); g.e(34, 52, 12, 14, 7);
      g.each((x, y) => { if (y < 38 || ![6, 7].includes(g.get(x, y))) return 0; const d = Math.abs(x - 23.5), v = V(y, 37); return d < v ? 6 : d < v + 7 ? (y > 45 || d > v + 5.5 ? 9 : 8) : 0; });
      g.r(22, 41, 4, 7, 10); g.r(24, 41, 2, 7, 11); g.r(20, 40, 8, 2, 10);
      g.line(33, 38, 22, 48, 11); g.line(34, 38, 23, 48, 11); g.r(28, 43, 12, 5, 13); g.r(28, 43, 12, 1, 11); g.p(33, 45, 11); g.p(34, 45, 11);
      g.r(20, 32, 8, 7, 2); g.r(20, 32, 3, 6, 3);
      g.e(24, 17, 15, 14, 4); g.r(9, 17, 5, 14, 4); g.r(34, 17, 5, 13, 4);
      g.e(24, 23, 12, 13, 2); g.e(31, 26, 5, 9, 2); g.r(34, 22, 2, 8, 3);
      g.e(24, 12, 14, 7, 4); for (let x = 12; x <= 36; x++) g.r(x, 12, 1, 5 + ((x * 7) % 5 > 2 ? 2 : 0) + (x % 6 === 0 ? 1 : 0), 4);
      g.line(17, 6, 23, 4, 5); g.line(26, 5, 31, 7, 5); g.p(15, 10, 5); g.p(28, 9, 5);
      for (const ex of [18, 30]) { g.e(ex, 23.5, 3.6, 3, 12); g.r(ex - 3, 20, 7, 1, 1); g.p(ex - 4, 21, 1); g.r(ex - 2, 21, 2, 2, 6); g.p(ex + 1, 25, 6); g.r(ex - 2, 27, 5, 1, 3); }
      g.p(24, 27, 3); g.p(25, 28, 3); g.r(22, 31, 5, 1, 10); g.r(23, 32, 3, 1, 3);
    }
    if (asp === 'wee') {
      g.e(24, 53, 23, 14, 6); g.e(34, 53, 12, 14, 7);
      g.each((x, y) => { if (y < 38 || ![6, 7].includes(g.get(x, y))) return 0; const d = Math.abs(x - 23.5), v = V(y, 37) * .8; return d < v ? 8 : d < v + 1 ? 7 : 0; });
      g.r(21, 36, 6, 4, 8);
      g.e(19, 40, 4, 3, 10); g.e(29, 40, 4, 3, 10); g.r(22, 39, 4, 3, 11); g.p(17, 39, 11); g.p(31, 41, 11);
      g.r(20, 31, 8, 6, 2); g.r(20, 31, 3, 5, 3);
      g.e(10, 24, 3.5, 5, 2); g.e(38, 24, 3.5, 5, 2); g.e(10.5, 24, 1.5, 3, 3); g.e(37.5, 24, 1.5, 3, 3);
      g.e(24, 22, 12, 14, 2); 
      g.each((x, y) => { const dx = (x - 24.5) / 14.5; if (Math.abs(dx) > 1) return 0; const top = 12 - 9.5 * Math.sqrt(1 - dx * dx) + (x % 4 === 1 ? -1 : 0), bot = 14 + 5 * dx * dx + (x % 3 === 0 ? 1 : 0); return y >= top && y <= bot ? 4 : 0; }); g.line(15, 7, 21, 4, 5); g.line(22, 4, 29, 4, 5); g.line(30, 5, 34, 8, 5); g.line(18, 8, 24, 6, 5);
      const eh = shock ? 4 : 3.2;
      for (const ex of [18, 30]) { g.e(ex, 23, 3.8, eh, 8); g.e(ex, 23, shock ? 1.6 : 2.4, shock ? 1.8 : 2.4, 12); g.p(ex, 23, 1); g.p(ex - 1, 22, 8); g.r(ex - 3, 23 - Math.ceil(eh), 7, 1, 1); g.r(ex - 3, shock ? 16 : 18, 7, 1, 4); }
      g.p(24, 27, 3); g.p(25, 28, 3);
      if (shock) { g.e(24, 32, 3, 3, 13); g.r(22, 30, 5, 1, 8); g.r(21, 29, 7, 1, 1); } else g.r(22, 31, 5, 1, 13);
    }
    if (asp === 'boy') {
      g.e(24, 53, 23, 14, 6); g.e(34, 53, 12, 14, 7);
      g.each((x, y) => { if (y < 37 || ![6, 7].includes(g.get(x, y))) return 0; const d = Math.abs(x - 23.5), v = V(y, 36); if (d < v) return 10; const k = d - v; return k < 7 ? (k > 2 && k < 3.5 || k > 4.5 && k < 5.8 ? 9 : 8) : 0; });
      g.r(23, 42, 3, 6, 8); g.r(21, 40, 7, 3, 10); g.r(22, 40, 2, 2, 11);
      g.r(20, 32, 8, 6, 2); g.r(20, 32, 3, 5, 3);
      g.e(24, 21, 15, 13, 4); for (const [x0, y0, x1, y1] of [[10, 20, 6, 30], [11, 22, 8, 33], [37, 20, 41, 29], [36, 23, 40, 32], [12, 26, 9, 34], [35, 26, 39, 34]]) { g.line(x0, y0, x1, y1, 4); g.line(x0 + 1, y0, x1 + 1, y1, 4); }
      g.e(24, 25, 11, 12, 2); g.e(31, 27, 5, 9, 2); g.r(33, 23, 2, 8, 3);
      g.r(12, 13, 25, 3, 4); for (const x of [14, 17, 20, 25, 29, 33]) g.line(x, 15, x - 1, 20, 4);
      g.r(6, 11, 36, 3, 8); g.e(24, 7, 15, 6, 8); g.r(9, 7, 30, 4, 8); g.r(8, 9, 32, 1, 9); g.r(12, 5, 2, 1, 9); g.r(35, 5, 2, 1, 9);
      g.r(23, 4, 2, 4, 9); g.r(21, 5, 6, 1, 9); g.r(22, 7, 4, 1, 9);
      g.line(14, 20, 21, 23, 4); g.line(14, 21, 21, 24, 4); g.line(34, 20, 27, 23, 4); g.line(34, 21, 27, 24, 4);
      for (const ex of [18, 30]) { g.r(ex - 3, 25, 6, 2, 12); g.r(ex - 3, 24, 6, 1, 1); g.p(ex, 25, 9); }
      g.p(24, 29, 3); g.p(24, 30, 3); g.r(22, 33, 4, 1, 10);
      for (let i = 0; i < 26; i++) g.p(4 + Math.round(Math.sin(i * .5) * 2 + i * .12), 28 - i, 13);
      for (let i = 0; i < 10; i++) g.p(38 + i, 30 + Math.round(Math.sin(i * .9)), 13);
    }
  });
}
function adultPortrait(kind) {
  return portrait(g => {
    g.r(0, 0, 48, 48, 6); for (let y = 0; y < 48; y += 4) g.r(0, y, 48, 1, 5);
    g.e(24, 46, 20, 10, 5); g.r(20, 36, 8, 8, 10);
    g.e(24, 24, 13, 16, 2); g.r(32, 16, 4, 18, 3);
    if (kind === 'star') { g.r(12, 19, 24, 7, 1); g.r(14, 20, 8, 4, 9); g.r(26, 20, 8, 4, 9); g.r(16, 31, 16, 5, 10); g.r(16, 31, 16, 1, 1); g.e(24, 10, 14, 6, 1); }
    else { g.r(16, 21, 5, 4, 10); g.r(27, 21, 5, 4, 10); g.r(18, 22, 2, 3, 1); g.r(29, 22, 2, 3, 1); g.r(20, 33, 8, 2, 3); }
    if (kind === 'cop') { g.r(8, 8, 32, 6, 5); g.r(12, 3, 24, 7, 5); g.r(22, 4, 4, 3, 9); }
    else if (kind === 'teacher') { g.e(24, 10, 16, 8, 4); g.r(8, 10, 6, 26, 4); g.r(34, 10, 6, 26, 4); }
    else if (kind !== 'star') g.e(24, 10, 14, 7, 4);
  });
}
// the professor (bow tie, beard, a lot to say), Kuma (big), Takahashi (spiky, shades), Miss Nose (clown head from a bag)
const XPAL = {
  prof: pal('#101018', '#e8b890', '#c09070', '#606060', '#384060', '#20283c', '#e8e8e8', '#b02020', '#f0f0f0', '#303030'),
  kuma: pal('#101018', '#c89060', '#a07048', '#402818', '#605040', '#403428', '#e8e8e8', '#d0a000', '#f0f0f0', '#202020'),
  taka: pal('#101018', '#f0c8a0', '#c89878', '#f0e0a0', '#c02838', '#801828', '#f0f0f0', '#101010', '#40c0f0', '#303030'),
  nose: pal('#101018', '#f8f0f0', '#d0c8d0', '#f86828', '#20a040', '#107028', '#f82020', '#f8f800', '#ffffff', '#303030'),
};
const PR = {
  prof: portrait(g => { g.r(0, 0, 48, 48, 5); g.e(24, 46, 20, 10, 5); g.r(20, 37, 8, 3, 6); g.r(17, 38, 14, 4, 7); g.r(23, 38, 2, 4, 1); g.e(24, 22, 13, 16, 2); g.r(32, 14, 4, 18, 3); g.e(24, 33, 11, 7, 4); g.r(19, 32, 10, 2, 2); g.r(15, 19, 7, 5, 8); g.r(26, 19, 7, 5, 8); g.r(17, 20, 2, 3, 1); g.r(28, 20, 2, 3, 1); g.r(14, 19, 20, 1, 1); g.e(24, 8, 14, 6, 4); }),
  kuma: portrait(g => { g.r(0, 0, 48, 48, 5); g.e(24, 48, 24, 12, 5); g.r(20, 38, 8, 6, 6); g.e(24, 24, 16, 17, 2); g.e(10, 9, 5, 5, 4); g.e(38, 9, 5, 5, 4); g.e(24, 10, 14, 6, 4); g.r(15, 21, 6, 4, 6); g.r(27, 21, 6, 4, 6); g.r(17, 22, 2, 3, 1); g.r(29, 22, 2, 3, 1); g.e(24, 31, 6, 4, 3); g.r(21, 30, 6, 2, 1); g.r(13, 19, 22, 1, 1); }),
  taka: portrait(g => { g.r(0, 0, 48, 48, 9); g.e(24, 46, 20, 10, 5); g.r(21, 37, 6, 6, 6); g.e(24, 25, 12, 15, 2); for (let i = 0; i < 6; i++) g.line(12 + i * 5, 12, 10 + i * 6, 0, 4), g.line(13 + i * 5, 12, 11 + i * 6, 0, 4); g.e(24, 12, 13, 6, 4); g.r(12, 21, 24, 5, 7); g.r(14, 22, 8, 2, 8); g.r(26, 22, 8, 2, 8); g.r(19, 32, 10, 2, 1); }),
  nose: portrait(g => { g.r(0, 0, 48, 48, 5); g.r(6, 34, 36, 14, 4); g.r(6, 34, 36, 2, 1); g.e(24, 22, 15, 16, 2); g.e(10, 10, 7, 7, 3); g.e(38, 10, 7, 7, 3); g.e(24, 7, 9, 6, 3); g.r(15, 16, 6, 7, 8); g.r(27, 16, 6, 7, 8); g.r(17, 18, 3, 4, 1); g.r(29, 18, 3, 4, 1); g.e(24, 27, 5, 5, 6); g.e(23, 25, 2, 2, 8); g.r(16, 33, 16, 3, 6); g.r(14, 32, 3, 2, 6); g.r(31, 32, 3, 2, 6); }),
};
function reg(name, s, P, voice) { PORT[name] = { s, P }; if (voice) VOICE[name] = voice; }
reg('PEE KID', kidPortrait('kid'), KIDPAL.kid, [980, 120]);
reg('PEE-WEE KID', kidPortrait('wee'), KIDPAL.wee, [1180, 200]);
const WEE_SHOCK = { s: kidPortrait('wee', 1), P: KIDPAL.wee };
reg('PEE BOY', kidPortrait('boy'), KIDPAL.boy, [760, 60]);
reg('THE MOVIE STAR', adultPortrait('star'), ADULTPAL.star, [420, 80]);
reg('TECHNICIAN', adultPortrait('tech'), ADULTPAL.tech, [520, 40]);
reg('OFFICER', adultPortrait('cop'), ADULTPAL.cop, [360, 30]);
reg('MISS NOSE', PR.nose, XPAL.nose, [1500, 300]);
reg('THE PROFESSOR', PR.prof, XPAL.prof, [300, 40]);
reg('CHIEF KUMA', PR.kuma, XPAL.kuma, [260, 30]);
reg('TAKAHASHI', PR.taka, XPAL.taka, [700, 250]);
for (const [n, k, v] of [['FACE', 'face', [450, 40]], ['SPOOKY GHOST', 'ghost', [1300, 400]], ['CARL', 'carl', [980, 180]], ['LINDA', 'linda', [520, 15]], ['TP', 'tp', [760, 140]]]) {
  const s = LEGACY[k]; reg(n, scaleSpr(spr(16, 16, g => g.each((x, y) => s.d[y * s.w + x] || 0)), 3), LEGPAL, v);
}
VOICE._ = [800, 60]; VOICE['???'] = [140, 20];
