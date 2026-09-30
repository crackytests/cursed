// usage: node play.js carl|linda|ghost   — plays the whole game headless with button inputs only
const fs = require('fs'), vm = require('vm'), path = require('path');
const game = process.argv[2];
const HERE = __dirname;
process.chdir('J:/games/gameboycarl');
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const mem = {};
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, performance: { now: () => 0 },
  requestAnimationFrame() {}, navigator: {}, console, Math, setInterval() {}, setImmediate, Date, Promise, JSON, Object, Error,
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; }, clear() { for (const k in mem) delete mem[k]; } } };
ctx.window = ctx; vm.createContext(ctx);
const run1 = (s, f) => vm.runInContext(s, ctx, { filename: f });
const FILES = {
  carl: ['js/engine', 'js/audio', 'js/art', 'js/story', 'js/world', 'js/world2', 'js/battle', 'js/mini', 'js/extra'],
  linda: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'linda/lbattle', 'linda/lworld', 'linda/ldays'],
  ghost: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'ghost/gcore', 'ghost/gworld', 'ghost/gshow'],
  tp: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'tp/tcore', 'tp/tshow', 'tp/tquest'],
}[game];
if (process.argv[3]) Object.assign(mem, JSON.parse(process.argv[3])); // pre-seeded localStorage (cross-cart tests)
for (const f of FILES) run1(fs.readFileSync(f + '.js', 'utf8'), f);
run1('present = function () {};');
run1(fs.readFileSync(path.join(HERE, 'botlib.js'), 'utf8'), 'botlib');
run1(fs.readFileSync(path.join(HERE, 'bot_' + game + '.js'), 'utf8'), 'bot_' + game);
if (process.env.BOT) run1(fs.readFileSync(path.join(HERE, process.env.BOT), 'utf8'), process.env.BOT);
const t0 = Date.now();
run1('RUNBOT()').then(() => { console.log('DONE', game, 'frames', run1('FR'), '(' + Math.round(run1('FR') / 3600) + ' min of play)', Math.round((Date.now() - t0) / 1000) + 's real');
  console.log('STORAGE', JSON.stringify(Object.keys(mem))); })
  .catch(e => { console.log('FAIL', e && e.stack || e); console.log('DIAG', run1('diag()')); process.exit(1); });
