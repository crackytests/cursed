'use strict';
// ================= SPOOKY GHOST 2: the world. float, haunt from behind, phase through cracks, dodge the collectors =================
const GH = 'SPOOKY GHOST';
let S = null; // the save: everything that persists
const newS = () => ({ map: 'studio88', x: 2, y: 2, dir: 'd', flags: {}, ep: 1, applause: 0, total: 0, honesty: 0, cards: [], ecto: 100, time: 0, stars: {}, boss: {}, losses: {} });
const F = k => S && S.flags[k];
const setF = (k, v = 1) => { S.flags[k] = v; };
const MAPS = {};
const WD = { M: null, id: '', w: 0, h: 0, grid: [], ents: [], fx: [], t: 0, hold: 0, ts: null, tick: [], laser: false, shake: 0, quota: 0 };
const PL = { safe: [0, 0], x: 0, y: 0, dir: 'd', fx: 0, fy: 1, f: 0, moving: 0, phase: 0, bumpT: 0, inv: 0, vx: 0, vy: 0 };
const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

// ---------------- tiles + collision ----------------
const tileAt = (tx, ty) => (ty < 0 || ty >= WD.h || tx < 0 || tx >= WD.w) ? '#' : WD.grid[ty][tx];
function solidPx(px, py, phase) {
  const c = tileAt(Math.floor(px / 16), Math.floor(py / 16));
  if (c === 'W') return !phase;
  if (c === 'L') return WD.laser;
  if (c === 'M') return !WD.laser;
  return SOLID.has(c);
}
function boxFree(x, y, hw, hh, phase) { hw -= .5; hh -= .5; return !(solidPx(x - hw, y - hh, phase) || solidPx(x + hw, y - hh, phase) || solidPx(x - hw, y + hh, phase) || solidPx(x + hw, y + hh, phase) || solidPx(x, y - hh, phase) || solidPx(x, y + hh, phase)); }
const inMap = (x, y) => x > 8 && y > 14 && x < WD.w * 16 - 8 && y < WD.h * 16 - 2;
function moveBox(e, dx, dy, hw = 5, hh = 3, phase) { // e.x, e.y = feet
  let hit = 0; const stuck = !boxFree(e.x, e.y - hh, hw, hh, phase);
  if (dx) { const nx = e.x + dx; if (inMap(nx, e.y) && (stuck || boxFree(nx, e.y - hh, hw, hh, phase))) e.x = nx; else hit = 1; }
  if (dy) { const ny = e.y + dy; if (inMap(e.x, ny) && (stuck || boxFree(e.x, ny - hh, hw, hh, phase))) e.y = ny; else hit = 1; }
  return hit;
}
function los(x0, y0, x1, y1) { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 6); for (let i = 1; i < n; i++) { const t = i / n; if (solidPx(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - 6, 0)) return false; } return true; }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function setTile(tx, ty, ch) { if (ty >= 0 && ty < WD.h && tx >= 0 && tx < WD.w) WD.grid[ty][tx] = ch; }

// ---------------- maps ----------------
function mapBuilder(w, h, fill = '#') { // build a map in code instead of typing the ascii
  const g = Array.from({ length: h }, () => Array(w).fill(fill));
  const b = {
    set(x, y, c) { if (x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; return b; },
    fill(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) b.set(x + i, y + j, c); return b; },
    room(x, y, ww, hh, c = '.') { return b.fill(x, y, ww, hh, c); },
    h(x, y, n, c) { return b.fill(x, y, n, 1, c); }, v(x, y, n, c) { return b.fill(x, y, 1, n, c); },
    pts(c, ...p) { p.forEach(([x, y]) => b.set(x, y, c)); return b; },
    out() { return g.map(r => r.join('')); },
  };
  return b;
}
function loadMap(id, tx, ty, dir) {
  const M = MAPS[id]; if (!M) { console.error('no map', id); return; }
  WD.M = M; WD.id = id; S.map = id;
  const w = Math.max(...M.rows.map(r => r.length));
  WD.grid = M.rows.map(r => (r + '#'.repeat(w)).slice(0, w).split('')); WD.h = WD.grid.length; WD.w = w;
  WD.ts = tileset(M.theme); WD.fx = []; WD.laser = false; WD.ents = []; WD.tick = [];
  PL.x = tx * 16 + 8; PL.y = ty * 16 + 14; PL.dir = dir || 'd'; PL.fx = DIRV[PL.dir][0]; PL.fy = DIRV[PL.dir][1]; PL.phase = 0; PL.inv = 30; PL.vx = PL.vy = 0; PL.safe = [PL.x, PL.y];
  WD.quota = M.quota || 0;
  for (const d of (M.ents ? M.ents() : [])) addEnt(d);
  if (M.init) M.init();
  if (M.music) music(M.music);
  snapCam();
}
async function goMap(id, tx, ty, dir) { WD.hold++; try { sfx('door'); await fadeOut(.14); loadMap(id, tx, ty, dir); await fadeIn(.14); } finally { WD.hold--; } }
function snapCam() {
  const mw = WD.w * 16, mh = WD.h * 16;
  camX = mw <= W ? (mw - W) / 2 : clamp(PL.x - W / 2, 0, mw - W);
  camY = mh <= H ? (mh - H) / 2 : clamp(PL.y - H / 2, 0, mh - H);
  camX = Math.round(camX); camY = Math.round(camY);
}

// ---------------- entities ----------------
function addEnt(d) {
  const e = Object.assign({ kind: 'prop', t: 0, f: 0, fx: 0, fy: 1, dir: 'd' }, d);
  if (d.tx !== undefined) { e.x = d.tx * 16 + 8; e.y = d.ty * 16 + 14; }
  e.home = [e.x, e.y]; e.fx = DIRV[e.dir || 'd'][0]; e.fy = DIRV[e.dir || 'd'][1];
  if (e.path) e.path = e.path.map(([x, y]) => [x * 16 + 8, y * 16 + 14]);
  WD.ents.push(e); return e;
}
const ent = id => WD.ents.find(e => e.id === id);
const live = e => !e.gone && (!e.cond || e.cond(e));
function faceDir(e, dir) { e.dir = dir; e.fx = DIRV[dir][0]; e.fy = DIRV[dir][1]; }
function entSprite(e) {
  if (e.person) { const set = SG.people[e.person], k = e.fy < 0 ? 'u' : e.fx ? 'r' : 'd'; e.flip = e.fx < 0 && k === 'r'; return set[k][e.mv ? (e.t >> 3) & 1 : 0]; }
  if (typeof e.spr === 'function') return e.spr(e);
  return e.spr;
}
// scripted walking for cutscenes
async function walkTo(e, x, y, sp = 1) { // pixel target in feet coords
  while (Math.hypot(x - e.x, y - e.y) > sp) { const a = Math.atan2(y - e.y, x - e.x); e.x += Math.cos(a) * sp; e.y += Math.sin(a) * sp; faceDir(e, Math.abs(Math.cos(a)) > Math.abs(Math.sin(a)) ? (Math.cos(a) > 0 ? 'r' : 'l') : (Math.sin(a) > 0 ? 'd' : 'u')); e.mv = 1; await nextFrame(); }
  e.mv = 0;
}
const tpx = (tx, ty) => [tx * 16 + 8, ty * 16 + 14];

// ---------------- marks: the people you haunt ----------------
const markNames = ['SHOPPER', 'TOURIST', 'TEEN', 'DANCER', 'FAN'];
function mark(id, tx, ty, person, o = {}) {
  return Object.assign({ id, kind: 'mark', tx, ty, person, dir: pick(['u', 'd', 'l', 'r']), reach: 3, wait: 30 + rnd(60),
    cond: e => !F('scared_' + S.ep + '_' + id) || e.fleeT > 0 }, o);
}
function markUpdate(e) {
  e.mv = 0;
  if (e.still) { if (--e.wait <= 0) { e.wait = 90 + rnd(120); const ds = e.turn || ['u', 'd', 'l', 'r']; faceDir(e, pick(ds)); } return; }
  if (e.go > 0) {
    e.go--; const sp = e.sp || .38, nx = e.x + e.fx * sp, ny = e.y + e.fy * sp;
    if (Math.abs(nx - e.home[0]) + Math.abs(ny - e.home[1]) > e.reach * 16 || !boxFree(nx, ny - 3, 4, 3, 0)) e.go = 0; else { e.x = nx; e.y = ny; e.mv = 1; }
    return;
  }
  if (--e.wait <= 0) { e.wait = 50 + rnd(100); faceDir(e, pick(['u', 'd', 'l', 'r'])); if (Math.random() < .7) e.go = 24 + rnd(36); }
}
async function hauntMark(e) {
  const dx = PL.x - e.x, dy = PL.y - e.y, d = Math.hypot(dx, dy) || 1, dot = (dx * e.fx + dy * e.fy) / d;
  const rel = dot < -.25 ? 'back' : dot > .55 ? 'front' : 'side';
  if (F('meh_' + S.ep + '_' + e.id)) { bubble(e, pick(['STILL A GUY IN A SHEET.', '...', 'I SAW YOU THE FIRST TIME.'])); return; }
  if (rel === 'front') {
    setF('meh_' + S.ep + '_' + e.id); sfx('hurt'); e.meh = 150; bubble(e, pick(['OH. A GUY IN A SHEET.', 'IS THIS PART OF THE TOUR?', 'COOL COSTUME, MAN.', 'ARE YOU WITH THE VENUE?']));
    wstory(async () => {
      await say(pick(['No, look. I wasn\'t ready. You looked too early.', 'I can\'t start from here. You saw the setup.', 'This is a real sheet. I\'m a real ghost. Why is that not enough.']), GH);
      if (!F('tutFront')) { setF('tutFront'); await say('Haunt people from BEHIND for a perfect scare. From the side is half a scare. From the front... is just a guy in a sheet.'); }
    });
    return;
  }
  const pts = rel === 'back' ? 3 : 1;
  sfx('scream'); WD.shake = 8; e.afraid = 1; bubble(e, pick(e.lines || ['AAAAH!', 'WHAT WAS THAT?!', 'NOT AGAIN!', 'THE SHEET MOVED!']), 110);
  addFx({ k: 'num', x: e.x, y: e.y - 30, s: '+' + pts, c: hex(rel === 'back' ? '#ffff49' : '#ffffff'), t: 50 });
  for (let i = 0; i < 8; i++) addFx({ k: 'spark', x: e.x, y: e.y - 14, vx: Math.cos(i) * 1.4, vy: Math.sin(i) * 1.4 - .6, c: hex(['#ff24db', '#24dbff', '#ffff49'][i % 3]), t: 24 });
  S.applause += pts; S.total += pts; setF('scared_' + S.ep + '_' + e.id); e.fleeT = 70; e.gone = 0;
  if (rel === 'back') tickChat(pick(['BEHIND HIM', 'PERFECT HAUNT', 'W GHOST', 'HE DIDNT SEE IT COMING']));
  checkQuota();
}
function checkQuota() {
  if (WD.quota && S.applause >= WD.quota && !F('quota_' + S.ep)) { setF('quota_' + S.ep); sfx('get'); banner('THE STAR DOOR IS OPEN', 150); tickChat('THE DOOR IS OPEN'); if (WD.M.onQuota) wstory(WD.M.onQuota); }
}
function bubble(e, s, t = 90) { e.bub = { s: s.toUpperCase(), t }; }
function addFx(f) { WD.fx.push(f); }
function tickChat(m, u) { WD.tick.push({ u: u || pick(GCHAT), m, t: 260 }); if (WD.tick.length > 3) WD.tick.shift(); }
const GCHAT = ['ghostfan666', 'spooky_stan', 'face_was_right', 'alimony_bot', 'carl_defender', 'lurker', 'linda_stan', 'sheet_enjoyer', 'boogaloo_kid', 'neon_gaming', 'VHS_andy', 'sequelhater'];

// ---------------- the collectors: spooky alimony, now with shoulder pads ----------------
function collector(id, path, o = {}) {
  return Object.assign({ id, kind: 'collector', person: 'collector', tx: path[0][0], ty: path[0][1], path, pi: 0, vis: 84, wait: 0, dir: 'd', state: 0, sp: .62 }, o);
}
function collectorUpdate(e) {
  e.mv = 0;
  if (e.state === 1) { // noticed you. duck out of sight before the beat ends and he loses you
    const dx = PL.x - e.x, dy = PL.y - e.y, d = Math.hypot(dx, dy);
    if (d > e.vis * 1.2 || !los(e.x, e.y, PL.x, PL.y)) { e.state = 0; e.wait = 45; return; }
    faceDir(e, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'));
    if (--e.alert <= 0) { e.state = 2; wstory(async () => { await served(e); e.state = 0; e.wait = 120; }); }
    return;
  }
  if (e.state === 2) return;
  if (e.wait > 0) { e.wait--; return; }
  const tgt = e.path[e.pi];
  if (Math.hypot(tgt[0] - e.x, tgt[1] - e.y) < 2) { e.pi = (e.pi + 1) % e.path.length; e.wait = e.pause === undefined ? 40 : e.pause; return; }
  const a = Math.atan2(tgt[1] - e.y, tgt[0] - e.x); e.x += Math.cos(a) * e.sp; e.y += Math.sin(a) * e.sp; e.mv = 1;
  faceDir(e, Math.abs(Math.cos(a)) > Math.abs(Math.sin(a)) ? (Math.cos(a) > 0 ? 'r' : 'l') : (Math.sin(a) > 0 ? 'd' : 'u'));
  // vision: in front of him, close enough, and nothing in the way
  const dx = PL.x - e.x, dy = PL.y - e.y, d = Math.hypot(dx, dy);
  if (d < e.vis && (dx * e.fx + dy * e.fy) / (d || 1) > .6 && PL.inv <= 0 && los(e.x, e.y, PL.x, PL.y)) { e.state = 1; e.alert = 28; sfx('alert'); e.mv = 0; }
}
async function served(e) {
  sfx('caught');
  const lines = [['SPOOKY ALIMONY. YOU\'VE BEEN SERVED.', 'SIR. THESE ARE FOR YOU. ALL OF THEM.'], ['WE HAVE PAPERWORK FROM SEVERAL REALITIES. THESE ONES ARE LAMINATED.', 'THE PAYMENTS ARE RETROACTIVE. TO BEFORE YOU DIED. WITH SHOULDER PADS.']];
  await say(pick(lines[0]), 'COLLECTOR');
  await say(pick(['I\'m not hiding. I\'m unavailable in this reality.', 'Not me. Wrong ghost. There\'s a lot of us. There\'s one of us.', 'The name is Ghost. Spooky Ghost. I\'m not the one you\'re looking for. (I\'m the one you\'re looking for.)', 'Can we do this after the show? The show is on. Live.']), GH);
  if (S.applause > 0) { S.applause--; addFx({ k: 'num', x: PL.x, y: PL.y - 30, s: '-1', c: hex('#ff4949'), t: 50 }); await say('-1 APPLAUSE. THE AUDIENCE SAW THAT.'); }
  await fadeOut(.14); const [sx, sy] = WD.M.start; PL.x = sx * 16 + 8; PL.y = sy * 16 + 14; PL.inv = 90; snapCam(); e.x = e.home[0]; e.y = e.home[1]; e.pi = 0; await fadeIn(.14);
}

// ---------------- pickups: cue cards ----------------
const CARDS = ['GOOD EVENING. THE NAME IS GHOST. PAUSE FOR APPLAUSE. KEEP PAUSING.', 'THE SEQUEL SHOULD BE BIGGER. BIGGER IS A NOTE, NOT A PLAN.', 'DO NOT MENTION ALIMONY. (MENTION ALIMONY.)',
  'SHAKEN, NOT STIRRED. (YOU CANNOT HOLD THE GLASS.)', 'LOOK SMOOTH. YOU ARE SMOOTH. NOBODY HAS EVER SAID OTHERWISE. (THEY HAVE.)', 'THIS IS WHERE THE MUSIC STOPS. IT DOES NOT STOP.',
  'LOOK INTO CAMERA TWO. THERE IS A CAMERA TWO NOW. IT LOOKS BACK.', 'READ THE FAN MAIL. READ IT ALL. DON\'T PAUSE ON THE THIRD ONE.', 'YOU HAVE A LICENSE TO HAUNT. IT EXPIRED IN A DIFFERENT REALITY.',
  'THIS CARD IS BLANK ON PURPOSE. STAND THERE.', 'THE TRICK WORKS. THE TIMING IS WHAT\'S HUMILIATING.', 'ASK FACE WHO HE IS TONIGHT. (HE WILL ASK YOU.)',
  'IT IS THE SAME WOMAN. DON\'T SAY THAT ON AIR. (SAY IT ON AIR.)', 'IF LINDA IS WATCHING: SMILE. IF LINDA IS WATCHING: STAY.', 'DO NOT LEAVE DURING THE SONG.',
  'A BOOGALOO IS WHEN SOMEONE MOVES FIRST AND YOU ANSWER.', 'FINDING HER WAS NEVER THE HARD PART. THE MATH DOES THE FINDING.', 'I KNEW YOU WERE WAITING. I\'M BACK. THIS IS ME BEING BACK.'];
const cardEnt = (n, tx, ty) => ({ id: 'card' + n, kind: 'card', n, tx, ty, cond: () => !S.cards.includes(n) });
async function giveCard(n) {
  if (S.cards.includes(n)) return;
  S.cards.push(n); sfx('get');
  await say('FOUND CUE CARD ' + (n + 1) + '! (' + S.cards.length + '/' + CARDS.length + ')');
  await say('"' + CARDS[n] + '"');
  await say(pick(['I\'m just following the cards.', 'Who writes these. I write these. Why do I write these.', 'Okay. Noted. Filed. Ignored.', 'That one\'s good. Keep that one.']), GH);
}

// ---------------- the player ----------------
const frozen = () => WD.hold > 0 || !!DLG || MENUS.length > 0 || !!CARD || !!CHATBOX;
function wstory(fn) { WD.hold++; return run(async () => { try { await fn(); } finally { WD.hold = Math.max(0, WD.hold - 1); } }); }
function playerUpdate() {
  let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0), dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
  const sw = held.b && S.ecto > 0; let sp = 1.35 * (held.b ? 1.55 : 1); if (dx && dy) sp *= .707;
  PL.moving = dx || dy ? 1 : 0;
  if (dx || dy) { if (Math.abs(dx) >= Math.abs(dy) && dx) PL.dir = dx > 0 ? 'r' : 'l'; else PL.dir = dy > 0 ? 'd' : 'u'; PL.fx = dx || 0; PL.fy = dy || 0; if (dx && dy) { PL.fx = dx; PL.fy = dy; } PL.f++; }
  // phasing: swoop into a cracked wall
  if (!PL.phase && held.b && (dx || dy)) {
    const ax = PL.x + dx * 9, ay = PL.y - 4 + dy * 9;
    if (tileAt(Math.floor(ax / 16), Math.floor(ay / 16)) === 'W') {
      if (S.ecto >= 25) { S.ecto -= 25; PL.phase = 40; sfx('phase'); for (let i = 0; i < 6; i++) addFx({ k: 'spark', x: PL.x, y: PL.y - 10, vx: (Math.random() - .5) * 2, vy: (Math.random() - .5) * 2, c: hex('#24dbff'), t: 24 }); }
      else if (!PL.bumpT) { banner('NOT ENOUGH ECTO', 50); PL.bumpT = 40; }
    }
  }
  if (PL.bumpT > 0) PL.bumpT--;
  // conveyors carry you
  const under = tileAt(Math.floor(PL.x / 16), Math.floor((PL.y - 2) / 16));
  if (under === '>') PL.vx = .75; else if (under === '<') PL.vx = -.75; else PL.vx *= .5;
  moveBox(PL, dx * sp + PL.vx, dy * sp, 5, 3, PL.phase > 0);
  if (PL.phase > 0) { PL.phase--; if (!PL.phase && !boxFree(PL.x, PL.y - 3, 5, 3, 0)) PL.phase = 1; if (PL.phase > 0 && PL.phase % 3 === 0) addFx({ k: 'spark', x: PL.x, y: PL.y - 12, vx: 0, vy: -.3, c: hex('#24dbff'), t: 14 }); }
  if (PL.inv > 0) PL.inv--;
  S.ecto = Math.min(100, S.ecto + (PL.phase ? 0 : .2));
  if (pressed.a) interact();
}
function interactTarget() {
  let best = null, bd = 1e9;
  for (const e of WD.ents) {
    if (!live(e)) continue;
    const ok = e.kind === 'mark' ? !e.fleeT : (e.talk && e.kind !== 'collector') || e.kind === 'collector';
    if (!ok) continue;
    const d = dist(e, PL), r = e.range || (e.kind === 'door' ? 30 : 24);
    if (d < r && d < bd) { best = e; bd = d; }
  }
  return best;
}
function interact() {
  const e = interactTarget(); if (!e) return;
  if (e.kind === 'mark') return hauntMark(e);
  if (e.kind === 'collector') { if (e.state === 0) { e.state = 2; wstory(async () => { await served(e); e.state = 0; e.wait = 120; }); } return; }
  wstory(() => e.talk(e));
}

const worldScene = {
  update() {
    WD.t++; S.time++;
    if (WD.shake > 0) { WD.shake--; post.shake = WD.shake > 0 ? Math.min(3, WD.shake >> 1) : 0; } else post.shake = 0;
    for (const k of WD.tick) k.t--; WD.tick = WD.tick.filter(k => k.t > 0);
    for (const f of WD.fx) { f.t--; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; f.vx *= .95; f.vy *= .95; } if (f.k === 'num') f.y -= .5; }
    WD.fx = WD.fx.filter(f => f.t > 0);
    if (frozen()) return;
    if (pressed.start) { wstory(pauseMenu); return; }
    const wasL = WD.laser; WD.laser = (WD.t % 200) < 100; if (!WD.M.lasers) WD.laser = false;
    const tc = tileAt(Math.floor(PL.x / 16), Math.floor((PL.y - 2) / 16));
    if ((tc === 'L' || tc === 'M') && wasL !== WD.laser && solidPx(PL.x, PL.y - 3, 0) && PL.inv <= 0) { // the beam came on with you inside it
      S.ecto = Math.max(0, S.ecto - 40); PL.x = PL.safe[0]; PL.y = PL.safe[1]; PL.inv = 40; sfx('hurt'); WD.shake = 10; banner('ZAPPED. -40 ECTO', 60); }
    else if (tc !== 'L' && tc !== 'M') PL.safe = [PL.x, PL.y];
    playerUpdate();
    for (const e of WD.ents) {
      if (!live(e)) continue; e.t++;
      if (e.bub && --e.bub.t <= 0) e.bub = null;
      if (e.kind === 'mark') { if (e.fleeT > 0) { e.fleeT--; const a = Math.atan2(e.y - PL.y, e.x - PL.x); const nx = e.x + Math.cos(a) * 1.4, ny = e.y + Math.sin(a) * 1.4; if (boxFree(nx, ny - 3, 4, 3, 0)) { e.x = nx; e.y = ny; } e.mv = 1; faceDir(e, Math.abs(Math.cos(a)) > Math.abs(Math.sin(a)) ? (Math.cos(a) > 0 ? 'r' : 'l') : (Math.sin(a) > 0 ? 'd' : 'u')); if (e.fleeT === 0) e.gone = 1; } else if (e.meh > 0) e.meh--; else markUpdate(e); }
      else if (e.kind === 'collector') collectorUpdate(e);
      else if (e.kind === 'card' && dist(e, PL) < 12) { const n = e.n; e.gone = 1; wstory(() => giveCard(n)); }
      else if (e.upd) e.upd(e);
    }
    WD.ents = WD.ents.filter(e => !e.gone);
    if (WD.M.tick) WD.M.tick();
    exitCheck();
    // chatter
    if (WD.t % 600 === 300) tickChat(pick(['when does the sequel get good', 'the lights are PINK', 'is he gonna cry', 'haunt the guy in the leg warmers', 'ghost: pls look at camera two', 'this is better than the first one', 'this is NOT better than the first one']));
    const mw = WD.w * 16, mh = WD.h * 16;
    const tx = mw <= W ? (mw - W) / 2 : clamp(PL.x - W / 2 + PL.fx * 18, 0, mw - W), ty = mh <= H ? (mh - H) / 2 : clamp(PL.y - H / 2 - 6 + PL.fy * 12, 0, mh - H);
    camX += (tx - camX) * .12; camY += (ty - camY) * .12; if (Math.abs(tx - camX) < .5) camX = tx; if (Math.abs(ty - camY) < .5) camY = ty;
  },
  draw() { drawWorld(); drawHUD(); },
};
function exitCheck() {
  if (WD.hold) return;
  const tx = PL.x / 16, ty = (PL.y - 2) / 16;
  for (const x of (WD.M.exits || [])) if (tx >= x.x && tx < x.x + (x.w || 1) && ty >= x.y && ty < x.y + (x.h || 1)) {
    if (x.if && !x.if()) { if (!PL.noT) { PL.noT = 80; wstory(async () => { await x.no(); PL.x -= PL.fx * 12; PL.y -= PL.fy * 12; }); } continue; }
    wstory(() => goMap(x.to, x.tx, x.ty, x.dir)); return;
  }
  if (PL.noT > 0) PL.noT--;
}

// ---------------- drawing ----------------
function drawWorld() {
  cls(hex('#000012'));
  const ts = WD.ts, P = ts.P, x0 = Math.floor(camX / 16), y0 = Math.floor(camY / 16);
  const fr = (k, tx, ty) => { const a = ts.t[k]; if (!a) return null; if (a.length === 1) return a[0]; if (k === '.') return a[(tx + ty) & 1]; return a[((WD.t >> (k === '>' || k === '<' ? 2 : 4)) + (tx & 1)) % a.length]; };
  for (let ty = y0; ty <= y0 + 14; ty++) for (let tx = x0; tx <= x0 + 20; tx++) {
    if (ty < 0 || tx < 0 || ty >= WD.h || tx >= WD.w) continue;
    const k = WD.grid[ty][tx], sx = tx * 16 - Math.round(camX), sy = ty * 16 - Math.round(camY);
    if (k === '#') { draw(fr(tileAt(tx, ty + 1) === '#' ? '#t' : '#f', tx, ty), sx, sy, P); continue; }
    if (k === 'W') { draw(fr(tileAt(tx, ty + 1) === '#' || tileAt(tx, ty + 1) === 'W' ? 'Wt' : 'W', tx, ty), sx, sy, P); continue; }
    if (k === 'L' || k === 'M') { draw(fr('.', tx, ty), sx, sy, P); draw(ts.t.L[(k === 'L') === WD.laser ? 1 : 0], sx, sy, P); continue; }
    if (k === '>' || k === '<') { draw(fr(k, tx, ty), sx, sy, P); continue; }
    draw(fr('.', tx, ty), sx, sy, P);
    if (k === ',') draw(ts.t[','][0], sx, sy, P);
    else if (k === 'c') draw(ts.t.c[tileAt(tx - 1, ty) === 'c' ? 1 : 0], sx, sy, P);
    else if (ts.t[k] && 'pTto_=*S'.includes(k)) draw(fr(k, tx, ty), sx, sy, P);
  }
  if (WD.M.drawUnder) WD.M.drawUnder();
  // collector vision cones: a dither, so you can see what he can see
  for (const e of WD.ents) if (live(e) && e.kind === 'collector' && e.state !== 2) {
    const cxs = e.x - camX, cys = e.y - camY - 8, v = e.vis, col = e.state === 1 ? hex('#ff4949') : hex('#ffff49');
    for (let j = -v; j <= v; j += 3) for (let i = -v; i <= v; i += 3) { if (((i + j) / 3 & 1) !== 0) continue; const d = Math.hypot(i, j); if (d > v || d < 6) continue; if ((i * e.fx + j * e.fy) / d > .62) pset(cxs + i, cys + j, col); }
  }
  const list = WD.ents.filter(live).concat([{ isPL: 1, y: PL.y }]);
  list.sort((a, b) => a.y + (a.zs || 0) - (b.y + (b.zs || 0)));
  for (const e of list) { if (e.isPL) drawPlayer(); else drawEnt(e); }
  for (const f of WD.fx) {
    const x = f.x - camX, y = f.y - camY;
    if (f.k === 'spark') pset(x, y, f.c); else if (f.k === 'num') text(f.s, x - f.s.length * 3, y, f.c);
    else if (f.k === 'ring') ringF(x, y, 26 - f.t, f.c); else if (f.k === 'txt') text(f.s, x - f.s.length * 3, y, f.c);
  }
  if (WD.M.drawOver) WD.M.drawOver();
}
function drawEnt(e) {
  if (e.kind === 'card') { const x = e.x - camX, y = e.y - camY - 10 - Math.abs(Math.sin(e.t * .1)) * 3; draw(SG.card, x - 7, y - 7, SGP.item); if ((e.t >> 3) & 1) pset(x + 6, y - 7, WHITE); return; }
  if (e.draw) return e.draw(e);
  const s = entSprite(e); if (!s) return;
  const x = e.x - camX, y = e.y - camY;
  if (e.kind !== 'door') rectA(x - 6, y - 2, 12, 3, BLACK, .35);
  if (e.fleeT > 0 && (e.fleeT >> 2) & 1) draw(s, x - s.w / 2, y - s.h, s.P, e.flip, WHITE); else draw(s, x - s.w / 2, y - s.h + (e.sink || 0), e.P || s.P, e.flip);
  if (e.afraid && e.fleeT > 0) text('!', x - 2, y - s.h - 10, hex('#ffff49'));
  if (e.bub) { const w = e.bub.s.length * 6 + 6, bx = clamp(x - w / 2, 2, W - w - 2), by = y - s.h - 16; rectF(bx, by, w, 11, WHITE); frameRect(bx, by, w, 11, BLACK); text(e.bub.s, bx + 3, by + 2, BLACK, 0); }
  if (e.kind === 'collector' && e.state === 1) text('!', x - 2, y - s.h - 10, hex('#ff2449'));
  if (e.label && dist(e, PL) < 60) text(e.label, x - e.label.length * 3, y - s.h - 12, UI.dim);
  if (e.talk && e.kind !== 'door' && dist(e, PL) < 28 && !frozen()) text('A', x - 3, y - s.h - 8, UI.name);
}
function drawPlayer() {
  const dir = PL.dir === 'l' ? 'r' : PL.dir, set = SG.ghost[dir] || SG.ghost.d, s = set[PL.moving ? (PL.f >> 3) % 3 : (WD.t >> 4) % 3];
  const x = PL.x - camX, y = PL.y - camY, bob = Math.round(Math.sin(WD.t * .08) * 2);
  if (PL.inv > 0 && (PL.inv >> 2) & 1) return;
  rectA(x - 8, y - 2, 16, 3, BLACK, .4);
  if (PL.phase > 0) { for (let i = 0; i < 3; i++) rectA(x - 11 + i * 3, y - 28 + bob, 4, 24, hex('#24dbff'), .18); draw(s, x - 11, y - 29 + bob, SGP.ghost, PL.dir === 'l', hex('#92ffff')); return; }
  draw(s, x - 11, y - 29 + bob, SGP.ghost, PL.dir === 'l');
  if (held.b && PL.moving) for (let i = 1; i < 4; i++) rectA(x - 11 - PL.fx * i * 5, y - 22 - PL.fy * i * 5 + bob, 22, 3, hex('#ff24db'), .15);
}
function drawHUD() {
  rectA(0, 0, W, 14, BLACK, .72);
  const ok = WD.quota && S.applause >= WD.quota;
  text('CLAP ' + S.applause + '/' + (WD.quota || '-'), 4, 3, ok ? hex('#ffff49') : WHITE);
  text('ECTO', 92, 3, hex('#24dbff')); rectF(120, 4, 54, 6, hex('#002449')); rectF(121, 5, Math.round(52 * S.ecto / 100), 4, S.ecto >= 25 ? hex('#24dbff') : hex('#ff4949'));
  text('EP ' + S.ep, 180, 3, hex('#ff24db')); const tt = WD.M.title || ''; text(tt, W - tt.length * 6 - 4, 3, UI.dim);
  WD.tick.slice(-3).forEach((k, i) => { const s = (k.u + ': ' + k.m).toUpperCase().slice(0, 40); rectA(0, H - 12 - i * 10, s.length * 6 + 6, 10, BLACK, .6); text(s, 3, H - 11 - i * 10, UI.dim, 0); });
}

// ---------------- menus ----------------
const GHINT = {
  1: 'Haunt the shoppers from BEHIND. Cracked walls: hold B and float into them. When CLAP is full, the star door opens.',
  2: 'The three Lindas are behind the sigil doors in the green room. Talk to all three. Scare the dancers. Then the star door.',
  3: 'Lasers blink on and off. Wait for the gap. Face is at the top. Scare the techs first.',
  4: 'The turntables carry you sideways. Operators face their desks: come from behind. The host is on the set.',
  5: 'The collectors are everywhere. Stay out of their cones. Haunt the jury. Then the bench.',
  6: 'It\'s a drive-in. Haunt the people in the cars. Start the projector. Then the screen.',
  7: 'It\'s after hours. The department is empty. Go to the middle. Stay for the song.',
};
async function pauseMenu() {
  sfx('tick');
  for (;;) {
    const i = await choose(['CUE CARDS', 'NARRATE', 'STATUS', 'SAVE', 'CLOSE'], { x: W - 110, y: 20, cancel: 1 });
    if (i === 0) {
      if (!S.cards.length) { await say('No cards. I\'m improvising. This is what improvising looks like. It looks great.', GH); continue; }
      const list = S.cards.slice().sort((a, b) => a - b);
      const j = await choose(list.map(n => 'CARD ' + (n + 1)), { x: 20, y: 20, cancel: 1 });
      if (j >= 0) await say('"' + CARDS[list[j]] + '"');
      continue;
    }
    if (i === 1) { await say(pick(['Picture it. A ghost. Alone. With a goal. Here is the goal:', 'Let me narrate. It helps. It helps me.', 'In a darkness deeper than... okay, the practical version:']), GH); return say(GHINT[S.ep] || 'Go home. Wherever that is.', GH); }
    if (i === 2) { await statusScreen(); continue; }
    if (i === 3) { saveS(); sfx('ok'); return say('SAVED. THE SHOW WILL RESUME AFTER THESE MESSAGES.'); }
    return;
  }
}
function saveS() { if (!S) return; S.map = WD.id; S.x = Math.floor(PL.x / 16); S.y = Math.floor((PL.y - 2) / 16); S.dir = PL.dir; store('sg2_save', S); }
async function statusScreen() {
  const prev = scene, mins = Math.floor(S.time / 3600);
  scene = { draw() {
    cls(hex('#100024')); panel(8, 8, W - 16, H - 16);
    text('SPOOKY GHOST 2', 24, 20, hex('#ff24db')); text('EPISODE ' + S.ep + ' OF 7', 200, 20, UI.dim);
    const rows = [['APPLAUSE', S.applause + ' / ' + (WD.quota || 0)], ['CAREER APPLAUSE', S.total], ['CUE CARDS', S.cards.length + ' / ' + CARDS.length], ['ECTO', Math.round(S.ecto) + '%'], ['TIME', mins + ' MIN'], ['STARS', Object.values(S.stars).reduce((a, b) => a + b, 0) + ' / 30']];
    rows.forEach(([a, b], i) => { text(a, 24, 44 + i * 16, WHITE); text(String(b), 180, 44 + i * 16, UI.name); });
    text('SOUL OF THE SHOW: YES', 24, 150, UI.dim); text('ACCOUNTABILITY: LOADING', 24, 164, UI.dim); text('HUMAN NAME: [[[[[', 24, 178, UI.dim);
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}

// ---------------- sigil (the old math-but-older) ----------------
async function sigil(len) {
  const DIRN = ['up', 'down', 'left', 'right'], GLY = { up: '^', down: 'v', left: '<', right: '>' }, PITCH = { up: 880, down: 440, left: 587, right: 659 };
  const seq = Array.from({ length: len }, () => pick(DIRN));
  let show = -1, got = 0, state = 'show', flash = 0, t = 0;
  const prev = scene;
  scene = { update() { t++; }, draw() {
    prev.draw();
    panel(70, 40, 180, 130); ctext(state === 'show' ? 'WATCH THE SIGIL' : 'DRAW IT BACK', 50, UI.name);
    for (let a = 0; a < 64; a++) { const an = a / 64 * 6.28; pset(160 + Math.cos(an) * 34, 104 + Math.sin(an) * 28, hex(a % 2 ? '#ff24db' : '#24dbff')); }
    const gl = state === 'show' ? (show >= 0 ? GLY[seq[show]] : '') : (flash > 0 ? GLY[seq[got - 1]] : '');
    if (gl) text(gl, 160 - 9, 104 - 12, WHITE, hex('#ff24db'), 4);
    if (state === 'input') { flash = Math.max(0, flash - 1); text(seq.slice(0, got).map(d => GLY[d]).join(' '), 84, 150, hex('#6dff24')); text('B: GIVE UP', 190, 150, UI.dim); }
  } };
  await wait(30);
  for (let i = 0; i < len; i++) { show = i; tone(PITCH[seq[i]], .25, { type: 'square', vol: .2 }); await wait(30); show = -1; await wait(8); }
  state = 'input'; DBG.mode = 'sigil'; DBG.sg = { seq, got: () => got };
  const done = r => { DBG.mode = null; scene = prev; return r; };
  while (got < len) {
    await nextFrame();
    if (pressed.b) return done(false);
    for (const d of DIRN) if (pressed[d]) {
      if (d === seq[got]) { got++; flash = 14; tone(PITCH[d], .15, { type: 'square', vol: .2 }); }
      else { sfx('hurt'); await wait(20); return done(false); }
    }
  }
  await wait(20); sfx('get'); return done(true);
}
async function sigilDoor(tx, ty, key, len) {
  if (F(key)) return;
  await say('A SIGIL. It works like math, but older. The formula is ' + len + ' strokes long.');
  if (!F('tutSigil')) { setF('tutSigil'); await say('Watch the strokes, then draw them back with the arrows. B gives up.'); }
  if (await sigil(len)) { setF(key); setTile(tx, ty, ','); sfx('door'); await say(pick(['And THAT is not a trick. That\'s a formula. Write it down. Credit me.', 'Real magic. Nobody clapped. Nobody was watching. Typical.']), GH); }
  else await say(pick(['The trick works. The timing is what\'s humiliating.', 'I can read it. Give me a second. Stop touching the circle.']), GH);
}
// a sigil door is a tile 'S' plus an entity that you talk to
const sigDoor = (id, tx, ty, key, len) => ({ id, kind: 'prop', tx, ty, draw: () => {}, range: 26, cond: () => !F(key), talk: () => sigilDoor(tx, ty, key, len) });

// ---------------- the entrance: float down into the spotlight ----------------
async function descend() {
  let t = 0, gx = 140, gy = -50, sx = 160, go = false, landed = false;
  const prev = scene, pm = curName; music('show');
  scene = {
    update() { t++; sx = 160 + Math.sin(t / 34) * 96; if (!go || landed) return; if (held.left) gx -= 2.2; if (held.right) gx += 2.2; gx = clamp(gx, 0, W - 44); gy += .8; if (gy >= 120) landed = true; },
    draw() {
      skyD(0, H, '#000024', '#24006d');
      for (let x = 0; x < W; x += 16) { rectF(x, 0, 8, 40, hex('#6d24b6')); rectF(x + 8, 0, 8, 40, hex('#49246d')); }
      rectF(0, 40, W, 3, hex('#ff24db'));
      rectF(0, 168, W, 56, hex('#24006d')); for (let x = 0; x < W; x += 20) rectF(x, 170, 10, 54, hex('#49246d'));
      for (let y = 44; y < 168; y++) { const w = (y - 44) / 124 * 24 + 5; for (let x = sx - w; x < sx + w; x++) if (((x | 0) + y) % 2 === 0) pset(x, y, hex('#ffff92')); }
      rectA(sx - 28, 164, 56, 8, hex('#ffffff'), .6);
      drawScaled(SG.ghost.d[(t >> 3) % 3], gx, gy, SGP.ghost, 2);
      rectA(0, 0, W, 14, BLACK, .6); text('THE ENTRANCE', 4, 3, hex('#ff24db'));
    },
  };
  await say('THE ENTRANCE! Float down into the spotlight. LEFT and RIGHT to steer.');
  go = true; DBG.mode = 'descend'; DBG.ds = () => ({ gx: gx + 22, sx });
  while (!landed) await nextFrame();
  DBG.mode = null;
  const dist0 = Math.abs(gx + 22 - sx), pts = dist0 < 10 ? 5 : dist0 < 28 ? 3 : 0;
  sfx(pts ? 'get' : 'hurt');
  await say('ENTRANCE: ' + (pts === 5 ? 'PERFECT' : pts === 3 ? 'GOOD' : 'MISSED THE LIGHT') + '. +' + pts + ' APPLAUSE.');
  S.applause += pts; S.total += pts;
  await say(pts === 5 ? pick(['Thank you. Thank you. Hold it. Hold the applause. No, keep it.', 'That. THAT is how you arrive.'])
    : pts === 3 ? pick(['Close. The light moved. Lights shouldn\'t move.', 'Good. Good is a word. It\'s not my word, but it\'s a word.'])
    : pick(['No, look up. You missed the whole descent. I can\'t start from here.', 'The spotlight was over there. I was over here. That\'s the show now.']), GH);
  scene = prev; music(pm);
  return pts;
}
