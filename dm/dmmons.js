'use strict';
// ================= DARK MONDAY: monsters, real-time combat, XP =================
// Time is frames (60/sec). The party melee-attacks the cell straight ahead; ranged weapons reach up to RANGE cells down a clear line.
let _seed = 12345;
const crand = () => { _seed = (_seed + 0x6D2B79F5) | 0; let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const cint = (a, b) => a + Math.floor(crand() * (b - a + 1)); // inclusive
const RANGE = 5;
let _shk = 0; // screen shake always decays, even while a menu or dialogue is up
function shake(n, t) { post.shake = n; _shk = t; }
function tickShake() { if (_shk > 0 && --_shk === 0) post.shake = 0; }

// ---------- monster definitions ----------
// hp, ac (to-hit target number bonus), hit (their attack bonus), dmg, atk (frames between attacks), mv (frames between steps), xp, aggro (path distance), size (world height, 1 = wall)
const MON = {
  INTERN: { name: 'INTERN', hp: 8, ac: 1, hit: 1, dmg: [1, 4], atk: 70, mv: 40, xp: 10, aggro: 8, size: .78 },
  COLLECTOR: { name: 'COLLECTOR', hp: 34, ac: 5, hit: 5, dmg: [4, 9], atk: 84, mv: 38, xp: 70, aggro: 6, size: 1.02, hold: .3 },
  MANAGER: { name: 'MIDDLE MANAGER', hp: 26, ac: 4, hit: 4, dmg: [3, 7], atk: 74, mv: 44, xp: 55, aggro: 8, size: .95, hold: .35, reach: 2 },
  PRIME: { name: 'COLLECTOR PRIME', hp: 120, ac: 6, hit: 6, dmg: [6, 12], atk: 70, mv: 36, xp: 260, aggro: 8, size: 1.4, hold: .3, boss: 1, summon: ['INTERN', 'INTERN', 'INTERN'] },
  BEHOLDEN: { name: 'THE BEHOLDEN', hp: 420, ac: 6, hit: 7, dmg: [9, 15], atk: 84, mv: 9999, xp: 600, aggro: 14, size: 1.75, boss: 1, still: 1, rays: 1 },
  SPIDER: { name: 'PHONE SPIDER', hp: 14, ac: 3, hit: 3, dmg: [2, 5], atk: 62, mv: 30, xp: 25, aggro: 9, size: .46, poison: .4 },
};
function mkMob(t, x, y, path, extra) { const d = MON[t]; return Object.assign({ t, x, y, path: path || null, pi: 0, hp: d.hp, max: d.hp, acd: 30 + cint(0, 30), mcd: d.mv, ox: 0, oy: 0, flash: 0, dying: 0, seed: cint(0, 99), side: crand() < .5 ? -1 : 1, lunge: 0, awake: 0 }, extra || {}); }

// ---------- sprites (drawn once into buffers; bottom-center anchored) ----------
const MSPR = {};
const BLADE = hex('#80f0ff');
function internSprite() { // a chrome-masked intern in a cheap suit, holding a clipboard that is also a sword
  const su = ramp(hex('#4a4a74')), st = ramp(hex('#8aa0c8'));
  return offscreen(72, 90, () => {
    F([[24, 60], [35, 60], [34, 85], [22, 85]], su[1]); F([[38, 60], [49, 60], [51, 85], [39, 85]], su[0]); F([[19, 85], [35, 85], [35, 89], [17, 89]], su[0], { rim: 0 }); F([[38, 85], [54, 85], [56, 89], [38, 89]], su[0], { rim: 0 });
    F([[20, 34], [52, 34], [57, 62], [15, 62]], su[2], { top: su[3] }); shadeSide([[20, 34], [52, 34], [57, 62], [15, 62]], su[1], 14);
    F([[30, 34], [42, 34], [36, 54]], hex('#e8e8fa'), { rim: 0 }); F([[34, 38], [38, 38], [39, 56], [36, 59], [33, 56]], K.mag, { rim: 0 });
    F([[12, 38], [20, 36], [22, 60], [13, 62]], su[2]); F([[3, 42], [20, 42], [20, 64], [3, 64]], hex('#d8dcec')); frameR(3, 42, 17, 22, K.mag); for (let y = 47; y < 62; y += 4) lineF(6, y, 17, y, hex('#6a7cc8'));
    F([[52, 36], [60, 38], [60, 62], [54, 60]], su[1]); F([[58, 62], [64, 14], [70, 16], [64, 64]], BLADE, { rim: 0 }); lineF(63, 18, 60, 60, WHITE); sglow(65, 34, 24, BLADE, .55);
    F([[24, 14], [48, 14], [53, 28], [44, 40], [28, 40], [19, 28]], st[2], { top: st[3] }); shadeSide([[24, 14], [48, 14], [53, 28], [44, 40], [28, 40], [19, 28]], st[1], 10);
    F([[22, 22], [50, 22], [50, 27], [22, 27]], hex('#0a0614'), { rim: 0 }); lineF(23, 24, 49, 24, K.mag); sglow(36, 25, 20, K.mag, .5); F([[31, 14], [36, 3], [41, 14]], st[1]);
  });
}
function spiderSprite() { // a wire-legged phone spider with a headset
  const bd = ramp(hex('#6a7aa8'));
  return offscreen(96, 56, () => {
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const bx = 48 + s * (8 + i * 4), by = 32 + i * 2, kx = 48 + s * (28 + i * 5), ky = 6 + (i === 1 || i === 2 ? 0 : 6) + i * 2, fx = 48 + s * (42 + i * 2), fy = 52;
      lineF(bx, by, kx, ky, K.cyan); lineF(kx, ky, fx, fy, s < 0 ? K.mag : K.cyan); ellF(kx, ky, 2, 2, WHITE); ellF(fx, fy, 1.5, 1.5, s < 0 ? K.mag : K.cyan); sglow(kx, ky, 8, K.cyan, .35); }
    F([[28, 34], [38, 24], [58, 24], [68, 34], [62, 46], [34, 46]], bd[2], { top: bd[3] }); shadeSide([[28, 34], [38, 24], [58, 24], [68, 34], [62, 46], [34, 46]], bd[1], 14);
    F([[38, 16], [58, 16], [62, 28], [34, 28]], bd[2], { top: bd[3] }); for (const [x, y] of [[43, 21], [53, 21], [41, 25], [55, 25]]) { ellF(x, y, 2, 2, hex('#ff3040')); sglow(x, y, 7, hex('#ff3040'), .6); }
    lineF(34, 14, 38, 6, K.cyan); lineF(38, 6, 48, 4, K.cyan); ellF(34, 22, 3, 4, hex('#0a0a1a')); lineF(34, 22, 34, 14, K.cyan);
    for (let i = 0; i < 6; i++) pset(36 + i * 5, 38 + (i & 1), K.cyan); lineF(48, 46, 44, 53, K.mag);
  });
}
function collectorSprite(prime) { // a shoulder-padded collector in shades, serving papers with a pen the size of a sword
  const su = ramp(hex(prime ? '#5a4a6c' : '#44446c')), sk = ramp(hex('#f0e8f8'));
  return offscreen(84, 112, () => {
    if (prime) { for (let i = 0; i < 7; i++) { const ax = 20 + i * 7, ay = 6 + (i % 3) * 3; F([[ax - 3, ay], [ax + 4, ay - 3], [ax + 6, ay + 8], [ax - 2, ay + 9]], hex('#f8f4ff'), { top: WHITE }); lineF(ax - 1, ay + 2, ax + 3, ay + 1, hex('#8aa0c8')); lineF(ax - 1, ay + 5, ax + 3, ay + 4, hex('#8aa0c8')); } }
    F([[28, 78], [40, 78], [39, 108], [26, 108]], su[1]); F([[44, 78], [56, 78], [58, 108], [45, 108]], su[0]); F([[24, 108], [40, 108], [40, 111], [22, 111]], su[0], { rim: 0 }); F([[44, 108], [60, 108], [62, 111], [44, 111]], su[0], { rim: 0 });
    F([[26, 42], [58, 42], [62, 78], [22, 78]], su[2], { top: su[3] }); shadeSide([[26, 42], [58, 42], [62, 78], [22, 78]], su[1], 16);
    F([[34, 42], [50, 42], [42, 66]], hex('#f4f4ff'), { rim: 0 }); F([[40, 48], [44, 48], [45, 74], [42, 78], [39, 74]], hex('#ff2449'), { rim: 0 });
    F([[4, 38], [30, 32], [32, 52], [8, 58]], su[2], { top: su[3] }); F([[80, 38], [54, 32], [52, 52], [76, 58]], su[1]); lineF(4, 38, 30, 32, K.mag, 2); lineF(80, 38, 54, 32, K.cyan, 2);
    F([[6, 56], [13, 54], [15, 84], [8, 86]], su[1]); F([[70, 54], [77, 56], [76, 86], [69, 84]], su[0]);
    F([[70, 84], [82, 24], [87, 26], [76, 86]], BLADE, { rim: 0 }); lineF(73, 82, 83, 28, WHITE); sglow(78, 52, 28, BLADE, .5);
    F([[28, 14], [56, 14], [58, 30], [48, 42], [36, 42], [26, 30]], sk[2], { top: WHITE }); shadeSide([[28, 14], [56, 14], [58, 30], [48, 42], [36, 42], [26, 30]], sk[1], 11);
    F([[26, 14], [42, 4], [58, 14], [56, 18], [28, 18]], hex('#f4f0ff'), { top: WHITE });
    F([[28, 24], [56, 24], [55, 32], [29, 32]], hex('#08061a'), { rim: 0 }); lineF(28, 24, 56, 24, K.cyan); lineF(31, 27, 40, 27, hex('#9ae8ff')); lineF(46, 27, 55, 27, hex('#9ae8ff')); sglow(42, 28, 18, K.cyan, .3);
    lineF(37, 38, 47, 38, hex('#3a2a4a'));
  });
}
function kidSprite() { // Pee Kid, small and a little worried
  const sk = ramp(hex('#f0c8a8')), hr = ramp(hex('#3a2a6a'));
  return offscreen(48, 64, () => {
    F([[15, 40], [22, 40], [22, 60], [14, 60]], sk[1]); F([[27, 40], [34, 40], [35, 60], [27, 60]], sk[0]); F([[12, 59], [23, 59], [23, 63], [11, 63]], hex('#1a1030'), { rim: 0 }); F([[26, 59], [37, 59], [38, 63], [26, 63]], hex('#1a1030'), { rim: 0 });
    F([[12, 34], [36, 34], [37, 44], [11, 44]], hex('#34486a'));
    F([[14, 22], [34, 22], [37, 40], [11, 40]], hex('#f0f0fa'), { top: WHITE }); F([[12, 18], [24, 30], [36, 18], [38, 26], [10, 26]], hex('#34486a')); F([[22, 26], [27, 26], [26, 36], [23, 36]], hex('#8c5e30'), { rim: 0 });
    F([[8, 22], [13, 22], [13, 38], [8, 38]], sk[2]); F([[35, 22], [40, 22], [40, 38], [35, 38]], sk[1]);
    { const H = [[14, 6], [34, 6], [37, 14], [35, 22], [30, 26], [24, 28], [18, 26], [13, 22], [11, 14]]; F(H, sk[2], { top: sk[3] }); shadeSide(H, sk[1], 7); }
    F([[10, 16], [12, 4], [24, 0], [36, 4], [38, 16], [34, 11], [24, 12], [14, 11]], hr[2], { top: hr[3] }); shadeSide([[10, 16], [12, 4], [24, 0], [36, 4], [38, 16]], hr[1], 8);
    ellF(19, 16, 2.4, 3, hex('#1c1030')); ellF(29, 16, 2.4, 3, hex('#1c1030')); pset(18, 14, WHITE); pset(28, 14, WHITE); lineF(22, 22, 26, 22, hex('#8c4a3a'));
  });
}
const NPC_SPR = {}; const npcSprite = id => NPC_SPR[id] || (NPC_SPR[id] = kidSprite());
function npcEnts(g) { return (g.lv.npcs || []).map(n => ({ x: n.x, y: n.y, spr: npcSprite(n.id), size: .55, dx: 0, dz: 0, lift: 0 })); }
const flashCache = new Map();
function flashBuf(b) { let f = flashCache.get(b); if (!f) { f = { w: b.w, h: b.h, d: b.d.map(c => c ? mix(c, WHITE, .75) : 0) }; flashCache.set(b, f); } return f; }
function derezBuf(b, p) { // rows peel off, tinted cyan at the edge of the dissolve
  const o = { w: b.w, h: b.h, d: new Uint32Array(b.w * b.h) };
  for (let j = 0; j < b.h; j++) { const row = hash(j, 11) * .45 + (1 - j / b.h) * .55, a = p * 1.25 - row; if (a > .2) continue;
    for (let i = 0; i < b.w; i++) { const c = b.d[j * b.w + i]; if (!c) continue; if (a > 0 && (hash(i, j, 3) < a * 4)) continue; o.d[j * b.w + i] = a > -.15 ? mix(c, K.cyan, .6) : c; } }
  return o;
}
function managerSprite() { // a hooded middle manager floating in a halo of meeting windows
  const rb = ramp(hex('#4a3a8a'));
  return offscreen(72, 100, () => {
    F([[24, 36], [48, 36], [58, 98], [14, 98]], rb[1], { top: rb[3] }); shadeSide([[24, 36], [48, 36], [58, 98], [14, 98]], rb[0], 16); for (const x of [22, 30, 38, 46]) lineF(x, 60, x - 4 + (x - 36) / 3, 96, rb[2]);
    F([[16, 60], [26, 52], [30, 74], [20, 80]], rb[2]); F([[46, 52], [56, 60], [52, 80], [42, 74]], rb[1]); F([[28, 68], [44, 68], [44, 78], [28, 78]], hex('#0a0a1a')); frameR(28, 68, 17, 11, K.cyan); lineF(31, 72, 41, 72, K.cyan); lineF(31, 75, 38, 75, hex('#6a8aff'));
    F([[26, 12], [36, 4], [46, 12], [50, 36], [22, 36]], rb[2], { top: rb[3] }); F([[28, 18], [44, 18], [44, 34], [28, 34]], hex('#06060e'), { rim: 0 }); lineF(28, 18, 44, 18, K.mag); lineF(44, 18, 44, 34, K.cyan);
    ellF(33, 26, 2, 1.6, hex('#80f0ff')); ellF(40, 26, 2, 1.6, hex('#80f0ff')); sglow(36, 26, 14, K.cyan, .4);
    for (let i = 0; i < 5; i++) { const a = -2.6 + i * .65, wx = 36 + Math.cos(a) * 30, wy = 16 + Math.sin(a) * 15; F([[wx - 5, wy - 4], [wx + 5, wy - 4], [wx + 5, wy + 3], [wx - 5, wy + 3]], hex('#0e1030'), { rim: 0 }); frameR(wx - 5, wy - 4, 11, 8, i & 1 ? K.mag : K.cyan); lineF(wx - 3, wy - 1, wx + 3, wy - 1, hex('#8aa0ff')); }
  });
}
function beholdenSprite() { // an enormous eye in a ring of ten stalks, each one something owed
  return offscreen(132, 124, () => {
    for (let i = 0; i < 10; i++) { const a = -Math.PI + (i + .5) * Math.PI * 2 / 10 * .98, ex = 66 + Math.cos(a) * 58, ey = 64 + Math.sin(a) * 46, c = i & 1 ? K.cyan : K.mag; lineF(66 + Math.cos(a) * 28, 66 + Math.sin(a) * 22, ex, ey, c, 2); lineF(66 + Math.cos(a) * 28, 66 + Math.sin(a) * 22, ex, ey, mix(c, WHITE, .4), 1); ellF(ex, ey, 6, 6, hex('#10081c')); ellF(ex, ey, 4, 4, mix(c, hex('#ff3050'), .35)); ellF(ex, ey, 1.6, 2.4, BLACK); pset(ex - 2, ey - 2, WHITE); sglow(ex, ey, 14, c, .5); }
    F([[20, 66], [34, 40], [66, 30], [98, 40], [112, 66], [98, 92], [66, 102], [34, 92]], hex('#14102a'));
    F([[26, 66], [38, 46], [66, 38], [94, 46], [106, 66], [94, 86], [66, 94], [38, 86]], hex('#f2e8ff'), { top: WHITE }); shadeSide([[26, 66], [38, 46], [66, 38], [94, 46], [106, 66], [94, 86], [66, 94], [38, 86]], hex('#a08ac8'), 16);
    ellF(66, 66, 24, 24, hex('#ff3050')); ellF(66, 66, 24, 24, hex('#c01838')); ellF(62, 62, 20, 20, hex('#ff3050')); F([[60, 44], [72, 44], [76, 66], [72, 88], [60, 88], [56, 66]], BLACK, { rim: 0 }); pset(58, 54, WHITE); pset(59, 54, WHITE); pset(58, 55, WHITE);
    F([[16, 66], [34, 36], [66, 24], [98, 36], [116, 66], [98, 46], [66, 36], [34, 46]], hex('#2a1450'), { top: hex('#6a4ac0') }); F([[22, 70], [40, 94], [66, 104], [92, 94], [110, 70], [92, 90], [66, 98], [40, 90]], hex('#1a0c38'));
    sglow(66, 66, 40, hex('#ff3050'), .4); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; pset(66 + Math.cos(a) * 34, 66 + Math.sin(a) * 30, i & 1 ? K.mag : K.cyan); }
  });
}
function monSprite(t) { return MSPR[t] || (MSPR[t] = t === 'INTERN' ? internSprite() : t === 'COLLECTOR' ? collectorSprite() : t === 'MANAGER' ? managerSprite() : t === 'PRIME' ? collectorSprite(1) : t === 'BEHOLDEN' ? beholdenSprite() : spiderSprite()); }
function losClear(lv, x1, y1, x2, y2) { if (x1 !== x2 && y1 !== y2) return false; const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1); for (let x = x1 + dx, y = y1 + dy; x !== x2 || y !== y2; x += dx, y += dy) if (!walkable(lv, x, y)) return false; return true; }

// ---------- distance map from the party (BFS), so monsters path around walls ----------
function walkable(lv, x, y) { const ch = cellCh(lv, x, y); if (BLOCKS.indexOf(ch) >= 0 || ch === 'P') return false; if (ch === 'D') return lv.st.door[x + ',' + y].open > .5; return true; }
function distMap(lv, px, py) {
  const key = px + ',' + py + '|' + Object.values(lv.st.door).map(d => d.open > .5 ? 1 : 0).join(''); if (lv._dk === key) return lv._dm;
  const dm = new Int16Array(lv.w * lv.h).fill(-1), q = [[px, py]]; dm[py * lv.w + px] = 0;
  for (let i = 0; i < q.length; i++) { const [x, y] = q[i], d = dm[y * lv.w + x]; if (d >= 14) continue;
    for (let k = 0; k < 4; k++) { const nx = x + DX[k], ny = y + DY[k]; if (nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h || dm[ny * lv.w + nx] >= 0 || !walkable(lv, nx, ny)) continue; dm[ny * lv.w + nx] = d + 1; q.push([nx, ny]); } }
  lv._dk = key; lv._dm = dm; return dm;
}
const liveMobs = lv => (lv.mobs || []).filter(m => m.hp > 0 && !m.dying);
const mobAt = (lv, x, y) => liveMobs(lv).find(m => m.x === x && m.y === y);

// ---------- floating numbers and shots ----------
const FX = [];
const fxNum = (x, y, s, c) => FX.push({ k: 'num', x, y, s: String(s), c, t: 36 });
const fxBeam = (x1, y1, x2, y2, c) => FX.push({ k: 'beam', x1, y1, x2, y2, c, t: 7 });

// ---------- monsters act ----------
function updateMobs(g) {
  const lv = g.lv, dm = distMap(lv, g.x, g.y);
  for (const m of lv.mobs || []) {
    if (m.dying) { if (--m.dying <= 0) m.gone = 1; continue; }
    if (m.hp <= 0) continue; const D = MON[m.t];
    if (m.flash > 0) m.flash--; if (m.lunge > 0) m.lunge--;
    if (m.stun > 0) { m.stun--; continue; } if (m.fear > 0) { m.fear--; continue; }
    if (Math.abs(m.ox) > .001 || Math.abs(m.oy) > .001) { m.ox *= .82; m.oy *= .82; }
    const d = dm[m.y * lv.w + m.x];
    if (!m.awake) {
      if (m.path) { // patrolling: walk the route, wake when you are seen
        if (--m.mcd <= 0) { m.mcd = D.mv; const [tx, ty] = m.path[m.pi % m.path.length]; if (m.x === tx && m.y === ty) m.pi = (m.pi + 1) % m.path.length; else { const sx = Math.sign(tx - m.x), sy = m.x === tx ? Math.sign(ty - m.y) : 0, nx = m.x + (sy ? 0 : sx), ny = m.y + sy; if (walkable(lv, nx, ny) && !mobAt(lv, nx, ny) && !(nx === g.x && ny === g.y)) { m.ox = m.x - nx; m.oy = m.y - ny; m.x = nx; m.y = ny; } else m.pi = (m.pi + 1) % m.path.length; } }
        if ((d >= 0 && d <= 2) || (losClear(lv, m.x, m.y, g.x, g.y) && Math.abs(m.x - g.x) + Math.abs(m.y - g.y) <= D.aggro)) { m.awake = 1; msg('A ' + D.name + ' NOTICES YOU.', hex('#ffb040')); sfx('alert'); } continue; }
      if (!m.wakeOnly && d >= 0 && d <= D.aggro) { m.awake = 1; } else continue; }
    if (D.summon && !m.summoned && m.hp <= m.max / 2) { m.summoned = 1; summonHelp(m, g); }
    if (D.rays) { if ((m.rcd = (m.rcd === undefined ? 90 : m.rcd) - 1) <= 0) { m.rcd = (m.hp < m.max / 2 ? 62 : 96) + cint(-10, 10); m.lunge = 8; fireRay(m, g); } }
    const dist = Math.abs(m.x - g.x) + Math.abs(m.y - g.y), adj = dist === 1, inReach = !adj && D.reach && dist <= D.reach && losClear(lv, m.x, m.y, g.x, g.y);
    if (adj || inReach) { if (--m.acd <= 0) { m.acd = D.atk + cint(-8, 8); m.lunge = 10; mobAttack(m, g); } continue; }
    if (d < 0 || D.still) continue;
    if (--m.mcd <= 0) { m.mcd = D.mv + cint(-4, 4);
      const opts = []; for (let k = 0; k < 4; k++) { const nx = m.x + DX[k], ny = m.y + DY[k]; if (nx < 0 || ny < 0 || nx >= lv.w || ny >= lv.h) continue; const nd = dm[ny * lv.w + nx]; if (nd >= 0 && nd < d && !(nx === g.x && ny === g.y) && !mobAt(lv, nx, ny)) opts.push([nx, ny]); }
      if (opts.length) { const [nx, ny] = opts[cint(0, opts.length - 1)]; m.ox = m.x - nx; m.oy = m.y - ny; m.x = nx; m.y = ny; } }
  }
  lv.mobs = lv.mobs.filter(m => !m.gone);
}
// The Beholden has one stalk for everything that is owed. Each ray is named for a debt and does something different.
const RAYS = [['UNPAID RENT', 'dmg', [9, 15]], ['UNPAID PHONE CALL', 'hold'], ['UNPAID APOLOGY', 'poison'], ['UNPAID TAB', 'drain'], ['UNPAID PARKING TICKET', 'dmg', [6, 12]], ['UNPAID INTEREST', 'dmg', [5, 11]], ['UNPAID FAVOR', 'hold'], ['UNPAID DEPOSIT', 'dmg', [8, 14]], ['UNPAID THANK-YOU', 'drain'], ['UNPAID TAXES', 'dmg', [11, 17]]];
function fireRay(m, g) {
  const alive = PARTY.filter(c => !c.dead); if (!alive.length) return; const [name, kind, r] = RAYS[(m.ri = ((m.ri || 0) + 1)) % RAYS.length], c = alive[cint(0, alive.length - 1)];
  FX.push({ k: 'beam', x1: m.sx || 130, y1: m.sy || 60, x2: DV.x + DV.w / 2, y2: DV.y + DV.h, c: kind === 'dmg' ? hex('#ff3050') : kind === 'hold' ? hex('#ffb040') : kind === 'poison' ? hex('#9aff40') : hex('#80e8ff'), t: 10 }); sfx('zap'); post.flash = .25; shake(2, 10);
  if (kind === 'dmg') { const d = Math.max(1, cint(r[0], r[1]) - (acOf(c) >> 1)); c.hp -= d; c.hurt = 10; msg(name + ' HITS ' + c.name + ' FOR ' + d + '.', hex('#ff6a7a')); if (c.hp <= 0) { c.hp = 0; c.dead = 1; msg(c.name + ' IS DOWN.', hex('#ff3050')); sfx('derez'); checkWipe(); } }
  else if (kind === 'hold') { c.hold = 260; msg(name + ' HOLDS ' + c.name + '.', hex('#ffb040')); }
  else if (kind === 'poison') { c.poison = 600; msg(name + ' POISONS ' + c.name + '.', hex('#9aff40')); }
  else { if (c.sp > 0) { c.sp = Math.max(0, c.sp - 3); msg(name + ' DRAINS ' + c.name + '.', hex('#80e8ff')); } else { c.hp -= 4; c.hurt = 8; msg(name + ' DRAINS ' + c.name + '. THERE WAS NOTHING TO DRAIN.', hex('#80e8ff')); if (c.hp <= 0) { c.hp = 0; c.dead = 1; checkWipe(); } } }
}
function summonHelp(m, g) {
  const D = MON[m.t], lv = g.lv, spots = []; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const x = m.x + dx, y = m.y + dy; if ((dx || dy) && walkable(lv, x, y) && !mobAt(lv, x, y) && !(x === g.x && y === g.y)) spots.push([x, y]); }
  msg(D.name + ' CALLS FOR REINFORCEMENTS!', hex('#ffb040')); sfx('alert'); post.flash = .3;
  for (const t of D.summon) { if (!spots.length) break; const [x, y] = spots.splice(cint(0, spots.length - 1), 1)[0], s = mkMob(t, x, y); s.awake = 1; lv.mobs.push(s); }
}
function mobAttack(m, g) {
  const D = MON[m.t], alive = PARTY.filter(c => !c.dead); if (!alive.length) return;
  const front = alive.filter(c => PARTY.indexOf(c) < 2), pool = front.length && crand() < .75 ? front : alive, c = pool[cint(0, pool.length - 1)];
  const roll = cint(1, 20) + D.hit, need = 10 + acOf(c);
  if (roll < need) { msg(D.name + ' MISSES ' + c.name + '.', hex('#8a96d8')); sfx('swing'); return; }
  const dmg = cint(D.dmg[0], D.dmg[1]); c.hp -= dmg; c.hurt = 10; shake(2, 8); sfx('mhit'); msg(D.name + ' HITS ' + c.name + ' FOR ' + dmg + '.', hex('#ff6a7a'));
  if (c.hp > 0 && D.poison && crand() < D.poison && !c.poison) { c.poison = 540; msg(c.name + ' IS POISONED.', hex('#9aff40')); }
  if (c.hp > 0 && D.hold && crand() < D.hold && !c.hold) { c.hold = 300; msg(c.name + ' IS HELD IN A MEETING.', hex('#ffb040')); }
  if (c.hp <= 0) { c.hp = 0; c.dead = 1; msg(c.name + ' IS DOWN.', hex('#ff3050')); sfx('derez'); checkWipe(); }
}
function checkWipe() { if (PARTY.every(c => c.dead) && GM && !GM.over) { GM.over = 1; run(gameOver); } }
async function gameOver() {
  music(null); sfx('powerdown'); await wait(40);
  await showCard(['THE PARTY HAS FALLEN.', '', 'THE TEMPLE KEEPS COUNT.', '', 'CONTINUE?  (Z = YES)'], 0, { fg: hex('#ff4060') });
  for (const c of PARTY) { c.dead = 0; c.hp = Math.max(1, c.max >> 1); }
  const lv = GM.lv; GM.x = lv.start[0]; GM.y = lv.start[1]; GM.dir = lv.start[2]; GM.over = 0; msg('THE PARTY WAKES AT THE DOOR.');
}

// ---------- the party acts ----------
const atkBonus = c => c.lvl + ({ FIGHTER: 3, RANGER: 2, ROGUE: 2, CLERIC: 1, MAGE: 0 })[c.cls];
function handItem(c, h) { return c.hands[h] ? ITEMS[c.hands[h]] : (h === 0 ? ITEMS.FISTS : null); }
function targetFor(g, ci, item) {
  const lv = g.lv; if (!item.ranged) { if (ci > 1) return null; return mobAt(lv, g.x + DX[g.dir], g.y + DY[g.dir]) || null; }
  for (let d = 1; d <= RANGE; d++) { const x = g.x + DX[g.dir] * d, y = g.y + DY[g.dir] * d; if (isBlock(lv, x, y) || (cellCh(lv, x, y) === 'D' && lv.st.door[x + ',' + y].open < .5)) return null; const m = mobAt(lv, x, y); if (m) return m; }
  return null;
}
function attack(ci, h) {
  const g = GM, c = PARTY[ci]; if (!g || !c || c.dead || g.over) return false;
  const item = handItem(c, h); if (!item || c.cool[h] > 0 || c.hold > 0) return false;
  const m = targetFor(g, ci, item);
  if (!m) { if (ci > 1 && !item.ranged) msg(c.name + ' CANNOT REACH FROM THE BACK RANK.', hex('#8a96d8')); return false; }
  c.cool[h] = c.cmax[h] = Math.round(item.cd * (g.haste > 0 ? .6 : 1)); sfx(item.ranged ? 'zap' : 'swing');
  if (item.ranged) fxBeam(DV.x + DV.w / 2 + (ci % 2 ? 24 : -24), DV.y + DV.h, m.sx || DV.x + DV.w / 2, m.sy || DV.y + 80, hex(item.col));
  const D = MON[m.t], roll = cint(1, 20) + atkBonus(c);
  if (roll < 8 + D.ac) { msg(c.name + ' MISSES.', hex('#8a96d8')); fxNum(m.sx || 130, (m.sy || 80) - 6, 'MISS', hex('#8a96d8')); return true; }
  const dmg = cint(item.dmg[0], item.dmg[1]) + (c.cls === 'FIGHTER' ? 2 : 0) + (c.lvl >> 1);
  m.hp -= dmg; m.flash = 4; sfx('hit'); msg(c.name + ' HITS ' + D.name + ' FOR ' + dmg + '.', hex('#7affb0')); fxNum(m.sx || 130, (m.sy || 80) - 6, dmg, hex('#ffe040'));
  if (m.hp <= 0) killMob(m);
  return true;
}
function killMob(m) { const D = MON[m.t]; m.hp = 0; m.dying = D.boss ? 60 : 26; sfx('derez'); msg(D.name + ' DEREZZES.', hex('#80e8ff')); gainXP(D.xp); if (D.boss) { post.flash = .8; shake(3, 30); } if (m.die && GM) fireTrig(GM, m.die, 'die' + m.t + m.x + m.y); }
function gainXP(n) {
  const alive = PARTY.filter(c => !c.dead), each = Math.max(1, Math.round(n / (alive.length || 1)));
  for (const c of alive) { c.xp += each; while (c.lvl < 8 && c.xp >= 60 * c.lvl) { c.xp -= 60 * c.lvl; c.lvl++; const up = CLASSES[c.cls].hp + cint(0, 2); c.max += up; c.hp = Math.min(c.max, c.hp + up); const sm = spMaxOf(c); c.sp = Math.min(sm, c.sp + (sm - c.spMax)); c.spMax = sm; msg(c.name + ' REACHES LEVEL ' + c.lvl + '!', hex('#ffe040')); sfx('get'); } }
}
function updateCombat(g) {
  for (const c of PARTY) for (let h = 0; h < 2; h++) if (c.cool[h] > 0) c.cool[h]--;
  updateMobs(g); tickStatus(g);
  for (let i = FX.length - 1; i >= 0; i--) { const f = FX[i]; f.t--; if (f.k === 'num') f.y -= .4; if (f.t <= 0) FX.splice(i, 1); }
}
// entities for the renderer
function mobEnts(g) {
  const lv = g.lv, fx = DX[g.dir], fy = DY[g.dir], rx = DX[(g.dir + 1) & 3], ry = DY[(g.dir + 1) & 3], out = [];
  for (const m of lv.mobs || []) {
    const D = MON[m.t]; let spr = monSprite(m.t);
    if (m.dying) spr = derezBuf(spr, 1 - m.dying / 26); else if (m.flash > 0) spr = flashBuf(spr);
    out.push({ x: m.x, y: m.y, spr, size: D.size * (1 + (m.lunge > 0 ? .12 : 0)), dx: m.side * .12 + (m.ox * rx + m.oy * ry), dz: m.ox * fx + m.oy * fy, lift: m.t === 'SPIDER' ? 0 : Math.sin((frame + m.seed) * .09) * .012, m });
  }
  return out;
}
