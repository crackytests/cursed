// screenshot a CARL 3 scene: node tools/c3shot.js <scene> <x> <z> [yaw] [out]   (env: FLAGS=a,b  SAY="who|text"  KEYS=up:60)
const { load, G } = require('./c3vm'), path = require('path');
const [sceneId, x = 0, z = 0, yaw = 0, out] = process.argv.slice(2);
const ctx = load({}); G.R(ctx, 'present = () => {}');
(async () => {
  G.R(ctx, `anyKey = true; C3 = newC3(); C3.stop = ${process.env.STOP || 1}; ${(process.env.FLAGS || '').split(',').filter(Boolean).map(f => `setF3('${f}');`).join('')} scene = worldScene3; post.fade = 0; const t0 = Date.now(); loadScene('${sceneId}', ${x}, ${z}, ${yaw}); WX.banner = null; ${process.env.SETUP || ''}`);
  let T = 0;
  const step = async n => { for (let i = 0; i < n; i++) { T += 16.7; G.R(ctx, `loop(${T})`); await new Promise(r => setImmediate(r)); } };
  if (process.env.SAY) { const [w, t] = process.env.SAY.split('|'); G.R(ctx, `run(() => say(${JSON.stringify(t)}, ${JSON.stringify(w)}))`); }
  if (process.env.KEYS) { const [k, n] = process.env.KEYS.split(':'); G.R(ctx, `kb.${k} = 1`); await step(+n); G.R(ctx, `kb.${k} = 0`); }
  await step(+(process.env.FRAMES || 20));
  const o = out || path.join(__dirname, 'shots', 'c3_' + sceneId + '.png'); G.png(ctx, o, 2); console.log('wrote', o, G.R(ctx, 'WX.camId'));
})().catch(e => console.log('ERR', e));
