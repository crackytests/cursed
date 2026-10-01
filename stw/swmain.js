'use strict';
// ================= SAVE THE WORLD: boot, the WORLD-FX card, title, continue =================
FM_TONE = { low: 2, high: -3, lp: 7600, room: .16, sfxHigh: -2, gain: 1.05 };
// scripts can be abandoned (a game over throws); keep the console quiet about that
function run(fn) { busy++; return Promise.resolve().then(fn).catch(e => { if (!e || e.message !== 'gameover') console.error(e); }).finally(() => busy--); }

async function boot() {
  META.boots = (META.boots || 0) + 1; saveMeta();
  // the publisher logo
  let t = 0; scene = { update() { t++; }, draw() {
    cls(BLACK); const a = Math.min(1, t / 40);
    ctext('PRETEND CO.', 90, mix(BLACK, WHITE, a), 0, 3);
    if (t > 50) ctext('PRESENTS', 124, mix(BLACK, hex('#92dbff'), Math.min(1, (t - 50) / 30)), 0);
  } };
  for (let i = 0; i < 150 && !(anyKey && i > 40 && pressed.start); i++) await nextFrame();
  if (!DBG.fast) speak('Pretend co!', { pitch: 1.2, rate: 1.05 });
  await fadeOut(.05); post.fade = 0;
  // the chip card
  t = 0; scene = { update() { t++; }, draw() {
    cls(hex('#000024'));
    const s = 1 + Math.sin(t * .05) * .1, cx = 160, cy = 92;
    for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28 + t * .03; lineF(cx, cy, cx + Math.cos(a) * 120 * s, cy + Math.sin(a) * 50 * s, i & 1 ? hex('#101049') : hex('#24246d')); }
    ctext('WORLD-FX', 70, hex('#ffdb49'), BLACK, 3);
    ctext('SCALING & ROTATION CHIP', 104, WHITE); ctext('24 MEGA + BATTERY BACKUP', 118, hex('#92dbff'));
    ctext('THE SAVE STAYS WHERE YOU LEFT IT.', 150, hex('#b6b6db'));
  } };
  await fadeIn(.05);
  for (let i = 0; i < 160 && !(i > 30 && pressed.start); i++) await nextFrame();
  await fadeOut(.05);
  await titleScreen();
}
async function titleScreen() {
  post.fade = 0; post.tint = null; G = G || newGame(); music('title');
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#000018', '#24246d');
    for (let i = 0; i < 60; i++) pset((i * 97 + (t >> 2)) % W, (i * 53) % 150, (t + i * 11) % 60 < 30 ? WHITE : hex('#6d6db6'));
    // a planet seen from the edge: the world, saved
    for (let y = 150; y < H; y++) { const k = (y - 150) / 74; rectF(0, y, W, 1, mix(hex('#2449b6'), hex('#36924a'), Math.min(1, k * 2))); }
    for (let x = 0; x < W; x += 2) pset(x, 150 + Math.sin(x * .05 + t * .01) * 2, hex('#92dbff'));
    const b = Math.sin(t * .04) * 2;
    ctext('SAVE', 34 + b, hex('#ffdb49'), hex('#922436'), 4);
    ctext('THE WORLD', 68 + b, WHITE, hex('#24246d'), 3);
    ctext('A PRETEND CO. GAIDEN', 100, hex('#92dbff'), BLACK);
    if ((t >> 5) & 1) text('>', 116, 128 + TITLE.i * 12, hex('#ffdb49'));
    TITLE.opts.forEach((o, i) => text(o, 128, 128 + i * 12, i === TITLE.i ? hex('#ffdb49') : WHITE));
    ctext('(C) PRETEND CO.  SUPER-16  WORLD-FX', 212, hex('#6d6db6'), BLACK);
  } };
  const slots = saveSlots(), any = slots.some(Boolean);
  TITLE.opts = any ? ['CONTINUE', 'NEW GAME'] : ['NEW GAME']; TITLE.i = 0;
  await fadeIn(.05); await nextFrame();
  for (;;) {
    if (pressed.up) { TITLE.i = (TITLE.i + TITLE.opts.length - 1) % TITLE.opts.length; sfx('move'); }
    if (pressed.down) { TITLE.i = (TITLE.i + 1) % TITLE.opts.length; sfx('move'); }
    if (pressed.a || pressed.start) break;
    await nextFrame();
  }
  sfx('ok'); const pickd = TITLE.opts[TITLE.i];
  if (pickd === 'CONTINUE') {
    const L = slots.map((s, i) => s ? 'SLOT ' + (i + 1) + ': ' + HEROES[s.lead].name + ' LV' + s.lv + ' ' + fmtTime(s.time) : 'SLOT ' + (i + 1) + ': EMPTY');
    const c = await choose(L.concat(['BACK']), { x: 60, y: 120, cancel: 1 });
    if (c < 0 || c === 3 || !slots[c]) return titleScreen();
    loadGame(c); await fadeOut(.05); post.fade = 0;
    if (G.inWorld) { await toWorld(G.wx, G.wy); } else { loadMap(G.map, G.x, G.y, G.dir); await fadeIn(.05); }
    return;
  }
  await fadeOut(.04); post.fade = 0;
  await newGameStart();
}
const TITLE = { opts: [], i: 0 };
