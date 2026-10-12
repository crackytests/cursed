'use strict';
// ================= KONBINI WARS: the "nearly Windows" desktop =================
// Mouse first (the pointer layer is dm/dmgame.js's), and every click also works from the keyboard:
// arrows move the cursor, Z clicks, X is a right-click, Tab cycles windows.
const MOUSE = { x: 256, y: 128, down: 0, click: 0, rclick: 0, on: 0, mv: 0, wheel: 0 };
(() => {
  const cv = document.getElementById('c'); if (!cv || !cv.addEventListener) return;
  const pos = e => { MOUSE.mv = 1; const r = cv.getBoundingClientRect(); MOUSE.x = (e.clientX - r.left) / r.width * 512; MOUSE.y = (e.clientY - r.top) / r.height * 256; MOUSE.on = 1; anyKey = true; if (typeof audioInit === 'function') audioInit(); };
  cv.addEventListener('mousemove', pos);
  cv.addEventListener('mousedown', e => { pos(e); if (e.button === 2) MOUSE.rclick = 1; else { MOUSE.down = 1; MOUSE.click = 1; } e.preventDefault(); });
  addEventListener('mouseup', () => { MOUSE.down = 0; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('wheel', e => { MOUSE.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
})();
const hit = (x, y, w, h) => MOUSE.x >= x && MOUSE.x < x + w && MOUSE.y >= y && MOUSE.y < y + h;
// keyboard cursor: when no dialogue or menu is up, the arrows drive the pointer
const KCUR = { on: 0 };
{ const _poll = pollInput; pollInput = function () { _poll();
  if (MOUSE.click && (DLG || CARD) && !MENUS.length) { pressed.a = true; MOUSE.click = 0; }
  if (DLG || CARD || MENUS.length) return;
  const sp = held.c ? 6 : 3; let mv = 0;
  if (held.left) { MOUSE.x -= sp; mv = 1; } if (held.right) { MOUSE.x += sp; mv = 1; } if (held.up) { MOUSE.y -= sp * .66; mv = 1; } if (held.down) { MOUSE.y += sp * .66; mv = 1; }
  if (mv) { MOUSE.x = clamp(MOUSE.x, 0, 511); MOUSE.y = clamp(MOUSE.y, 0, 255); MOUSE.on = 1; MOUSE.mv = 1; }
  if (pressed.a) { MOUSE.click = 1; MOUSE.down = 1; KCUR.down = 1; } else if (KCUR.down && !held.a) { MOUSE.down = 0; KCUR.down = 0; }
  if (pressed.b) MOUSE.rclick = 1;
}; }

// ---------- the look: grey bevels, navy title bars ----------
const WIN = { face: hex('#bcbcbc'), lite: hex('#ffffff'), shade: hex('#7a7a7a'), dark: hex('#202020'), ink: hex('#101010'), dim: hex('#606060'),
  title: hex('#0a2a84'), title2: hex('#2a78d8'), off: hex('#7a7a7a'), off2: hex('#b0b0b0'), sel: hex('#0a2a84'), field: hex('#f4f4f4'), desk: hex('#2a6a6a'),
  red: hex('#c01818'), green: hex('#108a20'), gold: hex('#c88a00') };
Object.assign(UI, { frame: WIN.dark, frame2: WIN.shade, panel: WIN.face, panel2: WIN.face, hi: WIN.title });
function bevel(x, y, w, h, inset, face = WIN.face) {
  rectF(x, y, w, h, face);
  const a = inset ? WIN.shade : WIN.lite, b = inset ? WIN.lite : WIN.dark;
  rectF(x, y, w, 1, a); rectF(x, y, 1, h, a); rectF(x, y + h - 1, w, 1, b); rectF(x + w - 1, y, 1, h, b);
  if (!inset) { rectF(x + 1, y + h - 2, w - 2, 1, WIN.shade); rectF(x + w - 2, y + 1, 1, h - 2, WIN.shade); }
}
const ink = (s, x, y, c = WIN.ink) => text(s, x, y, c, 0);
function gradH(x, y, w, h, c0, c1) { for (let i = 0; i < w; i++) { const k = i / Math.max(1, w - 1), c = mix(c0, c1, k); for (let j = 0; j < h; j++) pset(x + i, y + j, (B4[(i & 3) + ((j & 3) << 2)] / 16) < (k * 8 % 1) ? mix(c0, c1, Math.min(1, k + 1 / 8)) : c); } }

// ---------- windows ----------
// win = { id, title, x, y, w, h, body(win, x, y, w, h), close: true|false, modal }
const WINS = [];
let OWNER = null, DRAG = null, CURW = null, TIP = null;
function openWin(o) {
  const old = WINS.find(w => w.id === o.id); if (old) { focusWin(old); Object.assign(old, o.keep ? {} : { body: o.body }); return old; }
  const w = Object.assign({ x: (W - o.w) / 2 | 0, y: 30, close: true }, o); WINS.push(w); sfx('tick'); return w;
}
function closeWin(id) { const i = WINS.findIndex(w => w.id === id); if (i >= 0) { const w = WINS[i]; WINS.splice(i, 1); if (w.onClose) w.onClose(); } }
function focusWin(w) { const i = WINS.indexOf(w); if (i >= 0 && i < WINS.length - 1) { WINS.splice(i, 1); WINS.push(w); } }
const isOpenWin = id => WINS.some(w => w.id === id);
// who gets this frame's click: the top window under the pointer, the menu bar, the taskbar, or the desk (the store / map view)
function resolveOwner() {
  OWNER = 'desk';
  if (MENUDROP && hit(MENUDROP.x, MENUDROP.y, MENUDROP.w, MENUDROP.h)) { OWNER = 'drop'; return; }
  if (MOUSE.y < 11) { OWNER = 'bar'; return; }
  if (MOUSE.y >= H - 13) { OWNER = 'task'; return; }
  for (let i = WINS.length - 1; i >= 0; i--) { const w = WINS[i]; if (hit(w.x, w.y, w.w, w.h)) { OWNER = w; return; } }
  const m = WINS.find(w => w.modal); if (m) OWNER = 'blocked';
}
function drawWins() {
  for (const w of WINS) {
    CURW = w; const top = w === WINS[WINS.length - 1];
    bevel(w.x, w.y, w.w, w.h);
    const tb = top ? [WIN.title, WIN.title2] : [WIN.off, WIN.off2]; gradH(w.x + 3, w.y + 3, w.w - 6, 11, tb[0], tb[1]);
    text(w.title, w.x + 6, w.y + 5, WIN.lite, 0);
    if (w.close && btn(w.x + w.w - 15, w.y + 4, 10, 'x', { h: 9 })) { closeWin(w.id); sfx('tick'); continue; }
    // drag by the title bar
    if (OWNER === w && MOUSE.click && hit(w.x, w.y, w.w - 16, 14)) { DRAG = { w, dx: MOUSE.x - w.x, dy: MOUSE.y - w.y }; }
    if (OWNER === w && MOUSE.click) focusWin(w);
    w.body(w, w.x + 4, w.y + 17, w.w - 8, w.h - 21);
  }
  CURW = null;
  if (DRAG) { if (!MOUSE.down) DRAG = null; else { DRAG.w.x = clamp(Math.round(MOUSE.x - DRAG.dx), -DRAG.w.w + 30, W - 30); DRAG.w.y = clamp(Math.round(MOUSE.y - DRAG.dy), 11, H - 30); } }
}
const mine = () => CURW ? OWNER === CURW : OWNER === 'desk' || OWNER === 'task' || OWNER === 'bar' || OWNER === 'drop';

// ---------- widgets (immediate mode: draw, and return true when clicked this frame) ----------
function btn(x, y, w, label, o = {}) {
  const h = o.h || 12, over = mine() && hit(x, y, w, h) && !o.off, press = over && MOUSE.down;
  if (typeof BTNLOG !== 'undefined') BTNLOG.push({ label, x, y, w, h, off: !!o.off });
  bevel(x, y, w, h, press || o.on, o.on ? hex('#d8d8d8') : WIN.face);
  const c = o.off ? WIN.shade : o.col || WIN.ink, tx = x + ((w - tw(label)) >> 1) + (press ? 1 : 0), ty = y + ((h - 7) >> 1) + (press ? 1 : 0);
  if (o.off) text(label, tx + 1, ty + 1, WIN.lite, 0); text(label, tx, ty, c, 0);
  if (over && o.tip) TIP = o.tip;
  if (over && MOUSE.click) { MOUSE.click = 0; sfx('tick'); return true; }
  return false;
}
function inset(x, y, w, h) { bevel(x, y, w, h, true, WIN.field); }
function bar(x, y, w, v, c = WIN.title) { inset(x, y, w, 6); rectF(x + 1, y + 1, Math.round((w - 2) * clamp(v, 0, 1)), 4, c); }
function rowHit(x, y, w, h) { const over = mine() && hit(x, y, w, h); if (over && MOUSE.click) { MOUSE.click = 0; sfx('tick'); return true; } return false; }
function stepper(x, y, label, val, o = {}) { // [-] value [+]  returns -1 / 0 / +1
  let r = 0; if (btn(x, y, 11, '-', { off: o.offDown })) r = -1; inset(x + 12, y, o.w || 46, 12); ink(val, x + 15, y + 3); if (btn(x + 13 + (o.w || 46), y, 11, '+', { off: o.offUp })) r = 1;
  if (label) ink(label, x - tw(label) - 4, y + 3); return r;
}
function tabs(x, y, names, cur) { let r = cur, xx = x; names.forEach((n, i) => { const w = tw(n) + 10; if (btn(xx, y, w, n, { on: i === cur })) r = i; xx += w + 1; }); return r; }

// ---------- menu bar and drop-downs ----------
let MENUDROP = null;
function menuBar(items) { // items: [{n, list: [[label, fn, off?]]}]
  bevel(0, 0, W, 11); let x = 4;
  for (const it of items) { const w = tw(it.n) + 8, open = MENUDROP && MENUDROP.src === it;
    if (open) rectF(x, 1, w, 9, WIN.sel); text(it.n, x + 4, 2, open ? WIN.lite : WIN.ink, 0);
    if (OWNER === 'bar' && hit(x, 0, w, 11) && MOUSE.click) { MOUSE.click = 0; sfx('tick'); MENUDROP = open ? null : { src: it, x, y: 11, w: Math.max(...it.list.map(l => tw(l[0]))) + 20, h: it.list.length * 11 + 4 }; }
    else if (MENUDROP && !open && OWNER === 'bar' && hit(x, 0, w, 11)) MENUDROP = { src: it, x, y: 11, w: Math.max(...it.list.map(l => tw(l[0]))) + 20, h: it.list.length * 11 + 4 };
    x += w; }
}
function drawDrop() {
  if (!MENUDROP) return; const m = MENUDROP; bevel(m.x, m.y, m.w, m.h);
  m.src.list.forEach(([label, fn, off], i) => { const y = m.y + 2 + i * 11, over = OWNER === 'drop' && hit(m.x + 2, y, m.w - 4, 11);
    if (over && !off) rectF(m.x + 2, y, m.w - 4, 11, WIN.sel);
    if (off) text(label, m.x + 9, y + 3, WIN.lite, 0); text(label, m.x + 8, y + 2, off ? WIN.shade : over ? WIN.lite : WIN.ink, 0);
    if (over && MOUSE.click && !off) { MOUSE.click = 0; MENUDROP = null; sfx('tick'); fn(); } });
  if (MOUSE.click && OWNER !== 'drop' && OWNER !== 'bar') { MENUDROP = null; MOUSE.click = 0; }
}

// ---------- message boxes (async) ----------
function msgBox(title, body, buttons = ['OK'], o = {}) {
  return new Promise(res => {
    const lines = Array.isArray(body) ? body.flatMap(l => wrapT(l, o.wrap || 46)) : wrapT(body, o.wrap || 46);
    const bw = Math.max(...buttons.map(b => tw(b) + 14)), w = Math.max(160, Math.max(...lines.map(tw)) + (o.icon ? 46 : 22), buttons.length * (bw + 6) + 20), h = 40 + lines.length * 10 + (o.extra || 0);
    const id = 'msg' + Math.random();
    openWin({ id, title, w, h, x: (W - w) >> 1, y: Math.max(14, (H - h) >> 1), modal: 1, close: false, body(win, x, y, ww, hh) {
      if (o.icon) o.icon(x + 4, y + 2);
      lines.forEach((l, i) => ink(l, x + (o.icon ? 40 : 6), y + 4 + i * 10));
      if (o.draw) o.draw(x, y + 6 + lines.length * 10);
      let bx = x + ((ww - buttons.length * (bw + 6)) >> 1);
      buttons.forEach((b, i) => { if (btn(bx, y + hh - 15, bw, b)) { closeWin(id); res(i); } bx += bw + 6; });
      if (WINS[WINS.length - 1] === win) { if (pressed.start) { closeWin(id); res(0); } }
    } });
  });
}
const alertBox = (s, t = 'KONBINI WARS') => msgBox(t, s, ['OK'], { icon: iconInfo });
function iconInfo(x, y) { ellF(x + 14, y + 12, 12, 12, hex('#1a5ad8')); ellF(x + 14, y + 12, 10, 10, hex('#3a8aff')); text('i', x + 12, y + 8, WIN.lite, 0); }
function iconWarn(x, y) { polyF([[x + 14, y], [x + 28, y + 24], [x, y + 24]], hex('#f0c000')); text('!', x + 12, y + 11, WIN.ink, 0); }

// ---------- dialogue in a window (replaces the engine's message panel) ----------
const SAY_WRAP = 68; // the text box beside a portrait fits 70 characters
drawUI = function () {
  if (DLG) {
    const y = 152, h = 78, x = 8, w = W - 16; bevel(x, y, w, h);
    const who = DLG.who, c = who ? CAST[who] : null, port = c && c.port ? c.port(DLG.mood) : null;
    gradH(x + 3, y + 3, w - 6, 11, WIN.title, WIN.title2); text(who || 'MALL BULLETIN', x + 6, y + 5, WIN.lite, 0);
    let tx = x + 8; if (port) { inset(x + 5, y + 17, port.w + 4, port.h + 4); copyBuf(port, x + 7, y + 19); tx = x + port.w + 16; }
    inset(tx - 3, y + 17, x + w - tx - 2, h - 21);
    let n = DLG.n | 0; DLG.lines.forEach((l, i) => { text(l.slice(0, Math.max(0, n)), tx + 2, y + 22 + i * 12, WIN.ink, 0); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) text('>', x + w - 14, y + h - 12, WIN.title, 0);
  }
  for (const m of MENUS) {
    bevel(m.x - 2, m.y - (m.title ? 14 : 2), m.w + 4, m.h + (m.title ? 16 : 4));
    if (m.title) { gradH(m.x + 1, m.y - 11, m.w - 2, 10, WIN.title, WIN.title2); text(m.title, m.x + 4, m.y - 10, WIN.lite, 0); }
    inset(m.x, m.y, m.w, m.h);
    let r = 0; m.rows.forEach((lines, i) => { if (i === m.i) rectF(m.x + 2, m.y + 5 + r * 12, m.w - 4, lines.length * 12, WIN.sel);
      for (const l of lines) text(l, m.x + 10, m.y + 8 + r++ * 12, i === m.i ? WIN.lite : WIN.ink, 0); });
  }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = tw(BANNER.s) + 28; bevel(((W - w) / 2) | 0, 24, w, 18); ctext(BANNER.s, 30, WIN.title, 0); }
  if (CARD) { rectF(0, 0, W, H, CARD.bg); const ls = CARD.lines.flatMap(l => wrapT(l, 70)), y0 = ((H - ls.length * 14) / 2) | 0; ls.forEach((l, i) => ctext(l, y0 + i * 14, CARD.col && i === 0 ? CARD.col : CARD.fg)); }
};
// menus (choose) answer to the mouse
choose = async function (opts, o = {}) {
  const rows = opts.map(s => wrapT(s, o.wrap || 30)), nR = rows.reduce((n, r) => n + r.length, 0);
  const w = Math.min(W - 8, Math.max(...rows.flat().map(s => s.length)) * 6 + 24), h = nR * 12 + 12;
  const m = { opts, rows, i: o.start || 0, x: o.x !== undefined ? o.x : W - w - 14, y: o.y !== undefined ? o.y : 150 - h - 6, w, h, title: o.title };
  MENUS.push(m); await nextFrame();
  const out = i => { MENUS.splice(MENUS.indexOf(m), 1); return i; };
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (MOUSE.on) { let r = 0; for (let i = 0; i < rows.length; i++) { const ry = m.y + 5 + r * 12; if (hit(m.x + 2, ry, m.w - 4, rows[i].length * 12)) { if (MOUSE.mv && m.i !== i) { m.i = i; sfx('move'); } if (MOUSE.click) { MOUSE.click = 0; m.i = i; sfx('ok'); return out(i); } } r += rows[i].length; }
      if (MOUSE.rclick && o.cancel) { MOUSE.rclick = 0; sfx('tick'); return out(-1); } MOUSE.rclick = 0; MOUSE.click = 0; }
    MOUSE.mv = 0;
    if (pressed.a) { sfx('ok'); break; }
    if (pressed.b && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame(); }
  return out(m.i);
};

// ---------- the pointer ----------
const CURSORS = {
  arrow: ['X', 'XX', 'X.X', 'X..X', 'X...X', 'X....X', 'X.....X', 'X......X', 'X....XXX', 'X.X..X', 'XX X..X', 'X  X..X', '    X..X', '     XX'],
  hand: ['   XX', '   X.X', '   X.X', '   X.XXX', ' XXX...XXX', 'X.X.......X', 'X.........X', 'X........X', ' X.......X', '  X.....X', '  XXXXXXX'],
  cross: ['    X', '    X', '    X', '', 'XXX XXX', '', '    X', '    X', '    X'],
  wait: ['XXXXXXX', 'X.....X', ' X...X', '  X.X', '   X', '  X.X', ' X...X', 'X.....X', 'XXXXXXX'],
};
let CURSOR = 'arrow';
function drawCursor() {
  if (!MOUSE.on) return; const c = CURSORS[CURSOR] || CURSORS.arrow, ox = CURSOR === 'cross' ? -4 : CURSOR === 'hand' ? -4 : CURSOR === 'wait' ? -3 : 0, oy = CURSOR === 'cross' ? -4 : CURSOR === 'wait' ? -4 : 0;
  c.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const ch = row[i]; if (ch === 'X') pset(MOUSE.x + i + ox, MOUSE.y + j + oy, WIN.ink); else if (ch === '.') pset(MOUSE.x + i + ox, MOUSE.y + j + oy, WIN.lite); } });
}
function drawTip() { if (!TIP || !MOUSE.on) return; const ls = wrapT(TIP, 40), w = Math.max(...ls.map(tw)) + 6, h = ls.length * 9 + 4, x = clamp(MOUSE.x + 10, 0, W - w), y = clamp(MOUSE.y + 14, 0, H - h);
  rectF(x, y, w, h, hex('#ffffe0')); frameR(x, y, w, h, WIN.ink); ls.forEach((l, i) => ink(l, x + 3, y + 3 + i * 9)); }
// call at the end of each frame
function endUIFrame() { MOUSE.click = 0; MOUSE.rclick = 0; MOUSE.mv = 0; MOUSE.wheel = 0; TIP = null; }
