'use strict';
// ================= CARL 3: the road. acts, the Nevada map, heat and Service checkpoints, roadside stops, side jobs, decoy crates, the catalog =================
// Expansion rails. Content files register into STOPX / JOBS / CRATES / ROADSIDE / UPGRADES / CBTALK; nothing in here knows a stop's story.
// Only carl3/index.html loads this file: the spin-offs that share c3world/c3alibi never see these overrides.

// ---------------- save fields added by the expansion (older saves get them on load) ----------------
function ensure3() { if (!C3) return; C3.crates = C3.crates || {}; C3.up = C3.up || {}; C3.service = C3.service || 0; C3.jobsDone = C3.jobsDone || {}; C3.road = C3.road || {}; }
const UP3 = k => C3 && C3.up && C3.up[k];

// ---------------- stops ----------------
// STOPX[id] = { act, map: [x, y], hint() } . STOPTAB[id] = { id, name, scene, road, sky, ground } as before.
// stop ids are not play order: 1-3 are ACT I, 4 7 8 9 10 are ACT II (any order), 11 5 6 are ACT III.
const ACTS = { 1: [1, 2, 3], 2: [4, 7, 8, 9, 10], 3: [11, 5, 6] };
const ACTNAME = { 1: 'ACT I: FIRST CLASS', 2: 'ACT II: PARCEL POST', 3: 'ACT III: SPECIAL DELIVERY' };
const STOPX = {
  0: { act: 0, map: [214, 186] },
  1: { act: 1, map: [184, 164] }, 2: { act: 1, map: [150, 140] }, 3: { act: 1, map: [196, 126] },
  4: { act: 2, map: [226, 152] }, 7: { act: 2, map: [206, 100] }, 8: { act: 2, map: [96, 60] }, 9: { act: 2, map: [82, 80] }, 10: { act: 2, map: [150, 40] },
  11: { act: 3, map: [128, 108] }, 5: { act: 3, map: [164, 88] }, 6: { act: 3, map: [306, 120] },
};
// a stop exists once a content file has registered it and built its first scene
function regStop(id, tab, x) { STOPTAB[id] = Object.assign({ id: 's' + id }, tab); STOPX[id] = Object.assign(STOPX[id] || {}, x || {}); }
const hasStop = id => !!(STOPTAB[id] && SCENES[STOPTAB[id].scene]);
const stamped = id => !!F3('done' + id);
const act2Stops = () => ACTS[2].filter(hasStop);
const act2Count = () => act2Stops().filter(stamped).length;
const act2Done = () => F3('done3') && act2Count() === act2Stops().length;
function unlocked(id) {
  if (!hasStop(id) || id === 6 || id === C3.stop) return false;
  if (F3('arrived' + id)) return true;                     // anywhere you've been, you can go back to
  if (id === 1) return true; if (id === 2) return stamped(1); if (id === 3) return stamped(2);
  if (STOPX[id].act === 2) return stamped(3);
  if (id === 11) return !!F3('act2fin');
  if (id === 5) return !!F3('act2fin') && (stamped(11) || !hasStop(11));
  return false;
}
// the stop the story wants next (the objective marker and the bot use it)
function wantDest() {
  for (const id of [1, 2, 3]) if (!stamped(id)) return id;
  for (const id of act2Stops()) if (!stamped(id)) return id;
  if (hasStop(11) && !stamped(11)) return 11;
  return 5;
}
function routeObj() {
  if (!act2Done()) { const d = act2Stops(), n = act2Count(); return n === 0 && F3('done3') ? 'Take the helm. The route forks: ' + d.length + ' clerks, any order' : 'Take the helm: find the next clerk (' + n + '/' + d.length + ' stamped)'; }
  return 'Take the helm. Drive to ' + titleCase(STOPTAB[wantDest()].name);
}
const titleCase = s => s.toLowerCase().replace(/(^|[ .'-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
function setRouteObj() { setObj3(routeObj(), 'ship', 'helm'); OBJ3.dest = wantDest(); }
const _stopHint = stopHint;
stopHint = function () { const x = STOPX[C3.stop]; if (x && x.hint && !stamped(C3.stop)) return x.hint(); if (stamped(C3.stop) || C3.stop === 0) return routeObj() + '.'; return _stopHint(); };

// ---------------- heat: lies catch up. the Postal Inspection Service sets up on the road ----------------
const openLies = () => C3.alibis.filter(a => !a.retracted).length;
function heat3() { if (!F3('done3')) return 0; return Math.min(5, Math.floor(openLies() / 2) + C3.suspicion + (F3('tracker') && !F3('trackerOff') ? 1 : 0)); }
const checkChance = () => heat3() * (UP3('plates') ? .06 : .12);

// ---------------- the helm: a map of Nevada ----------------
const NVMAP = [[78, 14], [244, 14], [244, 168], [238, 176], [234, 212], [78, 102]];
const MP = p => [Math.round(p[0] * .82 - 52), Math.round(36 + p[1] * .78)];   // map space -> screen (left side; the list sits on the right)
function drawNevada(sel, dests) {
  skyD(0, H, '#0a0a24', '#1a1440');
  for (let y = 0; y < H; y += 8) rectF(0, y, W, 1, hex('#14143a'));
  const P = NVMAP.map(MP); for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; lineF(a[0], a[1], b[0], b[1], hex('#6d6dff')); }
  text('NEVADA', 70, 52, hex('#3a3a92'));
  const here = MP(STOPX[C3.stop].map);
  for (const id of dests) { const m = MP(STOPX[id].map); lineF(here[0], here[1], m[0], m[1], id === sel ? hex('#ffd848') : hex('#3a3a6d')); }
  for (const id in STOPX) { if (!hasStop(+id) && +id !== 0) continue; const m = MP(STOPX[id].map), d = stamped(+id), cur = +id === C3.stop;
    if (+id === 6) { if (!F3('chuteOpen')) continue; }
    circF(m[0], m[1], cur ? 4 : 3, cur ? hex('#6dff92') : d ? hex('#ff4949') : F3('arrived' + id) ? hex('#ffb040') : hex('#6d6d92'));
    if (d) ringF(m[0], m[1], 6, hex('#ff4949'));
    if (+id === sel) { ringF(m[0], m[1], 8 + ((WX.t >> 3) & 1), hex('#ffd848')); const nm = STOPTAB[id].name; text(nm, Math.max(4, Math.min(W - nm.length * 6 - 4, m[0] - nm.length * 3)), m[1] + 10, hex('#ffd848'), BLACK); }
  }
  plate(4, 4, 150, 26, { alpha: .8 }); shadowText(ACTNAME[F3('act2fin') ? 3 : F3('done3') ? 2 : 1] || '', 10, 8, UI3.name); text('HEAT ' + '*'.repeat(heat3()) + '-'.repeat(5 - heat3()), 10, 19, heat3() >= 3 ? hex('#ff4949') : UI3.dim);
}
async function driveMenu() {
  if (!F3('seenP0')) return say('CARL: I should look at the parcel first. The helm is a big decision.', 'CARL');
  if (act2Done() && !F3('act2fin')) { if (!F3('act2reveal')) await act2Finale(); if (C3.stop === 7) return say('CARL: Bev. The motel wing. She\'s right outside.', 'CARL'); }
  const dests = Object.keys(STOPX).map(Number).filter(unlocked).sort((a, b) => (STOPX[a].act - STOPX[b].act) || (ACTS[STOPX[a].act] || []).indexOf(a) - (ACTS[STOPX[b].act] || []).indexOf(b));
  if (!dests.length && STOPX[C3.stop] && STOPX[C3.stop].act === 1 && !stamped(C3.stop)) return say(stopHint(), 'CARL');   // mid-stop with nowhere old to go back to: nudge
  if (!dests.length) return say('CARL: There\'s nowhere on the card I can go. That\'s either very bad or very good.', 'CARL');
  let sel = dests[0]; const prev = scene;
  scene = { update() { WX.t++; const m = MENUS[0]; if (m && dests[m.i] !== undefined) sel = dests[m.i]; }, draw() { drawNevada(sel, dests); } };
  const labels = dests.map(id => (stamped(id) ? '* ' : '  ') + STOPTAB[id].name).concat(['NOT YET']);
  DBG.pick = o => { const w = OBJ3 && OBJ3.dest !== undefined ? OBJ3.dest : wantDest(), i = dests.indexOf(w); return i >= 0 ? i : 0; };
  const i = await choose(labels, { y: 40, cancel: 1 });
  DBG.pick = null; scene = prev;
  if (i < 0 || i >= dests.length) return;
  await doDrive(dests[i]);
}
// ---------------- the drive: map distance sets the length; one roadside stop at most ----------------
function driveDur(a, b) { const p = STOPX[a] ? STOPX[a].map : [200, 180], q = STOPX[b].map; return Math.max(900, Math.min(1600, 600 + Math.hypot(p[0] - q[0], p[1] - q[1]) * 7)); }
async function doDrive(next) {
  ensure3(); const S0 = STOPTAB[next], first = !F3('arrived' + next), from = C3.stop; await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; music(null);
  const act = STOPX[next] ? STOPX[next].act : 1;
  await showCard([first ? (ACTNAME[act] || '') : 'BACK TO', '', S0.name], 110, { fg: hex('#ffd848') });
  scene = { draw() { cls(BLACK); } };
  const dur = driveDur(from, next) | 0, half = dur >> 1, lines = first ? (DRIVELINES[next] || []) : [], base = { title: S0.name, sky: S0.sky, ground: S0.ground, music: 'drive' };
  const ev = roadEvent(next);
  if (ev) {
    await driveUntil(Object.assign({ dur: half, lines: lines.filter(l => l[0] < half - 60) }, base));
    await roadside(ev);
    await driveUntil(Object.assign({ dur: dur - half, lines: lines.filter(l => l[0] >= half - 60).map(([t, w, s]) => [Math.max(30, t - half + 60), w, s]) }, base));
  } else await driveUntil(Object.assign({ dur, lines }, base));
  C3.stop = next; setF3('arrived' + next);
  scene = worldScene3; loadScene(S0.scene, ...(SCENES[S0.scene].arrive || [SCENES[S0.scene].start[0], SCENES[S0.scene].start[2], 0])); post.fade = 1; await fadeIn(.08);
  if (first) run(() => ARRIVE[next] && ARRIVE[next]());
  else run(async () => { if (REVISIT[next]) await REVISIT[next](); if (!OBJ3 || OBJ3.scene === 'ship') setRouteObj(); });
}
const REVISIT = {};
// ---------------- roadside: a shoulder of highway, one camera. events are scripted scenes played on it ----------------
(() => {
  const b = SB({ amb: [.26, .24, .4], sun: { dir: [-.3, .8, -.5], col: [.3, .3, .55] }, sky: ['#000012', '#2a1a4a'], stars: 1, moon: { p: [60, 40, 120], r: 7 }, fog: { col: '#1a1430', dens: .014 }, music: 'drive', title: 'THE SHOULDER' });
  b.ground(160, 120, { col: '#a08868', tex: 'sand', ts: 4 }, 0, 20);
  b.add('plane:160:8', [0, .02, 12], { col: '#5a5a62', tex: 'asphalt', ts: 3, shiny: .25 });
  for (let i = -8; i <= 8; i++) b.add('plane:2:.2', [i * 5, .03, 12], { col: '#e8c850', emis: .1 });
  b.add('plane:160:.2', [0, .03, 8.2], { col: '#e8e8d8', emis: .1 });
  b.cyl(9, 6.4, .06, 1.2, { col: '#d8d8d8' }, { solid: true, seg: 5 }); b.box(9, 6.4, .5, .05, .7, { col: '#30a050', emis: .2 }, { y: 1.2, solid: false });   // mile marker
  b.cactus(-11, 3, 2.2); b.cactus(14, 2, 3); b.cactus(-20, 22, 3.4); b.cactus(22, 24, 2.6);
  b.box(-16, 5, 2.6, 1.2, 1, { col: '#8a7a6a', tex: 'stucco', ts: 2 });
  b.light(-1, 2.4, 3.6, [1, .95, .8], 12, 1.4, .6);   // the A.S.S.'s headlights
  b.walkRect(-14, 1, 14, 7.6);
  b.cam('rs', [0, 3.2, -6.5], [0, .9, 6], .95, [-50, -50, 50, 50]);
  SCENES.roadside = Object.assign(b.fin(), { start: [-1, 0, 3], ents: () => [{ id: 'rs_ship', kind: 'prop3', at: [-4, 0, 3], label: '', range: 0, draw3: e => drawModel(SHIP, { p: [-4, .9, 3.4], yaw: 1.4, s: .9 }, shipLight(e.at)) }] });
})();
// ROADSIDE: { id, once, weight, cond(next) -> bool, run: async (next) => {} } . put people on the shoulder with rsPut().
const ROADSIDE = [];
const rsPut = (id, model, x, z, label, o = {}) => addEnt3(Object.assign({ id, kind: 'npc', model, at: [x, 0, z], label, yaw: o.yaw || Math.PI, faceCarl: 1 }, o));
function roadEvent(next) {
  if (!F3('done3') || !STOPTAB[C3.stop]) return null;                          // ACT I drives are clean
  if (C3.road.last === C3.time) return null;
  if (Math.random() < checkChance()) return CHECKPOINT;
  const ok = ROADSIDE.filter(e => !(e.once && C3.road[e.id]) && (!e.cond || e.cond(next)));
  if (!ok.length || Math.random() > .45) return null;
  let tot = ok.reduce((s, e) => s + (e.weight || 1), 0), r = Math.random() * tot; for (const e of ok) { r -= e.weight || 1; if (r <= 0) return e; } return ok[0];
}
async function roadside(ev) {
  C3.road[ev.id] = (C3.road[ev.id] || 0) + 1; C3.road.last = C3.time;
  scene = worldScene3; loadScene('roadside', -1, 3, 0); WX.banner = null; post.fade = 1; await fadeIn(.08);
  WX.hold++; try { await ev.run(); } finally { WX.hold = Math.max(0, WX.hold - 1); }
  await fadeOut(.06); scene = { draw() { cls(BLACK); } };
}
// ---- the checkpoint: a white sedan, two men, a clipboard ----
const SV = 'SERVICE AGENT';
regBust(SV, genBust({ skin: '#f0f0f0', hair: '#f0f0f0', hairStyle: 'bald', top: '#e8e8e8', shades: 1, tie: '#c8c8c8', collar: '#ffffff' }), '#e8e8ff'); VOICE[SV] = [300, 0];
const CHECKPOINT = { id: 'checkpoint', run: async () => {
  C3.service++;
  rsPut('agent', 'suit', 2.5, 6.6, SV); rsPut('agent2', 'suit', 5, 7.4, '', { yaw: 2.6 });
  await say('A WHITE SEDAN ACROSS BOTH LANES. NO LIGHTS. TWO MEN IN WHITE, AND A CLIPBOARD.');
  await say2([[SV, 'Postal Inspection Service. Routine. Nothing about this is routine for you.'], [SV, 'We have reports of a short courier telling people things. Several things. Different things.']]);
  for (;;) {
    const c = await ask('HEAT ' + heat3() + '/5. THE AGENT CLICKS HIS PEN.', SV, ['SHOW THE ROUTE CARD', 'PAY THE "FEE" ($' + fine3() + ')', 'ARGUE']);
    if (c === 0) { if (openLies() <= 2) { await say2([[SV, 'Courier. Stamped, signed, consistent.'], [SV, 'Drive safe. We\'ll see you up the road. We always do.']]); return; }
      await say2([['CARL', 'It\'s my route card. It\'s all on there.'], [SV, 'It says courier. Your ledger says ' + CLAIMS[C3.alibis.filter(a => !a.retracted).slice(-1)[0].id].name.toLowerCase() + '.'], ['CARL', 'I can be two things. People are two things.']]); continue; }
    if (c === 1) { if (C3.bux < fine3()) { await say('YOU DON\'T HAVE $' + fine3() + '. HE WRITES THAT DOWN TOO.'); continue; } C3.bux -= fine3(); sfx('get'); await say2([[SV, 'Processing fee. Very routine.'], ['CARL', 'You said it wasn\'t.'], [SV, 'Drive safe.']]); return; }
    let r; do { r = await argue3({ id: 'checkpoint', name: SV, port: 'INSPECTOR', patience: 8 + heat3() * 2, weak: { LOGIC: 2 }, immune: ['DENIAL'], atk: ['License, registration, the parcel.', 'Is this your vehicle. Is this a vehicle.', 'You are very short for a courier.', 'We are writing everything down.'], hit: 1, hint: 'logic. they only respect procedure', win: 'Fine. Go. It is noted.', open: 'HE WANTS TO SEE INSIDE THE CARGO BAY.' }); } while (!r.win);
    await say2([[SV, 'Go on. It is noted. Everything is noted.']]); return;
  }
} };
const fine3 = () => 10 + heat3() * 5;

// ---------------- side jobs: Dispatch's board on the ship ----------------
// JOBS: { id, from: stopId, to: stopId, scene, at: [x, z], who, model, desc, pay, cond?(), lines: [[who, text], ...], task?: async () => bool, after?() }
// Pick up on the ship while parked at `from`. Deliver to `who`, standing at `at` in `scene` while the parcel is on board.
const JOBS = [];
const cargoMax = () => UP3('rack') ? 6 : 3;
const jobParcels = () => C3.parcels.filter(p => p.job && p.status === 'carry');
const jobOpen = j => !C3.jobsDone[j.id] && !C3.parcels.some(p => p.job === j.id) && j.from === C3.stop && hasStop(j.to) && (!j.cond || j.cond());
async function jobBoard() {
  ensure3();
  const open = JOBS.filter(jobOpen);
  if (!open.length) return say(pick(['DISPATCH: Nothing on the board here. People in this part of the state don\'t send things. They keep them.', 'DISPATCH: Board\'s empty. Check back at the next stop.']), null);
  for (;;) {
    const L = open.filter(jobOpen); if (!L.length) return;
    const i = await choose(L.map(j => '$' + j.pay + ' ' + j.desc.slice(0, 26)).concat(['DONE']), { x: 60, y: 40, cancel: 1 });
    if (i < 0 || i >= L.length) return;
    const j = L[i];
    if (jobParcels().length >= cargoMax()) { await say('DISPATCH: Your bay\'s full, Carl. ' + cargoMax() + ' side parcels. The catalog sells a rack.', null); return; }
    const c = await ask(j.desc + ' TO ' + j.who + ' AT ' + STOPTAB[j.to].name + '. PAYS $' + j.pay + '.', null, ['TAKE IT', 'NO']);
    if (c !== 0) continue;
    sfx('door'); addParcel({ id: 'job_' + j.id, job: j.id, desc: j.desc, toName: j.who + ' (' + STOPTAB[j.to].name + ')', from: STOPTAB[j.from].name, model: j.model === 'crate' ? 'crate' : 'parcel' });
    await say('THE CEILING OPENS A LITTLE. THERE IS NO CHUTE. ' + j.desc + ' DROPS INTO THE CARGO BAY.');
  }
}
function jobEnts(sceneId) {
  return jobParcels().map(p => JOBS.find(j => j.id === p.job)).filter(j => j && j.scene === sceneId).map(j => ({
    id: 'job_' + j.id, kind: 'npc', model: j.model || 'tourist', at: [j.at[0], 0, j.at[1]], label: j.who, faceCarl: 1, yaw: j.yaw || Math.PI, range: 2.3, talk: () => deliverJob(j) }));
}
async function deliverJob(j) {
  const p = C3.parcels.find(p => p.job === j.id && p.status === 'carry'); if (!p) return;
  if (j.task && !(await j.task())) return;
  await say2(j.lines);
  p.status = 'delivered'; C3.jobsDone[j.id] = 1; C3.deliveries++; C3.bux += j.pay; sfx('get'); tickC(pick(['W delivery', 'courier carl', '+$' + j.pay, 'he is actually good at this']));
  await say('DELIVERED. +$' + j.pay + '. ($' + C3.bux + ')');
  if (j.after) await j.after();
  const e = ent3('job_' + j.id); if (e) e.gone = 1;
}

// ---------------- the 31 decoy crates ----------------
// CRATES: { n: 1..31, scene, at: [x, z], note, cond?() } . each one is from the tall ones' walk, nineteen years ago.
const CRATES = [];
const cratesFound = () => Object.keys(C3.crates || {}).length;
function crateEnts(sceneId) {
  return CRATES.filter(c => c.scene === sceneId && !C3.crates[c.n] && (!c.cond || c.cond())).map(c => ({
    id: 'crate' + c.n, kind: 'npc', model: MODEL.crate, at: [c.at[0], 0, c.at[1]], label: 'CRATE', range: 1.6, s: 1.3, haze: UP3('scanner') ? 'DECOY #' + c.n : '', talk: e => openCrate(c, e) }));
}
async function openCrate(c, e) {
  C3.crates[c.n] = 1; sfx('get'); e.gone = 1;
  await say('A CRATE, STENCILED "DECOY." #' + c.n + ' OF 31. EMPTY, EXCEPT FOR A STRIP OF PAPER TAPED INSIDE THE LID.');
  await showCard(wrapT(c.note.toUpperCase(), 30), 0, { fg: hex('#ffe8c0') });
  addNote('CRATE #' + c.n + ': ' + c.note);
  const n = cratesFound(); tickC(n + ' of 31', 'user_000');
  if (n === 31) await say2([['CARL', 'That\'s all of them. Thirty-one. They\'re all empty.'], ['CARL', 'Thirty-one empty boxes is a lot of not being there.']]);
}
async function cratesScreen() {
  const prev = scene, got = CRATES.filter(c => C3.crates[c.n]).sort((a, b) => a.n - b.n); let top = 0;
  scene = { draw() {
    skyD(0, H, '#d8c898', '#b09868'); frameRect(6, 6, W - 12, H - 12, hex('#6d4924')); text('DECOY CRATES  ' + cratesFound() + '/31', 16, 12, hex('#6d2a10'));
    if (!got.length) text('NONE YET. THEY ARE OUT THERE. THEY ARE EMPTY.', 16, 40, hex('#3a2410'), 0);
    got.slice(top, top + 6).forEach((c, i) => { text('#' + c.n, 16, 30 + i * 30, hex('#b62424'), 0); wrapT(c.note.toUpperCase(), 44).slice(0, 2).forEach((l, k) => text(l, 40, 30 + i * 30 + k * 10, hex('#3a2410'), 0)); });
    if (got.length > 6) text('UP/DOWN', W - 60, H - 18, hex('#6d4924'), 0);
  } };
  sfx('tick');
  for (;;) { await nextFrame(); if (pressed.up) top = Math.max(0, top - 1); if (pressed.down) top = Math.min(Math.max(0, got.length - 6), top + 1); if (pressed.a || pressed.b || pressed.start) break; }
  sfx('tick'); scene = prev;
}

// ---------------- the catalog: mail-order upgrades for the A.S.S. ----------------
// UPGRADES: { id, name, cost, desc, buy?() } . owning one is UP3(id).
const UPGRADES = [
  { id: 'rack', name: 'CARGO RACK', cost: 40, desc: 'SIX SIDE PARCELS INSTEAD OF THREE.' },
  { id: 'scanner', name: 'CRATE SCANNER', cost: 60, desc: 'THE HAZE (C) SHOWS DECOY CRATES.' },
  { id: 'cb', name: 'CB RADIO', cost: 30, desc: 'CHANNEL 19. TRUCKERS KNOW THINGS.' },
  { id: 'plates', name: 'SECOND SET OF PLATES', cost: 80, desc: 'HALF AS MANY CHECKPOINTS.' },
  { id: 'paint', name: 'TWO-TONE PAINT', cost: 50, desc: 'IT DOES NOTHING. IT LOOKS INCREDIBLE.', buy: () => { SHIP.parts[0].col = [220, 90, 150]; } },
];
async function catalog() {
  ensure3();
  for (;;) {
    const L = UPGRADES.filter(u => !UP3(u.id));
    if (!L.length) return say('THE CATALOG. EVERY PAGE HAS A CHECKMARK. CARL HAS BOUGHT AN ENTIRE CATALOG.');
    const i = await choose(L.map(u => '$' + u.cost + ' ' + u.name).concat(['CLOSE']), { x: 60, y: 40, cancel: 1 });
    if (i < 0 || i >= L.length) return;
    const u = L[i]; const c = await ask(u.name + ': ' + u.desc + ' ($' + C3.bux + ' ON HAND)', null, ['ORDER IT', 'NO']);
    if (c !== 0) continue;
    if (C3.bux < u.cost) { await say('NOT ENOUGH BUX. THE CATALOG DOESN\'T JUDGE. THE CATALOG IS PAPER.'); continue; }
    C3.bux -= u.cost; C3.up[u.id] = 1; if (u.buy) u.buy(); sfx('get');
    await say('THE CEILING OPENS A LITTLE. ' + u.name + ' DROPS OUT, ALREADY INSTALLED. NOBODY ASKS HOW.');
  }
}
// the CB: one line per stop from CBTALK[stop] (in order), then idle chatter
const CBTALK = {}, CBIDLE = ['...breaker one-nine, anybody got eyes on a white sedan... ', '...that little green fella in the saucer, he\'s good people, let him over...', '...nothing out here but road and the road\'s fine...'];
async function cbRadio() {
  const L = CBTALK[C3.stop] || [], k = 'cb' + C3.stop, n = C3.road[k] || 0;
  sfx('static'); if (n < L.length) { C3.road[k] = n + 1; const [who, t] = L[n]; await say(t, who); } else await say(pick(CBIDLE), 'CH 19');
}
const _radioMenu = radioMenu;
radioMenu = async function () {
  if (!UP3('cb')) return _radioMenu();
  const i = await choose(['THE RADIO', 'CB (CH 19)', 'HANG UP'], { x: 20, y: 40, cancel: 1 });
  if (i === 0) return _radioMenu(); if (i === 1) return cbRadio();
};

// ---------------- hooks into the world: extra entities on every scene load, the ship's new props, HUD, pause menu ----------------
const _loadScene3 = loadScene;
// a job for someone already standing in the scene (NED, DOT, DOLORES...) goes through them, not a clone next to them
loadScene = function (id, x, z, yaw) { ensure3(); _loadScene3(id, x, z, yaw); for (const d of jobEnts(id).concat(crateEnts(id))) {
  const npc = d.id.startsWith('job_') && WX.ents.find(e => e.label === d.label && e.talk && live3(e));
  if (!npc) { addEnt3(d); continue; }
  const jid = d.id.slice(4), t = npc.talk; npc.talk = e => jobParcels().some(p => p.job === jid) ? d.talk() : t(e);
} };
const _shipEnts3 = SCENES.ship.ents;
SCENES.ship.ents = () => _shipEnts3().concat([
  { id: 'board', kind: 'prop3', at: [-3, 0, 8.1], label: 'JOB BOARD', range: 1.5, talk: () => jobBoard(), draw3: () => { const sp = project(LIVE.cam, [-3, 1.5, 8.9]); if (sp) { rectF(sp[0] - 9, sp[1] - 6, 18, 12, hex('#c8a070')); for (let i = 0; i < 3; i++) rectF(sp[0] - 7 + i * 5, sp[1] - 4, 4, 5, hex('#f8f8e8')); } } },
  { id: 'catalog', kind: 'prop3', at: [3, 0, 8.1], label: 'CATALOG', range: 1.5, talk: () => catalog(), draw3: () => { const sp = project(LIVE.cam, [3, 1.2, 8.9]); if (sp) { rectF(sp[0] - 6, sp[1] - 7, 12, 14, hex('#ff49b6')); rectF(sp[0] - 4, sp[1] - 4, 8, 3, hex('#ffffff')); } } },
]);
const _hud3 = drawHUD3;
drawHUD3 = function () {
  _hud3(); if (!C3) return;
  plate(W - 104, 34, 100, 14, { alpha: .72 }); shadowText('$' + C3.bux, W - 98, 37, hex('#6dff92'));
  if (F3('done3')) { text('HEAT', W - 62, 37, UI3.dim); for (let i = 0; i < 5; i++) rectF(W - 36 + i * 6, 38, 4, 6, i < heat3() ? hex('#ff4949') : hex('#44568c')); }
};
pauseMenu3 = async function () {
  sfx('tick');
  for (;;) {
    const i = await choose(['PARCELS', 'ALIBIS', 'ROUTE CARD', 'CRATES', 'ASK CHAT', 'SAVE', 'CLOSE'], { x: W - 116, y: 22, cancel: 1 });
    if (i === 0) { await parcelsScreen(); continue; } if (i === 1) { await alibiScreen(); continue; } if (i === 2) { await routeScreen(); continue; }
    if (i === 3) { await cratesScreen(); continue; } if (i === 4) { await askChat3(); continue; }
    if (i === 5) { saveC3(); sfx('ok'); await say('SAVED. THE POST OFFICE KEEPS A COPY.'); continue; }
    return;
  }
};
routeScreen = async function () {
  const prev = scene;
  scene = { update() { WX.t++; }, draw() { drawNevada(-1, []); C3.notes.slice(-3).forEach((n, i) => { plate(4, H - 44 + i * 13, W - 8, 12, { alpha: .7, flat: 1 }); text(n.slice(0, 50), 8, H - 42 + i * 13, UI3.text, 0); }); } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
};
// ---------------- ACT II -> III. the impostor reveal goes here (finishing pass) ----------------
async function act2Finale() {
  await say2([[DI, 'Carl. That\'s every clerk on the fork. The tracker says the parcel is... it says "in transit," and then it says "in transit" again, in a different font.'], ['CARL', 'Is that bad?'], [DI, 'Mail doesn\'t have fonts, Carl.']]);
  setF3('act2fin');
}
