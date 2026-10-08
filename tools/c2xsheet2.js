const { load, G } = require('./c2xvm'), path = require('path');
const ctx = load();
G.R(ctx, `cls(hex('#406080'));
  [0, 1, 4].forEach((oi, r) => { const S = carlSet(OUTFITS[oi]); POSES.forEach((p, i) => drawScaled(S[p][p === 'run' ? 0 : 1], 2 + i * 32, 2 + r * 74, S.P, 1.5)); POSES.slice(0,4).forEach((p,i)=>drawScaled(S.run[i], 2 + i * 32, 40 + r * 74, S.P, 1.5)); });`);
G.png(ctx, path.join(__dirname, 'shots', 'x_sheet2.png'), 3); console.log('ok');
