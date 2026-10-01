// run arbitrary code in a loaded SAVE THE WORLD context, stepping frames: node tools/swrun.js "<setup js>" [frames] ["<print js>"]
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files, {}); const R = s => G2.R(ctx, s);
ctx.__log = s => console.log(s);
R(`DBG.fast = 1; const _say1 = say1; say1 = async function (s, who, o) { __log('[' + frame + '] ' + (who ? who + ': ' : '') + s); return _say1(s, who, o); };`);
(async () => {
  R(process.argv[2]);
  const n = +(process.argv[3] || 60);
  for (let i = 0; i < n; i++) { R(`for (const k of BTNS) kb[k] = 0; ${process.env.KEYS || ''}`); R('pollInput(); frame++; if (scene && scene.update) scene.update(); { const w = waiters; waiters = []; w.forEach(r => r()); }'); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); }
  if (process.argv[4]) console.log(R(process.argv[4]));
  if (process.env.SHOT) { R('if (scene && scene.draw) scene.draw(); drawOverlay();'); G2.png(ctx, path.join(__dirname, 'shots', process.env.SHOT), 2); }
})().catch(e => console.log('FATAL', e.stack));
