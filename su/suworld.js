'use strict';
// ================= STICK UP: the living city. cars, people, cops, the stick, the A.S.S. =================
const DV = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const CARM = {
  sedan: { L: 26, Wd: 14, max: 3.6, acc: .09, turn: .05, grip: .8, cols: ['#b62424', '#2449b6', '#6d6d6d', '#dbdbdb', '#246d24', '#92246d', '#db9224'] },
  sports: { L: 25, Wd: 13, max: 4.8, acc: .14, turn: .06, grip: .84, cols: ['#ff2424', '#ffdb24', '#24dbff', '#f0f0f0'] },
  taxi: { L: 26, Wd: 14, max: 3.6, acc: .09, turn: .05, grip: .8, cols: ['#ffdb24'] },
  van: { L: 30, Wd: 16, max: 3.1, acc: .07, turn: .042, grip: .78, cols: ['#dbdbdb', '#926d49', '#49496d'] },
  cop: { L: 27, Wd: 14, max: 3.7, acc: .12, turn: .056, grip: .84, cols: ['#f0f0f0'] },
  luxor: { L: 27, Wd: 14, max: 5, acc: .15, turn: .062, grip: .86, cols: ['#ffdb49'] },
  bus: { L: 54, Wd: 18, max: 3.3, acc: .06, turn: .032, grip: .74, cols: ['#ff6db6'] },
  truck: { L: 40, Wd: 18, max: 3.4, acc: .07, turn: .036, grip: .76, cols: ['#6d6d49'] },
  boat: { L: 28, Wd: 12, max: 4.4, acc: .1, turn: .055, grip: .9, cols: ['#f0f0f0'], water: 1 },
  yacht: { L: 62, Wd: 22, max: 3.4, acc: .06, turn: .03, grip: .92, cols: ['#f0f0f0'], water: 1 },
  ass: { L: 34, Wd: 34, max: 4.2, acc: .12, turn: .06, grip: .9, cols: ['#b6b6db'], ship: 1 },
};
const TRAFFIC = ['sedan', 'sedan', 'sedan', 'taxi', 'van', 'sports', 'sedan', 'taxi'];
const SHIRTS = ['#db2424', '#2492db', '#24b649', '#dbdb24', '#f0f0f0', '#924992', '#db9249', '#49dbb6', '#6d6d6d'], SKINS = ['#f0c8a0', '#dbb692', '#b6926d', '#926d49', '#6d4924'], HAIRS = ['#241010', '#6d4924', '#dbb649', '#101010', '#b6b6b6', '#b64924'];
let CARS = [], PEDS = [], SHOTS = [], FX = [], PICK = [], MARKS = [], FLY = [];
const SU = { cash: 0, hp: 100, heat: 0, wanted: 0, search: 0, wep: ['STICK'], wi: 0, radio: 1, done: {}, cut: 0, paused: 0, obj: '', objT: 0, big: null, area: '', areaT: 0, timer: 0, bar: null, robbed: 0, ship: 0, stat: { stickups: 0, peds: 0, cars: 0 } };
const PL = { sh: hex('#4c4c9c'), x: 0, y: 0, a: 0, car: null, walk: 0, bust: 0, swing: 0, down: 0, inv: 0 };
const WANT_T = [0, 1, 6, 14, 26, 40];
const d2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const angD = (a, b) => { let d = b - a; while (d > Math.PI) d -= 6.2832; while (d < -Math.PI) d += 6.2832; return d; };
const plPos = () => PL.remote || PL.car || PL;
let BOMBS = [];
// ---------------- spawning ----------------
function spawnCar(m, x, y, a, o = {}) { const M = CARM[m]; const c = Object.assign({ k: 'car', m, x, y, a, vx: 0, vy: 0, v: 0, z: 0, col: hex(o.col || pick(M.cols)), hp: 100, drv: 'ai', dir: 0, tx: 0, ty: 0, t: 0, fire: 0, wreck: 0, stuck: 0 }, o); if (o.col) c.col = hex(o.col); CARS.push(c); return c; }
function spawnPed(x, y, o = {}) { const p = Object.assign({ k: 'ped', x, y, a: rnd(4) * Math.PI / 2, st: 'walk', t: 60 + rnd(120), sh: hex(pick(SHIRTS)), skin: hex(pick(SKINS)), hair: hex(pick(HAIRS)), sp: .55 + Math.random() * .3, walk: 0 }, o); PEDS.push(p); return p; }
const laneDirs = (tx, ty) => { if (tx > 47 || tAt(tx, ty) !== TL.road) return []; const r = []; if (inH(ty)) r.push(HR.includes(ty) ? 2 : 0); if (inV(tx)) r.push(VR.includes(tx) ? 1 : 3); return r; };
function laneCar(m, tx, ty, o = {}) { const ds = laneDirs(tx, ty); if (ds.length !== 1) return null; if (!o.tag && CARS.some(c => Math.abs(c.x - tx * T - 16) < 44 && Math.abs(c.y - ty * T - 16) < 44)) return null; const d = ds[0]; const c = spawnCar(m, tx * T + 16, ty * T + 16, d * Math.PI / 2, Object.assign({ dir: d, tx: tx + DV[d][0], ty: ty + DV[d][1] }, o)); c.v = 1.5; return c; }
function offscreenTile(minD, maxD, ok) {
  const p = plPos();
  for (let n = 0; n < 30; n++) {
    const a = Math.random() * 6.2832, r = minD + Math.random() * (maxD - minD), x = p.x + Math.cos(a) * r, y = p.y + Math.sin(a) * r, tx = Math.floor(x / T), ty = Math.floor(y / T);
    if (Math.abs(x - CAM.x) < W / CAM.s / 2 + 40 && Math.abs(y - CAM.y) < H / CAM.s / 2 + 40) continue;
    if (ok(tx, ty)) return [tx, ty];
  }
  return null;
}
function populate() {
  if (SU.cut > 1) return;
  const p = plPos(), amb = CARS.filter(c => c.drv === 'ai' && !c.tag);
  for (const c of amb) if (d2(c, p) > 620 * 620) c.dead = 1;
  for (const q of PEDS) if (!q.tag && !q.cop && d2(q, p) > 420 * 420) q.dead = 1;
  for (const c of CARS) if (c.wreck && !c.tag && d2(c, p) > 700 * 700) c.dead = 1;
  if (frame % 6 === 0 && amb.length < 16) { const t = offscreenTile(240, 460, (tx, ty) => laneDirs(tx, ty).length === 1); if (t) laneCar(pick(TRAFFIC), t[0], t[1]); }
  if (frame % 5 === 0 && PEDS.filter(q => !q.tag && !q.cop).length < 18) { const t = offscreenTile(180, 340, (tx, ty) => tAt(tx, ty) === TL.walk || tAt(tx, ty) === TL.path); if (t) spawnPed(t[0] * T + 8 + rnd(16), t[1] * T + 8 + rnd(16)); }
  // patrols: a couple of cruisers drive the lanes at zero stars, so street crime has witnesses
  if (!SU.wanted && !SU.noLaw && frame % 60 === 0 && CARS.filter(c => c.patrol).length < 1) { const t = offscreenTile(240, 460, (tx, ty) => laneDirs(tx, ty).length === 1); if (t) laneCar('cop', t[0], t[1], { patrol: 1 }); }
  for (const c of CARS) if (c.drv === 'cop' && !c.chase && !c.papa && !c.tag && d2(c, p) > 620 * 620) c.dead = 1; // gave up, gone home
  // the police: two cars a star (they keep coming while they search, they just head for where you were last seen)
  if (SU.wanted > 0 && !SU.cut && !SU.noLaw) {
    for (const c of CARS) if (c.patrol) { c.patrol = 0; c.drv = 'cop'; c.chase = 1; c.siren = 1; }
    const cops = CARS.filter(c => c.drv === 'cop' && !c.papa).length;
    if (frame % 60 === 0 && cops < SU.wanted + 1) { const t = offscreenTile(260, 420, (tx, ty) => tAt(tx, ty) === TL.road); if (t) { const swat = SU.wanted >= 5 && (!CARS.some(c => c.swat) || Math.random() < .4), c = spawnCar(swat ? 'van' : 'cop', t[0] * T + 16, t[1] * T + 16, Math.atan2(p.y - t[1] * T, p.x - t[0] * T), { drv: 'cop', siren: 1, swat, col: swat ? '#242424' : undefined }); c.chase = 1; if (swat) c.hp = 160; } }
    // four stars: a chopper. it follows you, its spotlight counts as being seen, and at five stars it shoots
    if (SU.wanted >= 4 && !FLY.some(h => h.law)) { const h = chopper(p.x - 300, p.y - 220); h.law = 1; h.step = lawHeli; pop(p.x, p.y - 14, 'POLICE CHOPPER', '#ff2424'); }
  }
  CARS = CARS.filter(c => !c.dead); PEDS = PEDS.filter(q => !q.dead);
}
// ---------------- the law ----------------
function copSees(x, y, r = 210) { return PEDS.some(q => q.cop && q.st !== 'down' && q.st !== 'dance' && (q.x - x) ** 2 + (q.y - y) ** 2 < r * r) || CARS.some(c => (c.drv === 'cop' || c.patrol) && !c.papa && (c.x - x) ** 2 + (c.y - y) ** 2 < r * r); }
const heliSees = p => !intAt(p.x, p.y) && FLY.some(h => h.law && d2(h, p) < 90 * 90);
function lawHeli(h) {
  h.rot += .5; const p = plPos();
  if (SU.wanted < 4) { h.y -= 3; if (d2(h, p) > 500 * 500) h.dead = 1; return; }
  const dx = p.x - h.x, dy = p.y - h.y, d = Math.hypot(dx, dy) || 1; h.a = Math.atan2(dy, dx);
  if (d > 40) { h.x += dx / d * 2; h.y += dy / d * 2; } // slower than a fast car: you can outrun it
  if (SU.wanted >= 5 && d < 170 && --h.t <= 0) { h.t = 70 + rnd(40); shoot(h.x, h.y, h.a + (Math.random() - .5) * .2, 'cop'); }
}
function crime(pts, x, y, force) {
  if (SU.cut > 1 || SU.noLaw) return;
  if (!force && !copSees(x, y)) return;
  SU.heat = Math.min(60, SU.heat + pts); let w = 0; for (let i = 0; i < 6; i++) if (SU.heat >= WANT_T[i]) w = i;
  if (w > SU.wanted) { SU.wanted = w; sfx('alert'); if (w >= 3) pop(x, y - 12, ['', '', '', 'BACKUP IS COMING', 'CHOPPER. AND GUNS.', 'SWAT. FOR A STICK.'][w], '#ff2424'); } SU.search = 0;
}
function setWanted(n) { SU.wanted = n; SU.heat = WANT_T[n]; SU.search = 0; }
// a cop sees you if you're close and no building is in the way
function sees(o, p, r) { const dd = d2(o, p); if (dd > r * r) return false; const n = Math.ceil(Math.sqrt(dd) / 16); for (let i = 1; i < n; i++) { const t = i / n; if (tileOf(o.x + (p.x - o.x) * t, o.y + (p.y - o.y) * t) === TL.bldg) return false; } return !wallBetween(o, p); }
function stepLaw() {
  if (!SU.wanted) { SU.search = 0; SU.lk = null; return; }
  const p = plPos(), seen = !(PL.car && PL.car.z > 30) && (PEDS.some(q => q.cop === 1 && q.st !== 'down' && sees(q, p, 230)) || CARS.some(c => c.drv === 'cop' && c.chase && !c.papa && sees(c, p, 190)) || heliSees(p));
  if (seen || !SU.lk) SU.lk = { x: p.x, y: p.y };
  if (seen) SU.search = 0; else if (++SU.search > 240 + SU.wanted * 30) { SU.wanted--; SU.heat = WANT_T[SU.wanted]; SU.search = 0; if (!SU.wanted) { pop(p.x, p.y, 'LOST THEM', '#6dff92'); for (const c of CARS) if (c.drv === 'cop') { c.chase = 0; c.siren = 0; } } }
}
// the police route along everything a car can drive on, toward wherever Carl is standing
const DF = new Int16Array(MW * MH); let dfAt = -1;
function bfsPlayer() {
  let p = SU.search > 0 && SU.lk ? SU.lk : plPos(); const ih = intAt(p.x, p.y); if (ih) p = { x: ih.door.x, y: ih.door.y + 12 };
  const s = Math.floor(p.y / T) * MW + Math.floor(p.x / T); if (s === dfAt && frame % 30) return; dfAt = s;
  DF.fill(-1); const q = [s]; DF[s] = 0;
  for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of DV) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const j = ny * MW + nx; if (DF[j] >= 0 || solidCar(MAP[j])) continue; DF[j] = DF[i] + 1; q.push(j); } }
}
// ---------------- vehicles ----------------
const fwd = c => [Math.cos(c.a), Math.sin(c.a)];
function carHits(c, x, y) {
  const M = CARM[c.m]; if (M.ship && c.z > 20) return false;
  const ca = Math.cos(c.a), sa = Math.sin(c.a), hl = M.L / 2 - 1, hw = M.Wd / 2 - 1;
  for (const [u, v] of [[hl, hw], [hl, -hw], [-hl, hw], [-hl, -hw], [hl, 0], [-hl, 0], [0, hw], [0, -hw]]) {
    const t = tileOf(x + u * ca - v * sa, y + u * sa + v * ca);
    if (M.water ? t !== TL.water : solidCar(t)) return true;
  }
  return false;
}
function moveCar(c) {
  const sp = Math.hypot(c.vx, c.vy);
  c.x += c.vx; if (carHits(c, c.x, c.y)) { c.x -= c.vx; bump(c, Math.abs(c.vx)); c.vx *= -.3; }
  c.y += c.vy; if (carHits(c, c.x, c.y)) { c.y -= c.vy; bump(c, Math.abs(c.vy)); c.vy *= -.3; }
  if (carHits(c, c.x, c.y)) { c.a -= c.da || 0; } // a turn into a wall is undone too
  return sp;
}
function bump(c, s) { if (s > 1.6 && !c.wreck && (c === PL.car || c.tag)) { dmgCar(c, (s - 1.4) * 9); if (c === PL.car) { post.shake = 2; sfx('land'); } } }
function dmgCar(c, n) { if (c.wreck || c.armor) return; c.hp -= n; if (c.minHp !== undefined && c.hp < c.minHp) c.hp = c.minHp; if (c.hp <= 0 && !c.fire) c.fire = 200; if (c.onDmg) c.onDmg(c, n); }
function carPhys(c, up, down, left, right) {
  const M = CARM[c.m], [fx, fy] = fwd(c);
  let fv = c.vx * fx + c.vy * fy, lv = -c.vx * fy + c.vy * fx;
  const top = M.max * (c.hp < 30 ? .65 : 1) * (c.boost || 1);
  if (up) fv += M.acc; else if (down) fv -= fv > .3 ? M.acc * 1.8 : M.acc * .6; else fv *= .985;
  fv = clamp(fv, -top * .45, top); lv *= M.grip;
  const st = (right ? 1 : 0) - (left ? 1 : 0); c.da = st * M.turn * clamp(fv / 1.6, -1, 1); c.a += c.da;
  const [gx, gy] = fwd(c); c.vx = gx * fv - gy * lv; c.vy = gy * fv + gx * lv;
  return moveCar(c);
}
function aheadBlocked(c, reach) {
  const [fx, fy] = fwd(c), M = CARM[c.m], lim = M.L / 2 + reach, chk = o => { const rx = o.x - c.x, ry = o.y - c.y, al = rx * fx + ry * fy, lt = Math.abs(-rx * fy + ry * fx); return al > 4 && al < lim && lt < 11; };
  if (!PL.car && chk(PL)) return true;
  for (const o of CARS) if (o !== c && !o.dead && o.z < 20 && chk(o)) return true;
  for (const q of PEDS) if (q.st !== 'down' && chk(q)) return true;
  return false;
}
function aiCar(c) {
  const tx = c.tx * T + 16, ty = c.ty * T + 16, dist = Math.hypot(tx - c.x, ty - c.y);
  if (dist > 140) { if (!c.tag) { c.dead = 1; return; } const ux = Math.floor(c.x / T), uy = Math.floor(c.y / T), ds = laneDirs(ux, uy); if (ds.length) { c.dir = ds[0]; c.tx = ux + DV[c.dir][0]; c.ty = uy + DV[c.dir][1]; } }
  // arrived once the car is level with the tile centre along its lane: a car that overshoots no longer circles back for it
  if (dist < 9 || (tx - c.x) * DV[c.dir][0] + (ty - c.y) * DV[c.dir][1] < 4) {
    const opts = laneDirs(c.tx, c.ty).filter(d => d !== (c.dir + 2) % 4 && laneDirs(c.tx + DV[d][0], c.ty + DV[d][1]).length);
    if (!opts.length) { c.dead = !c.tag; return; }
    const d = opts.includes(c.dir) && Math.random() < .6 ? c.dir : pick(opts); c.dir = d; c.tx += DV[d][0]; c.ty += DV[d][1];
  }
  const gx = c.tx * T + 16, gy = c.ty * T + 16, want = Math.atan2(gy - c.y, gx - c.x), df = angD(c.a, want), M = CARM[c.m];
  c.a += clamp(df, -M.turn * 2, M.turn * 2);
  if (Math.abs(df) > .35) c.v = Math.min(c.v, 1.1); // brake into the turn
  const blocked = c.stuck < 200 && aheadBlocked(c, 20), cruise = (c.cruise || 2.1) * (Math.abs(df) > .35 ? .55 : 1);
  c.v += ((blocked ? 0 : cruise) - c.v) * (blocked ? .25 : .05);
  if (c.stuck >= 200) { if (++c.stuck > 260) c.stuck = 0; } else if (blocked) { if (++c.stuck === 120 && d2(c, plPos()) < 200 * 200) { pop(c.x, c.y, pick(['HONK', 'MOVE!', 'COME ON']), '#ffdb49'); sfx('tick'); } } else c.stuck = 0;
  const [fx, fy] = fwd(c); c.vx = fx * c.v; c.vy = fy * c.v; c.da = 0; moveCar(c);
}
function copCar(c) {
  const p = SU.search > 0 && SU.lk && !c.papa ? SU.lk : plPos(), dp = Math.sqrt(d2(c, p));
  if (!c.chase || (PL.car && PL.car.z > 30) || (SU.noLaw && !c.papa)) { c.vx *= .95; c.vy *= .95; moveCar(c); return; }
  // on foot and close: park and get out
  if (!PL.car && dp < 70 && !c.out && !SU.search && !c.papa) { c.out = 1; c.vx *= .3; c.vy *= .3; const [fx, fy] = fwd(c); spawnPed(c.x - fy * 14, c.y + fx * 14, { cop: 1, st: 'chase', sh: hex('#24246d'), hair: hex('#101010'), sp: 1.25 }); return; }
  if (c.out) { c.vx *= .9; c.vy *= .9; moveCar(c); if (PL.car && dp > 100) c.out = 0; return; }
  // four stars and up: they shoot out the window
  if (SU.wanted >= 4 && !SU.search && dp < 140) { c.gun = (c.gun ?? 60) - 1; if (c.gun <= 0) { c.gun = 100 + rnd(60); shoot(c.x, c.y, Math.atan2(p.y - c.y, p.x - c.x) + (Math.random() - .5) * .3, 'cop'); } }
  let gx = p.x, gy = p.y;
  if (dp > 90) { // follow the distance field two tiles ahead
    let tx = Math.floor(c.x / T), ty = Math.floor(c.y / T);
    for (let k = 0; k < 2; k++) { let best = DF[ty * MW + tx], bx = tx, by = ty; for (const [dx, dy] of DV) { const j = (ty + dy) * MW + tx + dx, v = DF[j]; if (v >= 0 && (best < 0 || v < best)) { best = v; bx = tx + dx; by = ty + dy; } } tx = bx; ty = by; }
    gx = tx * T + 16; gy = ty * T + 16;
  }
  if (c.rev > 0) { c.rev--; carPhys(c, 0, 1, 0, 0); return; }
  const df = angD(c.a, Math.atan2(gy - c.y, gx - c.x)), sp = carPhys(c, Math.abs(df) < 1.4, Math.abs(df) > 2.2 && Math.hypot(c.vx, c.vy) > 2, df < -.08, df > .08);
  if (sp < .25) { if (++c.stuck > 50) { c.rev = 40; c.stuck = 0; } } else c.stuck = 0;
}
function carCollide() {
  const cs = CARS.filter(c => !c.dead && c.z < 20);
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j], ra = CARM[a.m], rb = CARM[b.m]; if (!!ra.water !== !!rb.water) continue;
    const lim = (ra.L + rb.L) / 2; if (Math.abs(a.x - b.x) > lim || Math.abs(a.y - b.y) > lim) continue;
    // two circles per car, front and back
    const pa = circles(a), pb = circles(b);
    for (const [ax, ay, ar] of pa) for (const [bx, by, br] of pb) {
      const dx = bx - ax, dy = by - ay, dd = Math.hypot(dx, dy) || 1, ov = ar + br - dd; if (ov <= 0) continue;
      const nx = dx / dd, ny = dy / dd, rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      const ka = a.parked ? .2 : b.m === 'bus' || b.m === 'yacht' ? .85 : .5, kb = 1 - ka;
      shove(a, -nx * ov * ka, -ny * ov * ka); shove(b, nx * ov * kb, ny * ov * kb);
      if (rel > 0) { a.vx -= nx * rel * .7; a.vy -= ny * rel * .7; b.vx += nx * rel * .7; b.vy += ny * rel * .7; if (rel > 1.2 && (a === PL.car || b === PL.car || rel > 2.6)) { dmgCar(a, rel * 5); dmgCar(b, rel * 5); sfx('land'); if (a === PL.car || b === PL.car) { post.shake = 2; const o = a === PL.car ? b : a; o.lastHit = frame; if (o.drv === 'cop') { if (!o.chase) crime(6, o.x, o.y, 1); } else crime(2, o.x, o.y); } } }
    }
  }
}
// a shove slides a car along walls but never into one (or off the map)
function shove(c, dx, dy) { c.x += dx; if (carHits(c, c.x, c.y)) c.x -= dx; c.y += dy; if (carHits(c, c.x, c.y)) c.y -= dy; }
function circles(c) { const M = CARM[c.m], [fx, fy] = fwd(c), r = M.Wd / 2 + 1, n = Math.max(1, Math.round(M.L / M.Wd)), out = []; for (let i = 0; i < n; i++) { const u = (n === 1 ? 0 : (i / (n - 1) - .5) * (M.L - M.Wd)); out.push([c.x + fx * u, c.y + fy * u, r]); } return out; }
function inCar(c, x, y, pad = 3) { const M = CARM[c.m], [fx, fy] = fwd(c), rx = x - c.x, ry = y - c.y; return Math.abs(rx * fx + ry * fy) < M.L / 2 + pad && Math.abs(-rx * fy + ry * fx) < M.Wd / 2 + pad; }
function stepCars() {
  for (const c of CARS) {
    if (c.dead) continue;
    if (c.fire > 0) { if (frame % 3 === 0) fx(c.x + rnd(10) - 5, c.y + rnd(10) - 5, 8, 'fire'); if (--c.fire === 0) explode(c); }
    if (c.wreck || c.parked) { c.vx *= .9; c.vy *= .9; moveCar(c); continue; }
    if (c === PL.car || c === PL.remote) continue;
    if (c.script) c.script(c); else if (c.drv === 'ai') aiCar(c); else if (c.drv === 'cop') copCar(c); else { c.vx *= .93; c.vy *= .93; moveCar(c); }
    // anyone driving runs people over
    const sp = Math.hypot(c.vx, c.vy);
    if (sp > 1) for (const q of PEDS) if (q.st !== 'down' && inCar(c, q.x, q.y)) knock(q, c.vx, c.vy, null);
    if (!PL.car && sp > 1.2 && !PL.down && inCar(c, PL.x, PL.y)) { hurt(sp * 5); PL.down = 40; PL.x += c.vx * 6; PL.y += c.vy * 6; unstick(PL); }
  }
}
function explode(c) {
  c.wreck = 1; c.fire = 0; c.col = hex('#242424'); c.drv = null; c.chase = 0; c.siren = 0; if (d2(c, plPos()) < 260 * 260) { sfx('powerdown'); post.shake = 5; post.flash = .4; }
  blastFX(c.x, c.y);
  for (let i = 0; i < 24; i++) fx(c.x, c.y, 10, i < 12 ? 'fire' : 'smoke', (Math.random() - .5) * 4, (Math.random() - .5) * 4);
  for (const q of PEDS) if (d2(q, c) < 50 * 50) knock(q, q.x - c.x, q.y - c.y, null);
  if (PL.car === c) { exitCar(true); hurt(60); } else if (!PL.car && d2(PL, c) < 46 * 46) { hurt(40); PL.down = 50; }
  for (const o of CARS) if (o !== c && !o.wreck && d2(o, c) < 44 * 44) { o.lastHit = c.lastHit; dmgCar(o, 60); }
  if (c === PL.car || frame - (c.lastHit ?? -1e9) < 900) { crime(6, c.x, c.y); SU.stat.cars++; } // only Carl's wrecks are Carl's fault
}
// ---------------- people ----------------
const pedOK = (x, y) => !solidPed(tileOf(x - 3, y - 3)) && !solidPed(tileOf(x + 3, y - 3)) && !solidPed(tileOf(x - 3, y + 3)) && !solidPed(tileOf(x + 3, y + 3)) && !obAt(x - 3, y - 3) && !obAt(x + 3, y - 3) && !obAt(x - 3, y + 3) && !obAt(x + 3, y + 3);
function movePed(q, dx, dy) { let m = 0; if (pedOK(q.x + dx, q.y)) { q.x += dx; m = 1; } if (pedOK(q.x, q.y + dy)) { q.y += dy; m = 1; } return m; }
function unstick(q) { if (pedOK(q.x, q.y)) return; for (let r = 4; r < 80; r += 4) for (let a = 0; a < 6.28; a += .5) { const x = q.x + Math.cos(a) * r, y = q.y + Math.sin(a) * r; if (pedOK(x, y)) { q.x = x; q.y = y; return; } } }
function knock(q, vx, vy, by) {
  if (q.st === 'down') return; const m = Math.hypot(vx, vy) || 1; q.st = 'down'; q.t = 150 + rnd(60); q.kx = vx / m * 3; q.ky = vy / m * 3; sfx('hurt'); SU.stat.peds++;
  if (by === 'pl') { if (q.cop) crime(6, q.x, q.y, 1); else crime(2, q.x, q.y); } if (q.onKnock) q.onKnock(q);
}
const GETUP = ['OW.', 'MY BACK.', 'I SAW THAT, CARL.', 'NICE MASK, CARL.', 'I HAVE A LAWYER.', 'WHY.', 'RUDE!', 'I WAS WALKING HERE.', 'THAT TICKLED.'];
const HOLD = ['IS THAT A STICK?', 'TAKE IT! TAKE IT!', 'OKAY OKAY!', 'HI CARL.', 'I DIDN\'T SEE ANYTHING.', 'NOT AGAIN.', 'IS THIS FOR A VIDEO?'];
function stepPeds() {
  const p = plPos();
  for (const q of PEDS) {
    if (q.dead) continue;
    if (q.st === 'down') { if (q.kx) { movePed(q, q.kx, q.ky); q.kx *= .85; q.ky *= .85; if (Math.abs(q.kx) < .1) q.kx = 0; } if (--q.t <= 0) { q.st = q.cop ? 'chase' : 'flee'; q.t = 120; if (!q.cop && d2(q, p) < 260 * 260 && Math.random() < .5) pop(q.x, q.y, pick(GETUP), '#f0f0f0'); } continue; }
    if (q.st === 'dance') { q.walk += 2; q.a += .16; if (--q.t <= 0) q.st = q.cop ? 'chase' : 'walk'; continue; }
    if (q.st === 'hands') { if (--q.t === 0) { const n = q.cash || 5 + rnd(36); dropCash(q.x, q.y, n); q.st = 'flee'; q.t = 160; q.script = null; } continue; }
    if (q.script) { q.script(q); continue; }
    if (q.cop) { copPed(q); continue; }
    if (q.st === 'flee') { const a = Math.atan2(q.y - (q.fy ?? p.y), q.x - (q.fx ?? p.x)); q.a = a; if (!movePed(q, Math.cos(a) * 1.6, Math.sin(a) * 1.6)) q.a += 1; q.walk++; if (--q.t <= 0) { q.st = 'walk'; q.fx = q.fy = undefined; } continue; }
    if (q.st === 'idle') continue;
    // wander the sidewalk; turn at the curb
    const dx = Math.cos(q.a) * q.sp, dy = Math.sin(q.a) * q.sp, nt = tileOf(q.x + dx * 8, q.y + dy * 8);
    if (nt === TL.road || solidPed(nt) || obAt(q.x + dx * 8, q.y + dy * 8) || --q.t <= 0) { q.a = rnd(4) * Math.PI / 2 + (Math.random() - .5) * .3; q.t = 60 + rnd(200); }
    else { movePed(q, dx, dy); q.walk++; }
  }
}
function copPed(q) {
  const p = plPos(); if (!SU.wanted) { q.st = 'walk'; q.cop = 2; q.a = Math.atan2(q.y - p.y, q.x - p.x); movePed(q, Math.cos(q.a), Math.sin(q.a)); if (d2(q, p) > 300 * 300) q.dead = 1; return; }
  q.cop = 1; if (SU.search > 0 && SU.lk) { const d = Math.sqrt(d2(q, SU.lk)); if (d > 10) { const w = intWaypoint(q, SU.lk) || SU.lk; q.a = Math.atan2(w.y - q.y, w.x - q.x); movePed(q, Math.cos(q.a) * q.sp * .7, Math.sin(q.a) * q.sp * .7); q.walk++; } return; }
  const d = Math.sqrt(d2(q, p)); q.a = Math.atan2(p.y - q.y, p.x - q.x);
  const wp = intWaypoint(q, p), ma = wp ? Math.atan2(wp.y - q.y, wp.x - q.x) : q.a;
  if (d > 12) { movePed(q, Math.cos(ma) * q.sp, Math.sin(ma) * q.sp); q.walk++; }
  if (!PL.car && d < 13 && !PL.down && !wallBetween(q, p)) PL.bust += 2;
  if (SU.wanted >= 2 && d < 150 && --q.t <= 0) { q.t = 70 + rnd(50) - SU.wanted * 6; shoot(q.x, q.y, q.a + (Math.random() - .5) * .25, 'cop'); }
  if (PL.car && d < 18 && Math.hypot(PL.car.vx, PL.car.vy) < .4 && SU.wanted) { PL.bust += 1; } // dragged out of a parked car
  if (d > 520) q.dead = 1;
}
function dropCash(x, y, n) { PICK.push({ x: x + rnd(8) - 4, y: y + rnd(8) - 4, k: 'cash', v: n, t: 1200 }); }
// ---------------- shooting, the stick ----------------
function shoot(x, y, a, from) { SHOTS.push({ x, y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, t: 40, from }); if (d2({ x, y }, plPos()) < 300 * 300) sfx(from === 'cop' ? 'tick' : 'jump'); }
function stepShots() {
  for (const s of SHOTS) {
    s.x += s.vx; s.y += s.vy; if (--s.t <= 0 || solidPed(tileOf(s.x, s.y)) || obAt(s.x, s.y)) { s.t = 0; continue; }
    if (s.from === 'cop') {
      if (PL.car ? inCar(PL.car, s.x, s.y, 0) : d2(s, PL) < 36) { s.t = 0; if (PL.car) dmgCar(PL.car, 3); else hurt(5); }
    } else {
      for (const q of PEDS) if (q.st !== 'down' && d2(q, s) < 36) { s.t = 0; knock(q, s.vx, s.vy, 'pl'); if (!q.cop) crime(3, q.x, q.y); break; }
      for (const c of CARS) if (s.t && c !== PL.car && c.z < 20 && inCar(c, s.x, s.y, 0)) { s.t = 0; c.lastHit = frame; dmgCar(c, 6); if (c.drv === 'cop') crime(6, c.x, c.y, 1); if (c.onShot) c.onShot(c); }
    }
  }
  SHOTS = SHOTS.filter(s => s.t > 0);
}
function useWeapon() {
  const w = SU.wep[SU.wi];
  if (PL.swing <= 0 && SU.onSwing && SU.onSwing()) { PL.swing = 18; return; } // mission targets (jewel cases) break with any weapon
  if (w === 'PEASHOOTER') { if (PL.swing > 0) return; PL.swing = 12; shoot(PL.x + Math.cos(PL.a) * 6, PL.y + Math.sin(PL.a) * 6, PL.a, 'pl'); crime(4, PL.x, PL.y); return; }
  if (PL.swing > 0) return; PL.swing = 18;
  if (w !== 'STICK' && stickExtra(w)) return;
  // the stick: anyone in front puts their hands up. very close, it's a bonk.
  const fx = Math.cos(PL.a), fy = Math.sin(PL.a);
  let best = null, bd = 1e9;
  for (const q of PEDS) { if (q.st === 'down' || q.st === 'hands' || q.noHold) continue; const rx = q.x - PL.x, ry = q.y - PL.y, al = rx * fx + ry * fy, lt = Math.abs(-rx * fy + ry * fx); if (al > 0 && al < 30 && lt < 12 && al < bd) { best = q; bd = al; } }
  if (best && best.onHold) { best.onHold(best); return; }
  if (best && bd < 9) { knock(best, fx, fy, 'pl'); pop(best.x, best.y, 'BONK', '#ffdb49'); return; }
  if (best && best.cop) { pop(best.x, best.y, "THAT'S A STICK.", '#9fb8ff'); crime(12, best.x, best.y, 1); return; }
  if (best) { best.st = 'hands'; best.t = 50; pop(PL.x, PL.y, 'THIS IS A STICK UP!', '#ff49db'); speak('this is a stick up', { pitch: 1.3 }); pop(best.x, best.y - 10, pick(HOLD), '#f0f0f0'); SU.stat.stickups++; crime(3, best.x, best.y); for (const o of PEDS) if (o !== best && !o.cop && o.st === 'walk' && d2(o, PL) < 90 * 90) { o.st = 'flee'; o.t = 100; } return; }
  pop(PL.x + fx * 10, PL.y + fy * 10, pick(['WHOOSH', '*SWISH*']), '#b6b6b6');
}
// the STICK-NATION catalog
function stickExtra(w) {
  const fx = Math.cos(PL.a), fy = Math.sin(PL.a), ahead = (o, reach, half) => { const rx = o.x - PL.x, ry = o.y - PL.y, al = rx * fx + ry * fy; return al > -4 && al < reach && Math.abs(-rx * fy + ry * fx) < half; };
  if (w === 'BIG STICK') {
    PL.swing = 26; let n = 0;
    for (const q of PEDS) if (q.st !== 'down' && !q.noHit && ahead(q, 36, 22)) { knock(q, fx, fy, 'pl'); n++; }
    for (const c of CARS) if (c !== PL.car && !c.wreck && c.z < 20 && ahead(c, 34, 20)) { c.vx += fx * 3; c.vy += fy * 3; c.lastHit = frame; dmgCar(c, 12); n++; }
    pop(PL.x + fx * 14, PL.y + fy * 14, n ? 'BIG BONK' : 'BIG WHIFF', '#ffdb49'); if (n) { post.shake = 2; sfx('land'); } return true;
  }
  if (w === 'STICKY BOMB') {
    if (!SU.ammo.bomb) { pop(PL.x, PL.y, 'OUT OF STICKY BOMBS', '#ff2449'); return true; }
    SU.ammo.bomb--; PL.swing = 20; const b = { x: PL.x + fx * 18, y: PL.y + fy * 18, t: 110, car: null };
    b.car = CARS.find(c => !c.wreck && c !== PL.car && c.z < 20 && inCar(c, b.x, b.y, 8)) || null; BOMBS.push(b); pop(b.x, b.y, b.car ? 'STUCK IT' : 'STICKY BOMB (' + SU.ammo.bomb + ' LEFT)', '#ff6d24'); sfx('switch'); return true;
  }
  if (w === 'GLOW STICK') {
    if (SU.glowT > 0) { pop(PL.x, PL.y, 'GLOW STICK RECHARGING', '#24ffdb'); return true; }
    SU.glowT = 480; PL.swing = 30; let n = 0; for (const q of PEDS) if (q.st !== 'down' && !q.noHold && d2(q, PL) < 150 * 150) { q.st = 'dance'; q.t = 300 + rnd(60); n++; }
    eatPills(.15); pop(PL.x, PL.y - 12, n ? 'EVERYBODY DANCE' : 'DANCING ALONE (STILL COUNTS)', '#24ffdb'); sfx('object'); return true;
  }
  if (w === 'JOYSTICK') {
    PL.swing = 30; let best = null, bd = 1e9;
    for (const c of CARS) { if (c.wreck || c.dead || c === PL.car || c.z > 5 || CARM[c.m].ship || c.noEnter) continue; const rx = c.x - PL.x, ry = c.y - PL.y, al = rx * fx + ry * fy; if (al > 0 && al < 140 && Math.abs(-rx * fy + ry * fx) < 40 && al < bd) { best = c; bd = al; } }
    if (!best) { pop(PL.x, PL.y, 'NO CAR TO JOY', '#9fb8ff'); return true; }
    if (best.drv === 'ai' || best.drv === 'cop') pop(best.x, best.y, pick(['MY CAR IS DRIVING ITSELF', 'IS THIS A CARL THING', 'I AM NOT TOUCHING THE WHEEL']), '#f0f0f0');
    if (best.drv === 'cop') crime(10, best.x, best.y, 1); else crime(3, best.x, best.y);
    best.drv = 'remote'; best.script = null; best.chase = 0; PL.remote = best; sfx('phase'); pop(PL.x, PL.y - 12, 'JOYSTICK: A TO LET GO', '#9fb8ff'); return true;
  }
  return false;
}
function stepBombs() {
  for (const b of BOMBS) { if (b.car) { b.x = b.car.x; b.y = b.car.y; } if (--b.t > 0) continue;
    post.shake = 6; post.flash = .3; sfx('powerdown'); blastFX(b.x, b.y); for (let i = 0; i < 20; i++) fx(b.x, b.y, 8, i < 12 ? 'fire' : 'smoke', (Math.random() - .5) * 4, (Math.random() - .5) * 4);
    for (const q of PEDS) if (d2(q, b) < 52 * 52) knock(q, q.x - b.x, q.y - b.y, 'pl');
    for (const c of CARS) if (!c.wreck && c.z < 20 && d2(c, b) < 44 * 44) { c.lastHit = frame; dmgCar(c, b.car === c ? 200 : 90); }
    if (!PL.car && d2(PL, b) < 44 * 44) { hurt(35); PL.down = 40; } crime(8, b.x, b.y); if (SU.onBomb) SU.onBomb(b); }
  BOMBS = BOMBS.filter(b => b.t > 0);
}
function hurt(n) { if (PL.inv > 0 || SU.cut || SU.god) return; SU.hp = Math.max(0, SU.hp - n); PL.inv = 8; sfx('hurt'); post.flash = .15; }
// ---------------- getting in and out ----------------
function enterCar() {
  let best = null, bd = 1e9;
  for (const c of CARS) { if (c.wreck || c.dead || c.noEnter || (c.m === 'ass' && !SU.ship)) continue; const M = CARM[c.m], d = Math.sqrt(d2(c, PL)); if (d < M.L / 2 + 14 && d < bd) { best = c; bd = d; } }
  if (!best) return false;
  if (best.drv === 'ai' || best.drv === 'cop') {
    const [fx, fy] = fwd(best); const q = spawnPed(best.x - fy * 14, best.y + fx * 14, { st: best.drv === 'cop' ? 'chase' : 'flee', t: 140, cop: best.drv === 'cop' ? 1 : 0 });
    if (best.drv === 'cop') { q.sh = hex('#24246d'); q.hair = hex('#101010'); q.sp = 1.2; crime(14, best.x, best.y, 1); }
    else { pop(q.x, q.y, pick(['MY CAR!', 'HEY! CARL!', 'THAT\'S A RENTAL!', 'I JUST GOT IT DETAILED!']), '#f0f0f0'); crime(3, best.x, best.y); }
  }
  best.drv = 'pl'; best.chase = 0; best.siren = best.m === 'cop' ? best.siren : 0; best.script = null; best.parked = 0; PL.car = best; sfx('door'); radioOn(); if (best.onEnter) best.onEnter(best);
  return true;
}
function exitCar(force) {
  const c = PL.car; if (!c) return;
  if (!force && Math.hypot(c.vx, c.vy) > 1.2) return;
  if (c.z > 4) { pop(c.x, c.y, 'LAND FIRST. (A)', '#ffdb49'); return; }
  const [fx, fy] = fwd(c), M = CARM[c.m];
  for (const s of [1, -1, 2, -2]) { const x = c.x - fy * (M.Wd / 2 + 7) * Math.sign(s) * Math.abs(s), y = c.y + fx * (M.Wd / 2 + 7) * Math.sign(s) * Math.abs(s); if (pedOK(x, y)) { PL.x = x; PL.y = y; break; } if (Math.abs(s) === 2 && !force && !carHits(c, c.x, c.y)) { pop(c.x, c.y, M.water ? "YOU CAN'T SWIM. YOU'RE AN ALIEN." : 'NO ROOM.', '#ffdb49'); return; } }
  if (force || carHits(c, c.x, c.y)) { PL.x = c.x - fy * (M.Wd / 2 + 7); PL.y = c.y + fx * (M.Wd / 2 + 7); unstick(PL); }
  PL.a = c.a; c.drv = null; c.vx *= .5; c.vy *= .5; PL.car = null; sfx('door'); radioOff(); if (c.onExit) c.onExit(c);
}
// ---------------- the player ----------------
function stepPlayer() {
  if (PL.inv > 0) PL.inv--; if (PL.swing > 0) PL.swing--;
  const free = !SU.cut && !DLG && !MENUS.length;
  if (PL.remote) {
    const r = PL.remote;
    if (r.dead || r.wreck || (free && (pressed.a || pressed.c)) || d2(r, PL) > 760 * 760) { r.drv = null; PL.remote = null; pop(PL.x, PL.y, 'JOYSTICK OFF', '#9fb8ff'); }
    else { carPhys(r, free && held.up, free && held.down, free && held.left, free && held.right); if (Math.hypot(r.vx, r.vy) > 1) for (const q of PEDS) if (q.st !== 'down' && inCar(r, q.x, q.y)) knock(q, r.vx, r.vy, 'pl'); if (!PL.car && inCar(r, PL.x, PL.y) && Math.hypot(r.vx, r.vy) > 1.2) { hurt(10); PL.down = 30; } return; }
  }
  const c = PL.car;
  if (c) {
    const M = CARM[c.m];
    if (M.ship) return stepShip(c, free);
    carPhys(c, free && held.up, free && held.down, free && held.left, free && held.right);
    const sp = Math.hypot(c.vx, c.vy);
    if (sp > 1) for (const q of PEDS) if (q.st !== 'down' && inCar(c, q.x, q.y)) { knock(q, c.vx, c.vy, 'pl'); if (q.cop) crime(6, q.x, q.y, 1); }
    if (free && pressed.a) exitCar(); else if (free && pressed.c) radioNext();
    else if (free && pressed.b) { sfx('ask'); for (const q of PEDS) if (!q.cop && q.st === 'walk' && d2(q, c) < 70 * 70) { q.st = 'flee'; q.t = 50; } pop(c.x, c.y, 'HONK', '#ffdb49'); }
    PL.x = c.x; PL.y = c.y; PL.a = c.a;
    return;
  }
  if (PL.down > 0) { PL.down--; return; }
  if (!free) return;
  let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0), dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
  if (dx || dy) { const m = Math.hypot(dx, dy), sp = 1.45; PL.a = Math.atan2(dy, dx); movePed(PL, dx / m * sp, dy / m * sp); PL.walk++; if (PL.walk % 14 === 0) sfx('step'); }
  if (pressed.a) { if (!enterCar()) { const pi = nearPoi(); if (pi) pi.use(pi); else { const pl = Object.values(PLACES).find(p => p.door && d2(p, PL) < 24 * 24); if (pl && pl.use) pl.use(pl); } } }
  if (pressed.b) useWeapon();
  if (pressed.c && SU.wep.length > 1) { SU.wi = (SU.wi + 1) % SU.wep.length; sfx('switch'); pop(PL.x, PL.y, SU.wep[SU.wi], '#9fb8ff'); }
  for (const k of PICK) if (k.t > 0 && (k.k === 'cash' || k.k === 'pills') && d2(k, PL) < 14 * 14) { k.t = 0; if (k.k === 'cash') { SU.cash += k.v; pop(PL.x, PL.y, '$' + k.v, '#6dff92'); sfx('switch'); } else if (k.k === 'pills') { SU.hp = Math.min(100, SU.hp + 40); eatPills(); pop(PL.x, PL.y, 'PROP PILLS', '#ff49db'); sfx('get'); k.respawn = 1800; } if (k.onGet) k.onGet(k); }
  if (PL.bust > 0) PL.bust = Math.max(0, PL.bust - 1);
}
// the A.S.S.: drive it like a car on the ground, A takes off, A again lands where the ground is flat
function stepShip(c, free) {
  if (c.lift) { c.z += c.lift; if (c.z >= 90) { c.z = 90; c.lift = 0; } if (c.z <= 0) { c.z = 0; c.lift = 0; } }
  const M = CARM.ass, [fx, fy] = fwd(c);
  if (c.z > 20) { // flying: thrust pushes along the CURRENT heading and drag bleeds off speed, so turning redirects future thrust without yanking existing momentum around
    c.a += ((free && held.right ? 1 : 0) - (free && held.left ? 1 : 0)) * .055;
    const [gx, gy] = fwd(c);
    if (free && held.up) { c.vx += gx * M.acc; c.vy += gy * M.acc; } else if (free && held.down) { c.vx -= gx * M.acc * .7; c.vy -= gy * M.acc * .7; }
    c.vx *= .965; c.vy *= .965;
    const sp = Math.hypot(c.vx, c.vy); if (sp > 5.5) { c.vx *= 5.5 / sp; c.vy *= 5.5 / sp; }
    c.x = clamp(c.x + c.vx, 40, GW - 40); c.y = clamp(c.y + c.vy, 40, GH - 40);
  } else carPhys(c, free && held.up, free && held.down, free && held.left, free && held.right);
  if (free && pressed.a) { if (c.z > 20 && !c.lift) { if (!solidCar(tileOf(c.x, c.y)) && !carHits(Object.assign({}, c, { z: 0 }), c.x, c.y)) { c.lift = -1.5; } else pop(c.x, c.y, "CAN'T LAND ON THAT", '#ffdb49'); } else if (c.z === 0) { if (Math.hypot(c.vx, c.vy) < 1) exitCar(); } }
  if (free && pressed.c && c.z === 0) { c.lift = 1.2; sfx('power'); }
  else if (free && pressed.c && c.z > 20) radioNext();
  if (free && pressed.b && c.z > 20) beam(c);
  PL.x = c.x; PL.y = c.y; PL.a = c.a;
}
function beam(c) {
  c.beam = 24; sfx('phase');
  const hit = PICK.find(k => k.k === 'crate' && k.t > 0 && d2(k, c) < 26 * 26) || CARS.find(o => o !== c && !o.tag && o.z < 5 && d2(o, c) < 24 * 24) || PEDS.find(q => !q.tag && d2(q, c) < 22 * 22);
  if (!hit) return;
  if (hit.k === 'crate') { hit.t = 0; c.cargo = (c.cargo || 0) + 1; pop(c.x, c.y, 'CRATE ABOARD', '#6dff92'); if (hit.onGet) hit.onGet(hit); return; }
  hit.dead = 1; pop(c.x, c.y, hit.k === 'car' ? 'ABDUCTED A CAR' : 'ABDUCTED A GUY (WILL RETURN HIM)', '#24ffdb'); crime(5, c.x, c.y, 1); SU.stat.abduct = (SU.stat.abduct || 0) + 1;
}
// ---------------- fx ----------------
function fx(x, y, z, k, vx = 0, vy = 0) { FX.push({ x, y, z, k, vx: vx + (Math.random() - .5) * .6, vy: vy + (Math.random() - .5) * .6, vz: k === 'fire' ? .6 : .3, t: k === 'fire' ? 26 : 50, t0: k === 'fire' ? 26 : 50 }); }
function pop(x, y, s, c) { FX.push({ x, y, z: 30, k: 'txt', s, c: hex(c), vx: 0, vy: 0, vz: .25, t: 90, t0: 90 }); }
function stepFX() { for (const f of FX) { f.x += f.vx; f.y += f.vy; f.z += f.vz; if (f.k === 'debris') { f.vz -= .25; if (f.z < 0) { f.z = 0; f.vz *= -.3; f.vx *= .6; f.vy *= .6; } f.rot += f.spin; } f.vx *= .95; f.vy *= .95; f.t--; } FX = FX.filter(f => f.t > 0); if (FX.length > 260) FX.splice(0, FX.length - 260); }
// ---------------- one frame of the city ----------------
function stepWorld() {
  if (SU.paused) return;
  stepGTA();
  if (!SU.cut) { if (frame % 30 === 0) SU.min = (SU.min + 1) % 1440; if (SU.glowT > 0) SU.glowT--; }
  stepTrip(); stepBombs(); stepSide();
  bfsPlayer(); populate(); stepInts(); stepPlayer(); stepCars(); carCollide(); stepPeds(); stepShots(); stepFX(); stepLaw();
  for (const h of FLY) if (h.step) h.step(h); FLY = FLY.filter(h => !h.dead);
  for (const m of MARKS) if (m.follow) { m.x = m.follow.x; m.y = m.follow.y; }
  for (const k of PICK) { if (k.t > 0 && k.k === 'cash') k.t--; if (k.respawn && --k.respawn === 0) k.t = 1; }
  PICK = PICK.filter(k => k.t > 0 || k.respawn);
  if (PL.car && PL.car.wreck) exitCar(true);
  if (PL.car && PL.car.hp < 30 && !PL.car.fire && frame % 8 === 0) fx(PL.car.x, PL.car.y, 8, 'smoke');
  if (PL.bust > 60 && !SU.end) { SU.end = 'busted'; }
  if (SU.hp <= 0 && !SU.end) SU.end = 'wasted';
  // the camera leans ahead and pulls back with speed
  const p = plPos(), sp = Math.hypot(p.vx || 0, p.vy || 0), fly = PL.car && PL.car.z > 20;
  const zs = fly ? .62 : PL.car ? clamp(1 - sp * .07, .7, 1) : 1;
  if (INN) { CAM.s += (INN.fit - CAM.s) * .1; CAM.x += (INN.cx + 12 / INN.fit - CAM.x) * .14; CAM.y += (INN.cy - 6 / INN.fit - CAM.y) * .14; }
  else { CAM.s += (zs - CAM.s) * (CAM.s > 1.04 && !PL.car ? .1 : .03); CAM.x += (p.x + (p.vx || 0) * 22 - CAM.x) * .12; CAM.y += (p.y + (p.vy || 0) * 22 - CAM.y) * .12; }
  const ar = areaAt(p.x, p.y); if (ar !== SU.area) { SU.area = ar; SU.areaT = 150; }
  if (SU.timer > 0) SU.timer--;
}
function warpCam() { const p = plPos(); CAM.x = p.x; CAM.y = p.y; CAM.s = 1; }
// ---------------- drawing ----------------
const rotP = (c, u, v, z) => { const ca = Math.cos(c.a), sa = Math.sin(c.a), x = c.x + u * ca - v * sa, y = c.y + u * sa + v * ca; return [projX(x, z), projY(y, z)]; };
function boxAt(c, u0, u1, v0, v1, z, col) { quadF(rotP(c, u0, v0, z), rotP(c, u1, v0, z), rotP(c, u1, v1, z), rotP(c, u0, v1, z), col); }
function drawCar(c) {
  const M = CARM[c.m], L = M.L / 2, w = M.Wd / 2, z0 = c.z || 0;
  if (M.ship) return drawShip(c);
  const body = c.col, dk = mix(body, BLACK, .35), glass = hex('#24304a');
  boxAt(c, -L + 1, L + 1, -w + 1, w + 2, 0, hex('#101014')); // shadow
  if (M.water) { // a hull with a pointed bow, then the wake
    const bow = rotP(c, L + 6, 0, 4), a = rotP(c, L - 4, -w, 4), b = rotP(c, L - 4, w, 4); triF(bow[0], bow[1], a[0], a[1], b[0], b[1], body);
    boxAt(c, -L, L - 4, -w, w, 4, body); boxAt(c, -L + 4, -L + 14, -w + 2, w - 2, 8, dk); if (c.m === 'yacht') { boxAt(c, -L + 8, L - 18, -w + 3, w - 3, 14, hex('#dbdbdb')); boxAt(c, -L + 14, L - 26, -w + 5, w - 5, 20, glass); }
    else boxAt(c, L - 14, L - 8, -w + 2, w - 2, 9, glass);
    if (Math.hypot(c.vx, c.vy) > 1 && frame % 2 === 0) { const [fx2, fy2] = fwd(c); FX.push({ x: c.x - fx2 * L, y: c.y - fy2 * L, z: 0, k: 'wake', vx: 0, vy: 0, vz: 0, t: 40, t0: 40 }); }
    return;
  }
  if (!c.wreck && nightAmt() > .4 && (c.drv || c === PL.remote)) { const a = rotP(c, L, -w + 2, 1), b = rotP(c, L, w - 2, 1), e = rotP(c, L + 46, -16, 1), f = rotP(c, L + 46, 16, 1); quadF(a, b, f, e, BEAM); }
  boxAt(c, -L, L, -w, w, 5, dk); boxAt(c, -L + 1, L - 1, -w + 1, w - 1, 7, body);
  if (c.m === 'bus') { boxAt(c, -L + 2, L - 2, -w + 2, w - 2, 12, mix(body, WHITE, .3)); for (let u = -L + 6; u < L - 6; u += 8) boxAt(c, u, u + 5, -w + 1, -w + 3, 11, glass); boxAt(c, L - 6, L - 2, -w + 2, w - 2, 12, glass); }
  else if (c.m === 'truck' || c.m === 'firetruck') { boxAt(c, -L + 2, L - 12, -w + 1, w - 1, 15, c.m === 'firetruck' ? hex('#6d1818') : hex('#a0a080')); boxAt(c, L - 10, L - 4, -w + 2, w - 2, 11, glass); if (c.m === 'firetruck') boxAt(c, -L + 4, L - 14, -3, 3, 20, hex('#dbdbdb')); }
  else if (c.m === 'van' || c.m === 'ambulance') { boxAt(c, -L + 2, L - 7, -w + 2, w - 2, 12, mix(body, WHITE, .15)); boxAt(c, L - 7, L - 3, -w + 2, w - 2, 10, glass); if (c.m === 'ambulance') { boxAt(c, -L * .1, L * .1, -2, 2, 15, hex('#db2424')); boxAt(c, -2, 2, -w * .5, w * .5, 15, hex('#db2424')); } }
  else { boxAt(c, L * .1, L * .45, -w + 2, w - 2, 10, glass); boxAt(c, -L * .45, L * .1, -w + 2, w - 2, 12, c.wreck ? body : mix(body, WHITE, .12)); boxAt(c, -L * .65, -L * .45, -w + 2, w - 2, 10, glass); }
  if (c.m === 'taxi') boxAt(c, -L * .2, -L * .05, -3, 3, 14, hex('#f0f0f0'));
  if (c.m === 'cop') { const f = (frame >> 3) & 1, s = c.siren; boxAt(c, -L * .25, -L * .1, -w + 2, 0, 14, s && f ? hex('#ff2424') : hex('#6d2424')); boxAt(c, -L * .25, -L * .1, 0, w - 2, 14, s && !f ? hex('#2449ff') : hex('#24246d')); boxAt(c, L * .5, L * .9, -w + 1, w - 1, 8, hex('#101010')); }
  if (c.m === 'ambulance' || c.m === 'firetruck') { const f = (frame >> 3) & 1, on = c.drv === 'pl'; boxAt(c, -L * .25, -L * .1, -w + 2, 0, 14, on && f ? hex('#ff2424') : hex('#6d1818')); boxAt(c, -L * .25, -L * .1, 0, w - 2, 14, on && !f ? hex('#f0f0f0') : hex('#6d6d6d')); }
  if (c.m === 'luxor') boxAt(c, L * .5, L * .9, -1, 1, 8, hex('#101010'));
  if (!c.wreck) { const hl = hex('#ffffdb'), tl = hex('#ff2424'); for (const v of [-w + 2, w - 3]) { const a = rotP(c, L - 1, v + .5, 7), b = rotP(c, -L + 1, v + .5, 7); rectF(a[0], a[1], 2, 2, hl); rectF(b[0], b[1], 2, 2, tl); } }
  if (c.fire) { const p = rotP(c, 0, 0, 12); circF(p[0], p[1], 3 + (frame % 4), hex('#ffb624')); }
}
function drawShip(c) {
  const z = c.z || 0, s = CAM.s, sx = projX(c.x, 0), sy = projY(c.y, 0), px = projX(c.x, z + 8), py = projY(c.y, z + 8), k = CAM.ZC / (CAM.ZC - z - 8), r = 17 * s * k;
  if (z > 2) { circF(sx, sy, 15 * s, hex('#101014')); } else circF(sx + 2, sy + 2, 16 * s, hex('#101014'));
  if (c.beam) { c.beam--; for (let i = 0; i < 8; i++) { const t = i / 8; circF(px + (sx - px) * t, py + (sy - py) * t, (4 + t * 10) * s, hex('#49ffdb')); } }
  circF(px, py, r, hex('#6d6d92')); circF(px, py, r - 2 * s, hex('#b6b6db')); circF(px - r * .2, py - r * .2, r * .45, hex('#24dbff')); circF(px - r * .3, py - r * .3, r * .15, hex('#dbffff'));
  for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28 + frame * .05; rectF(px + Math.cos(a) * (r - 3), py + Math.sin(a) * (r - 3), 2, 2, (i + (frame >> 3)) & 1 ? hex('#ffdb49') : hex('#ff49db')); }
  const [fx2, fy2] = fwd(c); rectF(px + fx2 * r * .8 - 1, py + fy2 * r * .8 - 1, 3, 3, hex('#6dff92'));
  if (c.cargo) text('x' + c.cargo, px - 6, py + r + 2, hex('#6dff92'));
}
function drawPed(q, isPL) {
  const s = CAM.s, z = 6, dz = q.st === 'dance' ? Math.sin(q.walk * .3) * 2 : 0, x = projX(q.x, z) + dz, y = projY(q.y, z) - Math.abs(dz), fx2 = Math.cos(q.a), fy2 = Math.sin(q.a);
  if (q.st === 'down' || (isPL && PL.down)) {
    rectF(x - 4 * s, y - 1, 9 * s, 3, hex('#101014'));
    circF(x - fx2 * 2 * s, y - fy2 * 2 * s, 3 * s, q.sh); circF(x + fx2 * 4 * s, y + fy2 * 4 * s, 2.4 * s, isPL ? hex('#101010') : q.skin);
    for (let i = 0; i < 3; i++) { const a = frame * .15 + i * 2.1; pset(x + Math.cos(a) * 6, y - 6 + Math.sin(a) * 2, hex('#ffdb49')); }
    return;
  }
  circF(projX(q.x, 0) + 1, projY(q.y, 0) + 1, 4 * s, hex('#101014'));
  const st = Math.sin((q.walk || 0) * .4) * 3 * s; // feet
  pset(x + fx2 * st - fy2 * 2, y + fy2 * st + fx2 * 2, hex('#242424')); pset(x - fx2 * st + fy2 * 2, y - fy2 * st - fx2 * 2, hex('#242424'));
  circF(x - fy2 * 2.2 * s, y + fx2 * 2.2 * s, 2.6 * s, q.sh); circF(x + fy2 * 2.2 * s, y - fx2 * 2.2 * s, 2.6 * s, q.sh); circF(x, y, 2.6 * s, q.sh);
  if (q.st === 'hands') { pset(x - fy2 * 4, y + fx2 * 4 - 2, q.skin); pset(x + fy2 * 4, y - fx2 * 4 - 2, q.skin); }
  const hx = projX(q.x, 10), hy = projY(q.y, 10);
  if (isPL) { // Carl: a black ski mask with his big green eyes showing, the yellow bow tie
    circF(hx, hy, 2.8 * s, hex('#101018')); pset(hx + fx2 * 2 - fy2, hy + fy2 * 2 + fx2, hex('#a8ff58')); pset(hx + fx2 * 2 + fy2, hy + fy2 * 2 - fx2, hex('#a8ff58'));
    pset(x + fx2 * 3, y + fy2 * 3, hex('#ffd820'));
    const w = SU.wep[SU.wi]; if (w === 'STICK') { const r = PL.swing > 8 ? 11 : 8, a = q.a + (PL.swing > 8 ? Math.sin(PL.swing) * .6 : .4); lineF(x + Math.cos(a) * 3, y + Math.sin(a) * 3, x + Math.cos(a) * r, y + Math.sin(a) * r, hex('#926d24')); }
    else lineF(x + fx2 * 3, y + fy2 * 3, x + fx2 * 7, y + fy2 * 7, hex('#6d6d6d'));
    return;
  }
  if ((SU.trip > .6 || SU.below) && !q.ghost) { // tripping: every head is an eye looking at Carl
    const la = Math.atan2(PL.y - q.y, PL.x - q.x); circF(hx, hy, 3.4 * s, hex('#f0f0f0')); circF(hx + Math.cos(la) * 1.4, hy + Math.sin(la) * 1.4, 1.7 * s, q.cop ? hex('#ff2424') : q.hair); pset(hx + Math.cos(la) * 1.8, hy + Math.sin(la) * 1.8, BLACK); return;
  }
  circF(hx, hy, 2.4 * s, q.skin); circF(hx - fx2 * .8, hy - fy2 * .8, 2 * s, q.cop ? hex('#101024') : q.hair);
  if (q.hat) circF(hx, hy, 2.6 * s, hex(q.hat));
  if (q.look) q.look(q, hx, hy, s);
  if (q.ghost) { circF(x, y, 4 * s, hex('#e8e8ff')); circF(hx, hy, 3 * s, hex('#f0f0ff')); rectF(hx - 2, hy, 5, 1, hex('#101018')); }
}
function drawWorld() {
  drawGround(); drawSkids();
  for (const f of FX) if (f.k === 'wake') { const a = f.t / f.t0; circF(projX(f.x, 0), projY(f.y, 0), (1 - a) * 6 * CAM.s + 1, mix(GC.water, WHITE, a * .7)); }
  for (const m of MARKS) { if (m.hide) continue; const x = projX(m.x, 0), y = projY(m.y, 0), r = (m.r || 16) * CAM.s, pul = Math.sin(frame * .12) * 2; ringF(x, y, r + pul, hex(m.c || '#ffdb49')); ringF(x, y, r - 2 + pul, hex(m.c || '#ffdb49')); if (m.ch) text(m.ch, x - 2, y - 3, hex(m.c || '#ffdb49')); }
  for (const k of PICK) if (k.t > 0) { const x = projX(k.x, 2), y = projY(k.y, 2), b = Math.sin(frame * .1 + k.x) * 1.5;
    if (k.k === 'cash') { rectF(x - 4, y - 2 + b, 8, 5, hex('#24924a')); text('$', x - 2, y - 3 + b, hex('#b6ff92'), 0); }
    else if (k.k === 'pills') { rectF(x - 3, y - 5 + b, 6, 9, hex('#ff49db')); rectF(x - 3, y - 6 + b, 6, 2, WHITE); }
    else if (k.k === 'crate') { const q = projX(k.x, k.z || 0), w = projY(k.y, k.z || 0); rectF(q - 6, w - 6, 12, 12, hex('#926d24')); frameRect(q - 6, w - 6, 12, 12, hex('#493610')); lineF(q - 6, w - 6, q + 5, w + 5, hex('#493610')); }
    else if (k.k === 'can') { rectF(x - 3, y - 4, 7, 9, hex('#db2424')); rectF(x - 1, y - 6, 3, 2, hex('#dbdb24')); }
    else if (k.k === 'case') { rectF(x - 8, y - 5, 16, 10, hex('#101024')); rectF(x - 7, y - 4, 14, 8, hex('#c8f0ff')); frameRect(x - 7, y - 4, 14, 8, WHITE); if ((frame >> 4) & 1) pset(x - 2 + (k.x & 3), y - 1, WHITE); } }
  const vis = (o, m = 60) => Math.abs(o.x - CAM.x) < W / CAM.s / 2 + m && Math.abs(o.y - CAM.y) < H / CAM.s / 2 + m;
  for (const q of PEDS) if (q.st === 'down' && vis(q)) drawPed(q);
  for (const c of CARS) if (c.wreck && vis(c)) drawCar(c);
  for (const q of PEDS) if (q.st !== 'down' && !q.seat && vis(q)) drawPed(q);
  if (!PL.car) drawPed(PL, true);
  for (const c of CARS) if (!c.wreck && (c.z || 0) < 20 && vis(c, 80)) drawCar(c);
  for (const s of SHOTS) { const x = projX(s.x, 8), y = projY(s.y, 8); rectF(x - 1, y - 1, 2, 2, s.from === 'cop' ? hex('#ff6d24') : hex('#6dff92')); }
  for (const b of BOMBS) { const x = projX(b.x, 9), y = projY(b.y, 9); rectF(x - 2, y - 2, 4, 4, (b.t >> 2) & 1 ? hex('#ff2424') : hex('#242424')); }
  drawEyes(0); drawBuildings(); drawSeated(); drawTrees(); drawEyes(1); drawGTAWorld();
  for (const c of CARS) if ((c.z || 0) >= 20) drawCar(c);
  for (const h of FLY) if (h.draw) h.draw(h);
  drawDrift();
  for (const f of FX) {
    if (f.k === 'wake') continue; const x = projX(f.x, f.z), y = projY(f.y, f.z), a = f.t / f.t0;
    if (f.k === 'txt') { const sx = (x - f.s.length * 3) | 0; text(f.s, sx, y | 0, f.c, BLACK); continue; }
    if (f.k === 'ring') { const rr = (f.r0 + (1 - a) * 46) * CAM.s; ringF(x, y, rr, hex('#ffdb49')); ringF(x, y, rr - 2, mix(hex('#ff6d24'), BLACK, 1 - a)); continue; }
    if (f.k === 'debris') { const sz = 3 * CAM.s; rectF(x - sz / 2, y - sz / 2, sz, sz, mix(hex('#6d6d6d'), BLACK, 1 - a * .6)); continue; }
    if (f.k === 'fire') circF(x, y, 1 + a * 4, a > .6 ? hex('#ffdb49') : a > .3 ? hex('#ff6d24') : hex('#924924'));
    else circF(x, y, 2 + (1 - a) * 5, mix(hex('#6d6d6d'), hex('#242424'), 1 - a));
  }
  drawPrompts();
}
// ---------------- the HUD ----------------
function drawStar(x, y, on) { const c = on ? hex('#ffdb49') : hex('#3a3a52'), P = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i & 1 ? 2.2 : 5.5; P.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } for (let i = 0; i < 10; i++) triF(x, y, P[i][0], P[i][1], P[(i + 1) % 10][0], P[(i + 1) % 10][1], c); }
function drawHUD() {
  const cash = '$' + String(Math.max(0, SU.cash | 0)).padStart(8, '0'); text(cash, 6, 6, hex('#6dff92'), BLACK, 2);
  rectF(6, 23, 62, 6, hex('#05081a')); rectF(7, 24, (60 * SU.hp / 100) | 0, 4, SU.hp > 30 ? hex('#ff2449') : (frame >> 3) & 1 ? hex('#ff2449') : hex('#6d2424'));
  text(PL.remote ? 'JOYSTICK (A: LET GO)' : PL.car ? (PL.car.m === 'ass' ? 'A.S.S.' + (PL.car.z > 20 ? ' (FLYING)' : ' (C: TAKE OFF)') : 'CAR ' + Math.max(0, PL.car.hp | 0) + '%') : SU.wep[SU.wi] + (SU.wep[SU.wi] === 'STICKY BOMB' ? ' x' + SU.ammo.bomb : ''), 72, 23, hex('#9fb8ff'));
  const hh = (SU.min / 60) | 0, mm = SU.min % 60; text((hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm, 6, 33, nightAmt() > .5 ? hex('#9fb8ff') : hex('#ffdb49'));
  if (SU.trip > .04 || SU.below) { const tr = Math.min(1, tripAmt()); text(SU.below ? 'THE BELOW' : 'TRIP', 44, 33, hex('#ff49db')); for (let i = 0; i < ((56 * tr) | 0); i++) rectF(100 + i, 34, 1, 5, rgb(128 + 127 * Math.sin(i * .2 + frame * .1), 128 + 127 * Math.sin(i * .2 + frame * .1 + 2), 128 + 127 * Math.sin(i * .2 + frame * .1 + 4))); }
  drawRadar(W - MW - 6, 6, blips());
  const sx = W - MW - 6, flash = SU.search > 0 && (frame >> 4) & 1;
  for (let i = 0; i < 5; i++) drawStar(sx + 6 + i * 12, MH + 18, i < SU.wanted && !flash);
  if (SU.timer > 0) { const s = Math.ceil(SU.timer / 60), str = (s / 60 | 0) + ':' + String(s % 60).padStart(2, '0'); text(str, 136, 8, s <= 10 && (frame >> 3) & 1 ? hex('#ff2449') : WHITE, BLACK, 2); }
  if (SU.bar) { text(SU.bar.label, 104, 30, WHITE); rectF(104, 40, 112, 6, hex('#05081a')); rectF(105, 41, (110 * clamp(SU.bar.v, 0, 1)) | 0, 4, hex(SU.bar.c || '#ff49db')); }
  if (SU.areaT > 0) { SU.areaT--; text(SU.area, W - SU.area.length * 12 - 8, H - 24, hex('#ffdb49'), BLACK, 2); }
  if (SU.job) { const s = Math.ceil(SU.jobT / 60); text(JOB_NAME[SU.job] + ' LV' + SU.jobLevel + '  ' + ((s / 60) | 0) + ':' + String(s % 60).padStart(2, '0'), 72, 33, hex('#ffdb24')); }
  if (SU.radioT > 0) { SU.radioT--; const s = STATIONS[SU.radio].name; ctext(s, 44, hex('#24ffdb')); }
  if (SU.chatLine && PL.car && STATIONS[SU.radio].chat) text(SU.chatLine, 8, H - 12, hex('#b6b6db'));
  if (SU.obj && !DLG) { const ls = wrapT(SU.obj, 46); ls.forEach((l, i) => ctext(l, H - 36 + i * 10 - (ls.length - 1) * 10, WHITE)); }
  // an arrow at the edge of the screen toward the objective
  const m = MARKS.find(m => m.arrow !== false && !m.hide);
  if (m) { const x = projX(m.x, 0), y = projY(m.y, 0); if (x < 0 || y < 0 || x > W || y > H) { const a = Math.atan2(y - CYs, x - CXs), ex = CXs + Math.cos(a) * 140, ey = CYs + Math.sin(a) * 92; triF(ex + Math.cos(a) * 8, ey + Math.sin(a) * 8, ex + Math.cos(a + 2.4) * 6, ey + Math.sin(a + 2.4) * 6, ex + Math.cos(a - 2.4) * 6, ey + Math.sin(a - 2.4) * 6, hex(m.c || '#ffdb49')); } }
  if (SU.big) { const b = SU.big; if (b.t-- > 0) { text(b.s, ((W - b.s.length * 18) / 2) | 0, 84, hex(b.c), BLACK, 3); if (b.sub) ctext(b.sub, 112, WHITE); } else SU.big = null; }
  if (SU.paused) drawMap();
}
function blips() { const out = []; if (!SU.inMission && !SU.job && !SU.ramp) { for (const r of RAMPAGES) out.push({ x: r.pos.x, y: r.pos.y, c: hex('#ff24db') }); for (const s of STUNTS) if (!SU.jumps.includes(s.id)) out.push({ x: s.pos.x, y: s.pos.y, c: hex('#ffdb24') }); } for (const m of MARKS) if (!m.hide) out.push({ x: m.x, y: m.y, c: hex(m.c || '#ffdb49'), big: 1, ch: m.ch }); for (const c of CARS) if (c.drv === 'cop' && c.chase) out.push({ x: c.x, y: c.y, c: (frame >> 3) & 1 ? hex('#ff2424') : hex('#2449ff') }); for (const c of CARS) if (c.blip) out.push({ x: c.x, y: c.y, c: hex(c.blip), big: 1 }); const p = plPos(); out.push({ x: p.x, y: p.y, c: WHITE, big: 1, flash: 1 }); return out; }
function drawMap() {
  rectA(0, 0, W, H, hex('#05081a'), .8); const S = 3, ox = ((W - MW * S) / 2) | 0, oy = 22;
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) rectF(ox + tx * S, oy + ty * S, S, S, MINI[ty * MW + tx]);
  frameRect(ox - 1, oy - 1, MW * S + 2, MH * S + 2, hex('#9fb8ff'));
  ctext('VICE VERSA, NEVADA', 8, hex('#ffdb49'));
  for (const b of blips()) { const x = ox + b.x / T * S, y = oy + b.y / T * S; rectF(x - 2, y - 2, 5, 5, b.c); if (b.ch) text(b.ch, x + 4, y - 3, b.c); }
  const lab = [['GHOST HILLS', 4, 6], ['THE STRIP', 36, 6], ['DOWNTOWN', 22, 26], ['SOUTH SIDE', 4, 50], ['THE YARDS', 36, 50], ['LAKE MEED', 51, 28]];
  for (const [s, x, y] of lab) text(s, ox + x * S, oy + y * S, hex('#f0f0f0'));
  const C = completion(); rectF(0, H - 22, W, 22, hex('#05081a'));
  text('MISSIONS ' + C.m + '/' + MISSIONS.length + '  STRANGERS ' + C.st + '/' + STRANGERS.length + '  EYES ' + C.e + '/24  STICKS ' + C.w + '/5', 8, H - 20, hex('#ffdb49'));
  text(C.pct + '% COMPLETE' + (SU.thirdEye ? '   C: THIRD EYE' : '') + (SU.belowKey ? '   B: THE BELOW' : ''), 8, H - 10, hex('#ff49db'));
}
