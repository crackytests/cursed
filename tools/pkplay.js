// headless PEE KID³ runner: node pkplay.js [startStage] [maxFrames]
const fs = require('fs'), vm = require('vm');
process.chdir('J:/games/gameboycarl/pk');
const LS = {};
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: k => k in LS ? LS[k] : null, setItem: (k, v) => LS[k] = v, removeItem: k => delete LS[k] }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
const R = s => vm.runInContext(s, ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmain'])
  R(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'));
R(fs.readFileSync(__dirname + '/pkbotbody.js', 'utf8'));
const start = +(process.argv[2] || 1), max = +(process.argv[3] || 60000);
R(`BOT.start(${start}, ${max}, ${JSON.stringify(process.env.WANT || '')})`).then(r => console.log(r), e => console.log('ERR', e));
