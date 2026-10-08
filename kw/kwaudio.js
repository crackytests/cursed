'use strict';
// ================= KONBINI WARS: sound (FM, late-90s Japanese PC shop music) =================
Object.assign(SFX, {
  chime: () => { note(1319, .25, 'bell', AC.currentTime, sfxBus, 0, .5); note(1047, .4, 'bell', AC.currentTime + .18, sfxBus, 0, .5); },
  reg: () => { note(2093, .04, 'pluck', AC.currentTime, sfxBus, 0, .35); note(2637, .06, 'pluck', AC.currentTime + .05, sfxBus, 0, .35); },
  crate: () => noise(.12, { lp: 500, vol: .3 }),
  cash: () => [784, 988, 1175, 1568].forEach((f, i) => note(f, .1, 'bell', AC.currentTime + i * .06, sfxBus)),
  bad: () => { note(220, .15, 'brass', AC.currentTime, sfxBus); note(185, .25, 'brass', AC.currentTime + .14, sfxBus); },
  jingle: () => [523, 659, 784, 659, 1047].forEach((f, i) => note(f, .14, 'bell', AC.currentTime + i * .11, sfxBus)),
  place: () => { noise(.05, { lp: 900, vol: .4 }); note(660, .05, 'pluck', AC.currentTime, sfxBus); },
});
Object.assign(TRACKS, {
  // Carl: loose and bouncy
  carl: { bpm: 112, ch: [
    { ins: 'bass', vol: .8, n: 'C2 . G1 . C2 . G1 A1 F1 . C2 . F1 . G1 . C2 . G1 . C2 . E2 . F1 . A1 . G1 . B1 .' },
    { ins: 'epiano', vol: .45, n: 'E4 . G4 . C5 . G4 . F4 . A4 . C5 . A4 . E4 . G4 . C5 . E5 . D5 . B4 . G4 . F4 .' },
    { ins: 'lead', vol: .45, n: 'G5 - E5 . C5 . D5 E5 F5 - A5 . G5 - - . E5 - G5 . C6 . B5 A5 G5 - F5 . D5 - - .' },
    { drum: 1, vol: .45, n: 'k . h . s . h h k . h . s . h . k . h . s . h h k . h k s . h .' }] },
  // Ghost: theatrical, minor, a little organ
  ghost: { bpm: 96, ch: [
    { ins: 'organ', vol: .5, n: 'A3 - - - - - - - F3 - - - - - - - D3 - - - - - - - E3 - - - - - - -' },
    { ins: 'bass', vol: .8, n: 'A1 . . A1 . . E2 . F1 . . F1 . . C2 . D1 . . D1 . . A1 . E1 . . E1 . G#1 . B1 .' },
    { ins: 'bell', vol: .45, n: 'E5 . A5 . C6 . B5 . A5 . F5 . A5 - - . F5 . D5 . F5 . A5 . G#5 . E5 . B5 - - .' },
    { drum: 1, vol: .4, n: 'k . . h s . . h k . k h s . . h k . . h s . . h k . k h s . o .' }] },
  // Linda: polished and ceremonial, brass over a stately bass
  linda: { bpm: 92, ch: [
    { ins: 'brass', vol: .5, n: 'C5 - - E5 G5 - - - A5 - G5 - F5 - E5 - D5 - - F5 A5 - - - G5 - - - - - - .' },
    { ins: 'bass', vol: .8, n: 'C2 . . . C2 . . . F1 . . . F1 . . . D2 . . . D2 . . . G1 . . . G1 . B1 .' },
    { ins: 'pad', vol: .5, n: 'E4 - - - - - - - A3 - - - - - - - F4 - - - - - - - D4 - - - - - - -' },
    { ins: 'bell', vol: .35, n: 'G5 . . . . . . . C6 . . . . . . . A5 . . . . . . . B5 . . . . . . .' },
    { drum: 1, vol: .4, n: 'k . . . s . . . k . . h s . . . k . . . s . . . k . h . s . s .' }] },
  // Face: curious, a little bleepy, wandering
  face: { bpm: 108, ch: [
    { ins: 'bell', vol: .45, n: 'E5 . G5 . B5 . A5 . E5 . D5 . G5 . . . F5 . A5 . C6 . B5 . G5 . E5 . D5 . . .' },
    { ins: 'bass', vol: .75, n: 'E2 . . E2 . . B1 . C2 . . C2 . . G1 . D2 . . D2 . . A1 . B1 . . B1 . . F#1 .' },
    { ins: 'epiano', vol: .35, n: 'B3 . E4 . G4 . E4 . C4 . E4 . G4 . E4 . D4 . F#4 . A4 . F#4 . B3 . D#4 . F#4 . D#4 .' },
    { drum: 1, vol: .35, n: 'k . h . . h s . k . h . . h s h k . h . . h s . k . h k . h s .' }] },
  // Yoko: calm, gentle electric piano
  yoko: { bpm: 84, ch: [
    { ins: 'epiano', vol: .45, n: 'A4 . C5 . E5 - - . D5 . C5 . B4 - - . G4 . B4 . D5 - - . C5 . B4 . A4 - - .' },
    { ins: 'bass', vol: .7, n: 'A1 . . . . . E2 . F1 . . . . . C2 . G1 . . . . . D2 . A1 . . . . . E2 .' },
    { ins: 'pad', vol: .5, n: 'C4 - - - - - - - A3 - - - - - - - B3 - - - - - - - C4 - - - - - - -' },
    { drum: 1, vol: .25, n: 'k . . . h . . . k . . . h . . . k . . . h . . . k . . . h . h .' }] },
  // JB: warm and nocturnal, a slow walking bass
  jb: { bpm: 76, ch: [
    { ins: 'bass', vol: .85, n: 'D2 . F2 . A2 . C3 . G1 . B1 . D2 . F2 . C2 . E2 . G2 . A2 . A1 . C#2 . E2 . G2 .' },
    { ins: 'epiano', vol: .4, n: 'F4 - A4 - C5 - - . F4 - B4 - D5 - - . E4 - G4 - B4 - - . E4 - G4 - C#5 - - .' },
    { ins: 'lead', vol: .3, n: 'A5 - - - G5 - F5 - E5 - - - - - - . D5 - - - E5 - F5 - G5 - - - A5 - - .' },
    { drum: 1, vol: .3, n: 'k . h h s . h . k . h h s . h h k . h h s . h . k . h h s h h .' }] },
  // the map: calm, a bit of a jingle
  mall: { bpm: 100, ch: [
    { ins: 'pad', vol: .5, n: 'F3 - - - - - - - G3 - - - - - - - E3 - - - - - - - A3 - - - - - - -' },
    { ins: 'bass', vol: .75, n: 'F1 . . F1 . . C2 . G1 . . G1 . . D2 . E1 . . E1 . . B1 . A1 . . A1 . . E2 .' },
    { ins: 'epiano', vol: .4, n: 'A4 . C5 . F5 . C5 . B4 . D5 . G5 . D5 . G4 . B4 . E5 . B4 . C5 . E5 . A5 . E5 .' },
    { drum: 1, vol: .3, n: 'k . h . s . h . k . h . s . h . k . h . s . h . k . h . s . h h' }] },
  title: { bpm: 120, ch: [
    { ins: 'brass', vol: .5, n: 'C5 - E5 - G5 - - . A5 - G5 - E5 - - . F5 - A5 - C6 - - . B5 - - - G5 - - .' },
    { ins: 'bass', vol: .8, n: 'C2 . C2 . G1 . G1 . A1 . A1 . E1 . E1 . F1 . F1 . C2 . C2 . G1 . G1 . G1 . B1 .' },
    { ins: 'epiano', vol: .35, n: 'E4 G4 C5 G4 E4 G4 C5 G4 E4 A4 C5 A4 E4 A4 C5 A4 F4 A4 C5 A4 F4 A4 C5 A4 D4 G4 B4 G4 D4 G4 B4 G4' },
    { drum: 1, vol: .5, n: 'k . h . s . h . k . h k s . h . k . h . s . h . k . h k s . s s' }] },
  settle: { bpm: 90, ch: [
    { ins: 'bell', vol: .5, n: 'C5 . E5 . G5 . C6 - - - - - - - - - G5 . E5 . C5 . D5 - - - - - - - - -' },
    { ins: 'pad', vol: .5, n: 'C4 - - - - - - - - - - - - - - - F3 - - - - - - - G3 - - - - - - -' },
    { ins: 'bass', vol: .7, n: 'C2 . . . . . . . . . . . . . . . F1 . . . . . . . G1 . . . . . . .' }] },
});
