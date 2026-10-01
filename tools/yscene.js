// YOKO: render one adventure scene (or a battle / the mandolin lesson) to a PNG, no bot needed.
//   node tools/yscene.js <sceneId> [frames]          e.g. cooters, mdiner, school, barracks
//   node tools/yscene.js battle:<bg>:<foe,foe>        e.g. battle:barracks:trooper,trooper,trooper
//   node tools/yscene.js lesson                       the mandolin minigame, mid-song
const G = require('./g2vm'), path = require('path'), fs = require('fs');
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'yoko/battle', 'yoko/adv', 'yoko/chapters', 'yoko/chapters2', 'yoko/content', 'yoko/ymain'], {});
const arg = process.argv[2] || 'cooters', frames = +(process.argv[3] || 30);
fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true });
(async () => {
  let T = 0; const step = async (n, keys = {}) => { for (let i = 0; i < n; i++) { G.R(ctx, `for (const k of BTNS) kb[k] = ${JSON.stringify(keys)}[k] ? 1 : 0;`); T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); } };
  G.R(ctx, 'scene = null; post.fade = 0;'); await step(2);
  if (arg.startsWith('battle:')) { const [, bg, foes] = arg.split(':'); G.R(ctx, `run(() => battle({ foes: ${JSON.stringify(foes.split(','))}, party: ['CARL', 'JB GARFIELD', 'CEO LINDA', 'PEE KID'], bg: '${bg}' }))`); await step(frames); }
  else if (arg === 'lesson') { G.R(ctx, 'ADV.cur = "school"; scene = advScene; run(mandolinLesson)'); for (let i = 0; i < 12; i++) { await step(4, { a: 1 }); await step(6); } await step(frames); }
  else { G.R(ctx, `ADV.cur = '${arg}'; ADV.lead = 'CARL'; ADV.hint = 'A HINT GOES HERE.'; scene = advScene;`); await step(frames); }
  const out = path.join(__dirname, 'shots', 'y_' + arg.replace(/[:,]/g, '_') + '.png'); G.png(ctx, out, 2); console.log('wrote', out);
})().catch(e => console.log('ERR', e));
