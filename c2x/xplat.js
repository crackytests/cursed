'use strict';
// ================= CARL 2 EXTREME: the platformer =================
// B jump (hold for higher). A throws the bong (it comes back). UP+A: the bong is a hookshot. Hold C: the lighter.
// In water the bong is a snorkel: keep it in your hand and you keep breathing.
const TS = 16;
let RULES = {}; // the bonus carts' house rules (blocks, speed, ball, rings, spindash, tales, knux): see xbonus.js
let CUT = 0, LV = null, ENTS = [], SHOTS = [], FX = [], BONG = null, BOSS = null, ARENA = null;
const PL = { x: 0, y: 0, w: 10, h: 20, vx: 0, vy: 0, on: false, face: 1, hp: 3, hurt: 0, anim: 0, coyote: 0, jbuf: 0, hang: null, rope: null, ropeD: 0, ropeCD: 0,
  fuel: 100, hot: 0, flaming: 0, air: 100, choke: 0, throwT: 0, scr: 0, cx: 0, cy: 0, dead: 0 };
const RUN = { nerf: {}, lives: 5, bux: 0, words: 0, outfit: 'classic', lv: 0, deaths: 0, got: {} };
const LIMIT = { maxHP: 3, run: 2.1, jump: 5.7, grav: .32 };

// ---------------- one-liners ----------------
// every line on screen gets counted. The game is very proud of how few there are.
const QUIPS = {
  start: ['LINDA? FINE. FINE!', 'I\'M ON IT. LEGALLY.', 'SAVING HER. NOT FOR HER.'],
  hurt: ['RUDE.', 'I\'M FINE.', 'OW. LEGALLY.', 'THAT\'S ASSAULT.', 'NOT THE HEAD.'],
  kill: ['SIT DOWN.', 'BONGED.', 'RETURN TO SENDER.', 'NEXT.', 'YOU\'RE WELCOME.'],
  burn: ['TL;DR.', 'SKIMMED IT.', 'TOO LONG.', 'SPOILERS.', 'NOT READING THAT.'],
  hook: ['C\'MERE.', 'YOINK.', 'HOOKSHOT. NORMAL.'],
  rope: ['WHEEE. NORMALLY.', 'HUMANS SWING.', 'NOT SCARED.'],
  water: ['BONG SNORKEL.', 'PATENT PENDING.', 'BREATHE. BUBBLE.'],
  wet: ['IT\'S WET.', 'NO FIRE. WET.', 'DUMB OCEAN.'],
  air: ['NEED BUBBLES.', 'AIR. AIR!', 'BONG\'S DRY.'],
  nobong: ['GIVE IT BACK!', 'MY SNORKEL!'],
  hot: ['HOT HOT HOT.', 'THUMB. BURNED.'],
  lit: ['LIT.', 'SAVED. PROBABLY.', 'CHECKPOINT. COOL.'],
  oneup: ['1UP. WHATEVER.', 'EXTRA ME.'],
  box: ['FASHION!', 'OUTFIT GET.', 'DRIP.'],
  fall: ['I MEANT THAT.', 'PIT. COOL.', 'GRAVITY. RUDE.'],
  heal: ['PRETZEL.', 'SALTY. GOOD.'],
};
let BUBBLES = [];
// a speech bubble over someone: {x,y} getter so it follows them
function quip(s, who = PL, t = 90) {
  s = String(s).toUpperCase(); BUBBLES = BUBBLES.filter(b => b.who !== who); BUBBLES.push({ s, who, t });
  RUN.words += s.split(/\s+/).filter(Boolean).length; sfx('blip', [980, 180]);
}
let quipCD = 0;
function carlSays(k, force) { if (quipCD > 0 && !force) return; quipCD = 150; quip(pick(QUIPS[k])); }

// ---------------- level ----------------
function LB(w, h = 14) {
  const g = Array.from({ length: h }, () => Array(w).fill('.'));
  const b = {
    w, h, g,
    put(x, y, ch) { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = ch; return b; },
    fill(x0, x1, y0, y1, ch) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) b.put(x, y, ch); return b; },
    ground(x0, x1, top = 12) { return b.fill(x0, x1, top, h - 1, '#'); },
    plat(x0, x1, y) { return b.fill(x0, x1, y, y, '='); },
    col(x, y0, y1, ch = '#') { return b.fill(x, x, y0, y1, ch); },
    row(x, y, s) { for (let i = 0; i < s.length; i++) if (s[i] !== ' ') b.put(x + i, y, s[i]); return b; },
    rope(x, y, len) { b.put(x, y, 'R'); for (let i = 1; i <= len; i++) b.put(x, y + i, '|'); return b; },
  };
  return b;
}
const FOE_CHARS = 'gkeytfjnqhzxc';
const SOLID = '#W^?ubPs}{ZB'; // ? block, used block, brick, pipe, spring, dash pads, cracked rock, bridge
function loadLevel(def) {
  const L = def.build();
  LV = { def, w: L.w, h: L.h, g: L.g.map(r => r.slice()), theme: XTHEMES[def.theme], water: def.water === undefined ? 1e9 : def.water, burn: {}, lock: null, sprung: {}, hist: [] };
  RULES = def.rules || {};
  TILES = themeTiles(LV.theme);
  ENTS = []; SHOTS = []; FX = []; BONG = null; BOSS = null; ARENA = null; BUBBLES = [];
  for (let y = 0; y < LV.h; y++) for (let x = 0; x < LV.w; x++) {
    const c = LV.g[y][x], wx = x * TS, wy = y * TS;
    if (c === '@') { PL.cx = wx + 3; PL.cy = wy + TS - PL.h; }
    else if (c === '$') ENTS.push({ kind: 'bux', x: wx + 3, y: wy + 3, w: 10, h: 10 });
    else if (c === '+') ENTS.push({ kind: 'pretzel', x: wx + 1, y: wy + 2, w: 14, h: 12 });
    else if (c === 'X') { if (!RUN.got[def.outfit]) ENTS.push({ kind: 'box', x: wx, y: wy, w: 16, h: 16 }); }
    else if (c === 'C') ENTS.push({ kind: 'post', x: wx, y: wy - 16, w: 16, h: 32, lit: 0 });
    else if (c === 'E') ENTS.push(def.goal === 'flag' || def.goal === 'tape' || def.goal === 'sign' ? { kind: 'goal', style: def.goal, x: wx + 4, y: wy - 8 * TS, w: 8, h: 9 * TS, warp: y < 4 } : { kind: 'goal', x: wx - 8, y: wy - 24, w: 32, h: 40, warp: y < 4 });
    else if (BONUS_ENTS[c]) ENTS.push(BONUS_ENTS[c](wx, wy, x, y, def));
    else if (c === 'o') ENTS.push({ kind: 'ring', x: wx + 8, y: wy + 8 });
    else if (c === 'v') ENTS.push({ kind: 'vent', x: wx + 8, y: wy + 16, t: 0 });
    else if (c === 'R') { let n = 0; while (y + n + 1 < LV.h && LV.g[y + n + 1][x] === '|') { LV.g[y + n + 1][x] = '.'; n++; } ENTS.push({ kind: 'rope', ax: wx + 8, ay: wy, len: n * TS + 8, th: x & 1 ? .75 : -.75, w: 0 }); }
    else if (FOE_CHARS.includes(c)) ENTS.push(makeFoe(c, wx, wy));
    else continue;
    LV.g[y][x] = '.';
  }
  for (const [x, y, s] of def.signs || []) ENTS.push({ kind: 'sign', x: x * TS - 6, y: y * TS - 24, s });
  if (def.cage) ENTS.push({ kind: 'cage', x: def.cage[0] * TS, y: def.cage[1] * TS });
  PL.x = PL.cx; PL.y = PL.cy; respawnState();
}
let TILES = null;
const inMap = (tx, ty) => tx >= 0 && ty >= 0 && tx < LV.w && ty < LV.h;
const tileAt = (tx, ty) => tx < 0 || tx >= LV.w ? '#' : ty < 0 || ty >= LV.h ? '.' : LV.g[ty][tx];
const solidAt = (tx, ty) => SOLID.includes(tileAt(tx, ty));
const waterAt = py => py >= LV.water * TS;
function boxHit(x, y, w, h, fn) { for (let ty = Math.floor(y / TS); ty <= Math.floor((y + h - 1) / TS); ty++) for (let tx = Math.floor(x / TS); tx <= Math.floor((x + w - 1) / TS); tx++) if (fn(tx, ty)) return { tx, ty }; return null; }
const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// ---------------- player physics ----------------
function respawnState() {
  Object.assign(PL, { vx: 0, vy: 0, hp: LIMIT.maxHP, hurt: 60, hang: null, rope: null, fuel: 100, hot: 0, air: 100, choke: 0, scr: 0, dead: 0,
    ball: 0, roll: 0, rev: 0, crouch: 0, loop: null, loopCD: 0, dino: 0, tongue: 0, shield: null, star: 0, glide: 0, climb: 0, sprung: 0 });
  BONG = null; camX = clamp(PL.x - 140, 0, LV.w * TS - W); camY = clamp(PL.y - 120, 0, LV.h * TS - H);
}
function moveX(dx) {
  PL.x += dx; let h = boxHit(PL.x, PL.y, PL.w, PL.h, solidAt);
  if (h && tileAt(h.tx, h.ty) === 'Z' && (PL.roll || Math.abs(dx) > 4.2)) { boxHit(PL.x - 2, PL.y, PL.w + 4, PL.h, (tx, ty) => { if (tileAt(tx, ty) === 'Z') smash(tx, ty); }); h = boxHit(PL.x, PL.y, PL.w, PL.h, solidAt); }
  if (h) { PL.x = dx > 0 ? h.tx * TS - PL.w : (h.tx + 1) * TS; PL.vx = 0; if (PL.glide) { PL.glide = 0; PL.climb = Math.sign(dx); PL.face = PL.climb; PL.vy = 0; PL.ball = 0; sfx('land'); } }
}
function moveY(dy) {
  const prevB = PL.y + PL.h; PL.y += dy; PL.on = false;
  const h = boxHit(PL.x, PL.y, PL.w, PL.h, solidAt);
  if (h) {
    if (dy > 0) { PL.y = h.ty * TS - PL.h; PL.on = true; const t = tileAt(h.tx, h.ty); if (t === '^') ouch(1, 'spike'); if (t === 's') return spring(h.tx, h.ty); }
    else { PL.y = (h.ty + 1) * TS; boxHit(PL.x + 1, PL.y - 2, PL.w - 2, 2, (tx, ty) => { bump(tx, ty); }); }
    PL.vy = 0; return;
  }
  if (dy >= 0) { // one-way platforms + resting contact
    const feet = PL.y + PL.h, ty = Math.floor((feet - .01) / TS), tyB = Math.floor(feet / TS);
    for (let tx = Math.floor(PL.x / TS); tx <= Math.floor((PL.x + PL.w - 1) / TS); tx++) {
      if (tileAt(tx, ty) === '=' && prevB <= ty * TS + 1) { PL.y = ty * TS - PL.h; PL.vy = 0; PL.on = true; return; }
      if (feet - tyB * TS < 1 && (solidAt(tx, tyB) || tileAt(tx, tyB) === '=')) { PL.y = tyB * TS - PL.h; PL.vy = 0; PL.on = true; return; }
    }
  }
}
function ouch(n = 1, why, src) { // src: x of whatever hit him; he's knocked away from it
  if (PL.hurt > 0 || PL.dead || PL.star > 0) return;
  if (PL.shield || PL.dino || (RULES.rings && RUN.bux > 0)) { // the bonus carts: something else takes the hit
    if (PL.shield) PL.shield = null; else if (PL.dino) dinoLost(); else scatterBux();
    PL.hurt = 90; PL.vy = -3.6; PL.vx = (src === undefined ? -PL.face : Math.sign(PL.x + PL.w / 2 - src) || -PL.face) * 2.2; PL.climb = PL.glide = PL.roll = PL.ball = 0;
    sfx('hurt'); post.shake = 2; SHAKE = 8; return;
  }
  if (RULES.rings) n = PL.hp; // no bux, no mercy. That's the rule. We didn't make it
  PL.hp -= n; PL.hurt = 90; PL.vy = -3.6; PL.vx = (src === undefined ? -PL.face : Math.sign(PL.x + PL.w / 2 - src) || -PL.face) * 2.2; PL.hang = null; PL.rope = null;
  sfx('hurt'); post.shake = 3; SHAKE = 10;
  if (PL.hp <= 0) return die(why);
  carlSays('hurt');
}
let SHAKE = 0;
function die(why) {
  if (PL.dead) return; PL.dead = 1; RUN.deaths++;
  run(async () => {
    sfx('powerdown'); carlSays(why === 'pit' ? 'fall' : 'hurt', 1); music(null);
    await wait(70); await fadeOut(.05);
    RUN.lives--;
    if (RUN.lives <= 0) return LV.finish('over');
    PL.x = PL.cx; PL.y = PL.cy; respawnState(); if (ARENA) resetBoss();
    music(LV.theme.music); await fadeIn(.06);
  });
}
const swimming = () => waterAt(PL.y + 6);
function playerUpdate() {
  if (PL.dead) { PL.vy = Math.min(PL.vy + .2, 4); PL.y += PL.vy; return; }
  if (quipCD > 0) quipCD--;
  if (PL.hurt > 0) PL.hurt--; if (PL.throwT > 0) PL.throwT--; if (PL.ropeCD > 0) PL.ropeCD--; if (PL.scr > 0) PL.scr--;
  let L = held.left, R = held.right; if (PL.scr > 0) [L, R] = [R, L];
  const dir = (R ? 1 : 0) - (L ? 1 : 0);
  const wet = swimming();
  if (wet && !PL.wasWet && LV.def.water !== undefined && !PL.saidWet) { PL.saidWet = 1; carlSays('water', 1); }
  PL.wasWet = wet;

  if (BONG && BONG.pull) return; // the hookshot is reeling him in
  // ---- hanging from a hook ring ----
  if (PL.hang) {
    PL.vx = PL.vy = 0; PL.x = PL.hang.x - PL.w / 2; PL.y = PL.hang.y + 4; if (dir) PL.face = dir;
    if (pressed.b) { PL.hang = null; PL.vy = -LIMIT.jump; PL.vx = dir * 2.2; sfx('jump'); }
    else if (pressed.down) { PL.hang = null; PL.vy = 1; }
    tools(dir); return;
  }
  // ---- on a rope ----
  if (PL.rope) {
    const r = PL.rope; if (dir) { r.w += dir * .0011 * Math.cos(r.th); PL.face = dir; }
    if (held.up) PL.ropeD = Math.max(14, PL.ropeD - 1.2); if (held.down) PL.ropeD = Math.min(r.len, PL.ropeD + 1.2);
    const hx = r.ax + Math.sin(r.th) * PL.ropeD, hy = r.ay + Math.cos(r.th) * PL.ropeD;
    PL.x = hx - PL.w / 2; PL.y = hy - 3;
    if (pressed.b) { const v = r.w * PL.ropeD; PL.vx = clamp(Math.cos(r.th) * v * 1.25, -4.5, 4.5); PL.vy = Math.min(-2.5, -Math.sin(r.th) * v * 1.25 - 2.8); PL.lastRope = PL.rope; PL.rope = null; PL.ropeCD = 30; sfx('jump'); }
    tools(dir); return;
  }
  if (bonusPre(dir)) return; // loops, wall climbing
  // ---- walking / swimming ----
  const maxV = wet ? 1.35 : LIMIT.run;
  if (RULES.speed && !wet) speedRun(dir);
  else if (dir) { PL.vx = clamp(PL.vx + dir * (wet ? .12 : .35), -maxV, maxV); PL.face = dir; } else PL.vx *= PL.on ? .68 : wet ? .93 : .95;
  if (wet) {
    PL.vy = Math.min(PL.vy + .07, 1.3);
    if (pressed.b) { PL.vy = PL.y < LV.water * TS + 4 ? -5.2 : -2.3; sfx('jump'); for (let i = 0; i < 3; i++) FX.push({ k: 'bub', x: PL.x + 5, y: PL.y + 4, vy: -.6 - Math.random(), t: 40 }); }
    if (held.down) PL.vy = Math.min(PL.vy + .1, 1.8);
    if (held.up && PL.y > LV.water * TS - 6) PL.vy -= .06;
  } else {
    if (pressed.b && !PL.crouch) PL.jbuf = 8; else if (PL.jbuf > 0) PL.jbuf--;
    if (PL.on) PL.coyote = 6; else if (PL.coyote > 0) PL.coyote--;
    if (PL.jbuf > 0 && PL.coyote > 0) { PL.vy = -LIMIT.jump - (PL.dino ? .7 : 0); PL.jbuf = 0; PL.coyote = 0; PL.ball = RULES.ball ? 1 : 0; PL.jumped = 1; sfx('jump'); }
    else if (pressed.b && !PL.on && PL.coyote <= 0) bonusAir();
    if (!held.b && PL.vy < -2 && !PL.sprung) PL.vy += .45; // let go early, jump lower
    PL.vy = Math.min(PL.vy + LIMIT.grav, 6.5);
  }
  if (PL.glide) { PL.vy = Math.min(PL.vy, .7); if (!held.b) PL.glide = 0; else { if (dir) PL.face = dir; PL.vx = clamp(PL.vx + PL.face * .1, -3.6, 3.6); } }
  moveX(PL.vx); const wasOn = PL.on; moveY(PL.vy); if (PL.on && !wasOn && !wet) sfx('land');
  if (PL.on) { PL.ball = 0; PL.sprung = 0; PL.glide = 0; PL.jumped = 0; }
  bonusPost(dir);
  if (PL.y > LV.h * TS + 8) return die('pit');
  // grab a rope in the air
  if (!PL.on) for (const r of ENTS) if (r.kind === 'rope' && !(r === PL.lastRope && PL.ropeCD > 0)) {
    for (let d = 14; d <= r.len; d += 6) {
      const px = r.ax + Math.sin(r.th) * d, py = r.ay + Math.cos(r.th) * d;
      if (px > PL.x - 4 && px < PL.x + PL.w + 4 && py > PL.y - 2 && py < PL.y + PL.h) {
        PL.rope = r; PL.ropeD = d; const vt = PL.vx * Math.cos(r.th) - PL.vy * Math.sin(r.th); r.w = clamp(vt / d, -.06, .06);
        if (!PL.saidRope) { PL.saidRope = 1; carlSays('rope', 1); } sfx('tick'); break;
      }
    }
    if (PL.rope) break;
  }
  tools(dir);
  PL.anim += Math.abs(PL.vx) * .18 + (wet ? .08 : 0);
}

// ---------------- the bong (throw / hookshot) and the lighter ----------------
function hand() { return { x: PL.x + PL.w / 2 + PL.face * 6, y: PL.y + 9 }; }
function tools(dir) {
  const wet = swimming();
  if (pressed.a && !BONG && !(PL.dino && !held.up && dinoTongue())) {
    const h = hand();
    if (held.up) {
      // auto-aim: the nearest ring in front or above, in range (from a ring: the next one)
      let best = null, bd = 136;
      for (const e of ENTS) if (e.kind === 'ring' && e !== PL.hang) { const dx = e.x - h.x, dy = e.y - h.y, d = Math.hypot(dx, dy); if (dy < 20 && dx * PL.face > -40 && d < bd) { bd = d; best = e; } }
      BONG = { mode: 'hook', x: h.x, y: h.y, sx: h.x, sy: h.y, ring: best, vx: best ? 0 : PL.face * 5, vy: best ? 0 : -5, t: 0, hits: new Set() };
      sfx('switch');
    } else { BONG = { mode: 'throw', x: h.x, y: h.y - 2, vx: PL.face * 6.2 + PL.vx * .4, vy: 0, t: 0, back: 0, hits: new Set() }; PL.throwT = 12; sfx('jump'); }
  }
  // lighter
  PL.flaming = 0;
  if (held.c && !PL.hang) {
    if (wet) { if (pressed.c) { carlSays('wet', 1); for (let i = 0; i < 6; i++) FX.push({ k: 'bub', x: hand().x, y: hand().y, vy: -.5 - Math.random(), t: 40 }); sfx('tick'); } }
    else if (PL.hot) { if (pressed.c) sfx('tick'); }
    else {
      PL.flaming = 1; PL.fuel -= .8; if (frame % 4 === 0) sfx('step');
      const h = hand(); FX.push({ k: 'fire', x: h.x, y: h.y - 3, vx: PL.face * (3 + Math.random() * 1.5) + PL.vx, vy: -.3 + Math.random() * .4, t: 13 });
      const zone = { x: PL.face > 0 ? h.x : h.x - 44, y: PL.y + 2, w: 44, h: 14 };
      // burn walls of text
      for (let ty = Math.floor(zone.y / TS); ty <= Math.floor((zone.y + zone.h) / TS); ty++) for (let tx = Math.floor(zone.x / TS); tx <= Math.floor((zone.x + zone.w) / TS); tx++)
        if (tileAt(tx, ty) === 'W') { burnTile(tx, ty); if (!PL.saidBurn || Math.random() < .3) { PL.saidBurn = 1; carlSays('burn'); } }
      if (frame % 8 === 0) for (const e of ENTS) if (e.foe && !e.dead && overlap(zone, e)) hitFoe(e, 1, 'fire');
      for (const s of SHOTS) if (s.burn && overlap(zone, s)) { s.dead = 1; FX.push({ k: 'puff', x: s.x, y: s.y, t: 16 }); }
      if (BOSS && BOSS.fire) BOSS.fire(zone);
      if (PL.fuel <= 0) { PL.fuel = 0; PL.hot = 1; carlSays('hot'); }
    }
  }
  if (!PL.flaming) { PL.fuel = Math.min(100, PL.fuel + .55); if (PL.hot && PL.fuel >= 45) PL.hot = 0; }
  // air: the bong is the snorkel. in your hand you breathe slowly through it; thrown, you're holding your breath
  if (LV.def.water !== undefined) {
    if (!wet) PL.air = Math.min(100, PL.air + 3);
    else {
      PL.air -= PL.shield === 'bubble' ? -1 : BONG ? .25 : .045;
      for (const v of ENTS) if (v.kind === 'vent' && Math.abs(PL.x + 5 - v.x) < 12 && PL.y < v.y && PL.y > v.y - 120) PL.air = Math.min(100, PL.air + 1.5);
      if (BONG && !PL.saidNoBong && PL.air < 70) { PL.saidNoBong = 1; carlSays('nobong', 1); }
      if (PL.air < 25 && frame % 200 === 0) carlSays('air', 1);
      if (PL.air <= 0) { PL.air = 0; if (++PL.choke % 80 === 0) { PL.hurt = 0; ouch(1, 'air'); } } else PL.choke = 0;
    }
  }
}
function burnTile(tx, ty) { LV.g[ty][tx] = 'w'; LV.burn[tx + ',' + ty] = 22; sfx('crash'); }
function bongUpdate() {
  const B = BONG; if (!B) return; B.t++;
  const h = hand();
  if (B.mode === 'hook') {
    if (B.ring && !B.pull) {
      const dx = B.ring.x - B.x, dy = B.ring.y - B.y, d = Math.hypot(dx, dy);
      if (d < 8) { B.pull = 1; sfx('stun'); if (!PL.saidHook) { PL.saidHook = 1; carlSays('hook', 1); } }
      else { B.x += dx / d * 8; B.y += dy / d * 8; }
    } else if (B.pull) {
      PL.hang = null; const tx = B.ring.x - PL.w / 2, ty = B.ring.y + 4, dx = tx - PL.x, dy = ty - PL.y, d = Math.hypot(dx, dy);
      PL.rope = null;
      if (d < 7) { PL.x = tx; PL.y = ty; PL.hang = B.ring; PL.vx = PL.vy = 0; BONG = null; return; }
      const nx = PL.x + dx / d * 6.5, ny = PL.y + dy / d * 6.5;
      if (boxHit(nx, ny, PL.w, PL.h, solidAt)) { BONG = null; return; } // something in the way: let go
      PL.x = nx; PL.y = ny; PL.vx = PL.vy = 0;
    } else {
      if (B.t < 16 && !boxHit(B.x - 3, B.y - 3, 6, 6, solidAt)) { B.x += B.vx; B.y += B.vy; }
      else { const dx = h.x - B.x, dy = h.y - B.y, d = Math.hypot(dx, dy); if (d < 9) { BONG = null; return; } B.x += dx / d * 8; B.y += dy / d * 8; }
    }
  } else {
    if (!B.back) { B.x += B.vx; B.vx *= .94; if (B.t > 18 || Math.abs(B.vx) < 1.2 || boxHit(B.x - 5, B.y - 5, 10, 10, solidAt)) { B.back = 1; if (boxHit(B.x - 5, B.y - 5, 10, 10, solidAt)) sfx('land'); } }
    else { const dx = h.x - B.x, dy = h.y - B.y, d = Math.hypot(dx, dy); if (d < 10) { BONG = null; return; } const sp = Math.min(7, 3 + B.t * .12); B.x += dx / d * sp; B.y += dy / d * sp; }
  }
  // damage: both modes
  const box = { x: B.x - 6, y: B.y - 6, w: 12, h: 12 };
  for (const e of ENTS) if (e.foe && !e.dead && !B.hits.has(e) && overlap(box, e)) { B.hits.add(e); hitFoe(e, 1, 'bong'); if (B.mode === 'hook' && !B.ring) B.t = 99; }
  if (BOSS && BOSS.hitbox && !B.hits.has(BOSS) && overlap(box, BOSS.hitbox())) { B.hits.add(BOSS); BOSS.hit(B); if (B.mode === 'throw') B.back = 1; }
  for (const s of SHOTS) if (s.bongable && overlap(box, s)) { s.dead = 1; FX.push({ k: 'puff', x: s.x, y: s.y, t: 16 }); }
}

// ---------------- foes ----------------
const FOES = {
  g: { kind: 'goon', w: 12, h: 23, hp: 1, sp: .55, walk: 1 },
  k: { kind: 'cop', w: 12, h: 25, hp: 2, sp: .8, walk: 1, chase: 1 },
  e: { kind: 'bee', w: 14, h: 12, hp: 1, hop: 1 },
  y: { kind: 'typo', w: 16, h: 12, hp: 1, fly: 1 },
  t: { kind: 'terms', w: 14, h: 28, hp: 3, turret: 1 },
  f: { kind: 'fish', w: 16, h: 10, hp: 1, swim: 1 },
  j: { kind: 'jelly', w: 14, h: 18, hp: 1, bob: 1, spiky: 1 },
};
function makeFoe(c, wx, wy) {
  const F = FOES[c], e = Object.assign({ foe: 1, x: wx + (16 - F.w) / 2, y: wy + 16 - F.h, dir: -1, t: rnd(60), flash: 0, vy: 0 }, F);
  e.hpMax = e.hp; e.bx = e.x; e.by = e.y;
  if (e.kind === 'typo') e.ch = pick('QXZJKV');
  return e;
}
function hitFoe(e, n, how) {
  if (e.flash > 0 && how === 'fire') return;
  e.hp -= n; e.flash = 10; sfx('stun');
  if (e.hp <= 0) {
    e.dead = 1; sfx('crowd'); if (e.onDie && e.onDie(e)) return; RUN.kills = (RUN.kills || 0) + 1;
    for (let i = 0; i < 8; i++) FX.push({ k: 'spark', x: e.x + e.w / 2, y: e.y + e.h / 2, vx: (Math.random() - .5) * 4, vy: -Math.random() * 3, t: 24 });
    if (Math.random() < .35) ENTS.push({ kind: 'bux', x: e.x + 2, y: e.y + e.h - 12, w: 10, h: 10, vy: -2, drop: 1 });
    if (Math.random() < .3) carlSays('kill');
  }
}
function foeUpdate(e) {
  e.t++; if (e.flash > 0) e.flash--;
  if (e.walk) {
    if (e.chase && Math.abs(PL.x - e.x) < 120 && Math.abs(PL.y - e.y) < 40) e.dir = Math.sign(PL.x - e.x) || e.dir;
    const nx = e.x + e.dir * e.sp, fx = e.dir > 0 ? nx + e.w : nx, footY = Math.floor((e.y + e.h + 2) / TS);
    const wall = solidAt(Math.floor(fx / TS), Math.floor((e.y + e.h - 4) / TS)), ledge = !solidAt(Math.floor(fx / TS), footY) && tileAt(Math.floor(fx / TS), footY) !== '=';
    if (wall || ledge) e.dir = -e.dir; else e.x = nx;
  } else if (e.hop) {
    e.vy += .25; e.y += e.vy;
    const fy = Math.floor((e.y + e.h) / TS); if (e.vy > 0 && (solidAt(Math.floor((e.x + 7) / TS), fy) || tileAt(Math.floor((e.x + 7) / TS), fy) === '=')) { e.y = fy * TS - e.h; e.vy = 0; if (e.t % 70 > 50) { e.vy = -4.6; e.dir = Math.sign(PL.x - e.x) || 1; } }
    if (e.vy) { const nx = e.x + e.dir * 1.1; if (!solidAt(Math.floor((e.dir > 0 ? nx + e.w : nx) / TS), Math.floor((e.y + 6) / TS))) e.x = nx; }
    if (e.y > LV.h * TS) e.dead = 1;
  } else if (e.fly) {
    e.x = e.bx + Math.sin(e.t * .02) * 40; e.y = e.by + Math.sin(e.t * .07) * 14; e.dir = Math.cos(e.t * .02) > 0 ? 1 : -1;
    if (Math.abs(PL.x - e.x) < 70 && e.t % 120 === 0) e.by += Math.sign(PL.y - e.by) * 8;
  } else if (e.turret) {
    e.dir = PL.x < e.x ? -1 : 1;
    if (e.t % 110 === 0 && Math.abs(PL.x - e.x) < 220) { SHOTS.push({ x: e.x + (e.dir > 0 ? 12 : -12), y: e.y + 6, w: 14, h: 10, vx: e.dir * 1.6, vy: 0, t: 220, spr: XS.para, P: XP.foe, burn: 1, bongable: 1 }); sfx('tick'); }
  } else if (e.swim) {
    e.x += e.dir * .55; e.y = e.by + Math.sin(e.t * .05) * 6;
    if (solidAt(Math.floor((e.dir > 0 ? e.x + e.w : e.x) / TS), Math.floor((e.y + 5) / TS)) || Math.abs(e.x - e.bx) > 80) e.dir = -e.dir;
  } else if (e.bob) { e.y = e.by + Math.sin(e.t * .025) * 12; } // leaves a gap above or below in a tunnel
  else if (e.ai) e.ai(e);
  // contact
  if (!PL.dead && !e.dead && overlap(PL, e)) {
    if (e.touch && e.touch(e)) return; // shells, monitors: their own rules
    if (PL.star > 0 || ((PL.ball || PL.roll || PL.loop) && RULES.ball && !e.spiky)) { hitFoe(e, 9, 'spin'); if (!PL.on && PL.vy > 0) PL.vy = held.b ? -5.5 : -4; return; }
    const stomp = PL.vy > 1 && PL.y + PL.h - e.y < 9 && !e.spiky && !swimming();
    if (stomp) { hitFoe(e, 2, 'stomp'); PL.vy = held.b ? -6 : -4; sfx('jump'); }
    else ouch(1, null, e.x + e.w / 2);
  }
}

// ---------------- world update ----------------
function worldUpdate() {
  if (SHAKE > 0 && --SHAKE === 0) post.shake = 0;
  for (const k in LV.burn) if (--LV.burn[k] <= 0) { delete LV.burn[k]; const [x, y] = k.split(',').map(Number); LV.g[y][x] = '.'; for (let i = 0; i < 5; i++) FX.push({ k: 'puff', x: x * TS + rnd(16), y: y * TS + rnd(16), t: 20 }); }
  if (!CUT || PL.dead) playerUpdate();
  bongUpdate();
  for (const e of ENTS) {
    if (e.dead) continue;
    if (e.foe) { if (Math.abs(e.x - PL.x) < 400) foeUpdate(e); continue; }
    if (e.kind === 'rope') { ropeStep(e); continue; }
    if (e.upd && e.upd(e)) continue;
    if (e.kind === 'vent') { if (++e.t % 9 === 0) FX.push({ k: 'bub', x: e.x - 3 + rnd(6), y: e.y - 4, vy: -.8 - Math.random() * .6, t: 120 }); continue; }
    if (e.drop) { e.vy += .2; e.y += e.vy; if (solidAt(Math.floor((e.x + 5) / TS), Math.floor((e.y + 10) / TS))) { e.y = Math.floor((e.y + 10) / TS) * TS - 10; e.vy = 0; e.drop = 0; } }
    if (e.kind === 'post' && !e.lit && Math.abs(PL.x - e.x) < 14 && Math.abs(PL.y + PL.h - (e.y + e.h)) < 20) { e.lit = 1; PL.cx = e.x + 3; PL.cy = e.y + e.h - PL.h; sfx('get'); carlSays('lit', 1); }
    if (!e.w || !overlap(PL, e) || PL.dead) continue;
    if (e.kind === 'bux' && !(e.life > 150)) { e.dead = 1; RUN.bux++; sfx('chat'); if (RUN.bux % 50 === 0) { RUN.lives++; sfx('get'); carlSays('oneup', 1); FX.push({ k: 'txt', s: '1UP', x: PL.x - 4, y: PL.y - 10, t: 60 }); } }
    if (e.kind === 'pretzel') { e.dead = 1; PL.hp = Math.min(LIMIT.maxHP, PL.hp + 1); sfx('get'); carlSays('heal', 1); }
    if (e.kind === 'box') { e.dead = 1; RUN.got[LV.def.outfit] = 1; RUN.outfit = LV.def.outfit; saveX(); sfx('get'); carlSays('box', 1); const o = OUTFITS.find(o => o.id === LV.def.outfit); banner(o.name + ' OUTFIT', 120); }
    if (e.kind === 'goal' && !LV.done) { LV.done = 1; if (e.style || e.warp) goalSeq(e); else LV.finish('clear'); }
  }
  ENTS = ENTS.filter(e => !e.dead || e.kind === 'rope');
  for (const s of SHOTS) {
    s.x += s.vx; s.y += s.vy; if (s.ay) s.vy += s.ay; s.t--;
    if (s.t <= 0 || (s.solid !== 0 && boxHit(s.x, s.y, s.w, s.h, solidAt))) s.dead = 1;
    if (!s.dead && !PL.dead && overlap(PL, s)) { if (!(s.fire && PL.shield === 'fire')) ouch(1, 'shot', s.x + s.w / 2 - s.vx * 4); s.dead = 1; }
  }
  SHOTS = SHOTS.filter(s => !s.dead);
  for (const f of FX) { f.t--; if (f.vx) f.x += f.vx; if (f.vy) f.y += f.vy; if (f.k === 'bub' && !waterAt(f.y)) f.t = 0; if (f.k === 'spark') f.vy += .15; }
  FX = FX.filter(f => f.t > 0);
  for (const b of BUBBLES) b.t--; BUBBLES = BUBBLES.filter(b => b.t > 0);
  if (BOSS) BOSS.update();
  bonusWorld();
  // camera
  if (LV.lock) camX += clamp(LV.lock - camX, -4, 4);
  else { const cs = RULES.speed ? 9 : 5, tx = clamp(PL.x - 150 + (RULES.speed ? clamp(PL.vx * 12, -60, 60) : PL.face * 24), 0, LV.w * TS - W); camX += clamp(tx - camX, -cs, cs); }
  const ty = clamp(PL.y - 120, 0, LV.h * TS - H); camY += clamp(ty - camY, RULES.speed ? -9 : -5, RULES.speed ? 9 : 5);
  if (LV.def.boss && !ARENA && PL.x > LV.def.boss.at * TS + 48) startArena();
}

// ropes keep swinging on their own (a rope you can't reach is a rope that stopped). ridden, they keep a little drag
function ropeStep(r) {
  const on = PL.rope === r, d = on ? PL.ropeD : r.len * .8;
  r.w += -(.32 / d) * Math.sin(r.th); if (on) r.w *= .999;
  else { const E = 1 - Math.cos(r.th) + r.w * r.w * d / .64; if (E < .2) r.w *= 1.004; else if (E > .45) r.w *= .99; }
  r.th = clamp(r.th + r.w, -1.35, 1.35);
}
// ---------------- drawing ----------------
const hash = n => { n = (n * 2654435761) >>> 0; return ((n ^ (n >>> 13)) >>> 0) / 4294967296; };
function drawBack() {
  const T = LV.theme; skyD(0, H, T.sky[0], T.sky[1]);
  if (BACKS[T.kind]) return BACKS[T.kind](T);
  const far = hex(T.far), mid = hex(T.mid);
  for (let layer = 0; layer < 2; layer++) {
    const sp = layer ? .5 : .22, c = layer ? mid : far, cw = layer ? 40 : 28, off = camX * sp;
    for (let i = Math.floor(off / cw) - 1; i < Math.floor(off / cw) + W / cw + 2; i++) {
      const x = i * cw - off, r = hash(i * 7 + layer * 1000), base = H - (layer ? 30 : 60) - camY * sp * .3;
      if (T.kind === 'city') { const h = 30 + r * 70; rectF(x, base - h, cw - 4, h + 90, c); if (layer === 0) for (let wy = base - h + 6; wy < base; wy += 9) for (let wx = x + 4; wx < x + cw - 8; wx += 7) if (hash(i * 131 + (wx - x) * 3 + (wy - base + h) * 17) > .55) rectF(wx, wy, 3, 4, hex('#ffdb92')); }
      else if (T.kind === 'mall') { const h = 50 + r * 30; rectF(x, base - h, cw - 2, h + 90, c); if (layer) { rectF(x + 6, base - h + 10, cw - 14, 16, hex(r > .5 ? '#ff49db' : '#24dbdb')); rectF(x + 8, base - h + 12, cw - 18, 12, c); } }
      else if (T.kind === 'mesa') { const h = 30 + r * 50; triF(x - 10, base + 10, x + cw * .3, base - h, x + cw + 10, base + 10, c); rectF(x + cw * .3, base - h, cw * .4, h + 90, c); }
      else if (T.kind === 'hills' && LV.water < LV.h) { if (layer) for (let k = 0; k < 3; k++) { const kx = x + k * 13, top = H - 40 - hash(i * 3 + k) * 90; for (let yy = H; yy > top; yy -= 2) rectF(kx + Math.sin(yy * .07 + frame * .03 + i + k) * 3, yy, 3, 2, hex(k & 1 ? '#246d49' : '#249249')); } else { const h = 20 + r * 30; circF(x + cw / 2, base + 30, cw * .9 + h * .3, c); } }
      else if (T.kind === 'hills') { const h = 20 + r * 30; circF(x + cw / 2, base + 20, cw * .9 + h * .3, c); if (layer) { rectF(x + 10, base - 20 - h, 4, 30, hex('#24496d')); triF(x + 2, base - 10 - h, x + 12, base - 50 - h, x + 22, base - 10 - h, hex('#245249')); } }
      else if (T.kind === 'shelves') { rectF(x, 0, cw - 3, H, c); for (let sy = 12 - (camY * sp | 0) % 24; sy < H; sy += 24) { rectF(x, sy, cw - 3, 2, hex('#120a1c')); for (let bx = x + 2, n = 0; bx < x + cw - 6; bx += 4, n++) { const q = i * 97 + n * 7 + Math.round((sy + camY * sp) / 24) * 53; rectF(bx, sy - 10 + (hash(q) * 4 | 0), 3, 10 - (hash(q) * 4 | 0), hex(['#6d2449', '#244970', '#6d6d24', '#492470'][(hash(q * 5 + 1) * 4) | 0])); } } }
    }
  }
}
function drawPitShade() { // pits fade to dark instead of showing sky through the bottom of the world
  const y0 = LV.h * TS - camY - 56; if (y0 > H) return;
  const c = hex(LV.theme.mid); for (let i = 0; i < 56; i += 4) rectF(0, y0 + i, W, 4, mix(c, BLACK, Math.min(.9, i / 48)));
  rectF(0, y0 + 56, W, H, BLACK);
}
function drawTiles() {
  const P = LV.theme.P, x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
  for (let ty = y0; ty <= y0 + 15; ty++) for (let tx = x0; tx <= x0 + 21; tx++) {
    if (!inMap(tx, ty)) continue; const c = LV.g[ty][tx], sx = tx * TS - camX, sy = ty * TS - camY;
    if (c === '#') draw(TILES[solidAt(tx, ty - 1) || ty === 0 ? '#' : '#top'], sx, sy, P);
    else if (c === '=' || c === '^' || c === 'W') draw(TILES[c], sx, sy, P);
    else if (c === 'w') draw(TILES.w[(frame >> 3) & 1], sx, sy, P);
    else if (TILES2[c]) drawTile2(c, tx, ty, sx, sy);
  }
}
function drawEnts() {
  for (const e of ENTS) {
    const sx = e.x - camX, sy = e.y - camY;
    if (sx < -100 || sx > W + 100) continue;
    if (e.kind === 'rope') { drawRope(e); continue; }
    if (e.draw && !e.foe) { e.draw(e, sx, sy); continue; }
    if (e.kind === 'ring') { draw(XS.ring, e.x - 6 - camX, e.y - 6 - camY, XP.bong); continue; }
    if (e.kind === 'vent') { rectF(e.x - 6 - camX, e.y - 4 - camY, 12, 4, hex('#246d6d')); continue; }
    if (e.kind === 'bux') { if (!(e.life < 60 && frame & 2)) draw(XS.bux[(frame >> 3) & 3], sx, sy, XP.items); }
    else if (e.kind === 'pretzel') draw(XS.pretzel, sx, sy + Math.sin(frame * .1) * 1.5, XP.items);
    else if (e.kind === 'box') draw(XS.box[(frame >> 4) & 1], sx, sy, XP.items);
    else if (e.kind === 'post') { draw(XS.post[e.lit], sx, sy, XP.items); if (e.lit && frame % 6 === 0) FX.push({ k: 'smoke', x: e.x + 14, y: e.y + 4, vy: -.4, t: 40 }); }
    else if (e.kind === 'goal' && e.style) drawGoal2(e, sx, sy);
    else if (e.kind === 'goal') { draw(XS.goal[(frame >> 4) & 1], sx, sy, XP.items); if ((frame >> 5) & 1) text('>', sx + 12, sy - 10, hex('#ffdb24')); }
    else if (e.kind === 'sign') { rectF(sx + 13, sy + 14, 2, 10, hex('#6d4924')); panel(sx, sy, 28, 16); text(e.s, sx + 14 - e.s.length * 3, sy + 5, UI.name); }
    else if (e.kind === 'cage') { rectF(sx + 13, 0, 2, Math.max(0, sy), hex('#6d6d6d')); draw(XS.linda[(frame >> 5) & 1], sx + 5, sy + 8, XP.linda); draw(XS.cage, sx, sy, XP.linda); }
    else if (e.foe) drawFoe(e, sx, sy);
  }
}
function drawRope(r) {
  const n = Math.ceil(r.len / 3), c1 = hex('#b6924a'), c2 = hex('#6d4924');
  for (let i = 0; i <= n; i++) { const d = i * 3, x = r.ax + Math.sin(r.th) * d - camX, y = r.ay + Math.cos(r.th) * d - camY; rectF(x - 1, y, 2, 3, i & 1 ? c1 : c2); }
  const bx = r.ax - 22 - camX, by = r.ay - 6 - camY; // the beam it hangs from: a log across the gap
  rectF(bx, by, 44, 7, hex('#6d4924')); rectF(bx, by, 44, 2, hex('#926d49')); rectF(bx, by + 6, 44, 1, BLACK); for (const x of [6, 22, 36]) pset(bx + x, by + 3, hex('#492410'));
  rectF(r.ax - 2 - camX, r.ay - camY, 4, 3, hex('#b6924a'));
}
function drawFoe(e, sx, sy) {
  const f = (e.t >> 4) & 1, fl = e.dir < 0, tint = e.flash > 0 && (e.flash & 2) ? WHITE : 0;
  if (e.draw) return e.draw(e, sx, sy, f, fl, tint);
  const S = { goon: XS.goon, cop: XS.cop, bee: XS.bee, terms: XS.terms, fish: XS.fish, jelly: XS.jelly }[e.kind] || XS.typo[e.ch];
  const P = e.kind === 'fish' || e.kind === 'jelly' ? XP.sea : XP.foe;
  draw(S[f], sx - (S[f].w - e.w) / 2, sy - (S[f].h - e.h), P, fl, tint);
}
function carlPose() {
  if (PL.dead || PL.hurt > 72) return ['hurt', 0];
  if (PL.hang || PL.rope || PL.climb) return ['hang', 0];
  if (PL.glide) return ['hook', 0];
  if (BONG && BONG.mode === 'hook') return ['hook', 0];
  if (PL.flaming) return ['flame', 0];
  if (PL.throwT > 0) return ['throw', 0];
  if (swimming()) return ['swim', (PL.anim | 0) & 3];
  if (!PL.on) return [PL.vy < 0 ? 'jump' : 'fall', 0];
  if (Math.abs(PL.vx) > .3) return ['run', (PL.anim | 0) & 3];
  return ['stand', 0];
}
function drawCarl() {
  if (PL.hurt > 0 && !PL.dead && (PL.hurt & 4)) return;
  const S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]), [p, f] = carlPose();
  const sx = PL.x - 5 - camX, sy = PL.y + PL.h - 25 - camY - (PL.dino ? 9 : 0);
  const tn = PL.star > 0 && (frame & 4) ? hex(['#ffdb24', '#ff49db', '#6dffff', '#ffffff'][(frame >> 3) & 3]) : 0;
  if (PL.dino) drawDino(sx - 4, PL.y + PL.h - camY - 18, PL.face < 0, (PL.anim | 0) & 1);
  if (PL.ball || PL.roll || PL.loop || PL.crouch) draw(S.ball[PL.crouch && !PL.rev ? 0 : (frame >> 1) & 3], sx + 1, sy + 8, S.P, PL.face < 0, tn);
  else draw(S[p][f], sx, sy, S.P, PL.face < 0, tn);
  if (PL.shield) drawShield(sx + 10, sy + 15);
  // the snorkel: underwater with the bong in hand, it's in his mouth
  if (swimming() && !BONG) draw(XS.bongUp, sx + (PL.face > 0 ? 13 : -6), sy + 2, XP.bong, PL.face < 0);
}
function drawBong() {
  const B = BONG; if (!B) return;
  if (B.mode === 'hook') { const h = hand(); const n = Math.max(1, Math.hypot(B.x - h.x, B.y - h.y) / 4 | 0); for (let i = 0; i < n; i++) rectF(h.x + (B.x - h.x) * i / n - camX, h.y + (B.y - h.y) * i / n - camY, 2, 2, (i & 1) ? hex('#b6b6b6') : hex('#6d6d6d')); }
  const s = XS.bong[B.mode === 'hook' ? 0 : (B.t >> 2) & 3]; draw(s, B.x - s.w / 2 - camX, B.y - s.h / 2 - camY, XP.bong);
}
function drawFX() {
  for (const f of FX) {
    const x = f.x - camX, y = f.y - camY;
    if (f.k === 'fire') draw(XS.flame[f.t > 9 ? 2 : f.t > 4 ? 1 : 0], x - 5, y - 5, XP.bong);
    else if (f.k === 'bub') draw(XS.bubble[f.t & 1 ? 0 : 1], x, y, XP.bong);
    else if (f.k === 'puff' || f.k === 'smoke') circF(x, y, f.k === 'smoke' ? 2 + (40 - f.t) / 10 : 1 + (20 - f.t) / 4, hex(f.k === 'smoke' ? '#b6b6b6' : '#dbdbdb'));
    else if (f.k === 'spark') rectF(x, y, 2, 2, hex(f.t & 2 ? '#ffdb24' : '#ffffff'));
    else if (f.k === 'txt') text(f.s, x, y - (60 - f.t) / 3, hex('#ffdb24'));
  }
  for (const s of SHOTS) { if (s.spr) draw(s.spr, s.x - camX, s.y - camY, s.P); else if (s.ch) draw(XS.letterShot[s.ch], s.x - camX, s.y - camY, XP.dys); }
}
// a fast alpha tint (the engine's rectA allocates per pixel: ~75ms for a full screen of water)
function tint(x, y, w, h, c, a) {
  x |= 0; y |= 0; const x0 = Math.max(0, x), y0 = Math.max(0, y), x1 = Math.min(W, x + w), y1 = Math.min(H, y + h); if (x1 <= x0 || y1 <= y0) return;
  const k = Math.round(a * 256), ik = 256 - k, cr = (c & 255) * k, cg = ((c >> 8) & 255) * k, cb = ((c >> 16) & 255) * k;
  for (let j = y0; j < y1; j++) for (let o = j * W + x0, e = j * W + x1; o < e; o++) { const p = FB[o]; FB[o] = (0xff000000 | ((((p >> 16) & 255) * ik + cb) >> 8) << 16 | ((((p >> 8) & 255) * ik + cg) >> 8) << 8 | (((p & 255) * ik + cr) >> 8)) >>> 0; }
}
function drawWater() {
  if (LV.water > LV.h) return;
  const wy = LV.water * TS - camY; if (wy > H) return;
  tint(0, Math.max(0, wy), W, H - Math.max(0, wy), hex('#004992'), .55);
  for (let x = 0; x < W; x += 2) pset(x, wy + Math.round(Math.sin((x + camX) * .1 + frame * .08) * 1.5), hex('#dbffff'));
}
function drawBubbles() {
  for (const b of BUBBLES) {
    const who = b.who, x = (who.x !== undefined ? who.x + (who.w || 10) / 2 : 160) - camX, y = (who.y !== undefined ? who.y : 100) - camY - 14;
    const w = b.s.length * 6 + 8, bx = clamp(Math.round(x - w / 2), 2, W - w - 2), by = clamp(Math.round(y - 12), 18, H - 20);
    rectF(bx, by, w, 13, WHITE); frameRect(bx, by, w, 13, BLACK); rectF(clamp(x, bx + 4, bx + w - 6) | 0, by + 13, 3, 3, WHITE); pset(clamp(x, bx + 4, bx + w - 6) + 1, by + 16, BLACK);
    text(b.s, bx + 4, by + 3, BLACK, 0);
  }
}
function heart(x, y, full) { const c = hex(full ? '#ff2449' : '#492449'); rectF(x + 1, y, 3, 2, c); rectF(x + 5, y, 3, 2, c); rectF(x, y + 1, 9, 3, c); rectF(x + 1, y + 4, 7, 1, c); rectF(x + 2, y + 5, 5, 1, c); rectF(x + 3, y + 6, 3, 1, c); pset(x + 4, y + 7, c); if (full) { pset(x + 2, y + 1, WHITE); } }
function bar(x, y, w, v, c) { rectF(x, y, w + 2, 5, BLACK); rectF(x + 1, y + 1, w * clamp(v, 0, 1), 3, c); }
function drawHUD() {
  tint(0, 0, W, 14, BLACK, .55);
  if (RULES.rings) { if (RUN.bux > 0 || (frame & 16)) text('BUX=HP', 4, 4, RUN.bux ? hex('#ffdb24') : hex('#ff2449')); }
  else for (let i = 0; i < LIMIT.maxHP; i++) heart(4 + i * 11, 3, i < PL.hp);
  const S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) { const c = S.stand[0].d[(j + 2) * 20 + i + 2]; if (c) pset(44 + i * .6, 1 + j, S.P[c]); }
  text('x' + RUN.lives, 56, 4, WHITE);
  draw(XS.bux[0], 82, 2, XP.items); text(String(RUN.bux), 95, 4, hex('#ffdb24'));
  draw(XS.flame[1], 124, 1, XP.bong); bar(135, 5, 40, PL.fuel / 100, PL.hot ? hex('#db2424') : hex('#ffb600'));
  if (LV.def.water !== undefined) { draw(XS.bubble[0], 184, 4, XP.bong); bar(193, 5, 40, PL.air / 100, PL.air < 25 && (frame & 8) ? hex('#ff2449') : hex('#6dffff')); }
  text(LV.def.tag, W - 6 * LV.def.tag.length - 4, 4, UI.dim);
  if (PL.scr > 0 && (frame & 16)) { const c = hex('#ff49db'); triF(140, 26, 148, 20, 148, 32, c); triF(180, 26, 172, 20, 172, 32, c); text('?!', 154, 22, c); } // left/right swapped
  if (BOSS && BOSS.hp > 0) { tint(60, H - 12, 200, 9, BLACK, .6); bar(62, H - 10, 196, BOSS.hp / BOSS.max, hex('#ff2449')); }
}
function worldDraw() {
  drawBack(); drawPitShade(); drawTiles(); drawEnts(); if (BOSS) BOSS.draw(); drawBong(); drawSidekick(); drawCarl(); drawFX(); drawWater(); drawBubbles(); drawHUD();
}
const worldScene = { update() { if (pressed.start && !CUT && !PL.dead) { CUT = 1; run(pauseMenu); } else worldUpdate(); }, draw: worldDraw };
async function pauseMenu() {
  const prev = scene; music(null); sfx('tick');
  scene = { draw() { worldDraw(); tint(0, 0, W, H, BLACK, .5); ctext('PAUSED', 60, WHITE, BLACK, 2); ctext('STORY SO FAR: LINDA. GO.', 90, UI.dim); } };
  const i = await choose(['RESUME', 'QUIT TO TITLE'], { x: 116, y: 120, cancel: 1 });
  scene = prev; CUT = 0;
  if (i === 1) { await fadeOut(); return LV.finish('quit'); }
  music(LV.theme.music);
}
