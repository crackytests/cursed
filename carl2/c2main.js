'use strict';
// ================= CARL 2: boot, title, saves, cold open, music =================
const C2META = fetchStore('carl2_meta') || { boots: 0, ends: {} };
const saveC2M = () => store('carl2_meta', C2META);
if (YOKO_TRUE) { PORT['CEO LINDA'] = CAST.full.LINDA; PORT.LINDA = CAST.full.LINDA; PORT['SPOOKY GHOST'] = CAST.full['SPOOKY GHOST']; } // YOKO's true ending colored the old cast
function saveC2() { if (!C2) return; C2.obj = OBJ; C2.x = Math.floor(PL.x / 16); C2.y = Math.floor((PL.y - 8) / 16); C2.dir = PL.dir; store('carl2_save', C2); }

// ---------------- sound: a warmer mix, a guitar, a sax ----------------
FM_TONE = { low: 2.5, high: -2.5, lp: 8000, room: .14, sfxHigh: -3, gain: 1 };
// CARL 2's own sounds: radio static, the arena alarm, and a warehouse's worth of stuff falling over
SFX.static = () => { noise(.5, { bp: 2200, vol: .28, rate: 1.4 }); noise(.35, { hp: 4000, vol: .12, at: AC.currentTime + .1 }); };
SFX.alert = () => [0, .14, .28].forEach(d => note(880, .09, 'brass', AC.currentTime + d, sfxBus));
SFX.crash = () => { noise(.9, { lp: 700, vol: .6, rate: .5 }); for (let i = 0; i < 5; i++) noise(.12, { bp: 500 + Math.random() * 1600, vol: .3, at: AC.currentTime + .08 + i * .09 }); kick(AC.currentTime, sfxBus, .8); };
Object.assign(PATCH, {
  guitar: { ratio: 1, index: 6.5, mdecay: .45, a: .004, d: .22, s: .55, vol: .42 },
  sax: { ratio: 1, index: 2.2, mdecay: .8, a: .04, d: .3, s: .72, vol: .42 },
  surf: { ratio: 1, index: 3.4, mdecay: .07, d: .22, s: .08, vol: .5 },
});
Object.assign(PATCH.bell, { index: 2, mdecay: .05 });
Object.assign(LEGACY_WAVE, { guitar: 'p25', sax: 'p50', surf: 'p12' });
const R2 = (s, n) => Array(n).fill(s).join(' ');
Object.assign(TRACKS, {
  title: { bpm: 138, ch: [
    { ins: 'guitar', det: -8, n: 'E3 E3 . E3 G3 . E3 . A3 . G3 E3 D3 . E3 . E3 E3 . E3 G3 . E3 . B3 . A3 G3 A3 . B3 .' },
    { ins: 'guitar', det: 8, n: 'B3 B3 . B3 D4 . B3 . E4 . D4 B3 A3 . B3 . B3 B3 . B3 D4 . B3 . F#4 . E4 D4 E4 . F#4 .' },
    { ins: 'bass', n: 'E2 . E2 E2 . E2 E2 . E2 . E2 E2 D2 . D2 . E2 . E2 E2 . E2 E2 . G2 . G2 G2 A2 . B2 .' },
    { ins: 'brass', n: 'B4 - - - D5 - E5 - G5 - - - F#5 - E5 - D5 - - - B4 - - - A4 - B4 - D5 - - - E5 - - - - - - - G5 - F#5 - E5 - D5 - E5 - - - - - - - . . . . . . . .' },
    { drum: 1, n: 'k . h . s . h k k . h . s . h h' },
    { drum: 1, vol: .8, n: 'x . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' }] },
  previously: { bpm: 84, ch: [{ ins: 'lead', n: 'E4 - - G4 A4 - - - G4 - E4 - D4 - - - E4 - - G4 A4 - C5 - B4 - - - - - - -' }, { ins: 'bass', n: 'A2 . . . . . . . F2 . . . . . . . G2 . . . . . . . E2 . . . . . . .' }] },
  sting: { bpm: 150, ch: [{ ins: 'sax', n: 'C5 - E5 - G5 - A5 - G5 - E5 - C5 - - - D5 - F5 - A5 - C6 - - - - - - - - - - -' }, { ins: 'organ', n: 'C4 . E4 . G4 . C4 . F4 . A4 . C5 . . . G4 . B4 . D5 . . . . . . . . . .' }, { ins: 'bass', n: 'C2 . C3 . A1 . A2 . F1 . F2 . G1 . G2 . C2 - - - - - - - - - - - - - - -' }, { drum: 1, n: 'k . h . s . h . k . h . s . s s k . . . x . . . . . . . . . . .' }] },
  ship: { bpm: 82, ch: [{ ins: 'epiano', n: 'D4 F4 A4 C5 . . A4 . C4 E4 G4 B4 . . G4 . A#3 D4 F4 A4 . . F4 . C4 E4 G4 . E4 . . .' }, { ins: 'bass', n: 'D2 . . . . . D2 . C2 . . . . . C2 . A#1 . . . . . A#1 . C2 . . . . . C2 .' }, { ins: 'pad', n: 'F4 - - - - - - - E4 - - - - - - - D4 - - - - - - - E4 - - - - - - -' }, { drum: 1, vol: .45, n: 'k . . . s . . k . . k . s . . .' }] },
  lot: { bpm: 104, ch: [
    { ins: 'lead', n: 'G4 - A4 - B4 - D5 - B4 - A4 - G4 - E4 - G4 - A4 - B4 - D5 - E5 - - - D5 - - - C5 - B4 - A4 - - - G4 - A4 - B4 - - - A4 - G4 - E4 - - - - - - -' },
    { ins: 'epiano', n: 'G3 B3 D4 B3 G3 B3 D4 B3 E3 G3 B3 G3 E3 G3 B3 G3 C4 E4 G4 E4 C4 E4 G4 E4 D4 F#4 A4 F#4 D4 F#4 A4 F#4' },
    { ins: 'bass', n: 'G2 . . G2 . . D2 . E2 . . E2 . . B1 . C2 . . C2 . . G2 . D2 . . D2 . . A2 .' },
    { drum: 1, vol: .6, n: 'k . h . s . h . k k h . s . h h' }] },
  mall: { bpm: 108, ch: [{ ins: 'epiano', n: 'E5 - C#5 - A4 - C#5 E5 D5 - B4 - G#4 - B4 D5 C#5 - A4 - E4 - A4 C#5 B4 - G#4 - E4 - - -' }, { ins: 'bass', n: 'A2 . . A2 E2 . . E2 D2 . . D2 E2 . G#2 .' }, { ins: 'organ', det: 5, n: 'C#5 - - - B4 - - - A4 - - - G#4 - - -' }, { drum: 1, vol: .45, n: 'k . h . s . h . k . h . s . h h' }] },
  shop: { bpm: 88, ch: [{ ins: 'organ', n: '. C4 . C4 . C4 . C4 . A#3 . A#3 . A#3 . A#3 . F3 . F3 . F3 . F3 . G3 . G3 . G3 . G3' }, { ins: 'bass', n: 'C2 . . C2 . . E2 . F2 . . F2 . . A2 . F2 . . F2 . . C2 . G2 . . G2 . . B1 .' }, { ins: 'lead', n: 'G4 - - - E4 - F4 - G4 - - - . . . . A4 - - - G4 - F4 - E4 - - - D4 - - -' }, { drum: 1, vol: .5, n: 'k . . . s . . . k . k . s . . .' }] },
  lost: { bpm: 68, ch: [{ ins: 'bell', n: 'A4 . C5 . E5 . C5 . G4 . B4 . D5 . B4 . F4 . A4 . C5 . A4 . E4 . G#4 . B4 . E5 .' }, { ins: 'pad', n: 'A3 - - - - - - - G3 - - - - - - - F3 - - - - - - - E3 - - - - - - -' }, { ins: 'bass', vol: .7, n: 'A1 . . . . . . . G1 . . . . . . . F1 . . . . . . . E1 . . . . . . .' }] },
  committee: { bpm: 96, ch: [{ ins: 'brass', n: 'C4 . C4 . G3 . . . C4 . C4 . A#3 . . . C4 . C4 . G3 . C4 . D#4 . D4 . C4 . . .' }, { ins: 'bass', n: 'C2 . G1 . C2 . G1 . A#1 . F1 . A#1 . F1 . C2 . G1 . C2 . G1 . G1 . G1 . C2 . . .' }, { drum: 1, vol: .6, n: 'k . . . s . . . k . . . s . s .' }] },
  boss: { bpm: 152, ch: [{ ins: 'guitar', det: -6, n: 'E3 E3 G3 E3 A3 E3 A#3 A3 E3 E3 G3 E3 D4 C4 B3 G3' }, { ins: 'slap', n: 'E2 E3 E2 E3 G2 G3 E2 E3 C2 C3 C2 C3 D2 D3 B1 B2' }, { ins: 'brass', n: 'B4 - - G4 - - E4 - F#4 - G4 - A4 - B4 - C5 - - A4 - - E4 - D#4 - E4 - F#4 - - -' }, { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  argue: { bpm: 124, ch: [{ ins: 'slap', n: 'A2 A3 . A2 G3 . A2 . E2 E3 . E2 G2 . A2 . A2 A3 . A2 C4 . A2 . D3 D3 . C3 A2 . G2 .' }, { ins: 'brass', n: 'E5 . E5 . . . C5 D5 . . . . E5 . . . G5 . G5 . . . E5 D5 . C5 . A4 . . . .' }, { ins: 'pluck', n: 'A4 C5 E5 C5 A4 C5 E5 C5 G4 C5 E5 C5 G4 C5 E5 C5' }, { drum: 1, n: 'k . h k s . h . k k h . s . h o' }] },
  special: { bpm: 70, ch: [{ ins: 'epiano', n: 'C4 E4 G4 C5 E5 . . . A3 C4 E4 A4 C5 . . . F3 A3 C4 F4 A4 . . . G3 B3 D4 G4 B4 . D5 .' }, { ins: 'pad', vol: .7, n: 'C4 - - - - - - - A3 - - - - - - - F3 - - - - - - - G3 - - - - - - -' }, { ins: 'bass', vol: .6, n: 'C2 . . . . . . . A1 . . . . . . . F1 . . . . . . . G1 . . . . . . .' }] },
  desert: { bpm: 96, ch: [{ ins: 'surf', n: 'E4 . E4 G4 . A4 . . B4 . A4 G4 E4 . . . D4 . D4 E4 . G4 . . A4 . G4 E4 D4 . . .' }, { ins: 'bass', n: 'E2 . . . B1 . . . E2 . . . B1 . . . D2 . . . A1 . . . D2 . . . A1 . . .' }, { ins: 'pad', vol: .6, n: 'E3 - - - - - - - - - - - - - - - D3 - - - - - - - - - - - - - - -' }, { drum: 1, vol: .5, n: 'k . . h s . . h k . . h s . h h' }] },
  diner: { bpm: 126, ch: [{ ins: 'organ', n: 'C4 E4 G4 A4 G4 E4 C4 E4 A3 C4 E4 F4 E4 C4 A3 C4 F3 A3 C4 D4 C4 A3 F3 A3 G3 B3 D4 F4 D4 B3 G3 B3' }, { ins: 'bass', n: 'C2 . E2 . G2 . A2 . A1 . C2 . E2 . G2 . F1 . A1 . C2 . D2 . G1 . B1 . D2 . F2 .' }, { ins: 'sax', n: 'G5 - - E5 - - C5 - . . . . . . . . A4 - C5 - D5 - E5 - D5 - - - B4 - - -' }, { drum: 1, vol: .6, n: 'k . h . s . h . k . h . s . h h' }] },
  road: { bpm: 146, ch: [
    { ins: 'brass', n: 'A4 - C5 - E5 - D5 C5 - - A4 - G4 - A4 - . . . . . . . . . . . . . . . . F4 - A4 - C5 - B4 A4 - - F4 - E4 - F4 - G4 - B4 - D5 - C5 B4 - - A4 - - - - - - -' },
    { ins: 'slap', n: 'A1 A2 . A1 A2 . A1 A2 A1 A2 . A1 G2 . E2 . F1 F2 . F1 F2 . F1 F2 G1 G2 . G1 B2 . D2 .' },
    { ins: 'epiano', n: 'A3 C4 E4 A4 E4 C4 A3 C4 A3 C4 E4 A4 E4 C4 A3 C4 F3 A3 C4 F4 C4 A3 F3 A3 G3 B3 D4 G4 D4 B3 G3 B3' },
    { drum: 1, n: 'k . h k s . h . k k h . s . h o' }] },
  lake: { bpm: 162, ch: [{ ins: 'surf', det: 6, n: 'E4 E4 E4 E4 G4 G4 G4 G4 A4 A4 A4 A4 G4 G4 E4 E4 D4 D4 D4 D4 E4 E4 G4 G4 A4 A4 B4 B4 A4 A4 G4 G4' }, { ins: 'bass', n: 'E2 . E2 . E2 . E2 . A2 . A2 . A2 . A2 . D2 . D2 . D2 . D2 . E2 . E2 . B1 . B1 .' }, { ins: 'brass', n: 'B4 - - - - - - - C5 - - - B4 - A4 - A4 - - - - - - - B4 - - - - - - -' }, { drum: 1, n: 'k h s h k k s h k h s h k s s h' }] },
  backlot: { bpm: 132, ch: [{ ins: 'sax', n: 'F4 - A4 - C5 - D5 - C5 - A4 - F4 - - - G4 - A#4 - D5 - F5 - E5 - D5 - C5 - - -' }, { ins: 'organ', n: 'F3 A3 C4 A3 F3 A3 C4 A3 G3 A#3 D4 A#3 C3 E3 G3 E3' }, { ins: 'bass', n: 'F2 . A2 . C3 . A2 . G2 . A#2 . C2 . E2 .' }, { drum: 1, vol: .6, n: 'k . h . s . h k k . h . s . h h' }] },
  xover: { bpm: 140, ch: [{ ins: 'lead', n: 'E5 . B4 . G5 . B4 . F#5 . B4 . E5 . D5 . E5 . B4 . G5 . B4 . A5 . G5 . F#5 . D5 .' }, { ins: 'bass', n: 'E2 E2 . E2 . E2 . . C2 C2 . C2 . D2 . .' }, { ins: 'bell', n: 'B5 . . . . . . . G5 . . . . . . . A5 . . . . . . . F#5 . . . . . . .' }, { drum: 1, n: 'k . h k s . h . k . h k s . h h' }] },
  space: { bpm: 152, ch: [{ ins: 'brass', n: 'D5 - - A4 - - D5 - E5 - F5 - E5 - D5 - C5 - - A4 - - C5 - D5 - E5 - D5 - - - F5 - - E5 - - D5 - C5 - A#4 - A4 - G4 - A4 - - - - - - - - - - - - - - -' }, { ins: 'slap', n: 'D2 D3 . D2 . D2 D3 . A#1 A#2 . A#1 . A#1 A#2 . C2 C3 . C2 . C2 C3 . A1 A2 . A1 C2 . E2 .' }, { ins: 'pad', vol: .6, n: 'F4 - - - - - - - D4 - - - - - - - E4 - - - - - - - C#4 - - - - - - -' }, { drum: 1, n: 'k . h . s . h k k . h k s . h o' }] },
  moon: { bpm: 84, ch: [{ ins: 'brass', n: 'D4 - - - D4 - F4 - A4 - - - G4 - F4 - E4 - - - C4 - E4 - G4 - - - F4 - E4 - D4 - - - A3 - D4 - F4 - - - E4 - D4 - C#4 - - - - - - - D4 - - - - - - -' }, { ins: 'bass', n: 'D2 . . . A1 . . . C2 . . . G1 . . . A#1 . . . F1 . . . A1 . . . A1 . . .' }, { drum: 1, vol: .7, n: 'k . . . s . . . k . k . s . . .' }] },
  facility: { bpm: 64, ch: [{ ins: 'pad', n: 'C3 - - - - - - - C#3 - - - - - - -' }, { ins: 'bell', n: 'G5 . . . . . . . . . . . F#5 . . . . . . . . . . . . . . . . . . .' }, { ins: 'bass', vol: .8, n: 'C1 . . . . . . . . . . . . . . . C#1 . . . . . . . . . . . . . . .' }] },
  below: { bpm: 60, ch: [{ ins: 'epiano', n: 'A3 C4 E4 . G3 B3 D4 . F3 A3 C4 . E3 G#3 B3 .' }, { ins: 'pad', vol: .7, n: 'A3 - - - G3 - - - F3 - - - E3 - - -' }, { ins: 'bell', n: 'E5 . . . . . . . D5 . . . . . . . C5 . . . . . . . B4 . . . . . . .' }] },
  human: { bpm: 144, ch: [{ ins: 'guitar', det: -8, n: 'A3 A3 A3 . A3 A3 C4 . A3 A3 A3 . D4 C4 B3 . F3 F3 F3 . F3 F3 A3 . G3 G3 G3 . B3 C4 D4 .' }, { ins: 'brass', n: 'A4 - - - E5 - - - D5 - C5 - B4 - C5 - A4 - - - F5 - - - E5 - D5 - E5 - - -' }, { ins: 'bass', n: 'A1 . A1 . A1 . A1 . A1 . A1 . A1 . A1 . F1 . F1 . F1 . F1 . G1 . G1 . G1 . G1 .' }, { drum: 1, n: 'k k s h k k s h k k s h k s s x' }] },
  boogaloo: { bpm: 112, ch: [
    { ins: 'slap', n: 'E2 . E3 . . E2 G2 . A2 . . A2 G2 . E2 D2 E2 . E3 . . E2 G2 . B2 . A2 . G2 . E2 .' },
    { ins: 'organ', n: '. . E4 . . . E4 . . . D4 . . . D4 . . . E4 . . . E4 . . . G4 . A4 . . .' },
    { ins: 'brass', n: 'B4 . . . D5 . E5 . . . . . D5 . B4 . A4 . . . G4 . A4 . B4 - - - - - - -' },
    { drum: 1, n: 'k . h . s . h k . k h . s . h o' }] },
  credits: { bpm: 112, ch: [{ ins: 'sax', n: 'G4 - B4 - D5 - G5 - F#5 - D5 - B4 - A4 - C5 - E5 - D5 - C5 - B4 - - - A4 - - - G4 - - - - - - - . . . . . . . .' }, { ins: 'epiano', n: 'G3 B3 D4 B3 G3 B3 D4 B3 C4 E4 G4 E4 D4 F#4 A4 F#4' }, { ins: 'bass', n: 'G2 . . G2 . . B1 . C2 . . C2 D2 . . D2' }, { drum: 1, vol: .6, n: 'k . h . s . h . k k h . s . h h' }] },
  canceled: { bpm: 60, ch: [{ ins: 'epiano', n: 'E4 . . . D4 . . . C4 . . . . . . . E4 . . . G4 . . . D4 . . . . . . .' }, { ins: 'pad', vol: .6, n: 'C4 - - - - - - - G3 - - - - - - -' }] },
  walkout: { bpm: 88, ch: [{ ins: 'lead', n: 'D4 - - E4 F#4 - - - A4 - - - G4 - F#4 - E4 - - - - - D4 - E4 - F#4 - - - - - A4 - - B4 C#5 - - - D5 - - - C#5 - B4 - A4 - - - - - - - - - - - - - - -' }, { ins: 'pad', n: 'D4 - - - - - - - B3 - - - - - - - G3 - - - - - - - A3 - - - - - - -' }, { ins: 'bass', n: 'D2 . . . . . . . B1 . . . . . . . G1 . . . . . . . A1 . . . . . . .' }] },
});

// ---------------- boot ----------------
async function boot() {
  C2META.boots++; saveC2M();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0; const pub = PUBLISHER;
  scene = { update() { t++; }, draw() { cls(BLACK); const y = Math.min(96, -20 + t * 2); ctext(pub, y, pub === 'YOKO LTD.' ? hex('#92ffff') : WHITE, BLACK, 3); if (t > 70) ctext('(R)', y + 26, UI.dim); } };
  await wait(60); sfx('ok'); speak(pub === 'YOKO LTD.' ? 'Yoko limited.' : 'Pretend co!', { pitch: pub === 'YOKO LTD.' ? 1.2 : .9 }); await wait(70);
  await fadeOut(.06);
  scene = { draw() { cls(hex('#000010')); ctext('SUPER-16', 60, hex('#6dff24'), BLACK, 2); ctext('THIS CARTRIDGE CONTAINS THE', 100, UI.text); ctext('BONG-FX(TM) CHIP', 112, hex('#ff49db')); ctext('IT DOES NOTHING. IT IS ON THE BOX.', 130, UI.dim); } };
  await fadeIn(.06); await wait(110); await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  const gen = YOKO_TRUE ? ['THE SUPER-16 GENERATION IS OVER.', '', 'NOBODY TOLD CARL.'] : ['THIS GAME WAS RELEASED', 'AFTER THE SUPER-16 GENERATION ENDED.', '', 'IT CAME OUT ANYWAY.'];
  await showCard(gen, 150, { fg: UI.dim });
  run(titleScreen);
}

// ---------------- title ----------------
async function titleScreen() {
  const sv = fetchStore('carl2_save'), renewed = !!C2META.renewed;
  post.legacy = 0; post.wave = 0; post.shake = 0; post.flash = 0; LEGACY_AUDIO = false; WD.hold = 0;
  music(renewed ? 'human' : 'title');
  let t = 0;
  scene = { update() { t++; }, draw() {
    skyD(0, 140, '#240048', '#ff6d24'); rectF(0, 140, W, 84, hex('#100024'));
    for (let i = 0; i < 9; i++) { const x = W / 2 + (i - 4) * 70; lineF(W / 2, 140, x * 3 - W, H, hex('#ff24db')); }
    for (let k = 0; k < 6; k++) { const y = 140 + Math.pow(((k + (t % 30) / 30) / 6), 2) * 84; rectF(0, y | 0, W, 1, hex('#ff24db')); }
    const sx = W / 2 + Math.sin(t * .02) * 20;
    circF(sx, 110, 26, hex('#ffdb24')); for (let y = 100; y < 140; y += 5) rectF(sx - 30, y, 60, 2, hex('#ff6d24'));
    if (renewed) drawScaled(CS.human.d[(t >> 4) & 1], 120, 64, CP.human, 3.2);
    else { rectA(0, 0, W, H, BLACK, 0); drawScaled(CS.human.d[0], 184, 48, [0, ...Array(15).fill(hex('#3a1060'))], 3.6); drawScaled(CS.carl.d[(t >> 5) & 1], 96, 108 + Math.sin(t * .05) * 3, CP.carl, 3); }
    const T1 = renewed ? 'CARL 3' : 'CARL';
    for (let i = 0; i < 3; i++) text(T1, 30 + i, 18 + i, hex(['#101024', '#49496d', '#6d6d92'][i]), 0, 6);
    text(T1, 30, 18, hex('#e8e8ff'), 0, 6); text(T1, 30, 18 - 1, hex('#ffffff'), 0, 6); text(T1, 30, 18 + 2, hex('#b6b6db'), 0, 6); text(T1, 30, 18 + 1, hex('#e8e8ff'), 0, 6);
    if (!renewed) { text('2', 184, 10, hex('#101010'), 0, 8); text('2', 181, 7, hex('#ff2449'), 0, 8); }
    ctext(renewed ? 'HU-MAN 3000' : 'HU-MAN BOOGALOO', 70, hex('#ff49db'), BLACK, 2);
    const fx = (t * 3) % (W + 200) - 100; for (let i = 0; i < 5; i++) circF(fx - i * 18, 26 + i * 8, 6 - i, hex('#ffffdb'));
    if (C2META.ends && C2META.ends.shark !== undefined || C2META.jumped) { const k = (t >> 3) & 1; circF(262, 118, 22, hex(k ? '#ffdb24' : '#ff9224')); text('NOW WITH', 238, 110, hex('#101010'), 0); text('SHARK!', 244, 120, hex('#101010'), 0); }
    if (renewed) { draw(CS.carl.d[0], 8, 190, CP.carlLegacy); text('CLASSIC CARL', 28, 196, hex('#9bbc0f')); }
    if ((t >> 5) & 1) ctext('PUSH START', 180, WHITE);
    ctext('(C)1999 ' + PUBLISHER + '  ' + (renewed ? 'COMING SOON' : 'THE LAST GAME FOR THE SUPER-16'), 208, UI.dim);
  } };
  post.fade = 1; await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE'] : []).concat(['NEW GAME']).concat(C2META.ends && Object.keys(C2META.ends).length ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 116, y: 150, cancel: 1 });
  if (i < 0) return titleScreen();
  if (opts[i] === 'CONTINUE') return continueGame(sv);
  if (opts[i] === 'ENDINGS SEEN') { await showCard(['ENDINGS SEEN', '', ...['renewed', 'canceled', 'boogaloo', 'belowbelow', 'dream'].map(k => (C2META.ends[k] ? '*' : '-') + ' ' + ({ renewed: 'RENEWED', canceled: 'CANCELED', boogaloo: 'BOOGALOO', belowbelow: 'BELOW BELOW', dream: 'IT WAS ALL A DREAM' })[k])], 0); return titleScreen(); }
  if (sv) { const c = await ask('START OVER? YOUR SAVE WILL BE ERASED. (THE COMMITTEE KEEPS A COPY.)', null, ['NO', 'YES']); if (c !== 1) return titleScreen(); }
  await newGame2();
}
async function continueGame(sv) {
  await fadeOut(.06);
  C2 = Object.assign(newC2(), sv); OBJ = C2.obj || null; DBG.obj = OBJ; resetPL();
  scene = worldScene; loadMap(C2.map, C2.x, C2.y, C2.dir || 'd');
  await fadeIn(.06);
  if (MAPS2[C2.map].enter) wstory(MAPS2[C2.map].enter);
}
async function newGame2() {
  await fadeOut(.06);
  C2 = newC2(); C2.human = 10; C2.humanMax = 10; OBJ = null; resetPL(); try { localStorage.removeItem('carl2_save'); } catch (e) {}
  await coldOpen();
  C2.ep = 1;
  await epCard(1, 'PILOT', 'Make him more relatable.');
  scene = worldScene; loadMap('ship', 7, 6, 'd'); post.fade = 1; await fadeIn(.05);
  wstory(ep1Intro);
}
async function ep1Intro() {
  await wait(30);
  await C('...', 'w');
  await C('Why am I a different color.', 'w');
  await C('Chat. Chat, is this a filter? Did somebody put a filter on me? I was green. I\'m still green. I\'m a LOUDER green.', 'w');
  laugh();
  await C('Okay. It\'s fine. It\'s fine. Hands: normal. Hat: normal. Everything is 512 colors. That\'s normal.', 'n');
  sfx('static'); await wait(20);
  await C('...The radio. Somebody\'s on the radio.', 'w');
  setObj('Answer the radio (DISPATCH)', 'ship', 8, 4);
}

// ---------------- the cold open: PREVIOUSLY ON CARL ----------------
async function coldOpen() {
  const beat = !!(OTHER.carl && OTHER.carl.endings), secret = !!(OTHER.carl && OTHER.carl.secret);
  LEGACY_AUDIO = true; post.legacy = 1; music('previously');
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#101818')); for (let i = 0; i < 50; i++) pset((i * 67 + (t >> 3)) % W, (i * 31) % 90, hex('#8bac0f'));
    rectF(0, 150, W, 74, hex('#306230')); draw(CS.ass[0], 60, 110, CP.ass); drawScaled(LEGACY.carl, 150, 130, LEGPAL, 2);
    if (t > 30) ctext('PREVIOUSLY ON CARL', 20, hex('#9bbc0f'), BLACK, 2);
  } };
  post.fade = 1; await fadeIn(.05); await wait(60);
  if (beat) {
    await say('...[[[[[... can you hear us...? we\'re... still...', 'VOICE', { slow: 1 });
    await say('Hold on. Be quiet a second.', 'CARL');
    await say('They could be out there somewhere, right? ...Right?', 'CARL');
    await say('It says... below.', 'CARL'); await say('Below below.', 'CARL');
  } else {
    await say('A LITTLE GREEN GUY. A MALL. A BOX. A GHOST. A VOICE ON THE RADIO THAT SAID "BELOW."');
    await say('(YOU DID NOT PLAY THE FIRST ONE. THAT\'S FINE. NOBODY DID. IT WAS NEVER SOLD.)');
    await say('...[[[[[... can you hear us...?', 'VOICE', { slow: 1 });
  }
  await fadeOut(.05); scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard([secret ? 'TO BE CONTINUED?' : 'TO BE CONTINUED.'], 110, { fg: hex('#9bbc0f') });
  await showCard([secret ? 'CONTINUED.' : 'CONTINUED ANYWAY.'], 90, { fg: hex('#9bbc0f') });
  // the sequel slams in: color, noise, a chin
  post.legacy = 0; LEGACY_AUDIO = false; music('title'); sfx('power');
  let k = 0;
  scene = { update() { k++; }, draw() {
    skyD(0, H, '#ff24db', '#240048'); const s = Math.max(1, 12 - k * .35) | 0;
    for (let i = 0; i < 16; i++) lineF(W / 2, H / 2, W / 2 + Math.cos(i * .39 + k * .02) * 400, H / 2 + Math.sin(i * .39 + k * .02) * 400, hex(i & 1 ? '#ffdb24' : '#ff6d24'));
    text('CARL', W / 2 - 12 * s, H / 2 - 22 - 4 * s, hex('#e8e8ff'), BLACK, s);
    if (k > 30) { text('2', W / 2 + 12 * s + 4, H / 2 - 30 - 4 * s, hex('#ff2449'), BLACK, s + 2); }
    if (k > 50) ctext('HU-MAN BOOGALOO', H / 2 + 34, hex('#ffffff'), BLACK, 2);
    if (k > 70) ctext('NOW IN 512 COLORS', H / 2 + 60, hex('#6dff24'));
  } };
  for (let i = 0; i < 20; i++) { post.flash = 1 - i / 20; await nextFrame(); } post.flash = 0;
  await wait(40); speak('Carl two! Hu-man boogaloo!', { pitch: .5, rate: .9 });
  await wait(130);
  await fadeOut(.05);
}
