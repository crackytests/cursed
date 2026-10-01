// regression: the player must not move while a dialog is up. node tools/freezecheck.js
const fs = require('fs'), vm = require('vm');
process.chdir('J:/games/gameboycarl/pk');
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmore', 'pkmain'])
  vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'), ctx);
vm.runInContext(`(async () => {
  let T = 0; const step = async (n, keys = {}) => { for (let i = 0; i < n; i++) { for (const k of BTNS) kb[k] = keys[k] ? 1 : 0; T += 17; loop(T); for (let j = 0; j < 4; j++) await new Promise(r => setImmediate(r)); } };
  SAVE.intro1 = 1; run(() => startStage(1)); await step(300);
  await step(40, { right: 1 });                       // running at full speed
  run(() => say('TEST DIALOG')); await step(2, { right: 1 });
  const x0 = PL.x, y0 = PL.y; await step(120, { right: 1 });  // hold right the whole time the box is up
  const ok1 = PL.x === x0 && PL.y === y0;
  await step(3, { a: 1 }); await step(5);
  await step(10, { right: 1, b: 1 });                 // mid-jump
  run(() => say('MID-AIR')); await step(2);
  const x1 = PL.x, y1 = PL.y; await step(120);
  const ok2 = PL.x === x1 && PL.y === y1;
  await step(3, { a: 1 }); await step(30, { right: 1 });
  const ok3 = PL.x > x1;                               // control comes back after the box closes
  console.log(ok1 && ok2 && ok3 ? 'PASS' : 'FAIL', JSON.stringify({ ok1, ok2, ok3 }));
})()`, ctx);
