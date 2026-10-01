// which world places can be walked to from a start tile: node tools/swreach.js x y [world]
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files, {}); const R = s => G2.R(ctx, s);
const [x, y, w] = process.argv.slice(2).map(Number);
console.log(R(`G = newGame(); G.world = ${w || 1}; for (const k in PLACES) PLACES[k]._if = PLACES[k].if, PLACES[k].if = null;
  const seen = new Set([${x} + ',' + ${y}]), Q = [[${x}, ${y}]], got = [];
  while (Q.length) { const [a, b] = Q.shift(); const p = Object.keys(PLACES).find(k => PLACES[k].x === a && PLACES[k].y === b); if (p) { got.push(p); if (!(a === ${x} && b === ${y})) continue; }
    for (const [dx, dy] of [[0,1],[1,0],[-1,0],[0,-1]]) { const nx = a + dx, ny = b + dy, k = nx + ',' + ny; if (seen.has(k) || !worldPass(nx, ny)) continue; seen.add(k); Q.push([nx, ny]); } }
  got.join(' ') + '  (' + seen.size + ' tiles)'`));
