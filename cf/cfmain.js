'use strict';
// ================= CHROME FORCE -- boot, title, flow, save, the soundtrack =================
let SAVE = null;
const CFM = fetchStore('cf_meta') || {};

// the soundtrack lives in cfsynth.js (the sound board) and cfscore.js (the tracks)
function music_sting(k) {
  if (!AC || CF_FAST) return; const t = AC.currentTime;
  if (k === 'join') [523, 659, 784, 1047, 784, 1047].forEach((f, i) => note(f, .14, 'brass', t + i * .08, sfxBus));
  if (k === 'level') [392, 523, 659, 784].forEach((f, i) => note(f, .12, 'bell', t + i * .06, sfxBus));
}

// ---------- portraits for dialogue ----------
function regAll() {
  for (const id in HEROES) regPortrait(HEROES[id].n, HEROES[id].art, HEROES[id].voice);
  for (const id in FOES) if (!PORT[FOES[id].n]) regPortrait(FOES[id].n, FOES[id].art, [220 + (id.length * 37) % 300, 40]);
  const npc = { 'MARSHAL OREN': [TA.elder, [280, 20]], 'LADY CASTELLAN': [ART('cent', 'pony', 'staff', 'ivory', 'green', 'tan', 'green'), [620, 40]], 'TOWER WARDEN': [TA.sheet, [300, 60]],
    'HARBORMASTER': [TA.speaker, [260, 30]], 'GREETER': [TA.holo, [1100, 60]], 'CAMP ELDER': [TA.skull, [480, 60]], 'MAYOR': [TA.iron, [300, 30]], 'LAST PILGRIM': [TA.sheet, [360, 50]],
    'PRIEST': [TA.priest, [400, 40]], 'QUARTERMASTER': [TA.knight, [340, 30]], 'KAEL': [HEROES.kael.art, [330, 20]] };
  for (const k in npc) regPortrait(k, npc[k][0], npc[k][1]);
  VOICE._ = [700, 60];
}

// ---------- save ----------
function newSave() { return { v: 1, ch: 1, bi: 0, gold: 60, force: {}, active: [], depot: [], flags: {}, archive: {}, where: 'town', stats: { battles: 0, kills: 0, defeats: 0 }, suspend: null }; }
function saveGame() { store('cf_save', SAVE); }
function loadGame() { const s = fetchStore('cf_save'); if (!s || !s.force || !s.force.dax) return null; return Object.assign(newSave(), s); }

// ---------- title ----------
function chromeText(s, y, sc) { // album-cover chrome: sky, hard horizon, burning ground, per glyph row
  const ramp = ['#ffffff', '#b6dbff', '#6db6ff', '#002449', '#ff9249', '#db4900', '#6d2400'].map(hex), x0 = ((W - s.length * 6 * sc) / 2) | 0;
  let x = x0; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) { rectF(x + i * sc + 2, y + j * sc + 2, sc, sc, hex('#000024')); } x += 6 * sc; }
  x = x0; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) for (let k = 0; k < sc; k++) rectF(x + i * sc, y + j * sc + k, sc, 1, ramp[Math.min(6, ((j * sc + k) / (7 * sc) * 7) | 0)]); x += 6 * sc; }
}
const titleScene = { update() {}, draw() {
  const T = CUTBG.waste; skyD(0, 130, '#000000', '#db4924');
  const sc = hex('#ffdb49'); for (let y = -40; y <= 40; y++) { if (y > 2 && ((y >> 1) % 3 === 0)) continue; const w = Math.sqrt(1600 - y * y) | 0; rectF(160 - w, 120 + y, w * 2, 1, sc); }
  rectF(0, 130, W, H - 130, hex('#240000')); for (let k = 0; k < 9; k++) rectF(0, 130 + Math.pow(((k + (frame % 40) / 40) / 9), 2) * 94 | 0, W, 1, hex('#ff6d24'));
  for (let k = -12; k <= 12; k++) lineF(160 + k * 5, 130, 160 + k * 60, H, hex('#ff6d24'));
  const dax = artOf(HEROES.dax.art), vis = artOf(FOES.visor1.art);
  const s1 = bSprite(dax, 'idle'), s2 = bSprite(vis, 'idle');
  draw(s2, -10, 190 - s2.h, vis.P, false); draw(s1, W - s1.w + 10, 190 - s1.h, dax.P, true);
  chromeText('CHROME', 24, 5); chromeText('FORCE', 64, 5);
  ctext('REQUIEM OF THE WARDRAGON', 106, hex('#ffdb49'));
  if (TITLE.menu === null && (frame >> 5) & 1) ctext('PRESS START', 176, WHITE);
  ctext('(C) 1993 PRETEND CO.', 212, hex('#db9292'));
  if (CFM.cleared) text('*', 4, 4, hex('#ffdb49'));
  drawWins();
} };
const TITLE = { menu: null };

async function boot() {
  regAll();
  scene = titleScene; music('title'); TITLE.menu = null;
  await fadeIn(.04);
  for (;;) {
    while (!(pressed.start || pressed.a)) await nextFrame();
    sfx('ok'); TITLE.menu = 1;
    const sv = loadGame();
    const opts = [{ t: 'NEW GAME' }, { t: sv && sv.suspend ? 'RESUME BATTLE' : 'CONTINUE', dis: !sv }, { t: 'OPTIONS' }];
    const a = await menu(opts, { x: 110, y: 150, w: 100 });
    if (a === 0) { if (sv && !(await confirm('START OVER? YOUR SAVE STAYS UNTIL YOU SAVE.'))) { TITLE.menu = null; continue; } await fadeOut(.04); SAVE = newSave(); await newGame(); }
    else if (a === 1) { await fadeOut(.04); SAVE = sv; await play(); }
    else if (a === 2) { await options(); TITLE.menu = null; continue; }
    else { TITLE.menu = null; continue; }
    scene = titleScene; music('title'); TITLE.menu = null; WINS = []; await fadeIn(.04);
  }
}
async function newGame() {
  for (const id of ['dax', 'bronc', 'static', 'booth']) { SAVE.force[id] = newRecord(id); SAVE.active.push(id); }
  scene = { update() {}, draw() { cls(BLACK); } };
  post.fade = 0; // the title faded out; the opening cards would otherwise play under a black screen
  await STORY.opening();
  await chapterCard(1);
  await play();
}
async function chapterCard(n) {
  const ch = CHAPTERS[n - 1]; music('prologue'); scene = { update() {}, draw() { cls(BLACK); } };
  await fadeIn(.1);
  await showCard(['CHAPTER ' + n, '', ch.title], 150, { bg: hex('#000024'), fg: hex('#ffdb49'), sc: 2 });
  await fadeOut(.1);
}
async function play() {
  for (;;) {
    if (SAVE.suspend) { const r = await runBattle(SAVE.suspend.id, SAVE.suspend); if (await afterBattle(r)) return; continue; }
    const ch = CHAPTERS[SAVE.ch - 1];
    if (SAVE.where === 'town') { await runTown(ch.town); SAVE.where = 'route'; }
    const a = await routeMenu(ch);
    if (a === 'town') { SAVE.where = 'town'; continue; }
    const r = await runBattle(ch.battles[SAVE.bi]);
    if (await afterBattle(r)) return;
  }
}
async function afterBattle(r) {
  if (r === 'suspend') { await fadeOut(.1); return true; }
  if (r === 'win') {
    const ch = CHAPTERS[SAVE.ch - 1]; SAVE.bi++;
    if (SAVE.bi >= ch.battles.length) {
      SAVE.ch++; SAVE.bi = 0; SAVE.where = 'town';
      if (SAVE.ch > CHAPTERS.length) { SAVE.ch = CHAPTERS.length; SAVE.bi = 0; scene = { update() {}, draw() { cls(BLACK); } }; post.fade = 0; /* endBattle faded out; the ending cards would play under black */ await STORY.ending(); await credits(); CFM.cleared = 1; CFM.archive = Object.keys(SAVE.archive).length; store('cf_meta', CFM); SAVE.flags.cleared = 1; saveGame(); return true; }
      await chapterCard(SAVE.ch);
    } else SAVE.where = 'route';
    return false;
  }
  SAVE.where = 'town'; SAVE.wake = 1;
  if (r === 'lose') allRecs().forEach(x => x.dead = 0); // a full rout: the Signal carries everyone home; the gold is the price
  SAVE.wakeMsg = r === 'recall' ? 'THE FORCE RECALLED SAFELY. THE SIGNAL GUIDED YOU HOME.' : 'THE SIGNAL CARRIED THE WHOLE FORCE HOME. HALF YOUR GOLD WAS LOST ON THE FIELD.';
  return false;
}
async function credits() {
  music('ending');
  const roll = [['CHROME FORCE', 'REQUIEM OF THE WARDRAGON']];
  for (const id of FORCE_ORDER) if (SAVE.force[id]) roll.push([HEROES[id].n, FATES[id] || CLS[SAVE.force[id].cls].n, id]);
  roll.push(['THE WAR WORLD', 'AS IT WAS, AND AS IT IS'], ['PRETEND CO.', '1993'], ['THE WAR IS OVER', 'THANK YOU FOR PLAYING']);
  for (const [a, b, id] of roll) {
    scene = { update() {}, draw() {
      skyD(0, H, '#000024', '#6d2400'); for (let k = 0; k < 9; k++) rectF(0, 150 + Math.pow(k / 8, 2) * 74 | 0, W, 1, hex('#ff6d24'));
      if (id) { const ar = artOf(HEROES[id].art), s = bSprite(ar, 'idle'); draw(s, 160 - (s.w >> 1), 178 - s.h, ar.P, true); }
      ctext(a, id ? 20 : 90, hex('#ffdb49'), BLACK, 2); wrapT(b, 36).forEach((l, i) => ctext(l, (id ? 44 : 120) + i * 12, WHITE));
    } };
    await fadeIn(.06); await wait(60); await waitBtn(); await fadeOut(.06); // fates are read, not skimmed: hold until a button press
  }
}

// ---------- playtest hooks ----------
DBG.cf = () => ({ ch: SAVE && SAVE.ch, bi: SAVE && SAVE.bi, where: SAVE && SAVE.where, battle: B && B.id, round: B && B.round, gold: SAVE && SAVE.gold });

fit(); requestAnimationFrame(loop); run(boot);
