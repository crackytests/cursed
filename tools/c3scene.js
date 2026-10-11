// screenshot CARL 3 non-world scenes: node tools/c3scene.js boot|title|wires|say:<WHO>|menu|card [frame]
const { load, G } = require('./c3vm'), path = require('path');
const [name, fr = '120'] = process.argv.slice(2);
const ctx = load({}); G.R(ctx, 'present = () => {}');
const [kind, who] = name.split(':');
const setup = {
  boot: 'anyKey = true; run(boot)', title: 'titleScreen3_run = 1; run(titleScreen3)',
  wires: "C3 = newC3(); scene = worldScene3; post.fade = 0; loadScene('canyon_main', 8, 12, 0); run(() => wires('SIGN PANEL', 4))",
  say: "C3 = newC3(); scene = worldScene3; post.fade = 0; loadScene('canyon_main', 8, 12, 0); run(() => say('Post office closed at five. Who are you, and what are you doing at my door at night. I am asking you slowly.', '" + (who || 'DEPUTY BROOKS').replace(/_/g, ' ') + "'))",
  menu: "C3 = newC3(); scene = worldScene3; post.fade = 0; loadScene('canyon_main', 8, 12, 0); run(() => claimMenu('DEPUTY BROOKS', 'Say it slow.', ['maintenance', 'resident', 'inspector', 'courier']))",
  card: "C3 = newC3(); scene = { draw() { cls(BLACK); } }; run(() => showCard(['STOP 1', '', 'BOX CANYON'], 0))",
}[kind];
(async () => {
  G.R(ctx, 'anyKey = true; ' + setup);
  let T = 0;
  const step = async n => { for (let i = 0; i < n; i++) { T += 16.7; G.R(ctx, `loop(${T})`); await new Promise(r => setImmediate(r)); } };
  if (kind === 'boot') await step(10);
  await step(+fr);
  const o = path.join(__dirname, 'shots', 'c3s_' + name.replace(/[:\s]/g, '_') + '.png'); G.png(ctx, o, 2); console.log('wrote', o);
})().catch(e => console.log('ERR', e));
