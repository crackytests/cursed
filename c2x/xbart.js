'use strict';
// ================= CARL 2 EXTREME: BONUS CARTS, art =================
// Five other platformers, as the focus group remembers them: tiles, foes, bosses, backdrops, outfits, music.

// ---------------- outfits: one hidden per cart, one for beating it ----------------
OUTFITS.push(
  { id: 'eight', name: '8-BIT', blurb: 'THREE COLORS. NO NOTES.', flat: 1, c: { 5: '#db2424', 6: '#db2424', 10: '#db2424', 13: '#6d4924', 15: '#242424' }, acc: 'stache', camp: 'smb' },
  { id: 'fire', name: 'FIRE CARL', blurb: 'HE ALREADY HAD A LIGHTER', c: { 5: '#db2424', 6: '#ff4949', 10: '#f8f8f8', 13: '#6d4924', 15: '#242424' }, acc: 'stache', camp: 'smb', clear: 1 },
  { id: 'cape', name: 'CAPE', blurb: 'IT DOES NOTHING', c: { 15: '#ffdb24' }, acc: 'cape', camp: 'smw' },
  { id: 'dino', name: 'DINO HOOD', blurb: 'NO DINOS WERE HURT. ONE.', c: { 10: '#24b624', 15: '#24b624' }, acc: 'dinohat', camp: 'smw', clear: 1 },
  { id: 'speedy', name: 'SPEED SHOES', blurb: 'RED MEANS FAST', c: { 5: '#2449db', 6: '#4970ff', 10: '#2449db', 13: '#db2424' }, acc: 'gloves', camp: 'son1' },
  { id: 'super', name: 'SUPER CARL', blurb: 'NO EMERALDS NEEDED', c: { 5: '#ffdb24', 6: '#ffff92', 10: '#ffdb24', 13: '#db2424' }, acc: 'spikes', camp: 'son1', clear: 1 },
  { id: 'tails', name: 'TWO TAILS', blurb: 'BOTH DECORATIVE', c: { 5: '#ff9224', 6: '#ffb649', 10: '#ff9224', 13: '#db2424', 15: '#ff9224' }, acc: 'tails', camp: 'son2' },
  { id: 'metal', name: 'METAL CARL', blurb: 'NOT LEGALLY HU-MAN', c: { 2: '#b6b6db', 3: '#6d6d92', 4: '#ffffff', 5: '#4970b6', 6: '#92b6db', 10: '#6d6d92', 13: '#494949', 7: '#db2424' }, camp: 'son2', clear: 1 },
  { id: 'knux', name: 'KNUCKLEHEAD', blurb: 'HE WAS TRICKED', c: { 5: '#db2424', 6: '#ff4949', 10: '#db2424', 13: '#24b624', 15: '#db2424' }, acc: 'dreads', camp: 'son3' },
  { id: 'hyper', name: 'HYPER CARL', blurb: 'LOCKED ON', c: { 5: '#ffffff', 6: '#ffffff', 10: '#dbdbff', 13: '#ff49db' }, acc: 'spikes', camp: 'son3', clear: 1 },
);

// ---------------- block tiles (one palette for every cart) ----------------
XP.blk = pal0('#db9224', '#6d4924', '#b66d24', '#ffb692', '#ffffff', '#24b624', '#92ff49', '#126d12', '#db2424', '#b6b6b6', '#6d6d6d', '#2449db', '#ffdb24', '#92dbff'); // index = position from 1; 15 black
const glyphOn = (g, x, y, ch, c) => { const gl = FONT[ch]; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j] & (16 >> i)) g.p(x + i, y + j, c); };
const mirror = s => spr(s.w, s.h, g => { for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) { const c = s.d[y * s.w + x]; if (c) g.p(s.w - 1 - x, y, c); } });
const dash = spr(16, 16, g => { g.r(0, 0, 16, 16, 11); g.r(0, 0, 16, 3, 10); g.r(0, 15, 16, 1, 15); for (const k of [2, 8]) for (let i = 0; i < 4; i++) { g.r(k + i, 5 + i, 2, 1, 13); g.r(k + i, 12 - i, 2, 1, 13); } });
const TILES2 = {
  '?': [0, 1].map(f => spr(16, 16, g => { g.r(0, 0, 16, 16, f ? 1 : 13); g.r(0, 15, 16, 1, 2); g.r(15, 0, 1, 16, 2); g.r(0, 0, 16, 1, 5); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) g.p(x, y, 2); glyphOn(g, 6, 5, '?', 15); glyphOn(g, 5, 4, '?', 2); })),
  u: spr(16, 16, g => { g.r(0, 0, 16, 16, 2); g.r(0, 15, 16, 1, 15); g.r(15, 0, 1, 16, 15); for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) g.p(x, y, 1); }),
  b: spr(16, 16, g => { g.r(0, 0, 16, 16, 3); for (const y of [0, 8]) g.r(0, y, 16, 1, 2); g.r(7, 1, 1, 7, 2); g.r(3, 9, 1, 7, 2); g.r(11, 9, 1, 7, 2); g.r(0, 1, 7, 1, 4); g.r(8, 1, 8, 1, 4); g.r(4, 9, 7, 1, 4); }),
  PL: spr(16, 16, g => { g.r(0, 0, 16, 16, 6); g.r(3, 0, 3, 16, 7); g.r(0, 0, 1, 16, 15); }),
  PR: spr(16, 16, g => { g.r(0, 0, 16, 16, 6); g.r(10, 0, 4, 16, 8); g.r(15, 0, 1, 16, 15); }),
  PtL: spr(16, 16, g => { g.r(0, 0, 16, 16, 6); g.r(3, 8, 3, 8, 7); g.r(0, 0, 16, 8, 6); g.r(2, 1, 3, 6, 7); g.r(0, 0, 16, 1, 15); g.r(0, 7, 16, 1, 15); g.r(0, 0, 1, 16, 15); }),
  PtR: spr(16, 16, g => { g.r(0, 0, 16, 16, 6); g.r(10, 8, 4, 8, 8); g.r(9, 1, 6, 6, 8); g.r(0, 0, 16, 1, 15); g.r(0, 7, 16, 1, 15); g.r(15, 0, 1, 16, 15); }),
  s: [0, 1].map(f => spr(16, 16, g => { g.r(2, 12, 12, 4, 11); g.r(3, 12, 10, 1, 10); for (let y = f ? 9 : 6; y < 12; y += 2) g.r(4, y, 8, 1, 10); g.r(0, f ? 7 : 3, 16, 4, 9); g.r(0, f ? 7 : 3, 16, 1, 5); g.r(0, f ? 10 : 6, 16, 1, 15); })),
  '}': dash, '{': mirror(dash),
  Z: spr(16, 16, g => { g.r(0, 0, 16, 16, 3); g.r(0, 12, 16, 4, 2); g.r(0, 0, 16, 2, 4); g.line(3, 0, 7, 7, 15); g.line(7, 7, 4, 15, 15); g.line(7, 7, 14, 9, 15); g.line(11, 0, 9, 4, 15); }),
  B: spr(16, 16, g => { g.r(0, 2, 16, 6, 2); g.r(0, 2, 16, 1, 4); g.r(0, 7, 16, 1, 15); for (let x = 1; x < 16; x += 5) g.r(x, 3, 2, 4, 3); g.r(0, 0, 16, 1, 11); }),
};
function drawTile2(c, tx, ty, sx, sy) {
  const k = tx + ',' + ty, b = LV.sprung[k] || 0;
  if (c === '?') draw(TILES2['?'][(frame >> 4) % 3 === 2 ? 1 : 0], sx, sy - (b > 4 ? 8 - b : b > 0 ? b : 0), XP.blk);
  else if (c === 'P') { const left = tileAt(tx - 1, ty) !== 'P', top = tileAt(tx, ty - 1) !== 'P'; draw(TILES2[(top ? 'Pt' : 'P') + (left ? 'L' : 'R')], sx, sy, XP.blk); }
  else if (c === 's') draw(TILES2.s[b > 0 ? 1 : 0], sx, sy, XP.blk);
  else if (c === 'u' || c === 'b') draw(TILES2[c], sx, sy - (b > 0 ? Math.min(b, 8 - b) : 0), XP.blk);
  else draw(TILES2[c], sx, sy, XP.blk);
}

// ---------------- foes ----------------
XP.bf = pal0('#b6926d', '#ffdbb6', '#ffffff', '#6d4924', '#24b624', '#92ff49', '#ffdb24', '#db2424', '#2449db', '#b6b6b6', '#6d6d6d', '#ff92b6', '#ff9224', '#92dbff');
// GOONBA: a committee goon, but a mushroom. He has a tie
XS.goonba = [0, 1].map(f => outline(spr(16, 16, g => { g.e(8, 6, 7.5, 5.5, 4); g.r(1, 7, 14, 2, 4); g.r(3, 2, 10, 1, 1); g.e(5, 6, 1.6, 2, 3); g.e(11, 6, 1.6, 2, 3); g.p(6, 6, 15); g.p(10, 6, 15); g.line(3, 3, 7, 5, 15); g.line(13, 3, 9, 5, 15); g.r(4, 10, 8, 4, 2); g.r(7, 10, 2, 4, 8); g.r(f ? 2 : 3, 14, 5, 2, 15); g.r(f ? 10 : 9, 14, 5, 2, 15); }), 15));
// KPI TROOPA: a turtle with a chart on his shell. Stomp him: shell. Touch the shell: kick
XS.troopa = [0, 1].map(f => outline(spr(16, 24, g => { g.e(7, 14, 6, 6, 5); g.e(7, 14, 4.5, 4.5, 6); g.line(4, 16, 6, 13, 8); g.line(6, 13, 8, 15, 8); g.line(8, 15, 10, 11, 8); g.r(11, 4, 4, 10, 7); g.e(13, 4, 3, 3.5, 7); g.p(14, 3, 15); g.r(f ? 4 : 6, 20, 4, 4, 7); g.r(f ? 9 : 8, 20, 4, 4, 7); g.r(1, 19, 13, 1, 3); }), 15));
XS.shell = outline(spr(16, 14, g => { g.e(8, 7, 7.5, 6, 5); g.e(8, 6, 5.5, 4, 6); g.r(0, 10, 16, 2, 3); g.line(5, 8, 7, 5, 8); g.line(7, 5, 9, 7, 8); g.line(9, 7, 11, 4, 8); }), 15);
// SHY GHOST: moves when you look away. A guest star, apparently
XS.ghost = [0, 1].map(shy => outline(spr(18, 18, g => { g.e(9, 9, 8, 8, 3); g.r(1, 9, 16, 6, 3); for (let x = 1; x < 17; x += 4) g.e(x + 2, 15, 2, 2, 3);
  if (shy) { g.e(5, 9, 3, 2.5, 3); g.e(13, 9, 3, 2.5, 3); g.r(2, 8, 5, 1, 10); g.r(11, 8, 5, 1, 10); g.e(4, 12, 1.5, 1, 12); g.e(14, 12, 1.5, 1, 12); }
  else { g.e(6, 7, 1.5, 2.5, 15); g.e(12, 7, 1.5, 2.5, 15); g.e(9, 12, 4, 2, 15); g.r(8, 13, 3, 2, 12); } }), 15));
// MOTOBUX: a ladybug robot with a price tag
XS.motobux = [0, 1].map(f => outline(spr(20, 16, g => { g.e(9, 7, 8, 6, 8); g.e(6, 5, 1.5, 1.5, 15); g.e(10, 4, 1.5, 1.5, 15); g.e(13, 8, 1.5, 1.5, 15); g.e(16, 8, 3, 3, 10); g.p(17, 7, 15); g.e(5, 13, 2.5, 2.5, 11); g.e(13, 13, 2.5, 2.5, 11); g.p(f ? 5 : 4, 13, 10); g.p(f ? 13 : 12, 13, 10); g.line(1, 4, 0, 0, 10); g.r(0, 0, 3, 2, 7); }), 15));
// BUZZ BUDGET: a wasp drone that fires memos down at you
XS.buzzer = [0, 1].map(f => outline(spr(22, 12, g => { g.e(10, 7, 7, 3.5, 9); g.r(5, 5, 10, 1, 7); g.r(5, 8, 10, 1, 7); g.e(17, 6, 3, 3, 10); g.p(18, 5, 8); g.line(3, 8, 0, 11, 10); g.e(9, 2 + f, 5, 2, 14); }), 15));
// CRAB-MEAT (THE SNACK): walks sideways, lobs two shots
XS.crab = [0, 1].map(f => outline(spr(24, 16, g => { g.e(12, 9, 8, 5, 8); g.e(12, 8, 6, 3, 13); g.r(9, 3, 2, 4, 8); g.r(13, 3, 2, 4, 8); g.p(9, 2, 15); g.p(14, 2, 15); g.e(2, 5 - f, 2.5, 3, 8); g.e(21, 5 - f, 2.5, 3, 8); g.r(1, 2 - f, 2, 1, 3); g.r(21, 2 - f, 2, 1, 3); for (const x of [6, 9, 15, 18]) g.line(x, 13, x + (f ? 1 : -1), 15, 8); }), 15));
// MONITORS: a TV with a prize on it. Break it
XS.monitor = outline(spr(16, 18, g => { g.r(0, 0, 16, 16, 10); g.r(2, 2, 12, 10, 15); g.r(0, 15, 16, 1, 11); g.r(6, 16, 4, 2, 11); g.p(13, 13, 8); }), 15);
// the dino. Legally distinct: he has a saddle and a lanyard
XS.dino = [0, 1].map(f => outline(spr(26, 18, g => { g.e(11, 9, 8, 5, 5); g.e(11, 11, 6, 3, 6); g.r(8, 3, 7, 3, 8); g.r(16, 1, 6, 9, 5); g.e(20, 3, 5, 3, 5); g.e(21, 2, 1.5, 2, 3); g.p(22, 2, 15); g.r(22, 6, 4, 1, 15); g.line(3, 8, 0, 12, 5); g.r(f ? 6 : 8, 13, 3, 5, 5); g.r(f ? 14 : 12, 13, 3, 5, 5); g.r(f ? 5 : 7, 16, 5, 2, 13); g.r(f ? 13 : 11, 16, 5, 2, 13); g.line(17, 6, 14, 12, 9); }), 15));
// TALES: the sidekick. Two tails, no lines
XS.tales = [0, 1].map(f => outline(spr(20, 20, g => { g.e(5, 13 - f, 4, 2, 13); g.e(3, 16 + f, 4, 2, 13); g.p(1, 12 - f, 3); g.p(0, 17 + f, 3); g.r(8, 10, 6, 7, 13); g.r(9, 12, 4, 4, 3); g.e(11, 6, 5, 4.5, 13); g.e(13, 8, 3, 2, 3); g.e(13, 5, 1.5, 2, 3); g.p(14, 5, 15); g.line(7, 2, 8, 5, 13); g.line(14, 1, 13, 4, 13); g.r(9, 17, 3, 3, 8); g.r(12, 17, 3, 3, 8); }), 15));

// ---------------- bosses ----------------
XP.bb = pal0('#92ff49', '#ffdb24', '#ffffff', '#24b624', '#db2424', '#ff9224', '#2449db', '#b6b6b6', '#6d6d6d', '#ffdbb6', '#ff92b6', '#126d12', '#db9224', '#92dbff');
// KING BOSSER: a boss. The kind with a parking spot
XS.bosser = [0, 1, 2].map(f => outline(spr(36, 36, g => {
  g.e(14, 18, 12, 11, 4); g.e(14, 18, 9, 8, 12); for (let i = 0; i < 4; i++) { const a = -2.6 + i * .7; g.line(14 + Math.cos(a) * 10, 18 + Math.sin(a) * 10, 14 + Math.cos(a) * 15, 18 + Math.sin(a) * 15, 3); }
  g.r(20, 14, 9, 16, 2); g.r(23, 15, 3, 10, 7); g.p(24, 14, 3);
  g.r(f === 1 ? 9 : 12, 29, 7, 7, 2); g.r(f === 1 ? 21 : 18, 29, 7, 7, 2); g.r(8, 34, 22, 2, 13);
  g.e(28, 9, 7, 6, 2); g.r(30, 10, 6, f === 2 ? 6 : 3, f === 2 ? 5 : 2); g.e(30, 7, 2, 2, 3); g.p(31, 7, 15); g.line(24, 4, 21, 0, 3); g.line(30, 4, 32, 0, 3); g.r(21, 3, 8, 2, 5); g.r(25, 1, 5, 3, 5);
  g.r(26, 17, 7, 3, 2); g.r(32, 16, 3, 4, 3);
}), 15));
// THE INTERN: Bosser's kid, kind of. Glasses, lanyard, shell
XS.intern = [0, 1].map(f => outline(spr(22, 24, g => { g.e(9, 14, 7, 7, 4); g.e(9, 14, 5, 5, 1); g.r(12, 8, 7, 12, 2); g.e(15, 6, 5.5, 5, 2); g.e(15, 6, 2, 1.8, 3); g.e(19, 6, 2, 1.8, 3); g.p(15, 6, 15); g.p(19, 6, 15); g.r(16, 6, 2, 1, 15); g.r(14, 1, 7, 2, 5); g.line(14, 11, 16, 17, 7); g.r(15, 17, 3, 3, 3); g.r(f ? 5 : 7, 20, 4, 4, 2); g.r(f ? 12 : 10, 20, 4, 4, 2); }), 15));
// DR. ROBUXNIK: an egg in a pod with a wrecking ball. Bills by the hour
XS.robux = [0, 1].map(f => outline(spr(40, 34, g => {
  g.e(20, 10, 8, 9, 5); g.e(20, 6, 6, 5, 10); g.p(17, 4, 3); g.e(17, 8, 2, 2, 3); g.e(23, 8, 2, 2, 3); g.p(18, 8, 15); g.p(24, 8, 15); g.e(20, 12, 7, 2, 6); g.r(14, 13, 2, 3, 6); g.r(24, 13, 2, 3, 6); g.r(18, 9, 4, 3, 11);
  g.e(20, 24, 19, 9, 8); g.e(20, 27, 17, 6, 9); g.r(1, 18, 38, 3, 8); g.r(1, 18, 38, 1, 3); g.r(8, 25, 24, 2, 15); g.e(20, 33, 4, 2 + f, f ? 6 : 2);
  glyphOn(g, 17, 20, '$', 2);
}), 15));
// KNUCKLEHEAD: red, dreadlocks, very big gloves. He was tricked
XS.knux = [0, 1, 2].map(f => outline(spr(28, 32, g => {
  for (let i = 0; i < 4; i++) { g.line(9, 4 + i * 3, 2 - (f === 2 ? 3 : 0), 9 + i * 4, 5); g.line(9, 5 + i * 3, 3 - (f === 2 ? 3 : 0), 10 + i * 4, 5); }
  g.e(13, 8, 7, 7, 5); g.e(17, 9, 4, 4, 10); g.e(17, 7, 2.5, 3, 3); g.p(18, 7, 15); g.r(19, 11, 3, 1, 15);
  g.r(9, 15, 9, 9, 5); g.e(13, 17, 3, 2, 3); g.p(13, 15, 3);
  if (f === 2) { g.r(16, 15, 10, 4, 5); g.e(24, 17, 4, 4, 3); g.r(4, 15, 6, 3, 5); g.e(3, 16, 3, 3, 3); }
  else { g.r(16, 16, 4, 6, 5); g.e(19, 22, 4, 4, 3); g.r(6, 16, 4, 6, 5); g.e(7, 22, 4, 4, 3); }
  g.r(f === 1 ? 8 : 10, 24, 3, 5, 5); g.r(f === 1 ? 15 : 13, 24, 3, 5, 5); g.r(f === 1 ? 6 : 8, 28, 7, 4, 4); g.r(f === 1 ? 14 : 12, 28, 7, 4, 4); g.r(f === 1 ? 6 : 8, 29, 7, 1, 3); g.r(f === 1 ? 14 : 12, 29, 7, 1, 3);
}), 15));
XS.axe = outline(spr(14, 18, g => { g.r(6, 4, 2, 14, 13); g.e(9, 5, 5, 5, 8); g.r(4, 0, 4, 10, 8); g.e(11, 5, 2, 4, 3); }), 15);

// ---------------- backdrops ----------------
const BACKS = {
  nes(T) { // hills with dots, clouds that are bushes, bushes that are clouds
    for (const [sp, y0, c] of [[.15, 40, '#ffffff'], [.3, 150, '#24b624'], [.5, 196, '#49db24']]) {
      const cw = sp < .2 ? 120 : sp < .4 ? 160 : 90, off = camX * sp;
      for (let i = Math.floor(off / cw) - 1; i < Math.floor(off / cw) + W / cw + 2; i++) {
        const x = i * cw - off + hash(i * 3 + sp * 99) * 40, r = hash(i * 7 + sp * 50), yy = y0 - camY * sp * .3;
        if (sp < .2) { for (let k = 0; k < 3; k++) circF(x + k * 12, yy + r * 30 - (k === 1 ? 5 : 0), 9, hex(c)); }
        else if (sp < .4) { circF(x + 40, yy + 40, 30 + r * 26, hex(c)); for (const [dx, dy] of [[34, 10], [48, 22], [40, 30]]) rectF(x + dx, yy + dy, 3, 5, hex('#126d12')); }
        else for (let k = 0; k < 3; k++) circF(x + k * 10, yy, 8, hex(c));
      }
    }
  },
  cave() { for (let i = 0; i < 12; i++) { const x = ((i * 97 - camX * .2) % 400 + 400) % 400 - 40; rectF(x, 0, 6, H, hex('#0a0a20')); } },
  castle() {
    const off = camX * .3; for (let i = Math.floor(off / 64) - 1; i < Math.floor(off / 64) + 7; i++) { const x = i * 64 - off; rectF(x + 8, 40, 40, H, hex('#242424')); rectF(x + 18, 70, 20, 30, hex('#100808')); circF(x + 28, 70, 10, hex('#100808')); rectF(x + 20, 96, 16, 4, hex(((frame >> 3) + i) & 1 ? '#b62400' : '#922400')); }
  },
  smw() { // the hills have eyes. They always did
    const off = camX * .3; for (let i = Math.floor(off / 56) - 1; i < Math.floor(off / 56) + 8; i++) { const x = i * 56 - off, h = 60 + hash(i * 5) * 70, y = H - h - camY * .1;
      rectF(x, y, 40, H, hex(i & 1 ? '#49b66d' : '#6ddb92')); circF(x + 20, y, 20, hex(i & 1 ? '#49b66d' : '#6ddb92')); rectF(x + 12, y - 4, 4, 9, BLACK); rectF(x + 24, y - 4, 4, 9, BLACK); pset(x + 13, y - 3, WHITE); pset(x + 25, y - 3, WHITE); }
    for (let i = 0; i < 6; i++) { const x = ((i * 83 - camX * .1) % 380 + 380) % 380 - 30, y = 20 + (i * 37) % 50; circF(x, y, 9, WHITE); circF(x + 12, y - 4, 11, WHITE); circF(x + 24, y, 9, WHITE); rectF(x + 9, y - 6, 2, 4, BLACK); rectF(x + 15, y - 6, 2, 4, BLACK); }
  },
  ghost() { // boards, windows, a moon that is also watching
    const off = camX * .4; for (let i = Math.floor(off / 20) - 1; i < Math.floor(off / 20) + 18; i++) { const x = i * 20 - off; rectF(x, 0, 19, H, hex(i & 1 ? '#2a1438' : '#321844')); rectF(x + 19, 0, 1, H, hex('#120818')); }
    for (let i = Math.floor(off / 120) - 1; i < Math.floor(off / 120) + 4; i++) { const x = i * 120 - off + 40; rectF(x, 50, 30, 40, hex('#241049')); circF(x + 15, 66, 7, hex('#dbdb92')); rectF(x + 14, 50, 2, 40, hex('#120818')); rectF(x, 69, 30, 2, hex('#120818')); }
  },
  ghz() { // the checkered hills, the sea, palm trees. Blast processed
    const sea = 130 - camY * .1; rectF(0, sea, W, H, hex('#2449b6')); for (let i = 0; i < 14; i++) { const y = sea + 6 + i * 7; rectF(((i * 53 + frame * (i % 3 + 1) * .3) % 360) - 40, y, 30 + (i * 11) % 40, 1, hex('#92dbff')); }
    const off = camX * .25; for (let i = Math.floor(off / 90) - 1; i < Math.floor(off / 90) + 6; i++) { const x = i * 90 - off, h = 40 + hash(i) * 40; triF(x, sea, x + 45, sea - h, x + 90, sea, hex('#6d4900')); for (let y = sea - h + 8; y < sea; y += 8) rectF(x + 45 - (y - sea + h) / 2 + ((y >> 3) & 1) * 6, y, (y - sea + h) * .9, 2, hex('#924900')); rectF(x + 34, sea - h - 2, 22, 5, hex('#24b624')); }
    const o2 = camX * .5; for (let i = Math.floor(o2 / 140) - 1; i < Math.floor(o2 / 140) + 4; i++) { const x = i * 140 - o2 + 30, y = 150 - camY * .3; rectF(x, y, 4, 60, hex('#6d4924')); for (const d of [-1, 1]) { triF(x + 2, y, x + 2 + d * 22, y + 6, x + 2 + d * 10, y + 10, hex('#24b624')); triF(x + 2, y, x + 2 + d * 16, y - 8, x + 2 + d * 18, y - 2, hex('#49db24')); } }
  },
  casino() {
    const off = camX * .3; for (let i = Math.floor(off / 48) - 1; i < Math.floor(off / 48) + 9; i++) { const x = i * 48 - off, h = 80 + hash(i * 3) * 90; rectF(x, H - h, 40, h, hex('#241049'));
      for (let y = H - h + 8; y < H - 20; y += 10) for (let k = 0; k < 4; k++) if (((frame >> 4) + k + (y >> 3) + i) % 3 === 0) rectF(x + 5 + k * 9, y, 5, 4, hex(['#ff49db', '#ffdb24', '#24dbdb'][((i + k) % 3 + 3) % 3])); }
  },
  space() { for (let i = 0; i < 70; i++) { const x = ((hash(i) * 600 - camX * (.05 + (i % 3) * .05)) % 400 + 400) % 400 - 40, y = hash(i * 7 + 1) * H; pset(x, y, i % 5 ? hex('#929292') : WHITE); } circF(250 - camX * .02, 70, 36, hex('#2449b6')); circF(240 - camX * .02, 62, 14, hex('#24b624')); circF(262 - camX * .02, 84, 10, hex('#24b624')); },
  jungle() { // Angel Island, on fire, because someone left the lighter on
    const off = camX * .3; for (let i = Math.floor(off / 50) - 1; i < Math.floor(off / 50) + 9; i++) { const x = i * 50 - off; rectF(x + 20, 60, 8, H, hex('#6d3600')); for (let k = 0; k < 3; k++) triF(x + 24, 60 + k * 14, x - 6 + k * 3, 80 + k * 14, x + 54 - k * 3, 80 + k * 14, hex(k & 1 ? '#246d24' : '#249249')); }
    for (let i = 0; i < 8; i++) { const x = ((i * 61 - camX * .5) % 360 + 360) % 360 - 20, y = H - 30 - ((frame * (1 + i % 3) + i * 40) % 140); circF(x, y, 2 + (i & 1), hex(i & 2 ? '#ff9224' : '#ffdb24')); }
  },
  sky() { for (let i = 0; i < 8; i++) { const x = ((i * 71 - camX * (.1 + (i & 1) * .1)) % 400 + 400) % 400 - 40, y = 30 + (i * 43) % 150; circF(x, y, 12, WHITE); circF(x + 14, y + 3, 10, WHITE); circF(x - 12, y + 4, 8, WHITE); }
    const off = camX * .4; for (let i = Math.floor(off / 110) - 1; i < Math.floor(off / 110) + 5; i++) { const x = i * 110 - off; rectF(x + 30, 90, 14, H, hex('#dbdbff')); rectF(x + 26, 86, 22, 6, hex('#b6b6db')); rectF(x + 33, 90, 2, H, WHITE); } },
};

// ---------------- themes ----------------
const tpal = (dark, mid, light, trim, g1, g2, glow) => pal('#000000', dark, mid, light, trim, g1, g2, '#db2424', '#f8f0d8', '#c8b890', '#242424', glow);
Object.assign(XTHEMES, {
  smb: { P: tpal('#6d2400', '#b64900', '#ff9249', '#ffdb92', '#126d12', '#24b624', '#ffdb24'), sky: ['#6d92ff', '#6d92ff'], kind: 'nes', tile: 'brick', grass: false, far: '#24b624', mid: '#126d12', music: 'cbros' },
  smbu: { P: tpal('#002449', '#2470b6', '#6db6ff', '#92dbff', '#126d12', '#24b624', '#6dffff'), sky: ['#000000', '#000010'], kind: 'cave', tile: 'brick', grass: false, far: '#000010', mid: '#001024', music: 'cunder' },
  smbc: { P: tpal('#494949', '#929292', '#dbdbdb', '#ffffff', '#494949', '#929292', '#ff6d24'), sky: ['#000000', '#100000'], kind: 'castle', tile: 'stone', grass: false, far: '#100000', mid: '#240000', music: 'ccastle' },
  smw: { P: tpal('#924924', '#db9249', '#ffdb92', '#ffffff', '#126d12', '#49db24', '#ffff92'), sky: ['#6db6ff', '#dbffff'], kind: 'smw', grass: true, far: '#49b66d', mid: '#246d49', music: 'cworld' },
  ghost: { P: tpal('#241024', '#49246d', '#6d4992', '#b692db', '#241036', '#49246d', '#dbdb92'), sky: ['#100010', '#241036'], kind: 'ghost', grass: false, far: '#120818', mid: '#241036', music: 'cghost' },
  smwc: { P: tpal('#36244f', '#6d6d92', '#b6b6db', '#ffffff', '#36244f', '#6d6d92', '#ff6d24'), sky: ['#000000', '#120010'], kind: 'castle', tile: 'stone', grass: false, far: '#120010', mid: '#240024', music: 'ccastle' },
  ghz: { P: tpal('#6d3600', '#b66d24', '#ffb649', '#ffdb92', '#126d12', '#49b624', '#ffff92'), sky: ['#2449db', '#92dbff'], kind: 'ghz', tile: 'checker', grass: true, far: '#2449b6', mid: '#6d4900', music: 'chog' },
  ehz: { P: tpal('#493600', '#926d24', '#dbb649', '#ffdb92', '#126d36', '#24db49', '#ffff92'), sky: ['#2470db', '#b6dbff'], kind: 'ghz', tile: 'checker', grass: true, far: '#2449b6', mid: '#6d4900', music: 'chog' },
  casino: { P: tpal('#24246d', '#4949b6', '#9292ff', '#ffdb24', '#24246d', '#4949b6', '#ff49db'), sky: ['#100024', '#49246d'], kind: 'casino', grass: false, far: '#241049', mid: '#100024', music: 'chog2' },
  death: { P: tpal('#242436', '#49496d', '#9292b6', '#db2424', '#242436', '#49496d', '#ff2449'), sky: ['#000000', '#000010'], kind: 'space', grass: false, far: '#000010', mid: '#101024', music: 'space' },
  angel: { P: tpal('#6d3600', '#b66d24', '#ffb649', '#ffdb92', '#126d12', '#49b624', '#ffdb24'), sky: ['#ff6d24', '#ffdb92'], kind: 'jungle', grass: true, far: '#6d3600', mid: '#492400', music: 'cknux' },
  hydro: { P: tpal('#004949', '#249292', '#6ddbdb', '#dbffff', '#246d6d', '#49b6b6', '#6dffff'), sky: ['#2470b6', '#92dbff'], kind: 'hills', grass: false, far: '#2470b6', mid: '#246d92', music: 'lake' },
  sky: { P: tpal('#6d6d92', '#b6b6db', '#ffffff', '#ffdb24', '#6d6d92', '#b6b6db', '#ffdb24'), sky: ['#49b6ff', '#ffffff'], kind: 'sky', grass: false, far: '#dbdbff', mid: '#b6b6db', music: 'cknux' },
});

// ---------------- music: in the style of. Not the notes of ----------------
Object.assign(TRACKS, {
  cbros: { bpm: 176, ch: [
    { ins: 'pluck', vol: .9, n: 'G4 . C5 . E5 . C5 . D5 . F5 . A5 - G5 . E5 . C5 . G4 . A4 . B4 . C5 - - . A4 . C5 . F5 . E5 . D5 . C5 . A4 - G4 . E4 . G4 . C5 . B4 . D5 . C5 - - .' },
    { ins: 'bass', n: 'C3 . G2 . C3 . G2 . F2 . C3 . F2 . C3 . C3 . G2 . C3 . G2 . G2 . D3 . G2 . B2 . F2 . C3 . F2 . C3 . C3 . G2 . C3 . A2 . F2 . G2 . F2 . G2 . C3 . G2 . C3 . . .' },
    { drum: 1, vol: .5, n: 'k . h . s . h . k . h . s . h h' }] },
  cunder: { bpm: 112, ch: [
    { ins: 'pluck', n: 'D3 . . D3 F3 . D3 . G3 . F3 . D3 . . . C3 . . C3 E3 . C3 . F3 . E3 . C3 . . .' },
    { ins: 'bell', vol: .45, n: '. . . . . . . . A4 . . . . . . . . . . . . . . . G4 . . . . . . .' },
    { drum: 1, vol: .35, n: 'k . . . h . . . k . . . h . . h' }] },
  ccastle: { bpm: 96, ch: [
    { ins: 'organ', n: 'D4 D#4 D4 . A3 . . . D4 D#4 D4 . G#3 . . . D4 D#4 F4 . D#4 . D4 . C#4 . D4 . A3 - - -' },
    { ins: 'bass', n: 'D2 - - - - - - - D#2 - - - - - - - D2 - - - - - - - A1 - - - - - - -' },
    { drum: 1, vol: .4, n: 'k . . . . . . . s . . . . . k .' }] },
  cworld: { bpm: 132, ch: [
    { ins: 'lead', n: 'C5 - A4 . G4 - E4 . F4 . A4 . C5 - - . D5 - B4 . A4 - F#4 . G4 . B4 . D5 - - . E5 - C5 . A4 - G4 . A4 . C5 . F5 - E5 . D5 . B4 . G4 . A4 . B4 . C5 - - .' },
    { ins: 'bass', n: 'F2 . A2 . C3 . A2 . F2 . A2 . C3 . A2 . G2 . B2 . D3 . B2 . G2 . B2 . D3 . B2 . A2 . C3 . E3 . C3 . F2 . A2 . C3 . A2 . G2 . B2 . D3 . B2 . C3 . E3 . G3 . E3 .' },
    { ins: 'organ', vol: .35, n: '. A4 . A4 . A4 . A4 . B4 . B4 . B4 . B4' },
    { drum: 1, vol: .5, n: 'k . h k s . h . k . h k s . h h' }] },
  cghost: { bpm: 84, ch: [
    { ins: 'epiano', n: 'E4 . G4 . A#4 . G4 . E4 . . . D#4 . . . E4 . G4 . A#4 . B4 . A#4 . G4 . E4 . . .' },
    { ins: 'pad', vol: .5, n: 'E3 - - - - - - - D#3 - - - - - - - E3 - - - - - - - F3 - - - - - - -' }] },
  chog: { bpm: 158, ch: [
    { ins: 'brass', n: 'E5 - D5 - B4 - - - G4 - A4 - B4 - D5 - E5 - - - D5 - B4 - A4 - - - - - - - E5 - D5 - B4 - - - G4 - A4 - B4 - G5 - F#5 - - - E5 - D5 - E5 - - - - - - -' },
    { ins: 'slap', n: 'E2 E3 . E2 . E2 E3 . D2 D3 . D2 . D2 D3 . C2 C3 . C2 . C2 C3 . D2 D3 . D2 . D2 D3 .' },
    { ins: 'pluck', vol: .4, n: 'B4 . E5 . B4 . E5 . A4 . D5 . A4 . D5 .' },
    { drum: 1, n: 'k . h . s . h k . k h . s . h .' }] },
  chog2: { bpm: 148, ch: [
    { ins: 'sax', n: 'G4 . A#4 . C5 . D#5 - D5 . C5 . A#4 . G4 - F4 . G4 . A#4 . C5 - - - - - - - . . G4 . A#4 . C5 . D#5 - F5 . D#5 . D5 . C5 - A#4 . C5 . D5 . C5 - - - - - - - . .' },
    { ins: 'bass', n: 'C2 . E2 . G2 . A2 . A#2 . A2 . G2 . E2 . F2 . A2 . C3 . D3 . D#3 . D3 . C3 . A2 .' },
    { ins: 'epiano', vol: .35, n: '. . D#4 . . . D#4 . . . D#4 . . . D#4 .' },
    { drum: 1, vol: .6, n: 'k . h h s . h . k . h h s . h o' }] },
  cknux: { bpm: 96, ch: [
    { ins: 'slap', n: 'A1 . . A1 . . C2 . D2 . . D2 . . C2 . A1 . . A1 . . C2 . E2 . D2 . C2 . G1 .' },
    { ins: 'guitar', vol: .5, n: '. . A3 . . . . . . . D4 . . . C4 . . . A3 . . . . . E4 . D4 . C4 . . .' },
    { ins: 'brass', vol: .6, n: 'E5 - - - D5 - C5 - A4 - - - - - - - E5 - - - G5 - E5 - D5 - - - - - - -' },
    { drum: 1, n: 'k . . k s . . k . k . . s . . h' }] },
});
