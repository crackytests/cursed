'use strict';
// ================= CHROME FORCE -- the score: Genesis FM metal meets chromewave =================
// Every melody is the 1993 one; around it: doubled FM guitars hard left/right, slap/octave bass, supersaw pads pumping off the kick,
// square-wave arps into the ping-pong echo, chrome bell doubles an octave up, gated snares, tom fills and a crash on every loop.
PATCH.dist = { ratio: 1, index: 6.5, mdecay: .7, a: .005, d: .35, s: .75, vol: .4 };
PATCH.chug = { ratio: 1, index: 7, mdecay: .08, d: .07, s: .05, vol: .7 };
LEGACY_WAVE.dist = 'p25'; LEGACY_WAVE.chug = 'p50';
FM_TONE = { low: 2.5, high: 2, room: .1, gain: 1 };
const mS = list => list.map(([n, k]) => n === '.' ? Array(k).fill('.').join(' ') : [n].concat(Array(k - 1).fill('-')).join(' ')).join(' ');
const mG = (n, beats) => Array(beats).fill(n + ' . ' + n + ' ' + n).join(' '); // the gallop
const mRep = (s, n) => Array(n).fill(s.trim()).join(' ');
const xT = (s, semi) => s.split(/\s+/).map(t => t === '.' || t === '-' ? t : t.split('+').map(k => xName(xMidi(k) + semi)).join('+')).join(' '); // transpose
const xDr = (bars, groove, fill) => { const b = xBars(bars, groove, fill).split(' '); b[0] += '+C'; return b.join(' '); }; // crash on the downbeat of every loop

// drum grooves, one bar (16 steps) each
const DRV = 'k . h . s . h k k . h . s . h h', FILL = 'k . h . s . h . k . s s t t m l', ROLL = 's s s s t t t t m m m m l l l l';
const BLAST = 'k k s k k k s k k k s k k s s s', BALLAD = 'k . . h s . . h k . k h s . h o', MARCH = 'k . s s k . s . k . s s k . s s';
const HALF = 'k . h . h . h . s . h . h . h k', TRAP = 'k . . k s . . . k . k . s . c c';

// harmony per track ([root, quality, beats])
const HARM = {
  title: [['E3', 'm9', 8], ['C3', 'add9', 4], ['D3', 'add9', 4]],
  battle: [['E3', 'm', 4], ['F3', 'M', 2], ['E3', 'm', 2], ['G3', 'M', 2], ['F3', 'M', 2], ['E3', 'm', 4]],
  battle2: [['D3', 'm', 4], ['A#2', 'M', 4], ['C3', 'M', 4], ['A2', 'M', 4]],
  battle3: [['E3', 'm', 8], ['C3', 'M', 4], ['D3', 'M', 4]],
  battle4: [['C#3', 'm', 4], ['D3', 'M', 4], ['C#3', 'm', 4], ['G3', 'M', 2], ['F#3', 'M', 2]],
  boss: [['E3', 'm', 2], ['G3', 'M', 2], ['A#2', 'M', 2], ['A2', 'M', 2], ['E3', 'm', 2], ['G3', 'M', 2], ['A#2', 'M', 2], ['A2', 'M', 2]],
  final: [['D3', 'm', 4], ['F3', 'M', 2], ['G3', 'M', 2], ['D3', 'm', 4], ['A#2', 'M', 2], ['A2', 'M', 2]],
  town: [['G3', 'add9', 2], ['C3', 'M7', 2], ['D3', 'add9', 2], ['G3', 'M', 2], ['E3', 'm7', 2], ['C3', 'M7', 2], ['D3', 's4', 2], ['G3', 'M', 2]],
  town2: [['A2', 'm7', 4], ['F2', 'M7', 4], ['C3', 'add9', 4], ['G2', 'M', 4]],
  town3: [['D3', 'm', 8], ['A#2', 'M', 4], ['A2', 'M', 4]],
  town4: [['E3', 'm9', 4], ['C3', 'M7', 4], ['A2', 'm7', 4], ['B2', 'M', 4]],
  route: [['E3', 'm', 8], ['C3', 'M', 2], ['D3', 'M', 2], ['C3', 'M', 2], ['D3', 'M', 2]],
  prologue: [['E3', 'm9', 4], ['C3', 'M7', 4], ['G2', 'add9', 4], ['B2', 'm', 4]],
  victory: [['E3', 'm', 4], ['C3', 'M', 2], ['D3', 'M', 2]],
  ending: [['E3', 'm9', 4], ['C3', 'add9', 4], ['D3', 'add9', 4], ['B2', 'M', 4]],
};
const PAD = (h, o = {}) => Object.assign({ ins: 'pad', duck: .65, rev: .45, n: xPad(h) }, o);
const ARP = (h, o = {}) => Object.assign({ ins: 'arp', pan: .45, dly: .35, rev: .15, duck: .3, n: xArp(h, o.shape) }, o);
const OCT = (h, o = {}) => Object.assign({ ins: 'fmbass', n: xOct(h) }, o);
const GTR = (line, side, o = {}) => Object.assign({ ins: 'palm', pan: .75 * side, det: 7 * side, n: line }, o);

const TITLE_MEL = mS([['E4', 12], ['G4', 4], ['F#4', 8], ['D4', 8], ['E4', 16], ['.', 16]]);
const BATTLE_MEL = mS([['E4', 2], ['B4', 2], ['E5', 4], ['D5', 2], ['C5', 2], ['B4', 4], ['A4', 2], ['B4', 2], ['C5', 4], ['B4', 8], ['E4', 2], ['F4', 2], ['G4', 4], ['A4', 2], ['G4', 2], ['F4', 4], ['E4', 16]]);
const BATTLE2_MEL = mS([['D5', 4], ['A4', 4], ['F4', 4], ['D4', 4], ['A#4', 8], ['A4', 8], ['G4', 4], ['A4', 4], ['C5', 8], ['A4', 16]]);
const BATTLE3_MEL = mS([['B4', 8], ['E5', 8], ['D5', 4], ['C5', 4], ['B4', 8], ['.', 8], ['A4', 8], ['C5', 8], ['D5', 8]]);
const BOSS_MEL = mS([['E5', 2], ['D#5', 2], ['E5', 2], ['B4', 2], ['G4', 2], ['A#4', 2], ['A4', 4], ['E5', 2], ['D#5', 2], ['E5', 2], ['B4', 2], ['A#4', 2], ['A4', 2], ['G4', 4], ['E4', 2], ['F4', 2], ['G4', 2], ['A#4', 2], ['B4', 4], ['E5', 4], ['D5', 4], ['A#4', 4], ['B4', 8]]);
const FINAL_MEL = mS([['D5', 4], ['F5', 4], ['G5', 4], ['A5', 4], ['A#5', 8], ['A5', 4], ['G5', 4], ['F5', 4], ['E5', 4], ['D5', 4], ['C#5', 4], ['D5', 16]]);
const TOWN_MEL = mS([['G4', 2], ['B4', 2], ['D5', 2], ['B4', 2], ['C5', 2], ['E5', 2], ['G5', 4], ['F#5', 2], ['D5', 2], ['A4', 4], ['B4', 8], ['A4', 2], ['G4', 2], ['F#4', 2], ['G4', 2], ['A4', 4], ['B4', 4], ['C5', 2], ['B4', 2], ['A4', 4], ['G4', 8]]);
const ROUTE_MEL = mS([['E4', 4], ['E4', 2], ['G4', 2], ['B4', 8], ['A4', 4], ['G4', 2], ['F#4', 2], ['E4', 8], ['G4', 4], ['A4', 4], ['B4', 4], ['D5', 4], ['C5', 8], ['B4', 8]]);
const ENDING_MEL = mS([['B4', 8], ['E5', 8], ['G5', 12], ['F#5', 4], ['E5', 8], ['D5', 8], ['D#5', 16]]);

Object.assign(TRACKS, {
  title: { bpm: 116, ch: [
    PAD(HARM.title), ARP(HARM.title, { shape: [0, 2, 4, 2, 1, 3, 5, 3] }), OCT(HARM.title),
    GTR(mG('E2', 8) + ' ' + mG('C2', 4) + ' ' + mG('D2', 4), -1, { vol: .8 }), GTR(mG('B2', 8) + ' ' + mG('G2', 4) + ' ' + mG('A2', 4), 1, { vol: .7 }),
    { ins: 'saw', dly: .3, rev: .3, n: TITLE_MEL }, { ins: 'chrome', pan: -.3, dly: .25, rev: .2, vol: .7, n: xT(TITLE_MEL, 12) },
    { ins: 'gtr', pan: .3, det: 6, vol: .8, n: mS([['G4', 12], ['B4', 4], ['A4', 8], ['F#4', 8], ['G4', 16], ['.', 16]]) },
    { drum: 1, n: xDr(4, DRV, FILL) }] },
  battle: { bpm: 152, ch: [
    GTR([mG('E2', 4), mG('F2', 2), mG('E2', 2), mG('G2', 2), mG('F2', 2), mG('E2', 4)].join(' '), -1),
    GTR([mG('B2', 4), mG('C3', 2), mG('B2', 2), mG('D3', 2), mG('C3', 2), mG('B2', 4)].join(' '), 1, { vol: .8 }),
    OCT(HARM.battle, { ins: 'slap' }), PAD(HARM.battle, { vol: .8 }), ARP(HARM.battle, { pan: -.4, vol: .8 }),
    { ins: 'gtr', pan: -.12, n: BATTLE_MEL }, { ins: 'chrome', pan: .25, dly: .3, rev: .2, vol: .6, n: xT(BATTLE_MEL, 12) },
    { drum: 1, n: xDr(4, 'k k s k k k s . k k s k k s s s', 's s s s t t m m l l l l k+x . . .') }] },
  battle2: { bpm: 140, ch: [
    GTR([mG('D2', 4), mG('A#1', 4), mG('C2', 4), mG('A1', 4)].join(' '), -1), GTR([mG('A2', 4), mG('F2', 4), mG('G2', 4), mG('E2', 4)].join(' '), 1, { vol: .8 }),
    OCT(HARM.battle2), PAD(HARM.battle2), ARP(HARM.battle2, { shape: [0, 1, 2, 1, 3, 2, 1, 2] }),
    { ins: 'saw', dly: .25, rev: .25, n: BATTLE2_MEL }, { ins: 'bellx', pan: -.35, dly: .3, vol: .6, n: xT(BATTLE2_MEL, 12) },
    { drum: 1, n: xDr(4, 'k . s k . k s . k . s k k . s s', FILL) }] },
  battle3: { bpm: 160, ch: [
    { ins: 'arp', pan: .45, dly: .3, duck: .3, n: [mRep('B3 E4 G4 B4 E5 B4 G4 E4', 4), mRep('C4 E4 A4 C5 E5 C5 A4 E4', 2), mRep('D4 F#4 A4 D5 F#5 D5 A4 F#4', 2)].join(' ') },
    GTR([mG('E2', 8), mG('C2', 4), mG('D2', 4)].join(' '), -1), GTR([mG('B2', 8), mG('G2', 4), mG('A2', 4)].join(' '), 1, { vol: .7 }),
    OCT(HARM.battle3, { ins: 'slap' }), PAD(HARM.battle3),
    { ins: 'gtr', pan: -.1, n: BATTLE3_MEL }, { ins: 'saw', pan: .2, dly: .35, rev: .3, vol: .7, n: xT(BATTLE3_MEL, 12) },
    { drum: 1, n: xDr(4, 'k h s h k k s h k h s h k k s h', 'k h s h k k s h t t m m l l k+x .') }] },
  battle4: { bpm: 132, ch: [
    GTR([mG('C#2', 4), mG('D2', 4), mG('C#2', 4), mG('G2', 2), mG('F#2', 2)].join(' '), -1), GTR([mG('G#2', 4), mG('A2', 4), mG('G#2', 4), mG('D3', 2), mG('C#3', 2)].join(' '), 1, { vol: .6 }),
    OCT(HARM.battle4), PAD(HARM.battle4, { vol: 1.1 }),
    { ins: 'bellx', pan: .4, dly: .45, rev: .3, n: mS([['C#5', 4], ['.', 4], ['D5', 4], ['.', 4], ['C#5', 4], ['G4', 4], ['G#4', 8], ['.', 32]]) },
    { ins: 'saw', dly: .3, rev: .3, n: mS([['.', 32], ['C#4', 4], ['E4', 4], ['G4', 8], ['F#4', 8], ['C#4', 8]]) },
    { drum: 1, n: xDr(4, 'k . . k s . . . k . k . s . h h', 'k . . k s . . . t . m . l . l l') }] },
  boss: { bpm: 168, ch: [
    GTR(mRep([mG('E2', 2), mG('G2', 2), mG('A#2', 2), mG('A2', 2)].join(' '), 2), -1), GTR(mRep([mG('B2', 2), mG('D3', 2), mG('F3', 2), mG('E3', 2)].join(' '), 2), 1, { vol: .8 }),
    OCT(HARM.boss, { ins: 'slap' }), PAD(HARM.boss, { duck: .8 }), ARP(HARM.boss, { shape: [0, 3, 1, 3, 2, 3, 1, 3], pan: .5 }),
    { ins: 'gtr', pan: -.1, n: BOSS_MEL }, { ins: 'gtr', pan: .1, det: 9, vol: .7, n: xT(BOSS_MEL, -12) }, { ins: 'chrome', pan: .35, dly: .2, rev: .2, vol: .45, n: xT(BOSS_MEL, 12) },
    { drum: 1, n: xDr(4, BLAST, 'k k s k k k s k t t m m l l x .') }] },
  final: { bpm: 176, ch: [
    GTR([mG('D2', 4), mG('F2', 2), mG('G2', 2), mG('D2', 4), mG('A#2', 2), mG('A2', 2)].join(' '), -1), GTR([mG('A2', 4), mG('C3', 2), mG('D3', 2), mG('A2', 4), mG('F3', 2), mG('E3', 2)].join(' '), 1, { vol: .8 }),
    OCT(HARM.final, { ins: 'slap' }), PAD(HARM.final, { duck: .7, vol: 1.2 }), ARP(HARM.final, { shape: [0, 1, 2, 3, 4, 3, 2, 1] }),
    { ins: 'brassx', pan: -.35, rev: .3, vol: .8, n: mS([['D4', 16], ['A#3', 16], ['C4', 16], ['A3', 16]]) },
    { ins: 'saw', dly: .25, rev: .3, n: FINAL_MEL }, { ins: 'gtr', pan: .2, n: FINAL_MEL }, { ins: 'chrome', pan: .4, dly: .2, vol: .5, n: xT(FINAL_MEL, 12) },
    { drum: 1, n: xDr(4, 'k k s k k k s k k k s k k k s x', ROLL) }] },
  town: { bpm: 100, ch: [
    { ins: 'epx', pan: -.2, rev: .25, dly: .15, n: TOWN_MEL }, { ins: 'bellx', pan: .4, dly: .35, vol: .45, n: xT(TOWN_MEL, 12) },
    PAD(HARM.town, { duck: .35, vol: .8 }), { ins: 'fmbass', vol: .8, n: xPulse(HARM.town) },
    { ins: 'psg', pan: .5, dly: .3, vol: .7, n: xArp(HARM.town, [0, '.', 1, '.', 2, '.', 1, '.']) },
    { drum: 1, vol: .7, n: xDr(4, 'k . h . s . h . k . h k s . h .', 'k . h . s . h . k . h k s . c c') }] },
  town2: { bpm: 92, ch: [
    { ins: 'arp', pan: .4, dly: .35, duck: .3, n: [mRep('A3 C4 E4 A4', 4), mRep('F3 A3 C4 F4', 4), mRep('C4 E4 G4 C5', 4), mRep('G3 B3 D4 G4', 4)].join(' ') },
    { ins: 'bellx', pan: -.3, dly: .4, rev: .3, vol: .8, n: mS([['E5', 8], ['C5', 8], ['A5', 16], ['G5', 8], ['E5', 8], ['D5', 16]]) },
    PAD(HARM.town2, { vol: .9 }), OCT(HARM.town2, { vol: .7 }),
    { drum: 1, vol: .6, n: xDr(4, 'k . h h s . h . k . h h s . h .', 'k . h h s . h . k . h h s . t m') }] },
  town3: { bpm: 84, ch: [
    { ins: 'chrome', pan: -.2, rev: .4, dly: .25, n: mS([['D4', 8], ['F4', 8], ['A4', 8], ['G#4', 8], ['D4', 8], ['F4', 8], ['E4', 16]]) },
    PAD(HARM.town3, { duck: .2, vol: 1.2, rev: .6 }),
    { ins: 'bellx', pan: .4, dly: .5, rev: .4, vol: .7, n: mS([['.', 12], ['A5', 4], ['.', 12], ['G#5', 4], ['.', 12], ['F5', 4], ['.', 12], ['E5', 4]]) },
    { ins: 'fmbass', vol: .6, n: mS([['D2', 32], ['A#1', 16], ['A1', 16]]) },
    { drum: 1, vol: .45, n: mRep('k . . . . . h . s . . . . . h .', 4) }] },
  town4: { bpm: 108, ch: [
    { ins: 'epx', pan: -.3, rev: .2, n: [mRep('E4 G4 B4 G4', 4), mRep('C4 E4 G4 E4', 4), mRep('A3 C4 E4 C4', 4), mRep('B3 D#4 F#4 D#4', 4)].join(' ') },
    { ins: 'saw', dly: .4, rev: .35, vol: .8, n: mS([['B5', 16], ['G5', 16], ['E5', 16], ['F#5', 16]]) },
    PAD(HARM.town4), OCT(HARM.town4, { vol: .75 }),
    { drum: 1, vol: .65, n: xDr(4, BALLAD, 'k . . h s . . h k . k h t m l l') }] },
  route: { bpm: 120, ch: [
    { ins: 'brassx', pan: -.15, rev: .25, dly: .15, n: ROUTE_MEL }, { ins: 'saw', pan: .25, vol: .55, dly: .3, n: xT(ROUTE_MEL, 12) },
    { ins: 'slap', n: [mRep('E2 . E2 . B1 . B1 .', 4), mRep('C2 . C2 . D2 . D2 .', 4)].join(' ') },
    PAD(HARM.route), ARP(HARM.route, { shape: [0, 2, 1, 2] }),
    { drum: 1, n: xDr(4, MARCH, 'k . s s k . s . t t m m l l k+x .') }] },
  prologue: { bpm: 66, ch: [
    PAD(HARM.prologue, { duck: 0, vol: 1.3, rev: .7 }),
    { ins: 'bellx', dly: .5, rev: .5, n: mS([['B4', 8], ['G4', 8], ['E5', 16], ['D5', 8], ['B4', 8], ['F#4', 16]]) },
    { ins: 'fmbass', vol: .5, n: mS([['E2', 16], ['C2', 16], ['G1', 16], ['B1', 16]]) }] },
  victory: { bpm: 140, ch: [
    { ins: 'brassx', rev: .3, n: mS([['E4', 2], ['G4', 2], ['B4', 2], ['E5', 6], ['D5', 2], ['E5', 2], ['G5', 8], ['.', 8]]) },
    { ins: 'chrome', pan: .35, dly: .3, vol: .6, n: mS([['E5', 2], ['G5', 2], ['B5', 2], ['E6', 6], ['D6', 2], ['E6', 2], ['G6', 8], ['.', 8]]) },
    GTR([mG('E2', 4), mG('C2', 2), mG('D2', 2)].join(' '), -1), GTR([mG('B2', 4), mG('G2', 2), mG('A2', 2)].join(' '), 1, { vol: .7 }), PAD(HARM.victory),
    { drum: 1, n: 'x+C . . . k . s . k k s . x . . . k . s . k k s . x . . . x . x .' }] },
  defeat: { bpm: 70, ch: [{ ins: 'chrome', rev: .5, dly: .3, n: mS([['E4', 8], ['D#4', 8], ['D4', 8], ['C#4', 8]]) }, { ins: 'pad', rev: .7, vol: 1.3, n: mS([['E3+B3', 32]]) }] },
  ending: { bpm: 88, ch: [
    { ins: 'epx', pan: -.3, rev: .25, n: [mRep('E4 G4 B4 E5', 4), mRep('C4 E4 G4 C5', 4), mRep('D4 F#4 A4 D5', 4), mRep('B3 D#4 F#4 B4', 4)].join(' ') },
    { ins: 'saw', dly: .4, rev: .4, n: ENDING_MEL }, { ins: 'gtr', pan: .3, vol: .6, n: ENDING_MEL },
    PAD(HARM.ending, { duck: .5 }), OCT(HARM.ending, { vol: .75 }),
    { drum: 1, vol: .75, n: xDr(4, BALLAD, 'k . . h s . . h t t m m l l s s') }] },
});
