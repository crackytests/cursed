// render a sprite/portrait sheet to sheet.png: node sheet.js [extra draw code]
const fs = require('fs'), vm = require('vm'), zlib = require('zlib');
process.chdir('J:/games/gameboycarl/pk');
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart']) vm.runInContext(fs.readFileSync(f + '.js', 'utf8'), ctx);
const code = process.argv[2] || `
cls(hex('#808890'));
['kid','wee','boy'].forEach((a,i)=>{ const K=KID[a]; [K.stand,K.run[0],K.run[2],K.jump,K.ask,K.act[0]].forEach((s,j)=>drawScaled(s,4+j*52,4+i*74,KIDPAL[a],2)); });
['kid','wee','boy'].forEach((a,i)=>draw(PORT[ASPN[i]].s, 4+i*52, 226-50, PORT[ASPN[i]].P));
draw(WEE_SHOCK.s, 160, 176, WEE_SHOCK.P);`;
vm.runInContext(`var ASPN=['PEE KID','PEE-WEE KID','PEE BOY'];` + code, ctx);
const W = 320, H = 224, FB = vm.runInContext('FB', ctx), S = +(process.argv[3] || 3);
const raw = Buffer.alloc((W * S * 4 + 1) * H * S);
for (let y = 0; y < H * S; y++) { raw[y * (W * S * 4 + 1)] = 0; for (let x = 0; x < W * S; x++) { const c = FB[((y / S) | 0) * W + ((x / S) | 0)], o = y * (W * S * 4 + 1) + 1 + x * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; } }
const crc = b => { let c, t = []; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } c = 0xffffffff; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ih = Buffer.alloc(13); ih.writeUInt32BE(W * S, 0); ih.writeUInt32BE(H * S, 4); ih[8] = 8; ih[9] = 6;
fs.writeFileSync(__dirname + '/' + (process.argv[4] || 'sheet.png'), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('wrote');
