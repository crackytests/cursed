'use strict';
// ================= FACE: BEFORE THE STREAM. boot, title, music, saves, ending =================
const OMETA = fetchStore('orig_meta') || { boots: 0, ends: {} };
const saveOM = () => store('orig_meta', OMETA);
Object.assign(UI, { box: hex('#000000'), box2: hex('#00496d'), edge: hex('#ffffff'), text: hex('#ffffff'), dim: hex('#00dbdb'), name: hex('#ffdb49') });
Object.assign(VOICE, { GHOST: [300, 80], LINDA: [700, 20], NEIGHBOR: [520, 40], FACE: [380, 30], MAGICIAN: [250, 60], MIMI: [900, 20], YOKO: [700, 0], MEMORY: [520, 0], 'THE CURSE': [140, 90], _: [600, 0] });
for (const k of ['FACE', 'MAGICIAN', 'MIMI', 'YOKO', 'MEMORY', 'GHOST', 'LINDA']) PORT[k] = mkPort(k);

Object.assign(TRACKS, {
  apt: { bpm: 108, ch: [
    { ins: 'bell', vol: .7, n: 'E5 . G5 . C6 . G5 . E5 . G5 . A5 . G5 . F5 . A5 . C6 . A5 . D5 . F5 . G5 . F#5 .' },
    { ins: 'bass', vol: .6, n: 'C3 . C3 . C3 . C3 . C3 . C3 . C3 . C3 . F3 . F3 . F3 . F3 . G3 . G3 . G3 . G3 .' },
    { ins: 'pad', vol: .5, n: 'C4 - - - - - - - C4 - - - - - - - F4 - - - - - - - G4 - - - - - - -' }] },
  hall: { bpm: 70, ch: [
    { ins: 'bell', vol: .6, n: 'A4 . . . . . . . . . . . E4 . . . A4 . . . . . . . . . . . C5 . . .' },
    { ins: 'pad', vol: .6, n: 'D3 - - - - - - - - - - - - - - - D3 - - - - - - - - - - - - - - -' }] },
  shop: { bpm: 84, ch: [
    { ins: 'bass', vol: .7, n: 'D2 . . . D2 . . . D2 . . . D2 . . . D2 . . . D2 . . . F2 . . . A2 . . .' },
    { ins: 'bell', vol: .45, n: 'D5 . . . . . . . A4 . . . . . . . D5 . . . . . F5 . . . E5 . . . . .' },
    { ins: 'organ', vol: .25, n: 'D3 - - - - - - - - - - - - - - - F3 - - - - - - - - - - - - - - -' }] },
  dream: { bpm: 72, ch: [
    { ins: 'bell', vol: .6, n: 'E5 . . . G5 . . . C6 . . . G5 . . . F5 . . . A5 . . . C6 . . . A5 . . .' },
    { ins: 'pad', vol: .6, n: 'C4 - - - - - - - - - - - - - - - F4 - - - - - - - - - - - - - - -' },
    { ins: 'bass', vol: .4, n: 'C2 . . . . . . . . . . . . . . . F2 . . . . . . . . . . . . . . .' }] },
  air: { bpm: 120, ch: [
    { ins: 'pluck', vol: .6, n: 'C5 . E5 . G5 . E5 . C5 . E5 . A5 . G5 . F5 . A5 . C6 . A5 . F5 . A5 . G5 . E5 .' },
    { ins: 'bass', vol: .6, n: 'C3 . . . C3 . . . C3 . . . C3 . . . F3 . . . F3 . . . G3 . . . G3 . . .' }] },
  otitle: { bpm: 90, ch: [
    { ins: 'pluck', vol: .6, n: 'C4 E4 G4 C5 G4 E4 G4 C5 A3 C4 E4 A4 E4 C4 E4 A4 F3 A3 C4 F4 C4 A3 C4 F4 G3 B3 D4 G4 D4 B3 D4 G4' },
    { ins: 'pad', vol: .4, n: 'C3 - - - - - - - A2 - - - - - - - F2 - - - - - - - G2 - - - - - - -' }] },
});

async function boot() {
  OMETA.boots++; saveOM();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  const lines = ['PRETEND CO. HOME-8 BASIC V1.1', '64K RAM SYSTEM  38911 BASIC BYTES FREE', '', 'READY.', 'LOAD "FACE"', '', 'SEARCHING FOR FACE', 'LOADING', '', 'READY.', 'RUN'];
  let shown = 0, tc = 0; const amber = hex('#ffdb49');
  scene = { update() { tc++; }, draw() {
    cls(BLACK); let n = shown;
    lines.forEach((l, i) => { text(l.slice(0, Math.max(0, n)), 14, 18 + i * 12, amber, null); n -= l.length; });
    if ((tc >> 4) & 1) rectF(14 + (lines[Math.min(lines.length - 1, 10)].length) * 6, 18 + Math.min(lines.length - 1, 10) * 12, 5, 7, amber);
  } };
  for (let i = 0; i < lines.length; i++) {
    for (let c = 0; c <= lines[i].length; c++) { shown++; if (c % 3 === 0) sfx('tick'); await wait(2); }
    if (lines[i].startsWith('LOADING')) for (let k = 0; k < 14; k++) { tone(900 + rnd(1300), .08, { vol: .14, delay: k * .06 }); await wait(5); }
    await wait(lines[i] === 'READY.' ? 26 : 10);
  }
  await wait(30); await fadeOut(.1);
  run(titleO);
}
async function titleO() {
  const sv = fetchStore(OSAVE);
  post.fade = 1; post.shake = 0; post.flash = 0; DLG = null; MENUS.length = 0; CARD = null; music('otitle');
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(BLACK);
    for (let i = 0; i < 30; i++) pset((i * 53 + (t >> 1)) % W, (i * 31) % 60 + 4, hex('#006d6d'));
    ctext('FACE', 40, hex('#00dbdb'), hex('#db49db'), 7);
    ctext('BEFORE THE STREAM', 110, WHITE, hex('#db49db'), 2);
    ctext(((t >> 5) & 1) ? 'PRESS START_' : 'PRESS START', 156, hex('#ffdb49'));
    ctext('(C) 1983 PRETEND CO.  HOME-8', 200, hex('#00dbdb'));
    ctext('NOT FOR RELEASE', 212, hex('#6d4900'));
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE', 'NEW GAME'] : ['NEW GAME']).concat(OMETA.ends.act1 ? ['ACT II'] : [], OMETA.ends.act2 ? ['ACT III'] : []);
  const i = await choose(opts, { x: 116, y: 168, cancel: 1 });
  if (i < 0) return titleO();
  await fadeOut(.06);
  if (opts[i] === 'ACT II') { act2Seed(); await startAct2(); }
  else if (opts[i] === 'ACT III') { act3Seed(); await startAct3(); }
  else if (opts[i] === 'CONTINUE') {
    Object.assign(OS, sv); music(OS.room);
    await goRoom(OS.room, { quiet: true });
  } else {
    Object.assign(OS, { room: 'apt', flags: {}, inv: [], t: 0, honest: 0, lies: 0, rapport: 0, noticed: 0, orderT: 0, tries: 0, circle: ['EARTH', 'BRIDGE', 'SALT', 'SEAL'] });
    await showCard(['THE FUTURE LOVES YOU', 'VERY MUCH.', '', 'THAT IS THE PROBLEM.'], 190, { fg: hex('#00dbdb') });
    await goRoom('apt');
  }
  await roomLoop();
}
async function finishAct1() {
  OMETA.ends.act1 = 1; OMETA.honest = OS.honest; OMETA.rapport = OS.rapport; OMETA.noticed = OS.noticed; saveOM();
  await fadeOut(.06); music(null);
  await showCard(['END OF ACT I', '', 'THE HOUSE THAT CARES'], 170, { fg: hex('#24db49') });
  await startAct2();
}

// if a story chain throws, the player must not be left on a black screen: log it and go back to the title
let rescues = 0;
function run(fn) {
  busy++;
  return Promise.resolve().then(fn).catch(e => {
    console.error(e);
    if (rescues++ < 3 && fn !== titleO) { post.fade = 0; post.flash = 0; post.shake = 0; DLG = null; CARD = null; MENUS.length = 0; run(titleO); }
  }).finally(() => busy--);
}
