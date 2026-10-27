'use strict';
// ================= STICK UP: building interiors =================
// a room is a footprint of TL.room tiles (cars can't drive in), thin wall rects, a roof that lifts when Carl walks in,
// furniture boxes, residents and A-prompts. it all lives in the one city, so cops, missions and the camera need no second world.
const IWT = 6;
let INTS = [], IPOIS = [], INN = null;
const IOBT = new Map(), ihxm = {}, ihx = s => ihxm[s] || (ihxm[s] = hex(s));
function intReset() { INTS = []; IPOIS = []; INN = null; IOBT.clear(); }
// ---------------- obstacles: thin walls and furniture, bucketed per tile ----------------
function addOb(x0, y0, x1, y1, los) {
  const r = [x0, y0, x1, y1, los ? 1 : 0];
  for (let ty = Math.floor(y0 / T); ty <= Math.floor((y1 - .01) / T); ty++) for (let tx = Math.floor(x0 / T); tx <= Math.floor((x1 - .01) / T); tx++) { const k = ty * MW + tx; let l = IOBT.get(k); if (!l) IOBT.set(k, l = []); l.push(r); }
}
function obAt(x, y, losOnly) { const l = IOBT.get(Math.floor(y / T) * MW + Math.floor(x / T)); if (!l) return false; for (const r of l) if (x >= r[0] && x < r[2] && y >= r[1] && y < r[3] && (!losOnly || r[4])) return true; return false; }
function wallBetween(a, b) { const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / 4); for (let i = 1; i < n; i++) { const t = i / n; if (obAt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, true)) return true; } return false; }
const intAt = (x, y) => INTS.find(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) || null;
// ---------------- builders ----------------
function iShell(name, tx, ty, tw, th, o = {}) {
  const x = tx * T, y = ty * T, w = tw * T, h = th * T, z = o.z || 30, dc = x + (o.door === undefined ? tw >> 1 : o.door) * T + T / 2, gw = o.doorW || 26;
  const fc = IFLOOR[o.floor || 'wood'];
  const RM = { name, x, y, w, h, z, cx: x + w / 2, cy: y + h / 2, parts: [], decals: [], folks: [], open: 0, inside: 0, spawned: 0, fk: fc[0], fc: fc.slice(1).map(ihx), wallC: hex(o.wall || '#b6b6a0'), roofC: hex(o.roof || '#6d6d6d'), inner: hex(o.inner || '#e0d4bc'), sign: o.sign, door: { x: dc, y: y + h, g0: dc - gw / 2, g1: dc + gw / 2 } };
  { const [cr, cg, cb] = chan(RM.roofC); RM.capC = cr * .3 + cg * .59 + cb * .11 > 185 ? mix(RM.roofC, BLACK, .3) : mix(RM.roofC, WHITE, .12); } RM.fit = clamp(Math.min((W - 70) / w, (H - 70) / h), 1.2, 2.4);
  fillT(tx, ty, tw, th, TL.room);
  iWall(RM, x, y, w, IWT, ['o', 'e', 'i', 'e']); iWall(RM, x, y, IWT, h, ['e', 'i', 'e', 'o']); iWall(RM, x + w - IWT, y, IWT, h, ['e', 'o', 'e', 'i']);
  iWall(RM, x, y + h - IWT, RM.door.g0 - x, IWT, ['i', 'e', 'o', 'e']); iWall(RM, RM.door.g1, y + h - IWT, x + w - RM.door.g1, IWT, ['i', 'e', 'o', 'e']);
  BLD.push({ x, y, w, h, z, wall: RM.wallC, roof: RM.roofC, roofOf: RM, noShadow: 1, sign: o.sign, neon: o.neon });
  INTS.push(RM); return RM;
}
function iWall(RM, x, y, w, h, ft) { if (w <= 0 || h <= 0) return; const b = { x, y, w, h, z: RM.z, wall: RM.wallC, roof: RM.capC, ft, shellOf: RM }; BLD.push(b); RM.parts.push(b); addOb(x, y, x + w, y + h, 1); }
// a wall inside the room (relative px), horizontal or vertical
function iPart(RM, rx, ry, rw, rh) { iWall(RM, RM.x + rx, RM.y + ry, rw, rh, rw >= rh ? ['i', 'e', 'i', 'e'] : ['e', 'i', 'e', 'i']); }
function iProp(RM, pk, rx, ry, rw, rh, o = {}) {
  const K = IPK[pk] || IPK.box, b = { x: RM.x + rx, y: RM.y + ry, w: rw, h: rh, z: o.z || K.z, wall: ihx(o.wall || K.wall), roof: ihx(o.top || K.top), pk, K, o, shellOf: RM };
  BLD.push(b); RM.parts.push(b); if (!o.walk) addOb(b.x, b.y, b.x + rw, b.y + rh, 0); return b;
}
function iPoi(RM, rx, ry, label, use, o = {}) { const p = Object.assign({ x: RM.x + rx, y: RM.y + ry, r: 17, label, use, RM }, o); IPOIS.push(p); return p; }
function iFolk(RM, rx, ry, o = {}) { const f = Object.assign({ RM, rx, ry, q: null, cool: 0, mode: 'wander' }, o); RM.folks.push(f); return f; }
// ---------------- furniture ----------------
const IPROD = ['#db2424', '#dbb624', '#24b649', '#2492db', '#ff6db6', '#b6b6b6', '#db7a24', '#9249db'];
function stripes(b, tr, cols, seed = 0) { const hz = b.w >= b.h, L = hz ? b.w : b.h; for (let i = 1, k = 0; i < L - 1; i += 3, k++) { const c = ihx(cols[(k + (b.o.seed | 0) + seed) % cols.length]); if (hz) tr(i, 1, 2, b.h - 2, c); else tr(1, i, b.w - 2, 2, c); } }
const IPK = {
  box: { z: 10, wall: '#7a5a38', top: '#a88458' },
  crate: { z: 11, wall: '#7a5a38', top: '#a88458', deco: (b, tr) => { tr(0, 0, b.w, 1, ihx('#5a3e22')); tr(0, b.h - 1, b.w, 1, ihx('#5a3e22')); tr(0, 0, 1, b.h, ihx('#5a3e22')); tr(b.w - 1, 0, 1, b.h, ihx('#5a3e22')); } },
  shelf: { z: 13, wall: '#5a4a3a', top: '#8a7658', deco: (b, tr) => stripes(b, tr, IPROD) },
  bookshelf: { z: 20, wall: '#4a3220', top: '#6d4a2a', deco: (b, tr) => stripes(b, tr, ['#8a1e2a', '#2a4a8a', '#2a6a3a', '#b08a2a', '#6d3a6d', '#9a8a6a']) },
  rack: { z: 15, wall: '#5a3a1a', top: '#7a5226', deco: (b, tr) => stripes(b, tr, ['#b0824a', '#d8b070', '#8a5a2a', '#c89a5a', '#e8c890']) },
  cooler: { z: 18, wall: '#c8d0d8', top: '#8ae0ff', deco: (b, tr) => { for (let i = 8; i < b.w - 2; i += 10) tr(i, 0, 1, b.h, ihx('#4a98b8')); tr(1, 1, b.w - 2, 2, ihx('#a8d8e8')); } },
  slush: { z: 20, wall: '#d8d8e0', top: '#ff49db', deco: (b, tr) => { tr(2, 2, 4, b.h - 4, ihx('#24dbff')); tr(b.w - 6, 2, 4, b.h - 4, ihx('#ffdb24')); } },
  counter: { z: 9, wall: '#7a5a38', top: '#b89868', deco: (b, tr) => {
    const o = b.o; if (o.reg !== undefined) { tr(o.reg, 1, 9, b.h - 2, ihx('#3a3a44')); tr(o.reg + 1, 2, 7, 3, (b.shellOf.open > .5 && (frame >> 5) & 1) ? ihx('#6dff92') : ihx('#24b649')); tr(o.reg + 1, 6, 7, 1, ihx('#8a8a98')); }
    if (o.glass) { tr(1, 1, b.w - 2, b.h - 2, ihx('#8ab6c8')); for (let i = 4; i < b.w - 4; i += 7) { tr(i, 3, 3, 3, ihx(i % 14 < 7 ? '#db8ab0' : '#b6824a')); tr(i + 1, 4, 1, 1, ihx('#b6b6b6')); } }
  } },
  table: { z: 8, wall: '#6d4a2a', top: '#c8a070', deco: (b, tr) => { if (b.o.sticks) for (let i = 3; i < b.w - 3; i += 5) tr(i, 2, 1, b.h - 4, ihx(i % 10 < 5 ? '#d8b070' : '#8a5a2a')); else tr(b.w / 2 - 2, b.h / 2 - 1, 4, 3, ihx('#b6b6a8')); } },
  stool: { z: 7, wall: '#3a3a44', top: '#db2424', deco: (b, tr) => tr(1, 1, b.w - 2, 1, ihx('#ff7a7a')) },
  chair: { z: 8, wall: '#4a3220', top: '#8a5a3a', deco: (b, tr) => tr(1, 1, b.w - 2, 2, ihx('#6d4226')) },
  couch: { z: 9, wall: '#6a2a3a', top: '#a84a5a', deco: (b, tr) => { const s = b.o.back || 'n'; if (s === 'n') tr(0, 0, b.w, 3, ihx('#7a2a3a')); else if (s === 's') tr(0, b.h - 3, b.w, 3, ihx('#7a2a3a')); else if (s === 'w') tr(0, 0, 3, b.h, ihx('#7a2a3a')); else tr(b.w - 3, 0, 3, b.h, ihx('#7a2a3a')); } },
  bed: { z: 8, wall: '#4a3a5a', top: '#7a9ac8', deco: (b, tr) => { tr(2, 1, b.w - 4, 8, ihx('#b6b6c0')); tr(2, 12, b.w - 4, b.h - 14, ihx('#4a6aa8')); tr(2, 12, b.w - 4, 1, ihx('#a8c0e8')); } },
  tv: { z: 12, wall: '#24242c', top: '#16161e', deco: (b, tr) => { const f = (frame >> 3) % 4; tr(2, 1, b.w - 4, b.h - 2, ihx(['#3a4a8a', '#8a3a6a', '#3a8a6a', '#8a7a3a'][f])); } },
  plant: { z: 14, wall: '#8a4a2a', top: '#c8703a', custom: (b, a, c) => { const s = Math.abs(c[0] - a[0]), px = a[0] + s / 2, py = a[1] + (c[1] - a[1]) / 2, r = Math.max(3, s * .62); circF(px, py, r, ihx('#2a7a2a')); circF(px - r * .3, py - r * .3, r * .55, ihx('#4aa23a')); } },
  desk: { z: 10, wall: '#4a3220', top: '#7a5226', deco: (b, tr) => { tr(4, 2, b.w - 8, b.h - 4, ihx('#3a5a3a')); tr(6, 3, 6, 4, ihx('#b6b6a8')); tr(b.w - 12, 3, 4, 4, ihx('#ffdb49')); } },
  cabinet: { z: 15, wall: '#5a604a', top: '#8a8a7a', deco: (b, tr) => { const hz = b.w >= b.h, L = hz ? b.w : b.h; for (let i = 6; i < L - 2; i += 7) { if (hz) tr(i, 0, 1, b.h, ihx('#5a6068')); else tr(0, i, b.w, 1, ihx('#5a6068')); } } },
  piano: { z: 12, wall: '#16161e', top: '#24242e', deco: (b, tr) => { for (let i = 2; i < b.w - 2; i += 2) tr(i, b.h - 4, 1, 3, ihx('#b6b6ae')); tr(2, 2, b.w - 4, 3, ihx('#3a3a48')); } },
  fire: { z: 14, wall: '#6d4a3a', top: '#2a1a14', deco: (b, tr) => { const f = (frame >> 2) & 3; tr(b.w / 2 - 7, b.h - 6, 14, 5, ihx('#ff6d24')); tr(b.w / 2 - 4 + (f & 1), b.h - 7, 8, 4, ihx('#ffdb49')); } },
  stairs: { z: 12, wall: '#8a6a4a', top: '#b08a5a', deco: (b, tr) => { for (let j = 3; j < b.h; j += 5) tr(0, j, b.w, 1, ihx('#6d4a2a')); tr(0, 0, b.w, 2, ihx('#d8b070')); } },
  jukebox: { z: 16, wall: '#8a2a5a', top: '#ff6db6', deco: (b, tr) => { const f = (frame >> 4) % 3; tr(1, 1, b.w - 2, 2, ihx(['#24dbff', '#ffdb49', '#6dff92'][f])); tr(2, 5, b.w - 4, 4, ihx('#2a1a3a')); } },
  fridge: { z: 22, wall: '#a0a4ac', top: '#b6bcc8', deco: (b, tr) => { tr(0, b.h / 2, b.w, 1, ihx('#a8b0bc')); tr(b.w - 3, 2, 1, 4, ihx('#8a929e')); } },
  board: { z: 17, wall: '#6d4a2a', top: '#c89a5a', deco: (b, tr) => { const hz = b.w >= b.h, L = hz ? b.w : b.h; for (let i = 3, k = 0; i < L - 3; i += 5, k++) { const c = ihx(['#b6b6a8', '#dbb649', '#db7aa8', '#7ab6db'][k & 3]); if (hz) tr(i, 2, 3, b.h - 4, c); else tr(2, i, b.w - 4, 3, c); } } },
  hooks: { z: 15, wall: '#4a3220', top: '#6d4a2a', deco: (b, tr) => { for (let i = 2; i < b.h - 2; i += 4) tr(1, i, 3, 2, ihx('#d8c060')); } },
  monitors: { z: 18, wall: '#1c1c24', top: '#101018', deco: (b, tr) => {
    const cols = b.o.cols || 1, rows = b.o.rows || 1, sw = (b.w - 2) / cols, sh = (b.h - 2) / rows, pal = ['#24dbff', '#49ffdb', '#ff49db', '#ffdb49', '#6dff92'];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const n = (i + j * cols + (b.o.off || 0)), on = ((frame >> 4) + n * 3) % 7 !== 0; tr(1 + i * sw + .5, 1 + j * sh + .5, sw - 1.5, sh - 1.5, ihx(on ? pal[(n + ((frame >> 6) | 0)) % pal.length] : '#1c3a44')); tr(1 + i * sw + 2, 1 + j * sh + 1.5, 2, 2, ihx('#101018')); } } },
  slot: { z: 20, wall: '#8a1e2a', top: '#db9224', deco: (b, tr) => { const f = (frame >> 3) + (b.x | 0); for (let i = 0; i < 3; i++) tr(2 + i * 4, 2, 3, 4, ihx(['#b6b6b6', '#dbb624', '#ff6db6', '#24dbff'][(f + i * 3) & 3])); tr(1, b.h - 3, b.w - 2, 1, ihx((frame >> 4) & 1 ? '#ffdb49' : '#ff49db')); } },
  roulette: { z: 9, wall: '#3a2a1a', top: '#1c6a3a', deco: (b, tr) => { tr(b.w / 2 - 6, b.h / 2 - 6, 12, 12, ihx('#8a1e2a')); tr(b.w / 2 - 3, b.h / 2 - 3, 6, 6, ihx('#16161e')); tr(b.w / 2 - 1 + (((frame >> 2) & 3) - 1), b.h / 2 - 1, 2, 2, ihx('#b6b6b6')); } },
  bench: { z: 7, wall: '#6d6d7a', top: '#a0a0b0' },
  counterW: { z: 11, wall: '#6a6a76', top: '#a8a8b8', deco: (b, tr) => { tr(b.w - 14, 1, 10, b.h - 2, ihx('#3a3a44')); tr(b.w - 13, 2, 8, 3, ihx('#6dff92')); } },
  bars: { z: 22, wall: '#3a3a44', top: '#5a5a66', deco: (b, tr) => { const hz = b.w >= b.h, L = hz ? b.w : b.h; for (let i = 1; i < L; i += 4) { if (hz) tr(i, 0, 1, b.h, ihx('#9a9aa8')); else tr(0, i, b.w, 1, ihx('#9a9aa8')); } } },
  kitchen: { z: 10, wall: '#6a6a76', top: '#a0a0b0', deco: (b, tr) => { tr(3, 2, 8, b.h - 4, ihx('#a8b0b8')); tr(b.w - 14, 3, 5, 5, ihx('#3a3a44')); tr(b.w - 7, 3, 5, 5, ihx('#3a3a44')); } },
  hbed: { z: 9, wall: '#8a929a', top: '#a8c4d8', deco: (b, tr) => { tr(2, 1, b.w - 4, 6, ihx('#b6b6c0')); tr(2, 8, b.w - 4, b.h - 10, ihx('#6d9ac0')); } },
};
// ---------------- drawing: walls, furniture, roofs ----------------
const ISH = [.72, .86, .6, .95];
function drawShellWall(b) {
  const RM = b.shellOf, z = b.z > 28 ? b.z - (b.z - 28) * RM.open : b.z, x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h, night = typeof nightAmt === 'function' ? nightAmt() : 0, P = (x, y, zz) => [projX(x, zz), projY(y, zz)];
  const sides = [[[x0, y0], [x1, y0], CAM.y < y0], [[x1, y0], [x1, y1], CAM.x > x1], [[x1, y1], [x0, y1], CAM.y > y1], [[x0, y1], [x0, y0], CAM.x < x0]];
  for (let i = 0; i < 4; i++) {
    const [a, c, vis] = sides[i]; if (!vis) continue; const ty = b.ft[i], sh = ISH[i];
    if (ty === 'i') { const wc = mix(RM.inner, BLACK, 1 - sh); quadF(P(a[0], a[1], 0), P(c[0], c[1], 0), P(c[0], c[1], z), P(a[0], a[1], z), wc); const p0 = P(a[0], a[1], 4), p1 = P(c[0], c[1], 4); lineF(p0[0], p0[1], p1[0], p1[1], mix(wc, BLACK, .35)); continue; }
    const wc = mix(b.wall, BLACK, 1 - sh); quadF(P(a[0], a[1], 0), P(c[0], c[1], 0), P(c[0], c[1], z), P(a[0], a[1], z), wc);
    if (ty !== 'o') continue;
    const dark = mix(wc, BLACK, .3), len = Math.hypot(c[0] - a[0], c[1] - a[1]), nw = Math.floor(len / 12);
    for (let k = 1; k < nw; k++) { const t = k / nw, wx = a[0] + (c[0] - a[0]) * t, wy = a[1] + (c[1] - a[1]) * t, p0 = P(wx, wy, 4), p1 = P(wx, wy, z - 3); lineF(p0[0], p0[1], p1[0], p1[1], dark); }
    for (let zz = 14; zz < z - 4; zz += 14) { const p0 = P(a[0], a[1], zz), p1 = P(c[0], c[1], zz); lineF(p0[0], p0[1], p1[0], p1[1], dark); }
    if (night > .3) for (let k = 0; k < nw; k++) for (let zz = 7; zz < z - 6; zz += 14) { if (hsh(b.x + k * 7 + a[0], zz + a[1]) > .38) continue; const t = (k + .5) / nw, q = P(a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, zz); pset(q[0], q[1], WINLIT); pset(q[0] + 1, q[1], WINLIT); }
  }
  if (RM.open < .02) return;
  const r = [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]; quadF(r[0], r[1], r[2], r[3], b.roof);
  lineF(r[0][0], r[0][1], r[1][0], r[1][1], mix(b.roof, WHITE, .3)); lineF(r[0][0], r[0][1], r[3][0], r[3][1], mix(b.roof, WHITE, .2));
}
function drawProp(b) {
  const RM = b.shellOf; if (RM.open < .02) return;
  const x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h, z = b.z, P = (x, y, zz) => [projX(x, zz), projY(y, zz)];
  const sides = [[x0, y0, x1, y0, CAM.y < y0], [x1, y0, x1, y1, CAM.x > x1], [x1, y1, x0, y1, CAM.y > y1], [x0, y1, x0, y0, CAM.x < x0]];
  for (let i = 0; i < 4; i++) { const s = sides[i]; if (s[4]) quadF(P(s[0], s[1], 0), P(s[2], s[3], 0), P(s[2], s[3], z), P(s[0], s[1], z), mix(b.wall, BLACK, 1 - ISH[i])); }
  const a = P(x0, y0, z), c = P(x1, y1, z), tx = Math.round(a[0]), ty = Math.round(a[1]), tw = Math.max(1, Math.round(c[0]) - tx), th = Math.max(1, Math.round(c[1]) - ty);
  if (b.K.custom) { rectF(tx, ty, tw, th, b.roof); b.K.custom(b, a, c); return; }
  rectF(tx, ty, tw, th, b.roof); rectF(tx, ty, tw, 1, mix(b.roof, WHITE, .25)); rectF(tx, ty + th - 1, tw, 1, mix(b.roof, BLACK, .3));
  if (!b.K.deco) return;
  const sx = (c[0] - a[0]) / b.w, sy = (c[1] - a[1]) / b.h;
  const tr = (ux, uy, uw, uh, col) => { const px = Math.round(a[0] + ux * sx), py = Math.round(a[1] + uy * sy); rectF(px, py, Math.max(1, Math.round(a[0] + (ux + uw) * sx) - px), Math.max(1, Math.round(a[1] + (uy + uh) * sy) - py), col); };
  b.K.deco(b, tr);
}
function drawIntRoof(b) {
  const RM = b.roofOf, z = b.z;
  if (CAM.y > RM.y + RM.h) { const y = RM.y + RM.h, g0 = RM.door.g0, g1 = RM.door.g1, P = (x, zz) => [projX(x, zz), projY(y, zz)]; quadF(P(g0, 0), P(g1, 0), P(g1, z), P(g0, z), ihx('#14101c')); const l = P(g0 - 2, z - 5), m = P(g1 + 2, z - 5); rectF(Math.round(l[0]), Math.round(l[1]), Math.round(m[0] - l[0]), 3, mix(b.roof, BLACK, .2)); }
  if (RM.open > .97) return;
  const a = [projX(RM.x, z), projY(RM.y, z)], c = [projX(RM.x + RM.w, z), projY(RM.y + RM.h, z)], x = Math.round(a[0]), y = Math.round(a[1]), w = Math.round(c[0]) - x, h = Math.round(c[1]) - y;
  const hh = RM.open > .02 ? Math.round(h * (1 - RM.open)) : h; if (hh <= 0) return;
  rectF(x, y, w, hh, b.roof); rectF(x, y, w, 1, mix(b.roof, WHITE, .3)); rectF(x, y, 1, hh, mix(b.roof, WHITE, .3)); rectF(x, y + hh - 1, w, 1, mix(b.roof, BLACK, .3)); rectF(x + w - 1, y, 1, hh, mix(b.roof, BLACK, .3));
  if (b.sign && RM.open < .02) {
    const cx = x + w / 2, cy = y + h / 2;
    if (b.sign === '+') { rectF(cx - 12, cy - 4, 24, 8, ihx('#db2424')); rectF(cx - 4, cy - 12, 8, 24, ihx('#db2424')); }
    else { const len = b.sign.length, sc = CAM.s > .85 && len * 6 * 2 < RM.w * CAM.s ? 2 : 1, col = b.neon && (frame >> 5) & 1 ? ihx('#ffffff') : b.neon ? ihx('#ff49db') : mix(b.roof, BLACK, .6); text(b.sign, Math.round(cx - len * 3 * sc), Math.round(cy - 3 * sc), col, b.neon ? BLACK : 0, sc); }
  }
}
function fixRoofKeys(vis) {
  const mk = new Map();
  for (const v of vis) { const r = v[0].shellOf; if (r) { const m = mk.get(r); if (m === undefined || v[1] < m) mk.set(r, v[1]); } }
  for (const v of vis) { const r = v[0].roofOf; if (r && mk.has(r)) v[1] = mk.get(r) - 1; }
}
// ---------------- the baked floors ----------------
const IFLOOR = {
  wood: ['planks', '#a87a44', '#9a6e3c', '#7a5428'], darkwood: ['planks', '#6d4a2a', '#5e3f22', '#3e2814'], tile: ['checker', '#b6c0b8', '#a8b8b0', '#6d7d75'], pinktile: ['checker', '#dbb6c8', '#c898b0', '#a06c88'],
  carpet: ['noise', '#6d5a86', '#62507a', '#4e3e66'], lino: ['checker', '#a8b8c0', '#98a8b0', '#7a8a92'], marble: ['checker', '#d8c8c8', '#c0b0b8', '#9a8a92'], conc: ['noise', '#8a8a86', '#7e7e7a', '#6a6a66'],
  redcarpet: ['noise', '#8a1830', '#781028', '#5a0c1c'], bluecarpet: ['noise', '#3a4a8a', '#34427a', '#26305a'], hospital: ['checker', '#b6d0d0', '#9cc0c0', '#6d9a9a'],
};
function floorPix(RM, px, py) {
  const [a, b, s] = RM.fc, n = hsh(RM.x + px, RM.y + py);
  if (RM.fk === 'planks') { const row = (py / 6) | 0; return py % 6 === 0 || (px + row * 13) % 44 === 0 ? s : hsh(row, ((px + row * 13) / 44) | 0) > .5 ? a : b; }
  if (RM.fk === 'checker') return (px % 16 === 0 || py % 16 === 0) ? s : ((px >> 4) + (py >> 4)) & 1 ? a : b;
  return n < .12 ? b : n > .94 ? s : a;
}
function bakeInteriors() {
  for (const RM of INTS) {
    for (let py = 0; py < RM.h; py++) for (let px = 0; px < RM.w; px++) GROUND[(RM.y + py) * GW + RM.x + px] = floorPix(RM, px, py);
    for (const d of RM.decals) d(RM);
    const dm = (x, y, w, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = x + i, Y = y + j; if (X >= 0 && Y >= 0 && X < GW && Y < GH) GROUND[Y * GW + X] = (i + j) % 4 < 2 ? ihx('#6d1818') : ihx('#8a2424'); } };
    dm(RM.door.x - 13, RM.y + RM.h - IWT - 6, 26, 6); dm(RM.door.x - 13, RM.y + RM.h + 1, 26, 7);
  }
}
const gfill = (RM, rx, ry, rw, rh, col) => { for (let j = ry; j < ry + rh; j++) for (let i = rx; i < rx + rw; i++) if (i >= 0 && j >= 0 && i < RM.w && j < RM.h) GROUND[(RM.y + j) * GW + RM.x + i] = col; };
function iRug(RM, rx, ry, rw, rh, c1, c2) { RM.decals.push(R => { gfill(R, rx, ry, rw, rh, ihx(c1)); gfill(R, rx + 2, ry + 2, rw - 4, 1, ihx(c2)); gfill(R, rx + 2, ry + rh - 3, rw - 4, 1, ihx(c2)); gfill(R, rx + 2, ry + 2, 1, rh - 4, ihx(c2)); gfill(R, rx + rw - 3, ry + 2, 1, rh - 4, ihx(c2)); }); }
function iBlinds(RM, rx, ry, rw, rh) { RM.decals.push(R => { for (let j = 0; j < rh; j++) if (j % 12 < 5) for (let i = 0; i < rw; i++) { const k = (R.y + ry + j) * GW + R.x + rx + i; GROUND[k] = mix(GROUND[k], WHITE, .16); } }); }
function iHole(RM, rx, ry, rw, rh) { RM.decals.push(R => { gfill(R, rx, ry, rw, rh, ihx('#0c0810')); for (let j = 2; j < rh - 1; j += 4) gfill(R, rx + 1, ry + j, rw - 2, 2, ihx('#3a3040')); gfill(R, rx, ry, rw, 1, ihx('#8a8a96')); }); }
// ---------------- residents ----------------
const faceScript = q => { const p = plPos(); if (d2(q, p) < 110 * 110) q.a = Math.atan2(p.y - q.y, p.x - q.x); };
function intWander(q) {
  const RM = q.home; if (--q.t <= 0) { q.t = 50 + rnd(120); q.a = Math.random() * 6.2832; q.pause = rnd(3) === 0; }
  if (q.pause) return;
  const dx = Math.cos(q.a) * q.sp, dy = Math.sin(q.a) * q.sp, nx = q.x + dx * 6, ny = q.y + dy * 6;
  if (nx < RM.x + 10 || ny < RM.y + 10 || nx > RM.x + RM.w - 10 || ny > RM.y + RM.h - 14 || !movePed(q, dx, dy)) q.t = 0; else q.walk++;
}
function spawnFolk(f) {
  const RM = f.RM, o = { tag: 'int', home: RM, a: f.a === undefined ? Math.PI / 2 : f.a, st: f.mode === 'wander' ? 'walk' : 'idle', sp: .38, t: 30 + rnd(100), role: f.role, who: f.who };
  if (f.sh) o.sh = hex(f.sh); if (f.skin) o.skin = hex(f.skin); if (f.hair) o.hair = hex(f.hair); if (f.hat) o.hat = f.hat; if (f.ghost) o.ghost = 1; if (f.seat) o.seat = 1;
  const q = spawnPed(RM.x + f.rx, RM.y + f.ry, o);
  if (f.mode === 'wander') q.script = intWander; else if (f.mode === 'face') q.script = faceScript;
  if (f.store) q.onHold = () => robStore(f.store);
  if (f.onHold) q.onHold = f.onHold; if (f.look) q.look = f.look; f.q = q; return q;
}
function stepInts() {
  const p = PL, onFoot = !PL.car; let cur = null;
  for (const RM of INTS) {
    const ins = onFoot && p.x > RM.x && p.x < RM.x + RM.w && p.y > RM.y && p.y < RM.y + RM.h;
    if (ins) cur = RM;
    if (ins !== !!RM.inside) { RM.inside = ins; if (SU.cut < 2) sfx('ding'); }
    RM.open = ins ? Math.min(1, RM.open + .14) : Math.max(0, RM.open - .14);
    const dd = (RM.cx - p.x) ** 2 + (RM.cy - p.y) ** 2;
    if (dd < 380 * 380) { RM.spawned = 1; for (const f of RM.folks) { if (f.cool > 0) f.cool--; if ((!f.q || f.q.dead) && f.cool <= 0) { spawnFolk(f); f.cool = 600; } } }
    else if (dd > 560 * 560 && RM.spawned) { RM.spawned = 0; for (const f of RM.folks) { if (f.q) f.q.dead = 1; f.q = null; f.cool = 0; } }
  }
  INN = cur;
}
// peds sitting on furniture are drawn after it
function drawSeated() { for (const q of PEDS) if (q.seat && q.home.open > .02 && Math.abs(q.x - CAM.x) < W / CAM.s / 2 + 20 && Math.abs(q.y - CAM.y) < H / CAM.s / 2 + 20) drawPed(q); }
function resetInts() { for (const RM of INTS) { RM.open = 0; RM.inside = 0; RM.spawned = 0; for (const f of RM.folks) { f.q = null; f.cool = 0; } } INN = null; }
// cops chase through the door, not through the wall
function intWaypoint(q, p) {
  const hp = intAt(p.x, p.y), hq = intAt(q.x, q.y); if (hp === hq) return null;
  if (hq) return { x: hq.door.x, y: hq.door.y + 12 };
  const D = hp.door; return (Math.abs(q.x - D.x) < 12 && q.y > D.y - 4) ? null : { x: D.x, y: D.y + 14 };
}
// ---------------- prompts ----------------
function nearPoi() { let best = null, bd = 1e9; for (const p of IPOIS) { if (p.hide && p.hide()) continue; const d = d2(p, PL); if (d < p.r * p.r && d < bd) { best = p; bd = d; } } return best; }
function drawPrompts() {
  if (SU.cut || DLG || MENUS.length || SU.paused || PL.car || !INN) return;
  for (const p of IPOIS) { if (p.RM !== INN || (p.hide && p.hide())) continue; const x = projX(p.x, 0), y = projY(p.y, 0), a = Math.sin(frame * .12) * 1.5; ringF(x, y, (4 + a) * CAM.s, ihx('#ffdb49')); }
  const p = nearPoi(); if (!p) return;
  const s = 'A: ' + p.label, x = projX(PL.x, 14), y = projY(PL.y, 14) - 14; text(s, Math.max(2, Math.min(W - s.length * 6 - 2, (x - s.length * 3) | 0)), y | 0, ihx('#ffdb49'), BLACK);
}
// the lit rectangle for the night pass: the room Carl is standing in stays lit
function litRect() {
  if (!INN) return null; const R = INN, z = R.z;
  const x0 = Math.min(projX(R.x, 0), projX(R.x, z)), x1 = Math.max(projX(R.x + R.w, 0), projX(R.x + R.w, z)), y0 = Math.min(projY(R.y, 0), projY(R.y, z)), y1 = Math.max(projY(R.y + R.h, 0), projY(R.y + R.h, z));
  return [Math.max(0, Math.floor(x0)), Math.max(0, Math.floor(y0)), Math.min(W, Math.ceil(x1)), Math.min(H, Math.ceil(y1))];
}
// ---------------- Dr. Plum, JB, Carl's crib ----------------
async function plumSession() {
  if (SU.inMission) return; SU.cut = 1;
  const c = await ask('Lie down, Carl. Talk about the stick. The first one is free. A full session is two hundred dollars.', 'DR. PLUM', ['TALK (FREE)', 'FULL SESSION ($200)', 'NOT NOW']);
  if (c === 0) { await say(pick(['Carl. We do not have an appointment. Sit anyway. How is the mask?', 'You again. Tell me about the stick.', 'Sessions are $200. Holding me up does not count as a session.', 'And when the stick looks at you, what do you see?']), 'DR. PLUM'); }
  else if (c === 1) {
    if (SU.cash < 200) await say('That is $200. You have $' + SU.cash + '. I accept sticks as collateral. Not yours.', 'DR. PLUM');
    else { SU.cash -= 200; await fadeOut(.08); sfx('flush'); await wait(50); SU.hp = 100; if (!SU.tripLock) SU.trip = Math.min(SU.trip, .1); await fadeIn(.08); await say('We are out of time. You are, technically, a normal human. That is a diagnosis and a compliment.', 'DR. PLUM'); pop(PL.x, PL.y, 'FEELING FINE', '#b692ff'); }
  }
  SU.cut = 0;
}
async function jbDrawer() {
  if (SU.inMission) return; SU.cut = 1;
  const c = await ask('JB said do not open the drawer.', 'CARL', ['OPEN THE DRAWER', 'DO NOT OPEN THE DRAWER']);
  if (c === 0) {
    if ((SU.lasT || 0) > frame) await say('The drawer is empty. It refills when nobody is looking.', 'CARL');
    else { SU.lasT = frame + 60 * 120; SU.hp = 100; sfx('get'); await say('Lasagna. The drawer is full of lasagna. It is warm. It is always warm.', 'CARL'); await say('Carl. That is evidence.', 'JB GARFIELD'); pop(PL.x, PL.y, 'LASAGNA (HP FULL)', '#ff9a3a'); }
  } else await say('Good. Some doors are for not opening.', 'JB GARFIELD');
  SU.cut = 0;
}
async function cribBed() {
  if (SU.inMission || SU.job) return; SU.cut = 1;
  const opts = ['SAVE (NAP)'].concat(SU.wanted ? [] : ['SLEEP TILL MORNING']).concat(['NOT NOW']);
  const c = await ask('The mattress. It has seen things. Most of them were Carl.', 'CARL', opts); SU.cut = 0;
  if (c === 0) { saveGame(); SU.cut = 1; await say('Saved. I was not napping. I was saving.', 'CARL'); SU.cut = 0; }
  else if (opts[c] === 'SLEEP TILL MORNING') { SU.cut = 1; await fadeOut(.06); await wait(30); SU.min = 7 * 60; SU.hp = 100; if (!SU.tripLock) SU.trip = 0; saveGame(); await fadeIn(.06); await say('Seven AM. The stick is rested. I am rested. We are both rested.', 'CARL'); SU.cut = 0; }
}
async function cribBoard() {
  if (SU.inMission || SU.job) return;
  if (!SU.done.proprun) { pop(PL.x, PL.y, 'NO SHIFTS YET. (TALK TO A CONTACT.)', '#ffdb49'); return; }
  SU.cut = 1; const c = await ask('The delivery board. Three drops. Money is money.', 'CARL', ['PROP RUN SHIFT (DELIVERIES)', 'NOT NOW']); SU.cut = 0;
  if (c === 0) await runMission('delivery');
}
async function cribKeys() {
  if (SU.inMission || SU.job) return; SU.cut = 1;
  const nearCar = CARS.filter(c => !c.dead && !c.wreck && !c.tag && !CARM[c.m].water && !CARM[c.m].ship && !c.noEnter && c !== PL.car && d2(c, PLACES.crib) < 220 * 220).sort((p, q) => d2(p, PLACES.crib) - d2(q, PLACES.crib))[0];
  const opts = (nearCar && SU.garage.length < 3 ? ['STORE CAR (' + nearCar.m.toUpperCase() + ')'] : []).concat(SU.garage.map((g, i) => 'TAKE OUT #' + (i + 1) + ': ' + g.m.toUpperCase())).concat(['NOT NOW']);
  const c = await ask('The garage keys. The garage is the lot out front. ' + SU.garage.length + '/3 cars. ' + (nearCar ? 'A ' + nearCar.m + ' is parked close.' : 'Park a car near the crib to store it.'), 'CARL', opts); SU.cut = 0;
  if (c < 0) return; const o = opts[c];
  if (o.startsWith('STORE CAR')) { SU.garage.push({ m: nearCar.m, col: nearCar.col }); nearCar.dead = 1; pop(PL.x, PL.y, 'STORED.', '#9fb8ff'); saveGame(); }
  else if (o.startsWith('TAKE OUT')) { const i = +o.split('#')[1].split(':')[0] - 1, g = SU.garage.splice(i, 1)[0], nc = spawnCar(g.m, PLACES.crib.x + 36, PLACES.crib.y + 4, 0, { drv: null }); nc.col = g.col; unstick(nc); pop(nc.x, nc.y, g.m.toUpperCase() + ' DELIVERED', '#9fb8ff'); saveGame(); }
}
// ---------------- the interiors ----------------
const heldUp = (lines, who) => q => { pop(q.x, q.y - 10, pick(lines), '#f0f0f0'); };
function iStickNation(ix, iy) {
  const R = iShell('STICK-NATION', ix, iy, 5, 3, { z: 34, wall: '#6d4924', roof: '#db9224', sign: 'STICK-NATION', inner: '#b69a6d', floor: 'wood' });
  iRug(R, 52, 44, 56, 24, '#8a1e2a', '#db9224');
  iProp(R, 'rack', 10, 7, 44, 10); iProp(R, 'rack', 106, 7, 44, 10, { seed: 2 }); iProp(R, 'rack', 8, 26, 10, 34, { seed: 1 }); iProp(R, 'rack', 142, 26, 10, 34, { seed: 3 });
  iProp(R, 'counter', 50, 30, 60, 10, { reg: 46 }); iProp(R, 'table', 30, 58, 26, 10, { sticks: 1 }); iProp(R, 'table', 104, 58, 26, 10, { sticks: 1 });
  iFolk(R, 80, 21, { role: 'clerk', who: 'STICK CLERK', sh: '#6d4924', hat: '#db9224', mode: 'face', onHold: heldUp(['EVERYTHING HERE IS A STICK. TAKE ONE.', 'YOU ARE HOLDING A STICK AT THE STICK MAN.', 'I RESPECT THAT.']) });
  iFolk(R, 40, 46, { sh: '#2492db' });
  iPoi(R, 80, 48, 'SHOP', () => shopMenu());
  place('shop', ix + 2, iy + 3); PLACES.shop.counter = { x: R.x + 80, y: R.y + 48 };
}
function iStore(ix, iy) {
  const R = iShell('7-11TY', ix, iy, 5, 3, { z: 24, wall: '#f0f0e8', roof: '#ff6d24', sign: '7-11TY', inner: '#b6b6ae', floor: 'tile' });
  [10, 44, 86, 120].forEach((x, i) => iProp(R, 'cooler', x, 7, 30, 12, { seed: i }));
  iProp(R, 'shelf', 14, 34, 50, 10, { seed: 1 }); iProp(R, 'shelf', 14, 54, 50, 10, { seed: 4 }); iProp(R, 'shelf', 112, 68, 30, 8, { seed: 2 });
  iProp(R, 'counter', 96, 36, 52, 10, { reg: 4 }); iProp(R, 'slush', 136, 20, 12, 12);
  iFolk(R, 116, 28, { role: 'clerk', who: 'CLERK', sh: '#ff6d24', hat: '#24b649', mode: 'face', store: 'store' });
  iFolk(R, 40, 48, { sh: '#924992' }); iFolk(R, 100, 70, { sh: '#db9224' });
  place('store', ix + 2, iy + 3); PLACES.store.counter = { x: R.x + 120, y: R.y + 52 };
}
function iDonuts(ix, iy) {
  const R = iShell('DONUT TIME', ix + 1, iy, 3, 3, { z: 22, wall: '#f0b6db', roof: '#ff6db6', sign: 'DONUTS', inner: '#dba6c0', floor: 'pinktile', door: 1 });
  iProp(R, 'shelf', 12, 7, 72, 6, { seed: 5 }); iProp(R, 'counter', 8, 22, 80, 10, { glass: 1 });
  for (const x of [12, 24, 64, 76]) iProp(R, 'stool', x, 38, 8, 8);
  iProp(R, 'table', 8, 60, 22, 14); iProp(R, 'table', 66, 60, 22, 14); iProp(R, 'jukebox', 82, 48, 8, 10);
  iFolk(R, 48, 15, { role: 'clerk', who: 'CLERK', sh: '#ff6db6', hat: '#f0f0f0', mode: 'face', store: 'donut' });
  iFolk(R, 16, 42, { role: 'offcop', seat: 1, mode: 'face', sh: '#24246d', hat: '#101024', onHold: q => { pop(q.x, q.y - 10, "I'M OFF DUTY. (THAT'S STILL A STICK.)", '#9fb8ff'); if (!q.gave) { q.gave = 1; SU.hp = Math.min(100, SU.hp + 15); pop(PL.x, PL.y, 'HE GIVES YOU A DONUT (+HP)', '#ff6db6'); } } });
  iFolk(R, 40, 66, { sh: '#2492db' });
  place('donut', ix + 2, iy + 3); PLACES.donut.counter = { x: R.x + 48, y: R.y + 38 };
}
function iGas(ix, iy) {
  const R = iShell('GAS-N-GULP', ix, iy, 3, 3, { z: 22, wall: '#dbdbdb', roof: '#db2424', sign: 'GAS', inner: '#b6b6b6', floor: 'lino', door: 1 });
  iProp(R, 'cooler', 7, 12, 12, 46); iProp(R, 'counter', 52, 22, 36, 10, { reg: 4 }); iProp(R, 'shelf', 24, 34, 8, 26, { seed: 3 }); iProp(R, 'shelf', 68, 52, 18, 8, { seed: 6 });
  iFolk(R, 70, 14, { role: 'clerk', who: 'CLERK', sh: '#db2424', hat: '#f0f0f0', mode: 'face', store: 'gas' }); iFolk(R, 46, 56, { sh: '#6d6d6d' });
  place('gas', ix + 1, iy + 3); PLACES.gas.counter = { x: R.x + 70, y: R.y + 38 };
}
function iPlum(ix, iy) {
  const R = iShell('DR PLUM', ix + 1, iy, 3, 3, { z: 30, wall: '#dbdbf0', roof: '#6d49b6', sign: 'DR PLUM', inner: '#b6a6c8', floor: 'carpet', door: 1 });
  iPart(R, 6, 52, 52, 6); iPart(R, 82, 52, 8, 6);
  iProp(R, 'bookshelf', 36, 7, 50, 8); iProp(R, 'couch', 8, 20, 14, 30, { back: 'w' }); iProp(R, 'chair', 40, 28, 12, 12); iProp(R, 'plant', 76, 26, 10, 10);
  iProp(R, 'couch', 8, 64, 26, 12, { back: 's' }); iProp(R, 'plant', 70, 70, 10, 10);
  iRug(R, 24, 22, 28, 26, '#5a3a86', '#b692ff');
  iFolk(R, 46, 22, { role: 'doc', who: 'DR. PLUM', sh: '#6d49b6', hair: '#b6b6b6', mode: 'face', a: 3.14, onHold: heldUp(['I WILL WAIT. WE CAN DISCUSS THIS. TOGETHER.', 'THE STICK IS A COMPLEX SYMBOL.', 'I HAVE SEEN WORSE. I HAVE SEEN GHOST.']) });
  iPoi(R, 28, 38, 'LIE DOWN', () => plumSession());
  place('plum', ix + 2, iy + 3);
}
function iJB(ix, iy) {
  const R = iShell('J.B.G. P.I.', ix, iy, 5, 3, { z: 44, wall: '#493624', roof: '#241a10', sign: 'J.B.G. P.I.', inner: '#a08868', floor: 'darkwood' });
  iBlinds(R, 8, 8, 144, 80);
  iProp(R, 'cabinet', 8, 8, 14, 30); iProp(R, 'cabinet', 24, 8, 14, 30, { seed: 1 }); iProp(R, 'bookshelf', 118, 7, 36, 8);
  iProp(R, 'desk', 52, 22, 56, 14); iProp(R, 'chair', 60, 48, 10, 10); iProp(R, 'chair', 90, 48, 10, 10); iProp(R, 'couch', 110, 62, 40, 12, { back: 's' }); iProp(R, 'plant', 140, 36, 10, 10);
  iFolk(R, 80, 14, { role: 'pi', who: 'JB GARFIELD', sh: '#ff9a3a', skin: '#ff9a3a', hat: '#241a10', mode: 'face', onHold: heldUp(['EVERY CASE IS A CAT.', 'NOT THE LASAGNA, CARL.', 'I HAVE SEEN WORSE STICKS.']), look: (q, hx, hy, s) => { const c = hex('#ff9a3a'), d = hex('#b8601a'); triF(hx - 3 * s, hy - 1 * s, hx - 1 * s, hy - 2 * s, hx - 3 * s, hy - 5 * s, c); triF(hx + 3 * s, hy - 1 * s, hx + 1 * s, hy - 2 * s, hx + 3 * s, hy - 5 * s, c); pset(hx - 1, hy - 1, d); pset(hx + 1, hy - 1, d); } });
  iPoi(R, 80, 48, 'TALK TO JB', () => PLACES.jb.talk()); iPoi(R, 54, 42, 'THE DRAWER', () => jbDrawer());
  place('jb', ix + 2, iy + 3); PLACES.jb.x = R.x + 80; PLACES.jb.y = R.y + 48;
  PLACES.jb.talk = async () => { if (SU.inMission) return; SU.cut = 1; await say(pick(['The rain hit the window like it owed it money. It is not raining. I am practicing.', 'Your file is in the drawer, Carl. The drawer is full of lasagna. Do not open the drawer.', 'Every case is a cat. It will come to you when it is ready.']), 'JB GARFIELD'); SU.cut = 0; };
}
function iGhost(ix, iy) {
  const R = iShell('GHOST', ix, iy, 4, 3, { z: 30, wall: '#f0dbdb', roof: '#b6496d', sign: 'GHOST', inner: '#c8b0b0', floor: 'marble', door: 2 });
  iRug(R, 40, 40, 52, 36, '#8a1e2a', '#ffdb49');
  iProp(R, 'piano', 8, 10, 32, 22); iProp(R, 'fire', 84, 6, 34, 10); iProp(R, 'couch', 84, 28, 34, 12, { back: 's' }); iProp(R, 'table', 94, 46, 14, 10); iProp(R, 'stairs', 6, 50, 24, 36); iProp(R, 'plant', 104, 66, 10, 10);
  iFolk(R, 100, 35, { role: 'ghost', who: 'SPOOKY GHOST', ghost: 1, seat: 1, mode: 'face', onHold: heldUp(['I AM TECHNICALLY DEAD. YOUR STICK IS TECHNICALLY WOOD.', 'I CAN PHASE THROUGH THAT.', 'CARL. THE STICK IS NOT NEEDED. I LIKE YOU.']) });
  iPoi(R, 98, 52, 'TALK TO GHOST', async () => { if (SU.inMission) return; SU.cut = 1; await say(pick(['The mansion is mine. The alimony is also mine. It is a lot of paperwork for a dead guy.', 'I am retired from heists. Ask me again in an hour.', 'The piano plays itself. I do not play it. I just stand near it. Spooky.']), 'SPOOKY GHOST'); SU.cut = 0; });
  place('ghost', ix + 2, iy + 3); place('ghostDrive', ix + 4, iy + 4);
}
function iFace(ix, iy) {
  const R = iShell("FACE'S", ix, iy, 5, 3, { z: 40, wall: '#49246d', roof: '#24244a', sign: "FACE'S", inner: '#b09ac0', floor: 'bluecarpet' });
  iPart(R, 100, 6, 6, 24); iPart(R, 100, 52, 6, 38);
  iProp(R, 'bookshelf', 10, 7, 84, 8, { seed: 2 }); iProp(R, 'table', 16, 32, 34, 10, { seed: 1 }); iProp(R, 'table', 56, 32, 34, 10, { seed: 2 }); iProp(R, 'table', 16, 52, 34, 10, { seed: 3 }); iProp(R, 'plant', 8, 70, 10, 10);
  iProp(R, 'monitors', 108, 7, 42, 12, { cols: 4, rows: 2 }); iProp(R, 'monitors', 146, 22, 8, 30, { cols: 1, rows: 3, off: 8 }); iProp(R, 'desk', 114, 30, 28, 10); iProp(R, 'chair', 124, 42, 10, 10);
  iHole(R, 112, 66, 36, 20);
  iFolk(R, 34, 70, { role: 'nerd', who: 'COMIC FAN', sh: '#24b649', mode: 'wander' });
  iPoi(R, 128, 56, 'WATCH THE MONITORS', async () => { if (SU.inMission) return; SU.cut = 1; await say(pick(["Eleven cameras. You are on nine of them. The other two are a pigeon.", 'I see you, Carl. I see everybody. It is a lot of Carls.', 'The stairs go down. Nobody has been down. Do not go down.']), 'FACE'); SU.cut = 0; });
  place('face', ix + 2, iy + 3); PLACES.face.x = R.x + 128; PLACES.face.y = R.y + 56; place('garage', ix + 2, iy + 4);
}
function iCrib(ix, iy) {
  const R = iShell("CARL'S CRIB", ix, iy, 3, 3, { z: 22, wall: '#6d92b6', roof: '#49496d', inner: '#a8b4c0', floor: 'wood', door: 1 });
  iRug(R, 44, 22, 38, 26, '#2a4a6a', '#9fb8ff');
  iProp(R, 'bed', 8, 8, 26, 44); iProp(R, 'tv', 50, 7, 34, 10); iProp(R, 'couch', 50, 26, 34, 12, { back: 's' }); iProp(R, 'board', 84, 40, 6, 28); iProp(R, 'hooks', 6, 66, 6, 20); iProp(R, 'table', 68, 62, 18, 14);
  iPoi(R, 40, 36, 'BED', () => cribBed()); iPoi(R, 78, 54, 'DELIVERY BOARD', () => cribBoard()); iPoi(R, 20, 76, 'GARAGE KEYS', () => cribKeys()); iPoi(R, 66, 42, 'WATCH TV', () => { pop(PL.x, PL.y, pick(CHATS), '#b6b6db'); });
  place('crib', ix + 1, iy + 3);
}
