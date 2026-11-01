'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. the state, the body, the gun, the backups, the inventory, the doors =================
// MO is the save. it is also C3, so the CARL 3 world helpers (loadScene, F3, setF3) work on it unchanged.
const MOSAVE = 'mo_save', MOSUSPEND = 'mo_suspend';
let MO = null;
function newMO() {
  return { scene: 'steps', x: -3.4, z: 6.2, yaw: 0, flags: {}, hp: 12, nerve: 100, cap: 100, act: 1, gun: 6,
    inv: [{ id: 'ammo', n: 6 }, { id: 'lasagnaC', n: 1 }, { id: 'tape', n: 1 }], box: [{ id: 'coffee', n: 1 }], files: [], dead: {}, taken: {}, visited: {}, seenFoe: {},
    kills: 0, saves: 0, restores: 0, time: 0, mem: { mine: 0, face: 0, unk: 0 }, tank: 1, carTries: 0, diff: 1, weapon: 'gun', shot: 0, stalkT: 0,
    parcels: [], alibis: [], suspicion: 0, notes: [], route: [], deliveries: 0, stop: 0 };
}
const F = k => MO && MO.flags[k];
const setF = (k, v = 1) => { MO.flags[k] = v; };
// ---------------- composure and the voice ----------------
const vreg = () => MO.nerve >= 60 ? 0 : MO.nerve >= 30 ? 1 : 2;
const N = a => Array.isArray(a) ? a[Math.min(a.length - 1, vreg())] : a;
async function narr(...lines) { for (const l of lines) await say(N(l), NARR); }
const jb = s => say(s, 'JB');
function nerveDrop(n) { MO.nerve = Math.max(0, MO.nerve - n); }
function nerveGain(n) { MO.nerve = Math.min(MO.cap, MO.nerve + n); }
function setCap(c) { MO.cap = c; MO.nerve = Math.min(MO.nerve, c); }
const cond = () => MO.hp >= 8 ? 0 : MO.hp >= 4 ? 1 : 2;
const COND = ['FINE', 'CAUTION', 'DANGER'];
// difficulty: 0 WITH CREAM, 1 BLACK, 2 MONDAY. how hard they hit, how much they take, how many rounds are lying around
const DIFF = ['WITH CREAM', 'BLACK', 'MONDAY'], dk = () => (MO.diff === undefined ? 1 : MO.diff), dmgK = () => [.5, 1, 1.5][dk()], hpK = () => [.7, 1, 1.3][dk()], ammoK = () => [1.5, 1, .67][dk()];
// ---------------- items ----------------
const ITEM = {
  ammo: { name: '.38 ROUNDS', stack: 36, desc: ['Revolver rounds. Six makes a conversation.', 'Revolver rounds. I counted them twice.', 'Bullets.'] },
  lasagnaC: { name: 'COLD LASAGNA', stack: 4, heal: 4, desc: ['Cold lasagna. A crime, but not one I\'m here to solve. Heals a little. A microwave would make it a meal.', 'Cold lasagna. Still lasagna. Heals a little.', 'Food. Cold.'] },
  lasagnaH: { name: 'HOT LASAGNA', stack: 4, heal: 10, desc: ['Hot lasagna. The only thing in this building that was ever on my side. Heals a lot.', 'Hot lasagna. Heals a lot. I should eat it before I start talking to it.', 'Food. Hot. Helps.'] },
  coffee: { name: 'COFFEE', stack: 4, nerve: 35, desc: ['Coffee, black, in a paper cup. Steadies the hand and the sentences.', 'Coffee. For the hands.', 'Coffee.'] },
  tape: { name: 'BLANK TAPE', stack: 9, desc: ['A blank backup tape. The terminal in a safe room will copy me onto it.', 'A blank tape. Enough room on it for one of me.', 'A tape. For saving.'] },
  thuKey: { name: 'THURSDAY KEY', key: 1, desc: ['A brass key on a tag: THURSDAY. Opens the stacks.', 'THURSDAY. Somebody made Thursday a door.', 'A key. Thursday ward.'] },
  fuse: { name: 'MAIN FUSE', key: 1, desc: ['A main fuse, ceramic, heavy as an alibi.', 'A big fuse.', 'Fuse.'] },
  deskKey: { name: 'DESK KEY', key: 1, desc: ['A small key that lived under a kettle. Director\'s desk, if I had to bet.', 'A desk key. From under a kettle I knew where to find.', 'A key.'] },
  dirCard: { name: 'DIRECTOR\'S CARD', key: 1, desc: ['DIRECTOR. AUTHORIZATION 1 OF 3.', 'The director\'s card. One of three.', 'Card. One of three.'] },
  card41: { name: 'SUBJECT 41 CARD', key: 1, desc: ['SUBJECT 41. My face on it. It doesn\'t say which of me.', 'SUBJECT 41. It has my picture. I didn\'t sit for it.', 'My card. Their card.'] },
  otisCard: { name: 'OTIS\'S CARD', key: 1, desc: ['O. KEEL, TECHNICIAN. Warm. Somebody had been carrying it.', 'Otis\'s card. The double had it.', 'Otis. Card.'] },
  shells: { name: '12-GA SHELLS', stack: 16, desc: ['Shotgun shells. Each one an argument with no counterpoint.', 'Shells. Count them.', 'Shells.'] },
  shotgun: { name: 'SHOTGUN', desc: ['A pump shotgun from the security rack. Holds four. USE it to carry it instead of the revolver, and again to switch back.', 'The shotgun. Four shells. USE to switch.', 'Shotgun. USE to switch.'] },
  stairKey: { name: 'STAIRWELL KEY', key: 1, desc: ['A key on a red tag: STAIRS - 2F. Upstairs was sealed after something they called the Monday incident.', 'Stairwell key. 2F.', 'Stairs. 2F.'] },
  film1: { name: 'FILM CAN (A)', key: 1, desc: ['A film can. The label\'s scratched off, but the leader is readable. (EXAMINE it in FILES.)', 'Film. Part of something.', 'Film.'] },
  film2: { name: 'FILM CAN (B)', key: 1, desc: ['A film can, dented. Somebody dropped it running.', 'Film. Part of something.', 'Film.'] },
  film3: { name: 'FILM CAN (C)', key: 1, desc: ['A film can that smells like a cigarette in the rain.', 'Film. Part of something.', 'Film.'] },
  windKey: { name: 'WINDING KEY', key: 1, desc: ['A brass winding key with frost still in the teeth. The master clock\'s.', 'The clock key.', 'Clock key.'] },
  maggie: { name: 'REEL: M. KEEL', key: 1, desc: ['A small reel in a paper sleeve. KEEL, MARGARET. KEPT 1986. Somebody had written "Maggie" on the sleeve, and "Mondays."', 'Margaret Keel. Kept 1986.', 'Maggie.'] },
  reel: { name: 'THE ORIGINAL', key: 1, desc: ['SUBJECT 41 MASTER. The first copy of whoever I am.', 'The master reel. Lighter than I thought.', 'The original.'] },
};
const invCount = id => MO.inv.filter(s => s.id === id).reduce((n, s) => n + s.n, 0);
const invHas = id => invCount(id) > 0;
function invAdd(id, n = 1, list = MO.inv, slots = 8) {
  const st = ITEM[id].stack || 1, pouch = list === MO.inv && ITEM[id].key;
  for (const s of list) if (s.id === id && s.n < st) { const k = Math.min(n, st - s.n); s.n += k; n -= k; if (!n) return 0; }
  while (n > 0 && (pouch || (list === MO.inv ? invItems().length : list.length) < slots)) { const k = Math.min(n, st); list.push({ id, n: k }); n -= k; }
  return n;
}
function invTake(id, n = 1, list = MO.inv) {
  for (let i = list.length - 1; i >= 0 && n > 0; i--) if (list[i].id === id) { const k = Math.min(n, list[i].n); list[i].n -= k; n -= k; if (!list[i].n) list.splice(i, 1); }
}
const invItems = (keys = false) => MO.inv.filter(s => !!ITEM[s.id].key === keys);
const invFree = () => Math.max(0, 8 - invItems().length);
const fitsIn = (id, n) => { if (ITEM[id].key) return true; const st = ITEM[id].stack || 1; let room = invFree() * st; for (const s of MO.inv) if (s.id === id) room += st - s.n; return room >= n; };
// ---------------- the body ----------------
Object.assign(CARL, { aim: 0, aimT: 0, aimAt: null, target: null, fire: 0, sap: 0, qt: 0, reload: 0, kb: null, dead: 0 });
const BODY = { step: 0 };
function playerUpdate() {
  const C = CARL, c = cond(), mul = [1, .82, .62][c];
  if (C.kb) { const nx = C.p[0] + C.kb[0], nz = C.p[2] + C.kb[1]; if (walkable(nx, C.p[2])) C.p[0] = nx; if (walkable(C.p[0], nz)) C.p[2] = nz; C.kb[0] *= .8; C.kb[1] *= .8; if (Math.abs(C.kb[0]) + Math.abs(C.kb[1]) < .004) C.kb = null; }
  if (C.inv > 0) C.inv--; if (C.fire > 0) C.fire--; if (C.sap > 0) { C.sap--; if (C.sap === 12) sapHit(); }
  if (C.reload > 0) { C.reload--; if (C.reload === 0) finishReload(); }
  if (C.qt > 0) { C.yaw += Math.PI / 10; C.qt--; C.moving = 0; return; }
  if (!held.up && !held.down && !held.left && !held.right) C.moveInput = C.moveAxes = null;
  C.aim = held.c && !C.reload ? 1 : 0;
  if (C.aim) {
    C.moving = 0; acquireTarget();
    if (C.target && (pressed.left || pressed.right)) cycleTarget(pressed.right ? 1 : -1);
    if (C.target && MO.weapon === 'gun' && !C.fire && !C.sap) {
      C.aimT = C.aimAt === C.target.id ? Math.min(60, (C.aimT || 0) + 1) : 1; C.aimAt = C.target.id;
    } else { C.aimT = 0; C.aimAt = null; }
    if (C.target) { const ty = Math.atan2(C.target.p[0] - C.p[0], C.target.p[2] - C.p[2]); let dy = ty - C.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; C.yaw += dy * .25; }
    else C.yaw += ((held.right ? 1 : 0) - (held.left ? 1 : 0)) * .05;
    if (pressed.a) fire(); else if (pressed.b) swingSap();
    const rc = C.fire > 14 ? -.5 : 0, sw = C.sap ? -2.6 + (18 - C.sap) * .14 : null;
    C.pose = { armR: sw !== null ? sw : -1.5 + rc, armL: sw !== null ? -.3 : -1.25 + rc * .6, legL: .1, legR: -.1, headYaw: 0 }; C.bob = 0;
    return;
  }
  C.aimT = 0; C.aimAt = null;
  let fwd = 0;
  if (MO.tank) {
    C.moveInput = C.moveAxes = null;
    if (pressed.b && held.down) { C.qt = 10; sfx('step'); return; }
    C.yaw += ((held.right ? 1 : 0) - (held.left ? 1 : 0)) * .068;
    fwd = held.up ? 1 : held.down ? -.55 : 0;
    const run = held.b && fwd > 0 ? 1.8 : 1, sp = .047 * run * mul * fwd;
    if (fwd) { const nx = C.p[0] + Math.sin(C.yaw) * sp, nz = C.p[2] + Math.cos(C.yaw) * sp, stk = !walkable(C.p[0], C.p[2]); if (stk || walkable(nx, C.p[2])) C.p[0] = nx; if (stk || walkable(C.p[0], nz)) C.p[2] = nz; C.walk += .2 * run * Math.sign(fwd); }
  } else {
    const ix = (held.right ? 1 : 0) - (held.left ? 1 : 0), iy = (held.up ? 1 : 0) - (held.down ? 1 : 0), input = ix + 1 + (iy + 1) * 3;
    // Keep a held direction through a camera cut; releasing it adopts the new view.
    if (!ix && !iy) C.moveInput = C.moveAxes = null;
    else if (C.moveInput !== input || !C.moveAxes) {
      const cam = WX.bg.cam, fx = Math.hypot(cam.f[0], cam.f[2]) || 1;
      C.moveInput = input; C.moveAxes = [cam.f[0] / fx, cam.f[2] / fx, cam.r[0], cam.r[2]];
    }
    const a = C.moveAxes || [0, 0, 0, 0]; let mx = a[0] * iy + a[2] * ix, mz = a[1] * iy + a[3] * ix; const ml = Math.hypot(mx, mz);
    if (ml > 0) { fwd = 1; mx /= ml; mz /= ml; const ty = Math.atan2(mx, mz); let dy = ty - C.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; C.yaw += dy * .3; const run = held.b ? 1.8 : 1, sp = .047 * run * mul, nx = C.p[0] + mx * sp, nz = C.p[2] + mz * sp, stk = !walkable(C.p[0], C.p[2]); if (stk || walkable(nx, C.p[2])) C.p[0] = nx; if (stk || walkable(C.p[0], nz)) C.p[2] = nz; C.walk += .2 * run; }
  }
  C.moving = fwd !== 0;
  if (!C.moving) C.walk *= .8;
  const sw = Math.sin(C.walk) * .8, limp = c === 2 ? .35 : 0;
  C.pose = { armL: -sw - limp, armR: sw, legL: sw, legR: -sw * (1 - limp), headYaw: c === 2 ? Math.sin(WX.t * .05) * .1 : 0 };
  C.bob = C.moving ? Math.abs(Math.sin(C.walk)) * .03 : Math.sin(WX.t * .05) * .006;
  if (C.moving && (++BODY.step % (held.b ? 14 : 22)) === 0) sfx('step');
}
// ---------------- the revolver and the sap ----------------
const foes = () => WX.ents.filter(e => e.kind === 'foe' && live3(e) && !e.dying);
function acquireTarget() {
  const C = CARL; let best = null, bd = 1e9;
  for (const e of foes()) { if (e.untargetable) continue; const dx = e.p[0] - C.p[0], dz = e.p[2] - C.p[2], d = Math.hypot(dx, dz); if (d > 11) continue; let da = Math.atan2(dx, dz) - C.yaw; while (da > Math.PI) da -= 6.2832; while (da < -Math.PI) da += 6.2832; if (Math.abs(da) > .75) continue; const sc = d + Math.abs(da) * 4; if (sc < bd) { bd = sc; best = e; } }
  if (!C.target || !live3(C.target) || C.target.dying || dist2(C.target.p, C.p) > 11 || !foes().includes(C.target)) C.target = best;
  else if (best && best !== C.target && bd < 2) C.target = best;
}
// LEFT/RIGHT while aiming: next foe in range that way round, wrapping to the far side
function cycleTarget(dir) {
  const C = CARL, rel = e => { let da = Math.atan2(e.p[0] - C.p[0], e.p[2] - C.p[2]) - C.yaw; while (da > Math.PI) da -= 6.2832; while (da < -Math.PI) da += 6.2832; return da * dir; };
  const list = foes().filter(e => e !== C.target && !e.untargetable && dist2(e.p, C.p) <= 11).sort((a, b) => rel(a) - rel(b));
  if (!list.length) return;
  C.target = list.find(e => rel(e) > 0) || list[0]; sfx('tick');
}
const hitChance = d => Math.max(.3, Math.min(.98, Math.max(.45 + .55 * (MO.nerve / 100), .45 + .4 * ((CARL.aimT || 0) / 60)) - Math.max(0, d - 5) * .05));
function fire() {
  const C = CARL; if (C.fire > 0 || C.reload) return;
  if (MO.weapon === 'shot') return fireShot();
  if (MO.gun <= 0) { if (invHas('ammo')) startReload(); else { sfx('empty'); C.fire = 18; if (!WX.toldEmpty) { WX.toldEmpty = 1; wstory(() => narr(['Empty. The sap is still in my coat: hold C and press X.', 'Empty. Sap. C and X.', 'Empty. Sap.'])); } } return; }
  MO.gun--; C.fire = 22; sfx('gun'); post.flash = .22; WX.shake = 6; WX.muzzle = 3;
  for (const e of foes()) e.aggro = 1;
  const t = C.target;
  if (t) { const d = dist2(t.p, C.p); if (Math.random() < hitChance(d)) hitFoe(t, Math.random() < .12 ? 4 : 2, Math.atan2(t.p[0] - C.p[0], t.p[2] - C.p[2])); else WX.fx.push({ k: 'spark', p: [t.p[0] + (Math.random() - .5) * 1.5, 1 + Math.random(), t.p[2] + (Math.random() - .5)], c: hex('#ffd890'), t: 6 }); }
  C.aimT = 0;
  if (MO.gun === 0 && invHas('ammo')) C.reloadNext = 1;
}
function startReload() { CARL.aimT = 0; CARL.aimAt = null; CARL.reload = MO.weapon === 'shot' ? 70 : 46; sfx('reload'); }
function finishReload() { if (MO.weapon === 'shot') { const n = Math.min(4 - MO.shot, invCount('shells')); invTake('shells', n); MO.shot += n; return; } const n = Math.min(6 - MO.gun, invCount('ammo')); invTake('ammo', n); MO.gun += n; }
// the shotgun: no aim roll, a cone, everything in it gets the news. close is worse
function fireShot() {
  const C = CARL;
  if (MO.shot <= 0) { if (invHas('shells')) startReload(); else { sfx('empty'); C.fire = 18; } return; }
  MO.shot--; C.fire = 44; sfx('shotgun'); post.flash = .35; WX.shake = 12; WX.muzzle = 5;
  for (const e of foes()) e.aggro = 1;
  for (const e of foes()) { const dx = e.p[0] - C.p[0], dz = e.p[2] - C.p[2], d = Math.hypot(dx, dz) - (e.block > 1 ? e.block : 0); let da = Math.atan2(dx, dz) - C.yaw; while (da > Math.PI) da -= 6.2832; while (da < -Math.PI) da += 6.2832; if (d < 9 && Math.abs(da) < .5) hitFoe(e, d < 2.5 ? 5 : d < 5 ? 3 : 1, Math.atan2(dx, dz), d < 5 ? 52 : 20); }
  if (MO.shot === 0 && invHas('shells')) C.reloadNext = 1;
}
function swingSap() { if (CARL.sap || CARL.fire) return; CARL.aimT = 0; CARL.aimAt = null; CARL.sap = 18; sfx('sap'); }
function sapHit() {
  const C = CARL;
  for (const e of foes()) { const dx = e.p[0] - C.p[0], dz = e.p[2] - C.p[2], d = Math.hypot(dx, dz); let da = Math.atan2(dx, dz) - C.yaw; while (da > Math.PI) da -= 6.2832; while (da < -Math.PI) da += 6.2832; if (d - (e.block > 1 ? e.block : 0) < 1.45 && Math.abs(da) < .95) { hitFoe(e, 1, Math.atan2(dx, dz), 44); sfx('thud'); return; } }
}
function hitFoe(e, dmg, ang, stag) {
  if (e.cueAt) { e.cueAt = null; e.aggro = 1; }
  if (e.stalker && !e.leaving && e.hp - dmg <= e.hp0 - 4) { e.hp -= dmg; e.flashT = 6; e.leaving = 70; sfx('glitch'); return; }
  if (e.onHit && e.onHit(e, dmg) === false) return;
  e.flashT = 6; e.aggro = 1;
  if (!(e.armor > 0)) { e.stag = stag || (dmg >= 4 ? 40 : 24); e.kb = [Math.sin(ang) * .07, Math.cos(ang) * .07]; e.wind = 0; e.armor = e.stag + (e.boss ? 80 : 46); }   // after a stagger it shrugs off the next few hits
  if (e.type === 'loop') { sfx('thud'); return; }
  e.hp -= dmg; sfx('thud'); if (dmg >= 4) WX.fx.push({ k: 'txt', s: '!', p: [e.p[0], 2.1, e.p[2]], c: hex('#ff3a2a'), t: 30, vy: .01 });
  if (e.hp <= 0) killFoe(e);
}
function killFoe(e) {
  e.dying = 1; e.dt = 0; e.block = 0; sfx('shriek');
  if (e.persist !== false) { MO.dead[e.id] = 1; MO.kills++; nerveDrop(3); }
  if (e.onDie) e.onDie(e);
  if (MO.kills === 1 && !F('firstKill')) { setF('firstKill'); wstory(() => narr(['It came apart like a bad memory. I told myself that\'s all it was.', 'It came apart. I told myself it was a memory. I told myself twice.', 'It stopped.'])); }
}
// ---------------- the backups ----------------
const FOE = {
  drifter: { hp: 5, sp: .019, reach: 1.05, dmg: 2, wind: 30, cd: 70, sense: 6.5, block: .34 },
  loop: { hp: 999, sp: .02, reach: .8, dmg: 1, wind: 0, cd: 60, sense: 0, block: .34 },
  double: { hp: 8, sp: .036, reach: 1.15, dmg: 3, wind: 18, cd: 46, sense: 99, block: .34 },
  crawler: { hp: 3, sp: .028, reach: .95, dmg: 2, wind: 14, cd: 50, sense: 7, block: .3 },
};
function foe(id, type, x, z, o = {}) {
  const d = FOE[type];
  const hp = type === 'loop' ? d.hp : Math.max(1, Math.round(d.hp * hpK()));
  return Object.assign({ id, kind: 'foe', type, at: [x, 0, z], hp, hp0: hp, stag: 0, cd: 0, windT: 0, wind: 0, aggro: 0, walk: 0, seed: (id.length * 13) % 97, block: d.block, noShadow: 0, shadow: type === 'crawler' ? .35 : .45,
    model: type === 'double' ? MOM.double : type === 'loop' ? MOM.loop : type === 'crawler' ? MOM.crawler : MOM.drifter, cond: () => !MO.dead[id], upd: foeUpdate, draw3: drawFoe }, o);
}
function walkFoe(x, z, e) {
  const sc = WX.sc, r = .3; let ok = false; for (const w of sc.walk) if (x >= w[0] + r && x <= w[2] - r && z >= w[1] + r && z <= w[3] - r) { ok = true; break; } if (!ok) return false;
  for (const s of sc.solids) if (x > s[0] - r && x < s[2] + r && z > s[1] - r && z < s[3] + r) return false;
  for (const o of WX.ents) if (o !== e && o.block && live3(o) && !o.dying && Math.hypot(x - o.p[0], z - o.p[2]) < o.block + r) return false;
  return Math.hypot(x - CARL.p[0], z - CARL.p[2]) > .55;
}
function turnTo(e, a, k = .15) { let dy = a - e.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; e.yaw += dy * k; }
function stepToward(e, tx, tz, sp) {
  const a0 = Math.atan2(tx - e.p[0], tz - e.p[2]);
  for (const off of [0, .5, -.5, 1.1, -1.1, 1.7, -1.7]) { const a = a0 + off, nx = e.p[0] + Math.sin(a) * sp, nz = e.p[2] + Math.cos(a) * sp; if (walkFoe(nx, nz, e)) { e.p[0] = nx; e.p[2] = nz; turnTo(e, a); e.walk += sp * 6; return true; } }
  turnTo(e, a0); return false;
}
function foeUpdate(e) {
  if (e.dying) { e.dt++; if (e.dt > 50) e.gone = 1; return; }
  if (e.flashT > 0) e.flashT--; if (e.armor > 0) e.armor--;
  const D = FOE[e.type], dx = CARL.p[0] - e.p[0], dz = CARL.p[2] - e.p[2], d = Math.hypot(dx, dz), toJB = Math.atan2(dx, dz);
  if (e.stag > 0) { e.stag--; if (e.kb) { const nx = e.p[0] + e.kb[0], nz = e.p[2] + e.kb[1]; if (walkFoe(nx, nz, e)) { e.p[0] = nx; e.p[2] = nz; } e.kb[0] *= .85; e.kb[1] *= .85; } e.pose = { armL: -.4, armR: -.2, legL: .3, legR: -.3, headYaw: .4 }; return; }
  if (e.cd > 0) e.cd--;
  if (CARL.dead || WX.calm) { e.pose = { armL: -.2, armR: -.2 }; return; }
  if (e.type === 'loop') {
    const P = e.routine ? e.routine(e) : e.path, q = P[e.pi || 0]; if (Math.hypot(q[0] - e.p[0], q[1] - e.p[2]) < .2) e.pi = ((e.pi || 0) + 1) % P.length;
    const a = Math.atan2(q[0] - e.p[0], q[1] - e.p[2]), nx = e.p[0] + Math.sin(a) * D.sp, nz = e.p[2] + Math.cos(a) * D.sp;
    if (Math.hypot(nx - CARL.p[0], nz - CARL.p[2]) > .55) { e.p[0] = nx; e.p[2] = nz; e.walk += D.sp * 6; } turnTo(e, a, .2);
    if (d < D.reach && e.cd === 0) { e.cd = D.cd; hurtJB(D.dmg, e, .2); sfx('groan'); }
    const sw = Math.sin(e.walk) * .6; e.pose = { armL: -sw * .4, armR: sw * .4, legL: sw, legR: -sw, headYaw: 0 }; return;
  }
  if (e.stalker && !e.leaving && (e.life = (e.life || 0) + 1) > 60 * 40) e.leaving = 90;   // he loses interest eventually
  if (e.leaving) { e.cueAt = null; e.leaving--; stepToward(e, e.p[0] - dx, e.p[2] - dz, D.sp * 1.2); if (e.leaving <= 0) { e.gone = 1; setF('dblAway_' + WX.id); if (e.stalker) MO.stalkT = 60 * 80; } return; }
  if (e.type === 'double' && e.cueAt) {
    if (!line(0) || F('servicePower')) e.cueAt = null;
    else {
      setF('doubleDistracted');
      if (Math.hypot(e.cueAt[0] - e.p[0], e.cueAt[1] - e.p[2]) > .4 && e.cueTravel > 0) {
        e.cueTravel--; stepToward(e, e.cueAt[0], e.cueAt[1], D.sp);
        const sw = Math.sin(e.walk) * .55; e.pose = { armL: -sw * .8, armR: sw * .8, legL: sw, legR: -sw };
      } else {
        turnTo(e, 0, .2); e.pose = { armL: -.2, armR: -.15, headYaw: 0 };
        if (--e.cueHold <= 0) e.cueAt = null;
      }
      return;
    }
  }
  if (e.wind > 0) { e.wind--; turnTo(e, toJB, .2); e.pose = e.type === 'crawler' ? { armL: -2.4, armR: -2.4 } : { armL: -2.6, armR: -2.6, legL: .2, legR: -.2 }; if (e.wind === 0) { e.cd = D.cd; if (d < D.reach + .35) hurtJB(D.dmg, e, .16); } return; }
  if (!e.aggro && d < D.sense) { e.aggro = 1; if (e.type === 'drifter') sfx('groan'); }
  if (e.aggro) {
    if (d < D.reach && e.cd === 0) { e.wind = D.wind; return; }
    if (e.type === 'double' && !e.boss && e.hp <= e.hp0 - 4) { e.leaving = 70; sfx('glitch'); return; }
    if (e.type === 'double' && d > 3.2 && (WX.t + e.seed) % 150 === 0) { const a = toJB, nx = e.p[0] + Math.sin(a) * 1.6, nz = e.p[2] + Math.cos(a) * 1.6; if (walkFoe(nx, nz, e)) { e.p[0] = nx; e.p[2] = nz; sfx('glitch'); e.blink = 6; } }
    const g = WX.sc.steer && WX.sc.steer(e); if (d > D.reach * .8) stepToward(e, g ? g[0] : CARL.p[0], g ? g[1] : CARL.p[2], D.sp * (e.type === 'drifter' && d < 3 ? 1.25 : 1));
    const sw = Math.sin(e.walk) * .55; e.pose = e.type === 'crawler' ? { armL: -1.6 + sw, armR: -1.6 - sw, headYaw: Math.sin(WX.t * .2 + e.seed) * .2 } : e.type === 'double' ? { armL: -sw * .8, armR: sw * .8, legL: sw * 1.3, legR: -sw * 1.3 } : { armL: -1.3 + sw * .2, armR: -1.2 - sw * .2, legL: sw, legR: -sw, headYaw: Math.sin(WX.t * .07 + e.seed) * .3 };
  } else { e.pose = { armL: -.2, armR: -.15, headYaw: Math.sin(WX.t * .02 + e.seed) * .5 }; e.yaw += Math.sin(WX.t * .01 + e.seed) * .004; }
}
function hurtJB(dmg, src, kb = .12) {
  if (CARL.inv > 0 || CARL.dead || WX.calm) return;
  dmg = Math.max(1, Math.round(dmg * dmgK())); MO.hp = Math.max(0, MO.hp - dmg); nerveDrop(7); CARL.inv = 60; WX.redT = 12; WX.shake = 10; sfx('hurt'); CARL.sap = 0; CARL.fire = 0; CARL.aimT = 0;
  const a = Math.atan2(CARL.p[0] - src.p[0], CARL.p[2] - src.p[2]); CARL.kb = [Math.sin(a) * kb, Math.cos(a) * kb];
  if (MO.hp <= 0) { CARL.dead = 1; wstory(deathSeq); }
}
// the backups drawn: glitching, gray, flashing white when hit. out of the beam in a dark room they're only a shape
function drawFoe(e) {
  const C = CARL; if (e.blink > 0) { e.blink--; if (e.blink & 1) return; }
  let light = liveLight(WX.sc, e.p);
  if (WX.bg.dark) { const dx = e.p[0] - C.p[0], dz = e.p[2] - C.p[2], d = Math.hypot(dx, dz); let da = Math.atan2(dx, dz) - C.yaw; while (da > Math.PI) da -= 6.2832; while (da < -Math.PI) da += 6.2832; const lit = d < 1.6 || (d < 7 && Math.abs(da) < .55); light = lit ? { amb: [.7, .7, .7], dir: v3.norm([-dx, .6, -dz]), dcol: [.6, .6, .6], tint: [0, 0, 0] } : { amb: [.09, .09, .09], dir: [0, 1, 0], dcol: [0, 0, 0], tint: [0, 0, 0] }; }
  const dy = e.dying ? Math.min(1, e.dt / 30) : 0, glitch = e.type === 'loop' ? .1 : e.dying ? .9 : e.type === 'double' ? .25 : .35;
  if (e.dying && e.dt > 30 && (e.dt & 1)) return;
  drawGlitch(entModel(e) || e.model, { p: [e.p[0], -dy * .9, e.p[2]], yaw: e.yaw, pose: e.pose, s: e.s, seed: e.seed, flash: e.flashT > 0 && (e.flashT & 2) }, light, glitch);
}
// ---------------- interaction: doors, things to look at, pickups ----------------
const doorE = (id, x, z, label, to, tx, tz, tyaw, o = {}) => Object.assign({ id, kind: 'door', to, at: [x, 0, z], label, range: 1.6, talk: () => useDoor(Object.assign({ to, x: tx, z: tz, yaw: tyaw }, o)) }, o.ent || {});
const lookE = (id, x, z, label, fn, o = {}) => Object.assign({ id, kind: 'look', at: [x, 0, z], label, range: o.range || 1.5, talk: typeof fn === 'function' ? fn : () => narr(fn) }, o);
const itemE = (id, item, n, x, z, o = {}) => Object.assign({ id, kind: 'item', item, n: item === 'ammo' || item === 'shells' ? Math.max(1, Math.round(n * ammoK())) : n, at: [x, o.y || 0, z], label: ITEM[item].name, range: 1.25, cond: () => !MO.taken[id] && (!o.if || o.if()), talk: e => pickup(e), draw3: drawItem }, o);
async function pickup(e) {
  const it = ITEM[e.item];
  if (!fitsIn(e.item, e.n)) { sfx('empty'); return narr(['Too much in my coat already. I could leave something in a safe room\'s locker.', 'No room. The locker in a safe room takes things.', 'No room.']); }
  invAdd(e.item, e.n); MO.taken[e.id] = 1; sfx(it.key ? 'get' : 'ok');
  await say('PICKED UP ' + (e.n > 1 ? e.n + ' ' : '') + it.name + '.', null);
  if (e.after) await e.after(e);
}
function drawItem(e) {
  const sp = project(LIVE.cam, [e.p[0], e.p[1] + .25, e.p[2]]); if (!sp) return;
  const M = MOM[{ ammo: 'ammo', shells: 'shells', shotgun: 'shotgun', lasagnaC: 'lasagna', lasagnaH: 'lasagna', coffee: 'coffee', tape: 'tape', fuse: 'fuse', reel: 'reel', maggie: 'reel', film1: 'film', film2: 'film', film3: 'film', thuKey: 'key', deskKey: 'key', stairKey: 'key', windKey: 'key' }[e.item] || 'card'];
  drawGlitch(M, { p: [e.p[0], e.p[1] + .02, e.p[2]], yaw: WX.t * .02 }, { amb: [.8, .8, .8], dir: v3.norm([-.4, 1, -.5]), dcol: [.5, .5, .5], tint: [0, 0, 0] }, 0);
  if (((WX.t + e.id.length * 9) % 90) < 16) { const k = ((WX.t + e.id.length * 9) % 90) / 16, r = 2 + Math.sin(k * 3.14) * 3; lineF(sp[0] - r, sp[1] - 4, sp[0] + r, sp[1] - 4, hex('#ffffff')); lineF(sp[0], sp[1] - 4 - r, sp[0], sp[1] - 4 + r, hex('#ffffff')); }
}
// ---------------- doors: the slow walk through ----------------
async function useDoor(d) {
  if (d.lock) { const ok = await d.lock(); if (!ok) return; }
  const following = foes().some(e => e.stalker && !e.leaving && !e.cueAt);
  await doorAnim(d.kind || 'wood');
  enterRoom(d.to, d.x, d.z, d.yaw);
  scene = moWorld;
  if (SCENES[d.to].onEnter) await SCENES[d.to].onEnter();
  stalkDoor(following, [d.x, d.z]);
}
// Act II: after the security footage the double walks the building too. if he was in the room you left, he comes through after you
const stalkOn = () => MO.act === 2 && F('footage') && !F('dblBoss') && !F('showOn');
function stalkDoor(following, at) {
  if (!stalkOn() || WX.sc.safe || WX.sc.noStalk || WX.calm || foes().some(e => e.type === 'double')) return;
  if (following || (F('dblFirst') && MO.stalkT <= 0 && Math.random() < .4)) WX.stalk = { t: WX.t + (following ? 150 : 260 + rnd(200)), at };
}
function stalkTick() {
  if (MO.stalkT > 0) MO.stalkT--;
  if (!WX.stalk || WX.t < WX.stalk.t || frozen3()) return;
  const at = WX.stalk.at; if (Math.hypot(at[0] - CARL.p[0], at[1] - CARL.p[2]) < 1.8) { WX.stalk.t = WX.t + 40; return; }
  WX.stalk = null; if (!stalkOn() || WX.calm) return;
  sfx('creak'); sfx('static'); MO.stalkT = 60 * 25;
  addEnt3(foe('stalk' + WX.t, 'double', at[0], at[1], { persist: false, cond: null, aggro: 1, stalker: 1 }));
  if (!F('stalkSeen')) { setF('stalkSeen'); wstory(() => narr(['The door behind me opened on its own schedule. He came through it like he\'d been invited. (Hurt him enough and he backs off. For a while.)', 'The door behind me. Him. (Hurt him and he backs off.)', 'Him. Again. (Hurt him. He leaves.)'])); }
}
function enterRoom(id, x, z, yaw) {
  CARL.moveInput = CARL.moveAxes = null; CARL.aimT = 0; CARL.aimAt = null;
  WX.calm = 0; WX.boss = null; WX.stalk = null; loadScene(id, x, z, yaw); MO.visited[id] = 1; WX.banner = { s: SCENES[id].title || '', t: 110 };
  CARL.kb = null; CARL.qt = 0; CARL.target = null; WX.toldEmpty = 0;
}
async function doorAnim(kind) {
  const prev = scene, slide = kind === 'lift', glass = kind === 'glass', T = slide ? 120 : 80; let t = 0, skip = 0;
  const L = { amb: [.36, .36, .36], dir: v3.norm([-.3, .5, -.8]), dcol: [.5, .5, .5], tint: [0, 0, 0] };
  const side = mesh('box:3.4:4:.3'), head = mesh('box:1.2:1.6:.3'), slab = shift('box:1.1:2.3:.08', .55, 0, 0), half = mesh('box:.55:2.3:.08'), knob = mesh('box:.07:.07:.12');
  sfx(slide ? 'lift' : 'creak');
  scene = { update() { t++; if (t > 20 && (pressed.a || pressed.b)) skip = 1; }, draw() {
    cls(hex('#000000')); ZD.fill(0); const k = Math.min(1, t / T), cz = -2.4 + Math.max(0, k - .45) * 4.6;
    LIVE.cam = mkCam([0, 1.25, cz], [0, 1.15, 4], .95); LIVE.ox = 0; LIVE.oy = 0; LIVE.clip = null;
    const op = slide ? Math.min(1, Math.max(0, (k - .55) * 3)) : Math.min(1, Math.max(0, (k - .12) * 2.2));
    for (let y = 60; y < 170; y++) { const g = Math.max(0, 1 - Math.abs(y - 112) / 60) * op * (glass ? 60 : 34); rectF(140, y, 40, 1, rgb(g, g, g)); }
    drawMeshLive(side, { p: [-2.3, 0, .1], yaw: 0 }, [73, 73, 73], L); drawMeshLive(side, { p: [2.3, 0, .1], yaw: 0 }, [73, 73, 73], L); drawMeshLive(head, { p: [0, 2.35, .1], yaw: 0 }, [73, 73, 73], L);
    const col = slide ? [146, 146, 146] : glass ? [90, 90, 90] : [110, 110, 110];
    if (slide) { drawMeshLive(half, { p: [-.28 - op * .56, 0, 0], yaw: 0 }, col, L); drawMeshLive(half, { p: [.28 + op * .56, 0, 0], yaw: 0 }, col, L); }
    else { drawMeshLive(slab, { p: [-.55, 0, 0], yaw: -op * 1.75 }, col, L); const a = -op * 1.75; drawMeshLive(knob, { p: [-.55 + Math.cos(a) * .95, 1.05, -Math.sin(a) * .95 - .06], yaw: a }, [200, 176, 112], L); }
    if (slide && k < .5) { const n = (t >> 4) % 3; ctext(['B1', '...', '1'][n], 40, hex('#c81818')); }
  } };
  await fadeIn(.2);
  while (t < T && !skip) await nextFrame();
  await fadeOut(.25); scene = prev; await nextFrame(); post.fade = 0;
}
// ---------------- backdrops: rendered once per camera, filtered gray-except-red. dark rooms also keep a lights-off copy ----------------
function sceneBG(sc, camId) {
  const dark = !!(sc.isDark && sc.isDark()), vk = (sc.variantKey ? sc.variantKey() : '') + (dark ? '/dark' : ''), key = WX.id + '/' + camId + vk;
  if (WX.bgCache[key]) return WX.bgCache[key];
  const c = sc.cams.find(c => c.id === camId), cam = mkCam(c.pos, c.look, c.fov || 1), base = sc.variantKey && sc.variantKey() && sc.variantScene ? sc.variantScene() : sc;
  const bg = prerender(base, cam); noirize(bg.color);
  if (dark) { const d = prerender(darkScene(base), cam); noirize(d.color); bg.dark = d.color; }
  return WX.bgCache[key] = bg;
}
// ---------------- the world loop ----------------
const moWorld = {
  update() {
    WX.t++; MO.time++;
    if (WX.shake > 0) { WX.shake--; post.shake = Math.min(3, WX.shake >> 1); } else post.shake = 0;
    if (post.flash > 0) post.flash = Math.max(0, post.flash - .06);
    for (const f of WX.fx) { f.t--; if (f.vy !== undefined) f.p[1] += f.vy; } WX.fx = WX.fx.filter(f => f.t > 0);
    if (WX.banner && WX.banner.t > 0) WX.banner.t--; if (WX.cut > 0) WX.cut--; if (WX.redT > 0) WX.redT--; if (WX.muzzle > 0) WX.muzzle--;
    if (WX.sc.flicker && WX.flk <= 0 && Math.random() < .006) WX.flk = 2 + rnd(5); if (WX.flk > 0) WX.flk--;
    if (frozen3()) return;
    if (CARL.dead) return;
    if (pressed.start) { wstory(pauseMenu3); return; }
    if (pressed.mode) { wstory(mapScreen); return; }
    playerUpdate();
    if (CARL.reloadNext && !CARL.fire) { CARL.reloadNext = 0; startReload(); }
    for (const e of WX.ents) { if (!live3(e)) continue; e.t++; if (e.upd) e.upd(e); }
    WX.ents = WX.ents.filter(e => !e.gone);
    if (pressed.a && !CARL.aim) { const e = nearest3(); if (e && !(e.liveUse && e.liveUse(e))) wstory(() => e.talk(e)); }
    pickCam();
    sightings();
    if (WX.sc.tick) WX.sc.tick();
    stalkTick();
    if (WX.sc.safe && WX.t % 30 === 0) nerveGain(1);
    if (cond() === 2 && WX.t % 70 === 0) sfx('heart');
  },
  draw() { drawMO(); },
};
// seeing one for the first time this visit costs a little composure
function sightings() {
  if (WX.t % 10) return;
  for (const e of foes()) { if (e.seen || e.type === 'composite') continue; const sp = project(WX.bg.cam, [e.p[0], 1, e.p[2]]); if (!sp || sp[0] < 0 || sp[0] > W || sp[1] < 0 || sp[1] > H) continue; if (WX.bg.dark && dist2(e.p, CARL.p) > 5) continue; e.seen = 1; nerveDrop(e.type === 'double' ? 10 : 3); if (e.type === 'double') sfx('static'); }
}
function drawMO() {
  if (WX.cut > 1) { cls(BLACK); return; }
  showBackdrop(WX.bg);
  if (WX.bg.dark) { FB.set(WX.bg.dark); flashlight(WX.bg, CARL.p, CARL.yaw, true); }
  if (WX.flk > 0) for (let i = 0; i < FB.length; i++) { const v = FB[i]; FB[i] = ((255 << 24) | ((((v >> 16) & 255) * .55) << 16) | ((((v >> 8) & 255) * .55) << 8) | ((v & 255) * .55)) >>> 0; }
  const sc = WX.sc, list = WX.ents.filter(live3);
  for (const e of list) if (e.kind === 'foe' || e.kind === 'npc') if (!e.noShadow) liveShadow(e.p, e.shadow || .45, .5);
  liveShadow(CARL.p, .45, .55);
  for (const e of list) { if (e.draw3) { e.draw3(e); continue; } const m = entModel(e); if (m) drawModel(m, { p: e.p, yaw: e.yaw, pose: e.pose, bob: e.bob || 0, s: e.s }, liveLight(sc, e.p)); }
  if (!(CARL.inv > 0 && (CARL.inv & 4))) {
    const L = WX.bg.dark ? { amb: [.55, .5, .45], dir: v3.norm([-.3, .8, -.5]), dcol: [.4, .38, .35], tint: [0, 0, 0] } : liveLight(sc, CARL.p);
    drawGlitch(MO.nerve <= 0 ? MOM.jbGray : MOM.jb, { p: CARL.p, yaw: CARL.yaw, pose: CARL.pose, bob: CARL.bob }, L, MO.nerve < 10 ? .12 : 0);
    if (CARL.aim && !CARL.sap) { const c = Math.cos(CARL.yaw), s = Math.sin(CARL.yaw), hp = [CARL.p[0] + .4 * c + .5 * s, 1.0, CARL.p[2] - .4 * s + .5 * c]; drawGlitch(MO.weapon === 'shot' ? MOM.shotgun : MOM.gun, { p: hp, yaw: CARL.yaw }, L, 0);
      if (WX.muzzle > 0) { const mp = project(LIVE.cam, [hp[0] + s * .3, 1.05, hp[2] + c * .3]); if (mp) { circF(mp[0], mp[1], 5, hex('#fff0b0')); circF(mp[0], mp[1], 2, WHITE); } } }
  }
  for (const f of WX.fx) { const sp = project(LIVE.cam, f.p); if (sp) { if (f.k === 'txt') shadowText(f.s, sp[0] - f.s.length * 3, sp[1], f.c || WHITE); else if (f.k === 'spark') { pset(sp[0], sp[1], f.c); pset(sp[0] + 1, sp[1], f.c); pset(sp[0], sp[1] + 1, f.c); } } }
  if (sc.drawOver) sc.drawOver();
  if (sc.rain) rainFX(46);
  // composure: grain at the edges, then the picture won't sit still
  if (MO.nerve < 30) { const k = (30 - MO.nerve) / 30; for (let i = 0; i < 260 * k; i++) { const x = rnd(W), y = rnd(H), ed = Math.min(x, W - x, y, H - y); if (ed < 40 + k * 40) pset(x, y, hex(Math.random() < .5 ? '#000000' : '#3a3a3a')); } }
  post.wave = MO.nerve < 12 && (WX.t % 240) < 18 ? 2 : 0;
  if (WX.redT > 0) rectA(0, 0, W, H, hex('#c00000'), WX.redT / 30);
  drawHUDmo();
}
function drawHUDmo() {
  if (WX.banner && WX.banner.t > 0 && !frozen3()) { const b = WX.banner.s, w = b.length * 6 + 16; plate(6, 6, w, 15, { alpha: Math.min(.8, WX.banner.t / 40) }); shadowText(b, 14, 10, UI3.dim); }
  if (frozen3()) return;
  if (CARL.aim || CARL.reload) { const shot = MO.weapon === 'shot', s = CARL.reload ? 'RELOADING' : shot ? 'SG ' + MO.shot + ' / ' + invCount('shells') : MO.gun + ' / ' + invCount('ammo'); plate(W - s.length * 6 - 24, H - 22, s.length * 6 + 18, 16); shadowText(s, W - s.length * 6 - 15, H - 18, (shot ? MO.shot : MO.gun) ? UI3.text : UI3.hot);
    if (CARL.target && !CARL.reload && !shot) { const sp = project(LIVE.cam, [CARL.target.p[0], 1.1, CARL.target.p[2]]); if (sp) { const r = 6 + (1 - hitChance(dist2(CARL.target.p, CARL.p))) * 14; ringF(sp[0], sp[1], r, hex(CARL.aimT >= 60 ? '#ffd890' : '#ff3a2a')); } shadowText(CARL.aimT >= 60 ? 'STEADY' : 'SETTLING', 8, H - 18, CARL.aimT >= 60 ? UI3.name : UI3.dim); } return; }
  const e = nearest3(); if (e && e.label) { const s = e.label, w = s.length * 6 + 26; plate(6, H - 22, w, 16, { alpha: .7 }); circF(15, H - 14, 4, UI3.name); text('Z', 13, H - 17, hex('#000000'), 0); shadowText(s, 23, H - 18, UI3.text); }
}
// ---------------- dying, and coming back ----------------
async function deathSeq() {
  try { localStorage.removeItem(MOSUSPEND); } catch (e) {}
  music(null); sfx('shriek'); WX.calm = 1;
  for (let i = 0; i < 50; i++) { CARL.pose = { armL: -.3, armR: -.3, legL: -.6, legR: .6, headYaw: 0 }; CARL.p[1] = -i * .012; await nextFrame(); }
  await fadeOut(.03);
  scene = { draw() { cls(hex('#000000')); } }; post.fade = 0;
  await showCard(['', 'THE ACCOUNT ENDS HERE.', ''], 150, { fg: hex('#c81818') });
  const sv = fetchStore(MOSAVE), c = await choose(sv ? ['RESTORE FROM BACKUP', 'TITLE'] : ['TITLE'], { x: 92, y: 120 });
  CARL.dead = 0; CARL.p[1] = 0;
  if (sv && c === 0) return restoreGame(sv);
  return titleScreen3();
}
async function restoreGame(sv, afterDeath = true) {
  WX.hold = 0; MO = C3 = sv;
  if (afterDeath) {
    MO.restores = (MO.restores || 0) + 1;
    // Persist the count on the same backup without moving its checkpoint.
    store(MOSAVE, MO);
  } music(null); post.fade = 1;
  CARL.dead = 0; CARL.p[1] = 0; CARL.inv = 0; CARL.fire = CARL.sap = CARL.reload = CARL.reloadNext = CARL.aim = 0; enterRoom(MO.scene, MO.x, MO.z, MO.yaw); scene = moWorld; WX.hold = 1;
  WX.banner = { s: afterDeath ? 'JB GARFIELD (RESTORED FROM BACKUP ' + (MO.saves || 0) + ')' : 'CASE RESUMED / BACKUP ' + (MO.saves || 0), t: 220 };
  try { await fadeIn(.05); } finally { WX.hold = 0; }
}
function saveMO() {
  MO.x = CARL.p[0]; MO.z = CARL.p[2]; MO.yaw = CARL.yaw;
  try { localStorage.setItem(MOSAVE, JSON.stringify(MO)); return true; } catch (e) { return false; }
}
// Suspend keeps the live room; terminal backups still rebuild it on restoration.
const suspendFields = (o, skip) => Object.fromEntries(Object.entries(o).filter(([k, v]) => !skip.includes(k) && typeof v !== 'function'));
function readSuspend() {
  const s = fetchStore(MOSUSPEND), position = p => Array.isArray(p) && p.length === 3 && p.every(Number.isFinite);
  if (!(s && s.version === 1 && s.mo && SCENES[s.mo.scene] && Number.isFinite(s.mo.hp) && s.mo.hp > 0 &&
    s.mo.flags && Array.isArray(s.mo.inv) && Array.isArray(s.mo.box) && Array.isArray(s.mo.files) &&
    s.body && position(s.body.p) && (s.body.aimT == null || (Number.isInteger(s.body.aimT) && s.body.aimT >= 0 && s.body.aimT <= 60)) && (s.body.moveAxes == null || (Array.isArray(s.body.moveAxes) && s.body.moveAxes.length === 4 && s.body.moveAxes.every(Number.isFinite))) &&
    (s.body.moveInput == null || (Number.isInteger(s.body.moveInput) && s.body.moveInput >= 0 && s.body.moveInput <= 8)) &&
    s.world && Number.isFinite(s.world.t) && Array.isArray(s.ents) &&
    (s.body.aimAt == null || (typeof s.body.aimAt === 'string' && s.ents.some(e => e && e.data && e.data.kind === 'foe' && e.data.id === s.body.aimAt))))) return null;
  return s.ents.every(e => e && e.data && typeof e.data.id === 'string' && position(e.data.p) && e.model &&
    (!e.data.cueAt || (e.data.type === 'double' && Array.isArray(e.data.cueAt) && e.data.cueAt.length === 2 && e.data.cueAt.every(Number.isFinite) &&
      e.data.cueUsed === 1 && Number.isInteger(e.data.cueTravel) && e.data.cueTravel >= 0 && e.data.cueTravel <= 480 &&
      Number.isInteger(e.data.cueHold) && e.data.cueHold > 0 && e.data.cueHold <= 180)) &&
    (typeof e.model.name === 'string' || (typeof e.model.key === 'string' && MOM[e.model.key]) ||
      (Number.isInteger(e.model.audience) && e.model.audience >= -1 && e.model.audience < MOM.audience.length))) ? s : null;
}
function suspendCase() {
  if (!MO || CARL.dead || F('ending')) return false;
  const ents = WX.ents.filter(e => !e.gone).map(e => ({
    data: suspendFields(e, ['model']),
    model: typeof e.model === 'string' ? { name: e.model } : { key: Object.keys(MOM).find(k => MOM[k] === e.model), audience: MOM.audience.indexOf(e.model) }
  }));
  const s = { version: 1, mo: { ...MO, scene: WX.id, x: CARL.p[0], z: CARL.p[2], yaw: CARL.yaw },
    body: suspendFields(CARL, ['target']), ents, boss: WX.boss && WX.boss.id,
    world: suspendFields(WX, ['sc', 'id', 'ents', 'bg', 'bgCache', 'boss', 'hold']) };
  try { localStorage.setItem(MOSUSPEND, JSON.stringify(s)); return true; } catch (e) { return false; }
}
async function resumeSuspend(s) {
  WX.hold = 1; MO = C3 = s.mo;
  try {
    enterRoom(MO.scene, MO.x, MO.z, MO.yaw);
    const base = WX.ents.slice(); WX.ents = [];
    for (const saved of s.ents) {
      const d = saved.data, i = base.findIndex(e => e.id === d.id);
      let e = i >= 0 ? base.splice(i, 1)[0] : null;
      if (!e && d.id === 'dblBoss') e = addEnt3(doubleBossFoe());
      else if (!e && d.kind === 'foe' && FOE[d.type]) e = addEnt3(foe(d.id, d.type, d.p[0], d.p[2], { cond: null }));
      else if (!e && d.kind === 'item' && ITEM[d.item]) e = addEnt3(itemE(d.id, d.item, d.n, d.p[0], d.p[2]));
      if (!e) throw new Error('Unknown suspended entity');
      Object.assign(e, d);
      const m = saved.model;
      if (m.name) e.model = m.name;
      else if (m.key) e.model = MOM[m.key];
      else if (m.audience >= 0) e.model = MOM.audience[m.audience];
      if (!WX.ents.includes(e)) WX.ents.push(e);
    }
    Object.assign(WX, s.world); WX.hold = 1; WX.boss = ent3(s.boss) || null;
    Object.assign(CARL, s.body); CARL.target = ent3(CARL.aimAt) || null;
    pickCam(true);
    if (WX.boss) music(WX.boss.type === 'composite' ? 'mo_boss' : 'mo_double');
    else if (F('showOn') && !F('audience')) music('mo_audience');
    // Consume only after the room has been reconstructed successfully.
    localStorage.removeItem(MOSUSPEND);
  } catch (e) {
    MO = C3 = null; WX.hold = 0; scene = { draw() { cls(BLACK); } };
    await say('COULD NOT RESUME. The suspended case and terminal backup are still available.');
    return false;
  }
  post.fade = 1; scene = { draw: drawMO };
  await fadeIn(.05); scene = moWorld; WX.hold = 0;
  return true;
}
// ---------------- the backup terminal and the locker ----------------
async function terminal() {
  if (!invHas('tape')) { sfx('empty'); return narr(['The terminal wants a blank tape. I didn\'t have one. It hummed at me like that was my problem.', 'No blank tape. No backup.', 'No tape.']); }
  const c = await ask('BACKUP TERMINAL. COPY JB GARFIELD ONTO A BLANK TAPE? (' + invCount('tape') + ' LEFT)', null, ['BACK ME UP', 'NOT NOW']);
  if (c !== 0) return;
  invTake('tape'); MO.saves++;
  if (!saveMO()) { MO.saves--; invAdd('tape'); return say('BACKUP FAILED. Your blank tape is still here. Browser storage is unavailable.', ME); }
  sfx('tape'); await wait(40);
  await say('BACKUP COMPLETE. JB GARFIELD, COPY ' + MO.saves + '.', 'MERIDIAN');
  if (MO.saves === 1) await narr(['Copy one. I\'ve been called worse.', 'Copy one. Fine.', 'Copy one.']);
}
async function locker() {
  sfx('door');
  for (;;) {
    const c = await choose(['PUT AWAY', 'TAKE OUT', 'CLOSE'], { x: 20, y: 40, cancel: 1 }); if (c < 0 || c === 2) return;
    const from = c === 0 ? MO.inv : MO.box, to = c === 0 ? MO.box : MO.inv, cap = c === 0 ? 64 : 8;
    if (!from.length) { await say(c === 0 ? 'YOUR COAT IS EMPTY.' : 'THE LOCKER IS EMPTY.'); continue; }
    const i = await choose(from.map(s => ITEM[s.id].name + (s.n > 1 ? ' x' + s.n : '')).concat(['BACK']), { x: 20, y: 30, cancel: 1 }); if (i < 0 || i >= from.length) continue;
    const s = from[i], left = invAdd(s.id, s.n, to, cap); if (left === s.n) { sfx('empty'); await say('NO ROOM.'); continue; }
    s.n = left; if (!s.n) from.splice(i, 1); sfx('tick');
  }
}
// ---------------- the pause screen: condition, then everything ----------------
function drawStatusBack(sel) {
  skyD(0, H, '#050505', '#141414');
  plate(8, 8, 128, 92); shadowText('CONDITION', 16, 14, UI3.dim); const c = cond(), col = [hex('#7ad87a'), hex('#e8b830'), hex('#e83020')][c];
  let py = 46; for (let x = 0; x < 112; x++) { const ph = (x + frame * (1 + c)) % 40, y = ph === 20 ? 30 : ph === 21 ? 60 : ph === 22 ? 40 : 46; lineF(15 + x, py, 16 + x, y, col); py = y; }
  shadowText(COND[c], 16, 68, col);
  shadowText('COMPOSURE', 16, 82, UI3.dim); rectF(76, 82, 52, 7, hex('#2a2a2a')); rectF(76, 82, Math.round(52 * MO.cap / 100), 7, hex('#4a4a4a')); rectF(76, 82, Math.round(52 * MO.nerve / 100), 7, MO.nerve >= 60 ? UI3.name : MO.nerve >= 30 ? hex('#b07030') : hex('#8a8a8a'));
  plate(144, 8, 168, 92); if (MO.weapon === 'shot') { shadowText('SHOTGUN', 152, 14, UI3.dim); shadowText(MO.shot + ' IN THE TUBE', 152, 26, UI3.text); shadowText(invCount('shells') + ' SHELLS LOOSE', 152, 38, UI3.text); }
  else { shadowText('REVOLVER', 152, 14, UI3.dim); shadowText(MO.gun + ' IN THE CYLINDER', 152, 26, UI3.text); shadowText(invCount('ammo') + ' ROUNDS LOOSE', 152, 38, UI3.text); }
  shadowText(['ACT I: THE CASE', 'ACT II: THE SUITES', 'ACT III: MONDAY'][MO.act - 1], 152, 56, UI3.name); text(DIFF[dk()], 304 - DIFF[dk()].length * 6, 14, UI3.dim, 0); shadowText('BACKUPS ' + MO.saves + '  RESTORES ' + (MO.restores || 0), 152, 70, UI3.dim); shadowText('DELETED ' + MO.kills, 152, 82, UI3.dim);
}
async function pauseMenu3() {
  sfx('tick'); const prev = scene; let quit = false; scene = { draw() { drawStatusBack(); } };
  try {
    for (;;) {
      const i = await choose(['ITEMS', 'FILES', 'MAP', 'CASE NOTES', 'RADIO', 'OPTIONS', 'SUSPEND AND QUIT', 'CLOSE'], { x: 12, y: 108, cancel: 1 });
      if (i === 0) { await itemsScreen(); continue; }
      if (i === 1) { await filesScreen(); continue; }
      if (i === 2) { await mapScreen(); continue; }
      if (i === 3) { await caseScreen(); continue; }
      if (i === 4) { scene = prev; await radio(); scene = { draw() { drawStatusBack(); } }; continue; }
      if (i === 5) { const o = await choose(['CONTROLS: ' + (MO.tank ? 'TANK' : 'MODERN'), 'BACK'], { x: 100, y: 150, cancel: 1 }); if (o === 0) { MO.tank = MO.tank ? 0 : 1; await say(MO.tank ? 'TANK: UP WALKS, LEFT/RIGHT TURN, DOWN+X TURNS AROUND.' : 'MODERN: PUSH THE WAY YOU WANT TO GO ON SCREEN.'); } continue; }
      if (i === 6) {
        if ((await ask('SUSPEND AND QUIT? RESUME CONTINUES HERE ONCE. AFTER DEATH, ONLY A TERMINAL BACKUP CAN RESTORE YOU.', null, ['SUSPEND', 'NOT NOW'])) !== 0) continue;
        if (!suspendCase()) { await say('SUSPEND FAILED. The case is still open. Your tape and terminal backup are unchanged.'); continue; }
        quit = true; MO = C3 = null; run(titleScreen3); return;
      }
      return;
    }
  } finally { if (!quit) scene = prev; }
}
async function itemsScreen() {
  const prev = scene; let cur = 0, keys = false, done = false;
  const draw = () => {
    drawStatusBack(); plate(8, 106, 304, 113);
    const list = invItems(keys), first = Math.floor(cur / 8) * 8, pages = Math.max(1, Math.ceil(list.length / 8));
    shadowText(keys ? 'KEY-ITEM POUCH' : 'SUPPLIES ' + list.length + '/8', 16, 111, UI3.name);
    if (pages > 1) text((first / 8 + 1) + '/' + pages, 278, 111, UI3.dim, 0);
    for (let i = first; i < first + 8; i++) {
      const x = 16 + (i & 1) * 148, y = 127 + ((i - first) >> 1) * 15, s = list[i];
      if (i === cur) rectA(x - 3, y - 3, 144, 14, hex('#ff9a3a'), .22);
      text(s ? ITEM[s.id].name + (s.n > 1 || ITEM[s.id].stack ? ' x' + s.n : '') : '-', x, y, s ? (i === cur ? UI3.name : UI3.text) : UI3.dim, 0);
    }
    const s = list[cur]; if (s) wrapT(N(ITEM[s.id].desc).toUpperCase(), 48).slice(0, 3).forEach((l, i) => text(l, 16, 185 + i * 8, UI3.dim, 0));
    text('X: ' + (keys ? 'SUPPLIES' : 'KEY ITEMS') + ' / C: BACK', 16, 211, UI3.dim, 0);
  };
  scene = { draw };
  try {
    while (!done) {
      await nextFrame();
      if (pressed.b) { keys = !keys; cur = 0; sfx('tick'); }
      const list = invItems(keys), nS = Math.max(8, list.length + (list.length & 1));
      if (pressed.left || pressed.right) cur ^= 1;
      if (pressed.up) cur = (cur + nS - 2) % nS;
      if (pressed.down) cur = (cur + 2) % nS;
      if (cur >= nS) cur = 0;
      if (pressed.c || pressed.start) done = true;
      if (!done && pressed.a && list[cur]) {
        const s = list[cur], it = ITEM[s.id], o = await choose(['USE', 'EXAMINE', 'BACK'], { x: 200, y: 120, cancel: 1 });
        if (o === 1) { scene = prev; await narr(it.desc); scene = { draw }; }
        if (o === 0) { scene = prev; await useItem(s.id); scene = { draw }; }
      }
    }
  } finally { scene = prev; }
}
async function useItem(id) {
  const it = ITEM[id];
  if (it.heal) { if (MO.hp >= 12) return narr(['I wasn\'t hungry. I was surprised too.', 'Not now.', 'Not hungry.']); invTake(id); MO.hp = Math.min(12, MO.hp + it.heal); sfx('get'); return narr(id === 'lasagnaH' ? ['Hot lasagna. For a minute the building was somebody else\'s problem.', 'Hot lasagna. Better.', 'Ate. Better.'] : ['Cold lasagna, standing up, in the dark. I\'ve had worse dates.', 'Cold. It helped.', 'Ate.']); }
  if (it.nerve) { if (MO.nerve >= MO.cap) return narr(['My hands were steady. Steadier than the story.', 'Not now.', 'Not now.']); invTake(id); nerveGain(it.nerve); sfx('ok'); return narr(['Coffee. The sentences came back in the right order.', 'Coffee. A little better.', 'Coffee.']); }
  if (id === 'ammo') { if (MO.weapon !== 'gun') return narr(['Revolver rounds. I was carrying the shotgun.', 'Wrong gun.', 'Wrong gun.']); if (MO.gun >= 6) return narr(['Six in the cylinder. A full house.', 'Full.', 'Full.']); startReload(); return; }
  if (id === 'shells') { if (MO.weapon !== 'shot') return narr(['Shells. The revolver didn\'t want them.', 'Wrong gun.', 'Wrong gun.']); if (MO.shot >= 4) return narr(['Four in the tube. That\'s all it holds.', 'Full.', 'Full.']); startReload(); return; }
  if (id === 'shotgun') { CARL.aimT = 0; CARL.aimAt = null; MO.weapon = MO.weapon === 'shot' ? 'gun' : 'shot'; sfx('reload'); return narr(MO.weapon === 'shot' ? ['The shotgun. The revolver went back in my coat, insulted.', 'Shotgun.', 'Shotgun.'] : ['The revolver. Six chances instead of four arguments.', 'Revolver.', 'Revolver.']); }
  if (it.doc) return showDoc(it.doc, true);
  return narr(['It goes somewhere specific. I\'ll know it when I see it. That\'s the job.', 'It goes somewhere. I\'ll find it.', 'Not here.']);
}
const EVIDENCE = [['visitors', 'My name in the visitor log, FRI 11:14 PM.'], ['tape1', 'An intake tape in my voice. Subject 41.'], ['slot41', 'The SUBJECT 41 MASTER reel is missing.'], ['footage', 'Security tape: a man in my hat took Otis down.'], ['suiteA', 'My office was a set. Somebody played me.'], ['suiteB', 'Suite B: a missing cup sound fits the physical trace. The key belonged to a routine.'], ['dirJournal', '41\'s master was donated. Donor redacted.'], ['suiteC', 'The diner visitor asked for the master recording. The account does not identify my origin.'], ['doubleDistracted', 'The Double responded to the intake slate by turning toward the gallery light. Recognition does not establish an origin.'], ['dblBoss', 'There was another one of me.'], ['log4', 'Otis taped the broadcast. The lounge VCR.'], ['alibi', 'CH 8, LIVE, FRI 11:14 PM. I was on the air.'], ['mondayNote', 'Maggie asked Otis to bring two cups and news of the week. He kept the Monday appointment after closing.'], ['maggieRec', 'Maggie Keel, kept 1986. Otis visits Mondays.'], ['audiencePreserved', 'The remaining theater backups sat down after the credits.']];
async function caseScreen() {
  const prev = scene;
  scene = { draw() {
    cls(hex('#080808')); frameRect(8, 8, W - 16, H - 16, UI3.edge);
    shadowText('JB GARFIELD / CASE NOTES', 16, 14, UI3.name);
    shadowText('Z: SELECT / C: BACK', 16, 202, UI3.dim);
  } };
  try {
    for (;;) {
      const i = await choose(['FOLLOW LEADS', 'TEST A THEORY', 'REVIEW OBSERVATIONS', 'ASK FOR NEXT STEP', 'REVIEW MEMORY ANSWERS', 'READ DRAFT REPORT', 'BACK'], { x: 14, y: 36, cancel: 1 });
      if (i < 0 || i === 6) return;
      if (i === 0) { for (const l of caseLeads()) await say(l, NARR); }
      if (i === 1) {
        const ids = Object.keys(THEORIES), j = await choose(ids.map(k => (F(k) ? '* ' : '') + THEORIES[k].title).concat(['BACK']), { x: 12, y: 36, cancel: 1 });
        if (j >= 0 && j < ids.length) await testTheory(ids[j]);
      }
      if (i === 2) {
        for (const [, t] of EVIDENCE.filter(([k]) => F(k))) await say(t, NARR);
        for (const k of Object.keys(THEORIES).filter(F)) await say('TESTED: ' + THEORIES[k].report, NARR);
      }
      if (i === 3) await radio();
      if (i === 4) await memoryReview();
      if (i === 5) await caseReport();
    }
  } finally { scene = prev; }
}
async function filesScreen() {
  if (!MO.files.length) return say('NO FILES YET.');
  // 12 per page so the list never runs off the bottom of the screen
  const N = 12; let p = 0;
  for (;;) {
    const page = MO.files.slice(p * N, p * N + N), more = MO.files.length > (p + 1) * N;
    const opts = page.map(f => DOCS[f].title).concat(more ? ['MORE...'] : [], p ? ['PREVIOUS...'] : [], ['BACK']);
    const i = await choose(opts, { x: 20, y: 20, cancel: 1 });
    if (i >= 0 && i < page.length) return showDoc(page[i], true);
    if (opts[i] === 'MORE...') p++; else if (opts[i] === 'PREVIOUS...') p--; else return;
  }
}
// a document, full screen. this is the true one; his paraphrase afterward may not be
async function showDoc(id, reread) {
  const d = DOCS[id], prev = scene; if (!MO.files.includes(id)) MO.files.push(id);
  const lines = wrapT(d.body.toUpperCase(), 44), pages = []; for (let i = 0; i < lines.length; i += 14) pages.push(lines.slice(i, i + 14));
  for (let p = 0; p < pages.length; p++) {
    scene = { draw() { cls(hex('#0a0a0a')); rectF(20, 10, 280, 204, hex('#d8d4c4')); rectF(22, 12, 276, 200, hex('#e8e4d4')); text(d.title.toUpperCase(), 30, 18, hex('#8a1a14'), 0); rectF(30, 28, 260, 1, hex('#8a8474'));
      pages[p].forEach((l, i) => text(l, 30, 34 + i * 12, hex('#242018'), 0)); text((p + 1) + '/' + pages.length, 270, 202, hex('#8a8474'), 0); } };
    sfx('tick'); await waitBtn();
  }
  scene = prev;
  if (!reread && d.after) await d.after();
}
// ---------------- the map ----------------
const MAPNAME = { service: 'SERVICE', stairs: 'STAIRS', wed_hall: 'WEDNESDAY WARD', records: 'RECORDS', theater: 'THEATER', dir_office: 'DIRECTOR', nurse: 'NURSES', security: 'SECURITY', roof: 'ROOF', boiler: 'BOILER', cold: 'COLD STORAGE', steps: 'STEPS', lobby: 'LOBBY', lounge: 'LOUNGE', tue_hall: 'TUESDAY', intake: 'INTAKE', consult: 'CONSULT', thu_hall: 'THURSDAY', archive: 'ARCHIVE', generator: 'GEN', fri_hall: 'FRIDAY GALLERY', control: 'CONTROL', suite_a: 'A', suite_b: 'B', suite_c: 'C', b_hall: 'MONDAY WARD', b_safe: 'CAMP', vault_ante: 'ANTE', vault: 'VAULT' };
async function mapScreen() {
  const prev = scene, names = ['B1', 'GROUND', '2F'], o = objective(), target = MOROOM[o[1]];
  let floor = SCENES[WX.id] ? SCENES[WX.id].floor : 1;
  const known = id => MO.visited[id] || (F('directory') && MOROOM[id].floor === 1);
  scene = { draw() {
    cls(hex('#000000')); rectF(4, 4, W - 8, H - 8, hex('#121212')); frameRect(4, 4, W - 8, H - 8, UI3.edge);
    shadowText('MERIDIAN / ' + names[floor], 14, 12, UI3.name); text('LEFT/RIGHT: FLOOR', 210, 12, UI3.dim, 0);
    for (const id in MOROOM) {
      const r = MOROOM[id]; if (r.floor !== floor || !r.map || !known(id)) continue;
      const seen = MO.visited[id], lead = id === o[1];
      for (const q of r.map) {
        rectF(q[0], q[1], q[2], q[3], id === WX.id ? ((frame >> 4) & 1 ? hex('#ff9a3a') : hex('#8a4a14')) : seen ? hex('#4a4a4a') : hex('#1a1a1a'));
        frameRect(q[0], q[1], q[2], q[3], lead ? hex('#e8c85a') : hex('#a8a8a8'));
      }
      const q = r.map[0], nm = MAPNAME[id] || id.toUpperCase();
      if (q[2] >= 12) text(nm.slice(0, Math.floor((q[2] - 2) / 6)), q[0] + 2, q[1] + 2, id === WX.id ? hex('#000000') : UI3.dim, 0);
    }
    text(target && known(o[1]) ? 'LEAD: ' + MAPNAME[o[1]] + ' / ' + names[target.floor] : 'LEAD: ROOM NOT MAPPED YET', 14, 168, hex('#e8c85a'), 0);
    if (F('power')) text('FEEDS: FRI ' + (line(0) ? 'ON' : 'OFF') + ' / LIFT ' + (line(2) ? 'ON' : 'OFF') + ' / BOIL ' + (line(1) ? 'ON' : 'OFF'), 14, 178, UI3.dim, 0);
    if (floor === 1 && F('serviceKnown')) text(F('servicePower') && line(0) ? 'SERVICE OPEN' + (F('porterQuiet') ? ' / PORTER AT HATCH' : ' / PORTER ON ROUND') : 'SERVICE SHUT / GALLERY ' + (line(0) && !F('servicePower') ? 'LIT' : 'DARK'), 14, 188, UI3.name, 0);
    if (floor === 1 && !F('directory') && !F('serviceKnown')) text('ONLY VISITED ROOMS / DIRECTORY IN LOBBY', 14, 188, UI3.dim, 0);
    text('ORANGE: YOU / GOLD EDGE: LEAD', 14, 198, UI3.dim, 0); text('Z/C/SHIFT: BACK', 14, 210, UI3.dim, 0);
  } };
  sfx('tick');
  try {
    await nextFrame();
    for (;;) {
      if (pressed.left || pressed.right) { floor = (floor + (pressed.right ? 1 : 2)) % 3; sfx('tick'); }
      if (pressed.a || pressed.b || pressed.c || pressed.start || pressed.mode) return;
      await nextFrame();
    }
  } finally { sfx('tick'); scene = prev; }
}
// the CARL 3 prompt asks for the nearest thing with a talk handler; foes have none
const stopHint = () => objective()[0];
