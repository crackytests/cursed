'use strict';
// ================= THE END: boot (backwards), the title, starting at the end =================
FM_TONE = { low: 2, high: -3, lp: 7600, room: .2, sfxHigh: -2, gain: 1.05 };
function run(fn) { busy++; return Promise.resolve().then(fn).catch(e => { if (!e || e.message !== 'gameover') console.error(e); }).finally(() => busy--); }
// every fight is a rewind here, including the ones that jump out of the grass
battle = async function (form, opt = {}) { if (typeof form === 'string') return rewind({ form, bg: opt.bg }); FORMS.__rand = form; return rewind({ form: '__rand', bg: opt.bg || form.bg }); };
randomBattle = async function (enc) { const f = typeof enc.forms === 'function' ? enc.forms() : pickOne(enc.forms); FIELD_LOCK++; try { await battle(typeof f === 'string' ? f : FORMS.__rand = f, { bg: enc.bg }); } finally { FIELD_LOCK--; } await fadeIn(.1); };
forgetStories();

async function boot() {
  // it starts with THE END, then the credits go by the wrong way
  let t = 0; scene = { update() { t++; }, draw() { cls(BLACK); ctext('THE END', 96, mix(BLACK, WHITE, Math.min(1, t / 60)), 0, 3); } };
  for (let i = 0; i < 200 && !(i > 40 && (pressed.start || pressed.a)); i++) await nextFrame();
  await creditsBackward();
  await titleEnd();
}
async function creditsBackward() {
  const roll = ['SEE YOU NEXT SAVE.', '', 'THANK YOU FOR SAVING.', '', '', '(THEY ARE FINE NOW.)', 'THREE WERE OVERWRITTEN.', 'IN THE MAKING OF THIS GAME.', 'NO SAVE FILES WERE HARMED', '', '', 'HU-MAN', 'FOCUS TESTING', '', 'THE FM CHIP, DOING ITS BEST', 'MUSIC', '', 'PRETEND CO. R&D', 'WORLD-FX PROGRAMMING', '', '', 'TERMS AND CONDITIONS', 'THE DIVA LYNDA (WITH A Y)', 'THE MOVIE STAR', 'THE FRANCHISOR', 'GENERAL BACKUP', 'THE CLERK', '', '(HE WASN\'T SUPPOSED TO BE HERE)', 'BRUCE THE SHARK', '', 'WITH', '', '', 'KURSOR', '', 'AND', '', 'PILOT X', 'PEE KID', 'JB GARFIELD', 'SPOOKY GHOST', 'CEO LINDA', 'OLD FACE', 'FACE', 'CARL', 'YOKO', '', 'STARRING', '', '', 'A PRETEND CO. GAIDEN', 'SAVE THE WORLD'];
  let y = -roll.length * 14; const prev = scene; music('credits');
  scene = { update() { y += .6; }, draw() { skyD(0, H, '#24246d', '#000024'); roll.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy, i >= roll.length - 2 ? hex('#ffdb49') : WHITE, BLACK); }); } };
  while (y < H) { if (DBG.fast || pressed.start) y += 10; await nextFrame(); }
  // the save bar empties
  let k = 1; scene = { update() { k = Math.max(0, k - .006); }, draw() { cls(hex('#000024')); ctext('UNSAVING...', 90, WHITE); ctext('DO NOT TURN ON THE POWER.', 104, hex('#92dbff')); frameRect(80, 124, 160, 10, WHITE); rectF(82, 126, 156 * k, 6, hex('#ffdb49')); } };
  while (k > 0) { if (DBG.fast) k -= .05; await nextFrame(); }
  await wait(30); scene = prev;
}
async function titleEnd() {
  const saved = fetchStore('end_save'), opts = saved ? ['CONTINUE', 'BEGIN AT THE END'] : ['BEGIN AT THE END'];
  let t = 0, i = 0; music('title');
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#24246d', '#000018');
    for (let j = 0; j < 50; j++) pset((j * 97 - (t >> 2) + 3000) % W, (j * 53) % 140, (t + j * 11) % 60 < 30 ? WHITE : hex('#6d6db6'));
    ctext('THE END', 40, hex('#ffdb49'), hex('#922436'), 4); ctext('A PRETEND CO. GAIDEN', 82, hex('#92dbff'), BLACK); ctext('(IT PLAYS BACKWARDS)', 96, hex('#6d6db6'), BLACK);
    opts.forEach((o, k) => text(o, 112, 136 + k * 14, k === i ? hex('#ffdb49') : WHITE)); if ((t >> 5) & 1) text('>', 100, 136 + i * 14, hex('#ffdb49'));
    ctext('(C) PRETEND CO.  SUPER-16', 212, hex('#6d6db6'), BLACK);
  } };
  await fadeIn(.05); await nextFrame();
  for (;;) { if (pressed.up || pressed.down) { i = (i + 1) % opts.length; sfx('move'); } if (pressed.a || pressed.start) break; await nextFrame(); }
  sfx('ok'); await fadeOut(.05); post.fade = 0;
  if (opts[i] === 'CONTINUE') { G = JSON.parse(JSON.stringify(saved.g)); WORLD.made = 0; await goStop(G.flags.stop || 'kursor'); return; }
  newEnd(); await goStop('kursor');
}
// start at the end: everyone, everything, level 99
function newEnd() {
  newGame(); G.world = 2;
  const W6 = { rod: 'rod6', bong: 'bong6', lance: 'lance6', torch: 'torch6', mic: 'mic6', cane: 'cane6', toy: 'toy6', dart: 'dart6', any: 'rod6' };
  for (const id of ['linda', 'yoko', 'carl', 'ghost', 'face', 'oldface', 'garfield', 'kid', 'pilotx', 'mayi', 'human']) addHero(id, 99, { w: id === 'linda' ? 'goldpen' : W6[HEROES[id].weap], a: 'armor6', h: 'helm6', r1: 'turbobutton', r2: 'backup' });
  G.party = ['linda', 'yoko', 'carl', 'ghost'];
  G.gp = 9999999; G.crystals = Object.keys(CRYSTALS); G.gadgets = Object.keys(GADGETS);
  for (const k of ['snack', 'meal', 'feast', 'coffee', 'espresso', 'extralife', 'megalife', 'patch', 'tent', 'cartridge', 'chargepack']) invAdd(k, 9);
  for (const id in MAPS) for (const [x, y] of MAPS[id].chests || []) G.chests[id + ':' + x + ',' + y] = 1;
  for (const k in G.roster) G.roster[k].crystal = G.crystals[Object.keys(G.roster).indexOf(k) % G.crystals.length];
  setFlag('empress'); setFlag('busOwned');
}
