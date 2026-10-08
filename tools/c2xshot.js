// CARL 2 EXTREME screenshots: node tools/c2xshot.js <level 0-4> <tileX|-> <frames,..> [inputs] [prefix]
// inputs: "10:right,40:right+b,80:" keys held from that frame on. SETUP env = js run after load.
const { load, G } = require('./c2xvm'), path = require('path');
const [lv, tx, fr = '5', inp = '', pre = 'x'] = process.argv.slice(2);
const ctx = load();
G.R(ctx, `anyKey = true; RUN.outfit = ${JSON.stringify(process.env.OUTFIT || 'classic')}; loadLevel(LEVELS[${lv}]); LV.finish = r => { DBG.fin = r; }; scene = worldScene; CUT = 0;
  if (${JSON.stringify(tx)} !== '-') { PL.x = PL.cx = ${+tx || 0} * 16; PL.y = PL.cy = (${process.env.TY || 0} || 2) * 16; respawnState(); }
  ${process.env.SETUP || ''}`);
const frames = fr.split(',').map(Number), plan = inp.split(',').filter(Boolean).map(s => { const [f, k] = s.split(':'); return [+f, k ? k.split('+') : []]; });
(async () => {
  let T = 0; const max = Math.max(...frames);
  for (let f = 0; f <= max; f++) {
    const cur = plan.filter(p => p[0] <= f).pop(); for (const k of ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start']) G.R(ctx, `kb.${k} = ${cur && cur[1].includes(k) ? 1 : 0}`);
    for (const [af, js] of (process.env.AT || '').split('|').filter(Boolean).map(x => [+x.slice(0, x.indexOf(':')), x.slice(x.indexOf(':') + 1)])) if (af === f) G.R(ctx, js);
    T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (frames.includes(f)) { const out = path.join(__dirname, 'shots', pre + '_' + lv + '_' + f + '.png'); G.png(ctx, out, 2); console.log('wrote', out, 'pl', G.R(ctx, '[PL.x|0, PL.y|0, PL.hp, RUN.lives, PL.air|0, BOSS && BOSS.hp, DBG.fin].join(",")')); }
  }
})().catch(e => console.log('ERR', e));
