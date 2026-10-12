// headless DARK MONDAY playthrough: node tools/dmplay.js [startLevel=1] [maxFrames=120000]   env PARTY=CARL,LINDA,JB,FACE
const X = require('./dmvm.js'), fs = require('fs'), path = require('path');
const LS = {}; const ctx = X.load(LS), R = s => X.R(ctx, s);
R(fs.readFileSync(path.join(__dirname, 'dmbot.js'), 'utf8'));
const WANT = {}; for (const kv of (process.env.WANT || '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); WANT[k] = v === undefined ? true : v; } R('BOT.set(' + JSON.stringify(WANT) + ')');
const start = +(process.argv[2] || 1), max = +(process.argv[3] || 120000), ids = (process.env.PARTY || 'CARL,LINDA,JB,FACE').split(',');
R('present = () => {}; worldScene.draw = () => {};'); R(`anyKey = true; newGame(${start}, ${JSON.stringify(ids)}, true); scene = worldScene; post.fade = 0;`);
(async () => {
  let f = 0, lastN = -1, logged = 0;
  for (; f < max; f++) {
    R('BOT.tick()'); await X.step(ctx, 1);
    if (f % 600 === 0) { const n = R('GM.n'); if (n !== lastN) { lastN = n; console.log('[' + f + '] --- LEVEL', n, R('GM.lv.name')); } }
    if (f % 300 === 0) { const L = R('BOT.log.length'); while (logged < L) { const l = R(`BOT.log[${logged}]`); if (!/^BOT/.test(l) || process.env.VERBOSE) console.log('   ' + l.slice(0, 150)); logged++; } }
    if (R('BOT.done') || R('BOT.fail') || R('GM.over')) break;
  }
  const L = R('BOT.log.length'); while (logged < L) { const l = R(`BOT.log[${logged}]`); if (!/^BOT/.test(l) || process.env.VERBOSE) console.log('   ' + l.slice(0, 150)); logged++; }
  console.log('END f=' + f + ' ' + JSON.stringify(R('({ n: GM.n, pos: GM.x + "," + GM.y, party: PARTY.map(c => c.name + " L" + c.lvl + " " + c.hp + "/" + c.max + (c.dead ? " DEAD" : "")), done: BOT.done, fail: BOT.fail, over: GM.over, minutes: 0 })')), "frames", f);
  process.exit(R('BOT.done') ? 0 : 1);
})().catch(e => { console.log('ERR', e); process.exit(2); });
