'use strict';
// ================= ROMANCING STREAM: music, portraits, boot, title, choosing who you are =================
// Short melodic cells give the score clear hooks without changing its soft FM palette.
const RSM = {
  call: '2 - - . 1 - - . 0 - 1 - 2 - - .',
  stride: '0 . 2 - . 1 - 3 . 2 - . 1 - 0 .',
  swell: '0 - - . 1 - 2 - 3 - - . 2 - - .',
  spark: '. 0 . 2 1 . 3 - . 2 . 1 0 - . .',
  undertow: '0 - - - . 1 - - 2 - - - . 1 - -',
  pulse: '0 - . 2 . 1 - . 3 - . 2 - 1 - .',
};
Object.assign(TRACKS, {
  rstitle: cgen({ bpm: 92, prog: [cDm, cBb, cF, cC], lead: [RSM.call, RSM.swell, CT.rise, RSM.call], leadIns: 'brass', leadVol: .38, arp: CA.roll, arpIns: 'pluck', arpVol: .26, bass: CB.slow, bassVol: .5, drums: CD.soft, drumVol: .25 }),
  rsmap: cgen({ bpm: 104, prog: [cC, cG, cAm, cF], lead: [RSM.call, CT.answer, RSM.stride, RSM.call], leadIns: 'brass', leadVol: .36, arp: CA.strum, arpIns: 'pluck', arpVol: .26, bass: CB.walk, bassVol: .5, drums: CD.four, drumVol: .3 }),
  rstown: cgen({ bpm: 96, prog: [cG, cC, cD, cG], lead: [RSM.stride, CT.sparse, CT.turn, RSM.call], leadIns: 'pluck', leadVol: .36, arp: CA.strum, arpIns: 'epiano', arpVol: .24, bass: CB.walk, bassVol: .45, drums: CD.soft, drumVol: .25 }),
  rsmall: cgen({ bpm: 100, prog: [cC, cAm, cF, cG], lead: [RSM.spark, CT.hook, CT.answer, RSM.stride], leadIns: 'epiano', leadVol: .34, arp: CA.climb, arpIns: 'bell', arpVol: .24, bass: CB.funk, bassVol: .5, drums: CD.four, drumVol: .3 }),
  rslounge: cgen({ bpm: 76, prog: [cDm, cG, cC, cAm], lead: [RSM.undertow, CT.sparse, RSM.call, CT.sparse], leadIns: 'epiano', leadVol: .36, arp: CA.roll, arpIns: 'bell', arpVol: .2, bass: CB.walk, bassVol: .5, drums: CD.half, drumVol: .22 }),
  rsstudio: cgen({ bpm: 112, prog: [cEm, cC, cG, cD], lead: [RSM.spark, CT.sync, RSM.stride, RSM.swell], leadIns: 'lead', leadVol: .34, arp: CA.gap, arpIns: 'pluck', arpVol: .26, bass: CB.pump, bassVol: .5, drums: CD.ind, drumVol: .32 }),
  rsmandolin: cgen({ bpm: 88, prog: [cF, cC, cDm, cBb], lead: [RSM.stride, RSM.call, CT.rise, RSM.swell], leadIns: 'pluck', leadVol: .4, arp: CA.up, arpIns: 'pluck', arpVol: .24, bass: CB.slow, bassVol: .45, drums: CD.soft, drumVol: .2 }),
  rsnoir: cgen({ bpm: 70, prog: [cAm, cDm, cE, cAm], lead: [RSM.undertow, CT.long, CT.low, CT.turn], leadIns: 'brass', leadVol: .3, arp: CA.roll, arpIns: 'epiano', arpVol: .22, bass: CB.walk, bassVol: .5, drums: CD.half, drumVol: .2 }),
  rsfield: cgen({ bpm: 108, prog: [cD, cA, cBm, cG], lead: [RSM.call, RSM.stride, CT.answer, RSM.swell], leadIns: 'pluck', leadVol: .36, arp: CA.strum, arpIns: 'epiano', arpVol: .24, bass: CB.walk, bassVol: .45, drums: CD.four, drumVol: .28 }),
  rsgate: cgen({ bpm: 116, prog: [cEm, cD, cC, cD], lead: [RSM.stride, CT.sync, RSM.swell, RSM.call], leadIns: 'brass', leadVol: .36, arp: CA.gap, arpIns: 'pluck', arpVol: .24, bass: CB.pump, bassVol: .5, drums: CD.four, drumVol: .32 }),
  rsdungeon: cgen({ bpm: 84, prog: [cAm, cF, cDm, cE], lead: [RSM.undertow, CT.low, RSM.spark, CT.low], leadIns: 'organ', leadVol: .3, arp: CA.gap, arpIns: 'bell', arpVol: .22, bass: CB.slow, bassVol: .5, drums: CD.half, drumVol: .22 }),
  rshaunt: cgen({ bpm: 72, prog: [cDm, cBb, cEm, cA], lead: [RSM.undertow, CT.sparse, RSM.call, CT.turn], leadIns: 'organ', leadVol: .3, arp: CA.roll, arpIns: 'bell', arpVol: .2, bass: CB.slow, bassVol: .45, drums: false }),
  rsminion: cgen({ bpm: 96, prog: [cEm, cC, cAm, cBm], lead: [RSM.spark, RSM.stride, RSM.pulse, RSM.call], leadIns: 'organ', leadVol: .32, arp: CA.climb, arpIns: 'bell', arpVol: .24, bass: CB.pump, bassVol: .5, drums: CD.half, drumVol: .3 }),
  rsfinal: cgen({ bpm: 66, prog: [cDm, cBb, cC, cA], lead: [RSM.undertow, RSM.undertow, RSM.swell, RSM.call], leadIns: 'organ', leadVol: .34, arp: CA.roll, arpIns: 'bell', arpVol: .22, bass: CB.slow, bassVol: .5, drums: false }),
  rsbattle: cgen({ bpm: 150, prog: [cAm, cF, cG, cE], lead: [RSM.stride, RSM.spark, RSM.pulse, RSM.call], leadIns: 'brass', leadVol: .4, arp: CA.climb, arpIns: 'pluck', arpVol: .3, bass: CB.pump, bassVol: .6, drums: CD.ind, drumVol: .45 }),
  rsbattleE: cgen({ bpm: 144, prog: [cEm, cC, cD, cBm], lead: [RSM.call, RSM.spark, CT.answer, RSM.stride], leadIns: 'guitar', leadVol: .38, arp: CA.roll, arpIns: 'epiano', arpVol: .28, bass: CB.funk, bassVol: .58, drums: CD.four, drumVol: .45 }),
  rsbattleN: cgen({ bpm: 156, prog: [cF, cDm, cBb, cC], lead: [CT.sync, RSM.spark, RSM.stride, RSM.pulse], leadIns: 'organ', leadVol: .36, arp: CA.gap, arpIns: 'bell', arpVol: .3, bass: CB.pump, bassVol: .6, drums: CD.ind, drumVol: .48 }),
  rsbattleS: cgen({ bpm: 138, prog: [cAm, cDm, cF, cE], lead: [RSM.stride, RSM.call, RSM.swell, RSM.undertow], leadIns: 'sax', leadVol: .38, arp: CA.strum, arpIns: 'guitar', arpVol: .3, bass: CB.walk, bassVol: .58, drums: CD.four, drumVol: .42 }),
  rsboss: cgen({ bpm: 160, prog: [cDm, cBb, cC, cA], lead: [RSM.spark, RSM.stride, RSM.swell, RSM.call], leadIns: 'lead', leadVol: .42, arp: CA.gap, arpIns: 'bell', arpVol: .3, bass: CB.pump, bassVol: .6, drums: CD.ind, drumVol: .5 }),
  rsfinalboss: cgen({ bpm: 170, prog: [cEm, cC, cD, cBm], lead: [RSM.spark, RSM.pulse, RSM.stride, RSM.call], leadIns: 'lead', leadVol: .44, arp: CA.climb, arpIns: 'brass', arpVol: .3, bass: CB.funk, bassVol: .6, drums: CD.ind, drumVol: .55 }),
  rswin: cgen({ bpm: 132, prog: [cC, cF, cG, cC], lead: [CT.rise, RSM.call, RSM.swell, CT.long], leadIns: 'brass', leadVol: .4, arp: CA.up, arpIns: 'pluck', arpVol: .26, bass: CB.walk, bassVol: .5, drums: CD.four, drumVol: .35 }),
  rsending: cgen({ bpm: 80, prog: [cF, cC, cDm, cBb], lead: [RSM.undertow, RSM.call, RSM.swell, RSM.stride], leadIns: 'brass', leadVol: .38, arp: CA.roll, arpIns: 'epiano', arpVol: .26, bass: CB.slow, bassVol: .5, drums: CD.soft, drumVol: .22 }),
  // ---- the new country ----
  rsrewind: cgen({ bpm: 94, prog: [cDm, cC, cBb, cF], lead: [RSM.undertow, CT.turn, RSM.call, CT.answer], leadIns: 'organ', leadVol: .32, arp: CA.roll, arpIns: 'bell', arpVol: .22, bass: CB.slow, bassVol: .5, drums: CD.half, drumVol: .22 }),
  rslive: cgen({ bpm: 120, prog: [cA, cE, cD, cA], lead: [RSM.pulse, RSM.stride, RSM.swell, CT.turn], leadIns: 'guitar', leadVol: .38, arp: CA.strum, arpIns: 'guitar', arpVol: .28, bass: CB.pump, bassVol: .52, drums: CD.four, drumVol: .38 }),
  rsbrine: cgen({ bpm: 82, prog: [cDm, cC, cBb, cF], lead: [RSM.undertow, RSM.call, CT.low, RSM.swell], leadIns: 'sax', leadVol: .34, arp: CA.climb, arpIns: 'vibes', arpVol: .22, bass: CB.slow, bassVol: .5, drums: CD.soft, drumVol: .2 }),
  rsfound: cgen({ bpm: 100, prog: [cC, cAm, cDm, cG], lead: [RSM.call, CT.answer, RSM.stride, RSM.swell], leadIns: 'vibes', leadVol: .34, arp: CA.gap, arpIns: 'epiano', arpVol: .24, bass: CB.walk, bassVol: .48, drums: CD.half, drumVol: .26 }),
  rscity: cgen({ bpm: 108, prog: [cEm, cD, cC, cEm], lead: [RSM.stride, RSM.spark, RSM.pulse, RSM.call], leadIns: 'brass', leadVol: .38, arp: CA.climb, arpIns: 'organ', arpVol: .26, bass: CB.pump, bassVol: .54, drums: CD.ind, drumVol: .34 }),
  rscourt: cgen({ bpm: 66, prog: [cAm, cDm, cE, cAm], lead: [RSM.undertow, CT.long, CT.turn, RSM.undertow], leadIns: 'organ', leadVol: .3, arp: CA.roll, arpIns: 'bell', arpVol: .18, bass: CB.slow, bassVol: .5, drums: false }),
  rsbus: cgen({ bpm: 76, prog: [cG, cC, cG, cD], lead: [CT.long, CT.low, RSM.call, CT.turn], leadIns: 'guitar', leadVol: .32, arp: CA.gap, arpIns: 'epiano', arpVol: .22, bass: CB.twang, bassVol: .5, drums: CD.half, drumVol: .22 }),
  rsroad: cgen({ bpm: 88, prog: [cD, cG, cA, cD], lead: [RSM.stride, RSM.call, CT.turn, CT.low], leadIns: 'guitar', leadVol: .34, arp: CA.strum, arpIns: 'epiano', arpVol: .22, bass: CB.twang, bassVol: .52, drums: CD.half, drumVol: .26 }),
  rsfieldE: cgen({ bpm: 112, prog: [cEm, cG, cD, cC], lead: [RSM.call, RSM.stride, RSM.swell, RSM.call], leadIns: 'guitar', leadVol: .36, arp: CA.up, arpIns: 'pluck', arpVol: .24, bass: CB.walk, bassVol: .46, drums: CD.four, drumVol: .28 }),
  rsfieldN: cgen({ bpm: 96, prog: [cF, cDm, cBb, cC], lead: [RSM.undertow, CT.sparse, RSM.call, CT.turn], leadIns: 'vibes', leadVol: .34, arp: CA.roll, arpIns: 'bell', arpVol: .2, bass: CB.slow, bassVol: .46, drums: CD.soft, drumVol: .2 }),
  rsfieldS: cgen({ bpm: 104, prog: [cAm, cF, cC, cG], lead: [RSM.call, CT.hook, RSM.stride, RSM.swell], leadIns: 'sax', leadVol: .34, arp: CA.strum, arpIns: 'guitar', arpVol: .24, bass: CB.walk, bassVol: .46, drums: CD.soft, drumVol: .26 }),
  rssail: cgen({ bpm: 72, prog: [cC, cAm, cF, cG], lead: [RSM.undertow, CT.long, CT.answer, RSM.call], leadIns: 'vibes', leadVol: .32, arp: CA.climb, arpIns: 'epiano', arpVol: .22, bass: CB.slow, bassVol: .48, drums: CD.soft, drumVol: .18 }),
});
// voices and painted portraits (painted the first time somebody speaks)
Object.assign(VOICE, { CARL: [820, 40], 'CEO LINDA': [760, 20], 'SPOOKY GHOST': [520, 60], 'NEW FACE': [640, 10], YOKO: [900, 20], 'JB GARFIELD': [380, 30], 'PEE KID': [1100, 60], 'PILOT X': [600, 20], 'THE CURSE': [200, 80], 'AUNT PRETZEL': [520, 40], DYSLEXIO: [700, 120], MIMI: [980, 0], 'GENERAL RED': [300, 20], 'WHITE SUIT DIRECTOR': [440, 0],
  'PROP PILLS DRIVER': [660, 30], 'MALL COP': [420, 10], 'THE MEDIUM': [880, 60], 'THE STOOLIE': [500, 20], TAPEHEAD: [720, 100], 'THE DECKHAND': [340, 20], 'THE BUSKER': [780, 40], 'THE FINDER': [460, 0], 'GATE CENTURION': [280, 0], 'THE INTERN': [1000, 80], 'THE EMPRESS': [820, 10], 'A CLERK': [540, 10], 'THE BAILIFF': [320, 0], 'THE DISPATCHER': [400, 20], 'A COACH': [560, 30], 'A MECHANIC': [440, 20], 'A VOICE': [900, 0],
  'THE BUS': [240, 0], 'THE LATE FEE': [400, 80], 'MOTHER PICKLE': [300, 40], 'THE DRYER LORD': [360, 120], 'THE WALK-IN': [260, 60], 'THE PIZZA PIGEON': [940, 90], 'THE PYRE': [200, 120], 'THE GATEKEEPER': [340, 40], 'THE CHORUS': [580, 160], SARGASSO: [180, 40], 'THE FINDER, JUNIOR': [480, 40] });
function portraitOf(name, rig, pose, sc) { Object.defineProperty(PORT, name, { configurable: true, enumerable: true, get() { const img = paintPortrait(name, rig, pose, sc); return { img }; } }); }
function setupPortraits() {
  for (const id in HEROES) portraitOf(HEROES[id].name, HEROES[id].rig, (HEROES[id].poses === 'ghost' ? GHOST_POSES : PERSON_POSES).idle[0], id === 'carl' || id === 'ghost' ? 3.6 : 4.4);
  for (const id in EXTRA) portraitOf(EXTRA[id].name, EXTRA[id].rig, PERSON_POSES.idle[0]);
  for (const n of ['BARKEEP', 'CLERK', 'INNKEEPER', 'TEACHER', 'DOCKER']) Object.defineProperty(PORT, n, { configurable: true, enumerable: true, get: () => townPort(SHOPKEEP) }); // whoever is behind the counter
  Object.defineProperty(PORT, 'LOCAL', { configurable: true, enumerable: true, get: () => townPort(1) });
  for (const id in BOSSDEF) { const B = BOSSDEF[id], isP = B.poses === 'person'; portraitOf(B.name, B.rig(), isP ? PERSON_POSES.idle[0] : MPOSE.idle[0], isP ? 4.4 : 2.6); }
}
// ---------------- boot ----------------
async function boot() {
  scene = { draw() { cls(BLACK); ctext('PRESS ANY KEY', 106, rgb(120, 100, 80)); } };
  while (!anyKey) await nextFrame();
  scene = { draw() { paperFill(0, 0, W, H, 244, 232, 204); ctext('PRETEND CO.', 96, SEPIA, 0, 2); } }; post.fade = 1; await fadeIn(.05); sfx('ok'); await wait(90); await fadeOut(.05);
  scene = { draw() { cls(BLACK); ctext('HYPER-32', 60, rgb(36, 255, 219), BLACK, 2); ctext('EVERY PICTURE IN THIS GAME', 104, WHITE); ctext('IS PAINTED WHILE YOU WAIT.', 116, WHITE); ctext('THE PAINT IS STILL WET.', 142, UI.dim); } };
  await fadeIn(.05); await wait(130); await fadeOut(.05);
  scene = { draw() { paperFill(0, 0, W, H, 244, 232, 204); ctext('MIXING PAINT...', 104, SEPIA, 0); } }; post.fade = 0; await nextFrame(); await nextFrame();
  setupPortraits(); for (const id in HEROES) bakeHero(id); TITLEIMG = paintTitle();
  run(titleRS);
}
let TITLEIMG = null;
function paintTitle() {
  return painting('title', () => {
    const P = new Paint(W, H); P.sky(['#c8a0b8', '#e8c8b0', '#f6ead6'].map(pg), 150, .8);
    P.poly([[0, 150], ...Array.from({ length: 12 }, (_, i) => [i * 30, 130 - fbm(i * .6, 1) * 40]), [W, 150]], pg('#8a7aa0'), .45, { jit: 3 });
    P.poly([[0, 170], ...Array.from({ length: 12 }, (_, i) => [i * 30, 150 - fbm(i * .5, 5) * 24]), [W, 170]], pg('#6a8a7a'), .45, { jit: 3 });
    P.rect(0, 160, W, 64, pg('#b8a888'), .45, { jit: 3, gran: .5 });
    for (let i = 0; i < 30; i++) P.gouache(rnd2(i, 61) * W, 20 + rnd2(i, 62) * 80, .7 + rnd2(i, 63), [1, .98, .92], .6);
    P.rect(0, 0, W, H, [.6, .45, .3], .14, { jit: 0, edge: 0, grad: [W / 2, H / 2, 0, 0, 0, 1] });
    return P.out();
  });
}
const HERO_ORDER = ['carl', 'linda', 'ghost', 'face', 'yoko', 'garf', 'peekid', 'pilotx'];
async function titleRS() {
  GS = null; HOOK = 0; FIELD = null; DLG = null; MENUS.length = 0; CARD = null; post.fade = 1; post.flash = 0; music('rstitle');
  let t = 0; const sv = fetchStore(RSSAVE), meta = fetchStore(RSMETA) || { ends: {} };
  scene = { update() { t++; }, draw() {
    blitPaint(TITLEIMG || paintTitle());
    HERO_ORDER.forEach((id, i) => { const h = HSPR[id] || bakeHero(id); rsDraw(h.idle[((t >> 5) + i) & 1], 30 + i * 37, 196 + (i % 2) * 6, i >= 4); });
    text('ROMANCING', 96, 34, RUST, 0, 2); text('STREAM', 124, 56, SEPIA, 0, 3); ctext('THE TEN CARTRIDGES', 88, FADED, 0);
    if (!MENUS.length) ctext((t >> 5) & 1 ? 'ENTER / Z TO START' : '', 106, SEPIA, 0);
    ctext('(C)2001 PRETEND CO.', 214, FADED, 0);
  } };
  await fadeIn(.05); await nextFrame(); while (!(pressed.start || pressed.a || pressed.b)) await nextFrame(); sfx('ok');
  const ends = Object.keys(meta.ends || {}), opts = (sv ? ['CONTINUE'] : []).concat(['NEW GAME']).concat(ends.length ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 118, y: 120, cancel: 1 }); if (i < 0) return titleRS();
  if (opts[i] === 'ENDINGS SEEN') { await showCard(['ENDINGS SEEN', ''].concat(HERO_ORDER.map(h => (meta.ends[h + '+'] ? '** ' : meta.ends[h] ? '*  ' : '-  ') + HEROES[h].name)).concat(['', '** = WITH ALL TEN CARTRIDGES']), 0, { bg: PAPER, fg: SEPIA }); return titleRS(); }
  if (opts[i] === 'CONTINUE') { GS = migrateGS(sv); GS.busy = 0; await fadeOut(.06); return toMap(GS.loc); }
  if (sv && (await choose(['KEEP MY SAVE', 'START OVER'], { x: 110, y: 120 })) !== 1) return titleRS();
  const hero = await chooseHero(); if (!hero) return titleRS();
  await fadeOut(.06); GS = newGameState(hero); scene = { draw() { paperFill(0, 0, W, H, 244, 232, 204); } }; music(null);
  await showCard(['LONG AGO, TEN CARTRIDGES', 'SEALED THE CURSE INSIDE THE OLD STREAM.', '', 'NOBODY REMEMBERS THE GAMES.', 'EVERYBODY REMEMBERS THE CURSE.'], 0, { bg: PAPER, fg: SEPIA });
  await showCard([HEROES[hero].name, ''].concat(wrapT(ORIGINS[hero].blurb, 40)), 0, { bg: PAPER, fg: SEPIA });
  return enterTown(ORIGINS[hero].place);
}
// eight people, eight beginnings. left/right to look, A to be them
async function chooseHero() {
  let i = 0, t = 0; const back = scene;
  scene = { update() { t++; }, draw() {
    blitPaint(TITLEIMG); rectA(0, 0, W, H, PAPER, .45);
    HERO_ORDER.forEach((id, k) => { const x = 22 + k * 39, y = 112, on = k === i, h = HSPR[id]; if (on) shadow(x, y, 14); rsDraw(on ? h.walk[(t >> 3) & 3] : h.idle[0], x, y, false, 0, on ? undefined : .55); });
    const id = HERO_ORDER[i], H2 = HEROES[id], p = PORT[H2.name]; panel(8, 122, W - 16, 96); rectF(16, 132, 50, 50, PAPER2); drawPortrait(p, 17, 133); frameRect(16, 132, 50, 50, SEPIA);
    ink(H2.name, 76, 132, RUST); ink('WEAPON: ' + SKILLS[CHARS[id].t] + (CHARS[id].spells.length ? '   MAGIC: ' + SPELLS[CHARS[id].spells[0]][0] : ''), 76, 144, FADED);
    wrapT(ORIGINS[id].blurb, 38).forEach((l, k) => ink(l, 76, 158 + k * 11));
    ink('ARROWS: LOOK   Z: BEGIN   C: BACK', 16, 204, FADED);
    ctext('WHOSE STORY IS THIS?', 14, SEPIA, 0);
  } };
  await nextFrame();
  for (;;) {
    if (pressed.left) { i = (i + 7) % 8; sfx('move'); } if (pressed.right) { i = (i + 1) % 8; sfx('move'); }
    if (pressed.a || pressed.b) { sfx('ok'); const c = await choose(['BEGIN AS ' + HEROES[HERO_ORDER[i]].name, 'LOOK AGAIN'], { x: 80, y: 60 }); if (c === 0) return HERO_ORDER[i]; }
    if (pressed.c) { scene = back; return null; }
    await nextFrame();
  }
}
