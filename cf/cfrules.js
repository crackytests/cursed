'use strict';
// ================= CHROME FORCE -- rules (pure: no drawing, no input; the bot and the game share these) =================

function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const X = 99;
// movement cost per terrain code, per movement type
const COST = {
  foot: { '.': 1, 'c': 1, ',': 1, f: 2, h: 2, M: X, '~': X, '=': 1, r: 2, g: 1, _: 1, '#': X, w: X, s: 2, b: 1, o: 2, l: X, t: 2, '^': 1, d: 1, '*': 2 },
  cent: { '.': 1, 'c': 1, ',': 1, f: 3, h: 3, M: X, '~': X, '=': 1, r: 3, g: 1, _: 1, '#': X, w: X, s: 2, b: 1, o: 3, l: X, t: 3, '^': 1, d: 1, '*': 3 },
  heavy: { '.': 1, 'c': 1, ',': 1, f: 3, h: 3, M: X, '~': X, '=': 1, r: 3, g: 1, _: 1, '#': X, w: X, s: 3, b: 1, o: 3, l: X, t: 3, '^': 1, d: 1, '*': 3 },
  beast: { '.': 1, 'c': 1, ',': 1, f: 1, h: 2, M: X, '~': X, '=': 1, r: 2, g: 1, _: 1, '#': X, w: X, s: 1, b: 1, o: 2, l: X, t: 2, '^': 1, d: 1, '*': 2 },
  hover: { '.': 1, 'c': 1, ',': 1, f: 2, h: 2, M: X, '~': 1, '=': 1, r: 2, g: 1, _: 1, '#': X, w: X, s: 1, b: 1, o: 2, l: 1, t: 2, '^': 1, d: 1, '*': 2 },
  fly: { '.': 1, 'c': 1, ',': 1, f: 1, h: 1, M: 1, '~': 1, '=': 1, r: 1, g: 1, _: 1, '#': X, w: X, s: 1, b: 1, o: 1, l: 1, t: 1, '^': 1, d: 1, '*': 1 },
};
const LAND = { '.': 15, 'c': 15, ',': 15, f: 30, h: 30, M: 30, '~': 0, '=': 0, r: 20, g: 0, _: 0, s: 15, b: 0, o: 15, l: 0, t: 30, '^': 0, d: 0, '*': 30 };
const TNAME = { '.': 'WASTE', 'c': 'WASTE', ',': 'SCRUB', f: 'PYLONS', h: 'HILLS', M: 'CLIFF', '~': 'TOXIN', '=': 'ROAD', r: 'RUBBLE', g: 'GLASS', _: 'DECK', s: 'ASH', b: 'BRIDGE', o: 'BONES', l: 'EMBERS', t: 'RIBS', '^': 'GATE', d: 'DOOR', '*': 'CRYSTAL' };

const tileAt = (B, x, y) => (x < 0 || y < 0 || x >= B.w || y >= B.h) ? '#' : B.map[y][x];
const unitAt = (B, x, y) => B.units.find(u => u.hp > 0 && u.x === x && u.y === y);
const foesOf = (B, u) => B.units.filter(v => v.hp > 0 && v.side !== u.side);
const friendsOf = (B, u) => B.units.filter(v => v.hp > 0 && v.side === u.side);
const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const landOf = (B, u) => u.mt === 'fly' ? 0 : (LAND[tileAt(B, u.x, u.y)] || 0);
const moveCost = (mt, code) => (COST[mt] || COST.foot)[code] || X;

// ---------- derived stats ----------
const lvEq = u => u.lv + (CLS[u.cls] && CLS[u.cls].promoted ? 10 : 0) + (u.T ? 0 : 0);
function weaponOf(rec) { const it = rec.items.find(i => i.eq && ITEMS[i.id].k !== 'ring'); return it ? ITEMS[it.id] : null; }
function ringOf(rec) { const it = rec.items.find(i => i.eq && ITEMS[i.id].k === 'ring'); return it ? ITEMS[it.id] : null; }
function canEquip(rec, id) { const k = ITEMS[id].k; return k === 'ring' || k === CLS[rec.cls].wk; }
function effStats(rec) {
  const w = weaponOf(rec), r = ringOf(rec), c = CLS[rec.cls];
  const s = { atk: rec.atk + (w ? w.p : 0), def: rec.def, agi: rec.agi, mov: c.mov + (rec.movb || 0), wr: (w && w.r) || WRANGE[c.wk] };
  if (r) s[r.s] += r.p;
  return s;
}
function foeStats(id, T) {
  const f = FOES[id], m = f.m;
  return { mhp: Math.round((11 + 2.6 * T) * m[0]), atk: Math.round((5.5 + 2.1 * T) * m[1]), def: Math.round((3 + 1.4 * T) * m[2]), agi: Math.round((4 + 1.3 * T) * m[3]), mmp: f.sp ? Math.round((6 + 1.5 * T) * (f.boss ? 1.2 : 1)) : 0 };
}

// ---------- making battle units ----------
function allyUnit(rec, x, y) {
  const e = effStats(rec), c = CLS[rec.cls];
  return { side: 'ally', id: rec.id, rec, name: HEROES[rec.id].n, cls: rec.cls, lv: rec.lv, x, y, hp: rec.mhp, mhp: rec.mhp, mp: rec.mmp, mmp: rec.mmp,
    atk: e.atk, def: e.def, agi: e.agi, mov: e.mov, wr: e.wr, mt: c.mt, wk: c.wk, crit: c.crit || 0, regen: c.regen || 0, spells: Object.assign({}, rec.spells), st: {}, art: HEROES[rec.id].art };
}
function foeUnit(f, i) { // f = [type, x, y, T, ai, extra]
  const [id, x, y, T, ai, ex] = f, d = FOES[id], s = foeStats(id, T);
  const sp = {}; (d.sp || []).forEach(([k, l]) => sp[k] = l);
  return Object.assign({ side: 'foe', id: id + i, ft: id, name: d.n, lv: T, T, x, y, hx: x, hy: y, hp: s.mhp, mhp: s.mhp, mp: s.mmp, mmp: s.mmp, atk: s.atk, def: s.def, agi: s.agi,
    mov: d.mov, wr: d.r || WRANGE[d.wk], mt: d.mt, wk: d.wk, crit: d.boss ? 6 : 0, regen: d.regen ? Math.round(d.regen * (1 + T / 10)) : 0, spells: sp, st: {}, ai: ai || d.ai || 'aggro', boss: !!d.boss, art: d.art }, ex || {});
}

// ---------- status ----------
const effAgi = u => u.agi * (u.st.haste ? 1.4 : 1) * (u.st.slow ? .6 : 1);
const effDef = u => u.def * (u.st.boost ? 1.3 : 1) * (u.st.slow ? .85 : 1);
const effMov = u => Math.max(1, u.mov + (u.st.haste ? 1 : 0) - (u.st.slow ? 2 : 0));

// ---------- movement ----------
function reach(B, u, opts = {}) {
  const mv = opts.mov !== undefined ? opts.mov : effMov(u), best = {}, prev = {}, key = (x, y) => x + ',' + y, out = [];
  best[key(u.x, u.y)] = 0; const q = [[0, u.x, u.y]];
  while (q.length) {
    q.sort((a, b) => a[0] - b[0]); const [c, x, y] = q.shift();
    if (c > best[key(x, y)]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, nc = c + moveCost(u.mt, tileAt(B, nx, ny));
      if (nc > mv) continue;
      const o = unitAt(B, nx, ny); if (o && o.side !== u.side) continue; // can pass friends, never foes
      const k = key(nx, ny); if (best[k] !== undefined && best[k] <= nc) continue;
      best[k] = nc; prev[k] = key(x, y); q.push([nc, nx, ny]);
    }
  }
  for (const k in best) { const [x, y] = k.split(',').map(Number); const o = unitAt(B, x, y); if (!o || o === u) out.push({ x, y, c: best[k] }); }
  return { tiles: out, all: Object.keys(best), prev, has: (x, y) => out.some(t => t.x === x && t.y === y), path(x, y) { const p = []; let k = key(x, y); while (k) { p.unshift(k.split(',').map(Number)); k = prev[k]; } return p; } };
}
function inRange(a, b, r, ax = a.x, ay = a.y) { const d = Math.abs(ax - b.x) + Math.abs(ay - b.y); return d >= r[0] && d <= r[1]; }
function areaTiles(x, y, rad) { const o = []; for (let j = -rad; j <= rad; j++) for (let i = -rad; i <= rad; i++) if (Math.abs(i) + Math.abs(j) <= rad) o.push([x + i, y + j]); return o; }

// ---------- combat ----------
function hitChance(B, a, d) { if (d.st.sleep) return 100; const c = 96 - Math.max(0, (effAgi(d) - effAgi(a)) / 3) - landOf(B, d) / 5; return Math.max(70, Math.min(98, c)); }
function strike(B, a, d, rng) {
  if (rng() * 100 >= hitChance(B, a, d)) return { miss: 1, dmg: 0 };
  const base = Math.max(1, a.atk - effDef(d)), le = landOf(B, d);
  let dmg = Math.max(1, Math.round(base * (.9 + rng() * .2) * (1 - le / 100)));
  const critC = Math.max(2, Math.min(30, 4 + a.crit + (effAgi(a) - effAgi(d)) / 4)), crit = rng() * 100 < critC;
  if (crit) dmg = Math.round(dmg * 1.5) + 1;
  return { dmg: Math.min(dmg, d.hp), crit: crit ? 1 : 0 };
}
function expFor(a, d, dmg, kill) {
  if (a.side !== 'ally') return 0;
  const f = Math.max(.15, Math.min(2, 1 + ((d.T || lvEq(d)) - lvEq(a)) * .15));
  return Math.max(1, Math.min(49, Math.round(kill ? 48 * f : dmg / d.mhp * 32 * f)));
}
// full exchange: attack, maybe a second attack, maybe a counter. Applies damage. Returns a record for the cut-in.
function doAttack(B, a, d, rng) {
  const R = { kind: 'attack', a: a.id, d: d.id, seq: [], exp: {} }; R.pre = { [a.id]: a.hp, [d.id]: d.hp };
  const one = (x, y, tag) => { const s = strike(B, x, y, rng); y.hp -= s.dmg; if (s.dmg && y.st.sleep) delete y.st.sleep; if (s.dmg) y.alerted = 1; R.seq.push(Object.assign({ by: x.id, to: y.id, tag, hp: y.hp }, s));
    const ex = expFor(x, y, s.dmg, y.hp <= 0); if (ex) R.exp[x.id] = Math.min(49, (R.exp[x.id] || 0) + ex); if (y.hp <= 0) { y.hp = 0; R.seq[R.seq.length - 1].kill = 1; } return s; };
  one(a, d, 'hit');
  if (d.hp > 0 && rng() * 100 < Math.max(2, Math.min(20, 6 + (effAgi(a) - effAgi(d)) / 5))) one(a, d, 'double');
  if (d.hp > 0 && !d.st.sleep && inRange(d, a, d.wr) && rng() < .12) one(d, a, 'counter');
  return R;
}
function spellInfo(id, lv) { const s = SPELLS[id], L = s.lv[Math.min(lv, s.lv.length) - 1]; return { id, lv, kind: s.kind, mp: L[0], r: L[1], area: L[2], pow: L[3], st: s.st, el: s.el, n: s.n }; }
function spellTargets(B, u, sp, tx, ty) {
  const hostile = sp.kind === 'dmg' || sp.kind === 'debuff' || sp.kind === 'kill';
  return areaTiles(tx, ty, sp.area).map(([x, y]) => unitAt(B, x, y)).filter(v => v && (hostile ? v.side !== u.side : v.side === u.side));
}
function doSpell(B, u, sp, tx, ty, rng) {
  u.mp -= sp.mp;
  const R = { kind: 'spell', a: u.id, sp, seq: [], exp: {} }, ts = spellTargets(B, u, sp, tx, ty);
  R.pre = { [u.id]: u.hp }; ts.forEach(t => R.pre[t.id] = t.hp);
  let ex = 0;
  for (const t of ts) {
    if (sp.kind === 'dmg') {
      let dmg = Math.round(sp.pow * (.9 + rng() * .2) * (1 - landOf(B, t) / 200) * (t.boss ? .85 : 1) * (u.side === 'foe' ? .8 : 1 + lvEq(u) * .02));
      dmg = Math.max(1, Math.min(dmg, t.hp)); t.hp -= dmg; t.alerted = 1; if (t.st.sleep) delete t.st.sleep;
      const kill = t.hp <= 0; if (kill) t.hp = 0; R.seq.push({ to: t.id, dmg, kill: kill ? 1 : 0, hp: t.hp }); ex += expFor(u, t, dmg, kill);
    } else if (sp.kind === 'heal') {
      const h = Math.min(t.mhp - t.hp, sp.pow + ((rng() * 3) | 0)); t.hp += h; R.seq.push({ to: t.id, heal: h, hp: t.hp }); ex += u.side === 'ally' ? Math.min(24, 4 + h) : 0;
    } else if (sp.kind === 'cure') { const had = !!(t.st.poison || t.st.sleep || t.st.slow); delete t.st.poison; delete t.st.sleep; delete t.st.slow; R.seq.push({ to: t.id, cure: 1 }); ex += had && u.side === 'ally' ? 8 : 0; }
    else if (sp.kind === 'buff') { t.st[sp.st] = 3; R.seq.push({ to: t.id, st: sp.st }); ex += u.side === 'ally' ? 6 : 0; }
    else if (sp.kind === 'debuff') { const ok = !t.boss && rng() < (sp.st === 'sleep' ? .55 : .7); if (ok) t.st[sp.st] = sp.st === 'sleep' ? 2 : 3; t.alerted = 1; R.seq.push({ to: t.id, st: sp.st, miss: ok ? 0 : 1 }); ex += ok && u.side === 'ally' ? 8 : 0; }
    else if (sp.kind === 'kill') { const ok = !t.boss && rng() < .25; if (ok) t.hp = 0; R.seq.push({ to: t.id, kill: ok ? 1 : 0, miss: ok ? 0 : 1, dmg: 0, hp: t.hp }); ex += ok ? expFor(u, t, 0, 1) : 0; }
  }
  if (u.side === 'ally') R.exp[u.id] = Math.max(1, Math.min(49, Math.round(ex)) || 1);
  return R;
}

// ---------- growth ----------
function gainExp(rec, n, rng) { // returns list of level-up reports
  const ups = []; rec.exp += n;
  while (rec.exp >= 100 && rec.lv < 40) { rec.exp -= 100; ups.push(levelUp(rec, rng)); }
  return ups;
}
function levelUp(rec, rng) {
  const g = CLS[rec.cls].g, keys = ['mhp', 'mmp', 'atk', 'def', 'agi'], gain = {};
  rec.lv++;
  keys.forEach((k, i) => { const v = Math.floor(g[i] + rng()); if (v > 0) { rec[k] += v; gain[k] = v; } });
  const learned = learnSpells(rec);
  return { lv: rec.lv, gain, learned };
}
function learnSpells(rec) {
  const out = []; rec.spells = rec.spells || {};
  for (const [lv, id, sl] of (CLS[rec.cls].learn || [])) if (rec.lv >= lv && (rec.spells[id] || 0) < sl) { rec.spells[id] = sl; out.push(id + ' ' + sl); }
  return out;
}
function canPromote(rec) { return !!CLS[rec.cls].pro && rec.lv >= 10; }
function promote(rec) {
  rec.cls = CLS[rec.cls].pro; rec.lv = 1; rec.exp = 0;
  rec.mhp += 6; rec.atk += 3; rec.def += 3; rec.agi += 2; if (rec.mmp) rec.mmp += 5;
  learnSpells(rec);
}
function newRecord(id) {
  const h = HEROES[id], [mhp, mmp, atk, def, agi] = h.st;
  const r = { id, cls: h.cls, lv: h.lv, exp: 0, mhp, mmp, atk, def, agi, items: [], spells: {}, dead: 0 };
  h.items.forEach((it, i) => r.items.push({ id: it, eq: i === 0 && ITEMS[it].k !== 'use' ? 1 : 0 }));
  learnSpells(r);
  return r;
}

// ---------- turn order ----------
function roundOrder(B, rng) { return B.units.filter(u => u.hp > 0).map(u => [u, effAgi(u) * (.875 + rng() * .25)]).sort((a, b) => b[1] - a[1]).map(p => p[0].id); }
function startTurn(B, u) { // regen/poison/status countdown; returns events
  const ev = [];
  if (u.regen && u.hp < u.mhp) { const h = Math.min(u.regen, u.mhp - u.hp); u.hp += h; ev.push({ regen: h }); }
  if (u.st.poison) { const d = Math.min(u.hp - 1, Math.max(1, Math.round(u.mhp * .06))); if (d > 0) { u.hp -= d; ev.push({ poison: d }); } }
  for (const k of ['haste', 'boost', 'slow', 'poison']) if (u.st[k] && --u.st[k] <= 0) delete u.st[k];
  if (u.st.sleep) { if (--u.st.sleep <= 0) { delete u.st.sleep; ev.push({ woke: 1 }); } else ev.push({ asleep: 1 }); }
  return ev;
}
function battleOver(B) {
  const dax = B.units.find(u => u.id === 'dax');
  if (dax && dax.hp <= 0) return 'lose';
  if (B.units.some(u => u.boss && u.hp <= 0 && u.winOnKill !== false) && B.bossWin) return 'win';
  if (!B.units.some(u => u.side === 'foe' && u.hp > 0)) return 'win';
  return null;
}

// ---------- AI ----------
function distField(B, u, targets) { // movement-cost distance to the nearest target, ignoring units
  const D = new Float32Array(B.w * B.h).fill(1e9), q = [];
  for (const t of targets) for (const [x, y] of areaTiles(t.x, t.y, 1)) if (x >= 0 && y >= 0 && x < B.w && y < B.h && moveCost(u.mt, tileAt(B, x, y)) < X) { D[y * B.w + x] = 0; q.push([0, x, y]); }
  while (q.length) { q.sort((a, b) => a[0] - b[0]); const [c, x, y] = q.shift(); if (c > D[y * B.w + x]) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= B.w || ny >= B.h) continue; const nc = c + moveCost(u.mt, tileAt(B, nx, ny)); if (nc >= X || nc >= D[ny * B.w + nx]) continue; D[ny * B.w + nx] = nc; q.push([nc, nx, ny]); } }
  return D;
}
function threatMap(B, side) {
  const M = new Int8Array(B.w * B.h);
  for (const f of B.units) { if (f.hp <= 0 || f.side === side || f.st.sleep || (f.ai === 'hold' && !f.alerted) || f.ai === 'turret' && false) continue;
    const r = f.mov === 0 ? { tiles: [{ x: f.x, y: f.y }] } : reach(B, f), rng = Math.max(f.wr[1], ...Object.keys(f.spells || {}).map(k => SPELLS[k].kind === 'dmg' ? spellInfo(k, f.spells[k]).r : 0)), mark = new Uint8Array(B.w * B.h);
    for (const t of r.tiles) for (let dy = -rng; dy <= rng; dy++) for (let dx = -rng; dx <= rng; dx++) { const x = t.x + dx, y = t.y + dy; if (Math.abs(dx) + Math.abs(dy) > rng || x < 0 || y < 0 || x >= B.w || y >= B.h) continue; mark[y * B.w + x] = 1; }
    for (let i = 0; i < M.length; i++) M[i] += mark[i]; }
  return M;
}
function expDmgKill(B, u, plan) { const f = B.units.find(v => v.id === plan.act.target); if (!f) return false; const ox = u.x, oy = u.y; u.x = plan.x; u.y = plan.y; const e = expDmg(B, u, f); u.x = ox; u.y = oy; return e >= f.hp; }
function expDmg(B, a, d) { return Math.max(1, a.atk - effDef(d)) * (1 - landOf(B, d) / 100) * hitChance(B, a, d) / 100; }
function planAI(B, u, opts = {}) {
  if (u.st.sleep) return null;
  const foes = foesOf(B, u), mates = friendsOf(B, u);
  if (!foes.length) return null;
  if ((u.ai === 'hold' || u.ai === 'boss') && !u.alerted) {
    const trig = u.trig || (effMov(u) + u.wr[1] + 2);
    if (foes.some(f => dist(f, u) <= trig)) u.alerted = 1;
  }
  const still = (u.ai === 'hold' && !u.alerted) || u.mov === 0 || u.ai === 'turret';
  let R = still ? { tiles: [{ x: u.x, y: u.y, c: 0 }], has: (x, y) => x === u.x && y === u.y, path: () => [[u.x, u.y]] } : reach(B, u);
  if (u.ai === 'boss' && !still) { const leash = u.leash !== undefined ? u.leash : 2, hx = u.hx !== undefined ? u.hx : u.x, hy = u.hy !== undefined ? u.hy : u.y; R.tiles = R.tiles.filter(t => Math.abs(t.x - hx) + Math.abs(t.y - hy) <= leash); }
  const TH = opts.cautious ? threatMap(B, u.side) : null, thr = (x, y) => TH ? Math.max(0, TH[y * B.w + x] - 1) * (u.hp < u.mhp * .7 ? 7 : 4) : 0;
  let best = null;
  const consider = (score, plan) => { if (score > 0 && (!best || score > best.score)) best = Object.assign({ score }, plan); };
  const ox = u.x, oy = u.y;
  for (const t of R.tiles) {
    const le = u.mt === 'fly' ? 0 : (LAND[tileAt(B, t.x, t.y)] || 0), stay = (t.x === ox && t.y === oy) ? .5 : 0;
    // weapon
    for (const f of foes) if (inRange({ x: t.x, y: t.y }, f, u.wr)) {
      u.x = t.x; u.y = t.y; const e = expDmg(B, u, f); u.x = ox; u.y = oy;
      const kill = e >= f.hp ? 40 : 0, back = inRange(f, { x: t.x, y: t.y }, f.wr) ? 1.5 : 0;
      consider(e + kill + le * .08 + stay - back - thr(t.x, t.y) + (f.boss ? 4 : 0) + (1 - f.hp / f.mhp) * 6, { x: t.x, y: t.y, act: { type: 'attack', target: f.id } });
    }
    // spells
    for (const id in u.spells) {
      const sp = spellInfo(id, u.spells[id]); if (sp.mp > u.mp || sp.kind === 'recall' || sp.kind === 'cure') continue;
      const cand = sp.kind === 'heal' || sp.kind === 'buff' ? mates : foes;
      for (const c of cand) { if (Math.abs(c.x - t.x) + Math.abs(c.y - t.y) > sp.r) continue;
        u.x = t.x; u.y = t.y; const ts = spellTargets(B, u, sp, c.x, c.y); u.x = ox; u.y = oy;
        let sc = 0;
        if (sp.kind === 'dmg') for (const v of ts) sc += Math.min(v.hp, sp.pow) + (sp.pow >= v.hp ? 30 : 0);
        else if (sp.kind === 'heal') for (const v of ts) { const miss = v.mhp - v.hp; if (miss / v.mhp > .35 || (v.id === 'dax' && miss / v.mhp > .25)) sc += Math.min(miss, sp.pow) * 1.6 + (v.id === 'dax' ? 10 : 0); }
        else if (sp.kind === 'buff') for (const v of ts) sc += v.st[sp.st] ? 0 : (foes.some(f => dist(f, v) <= 6) ? 5 : 0);
        else if (sp.kind === 'debuff') for (const v of ts) sc += v.st[sp.st] || v.boss ? 0 : 6;
        else if (sp.kind === 'kill') for (const v of ts) sc += v.boss ? 0 : v.hp * .25;
        consider(sc - sp.mp * .15 + le * .05 + stay - (sp.kind === 'dmg' ? thr(t.x, t.y) : thr(t.x, t.y) * .5), { x: t.x, y: t.y, act: { type: 'spell', id, lv: u.spells[id], tx: c.x, ty: c.y } });
      }
    }
  }
  const medic = mates.some(m => m !== u && m.spells && m.spells.MEND && m.mp >= 3);
  const scared = opts.cautious && medic && u.hp < u.mhp * (u.id === 'dax' ? .6 : .45);
  if (best && !(scared && best.act.type === 'attack' && !(expDmgKill(B, u, best)))) return best;
  if (still) return { x: u.x, y: u.y, act: null };
  // nothing to hit: advance (healers keep a step back from the front)
  const D = distField(B, u, foes), healer = u.ai === 'heal';
  let pick = null, pv = 1e9;
  for (const t of R.tiles) {
    let v = D[t.y * B.w + t.x] - (u.mt === 'fly' ? 0 : (LAND[tileAt(B, t.x, t.y)] || 0)) * .02 + thr(t.x, t.y) * 1.5;
    if (healer) { const near = foes.reduce((m, f) => Math.min(m, Math.abs(f.x - t.x) + Math.abs(f.y - t.y)), 99); if (near < 3) v += 6 - near; }
    if (scared) { const near = foes.reduce((m, f) => Math.min(m, Math.abs(f.x - t.x) + Math.abs(f.y - t.y) - effMov(f) - f.wr[1]), 99); v = -near * 3 + mates.reduce((m, f) => Math.min(m, f === u ? 99 : Math.abs(f.x - t.x) + Math.abs(f.y - t.y)), 99); }
    if (v < pv) { pv = v; pick = t; }
  }
  return { x: pick ? pick.x : u.x, y: pick ? pick.y : u.y, act: null };
}
