// contact sheet of every camera in the given CARL 3 scenes: node tools/c3cams.js out.png scene1 scene2 ...   (env STOP, FLAGS)
// Carl stands in the middle of each camera's zone when he can, so you see him at that camera's scale.
const { load, G } = require('./c3vm'), fs = require('fs'), zlib = require('zlib');
const [out, ...ids] = process.argv.slice(2);
const ctx = load({}); G.R(ctx, 'present = () => {}');
G.R(ctx, `anyKey = true; C3 = newC3(); ensure3(); C3.stop = ${process.env.STOP || 1}; ${(process.env.FLAGS || '').split(',').filter(Boolean).map(f => `setF3('${f}');`).join('')} scene = worldScene3; post.fade = 0;`);
const shots = [];
for (const id of ids) {
  const cams = G.R(ctx, `(loadScene('${id}'), WX.banner = null, SCENES['${id}'].cams.map(c => c.id))`);
  for (const c of cams) {
    G.R(ctx, `(() => { const sc = WX.sc, c = sc.cams.find(c => c.id === '${c}'); let p = sc.start;
      if (c.zone) { const x = (Math.max(c.zone[0], -60) + Math.min(c.zone[2], 60)) / 2, z = (Math.max(c.zone[1], -60) + Math.min(c.zone[3], 60)) / 2; if (walkable(x, z)) p = [x, 0, z]; }
      CARL.p = [p[0], 0, p[2]]; WX.camId = c.id; WX.bg = sceneBG(sc, c.id); WX.cut = 0; drawWorld3(); text('${id}:${c}', 4, H - 10, hex('#ffff00'), BLACK); })()`);
    shots.push(Int32Array.from(G.R(ctx, 'FB')));
  }
}
// grid, 3 across, at 1x
const W = 320, H = 224, COLS = 3, rows = Math.ceil(shots.length / COLS), OW = W * COLS, OH = H * rows, raw = Buffer.alloc((OW * 4 + 1) * OH);
shots.forEach((fb, k) => { const ox = (k % COLS) * W, oy = Math.floor(k / COLS) * H; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = fb[y * W + x], o = (oy + y) * (OW * 4 + 1) + 1 + (ox + x) * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; } });
const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ih = Buffer.alloc(13); ih.writeUInt32BE(OW, 0); ih.writeUInt32BE(OH, 4); ih[8] = 8; ih[9] = 6;
fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('wrote', out, shots.length, 'cams');
