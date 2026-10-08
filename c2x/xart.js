'use strict';
// ================= CARL 2 EXTREME: art =================
// side-view Carl (same head as CARL 2, now with legs that do things), outfits, enemies, bosses, Linda, tiles.
const XS = {}, XP = {};

// ---------------- outfits: palette overrides on CP.carl + one accessory ----------------
// CP.carl: 1 outline 2 skin 3 shade 4 hi 5 cap 6 cap hi 7 eye 8 pupil 9 white 10 hoodie 11 gold 12 tie 13 shoe 14 mouth (15: accessory)
const OUTFITS = [
  { id: 'classic', name: 'CLASSIC', blurb: 'THE ONE ON THE BOX', c: {} },
  { id: 'extreme', name: 'EXTREME', blurb: 'NOW WITH ATTITUDE', c: { 5: '#db2424', 6: '#ff6d24', 10: '#ff6d00', 13: '#242424', 15: '#101010' }, acc: 'shades' },
  { id: 'plumber', name: 'PLUMBER', blurb: 'FOR NINTENDO FANS', c: { 5: '#db2424', 6: '#ff4949', 10: '#2449db', 13: '#6d4924', 15: '#242424' }, acc: 'stache' },
  { id: 'hog', name: 'HEDGEHOG', blurb: 'FOR THE OTHER GUYS', c: { 5: '#2449db', 6: '#4970ff', 10: '#2449db', 13: '#db2424', 15: '#2449db' }, acc: 'quills' },
  { id: 'scuba', name: 'SCUBA', blurb: 'WATER LEVEL READY', c: { 5: '#ffdb24', 6: '#ffff92', 10: '#101024', 13: '#ffdb24', 15: '#6dffff' }, acc: 'goggles' },
  { id: 'legacy', name: 'LEGACY', blurb: 'FOUR SHADES. NO NOTES.', legacy: 1, c: {} },
  { id: 'tux', name: 'TUXEDO', blurb: 'FOR THE RESCUE PHOTOS', c: { 10: '#101010', 13: '#101010', 15: '#101010' }, acc: 'tophat' },
];
function outfitPal(o) {
  const P = CP.carl.slice(); P[15] = hex('#101010');
  for (const k in o.c) P[k] = hex(o.c[k]);
  return o.legacy ? legacyPal(P, 'dmg') : P;
}

// ---------------- side-view Carl, 20x26 ----------------
// pose: stand run jump fall throw hook hang swim hurt flame. f = run frame 0..3
function carlSide(pose, f = 0, acc) {
  return outline(spr(20, 26, g => {
    const ox = 2, oy = 2;
    // legs
    const leg = (x, len, fx) => { g.r(ox + x, oy + 19, 2, len, 10); g.r(ox + x + (fx || 0), oy + 19 + len, 3, 1, 13); };
    if (pose === 'run') { const L = [[0, 3, 2], [1, 2, 2], [2, 0, 2], [1, 1, 2]][f & 3]; leg(5 + L[0], 3, 0); leg(9 - L[0], 2 + (f & 1), 1); }
    else if (pose === 'jump' || pose === 'hook') { leg(5, 2, 0); g.r(ox + 9, oy + 18, 3, 2, 10); g.r(ox + 11, oy + 19, 2, 1, 13); }
    else if (pose === 'fall' || pose === 'hurt') { leg(4, 3, -1); leg(10, 3, 1); }
    else if (pose === 'hang') { leg(6, 3, 0); leg(9, 4, 0); }
    else if (pose === 'swim') { const k = f & 1; g.r(ox + 2 - k, oy + 19, 6, 2, 10); g.r(ox - k, oy + 19, 2, 2, 13); g.r(ox + 8, oy + 20 + k, 4, 2, 10); }
    else { leg(6, 3, 0); leg(9, 3, 0); }
    // body: hoodie, bow tie, gold trim
    g.r(ox + 6, oy + 14, 5, 6, 10); g.r(ox + 7, oy + 15, 1, 5, 11); g.r(ox + 8, oy + 14, 3, 2, 12); g.p(ox + 9, oy + 14, 11);
    // arm
    if (pose === 'throw' || pose === 'flame') { g.r(ox + 10, oy + 14, 5, 2, 10); g.r(ox + 15, oy + 14, 2, 2, 2); }
    else if (pose === 'hook' || pose === 'hang') { /* raised arm: drawn over the head, below */ }
    else if (pose === 'jump') { g.r(ox + 10, oy + 12, 2, 3, 10); g.p(ox + 11, oy + 11, 2); }
    else if (pose === 'hurt') { g.r(ox + 3, oy + 12, 2, 3, 10); g.r(ox + 11, oy + 12, 2, 3, 10); }
    else { const sw = pose === 'run' ? [0, 1, 0, -1][f & 3] : 0; g.r(ox + 8 + sw, oy + 15, 2, 3, 10); g.p(ox + 9 + sw, oy + 18, 2); }
    // head (from CARL 2's side sprite): big head, backwards cap, huge eye
    g.e(ox + 8.5, oy + 8.5, 6.6, 6.6, 2); g.each((x, y) => g.get(x, y) === 2 && (x < ox + 5 || y > oy + 12) ? 3 : 0); g.p(ox + 12, oy + 5, 4); g.p(ox + 13, oy + 6, 4);
    if (acc === 'tophat') { g.r(ox + 3, oy + 3, 11, 2, 15); g.r(ox + 5, oy - 2, 7, 5, 15); g.r(ox + 5, oy + 1, 7, 1, 12); }
    else { g.e(ox + 7.5, oy + 4.6, 6, 3.6, 5); g.r(ox + 1.5, oy + 4, 12, 2, 5); g.r(ox, oy + 5, 4, 2, 5); g.r(ox, oy + 5, 3, 1, 6); g.r(ox + 6, oy + 2, 3, 1, 6); }
    if (acc === 'quills') for (let i = 0; i < 3; i++) { g.line(ox + 2, oy + 6 + i * 3, ox - 2, oy + 7 + i * 3, 15); g.line(ox + 2, oy + 7 + i * 3, ox - 1, oy + 8 + i * 3, 15); }
    const hurtEye = pose === 'hurt';
    if (acc === 'shades') { g.r(ox + 9, oy + 8, 6, 3, 15); g.r(ox + 6, oy + 8, 3, 1, 15); g.p(ox + 10, oy + 8, 9); }
    else { g.e(ox + 12, oy + 9.5, 2.3, 2.7, 7); if (hurtEye) { g.p(ox + 11, oy + 9, 8); g.p(ox + 13, oy + 10, 8); g.p(ox + 12, oy + 10, 8); } else { g.p(ox + 13, oy + 10, 8); g.p(ox + 12, oy + 10, 8); g.p(ox + 11, oy + 8, 9); } }
    if (acc === 'goggles') { g.r(ox + 9, oy + 7, 6, 5, 15); g.r(ox + 10, oy + 8, 4, 3, 7); g.p(ox + 11, oy + 8, 9); g.r(ox + 4, oy + 8, 5, 1, 15); }
    if (pose === 'hook' || pose === 'hang') { g.r(ox + 15, oy + 1, 2, 14, 10); g.r(ox + 15, oy - 1, 2, 2, 2); g.r(ox - 1, oy + 2, 2, 13, 10); g.r(ox - 1, oy, 2, 2, 2); }
    if (acc === 'stache') { g.r(ox + 11, oy + 12, 4, 1, 15); g.p(ox + 15, oy + 13, 15); }
    else g.p(ox + 14, oy + 13, 14);
  }), 1);
}
const POSES = ['stand', 'run', 'jump', 'fall', 'throw', 'hook', 'hang', 'swim', 'hurt', 'flame'];
const CARLSET = {};
function carlSet(o) { // sprites per outfit, built on first use
  if (CARLSET[o.id]) return CARLSET[o.id];
  const S = { P: outfitPal(o) };
  for (const p of POSES) S[p] = [0, 1, 2, 3].map(f => carlSide(p, f, o.acc));
  return CARLSET[o.id] = S;
}

// ---------------- the bong (thrown / hookshot head / snorkel) ----------------
// 1 outline 2 glass 3 glass shade 4 water 5 bowl 6 shine 7 steel 8 flame mid 9 flame outer 10 flame core 11 dark steel
XP.bong = pal('#000000', '#92dbff', '#49b6db', '#2470db', '#6d4924', '#ffffff', '#b6b6b6', '#ffb600', '#ff4900', '#ffff92', '#6d6d6d');
const rotSpr = (s, r) => spr(r & 1 ? s.h : s.w, r & 1 ? s.w : s.h, g => { for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) { const c = s.d[y * s.w + x]; if (c) g.p(...[[x, y], [s.h - 1 - y, x], [s.w - 1 - x, s.h - 1 - y], [y, s.w - 1 - x]][r], c); } });
XS.bongUp = bongShape('MINI');
XS.bong = [0, 1, 2, 3].map(r => rotSpr(XS.bongUp, r));
XS.ring = outline(spr(12, 12, g => { g.e(6, 6, 5, 5, 7); g.e(6, 6, 3, 3, 0); g.r(5, 0, 2, 2, 11); g.p(4, 2, 6); }), 1);
XS.flame = [0, 1, 2].map(f => spr(10, 10, g => { g.e(5, 6, 4 - f * .6, 3.5 - f * .5, 9); g.e(5, 6.5, 2.5 - f * .4, 2.2 - f * .3, 8); g.e(5, 7, 1.2, 1, 10); }));
XS.bubble = [spr(6, 6, g => { g.e(3, 3, 2.6, 2.6, 2); g.e(3, 3, 1.6, 1.6, 0); g.p(2, 2, 6); }), spr(4, 4, g => { g.e(2, 2, 1.8, 1.8, 2); g.p(1, 1, 6); })];

// ---------------- pickups ----------------
// these sprites number colors from 0 (= the first color listed); index 15 is the black outline
const pal0 = (...hs) => { const P = pal(...hs); P[15] = hex('#000000'); return P; };
XP.items = pal0('#ffdb24', '#db9224', '#ffff92', '#6dff24', '#249224', '#ffffff', '#db2424', '#b67a49', '#ffdb92', '#6d4924', '#ff92db', '#2449db');
XS.bux = [0, 1, 2, 3].map(f => outline(spr(10, 10, g => { const w = [4, 3, 1, 3][f]; g.e(5, 5, w, 4, 4); g.e(5, 5, Math.max(.5, w - 1), 3, 5); if (w > 2) { g.r(4, 3, 3, 1, 3); g.r(4, 5, 2, 1, 3); g.r(5, 6, 2, 1, 3); g.r(4, 7, 3, 1, 3); } }), 15));
XS.pretzel = outline(spr(14, 12, g => { g.e(7, 6, 6, 5, 8); g.e(4.5, 5, 2, 2, 0); g.e(9.5, 5, 2, 2, 0); g.r(6, 7, 2, 4, 0); for (const [x, y] of [[3, 2], [10, 3], [6, 9], [11, 7]]) g.p(x, y, 6); }), 15);
XS.box = [0, 1].map(f => outline(spr(16, 16, g => { g.r(0, 2, 16, 14, 11); g.r(0, 2, 16, 3, 7); g.r(7, 2, 2, 14, 7); g.r(2, 7, 4, 1, 6); if (f) { g.r(3, 0, 4, 2, 1); g.r(9, 0, 4, 2, 1); } }), 15));
// the checkpoint: a big bong on a crate. walk past it and Carl lights it
XS.post = [0, 1].map(lit => outline(spr(16, 32, g => {
  g.r(1, 24, 14, 8, 8); g.r(1, 24, 14, 2, 9); g.r(3, 27, 10, 1, 10);
  g.r(6, 4, 4, 16, 6); g.r(7, 4, 1, 16, 3); g.e(8, 19, 6, 4.5, 6); g.r(3, 19, 10, 3, 12); g.line(10, 16, 14, 12, 6); g.r(13, 10, 3, 2, 10);
  if (lit) { g.e(14.5, 7, 1.6, 2.6, 7); g.p(14, 8, 1); }
}), 15));
XS.goal = [0, 1].map(f => outline(spr(32, 40, g => { // the Prop Pills drop box: deliver yourself
  g.r(14, 20, 4, 20, 10); g.r(4, 4, 24, 18, 12); g.r(5, 5, 22, 16, 6); g.r(8, 9, 16, 2, 7); g.r(8, 13, 10, 2, 12); g.e(16, 4, 12, 4, 12); g.r(26, 6, 2, 8, f ? 7 : 1); g.r(26, 6, 5, 3, f ? 7 : 1);
}), 15));

// ---------------- enemies ----------------
XP.foe = pal0('#ffffff', '#dbdbdb', '#b6b6b6', '#101010', '#ffdb24', '#db9200', '#242424', '#db2424', '#6dffff', '#f8f0d8', '#c8b890', '#6d6d6d', '#2449db', '#dbb692');
// committee goon: a white suit, side view
XS.goon = [0, 1].map(f => outline(spr(16, 24, g => {
  g.r(5, 17, 3, 6 - f, 2); g.r(9, 17, 3, 5 + f, 3); g.r(4, 22 - f, 4, 2, 12); g.r(9, 21 + f, 4, 2, 12);
  g.r(4, 9, 9, 9, 1); g.r(10, 9, 3, 9, 2); g.r(8, 9, 1, 6, 8); g.r(6, 11, 2, 5, 2);
  g.e(8, 4.5, 5, 5, 1); g.r(8, 3, 6, 3, 4); g.p(12, 4, 9);
}), 15));
// mall cop: two hits, has a hat
XS.cop = [0, 1].map(f => outline(spr(16, 26, g => {
  g.r(5, 19, 3, 6 - f, 7); g.r(9, 19, 3, 5 + f, 7); g.r(4, 24 - f, 4, 2, 4); g.r(9, 23 + f, 4, 2, 4);
  g.r(4, 11, 9, 9, 13); g.r(10, 11, 3, 9, 7); g.p(6, 13, 5); g.r(4, 18, 9, 1, 4);
  g.e(9, 7, 4.5, 4.5, 14); g.r(5, 2, 9, 3, 13); g.r(4, 4, 11, 1, 13); g.p(11, 6, 4); g.r(10, 9, 4, 1, 7);
}), 15));
// the spelling bee: hops, buzzes, is spelled wrong on purpose
XS.bee = [0, 1].map(f => outline(spr(16, 14, g => {
  g.e(8, 9, 6, 4, 5); for (const x of [5, 8, 11]) g.r(x, 6, 1, 7, 4); g.e(13, 8, 2.5, 2.5, 4); g.p(14, 7, 1);
  g.e(6, 3 + f, 3, 2, 9); g.e(10, 3 - f, 3, 2, 9); g.line(1, 9, 3, 9, 4);
}), 15));
// typo: a letter with bat wings
function typoSprite(ch, f) {
  return outline(spr(20, 14, g => {
    g.r(6, 2, 8, 10, 10); g.r(6, 11, 8, 1, 11);
    const gl = FONT[ch]; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j] & (16 >> i)) g.p(7 + i, 3 + j, 8);
    if (f) { g.line(0, 2, 5, 6, 7); g.line(1, 4, 5, 7, 7); g.line(19, 2, 14, 6, 7); g.line(18, 4, 14, 7, 7); }
    else { g.line(0, 10, 5, 6, 7); g.line(1, 9, 5, 7, 7); g.line(19, 10, 14, 6, 7); g.line(18, 9, 14, 7, 7); }
  }), 15);
}
XS.typo = {}; for (const ch of 'QXZJKV') XS.typo[ch] = [typoSprite(ch, 0), typoSprite(ch, 1)];
// TERMS & CONDITIONS: a scroll on a stand that fires paragraphs
XS.terms = [0, 1].map(f => outline(spr(16, 28, g => {
  g.r(6, 20, 4, 8, 12); g.r(2, 26, 12, 2, 12);
  g.r(1, 0, 14, 21, 10); g.r(0, 0, 16, 3, 11); g.r(0, 18, 16, 3, 11);
  for (let y = 5; y < 17; y += 2) g.r(3, y, (y * 7) % 5 + 6, 1, 12);
  g.e(11, 10, 2, 2, f ? 8 : 4); g.e(5, 10, 2, 2, f ? 8 : 4);
}), 15));
XS.para = outline(spr(14, 10, g => { g.r(0, 0, 14, 10, 10); for (let y = 2; y < 9; y += 2) g.r(2, y, 10 - (y & 2) * 2, 1, 12); }), 15);
// underwater: a fish that reads (it has glasses) and a jelly
XP.sea = pal0('#ff9224', '#db6d00', '#ffffff', '#101010', '#ff92ff', '#db49db', '#ffdbff', '#6dffff', '#b6b6b6', '#246d92');
XS.fish = [0, 1].map(f => outline(spr(18, 12, g => { g.e(9, 6, 7, 4.5, 1); g.e(9, 8, 6, 2.5, 2); g.line(1, 2 + f, 3, 6, 1); g.line(1, 10 - f, 3, 6, 1); g.r(0, 2 + f, 2, 8 - f * 2, 1); g.e(13, 5, 2, 2, 3); g.p(14, 5, 4); g.r(11, 4, 5, 1, 4); g.p(16, 7, 4); }), 15));
XS.jelly = [0, 1].map(f => outline(spr(16, 20, g => { g.e(8, 6, 7, 5.5, 5); g.r(1, 6, 14, 3, 5); g.e(8, 5, 5, 3, 7); g.p(5, 4, 3); for (let i = 0; i < 4; i++) g.line(3 + i * 3, 9, 3 + i * 3 + ((i + f) & 1 ? 1 : -1), 19, 6); }), 15));

// ---------------- bosses ----------------
// ROBO MALL COP (side): 32x40
XP.robo = pal0('#b6b6db', '#6d6d92', '#24248f', '#4970b6', '#ffdb24', '#db2424', '#101010', '#ffffff', '#494949', '#6dffff');
XS.robo = [0, 1, 2].map(f => outline(spr(32, 40, g => {
  const st = f === 1 ? 2 : 0;
  g.r(9, 28, 6, 11 - st, 2); g.r(17, 28, 6, 9 + st, 9); g.r(8, 37 - st, 8, 3, 7); g.r(16, 35 + st, 9, 3, 7);
  g.r(6, 13, 20, 16, 4); g.r(18, 13, 8, 16, 3); g.r(9, 16, 4, 3, 5); g.r(6, 26, 20, 2, 7);
  g.r(14, 3, 14, 11, 1); g.r(14, 3, 3, 11, 2); g.r(11, 0, 18, 4, 3); g.r(10, 3, 20, 1, 3); g.r(20, 6, 6, 3, f === 2 ? 6 : 10); g.r(21, 10, 6, 1, 7);
  if (f === 2) { g.r(24, 16, 8, 4, 2); g.r(29, 14, 3, 8, 6); } else { g.r(20, 16, 4, 10, 2); g.r(21, 26, 3, 2, 1); }
}), 15));
// MOBY DICK (UNABRIDGED): a whale made of a very long book. 80x40
XP.moby = pal0('#dbdbdb', '#b6b6b6', '#929292', '#f8f0d8', '#c8b890', '#242424', '#db2424', '#ffffff', '#6d6d6d', '#6d2424');
XS.moby = [0, 1].map(open => outline(spr(80, 42, g => {
  g.e(40, 20, 38, 17, 1); g.e(42, 26, 34, 10, 2); g.r(2, 18, 10, 8, 1);
  g.line(2, 12, 0, 4, 1); g.line(4, 12, 6, 2, 1); g.r(0, 2, 8, 4, 2); // tail flukes
  for (let x = 14; x < 64; x += 5) g.r(x, 8, 1, 22, 3); // page edges along the flank
  g.r(30, 30, 18, 6, 5); g.r(31, 31, 16, 4, 4); // a fin that is a book
  g.e(66, 14, 3, 3, 8); g.e(67, 14, 1.5, 2, 6);
  if (open) { g.r(56, 22, 24, 12, 10); for (let x = 58; x < 78; x += 4) { g.r(x, 22, 2, 3, 8); g.r(x + 2, 31, 2, 3, 8); } }
  else { g.line(54, 26, 78, 24, 6); g.line(54, 27, 78, 25, 9); }
  g.r(30, 0, 2, 4, 9); g.r(26, 0, 10, 1, 3);
}), 15));
// DYSLEXIO: all the words they cut from CARL 2, wearing a robe of the script. 40x52
XP.dys = pal0('#f8f0d8', '#c8b890', '#8f7a5a', '#242424', '#6d2449', '#b6246d', '#ffdb24', '#6dffff', '#ffffff', '#db2424', '#49246d', '#9249db');
XS.dys = [0, 1, 2].map(f => outline(spr(40, 54, g => {
  // robe of manuscript pages
  g.each((x, y) => y > 18 && Math.abs(x - 20) < 6 + (y - 18) * .38 ? (y > 50 - (x * 3 + f * 2) % 4 ? 0 : 1) : 0);
  for (let y = 22; y < 50; y += 3) g.r(20 - (y - 18) * .3, y, (y - 18) * .6, 1, 2);
  g.r(19, 19, 2, 30, 5);
  // sleeves + hands; f2 = casting
  if (f === 2) { g.line(12, 24, 2, 12, 11); g.line(28, 24, 38, 12, 11); g.e(2, 11, 2, 2, 2); g.e(38, 11, 2, 2, 2); }
  else { g.line(13, 24, 8, 34 + f, 11); g.line(27, 24, 32, 34 - f, 11); g.e(8, 35 + f, 2, 2, 2); g.e(32, 35 - f, 2, 2, 2); }
  // head: an ink-blot face with huge reading glasses
  g.e(20, 13, 8, 8, 4); g.e(20, 13, 7, 7, 11);
  g.e(16, 13, 3.5, 3, 9); g.e(24, 13, 3.5, 3, 9); g.e(16, 13, 2.5, 2, 8); g.e(24, 13, 2.5, 2, 8); g.r(19, 12, 2, 1, 9);
  g.p(16 + f % 2, 13, 4); g.p(24 - f % 2, 13, 4); g.r(17, 18, 6, 1, 10);
  // crown of loose letters
  for (let i = 0; i < 5; i++) { const x = 11 + i * 4, y = 2 + ((i + f) % 3); g.r(x, y, 3, 4, 7); g.p(x + 1, y + 1, 4); }
  // the quill
  g.line(33, 8, 37, 0, 12); g.line(34, 8, 38, 1, 12); g.line(32, 10, 33, 8, 4);
}), 15));
XS.letterShot = {}; for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') XS.letterShot[ch] = outline(spr(9, 11, g => { g.r(0, 0, 9, 11, 1); const gl = FONT[ch]; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j] & (16 >> i)) g.p(2 + i, 2 + j, 4); }), 10);

// ---------------- CEO LINDA, side view, 18x30, and her cage ----------------
XP.linda = pal0('#ffdbdb', '#db9292', '#ff6db6', '#ffb6db', '#b62492', '#ffffff', '#ff49b6', '#242424', '#494949', '#6d2449', '#ffdb24', '#b6b6b6', '#6d6d6d');
XS.linda = [0, 1].map(f => outline(spr(18, 30, g => {
  g.r(6, 24, 3, 5, 8); g.r(10, 24, 3, 5, 8); g.r(5, 28, 4, 2, 8); g.r(10, 28, 4, 2, 8);
  g.r(4, 19, 11, 6, 9); g.r(4, 23, 11, 2, 8);
  g.r(5, 12, 9, 8, 6); for (let y = 13; y < 20; y += 2) g.r(5, y, 9, 1, 3); g.r(8, 12, 3, 2, 7); g.p(9, 14, 7);
  if (f) { g.line(4, 13, 1, 8, 6); g.line(14, 13, 17, 8, 6); g.p(1, 7, 1); g.p(17, 7, 1); } else { g.r(3, 13, 2, 6, 6); g.r(14, 13, 2, 6, 6); }
  g.e(10, 7, 4.5, 5, 1); g.r(10, 8, 5, 3, 2);
  g.e(9, 3, 6, 4, 4); g.e(6, 6, 3, 5, 4); g.e(12, 1, 4, 2, 4); g.line(5, 2, 11, 0, 5); g.p(4, 8, 5);
  g.r(11, 6, 3, 1, 5); g.p(12, 7, 8); g.r(12, 10, 2, 1, 10);
}), 15));
XS.cage = outline(spr(28, 40, g => { g.r(0, 4, 28, 3, 13); g.r(0, 37, 28, 3, 13); for (let x = 0; x < 28; x += 5) g.r(x, 4, 2, 36, 12); g.r(12, 0, 4, 4, 13); g.r(11, 20, 6, 5, 11); }), 15);

// ---------------- tiles, per theme ----------------
// '#' solid, '=' one-way, '^' spikes, 'W' a wall of text (the lighter burns it), 'o' hook ring (drawn as a sprite)
const XTHEMES = {
  lot: { P: pal('#000000', '#494949', '#6d6d6d', '#929292', '#dbdb24', '#246d24', '#49b624', '#db2424', '#f8f0d8', '#c8b890', '#242424', '#6dffff'), sky: ['#2449b6', '#ff926d'], far: '#6d4992', mid: '#492449', kind: 'city', music: 'lot' },
  mall: { P: pal('#000000', '#6d2470', '#9249a0', '#db92db', '#ffdb24', '#24b6b6', '#6dffff', '#db2424', '#f8f0d8', '#c8b890', '#242449', '#ffffff'), sky: ['#241049', '#9249a0'], far: '#49246d', mid: '#6d3692', kind: 'mall', music: 'mall' },
  canyon: { P: pal('#000000', '#924924', '#db6d24', '#ffb649', '#ffdb92', '#6d4924', '#b69249', '#db2424', '#f8f0d8', '#c8b890', '#492410', '#ffff92'), sky: ['#ff6d24', '#ffdb92'], far: '#db6d49', mid: '#b64924', kind: 'mesa', music: 'desert' },
  lake: { P: pal('#000000', '#246d6d', '#49926d', '#92db92', '#ffdb24', '#246d24', '#49b624', '#db2424', '#f8f0d8', '#c8b890', '#004949', '#6dffff'), sky: ['#49b6ff', '#dbffff'], far: '#6d92b6', mid: '#497092', kind: 'hills', music: 'lake' },
  keep: { P: pal('#000000', '#49246d', '#6d4992', '#b692db', '#ffdb24', '#6d2449', '#b6246d', '#db2424', '#f8f0d8', '#c8b890', '#241036', '#ff92ff'), sky: ['#100820', '#49246d'], far: '#241036', mid: '#36184f', kind: 'shelves', music: 'xover' },
};
// theme palette: 1 black 2 dark 3 mid 4 light 5 trim 6 grass dark 7 grass 8 red 9 paper 10 paper shade 11 ink 12 glow
function themeTiles(T) {
  const bevel = g => { g.r(0, 0, 16, 16, 3); g.r(0, 0, 16, 1, 4); g.r(0, 0, 1, 16, 4); g.r(0, 15, 16, 1, 2); g.r(15, 0, 1, 16, 2); };
  const grass = T.kind === 'city' || T.kind === 'hills';
  return {
    '#': spr(16, 16, g => { bevel(g); g.r(4, 4, 3, 2, 4); g.r(10, 9, 3, 2, 2); g.p(12, 4, 4); g.p(3, 11, 2); }),
    '#top': spr(16, 16, g => { bevel(g); g.r(10, 9, 3, 2, 2); if (grass) { g.r(0, 0, 16, 4, 7); g.r(0, 4, 16, 1, 6); for (let x = 1; x < 16; x += 4) g.p(x, 5, 6); } else { g.r(0, 0, 16, 3, 5); g.r(0, 3, 16, 1, 2); } }),
    '=': spr(16, 16, g => { g.r(0, 0, 16, 5, 3); g.r(0, 5, 16, 1, 1); g.r(0, 0, 16, 1, 5); g.r(2, 6, 2, 3, 2); g.r(12, 6, 2, 3, 2); }),
    '^': spr(16, 16, g => { for (let i = 0; i < 4; i++) { g.line(i * 4, 15, i * 4 + 2, 6, 4); g.line(i * 4 + 2, 6, i * 4 + 4, 15, 3); g.line(i * 4 + 2, 7, i * 4 + 2, 15, 2); } g.r(0, 15, 16, 1, 1); }),
    'W': spr(16, 16, g => { g.r(0, 0, 16, 16, 9); g.r(0, 15, 16, 1, 10); g.r(15, 0, 1, 16, 10); for (let y = 2; y < 15; y += 2) g.r(1 + (y % 4), y, 9 + (y * 5) % 5, 1, 11); }),
    'w': [0, 1].map(f => spr(16, 16, g => { g.r(0, 0, 16, 16, 11); for (let i = 0; i < 6; i++) g.e(2 + ((i * 5 + f * 3) % 13), 4 + ((i * 7) % 11), 2.5, 3, i & 1 ? 8 : 5); })),
  };
}
// a fake "WALL OF TEXT" paragraph: these are the bits they cut. Read one if you want. You won't.
const CUT_TEXT = 'IN THE ORIGINAL VERSION THIS PART HAD A NINE PAGE CONVERSATION ABOUT THE PARKING LOT AND WHAT A PARKING LOT MEANS TO A MAN WHO LIVES IN ONE AND ALSO THE TAPES AND THE PARENTS AND ';
