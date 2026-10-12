// headless SPOOKY GHOST 2 runner: WANT="end=stayed|encore,honest=1,cards=1" SETUP='js' UNTIL='js' node tools/sgplay.js [maxFrames]
const { load, G } = require('./sgvm'), fs = require('fs'), path = require('path');
const LS = {}; if (process.env.LS) Object.assign(LS, JSON.parse(process.env.LS));
const ctx = load(LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'sgbot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v === '1' ? true : v === '0' ? false : v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
if (process.env.FAST !== '0') G.R(ctx, `loop = function (t) { acc = Math.min(acc + (t - lastT), 50); lastT = t; if (acc >= 16) { acc -= 16.667; pollInput(); frame++; if (scene && scene.update) scene.update(); const w = waiters; waiters = []; w.forEach(r => r()); } };`);
const max = +(process.argv[2] || 60000), until = process.env.UNTIL || 'DBG.credits';
(async () => {
  G.R(ctx, `anyKey = true; ${process.env.SETUP || 'run(gnewGame)'}`);
  let T = 0, f = 0, lastEp = -1;
  for (; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (f % 600 === 0) { const ep = G.R(ctx, 'S ? S.ep : 0'); if (ep !== lastEp) { lastEp = ep; console.log('[' + f + '] --- EP', ep); } }
    if (G.R(ctx, until)) break;
  }
  console.log('END f=' + f + ' ' + G.R(ctx, `JSON.stringify({ map: WD.id, ep: S && S.ep, ap: S && S.applause, total: S && S.total, honesty: S && S.honesty, cards: S && S.cards.length, mode: DBG.mode })`));
})().catch(e => console.log('ERR', e));
