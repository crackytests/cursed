// headless CARL 3 runner: WANT="claim=maintenance,ending=signed" SETUP='js' UNTIL='js' node tools/c3play.js [maxFrames]
const { load, G, FAST } = require('./c3vm'), fs = require('fs'), path = require('path');
const ctx = load({}); G.R(ctx, fs.readFileSync(path.join(__dirname, 'c3bot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v === '1' ? true : v === '0' ? false : v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
if (process.env.FAST !== '0') G.R(ctx, FAST);
const max = +(process.argv[2] || 100000), until = process.env.UNTIL || 'DBG.end';
(async () => {
  G.R(ctx, `anyKey = true; ${process.env.SETUP || 'run(newGame3)'}`);
  let T = 0, f = 0, lastStop = -1;
  for (; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (f % 600 === 0) { const st = G.R(ctx, 'C3 ? C3.stop : -1'); if (st !== lastStop) { lastStop = st; console.log('[' + f + '] --- STOP', st); } }
    if (G.R(ctx, until)) break;
  }
  console.log('END f=' + f + ' ' + G.R(ctx, `JSON.stringify({ scene: WX.id, stop: C3 && C3.stop, obj: OBJ3 && OBJ3.text, flags: C3 && Object.keys(C3.flags).length, lies: C3 && C3.lies, sus: C3 && C3.suspicion })`));
})().catch(e => console.log('ERR', e));
