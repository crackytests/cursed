// run one stop of CARL 3 from a prepared state: node tools/c3seg.js <stop id> [maxFrames]  (env WANT as c3play, SETUP='extra js')
const { load, G, FAST } = require('./c3vm'), fs = require('fs'), path = require('path');
const n = +(process.argv[2] || 3), max = +(process.argv[3] || 40000);
const ctx = load({}); G.R(ctx, fs.readFileSync(path.join(__dirname, 'c3bot.js'), 'utf8')); G.R(ctx, FAST);
const want = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); want[k] = v === '1' ? true : v === '0' ? false : v; }
G.R(ctx, 'BOT.set(' + JSON.stringify(want) + ')');
// what has to be true before each stop. ACT II stops (4 7 8 9 10) start from the end of ACT I; 11 and 5 from the end of ACT II.
const PRE = { 1: [], 2: [1], 3: [1, 2], 4: [1, 2, 3], 7: [1, 2, 3], 8: [1, 2, 3], 9: [1, 2, 3], 10: [1, 2, 3], 11: [1, 2, 3, 4, 7, 8, 9, 10], 5: [1, 2, 3, 4, 7, 8, 9, 10, 11], 6: [1, 2, 3, 4, 7, 8, 9, 10, 11, 5] }[n] || [];
const from = PRE.length ? PRE[PRE.length - 1] : 0;
const setup = `C3 = newC3(); ensure3(); C3.bux = 30; C3.stop = ${from}; for (const i of ${JSON.stringify(PRE)}) { setF3('done' + i); setF3('arrived' + i); } setF3('seenP0'); setF3('ghostOn'); C3.route = [1, 1, 1, 1, 1, 1, 0];
  ${PRE.length > 4 ? "setF3('act2fin');" : ''}
  ${n === 2 ? "addParcel({ id: 'crate', desc: 'CRATE', toName: 'ROOM 6', from: '?', model: 'crate' });" : ''}
  ${PRE.includes(2) ? "addParcel({ id: 'tape', desc: 'TAPE', toName: 'OLD FACE', from: 'NEW FACE', model: 'parcel' });" : ''}
  ${PRE.includes(3) ? "setF3('faceCode'); setF3('lindaOn'); setF3('tracker'); addParcel({ id: 'key', desc: 'KEY', toName: 'LINDA', from: 'GHOST', model: 'her' });" : ''}
  ${n === 6 ? "setF3('chuteOpen'); C3.alibis.push({ id: 'maintenance', stop: 1, task: 'X', done: 1, retracted: 0 }, { id: 'resident', stop: 2, task: 'Y', done: 1, retracted: 0 });" : ''}
  ${process.env.SETUP || ''}
  scene = { draw() { cls(BLACK); } }; post.fade = 0; run(() => ${n === 6 ? 'enterDLO()' : 'doDrive(' + n + ')'});`;
(async () => {
  G.R(ctx, 'anyKey = true; ' + setup);
  const doneExpr = n === 6 ? 'DBG.end' : `F3("done${n}")`;
  let T = 0, f = 0, lastLog = '';
  for (; f < max; f++) {
    G.R(ctx, 'BOT.tick()'); T += 16.7; G.R(ctx, `loop(${T})`);
    for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (G.R(ctx, doneExpr)) break;
  }
  console.log('END f=' + f + ' ' + G.R(ctx, `JSON.stringify({ scene: WX.id, p: CARL.p.map(v => +v.toFixed(1)), hold: WX.hold, stop: C3.stop, obj: OBJ3 && OBJ3.text, done: ${doneExpr} })`));
})().catch(e => console.log('ERR', e));
