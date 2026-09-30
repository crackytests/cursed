// screenshot a CARL 2 map: node tools/c2shot.js <map> <tx> <ty> [frames,..] [inputs] [out-prefix]
// inputs: comma list of frame:keys (e.g. "10:right,40:a,80:") keys held from that frame on
const { load, G } = require('./c2vm'), path = require('path');
const [map, tx, ty, fr = '5', inp = '', pre = 'c2'] = process.argv.slice(2);
const ctx = load();
G.R(ctx, `anyKey = true; C2 = newC2(); C2.ep = +(${JSON.stringify(process.env.EP || '1')}); if (${!!process.env.FLAGS}) ${JSON.stringify(process.env.FLAGS || '')}.split(',').forEach(f => setF2(f)); scene = worldScene; loadMap(${JSON.stringify(map)}, ${tx}, ${ty}, 'd');`);
const frames = fr.split(',').map(Number), plan = inp.split(',').filter(Boolean).map(s => { const [f, k] = s.split(':'); return [+f, k ? k.split('+') : []]; });
(async () => {
  let T = 0; const max = Math.max(...frames);
  for (let f = 0; f <= max; f++) {
    const cur = plan.filter(p => p[0] <= f).pop(); for (const k of ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start']) G.R(ctx, `kb.${k} = ${cur && cur[1].includes(k) ? 1 : 0}`);
    T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (frames.includes(f)) { const out = path.join(__dirname, 'shots', pre + '_' + map + '_' + f + '.png'); G.png(ctx, out, 2); console.log('wrote', out); }
  }
  console.log('DLG', G.R(ctx, 'DLG && DLG.lines.join(" ")'), 'hp', G.R(ctx, 'C2.hp'), 'pos', G.R(ctx, 'PL.x+","+PL.y'), 'ents', G.R(ctx, 'WD.ents.length'));
})().catch(e => console.log('ERR', e));
