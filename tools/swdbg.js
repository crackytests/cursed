// run the bot from a state for N frames, then evaluate an expression: STATE=x node tools/swdbg.js N "expr"
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files, {}); const R = s => G2.R(ctx, s); ctx.__log = s => { if (process.env.LOG) console.log(s); };
R(fs.readFileSync(path.join(__dirname, 'swbot.js'), 'utf8')); R('DBG.fast = 1');
R(require('./swstates')[process.env.STATE]);
(async () => { const n = +process.argv[2]; for (let f = 0; f < n; f++) { R('for (const k of BTNS) kb[k] = 0; BOT.tick(); pollInput(); frame++; if (scene && scene.update) scene.update(); { const w = waiters; waiters = []; w.forEach(r => r()); }'); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); }
  console.log(R(process.argv[3])); })();
