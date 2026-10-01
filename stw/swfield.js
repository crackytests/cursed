'use strict';
// ================= SAVE THE WORLD: the field — maps, walking, people, chests, doors, save points, encounters =================
const MAPS = {};
const TS = 16;
let M = null;          // the loaded map: { def, id, w, h, g (rows as arrays), npcs, tiles }
const PL = { x: 0, y: 0, px: 0, py: 0, dir: 'd', mv: 0, f: 0, hide: 0 };
let FIELD_LOCK = 0;    // >0 while a script runs: no walking
const OVERLAY = new Set(['T', 't', 'o', '*', '^', '=', 'B', 'b', '_']);
const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

// ---------- map loading ----------
function loadMap(id, x, y, dir) {
  const def = MAPS[id]; if (!def) throw new Error('no map ' + id);
  G.map = id; G.x = x; G.y = y; if (dir) G.dir = dir;
  const g = def.rows.map(r => r.split(''));
  M = { def, id, w: Math.max(...def.rows.map(r => r.length)), h: def.rows.length, g, npcs: [], ts: swTileset(def.theme), t: 0 };
  M.P = G.world === 2 && !def.color ? legacyPal(M.ts.P, 'dmg') : M.ts.P;
  M.npcs = (def.npcs ? def.npcs() : []).map(mkNpc);
  PL.x = x; PL.y = y; PL.px = x * TS; PL.py = y * TS; PL.dir = G.dir; PL.mv = 0; PL.hide = 0;
  if (def.init) def.init(M);
  G.encN = encSteps();
  scene = fieldScene; music(def.music || null);
  camSnap();
}
function mkNpc(o) {
  const n = Object.assign({ dir: 'd', f: 0, mv: 0, solid: true, wanderT: 60 + rnd(90) }, o);
  n.px = n.x * TS; n.py = n.y * TS; n.home = [n.x, n.y];
  if (!n.P && n.who) { const P = ART.pal(n.who); n.P = G.world === 2 && !n.color ? legacyPal(P, 'dmg') : P; }
  return n;
}
async function goMap(id, x, y, dir, o = {}) {
  FIELD_LOCK++; if (!o.noFade) { sfx(o.sfx || 'door'); await fadeOut(.1); }
  loadMap(id, x, y, dir);
  if (!o.noFade) await fadeIn(.1);
  FIELD_LOCK--;
  if (post.fade > 0) await fadeIn(o.noFade ? .03 : .1); // never start a scene behind a black screen
  if (M.def.enter) await run(() => M.def.enter(M));
}
const tileAt = (x, y) => (M && y >= 0 && y < M.h && x >= 0 && x < M.w) ? (M.g[y][x] || ' ') : ' ';
const setTile = (x, y, c) => { if (M && M.g[y]) M.g[y][x] = c; };
const npcAt = (x, y) => M.npcs.find(n => !n.gone && n.solid && live(n) && ((n.x === x && n.y === y) || (n.tx === x && n.ty === y)));
const live = n => !n.if || n.if();
function blocked(x, y, who) {
  const c = tileAt(x, y); if (c === ' ' || SW_SOLID.has(c)) return true;
  if (M.def.solid && M.def.solid.includes(c)) return true;
  if (who !== 'npc' && npcAt(x, y)) return true;
  if (who === 'npc' && (PL.x === x && PL.y === y)) return true;
  if (M.def.chests && M.def.chests.some(([cx, cy]) => cx === x && cy === y)) return true;
  return false;
}
// ---------- the field scene ----------
const fieldScene = { update: fieldUpdate, draw: fieldDraw };
function fieldUpdate() {
  if (!M) return; M.t++; G.frames++;
  if (G.timer && !FIELD_LOCK && !DLG && !(B && !B.done)) { if (--G.timer.left <= 0) { const f = G.timer.end; G.timer = null; run(f); } }
  for (const n of M.npcs) npcUpdate(n);
  if (PL.mv) { stepPlayer(); return; }
  if (FIELD_LOCK || busy || DLG || MENUS.length || CARD) return;
  if (pressed.start) { run(fieldMenu); return; }
  if (pressed.c) { run(talkHint); return; }
  if (pressed.a) { run(interact); return; }
  const d = held.up ? 'u' : held.down ? 'd' : held.left ? 'l' : held.right ? 'r' : null;
  if (d) {
    PL.dir = d; G.dir = d; const [dx, dy] = DIRV[d], nx = PL.x + dx, ny = PL.y + dy;
    const ex = exitAt(nx, ny);
    if (ex && !blocked(nx, ny)) { PL.mv = 1; PL.tx = nx; PL.ty = ny; PL.run = held.b; return; }
    if (nx < 0 || ny < 0 || nx >= M.w || ny >= M.h) { const e = M.def.edge; if (e) run(() => e(d)); return; }
    if (!blocked(nx, ny)) { PL.mv = 1; PL.tx = nx; PL.ty = ny; PL.run = held.b; }
    else if (M.t % 12 === 0) sfx('step');
  }
}
function stepPlayer() {
  const sp = PL.run ? 4 : 2;
  PL.px += Math.sign(PL.tx * TS - PL.px) * sp; PL.py += Math.sign(PL.ty * TS - PL.py) * sp; PL.f++;
  if (PL.px === PL.tx * TS && PL.py === PL.ty * TS) {
    PL.x = PL.tx; PL.y = PL.ty; G.x = PL.x; G.y = PL.y; PL.mv = 0; G.steps++;
    run(onStep);
  }
}
async function onStep() {
  const k = PL.x + ',' + PL.y;
  const ex = exitAt(PL.x, PL.y); if (ex) { await useExit(ex); return; }
  if (M.def.steps && M.def.steps[k]) { const f = M.def.steps[k]; await f(PL.x, PL.y); return; }
  if (M.def.onStep) { const r = await M.def.onStep(PL.x, PL.y); if (r) return; }
  if (M.def.enc && !flag('noenc')) { G.encN -= 1; if (G.encN <= 0) { G.encN = encSteps(); await randomBattle(M.def.enc); } }
}
const encSteps = () => { const fewer = partyHeroes().some(r => stats(r).flags.fewer); return Math.round((18 + rnd(28)) * (fewer ? 2 : 1)); };
function exitAt(x, y) { return (M.def.exits || []).find(e => x >= e.x && x < e.x + (e.w || 1) && y >= e.y && y < e.y + (e.h || 1) && (!e.if || e.if())); }
async function useExit(e) {
  if (e.no && e.no()) return;
  if (e.run) { await e.run(); return; }
  if (e.to === 'world') { await toWorld(e.wx, e.wy); return; }
  await goMap(e.to, e.tx, e.ty, e.dir || G.dir);
}
async function randomBattle(enc) {
  const form = typeof enc.forms === 'function' ? enc.forms() : pickOne(enc.forms);
  FIELD_LOCK++;
  const r = await battle(typeof form === 'string' ? FORMS[form] : form, { bg: enc.bg });
  FIELD_LOCK--;
  if (r === 'lose') await gameOver();
  else await fadeIn(.1);
}
async function interact() {
  const [dx, dy] = DIRV[PL.dir], fx = PL.x + dx, fy = PL.y + dy;
  // across a counter: talk to the shopkeeper behind it
  const n = npcAt(fx, fy) || (tileAt(fx, fy) === '_' ? npcAt(fx + dx, fy + dy) : null);
  if (n && n.talk) { const back = n.dir; n.dir = { u: 'd', d: 'u', l: 'r', r: 'l' }[PL.dir]; await n.talk(n); if (!n.keepDir) n.dir = back; return; }
  const ch = (M.def.chests || []).find(([cx, cy]) => cx === fx && cy === fy); if (ch) { await openChest(ch); return; }
  const sv = (M.def.saves || []).find(([sx, sy]) => (sx === PL.x && sy === PL.y) || (sx === fx && sy === fy)); if (sv) { await savePoint(); return; }
  const sg = M.def.signs && (M.def.signs[fx + ',' + fy] || M.def.signs[PL.x + ',' + PL.y]); if (sg) { await sg(); return; }
}
async function openChest([x, y, item, n = 1]) {
  const k = M.id + ':' + x + ',' + y; if (G.chests[k]) { await say('EMPTY.'); return; }
  G.chests[k] = 1; sfx('get');
  if (item === 'gp') { G.gp += n; await say('FOUND ' + n + ' GP.'); return; }
  if (GADGETS[item]) { G.gadgets.push(item); await say('FOUND AN INVENTION: ' + GADGETS[item].name + '!'); return; }
  invAdd(item, n); await say('FOUND ' + itemName(item) + (n > 1 ? ' x' + n : '') + '!');
}
async function savePoint() {
  sfx('ok'); const c = await choose(['SAVE', 'USE SLEEPING BAG', 'NEVER MIND'], { cancel: 1 });
  if (c === 0) await saveMenu();
  if (c === 1) { if (!invHas('tent')) { await say('NO SLEEPING BAGS.'); return; } invAdd('tent', -1); await restParty('THE PARTY SLEPT ON THE FLOOR. EVERYONE FEELS BETTER.'); }
}
async function restParty(msg) { await fadeOut(.05); for (const r of Object.values(G.roster)) { r.hp = r.mhp; r.mp = r.mmp; r.status = {}; } music('rest'); await wait(90); music(M ? M.def.music : null); await fadeIn(.05); if (msg) await say(msg); }

// ---------- NPCs ----------
function npcUpdate(n) {
  if (n.gone || !live(n)) return;
  if (n.mv) { const sp = n.speed || 1; n.px += Math.sign(n.tx * TS - n.px) * sp; n.py += Math.sign(n.ty * TS - n.py) * sp; n.f++; if (n.px === n.tx * TS && n.py === n.ty * TS) { n.x = n.tx; n.y = n.ty; n.mv = 0; n.tx = n.ty = undefined; } return; }
  if (n.wander && !FIELD_LOCK && !DLG && --n.wanderT <= 0) {
    n.wanderT = 60 + rnd(120); const d = pick(['u', 'd', 'l', 'r']), [dx, dy] = DIRV[d], nx = n.x + dx, ny = n.y + dy; n.dir = d;
    if (Math.abs(nx - n.home[0]) + Math.abs(ny - n.home[1]) <= (n.wander === true ? 2 : n.wander) && !blocked(nx, ny, 'npc') && !M.npcs.some(o => o !== n && !o.gone && o.x === nx && o.y === ny)) { n.mv = 1; n.tx = nx; n.ty = ny; }
  }
  if (n.update) n.update(n);
}
// scripted movement: walk a person (or 'P' for the player) along a path of steps like 'lluur'
async function walk(who, path, sp = 1) {
  for (const d of path) {
    const [dx, dy] = DIRV[d];
    if (who === 'P') { PL.dir = d; PL.tx = PL.x + dx; PL.ty = PL.y + dy; PL.run = sp > 1; PL.mv = 1; while (PL.mv) { await nextFrame(); } }
    else { who.dir = d; who.tx = who.x + dx; who.ty = who.y + dy; who.speed = sp; who.mv = 1; while (who.mv) await nextFrame(); }
  }
}
const npc = id => M.npcs.find(n => n.id === id);
function addNpc(o) { const n = mkNpc(o); M.npcs.push(n); return n; }
function face(who, d) { if (who === 'P') { PL.dir = d; G.dir = d; } else who.dir = d; }
const faceTo = (a, b) => { const ax = a === 'P' ? PL.x : a.x, ay = a === 'P' ? PL.y : a.y, bx = b === 'P' ? PL.x : b.x, by = b === 'P' ? PL.y : b.y; const d = Math.abs(bx - ax) > Math.abs(by - ay) ? (bx > ax ? 'r' : 'l') : (by > ay ? 'd' : 'u'); face(a, d); };

// ---------- camera + drawing ----------
const CAM = { x: 0, y: 0 };
function camSnap() { camUpdate(true); }
function camUpdate(snap) {
  const mw = M.w * TS, mh = M.h * TS;
  let tx = PL.px + 8 - W / 2, ty = PL.py + 8 - (H - 16) / 2;
  tx = mw <= W ? (mw - W) / 2 : clamp(tx, 0, mw - W); ty = mh <= H ? (mh - H) / 2 : clamp(ty, 0, mh - H);
  if (M.def.cam) [tx, ty] = M.def.cam(tx, ty);
  CAM.x = snap ? tx : tx; CAM.y = ty;
}
function fieldDraw() {
  if (!M) { cls(BLACK); return; }
  camUpdate(); const cx = Math.round(CAM.x), cy = Math.round(CAM.y);
  cls(M.def.bg ? hex(M.def.bg) : BLACK);
  if (M.def.under) M.def.under(cx, cy);
  const x0 = Math.floor(cx / TS), y0 = Math.floor(cy / TS), af = (M.t >> 4);
  for (let ty = y0; ty <= y0 + 15; ty++) for (let tx = x0; tx <= x0 + 20; tx++) {
    const c = tileAt(tx, ty); if (c === ' ') continue;
    let key = c; if (c === '#') key = tileAt(tx, ty + 1) === '#' || tileAt(tx, ty + 1) === ' ' ? '#t' : '#f';
    const fr = M.ts.t[key] || M.ts.t['.']; if (!fr) continue;
    if (OVERLAY.has(c)) { const ft = M.ts.t[M.def.floor || '.']; draw(ft[0], tx * TS - cx, ty * TS - cy, M.P); }
    draw(fr[af % fr.length], tx * TS - cx, ty * TS - cy, M.P);
  }
  for (const s of M.def.saves || []) drawSavePoint(s[0] * TS - cx, s[1] * TS - cy);
  for (const [x, y] of M.def.chests || []) drawChest(x * TS - cx, y * TS - cy, G.chests[M.id + ':' + x + ',' + y]);
  // people, sorted by depth
  const L = M.npcs.filter(n => !n.gone && live(n) && !n.hidden).map(n => ({ y: n.py, f: () => drawNpc(n, cx, cy) }));
  if (!PL.hide) L.push({ y: PL.py, f: () => drawLead(PL.px - cx, PL.py - cy - 8) });
  L.sort((a, b) => a.y - b.y).forEach(o => o.f());
  if (M.def.over) M.def.over(cx, cy);
  if (M.def.dark) darkness(PL.px - cx + 8, PL.py - cy + 4, M.def.dark);
  if (G.world === 2 && !M.def.color) crushRect(0, 0, W, H, true);
  fieldHUD();
}
function drawLead(x, y) {
  const id = G.party[0] || 'yoko', who = id === 'kid' ? (hero('kid').aspect || 'kid') : flag('armor') && ART.hero['armor_' + id] ? 'armor_' + id : G.leadSkin || id;
  const f = PL.mv ? ((PL.f >> 3) & 3) : 0;
  draw(ART.field(who, PL.dir, f), x, y, ART.pal(who), PL.dir === 'r');
}
function drawNpc(n, cx, cy) {
  const x = n.px - cx, y = n.py - cy - 8;
  if (n.draw) { n.draw(n, x, y); return; }
  const f = n.mv ? ((n.f >> 3) & 3) : 0;
  draw(ART.field(n.who, n.dir, f), x, y, n.P, n.dir === 'r', n.tint);
}
const CHEST_S = spr(16, 16, g => { g.r(1, 4, 14, 11, 2); g.r(1, 4, 14, 4, 3); g.r(1, 8, 14, 1, 1); g.r(7, 7, 2, 3, 4); g.r(1, 14, 14, 1, 1); });
const CHEST_O = spr(16, 16, g => { g.r(1, 7, 14, 8, 2); g.r(1, 2, 14, 4, 3); g.r(2, 7, 12, 2, 1); g.r(1, 14, 14, 1, 1); });
const CHEST_P = pal('#241008', '#b66d24', '#db9249', '#ffdb49');
function drawChest(x, y, open) { draw(outline(open ? CHEST_O : CHEST_S, 1), x, y, CHEST_P); }
function drawSavePoint(x, y) {
  const t = frame;
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + t * .05; pset(x + 8 + Math.cos(a) * 6, y + 9 + Math.sin(a) * 3, i & 1 ? hex('#92dbff') : WHITE); }
  ringF(x + 8, y + 9, 5 + (t >> 3) % 3, hex('#49b6ff')); circF(x + 8, y + 9, 2, (t >> 4) & 1 ? WHITE : hex('#92dbff'));
  for (let j = 0; j < 3; j++) pset(x + 6 + j * 2, y + 2 + ((t + j * 10) % 14) * -.4 + 6, hex('#dbffff'));
}
function darkness(x, y, r) {
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) { const d = Math.hypot(xx - x, (yy - y) * 1.2); if (d > r) { const o = yy * W + xx; FB[o] = d > r + 26 ? BLACK : ((xx + yy) & 1 ? BLACK : mix(FB[o], BLACK, .6)); } }
}
// the corrupted save: crush a region of the screen to four greens (the party lead is redrawn in color on top)
function crushRect(x0, y0, w, h, keepLead) {
  const T = TONES.dmg.map(hex);
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const o = y * W + x, l = lum(FB[o]); FB[o] = T[l > 170 ? 0 : l > 110 ? 1 : l > 55 ? 2 : 3]; }
  if (keepLead && M && !PL.hide) drawLead(PL.px - Math.round(CAM.x), PL.py - Math.round(CAM.y) - 8);
}
function fieldHUD() {
  if (M && M.def.name && M.t < 120 && !M.def.noTitle) { const w = M.def.name.length * 6 + 16; panel(((W - w) / 2) | 0, 8, w, 18); ctext(M.def.name, 13, WHITE); }
  if (G.timer) { const s = Math.max(0, Math.ceil(G.timer.left / 60)); panel(W - 66, 4, 62, 16); text(Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'), W - 56, 8, s < 30 ? hex('#ff4949') : WHITE); }
}

// ---------- story helpers ----------
async function join(id, lv, eq) {
  const r = addHero(id, lv, eq); sfx('get'); music('fanfare');
  await say(HEROES[id].name + ' JOINED THE PARTY!');
  music(M ? M.def.music : null); return r;
}
function obj(text, map, x, y) { G.obj = { text, map, x, y }; }
async function talkHint() {
  const o = G.obj; if (!o) return;
  const lead = G.party[0]; const who = HEROES[lead].port;
  await say(o.text, who);
}
// PS4-style manga panels: [{ port, text, who }] laid out like a comic page
async function panels(list, o = {}) {
  const prev = scene; let shown = 0;
  scene = { update() {}, draw() {
    cls(hex(o.bg || '#000000'));
    const n = list.length, cols = n > 2 ? 2 : 1, rows = Math.ceil(n / cols), pw = (W - 12 - (cols - 1) * 6) / cols, ph = (H - 12 - (rows - 1) * 6) / rows;
    list.forEach((p, i) => {
      if (i >= shown) return; const c = i % cols, r = (i / cols) | 0, x = 6 + c * (pw + 6), y = 6 + r * (ph + 6);
      rectF(x, y, pw, ph, hex(p.bg || '#f8f0dc')); frameRect(x, y, pw, ph, BLACK); frameRect(x + 1, y + 1, pw - 2, ph - 2, BLACK);
      for (let j = 0; j < 10; j++) lineF(x + pw - 4, y + 4, x + pw - 4 - (j * 13) % (pw - 8), y + ph - 4, hex(p.lines || '#e0d8c4'));
      if (p.port && PORT[p.port]) { const pp = PORT[p.port]; drawScaled(pp.s, x + 8, y + ph - 48 * (ph > 110 ? 2 : 1) - 4, pp.P, ph > 110 ? 2 : 1); }
      if (p.art) p.art(x, y, pw, ph);
      if (p.text) { const L = wrapT(p.text.toUpperCase(), Math.floor((pw - 24) / 6) - (p.port ? 10 : 0)), bx = p.port ? x + (ph > 110 ? 108 : 60) : x + 10; const bw = Math.min(pw - (bx - x) - 8, Math.max(...L.map(l => l.length)) * 6 + 12);
        rectF(bx, y + 8, bw, L.length * 9 + 8, WHITE); frameRect(bx, y + 8, bw, L.length * 9 + 8, BLACK); L.forEach((l, k) => text(l, bx + 6, y + 12 + k * 9, BLACK, 0)); }
      if (p.sfx) text(p.sfx, x + pw - p.sfx.length * 12 - 8, y + ph - 24, hex('#db2424'), BLACK, 2);
    }); } };
  for (shown = 1; shown <= list.length; shown++) { sfx('ok'); await wait(12); await waitBtn(); }
  scene = prev;
}
async function gameOver() {
  music('gameover'); const prev = scene;
  scene = { update() {}, draw() { cls(BLACK); ctext('THE PARTY WAS NOT SAVED.', 90, hex('#db4949')); ctext('CONTINUE?', 120, WHITE); } };
  await wait(60); await waitBtn(); await fadeOut();
  post.fade = 0; run(titleScreen);
  throw new Error('gameover');
}
