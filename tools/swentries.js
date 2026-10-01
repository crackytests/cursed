// every place / exit lands on a walkable tile
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files, {}); const R = s => G2.R(ctx, s);
console.log(R(`G = newGame(); (() => { const out = []; const chk = (m, x, y, why) => { const d = MAPS[m]; if (!d) return out.push('no map ' + m); const c = (d.rows[y] || '')[x]; if (c === undefined || c === ' ' || SW_SOLID.has(c)) out.push(why + ' -> ' + m + ' ' + x + ',' + y + ' is ' + JSON.stringify(c)); };
  for (const k in PLACES) { const p = PLACES[k]; if (p.to) chk(p.to[0], p.to[1], p.to[2], 'place ' + k); }
  for (const id in MAPS) for (const e of MAPS[id].exits || []) if (e.to && e.to !== 'world') chk(e.to, e.tx, e.ty, 'exit ' + id + '(' + e.x + ',' + e.y + ')');
  return out.join(String.fromCharCode(10)) || 'all entries ok'; })()`));
