'use strict';
// ================= ROMANCING STREAM: sprites. 2D rigs: cel shapes on joints, sepia ink lines, watercolor tones =================
// every character is a joint tree of ellipses, polygons and capsules. shading comes from the upper right in three tones
// (wash, shadow, light) with a dithered band; each part gets a thin ink edge, and the figure a sepia outline. baked to frames at boot.
const RS_INK = [62, 38, 32];
function rsTone(c) { return { b: c, s: [c[0] * .6 + 22, c[1] * .56 + 16, c[2] * .62 + 40], h: [Math.min(255, c[0] * 1.08 + 34), Math.min(255, c[1] * 1.08 + 30), Math.min(255, c[2] * 1.04 + 22)], l: [c[0] * .38 + 18, c[1] * .3 + 10, c[2] * .3 + 8] }; }
const RS_TONES = new Map(); const rsToneOf = c => { const k = c.join(','); let t = RS_TONES.get(k); if (!t) RS_TONES.set(k, t = rsTone(c)); return t; };
const rsM = (a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) => ({ a, b, c, d, e, f });
const rsMul = (m, n) => ({ a: m.a * n.a + m.c * n.b, b: m.b * n.a + m.d * n.b, c: m.a * n.c + m.c * n.d, d: m.b * n.c + m.d * n.d, e: m.a * n.e + m.c * n.f + m.e, f: m.b * n.e + m.d * n.f + m.f });
const rsT = (x, y) => rsM(1, 0, 0, 1, x, y), rsR = t => rsM(Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), 0, 0);
const rsInv = m => { const det = m.a * m.d - m.b * m.c || 1e-9; return { a: m.d / det, b: -m.b / det, c: -m.c / det, d: m.a / det, e: (m.c * m.f - m.d * m.e) / det, f: (m.b * m.e - m.a * m.f) / det }; };
function rsSeg(px, py, x0, y0, x1, y1) { const dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy || 1e-9; let t = ((px - x0) * dx + (py - y0) * dy) / l2; t = Math.max(0, Math.min(1, t)); return Math.hypot(px - x0 - dx * t, py - y0 - dy * t); }
function rsInPoly(x, y, pts) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], b = pts[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; }
function rsBounds(s) { if (s.k === 'e') return [s.cx - s.rx, s.cy - s.ry, s.cx + s.rx, s.cy + s.ry]; if (s.k === 'p') { const xs = s.pts.map(p => p[0]), ys = s.pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; } const r = s.w / 2; return [Math.min(s.x0, s.x1) - r, Math.min(s.y0, s.y1) - r, Math.max(s.x0, s.x1) + r, Math.max(s.y0, s.y1) + r]; }
function rsInside(s, x, y) { if (s.k === 'e') { const nx = (x - s.cx) / s.rx, ny = (y - s.cy) / s.ry; return nx * nx + ny * ny <= 1; } if (s.k === 'p') return rsInPoly(x, y, s.pts); return rsSeg(x, y, s.x0, s.y0, s.x1, s.y1) <= s.w / 2; }
function rsFill(S, s, M, dim, tint) {
  const inv = rsInv(M), bb = rsBounds(s), cs = [[bb[0], bb[1]], [bb[2], bb[1]], [bb[0], bb[3]], [bb[2], bb[3]]].map(p => [M.a * p[0] + M.c * p[1] + M.e, M.b * p[0] + M.d * p[1] + M.f]);
  const X0 = Math.max(0, Math.floor(Math.min(...cs.map(p => p[0])) - 1)), X1 = Math.min(S.w - 1, Math.ceil(Math.max(...cs.map(p => p[0])) + 1)), Y0 = Math.max(0, Math.floor(Math.min(...cs.map(p => p[1])) - 1)), Y1 = Math.min(S.h - 1, Math.ceil(Math.max(...cs.map(p => p[1])) + 1));
  let col = s.col; if (tint) col = col.map((v, i) => v * (1 - tint[3]) + tint[i] * tint[3]); if (dim) col = col.map(v => v * dim);
  const T = rsToneOf(col.map(Math.round)), bcx = (bb[0] + bb[2]) / 2, bcy = (bb[1] + bb[3]) / 2, bhw = (bb[2] - bb[0]) / 2 || 1, bhh = (bb[3] - bb[1]) / 2 || 1;
  const loc = (x, y) => [inv.a * x + inv.c * y + inv.e, inv.b * x + inv.d * y + inv.f];
  const ins = (x, y) => { const p = loc(x + .5, y + .5); return rsInside(s, p[0], p[1]); };
  for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
    const p = loc(x + .5, y + .5); if (!rsInside(s, p[0], p[1])) continue;
    if (s.erase) { S.px[y * S.w + x] = 0; continue; }
    let c;
    if (s.sh === 0) c = T.b;
    else { let nx, ny; if (s.k === 'e') { nx = (p[0] - s.cx) / s.rx; ny = (p[1] - s.cy) / s.ry; } else { nx = (p[0] - bcx) / bhw; ny = (p[1] - bcy) / bhh; } const wnx = M.a * nx + M.c * ny, wny = M.b * nx + M.d * ny, L = wnx * .4 - wny * .85; c = L > .6 ? T.h : L < -.3 ? T.s : L < -.08 ? (((x + y) & 1) ? T.s : T.b) : T.b; }
    if (!s.noedge && (!ins(x - 1, y) || !ins(x + 1, y) || !ins(x, y - 1) || !ins(x, y + 1))) c = T.l;
    S.px[y * S.w + x] = rgb(c[0], c[1], c[2]);
  }
}
function rsOutline(S, ink) { const o = new Uint32Array(S.px), w = S.w, h = S.h, oc = rgb(ink[0], ink[1], ink[2]); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (S.px[y * w + x]) continue; if ((x > 0 && S.px[y * w + x - 1]) || (x < w - 1 && S.px[y * w + x + 1]) || (y > 0 && S.px[(y - 1) * w + x]) || (y < h - 1 && S.px[(y + 1) * w + x])) o[y * w + x] = oc; } S.px = o; }
function rsRender(rig, pose, w, h, ax, ay, sc = 1, tint) {
  const S = { w, h, px: new Uint32Array(w * h) }, mats = {}, A = pose.a || {}, O = pose.o || {}, show = pose.show || {};
  const root = rsMul(rsT(ax + (pose.dx || 0) * sc, ay + (pose.dy || 0) * sc), rsM(sc, 0, 0, sc, 0, 0)), by = {}; for (const p of rig.parts) by[p.n] = p;
  const getM = p => { if (mats[p.n]) return mats[p.n]; const pm = p.p ? getM(by[p.p]) : root, off = O[p.n] || [0, 0]; return mats[p.n] = rsMul(pm, rsMul(rsT(p.o[0] + off[0], p.o[1] + off[1]), rsR(A[p.n] || 0))); };
  for (const p of rig.parts) getM(p);
  const order = rig.parts.map((p, i) => [p, i]).sort((a, b) => (a[0].z || 0) - (b[0].z || 0) || a[1] - b[1]);
  for (const [p] of order) { if (p.vis && !show[p.vis]) continue; if (p.hide && show[p.hide]) continue; for (const s of p.sh) rsFill(S, s, mats[p.n], p.dim, tint); }
  rsOutline(S, rig.ink || RS_INK);
  return S;
}
function rsBake(rig, poses, o = {}) { const w = o.w, h = o.h, ax = o.ax === undefined ? w / 2 : o.ax, ay = o.ay === undefined ? h - 4 : o.ay; return poses.map(p => { const S = rsRender(rig, p, w, h, ax, ay, o.scale || 1, o.tint); return { w, h, ax: Math.round(ax), ay: Math.round(ay), px: S.px }; }); }
function rsDraw(fr, x, y, flip, flash, alpha) { // (x, y) = feet
  const X0 = Math.round(x) - (flip ? fr.w - 1 - fr.ax : fr.ax), Y0 = Math.round(y) - fr.ay, w = fr.w, px = fr.px;
  for (let j = 0; j < fr.h; j++) { const yy = Y0 + j; if (yy < 0 || yy >= H) continue; for (let i = 0; i < w; i++) { const c = px[j * w + (flip ? w - 1 - i : i)]; if (!c) continue; const xx = X0 + i; if (xx < 0 || xx >= W) continue;
    let o = c; if (flash) { const r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255; o = rgb(r + (255 - r) * flash, g + (255 - g) * flash, b + (255 - b) * flash); }
    if (alpha !== undefined && alpha < 1) { const d = FB[yy * W + xx]; const r = (o & 255) * alpha + (d & 255) * (1 - alpha), g = ((o >> 8) & 255) * alpha + ((d >> 8) & 255) * (1 - alpha), b = ((o >> 16) & 255) * alpha + ((d >> 16) & 255) * (1 - alpha); o = rgb(r, g, b); }
    FB[yy * W + xx] = o; } }
}
const RE = (cx, cy, rx, ry, col, o = {}) => Object.assign({ k: 'e', cx, cy, rx, ry, col, sh: 1 }, o);
const RP = (pts, col, o = {}) => Object.assign({ k: 'p', pts, col, sh: 1 }, o);
const RC = (x0, y0, x1, y1, w, col, o = {}) => Object.assign({ k: 'c', x0, y0, x1, y1, w, col, sh: 1 }, o);
const RFLAT = { sh: 0, noedge: 1 };
