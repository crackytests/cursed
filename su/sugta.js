'use strict';
// ================= STICK UP: the GTA staples. odd jobs, rampages, stunt jumps, cheat codes, the garage =================
Object.assign(CARM, {
  ambulance: { L: 30, Wd: 16, max: 3.4, acc: .08, turn: .045, grip: .78, cols: ['#f0f0f0'] },
  firetruck: { L: 40, Wd: 18, max: 3.2, acc: .065, turn: .034, grip: .75, cols: ['#db2424'] },
});
TRAFFIC.push('taxi'); // a few more cabs on the street
// ---------------- fixed world spots: every tile below is a lot column or a building's never-built back row, verified against sucity's genBlock so it holds regardless of the seed ----------------
const RAMPAGES = [
  { id: 'stickramp', at: [15, 53], name: 'STICK RAMPAGE', desc: 'BONK 12 PEOPLE IN 45 SECONDS.', weapon: 'BIG STICK', kind: 'ped', n: 12, time: 45 },
  { id: 'bombramp', at: [32, 52], name: 'BOMB RAMPAGE', desc: 'WRECK 8 CARS WITH STICKY BOMBS IN 60 SECONDS.', weapon: 'STICKY BOMB', kind: 'car', n: 8, time: 60 },
  { id: 'pearamp', at: [42, 7], name: 'PEASHOOTER RAMPAGE', desc: 'POP 18 PEOPLE IN 50 SECONDS.', weapon: 'PEASHOOTER', kind: 'ped', n: 18, time: 50 },
  { id: 'joyramp', at: [41, 43], name: 'JOYSTICK DEMOLITION', desc: 'WRECK 6 PARKED CARS IN 60 SECONDS.', weapon: 'JOYSTICK', kind: 'car', n: 6, time: 60 },
  { id: 'glowramp', at: [17, 15], name: 'GLOW RAMPAGE', desc: 'GET 12 PEOPLE DANCING AT ONCE.', weapon: 'GLOW STICK', kind: 'dance', n: 12, time: 40 },
];
const STUNTS = [[34, 53], [43, 44], [33, 43], [35, 44], [8, 15], [41, 8]].map((at, i) => ({ id: 'j' + i, at }));
for (const r of RAMPAGES) r.pos = { x: r.at[0] * T + 16, y: r.at[1] * T + 16 };
for (const s of STUNTS) s.pos = { x: s.at[0] * T + 16, y: s.at[1] * T + 16 };
// ---------------- odd jobs: get in the vehicle, the job starts; get out, it ends. high scores persist across new games ----------------
const JOB_VEH = { vigilante: 'cop', paramedic: 'ambulance', firefighter: 'firetruck', taxi: 'taxi' };
const JOB_NAME = { vigilante: 'VIGILANTE', paramedic: 'PARAMEDIC', firefighter: 'FIREFIGHTER', taxi: 'TAXI DRIVER' };
function jobsHi() { SUMETA.jobs = SUMETA.jobs || { vigilante: 0, paramedic: 0, firefighter: 0, taxi: 0 }; return SUMETA.jobs; }
function startJob(job) {
  SU.job = job; SU.jobLevel = 1; SU.jobT = 60 * 45; SU.jobMark = null; SU.jobStage = 'pickup'; SU.jobDest = null;
  bigText(JOB_NAME[job], '#ffdb24', 80, 'LEVEL 1'); setMus(null);
  if (job === 'vigilante') spawnCrim(); else if (job === 'paramedic') spawnVictim(); else if (job === 'firefighter') igniteBlaze(); else if (job === 'taxi') spawnFare();
}
function endJob() {
  if (!SU.job) return;
  const lvl = SU.jobLevel - 1, job = SU.job, hi = jobsHi(), p = plPos();
  if (lvl > 0) { if (lvl > (hi[job] || 0)) { hi[job] = lvl; saveSUM(); pop(p.x, p.y, 'NEW RECORD: ' + JOB_NAME[job] + ' LEVEL ' + lvl, '#ffdb49'); } else pop(p.x, p.y, JOB_NAME[job] + ' LEVEL ' + lvl, '#9fb8ff'); }
  for (const c of CARS) if (c.jobTag) c.dead = 1; for (const q of PEDS) if (q.jobTag) q.dead = 1;
  if (SU.jobMark) unmark(SU.jobMark); SU.jobMark = null; SU.job = null; SU.jobT = 0; SU.jobDest = null;
}
function spawnCrim() {
  if (SU.jobMark) unmark(SU.jobMark);
  const t = offscreenTile(220, 420, (tx, ty) => laneDirs(tx, ty).length === 1);
  if (!t) { SU.jobMark = null; return; }
  const c = laneCar(pick(['sports', 'sedan']), t[0], t[1], { blip: '#ff2424', cruise: 2.1 + SU.jobLevel * .07, tag: 'gtajob' });
  if (!c) { SU.jobMark = null; return; }
  c.jobTag = 1; c.hp = 26 + SU.jobLevel * 7; c.minHp = 6;
  c.onDmg = cc => { if (cc.hp <= 6 && !cc.busted) { cc.busted = 1; cc.dead = 1; crimBusted(); } };
  SU.jobMark = mark(c.x, c.y, { follow: c, c: '#ff2424', r: 24, arrow: false });
}
function crimBusted() {
  const p = plPos(); SU.cash += 80 + SU.jobLevel * 20; SU.jobLevel++; SU.jobT = Math.min(60 * 45, SU.jobT + 60 * 8);
  pop(p.x, p.y, 'SUSPECT DOWN. LEVEL ' + SU.jobLevel, '#ff2424'); sfx('get'); spawnCrim();
}
function spawnVictim() {
  if (SU.jobMark) unmark(SU.jobMark);
  const t = dropSpot(200, 650), q = spawnPed(t.x, t.y, { st: 'idle', noHold: 1, sh: hex('#f0f0f0'), hair: hex('#6d4924'), tag: 'gtajob' });
  q.jobTag = 1; q.victim = 1; unstick(q); SU.jobStage = 'pickup';
  SU.jobMark = mark(q.x, q.y, { follow: q, c: '#ff49db', ch: '+', r: 14 });
}
function stepParamedic() {
  const p = plPos();
  if (SU.jobStage === 'pickup') {
    const q = PEDS.find(q => q.victim && !q.dead);
    if (q && PL.car && d2(q, p) < 28 * 28) { q.dead = 1; if (SU.jobMark) unmark(SU.jobMark); SU.jobStage = 'drop'; SU.jobMark = mark(PLACES.hosp.x, PLACES.hosp.y, { c: '#ff49db', ch: '+', r: 18, arrow: false }); pop(p.x, p.y, 'PATIENT ABOARD', '#ff49db'); }
  } else if (SU.jobStage === 'drop' && PL.car && d2(PLACES.hosp, p) < 38 * 38) {
    SU.cash += 100 + SU.jobLevel * 25; SU.jobLevel++; SU.jobT = Math.min(60 * 45, SU.jobT + 60 * 8);
    pop(p.x, p.y, 'PATIENT SAVED. LEVEL ' + SU.jobLevel, '#ff49db'); sfx('ding'); spawnVictim();
  }
}
function igniteBlaze() {
  if (SU.jobMark) unmark(SU.jobMark);
  const near = CARS.filter(c => c.drv === 'ai' && !c.wreck && !c.jobTag && d2(c, plPos()) > 90 * 90 && d2(c, plPos()) < 700 * 700);
  const c = near.length ? pick(near) : spawnCar(pick(['sedan', 'van']), plPos().x + 160, plPos().y, 0, { drv: null });
  c.jobTag = 1; c.tag = 'gtajob'; c.blaze = 100; c.parked = 1; c.vx = c.vy = 0;
  SU.jobMark = mark(c.x, c.y, { follow: c, c: '#ff6d24', ch: '!', r: 20, arrow: false });
}
function stepFirefighter() {
  const c = CARS.find(c => c.jobTag && c.blaze > 0 && !c.dead);
  if (!c) { if (SU.jobMark) unmark(SU.jobMark); SU.jobLevel++; SU.cash += 90 + SU.jobLevel * 18; SU.jobT = Math.min(60 * 45, SU.jobT + 60 * 8); pop(plPos().x, plPos().y, 'FIRE OUT. LEVEL ' + SU.jobLevel, '#ff6d24'); sfx('get'); igniteBlaze(); return; }
  if (PL.car && PL.car.m === 'firetruck' && d2(c, PL.car) < 55 * 55) { c.blaze = Math.max(0, c.blaze - 18); if (frame % 5 === 0) fx(c.x, c.y, 8, 'smoke'); if (c.blaze <= 0) c.dead = 1; }
}
function spawnFare() {
  if (SU.jobMark) unmark(SU.jobMark);
  const t = dropSpot(150, 500), q = spawnPed(t.x, t.y, { st: 'idle', noHold: 1, sh: hex('#ffdb24'), tag: 'gtajob' });
  q.jobTag = 1; q.fare = 1; unstick(q); SU.jobStage = 'pickup';
  SU.jobMark = mark(q.x, q.y, { follow: q, c: '#ffdb24', ch: 'T', r: 14 });
}
function stepTaxi() {
  const p = plPos();
  if (SU.jobStage === 'pickup') {
    const q = PEDS.find(q => q.fare && !q.dead);
    if (q && PL.car && d2(q, p) < 28 * 28) {
      q.dead = 1; if (SU.jobMark) unmark(SU.jobMark); const d = dropSpot(300, 900); SU.jobDest = d; SU.jobStage = 'drop';
      SU.jobMark = mark(d.x, d.y, { c: '#ffdb24', ch: 'T', r: 18, arrow: false }); pop(p.x, p.y, 'FARE ABOARD', '#ffdb24');
      SU.jobT = Math.min(SU.jobT, 60 * (18 + Math.hypot(d.x - p.x, d.y - p.y) / 28));
    }
  } else if (SU.jobStage === 'drop' && PL.car && SU.jobDest && d2(SU.jobDest, p) < 34 * 34) {
    SU.cash += 70 + SU.jobLevel * 15; SU.jobLevel++; SU.jobT = Math.min(60 * 45, SU.jobT + 60 * 6);
    pop(p.x, p.y, 'FARE PAID. LEVEL ' + SU.jobLevel, '#ffdb24'); sfx('ding'); spawnFare();
  }
}
function stepJob() {
  if (SU.jobT > 0) SU.jobT--; else { endJob(); return; }
  if (SU.job === 'paramedic') stepParamedic(); else if (SU.job === 'firefighter') stepFirefighter(); else if (SU.job === 'taxi') stepTaxi();
}
// ---------------- rampages: walk up to the marker, press A, go ----------------
let RAMPSAVE = null;
async function offerRampage(r) {
  if (SU.inMission || SU.job || SU.ramp || SU.cut) return;
  SU.cut = 1; const owned = SU.wep.includes(r.weapon); const c = await ask(r.name + ': ' + r.desc + (owned ? '' : ' (FREE ' + r.weapon + ' FOR THIS ONE)'), 'CARL', ['GO', 'NOT NOW']); SU.cut = 0;
  if (c === 0) startRampage(r);
}
function startRampage(r) {
  SU.ramp = r.id; SU.rampProg = 0; SU.rampGoal = r.n; SU.rampT = r.time * 60;
  RAMPSAVE = { wep: SU.wep.slice(), wi: SU.wi, bomb: SU.ammo.bomb };
  if (!SU.wep.includes(r.weapon)) SU.wep.push(r.weapon);
  SU.wi = SU.wep.indexOf(r.weapon); if (r.kind === 'car' && r.weapon === 'STICKY BOMB') SU.ammo.bomb = 99;
  spawnRampTargets(r); bigText(r.name, '#ff24db', 80, 'GO!'); setMus('su_tense');
}
function spawnRampTargets(r) {
  const p = plPos();
  for (let i = 0; i < r.n; i++) {
    const a = i / r.n * 6.2832;
    if (r.kind === 'ped' || r.kind === 'dance') { const q = spawnPed(p.x + Math.cos(a) * (r.kind === 'dance' ? 70 : 100), p.y + Math.sin(a) * (r.kind === 'dance' ? 70 : 100), { noHold: 1, tag: 'gtaramp' }); unstick(q); q.rampTag = 1; if (r.kind === 'ped') q.onKnock = () => { SU.rampProg++; }; }
    else { const c = spawnCar(pick(['sedan', 'taxi', 'van']), p.x + Math.cos(a) * 150, p.y + Math.sin(a) * 150, a, { drv: null, parked: 1, col: pick(CARM.sedan.cols), tag: 'gtaramp' }); c.rampTag = 1; c.hp = 40; }
  }
}
function stepRamp() {
  if (!SU.ramp) return;
  const r = RAMPAGES.find(r => r.id === SU.ramp);
  if (r.kind === 'dance') SU.rampProg = PEDS.filter(q => q.rampTag && q.st === 'dance').length;
  else if (r.kind === 'car') for (const c of CARS) if (c.rampTag && c.wreck && !c.rampCounted) { c.rampCounted = 1; SU.rampProg++; }
  SU.bar = { label: r.name, v: SU.rampProg / SU.rampGoal, c: '#ff24db' };
  if (SU.rampProg >= SU.rampGoal) return endRampage(true);
  if (--SU.rampT <= 0) endRampage(false);
}
function endRampage(won) {
  for (const q of PEDS) if (q.rampTag) q.dead = 1; for (const c of CARS) if (c.rampTag) c.dead = 1;
  if (RAMPSAVE) { SU.wep = RAMPSAVE.wep; SU.wi = Math.min(RAMPSAVE.wi, SU.wep.length - 1); SU.ammo.bomb = RAMPSAVE.bomb; RAMPSAVE = null; }
  if (won) { SU.rampDone[SU.ramp] = (SU.rampDone[SU.ramp] || 0) + 1; SU.cash += 400; SU.stat.ramps = (SU.stat.ramps || 0) + 1; bigText('RAMPAGE!', '#ff24db', 110, '+$400'); sfx('get'); }
  else bigText('RAMPAGE OVER', '#9aa4d0', 80, SU.rampProg + '/' + SU.rampGoal);
  SU.ramp = null; SU.rampT = 0; SU.bar = null; setMus(null);
}
// ---------------- stunt jumps: drive through fast, no button needed ----------------
function stepStunts() {
  if (!PL.car || CARM[PL.car.m].water || CARM[PL.car.m].ship) return;
  if (Math.hypot(PL.car.vx, PL.car.vy) < 3.1) return;
  for (const s of STUNTS) { if ((SU.jumps || []).includes(s.id) || d2(s.pos, PL.car) >= 26 * 26) continue;
    SU.jumps.push(s.id); SU.cash += 500; post.shake = 4; post.flash = .25; sfx('get');
    for (let i = 0; i < 24; i++) fx(s.pos.x, s.pos.y, 10, i % 2 ? 'fire' : 'smoke', (Math.random() - .5) * 4, (Math.random() - .5) * 4);
    bigText('UNIQUE JUMP!', '#ffdb24', 100, '+$500'); }
}
// ---------------- the frame hook ----------------
function stepGTA() {
  stepWeather(); stepSkids();
  if (SU.cut) return;
  stepRamp(); stepStunts();
  for (const c of CARS) if (c.blaze > 0 && frame % 4 === 0) fx(c.x + rnd(10) - 5, c.y + rnd(10) - 5, 9, 'fire');
  const want = PL.car && !PL.car.wreck ? JOB_VEH_R(PL.car.m) : null;
  if (!SU.inMission && !SU.ramp) { if (want && SU.job !== want) startJob(want); else if (!want && SU.job) endJob(); }
  else if (SU.job) endJob();
  if (SU.job) stepJob();
  if (!SU.inMission && !SU.ramp && !SU.job && !PL.car) for (const r of RAMPAGES) if (pressed.a && d2(r.pos, PL) < 20 * 20) run(() => offerRampage(r));
}
const JOB_VEH_R = m => m === 'cop' ? 'vigilante' : m === 'ambulance' ? 'paramedic' : m === 'firetruck' ? 'firefighter' : m === 'taxi' ? 'taxi' : null;
function drawGTAWorld() {
  for (const r of RAMPAGES) { if (Math.abs(r.pos.x - CAM.x) > 300 || Math.abs(r.pos.y - CAM.y) > 220) continue; const x = projX(r.pos.x, 0), y = projY(r.pos.y, 0), rr = 14 * CAM.s, pul = Math.sin(frame * .1) * 2; ringF(x, y, rr + pul, hex('#ff24db')); ringF(x, y, rr - 3 + pul, hex('#ff24db')); }
  for (const s of STUNTS) { if ((SU.jumps || []).includes(s.id) || Math.abs(s.pos.x - CAM.x) > 300 || Math.abs(s.pos.y - CAM.y) > 220) continue;
    const x = projX(s.pos.x, 1), y = projY(s.pos.y, 1), ww = 18 * CAM.s;
    for (let i = -2; i <= 2; i++) rectF(x - ww / 2, y - ww / 2 + i * 6 + ((frame >> 2) % 6), ww, 3, (i & 1) ? hex('#ffdb24') : hex('#101010')); }
}
// ---------------- cheat codes: type them while playing, GTA-style ----------------
let CHEATBUF = '';
const CHEATS = {
  HOMEBASIC: () => { for (const w of ['BIG STICK', 'STICKY BOMB', 'GLOW STICK', 'JOYSTICK', 'PEASHOOTER']) if (!SU.wep.includes(w)) SU.wep.push(w); SU.ammo.bomb = 20; pop(plPos().x, plPos().y, 'CHEAT: HOMO BASIC NO MORE', '#ffdb49'); },
  ABOVEBELOW: () => { SU.cheatGod = !SU.cheatGod; SU.god = SU.cheatGod; pop(plPos().x, plPos().y, SU.cheatGod ? 'CHEAT: ABOVE AND BELOW (INVINCIBLE)' : 'CHEAT: BACK TO NORMAL', '#ffdb49'); },
  STICKPARTY: () => { for (const q of PEDS) if (q.st !== 'down') { q.st = 'dance'; q.t = 400; } pop(plPos().x, plPos().y, 'CHEAT: STICK PARTY', '#24ffdb'); },
  SPOOKYMODE: () => { if (SU.inMission) return; SU.below = !SU.below; SU.noLaw = SU.below; SU.tripLock = SU.below ? 1 : 0; SU.trip = SU.below ? 1 : .3; pop(plPos().x, plPos().y, 'CHEAT: SPOOKY MODE', '#ff49db'); },
  FLYINGSAUCER: () => { SU.ship = 1; const a = CARS.find(c => c.tag === 'ass'); if (a && !a.dead) { if (PL.car) exitCar(true); a.x = plPos().x; a.y = plPos().y; a.z = 60; a.hp = 100; PL.car = a; a.drv = 'pl'; } pop(plPos().x, plPos().y, 'CHEAT: FLYING SAUCER', '#24dbff'); },
  WANTEDLEVEL: () => { setWanted(SU.wanted < 5 ? SU.wanted + 1 : 0); pop(plPos().x, plPos().y, 'CHEAT: WANTED ' + SU.wanted, '#ff2424'); },
};
addEventListener('keydown', e => {
  if (!/^[a-zA-Z0-9]$/.test(e.key)) return;
  CHEATBUF = (CHEATBUF + e.key.toUpperCase()).slice(-24);
  for (const code in CHEATS) if (CHEATBUF.endsWith(code)) { CHEATBUF = ''; if (scene === gameScene && !SU.cut) { CHEATS[code](); sfx('phase'); SU.stat.cheats = (SU.stat.cheats || 0) + 1; } }
});
