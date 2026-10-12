// run one dance with the bot: node tools/sgdancetest.js <CONFIGNAME> [honest]
const { load, G, FAST } = require('./sgvm'), fs = require('fs'), path = require('path');
const ctx = load({}); G.R(ctx, fs.readFileSync(path.join(__dirname, 'sgbot.js'), 'utf8')); G.R(ctx, FAST);
const cfg = process.argv[2] || 'DANCER_PATTY';
(async () => {
  G.R(ctx, `anyKey = true; S = newS(); scene = worldScene; loadMap('studio88', 16, 20, 'u'); run(async () => { DBG.res = await boogaloo(Object.assign({}, ${cfg})); DBG.fin = 1; })`);
  let T = 0;
  for (let f = 0; f < 20000; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, 'DBG.fin')) { console.log('DONE f=' + f, G.R(ctx, 'JSON.stringify(DBG.res)')); return; }
  }
  console.log('NO FINISH', G.R(ctx, 'JSON.stringify({t: DANCE.t, last: DANCE.last, meter: DANCE.meter, res: DANCE.res, want: DANCE.want})'));
})();
