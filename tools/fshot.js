// FACE screenshots: node tools/fshot.js <stage 1-6> <frame1,frame2,...> [prefix]   (bot plays in god mode; PNGs land in tools/shots/)
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const LS = { pk_meta: JSON.stringify({ kept: 1, cleared: 1 }) };
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'face/shmup', 'face/stages', 'face/story', 'face/poly', 'face/fmain'], LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'fbot.js'), 'utf8'));
G.R(ctx, 'BOT.set(' + JSON.stringify(Object.fromEntries((process.env.WANT || '').split(',').filter(Boolean).map(s => s.split('=')))) + '); DBG.god = 1;');
const st = +process.argv[2] || 1, frames = (process.argv[3] || '300').split(',').map(Number), pre = process.argv[4] || 's' + st;
fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
(async () => {
  G.R(ctx, `anyKey = true; FACE_SCAN = scanPotential(); newRun(); PLR.forms = ['new','old','pilot','dys'].slice(0, Math.max(1, Math.min(4, ${st} - 1))); PLR.lvl = 2; run(() => startStage(${st}));`);
  let T = 0, f = 0;
  for (const target of frames) {
    for (; f < target; f++) { G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); }
    const out = path.join(__dirname, 'shots', pre + '_' + target + '.png'); G.png(ctx, out, 2); console.log('wrote', out, 'stage t=', G.R(ctx, 'SH.t'));
  }
})();
