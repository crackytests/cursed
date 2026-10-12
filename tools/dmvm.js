// headless harness for DARK MONDAY: load scripts into a fake browser, step frames, dump PNGs (512x256 drawn 2x3 so pixels are tall like the real thing)
const fs = require('fs'), vm = require('vm'), zlib = require('zlib'), path = require('path');
const ROOT = path.join(__dirname, '..', 'dm');
const FILES = ['fm', 'x68', 'dmart', 'dmaudio', 'dmgame', 'dmitems', 'dmicons', 'dmmons', 'dmspells', 'dmhud', 'dmgfx', 'dmdata', 'dmlevels2', 'dmmain', 'dmstory', 'dmstory2', 'dmopts', 'dmstills', 'dmflow'];
function load(LS = {}, files = FILES) {
  const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
  const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 1024, innerHeight: 768, performance: { now: () => 0 }, requestAnimationFrame() {}, navigator: {},
    localStorage: { getItem: k => k in LS ? LS[k] : null, setItem: (k, v) => { LS[k] = String(v); }, removeItem: k => { delete LS[k]; } },
    console, Math, setInterval() {}, setTimeout, setImmediate, clearTimeout, Date, Promise, JSON, Object, Array, String, Number, Error, Uint8Array, Uint32Array, Float32Array, Uint8ClampedArray, Map, Set };
  ctx.window = ctx; vm.createContext(ctx);
  for (const f of files) { const p = path.join(ROOT, f + '.js'); if (!fs.existsSync(p)) continue; vm.runInContext(fs.readFileSync(p, 'utf8').replace(/\nboot\(\);\s*$/, '\n'), ctx, { filename: f + '.js' }); }
  return ctx;
}
const R = (ctx, s) => vm.runInContext(s, ctx);
function png(ctx, out, SX = 2, SY = 3, which = 'SCREEN') {
  const W = 512, H = 256, FBv = R(ctx, which), WW = W * SX, raw = Buffer.alloc((WW * 4 + 1) * H * SY);
  for (let y = 0; y < H * SY; y++) for (let x = 0; x < WW; x++) { const c = FBv[((y / SY) | 0) * W + ((x / SX) | 0)], o = y * (WW * 4 + 1) + 1 + x * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; }
  const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (ty, dd) => { const l = Buffer.alloc(4); l.writeUInt32BE(dd.length); const td = Buffer.concat([Buffer.from(ty), dd]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(WW, 0); ih.writeUInt32BE(H * SY, 4); ih[8] = 8; ih[9] = 6;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}
async function step(ctx, n) { for (let i = 0; i < n; i++) { ctx.__T = (ctx.__T || 1e6) + 16.7; R(ctx, `acc=16.7;lastT=${ctx.__T - 16.7};loop(${ctx.__T})`); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); } }
module.exports = { load, R, png, step, ROOT };
