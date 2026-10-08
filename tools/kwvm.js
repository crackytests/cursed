// headless harness for KONBINI WARS: same fake browser as dmvm.js, pointed at kw/
const fs = require('fs'), vm = require('vm'), path = require('path'), D = require('./dmvm.js');
const ROOT = path.join(__dirname, '..', 'kw');
const FILES = ['fm', 'x68', 'kwdata', 'kwsim', 'kwui', 'kwart', 'kwaudio', 'kwstore', 'kwmap', 'kwfx', 'kwcast', 'kwmain'];
function load(LS = {}, files = FILES) {
  const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
  const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 1024, innerHeight: 768, performance: { now: () => 0 }, requestAnimationFrame() {}, navigator: {},
    localStorage: { getItem: k => k in LS ? LS[k] : null, setItem: (k, v) => { LS[k] = String(v); }, removeItem: k => { delete LS[k]; } },
    console, Math, setInterval() {}, setTimeout, setImmediate, clearTimeout, Date, Promise, JSON, Object, Array, String, Number, Error, Uint8Array, Int8Array, Int16Array, Uint16Array, Uint32Array, Float32Array, Uint8ClampedArray, Map, Set };
  ctx.window = ctx; vm.createContext(ctx);
  for (const f of files) { const p = path.join(ROOT, f + '.js'); if (!fs.existsSync(p)) continue; vm.runInContext(fs.readFileSync(p, 'utf8').replace(/\nboot\(\);\s*$/, '\n'), ctx, { filename: f + '.js' }); }
  return ctx;
}
module.exports = { load, R: D.R, png: D.png, step: D.step, ROOT, LS: null };
