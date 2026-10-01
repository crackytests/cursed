// print a PEE KID³ level's tile grid: node tools/pkgrid.js <stageId> [rowFrom] [rowTo]
const fs = require('fs'), vm = require('vm'), path = require('path');
process.chdir(path.join(__dirname, '..', 'pk'));
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {}, localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmore', 'pkmain']) vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'), ctx);
const [id, a = 0, b = 999] = process.argv.slice(2).map(Number);
const G = vm.runInContext(`(() => { const st = STAGES[${id}], L = st.build(); if (st.boss && BOSSES[st.boss].arena) arenaize(L, st); return L.g.map(r => r.join('')); })()`, ctx);
G.forEach((r, i) => { if (i >= a && i <= b) console.log(String(i).padStart(2) + ' ' + r); });
