// list characters in SAVE THE WORLD's string literals that the 5x7 font can't draw
const fs = require('fs'), G2 = require('./g2vm');
const ctx = G2.load(['g2/engine2'], {}); const FONT = G2.R(ctx, 'FONT');
const bad = {};
for (const f of fs.readdirSync(__dirname + '/../stw').filter(f => f.endsWith('.js'))) {
  const s = fs.readFileSync(__dirname + '/../stw/' + f, 'utf8');
  const re = /'((?:[^'\\\n]|\\.)*)'/g; let m;
  while ((m = re.exec(s))) {
    const str = m[1].replace(/\\'/g, "'");
    if (!/[A-Z]{3}/.test(str)) continue; // only text-looking strings
    for (const ch of str.toUpperCase()) { if (ch === ' ' || FONT[ch]) continue; (bad[ch] = bad[ch] || []).length < 3 && bad[ch].push(f + ': ' + str.slice(0, 60)); }
  }
}
console.log(Object.keys(bad).length ? JSON.stringify(bad, null, 1) : 'all glyphs ok');
