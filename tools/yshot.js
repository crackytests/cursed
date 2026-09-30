// YOKO screenshots: node tools/yshot.js <chapter 0-6> <frame1,frame2,...> [prefix]   (bot plays; PNGs in tools/shots/)
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const LS = { pk_meta: JSON.stringify({ kept: 1, cleared: 1 }), face_meta: JSON.stringify({ cleared: 1, ending: process.env.FACE || 'core', kid: 'freed', restores: 5, integrity: 90, toldGhost: 1 }) };
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'yoko/battle', 'yoko/adv', 'yoko/chapters', 'yoko/chapters2', 'yoko/ymain'], LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'ybot.js'), 'utf8'));
G.R(ctx, 'BOT.set(' + JSON.stringify(Object.fromEntries((process.env.WANT || '').split(',').filter(Boolean).map(s => s.split('=')))) + ');');
const ch = +process.argv[2] || 0, frames = (process.argv[3] || '300').split(',').map(Number), pre = process.argv[4] || 'y' + ch;
fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
(async () => {
  G.R(ctx, `anyKey = true; resetRun(); prepChapter(${ch}); run(() => runFrom(${ch}));`);
  let T = 0, f = 0;
  for (const target of frames) {
    for (; f < target; f++) { G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r)); }
    const out = path.join(__dirname, 'shots', pre + '_' + target + '.png'); G.png(ctx, out, 2); console.log('wrote', out);
  }
})();
