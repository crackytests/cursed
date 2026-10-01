'use strict';
// ================= PEE KID³ -- platformer engine =================
// POTENTIAL is the console's power. Below 25% the hardware can't hold 16-bit: LEGACY mode.
const TS = 16; let LH = 14; // LH: rows in the current level (14 = one screen; climbing sections are taller)
const ASPECT = {
  kid: { name: 'PEE KID', w: 10, h: 22, run: 1.9, jump: 5.5, verb: 'ASK' },
  wee: { name: 'PEE-WEE KID', w: 10, h: 24, run: 2.1, jump: 6.7, verb: 'PERFORM' },
  boy: { name: 'PEE BOY', w: 12, h: 32, run: 2.5, jump: 6.0, verb: 'INSPECT' },
};
let LV = null, STG = null, PERMA = false;
const PL = { x: 0, y: 0, vx: 0, vy: 0, on: false, face: 1, asp: 'kid', hurt: 0, dig: 3, pot: 50, coyote: 0, jbuf: 0, anim: 0, act: 0, ask: 0, halfJ: false, cx: 0, cy: 0, unlocked: ['kid'] };
const SAVE = { photos: [], stage: 1 };
let ENTS = [], SHOTS = [], FX = [], PULSE = null, legacyNow = false;

// ---------- tiles, drawn per theme ----------
function themeTiles(P) {
  const bevel = (g, a, b, c) => { g.r(0, 0, 16, 16, b); g.r(0, 0, 16, 1, c); g.r(0, 0, 1, 16, c); g.r(0, 15, 16, 1, a); g.r(15, 0, 1, 16, a); };
  return {
    '#': spr(16, 16, g => { bevel(g, 1, 2, 3); g.r(3, 3, 10, 10, 2); g.r(3, 3, 10, 1, 1); g.r(3, 3, 1, 10, 1); g.p(12, 12, 3); }),
    '=': spr(16, 16, g => { g.r(0, 0, 16, 4, 3); g.r(0, 4, 16, 1, 1); g.r(0, 0, 16, 1, 4); g.r(2, 5, 2, 4, 1); g.r(12, 5, 2, 4, 1); }),
    '^': spr(16, 16, g => { for (let i = 0; i < 4; i++) { g.line(i * 4, 15, i * 4 + 2, 6, 5); g.line(i * 4 + 2, 6, i * 4 + 4, 15, 5); g.line(i * 4 + 2, 7, i * 4 + 2, 15, 6); } g.r(0, 15, 16, 1, 1); }),
    'V': spr(16, 16, g => { g.r(0, 0, 16, 16, 1); for (let y = 2; y < 15; y += 3) g.r(2, y, 12, 2, 3); }),
    'T': spr(16, 32, g => { g.r(1, 0, 14, 32, 1); g.r(2, 1, 12, 31, 8); g.r(4, 4, 8, 7, 4); g.e(8, 7, 2, 2, 1); g.r(11, 18, 2, 3, 4); }),
    'D': spr(16, 32, g => { g.r(0, 0, 16, 32, 1); g.r(2, 2, 12, 30, 9); g.r(3, 4, 10, 4, 5); g.r(4, 5, 8, 2, 4); g.r(10, 18, 2, 3, 4); }),
    'P': [spr(16, 16, g => { g.r(0, 0, 16, 16, 1); g.r(2, 2, 12, 12, 6); for (let y = 3; y < 14; y += 2) g.r(3, y, 10, 1, 7); }), spr(16, 16, g => { g.r(0, 0, 16, 16, 1); g.r(2, 2, 12, 12, 7); for (let y = 3; y < 14; y += 2) g.r(3, y, 10, 1, 4); })],
    'M': [0, 1, 2].map(k => spr(16, 16, g => { g.r(6, 0, 4, 16, 5); g.r(7, 0, 2, 16, 4); for (let y = k * 5; y < 16; y += 15) g.r(5, y, 6, 2, 4); })),
    '?': spr(16, 16, g => { bevel(g, 1, 7, 4); g.r(6, 3, 4, 2, 1); g.r(9, 5, 2, 3, 1); g.r(7, 8, 2, 2, 1); g.r(7, 11, 2, 2, 1); }),
    'L': spr(16, 16, g => { g.r(0, 0, 16, 16, 3); g.r(0, 0, 16, 1, 1); g.r(0, 8, 16, 1, 1); g.r(8, 0, 1, 8, 1); g.r(3, 8, 1, 8, 1); g.r(12, 8, 1, 8, 1); g.r(1, 1, 6, 1, 2); }),
  };
}
const THEMES = {
  lab: { P: pal('#101820', '#38485c', '#6c84a0', '#d8f0ff', '#f83818', '#f8f800', '#30d8f8', '#e8f8f8', '#58a060', '#28a048', '#101820'),
    sky: ['#081018', '#203048'], far: '#141c2c', mid: '#1c2a40', farKind: 'pipes' },
  bus: { P: pal('#181010', '#585048', '#908878', '#f8e8c8', '#f82818', '#f8e000', '#48b8f8', '#f8f8f8', '#3890e0', '#e0a020', '#181010'),
    sky: ['#3070e0', '#f8b8a0'], far: '#8870a8', mid: '#486848', farKind: 'city' },
  school: { P: pal('#20100c', '#784830', '#b07848', '#f8e0b0', '#e02020', '#f8d020', '#48c860', '#f8f8e0', '#3860b8', '#48a0d8', '#20100c'),
    sky: ['#f8e8c0', '#d8c098'], far: '#c8a878', mid: '#a88858', farKind: 'lockers' },
  city: { P: pal('#08060c', '#282838', '#484860', '#a0a0d0', '#f81880', '#f8e838', '#38f0f8', '#f8f8f8', '#6048a8', '#e08030', '#08060c'),
    sky: ['#06061a', '#3a1850'], far: '#18142c', mid: '#241c3c', farKind: 'city' },
  core: { P: pal('#100808', '#482020', '#904040', '#f8c8a8', '#f8f818', '#f84818', '#f8f8f8', '#f8e0a0', '#583838', '#c06030', '#100808'),
    sky: ['#180404', '#601810'], far: '#300c0c', mid: '#401414', farKind: 'pipes' },
  roof: { P: pal('#181010', '#a07010', '#e0a020', '#f8d860', '#f82818', '#f8e000', '#48b8f8', '#f8f8f8', '#e0a020', '#f8d048', '#181010'),
    sky: ['#58a8f8', '#f8e8c0'], far: '#a8b8d8', mid: '#789868', farKind: 'city' },
  gym: { P: pal('#20100c', '#905828', '#c89050', '#f8e8c0', '#e02020', '#f8d020', '#48c860', '#f8f8e0', '#3860b8', '#48a0d8', '#20100c'),
    sky: ['#e8d0a0', '#c8a070'], far: '#b89060', mid: '#987040', farKind: 'lockers' },
  night: { P: pal('#08060c', '#303040', '#585870', '#b0b0e0', '#f81880', '#f8e838', '#38f0f8', '#f8f8f8', '#6048a8', '#e08030', '#08060c'),
    sky: ['#000008', '#181040'], far: '#100c20', mid: '#1c1830', farKind: 'city' },
  gb: { P: pal('#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#306230', '#8bac0f', '#9bbc0f', '#9bbc0f', '#306230', '#8bac0f', '#0f380f'),
    sky: ['#9bbc0f', '#8bac0f'], far: '#8bac0f', mid: '#306230', farKind: 'city' },
};
let TILES = null, TP = null;

// ---------- level ----------
function LB(w, h = 14) { // level builder
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  const b = {
    w, h, g,
    put(x, y, ch) { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = ch; return b; },
    fill(x0, x1, y0, y1, ch) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) b.put(x, y, ch); return b; },
    ground(x0, x1, top = 12) { return b.fill(x0, x1, top, h - 1, '#'); },
    plat(x0, x1, y) { return b.fill(x0, x1, y, y, '='); },
    col(x, y0, y1, ch = '#') { return b.fill(x, x, y0, y1, ch); },
  };
  return b;
}
function loadLevel(stage) {
  STG = stage; const L = stage.build();
  if (stage.boss && BOSSES[stage.boss] && BOSSES[stage.boss].arena) arenaize(L, stage); // a boss room at the end of the level
  LH = L.g.length;
  TILES = themeTiles(THEMES[stage.theme].P); TP = THEMES[stage.theme].P;
  LV = { w: L.w, g: L.g.map(r => r.slice()), revealed: {}, theme: THEMES[stage.theme] };
  ENTS = []; SHOTS = []; FX = []; PULSE = null; ARENA = null; BOSS = null; RISE = null;
  for (let y = 0; y < LH; y++) for (let x = 0; x < LV.w; x++) {
    const c = LV.g[y][x], wx = x * TS, wy = y * TS;
    const E = { J: 'juice', F: 'photo', H: 'heart' }[c];
    if (E) { ENTS.push({ kind: E, x: wx + 2, y: wy + 2, w: 12, h: 12, id: stage.id + ':' + x + ',' + y }); LV.g[y][x] = '.'; }
    const A = { a: 'tech', b: 'teacher', c: 'cop', m: 'monitor', s: 'star' }[c];
    if (A) { ENTS.push({ kind: 'adult', sk: A, x: wx, y: wy - 24, w: 14, h: 40, dir: -1, stun: 0, freeze: 0 }); LV.g[y][x] = '.'; }
    if (c === 'r') { ENTS.push({ kind: 'drone', x: wx, y: wy, w: 16, h: 12, dir: 1, base: wy, stun: 0, freeze: 0 }); LV.g[y][x] = '.'; }
    if (c === '@') { PL.cx = wx; PL.cy = wy + 8; LV.g[y][x] = '.'; }
    if (c === 'k') { ENTS.push({ kind: 'machine', x: wx, y: wy - 8, w: 16, h: 24, cool: 60 + rnd(60), stun: 0, freeze: 0 }); LV.g[y][x] = '.'; }
    if (c === 'l') { ENTS.push({ kind: 'spot', x: wx, y: 0, base: wx + 8, ph: x * .7, stun: 0, freeze: 0, w: 0, h: 0 }); LV.g[y][x] = '.'; }
    const X = MORE_FOES[c]; if (X) { ENTS.push(X(wx, wy, stage)); LV.g[y][x] = '.'; }
  }
  for (const n of stage.npcs || []) ENTS.push(Object.assign({ kind: 'npc', w: 16, h: 32 }, n, { x: n.x * TS, y: n.y * TS - 16 }));
  ENTS = ENTS.filter(e => !(e.kind === 'photo' && SAVE.photos.includes(e.id)));
  CHASE = stage.chase ? { x: 0, v: stage.chase } : null; SIGNT = 0;
  if (stage.rise) RISE = { y: 0, v: stage.rise };
  respawn();
}
const tileAt = (tx, ty) => (tx < 0 || tx >= LV.w) ? '#' : (ty < 0 ? '.' : ty >= LH ? '.' : LV.g[ty][tx]);
function solidAt(tx, ty) {
  const c = tileAt(tx, ty);
  if (c === '#') return true;
  if (c === 'P') return !(PL.pot >= 60 || PERMA);
  if (c === 'V') return PL.asp !== 'kid';
  if (c === 'L') return legacyNow;
  if (c === '?') return !!LV.revealed[tx + ',' + ty];
  return false;
}
function boxHits(x, y, w, h, fn) { for (let ty = Math.floor(y / TS); ty <= Math.floor((y + h - 1) / TS); ty++) for (let tx = Math.floor(x / TS); tx <= Math.floor((x + w - 1) / TS); tx++) if (fn(tx, ty)) return { tx, ty }; return null; }
const A = () => ASPECT[PL.asp];
// stages come in two sections: 1 / 11 are 1-1 / 1-2, ... 99 is the secret one
const world = id => id > 10 && id < 99 ? (id / 10 | 0) : id;
let secName = id => id === 99 ? '?-?' : world(id) + '-' + (id > 10 ? 2 : 1);

// ---------- player ----------
function respawn() { PL.x = PL.cx; PL.y = PL.cy - A().h + 8; PL.vx = PL.vy = 0; PL.hurt = 60; PL.helped = 0; camX = clamp(PL.x - W / 2, 0, LV.w * TS - W); camY = clamp(PL.y - H / 2, 0, LH * TS - H); if (CHASE) CHASE.x = PL.cx - 200; if (RISE) RISE.y = PL.cy + 200; }
function hurt(why) {
  if (PL.hurt > 0 || PERMA) return;
  PL.dig--; PL.hurt = 90; PL.vy = -3.5; PL.vx = -PL.face * 2.5; PL.pot = Math.min(100, PL.pot + 8);
  sfx('hurt'); post.shake = 3; SHAKE_T = 12;
  FX.push({ t: 50, x: PL.x, y: PL.y - 10, s: why || 'HEY!' });
  if (PL.dig <= 0) run(async () => {
    await say(pick(['The adults took over.', 'They handled him. That\'s what adults call it.', 'Too many grown-ups.']));
    PL.dig = SAVE.hard ? 1 : 3; respawn();
  });
}
function moveX(dx) {
  PL.x += dx; const a = A();
  const hit = boxHits(PL.x, PL.y, a.w, a.h, solidAt);
  if (hit) { PL.x = dx > 0 ? hit.tx * TS - a.w : (hit.tx + 1) * TS; PL.vx = 0; }
}
function moveY(dy) {
  const a = A(), prevBottom = PL.y + a.h; PL.y += dy; PL.on = false;
  const hit = boxHits(PL.x, PL.y, a.w, a.h, solidAt);
  if (hit) { if (dy > 0) { PL.y = hit.ty * TS - a.h; PL.on = true; } else PL.y = (hit.ty + 1) * TS; PL.vy = 0; return; }
  if (dy > 0) { // one-way platforms
    const ty = Math.floor((PL.y + a.h - 1) / TS);
    if (prevBottom <= ty * TS + 1) for (let tx = Math.floor(PL.x / TS); tx <= Math.floor((PL.x + a.w - 1) / TS); tx++)
      if (tileAt(tx, ty) === '=') { PL.y = ty * TS - a.h; PL.vy = 0; PL.on = true; return; }
  }
  // resting contact: feet sunk less than 1px into a floor count as standing. Without this, gravity's
  // sub-pixel steps made PL.on flicker (true 1 frame in 3), so UP at doors mostly did nothing.
  if (dy >= 0) {
    const feet = PL.y + a.h, ty = Math.floor(feet / TS);
    if (feet - ty * TS < 1) for (let tx = Math.floor(PL.x / TS); tx <= Math.floor((PL.x + a.w - 1) / TS); tx++)
      if (solidAt(tx, ty) || tileAt(tx, ty) === '=') { PL.y = ty * TS - a.h; PL.vy = 0; PL.on = true; return; }
  }
}
function switchAspect() {
  const u = PL.unlocked; if (u.length < 2) { FX.push({ t: 40, x: PL.x - 20, y: PL.y - 14, s: 'ONLY ONE OF ME' }); return; }
  const next = u[(u.indexOf(PL.asp) + 1) % u.length], na = ASPECT[next], oldH = A().h;
  const ny = PL.y + oldH - na.h;
  if (boxHits(PL.x, ny, na.w, na.h, solidAt)) { FX.push({ t: 40, x: PL.x - 10, y: PL.y - 14, s: 'NO ROOM' }); sfx('tick'); return; }
  PL.asp = next; PL.y = ny; sfx('switch'); banner(na.name, 50);
  for (let i = 0; i < 10; i++) FX.push({ t: 20, x: PL.x + rnd(12), y: PL.y + rnd(na.h), spark: 1 });
}
function ability() {
  const a = PL.asp;
  if (a === 'kid') { if (PL.ask > 0) return; PL.ask = 22; sfx('ask'); SHOTS.push({ x: PL.x + (PL.face > 0 ? a === 'kid' ? 10 : 0 : -8), y: PL.y + 2, vx: PL.face * 3.6, t: 46, s: pick(['CAN I GO?', 'WHY?', 'CAN I LEAVE?', 'IS THAT OKAY?', '?']) }); }
  if (a === 'boy' && !PULSE) { PULSE = { x: PL.x + 6, y: PL.y + 12, r: 0 }; sfx('stun'); }
}
// what UP would do right now: an npc, 'T' (bathroom) or 'D' (exit). Forgiving: half-on the doorway counts.
function nearThing() {
  const a = A(), cx = PL.x + a.w / 2, cy = PL.y + a.h / 2;
  const npc = ENTS.find(e => e.kind === 'npc' && (!e.legacy || legacyNow) && Math.abs(e.x + 8 - cx) < 22 && Math.abs(e.y + 16 - cy) < 30);
  if (npc) return npc;
  const ty = Math.floor((PL.y + a.h - 4) / TS);
  for (const x of [cx, cx - 6, cx + 6]) for (const dy of [0, -1]) { const c = tileAt(Math.floor(x / TS), ty + dy); if (c === 'T' || c === 'D') return c; }
  return null;
}
function interactNear() {
  const t = nearThing();
  if (t === 'T') run(bathroom); else if (t === 'D') run(() => STG.exit()); else if (t) run(() => t.talk(t));
  return !!t;
}
async function bathroom() {
  if (world(STG.id) === 3 && !SAVE.hallpass) return say('LOCKED. A SIGN: "HALL PASS REQUIRED." THE CLASS IS DOWN THE HALL. MAYBE THEY\'LL GIVE YOU ONE IF YOU EARN IT.');
  if (PL.pot < 5) return say('You don\'t have to go. You checked. Twice.', A().name);
  const c = await ask('A BATHROOM. POTENTIAL: ' + Math.round(PL.pot) + '%. USE IT? (THE HARDWARE WILL DOWNGRADE UNTIL YOUR POTENTIAL COMES BACK.)', null, ['GO', 'HOLD IT']);
  if (c !== 0) return say(pick(['Okay. I\'m holding it. For the graphics.', 'I can hold it. I\'ve held it through worse. I\'ve held it through a lot of worse.']), A().name);
  sfx('flush'); PL.pot = 0; PL.cx = PL.x; PL.cy = PL.y + A().h - 8; SAVE.stage = STG.id; savePK();
  await wait(50);
  if (!SAVE.firstFlush) { SAVE.firstFlush = 1; await say('...', A().name); await say('Oh. Everything got... smaller. Greener. Is that me? Did I do that?', A().name); await say('THE HARDWARE RUNS ON POTENTIAL. WITHOUT IT: LEGACY MODE. OLD PLATFORMS APPEAR. LASERS SHUT OFF. ADULTS STOP NOTICING YOU. IT COMES BACK AS YOU NEED TO GO AGAIN.'); }
  else await say(pick(['Better. Everything\'s green again. That\'s fine. I feel better.', 'Checkpoint. And a flush. The graphics are sad now, but I\'m not.']), A().name);
}

// ---------- update ----------
let SHAKE_T = 0;
function platUpdate() {
  const a = A();
  if (SHAKE_T > 0 && --SHAKE_T === 0) post.shake = 0;
  if (!busy) {
    PL.pot = Math.min(100, PL.pot + (PERMA || STG.forceLegacy ? 0 : SAVE.hard ? .056 : .028));
    if (PL.pot >= 100 && !PERMA && !STG.forceLegacy) run(accident);
  }
  const legacyTarget = PERMA || STG.forceLegacy || PL.pot < 25 ? 1 : 0;
  const was = legacyNow;
  post.legacy += Math.sign(legacyTarget - post.legacy) * .035; post.legacy = clamp(post.legacy, 0, 1);
  legacyNow = post.legacy > .5; LEGACY_AUDIO = legacyNow;
  if (legacyNow !== was && !PERMA) { if (legacyNow) sfx('powerdown'); else { sfx('power'); banner('HARDWARE: SUPER-16', 90); } if (legacyNow && boxHits(PL.x, PL.y, a.w, a.h, solidAt)) PL.y -= TS; }
  if (!busy) {
    const dir = PL.helped > 0 ? 0 : (held.right ? 1 : 0) - (held.left ? 1 : 0);
    PL.act = PL.asp === 'wee' && held.a && PL.on ? PL.act + 1 : 0;
    if (PL.act) { PL.vx *= .6; if (PL.act === 1) sfx('crowd'); }
    else {
      if (dir) { PL.vx = clamp(PL.vx + dir * .38, -a.run, a.run); PL.face = dir; } else PL.vx *= PL.on ? .7 : .94;
      if (pressed.b) PL.jbuf = 7;
      if (PL.jbuf > 0 && (PL.on || PL.coyote > 0)) { PL.vy = -a.jump; PL.jbuf = 0; PL.coyote = 0; PL.halfJ = false; sfx('jump'); }
      if (!held.b && PL.vy < -1.5 && !PL.halfJ) { PL.vy *= .5; PL.halfJ = true; }
      if (pressed.a) ability();
      if (pressed.c) switchAspect();
      if (pressed.up && PL.on) interactNear();
      if (pressed.start) run(pauseMenu);
    }
  }
  PL.jbuf = Math.max(0, PL.jbuf - 1); PL.ask = Math.max(0, PL.ask - 1); PL.hurt = Math.max(0, PL.hurt - 1); if (PL.helped > 0) PL.helped--;
  // dialogs/menus freeze the player in place: no leftover momentum, gravity or hazards
  if (busy) { PL.vx = 0; PL.act = 0; }
  else {
    if (STG.wind) PL.vx += legacyNow ? STG.wind * .3 : STG.wind;
    PL.vy = Math.min(7, PL.vy + .3);
    const wasOn = PL.on;
    moveX(PL.vx); moveY(PL.vy);
    if (PL.on && !wasOn && PL.vy === 0) sfx('land');
    PL.coyote = PL.on ? 6 : Math.max(0, PL.coyote - 1);
    if (PL.on && Math.abs(PL.vx) > .3) { PL.anim += Math.abs(PL.vx) * .12; if ((PL.anim | 0) % 2 === 0 && frame % 12 === 0) sfx('step'); }
    // hazards
    if (boxHits(PL.x + 2, PL.y + 4, a.w - 4, a.h - 4, (tx, ty) => tileAt(tx, ty) === '^' || (tileAt(tx, ty) === 'M' && !legacyNow))) hurt('OW!');
    if (PL.y > LH * TS + 40) { hurt('FELL'); respawn(); }
  }
  // shots (questions)
  for (const s of SHOTS) {
    s.x += s.vx; s.t--;
    if (boxHits(s.x, s.y, 6, 6, solidAt)) s.t = 0;
    if (s.t > 0 && BOSS && bossShot(s)) s.t = 0;
    for (const e of ENTS) if ((e.kind === 'adult' || e.kind === 'drone' || e.stunnable) && !e.stun && s.t > 0 && s.x > e.x - 4 && s.x < e.x + e.w && s.y > e.y - 4 && s.y < e.y + e.h) { e.stun = 200; s.t = 0; sfx('stun'); FX.push({ t: 50, x: e.x - 8, y: e.y - 12, s: pick(['UH.', 'WELL...', 'I MEAN...', 'THAT\'S NOT--', 'GOOD QUESTION.']) }); }
  }
  SHOTS = SHOTS.filter(s => s.t > 0);
  // the inspect pulse (reveals hidden blocks, stuns the nearest adults)
  if (PULSE) {
    PULSE.r += 4;
    for (let ty = Math.max(0, Math.floor((PULSE.y - 120) / TS)); ty < Math.min(LH, Math.ceil((PULSE.y + 120) / TS)); ty++) for (let tx = 0; tx < LV.w; tx++) if (tileAt(tx, ty) === '?' && !LV.revealed[tx + ',' + ty] && Math.hypot(tx * TS + 8 - PULSE.x, ty * TS + 8 - PULSE.y) < PULSE.r) {
      if (!boxHits(PL.x, PL.y, a.w, a.h, (x, y) => x === tx && y === ty)) { LV.revealed[tx + ',' + ty] = 1; sfx('ok'); FX.push({ t: 40, x: tx * TS - 8, y: ty * TS - 10, s: 'CLUE!' }); }
    }
    for (const e of ENTS) if ((e.kind === 'adult' || e.kind === 'drone' || e.stunnable) && Math.hypot(e.x + 7 - PULSE.x, e.y + 20 - PULSE.y) < Math.min(PULSE.r, 60)) e.stun = Math.max(e.stun, 90);
    if (BOSS && !PULSE.bossed && Math.hypot(BOSS.x - PULSE.x, BOSS.y - PULSE.y) < PULSE.r + 30) { PULSE.bossed = 1; bossInspect(); }
    if (PULSE.r > 110) PULSE = null;
  }
  // entities
  for (const e of ENTS) {
    if (e.kind === 'adult' || e.kind === 'drone') {
      if (PL.act && Math.abs(e.x - PL.x) < 130) e.freeze = 12;
      if (e.stun > 0) e.stun--; if (e.freeze > 0) e.freeze--;
      const still = e.stun > 0 || e.freeze > 0 || busy;
      if (!still) {
        if (e.kind === 'adult') {
          const sp = e.sk === 'cop' ? .8 : .55, nx = e.x + e.dir * sp;
          const fx = e.dir > 0 ? nx + e.w : nx, footTy = Math.floor((e.y + e.h + 2) / TS), bodyTy = Math.floor((e.y + e.h - 8) / TS), ftx = Math.floor(fx / TS);
          const floorAhead = solidAt(ftx, footTy) || tileAt(ftx, footTy) === '=';
          if (solidAt(ftx, bodyTy) || !floorAhead) e.dir *= -1; else e.x = nx;
          e.anim = (e.anim || 0) + .08;
        } else { e.x += e.dir * .9; e.y = e.base + Math.sin(frame * .05 + e.x * .01) * 10; if (solidAt(Math.floor((e.x + (e.dir > 0 ? 16 : 0)) / TS), Math.floor(e.y / TS))) e.dir *= -1; }
      }
      const touching = PL.x < e.x + e.w - 2 && PL.x + a.w > e.x + 2 && PL.y < e.y + e.h && PL.y + a.h > e.y + 6;
      if (touching && !still && !legacyNow) hurt(e.kind === 'drone' ? 'BEEP!' : pick(['BUDDY.', 'LITTLE MAN.', 'COME HERE.', 'WHERE\'S YOUR GROWN-UP?']));
    }
    if ((e.kind === 'juice' || e.kind === 'photo' || e.kind === 'heart') && !e.got && PL.x < e.x + e.w && PL.x + a.w > e.x && PL.y < e.y + e.h && PL.y + a.h > e.y) {
      e.got = 1;
      if (e.kind === 'juice') { PL.pot = Math.min(99, PL.pot + 25); sfx('ok'); FX.push({ t: 40, x: e.x - 10, y: e.y - 8, s: '+25% POTENTIAL' }); }
      if (e.kind === 'heart') { PL.dig = Math.min(SAVE.hard ? 1 : 3, PL.dig + 1); sfx('ok'); }
      if (e.kind === 'photo') { SAVE.photos.push(e.id); savePK(); sfx('get'); run(() => photoFound(SAVE.photos.length)); }
    }
  }
  for (const e of ENTS) if (e.upd) e.upd(e, a);
  if (BOSS) bossUpdate(a);
  ENTS = ENTS.filter(e => !e.got);
  for (const f of FX) f.t--; FX = FX.filter(f => f.t > 0);
  gimmicks(a);
  if (STG.tick) STG.tick();
  // camera
  const tx = ARENA ? ARENA.x0 : PL.x + a.w / 2 - W / 2 + PL.face * 24;
  camX += (clamp(tx, 0, LV.w * TS - W) - camX) * (ARENA ? .08 : .12);
  camX = clamp(camX, 0, LV.w * TS - W);
  const ty = PL.y + a.h / 2 - H / 2 - 8;
  camY += (clamp(ty, 0, LH * TS - H) - camY) * .14; camY = clamp(camY, 0, LH * TS - H);
  if (ARENA) PL.x = clamp(PL.x, ARENA.x0 + 2, ARENA.x0 + W - a.w - 2);
  if (STG.arenaAt && !LV.bossStarted && !busy && PL.x > STG.arenaAt * TS && BOSSES[STG.boss]) run(startBoss);
}
async function accident() {
  PL.pot = 0; PL.dig = Math.max(1, PL.dig - 1);
  sfx('powerdown'); post.flash = .6; await wait(6); post.flash = 0;
  await say(pick(['...Oh no.', '...I told you I had to go. I told everybody.', '...']), A().name);
  await say(pick(['THE GENERATOR LOST ALL POTENTIAL. SOMEWHERE, AN ADULT IS VERY UPSET ABOUT THE GRAPHICS.', 'POTENTIAL: 0%. THE UPGRADE IS OVER UNTIL HE NEEDS TO GO AGAIN.']));
  if (STG.onAccident) await STG.onAccident();
  if (SAVE.hard) { await say('HOLD IT MODE: BACK TO THE LAST BATHROOM.'); respawn(); }
}

// ---------- render ----------
function drawFar(th, par, col, kind, seed, base) {
  const off = camX * par;
  for (let i = -1; i < 12; i++) {
    const bx = Math.floor(off / 40) + i, x = bx * 40 - off, h = 30 + ((bx * 7919 + seed) % 60 + 60) % 60;
    if (kind === 'city') { rectF(x, base - h, 34, h + 40, col); for (let wy = base - h + 6; wy < base; wy += 8) for (let wx = x + 4; wx < x + 30; wx += 8) if (((bx * 31 + wy) % 5 + 5) % 5 === 0) rectF(wx, wy, 3, 4, mix(col, hex('#f8e888'), .6)); }
    else if (kind === 'pipes') { rectF(x + 10, 0, 8, base + 40, col); rectF(x, base - h, 40, 6, col); rectF(x + 26, base - h - 20, 4, 20, mix(col, hex('#30d8f8'), .3)); }
    else if (kind === 'lockers') { rectF(x, base - 70, 38, 110, col); rectF(x + 2, base - 66, 16, 50, mix(col, BLACK, .15)); rectF(x + 20, base - 66, 16, 50, mix(col, BLACK, .15)); rectF(x + 14, base - 40, 2, 5, mix(col, WHITE, .4)); }
  }
}
function drawTileAt(c, tx, ty) {
  const x = tx * TS - Math.round(camX), y = ty * TS - Math.round(camY);
  if (c === '.' || x < -16 || x > W) return;
  if (c === 'L') { if (post.legacy > .3) draw(TILES.L, x, y, LEGPAL); else if (frame % 40 < 20) frameRect(x + 4, y + 4, 8, 8, TP[3]); return; }
  if (c === 'M') { if (!legacyNow) draw(TILES.M[(frame >> 2) % 3], x, y, TP); return; }
  if (c === 'P') { draw(TILES.P[PL.pot >= 60 || PERMA ? 1 : 0], x, y, TP); if (PL.pot >= 60 || PERMA) rectF(x + 3, y + 3, 10, 10, mix(TP[7], BLACK, .3)); return; }
  if (c === '?') { if (LV.revealed[tx + ',' + ty]) draw(TILES['?'], x, y, TP); return; }
  if (c === 'T' || c === 'D') {
    if (tileAt(tx, ty - 1) === c) return;
    draw(TILES[c], x, y, TP);
    // door signs: RESTROOM blinks when he really has to go
    const hot = c === 'T' && PL.pot >= 75 && !PERMA && (frame >> 4) & 1, lab = c === 'T' ? 'WC' : 'EXIT', w = lab.length * 6 + 5;
    rectF(x + 8 - (w >> 1), y - 12, w, 10, c === 'T' ? (hot ? hex('#f8d020') : hex('#2858c0')) : hex('#208040')); frameRect(x + 8 - (w >> 1), y - 12, w, 10, WHITE);
    text(lab, x + 11 - (w >> 1), y - 11, hot ? BLACK : WHITE, 0);
    return;
  }
  if (TILES[c]) draw(TILES[c], x, y, TP);
}
function platDraw() {
  const th = LV.theme;
  sky(0, H, hex(th.sky[0]), hex(th.sky[1]));
  drawFar(th, .2, hex(th.far), th.farKind, 11, 150);
  drawFar(th, .5, hex(th.mid), th.farKind === 'lockers' ? 'lockers' : th.farKind, 57, 190);
  const x0 = Math.floor(camX / TS);
  const y0 = Math.floor(camY / TS);
  for (let ty = y0; ty <= Math.min(LH - 1, y0 + 14); ty++) for (let tx = x0; tx <= x0 + 21; tx++) drawTileAt(tileAt(tx, ty), tx, ty);
  if (RISE) drawRise();
  // entities
  for (const e of ENTS) {
    const x = Math.round(e.x - camX), y = Math.round(e.y - camY);
    if (x < -40 || x > W + 40 || y < -60 || y > H + 40) continue;
    if (e.draw2) { e.draw2(e, x, y); continue; }
    if (e.kind === 'adult') { draw(ADULT[e.sk][e.stun || e.freeze ? 0 : (e.anim | 0) & 1], x - 5, y - 4, ADULTPAL[e.sk], e.dir < 0); if (e.stun) text('?', x + 4, y - 12 + Math.round(Math.sin(frame * .2) * 2), hex('#f8f800')); if (e.freeze) text('!', x + 4, y - 12, hex('#f8f8f8')); }
    else if (e.kind === 'drone') { rectF(x, y, 16, 8, hex('#303040')); rectF(x + 5, y + 2, 6, 4, hex('#f82020')); rectF(x - 2, y - 2, 20, 2, hex('#808090')); if (e.stun) text('?', x + 4, y - 10, hex('#f8f800')); }
    else if (e.kind === 'juice') { const b = Math.round(Math.sin(frame * .1 + e.x) * 2); rectF(x + 2, y + b, 8, 12, hex('#f8a020')); rectF(x + 2, y + b, 8, 3, hex('#f8f8f8')); rectF(x + 7, y - 3 + b, 1, 4, hex('#f8f8f8')); frameRect(x + 1, y - 1 + b, 10, 14, BLACK); }
    else if (e.kind === 'photo') { const b = Math.round(Math.sin(frame * .08 + e.x) * 2); rectF(x, y + b, 12, 12, WHITE); rectF(x + 1, y + 1 + b, 10, 8, hex('#6080a0')); rectF(x + 3, y + 4 + b, 2, 5, BLACK); rectF(x + 7, y + 3 + b, 2, 6, BLACK); frameRect(x - 1, y - 1 + b, 14, 14, BLACK); }
    else if (e.kind === 'heart') text('@', x + 2, y + 2, hex('#f83850'));
    else if (e.kind === 'npc') {
      if (e.legacy) { if (post.legacy > .5) draw(LEGACY[e.spr], x, y + 16, LEGPAL); else if (frame % 60 < 3) draw(LEGACY[e.spr], x + rnd(3), y + 16, LEGPAL); }
      else if (e.draw) e.draw(x, y);
    }
  }
  // player
  if (BOSS) bossDraw();
  const a = A(), K = KID[PL.asp], px = Math.round(PL.x - camX) - (24 - a.w) / 2, py = Math.round(PL.y - camY) - (K.stand.h - a.h) + 1;
  let S = K.stand;
  if (PL.act) S = K.act[(frame >> 3) & 1]; else if (PL.ask > 12) S = K.ask; else if (!PL.on) S = K.jump; else if (Math.abs(PL.vx) > .3) S = K.run[(PL.anim | 0) & 3];
  if (!(PL.hurt && (frame >> 2) & 1)) draw(S, px, py, KIDPAL[PL.asp], PL.face < 0);
  if (PL.helped > 0 && (frame >> 3) & 1) text('HELPED', px - 4, py - 12, hex('#dbb6ff'));
  if (PL.act) { for (let i = 0; i < 3; i++) text(pick(['*', '+', '!']), px + 4 + Math.round(Math.sin(frame * .1 + i * 2) * 20), py - 10 - i * 6, hex('#f8e040')); }
  for (const s of SHOTS) { const x = Math.round(s.x - camX), sy = Math.round(s.y - camY); const w = s.s.length * 6 + 6; rectF(x - 2, sy - 2, w, 11, WHITE); frameRect(x - 3, sy - 3, w + 2, 13, BLACK); text(s.s, x + 1, sy, BLACK, 0); }
  // UP prompt over his head when there's something to do here
  if (!busy && PL.on && scene === platScene) { const t = nearThing(); if (t) { const lab = t === 'T' ? 'BATHROOM' : t === 'D' ? 'EXIT' : 'TALK', w = lab.length * 6 + 16, bx = Math.round(PL.x - camX + a.w / 2 - w / 2), by = Math.round(PL.y - camY) - 22 + ((frame >> 4) & 1);
    rectF(bx, by, w, 12, BLACK); frameRect(bx, by, w, 12, UI.name); arrowGlyph('up', bx + 3, by + 2, UI.name); text(lab, bx + 14, by + 3, WHITE, 0); } }
  if (PULSE) for (let a2 = 0; a2 < 64; a2++) pset(PULSE.x - camX + Math.cos(a2 / 64 * 6.28) * PULSE.r, PULSE.y - camY + Math.sin(a2 / 64 * 6.28) * PULSE.r * .6, hex('#f8e040'));
  for (const f of FX) { if (f.spark) pset(f.x - camX, f.y - camY - (20 - f.t), hex('#f8f8a0')); else text(f.s, Math.round(f.x - camX), Math.round(f.y - camY - (50 - f.t) * .3), hex('#f8f8f8')); }
  drawGimmicks();
  if (STG.draw) STG.draw();
  hud();
  if (BOSS) bossBar();
  if (SAVE.ta) taHud();
}
function hud() {
  panel(0, 0, W, 22);
  const a = PL.asp, P = PORT[ASPECT[a].name];
  drawScaled(P.s, 4, 3, P.P, .34);
  text(ASPECT[a].name, 24, 4, UI.name); text(ASPECT[a].verb + ':A JUMP:B' + (PL.unlocked.length > 1 ? ' SWAP:C' : ''), 24, 13, UI.dim);
  for (let i = 0; i < 3; i++) text('@', 176 + i * 8, 4, i < PL.dig ? hex('#f83850') : hex('#403850'));
  text('POTENTIAL', 176, 13, UI.dim);
  const pw = 60, pv = Math.round(PL.pot);
  rectF(236, 12, pw + 2, 8, BLACK);
  for (let i = 0; i < pw * PL.pot / 100; i++) rectF(237 + i, 13, 1, 6, i < pw * .25 ? hex('#50a050') : i < pw * .6 ? hex('#f8d020') : i < pw * .9 ? hex('#f88020') : hex('#f82020'));
  rectF(237 + pw * .6, 12, 1, 8, WHITE);
  text(pv + '%', 300, 13, pv >= 90 && (frame >> 3) & 1 ? hex('#f82020') : UI.text);
  text(legacyNow ? 'HW:LEGACY' : 'HW:16-BIT', 236, 3, legacyNow ? hex('#9bbc0f') : hex('#80d0f8'));
}
const platScene = { update: platUpdate, draw: platDraw };

// ---------- section gimmicks: the chasing generator, bus signs, dodgeball machines, spotlights ----------
let CHASE = null, SIGNT = 0;
const CAUGHT = ['THE GENERATOR GOT HIM BACK. FOR A SECOND.', 'IT PULLED HIM IN. IT LET HIM GO. IT LIKES TO DO THAT.', 'Nope. Nope nope nope.'];
function gimmicks(a) {
  const px = PL.x + a.w / 2, touch = e => PL.x < e.x + e.w && PL.x + a.w > e.x && PL.y < e.y + e.h && PL.y + a.h > e.y;
  if (RISE && !busy) {
    RISE.y = Math.min(RISE.y - (legacyNow ? RISE.v * .35 : RISE.v), PL.y + 260);
    if (PL.y + a.h > RISE.y + 4) run(async () => { sfx('glitch'); post.flash = .6; await wait(5); post.flash = 0; await say(pick(STG.riseLines || CAUGHT)); PL.dig = Math.max(1, PL.dig - 1); respawn(); });
  }
  if (CHASE && !busy) {
    CHASE.x = Math.max(CHASE.x + (legacyNow ? CHASE.v * .35 : CHASE.v), PL.x - 280);
    if (PL.x < CHASE.x + 6) run(async () => { sfx('glitch'); post.flash = .7; await wait(5); post.flash = 0; await say(pick(CAUGHT)); PL.dig = Math.max(1, PL.dig - 1); respawn(); });
  }
  if (STG.signs && !busy && !ARENA && ++SIGNT >= STG.signs) { SIGNT = 0; const hi = rnd(2), top = STG.roof * TS; ENTS.push({ kind: 'sign', hi, x: camX + W + 10, y: hi ? top - 62 : top - 18, w: 34, h: hi ? 22 : 18 }); }
  for (const e of ENTS) {
    if (e.kind === 'sign' && !busy) { e.x -= legacyNow ? 1.2 : 3.2; if (e.x < camX - 60) e.got = 1; if (!legacyNow && touch(e)) hurt('ROAD SIGN!'); }
    if (e.kind === 'machine') {
      if (PL.act && Math.abs(e.x - PL.x) < 130) e.freeze = 12;
      if (e.stun > 0) e.stun--; if (e.freeze > 0) e.freeze--;
      if (!busy && !e.stun && !e.freeze && !legacyNow && Math.abs(px - e.x) < 240 && --e.cool <= 0) { e.cool = 110; const d = px < e.x ? -1 : 1; ENTS.push({ kind: 'ball', x: e.x + 4, y: e.y + 6, w: 8, h: 8, vx: d * 2.6, t: 240 }); sfx('jump'); }
    }
    if (e.kind === 'ball' && !busy) { e.x += e.vx; e.t--; if (e.t <= 0 || boxHits(e.x, e.y, 8, 8, solidAt)) e.got = 1; else if (!legacyNow && touch(e)) { e.got = 1; hurt('DODGEBALL!'); } }
    if (e.kind === 'spot') {
      if (e.stun > 0) e.stun--;
      e.bx = e.base + Math.sin(frame * .018 + e.ph) * 80;
      if (!busy && !e.stun && !legacyNow && Math.abs(px - e.bx) < 14) { hurt('FREEZE!'); }
    }
  }
  if (PULSE) for (const e of ENTS) if ((e.kind === 'machine' && Math.hypot(e.x - PULSE.x, e.y - PULSE.y) < PULSE.r) || (e.kind === 'spot' && Math.abs(e.bx - PULSE.x) < PULSE.r)) e.stun = Math.max(e.stun, 180);
  for (const s of SHOTS) for (const e of ENTS) if (e.kind === 'machine' && !e.stun && s.t > 0 && s.x > e.x - 4 && s.x < e.x + 16 && s.y > e.y - 4 && s.y < e.y + 24) { e.stun = 200; s.t = 0; sfx('stun'); FX.push({ t: 50, x: e.x - 8, y: e.y - 12, s: 'BZZT?' }); }
  if (ENTS.some(e => e.got)) ENTS = ENTS.filter(e => !e.got);
}
function drawGimmicks() {
  const oy = Math.round(camY);
  for (const e of ENTS) {
    const x = Math.round(e.x - camX);
    if (e.kind === 'spot' && !legacyNow && !e.stun) {
      const floor = 12 * TS;
      for (let y = 22; y < floor; y++) { const hw = 4 + (y / floor) * 14, cx = Math.round(e.bx - camX); for (let xx = Math.max(0, cx - hw | 0); xx < Math.min(W, cx + hw); xx++) FB[y * W + xx] = mix(FB[y * W + xx], hex('#f8f0a0'), .3); }
    }
    if (x < -40 || x > W + 40) continue;
    if (e.kind === 'machine') { const y = e.y - oy; rectF(x, y, 16, 24, hex('#504860')); rectF(x + 2, y + 2, 12, 8, e.stun || e.freeze ? hex('#303030') : hex('#f83030')); rectF(x + 4, y + 12, 8, 8, hex('#202028')); frameRect(x, y, 16, 24, BLACK); if (e.stun) text('?', x + 5, y - 10, hex('#f8f800')); }
    if (e.kind === 'ball') { const y = e.y - oy; rectF(x, y + 1, 8, 6, hex('#e83828')); rectF(x + 1, y, 6, 8, hex('#e83828')); rectF(x + 2, y + 1, 2, 2, hex('#f8a080')); }
    if (e.kind === 'sign') { const y = e.y - oy; rectF(x + 15, e.hi ? y + 22 : y + 12, 4, e.hi ? 40 : 6, hex('#808890')); rectF(x, y, 34, e.hi ? 22 : 12, hex('#207838')); frameRect(x, y, 34, e.hi ? 22 : 12, WHITE); text(e.hi ? 'EXIT' : 'SLOW', x + 5, y + (e.hi ? 8 : 3), WHITE, 0); }
  }
  if (CHASE) {
    const cx = CHASE.x - camX;
    if (cx > -30) for (let y = 22; y < H; y++) { const w = cx + Math.sin(y * .12 + frame * .25) * 6 + Math.sin(y * .05 - frame * .1) * 4; if (w > 0) { rectF(0, y, w, 1, mix(hex('#f83890'), hex('#38d8f8'), (Math.sin(y * .07 + frame * .15) + 1) / 2)); rectF(w - 2, y, 2, 1, WHITE); } }
  }
}

let RISE = null, ARENA = null, BOSS = null;
function drawRise() {
  const top = Math.round(RISE.y - camY); if (top > H) return;
  const [c1, c2] = STG.riseCol || ['#30d8f8', '#2050a0'];
  for (let y = Math.max(22, top - 6); y < H; y++) { const wv = Math.sin(y * .1 + frame * .2) * 3, edge = top + Math.sin(frame * .1) * 2 + wv; if (y < edge) continue; rectF(0, y, W, 1, mix(hex(c1), hex(c2), clamp((y - edge) / 60, 0, 1))); }
  for (let x = 0; x < W; x += 4) pset(x, top + Math.round(Math.sin(x * .1 + frame * .2) * 2), WHITE);
}
