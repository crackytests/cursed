// headless CARL 2 runner: WANT="end=boogaloo|renewed|canceled|dream|belowbelow,tapes=1,comp=garf" META=all|none GOD=1 node tools/c2play.js [maxFrames]
const { load, G } = require('./c2vm'), fs = require('fs'), path = require('path');
const LS = {};
if (process.env.META !== 'none') {
  LS.carl_meta = JSON.stringify({ boots: 2, endings: 1, secret: process.env.SECRET ? 1 : 0 });
  LS.face_meta = JSON.stringify({ cleared: 1, ending: process.env.FACEEND || 'core' });
  LS.pk_meta = JSON.stringify({ cleared: 1, kept: 1 });
  LS.yoko_meta = JSON.stringify({ cleared: 1, ends: process.env.YOKO === 'true' ? { true: 1 } : { restore: 1 }, perma: process.env.YOKO === 'empire' ? 1 : 0 });
}
const ctx = load(LS);
G.R(ctx, fs.readFileSync(path.join(__dirname, 'c2bot.js'), 'utf8'));
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
if (process.env.GOD) G.R(ctx, 'DBG.god = 1');
if (process.env.FAST) G.R(ctx, 'present = () => {}; { const wd = worldScene.draw; worldScene.draw = () => { if (DBG.wantDraw) wd(); }; }');
const max = +(process.argv[2] || 400000);
(async () => {
  G.R(ctx, 'run(boot)');
  let T = 0;
  for (let f = 0; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, 'DBG.ending && MENUS.length > 0 && MENUS[0].opts.join("").includes("NEW GAME")')) { console.log('DONE ending=' + G.R(ctx, 'DBG.ending') + ' frames=' + f); break; }
    if (process.env.SHOTS && f % +process.env.SHOTS === 1) G.R(ctx, 'DBG.wantDraw = 1');
    if (process.env.SHOTS && f % +process.env.SHOTS === 0) { G.R(ctx, 'DBG.wantDraw = 0'); } if (process.env.SHOTS && f % +process.env.SHOTS === 0) G.png(ctx, path.join(__dirname, 'shots', 'c2p_' + String(f).padStart(7, '0') + '.png'), 2);
    if (f % 20000 === 0) console.log('.. f=' + f + ' ep=' + G.R(ctx, 'C2 && C2.ep') + ' map=' + G.R(ctx, 'WD.id') + ' lv=' + G.R(ctx, 'C2 && C2.lv') + ' hp=' + G.R(ctx, 'C2 && C2.hp') + ' human=' + G.R(ctx, 'C2 && C2.human') + ' tapes=' + G.R(ctx, 'C2 && C2.tapes.length'));
  }
  console.log('META', G.R(ctx, 'JSON.stringify(C2META)'));
  console.log('STATS', G.R(ctx, 'C2 && JSON.stringify({ ep: C2.ep, lv: C2.lv, human: C2.human, humanMax: C2.humanMax, tapes: C2.tapes, bux: C2.bux, bongs: C2.bongs.length, transforms: C2.transforms, kills: C2.kills, cools: C2.cools || 0, ticket: C2.ticket, time: C2.time })'));
})().catch(e => console.log('ERR', e));
