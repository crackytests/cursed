'use strict';
// ================= PRETEND CO. SUPER-16 ENGINE (generation 2) =================
// 320x224, 16-color palettes, 9-bit color (512), raster effects, legacy (4-shade) downgrade mode.
const W = 320, H = 224;
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const IMG = ctx.createImageData(W, H), OUT = new Uint32Array(IMG.data.buffer);
const FB = new Uint32Array(W * H);
const q9 = v => Math.round(Math.max(0, Math.min(255, v)) / 255 * 7) * 255 / 7 | 0; // 3 bits per channel
const rgb = (r, g, b) => ((255 << 24) | (q9(b) << 16) | (q9(g) << 8) | q9(r)) >>> 0;
const hex = h => rgb(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));
const pal = (...hs) => [0].concat(hs.map(hex)); // index 0 = transparent
const chan = c => [c & 255, (c >> 8) & 255, (c >> 16) & 255];
const mix = (a, b, k) => { const x = chan(a), y = chan(b); return rgb(x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k); };
const GBPAL = [[155, 188, 15], [139, 172, 15], [48, 98, 48], [15, 56, 15]].map(([r, g, b]) => ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0);
const post = { fade: 0, flash: 0, legacy: 0, wave: 0, shake: 0, tint: null };
let frame = 0, camX = 0, camY = 0;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rnd = n => (Math.random() * n) | 0;
const pick = a => a[rnd(a.length)];
const DBG = {};

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H), si = s >= 2 ? Math.floor(s) : s;
  const wrap = document.getElementById('wrap'); wrap.style.width = W * si + 'px'; wrap.style.height = H * si + 'px';
  const g = document.getElementById('grid');
  g.style.backgroundImage = si >= 2 ? 'repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px ' + si + 'px)' : 'none'; // CRT scanlines
}
addEventListener('resize', fit);

// ---------- drawing ----------
function cls(c) { FB.fill(c); }
function rectF(x, y, w, h, c) {
  x |= 0; y |= 0; const x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  const a = Math.max(0, x); if (x1 <= a) return;
  for (let j = Math.max(0, y); j < y1; j++) FB.fill(c, j * W + a, j * W + x1);
}
function frameRect(x, y, w, h, c) { rectF(x, y, w, 1, c); rectF(x, y + h - 1, w, 1, c); rectF(x, y, 1, h, c); rectF(x + w - 1, y, 1, h, c); }
function pset(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) FB[y * W + x] = c; }
// sprites: {w,h,d} with 0 transparent, 1..15 palette index
function spr(w, h, f) {
  const s = { w, h, d: new Uint8Array(w * h) };
  const g = {
    p(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < w && y < h) s.d[y * w + x] = c; },
    r(x, y, ww, hh, c) { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) g.p(x + i, y + j, c); },
    e(cx, cy, rx, ry, c) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1) g.p(x, y, c); } },
    line(x0, y0, x1, y1, c) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) g.p(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), c); },
    rows(a, ox = 0, oy = 0) { a.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') g.p(ox + i, oy + j, parseInt(r[i], 16)); }); },
    each(fn) { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const c = fn(x, y); if (c) g.p(x, y, c); } },
    get: (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : s.d[y * w + x],
  };
  f(g); return s;
}
// add a 1px outline (palette index c) around a sprite: the 16-bit "clean edge" look
function outline(s, c) {
  const d = s.d.slice();
  for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
    if (s.d[y * s.w + x]) continue;
    const n = (xx, yy) => xx >= 0 && yy >= 0 && xx < s.w && yy < s.h && s.d[yy * s.w + xx] && s.d[yy * s.w + xx] !== c;
    if (n(x - 1, y) || n(x + 1, y) || n(x, y - 1) || n(x, y + 1)) d[y * s.w + x] = c;
  }
  s.d = d; return s;
}
function draw(s, x, y, P, flip, tint) {
  x = Math.round(x); y = Math.round(y);
  for (let j = 0; j < s.h; j++) {
    const yy = y + j; if (yy < 0 || yy >= H) continue;
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + (flip ? s.w - 1 - i : i)]; if (!c) continue;
      const xx = x + i; if (xx < 0 || xx >= W) continue;
      FB[yy * W + xx] = tint || P[c];
    }
  }
}
function drawScaled(s, x, y, P, sc, flip) {
  for (let j = 0; j < s.h * sc; j++) { const yy = (y + j) | 0; if (yy < 0 || yy >= H) continue;
    for (let i = 0; i < s.w * sc; i++) { const sx = (i / sc) | 0, c = s.d[((j / sc) | 0) * s.w + (flip ? s.w - 1 - sx : sx)]; if (!c) continue; const xx = (x + i) | 0; if (xx >= 0 && xx < W) FB[yy * W + xx] = P[c]; } }
}
// raster sky: per-line gradient, quantized to 9-bit so it bands like real hardware
function sky(y0, y1, c0, c1) { for (let y = y0; y < y1; y++) rectF(0, y, W, 1, mix(c0, c1, (y - y0) / Math.max(1, y1 - y0))); }

// ---------- font (5x7, drawn with a drop shadow) ----------
const FONT = {};
(() => {
  const src = { A: '0E11111F111111', B: '1E11111E11111E', C: '0E11101010110E', D: '1C12111111121C', E: '1F10101E10101F', F: '1F10101E101010', G: '0E11101711110F', H: '1111111F111111', I: '0E04040404040E', J: '0702020202120C', K: '11121418141211', L: '1010101010101F', M: '111B1515111111', N: '11111915131111', O: '0E11111111110E', P: '1E11111E101010', Q: '0E11111115120D', R: '1E11111E141211', S: '0F10100E01011E', T: '1F040404040404', U: '1111111111110E', V: '11111111110A04', W: '1111111515150A', X: '11110A040A1111', Y: '1111110A040404', Z: '1F01020408101F',
    0: '0E11131519110E', 1: '040C040404040E', 2: '0E11010204081F', 3: '1F02040201110E', 4: '02060A121F0202', 5: '1F101E0101110E', 6: '0608101E11110E', 7: '1F010204080808', 8: '0E11110E11110E', 9: '0E11110F01020C',
    '.': '00000000000C0C', ',': '000000000C0408', '!': '04040404040004', '?': '0E110102040004', "'": '0C040800000000', '-': '0000001F000000', ':': '000C0C000C0C00', '/': '00010204081000', '(': '02040808080402', ')': '08040202020408',
    '"': '0A0A0A00000000', '>': '080C0E0F0E0C08', '*': '0004150E150400', '+': '0004041F040400', '=': '00001F001F0000', '#': '0A0A1F0A1F0A0A', '&': '0C121408151209', '%': '18190204081303', '@': '000A1F1F0E0400', '$': '040F140E051E04', '^': '040E1F04040404', 'v': '040404041F0E04', '[': '1F1F1F1F1F1F1F', '_': '0000000000001F', '³': '1C0204020C1000',
    '<': '02040810080402', ';': '000C0C000C0408', '~': '00000815020000', '|': '04040404040404', '{': '06080818080806', '}': '0C02020302020C', '\u221e': '00000A150A0000' };
  for (const k in src) { const h = src[k], r = []; for (let i = 0; i < 7; i++) r.push(parseInt(h.substr(i * 2, 2), 16)); FONT[k] = r; }
})();
function glyph(ch, x, y, c, sc = 1) { const g = FONT[ch === 'v' ? 'v' : ch.toUpperCase()]; if (!g) return; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) sc === 1 ? pset(x + i, y + j, c) : rectF(x + i * sc, y + j * sc, sc, sc, c); }
function text(s, x, y, c, sh = BLACK, sc = 1) { s = String(s); let xx = x; for (const ch of s) { if (sh) glyph(ch, xx + sc, y + sc, sh, sc); glyph(ch, xx, y, c, sc); xx += 6 * sc; } }
const ctext = (s, y, c, sh, sc = 1) => text(s, ((W - String(s).length * 6 * sc) / 2) | 0, y, c, sh === undefined ? BLACK : sh, sc);
const BLACK = rgb(0, 0, 0), WHITE = rgb(255, 255, 255);

// ---------- postprocess: fades, raster wave, legacy downgrade ----------
function present() {
  const t = frame, lg = post.legacy, fade = post.fade, flash = post.flash, sh = post.shake ? rnd(post.shake * 2 + 1) - post.shake : 0;
  for (let y = 0; y < H; y++) {
    const off = (post.wave ? Math.round(Math.sin(y * .09 + t * .08) * post.wave) : 0) + sh;
    const legacyRow = lg >= 1 || y < lg * H;
    for (let x = 0; x < W; x++) {
      let c;
      if (legacyRow) {
        const [r, g, b] = chan(FB[y * W + clamp(x + off, 0, W - 1)]); const l = r * .3 + g * .59 + b * .11;
        c = GBPAL[l > 170 ? 0 : l > 110 ? 1 : l > 55 ? 2 : 3];
      } else c = FB[y * W + clamp(x + off, 0, W - 1)];
      if (fade || flash || post.tint) {
        let [r, g, b] = chan(c);
        if (post.tint) { const tt = chan(post.tint); r = (r + tt[0]) / 2; g = (g + tt[1]) / 2; b = (b + tt[2]) / 2; }
        if (fade) { r *= 1 - fade; g *= 1 - fade; b *= 1 - fade; }
        if (flash) { r += (255 - r) * flash; g += (255 - g) * flash; b += (255 - b) * flash; }
        c = ((255 << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0)) >>> 0;
      }
      OUT[y * W + x] = c;
    }
  }
  ctx.putImageData(IMG, 0, 0);
}

// ---------- input: 3-button pad ----------
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
  KeyZ: 'a', KeyJ: 'a', KeyX: 'b', KeyK: 'b', Space: 'b', KeyC: 'c', KeyL: 'c', Enter: 'start', ShiftLeft: 'mode', ShiftRight: 'mode', Backspace: 'mode' };
const BTNS = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start', 'mode'];
const held = {}, pressed = {}, kb = {};
let anyKey = false;
addEventListener('keydown', e => {
  anyKey = true; if (typeof audioInit === 'function') audioInit();
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
    if (b(0)) gp.b = 1; if (b(2)) gp.a = 1; if (b(1) || b(3)) gp.c = 1; if (b(9)) gp.start = 1; if (b(8)) gp.mode = 1;
    if (b(12) || p.axes[1] < -.5) gp.up = 1; if (b(13) || p.axes[1] > .5) gp.down = 1; if (b(14) || p.axes[0] < -.5) gp.left = 1; if (b(15) || p.axes[0] > .5) gp.right = 1;
    if (BTNS.some(k => gp[k])) { anyKey = true; if (typeof audioInit === 'function') audioInit(); }
  }
  for (const k of BTNS) { const h = !!(kb[k] || gp[k]); pressed[k] = h && !held[k]; held[k] = h; }
}

// ---------- loop / async ----------
let scene = null, waiters = [], busy = 0;
const nextFrame = () => new Promise(r => waiters.push(r));
async function wait(n) { while (n-- > 0) await nextFrame(); }
async function waitBtn() { await nextFrame(); while (!(pressed.a || pressed.b || pressed.c || pressed.start)) await nextFrame(); }
function run(fn) { busy++; return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => busy--); }
let lastT = 0, acc = 0;
function loop(t) {
  acc = Math.min(acc + (t - lastT), 50); lastT = t;
  if (acc >= 16) {
    acc -= 16.667;
    pollInput(); frame++;
    if (scene && scene.update) scene.update();
    const w = waiters; waiters = []; w.forEach(r => r());
    if (scene && scene.draw) scene.draw(); else cls(BLACK);
    drawOverlay();
    present();
  }
  requestAnimationFrame(loop);
}
async function fadeTo(v, sp = .06) { while (Math.abs(post.fade - v) > .001) { post.fade = v > post.fade ? Math.min(v, post.fade + sp) : Math.max(v, post.fade - sp); await nextFrame(); } }
const fadeOut = sp => fadeTo(1, sp), fadeIn = sp => fadeTo(0, sp);

// ---------- dialog with portraits ----------
const PORT = {};   // name -> {s, P}
const VOICE = {};  // name -> [freq, jitter, instrument]
let DLG = null, MENUS = [], CARD = null, BANNER = null, CHATBOX = null;
const UI = { box: hex('#101a48'), box2: hex('#2840a0'), edge: hex('#e8e8f8'), text: hex('#f8f8f8'), dim: hex('#a0a8d0'), name: hex('#f8d850') };
function wrapT(s, n) { const out = []; for (const para of String(s).split('\n')) { let line = ''; for (const w of para.split(' ')) { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; } out.push(line); } return out; }
function panel(x, y, w, h) {
  for (let j = 0; j < h; j++) rectF(x, y + j, w, 1, mix(UI.box2, UI.box, j / h));
  frameRect(x, y, w, h, UI.edge); frameRect(x + 2, y + 2, w - 4, h - 4, UI.box2);
}
let SAYQ = Promise.resolve(); // one dialog at a time: overlapping says would hide each other's prompt
function say(s, who, o = {}) { const p = SAYQ.then(() => say1(s, who, o)); SAYQ = p.catch(() => {}); return p; }
async function say1(s, who, o) {
  const hasP = who && PORT[who], cols = hasP ? 38 : 48;
  const lines = wrapT(String(s).toUpperCase(), cols);
  const v = VOICE[who] || VOICE._ || [800, 60];
  for (let p = 0; p < lines.length; p += 4) {
    const pg = lines.slice(p, p + 4), all = pg.join(''), total = all.length;
    DLG = { who, lines: pg, n: 0, arrow: 0, hasP, port: o.port };
    await nextFrame();
    let last = -1;
    while (DLG.n < total) {
      if (pressed.a || pressed.b || pressed.c) { DLG.n = total; break; }
      DLG.n += o.slow ? .25 : .9;
      const i = DLG.n | 0; if (i !== last && i % 2 === 0 && all[i] && all[i] !== ' ') sfx('blip', v); last = i;
      await nextFrame();
    }
    if (o.auto) await wait(o.auto); else { DLG.arrow = 1; await waitBtn(); sfx('tick'); }
  }
  if (!o.keep) DLG = null;
}
async function choose(opts, o = {}) {
  const w = Math.max(...opts.map(s => s.length)) * 6 + 24, h = opts.length * 12 + 12;
  const m = { opts, i: 0, x: o.x !== undefined ? o.x : W - w - 8, y: o.y !== undefined ? o.y : (DLG ? H - 72 - h : H - h - 8), w, h };
  MENUS.push(m); await nextFrame();
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (pressed.a || pressed.b) { sfx('ok'); break; }
    if (pressed.c && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame();
  }
  MENUS.splice(MENUS.indexOf(m), 1); return m.i;
}
async function ask(q, who, opts) { await say(q, who, { keep: 1 }); const r = await choose(opts); DLG = null; return r; }
async function showCard(lines, t, o = {}) { CARD = { lines, bg: o.bg || BLACK, fg: o.fg || WHITE, sc: o.sc || 1 }; if (t) await wait(t); else await waitBtn(); if (!o.keep) CARD = null; }
function banner(s, t = 110) { BANNER = { s, t }; }
async function chat(msgs) { CHATBOX = { msgs: [] }; for (const m of msgs) { CHATBOX.msgs.push(m); sfx('chat'); await wait(m.d || 40); } await waitBtn(); CHATBOX = null; }
function drawOverlay() {
  if (CARD) { cls(CARD.bg); const y0 = ((H - CARD.lines.length * 12 * CARD.sc) / 2) | 0; CARD.lines.forEach((l, i) => ctext(l, y0 + i * 12 * CARD.sc, CARD.fg, BLACK, CARD.sc)); }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = BANNER.s.length * 6 + 20; panel(((W - w) / 2) | 0, 14, w, 18); ctext(BANNER.s, 20, UI.name); }
  if (CHATBOX) {
    panel(W - 150, 8, 142, 120); rectF(W - 146, 12, 134, 11, hex('#c02040')); text('LIVE CHAT', W - 142, 14, WHITE);
    const rows = []; for (const m of CHATBOX.msgs) { rows.push([m.u + ':', UI.name]); for (const l of wrapT(m.m.toUpperCase(), 21)) rows.push([' ' + l, UI.text]); }
    rows.slice(-9).forEach((r, i) => text(r[0], W - 144, 27 + i * 11, r[1]));
  }
  if (DLG) {
    const y = H - 68; panel(4, y, W - 8, 64);
    let tx = 14;
    if (DLG.hasP) { const p = DLG.port || PORT[DLG.who]; rectF(10, y + 8, 50, 50, BLACK); draw(p.s, 11, y + 9, p.P); frameRect(10, y + 8, 50, 50, UI.edge); tx = 68; }
    if (DLG.who) { const w = DLG.who.length * 6 + 12; panel(tx - 4, y - 12, w, 15); text(DLG.who, tx + 2, y - 8, UI.name); }
    let n = DLG.n | 0;
    DLG.lines.forEach((l, i) => { text(l.slice(0, Math.max(0, n)), tx, y + 10 + i * 12, UI.text); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) text('v', W - 20, H - 16, UI.name);
  }
  for (const m of MENUS) { panel(m.x, m.y, m.w, m.h); m.opts.forEach((s, i) => { text(s, m.x + 16, m.y + 8 + i * 12, i === m.i ? UI.name : UI.text); if (i === m.i) text('>', m.x + 7, m.y + 8 + i * 12, UI.name); }); }
}

// ---------- storage ----------
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function fetchStore(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toUpperCase();

// ---------- gen-2 late additions (FACE / YOKO): primitives, legacy crush, tones ----------
function lineF(x0, y0, x1, y1, c) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) | 0; for (let i = 0; i <= n; i++) pset(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, c); }
function circF(cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.sqrt(Math.max(0, r * r - y * y)); rectF(Math.round(cx - w), Math.round(cy + y), Math.round(w * 2) + 1, 1, c); } }
function ringF(cx, cy, r, c) { const n = Math.max(8, (r * 6.3) | 0); for (let i = 0; i < n; i++) { const a = i / n * 6.2832; pset(cx + Math.cos(a) * r, cy + Math.sin(a) * r, c); } }
function rectA(x, y, w, h, c, a) { // alpha-blended rect (a: 0..1)
  x |= 0; y |= 0; const x1 = Math.min(W, x + w), y1 = Math.min(H, y + h), [cr, cg, cb] = chan(c);
  for (let j = Math.max(0, y); j < y1; j++) for (let i = Math.max(0, x); i < x1; i++) { const o = j * W + i, [r, g, b] = chan(FB[o]); FB[o] = rgb(r + (cr - r) * a, g + (cg - g) * a, b + (cb - b) * a); }
}
function triF(x0, y0, x1, y1, x2, y2, c) { // flat triangle fill, top-left rule-ish
  if (y1 < y0) { [x0, y0, x1, y1] = [x1, y1, x0, y0]; } if (y2 < y0) { [x0, y0, x2, y2] = [x2, y2, x0, y0]; } if (y2 < y1) { [x1, y1, x2, y2] = [x2, y2, x1, y1]; }
  const ys = Math.max(0, Math.ceil(y0)), ye = Math.min(H - 1, Math.floor(y2));
  for (let y = ys; y <= ye; y++) {
    const xa = y2 === y0 ? x0 : x0 + (x2 - x0) * (y - y0) / (y2 - y0);
    const xb = y < y1 ? (y1 === y0 ? x0 : x0 + (x1 - x0) * (y - y0) / (y1 - y0)) : (y2 === y1 ? x1 : x1 + (x2 - x1) * (y - y1) / (y2 - y1));
    const l = Math.round(Math.min(xa, xb)), r = Math.round(Math.max(xa, xb)); if (r >= l) rectF(l, y, r - l + 1, 1, c);
  }
}
const lum = c => { const [r, g, b] = chan(c); return r * .3 + g * .59 + b * .11; };
// the four-shade cartridges, as full colors (light -> dark)
const TONES = {
  dmg: ['#9bbc0f', '#8bac0f', '#306230', '#0f380f'], pink: ['#ffe8f2', '#ee94be', '#963070', '#260822'],
  red: ['#ffe2dc', '#ec5868', '#8a1640', '#16020e'], gray: ['#dedacd', '#a5a094', '#63605c', '#1e1c1e'],
};
// crush a palette to one cartridge's four shades (the new hardware still can't draw them)
function legacyPal(P, tone = 'dmg') { const T = TONES[tone].map(hex); return P.map((c, i) => i === 0 ? 0 : T[(l => l > 170 ? 0 : l > 110 ? 1 : l > 55 ? 2 : 3)(lum(c))]); }

// ordered-dither gradient: the 9-bit palette bands, so dither between neighbouring levels like the real hardware did
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const HEXC = {}; const hexRaw = h => HEXC[h] || (HEXC[h] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)));
function skyD(y0, y1, h0, h1) {
  const a = hexRaw(h0), b = hexRaw(h1), cols = [0, 0, 0, 0];
  y0 = Math.max(0, y0 | 0); y1 = Math.min(H, y1 | 0);
  for (let y = y0; y < y1; y++) {
    const k = (y - y0) / Math.max(1, y1 - y0), rv = (a[0] + (b[0] - a[0]) * k) * 7 / 255, gv = (a[1] + (b[1] - a[1]) * k) * 7 / 255, bv = (a[2] + (b[2] - a[2]) * k) * 7 / 255;
    const rl = rv | 0, gl = gv | 0, bl = bv | 0, rf = rv - rl, gf = gv - gl, bf = bv - bl, yo = (y & 3) << 2;
    for (let i = 0; i < 4; i++) { const t = BAYER4[yo | i], r = Math.min(7, rl + (rf > t ? 1 : 0)) * 255 / 7 | 0, g = Math.min(7, gl + (gf > t ? 1 : 0)) * 255 / 7 | 0, bb = Math.min(7, bl + (bf > t ? 1 : 0)) * 255 / 7 | 0; cols[i] = ((255 << 24) | (bb << 16) | (g << 8) | r) >>> 0; }
    const row = y * W; for (let x = 0; x < W; x++) FB[row + x] = cols[x & 3];
  }
}
