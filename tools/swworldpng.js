// render the SAVE THE WORLD overworld to a PNG (one pixel per tile, scaled): node tools/swworldpng.js [1|2] [out]
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files);
const n = +(process.argv[2] || 1);
G2.R(ctx, `G = newGame(); G.world = ${n}; const g = buildWorld(${n}); cls(BLACK);
  for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) { const c = hex(OW_COL[g[y][x]] || '#ff00ff'); rectF(x * 2, y * 2, 2, 2, c); }
  for (const k in PLACES) { const p = PLACES[k]; rectF(p.x * 2 - 1, p.y * 2 - 1, 4, 4, hex('#ff2424')); text(k.slice(0, 6).toUpperCase(), p.x * 2 + 4, p.y * 2 - 3, WHITE, BLACK); }`);
G2.png(ctx, path.join(__dirname, process.argv[3] || 'shots/sw_world' + n + '.png'), 3);
