'use strict';
// ================= DARK MONDAY: sound effects and music =================
Object.assign(SFX, {
  swing: () => noise(.1, { hp: 2500, vol: .25, rate: 1.6 }),
  hit: () => { noise(.08, { lp: 2400, vol: .45 }); tone(180, .12, { slide: .5, vol: .3, type: 'square' }); },
  mhit: () => { tone(140, .18, { slide: .4, vol: .35, type: 'sawtooth' }); noise(.1, { lp: 900, vol: .4 }); },
  derez: () => { for (let i = 0; i < 10; i++) tone(1800 - i * 160, .05, { vol: .2, delay: i * .03, type: 'square' }); noise(.3, { hp: 4000, vol: .2 }); },
  zap: () => tone(1400, .15, { slide: .3, vol: .25, type: 'sawtooth' }),
  bump: () => noise(.06, { lp: 500, vol: .4 }),
});
Object.assign(TRACKS, {
  cellar: { bpm: 72, ch: [
    { ins: 'pad', vol: .7, n: 'A3 - - - - - - - F3 - - - - - - - G3 - - - - - - - E3 - - - - - - -' },
    { ins: 'bass', vol: .8, n: 'A1 . . . . . A1 . F1 . . . . . F1 . G1 . . . . . G1 . E1 . . . . . E1 .' },
    { ins: 'bell', vol: .6, n: 'E5 . . . . . . . . . C5 . . . . . D5 . . . . . . . . . B4 . . . . . .' },
    { ins: 'epiano', vol: .35, n: 'A3 . C4 . E4 . C4 . F3 . A3 . C4 . A3 . G3 . B3 . D4 . B3 . E3 . G#3 . B3 . G#3 .' }] },
});
SFX.alert = () => [0, .12].forEach(d => note(660, .08, 'brass', AC.currentTime + d, sfxBus));
SFX.phase = () => { tone(300, .25, { type: 'sine', slide: 3, vol: .4 }); noise(.2, { lp: 1200, vol: .2 }); };
Object.assign(TRACKS, {
  title: { bpm: 84, ch: [
    { ins: 'brass', vol: .55, n: 'E4 - - - G4 - - - A4 - - - B4 - - - C5 - - - B4 - - - A4 - - - G4 - - -' },
    { ins: 'bass', vol: .85, n: 'E2 . . . . . E2 . A1 . . . . . A1 . C2 . . . . . C2 . G1 . . . . . G1 .' },
    { ins: 'pad', vol: .6, n: 'E3 - - - - - - - A3 - - - - - - - C4 - - - - - - - G3 - - - - - - -' },
    { ins: 'epiano', vol: .3, n: 'B4 . E5 . B4 . G4 . A4 . C5 . A4 . E4 . C5 . E5 . C5 . G4 . B4 . D5 . B4 . G4 .' },
    { drum: 1, vol: .5, n: 'k . . . . . h . s . . . . . h . k . . . . . h . s . . . . h . h .' }] },
  tunnels: { bpm: 90, ch: [
    { ins: 'pad', vol: .6, n: 'D3 - - - - - - - Bb3 - - - - - - - C3 - - - - - - - A2 - - - - - - -'.replace(/Bb/g, 'A#') },
    { ins: 'bass', vol: .9, n: 'D1 . . D1 . . D1 . A#0 . . A#0 . . A#0 . C1 . . C1 . . C1 . A0 . . A0 . . A0 .' },
    { ins: 'bell', vol: .5, n: 'A5 . . . . . . . . . F5 . . . . . G5 . . . . . . . . . E5 . . . . . .' },
    { ins: 'pluck', vol: .45, n: 'D4 . F4 . A4 . F4 . D4 . F4 . A#3 . D4 . C4 . E4 . G4 . E4 . C4 . E4 . A3 . C4 .' },
    { drum: 1, vol: .4, n: 'k . . . h . . . k . . . h . h . k . . . h . . . k . . h h . h .' }] },
});
Object.assign(TRACKS, {
  crypt: { bpm: 80, ch: [
    { ins: 'pad', vol: .6, n: 'E3 - - - - - - - C3 - - - - - - - D3 - - - - - - - B2 - - - - - - -' },
    { ins: 'bass', vol: .85, n: 'E1 . . . . . . E1 . . . . C1 . . . D1 . . . . . . D1 . . . B0 . . . .' },
    { ins: 'bell', vol: .5, n: 'B5 . . . . . G5 . . . . . . . . . A5 . . . . . F#5 . . . . . . . . .' },
    { ins: 'pluck', vol: .4, n: 'E4 . . . B3 . . . G3 . . . B3 . . . D4 . . . A3 . . . F#3 . . . A3 . . .' },
    { drum: 1, vol: .35, n: 'k . . . . . . . h . . . k . . . k . . . . . . . h . . . h . . .' }] },
  boss: { bpm: 128, ch: [
    { ins: 'brass', vol: .6, n: 'E4 . E4 . G4 . E4 . A4 . G4 . E4 . D4 . E4 . E4 . G4 . B4 . A4 . G4 . E4 . . .' },
    { ins: 'bass', vol: .95, n: 'E1 . E1 E1 . E1 E1 . G1 . G1 G1 . G1 G1 . A1 . A1 A1 . A1 A1 . B0 . B0 B0 . B0 B0 .' },
    { ins: 'slap', vol: .5, n: 'E2 . . E2 . . E2 . G2 . . G2 . . G2 . A2 . . A2 . . A2 . B1 . . B1 . . B1 .' },
    { ins: 'bell', vol: .4, n: 'E5 . . . . . B5 . . . . . G5 . . . A5 . . . . . E5 . . . . . D5 . . .' },
    { drum: 1, vol: .6, n: 'k . h . s . h . k . h . s . h h k . h . s . h . k . h k s . h h' }] },
  sanctum: { bpm: 64, ch: [
    { ins: 'pad', vol: .7, n: 'A2 - - - - - - - F2 - - - - - - - C3 - - - - - - - G2 - - - - - - -' },
    { ins: 'brass', vol: .4, n: 'A4 - - - - - - - . - - - C5 - - - - - - - . - - - B4 - - - - - - -' },
    { ins: 'bass', vol: .8, n: 'A1 . . . . . . . F1 . . . . . . . C1 . . . . . . . G1 . . . . . . .' },
    { ins: 'bell', vol: .45, n: 'E6 . . . . . . . . . C6 . . . . . D6 . . . . . . . . . B5 . . . . . .' },
    { drum: 1, vol: .3, n: 'k . . . . . . . . . . . k . . . . . . . . . . . k . . . . . . .' }] },
});
