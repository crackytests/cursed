// PEE KID³ viewer: node tools/pkview.js <stageId> <tileX> <tileY|-> <f1,f2,...> [asp] [prefix]
// Starts the section (intro skipped), puts the kid at (tileX, tileY), auto-advances dialogs, and saves PNGs at the given frames.
// tileX past the arena start triggers the boss. The kid stands still (a dummy) so you can see the attacks.
const fs = require('fs'), vm = require('vm'), path = require('path'), zlib = require('zlib');
process.chdir(path.join(__dirname, '..', 'pk'));
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, requestAnimationFrame() {}, navigator: {},
  localStorage: { getItem: () => null, setItem() {} }, console, Math, setInterval() {}, setTimeout, setImmediate, Date, Promise, JSON, Object };
ctx.window = ctx; vm.createContext(ctx);
for (const f of ['../g2/engine2', '../g2/fm', 'pkart', 'pkplat', 'pkstages', 'pkstory', 'pkmore', 'pkmain'])
  vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nfit\(\); requestAnimationFrame\(loop\); run\(boot\);\s*$/, '\n'), ctx);
const [n, tx, tyArg, framesArg, asp = 'kid', pre] = process.argv.slice(2);
const frames = (framesArg || '60').split(',').map(Number), R = s => vm.runInContext(s, ctx);
function png(out) {
  const W = 320, H = 224, S = 2, FB = R('FB'), raw = Buffer.alloc((W * S * 4 + 1) * H * S);
  for (let y = 0; y < H * S; y++) for (let x = 0; x < W * S; x++) { const c = FB[((y / S) | 0) * W + ((x / S) | 0)], o = y * (W * S * 4 + 1) + 1 + x * 4; raw[o] = c & 255; raw[o + 1] = (c >> 8) & 255; raw[o + 2] = (c >> 16) & 255; raw[o + 3] = 255; }
  const crc = b => { let c, t = []; for (let k = 0; k < 256; k++) { c = k; for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[k] = c >>> 0; } c = 0xffffffff; for (const x of b) c = t[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W * S, 0); ih.writeUInt32BE(H * S, 4); ih[8] = 8; ih[9] = 6;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
}
(async () => {
  let T = 0, f = 0;
  const step = async k => { for (let i = 0; i < k; i++) { const tick = R('(DLG || CARD || MENUS.length) ? 1 : 0'); R(`for (const k of BTNS) kb[k] = 0; if (${tick} && frame % 4 === 0) kb.a = 1;`); T += 17; R(`loop(${T})`); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); f++; } };
  R(`PL.unlocked = ['kid', 'wee', 'boy']; for (const k of ORDER) SAVE['intro' + k] = 1; SAVE.hallpass = 1; run(() => startStage(${n}));`); await step(260);
  R(`PL.asp = '${asp}'; PL.cx = ${tx} * TS; ${tyArg && tyArg !== '-' ? 'PL.cy = ' + tyArg + ' * TS + 8;' : ''} respawn(); PL.hurt = 0; DBG.godPK = 1;`);
  R(`const h0 = hurt; hurt = () => {};`); // the dummy can't be hurt
  f = 0;
  for (const target of frames) { await step(target - f); const out = path.join(__dirname, 'shots', (pre || 'pk' + n) + '_' + target + '.png'); png(out); console.log('wrote', out, R('JSON.stringify({ boss: BOSS && BOSS.def.name, hp: BOSS && BOSS.hp, open: BOSS && BOSS.open, camY: Math.round(camY), ents: ENTS.length })')); }
})().catch(e => console.log('ERR', e.stack));
