'use strict';
// ================= SAVE THE WORLD: music (FM). Melodies are written as note:length (16ths); accompaniment is built from chords =================
const MU = (() => {
  const NN = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const nm = (pc, oct) => NAMES[((pc % 12) + 12) % 12] + (oct + Math.floor(pc / 12));
  // "A4:4 C5:2 r:2" -> sequencer tokens
  const mel = s => { const out = []; for (const t of s.trim().split(/\s+/)) { const [n, l] = t.split(':'); const len = +l || 1, note = n.replace('b', n.length > 2 && n[1] === 'b' ? 'b' : 'b'); const k = n === 'r' ? '.' : flat(n); out.push(k); for (let i = 1; i < len; i++) out.push(n === 'r' ? '.' : '-'); } return out.join(' '); };
  const flat = n => { const m = /^([A-G])(b|#)?(\d)$/.exec(n); if (!m) return n; if (m[2] === 'b') return NAMES[(NN[m[1]] + 11) % 12] + (m[1] === 'C' ? +m[3] - 1 : m[3]); return n; };
  // chord name -> pitch classes (root first)
  const chord = c => { const m = /^([A-G](?:#|b)?)(m7|maj7|m|7|dim|sus|aug)?$/.exec(c); const r = NN[m[1]]; const q = { m: [0, 3, 7], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], 7: [0, 4, 7, 10], dim: [0, 3, 6], sus: [0, 5, 7], aug: [0, 4, 8] }[m[2]] || [0, 4, 7]; return q.map(i => r + i); };
  // accompaniment: one token string per bar pattern, repeated over the chords
  const BASS = {
    drive: (c, n) => Array.from({ length: n }, (_, i) => i % 2 === 0 ? nm(c[0], 2) : '-').join(' '),
    walk: (c, n) => Array.from({ length: n }, (_, i) => i % 4 === 0 ? nm(c[(i / 4) % 2 ? 2 : 0], 2) : i % 4 === 1 ? '-' : '.').join(' '),
    pulse: (c, n) => Array.from({ length: n }, (_, i) => i === 0 || i === n / 2 ? nm(c[0], 2) : i < 3 || (i > n / 2 && i < n / 2 + 3) ? '-' : '.').join(' '),
    held: (c, n) => [nm(c[0], 2)].concat(Array(n - 1).fill('-')).join(' '),
    gallop: (c, n) => Array.from({ length: n }, (_, i) => [nm(c[0], 2), '.', nm(c[0], 2), nm(c[0], 2)][i % 4]).join(' '),
    oct: (c, n) => Array.from({ length: n }, (_, i) => i % 2 ? '.' : nm(c[0], (i / 2) % 2 ? 3 : 2)).join(' '),
    waltz: (c, n) => Array.from({ length: n }, (_, i) => i === 0 ? nm(c[0], 2) : i === 4 || i === 8 ? nm(c[2], 3) : '.').join(' '),
  };
  const ARP = {
    up: (c, n, o) => Array.from({ length: n }, (_, i) => nm(c[i % c.length], o + Math.floor(i / c.length) % 2)).join(' '),
    eighths: (c, n, o) => Array.from({ length: n }, (_, i) => i % 2 ? '.' : nm(c[(i / 2) % c.length], o)).join(' '),
    stab: (c, n, o) => Array.from({ length: n }, (_, i) => i % 4 === 2 ? nm(c[1], o) : '.').join(' '),
    pad1: (c, n, o) => [nm(c[1], o)].concat(Array(n - 1).fill('-')).join(' '),
    pad2: (c, n, o) => [nm(c[2], o)].concat(Array(n - 1).fill('-')).join(' '),
    waltz: (c, n, o) => Array.from({ length: n }, (_, i) => i === 4 || i === 8 ? nm(c[1], o) : '.').join(' '),
  };
  const DR = {
    rock: 'k . h . s . h . k k h . s . h .', soft: 'k . . . h . . . k . . . h . . .', march: 's . s s s . s s k . s s s . s .',
    battle: 'k . h k s . h . k . h k s . s s', boss: 'k k h . s . h k k . h k s . s .', shuffle: 'k . h k . h s . h k . h s . h .',
    waltz: 'k . . . h . . . h . . .', pulse: 'k . . . . . . . k . . . . . . .', hats: 'h . h . h . h . h . h . h . h .', tom: 'k . . k . . k . s . . . k . s .',
  };
  // build a track. o: { bpm, chords: ['Am','F'...], bar: 16, mel: 'note:len ...', mel2, bass, arp, arp2, drums, ins, vol }
  function song(o) {
    const bar = o.bar || 16, ch = [];
    const per = (gen, ...a) => o.chords.map(c => gen(chord(c), bar, ...a)).join(' ');
    if (o.mel) ch.push({ n: mel(o.mel), ins: o.ins || 'lead', vol: o.vol || 1 });
    if (o.mel2) ch.push({ n: mel(o.mel2), ins: o.ins2 || 'bell', vol: o.vol2 || .6 });
    if (o.bass !== null) ch.push({ n: per(BASS[o.bass || 'drive']), ins: o.bassIns || 'bass', vol: o.bassVol || 1 });
    if (o.arp) ch.push({ n: per(ARP[o.arp], o.arpOct || 4), ins: o.arpIns || 'pluck', vol: o.arpVol || .5 });
    if (o.arp2) ch.push({ n: per(ARP[o.arp2], o.arp2Oct || 4), ins: o.arp2Ins || 'pad', vol: o.arp2Vol || .45 });
    if (o.drums) ch.push({ drum: 1, n: Array(o.chords.length).fill(DR[o.drums] || o.drums).join(' '), vol: o.drumVol || .8 });
    return { bpm: o.bpm, ch };
  }
  return { song, mel, chord, DR };
})();
const S = MU.song;
Object.assign(TRACKS, {
  // ---- the title and the theme of the world ----
  title: S({ bpm: 80, chords: ['Dm', 'Bb', 'F', 'C', 'Dm', 'Gm', 'A', 'A'], ins: 'brass', vol: .9,
    mel: 'D5:6 E5:2 F5:4 A5:4 G5:6 F5:2 D5:8 C5:4 F5:4 A5:6 G5:2 G5:12 r:4 D5:6 E5:2 F5:4 D6:4 C6:4 A#5:4 A5:4 G5:4 A5:6 G5:2 E5:4 C#5:4 D5:12 r:4',
    bass: 'held', arp: 'up', arpIns: 'bell', arpVol: .35, arp2: 'pad1', drums: 'pulse', drumVol: .5 }),
  opening: S({ bpm: 92, chords: ['Dm', 'Dm', 'Bb', 'C', 'Dm', 'Dm', 'Gm', 'A'], ins: 'brass', vol: .8,
    mel: 'D4:12 F4:2 E4:2 D4:8 A4:8 F4:12 G4:4 E4:16 D4:12 F4:2 G4:2 A4:8 D5:8 C5:8 A#4:8 A4:16',
    bass: 'gallop', bassVol: .8, arp2: 'pad1', drums: 'march', drumVol: .7 }),
  world: S({ bpm: 120, chords: ['Em', 'C', 'D', 'Em', 'Em', 'C', 'D', 'B'], ins: 'brass',
    mel: 'E5:4 B4:4 E5:2 F#5:2 G5:4 F#5:4 E5:4 C5:8 D5:4 F#5:4 A5:4 G5:2 F#5:2 E5:12 r:4 E5:4 G5:4 B5:6 A5:2 G5:4 F#5:4 E5:8 F#5:4 A5:4 D6:4 C6:2 A5:2 B5:12 r:4',
    bass: 'drive', arp: 'eighths', arpVol: .4, arp2: 'pad1', drums: 'rock', drumVol: .6 }),
  world2: S({ bpm: 70, chords: ['Am', 'F', 'C', 'E', 'Am', 'Dm', 'E', 'E'], ins: 'epiano', vol: .8,
    mel: 'A4:6 C5:2 E5:8 F5:6 E5:2 C5:8 G5:6 E5:2 C5:8 B4:12 r:4 A4:6 C5:2 E5:8 D5:6 F5:2 A5:8 G#5:8 B4:8 A4:12 r:4',
    bass: 'held', arp: 'up', arpIns: 'pluck', arpVol: .3, arpOct: 3, drums: null }),
  airship: S({ bpm: 132, chords: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D'], ins: 'lead',
    mel: 'G5:2 r:2 G5:2 A5:2 B5:4 D6:4 A5:4 F#5:4 D5:8 B4:4 E5:4 G5:4 B5:4 C6:8 G5:8 G5:2 r:2 G5:2 A5:2 B5:4 D6:4 F#6:4 E6:4 D6:8 C6:4 B5:4 A5:4 G5:4 A5:16',
    bass: 'oct', arp: 'up', arpVol: .35, drums: 'shuffle', drumVol: .6 }),
  // ---- places ----
  coldboot: S({ bpm: 76, chords: ['Am', 'Am', 'G', 'G', 'F', 'F', 'E', 'E'], ins: 'bell', vol: .7,
    mel: 'E5:4 A5:4 C6:8 B5:4 G5:4 E5:8 D5:4 G5:4 B5:8 A5:4 G5:4 E5:8 C5:4 F5:4 A5:8 G5:4 F5:4 C5:8 B4:4 E5:4 G#5:8 E5:16',
    bass: 'held', arp: 'eighths', arpIns: 'pad', arpVol: .3, drums: null }),
  mines: S({ bpm: 96, chords: ['Dm', 'Dm', 'C', 'C', 'Bb', 'A', 'Dm', 'A'], ins: 'pluck', vol: .8,
    mel: 'D5:2 r:2 F5:2 r:2 A5:4 G5:4 F5:2 r:2 E5:2 r:2 D5:8 C5:2 r:2 E5:2 r:2 G5:4 F5:4 E5:8 r:8 D5:2 r:2 F5:2 r:2 A#5:4 A5:4 G5:4 E5:4 C#5:8 D5:8 r:8 A4:8 r:8',
    bass: 'walk', arp: 'stab', arpVol: .4, drums: 'tom', drumVol: .5 }),
  dungeon2: S({ bpm: 88, chords: ['Bm', 'G', 'Em', 'F#', 'Bm', 'G', 'C', 'F#'], ins: 'organ', vol: .6,
    mel: 'B4:8 D5:4 F#5:4 G5:8 F#5:8 E5:6 D5:2 C#5:8 r:8 B4:8 D5:4 F#5:4 B5:8 A5:8 G5:8 E5:8 F#5:16 r:8',
    bass: 'held', arp: 'up', arpVol: .3, arpOct: 3, drums: 'pulse', drumVol: .5 }),
  firstsave: S({ bpm: 60, chords: ['Cmaj7', 'Am', 'Fmaj7', 'G'], ins: 'bell', vol: .7, mel: 'E6:8 B5:8 C6:8 A5:8 A5:8 C6:4 F6:4 D6:16', bass: 'held', arp: 'up', arpIns: 'bell', arpVol: .25, arpOct: 5, drums: null }),
  town: S({ bpm: 108, chords: ['C', 'Am', 'F', 'G', 'C', 'Am', 'Dm', 'G'], ins: 'epiano',
    mel: 'G5:4 E5:4 C5:4 E5:4 A5:4 G5:4 E5:8 F5:4 A5:4 C6:4 A5:4 G5:12 r:4 G5:4 E5:4 C5:4 E5:4 A5:4 C6:4 A5:8 F5:4 A5:4 D5:4 F5:4 G5:12 r:4',
    bass: 'walk', arp: 'stab', arpIns: 'organ', arpVol: .35, drums: 'shuffle', drumVol: .45 }),
  castle: S({ bpm: 100, chords: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A'], ins: 'brass', vol: .8,
    mel: 'D5:4 F#5:4 A5:6 G5:2 F#5:4 E5:4 C#5:8 D5:4 F#5:4 B5:6 A5:2 G5:16 D5:4 F#5:4 A5:6 B5:2 C#6:4 B5:4 A5:8 B5:4 G5:4 E5:4 C#5:4 D5:12 r:4',
    bass: 'pulse', arp: 'eighths', arpIns: 'pluck', arpVol: .35, drums: 'march', drumVol: .45 }),
  mountain: S({ bpm: 112, chords: ['Am', 'G', 'F', 'G'], ins: 'lead', mel: 'A4:2 C5:2 E5:4 D5:2 C5:2 B4:2 G4:2 A4:4 C5:4 F5:4 E5:4 D5:8 B4:8 A4:16', bass: 'gallop', bassVol: .7, arp: 'up', arpVol: .3, drums: 'rock', drumVol: .55 }),
  return: S({ bpm: 84, chords: ['Em', 'G', 'Am', 'B'], ins: 'organ', vol: .6, mel: 'B4:6 E5:2 G5:8 F#5:4 E5:4 D5:8 C5:6 E5:2 A5:8 F#5:16', bass: 'held', arp: 'eighths', arpVol: .3, drums: 'pulse', drumVol: .4 }),
  river: S({ bpm: 126, chords: ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C'], ins: 'pluck',
    mel: 'F5:2 A5:2 C6:4 A5:2 G5:2 E5:4 C5:2 E5:2 G5:4 F5:2 E5:2 D5:4 A5:2 F5:2 D5:4 C5:2 D5:2 F5:4 A#5:4 A5:4 G5:8 F5:2 A5:2 C6:4 D6:2 C6:2 A5:4 G5:2 E5:2 C5:4 A#4:2 C5:2 D5:4 A#5:4 G5:4 A5:4 E5:4 C5:8 r:8',
    bass: 'drive', arp: 'up', arpVol: .3, drums: 'rock', drumVol: .5 }),
  bruce: S({ bpm: 140, chords: ['C', 'C', 'F', 'G'], ins: 'slap', mel: 'C5:2 r:2 E5:2 G5:2 A5:2 G5:2 E5:4 C5:2 r:2 E5:2 G5:2 C6:4 r:4 F5:2 A5:2 C6:2 A5:2 F5:4 r:4 G5:2 B5:2 D6:2 B5:2 G5:4 r:4', bass: 'oct', arp: 'stab', arpIns: 'brass', arpVol: .4, drums: 'battle', drumVol: .6 }),
  garfeild: S({ bpm: 90, chords: ['F', 'Dm', 'Bb', 'C7'], ins: 'epiano', mel: 'C5:4 F5:4 A5:6 G5:2 F5:4 D5:4 A4:8 A#4:4 D5:4 F5:6 E5:2 E5:8 G5:8', bass: 'walk', arp: 'stab', arpIns: 'organ', arpVol: .3, drums: 'shuffle', drumVol: .35 }),
  diner: S({ bpm: 96, chords: ['C', 'A7', 'Dm', 'G7'], ins: 'organ', vol: .6, mel: 'E5:3 G5:3 C6:2 B5:4 A5:4 C#5:3 E5:3 A5:2 G5:8 F5:3 A5:3 D6:2 C6:4 A5:4 B4:3 D5:3 G5:2 F5:8', bass: 'walk', arp: null, drums: 'shuffle', drumVol: .35 }),
  station: S({ bpm: 74, chords: ['Am', 'Em', 'F', 'E'], ins: 'pad', vol: .7, mel: 'A4:8 C5:8 B4:8 G4:8 A4:8 C5:4 F5:4 E5:16', bass: 'held', arp: 'eighths', arpIns: 'bell', arpVol: .25, arpOct: 5, drums: null }),
  train: S({ bpm: 132, chords: ['Em', 'Em', 'C', 'B'], ins: 'organ', vol: .7, mel: 'E5:2 r:2 E5:2 G5:2 B5:4 A5:4 G5:2 F#5:2 E5:4 D#5:8 E5:2 r:2 G5:2 B5:2 E6:4 D6:4 C6:4 B5:4 D#5:8', bass: 'gallop', arp: 'up', arpIns: 'pluck', arpVol: .3, drums: 'tom', drumVol: .6 }),
  plains: S({ bpm: 100, chords: ['D', 'G', 'D', 'A', 'D', 'G', 'A', 'D'], ins: 'pluck', mel: 'A4:4 D5:4 F#5:4 A5:4 G5:8 B5:8 A5:4 F#5:4 D5:8 E5:16 A4:4 D5:4 F#5:4 A5:4 B5:8 G5:8 A5:4 C#6:4 E6:8 D6:16', bass: 'walk', arp: 'eighths', arpVol: .35, drums: 'soft', drumVol: .5 }),
  port: S({ bpm: 104, chords: ['G', 'C', 'G', 'D'], ins: 'epiano', mel: 'D5:4 G5:4 B5:4 G5:4 E5:4 C5:4 E5:8 D5:4 G5:4 B5:4 D6:4 C6:8 A5:8', bass: 'pulse', arp: 'stab', arpVol: .35, drums: 'shuffle', drumVol: .4 }),
  prestige: S({ bpm: 96, chords: ['Fmaj7', 'Em', 'Dm', 'Cmaj7'], ins: 'epiano', vol: .8, mel: 'A5:4 C6:4 E6:8 B5:4 G5:4 E5:8 A5:4 F5:4 D5:8 E5:16', bass: 'walk', arp: 'up', arpIns: 'bell', arpVol: .25, drums: 'soft', drumVol: .35 }),
  operalobby: S({ bpm: 88, chords: ['G', 'Em', 'C', 'D'], bar: 12, ins: 'organ', vol: .6, mel: 'D5:4 G5:4 B5:4 A5:6 G5:3 E5:3 C5:4 E5:4 G5:4 F#5:8 D5:4', bass: 'waltz', arp: 'waltz', arpVol: .3, drums: 'waltz', drumVol: .4 }),
  aria: S({ bpm: 84, chords: ['G', 'Em', 'C', 'D', 'G', 'Em', 'Am', 'G'], bar: 12, ins: 'lead', vol: 1,
    mel: 'D5:4 G5:4 B5:4 A5:6 G5:3 E5:3 C5:4 E5:4 G5:4 F#5:8 D5:4 D5:4 G5:4 B5:4 D6:6 C6:3 B5:3 A5:4 C6:4 F#5:4 G5:12',
    bass: 'waltz', arp: 'waltz', arpIns: 'pad', arpVol: .35, drums: null }),
  ghost: S({ bpm: 118, chords: ['Am', 'Dm', 'E7', 'Am'], ins: 'organ', mel: 'E5:2 r:2 A5:2 r:2 C6:2 B5:2 A5:2 G#5:2 A5:4 E5:4 D5:2 F5:2 A5:4 G#5:2 B5:2 E6:4 C6:4 A5:8 r:12', bass: 'oct', arp: 'stab', arpVol: .3, drums: 'shuffle', drumVol: .5 }),
  fcity: S({ bpm: 112, chords: ['Cm', 'Cm', 'Ab', 'G'], ins: 'pluck', mel: 'C5:2 C5:2 r:4 G5:2 G5:2 r:4 Eb5:2 F5:2 G5:4 r:8 Ab5:2 G5:2 F5:2 Eb5:2 C5:4 r:4 D5:4 B4:4 G4:8', bass: 'drive', arp: 'stab', arpIns: 'brass', arpVol: .3, drums: 'march', drumVol: .45 }),
  factory: S({ bpm: 120, chords: ['Am', 'Am', 'Bb', 'E'], ins: 'organ', vol: .6, mel: 'A4:2 E5:2 A4:2 E5:2 A4:2 F5:2 E5:4 A4:2 E5:2 A4:2 E5:2 C5:8 A#4:2 F5:2 A#4:2 F5:2 D5:8 E5:4 G#5:4 B5:8', bass: 'drive', arp: 'up', arpVol: .3, drums: 'tom', drumVol: .55 }),
  memory: S({ bpm: 64, chords: ['Dmaj7', 'Bm', 'Gmaj7', 'A'], ins: 'bell', vol: .7, mel: 'F#6:8 A5:8 D6:8 B5:8 B5:8 D6:4 G6:4 E6:16', bass: 'held', arp: 'up', arpIns: 'bell', arpVol: .25, arpOct: 5, drums: null }),
  dinner: S({ bpm: 80, chords: ['Bb', 'Gm', 'Eb', 'F'], bar: 12, ins: 'epiano', vol: .7, mel: 'F5:4 A#5:4 D6:4 C6:6 A#5:3 G5:3 G5:4 A#5:4 D#6:4 C6:12', bass: 'waltz', arp: 'waltz', arpVol: .3, drums: 'waltz', drumVol: .3 }),
  cloud: S({ bpm: 128, chords: ['Bm', 'G', 'A', 'F#'], ins: 'lead', mel: 'B4:2 D5:2 F#5:4 B5:4 A5:2 G5:2 D5:4 G5:4 B5:4 A5:4 C#6:4 E6:4 C#6:4 A#5:8 F#5:8 r:4', bass: 'gallop', arp: 'up', arpVol: .3, drums: 'rock', drumVol: .6 }),
  slots: S({ bpm: 60, chords: ['Cm', 'Ab', 'Fm', 'G'], ins: 'organ', vol: .6, mel: 'G5:8 Eb5:8 C5:8 Ab4:8 F5:8 Ab5:8 G5:16', bass: 'held', arp: 'pad1', arpIns: 'pad', drums: 'pulse', drumVol: .4 }),
  danger: S({ bpm: 150, chords: ['Am', 'Am', 'F', 'E'], ins: 'brass', mel: 'A4:2 A4:2 A5:2 A4:2 G5:2 A4:2 F5:2 A4:2 E5:2 A4:2 D5:2 E5:2 C5:4 E5:4 F5:2 F5:2 A5:2 F5:2 C6:4 A5:4 G#5:4 B5:4 E6:8', bass: 'drive', arp: 'stab', arpVol: .3, drums: 'battle', drumVol: .65 }),
  kursor: S({ bpm: 132, chords: ['F', 'C7', 'F', 'C7', 'Bb', 'F', 'C7', 'F'], ins: 'organ', vol: .8,
    mel: 'C5:2 F5:2 A5:2 F5:2 C5:2 F5:2 A5:2 C6:2 B5:2 C6:2 B5:2 A#5:2 G5:4 E5:4 C5:2 F5:2 A5:2 F5:2 C6:2 A5:2 F5:2 C5:2 C#5:2 D5:2 E5:2 G5:2 A#5:4 r:4 D6:2 C6:2 A#5:2 A5:2 G5:4 F5:4 A5:2 G5:2 F5:2 E5:2 F5:4 C5:4 E5:2 G5:2 A#5:2 C6:2 D6:2 C#6:2 C6:2 A#5:2 A5:4 F5:4 F4:4 r:4',
    bass: 'oct', arp: 'stab', arpIns: 'bell', arpVol: .35, drums: 'shuffle', drumVol: .55 }),
  // ---- battle ----
  battle: S({ bpm: 150, chords: ['Am', 'F', 'G', 'E', 'Am', 'F', 'G', 'E'], ins: 'brass',
    mel: 'A4:2 A4:2 C5:2 E5:2 A5:4 G5:2 E5:2 F5:2 F5:2 A5:2 C6:2 A5:4 F5:4 G5:2 G5:2 B5:2 D6:2 B5:4 G5:2 D5:2 E5:2 G#5:2 B5:2 E6:2 D6:2 B5:2 G#5:4 A5:4 E5:4 C5:4 E5:4 F5:4 C6:4 A5:4 F5:4 G5:4 B5:4 D6:4 B5:4 E6:8 E5:8',
    bass: 'drive', arp: 'up', arpVol: .3, drums: 'battle', drumVol: .7 }),
  boss: S({ bpm: 140, chords: ['Cm', 'Ab', 'Bb', 'G', 'Cm', 'Ab', 'Bb', 'G'], ins: 'brass',
    mel: 'C5:3 C5:1 C5:2 Eb5:2 G5:4 F5:4 Eb5:3 Eb5:1 Eb5:2 C5:2 Ab4:8 Bb4:3 Bb4:1 D5:2 F5:2 Bb5:4 Ab5:4 G5:4 F5:2 Eb5:2 D5:4 B4:4 C5:3 C5:1 C5:2 Eb5:2 G5:4 C6:4 Ab5:3 Ab5:1 G5:2 F5:2 Eb5:8 F5:3 F5:1 Ab5:2 Bb5:2 D6:4 F6:4 G5:16',
    bass: 'gallop', arp: 'stab', arpIns: 'organ', arpVol: .35, drums: 'boss', drumVol: .75 }),
  final: S({ bpm: 156, chords: ['Dm', 'Bb', 'C', 'A', 'Dm', 'Bb', 'Gm', 'A'], ins: 'brass',
    mel: 'D5:2 F5:2 A5:2 D6:2 C6:2 A5:2 F5:2 A5:2 A#5:4 D6:4 F6:4 D6:4 C6:2 E6:2 G6:2 E6:2 C6:4 G5:4 A5:4 C#6:4 E6:4 A6:4 D6:2 C6:2 A5:2 F5:2 D5:4 F5:4 F5:2 A#5:2 D6:2 F6:2 A#6:4 F6:4 G6:4 F6:4 D6:4 A#5:4 A5:16',
    bass: 'gallop', arp: 'up', arpIns: 'organ', arpVol: .35, arp2: 'pad1', drums: 'boss', drumVol: .8 }),
  victory: S({ bpm: 150, chords: ['C', 'G', 'F', 'G'], ins: 'brass', mel: 'G4:2 C5:2 E5:2 G5:4 E5:2 G5:2 C6:2 B5:4 G5:4 D5:8 A5:4 F5:4 C5:4 A5:4 G5:16', bass: 'pulse', arp: 'stab', arpVol: .3, drums: 'rock', drumVol: .5 }),
  fanfare: S({ bpm: 140, chords: ['C', 'F', 'G', 'C'], ins: 'brass', mel: 'C5:2 E5:2 G5:4 C6:8 A5:4 F5:4 C6:8 B5:4 D6:4 G6:8 C6:16', bass: 'pulse', drums: 'march', drumVol: .5 }),
  rest: S({ bpm: 90, chords: ['F', 'C', 'G', 'C'], ins: 'bell', vol: .7, mel: 'A5:4 F5:4 C6:8 G5:4 E5:4 C5:8 D5:4 G5:4 B5:8 C6:16', bass: 'held', drums: null }),
  gameover: S({ bpm: 70, chords: ['Am', 'F', 'Dm', 'E'], ins: 'pad', mel: 'E5:8 C5:8 A4:8 F4:8 F5:8 D5:8 B4:8 G#4:8', bass: 'held', drums: null }),
  // ---- the corrupted save ----
  island: S({ bpm: 68, chords: ['C', 'Am', 'F', 'G'], ins: 'epiano', vol: .7, mel: 'E5:8 G5:4 E5:4 C5:16 A4:8 C5:4 F5:4 D5:16', bass: 'held', arp: 'up', arpIns: 'pluck', arpVol: .25, arpOct: 4, drums: null }),
  newfile: S({ bpm: 76, chords: ['Am', 'Am', 'G', 'G', 'F', 'F', 'E', 'E'], ins: 'pluck', vol: .6, mel: 'E5:4 A5:4 C6:8 B5:4 G5:4 E5:8 D5:4 G5:4 B5:8 A5:4 G5:4 E5:8 C5:4 F5:4 A5:8 G5:4 F5:4 C5:8 B4:4 E5:4 G#5:8 E5:16', bass: 'held', drums: null }),
  grave: S({ bpm: 80, chords: ['Em', 'Am', 'B7', 'Em'], ins: 'organ', vol: .6, mel: 'B4:4 E5:4 G5:4 B5:4 A5:8 C6:8 B5:4 A5:4 F#5:8 E5:16', bass: 'held', arp: 'eighths', arpIns: 'bell', arpVol: .25, arpOct: 5, drums: 'pulse', drumVol: .3 }),
  yokoid: S({ bpm: 98, chords: ['D', 'Bm', 'G', 'A'], ins: 'bell', vol: .7, mel: 'F#5:4 A5:4 D6:8 B5:4 F#5:4 D5:8 G5:4 B5:4 D6:4 C#6:4 A5:16', bass: 'walk', arp: 'eighths', arpIns: 'pluck', arpVol: .3, drums: 'soft', drumVol: .35 }),
  dream: S({ bpm: 72, chords: ['Am7', 'Dm', 'G', 'Cmaj7'], ins: 'epiano', vol: .7, mel: 'E5:6 G5:2 C6:8 A5:6 F5:2 D5:8 B4:6 D5:2 G5:8 E5:16', bass: 'walk', arp: null, drums: 'shuffle', drumVol: .3 }),
  tower: S({ bpm: 116, chords: ['Em', 'C', 'Am', 'B'], ins: 'organ', vol: .7, mel: 'E5:4 G5:4 B5:4 E6:4 C6:8 G5:8 A5:4 C6:4 E6:4 A6:4 F#6:8 D#6:8', bass: 'gallop', arp: 'up', arpVol: .3, drums: 'tom', drumVol: .55 }),
  // ---- the end ----
  ending: S({ bpm: 84, chords: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C'], ins: 'epiano',
    mel: 'E5:4 G5:4 C6:8 B5:4 A5:4 G5:8 A5:4 C6:4 E6:6 D6:2 C6:4 A5:4 F5:8 E5:4 G5:4 C6:6 D6:2 E6:4 D6:4 B5:8 C6:4 A5:4 F5:4 A5:4 G5:8 E5:4 C5:4',
    bass: 'walk', arp: 'up', arpIns: 'bell', arpVol: .25, arpOct: 5, arp2: 'pad1', drums: 'soft', drumVol: .35 }),
  credits: S({ bpm: 100, chords: ['Dm', 'Bb', 'F', 'C', 'Dm', 'Gm', 'A', 'A'], ins: 'brass', vol: .9,
    mel: 'D5:6 E5:2 F5:4 A5:4 G5:6 F5:2 D5:8 C5:4 F5:4 A5:6 G5:2 G5:12 r:4 D5:6 E5:2 F5:4 D6:4 C6:4 A#5:4 A5:4 G5:4 A5:6 G5:2 E5:4 C#5:4 D5:12 r:4',
    bass: 'walk', arp: 'eighths', arpVol: .35, arp2: 'pad1', drums: 'rock', drumVol: .5 }),
});
