'use strict';
// ================= DARK MONDAY: the first-person dungeon view =================
// A grid world made of light. Cells are blocks or open floor; the party stands at the rear edge of its cell and looks ahead.
// Faces are described in (u, v) face space so wall decoration and circuit traces work on front and side faces alike.
const DV = { x: 8, y: 8, w: 248, h: 160 }, FOC = 160, ZN = .25, MAXD = 5;
const VBUF = newBuf(DV.w, DV.h);
const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], DIRN = ['N', 'E', 'S', 'W'];
const BLOCKS = '#SX';
const RIMM = hex('#ff40d0'), RIMC = hex('#30e0ff');

// ---------- themes (12-bit friendly hex) ----------
const THEMES = {
  cellar:  { ceil0: '#04020a', ceil1: '#2a1608', floor0: '#2a1608', floor1: '#0c0604', wall: '#1c1220', wall2: '#281a2a', edge: '#ffb040', edge2: '#b0601c', fog: '#2a1608', glow: '#ff8a20', trace: '#d07018' },
  tunnels: { ceil0: '#02060c', ceil1: '#08303c', floor0: '#08303c', floor1: '#040e14', wall: '#0c1c2a', wall2: '#102838', edge: '#38e8ff', edge2: '#1890b0', fog: '#08303c', glow: '#30d8ff', trace: '#2cb8d8' },
  dance:   { ceil0: '#08020c', ceil1: '#40104a', floor0: '#40104a', floor1: '#100418', wall: '#1c0c28', wall2: '#2c1038', edge: '#ff40d0', edge2: '#ffe040', fog: '#40104a', glow: '#ff40d0', trace: '#ffe040', checker: ['#1c0a28', '#0c0414'] },
  crypt:   { ceil0: '#02040c', ceil1: '#102050', floor0: '#102050', floor1: '#040810', wall: '#0c1430', wall2: '#141e40', edge: '#80b8ff', edge2: '#3860c0', fog: '#102050', glow: '#6098ff', trace: '#4878e0' },
  foundry: { ceil0: '#0a0402', ceil1: '#501c08', floor0: '#501c08', floor1: '#140804', wall: '#241410', wall2: '#321c14', edge: '#ff7020', edge2: '#a0a8b8', fog: '#501c08', glow: '#ff6010', trace: '#c8d0e0' },
  sanctum: { ceil0: '#0a0430', ceil1: '#ff6a48', floor0: '#5a2a58', floor1: '#08060e', wall: '#14102a', wall2: '#1e1a3c', edge: '#ffe8a0', edge2: '#a888e8', fog: '#7a3a60', glow: '#ffe090', trace: '#d8c880', wallH: .6, sky: 1 },
};
const _th = {};
function theme(n) { if (_th[n]) return _th[n]; const t = {}; for (const k in THEMES[n]) { const v = THEMES[n][k]; t[k] = k === 'checker' ? v.map(hex) : typeof v === 'string' ? hex(v) : v; } return _th[n] = t; }

let TH = null, CAM = null, LV = null;
const fogT = z => clamp((z - .9) / (CAM && CAM.dark ? 1.7 : 5.5), 0, 1);

// ---------- level cells ----------
const cellCh = (lv, x, y) => (y < 0 || x < 0 || y >= lv.h || x >= lv.w) ? '#' : lv.rows[y][x];
const isBlock = (lv, x, y) => BLOCKS.indexOf(cellCh(lv, x, y)) >= 0;
function viewCell(l, d) { const r = (CAM.dir + 1) & 3; return [CAM.x + DX[CAM.dir] * d + DX[r] * l, CAM.y + DY[CAM.dir] * d + DY[r] * l]; }

// ---------- projection and faces ----------
const proj = (x, y, z) => { const zz = Math.max(z, .05); return [DV.w / 2 + FOC * x / zz, DV.h / 2 - FOC * y / zz]; };
const pt = (F, u, v) => proj(F.O[0] + u * F.U[0] + v * F.V[0], F.O[1] + u * F.U[1] + v * F.V[1], F.O[2] + u * F.U[2] + v * F.V[2]);
const wallH = () => (TH && TH.wallH) || 1;
const frontFace = (xl, xr, z) => ({ O: [xl - CAM.cx, -.5, z - CAM.cz], U: [xr - xl, 0, 0], V: [0, wallH(), 0], u0: 0, u1: 1, z: z - CAM.cz, side: 0 });
function sideFace(x, z0, z1) { // runs along z; returns null when it is all behind the near plane
  z0 -= CAM.cz; z1 -= CAM.cz; if (z1 <= ZN) return null;
  return { O: [x - CAM.cx, -.5, z0], U: [0, 0, z1 - z0], V: [0, wallH(), 0], u0: z0 < ZN ? (ZN - z0) / (z1 - z0) : 0, u1: 1, z: (Math.max(z0, ZN) + z1) / 2, side: 1 };
}
const fp = (F, pts, c) => polyF(pts.map(p => pt(F, p[0], p[1])), c);
function fl(F, pts, c, th = 1) { for (let i = 0; i + 1 < pts.length; i++) { const a = pt(F, pts[i][0], pts[i][1]), b = pt(F, pts[i + 1][0], pts[i + 1][1]); lineF(a[0], a[1], b[0], b[1], c, th); } }

// ---------- decorations on wall faces ----------
const DECOR = {
  torch(F, o) { const f = 1 + Math.sin(frame * .3 + o.seed) * .12;
    fp(F, [[.46, .3], [.54, .3], [.56, .5], [.44, .5]], o.acc); fp(F, [[.4, .5], [.6, .5], [.56, .58], [.44, .58]], o.edge);
    fp(F, [[.5, .86], [.44, .64], [.5, .6], [.56, .64]], mix(TH.glow, WHITE, .3)); fp(F, [[.5, .74], [.47, .64], [.53, .64]], WHITE);
    const c = pt(F, .5, .68), r = Math.max(8, 70 / o.z) * f; glow(c[0], c[1], r, TH.glow, .75 * (1 - fogT(o.z) * .6)); },
  lever(F, o) { fp(F, [[.4, .35], [.6, .35], [.6, .65], [.4, .65]], o.acc); const up = o.st ? 1 : 0;
    fl(F, [[.5, .5], [.5, up ? .8 : .22]], o.edge, 2); const k = pt(F, .5, up ? .82 : .2); rectF(k[0] - 1, k[1] - 1, 3, 3, up ? TH.glow : o.edge); },
  button(F, o) { fp(F, [[.4, .4], [.6, .4], [.6, .6], [.4, .6]], o.acc); fp(F, [[.44, .44], [.56, .44], [.56, .56], [.44, .56]], o.st ? TH.glow : o.edge); },
  rune(F, o) { const pts = []; for (let i = 0; i <= 12; i++) pts.push([.5 + Math.cos(i / 12 * 6.283) * .26, .5 + Math.sin(i / 12 * 6.283) * .26]);
    fl(F, pts, o.edge); fl(F, [[.5, .3], [.5, .7]], o.edge); fl(F, [[.36, .42], [.5, .56], [.64, .42]], o.edge);
    const c = pt(F, .5, .5); glow(c[0], c[1], Math.max(6, 34 / o.z), TH.glow, .35); },
  niche(F, o) { fp(F, [[.3, .25], [.7, .25], [.7, .62], [.3, .62]], BLACK); fl(F, [[.3, .25], [.7, .25], [.7, .62], [.3, .62], [.3, .25]], o.edge); },
  sign(F, o) { fp(F, [[.22, .4], [.78, .4], [.78, .7], [.22, .7]], o.acc); for (let i = 0; i < 3; i++) fl(F, [[.28, .48 + i * .07], [.72 - (i & 1) * .14, .48 + i * .07]], o.edge); },
  console(F, o) { fp(F, [[.2, .3], [.8, .3], [.8, .74], [.2, .74]], o.acc); fp(F, [[.26, .38], [.74, .38], [.74, .68], [.26, .68]], BLACK); for (let i = 0; i < 4; i++) fl(F, [[.3, .44 + i * .06], [.3 + .1 + ((frame >> 3) + i * 3) % 5 * .06, .44 + i * .06]], i & 1 ? o.edge : mix(TH.glow, WHITE, .2)); if ((frame >> 4) & 1) fp(F, [[.62, .6], [.68, .6], [.68, .66], [.62, .66]], TH.glow); const c = pt(F, .5, .52); glow(c[0], c[1], Math.max(8, 40 / o.z), TH.glow, .3); },
  socket(F, o) { fp(F, [[.4, .4], [.6, .4], [.6, .6], [.4, .6]], BLACK); fl(F, [[.4, .4], [.6, .4], [.6, .6], [.4, .6], [.4, .4]], o.edge); if (o.st) fp(F, [[.5, .62], [.44, .5], [.5, .38], [.56, .5]], TH.glow); },
  eye(F, o) { const pts = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * 6.283; pts.push([.5 + Math.cos(a) * .3, .5 + Math.sin(a) * .15]); }
    fl(F, pts, o.edge); const c = pt(F, .5, .5); glow(c[0], c[1], Math.max(5, 20 / o.z), mix(TH.glow, hex('#ff3030'), .5), .6); fp(F, [[.5, .62], [.43, .5], [.5, .38], [.57, .5]], hex('#ff3030')); },
};

// ---------- one face ----------
function drawFace(F, o) {
  const z = F.z, t = fogT(z), seed = o.seed || 0;
  let base = mix(o.alt ? TH.wall2 : TH.wall, TH.fog, t * .8); if (F.side) base = mix(base, BLACK, .3);
  const rim = o.rim ? mix(TH.edge, o.rim < 0 ? RIMM : RIMC, .5) : TH.edge, edge = mix(rim, TH.fog, t * .7), acc = mix(TH.edge2, TH.fog, t * .75), trace = mix(TH.trace, TH.fog, t * .8);
  const u0 = F.u0, u1 = F.u1, v0 = o.v0 || 0;
  fp(F, [[u0, v0], [u1, v0], [u1, 1], [u0, 1]], base);
  fp(F, [[u0, Math.max(v0, .84)], [u1, Math.max(v0, .84)], [u1, 1], [u0, 1]], mix(base, edge, .1)); fp(F, [[u0, v0], [u1, v0], [u1, v0 + .1], [u0, v0 + .1]], mix(base, BLACK, .35));
  if (z < 4.2) { const s = ((seed * 7) % 5) / 10 + .06; fp(F, [[u0 + (u1 - u0) * s, v0], [u0 + (u1 - u0) * (s + .1), v0], [u0 + (u1 - u0) * (s + .26), 1], [u0 + (u1 - u0) * (s + .16), 1]], mix(base, edge, .1)); }
  if (z < 4.8 && !o.noPanel) {
    const a = u0 + (u1 - u0) * .08, b = u0 + (u1 - u0) * .92;
    fl(F, [[a, .1], [b, .1], [b, .9], [a, .9], [a, .1]], acc);
    const h1 = hash(seed, 1), h2 = hash(seed, 2), va = .22 + h1 * .2, vb = .56 + h2 * .22, ua = u0 + (u1 - u0) * (.18 + h1 * .2), ub = u0 + (u1 - u0) * (.62 + h2 * .2);
    fl(F, [[a, va], [ua, va], [ua, va + .12], [ub, va + .12]], trace); fl(F, [[b, vb], [ub, vb], [ub, vb - .1], [ua, vb - .1]], trace);
    const n1 = pt(F, ua, va), n2 = pt(F, ub, vb - .1); pset(n1[0], n1[1], edge); pset(n2[0], n2[1], edge);
  }
  // bright outer edges: the verticals read first
  const th = z < 1.6 ? 2 : 1;
  fl(F, [[u0, 0], [u0, 1]], edge, F.u0 > 0 ? 1 : th); fl(F, [[u1, 0], [u1, 1]], edge, th);
  if (z < 3.2) { const bl = mix(edge, base, .6); fl(F, [[u0, 0], [u0, 1]], bl, 1); }
  fl(F, [[u0, 1], [u1, 1]], edge); fl(F, [[u0, v0], [u1, v0]], edge);
  if (o.deco && z < 5.2) { const dd = DECOR[o.deco.k]; if (dd) dd(F, { edge, acc, seed, z, st: o.deco.st }); }
}

// ---------- floor marks, doors, sprites ----------
function floorPoly(l, d, inset) { const z0 = d - CAM.cz, z1 = d + 1 - CAM.cz, a = l - .5 + inset - CAM.cx, b = l + .5 - inset - CAM.cx, zi = inset;
  const q = [[a, z0 + zi], [b, z0 + zi], [b, z1 - zi], [a, z1 - zi]].filter(p => true); return q.map(p => proj(p[0], -.5, Math.max(p[1], ZN))); }
function drawFloorMark(ch, l, d, st) {
  if (d + 1 - CAM.cz <= ZN) return; const t = fogT(d + .5 - CAM.cz), edge = mix(TH.edge, TH.fog, t * .7), acc = mix(TH.edge2, TH.fog, t * .75);
  if (ch === 'P') { const q = floorPoly(l, d, .08); polyF(q, BLACK); for (let i = 0; i < 4; i++) lineF(q[i][0], q[i][1], q[(i + 1) % 4][0], q[(i + 1) % 4][1], edge); }
  else if (ch === 'p') { const q = floorPoly(l, d, .22); polyF(q, st ? mix(TH.glow, BLACK, .2) : mix(acc, BLACK, .4)); for (let i = 0; i < 4; i++) lineF(q[i][0], q[i][1], q[(i + 1) % 4][0], q[(i + 1) % 4][1], st ? WHITE : edge); }
  else if (ch === '>' || ch === '<') { for (let k = 0; k < 3; k++) { const q = floorPoly(l, d, .12 + k * .12); polyF(q, mix(ch === '>' ? TH.edge : TH.edge2, BLACK, .15 + k * .25)); } }
  else if (ch === 'T') { for (const r of [.4, .25]) { const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + frame * .05 * (r > .3 ? 1 : -1); pts.push(proj(l + Math.cos(a) * r - CAM.cx, -.5, Math.max(d + .5 + Math.sin(a) * r - CAM.cz, ZN))); }
      for (let i = 0; i < 14; i += 2) lineF(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r > .3 ? edge : TH.glow); } }
}
function drawDoor(l, d, st) { // a slab across the middle of the cell that slides up into the lintel
  const F = frontFace(l - .5, l + .5, d + .5); if (F.z <= ZN) return;
  const open = st ? st.open : 0, t = fogT(F.z);
  if (open < .98) { drawFace(F, { seed: 3, alt: 1, v0: open, deco: null, noPanel: 1 }); const lo = Math.max(open, 0), ac = mix(TH.edge2, TH.fog, t * .7), ed = mix(TH.edge, TH.fog, t * .6);
    fl(F, [[.5, lo], [.5, 1]], ed, F.z < 1.6 ? 2 : 1); fl(F, [[.08, lo + (1 - lo) * .3], [.92, lo + (1 - lo) * .3]], ac); fl(F, [[.08, lo + (1 - lo) * .7], [.92, lo + (1 - lo) * .7]], ac);
    if (F.z < 4) { const c = pt(F, .62, lo + (1 - lo) * .5); rectF(c[0] - 1, c[1] - 2, 3, 5, TH.glow); } }
  const edge = mix(TH.edge, TH.fog, t * .5); fl(F, [[0, 0], [0, 1], [1, 1], [1, 0]], edge, F.z < 1.6 ? 2 : 1);
  if (st && st.locked && open < .5) { const c = pt(F, .5, .5); rectF(c[0] - 2, c[1] - 2, 5, 5, hex('#ff3030')); }
}
function blitScaled(b, cx, by, k, fog, fa) { // bottom-center anchored, nearest neighbor; fog tints only the sprite's own pixels
  const w = Math.max(1, Math.round(b.w * k)), h = Math.max(1, Math.round(b.h * k)), x0 = Math.round(cx - w / 2), y0 = Math.round(by - h);
  for (let j = 0; j < h; j++) { const yy = y0 + j; if (yy < 0 || yy >= FH) continue; const sy = Math.min(b.h - 1, (j / k) | 0);
    for (let i = 0; i < w; i++) { const xx = x0 + i; if (xx < 0 || xx >= FW) continue; let c = b.d[sy * b.w + Math.min(b.w - 1, (i / k) | 0)]; if (c) { if (fa > .02) c = mix(c, fog, fa); FB[yy * FW + xx] = c; } } }
}
function drawEnt(e, l, d) {
  const z = d + .5 + (e.dz || 0) - CAM.cz; if (z <= ZN || !e.spr) return;
  const k = FOC / z * (e.size || .9) / e.spr.h, sx = DV.w / 2 + FOC * (l + (e.dx || 0) - CAM.cx) / z, by = DV.h / 2 + FOC * .5 / z, t = fogT(z);
  if (e.shadow !== 0) { ellF(sx, by, e.spr.w * k * .32, 2 + 3 / z, mix(BLACK, TH.fog, .4)); }
  if (e.m) { e.m.sx = DV.x + sx; e.m.sy = DV.y + by - e.spr.h * k * .6; }
  blitScaled(e.spr, sx, by - (e.lift || 0) * FOC / z, k, TH.fog, e.noFog ? 0 : t * .5);
}

// ---------- the view ----------
function drawSky() { // a painted sunset: a black sun ringed by a calendar, two moons, stars. what you see depends on the way you face
  const hz = DV.h / 2, d = CAM.dir;
  for (let i = 0; i < 40; i++) pset(hash(i, 5, 9) * DV.w, hash(i, 6, 9) * (hz - 20), i % 5 ? mix(TH.edge2, WHITE, .3) : WHITE);
  if (d === 0) { const sx = DV.w / 2 + 34, sy = hz - 26; ellF(sx, sy, 30, 30, hex('#ffd890')); ellF(sx, sy, 22, 22, hex('#06020e')); for (let i = 0; i < 31; i++) { const a = i / 31 * 6.283, r0 = 24, r1 = (i % 7 === 0 ? 31 : 28); lineF(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0, sx + Math.cos(a) * r1, sy + Math.sin(a) * r1, hex('#ffe8a0')); }
    ellF(DV.w / 2 - 58, hz - 52, 9, 9, hex('#c8b8ff')); ellF(DV.w / 2 - 58, hz - 52, 9, 9, hex('#c8b8ff')); lineF(DV.w / 2 - 74, hz - 46, DV.w / 2 - 42, hz - 58, hex('#a898e8')); }
  if (d === 3) { ellF(DV.w / 2 + 20, hz - 40, 16, 16, hex('#d8d0ff')); ellF(DV.w / 2 + 14, hz - 44, 6, 6, hex('#b0a4e8')); }
  rectF(0, hz - 8, DV.w, 8, hex('#ff8a58')); for (let i = 0; i < 9; i++) rectF(0, hz - 8 + i, DV.w, 1, mix(hex('#ff8a58'), hex('#7a3a60'), i / 9));
}
function bgFloorCeil() {
  gradV(0, 0, DV.w, DV.h / 2, TH.ceil0, TH.ceil1, 8); gradV(0, DV.h / 2, DV.w, DV.h / 2, TH.floor0, TH.floor1, 8); if (TH.sky) drawSky();
  const hz = DV.h / 2;
  for (let z = 1; z <= 7; z++) { const zz = z - CAM.cz; if (zz <= ZN) continue; const y = proj(0, -.5, zz)[1], c = mix(mix(TH.edge2, WHITE, .12), TH.fog, fogT(zz) * .8); rectF(0, y, DV.w, 1, c); if (!TH.sky) rectF(0, 2 * hz - y - 1, DV.w, 1, mix(c, BLACK, .5)); }
  for (let k = -5; k <= 4; k++) { const x = k + .5 - CAM.cx;
    for (let s = 0; s < 6; s++) { const z0 = Math.max(ZN, s + .2 - CAM.cz), z1 = s + 1.2 - CAM.cz; if (z1 <= ZN) continue; const a = proj(x, -.5, z0), b = proj(x, -.5, z1), c = mix(mix(TH.edge2, WHITE, .12), TH.fog, fogT((z0 + z1) / 2) * .8);
      lineF(a[0], a[1], b[0], b[1], c); if (!TH.sky) lineF(a[0], 2 * hz - a[1], b[0], 2 * hz - b[1], mix(c, BLACK, .55)); } }
}
// ents: [{x, y, spr, size, dx, dz, lift}] in world cells. lv.st = { door: {'x,y': {open, locked}}, dec: {'x,y,n': state}, mark: {'x,y': state} }
function renderView(lv, cam, ents = []) {
  LV = lv; CAM = Object.assign({ cx: 0, cz: 0 }, cam); TH = theme(lv.theme);
  VBUF.d.fill(0); target(VBUF.d, DV.w, DV.h);
  try {
    bgFloorCeil();
    for (let d = MAXD; d >= 0; d--) {
      const order = []; for (let l = -3; l <= 3; l++) order.push(l); order.sort((a, b) => Math.abs(b) - Math.abs(a));
      for (const l of order) {
        const [wx, wy] = viewCell(l, d), ch = cellCh(lv, wx, wy), key = wx + ',' + wy;
        if (BLOCKS.indexOf(ch) >= 0) {
          const seed = wx * 31 + wy * 17;
          const nrm = (dir) => (CAM.dir + dir) & 3, dec = (n) => { const dd = lv.decor && lv.decor[wx + ',' + wy + ',' + DIRN[n]]; return dd ? { k: dd.k, st: lv.st && lv.st.dec && lv.st.dec[wx + ',' + wy + ',' + DIRN[n]] } : null; };
          if (d >= 1 && !isBlock(lv, ...viewCell(l, d - 1))) { const F = frontFace(l - .5, l + .5, d); if (F.z > ZN) drawFace(F, { seed, alt: (wx + wy) & 1, deco: dec(nrm(2)) }); }
          if (l !== 0 && !isBlock(lv, ...viewCell(l - Math.sign(l), d))) { const F = sideFace(l - Math.sign(l) * .5, d, d + 1); if (F) drawFace(F, { seed: seed + 5, rim: l < 0 ? -1 : 1, alt: (wx + wy) & 1, deco: dec(nrm(l > 0 ? 3 : 1)) }); }
        } else {
          if (TH.checker) { const q = floorPoly(l, d, 0); if (d + 1 - CAM.cz > ZN) polyF(q, TH.checker[(wx + wy) & 1]); }
          if (ch === 'D') drawDoor(l, d, lv.st && lv.st.door[key]);
          else if ('P>T<'.indexOf(ch) >= 0) drawFloorMark(ch, l, d);
          else if (ch === 'p') drawFloorMark('p', l, d, lv.st && lv.st.mark[key]);
          for (const e of ents) if (e.x === wx && e.y === wy) drawEnt(e, l, d);
        }
      }
    }
  } finally { screenTarget(); }
  return VBUF;
}
