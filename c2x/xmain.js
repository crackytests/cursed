'use strict';
// ================= CARL 2 EXTREME: boot, title, closet, story (what's left of it), flow, ending =================
// The console port. Somebody at PRETEND CO. read the CARL 2 script, counted the words, and made a face.
const XMETA = fetchStore('c2x_meta') || { boots: 0, clears: 0, best: null };
const saveXM = () => store('c2x_meta', XMETA);
XMETA.got = XMETA.got || {}; RUN.got = XMETA.got; // outfits stay unlocked across saves and clears
function saveX() { saveXM(); store('c2x_save', { lv: RUN.lv, outfit: RUN.outfit, words: RUN.words, bux: RUN.bux }); }
const OTHER2 = fetchStore('yoko_meta'), PUB = OTHER2 && OTHER2.perma ? 'YOKO LTD.' : 'PRETEND CO.';
// EXTREME tempos and mix are composed in xmusic.js.

const words = s => String(s).split(/\s+/).filter(Boolean).length;
async function bigCard(lines, t = 70, o = {}) { RUN.words += lines.reduce((n, l) => n + words(l), 0); await showCard(lines, t, Object.assign({ sc: 2 }, o)); }
const skipHeld = () => pressed.start;

// ---------------- boot ----------------
async function boot() {
  XMETA.boots++; saveXM();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0;
  scene = { update() { t++; }, draw() { cls(BLACK); const y = Math.min(96, -20 + t * 3); ctext(PUB, y, WHITE, BLACK, 3); if (t > 50) ctext('(R)', y + 26, UI.dim); } };
  await wait(45); sfx('ok'); speak(PUB === 'YOKO LTD.' ? 'Yoko limited.' : 'Pretend co!', { pitch: 1.1 }); await wait(50); await fadeOut(.08);
  // the disclaimer nobody reads. so we stamped it.
  const legal = ['THIS VERSION OF CARL 2 HAS BEEN', 'CAREFULLY ADAPTED FOR THE HOME', 'CONSOLE AUDIENCE. IN TESTING, PLAYERS', 'ON CONSOLE SKIPPED 96% OF ALL TEXT,', 'INCLUDING THE TEXT THAT TOLD THEM', 'HOW TO SKIP TEXT. AFTER CAREFUL', 'CONSIDERATION, AND A FOCUS GROUP,', 'AND A SECOND FOCUS GROUP FOR THE', 'FIRST FOCUS GROUP, WE HAVE REMOVED', 'THE STORY, THE DIALOGUE, THE TAPES,', 'THE ARGUMENTS, THE MENUS, AND THIS'];
  let st = 0;
  scene = { update() { st++; }, draw() {
    cls(hex('#000024')); legal.forEach((l, i) => ctext(l, 30 + i * 12, UI.dim, 0));
    if (st > 80) { const k = Math.min(1, (st - 80) / 6), sc = 4 - k; tint(30, 80, 260, 50, hex('#db2424'), .85 * k); frameRect(30, 80, 260, 50, WHITE); ctext('TOO LONG', 96, WHITE, BLACK, sc > 3 ? 3 : 3); }
  } };
  await fadeIn(.08);
  for (let i = 0; i < 80 && !skipHeld(); i++) await nextFrame(); st = Math.max(st, 80); sfx('crash'); post.shake = 3; await wait(50); post.shake = 0; await wait(30);
  await fadeOut(.08);
  scene = { draw() { cls(hex('#000010')); ctext('SUPER-16', 50, hex('#6dff24'), BLACK, 2); ctext('NOW WITH', 90, UI.text); ctext('94% LESS', 104, hex('#ff49db'), BLACK, 2); ctext('READING', 126, hex('#ff49db'), BLACK, 2); ctext('SIMPLIFIED FOR CONSOLE PLAYERS', 160, UI.dim); ctext('AND NINTENDO FANS', 172, UI.dim); } };
  await fadeIn(.08); await readWait(110, 10); await fadeOut(.08);
  return titleScreen();
}

// ---------------- title ----------------
async function titleScreen() {
  music('title'); let t = 0; CUT = 1;
  const sv = fetchStore('c2x_save');
  RUN.outfit = (sv && sv.outfit) || RUN.outfit;
  let S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]);
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#100020', '#6d1a49');
    for (let i = 0; i < 40; i++) { const x = (i * 53 + t * (1 + i % 3)) % W, y = (i * 37) % 120; pset(x, y, hex('#ffdbff')); }
    for (let x = 0; x < W; x++) { const h = 14 + Math.sin(x * .07 + t * .2) * 4 + Math.sin(x * .19 - t * .33) * 3; rectF(x, 104 - h, 1, h, hex(x % 3 ? '#ff4900' : '#ffb600')); }
    ctext('CARL 2', 28, WHITE, BLACK, 4);
    const ex = 'EXTREME'; for (let i = 0; i < ex.length; i++) text(ex[i], 69 + i * 26 + (t >> 2 & 1 ? rnd(2) : 0), 74 + Math.round(Math.sin(t * .1 + i) * 2), hex(['#ffff92', '#ffb600', '#ff4900'][(i + (t >> 3)) % 3]), BLACK, 4);
    ctext('THE NO-READING EDITION', 112, hex('#6dffff'));
    drawScaled(S.run[(t >> 3) & 3], 140, 126, S.P, 2);
    if ((t >> 5) & 1) ctext('PRESS START', 186, WHITE);
    ctext('(C)1999 ' + PUB + ' LICENSED BY NOBODY', 210, UI.dim);
  } };
  await fadeIn(.06);
  for (;;) {
    while (!(pressed.start || pressed.a)) await nextFrame();
    sfx('ok');
    const opts = sv ? ['CONTINUE', 'NEW GAME', 'CLOSET', 'OPTIONS'] : ['START', 'CLOSET', 'OPTIONS'];
    const i = await choose(opts, { x: 120, y: 140, cancel: 1 }); if (i < 0) continue;
    const o = opts[i];
    if (o === 'OPTIONS') { await bigCard(['OPTIONS', '', 'REMOVED.', 'TOO MANY WORDS.'], 90); continue; }
    if (o === 'CLOSET') { await closet(sv); S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]); continue; }
    if (o === 'CONTINUE') { Object.assign(RUN, { lives: 5, lv: sv.lv || 0, outfit: RUN.outfit, words: sv.words || 0, bux: sv.bux || 0 }); await fadeOut(); return game(); }
    Object.assign(RUN, { lives: 5, lv: 0, bux: 0, words: 0, deaths: 0 }); saveX();
    await fadeOut(); await intro(); return game();
  }
}

// ---------------- the closet: the outfits. The only menu they kept ----------------
const unlocked = o => o.id === 'classic' || XMETA.got[o.id];
async function closet(sv) {
  const prev = scene; let i = Math.max(0, OUTFITS.findIndex(o => o.id === RUN.outfit)), t = 0;
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#241036', '#6d2470'); ctext('CLOSET', 14, hex('#ffdb24'), BLACK, 2);
    const o = OUTFITS[i], ok = unlocked(o), S = carlSet(o);
    rectF(112, 52, 96, 100, hex('#120a1c')); frameRect(112, 52, 96, 100, UI.edge);
    if (ok) drawScaled(S[['stand', 'run', 'jump', 'throw'][(t >> 6) & 3]][(t >> 3) & 3], 130, 62, S.P, 3);
    else { const s = S.stand[0]; for (let y = 0; y < s.h * 3; y++) for (let x = 0; x < s.w * 3; x++) if (s.d[((y / 3) | 0) * s.w + ((x / 3) | 0)]) pset(130 + x, 62 + y, hex('#241036')); ctext('?', 92, WHITE, BLACK, 3); }
    ctext(ok ? o.name : '???', 160, WHITE, BLACK, 2);
    ctext(ok ? o.blurb : o.id === 'tux' ? 'SAVE LINDA' : 'HIDDEN IN LEVEL ' + (LEVELS.findIndex(l => l.outfit === o.id) + 1), 182, UI.dim);
    const bob = (t >> 4) & 1; triF(96 - bob, 102, 104 - bob, 94, 104 - bob, 110, UI.name); triF(224 + bob, 102, 216 + bob, 94, 216 + bob, 110, UI.name);
    OUTFITS.forEach((q, k) => rectF(130 + k * 10, 200, 6, 6, k === i ? hex('#ffdb24') : unlocked(q) ? UI.dim : hex('#49246d')));
  } };
  for (;;) {
    await nextFrame();
    if (pressed.left) { i = (i + OUTFITS.length - 1) % OUTFITS.length; sfx('move'); }
    if (pressed.right) { i = (i + 1) % OUTFITS.length; sfx('move'); }
    if (pressed.a || pressed.start) { if (unlocked(OUTFITS[i])) { RUN.outfit = OUTFITS[i].id; sfx('get'); const s = fetchStore('c2x_save') || {}; s.outfit = RUN.outfit; store('c2x_save', s); break; } sfx('hurt'); }
    if (pressed.b || pressed.c) { sfx('tick'); break; }
  }
  scene = prev;
}

// ---------------- the story (all of it) ----------------
async function intro() {
  music('committee'); camX = camY = 0; CUT = 1;
  const linda = { x: 150, y: 150, w: 18, h: 30 }, dys = { x: 140, y: -70, w: 40, h: 54 }; let t = 0, ph = 0, carried = 0;
  const T = XTHEMES.mall; TILES = themeTiles(T);
  scene = { update() { t++; for (const b of BUBBLES) b.t--; BUBBLES = BUBBLES.filter(b => b.t > 0); }, draw() {
    skyD(0, H, '#241049', '#9249a0');
    for (let x = 0; x < W; x += 40) { rectF(x, 70, 36, 110, hex('#49246d')); rectF(x + 6, 80, 24, 14, hex(x % 80 ? '#ff49db' : '#24dbdb')); rectF(x + 8, 82, 20, 10, hex('#49246d')); }
    for (let x = 0; x < W; x += 16) draw(TILES['#top'], x, 180, T.P), draw(TILES['#'], x, 196, T.P), draw(TILES['#'], x, 212, T.P);
    rectF(118, 150, 50, 30, hex('#6d4924')); rectF(118, 150, 50, 3, hex('#926d49')); text('CEO', 133, 162, hex('#ffdb24'));
    draw(XS.linda[carried ? 1 : (t >> 5) & 1], linda.x, linda.y, XP.linda);
    draw(XS.dys[ph === 1 ? 2 : (t >> 4) & 1], dys.x, dys.y, XP.dys);
    if (ph === 1) for (let i = 0; i < 12; i++) { const a = t * .1 + i; draw(XS.letterShot['ABCDEFGHIJKL'[i]], dys.x + 16 + Math.cos(a) * 40, dys.y + 26 + Math.sin(a) * 30, XP.dys); }
    drawBubbles();
  } };
  await fadeIn(.06);
  quip('KPI MEETING. NOW.', linda, 80); await wait(70);
  ph = 1; sfx('glitch'); post.wave = 2;
  while (dys.y < 96) { dys.y += 2; await nextFrame(); }
  quip('YUO CTU ME!', dys, 90); await wait(60);
  quip('WHO ARE YOU?', linda, 70); await wait(60);
  quip('TEH WRODS!', dys, 70); await wait(50);
  carried = 1; sfx('crash'); post.wave = 0;
  for (let i = 0; i < 90; i++) { dys.y -= 2.4; linda.y = dys.y + 40; linda.x = dys.x + 12; await nextFrame(); }
  ph = 0; await fadeOut(.06); music(null);
  scene = { draw() { cls(hex('#100010')); } }; post.fade = 0; // the cards draw under the fade, so lift it
  for (const w of ['LINDA.', 'TAKEN.', 'BY DYSLEXIO.']) { sfx('crash'); await bigCard([w], 40, { bg: hex('#100010') }); }
  // Carl's whole reaction, as approved by marketing
  scene = { draw() { cls(hex('#000024')); draw(CS.carlPorts.n, 136, 70, CP.carlPort); frameRect(135, 69, 50, 50, UI.edge); drawBubbles(); } };
  camX = camY = 0; quip('...FINE.', { x: 150, y: 76, w: 20 }, 100); await wait(90);
  sfx('ok'); await bigCard(['GO.'], 40, { bg: hex('#ff4900') });
  BUBBLES = [];
}

// ---------------- levels ----------------
async function levelCard(L) {
  music(null); let t = 0;
  const S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]);
  scene = { update() { t++; }, draw() { cls(BLACK); ctext(L.tag, 50, hex('#ffdb24'), BLACK, 5); ctext(L.name, 110, WHITE, BLACK, 2); drawScaled(S.run[(t >> 3) & 3], 140, 140, S.P, 2); text('x' + RUN.lives, 186, 160, WHITE, BLACK, 2); } };
  RUN.words += words(L.name);
  await fadeIn(.1); await readWait(80, 0, 80, 0); await fadeOut(.1);
}
async function playLevel(i) {
  const L = LEVELS[i];
  await levelCard(L);
  loadLevel(L); scene = worldScene; CUT = 0;
  music(XTHEMES[L.theme].music);
  const done = new Promise(r => { LV.finish = r; });
  await fadeIn(.08);
  if (i === 0 && !RUN.saidStart) { RUN.saidStart = 1; carlSays('start', 1); }
  const res = await done; CUT = 1; return res;
}
async function tally(L) {
  music('sting'); await wait(10);
  const prev = scene; let t = 0;
  scene = { update() { t++; }, draw() {
    prev.draw(); tint(0, 40, W, 120, BLACK, .7);
    ctext('CLEAR!', 52, hex('#ffdb24'), BLACK, 3);
    if (t > 30) ctext('BUX  ' + RUN.bux, 92, WHITE);
    if (t > 60) ctext('WORDS READ SO FAR  ' + RUN.words, 108, WHITE);
    if (t > 90) ctext('(A NORMAL GAME: 40,000)', 120, UI.dim);
    if (t > 120) ctext('GOOD JOB.', 140, hex('#6dffff'));
  } };
  await wait(150); await waitBtn(); await fadeOut(.08);
}
async function game() {
  while (RUN.lv < LEVELS.length) {
    const res = await playLevel(RUN.lv);
    if (res === 'quit') return titleScreen();
    if (res === 'over') { await gameOverScreen(); continue; }
    const L = LEVELS[RUN.lv];
    if (L.id === 'keep') return ending();
    await tally(L); RUN.lv++; saveX();
  }
  return ending();
}
async function gameOverScreen() {
  music('canceled'); CUT = 1;
  let no = 0;
  scene = { draw() { cls(BLACK); ctext('GAME OVER', 70, hex('#db2424'), BLACK, 3); ctext('CONTINUE?', 120, WHITE); if (no) ctext('(THERE IS NO NO.)', 176, UI.dim); } };
  RUN.words += 3; await fadeIn(.06); await wait(40);
  await choose(['YES'], { x: 140, y: 140 });
  no = 1; RUN.words += 4; await wait(70);
  RUN.lives = 5; await fadeOut(.06);
}

// ---------------- the ending ----------------
async function ending() {
  CUT = 1; music(null);
  // the cage comes down
  const cage = ENTS.find(e => e.kind === 'cage');
  if (cage) { while (cage.y < 12 * TS - 40) { cage.y += 3; await nextFrame(); } sfx('crash'); post.shake = 3; SHAKE = 12; ENTS = ENTS.filter(e => e !== cage); }
  const linda = { x: (cage ? cage.x : PL.x + 60) + 5, y: 12 * TS - 30, w: 18, h: 30, dir: -1 };
  scene = { update() { worldUpdate(); }, draw() { drawBack(); drawPitShade(); drawTiles(); drawEnts(); drawCarl(); draw(XS.linda[0], linda.x - camX, linda.y - camY, XP.linda, true); drawFX(); drawBubbles(); drawHUD(); } };
  music('walkout');
  await wait(40);
  while (Math.abs(linda.x - PL.x) > 26) { linda.x += Math.sign(PL.x - linda.x) * .8; await nextFrame(); }
  PL.face = Math.sign(linda.x - PL.x) || 1;
  quip('CARL.', linda, 70); await wait(70);
  quip('YOU\'RE WELCOME.', PL, 80); await wait(80);
  // Linda gives a speech. The console version has a policy about speeches.
  const speech = 'CARL, I WANT YOU TO KNOW THAT THIS DOES NOT CHANGE YOUR STATUS AT THE MALL OF THE FUTURE. YOU ARE STILL BANNED. HOWEVER, IN LIGHT OF TODAY, AND IN LIGHT OF THE QUARTERLY NUMBERS, WHICH I WILL NOW WALK YOU THROUGH, SLIDE BY SLIDE, STARTING WITH Q1, WHERE WE SAW A';
  RUN.words += 20;
  let n = 0, stamp = 0;
  const base = scene.draw;
  scene = { update() { worldUpdate(); }, draw() { base(); panel(8, 130, W - 16, 86); wrapT(speech.slice(0, n), 48).slice(-6).forEach((l, i) => text(l, 16, 138 + i * 12, UI.text)); text('LINDA', 18, 124, UI.name);
    if (stamp) { tint(60, 150, 200, 40, hex('#db2424'), .9); frameRect(60, 150, 200, 40, WHITE); ctext('- 1,288 WORDS REMOVED -', 166, WHITE); } } };
  for (; n < speech.length; n += 3) { if (n % 6 === 0) sfx('blip', [520, 15]); await nextFrame(); if (n > 120) break; }
  stamp = 1; sfx('crash'); post.shake = 3; SHAKE = 12; await wait(90);
  scene = { update() { worldUpdate(); }, draw: base };
  quip('THANKS.', linda, 70); await wait(70);
  quip('SAY IT LONGER.', PL, 80); await wait(80);
  quip('NO.', linda, 60); await wait(80);
  // one letter survives. Carl keeps it.
  const A = { x: PL.x + 30, y: PL.y - 60 };
  for (let i = 0; i < 80; i++) { A.y += .9; FX.push({ k: 'spark', x: A.x + 4, y: A.y + 5, t: 6 }); draw(XS.letterShot.A, A.x - camX, A.y - camY, XP.dys); await nextFrame(); }
  quip('FOR CARL 3.', PL, 90); await wait(100);
  XMETA.got.tux = 1; XMETA.clears++; if (XMETA.best === null || RUN.words < XMETA.best) XMETA.best = RUN.words; saveXM();
  store('c2x_save', null);
  await fadeOut(.04);
  await credits();
}
async function credits() {
  music('credits');
  const L = ['CARL 2 EXTREME', '', 'DIRECTED BY', 'A FOCUS GROUP', '', 'WRITTEN BY', '(CUT)', '', 'STORY', 'LINDA. TAKEN. GO.', '', 'DYSLEXIO', 'EVERY WORD WE CUT', '', 'ROBO MALL COP', 'HIMSELF', '', 'MOBY DICK', 'UNABRIDGED', '', 'SPECIAL THANKS', 'CONSOLE PLAYERS', 'NINTENDO FANS', 'THE OTHER GUYS', '', 'AND YOU', 'FOR NOT READING THIS', '', '', PUB];
  let y = H + 10;
  scene = { update() { y -= .9; if (held.a || held.b) y -= 2; }, draw() { cls(BLACK); L.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy, i % 3 === 0 ? hex('#ffdb24') : WHITE); }); } };
  await fadeIn(.06);
  while (y + L.length * 14 > 0) await nextFrame();
  RUN.words += L.reduce((n, l) => n + words(l), 0);
  scene = { draw() { cls(BLACK); ctext('THE END', 46, WHITE, BLACK, 3); ctext('WORDS READ  ' + RUN.words, 100, hex('#ffdb24')); ctext('A NORMAL GAME  40,000', 114, UI.dim); ctext('YOU\'RE WELCOME.', 140, hex('#6dffff'), BLACK, 2); ctext('TUXEDO UNLOCKED', 190, hex('#ff49db')); } };
  await waitBtn(); await fadeOut(.06);
  return titleScreen();
}
