// screenshot a fight in progress: SETUP='js' [UNTIL='js'] node tools/c2fight.js <name> [frames]
// The bot plays (in god mode); FRAMES after UNTIL first holds, it saves tools/shots/fight_<name>.png.
const { load, G } = require('./c2vm'), fs = require('fs'), path = require('path');
const ctx = load({ carl_meta: '{"endings":1}' });
G.R(ctx, fs.readFileSync(path.join(__dirname, 'c2bot.js'), 'utf8')); G.R(ctx, 'BOT.set({}); DBG.god = 1');
const name = process.argv[2] || 'fight', N = +(process.argv[3] || 600);
(async () => {
  G.R(ctx, `anyKey = true; C2 = newC2(); resetPL(); scene = worldScene; post.fade = 0; ${process.env.SETUP || ''}`);
  let T = 0, hit = -1; for (let f = 0; f < 20000; f++) { if (hit < 0 && G.R(ctx, process.env.UNTIL || 'true')) hit = f; if (hit >= 0 && f - hit >= N) break; G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`); await new Promise(r => setImmediate(r)); }
  G.png(ctx, path.join(__dirname, 'shots', 'fight_' + name + '.png'), 2); console.log('saved', name, G.R(ctx, 'JSON.stringify({ map: WD.id, boss: WD.bossE && WD.bossE.name, arena: WD.arena })'));
})();
