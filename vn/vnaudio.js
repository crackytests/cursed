'use strict';
// ================= VISITOR: THE NORMALCY: sound effects and the OPM soundtrack =================
FM_TONE = { low: 2, high: -2, room: .18, gain: 1 };
const nt = (f, d, p, dt = 0, vm = 1) => { if (AC) note(f, d, p, AC.currentTime + dt, sfxBus, 0, vm); };
Object.assign(SFX, {
  shot: () => { noise(.12, { lp: 3000, vol: .55 }); tone(160, .1, { slide: .4, vol: .35, type: 'square' }); },
  shot2: () => { noise(.09, { lp: 2200, vol: .35 }); tone(130, .08, { slide: .4, vol: .2, type: 'square' }); },
  silshot: () => { noise(.06, { bp: 1200, vol: .25 }); tone(300, .04, { slide: .5, vol: .12, type: 'triangle' }); },
  shotgun: () => { noise(.25, { lp: 1800, vol: .7 }); tone(90, .2, { slide: .4, vol: .4, type: 'square' }); },
  boomshot: () => { noise(.3, { lp: 900, vol: .5 }); tone(200, .3, { slide: .2, vol: .3, type: 'sawtooth' }); },
  boom: () => { noise(.9, { lp: 500, vol: .9, rate: .5 }); tone(70, .6, { slide: .3, vol: .6, type: 'sine' }); },
  smoke: () => noise(.2, { bp: 600, vol: .2, rate: .6 }),
  swing: () => noise(.08, { hp: 2500, vol: .25, rate: 1.6 }),
  hit: () => { noise(.06, { lp: 1500, vol: .45 }); tone(120, .08, { slide: .5, vol: .3, type: 'square' }); },
  thud: () => { noise(.15, { lp: 400, vol: .6 }); tone(60, .15, { slide: .5, vol: .4, type: 'sine' }); },
  die: () => { tone(300, .4, { slide: .3, vol: .3, type: 'sawtooth' }); noise(.2, { lp: 800, vol: .3 }); },
  crash: () => { noise(.35, { bp: 1500, vol: .5 }); noise(.2, { lp: 400, vol: .4 }); },
  glass: () => { for (let i = 0; i < 6; i++) tone(2500 + Math.random() * 2500, .08, { vol: .12, delay: i * .025, type: 'triangle' }); noise(.25, { hp: 4000, vol: .3 }); },
  gas: () => noise(1.2, { bp: 800, vol: .3, rate: .4 }),
  emp: () => { tone(1800, .5, { slide: .05, vol: .3, type: 'sawtooth' }); noise(.4, { hp: 3000, vol: .3 }); },
  zap: () => { tone(1400, .15, { slide: .3, vol: .25, type: 'sawtooth' }); noise(.1, { hp: 3000, vol: .2 }); },
  throw: () => noise(.15, { hp: 1500, vol: .2, rate: 1.4 }),
  bump: () => noise(.05, { lp: 600, vol: .3 }),
  pickup: () => { nt(660, .05, 'pluck'); nt(990, .08, 'pluck', .05); },
  drop: () => noise(.08, { lp: 700, vol: .3 }),
  heal: () => [523, 659, 784].forEach((f, i) => nt(f, .15, 'bell', i * .06)),
  eat: () => { noise(.06, { bp: 2000, vol: .2 }); noise(.06, { bp: 1500, vol: .2, at: AC.currentTime + .1 }); },
  locked: () => { tone(180, .08, { vol: .3, type: 'square' }); tone(140, .12, { vol: .3, type: 'square', delay: .08 }); },
  unlock: () => { nt(880, .05, 'pluck'); nt(1320, .1, 'pluck', .06); noise(.05, { hp: 3000, vol: .2 }); },
  pick: () => { noise(.03, { hp: 5000, vol: .3 }); tone(2400, .02, { vol: .1, type: 'square' }); },
  beep: () => tone(1800, .04, { vol: .15, type: 'square' }),
  alarm: () => { for (let i = 0; i < 4; i++) tone(i & 1 ? 700 : 950, .12, { vol: .22, type: 'square', delay: i * .13 }); },
  menu: () => { nt(1200, .04, 'pluck'); nt(1600, .05, 'pluck', .04); },
  read: () => noise(.08, { hp: 3000, vol: .1, rate: .8 }),
  note: () => { nt(880, .08, 'bell'); nt(1320, .12, 'bell', .08); },
  goal: () => { [392, 523, 659, 784].forEach((f, i) => nt(f, .2, 'brass', i * .08, .8)); },
  boot: () => { tone(60, .3, { vol: .2, type: 'sawtooth', slide: 3 }); for (let i = 0; i < 5; i++) tone(1000 + i * 300, .03, { vol: .08, delay: .2 + i * .04, type: 'square' }); },
  hack: () => { for (let i = 0; i < 12; i++) tone(400 + Math.random() * 2400, .03, { vol: .1, delay: i * .04, type: 'square' }); },
  infolink: () => { nt(1568, .05, 'bell', 0, .7); nt(2093, .08, 'bell', .06, .7); noise(.08, { hp: 6000, vol: .08, at: AC.currentTime + .14 }); },
  vend: () => { noise(.2, { lp: 600, vol: .4 }); nt(1046, .06, 'pluck', .2); },
  save: () => [784, 1046, 1318].forEach((f, i) => nt(f, .1, 'bell', i * .05)),
  disk: () => { for (let i = 0; i < 6; i++) noise(.05, { bp: 400 + i * 80, vol: .25, at: AC.currentTime + i * .09 }); },
  push: () => noise(.3, { lp: 300, vol: .4, rate: .5 }),
});
// ---------- the soundtrack ----------
// 64-step patterns. 'A3' = note, '-' = hold, '.' = rest. Drums: k kick, s snare, h hat, o open hat.
const rep = (s, n) => Array(n).fill(s).join(' ');
const bar = (...a) => a.join(' ');
Object.assign(TRACKS, {
  title: { bpm: 104, ch: [
    { ins: 'brass', vol: .5, n: bar('D4 - - - - - F4 - E4 - D4 - A3 - - -', 'C4 - - - D4 - E4 - F4 - E4 - D4 - C4 -', 'D4 - - - F4 - G4 - A4 - - - C5 - A4 -', 'G4 - - - F4 - E4 - D4 - - - - - - -') },
    { ins: 'bass', vol: .85, n: bar('D2 . . D2 . . D2 . D2 . . D2 . . C2 .', 'A#1 . . A#1 . . A#1 . A#1 . . A#1 . . C2 .', 'D2 . . D2 . . D2 . F2 . . F2 . . E2 .', 'C2 . . C2 . . A1 . D2 . . D2 . . . .') },
    { ins: 'pad', vol: .5, n: bar('D3 - - - - - - - - - - - - - - -', 'A#2 - - - - - - - - - - - - - - -', 'F3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - A2 - - - - - - -') },
    { ins: 'pluck', vol: .3, n: rep('D5 . A4 . F4 . A4 .', 2) + ' ' + rep('D5 . A4 . F4 . A4 .', 2) + ' ' + rep('F5 . C5 . A4 . C5 .', 2) + ' ' + rep('E5 . C5 . G4 . C5 .', 2) },
    { drum: 1, vol: .5, n: rep('k . h . s . h k . k h . s . h .', 4) }] },
  mall: { bpm: 92, ch: [
    { ins: 'pad', vol: .55, n: bar('A3 - - - - - - - - - - - - - - -', 'F3 - - - - - - - - - - - - - - -', 'C4 - - - - - - - - - - - - - - -', 'G3 - - - - - - - E3 - - - - - - -') },
    { ins: 'bell', vol: .38, n: bar('E5 . . . A5 . . . C6 . . . B5 . A5 .', 'F5 . . . A5 . . . C6 . . . A5 . . .', 'G5 . . . C6 . . . E6 . . . D6 . C6 .', 'B5 . . . G5 . . . E5 . . . . . . .') },
    { ins: 'bass', vol: .8, n: bar('A1 . . . . . A1 . A1 . . . E2 . . .', 'F1 . . . . . F1 . F1 . . . C2 . . .', 'C2 . . . . . C2 . C2 . . . G1 . . .', 'G1 . . . . . G1 . E1 . . . E1 . . .') },
    { drum: 1, vol: .35, n: rep('k . . h . . h . s . . h . . h .', 4) }] },
  fatco: { bpm: 100, ch: [
    { ins: 'epiano', vol: .45, n: bar('E4 . G4 . B4 . G4 . E4 . G4 . B4 . D5 .', 'C4 . E4 . G4 . E4 . C4 . E4 . G4 . B4 .', 'A3 . C4 . E4 . C4 . A3 . C4 . E4 . G4 .', 'B3 . D#4 . F#4 . D#4 . B3 . D#4 . F#4 . A4 .') },
    { ins: 'bass', vol: .8, n: bar('E2 . . E2 . . E2 . . . E2 . D2 . . .', 'C2 . . C2 . . C2 . . . C2 . B1 . . .', 'A1 . . A1 . . A1 . . . A1 . G1 . . .', 'B1 . . B1 . . B1 . . . B1 . . . . .') },
    { ins: 'lead', vol: .3, n: bar('. . . . . . . . B4 - - - A4 - G4 -', 'E4 - - - - - - - . . . . . . . .', '. . . . . . . . C5 - - - B4 - A4 -', 'F#4 - - - - - - - . . . . . . . .') },
    { drum: 1, vol: .4, n: rep('k . h . s . h . k . h k s . h h', 4) }] },
  lot: { bpm: 78, ch: [
    { ins: 'organ', vol: .4, n: bar('A3 - - - - - - - G3 - - - - - - -', 'F3 - - - - - - - E3 - - - - - - -', 'A3 - - - - - - - G3 - - - - - - -', 'F3 - - - E3 - - - E3 - - - - - - -') },
    { ins: 'bass', vol: .9, n: bar('A1 . . C2 . . E2 . G1 . . B1 . . D2 .', 'F1 . . A1 . . C2 . E1 . . G#1 . . B1 .', 'A1 . . C2 . . E2 . G1 . . B1 . . D2 .', 'F1 . . A1 . . C2 . E1 . . . E1 . . .') },
    { ins: 'lead', vol: .38, n: bar('. . . . E5 - D5 C5 A4 - - - . . . .', '. . . . C5 - B4 A4 G#4 - - - . . . .', '. . . . E5 - G5 E5 D5 - C5 - A4 - . .', 'C5 - B4 - A4 - G#4 - A4 - - - . . . .') },
    { drum: 1, vol: .4, n: rep('k . . h s . . h k . k h s . . o', 4) }] },
  air: { bpm: 124, ch: [
    { ins: 'bass', vol: .9, n: rep('E1 . E1 E2 . E1 . E1 E2 . E1 . G1 . A1 .', 2) + ' ' + rep('C2 . C2 C3 . C2 . C2 C3 . C2 . D2 . B1 .', 2) },
    { ins: 'brass', vol: .4, n: bar('E4 - - - - - - - G4 - - - F#4 - - -', 'E4 - - - - - - - B3 - - - - - - -', 'C4 - - - - - - - E4 - - - D4 - - -', 'B3 - - - - - - - - - - - - - - -') },
    { ins: 'pluck', vol: .3, n: rep('E5 B4 G4 B4', 8) + ' ' + rep('C5 G4 E4 G4', 4) + ' ' + rep('B4 F#4 D#4 F#4', 4) },
    { drum: 1, vol: .5, n: rep('k . h k s . h . k . h k s . h h', 4) }] },
  night: { bpm: 86, ch: [
    { ins: 'pad', vol: .5, n: bar('C3 - - - - - - - - - - - - - - -', 'G#2 - - - - - - - - - - - - - - -', 'A#2 - - - - - - - - - - - - - - -', 'G2 - - - - - - - - - - - - - - -') },
    { ins: 'bell', vol: .35, n: bar('G5 . . . . . D#5 . . . C5 . . . . .', 'G#5 . . . . . D#5 . . . C5 . . . . .', 'A#5 . . . . . F5 . . . D5 . . . . .', 'G5 . . . . . D5 . . . B4 . . . . .') },
    { ins: 'bass', vol: .85, n: bar('C2 . . . C2 . . . C2 . . . C2 . D#2 .', 'G#1 . . . G#1 . . . G#1 . . . G#1 . C2 .', 'A#1 . . . A#1 . . . A#1 . . . A#1 . D2 .', 'G1 . . . G1 . . . G1 . . . B1 . . .') },
    { drum: 1, vol: .35, n: rep('k . . . h . . . s . . . h . . k', 4) }] },
  detention: { bpm: 66, ch: [
    { ins: 'pad', vol: .55, n: bar('E3 - - - - - - - F3 - - - - - - -', 'E3 - - - - - - - D#3 - - - - - - -', 'E3 - - - - - - - F3 - - - - - - -', 'A#2 - - - - - - - B2 - - - - - - -') },
    { ins: 'bell', vol: .3, n: bar('B5 . . . . . . . . . . . C6 . . .', '. . . . . . . . A#5 . . . . . . .', 'B5 . . . . . . . . . . . F5 . . .', '. . . . E5 . . . . . . . . . . .') },
    { ins: 'bass', vol: .7, n: bar('E1 . . . . . . . . . . . . . . .', 'E1 . . . . . . . . . . . D#1 . . .', 'E1 . . . . . . . . . . . . . . .', 'A#0 . . . . . . . B0 . . . . . . .') },
    { drum: 1, vol: .3, n: rep('k . . . . . . . . . . . h . . .', 4) }] },
  akiba: { bpm: 108, ch: [
    { ins: 'pluck', vol: .45, n: bar('A4 . C5 . D5 . E5 . G5 . E5 . D5 . C5 .', 'A4 . C5 . D5 . E5 . D5 . C5 . A4 . G4 .', 'A4 . C5 . D5 . E5 . G5 . A5 . G5 . E5 .', 'D5 . C5 . A4 . G4 . A4 . . . . . . .') },
    { ins: 'bass', vol: .85, n: rep('A1 . . A1 . . G1 . A1 . . A1 . . C2 .', 2) + ' ' + rep('F1 . . F1 . . E1 . F1 . . G1 . . A1 .', 2) },
    { ins: 'pad', vol: .4, n: bar('A3 - - - - - - - - - - - - - - -', 'E3 - - - - - - - - - - - - - - -', 'F3 - - - - - - - - - - - - - - -', 'G3 - - - - - - - E3 - - - - - - -') },
    { ins: 'bell', vol: .25, n: rep('. . . . . . . . . . . . E6 . . .', 4) },
    { drum: 1, vol: .45, n: rep('k . h . s . h k . . h k s . h .', 4) }] },
  vegas: { bpm: 96, ch: [
    { ins: 'epiano', vol: .45, n: bar('D4 F4 A4 C5 . . A4 . G4 B4 D5 F5 . . D5 .', 'C4 E4 G4 B4 . . G4 . A3 C#4 E4 G4 . . E4 .', 'D4 F4 A4 C5 . . A4 . G4 B4 D5 F5 . . D5 .', 'C4 E4 G4 B4 . . G4 . A3 C#4 E4 G4 A4 . . .') },
    { ins: 'bass', vol: .85, n: bar('D2 . A1 . D2 . E2 . G1 . D2 . G1 . A1 .', 'C2 . G1 . C2 . D2 . A1 . E2 . A1 . C#2 .', 'D2 . A1 . D2 . E2 . G1 . D2 . G1 . A1 .', 'C2 . G1 . C2 . D2 . A1 . E2 . A1 . . .') },
    { ins: 'lead', vol: .32, n: bar('A5 - - - G5 - F5 - E5 - - - D5 - - -', 'E5 - - - - - D5 - C#5 - - - - - - -', 'A5 - - - C6 - A5 - G5 - - - F5 - - -', 'E5 - G5 - E5 - C5 - C#5 - - - - - - -') },
    { drum: 1, vol: .35, n: rep('k . h h s . h h k . h h s . h o', 4) }] },
  lounge: { bpm: 84, ch: [
    { ins: 'epiano', vol: .5, n: bar('F4 A4 C5 E5 . . . . D4 F4 A4 C5 . . . .', 'G4 A#4 D5 F5 . . . . C4 E4 G4 A#4 . . . .', 'F4 A4 C5 E5 . . . . D4 F4 A4 C5 . . . .', 'G4 A#4 D5 F5 . . . . C4 E4 G4 A#4 C5 . . .') },
    { ins: 'bass', vol: .85, n: bar('F2 . . . C2 . . . D2 . . . A1 . . .', 'G1 . . . D2 . . . C2 . . . G1 . . .', 'F2 . . . C2 . . . D2 . . . A1 . . .', 'G1 . . . D2 . . . C2 . E2 . F2 . . .') },
    { ins: 'brass', vol: .3, n: bar('. . . . . . . . A5 - G5 - F5 - - -', '. . . . . . . . E5 - D5 - C5 - - -', '. . . . . . . . A5 - C6 - A5 - - -', 'G5 - - - F5 - - - E5 - - - F5 - - -') },
    { drum: 1, vol: .3, n: rep('k . . h . . h . s . . h . . h .', 4) }] },
  dam: { bpm: 100, ch: [
    { ins: 'brass', vol: .42, n: bar('G3 - - - - - - - A#3 - - - C4 - - -', 'D4 - - - - - - - C4 - - - A#3 - - -', 'G3 - - - - - - - A#3 - - - C4 - - -', 'D#4 - - - D4 - - - C4 - - - D4 - - -') },
    { ins: 'bass', vol: .9, n: rep('G1 . . G1 . . G1 . D#1 . . D#1 . . F1 .', 4) },
    { ins: 'pluck', vol: .3, n: rep('G4 . D5 . G5 . D5 .', 8) },
    { drum: 1, vol: .45, n: rep('k . . k s . . . k . k . s . h h', 4) }] },
  below: { bpm: 70, ch: [
    { ins: 'pad', vol: .6, n: bar('D3 - - - - - - - - - - - - - - -', 'D#3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'C#3 - - - - - - - - - - - - - - -') },
    { ins: 'bell', vol: .3, n: bar('A5 . . . . . . . D6 . . . . . . .', 'A#5 . . . . . . . . . . . G5 . . .', 'A5 . . . . . . . F5 . . . . . . .', 'E5 . . . . . . . . . . . . . . .') },
    { ins: 'bass', vol: .75, n: rep('D1 . . . . . . . . . . . . . . .', 4) },
    { drum: 1, vol: .35, n: rep('k . . . . . . . k . . . . . s .', 4) }] },
  combat: { bpm: 148, ch: [
    { ins: 'bass', vol: .95, n: rep('E1 E1 E2 E1 . E1 E2 . G1 G1 G2 G1 . A1 A2 .', 4) },
    { ins: 'brass', vol: .45, n: bar('E4 - - - G4 - - - A4 - - - B4 - A4 -', 'G4 - - - E4 - - - D4 - - - E4 - - -', 'E4 - - - G4 - - - A4 - - - C5 - B4 -', 'A4 - - - G4 - - - E4 - - - - - - -') },
    { ins: 'pluck', vol: .28, n: rep('E5 B4 E5 G5', 16) },
    { drum: 1, vol: .6, n: rep('k . h k s . h . k k h . s . h s', 4) }] },
  convo: { bpm: 80, ch: [
    { ins: 'pad', vol: .45, n: bar('C3 - - - - - - - - - - - - - - -', 'A2 - - - - - - - - - - - - - - -', 'F2 - - - - - - - - - - - - - - -', 'G2 - - - - - - - - - - - - - - -') },
    { ins: 'epiano', vol: .3, n: rep('E4 . . . G4 . . . C5 . . . G4 . . .', 4) }] },
  ending: { bpm: 72, ch: [
    { ins: 'pad', vol: .55, n: bar('F3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'A#2 - - - - - - - C3 - - - - - - -') },
    { ins: 'bell', vol: .38, n: bar('A5 . . . C6 . . . F6 . . . E6 . C6 .', 'G5 . . . C6 . . . E6 . . . D6 . C6 .', 'A5 . . . D6 . . . F6 . . . E6 . D6 .', 'D6 . . . C6 . . . A#5 . . . C6 . . .') },
    { ins: 'bass', vol: .7, n: bar('F1 . . . . . . . F1 . . . . . . .', 'C2 . . . . . . . C2 . . . . . . .', 'D2 . . . . . . . D2 . . . . . . .', 'A#1 . . . . . . . C2 . . . . . . .') }] },
});
// dynamic music: combat track while anyone is fighting Carl, back to the area's theme after it calms down
let calmT = 0;
function musicTick(M) {
  if (!OPT.music || !M) return; const fighting = M.ents.some(e => e.k === 'npc' && e.state === 'combat' && !e.dead && !e.down && e.target === P && dist(e, P) < 18);
  if (fighting) { calmT = 420; if (curName !== 'combat' && !M.d.noCombatMusic) music('combat'); }
  else if (calmT > 0 && --calmT === 0 && M.d.music) music(M.d.music);
}
// ---------- VISITOR: THE NORMALCY: Los Angeles at night ----------
Object.assign(TRACKS, {
  vntitle: { bpm: 72, ch: [
    { ins: 'organ', vol: .45, n: bar('A2 - - - - - - - - - - - - - - -', 'F2 - - - - - - - - - - - - - - -', 'D2 - - - - - - - - - - - - - - -', 'E2 - - - - - - - G#2 - - - - - - -') },
    { ins: 'brass', vol: .4, n: bar('A4 - - - - - C5 - B4 - A4 - E4 - - -', 'F4 - - - - - A4 - G4 - F4 - C4 - - -', 'D4 - - - F4 - A4 - D5 - - - C5 - A4 -', 'B4 - - - - - - - G#4 - - - - - - -') },
    { ins: 'bell', vol: .3, n: rep('A5 . E5 . C5 . E5 .', 2) + ' ' + rep('F5 . C5 . A4 . C5 .', 2) + ' ' + rep('D5 . A4 . F4 . A4 .', 2) + ' ' + rep('E5 . B4 . G#4 . B4 .', 2) },
    { ins: 'bass', vol: .8, n: bar('A1 . . . . . . . A1 . . . . . . .', 'F1 . . . . . . . F1 . . . . . . .', 'D1 . . . . . . . D1 . . . . . . .', 'E1 . . . . . . . E1 . . . . . . .') }] },
  santamonica: { bpm: 94, ch: [
    { ins: 'pad', vol: .5, n: bar('E3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'B2 - - - - - - - - - - - - - - -') },
    { ins: 'pluck', vol: .32, n: rep('E5 B4 G4 B4 E5 B4 G4 B4', 2) + ' ' + rep('C5 G4 E4 G4 C5 G4 E4 G4', 2) + ' ' + rep('D5 A4 F#4 A4 D5 A4 F#4 A4', 2) + ' ' + rep('B4 F#4 D#4 F#4 B4 F#4 D#4 F#4', 2) },
    { ins: 'lead', vol: .3, n: bar('. . . . . . . . G5 - - - F#5 - E5 -', 'E5 - - - - - - - . . . . . . . .', '. . . . . . . . A5 - - - G5 - F#5 -', 'D#5 - - - - - - - B4 - - - - - - -') },
    { ins: 'bass', vol: .85, n: bar('E2 . E2 . . E2 . . E2 . E2 . . G2 . .', 'C2 . C2 . . C2 . . C2 . C2 . . E2 . .', 'D2 . D2 . . D2 . . D2 . D2 . . F#2 . .', 'B1 . B1 . . B1 . . B1 . B1 . . D#2 . .') },
    { drum: 1, vol: .45, n: rep('k . h . s . h . k k h . s . h o', 4) }] },
  downtown: { bpm: 100, ch: [
    { ins: 'bass', vol: .9, n: rep('C2 . C2 . C2 . C3 . C2 . C2 . D#2 . C2 .', 2) + ' ' + rep('G#1 . G#1 . G#1 . G#2 . G#1 . G#1 . A#1 . G1 .', 2) },
    { ins: 'epiano', vol: .38, n: bar('C4 . D#4 . G4 . . . C4 . D#4 . G4 . A#4 .', 'C4 . D#4 . G4 . . . D4 . F4 . G4 . . .', 'G#3 . C4 . D#4 . . . G#3 . C4 . D#4 . G4 .', 'G3 . B3 . D4 . . . G3 . B3 . D4 . F4 .') },
    { ins: 'brass', vol: .3, n: bar('. . . . . . . . G4 - - - F4 - D#4 -', 'C4 - - - - - - - . . . . . . . .', '. . . . . . . . G#4 - - - G4 - F4 -', 'D4 - - - - - - - B3 - - - - - - -') },
    { drum: 1, vol: .45, n: rep('k . h . s . h k k . h . s . h .', 4) }] },
  hollywood: { bpm: 80, ch: [
    { ins: 'epiano', vol: .42, n: bar('D4 . F4 . A4 . C5 . . . A4 . F4 . . .', 'G3 . B3 . D4 . F4 . . . D4 . B3 . . .', 'C4 . E4 . G4 . B4 . . . G4 . E4 . . .', 'A3 . C#4 . E4 . G4 . . . E4 . C#4 . . .') },
    { ins: 'bass', vol: .85, n: bar('D2 . . . A1 . . . D2 . . . F2 . E2 .', 'G1 . . . D2 . . . G1 . . . B1 . A1 .', 'C2 . . . G1 . . . C2 . . . E2 . D2 .', 'A1 . . . E2 . . . A1 . . . C#2 . . .') },
    { ins: 'brass', vol: .32, n: bar('A4 - - - - - G4 - F4 - - - E4 - D4 -', 'F4 - - - - - - - . . . . . . . .', 'G4 - - - - - F4 - E4 - - - D4 - C4 -', 'E4 - - - - - - - C#4 - - - - - - -') },
    { drum: 1, vol: .35, n: rep('k . . h s . . h k . h . s . . h', 4) }] },
  tokyo: { bpm: 112, ch: [
    { ins: 'bass', vol: .85, n: rep('F2 . F2 F3 . F2 . F2 G2 . G2 G3 . G2 . G2', 2) + ' ' + rep('E2 . E2 E3 . E2 . E2 A2 . A2 A3 . A2 . A2', 2) },
    { ins: 'bell', vol: .32, n: bar('C6 . A5 . F5 . A5 . D6 . B5 . G5 . B5 .', 'C6 . A5 . F5 . A5 . D6 . B5 . G5 . D6 .', 'B5 . G#5 . E5 . G#5 . C6 . A5 . E5 . A5 .', 'B5 . G#5 . E5 . G#5 . A5 . . . . . . .') },
    { ins: 'lead', vol: .3, n: bar('A4 - - - C5 - D5 - E5 - - - D5 - C5 -', 'D5 - - - - - - - . . . . . . . .', 'G#4 - - - B4 - C5 - E5 - - - D5 - B4 -', 'C5 - - - - - - - A4 - - - - - - -') },
    { drum: 1, vol: .45, n: rep('k . h . s . h . k . h k s . h h', 4) }] },
  haunt: { bpm: 60, ch: [
    { ins: 'bell', vol: .4, n: bar('E5 . . . G5 . . . F#5 . . . . . . .', 'D5 . . . F5 . . . E5 . . . . . . .', 'C5 . . . E5 . . . D#5 . . . . . . .', 'B4 . . . . . . . . . . . A#4 . . .') },
    { ins: 'pad', vol: .4, n: bar('E3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'B2 - - - - - - - - - - - - - - -') }] },
});
