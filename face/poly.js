'use strict';
// ================= FACE-FX: the co-processor on this cartridge. flat-shaded polygons, painter's sort =================
// Stage 6 is the Next Generation booting. The game becomes 3D because he is building the thing that makes games 3D.
const FX3 = { f: 190, cx: 160, cy: 118, ZP: 60, objs: [], pb: [], eb: [], scroll: 0, speed: 3, t: 0, sky: 'fx', control: 100, hitflash: 0, phase: '', shake: 0, lights: [] };
const MESH = {};
(() => {
  const cube = { v: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]], f: [[0, 1, 2], [0, 2, 3], [5, 4, 7], [5, 7, 6], [4, 0, 3], [4, 3, 7], [1, 5, 6], [1, 6, 2], [4, 5, 1], [4, 1, 0], [3, 2, 6], [3, 6, 7]] };
  const octa = { v: [[0, -1.3, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, 1.3, 0]], f: [[0, 2, 1], [0, 3, 2], [0, 4, 3], [0, 1, 4], [5, 1, 2], [5, 2, 3], [5, 3, 4], [5, 4, 1]] };
  const pyr = { v: [[0, -1.2, 0], [-1, .8, -1], [1, .8, -1], [1, .8, 1], [-1, .8, 1]], f: [[0, 2, 1], [0, 3, 2], [0, 4, 3], [0, 1, 4], [1, 2, 3], [1, 3, 4]] };
  // a capital ship: long hull, wedge prow, bridge tower
  const ship = { v: [[-1, -.2, -3], [1, -.2, -3], [1, .3, -3], [-1, .3, -3], [-1.3, -.3, 2], [1.3, -.3, 2], [1.3, .4, 2], [-1.3, .4, 2], [0, 0, -4.5], [-.4, -1, 1], [.4, -1, 1], [.4, -.3, 1.6], [-.4, -.3, 1.6]],
    f: [[8, 1, 0], [8, 2, 1], [8, 3, 2], [8, 0, 3], [0, 1, 5], [0, 5, 4], [3, 7, 6], [3, 6, 2], [0, 4, 7], [0, 7, 3], [1, 2, 6], [1, 6, 5], [4, 5, 6], [4, 6, 7], [9, 10, 11], [9, 11, 12], [9, 12, 4], [10, 5, 11]] };
  const ring = { v: [], f: [] };
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; ring.v.push([Math.cos(a), Math.sin(a), 0], [Math.cos(a) * .7, Math.sin(a) * .7, .2]); }
  for (let i = 0; i < 10; i++) { const a = i * 2, b = ((i + 1) % 10) * 2; ring.f.push([a, b, b + 1], [a, b + 1, a + 1]); }
  Object.assign(MESH, { cube, octa, pyr, ship, ring });
})();
function rot(v, rx, ry, rz) {
  let [x, y, z] = v, c, s, t;
  c = Math.cos(rx); s = Math.sin(rx); t = y * c - z * s; z = y * s + z * c; y = t;
  c = Math.cos(ry); s = Math.sin(ry); t = x * c + z * s; z = -x * s + z * c; x = t;
  c = Math.cos(rz); s = Math.sin(rz); t = x * c - y * s; y = x * s + y * c; x = t;
  return [x, y, z];
}
const proj = (x, y, z) => [FX3.cx + x * FX3.f / z, FX3.cy + y * FX3.f / z];
function shade(c, k) { const [r, g, b] = chan(c); return rgb(r * k, g * k, b * k); }
function renderObjs() {
  const tris = [], L = [.4, -.7, -.6];
  for (const o of FX3.objs) {
    if (o.z < 8 || o.dead) continue;
    const M = MESH[o.mesh], vs = M.v.map(v => { const r = rot(v, o.rx, o.ry, o.rz); return [r[0] * o.s[0] + o.x, r[1] * o.s[1] + o.y, r[2] * o.s[2] + o.z]; });
    for (let i = 0; i < M.f.length; i++) {
      const [a, b, c] = M.f[i], A = vs[a], B = vs[b], Cc = vs[c];
      if (A[2] < 6 || B[2] < 6 || Cc[2] < 6) continue;
      const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = Cc[0] - A[0], vy = Cc[1] - A[1], vz = Cc[2] - A[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      if (nx * A[0] + ny * A[1] + nz * A[2] > 0) continue; // backface
      const lit = .35 + .65 * Math.max(0, -(nx * L[0] + ny * L[1] + nz * L[2]));
      const base = o.fl > 0 ? WHITE : (o.cols ? o.cols[i % o.cols.length] : o.col);
      const fog = Math.min(1, Math.max(0, (A[2] - 300) / 500));
      tris.push({ z: (A[2] + B[2] + Cc[2]) / 3, p: [proj(...A), proj(...B), proj(...Cc)], c: mix(shade(base, lit), FX3.fogC || hex('#000024'), fog) });
    }
  }
  tris.sort((a, b) => b.z - a.z);
  for (const t of tris) triF(t.p[0][0], t.p[0][1], t.p[1][0], t.p[1][1], t.p[2][0], t.p[2][1], t.c);
  for (const o of FX3.objs) if (o.glow && o.z > 8) for (const [gx, gy, gz] of o.glow) { const r = rot([gx, gy, gz], o.rx, o.ry, o.rz), [sx, sy] = proj(r[0] * o.s[0] + o.x, r[1] * o.s[1] + o.y, r[2] * o.s[2] + o.z); const k = Math.max(1, 90 / o.z * 2); circF(sx, sy, k, (FX3.t >> 3) & 1 ? hex('#ff2424') : hex('#ff6d6d')); pset(sx, sy, WHITE); }
}
function fxSky() {
  if (FX3.sky === 'war') {
    skyD(0, 70, '#000024', '#24246d'); skyD(70, 150, '#24246d', '#92246d'); skyD(150, H, '#6d2449', '#120012');
    for (let i = 0; i < 60; i++) pset((i * 97 + FX3.t * .2) % W, (i * 31) % 110, WHITE);
    for (const l of FX3.lights) { let x = l.x, y = 0; const c = l.t > 4 ? WHITE : hex('#92ffff'); for (let k = 0; k < 16; k++) { const nx = x + (((l.x * 7 + k * 13) % 21) - 10), ny = y + 9; lineF(x, y, nx, ny, c); lineF(x + 1, y, nx + 1, ny, hex('#24dbff')); if (k === 6) { let bx = nx, by = ny; for (let j = 0; j < 6; j++) { const qx = bx + 6 + ((j * 5) % 7), qy = by + 7; lineF(bx, by, qx, qy, hex('#92ffff')); bx = qx; by = qy; } } x = nx; y = ny; } if (l.t > 5) rectA(0, 0, W, 150, WHITE, .08); }
  } else if (FX3.sky === 'legacy') { cls(hex('#306230')); }
  else { skyD(0, FX3.cy, '#000012', '#300058'); skyD(FX3.cy, H, '#180030', '#000000'); for (let i = 0; i < 40; i++) pset((i * 83) % W, (i * 29) % 100, i % 3 ? hex('#6d6d92') : WHITE); }
  // floor grid: the plane of the next generation
  const gy = 70, gc = FX3.sky === 'war' ? hex('#b6246d') : hex('#ff24db');
  for (let k = 0; k < 16; k++) { const z = 20 + k * 40 - (FX3.scroll % 40); if (z < 12) continue; const y = FX3.cy + gy * FX3.f / z; rectF(0, y, W, 1, mix(gc, hex('#000012'), Math.min(1, z / 640))); }
  for (let i = -10; i <= 10; i++) { const [x0, y0] = proj(i * 40, gy, 12), [x1, y1] = proj(i * 40, gy, 660); lineF(x0, y0, x1, y1, mix(gc, hex('#000012'), .55)); }
}
// the player, seen from behind: the back of the cowl
const FACE_BACK = spr(24, 26, g => {
  const inH = (x, y) => { const dx = (x + .5 - 12) / 9.5, dy = (y + .5 - 14) / 11; if (dx * dx + dy * dy <= 1) return true; if (y >= 5 && y <= 12 && x >= 3 && x <= 20) return true; return (x >= 3 && y <= 9 && x - 3 <= y * .7) || (x <= 20 && y <= 9 && 20 - x <= y * .7); };
  g.each((x, y) => inH(x, y) ? 2 : 0); g.each((x, y) => { if (!inH(x, y)) return 0; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!inH(x + a, y + b)) return 4; return 0; });
  g.line(12, 3, 12, 22, 5); g.p(9, 10, 3); g.p(15, 10, 3);
});
const FX3P = { px: 160, py: 150 };
function fx3World() { return [(FX3P.px - FX3.cx) * FX3.ZP / FX3.f, (FX3P.py - FX3.cy) * FX3.ZP / FX3.f]; }
function fx3Update() {
  if (frozen()) return;
  if (post.flash > 0) post.flash = Math.max(0, post.flash - .06);
  FX3.t++; FX3.scroll += FX3.speed; if (FX3.hitflash > 0) FX3.hitflash--;
  const lock = FX3.control <= 0 || PLR.locked;
  const k = FX3.control / 100, sp = 2.6 * (lock ? 0 : .35 + .65 * k);
  let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0), dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
  if (FX3.control < 60 && FX3.t % 40 < 20) { dx += Math.sin(FX3.t * .07) * .6 * (1 - k); dy += Math.cos(FX3.t * .05) * .5 * (1 - k); }
  if (lock) { FX3P.px += (160 - FX3P.px) * .03; FX3P.py += (140 - FX3P.py) * .03; }
  else { FX3P.px = clamp(FX3P.px + dx * sp, 30, 290); FX3P.py = clamp(FX3P.py + dy * sp, 40, 200); }
  if (!lock && held.a && FX3.t % 6 === 0) { const [wx, wy] = fx3World(); FX3.pb.push({ x: wx - 4, y: wy - 3, z: FX3.ZP, t: 0 }, { x: wx + 4, y: wy - 3, z: FX3.ZP, t: 0 }); sfx('blip', [1300, 100]); }
  if (!lock && pressed.b) { if (PLR.pot >= 50) { PLR.pot -= 50; post.flash = .8; sfx('get'); FX3.eb = []; for (const o of FX3.objs) if (!o.boss && !o.armada && o.z < 500) hit3(o, 20); } else sfx('tick'); }
  for (const o of FX3.objs) { o.z -= FX3.speed + (o.vz || 0); o.x += o.vx || 0; o.y += o.vy || 0; o.rx += o.srx || 0; o.ry += o.sry || 0; o.rz += o.srz || 0; if (o.fl > 0) o.fl--; if (o.upd) o.upd(o); if (o.z < 10 && !o.keep) o.dead = 1; }
  for (const b of FX3.pb) { b.z += 12; b.t++; if (b.z > 900) b.dead = 1; for (const o of FX3.objs) { if (o.dead || !o.hp) continue; const r = o.r || 20; if (Math.abs(b.z - o.z) < r + 8 && Math.hypot(b.x - o.x, b.y - o.y) < r) { b.dead = 1; hit3(o, 1); break; } } }
  const [px, py] = fx3World();
  for (const b of FX3.eb) { b.x += b.vx; b.y += b.vy; b.z += b.vz; b.t++; if (b.z < FX3.ZP - 20 || b.t > 400) b.dead = 1;
    if (!b.dead && Math.abs(b.z - FX3.ZP) < 10 && Math.hypot(b.x - px, b.y - py) < (b.r || 3) + 2) { b.dead = 1; hit3player(); } }
  for (const o of FX3.objs) if (!o.dead && o.hp && !o.boss && !o.armada && o.z < FX3.ZP + 12 && o.z > FX3.ZP - 20 && Math.hypot(o.x - px, o.y - py) < (o.r || 10) * .6) { o.dead = 1; hit3player(); }
  FX3.objs = FX3.objs.filter(o => !o.dead); FX3.pb = FX3.pb.filter(b => !b.dead); FX3.eb = FX3.eb.filter(b => !b.dead);
  FX3.lights = FX3.lights.filter(l => --l.t > 0);
  if (FX3.tick) FX3.tick();
  const ev = FX3.events; while (ev && FX3.ev < ev.length && ev[FX3.ev][0] <= FX3.t) { const e = ev[FX3.ev++]; e[1](); if (frozen()) break; }
  if (PLR.inv > 0) PLR.inv--;
  commUpdate();
}
function hit3(o, d) {
  if (o.armada || SH.assisted) { o.fl = 3; FX3.assist = (FX3.assist || 0) + 1; if (FX3.t % 3 === 0) SH.fx.push({ k: 'txt', x: proj(o.x, o.y, o.z)[0] - 20 + rnd(30), y: proj(o.x, o.y, o.z)[1] + rnd(20), s: 'ASSISTED', t: 30, c: hex('#92ffff') }); return; }
  o.hp -= d; o.fl = 3; SH.viewers += 2;
  if (o.hp <= 0) { o.dead = 1; SH.viewers += o.pts || 50; sfx('land'); if (AC) noise(.3, { lp: 1200, vol: .4 }); const [sx, sy] = proj(o.x, o.y, o.z); for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, s = 1 + Math.random() * 3; SH.fx.push({ k: 'p', x: sx, y: sy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 20 + rnd(20), c: pick([o.col, WHITE, hex('#ffdb24')]) }); } PLR.pot = Math.min(100, PLR.pot + 3); if (o.die) o.die(o); }
}
function hit3player() {
  if (FX3.help) { FX3.control = Math.max(0, FX3.control - 4); FX3.hitflash = 10; sfx('stun'); SH.fx.push({ k: 'txt', x: FX3P.px - 20, y: FX3P.py - 30, s: '+HELP', t: 40, c: hex('#92ffff') }); return; }
  if (PLR.inv > 0 || DBG.god) return;
  sfx('hurt'); FX3.hitflash = 20; post.flash = .5; PLR.inv = 120; PLR.backups--; PLR.restores++; PLR.integrity = Math.max(1, PLR.integrity - 1);
  if (PLR.backups < 0) { PLR.backups = 2; PLR.integrity = Math.max(1, PLR.integrity - 5); banner('RESTORED FROM BACKUP FACE  ' + PLR.integrity + '%', 90); }
  else banner('RESTORED FROM BACKUP FACE  ' + PLR.integrity + '%', 90);
}
function eshot3(o, spd, o2 = {}) { const [px, py] = fx3World(), dz = FX3.ZP - o.z, n = Math.abs(dz) / spd; FX3.eb.push(Object.assign({ x: o.x, y: o.y, z: o.z, vx: (px - o.x) / n, vy: (py - o.y) / n, vz: -spd, t: 0, r: 3, c: hex('#ff4949') }, o2)); }
function fx3Draw() {
  fxSky();
  renderObjs();
  for (const b of FX3.pb) { if (b.z < 10) continue; const [x, y] = proj(b.x, b.y, b.z), s = Math.max(1, 60 / b.z * 2); rectF(x - s / 2, y - s / 2, s, s, hex('#6dff24')); }
  for (const b of FX3.eb) { if (b.z < 10) continue; const [x, y] = proj(b.x, b.y, b.z), s = Math.max(1.5, (b.r || 3) * FX3.f / b.z); circF(x, y, s, b.c); circF(x, y, Math.max(0, s - 1.5), WHITE); }
  if (!(PLR.inv > 0 && (PLR.inv >> 2) & 1)) { const x = FX3P.px - 12, y = FX3P.py - 13; draw(FACE_BACK, x, y, FX3.hitflash && (FX3.hitflash & 2) ? FP.new.map(() => hex('#92ffff')) : FP.new); rectF(FX3P.px - 1, FX3P.py - 7, 3, 3, (frame >> 3) & 1 ? hex('#6dff24') : WHITE); }
  drawFx();
  drawHUD();
  if (FX3.help) { rectF(92, PY + 3, 136, 9, BLACK); frameRect(92, PY + 3, 136, 9, hex('#92ffff')); rectF(93, PY + 4, Math.round(134 * FX3.control / 100), 7, FX3.control > 30 ? hex('#6dff24') : hex('#ff2424')); text('CONTROL ' + Math.round(FX3.control) + '%', 110, PY + 4, WHITE, BLACK); }
  if (FX3.over) FX3.over();
  drawComm();
}
const fx3Scene = { update() { fx3Update(); for (const f of SH.fx) { f.t--; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; } } SH.fx = SH.fx.filter(f => f.t > 0); }, draw: fx3Draw };
// spawners
function obj3(mesh, x, y, z, o = {}) { const ob = Object.assign({ mesh, x, y, z, rx: 0, ry: 0, rz: 0, s: [10, 10, 10], col: hex('#ff24db'), hp: 3, r: 14, fl: 0 }, o); if (typeof ob.s === 'number') ob.s = [ob.s, ob.s, ob.s]; FX3.objs.push(ob); return ob; }
