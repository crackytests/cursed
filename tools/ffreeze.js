// FACE freeze check: while a dialog / choice / card / pause is up, bullets, enemies and the player must not move and nothing can hurt him.
const G = require('./g2vm');
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'face/shmup', 'face/stages', 'face/story', 'face/content', 'face/poly', 'face/fmain'], {});
(async () => {
  G.R(ctx, `anyKey = true; FACE_SCAN = scanPotential(); newRun(); SAVEINTRO = 1; run(() => startStage(2));`);
  let fails = 0;
  const snap = () => G.R(ctx, 'JSON.stringify([PLR.x, PLR.y, PLR.backups, PLR.dead, SH.t, SH.eb.map(b => [b.x|0, b.y|0]), SH.ents.map(e => [e.x|0, e.y|0])])');
  // get into live play: skip intro dialogs
  for (let i = 0; i < 900; i++) { G.R(ctx, 'kb.a = (DLG || CARD || MENUS.length) && ' + i + ' % 4 === 0 ? 1 : 0; kb.right = 0'); await G.step(ctx, 1); }
  for (const [name, open] of [['say', 'say("FREEZE TEST")'], ['choose', 'choose(["A", "B"])'], ['card', 'showCard(["X"], 0)'], ['story', 'story(() => wait(400))'], ['pause', 'story(pauseMenu)']]) {
    // spray bullets at the player, then open the blocker
    G.R(ctx, 'for (let i = 0; i < 20; i++) eshot(PLR.x + 30 + i * 3, PLR.y, -2, 0); PLR.inv = 0;');
    G.R(ctx, 'run(() => ' + open + ')'); await G.step(ctx, 2);
    const a = snap();
    G.R(ctx, 'kb.left = 1; kb.up = 1; kb.a = 0'); await G.step(ctx, 120); G.R(ctx, 'kb.left = 0; kb.up = 0');
    const b = snap();
    if (a !== b) { fails++; console.log('FAIL', name, 'state changed while blocked'); } else console.log('ok  ', name, 'frozen');
    // close it
    for (let i = 0; i < 60 && G.R(ctx, '!!(DLG || MENUS.length || CARD || SH.hold || SH.paused)'); i++) { G.R(ctx, 'kb.a = ' + (i % 2)); await G.step(ctx, 1); }
    G.R(ctx, 'kb.a = 0; SH.eb = []; SH.hold = 0; SH.paused = false; DLG = null; MENUS.length = 0; CARD = null'); await G.step(ctx, 5);
  }
  console.log(fails ? fails + ' FAILURES' : 'FREEZE CHECK PASSED');
})();
