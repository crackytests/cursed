'use strict';
// ================= ART =================  0 light .. 3 dark, '.' transparent
function mk(w, h, f) {
  const s = { w, h, d: new Uint8Array(w * h).fill(255) };
  const g = {
    p(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < w && y < h) s.d[y * w + x] = c; },
    r(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) g.p(x + i, y + j, c); },
    o(x, y, ww, hh, c) { g.r(x, y, ww, 1, c); g.r(x, y + hh - 1, ww, 1, c); g.r(x, y, 1, hh, c); g.r(x + ww - 1, y, 1, hh, c); },
    e(cx, cy, rx, ry, c) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1) g.p(x, y, c); } },
    rows(a, ox = 0, oy = 0) { a.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') g.p(ox + i, oy + j, +r[i]); }); },
    each(fn) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = fn(x, y); if (c !== undefined && c !== null) g.p(x, y, c); } },
    fill(c) { g.r(0, 0, w, h, c); },
    get: (x, y) => s.d[y * w + x],
  };
  f(g); return s;
}
const R = rows => { if (rows.some(r => r.length !== rows[0].length)) console.warn('row width', rows); return mk(rows[0].length, rows.length, g => g.rows(rows)); };
const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const T = fn => mk(16, 16, fn);
function tile(name, f, o = {}) { TILES[name] = Object.assign({ f: Array.isArray(f) ? f : [f] }, o); }
const rowsSwap = (rows, map) => rows.map((r, i) => map[i] !== undefined ? map[i] : r);

// ---------- bases ----------
const asph = (g, s = 0) => g.each((x, y) => { const h = hash(x, y, s); return h < .07 ? 3 : h < .1 ? 1 : 2; });
const sand = (g, s = 0) => g.each((x, y) => { const h = hash(x, y, s + 9); return h < .06 ? 1 : h < .07 ? 2 : 0; });
const mfloor = g => g.each((x, y) => (((x >> 3) + (y >> 3)) & 1) ? 1 : 0);
const lfloor = g => g.each((x, y) => (x === 0 || y === 0) ? 1 : 0);
const bits = (g, s) => g.each((x, y) => ((x + s) % 4 === 0 && y % 4 === 0) ? 2 : 3);

// ---------- CARL ----------
const carlD = ['.....333333.....','...3333333333...','..333333333333..','..322222222223..','.31111111111113.','.31333311333313.','.31303311303313.','.31333311333313.','..311111111113..','...3111331113...','....33111133....','....30033003....','...3222332223...','..312222222213..','...3222222223...','....333..333....'];
const carlU = ['.....333333.....','...3333333333...','..333333333333..','..333333333333..','.33333333333333.','.31113333331113.','.31111333311113.','.31111111111113.','.31111111111113.','..311111111113..','...3111111113...','....33333333....','...3222222223...','..312222222213..','...3222222223...','....333..333....'];
const carlS = ['....333333......','..3333333333....','.333333333333...','3333333333333...','..311111111113..','..311111133313..','..311111130313..','..311111133313..','..3111111111113.','...31111111133..','....331111113...','......30033.....','.....3222223....','.....3221223....','.....3222223....','......33.33.....'];
const legs = (rows, a, b) => [R(rows), R(rowsSwap(rows, { 15: a })), R(rowsSwap(rows, { 15: b }))];
SPR.carl = {
  down: legs(carlD, '...333.....33...', '...33.....333...'),
  up: legs(carlU, '...333.....33...', '...33.....333...'),
  side: legs(carlS, '.....33...33....', '......3333......'),
};
// the one that faces away. it is always facing away.
SPR.carlback = R(carlU);
SPR.carlsit = R(rowsSwap(carlD, { 13: '..312222222213..', 14: '..333333333333..', 15: '................' }));

// ---------- WHITE SUITS ----------
const suitD = ['.....333333.....','....30000003....','...3000000003...','...3033333303...','...3032223303...','...3033333303...','...3000000003...','....33000033....','..330000000033..','.30030000003003.','.30030000003003.','.33330000003333.','....30000003....','....30033003....','....30033003....','....333..333....'];
const suitU = rowsSwap(suitD, { 3: '...3000000003...', 4: '...3000000003...', 5: '...3000000003...' });
const suitS = rowsSwap(suitD, { 3: '...3000003333...', 4: '...3000003223...', 5: '...3000003333...' });
SPR.suit = { down: legs(suitD, '...333....333...', '....333..333....'), up: legs(suitU, '...333....333...', '....333..333....'), side: legs(suitS, '....33...33.....', '.....3333.......') };

// ---------- PEOPLE ----------
const shopperRows = ['......3333......','.....311113.....','....31111113....','....31111113....','....31111113....','.....311113.....','......3333......','.....322223.....','....32222223....','...3222222223...','...3122222213...','...3122222213...','....32222223....','....32233223....','....3223.3223...','....333..333....'];
SPR.shopper = R(shopperRows);
SPR.shopperEyes = R(rowsSwap(shopperRows, { 3: '....31311313....' }));
SPR.shopperBack = R(rowsSwap(shopperRows, { 2: '....33333333....', 3: '....33333333....' }));
SPR.attendant = R(['.....333333.....','....33333333....','...3333333333...','....31111113....','....31311313....','....31111113....','.....311113.....','......3333......','.....300003.....','....30222203....','...3002222003...','...3102222013...','...3102222013...','....32222223....','....3223.3223...','....333..333....']);
SPR.cop = R(['.....333333.....', '....33333333....', '...3333003333...', '....31111113....', '....31311313....', '....31111113....', '.....311113.....', '......3333......', '.....333333.....', '....33033333....', '...3333333333...', '...3133333313...', '...3133333313...', '....33333333....', '....3223.3223...', '....333..333....']);
SPR.hitch = R(['................','.....333333.....','.....311113.....','.33333333333333.','....31111113....','....31311313....','....31111113....','....31333313....','.....311113.....','....32222223....','...3222222223...','...3122222213...','...3122222213...','....32222223....','....3223.3223...','....333..333....']);
SPR.clerk = R(['.....333333.....','....33333333....','...3331111333...','...3311111133...','...3313113133...','...3311111133...','...3331331333...','...33.3113.33...','.....322223.....','....32222223....','...3222222223...','...3122222213...','...3122222213...','....32222223....','....3223.3223...','....333..333....']);
const ghostA = ['.....333333.....','...3300000033...','..300000000003..','.30000000000003.','.30033000033003.','.30033000033003.','.30000000000003.','.30000033000003.','.30000333300003.','.30000033000003.','.30000000000003.','.30000000000003.','.30000000000003.','.30300030003003.','.33.33333.333.3.','................'];
SPR.ghost = [R(ghostA), R(rowsSwap(ghostA, { 13: '.30030003000303.', 14: '.3.333.33333.33.' }))];
SPR.shadow = mk(16, 32, g => { g.e(8, 7, 7, 7, 3); g.r(6, 13, 4, 16, 3); g.r(3, 15, 10, 2, 3); g.r(4, 17, 2, 9, 3); g.r(10, 17, 2, 9, 3); g.r(6, 29, 1, 3, 3); g.r(9, 29, 1, 3, 3); });
SPR.shadowEyes = mk(16, 32, g => { const s = SPR.shadow; for (let i = 0; i < s.d.length; i++) if (s.d[i] !== 255) g.p(i % 16, (i / 16) | 0, s.d[i]); g.r(4, 6, 3, 2, 0); g.r(9, 6, 3, 2, 0); });

// ---------- OBJECTS ----------
SPR.ass = [0, 1].map(k => mk(32, 32, g => {
  g.e(16, 18, 15.5, 11, 3); g.e(16, 18, 14, 9.5, 2); g.e(16, 18, 10, 6, 1);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.r(16 + Math.cos(a) * 12 - 1, 18 + Math.sin(a) * 8 - 1, 2, 2, (i + k) & 1 ? 0 : 3); }
  g.e(16, 13, 7, 7, 3); g.e(16, 13, 6, 6, 1); g.r(12, 10, 2, 2, 0); g.r(14, 9, 1, 1, 0);
  g.r(9, 26, 2, 5, 3); g.r(21, 26, 2, 5, 3); g.r(7, 30, 6, 2, 3); g.r(19, 30, 6, 2, 3);
}));
SPR.cart = mk(16, 16, g => { g.o(2, 4, 12, 7, 3); for (let x = 4; x < 14; x += 3) g.r(x, 5, 1, 5, 2); g.r(3, 7, 10, 1, 2); g.r(13, 1, 1, 4, 3); g.r(13, 1, 3, 1, 3); g.r(3, 11, 1, 3, 3); g.r(11, 11, 1, 3, 3); g.r(2, 13, 3, 2, 3); g.r(10, 13, 3, 2, 3); });
SPR.bong = mk(16, 32, g => { g.o(5, 1, 6, 22, 3); g.r(6, 2, 4, 20, 0); g.r(6, 12, 4, 10, 1); g.e(8, 25, 6.5, 6.5, 3); g.e(8, 25, 5.2, 5.2, 1); g.r(5, 22, 6, 3, 1); g.r(11, 17, 4, 1, 3); g.r(14, 15, 2, 3, 3); g.r(7, 4, 1, 6, 1); });
SPR.bongBroke = mk(16, 32, g => { g.e(8, 27, 6.5, 4, 3); g.e(8, 27, 5, 3, 1); g.r(3, 22, 2, 2, 3); g.r(11, 20, 3, 2, 3); g.r(6, 18, 1, 3, 3); g.r(12, 26, 2, 1, 0); });
SPR.tv = [0, 1, 2].map(k => mk(16, 16, g => {
  g.r(1, 2, 14, 11, 3); g.r(3, 4, 10, 7, 1);
  if (k === 2) { g.r(5, 6, 2, 2, 3); g.r(9, 6, 2, 2, 3); g.r(5, 9, 6, 1, 3); g.p(4, 8, 3); g.p(11, 8, 3); }
  else g.each((x, y) => x >= 3 && x < 13 && y >= 4 && y < 11 ? (hash(x, y, k * 7) < .5 ? 0 : 2) : null);
  g.r(3, 13, 2, 2, 3); g.r(11, 13, 2, 2, 3); g.r(5, 0, 1, 2, 3); g.r(10, 0, 1, 2, 3);
}));
SPR.linda = [0, 1, 2, 3].map(k => mk(32, 32, g => {
  g.r(1, 1, 30, 23, 3); g.r(3, 3, 26, 19, k === 3 ? 3 : 1);
  if (k === 3) { g.r(8, 9, 5, 1, 0); g.r(19, 9, 5, 1, 0); g.r(12, 16, 8, 1, 0); }
  else {
    if (k === 1) { g.r(7, 10, 7, 1, 3); g.r(18, 10, 7, 1, 3); }
    else { g.e(10.5, 10.5, 3.5, 2.5, 3); g.e(21.5, 10.5, 3.5, 2.5, 3); g.r(10, 10, 1, 1, 0); g.r(21, 10, 1, 1, 0); }
    if (k === 2) { g.e(16, 17, 3, 2, 3); } else g.r(12, 17, 8, 1, 3);
    g.r(7, 6, 5, 1, 2); g.r(20, 6, 5, 1, 2);
  }
  g.r(13, 24, 6, 4, 2); g.r(8, 28, 16, 3, 3); g.r(26, 20, 2, 1, 0);
}));
SPR.core = [0, 1].map(k => mk(32, 32, g => {
  g.e(16, 16, 15.5, 15.5, 3); g.e(16, 16, 13, 13, 2); g.e(16, 16, 11, k ? 2 : 9, 0); if (!k) { g.e(16, 16, 5, 5, 3); g.r(13, 12, 2, 2, 1); }
}));
SPR.cage = mk(16, 16, g => { g.r(0, 0, 16, 2, 3); g.r(0, 14, 16, 2, 3); for (let x = 0; x < 16; x += 3) g.r(x, 0, 1, 16, 3); });
SPR.prints = mk(16, 16, g => { g.r(4, 3, 2, 3, 3); g.r(10, 9, 2, 3, 3); });
SPR.hatch = mk(16, 16, g => { g.r(1, 1, 14, 14, 3); g.r(2, 2, 12, 12, 2); g.e(8, 8, 4.5, 4.5, 3); g.e(8, 8, 3, 3, 2); g.r(7, 3, 2, 10, 3); g.r(3, 7, 10, 2, 3); });
SPR.pod = mk(16, 16, g => { g.e(8, 9, 7, 6, 3); g.e(8, 9, 6, 5, 2); g.e(7, 8, 3, 2.5, 0); g.r(10, 5, 1, 4, 3); g.r(11, 9, 3, 1, 3); g.r(0, 14, 3, 1, 3); g.r(13, 3, 3, 1, 3); });
SPR.rope = mk(16, 16, g => { g.r(1, 4, 3, 10, 3); g.r(12, 4, 3, 10, 3); g.r(0, 13, 5, 2, 3); g.r(11, 13, 5, 2, 3); g.r(2, 2, 1, 2, 2); g.r(13, 2, 1, 2, 2); for (let x = 3; x < 13; x++) g.p(x, 6 + Math.round(Math.sin((x - 3) / 9 * Math.PI) * 2), 2); for (let x = 3; x < 13; x++) g.p(x, 7 + Math.round(Math.sin((x - 3) / 9 * Math.PI) * 2), 3); });
SPR.bubble = [0, 1, 2].map(k => mk(16, 16, g => { g.r(1, 2, 14, 9, 3); g.r(2, 3, 12, 7, 0); g.r(4, 11, 3, 2, 3); g.r(5, 11, 1, 1, 0); for (let i = 0; i <= k; i++) g.r(4 + i * 3, 6, 2, 2, 3); }));
SPR.bus = mk(48, 16, g => { g.r(0, 1, 48, 14, 3); g.r(1, 2, 46, 12, 1); for (let x = 6; x < 44; x += 6) g.r(x, 4, 3, 8, 2); g.r(1, 2, 4, 12, 2); g.r(2, 3, 2, 10, 0); g.r(20, 6, 8, 4, 0); });
SPR.parcel = mk(16, 16, g => { g.r(2, 5, 12, 10, 3); g.r(3, 6, 10, 8, 1); g.r(7, 5, 2, 10, 2); g.r(3, 9, 10, 1, 2); g.r(4, 2, 3, 3, 3); g.r(9, 2, 3, 3, 3); });
SPR.meter = mk(16, 16, g => { g.r(7, 7, 2, 9, 3); g.e(8, 5, 4, 4.5, 3); g.e(8, 5, 2.8, 3.2, 0); g.r(8, 3, 1, 3, 3); });
SPR.dframe = mk(16, 32, g => { g.r(1, 2, 14, 30, 3); g.r(3, 4, 10, 28, 1); g.r(10, 18, 2, 2, 3); });

// ---------- TILES ----------
tile('void', T(g => g.fill(3)), { solid: 1 });
tile('asph', T(g => asph(g)));
tile('aline', T(g => { asph(g); g.r(0, 0, 1, 16, 0); g.r(1, 0, 1, 16, 1); }));
tile('walk', T(g => g.each((x, y) => x === 15 || y === 15 ? 2 : hash(x, y, 3) < .05 ? 2 : 1)));
tile('mwall', T(g => { g.fill(1); g.r(0, 0, 16, 3, 3); g.r(0, 12, 16, 4, 2); g.r(7, 3, 2, 9, 2); g.r(0, 11, 16, 1, 3); }), { solid: 1, look: ['The Mall of the Future. It looks the same as the mall of the past.', 'Wall. Mall wall. Wallmall.'] });
tile('mwin', [0, 1].map(k => T(g => { g.fill(1); g.r(0, 0, 16, 3, 3); g.r(2, 4, 12, 7, 3); g.r(3, 5, 10, 5, k ? 0 : 2); g.r(0, 12, 16, 4, 2); g.r(0, 11, 16, 1, 3); })), { solid: 1, spd: 90, look: ['Somebody turned the lights on in there. Nobody works in there.', 'Is that a window or a screen? Chat, is that a window?'] });
tile('mdoor', T(g => { g.fill(3); g.r(2, 2, 12, 14, 0); g.r(7, 2, 2, 14, 3); g.r(3, 4, 1, 3, 1); g.r(4, 3, 1, 3, 1); g.r(10, 4, 1, 3, 1); g.r(11, 3, 1, 3, 1); }), { solid: 1 });
tile('lamp', [0, 1].map(k => T(g => { asph(g); g.r(7, 4, 2, 12, 3); g.r(5, 1, 6, 3, 3); g.r(6, 2, 4, 1, k ? 0 : 2); g.r(5, 14, 6, 2, 3); })), { solid: 1, spd: 7, look: ['The lamp is humming the same note as my ship.', 'Buzzing. Everything out here is buzzing.'] });
const car = (g, s) => { asph(g, s); g.r(2, 1, 12, 14, 3); g.r(3, 2, 10, 12, 1); g.r(4, 4, 8, 2, 3); g.r(4, 11, 8, 2, 3); g.r(4, 6, 8, 5, 0); g.r(1, 3, 1, 2, 3); g.r(14, 3, 1, 2, 3); g.r(1, 11, 1, 2, 3); g.r(14, 11, 1, 2, 3); };
tile('car', T(g => car(g, 1)), { solid: 1, look: ['Somebody\'s car. Humans love cars. I love cars. Normal amount.', 'There\'s a parking ticket on it. It says CARL. Why does it say Carl?', 'Nobody\'s in it. Nobody\'s in any of them.'] });
tile('carK', [0, 1, 2].map(k => T(g => { car(g, 2); g.r(6, 4, 4, 3, 3); g.e(8, 8, 3, 3, 3); if (k !== 1) { g.p(7, 8, 0); g.p(9, 8, 0); } })), { solid: 1, spd: 50 });
tile('bush', T(g => { g.fill(2); g.e(4, 5, 5, 5, 3); g.e(12, 6, 5, 5, 3); g.e(8, 12, 6, 5, 3); g.e(4, 4, 3, 3, 2); g.e(12, 5, 3, 3, 2); g.e(8, 11, 4, 3, 2); g.p(3, 3, 1); g.p(11, 4, 1); g.p(7, 10, 1); }), { solid: 1, look: ['Bushes. Good for hiding. Not that I hide. Humans don\'t hide.', 'There\'s something in the bushes. Oh. It\'s more bushes.'] });
tile('booth', T(g => { g.fill(1); g.r(0, 0, 16, 3, 3); g.r(2, 5, 12, 6, 3); g.r(3, 6, 10, 4, 0); g.r(0, 15, 16, 1, 3); }), { solid: 1 });
tile('sign', T(g => { asph(g); g.r(1, 1, 14, 9, 3); g.r(2, 2, 12, 7, 0); g.r(4, 4, 8, 1, 2); g.r(4, 6, 6, 1, 2); g.r(7, 10, 2, 6, 3); }), { solid: 1 });
tile('signw', T(g => { g.fill(1); g.r(1, 1, 14, 9, 3); g.r(2, 2, 12, 7, 0); g.r(4, 4, 8, 1, 2); g.r(4, 6, 6, 1, 2); g.r(7, 10, 2, 6, 3); }), { solid: 1 });
tile('shutter', T(g => { g.fill(2); for (let y = 1; y < 16; y += 3) g.r(0, y, 16, 1, 3); g.r(0, 0, 16, 1, 3); g.r(6, 13, 4, 1, 0); }), { solid: 1 });
tile('shutOpen', T(g => { g.fill(3); g.r(0, 0, 16, 3, 2); g.r(0, 3, 16, 1, 3); }));
tile('panel', [0, 1].map(k => T(g => { g.fill(1); g.r(0, 0, 16, 3, 3); g.r(0, 12, 16, 4, 2); g.r(0, 11, 16, 1, 3); g.r(3, 4, 10, 6, 3); g.r(4, 5, 8, 4, k ? 0 : 2); g.r(12, 4, 1, 1, k ? 0 : 3); })), { solid: 1, spd: 20 });
tile('crate', T(g => { asph(g); g.r(1, 1, 14, 14, 3); g.r(2, 2, 12, 12, 1); for (let i = 2; i < 14; i++) { g.p(i, i, 2); g.p(15 - i, i, 2); } }), { solid: 1, look: ['Crates of Prop Pills. The label says PLACEBO in really small letters. Suspiciously small.', 'These are all addressed to Suite 00.'] });
tile('floor', T(mfloor));
tile('iwall', T(g => { g.fill(2); g.r(0, 0, 16, 4, 3); g.r(0, 10, 16, 1, 1); g.r(0, 15, 16, 1, 3); }), { solid: 1, look: ['A wall. It\'s warm. Walls shouldn\'t be warm.', 'I can hear the muzak through the wall. It\'s inside the wall too.'] });
tile('store', T(g => { g.fill(3); g.r(0, 0, 16, 4, 2); for (let x = 0; x < 16; x += 4) g.r(x, 0, 2, 4, 3); g.r(1, 5, 14, 10, 0); g.r(3, 7, 1, 3, 1); g.r(4, 6, 1, 3, 1); g.r(7, 5, 1, 10, 3); }), { solid: 1, look: ['Empty store. Everything\'s for sale and there\'s nothing in it.', 'The mannequin in there moved. No it didn\'t. It\'s fine. It\'s fine, chat.', 'A sign says COMING SOON. It\'s said that since the mall was built.'] });
tile('pshut', T(g => { g.fill(2); for (let y = 1; y < 16; y += 3) g.r(0, y, 16, 1, 3); g.r(0, 0, 16, 1, 3); g.e(8, 8, 6, 3.2, 3); g.e(8, 8, 5, 2.2, 0); g.r(8, 6, 4, 5, 1); g.r(8, 5, 1, 7, 3); }), { solid: 1 });
tile('bshop', T(g => { g.fill(3); g.r(0, 0, 16, 4, 1); for (let x = 0; x < 16; x += 4) g.r(x, 0, 2, 4, 3); g.r(1, 5, 14, 10, 0); g.r(6, 6, 3, 6, 2); g.e(7.5, 12.5, 3, 2.5, 2); }), { solid: 1 });
tile('sdoor', T(g => { g.fill(3); g.r(0, 0, 16, 4, 2); g.r(0, 0, 2, 16, 2); g.r(14, 0, 2, 16, 2); }));
tile('plant', T(g => { mfloor(g); g.e(8, 6, 6, 6, 3); g.e(6, 5, 3, 3, 2); g.e(10, 6, 3, 3, 2); g.r(5, 10, 6, 5, 3); g.r(6, 11, 4, 3, 1); }), { solid: 1, look: ['Plastic plant. I checked. I licked it. That\'s how you check.', 'The plant is the only thing in here that isn\'t staring.'] });
tile('bench', T(g => { mfloor(g); g.r(0, 5, 16, 7, 3); g.r(1, 6, 14, 1, 1); g.r(1, 8, 14, 1, 1); g.r(1, 10, 14, 1, 1); }), { solid: 1, look: ['A bench. Somebody carved CARL WAS HERE. I was not here. I\'m pretty sure.', 'Bench. For humans. Sitting humans. I could sit here. I\'m not going to.'] });
tile('table', T(g => { mfloor(g); g.e(8, 8, 6, 6, 3); g.e(8, 8, 5, 5, 1); g.r(6, 6, 2, 1, 0); }), { solid: 1, look: ['Food court table. There\'s a tray with a pretzel on it. The pretzel is warm. It\'s been warm for years.', 'Someone left a receipt. Total: $0.00. Paid with: YOU.'] });
tile('fount', [0, 1].map(k => T(g => { mfloor(g); g.e(8, 8, 7.5, 7.5, 3); g.e(8, 8, 6, 6, 2); g.e(8, 8, 5, 5, 0); g.e(8, 8, k ? 3 : 2, k ? 3 : 2, 1); g.r(7, 7, 2, 2, 3); })), { solid: 1, spd: 25 });
tile('escD', [0, 1, 2, 3].map(k => T(g => { g.fill(2); for (let y = (k * 4) % 4 + k; y < 16; y += 4) g.r(1, (y) % 16, 14, 1, 3); g.r(0, 0, 1, 16, 3); g.r(15, 0, 1, 16, 3); g.r(7, 3, 2, 7, 0); g.r(5, 9, 6, 1, 0); g.r(6, 10, 4, 1, 0); g.r(7, 11, 2, 1, 0); })), { spd: 8 });
tile('escU', [3, 2, 1, 0].map(k => T(g => { g.fill(2); for (let y = k; y < 16; y += 4) g.r(1, y, 14, 1, 3); g.r(0, 0, 1, 16, 3); g.r(15, 0, 1, 16, 3); g.r(7, 5, 2, 8, 0); g.r(5, 5, 6, 1, 0); g.r(6, 4, 4, 1, 0); g.r(7, 3, 2, 1, 0); })), { spd: 8 });
tile('wscreen', [0, 0, 0, 1].map(k => T(g => { g.fill(2); g.r(0, 0, 16, 4, 3); g.r(0, 15, 16, 1, 3); g.r(2, 3, 12, 9, 3); g.r(3, 4, 10, 7, 1); if (k) { g.r(4, 7, 3, 1, 3); g.r(9, 7, 3, 1, 3); } else { g.r(5, 6, 2, 2, 3); g.r(9, 6, 2, 2, 3); } g.r(6, 9, 4, 1, 3); })), { solid: 1, spd: 30 });
tile('dirsign', T(g => { mfloor(g); g.r(2, 1, 12, 12, 3); g.r(3, 2, 10, 10, 0); g.r(4, 3, 3, 3, 2); g.r(8, 3, 4, 2, 1); g.r(4, 7, 8, 1, 2); g.r(4, 9, 5, 1, 2); g.r(7, 13, 2, 3, 3); }), { solid: 1 });
// ship interior
tile('hull', T(g => { g.fill(2); g.r(0, 0, 16, 2, 1); g.r(0, 14, 16, 2, 3); g.p(2, 4, 3); g.p(13, 4, 3); g.p(2, 11, 3); g.p(13, 11, 3); }), { solid: 1, look: ['The hull. I did the paint myself. Green goes with everything. It\'s the only color, chat.', 'There\'s a dent from when I parked. Twice. Once.'] });
tile('win', [0, 1].map(k => T(g => { g.fill(2); g.r(1, 2, 14, 11, 3); g.each((x, y) => x > 1 && x < 15 && y > 2 && y < 13 && hash(x, y, k + 20) < .05 ? 0 : null); g.r(0, 14, 16, 2, 3); })), { solid: 1, spd: 40, look: ['Parking lot. Mall. Stars. The stars are in the wrong places tonight.', 'I can see the mall from here. It can see me too. It\'s a window. That\'s how windows work.'] });
tile('cons', [0, 1, 2].map(k => T(g => { g.fill(3); g.r(1, 3, 14, 9, 2); g.each((x, y) => x > 1 && x < 15 && y > 3 && y < 11 && (x + y * 3) % 5 === 0 ? (hash(x, y, k) < .5 ? 0 : 1) : null); g.r(0, 13, 16, 3, 3); })), { solid: 1, spd: 12, look: ['Ship controls. Most of the buttons do nothing. One of them does everything. I don\'t know which.', 'The console says FUEL: PLENTY. It always says that. I think it\'s lying to make me feel good.', 'There\'s a sticky note that says DON\'T PRESS THE GREEN ONE. They\'re all green.'] });
tile('grate', T(g => g.each((x, y) => (x % 4 === 0 || y % 4 === 0) ? 3 : 2)));
tile('couch', T(g => { g.fill(3); g.r(1, 3, 14, 11, 1); g.r(1, 3, 14, 3, 2); g.r(7, 6, 1, 8, 2); }), { solid: 1, look: ['My couch. I sleep here. I also sit here. Multipurpose.', 'There\'s a red blanket under the cushions. Well. It\'d be red. Everything\'s green.'] });
tile('junk', T(g => { g.each((x, y) => (x % 4 === 0 || y % 4 === 0) ? 3 : 2); g.r(2, 3, 4, 11, 3); g.r(3, 4, 2, 9, 0); g.e(11, 11, 4, 4, 3); g.e(11, 11, 3, 3, 1); g.r(8, 2, 6, 5, 3); }), { solid: 1, look: ['Bongs. Some broken ones. I keep the broken ones. For reasons.', 'A pile of Prop Pills uniforms. One of them has a name tag. It says NAME.'] });
tile('hatchIn', T(g => { g.each((x, y) => (x % 4 === 0 || y % 4 === 0) ? 3 : 2); g.e(8, 8, 7, 7, 3); g.e(8, 8, 5.5, 5.5, 1); g.r(3, 7, 10, 2, 3); }));
// desert
tile('sand', T(g => sand(g)));
tile('sand2', T(g => sand(g, 4)));
tile('road', T(g => g.each((x, y) => y === 0 || y === 15 ? 3 : hash(x, y, 30) < .06 ? 3 : 2)));
tile('roadl', T(g => { g.each((x, y) => y === 15 ? 3 : hash(x, y, 31) < .06 ? 3 : 2); g.r(3, 14, 10, 2, 0); }));
tile('roadl2', T(g => { g.each((x, y) => y === 0 ? 3 : hash(x, y, 32) < .06 ? 3 : 2); g.r(3, 0, 10, 2, 0); }));
tile('cactus', T(g => { sand(g, 2); g.r(6, 1, 4, 15, 3); g.r(7, 2, 2, 13, 2); g.r(2, 5, 4, 3, 3); g.r(2, 3, 3, 5, 3); g.r(3, 4, 1, 3, 2); g.r(10, 8, 4, 3, 3); g.r(11, 5, 3, 5, 3); g.r(12, 6, 1, 3, 2); }), { solid: 1 });
tile('rock', T(g => { sand(g, 5); g.e(8, 10, 7, 5, 3); g.e(7, 9, 5, 3.5, 2); g.r(5, 7, 3, 1, 1); }), { solid: 1, look: ['A rock. It\'s warm on the side facing away from the sun.', 'Nevada rock. Above Nevada it\'s a rock. Below Nevada it\'s a ceiling.'] });
tile('crater', T(g => { sand(g, 6); g.e(8, 8, 8, 7, 1); g.e(8, 8, 6, 5, 2); g.e(8, 9, 4, 3, 1); }));
tile('eye', [0, 0, 0, 0, 1].map(k => T(g => { sand(g, 7); g.e(8, 8, 7, k ? 1 : 4, 3); if (!k) { g.e(8, 8, 5.5, 3, 0); g.e(8, 8, 2.5, 2.5, 3); g.p(7, 7, 1); } })), { spd: 24, look: ['There\'s an eye in the sand. Big eye. Big green eye. Hey. I have those.', 'It blinked. It blinked at me. That\'s a friendly blink. Chat, is that a friendly blink?', 'I\'m not stepping on it. I\'m stepping around it. Respectfully.'] });
tile('busstop', T(g => { sand(g, 8); g.r(7, 5, 2, 11, 3); g.r(2, 0, 12, 6, 3); g.r(3, 1, 10, 4, 0); g.r(5, 2, 6, 1, 2); }), { solid: 1 });
tile('vsign', T(g => { sand(g, 9); g.r(0, 1, 16, 8, 3); g.r(1, 2, 14, 6, 1); g.r(3, 4, 10, 2, 3); g.r(3, 9, 2, 7, 3); g.r(11, 9, 2, 7, 3); }), { solid: 1 });
// facility
tile('lfloor', T(lfloor));
tile('lwall', T(g => { g.fill(1); g.r(0, 0, 16, 2, 0); g.r(0, 12, 16, 4, 3); g.r(0, 11, 16, 1, 2); g.r(7, 2, 1, 9, 2); }), { solid: 1, look: ['White walls. Why is it always white. You\'d think somebody would want a color.', 'I know this wall. I don\'t know how I know this wall.', 'There\'s a scratch at my height. Exactly my height.'] });
tile('ldoor', T(g => { lfloor(g); g.r(0, 0, 2, 16, 2); g.r(14, 0, 2, 16, 2); }));
tile('tube', [0, 1].map(k => T(g => { g.fill(0); g.r(2, 0, 12, 16, 3); g.r(3, 1, 10, 14, 1); g.e(8, 6, 3, 3, 2); g.r(6, 8, 4, 6, 2); g.p(5, (12 - k * 4), 0); g.p(10, (9 + k * 3), 0); g.r(2, 0, 12, 1, 3); })), { solid: 1, spd: 30 });
tile('tubeE', T(g => { g.fill(0); g.r(2, 0, 12, 16, 3); g.r(3, 1, 10, 14, 2); g.r(4, 4, 2, 3, 0); g.r(9, 9, 3, 2, 0); g.r(3, 14, 10, 1, 1); }), { solid: 1 });
tile('bed', T(g => { lfloor(g); g.r(2, 1, 12, 14, 3); g.r(3, 2, 10, 12, 1); g.r(4, 3, 8, 3, 0); }), { solid: 1 });
tile('cab', T(g => { g.fill(3); g.r(1, 1, 14, 14, 2); g.r(1, 5, 14, 1, 3); g.r(1, 10, 14, 1, 3); g.r(6, 3, 4, 1, 0); g.r(6, 7, 4, 1, 0); g.r(6, 12, 4, 1, 0); }), { solid: 1 });
tile('desk', [0, 1].map(k => T(g => { lfloor(g); g.r(0, 4, 16, 10, 3); g.r(1, 5, 14, 3, 2); g.r(4, 0, 8, 7, 3); g.r(5, 1, 6, 4, k ? 0 : 1); })), { solid: 1, spd: 40, look: ['Old computer. Password is PASSWORD. They changed it. It\'s PASSWORD2 now.', 'The screen says: SUBJECT PREFERS TO BE CALLED CARL. Why would they write that down.'] });
tile('elev', T(g => { g.fill(1); g.r(0, 0, 16, 2, 0); g.r(2, 2, 12, 14, 3); g.r(3, 3, 4, 13, 2); g.r(9, 3, 4, 13, 2); g.r(0, 12, 2, 4, 3); g.r(14, 12, 2, 4, 3); }), { solid: 1 });
tile('ladder', T(g => { lfloor(g); g.r(3, 0, 2, 16, 3); g.r(11, 0, 2, 16, 3); for (let y = 2; y < 16; y += 4) g.r(5, y, 6, 1, 3); }));
tile('drawing', T(g => { g.fill(1); g.r(0, 0, 16, 2, 0); g.r(0, 12, 16, 4, 3); g.r(0, 11, 16, 1, 2); g.e(4, 4, 1.5, 1.5, 3); g.r(4, 5, 1, 4, 3); g.e(11, 4, 1.5, 1.5, 3); g.r(11, 5, 1, 4, 3); g.e(7.5, 7, 1.2, 1.2, 3); g.r(7, 8, 1, 2, 3); g.r(5, 6, 5, 1, 3); }), { solid: 1 });
tile('tally', T(g => { g.fill(1); g.r(0, 0, 16, 2, 0); g.r(0, 12, 16, 4, 3); g.r(0, 11, 16, 1, 2); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g.r(2 + j * 3, 3 + i * 2, 1, 2, 2); }), { solid: 1 });
// the box
tile('bits', [0, 1, 2, 3].map(k => T(g => bits(g, k))), { spd: 10 });
tile('code', [0, 1, 2].map(k => T(g => g.each((x, y) => (x % 4 < 3 && y % 5 < 4 && hash(x >> 2, y, k + 40) < .45) ? (hash(x, y, k) < .5 ? 0 : 1) : 3))), { solid: 1, spd: 14, look: ['It\'s all text. Somebody wrote this whole place.', 'I can read some of it. It says CARL. CARL. CARL. It\'s just my name. Over and over. Not my name. The name.', 'It says WHO IS HOLDING THE CONTROLLER. I\'m not holding a controller. I don\'t have a controller.'] });
tile('dpath', [0, 1].map(k => T(g => { g.fill(2); g.each((x, y) => ((x + y + k * 2) % 8 === 0) ? 1 : null); })), { spd: 20 });
// more outside
tile('white', T(g => g.fill(0)));
tile('wline', T(g => { g.fill(0); g.r(0, 0, 1, 16, 1); }));
