'use strict';
// ================= SPOOKY GHOST 2: music. built from chords, so nothing ever clashes =================
// every voice plays only tones of the chord that is sounding: bass on root/fifth, arp on the triad, lead on chord tones.
// lead/arp tokens are chord degrees: 0 root, 1 third, 2 fifth, 3 root an octave up, 4 third an octave up. '-' holds, '.' rests.
const NMS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nameOf = m => NMS[m % 12] + (Math.floor(m / 12) - 1);
function genTrack(o) {
  const semis = c => c[1] === 'm' ? [0, 3, 7, 12, 15] : [0, 4, 7, 12, 16];
  const rm = (r, oct) => NOTE[r] + (oct + 1) * 12;
  const deg = (c, oct, t) => /^\d$/.test(t) ? nameOf(rm(c[0], oct) + semis(c)[+t]) : t;
  const ch = [];
  if (o.lead) ch.push({ ins: o.leadIns || 'lead', vol: o.leadVol || .55, n: o.prog.map((c, i) => o.lead[i % o.lead.length].split(' ').map(t => deg(c, o.leadOct || 4, t)).join(' ')).join(' ') });
  if (o.arp) ch.push({ ins: o.arpIns || 'epiano', vol: o.arpVol || .5, n: o.prog.map(c => o.arp.split(' ').map(t => deg(c, o.arpOct || 3, t)).join(' ')).join(' ') });
  if (o.pad !== false) ch.push({ ins: 'pad', vol: o.padVol || .45, n: o.prog.map(c => nameOf(rm(c[0], 3)) + ' ' + Array(15).fill('-').join(' ')).join(' ') });
  ch.push({ ins: o.bassIns || 'bass', vol: o.bassVol || .75, n: o.prog.map(c => o.bass.split(' ').map(t => t === 'R' ? nameOf(rm(c[0], 2)) : t === 'r' ? nameOf(rm(c[0], 3)) : t === '5' ? nameOf(rm(c[0], 2) + 7) : t).join(' ')).join(' ') });
  ch.push({ drum: 1, vol: o.drumVol || .5, n: o.drums });
  return { bpm: o.bpm, ch };
}
const MT = {
  hook: '2 - - 1 - - 0 - 1 - - - 2 - - -', rise: '0 - 1 - 2 - 3 - - - 2 - 1 - - -', sync: '. . 2 - . 1 - . 0 - - . 1 - 2 -', long: '2 - - - - - - - 1 - - - 0 - - -',
  answer: '. . . . 2 - 1 - 0 - - - . . . .', turn: '1 - 2 - 3 - - - 2 - 1 - 0 - - -', low: '0 - - 1 - - 2 - - 1 - - 0 - - -', high: '3 - - 2 - - 4 - 3 - - 2 - - 1 -',
};
const MB = { funk: 'R . r . R . r R 5 . R . r . 5 .', pump: 'R . R . R . R . R . R . R . R .', slow: 'R . . . . . . . 5 . . . . . . .', walk: 'R . . R . . 5 . R . . R . 5 . .' };
const MA = { up: '0 1 2 1 0 1 2 1 0 1 2 1 0 1 2 1', gap: '0 . 2 . 1 . 2 . 0 . 2 . 1 . 2 .', climb: '0 - 1 - 2 - 1 - 0 - 1 - 2 - 3 -', roll: '0 2 1 2 0 2 1 2 0 2 1 2 0 2 1 2' };
const MD = { four: 'k . h . s . h . k . h k s . h .', half: 'k . . . s . . . k . . . s . . h', sway: 'k . . h s . . h k . . h s . h .', soft: 'k . . . . . h . s . . . . . h .' };
const cAm = ['A', 'm'], cF = ['F', 'M'], cC = ['C', 'M'], cG = ['G', 'M'], cEm = ['E', 'm'], cDm = ['D', 'm'], cBb = ['A#', 'M'], cE = ['E', 'M'], cD = ['D', 'M'], cBm = ['B', 'm'];
Object.assign(TRACKS, {
  title: genTrack({ bpm: 116, prog: [cAm, cF, cC, cG], lead: [MT.hook, MT.rise, MT.hook, MT.long], arp: MA.up, bass: MB.funk, drums: MD.four }),
  show: genTrack({ bpm: 132, prog: [cC, cG, cAm, cF], lead: [MT.rise, MT.hook, MT.turn, MT.long], arp: MA.gap, bass: MB.pump, drums: MD.four, leadOct: 4 }),
  studio: genTrack({ bpm: 118, prog: [cC, cAm, cF, cG], lead: [MT.hook, MT.sync, MT.rise, MT.long], arp: MA.roll, bass: MB.funk, drums: MD.four, drumVol: .45 }),
  control: genTrack({ bpm: 126, prog: [cAm, cG, cF, cEm], lead: [MT.sync, MT.answer, MT.sync, MT.long], arp: MA.gap, arpIns: 'bell', arpVol: .3, bass: MB.walk, drums: MD.four, drumVol: .45 }),
  shop: genTrack({ bpm: 138, prog: [cG, cEm, cC, cD], lead: [MT.hook, MT.sync, MT.rise, MT.turn], arp: MA.roll, bass: MB.pump, drums: MD.sway, drumVol: .45 }),
  court: genTrack({ bpm: 100, prog: [cEm, cC, cG, cD], lead: [MT.long, MT.long, MT.hook, MT.low], arp: MA.climb, bass: MB.slow, drums: MD.half, drumVol: .4 }),
  dpatty: genTrack({ bpm: 104, prog: [cC, cF, cC, cG], lead: [MT.hook, MT.rise, MT.hook, MT.turn], arp: MA.up, bass: MB.pump, drums: MD.four }),
  dexes: genTrack({ bpm: 116, prog: [cAm, cG, cF, cEm], lead: [MT.rise, MT.hook, MT.sync, MT.long], arp: MA.roll, bass: MB.funk, drums: MD.sway }),
  dface: genTrack({ bpm: 124, prog: [cEm, cC, cD, cBm], lead: [MT.answer, MT.sync, MT.answer, MT.long], arp: MA.gap, arpIns: 'bell', arpVol: .3, bass: MB.walk, drums: MD.four, drumVol: .45 }),
  dhot: genTrack({ bpm: 120, prog: [cDm, cC, cBb, cAm], lead: [MT.hook, MT.sync, MT.rise, MT.long], arp: MA.up, bass: MB.funk, drums: MD.four }),
  dgavel: genTrack({ bpm: 108, prog: [cEm, cD, cC, cBm], lead: [MT.hook, MT.low, MT.hook, MT.long], arp: MA.climb, bass: MB.walk, drums: MD.half }),
  dmagic: genTrack({ bpm: 112, prog: [cC, cF, cG, cAm], lead: [MT.long, MT.rise, MT.turn, MT.hook], leadIns: 'epiano', leadOct: 4, arp: MA.roll, arpIns: 'epiano', bass: MB.slow, drums: MD.soft, drumVol: .4 }),
  dfin1: genTrack({ bpm: 112, prog: [cAm, cF, cC, cG], lead: [MT.hook, MT.rise, MT.hook, MT.turn], arp: MA.up, bass: MB.funk, drums: MD.four }),
  dfin2: genTrack({ bpm: 112, prog: [cAm, cG, cF, cE], lead: [MT.high, MT.hook, MT.rise, MT.long], arp: MA.roll, bass: MB.funk, drums: MD.sway }),
  credits: genTrack({ bpm: 100, prog: [cC, cAm, cF, cG], lead: [MT.rise, MT.hook, MT.turn, MT.long], leadIns: 'epiano', arp: MA.climb, bass: MB.walk, drums: MD.soft, drumVol: .4 }),
});
