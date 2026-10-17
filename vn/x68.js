'use strict';
// ================= X68K-STYLE ENGINE =================
// 512x256 framebuffer shown at 4:3 (so every pixel is taller than it is wide, like the real thing), 12-bit color (4096),
// ordered-dither gradients, a 5x7 font with lowercase, queued dialogue, menus, and a render-target swap for pre-drawn art.
const W = 512, H = 256, VH = 176; // VH: height of the picture window; the message window sits below it
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const IMG = ctx.createImageData(W, H), OUT = new Uint32Array(IMG.data.buffer);
const SCREEN = new Uint32Array(W * H);
let FB = SCREEN, FW = W, FH = H; // current render target
const q4 = v => Math.round(Math.max(0, Math.min(255, v)) / 255 * 15) * 17;
const rgb = (r, g, b) => ((255 << 24) | (q4(b) << 16) | (q4(g) << 8) | q4(r)) >>> 0;
const hex = h => rgb(parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16));
const chan = c => [c & 255, (c >> 8) & 255, (c >> 16) & 255];
const mix = (a, b, k) => { const x = chan(a), y = chan(b); return rgb(x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k); };
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const rnd = n => (Math.random() * n) | 0;
const pick = a => a[rnd(a.length)];
const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const post = { fade: 0, flash: 0, shake: 0, tint: 0 };
let frame = 0;
const DBG = {};

function fit() {
  const s = Math.min(innerWidth / 4, innerHeight / 3), w = Math.floor(s * 4), h = Math.floor(s * 3);
  const wrap = document.getElementById('wrap'); wrap.style.width = w + 'px'; wrap.style.height = h + 'px';
  const g = document.getElementById('grid'), px = h / H;
  g.style.backgroundImage = px >= 3 ? 'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 1px, transparent 1px ' + px + 'px)' : 'none'; // CRT raster lines
}
addEventListener('resize', fit);

// ---------- render targets ----------
function target(buf, w, h) { FB = buf; FW = w; FH = h; }
function screenTarget() { FB = SCREEN; FW = W; FH = H; }
const newBuf = (w, h) => ({ d: new Uint32Array(w * h), w, h }); // 0 = transparent
function offscreen(w, h, fn) { const b = newBuf(w, h); target(b.d, w, h); try { fn(); } finally { screenTarget(); } return b; }
function blit(b, x, y, flip, y1 = 1e9) { // y1: nothing is drawn at or below this row (things rising from behind cover)
  x |= 0; y |= 0;
  for (let j = 0; j < b.h; j++) { const yy = y + j; if (yy < 0 || yy >= FH || yy >= y1) continue;
    for (let i = 0; i < b.w; i++) { const c = b.d[j * b.w + (flip ? b.w - 1 - i : i)]; if (!c) continue; const xx = x + i; if (xx >= 0 && xx < FW) FB[yy * FW + xx] = c; } }
}
function copyBuf(b, x, y) { for (let j = 0; j < b.h; j++) { const yy = y + j; if (yy < 0 || yy >= FH) continue; FB.set(b.d.subarray(j * b.w, j * b.w + Math.min(b.w, FW - x)), yy * FW + x); } }

// ---------- drawing ----------
function cls(c = 0xff000000) { FB.fill(c >>> 0); }
function pset(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < FW && y < FH) FB[y * FW + x] = c; }
function pget(x, y) { x |= 0; y |= 0; return x >= 0 && y >= 0 && x < FW && y < FH ? FB[y * FW + x] : 0; }
function rectF(x, y, w, h, c) { x |= 0; y |= 0; const x1 = Math.min(FW, x + w), a = Math.max(0, x); if (x1 <= a) return; for (let j = Math.max(0, y); j < Math.min(FH, y + h); j++) FB.fill(c, j * FW + a, j * FW + x1); }
function frameR(x, y, w, h, c) { rectF(x, y, w, 1, c); rectF(x, y + h - 1, w, 1, c); rectF(x, y, 1, h, c); rectF(x + w - 1, y, 1, h, c); }
function lineF(x0, y0, x1, y1, c, th = 1) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) | 0; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; if (th === 1) pset(x, y, c); else rectF(x - th / 2, y - th / 2, th, th, c); } }
function ellF(cx, cy, rx, ry, c) { for (let y = Math.floor(-ry); y <= ry; y++) { const w = rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))); rectF(cx - w, cy + y, w * 2, 1, c); } }
function polyF(pts, c) { // scanline fill, any simple polygon
  let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  for (let y = Math.floor(y0); y <= y1; y++) { const xs = [], yy = y + .5;
    for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= yy && b[1] > yy) || (b[1] <= yy && a[1] > yy)) xs.push(a[0] + (yy - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
    xs.sort((p, q) => p - q); for (let i = 0; i + 1 < xs.length; i += 2) rectF(Math.round(xs[i]), y, Math.round(xs[i + 1]) - Math.round(xs[i]), 1, c); }
}
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function gradV(x, y, w, h, c0, c1, steps = 8) { // ordered-dither gradient: bands blend through a Bayer matrix, the way 16-color art fakes shading
  for (let j = 0; j < h; j++) { const s = (j / Math.max(1, h - 1)) * steps, i = Math.floor(s), f = s - i, a = mix(c0, c1, i / steps), b = mix(c0, c1, Math.min(steps, i + 1) / steps);
    for (let k = 0; k < w; k++) pset(x + k, y + j, f * 16 > B4[((x + k) & 3) + (((y + j) & 3) << 2)] ? b : a); }
}
function rectA(x, y, w, h, c, a) { // alpha rect
  const [r, g, b] = chan(c); x |= 0; y |= 0;
  for (let j = Math.max(0, y); j < Math.min(FH, y + h); j++) for (let i = Math.max(0, x); i < Math.min(FW, x + w); i++) { const p = FB[j * FW + i], [pr, pg, pb] = chan(p); FB[j * FW + i] = rgb(pr + (r - pr) * a, pg + (g - pg) * a, pb + (b - pb) * a); }
}
function glow(cx, cy, r, c, a = 1) { // additive radial light
  const [cr, cg, cb] = chan(c);
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(FH, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(FW, cx + r); x++) {
    const d = Math.hypot(x - cx, y - cy) / r; if (d >= 1) continue; const k = (1 - d) * (1 - d) * a, p = FB[y * FW + x], [pr, pg, pb] = chan(p), t = (B4[(x & 3) + ((y & 3) << 2)] / 16 - .5) * 17; // dither before the 12-bit rounding: no rings
    FB[y * FW + x] = rgb(pr + cr * k + t, pg + cg * k + t, pb + cb * k + t); }
}
// a lit ball: ellipse shaded by a light direction through a tone ramp (dark -> light), dithered between tones; optional colored rim lights
function blob(cx, cy, rx, ry, tones, o = {}) {
  const L = o.light || [-.5, -.6, .62], n = tones.length, rimL = o.rimL, rimR = o.rimR;
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const nx = (x + .5 - cx) / rx, ny = (y + .5 - cy) / ry, d = nx * nx + ny * ny; if (d > 1) continue;
    const nz = Math.sqrt(1 - d), I = clamp(nx * L[0] + ny * L[1] + nz * L[2], 0, 1) * (n - 1), i = Math.floor(I), f = I - i;
    let c = tones[Math.min(n - 1, f * 16 > B4[(x & 3) + ((y & 3) << 2)] ? i + 1 : i)];
    if (d > .86 && nz < .42) { if (rimL && nx < 0) c = rimL; else if (rimR && nx > 0) c = rimR; }
    pset(x, y, c); }
}

// ---------- font (5x7, with lowercase) ----------
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
    '-':'0000001F000000',':':'000C0C000C0C00',';':'000C0C000C0408','/':'00010204081000','(':'02040808080402',')':'08040202020408',
    '"':'0A0A0A00000000','>':'080C0E0F0E0C08','<':'02060E1E0E0602','*':'0004150E150400','+':'0004041F040400',
    '=':'00001F001F0000','#':'0A0A1F0A1F0A0A','&':'0C121408151209','_':'0000000000001F','%':'18190204081303',
    '~':'00000815020000','@':'000A1F1F0E0400','^':'040E1F04040404','$':'040F140E051E04','—':'0000001F000000',
    a:'00000E010F110F',b:'10101619111916',c:'00000E1110110E',d:'01010D1311130D',e:'00000E111F100E',f:'0609081C080808',g:'000F11110F010E',h:'10101619111111',i:'04000C0404040E',j:'0200060202120C',k:'10101214181412',l:'0C04040404040E',
    m:'00001A15151111',n:'00001619111111',o:'00000E1111110E',p:'00001E111E1010',q:'00000F110F0101',r:'00001619101010',s:'00000F100E011E',t:'08081C08080906',u:'0000111111130D',v:'00001111110A04',w:'0000111115150A',x:'0000110A040A11',y:'000011110F010E',z:'00001F0204081F',
  };
  for (const k in src) { const h = src[k], r = []; for (let i = 0; i < 7; i++) r.push(parseInt(h.substr(i * 2, 2), 16)); FONT[k] = r; }
})();
function glyph(ch, x, y, c) { const g = FONT[ch]; if (!g) return; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) pset(x + i, y + j, c); }
const WHITE = hex('#f4f0ff'), BLACK = hex('#06040c');
function text(s, x, y, c = WHITE, sh = BLACK) { s = String(s); let xx = x; for (const ch of s) { if (sh) glyph(ch, xx + 1, y + 1, sh); glyph(ch, xx, y, c); xx += 6; } }
const tw = s => String(s).length * 6;
const ctext = (s, y, c, sh, cx = W / 2) => text(s, (cx - tw(s) / 2) | 0, y, c, sh);
function wrapT(s, n) { const out = []; for (const para of String(s).split('\n')) { let line = ''; for (const w of para.split(' ')) { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; } out.push(line); } return out; }

// ---------- present ----------
function present() {
  const f = post.fade, fl = post.flash, sh = post.shake ? rnd(post.shake * 2 + 1) - post.shake : 0, t = post.tint;
  const tr = t ? chan(t) : null;
  for (let y = 0; y < H; y++) { const sy = clamp(y + (post.shake ? rnd(3) - 1 : 0), 0, H - 1);
    for (let x = 0; x < W; x++) {
      let c = SCREEN[sy * W + clamp(x + sh, 0, W - 1)];
      if (f > 0 || fl > 0 || tr) { let r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255;
        if (tr) { r = r * .6 + tr[0] * .4; g = g * .6 + tr[1] * .4; b = b * .6 + tr[2] * .4; }
        r = r * (1 - f) + 255 * fl; g = g * (1 - f) + 255 * fl; b = b * (1 - f) + 255 * fl;
        c = ((255 << 24) | (clamp(b, 0, 255) << 16) | (clamp(g, 0, 255) << 8) | clamp(r, 0, 255)) >>> 0; }
      OUT[y * W + x] = c; } }
  ctx.putImageData(IMG, 0, 0);
}

// ---------- input ----------
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', KeyW: 'up', KeyS: 'down', KeyA: 'left', KeyD: 'right',
  KeyZ: 'a', KeyJ: 'a', Space: 'a', Enter: 'a', KeyX: 'b', KeyK: 'b', Escape: 'b', Backspace: 'b', KeyC: 'c', Tab: 'start' };
const BTNS = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start'];
const held = {}, pressed = {}, kb = {};
let anyKey = false;
addEventListener('keydown', e => {
  anyKey = true; if (typeof audioInit === 'function') audioInit();
  if (e.code === 'F11') { e.preventDefault(); document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); }
  const k = KEYMAP[e.code]; if (k) { kb[k] = 1; e.preventDefault(); }
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) kb[k] = 0; });
addEventListener('blur', () => { for (const k in kb) kb[k] = 0; });
function pollInput() {
  const gp = {}, pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) { if (!p) continue; const b = i => p.buttons[i] && p.buttons[i].pressed;
    if (b(0)) gp.a = 1; if (b(1) || b(2)) gp.b = 1; if (b(3)) gp.c = 1; if (b(9)) gp.start = 1;
    if (b(12) || p.axes[1] < -.5) gp.up = 1; if (b(13) || p.axes[1] > .5) gp.down = 1; if (b(14) || p.axes[0] < -.5) gp.left = 1; if (b(15) || p.axes[0] > .5) gp.right = 1;
    if (BTNS.some(k => gp[k])) { anyKey = true; if (typeof audioInit === 'function') audioInit(); } }
  for (const k of BTNS) { const h = !!(kb[k] || gp[k]); pressed[k] = h && !held[k]; held[k] = h; }
}

// ---------- loop / async ----------
let scene = null, waiters = [], busy = 0;
const nextFrame = () => new Promise(r => waiters.push(r));
async function wait(n) { while (n-- > 0) await nextFrame(); }
async function waitBtn() { await nextFrame(); while (!(pressed.a || pressed.b)) await nextFrame(); }
let lastT = performance.now(), acc = 0;
function loop(t) {
  acc = Math.min(acc + (t - lastT), 50); lastT = t;
  if (acc >= 16) {
    acc -= 16.667; pollInput(); frame++;
    if (post.flash > 0) post.flash = Math.max(0, post.flash - .06);
    if (scene && scene.update) scene.update();
    const w = waiters; waiters = []; w.forEach(r => r());
    screenTarget(); if (scene && scene.draw) scene.draw(); else cls();
    drawUI(); present();
  }
  requestAnimationFrame(loop);
}
function run(fn) { busy++; return Promise.resolve().then(fn).catch(e => console.error(e)).finally(() => busy--); }
async function fadeTo(v, sp = .05) { while (Math.abs(post.fade - v) > .001) { post.fade = v > post.fade ? Math.min(v, post.fade + sp) : Math.max(v, post.fade - sp); await nextFrame(); } post.fade = v; }
const fadeOut = sp => fadeTo(1, sp), fadeIn = sp => fadeTo(0, sp);

// ---------- cast / dialogue ----------
// CAST[name] = { col: name-tag color, voice: [hz, jitter], port: (mood) => buf }   (the story fills it in)
const CAST = {};
let DLG = null, MENUS = [], CARD = null, BANNER = null, SAYQ = Promise.resolve();
const PORT_Y = 8;
function say(s, who, o = {}) { const p = SAYQ.then(() => say1(s, who, o)); SAYQ = p.catch(() => {}); return p; }
async function say1(s, who, o) {
  const c = who ? CAST[who] : null, lines = wrapT(s, 74), v = (c && c.voice) || [700, 40];
  for (let p = 0; p < lines.length; p += 4) {
    const pg = lines.slice(p, p + 4), all = pg.join(''), total = all.length;
    DLG = { who, c, lines: pg, n: 0, arrow: 0, mood: o.mood, narr: !who }; if (c && c.onSay) c.onSay(o.mood);
    await nextFrame(); let last = -1;
    while (DLG.n < total) {
      if (pressed.a || pressed.b) { DLG.n = total; break; }
      DLG.n += (o.slow ? .3 : 1.1) * (typeof TSPEED === 'undefined' ? 1 : TSPEED); const i = DLG.n | 0;
      if (i !== last && i % 2 === 0 && all[i] && all[i] !== ' ') sfx('blip', v); last = i; await nextFrame(); }
    if (o.auto) await wait(o.auto); else { DLG.arrow = 1; await waitBtn(); sfx('tick'); }
  }
  if (!o.keep) DLG = null;
}
const N = (s, o) => say(s, null, o);
async function choose(opts, o = {}) {
  const rows = opts.map(s => wrapT(s, o.wrap || 30)), nR = rows.reduce((n, r) => n + r.length, 0);
  const w = Math.min(W - 8, Math.max(...rows.flat().map(s => s.length)) * 6 + 30), h = nR * 12 + 12;
  const m = { opts, rows, i: o.start || 0, x: o.x !== undefined ? o.x : W - w - 8, y: o.y !== undefined ? o.y : VH - h - 6, w, h, title: o.title };
  MENUS.push(m); await nextFrame();
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (pressed.a) { sfx('ok'); break; }
    if (pressed.b && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame(); }
  MENUS.splice(MENUS.indexOf(m), 1); return m.i;
}
async function ask(q, who, opts, o) { await say(q, who, { keep: 1 }); const r = await choose(opts, o); DLG = null; return r; }
function banner(s, t = 120) { BANNER = { s, t }; }
async function showCard(lines, t, o = {}) { CARD = { lines, bg: o.bg || BLACK, fg: o.fg || WHITE, col: o.col }; if (t) await wait(t); else await waitBtn(); if (!o.keep) CARD = null; }

// ---------- UI chrome (drawn over every scene) ----------
const UI = { frame: hex('#3a6cff'), frame2: hex('#12204a'), panel: hex('#0a1030'), panel2: hex('#142060'), hi: hex('#ffd24a') };
function panel(x, y, w, h, tint) {
  rectF(x, y, w, h, UI.panel); gradV(x + 2, y + 2, w - 4, h - 4, tint || UI.panel2, UI.panel, 6);
  frameR(x, y, w, h, UI.frame); frameR(x + 1, y + 1, w - 2, h - 2, UI.frame2); rectF(x + 2, y + 2, w - 4, 1, hex('#6a9cff'));
}
function drawUI() {
  if (DLG) {
    const y = VH + 2, h = H - y - 2; panel(4, y, W - 8, h);
    if (DLG.who) { const c = DLG.c, col = (c && c.col) || WHITE, w = tw(DLG.who) + 20; panel(14, y - 11, w, 15, UI.panel2); text(DLG.who, 24, y - 8, col); }
    let n = DLG.n | 0; const tc = DLG.narr ? hex('#a8e8ff') : WHITE;
    DLG.lines.forEach((l, i) => { text(l.slice(0, Math.max(0, n)), 20, y + 10 + i * 13, tc); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) { text('v', W - 26, H - 16, UI.hi); }
  }
  for (const m of MENUS) {
    panel(m.x, m.y, m.w, m.h); if (m.title) text(m.title, m.x + 10, m.y - 9, UI.hi);
    let r = 0; m.rows.forEach((lines, i) => { if (i === m.i) { rectA(m.x + 4, m.y + 5 + r * 12, m.w - 8, lines.length * 12, hex('#3a6cff'), .55); text('>', m.x + 8, m.y + 8 + r * 12, UI.hi); }
      for (const l of lines) text(l, m.x + 20, m.y + 8 + r++ * 12, i === m.i ? WHITE : hex('#b8c8ff')); });
  }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = tw(BANNER.s) + 28; panel(((W - w) / 2) | 0, 10, w, 20); ctext(BANNER.s, 16, UI.hi); }
  if (CARD) { rectF(0, 0, W, H, CARD.bg); const ls = CARD.lines.flatMap(l => wrapT(l, 70)), y0 = ((H - ls.length * 14) / 2) | 0; ls.forEach((l, i) => ctext(l, y0 + i * 14, CARD.col && i === 0 ? CARD.col : CARD.fg)); }
}

// ---------- save ----------
function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function fetchStore(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
