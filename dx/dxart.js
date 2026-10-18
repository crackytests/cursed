'use strict';
// ================= DEUS EX NEVADA: art (tiles, people, machines, props) =================
// Everything is painted once into buffers at boot. The house look: 12-bit colour, Bayer-dithered shading,
// 1px ink outlines on figures, the top-down 3/4 view of Ultima VII and the MSX2 Metal Gear 2.
const INK = hex('#0a0810');
function outline(b, c = INK) {
  const d = b.d.slice();
  const rem = typeof OPT !== 'undefined' ? OPT.visuals : 1;
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
    if (b.d[y * b.w + x]) continue;
    const getP = (xx, yy) => (xx >= 0 && yy >= 0 && xx < b.w && yy < b.h) ? b.d[yy * b.w + xx] : 0;
    const l = getP(x - 1, y), r = getP(x + 1, y), u = getP(x, y - 1), dn = getP(x, y + 1);
    const isO = col => col && col !== c;
    if (isO(l) || isO(r) || isO(u) || isO(dn)) {
      if (rem && !u && dn) {
        d[y * b.w + x] = shadeOf(dn, 0.42);
      } else {
        d[y * b.w + x] = c;
      }
    }
  }
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
  if (pat === 'speck') {
    noiseRect(0, 0, TW, TH, b, .32, sd, .10);
    if (st === 'concrete') {
      // Continuous architectural slab joints instead of broken random segments
      rectF(0, 0, TW, 1, shadeOf(b, .84));
      rectF(0, 1, TW, 1, shadeOf(b, 1.08));
      rectF(0, 0, 1, TH, shadeOf(b, .88));
    } else if (st === 'asphalt') {
      noiseRect(0, 0, TW, TH, b, .25, sd + 1, .14);
    } else if (st === 'sewer') {
      if (v % 4 === 0) { ellF(12, 6, 5, 2, shadeOf(b, .78)); ellF(12, 6, 3, 1, hex('#1c2818')); }
    } else if (st === 'snow') {
      for (let i = 0; i < 4; i++) pset((hash(v, i, 1) * TW) | 0, (hash(v, i, 2) * TH) | 0, WHITE);
    }
  } else if (pat === 'check') {
    const col0 = v & 1 ? a : b, col1 = v & 1 ? b : a;
    const tiles = [[0, 0, col0], [12, 0, col1], [0, 6, col1], [12, 6, col0]];
    for (const [tx, ty, c] of tiles) {
      rectF(tx, ty, 12, 6, c);
      rectF(tx, ty, 12, 1, shadeOf(c, 1.18));
      rectF(tx, ty, 1, 6, shadeOf(c, 1.14));
      rectF(tx, ty + 5, 12, 1, shadeOf(c, .82));
      rectF(tx + 11, ty, 1, 6, shadeOf(c, .82));
      if (st === 'lab' || st === 'tile' || st === 'gold') {
        pset(tx + 4, ty + 2, shadeOf(c, 1.28)); pset(tx + 5, ty + 2, shadeOf(c, 1.28));
      }
    }
    const grout = shadeOf(b, .62);
    rectF(0, 0, TW, 1, grout); rectF(0, 5, TW, 1, grout); rectF(0, 11, TW, 1, grout);
    rectF(0, 0, 1, TH, grout); rectF(11, 0, 1, TH, grout); rectF(23, 0, 1, TH, grout);
  } else if (pat === 'weave') {
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      if ((x + y * 2 + (y >> 1)) % 4 === 0) pset(x, y, a);
      else if ((x * 3 + y) % 5 === 0) pset(x, y, shadeOf(b, .84));
    }
    noiseRect(0, 0, TW, TH, b, .14, sd, .06);
  } else if (pat === 'plank') {
    noiseRect(0, 0, TW, TH, b, .22, sd, .07);
    for (let y = 0; y < TH; y += 4) {
      rectF(0, y, TW, 1, shadeOf(b, .65));
      rectF(0, y + 1, TW, 1, shadeOf(b, 1.15));
      const o = (hash(v, y, 3) * (TW - 4)) | 0;
      rectF(o, y, 1, 4, shadeOf(b, .6));
      const gy = y + 2, gx = (hash(v, y, 7) * (TW - 8)) | 0;
      rectF(gx, gy, 6, 1, shadeOf(b, 1.08));
    }
  } else if (pat === 'grass') {
    noiseRect(0, 0, TW, TH, b, .5, sd, .16);
    for (let i = 0; i < 6; i++) {
      const gx = (hash(v, i, 5) * (TW - 2)) | 0, gy = ((hash(v, i, 6) * (TH - 3)) | 0) + 2;
      pset(gx, gy, shadeOf(b, .75)); pset(gx, gy - 1, shadeOf(b, 1.25));
      if (i === 3 && v % 5 === 0) pset(gx, gy - 2, hex('#ffe860'));
    }
  } else if (pat === 'grate') {
    rectF(0, 0, TW, TH, b);
    for (let y = 0; y < TH; y += 3) for (let x = 0; x < TW; x += 4) {
      const o = (y >> 1) & 1 ? 2 : 0;
      pset(x + o, y, shadeOf(b, 1.35)); pset(x + o + 1, y, shadeOf(b, .6));
      pset(x + o + 1, y + 1, shadeOf(b, 1.25)); pset(x + o, y + 1, shadeOf(b, .65));
    }
    rectF(0, 0, TW, 1, shadeOf(b, 1.2)); rectF(0, TH - 1, TW, 1, shadeOf(b, .68));
    rectF(0, 0, 1, TH, shadeOf(b, 1.15)); rectF(TW - 1, 0, 1, TH, shadeOf(b, .68));
  } else if (pat === 'marble') {
    noiseRect(0, 0, TW, TH, b, .16, sd, .04);
    const mCol = shadeOf(a, .88), mHi = shadeOf(b, 1.14);
    for (let i = 0; i < 12; i++) {
      const mx = ((i * 1.8 + hash(v, i, 1) * 4) | 0) % TW, my = ((i * .85 + hash(v, i, 2) * 3) | 0) % TH;
      pset(mx, my, mCol);
      if (i % 2 === 0) pset((mx + 1) % TW, (my + 1) % TH, mHi);
    }
    rectF(0, 0, TW, 1, shadeOf(b, .82)); rectF(0, 0, 1, TH, shadeOf(b, .82));
    rectF(0, 1, TW, 1, shadeOf(b, 1.16)); rectF(1, 0, 1, TH, shadeOf(b, 1.16));
  } else if (pat === 'tatami') {
    noiseRect(0, 0, TW, TH, b, .3, sd, .05);
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      if ((x + y) % 3 === 0) pset(x, y, shadeOf(b, 1.1));
      else if ((x + y) % 3 === 1) pset(x, y, shadeOf(b, .92));
    }
    rectF(0, 0, TW, 1, hex('#283c24'));
    rectF(0, TH - 1, TW, 1, hex('#1e2e1a'));
  } else if (pat === 'casino') {
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      const dx = Math.abs(x - 12), dy = Math.abs(y - 6) * 2;
      if (dx + dy === 10 || dx + dy === 4) pset(x, y, a);
      else if (dx + dy === 8 || dx + dy === 2) pset(x, y, shadeOf(a, .75));
      else if ((x * 5 + y * 7) % 9 === 0) pset(x, y, hex('#420a16'));
    }
    pset(12, 6, hex('#ffe070')); pset(12, 5, hex('#ffe070')); pset(12, 7, hex('#c89a30'));
  } else if (pat === 'road') {
    noiseRect(0, 0, TW, TH, b, .3, sd, .12);
    if (v % 3 === 0) {
      rectF(6, 5, 12, 1, hex('#d8a830'));
      rectF(6, 6, 12, 1, hex('#906c18'));
    }
  } else if (pat === 'parking') {
    noiseRect(0, 0, TW, TH, b, .28, sd, .10);
    rectF(0, 0, TW, 1, shadeOf(b, .88));
  } else if (pat === 'neon') {
    noiseRect(0, 0, TW, TH, b, .18, sd, .07);
    rectF(0, 0, TW, 1, hex('#3a2c5a')); rectF(0, 0, 1, TH, hex('#3a2c5a'));
    if (v % 3 === 0) {
      rectF(6, 6, 12, 1, a); pset(6, 5, shadeOf(a, 1.3)); pset(17, 5, shadeOf(a, 1.3));
    }
    pset(0, 0, a); pset(0, TH - 1, a); pset(TW - 1, 0, a); pset(TW - 1, TH - 1, a);
  } else if (pat === 'water') {
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      const w = Math.sin((x + v * 3) * .5 + y * 1.3) + Math.sin(x * .3 - y + v * 2);
      if (w > 1.3) pset(x, y, hex('#70c8ff'));
      else if (w > 0.8) pset(x, y, a);
      else if (w < -1.3) pset(x, y, shadeOf(b, .75));
      else if (w < -0.7) pset(x, y, shadeOf(b, .9));
    }
  }
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
  gradV(0, 0, TW, h, shadeOf(a, 1.08), shadeOf(a, .76), 5);
  if (pat !== 'fence' && pat !== 'rail') {
    rectF(0, 0, TW, 1, shadeOf(a, 1.4));
    rectF(0, 1, TW, 1, shadeOf(a, .88));
  }
  if (pat === 'block') {
    rectF(0, 8, TW, 1, b); rectF(0, 9, TW, 1, shadeOf(a, 1.2));
    const sx1 = v & 1 ? 6 : 16, sx2 = v & 1 ? 14 : 4;
    rectF(sx1, 0, 1, 8, b); rectF(sx1 + 1, 0, 1, 8, shadeOf(a, 1.2));
    rectF(sx2, 9, 1, 9, b); rectF(sx2 + 1, 9, 1, 9, shadeOf(a, 1.2));
    pset(2, 3, shadeOf(a, 1.35)); pset(3, 3, shadeOf(b, .7));
    pset(20, 3, shadeOf(a, 1.35)); pset(21, 3, shadeOf(b, .7));
    pset(2, 12, shadeOf(a, 1.35)); pset(3, 12, shadeOf(b, .7));
    pset(20, 12, shadeOf(a, 1.35)); pset(21, 12, shadeOf(b, .7));
    noiseRect(0, 2, TW, h - 4, a, .22, v, .08);
  } else if (pat === 'brick') {
    for (let y = 0; y < h; y += 4) {
      rectF(0, y, TW, 1, b);
      rectF(0, y + 1, TW, 1, shadeOf(a, 1.3));
      const ox = ((y >> 2) & 1) * 6;
      for (let x = ox; x < TW; x += 12) {
        rectF(x, y, 1, 4, b);
        rectF(x + 1, y + 1, 1, 3, shadeOf(a, 1.25));
        rectF(x - 1 >= 0 ? x - 1 : TW - 1, y + 1, 1, 3, shadeOf(b, .75));
      }
      rectF(0, y + 3, TW, 1, shadeOf(b, .75));
    }
    noiseRect(0, 0, TW, h, a, .25, v, .12);
  } else if (pat === 'office') {
    rectF(0, 10, TW, 8, b);
    rectF(0, 9, TW, 1, shadeOf(b, 1.45));
    rectF(0, 10, TW, 1, shadeOf(b, .7));
    rectF(2, 12, TW - 4, 5, shadeOf(b, .9));
    rectF(2, 12, TW - 4, 1, shadeOf(b, 1.2));
    if (v % 3 === 0) {
      rectF(6, 2, 12, 6, hex('#2a2018'));
      rectF(7, 3, 10, 4, hex('#e8e4d8'));
      rectF(8, 4, 8, 2, hex('#2a3c50'));
    }
  } else if (pat === 'panel') {
    frameR(1, 1, 22, 15, b);
    rectF(2, 2, 20, 1, shadeOf(a, 1.25)); rectF(2, 2, 1, 14, shadeOf(a, 1.2));
    rectF(2, 15, 20, 1, shadeOf(b, .7)); rectF(21, 2, 1, 14, shadeOf(b, .7));
    pset(3, 3, hex('#c8d0dc')); pset(4, 3, shadeOf(b, .6));
    pset(20, 3, hex('#c8d0dc')); pset(21, 3, shadeOf(b, .6));
    pset(3, 14, hex('#c8d0dc')); pset(4, 14, shadeOf(b, .6));
    pset(20, 14, hex('#c8d0dc')); pset(21, 14, shadeOf(b, .6));
    rectF(2, 7, 20, 2, shadeOf(b, .8)); rectF(2, 7, 20, 1, shadeOf(a, 1.2));
    if (v % 4 === 1) {
      rectF(9, 4, 6, 3, d); pset(10, 5, hex('#40ff60')); pset(12, 5, hex('#40ff60')); pset(14, 5, hex('#40ff60'));
    } else if (v % 4 === 2) {
      for (let k = 4; k < 18; k += 4) { lineF(k, 11, k + 2, 13, hex('#e0b820')); lineF(k + 1, 11, k + 3, 13, hex('#202024')); }
    }
  } else if (pat === 'glass') {
    rectF(0, 0, TW, h, a);
    for (let i = 0; i < 9; i++) lineF(3 + i + v % 5, h - 3, 11 + i + v % 5, 2, shadeOf(a, 1.25));
    for (let i = 0; i < 4; i++) lineF(15 + i + v % 5, h - 3, 19 + i + v % 5, 6, shadeOf(a, 1.15));
    frameR(0, 0, TW, h, d); frameR(1, 1, TW - 2, h - 2, hex('#101c24'));
    rectF(0, 11, TW, 1, d); rectF(0, 12, TW, 1, shadeOf(d, 1.3));
  } else if (pat === 'stone') {
    rectF(0, 5, TW, 1, b); rectF(0, 6, TW, 1, shadeOf(a, 1.2));
    rectF(0, 11, TW, 1, b); rectF(0, 12, TW, 1, shadeOf(a, 1.2));
    const sx1 = v & 1 ? 8 : 15, sx2 = v & 1 ? 3 : 18;
    rectF(sx1, 0, 1, 5, b); rectF(sx1 + 1, 0, 1, 5, shadeOf(a, 1.2));
    rectF(sx2, 6, 1, 5, b); rectF(sx2 + 1, 6, 1, 5, shadeOf(a, 1.2));
    noiseRect(0, 0, TW, h, a, .32, v, .14);
  } else if (pat === 'rock') {
    noiseRect(0, 0, TW, h, a, .65, v, .22);
    for (let i = 0; i < 5; i++) {
      const rx0 = (hash(v, i) * 24) | 0, ry0 = (hash(i, v) * 18) | 0;
      const rx1 = (hash(v, i + 9) * 24) | 0, ry1 = (hash(i + 9, v) * 18) | 0;
      lineF(rx0, ry0, rx1, ry1, b);
      lineF(rx0 + 1, ry0, rx1 + 1, ry1, shadeOf(a, 1.25));
    }
  } else if (pat === 'shoji') {
    rectF(0, 0, TW, h, a);
    for (let x = 0; x < TW; x += 6) { rectF(x, 0, 1, h, b); rectF(x + 1, 0, 1, h, shadeOf(b, 1.2)); }
    for (let y = 0; y < h; y += 4) { rectF(0, y, TW, 1, b); rectF(0, y + 1, TW, 1, shadeOf(b, 1.2)); }
    rectF(0, h - 3, TW, 3, d); rectF(0, h - 3, TW, 1, shadeOf(d, 1.4));
  } else if (pat === 'casino') {
    rectF(0, 0, TW, 2, b); rectF(0, 2, TW, 1, shadeOf(b, 1.4));
    rectF(0, h - 3, TW, 3, b); rectF(0, h - 3, TW, 1, shadeOf(b, 1.4));
    for (let x = 2; x < TW; x += 8) {
      rectF(x, 4, 5, 9, shadeOf(a, .8)); frameR(x, 4, 5, 9, b);
      pset(x + 2, 8, hex('#ffe070'));
      pset(x + 2, 7, hex('#c89a30')); pset(x + 2, 9, hex('#806010'));
    }
  } else if (pat === 'fence') {
    rectF(0, 0, TW, h, 0);
    for (let y = 0; y < h; y++) for (let x = 0; x < TW; x++) {
      if ((x + y) % 4 === 0 || (x - y + 40) % 4 === 0) pset(x, y, a);
    }
    rectF(0, 0, TW, 2, b); rectF(0, 0, TW, 1, shadeOf(b, 1.3));
    rectF(0, 0, 2, h, b); rectF(0, 0, 1, h, shadeOf(b, 1.3));
  } else if (pat === 'hedge') {
    for (let y = 0; y < h; y++) for (let x = 0; x < TW; x++) {
      const n = hash(x, y, v);
      pset(x, y, n < .28 ? b : n > .82 ? shadeOf(a, 1.35) : a);
    }
  } else if (pat === 'boards') {
    for (let x = 0; x < TW; x += 6) { rectF(x, 0, 1, h, b); rectF(x + 1, 0, 1, h, shadeOf(a, 1.25)); }
    noiseRect(0, 0, TW, h, a, .22, v, .08);
  } else if (pat === 'neon') {
    rectF(0, 0, TW, h, a);
    if (v % 3 === 0) {
      rectF(0, 5, TW, 3, shadeOf(b, .6));
      rectF(0, 6, TW, 1, b);
      rectF(0, 6, TW, 1, hex('#ffffff'));
    }
    rectF(0, h - 3, TW, 3, d);
  } else if (pat === 'wtile') {
    for (let y = 0; y < h; y += 4) {
      rectF(0, y, TW, 1, b); rectF(0, y + 1, TW, 1, shadeOf(a, 1.25));
    }
    for (let x = 0; x < TW; x += 6) {
      rectF(x, 0, 1, h, b); rectF(x + 1, 0, 1, h, shadeOf(a, 1.2));
    }
  } else if (pat === 'rail') {
    rectF(0, 0, TW, h, 0);
    rectF(0, 8, TW, 3, a); rectF(0, 8, TW, 1, shadeOf(a, 1.35)); rectF(0, 11, TW, 1, d);
    for (let x = 2; x < TW; x += 6) {
      rectF(x, 11, 2, 7, b); rectF(x, 11, 1, 7, shadeOf(b, 1.3));
    }
  } else if (pat === 'dam') {
    for (let y = 0; y < h; y += 6) {
      rectF(0, y, TW, 1, b); rectF(0, y + 1, TW, 1, shadeOf(a, 1.2));
    }
    noiseRect(0, 0, TW, h, a, .32, v, .08);
  }
  if (pat !== 'fence' && pat !== 'rail') {
    rectF(0, h - 3, TW, 1, shadeOf(d, 1.35));
    rectF(0, h - 2, TW, 1, d);
    rectF(0, h - 1, TW, 1, shadeOf(d, .65));
    ditherRect(0, h - 5, TW, 2, d, .2);
  }
}
function paintWallTop(st) {
  const [c0, c1, c2, pat] = WALLS[st] || WALLS.concrete;
  if (pat === 'fence' || pat === 'rail') return;
  const top = pat === 'hedge' ? shadeOf(hex(c0), 1.1) : pat === 'glass' ? hex('#1c2c3c') : mix(hex(c2), hex(c0), .35);
  rectF(0, 0, TW, TH, top);
  if (pat === 'hedge') noiseRect(0, 0, TW, TH, top, .6, 7, .2);
  else noiseRect(0, 0, TW, TH, top, .14, st.length, .04);
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
function shadeTones(c) {
  const h = hex(c);
  if (typeof OPT !== 'undefined' && !OPT.visuals) {
    return [shadeOf(h, .55), shadeOf(h, .78), h, shadeOf(h, 1.25)];
  }
  const [r, g, b] = chan(h);
  const hi = rgb(Math.min(255, r * 1.26 + 10), Math.min(255, g * 1.24 + 8), Math.min(255, b * 1.12 + 2));
  const mid = h;
  const sh1 = rgb(Math.max(0, r * 0.74 - 2), Math.max(0, g * 0.74), Math.min(255, b * 0.82 + 6));
  const sh0 = rgb(Math.max(0, r * 0.50 - 4), Math.max(0, g * 0.50 - 2), Math.min(255, b * 0.62 + 8));
  return [sh0, sh1, mid, hi];
}
function paintHead(cx, cy, rx, ry, tones) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, d = nx * nx + ny * ny;
      if (d > 1) continue;
      const nz = Math.sqrt(1 - d);
      const I = nx * -0.35 + ny * -0.55 + nz * 0.75;
      pset(x, y, I > 0.68 ? tones[3] : I > 0.28 ? tones[2] : I > 0.04 ? tones[1] : tones[0]);
    }
  }
}
function drawPerson(s, dir, ph, pose, o = {}) { // o.crouch: knees bent; o.noArms: arms are drawn live (Carl's poses); returns the shoulder line
  // canvas 20x32, feet at y=31, centre x=10. dir: 0 down, 1 up, 2 side (facing right)
  const carl = s.kind === 'carl', kid = s.kind === 'kid', big = s.kind === 'big', woman = s.kind === 'woman';
  const cx = 10, foot = 31;
  const step = pose === 'walk' ? [0, 1, 0, -1][ph & 3] : 0;
  const bob = pose === 'walk' && (ph & 1) ? 1 : 0;
  const skin = shadeTones(s.skin || PAL.skinA), top = shadeTones(s.top || '#3a4a6a'), legs = shadeTones(s.legs || '#2a2a34'), shoe = hex(s.shoes || '#1a1418');
  const coat = s.coat ? shadeTones(s.coat) : null;
  const shoeL = shadeOf(shoe, 0.55), shoeH = shadeOf(shoe, 1.45);

  if (carl) {
    // CARL DENTON: iconic big teal-green head, large expressive green alien/cyber eyes, backwards cap with forehead arch, popped collar, yellow bowtie & trenchcoat
    const legH = o.crouch ? 4 : 7, torH = 8;
    const hip = foot - legH, sh = hip - torH, ty = sh - bob;
    const hr = 4.8, hry = 3.8, hy = Math.round(ty - 3.6);
    const tw = dir === 2 ? 6 : 8, tx2 = cx - (tw >> 1);

    // Legs & boots
    if (dir === 2) {
      const lx1 = cx - 2 + step * 2, lx2 = cx - 1 - step * 2;
      rectF(lx2, hip, 3, legH - 1, legs[1]);
      rectF(lx2, foot - 2, 4, 1, shadeOf(shoe, 0.8)); rectF(lx2, foot - 1, 4, 1, shoeL);
      rectF(lx1, hip, 3, legH - 1, legs[2]); rectF(lx1 + 1, hip, 1, legH - 2, legs[3]);
      rectF(lx1, foot - 2, 4, 1, shoe); rectF(lx1, foot - 1, 4, 1, shoeL); pset(lx1 + 3, foot - 2, shoeH);
    } else {
      const lLift = Math.max(0, step), rLift = Math.max(0, -step);
      rectF(cx - 3, hip, 3, legH - 1 - lLift, legs[2]); rectF(cx, hip, 3, legH - 1 - rLift, legs[1]);
      rectF(cx - 1, hip + 1, 1, legH - 2, legs[0]); // inner leg seam
      rectF(cx - 3, foot - 2 - lLift, 3, 1, shoe); rectF(cx - 3, foot - 1 - lLift, 3, 1, shoeL); pset(cx - 2, foot - 2 - lLift, shoeH);
      rectF(cx, foot - 2 - rLift, 3, 1, shoe); rectF(cx, foot - 1 - rLift, 3, 1, shoeL); pset(cx + 1, foot - 2 - rLift, shoeH);
    }

    // Duster Trenchcoat & Popped Collar
    const cl = o.crouch ? 2 : 4;
    const cCol = coat || shadeTones('#1a1c28');
    const cHi = hex('#323a52'), cMid = hex('#1e2232'), cSh = hex('#121420'), cDeep = hex('#0a0c14');
    // Popped collar framing jaw
    if (dir !== 2) {
      rectF(cx - 5, ty - 2, 10, 3, cMid);
      pset(cx - 5, ty - 2, cHi); pset(cx + 4, ty - 2, cSh);
    } else {
      rectF(cx - 3, ty - 2, 5, 3, cMid); pset(cx - 3, ty - 2, cHi);
    }
    // Coat body (tapered at waist, flaring slightly at hem)
    rectF(tx2, ty, tw, torH + cl, cMid);
    rectF(tx2, ty, 2, torH + cl - 1, cHi);
    rectF(tx2 + tw - 2, ty + 1, 2, torH + cl - 1, cSh);
    if (dir === 0) {
      // Inner shirt V-opening & yellow bowtie
      rectF(cx - 2, ty, 4, 4, hex('#12141c'));
      // Lapel edges
      lineF(cx - 3, ty, cx - 1, ty + 5, cHi);
      lineF(cx + 2, ty, cx, ty + 5, cHi);
      // Center seam & split hem
      rectF(cx - 1, ty + 4, 1, torH + cl - 4, cDeep);
      rectF(cx - 1, ty + torH + cl - 2, 2, 2, legs[0]);
      // Iconic yellow bowtie
      const bc = hex(s.bowtie || '#f0d020'), bsh = hex('#b88810'), bhi = hex('#fff070');
      rectF(cx - 2, ty, 2, 2, bc); pset(cx - 2, ty, bhi);
      rectF(cx + 1, ty, 2, 2, bc); pset(cx + 2, ty, bhi);
      rectF(cx, ty, 1, 2, bsh);
      // Coat buttons
      pset(cx - 2, ty + 4, hex('#c8a840')); pset(cx + 1, ty + 4, hex('#c8a840'));
      pset(cx - 2, ty + 6, hex('#c8a840')); pset(cx + 1, ty + 6, hex('#c8a840'));
    } else if (dir === 1) {
      // Back center pleat & shoulder yoke
      rectF(tx2 + 1, ty + 2, tw - 2, 1, cHi);
      rectF(cx - 1, ty + 3, 1, torH + cl - 3, cDeep);
    } else if (dir === 2) {
      lineF(cx + 1, ty, cx + 2, ty + 4, cHi); // side lapel
      rectF(cx - 1, ty + 2, 1, torH + cl - 3, cDeep);
      // Yellow bowtie peeking at front of collar
      pset(cx + 2, ty, hex(s.bowtie || '#f0d020'));
      pset(cx + 2, ty + 1, hex('#b88810'));
    }

    // Arms (when not posed live)
    const armL = 6;
    if (!o.noArms) {
      if (dir !== 2) {
        const la = Math.max(0, -step), ra = Math.max(0, step);
        // 1px dark crease separating sleeves from chest
        rectF(tx2 - 1, ty + 1, 1, armL, cDeep);
        rectF(tx2 + tw, ty + 1, 1, armL, cDeep);
        // Sleeves
        rectF(tx2 - 2, ty + 1 + la, 2, armL - 1, cHi);
        rectF(tx2 - 1, ty + 1 + la, 1, armL - 1, cMid);
        rectF(tx2 + tw, ty + 1 + ra, 2, armL - 1, cSh);
        // Hands (teal alien skin)
        pset(tx2 - 2, ty + armL + la, skin[3]); pset(tx2 - 1, ty + armL + la, skin[2]);
        pset(tx2 + tw, ty + armL + ra, skin[2]); pset(tx2 + tw + 1, ty + armL + ra, skin[1]);
      } else {
        rectF(cx - 2 + step, ty + 1, 1, armL - 1, cDeep);
        rectF(cx + 1 + step, ty + 1, 1, armL - 1, cDeep);
        rectF(cx - 1 + step, ty + 1, 2, armL - 1, cHi);
        rectF(cx - 1 + step, ty + armL, 2, 1, skin[2]);
      }
    }

    // Big teal-green head
    paintHead(cx, hy, hr, hry, skin);

    // Backwards black baseball cap (smooth dome, forehead snapback cutout, rear/side visor brim)
    const capHi = hex('#343e58'), capMid = hex('#1c2030'), capDark = hex('#10121c');
    for (let y = Math.floor(hy - hry); y <= hy - 1; y++) {
      for (let x = Math.floor(cx - hr); x <= Math.ceil(cx + hr); x++) {
        const nx = (x + 0.5 - cx) / (hr + 0.2), ny = (y + 0.5 - hy) / (hry + 0.2);
        if (nx * nx + ny * ny <= 1) {
          pset(x, y, nx < -0.25 && ny < -0.3 ? capHi : nx > 0.35 ? capDark : capMid);
        }
      }
    }
    if (dir === 0) {
      // Cap lower band + forehead snapback arch cutout (matching port_CARL.png!)
      const bandY = hy - 1;
      rectF(cx - 4, bandY, 8, 1, capDark);
      // Forehead skin arch peeking through cap cutout
      rectF(cx - 2, bandY - 1, 4, 1, skin[3]);
      rectF(cx - 1, bandY - 2, 2, 1, skin[2]);
      // Snapback strap across arch
      rectF(cx - 2, bandY, 4, 1, capMid); pset(cx - 1, bandY, capHi);
      // Side-rear visor brim peeking out on right (like port_CARL.png)
      rectF(cx + 4, bandY, 2, 2, capDark); pset(cx + 4, bandY, capHi);

      // Large expressive green alien/cyber eyes (3x3 each)
      for (const [ex, pupilX] of [[cx - 4, cx - 3], [cx + 1, cx + 1]]) {
        const ey = hy;
        // Emerald iris outer
        rectF(ex, ey, 3, 3, hex('#24c858'));
        rectF(ex, ey + 2, 3, 1, hex('#58ff90')); // lower iris glow
        // Dark pupil (2x2)
        rectF(pupilX, ey, 2, 2, hex('#06120c'));
        // Crisp white catchlight
        pset(ex, ey, WHITE);
        // Angled brow ridge
        lineF(ex, ey - 1, ex + 2, ey - 1, skin[0]);
      }
      // Nose highlight & subtle mouth line
      pset(cx - 1, hy + 1, skin[3]); pset(cx, hy + 2, skin[1]);
      rectF(cx - 1, hy + 3, 2, 1, skin[0]);
    } else if (dir === 1) {
      // Back view: curved black visor brim extending down over nape
      rectF(cx - 4, hy - 1, 8, 2, capDark);
      rectF(cx - 3, hy, 6, 2, capDark);
      rectF(cx - 3, hy - 1, 6, 1, capHi);
    } else if (dir === 2) {
      // Side view (facing right): visor brim jutting backward to the left
      const bandY = hy - 1;
      rectF(cx - 4, bandY, 8, 1, capDark);
      rectF(cx - 6, bandY, 3, 2, capDark);
      rectF(cx - 6, bandY, 3, 1, capHi);
      // Forehead cutout on front-right
      rectF(cx + 2, bandY - 1, 2, 1, skin[3]);
      // Large profile eye (3x3)
      const ex = cx + 1, ey = hy;
      rectF(ex, ey, 3, 3, hex('#24c858'));
      rectF(ex, ey + 2, 3, 1, hex('#58ff90'));
      rectF(ex + 1, ey, 2, 2, hex('#06120c'));
      pset(ex + 1, ey, WHITE);
      rectF(ex, ey - 1, 3, 1, skin[0]); // brow
    }

    if (s.extra) s.extra(cx, hy, dir, ty, s);
    return { sy: ty + 1, lx: dir === 2 ? cx : tx2 - 1, rx: dir === 2 ? cx + 1 : tx2 + tw, hy };
  }

  // ---------- HUMAN NPCs, TACTICAL UNITS, WOMEN, KIDS & BOSSES ----------
  const sc = kid ? 0.72 : big ? 1.08 : woman ? 0.94 : 1.0;
  const legH = o.crouch ? Math.max(3, Math.round(9 * sc * 0.5)) : Math.round((kid ? 6 : 9) * (kid ? 1 : sc));
  const torH = Math.round((kid ? 6 : big ? 10 : woman ? 8 : 9));
  const hr = kid ? 3.5 : big ? 4.0 : woman ? 3.6 : 3.7;
  const hry = hr * 0.88;
  const hip = foot - legH, sh = hip - torH, ty = sh - bob;
  const hy = Math.round(sh - (kid ? 2.8 : 3.2)) - bob;
  const bodyW = big ? 10 : woman ? 6 : kid ? 6 : 8;
  const tw = dir === 2 ? Math.max(5, bodyW - 2) : bodyW;
  const tx2 = cx - (tw >> 1);

  // 1. Legs & Boots (narrower than shoulders for athletic V-taper)
  if (dir === 2) {
    const lx1 = cx - 2 + step * 2, lx2 = cx - 1 - step * 2;
    rectF(lx2, hip, 3, legH - 2, legs[1]);
    rectF(lx2, foot - 2, 4, 1, shadeOf(shoe, 0.8)); rectF(lx2, foot - 1, 4, 1, shoeL);
    rectF(lx1, hip, 3, legH - 2, legs[2]); rectF(lx1 + 1, hip, 1, legH - 3, legs[3]);
    rectF(lx1, foot - 2, 4, 1, shoe); rectF(lx1, foot - 1, 4, 1, shoeL); pset(lx1 + 3, foot - 2, shoeH);
  } else {
    const lLift = Math.max(0, step), rLift = Math.max(0, -step);
    const lw = big ? 3 : 2, lxL = cx - lw - (big ? 0 : 1), lxR = cx + (big ? 0 : 1);
    // Left leg
    rectF(lxL, hip, lw, legH - 2 - lLift, legs[dir === 1 ? 1 : 2]);
    if (dir === 0 && !o.crouch) pset(lxL, hip + 2, legs[3]);
    rectF(lxL, foot - 2 - lLift, lw, 1, shoe); rectF(lxL, foot - 1 - lLift, lw, 1, shoeL); pset(lxL, foot - 2 - lLift, shoeH);
    // Right leg
    rectF(lxR, hip, lw, legH - 2 - rLift, legs[1]);
    if (dir === 0 && !o.crouch) pset(lxR + lw - 1, hip + 2, legs[0]);
    rectF(lxR, foot - 2 - rLift, lw, 1, shoe); rectF(lxR, foot - 1 - rLift, lw, 1, shoeL); pset(lxR, foot - 2 - rLift, shoeH);
    // Center leg split shadow
    rectF(cx - 1, hip, big ? 2 : 2, Math.min(3, legH - 2), legs[0]);
    if (woman && s.skirt) {
      const skc = shadeTones(s.skirt);
      polyF([[cx - 3, hip - 1], [cx + 3, hip - 1], [cx + 4, hip + 4], [cx - 4, hip + 4]], skc[2]);
      rectF(cx - 3, hip, 2, 4, skc[3]);
      rectF(cx + 2, hip, 2, 4, skc[1]);
      rectF(cx - 4, hip + 4, 8, 1, skc[0]);
    }
  }

  // 2. Torso & Armor / Suit / Coat
  rectF(tx2, ty, tw, torH, top[2]);
  rectF(tx2, ty, tw, 1, top[3]);
  rectF(tx2, ty + 1, 2, torH - 1, top[3]);
  rectF(tx2 + tw - 2, ty + 1, 2, torH - 1, top[1]);
  // Taper waist at bottom of torso
  if (dir !== 2 && tw >= 8) {
    pset(tx2, ty + torH - 1, 0);
    pset(tx2 + tw - 1, ty + torH - 1, 0);
  }

  if (s.helmet || s.visor) {
    // Sculpted tactical armor chestplate & shoulder pauldrons
    rectF(tx2, ty, tw, 2, top[3]);
    rectF(tx2 + 1, ty + 2, tw - 2, 3, top[2]);
    rectF(tx2 + 1, ty + 5, tw - 2, 1, top[0]); // chest plate lower edge
    if (dir === 0) {
      pset(cx - 1, ty + 2, top[3]); pset(cx - 1, ty + 3, top[0]); pset(cx, ty + 3, top[0]);
      // Pauldrons
      rectF(tx2 - 2, ty, 2, 3, top[3]); rectF(tx2 + tw, ty, 2, 3, top[1]);
    }
  }

  if (s.belt) {
    rectF(tx2 + (tw >= 8 ? 1 : 0), ty + torH - 1, tw - (tw >= 8 ? 2 : 0), 1, hex(s.belt));
    if (dir === 0) pset(cx - 1, ty + torH - 1, hex('#e0d060'));
  }

  if (coat) {
    const cl = Math.min(legH - 3, Math.round(legH * (s.coatLen || 0.65)));
    rectF(tx2, ty, tw, torH + cl, coat[2]);
    rectF(tx2, ty, 2, torH + cl, coat[3]);
    rectF(tx2 + tw - 2, ty, 2, torH + cl, coat[1]);
    if (dir === 0) {
      // Open V-chest showing inner shirt & tie
      rectF(cx - 2, ty + 1, 4, torH - 2, top[2]);
      lineF(cx - 3, ty, cx - 2, ty + 4, coat[3]);
      lineF(cx + 2, ty, cx + 1, ty + 4, coat[1]);
      // Open coat hem showing trousers
      rectF(cx - 1, ty + torH - 1, 2, cl + 1, legs[0]);
    } else if (dir === 1) {
      rectF(cx - 1, ty + 2, 1, torH + cl - 2, coat[0]);
    }
  }

  if (dir === 0 && s.vest) {
    rectF(tx2 + 1, ty + 1, tw - 2, torH - 2, hex(s.vest));
    rectF(cx - 1, ty + 1, 2, 3, top[2]);
  }
  if (dir === 0 && s.tie) {
    rectF(cx - 1, ty + 1, 1, torH - 3, hex(s.tie));
    pset(cx - 1, ty + 1, shadeOf(hex(s.tie), 1.35));
  }
  if (dir === 0 && s.bowtie) {
    const bc = hex(s.bowtie);
    rectF(cx - 2, ty + 1, 4, 1, bc); pset(cx - 1, ty + 1, shadeOf(bc, 0.65));
  }

  // 3. Arms with 1px dark anatomical crease separating sleeve from torso
  const armC = coat ? coat[2] : top[2], armHi = coat ? coat[3] : top[3], armSh = coat ? coat[1] : top[1], armCrease = coat ? coat[0] : top[0];
  const armL = Math.max(4, torH - 2);
  if (!o.noArms) {
    if (dir !== 2) {
      const la = Math.max(0, -step), ra = Math.max(0, step);
      // Left arm
      rectF(tx2 - 2, ty + 1 + la, 2, armL, armHi);
      rectF(tx2 - 1, ty + 2, 1, armL - 1, armCrease); // armpit/torso separation crease
      // Right arm
      rectF(tx2 + tw, ty + 1 + ra, 2, armL, armSh);
      rectF(tx2 + tw, ty + 2, 1, armL - 1, armCrease);
      // Hands / Gloves
      const hL = s.gloves ? hex('#242630') : skin[2], hR = s.gloves ? hex('#161820') : skin[1];
      rectF(tx2 - 2, ty + armL + la, 2, 1, hL);
      rectF(tx2 + tw, ty + armL + ra, 2, 1, hR);
    } else {
      rectF(cx - 2 + step, ty + 1, 1, armL, armCrease);
      rectF(cx + 1 + step, ty + 1, 1, armL, armCrease);
      rectF(cx - 1 + step, ty + 1, 2, armL, armHi);
      pset(cx + step, ty + 2, armC);
      rectF(cx - 1 + step, ty + armL, 2, 1, s.gloves ? hex('#242630') : skin[2]);
    }
  }

  // 4. Neck & Head
  rectF(cx - 1, ty - 1, 2, 2, skin[1]);

  if (s.helmet) {
    const hTones = shadeTones(s.helmet);
    paintHead(cx, hy, hr + 0.6, hry + 0.6, hTones);
    if (dir !== 1 && s.visor) {
      const vx = dir === 2 ? cx - 1 : cx - 3, vw = dir === 2 ? 4 : 6, vy = hy - 1;
      rectF(vx - 1, vy - 1, vw + 2, 3, hex('#080810'));
      rectF(vx, vy, vw, 2, hex(s.visor));
      rectF(vx, vy, vw - 1, 1, shadeOf(hex(s.visor), 1.45));
      pset(vx + 1, vy, WHITE);
    }
  } else {
    paintHead(cx, hy, hr, hry, skin);
    const hc = s.hair ? shadeTones(s.hair) : null;
    if (hc && s.hs !== 'bald') {
      if (dir === 1) {
        paintHead(cx, hy - 0.3, hr + 0.3, hry + 0.3, hc);
        if (s.hs === 'long' || s.hs === 'pony') rectF(cx - 3, hy, 6, s.hs === 'long' ? 6 : 4, hc[1]);
      } else {
        // Sculpted hair cap with highlight band & temple locks (no checkerboard noise!)
        const topY = Math.floor(hy - hry);
        for (let y = topY; y <= hy - 1; y++) {
          for (let x = Math.floor(cx - hr); x <= Math.ceil(cx + hr); x++) {
            const nx = (x + 0.5 - cx) / (hr + 0.3), ny = (y + 0.5 - hy) / (hry + 0.3);
            if (nx * nx + ny * ny <= 1) {
              pset(x, y, y === topY + 1 && nx < 0.3 ? hc[3] : nx < -0.2 ? hc[2] : nx > 0.35 ? hc[0] : hc[1]);
            }
          }
        }
        // Sideburns / long hair framing face
        if (s.hs === 'long') {
          rectF(cx - 4, hy - 1, 2, 6, hc[2]); pset(cx - 4, hy, hc[3]);
          if (dir === 0) { rectF(cx + 2, hy - 1, 2, 6, hc[1]); }
        } else if (dir === 0) {
          pset(cx - 4, hy, hc[1]); pset(cx + 3, hy, hc[0]);
        }
        if (s.hs === 'pony' || s.hs === 'up') {
          paintHead(cx - (dir === 2 ? 3 : 0), topY - 1, 2.2, 1.5, hc);
        }
        if (s.hs === 'spiky') {
          pset(cx - 2, topY - 1, hc[3]); pset(cx, topY - 1, hc[2]); pset(cx + 2, topY - 1, hc[1]);
        }
      }
    }

    // Crisp integer-aligned facial features
    const ey = hy;
    if (dir === 0) {
      if (s.mask) {
        rectF(cx - 3, ey, 6, 3, hex(s.mask));
        pset(cx - 2, ey, hex(s.maskEye || '#ff3030'));
        pset(cx + 1, ey, hex(s.maskEye || '#ff3030'));
      } else {
        // Eyes at cx - 2 (8) and cx + 1 (11)
        pset(cx - 2, ey, INK); pset(cx + 1, ey, INK);
        pset(cx - 2, ey - 1, skin[0]); pset(cx + 1, ey - 1, skin[0]); // brow shadow
        if (s.glasses) {
          const gc = hex(s.glasses), ghi = shadeOf(gc, 1.8) || hex('#80b0ff');
          rectF(cx - 3, ey, 3, 1, gc); rectF(cx, ey, 3, 1, gc); pset(cx - 1, ey, gc);
          pset(cx - 3, ey, ghi); pset(cx, ey, ghi);
        }
        if (s.lips) rectF(cx - 1, ey + 2, 2, 1, hex(s.lips));
        else pset(cx - 1, ey + 2, skin[0]);
      }
    } else if (dir === 2) {
      if (s.mask) {
        rectF(cx, ey, 3, 3, hex(s.mask));
        pset(cx + 1, ey, hex(s.maskEye || '#ff3030'));
      } else {
        pset(cx + 1, ey, INK);
        pset(cx + 1, ey - 1, skin[0]);
        if (s.glasses) {
          const gc = hex(s.glasses);
          rectF(cx, ey, 3, 1, gc); pset(cx + 1, ey, shadeOf(gc, 1.8));
        }
      }
    }

    // Hats (forward brim, fedora, cap — no 1px top spike!)
    if (s.hat) {
      const hc2 = shadeTones(s.hat);
      const topY = Math.floor(hy - hry);
      for (let y = topY; y <= hy - 1; y++) {
        for (let x = cx - 4; x <= cx + 3; x++) {
          const nx = (x + 0.5 - cx) / 4.2, ny = (y + 0.5 - hy) / (hry + 0.3);
          if (nx * nx + ny * ny <= 1) pset(x, y, nx < 0 ? hc2[2] : hc2[1]);
        }
      }
      if (s.hatBand) rectF(cx - 4, hy - 1, 8, 1, hex(s.hatBand));
      if (big && s.hatBand) {
        // Wide fedora brim (JB Garfield)
        rectF(cx - 5, hy - 1, 10, 1, hc2[0]);
        rectF(cx - 4, hy - 2, 8, 1, hc2[3]);
      } else if (dir === 0) {
        rectF(cx - 3, hy - 1, 6, 1, hc2[0]);
      } else if (dir === 2) {
        rectF(cx + 1, hy - 1, 4, 1, hc2[0]);
      }
    }
  }

  if (s.extra) s.extra(cx, hy, dir, ty, s);
  return { sy: ty + 1, lx: dir === 2 ? cx : tx2 - 1, rx: dir === 2 ? cx + 1 : tx2 + tw, hy };
}
function drawDown(s, dead) { // lying on the floor (canvas 32x14)
  const skin = shadeTones(s.skin || PAL.skinA), top = shadeTones(s.coat || s.top || '#3a4a6a'), legs = shadeTones(s.legs || '#2a2a34');
  const carl = s.kind === 'carl';
  rectF(9, 5, 12, 6, top[2]); rectF(9, 5, 12, 1, top[3]);
  rectF(21, 6, 8, 3, legs[2]); rectF(21, 9, 8, 2, legs[1]);
  rectF(29, 6, 2, 5, hex(s.shoes || '#1a1418')); pset(30, 6, shadeOf(hex(s.shoes || '#1a1418'), 1.4));
  if (s.helmet) paintHead(5.5, 7.5, 3.6, 2.8, shadeTones(s.helmet));
  else paintHead(5.5, 7.5, carl ? 4.4 : 3.4, carl ? 3.4 : 2.6, skin);
  if (s.hair && !s.helmet && s.hs !== 'bald') paintHead(4.4, 7.5, 2.4, 2.2, shadeTones(s.hair));
  if (s.hat) paintHead(4.8, 6.8, 3.2, 2.4, shadeTones(s.hat));
  if (carl) {
    rectF(6, 6, 2, 2, hex('#24c858')); pset(7, 6, hex('#06120c')); pset(6, 6, WHITE);
  }
  rectF(10, 3, 7, 2, shadeOf(top[2], 0.9)); rectF(11, 11, 6, 2, shadeOf(top[2], 0.78));
  pset(17, 4, skin[2]); pset(17, 12, skin[1]);
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
  // ROBO MALL COP (small security bot): glossy metallic dome with rotating blue scanner, police badge, and tread assembly
  machineSprites('secbot', () => {
    rectF(3, 20, 18, 6, hex('#1c1e24')); rectF(3, 20, 18, 1, hex('#3a3e48'));
    for (let x = 4; x < 20; x += 3) { rectF(x, 22, 2, 3, hex('#4a4e58')); pset(x, 22, hex('#7a808e')); }
    paintHead(12, 14, 8.5, 7.2, [hex('#5a6478'), hex('#8a96ac'), hex('#c8d2e2'), hex('#f4f8ff')]);
    rectF(4, 11, 16, 4, hex('#0c1424')); rectF(6, 12, 12, 2, hex('#2068c0'));
    rectF(9, 12, 6, 2, hex('#58b4ff')); pset(11, 12, WHITE); pset(12, 12, WHITE);
    // Siren beacon on top
    paintHead(12, 5.5, 2.4, 2.2, [hex('#103080'), hex('#2068d8'), hex('#60b8ff'), WHITE]);
    rectF(10, 7, 4, 1, hex('#2a2c34'));
    // Crisp gold police shield emblem & twin status LEDs
    rectF(10, 16, 4, 2, hex('#e8c040')); pset(11, 16, hex('#fff8a0'));
    rectF(11, 18, 2, 1, hex('#b88820'));
    pset(6, 17, hex('#ff3030')); pset(17, 17, hex('#30ff60'));
  }, 24, 28);

  // MALL WALKER (military bot): heavy bipedal combat walker with sculpted armor turret, hydraulic legs & dual weapon pods
  animSprites('milbot', (d, f) => {
    const s = f & 1 ? 1 : 0;
    // Left & right hydraulic legs
    rectF(5, 25 - s, 5, 12 + s, hex('#262a32')); rectF(6, 25 - s, 2, 12 + s, hex('#525a68'));
    rectF(22, 25 - (1 - s), 5, 12 + (1 - s), hex('#262a32')); rectF(23, 25 - (1 - s), 2, 12 + (1 - s), hex('#525a68'));
    // Armored knee plates
    rectF(4, 28 - s, 7, 3, hex('#4a5646')); rectF(4, 28 - s, 7, 1, hex('#72846c'));
    rectF(21, 28 - (1 - s), 7, 3, hex('#4a5646')); rectF(21, 28 - (1 - s), 7, 1, hex('#72846c'));
    // Heavy mechanized Talons / Feet
    rectF(2, 36, 10, 3, hex('#1a1c22')); rectF(3, 36, 8, 1, hex('#58606e'));
    rectF(20, 36, 10, 3, hex('#1a1c22')); rectF(21, 36, 8, 1, hex('#58606e'));
    // Pelvis & hydraulic hip block
    rectF(9, 24, 14, 4, hex('#22262e')); rectF(11, 25, 10, 2, hex('#3e4450'));
    // Sculpted olive-drab armored turret dome (no Bayer speckle noise)
    paintHead(16, 15, 13, 9.5, [hex('#283226'), hex('#465442'), hex('#66785e'), hex('#8ea284')]);
    // Lower hull bevel & armor seam
    rectF(4, 19, 24, 4, hex('#323c30')); rectF(4, 19, 24, 1, hex('#76886e')); rectF(4, 22, 24, 1, hex('#1c221a'));
    // Micro-stencil unit stripes on upper armor (replaces giant M12 font)
    rectF(6, 15, 3, 1, hex('#e8c840')); rectF(6, 17, 2, 1, hex('#e8c840'));
    if (d !== 1) {
      // Recessed crimson targeting optics bay
      rectF(9, 11, 14, 5, hex('#100404')); frameR(9, 11, 14, 5, hex('#2a3428'));
      rectF(10, 12, 12, 3, hex('#881008'));
      rectF(12, 13, 8, 1, hex('#ff3820')); pset(15, 13, WHITE); pset(16, 13, hex('#ffc0b0'));
    }
    // Dual shoulder weapon pods (autocannon + missile rack)
    rectF(0, 13, 4, 8, hex('#1e2228')); rectF(0, 13, 4, 1, hex('#5a6270'));
    pset(1, 15, hex('#ff3030')); pset(2, 15, hex('#ff3030')); rectF(1, 18, 2, 4, hex('#3a404a'));
    rectF(28, 13, 4, 8, hex('#1e2228')); rectF(28, 13, 4, 1, hex('#5a6270'));
    pset(29, 15, hex('#ff3030')); pset(30, 15, hex('#ff3030')); rectF(29, 18, 2, 4, hex('#3a404a'));
  }, 32, 40);

  // PROP SPIDER: arachnid bot with multi-jointed metallic legs and tri-optic red sensors
  animSprites('spider', (d, f) => {
    const s = f & 1;
    for (let i = 0; i < 4; i++) {
      const y = 9 + i * 2;
      lineF(2, y + (i + s) % 2, 7, y - 3, hex('#686e7c'), 1);
      lineF(7, y - 3, 10, y - 1, hex('#3e424c'), 1);
      lineF(20, y + (i + s + 1) % 2, 15, y - 3, hex('#686e7c'), 1);
      lineF(15, y - 3, 12, y - 1, hex('#3e424c'), 1);
    }
    paintHead(11, 9, 5.5, 4.2, [hex('#262028'), hex('#443848'), hex('#6c5872'), hex('#9a84a2')]);
    // Integer-aligned glowing red arachnid optics
    pset(9, 8, hex('#ff2828')); pset(9, 7, hex('#ffa0a0'));
    pset(13, 8, hex('#ff2828')); pset(13, 7, hex('#ffa0a0'));
    pset(11, 7, hex('#ff4040')); pset(11, 9, hex('#ff2020'));
  }, 22, 16);

  // MEDBOT / REPAIRBOT: friendly utility robots with monitors and badges
  machineSprites('medbot', () => {
    rectF(4, 4, 16, 23, hex('#d8dce4')); rectF(5, 3, 14, 2, hex('#e8ecf4'));
    rectF(4, 4, 16, 1, WHITE); rectF(4, 4, 2, 23, hex('#eef2f8'));
    rectF(18, 4, 2, 23, hex('#98a0ae')); rectF(4, 26, 16, 1, hex('#7a8290'));
    // Crisp Red Cross emblem
    rectF(10, 7, 4, 10, hex('#e02028')); rectF(7, 10, 10, 4, hex('#e02028'));
    rectF(10, 7, 4, 1, hex('#ff6868')); rectF(7, 10, 10, 1, hex('#ff6868'));
    // Vital signs ECG screen
    rectF(6, 19, 12, 6, hex('#0c1c14')); frameR(6, 19, 12, 6, hex('#7a8290'));
    pset(7, 22, hex('#40ff80')); pset(8, 22, hex('#40ff80'));
    pset(9, 20, hex('#80ffb0')); pset(10, 23, hex('#40ff80'));
    pset(11, 21, hex('#80ffb0')); pset(12, 22, hex('#40ff80')); pset(13, 22, hex('#40ff80')); pset(15, 21, hex('#40ff80'));
    // Side medical manipulator clamps & wheeled base
    rectF(2, 12, 2, 6, hex('#8a92a0')); rectF(20, 12, 2, 6, hex('#6a7280'));
    rectF(4, 27, 16, 4, hex('#1e2028')); rectF(6, 28, 3, 2, hex('#5a606e')); rectF(15, 28, 3, 2, hex('#5a606e'));
  }, 24, 32);

  machineSprites('repairbot', () => {
    rectF(4, 4, 16, 23, hex('#d8b830')); rectF(5, 3, 14, 2, hex('#f0d450'));
    rectF(4, 4, 16, 1, hex('#fff088')); rectF(4, 4, 2, 23, hex('#f0d450'));
    rectF(18, 4, 2, 23, hex('#9a7c18')); rectF(4, 26, 16, 1, hex('#786010'));
    for (let k = 6; k < 18; k += 4) { lineF(k, 18, k + 2, 20, hex('#1a1a20')); lineF(k + 1, 18, k + 3, 20, hex('#1a1a20')); }
    rectF(6, 8, 12, 7, hex('#101822')); frameR(6, 8, 12, 7, hex('#786010'));
    rectF(8, 10, 8, 3, hex('#30d0ff')); rectF(9, 10, 6, 1, hex('#a0f0ff')); pset(11, 10, WHITE);
    rectF(2, 12, 2, 6, hex('#7a8290')); rectF(20, 12, 2, 6, hex('#5a6270'));
    rectF(4, 27, 16, 4, hex('#1e2028')); rectF(6, 28, 3, 2, hex('#5a606e')); rectF(15, 28, 3, 2, hex('#5a606e'));
  }, 24, 32);

  // MALL RAT and SPECIMENS
  animSprites('rat', (d, f) => {
    const s = f & 1;
    paintHead(10, 8, 7.2, 3.6, [hex('#3a2c24'), hex('#5a4438'), hex('#7a6050'), hex('#9a8070')]);
    paintHead(17, 7, 3.2, 2.5, [hex('#3a2c24'), hex('#5a4438'), hex('#7a6050'), hex('#9a8070')]);
    pset(19, 6, hex('#ff3030')); pset(18, 5, hex('#ff8080'));
    lineF(3, 8, 0, 10 + s, hex('#c89a8a'));
    rectF(6 + s, 11, 2, 2, hex('#3a2820')); rectF(13 - s, 11, 2, 2, hex('#3a2820'));
  }, 22, 14);

  animSprites('specimen', (d, f) => {
    const s = f & 1;
    rectF(8, 18, 2, 8 - s, hex('#6a747e')); rectF(12, 18, 2, 7 + s, hex('#566068'));
    rectF(7, 12, 8, 7, hex('#7a8690')); rectF(8, 12, 2, 7, hex('#94a2ae'));
    for (let y = 13; y < 18; y += 2) rectF(9, y, 4, 1, hex('#58646e'));
    paintHead(11, 8, 6.2, 5.2, [hex('#4a565e'), hex('#6c7c86'), hex('#92a4b0'), hex('#bed0dc')]);
    if (d !== 1) {
      // Large glossy alien almond eyes
      rectF(7, 8, 3, 2, INK); pset(8, 9, INK); pset(7, 8, hex('#50ff98'));
      rectF(12, 8, 3, 2, INK); pset(13, 9, INK); pset(12, 8, hex('#50ff98'));
    }
    lineF(7, 13, 4, 20 + s, hex('#8a96a0')); lineF(14, 13, 17, 20 - s, hex('#6a747e'));
  }, 22, 28);

  // LINDA BIOROID: synthetic porcelain mannequin
  animSprites('bioroid', (d, f) => {
    const s = f & 1;
    rectF(8, 20, 2, 9 - s, hex('#e8d8d8')); rectF(12, 20, 2, 8 + s, hex('#d4c4c4'));
    rectF(6, 11, 10, 9, hex('#181822')); rectF(6, 11, 2, 9, hex('#2e2e3e'));
    rectF(10, 12, 2, 7, hex('#ff70b0'));
    paintHead(11, 6.5, 3.8, 3.2, shadeTones('#f4e8e8'));
    paintHead(10, 2.5, 3.2, 2.2, [hex('#801840'), hex('#c02868'), hex('#ff5098'), hex('#ff90c0')]);
    if (d !== 1) { pset(9, 7, hex('#ff4090')); pset(12, 7, hex('#ff4090')); }
    rectF(4, 12, 2, 8, hex('#e8d8d8')); rectF(16, 12, 2, 8, hex('#d4c4c4'));
    pset(11, 10, hex('#8a8080')); pset(4, 15, hex('#8a8080')); pset(17, 15, hex('#8a8080'));
  }, 22, 30);

  // the A.S.S. (Alien StarShip): saucer with bubble and neon emitters
  SPRITES.ass = offscreen(96, 44, () => {
    ellF(48, 30, 46, 10, hex('#202830'));
    paintHead(48, 26, 44, 11, [hex('#304450'), hex('#587884'), hex('#9ab8c0'), hex('#d0eff8')]);
    rectF(4, 26, 88, 1, hex('#e0f8ff'));
    for (let i = 0; i < 9; i++) paintHead(10 + i * 9.5, 29, 2.2, 1.4, [hex('#185030'), hex('#289050'), hex('#50f080'), WHITE]);
    paintHead(48, 16, 16, 10, [hex('#183848'), hex('#2c6478'), hex('#6cbcd2'), hex('#d8ffff')]);
    text('A.S.S.', 31, 31, hex('#283640'), 0);
  });
}

// ---------- props (furniture, machines, decor) ----------
const PROPS = {};
function prop(id, fw, fh, pw, ph, paint, o = {}) { PROPS[id] = Object.assign({ fw, fh, img: outline(offscreen(pw, ph, paint), o.ink || INK), solid: 1 }, o); }

function buildProps() {
  const wood = shadeTones('#7a5432'), steel = shadeTones('#7a8494'), dark = shadeTones('#2a2c34');
  const box = (w, h, top, front, d = 8) => {
    rectF(0, 0, w, h - d, top); rectF(0, 0, w, 1, shadeOf(top, 1.3)); rectF(0, 0, 1, h - d, shadeOf(top, 1.2));
    rectF(0, h - d, w, d, front); rectF(0, h - d, w, 1, shadeOf(front, .7));
  };

  prop('crate', 1, 1, 22, 22, () => {
    box(22, 22, wood[2], wood[1], 12);
    rectF(0, 15, 22, 1, wood[0]); rectF(0, 16, 22, 1, wood[3]);
    lineF(2, 11, 20, 20, wood[0]); lineF(20, 11, 2, 20, wood[0]); lineF(2, 10, 20, 19, wood[2]);
    for (const [bx, by] of [[0, 10], [17, 10], [0, 17], [17, 17]]) {
      rectF(bx, by, 5, 5, hex('#3a3e48')); rectF(bx, by, 5, 1, hex('#7a808e'));
      pset(bx + 2, by + 2, hex('#c0c8d4')); pset(bx + 3, by + 2, hex('#202228'));
    }
    pset(11, 13, hex('#c89a30')); pset(10, 14, hex('#c89a30')); pset(12, 14, hex('#c89a30'));
  }, { hp: 20, push: 1, breakable: 1, drop: 1 });

  prop('mcrate', 1, 1, 22, 24, () => {
    box(22, 24, steel[2], steel[1], 14);
    frameR(2, 11, 18, 12, steel[0]); rectF(2, 11, 18, 1, steel[3]);
    for (let k = 3; k < 19; k += 4) { lineF(k, 15, k + 2, 17, hex('#e0b820')); lineF(k + 1, 15, k + 3, 17, hex('#141418')); }
    rectF(9, 12, 4, 2, hex('#101c24')); pset(10, 12, hex('#40ff60')); pset(11, 12, hex('#a0ffc0'));
    for (const [bx, by] of [[0, 10], [19, 10], [0, 20], [19, 20]]) {
      rectF(bx, by, 3, 4, hex('#1c1e22')); pset(bx + 1, by + 1, hex('#4a4e58'));
    }
  }, { push: 1, heavy: 1 });

  prop('barrel', 1, 1, 14, 20, () => {
    rectF(1, 4, 12, 15, hex('#3a542e')); rectF(2, 4, 3, 15, hex('#5a7848')); rectF(10, 4, 3, 15, hex('#24341c'));
    ellF(7, 4, 6, 3, hex('#5a7a4a')); ellF(7, 4, 4, 2, hex('#203018'));
    pset(5, 3, hex('#101808')); pset(8, 4, hex('#405830'));
    rectF(1, 8, 12, 2, hex('#24341c')); rectF(1, 8, 12, 1, hex('#6a8a58'));
    rectF(1, 14, 12, 2, hex('#24341c')); rectF(1, 14, 12, 1, hex('#6a8a58'));
  }, { hp: 12, breakable: 1, explode: 0 });

  prop('xbarrel', 1, 1, 14, 20, () => {
    rectF(1, 4, 12, 15, hex('#a82418')); rectF(2, 4, 3, 15, hex('#d83828')); rectF(10, 4, 3, 15, hex('#6a140c'));
    ellF(7, 4, 6, 3, hex('#e04030')); ellF(7, 4, 4, 2, hex('#501008'));
    rectF(1, 8, 12, 2, hex('#501008')); rectF(1, 8, 12, 1, hex('#f06050'));
    rectF(1, 14, 12, 2, hex('#501008')); rectF(1, 14, 12, 1, hex('#f06050'));
    polyF([[7, 10], [10, 13], [7, 16], [4, 13]], hex('#f0d020'));
    pset(7, 12, hex('#100404')); pset(7, 13, hex('#100404')); pset(7, 14, hex('#100404'));
  }, { hp: 8, breakable: 1, explode: 1 });

  prop('firebarrel', 1, 1, 14, 22, () => {
    rectF(1, 6, 12, 15, hex('#3a3028')); rectF(2, 6, 3, 15, hex('#5a4838')); rectF(10, 6, 3, 15, hex('#201a14'));
    ellF(7, 6, 6, 3, hex('#1a120c'));
    pset(4, 16, hex('#ff8010')); pset(7, 17, hex('#ff8010')); pset(10, 16, hex('#ff8010'));
    for (let i = 0; i < 6; i++) paintHead(4 + i, 4 - (i & 1) * 2, 2.2, 2.2, [hex('#901800'), hex('#d05000'), hex('#ff9818'), hex('#fff480')]);
  }, { light: [5, 1, '#ff9040'], flicker: 1, emissive: 1 });

  prop('desk', 2, 1, 46, 22, () => {
    box(46, 22, wood[3], wood[1], 9);
    rectF(2, 13, 10, 8, wood[0]); rectF(34, 13, 10, 8, wood[0]);
    rectF(2, 13, 10, 1, wood[2]); rectF(34, 13, 10, 1, wood[2]);
    rectF(5, 15, 4, 1, hex('#c8a040')); rectF(37, 15, 4, 1, hex('#c8a040'));
    rectF(14, 2, 18, 9, hex('#284434')); // green desk blotter pad
  }, { search: 1 });

  prop('table', 1, 1, 22, 18, () => {
    box(22, 14, wood[3], wood[1], 4);
    rectF(2, 14, 2, 4, wood[0]); rectF(18, 14, 2, 4, wood[0]);
    rectF(2, 14, 1, 4, wood[2]); rectF(18, 14, 1, 4, wood[2]);
  }, { low: 1 });

  prop('chair', 1, 1, 12, 16, () => {
    rectF(1, 0, 10, 8, hex('#3a2a4a')); rectF(1, 0, 10, 1, hex('#6a5080'));
    rectF(1, 8, 10, 3, hex('#5a4a6a')); rectF(1, 8, 10, 1, hex('#7a6890'));
    rectF(2, 11, 1, 5, hex('#1c1a24')); rectF(9, 11, 1, 5, hex('#1c1a24'));
  }, { solid: 0, low: 1 });

  prop('sofa', 2, 1, 46, 20, () => {
    rectF(0, 0, 46, 8, hex('#6a2a3a')); rectF(0, 0, 46, 1, hex('#9a4a5a'));
    rectF(0, 8, 46, 12, hex('#8a3a4a')); rectF(0, 8, 46, 1, hex('#b05a6a'));
    for (let x = 8; x < 40; x += 8) { pset(x, 12, hex('#4a1a24')); pset(x, 11, hex('#a04858')); }
    rectF(0, 2, 5, 18, hex('#5a2030')); rectF(41, 2, 5, 18, hex('#5a2030'));
  }, { low: 1 });

  prop('bed', 1, 2, 22, 30, () => {
    rectF(0, 0, 22, 30, hex('#5a4030')); rectF(0, 0, 22, 1, hex('#7a5a44'));
    rectF(2, 2, 18, 26, hex('#d8d8e8'));
    rectF(4, 3, 14, 6, WHITE); rectF(4, 3, 14, 1, hex('#e0e0f0'));
    rectF(2, 11, 18, 17, hex('#3a5a90')); rectF(2, 11, 18, 2, hex('#5a7ab8'));
    rectF(2, 14, 18, 1, hex('#284068'));
  }, { low: 1, search: 1 });

  prop('locker', 1, 1, 14, 30, () => {
    box(14, 30, steel[1], steel[2], 26);
    frameR(1, 5, 12, 24, steel[0]); rectF(1, 5, 12, 1, steel[3]);
    for (let y = 7; y < 13; y += 2) rectF(3, y, 5, 1, steel[0]);
    rectF(9, 15, 3, 4, hex('#202428')); pset(10, 16, hex('#c8a840'));
  }, { search: 1, lockable: 1 });

  prop('shelf', 1, 1, 22, 30, () => {
    box(22, 30, wood[1], wood[0], 26);
    for (let y = 6; y < 30; y += 6) {
      rectF(1, y, 20, 1, wood[2]);
      for (let x = 2; x < 20; x += 3) {
        const c = [hex('#b03434'), hex('#3468b0'), hex('#c8a834'), hex('#34a868')][(x + y) % 4];
        rectF(x, y - 4, 2, 4, c); pset(x, y - 4, shadeOf(c, 1.3));
      }
    }
  }, { search: 1, opaque: 0 });

  prop('bookshelf', 1, 1, 22, 30, () => {
    box(22, 30, wood[1], wood[0], 26);
    for (let y = 6; y < 30; y += 6) {
      rectF(1, y, 20, 1, wood[2]);
      for (let x = 2; x < 20; x += 2) {
        const h = 4 - (x % 3 === 0 ? 1 : 0), c = [hex('#7a2424'), hex('#24427a'), hex('#6a5824'), hex('#286840'), hex('#582868')][(x * 7 + y) % 5];
        rectF(x, y - h, 2, h, c); pset(x, y - h, shadeOf(c, 1.4)); pset(x, y - h + 1, hex('#e0d060'));
      }
    }
  }, { read: 1 });

  prop('plant', 1, 1, 16, 26, () => {
    rectF(4, 18, 8, 8, hex('#8a5a3a')); rectF(4, 18, 8, 1, hex('#b07850')); rectF(4, 25, 8, 1, hex('#503018'));
    ellF(8, 17, 4, 1, hex('#201408'));
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2, rx = 8 + Math.cos(a) * 7, ry = 10 + Math.sin(a) * 6 - 3;
      lineF(8, 17, rx, ry, i & 1 ? hex('#288a38') : hex('#3ab04c'));
      pset(rx, ry, hex('#50d060'));
    }
  }, { hp: 4, breakable: 1 });

  prop('tree', 1, 1, 36, 50, () => {
    const t = [hex('#163c14'), hex('#265e22'), hex('#3c8634'), hex('#5cb24e')];
    rectF(15, 30, 6, 20, hex('#422a1a')); rectF(15, 30, 2, 20, hex('#68442c')); rectF(19, 30, 2, 20, hex('#2a180c'));
    paintHead(18, 20, 16, 13, t);
    paintHead(11, 15, 9, 7.5, t);
    paintHead(24, 23, 9.5, 7.5, t);
    paintHead(19, 12, 8.5, 6.5, t);
  }, { opaque: 0 });

  prop('palm', 1, 1, 36, 56, () => {
    for (let y = 16; y < 56; y++) rectF(17 + Math.sin(y * .1) * 2, y, 4, 1, (y & 3) ? hex('#7a6040') : hex('#5a4228'));
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI + i * Math.PI / 7;
      for (let k = 0; k < 17; k++) pset(19 + Math.cos(a) * k, 16 + Math.sin(a) * k * .5 + k * k * .03, i & 1 ? hex('#3ca034') : hex('#287824'));
    }
  }, { opaque: 0 });

  prop('lamp', 1, 1, 10, 52, () => {
    rectF(4, 8, 2, 44, hex('#4a4c54')); rectF(4, 8, 1, 44, hex('#7a808e'));
    rectF(3, 50, 4, 2, hex('#2a2c34'));
    rectF(0, 4, 10, 4, hex('#3a3c44')); rectF(0, 4, 10, 1, hex('#6a6e78'));
    rectF(1, 7, 8, 2, hex('#fff0b0'));
  }, { light: [7, 1, '#fff0c0'], emissive: 0, opaque: 0, lampTop: 8 });

  prop('neonlamp', 1, 1, 10, 52, () => {
    rectF(4, 8, 2, 44, hex('#4a4c54')); rectF(4, 8, 1, 44, hex('#7a808e'));
    rectF(0, 4, 10, 4, hex('#3a3c44')); rectF(0, 4, 10, 1, hex('#6a6e78'));
    rectF(1, 7, 8, 2, hex('#ff60c0'));
  }, { light: [7, .9, '#ff80d0'], opaque: 0, lampTop: 8 });

  prop('vend', 1, 1, 20, 34, () => {
    box(20, 34, hex('#901818'), hex('#c02424'), 30);
    rectF(2, 2, 16, 4, hex('#ff3030')); rectF(2, 2, 16, 1, hex('#ff9090'));
    for (let x = 4; x <= 14; x += 3) { rectF(x, 3, 2, 2, WHITE); pset(x, 3, hex('#fff0a0')); }
    rectF(2, 8, 12, 16, hex('#081420')); rectF(2, 8, 12, 1, hex('#204868'));
    for (let y = 10; y < 24; y += 5) for (let x = 3; x < 13; x += 3) {
      rectF(x, y, 2, 3, [hex('#f02020'), hex('#30c0ff'), hex('#ffcc20'), hex('#20e060')][(x + y) % 4]);
      pset(x, y, WHITE);
    }
    rectF(15, 11, 3, 5, hex('#202024')); pset(16, 12, hex('#ffd020')); pset(16, 14, hex('#40ff60'));
    rectF(15, 18, 3, 3, hex('#18181c'));
    rectF(3, 26, 14, 5, hex('#1c1c20')); rectF(3, 26, 14, 1, hex('#5a5a60'));
  }, { vend: 1, light: [2, .5, '#ff9090'] });

  prop('atm', 1, 1, 16, 30, () => {
    box(16, 30, hex('#5a6878'), hex('#7a8c9e'), 26);
    rectF(2, 2, 12, 4, hex('#103868')); rectF(2, 2, 12, 1, hex('#50a8ff'));
    // Crisp micro-pixel header
    rectF(4, 3, 2, 2, WHITE); rectF(7, 3, 2, 1, WHITE); pset(7, 4, WHITE); rectF(10, 3, 2, 2, hex('#60ff90'));
    rectF(3, 8, 10, 7, hex('#081c28')); frameR(2, 7, 12, 9, hex('#4a5868'));
    rectF(4, 9, 8, 1, hex('#40ff80')); rectF(4, 11, 6, 1, hex('#40ff80')); rectF(4, 13, 7, 1, hex('#30c868'));
    rectF(3, 17, 10, 2, hex('#2a3240')); pset(11, 17, hex('#40ff80'));
    rectF(4, 20, 8, 5, hex('#3a4454'));
    for (let y = 21; y < 24; y += 2) for (let x = 5; x < 11; x += 2) pset(x, y, hex('#c0d0e4'));
  }, { comp: 1 });

  prop('computer', 1, 1, 22, 22, () => {
    box(22, 22, hex('#d8d0b8'), hex('#b8ac90'), 8);
    rectF(3, 0, 16, 11, hex('#c8c0a8')); rectF(3, 0, 16, 1, hex('#f0ecdc'));
    rectF(5, 2, 12, 7, hex('#081810'));
    rectF(6, 3, 8, 1, hex('#30e060')); rectF(6, 5, 10, 1, hex('#30e060')); rectF(6, 7, 5, 1, hex('#50ff80'));
    rectF(15, 3, 3, 1, hex('#4a4438')); pset(15, 5, hex('#30ff50'));
    rectF(2, 12, 18, 4, hex('#8a8270'));
    for (let k = 3; k < 19; k += 2) pset(k, 13, hex('#c8c0a8'));
  }, { comp: 1, light: [2, .45, '#60ff90'] });

  prop('seccomp', 1, 1, 22, 28, () => {
    box(22, 28, hex('#3e4656'), hex('#2e3644'), 12);
    rectF(2, 0, 18, 14, hex('#1c222e')); rectF(2, 0, 18, 1, hex('#5a6478'));
    rectF(4, 2, 6, 4, hex('#081018')); rectF(12, 2, 6, 4, hex('#081018'));
    rectF(4, 8, 6, 4, hex('#081018')); rectF(12, 8, 6, 4, hex('#081018'));
    pset(6, 4, hex('#40a0ff')); pset(14, 3, hex('#30e080')); pset(6, 10, hex('#ff8040')); pset(15, 9, hex('#40a0ff'));
    rectF(3, 17, 4, 3, hex('#ff2828')); rectF(9, 17, 4, 3, hex('#28ff50'));
    pset(16, 18, hex('#ffd020'));
  }, { comp: 1, light: [2, .45, '#60a0ff'] });

  prop('counter', 2, 1, 46, 20, () => {
    box(46, 20, hex('#e0d8c8'), hex('#8a5a3a'), 10);
    rectF(0, 10, 46, 1, hex('#5a3a22'));
  }, { low: 1 });

  prop('bar', 3, 1, 70, 20, () => {
    box(70, 20, hex('#5a3a22'), hex('#3a2414'), 11);
    rectF(0, 0, 70, 2, hex('#9a7850'));
    for (let x = 6; x < 66; x += 12) { rectF(x, 0, 2, 4, hex('#30b068')); pset(x, -1, hex('#a0ffc8')); }
  }, { low: 1 });

  prop('toilet', 1, 1, 14, 18, () => {
    rectF(3, 0, 8, 7, hex('#e8e8f0')); rectF(3, 0, 8, 1, WHITE);
    ellF(7, 11, 5, 4, hex('#f0f0f8')); ellF(7, 11, 3, 2, hex('#90b4d8'));
    rectF(5, 14, 4, 4, hex('#d0d0d8'));
  }, { low: 1 });

  prop('car', 3, 2, 70, 34, () => {
    // True 3/4 top-down sedan: roof, hood, trunk, windshield, side windows, doors & wheel wells
    const cTop = hex('#b83232'), cRoof = hex('#d44242'), cSide = hex('#7c1c20'), cDeep = hex('#4a1014'), cTrim = hex('#d8dce4');
    // Lower shadow & chassis skirt
    rectF(4, 27, 62, 3, hex('#14141c'));
    // Top-down hood & trunk deck
    rectF(3, 8, 64, 10, cTop);
    rectF(4, 8, 62, 1, hex('#e06060'));
    // Hood contour lines
    rectF(50, 10, 14, 1, hex('#982428')); rectF(50, 15, 14, 1, hex('#982428'));
    // Cabin greenhouse (roof + front/rear/side glass)
    polyF([[14, 9], [52, 9], [45, 2], [19, 2]], hex('#1c3048'));
    // Front windshield & rear window glass highlights
    polyF([[43, 3], [50, 9], [46, 14], [41, 10]], hex('#385c82'));
    lineF(44, 4, 48, 8, hex('#88c0f0'));
    polyF([[19, 3], [15, 9], [18, 14], [22, 10]], hex('#2c4868'));
    // Side windows (near side)
    rectF(21, 9, 10, 5, hex('#243c58')); rectF(33, 9, 10, 5, hex('#243c58'));
    lineF(23, 10, 26, 13, hex('#5888b8')); lineF(35, 10, 38, 13, hex('#5888b8'));
    // Roof panel
    rectF(21, 2, 22, 7, cRoof); rectF(22, 2, 20, 1, hex('#f07878'));
    // Near-side vertical body panel (doors & fenders)
    rectF(2, 15, 66, 12, cSide);
    rectF(2, 15, 66, 1, hex('#e06868')); // shoulder beltline highlight
    rectF(2, 22, 66, 1, cTrim); // chrome side molding
    rectF(2, 26, 66, 1, cDeep);
    // Door seams & handles
    rectF(20, 15, 1, 11, cDeep); rectF(32, 15, 1, 11, cDeep); rectF(45, 15, 1, 11, cDeep);
    rectF(22, 17, 3, 1, cTrim); rectF(34, 17, 3, 1, cTrim);
    // Bumpers, headlights & taillights
    rectF(66, 10, 3, 16, hex('#2a2c34'));
    rectF(66, 11, 2, 4, hex('#fff090')); rectF(66, 20, 2, 4, hex('#fff090'));
    rectF(1, 11, 2, 5, hex('#ff2828')); rectF(1, 19, 2, 4, hex('#ff6020'));
    // Wheel arches & 3/4 tires with alloy rims
    for (const wx of [14, 54]) {
      ellF(wx, 27, 7, 5, hex('#101016'));
      ellF(wx, 28, 6, 4, hex('#22242c'));
      ellF(wx, 28, 3, 2, hex('#9aa2b0'));
      pset(wx, 28, WHITE);
    }
  }, { opaque: 0, cover: 1 });

  prop('wreck', 3, 2, 70, 30, () => {
    // Burned-out 3/4 top-down sedan wreck (charred steel, shattered glass, crumpled hood)
    const wTop = hex('#483c36'), wSide = hex('#342a26'), wChar = hex('#1c1818'), wRust = hex('#6e3c24');
    rectF(4, 23, 62, 3, hex('#100e0e'));
    rectF(3, 8, 63, 8, wTop);
    // Crumpled/open hood exposing dark engine bay
    rectF(49, 9, 14, 6, wChar); rectF(52, 10, 8, 4, hex('#383438')); pset(54, 11, hex('#706868'));
    // Crushed cabin & shattered window frames
    polyF([[15, 8], [49, 8], [43, 2], [20, 2]], wChar);
    rectF(21, 2, 21, 6, hex('#544640'));
    // Jagged broken glass teeth in windows
    pset(23, 9, hex('#688090')); pset(27, 11, hex('#688090')); pset(36, 9, hex('#688090')); pset(44, 7, hex('#688090'));
    // Near-side scorched body panels with cohesive rust/soot patches (no measles dots)
    rectF(2, 14, 65, 10, wSide);
    rectF(2, 14, 65, 1, hex('#64544c'));
    rectF(12, 15, 14, 5, wRust); rectF(38, 16, 16, 6, wChar); rectF(52, 15, 10, 4, wRust);
    rectF(20, 14, 1, 9, wChar); rectF(33, 14, 1, 9, wChar);
    // Flat/missing tires on rims
    for (const wx of [14, 54]) {
      ellF(wx, 24, 6, 3, hex('#141214'));
      ellF(wx, 24, 3, 2, hex('#4a4444'));
    }
  }, { opaque: 0, cover: 1 });

  prop('dumpster', 2, 1, 46, 26, () => {
    box(46, 26, hex('#285838'), hex('#387848'), 16);
    rectF(0, 0, 46, 3, hex('#183820')); rectF(4, 14, 38, 1, hex('#183820'));
  }, { search: 1, cover: 1 });

  prop('trash', 1, 1, 12, 16, () => {
    rectF(1, 3, 10, 13, hex('#5a5c64')); ellF(6, 3, 5, 2, hex('#7a7c84'));
    for (let x = 2; x < 11; x += 3) rectF(x, 5, 1, 10, hex('#3a3c44'));
  }, { search: 1, low: 1 });

  prop('tv', 1, 1, 20, 20, () => {
    box(20, 20, hex('#3a3a42'), hex('#2a2a32'), 16);
    rectF(2, 5, 13, 10, hex('#385898')); rectF(3, 6, 6, 3, hex('#80c0ff'));
    rectF(16, 7, 2, 2, hex('#c0c0c0'));
  }, { light: [2, .5, '#80a0ff'], low: 1 });

  prop('arcade', 1, 1, 20, 36, () => {
    box(20, 36, hex('#1c1440'), hex('#34227e'), 32);
    rectF(2, 2, 16, 4, hex('#ff2088')); rectF(2, 2, 16, 1, hex('#ffa0d4'));
    rectF(4, 3, 3, 2, hex('#ffff40')); rectF(8, 3, 4, 2, WHITE); rectF(13, 3, 3, 2, hex('#40ffff'));
    rectF(3, 8, 14, 11, hex('#060414')); frameR(2, 7, 16, 13, hex('#241858'));
    for (let i = 0; i < 6; i++) pset(5 + ((i * 2) | 0), 10 + (i * 3) % 7, [hex('#ff3080'), hex('#30ffff'), hex('#ffff30')][i % 3]);
    rectF(9, 15, 3, 2, hex('#40ff60')); pset(10, 14, WHITE);
    rectF(2, 21, 16, 4, hex('#4a3a9a')); rectF(2, 21, 16, 1, hex('#7a68d0'));
    pset(5, 22, hex('#ff2020')); pset(5, 21, hex('#ff9090')); pset(11, 22, hex('#20ff40')); pset(13, 22, hex('#2080ff'));
    rectF(5, 28, 4, 4, hex('#101018')); pset(6, 29, hex('#ff3030'));
    rectF(11, 28, 4, 4, hex('#101018')); pset(12, 29, hex('#ff3030'));
  }, { light: [3, .7, '#a060ff'], comp: 1 });

  prop('slot', 1, 1, 18, 32, () => {
    box(18, 32, hex('#c89a30'), hex('#8a1424'), 26);
    rectF(2, 2, 14, 4, hex('#ffd040')); rectF(2, 2, 14, 1, WHITE);
    rectF(2, 8, 13, 8, hex('#f8f4e8')); frameR(2, 8, 13, 8, hex('#503810'));
    for (let i = 0; i < 3; i++) {
      const rx = 3 + i * 4;
      rectF(rx, 9, 3, 6, WHITE);
      rectF(rx, 9, 3, 1, hex('#d8d0c0'));
      // Crisp 3x4 pixel '7' inside reel
      rectF(rx, 10, 3, 1, hex('#e01820'));
      pset(rx + 2, 11, hex('#e01820'));
      pset(rx + 1, 12, hex('#e01820'));
      pset(rx + 1, 13, hex('#e01820'));
    }
    rectF(15, 11, 2, 8, hex('#c0c8d4'));
    paintHead(16, 10, 2.0, 2.0, [hex('#800000'), hex('#c00000'), hex('#ff3030'), WHITE]);
    rectF(3, 22, 11, 5, hex('#c89a30')); rectF(4, 23, 9, 3, hex('#282010'));
  }, { light: [2, .6, '#ffd060'] });

  prop('cardtable', 2, 1, 46, 20, () => {
    ellF(23, 9, 22, 8, hex('#3a2010')); ellF(23, 8, 20, 6, hex('#187438'));
    for (let i = 0; i < 5; i++) rectF(10 + i * 6, 6, 3, 4, WHITE);
    rectF(10, 14, 26, 6, hex('#3a2010'));
  }, { low: 1 });

  prop('pillar', 1, 1, 22, 44, () => {
    rectF(3, 4, 16, 40, hex('#b8b4ac')); rectF(3, 4, 4, 40, hex('#d8d4cc')); rectF(15, 4, 4, 40, hex('#8a8680'));
    rectF(0, 0, 22, 5, hex('#c8c4bc')); rectF(0, 40, 22, 4, hex('#a8a49c'));
  }, { opaque: 1 });

  prop('generator', 2, 2, 46, 40, () => {
    box(46, 40, hex('#5a6a3a'), hex('#4a5a2a'), 26);
    for (let x = 4; x < 42; x += 4) { rectF(x, 18, 2, 18, hex('#242e12')); pset(x, 18, hex('#788a50')); }
    rectF(5, 3, 14, 8, hex('#182018')); frameR(5, 3, 14, 8, hex('#384422'));
    rectF(7, 5, 10, 2, hex('#40ff60')); rectF(7, 8, 6, 1, hex('#a0ff90'));
    // High-voltage warning plate
    rectF(28, 18, 12, 10, hex('#e8c020')); frameR(28, 18, 12, 10, hex('#202018'));
    lineF(34, 20, 32, 23, INK); lineF(32, 23, 35, 23, INK); lineF(35, 23, 33, 26, INK);
  }, { light: [2, .4, '#a0ff60'], hp: 80 });

  prop('transmitter', 2, 2, 46, 64, () => {
    for (let y = 0; y < 50; y += 2) { const w = 4 + y * .3; rectF(23 - w / 2, y, w, 1, hex('#8a8c94')); }
    lineF(23, 0, 8, 50, hex('#6a6c74')); lineF(23, 0, 38, 50, hex('#6a6c74'));
    rectF(0, 46, 46, 18, hex('#384050')); rectF(0, 46, 46, 2, hex('#5a6474'));
    paintHead(23, 2, 2.2, 2.2, [hex('#800000'), hex('#c00000'), hex('#ff2020'), WHITE]);
  }, { light: [3, .6, '#ff4040'] });

  prop('statue', 3, 3, 72, 96, () => {
    const g = shadeTones('#4a9a80');
    // Tiered granite monument pedestal
    rectF(8, 76, 56, 20, hex('#787268')); rectF(8, 76, 56, 2, hex('#b0aaa0'));
    rectF(12, 66, 48, 12, hex('#8a8478')); rectF(12, 66, 48, 2, hex('#c4beb2'));
    rectF(16, 70, 40, 14, hex('#686258')); frameR(24, 72, 24, 8, hex('#a89050'));
    // Sculpted copper-patina Lady Liberty robes
    polyF([[22, 66], [50, 66], [44, 28], [28, 28]], g[2]);
    polyF([[22, 66], [33, 66], [33, 28], [28, 28]], g[3]);
    polyF([[38, 66], [50, 66], [44, 28], [38, 28]], g[1]);
    // Draped sash & robe folds
    lineF(29, 30, 42, 64, g[3], 2); lineF(35, 34, 35, 65, g[0]); lineF(41, 34, 43, 65, g[0]);
    // Raised right arm holding torch
    rectF(42, 10, 4, 20, g[2]); rectF(42, 10, 1, 20, g[3]);
    rectF(40, 9, 8, 2, hex('#b89030'));
    paintHead(44, 4.5, 4.2, 4.2, [hex('#a05000'), hex('#e09020'), hex('#ffd850'), WHITE]);
    // Left arm & tablet
    rectF(25, 30, 6, 10, g[3]); rectF(24, 32, 5, 7, hex('#346e5a')); frameR(24, 32, 5, 7, g[3]);
    // Crowned head at center (x=35, y=21)
    paintHead(35, 21, 5.2, 5.2, g);
    rectF(30, 17, 11, 2, g[3]); // crown band
    for (const [dx, dy] of [[-7, -3], [-5, -6], [-2, -8], [0, -8], [3, -8], [6, -6], [8, -3]]) {
      lineF(35 + (dx >> 1), 17, 35 + dx, 17 + dy, g[3]);
    }
    pset(33, 21, g[0]); pset(37, 21, g[0]); pset(35, 22, g[3]);
  }, { opaque: 1, light: [6, .8, '#ffd080'], lampTop: 8 });

  prop('ass', 4, 2, 96, 44, () => blit(SPRITES.ass, 0, 0), { light: [4, .5, '#60ffa0'], opaque: 0 });

  prop('sign', 1, 1, 22, 26, () => {
    rectF(10, 12, 2, 14, hex('#4a4c54')); rectF(0, 0, 22, 13, hex('#284888')); frameR(0, 0, 22, 13, WHITE);
  }, { read: 1, solid: 0, opaque: 0 });

  prop('poster', 1, 1, 18, 14, () => {
    rectF(0, 0, 18, 14, hex('#e8d8b0')); rectF(2, 2, 14, 7, hex('#ff70b0'));
    paintHead(9, 5, 3, 2, shadeTones('#f0c8a8')); rectF(2, 10, 14, 1, INK); rectF(2, 12, 10, 1, INK);
  }, { solid: 0, wall: 1, read: 1 });

  prop('fridge', 1, 1, 18, 34, () => {
    box(18, 34, hex('#e0e0e8'), hex('#c8c8d0'), 30);
    rectF(1, 14, 16, 1, hex('#888890')); rectF(14, 6, 2, 6, hex('#888890')); rectF(14, 18, 2, 8, hex('#888890'));
  }, { search: 1 });

  prop('sink', 1, 1, 16, 16, () => {
    box(16, 16, hex('#e0e0e8'), hex('#a8a8b0'), 8);
    ellF(8, 4, 5, 2, hex('#90a8c0')); rectF(7, 0, 2, 3, hex('#c0c0c8'));
  }, { low: 1 });

  prop('rack', 1, 1, 22, 32, () => {
    box(22, 32, hex('#3a3c44'), hex('#282a32'), 28);
    for (let y = 6; y < 30; y += 4) {
      rectF(2, y, 18, 2, hex('#181a22'));
      pset(4, y, (y & 4) ? hex('#30ff60') : hex('#ff8030')); pset(7, y, hex('#30a0ff'));
    }
  }, { light: [2, .4, '#40ff80'], hp: 30, breakable: 1 });

  prop('tank', 1, 1, 22, 40, () => {
    rectF(3, 4, 16, 32, hex('#1c4250'));
    for (let y = 6; y < 34; y += 3) pset(8 + (y % 5), y, hex('#a0ffff'));
    rectF(3, 4, 4, 32, hex('#367288'));
    rectF(1, 0, 20, 5, hex('#566474')); rectF(1, 35, 20, 5, hex('#566474'));
  }, { light: [3, .7, '#40e0ff'], opaque: 0 });

  prop('tanksp', 1, 1, 22, 40, () => {
    rectF(3, 4, 16, 32, hex('#1c4250'));
    paintHead(11, 14, 5, 4, shadeTones('#9aa0a8')); rectF(9, 18, 4, 10, hex('#8a9098'));
    pset(9, 14, INK); pset(13, 14, INK);
    rectF(3, 4, 4, 32, hex('#367288'));
    rectF(1, 0, 20, 5, hex('#566474')); rectF(1, 35, 20, 5, hex('#566474'));
  }, { light: [3, .7, '#40e0ff'], opaque: 0 });

  prop('cone', 1, 1, 10, 12, () => {
    polyF([[5, 0], [9, 11], [1, 11]], hex('#ff7020')); rectF(2, 6, 6, 2, WHITE);
  }, { solid: 0, low: 1 });

  prop('rubble', 1, 1, 22, 12, () => {
    for (let i = 0; i < 9; i++) paintHead(3 + hash(i, 1) * 16, 4 + hash(i, 2) * 5, 2 + hash(i, 3) * 3, 1.5 + hash(i, 4) * 2, shadeTones('#6a6460'));
  }, { solid: 0, low: 1 });

  prop('bench', 2, 1, 46, 14, () => {
    rectF(0, 0, 46, 4, hex('#7a5432')); rectF(0, 5, 46, 4, hex('#8a6440'));
    rectF(3, 9, 2, 5, INK); rectF(41, 9, 2, 5, INK);
  }, { low: 1 });

  prop('kiosk', 2, 1, 46, 36, () => {
    rectF(0, 0, 46, 8, hex('#e04040'));
    for (let x = 0; x < 46; x += 8) rectF(x, 0, 4, 8, WHITE);
    rectF(2, 8, 42, 28, hex('#5a4030')); rectF(2, 14, 42, 2, hex('#a08060'));
    for (let x = 4; x < 42; x += 5) rectF(x, 10, 3, 4, [hex('#f0d020'), hex('#30a0f0'), hex('#f05050')][x % 3]);
  }, { light: [3, .6, '#ffd0a0'] });

  prop('tent', 2, 2, 46, 34, () => {
    polyF([[23, 0], [46, 32], [0, 32]], hex('#486888'));
    polyF([[23, 0], [46, 32], [23, 32]], hex('#385676'));
    polyF([[23, 12], [29, 32], [17, 32]], hex('#101820'));
  }, { opaque: 1 });

  prop('crt', 1, 1, 18, 16, () => {
    box(18, 16, hex('#c8c0a8'), hex('#a89c80'), 4);
    rectF(2, 1, 14, 10, hex('#102838')); rectF(3, 2, 6, 1, hex('#80e0ff'));
  }, { low: 1, light: [2, .4, '#80e0ff'] });

  prop('alarm', 1, 1, 10, 14, () => {
    rectF(0, 0, 10, 14, hex('#981c1c')); rectF(2, 2, 6, 6, hex('#ff3838')); rectF(3, 10, 4, 2, hex('#f0d020'));
  }, { solid: 0, wall: 1 });

  prop('keypad', 1, 1, 8, 10, () => {
    rectF(0, 0, 8, 10, hex('#383a42'));
    for (let i = 0; i < 9; i++) rectF(1 + (i % 3) * 2, 3 + ((i / 3) | 0) * 2, 1, 1, hex('#a0ffa0'));
    rectF(1, 1, 6, 1, hex('#ff3030'));
  }, { solid: 0, wall: 1 });

  prop('jukebox', 1, 1, 22, 34, () => {
    rectF(1, 8, 20, 26, hex('#5a1438'));
    paintHead(11, 9, 10, 8, [hex('#604010'), hex('#a07020'), hex('#d8a838'), hex('#fff090')]);
    rectF(3, 10, 16, 14, hex('#120418'));
    for (let i = 0; i < 4; i++) rectF(4 + i * 3.8, 12, 2, 8, [hex('#ff3090'), hex('#30ff90'), hex('#9030ff'), hex('#ffd030')][i]);
    rectF(3, 26, 16, 2, hex('#ff3090')); rectF(3, 26, 16, 1, WHITE);
  }, { light: [3, .8, '#ff60c0'] });

  prop('piano', 2, 1, 46, 26, () => {
    box(46, 26, hex('#14141a'), hex('#1e1e26'), 12);
    rectF(4, 12, 38, 4, WHITE);
    for (let x = 5; x < 42; x += 3) rectF(x, 12, 1, 2, INK);
  }, { low: 1 });

  prop('stage', 3, 1, 70, 12, () => {
    rectF(0, 0, 70, 12, hex('#3a1a10')); rectF(0, 0, 70, 2, hex('#c89a30'));
  }, { solid: 0, low: 1 });

  prop('mic', 1, 1, 8, 28, () => {
    rectF(3, 6, 2, 22, hex('#56565e')); blob(4, 4, 2.4, 2.4, shadeTones('#888890'));
    rectF(1, 26, 6, 2, hex('#282830'));
  }, { solid: 0 });

  prop('pump', 1, 1, 18, 30, () => {
    box(18, 30, hex('#d8d0c0'), hex('#e03828'), 24);
    rectF(3, 8, 12, 6, hex('#102c1c')); rectF(4, 10, 8, 1, hex('#40ff80'));
    rectF(15, 14, 3, 10, INK);
  }, { low: 0 });

  prop('drum', 1, 1, 14, 16, () => {
    ellF(7, 4, 6, 3, hex('#d8d8e0')); rectF(1, 4, 12, 10, hex('#a02020')); ellF(7, 14, 6, 2, hex('#801818'));
  }, { low: 1 });

  prop('shrine', 1, 1, 22, 30, () => {
    rectF(2, 10, 18, 20, hex('#a02018')); rectF(0, 6, 22, 4, hex('#3a2010'));
    rectF(6, 14, 10, 10, hex('#e0c060')); blob(11, 18, 3, 3, shadeTones('#ffe090'));
  }, { light: [3, .7, '#ffc060'] });

  prop('lantern', 1, 1, 10, 14, () => {
    blob(5, 7, 4.5, 6, [hex('#801010'), hex('#c02020'), hex('#ff5030'), hex('#ffd080')]);
    rectF(3, 0, 4, 2, INK); rectF(3, 12, 4, 2, INK);
  }, { solid: 0, wall: 1, light: [4, .8, '#ff6040'], emissive: 1 });

  prop('console', 2, 1, 46, 24, () => {
    box(46, 24, hex('#3a4456'), hex('#283244'), 12);
    rectF(3, 1, 18, 9, hex('#081420')); rectF(25, 1, 18, 9, hex('#081420'));
    for (let x = 4; x < 20; x++) pset(x, 5 + Math.sin(x * .8) * 3, hex('#40ff80'));
    rectF(27, 3, 14, 2, hex('#ff8030')); rectF(27, 6, 10, 2, hex('#30b0ff'));
    for (let i = 0; i < 8; i++) {
      rectF(4 + i * 5, 13, 3, 3, [hex('#30ff60'), hex('#ff3030'), hex('#ffd030'), hex('#30a0ff')][i % 4]);
      pset(4 + i * 5, 13, WHITE);
    }
  }, { comp: 1, light: [2, .5, '#60a0ff'] });

  prop('turbine', 2, 2, 46, 40, () => {
    ellF(23, 22, 22, 16, hex('#58606e')); ellF(23, 20, 18, 12, hex('#767e8c'));
    ellF(23, 20, 8, 6, hex('#38404e')); rectF(0, 34, 46, 6, hex('#38404e'));
  }, {});

  prop('pipe', 1, 1, 22, 16, () => {
    rectF(0, 4, 22, 8, hex('#68727e')); rectF(0, 4, 22, 2, hex('#98a2ae'));
    rectF(9, 2, 4, 12, hex('#48525e'));
  }, { low: 1 });

  prop('plane', 6, 3, 140, 56, () => {
    const b = hex('#c8ccd4'), d = hex('#888c96');
    polyF([[20, 22], [120, 22], [136, 28], [120, 34], [20, 34]], b);
    rectF(20, 22, 100, 2, WHITE); rectF(20, 32, 100, 2, d);
    polyF([[50, 24], [80, 24], [70, 2], [60, 2]], d); polyF([[50, 32], [80, 32], [70, 54], [60, 54]], d);
    polyF([[8, 22], [24, 22], [24, 34], [8, 34]], d); polyF([[4, 18], [16, 22], [16, 34], [4, 38]], d);
    for (let x = 30; x < 112; x += 6) rectF(x, 25, 3, 2, hex('#283858'));
    rectF(118, 25, 8, 3, hex('#283858'));
    text('PRETEND AIR', 54, 27, hex('#c02020'), 0);
  }, { opaque: 0, cover: 1 });

  prop('manhole', 1, 1, 18, 8, () => {
    ellF(9, 4, 8, 3.4, hex('#282a2e')); ellF(9, 4, 6, 2.4, hex('#383a40'));
    for (let x = 4; x < 15; x += 3) rectF(x, 3, 1, 3, hex('#181a1e'));
  }, { solid: 0, low: 1 });

  prop('stairs', 1, 1, 22, 12, () => {
    for (let k = 0; k < 4; k++) {
      rectF(1 + k, k * 3, 20 - k * 2, 3, hex(['#888892', '#686872', '#484852', '#282832'][k]));
      rectF(1 + k, k * 3, 20 - k * 2, 1, hex('#aeaebe'));
    }
    rectF(10, 1, 2, 7, hex('#ffd24a')); rectF(8, 3, 6, 1, hex('#ffd24a')); rectF(9, 2, 4, 1, hex('#ffd24a'));
  }, { solid: 0, low: 1 });

  prop('bong', 1, 1, 12, 40, () => {
    rectF(4, 2, 4, 30, hex('#3cb878')); rectF(5, 2, 1, 30, hex('#b8f8d0'));
    ellF(6, 33, 6, 5, hex('#2c9868')); ellF(6, 33, 4, 3, hex('#68d8a0'));
    rectF(8, 22, 4, 2, hex('#2c9868')); rectF(3, 0, 6, 2, hex('#d8f8e0'));
  }, { opaque: 0, light: [2, .3, '#60ffa0'] });

  prop('body', 1, 1, 30, 12, () => {
    rectF(6, 4, 14, 5, hex('#383848')); blob(4, 6, 3, 2.4, shadeTones('#d0a888')); rectF(20, 5, 8, 3, hex('#282832'));
  }, { solid: 0, low: 1 });

  prop('frozen', 1, 1, 20, 34, () => {
    rectF(2, 2, 16, 32, hex('#9cd2ea')); rectF(2, 2, 16, 32, 0);
    for (let y = 2; y < 34; y++) for (let x = 2; x < 18; x++) if ((x + y) % 2) pset(x, y, hex('#9cd2ea'));
    blob(10, 10, 3.4, 2.6, shadeTones('#e8d8c8'));
    rectF(6, 14, 8, 12, hex('#181828')); rectF(6, 4, 8, 3, hex('#181828'));
    frameR(1, 1, 18, 33, hex('#def4fc'));
  }, { light: [2, .4, '#a0e0ff'] });

  prop('cell', 1, 1, 22, 30, () => {
    for (let x = 1; x < 22; x += 4) rectF(x, 0, 2, 30, hex('#585a62'));
    rectF(0, 0, 22, 2, hex('#383a42')); rectF(0, 14, 22, 2, hex('#383a42'));
  }, { opaque: 0 });

  prop('pod', 1, 1, 22, 40, () => {
    rectF(2, 2, 18, 36, hex('#282e3e')); rectF(4, 6, 14, 28, hex('#ffdc58'));
    for (let y = 8; y < 32; y += 3) pset(8 + (y % 5), y, WHITE);
    rectF(0, 0, 22, 4, hex('#585e6e')); rectF(0, 36, 22, 4, hex('#585e6e'));
  }, { light: [5, 1, '#fff080'], emissive: 1 });
}
// ---------- item icons (inventory grid cells are 26x16; icons are w*26 x h*16) ----------
const ICON = {};
function iconOf(id) { return ICON[id] || ICON._; }
