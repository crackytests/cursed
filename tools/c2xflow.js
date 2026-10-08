// CARL 2 EXTREME flow smoke test: boot -> title -> new game -> intro -> level 1, mashing A/START.
// node tools/c2xflow.js <frames> <shot frames,..>  (SETUP env runs before boot)
const { load, G } = require('./c2xvm'), path = require('path');
const [N = '3000', shots = ''] = process.argv.slice(2);
const ctx = load();
const errs = []; ctx.console = Object.assign({}, console, { error: (...a) => errs.push(a.map(String).join(' ')) });
G.R(ctx, `anyKey = true; ${process.env.SETUP || ''}; run(boot);`);
const want = shots.split(',').filter(Boolean).map(Number);
(async () => {
  let T = 0;
  for (let f = 0; f <= +N; f++) {
    const tap = f % 40 === 0;
    G.R(ctx, `kb.a = ${tap ? 1 : 0}; kb.start = 0; kb.right = ${f > 1500 ? 1 : 0};`);
    T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (want.includes(f)) { const out = path.join(__dirname, 'shots', 'xflow_' + f + '.png'); G.png(ctx, out, 2); console.log('shot', f, G.R(ctx, `(scene === worldScene ? 'world ' + LV.def.id + ' x' + (PL.x|0) : 'other') + ' words=' + RUN.words`)); }
  }
  console.log('errors:', errs.length ? errs.slice(0, 5) : 'none');
})().catch(e => console.log('ERR', e));
