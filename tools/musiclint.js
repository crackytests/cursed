// Harmony lint for FM tracks: node tools/musiclint.js carl2 [track]
// Per track: each channel's loop length (mismatched loops drift against each other), and the share of steps where two
// melodic voices clash by a semitone (minor 2nd / major 7th), with the worst spots listed. Drums are ignored.
const { load, G } = require(process.argv[2] === 'yoko' ? './yvm' : process.argv[2] === 'face' ? './fvm' : './c2vm');
const ctx = load({}), only = process.argv[3], verbose = !!process.argv[3];
const data = JSON.parse(G.R(ctx, 'JSON.stringify(Object.fromEntries(Object.keys(TRACKS).map(k => [k, compile(TRACKS[k]).ch.map(c => ({ drum: !!c.drum, ins: c.ins, len: c.len, map: c.map.map(e => e ? [e.k, e.len] : null) }))])))'));
const PC = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const midi = k => { const m = /^([A-G]#?)(\d)$/.exec(k); return m ? (+m[2] + 1) * 12 + PC[m[1]] : null; };
const NM = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'], nm = m => NM[m % 12] + (Math.floor(m / 12) - 1);
const gcd = (a, b) => b ? gcd(b, a % b) : a, lcm = (a, b) => a / gcd(a, b) * b;
for (const [name, chs] of Object.entries(data)) {
  if (only && name !== only) continue;
  const mel = chs.filter(c => !c.drum);
  const L = Math.min(4096, mel.reduce((a, c) => lcm(a, c.len), 1));
  const lens = chs.map(c => c.len), base = Math.max(...lens), drift = lens.some(l => base % l !== 0);
  let clash = 0, sounding = 0; const spots = {};
  for (let n = 0; n < L; n++) {
    const notes = [];
    mel.forEach((c, ci) => { for (let b = 0; b < 16; b++) { const e = c.map[((n - b) % c.len + c.len) % c.len]; if (e) { if (e[1] > b) notes.push([ci, midi(e[0])]); break; } } });
    if (notes.length < 2) continue; sounding++;
    let bad = false;
    for (let i = 0; i < notes.length; i++) for (let j = i + 1; j < notes.length; j++) { const d = Math.abs(notes[i][1] - notes[j][1]) % 12; if (d === 1 || d === 11) { bad = true; const key = 'ch' + notes[i][0] + '/ch' + notes[j][0]; spots[key] = (spots[key] || 0) + 1; if (verbose && n < 256) console.log('  step ' + n + ': ch' + notes[i][0] + ' ' + nm(notes[i][1]) + ' vs ch' + notes[j][0] + ' ' + nm(notes[j][1])); } }
    if (bad) clash++;
  }
  const pct = sounding ? clash / sounding * 100 : 0;
  console.log(name.padEnd(11), 'loops', lens.join('/').padEnd(22), drift ? 'DRIFT' : '     ', 'clash', pct.toFixed(1).padStart(5) + '%', Object.entries(spots).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => k + ':' + v).join(' '));
}
