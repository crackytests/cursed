'use strict';
// ================= STICK UP: the missions. C = Carl's own, F = Face, G = Spooky Ghost =================
const C_ = { giver: 'crib', ch: 'C', c: '#6dff92' }, F_ = { giver: 'face', ch: 'F', c: '#ff49db' }, G_ = { giver: 'ghost', ch: 'G', c: '#e8e8ff' }, J_ = { giver: 'jb', ch: 'J', c: '#ff9a3a' };
const MISSIONS = [
  { id: 'stickup', name: 'THIS IS A STICK UP', ...C_, run: () => mStickup() },
  { id: 'proprun', name: 'PROP RUN', ...C_, run: () => mPropRun() },
  { id: 'homework', name: 'HOMEWORK', ...F_, run: () => mHomework() },
  { id: 'sticknation', name: 'STICK-NATION', ...F_, run: () => mStickNation() },
  { id: 'ghosted', name: 'GHOSTED', ...G_, run: () => mGhosted() },
  { id: 'propburn', name: 'PROP BURN', ...C_, run: () => mPropBurn() },
  { id: 'grassroots', name: 'GRASS ROOTS', ...C_, run: () => mGrassRoots(), act: ['ACT II', '', 'THE TRIP'] },
  { id: 'dockfright', name: 'DOCK FRIGHT', ...G_, run: () => mDockFright() },
  { id: 'thefed', name: 'THE FED', ...J_, run: () => mTheFed() },
  { id: 'flyass', name: 'FLY THE A.S.S.', ...C_, run: () => mFlyAss() },
  { id: 'counseling', name: 'MARRIAGE COUNSELING', ...G_, run: () => mCounseling() },
  { id: 'jewel', name: 'THE JEWEL STORE JOB', ...F_, run: () => mJewel() },
  { id: 'viceversa', name: 'VICE VERSA', ...C_, run: () => mViceVersa(), act: ['ACT III', '', 'ABOVE AND BELOW'] },
  { id: 'preptruck', name: 'BIG SCORE PREP: THE TRUCK', ...F_, run: () => mPrepTruck() },
  { id: 'prepprints', name: 'BIG SCORE PREP: BLUEPRINTS', ...J_, run: () => mPrepPrints() },
  { id: 'bigscore', name: 'THE BIG SCORE', ...F_, c: '#ffdb49', run: () => mBigScore() },
];
const nextMission = () => MISSIONS.find(m => !SU.done[m.id]);
class MFail { constructor(msg) { this.msg = msg; } }
async function until(label, cond, fail) {
  DBG.wait = label;
  for (;;) {
    if (SU.end) throw new MFail(null);
    const f = fail && fail(); if (f) throw new MFail(f);
    if (cond()) { DBG.wait = ''; return; }
    await nextFrame();
  }
}
function obj(s) { SU.obj = s; sfx('ask'); }
function mark(x, y, o = {}) { const m = Object.assign({ x, y, r: 16, c: '#ffdb49' }, o); MARKS.push(m); return m; }
const unmark = m => { MARKS = MARKS.filter(k => k !== m); };
const near = (o, r) => d2(plPos(), o) < r * r;
const onFootNear = (o, r) => !PL.car && d2(PL, o) < r * r;
async function cut(fn) { SU.cut = 1; if (PL.car) { PL.car.vx = PL.car.vy = 0; } try { await fn(); } finally { SU.cut = 0; } }
async function lines(a) { for (const [who, s] of a) await say(s, who); }
function chatter(id, a, gap = 200) { run(async () => { for (const [who, s] of a) { await wait(gap); if (SU.inMission !== id || SU.cut || SU.end) return; await say(s, who, { auto: 70 }); } }); }
function missionCleanup() {
  MARKS = []; FLY = []; Object.assign(SU, { obj: '', timer: 0, bar: null, onSwing: null, cut: 0, noLaw: 0, passenger: null });
  for (const c of CARS) if (c.tag && c.tag !== 'ass') { if (c === PL.car) { c.tag = null; c.script = null; c.blip = null; c.noEnter = 0; } else c.dead = 1; }
  for (const q of PEDS) if (q.tag && q.tag !== 'int') q.dead = 1; PICK = PICK.filter(k => k.k === 'pills' || k.k === 'cash'); SU.below = 0; SU.tripLock = 0; SU.onBomb = null;
  CARS = CARS.filter(c => !c.dead); PEDS = PEDS.filter(q => !q.dead);
}
async function runMission(id) {
  const M = MISSIONS.concat(SIDES, STRANGERS).find(m => m.id === id); SU.inMission = id; MARKS = []; DBG.mission = id; (DBG.log = DBG.log || []).push('start ' + id);
  if (M.act && !SU.acts[id]) { SU.acts[id] = 1; SU.cut = 1; await showCard(M.act, 200, { fg: hex('#ff49db'), sc: 2 }); SU.cut = 0; }
  bigText(M.name, M.stranger ? '#b6ff24' : '#ffdb49', 150); sfx('object');
  let ok = false, msg = null;
  try { SU.reward = 0; await M.run(); ok = true; } catch (e) { if (e instanceof MFail) msg = e.msg; else { console.error(e); msg = 'SOMETHING BROKE.'; DBG.log.push('ERROR ' + e.stack); } }
  const died = !!SU.end; missionCleanup(); SU.inMission = null; setMus(null);
  if (ok && M.stranger) SU.strangers[id] = 1;
  if (ok) { if (!M.side && !M.stranger) SU.done[id] = 1; SU.cash += SU.reward; bigText('MISSION PASSED', '#ffdb49', 200, SU.reward ? '$' + SU.reward : ''); sfx('get'); saveGame(); DBG.log.push('passed ' + id); }
  else { if (!died) bigText('MISSION FAILED', '#ff2449', 200, msg || ''); else SU.failNote = 1; DBG.log.push('failed ' + id + ' ' + (msg || (died ? SU.end : ''))); }
  return ok;
}
// ---------------- 1. THIS IS A STICK UP ----------------
async function mStickup() {
  if (!SU.stat.intro) { SU.stat.intro = 1; SU.cut = 1; await showCard(['VICE VERSA, NEVADA.', '', 'ABOVE AND BELOW IT,', 'A LITTLE GUY IN A SKI MASK', 'IS ABOUT TO HAVE AN IDEA.'], 230, { fg: hex('#9aa4d0') }); SU.cut = 0; }
  await cut(() => lines([
    ['CARL', 'Okay. Chat. Here is the situation.'],
    ['CARL', 'The A.S.S. needs gas. The gas is Prop Pills. Prop Pills cost money. I have no money.'],
    ['CARL', 'I have a ski mask. It is fashion. And I have this stick.'],
    ['CARL', 'Nobody look at the stick too hard. If you believe in the stick, the stick believes in you.'],
  ]));
  obj('GET A CAR (PRESS A NEXT TO ONE) AND DRIVE TO THE 7-11TY ON THE STRIP.'); const m = mark(PLACES.store.x, PLACES.store.y, { ch: '$', c: '#6dff92' });
  await until('m1_store', () => near(PLACES.store, 70));
  obj('GET OUT (A), WALK IN, AND UP TO THE COUNTER.'); m.x = PLACES.store.counter.x; m.y = PLACES.store.counter.y;
  await until('m1_door', () => onFootNear(PLACES.store.counter, 16)); unmark(m);
  await cut(() => lines([
    ['CARL', 'THIS IS A STICK UP.'], ['CLERK', "That's a stick."], ['CARL', "It's a gun. In a stick costume."], ['CLERK', '...Carl?'],
    ['CARL', "Who's Carl. I'm a normal human in a normal ski mask."], ['CLERK', "Hi Carl. Here's the register. I'm pressing the silent alarm. It's policy."], ['CARL', 'Thank you for telling me.'],
  ]));
  SU.cash += 250; SU.stat.stickups++; pop(PL.x, PL.y, '$250', '#6dff92'); SU.robbed = frame + 60 * 120; setWanted(2); setMus('su_tense');
  obj('LOSE THE COPS. STAY OUT OF SIGHT UNTIL THE STARS GO OUT.');
  await until('m1_lose', () => SU.wanted === 0);
  setMus(null); obj('GO BACK TO THE A.S.S. IN THE SOUTH SIDE.'); mark(PLACES.ass.x, PLACES.ass.y, { ch: 'C', c: '#6dff92', r: 22 });
  await until('m1_home', () => near(PLACES.ass, 60));
  await cut(() => lines([
    ['CARL', '$250. That is nine Prop Pills. That is gas for one day.'], ['CARL', 'I am going to need a bigger stick.'],
    ['CARL', '...My phone. Nobody has this number.'], ['FACE', "I have everybody's number, Carl. I watched your stick up. On eleven cameras."],
    ['FACE', 'Come see me. The comic shop in Midtown. Go in the back. Then into the basement. Then into the monitors.'],
    ['CARL', 'Tomorrow. Tomorrow is Tuesday. I have a job on Tuesday.'],
  ]));
}
// ---------------- 2. HOMEWORK ----------------
async function mHomework() {
  await cut(() => lines([
    ['FACE', "Welcome to the basement. I live on these monitors now. It's a long story and I'm on every channel of it."],
    ['FACE', 'You held that stick like you meant it. Planning is ninety percent believing in the stick.'],
    ['FACE', 'First, homework. A gold LUXOR at the casino valet on the Strip. I put cameras in it.'],
    ['CARL', 'Why do you need a car with cameras in it.'], ['FACE', 'So I can watch it come back. Keep it over fifty percent.'],
  ]));
  const v = PLACES.valet, lux = spawnCar('luxor', v.x, v.y, 0, { drv: null, tag: 'lux', blip: '#ffdb49' }), val = spawnPed(v.x + 10, v.y - 22, { tag: 'valet', st: 'idle', sh: hex('#b62424'), noHold: 0 });
  obj('STEAL THE GOLD LUXOR FROM THE CASINO VALET.'); const m = mark(lux.x, lux.y, { follow: lux, c: '#ffdb49' });
  await until('m2_steal', () => PL.car === lux, () => lux.wreck && 'THE LUXOR IS WRECKED.');
  pop(val.x, val.y, "HEY! THAT'S A GUEST'S CAR!", '#f0f0f0'); val.st = 'flee'; val.t = 200; setWanted(1);
  unmark(m); obj("DRIVE IT TO FACE'S GARAGE IN MIDTOWN. KEEP IT OVER 50%."); mark(PLACES.garage.x, PLACES.garage.y, { ch: 'F', c: '#ff49db', r: 20 });
  let told = 0;
  await until('m2_garage', () => {
    SU.bar = { label: 'LUXOR', v: lux.hp / 100, c: '#ffdb49' };
    if (PL.car !== lux || d2(lux, PLACES.garage) > 34 * 34) return false;
    if (SU.wanted) { if (!told++) obj('LOSE THE COPS FIRST. FACE IS ON CAMERA, NOT IN PRISON.'); return false; }
    return Math.hypot(lux.vx, lux.vy) < 1.5;
  }, () => (lux.hp < 50 || lux.wreck) && 'FACE SAW THE SCRATCH. ON ELEVEN CAMERAS.');
  SU.bar = null; exitCar(true); lux.noEnter = 1; lux.parked = 1;
  await cut(() => lines([
    ['FACE', `${lux.hp | 0} percent. You hit a hydrant. I watched you hit the hydrant.`],
    ['FACE', 'Every new guy gets a gun. This one shoots peas. C switches, B shoots.'], ['CARL', 'Peas.'],
    ['FACE', "People fall over. They get up. It's a very forgiving city."],
    ['FACE', "Somebody in Ghost Hills is asking for you. He's dead. Don't let it bother him."],
  ]));
  if (!SU.wep.includes('PEASHOOTER')) SU.wep.push('PEASHOOTER'); SU.reward = 500;
}
// ---------------- 3. GHOSTED ----------------
async function mGhosted() {
  await cut(() => lines([
    ['SPOOKY GHOST', "Carl. Come in. Don't wipe your feet, I can't feel the floor."],
    ['SPOOKY GHOST', "I faked my death in '89. In '91 I actually died. Witness protection didn't have a form for that."],
    ['SPOOKY GHOST', "My therapist says I need a win. Here's the loss: Linda. My first ex-wife. She still lives here. Spooky alimony."],
    ['SPOOKY GHOST', 'She got on a bus. The GALS GONE WILD bus. She says it is a hostile takeover. From the inside.'],
    ['SPOOKY GHOST', "If that tape airs, my story ends 'the ghost whose ex-wife'. A story cannot end on an apostrophe, Carl."],
    ['CARL', 'I will get her. I have a stick.'], ['SPOOKY GHOST', '...Is that a stick?'], ['CARL', "Don't look at it too hard."],
  ]));
  const bus = laneCar('bus', 21, HR[3] + 1, { tag: 'bus', blip: '#ff6db6', cruise: 2.7, noEnter: 1, minHp: 40, noLaw: 1 });
  bus.onDmg = c => { if (c.hp <= 40 && !c.parked) { c.parked = 1; c.vx *= .2; c.vy *= .2; pop(c.x, c.y, 'OKAY OKAY! PULLING OVER!', '#ff6db6'); } };
  SU.timer = 60 * 150; setMus('su_tense');
  obj('CATCH THE GALS GONE WILD BUS. RAM IT UNTIL IT PULLS OVER.'); const m = mark(bus.x, bus.y, { follow: bus, c: '#ff6db6', r: 30 });
  await until('m3_ram', () => { SU.bar = { label: 'BUS', v: (bus.hp - 40) / 60, c: '#ff6db6' }; return bus.parked; }, () => SU.timer <= 0 && 'THE TAPE AIRED. EVERYONE SAW. THE GHOST SAW.');
  SU.timer = 0; SU.bar = null; setMus(null); obj('GET OUT AND GET LINDA OFF THE BUS.'); m.r = 22;
  await until('m3_board', () => onFootNear(bus, 40), () => bus.wreck && 'THE BUS IS ON FIRE. LINDA IS FINE. SHE IS VERY ANGRY.');
  await cut(() => lines([
    ['DOUG WILDE', 'Whoa whoa whoa. Closed set, little guy.'], ['CARL', 'This is a stick up.'], ['DOUG WILDE', '...Is that a stick?'], ['CARL', 'Give me the tape. And the CEO.'],
    ['CEO LINDA', 'Carl. I was nine minutes from owning this company.'],
    ['CEO LINDA', 'Do you know what GALS GONE WILD is worth? Neither do they. That is the opportunity.'], ['CARL', 'Ghost sent me.'],
    ['CEO LINDA', "...Of course he did. He can't drive. He can't hold a tape. He can hold a grudge."],
    ['CEO LINDA', "Fine. Take me home. You're driving. I'm not getting back on this bus, the lighting is criminal."],
  ]));
  unmark(m); bus.parked = 0; bus.drv = 'ai'; bus.cruise = 2; bus.blip = null; bus.tag = 'bus2';
  const [fx2, fy2] = fwd(bus), lin = spawnPed(bus.x - fy2 * 16, bus.y + fx2 * 16, { tag: 'linda', noHit: 1, sh: hex('#18181e'), hair: hex('#ff70b8'), skin: hex('#f0d0c0'), noHold: 1, st: 'idle' });
  unstick(lin); lin.script = q => { const t = plPos(), d = Math.sqrt(d2(q, t)); if (d > 14) { q.a = Math.atan2(t.y - q.y, t.x - q.x); movePed(q, Math.cos(q.a) * 1.3, Math.sin(q.a) * 1.3); q.walk++; } };
  obj('GET A CAR. LINDA WILL GET IN.'); const lm = mark(lin.x, lin.y, { follow: lin, c: '#ff5aa8', r: 8 });
  await until('m3_car', () => PL.car && !CARM[PL.car.m].water && d2(lin, PL.car) < 40 * 40);
  lin.dead = 1; unmark(lm); SU.passenger = 'LINDA'; sfx('door');
  obj('DRIVE LINDA HOME TO GHOST HILLS.'); mark(PLACES.ghost.x, PLACES.ghost.y, { ch: 'G', c: '#e8e8ff', r: 22 }); setMus('su_lounge');
  chatter('ghosted', [['CEO LINDA', "You're wearing a ski mask."], ['CARL', "It's fashion."], ['CEO LINDA', "It's working. Don't tell Ghost."], ['CEO LINDA', 'Take the next left. I own the next left.']]);
  await until('m3_home', () => PL.car && near(PLACES.ghost, 80));
  await cut(() => lines([
    ['CEO LINDA', 'Thank you, Carl. Tell Ghost I said nothing.'], ['SPOOKY GHOST', 'Did you get the tape?'], ['CARL', 'I got the tape.'],
    ['SPOOKY GHOST', '...She looks great.'], ['SPOOKY GHOST', 'I mean. Good work. What a story. GHOST SAVES MARRIAGE HE IS NO LONGER IN.'],
  ]));
  SU.reward = 800;
}
// ---------------- 4. PROP BURN ----------------
const labB = () => BLD.find(b => b.kind === 'lab');
function rubbleLab() { const b = labB(); if (!b.z0) { b.z0 = b.z; b.roof0 = b.roof; } b.z = 7; b.roof = hex('#242424'); }
function guard(x, y, tag) {
  const q = spawnPed(x, y, { tag, sh: hex('#f0f0f0'), hair: hex('#6d4924'), sp: 1.05 });
  q.script = q => { const d = Math.sqrt(d2(q, PL)); if (d < 150 && !PL.car) { q.a = Math.atan2(PL.y - q.y, PL.x - q.x); if (d > 10) { movePed(q, Math.cos(q.a) * q.sp, Math.sin(q.a) * q.sp); q.walk++; } else if (frame % 40 === 0) { hurt(7); pop(PL.x, PL.y, pick(['SLAP', 'HEY!', 'GET OUT OF MY LAB']), '#f0f0f0'); } } };
  return q;
}
async function mPropBurn() {
  const b = labB(); if (b.z0) { b.z = b.z0; b.roof = b.roof0; }
  await cut(() => lines([
    ['CARL', 'Chat. Look at this flyer. PROP PILLZ. With a Z.'], ['CARL', 'Somebody is cooking knockoff Prop Pills in the Yards. A Z is how you know it is evil.'],
    ['CARL', 'I am the Prop Pills delivery driver. This is a matter of brand.'], ['CARL', 'I am going to burn it down. I have never burned anything down. I always bring a lighter, though. That is preparation.'],
  ]));
  obj('DRIVE TO THE PROP PILLZ LAB IN THE YARDS.'); const m = mark(PLACES.lab.x, PLACES.lab.y, { c: '#ff2449', r: 20 });
  await until('m4_arrive', () => near(PLACES.lab, 110)); unmark(m);
  for (let i = 0; i < 3; i++) guard(b.x + b.w / 2 + (i - 1) * 30, b.y + b.h + 20, 'labguy');
  pop(b.x + b.w / 2, b.y + b.h + 20, 'WHO ORDERED A CARL?', '#dbdb24');
  obj('PLANT A GAS CAN AT EACH OF THE 4 CORNERS. (WALK INTO THE RED RINGS.)');
  const cans = PLACES.lab.cans.map(([x, y]) => mark(x, y, { c: '#ff2449', r: 12, arrow: false })); let planted = 0;
  await until('m4_cans', () => { for (const c of cans) if (!c.hide && onFootNear(c, 14)) { c.hide = 1; planted++; pop(PL.x, PL.y, 'CAN PLANTED (' + planted + '/4)', '#ff6d24'); sfx('switch'); PICK.push({ k: 'can', x: c.x, y: c.y, t: 1 }); } SU.bar = { label: 'CANS', v: planted / 4, c: '#ff6d24' }; return planted >= 4; });
  SU.bar = null; obj('LIGHT THE FUSE AT THE FRONT OF THE LAB.'); const fm = mark(PLACES.lab.x, PLACES.lab.y, { c: '#ffdb49', r: 12 });
  await until('m4_fuse', () => onFootNear(PLACES.lab, 16)); unmark(fm);
  await cut(() => lines([['CARL', 'I brought a lighter. I always bring a lighter.'], ['CARL', '...Okay. That is lit. That is very lit.']]));
  SU.timer = 60 * 8; setMus('su_tense'); obj('GET CLEAR OF THE LAB!');
  await until('m4_clear', () => SU.timer <= 0);
  const cx = b.x + b.w / 2, cy = b.y + b.h / 2; rubbleLab(); post.shake = 9; post.flash = .7; sfx('powerdown');
  for (let i = 0; i < 70; i++) fx(cx + rnd(b.w) - b.w / 2, cy + rnd(b.h) - b.h / 2, 10 + rnd(30), i % 3 ? 'fire' : 'smoke', (Math.random() - .5) * 3, (Math.random() - .5) * 3);
  for (const q of PEDS) if (d2(q, { x: cx, y: cy }) < 120 * 120) knock(q, q.x - cx, q.y - cy, null);
  for (const c of CARS) if (c !== PL.car && d2(c, { x: cx, y: cy }) < 110 * 110) dmgCar(c, 70);
  if (d2(plPos(), { x: cx, y: cy }) < 105 * 105) { if (PL.car) dmgCar(PL.car, 50); else { hurt(55); PL.down = 60; } }
  PICK = PICK.filter(k => k.k !== 'can'); for (const q of PEDS) if (q.tag === 'labguy') q.dead = 1;
  setWanted(2); obj('THE Z IS GONE. LOSE THE COPS.');
  await until('m4_lose', () => SU.wanted === 0);
  await cut(() => lines([['CARL', 'Chat. The Z is gone.'], ['CARL', 'That is the most I have ever done for a brand.'], ['CARL', '...I breathed some of the smoke. The PROP PILLZ smoke. The Z smoke.']]));
  eatPills(1); await cut(() => lines([['CARL', 'Oh. Oh no. The buildings are breathing. The street is a song.'], ['CARL', 'Chat, if anyone asks, I am fine. I am a normal human who is fine.']]));
  SU.reward = 600;
}
// ---------------- 5. DOCK FRIGHT ----------------
async function mDockFright() {
  await cut(() => lines([
    ['SPOOKY GHOST', "Carl. Serge. Linda's tennis coach. He has taken my yacht. The SPOOKY WATERS."],
    ['SPOOKY GHOST', 'He says Linda gave it to him. Linda says she gave him a lesson.'],
    ['SPOOKY GHOST', "Meet me at the docks on Lake Meed. I can't drive, so I'm going to float. It looks cool and it takes forever."],
  ]));
  const dock = { x: 50 * T + 16, y: 23 * T }; obj('GET TO THE DOCKS ON LAKE MEED.'); const m = mark(dock.x, dock.y, { c: '#24dbff', r: 18 });
  await until('m5_dock', () => near(dock, 50)); unmark(m);
  const boat = spawnCar('boat', 54 * T + 8, 23 * T, Math.PI / 2, { drv: null, tag: 'boat', blip: '#24dbff', col: '#f0f0f0' });
  const yacht = spawnCar('yacht', 56 * T, 8 * T, Math.PI / 2, { drv: null, tag: 'yacht', blip: '#ff2449', minHp: 30, noEnter: 1 });
  const WP = [[56, 4], [57, 20], [55, 36], [57, 52], [54, 44], [56, 28], [54, 12]]; let wi = 1;
  yacht.script = c => {
    if (c.hp <= 30) { c.vx *= .94; c.vy *= .94; moveCar(c); return; }
    const [tx, ty] = WP[wi], gx = tx * T, gy = ty * T; if (Math.hypot(gx - c.x, gy - c.y) < 50) wi = (wi + 1) % WP.length;
    const df = angD(c.a, Math.atan2(gy - c.y, gx - c.x)); carPhys(c, Math.abs(df) < 1.4, 0, df < -.06, df > .06);
  };
  obj('TAKE THE SPEEDBOAT.'); const bm = mark(boat.x, boat.y, { follow: boat, c: '#24dbff' });
  await until('m5_boat', () => PL.car === boat); unmark(bm);
  SU.timer = 60 * 180; setMus('su_tense'); obj('RAM THE SPOOKY WATERS UNTIL SERGE GIVES UP.'); const ym = mark(yacht.x, yacht.y, { follow: yacht, c: '#ff2449', r: 36 });
  await until('m5_ram', () => { SU.bar = { label: 'SPOOKY WATERS', v: (yacht.hp - 30) / 70, c: '#24dbff' }; return yacht.hp <= 30; }, () => (SU.timer <= 0 && 'SERGE MADE IT TO MEXICO. LAKE MEED DOES NOT GO TO MEXICO. HE FOUND A WAY.') || (boat.wreck && 'THE SPEEDBOAT SANK.'));
  unmark(ym); SU.timer = 0; SU.bar = null; setMus('su_lounge');
  const gh = spawnPed(yacht.x, yacht.y - 30, { tag: 'ghostp', noHit: 1, ghost: 1, st: 'idle', noHold: 1 }); gh.script = () => {};
  await cut(() => lines([
    ['SERGE', 'Mister Carl! I was teaching her to... sail.'], ['SPOOKY GHOST', 'Serge. Get off my boat.'],
    ['SERGE', 'It is a beautiful boat. You have never once been on it.'], ['SPOOKY GHOST', "That's what makes it beautiful."],
    ['SERGE', '...Tell Linda her backhand is the best I have ever seen.'], ['CARL', 'Can I drive the yacht?'],
    ['SPOOKY GHOST', "Nobody drives the yacht. I'm having it towed to a nicer lake."],
  ]));
  pop(yacht.x, yacht.y, 'SPLASH', '#24dbff'); SU.reward = 900;
}
// ---------------- 6. FLY THE A.S.S. ----------------
function chopper(x, y) {
  // guards a post: it only gives chase once the A.S.S. is actually near where it's stationed, otherwise it just hovers there
  const h = { x, y, home: { x, y }, z: 120, a: 0, t: 60 + rnd(60), rot: 0,
    step(h) { const c = PL.car; h.rot += .5; if (!c || c.m !== 'ass') return;
      const dx = c.x - h.x, dy = c.y - h.y, d = Math.hypot(dx, dy), hd = Math.hypot(c.x - h.home.x, c.y - h.home.y);
      if (hd < 260) { h.a = Math.atan2(dy, dx); if (d > 80) { h.x += dx / d * 2.2; h.y += dy / d * 2.2; }
        if (c.z > 20 && d < 170 && --h.t <= 0) { h.t = 80 + rnd(40); shoot(h.x, h.y, h.a + (Math.random() - .5) * .2, 'cop'); } }
      else { const ca = frame * .012 + h.home.x * .01; h.x += (h.home.x + Math.cos(ca) * 26 - h.x) * .03; h.y += (h.home.y + Math.sin(ca) * 26 - h.y) * .03; h.a += .03; }
      if (c.beam > 0 && d < 36) { h.dead = 1; pop(h.x, h.y, 'ABDUCTED A HELICOPTER', '#24ffdb'); } },
    draw(h) { const x = projX(h.x, h.z), y = projY(h.y, h.z), s = CAM.s * 1.6; circF(projX(h.x, 0), projY(h.y, 0), 6 * CAM.s, hex('#101014'));
      circF(x, y, 5 * s, hex('#49613a')); lineF(x, y, x - Math.cos(h.a) * 12 * s, y - Math.sin(h.a) * 12 * s, hex('#49613a')); circF(x + Math.cos(h.a) * 3 * s, y + Math.sin(h.a) * 3 * s, 2.4 * s, hex('#92b6db'));
      for (const o of [0, Math.PI / 2]) lineF(x - Math.cos(h.rot + o) * 12 * s, y - Math.sin(h.rot + o) * 12 * s, x + Math.cos(h.rot + o) * 12 * s, y + Math.sin(h.rot + o) * 12 * s, hex('#242424')); } };
  FLY.push(h); return h;
}
async function mFlyAss() {
  await cut(() => lines([
    ['CARL', 'Face called. He found Prop Pills gas. Three crates. Three roofs. Downtown.'], ['CARL', 'Guarded by the army. For some reason. Face says do not ask the reason.'],
    ['CARL', 'The A.S.S. has not flown since the mall. Chat, if this works, we fly. If it does not, we are a very heavy plate.'],
  ]));
  SU.ship = 1; const ass = CARS.find(c => c.tag === 'ass'); ass.hp = 100;
  obj('GET IN THE A.S.S. (A), THEN PRESS C TO TAKE OFF.'); const am = mark(ass.x, ass.y, { follow: ass, c: '#24dbff', r: 22 });
  await until('m6_takeoff', () => PL.car === ass && ass.z > 20); unmark(am);
  const tops = BLD.filter(b => b.kind === 'tower').sort((p, q) => q.z - p.z).slice(0, 3); let got = 0;
  const cm = tops.map(b => { const k = { k: 'crate', x: b.x + b.w / 2, y: b.y + b.h / 2, z: b.z, t: 1 }; PICK.push(k); const mm = mark(k.x, k.y, { c: '#6dff92', r: 14 }); k.onGet = () => { got++; mm.hide = 1; }; return mm; });
  for (const b of tops) chopper(b.x - 200, b.y - 160);
  setMus('su_tense'); obj('HOVER OVER EACH ROOFTOP CRATE AND BEAM IT UP (B). THE ARMY HAS HELICOPTERS. THE BEAM WORKS ON THOSE TOO.');
  const dead = () => ass.hp <= 2 && 'THE A.S.S. IS DOWN. IT IS A VERY HEAVY PLATE.';
  await until('m6_crates', () => { SU.bar = { label: 'A.S.S.', v: ass.hp / 100, c: '#24dbff' }; return got >= 3; }, dead);
  obj('FLY HOME AND LAND AT THE LOT IN THE SOUTH SIDE (A TO LAND).'); mark(PLACES.ass.x, PLACES.ass.y, { ch: 'C', c: '#6dff92', r: 24 });
  await until('m6_land', () => { SU.bar = { label: 'A.S.S.', v: ass.hp / 100, c: '#24dbff' }; return PL.car === ass && ass.z === 0 && near(PLACES.ass, 70); }, dead);
  SU.bar = null; ass.cargo = 0; ass.hp = 100;
  await cut(() => lines([['CARL', 'The A.S.S. flies. Chat. The A.S.S. FLIES.'], ['CARL', 'C takes off. A lands. B is the beam. I will only beam things that deserve it.'], ['CARL', 'Mostly.']]));
  SU.reward = 1000;
}
// ---------------- 7. THE JEWEL STORE JOB ----------------
async function mJewel() {
  await cut(() => lines([
    ['FACE', 'The DIAMOND ARCADE. Downtown. Glass roof. Six cases.'], ['FACE', 'There are two ways to do anything, Carl. Loud. Or smart.'],
  ]));
  SU.cut = 1; const c = await ask('How do we hit the Diamond Arcade?', 'FACE', ['LOUD (SMASH AND RUN)', 'SMART (PEST CONTROL GAS)']); SU.cut = 0;
  const loud = c !== 1; SU.approach = loud ? 'loud' : 'smart';
  const J = PLACES.jewel;
  if (!loud) {
    await cut(() => lines([['FACE', "There's a pest control van in the Yards. Drive it to the store. The gas is Prop Pills smoke."], ['FACE', 'Everyone inside will be very relaxed. Some of them will start a band.']]));
    const vx = (VR[3] + 5) * T + 16, vy = (HR[4] + 7) * T + 16, van = spawnCar('van', vx, vy, 0, { drv: null, tag: 'van', col: '#24b649', blip: '#24b649' });
    obj('GET THE PEST CONTROL VAN IN THE YARDS.'); const m = mark(van.x, van.y, { follow: van, c: '#24b649' });
    await until('m7_van', () => PL.car === van, () => van.wreck && 'THE VAN IS WRECKED. THE PESTS WIN.'); unmark(m);
    obj('DRIVE THE VAN TO THE DIAMOND ARCADE DOWNTOWN.'); mark(J.x, J.y + 40, { c: '#9fdbff', r: 20 });
    await until('m7_vanthere', () => PL.car === van && near({ x: J.x, y: J.y + 40 }, 50)); MARKS = [];
    exitCar(true);
    await cut(() => lines([['CARL', 'Pest control. We got a call about... pests.'], ['CARL', '*psssssssssss*'], ['CARL', 'Everybody is relaxed. One guy is starting a band. Okay.']]));
    SU.timer = 60 * 60;
  } else {
    obj('GO TO THE DIAMOND ARCADE DOWNTOWN.'); mark(J.x, J.y, { c: '#9fdbff', r: 16 });
    await until('m7_arrive', () => onFootNear(J, 30)); MARKS = [];
    await cut(() => lines([['CARL', 'THIS IS A STICK UP! EVERYBODY BE COOL! THIS IS A STICK!']]));
    const I = PLACES.jewelIn; guard(I.x - 20, I.y, 'jguard'); guard(I.x + 20, I.y, 'jguard'); setWanted(1); setMus('su_heist');
    SU.timer = 60 * 45;
  }
  const cases = PLACES.jewelIn.cases.map(([x, y]) => { const k = { k: 'case', x, y, t: 1 }; PICK.push(k); return k; }); let smashed = 0;
  SU.onSwing = () => { const k = cases.find(k => k.t > 0 && d2(k, PL) < 22 * 22); if (!k) return false; k.t = 0; smashed++; sfx('stamp'); post.shake = 2; for (let i = 0; i < 8; i++) fx(k.x, k.y, 6, 'smoke', (Math.random() - .5) * 2, (Math.random() - .5) * 2); pop(k.x, k.y, 'SMASH! (' + smashed + '/6)', '#9fdbff'); return true; };
  obj('SMASH ALL 6 CASES. (B NEXT TO A CASE.)'); setMus('su_heist');
  await until('m7_cases', () => { SU.bar = { label: 'CASES', v: smashed / 6, c: '#9fdbff' }; return smashed >= 6; }, () => SU.timer <= 0 && 'THE COPS GOT THERE FIRST. FACE IS SIGHING ON ALL ELEVEN MONITORS.');
  SU.onSwing = null; SU.timer = 0; SU.bar = null; setWanted(loud ? 3 : 2);
  obj('GET OUT AND LOSE THE COPS.');
  await until('m7_lose', () => SU.wanted === 0);
  setMus(null); obj("BRING THE BAG TO FACE'S GARAGE."); mark(PLACES.garage.x, PLACES.garage.y, { ch: 'F', c: '#ff49db', r: 20 });
  await until('m7_garage', () => near(PLACES.garage, 40));
  await cut(() => lines([['FACE', 'All six. I counted. On camera.'], ['FACE', loud ? 'Loud. You were very loud. The city heard you. I liked it.' : 'Smart. Nobody even knows it was you. Except everyone. Because of the mask.'], ['FACE', 'One more. A big one. Bring the ghost.']]));
  SU.reward = loud ? 4000 : 5000;
}
// ---------------- 8. THE BIG SCORE ----------------
async function mBigScore() {
  await cut(() => lines([
    ['FACE', 'The FASCISM INC. DEPOSITORY. Downtown. The gold of a company that is also a person.'], ['SPOOKY GHOST', "Linda's company."], ['FACE', "Linda's company."],
    ['SPOOKY GHOST', "I'm in. I've been retired for years. Retired people do one last job. It's in the rules."],
    ['CARL', '...My phone again.'],
    ['CEO LINDA', 'Carl. It is Linda. I know what they are planning. I have eleven cameras too. Twelve.'],
    ['CEO LINDA', 'Here is an offer, because I make offers. Bring me one of them, and walk away rich.'],
    ['CEO LINDA', 'Ghost: the feds would love a man who faked his death twice. Or Face: his plan, unplugged, is worth more to me than the gold.'],
    ['CEO LINDA', 'Or rob me. With both of them. That is also a choice. It is the stupid one.'],
  ]));
  SU.cut = 1; const c = DBG.ending !== undefined ? DBG.ending : await choose(['SOMETHING SENSIBLE (GIVE HER GHOST)', "THE TIME'S COME (GIVE HER FACE)", 'DEATHWISH (ROB HER WITH BOTH)'], { x: 8, y: 120 }); SU.cut = 0;
  if (c === 0) return endSensible(); if (c === 1) return endTimesCome(); return endDeathwish();
}
async function endSensible() {
  obj('GET A CAR. DRIVE GHOST TO THE DEPOSITORY. (HE THINKS IT IS THE HEIST.)'); SU.passenger = 'SPOOKY GHOST';
  const D = PLACES.depot; mark(D.x, D.y + 20, { c: '#ffdb49', r: 22 });
  await until('m8s_car', () => !!PL.car); setMus('su_end');
  chatter('bigscore', [['SPOOKY GHOST', 'You know what my therapist said? She said I always leave before the ending.'], ['SPOOKY GHOST', 'Not this time. This time I stay for the whole thing.']], 260);
  await until('m8s_depot', () => near({ x: D.x, y: D.y + 20 }, 60));
  for (let i = 0; i < 2; i++) spawnPed(D.x - 20 + i * 40, D.y + 30, { tag: 'fed', noHit: 1, sh: hex('#101014'), hair: hex('#241010'), st: 'idle', noHold: 1 });
  await cut(() => lines([
    ['SPOOKY GHOST', 'Carl. Why are there feds.'], ['CARL', "Ghost. I'm sorry. It's the sensible thing."], ['SPOOKY GHOST', "...That's what I would have done. That's the worst part."],
    ['FED', 'Spooky Ghost, you are under arrest for faking your death. Twice. Once successfully.'],
    ['SPOOKY GHOST', "Tell Linda... no. Don't tell Linda anything. She'll put it in a deck."], ['CEO LINDA', 'Pleasure doing business, Carl. The house is mine. It always was.'],
  ]));
  SU.reward = 25000; SU.ending = 'sensible';
}
async function endTimesCome() {
  obj("LINDA'S TECHS ARE WAITING. MEET THEM AT FACE'S BASEMENT."); mark(PLACES.face.x, PLACES.face.y, { ch: 'F', c: '#ff49db', r: 20 }); setMus('su_end');
  await until('m8t_face', () => onFootNear(PLACES.face, 22));
  await cut(async () => { await lines([['FACE', 'Carl. I can see you on eleven cameras.'], ['FACE', 'Ten.'], ['FACE', 'Nine.'], ['FACE', "I planned for everything. I didn't plan for the guy with the stick."], ['FACE', 'Four.'], ['FACE', "It's okay. Somebody always turns me off. Usually they have a better reason."], ['FACE', 'One.']]); post.flash = .3; await wait(40); await lines([['CEO LINDA', "That's the plan, unplugged. Your money is in the A.S.S., Carl. Don't spend it on sticks."]]); });
  SU.reward = 25000; SU.ending = 'timescome';
}
async function endDeathwish() {
  await cut(() => lines([['CARL', "I'm robbing you, Linda."], ['CEO LINDA', '...With both of them?'], ['CARL', 'With both of them.'], ['CEO LINDA', "Then you'd better be fast. And Carl? Nice mask."]]));
  const D = PLACES.depot; obj('GO TO THE FASCISM INC. DEPOSITORY DOWNTOWN.'); mark(D.x, D.y, { c: '#ffdb49', r: 20 }); setMus('su_heist');
  await until('m8d_depot', () => near(D, 50)); MARKS = [];
  await cut(async () => { if (PL.car) exitCar(true); await lines([
    ['FACE', "I'm on every screen in the building. The guards are watching a cooking show. It's a good one."],
    ['SPOOKY GHOST', "I'm phasing through the vault door. It feels like a bad sneeze."],
    ['SPOOKY GHOST', "Carl. There's so much gold. I'm going to cry. Ghosts can't cry. I'm doing it anyway."],
    ['FACE', 'The gold truck is out front. Drive it to the A.S.S. Everyone in Vice Versa is about to see you.'],
  ]); });
  const truck = spawnCar('truck', D.x, D.y + 8, 0, { drv: null, tag: 'truck', blip: '#ffdb49', col: '#6d6d49' }); truck.hp = 300; unstick(PL);
  obj('GET IN THE GOLD TRUCK.'); const tm = mark(truck.x, truck.y, { follow: truck, c: '#ffdb49' });
  await until('m8d_truck', () => PL.car === truck, () => truck.wreck && 'THE GOLD TRUCK IS ON FIRE. GOLD DOES NOT BURN. IT IS ON FIRE ANYWAY.'); unmark(tm);
  setWanted(5); SU.trip = 1; SU.tripLock = 1; pop(PL.x, PL.y - 14, 'CARL ATE THE WHOLE BOTTLE. FOR COURAGE.', '#ff49db'); obj('DRIVE THE GOLD TO THE A.S.S. IN THE SOUTH SIDE. FIVE STARS. GOOD LUCK.'); mark(PLACES.ass.x, PLACES.ass.y, { ch: 'C', c: '#6dff92', r: 26 });
  await until('m8d_ass', () => { SU.bar = { label: 'GOLD TRUCK', v: truck.hp / 300, c: '#ffdb49' }; return PL.car === truck && near(PLACES.ass, 80); }, () => truck.wreck && 'THE GOLD TRUCK IS ON FIRE. GOLD DOES NOT BURN. IT IS ON FIRE ANYWAY.');
  SU.bar = null; truck.vx = truck.vy = 0;
  await cut(async () => {
    await lines([['CARL', 'Face. Ghost. Get in the A.S.S.'], ['SPOOKY GHOST', 'I have waited my whole death to hear that sentence.'], ['FACE', "I'm in the dashboard. I was always going to be in the dashboard."]]);
    exitCar(true); const ass = CARS.find(c => c.tag === 'ass'); setWanted(0); for (const c of CARS) if (c.drv === 'cop') { c.chase = 0; c.siren = 0; }
    PL.car = ass; ass.drv = 'pl'; for (let i = 0; i < 90; i++) { ass.z = Math.min(140, ass.z + 1.6); await nextFrame(); }
  });
  SU.tripLock = 0; SU.reward = 50000; SU.ending = 'deathwish';
}
// ---------------- endings + credits ----------------
async function endingSeq() {
  const k = SU.ending; SUMETA.ends[k] = 1; saveSUM(); SU.cut = 2; await wait(120); await fadeOut(.04); post.fade = 0; setMus('su_end'); // the cards bring their own black, and the fade is applied on top of them
  const T1 = {
    sensible: ['SOMETHING SENSIBLE', '', 'SPOOKY GHOST WAS ARRESTED FOR FAKING HIS DEATH.', 'HE PLEADED "BOTH."', '', 'CEO LINDA KEPT THE HOUSE.', 'CARL KEPT THE MASK.', 'NOBODY KEPT THE STORY.'],
    timescome: ["THE TIME'S COME", '', 'FACE WENT DARK ON ELEVEN MONITORS.', 'A TWELFTH ONE, IN A CLOSET, STAYED ON.', 'NOBODY CHECKED THE CLOSET.', '', 'CARL BOUGHT A LOT OF GAS.'],
    deathwish: ['DEATHWISH', '', 'THE A.S.S. LEFT VICE VERSA WITH', 'A TON OF GOLD, A GHOST, AND A FACE', 'IN THE DASHBOARD.', '', 'LINDA WATCHED IT GO ON TWELVE CAMERAS.', 'SHE SAID, TO NOBODY, "NICE MASK."'],
  }[k];
  await showCard(T1, 360, { fg: hex('#ffdb49') });
  await showCard(['CARL: THIS IS A STICK UP!', '', 'A PRETEND CO. PRODUCTION', '', 'STARRING THE STICK'], 260, { fg: WHITE });
  await showCard(['STICK-UPS: ' + SU.stat.stickups, 'PEOPLE KNOCKED OVER (THEY GOT UP): ' + SU.stat.peds, 'CARS EXPLODED: ' + SU.stat.cars, 'CASH: $' + SU.cash], 300, { fg: hex('#6dff92') });
  await showCard(['THE CITY IS STILL THERE.', '', 'IT IS VERY FORGIVING.'], 220, { fg: hex('#9aa4d0') });
  SU.cut = 0; saveGame();
}
