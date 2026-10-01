// FACE RERUNS (boss rush) headless: node tools/freruns.js [maxFrames]   GOD=1 to make the bot unkillable
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'face/shmup', 'face/stages', 'face/story', 'face/content', 'face/poly', 'face/fmain'], { face_meta: JSON.stringify({ cleared: 1, ending: 'core' }) });
G.R(ctx, fs.readFileSync(path.join(__dirname, 'fbot.js'), 'utf8'));
G.R(ctx, 'BOT.set({})'); if (process.env.GOD) G.R(ctx, 'DBG.god = 1');
const max = +(process.argv[2] || 60000);
(async () => {
  G.R(ctx, 'anyKey = true; FACE_SCAN = scanPotential(); run(reruns)');
  let T = 0, lastBoss = '';
  for (let f = 0; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r));
    const b = G.R(ctx, 'SH.boss && !SH.boss.gone ? SH.boss.name : ""'); if (b && b !== lastBoss) { lastBoss = b; console.log('[' + f + '] BOSS', b); }
    if (G.R(ctx, 'FMETA.rerunBest ? 1 : 0')) { console.log('DONE frames=' + f + ' best=' + G.R(ctx, 'FMETA.rerunBest') + 's restores=' + G.R(ctx, 'PLR.restores')); break; }
  }
})().catch(e => console.log('ERR', e));
