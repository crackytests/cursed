// trace the bot in a map: SETUP='...' node tools/sgtrace.js <frames> <every>
const { load, G, FAST } = require('./sgvm'), fs = require('fs'), path = require('path');
const ctx = load({}); G.R(ctx, fs.readFileSync(path.join(__dirname, 'sgbot.js'), 'utf8'));
G.R(ctx, 'BOT.set(' + (process.env.BOTSET || '{}') + '); present = () => {}'); if (!process.env.DRAW) G.R(ctx, FAST);
const [max = 1500, every = 100] = process.argv.slice(2).map(Number);
(async () => {
  G.R(ctx, `anyKey = true; S = newS(); S.ep = ${process.env.EP || 1}; scene = worldScene; post.fade = 0; loadMap('${process.env.MAP || 'studio88'}', ${process.env.TX || 16}, ${process.env.TY || 20}, 'u'); ${process.env.SETUP || ''}`);
  let T = 0;
  for (let f = 0; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (f % every === 0) console.log(f, G.R(ctx, 'JSON.stringify({x: PL.x|0, y: PL.y|0, ph: PL.phase, ec: S.ecto|0, ap: S.applause, hold: WD.hold, dlg: !!DLG, fade: post.fade})'));
  }
})();
