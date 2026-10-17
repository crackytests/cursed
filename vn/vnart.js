'use strict';
// ================= VISITOR: THE NORMALCY: art (tiles, people, machines, props) =================
// Everything is painted once into buffers at boot. The house look: 12-bit colour, Bayer-dithered shading,
// 1px ink outlines on figures, the top-down 3/4 view of Ultima VII and the MSX2 Metal Gear 2.
const INK = hex('#0a0810');
function outline(b, c = INK) {
  const d = b.d.slice();
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) { if (b.d[y * b.w + x]) continue;
    const o = (xx, yy) => xx >= 0 && yy >= 0 && xx < b.w && yy < b.h && b.d[yy * b.w + xx] && b.d[yy * b.w + xx] !== c;
    if (o(x - 1, y) || o(x + 1, y) || o(x, y - 1) || o(x, y + 1)) d[y * b.w + x] = c; }
  b.d = d; return b;
}
const shadeOf = (c, k) => { const [r, g, b] = chan(c); return k < 1 ? rgb(r * k, g * k, b * k) : rgb(r + (255 - r) * (k - 1), g + (255 - g) * (k - 1), b + (255 - b) * (k - 1)); };
const ditherRect = (x, y, w, h, c, d = .5) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (B4[((x + i) & 3) + (((y + j) & 3) << 2)] / 16 < d) pset(x + i, y + j, c); };
function noiseRect(x, y, w, h, c, amt, seed, k = .12) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const n = hash(x + i, y + j, seed); if (n < amt) pset(x + i, y + j, shadeOf(c, n < amt / 2 ? 1 - k : 1 + k)); } }

// ---------- floors ----------
// style: [base, accent, pattern]
const FLOORS = {
  concrete: ['#6c6e74', '#585a62', 'speck'], asphalt: ['#3a3c44', '#2c2e36', 'speck'], tile: ['#a8aab0', '#8c8e98', 'check'],
  carpet: ['#4a2a38', '#3a2030', 'weave'], bluecarpet: ['#28345a', '#1e2848', 'weave'], wood: ['#7a5432', '#5e3e24', 'plank'],
  grass: ['#3c6a2a', '#2e5420', 'grass'], dirt: ['#6a5034', '#584228', 'speck'], sand: ['#c0a470', '#a88c5c', 'speck'],
  metal: ['#4c5462', '#363c48', 'grate'], marble: ['#c4c0b8', '#a8a49c', 'marble'], lab: ['#d0d4d8', '#a8b0b8', 'check'],
  tatami: ['#b4a868', '#948a50', 'tatami'], casino: ['#6a1420', '#c89a30', 'casino'], rock: ['#4a4440', '#38322e', 'speck'],
  sewer: ['#3a4434', '#2c3428', 'speck'], linoleum: ['#8a9a7a', '#6c7c60', 'check'], road: ['#34363e', '#c8b040', 'road'],
  parking: ['#40424a', '#d8d8d0', 'parking'], neon: ['#24203a', '#ff40a0', 'neon'], dock: ['#5a4a3a', '#3e3228', 'plank'],
  water: ['#1e4a7a', '#3a78b0', 'water'], deep: ['#102c58', '#22508a', 'water'], dark: ['#1c1c22', '#141418', 'speck'],
  gold: ['#8a6a20', '#c89a30', 'check'], snow: ['#d8dce8', '#b8c0d0', 'speck'], mud: ['#4a3c2c', '#382c20', 'speck'],
};
function paintFloor(st, v) {
  const [b0, a0, pat] = FLOORS[st] || FLOORS.concrete, b = hex(b0), a = hex(a0), sd = v * 31 + st.length;
  rectF(0, 0, TW, TH, b);
  if (pat === 'speck') { noiseRect(0, 0, TW, TH, b, .35, sd); if (v % 4 === 0) rectF(0, 0, TW, 1, a); if (v % 3 === 0) rectF(0, 0, 1, TH, a); }
  else if (pat === 'check') { rectF(0, 0, 12, 6, v & 1 ? a : b); rectF(12, 6, 12, 6, v & 1 ? a : b); rectF(12, 0, 12, 6, v & 1 ? b : a); rectF(0, 6, 12, 6, v & 1 ? b : a); rectF(0, 0, TW, 1, shadeOf(a, .8)); rectF(0, 0, 1, TH, shadeOf(a, .8)); rectF(12, 0, 1, TH, shadeOf(a, .85)); rectF(0, 6, TW, 1, shadeOf(a, .85)); }
  else if (pat === 'weave') { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) if ((x + y * 2 + (y >> 1)) % 4 === 0) pset(x, y, a); noiseRect(0, 0, TW, TH, b, .1, sd); }
  else if (pat === 'plank') { for (let y = 0; y < TH; y += 4) { rectF(0, y, TW, 1, a); const o = (hash(v, y, 3) * TW) | 0; rectF(o, y, 1, 4, a); } noiseRect(0, 0, TW, TH, b, .2, sd, .08); }
  else if (pat === 'grass') { noiseRect(0, 0, TW, TH, b, .5, sd, .18); for (let i = 0; i < 6; i++) { const x = (hash(v, i, 5) * TW) | 0, y = (hash(v, i, 6) * TH) | 0; pset(x, y, shadeOf(b, 1.25)); pset(x, y - 1, shadeOf(b, 1.1)); } }
  else if (pat === 'grate') { for (let x = 0; x < TW; x += 3) rectF(x, 0, 1, TH, a); rectF(0, 0, TW, 1, shadeOf(b, 1.2)); rectF(0, TH - 1, TW, 1, a); }
  else if (pat === 'marble') { noiseRect(0, 0, TW, TH, b, .2, sd, .05); for (let i = 0; i < 10; i++) pset(((i * 2.4 + hash(v, i, 1) * 3) | 0), ((i * .9 + hash(v, i, 2) * 3) | 0) % TH, a); rectF(0, 0, TW, 1, a); rectF(0, 0, 1, TH, a); }
  else if (pat === 'tatami') { noiseRect(0, 0, TW, TH, b, .4, sd, .06); for (let y = 1; y < TH; y += 2) for (let x = 0; x < TW; x++) if ((x + y) % 5 === 0) pset(x, y, a); if (v % 2 === 0) rectF(0, 0, TW, 2, hex('#2a3a28')); }
  else if (pat === 'casino') { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const dx = Math.abs(x - 12), dy = Math.abs(y - 6) * 2; if (dx + dy === 10 || dx + dy === 4) pset(x, y, a); else if ((x * 7 + y * 3) % 11 === 0) pset(x, y, hex('#3a0a14')); } }
  else if (pat === 'road') { noiseRect(0, 0, TW, TH, b, .3, sd); }
  else if (pat === 'parking') { noiseRect(0, 0, TW, TH, b, .3, sd); if (v % 3 === 0) rectF(0, 0, 2, TH, a); }
  else if (pat === 'neon') { noiseRect(0, 0, TW, TH, b, .3, sd); if (v % 5 === 0) for (let x = 0; x < TW; x += 2) pset(x, TH - 2, shadeOf(a, .5)); }
  else if (pat === 'water') { for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) { const w = Math.sin((x + v * 3) * .5 + y * 1.3) + Math.sin((x * .3 - y + v * 2)); if (w > 1.2) pset(x, y, a); else if (w < -1.4) pset(x, y, shadeOf(b, .8)); } }
}
// ---------- walls: front face (24x18) and top cap (24x12) ----------
const WALLS = {
  concrete: ['#8a8c92', '#5c5e66', '#2a2c34', 'block'], brick: ['#8a4a34', '#5e3022', '#2c1812', 'brick'], office: ['#c4b494', '#5a4a3a', '#3a3428', 'office'],
  metal: ['#6a7484', '#3c4452', '#1c222c', 'panel'], glass: ['#2a4a6a', '#6a9ac8', '#1a2a3a', 'glass'], stone: ['#5a9a84', '#3a6a5a', '#1c3830', 'stone'],
  rock: ['#6a5e54', '#4a4038', '#241e1a', 'rock'], shoji: ['#e8e0cc', '#6a4a2a', '#3a2a1a', 'shoji'], casino: ['#8a1424', '#d8a838', '#3a0810', 'casino'],
  lab: ['#dce0e4', '#9aa4b0', '#4a5260', 'panel'], fence: ['#9aa0a8', '#6a7078', '#2a2e34', 'fence'], hedge: ['#2e6a2a', '#1e4a1c', '#102810', 'hedge'],
  wood: ['#8a6038', '#5a3c20', '#2a1a0c', 'boards'], neon: ['#2a2440', '#ff40a0', '#100c1c', 'neon'], tile: ['#b8c8c8', '#7a8c8c', '#3a4444', 'wtile'],
  sewer: ['#5a6450', '#3a4232', '#1c2218', 'brick'], dark: ['#3a3a44', '#26262e', '#101014', 'block'], white: ['#e8e8ec', '#b0b0b8', '#606068', 'block'],
  rail: ['#a0a4ac', '#585c64', '#2a2c34', 'rail'], dam: ['#b0aa98', '#86806e', '#3a382e', 'dam'], gold: ['#c89a30', '#8a6a20', '#3a2a08', 'panel'],
};
function paintWallFace(st, v) {
  const [c0, c1, c2, pat] = WALLS[st] || WALLS.concrete, a = hex(c0), b = hex(c1), d = hex(c2), h = WALLH;
  gradV(0, 0, TW, h, shadeOf(a, 1.06), shadeOf(a, .78), 4);
  if (pat === 'block') { rectF(0, 8, TW, 1, b); rectF(v & 1 ? 6 : 16, 0, 1, 8, b); rectF(v & 1 ? 14 : 4, 9, 1, 9, b); noiseRect(0, 0, TW, h, a, .2, v, .06); }
  else if (pat === 'brick') { for (let y = 0; y < h; y += 4) { rectF(0, y, TW, 1, b); for (let x = ((y >> 2) & 1) * 6; x < TW; x += 12) rectF(x, y, 1, 4, b); } noiseRect(0, 0, TW, h, a, .25, v, .1); }
  else if (pat === 'office') { rectF(0, 11, TW, 7, b); rectF(0, 10, TW, 1, shadeOf(a, 1.2)); rectF(0, 11, TW, 1, shadeOf(b, .7)); if (v % 3 === 0) { rectF(8, 2, 8, 6, hex('#3a4a5a')); frameR(8, 2, 8, 6, hex('#2a2018')); } }
  else if (pat === 'panel') { frameR(1, 1, 22, 16, b); rectF(2, 2, 20, 1, shadeOf(a, 1.15)); pset(3, 3, b); pset(20, 3, b); pset(3, 14, b); pset(20, 14, b); if (v % 4 === 1) { rectF(9, 6, 6, 4, d); pset(10, 7, hex('#40ff60')); } }
  else if (pat === 'glass') { rectF(0, 0, TW, h, a); for (let i = 0; i < 8; i++) lineF(4 + i + v % 5, h - 2, 10 + i + v % 5, 2, shadeOf(a, 1.18)); frameR(0, 0, TW, h, d); rectF(0, 12, TW, 1, d); rectF(0, 0, TW, 2, b); }
  else if (pat === 'stone') { rectF(0, 6, TW, 1, b); rectF(0, 12, TW, 1, b); rectF(v & 1 ? 8 : 15, 0, 1, 6, b); rectF(v & 1 ? 3 : 18, 7, 1, 5, b); noiseRect(0, 0, TW, h, a, .3, v, .12); }
  else if (pat === 'rock') { noiseRect(0, 0, TW, h, a, .6, v, .2); for (let i = 0; i < 4; i++) lineF((hash(v, i) * 24) | 0, (hash(i, v) * 18) | 0, ((hash(v, i + 9) * 24) | 0), ((hash(i + 9, v) * 18) | 0), b); }
  else if (pat === 'shoji') { rectF(0, 0, TW, h, a); for (let x = 0; x < TW; x += 6) rectF(x, 0, 1, h, b); for (let y = 0; y < h; y += 5) rectF(0, y, TW, 1, b); rectF(0, h - 3, TW, 3, d); }
  else if (pat === 'casino') { rectF(0, 0, TW, 2, b); rectF(0, h - 3, TW, 3, b); for (let x = 2; x < TW; x += 8) { rectF(x, 5, 4, 8, shadeOf(a, .8)); frameR(x, 5, 4, 8, b); } }
  else if (pat === 'fence') { rectF(0, 0, TW, h, 0); for (let y = 0; y < h; y++) for (let x = 0; x < TW; x++) if ((x + y) % 4 === 0 || (x - y + 40) % 4 === 0) pset(x, y, a); rectF(0, 0, TW, 1, b); rectF(0, 0, 1, h, b); }
  else if (pat === 'hedge') { for (let y = 0; y < h; y++) for (let x = 0; x < TW; x++) { const n = hash(x, y, v); pset(x, y, n < .3 ? b : n > .85 ? shadeOf(a, 1.3) : a); } }
  else if (pat === 'boards') { for (let x = 0; x < TW; x += 6) rectF(x, 0, 1, h, b); noiseRect(0, 0, TW, h, a, .2, v, .08); }
  else if (pat === 'neon') { rectF(0, 0, TW, h, a); if (v % 3 === 0) rectF(0, 6, TW, 2, b); rectF(0, h - 2, TW, 2, d); }
  else if (pat === 'wtile') { for (let y = 0; y < h; y += 4) rectF(0, y, TW, 1, b); for (let x = 0; x < TW; x += 6) rectF(x, 0, 1, h, b); }
  else if (pat === 'rail') { rectF(0, 0, TW, h, 0); rectF(0, 9, TW, 2, a); rectF(0, 11, TW, 1, d); for (let x = 2; x < TW; x += 6) rectF(x, 11, 2, 7, b); }
  else if (pat === 'dam') { for (let y = 0; y < h; y += 6) rectF(0, y, TW, 1, b); noiseRect(0, 0, TW, h, a, .3, v, .06); }
  if (pat !== 'fence' && pat !== 'rail') { rectF(0, h - 1, TW, 1, d); ditherRect(0, h - 4, TW, 3, d, .25); }
}
function paintWallTop(st) {
  const [c0, c1, c2, pat] = WALLS[st] || WALLS.concrete;
  if (pat === 'fence' || pat === 'rail') return;
  const top = pat === 'hedge' ? shadeOf(hex(c0), 1.1) : pat === 'glass' ? hex('#1c2c3c') : mix(hex(c2), hex(c0), .35);
  rectF(0, 0, TW, TH, top); rectF(0, 0, TW, 1, shadeOf(top, 1.35));
  if (pat === 'hedge') noiseRect(0, 0, TW, TH, top, .6, 7, .2);
}
const TILEBUF = {};
function tileBuf(kind, st, v) {
  const k = kind + st + v; let b = TILEBUF[k]; if (b) return b;
  if (kind === 'f') b = offscreen(TW, TH, () => paintFloor(st, v));
  else if (kind === 'w') b = offscreen(TW, WALLH, () => paintWallFace(st, v));
  else b = offscreen(TW, TH, () => paintWallTop(st));
  // floors are opaque even where black: keep 0 for transparency only on fences
  if (kind === 'f') for (let i = 0; i < b.d.length; i++) if (!b.d[i]) b.d[i] = 0xff000000;
  return TILEBUF[k] = b;
}

// ---------- people ----------
// spec: skin, hair, hs (hair style), top, legs, shoes, coat, hat, glasses, kind ('adult'|'big'|'carl'|'kid'|'woman'), belt, mask, helmet, visor
const SPRITES = {};
const PAL = {
  skinA: '#f0c8a8', skinB: '#c89070', skinC: '#8a5a3a', skinD: '#e8b898', alien: '#5ac8a8', alienD: '#2e8a70', pale: '#e8e0e8',
};
function shadeTones(c) { const h = hex(c); return [shadeOf(h, .55), shadeOf(h, .78), h, shadeOf(h, 1.25)]; }
function drawPerson(s, dir, ph, pose, o = {}) { // o.crouch: knees bent; o.noArms: arms are drawn live (Carl's poses); returns the shoulder line
  // canvas 20x32, feet at y=31, centre x=10. dir: 0 down, 1 up, 2 side (facing right)
  const carl = s.kind === 'carl', kid = s.kind === 'kid', big = s.kind === 'big', woman = s.kind === 'woman';
  const cx = 10, foot = 31, sc = carl ? .72 : kid ? .7 : big ? 1.12 : 1;
  const legH = o.crouch ? Math.max(2, Math.round(9 * sc * .45)) : Math.round(9 * sc), torH = Math.round((carl ? 7 : 9) * sc), headR = s.headR || (carl ? 5.4 : kid ? 3.6 : big ? 3.4 : 3.2);
  const hip = foot - legH, sh = hip - torH, headY = sh - (carl ? 4.2 : 2.6) * (carl ? 1 : sc) ;
  const skin = shadeTones(s.skin || PAL.skinA), top = shadeTones(s.top || '#3a4a6a'), legs = shadeTones(s.legs || '#2a2a34'), shoe = hex(s.shoes || '#1a1418');
  const coat = s.coat ? shadeTones(s.coat) : null, bodyW = Math.round((big ? 11 : woman ? 8 : 9) * (carl ? .9 : sc));
  const step = pose === 'walk' ? [0, 1, 0, -1][ph & 3] : 0, bob = pose === 'walk' && (ph & 1) ? 1 : 0;
  // legs
  if (dir === 2) {
    rectF(cx - 2 + step * 2, hip, 3, legH - 1, legs[1]); rectF(cx - 1 - step * 2, hip, 3, legH - 1, legs[2]);
    rectF(cx - 2 + step * 2, foot - 1, 4, 1, shoe); rectF(cx - 1 - step * 2, foot - 1, 4, 1, shoe);
    if (o.crouch) rectF(cx, hip - 1, 4, 2, legs[2]); // thigh forward
  } else {
    if (o.crouch) { rectF(cx - 4, hip - 1, 3, 2, legs[2]); rectF(cx + 1, hip - 1, 3, 2, legs[1]); } // knees out
    const l = step, r = -step;
    rectF(cx - 3, hip, 3, legH - 1 - Math.max(0, l), legs[dir === 1 ? 1 : 2]); rectF(cx, hip, 3, legH - 1 - Math.max(0, r), legs[1]);
    rectF(cx - 3, foot - 1 - Math.max(0, l), 3, 1, shoe); rectF(cx, foot - 1 - Math.max(0, r), 3, 1, shoe);
    if (woman && s.skirt) { polyF([[cx - 4, hip], [cx + 4, hip], [cx + 5, hip + 4], [cx - 5, hip + 4]], hex(s.skirt)); }
  }
  // torso
  const ty = sh - bob, tx = cx - (bodyW >> 1);
  const tw = dir === 2 ? bodyW - 3 : bodyW;
  const tx2 = dir === 2 ? cx - (tw >> 1) : tx;
  rectF(tx2, ty, tw, torH + 1, top[2]); rectF(tx2, ty, tw, 1, top[3]); rectF(tx2 + tw - 2, ty + 1, 2, torH, top[1]);
  if (s.belt) rectF(tx2, ty + torH - 1, tw, 1, hex(s.belt));
  if (coat) { // long coat: covers torso and drapes over the legs
    const cl = Math.round(legH * (s.coatLen || .75));
    rectF(tx2 - 1, ty, tw + 2, torH + cl, coat[2]); rectF(tx2 - 1, ty, tw + 2, 1, coat[3]); rectF(tx2 + tw - 1, ty + 1, 2, torH + cl - 1, coat[1]);
    if (dir === 0) { rectF(cx - 1, ty + 1, 2, torH - 2, top[2]); lineF(cx - 2, ty, cx - 1, ty + 4, coat[0]); lineF(cx + 1, ty, cx, ty + 4, coat[0]); rectF(cx, ty + torH, 1, cl, coat[0]); }
    if (dir === 2 && step) { rectF(tx2 - 1 + (step > 0 ? tw : -1), ty + torH + cl - 2, 2, 2, coat[1]); }
  }
  if (dir === 0 && s.tie) rectF(cx, ty + 1, 1, torH - 3, hex(s.tie));
  if (dir === 0 && s.bowtie) { rectF(cx - 2, ty, 2, 1, hex(s.bowtie)); rectF(cx + 1, ty, 2, 1, hex(s.bowtie)); pset(cx, ty, shadeOf(hex(s.bowtie), .7)); }
  if (dir === 0 && s.vest) { rectF(tx2 + 1, ty + 1, tw - 2, torH - 2, hex(s.vest)); rectF(tx2 + 2, ty + 2, 2, 2, shadeOf(hex(s.vest), .7)); }
  // arms (side swing)
  const armC = coat ? coat[2] : top[2], armL = Math.round(torH * .9);
  if (o.noArms) {} else if (dir !== 2) { rectF(tx2 - 2, ty + 1 + Math.max(0, -step), 2, armL, armC); rectF(tx2 + tw, ty + 1 + Math.max(0, step), 2, armL, shadeOf(armC, .85));
    if (!s.gloves) { pset(tx2 - 2, ty + 1 + armL, skin[2]); pset(tx2 + tw + 1, ty + 1 + armL, skin[1]); } }
  else { rectF(cx - 1 + step, ty + 1, 2, armL, shadeOf(armC, .9)); pset(cx + step, ty + 1 + armL, skin[2]); }
  // head
  const hy = headY - bob, hr = headR, hry = hr * (carl ? .78 : .74);
  if (s.helmet) { blob(cx, hy, hr + .8, hry + .8, shadeTones(s.helmet)); if (dir !== 1 && s.visor) rectF(cx - (dir === 2 ? 0 : hr) , hy - 1, dir === 2 ? hr + 1 : hr * 2, 2, hex(s.visor)); }
  else {
    blob(cx, hy, hr, hry, skin, { light: [-.4, -.7, .6] });
    const hc = s.hair ? shadeTones(s.hair) : null;
    if (hc && s.hs !== 'bald') {
      if (dir === 1) { blob(cx, hy - .3, hr + .2, hry + .2, hc); if (s.hs === 'long' || s.hs === 'pony') rectF(cx - hr + 1, hy, hr * 2 - 2, s.hs === 'long' ? 6 : 3, hc[1]); }
      else { // fringe
        for (let y = Math.floor(hy - hry - .5); y <= hy - hry * .25; y++) for (let x = Math.floor(cx - hr); x <= cx + hr; x++) { const dx = (x + .5 - cx) / (hr + .4), dy = (y + .5 - hy) / (hry + .4); if (dx * dx + dy * dy <= 1) pset(x, y, hc[(x + y) & 1 ? 2 : 1]); }
        if (s.hs === 'long') { rectF(cx - hr - 1, hy - 1, 2, 7, hc[1]); if (dir === 0) rectF(cx + hr - 1, hy - 1, 2, 7, hc[1]); }
        if (s.hs === 'pony' || s.hs === 'up') { blob(cx - (dir === 2 ? 3 : 0), hy - hry - 1.6, 2.4, 1.6, hc); }
        if (s.hs === 'spiky') for (let i = -2; i <= 2; i++) pset(cx + i * 1.5, hy - hry - 1, hc[2]);
      }
    }
    if (dir === 0) { // face
      if (carl) {
        // the eyes: huge, green, shining
        for (const sx of [-1, 1]) { const ex = cx + sx * 2.4; blob(ex, hy + .6, 1.9, 1.7, [hex('#0a3a20'), hex('#1a7a3a'), hex('#40e070'), hex('#c0ffd0')]); pset(ex - .5, hy, WHITE); }
        pset(cx, hy + 3, shadeOf(skin[1], .8));
      } else if (!s.mask) { const ey = Math.round(hy); pset(cx - 1.5, ey, INK); pset(cx + 1.5, ey, INK); if (s.glasses) { rectF(cx - 3, ey, 6, 1, hex(s.glasses)); } if (s.lips) pset(cx, ey + 2, hex(s.lips)); }
      else { rectF(cx - hr, hy - .5, hr * 2, hry + 1, hex(s.mask)); rectF(cx - 2, hy - .5, 1, 1, hex(s.maskEye || '#ff3030')); rectF(cx + 1, hy - .5, 1, 1, hex(s.maskEye || '#ff3030')); }
    } else if (dir === 2) {
      if (carl) { blob(cx + 2.6, hy + .4, 1.6, 1.6, [hex('#0a3a20'), hex('#1a7a3a'), hex('#40e070'), hex('#c0ffd0')]); }
      else if (!s.mask) { pset(cx + hr - 1, Math.round(hy), INK); if (s.glasses) rectF(cx, Math.round(hy), hr, 1, hex(s.glasses)); }
      else rectF(cx - 1, hy - .5, hr + 1, hry + 1, hex(s.mask));
    }
    if (s.hat) { // cap: carl wears his backwards
      const hc2 = shadeTones(s.hat);
      for (let y = Math.floor(hy - hry - 1); y <= hy - hry * .3; y++) for (let x = Math.floor(cx - hr - .3); x <= cx + hr + .3; x++) { const dx = (x + .5 - cx) / (hr + .6), dy = (y + .5 - hy) / (hry + .7); if (dx * dx + dy * dy <= 1) pset(x, y, (x + y) & 1 ? hc2[2] : hc2[1]); }
      const brim = s.hatBack ? (dir === 1 ? 'f' : dir === 0 ? 'b' : 'l') : (dir === 1 ? 'b' : dir === 0 ? 'f' : 'r');
      if (brim === 'f') rectF(cx - hr + 1, hy - hry * .4, hr * 2 - 2, 1, hc2[0]);
      else if (brim === 'l') rectF(cx - hr - 2, hy - hry * .6, 3, 1, hc2[0]);
      else if (brim === 'r') rectF(cx + hr - 1, hy - hry * .6, 3, 1, hc2[0]);
      else rectF(cx - 2, hy - hry - 1.2, 4, 1, hc2[0]);
      if (s.hatBand) rectF(cx - hr, hy - hry * .5, hr * 2, 1, hex(s.hatBand));
    }
  }
  if (s.extra) s.extra(cx, hy, dir, ty, s);
  return { sy: ty + 1, lx: dir === 2 ? cx : tx2 - 1, rx: dir === 2 ? cx + 1 : tx2 + tw, hy };
}
function drawDown(s, dead) { // lying on the floor (canvas 32x14)
  const skin = shadeTones(s.skin || PAL.skinA), top = shadeTones(s.coat || s.top || '#3a4a6a'), legs = shadeTones(s.legs || '#2a2a34');
  const carl = s.kind === 'carl';
  rectF(9, 6, 11, 5, top[2]); rectF(9, 6, 11, 1, top[3]); rectF(20, 7, 9, 2, legs[2]); rectF(20, 9, 9, 2, legs[1]);
  if (s.helmet) blob(5.5, 8, 3.6, 2.8, shadeTones(s.helmet)); else blob(5.5, 8, carl ? 4.6 : 3.4, carl ? 3.4 : 2.6, skin);
  if (s.hair && !s.helmet && s.hs !== 'bald') blob(4.4, 8, 2.4, 2.2, shadeTones(s.hair));
  if (carl) { blob(6.8, 7.2, 1.3, 1, [hex('#0a3a20'), hex('#1a7a3a'), hex('#40e070'), hex('#c0ffd0')]); }
  rectF(11, 4, 6, 2, shadeOf(top[2], .9)); rectF(12, 11, 5, 2, shadeOf(top[2], .8));
}
function personSprites(id, s) {
  const out = { s };
  for (const [dn, d] of [['d', 0], ['u', 1], ['r', 2]]) for (let f = 0; f < 4; f++)
    out[dn + f] = outline(offscreen(20, 32, () => drawPerson(s, d, f, f ? 'walk' : 'stand')));
  if (s.kind === 'carl') // pose frames: crouched, and armless versions whose arms dxworld draws toward the aim
    for (const [dn, d] of [['d', 0], ['u', 1], ['r', 2]]) for (let f = 0; f < 4; f++) for (const [suf, o] of [['c', { crouch: 1 }], ['n', { noArms: 1 }], ['cn', { crouch: 1, noArms: 1 }]]) {
      let arm; const b = outline(offscreen(20, 32, () => { arm = drawPerson(s, d, f, f ? 'walk' : 'stand', o); })); b.arm = arm; out[dn + f + suf] = b; }
  out.down = outline(offscreen(32, 14, () => drawDown(s)));
  SPRITES[id] = out; return out;
}

// ---------- machines and creatures ----------
function machineSprites(id, fn, w, h) { const b = outline(offscreen(w, h, fn)); SPRITES[id] = { d0: b, u0: b, r0: b, d1: b, u1: b, r1: b, d2: b, u2: b, r2: b, d3: b, u3: b, r3: b, down: offscreen(w, h, () => { fn(); for (let i = 0; i < FB.length; i++) if (FB[i]) FB[i] = shadeOf(FB[i], .45); }), mech: 1 }; return SPRITES[id]; }
function animSprites(id, fn, w, h) { const o = { mech: 1 }; for (const [dn, d] of [['d', 0], ['u', 1], ['r', 2]]) for (let f = 0; f < 4; f++) o[dn + f] = outline(offscreen(w, h, () => fn(d, f))); o.down = offscreen(w, h, () => { fn(0, 0); for (let i = 0; i < FB.length; i++) if (FB[i]) FB[i] = shadeOf(FB[i], .4); }); SPRITES[id] = o; return o; }

function buildMachines() {
  // ROBO MALL COP (small security bot): a white dome on treads with a blue light
  machineSprites('secbot', () => { rectF(3, 20, 18, 6, hex('#2a2c34')); for (let x = 4; x < 21; x += 3) pset(x, 22, hex('#5a5c64')); blob(12, 14, 8, 7, shadeTones('#d8dce4')); rectF(5, 12, 14, 3, hex('#1a2a4a')); rectF(7, 13, 10, 1, hex('#40a0ff')); blob(12, 6, 2, 2, [hex('#2040a0'), hex('#3060e0'), hex('#60a0ff'), hex('#c0e0ff')]); text('P', 10, 16, hex('#2a2a3a'), 0); }, 24, 28);
  // MALL WALKER (military bot): big legs, red sensor
  animSprites('milbot', (d, f) => { const s = f & 1 ? 1 : 0; rectF(5, 26 - s, 5, 12 + s, hex('#3a3e46')); rectF(22, 26 - (1 - s), 5, 12 + (1 - s), hex('#3a3e46')); rectF(3, 36, 9, 3, hex('#2a2c32')); rectF(20, 36, 9, 3, hex('#2a2c32')); blob(16, 18, 13, 10, shadeTones('#6a7262')); rectF(4, 18, 24, 3, hex('#3a3e36')); if (d !== 1) { rectF(11, 13, 10, 4, hex('#140808')); rectF(13, 14, 6, 2, hex('#ff2010')); } rectF(0, 18, 5, 4, hex('#2a2c32')); rectF(27, 18, 5, 4, hex('#2a2c32')); text('M12', 7, 22, hex('#c8c060'), 0); }, 32, 40);
  // PROP SPIDER: low spider bot
  animSprites('spider', (d, f) => { const s = f & 1; for (let i = 0; i < 4; i++) { const y = 9 + i * 2; lineF(3, y + (i + s) % 2, 8, y - 2, hex('#4a4a52')); lineF(19, y + (i + s + 1) % 2, 14, y - 2, hex('#4a4a52')); } blob(11, 9, 5, 4, shadeTones('#7a5a2a')); pset(9, 8, hex('#ff3030')); pset(13, 8, hex('#ff3030')); }, 22, 16);
  // MEDBOT / REPAIRBOT: friendly boxes on wheels
  machineSprites('medbot', () => { rectF(4, 6, 16, 22, hex('#d8dce4')); rectF(4, 6, 16, 2, WHITE); rectF(10, 10, 4, 10, hex('#e02020')); rectF(7, 13, 10, 4, hex('#e02020')); rectF(4, 28, 16, 3, hex('#2a2a30')); }, 24, 32);
  machineSprites('repairbot', () => { rectF(4, 6, 16, 22, hex('#d8c040')); rectF(4, 6, 16, 2, hex('#fff080')); rectF(7, 11, 10, 6, hex('#1a1a20')); rectF(8, 13, 8, 2, hex('#40e0ff')); rectF(4, 28, 16, 3, hex('#2a2a30')); }, 24, 32);
  // MALL RAT (giant rat) and THE SPECIMENS
  animSprites('rat', (d, f) => { const s = f & 1; blob(10, 8, 7, 3.6, shadeTones('#6a5a52')); blob(17, 7, 3, 2.4, shadeTones('#7a6a62')); pset(19, 6, hex('#ff2020')); lineF(3, 8, 0, 10 + s, hex('#c89a8a')); rectF(6 + s, 11, 1, 2, hex('#4a3a32')); rectF(13 - s, 11, 1, 2, hex('#4a3a32')); }, 22, 14);
  animSprites('specimen', (d, f) => { const s = f & 1; rectF(8, 18, 2, 8 - s, hex('#7a8088')); rectF(12, 18, 2, 7 + s, hex('#7a8088')); rectF(7, 12, 8, 7, hex('#8a9098')); blob(11, 8, 6, 5, shadeTones('#9aa0a8')); if (d !== 1) { blob(8.6, 8.6, 1.8, 1.6, [INK, INK, hex('#202028'), hex('#404050')]); blob(13.4, 8.6, 1.8, 1.6, [INK, INK, hex('#202028'), hex('#404050')]); } lineF(7, 13, 3, 20 + s, hex('#8a9098')); lineF(14, 13, 18, 20 - s, hex('#8a9098')); }, 22, 28);
  // LINDA BIOROID: a mannequin in pink with a blank face
  animSprites('bioroid', (d, f) => { const s = f & 1; rectF(8, 20, 2, 9 - s, hex('#e8d8d8')); rectF(12, 20, 2, 8 + s, hex('#e8d8d8')); rectF(6, 11, 10, 10, hex('#14141c')); rectF(10, 12, 2, 7, hex('#ff70b0')); blob(11, 6, 3.6, 2.8, shadeTones('#f0e0e0')); blob(9, 2, 3, 2, shadeTones('#ff70b0')); rectF(4, 12, 2, 8, hex('#e8d8d8')); rectF(16, 12, 2, 8, hex('#e8d8d8')); }, 22, 30);
  // the A.S.S. (Alien StarShip), parked: a saucer with a bubble
  SPRITES.ass = offscreen(96, 44, () => { ellF(48, 30, 46, 10, hex('#202830')); blob(48, 26, 44, 11, shadeTones('#9ab8c0')); rectF(4, 26, 88, 1, hex('#e0f8ff')); for (let i = 0; i < 9; i++) blob(10 + i * 9.5, 29, 2, 1.3, [hex('#206040'), hex('#30a060'), hex('#60ff90'), WHITE]); blob(48, 16, 16, 10, [hex('#204858'), hex('#3a7a90'), hex('#7ac8e0'), hex('#e0ffff')]); text('A.S.S.', 31, 31, hex('#3a4a50'), 0); });
}

// ---------- props (furniture, machines, decor): each paints into its own buffer; base = bottom row of the footprint ----------
// PROPS[id] = { w, h (tiles footprint), img (buffer), solid, opaque (blocks sight), light, ... }
const PROPS = {};
function prop(id, fw, fh, pw, ph, paint, o = {}) { PROPS[id] = Object.assign({ fw, fh, img: outline(offscreen(pw, ph, paint), o.ink || INK), solid: 1 }, o); }
function buildProps() {
  const wood = shadeTones('#7a5432'), steel = shadeTones('#7a8494'), dark = shadeTones('#2a2c34');
  // boxes: x,y bottom-aligned. width TW*fw, height = top face + front face
  const box = (w, h, top, front, d = 8) => { rectF(0, 0, w, h - d, top); rectF(0, 0, w, 1, shadeOf(top, 1.25)); rectF(0, h - d, w, d, front); rectF(0, h - d, w, 1, shadeOf(front, .7)); };
  prop('crate', 1, 1, 22, 22, () => { box(22, 22, wood[2], wood[1], 12); lineF(1, 11, 21, 21, wood[0]); lineF(21, 11, 1, 21, wood[0]); frameR(0, 10, 22, 12, wood[0]); }, { hp: 20, push: 1, breakable: 1, drop: 1 });
  prop('mcrate', 1, 1, 22, 24, () => { box(22, 24, steel[2], steel[1], 14); rectF(3, 13, 16, 2, steel[0]); rectF(3, 18, 16, 2, steel[0]); }, { push: 1, heavy: 1 });
  prop('barrel', 1, 1, 14, 20, () => { rectF(1, 4, 12, 15, hex('#4a6a3a')); ellF(7, 4, 6, 3, hex('#5a7a4a')); ellF(7, 4, 4, 2, hex('#2a3a22')); rectF(1, 9, 12, 1, hex('#2a3a22')); rectF(1, 14, 12, 1, hex('#2a3a22')); rectF(10, 4, 3, 15, hex('#3a5a2a')); }, { hp: 12, breakable: 1, explode: 0 });
  prop('xbarrel', 1, 1, 14, 20, () => { rectF(1, 4, 12, 15, hex('#c83020')); ellF(7, 4, 6, 3, hex('#e04030')); ellF(7, 4, 4, 2, hex('#5a1008')); rectF(1, 9, 12, 2, hex('#f0d020')); rectF(10, 4, 3, 15, hex('#a02018')); }, { hp: 8, breakable: 1, explode: 1 });
  prop('firebarrel', 1, 1, 14, 22, () => { rectF(1, 6, 12, 15, hex('#4a3a32')); ellF(7, 6, 6, 3, hex('#2a1a10')); for (let i = 0; i < 6; i++) blob(4 + i, 4 - (i & 1) * 2, 2, 2, [hex('#a02000'), hex('#e06000'), hex('#ffb020'), hex('#fff080')]); }, { light: [5, 1, '#ff9040'], flicker: 1, emissive: 1 });
  prop('desk', 2, 1, 46, 22, () => { box(46, 22, wood[3], wood[1], 9); rectF(2, 13, 10, 8, wood[0]); rectF(34, 13, 10, 8, wood[0]); rectF(6, 15, 2, 1, hex('#c8a040')); rectF(38, 15, 2, 1, hex('#c8a040')); }, { search: 1 });
  prop('table', 1, 1, 22, 18, () => { box(22, 14, wood[3], wood[1], 4); rectF(2, 14, 2, 4, wood[0]); rectF(18, 14, 2, 4, wood[0]); }, { low: 1 });
  prop('chair', 1, 1, 12, 16, () => { rectF(1, 0, 10, 8, hex('#3a2a4a')); rectF(1, 8, 10, 3, hex('#5a4a6a')); rectF(2, 11, 1, 5, INK); rectF(9, 11, 1, 5, INK); }, { solid: 0, low: 1 });
  prop('sofa', 2, 1, 46, 20, () => { rectF(0, 0, 46, 8, hex('#6a2a3a')); rectF(0, 8, 46, 12, hex('#8a3a4a')); rectF(0, 8, 46, 1, hex('#a85a6a')); rectF(0, 2, 5, 18, hex('#5a2030')); rectF(41, 2, 5, 18, hex('#5a2030')); }, { low: 1 });
  prop('bed', 1, 2, 22, 30, () => { rectF(0, 0, 22, 30, hex('#5a4030')); rectF(2, 2, 18, 26, hex('#d8d8e8')); rectF(3, 3, 16, 5, WHITE); rectF(2, 12, 18, 16, hex('#4a6aa0')); rectF(2, 12, 18, 1, hex('#6a8ac0')); }, { low: 1, search: 1 });
  prop('locker', 1, 1, 14, 30, () => { box(14, 30, steel[1], steel[2], 26); rectF(2, 6, 4, 1, steel[0]); rectF(2, 9, 4, 1, steel[0]); rectF(10, 14, 2, 3, steel[0]); }, { search: 1, lockable: 1 });
  prop('shelf', 1, 1, 22, 30, () => { box(22, 30, wood[1], wood[0], 26); for (let y = 6; y < 30; y += 6) { rectF(1, y, 20, 1, wood[2]); for (let x = 2; x < 20; x += 3) rectF(x, y - 4, 2, 4, [hex('#a03030'), hex('#3060a0'), hex('#c0a030'), hex('#30a060')][(x + y) % 4]); } }, { search: 1, opaque: 0 });
  prop('bookshelf', 1, 1, 22, 30, () => { box(22, 30, wood[1], wood[0], 26); for (let y = 6; y < 30; y += 6) { rectF(1, y, 20, 1, wood[2]); for (let x = 2; x < 20; x += 2) rectF(x, y - 4 + (x % 3 === 0 ? 1 : 0), 2, 4 - (x % 3 === 0 ? 1 : 0), [hex('#6a2020'), hex('#203a6a'), hex('#5a4a20'), hex('#2a5a3a'), hex('#4a2a5a')][(x * 7 + y) % 5]); } }, { read: 1 });
  prop('plant', 1, 1, 16, 26, () => { rectF(4, 18, 8, 8, hex('#8a5a3a')); rectF(4, 18, 8, 1, hex('#a87a5a')); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; lineF(8, 18, 8 + Math.cos(a) * 7, 10 + Math.sin(a) * 6 - 4, i & 1 ? hex('#2a8a3a') : hex('#3aa84a')); } }, { hp: 4, breakable: 1 });
  prop('tree', 1, 1, 36, 50, () => { rectF(15, 30, 6, 20, hex('#4a3020')); rectF(15, 30, 2, 20, hex('#6a4a30')); blob(18, 20, 17, 14, shadeTones('#2e6a2a')); blob(12, 14, 9, 7, shadeTones('#3a7a34')); blob(24, 24, 9, 7, shadeTones('#2a5a24')); }, { opaque: 0 });
  prop('palm', 1, 1, 36, 56, () => { for (let y = 16; y < 56; y++) rectF(17 + Math.sin(y * .1) * 2, y, 4, 1, (y & 3) ? hex('#7a6040') : hex('#5a4228')); for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6; for (let k = 0; k < 16; k++) pset(19 + Math.cos(a) * k, 16 + Math.sin(a) * k * .5 + k * k * .03, i & 1 ? hex('#3a8a34') : hex('#2a6a24')); } }, { opaque: 0 });
  prop('lamp', 1, 1, 10, 52, () => { rectF(4, 8, 2, 44, hex('#4a4c54')); rectF(3, 50, 4, 2, hex('#2a2c34')); rectF(0, 4, 10, 4, hex('#3a3c44')); rectF(1, 7, 8, 2, hex('#fff0b0')); }, { light: [7, 1, '#fff0c0'], emissive: 0, opaque: 0, lampTop: 8 });
  prop('neonlamp', 1, 1, 10, 52, () => { rectF(4, 8, 2, 44, hex('#4a4c54')); rectF(0, 4, 10, 4, hex('#3a3c44')); rectF(1, 7, 8, 2, hex('#ff60c0')); }, { light: [7, .9, '#ff80d0'], opaque: 0, lampTop: 8 });
  prop('vend', 1, 1, 20, 34, () => { box(20, 34, hex('#a02020'), hex('#c83030'), 30); rectF(2, 6, 11, 18, hex('#1a2a3a')); for (let y = 8; y < 24; y += 4) for (let x = 3; x < 12; x += 3) rectF(x, y, 2, 2, [hex('#f0d020'), hex('#30c0ff'), hex('#ff6060')][(x + y) % 3]); rectF(14, 10, 4, 6, hex('#2a2a2a')); text('PROP', 1, 26, WHITE, 0); }, { vend: 1, light: [2, .5, '#ff9090'] });
  prop('atm', 1, 1, 16, 30, () => { box(16, 30, hex('#5a6a7a'), hex('#7a8a9a'), 26); rectF(3, 8, 10, 7, hex('#103040')); rectF(4, 9, 8, 1, hex('#40ff80')); rectF(4, 11, 6, 1, hex('#40ff80')); rectF(4, 18, 8, 4, hex('#3a4a5a')); }, { comp: 1 });
  prop('computer', 1, 1, 22, 22, () => { box(22, 22, hex('#c8c0a8'), hex('#a89c80'), 8); rectF(4, 0, 14, 10, hex('#d8d0b8')); rectF(6, 2, 10, 6, hex('#103828')); rectF(7, 3, 6, 1, hex('#40ff80')); rectF(7, 5, 8, 1, hex('#40ff80')); rectF(3, 11, 16, 2, hex('#8a8070')); }, { comp: 1, light: [2, .45, '#60ff90'] });
  prop('seccomp', 1, 1, 22, 28, () => { box(22, 28, hex('#4a5262'), hex('#3a4252'), 12); rectF(2, 0, 18, 13, hex('#2a3242')); rectF(4, 2, 14, 9, hex('#081420')); for (let i = 0; i < 4; i++) rectF(5 + (i & 1) * 7, 3 + (i >> 1) * 4, 5, 3, hex('#305070')); rectF(3, 18, 3, 2, hex('#ff3030')); rectF(8, 18, 3, 2, hex('#30ff60')); }, { comp: 1, light: [2, .45, '#60a0ff'] });
  prop('counter', 2, 1, 46, 20, () => { box(46, 20, hex('#d8d0c0'), hex('#8a5a3a'), 10); rectF(0, 10, 46, 1, hex('#5a3a22')); }, { low: 1 });
  prop('bar', 3, 1, 70, 20, () => { box(70, 20, hex('#5a3a22'), hex('#3a2414'), 11); rectF(0, 0, 70, 2, hex('#8a6a42')); for (let x = 6; x < 66; x += 12) { rectF(x, 0, 2, 4, hex('#30a060')); pset(x, -1, hex('#a0ffc0')); } }, { low: 1 });
  prop('toilet', 1, 1, 14, 18, () => { rectF(3, 0, 8, 7, hex('#e8e8f0')); ellF(7, 11, 5, 4, hex('#f0f0f8')); ellF(7, 11, 3, 2, hex('#a0c0e0')); rectF(5, 14, 4, 4, hex('#d0d0d8')); }, { low: 1 });
  prop('car', 3, 2, 70, 34, () => { rectF(2, 12, 66, 18, hex('#7a2a2a')); rectF(14, 2, 40, 12, hex('#6a2222')); rectF(17, 4, 34, 8, hex('#2a3a4a')); rectF(2, 12, 66, 1, hex('#b85a5a')); for (const x of [10, 52]) { ellF(x + 4, 30, 6, 3, INK); } rectF(64, 16, 4, 4, hex('#ffe080')); rectF(2, 16, 3, 4, hex('#ff3030')); }, { opaque: 0, cover: 1 });
  prop('wreck', 3, 2, 70, 30, () => { rectF(2, 10, 66, 16, hex('#4a3a32')); rectF(14, 2, 40, 10, hex('#3a2a22')); for (let i = 0; i < 30; i++) pset(2 + hash(i, 1) * 66, 10 + hash(i, 2) * 16, hex('#8a4a22')); ellF(12, 26, 6, 3, INK); ellF(58, 26, 6, 3, INK); }, { opaque: 0, cover: 1 });
  prop('dumpster', 2, 1, 46, 26, () => { box(46, 26, hex('#2a5a3a'), hex('#3a7a4a'), 16); rectF(0, 0, 46, 3, hex('#1a3a24')); rectF(4, 14, 38, 1, hex('#1a3a24')); }, { search: 1, cover: 1 });
  prop('trash', 1, 1, 12, 16, () => { rectF(1, 3, 10, 13, hex('#5a5c64')); ellF(6, 3, 5, 2, hex('#7a7c84')); for (let x = 2; x < 11; x += 3) rectF(x, 5, 1, 10, hex('#3a3c44')); }, { search: 1, low: 1 });
  prop('tv', 1, 1, 20, 20, () => { box(20, 20, hex('#3a3a42'), hex('#2a2a32'), 16); rectF(2, 5, 13, 10, hex('#4060a0')); rectF(3, 6, 6, 3, hex('#80c0ff')); rectF(16, 7, 2, 2, hex('#c0c0c0')); }, { light: [2, .5, '#80a0ff'], low: 1 });
  prop('arcade', 1, 1, 20, 36, () => { box(20, 36, hex('#20184a'), hex('#3a2a8a'), 32); rectF(3, 6, 14, 11, hex('#000010')); for (let i = 0; i < 5; i++) pset(5 + i * 2.5, 8 + (i * 3) % 7, [hex('#ff40a0'), hex('#40ffff'), hex('#ffff40')][i % 3]); rectF(3, 20, 14, 4, hex('#5a4aaa')); pset(6, 21, hex('#ff3030')); pset(12, 22, hex('#30ff30')); text('68', 4, 26, hex('#ff60c0'), 0); }, { light: [3, .7, '#a060ff'], comp: 1 });
  prop('slot', 1, 1, 18, 32, () => { box(18, 32, hex('#c89a30'), hex('#8a1424'), 26); rectF(3, 8, 12, 7, hex('#f8f0e0')); for (let i = 0; i < 3; i++) text('7', 3 + i * 4, 8, hex('#e02020'), 0); rectF(15, 10, 2, 8, hex('#c0c0c0')); blob(16, 9, 1.6, 1.6, [hex('#800000'), hex('#c00000'), hex('#ff2020'), WHITE]); }, { light: [2, .6, '#ffd060'] });
  prop('cardtable', 2, 1, 46, 20, () => { ellF(23, 9, 22, 8, hex('#3a2010')); ellF(23, 8, 20, 6, hex('#1a7a3a')); for (let i = 0; i < 5; i++) rectF(10 + i * 6, 6, 3, 4, WHITE); rectF(10, 14, 26, 6, hex('#3a2010')); }, { low: 1 });
  prop('pillar', 1, 1, 22, 44, () => { rectF(3, 4, 16, 40, hex('#b8b4ac')); rectF(3, 4, 4, 40, hex('#d8d4cc')); rectF(15, 4, 4, 40, hex('#8a8680')); rectF(0, 0, 22, 5, hex('#c8c4bc')); rectF(0, 40, 22, 4, hex('#a8a49c')); }, { opaque: 1 });
  prop('generator', 2, 2, 46, 40, () => { box(46, 40, hex('#5a6a3a'), hex('#4a5a2a'), 26); for (let x = 4; x < 42; x += 4) rectF(x, 18, 2, 18, hex('#2a3418')); rectF(6, 2, 10, 8, hex('#2a2a2a')); rectF(30, 3, 10, 3, hex('#ffd020')); text('HV', 31, 8, INK, 0); }, { light: [2, .4, '#a0ff60'], hp: 80 });
  prop('transmitter', 2, 2, 46, 64, () => { for (let y = 0; y < 50; y += 2) { const w = 4 + y * .3; rectF(23 - w / 2, y, w, 1, hex('#8a8c94')); } lineF(23, 0, 8, 50, hex('#6a6c74')); lineF(23, 0, 38, 50, hex('#6a6c74')); rectF(0, 46, 46, 18, hex('#3a4252')); rectF(0, 46, 46, 2, hex('#5a6272')); blob(23, 2, 2, 2, [hex('#800000'), hex('#c00000'), hex('#ff2020'), WHITE]); }, { light: [3, .6, '#ff4040'] });
  prop('statue', 3, 3, 72, 96, () => { // LINDA-TY: copper-green Linda with a torch
    const g = shadeTones('#4a9a80'); rectF(10, 70, 52, 26, hex('#8a8478')); rectF(10, 70, 52, 2, hex('#b8b4a8'));
    polyF([[22, 72], [50, 72], [44, 34], [28, 34]], g[2]); polyF([[36, 72], [50, 72], [44, 34], [38, 34]], g[1]);
    blob(36, 26, 7, 6, g); blob(30, 18, 6, 6, g); blob(26, 12, 4, 5, g); rectF(44, 6, 3, 26, g[1]); blob(45.5, 4, 4, 4, [hex('#a05000'), hex('#e09020'), hex('#ffd050'), WHITE]); rectF(34, 34, 4, 20, hex('#3a6a5a')); }, { opaque: 1, light: [6, .8, '#ffd080'], lampTop: 4 });
  prop('ass', 4, 2, 96, 44, () => blit(SPRITES.ass, 0, 0), { light: [4, .5, '#60ffa0'], opaque: 0 });
  prop('sign', 1, 1, 22, 26, () => { rectF(10, 12, 2, 14, hex('#4a4c54')); rectF(0, 0, 22, 13, hex('#2a4a8a')); frameR(0, 0, 22, 13, WHITE); }, { read: 1, solid: 0, opaque: 0 });
  prop('poster', 1, 1, 18, 14, () => { rectF(0, 0, 18, 14, hex('#e8d8b0')); rectF(2, 2, 14, 7, hex('#ff70b0')); blob(9, 5, 3, 2, shadeTones('#f0c8a8')); rectF(2, 10, 14, 1, INK); rectF(2, 12, 10, 1, INK); }, { solid: 0, wall: 1, read: 1 });
  prop('fridge', 1, 1, 18, 34, () => { box(18, 34, hex('#e0e0e8'), hex('#c8c8d0'), 30); rectF(1, 14, 16, 1, hex('#8a8a92')); rectF(14, 6, 2, 6, hex('#8a8a92')); rectF(14, 18, 2, 8, hex('#8a8a92')); }, { search: 1 });
  prop('sink', 1, 1, 16, 16, () => { box(16, 16, hex('#e0e0e8'), hex('#a8a8b0'), 8); ellF(8, 4, 5, 2, hex('#90a8c0')); rectF(7, 0, 2, 3, hex('#c0c0c8')); }, { low: 1 });
  prop('rack', 1, 1, 22, 32, () => { box(22, 32, hex('#3a3c44'), hex('#2a2c34'), 28); for (let y = 6; y < 30; y += 4) { rectF(2, y, 18, 2, hex('#1a1c24')); pset(4, y, (y & 4) ? hex('#30ff60') : hex('#ff8030')); pset(7, y, hex('#30a0ff')); } }, { light: [2, .4, '#40ff80'], hp: 30, breakable: 1 });
  prop('tank', 1, 1, 22, 40, () => { rectF(3, 4, 16, 32, hex('#204858')); for (let y = 6; y < 34; y += 3) pset(8 + (y % 5), y, hex('#a0ffff')); rectF(3, 4, 4, 32, hex('#3a7a90')); rectF(1, 0, 20, 5, hex('#5a6a7a')); rectF(1, 35, 20, 5, hex('#5a6a7a')); }, { light: [3, .7, '#40e0ff'], opaque: 0 });
  prop('tanksp', 1, 1, 22, 40, () => { rectF(3, 4, 16, 32, hex('#204858')); blob(11, 14, 5, 4, shadeTones('#9aa0a8')); rectF(9, 18, 4, 10, hex('#8a9098')); pset(9, 14, INK); pset(13, 14, INK); rectF(3, 4, 4, 32, hex('#3a7a90')); rectF(1, 0, 20, 5, hex('#5a6a7a')); rectF(1, 35, 20, 5, hex('#5a6a7a')); }, { light: [3, .7, '#40e0ff'], opaque: 0 });
  prop('cone', 1, 1, 10, 12, () => { polyF([[5, 0], [9, 11], [1, 11]], hex('#ff7020')); rectF(2, 6, 6, 2, WHITE); }, { solid: 0, low: 1 });
  prop('rubble', 1, 1, 22, 12, () => { for (let i = 0; i < 9; i++) blob(3 + hash(i, 1) * 16, 4 + hash(i, 2) * 5, 2 + hash(i, 3) * 3, 1.5 + hash(i, 4) * 2, shadeTones('#6a6460')); }, { solid: 0, low: 1 });
  prop('bench', 2, 1, 46, 14, () => { rectF(0, 0, 46, 4, hex('#7a5432')); rectF(0, 5, 46, 4, hex('#8a6440')); rectF(3, 9, 2, 5, INK); rectF(41, 9, 2, 5, INK); }, { low: 1 });
  prop('kiosk', 2, 1, 46, 36, () => { rectF(0, 0, 46, 8, hex('#e04040')); for (let x = 0; x < 46; x += 8) rectF(x, 0, 4, 8, WHITE); rectF(2, 8, 42, 28, hex('#5a4030')); rectF(2, 14, 42, 2, hex('#a08060')); for (let x = 4; x < 42; x += 5) rectF(x, 10, 3, 4, [hex('#f0d020'), hex('#30a0f0'), hex('#f05050')][x % 3]); }, { light: [3, .6, '#ffd0a0'] });
  prop('tent', 2, 2, 46, 34, () => { polyF([[23, 0], [46, 32], [0, 32]], hex('#4a6a8a')); polyF([[23, 0], [46, 32], [23, 32]], hex('#3a5a7a')); polyF([[23, 12], [29, 32], [17, 32]], hex('#101820')); }, { opaque: 1 });
  prop('crt', 1, 1, 18, 16, () => { box(18, 16, hex('#c8c0a8'), hex('#a89c80'), 4); rectF(2, 1, 14, 10, hex('#103040')); rectF(3, 2, 6, 1, hex('#80e0ff')); }, { low: 1, light: [2, .4, '#80e0ff'] });
  prop('alarm', 1, 1, 10, 14, () => { rectF(0, 0, 10, 14, hex('#a02020')); rectF(2, 2, 6, 6, hex('#ff4040')); rectF(3, 10, 4, 2, hex('#f0d020')); }, { solid: 0, wall: 1 });
  prop('keypad', 1, 1, 8, 10, () => { rectF(0, 0, 8, 10, hex('#3a3c44')); for (let i = 0; i < 9; i++) rectF(1 + (i % 3) * 2, 3 + ((i / 3) | 0) * 2, 1, 1, hex('#a0ffa0')); rectF(1, 1, 6, 1, hex('#ff3030')); }, { solid: 0, wall: 1 });
  prop('jukebox', 1, 1, 22, 34, () => { rectF(1, 8, 20, 26, hex('#6a1a40')); blob(11, 9, 10, 8, shadeTones('#d8a838')); rectF(4, 12, 14, 10, hex('#1a0a20')); for (let i = 0; i < 4; i++) rectF(5 + i * 3.5, 14, 2, 6, [hex('#ff40a0'), hex('#40ffa0'), hex('#a040ff'), hex('#ffd040')][i]); rectF(4, 26, 14, 2, hex('#ff40a0')); }, { light: [3, .8, '#ff60c0'] });
  prop('piano', 2, 1, 46, 26, () => { box(46, 26, hex('#14141a'), hex('#1e1e26'), 12); rectF(4, 12, 38, 4, WHITE); for (let x = 5; x < 42; x += 3) rectF(x, 12, 1, 2, INK); }, { low: 1 });
  prop('stage', 3, 1, 70, 12, () => { rectF(0, 0, 70, 12, hex('#3a1a10')); rectF(0, 0, 70, 2, hex('#c89a30')); }, { solid: 0, low: 1 });
  prop('mic', 1, 1, 8, 28, () => { rectF(3, 6, 2, 22, hex('#5a5a62')); blob(4, 4, 2.4, 2.4, shadeTones('#8a8a92')); rectF(1, 26, 6, 2, hex('#2a2a32')); }, { solid: 0 });
  prop('pump', 1, 1, 18, 30, () => { box(18, 30, hex('#d8d0c0'), hex('#e04030'), 24); rectF(3, 8, 12, 6, hex('#103020')); rectF(4, 10, 8, 1, hex('#40ff80')); rectF(15, 14, 3, 10, INK); }, { low: 0 });
  prop('drum', 1, 1, 14, 16, () => { ellF(7, 4, 6, 3, hex('#d8d8e0')); rectF(1, 4, 12, 10, hex('#a02020')); ellF(7, 14, 6, 2, hex('#801818')); }, { low: 1 });
  prop('shrine', 1, 1, 22, 30, () => { rectF(2, 10, 18, 20, hex('#a02018')); rectF(0, 6, 22, 4, hex('#3a2010')); rectF(6, 14, 10, 10, hex('#e0c060')); blob(11, 18, 3, 3, shadeTones('#ffe090')); }, { light: [3, .7, '#ffc060'] });
  prop('lantern', 1, 1, 10, 14, () => { blob(5, 7, 4.5, 6, [hex('#801010'), hex('#c02020'), hex('#ff5030'), hex('#ffd080')]); rectF(3, 0, 4, 2, INK); rectF(3, 12, 4, 2, INK); }, { solid: 0, wall: 1, light: [4, .8, '#ff6040'], emissive: 1 });
  prop('console', 2, 1, 46, 24, () => { box(46, 24, hex('#3a4252'), hex('#2a3242'), 12); for (let i = 0; i < 8; i++) rectF(4 + i * 5, 3, 3, 3, [hex('#30ff60'), hex('#ff3030'), hex('#ffd030'), hex('#30a0ff')][i % 4]); rectF(4, 8, 38, 2, hex('#103040')); }, { comp: 1, light: [2, .5, '#60a0ff'] });
  prop('turbine', 2, 2, 46, 40, () => { ellF(23, 22, 22, 16, hex('#5a6270')); ellF(23, 20, 18, 12, hex('#7a8290')); ellF(23, 20, 8, 6, hex('#3a4250')); rectF(0, 34, 46, 6, hex('#3a4250')); }, {});
  prop('pipe', 1, 1, 22, 16, () => { rectF(0, 4, 22, 8, hex('#6a7480')); rectF(0, 4, 22, 2, hex('#9aa4b0')); rectF(9, 2, 4, 12, hex('#4a5460')); }, { low: 1 });
  prop('plane', 6, 3, 140, 56, () => { const b = hex('#c8ccd4'), d = hex('#8a8e98'); polyF([[20, 22], [120, 22], [136, 28], [120, 34], [20, 34]], b); rectF(20, 22, 100, 2, WHITE); rectF(20, 32, 100, 2, d); polyF([[50, 24], [80, 24], [70, 2], [60, 2]], d); polyF([[50, 32], [80, 32], [70, 54], [60, 54]], d); polyF([[8, 22], [24, 22], [24, 34], [8, 34]], d); polyF([[4, 18], [16, 22], [16, 34], [4, 38]], d); for (let x = 30; x < 112; x += 6) rectF(x, 25, 3, 2, hex('#2a3a5a')); rectF(118, 25, 8, 3, hex('#2a3a5a')); text('PRETEND AIR', 54, 27, hex('#c02020'), 0); }, { opaque: 0, cover: 1 });
  prop('manhole', 1, 1, 18, 8, () => { ellF(9, 4, 8, 3.4, hex('#2a2c30')); ellF(9, 4, 6, 2.4, hex('#3a3c42')); for (let x = 4; x < 15; x += 3) rectF(x, 3, 1, 3, hex('#1a1c20')); }, { solid: 0, low: 1 });
  prop('stairs', 1, 1, 22, 12, () => { for (let k = 0; k < 4; k++) { rectF(1 + k, k * 3, 20 - k * 2, 3, hex(['#8a8a94', '#6a6a74', '#4a4a54', '#2a2a34'][k])); rectF(1 + k, k * 3, 20 - k * 2, 1, hex('#b0b0ba')); } rectF(10, 1, 2, 7, hex('#ffd24a')); rectF(8, 3, 6, 1, hex('#ffd24a')); rectF(9, 2, 4, 1, hex('#ffd24a')); }, { solid: 0, low: 1 });
  prop('bong', 1, 1, 12, 40, () => { rectF(4, 2, 4, 30, hex('#40c080')); rectF(5, 2, 1, 30, hex('#c0ffd8')); ellF(6, 33, 6, 5, hex('#30a070')); ellF(6, 33, 4, 3, hex('#70e0a8')); rectF(8, 22, 4, 2, hex('#30a070')); rectF(3, 0, 6, 2, hex('#e0ffe8')); }, { opaque: 0, light: [2, .3, '#60ffa0'] });
  prop('body', 1, 1, 30, 12, () => { rectF(6, 4, 14, 5, hex('#3a3a4a')); blob(4, 6, 3, 2.4, shadeTones('#d0a888')); rectF(20, 5, 8, 3, hex('#2a2a34')); }, { solid: 0, low: 1 });
  prop('frozen', 1, 1, 20, 34, () => { rectF(2, 2, 16, 32, hex('#a0d8f0')); rectF(2, 2, 16, 32, 0); for (let y = 2; y < 34; y++) for (let x = 2; x < 18; x++) if ((x + y) % 2) pset(x, y, hex('#a0d8f0')); blob(10, 10, 3.4, 2.6, shadeTones('#e8d8c8')); rectF(6, 14, 8, 12, hex('#1a1a2a')); rectF(6, 4, 8, 3, hex('#1a1a2a')); frameR(1, 1, 18, 33, hex('#e0f8ff')); }, { light: [2, .4, '#a0e0ff'] });
  prop('cell', 1, 1, 22, 30, () => { for (let x = 1; x < 22; x += 4) rectF(x, 0, 2, 30, hex('#5a5c64')); rectF(0, 0, 22, 2, hex('#3a3c44')); rectF(0, 14, 22, 2, hex('#3a3c44')); }, { opaque: 0 });
  prop('pod', 1, 1, 22, 40, () => { // the generator pod at the bottom of the facility
    rectF(2, 2, 18, 36, hex('#2a3040')); rectF(4, 6, 14, 28, hex('#ffe060')); for (let y = 8; y < 32; y += 3) pset(8 + (y % 5), y, WHITE); rectF(0, 0, 22, 4, hex('#5a6070')); rectF(0, 36, 22, 4, hex('#5a6070')); }, { light: [5, 1, '#fff080'], emissive: 1 });
}
// ---------- item icons (inventory grid cells are 26x16; icons are w*26 x h*16) ----------
const ICON = {};
function iconOf(id) { return ICON[id] || ICON._; }
