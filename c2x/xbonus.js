'use strict';
// ================= CARL 2 EXTREME: BONUS CARTS =================
// Beat the game and five more cartridges show up: SUPER CARL BROS., SUPER CARL WORLD, CARL THE HEDGECARL,
// HEDGECARL 2 and CARL 3 & KNUCKLEHEAD. Each is three levels with its own house rules (RULES, set per level),
// its own boss, one outfit hidden inside and one for beating it. Carl keeps the bong and the lighter in all of them.

// ---------------- small helpers ----------------
function addBux(n) { for (let i = 0; i < n; i++) { RUN.bux++; if (RUN.bux % 50 === 0) { RUN.lives++; sfx('get'); FX.push({ k: 'txt', s: '1UP', x: PL.x - 4, y: PL.y - 10, t: 60 }); } } sfx('chat'); }
const none = { x: -999, y: 0, w: 0, h: 0 };
const XB = { carts: [] };

// ---------------- blocks (the plumber carts) ----------------
function bump(tx, ty) {
  const c = tileAt(tx, ty), k = tx + ',' + ty;
  if (c === '?') { LV.g[ty][tx] = 'u'; LV.sprung[k] = 8; sfx('stun'); spawnItem((LV.def.items || {})[k] || '$', tx * TS, ty * TS - TS); }
  else if (c === 'b' && RULES.blocks) smash(tx, ty);
  else if (c === 'b' || c === 'u') { LV.sprung[k] = 8; sfx('land'); }
  else return;
  for (const e of ENTS) if (e.foe && !e.dead && Math.abs(e.x + e.w / 2 - tx * TS - 8) < 14 && Math.abs(e.y + e.h - ty * TS) < 4) hitFoe(e, 9, 'bump');
}
function smash(tx, ty) {
  LV.g[ty][tx] = '.'; sfx('crash');
  for (let i = 0; i < 6; i++) FX.push({ k: 'spark', x: tx * TS + 4 + (i % 3) * 4, y: ty * TS + 4 + (i >> 1) * 3, vx: (i & 1 ? 1 : -1) * (1 + Math.random()), vy: -2 - Math.random() * 2, t: 30 });
}
// things that come out of ? blocks: they pop up, then wander like they own the place
function popUpd(e) {
  if (e.rise > 0) { e.y -= 1; e.rise--; return 0; }
  if (!e.walks) return 0;
  e.vy = Math.min(e.vy + .25, 4); const ny = e.y + e.vy;
  if (solidAt(Math.floor((e.x + e.w / 2) / TS), Math.floor((ny + e.h) / TS))) { e.y = Math.floor((ny + e.h) / TS) * TS - e.h; e.vy = 0; } else e.y = ny;
  const nx = e.x + e.vx; if (solidAt(Math.floor((e.vx > 0 ? nx + e.w : nx) / TS), Math.floor((e.y + e.h / 2) / TS))) e.vx = -e.vx; else e.x = nx;
  if (e.y > LV.h * TS) e.dead = 1;
  return 0;
}
function spawnItem(it, x, y) {
  if (it === '$') { addBux(1); ENTS.push({ kind: 'fx', x: x + 3, y: y + 6, vy: -4.5, t: 22, upd(e) { e.y += e.vy; e.vy += .35; if (--e.t <= 0) e.dead = 1; return 1; }, draw(e, sx, sy) { draw(XS.bux[(frame >> 1) & 3], sx, sy, XP.items); } }); return; }
  if (it === '1') { RUN.lives++; sfx('get'); FX.push({ k: 'txt', s: '1UP', x, y, t: 60 }); return; }
  const base = { x: x + 1, y: y + 16, w: 14, h: 14, rise: 16, vx: .9, vy: 0, upd: popUpd };
  if (it === '+') ENTS.push(Object.assign(base, { kind: 'pretzel', walks: 1 }));
  else if (it === 'X') { if (!RUN.got[LV.def.outfit]) ENTS.push(Object.assign(base, { kind: 'box', x, w: 16, h: 16, walks: 1 })); else addBux(10); }
  else if (it === '*') ENTS.push(Object.assign(base, { kind: 'star', walks: 1, vx: 1.4, upd(e) { popUpd(e); if (e.rise <= 0 && e.vy === 0) e.vy = -4; if (!PL.dead && overlap(PL, e)) { e.dead = 1; PL.star = 480; sfx('get'); quip('INVINCIBLE. LEGALLY.'); } return 0; }, draw: drawStar }));
  else if (it === 'F') ENTS.push(Object.assign(base, { kind: 'flower', upd(e) { popUpd(e); if (!PL.dead && overlap(PL, e)) { e.dead = 1; PL.fuel = 100; PL.hot = 0; sfx('get'); quip('I HAVE A LIGHTER.'); } return 0; }, draw: drawFlower }));
}
function drawStar(e, sx, sy) { const c = hex(frame & 4 ? '#ffdb24' : '#ffff92'); triF(sx + 7, sy, sx + 1, sy + 13, sx + 13, sy + 13, c); triF(sx, sy + 5, sx + 14, sy + 5, sx + 7, sy + 11, c); pset(sx + 5, sy + 6, BLACK); pset(sx + 9, sy + 6, BLACK); }
function drawFlower(e, sx, sy) { circF(sx + 7, sy + 5, 5, hex(frame & 8 ? '#ff4900' : '#ffdb24')); circF(sx + 7, sy + 5, 2, WHITE); rectF(sx + 6, sy + 9, 2, 5, hex('#24b624')); rectF(sx + 2, sy + 11, 4, 2, hex('#24b624')); rectF(sx + 8, sy + 11, 4, 2, hex('#24b624')); }

// ---------------- springs, rings-as-health, the dino ----------------
function spring(tx, ty) { PL.vy = -10.2; PL.on = false; PL.sprung = 1; PL.ball = 0; PL.glide = 0; LV.sprung[tx + ',' + ty] = 10; sfx('jump'); }
function scatterBux() {
  const n = Math.min(RUN.bux, 16); RUN.bux = 0; sfx('crash'); carlSays('hurt', 1);
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - n / 2) * .35; ENTS.push({ kind: 'bux', x: PL.x, y: PL.y + 4, w: 10, h: 10, vx: Math.cos(a) * 2.6, vy: Math.sin(a) * 3 - 1.5, life: 200, upd: scatUpd }); }
}
function scatUpd(e) {
  if (--e.life <= 0) { e.dead = 1; return 1; }
  e.vy = Math.min(e.vy + .2, 5); const ny = e.y + e.vy;
  if (e.vy > 0 && solidAt(Math.floor((e.x + 5) / TS), Math.floor((ny + 10) / TS))) { e.y = Math.floor((ny + 10) / TS) * TS - 10; e.vy = -Math.abs(e.vy) * .6; } else e.y = ny;
  const nx = e.x + e.vx; if (solidAt(Math.floor((e.vx > 0 ? nx + 10 : nx) / TS), Math.floor((e.y + 5) / TS))) e.vx = -e.vx; else e.x = nx;
  return 0;
}
function makeDino(x, y, flee) {
  return { kind: 'dino', x, y, w: 24, h: 18, dir: flee ? Math.sign(flee) : 1, flee: flee ? 140 : 0,
    upd(e) {
      if (e.flee > 0) { e.flee--; const nx = e.x + e.dir * 2.2, fx = e.dir > 0 ? nx + e.w : nx;
        if (solidAt(Math.floor(fx / TS), Math.floor((e.y + 8) / TS)) || !solidAt(Math.floor(fx / TS), Math.floor((e.y + e.h + 4) / TS))) e.dir = -e.dir; else e.x = nx; }
      return 1;
    },
    draw(e, sx, sy) { drawDino(sx, sy, e.dir < 0, e.flee ? (frame >> 2) & 1 : (frame >> 5) & 1); } };
}
function dinoLost() { PL.dino = 0; ENTS.push(makeDino(PL.x - 7, PL.y + PL.h - 18, -PL.face || 1)); quip('MY DINO!'); }
function drawDino(x, y, flip, f) {
  draw(XS.dino[f], x, y, XP.bf, flip);
  if (PL.dino && PL.tongue > 0 && Math.abs(x + 4 - (PL.x - 5 - camX)) < 8) { const len = (7 - Math.abs(PL.tongue - 7)) * 8, mx = flip ? x + 2 : x + 24; rectF(flip ? mx - len : mx, y + 6, len, 2, hex('#ff49b6')); }
}
function dinoTongue() {
  if (PL.tongue > 0) return true;
  PL.tongue = 14; sfx('tick');
  let best = null, bd = 60;
  for (const e of ENTS) if (e.foe && !e.dead && e.kind !== 'monitor') { const dx = (e.x + e.w / 2) - (PL.x + PL.w / 2); if (dx * PL.face > 0 && Math.abs(dx) < bd && Math.abs(e.y + e.h / 2 - PL.y - 8) < 24) { bd = Math.abs(dx); best = e; } }
  if (best) { hitFoe(best, 99, 'eat'); FX.push({ k: 'txt', s: 'GULP', x: best.x, y: best.y - 6, t: 40 }); }
  return true;
}
function drawShield(cx, cy) {
  const c = hex({ fire: '#ff9224', bubble: '#6dffff', zap: '#ffff49' }[PL.shield] || '#ffffff');
  for (let a = 0; a < 6.28; a += .2) if (((a * 5 | 0) + (frame >> 2)) & 1) rectF(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15, 2, 2, c);
}

// ---------------- the speed carts: momentum, rolling, spin dash, gliding, climbing, loops ----------------
function speedRun(dir) {
  if (RULES.spindash && PL.on && held.down && Math.abs(PL.vx) < 1.2 && !PL.roll) { // spin dash: hold down, tap B, let go
    PL.crouch = 1; PL.vx *= .8; if (pressed.b) { PL.rev = Math.min(8, PL.rev + 2.4); sfx('switch'); } return;
  }
  if (PL.crouch) { PL.crouch = 0; if (PL.rev > 0) { PL.vx = PL.face * (5 + PL.rev * .4); PL.roll = 1; PL.rev = 0; sfx('jump'); if (!RUN.saidDash) { RUN.saidDash = 1; quip('SPIN DASH. NORMAL.'); } } }
  if (PL.on && held.down && Math.abs(PL.vx) > 1.4 && !PL.roll) { PL.roll = 1; sfx('tick'); }
  if (PL.roll) { if (!PL.on) { PL.roll = 0; PL.ball = 1; } else { if (dir * PL.vx < 0) PL.vx += dir * .08; PL.vx *= .992; if (Math.abs(PL.vx) < .5) PL.roll = 0; } return; }
  const top = 4.4;
  if (dir) { PL.face = dir; if (PL.vx * dir < 0) PL.vx += dir * (PL.on ? .45 : .14); else if (Math.abs(PL.vx) < top) PL.vx = clamp(PL.vx + dir * (PL.on ? .1 : .14), -top, top); else PL.vx *= .996; }
  else PL.vx *= PL.on ? .975 : .995;
}
function bonusAir() { // jump again in the air
  if (RULES.knux && PL.jumped && !PL.glide && !PL.sprung) { PL.glide = 1; PL.ball = 0; PL.vy = Math.max(PL.vy, 0); PL.vx = PL.face * Math.max(1.5, Math.abs(PL.vx)); sfx('switch'); if (!RUN.saidGlide) { RUN.saidGlide = 1; quip('I CAN GLIDE NOW.'); } }
}
function bonusPre(dir) {
  if (PL.loop) { // around the loop at whatever speed you came in with
    const L = PL.loop, r = L.e.r - 10; L.a += L.sp / r;
    PL.x = L.e.cx + L.d * Math.sin(L.a) * r - PL.w / 2; PL.y = L.e.cy + Math.cos(L.a) * r - PL.h / 2;
    if (L.a >= Math.PI * 2) { PL.loop = null; PL.loopCD = 30; PL.x = L.e.cx - PL.w / 2 + L.d * 4; PL.y = L.e.cy + L.e.r - PL.h; PL.vx = L.d * L.sp; PL.vy = 0; PL.on = true; }
    tools(dir); return true;
  }
  if (PL.climb) {
    const d = PL.climb, tx = Math.floor((d > 0 ? PL.x + PL.w + 1 : PL.x - 1) / TS);
    const oy = PL.y; if (held.up) PL.y -= 1.2; if (held.down) PL.y += 1.2;
    if (boxHit(PL.x, PL.y, PL.w, PL.h, solidAt)) PL.y = oy;
    const hi = solidAt(tx, Math.floor((PL.y + 2) / TS)), lo = solidAt(tx, Math.floor((PL.y + PL.h - 2) / TS));
    if (pressed.b) { PL.climb = 0; PL.vx = -d * 2.6; PL.vy = -4.6; PL.face = -d; PL.ball = RULES.ball ? 1 : 0; PL.jumped = 1; sfx('jump'); }
    else if (!hi && lo) { // over the top
      let ty = Math.floor((PL.y + PL.h - 2) / TS); while (solidAt(tx, ty - 1)) ty--;
      const nx = tx * TS + (d > 0 ? 2 : TS - PL.w - 2), ny = ty * TS - PL.h;
      if (!boxHit(nx, ny, PL.w, PL.h, solidAt)) { PL.x = nx; PL.y = ny; PL.on = true; } PL.climb = 0;
    } else if (!lo || solidAt(Math.floor((PL.x + 5) / TS), Math.floor((PL.y + PL.h + 1) / TS))) PL.climb = 0;
    PL.vx = 0; PL.vy = 0; tools(dir); return true;
  }
  return false;
}
function bonusPost(dir) {
  if (PL.loopCD > 0) PL.loopCD--; if (PL.star > 0) PL.star--; if (PL.tongue > 0) PL.tongue--;
  if (PL.on) { const t = tileAt(Math.floor((PL.x + PL.w / 2) / TS), Math.floor((PL.y + PL.h + 1) / TS)); if (t === '}' || t === '{') { PL.vx = t === '}' ? 7.5 : -7.5; PL.face = Math.sign(PL.vx); if (frame % 6 === 0) sfx('tick'); } }
  for (const e of ENTS) {
    if (e.dead) continue;
    if (e.cd > 0) e.cd--;
    if (e.kind === 'loop') { if (!PL.loop && !PL.loopCD && PL.on && Math.abs(PL.vx) > 4.2 && Math.abs(PL.x + PL.w / 2 - e.cx) < 6 && Math.abs(PL.y + PL.h - e.cy - e.r) < 6) { PL.loop = { e, a: 0, d: Math.sign(PL.vx), sp: Math.abs(PL.vx) }; PL.ball = 1; sfx('jump'); if (!RUN.saidLoop) { RUN.saidLoop = 1; quip('LOOP. NORMAL.'); } } }
    else if (e.kind === 'bumper') { const dx = PL.x + 5 - e.x, dy = PL.y + 10 - e.y, d = Math.hypot(dx, dy) || 1; if (d < 19 && !(e.cd > 0)) { PL.vx = dx / d * 6; PL.vy = dy / d * 6 - 1; PL.on = false; PL.roll = 0; PL.ball = RULES.ball ? 1 : 0; e.cd = 12; e.fl = 10; sfx('stun'); RUN.bux++; } }
    else if (e.kind === 'dino' && !PL.dino && !e.flee && overlap(PL, e)) { PL.dino = 1; e.dead = 1; sfx('get'); if (!RUN.saidDino) { RUN.saidDino = 1; quip('LEGALLY DISTINCT.'); } }
  }
}
function bonusWorld() {
  for (const k in LV.sprung) if (--LV.sprung[k] <= 0) delete LV.sprung[k];
  if (PL.shield === 'zap') for (const e of ENTS) if (e.kind === 'bux' && !e.dead && !(e.life > 150)) { const dx = PL.x - e.x, dy = PL.y + 6 - e.y, d = Math.hypot(dx, dy); if (d < 90 && d > 2) { e.x += dx / d * 3; e.y += dy / d * 3; } }
  if (RULES.tales) { LV.hist.push([PL.x, PL.y, PL.face, PL.on || PL.dead ? 1 : 0]); if (LV.hist.length > 18) LV.hist.shift(); }
}
function drawSidekick() { // TALES. He follows you. He does nothing. He's very happy
  if (!RULES.tales || !LV.hist.length) return;
  const [x, y, face, on] = LV.hist[0];
  draw(XS.tales[on ? (frame >> 3) & 1 : (frame >> 1) & 1], x - 5 - face * 12 - camX, y + PL.h - 20 - camY - (on ? 0 : 4), XP.bf, face < 0);
}

// ---------------- goals: flagpole, goal tape, signpost, warp zone ----------------
const tapeY = e => e.y + 24 + (Math.sin(frame * .03) * .5 + .5) * (e.h - 56);
function goalSeq(e) {
  run(async () => {
    CUT = 1; BONG = null; PL.glide = PL.climb = PL.roll = PL.ball = 0; PL.loop = null;
    if (e.warp) { music(null); sfx('get'); banner('WARP ZONE: EVERY PIPE IS 1-4', 150); RUN.words += 6; await wait(110); }
    else if (e.style === 'flag') {
      const n = Math.max(1, 9 - Math.floor((PL.y - e.y) / TS)); addBux(n); FX.push({ k: 'txt', s: '+' + n, x: PL.x + 8, y: PL.y - 8, t: 70 }); music(null); sfx('get');
      PL.x = e.x - PL.w + 3; PL.vx = 0; PL.face = 1;
      while (PL.y + PL.h < e.y + e.h - 1) { PL.y = Math.min(PL.y + 2.5, e.y + e.h - PL.h); e.fy = Math.min(e.h - 30, PL.y - e.y); await nextFrame(); }
      await wait(20); PL.x += 10; PL.on = true;
      for (let i = 0; i < 70; i++) { PL.x += 1.4; PL.vx = 1.4; PL.anim += .3; await nextFrame(); }
      PL.vx = 0; e.inside = 1; await wait(30);
    } else if (e.style === 'tape') {
      if (Math.abs(PL.y + 10 - tapeY(e)) < 18) { addBux(5); FX.push({ k: 'txt', s: 'TAPE +5', x: PL.x, y: PL.y - 8, t: 70 }); }
      e.cut = 1; music(null); sfx('get');
      for (let i = 0; i < 60; i++) { PL.x += 1.2; PL.vx = 1.2; PL.anim += .25; PL.on = true; await nextFrame(); } PL.vx = 0; await wait(20);
    } else { e.spin = 70; PL.vx = 0; music(null); sfx('get'); while (e.spin > 0) { e.spin--; await nextFrame(); } e.done = 1; await wait(40); }
    LV.finish('clear');
  });
}
function drawGoal2(e, sx, sy) {
  if (e.style === 'flag') {
    rectF(sx + 3, sy, 2, e.h, hex('#92ff49')); circF(sx + 4, sy, 3, hex('#24b624'));
    const fy = sy + 6 + (e.fy || 0); triF(sx + 3, fy, sx - 15, fy + 7, sx + 3, fy + 13, WHITE); text('C', sx - 7, fy + 3, hex('#db2424'), 0);
    draw(TILES2.u, sx - 4, sy + e.h - 16, XP.blk);
    const cx = sx + 5 * TS, cy = sy + e.h - 64; // the castle at the end. Linda isn't in it either
    rectF(cx, cy + 24, 64, 40, hex('#b64900')); rectF(cx + 12, cy, 40, 26, hex('#b64900')); for (let i = 0; i < 5; i++) { rectF(cx + i * 14, cy + 18, 8, 6, hex('#b64900')); rectF(cx + 12 + i * 9, cy - 6, 5, 6, hex('#b64900')); }
    rectF(cx + 24, cy + 40, 16, 24, BLACK); circF(cx + 32, cy + 40, 8, BLACK); rectF(cx + 20, cy + 6, 6, 10, BLACK); rectF(cx + 38, cy + 6, 6, 10, BLACK);
    for (let y = cy + 30; y < cy + 64; y += 8) rectF(cx, y, 64, 1, hex('#6d2400'));
  } else if (e.style === 'tape') {
    for (const px of [sx - 28, sx + 14]) { rectF(px, sy, 6, e.h, hex('#ffdb92')); rectF(px + 4, sy, 2, e.h, hex('#b6926d')); rectF(px - 1, sy, 8, 3, hex('#6d4924')); }
    if (!e.cut) { const ty = tapeY(e) - camY; rectF(sx - 22, ty, 36, 4, hex('#ff9224')); rectF(sx - 22, ty, 36, 1, hex('#ffdb24')); }
  } else {
    const py = sy + e.h - 44, w = e.spin > 0 ? Math.abs(Math.cos(e.spin * .35)) * 26 : 26, face = e.done || (e.spin > 0 && Math.cos(e.spin * .175) < 0);
    rectF(sx + 3, py + 20, 2, 24, hex('#6d6d6d'));
    rectF(sx + 4 - w / 2, py - 4, w, 26, hex('#2449db')); rectF(sx + 4 - w / 2 + 2, py - 2, Math.max(0, w - 4), 22, face ? hex('#ffdb24') : hex('#db2424'));
    if (w > 16) text(face ? 'C' : '$', sx + 1, py + 6, face ? hex('#2449db') : WHITE, 0);
  }
}

// ---------------- level entities by map character ----------------
function drawLoop(e) {
  for (let a = 0; a < 6.28; a += .045) { const k = ((a * 8) | 0) & 1; for (const [rr, c] of [[e.r + 3, k ? '#6d3600' : '#b66d24'], [e.r - 1, k ? '#ffb649' : '#b66d24']]) rectF(e.cx + Math.sin(a) * rr - camX - 1, e.cy + Math.cos(a) * rr - camY - 1, 3, 3, hex(c)); }
}
const BONUS_ENTS = {
  Q: (wx, wy) => ({ kind: 'loop', cx: wx + 8, cy: wy + 16 - 48, r: 48, x: wx, y: wy, draw: drawLoop }),
  '*': (wx, wy) => ({ kind: 'bumper', x: wx + 8, y: wy + 8, cd: 0, fl: 0, draw(e) { const r = 9 + (e.fl > 0 ? 2 : 0); if (e.fl > 0) e.fl--; circF(e.x - camX, e.y - camY, r, hex('#2449db')); circF(e.x - camX, e.y - camY, r - 3, hex(e.fl > 0 ? '#ffffff' : '#ff49db')); circF(e.x - camX, e.y - camY, 3, hex('#ffdb24')); } }),
  M: (wx, wy, x, y, def) => makeMonitor(wx, wy, (def.items || {})[x + ',' + y] || 'bux10'),
  Y: (wx, wy) => makeDino(wx - 4, wy - 2, 0),
  A: (wx, wy) => ({ kind: 'axe', x: wx + 1, y: wy - 2, w: 14, h: 18, draw(e, sx, sy) { draw(XS.axe, sx, sy + Math.sin(frame * .1), XP.bb); } }),
  '%': (wx, wy, x) => ({ kind: 'firebar', x: wx + 8, y: wy + 8, a: x * .7, n: 5, keep: 'u',
    upd(e) { e.a += .032; if (!PL.dead) for (let i = 1; i <= e.n; i++) { const fx = e.x + Math.cos(e.a) * i * 8, fy = e.y + Math.sin(e.a) * i * 8; if (Math.abs(PL.x + 5 - fx) < 8 && Math.abs(PL.y + 10 - fy) < 12 && PL.shield !== 'fire') ouch(1, 'fire', fx); } return 1; },
    draw(e) { for (let i = 1; i <= e.n; i++) draw(XS.flame[(frame >> 2) % 3], e.x + Math.cos(e.a) * i * 8 - 5 - camX, e.y + Math.sin(e.a) * i * 8 - 5 - camY, XP.bong); } }),
};
// monitors are "foes" so the bong and the spin can break them; touching one never hurts
const MON_ICON = { bux10: ['$', '#ffdb24'], fire: ['F', '#ff9224'], bubble: ['O', '#6dffff'], zap: ['Z', '#ffff49'], '1up': ['C', '#2449db'], star: ['*', '#ffdb24'] };
function makeMonitor(wx, wy, item) {
  return { foe: 1, kind: 'monitor', x: wx, y: wy - 2, w: 16, h: 18, hp: 1, hpMax: 1, dir: 1, t: 0, flash: 0, vy: 0, item, ai() {},
    touch(e) { if (PL.ball || PL.roll || PL.loop || PL.star > 0 || (PL.vy > 1 && PL.y + PL.h - e.y < 10)) { hitFoe(e, 9, 'pop'); if (!PL.on) PL.vy = held.b ? -5 : -3.5; } return true; },
    onDie(e) { giveItem(e.item); },
    draw(e, sx, sy) { draw(XS.monitor, sx, sy, XP.bf); const [ch, c] = MON_ICON[e.item] || ['?', '#ffffff']; if ((frame >> 3) % 4) text(ch, sx + 5, sy + 3, hex(c), 0); } };
}
function giveItem(it) {
  if (it === 'bux10') addBux(10);
  else if (it === '1up') { RUN.lives++; sfx('get'); FX.push({ k: 'txt', s: '1UP', x: PL.x - 4, y: PL.y - 10, t: 60 }); }
  else if (it === 'star') { PL.star = 480; sfx('get'); }
  else { PL.shield = it; sfx('get'); quip({ fire: 'FIRE SHIELD. AND A LIGHTER.', bubble: 'BUBBLE. I CAN BREATHE.', zap: 'ZAP. FREE MONEY.' }[it]); }
}

// ---------------- foes ----------------
function walkStep(e, sp) {
  const nx = e.x + e.dir * sp, fx = e.dir > 0 ? nx + e.w : nx, footY = Math.floor((e.y + e.h + 2) / TS);
  const wall = solidAt(Math.floor(fx / TS), Math.floor((e.y + e.h - 4) / TS)), ledge = !solidAt(Math.floor(fx / TS), footY) && tileAt(Math.floor(fx / TS), footY) !== '=';
  if (wall || ledge) e.dir = -e.dir; else e.x = nx;
}
const simpleDraw = (S, P) => (e, sx, sy, f, fl, tn) => draw(S[f], sx - (S[f].w - e.w) / 2, sy - (S[f].h - e.h), P, fl, tn);
XS.pellet = outline(spr(6, 6, g => { g.e(3, 3, 2.6, 2.6, 8); g.p(2, 2, 3); }), 15);
XS.fireball = outline(spr(14, 8, g => { g.e(9, 4, 4.5, 3.5, 9); g.e(10, 4, 3, 2.2, 8); g.e(11, 4, 1.5, 1, 10); g.line(0, 4, 5, 2, 9); g.line(0, 5, 5, 6, 8); }), 1);
function shellAI(e) {
  if (e.kick > 0) e.kick--;
  if (!e.sv) return;
  const nx = e.x + e.sv; if (solidAt(Math.floor((e.sv > 0 ? nx + e.w : nx) / TS), Math.floor((e.y + e.h - 4) / TS))) { e.sv = -e.sv; sfx('land'); } else e.x = nx;
  if (!solidAt(Math.floor((e.x + e.w / 2) / TS), Math.floor((e.y + e.h + 1) / TS))) e.y += 3; else e.y = Math.floor((e.y + e.h + 1) / TS) * TS - e.h;
  if (e.y > LV.h * TS) e.dead = 1;
  for (const f of ENTS) if (f.foe && f !== e && !f.dead && f.kind !== 'monitor' && overlap(e, f)) hitFoe(f, 9, 'shell');
}
function troopaTouch(e) {
  const stomp = PL.vy > 1 && PL.y + PL.h - e.y < 10;
  if (!e.shell) { if (stomp && PL.star <= 0) { Object.assign(e, { shell: 1, sv: 0, y: e.y + 8, h: 14, walk: 0, ai: shellAI, draw: (o, sx, sy, f, fl, tn) => draw(XS.shell, sx - 1, sy, XP.bf, false, tn) }); PL.vy = held.b ? -6 : -4; sfx('jump'); return true; } return false; }
  if (!e.sv) { e.sv = PL.x + PL.w / 2 < e.x + e.w / 2 ? 4.5 : -4.5; e.kick = 18; sfx('stun'); if (stomp) PL.vy = -4; return true; }
  if (stomp) { e.sv = 0; PL.vy = -4; sfx('jump'); return true; }
  return e.kick > 0;
}
Object.assign(FOES, {
  n: { kind: 'goonba', w: 14, h: 14, hp: 1, sp: .5, walk: 1, draw: simpleDraw(XS.goonba, XP.bf) },
  q: { kind: 'troopa', w: 14, h: 22, hp: 2, sp: .45, walk: 1, touch: troopaTouch, draw: simpleDraw(XS.troopa, XP.bf) },
  h: { kind: 'ghost', w: 16, h: 16, hp: 1, spiky: 1,
    ai(e) { const facing = PL.face === (Math.sign(e.x - PL.x) || 1); e.shy = facing; e.dir = Math.sign(PL.x - e.x) || 1;
      if (!facing && Math.abs(PL.x - e.x) < 220) { const dx = PL.x - e.x, dy = PL.y + 4 - e.y, d = Math.hypot(dx, dy) || 1; e.x += dx / d * .6; e.y += dy / d * .6; } },
    draw: (e, sx, sy, f, fl, tn) => draw(XS.ghost[e.shy ? 1 : 0], sx - 1, sy - 1 + Math.sin(e.t * .05) * 2, XP.bf, fl, tn) },
  z: { kind: 'motobux', w: 18, h: 14, hp: 1, sp: .95, walk: 1, draw: simpleDraw(XS.motobux, XP.bf) },
  x: { kind: 'buzzer', w: 20, h: 10, hp: 1,
    ai(e) { e.x = e.bx + Math.sin(e.t * .015) * 60; e.dir = Math.cos(e.t * .015) > 0 ? 1 : -1; e.y = e.by + Math.sin(e.t * .05) * 3;
      if (e.t % 130 === 0 && Math.abs(PL.x - e.x) < 170) { SHOTS.push({ x: e.x + e.w / 2, y: e.y + e.h, w: 6, h: 6, vx: Math.sign(PL.x - e.x) * 1.4, vy: 1.6, t: 200, bongable: 1, burn: 1, spr: XS.pellet, P: XP.bf }); sfx('tick'); } },
    draw: simpleDraw(XS.buzzer, XP.bf) },
  c: { kind: 'crab', w: 22, h: 14, hp: 2,
    ai(e) { walkStep(e, .3); if (e.t % 160 === 80 && Math.abs(PL.x - e.x) < 200) { for (const d of [-1, 1]) SHOTS.push({ x: e.x + e.w / 2 + d * 10, y: e.y, w: 6, h: 6, vx: d * 1.3, vy: -4.6, ay: .15, t: 160, bongable: 1, burn: 1, spr: XS.pellet, P: XP.bf }); sfx('tick'); } },
    draw: simpleDraw(XS.crab, XP.bf) },
});

// ---------------- bosses ----------------
// hitting a boss by landing on it / rolling into it (carts with the ball rule); otherwise touching it hurts
function bossTouch(B, hb, canBump) {
  if (B.bcd > 0) B.bcd--;
  if (PL.dead || B.dying || !overlap(PL, hb)) return;
  const atk = PL.star > 0 || ((PL.ball || PL.roll) && RULES.ball) || (PL.vy > 1.5 && PL.y + PL.h - hb.y < 12);
  if (atk && canBump) { if (!(B.bcd > 0)) { B.bcd = 30; B.hit({ bump: 1 }); } PL.vy = -5; PL.vx = (Math.sign(PL.x + 5 - hb.x - hb.w / 2) || -1) * 2.6; PL.roll = 0; PL.ball = RULES.ball ? 1 : 0; return; }
  ouch(1, 'boss', hb.x + hb.w / 2);
}
const clink = b => { sfx('land'); if (b && b.x !== undefined && !FX.some(f => f.s === 'CLINK')) FX.push({ k: 'txt', s: 'CLINK', x: b.x - 10, y: b.y, t: 40 }); };
Object.assign(BOSSES, {
  // ---------------- SUPER CARL BROS.: KING BOSSER. Bong him, or go around him and take the axe ----------------
  bosser() {
    const x0 = ARENA.x0, floor = 12 * TS, at = LV.def.boss.at;
    const B = { name: 'KING BOSSER', hp: 10, max: 10, x: x0 + 12 * TS, y: floor - 34, w: 30, h: 34, dir: -1, t: 0, flash: 0, vy: 0, mouth: 0, home: x0 + 12 * TS, low: 0,
      hitbox() { return this.dying || this.fall ? none : { x: this.x + 4, y: this.y + 2, w: this.w - 8, h: this.h - 2 }; },
      hit() { if (this.fall) return; this.hp--; bossHitFlash(this); if (this.hp === 5) quip('YOU\'RE FIRED.', this); if (this.hp <= 0) bossDown(this, async () => { quip('SEE HR.'); openArena(); }); },
      fire(z) { if (!this.dying && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      collapse() { // the axe: the bridge goes, and so does he
        this.fall = 1; run(async () => { CUT = 1; music(null); sfx('alert');
          for (let tx = at + 18; tx > at; tx--) if (LV.g[12][tx] === 'B') { LV.g[12][tx] = '.'; sfx('tick'); FX.push({ k: 'puff', x: tx * TS + 8, y: floor + 4, t: 20 }); await wait(3); }
          this.vy = -2; await wait(50); BOSS = null; quip('BRIDGE OUT.'); openArena(); CUT = 0; });
      },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--; if (this.mouth > 0) this.mouth--;
        if (this.fall) { this.vy += .3; this.y += this.vy; return; }
        const axe = ENTS.find(e => e.kind === 'axe' && !e.dead);
        if (axe && !PL.dead && overlap(PL, axe)) { axe.dead = 1; return this.collapse(); }
        this.dir = PL.x < this.x + 15 ? -1 : 1;
        this.x += clamp(this.home + Math.sin(this.t * .012) * 3 * TS - this.x, -.8, .8);
        this.vy += .3; this.y += this.vy; const fy = Math.floor((this.y + this.h) / TS);
        if (this.vy > 0 && solidAt(Math.floor((this.x + this.w / 2) / TS), fy)) { this.y = fy * TS - this.h; this.vy = 0; if (this.t % 150 > 140) this.vy = -6; }
        if (this.y > LV.h * TS) { this.fall = 1; return; }
        if (this.t % (this.hp < 5 ? 80 : 110) === 40) { this.mouth = 20; this.low = !this.low; SHOTS.push({ x: this.x + (this.dir > 0 ? this.w : -14), y: this.low ? floor - 15 : floor - 42, w: 14, h: 8, vx: this.dir * 1.9, vy: 0, t: 300, fire: 1, solid: 0, spr: XS.fireball, P: XP.bong }); sfx('crash'); }
        bossTouch(this, this.hitbox(), false);
      },
      draw() { draw(XS.bosser[this.mouth > 0 ? 2 : (this.t >> 4) & 1], this.x - camX, this.y - camY, XP.bb, this.dir < 0, this.flash & 2 ? WHITE : 0); },
    };
    return B;
  },
  // ---------------- SUPER CARL WORLD: THE INTERN. Hops, throws memos. Stomp him and he spins in his shell ----------------
  intern() {
    const x0 = ARENA.x0, floor = 12 * TS;
    const B = { name: 'THE INTERN', hp: 8, max: 8, x: x0 + 14 * TS, y: floor - 24, w: 20, h: 24, dir: -1, t: 0, flash: 0, vy: 0, vx: 0, st: 'hop', hops: 0, sv: 0,
      hitbox() { return this.dying ? none : this.st === 'shell' ? { x: this.x + 2, y: this.y + 10, w: 16, h: 14 } : { x: this.x + 2, y: this.y + 2, w: 16, h: 22 }; },
      hit(b) {
        if (this.st === 'shell') return clink(b);
        this.hp -= b && b.bump ? 2 : 1; bossHitFlash(this);
        if (b && b.bump) { this.st = 'shell'; this.t = 0; this.sv = PL.x + 5 < this.x + 10 ? 3.6 : -3.6; }
        if (this.hp <= 0) bossDown(this, async () => { quip('UNPAID. UNBOTHERED.'); openArena(); });
      },
      fire(z) { if (!this.dying && this.st !== 'shell' && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const L = x0 + 16, R = x0 + 18 * TS - this.w;
        if (this.st === 'shell') {
          this.x += this.sv; if (this.x < L || this.x > R) { this.x = clamp(this.x, L, R); this.sv = -this.sv; sfx('land'); }
          if (this.t > 110) { this.st = 'hop'; this.t = 0; this.vy = -4; }
        } else {
          this.dir = PL.x < this.x + 10 ? -1 : 1;
          this.vy += .3; this.y += this.vy; this.x = clamp(this.x + this.vx, L, R);
          if (this.y >= floor - this.h) { this.y = floor - this.h; this.vy = 0; this.vx = 0;
            if (this.t % 50 === 0) { this.vy = -6.5; this.vx = clamp((PL.x - this.x) / 45, -2.2, 2.2); this.hops++;
              if (this.hops % 3 === 0) { SHOTS.push({ x: this.x + 6, y: this.y + 6, w: 14, h: 10, vx: this.dir * 1.7, vy: 0, t: 220, spr: XS.para, P: XP.foe, burn: 1, bongable: 1 }); sfx('tick'); } } }
        }
        if (this.st === 'shell') this.y = floor - this.h;
        bossTouch(this, this.hitbox(), this.st !== 'shell');
      },
      draw() { const fl = this.flash & 2 ? WHITE : 0; if (this.st === 'shell') draw(XS.shell, this.x + 2 - camX, this.y + 10 - camY, XP.bf, (frame >> 2) & 1, fl); else draw(XS.intern[this.vy ? 1 : (this.t >> 4) & 1], this.x - 1 - camX, this.y - camY, XP.bb, this.dir < 0, fl); },
    };
    return B;
  },
  // ---------------- CARL THE HEDGECARL: DR. ROBUXNIK. A pod and a wrecking ball. Jump into the pod ----------------
  robux() {
    const x0 = ARENA.x0, floor = 12 * TS;
    const B = { name: 'DR. ROBUXNIK', hp: 8, max: 8, x: x0 + 9 * TS, y: floor - 96, w: 40, h: 34, dir: 1, t: 0, flash: 0, ba: 0,
      hitbox() { return this.dying ? none : { x: this.x + 4, y: this.y + 14, w: 32, h: 20 }; },
      ball() { const cx = this.x + 20 + Math.sin(this.ba) * 64, cy = this.y + 30 + Math.cos(this.ba) * 64; return { x: cx - 9, y: cy - 9, w: 18, h: 18, cx, cy }; },
      hit() { this.hp--; bossHitFlash(this); if (this.hp === 4) quip('THAT\'S BILLABLE.', this); if (this.hp <= 0) bossDown(this, async () => { quip('HE BILLED ME.'); openArena(); }); },
      fire(z) { if (!this.dying && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const sp = this.hp > 4 ? .7 : 1.1; this.x += this.dir * sp; if (this.x < x0 + 2 * TS || this.x > x0 + 16 * TS) this.dir = -this.dir;
        this.ba = Math.sin(this.t * (this.hp > 4 ? .028 : .036)) * 1.25;
        const b = this.ball(); if (!PL.dead && overlap(PL, b) && PL.star <= 0) ouch(1, 'ball', b.cx);
        bossTouch(this, this.hitbox(), true);
      },
      draw() {
        const b = this.ball(), ax = this.x + 20, ay = this.y + 30;
        for (let i = 1; i < 8; i++) circF(ax + (b.cx - ax) * i / 8 - camX, ay + (b.cy - ay) * i / 8 - camY, 2, hex('#6d6d6d'));
        circF(b.cx - camX, b.cy - camY, 10, hex('#242424')); for (let j = -8; j < 8; j += 4) for (let i = -8; i < 8; i += 4) if ((((i + j) >> 2) & 1) && i * i + j * j < 70) rectF(b.cx + i - camX, b.cy + j - camY, 4, 4, hex('#dbdbdb'));
        draw(XS.robux[(this.t >> 3) & 1], this.x - camX, this.y - camY, XP.bb, false, this.flash & 2 ? WHITE : 0);
      },
    };
    return B;
  },
  // ---------------- HEDGECARL 2: MECHA HU-MAN. Runs, leaps, spin dashes into walls ----------------
  mecha() {
    const x0 = ARENA.x0, floor = 12 * TS, S = carlSet(OUTFITS.find(o => o.id === 'metal'));
    const B = { name: 'MECHA HU-MAN', hp: 12, max: 12, x: x0 + 15 * TS, y: floor - 44, w: 22, h: 44, dir: -1, st: 'run', t: 0, flash: 0, vy: 0, vx: 0,
      hitbox() { if (this.dying) return none; const low = this.st === 'dash' || this.st === 'rev'; return { x: this.x, y: this.y + (low ? 14 : 0), w: this.w, h: low ? 30 : this.h }; },
      hit(b) { if (this.st === 'dash') return clink(b); this.hp -= this.st === 'dizzy' ? 2 : 1; bossHitFlash(this); if (this.hp <= 6 && !this.said) { this.said = 1; quip('I AM THE REAL ONE.', this); } if (this.hp <= 0) bossDown(this, async () => { quip('NOT A REAL HU-MAN.'); openArena(); }); },
      fire(z) { if (!this.dying && this.st !== 'dash' && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const L = x0 + 16, R = x0 + 18 * TS - this.w, s = this.st;
        if (s === 'run') { this.dir = PL.x < this.x + 11 ? -1 : 1; this.x = clamp(this.x + this.dir * 1.5, L, R); if (this.t > 80) { this.t = 0; this.st = Math.random() < .55 ? 'rev' : 'leap'; } }
        else if (s === 'rev') { if (this.t % 8 === 0) sfx('switch'); if (this.t > 42) { this.st = 'dash'; this.t = 0; this.vx = this.dir * 7.2; } }
        else if (s === 'dash') { this.x += this.vx; if (this.x < L || this.x > R) { this.x = clamp(this.x, L, R); this.st = 'dizzy'; this.t = 0; sfx('crash'); post.shake = 3; SHAKE = 12; } }
        else if (s === 'dizzy') { if (this.t > 80) { this.st = 'run'; this.t = 0; } }
        else if (s === 'leap') { if (this.t === 1) { this.vy = -7.5; this.tx = PL.x; } this.vy += .3; this.y += this.vy; this.x = clamp(this.x + clamp(this.tx - this.x, -2.6, 2.6), L, R);
          if (this.y >= floor - this.h) { this.y = floor - this.h; this.vy = 0; this.st = 'run'; this.t = 0; sfx('crash'); post.shake = 2; SHAKE = 6; } }
        bossTouch(this, this.hitbox(), this.st !== 'dash' && this.st !== 'rev');
      },
      draw() {
        if (this.flash & 2) return;
        if (this.st === 'rev' || this.st === 'dash') drawScaled(S.ball[(frame >> 1) & 3], this.x - 7 - camX, this.y + 8 - camY, S.P, 2, this.dir < 0);
        else drawScaled(S[this.st === 'leap' ? 'jump' : this.st === 'dizzy' ? 'hurt' : 'run'][(this.t >> 3) & 3], this.x - 9 - camX, this.y - 8 - camY, S.P, 2, this.dir < 0);
        if (this.st === 'dizzy') for (let i = 0; i < 3; i++) text('*', this.x + 6 + Math.cos(frame * .1 + i * 2) * 10 - camX, this.y - 8 + Math.sin(frame * .1 + i * 2) * 3 - camY, hex('#ffdb24'));
      },
    };
    return B;
  },
  // ---------------- CARL 3 & KNUCKLEHEAD: KNUCKLEHEAD. Punches, glides, climbs the wall and drops on you ----------------
  knux() {
    const x0 = ARENA.x0, floor = 12 * TS;
    const B = { name: 'KNUCKLEHEAD', hp: 12, max: 12, x: x0 + 15 * TS, y: floor - 32, w: 22, h: 32, dir: -1, st: 'walk', t: 0, flash: 0, vy: 0, vx: 0, gl: 0, ph: 0,
      hitbox() { return this.dying ? none : { x: this.x + 2, y: this.y, w: this.w - 4, h: this.h }; },
      hit(b) {
        if (this.st === 'punch' && this.t > 18 && b && !b.bump) { sfx('land'); if (!FX.some(f => f.s === 'BLOCKED')) FX.push({ k: 'txt', s: 'BLOCKED', x: this.x, y: this.y - 8, t: 40 }); return; }
        this.hp--; bossHitFlash(this); if (this.hp === 8) quip('I WAS TRICKED.', this); if (this.hp === 4) quip('BY LINDA.', this);
        if (this.hp <= 0) bossDown(this, async () => { quip('SHE TRICKED ME TOO.'); openArena(); });
      },
      fire(z) { if (!this.dying && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const L = x0 + 16, R = x0 + 18 * TS - this.w, s = this.st, grounded = this.y >= floor - this.h - .5;
        if (s === 'walk') { this.dir = PL.x < this.x + 11 ? -1 : 1; this.x = clamp(this.x + this.dir * 1.1, L, R); if (this.t > 70) { this.t = 0; this.st = ['punch', 'glide', 'climb'][(Math.random() * 3) | 0]; this.ph = 0; } }
        else if (s === 'punch') { if (this.t < 20) this.x += (this.t & 2) ? 1 : -1; else if (this.t < 52) this.x = clamp(this.x + this.dir * 6, L, R); else { this.st = 'walk'; this.t = 0; } }
        else if (s === 'glide') {
          if (this.t === 1) { this.vy = -8; this.gl = 0; }
          if (this.gl) { this.vy = .55; this.x += this.dir * 2.6; if (Math.abs(PL.x - this.x) < 14 || this.x <= L || this.x >= R) { this.gl = 0; this.vy = 5; this.dropped = 1; } }
          else if (this.vy > 0 && !this.dropped) { this.gl = 1; this.dir = PL.x < this.x ? -1 : 1; }
          if (!this.gl) this.vy += .3; this.y += this.vy; this.x = clamp(this.x, L, R);
          if (this.y >= floor - this.h) { this.y = floor - this.h; this.vy = 0; this.dropped = 0; this.st = 'walk'; this.t = 0; sfx('crash'); post.shake = 2; SHAKE = 6; }
        } else if (s === 'climb') {
          if (this.ph === 0) { const w = this.x - L < R - this.x ? L : R; this.dir = w === L ? -1 : 1; this.x += clamp(w - this.x, -2.4, 2.4); if (Math.abs(this.x - w) < 1) this.ph = 1; }
          else if (this.ph === 1) { this.y -= 2; if (this.y <= floor - 140) { this.ph = 2; this.vy = -2; this.vx = (PL.x > this.x ? 1 : -1) * 3.2; this.dir = Math.sign(this.vx); } }
          else { this.vy += .3; this.y += this.vy; this.x = clamp(this.x + this.vx, L, R); if (this.y >= floor - this.h) { this.y = floor - this.h; this.vy = 0; this.st = 'walk'; this.t = 0; sfx('crash'); post.shake = 3; SHAKE = 8; } }
        }
        if (!grounded && s === 'walk') this.y = Math.min(floor - this.h, this.y + 4);
        bossTouch(this, this.hitbox(), true);
      },
      draw() { const f = this.st === 'punch' && this.t > 18 || this.gl ? 2 : this.st === 'climb' && this.ph === 1 ? (this.t >> 3) & 1 : (this.t >> 4) & 1; draw(XS.knux[f], this.x - 3 - camX, this.y - camY, XP.bb, this.st === 'climb' && this.ph === 1 ? this.dir > 0 : this.dir < 0, this.flash & 2 ? WHITE : 0); },
    };
    return B;
  },
});

// ---------------- the levels ----------------
// legend (on top of the main one): ? block (def.items 'x,y' -> '$' '+' 'X' '1' '*' 'F'), b brick, u used block, P pipe,
// s spring, } { dash pads, Z cracked rock (roll/dash through), B bridge, Q loop (bottom tile), * bumper, M monitor (items),
// Y dino, A axe, % firebar. Foes: n goonba, q troopa, h shy ghost, z motobux, x buzzer, c crab.
const SMB = { blocks: 1 }, SON1 = { speed: 1, ball: 1, rings: 1 }, SON2 = { speed: 1, ball: 1, rings: 1, spindash: 1, tales: 1 }, SON3 = { speed: 1, ball: 1, rings: 1, spindash: 1, knux: 1 };
const stairs = (b, x, n, dir = 1) => { for (let i = 0; i < n; i++) b.fill(x + i, x + i, dir > 0 ? 11 - i : 12 - n + i, 11, '#'); return b; };
LEVELS.push(
  // ======== SUPER CARL BROS. ========
  { id: 'smb1', camp: 'smb', tag: '1-1', name: 'WORLD 1-1', theme: 'smb', outfit: 'eight', card: 'nes', rules: SMB, goal: 'flag',
    items: { '14,9': '+', '20,5': '1', '77,9': 'X', '78,5': '*', '96,9': 'F' },
    build() {
      const b = LB(200);
      b.ground(0, 68).put(3, 11, '@').put(14, 9, '?').row(18, 9, 'b?b?b').put(20, 5, '?').put(16, 11, 'n').put(30, 11, 'n');
      b.fill(25, 26, 10, 11, 'P').fill(34, 35, 9, 11, 'P').put(38, 11, 'n').put(40, 11, 'n').fill(44, 45, 9, 11, 'P').put(50, 11, 'q').fill(55, 56, 9, 11, 'P').put(60, 11, 'C');
      b.ground(72, 100).row(76, 9, 'b?b').row(76, 5, 'bb?b').put(84, 11, 'n').put(86, 11, 'n').put(92, 11, 'q').row(94, 9, '?b?').row(73, 10, '$$$');
      b.ground(103, 113).ground(116, 150); stairs(b, 110, 4); stairs(b, 116, 4, -1);
      b.put(124, 11, 'n').put(126, 11, 'n').put(128, 11, 'C').fill(132, 133, 9, 11, 'P').row(138, 9, 'bb?b').put(141, 11, 'n').put(144, 11, 'q');
      b.ground(151, 199); stairs(b, 160, 8); b.put(177, 11, 'E');
      return b;
    } },
  { id: 'smb2', camp: 'smb', tag: '1-2', name: 'WORLD 1-2', theme: 'smbu', outfit: 'eight', card: 'nes', rules: SMB, items: { '25,9': '+', '63,9': '1', '88,9': '+' },
    build() {
      const b = LB(180);
      b.ground(0, 43).put(2, 11, '@').fill(12, 175, 2, 3, '#').fill(7, 7, 10, 11, '#').fill(8, 8, 8, 11, '#').fill(9, 9, 6, 11, '#').fill(10, 10, 4, 11, '#');
      b.row(14, 1, '$$$$$$$$$$').row(60, 1, '$$$$$$$$$$').row(120, 1, '$$$$$$$$$$').put(170, 1, 'E'); // the roof. Everyone knows about the roof
      b.put(18, 11, 'n').put(20, 11, 'n').row(24, 9, 'b?b?b').put(30, 11, 'q').fill(36, 37, 9, 11, 'P').put(40, 11, 'n');
      b.ground(47, 90).row(50, 9, 'bbbbb').row(50, 8, '$$$$$').put(53, 11, 'n').put(58, 11, 'C').put(63, 9, '?').fill(70, 71, 9, 11, 'P').put(76, 11, 'q').put(80, 11, 'n').put(82, 11, 'n').row(86, 9, 'bb??bb');
      b.ground(94, 179).put(100, 11, 'C').fill(106, 107, 10, 11, 'P').put(110, 11, 'n').put(112, 11, 'n').row(118, 9, '?bbb?').put(124, 11, 'q').put(130, 11, 'n').fill(136, 137, 9, 11, 'P').put(142, 11, 'n').put(146, 11, 'q').put(152, 11, 'n');
      b.fill(160, 161, 9, 11, 'P').put(172, 11, 'E');
      return b;
    } },
  { id: 'smb3', camp: 'smb', tag: '1-4', name: 'WORLD 1-4', theme: 'smbc', card: 'nes', rules: SMB, boss: { id: 'bosser', at: 120 },
    build() {
      const b = LB(150);
      b.ground(0, 20).put(2, 11, '@').put(12, 8, '%');
      b.ground(24, 40).fill(28, 28, 9, 11, '#').put(34, 7, '%').row(30, 8, '$$$');
      b.ground(44, 60).put(46, 11, 'C').put(53, 8, '%').put(57, 11, 'q');
      b.plat(62, 64, 9).plat(67, 69, 7).row(67, 6, '$$$');
      b.ground(71, 119).put(80, 8, '%').put(85, 11, 'q').put(90, 8, '%').put(96, 11, 'C').put(104, 11, 'n').put(108, 11, 'n');
      b.ground(120, 122).fill(123, 135, 12, 12, 'B').ground(136, 149).put(137, 11, 'A').put(146, 11, 'E');
      return b;
    } },
  // ======== SUPER CARL WORLD ========
  { id: 'smw1', camp: 'smw', tag: '1', name: 'DINO ISLAND', theme: 'smw', outfit: 'cape', rules: SMB, goal: 'tape', items: { '14,9': '+', '104,9': '1', '140,9': '*' },
    build() {
      const b = LB(200);
      b.ground(0, 40).put(3, 11, '@').put(9, 11, 'Y').put(14, 9, '?').put(18, 11, 'n').put(24, 11, 'q').row(28, 9, '??').plat(32, 35, 9).row(32, 8, '$$$$');
      b.ground(44, 80).put(48, 11, 'q').put(52, 11, 'n').put(55, 11, 'n').plat(58, 62, 9).plat(64, 68, 6).put(66, 5, 'X').row(58, 8, '$$$$$').put(72, 11, 'C');
      b.ground(84, 130).fill(90, 91, 9, 11, 'P').put(95, 11, 'n').put(100, 11, 'q').put(104, 9, '?').put(110, 11, 'q').put(112, 11, 'q').put(114, 11, 'n').put(118, 11, 'C');
      b.ground(134, 199).put(140, 9, '?').put(145, 11, 'n').put(147, 11, 'n').put(149, 11, 'n').put(155, 11, 'q').row(160, 9, '$$$$$').put(166, 11, 'n').put(185, 11, 'E');
      return b;
    } },
  { id: 'smw2', camp: 'smw', tag: '2', name: 'GHOST HOUSE', theme: 'ghost', rules: SMB, items: { '30,9': '+', '84,9': '+' },
    build() {
      const b = LB(170);
      b.ground(0, 169).put(2, 11, '@').put(14, 7, 'h').plat(18, 24, 9).row(18, 8, '$$$$$$$').put(26, 5, 'h').put(30, 9, '?').fill(40, 41, 11, 11, '^').put(45, 6, 'h').put(50, 9, 'h').put(56, 11, 'C');
      b.plat(60, 64, 9).plat(66, 70, 6).plat(72, 76, 3).row(72, 2, '$$$$$').put(70, 4, 'h').put(80, 8, 'h').put(84, 9, '?').put(86, 5, 'h').fill(90, 91, 11, 11, '^').put(100, 11, 'C');
      b.put(108, 7, 'h').put(112, 9, 'h').put(118, 5, 'h').plat(124, 128, 9).row(124, 8, '$$$$$').fill(132, 133, 11, 11, '^').put(140, 6, 'h').put(146, 8, 'h').put(160, 11, 'E');
      return b;
    } },
  { id: 'smw3', camp: 'smw', tag: '3', name: 'CASTLE #1', theme: 'smwc', rules: SMB, boss: { id: 'intern', at: 100 },
    build() {
      const b = LB(126);
      b.ground(0, 30).put(2, 11, '@').put(10, 8, '%').fill(16, 17, 9, 11, '#').put(22, 7, '%');
      b.ground(34, 60).put(38, 11, 'q').put(46, 8, '%').put(50, 11, 'n').put(55, 11, 'C');
      b.ground(64, 125).put(70, 8, '%').put(78, 8, '%').put(84, 11, 'q').put(92, 11, 'C').put(122, 11, 'E');
      return b;
    } },
  // ======== CARL THE HEDGECARL ========
  { id: 'son1a', camp: 'son1', tag: '1', name: 'GREEN HELL', theme: 'ghz', outfit: 'speedy', card: 'zone', rules: SON1, goal: 'sign', items: { '104,11': '1up' },
    build() {
      const b = LB(280);
      b.ground(0, 60).put(3, 11, '@').row(6, 10, '$$$$$$').put(12, 11, 'M').put(20, 11, 'z').fill(26, 27, 12, 12, '}').put(30, 11, 'Q').row(36, 10, '$$$$').put(40, 6, 'x').put(46, 11, 'c').put(52, 11, 's').plat(54, 60, 4).row(54, 3, '$$$$$$$');
      b.ground(65, 120).put(70, 11, 'M').put(75, 11, 'z').fill(80, 81, 11, 11, '^').fill(88, 89, 12, 12, '}').put(92, 11, 'Q').put(100, 11, 'c').put(104, 11, 'M').put(108, 11, 'C').row(110, 10, '$$$$$');
      b.ground(125, 180).put(130, 11, 's').plat(132, 140, 3).row(132, 2, '$$$$$').put(138, 2, 'X').put(135, 11, 'z').put(145, 7, 'x').fill(150, 151, 11, 11, '^').put(158, 11, 'c').fill(164, 165, 12, 12, '}').put(168, 11, 'Q').put(176, 11, 'C');
      b.ground(185, 279).put(190, 11, 'z').put(196, 11, 'z').put(200, 11, 'M').put(210, 6, 'x').put(220, 11, 'c').put(226, 11, 's').plat(228, 236, 4).row(228, 3, '$$$$$$$$$').fill(240, 242, 11, 11, '^').row(246, 10, '$$$$$').put(265, 11, 'E');
      return b;
    } },
  { id: 'son1b', camp: 'son1', tag: '2', name: 'GREEN HELL', theme: 'ghz', card: 'zone', rules: SON1, goal: 'sign',
    build() {
      const b = LB(260);
      b.ground(0, 50).put(3, 11, '@').row(6, 10, '$$$$$$$$').put(14, 11, 'M').put(22, 11, 'c').put(28, 6, 'x').fill(38, 39, 12, 12, '}').put(42, 11, 'Q');
      b.plat(54, 57, 9).plat(61, 64, 7).row(61, 6, '$$$$').ground(68, 130).put(72, 11, 'z').put(78, 11, 's').ground(80, 86, 6).row(80, 5, '$$$$$$$').put(84, 11, 'z').fill(90, 92, 11, 11, '^').put(96, 11, 'M').put(100, 11, 'C').put(106, 5, 'x').put(112, 11, 'c').fill(120, 121, 12, 12, '}').put(124, 11, 'Q');
      b.ground(135, 200).put(138, 11, 'z').put(142, 11, 'z').put(148, 11, 's').plat(150, 160, 3).row(150, 2, '$$$$$$$$$$$').fill(152, 156, 11, 11, '^').put(164, 11, 'C').put(170, 11, 'M').put(176, 6, 'x').put(182, 11, 'c').fill(190, 191, 12, 12, '}').put(194, 11, 'Q');
      b.ground(205, 259).put(210, 11, 'z').row(214, 10, '$$$$$$').put(220, 11, 'c').put(245, 11, 'E');
      return b;
    } },
  { id: 'son1c', camp: 'son1', tag: '3', name: 'GREEN HELL', theme: 'ghz', card: 'zone', rules: SON1, goal: 'sign', boss: { id: 'robux', at: 40 },
    build() {
      const b = LB(70);
      b.ground(0, 69).put(3, 11, '@').row(6, 10, '$$$$$$$$$$').put(18, 11, 'M').put(24, 11, 'M').put(30, 11, 'C').row(32, 10, '$$$$$').put(64, 11, 'E');
      return b;
    } },
  // ======== HEDGECARL 2 ========
  { id: 'son2a', camp: 'son2', tag: '1', name: 'EMERALD HELL', theme: 'ehz', outfit: 'tails', card: 'zone', rules: SON2, goal: 'sign', signs: [[10, 12, 'v+B']],
    build() {
      const b = LB(260);
      b.ground(0, 70).put(3, 11, '@').row(6, 10, '$$$$$$').put(18, 11, 'M').fill(26, 26, 8, 11, 'Z').row(28, 10, '$$$$').put(34, 11, 'z').put(40, 11, 'Q').put(50, 11, 'c').fill(58, 58, 8, 11, 'Z').put(62, 11, 'M');
      b.ground(74, 140).put(78, 11, 's').ground(80, 90, 5).put(88, 4, 'X').row(80, 4, '$$$$$$').put(94, 11, 'z').fill(100, 100, 8, 11, 'Z').put(104, 11, 'C').put(110, 6, 'x').fill(120, 121, 12, 12, '}').put(124, 11, 'Q').put(134, 11, 'c');
      b.ground(145, 259).put(150, 11, 'z').fill(156, 156, 8, 11, 'Z').put(160, 11, 'M').put(166, 11, 'C').put(172, 11, 'c').fill(178, 179, 11, 11, '^').put(184, 11, 's').plat(186, 194, 4).row(186, 3, '$$$$$$$$$').fill(200, 200, 8, 11, 'Z').put(210, 11, 'z').put(245, 11, 'E');
      return b;
    } },
  { id: 'son2b', camp: 'son2', tag: '2', name: 'CASINO NIGHT', theme: 'casino', card: 'zone', rules: SON2, goal: 'sign',
    build() {
      const b = LB(240);
      b.ground(0, 40).put(3, 11, '@').row(8, 10, '$$$$$$').put(14, 8, '*').put(18, 6, '*').put(22, 8, '*').put(28, 11, 'M').put(34, 11, 'z');
      b.plat(44, 47, 9).put(45, 6, '*').plat(51, 54, 9).ground(58, 110).put(62, 11, 's').plat(64, 72, 4).put(66, 2, '*').put(70, 2, '*').row(64, 3, '$$$$$$$$$').put(78, 11, 'c').put(84, 11, 'C').put(90, 8, '*').put(94, 8, '*').put(98, 8, '*').put(104, 11, 'M').fill(106, 107, 12, 12, '}');
      b.ground(116, 180).put(120, 11, 'Q').put(130, 6, 'x').put(136, 9, '*').put(140, 7, '*').put(144, 9, '*').put(150, 11, 'C').put(156, 11, 'z').put(160, 11, 'z').put(166, 11, 'M').fill(170, 170, 8, 11, 'Z');
      b.plat(184, 186, 9).put(185, 6, '*').plat(190, 192, 9).ground(196, 239).put(202, 11, 'c').row(206, 10, '$$$$$$$').put(226, 11, 'E');
      return b;
    } },
  { id: 'son2c', camp: 'son2', tag: '3', name: 'DEATH EGG', theme: 'death', card: 'zone', rules: SON2, goal: 'sign', boss: { id: 'mecha', at: 30 },
    build() {
      const b = LB(60);
      b.ground(0, 59).put(3, 11, '@').row(6, 10, '$$$$$$$$$$').put(16, 11, 'M').put(22, 11, 'C').put(55, 11, 'E');
      return b;
    } },
  // ======== CARL 3 & KNUCKLEHEAD ========
  { id: 'son3a', camp: 'son3', tag: '1', name: 'ANGEL ISLAND', theme: 'angel', outfit: 'knux', card: 'zone', rules: SON3, goal: 'sign', signs: [[88, 12, 'B B']], items: { '12,11': 'fire', '80,11': 'zap', '150,11': 'fire' },
    build() {
      const b = LB(260);
      b.ground(0, 60).put(3, 11, '@').row(6, 10, '$$$$$$').put(12, 11, 'M').put(20, 11, 'z').fill(28, 29, 9, 11, '#').row(30, 10, '$$$').put(36, 11, 'c').put(44, 6, 'x').fill(48, 49, 12, 12, '}').put(56, 11, 'z');
      b.ground(64, 130).put(70, 11, 's').plat(72, 78, 4).row(72, 3, '$$$$$$$').put(80, 11, 'M').put(86, 11, 'C').fill(92, 93, 2, 11, '#').put(92, 1, 'X').row(95, 10, '$$$$').put(100, 11, 'c').put(106, 11, 'Q').put(116, 6, 'x').put(122, 11, 'z');
      b.ground(134, 259).put(140, 11, 'C').put(150, 11, 'M').put(156, 11, 'c').fill(162, 163, 11, 11, '^').put(170, 11, 's').plat(172, 180, 4).row(172, 3, '$$$$$$$$$').put(186, 11, 'z').put(192, 11, 'z').fill(198, 198, 8, 11, 'Z').put(206, 6, 'x').put(214, 11, 'c').row(220, 10, '$$$$$$').put(245, 11, 'E');
      return b;
    } },
  { id: 'son3b', camp: 'son3', tag: '2', name: 'HYDROCITY', theme: 'hydro', card: 'zone', rules: SON3, goal: 'sign', water: 6, items: { '10,5': 'bubble', '70,11': 'bubble', '128,11': 'bubble' },
    build() {
      const b = LB(200);
      b.ground(0, 199, 12).fill(0, 12, 6, 6, '#').put(2, 5, '@').put(10, 5, 'M').row(4, 4, '$$$$$');
      b.put(18, 9, 'f').put(26, 8, 'j').row(20, 10, '$$$$').put(34, 11, 'v').fill(40, 44, 9, 11, '#').put(48, 8, 'f').put(56, 11, 'v').put(62, 8, 'j').put(70, 11, 'M').put(76, 11, 'C');
      b.fill(84, 120, 6, 7, '#').put(90, 10, 'f').put(98, 9, 'j').put(104, 11, 'v').put(112, 10, 'f').row(86, 10, '$$$$$$$').put(124, 11, 'C').put(128, 11, 'M');
      b.put(136, 8, 'j').put(144, 11, 'v').put(150, 9, 'f').fill(156, 160, 8, 11, '#').put(166, 8, 'j').put(172, 11, 'v').put(182, 11, 'v').put(190, 11, 'E');
      return b;
    } },
  { id: 'son3c', camp: 'son3', tag: '3', name: 'SKY SANCTUARY', theme: 'sky', card: 'zone', rules: SON3, goal: 'sign', boss: { id: 'knux', at: 30 }, items: { '16,11': 'zap' },
    build() {
      const b = LB(60);
      b.ground(0, 59).put(3, 11, '@').row(6, 10, '$$$$$$$$$$').put(16, 11, 'M').put(22, 11, 'C').put(55, 11, 'E');
      return b;
    } },
);

// ---------------- the carts ----------------
// title parodies: a color, a name, a line. The focus group signed off on one line per cart
const CARTS = [
  { id: 'smb', name: 'SUPER CARL BROS.', short: 'SCB', col: '#db2424', bg: '#6d92ff', line: '1 PLAYER GAME', year: '1985ISH', end: ['THANK YOU CARL!', 'BUT LINDA IS IN', 'ANOTHER MEETING.'] },
  { id: 'smw', name: 'SUPER CARL WORLD', short: 'SCW', col: '#ffdb24', bg: '#24b6db', line: 'NOW WITH A DINO', year: '1990ISH', end: ['LINDA IS IN', 'ANOTHER MEETING.', '(AGAIN.)'] },
  { id: 'son1', name: 'CARL THE HEDGECARL', short: 'CTH', col: '#2449db', bg: '#00186d', line: 'BLAST PROCESSING', year: '1991ISH', voice: 'Pretend cooooo!', end: ['YOU GOT 0 EMERALDS.', 'WE DIDN\'T MAKE ANY.'] },
  { id: 'son2', name: 'HEDGECARL 2', short: 'HC2', col: '#2449db', bg: '#24246d', line: 'NOW WITH TALES', year: '1992ISH', voice: 'Pretend cooooo!', end: ['TALES WANTS', 'A SPIN-OFF.', 'NO.'] },
  { id: 'son3', name: 'CARL 3 & KNUCKLEHEAD', short: 'C3K', col: '#db2424', bg: '#24496d', line: 'LOCK-ON TECHNOLOGY', year: '1994ISH', voice: 'Pretend cooooo!', lock: 1, end: ['PLUG THIS GAME', 'INTO THIS GAME.', 'NOW IT\'S ONE GAME.'] },
];
function drawCart(c, x, y, sel) {
  rectF(x, y, 48, 56, hex('#494949')); rectF(x, y, 48, 3, hex('#6d6d6d')); rectF(x + 4, y + 6, 40, 36, hex(c.col)); frameRect(x + 4, y + 6, 40, 36, BLACK);
  text(c.short, x + 15, y + 18, WHITE); for (let i = 0; i < 6; i++) rectF(x + 6 + i * 6, y + 48, 4, 8, hex('#b6924a'));
  if (sel) frameRect(x - 2, y - 2, 52, 60, hex('#ffdb24'));
  if (XMETA.carts[c.id]) { tint(x + 6, y + 30, 36, 9, hex('#24b624'), .9); text('DONE', x + 12, y + 31, WHITE, 0); }
}
async function bonusMenu() {
  const prev = scene; let i = 0, t = 0;
  const menu = scene = { update() { t++; }, draw() {
    skyD(0, H, '#100020', '#241049'); ctext('BONUS CARTS', 14, hex('#ffdb24'), BLACK, 2); ctext('OTHER GAMES. SIMPLIFIED MORE.', 38, UI.dim);
    CARTS.forEach((c, k) => drawCart(c, 18 + k * 58, 70 - (k === i ? 6 + ((t >> 3) & 1) : 0), k === i));
    ctext(CARTS[i].name, 150, WHITE, BLACK, 1); ctext(CARTS[i].line, 164, UI.dim);
  } };
  for (;;) {
    await nextFrame();
    if (pressed.left) { i = (i + CARTS.length - 1) % CARTS.length; sfx('move'); }
    if (pressed.right) { i = (i + 1) % CARTS.length; sfx('move'); }
    if (pressed.b || pressed.c) { sfx('tick'); break; }
    if (pressed.a || pressed.start) { sfx('ok'); await fadeOut(); await playCart(CARTS[i]); music('title'); scene = menu; await fadeIn(); }
  }
  scene = prev;
}
async function cartTitle(c) {
  let t = 0; music(null);
  scene = { update() { t++; }, draw() {
    cls(hex(c.bg));
    if (c.lock) { drawCart(CARTS[2], 136, 112, false); drawCart(c, 136, 20 + Math.min(50, t), false); if (t > 50) ctext('CLICK.', 184, WHITE); } // a cart plugged into a cart
    else { rectF(40, 40, 240, 60, hex(c.col)); frameRect(40, 40, 240, 60, BLACK); ctext(c.name, 64, WHITE, BLACK, c.name.length > 19 ? 1 : 2); }
    if (!c.lock || t > 50) ctext(c.lock ? c.name : c.line, c.lock ? 30 : 120, hex('#ffdb24'), BLACK, c.lock && c.name.length < 20 ? 2 : 1);
    ctext('(C)' + c.year + ' ' + PUB, 206, WHITE);
  } };
  RUN.words += words(c.name) + words(c.line);
  await fadeIn(.08); sfx('ok'); if (c.voice) speak(c.voice, { pitch: 1.3 });
  await readWait(110, 0, 110, 0); await fadeOut(.08);
}
const CARDS = {
  nes: async L => { music(null); const S = carlSet(OUTFITS.find(o => o.id === RUN.outfit) || OUTFITS[0]); scene = { draw() { cls(BLACK); ctext('WORLD ' + L.tag, 80, WHITE, BLACK, 2); draw(S.stand[0], 134, 108, S.P); text('x ' + RUN.lives, 162, 116, WHITE); } }; RUN.words += 2; await fadeIn(.2); await readWait(90, 0, 90, 0); await fadeOut(.2); },
  zone: async L => { // the zone card: bands slide in, the name, the act
    music(null); let t = 0;
    scene = { update() { t++; }, draw() {
      cls(hex('#2449db')); const k = Math.min(1, t / 14);
      rectF(0, 0, 70 * k, H, hex('#db2424')); triF(70 * k, 0, 70 * k + 30, 0, 70 * k, H, hex('#db2424'));
      rectF(W - 320 * k, 150, 320, 40, hex('#ffdb24')); text(PUB, 10, 200 - 120 * k, WHITE, BLACK);
      text(L.name, W - 40 - 12 * L.name.length - (1 - k) * 200, 70, WHITE, BLACK, 2); text('ZONE', W - 88 + (1 - k) * 200, 94, WHITE, BLACK, 2); text('ACT ' + L.tag, W - 120, 160, hex('#db2424'), 0, 2);
    } };
    RUN.words += words(L.name) + 3; await fadeIn(.15); await readWait(100, 0, 100, 0); await fadeOut(.1);
  },
};
async function playCart(c) {
  const ids = LEVELS.map((l, i) => l.camp === c.id ? i : -1).filter(i => i >= 0);
  const keep = { lv: RUN.lv, bux: RUN.bux, lives: RUN.lives };
  Object.assign(RUN, { camp: c.id, lives: 5, bux: 0, nerf: {} });
  await cartTitle(c);
  for (let k = RUN.cartFrom || 0; k < ids.length;) { // cartFrom: tests start mid-cart
    RUN.lv = ids[k];
    const res = await playLevel(ids[k]);
    if (res === 'quit') break;
    if (res === 'over') { await gameOverScreen(); continue; }
    if (k === ids.length - 1) { await cartOutro(c); break; }
    await tally(LEVELS[ids[k]]); k++;
  }
  Object.assign(RUN, keep, { camp: null }); RULES = {};
}
async function cartOutro(c) {
  CUT = 1; music('sting');
  const prize = OUTFITS.find(o => o.camp === c.id && o.clear), first = !XMETA.carts[c.id];
  XMETA.carts[c.id] = 1; XMETA.got[prize.id] = 1; saveXM();
  await bigCard(c.end, 110, { bg: hex(c.bg) });
  await bigCard([prize.name, 'UNLOCKED'], 70, { bg: hex('#241049') });
  if (first && CARTS.every(k => XMETA.carts[k.id])) { music('walkout'); await bigCard(['ALL CARTS CLEARED.', '', 'LINDA:', 'MEETING ADJOURNED.'], 150, { bg: hex('#ff4900') }); }
  await fadeOut(.06);
}
