'use strict';
// ================= CARL 2: the action engine (maps, Carl, bongs in flight, enemies, loot, HUD) =================
// what the other cartridges remember
const OTHER = { carl: fetchStore('carl_meta'), face: fetchStore('face_meta'), yoko: fetchStore('yoko_meta'), pk: fetchStore('pk_meta'), tp: fetchStore('tp_mem'), ghost: fetchStore('ghost_meta'), linda: fetchStore('linda_meta') };
const YOKO_TRUE = !!(OTHER.yoko && OTHER.yoko.ends && OTHER.yoko.ends.true), PERMA_YOKO = !!(OTHER.yoko && OTHER.yoko.perma);
const PUBLISHER = PERMA_YOKO ? 'YOKO LTD.' : 'PRETEND CO.';
let C2 = null; // the save: everything that persists
function newC2() {
  return { ep: 0, map: 'ship', x: 0, y: 0, dir: 'd', flags: {}, bongs: [starterBong()], eq: 0, hp: 20, maxhp: 20, lv: 1, xp: 0, bux: 0,
    human: 0, humanMax: 0, meter: 0, tapes: [], quests: {}, comp: null, pretzels: 2, time: 0, transforms: 0, notes: 0, visited: {}, kills: 0 };
}
const F2 = k => C2 && C2.flags[k];
const setF2 = (k, v = 1) => { C2.flags[k] = v; };
const MAPS2 = {};
let OBJ = null; // {text, map, x, y}: the Committee's objective marker ("KIDS GET LOST")
const WD = { M: null, id: '', w: 0, h: 0, grid: [], ents: [], shots: [], eshots: [], pick: [], fx: [], hold: 0, haze: 0, entry: null, t: 0, lock: 0, ts: null, P: null, tick: [], note: null, laugh: 0, arena: null, dark: 0 };
const PL = { x: 0, y: 0, dir: 'd', fx: 0, fy: 1, f: 0, inv: 0, roll: 0, rvx: 0, rvy: 0, cd: 0, humanT: 0, smokeCD: 0, holdC: 0, kvx: 0, kvy: 0, moving: 0, throwF: 0, swing: 0, lastA: 0 };
const curBong = () => C2.bongs[C2.eq] || C2.bongs[0];
function resetPL() { Object.assign(PL, { inv: 0, roll: 0, cd: 0, humanT: 0, smokeCD: 0, holdC: 0, kvx: 0, kvy: 0, throwF: 0, swing: 0, dead: 0 }); WD.haze = 0; WD.shake = 0; post.wave = 0; post.shake = 0; }
const shortBong = b => (b.name.includes('(') ? b.name.split(' (')[0] : (b.size !== 'REGULAR' ? b.size + ' ' : '') + b.mat).slice(0, 12);

// ---------------- tiles + collision ----------------
const tileAt = (tx, ty) => (ty < 0 || ty >= WD.h || tx < 0 || tx >= WD.w) ? '#' : WD.grid[ty][tx];
const solidPx = (px, py) => SOLID.has(tileAt(Math.floor(px / 16), Math.floor(py / 16)));
function boxFree(x, y, hw, hh) { return !(solidPx(x - hw, y - hh) || solidPx(x + hw, y - hh) || solidPx(x - hw, y + hh) || solidPx(x + hw, y + hh) || solidPx(x, y - hh) || solidPx(x, y + hh)); }
function moveBox(e, dx, dy, hw = 5, hh = 3, ghost) { // e.x,e.y = feet; box centered at y-hh
  let hitX = 0, hitY = 0;
  const stuck = !ghost && !boxFree(e.x, e.y - hh, hw, hh); // already overlapping a wall: let it walk out instead of freezing there
  if (dx) { const nx = e.x + dx; if (ghost ? inMap(nx, e.y) : stuck ? inMap(nx, e.y) : boxFree(nx, e.y - hh, hw, hh)) e.x = nx; else hitX = 1; }
  if (dy) { const ny = e.y + dy; if (ghost ? inMap(e.x, ny) : stuck ? inMap(e.x, ny) : boxFree(e.x, ny - hh, hw, hh)) e.y = ny; else hitY = 1; }
  return { hitX, hitY };
}
const inMap = (x, y) => x > 8 && y > 12 && x < WD.w * 16 - 8 && y < WD.h * 16 - 2;
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// ---------------- maps ----------------
function loadMap(id, tx, ty, dir) {
  const M = MAPS2[id]; if (!M) { console.error('no map', id); return; }
  WD.M = M; WD.id = id; C2.map = id; C2.visited[id] = 1;
  const w = Math.max(...M.rows.map(r => r.length));
  WD.grid = M.rows.map(r => (r + '#'.repeat(w)).slice(0, w).split('')); WD.h = WD.grid.length; WD.w = w;
  WD.ts = tileset(M.theme); WD.P = F2('shark') && !M.noExtreme ? extremePal(WD.ts.P) : WD.ts.P;
  PL.x = tx * 16 + 8; PL.y = ty * 16 + 14; PL.dir = dir || 'd'; setFacing(PL.dir); PL.roll = 0; PL.kvx = PL.kvy = 0; PL.inv = 30;
  C2.x = tx; C2.y = ty; C2.dir = PL.dir; WD.entry = { x: tx, y: ty, dir: PL.dir };
  WD.ents = []; WD.shots = []; WD.eshots = []; WD.pick = []; WD.fx = []; WD.lock = 0; WD.arena = null; WD.dark = M.dark || 0;
  for (const d of (M.ents ? M.ents() : [])) { const e = addEnt(d); e.cond = d.if; } // conditions are live: things appear and leave as the story moves
  (M.spawns || []).forEach((s, i) => { if ((s.once && F2('sp_' + id + '_' + i)) || (s.if && !s.if())) return; const e = spawnEnemy(s.k, s.x * 16 + 8, s.y * 16 + 14, s.o); if (e && s.once) e.onDie = () => setF2('sp_' + id + '_' + i); });
  if (C2.comp && !M.noComp) addEnt({ id: 'comp', kind: 'comp', comp: C2.comp, x: PL.x - 14, y: PL.y + 2 });
  if (M.init) M.init();
  const mus = typeof M.music === 'function' ? M.music() : M.music; if (mus) music(mus);
  snapCam();
}
async function goMap(id, tx, ty, dir) {
  WD.hold++;
  try { sfx('door'); await fadeOut(.14); loadMap(id, tx, ty, dir); await fadeIn(.14); } finally { WD.hold--; }
  const M = MAPS2[id]; if (M.enter) await wstory(M.enter);
}
function snapCam() {
  const mw = WD.w * 16, mh = WD.h * 16;
  camX = mw <= W ? (mw - W) / 2 : clamp(PL.x - W / 2, 0, mw - W);
  camY = mh <= H - 12 ? (mh - H) / 2 - 6 : clamp(PL.y - 8 - H / 2 - 6, -12, mh - H);
  camX = Math.round(camX); camY = Math.round(camY);
}

// ---------------- entities ----------------
function addEnt(d) {
  const e = Object.assign({ kind: 'npc', t: 0, f: 0, hw: 6, hh: 4, fl: 0, flip: 0, vx: 0, vy: 0 }, d);
  if (d.tx !== undefined) { e.x = d.tx * 16 + 8; e.y = d.ty * 16 + 14; }
  if (e.kind === 'npc' && e.solid === undefined) e.solid = 1;
  WD.ents.push(e); return e;
}
const ent = id => WD.ents.find(e => e.id === id);
function removeEnt(e) { e.gone = 1; }
const live = e => !e.gone && (!e.cond || e.cond());
function entSprite(e) {
  let s = typeof e.spr === 'function' ? e.spr(e) : e.spr;
  if (Array.isArray(s)) s = s[((e.t / (e.anim || 16)) | 0) % s.length];
  return s;
}

// ---------------- enemies ----------------
const ENEMY = {
  focus: { name: 'FOCUS TESTER', hp: 6, spd: .55, ai: 'chase', dmg: 2, spr: () => CS.people.focus, xp: 3, bux: [1, 3], sequel: 1, corp: 1, shoot: { every: 170, spd: 1.5, kind: 'note', dmg: 1 } },
  cop: { name: 'MALL COP', hp: 10, spd: .72, ai: 'chase', dmg: 3, spr: () => CS.people.cop, xp: 4, bux: [2, 4] },
  suit: { name: 'CONTENT SUIT', hp: 12, spd: .5, ai: 'shoot', dmg: 3, spr: () => CS.people.content, xp: 6, bux: [2, 5], sequel: 1, corp: 1, shoot: { every: 95, spd: 2, kind: 'net', dmg: 2 } },
  cart: { name: 'SHOPPING CART', hp: 8, spd: 1.35, ai: 'roll', dmg: 2, spr: () => CS.cart, P: () => CP.cart, xp: 3, bux: [1, 2], hw: 7 },
  tumble: { name: 'TUMBLEWEED', hp: 5, spd: 1.25, ai: 'roll', dmg: 2, spr: () => CS.tumble, P: () => CP.weed, xp: 2, bux: [0, 2], anim: 6 },
  jack: { name: 'JACKALOPE', hp: 7, spd: 2.4, ai: 'hop', dmg: 3, spr: () => CS.jack, P: () => CP.jack, xp: 4, bux: [1, 3] },
  lite: { name: 'LINDA LITE', hp: 10, spd: .55, ai: 'shoot', dmg: 2, spr: () => CS.people.lindalite, xp: 5, bux: [3, 6], corp: 1, sequel: 1, shoot: { every: 110, spd: 1.7, kind: 'coupon', dmg: 2, n: 3 } },
  figure: { name: 'HU-MAN FIGURE', hp: 4, spd: 1.6, ai: 'hop', dmg: 2, spr: () => [CS.human.d[0], CS.human.d[1]], P: () => CP.human, scale: .6, xp: 2, bux: [1, 2], sequel: 1 },
  drone: { name: 'NOTE DRONE', hp: 6, spd: 1, ai: 'orbit', dmg: 2, spr: () => CS.drone, P: () => CP.bot, xp: 4, bux: [1, 3], sequel: 1, corp: 1, fly: 1, shoot: { every: 120, spd: 1.8, kind: 'note', dmg: 1 } },
  umbrella: { name: 'LOST UMBRELLA', hp: 6, spd: 1.8, ai: 'hop', dmg: 2, spr: () => CS.umbrella, P: () => CP.umb, xp: 3, bux: [1, 3] },
  mask: { name: 'LOST FACE', hp: 5, spd: .6, ai: 'float', dmg: 2, spr: () => CS.mask, P: () => CP.mask, xp: 3, bux: [1, 2], fly: 1, ghost: 1 },
  bubble: { name: 'CHAT BUBBLE', hp: 4, spd: .9, ai: 'float', dmg: 1, xp: 2, bux: [1, 2], fly: 1, draw: e => drawBubbleFoe(e) },
  adult: { name: 'ADULT', hp: 14, spd: .5, ai: 'chase', dmg: 3, spr: () => ADULT.teacher, P: () => ADULTPAL.teacher, xp: 5, bux: [2, 4], scale: .6 },
  yokoid: { name: 'YOKOID', hp: 8, spd: .8, ai: 'chase', dmg: 2, spr: () => YS.yokoid, P: () => YP.yokoid, xp: 4, bux: [2, 3], scale: .7, sequel: 1 },
  cosmo: { name: 'COSMO-WORKER', hp: 11, spd: .6, ai: 'shoot', dmg: 3, spr: () => CS.people.cosmo, xp: 6, bux: [2, 5], shoot: { every: 100, spd: 1.9, kind: 'orb', dmg: 2 } },
  fan: { name: 'OBSESSED FAN', hp: 7, spd: 1, ai: 'chase', dmg: 2, spr: () => CS.people.fan, xp: 3, bux: [1, 3] },
};
function spawnEnemy(k, x, y, o = {}) {
  const T = ENEMY[k]; if (!T) { console.error('no enemy', k); return null; }
  const lv = C2.ep || 1, hpScale = 1 + (lv - 1) * .28, hw0 = T.hw || 6;
  if (!T.ghost && !boxFree(x, y - 4, hw0, 4)) { let best = null, bd = 1e9; for (let dy = -48; dy <= 48; dy += 4) for (let dx = -48; dx <= 48; dx += 4) { const d = dx * dx + dy * dy; if (d < bd && boxFree(x + dx, y + dy - 4, hw0, 4)) { bd = d; best = [x + dx, y + dy]; } } if (best) [x, y] = best; }
  const e = addEnt(Object.assign({ kind: 'enemy', k, x, y, hp: Math.round(T.hp * hpScale), spd: T.spd, ai: T.ai, dmg: T.dmg + Math.floor((lv - 1) / 2), hw: T.hw || 6, hh: 4, rad: 7, cd: 60 + rnd(90), dir: rnd(4), anim: T.anim || 14, spr: T.spr, P: T.P ? T.P() : null, draw: T.draw, T }, o));
  e.maxhp = e.hp; if (!e.P) { const s = entSprite(e); e.P = s && s.P; }
  if (WD.arena) e.arenaSpawned = 1; // only the fight's own enemies hold an arena shut
  return e;
}
function drawBubbleFoe(e) { const x = e.x - camX, y = e.y - camY - 18; rectF(x - 12, y - 6, 24, 12, e.fl ? hex('#ff2449') : WHITE); frameRect(x - 12, y - 6, 24, 12, BLACK); rectF(x - 6, y + 6, 3, 3, WHITE); text(e.word || (e.word = pick(['KEKW', 'W', 'L', 'FIRST', 'LOL', 'MID', '???', 'GG'])), x - 10, y - 3, BLACK, 0); }
function enemyUpdate(e) {
  const T = e.T, slow = WD.haze > 0 ? .6 : 1, d = dist(e, PL);
  if (e.argue > 0) { e.argue--; if (e.argue % 30 === 0) { const o = WD.ents.find(o2 => o2 !== e && o2.kind === 'enemy' && !o2.dead && dist(o2, e) < 50); if (o) { hurtEnemy(o, 1.5, null, 1); WD.fx.push({ k: 'txt', x: o.x, y: o.y - 22, s: pick(['NO U', 'WELL ACTUALLY', 'SOURCE?', 'OK AND?']), t: 40, c: hex('#ffdb24') }); } } return; }
  if (e.stun > 0) { e.stun--; return; }
  const sp = e.spd * slow, ghost = !!T.ghost;
  const toward = (k = 1) => { const a = Math.atan2(PL.y - e.y, PL.x - e.x); const m = moveBox(e, Math.cos(a) * sp * k, Math.sin(a) * sp * k, e.hw, e.hh, ghost); e.flip = PL.x < e.x; return m; };
  if (e.ai === 'chase') { if (d < 150 || e.aggro) { e.aggro = 1; toward(); } else wanderStep(e, sp * .5); }
  else if (e.ai === 'shoot') { if (d < 170) { e.aggro = 1; if (d > 90) toward(); else if (d < 60) toward(-1); else strafe(e, sp); } else wanderStep(e, sp * .5); }
  else if (e.ai === 'roll') { if (!e.vx && !e.vy) { const a = Math.random() * 6.28; e.vx = Math.cos(a); e.vy = Math.sin(a); } const m = moveBox(e, e.vx * sp, e.vy * sp, e.hw, e.hh); if (m.hitX) e.vx = -e.vx; if (m.hitY) e.vy = -e.vy; if (d < 110 && e.t % 90 === 0) { const a = Math.atan2(PL.y - e.y, PL.x - e.x); e.vx = Math.cos(a); e.vy = Math.sin(a); } e.flip = e.vx < 0; }
  else if (e.ai === 'hop') { if (e.hopT > 0) { e.hopT--; moveBox(e, e.vx * sp, e.vy * sp, e.hw, e.hh); e.z = Math.sin(e.hopT / 18 * Math.PI) * 6; } else { e.z = 0; if (--e.cd <= 0) { e.cd = 40 + rnd(40); const a = d < 140 ? Math.atan2(PL.y - e.y, PL.x - e.x) + (Math.random() - .5) * .6 : Math.random() * 6.28; e.vx = Math.cos(a); e.vy = Math.sin(a); e.hopT = 18; e.flip = e.vx < 0; } } }
  else if (e.ai === 'orbit') { e.ang = (e.ang || Math.random() * 6) + .02 * slow; const tx = PL.x + Math.cos(e.ang) * 60, ty = PL.y + Math.sin(e.ang) * 40; moveBox(e, clamp(tx - e.x, -sp, sp), clamp(ty - e.y, -sp, sp), e.hw, e.hh, 1); }
  else if (e.ai === 'float') { if (d < 160) toward(); else wanderStep(e, sp * .4, 1); e.z = Math.sin(e.t * .08) * 2; }
  if (T.shoot && e.aggro && d < 200) { if (--e.cd <= 0) { e.cd = T.shoot.every + rnd(40); fireAt(e, T.shoot); } }
  if (d < 12 && !PL.dead) hurtPlayer(e.dmg, e.x, e.y);
}
function wanderStep(e, sp, ghost) { if (!(e.wt > 0)) { e.wt = 60 + rnd(90); e.wa = rnd(5) === 0 ? null : Math.random() * 6.28; } else e.wt--; if (e.wa !== null && e.wa !== undefined) { const m = moveBox(e, Math.cos(e.wa) * sp, Math.sin(e.wa) * sp, e.hw, e.hh, ghost); if (m.hitX || m.hitY) e.wa += 2; e.flip = Math.cos(e.wa) < 0; } }
function strafe(e, sp) { e.sa = (e.sa || (Math.random() < .5 ? 1 : -1)); if (e.t % 80 === 0) e.sa = -e.sa; const a = Math.atan2(PL.y - e.y, PL.x - e.x) + Math.PI / 2; const m = moveBox(e, Math.cos(a) * sp * e.sa, Math.sin(a) * sp * e.sa, e.hw, e.hh); if (m.hitX || m.hitY) e.sa = -e.sa; }
function fireAt(e, s) {
  const n = s.n || 1, a0 = Math.atan2(PL.y - 6 - (e.y - 8), PL.x - e.x);
  for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * .25; WD.eshots.push({ x: e.x, y: e.y - 8, vx: Math.cos(a) * s.spd, vy: Math.sin(a) * s.spd, k: s.kind, dmg: s.dmg + Math.floor((C2.ep - 1) / 3), t: 0 }); }
  sfx('blip', [s.kind === 'net' ? 300 : 700, 40]);
}
function hurtEnemy(e, d, shot, quiet) {
  if (e.dead || e.inv > 0 || e.immune) return;
  let m = 1; const b = shot && shot.b;
  if (e.accused > 0) m *= 2;
  if (b && B_MAT[b.mat].legacy && e.T && e.T.sequel) m *= 1.5;
  if (PL.humanT > 0 && !quiet) m *= 3;
  d = Math.max(1, Math.round(d * m * (1 + (C2.lv - 1) * .1) * (C2.dmgMul || 1)));
  e.hp -= d; e.fl = 8;
  if (!quiet) { WD.fx.push({ k: 'num', x: e.x + rnd(6) - 3, y: e.y - 20, s: String(d), t: 30, c: e.accused > 0 ? hex('#ffdb24') : WHITE }); sfx('blip', [220 + rnd(80), 20]); }
  if (shot) { const a = Math.atan2(e.y - PL.y, e.x - PL.x); if (!e.boss) moveBox(e, Math.cos(a) * 4, Math.sin(a) * 4, e.hw, e.hh, e.T && e.T.ghost); }
  if (F2('power') && PL.humanT <= 0) C2.meter = Math.min(100, C2.meter + d * 1.6 * (C2.meterMul || 1));
  if (b && B_MAT[b.mat].heal) C2.hp = Math.min(C2.maxhp, C2.hp + 1);
  if (b && b.mods.includes('ARGUMENTATIVE') && !e.boss) { e.argue = 150; WD.fx.push({ k: 'txt', x: e.x, y: e.y - 26, s: '!?', t: 40, c: hex('#ff9224') }); }
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e) {
  e.dead = 1; e.gone = 1; C2.kills++; DBG.kills = (DBG.kills || 0) + 1; if (C2.catch && !e.boss && Math.random() < .12) tickC(pick(['COWABONGA!', 'BONG VOYAGE!', 'THAT\'S HOW WE DO IT IN NEVADA!', '...Why do I keep saying things.']));
  boom(e.x, e.y - 8, e.boss ? 3 : 1);
  if (e.boss) { if (e.onDie) e.onDie(e); return; }
  const T = e.T || {};
  gainXP(T.xp || 2);
  const [a, b] = T.bux || [1, 2]; for (let i = 0, n = a + rnd(b - a + 1); i < n; i++) dropPick('bux', e.x, e.y);
  if (Math.random() < .09) dropPick('pretzel', e.x, e.y);
  if (Math.random() < (e.bongDrop || .07)) dropPick('bong', e.x, e.y, genBong(C2.ep || 1));
  if (e.onDie) e.onDie(e);
}
function boom(x, y, sz) { sfx(sz > 2 ? 'hurt' : 'blip', [120, 40]); for (let i = 0; i < 6 + sz * 5; i++) { const a = Math.random() * 6.28, v = .6 + Math.random() * 1.6 * sz; WD.fx.push({ k: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 18 + rnd(14), c: pick([hex('#ffffff'), hex('#ffdb24'), hex('#ff9224'), hex('#92dbff')]) }); } }
function dropPick(k, x, y, b) {
  const a = Math.random() * 6.28;
  if (solidPx(x, y + 2)) { let best = null, bd = 1e9; for (let dy = -32; dy <= 32; dy += 4) for (let dx = -32; dx <= 32; dx += 4) { const d = dx * dx + dy * dy; if (d < bd && !solidPx(x + dx, y + dy + 2)) { bd = d; best = [x + dx, y + dy]; } } if (best) [x, y] = best; }
  WD.pick.push({ k, x, y, vx: Math.cos(a) * 1.2, vy: Math.sin(a) * 1.2, t: 0, b });
}
function gainXP(n) {
  C2.xp += n; const need = () => 18 + C2.lv * C2.lv * 10;
  while (C2.xp >= need()) { C2.xp -= need(); C2.lv++; C2.maxhp += 4; C2.hp = C2.maxhp; sfx('get'); banner('LEVEL UP! LV ' + C2.lv + '. COMPOSURE ' + C2.maxhp + '. STILL SHORT.', 140); }
}

// ---------------- the player ----------------
const DV = { d: [0, 1], u: [0, -1], l: [-1, 0], r: [1, 0] };
function setFacing(d) { PL.dir = d; PL.fx = DV[d][0]; PL.fy = DV[d][1]; }
function playerUpdate() {
  if (PL.dead) return;
  const human = PL.humanT > 0;
  if (PL.inv > 0) PL.inv--; if (PL.cd > 0) PL.cd--; if (PL.throwF > 0) PL.throwF--; if (PL.swing > 0) PL.swing--; if (PL.smokeCD > 0) PL.smokeCD--;
  if (human) { PL.humanT--; if (PL.humanT === 0) humanEnd(); }
  let mx = (held.right ? 1 : 0) - (held.left ? 1 : 0), my = (held.down ? 1 : 0) - (held.up ? 1 : 0);
  if (PL.roll > 0) { PL.roll--; moveBox(PL, PL.rvx, PL.rvy); return; }
  if (PL.kvx || PL.kvy) { moveBox(PL, PL.kvx, PL.kvy); PL.kvx *= .7; PL.kvy *= .7; if (Math.abs(PL.kvx) + Math.abs(PL.kvy) < .2) PL.kvx = PL.kvy = 0; }
  const spd = (human ? 1.75 : 1.35) * (mx && my ? .75 : 1) * (C2.spdMul || 1);
  PL.moving = !!(mx || my);
  if (PL.moving) {
    moveBox(PL, mx * spd, my * spd); PL.f++;
    if (!held.a) { if (mx && my) { PL.fx = mx * .7071; PL.fy = my * .7071; PL.dir = Math.abs(PL.fx) >= Math.abs(PL.fy) - .01 ? (mx > 0 ? 'r' : 'l') : (my > 0 ? 'd' : 'u'); } else { PL.fx = mx; PL.fy = my; PL.dir = mx > 0 ? 'r' : mx < 0 ? 'l' : my > 0 ? 'd' : 'u'; } }
    if (PL.f % 18 === 0) sfx('step');
  }
  // solid NPCs push back
  for (const e of WD.ents) if ((typeof e.solid === 'function' ? e.solid() : e.solid) && live(e) && Math.abs(e.x - PL.x) < e.hw + 5 && Math.abs(e.y - PL.y) < e.hh + 3) { const a = Math.atan2(PL.y - e.y, PL.x - e.x); moveBox(PL, Math.cos(a) * 1.4, Math.sin(a) * 1.4); }
  if (held.a) { if (human) humanSwing(); else throwBong(); }
  if (pressed.b) { const it = interactTarget(); if (it) wstory(() => interact(it)); else if (PL.moving) { PL.roll = 14; PL.inv = Math.max(PL.inv, 16); PL.rvx = PL.fx * 2.6; PL.rvy = PL.fy * 2.6; sfx('jump'); } }
  if (held.c) { PL.holdC++; if (PL.holdC === 45 && humanReady()) wstory(humanTransform); }
  else { if (PL.holdC > 0 && PL.holdC < 20) smoke(); PL.holdC = 0; }
}
const humanReady = () => F2('power') && C2.meter >= 100 && PL.humanT <= 0 && !WD.M.noHuman;
function throwBong() {
  const b = curBong(); if (!b || PL.cd > 0) return;
  PL.cd = b.rate; PL.throwF = 10; C2.throws = (C2.throws || 0) + 1;
  const spread = b.mods.includes('SPLIT') ? [-.28, 0, .28] : [0];
  for (const da of spread) { const a = Math.atan2(PL.fy, PL.fx) + da; WD.shots.push({ x: PL.x + Math.cos(a) * 6, y: PL.y - 2 + Math.sin(a) * 4, vx: Math.cos(a) * b.spd, vy: Math.sin(a) * b.spd, b, t: 0, life: Math.round(140 / b.spd), hit: new Set(), bounce: b.mods.includes('BOUNCY') ? 3 : 0, ret: 0, spin: 0 }); }
  sfx('blip', [900, 60]);
}
function humanSwing() {
  if (PL.cd > 0) return; PL.cd = 18; PL.swing = 12; sfx('power');
  const b = curBong(), dmg = b.dmg * 1.4 + 3;
  for (const e of WD.ents) if (e.kind === 'enemy' || e.boss) { if (e.dead || e.gone) continue; const dx = e.x - PL.x, dy = e.y - PL.y, d = Math.hypot(dx, dy); if (d < 38 && (dx * PL.fx + dy * PL.fy) > -8) hurtEnemy(e, dmg, { b }); }
  WD.fx.push({ k: 'ring', x: PL.x + PL.fx * 14, y: PL.y - 10 + PL.fy * 10, t: 12, c: hex('#6dffff') });
}
function interactTarget() {
  let best = null, bd = 26;
  for (const e of WD.ents) { if (!live(e) || !(e.talk) || (e.haze && WD.haze <= 0)) continue; const d = Math.hypot(e.x - (PL.x + PL.fx * 6), e.y - (PL.y + PL.fy * 6)) - (e.reach || 0); if (d < bd) { bd = d; best = e; } }
  if (best) return best;
  const tx = Math.floor((PL.x + PL.fx * 12) / 16), ty = Math.floor((PL.y - 4 + PL.fy * 12) / 16), sg = WD.M.signs && WD.M.signs[tx + ',' + ty];
  if (sg) return { sign: sg };
  return null;
}
async function interact(it) {
  if (it.sign) return it.sign();
  if (it.x !== undefined) { it.flip = PL.x < it.x; }
  await it.talk(it);
}
function smoke() {
  if (PL.smokeCD > 0) { tickC(pick(['Hold on. Pacing myself.', 'Not yet. Lungs are regular human lungs.'])); return; }
  PL.smokeCD = 720; WD.haze = 540; C2.smokes = (C2.smokes || 0) + 1; DBG.smokes = (DBG.smokes || 0) + 1;
  sfx('crowd'); for (let i = 0; i < 16; i++) WD.fx.push({ k: 'puff', x: PL.x + rnd(20) - 10, y: PL.y - 16 + rnd(10), vx: (Math.random() - .5) * .6, vy: -.3 - Math.random() * .4, t: 60 + rnd(40) });
  tickC(pick(['Just a little. For my regular human nerves.', 'Okay. Okay. Better. Wobbly, but better.', 'Chat, is it doing the wavy thing? Cool.', 'Now I can see stuff. Stuff was always there. I just see it now.']));
  if (WD.M.onSmoke) wstory(WD.M.onSmoke);
}
function hurtPlayer(d, sx, sy) {
  if (PL.inv > 0 || PL.humanT > 0 || PL.roll > 0 || DBG.god || PL.dead) return;
  C2.hp -= d; PL.inv = 70; sfx('hurt'); WD.shake = 8;
  const a = Math.atan2(PL.y - sy, PL.x - sx); PL.kvx = Math.cos(a) * 2.6; PL.kvy = Math.sin(a) * 2.6;
  WD.fx.push({ k: 'num', x: PL.x, y: PL.y - 26, s: '-' + d, t: 30, c: hex('#ff4949') });
  if (C2.hp <= 0) { PL.dead = 1; wstory(lostCool); }
}
async function lostCool() {
  const A = WD.M.arena; if (A && WD.arena && !F2(A.flag)) { C2.nerf = C2.nerf || {}; C2.nerf[A.flag] = (C2.nerf[A.flag] || 0) + 1; }
  music(null); sfx('powerdown');
  for (let i = 0; i < 40; i++) { post.fade = i / 40; await nextFrame(); }
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['CARL LOST HIS COOL.'], 90);
  const lost = Math.floor(C2.bux * .1); C2.bux -= lost; C2.hp = C2.maxhp; PL.dead = 0; C2.cools = (C2.cools || 0) + 1; DBG.cools = (DBG.cools || 0) + 1;
  scene = worldScene; loadMap(WD.id, WD.entry.x, WD.entry.y, WD.entry.dir); post.fade = 1; await fadeIn(.08);
  await say(pick(['I\'m fine. I\'m back. I was always back. Nobody saw that.', 'Okay. Reset. Humans reset. We call it a nap.', 'That wasn\'t losing. That was a tactical... chat, what\'s a word for losing.']) + (lost ? ' Also I dropped $' + lost + '. Somewhere.' : ''), 'CARL', { port: cport('w') });
}

// ---------------- HU-MAN ----------------
function addHuman(n, why) {
  C2.human = clamp(C2.human + n, 0, 100); C2.humanMax = Math.max(C2.humanMax, C2.human);
  WD.fx.push({ k: 'txt', x: PL.x, y: PL.y - 34, s: (n > 0 ? 'HUMAN +' : 'HUMAN ') + n + '%', t: 70, c: n > 0 ? hex('#ffdb49') : hex('#6dff24') });
  DBG.humanLog = (DBG.humanLog || []).concat([[why, n]]);
}
async function humanTransform() {
  PL.holdC = 999; C2.meter = 0; C2.transforms++; DBG.transforms = (DBG.transforms || 0) + 1;
  sfx('power'); banner('BY THE POWER OF NEVADA!', 90); speak('By the power of Nevada!', { pitch: .6, rate: .95 });
  for (let i = 0; i < 40; i++) { post.flash = (i & 2) ? .7 : .2; WD.shake = 3; await nextFrame(); } post.flash = 0;
  PL.humanT = 600; addHuman(6, 'transform');
  if (C2.transforms === 1) { await say('I HAVE THE POWER.', 'HU-MAN'); await say('...Why did I say that. I didn\'t say that. It came out of my new mouth. Chat, I have a CHIN.', 'CARL', { port: cport('w') }); }
  else if (C2.human >= 70) tickC('Nothing tells me what to do.');
}
function humanEnd() { sfx('powerdown'); boom(PL.x, PL.y - 12, 2); tickC(C2.human >= 70 ? 'Relax. Everything went exactly as planned.' : pick(['Okay. That was a lot of muscles.', 'I\'m small again. Good. I think good.', 'Why do I miss the chin. I don\'t miss the chin.'])); }

// ---------------- stories (freeze the world) ----------------
function wstory(fn) { WD.hold++; return run(async () => { try { await fn(); } finally { WD.hold = Math.max(0, WD.hold - 1); } }); }
const frozen2 = () => WD.hold > 0 || !!DLG || MENUS.length > 0 || !!CARD || !!CHATBOX;
// Carl's portrait follows his mood and his HUMAN%
const cport = m => ({ s: carlMood(m), P: CP.carlPort });
function C(text, m) { return say(text, 'CARL', { port: cport(m) }); }
// same beat, two scripts: Carl's line, or the one HU-MAN would say (HUMAN% >= 70)
function CL(line, hline, m) { return C2.human >= 70 && hline ? say(hline, 'CARL', { port: cport('jaw') }) : C(line, m); }
function laugh(s) { if (F2('special')) { WD.laugh = { s: '[NO LAUGH TRACK]', t: 80 }; return; } WD.laugh = { s: s || pick(['[LAUGHTER]', '[STUDIO AUDIENCE LAUGHS]', '[LAUGH TRACK]', '[SCATTERED APPLAUSE]']), t: 90 }; sfx('crowd'); }
function tickC(m) { WD.tick.push({ u: 'CARL', m, t: 260, carl: 1 }); }
function tickChat(u, m) { WD.tick.push({ u, m, t: 300 }); if (WD.tick.length > 6) WD.tick.shift(); }
function memo(s, t = 240) { WD.note = { s, t }; sfx('ask'); C2.notes++; } // a Committee NOTE (not the synth's note())
function setObj(text, map, x, y) { OBJ = text ? { text, map, x, y } : null; DBG.obj = OBJ; }

// ---------------- routing (for the objective arrow, and the test bot) ----------------
function exitsOf(id) { return MAPS2[id].exits || []; } // locked doors still count: the story explains the lock when you get there
function routeTo(fromId, toId) { // first exit to take from fromId toward toId (BFS over maps)
  if (fromId === toId) return null;
  const prev = { [fromId]: null }, q = [fromId];
  while (q.length) { const m = q.shift(); for (const x of exitsOf(m)) { if (x.to in prev) continue; prev[x.to] = { m, x }; if (x.to === toId) { let c = toId, st = prev[c]; while (st.m !== fromId) { c = st.m; st = prev[c]; } return st.x; } q.push(x.to); } }
  return null;
}
function objTarget() { // pixel target on this map for the objective
  if (!OBJ) return null;
  if (OBJ.map === WD.id || !OBJ.map) { if (OBJ.x === undefined) return null; return { x: OBJ.x * 16 + 8, y: OBJ.y * 16 + 10 }; }
  const x = routeTo(WD.id, OBJ.map); if (!x) return null;
  return { x: (x.x + (x.w || 1) / 2) * 16, y: (x.y + (x.h || 1) / 2) * 16, exit: x };
}

// ---------------- the world scene ----------------
const worldScene = {
  update() {
    WD.t++; C2.time++;
    if (WD.shake > 0) { WD.shake--; post.shake = WD.shake > 0 ? Math.min(3, WD.shake >> 1) : 0; } else post.shake = 0;
    if (post.flash > 0 && !WD.hold) post.flash = Math.max(0, post.flash - .05);
    if (WD.laugh && WD.laugh.t > 0) WD.laugh.t--;
    if (WD.note && WD.note.t > 0) WD.note.t--;
    for (const k of WD.tick) k.t--; WD.tick = WD.tick.filter(k => k.t > 0);
    if (frozen2()) { post.wave = 0; return; }
    if (pressed.start && !PL.dead) { wstory(pauseMenu); return; }
    if (WD.haze > 0) { WD.haze--; post.wave = WD.haze > 30 ? 1.2 : WD.haze / 25; } else post.wave = 0;
    playerUpdate();
    for (const e of WD.ents) { if (!live(e)) continue; e.t++; if (e.fl > 0) e.fl--; if (e.accused > 0) e.accused--; if (e.inv > 0) e.inv--;
      if (e.kind === 'enemy') enemyUpdate(e); else if (e.kind === 'comp') compUpdate(e); else if (e.upd) e.upd(e); }
    shotsUpdate(); pickUpdate();
    for (const f of WD.fx) { f.t--; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; f.vx *= .93; f.vy *= .93; } }
    WD.fx = WD.fx.filter(f => f.t > 0); WD.ents = WD.ents.filter(e => !e.gone);
    if (WD.M.tick) WD.M.tick();
    arenaUpdate(); exitCheck(); chatterTick();
    // camera
    const mw = WD.w * 16, mh = WD.h * 16;
    const tx = mw <= W ? (mw - W) / 2 : clamp(PL.x - W / 2 + PL.fx * 16, 0, mw - W), ty = mh <= H - 12 ? (mh - H) / 2 - 6 : clamp(PL.y - 8 - H / 2 - 6 + PL.fy * 12, -12, mh - H);
    camX += (tx - camX) * .12; camY += (ty - camY) * .12; if (Math.abs(tx - camX) < .5) camX = tx; if (Math.abs(ty - camY) < .5) camY = ty;
  },
  draw() { drawWorld(); drawHUD(); },
};
function exitCheck() {
  if (WD.lock || PL.dead) return;
  const tx = PL.x / 16, ty = (PL.y - 2) / 16;
  for (const x of (WD.M.exits || [])) {
    if (tx >= x.x && tx < x.x + (x.w || 1) && ty >= x.y && ty < x.y + (x.h || 1)) {
      if (x.if && !x.if()) { if (x.no && !WD.noT) { WD.noT = 90; wstory(async () => { await x.no(); PL.x -= PL.fx * 10; PL.y -= PL.fy * 10; }); } continue; }
      wstory(() => goMap(x.to, x.tx, x.ty, x.dir)); return;
    }
  }
  if (WD.noT > 0) WD.noT--;
}
// lose a boss fight and the focus group quietly makes the next try easier (15% per loss, up to 45%)
function focusNerf(A) {
  const n = Math.min(3, (C2.nerf && C2.nerf[A.flag]) || 0); if (!n) return;
  for (const e of WD.ents) if (e.boss && !e.dead) { e.maxhp = Math.max(1, Math.round(e.maxhp * (1 - .15 * n))); e.hp = Math.min(e.hp, e.maxhp); }
  banner('FOCUS GROUP: "TOO HARD." BOSS HP -' + n * 15 + '%', 150);
}
function arenaUpdate() {
  const A = WD.M.arena; if (!A || F2(A.flag)) return;
  if (!WD.arena) {
    const tx = PL.x / 16, ty = PL.y / 16;
    if (tx >= A.x && tx < A.x + A.w && ty >= A.y && ty < A.y + A.h && (!A.if || A.if())) { WD.arena = { wave: 0, t: 0, starting: 1 }; WD.lock = 1; wstory(async () => { if (A.start) await A.start(); focusNerf(A); if (WD.arena) WD.arena.starting = 0; }); }
    return;
  }
  if (WD.arena.starting) return;
  const alive = WD.ents.some(e => ((e.kind === 'enemy' && e.arenaSpawned) || e.boss) && !e.dead && !e.gone && !e.harmless);
  if (alive) return;
  if (WD.arena.wave < A.waves.length) { const wv = A.waves[WD.arena.wave++]; if (typeof wv === 'function') wv(); else for (const s of wv) spawnEnemy(s[0], s[1] * 16 + 8, s[2] * 16 + 14); sfx('alert'); return; }
  setF2(A.flag); WD.lock = 0; WD.arena = null; if (A.done) wstory(A.done);
}
function shotsUpdate() {
  for (const s of WD.shots) {
    const b = s.b; s.t++; s.spin++;
    if (b.mods.includes('HOMING') || B_MAT[b.mat].lic) { let tg = null, bd = B_MAT[b.mat].lic ? 200 : 110; for (const e of WD.ents) { if ((e.kind !== 'enemy' && !e.boss) || e.dead || e.harmless) continue; if (B_MAT[b.mat].lic && !(e.T && e.T.corp) && !e.boss) continue; const d = Math.hypot(e.x - s.x, e.y - s.y); if (d < bd) { bd = d; tg = e; } } if (tg) { const a = Math.atan2(tg.y - 8 - s.y, tg.x - s.x), v = Math.hypot(s.vx, s.vy); s.vx += (Math.cos(a) * v - s.vx) * .12; s.vy += (Math.sin(a) * v - s.vy) * .12; } }
    if (b.mods.includes('BOOMERANG') && s.t > s.life * .45) { s.ret = 1; const a = Math.atan2(PL.y - 4 - s.y, PL.x - s.x), v = b.spd * 1.1; s.vx += (Math.cos(a) * v - s.vx) * .2; s.vy += (Math.sin(a) * v - s.vy) * .2; if (Math.hypot(PL.x - s.x, PL.y - 4 - s.y) < 10) { s.dead = 1; continue; } }
    const nx = s.x + s.vx, ny = s.y + s.vy;
    if (!B_MAT[b.mat].ghost && solidPx(nx, ny + 4)) {
      if (s.bounce > 0) { s.bounce--; if (solidPx(nx, s.y + 4)) s.vx = -s.vx; else s.vy = -s.vy; }
      else if (!s.ret) { shotBreak(s); continue; }
    }
    s.x += s.vx; s.y += s.vy;
    if (s.t > s.life * (b.mods.includes('BOOMERANG') ? 2.2 : 1) || !inMap(s.x, s.y + 6) && !B_MAT[b.mat].ghost) { shotBreak(s); continue; }
    for (const e of WD.ents) {
      if ((e.kind !== 'enemy' && !e.boss) || e.dead || e.gone || s.hit.has(e) || e.harmless || (e.haze && WD.haze <= 0)) continue;
      const r = b.r + (e.rad || 7); const ex = e.x, ey = e.y - (e.hitY || 8);
      if (e.box ? (Math.abs(s.x - ex) < e.box[0] / 2 + b.r && Math.abs(s.y - ey) < e.box[1] / 2 + b.r) : Math.hypot(s.x - ex, s.y - ey) < r) {
        s.hit.add(e); hurtEnemy(e, b.dmg, s);
        if (!b.pierce) { shotBreak(s); break; }
      }
    }
  }
  WD.shots = WD.shots.filter(s => !s.dead);
  for (const s of WD.eshots) {
    s.t++; s.x += s.vx; s.y += s.vy;
    if (solidPx(s.x, s.y + 6) || s.t > 300) { s.dead = 1; continue; }
    if (Math.hypot(s.x - PL.x, s.y - (PL.y - 8)) < 7) { s.dead = 1; hurtPlayer(s.dmg, s.x, s.y); }
  }
  WD.eshots = WD.eshots.filter(s => !s.dead);
}
function shotBreak(s) {
  s.dead = 1; const b = s.b;
  for (let i = 0; i < 5; i++) { const a = Math.random() * 6.28; WD.fx.push({ k: 'spark', x: s.x, y: s.y - 6, vx: Math.cos(a) * 1.2, vy: Math.sin(a) * 1.2, t: 12, c: hex(B_MAT[b.mat].c[2]) }); }
  if (b.mods.includes('SHATTER')) { WD.fx.push({ k: 'ring', x: s.x, y: s.y - 6, t: 14, c: hex(B_MAT[b.mat].c[0]) }); for (const e of WD.ents) if ((e.kind === 'enemy' || e.boss) && !e.dead && !s.hit.has(e) && Math.hypot(e.x - s.x, e.y - 8 - s.y) < 30) hurtEnemy(e, b.dmg * .6, s); }
  if (b.mods.includes('SMOKY')) { for (let i = 0; i < 8; i++) WD.fx.push({ k: 'puff', x: s.x + rnd(16) - 8, y: s.y - 6 + rnd(8), vx: 0, vy: -.2, t: 90 + rnd(30) }); for (const e of WD.ents) if (e.kind === 'enemy' && !e.dead && Math.hypot(e.x - s.x, e.y - s.y) < 28) e.stun = 60; }
  sfx('blip', [1800 + rnd(400), 200]);
}
function pickUpdate() {
  for (const p of WD.pick) {
    p.t++; // loot bounces off walls: a bong that slid into a wall could never be picked up
    if (solidPx(p.x + p.vx, p.y + 2)) p.vx = -p.vx * .5; else p.x += p.vx;
    if (solidPx(p.x, p.y + p.vy + 2)) p.vy = -p.vy * .5; else p.y += p.vy;
    p.vx *= .9; p.vy *= .9;
    const d = Math.hypot(PL.x - p.x, PL.y - 4 - p.y);
    if (p.k !== 'bong' && d < 44 && p.t > 20) { p.x += (PL.x - p.x) * .15; p.y += (PL.y - 4 - p.y) * .15; }
    if (d < 11 && p.t > 12) { p.dead = 1; collect(p); }
    if (p.t > 1500 && p.k === 'bux') p.dead = 1;
  }
  WD.pick = WD.pick.filter(p => !p.dead);
}
function collect(p) {
  if (p.k === 'bux') { C2.bux += 1; sfx('blip', [1400, 100]); }
  if (p.k === 'pretzel') { C2.hp = Math.min(C2.maxhp, C2.hp + 6); sfx('get'); WD.fx.push({ k: 'txt', x: PL.x, y: PL.y - 28, s: 'PRETZEL +6', t: 50, c: hex('#ffdb92') }); }
  if (p.k === 'bong') { sfx('object'); giveBong(p.b); }
  if (p.onGet) p.onGet();
}

// ---------------- companions ----------------
function compUpdate(e) {
  const d = dist(e, PL), c = e.comp;
  if (d > 220) { e.x = PL.x - PL.fx * 14; e.y = PL.y - PL.fy * 10; }
  else if (d > 26) { const a = Math.atan2(PL.y - e.y, PL.x - e.x), sp = d > 60 ? 1.6 : 1.1; const m = moveBox(e, Math.cos(a) * sp, Math.sin(a) * sp); if (m.hitX && m.hitY && d > 80) { e.x = PL.x; e.y = PL.y; } e.flip = PL.x < e.x; e.mv = 1; } else e.mv = 0;
  e.cd = (e.cd || 60) - 1; if (e.bite > 0) e.bite--;
  if (e.cd > 0) return;
  let tg = null, bd = c === 'garf' ? 110 : 44;
  for (const o of WD.ents) { if ((o.kind !== 'enemy' && !o.boss) || o.dead || o.harmless || (o.haze && WD.haze <= 0)) continue; const dd = dist(o, e); if (dd < bd) { bd = dd; tg = o; } }
  if (!tg) { e.cd = 60; e.nap = c === 'garf' && e.t % 1200 > 1000; return; }
  e.nap = 0;
  if (c === 'garf') { e.cd = 200; tg.accused = 480; WD.fx.push({ k: 'txt', x: tg.x, y: tg.y - 30, s: 'ACCUSED!', t: 60, c: hex('#ffdb24') }); sfx('ask'); DBG.accused = (DBG.accused || 0) + 1; }
  if (c === 'bruce') { e.cd = 70; e.bite = 16; const a = Math.atan2(tg.y - e.y, tg.x - e.x); moveBox(e, Math.cos(a) * 10, Math.sin(a) * 10); hurtEnemy(tg, 3 + C2.lv * .8, null); WD.fx.push({ k: 'txt', x: tg.x, y: tg.y - 26, s: 'CHOMP', t: 40, c: hex('#92b6db') }); }
}

// ---------------- chat: company, witness, accomplice, irritant ----------------
const CHATTERS2 = ['xX_gamer_Xx', 'propPillsFan', 'nevada_local', 'spookyfan99', 'mallwalker', 'bongwater', 'alienFACTS', 'desertbus8h', 'lurker', 'garf_ield', 'sequelhater', 'day1carlfan', 'sharkwatch', 'focus_grp_4'];
const JUNK2 = ['KEKW', 'carl is STILL an alien', 'first', 'the sequel is worse', 'the sequel is better', 'W', 'L', 'CARL CARL CARL', 'bro got colorized', 'he looks weird in color',
  'i miss the green', 'is this canon', 'nevada mentioned', 'prop pills sponsor this?', 'my cousin had this one', 'this came out AFTER the console died??', 'who approved this',
  'they gave him a CHIN', 'ears under the hat confirmed', 'throw it at linda', 'bong count: yes', 'chat is he human now', 'HUMAN%?? whats that', 'the music slaps'];
function chatterTick() {
  if (WD.t % 400 !== 200 || WD.M.quiet) return;
  const r = Math.random();
  if (r < .22 && OBJ) tickChat(pick(CHATTERS2), pick(['go to ', 'objective says ', 'marker says ', 'uhh ']) + OBJ.text.toLowerCase());
  else if (r < .3 && C2.human >= 40) tickChat(pick(CHATTERS2), pick(['why is he wearing sunglasses', 'carl you ok??', 'thats not carl', 'bring back small carl', 'he stopped saying bro']));
  else if (r < .36 && C2.ep >= 2) tickChat('user_000', pick(['they are still waiting at the counter', 'below below', 'its ' + clock(), 'we can hear you', 'the tall ones say hi']));
  else tickChat(pick(CHATTERS2), pick(JUNK2));
}

// ---------------- drawing ----------------
function drawWorld() {
  cls(hex('#000000'));
  const ts = WD.ts, P = WD.P, x0 = Math.floor(camX / 16), y0 = Math.floor(camY / 16), under = WD.M.under || '.';
  const fr = (k, tx, ty) => { const a = ts.t[k]; if (!a) return null; if (a.length === 1) return a[0]; const off = k === '.' ? ((tx * 3 + ty * 5) & 3) : 0; return a[((WD.t >> (k === '~' ? 3 : 4)) + off) % a.length]; };
  for (let ty = y0; ty <= y0 + 15; ty++) for (let tx = x0; tx <= x0 + 21; tx++) {
    if (ty < 0 || tx < 0 || ty >= WD.h || tx >= WD.w) continue;
    const k = WD.grid[ty][tx], sx = tx * 16 - camX, sy = ty * 16 - camY;
    if (k === '#') { const below = tileAt(tx, ty + 1); draw(fr(below === '#' ? '#t' : '#f', tx, ty) || fr('#t', tx, ty), sx, sy, P); continue; }
    if ('Tto_=*x'.includes(k)) { const u = fr(under, tx, ty); if (u) draw(u, sx, sy, P); if (k === 'x') continue; }
    const s = fr(k, tx, ty) || fr('.', tx, ty); if (s) draw(s, sx, sy, P);
  }
  if (WD.M.drawUnder) WD.M.drawUnder();
  // pickups
  for (const p of WD.pick) {
    const x = p.x - camX, y = p.y - camY - 6 - Math.abs(Math.sin(p.t * .12)) * 3;
    if (p.k === 'bux') draw(CS.bux[(p.t >> 3) & 3], x - 5, y - 5, CP.item);
    else if (p.k === 'pretzel') draw(CS.pretzel, x - 6, y - 5, CP.item);
    else if (p.k === 'bong') { drawBong(p.b, x, y - 4); if ((p.t >> 3) & 1) text('!', x - 2, y - 22, hex(RARITY[p.b.rar])); }
    else if (p.k === 'tape') draw(CS.tape, x - 7, y - 4, CP.item);
  }
  // entities + player, y-sorted
  const list = WD.ents.filter(e => live(e) && (!e.haze || WD.haze > 0)).concat([{ isPL: 1, y: PL.y }]);
  list.sort((a, b) => (a.y + (a.zs || 0)) - (b.y + (b.zs || 0)));
  for (const e of list) { if (e.isPL) drawPlayer(); else drawEnt(e); }
  // shots
  for (const s of WD.shots) { const ic = bongIcon(s.b), fl = (s.spin >> 2) & 1; rectF(s.x - camX - 2, s.y - camY + 4, 4, 2, hex('#101010')); draw(ic.s, s.x - camX - ic.s.w / 2, s.y - camY - 6 - ic.s.h / 2, ic.P, fl); }
  for (const s of WD.eshots) drawEShot(s);
  // fx
  for (const f of WD.fx) {
    const x = f.x - camX, y = f.y - camY;
    if (f.k === 'spark') pset(x, y, f.c);
    else if (f.k === 'num' || f.k === 'txt') text(f.s, x - f.s.length * 3, y - (30 - Math.min(30, f.t)) * .4, f.c, BLACK);
    else if (f.k === 'ring') ringF(x, y, 30 - f.t * 2, f.c);
    else if (f.k === 'puff') { const r = 3 + (100 - f.t) * .06; rectA(x - r, y - r, r * 2, r * 2, hex('#b6dbb6'), Math.min(.35, f.t / 200)); }
  }
  if (WD.dark) drawDark();
  if (WD.haze > 0) { const a = Math.min(.14, WD.haze / 800); rectA(0, 0, W, H, hex('#6dff92'), a); }
  if (WD.M.drawOver) WD.M.drawOver();
}
function drawEnt(e) {
  if (e.draw) return e.draw(e);
  const s = entSprite(e); if (!s) return;
  const P = e.fl && (e.fl & 2) ? null : (e.P || s.P), sc = (e.T && e.T.scale) || e.scale || 1, z = e.z || 0;
  const x = e.x - camX, y = e.y - camY - z;
  if (e.kind === 'enemy' || e.kind === 'comp' || e.shadow) rectA(x - 6, e.y - camY - 2, 12, 3, BLACK, .35);
  if (sc !== 1) { if (P) drawScaled(s, x - s.w * sc / 2, y - s.h * sc, P, sc, e.flip); else drawScaledTint(s, x - s.w * sc / 2, y - s.h * sc, sc, WHITE); }
  else if (P) draw(s, x - s.w / 2, y - s.h, P, e.flip); else draw(s, x - s.w / 2, y - s.h, e.P || s.P || [], e.flip, WHITE);
  if (e.accused > 0 && (WD.t >> 3) & 1) text('!', x - 2, y - s.h * sc - 10, hex('#ffdb24'));
  if (e.argue > 0) text('#@!', x - 9, y - s.h * sc - 10, hex('#ff9224'));
  if (e.kind === 'enemy' && e.hp < e.maxhp && !e.boss) { rectF(x - 8, y - s.h * sc - 4, 16, 2, hex('#400000')); rectF(x - 8, y - s.h * sc - 4, 16 * Math.max(0, e.hp) / e.maxhp, 2, hex('#ff4949')); }
  if (e.talk && !e.noPrompt && interactTargetCache === e && !frozen2()) { text('B', x - 3, y - s.h - 12, UI.name); }
  if (e.label && Math.hypot(e.x - PL.x, e.y - PL.y) < 60) { const l = e.label; text(l, x - l.length * 3, y - s.h - (e.talk ? 22 : 12), UI.dim); }
}
let interactTargetCache = null;
function drawScaledTint(s, x, y, sc, c) { for (let j = 0; j < s.h * sc; j++) for (let i = 0; i < s.w * sc; i++) if (s.d[((j / sc) | 0) * s.w + ((i / sc) | 0)]) pset(x + i, y + j, c); }
function drawPlayer() {
  const human = PL.humanT > 0, dir = PL.dir, set = human ? CS.human : CS.carl, P = human ? CP.human : (F2('dreamgreen') ? CP.carlLegacy : CP.carl);
  const fr = PL.throwF > 0 || PL.swing > 0 ? 2 : PL.moving ? ((PL.f >> 3) & 1) : 0;
  const s = set[dir === 'l' ? 'r' : dir][fr], x = PL.x - camX, y = PL.y - camY;
  if (PL.inv > 0 && !human && (PL.inv >> 2) & 1 && PL.roll <= 0) return;
  rectA(x - 6, y - 2, 12, 3, BLACK, .4);
  if (PL.roll > 0) { const k = PL.roll; drawScaled(s, x - s.w * .45, y - s.h * .8 + (k & 4 ? 1 : 0), P, .9, dir === 'l'); return; }
  draw(s, x - s.w / 2, y - s.h + 1, P, dir === 'l');
  if (!human && PL.throwF > 6) drawBong(curBong(), x + PL.fx * 10, y - 12 + PL.fy * 4);
  if (human) { const bx = x + (dir === 'l' ? -12 : dir === 'r' ? 12 : 9), by = y - 20; rectF(bx - 1, by - (PL.swing > 0 ? 4 : 14), 3, 14, hex('#6dffff')); rectF(bx, by - (PL.swing > 0 ? 4 : 14), 1, 14, WHITE); }
  if (PL.holdC > 12 && PL.holdC < 60 && humanReady()) { const k = Math.min(1, (PL.holdC - 12) / 33); ringF(x, y - 12, 26 - k * 16, hex('#ffdb49')); }
}
function drawEShot(s) {
  const x = s.x - camX, y = s.y - camY;
  if (s.k === 'note') { rectF(x - 3, y - 3, 7, 7, hex('#ffdb49')); rectF(x - 2, y - 1, 5, 1, hex('#926d24')); }
  else if (s.k === 'net') { ringF(x, y, 4, WHITE); pset(x, y, WHITE); }
  else if (s.k === 'coupon') { rectF(x - 4, y - 2, 8, 5, hex('#ff92c8')); rectF(x - 3, y - 1, 2, 3, WHITE); }
  else { circF(x, y, 3, hex('#ff2424')); pset(x - 1, y - 1, WHITE); }
}
function drawDark() { // flashlight: everything outside a circle around Carl is dark
  const cx = PL.x - camX, cy = PL.y - camY - 10, R = WD.haze > 0 ? 130 : 78;
  for (let y = 0; y < H; y++) { const dy = y - cy, h = R * R - dy * dy; if (h <= 0) { rectA(0, y, W, 1, BLACK, .82); continue; } const w = Math.sqrt(h); rectA(0, y, Math.max(0, cx - w), 1, BLACK, .82); rectA(cx + w, y, W, 1, BLACK, .82); }
}
function drawHUD() {
  if (WD.M.noHud) return;
  rectA(0, 0, W, 12, BLACK, .65);
  text('COOL', 3, 3, hex('#92dbff'), 0); rectF(28, 4, 42, 5, hex('#102040')); rectF(28, 4, 42 * Math.max(0, C2.hp) / C2.maxhp, 5, C2.hp < C2.maxhp * .3 ? hex('#ff4949') : hex('#6dff92'));
  text('LV' + C2.lv, 74, 3, WHITE, 0);
  const hc = C2.human >= 70 ? hex('#ff9224') : C2.human >= 40 ? hex('#ffdb49') : hex('#6dff24');
  text('HUMAN ' + C2.human + '%', 96, 3, hc, 0);
  if (F2('power')) { rectF(164, 4, 30, 5, hex('#302000')); rectF(164, 4, 30 * C2.meter / 100, 5, C2.meter >= 100 ? ((WD.t >> 3) & 1 ? hex('#ffff92') : hex('#ffdb24')) : hex('#b6923a')); if (C2.meter >= 100 && PL.humanT <= 0) text('HOLD C', 164, 14, hex('#ffdb49')); }
  if (PL.humanT > 0) { rectF(164, 4, 30 * PL.humanT / 600, 5, hex('#6dffff')); }
  text('$' + C2.bux, 200, 3, hex('#6dff24'), 0);
  const b = curBong(); if (b) { drawBong(b, 238, 6); text(shortBong(b), 250, 3, hex(RARITY[b.rar]), 0); }
  if (WD.haze > 0) text('HAZE', 294, 14, hex('#6dff92'));
  const bz = WD.ents.find(e => e.boss && !e.dead && !e.gone && e.maxhp); if (bz) { rectA(60, 24, 200, 13, BLACK, .6); text(bz.name || 'BOSS', 64, 27, hex('#ff6d49'), 0); rectF(160, 28, 96, 5, hex('#301010')); rectF(160, 28, 96 * Math.max(0, bz.hp) / bz.maxhp, 5, hex('#ff6d49')); }
  // objective
  if (OBJ && !WD.M.noObj) {
    const t = objTarget(); let arrow = '';
    if (t) { const dx = t.x - PL.x, dy = t.y - PL.y; if (Math.hypot(dx, dy) > 20) arrow = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? '>' : '<') : (dy > 0 ? 'v' : '^'); }
    const s = OBJ.text.toUpperCase(); rectA(0, 12, s.length * 6 + 26, 10, BLACK, .45); text((arrow || '*') + ' ' + s, 3, 13, UI.name, 0);
  }
  if (typeof DELIV !== 'undefined' && !WD.M.noObj) { const d = DELIV.findIndex((q, i) => dq(i) === 1); if (d >= 0) { const s = '+ DELIVERY: ' + DELIV[d].name; rectA(0, 22, s.length * 6 + 6, 9, BLACK, .4); text(s, 3, 23, UI.dim, 0); } }
  // chat ticker
  const tk = WD.tick.slice(-4);
  tk.forEach((k, i) => { const y = H - 12 - (tk.length - i) * 9, s = (k.u + ': ' + k.m).toUpperCase().slice(0, 50); const w = s.length * 6 + 4; rectA(W - w - 2, y - 1, w, 9, BLACK, Math.min(.55, k.t / 60)); text(s, W - w, y, k.carl ? hex('#6dff24') : k.u === 'user_000' ? hex('#ff4949') : UI.dim, 0); });
  if (WD.laugh && WD.laugh.t > 0) ctext(WD.laugh.s, 30, hex('#ffffdb'));
  if (WD.note && WD.note.t > 0) { const L = wrapT(WD.note.s.toUpperCase(), 26); const h = L.length * 9 + 14; rectF(W - 170, 24, 164, h, hex('#ffdb6d')); rectF(W - 170, 24, 164, 3, hex('#dbb624')); text('NOTE:', W - 165, 29, hex('#924924'), 0); L.forEach((l, i) => text(l, W - 165, 38 + i * 9, hex('#492410'), 0)); }
  // interaction prompt
  interactTargetCache = null; if (!frozen2() && !PL.dead) { const it = interactTarget(); if (it) { interactTargetCache = it.sign ? null : it; if (it.sign) text('B: LOOK', PL.x - camX - 20, PL.y - camY - 34, UI.name); } }
}

// ---------------- the START menu ----------------
async function pauseMenu() {
  sfx('tick');
  for (;;) {
    const opts = ['BONGS', 'TAPES (' + C2.tapes.length + '/8)', 'STATUS', 'ASK CHAT', 'PRETZEL (' + C2.pretzels + ')', 'SAVE', 'QUIT TO TITLE', 'BACK'];
    const i = await choose(opts, { x: W - 132, y: 26, cancel: 1 });
    if (i === 0) { await bongMenu(); continue; }
    if (i === 1) { await tapeMenu2(); continue; }
    if (i === 2) { await statusScreen2(); continue; }
    if (i === 3) { await askChat2(); return; }
    if (i === 4) { if (C2.pretzels > 0 && C2.hp < C2.maxhp) { C2.pretzels--; C2.hp = Math.min(C2.maxhp, C2.hp + 10); sfx('get'); await say('CARL EATS A PRETZEL. STILL WARM. COMPOSURE +10.'); } else await C(C2.pretzels ? 'I\'m not hungry. I\'m full of composure.' : 'No pretzels. The pretzel stand is in the mall. Everything is in the mall.'); continue; }
    if (i === 5) { saveC2(); sfx('ok'); await say(F2('special') ? 'SAVED.' : pick(['GAME SAVED. THE COMMITTEE HAS BEEN NOTIFIED.', 'SAVED. THIS SAVE MAY BE USED IN A FUTURE SEQUEL.', 'GAME SAVED. YOUR PROGRESS IS NOW PROPERTY OF PRETEND CO.'])); continue; }
    if (i === 6) { const c = await ask('QUIT TO TITLE? (UNSAVED PROGRESS IS LOST. LIKE EVERYTHING.)', null, ['NO', 'YES']); if (c === 1) { await fadeOut(); run(titleScreen); return; } continue; }
    return;
  }
}
async function statusScreen2() {
  const pv = scene, t = Math.floor(C2.time / 3600), goal = OBJ ? OBJ.text : 'Nothing. Just vibes.';
  scene = { draw() {
    cls(hex('#101024')); panel(8, 8, W - 16, H - 16);
    draw(carlMood('n'), 20, 20, CP.carlPort); frameRect(19, 19, 50, 50, UI.edge);
    text('CARL', 78, 22, UI.name); text('(STILL NOT HIS NAME)', 110, 22, UI.dim);
    text('LV ' + C2.lv + '   COMPOSURE ' + C2.hp + '/' + C2.maxhp, 78, 36, UI.text);
    text('SPECIES  HUMAN(?) ' + C2.human + '%', 78, 48, C2.human >= 70 ? hex('#ff9224') : C2.human >= 40 ? hex('#ffdb49') : hex('#6dff24'));
    text('EPISODE ' + C2.ep + '   TAPES ' + C2.tapes.length + '/8', 78, 60, UI.text);
    text('BUX $' + C2.bux + '   BONGS ' + C2.bongs.length + '/8   KILLS ' + C2.kills, 20, 80, UI.text);
    text('TIME ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0') + '   TRANSFORMATIONS ' + C2.transforms + '   NOTES ' + C2.notes, 20, 92, UI.text);
    text('COMPANION: ' + (C2.comp === 'garf' ? 'JB GARFIELD' : C2.comp === 'bruce' ? 'BRUCE (A SHARK)' : 'NOBODY. JUST CHAT.'), 20, 104, UI.text);
    rectF(20, 118, W - 40, 1, UI.dim); text('GOAL', 20, 124, UI.name);
    wrapT(goal.toUpperCase(), 44).forEach((l, i) => text(l, 20, 136 + i * 11, UI.text));
    text(C2.human >= 70 ? 'HE LOOKS GREAT. THAT\'S THE PROBLEM.' : C2.human >= 40 ? 'HE KEEPS TOUCHING HIS JAW.' : 'STILL SMALL. STILL GREEN. STILL HIM.', 20, 190, UI.dim);
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = pv;
}
async function askChat2() {
  await C(pick(['Chat. Chat. What do I do.', 'Okay, chat, help me out here.', 'Chat, real talk. Where am I going?', 'Chat, I\'m asking for a friend. The friend is me.']), 'w');
  const msgs = []; for (let i = 0; i < 2 + rnd(2); i++) msgs.push({ u: pick(CHATTERS2), m: pick(JUNK2) });
  msgs.splice(1, 0, { u: pick(CHATTERS2), m: OBJ ? OBJ.text.toLowerCase() : 'idk just vibe' });
  if (C2.human >= 40) msgs.push({ u: pick(CHATTERS2), m: 'take the sunglasses off carl' });
  if (C2.ep >= 3) msgs.push({ u: 'user_000', m: pick(['they are at the counter', 'below below', 'keep talking']), d: 70 });
  await chat(msgs);
  await C(pick(['Okay. Somebody said something useful. I\'m not saying who.', 'Half of that was about my chin. The other half was fine.', 'Okay, yeah, I was gonna do that. I was already doing that.']));
}
