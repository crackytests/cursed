// DARK MONDAY lint (node tools/dmlint.js): every string the game can show uses glyphs the font has; every sfx() and music() name exists; every speaker has a voice.
const X = require('./dmvm.js'), fs = require('fs'), path = require('path'); const ctx = X.load(), R = s => X.R(ctx, s);
const dir = path.join(__dirname, '..', 'dm'); let bad = 0; const fail = m => { bad++; console.log('FAIL', m); };
const okCh = c => c === ' ' || R(`!!FONT[${JSON.stringify(c)}]`);
// 1. glyphs: every single-quoted string literal in the game's own files (the engine copies are skipped)
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && !['x68.js', 'fm.js'].includes(f))) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/);
  src.forEach((line, i) => { if (/^\s*\/\//.test(line)) return; const code = line.replace(/\/\/ .*$/, ''); for (const m of code.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) { const s = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'); if (s.length < 4 || !/[a-zA-Z]{3}/.test(s)) continue; if (/^[#.a-z0-9_ ,:|>\-]+$/.test(s) && !/ [a-z]+ [a-z]+ /.test(s)) continue; const badc = [...s].filter(c => !okCh(c)); if (badc.length && !/^[A-Za-z0-9_.,:;#%\[\]{}|<>=\/ -]*$/.test(s)) fail(f + ':' + (i + 1) + ' has glyphs the font cannot draw (' + [...new Set(badc)].join(' ') + '): ' + s.slice(0, 60)); } });
}
// 2. data strings, checked through the real objects
const strs = []; const add = (s, w) => { if (typeof s === 'string') strs.push([s, w]); };
R('Object.keys(BANTER)').forEach(k => { const B = R(`BANTER[${JSON.stringify(k)}]`); for (const id in B.say) add(B.say[id], 'banter ' + k + ' ' + id); for (const p in B.pair || {}) B.pair[p].forEach(l => add(l[1], 'pair ' + k + ' ' + p)); });
R('Object.keys(MEMORY_Q)').forEach(k => { const q = R(`MEMORY_Q[${JSON.stringify(k)}]`); add(q[0], 'memory'); q[1].forEach(o => add(o, 'memory opt')); add(q[3], 'memory'); add(q[4], 'memory'); });
for (const n of R('Object.keys(LEVEL_MAKERS).map(Number)')) { const L = R(`LEVEL_MAKERS[${n}]()`); add(L.name, 'level name'); for (const k in L.text) add(L.text[k], 'sign ' + n + ' ' + k); }
for (const id of R('Object.keys(ITEMS)')) { const it = R(`ITEMS[${JSON.stringify(id)}]`); add(it.name, 'item'); add(it.desc || '', 'item ' + id); }
for (const n of R('Object.keys(SPELLS)')) { add(n, 'spell'); add(R(`SPELLS[${JSON.stringify(n)}].desc`), 'spell ' + n); }
for (const [t, ls] of R('manualPages()')) { add(t, 'manual title'); ls.forEach(l => add(l, 'manual ' + t)); }
for (const [id, ls] of Object.entries(R('SELECT_BLURB'))) ls.forEach(l => add(l, 'blurb ' + id));
for (const [s, w] of strs) { const badc = [...s].filter(c => !okCh(c)); if (badc.length) fail(w + ': glyphs the font cannot draw (' + [...new Set(badc)].join(' ') + ') in "' + s.slice(0, 60) + '"'); }
// 3. the longest unbroken word in any sign must fit the 74-column text box
for (const [s, w] of strs) for (const word of s.split(' ')) if (word.length > 60) fail(w + ': a word is too long to wrap: ' + word.slice(0, 20));
// 4. sound and music names
const SFXN = new Set(R('Object.keys(SFX)')), TRK = new Set(R('Object.keys(TRACKS)'));
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js') && !['x68.js', 'fm.js'].includes(f))) { const src = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of src.matchAll(/\bsfx\(([^)]*)\)/g)) for (const q of m[1].matchAll(/'([a-z]+)'/g)) if (!SFXN.has(q[1])) fail(f + ': unknown sound effect "' + q[1] + '"');
  for (const m of src.matchAll(/\bmusic\(([^)]*)\)/g)) for (const q of m[1].matchAll(/'([a-z0-9]+)'/g)) if (!TRK.has(q[1])) fail(f + ': unknown music track "' + q[1] + '"'); }
for (const n of R('Object.keys(LEVEL_MAKERS).map(Number)')) { const m = R(`LEVEL_MAKERS[${n}]().music`); if (m && !TRK.has(m)) fail('level ' + n + ' music "' + m + '" does not exist'); }
// 5. every named speaker can talk
const used = new Set(); for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/say\([^;]*?, '([A-Z][A-Z ]+)'\)/g)) used.add(m[1]);
for (const w of used) if (!R(`!!CAST[${JSON.stringify(w)}]`) && !/^(LEGAL|COLLECTOR|DIRECTOR)$/.test(w)) fail('speaker "' + w + '" has no CAST entry (no name color or voice)');
console.log(bad ? bad + ' PROBLEMS' : 'ALL OK  (' + strs.length + ' strings, ' + SFXN.size + ' sounds, ' + TRK.size + ' tracks)'); process.exit(bad ? 1 : 0);
