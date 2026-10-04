// real UI path headless: boot -> title -> NEW GAME -> a few menu presses; reports errors
const G = require('./g2vm');
const ctx = G.load(['g2/engine2', 'g2/fm', 'orig/oart', 'orig/ostory', 'orig/omain']);
const errs = []; ctx.console = { log() {}, error: (...a) => errs.push(a.join(' ')) };
(async () => {
  G.R(ctx, 'anyKey = true; run(boot)');
  const press = async k => { G.R(ctx, `kb.${k} = 1`); await G.step(ctx, 2); G.R(ctx, `kb.${k} = 0`); await G.step(ctx, 2); };
  await G.step(ctx, 1500);              // boot sequence
  await G.step(ctx, 120); await press('start'); await G.step(ctx, 10);
  await press('a');                      // NEW GAME
  await G.step(ctx, 400);                // card, fade
  for (let i = 0; i < 12; i++) { await press('a'); await G.step(ctx, 20); }
  console.log('room', G.R(ctx, 'OS.room'), 'menus', G.R(ctx, 'MENUS.length'), 'scene', !!G.R(ctx, 'scene'));
  G.png(ctx, 'tools/shots/orig_boot.png', 2);
  console.log(errs.length ? 'ERRORS\n' + errs.join('\n') : 'no errors');
})();
