'use strict';
// ================= PEE KID³ — second content pass: new enemies, bosses, climbing sections, post-game, foreshadowing =================
// Loaded after pkstory.js. Bosses are beaten the kid's way: asking, performing, inspecting. Nobody gets hit.

// ---------- shared helpers ----------
const touchPL = (e, a) => PL.x < e.x + e.w - 2 && PL.x + a.w > e.x + 2 && PL.y < e.y + e.h && PL.y + a.h > e.y + 4;
function holdStill(e) { if (PL.act && Math.abs(e.x - PL.x) < 130) e.freeze = 12; if (e.stun > 0) e.stun--; if (e.freeze > 0) e.freeze--; return e.stun > 0 || e.freeze > 0 || busy; }
function patrol(e, sp) { // walk, turn at walls and ledges (the same rule the adults use)
  const nx = e.x + e.dir * sp, fx = e.dir > 0 ? nx + e.w : nx, footTy = Math.floor((e.y + e.h + 2) / TS), bodyTy = Math.floor((e.y + e.h - 8) / TS), ftx = Math.floor(fx / TS);
  if (solidAt(ftx, bodyTy) || !(solidAt(ftx, footTy) || tileAt(ftx, footTy) === '=')) { e.dir *= -1; return false; }
  e.x = nx; return true;
}
// a thrown thing. hard: hurts even in legacy mode (bosses can always see you)
function proj(x, y, vx, vy, o = {}) { ENTS.push(Object.assign({ kind: 'proj', x, y, w: 8, h: 8, vx, vy, g: .15, t: 300, upd: projUpd, draw2: projDraw, icon: 'dot' }, o)); }
function projUpd(e, a) {
  if (busy) return; e.vy += e.g; e.x += e.vx; e.y += e.vy;
  if (--e.t <= 0 || (!e.ghost && boxHits(e.x, e.y, e.w, e.h, solidAt)) || e.y > LH * TS + 20) { e.got = 1; return; }
  if ((e.hard || !legacyNow) && touchPL(e, a)) { e.got = 1; hurt(e.say || 'HEY!'); }
}
const ICONS = {
  memo: (x, y) => { rectF(x, y + 2, 10, 4, WHITE); rectF(x + 2, y, 6, 2, hex('#d0d0d8')); pset(x + 9, y + 1, WHITE); },
  headshot: (x, y) => { rectF(x, y, 9, 11, WHITE); rectF(x + 1, y + 1, 7, 7, hex('#f8c890')); rectF(x + 2, y + 2, 5, 2, hex('#402010')); },
  tot: (x, y) => { rectF(x, y + 1, 8, 6, hex('#f8a020')); rectF(x + 1, y + 2, 2, 2, hex('#c06010')); },
  flash: (x, y) => { rectF(x, y + 3, 10, 2, WHITE); rectF(x + 4, y - 1, 2, 10, WHITE); rectF(x + 3, y + 2, 4, 4, hex('#f8f8a0')); },
  battery: (x, y) => { rectF(x, y + 1, 10, 6, hex('#30d8f8')); rectF(x + 10, y + 3, 2, 2, hex('#f8f8f8')); rectF(x + 1, y + 2, 3, 4, hex('#f8f800')); },
  wave: (x, y) => { for (let i = 0; i < 12; i++) pset(x + i, y + 4 + Math.round(Math.sin(i * .9 + frame * .5) * 2), hex('#f8e040')); },
  word: (x, y, e) => { const w = e.word.length * 6 + 4; rectF(x - 2, y - 2, w, 11, hex('#f8f8f8')); frameRect(x - 2, y - 2, w, 11, hex('#e02020')); text(e.word, x, y, hex('#e02020'), 0); },
  dvd: (x, y) => { circF(x + 4, y + 4, 4, hex('#d0d0e0')); circF(x + 4, y + 4, 1, BLACK); },
  dot: (x, y) => { circF(x + 4, y + 4, 3, hex('#f83838')); },
};
function projDraw(e, x, y) { (ICONS[e.icon] || ICONS.dot)(x, y, e); }
const mark = (e, x, y) => { if (e.stun) text('?', x + 4, y - 10 + Math.round(Math.sin(frame * .2) * 2), hex('#f8f800')); else if (e.freeze) text('!', x + 4, y - 10, WHITE); };

// ---------- the new enemies (map chars g f w d y z) ----------
// each theme dresses them differently: the lab has managers and forklifts, the school has lunch ladies and AV carts...
const FLAVOR = {
  lab: { g: ['tech', { 5: '#606878', 6: '#404858' }, 'memo', 'MEMO!'], f: ['FORKLIFT', '#f8c020'] },
  bus: { g: ['star', { 5: '#f878b8', 6: '#c04888' }, 'headshot', 'SIGN THIS!'], f: ['LUGGAGE', '#a07040'] },
  roof: { g: ['star', { 5: '#f878b8', 6: '#c04888' }, 'headshot', 'SIGN THIS!'], f: ['LUGGAGE', '#a07040'] },
  school: { g: ['teacher', { 4: '#f8f8f8', 5: '#f0f0f0', 6: '#c0c0d0' }, 'tot', 'EAT IT!'], f: ['AV CART', '#3860b8'] },
  gym: { g: ['teacher', { 4: '#f8f8f8', 5: '#f0f0f0', 6: '#c0c0d0' }, 'tot', 'EAT IT!'], f: ['AV CART', '#3860b8'] },
  city: { g: ['monitor', { 5: '#383838', 6: '#202020' }, 'flash', 'FLASH!'], f: ['SEGWAY', '#2838a0'] },
  night: { g: ['monitor', { 5: '#383838', 6: '#202020' }, 'flash', 'FLASH!'], f: ['SEGWAY', '#2838a0'] },
  core: { g: ['tech', { 5: '#c06030', 6: '#803010' }, 'battery', 'ZAP!'], f: ['CART', '#c06030'] },
};
const flav = st => FLAVOR[st.theme] || FLAVOR.lab;
const ADULTPAL_X = {}; // recolored adults, cached by theme
function adultPalFor(st) { const [sk, ch] = flav(st).g, k = st.theme; return ADULTPAL_X[k] || (ADULTPAL_X[k] = recolor(ADULTPAL[sk], ch)); }
const MORE_FOES = {
  // the thrower: walks, stops, throws whatever this place throws
  g: (x, y, st) => { const [sk, , icon, sayIt] = flav(st).g; return { kind: 'thrower', stunnable: 1, x, y: y - 24, w: 14, h: 40, dir: -1, stun: 0, freeze: 0, cool: 80 + rnd(60), sk, P: adultPalFor(st), icon, sayIt,
    upd(e, a) { if (holdStill(e)) return; if (e.throwing > 0) { e.throwing--; return; } patrol(e, .45); e.anim = (e.anim || 0) + .08;
      const dx = PL.x - e.x; if (!legacyNow && --e.cool <= 0 && Math.abs(dx) < 220 && Math.abs(PL.y - e.y) < 90) { e.cool = 110; e.throwing = 20; e.dir = Math.sign(dx) || 1; const flat = e.icon === 'flash'; proj(e.x + 4, e.y + 8, flat ? e.dir * 3 : dx / 50, flat ? 0 : -3.2, { icon: e.icon, say: e.sayIt, g: flat ? 0 : .15 }); sfx('jump'); }
      if (touchPL(e, a) && !legacyNow) hurt(pick(['BUDDY.', 'NOT NOW.', 'HEY. HEY.'])); },
    draw2(e, x, y) { draw(ADULT[e.sk][e.stun || e.freeze || e.throwing ? 0 : (e.anim | 0) & 1], x - 5, y - 4, e.P, e.dir < 0); if (e.throwing) rectF(x + (e.dir > 0 ? 12 : -2), y + 8, 4, 3, e.P[2]); mark(e, x, y); } }; },
  // the charger: sees you, floors it
  f: (x, y, st) => { const [label, col] = flav(st).f; return { kind: 'charger', stunnable: 1, x, y: y - 2, w: 24, h: 18, dir: -1, stun: 0, freeze: 0, dash: 0, cool: 0, label, col: hex(col),
    upd(e, a) { if (holdStill(e)) return; if (e.cool > 0) e.cool--;
      const dx = PL.x - e.x, ahead = Math.sign(dx) === e.dir && Math.abs(dx) < 140 && Math.abs(PL.y + a.h - (e.y + e.h)) < 24;
      if (!e.dash && !e.cool && ahead && !legacyNow) { e.dash = 70; sfx('powerdown'); FX.push({ t: 30, x: e.x - 4, y: e.y - 14, s: 'VROOM' }); }
      if (e.dash) { e.dash--; if (!patrol(e, 3.4)) e.dash = 0; if (!e.dash) e.cool = 90; } else patrol(e, .6);
      if (touchPL(e, a) && !legacyNow) hurt('BEEP BEEP!'); },
    draw2(e, x, y) { rectF(x, y + 4, 24, 10, e.col); rectF(x + (e.dir > 0 ? 16 : 2), y - 2, 6, 6, hex('#303040')); circF(x + 5, y + 15, 3, BLACK); circF(x + 19, y + 15, 3, BLACK); text(e.label.slice(0, 4), x + 1, y + 6, WHITE, 0); if (e.dash && (frame >> 2) & 1) rectF(x + (e.dir > 0 ? -6 : 26), y + 8, 4, 2, hex('#f8f8a0')); mark(e, x, y); } }; },
  // the whistle: a hall monitor who makes the floor itself unsafe
  w: (x, y) => ({ kind: 'whistler', stunnable: 1, x, y: y - 24, w: 14, h: 40, dir: -1, stun: 0, freeze: 0, cool: 60 + rnd(60),
    upd(e, a) { if (holdStill(e)) return; e.dir = Math.sign(PL.x - e.x) || 1;
      if (!legacyNow && --e.cool <= 0 && Math.abs(PL.x - e.x) < 260) { e.cool = 130; sfx('ask'); FX.push({ t: 30, x: e.x - 8, y: e.y - 14, s: 'TWEET!' }); for (const d of [-1, 1]) proj(e.x + 4 + d * 10, e.y + e.h - 8, d * 2.2, 0, { icon: 'wave', g: 0, w: 12, h: 8, t: 180, say: 'TWEEEET!' }); }
      if (touchPL(e, a) && !legacyNow) hurt('HALL PASS?'); },
    draw2(e, x, y) { draw(ADULT.monitor[0], x - 5, y - 4, ADULTPAL.monitor, e.dir < 0); if (e.cool > 110) rectF(x + (e.dir > 0 ? 10 : 0), y + 6, 4, 2, hex('#f8f8f8')); mark(e, x, y); } }),
  // the dog: fast, sincere, only stops for a question or a good act
  d: (x, y) => ({ kind: 'dog', stunnable: 1, x, y: y + 4, w: 18, h: 12, dir: -1, stun: 0, freeze: 0,
    upd(e, a) { if (holdStill(e)) return; const dx = PL.x - e.x, near = Math.abs(dx) < 110 && Math.abs(PL.y + a.h - (e.y + e.h)) < 30 && !legacyNow;
      if (near) { e.dir = Math.sign(dx) || 1; patrol(e, 2.1); if (frame % 40 === 0) FX.push({ t: 25, x: e.x, y: e.y - 12, s: 'WOOF' }); } else patrol(e, .9);
      if (touchPL(e, a) && !legacyNow) hurt('WOOF!'); },
    draw2(e, x, y) { const c = hex('#a06830'), l = (frame >> 3) & 1; rectF(x + 2, y + 2, 14, 6, c); rectF(x + (e.dir > 0 ? 14 : -2), y - 2, 6, 6, c); rectF(x + (e.dir > 0 ? 18 : -3), y, 2, 2, BLACK); rectF(x + 3, y + 8, 2, 4 - l, c); rectF(x + 12, y + 8, 2, 3 + l, c); rectF(x + (e.dir > 0 ? 0 : 16), y + 1 + l, 3, 2, c); rectF(x + 6, y + 2, 6, 2, hex('#2838a0')); mark(e, x, y); } }),
  // the prototype: an early lavender assistant. it doesn't hurt you. it helps you. you can't move while it helps
  y: (x, y) => ({ kind: 'proto', stunnable: 1, x, y: y - 16, w: 14, h: 28, base: y - 16, dir: -1, stun: 0, freeze: 0, rest: 0,
    upd(e, a) { if (holdStill(e)) return; if (e.rest > 0) { e.rest--; return; }
      const dx = PL.x - e.x; if (Math.abs(dx) < 170 && !legacyNow) e.x += Math.sign(dx) * .5; e.y = e.base + Math.sin(frame * .04 + e.x * .02) * 6;
      if (touchPL(e, a) && PL.on && !legacyNow && !PL.helped) { PL.helped = 70; e.rest = 150; sfx('ok'); FX.push({ t: 60, x: e.x - 24, y: e.y - 14, s: 'MAY I HELP YOU?' }); } },
    draw2(e, x, y) { rectF(x + 2, y + 12, 11, 16, hex('#b692db')); rectF(x + 9, y + 12, 4, 16, hex('#926db6')); circF(x + 7, y + 7, 5, hex('#ffdbdb')); rectF(x + 1, y, 12, 5, hex('#926d49')); rectF(x + 1, y + 4, 2, 8, hex('#926d49')); rectF(x + 11, y + 4, 2, 8, hex('#926d49')); rectF(x + 4, y + 6, 2, 2, hex('#6d92b6')); rectF(x + 8, y + 6, 2, 2, hex('#6d92b6')); rectF(x, y + 8, 1, 4, hex('#6d6d6d')); if (e.rest) text('ZZ', x + 14, y - 4, hex('#dbb6ff'), 0); mark(e, x, y); } }),
  // a loose spark: bounces, can't be talked out of it (inspect calms it)
  z: (x, y) => ({ kind: 'spark', x: x + 4, y, w: 10, h: 10, vx: rnd(2) ? 1.3 : -1.3, vy: 0, stun: 0,
    upd(e, a) { if (busy) return; if (e.stun > 0) { e.stun--; return; } e.vy = Math.min(5, e.vy + .2); e.x += e.vx; if (boxHits(e.x, e.y, e.w, e.h, solidAt)) { e.x -= e.vx; e.vx *= -1; } e.y += e.vy; if (boxHits(e.x, e.y, e.w, e.h, (tx, ty) => solidAt(tx, ty) || tileAt(tx, ty) === '=')) { e.y -= e.vy; e.vy = -4.6; }
      if (PULSE && Math.hypot(e.x - PULSE.x, e.y - PULSE.y) < PULSE.r) e.stun = 120;
      if (!e.stun && !legacyNow && touchPL(e, a)) hurt('ZAP!'); },
    draw2(e, x, y) { const c = e.stun ? hex('#606060') : (frame >> 2) & 1 ? hex('#f8f818') : WHITE; circF(x + 5, y + 5, 5, c); if (!e.stun) for (let i = 0; i < 4; i++) pset(x + 5 + rnd(14) - 7, y + 5 + rnd(14) - 7, hex('#f8e040')); } }),
};

// ---------- BOSSES ----------
// An arena is 20 tiles (one screen) added to the end of the level. The exit door is removed; beating the boss is the exit.
function arenaize(L, st) {
  const w0 = L.w, floor = st.arenaFloor || 12;
  for (let y = 0; y < L.g.length; y++) { for (let x = 0; x < w0; x++) if (L.g[y][x] === 'D') L.g[y][x] = '.'; if (y < floor) L.g[y][w0 - 1] = '.'; for (let i = 0; i < 20; i++) L.g[y].push(y >= floor || i === 19 ? '#' : '.'); }
  L.w = w0 + 20; st.arenaX = w0; st.arenaAt = w0 + 2;
}
async function startBoss() {
  const B = BOSSES[STG.boss], st = STG; LV.bossStarted = 1;
  if (B.arena) { ARENA = { x0: st.arenaX * TS }; const floor = st.arenaFloor || 12; for (let y = 0; y < floor; y++) LV.g[y][st.arenaX] = '#'; sfx('door'); PL.cx = ARENA.x0 + 40; PL.cy = (floor - 1) * TS + 8; } // losing your hearts here restarts the fight, not the level
  CHASE = null; if (B.music !== null) music(B.music || 'boss');
  await B.intro();
  BOSS = Object.assign({ hp: B.hp, max: B.hp, t: 0, open: 0, hits: 0 }, B.init(st)); BOSS.def = B;
  banner(B.name, 90);
}
function bossUpdate(a) {
  const e = BOSS, B = e.def; if (busy || e.done) return;
  e.t++; if (e.open > 0) e.open--;
  B.upd(e, a);
  if (PL.act && B.onPerform && Math.abs(e.x - PL.x) < (B.performRange || 170)) B.onPerform(e);
  if (!e.harmless && e.w && touchPL(e, a)) hurt(B.ouch || 'HEY!');
  if (e.hp <= 0) { e.done = 1; run(bossDefeated); }
}
function bossHitbox(e) { return e.def.weak ? e.def.weak(e) : { x: e.x, y: e.y, w: e.w, h: e.h }; }
function bossShot(s) { // a question reaches the boss
  const e = BOSS; if (!e || e.done || !e.def.onAsk) return false;
  const b = bossHitbox(e); if (!(s.x > b.x - 4 && s.x < b.x + b.w && s.y > b.y - 6 && s.y < b.y + b.h)) return false;
  e.def.onAsk(e); return true;
}
function bossInspect() { const e = BOSS; if (e && !e.done && e.def.onInspect) e.def.onInspect(e); }
function bossHit(e, line) { e.hp--; e.hits++; e.open = 0; sfx('object'); post.flash = .25; FX.push({ t: 70, x: e.x - 10, y: e.y - 20, s: line }); }
function bossNo(e, line) { sfx('tick'); FX.push({ t: 40, x: e.x, y: e.y - 14, s: line || 'NOT NOW, KID.' }); }
async function bossDefeated() {
  const B = BOSS.def; ENTS = ENTS.filter(e => e.kind !== 'proj' && e.kind !== 'spark');
  sfx('get'); post.flash = .6; await wait(8); post.flash = 0;
  await B.outro();
  BOSS = null; PKM.bosses = PKM.bosses || {}; PKM.bosses[B.key] = 1; savePKM();
  await STG.exit();
}
function bossDraw() { const e = BOSS; e.def.draw(e, Math.round(e.x - camX), Math.round(e.y - camY)); }
function bossBar() {
  const e = BOSS, B = e.def, w = 150, x = (W - w) / 2, y = 26;
  rectA(x - 4, y - 2, w + 8, 20, BLACK, .6); text(B.name, x, y, UI.name, BLACK);
  if (B.bar) return B.bar(e, x, y + 10, w);
  frameRect(x, y + 10, w, 6, WHITE); rectF(x + 1, y + 11, Math.round((w - 2) * e.hp / e.max), 4, hex('#f878b8'));
}
const KD2 = 'PEE KID', WE2 = 'PEE-WEE KID', BY2 = 'PEE BOY';
const BOSSES = {
  // ---- 1-3: THE POWER LOADER. when it stomps, the cockpit pops open: ask the man inside something ----
  loader: { key: 'loader', name: 'THE POWER LOADER', hp: 4, arena: 1, ouch: 'CLANK!',
    async intro() {
      await say('(THE DOOR SLAMS BEHIND HIM. A TECHNICIAN, IN A POWER LOADER. IT IS VERY YELLOW AND VERY LOUD.)');
      await say('Okay, kid. Back in the tube. I\'ve got a loader and a supervisor.', 'TECHNICIAN');
      await say('Can you explain the part where I go back in?', KD2);
      await say('It\'s... it\'s procedure.', 'TECHNICIAN');
      await say('WHEN IT STOMPS, THE COCKPIT POPS OPEN. ASK HIM SOMETHING (A). JUMP THE SHOCKWAVES.');
    },
    init(st) { return { x: ARENA.x0 + 220, y: 12 * TS - 56, w: 44, h: 56, vy: 0, air: 0, cd: 120 }; },
    weak: e => ({ x: e.x + 6, y: e.y + 4, w: 32, h: 40 }),
    upd(e, a) {
      const FY = 12 * TS;
      if (e.air) { e.vy += .3; e.y += e.vy; if (e.y >= FY - e.h) { e.y = FY - e.h; e.air = 0; e.open = 120; sfx('land'); post.shake = 3; SHAKE_T = 10; for (const d of [-1, 1]) proj(e.x + 22 + d * 26, FY - 10, d * 2.4, 0, { icon: 'wave', g: 0, w: 12, h: 8, t: 200, hard: 1, say: 'WHUMP!' }); } return; }
      if (!e.open) { e.x += Math.sign(PL.x - e.x) * .55; e.x = clamp(e.x, ARENA.x0 + 20, ARENA.x0 + W - 70); }
      if (--e.cd <= 0) { e.cd = 210; e.air = 1; e.vy = -6.5; sfx('jump'); }
      if (!e.open && e.t % 95 === 40) { const dx = PL.x - e.x; proj(e.x + 20, e.y - 6, clamp(dx / 55, -3, 3), -4, { icon: 'battery', hard: 1, say: 'ZAP!' }); }
    },
    onAsk(e) { if (e.open) bossHit(e, ['I... it\'s my job?', 'Why AM I in a robot?', 'I don\'t actually know why.', '...Can I go home too?'][e.hits] || '...'); else bossNo(e, 'CAN\'T HEAR YOU!'); },
    draw(e, x, y) { const Y = hex('#f8c020'), D = hex('#806010'); rectF(x, y + 18, 44, 30, Y); rectF(x + 4, y + 48, 12, 8, D); rectF(x + 28, y + 48, 12, 8, D); rectF(x - 8, y + 22, 10, 6, D); rectF(x + 42, y + 22, 10, 6, D); rectF(x + 6, y, 32, 22, e.open ? hex('#80d0f8') : D); if (e.open) { draw(ADULT.tech[0], x + 10, y - 16, ADULTPAL.tech); rectF(x + 6, y - 4, 32, 4, D); } else { rectF(x + 10, y + 6, 24, 8, hex('#303040')); } text('LOAD', x + 10, y + 28, D, 0); if (e.open && (frame >> 3) & 1) text('OPEN!', x + 6, y - 28, hex('#f8f800')); },
    async outro() { await say('(THE LOADER POWERS DOWN. THE TECHNICIAN CLIMBS OUT AND SITS ON IT.)'); await say('You know what? I\'m on break.', 'TECHNICIAN'); await say('Can you explain the part where I get out?', KD2); await say('...There\'s a bus.', 'TECHNICIAN'); } },
  // ---- 2-2: THE TOUR BUS. when he leans out the window, ask him something ----
  tourbus: { key: 'tourbus', name: 'THE TOUR BUS', hp: 5, arena: 1, ouch: 'HONK!',
    async intro() {
      await say('(A TOUR BUS PULLS UP ALONGSIDE. THE MOVIE STAR\'S FACE IS PAINTED ON THE SIDE. HE IS ALSO DRIVING IT. AND LEANING OUT OF IT.)');
      await say('Kid! You\'re on my bus\'s bus! That\'s trespassing on a vehicle!', ST);
      await say('You have my laptop.', KD2);
      await say('I have a CONCEPT of your laptop.', ST);
      await say('WHEN HE LEANS OUT OF THE WINDOW, ASK HIM SOMETHING. DUCK HIS HEADSHOTS.');
    },
    init(st) { return { x: ARENA.x0 + 214, y: 10 * TS - 72, w: 104, h: 72, cd: 100 }; },
    weak: e => ({ x: e.x + 2, y: e.y + 6, w: 34, h: 52 }),
    upd(e, a) {
      e.y = 10 * TS - 72 + Math.round(Math.sin(e.t * .2)); if (--e.cd <= 0) { e.cd = 190; e.open = 100; sfx('ask'); }
      if (e.t % 70 === 30) { const dx = PL.x - e.x; proj(e.x + 10, e.y + 10, clamp(dx / 55, -3.4, -.6), -3.6, { icon: 'headshot', hard: 1, say: 'SIGNED!' }); }
      if (e.open && e.open % 33 === 10) proj(e.x, e.y + 30 + rnd(12), -3, 0, { icon: 'dvd', g: 0, hard: 1, say: 'DVD!' });
      if (e.t % 420 === 200 && ENTS.filter(x => x.kind === 'thrower').length < 2) { const t = MORE_FOES.g(e.x - 20, 9 * TS, STG); ENTS.push(t); FX.push({ t: 50, x: e.x - 40, y: e.y - 10, s: 'ENTOURAGE!' }); }
    },
    onAsk(e) { if (e.open) bossHit(e, ['Little man, I\'m WORKING.', 'That\'s not a question, that\'s an accusation.', 'Who taught you to ask questions? I\'ll sue them.', 'Okay, okay, I\'m listening— what was the question?', 'FINE.'][e.hits] || '...'); else bossNo(e, 'TINTED WINDOWS.'); },
    draw(e, x, y) { rectF(x, y, 104, 60, hex('#f8f0d0')); rectF(x, y + 40, 104, 6, hex('#c09030')); circF(x + 20, y + 64, 9, BLACK); circF(x + 84, y + 64, 9, BLACK); rectF(x + 44, y + 8, 56, 26, hex('#80b8f8')); text('ON TOUR', x + 50, y + 44, hex('#806020'), 0);
      rectF(x + 4, y + 8, 30, 30, e.open ? hex('#f0d0a0') : hex('#303040')); if (e.open) { const p = PORT[ST]; drawScaled(p.s, x + 6, y + 8, p.P, .55); if ((frame >> 3) & 1) text('!', x + 16, y - 6, hex('#f8f800')); } },
    async outro() { await say('FINE. FINE! Come up front. We\'ll talk. I\'ll talk. You\'ll listen.', ST); await say('(THE TOUR BUS DROPS BACK. THE MOVIE STAR WALKS TO THE FRONT OF THE REAL BUS, VERY DIGNIFIED, VERY SLOWLY.)'); } },
  // ---- 3-2: MISS NOSE'S BAG. perform (pee-wee) and she stops to watch; then ask her something (pee kid) ----
  bag: { key: 'bag', name: 'MISS NOSE\'S BAG', hp: 4, arena: 1, ouch: 'DETENTION!', performRange: 160,
    async intro() {
      await say('(THE BAG FROM THE CLASSROOM HOPS INTO THE GYM. SOMETHING IN IT IS VERY INTERESTED IN HIM.)');
      await say('RECESS IS OVER. INSTRUCTIONS ARE BEGINNING.', 'MISS NOSE');
      await say('I have an act! Everybody stops for the act!', WE2);
      await say('PERFORM (PEE-WEE, HOLD A) AND SHE STOPS TO WATCH. THEN SWAP TO PEE KID (C) AND ASK HER SOMETHING (A).');
    },
    init(st) { return { x: ARENA.x0 + 200, y: 12 * TS - 30, w: 30, h: 30, vx: 0, vy: 0, air: 0, cd: 80, watch: 0 }; },
    weak: e => ({ x: e.x - 4, y: e.y - 24, w: 38, h: 54 }),
    upd(e, a) {
      const FY = 12 * TS; if (e.watch > 0) { e.watch--; e.open = e.watch; return; }
      if (e.air) { e.vy += .3; e.x = clamp(e.x + e.vx, ARENA.x0 + 20, ARENA.x0 + W - 50); e.y += e.vy; if (e.y >= FY - e.h) { e.y = FY - e.h; e.air = 0; sfx('land'); } return; }
      if (--e.cd <= 0) { e.cd = 110; e.air = 1; e.vy = -6; e.vx = Math.sign(PL.x - e.x) * 1.8; }
      if (e.t % 60 === 20) { const W8 = pick(['SIT.', 'STAND.', 'BE THE FIRE.', 'HOLD IT.', 'NO RUNNING.']); proj(e.x + 6, e.y - 10, Math.sign(PL.x - e.x) * 2.4, 0, { icon: 'word', word: W8, g: 0, w: W8.length * 6, h: 9, hard: 1, say: 'DISRUPTIVE!' }); }
    },
    onPerform(e) { if (!e.watch) { e.watch = 150; e.air = 0; e.y = 12 * TS - e.h; sfx('crowd'); FX.push({ t: 50, x: e.x - 20, y: e.y - 30, s: 'SHE\'S WATCHING.' }); } },
    onAsk(e) { if (e.watch) { bossHit(e, ['THAT IS A QUESTION. QUESTIONS ARE DISRUPTIVE.', 'WHO TOLD YOU YOU COULD ASK?', 'I... DON\'T HAVE AN ANSWER FOR THAT.', 'RE-EVALUATING.'][e.hits] || '...'); e.watch = 0; } else bossNo(e, 'RAISE YOUR HAND FIRST.'); },
    draw(e, x, y) { const sq = e.air ? 0 : 2; rectF(x, y + sq, 30, 30 - sq, hex('#806040')); rectF(x + 2, y + 2 + sq, 26, 3, hex('#a07850')); rectF(x + 12, y - 4 + sq, 6, 6, hex('#604020'));
      if (e.watch || e.t % 60 < 30) { const hy = y - 20; circF(x + 15, hy + 8, 10, hex('#f8f0f0')); circF(x + 15, hy + 11, 3, hex('#f82020')); rectF(x + 9, hy + 4, 3, 3, BLACK); rectF(x + 18, hy + 4, 3, 3, BLACK); circF(x + 5, hy + 1, 4, hex('#f86828')); circF(x + 25, hy + 1, 4, hex('#f86828')); if (e.watch && (frame >> 3) & 1) text('!', x + 13, hy - 12, hex('#f8f800')); } },
    async outro() { SAVE.bagDone = 1; await say('THAT WAS... A GOOD ACT. NOTED.', 'MISS NOSE'); await say('NOW. CLASS IS IN SESSION.', 'MISS NOSE'); } },
  // ---- 4-2: THE FIGURE. a chase across the rooftops. he always gets away. inspect him for evidence while you can ----
  figure: { key: 'figure', name: 'THE FIGURE', hp: 1, arena: 0, music: null, harmless: 1,
    async intro() { await say('(ON THE NEXT ROOF: A FIGURE. IT SEES HIM. IT RUNS.)'); await say('That\'s him. That\'s... someone. Stay on him.', BY2); await say('KEEP UP. INSPECT HIM (A) WHEN YOU\'RE CLOSE: EVERY CLUE COUNTS. HE ALWAYS GETS AWAY. THAT\'S NOT THE POINT.'); },
    init(st) { return { x: PL.x + 140, y: 0, w: 0, h: 0, harmless: 1, ev: SAVE.evidence || 0, evCool: 0, goneAt: 118 * TS }; },
    upd(e, a) {
      const lead = e.x - PL.x, sp = lead < 100 ? 2.7 : lead > 190 ? 0 : 1.9; // close enough to see, never close enough to catch e.x += sp; if (e.evCool > 0) e.evCool--;
      let gy = LH * TS; for (let ty = 0; ty < LH; ty++) if (solidAt(Math.floor((e.x + 6) / TS), ty)) { gy = ty * TS; break; } e.y += ((gy - 40) - e.y) * .2;
      if (sp === 0 && frame % 90 === 0) FX.push({ t: 40, x: e.x - 4, y: e.y - 12, s: '...' });
      if (e.x >= e.goneAt) { e.hp = 0; }
    },
    onInspect(e) { if (Math.abs(e.x - PL.x) < 150 && e.evCool <= 0 && e.ev < 3) { e.ev++; SAVE.evidence = e.ev; e.evCool = 120; sfx('ok'); FX.push({ t: 70, x: e.x - 30, y: e.y - 16, s: ['A FOOTPRINT. SIZE NINE.', 'A RECEIPT: STAIRS, NOT THE LIFT.', 'HE LEFT THE WINDOW OPEN ON PURPOSE.'][e.ev - 1] }); } },
    bar(e, x, y, w) { const k = clamp((PL.x / TS - 6) / 112, 0, 1); frameRect(x, y, w, 6, WHITE); rectF(x + 1, y + 1, Math.round((w - 2) * k), 4, hex('#38f0f8')); text('EVIDENCE ' + e.ev + '/3', x + w - 66, y - 10, UI.dim, 0); },
    draw(e, x, y) { const c = legacyNow ? hex('#306230') : BLACK; rectF(x, y, 6, 16, c); rectF(x + 1, y - 6, 4, 6, c); const l = (frame >> 2) & 1; rectF(x - 2 + l, y + 2, 2, 9, c); rectF(x + 6 - l, y + 2, 2, 9, c); rectF(x + l, y + 16, 2, 8, c); rectF(x + 4 - l, y + 16, 2, 8, c); if ((frame >> 5) % 4 === 0) { pset(x + 2, y - 4, WHITE); pset(x + 4, y - 4, WHITE); } },
    async outro() { banner('...GONE.', 90); SAVE.sawFigure = 1; await say('(HE STEPS OFF THE LAST ROOF. THERE\'S NO SOUND. THERE\'S NOBODY BELOW.)'); await say((SAVE.evidence || 0) >= 3 ? 'Three clues. That\'s not nothing. That\'s a case.' : 'Gone. Again. The case stays open.', BY2); } },
  // ---- 5-2: THE THIRD GENERATOR. all three of him, in order: ask it, perform for it, inspect it ----
  gen: { key: 'gen', name: 'THE THIRD GENERATOR', hp: 6, arena: 1, ouch: 'ZZZT!', performRange: 200,
    async intro() {
      await say('(THE HEART OF THE THIRD GENERATOR. IT HAS STOPPED ASKING NICELY. IT HAS STARTED ASKING LOUDLY.)');
      await say('It wants all three of us.', KD2); await say('Then it gets all three of us! One at a time!', WE2); await say('In order. Like a procedure.', BY2);
      await say('FIRST: PEE KID ASKS THE EYE WHEN IT OPENS. THEN: PEE-WEE PERFORMS UNTIL IT CALMS DOWN. LAST: PEE BOY INSPECTS ITS PANELS, ONE BY ONE.');
    },
    init(st) { return { x: ARENA.x0 + 214, y: 12 * TS - 128, w: 80, h: 128, phase: 1, calm: 0, panel: 0, cd: 100 }; },
    weak: e => ({ x: e.x + 6, y: e.y + 36, w: 50, h: 76 }),
    upd(e, a) {
      if (e.t % (e.phase === 2 && PL.act ? 9999 : 120) === 50 && ENTS.filter(x => x.kind === 'spark').length < 3) { const s = MORE_FOES.z(e.x - 10, e.y + 40, STG); s.vx = -1.6; ENTS.push(s); }
      if (e.t % 160 === 90 && !(e.phase === 2 && PL.act)) proj(e.x - 4, 12 * TS - 10, -2.3, 0, { icon: 'wave', g: 0, w: 12, h: 8, t: 220, hard: 1, say: 'SURGE!' });
      if (e.phase === 1 && --e.cd <= 0) { e.cd = 170; e.open = 100; sfx('stun'); }
      if (e.phase === 2 && PL.act && Math.abs(e.x - PL.x) < 200) { e.calm++; if (e.calm % 30 === 0) FX.push({ t: 40, x: e.x - 20, y: e.y + 10, s: 'IT\'S WATCHING.' }); if (e.calm >= 180) { e.phase = 3; e.hp = 3; sfx('get'); FX.push({ t: 80, x: e.x - 40, y: e.y, s: 'CALM. PANELS EXPOSED.' }); } }
    },
    onAsk(e) { if (e.phase !== 1) return bossNo(e, e.phase === 2 ? 'IT WANTS A SHOW.' : 'IT WANTS TO BE LOOKED AT. CLOSELY.'); if (e.open) { bossHit(e, ['WHY DO YOU NEED HIM?', 'WHAT HAPPENS IF HE LEAVES?'][e.hits] || '...'); if (e.hits >= 2) { e.phase = 2; e.hp = 4; FX.push({ t: 80, x: e.x - 50, y: e.y, s: 'IT\'S SCREAMING. GIVE IT A SHOW.' }); } } else bossNo(e, 'THE EYE IS CLOSED.'); },
    onInspect(e) { if (e.phase !== 3) return; if (Math.abs(e.x - PL.x) > 190) return; e.panel++; e.hp = 3 - e.panel; sfx('object'); FX.push({ t: 60, x: e.x - 20, y: e.y + 20 + e.panel * 20, s: 'PANEL ' + e.panel + ' UNBOLTED.' }); },
    draw(e, x, y) { const pulse = (frame >> 3) & 1; rectF(x, y, 80, 128, hex('#482020')); frameRect(x, y, 80, 128, hex('#f84818')); for (let i = 0; i < 6; i++) rectF(x + 8, y + 10 + i * 18, 64, 4, pulse && e.phase !== 2 ? hex('#f8f818') : hex('#904040'));
      circF(x + 32, y + 64, 18, hex('#100808')); if (e.phase === 1 && e.open) { circF(x + 32, y + 64, 14, WHITE); circF(x + 32, y + 64, 6, hex('#f84818')); } else rectF(x + 16, y + 63, 32, 2, hex('#f84818'));
      if (e.phase === 3) for (let k = 0; k < 3; k++) { const px = x + 54, py = y + 20 + k * 34; rectF(px, py, 20, 24, k < e.panel ? hex('#100808') : hex('#c06030')); if (k >= e.panel) { pset(px + 2, py + 2, WHITE); pset(px + 17, py + 2, WHITE); pset(px + 2, py + 21, WHITE); pset(px + 17, py + 21, WHITE); } }
      if (e.phase === 2) { rectF(x - 40, y - 12, 160, 6, BLACK); rectF(x - 39, y - 11, Math.round(158 * e.calm / 180), 4, hex('#f878b8')); text('CALM', x - 40, y - 22, WHITE, 0); }
      text('THIRD', x + 20, y + 112, hex('#f8c8a8'), 0); },
    async outro() { await say('(THE GENERATOR GOES QUIET. IT ONLY EVER RAN ON WHAT HE COULD DO. FOR A MOMENT IT HAS NOTHING TO DO.)'); } },
};
// the figure has no arena: it starts when he reaches the second roof
BOSSES.figure.startAt = 6;

// ---------- attach bosses and the new exits to the stages ----------
Object.assign(STAGES[11], { boss: 'loader', exit: () => stageClear() });
Object.assign(STAGES[21], { boss: 'tourbus', arenaFloor: 10 });
Object.assign(STAGES[31], { boss: 'bag' });
Object.assign(STAGES[41], { boss: 'figure', arenaAt: 6, draw: undefined });
Object.assign(STAGES[51], { boss: 'gen' });

// ---------- climbing sections: one screen wide, many screens tall ----------
STAGES[12] = { id: 12, title: 'THE SHAFT', theme: 'lab', music: 'chase', rise: .42, riseCol: ['#30d8f8', '#103870'], riseLines: ['THE COOLANT GOT HIM. HE\'S FINE. HE\'S DAMP.', 'BACK DOWN THE SHAFT. COLD, AND A LITTLE BLUE.'],
  build() {
    const L = LB(20, 60); L.col(0, 0, 59); L.col(19, 0, 59); L.fill(1, 18, 58, 59, '#'); L.put(3, 57, '@');
    for (let k = 0; k < 24; k++) { const y = 56 - k * 2, s = [3, 8, 12, 8][k % 4]; L.plat(s, s + 5, y); } // each platform overlaps the next: up, not across
    L.fill(1, 6, 32, 32, '#'); L.fill(2, 2, 30, 31, 'T'); L.put(5, 31, 'J');
    L.put(15, 44, 'r'); L.put(4, 24, 'r'); L.put(14, 14, 'r'); L.put(12, 39, 'H'); L.put(8, 20, 'J');
    L.plat(8, 11, 9); L.fill(1, 18, 7, 7, '#'); for (const x of [9, 10]) L.put(x, 7, '='); L.fill(15, 15, 5, 6, 'D'); L.put(4, 6, 'g');
    return L;
  },
  npcs: [], intro: () => stage12Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() };
STAGES[32] = { id: 32, title: 'THE STAIRWELL', theme: 'school', music: 'school',
  build() { // floors every 12 rows; between them, switchback half-landings every two rows
    const L = LB(20, 50); L.col(0, 0, 49); L.col(19, 0, 49); L.fill(1, 18, 46, 49, '#'); L.put(3, 45, '@');
    const land = [46, 34, 22, 10];
    for (let i = 0; i < 3; i++) { const R = land[i], rt = i % 2 === 0, up = land[i + 1];
      for (let k = 1; k <= 5; k++) { const lft = (k % 2 === 1) === rt; L.plat(lft ? 2 : 10, lft ? 9 : 17, R - k * 2); } // switchback half-landings
      const top5 = (5 % 2 === 1) === rt; L.fill(1, 18, up, up, '#'); L.fill(top5 ? 2 : 10, top5 ? 9 : 17, up, up, '='); }
    L.fill(5, 5, 32, 33, 'T'); L.put(10, 45, 'w'); L.put(12, 33, 'w'); L.put(8, 21, 'g'); L.put(12, 21, 'f'); L.put(8, 9, 'w');
    L.put(16, 45, 'J'); L.put(2, 33, 'H'); L.put(10, 21, 'J'); L.fill(16, 16, 8, 9, 'D');
    return L;
  },
  npcs: [], intro: () => stage32Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() };
STAGES[52] = { id: 52, title: 'THE TOWER', theme: 'core', music: 'chase', rise: .3, riseCol: ['#f8f818', '#f84818'], riseLines: ['THE GENERATOR PULLED HIM BACK DOWN. IT WANTS HIM AT THE BOTTOM.', 'NOT YET. NOT YET.'],
  build() {
    const L = LB(20, 64); L.col(0, 0, 63); L.col(19, 0, 63); L.fill(1, 18, 62, 63, '#'); L.put(3, 61, '@');
    // A: zigzag, then a ceiling only the kid fits through (the vent)
    for (let k = 0; k < 6; k++) { const y = 59 - k * 2, s = [3, 10, 5, 12, 4, 11][k]; L.plat(s, s + 5, y); }
    L.fill(1, 18, 47, 47, '#'); L.fill(9, 10, 47, 47, 'V'); L.fill(7, 12, 49, 49, '=');
    // B: platforms four rows apart: only pee-wee jumps that high
    for (let k = 0; k < 3; k++) L.plat(6, 11, 43 - k * 4); // straight up, four rows at a time
    L.fill(1, 18, 31, 31, '#'); L.fill(7, 9, 31, 31, '.'); L.put(8, 30, 'y'); L.put(16, 30, 'J'); L.fill(3, 3, 29, 30, 'T'); // halfway: a bathroom (checkpoint)
    // C: steps nobody can see: pee boy inspects them into being
    for (let k = 0; k < 6; k++) L.put([4, 7, 10, 13, 10, 7][k], 28 - k * 2, '?');
    L.fill(1, 18, 15, 15, '#'); L.fill(6, 8, 15, 15, '.'); L.put(12, 14, 'y'); L.put(4, 14, 'H');
    // D: the top
    for (let k = 0; k < 4; k++) { const y = 12 - k * 2, s = [10, 3, 11, 5][k]; L.plat(s, s + 4, y); }
    L.fill(1, 18, 4, 4, '#'); L.fill(6, 7, 4, 4, '='); L.fill(3, 3, 2, 3, 'D');
    return L;
  },
  npcs: [], intro: () => stage52Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() };
ORDER.splice(0, ORDER.length, 1, 12, 11, 2, 21, 3, 32, 31, 4, 41, 5, 52, 51);
// the section number within its stage: 1-1, 1-2, 1-3...
secName = id => id === 99 ? '?-?' : world(id) + '-' + (ORDER.filter(n => world(n) === world(id)).indexOf(id) + 1);

// ---------- new enemies, placed into the existing sections ----------
const addTo = (id, list) => { const b = STAGES[id].build; STAGES[id].build = () => { const L = b(); for (const [x, y, c] of list) L.put(x, y, c); return L; }; };
addTo(1, [[64, 11, 'g'], [93, 11, 'f']]);
addTo(11, [[40, 11, 'g'], [88, 11, 'f']]);
addTo(2, [[36, 11, 'g'], [74, 11, 'g']]);
addTo(21, [[25, 9, 'g'], [70, 9, 'f']]);
addTo(3, [[26, 11, 'w'], [60, 11, 'g'], [95, 11, 'f']]);
addTo(31, [[46, 11, 'w'], [84, 11, 'g']]);
addTo(4, [[28, 10, 'd'], [72, 11, 'g'], [90, 11, 'f'], [116, 11, 'd']]);
addTo(41, [[36, 8, 'd'], [84, 9, 'g'], [110, 9, 'd']]);
addTo(5, [[24, 11, 'y'], [70, 11, 'z'], [98, 11, 'y'], [112, 11, 'g']]);
addTo(51, [[58, 11, 'y'], [128, 11, 'y']]);

// ---------- intros for the new sections ----------
async function stage12Intro() {
  await wait(20); sfx('powerdown'); post.shake = 2; SHAKE_T = 20;
  await say('(A MAINTENANCE SHAFT. STRAIGHT UP. SOMEWHERE BELOW, THE COOLANT IS RISING. NOBODY TURNED IT ON. IT TURNED ITSELF ON.)');
  await say('Up. Okay. I can do up. Up is just sideways, but up.', KD2);
  await say('THE COOLANT RISES SLOWER IN LEGACY MODE. THERE\'S A BATHROOM HALFWAY UP.');
}
async function stage32Intro() {
  await wait(20);
  await say('(THE STAIRWELL. FOUR FLOORS. EVERY LANDING HAS A HALL MONITOR. EVERY HALL MONITOR HAS A WHISTLE.)');
  await say('Stairs are a performance! Every step is an entrance!', WE2);
  await say('JUMP THE WHISTLE WAVES. PEE-WEE JUMPS HIGHER, AND A PERFORMANCE STOPS A WHISTLE MID-TWEET.');
}
async function stage52Intro() {
  await wait(20); sfx('glitch'); post.wave = 2; await wait(30); post.wave = 0;
  await say('(THE GENERATOR\'S TOWER. THE LIGHT AT THE BOTTOM IS COMING UP AFTER HIM.)');
  await say('There\'s a vent. That\'s mine.', KD2); await say('There\'s ledges! Those are mine!', WE2); await say('There\'s nothing there. That\'s mine.', BY2);
  await say('SOME OF THEM LOOK LIKE... HER. THE NICE ONE. THEY JUST WANT TO HELP. THEY HELP BY HOLDING YOU STILL.');
}

// ---------- foreshadowing: the next two cartridges, before anyone knew ----------
STAGES[1].npcs.push({ x: 34, y: 11, talk: async () => {
  await say('IMPROVEMENT LOG. ENTRY 1: THE GENERATOR RUNS. THE KID ASKS TO LEAVE. WE ARE CALLING THAT "POTENTIAL."');
  await say('ENTRY 2: GHOST WANTS CREDIT. HE WILL GET CREDIT. HE WILL NOT GET A SAY.');
  await say('ENTRY 3: NEXT GENERATION. FIND A BETTER-FITTING ASSISTANT. THE CURRENT ONE ASKS QUESTIONS.');
  await say('...I ask questions.', KD2);
  await say('ENTRY 4 IS A PHOTO OF A FACE. NOT THAT FACE. THIS ONE HAS COLOR. IT\'S SMILING AT SOMETHING OFF CAMERA.');
}, draw: (x, y) => { rectF(x - 2, y + 6, 20, 26, hex('#303848')); rectF(x, y + 8, 16, 12, (frame >> 4) & 1 ? hex('#30d8f8') : hex('#1878a0')); text('LOG', x + 1, y + 10, hex('#081018'), 0); nameTag(x, y + 4, 'TERMINAL'); } });
// a lavender figure on a billboard, far away, for a moment. in legacy mode there's nobody there
STAGES[21].draw = () => { if (legacyNow || ARENA) return; const t = frame % 900; if (t > 120) return; const x = Math.round(300 - camX * .2 % 400), y = 60; rectF(x - 20, y - 26, 44, 34, hex('#e8e0d0')); rectF(x, y - 20, 6, 14, hex('#b692db')); circF(x + 3, y - 23, 3, hex('#ffdbdb')); rectF(x, y - 27, 7, 3, hex('#926d49')); if (t > 100) text('MAY I HELP', x - 18, y - 4, hex('#926db6'), 0); };
// THE FIGURE's evidence makes it into the statement
const witness0 = witness;
witness = async () => { if ((SAVE.evidence || 0) >= 3) { await say('Before we start. Size nine. Took the stairs, not the lift. Left the window open on purpose.', BY2); await say('He wanted us to know he\'d been here.', 'CHIEF KUMA'); } await witness0(); };
// Miss Nose's set piece doesn't need to introduce the bag twice
const missNose0 = missNose;
missNose = async () => { if (SAVE.bagDone) { const s0 = say; say = async (t, w, o) => t.startsWith('(A BAG ON THE FLOOR') ? undefined : s0(t, w, o); try { await missNose0(); } finally { say = s0; } } else await missNose0(); };

// ---------- POST-GAME: time attack, and HOLD IT ----------
const fmtT = f => { const s = f / 60; return Math.floor(s / 60) + ':' + (s % 60).toFixed(1).padStart(4, '0'); };
function taHud() { if (!busy && scene === platScene) SAVE.taT = (SAVE.taT || 0) + 1; rectA(W - 70, 24, 68, 12, BLACK, .6); text(fmtT(SAVE.taT || 0), W - 66, 26, hex('#f8e040'), 0); }
for (const id of Object.keys(STAGES)) { const st = STAGES[id], ex = st.exit; st.exit = () => SAVE.ta ? taFinish() : ex(); }
async function taFinish() {
  PKM.ta = PKM.ta || {}; const id = STG.id, t = SAVE.taT || 0, best = PKM.ta[id], newBest = !best || t < best; if (newBest) { PKM.ta[id] = t; savePKM(); }
  sfx('get'); await fadeOut();
  await showCard(['TIME ATTACK: ' + secName(id), STG.title, '', 'TIME ..... ' + fmtT(t), 'BEST ..... ' + fmtT(PKM.ta[id]), newBest ? 'NEW BEST!' : ''], 0, { bg: hex('#081030'), fg: UI.name });
  post.legacy = 0; LEGACY_AUDIO = false; run(timeAttackMenu);
}
async function timeAttackMenu() {
  PKM.ta = PKM.ta || {};
  scene = { draw() { sky(0, H, hex('#081030'), hex('#401040')); ctext('TIME ATTACK', 6, UI.name, BLACK, 2); ctext('THE CLOCK ONLY RUNS WHILE HE DOES.', 24, UI.dim); } }; music('title'); post.fade = 0;
  const i = await choose(ORDER.map(n => secName(n) + ' ' + STAGES[n].title.slice(0, 18) + (PKM.ta[n] ? '  ' + fmtT(PKM.ta[n]) : '')).concat(['BACK']), { x: 30, y: 36 });
  if (i >= ORDER.length) return titleScreen();
  const n = ORDER[i]; resetSave(); SAVE.ta = 1; SAVE.taT = 0; for (const k of ORDER) SAVE['intro' + k] = 1; SAVE.hallpass = 1;
  PL.unlocked = ['kid', 'wee', 'boy'].slice(0, Math.max(1, Math.min(3, world(n) - 1))); PL.asp = 'kid';
  await startStage(n);
}
function resetSave() { for (const k in SAVE) delete SAVE[k]; SAVE.photos = []; SAVE.stage = 1; PL.unlocked = ['kid']; PL.asp = 'kid'; }
