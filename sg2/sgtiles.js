'use strict';
// ================= SPOOKY GHOST 2: neon tilesets. one palette + a few pattern choices per set =================
// palette: 1 void 2 floorA 3 floorB 4 wall face 5 wall top 6 neon pink 7 neon cyan 8 neon yellow 9 black 10 white 11 wood 12 wood dark 13 metal 14 metal dark 15 green
// map legend (shared by every set): . , floors  # wall  W cracked wall (phase through it)  p pillar  T screens  t plant  o mannequin  _ counter  = speakers  * arcade / neon sign
//   > < conveyor  L laser (on a clock)  S sigil door  x invisible solid  c car
const SOLID = new Set('#WpTto_=*xSc'.split(''));
const TH = {
  mall:    { pal: ['#000024', '#24246d', '#49246d', '#6d2492', '#b649db', '#ff24db', '#24dbff', '#ffff49', '#000000', '#ffffff', '#b6926d', '#6d4924', '#b6b6db', '#49496d', '#24b66d'], floor: 'check', wall: 'neon' },
  studio:  { pal: ['#000024', '#000024', '#240049', '#24006d', '#6d24b6', '#ff24db', '#24dbff', '#ffdb24', '#000000', '#ffffff', '#926d49', '#492424', '#6d6d92', '#242449', '#24b66d'], floor: 'grid', wall: 'tv' },
  green:   { pal: ['#000024', '#6d2492', '#49246d', '#24246d', '#6d49b6', '#ff24db', '#24dbff', '#ffff49', '#000000', '#ffffff', '#db9249', '#926d24', '#b6b6db', '#6d6d92', '#49db49'], floor: 'memphis', wall: 'mirror' },
  control: { pal: ['#000024', '#002449', '#00496d', '#24496d', '#49b6db', '#ff24db', '#24ffdb', '#ffdb24', '#000000', '#ffffff', '#6d6d92', '#494992', '#92b6db', '#24496d', '#24db49'], floor: 'plate', wall: 'tv' },
  shop:    { pal: ['#240024', '#ff6db6', '#db4992', '#92246d', '#ffdbdb', '#ff24db', '#24dbff', '#ffff24', '#000000', '#ffffff', '#db9249', '#926d24', '#dbdbdb', '#9292b6', '#24db49'], floor: 'stripe', wall: 'panel' },
  court:   { pal: ['#240000', '#b66d24', '#6d4924', '#6d2424', '#db9249', '#ff2449', '#ffdb24', '#ffdb24', '#000000', '#ffffff', '#b66d24', '#6d3a24', '#b6b6b6', '#6d6d6d', '#499249'], floor: 'wood', wall: 'panel' },
  road:    { pal: ['#000024', '#242449', '#24246d', '#49496d', '#6d6d92', '#ff4949', '#24dbff', '#ffdb49', '#000000', '#ffffff', '#926d49', '#6d4924', '#b6b6b6', '#494949', '#246d24'], floor: 'asphalt', wall: 'curtain' },
  dept:    { pal: ['#000024', '#24246d', '#49246d', '#6d2492', '#b66ddb', '#ff24db', '#24dbff', '#ffdb24', '#000000', '#ffffff', '#b6926d', '#6d4924', '#b6b6db', '#494992', '#24b66d'], floor: 'check', wall: 'neon' },
};
const tileCache = {};
function floorTile(kind, v, x, y) {
  return spr(16, 16, g => {
    const A = v ? 3 : 2, B = v ? 2 : 3;
    if (kind === 'check') { for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) g.p(i, j, ((i >> 3) + (j >> 3)) & 1 ? A : B); g.r(0, 0, 16, 1, v ? 6 : 7); g.r(0, 0, 1, 16, v ? 6 : 7); }
    if (kind === 'grid') { g.r(0, 0, 16, 16, A); g.r(0, 0, 16, 1, 7); g.r(0, 0, 1, 16, 7); if (v) { g.r(7, 7, 2, 2, 6); } }
    if (kind === 'memphis') { g.r(0, 0, 16, 16, A); const h = hash2(x, y), c = [6, 7, 8][(h * 3) | 0]; g.r(((h * 97) % 11) | 0, ((h * 61) % 11) | 0, 3, 1, c); g.p(2 + ((h * 53) % 11 | 0), 3 + ((h * 29) % 9 | 0), 10); if (v) { g.line(2, 12, 6, 14, 7); g.line(6, 14, 10, 12, 7); } }
    if (kind === 'plate') { g.r(0, 0, 16, 16, A); g.r(0, 0, 16, 1, 13); g.r(0, 0, 1, 16, 13); g.p(2, 2, 14); g.p(13, 2, 14); g.p(2, 13, 14); g.p(13, 13, 14); if (v) g.r(0, 8, 16, 1, 7); }
    if (kind === 'stripe') { for (let j = 0; j < 16; j++) g.r(0, j, 16, 1, (j >> 2) & 1 ? A : B); g.r(0, 0, 16, 1, 10); }
    if (kind === 'wood') { for (let j = 0; j < 16; j++) g.r(0, j, 16, 1, (j & 7) === 7 ? 3 : A); g.r(((hash2(x, y) * 13) | 0), 0, 1, 8, 3); g.r(((hash2(y, x) * 13) | 0), 8, 1, 8, 3); }
    if (kind === 'asphalt') { g.r(0, 0, 16, 16, A); for (let i = 0; i < 6; i++) g.p((hash2(x + i, y) * 16) | 0, (hash2(y, x + i) * 16) | 0, B); if (v) { g.r(6, 3, 4, 10, 8); } }
  });
}
function wallTop(kind) { return spr(16, 16, g => { g.r(0, 0, 16, 16, 5); g.r(0, 15, 16, 1, 9); g.r(0, 2, 16, 1, 4); }); }
function wallFace(kind, crack) {
  return spr(16, 16, g => {
    g.r(0, 0, 16, 16, 4);
    if (kind === 'brick') for (let j = 0; j < 16; j += 4) { g.r(0, j, 16, 1, 1); for (let i = (j >> 2) & 1 ? 4 : 0; i < 16; i += 8) g.r(i, j, 1, 4, 1); }
    if (kind === 'neon') { g.r(0, 3, 16, 1, 6); g.r(0, 4, 16, 1, 9); g.r(0, 10, 16, 1, 7); g.r(0, 11, 16, 1, 9); g.r(0, 15, 16, 1, 9); }
    if (kind === 'panel') { for (let i = 0; i < 16; i += 8) { g.r(i, 0, 1, 16, 1); g.r(i + 1, 2, 6, 12, 3); } g.r(0, 0, 16, 2, 5); g.r(0, 15, 16, 1, 9); }
    if (kind === 'mirror') { g.r(1, 1, 14, 13, 12); g.line(3, 12, 9, 2, 10); g.line(6, 12, 12, 4, 10); g.r(0, 14, 16, 2, 6); frameTile(g, 0, 0, 16, 14, 9); }
    if (kind === 'tv') { for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) { g.r(i * 8 + 1, j * 8 + 1, 6, 6, 9); g.r(i * 8 + 2, j * 8 + 2, 4, 4, [6, 7, 8, 15][(i + j * 2 + (crack ? 1 : 0)) & 3]); } }
    if (kind === 'curtain') for (let i = 0; i < 16; i++) g.r(i, 0, 1, 16, i % 4 === 0 ? 3 : i % 4 === 1 ? 5 : 4);
    if (crack) { const pts = [[8, 0], [6, 4], [9, 7], [7, 10], [10, 13], [8, 15]]; for (let i = 0; i < pts.length - 1; i++) g.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 6); g.line(pts[2][0] + 1, pts[2][1], pts[2][0] + 3, pts[2][1] + 3, 7); }
  });
}
function frameTile(g, x, y, w, h, c) { g.r(x, y, w, 1, c); g.r(x, y + h - 1, w, 1, c); g.r(x, y, 1, h, c); g.r(x + w - 1, y, 1, h, c); }
// props: drawn over the floor (each theme re-colors them through its palette)
const PROPS = {
  p: g => { g.r(4, 1, 8, 15, 13); g.r(4, 1, 2, 15, 12); g.r(10, 1, 2, 15, 14); g.r(3, 0, 10, 2, 10); g.r(3, 14, 10, 2, 14); g.r(5, 6, 6, 1, 6); g.r(5, 9, 6, 1, 7); },
  T: g => { g.r(0, 2, 16, 13, 9); for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { g.r(1 + i * 5, 3 + j * 6, 4, 5, 14); g.r(2 + i * 5, 4 + j * 6, 2, 3, [6, 7, 8, 15][(i + j) % 4]); } g.r(0, 14, 16, 2, 14); },
  t: (g, f) => { g.r(5, 11, 6, 5, 12); g.r(4, 10, 8, 2, 11); g.line(8, 10, 3, 4 + f, 15); g.line(8, 10, 8, 1, 15); g.line(8, 10, 13, 4 + f, 15); g.r(2, 3 + f, 3, 2, 15); g.r(11, 3 + f, 3, 2, 15); g.r(7, 0, 3, 2, 15); },
  o: (g, f) => { g.e(8, 4, 3, 3.4, 10); g.r(5, 7, 6, 7, 6); g.r(6, 14, 4, 2, 14); g.r(3, 8, 2, 4, 10); g.r(11, 8, 2, 4, 10); g.r(5, 1, 6, 1, 7); g.p(8, 3 + f, 9); },
  _: g => { g.r(0, 4, 16, 11, 11); g.r(0, 4, 16, 3, 10); g.r(0, 13, 16, 2, 12); g.r(0, 7, 16, 1, 12); g.r(2, 9, 4, 3, 6); g.r(10, 9, 4, 3, 7); },
  '=': g => { g.r(1, 1, 14, 15, 9); g.r(1, 1, 14, 1, 14); g.e(8, 5, 4.2, 4, 14); g.e(8, 5, 2.2, 2, 6); g.e(8, 12, 3.4, 3, 14); g.e(8, 12, 1.6, 1.4, 7); },
  '*': (g, f) => { g.r(2, 1, 12, 15, 9); g.r(3, 2, 10, 7, 13); g.r(4, 3, 8, 5, f ? 7 : 6); g.r(6, 5, 4, 1, 10); g.r(3, 10, 10, 4, 14); g.p(5, 11, 6); g.p(8, 11, 8); g.p(11, 11, 7); g.r(2, 15, 12, 1, 12); },
  c: (g, f) => { // a car from above, two tiles wide: f 0 = the hood end, f 1 = the trunk end
    if (!f) { g.r(2, 2, 14, 12, 6); g.r(0, 4, 2, 8, 13); g.r(9, 4, 5, 8, 7); g.r(1, 3, 2, 2, 8); g.r(1, 11, 2, 2, 8); g.r(4, 0, 4, 2, 9); g.r(4, 14, 4, 2, 9); g.r(3, 7, 5, 2, 5); }
    else { g.r(0, 2, 14, 12, 6); g.r(14, 4, 2, 8, 13); g.r(2, 4, 5, 8, 7); g.r(13, 3, 2, 2, 5); g.r(13, 11, 2, 2, 5); g.r(4, 0, 4, 2, 9); g.r(4, 14, 4, 2, 9); g.r(9, 7, 4, 2, 5); } },
  S: (g, f) => { g.r(0, 0, 16, 16, 9); g.e(8, 8, 6.4, 6.4, f ? 6 : 14); g.e(8, 8, 5, 5, 9); g.r(7, 3, 2, 10, f ? 10 : 6); g.r(3, 7, 10, 2, f ? 10 : 6); g.p(8, 8, 8); },
  '>': (g, f) => { g.r(0, 0, 16, 16, 14); for (let i = 0; i < 16; i += 4) g.r(0, i, 16, 1, 13); for (let k = 0; k < 2; k++) { const x = (f * 4 + k * 8) % 16; g.line(x, 4, x + 3, 8, 8); g.line(x, 12, x + 3, 8, 8); } },
  '<': (g, f) => { g.r(0, 0, 16, 16, 14); for (let i = 0; i < 16; i += 4) g.r(0, i, 16, 1, 13); for (let k = 0; k < 2; k++) { const x = 15 - ((f * 4 + k * 8) % 16); g.line(x, 4, x - 3, 8, 7); g.line(x, 12, x - 3, 8, 7); } },
};
function tileset(theme) {
  if (tileCache[theme]) return tileCache[theme];
  const T = TH[theme], P = pal(...T.pal), t = {}, ts = { P, t };
  // note: a tileset entry is a list of animation frames
  const mk = (s) => [s];
  t['.'] = [0, 1].map(v => floorTile(T.floor, v, 0, 0)); t[','] = [floorTile(T.floor, 1, 3, 5)];
  t['.a'] = [floorTile(T.floor, 0, 1, 2), floorTile(T.floor, 0, 5, 7), floorTile(T.floor, 0, 9, 4)];
  t['#t'] = mk(wallTop(T.wall)); t['#f'] = mk(wallFace(T.wall, 0));
  t.W = mk(wallFace(T.wall, 1)); t.Wt = [spr(16, 16, g => { g.r(0, 0, 16, 16, 5); g.r(0, 15, 16, 1, 9); g.line(7, 0, 9, 15, 6); g.line(9, 4, 12, 9, 7); })];
  for (const k of 'pTtoc_=*S><'.split('')) t[k] = [0, 1].map(f => spr(16, 16, g => PROPS[k](g, f)));
  t.L = [0, 1].map(f => spr(16, 16, g => { if (f) { g.r(0, 6, 16, 2, 6); g.r(0, 7, 16, 1, 10); g.r(2, 3, 12, 1, 6); g.r(2, 11, 12, 1, 6); } else { g.p(0, 7, 6); g.p(15, 7, 6); g.r(0, 6, 1, 3, 9); g.r(15, 6, 1, 3, 9); } }));
  return tileCache[theme] = ts;
}
