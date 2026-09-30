// run the bot from a set-up state instead of from boot: SETUP='js' [WANT=...] node tools/c2scene.js [maxFrames]
// e.g. SETUP='C2.ep = 1; C2.lv = 2; setF2("power"); setF2("met"); loadMap("sequel", 10, 14, "u")' node tools/c2scene.js 30000
const { load, G } = require('./c2vm'), fs = require('fs'), path = require('path');
const ctx = load({ carl_meta: '{"endings":1}' });
G.R(ctx, fs.readFileSync(path.join(__dirname, 'c2bot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
G.R(ctx, 'present = () => {}; { const wd = worldScene.draw; worldScene.draw = () => { if (DBG.wantDraw) wd(); }; }');
const max = +(process.argv[2] || 30000), until = process.env.UNTIL || 'false';
(async () => {
  G.R(ctx, `anyKey = true; C2 = newC2(); resetPL(); scene = worldScene; post.fade = 0; ${process.env.SETUP || ''}`);
  let T = 0, f = 0;
  for (; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, until)) break;
  }
  console.log('END f=' + f + ' ' + G.R(ctx, `JSON.stringify({ map: WD.id, ep: C2.ep, hp: C2.hp, lv: C2.lv, cools: C2.cools || 0, obj: OBJ && OBJ.text, hold: WD.hold, lock: WD.lock, arena: WD.arena, until: !!(${until}) })`) + (process.env.PRINT ? ' ' + G.R(ctx, process.env.PRINT) : ''));
})().catch(e => console.log('ERR', e));
