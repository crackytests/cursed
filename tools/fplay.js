// headless FACE runner: WANT="sponsor=1,ghost=truth,kid=take,apology=1,soul=core" PK=kept|letgo|none GOD=1 node tools/fplay.js [maxFrames] [startStage]
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const LS = {};
const pk = process.env.PK || 'kept';
if (pk === 'kept') LS.pk_meta = JSON.stringify({ cleared: 1, kept: 1, endings: 1 });
if (pk === 'letgo') LS.pk_meta = JSON.stringify({ cleared: 1, letgo: 1, endings: 1 });
if (process.env.ALLMETA) { LS.carl_meta = JSON.stringify({ boots: 3, endings: 1, secret: 1 }); LS.linda_meta = JSON.stringify({ endings: 1 }); LS.ghost_meta = JSON.stringify({ endings: 1 }); LS.tp_mem = JSON.stringify({ done: 1, vault: true }); }
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'face/shmup', 'face/stages', 'face/story', 'face/poly', 'face/fmain'], LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'fbot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
if (process.env.GOD) G.R(ctx, 'DBG.god = 1');
const max = +(process.argv[2] || 60000), start = +(process.argv[3] || 0);
(async () => {
  if (start) G.R(ctx, `anyKey = true; FACE_SCAN = scanPotential(); newRun(); PLR.forms = ['new','old','pilot','dys'].slice(0, Math.max(1, Math.min(4, ${start} - 1))); if (${!!process.env.LETTERS}) PLR.letters = [...'DYSLEXIO']; run(() => startStage(${start}));`);
  else G.R(ctx, 'run(boot)');
  let T = 0;
  for (let f = 0; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, 'DBG.ending && MENUS.length > 0 && MENUS[0].opts.join("").includes("NEW GAME")')) { console.log('DONE ending=' + G.R(ctx, 'DBG.ending') + ' frames=' + f); break; }
    if (process.env.SHOTS && f % +process.env.SHOTS === 0) G.png(ctx, path.join(__dirname, 'shots', 'f' + String(f).padStart(6, '0') + '.png'), 2);
  }
  console.log('META', G.R(ctx, 'JSON.stringify(FMETA)'));
  console.log('deaths', G.R(ctx, 'DBG.deaths || 0'), 'integrity', G.R(ctx, 'PLR.integrity'), 'letters', G.R(ctx, 'PLR.letters.join("")'), 'anagrams', G.R(ctx, 'DBG.anagrams||0'));
})().catch(e => console.log('ERR', e));
