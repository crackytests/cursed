'use strict';
// ================= CARL 2: the pseudo-3D rig. one projector, three set pieces =================
// DESERT BUS TURBO (a road race), JUMP THE SHARK (water-skiing), IN SPACE (Space-Harrier style)
function sprText(g, s, x, y, c) { for (const ch of String(s)) { const gl = FONT[ch]; if (gl) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j] & (16 >> i)) g.p(x + i, y + j, c); x += 6; } }
// clipped scaled draw: rows at or below clipY are hidden (the road in front covers them)
function drawSC(s, x, y, P, sc, clipY, flip) {
  const w = s.w * sc, h = s.h * sc; if (w < 1 || h < 1) return;
  const y1 = Math.min(y + h, clipY, H);
  for (let yy = Math.max(0, y | 0); yy < y1; yy++) { const sy = ((yy - y) / sc) | 0; if (sy < 0 || sy >= s.h) continue; const row = sy * s.w;
    for (let xx = Math.max(0, x | 0), x1 = Math.min(W, x + w); xx < x1; xx++) { let sx = ((xx - x) / sc) | 0; if (sx >= s.w) continue; if (flip) sx = s.w - 1 - sx; const c = s.d[row + sx]; if (c) FB[yy * W + xx] = P[c]; } }
}
// ---------------- road art ----------------
const RP = {
  cactus: pal('#000000', '#49924a', '#246d36', '#6db649', '#ff92b6'), bill: pal('#000000', '#242424', '#ffdb24', '#ff2449', '#ffffff', '#6d6d6d', '#6dff24', '#2449b6', '#dbb692'),
  bus: pal('#000000', '#ffffff', '#dbdbdb', '#6dff24', '#249249', '#242424', '#ff2424', '#ffdb24', '#6dffff', '#8f8f8f', '#101010'),
  car: pal('#000000', '#ff2424', '#b61a1a', '#242424', '#ffdb49', '#dbb692', '#ffffff', '#6dffff', '#8f8f8f'),
  truck: pal('#000000', '#dbdbdb', '#b6b6b6', '#242424', '#ff9224', '#6d6d6d'), rock: pal('#000000', '#b66d36', '#924924', '#db9249'),
  buoy: pal('#000000', '#ff2424', '#ffffff', '#b61a1a', '#dbdbdb'), ramp: pal('#000000', '#dbdb92', '#b6b66d', '#926d49', '#ff2424', '#ffffff'),
  shark: pal('#000000', '#6d92b6', '#49708f', '#dbdbff', '#ffffff', '#242424', '#db6d6d'), boat: pal('#000000', '#b6b6c8', '#8f8fa0', '#6dffb6', '#24db92', '#ffffff', '#db2449', '#ffdb24'),
  ski: pal('#000000', '#6db66d', '#249249', '#242424', '#494949', '#101010', '#dbdbdb', '#ffdb24', '#6d6d6d', '#ff2424'),
  sat: pal('#000000', '#dbdbdb', '#8f8f8f', '#2449b6', '#6dffff', '#ffdb24', '#db2424'), ufo: pal('#000000', '#b6a07a', '#927a5a', '#6dffff', '#ffffff', '#dbc8a0'),
  pretz: pal('#000000', '#dbb66d', '#a0804a', '#ffffff'), syn: pal('#000000', '#dbdbdb', '#b6b6b6', '#6d6d6d', '#101010', '#ffffff', '#db2424', '#6dffff', '#ffdb24'),
  ride: pal('#000000', '#b6b6c8', '#8f8fa0', '#6dffb6', '#24db92', '#6db66d', '#242424', '#dbb624', '#ffffff', '#ff2449'),
  sign: pal('#000000', '#2c7a2c', '#ffffff', '#6d6d6d'), stop: pal('#000000', '#242424', '#ffdb24', '#8f8f8f'),
};
for (const k in RP) { RP[k].splice(1, 1); RP[k][15] = hex('#000000'); } // index 1 is the main color; 15 is the outline
const RS = {};
RS.cactus = spr(24, 40, g => { g.r(9, 4, 6, 36, 1); g.r(10, 4, 1, 36, 3); g.r(1, 12, 5, 6, 1); g.r(1, 17, 9, 3, 1); g.r(18, 8, 5, 8, 1); g.r(14, 14, 9, 3, 1); g.r(9, 2, 6, 3, 2); g.p(11, 1, 4); g.p(12, 1, 4); for (let y = 8; y < 38; y += 5) g.p(13, y, 2); });
function billboard(lines, bg, fg) { return spr(64, 44, g => { g.r(8, 30, 3, 14, 5); g.r(52, 30, 3, 14, 5); g.r(0, 0, 64, 32, 1); g.r(1, 1, 62, 30, bg); lines.forEach((l, i) => sprText(g, l, 32 - l.length * 3, 4 + i * 9, fg)); }); }
RS.billProp = billboard(['PROP PILLS', 'IT\'S ONLY', 'PRETEND'], 2, 1);
RS.billHuman = billboard(['HU-MAN', 'HE\'S', 'HUMAN'], 3, 4);
RS.billVegas = spr(40, 40, g => { g.r(18, 22, 3, 18, 3); g.r(0, 0, 40, 24, 1); g.r(1, 1, 38, 22, 1); sprText(g, 'VEGAS', 5, 3, 2); sprText(g, '360MI', 5, 12, 2); });
RS.billDiner = billboard(['GARF\'S', 'DINER', '8 HRS'], 6, 1);
RS.billSequel = billboard(['CARL 2', 'NOW IN', 'COLOR'], 7, 4);
RS.busstop = spr(16, 36, g => { g.r(7, 8, 2, 28, 3); g.r(2, 0, 12, 10, 2); g.r(3, 1, 10, 8, 1); sprText(g, 'B', 5, 2, 2); });
RS.rock = spr(32, 22, g => { g.e(16, 13, 15, 9, 2); g.e(14, 11, 12, 7, 1); g.e(11, 8, 5, 3, 3); });
RS.tumble = spr(20, 20, g => { for (let i = 0; i < 30; i++) { const t = i * 2.4, r = 3 + (i * 7 % 6); g.line(10 + Math.cos(t) * r, 10 + Math.sin(t) * r, 10 + Math.cos(t + 1.9) * (r + 2), 10 + Math.sin(t + 1.9) * (r + 2), 1 + (i % 2)); } });
RP.tumble = pal('#000000', '#b6924a', '#926d24');
RS.bus = [0, 1, 2].map(k => outline(spr(64, 44, g => { // rear of the Prop Pills bus. k: 0 straight, 1 left, 2 right
  const o = k === 1 ? -2 : k === 2 ? 2 : 0;
  g.r(4, 4, 56, 34, 1); g.r(4, 4, 56, 3, 2); g.r(8 + o, 9, 48, 12, 5); g.r(10 + o, 10, 20, 10, 8); g.r(34 + o, 10, 20, 10, 8); g.r(4, 24, 56, 6, 3); sprText(g, 'PROP PILLS', 2, 23, 4);
  g.r(6, 31, 8, 4, 6); g.r(50, 31, 8, 4, 6); g.r(26, 32, 12, 4, 7); g.r(2, 38, 60, 2, 5); g.r(6, 40, 12, 4, 10); g.r(46, 40, 12, 4, 10);
}), 15));
RS.car = outline(spr(48, 30, g => { g.r(2, 10, 44, 14, 1); g.r(2, 10, 44, 2, 2); g.r(4, 14, 40, 4, 2); g.r(3, 16, 6, 3, 4); g.r(39, 16, 6, 3, 4); g.r(14, 4, 20, 7, 7); g.r(20, 1, 7, 6, 5); g.r(19, 0, 9, 3, 4); g.r(4, 24, 8, 6, 3); g.r(36, 24, 8, 6, 3); g.r(18, 19, 12, 3, 6); }), 15);
RS.truck = outline(spr(48, 44, g => { g.r(2, 2, 44, 34, 1); g.r(2, 2, 44, 2, 2); for (let y = 8; y < 34; y += 6) g.r(4, y, 40, 1, 2); g.r(6, 34, 6, 3, 4); g.r(36, 34, 6, 3, 4); g.r(4, 38, 10, 6, 3); g.r(34, 38, 10, 6, 3); }), 15);
RS.buoy = outline(spr(12, 22, g => { g.r(3, 4, 6, 14, 1); g.r(3, 8, 6, 4, 2); g.e(6, 4, 3, 2, 1); g.r(5, 0, 2, 3, 4); g.e(6, 19, 5, 2, 4); }), 15);
RS.ramp = spr(56, 30, g => { for (let y = 0; y < 26; y++) g.r(28 - 26 + y, 26 - y, 52 - y * 1, 1, y & 2 ? 1 : 2); g.r(2, 26, 52, 4, 3); for (let x = 6; x < 50; x += 10) g.r(x, 20, 4, 4, 4); });
RS.fin = outline(spr(20, 16, g => { g.line(2, 15, 12, 0, 1); g.line(12, 0, 18, 15, 2); for (let y = 1; y < 15; y++) g.r(2 + y * .7, y, 13 - y * .45, 1, 1); g.r(0, 15, 20, 1, 4); }), 15);
RS.sharkBig = outline(spr(64, 34, g => { g.e(32, 20, 28, 10, 1); g.e(34, 24, 22, 5, 3); g.line(30, 10, 38, 0, 1); g.line(31, 10, 39, 0, 1); for (let y = 0; y < 10; y++) g.r(31 + y * .2, 10 - y, 8 - y * .5, 1, 1); g.e(52, 17, 2, 2, 5); g.r(46, 23, 14, 3, 6); for (let x = 47; x < 59; x += 3) g.p(x, 23, 4); g.line(4, 20, 0, 12, 1); g.line(4, 20, 0, 28, 1); }), 15);
RS.boat = outline(spr(64, 36, g => { g.e(32, 26, 30, 8, 2); g.e(32, 23, 30, 8, 1); g.e(32, 14, 14, 10, 4); g.e(32, 12, 12, 8, 3); g.e(28, 9, 4, 2, 5); for (let i = 0; i < 7; i++) g.e(8 + i * 8, 26, 1.5, 1.5, i & 1 ? 6 : 7); g.r(28, 28, 8, 3, 7); }), 15);
RS.ski = [0, 1, 2].map(k => outline(spr(24, 34, g => { // Carl skiing, from behind, in a leather jacket. k: lean
  const o = k === 1 ? -2 : k === 2 ? 2 : 0;
  g.r(4 + o, 30, 4, 4, 6); g.r(16 + o, 30, 4, 4, 6); g.r(3, 32, 7, 2, 7); g.r(14, 32, 7, 2, 7);
  g.r(6 + o, 22, 4, 9, 3); g.r(14 + o, 22, 4, 9, 3); g.r(5 + o, 13, 14, 10, 5); g.r(6 + o, 14, 12, 2, 8); g.r(2 + o, 12, 4, 8, 5); g.r(18 + o, 12, 4, 8, 5);
  g.e(12 + o, 7, 8, 7, 1); g.e(12 + o, 5, 7, 5, 4); g.r(8 + o, 9, 8, 2, 4); g.line(12 + o, 12, 12, 0, 8);
}), 15));
RS.ride = [0, 1, 2].map(k => outline(spr(56, 40, g => { // Carl riding the A.S.S., from behind
  const o = k === 1 ? -3 : k === 2 ? 3 : 0;
  g.e(28, 30, 27, 7, 2); g.e(28, 28, 27, 7, 1); for (let i = 0; i < 6; i++) g.e(8 + i * 8, 30, 1.5, 1.5, i & 1 ? 9 : 7); g.e(28, 22, 13, 7, 4); g.e(28, 20, 11, 5, 3);
  g.e(28 + o, 11, 8, 7, 5); g.e(28 + o, 9, 7, 5, 6); g.r(24 + o, 13, 8, 3, 6); g.r(23 + o, 16, 10, 6, 6); g.r(27 + o, 16, 2, 6, 7);
}), 15));
RS.sat = outline(spr(40, 28, g => { g.r(0, 8, 12, 12, 3); g.r(28, 8, 12, 12, 3); for (let x = 1; x < 12; x += 3) { g.r(x, 9, 1, 10, 4); g.r(x + 28, 9, 1, 10, 4); } g.r(12, 13, 16, 2, 2); g.e(20, 14, 6, 7, 1); g.e(20, 13, 3, 3, 6); g.line(20, 7, 24, 0, 2); g.p(24, 0, 5); }), 15);
RS.ufo = outline(spr(40, 22, g => { g.e(20, 14, 19, 5, 2); g.e(20, 12, 19, 5, 1); g.e(20, 8, 9, 7, 3); g.e(20, 9, 5, 5, 5); for (let i = 0; i < 5; i++) g.p(6 + i * 7, 13, 4); }), 15);
RS.pretz = outline(spr(28, 24, g => { g.e(8, 10, 7, 7, 1); g.e(20, 10, 7, 7, 1); g.e(8, 10, 3.5, 3.5, 0); g.e(20, 10, 3.5, 3.5, 0); g.line(4, 16, 17, 23, 2); g.line(24, 16, 11, 23, 2); g.line(5, 16, 18, 23, 1); g.line(23, 16, 10, 23, 1); g.p(9, 5, 3); g.p(21, 5, 3); }), 15);
RS.syn = [0, 1].map(f => outline(spr(112, 72, g => { // THE SYNDICATOR: a satellite made of reruns
  g.e(56, 40, 30, 22, 2); g.e(56, 38, 28, 20, 1); g.e(56, 38, 14, 10, 4); for (let i = 0; i < 3; i++) { const cx = [22, 56, 90][i]; g.e(cx, 14, 13, 11, 3); g.e(cx, 13, 11, 9, 1); g.e(cx, 13, 5, 4, (i + f) % 2 ? 6 : 8); g.line(cx, 24, 56, 34, 3); }
  g.r(0, 34, 26, 12, 3); g.r(86, 34, 26, 12, 3); for (let x = 1; x < 26; x += 4) { g.r(x, 35, 2, 10, 7); g.r(x + 86, 35, 2, 10, 7); }
  g.r(40, 44, 32, 8, 4); sprText(g, 'RERUN', 41, 45, 8); g.e(48, 36, 2, 2, 5); g.e(64, 36, 2, 2, 5); g.r(50, 58, 12, 10, 3);
}), 15));
RS.sign = spr(40, 36, g => { g.r(18, 20, 3, 16, 3); g.r(0, 0, 40, 22, 1); g.r(1, 1, 38, 20, 1); sprText(g, 'HOUR', 8, 3, 2); });

// ---------------- the road ----------------
const RD = { mode: '', segs: [], segL: 200, roadW: 2000, camH: 1100, camD: .84, pos: 0, spd: 0, max: 12000, px: 0, t: 0, len: 0, cars: [], bgX: 0, playerZ: 0, air: 0, done: 0, res: {} };
function roadSeg(i, y0, y1, curve) { return { i, curve, p1: { wy: y0, wz: i * RD.segL }, p2: { wy: y1, wz: (i + 1) * RD.segL }, spr: [], clip: H }; }
function buildRoad(sections) { // [n, curve, hill]
  RD.segs = []; let y = 0;
  for (const [n, curve, hill] of sections) for (let k = 0; k < n; k++) { const y0 = y; y += hill * (1 - Math.cos((k + 1) / n * Math.PI)) / 2 - hill * (1 - Math.cos(k / n * Math.PI)) / 2; RD.segs.push(roadSeg(RD.segs.length, y0, y, curve * Math.sin(Math.PI * (k + .5) / n))); }
  RD.len = RD.segs.length * RD.segL;
}
const segAt = z => RD.segs[Math.floor(z / RD.segL) % RD.segs.length];
function proj(p, cx, cy, cz, ox) { p.cz = p.wz - cz; p.sc = RD.camD / p.cz; p.sx = Math.round(W / 2 + p.sc * (ox - cx) * W / 2); p.sy = Math.round(RD.hor - p.sc * (p.wy - cy) * H / 2); p.sw = Math.round(p.sc * RD.roadW * W / 2); }
function renderRoad(pal2) {
  const base = segAt(RD.pos), pct = (RD.pos % RD.segL) / RD.segL, pseg = segAt(RD.pos + RD.playerZ), ppct = ((RD.pos + RD.playerZ) % RD.segL) / RD.segL;
  const py = pseg.p1.wy + (pseg.p2.wy - pseg.p1.wy) * ppct, camY = RD.camH + py + RD.air * 6;
  let maxy = H, x = 0, dx = -(base.curve * pct);
  RD.draw = [];
  for (let n = 0; n < 150; n++) {
    const s = RD.segs[(base.i + n) % RD.segs.length], looped = s.i < base.i, cz = RD.pos - (looped ? RD.len : 0);
    proj(s.p1, RD.px * RD.roadW, camY, cz, x); proj(s.p2, RD.px * RD.roadW, camY, cz, x + dx);
    x += dx; dx += s.curve; s.clip = maxy;
    RD.draw.push(s);
    if (s.p1.cz <= RD.camD || s.p2.sy >= s.p1.sy || s.p2.sy >= maxy) continue;
    const alt = ((s.i / 3) | 0) & 1, y0 = Math.max(0, s.p2.sy), y1 = Math.min(s.p1.sy, maxy);
    for (let yy = y0; yy < y1; yy++) {
      const t = (yy - s.p2.sy) / Math.max(1, s.p1.sy - s.p2.sy), xc = s.p2.sx + (s.p1.sx - s.p2.sx) * t, w = s.p2.sw + (s.p1.sw - s.p2.sw) * t;
      rectF(0, yy, W, 1, pal2.ground[alt]); rectF(xc - w * 1.14, yy, w * 2.28, 1, pal2.rumble[alt]); rectF(xc - w, yy, w * 2, 1, pal2.road[alt]);
      if (pal2.line && !alt) rectF(xc - w * .03, yy, Math.max(1, w * .06), 1, pal2.line);
      if (pal2.lanes && alt) { rectF(xc - w * .52, yy, Math.max(1, w * .03), 1, pal2.lanes); rectF(xc + w * .49, yy, Math.max(1, w * .03), 1, pal2.lanes); }
    }
    maxy = s.p2.sy;
  }
}
function renderRoadSprites(extra) {
  for (let n = RD.draw.length - 1; n > 0; n--) {
    const s = RD.draw[n]; if (s.p1.cz < (RD.nearCut || RD.segL * 1.2)) continue;
    const sc = s.p1.sc * W / 2 * RD.roadW * (RD.sprScale || .0036);
    for (const o of s.spr) { const S = RS[o.k], P = RP[o.p || o.k]; if (!S || o.dead) continue; const ss = Array.isArray(S) ? S[0] : S, k = sc * (o.sz || 1); const sx = s.p1.sx + s.p1.sc * o.off * RD.roadW * W / 2 - ss.w * k / 2, sy = s.p1.sy - ss.h * k; drawSC(ss, sx, sy, P, k, s.clip, o.flip); }
    if (extra) extra(s, sc);
  }
}
// ================= DESERT BUS TURBO =================
async function desertBusTurbo() {
  const secs = [[40, 0, 0], [60, 2, 0], [40, 0, 800], [60, -2.5, 0], [30, 0, -800]];
  const track = []; for (let h = 0; h < 8; h++) for (const [n, c, hl] of secs) track.push([n, c * (1 + h * .12) * (h % 2 ? -1 : 1), hl * (h % 3 === 2 ? 1.5 : 1)]);
  track.push([60, 0, 0]);
  buildRoad(track);
  const per = Math.floor(RD.segs.length / 8);
  RD.segs.forEach((s, i) => {
    if (i % 12 === 0) s.spr.push({ k: 'cactus', off: (i / 12) & 1 ? -1.6 - Math.random() : 1.6 + Math.random(), sz: 1.3 });
    if (i % 90 === 45) s.spr.push({ k: pick(['billProp', 'billHuman', 'billVegas', 'billSequel']), p: 'bill', off: (i / 90) & 1 ? -2.2 : 2.2, sz: 2.2 });
    if (i % per === 0 && i) s.spr.push({ k: 'sign', off: -1.7, sz: 1.4, hour: i / per }, { k: 'busstop', p: 'stop', off: 1.5, sz: 1.2 });
    if (i > 60 && i % 37 === 0) s.spr.push({ k: 'rock', off: (Math.random() - .5) * 1.4, sz: 1.2, hit: 1 });
    if (i > 80 && i % 53 === 0) s.spr.push({ k: 'tumble', off: -1, sz: 1, hit: 1, roll: .01 });
  });
  RD.segs[RD.segs.length - 30].spr.push({ k: 'billDiner', p: 'bill', off: 0, sz: 3.5 });
  Object.assign(RD, { mode: 'bus', nearCut: 0, pos: 0, spd: 0, max: 11500, px: 0, t: 0, hor: 110, playerZ: RD.camH * RD.camD * 1.2, air: 0, done: 0, crash: 0, cars: [], bgX: 0, sprScale: .0036, res: {} });
  RD.human = { z: 2600, off: .45, spd: 9800 };
  for (let i = 0; i < 16; i++) RD.cars.push({ z: 3000 + i * 18000 + rnd(6000), off: (Math.random() - .5) * 1.2, spd: 5000 + rnd(2500), k: i % 3 === 0 ? 'truck' : 'car' });
  DBG.mode = 'road'; DBG.road = RD;
  const pv = scene, pm = curName; music('road');
  let hours = 0, clockT = 60 * 30;
  scene = {
    update() {
      RD.t++; shakeDecay(); if (RD.done) return;
      const dt = 1 / 60, accel = held.a || RD.auto ? 5200 : -2600;
      RD.spd = clamp(RD.spd + (held.b ? -9000 : accel) * dt, 0, RD.max);
      if (Math.abs(RD.px) > 1.05) RD.spd = Math.min(RD.spd, RD.max * .35);
      const ps = segAt(RD.pos + RD.playerZ), k = RD.spd / RD.max;
      RD.px += ((held.right ? 1 : 0) - (held.left ? 1 : 0)) * dt * 2.4 * Math.min(1, k * 2);
      RD.px -= ps.curve * k * k * .045; RD.px += .0008 * k; // the bus still pulls to the right. it always has
      RD.px = clamp(RD.px, -2.2, 2.2);
      if (RD.crash > 0) { RD.crash--; RD.spd *= .975; }
      RD.pos += RD.spd * dt;
      // obstacles at the player's segment
      for (let d = 0; d < 2; d++) { const s = segAt(RD.pos + RD.playerZ + d * RD.segL); for (const o of s.spr) if (!o.dead && (o.hit || o.k === 'cactus' || o.k === 'busstop' || o.p === 'bill' || o.k === 'sign') && Math.abs(o.off - RD.px) < (o.hit ? .32 : .5) && RD.crash <= 0) { RD.crash = 40; sfx('hurt'); WD.shake = 10; RD.res.crashes = (RD.res.crashes || 0) + 1; if (o.hit) o.dead = 1; } }
      for (const c of RD.cars) { c.z += c.spd * dt; if (c.z > RD.len) c.z -= RD.len; const dz = c.z - (RD.pos + RD.playerZ); if (dz > 0 && dz < RD.segL * 1.5 && Math.abs(c.off - RD.px) < .45 && RD.crash <= 0) { RD.crash = 50; RD.spd *= .4; sfx('hurt'); WD.shake = 12; RD.res.crashes = (RD.res.crashes || 0) + 1; } }
      const H2 = RD.human; H2.spd = 7000 + (RD.pos > H2.z ? 700 : -400) + Math.sin(RD.t * .01) * 500; H2.z += H2.spd * dt; if (H2.z >= RD.len - RD.segL * 40) H2.fin = 1; H2.off = Math.sin(RD.t * .006) * .5;
      if (!RD.passed && RD.pos > H2.z) { RD.passed = 1; tickRoad(pick(['Great job, genius.', 'Nobody tells me what to do.']), 'HU-MAN'); }
      if (RD.passed && H2.z > RD.pos + 400 && RD.t % 400 === 0) tickRoad('Relax. Everything went exactly as planned.', 'HU-MAN');
      clockT--; const h = Math.floor(RD.pos / (per * RD.segL)); if (h > hours && h <= 8) { hours = h; clockT += 60 * 9; sfx('get'); banner('HOUR ' + h + ' OF 8' + (h === 8 ? '. THE DINER.' : ''), 100); if (h === 4) tickRoad('Hour four. Halfway. The bus still pulls right. Some things they don\'t fix.', 'CARL'); if (h === 6) tickRoad('Hour six. Chat, talk to me. Say anything. Say "bus".', 'CARL'); }
      RD.bgX += ps.curve * k * 2;
      if (RD.pos >= RD.len - RD.segL * 40 || clockT <= 0) { RD.done = 1; RD.res.win = !H2.fin; RD.res.late = clockT <= 0; if (!RD.res.win) RD.res.why = RD.res.late ? 'THE CLOCK RAN OUT AT HOUR ' + Math.min(8, hours + 1) + '. KEEP THE GAS DOWN (A), AVOID CARS AND ROCKS.' : 'HU-MAN GOT TO THE DINER FIRST. PASS HIS CONVERTIBLE.'; }
      RD.hours = hours; RD.clock = clockT;
    },
    draw() {
      skyD(0, RD.hor + 10, '#241a48', '#ff9249'); circF(W / 2 + 60 - RD.bgX % 40, 70, 20, hex('#ffdb92'));
      for (let i = 0; i < 8; i++) { const x = ((i * 70 - RD.bgX * 30) % 560 + 560) % 560 - 120; triF(x, RD.hor + 10, x + 50, RD.hor - 26 - (i % 3) * 10, x + 110, RD.hor + 10, hex('#6d3a24')); rectF(x + 36, RD.hor - 26 - (i % 3) * 10, 30, 4, hex('#924924')); }
      renderRoad({ ground: [hex('#dbb66d'), hex('#c8a05a')], rumble: [hex('#ffffff'), hex('#db2424')], road: [hex('#4a4a56'), hex('#44444f')], line: hex('#ffdb24') });
      renderRoadSprites((s, sc) => {
        for (const c of RD.cars) if (segAt(c.z) === s) { const S = RS[c.k], k = sc * 1.4; drawSC(S, s.p1.sx + s.p1.sc * c.off * RD.roadW * W / 2 - S.w * k / 2, s.p1.sy - S.h * k, RP[c.k], k, s.clip); }
        if (segAt(RD.human.z) === s) { const S = RS.car, k = sc * 1.5; drawSC(S, s.p1.sx + s.p1.sc * RD.human.off * RD.roadW * W / 2 - S.w * k / 2, s.p1.sy - S.h * k, RP.car, k, s.clip); }
      });
      const lean = held.left ? 1 : held.right ? 2 : 0, bob = RD.crash > 0 ? rnd(3) - 1 : (RD.t >> 3) & 1;
      drawScaled(RS.bus[lean], W / 2 - 48, H - 72 + bob, RP.bus, 1.5);
      if (RD.crash > 20) text('CRASH!', W / 2 - 18, H - 64, hex('#ff2449'));
      rectA(0, 0, W, 22, BLACK, .6); text('DESERT BUS TURBO', 4, 3, hex('#ffdb24')); text('HOUR ' + Math.min(8, RD.hours + 1) + '/8', 4, 12, WHITE);
      text((RD.spd / RD.max * 88 | 0) + ' MPH', 110, 3, hex('#6dff24')); text('TIME ' + Math.max(0, Math.ceil(RD.clock / 60)), 110, 12, RD.clock < 600 ? hex('#ff4949') : WHITE);
      text(RD.pos > RD.human.z ? 'POS 1ST' : 'POS 2ND', 200, 3, RD.pos > RD.human.z ? hex('#6dff24') : hex('#ff9224')); text('HU-MAN ' + (RD.pos > RD.human.z ? 'BEHIND' : 'AHEAD'), 200, 12, UI.dim);
      rectF(4, H - 6, W - 8, 3, hex('#242424')); rectF(4, H - 6, (W - 8) * Math.min(1, RD.pos / RD.len), 3, hex('#6dff24'));
      drawRoadTicks();
      if (RD.t < 150) ctext('A: GAS   B: BRAKE   ARROWS: STEER', 60, UI.name);
    },
  };
  post.fade = 1; await fadeIn(.08);
  while (!RD.done) await nextFrame();
  await wait(40); await fadeOut(.06);
  WD.shake = 0; post.shake = 0; scene = pv; music(pm); DBG.mode = 'world'; await fadeIn(.08);
  return RD.res;
}
let RTICK = [];
function shakeDecay() { if (WD.shake > 0) { WD.shake--; post.shake = WD.shake > 0 ? Math.min(3, WD.shake >> 1) : 0; } else post.shake = 0; }
function tickRoad(m, u) { RTICK.push({ m, u, t: 240 }); }
function drawRoadTicks() { RTICK.forEach(k => k.t--); RTICK = RTICK.filter(k => k.t > 0); RTICK.slice(-3).forEach((k, i) => { const s = (k.u + ': ' + k.m).toUpperCase().slice(0, 52); rectA(0, 150 + i * 10, s.length * 6 + 6, 9, BLACK, .6); text(s, 3, 151 + i * 10, k.u === 'CARL' ? hex('#6dff24') : k.u === 'HU-MAN' ? hex('#ffdb49') : UI.dim, 0); }); }

// ================= JUMP THE SHARK (water ski) =================
async function jumpTheShark() {
  const tr = [[50, 0, 0]]; for (let k = 0; k < 5; k++) tr.push([70, 1.5 + k * .2, 0], [60, -1.6 - k * .2, 0], [40, 0, 0]); tr.push([120, 0, 0], [60, 0, 0]);
  buildRoad(tr);
  const N = RD.segs.length, jumpSeg = N - 70;
  RD.segs.forEach((s, i) => {
    if (i % 16 === 0) s.spr.push({ k: 'rock', off: (i / 16) & 1 ? -1.8 : 1.8, sz: 2.4 });
    if (i > 30 && i < jumpSeg - 40 && i % 28 === 0) { const c = Math.sin(i * .7) * .5; s.spr.push({ k: 'buoy', off: c - .35, sz: 3.2 }, { k: 'buoy', off: c + .35, sz: 3.2 }); s.gate = { c }; }
    if (i > 40 && i < jumpSeg - 40 && i % 70 === 49) { s.spr.push({ k: 'ramp', off: 0, sz: 1.4 }); s.ramp = 1; }
  });
  RD.segs[jumpSeg - 30].spr.push({ k: 'fin', p: 'shark', off: 0, sz: 4.5 });
  RD.segs[jumpSeg].spr.push({ k: 'ramp', off: 0, sz: 2.4 }); RD.segs[jumpSeg].ramp = 2;
  Object.assign(RD, { mode: 'ski', nearCut: RD.camH * RD.camD * .95, pos: 0, spd: 5000, max: 9000, px: 0, t: 0, hor: 96, playerZ: RD.camH * RD.camD * 1.2, air: 0, vz: 0, done: 0, crash: 0, rat: 50, bgX: 0, sprScale: .0036, res: {}, trick: null, gates: 0, missed: 0, power: 0, bigJump: 0, jumpSeg });
  DBG.mode = 'road'; DBG.road = RD;
  const pv = scene, pm = curName; music('lake');
  const cross = ps => { // everything the skier passed this frame (fast skiers skip segments)
    if (ps.gate && !ps.gateDone) { ps.gateDone = 1; if (Math.abs(RD.px - ps.gate.c) < .33) { RD.gates++; RD.rat = Math.min(100, RD.rat + 6); sfx('ok'); if (RD.gates % 3 === 1) tickRoad(pick(['Through the thing! I went through the thing!', 'Gate. Nailed it. Nailed it? I nailed it.', 'Chat. CHAT. Are you seeing this. I\'m on a lake.']), 'CARL'); } else { RD.missed++; RD.rat = Math.max(0, RD.rat - 8); sfx('tick'); tickRoad(pick(['RATINGS -5.', 'THE FOCUS GROUP SIGHS.']), 'COMMITTEE'); } }
    for (const o of ps.spr) if (o.k === 'buoy' && !o.dead && Math.abs(o.off - RD.px) < .12 && !RD.air && RD.crash <= 0) { o.dead = 1; RD.crash = 30; RD.rat = Math.max(0, RD.rat - 8); sfx('hurt'); WD.shake = 8; }
    if (ps.ramp && !RD.air && !ps.used && (Math.abs(RD.px) < .45 || ps.ramp === 2)) { ps.used = 1; RD.air = .5;
      if (ps.ramp === 2) { RD.bigJump = 1; RD.vz = 3.6 + RD.power * .03; RD.trick = { seq: [0, 1, 2].map(() => pick(['left', 'right', 'up', 'a'])), i: 0, t: 0, ok: 0 }; sfx('power'); tickRoad('AYYYYY.', 'CARL'); }
      else { RD.vz = 3.2; RD.trick = { seq: [pick(['left', 'right', 'up', 'a'])], i: 0, t: 0, ok: 0 }; sfx('jump'); } }
  };
  scene = {
    update() {
      RD.t++; shakeDecay(); if (RD.done) return;
      const dt = 1 / 60, ps = segAt(RD.pos + RD.playerZ), si = ps.i;
      const nearJump = si > jumpSeg - 40 && si <= jumpSeg;
      if (nearJump && !RD.air) { RD.power = clamp(RD.power + (held.a ? 1.4 : -.6), 0, 100); RD.spd = 6000 + RD.power * 30; }
      else if (!RD.air) RD.spd = clamp(RD.spd + (held.a ? 3000 : -1000) * dt, 5000, RD.max);
      if (!RD.air) { RD.px += ((held.right ? 1 : 0) - (held.left ? 1 : 0)) * dt * 2.2; RD.px -= ps.curve * .018; RD.px = clamp(RD.px, -1.1, 1.1); }
      if (RD.crash > 0) RD.crash--;
      RD.pos += RD.spd * dt;
      const si1 = segAt(RD.pos + RD.playerZ).i; for (let q = si + 1; q <= si1; q++) cross(RD.segs[q]);
      if (RD.air) {
        RD.air += RD.vz; RD.vz -= RD.bigJump ? .07 : .2;
        const tk = RD.trick; if (tk && tk.i < tk.seq.length) { tk.t++; for (const k of ['left', 'right', 'up', 'a']) if (pressed[k]) { if (k === tk.seq[tk.i]) { tk.ok++; sfx('ok'); } else sfx('tick'); tk.i++; break; } }
        if (RD.air <= 0) { RD.air = 0; const ok = tk && tk.ok === tk.seq.length;
          if (RD.bigJump) { if (!tk || !tk.ok) RD.res.why = 'NO TRICK. PRESS THE ARROWS SHOWN IN THE AIR.'; else { RD.res.trick = tk.ok; RD.res.power = RD.power | 0; } RD.rat = clamp(RD.rat + (tk ? tk.ok * 8 : 0), 0, 100); RD.done = 1; }
          else { RD.rat = clamp(RD.rat + (ok ? 12 : -4), 0, 100); tickRoad(ok ? pick(['A TRICK! RATINGS +12.', 'THE FOCUS GROUP GASPS. POLITELY.']) : 'SPLASH. RATINGS -4.', 'COMMITTEE'); }
          RD.trick = null; }
      }
      RD.bgX += ps.curve * RD.spd / RD.max * 2;
      if (RD.rat <= 0 && !RD.bigJump) { RD.done = 1; RD.res.why = 'RATINGS HIT ZERO. STEER THROUGH THE BUOY GATES, AVOID SINGLE BUOYS.'; }
      if (si1 > jumpSeg + 60 && !RD.air) RD.done = 1;
    },
    draw() {
      skyD(0, RD.hor + 6, '#2449b6', '#92dbff');
      for (let i = 0; i < 7; i++) { const x = ((i * 80 - RD.bgX * 30) % 560 + 560) % 560 - 120; rectF(x, RD.hor - 40 - (i % 3) * 12, 90, 50 + (i % 3) * 12, hex(i & 1 ? '#b66d36' : '#924924')); rectF(x, RD.hor - 40 - (i % 3) * 12, 90, 4, hex('#db9249')); }
      rectF(0, RD.hor, W, 8, hex('#1a4a8f'));
      renderRoad({ ground: [hex('#b66d36'), hex('#a0602a')], rumble: [hex('#dbc892'), hex('#c8b07a')], road: [hex('#2492db'), hex('#1a80c8')], lanes: hex('#92dbff') });
      const boatS = segAt(RD.pos + RD.playerZ + RD.segL * 6);
      renderRoadSprites(s => { if (s === boatS && !RD.bigJump) { const k = s.p1.sc * W / 2 * RD.roadW * .0036 * 1.2; drawSC(RS.boat, s.p1.sx - RS.boat.w * k / 2, s.p1.sy - RS.boat.h * k, RP.boat, k, s.clip); RD.boatXY = [s.p1.sx, s.p1.sy - RS.boat.h * k * .5]; } });
      const lean = held.left ? 1 : held.right ? 2 : 0, y = H - 46 - RD.air * (RD.bigJump ? .9 : 1.2);
      if (RD.bigJump && RD.air > 0) drawScaled(RS.sharkBig, W / 2 - 64, H - 70 + Math.max(0, 40 - RD.air) * .5, RP.shark, 2);
      if (RD.boatXY && !RD.bigJump) lineF(W / 2, y + 12, RD.boatXY[0], RD.boatXY[1], hex('#ffffff'));
      if (!RD.air) for (let i = 0; i < 6; i++) pset(W / 2 - 8 + rnd(16), H - 10 + rnd(4), WHITE);
      draw(RS.ski[lean], W / 2 - 12, y, RP.ski); if (RD.air) rectA(W / 2 - 10, H - 12, 20, 3, BLACK, .3);
      rectA(0, 0, W, 22, BLACK, .6); text('JUMP THE SHARK', 4, 3, hex('#92dbff')); text('RATINGS', 4, 12, WHITE); rectF(52, 13, 80, 5, hex('#301010')); rectF(52, 13, 80 * RD.rat / 100, 5, RD.rat < 30 ? hex('#ff4949') : hex('#ffdb24'));
      text('GATES ' + RD.gates, 150, 3, hex('#6dff24')); text('LAKE MEAD', 150, 12, UI.dim);
      const si = segAt(RD.pos + RD.playerZ).i;
      if (si > jumpSeg - 40 && si <= jumpSeg && !RD.air) { ctext('HOLD A! SPEED FOR THE JUMP!', 40, (RD.t >> 3) & 1 ? hex('#ffdb24') : WHITE); rectF(W / 2 - 50, 52, 100, 6, hex('#242424')); rectF(W / 2 - 50, 52, RD.power, 6, hex('#ff6d24')); }
      if (RD.trick && RD.trick.i < RD.trick.seq.length) { const L = { left: '<', right: '>', up: '^', a: 'A' }; ctext('TRICK: ' + RD.trick.seq.map((k, i) => i < RD.trick.i ? '*' : L[k]).join(' '), 64, hex('#ff49db'), BLACK, 2); }
      drawRoadTicks();
      if (RD.t < 150) ctext('ARROWS: STEER THROUGH THE GATES   A: SPEED', 64, UI.name);
    },
  };
  post.fade = 1; await fadeIn(.08);
  while (!RD.done) await nextFrame();
  RD.res.rat = RD.rat; RD.res.gates = RD.gates;
  await wait(30); await fadeOut(.06); WD.shake = 0; post.shake = 0; scene = pv; music(pm); DBG.mode = 'world'; await fadeIn(.08);
  return RD.res;
}

// ================= IN SPACE (Harrier) =================
const SP = { px: W / 2, py: 150, obj: [], shots: [], eshots: [], t: 0, hp: 6, hor: 96, F: 150, scroll: 0, done: 0, boss: null, wave: 0, fx: [] };
function spProj(x, y, z) { const k = SP.F / z; return [W / 2 + x * k, SP.hor + y * k, k]; }
async function inSpace(mode) {
  const bossOnly = mode === 'boss', wavesOnly = mode === 'waves';
  Object.assign(SP, { px: W / 2, py: 150, obj: [], shots: [], eshots: [], t: 0, hp: 6 + Math.min(4, (C2.lv / 2) | 0), maxhp: 6 + Math.min(4, (C2.lv / 2) | 0), scroll: 0, done: 0, boss: null, wave: 0, fx: [], cd: 0, inv: 0, res: {} });
  DBG.mode = 'space'; DBG.space = SP;
  const pv = scene, pm = curName; music(bossOnly ? 'boss' : 'space');
  const waves = [
    [0, () => spawnSP('pretz', -1, -.3, 3), () => spawnSP('pretz', 1, -.3, 3)], [60, () => { for (let i = 0; i < 5; i++) spawnSP('ufo', -1.2 + i * .6, -.4, 1, { wz: i * .6 }); }],
    [170, () => spawnSP('sat', 0, -.2, 5)], [260, () => { for (let i = 0; i < 6; i++) spawnSP('pretz', Math.sin(i) * 1.2, -.6 + (i % 3) * .3, 2, { wz: i * .4 }); }],
    [360, () => { spawnSP('rock', -.8, .95, 99); spawnSP('rock', .8, .95, 99, { wz: 1 }); spawnSP('rock', 0, .95, 99, { wz: 2 }); }],
    [440, () => { for (let i = 0; i < 4; i++) spawnSP('ufo', -1 + i * .7, -.2, 1, { wz: i * .5, weave: 1 }); spawnSP('sat', 1, -.5, 5, { wz: 2 }); }],
    [560, () => { for (let i = 0; i < 8; i++) spawnSP('pretz', Math.cos(i * .8) * 1.3, -.5 + Math.sin(i * .8) * .3, 2, { wz: i * .3 }); }],
    [680, () => { spawnSP('rock', -1, .95, 99); spawnSP('rock', 1, .95, 99, { wz: .5 }); for (let i = 0; i < 3; i++) spawnSP('sat', -1 + i, -.4, 5, { wz: 1 + i }); }],
  ];
  const bossAt = bossOnly ? 60 : wavesOnly ? 1e9 : 860;
  scene = {
    update() {
      SP.t++; shakeDecay(); if (SP.done) return; SP.scroll += .12; if (SP.inv > 0) SP.inv--; if (SP.cd > 0) SP.cd--;
      const mv = 2.6; SP.px = clamp(SP.px + ((held.right ? 1 : 0) - (held.left ? 1 : 0)) * mv, 28, W - 28); SP.py = clamp(SP.py + ((held.down ? 1 : 0) - (held.up ? 1 : 0)) * mv, 56, 196);
      if (held.a && SP.cd <= 0) { SP.cd = 9; const b = curBong(); SP.shots.push({ x: (SP.px - W / 2) / SP.F, y: (SP.py - 14 - SP.hor) / SP.F, z: 1, b }); sfx('blip', [900, 60]); }
      if (!bossOnly) for (const [t, fn] of waves) if (SP.t === t + 30) fn();
      if (SP.t === bossAt) spawnBoss();
      for (const s of SP.shots) { s.z += .16; if (s.z > 14) s.dead = 1; for (const o of SP.obj) { if (o.dead || Math.abs(o.z - s.z) > .5) continue; if (Math.abs(o.x - s.x) < o.r && Math.abs(o.y - s.y) < o.r) { s.dead = 1; o.hp -= s.b.dmg * .5 + 1; o.fl = 6; if (o.hp <= 0) killSP(o); break; } } }
      for (const o of SP.obj) {
        if (o.dead) continue; o.t++;
        if (o.k === 'boss') bossUpdSP(o);
        else { if (o.wz > 0) { o.wz -= .02; continue; } o.z -= o.spd; if (o.weave) o.x += Math.sin(o.t * .06) * .02; if (o.k === 'ufo' && o.t % 70 === 30 && o.z < 9) fireSP(o); if (o.k === 'sat' && o.t % 90 === 10 && o.z < 10) fireSP(o, 3); if (o.z < .5) o.dead = 1; }
        const [sx, sy, k] = spProj(o.x, o.y, o.z);
        if (o.z < 1.4 && o.z > .6 && Math.abs(sx - SP.px) < 18 + o.r * k * .4 && Math.abs(sy - (SP.py - 12)) < 16 + o.r * k * .4) spHurt();
      }
      for (const s of SP.eshots) { s.z -= .09; s.x += s.vx; s.y += s.vy; if (s.z < .6) s.dead = 1; const [sx, sy] = spProj(s.x, s.y, s.z); /* */ if (s.z < 1.25 && Math.abs(sx - SP.px) < 12 && Math.abs(sy - (SP.py - 12)) < 12) { s.dead = 1; spHurt(); } }
      for (const f of SP.fx) f.t--; SP.fx = SP.fx.filter(f => f.t > 0);
      SP.obj = SP.obj.filter(o => !o.dead || o.k === 'boss'); SP.shots = SP.shots.filter(s => !s.dead); SP.eshots = SP.eshots.filter(s => !s.dead);
      if (SP.boss && SP.boss.dead) { SP.done = 1; SP.res.win = 1; }
      if (wavesOnly && SP.t > 1000 && !SP.obj.some(o => !o.dead)) { SP.done = 1; SP.res.win = 1; }
      if (SP.hp <= 0) { SP.done = 1; SP.res.win = 0; SP.res.why = 'COOL HIT ZERO. SHOOT (A) THE SHOTS AND DODGE. DO NOT SIT STILL.'; }
    },
    draw() {
      skyD(0, SP.hor, '#000010', '#3a1060'); for (let i = 0; i < 60; i++) pset((i * 53 + (SP.t >> 2)) % W, (i * 29) % SP.hor, i % 7 ? hex('#6d6d92') : WHITE);
      circF(250, 44, 26, hex('#249249')); circF(244, 40, 22, hex('#49b649')); rectF(236, 38, 12, 6, hex('#dbb66d'));
      for (let y = SP.hor; y < H; y++) { const z = SP.F * 1.2 / Math.max(1, y - SP.hor), row = y * W, zz = ((z * 2 + SP.scroll) | 0) & 1; const fade = Math.min(1, (y - SP.hor) / 40);
        const c0 = mix(hex('#200030'), hex(zz ? '#6d2492' : '#24b6b6'), fade), c1 = mix(hex('#200030'), hex(zz ? '#24b6b6' : '#6d2492'), fade);
        for (let x = 0; x < W; x++) { const wx = (x - W / 2) * z / SP.F; FB[row + x] = ((wx * 1.2 + 100) | 0) & 1 ? c0 : c1; } }
      const all = SP.obj.filter(o => !(o.dead && o.k !== 'boss') && o.wz <= 0 && !(o.k === 'boss' && o.dead)).map(o => ({ o, z: o.z })).concat(SP.shots.map(s => ({ s, z: s.z })), SP.eshots.map(e => ({ e, z: e.z })));
      all.sort((a, b) => b.z - a.z);
      for (const it of all) {
        if (it.o) { const o = it.o, [sx, sy, k] = spProj(o.x, o.y, o.z), S = o.k === 'boss' ? RS.syn[(SP.t >> 4) & 1] : RS[o.k], sc = k * (o.k === 'boss' ? .03 : .0075) * (o.sz || 1); const [fx, fy] = spProj(o.x, 1, o.z); rectA(fx - S.w * sc / 3, fy, S.w * sc * .66, 3, BLACK, .3);
          if (o.fl > 0 && (o.fl-- & 2)) { drawScaledTint(S, sx - S.w * sc / 2, sy - S.h * sc / 2, sc, WHITE); } else drawSC(S, sx - S.w * sc / 2, sy - S.h * sc / 2, RP[o.k === 'boss' ? 'syn' : o.k === 'rock' ? 'rock' : o.k], sc, H); }
        else if (it.s) { const [sx, sy, k] = spProj(it.s.x, it.s.y, it.s.z); const ic = bongIcon(it.s.b); drawSC(ic.s, sx - ic.s.w * k * .006, sy - ic.s.h * k * .006, ic.P, Math.max(.2, k * .012), H); }
        else { const [sx, sy, k] = spProj(it.e.x, it.e.y, it.e.z); circF(sx, sy, Math.max(1.5, k * .025), hex('#ff2424')); pset(sx, sy, WHITE); }
      }
      for (const f of SP.fx) ringF(f.x, f.y, 20 - f.t, hex('#ffdb24'));
      rectA(SP.px - 18, H - 8, 36, 4, BLACK, .3);
      if (!(SP.inv > 0 && (SP.inv >> 2) & 1)) draw(RS.ride[held.left ? 1 : held.right ? 2 : 0], SP.px - 28, SP.py - 34, RP.ride);
      rectA(0, 0, W, 12, BLACK, .6); text('IN SPACE', 4, 3, hex('#b692ff')); text('COOL', 70, 3, hex('#92dbff')); rectF(96, 4, 50, 5, hex('#102040')); rectF(96, 4, 50 * SP.hp / SP.maxhp, 5, hex('#6dff92'));
      if (SP.boss && !SP.boss.dead) { text('THE SYNDICATOR', 160, 3, hex('#ff6d49')); rectF(250, 4, 64, 5, hex('#301010')); rectF(250, 4, 64 * SP.boss.hp / SP.boss.max, 5, hex('#ff6d49')); }
      drawRoadTicks();
      if (SP.t < 150) ctext('ARROWS: FLY   A: THROW BONGS INTO SPACE', 30, UI.name);
    },
  };
  post.fade = 1; await fadeIn(.08);
  while (!SP.done) await nextFrame();
  await wait(40); await fadeOut(.06); WD.shake = 0; post.shake = 0; scene = pv; music(pm); DBG.mode = 'world'; await fadeIn(.08);
  return SP.res;
}
function spawnSP(k, x, y, hp, o = {}) { SP.obj.push(Object.assign({ k, x, y, z: 13, hp: hp * (1 + (C2.lv - 1) * .08), r: k === 'sat' ? .28 : k === 'rock' ? .3 : .2, spd: k === 'rock' ? .07 : .045 + Math.random() * .02, t: 0, wz: 0 }, o)); }
function fireSP(o, n = 1) { for (let i = 0; i < n; i++) { const tx = (SP.px - W / 2) / SP.F, ty = (SP.py - 12 - SP.hor) / SP.F; SP.eshots.push({ x: o.x, y: o.y, z: o.z, vx: (tx - o.x) / (o.z / .09) + (i - (n - 1) / 2) * .012, vy: (ty - o.y) / (o.z / .09) }); } sfx('blip', [300, 40]); }
function killSP(o) { o.dead = 1; const [sx, sy] = spProj(o.x, o.y, o.z); SP.fx.push({ x: sx, y: sy, t: 20 }); sfx('blip', [120, 40]); C2.bux += 1; if (o.k === 'pretz' && Math.random() < .3 && SP.hp < SP.maxhp) { SP.hp++; tickRoad('SPACE PRETZEL. +1 COOL.', 'CARL'); } DBG.kills = (DBG.kills || 0) + 1; if (o.k === 'boss') { SP.res.boss = 1; } }
function spHurt() { if (SP.inv > 0 || DBG.god) return; SP.hp--; SP.inv = 70; sfx('hurt'); WD.shake = 12; tickRoad(pick(['Ow. OW. Space hurts.', 'Hit! I got hit. By space.', 'Okay I\'m fine, the A.S.S. is fine, nobody say it.']), 'CARL'); }
function spawnBoss() { SP.boss = { k: 'boss', x: 0, y: -.35, z: 7, hp: 160, max: 160, r: .8, t: 0, sz: 1, wz: 0 }; SP.obj.push(SP.boss); tickRoad('THIS IS THE SYNDICATOR. EVERYTHING YOU DO WILL BE SHOWN AGAIN. FOREVER.', 'HEAD OF CONTENT'); }
function bossUpdSP(o) {
  o.x = Math.sin(o.t * .012) * .9; o.y = -.35 + Math.sin(o.t * .021) * .25; o.z = 6.5 + Math.sin(o.t * .008) * 1.5;
  if (o.t % 80 === 0) fireSP(o, o.hp < o.max / 2 ? 5 : 3);
  if (o.t % 240 === 120) { for (let i = 0; i < 3; i++) spawnSP('pretz', -1 + i, -.6, 2, { z: o.z }); tickRoad(pick(['RERUN.', 'PREVIOUSLY ON CARL.', 'WE\'LL BE RIGHT BACK.']), 'SYNDICATOR'); }
}
