// screenshot SPOOKY GHOST 2 scenes: node tools/sgscene.js <name> [frames...]   names: title previously cold descend dance:<CFG> world:<map>:<tx>:<ty> say:<WHO>
const { load, G } = require('./sgvm'), path = require('path'), fs = require('fs');
const [name, ...frs] = process.argv.slice(2);
const ctx = load({});
G.R(ctx, fs.readFileSync(path.join(__dirname, 'sgbot.js'), 'utf8')); G.R(ctx, 'present = () => {}');
const shots = (frs.length ? frs : ['60']).map(Number);
const [kind, a, b, c] = name.split(':');
const setup = {
  title: 'run(titleScreen)', previously: 'run(previously)', cold: `S = newS(); run(() => coldOpen(${a || 1}))`, descend: 'S = newS(); run(descend)',
  dance: `S = newS(); scene = worldScene; loadMap('studio88', 16, 20, 'u'); run(() => boogaloo(Object.assign({}, ${a || 'DANCER_PATTY'})))`,
  world: `S = newS(); S.ep = ${process.env.EP || 1}; scene = worldScene; loadMap('${a}', ${b}, ${c}, 'u')`,
  say: `S = newS(); scene = worldScene; loadMap('studio88', 16, 20, 'u'); run(() => say('Hello. I am a ghost. I would like to speak about my feelings, and then about alimony.', '${(a || 'SPOOKY GHOST').replace(/_/g, ' ')}'))`,
  credits: `S = newS(); S.cards = []; run(() => credits('stayed'))`,
}[kind];
(async () => {
  G.R(ctx, `anyKey = true; ${setup}`);
  let T = 0;
  for (let f = 0; f <= Math.max(...shots); f++) {
    if (process.env.BOT) G.R(ctx, 'BOT.tick()');
    T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (shots.includes(f)) { const out = path.join(__dirname, 'shots', 'sc_' + name.replace(/:/g, '_') + '_' + f + '.png'); G.png(ctx, out, 2); console.log('wrote', out); }
  }
})().catch(e => console.log('ERR', e));
