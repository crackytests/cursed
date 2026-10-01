// usage: node tools/textlint.js — static check for Gen-1 strings too wide for the 160px screen (6px per char).
// Limits come from js/engine.js: menu options (choose/ask) max 23 chars (box = len*6+20 must fit 160),
// showCard lines max 26 (ctext centers them), banner max 24 (box = len*6+14), dialog names max 22.
const fs = require('fs'), path = require('path');
process.chdir(path.join(__dirname, '..'));
const files = ['js', 'linda', 'ghost', 'tp'].flatMap(d => fs.readdirSync(d).filter(f => f.endsWith('.js')).map(f => d + '/' + f));
const STR = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
const unesc = s => s.replace(/\\(.)/g, '$1');
function bracket(src, i) { // src[i] === '[' → index after matching ']'
  let d = 0, q = null;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (q) { if (c === '\\') j++; else if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === '`') q = c; else if (c === '[') d++; else if (c === ']' && --d === 0) return j + 1;
  }
  return src.length;
}
const issues = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8'), lineOf = i => src.slice(0, i).split('\n').length;
  const check = (kind, max, i0, i1) => {
    for (const m of src.slice(i0, i1).matchAll(STR)) {
      const raw = m[1] ?? m[2] ?? m[3]; if (raw === undefined) continue;
      const s = unesc(raw).replace(/\$\{[^}]*\}/g, '##');
      for (const l of s.split('\n')) if (l.length > max) issues.push(`${f}:${lineOf(i0 + m.index)}  ${kind} ${l.length}>${max}  ${JSON.stringify(l)}`);
    }
  };
  for (const m of src.matchAll(/\b(choose|showCard)\(\s*\[/g)) { const a = m.index + m[0].length - 1; check(m[1] === 'choose' ? 'menu' : 'card', m[1] === 'choose' ? 23 : 26, a, bracket(src, a)); }
  for (const m of src.matchAll(/\bask\(/g)) { const a = src.indexOf('[', m.index), stop = src.indexOf(';', m.index); if (a > 0 && (stop < 0 || a < stop)) check('menu', 23, a, bracket(src, a)); }
  for (const m of src.matchAll(/\bbanner\(\s*(['"`])/g)) { const a = m.index + m[0].length - 1; const e = src.indexOf(m[1], a + 1); check('banner', 24, a, e + 1); }
}
console.log(issues.length ? issues.join('\n') : 'no static overflows');
