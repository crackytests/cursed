// prints a localStorage seed that starts SPOOKY GHOST at episode N: node tools/ghostseed.js 5
const fs = require('fs'), vm = require('vm'), path = require('path');
process.chdir(path.join(__dirname, '..'));
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, performance: { now: () => 0 },
  requestAnimationFrame() {}, navigator: {}, console, Math, setInterval() {}, setImmediate, Date, Promise, JSON, Object, localStorage: { getItem: () => null, setItem() {} } };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'ghost/gcore', 'ghost/gworld', 'ghost/gshow']) vm.runInContext(fs.readFileSync(f + '.js', 'utf8'), ctx);
const n = +process.argv[2] || 3;
const sav = vm.runInContext(`(() => { const S = gState(), E = EPS[${n}], d = MAPS[E.map]; S.ep = ${n}; S.applause = 0; S.ecto = 100; S.total = ${n * 12}; return Object.assign({}, S, { map: E.map, x: d.start[0], y: d.start[1], dir: 'up' }); })()`, ctx);
process.stdout.write(JSON.stringify({ ghost_sav: JSON.stringify(sav) }));
