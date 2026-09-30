// shared headless harness for SUPER-16 games: load scripts into a fake browser, step frames, dump PNGs
// usage from other tools: const G = require('./g2vm'); const ctx = G.load(['g2/engine2', 'g2/fm', 'face/fart', ...]);
const fs = require('fs'), vm = require('vm'), zlib = require('zlib'), path = require('path');
const ROOT = path.join(__dirname, '..');
function makeCtx(LS = {}) {
  const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
  const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
    localStorage: { getItem: k => k in LS ? LS[k] : null, setItem: (k, v) => { LS[k] = String(v); }, removeItem: k => { delete LS[k]; } },
    console, Math, setInterval() {}, setTimeout, setImmediate, clearTimeout, Date, Promise, JSON, Object, Array, String, Number, Uint8Array, Uint32Array, Float32Array, Uint8ClampedArray, Map, Set };
  ctx.window = ctx; vm.createContext(ctx); ctx.__LS = LS; return ctx;
}
// files are repo-relative without .js; the auto-boot line at the end of a main file is stripped
function load(files, LS) {
  const ctx = makeCtx(LS);
  for (const f of files) {
    const src = fs.readFileSync(path.join(ROOT, f + '.js'), 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n');
    vm.runInContext(src, ctx, { filename: f + '.js' });
  }
  return ctx;
}
const R = (ctx, s) => vm.runInContext(s, ctx);
function png(ctx, out, S = 3) {
  const W = 320, H = 224, FB = R(ctx, 'FB'), raw = Buffer.alloc((W * S * 4 + 1) * H * S);
  for (let y = 0; y < H * S; y++) for (let x = 0; x < W * S; x++) { const c = FB[((y / S) | 0) * W + ((x / S) | 0)], o = y * (W * S * 4 + 1) + 1 + x * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; }
  const crc = b => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xffffffff; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W * S, 0); ih.writeUInt32BE(H * S, 4); ih[8] = 8; ih[9] = 6;
  fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}
// run the game loop for n frames with fake time; yields to pending promises between frames
async function step(ctx, n) {
  for (let i = 0; i < n; i++) {
    ctx.__T = (ctx.__T || 0) + 16.7; R(ctx, `loop(${ctx.__T})`);
    for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r));
  }
}
module.exports = { load, R, png, step, makeCtx, ROOT };
