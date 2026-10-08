'use strict';
// CARL 2's FM sounds and familiar hooks, arranged for EXTREME's five platforming stages.
// ---------------- sound: a warmer mix, a guitar, a sax ----------------
FM_TONE = { low: .7, high: -.75, lp: 7800, room: .08, sfxHigh: -3, gain: 1 };
// CARL 2's own sounds: radio static, the arena alarm, and a warehouse's worth of stuff falling over
SFX.static = () => { noise(.5, { bp: 2200, vol: .28, rate: 1.4 }); noise(.35, { hp: 4000, vol: .12, at: AC.currentTime + .1 }); };
SFX.alert = () => [0, .14, .28].forEach(d => note(880, .09, 'brass', AC.currentTime + d, sfxBus));
SFX.crash = () => { noise(.9, { lp: 700, vol: .6, rate: .5 }); for (let i = 0; i < 5; i++) noise(.12, { bp: 500 + Math.random() * 1600, vol: .3, at: AC.currentTime + .08 + i * .09 }); kick(AC.currentTime, sfxBus, .8); };
Object.assign(PATCH, {
  guitar: { ratio: 1, index: 3.6, mdecay: .35, a: .006, d: .22, s: .5, vol: .38 },
  sax: { ratio: 1, index: 2.2, mdecay: .8, a: .04, d: .3, s: .72, vol: .42 },
  surf: { ratio: 1, index: 3.4, mdecay: .07, d: .22, s: .08, vol: .5 },
});
Object.assign(PATCH.bell, { index: 2, mdecay: .05 });
Object.assign(LEGACY_WAVE, { guitar: 'p25', sax: 'p50', surf: 'p12' });
Object.assign(TRACKS, {
  title: { bpm: 150, ch: [
    { ins: 'brass', vol: 0.8, n: [
      'B4 - - - D5 - E5 - G5 - - - F#5 - E5 -',
      'D5 - - - B4 - - - A4 - B4 - D5 - - -',
      'E5 - - - - - - - G5 - F#5 - E5 - D5 -',
      'E5 - - - - - - - A4 . F#4 . D5 - . .',
      'B4 . D5 E5 G5 - F#5 E5 D5 . B4 . E5 - . .',
      'D5 . B4 D5 G5 - A5 G5 D5 . B4 . G4 - . .',
      'C5 - A4 . E5 . G5 E5 C5 . A4 . E5 - . .',
      'F#5 . D#5 F#5 A5 - F#5 . D#5 . B4 . E5 - . .'
    ].join(' ') },
    { ins: 'guitar', vol: 0.72, n: [
      'E3 E3 . E3 G3 . E3 . A3 . G3 E3 D3 . E3 .',
      'E3 E3 . E3 G3 . E3 . B3 . A3 G3 A3 . B3 .',
      'C3 C3 . C3 G3 . C3 . C3 . E3 C3 G3 . C3 .',
      'D3 D3 . D3 A3 . D3 . D3 . A3 D3 A3 . D3 .',
      'E3 E3 . E3 B3 . E3 . E3 . B3 E3 B3 . E3 .',
      'G3 G3 . G3 D4 . G3 . G3 . D4 G3 D4 . G3 .',
      'A2 A2 . A2 E3 . A2 . A2 . E3 A2 E3 . A2 .',
      'B2 B2 . B2 F#3 . B2 . B2 . F#3 B2 F#3 . B2 .'
    ].join(' ') },
    { ins: 'bass', vol: 0.72, n: [
      'E2 . E2 E2 . B1 E2 . E2 . E2 B1 . . E2 .',
      'E2 . E2 E2 . B1 E2 . E2 . E2 B1 . . E2 .',
      'C2 . C2 C2 . G1 C2 . C2 . C2 E2 . . C2 .',
      'D2 . D2 D2 . A1 D2 . D2 . D2 A1 . . D2 .',
      'E2 . E2 E2 . B1 E2 . E2 . E2 B1 . . E2 .',
      'G2 . G2 G2 . D2 G2 . G2 . G2 D2 . . G2 .',
      'A1 . A1 A1 . E2 A1 . A1 . A1 E2 . . A1 .',
      'B1 . B1 B1 . F#2 B1 . B1 . B1 F#2 . . B1 .'
    ].join(' ') },
    { drum: 1, vol: 0.75, n: [
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k . h k s . h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k k h . s s h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k . h k s . h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k k h . s s h o'
    ].join(' ') }
  ] },
  previously: { bpm: 84, ch: [{ ins: 'lead', n: 'E4 - - G4 A4 - - - G4 - E4 - D4 - - - E4 - - G4 A4 - C5 - B4 - - - - - - -' }, { ins: 'bass', n: 'A2 . . . . . . . F2 . . . . . . . G2 . . . . . . . E2 . . . . . . .' }, { ins: 'pad', vol: .32, n: 'A3 - - - C4 - - - A3 - - - A3 - - - G3 - - - C4 - - - E3 - - - G3 - - -' }] },
  sting: { bpm: 150, ch: [{ ins: 'sax', n: 'C5 - E5 - G5 - A5 - G5 - E5 - C5 - - - D5 - F5 - A5 - C6 - - - - - - - - -' }, { ins: 'organ', n: 'C4 . E4 . G4 . C4 . F4 . A4 . C5 . . . F4 . A4 . D5 . . . . . . . . . . .' }, { ins: 'bass', n: 'C2 . C3 . A1 . A2 . F1 . F2 . G1 . G2 . C2 - - - - - - - - - - - - - - -' }, { drum: 1, n: 'k . h . s . h . k . h . s . s s k . . . x . . . . . . . . . . .' }] },
  ship: { bpm: 82, ch: [{ ins: 'epiano', n: 'D4 F4 A4 C5 . . A4 . C4 E4 G4 B4 . . G4 . A#3 D4 F4 A4 . . F4 . C4 E4 G4 . E4 . . .' }, { ins: 'bass', n: 'D2 . . . . . D2 . C2 . . . . . C2 . A#1 . . . . . A#1 . C2 . . . . . C2 .' }, { ins: 'pad', n: 'F4 - - - - - - - E4 - - - - - - - D4 - - - - - - - E4 - - - - - - -' }, { drum: 1, vol: .45, n: 'k . . . s . . k . . k . s . . .' }] },
  lot: { bpm: 124, ch: [
    { ins: 'sax', vol: 0.78, n: [
      'G4 . A4 B4 D5 - B4 . A4 . G4 . E4 - G4 .',
      'B4 - G4 . E4 . G4 B4 E5 - D5 . B4 - . .',
      'C5 - E5 . G5 - E5 . D5 . C5 A4 G4 - . .',
      'A4 . B4 D5 F#5 - E5 D5 A4 - F#4 . D5 - . .',
      'A4 . C5 E5 A5 - G5 E5 C5 . B4 . A4 - . .',
      'G4 . C5 . E5 - D5 C5 E5 . G5 . E5 - . .',
      'F#5 - E5 . D5 . B4 A4 F#4 . A4 D5 E5 . F#5 .',
      'G5 - D5 . B4 . A4 G4 D5 . B4 . G4 - . .'
    ].join(' ') },
    { ins: 'pluck', vol: 0.42, n: [
      'B3 . D4 . G3 . D4 . B3 . D4 . G4 . D4 .',
      'G3 . B3 . E3 . B3 . G3 . B3 . E4 . B3 .',
      'E3 . G3 . C3 . G3 . E3 . G3 . C4 . G3 .',
      'F#3 . A3 . D3 . A3 . F#3 . A3 . D4 . A3 .',
      'C3 . E3 . A2 . E3 . C3 . E3 . A3 . E3 .',
      'E3 . G3 . C3 . G3 . E3 . G3 . C4 . G3 .',
      'F#3 . A3 . D3 . A3 . F#3 . A3 . D4 . A3 .',
      'B3 . D4 . G3 . D4 . B3 . D4 . G4 . D4 .'
    ].join(' ') },
    { ins: 'slap', vol: 0.64, n: [
      'G2 . . G2 . D2 . . G2 . . B2 . D2 . .',
      'E2 . . B1 E2 . E3 . E2 . . G2 . B1 . .',
      'C2 . . C2 . G1 . . C2 . . E2 . G1 . .',
      'D2 . . A1 D2 . D3 . D2 . . F#2 . A1 . .',
      'A1 . . A1 . E2 . . A1 . . C2 . E2 . .',
      'C2 . . G1 C2 . C3 . C2 . . E2 . G1 . .',
      'D2 . . D2 . A1 . . D2 . . F#2 . A1 . .',
      'G2 . . D2 G2 . G3 . G2 . . B2 . D2 . .'
    ].join(' ') },
    { drum: 1, vol: 0.62, n: [
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k . h k s . h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k k h . s s h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k . h k s . h o',
      'k . h . s . h k k . h . s . h h',
      'k . h k s . h . k k h . s s h o'
    ].join(' ') }
  ] },
  mall: { bpm: 116, ch: [
    { ins: 'epiano', vol: 0.9, n: [
      'E5 - C#5 . A4 . C#5 E5 A5 - F#5 E5 C#5 - . .',
      'G#4 . B4 E5 G#5 - F#5 E5 B4 - G#4 . E5 - . .',
      'F#5 - C#5 . A4 . C#5 E5 F#5 . A5 . G#5 - F#5 .',
      'D5 . F#5 A5 F#5 - E5 D5 A4 . B4 . D5 - . .',
      'B4 - D5 . F#5 . A5 . F#5 - E5 D5 B4 - . .',
      'B4 . G#4 B4 E5 - F#5 G#5 B5 . G#5 . F#5 E5 . .',
      'F#5 . E5 D5 A4 - F#4 . D5 . F#5 . E5 - D5 .',
      'C#5 . E5 A5 F#5 - E5 C#5 B4 . C#5 . A4 - . .'
    ].join(' ') },
    { ins: 'pluck', vol: 0.4, n: [
      '. . C#4 . . . E4 . . . C#4 . . . E4 .',
      '. . G#3 . . . B3 . . . G#3 . . . B3 .',
      '. . A3 . . . C#4 . . . A3 . . . C#4 .',
      '. . F#3 . . . A3 . . . F#3 . . . A3 .',
      '. . D3 . . . F#3 . . . D3 . . . F#3 .',
      '. . G#3 . . . B3 . . . G#3 . . . B3 .',
      '. . F#3 . . . A3 . . . F#3 . . . A3 .',
      '. . C#4 . . . E4 . . . C#4 . . . E4 .'
    ].join(' ') },
    { ins: 'slap', vol: 0.62, n: [
      'A2 . E2 . . A3 . E2 A2 . C#3 . . E2 . .',
      'E2 . B1 . . E3 . B1 E2 . G#2 . . B1 . .',
      'F#2 . C#2 . . F#3 . C#2 F#2 . A2 . . C#2 . .',
      'D2 . A1 . . D3 . A1 D2 . F#2 . . A1 . .',
      'B1 . F#2 . . B2 . F#2 B1 . D2 . . F#2 . .',
      'E2 . B1 . . E3 . B1 E2 . G#2 . . B1 . .',
      'D2 . A1 . . D3 . A1 D2 . F#2 . . A1 . .',
      'A2 . E2 . . A3 . E2 A2 . C#3 . . E2 . .'
    ].join(' ') },
    { drum: 1, vol: 0.6, n: [
      'k . h . s . h . k . h k s . h o',
      'k . h k s . h . k . h . s . h .',
      'k . h . s . h . k . h k s . h o',
      'k . h . s . h k k . h . s h s o',
      'k . h . s . h . k . h k s . h o',
      'k . h k s . h . k . h . s . h .',
      'k . h . s . h . k . h k s . h o',
      'k . h . s . h k k . h . s h s o'
    ].join(' ') }
  ] },
  shop: { bpm: 88, ch: [{ ins: 'organ', n: '. C4 . C4 . C4 . C4 . A#3 . A#3 . A#3 . A#3 . F3 . F3 . F3 . F3 . G3 . G3 . G3 . G3' }, { ins: 'bass', n: 'C2 . . C2 . . E2 . F2 . . F2 . . A2 . F2 . . F2 . . C2 . G2 . . G2 . . B1 .' }, { ins: 'lead', n: 'G4 - - - E4 - F4 - G4 - - - . . . . A4 - - - G4 - F4 - E4 - - - D4 - - -' }, { drum: 1, vol: .5, n: 'k . . . s . . . k . k . s . . .' }] },
  lost: { bpm: 68, ch: [{ ins: 'bell', n: 'A4 . C5 . E5 . C5 . G4 . B4 . D5 . B4 . F4 . A4 . C5 . A4 . E4 . G#4 . B4 . E5 .' }, { ins: 'pad', n: 'A3 - - - - - - - G3 - - - - - - - F3 - - - - - - - E3 - - - - - - -' }, { ins: 'bass', vol: .7, n: 'A1 . . . . . . . G1 . . . . . . . F1 . . . . . . . E1 . . . . . . .' }] },
  committee: { bpm: 96, ch: [{ ins: 'brass', n: 'C4 . C4 . G3 . . . C4 . C4 . A#3 . . . C4 . C4 . G3 . C4 . D#4 . D4 . C4 . . .' }, { ins: 'bass', n: 'C2 . G1 . C2 . G1 . A#1 . F1 . A#1 . F1 . C2 . G1 . C2 . G1 . G1 . G1 . C2 . . .' }, { drum: 1, vol: .6, n: 'k . . . s . . . k . . . s . s .' }] },
  boss: { bpm: 164, ch: [
    { ins: 'brass', vol: 0.83, n: [
      'B4 - - G4 - - E4 - F#4 - G4 - A4 - B4 -',
      'E5 - B4 . G4 . B4 D5 E5 . G5 . F#5 - E5 .',
      'C5 - - A4 - - G4 - E5 - D5 - C5 - G4 -',
      'A4 . D5 . F#5 - E5 D5 A4 - F#4 . D5 - . .',
      'C5 - A4 . E5 - C5 . A4 . C5 E5 G5 - E5 .',
      'G5 - E5 . C5 . G4 . E5 . G5 . E5 - D5 .',
      'F#5 . D#5 F#5 A5 - F#5 . D#5 . B4 . F#5 - . .',
      'E5 . G5 B5 G5 - E5 D5 B4 . G4 . E5 - . .'
    ].join(' ') },
    { ins: 'guitar', vol: 0.8, n: [
      'E3 E3 G3 E3 A3 E3 A#3 A3 E3 E3 G3 E3 D4 C4 B3 G3',
      'E3 E3 . E3 B3 . E3 . E3 . B3 E3 B3 . E3 .',
      'C3 C3 . C3 G3 . C3 . C3 . G3 C3 G3 . C3 .',
      'D3 D3 . D3 A3 . D3 . D3 . A3 D3 A3 . D3 .',
      'A2 A2 . A2 E3 . A2 . A2 . E3 A2 E3 . A2 .',
      'C3 C3 . C3 G3 . C3 . C3 . G3 C3 G3 . C3 .',
      'B2 B2 . B2 F#3 . B2 . B2 . F#3 B2 F#3 . B2 .',
      'E3 E3 . E3 B3 . E3 . E3 . B3 E3 B3 . E3 .'
    ].join(' ') },
    { ins: 'slap', vol: 0.72, n: [
      'E2 E3 . E2 . B1 E2 . E2 E3 . E2 B1 . E3 .',
      'E2 . E3 . B1 . E2 . E2 E3 . G2 . B1 . .',
      'C2 C3 . C2 . G1 C2 . C2 C3 . C2 G1 . C3 .',
      'D2 . D3 . A1 . D2 . D2 D3 . F#2 . A1 . .',
      'A1 A2 . A1 . E2 A1 . A1 A2 . A1 E2 . A2 .',
      'C2 . C3 . G1 . C2 . C2 C3 . E2 . G1 . .',
      'B1 B2 . B1 . F#2 B1 . B1 B2 . B1 F#2 . B2 .',
      'E2 . E3 . B1 . E2 . E2 E3 . G2 . B1 . .'
    ].join(' ') },
    { drum: 1, vol: 0.76, n: [
      'k h s h k k s h k h s h k . s h',
      'k . h k s . h . k k h . s . h o',
      'k h s h k k s h k h s h k . s h',
      'k . h k s . h . k k s h s . s o',
      'k h s h k k s h k h s h k . s h',
      'k . h k s . h . k k h . s . h o',
      'k h s h k k s h k h s h k . s h',
      'k . h k s . h . k k s h s . s o'
    ].join(' ') }
  ] },
  argue: { bpm: 124, ch: [{ ins: 'slap', n: 'A2 A3 . A2 G3 . A2 . E2 E3 . E2 G2 . A2 . A2 A3 . A2 C4 . A2 . D3 D3 . C3 A2 . G2 .' }, { ins: 'brass', n: 'E5 . E5 . . . C5 D5 . . . . E5 . . . G5 . G5 . . . E5 D5 . C5 . A4 . . . .' }, { ins: 'pluck', n: 'A4 C5 E5 C5 A4 C5 E5 C5 G4 C5 E5 C5 G4 C5 E5 C5' }, { drum: 1, n: 'k . h k s . h . k k h . s . h o' }] },
  special: { bpm: 70, ch: [{ ins: 'epiano', n: 'C4 E4 G4 C5 E5 . . . A3 C4 E4 A4 C5 . . . F3 A3 C4 F4 A4 . . . G3 B3 D4 G4 B4 . D5 .' }, { ins: 'pad', vol: .7, n: 'C4 - - - - - - - A3 - - - - - - - F3 - - - - - - - G3 - - - - - - -' }, { ins: 'bass', vol: .6, n: 'C2 . . . . . . . A1 . . . . . . . F1 . . . . . . . G1 . . . . . . .' }] },
  desert: { bpm: 118, ch: [
    { ins: 'surf', vol: 0.82, n: [
      'E4 . E4 G4 . A4 . B4 G4 . E4 . D4 - . .',
      'D4 . F#4 A4 . B4 . A4 F#4 . E4 . D4 - . .',
      'G4 - E4 . C4 . E4 G4 A4 . G4 E4 C4 - . .',
      'F#4 . D#4 F#4 A4 - F#4 . D#4 . B3 . F#4 - . .',
      'B4 - G4 . E4 . G4 A4 B4 . D5 . B4 - G4 .',
      'D5 . B4 D5 G5 - D5 . B4 . A4 . G4 - . .',
      'C5 - A4 . E4 . A4 C5 G4 . A4 . G4 - E4 .',
      'F#4 . D#4 . B3 - D#4 F#4 A4 . F#4 D#4 B3 - . .'
    ].join(' ') },
    { ins: 'guitar', vol: 0.48, n: [
      'E3 . B3 . E3 . G3 . E3 . B3 . G3 . B3 .',
      'D3 . A3 . D3 . F#3 . D3 . A3 . F#3 . A3 .',
      'C3 . G3 . C3 . E3 . C3 . G3 . E3 . G3 .',
      'B2 . F#3 . B2 . D#3 . B2 . F#3 . D#3 . F#3 .',
      'E3 . B3 . E3 . G3 . E3 . B3 . G3 . B3 .',
      'G3 . D4 . G3 . B3 . G3 . D4 . B3 . D4 .',
      'A2 . E3 . A2 . C3 . A2 . E3 . C3 . E3 .',
      'B2 . F#3 . B2 . D#3 . B2 . F#3 . D#3 . F#3 .'
    ].join(' ') },
    { ins: 'bass', vol: 0.74, n: [
      'E2 - . . B1 . . . E2 - . . B1 . . .',
      'D2 - . . A1 . . . D2 - . . A1 . . .',
      'C2 - . . G1 . . . C2 - . . G1 . . .',
      'B1 - . . F#2 . . . B1 - . . F#2 . . .',
      'E2 - . . B1 . . . E2 - . . B1 . . .',
      'G2 - . . D2 . . . G2 - . . D2 . . .',
      'A1 - . . E2 . . . A1 - . . E2 . . .',
      'B1 - . . F#2 . . . B1 - . . F#2 . . .'
    ].join(' ') },
    { drum: 1, vol: 0.68, n: [
      'k . . h s . . h k . . h s . h .',
      'k . . h s . h . k . k h s . h o',
      'k . . h s . . h k . . h s . h .',
      'k . . h s . h . k k . h s . s o',
      'k . . h s . . h k . . h s . h .',
      'k . . h s . h . k . k h s . h o',
      'k . . h s . . h k . . h s . h .',
      'k . . h s . h . k k . h s . s o'
    ].join(' ') }
  ] },
  diner: { bpm: 126, ch: [{ ins: 'organ', n: 'C4 E4 G4 A4 G4 E4 C4 E4 A3 C4 E4 F4 E4 C4 A3 C4 F3 A3 C4 D4 C4 A3 F3 A3 G3 B3 D4 F4 D4 B3 G3 B3' }, { ins: 'bass', vol: .72, n: 'C2 . E2 . G2 . A2 . A1 . C2 . E2 . G2 . F1 . A1 . C2 . D2 . G1 . B1 . D2 . F2 .' }, { ins: 'sax', n: 'G5 - - E5 - - C5 - . . . . . . . . A4 - C5 - D5 - E5 - D5 - - - B4 - - -' }, { drum: 1, vol: .6, n: 'k . h . s . h . k . h . s . h h' }] },
  road: { bpm: 146, ch: [
    { ins: 'brass', n: 'A4 - C5 - E5 - D5 C5 - - A4 - G4 - A4 - . . . . . . . . . . . . . . . . F4 - A4 - C5 - B4 A4 - - F4 - E4 - F4 - G4 - B4 - D5 - C5 B4 - - A4 - - - - -' },
    { ins: 'slap', n: 'A1 A2 . A1 A2 . A1 A2 A1 A2 . A1 G2 . E2 . F1 F2 . F1 F2 . F1 F2 G1 G2 . G1 B2 . D2 . F1 F2 . F1 F2 . F1 F2 F1 F2 . F1 F2 . F1 F2 G1 G2 . G1 B2 . D2 . A1 A2 . A1 G2 . E2 .' },
    { ins: 'epiano', n: 'A3 C4 E4 A4 E4 C4 A3 C4 A3 C4 E4 A4 E4 C4 A3 C4 F3 A3 C4 F4 C4 A3 F3 A3 G3 B3 D4 G4 D4 B3 G3 B3 F3 A3 C4 F4 C4 A3 F3 A3 F3 A3 C4 F4 C4 A3 F3 A3 G3 B3 D4 G4 D4 B3 G3 B3 A3 C4 E4 A4 E4 C4 A3 C4' },
    { drum: 1, n: 'k . h k s . h . k k h . s . h o' }] },
  lake: { bpm: 104, ch: [
    { ins: 'epiano', vol: 0.9, n: [
      'E5 - - - B4 - G4 - A4 - B4 - G4 - - -',
      'E5 - - - G5 - E5 - D5 - C5 - E5 - - -',
      'D5 - - - B4 - G4 - A4 - B4 - D5 - - -',
      'F#5 - E5 - D5 - - - A4 - F#4 - A4 - - -',
      'E5 - C5 - A4 - - - C5 - E5 - G5 - - -',
      'G5 - E5 - C5 - - - D5 - E5 - G5 - - -',
      'F#5 - D#5 - B4 - - - A4 - F#4 - D#5 - - -',
      'E5 - - - G5 - F#5 - E5 - B4 - E5 - - -'
    ].join(' ') },
    { ins: 'bell', vol: 0.35, n: [
      'E4 . . B4 . . G4 . E4 . . B4 . . G4 .',
      'C4 . . G4 . . E4 . C4 . . G4 . . E4 .',
      'G4 . . D5 . . B4 . G4 . . D5 . . B4 .',
      'D4 . . A4 . . F#4 . D4 . . A4 . . F#4 .',
      'A3 . . E4 . . C4 . A3 . . E4 . . C4 .',
      'C4 . . G4 . . E4 . C4 . . G4 . . E4 .',
      'B3 . . F#4 . . D#4 . B3 . . F#4 . . D#4 .',
      'E4 . . B4 . . B4 . E4 . . B4 . . G4 .'
    ].join(' ') },
    { ins: 'bass', vol: 0.65, n: [
      'E2 - - - . . . . B1 - - - . . . .',
      'C2 - - - . . . . G1 - - - . . . .',
      'G2 - - - . . . . D2 - - - . . . .',
      'D2 - - - . . . . A1 - - - . . . .',
      'A1 - - - . . . . E2 - - - . . . .',
      'C2 - - - . . . . G1 - - - . . . .',
      'B1 - - - . . . . F#2 - - - . . . .',
      'E2 - - - . . . . B1 - - - . . . .'
    ].join(' ') },
    { drum: 1, vol: 0.45, n: [
      'k . h . . . h . s . h . . . o .',
      'k . h . . . h . s . h . k . h .',
      'k . h . . . h . s . h . . . o .',
      'k . h . . . h . s . h . k . h o',
      'k . h . . . h . s . h . . . o .',
      'k . h . . . h . s . h . k . h .',
      'k . h . . . h . s . h . . . o .',
      'k . h . . . h . s . h . k . h o'
    ].join(' ') }
  ] },
  backlot: { bpm: 132, ch: [{ ins: 'sax', n: 'F4 - A4 - C5 - D5 - C5 - A4 - F4 - - - G4 - A#4 - D5 - F5 - E5 - D5 - C5 - - -' }, { ins: 'organ', n: 'F3 A3 C4 A3 F3 A3 C4 A3 F3 A3 C4 A3 F3 A3 C4 A3 G3 A#3 D4 A#3 G3 A#3 D4 A#3 C3 E3 G3 E3 C3 E3 G3 E3' }, { ins: 'bass', vol: .72, n: 'F2 . A2 . C3 . A2 . F2 . A2 . C3 . A2 . G2 . A#2 . D3 . A#2 . C2 . E2 . G2 . E2 .' }, { drum: 1, vol: .6, n: 'k . h . s . h k k . h . s . h h' }] },
  xover: { bpm: 128, ch: [
    { ins: 'organ', vol: 0.7, n: [
      'E4 . B3 . G4 - B3 . F#4 . B3 . E4 - . .',
      'E4 . G4 . C5 - G4 . E4 . D4 . C4 - . .',
      'E4 . A4 . C5 - A4 . B4 . A4 . E4 - . .',
      'F#4 . B3 . D#4 - F#4 . A4 . F#4 . D#4 - . .',
      'B4 - G4 . E4 . B3 . G4 . B4 . E5 - . .',
      'A4 . F#4 . D4 - A3 . F#4 . E4 . D4 - . .',
      'G4 - E4 . C4 . G3 . E4 . G4 . C5 - . .',
      'A4 . F#4 . D#4 - B3 . F#4 . D#4 . E4 - . .'
    ].join(' ') },
    { ins: 'bell', vol: 0.38, n: [
      '. . B4 . . . . . . . G4 . . . . .',
      '. . G4 . . . . . . . E4 . . . . .',
      '. . E4 . . . . . . . C4 . . . . .',
      '. . F#4 . . . . . . . D#4 . . . . .',
      '. . B4 . . . . . . . G4 . . . . .',
      '. . A4 . . . . . . . F#4 . . . . .',
      '. . G4 . . . . . . . E4 . . . . .',
      '. . F#4 . . . . . . . D#4 . . . . .'
    ].join(' ') },
    { ins: 'bass', vol: 0.68, n: [
      'E2 . . . . . B1 . E2 . . . . . B1 .',
      'C2 . . . . . G1 . C2 . . . . . G1 .',
      'A1 . . . . . E2 . A1 . . . . . E2 .',
      'B1 . . . . . F#2 . B1 . . . . . F#2 .',
      'E2 . . . . . B1 . E2 . . . . . B1 .',
      'D2 . . . . . A1 . D2 . . . . . A1 .',
      'C2 . . . . . G1 . C2 . . . . . G1 .',
      'B1 . . . . . F#2 . B1 . . . . . F#2 .'
    ].join(' ') },
    { drum: 1, vol: 0.56, n: [
      'k . h . s . . . k . h . s . h .',
      'k . h . s . h . k k h . s . . .',
      'k . h . s . . . k . h . s . h .',
      'k . h . s . . . k . h k s . s o',
      'k . h . s . . . k . h . s . h .',
      'k . h . s . h . k k h . s . . .',
      'k . h . s . . . k . h . s . h .',
      'k . h . s . . . k . h k s . s o'
    ].join(' ') }
  ] },
  space: { bpm: 152, ch: [{ ins: 'brass', n: 'D5 - - A4 - - D5 - E5 - F5 - E5 - D5 - C5 - - A4 - - C5 - D5 - E5 - D5 - - - F5 - - E5 - - D5 - C5 - A#4 - A4 - G4 - A4 - - - - - - - - - - - - - - -' }, { ins: 'slap', n: 'D2 D3 . D2 . D2 D3 . A#1 A#2 . A#1 . G1 G2 . C2 C3 . C2 . C2 C3 . A1 A2 . A1 C2 . E2 .' }, { ins: 'pad', vol: .6, n: 'D4 - - - - - - - D4 - - - - - - - E4 - - - - - - - E4 - - - - - - -' }, { drum: 1, n: 'k . h . s . h k k . h k s . h o' }] },
  moon: { bpm: 84, ch: [{ ins: 'brass', n: 'D4 - - - D4 - F4 - A4 - - - G4 - F4 - E4 - - - C4 - E4 - G4 - - - F4 - E4 - D4 - - - A3 - D4 - F4 - - - E4 - D4 - C#4 - - - - - - - D4 - - - - - - -' }, { ins: 'bass', n: 'D2 . . . A1 . . . C2 . . . G1 . . . A#1 . . . F1 . . . A1 . . . A1 . . .' }, { drum: 1, vol: .7, n: 'k . . . s . . . k . k . s . . .' }] },
  facility: { bpm: 64, ch: [{ ins: 'pad', n: 'C3 - - - - - - - C#3 - - - - - - -' }, { ins: 'bell', n: 'G5 . . . . . . . . . . . F#5 . . . . . . . . . . . . . . . . . . .' }, { ins: 'bass', vol: .8, n: 'C1 . . . . . . . . . . . . . . . C#1 . . . . . . . . . . . . . . .' }] },
  below: { bpm: 60, ch: [{ ins: 'epiano', n: 'A3 C4 E4 . G3 B3 D4 . F3 A3 C4 . E3 G#3 B3 .' }, { ins: 'pad', vol: .7, n: 'A3 - - - G3 - - - F3 - - - E3 - - -' }, { ins: 'bell', n: 'E5 . . . . . . . D5 . . . . . . . C5 . . . . . . . B4 . . . . . . .' }] },
  human: { bpm: 158, ch: [
    { ins: 'brass', vol: 0.84, n: [
      'A4 - - - E5 - - - D5 - C5 - B4 - A4 -',
      'C5 - A4 . F5 - D5 C5 A4 . G4 . F4 - . .',
      'E5 . G5 C6 G5 - E5 D5 C5 . G4 . E5 - . .',
      'D5 . B4 D5 G5 - F5 D5 B4 . A4 . G4 - . .',
      'A4 . D5 . F5 - E5 D5 A4 - F4 . D5 - . .',
      'C5 - A4 . F5 . G5 A5 G5 . F5 D5 C5 - . .',
      'B4 . G#4 B4 E5 - D5 . B4 . G#4 . E5 - . .',
      'A5 - E5 . C5 . B4 A4 E5 . C5 . A4 - . .'
    ].join(' ') },
    { ins: 'guitar', vol: 0.82, n: [
      'A3 A3 . A3 C4 . A3 . A3 . E4 A3 E4 . A3 .',
      'F3 F3 . F3 C4 . F3 . F3 . C4 F3 C4 . F3 .',
      'C3 C3 . C3 G3 . C3 . C3 . G3 C3 G3 . C3 .',
      'G3 G3 . G3 D4 . G3 . G3 . D4 G3 D4 . G3 .',
      'D3 D3 . D3 A3 . D3 . D3 . A3 D3 A3 . D3 .',
      'F3 F3 . F3 C4 . F3 . F3 . C4 F3 C4 . F3 .',
      'E3 E3 . E3 B3 . E3 . E3 . B3 E3 B3 . E3 .',
      'A2 A2 . A2 E3 . A2 . A2 . E3 A2 E3 . A2 .'
    ].join(' ') },
    { ins: 'bass', vol: 0.76, n: [
      'A1 . A1 A1 . E2 A1 . A1 . A1 E2 . . A1 .',
      'F1 . F1 F1 . C2 F1 . F1 . F1 C2 . . F1 .',
      'C2 . C2 C2 . G1 C2 . C2 . C2 G1 . . C2 .',
      'G2 . G2 G2 . D2 G2 . G2 . G2 D2 . . G2 .',
      'D2 . D2 D2 . A1 D2 . D2 . D2 A1 . . D2 .',
      'F1 . F1 F1 . C2 F1 . F1 . F1 C2 . . F1 .',
      'E2 . E2 E2 . B1 E2 . E2 . E2 B1 . . E2 .',
      'A1 . A1 A1 . E2 A1 . A1 . A1 E2 . . A1 .'
    ].join(' ') },
    { ins: 'bell', vol: 0.23, n: [
      '. . . . E4 . . . . . . . A4 . . .',
      '. . . . C5 . . . . . . . A4 . . .',
      '. . . . G4 . . . . . . . E4 . . .',
      '. . . . D5 . . . . . . . B4 . . .',
      '. . . . A4 . . . . . . . F4 . . .',
      '. . . . C5 . . . . . . . A4 . . .',
      '. . . . B4 . . . . . . . G#4 . . .',
      '. . . . E4 . . . . . . . C4 . . .'
    ].join(' ') },
    { drum: 1, vol: 0.8, n: [
      'k k h . s . h k k . h . s . h o',
      'k . h k s . h . k k h . s . h h',
      'k k h . s . h k k . h . s . h o',
      'k . h k s . h . k k s h s s h o',
      'k k h . s . h k k . h . s . h o',
      'k . h k s . h . k k h . s . h h',
      'k k h . s . h k k . h . s . h o',
      'k . h k s . h . k k s h s s h o'
    ].join(' ') }
  ] },
  boogaloo: { bpm: 112, ch: [
    { ins: 'slap', n: 'E2 . E3 . . E2 G2 . A2 . . A2 G2 . E2 D2 E2 . E3 . . E2 G2 . B2 . A2 . G2 . E2 .' },
    { ins: 'organ', n: '. . E4 . . . E4 . . . D4 . . . D4 . . . E4 . . . E4 . . . G4 . A4 . . .' },
    { ins: 'brass', n: 'B4 . . . D5 . E5 . . . . . D5 . B4 . A4 . . . G4 . A4 . B4 - - - - - - -' },
    { drum: 1, n: 'k . h . s . h k . k h . s . h o' }] },
  credits: { bpm: 108, ch: [
    { ins: 'sax', vol: 0.75, n: [
      'G4 - B4 - D5 - G5 - D5 - B4 - A4 - G4 -',
      'F#4 - A4 - D5 - F#5 - E5 - D5 - A4 - - -',
      'C5 - E5 - G5 - E5 - D5 - C5 - G4 - - -',
      'B4 - D5 - E5 - G5 - D5 - B4 - G4 - - -',
      'C5 - E5 - A5 - E5 - D5 - C5 - A4 - - -',
      'F#5 - E5 - D5 - A4 - B4 - A4 - F#4 - - -',
      'E5 - G5 - E5 - D5 - C5 - E5 - G4 - - -',
      'B4 - A4 - G4 - - - D5 - B4 - G4 - - -'
    ].join(' ') },
    { ins: 'epiano', vol: 0.5, n: [
      'G3 . B3 . D4 - . . B3 . D4 . G4 - . .',
      'D3 . F#3 . A3 - . . F#3 . A3 . D4 - . .',
      'C3 . E3 . G3 - . . E3 . G3 . C4 - . .',
      'G3 . B3 . D4 - . . B3 . D4 . G4 - . .',
      'A2 . C3 . E3 - . . C3 . E3 . A3 - . .',
      'D3 . F#3 . A3 - . . F#3 . A3 . D4 - . .',
      'C3 . E3 . G3 - . . E3 . G3 . C4 - . .',
      'G3 . B3 . D4 - . . B3 . D4 . G4 - . .'
    ].join(' ') },
    { ins: 'bass', vol: 0.64, n: [
      'G2 . . . . . D2 . G2 . . . . . D2 .',
      'D2 . . . . . A1 . D2 . . . . . A1 .',
      'C2 . . . . . G1 . C2 . . . . . G1 .',
      'G2 . . . . . D2 . G2 . . . . . D2 .',
      'A1 . . . . . E2 . A1 . . . . . E2 .',
      'D2 . . . . . A1 . D2 . . . . . A1 .',
      'C2 . . . . . G1 . C2 . . . . . G1 .',
      'G2 . . . . . D2 . G2 . . . . . D2 .'
    ].join(' ') },
    { drum: 1, vol: 0.45, n: [
      'k . . h s . h . k . . h s . h .',
      'k . h . s . h . k . h . s . h .',
      'k . . h s . h . k . . h s . h .',
      'k . . h s . h . k . h . s . h o',
      'k . . h s . h . k . . h s . h .',
      'k . h . s . h . k . h . s . h .',
      'k . . h s . h . k . . h s . h .',
      'k . . h s . h . k . h . s . h o'
    ].join(' ') }
  ] },
  canceled: { bpm: 60, ch: [{ ins: 'epiano', n: 'E4 . . . D4 . . . C4 . . . . . . . E4 . . . G4 . . . D4 . . . . . . .' }, { ins: 'pad', vol: .6, n: 'C4 - - - - - - - G3 - - - - - - -' }] },
  walkout: { bpm: 88, ch: [{ ins: 'lead', n: 'D4 - - E4 F#4 - - - A4 - - - G4 - F#4 - E4 - - - - - D4 - E4 - F#4 - - - - - A4 - - B4 C#5 - - - D5 - - - C#5 - B4 - A4 - - - - - - - - - - - - - - -' }, { ins: 'pad', n: 'D4 - - - - - - - B3 - - - - - - - G3 - - - - - - - A3 - - - - - - - A3 - - - - - - - D4 - - - - - - - D4 - - - - - - - A3 - - - - - - -' }, { ins: 'bass', n: 'D2 . . . . . . . B1 . . . . . . . G1 . . . . . . . A1 . . . . . . . A1 . . . . . . . D2 . . . . . . . D2 . . . . . . . A1 . . . . . . .' }] },
});
