'use strict';
// ================= SCREEN =================
const W = 160, H = 144, TS = 16;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const IMG = ctx.createImageData(W, H);
const buf = new Uint8Array(W * H);        // color index 0 (light) .. 3 (dark)
const lcd = new Float32Array(W * H * 3);  // DMG LCD ghosting
const PALS = {
  dmg:  [[155,188,15],[139,172,15],[48,98,48],[15,56,15]],
  off:  [[128,140,40],[128,140,40],[128,140,40],[128,140,40]],
  dead: [[168,170,158],[118,120,110],[64,66,60],[18,18,18]],
  red:  [[155,188,15],[150,110,40],[118,30,22],[30,6,6]],
  gold: [[228,244,196],[146,190,110],[52,104,86],[8,24,32]],
};
const fx = { wave:0, cycle:0, invert:0, fade:0, noise:0, shake:0, pal:'dmg', roll:0 };
let camX = 0, camY = 0, frame = 0;
let HERO = 'CARL'; // who narrates scenery when you examine it; each cartridge sets its own
const DBG = {}; // read-only peek into minigame state for the automated playtest bot

function fit() {
  const s = Math.max(1, Math.min(innerWidth / W, innerHeight / H));
  const si = s >= 2 ? Math.floor(s) : s;
  const wrap = document.getElementById('wrap');
  wrap.style.width = W * si + 'px'; wrap.style.height = H * si + 'px';
  const g = document.getElementById('grid');
  g.style.backgroundImage = si >= 3 ? 'linear-gradient(rgba(0,0,0,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.07) 1px,transparent 1px)' : 'none';
  g.style.backgroundSize = si + 'px ' + si + 'px';
}
addEventListener('resize', fit);

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rnd = n => (Math.random() * n) | 0;
const pick = a => a[rnd(a.length)];
function cls(c) { buf.fill(c); }
function px(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) buf[y * W + x] = c; }
function rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, c); }
function box(x, y, w, h) {
  rect(x, y, w, h, 3); rect(x + 1, y + 1, w - 2, h - 2, 0);
  rect(x + 2, y + 2, w - 4, 1, 2); rect(x + 2, y + h - 3, w - 4, 1, 2);
  rect(x + 2, y + 2, 1, h - 4, 2); rect(x + w - 3, y + 2, 1, h - 4, 2);
}
function blit(s, x, y, flip, map) {
  x |= 0; y |= 0;
  for (let j = 0; j < s.h; j++) {
    const yy = y + j; if (yy < 0 || yy >= H) continue;
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + (flip ? s.w - 1 - i : i)]; if (c === 255) continue;
      const xx = x + i; if (xx < 0 || xx >= W) continue;
      buf[yy * W + xx] = map ? map[c] : c;
    }
  }
}

function present() {
  const pal = PALS[fx.pal] || PALS.dmg, d = IMG.data, t = frame;
  const sh = fx.shake ? rnd(fx.shake * 2 + 1) - fx.shake : 0;
  const cyc = fx.cycle ? ((t / fx.cycle) | 0) & 3 : 0;
  const fade = fx.fade | 0, lk = fx.lcd || .55; // fx.lcd: lower = blurrier LCD ghosting
  for (let y = 0; y < H; y++) {
    const sy = (((y + (fx.roll | 0)) % H) + H) % H;
    const off = (fx.wave ? Math.round(Math.sin(sy * 0.12 + t * 0.07) * fx.wave) : 0) + sh;
    for (let x = 0; x < W; x++) {
      const sx = (((x + off) % W) + W) % W;
      let c = buf[sy * W + sx];
      if (cyc) c = (c + cyc) & 3;
      if (fx.invert) c = 3 - c;
      if (fade) c = clamp(c + fade, 0, 3);
      if (fx.noise && Math.random() < fx.noise) c = rnd(4);
      const p = pal[c], i = y * W + x, j = i * 3, k = i * 4;
      lcd[j] += (p[0] - lcd[j]) * lk; lcd[j + 1] += (p[1] - lcd[j + 1]) * lk; lcd[j + 2] += (p[2] - lcd[j + 2]) * lk;
      d[k] = lcd[j]; d[k + 1] = lcd[j + 1]; d[k + 2] = lcd[j + 2]; d[k + 3] = 255;
    }
  }
  ctx.putImageData(IMG, 0, 0);
}

// ================= FONT (5x7) =================
const FONT = {};
(() => {
  const src = {
    A:'0E11111F111111',B:'1E11111E11111E',C:'0E11101010110E',D:'1C12111111121C',E:'1F10101E10101F',F:'1F10101E101010',
    G:'0E11101711110F',H:'1111111F111111',I:'0E04040404040E',J:'0702020202120C',K:'11121418141211',L:'1010101010101F',
    M:'111B1515111111',N:'11111915131111',O:'0E11111111110E',P:'1E11111E101010',Q:'0E11111115120D',R:'1E11111E141211',
    S:'0F10100E01011E',T:'1F040404040404',U:'1111111111110E',V:'11111111110A04',W:'1111111515150A',X:'11110A040A1111',
    Y:'1111110A040404',Z:'1F01020408101F',
    0:'0E11131519110E',1:'040C040404040E',2:'0E11010204081F',3:'1F02040201110E',4:'02060A121F0202',5:'1F101E0101110E',
    6:'0608101E11110E',7:'1F010204080808',8:'0E11110E11110E',9:'0E11110F01020C',
    '.':'00000000000C0C',',':'000000000C0408','!':'04040404040004','?':'0E110102040004',"'":'0C040800000000',
    '-':'0000001F000000',':':'000C0C000C0C00','/':'00010204081000','(':'02040808080402',')':'08040202020408',
    '"':'0A0A0A00000000','>':'080C0E0F0E0C08','<':'02060E1E0E0602','*':'0004150E150400','+':'0004041F040400',
    '=':'00001F001F0000','#':'0A0A1F0A1F0A0A','&':'0C121408151209','_':'0000000000001F','%':'18190204081303',
    '~':'00000815020000','@':'000A1F1F0E0400','^':'040E1F04040404','v':'040404041F0E04',
    '$':'040F140E051E04','[':'1F1F1F1F1F1F1F',
  };
  for (const k in src) { const h = src[k], r = []; for (let i = 0; i < 7; i++) r.push(parseInt(h.substr(i * 2, 2), 16)); FONT[k] = r; }
})();
// NOTE: 'v' is kept lowercase on purpose = down arrow glyph; '@' = heart; '[' = solid block
function text(s, x, y, c = 3) {
  s = String(s); const ox = x;
  for (const ch0 of s) {
    if (ch0 === '\n') { y += 10; x = ox; continue; }
    const ch = ch0 === 'v' ? 'v' : ch0.toUpperCase();
    const g = FONT[ch];
    if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) px(x + i, y + j, c);
    x += 6;
  }
}
const ctext = (s, y, c) => text(s, ((W - s.length * 6) / 2) | 0, y, c);

// ================= INPUT =================
const KEYMAP = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', KeyW:'up', KeyS:'down', KeyA:'left', KeyD:'right',
  KeyZ:'a', KeyJ:'a', Space:'a', KeyX:'b', KeyK:'b', Enter:'start', ShiftRight:'select', ShiftLeft:'select', Backspace:'select' };
const BTNS = ['up','down','left','right','a','b','start','select'];
const held = {}, pressed = {}, kb = {};
let anyKey = false;
addEventListener('keydown', e => {
  anyKey = true;
  if (typeof audioInit === 'function') audioInit();
  if (e.code === 'KeyF') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
  const k = KEYMAP[e.code]; if (k) { kb[k] = 1; e.preventDefault(); }
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) kb[k] = 0; });
addEventListener('blur', () => { for (const k in kb) kb[k] = 0; });
function pollInput() {
  const gp = {};
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) {
    if (!p) continue;
    const b = i => p.buttons[i] && p.buttons[i].pressed;
    if (b(0)) gp.a = 1; if (b(1) || b(2)) gp.b = 1; if (b(9)) gp.start = 1; if (b(8)) gp.select = 1;
    if (b(12) || p.axes[1] < -.5) gp.up = 1; if (b(13) || p.axes[1] > .5) gp.down = 1;
    if (b(14) || p.axes[0] < -.5) gp.left = 1; if (b(15) || p.axes[0] > .5) gp.right = 1;
    if (BTNS.some(k => gp[k])) { anyKey = true; if (typeof audioInit === 'function') audioInit(); }
  }
  for (const k of BTNS) { const h = !!(kb[k] || gp[k]); pressed[k] = h && !held[k]; held[k] = h; }
}

// ================= LOOP / ASYNC =================
let scene = null, waiters = [];
const nextFrame = () => new Promise(r => waiters.push(r));
async function wait(n) { while (n-- > 0) await nextFrame(); }
async function waitBtn() { await nextFrame(); while (!(pressed.a || pressed.b || pressed.start)) await nextFrame(); }
let lastT = performance.now(), acc = 0;
function loop(t) {
  acc = Math.min(acc + (t - lastT), 50); lastT = t;
  if (acc >= 16) { // one step per callback max: keeps input edges intact on 120/144hz
    acc -= 16.667;
    pollInput(); frame++;
    if (scene && scene.update) scene.update();
    const w = waiters; waiters = []; w.forEach(r => r());
    if (scene && scene.draw) scene.draw(); else cls(0);
    drawOverlay();
    present();
  }
  requestAnimationFrame(loop);
}
let busy = 0;
function run(fn) {
  busy++;
  return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => busy--);
}

// ================= FADES =================
async function fadeTo(v, sp = 5) { while (fx.fade !== v) { fx.fade += Math.sign(v - fx.fade); await wait(sp); } }
const fadeOut = sp => fadeTo(3, sp), fadeIn = sp => fadeTo(0, sp), whiteOut = sp => fadeTo(-3, sp);

// ================= DIALOG =================
let dlg = null, menus = [], chatBox = null, bannerTxt = null, bannerT = 0, card = null;
function wrap(s, n) {
  const out = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w;
    }
    out.push(line);
  }
  return out;
}
let VOICE = {}; // name -> [freq, jitter]  (story fills it)
async function say(s, name, o = {}) {
  const lines = wrap(String(s).toUpperCase(), 24);
  const v = VOICE[name] || VOICE._ || [900, 0];
  for (let p = 0; p < lines.length; p += 3) {
    const pg = lines.slice(p, p + 3), all = pg.join(''), total = all.length;
    dlg = { name, lines: pg, n: 0, arrow: 0 };
    await nextFrame();
    let last = -1;
    while (dlg.n < total) {
      if (pressed.a || pressed.b) { dlg.n = total; break; }
      dlg.n += o.slow ? 0.2 : 0.7;
      const i = dlg.n | 0;
      if (i !== last && i % 2 === 0 && all[i] && all[i] !== ' ') sfx('blip', v[0] + (Math.random() - .5) * v[1]);
      last = i;
      await nextFrame();
    }
    if (o.auto) await wait(o.auto);
    else { dlg.arrow = 1; await waitBtn(); sfx('tick'); }
  }
  if (!o.keep) dlg = null;
}
// menu: returns index, or -1 if cancelled
async function choose(opts, o = {}) {
  const w = Math.max(...opts.map(s => s.length)) * 6 + 20, h = opts.length * 11 + 10;
  const m = { opts, i: 0, x: o.x !== undefined ? o.x : W - w, y: o.y !== undefined ? o.y : (dlg ? H - 44 - h : H - h), w, h };
  menus.push(m);
  await nextFrame();
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (pressed.a) { sfx('ok'); break; }
    if (pressed.b && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame();
  }
  menus.splice(menus.indexOf(m), 1);
  return m.i;
}
async function ask(q, name, opts) { await say(q, name, { keep: 1 }); const r = await choose(opts); dlg = null; return r; }
function banner(s, t = 110) { bannerTxt = s; bannerT = t; }
async function showCard(lines, t, o = {}) {
  card = { lines, inv: o.inv }; if (t) await wait(t); else await waitBtn();
  if (!o.keep) card = null;
}
async function chat(msgs) {
  chatBox = { msgs: [] };
  for (const m of msgs) {
    chatBox.msgs.push(m); sfx('chat');
    await wait(m.d || 45);
  }
  await waitBtn(); chatBox = null;
}
function drawOverlay() {
  if (card) {
    cls(card.inv ? 0 : 3);
    const y0 = ((H - card.lines.length * 10) / 2) | 0;
    card.lines.forEach((l, i) => ctext(l, y0 + i * 10, card.inv ? 3 : 0));
  }
  if (bannerT > 0) {
    bannerT--;
    const w = bannerTxt.length * 6 + 14; box(((W - w) / 2) | 0, 6, w, 17); ctext(bannerTxt, 11);
  }
  if (chatBox) {
    box(0, 0, W, 92); rect(3, 3, W - 6, 10, 3); text('LIVE CHAT', 6, 5, 0); text('@' + (chatBox.msgs.length * 7 + 211), 118, 5, 0);
    const rows = [];
    for (const m of chatBox.msgs) { rows.push([m.u + ':', 2]); for (const l of wrap(m.m.toUpperCase(), 23)) rows.push([' ' + l, 3]); }
    const vis = rows.slice(-7);
    vis.forEach((r, i) => text(r[0], 6, 17 + i * 10, r[1]));
  }
  if (dlg) {
    const y = H - 44; box(0, y, W, 44);
    let n = dlg.n | 0;
    dlg.lines.forEach((l, i) => { text(l.slice(0, Math.max(0, n)), 8, y + 8 + i * 11); n -= l.length; });
    if (dlg.name) { const w = dlg.name.length * 6 + 9; box(3, y - 12, w, 14); text(dlg.name, 7, y - 9); }
    if (dlg.arrow && (frame >> 4) & 1) text('v', W - 14, H - 11);
  }
  for (const m of menus) {
    box(m.x, m.y, m.w, m.h);
    m.opts.forEach((s, i) => { text(s, m.x + 14, m.y + 6 + i * 11); if (i === m.i) text('>', m.x + 6, m.y + 6 + i * 11); });
  }
}

// ================= SAVE =================
const newState = () => ({ map: 'ship', x: 4, y: 3, dir: 'down', flags: {}, items: [], time: 0, haze: 0, steps: 0 });
let S = newState();
const F = k => S.flags[k];
const setF = (k, v = 1) => { S.flags[k] = v; };
const has = it => S.items.includes(it);
function store(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
function fetchStore(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
function saveGame() { S.map = M.id; S.x = P.x; S.y = P.y; S.dir = P.dir; store('carl_sav', S); }
let META = fetchStore('carl_meta') || { boots: 0, endings: 0 };
const saveMeta = () => store('carl_meta', META);

// ================= WORLD =================
const DIRS = { up:[0,-1], down:[0,1], left:[-1,0], right:[1,0] };
const OPP = { up:'down', down:'up', left:'right', right:'left' };
const LET = { U:'up', D:'down', L:'left', R:'right' };
let M = null;
const P = { x:0, y:0, px:0, py:0, dir:'down', mv:0, walk:0, spr:'carl', bumpT:0, speed:1 };
const TILES = {}, SPR = {}, MAPS = {};
let LEGEND = {};

function tileAt(x, y) { return (x < 0 || y < 0 || x >= M.w || y >= M.h) ? null : M.t[y][x]; }
function tdef(x, y) { const n = tileAt(x, y); return n ? TILES[n] : null; }
function setTile(x, y, n) { M.t[y][x] = n; }
function visible(e) {
  if (e.gone) return false;
  if (e.if && !e.if()) return false;
  if (e.haze && !(S.haze > 0) && !(e.keep && F(e.keep))) return false;
  if (e.sober && S.haze > 0) return false;
  return true;
}
const covers = (e, x, y) => x >= e.x && x < e.x + (e.w || 1) && y >= e.y && y < e.y + (e.h || 1);
function entAt(x, y) { return M.ents.find(e => visible(e) && covers(e, x, y)); }
function ent(id) { return M.ents.find(e => e.id === id); }
function blocked(x, y, self) {
  const T = tdef(x, y); if (!T || T.solid) return true;
  if (self !== P && P.x === x && P.y === y) return true;
  return M.ents.some(e => e !== self && e.solid && visible(e) && covers(e, x, y));
}
function loadMap(id, x, y, dir) {
  const def = MAPS[id];
  const leg = Object.assign({}, LEGEND, def.legend || {});
  M = { id, def, w: def.rows[0].length, h: def.rows.length };
  M.t = def.rows.map(r => [...r].map(ch => leg[ch] || 'void'));
  M.ents = (def.ents ? def.ents() : []).map(e => Object.assign({ dir:'down', solid:true, mv:0, walk:0, pi:0, wait:0 }, e, { px: e.x * TS, py: e.y * TS }));
  Object.assign(P, { x, y, px: x * TS, py: y * TS, mv: 0 });
  if (dir) P.dir = dir;
  S.map = id;
  if (def.init) def.init();
  if (def.music !== undefined) music(def.music);
  cam();
}
async function warp(id, x, y, dir, o = {}) {
  if (!o.silent) sfx('door');
  await fadeOut(o.sp || 4);
  loadMap(id, x, y, dir);
  await wait(6);
  await fadeIn(o.sp || 4);
  const def = MAPS[id];
  if (def.title && !F('seen_' + id)) { setF('seen_' + id); banner(def.title); }
  if (def.enter) await def.enter();
}
function cam() {
  const cw = M.w * TS, ch = M.h * TS;
  camX = cw <= W ? ((cw - W) / 2) | 0 : clamp(P.px + 8 - W / 2, 0, cw - W) | 0;
  camY = ch <= H ? ((ch - H) / 2) | 0 : clamp(P.py + 8 - H / 2, 0, ch - H) | 0;
}
function stepMove(e, sp) {
  const tx = e.x * TS, ty = e.y * TS;
  e.px += Math.sign(tx - e.px) * Math.min(sp, Math.abs(tx - e.px));
  e.py += Math.sign(ty - e.py) * Math.min(sp, Math.abs(ty - e.py));
  e.walk += sp;
  if (e.px === tx && e.py === ty) { e.mv = 0; return true; }
  return false;
}
// scripted movement: "UUL" moves, "u" = turn only
async function walk(e, path, sp = 1) {
  for (const c of path) {
    const d = LET[c.toUpperCase()]; e.dir = d;
    if (c === c.toLowerCase()) { await wait(10); continue; }
    e.x += DIRS[d][0]; e.y += DIRS[d][1]; e.mv = 1; e.speed = sp;
    while (e.mv) await nextFrame();
  }
}
function interact() {
  const [dx, dy] = DIRS[P.dir], fx_ = P.x + dx, fy = P.y + dy;
  const e = entAt(fx_, fy);
  if (e && e.talk) { if (e.turns) e.dir = OPP[P.dir]; run(() => e.talk(e)); return; }
  const sg = M.def.signs && M.def.signs[fx_ + ',' + fy];
  if (sg) { run(typeof sg === 'function' ? sg : () => say(sg)); return; }
  const T = tdef(fx_, fy);
  if (T && T.look) run(() => say(Array.isArray(T.look) ? pick(T.look) : T.look, HERO));
}
function updatePlayer() {
  if (P.bumpT > 0) P.bumpT--;
  if (P.mv) { if (stepMove(P, busy ? P.speed : (held.b && !M.def.noRun ? 2 : 1)) && !busy) arrive(); return; }
  if (busy) return;
  if (pressed.start) { run(startMenu); return; }
  if (pressed.a) { interact(); return; }
  const d = held.up ? 'up' : held.down ? 'down' : held.left ? 'left' : held.right ? 'right' : null;
  if (!d) return;
  P.dir = d;
  const nx = P.x + DIRS[d][0], ny = P.y + DIRS[d][1];
  if (nx < 0 || ny < 0 || nx >= M.w || ny >= M.h) { const ex = M.def.exits && M.def.exits[d]; if (ex) run(() => ex(P.x, P.y)); return; }
  if (blocked(nx, ny, P) && !(P.phase && P.phase(nx, ny))) { if (!P.bumpT) { sfx('bump'); P.bumpT = 18; } return; }
  P.x = nx; P.y = ny; P.mv = 1;
}
function arrive() {
  S.steps++;
  const k = P.x + ',' + P.y;
  const st = M.def.steps && M.def.steps[k];
  if (st) { run(st); return; }
  if (M.def.step) { const f = M.def.step(P.x, P.y); if (f) run(f); }
}
function patrol(e) {
  if (e.wait > 0) { e.wait--; return; }
  const c = e.path[e.pi % e.path.length]; e.pi++;
  if (c === '.') { e.wait = e.pause || 24; return; }
  const d = LET[c.toUpperCase()]; e.dir = d;
  if (c === c.toLowerCase()) { e.wait = e.pause || 24; return; }
  const nx = e.x + DIRS[d][0], ny = e.y + DIRS[d][1];
  if (!blocked(nx, ny, e)) { e.x = nx; e.y = ny; e.mv = 1; } else { e.pi--; e.wait = 20; }
}
function sees(e) {
  const [dx, dy] = DIRS[e.dir]; let x = e.x, y = e.y;
  for (let i = 0; i < (e.vision || 3); i++) {
    x += dx; y += dy;
    if (P.x === x && P.y === y) return true;
    const T = tdef(x, y); if (!T || T.solid) return false;
  }
  return false;
}
function updateEnts() {
  for (const e of M.ents) {
    if (e.mv) { stepMove(e, e.speed || 1); continue; }
    if (busy && !e.always) continue;
    if (e.update) e.update(e);
    if (!busy && e.vision && visible(e) && sees(e) && M.def.caught) { run(() => M.def.caught(e)); return; }
  }
}
function sprFrame(e) {
  const s = SPR[e.spr]; if (!s) return null;
  if (s.down) {
    const set = (e.dir === 'left' || e.dir === 'right') ? s.side : s[e.dir];
    let i = 0;
    if (e.mv || e.anim) { const ph = ((e.walk >> 3) + (e.anim ? frame >> 4 : 0)) & 3; i = ph === 1 ? 1 : ph === 3 ? (set.length > 2 ? 2 : 1) : 0; }
    return [set[i], e.dir === 'left'];
  }
  if (Array.isArray(s)) return [s[((frame / (e.spd || 20)) | 0) % s.length], e.flip];
  return [s, e.flip];
}
function drawEnt(e) {
  const f = sprFrame(e); if (!f) return;
  const [s, flip] = f;
  const bob = e.bob ? Math.round(Math.sin(frame * 0.08 + e.x) * 2) : 0;
  const x = e.px - camX, y = e.py - camY - (s.h - (e.h || 1) * TS) + bob;
  blit(s, x, y, flip, e.pmap);
  if (e.emote && e.emoteT > 0) { e.emoteT--; box(x + 3, y - 13, 11, 12); text(e.emote, x + 6, y - 11); }
}
function emote(e, ch, t = 50) { e.emote = ch; e.emoteT = t; sfx(ch === '!' ? 'alert' : 'tick'); return wait(t); }
function drawWorld() {
  cls(3);
  const x0 = Math.floor(camX / TS), y0 = Math.floor(camY / TS);
  for (let ty = y0; ty <= y0 + 9; ty++) for (let tx = x0; tx <= x0 + 10; tx++) {
    const n = tileAt(tx, ty); if (!n) continue;
    const T = TILES[n]; if (!T) continue;
    blit(T.f[((frame / (T.spd || 30)) | 0) % T.f.length], tx * TS - camX, ty * TS - camY);
  }
  const list = M.ents.filter(visible);
  if (!P.hidden) list.push(P);
  list.sort((a, b) => (a.floor ? -1e6 : 0) + a.py + (a.h || 1) * TS - ((b.floor ? -1e6 : 0) + b.py + (b.h || 1) * TS));
  for (const e of list) drawEnt(e);
  if (M.def.draw) M.def.draw();
}
const worldScene = {
  update() {
    updatePlayer(); updateEnts();
    S.time += 1 / 60;
    if (S.haze > 0 && !busy) S.haze--;
    const d = M.def;
    fx.wave = (d.wave || 0) + (S.haze > 0 ? 1.5 + Math.sin(frame * .02) : 0) + (fxAdd.wave || 0);
    fx.cycle = S.haze > 0 && S.haze % 600 < 120 ? 10 : (d.cycle || fxAdd.cycle || 0);
    fx.noise = (d.noise || 0) + (fxAdd.noise || 0);
    if (d.tick) d.tick();
  },
  draw() { cam(); drawWorld(); },
};
const fxAdd = {};
