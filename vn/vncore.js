'use strict';
// ================= VISITOR: THE NORMALCY: core (raw keys, mouse, light tables, game state) =================
const TW = 24, TH = 12, WALLH = 18; // tile footprint on screen (tall pixels: 24x12 reads as a foreshortened square), wall height
const DT = 1 / 60;

// ---------- raw keyboard + mouse (taps latched so a quick press between frames is never lost) ----------
const KD = {}, KT = {}; // held, tapped since the last frame (raw)
let FT = {}; // taps visible this frame (snapshotted when the frame starts, so async UI code sees them too)
const MOUSE = { x: 256, y: 128, on: 0, down: 0, rdown: 0, click: 0, rclick: 0, wheel: 0, moved: 0, _c: 0, _r: 0, _w: 0, _m: 0 };
const NOPREVENT = { KeyF: 1, F11: 1, F12: 1 };
let TYPED = []; // printable characters typed this frame (computers, keypads)
const _typed = [];
addEventListener('keydown', e => {
  if (!e.repeat) KT[e.code] = 1; KD[e.code] = 1;
  if (e.key && e.key.length === 1) _typed.push(e.key); else if (e.code === 'Backspace') _typed.push('BS');
  if (/^F\d+$/.test(e.code) && !NOPREVENT[e.code] || e.code === 'Tab' || e.code === 'Space' || /^Arrow/.test(e.code) || e.code === 'Backspace') e.preventDefault();
});
addEventListener('keyup', e => { KD[e.code] = 0; });
addEventListener('blur', () => { for (const k in KD) KD[k] = 0; MOUSE.down = MOUSE.rdown = 0; });
(() => {
  if (!cv.addEventListener) return;
  const pos = e => { const r = cv.getBoundingClientRect(); MOUSE.x = (e.clientX - r.left) / r.width * W; MOUSE.y = (e.clientY - r.top) / r.height * H; MOUSE.on = 1; MOUSE._m = 1; };
  cv.addEventListener('mousemove', pos);
  cv.addEventListener('mousedown', e => { pos(e); anyKey = true; if (typeof audioInit === 'function') audioInit(); if (e.button === 2) { MOUSE.rdown = 1; MOUSE._r = 1; } else { MOUSE.down = 1; MOUSE._c = 1; } e.preventDefault(); });
  addEventListener('mouseup', e => { if (e.button === 2) MOUSE.rdown = 0; else MOUSE.down = 0; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('wheel', e => { MOUSE._w += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
})();
const key = c => !!KD[c], tap = c => !!FT[c];
function beginInputFrame() {
  FT = {}; for (const k in KT) { FT[k] = 1; delete KT[k]; }
  MOUSE.click = MOUSE._c; MOUSE.rclick = MOUSE._r; MOUSE.wheel = MOUSE._w; MOUSE.moved = MOUSE._m; MOUSE._c = MOUSE._r = MOUSE._w = MOUSE._m = 0;
  TYPED = _typed.splice(0);
}
{ const _poll = pollInput; pollInput = function () { _poll(); beginInputFrame(); }; }
const tapAny = (...cs) => cs.some(c => FT[c]);
const OK_KEYS = ['Enter', 'Space', 'KeyE', 'KeyZ'], BACK_KEYS = ['Escape', 'Backspace', 'KeyX'];

// ---------- light: 16 darkness levels as 12-bit color tables; darkness falls toward the map's shadow color ----------
const LUT = []; for (let i = 0; i < 17; i++) LUT.push(new Uint32Array(4096));
const MEMLUT = new Uint32Array(4096);
let lutKey = '';
const cidx = c => ((c >> 4) & 15) | (((c >> 12) & 15) << 4) | (((c >> 20) & 15) << 8);
function buildLUT(shadow = '#000010', mem = '#0c1630') {
  if (lutKey === shadow + mem) return; lutKey = shadow + mem;
  const s = chan(hex(shadow)), m = chan(hex(mem));
  for (let i = 0; i < 4096; i++) {
    const r = (i & 15) * 17, g = ((i >> 4) & 15) * 17, b = ((i >> 8) & 15) * 17;
    for (let l = 0; l <= 16; l++) { const k = l / 16, kk = Math.pow(k, .9); LUTF[(l << 12) | i] = LUT[l][i] = rgb(s[0] + (r - s[0]) * kk, s[1] + (g - s[1]) * kk, s[2] + (b - s[2]) * kk); }
    const lum = (r * .3 + g * .55 + b * .15) / 255; MEMLUT[i] = rgb(m[0] * (.35 + lum * .9), m[1] * (.35 + lum * .9), m[2] * (.4 + lum * .9));
  }
}
// per-pixel light (0..255) and visibility (0 unseen, 1 remembered, 2 visible) written alongside the colour while the world draws
const LB = new Uint8Array(W * H), VB = new Uint8Array(W * H);
let curL = 255, curV = 2;
const LUTF = new Uint32Array(17 * 4096), LVL = new Uint8Array(256), FRC = new Uint8Array(256);
for (let l = 0; l < 256; l++) { const f = l * 16 / 255; LVL[l] = f | 0; FRC[l] = ((f - (f | 0)) * 16) | 0; }
function shade() { // final world pass: colour * light, remembered = cold tint, unseen = black
  const fb = FB, lb = LB, vb = VB;
  for (let y = 0; y < H; y++) { const by = (y & 3) << 2, o = y * W;
    for (let x = 0; x < W; x++) { const i = o + x, v = vb[i];
      if (v === 2) { const l = lb[i]; if (l >= 250) continue; const c = fb[i]; fb[i] = LUTF[((LVL[l] + (FRC[l] > B4[(x & 3) + by] ? 1 : 0)) << 12) | ((c >> 4) & 15) | ((c >> 8) & 0xF0) | ((c >> 12) & 0xF00)]; }
      else if (v === 1) { const c = fb[i]; fb[i] = MEMLUT[((c >> 4) & 15) | ((c >> 8) & 0xF0) | ((c >> 12) & 0xF00)]; } else fb[i] = 0xff000000; } }
}
// fast replacements for the engine's per-pixel alpha helpers (the originals allocate per pixel)
const Q4 = new Uint8Array(512); for (let v = 0; v < 512; v++) Q4[v] = Math.round(Math.min(255, v) / 255 * 15) * 17;
rectA = function (x, y, w, h, c, a) {
  const cr = c & 255, cg = (c >> 8) & 255, cb = (c >> 16) & 255, k = Math.round(a * 256), ik = 256 - k; x |= 0; y |= 0;
  const x0 = Math.max(0, x), x1 = Math.min(FW, x + w);
  for (let j = Math.max(0, y); j < Math.min(FH, y + h); j++) { const o = j * FW; for (let i = x0; i < x1; i++) { const p = FB[o + i];
    FB[o + i] = (0xff000000 | (Q4[(((p >> 16) & 255) * ik + cb * k) >> 8] << 16) | (Q4[(((p >> 8) & 255) * ik + cg * k) >> 8] << 8) | Q4[((p & 255) * ik + cr * k) >> 8]) >>> 0; } }
};
glow = function (cx, cy, r, c, a = 1) {
  const cr = c & 255, cg = (c >> 8) & 255, cb = (c >> 16) & 255, r2 = r * r;
  for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(FH, cy + r); y++) { const dy = y - cy, o = y * FW, by = (y & 3) << 2;
    for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(FW, cx + r); x++) { const dx = x - cx, d2 = dx * dx + dy * dy; if (d2 >= r2) continue;
      const d = Math.sqrt(d2) / r, k = (1 - d) * (1 - d) * a, t = (B4[(x & 3) + by] - 8) * 1.06, p = FB[o + x];
      FB[o + x] = (0xff000000 | (Q4[Math.max(0, ((p >> 16) & 255) + cb * k + t) | 0] << 16) | (Q4[Math.max(0, ((p >> 8) & 255) + cg * k + t) | 0] << 8) | Q4[Math.max(0, (p & 255) + cr * k + t) | 0]) >>> 0; } }
};
// drawing that also stamps light/visibility (the world uses these; HUD uses plain x68 calls)
function wset(x, y, c) { x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < W && y < H) { const i = y * W + x; FB[i] = c; LB[i] = curL; VB[i] = curV; } }
function wrect(x, y, w, h, c) { x |= 0; y |= 0; const x0 = Math.max(0, x), x1 = Math.min(W, x + w); if (x1 <= x0) return; for (let j = Math.max(0, y); j < Math.min(H, y + h); j++) { const o = j * W; FB.fill(c, o + x0, o + x1); LB.fill(curL, o + x0, o + x1); VB.fill(curV, o + x0, o + x1); } }
function wblit(b, x, y, flip, cut) { // cut: a silhouette colour (draw the shape only)
  x |= 0; y |= 0; const bw = b.w;
  for (let j = 0; j < b.h; j++) { const yy = y + j; if (yy < 0 || yy >= H) continue; const o = yy * W, r = j * bw;
    for (let i = 0; i < bw; i++) { const c = b.d[r + (flip ? bw - 1 - i : i)]; if (!c) continue; const xx = x + i; if (xx < 0 || xx >= W) continue; FB[o + xx] = cut || c; LB[o + xx] = curL; VB[o + xx] = curV; } }
}

// extra glyphs for the engine font
Object.assign(FONT, { '[': [14, 8, 8, 8, 8, 8, 14], ']': [14, 2, 2, 2, 2, 2, 14], '|': [4, 4, 4, 4, 4, 4, 4], '{': [6, 4, 4, 8, 4, 4, 6], '}': [12, 4, 4, 2, 4, 4, 12], '\\': [16, 16, 8, 4, 2, 1, 1] });
// ---------- options (saved) ----------
const OPT = Object.assign({ cones: 0, chat: 1, crosshair: 1, music: 1, diff: 1, textSpeed: 1, autoaim: 1 }, fetchStore('vn_opt') || {});
const saveOpt = () => store('vn_opt', OPT);

// ---------- game state ----------
const G = { map: null, mapId: '', t: 0, paused: 0, mode: 'title', diff: 1, cam: { x: 0, y: 0 }, msg: [], hub: '' };
let F = {}; // story flags
const MAPS = {}, CONV = {}, HUBS = {}, TEXTS = {}, MAIL = {};
let P = null; // the player
let SEEN = {}; // per map: Uint8Array of explored tiles
const MAPSTATE = {}; // per map entity snapshots
function flag(k, v) { if (v === undefined) return F[k]; F[k] = v; return v; }
const fmtc = n => 'P$' + Math.round(n);

// tiny seeded rng for content that must be stable across reloads
function srand(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angTo = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };
const lerp = (a, b, k) => a + (b - a) * k;
