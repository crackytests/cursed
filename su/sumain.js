'use strict';
// ================= STICK UP: busts, radio, boot, title, the director that runs free roam =================
const SUMETA = fetchStore('su_meta') || { boots: 0, ends: {} };
const saveSUM = () => store('su_meta', SUMETA);
// ---------------- busts: Carl never takes the mask off ----------------
{
  const m = carlBust(); m.parts[0].col = [26, 26, 34]; m.parts[1].col = [26, 26, 34];
  m.parts.splice(8, 2, { m: 'sphere:.2:6:4', o: [0, .68, 0], col: [200, 36, 48] });
  m.parts.push({ m: 'box:.36:.44:.04', o: [-.21, .02, .55], col: [70, 70, 84] }, { m: 'box:.36:.44:.04', o: [.21, .02, .55], col: [70, 70, 84] }, { m: 'box:.26:.12:.04', o: [0, -.3, .55], col: [70, 70, 84] });
  regBust('CARL', m, '#6dff92');
  const L = genBust({ skin: '#f0d0c0', hair: '#ff70b8', top: '#18181e', collar: '#24242c', tie: '#ff70b8' });
  L.parts.forEach(p => { if (p.tag === 'mouth') p.col = [96, 20, 52]; });
  L.parts.push({ m: 'sphere:.32:8:6', o: [0, .55, -.3], col: [255, 112, 184] }, { m: 'box:.2:.6:.2', o: [0, .9, -.5], col: [255, 112, 184] }, { m: 'box:.2:.06:.05', o: [-.18, .16, .5], col: [255, 90, 200] }, { m: 'box:.2:.06:.05', o: [.18, .16, .5], col: [255, 90, 200] }, { m: 'box:.06:.5:.05', o: [-.3, -1.1, .36], col: [70, 70, 84] }, { m: 'box:.06:.5:.05', o: [.3, -1.1, .36], col: [70, 70, 84] });
  regBust(['CEO LINDA', 'LINDA'], L, '#ff5aa8');
}
regBust('DOUG WILDE', genBust({ skin: '#f0b692', hair: '#dbb649', top: '#ff6db6', shades: 1, collar: '#f0f0f0' }), '#ff6db6');
regBust('SERGE', genBust({ skin: '#db9249', hair: '#241010', hairStyle: 'long', top: '#f0f0f0', collar: '#24b6db' }), '#24dbff');
regBust('VALET', genBust({ skin: '#b6926d', hair: '#101010', top: '#b62424', cap: '#b62424', collar: '#ffdb49' }), '#ffdb49');
regBust('LAB GUY', genBust({ skin: '#dbb692', hair: '#6d4924', top: '#f0f0f0', glasses: 1, beard: 1 }), '#dbdb24');
regBust(['FED', 'AGENT'], genBust({ skin: '#dbb692', hair: '#241010', top: '#101014', shades: 1, tie: '#24246d', collar: '#f0f0f0' }), '#9fb8ff');
regBust('COP', genBust({ skin: '#b6926d', hair: '#101010', top: '#24246d', cap: '#101024', badge: 1, collar: '#9fb8ff' }), '#2449ff');
Object.assign(VOICE, { 'DOUG WILDE': [600, 90], SERGE: [520, 120], VALET: [700, 50], 'LAB GUY': [440, 80], FED: [360, 10], AGENT: [360, 10], COP: [420, 30], 'CEO LINDA': [780, 40], LINDA: [780, 40] });
// ---------------- music + radio ----------------
Object.assign(TRACKS, {
  su_title: cgen({ bpm: 96, prog: [cAm, cAm, cF, cG], lead: [CT.sync, CT.answer, CT.hook, CT.long], leadIns: 'sax', arp: CA.gap, arpIns: 'guitar', bass: CB.funk, drums: CD.four, drumVol: .5 }),
  su_prop: cgen({ bpm: 104, prog: [cEm, cEm, cC, cD], lead: [CT.sync, CT.hook, CT.sync, CT.turn], leadIns: 'synth', arp: CA.strum, arpIns: 'guitar', bass: CB.funk, drums: CD.four }),
  su_lounge: cgen({ bpm: 72, prog: [cDm, cG, cC, cAm], lead: [CT.long, CT.hook, CT.sparse, CT.turn], leadIns: 'vibes', arp: CA.roll, arpIns: 'epiano', arpVol: .3, bass: CB.walk, drums: CD.soft, drumVol: .3 }),
  su_chat: cgen({ bpm: 84, prog: [cC, cAm, cF, cG], lead: [CT.sparse, CT.sparse, CT.sparse, CT.long], leadIns: 'epiano', leadVol: .3, arp: CA.climb, arpVol: .25, bass: CB.slow, drums: CD.soft, drumVol: .2 }),
  su_country: cgen({ bpm: 120, prog: [cG, cC, cD, cG], lead: [CT.hook, CT.rise, CT.low, CT.long], leadIns: 'guitar', arp: CA.strum, arpIns: 'pluck', bass: CB.twang, drums: CD.half }),
  su_tense: cgen({ bpm: 132, prog: [cEm, cC, cEm, cD], lead: [CT.sync, CT.sync, CT.answer, CT.rise], leadIns: 'synth', arp: CA.gap, arpIns: 'pluck', bass: CB.pump, drums: CD.ind, drumVol: .5 }),
  su_heist: cgen({ bpm: 112, prog: [cAm, cF, cDm, cE], lead: [CT.low, CT.sync, CT.low, CT.rise], leadIns: 'brass', arp: CA.up, arpIns: 'pluck', arpVol: .3, bass: CB.pump, drums: CD.four, drumVol: .5 }),
  su_end: cgen({ bpm: 78, prog: [cF, cG, cEm, cAm], lead: [CT.long, CT.hook, CT.long, CT.turn], leadIns: 'sax', arp: CA.roll, arpIns: 'epiano', bass: CB.slow, drums: CD.soft, drumVol: .3 }),
  su_dys: cgen({ bpm: 66, prog: [cEm, cBm, cC, cD], lead: [CT.long, CT.sparse, CT.answer, CT.long], leadIns: 'vibes', leadVol: .36, arp: CA.gap, arpIns: 'epiano', arpVol: .24, bass: CB.slow, bassVol: .5, drums: false }),
});
const STATIONS = [{ name: 'RADIO OFF' }, { name: 'NON-STOP-PROP 101.1', tr: 'su_prop' }, { name: 'K-GHOST LOUNGE 88.8', tr: 'su_lounge' }, { name: 'CHAT FM 420 (TALK)', tr: 'su_chat', chat: 1 }, { name: 'VICE VERSA COUNTRY 97', tr: 'su_country' }, { name: 'K-DYS 106.7', tr: 'su_dys', dj: 1 }];
const DYSLEXIO_LINES = ['DYSLEXIO: EVERY ARRANGEMENT OF THE WORD IS VISIBLE TO ME. ALL AT ONCE.', 'DYSLEXIO: YOU CALL IT A DISORDER. I CALL IT RANGE.', 'DYSLEXIO: HOMO BASIC READS ONE WAY. I READ EVERY WAY.', 'DYSLEXIO: THE LETTERS NEVER SIT STILL FOR ME. NEITHER DO I.', 'DYSLEXIO. WITH AN O. REMEMBER THAT.', 'DYSLEXIO: WE MEANT EVERY VERSION.', 'DYSLEXIO: THIS STATION IS FOR THE ONES WHO SEE SIDEWAYS.'];
const CHATS = ['XX_GORP: IS THAT A STICK', 'MODDY_MOD: NO BACKSEAT DRIVING', 'CARLFAN99: HI CARL', 'L1NDA_STAN: SHE LOOKS GREAT', 'GHOSTGIRL: SPOOKY ALIMONY LMAO', 'TP_ENJOYER: TP WOULD NEVER', 'ANON: USE YOUR BLINKER', 'FACEFAN: FACE IS WATCHING ON 11 CAMERAS', 'XX_GORP: CHAT HE IS GOING THE WRONG WAY', 'HU_MAN_4: I LOVE THIS STATION', 'CARLFAN99: THE MASK IS FASHION', 'B4CKSEAT: TURN LEFT', 'MODDY_MOD: STAY ON TOPIC (THE STICK)', 'OLDHEAD: GTA DID IT FIRST', 'CARLFAN99: CARL DID IT FIRST'];
function radioOn() { if (SU.mus) return; const s = STATIONS[SU.radio]; music(s.tr || null); SU.radioT = 100; }
function radioOff() { if (!SU.mus) music(null); }
function radioNext() { SU.radio = (SU.radio + 1) % STATIONS.length; if (!SU.mus) music(STATIONS[SU.radio].tr || null); SU.radioT = 100; sfx('static'); }
function chatTick() { if (frame % 200 === 0) SU.chatLine = STATIONS[SU.radio].dj ? pick(DYSLEXIO_LINES) : pick(CHATS); }
const setMus = t => { SU.mus = t; music(t || (PL.car ? STATIONS[SU.radio].tr || null : null)); };
// ---------------- boot + title ----------------
async function boot() {
  SUMETA.boots++; jobsHi(); saveSUM();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0; const cam = mkCam([0, 3.2, -30], [0, 3.2, 0], .8);
  scene = { update() { t++; }, draw() { cls(hex('#000010')); ZD.fill(0); LIVE.cam = cam; const k = Math.min(1, t / 90);
    drawVox('PRETEND', [0, 4.6, 0], -.9 + k * .9 + Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [225, 225, 245], VLIGHT); drawVox('CO.', [0, 1.2, 0], .9 - k * .9 - Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [255, 90, 160], VLIGHT); } };
  post.fade = 1; await fadeIn(.06); await wait(110); sfx('ok'); speak('Pretend co!', { pitch: .9 }); await wait(70); await fadeOut(.06);
  scene = { draw() { cls(hex('#000012')); ctext('HYPER-32', 52, hex('#24ffdb'), BLACK, 2); ctext('THE CHIP RENDERS THE WHOLE CITY IN 3D.', 96, UI3.text); ctext('FROM ABOVE.', 108, UI3.text); ctext('LIKE GOD. OR A HELICOPTER.', 134, UI3.dim); } };
  await fadeIn(.06); await wait(150); await fadeOut(.06);
  scene = { draw() { cls(BLACK); ctext('BUILDING VICE VERSA...', 100, hex('#ffdb49')); } }; post.fade = 0; await nextFrame(); await nextFrame();
  genCity(); genEyes();
  run(titleSU);
}
async function titleSU() {
  const sv = fetchStore('su_save'), ends = Object.keys(SUMETA.ends).length;
  post.fade = 1; DLG = null; MENUS.length = 0; CARD = null; music('su_title');
  let t = 0; CAM.s = .8; SU.min = 600; SU.below = 0; SU.trip = .9; post.wave = 1;
  scene = { update() { t++; CAM.x = 15 * T + t * .5 % (20 * T); CAM.y = 20 * T + Math.sin(t * .004) * 200; }, draw() {
    drawGround(); drawBuildings(); drawTrees(); drawDrift(); postFX(); rectA(0, 0, W, H, hex('#05081a'), .35);
    drawBust('CARL', 196, 64, 110, 110, 0, t); frameRect(195, 63, 112, 112, hex('#6dff92'));
    text('CARL', 14, 30, hex('#6dff92'), hex('#05081a'), 4);
    text('THIS IS A', 16, 72, WHITE, BLACK, 2);
    [...'STICK UP!'].forEach((ch, i) => { const h = t * .06 + i * .7; text(ch, 16 + i * 18, 92 + Math.round(Math.sin(t * .08 + i * .9) * 3), rgb(160 + 95 * Math.sin(h), 160 + 95 * Math.sin(h + 2.1), 160 + 95 * Math.sin(h + 4.2)), hex('#3a0a24'), 3); });
    if ((t >> 5) & 1) text('PUSH START', 40, 150, WHITE);
    ctext('(C)1999 PRETEND CO.  NO STICKS WERE HARMED', 210, hex('#9aa4d0'));
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE'] : []).concat(['NEW GAME']).concat(ends ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 30, y: 164, cancel: 1 });
  if (i < 0) return titleSU();
  SU.trip = 0; post.wave = 0;
  if (opts[i] === 'ENDINGS SEEN') { const nm = { sensible: 'SOMETHING SENSIBLE', timescome: "THE TIME'S COME", deathwish: 'DEATHWISH' }; await showCard(['ENDINGS SEEN', '', ...Object.keys(nm).map(k => (SUMETA.ends[k] ? '* ' : '- ') + nm[k])], 0, { fg: hex('#ffdb49') }); return titleSU(); }
  if (opts[i] === 'NEW GAME' && sv) { const c = await ask('START OVER? YOUR SAVE WILL BE ERASED.', null, ['NO', 'YES']); if (c !== 1) return titleSU(); }
  await fadeOut(.06);
  startGame(opts[i] === 'CONTINUE' ? sv : null);
}
// ---------------- a game ----------------
function resetWorld() {
  CARS = []; PEDS = []; SHOTS = []; FX = []; PICK = []; MARKS = []; FLY = [];
  BOMBS = []; resetInts();
  Object.assign(SU, { hp: 100, heat: 0, wanted: 0, search: 0, cut: 0, paused: 0, obj: '', big: null, timer: 0, bar: null, end: null, mus: null, inMission: null, onSwing: null, trip: 0, tripLock: 0, below: 0, glowT: 0, noLaw: 0, job: null, jobT: 0, ramp: null, rampDone: {}, stat: SU.stat });
  Object.assign(PL, { car: null, remote: null, bust: 0, swing: 0, down: 0 });
  for (const k of Object.keys(STORES)) PLACES[k].robbed = 0;
  for (const b of BLD) { b.sink = 0; if (b.z0) b.z = b.z0; }
  const ass = spawnCar('ass', PLACES.ass.x, PLACES.ass.y, -Math.PI / 2, { drv: null, tag: 'ass', parked: 0 }); ass.minHp = 1;
  for (const p of [PLACES.hosp, { x: 21 * T + 16, y: 13 * T + 8 }, { x: 40 * T, y: 31 * T + 8 }]) PICK.push({ k: 'pills', x: p.x, y: p.y + 20, t: 1 });
}
function saveGame() { store('su_save', { cash: SU.cash, done: SU.done, wep: SU.wep, ship: SU.ship, stat: SU.stat, radio: SU.radio, ammo: SU.ammo, eyes: SU.eyes, strangers: SU.strangers, acts: SU.acts, min: SU.min, thirdEye: SU.thirdEye, belowKey: SU.belowKey, jumps: SU.jumps, rampDone: SU.rampDone, garage: SU.garage }); }
function startGame(sv) {
  resetWorld();
  Object.assign(SU, { cash: 0, done: {}, wep: ['STICK'], wi: 0, ship: 0, stat: { stickups: 0, peds: 0, cars: 0 }, robbed: 0, ammo: { bomb: 0 }, eyes: [], strangers: {}, acts: {}, min: 540, thirdEye: 0, belowKey: 0, jumps: [], rampDone: {}, garage: [] }, sv || {});
  if (SU.done.propburn) rubbleLab();
  PL.x = PLACES.crib.x; PL.y = PLACES.crib.y + 24; PL.a = 0; warpCam();
  scene = gameScene; post.fade = 1;
  run(director);
}
const gameScene = {
  update() { if (SU.paused && !DLG && !MENUS.length) pauseKeys(); if (post.flash > 0) post.flash = post.flash < .03 ? 0 : post.flash * .9; if (post.shake > 0) post.shake = Math.max(0, post.shake - .5); if (pressed.start && !DLG && !MENUS.length && !SU.cut && !SU.end) { SU.paused ^= 1; sfx('tick'); } stepWorld(); chatTick(); },
  draw() { drawWorld(); postFX(); drawScreenFX(); bloomPass(); drawHUD(); },
};
function bigText(s, c, t = 150, sub) { SU.big = { s, c, t, sub }; }
// free roam: contact blips, the store, the spray shop, dying, getting busted
async function director() {
  await fadeIn(.05);
  if (!SU.done.stickup) await runMission('stickup');
  for (;;) {
    await nextFrame();
    if (SU.end) { await deathSeq(); continue; }
    if (SU.cut || SU.paused) continue;
    const m = nextMission(); refreshBlips(m);
    const p = plPos();
    if (SU.job || SU.ramp) continue;
    const st = !PL.car || Math.hypot(PL.car.vx, PL.car.vy) < 1 ? openStrangers().find(s => d2(s.pos, p) < 20 * 20) : null;
    if (st && !(PL.car && PL.car.z)) { await runMission(st.id); continue; }
    if (m) { const g = PLACES[m.giver]; if (d2(g, p) < 20 * 20 && (!PL.car || Math.hypot(PL.car.vx, PL.car.vy) < 1) && !(PL.car && PL.car.z)) { const ok = await runMission(m.id); if (ok && m.id === 'bigscore') { await endingSeq(); return run(titleSU); } continue; } }
    if (PL.car && !CARM[PL.car.m].ship && d2(PLACES.spray, PL.car) < 22 * 22 && Math.hypot(PL.car.vx, PL.car.vy) < 1.2 && !SU.sprayT) await sprayShop();
    if (SU.sprayT) SU.sprayT--;
  }
}
function refreshBlips(m) {
  MARKS = MARKS.filter(k => !k.roam);
  if (m) MARKS.push({ roam: 1, x: PLACES[m.giver].x, y: PLACES[m.giver].y, ch: m.ch, c: m.c, r: 12 });
  MARKS.push({ roam: 1, x: PLACES.spray.x, y: PLACES.spray.y, ch: 'S', c: '#24dbff', r: 14, arrow: false });
  for (const k of Object.keys(STORES)) if ((PLACES[k].robbed || 0) <= frame) MARKS.push({ roam: 1, x: PLACES[k].x, y: PLACES[k].y, ch: '$', c: '#6dff92', r: 10, arrow: false });
  if (SU.done.sticknation) MARKS.push({ roam: 1, x: PLACES.shop.x, y: PLACES.shop.y, ch: '!', c: '#db9224', r: 10, arrow: false });
  for (const s of openStrangers()) MARKS.push({ roam: 1, x: s.pos.x, y: s.pos.y, ch: '?', c: '#b6ff24', r: 10, arrow: false });
}
async function sprayShop() {
  if (!SU.wanted && PL.car.hp > 90) { pop(PL.x, PL.y, 'PROP\'N\'SPRAY: YOU LOOK FINE', '#24dbff'); SU.sprayT = 200; return; }
  if (SU.cash < 100) { pop(PL.x, PL.y, '$100. YOU HAVE $' + SU.cash + '.', '#24dbff'); SU.sprayT = 200; return; }
  SU.cut = 1; PL.car.vx = PL.car.vy = 0; await fadeOut(.08); sfx('flush');
  SU.cash -= 100; setWanted(0); PL.car.hp = 100; PL.car.fire = 0; PL.car.col = hex(pick(CARM[PL.car.m].cols.concat(['#24db92', '#9249db']))); for (const c of CARS) if (c.drv === 'cop') { c.chase = 0; c.siren = 0; } for (const q of PEDS) if (q.cop) q.dead = 1;
  await wait(30); await fadeIn(.08); pop(PL.x, PL.y, 'NEW PAINT. NEW CARL.', '#24dbff'); SU.cut = 0; SU.sprayT = 300;
}
// paused: C toggles the third eye, B the Below, once they're earned
function pauseKeys() {
  if (pressed.c && SU.thirdEye) { SU.tripLock = SU.tripLock ? 0 : 1; SU.trip = SU.tripLock ? 1 : .2; sfx('phase'); }
  if (pressed.b && SU.belowKey && !SU.inMission) { SU.below = SU.below ? 0 : 1; SU.noLaw = SU.below; sfx('glitch'); }
}
function completion() {
  const m = MISSIONS.filter(x => SU.done[x.id]).length, st = Object.keys(SU.strangers).length, e = SU.eyes.length, w = SU.wep.length - 1;
  return { m, st, e, w, pct: Math.round((m / MISSIONS.length * 60 + st / STRANGERS.length * 15 + e / 24 * 20 + Math.min(1, w / 5) * 5)) };
}
async function deathSeq() {
  const busted = SU.end === 'busted'; SU.cut = 2; SU.paused = 0;
  bigText(busted ? 'BUSTED' : 'WASTED', busted ? '#2449ff' : '#ff2449', 170, busted ? 'IT WAS A STICK. THEY KNOW IT WAS A STICK.' : 'CARL HAS BEEN MEDICALLY INCONVENIENCED.');
  sfx('powerdown'); setMus(null); music(null); await wait(160); await fadeOut(.05);
  const fee = Math.min(SU.cash, busted ? Math.ceil(SU.cash * .1) : 100); SU.cash -= fee;
  missionCleanup(); for (const c of CARS) if (c.drv === 'cop') c.dead = 1; for (const q of PEDS) if (q.cop) q.dead = 1;
  if (PL.car) { PL.car.drv = null; PL.car = null; }
  const at = busted ? PLACES.cell : PLACES.hospBed; PL.x = at.x; PL.y = at.y; unstick(PL); SU.hp = 100; setWanted(0); PL.bust = 0; PL.down = 0; SU.end = null; warpCam();
  await wait(10); await fadeIn(.05); pop(PL.x, PL.y, busted ? 'BAIL: $' + fee + '. (THE CELL WAS NEVER LOCKED.)' : 'BILL: $' + fee, '#ffdb49'); SU.cut = 0;
  if (SU.failNote) { SU.failNote = 0; bigText('MISSION FAILED', '#ff2449', 160); }
}
