// screenshot a SPOOKY GHOST 2 map: node tools/sgshot.js <map> <tx> <ty> [frames] [out]
const { load, G } = require('./sgvm'), path = require('path');
const [map, tx = 5, ty = 5, fr = 30, out] = process.argv.slice(2);
const ctx = load();
G.R(ctx, `anyKey = true; S = newS(); S.ep = ${process.env.EP || 1}; scene = worldScene; post.fade = 0; loadMap('${map}', ${tx}, ${ty}, 'd'); ${process.env.SETUP || ''}`);
(async () => {
  await G.step(ctx, +fr);
  const o = out || path.join(__dirname, 'shots', 'sg_' + map + '.png'); G.png(ctx, o, 2); console.log('wrote', o);
})().catch(e => console.log('ERR', e));
