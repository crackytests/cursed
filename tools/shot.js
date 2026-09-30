// render a gameplay frame to a PNG: node tools/shot.js <stageId> <tileX> <potential> [out.png]
const fs = require('fs'), vm = require('vm'), zlib = require('zlib');
process.chdir('J:/games/gameboycarl/pk');
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmain'])
  vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'), ctx);
const [n, tx, pot, out] = [+process.argv[2] || 1, +process.argv[3] || 5, +process.argv[4] || 50, process.argv[5] || 'shot.png'];
vm.runInContext(`(async () => {
  let T = 0; const step = async k => { for (let i = 0; i < k; i++) { T += 17; loop(T); for (let j = 0; j < 4; j++) await new Promise(r => setImmediate(r)); } };
  PL.unlocked = ['kid', 'wee', 'boy']; SAVE['intro${n}'] = 1; SAVE.hallpass = 1; run(() => startStage(${n})); await step(300);
  PL.cx = ${tx} * TS; respawn(); PL.pot = ${pot}; PL.hurt = 0; await step(20);
})()`, ctx).then(() => {
  const W = 320, H = 224, S = 3, FB = vm.runInContext('FB', ctx), raw = Buffer.alloc((W * S * 4 + 1) * H * S);
  for (let y = 0; y < H * S; y++) for (let x = 0; x < W * S; x++) { const c = FB[((y / S) | 0) * W + ((x / S) | 0)], o = y * (W * S * 4 + 1) + 1 + x * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; }
  const crc = b => { let c, t = []; for (let k = 0; k < 256; k++) { c = k; for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[k] = c >>> 0; } c = 0xffffffff; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W * S, 0); ih.writeUInt32BE(H * S, 4); ih[8] = 8; ih[9] = 6;
  fs.writeFileSync(require('path').join(__dirname, out), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
  console.log('wrote', out);
});
