// run CARL 3 from the end of ACT I through the drive map to the ending: node tools/c3act.js [maxFrames]  (env WANT as c3play, HEAT=1 forces checkpoints)
const { load, G, FAST } = require('./c3vm'), fs = require('fs'), path = require('path');
const max = +(process.argv[2] || 120000);
const ctx = load({}); G.R(ctx, fs.readFileSync(path.join(__dirname, 'c3bot.js'), 'utf8')); G.R(ctx, FAST);
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v === '1' ? true : v === '0' ? false : v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
G.R(ctx, `anyKey = true; C3 = newC3(); ensure3(); C3.bux = 60; C3.stop = 3; for (const i of [1, 2, 3]) { setF3('done' + i); setF3('arrived' + i); } setF3('seenP0'); setF3('ghostOn'); setF3('tracker'); C3.route = [1, 1, 1, 1];
  C3.alibis.push({ id: 'maintenance', stop: 1, task: 'X', done: 1, retracted: 0 }, { id: 'resident', stop: 2, task: 'Y', done: 1, retracted: 0 });
  addParcel({ id: 'key', desc: 'KEY', toName: 'LINDA', from: 'GHOST', model: 'her' });
  ${process.env.HEAT ? "C3.suspicion = 5;" : ''}
  scene = worldScene3; loadScene('ship', 0, 2.4, 0); post.fade = 0; if (${!!process.env.CALL3}) { WX.hold++; run(async () => { await SHIPCALL[3](); WX.hold--; }); } else setRouteObj();`);
(async () => {
  let T = 0, f = 0, seen = '';
  for (; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    const s = G.R(ctx, 'WX.id + "@" + C3.stop'); if (s !== seen) { seen = s; console.log('-- ' + f + ' ' + s); }
    if (G.R(ctx, 'DBG.end')) break;
  }
  console.log('END f=' + f + ' ' + G.R(ctx, `JSON.stringify({ scene: WX.id, p: CARL.p.map(v => +v.toFixed(1)), stop: C3.stop, obj: OBJ3 && OBJ3.text, end: C3.ending, crates: cratesFound(), svc: C3.service, road: C3.road })`));
})().catch(e => console.log('ERR', e));
