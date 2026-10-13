'use strict';
// ================= ROMANCING STREAM: the painter =================
// every backdrop is painted at boot (or the first time you need it) with watercolor rules: warm paper with fibers,
// transparent washes that multiply into each other, darker pigment pooled at wet edges, granulation, sepia pen lines,
// a few white gouache highlights. nothing is a texture file. the art book is the reference: washes first, ink last.
class Paint {
  constructor(w, h, paper = [.96, .93, .86]) { const T = rsTex(); this.w = w; this.h = h; this.paper = paper; this.c = new Float32Array(w * h * 3); this.seed = 1; for (let i = 0; i < w * h; i++) { const x = i % w, y = (i / w) | 0, f = .985 + .03 * T.fib[(y & 255) * 512 + (x & 511)] - .015 * T.big[(y & 255) * 512 + (x & 511)]; this.c[i * 3] = paper[0] * f; this.c[i * 3 + 1] = paper[1] * f; this.c[i * 3 + 2] = paper[2] * f; } }
  // wash: inside(x, y) -> bool; pigment 0..1 rgb; a = strength. o: { jit, edge, gran, grad: [x0,y0,x1,y1,a0,a1], bloom }
  wash(inside, bb, pig, a, o = {}) {
    const w = this.w, h = this.h, jit = o.jit === undefined ? 2.2 : o.jit, edge = o.edge === undefined ? .7 : o.edge, gran = o.gran === undefined ? .35 : o.gran, sd = (this.seed += 17), T = rsTex();
    const X0 = Math.max(0, bb[0] - 3 | 0), X1 = Math.min(w - 1, bb[2] + 3 | 0), Y0 = Math.max(0, bb[1] - 3 | 0), Y1 = Math.min(h - 1, bb[3] + 3 | 0), bw = X1 - X0 + 1, bh = Y1 - Y0 + 1;
    if (bw <= 0 || bh <= 0) return;
    // the wet shape: one inside test per pixel, through a wobble (so edges are never ruled)
    const M = new Uint8Array(bw * bh), ox = (sd * 37) & 511, oy = (sd * 53) & 255;
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) { const q = ((y + oy) & 255) * 512 + ((x + ox) & 511), q2 = ((y + oy + 97) & 255) * 512 + ((x + ox + 131) & 511); M[(y - Y0) * bw + x - X0] = inside(x + (T.jit[q] - .5) * jit * 2, y + (T.jit[q2] - .5) * jit * 2) ? 1 : 0; }
    const mk = (x, y) => x < X0 || x > X1 || y < Y0 || y > Y1 ? 0 : M[(y - Y0) * bw + x - X0];
    const G = o.grad; let gdx = 0, gdy = 0, gl = 1; if (G) { gdx = G[2] - G[0]; gdy = G[3] - G[1]; gl = gdx * gdx + gdy * gdy || 1; }
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
      if (!M[(y - Y0) * bw + x - X0]) continue;
      const q = ((y + oy) & 255) * 512 + ((x + ox) & 511);
      let al = a * (1 + gran * (T.gran[q] - .5) * 1.4);
      if (G) { const t = Math.max(0, Math.min(1, ((x - G[0]) * gdx + (y - G[1]) * gdy) / gl)); al *= G[4] + (G[5] - G[4]) * t; }
      if (edge && (!mk(x - 2, y) || !mk(x + 2, y) || !mk(x, y - 2) || !mk(x, y + 2))) al *= 1 + edge;
      if (o.bloom && T.big[q] > .62) al *= .45;
      al = Math.max(0, Math.min(.95, al)); const i = (y * w + x) * 3; this.c[i] *= 1 - al * (1 - pig[0]); this.c[i + 1] *= 1 - al * (1 - pig[1]); this.c[i + 2] *= 1 - al * (1 - pig[2]);
    }
  }
  poly(pts, pig, a, o) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); this.wash((x, y) => rsInPoly(x, y, pts), [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], pig, a, o); }
  rect(x, y, w, h, pig, a, o) { this.wash((px, py) => px >= x && px < x + w && py >= y && py < y + h, [x, y, x + w, y + h], pig, a, o); }
  ell(cx, cy, rx, ry, pig, a, o) { this.wash((x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, [cx - rx, cy - ry, cx + rx, cy + ry], pig, a, o); }
  // a soft gradient sky: pigment stops top to bottom, wet-in-wet
  sky(stops, y1, a = .55) {
    const n = stops.length - 1, T = rsTex();
    for (let y = 0; y < Math.min(this.h, y1); y++) { const t = y / y1 * n, k = Math.min(n - 1, t | 0), f = t - k, col = stops[k].map((v, i) => v + (stops[k + 1][i] - v) * f); for (let x = 0; x < this.w; x++) { const i = (y * this.w + x) * 3, m = a * (.9 + .2 * T.big[(y & 255) * 512 + ((x >> 1) & 511)]); for (let j = 0; j < 3; j++) this.c[i + j] *= 1 - m * (1 - col[j]); } }
    for (let i = 0; i < 5; i++) { const cx = rnd2(i, 51) * this.w, cy = y1 * (.15 + rnd2(i, 52) * .4); this.ell(cx, cy, 24 + rnd2(i, 53) * 30, 5 + rnd2(i, 54) * 4, stops[n].map(v => Math.min(1, v * 1.05)), .25, { jit: 5, edge: .4, gran: .1 }); }
  }
  // masking fluid: give a shape back its white paper so the next wash sits on top instead of glazing the hills behind it
  reserve(pts) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); for (let y = Math.max(0, Math.min(...ys) | 0); y <= Math.min(this.h - 1, Math.max(...ys)); y++) for (let x = Math.max(0, Math.min(...xs) | 0); x <= Math.min(this.w - 1, Math.max(...xs)); x++) if (rsInPoly(x + .5, y + .5, pts)) { const i = (y * this.w + x) * 3; for (let k = 0; k < 3; k++) this.c[i + k] = this.paper[k] * (.97 + .03 * noise2(x * .9, y * .3)); } }
  // pen line: sepia, slightly wobbly, variable weight
  line(pts, col = [.36, .24, .2], a = .75, wgt = 1) { for (let k = 0; k < pts.length - 1; k++) { const [x0, y0] = pts[k], [x1, y1] = pts[k + 1], n = Math.max(1, Math.hypot(x1 - x0, y1 - y0) | 0); for (let i = 0; i <= n; i++) { const t = i / n, x = x0 + (x1 - x0) * t + (noise2(i * .3 + k, x0 * .1) - .5) * .8, y = y0 + (y1 - y0) * t + (noise2(i * .3, y0 * .1 + k) - .5) * .8; this.dab(x, y, wgt * (.6 + .5 * noise2(i * .2, k)), col, a); } } }
  dab(x, y, r, col, a) { const R = Math.ceil(r); for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) { const d = Math.hypot(i, j); if (d > r + .3) continue; const px = (x + i) | 0, py = (y + j) | 0; if (px < 0 || py < 0 || px >= this.w || py >= this.h) continue; const al = a * Math.min(1, r + .4 - d), q = (py * this.w + px) * 3; for (let k = 0; k < 3; k++) this.c[q + k] = this.c[q + k] * (1 - al) + col[k] * al; } }
  gouache(x, y, r, col = [.99, .97, .92], a = .85) { this.dab(x, y, r, col, a); }
  strokes(n, bb, col, a, len = 6, ang = -1.2, spread = .5) { for (let i = 0; i < n; i++) { const x = bb[0] + rnd2(i, 1) * (bb[2] - bb[0]), y = bb[1] + rnd2(i, 2) * (bb[3] - bb[1]), t = ang + (rnd2(i, 3) - .5) * spread, l = len * (.6 + rnd2(i, 4) * .8); this.line([[x, y], [x + Math.cos(t) * l, y + Math.sin(t) * l]], col, a, .8); } }
  // to a frame: quantize through the console palette
  out() { const o = new Uint32Array(this.w * this.h), c = this.c; for (let i = 0; i < o.length; i++) { const q = RSQ[(((i / this.w) & 3) << 2) | (i % this.w & 3)], f = v => q[Math.max(0, Math.min(511, (v * 255 + 128) | 0))]; o[i] = ((255 << 24) | (f(c[i * 3 + 2]) << 16) | (f(c[i * 3 + 1]) << 8) | f(c[i * 3])) >>> 0; } return { w: this.w, h: this.h, px: o }; }
}
// ordered dither into the 9-bit palette (the HYPER-32 does this to everything it prerenders)
const RSQ = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(b => { const t = new Uint8Array(512), d = (b + .5) / 16 - .5; for (let v = 0; v < 512; v++) t[v] = Math.round(Math.max(0, Math.min(255, v - 128 + d * 36.4)) / 255 * 7) * 255 / 7; return t; });
// noise tables, made once: wobble for wet edges, granulation, big blooms, paper fiber
let RSTEX = null;
function rsTex() { if (RSTEX) return RSTEX; const n = 512 * 256, T = { jit: new Float32Array(n), gran: new Float32Array(n), big: new Float32Array(n), fib: new Float32Array(n) }; for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) { const i = y * 512 + x; T.jit[i] = noise2(x * .13, y * .13); T.gran[i] = fbm(x * .35, y * .35, 2); T.big[i] = fbm(x * .06, y * .06, 3); T.fib[i] = fbm(x * .9, y * .25, 2); } return RSTEX = T; }
// value noise
const NP = new Uint8Array(512); { let s = 12345; const p = []; for (let i = 0; i < 256; i++) p.push(i); for (let i = 255; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) NP[i] = p[i & 255]; }
function noise2(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), h = (a, b) => NP[(NP[a & 255] + b) & 255] / 255; const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y, oct = 3) { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < oct; i++) { s += a * noise2(x * f, y * f); n += a; a *= .5; f *= 2.03; } return s / n; }
const rnd2 = (i, k) => { let h = (i * 374761393 + k * 668265263) | 0; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967296; };
const pg = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
function blitPaint(img, sx = 0, sy = 0, dx = 0, dy = 0, w = W, h = H) { for (let y = 0; y < h; y++) { const yy = dy + y, srcY = sy + y; if (yy < 0 || yy >= H || srcY < 0 || srcY >= img.h) continue; for (let x = 0; x < w; x++) { const xx = dx + x, srcX = sx + x; if (xx < 0 || xx >= W || srcX < 0 || srcX >= img.w) continue; FB[yy * W + xx] = img.px[srcY * img.w + srcX]; } } }
// ---------------- themes ----------------
// each theme: sky stops, ground, accent, ink, and a few signature props. painters compose them into towns, rooms, battles.
const THEMES = {
  desert:   { sky: ['#f2b070', '#f6d6a0', '#fbefd6'], ground: '#d8a46a', far: '#c07a58', acc: '#3a8a8a', night: 0 },
  mall:     { sky: ['#3a2a78', '#8a4aa8', '#f08aa0'], ground: '#b8a0c8', far: '#6a5a9a', acc: '#ff70b8', night: 1 },
  haunt:    { sky: ['#1a1a40', '#4a3a78', '#9a7ab0'], ground: '#5a5070', far: '#2a2a4a', acc: '#d0a0ff', night: 1 },
  studio:   { sky: ['#101830', '#203a6a', '#4a7aa8'], ground: '#40506a', far: '#1a2a48', acc: '#40e0ff', night: 1 },
  mandolin: { sky: ['#e8c0d8', '#f4dce0', '#fbf0e0'], ground: '#a8c08a', far: '#7a9a7a', acc: '#a080d0', night: 0 },
  noir:     { sky: ['#2a3040', '#4a5060', '#7a7a80'], ground: '#4a4a52', far: '#30343e', acc: '#e0c070', night: 1, rain: 1 },
  generator:{ sky: ['#6a4a3a', '#b07a4a', '#e8c08a'], ground: '#7a6a5a', far: '#5a4a40', acc: '#f0e040', night: 0 },
  hangar:   { sky: ['#5a7ab0', '#a0c0e0', '#e8f0f4'], ground: '#8a8a90', far: '#5a6a80', acc: '#e04040', night: 0 },
  redgate:  { sky: ['#4a0a14', '#a03028', '#f0905a'], ground: '#6a3030', far: '#3a1018', acc: '#ffd060', night: 0 },
  letters:  { sky: ['#e8e0c8', '#d8c8a0', '#c0a880'], ground: '#b09a78', far: '#8a7458', acc: '#2a2a2a', night: 0 },
  spire:    { sky: ['#f0d0f0', '#c8b0f0', '#90a0e8'], ground: '#d0c0e8', far: '#a090d0', acc: '#ff90d0', night: 0 },
  lab:      { sky: ['#cad8d0', '#e0ece4', '#f4f8f4'], ground: '#b8c4c0', far: '#90a49c', acc: '#40c080', night: 0 },
  curse:    { sky: ['#200008', '#600818', '#c02030'], ground: '#3a0a10', far: '#1a0006', acc: '#ff4060', night: 1 },
  apt:      { sky: ['#4a3a30', '#7a5a44', '#b08a66'], ground: '#6a4a36', far: '#5a4438', acc: '#80dcff', night: 1 },
  field:    { sky: ['#9ac0e0', '#d0e4f0', '#f6f2e4'], ground: '#a8b880', far: '#7a9a7a', acc: '#d07040', night: 0 },
  // ---- the new country ----
  rewind:   { sky: ['#2a2440', '#5a4a78', '#a888b0'], ground: '#6a5a70', far: '#3a3050', acc: '#f0d060', night: 1 },
  live:     { sky: ['#30100e', '#802018', '#f07840'], ground: '#7a3428', far: '#401410', acc: '#ffd870', night: 1 },
  brine:    { sky: ['#5a9aa8', '#a8ccd0', '#e8f0e4'], ground: '#8aa890', far: '#5a8a8a', acc: '#40c8c0', night: 0 },
  found:    { sky: ['#c8b898', '#e0d4b4', '#f4ecd8'], ground: '#b0a484', far: '#8a8064', acc: '#e08040', night: 0 },
  city:     { sky: ['#58202a', '#a04038', '#e8a060'], ground: '#8a5040', far: '#54282a', acc: '#ffd060', night: 0 },
  court:    { sky: ['#3a3a58', '#7878a0', '#c8c8dc'], ground: '#8a8aa0', far: '#50506e', acc: '#e8e0a0', night: 1 },
  bus:      { sky: ['#e8b070', '#f4d898', '#fbeecb'], ground: '#c8a870', far: '#b08a58', acc: '#e04828', night: 0 },
  road:     { sky: ['#f0c080', '#f8e0a8', '#fdf4dc'], ground: '#c0a078', far: '#a08058', acc: '#f0e020', night: 0 },
  pickle:   { sky: ['#4a6a30', '#7a9a48', '#c8d890'], ground: '#6a8a40', far: '#405826', acc: '#c8f040', night: 0 },
  dryer:    { sky: ['#c0a8b8', '#e0d0dc', '#f6eef4'], ground: '#a890a4', far: '#806880', acc: '#f090c0', night: 0 },
  freezer:  { sky: ['#b8d8e8', '#d8ecf4', '#f4fafe'], ground: '#c8dce8', far: '#90b8d0', acc: '#40a0f0', night: 0 },
  rookery:  { sky: ['#88a8c0', '#c0d4e0', '#eef4f4'], ground: '#9aa8a0', far: '#6a88a0', acc: '#e0a060', night: 0 },
  pyre:     { sky: ['#38160a', '#903810', '#f08828'], ground: '#5a3020', far: '#2a1008', acc: '#ffb020', night: 1 },
  foundry:  { sky: ['#8a8478', '#b8b0a0', '#e0d8c4'], ground: '#9a9088', far: '#6a645c', acc: '#f0a030', night: 0 },
  chorus:   { sky: ['#20182e', '#483060', '#8868a8'], ground: '#4a3a5a', far: '#2a1e3a', acc: '#c0a0ff', night: 1 },
  trench:   { sky: ['#0a1a2a', '#164050', '#2a6878'], ground: '#1a3844', far: '#0c2030', acc: '#40e0d0', night: 1 },
};
const PCACHE = {};
function painting(key, fn) { if (!PCACHE[key]) PCACHE[key] = fn(); return PCACHE[key]; }
function paintSkyGround(P, T, hz) {
  P.sky(T.sky.map(pg), hz + 10, .85);
  if (T.night) { for (let i = 0; i < 50; i++) P.gouache(rnd2(i, 7) * P.w, rnd2(i, 8) * hz * .7, .6 + rnd2(i, 9) * .6, [.98, .96, .9], .7); P.ell(P.w * .78, hz * .25, 9, 9, [.98, .94, .8], .5, { edge: .3 }); }
  else P.ell(P.w * .2, hz * .3, 12, 12, [.99, .9, .7], .35, { edge: .2 });
  // far hills
  const far = pg(T.far); P.poly([[0, hz], ...Array.from({ length: 12 }, (_, i) => [i * P.w / 11, hz - 10 - fbm(i * .7, 3) * 28]), [P.w, hz + 4]], far, .45, { jit: 3, edge: .5 });
  P.rect(0, hz, P.w, P.h - hz, pg(T.ground), .5, { jit: 2, edge: .2, gran: .5, grad: [0, hz, 0, P.h, .8, 1.2] });
  P.strokes(40, [0, hz + 6, P.w, P.h], pg(T.ground).map(v => v * .7), .25, 10, 0, .2);
}
function paintBuilding(P, b, T) { // b: { x, w, h, roof, col, label }
  const base = b.base || P.h - 40, col = pg(b.col || T.far).map(v => Math.min(1, v * 1.35 + .08)), y0 = base - b.h;
  P.reserve([[b.x, y0], [b.x + b.w, y0], [b.x + b.w, base], [b.x, base]]);
  P.rect(b.x, y0, b.w, b.h, col, .55, { jit: 1.2, edge: .8 });
  if (b.roof === 'tri') P.poly([[b.x - 4, y0 + 1], [b.x + b.w / 2, y0 - b.w * .35], [b.x + b.w + 4, y0 + 1]], col.map(v => v * .75), .6, { jit: 1 });
  else if (b.roof === 'dome') P.ell(b.x + b.w / 2, y0, b.w / 2, b.w * .3, col.map(v => v * .8), .55, { jit: 1 });
  else if (b.roof === 'flat') P.rect(b.x - 2, y0 - 4, b.w + 4, 5, col.map(v => v * .7), .6, { jit: .8 });
  else if (b.roof === 'spire') P.poly([[b.x + b.w * .3, y0 + 1], [b.x + b.w / 2, y0 - b.w * .9], [b.x + b.w * .7, y0 + 1]], col.map(v => v * .7), .6, { jit: .8 });
  for (let j = 0; j < Math.floor((b.h - 18) / 12); j++) for (let i = 0; i < Math.floor((b.w - 6) / 10); i++) P.rect(b.x + 5 + i * 10, y0 + 6 + j * 12, 5, 6, pg(T.night ? '#ffe08a' : '#6a7a8a'), T.night ? .5 : .35, { jit: .6, edge: .4 });
  if (b.door) { P.rect(b.x + b.w / 2 - 6, base - 18, 12, 18, [.25, .16, .14], .7, { jit: .6 }); P.line([[b.x + b.w / 2 - 6, base], [b.x + b.w / 2 - 6, base - 18], [b.x + b.w / 2 + 6, base - 18], [b.x + b.w / 2 + 6, base]], [.3, .2, .16], .7, .8); }
  if (b.sign) P.rect(b.x + b.w / 2 - b.sign * 3.2, y0 + 6, b.sign * 6.4, 8, pg(T.acc), .55, { jit: .5, edge: 1 });
  P.line([[b.x, base], [b.x, y0], [b.x + b.w, y0], [b.x + b.w, base]], [.32, .22, .18], .55, .7);
}
// signature props per theme (x along the ground line)
const PROPS = {
  desert: (P, x, g) => { P.rect(x, g - 26, 5, 26, [.3, .55, .4], .6, { jit: .6 }); P.rect(x - 6, g - 18, 6, 4, [.3, .55, .4], .6, { jit: .5 }); P.rect(x - 6, g - 24, 3, 8, [.3, .55, .4], .6, { jit: .5 }); P.line([[x, g], [x, g - 26]], [.25, .32, .22], .5, .6); },
  mall: (P, x, g) => { P.rect(x, g - 40, 3, 40, [.5, .45, .55], .5); P.ell(x + 1, g - 42, 8, 5, pg('#ff70b8'), .45, { edge: 1.2 }); P.gouache(x + 1, g - 42, 2, [1, .9, .96]); },
  haunt: (P, x, g) => { P.poly([[x - 5, g], [x - 5, g - 14], [x, g - 18], [x + 5, g - 14], [x + 5, g]], [.55, .52, .6], .55, { jit: .6 }); P.line([[x - 2, g - 11], [x + 2, g - 11]], [.3, .2, .2], .6, .5); },
  studio: (P, x, g) => { P.rect(x, g - 34, 12, 34, [.2, .25, .35], .6, { jit: .6 }); for (let k = 0; k < 5; k++) P.gouache(x + 3 + (k & 1) * 5, g - 30 + k * 6, .8, [.5, .95, 1], .9); },
  mandolin: (P, x, g) => { P.rect(x - 1, g - 24, 3, 24, [.45, .35, .25], .55); P.ell(x, g - 28, 11, 9, [.5, .7, .45], .5, { bloom: 1 }); P.ell(x + 3, g - 31, 6, 5, pg('#e8a0c8'), .35); },
  noir: (P, x, g) => { P.rect(x, g - 42, 2, 42, [.2, .2, .22], .7); P.ell(x + 1, g - 43, 6, 3, [.95, .85, .5], .4, { edge: 1.4 }); },
  generator: (P, x, g) => { P.rect(x - 8, g - 22, 16, 22, [.45, .38, .3], .55); P.ell(x, g - 25, 8, 4, [.5, .42, .34], .5); P.line([[x - 8, g - 12], [x + 30, g - 46]], [.25, .2, .18], .6, .8); P.gouache(x, g - 25, 2, [1, .95, .5]); },
  hangar: (P, x, g) => { P.poly([[x - 14, g], [x - 10, g - 30], [x + 10, g - 30], [x + 14, g]], [.6, .62, .66], .45, { jit: .8 }); P.ell(x, g - 36, 8, 7, [.75, .2, .2], .5); },
  redgate: (P, x, g) => { P.rect(x - 3, g - 40, 6, 40, [.55, .12, .12], .55); P.poly([[x - 8, g - 40], [x + 8, g - 40], [x, g - 52]], [.85, .65, .25], .5); },
  letters: (P, x, g) => { const L = 'AEKRSTWZ'[(x * 7) % 8 | 0]; P.rect(x - 7, g - 20, 14, 20, [.85, .8, .7], .5, { jit: .5 }); P.line(L === 'A' ? [[x - 5, g - 2], [x, g - 18], [x + 5, g - 2]] : [[x - 5, g - 18], [x + 5, g - 18], [x - 5, g - 2], [x + 5, g - 2]], [.15, .12, .1], .8, 1.4); },
  spire: (P, x, g) => { P.ell(x, g - 20, 6, 20, [.95, .85, .95], .4, { edge: 1.4 }); P.gouache(x, g - 30, 1.6, [1, .8, .95]); },
  lab: (P, x, g) => { P.rect(x - 10, g - 16, 20, 16, [.85, .88, .86], .5); P.ell(x, g - 22, 6, 6, [.6, .9, .75], .4, { edge: 1.2 }); },
  curse: (P, x, g) => { P.poly([[x - 6, g], [x - 2, g - 40], [x + 1, g - 20], [x + 4, g - 46], [x + 7, g]], [.4, .02, .06], .6, { jit: 1.2 }); },
  apt: (P, x, g) => { P.rect(x - 4, g - 30, 8, 30, [.25, .25, .28], .6); P.ell(x, g - 30, 4, 1.5, [.5, .86, 1], .6, { edge: 1.4 }); P.rect(x + 12, g - 16, 18, 16, [.6, .45, .32], .5); P.rect(x + 14, g - 26, 12, 8, [.95, .92, .8], .5); },
  field: (P, x, g) => { P.rect(x - 1, g - 20, 3, 20, [.4, .3, .22], .55); P.ell(x, g - 26, 12, 10, [.45, .6, .4], .5, { bloom: 1 }); },
  // ---- the new country ----
  rewind: (P, x, g) => { P.rect(x - 12, g - 22, 24, 22, [.55, .5, .42], .5); P.rect(x - 9, g - 19, 18, 9, [.3, .28, .26], .45); P.ell(x - 4, g - 14, 3, 3, [.8, .78, .7], .4); P.ell(x + 5, g - 14, 3, 3, [.8, .78, .7], .4); P.line([[x, g], [x, g - 22]], [.3, .24, .2], .5, .7); },
  live: (P, x, g) => { P.rect(x - 2, g - 24, 4, 24, [.3, .2, .18], .6); P.ell(x, g - 28, 12, 7, [1, .85, .45], .5, { edge: 1.2 }); P.gouache(x, g - 28, 2, [1, .98, .9]); },
  brine: (P, x, g) => { P.rect(x - 14, g - 5, 28, 6, [.6, .52, .4], .5); P.rect(x - 12, g - 12, 3, 8, [.5, .42, .32], .5); P.rect(x + 9, g - 12, 3, 8, [.5, .42, .32], .5); P.line([[x, g - 5], [x, g - 30]], [.35, .28, .22], .6, .8); P.poly([[x, g - 30], [x + 16, g - 22], [x, g - 16]], [.92, .9, .8], .5); },
  found: (P, x, g) => { P.rect(x - 10, g - 26, 20, 26, [.7, .64, .5], .5); P.rect(x - 7, g - 20, 5, 4, [.4, .35, .25], .5); P.rect(x + 2, g - 20, 5, 4, [.4, .35, .25], .5); P.ell(x, g - 30, 4, 3, [.9, .5, .25], .5, { edge: 1.2 }); },
  city: (P, x, g) => { P.rect(x - 3, g - 40, 6, 40, [.6, .3, .26], .55); P.poly([[x - 12, g - 40], [x + 12, g - 40], [x, g - 56]], [.82, .64, .28], .5); P.gouache(x, g - 46, 1.6, [1, .9, .6]); },
  court: (P, x, g) => { P.rect(x - 12, g - 30, 24, 30, [.82, .82, .88], .45); P.rect(x - 2, g - 30, 4, 30, [.7, .7, .78], .4); P.line([[x - 12, g - 22], [x + 12, g - 22]], [.5, .5, .6], .5, .8); },
  bus: (P, x, g) => { P.rect(x - 16, g - 20, 32, 14, [.94, .78, .3], .5); P.rect(x - 16, g - 26, 32, 7, [.86, .7, .26], .5); for (let k = 0; k < 4; k++) P.rect(x - 12 + k * 7, g - 24, 4, 4, [.4, .6, .8], .5); P.rect(x - 12, g - 8, 4, 4, [20, 20, 20], .6); P.rect(x + 8, g - 8, 4, 4, [20, 20, 20], .6); },
  road: (P, x, g) => { P.rect(x - 1, g - 16, 3, 16, [.3, .3, .34], .5); P.rect(x - 8, g - 16, 16, 3, [.3, .3, .34], .5); P.gouache(x, g - 18, 1.4, [1, .98, .9]); },
  pickle: (P, x, g) => { P.ell(x, g - 10, 7, 11, [.5, .7, .3], .5, { edge: 1.2 }); P.ell(x - 5, g - 22, 4, 3, [.6, .5, .3], .4); P.ell(x + 5, g - 22, 4, 3, [.6, .5, .3], .4); P.strokes(6, [x - 8, g - 18, x + 8, g - 2], [.4, .55, .25], .3, 4, .3, 2); },
  dryer: (P, x, g) => { P.rect(x - 11, g - 24, 22, 24, [.8, .78, .86], .5); P.ell(x, g - 12, 7, 7, [.55, .55, .66], .45, { edge: 1.4 }); P.gouache(x - 2, g - 14, 1.4, [1, .96, .94]); },
  freezer: (P, x, g) => { P.rect(x - 10, g - 22, 20, 22, [.8, .88, .94], .5); P.ell(x, g - 11, 5, 6, [.6, .78, .9], .4, { edge: 1.4 }); P.strokes(5, [x - 10, g - 26, x + 10, g - 22], [.9, .96, 1], .4, 5, -.4); },
  rookery: (P, x, g) => { P.rect(x - 14, g - 8, 28, 8, [.5, .48, .44], .5); P.poly([[x - 14, g - 8], [x - 8, g - 26], [x + 2, g - 8]], [.56, .54, .5], .45); P.ell(x - 4, g - 22, 2, 2, [.4, .36, .3], .5); P.ell(x + 1, g - 18, 2, 2, [.4, .36, .3], .5); },
  pyre: (P, x, g) => { P.rect(x - 6, g - 26, 12, 26, [.3, .28, .3], .55); P.ell(x, g - 30, 7, 6, [1, .55, .2], .5, { edge: 1.4 }); P.gouache(x, g - 30, 1.8, [1, .95, .7]); },
  foundry: (P, x, g) => { P.rect(x - 9, g - 20, 18, 20, [.6, .56, .5], .5); P.rect(x - 5, g - 28, 10, 9, [.5, .46, .42], .5); P.ell(x, g - 10, 5, 6, [1, .6, .2], .45, { edge: 1.4 }); },
  chorus: (P, x, g) => { P.rect(x - 2, g - 22, 4, 22, [.24, .18, .3], .6); P.ell(x, g - 26, 9, 6, [.75, .6, 1], .45, { edge: 1.4 }); P.strokes(4, [x - 10, g - 34, x + 10, g - 30], [.8, .7, 1], .4, 4, -.5); },
  trench: (P, x, g) => { P.line([[x - 14, g], [x - 6, g - 20], [x + 2, g - 8], [x + 12, g - 26]], [.3, .5, .44], .5, 1.4); P.ell(x - 4, g - 22, 5, 2.5, [.5, .8, .7], .4, { edge: 1.4 }); },
};
// towns are painted in rstowns.js (each town has its own houses and landmark)
function paintDock(P, x, g, T) {
  P.rect(x, g, 62, 24, [.42, .58, .62], .5, { jit: 3, edge: .4 });          // the harbor water
  for (let i = 0; i < 4; i++) P.line([[x + 4, g + 6 + i * 5], [x + 58, g + 4 + i * 5]], [.7, .82, .86], .3, .6);
  P.rect(x + 8, g - 3, 46, 5, [.55, .44, .3], .6, { jit: 1 });              // the planks
  P.rect(x + 10, g - 24, 3, 21, [.45, .36, .26], .55);                      // the mast
  P.poly([[x + 13, g - 24], [x + 34, g - 17], [x + 13, g - 10]], [.93, .9, .8], .5);
  P.gouache(x + 26, g - 6, 1.6, [1, .98, .9]);
}
// a room inside: back wall, floor, theme dressing; exits are dark arches at the edges
function paintRoom(key, theme, kind, w = 320) {
  return painting('room:' + key, () => {
    const T = THEMES[theme], P = new Paint(w, H), g = H - 44, isDungeon = kind === 'dun' || kind === 'boss';
    P.seed = isDungeon ? Array.from(key).reduce((sum, ch) => sum + ch.charCodeAt(0), kind.length * 7) : key.length * 7 + kind.length;
    const wall = pg(T.far), floor = pg(T.ground);
    const wl = wall.map(v => Math.min(1, v * 1.5 + .12));
    P.rect(0, 0, w, g, wl, .5, { jit: 3, edge: .1, gran: .15, grad: [0, 0, 0, g, 1.3, .7] });
    if (isDungeon) {
      // Leave an open painted field for each location's own architecture and floor to define.
      P.rect(0, g, w, H - g, floor, .34, { jit: 3, edge: .15, gran: .35 });
    } else {
      P.rect(0, g - 26, w, 26, wl.map(v => v * .8), .35, { jit: 1, edge: .5, gran: .2 });
      P.line([[0, g - 26], [w, g - 26]], [.32, .22, .18], .45, .7);
      P.rect(0, g, w, H - g, floor, .55, { jit: 2, edge: .3, gran: .3 });
      for (let y = g + 8; y < H; y += 9) P.line([[0, y], [w, y + 1]], floor.map(v => v * .55), .25, .5);
      for (let x = 30; x < w; x += 90) { P.reserve([[x, 10], [x + 10, 10], [x + 10, g], [x, g]]); P.rect(x, 10, 10, g - 10, wl.map(v => v * .8), .6, { jit: .8, edge: .6, gran: .2 }); P.line([[x, g], [x, 10]], [.3, .2, .18], .4, .6); P.line([[x + 10, g], [x + 10, 10]], [.3, .2, .18], .4, .6); }
      for (let i = 0; i < 4; i++) P.ell(60 + i * (w - 120) / 3, 16, 14, 5, [1, .92, .7], .25, { edge: .2, gran: .1 });
    }
    if (kind === 'pub') { P.rect(20, g - 30, w - 40, 30, [.55, .38, .26], .55); P.rect(20, g - 34, w - 40, 5, [.7, .5, .32], .55); for (let i = 0; i < 6; i++) P.ell(40 + i * 44, g - 50, 5, 8, [.4, .6, .5], .45); P.ell(w / 2, 26, 16, 6, [1, .85, .5], .35, { edge: 1 }); }
    else if (kind === 'shop') { for (let j = 0; j < 3; j++) P.rect(24, 30 + j * 30, w - 48, 4, [.5, .36, .26], .6); for (let i = 0; i < 18; i++) P.rect(30 + (i % 6) * 44, 16 + Math.floor(i / 6) * 30, 18, 12, pg(['#a05050', '#5070a0', '#a0a050', '#70a070'][i % 4]), .45); P.rect(40, g - 26, w - 80, 26, [.6, .45, .3], .55); }
    else if (kind === 'inn') { P.rect(30, g - 22, 70, 22, [.85, .82, .75], .45); P.rect(30, g - 30, 18, 10, [.95, .92, .88], .4); P.rect(w - 100, g - 22, 70, 22, [.85, .82, .75], .45); P.ell(w / 2, 40, 22, 26, [.6, .75, .9], .4); P.line([[w / 2 - 22, 40], [w / 2 + 22, 40]], [.3, .2, .2], .5, .7); }
    else if (kind === 'magic') { for (let i = 0; i < 9; i++) P.ell(30 + i * 34, 30 + (i % 3) * 8, 6, 9, pg(T.acc), .3, { edge: 1.4 }); P.rect(w / 2 - 50, g - 28, 100, 28, [.35, .25, .4], .55); P.ell(w / 2, g - 36, 8, 8, [.7, .9, 1], .4, { edge: 1.6 }); }
    else { // dungeon dressing
      for (let i = 0; i < 4; i++) PROPS[theme](P, 40 + i * (w - 80) / 3 + rnd2(i, 5) * 20, g + 2);
      P.strokes(60, [0, g, w, H], floor.map(v => v * .6), .3, 8, .1, .4);
      for (let i = 0; i < 18; i++) P.dab(rnd2(i, 21) * w, rnd2(i, 22) * (g - 30), 1 + rnd2(i, 23) * 2, wall.map(v => v * .7), .18);
    }
    if ((kind === 'dun' || kind === 'boss') && theme !== 'generator') paintDungeonRoom(P, key, theme, g, w);
    P.rect(0, g - 54, 14, 54, [.12, .08, .08], .75, { jit: 1 }); P.rect(w - 14, g - 54, 14, 54, [.12, .08, .08], .75, { jit: 1 });   // the ways out
    return P.out();
  });
}
// Dungeon architecture follows each place's central absurdity, not one reused hallway.
function paintDungeonRoom(P, key, theme, g, w) {
  const id = key.split(':')[0], room = +(key.split(':')[1] || 0), cx = w / 2 + ((room % 3) - 1) * 22;
  const ink = [.24, .19, .23], pale = [.95, .89, .78], glow = pg(THEMES[theme].acc);
  const col = pg(THEMES[theme].far);
  const arch = (x, y, rw, rh, c = glow) => { P.ell(x, y, rw / 2, rw / 2, c, .24, { edge: .9, jit: 1 }); P.rect(x - rw / 2, y, rw, rh, c, .2, { edge: .8, jit: .8 }); P.rect(x - rw / 2 + 5, y + 5, rw - 10, rh, col, .42, { edge: .8, jit: .8 }); };
  if (id === 'badlands') {
    for (let i = 0; i < 7; i++) { const x = 20 + i * 57 + room % 2 * 18, y = 66 + i % 3 * 13; P.poly([[x-24,g],[x-12,y+18],[x-4,y],[x+5,y+24],[x+17,y+7],[x+29,g]],i%2?col:glow,.38,{jit:3,edge:.5}); }
    for (let i=0;i<5;i++) { const x=44+i*76; P.ell(x,g-54,25,8,pg('#dcaa77'),.48,{jit:4}); P.gouache(x+room%3*4,g-56,1.5,pale); }
    P.line([[0,g-34],[w*.45,g-46],[w,g-31]],pale,.45,1.3);
  } else if (id === 'wideweb') {
    const x=cx+(room%2?32:-32), y=89;
    for(let i=0;i<9;i++){const a=i*Math.PI/4;P.line([[x,y],[x+Math.cos(a)*172,y+Math.sin(a)*74]],pale,.65,.8);}
    for(const r of [.25,.42,.59,.76,1]) P.ell(x,y,166*r,70*r,glow,.055,{edge:.4,jit:1});
    for(let i=0;i<7;i++){const px=28+i*56;P.gouache(px,62+(i*31+room*17)%70,2.5,[.86,.97,1]);P.line([[px,40],[px,93+(i%3)*15]],pale,.35,.6);}
    P.poly([[0,g],[30,g-20],[48,g],[65,g-29],[84,g]],pg('#779a75'),.4);
  } else if (id === 'longstatic') {
    for(let i=0;i<18;i++){const x=(i*47+room*19)%w;P.line([[x,12],[x+(i%2?5:-4),g-3]],i%3?pale:glow,.3+(i%3)*.12,1+(i%3));}
    for(let i=0;i<5;i++){const x=38+i*78;P.ell(x,63,35,22,pale,.22,{jit:6,edge:.5});P.ell(x+12,57,22,19,pale,.25,{jit:5,edge:.5});P.poly([[x-26,72],[x+23,72],[x+10,122],[x-12,121]],i%2?col:glow,.24,{jit:5});}
    for(let y=138;y<g;y+=7) P.line([[0,y],[w,y+((y+room)%3)]],glow,.18,.8);
  } else if (id === 'shallows') {
    // A drowned arcade: stepping-stone islands, dangling roots and a tide line.
    for(let i=0;i<5;i++){const x=32+i*87+(room%2?17:0),y=48+(i%2)*22;P.ell(x,y,31,13,pg('#8eb4ad'),.45,{edge:1.2});P.ell(x,y-3,24,8,pg('#bdc8a8'),.3,{edge:.8});P.ell(x-7,y-4,2,2,pale,.8);}
    P.poly([[0,g-14],[53,g-40],[104,g-24],[158,g-56],[219,g-28],[278,g-46],[w,g-25],[w,g],[0,g]],pg('#536f6b'),.53,{jit:4,edge:.8});
    for(let i=0;i<9;i++){const x=18+i*46+(room*11%23),h=22+(i*17%43);P.line([[x,0],[x+((i%2)?7:-5),h],[x+2,h+19]],i%2?glow:pg('#829a74'),.5,1.2);P.ell(x+2,h+20,3,4,pg('#c6aa77'),.38);}
    for(let i=0;i<9;i++){const x=(i*47+room*17)%w;P.line([[x,g-18-(i*13%31)],[x+18,g-19-(i*13%31)]],pale,.28,.8);}
    for(let i=0;i<6;i++)P.line([[11+i*72,g-2],[18+i*72,g-22-(i%3)*7],[27+i*72,g-3]],glow,.45,1.3);
  } else if (id === 'trench') {
    // A pressure-fissure descends into a black seabed, with a tiny lit submersible.
    P.poly([[0,25],[w*.31,38],[w*.43,69],[cx-16,105],[cx-41,g],[0,g]],pg('#29454d'),.55,{jit:4,edge:.9});
    P.poly([[w,18],[w*.69,31],[w*.57,69],[cx+14,105],[cx+39,g],[w,g]],pg('#21383f'),.58,{jit:4,edge:.9});
    for(let i=0;i<6;i++){const y=38+i*27,half=38+i*17;P.line([[cx-half,y],[cx+half,y-((i%2)*7)]],i%2?pg('#527178'):pg('#768c83'),.32,1);}
    for(let i=0;i<12;i++){const x=(i*37+room*19)%w,y=25+(i*29%123);P.ell(x,y,2+i%3,2+i%4,i%3?pg('#70969a'):pale,.38,{jit:1});}
    const subx=cx+(room%3-1)*24,suby=108;P.ell(subx,suby,26,9,pg('#c7a96e'),.56,{edge:1.2});P.ell(subx,suby,13,5,pg('#668b91'),.62,{edge:.8});P.ell(subx-6,suby-1,2,2,pale,.8);P.ell(subx+7,suby-1,2,2,pale,.8);P.line([[subx-25,suby],[subx-35,suby-8]],glow,.55,1);P.line([[subx+25,suby],[subx+35,suby-8]],glow,.55,1);
    for(let i=0;i<5;i++){const x=31+i*83;P.line([[x,g],[x+((i%2)?5:-4),g-28-(i%3)*9]],pg('#5d7771'),.48,1.5);P.ell(x+((i%2)?5:-4),g-29-(i%3)*9,4,2,glow,.42);}
  } else if (id === 'foodcourt') {
    for(let i=0;i<8;i++){const x=i*58;P.poly([[x,0],[x+17,0],[x+68,g],[x+40,g]],i%2?pg('#8d5377'):pg('#d79b68'),.2,{jit:2});}
    for(let y=30;y<g;y+=42) P.line([[0,y],[w,y]],pale,.22,1);
    arch(cx,103,91,62,pg('#db9272'));
    P.ell(cx,94,25,25,pg('#a84e45'),.5,{edge:1.5,jit:3});P.ell(cx,94,14,14,pale,.55,{edge:1});P.ell(cx,94,5,5,pg('#ba6850'),.5);
    for(let i=0;i<4;i++){const x=45+i*100;P.rect(x,g-61,61,4,ink,.6);P.rect(x+3,g-57,4,17,ink,.6);P.rect(x+54,g-57,4,17,ink,.6);P.ell(x+23,g-68,4,3,glow,.7);P.ell(x+39,g-68,4,3,glow,.7);}
  } else if (id === 'court88') {
    for(let i=0;i<5;i++){const x=26+i*79, top=30+(i%2)*19;arch(x,top,45,g-top,pg('#b5a7c0'));P.ell(x,top+35,3,3,pale,.7);}
    P.rect(cx-74,76,148,51,pg('#56506d'),.35,{edge:1});P.poly([[cx-84,77],[cx,40],[cx+84,77]],glow,.26,{edge:.6});
    P.line([[cx,22],[cx,67]],ink,.8,2);P.line([[cx-42,43],[cx+42,43]],ink,.8,2);P.line([[cx-42,43],[cx-57,64]],ink,.65,1);P.line([[cx-42,43],[cx-27,64]],ink,.65,1);P.line([[cx+42,43],[cx+27,64]],ink,.65,1);P.line([[cx+42,43],[cx+57,64]],ink,.65,1);P.ell(cx-42,67,18,5,glow,.3);P.ell(cx+42,67,18,5,glow,.3);
    P.rect(0,g-21,w,7,pg('#b8a8b7'),.45);P.rect(cx-54,g-48,108,28,pg('#807388'),.42,{edge:1});
  } else if (id === 'archive') {
    for(let i=0;i<8;i++){const x=i*54+(room%2?18:0), top=18+(i%3)*10;P.rect(x,top,36,g-top,pg('#7d6680'),.32,{edge:1});for(let j=0;j<8;j++){const y=top+8+j*18;P.rect(x+4,y,28,11,j%3===0?glow:pg('#be956e'),.38,{edge:.8});P.rect(x+9,y+2,2,6,pale,.7);}}
    P.poly([[cx-44,g-7],[cx-10,104],[cx+12,104],[cx+48,g-7]],pg('#26233b'),.65);P.line([[cx-10,104],[cx-10,32]],pale,.35,1);P.line([[cx+12,104],[cx+12,32]],pale,.35,1);
    P.rect(cx-24,62,47,31,pg('#39374b'),.6,{edge:1});P.rect(cx-19,67,37,20,pg('#8eabc1'),.38);P.line([[cx-13,82],[cx-5,71],[cx+1,81],[cx+12,72]],pale,.7,1);
  } else if (id === 'mirror') {
    for(let i=0;i<5;i++){const x=25+i*84+(room%2?19:-8);P.poly([[x-27,g],[x-17,87],[x,40],[x+17,87],[x+28,g]],i%2?glow:pale,.23,{jit:2,edge:1.2});P.line([[x,40],[x-4,g-20]],pale,.7,1);P.line([[x-20,88],[x+19,g-17]],glow,.45,.7);}
    P.poly([[0,g-6],[35,g-28],[75,g-17],[118,g-35],[164,g-18],[210,g-32],[258,g-14],[304,g-29],[w,g-7],[w,g],[0,g]],pg('#a8a0c4'),.32,{jit:3,edge:.6});
    for(let i=0;i<7;i++)P.line([[0,168+i*7],[w,166+i*7]],pale,.23,.7);
  } else if (id === 'works') {
    for(let i=0;i<7;i++){const y=33+i*18, c=i%2?pg('#b95f42'):pg('#e0ae70');P.poly([[0,y+9],[42,y-2],[101,y+7],[163,y-3],[231,y+8],[298,y-4],[w,y+5],[w,y+20],[0,y+22]],c,.42,{jit:2,edge:.8});}
    for(let i=0;i<6;i++){const x=25+i*69;P.line([[x,27],[x,g-7]],ink,.6,1);P.line([[x+5,27],[x+5,g-7]],pale,.35,.8);}
    P.ell(cx,g-62,74,19,pg('#78574e'),.56,{edge:1.5});P.ell(cx,g-62,60,11,pg('#d5a276'),.55);P.line([[cx-48,g-62],[cx+48,g-62]],glow,.6,2);
  } else if (id === 'apt4') {
    for(let i=0;i<6;i++){const x=22+i*67, y=32+(i%2)*16, rw=43-i%3*4;P.rect(x,y,rw,g-y,pg('#91664e'),.3,{edge:.8});P.rect(x+5,y+12,rw-10,g-y-12,pg('#4e4141'),.5,{edge:.8});P.rect(x+rw-11,g-62,4,4,glow,.7);P.line([[x+rw/2,y],[x+rw/2,y-15]],ink,.7,1);}
    P.ell(cx,61,23,13,pg('#72afc2'),.22,{edge:.6});P.rect(cx-3,20,6,42,pg('#716c78'),.5);
    P.rect(23,g-30,58,6,pg('#9a6970'),.45);P.rect(30,g-24,5,16,ink,.55);P.rect(70,g-24,5,16,ink,.55);P.ell(cx+93,g-42,23,17,pg('#977f71'),.38,{edge:1});P.rect(cx+77,g-27,34,5,pg('#786477'),.45);
  } else if (id === 'white') {
    for(let i=0;i<7;i++){const x=i*67+(room%2?28:0),y=38+(i%3)*17;P.line([[x,0],[cx+(x-cx)*.18,y],[cx+(x-cx)*.12,g]],pale,.65,1);P.line([[x+28,0],[cx+(x+28-cx)*.18,y],[cx+(x+28-cx)*.12,g]],col,.4,.7);}
    for(let y=28;y<g;y+=28)P.line([[0,y],[cx,52+(y-28)*.2],[w,y]],pale,.5,1);
    const van=cx+(room%3-1)*23;P.rect(van-7,68,14,52,pg('#cf6b73'),.25,{edge:1});P.ell(van,67,12,12,pg('#ef8990'),.18,{edge:.8});
    for(let i=0;i<4;i++)P.rect(24+i*91,g-14,32,4,glow,.22);
  } else if (id === 'redgate') {
    for(let i=0;i<5;i++){const x=18+i*90+(room%2?22:0), h=118+(i%3)*20;P.rect(x, g-h, 13,h,pg('#741f2e'),.6,{edge:1.2});P.rect(x+53,g-h,13,h,pg('#741f2e'),.6,{edge:1.2});P.poly([[x-12,g-h+3],[x+39,g-h-28],[x+78,g-h+3]],pg('#9b3341'),.55,{edge:1});P.ell(x+32,g-h-13,3,3,pg('#f0b759'),.65);}
    P.ell(cx,g-35,28,37,pg('#f65c68'),.34,{edge:1.5});P.ell(cx,g-35,19,29,pg('#582f4b'),.62,{edge:1});
    for(let i=0;i<6;i++){const x=40+i*59;P.poly([[x,g-3],[x+14,g-3],[x+14,g-40],[x+7,g-31],[x,g-40]],pg('#742636'),.58,{edge:.8});}
  } else if (id === 'gnerator') {
    for(let i=0;i<5;i++){const x=28+i*83+(room%2?24:0), y=44+(i%3)*22;P.poly([[x-23,y+17],[x-13,y-17],[x+13,y-17],[x+23,y+17],[x+10,y+17],[x,y-2],[x-10,y+17]],i%2?glow:col,.38,{edge:1.3,jit:2});P.line([[x-20,y+22],[x+24,y+22]],ink,.5,1);}
    for(let i=0;i<12;i++){const x=(i*67+room*31)%w,y=35+(i*29%100);P.rect(x,y,22+i%4*5,4,pale,.35);P.ell(x+((i*7)%24),y+13,2,2,glow,.6);}
    for(let i=0;i<4;i++)P.line([[i*105,g-10],[i*105+42,g-23],[i*105+90,g-9]],ink,.6,1.2);
  } else if (id === 'oldstream') {
    for(let i=0;i<8;i++){const y=25+i*20, off=Math.sin(i*.7+room)*13;P.line([[0,y+off],[67,y+off],[82,y+off+9],[154,y+off+9],[171,y+off-5],[255,y+off-5],[272,y+off],[w,y+off]],i%2?pale:glow,.48,1.2);}
    for(const r of [18,31,47,65,88])P.ell(cx,91,r,r*.62,room%2?glow:pale,.1,{edge:.65,jit:1});
    P.rect(cx-34,52,68,47,ink,.42,{edge:1});P.rect(cx-27,58,54,34,glow,.24);P.rect(cx-17,66,12,15,pg('#f18b62'),.55);P.rect(cx+3,62,17,19,pg('#d9c8ae'),.5);
    for(let i=0;i<14;i++){const x=i*31+(room*17%23);P.rect(x,146+(i%3)*10,11+(i%4)*4,2,glow,.3);}
  } else if (id === 'endlessroad') {
    const van=cx+(room%3-1)*25;
    for(let i=0;i<6;i++){const x=i*79;P.line([[cx+(x-cx)*.12,62],[x,g]],pg('#e4c58c'),.28,1);}
    P.poly([[cx-10,69],[cx+11,69],[w,g],[0,g]],pg('#4c4651'),.54,{edge:.6,jit:2});
    for(let i=0;i<7;i++){const t=(i+1)/8,y=69+(g-69)*t, hh=1+t*6;P.rect(van-hh,y,hh*2,hh*2,pale,.57,{jit:.5});}
    P.rect(26,91,59,41,pg('#9b7954'),.4,{edge:1});P.rect(31,97,49,17,pg('#d2ae73'),.45);P.rect(36,114,4,23,ink,.55);P.rect(72,114,4,23,ink,.55);
    P.ell(cx+81,g-37,26,17,pg('#bf6a47'),.42,{edge:1});P.rect(cx+63,g-36,37,8,pg('#d79758'),.5);
  } else if (id === 'vaults') {
    for(let i=0;i<5;i++){const x=38+i*83,y=56+(i%2)*18;P.ell(x,y,30,29,pg('#8e829e'),.42,{edge:1.1});P.ell(x,y,19,19,pg('#302a42'),.65,{edge:1});P.ell(x,y,4,4,glow,.85);P.line([[x,y-30],[x,y+30]],pale,.35,.8);P.line([[x-30,y],[x+30,y]],pale,.35,.8);}
    for(let i=0;i<5;i++){const y=29+i*25;P.line([[0,y],[w,y+(i%2?12:-8)]],i%2?glow:pale,.65,1.4);P.rect((room*39+i*61)%w,y-3,15,7,pg('#473e59'),.7,{edge:.8});}
    P.poly([[0,g-19],[cx-13,g-42],[cx+17,g-35],[w,g-15],[w,g],[0,g]],pg('#695d70'),.36,{edge:.8});
  } else if (id === 'pickle') {
    for(let i=0;i<5;i++){const x=37+i*82, top=45+(i%2)*9;P.rect(x-28,top,56,g-top,pg('#526c3a'),.45,{edge:1.3});P.ell(x,top,28,8,pg('#aac579'),.5,{edge:1.1});P.ell(x,top,20,4,pg('#536a36'),.6);for(let j=0;j<3;j++)P.line([[x-17+j*15,top+8],[x-18+j*15,g-5]],pale,.3,.7);}
    for(let i=0;i<9;i++){const x=26+i*44, y=54+(i*31%86);P.ell(x,y,7,11,pg('#82ae46'),.58,{edge:1});P.ell(x-2,y-3,2,2,pale,.72);P.ell(x+2,y+3,2,2,pg('#465f31'),.66);}
    P.rect(0,g-20,w,19,pg('#617e47'),.32);for(let i=0;i<15;i++)P.ell(i*31,g-18-(i*13%13),1.5,2,pg('#d7e0a0'),.48);
  } else if (id === 'dryer') {
    for(let i=0;i<6;i++){const x=36+i*67,y=59+(i%2)*23,r=24+(i%2)*5;P.ell(x,y,r,r,pg('#897688'),.42,{edge:1.2});P.ell(x,y,r-7,r-7,pg('#534657'),.62,{edge:1});P.ell(x,y,r-12,r-12,pg('#a58ba0'),.24);P.line([[x-r-4,y+4],[x-r-13,y+12],[x-r-18,y+4]],pale,.55,1);}
    for(let i=0;i<7;i++){const x=32+i*54,y=25+(i*37%72);P.line([[x,y],[x+((i%2)?-9:10),y+26],[x+16,y+35]],i%2?pale:glow,.58,1.1);P.ell(x+16,y+35,4,3,glow,.38,{edge:.7});}
    P.rect(0,g-17,w,17,pg('#8f7588'),.28);for(let i=0;i<12;i++)P.ell(i*37,g-14,2,2,pale,.52);
  } else if (id === 'freezer') {
    for(let i=0;i<6;i++){const x=20+i*73, h=68+(i%3)*22;P.rect(x,g-h,48,h,pg('#9dbbce'),.23,{edge:.8});P.line([[x,g-h+18],[x+48,g-h+18]],pale,.7,1.4);P.rect(x+7,g-h+22,34,9,glow,.22);P.ell(x+38,g-h+42,2,2,pale,.82);}
    for(let i=0;i<13;i++){const x=i*34+8,y=10+(i*19%43),r=5+(i%4)*4;P.poly([[x-r,y],[x+r,y],[x,y+r*2]],i%2?pale:pg('#9fc6dd'),.48,{edge:.7});}
    P.ell(cx,g-17,76,9,pg('#a8cfdf'),.46,{edge:1.5});P.ell(cx,g-20,58,4,pg('#e1f0ed'),.55);
  } else if (id === 'rookery') {
    for(let i=0;i<9;i++){const x=13+i*47, y=42+(i%3)*22;P.ell(x,y,24,18,pg(i%2?'#9ba696':'#806e63'),.42,{edge:1.1});P.ell(x,y-3,15,10,pg('#c4b89b'),.42,{edge:.8});P.ell(x-4,y-4,2,2,ink,.7);P.ell(x+4,y-4,2,2,ink,.7);P.poly([[x-3,y],[x+3,y],[x,y+4]],pg('#d18e56'),.75);P.line([[x-17,y+13],[x+18,y+10]],ink,.5,1.5);}
    for(let i=0;i<6;i++){const x=33+i*69;P.line([[x,0],[x+((i%2)*20-8),g-25]],pg('#738b83'),.58,1.2);P.ell(x+((i%2)*20-8),g-26,12,5,glow,.38);}
    P.rect(0,g-14,w,14,pg('#8d9489'),.32);for(let i=0;i<7;i++)P.ell(i*61+12,g-14,15,5,pg('#a98b68'),.52,{edge:.8});
  } else if (id === 'serverpyre') {
    for(let i=0;i<7;i++){const x=11+i*57, top=27+(i%3)*13;P.rect(x,top,39,g-top,pg('#4b3031'),.55,{edge:1});for(let j=0;j<6;j++){const y=top+8+j*20;P.rect(x+5,y,29,13,pg('#302b37'),.68,{edge:.7});P.rect(x+10,y+4,8,2,j%2?glow:pg('#e28045'),.76);P.ell(x+25,y+6,2,2,pale,.7);}}
    for(let i=0;i<7;i++){const x=25+i*59,y=45+(i*29%63);P.poly([[x-7,y+19],[x-8,y+7],[x-2,y+11],[x,y],[x+6,y+12],[x+10,y+4],[x+9,y+19]],i%2?pg('#c45b35'):glow,.4,{jit:1.5});}
    P.poly([[0,g-8],[w*.28,g-17],[w*.51,g-5],[w*.76,g-18],[w,g-7],[w,g],[0,g]],pg('#563639'),.48,{edge:.5});
  } else if (id === 'gatespire') {
    for(let i=0;i<6;i++){const x=22+i*73, h=78+(i%3)*34;P.rect(x,g-h,14,h,pg('#854b48'),.56,{edge:1});P.poly([[x-12,g-h+2],[x+7,g-h-25],[x+26,g-h+2]],pg('#aa6a58'),.45,{edge:.9});P.ell(x+7,g-h-8,2,2,glow,.9);}
    for(let i=0;i<5;i++){const y=31+i*29;P.line([[cx-9-i*20,y],[cx+11+i*20,y]],pale,.55,1);P.poly([[cx-9-i*20,y],[cx,y-15],[cx+11+i*20,y]],col,.23,{edge:.6});}
    P.poly([[0,g-8],[cx-15,g-54],[cx+16,g-54],[w,g-8]],pg('#71484a'),.39,{edge:.8});
  } else if (id === 'foundry') {
    for(let i=0;i<6;i++){const x=19+i*66, y=34+(i%2)*13;P.rect(x,y,49,g-y,pg('#83776a'),.36,{edge:1});for(let j=0;j<6;j++){const yy=y+j*25;P.rect(x+5,yy+4,39,17,j%3?pg('#a79c8d'):pg('#5f5960'),.45,{edge:.9});P.rect(x+22,yy+8,8,3,glow,.52);}}
    const missing=room%4;P.rect(19+missing*66+4,49,39,17,pg('#383640'),.78,{edge:1.3});P.line([[cx-60,g-9],[cx-28,g-40],[cx+8,g-18],[cx+41,g-34]],glow,.7,1.5);P.ell(cx+41,g-34,4,4,pale,.76);
    for(let i=0;i<5;i++)P.rect(25+i*83,g-13-(i%2)*7,19,10,pg('#cdbb9e'),.42,{edge:.7});
  } else if (id === 'chorus') {
    for(let i=0;i<8;i++){const x=20+i*51, h=75+(i%4)*20;P.rect(x, g-h, 7,h,pg('#514160'),.62,{edge:1});P.ell(x+3.5,g-h,3.5,3.5,glow,.7);P.rect(x-8,g-h+11,24,4,pg('#8370a2'),.48);}
    for(let i=0;i<6;i++){const yy=45+i*16, a=9+(i%3)*4;P.line([[0,yy],[47,yy+a],[91,yy-a],[139,yy],[188,yy+a],[237,yy-a],[286,yy],[w,yy+a]],i%2?pale:glow,.5,1.1);}
    for(let i=0;i<7;i++){const x=35+i*55,y=40+(i*33%88);P.ell(x,y,3,5,pale,.65);P.ell(x+7,y+7,3,5,pale,.65);P.line([[x+3,y],[x+10,y+7],[x+10,y+18]],glow,.62,.9);}
  } else if (id === 'gatecity') {
    for(let i=0;i<4;i++){const x=30+i*107;P.rect(x,30,7,g-30,pg('#7d353d'),.48);P.rect(x+63,30,7,g-30,pg('#7d353d'),.48);P.poly([[x-10,40],[x+35,12],[x+80,40]],glow,.2,{edge:.8});P.ell(x+35,42,5,5,pale,.46);}
    P.poly([[0,g-10],[71,g-31],[129,g-13],[203,g-44],[271,g-18],[339,g-36],[w,g-13],[w,g],[0,g]],pg('#75504b'),.42,{edge:.7,jit:3});
    for(let i=0;i<8;i++){const x=(i*52+room*23)%w;P.rect(x,g-53-(i%3)*12,7,53+(i%3)*12,pg('#b2594d'),.36,{edge:.7});P.rect(x+2,g-46-(i%3)*12,2,4,glow,.75);}
  } else if (id === 'livehouse') {
    for(let i=0;i<5;i++){const x=18+i*82;P.rect(x,g-72,8,72,ink,.67);P.rect(x+8,g-67,56,5,pg('#a33f3b'),.54);P.gouache(x+36,g-78,2,glow);}
    for(let i=0;i<5;i++)P.ell(43+i*72,43+(i%2)*14,23,6,i%2?pg('#da7552'):glow,.18,{edge:.5});
    for(let i=0;i<4;i++){const x=54+i*94;P.rect(x,g-52,3,50,ink,.65);P.poly([[x-13,g-50],[x+16,g-48],[x+5,g-74],[x-4,g-71]],pg('#b24b42'),.42,{edge:.9});P.gouache(x+2,g-64,2,pale);}
    P.ell(cx,112,82,19,glow,.1,{edge:.4});
  } else if (id === 'rewind') {
    for(let i=0;i<6;i++){const x=31+i*67,y=39+(i%2)*19;P.rect(x-21,y-21,42,43,pg('#8b7892'),.28,{edge:1.3});P.ell(x-9,y,8,8,pg('#4d4458'),.7,{edge:.8});P.ell(x+9,y,8,8,pg('#4d4458'),.7,{edge:.8});P.line([[x-9,y-8],[x+9,y+8]],pale,.5,.7);}
    for(let j=0;j<5;j++){const y=40+j*27, dx=room%2?16:-12;P.line([[0,y],[cx-42,y+dx],[cx+39,y-dx],[w,y]],j%2?glow:pale,.48,1.2);}
    P.poly([[0,g-20],[cx-34,g-35],[cx+27,g-16],[w,g-37],[w,g],[0,g]],pg('#635769'),.42,{edge:.7});
  } else if (id === 'live') {
    for(let i=0;i<9;i++){const x=12+i*47;P.rect(x,g-93,6,93,pg('#613630'),.48);P.ell(x+3,g-94,3,3,glow,.72);}
    for(let i=0;i<4;i++){const y=43+i*25;P.poly([[0,y],[52,y-8],[101,y+7],[157,y-6],[213,y+9],[267,y-9],[w,y+3],[w,y+12],[0,y+12]],i%2?pg('#a34838'):glow,.18,{edge:.5});}
    for(let i=0;i<6;i++){const x=34+i*64;P.line([[x,g],[x+20,g-38],[x+42,g]],pale,.45,1);P.ell(x+20,g-39,4,4,glow,.8);}
    P.rect(cx-34,g-26,68,13,pg('#342e39'),.68,{edge:1});for(let i=0;i<5;i++)P.rect(cx-26+i*12,g-22,6,2,pale,.7);
  } else if (id === 'brineport') {
    for(let i=0;i<7;i++){const x=10+i*63,y=66+(i%3)*23;P.line([[x,0],[x,y],[x+8,y+9],[x+8,g]],pg('#625c51'),.56,2.4);P.rect(x+8,y+7,24,3,pg('#aa8053'),.48);}
    P.poly([[0,g-4],[70,g-28],[127,g-8],[183,g-38],[240,g-14],[311,g-29],[w,g-6],[w,g],[0,g]],pg('#627a74'),.5,{jit:3,edge:.6});
    for(let i=0;i<8;i++){const x=23+i*51,y=51+(i*27%67);P.ell(x,y,2,2,pale,.65);P.line([[x,y+2],[x-3,y+10]],glow,.3,.7);}
    P.rect(cx-56,g-41,112,6,pg('#977a57'),.5);for(let i=0;i<4;i++)P.rect(cx-48+i*31,g-34,5,26,ink,.55);
  } else if (id === 'redgate') {
    // handled alongside the red gate's concentric portal
  } else if (id === 'depot') {
    P.poly([[cx-4,17],[cx+4,17],[w,g],[0,g]],pg('#b3a17c'),.3,{edge:.5});
    for(let i=0;i<9;i++){const t=(i+1)/10,y=17+(g-17)*t,ww=2+t*18;P.rect(cx-ww,y,ww*2,1+t*2,i%2?pale:glow,.5);}
    for(let i=0;i<5;i++){const x=24+i*84,y=51+(i%2)*24;P.rect(x,y,53,27,pg('#99704c'),.44,{edge:1});P.rect(x+6,y+5,41,8,pg('#af946b'),.5);P.rect(x+11,y+17,4,12,ink,.5);P.rect(x+43,y+17,4,12,ink,.5);}
    P.ell(cx,g-16,97,11,pg('#c3a173'),.38);P.line([[cx-84,g-16],[cx+87,g-16]],pale,.5,1);
  } else if (id === 'mandolin') {
    for(let i=0;i<6;i++){const x=22+i*70,y=39+(i%3)*17;P.ell(x,y,24,21,pg('#8d6684'),.26,{edge:1});P.ell(x,y,16,14,pale,.5,{edge:.8});P.ell(x,y,5,5,glow,.72);P.line([[x,y+19],[x+(i%2?12:-12),g]],ink,.45,1);}
    for(let i=0;i<7;i++){const y=40+i*16;P.line([[0,y+Math.sin(i)*5],[w,y+Math.cos(i)*5]],i%2?pale:glow,.35,1);}
    P.ell(cx,g-13,72,18,pg('#a8bd8b'),.3);for(let i=0;i<8;i++)P.line([[cx-57+i*16,g-12],[cx-48+i*16,g-23-(i%3)*5]],pg('#52704c'),.5,1.2);
  } else if (id === 'lasagna') {
    for(let i=0;i<7;i++){const y=31+i*20, dx=(i%2)*20;P.poly([[-10,y+7],[52+dx,y],[106,y+12],[172+dx,y-3],[233,y+8],[300+dx,y],[410,y+13],[410,y+20],[-10,y+20]],i%2?pg('#a76b4d'):pg('#d1a274'),.47,{jit:1.5,edge:.7});}
    for(let i=0;i<7;i++){const x=26+i*58;P.ell(x,47+(i%3)*24,3,3,pg('#665a4c'),.78);P.ell(x+5,53+(i%3)*24,2,2,pale,.8);}
    P.rect(0,g-18,w,18,pg('#39383d'),.55);for(let i=0;i<14;i++)P.line([[i*31,g-18],[i*31+14,g]],ink,.64,.9);
  } else if (id === 'gatecity') {
    for(let i=0;i<5;i++){const x=15+i*83,h=88+(i%3)*25;P.rect(x,g-h,14,h,pg('#973e3e'),.46,{edge:1});P.rect(x+54,g-h,14,h,pg('#973e3e'),.46,{edge:1});P.poly([[x-8,g-h+3],[x+41,g-h-18],[x+80,g-h+3]],glow,.22);P.line([[x+7,g-h+15],[x+60,g-h+15]],pale,.42,.7);}
    P.rect(0,g-18,w,10,ink,.5);for(let i=0;i<13;i++){const x=i*33;P.rect(x,g-8,19,4,glow,.5);}
  }
}
// battle: a wide landscape with a low horizon, no buildings
function paintBattle(theme) { return painting('battle:' + theme, () => { const T = THEMES[theme], P = new Paint(W, H); P.seed = theme.length * 13; paintSkyGround(P, T, 86); for (let i = 0; i < 5; i++) PROPS[theme](P, 16 + rnd2(i, 31) * 288, 96 + rnd2(i, 32) * 6); P.rect(0, 150, W, 74, pg(T.ground).map(v => v * .9), .3, { jit: 3, grad: [0, 150, 0, 224, .4, 1] }); return P.out(); }); }
// the world map: a parchment with painted continents
function paintWorldMap() {
  return painting('worldmap', () => {
    const P = new Paint(W, H, [.93, .87, .74]);
    P.rect(0, 0, W, H, [.55, .7, .78], .4, { jit: 5, edge: .1, bloom: 1 });
    for (const L of WORLD.lands) { P.poly(L.pts, pg(L.col), .6, { jit: 3, edge: 1.2, gran: .6 }); P.line(L.pts.concat([L.pts[0]]), [.32, .22, .18], .6, .8); }
    for (let i = 0; i < 60; i++) { const x = rnd2(i, 41) * W, y = rnd2(i, 42) * H; if (WORLD.lands.some(L => rsInPoly(x, y, L.pts))) P.line([[x - 3, y + 2], [x, y - 3], [x + 3, y + 2]], [.36, .26, .2], .5, .6); }
    P.ell(W - 28, H - 28, 14, 14, [.75, .6, .4], .4, { edge: 1 }); P.line([[W - 28, H - 46], [W - 28, H - 10]], [.3, .2, .15], .7, .8); P.line([[W - 46, H - 28], [W - 10, H - 28]], [.3, .2, .15], .7, .8);
    P.rect(0, 0, W, H, [.6, .45, .3], .18, { jit: 0, edge: 0, grad: [W / 2, H / 2, 0, 0, 0, 1] });
    return P.out();
  });
}
// the crossing: open water, the ship small on it (used behind the sailing scene)
function paintSea() {
  return painting('sea', () => {
    const P = new Paint(W, H); P.sky(['#7aa8c0', '#b0ccd8', '#e8f0e8'].map(pg), 96, .8);
    for (let i = 0; i < 5; i++) P.ell(rnd2(i, 71) * W, 30 + rnd2(i, 72) * 30, 20 + rnd2(i, 73) * 26, 5, [1, .98, .94], .25, { jit: 5, edge: .4, gran: .1 });
    P.poly([[0, 96], [W, 96], [W, H], [0, H]], [.3, .48, .54], .6, { jit: 4, edge: .5, gran: .5 });
    for (let i = 0; i < 26; i++) P.line([[rnd2(i, 74) * W, 104 + rnd2(i, 75) * 110], [rnd2(i, 74) * W + 10, 104 + rnd2(i, 75) * 110]], [.85, .93, .95], .3, .7);
    const x = W * .32, y = 150; // the A.S.S., drawn small and honest
    const hull = [[x - 48, y], [x + 50, y], [x + 38, y + 16], [x - 38, y + 16]], sailF = [[x + 34, y - 70], [x + 64, y - 22], [x + 34, y - 16]], sailB = [[x + 30, y - 66], [x + 6, y - 22], [x + 30, y - 18]];
    for (const sh of [hull, sailF, sailB]) P.reserve(sh); // paper first: the sea wash is too dark to paint a boat over
    P.poly(hull, [.62, .44, .28], .65, { jit: 1.5 }); P.line(hull.concat([hull[0]]), [.32, .22, .18], .6, .8);
    P.rect(x + 30, y - 72, 4, 72, [.5, .42, .3], .6);
    P.poly(sailF, [.95, .93, .86], .45, { jit: 2 }); P.poly(sailB, [.9, .88, .8], .45, { jit: 2 });
    P.gouache(x + 50, y - 22, 1.4, [1, .98, .9]);
    return P.out();
  });
}
// a painted portrait: the rig's head and shoulders, big, washed and inked
function paintPortrait(key, rig, pose, sc = 4.4) {  return painting('port:' + key, () => {
    const S = rsRender(rig, pose || { a: {}, show: {} }, 260, 260, 130, 256, sc), P = new Paint(60, 60, [.95, .91, .82]);
    let top = 260, x0 = 260, x1 = 0; for (let y = 0; y < 260; y++) for (let x = 0; x < 260; x++) if (S.px[y * 260 + x]) { if (y < top) top = y; if (x < x0) x0 = x; if (x > x1) x1 = x; }
    const cx = Math.min(x1 - 50, Math.max(x0 + 50, (x0 + x1) / 2 + 8)) | 0, oy = top - 6;
    P.ell(30, 30, 30, 34, [.85, .72, .6], .35, { jit: 4, bloom: 1 });
    for (let y = 0; y < 60; y++) for (let x = 0; x < 60; x++) { const sy = oy + y * 2, sx = cx - 60 + x * 2; if (sy < 0 || sy >= 260 || sx < 0 || sx >= 260) continue; const c = S.px[sy * 260 + sx]; if (!c) continue; const r = (c & 255) / 255, g = ((c >> 8) & 255) / 255, b = ((c >> 16) & 255) / 255, i = (y * 60 + x) * 3, al = .82 + .1 * noise2(x * .3, y * .3); P.c[i] = P.c[i] * (1 - al) + r * al; P.c[i + 1] = P.c[i + 1] * (1 - al) + g * al; P.c[i + 2] = P.c[i + 2] * (1 - al) + b * al; }
    return P.out();
  });
}
