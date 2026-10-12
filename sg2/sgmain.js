'use strict';
// ================= SPOOKY GHOST 2: boot, title, saves, "previously", music =================
const GMETA = fetchStore('sg2_meta') || { boots: 0, ends: {} };
const saveGMeta = () => store('sg2_meta', GMETA);
const OTHER = { ghost: fetchStore('ghost_meta'), carl: fetchStore('carl_meta'), carl2: fetchStore('carl2_meta'), linda: fetchStore('linda_meta'), yoko: fetchStore('yoko_meta') };
const YOKO_DONE = !!(OTHER.yoko && OTHER.yoko.ends && OTHER.yoko.ends.true);
// the sequel is in color: everybody gets their full-color portrait
Object.assign(PORT, { 'SPOOKY GHOST': CAST.full['SPOOKY GHOST'], 'CEO LINDA': CAST.full.LINDA, LINDA: CAST.full.LINDA, CARL: CAST.full.CARL });
for (const k in SGPORT) PORT[k] = SGPORT[k];
PORT['NEW FACE'] = PORT.FACE; PORT.DIRECTOR = PORT.FACE;
// the four dancers are Lindas: Linda's voice, give or take a reality
Object.assign(VOICE, { 'SPOOKY GHOST': [1250, 350], 'CEO LINDA': [780, 40], PATTY: [800, 40], CHOREOGRAPHER: [760, 40], 'CALL-IN HOST': [790, 40], 'JUDGE': [770, 40], MAGICIAN: [640, 60], COLLECTOR: [260, 10], PROMOTER: [560, 80], 'NETWORK FAX': [640, 0], DIRECTOR: [450, 40], 'NEW FACE': [450, 40], ANNOUNCER: [440, 20] });

// ---------------- sound: warm, a little loud ----------------
FM_TONE = { low: .6, high: -4, lp: 6500, room: .16, sfxHigh: -3, gain: .9 };
Object.assign(PATCH, {
  guitar: { ratio: 1, index: 3.6, mdecay: .35, a: .006, d: .22, s: .5, vol: .38 },
  sax: { ratio: 1, index: 2.2, mdecay: .8, a: .04, d: .3, s: .72, vol: .42 },
  synth: { ratio: 2, index: 1.6, mdecay: .5, a: .01, d: .25, s: .6, vol: .4 },
});
Object.assign(LEGACY_WAVE, { guitar: 'p25', sax: 'p50', synth: 'p25' });
SFX.static = () => { noise(.5, { bp: 2200, vol: .28, rate: 1.4 }); noise(.35, { hp: 4000, vol: .12, at: AC.currentTime + .1 }); };
SFX.alert = () => [0, .14, .28].forEach(d => note(880, .09, 'brass', AC.currentTime + d, sfxBus));
SFX.scream = () => { tone(900, .45, { type: 'square', slide: 2.4, vol: .3 }); noise(.3, { hp: 3000, vol: .22 }); };
SFX.phase = () => { tone(300, .25, { type: 'sine', slide: 3, vol: .4 }); noise(.2, { lp: 1200, vol: .2 }); };
SFX.caught = () => { [440, 349, 262].forEach((f, i) => note(f, .16, 'brass', AC.currentTime + i * .12, sfxBus)); };
SFX.ring = () => [0, .18, .5, .68].forEach(d => note(1400, .12, 'bell', AC.currentTime + d, sfxBus));
SFX.ding = () => note(1320, .5, 'bell', AC.currentTime, sfxBus);
const R16 = (s, n) => Array(n).fill(s).join(' ');
Object.assign(TRACKS, {
  previously: { bpm: 84, ch: [{ ins: 'lead', n: 'E4 - - G4 A4 - - - G4 - E4 - D4 - - - E4 - - G4 A4 - C5 - B4 - - - - - - -' }, { ins: 'bass', n: 'A2 . . . . . . . F2 . . . . . . . G2 . . . . . . . E2 . . . . . . .' }] },
  green: { bpm: 108, ch: [
    { ins: 'sax', n: 'D5 - - F5 - A5 - - G5 - F5 - D5 - - - C5 - - E5 - G5 - - F5 - E5 - C5 - - -' },
    { ins: 'organ', vol: .6, n: 'D4 - - - F4 - - - A3 - - - C4 - - - A#3 - - - D4 - - - C4 - - - E4 - - -' },
    { ins: 'slap', n: 'D2 . . D2 . . D3 . A1 . . A1 . . A2 . A#1 . . A#1 . . A#2 . C2 . . C2 . . C3 .' },
    { drum: 1, vol: .6, n: 'k . . h s . h . k . h . s . h h' }] },
  drive: { bpm: 92, ch: [
    { ins: 'guitar', n: 'A3 - - C4 - - E4 - - D4 - - C4 - - - G3 - - B3 - - D4 - - C4 - - B3 - - -' },
    { ins: 'pad', vol: .7, n: 'A3 - - - - - - - - - - - - - - - G3 - - - - - - - - - - - - - - -' },
    { ins: 'bass', vol: .8, n: 'A1 . . . . . A1 . . . G1 . . . . . G1 . . . . . G1 . . . E1 . . . . .' },
    { drum: 1, vol: .5, n: 'k . . . . . h . s . . . . . h .' }] },
  dept: { bpm: 84, ch: [
    { ins: 'epiano', n: 'F4 A4 C5 A4 F4 A4 C5 A4 E4 G4 B4 G4 E4 G4 B4 G4 D4 F4 A4 F4 D4 F4 A4 F4 C4 E4 G4 E4 C4 E4 G4 E4' },
    { ins: 'pad', vol: .7, n: 'F3 - - - - - - - E3 - - - - - - - D3 - - - - - - - C3 - - - - - - -' },
    { ins: 'bass', vol: .7, n: 'F1 . . . . . . . E1 . . . . . . . D1 . . . . . . . C1 . . . . . . .' }] },
  mail: { bpm: 76, ch: [{ ins: 'epiano', n: 'C4 E4 G4 C5 . . G4 . A3 C4 E4 A4 . . E4 . F3 A3 C4 F4 . . C4 . G3 B3 D4 G4 . . D4 .' }, { ins: 'pad', vol: .6, n: 'C4 - - - - - - - A3 - - - - - - - F3 - - - - - - - G3 - - - - - - -' }] },
  sad: { bpm: 66, ch: [{ ins: 'epiano', n: 'A3 C4 E4 . G3 B3 D4 . F3 A3 C4 . E3 G#3 B3 .' }, { ins: 'pad', vol: .7, n: 'A3 - - - G3 - - - F3 - - - E3 - - -' }, { ins: 'bell', n: 'E5 . . . . . . . D5 . . . . . . . C5 . . . . . . . B4 . . . . . . .' }] },
  soft: { bpm: 72, ch: [{ ins: 'epiano', n: 'F3 A3 C4 F4 . . C4 . E3 G3 B3 E4 . . B3 . D3 F3 A3 D4 . . A3 . C3 E3 G3 C4 . . G3 .' }, { ins: 'pad', vol: .6, n: 'F3 - - - - - - - E3 - - - - - - - D3 - - - - - - - C3 - - - - - - -' }] },
});

// ---------------- boot ----------------
async function boot() {
  GMETA.boots++; saveGMeta();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0;
  scene = { update() { t++; }, draw() { cls(BLACK); const y = Math.min(96, -20 + t * 2); ctext('PRETEND CO.', y, WHITE, BLACK, 3); if (t > 70) ctext('(R)', y + 26, UI.dim); } };
  await wait(60); sfx('ok'); speak('Pretend co!', { pitch: .9 }); await wait(70);
  await fadeOut(.06);
  scene = { draw() { cls(hex('#000012')); ctext('SUPER-16', 60, hex('#6dff24'), BLACK, 2); ctext('THIS CARTRIDGE CONTAINS THE', 100, UI.text); ctext('ECTO-FX(TM) CHIP', 112, hex('#ff49db')); ctext('IT DOES SOMETHING.', 130, UI.dim); ctext('NOBODY WILL SAY WHAT.', 142, UI.dim); } };
  await fadeIn(.06); await wait(120); await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(YOKO_DONE ? ['THE SUPER-16 GENERATION IS OVER.', '', 'THIS SEQUEL DIDN\'T GET THE MEMO.'] : ['THIS SEQUEL WAS REQUESTED', 'BY NO ONE.', '', 'HE SAID YES ANYWAY.'], 160, { fg: UI.dim });
  run(titleScreen);
}

// ---------------- title ----------------
async function titleScreen() {
  const sv = fetchStore('sg2_save'), done = Object.keys(GMETA.ends).length > 0;
  post.legacy = 0; post.wave = 0; post.shake = 0; post.flash = 0; post.fade = 1; WD.hold = 0; DLG = null; MENUS.length = 0; CARD = null;
  music('title');
  let t = 0;
  scene = { update() { t++; }, draw() {
    skyD(0, 150, '#240048', '#ff24a0');
    const sx = W / 2 + Math.sin(t * .015) * 14; circF(sx, 112, 30, hex('#ffdb24')); for (let y = 90; y < 146; y += 5) rectF(sx - 34, y, 68, 1 + ((y - 90) >> 4), hex('#ff24a0'));
    rectF(0, 146, W, 78, hex('#100024'));
    for (let i = -8; i <= 8; i++) lineF(W / 2, 146, W / 2 + i * 70, H, hex('#24dbff')); for (let k = 0; k < 7; k++) { const y = 146 + Math.pow((k + (t % 30) / 30) / 7, 2) * 78; rectF(0, y | 0, W, 1, hex('#24dbff')); }
    for (let i = 0; i < 60; i++) pset((i * 53 + (t >> 2) * (1 + i % 3)) % W, (i * 29) % 90, i % 7 ? hex('#9292db') : WHITE);
    drawScaled(SG.ghost.d[(t >> 4) % 3], 252, 92 + Math.sin(t * .05) * 4, SGP.ghost, 2.6);
    for (let i = 0; i < 3; i++) text('SPOOKY', 14 + i, 18 + i, hex(['#240049', '#6d24b6', '#b66ddb'][i]), 0, 5);
    text('SPOOKY', 14, 18, hex('#ffffff'), 0, 5); text('SPOOKY', 14, 20, hex('#ff49db'), 0, 5); text('SPOOKY', 14, 17, hex('#ffffff'), 0, 5);
    for (let i = 0; i < 3; i++) text('GHOST', 14 + i, 56 + i, hex(['#240049', '#6d24b6', '#b66ddb'][i]), 0, 5);
    text('GHOST', 14, 56, hex('#ffffff'), 0, 5); text('GHOST', 14, 58, hex('#24dbff'), 0, 5); text('GHOST', 14, 55, hex('#ffffff'), 0, 5);
    text('2', 192, 20, hex('#240024'), 0, 9); text('2', 188, 16, hex('#ff2449'), 0, 9);
    ctext('ANOTHER BOOGALOO', 100, hex('#ffff49'), hex('#ff24db'), 2);
    if ((t >> 5) & 1) ctext('PUSH START', 188, WHITE);
    ctext('(C)2001 PRETEND CO.  NOW IN COLOR', 208, UI.dim);
    if (done) ctext('* THE SHOW GOES ON *', 170, hex('#ff49db'));
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE'] : []).concat(['NEW SHOW']).concat(done ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 116, y: 138, cancel: 1 });
  if (i < 0) return titleScreen();
  if (opts[i] === 'CONTINUE') return continueGame(sv);
  if (opts[i] === 'ENDINGS SEEN') {
    const names = { stayed: 'STAYED FOR THE SONG', encore: 'ENCORE (EXIT, STAGE LEFT)', canceled: 'CANCELED', clip: 'THE CLIP SHOW' };
    await showCard(['ENDINGS SEEN', '', ...Object.keys(names).map(k => (GMETA.ends[k] ? '* ' : '- ') + names[k])], 0);
    return titleScreen();
  }
  if (sv) { const c = await ask('CANCEL THE SHOW AND START OVER?', null, ['NO', 'YES']); if (c !== 1) return titleScreen(); }
  await fadeOut(.06);
  gnewGame();
}
async function continueGame(sv) {
  await fadeOut(.06); S = sv; music(null);
  scene = worldScene; loadMap(S.map, S.x, S.y, S.dir || 'd'); WD.hold = 0;
  await fadeIn(.08); banner(WD.M.title, 100);
}
// ---------------- previously, on spooky ghost ----------------
async function previously() {
  const T = TONES.red.map(hex), card = (lines, t = 120) => showCard(lines, t, { bg: T[3], fg: T[0] });
  music('previously'); post.fade = 0;
  await card(['PREVIOUSLY, ON', 'SPOOKY GHOST:'], 110);
  await card(['A GHOST HOSTED A SHOW.', 'IT WAS LIVE.'], 100);
  await card(['HE FELL IN LOVE.', 'IN EVERY REALITY.', 'WITH THE SAME WOMAN.'], 120);
  await card(['HE TURNED OFF HIS FRIEND', 'TO HIDE FROM A PHONE CALL.', 'HE SAT IN HIS CHAIR.'], 130);
  await card(['CARL CAME.', '(LATE.)'], 90);
  await card(['HE HAD A SPEECH PREPARED.'], 100);
  await card(['THEY OFFERED HIM', 'A SEQUEL.'], 100);
  music(null); scene = { draw() { cls(BLACK); } }; await wait(30);
  // the slam
  let t = 0; music('show');
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#000024', '#ff24a0'); for (let i = 0; i < 8; i++) triF(W / 2, 112, W / 2 + Math.cos(i * .785 + t * .02) * 400, 112 + Math.sin(i * .785 + t * .02) * 400, W / 2 + Math.cos(i * .785 + .3 + t * .02) * 400, 112 + Math.sin(i * .785 + .3 + t * .02) * 400, hex(i & 1 ? '#6d24b6' : '#24006d'));
    const k = Math.min(1, t / 25), y1 = -60 + (84 + 60) * k, y2 = 260 - (260 - 94) * k;
    ctext('SPOOKY GHOST', y1 | 0, hex('#240049'), 0, 4); ctext('SPOOKY GHOST', (y1 | 0) - 3, hex('#ffffff'), hex('#ff24db'), 4);
    ctext('2', (y2 | 0) + 20, hex('#ff2449'), hex('#490024'), 8); if (t > 40) ctext('ANOTHER BOOGALOO', 190, hex('#ffff49'), hex('#ff24db'), 2);
    if (t > 40 && t < 50) rectA(0, 0, W, H, WHITE, (50 - t) / 10);
  } };
  post.flash = 0; await wait(25); sfx('power'); post.flash = 1; await wait(8); post.flash = 0; await wait(150);
  await fadeOut(.05);
}
