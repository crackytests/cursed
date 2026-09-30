// headless YOKO runner: WANT="end=restore|empire|open|true,over=0|1" FACE=core|kid|viewers|nothing|dyslexio|none PK=kept|letgo|none node tools/yplay.js [maxFrames]
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const LS = {};
const pk = process.env.PK || 'kept', fc = process.env.FACE || 'core';
if (pk === 'kept') LS.pk_meta = JSON.stringify({ cleared: 1, kept: 1, endings: 1, dog: 1 });
if (pk === 'letgo') LS.pk_meta = JSON.stringify({ cleared: 1, letgo: 1, endings: 1 });
if (fc !== 'none') LS.face_meta = JSON.stringify({ cleared: 1, ending: fc, sponsor: 1, toldGhost: 1, kid: process.env.KID || (pk === 'letgo' ? 'absent' : fc === 'kid' ? 'took' : 'freed'), apologized: 1, restores: 7, integrity: 88 });
if (process.env.ALLMETA) { LS.carl_meta = JSON.stringify({ endings: 1, secret: 1 }); LS.ghost_meta = JSON.stringify({ endings: 1 }); LS.tp_mem = JSON.stringify({ done: 1, vault: true, msgs: ['hello chat'] }); LS.linda_meta = JSON.stringify({ endings: 1 }); }
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'yoko/battle', 'yoko/adv', 'yoko/chapters', 'yoko/chapters2', 'yoko/ymain'], LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'ybot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
const max = +(process.argv[2] || 150000);
(async () => {
  if (process.env.CH) G.R(ctx, `anyKey = true; resetRun(); prepChapter(${process.env.CH}); run(() => runFrom(${process.env.CH}));`); else G.R(ctx, 'run(boot)');
  let T = 0;
  for (let f = 0; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, 'DBG.ending && MENUS.length > 0 && MENUS[0].opts.join("").includes("NEW GAME")')) { console.log('DONE ending=' + G.R(ctx, 'DBG.ending') + ' frames=' + f); break; }
    if (process.env.SHOTS && f % +process.env.SHOTS === 0) G.png(ctx, path.join(__dirname, 'shots', 'y' + String(f).padStart(6, '0') + '.png'), 2);
  }
  console.log('YMETA', G.R(ctx, 'JSON.stringify(YMETA)'));
  console.log('YREC', G.R(ctx, 'JSON.stringify(YREC)'));
  console.log('DEBATE', G.R(ctx, 'JSON.stringify(DBG.debateResult || null)'));
})().catch(e => console.log('ERR', e));
