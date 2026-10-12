// find characters the 5x7 font cannot draw in SPOOKY GHOST 2 text
const fs = require('fs'), path = require('path');
const ok = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?'-:/()\"> *+=#&%@$^v[_<;~|{}  ³∞".split(''));
for (const f of fs.readdirSync(path.join(__dirname, '..', 'sg2')).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'sg2', f), 'utf8');
  const re = /'((?:[^'\\n]|\.)*)'/g; let m;
  while ((m = re.exec(src))) {
    const s = m[1].replace(/\'/g, "'").replace(/\n/g, ' ');
    if (!/[a-z]{3}/i.test(s) || /^[#.\w\-]*$/.test(s) && !/\s/.test(s)) continue;
    const bad = [...new Set([...s.toUpperCase()].filter(c => !ok.has(c)))];
    if (bad.length && /[A-Za-z]{3}.*\s/.test(s)) console.log(f + ': ' + JSON.stringify(bad) + '  ' + s.slice(0, 60));
  }
}
