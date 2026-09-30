// regression: standing still must count as on-ground every frame (UP at doors depends on it). node tools/groundcheck.js
const fs = require('fs'), vm = require('vm');
process.chdir('J:/games/gameboycarl/pk');
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmain'])
  vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'), ctx);
vm.runInContext(`(async () => {
  let T = 0; const step = async (n, keys = {}) => { for (let i = 0; i < n; i++) { for (const k of BTNS) kb[k] = keys[k] ? 1 : 0; T += 17; loop(T); for (let j = 0; j < 4; j++) await new Promise(r => setImmediate(r)); } };
  SAVE.intro1 = 1; run(() => startStage(1)); await step(300);
  const res = {};
  for (const asp of ['kid', 'wee', 'boy']) { PL.asp = asp; PL.cx = 36 * TS; respawn(); await step(30); let on = 0; for (let i = 0; i < 30; i++) { await step(1); on += PL.on ? 1 : 0; } res[asp] = on; }
  PL.asp = 'kid'; PL.cx = 13 * TS; PL.cy = 8 * TS + 8; respawn(); await step(30); let onP = 0; for (let i = 0; i < 30; i++) { await step(1); onP += PL.on ? 1 : 0; } res.platform = onP;  // one-way '=' at 12-14,row 9
  PL.cx = 36 * TS; PL.cy = 11 * TS + 8; respawn(); PL.pot = 80; await step(30); PL.hurt = 0;
  await step(1, { up: 1 }); await step(3); res.bathroomMenu = !!(DLG && DLG.lines.join(' ').includes('BATHROOM'));          // one tap of UP must open it
  const ok = res.kid === 30 && res.wee === 30 && res.boy === 30 && res.platform === 30 && res.bathroomMenu;
  console.log(ok ? 'PASS' : 'FAIL', JSON.stringify(res));
})()`, ctx);
