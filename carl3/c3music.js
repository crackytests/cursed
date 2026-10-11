'use strict';
// ================= CARL 3: music. every track is built from chords so the parts never clash =================
Object.assign(PATCH, {
  guitar: { ratio: 1, index: 3.0, mdecay: .35, a: .006, d: .22, s: .5, vol: .36 },
  sax: { ratio: 1, index: 2.0, mdecay: .8, a: .04, d: .3, s: .72, vol: .38 },
  synth: { ratio: 2, index: 1.4, mdecay: .5, a: .01, d: .25, s: .6, vol: .36 },
  vibes: { ratio: 4, index: 1.2, mdecay: .2, a: .004, d: .6, s: 0, vol: .4 },
});
Object.assign(LEGACY_WAVE, { guitar: 'p25', sax: 'p50', synth: 'p25', vibes: 'p12' });
const NM3 = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], nm3 = m => NM3[m % 12] + (Math.floor(m / 12) - 1);
function cgen(o) {
  const semis = c => c[1] === 'm' ? [0, 3, 7, 12, 15] : [0, 4, 7, 12, 16], rm = (r, oct) => NOTE[r] + (oct + 1) * 12, deg = (c, oct, t) => /^\d$/.test(t) ? nm3(rm(c[0], oct) + semis(c)[+t]) : t;
  const ch = [];
  if (o.lead) ch.push({ ins: o.leadIns || 'lead', vol: o.leadVol || .5, n: o.prog.map((c, i) => o.lead[i % o.lead.length].split(' ').map(t => deg(c, o.leadOct || 4, t)).join(' ')).join(' ') });
  if (o.arp) ch.push({ ins: o.arpIns || 'epiano', vol: o.arpVol || .45, n: o.prog.map(c => o.arp.split(' ').map(t => deg(c, o.arpOct || 3, t)).join(' ')).join(' ') });
  if (o.pad !== false) ch.push({ ins: 'pad', vol: o.padVol || .45, n: o.prog.map(c => nm3(rm(c[0], 3)) + ' ' + Array(15).fill('-').join(' ')).join(' ') });
  ch.push({ ins: o.bassIns || 'bass', vol: o.bassVol || .72, n: o.prog.map(c => o.bass.split(' ').map(t => t === 'R' ? nm3(rm(c[0], 2)) : t === 'r' ? nm3(rm(c[0], 3)) : t === '5' ? nm3(rm(c[0], 2) + 7) : t).join(' ')).join(' ') });
  if (o.drums) ch.push({ drum: 1, vol: o.drumVol || .45, n: o.drums });
  return { bpm: o.bpm, ch };
}
const CT = { hook: '2 - - 1 - - 0 - 1 - - - 2 - - -', rise: '0 - 1 - 2 - 3 - - - 2 - 1 - - -', sync: '. . 2 - . 1 - . 0 - - . 1 - 2 -', long: '2 - - - - - - - 1 - - - 0 - - -', answer: '. . . . 2 - 1 - 0 - - - . . . .', turn: '1 - 2 - 3 - - - 2 - 1 - 0 - - -', low: '0 - - 1 - - 2 - - 1 - - 0 - - -', sparse: '. . . . . . . . 2 - - - . . . .' };
const CB = { funk: 'R . r . R . r R 5 . R . r . 5 .', pump: 'R . R . R . R . R . R . R . R .', slow: 'R . . . . . . . 5 . . . . . . .', walk: 'R . . R . . 5 . R . . R . 5 . .', twang: 'R . . . 5 . . . R . . . 5 . r .' };
const CA = { up: '0 1 2 1 0 1 2 1 0 1 2 1 0 1 2 1', gap: '0 . 2 . 1 . 2 . 0 . 2 . 1 . 2 .', climb: '0 - 1 - 2 - 1 - 0 - 1 - 2 - 3 -', roll: '0 2 1 2 0 2 1 2 0 2 1 2 0 2 1 2', strum: '0 . 1 2 . 1 2 . 0 . 1 2 . 1 2 .' };
const CD = { four: 'k . h . s . h . k . h k s . h .', half: 'k . . . s . . . k . . . s . . h', soft: 'k . . . . . h . s . . . . . h .', ind: 'k h k h s h k h k h k h s h k s' };
const cAm = ['A', 'm'], cF = ['F', 'M'], cC = ['C', 'M'], cG = ['G', 'M'], cEm = ['E', 'm'], cDm = ['D', 'm'], cBb = ['A#', 'M'], cD = ['D', 'M'], cA = ['A', 'M'], cE = ['E', 'M'], cBm = ['B', 'm'];
Object.assign(TRACKS, {
  title: cgen({ bpm: 112, prog: [cAm, cF, cC, cG], lead: [CT.hook, CT.rise, CT.hook, CT.long], leadIns: 'sax', arp: CA.strum, arpIns: 'guitar', bass: CB.funk, drums: CD.four }),
  ship: cgen({ bpm: 76, prog: [cC, cF, cAm, cG], lead: [CT.sparse, CT.long, CT.sparse, CT.low], leadIns: 'epiano', arp: CA.climb, bass: CB.slow, drums: CD.soft, drumVol: .3 }),
  drive: cgen({ bpm: 118, prog: [cEm, cC, cG, cD], lead: [CT.hook, CT.sync, CT.rise, CT.long], leadIns: 'guitar', arp: CA.roll, arpIns: 'epiano', bass: CB.pump, drums: CD.four }),
  canyon: cgen({ bpm: 88, prog: [cG, cC, cD, cG], lead: [CT.long, CT.hook, CT.low, CT.long], leadIns: 'guitar', arp: CA.gap, bass: CB.twang, drums: CD.half, drumVol: .35 }),
  motel: cgen({ bpm: 66, prog: [cDm, cBb, cF, cC], lead: [CT.sparse, CT.long, CT.sparse, CT.answer], leadIns: 'vibes', arp: CA.climb, bass: CB.slow, drums: CD.soft, drumVol: .25 }),
  plaza: cgen({ bpm: 104, prog: [cA, cD, cE, cA], lead: [CT.sync, CT.hook, CT.sync, CT.long], leadIns: 'guitar', arp: CA.gap, arpIns: 'organ', arpVol: .4, bass: CB.walk, drums: CD.four, drumVol: .4 }),
  mall: cgen({ bpm: 84, prog: [cF, cC, cDm, cG], lead: [CT.rise, CT.long, CT.turn, CT.low], leadIns: 'vibes', arp: CA.roll, bass: CB.slow, drums: CD.soft, drumVol: .3 }),
  sorting: cgen({ bpm: 126, prog: [cEm, cEm, cC, cD], lead: [CT.answer, CT.sync, CT.answer, CT.sync], leadIns: 'synth', leadVol: .4, arp: CA.gap, arpIns: 'bell', arpVol: .3, bass: CB.pump, drums: CD.ind, drumVol: .4 }),
  dlo: cgen({ bpm: 56, prog: [cAm, cF, cEm, cDm], lead: [CT.sparse, CT.sparse, CT.long, CT.sparse], leadIns: 'bell', leadVol: .35, arp: false, bass: CB.slow, bassVol: .5, drums: false }),
  argue: cgen({ bpm: 124, prog: [cAm, cAm, cG, cF], lead: [CT.sync, CT.hook, CT.sync, CT.answer], leadIns: 'brass', leadVol: .4, arp: CA.up, bass: CB.funk, bassIns: 'slap', bassVol: .5, drums: CD.four }),
  found: cgen({ bpm: 66, prog: [cC, cG, cAm, cF], lead: [CT.hook, CT.long, CT.rise, CT.long], leadIns: 'epiano', arp: CA.climb, bass: CB.slow, drums: CD.soft, drumVol: .25 }),
  credits: cgen({ bpm: 100, prog: [cC, cAm, cF, cG], lead: [CT.rise, CT.hook, CT.turn, CT.long], leadIns: 'sax', arp: CA.strum, arpIns: 'guitar', bass: CB.walk, drums: CD.soft, drumVol: .4 }),
  casino: cgen({ bpm: 96, prog: [cDm, cG, cC, cA], lead: [CT.sync, CT.hook, CT.turn, CT.answer], leadIns: 'sax', arp: CA.strum, arpIns: 'vibes', arpVol: .35, bass: CB.walk, drums: CD.four, drumVol: .35 }),
  sad: cgen({ bpm: 62, prog: [cAm, cF, cC, cEm], lead: [CT.sparse, CT.long, CT.sparse, CT.long], leadIns: 'epiano', arp: false, bass: CB.slow, drums: false }),
  inn: cgen({ bpm: 72, prog: [cAm, cF, cDm, cE], lead: [CT.sparse, CT.low, CT.answer, CT.long], leadIns: 'synth', leadVol: .42, arp: CA.climb, arpIns: 'vibes', arpVol: .35, bass: CB.slow, drums: CD.soft, drumVol: .22 }),
  rhyolite: cgen({ bpm: 56, prog: [cEm, cAm, cDm, cEm], lead: [CT.sparse, CT.low, CT.sparse, CT.long], leadIns: 'guitar', leadVol: .38, arp: false, bass: CB.slow, bassVol: .55, drums: false }),
  lodge: cgen({ bpm: 60, prog: [cF, cC, cDm, cBb], lead: [CT.sparse, CT.long, CT.sparse, CT.answer], leadIns: 'vibes', leadVol: .4, arp: CA.gap, arpIns: 'bell', arpVol: .25, bass: CB.slow, bassVol: .6, drums: CD.soft, drumVol: .18 }),
  prev: { bpm: 84, ch: [{ ins: 'lead', n: 'E4 - - G4 A4 - - - G4 - E4 - D4 - - - E4 - - G4 A4 - C5 - B4 - - - - - - -' }, { ins: 'bass', n: 'A2 . . . . . . . F2 . . . . . . . G2 . . . . . . . E2 . . . . . . .' }] },
});
