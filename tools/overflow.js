// usage: node tools/overflow.js carl|linda|ghost|tp
// Plays the game with the bot (like play.js) and lists every text line drawn past the 160px screen edge.
// px() clips silently, so off-screen text is otherwise invisible to every other check.
const fs = require('fs'), vm = require('vm'), path = require('path');
const game = process.argv[2];
const HERE = __dirname;
process.chdir(path.join(HERE, '..'));
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const mem = {};
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, performance: { now: () => 0 },
  requestAnimationFrame() {}, navigator: {}, console, Math, setInterval() {}, setImmediate, Date, Promise, JSON, Object, Error, Map,
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; }, clear() { for (const k in mem) delete mem[k]; } } };
ctx.window = ctx; vm.createContext(ctx);
const run1 = (s, f) => vm.runInContext(s, ctx, { filename: f });
const FILES = {
  carl: ['js/engine', 'js/audio', 'js/art', 'js/story', 'js/world', 'js/world2', 'js/battle', 'js/mini', 'js/extra'],
  linda: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'linda/lbattle', 'linda/lworld', 'linda/ldays'],
  ghost: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'ghost/gcore', 'ghost/gworld', 'ghost/gshow'],
  tp: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'tp/tcore', 'tp/tshow', 'tp/tquest'],
}[game];
if (process.argv[3]) Object.assign(mem, JSON.parse(process.argv[3]));
for (const f of FILES) run1(fs.readFileSync(f + '.js', 'utf8'), f);
run1('present = function () {};');
const OV = new Map();
ctx.__rec = (line, x) => {
  const k = JSON.stringify(line) + '  x=' + x + ', ' + (x < 0 ? (-x) + 'px off LEFT' : (x + line.length * 6 - 1 - 160) + 'px off RIGHT');
  if (!OV.has(k)) OV.set(k, ((new Error().stack.split('\n')[3] || '').trim().replace(/^at /, '')));
};
run1(`(() => { const T0 = text;
  text = function (s, x, y, c) {
    String(s).split('\\n').forEach((l, i) => { const yy = y + i * 10; if (l.trim() && (x < 0 || x + l.length * 6 - 1 > W) && yy > -8 && yy < H) __rec(l, x); });
    return T0(s, x, y, c);
  }; })()`, 'overflow-hook');
run1(fs.readFileSync(path.join(HERE, 'botlib.js'), 'utf8'), 'botlib');
run1(fs.readFileSync(path.join(HERE, 'bot_' + game + '.js'), 'utf8'), 'bot_' + game);
if (process.env.BOT) run1(fs.readFileSync(path.join(HERE, process.env.BOT), 'utf8'), process.env.BOT);
const report = tag => { console.log(tag, game); console.log('OVERFLOWS (' + OV.size + '):'); for (const [k, v] of OV) console.log('  ' + k + '   <- ' + v); };
run1('RUNBOT()').then(() => report('DONE')).catch(e => { console.log('FAIL', e && e.stack || e); report('PARTIAL'); process.exit(1); });
