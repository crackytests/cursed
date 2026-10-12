'use strict';
// ================= KONBINI WARS: art (store tiles, goods, people, portraits, wallpapers, map) =================
// The PS Special store view on the 68k-x: pixels are 1.5x taller than wide, so a square-looking tile is 24x16.
const TW = 24, TH = 16, WALL = 8, BACK_H = 26;
const C = s => hex(s);
const INKC = C('#141018');

// ---------- product colors: each product gets a hue near its category's color ----------
const PCOL = {};
(() => { const by = {}; for (const p of Object.values(PRODUCTS)) { (by[p.cat] = by[p.cat] || []).push(p); }
  for (const cat in by) by[cat].forEach((p, i) => { const b = C(CATS[cat].col), [r, g, bb] = chan(b), k = i / 4;
    PCOL[p.id] = [rgb(r * (.75 + k * .4), g * (1.05 - k * .3) + k * 40, bb * (.8 + k * .3)), rgb(r * .5, g * .5, bb * .5)]; }); })();
PCOL.proppill = [C('#ff60a0'), C('#802050')]; PCOL.shipcable = [C('#40e0ff'), C('#106080')]; PCOL.roadmeal = [C('#d0a060'), C('#605030')]; PCOL.humancup = [C('#f0f0f0'), C('#808080')];
PCOL.chalk = [C('#f0f0e0'), C('#808070')]; PCOL.wand = [C('#c080ff'), C('#502080')]; PCOL.ward = [C('#60ffc0'), C('#208060')]; PCOL.herbs = [C('#80c040'), C('#305010')];

// ---------- fixtures ----------
// Every manager furnishes the same footprints their own way: Carl's crates and tape, Ghost's candlelit cabinets and potion coolers,
// Linda's white lacquer and gold, Face's lab steel and LEDs, Yoko's light wood and tidy labels, JB's dark wood, amber lamps and neon.
const FXT = {
  carl: { frame: '#7a5030', inside: '#3e2818', trim: '#f0d040', cool: '#b8c4bc', glass: '#e0f0e8', floorA: '#3a8a58', floorB: '#409460' },
  ghost: { frame: '#3a1a4a', inside: '#160a20', trim: '#ffb050', cool: '#244a30', glass: '#a8ffc8', floorA: '#3a2a5a', floorB: '#32244e' },
  linda: { frame: '#f4eef4', inside: '#2a1424', trim: '#f0c040', cool: '#f0c040', glass: '#fff0f8', floorA: '#1e3a2a', floorB: '#24402e' },
  face: { frame: '#6a7a94', inside: '#0e1626', trim: '#40e0ff', cool: '#8a9ab0', glass: '#d0f0ff', floorA: '#284866', floorB: '#2e5070' },
  yoko: { frame: '#d8bc94', inside: '#f2eadc', trim: '#30a898', cool: '#f2f2f0', glass: '#f4fbff', floorA: '#b8a888', floorB: '#c4b494' },
  jb: { frame: '#4a2a1a', inside: '#140c0a', trim: '#ffa040', cool: '#2a2430', glass: '#ffe0b0', floorA: '#2a2230', floorB: '#3a1e26' },
};
function goodsColumns(f, x, y, st) { // the goods themselves: columns that shrink as they sell
  for (let j = 0; j < FACINGS; j++) {
    const pid = f.p[j]; if (!pid) continue; const n = f.n[j], icons = Math.ceil(n / FACE_ICON), cx = x + 3 + j * 9;
    if (PRODUCTS[pid].permit && !st.permit[PRODUCTS[pid].permit]) { rectF(cx, y + 4, 8, 8, C('#503030')); pset(cx + 1, y + 6, C('#ff6060')); pset(cx + 2, y + 9, C('#ff6060')); continue; }
    const [c1, c2] = PCOL[pid] || [C('#ffffff'), C('#808080')];
    for (let k = 0; k < Math.min(8, icons); k++) { const yy = y + TH - 4 - k * 1.25 | 0; rectF(cx, yy, 8, 1, k & 1 ? c2 : c1); }
    if (icons >= 7) rectF(cx, y + 3, 8, 2, c1);
  }
}
function lipOf(f, x, y, c) { const [ax, ay] = DIRS[f.d]; if (ay > 0) rectF(x + 2, y + TH - 2, TW - 4, 1, c); else if (ay < 0) rectF(x + 2, y + 1, TW - 4, 1, c); else if (ax < 0) rectF(x + 1, y + 2, 1, TH - 4, c); else rectF(x + TW - 2, y + 2, 1, TH - 4, c); }
function drawFixture(f, x, y, mgr, st, flash) {
  const T = FXT[mgr] || FXT.carl, M = MGRS[mgr], fr = C(T.frame), ins = C(T.inside), tr = C(T.trim), cool = f.k === 'drink' || f.k === 'bento' || f.k === 'liquor', t = frame + f.x * 7 + f.y * 13;
  if (f.k === 'reg') return drawRegister(f, x, y, mgr, T, flash);
  if (FIX[f.k].deco) return drawDeco(f, x, y, mgr, T);
  if (cool) { // coolers and food cases
    rectF(x + 1, y + 1, TW - 2, TH - 2, C(T.cool)); rectF(x + 2, y + 2, TW - 4, TH - 4, C(T.glass));
    if (mgr === 'ghost') { pset(x + 1, y + 1, 0); pset(x + TW - 2, y + 1, 0); glow(x + 12, y + 8, 10, C('#40ff90'), .25); } // a potion cabinet, glowing
    if (mgr === 'linda') { frameR(x + 2, y + 2, TW - 4, TH - 4, C('#ffc0e0')); }
    if (mgr === 'face') { rectF(x + 2, y + TH - 3, TW - 4, 1, C('#40a8ff')); if ((t >> 4) & 1) pset(x + TW - 4, y + 2, C('#40ff80')); }
    if (mgr === 'jb') { frameR(x + 1, y + 1, TW - 2, TH - 2, (t >> 6) % 7 ? C('#ff4aa0') : C('#802050')); }
    if (mgr === 'carl') { lineF(x + 2, y + 2, x + 7, y + 2, C('#f0d040')); lineF(x + TW - 8, y + TH - 3, x + TW - 3, y + TH - 3, C('#f0d040')); } // tape on a repurposed freezer
    goodsColumns(f, x, y, st);
    // a lid / header in the manager's style, so a row of coolers reads as theirs
    const H = { carl: ['#e8ece8', '#f0d040'], ghost: ['#1a4a28', '#60ff a0'.replace(' ', '')], linda: ['#f0c040', '#ff5aa8'], face: ['#3a4a64', '#40e0ff'], yoko: ['#30a898', '#ffffff'], jb: ['#ff4aa0', '#ffd0e0'] }[mgr] || ['#ffffff', '#ffffff'];
    rectF(x + 1, y + 1, TW - 2, 3, C(H[0])); for (let i = 0; i < 5; i++) if (mgr === 'face' ? ((t >> 3) + i) % 3 === 0 : mgr === 'ghost' ? ((t >> 4) + i) % 2 === 0 : i % 2 === 0) pset(x + 3 + i * 4, y + 2, C(H[1]));
    if (mgr === 'carl') rectF(x + 3, y + 1, 5, 3, C('#f0d040'));
    if (mgr !== 'jb') frameR(x + 1, y + 1, TW - 2, TH - 2, mix(C(T.cool), INKC, .35));
  } else {
    rectF(x + 1, y + 1, TW - 2, TH - 2, fr); rectF(x + 2, y + 2, TW - 4, TH - 4, ins);
    if (mgr === 'carl') { for (let yy = y + 5; yy < y + TH - 2; yy += 4) rectF(x + 1, yy, 1, 1, mix(fr, INKC, .4)); rectF(x + 1, y + 1, 1, TH - 2, mix(fr, C('#ffffff'), .15)); } // crates
    goodsColumns(f, x, y, st);
    if (mgr === 'yoko') { const lc = FIX[f.k].cat ? C(CATS[FIX[f.k].cat].col) : tr; rectF(x + 2, y + 1, TW - 4, 3, lc); rectF(x + 3, y + 2, 3, 1, C('#ffffff')); } // a tidy category label
    else { const H = { carl: ['#a07040', '#5a3a20'], ghost: ['#5a2a6a', '#ffb050'], linda: ['#f0c040', '#ff5aa8'], face: ['#8a9ab0', '#40e0ff'], jb: ['#6a3a22', '#ffa040'] }[mgr] || ['#888888', '#ffffff'];
      rectF(x + 1, y + 1, TW - 2, 3, C(H[0])); for (let i = 0; i < 5; i++) if (i % 2 === 0 || mgr === 'carl') pset(x + 3 + i * 4, y + 2, C(H[1])); }
    frameR(x + 1, y + 1, TW - 2, TH - 2, mix(fr, INKC, .45));
    if (mgr === 'linda') { frameR(x, y, TW, TH, tr); pset(x, y, C('#fff4a0')); }
    if (mgr === 'ghost' && (f.x + f.y) % 2 === 0) { rectF(x + TW - 4, y - 2, 2, 3, C('#f0e8d0')); pset(x + TW - 4 + ((t >> 3) & 1), y - 3, C((t >> 2) & 1 ? '#ffd040' : '#ff8020')); } // candles
    if (mgr === 'face') for (let i = 0; i < 4; i++) if (((t >> 3) + i) % 4 === 0) pset(x + 4 + i * 5, y + TH - 2, C('#40e0ff')); // running LEDs
    if (mgr === 'jb' && (f.x + f.y) % 3 === 0) glow(x + 12, y + 2, 7, C('#ffa040'), .3); // an amber lamp overhead
    if (mgr === 'carl' && (f.x * 3 + f.y) % 4 === 0) { rectF(x + 15, y + TH - 5, 7, 4, C('#f8f4e0')); lineF(x + 16, y + TH - 3, x + 20, y + TH - 4, C('#3060c0')); } // a hand-written sign
  }
  if (f.k === 'spec') { rectF(x + 1, y + 1, TW - 2, 1, C(M.col2)); if (mgr === 'linda') text('L', x + 9, y - 1, tr, 0); }
  if (f.k === 'mag' && mgr !== 'yoko') rectF(x + 2, y + 2, TW - 4, 2, mgr === 'jb' ? C('#c0a070') : C('#e8e0c0'));
  lipOf(f, x, y, mgr === 'yoko' ? C('#30a898') : mgr === 'face' ? C('#40e0ff') : mgr === 'linda' ? C('#f0c040') : mgr === 'ghost' ? C('#a070ff') : mgr === 'jb' ? C('#ffa040') : C('#ffe8a0'));
}
// decorations: The Conveni's plants, benches, and fountains, in each manager's style
function drawDeco(f, x, y, mgr, T) {
  const t = frame + f.x * 11;
  if (f.k === 'plant') { const pot = mgr === 'linda' ? '#f0c040' : mgr === 'ghost' ? '#3a1a4a' : mgr === 'face' ? '#8a9ab0' : mgr === 'jb' ? '#5a3a28' : '#c87040', leaf = mgr === 'ghost' ? '#6a4a8a' : '#3a9a40';
    rectF(x + 8, y + 9, 8, 6, C(pot)); rectF(x + 7, y + 9, 10, 1, mix(C(pot), C('#ffffff'), .3)); const sw = Math.sin(t * .05) > .6 ? 1 : 0;
    ellF(x + 12 + sw, y + 5, 6, 4, C(leaf)); ellF(x + 9, y + 7, 3, 2, mix(C(leaf), INKC, .2)); ellF(x + 15 + sw, y + 7, 3, 2, mix(C(leaf), C('#ffffff'), .2)); if (mgr === 'ghost') pset(x + 12, y + 3, C('#c0a0ff')); }
  else if (f.k === 'bench') { const wd = C(mgr === 'linda' ? '#f4eef4' : mgr === 'face' ? '#8a9ab0' : mgr === 'yoko' ? '#d8bc94' : mgr === 'ghost' ? '#3a1a4a' : '#8a5a30');
    rectF(x + 2, y + 6, TW - 4, 4, wd); rectF(x + 2, y + 6, TW - 4, 1, mix(wd, C('#ffffff'), .3)); rectF(x + 2, y + 3, TW - 4, 2, mix(wd, INKC, .15)); rectF(x + 3, y + 10, 2, 4, mix(wd, INKC, .4)); rectF(x + TW - 5, y + 10, 2, 4, mix(wd, INKC, .4)); if (mgr === 'linda') rectF(x + 2, y + 9, TW - 4, 1, C('#f0c040')); }
  else if (f.k === 'fountain') { const w = TW * 2, h = TH * 2, rim = C(mgr === 'linda' ? '#f0c040' : mgr === 'ghost' ? '#4a3a5a' : mgr === 'face' ? '#8a9ab0' : mgr === 'jb' ? '#6a4a3a' : '#c8c0b0'), water = C(mgr === 'ghost' ? '#60ffa0' : mgr === 'jb' ? '#ff80c0' : '#60b0ff');
    ellF(x + w / 2, y + h / 2 + 2, w / 2 - 2, h / 2 - 3, rim); ellF(x + w / 2, y + h / 2 + 2, w / 2 - 5, h / 2 - 6, mix(water, INKC, .2));
    for (let i = 0; i < 6; i++) { const a = (t * .05 + i) % 6.28; pset(x + w / 2 + Math.cos(a) * (w / 2 - 8), y + h / 2 + 2 + Math.sin(a) * (h / 2 - 9), mix(water, C('#ffffff'), .5)); }
    rectF(x + w / 2 - 2, y + 6, 4, h / 2 - 2, rim); const jet = 3 + ((t >> 2) & 3); rectF(x + w / 2 - 1, y + 6 - jet, 2, jet, mix(water, C('#ffffff'), .4)); pset(x + w / 2 - 3, y + 5 - (jet >> 1), water); pset(x + w / 2 + 2, y + 5 - (jet >> 1), water);
    if (mgr === 'ghost') glow(x + w / 2, y + h / 2, 16, C('#40ff90'), .25); if (mgr === 'jb') glow(x + w / 2, y + h / 2, 14, C('#ff4aa0'), .2); }
}
function drawRegister(f, x, y, mgr, T, flash) {
  const sx = f.d === 3 ? x + 4 : f.d === 1 ? x + TW - 12 : x + 8, t = frame + f.y * 9;
  if (mgr === 'carl') { // a cash box on a crate, taped up
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#7a5030')); rectF(x + 2, y + 3, TW - 4, TH - 6, C('#a07040')); lineF(x + 2, y + 4, x + TW - 3, y + TH - 4, C('#f0d040'));
    rectF(sx, y + 4, 8, 6, C('#506050')); rectF(sx + 1, y + 5, 6, 3, flash ? C('#80ff80') : C('#204020'));
  } else if (mgr === 'ghost') { // a counter with a crystal ball for a till
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#3a1a4a')); rectF(x + 2, y + 3, TW - 4, TH - 6, C('#5a2a6a'));
    ellF(sx + 4, y + 7, 4, 3, flash ? C('#ffffff') : C('#a080ff')); pset(sx + 3, y + 6, C('#ffffff')); glow(sx + 4, y + 7, 7, C('#a060ff'), flash ? .9 : .35);
  } else if (mgr === 'linda') { // white lacquer, gold trim, her initial
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#f4eef4')); frameR(x + 1, y + 2, TW - 2, TH - 3, C('#f0c040')); rectF(x + 2, y + TH - 3, TW - 4, 1, C('#ff5aa8'));
    rectF(sx, y + 4, 8, 6, C('#2a1424')); rectF(sx + 1, y + 5, 6, 3, flash ? C('#ffe080') : C('#ff5aa8')); text('L', sx + (f.d === 3 ? 10 : -8), y + 4, C('#f0c040'), 0);
  } else if (mgr === 'face') { // a terminal, text crawling
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#6a7a94')); rectF(x + 2, y + 3, TW - 4, TH - 6, C('#8a9ab0'));
    rectF(sx - 1, y + 3, 10, 8, C('#0a1220')); for (let i = 0; i < 3; i++) rectF(sx, y + 4 + i * 2, 2 + ((t >> 3) + i * 3) % 6, 1, flash ? C('#ffffff') : C('#40e080')); if ((t >> 4) & 1) pset(sx + 7, y + 9, C('#40e080'));
  } else if (mgr === 'yoko') { // a clean light counter with a little plant
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#c8ac84')); rectF(x + 2, y + 3, TW - 4, TH - 6, C('#f2eadc')); rectF(x + 2, y + TH - 3, TW - 4, 1, C('#30a898'));
    rectF(sx, y + 4, 8, 6, C('#404848')); rectF(sx + 1, y + 5, 6, 3, flash ? C('#80ffe0') : C('#30a898'));
    const px = f.d === 3 ? x + TW - 6 : x + 3; rectF(px, y + 9, 3, 3, C('#c87040')); pset(px + 1, y + 7, C('#40a040')); pset(px, y + 8, C('#40a040')); pset(px + 2, y + 8, C('#40a040'));
  } else { // JB: an old brass till under an amber lamp
    rectF(x + 1, y + 2, TW - 2, TH - 3, C('#4a2a1a')); rectF(x + 2, y + 3, TW - 4, TH - 6, C('#6a3a22'));
    rectF(sx - 1, y + 4, 10, 7, C('#b08a3a')); rectF(sx, y + 5, 8, 2, flash ? C('#ffffff') : C('#3a2a10')); for (let i = 0; i < 4; i++) pset(sx + 1 + i * 2, y + 9, C('#f0e0b0'));
    glow(sx + 4, y + 3, 9, C('#ffa040'), flash ? .7 : .3);
  }
  rectF(sx + (f.d === 3 ? 9 : -4), y + 9, 3, 3, C('#606060'));
}

// ---------- people ----------
// Chibi proportions, as in the PS Special: a big round head and a short body. 12 x 15 logical pixels (the 68k-x's pixels are
// 1.5x taller than wide, so they read as about 12 x 22). Four directions (left is right, mirrored), a four-frame walk,
// and a variant number (0..63) that picks hair, skin, and clothes. Cached per look, direction, frame, uniform, and variant.
const SKINS = ['#f8dcc0', '#f0c49c', '#dca478', '#b07850', '#7a4a30'];
const HAIRS = ['#2a1c14', '#4a2c18', '#7a4420', '#c88a3a', '#e8d8b0', '#a02818', '#283c78', '#c8c8d4'];
const TOPS = ['#4878d0', '#d04868', '#48a868', '#e0b840', '#8858c8', '#e07838', '#38a8b8', '#f0f0f0', '#585868'];
const PANTS = ['#2a3458', '#3a3a44', '#5a4430', '#6a7890', '#2a2a2a'];
const STYLES = ['short', 'long', 'bob', 'pony', 'spiky', 'bun', 'cap', 'short'];
const LOOKS = { human: { skin: '#f0c49c' }, cat: { skin: '#f0a040' }, android: { skin: '#c8d0d8' }, spirit: { skin: '#eef2ff' } }; // portraits use these
const SPR = {};
const shade = (c, k) => mix(c, INKC, k), lite = (c, k) => mix(c, C('#ffffff'), k);
function person(look, dir, fr, uni, vari = 0) {
  vari = (vari | 0) & 63; const key = look + dir + fr + (uni || '') + vari; if (SPR[key]) return SPR[key];
  const r = k => hash(vari, k, look.length * 7 + 3), pk = (a, k) => a[(r(k) * a.length) | 0];
  let skin = C(pk(SKINS, 1)), hair = C(pk(HAIRS, 2)), top = C(pk(TOPS, 3)), pants = C(pk(PANTS, 4)), style = pk(STYLES, 5);
  const shoe = C('#3a2a24'), eye = C('#2a1a2a'), o = {};
  switch (look) {
    case 'traveler': o.pack = C(pk(['#8a5a2a', '#3a6a4a', '#a03030', '#4a4a6a'], 6)); if (r(7) < .4) style = 'cap'; top = C(pk(['#e07838', '#6a8a5a', '#c8b090', '#4878d0', '#d04848'], 3)); break;
    case 'adventurer': o.cape = C(pk(['#8a2a2a', '#2a4a8a', '#3a6a2a', '#6a2a7a'], 6)); o.hood = r(7) < .45 ? o.cape : 0; top = C(pk(['#8a6a40', '#5a7a40', '#8a8a9a'], 3)); pants = C('#5a4430'); o.hilt = 1; break;
    case 'student': { const sailor = r(6) < .5; o.sailor = sailor; o.skirt = sailor; top = C(sailor ? '#f0f0f4' : '#1e2236'); pants = C(sailor ? '#1e2a5a' : '#1e2236');
      hair = C(pk(['#1a1414', '#2a1c14', '#4a2c18', '#7a4420'], 2)); style = sailor ? pk(['long', 'bob', 'pony', 'bun'], 5) : pk(['short', 'spiky', 'short'], 5); o.gak = !sailor; o.satchel = C('#4a3020'); break; }
    case 'thief': top = C('#34343e'); pants = C('#24242c'); o.hood = C('#34343e'); o.mask = 1; break;
    case 'cat': skin = C(pk(['#f0a040', '#a0a0a8', '#3a3a42', '#f4f0e8', '#c87830', '#e8c890'], 1)); hair = skin; style = 'none'; o.cat = 1; break;
    case 'android': skin = C('#c8d0d8'); hair = C('#8890a0'); style = 'none'; o.bot = 1; top = C(pk(['#3a3a48', '#e0e0e8', '#2a4a6a'], 3)); break;
    case 'spirit': o.spirit = 1; skin = C('#eef2ff'); break;
    case 'routine': if (r(9) < .3) { o.tie = C(pk(['#c03030', '#3050a0', '#407040'], 10)); top = C('#f0f0f4'); pants = C('#2a2a38'); } if (r(11) < .2) o.glasses = 1; if (r(12) < .3 && style !== 'spiky') o.skirt = 1; break;
  }
  if (uni) { o.uni = C(uni); }
  const capc = C(pk(['#d04040', '#3060c0', '#e8e8e8', '#40a060'], 13));
  SPR[key] = offscreen(12, 15, () => {
    const s = [0, 1, 0, -1][fr & 3], back = dir === 2, side = dir === 1 || dir === 3, P = (x, y, c) => pset(x, y, c), R = (x, y, w, h, c) => rectF(x, y, w, h, c);
    if (o.spirit) { // a little floating sheet, the hem waving as it drifts
      const sk = skin, sh = C('#b8c4e8');
      for (let y = 1; y < 14; y++) { const hw = y < 7 ? Math.sqrt(Math.max(0, 1 - ((y - 4.2) / 3.4) ** 2)) * 4.4 : 3.6 + (y - 7) * .25; for (let x = 0; x < 12; x++) { const dx = x + .5 - 5.8; if (Math.abs(dx) <= hw) P(x, y, dx > hw - 1.2 ? sh : sk); } }
      for (let x = 2; x < 10; x++) if ((x + fr) % 3 === 0) P(x, 14, sk); else if ((x + fr) % 3 === 1) P(x, 13, 0);
      if (!back) { const ex = side ? [7, 9] : [4, 7]; R(ex[0], 4, 1, 2, eye); R(ex[1], 4, 1, 2, eye); P(side ? 8 : 5, 7, C('#9aa4c8')); }
      return softOutline(.55);
    }
    // ---- legs and shoes (behind everything)
    const leg = o.skirt ? skin : pants;
    if (side) {
      const front = [5, 7, 5, 3][fr & 3], rear = [5, 3, 5, 7][fr & 3];
      R(rear, 12, 2, 2, shade(leg, .25)); R(rear, 14, 2, 1, shoe);
      R(front, 12, 2, 2, leg); R(front + (s ? 0 : 0), 14, 3, 1, shoe);
    } else {
      const lu = s === 1 ? 1 : 0, ru = s === -1 ? 1 : 0;
      R(4, 12, 2, 2 - lu, leg); R(4, 14 - lu, 2, 1, shoe); R(6, 12, 2, 2 - ru, leg); R(6, 14 - ru, 2, 1, shoe);
      if (o.skirt) { R(4, 13 - lu, 2, 1, C('#f0f0f0')); R(6, 13 - ru, 2, 1, C('#f0f0f0')); }
    }
    // ---- capes and packs that hang behind the body
    if (o.cape && back) { R(2, 8, 8, 5, o.cape); R(3, 13, 6, 1, shade(o.cape, .3)); }
    if (o.cape && side) R(2, 8, 2, 5, o.cape);
    if (o.cape && !back && !side) { R(1, 9, 1, 3, o.cape); R(10, 9, 1, 3, o.cape); }
    if (o.pack && side) { R(2, 8, 2, 4, o.pack); P(2, 8, lite(o.pack, .3)); }
    // ---- body
    const tx = side ? 4 : 3, tw2 = side ? 4 : 6, body = o.uni || top;
    R(tx, 8, tw2, 4, body); R(tx, 8, 1, 4, lite(body, .2)); R(tx + tw2 - 1, 8, 1, 4, shade(body, .25));
    if (o.skirt) { R(tx, 11, tw2, 1, pants); R(tx - (side ? 0 : 1), 12, tw2 + (side ? 0 : 2), 1, pants); }
    if (o.uni && !back) { R(side ? 6 : 5, 8, side ? 1 : 2, 4, C('#f4f4f4')); P(side ? 7 : 7, 9, C('#ffffff')); P(side ? 7 : 7, 10, C('#e0c040')); }
    else if (o.uni && back) R(4, 9, 4, 1, shade(o.uni, .2));
    if (o.tie && !back && !side) { R(5, 8, 2, 1, o.tie); P(5, 9, o.tie); P(6, 9, o.tie); P(5, 10, shade(o.tie, .2)); }
    if (o.sailor && !back) { R(tx, 8, tw2, 1, C('#1e2a5a')); if (!side) { P(5, 9, C('#d03030')); P(6, 9, C('#d03030')); } }
    if (o.sailor && back) R(3, 8, 6, 2, C('#1e2a5a'));
    if (o.gak && !back) { P(side ? 7 : 5, 9, C('#e0c040')); P(side ? 7 : 5, 11, C('#e0c040')); }
    if (o.pack && back) { R(3, 8, 6, 4, o.pack); R(3, 8, 6, 1, lite(o.pack, .3)); R(4, 10, 4, 1, shade(o.pack, .3)); }
    if (o.pack && !back && !side) { P(3, 8, o.pack); P(3, 9, o.pack); P(8, 8, o.pack); P(8, 9, o.pack); }
    if (o.satchel && !back) { P(side ? 4 : 8, 8, o.satchel); P(side ? 5 : 7, 9, o.satchel); if (!side) R(8, 10, 2, 2, o.satchel); }
    // ---- arms: they swing as they walk
    const sleeve = o.uni || top;
    if (side) { const ax = 5 + s; R(ax, 8, 2, 3, shade(sleeve, .1)); R(ax, 11, 2, 1, skin); }
    else { const la = s, ra = -s; R(2, 8, 1, 3 + Math.min(0, la), sleeve); P(2, 11 + Math.min(0, la), skin); R(9, 8, 1, 3 + Math.min(0, ra), shade(sleeve, .15)); P(9, 11 + Math.min(0, ra), skin); }
    if (o.hilt && !side) { P(back ? 3 : 8, 7, C('#a08040')); P(back ? 2 : 9, 6, C('#c0c0c8')); }
    // ---- head
    const cx = side ? 5.8 : 5.5, cy = 4.2, rx = 4.4, ry = 3.3;
    const inHead = (x, y) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 12; x++) if (inHead(x, y)) P(x, y, x + .5 - cx > rx - 1.4 ? shade(skin, .18) : skin);
    if (o.cat) { // ears, nose, tail
      P(2, 1, skin); P(2, 0, skin); P(3, 1, skin); P(8, 1, skin); P(9, 0, skin); P(9, 1, skin); if (!back && !side) { P(2, 1, C('#f0a0a0')); P(9, 1, C('#f0a0a0')); }
      if (side) { P(4, 0, skin); P(4, 1, skin); P(5, 1, skin); }
      if (!back) { P(side ? 9 : 5, 6, C('#e07080')); if (!side) P(6, 6, C('#e07080')); }
      const tc = shade(skin, .15); if (side) { R(1, 9, 1, 3, tc); P(0, 8 + (fr & 1), tc); } else if (back) { R(5, 11, 2, 2, tc); P(7 + (fr & 1), 10, tc); }
      if (r(14) < .5) { P(5, 1, shade(skin, .3)); P(6, 1, shade(skin, .3)); P(5, 2, shade(skin, .3)); } // stripes
    }
    if (o.bot) { // panel lines, an antenna, a visor
      P(side ? 6 : 8, 0, C('#e04040')); P(side ? 6 : 8, 1, C('#808890'));
      if (!back) { R(side ? 6 : 2, 4, side ? 5 : 8, 2, C('#1a2030')); const sx = vari % (side ? 4 : 7); P((side ? 7 : 2) + sx, 4, C('#40e8ff')); P((side ? 7 : 2) + sx, 5, C('#40e8ff')); }
      else R(3, 3, 6, 1, shade(skin, .3));
    }
    // ---- hair
    const H = (x, y) => { if (x >= 0 && x < 12 && y >= 0 && y < 15) P(x, y, x + .5 - cx > rx - 1.6 ? shade(hair, .2) : hair); };
    const hood = o.hood;
    if (hood) { // a hood framing the face
      for (let y = 0; y < 9; y++) for (let x = 0; x < 12; x++) { const d = ((x + .5 - cx) / (rx + .6)) ** 2 + ((y + .5 - cy) / (ry + .6)) ** 2; if (d <= 1) P(x, y, x + .5 - cx > rx - 1 ? shade(hood, .25) : hood); }
      if (!back) for (let y = 3; y < 8; y++) for (let x = 0; x < 12; x++) { const fx = side ? 7.3 : 5.5; if (((x + .5 - fx) / (side ? 2.4 : 3)) ** 2 + ((y + .5 - 5.2) / 2.1) ** 2 <= 1) P(x, y, skin); }
    } else if (style !== 'none') {
      for (let y = 0; y < 8; y++) for (let x = 0; x < 12; x++) { if (!inHead(x, y)) continue;
        if (back) { if (y < 7 || style === 'long' || style === 'bob') H(x, y); }
        else if (side) { if (y < 3 || x + .5 < cx - .3 && y < 6 || style !== 'cap' && y === 3 && x < 9) H(x, y); }
        else { if (y < 3 || y === 3 && (x < 4 || x > 7 || style === 'spiky' && x % 2) || (style === 'long' || style === 'bob') && y < 6 && (x < 3 || x > 8)) H(x, y); } }
      if (style === 'short' && !back) { if (!side) { H(1, 4); H(10, 4); } }
      if (style === 'long') { if (back) R(2, 7, 8, 3, hair); else if (side) R(2, 6, 3, 4, hair); else { R(1, 4, 2, 5, hair); R(9, 4, 2, 5, shade(hair, .2)); } }
      if (style === 'bob') { if (side) R(2, 5, 3, 2, hair); else if (!back) { R(1, 4, 2, 3, hair); R(9, 4, 2, 3, shade(hair, .2)); } }
      if (style === 'pony') { if (back) R(5, 7, 2, 3, hair); else if (side) { R(1, 3, 2, 2, hair); P(0, 5 + (fr & 1), hair); P(1, 5, hair); } else { P(1, 3, hair); P(10, 3, hair); } }
      if (style === 'spiky') { H(2, 0); H(5, 0); H(8, 0); if (side) H(3, 0); }
      if (style === 'bun') { if (side) { R(2, 0, 3, 2, hair); } else { R(4, 0, 4, 1, hair); R(5, -1, 2, 1, hair); } }
      if (style === 'cap') { R(1, 0, 10, 2, capc); P(5, 0, lite(capc, .4)); if (side) R(6, 2, 6, 1, shade(capc, .2)); else if (!back) R(2, 2, 8, 1, shade(capc, .25)); else R(3, 2, 6, 1, capc); }
    }
    // ---- face
    if (!back) {
      if (side) { R(8, 4, 1, 2, eye); P(9, 6, mix(skin, C('#ff6080'), .3)); }
      else { R(4, 4, 1, 2, eye); R(7, 4, 1, 2, eye); P(3, 6, mix(skin, C('#ff6080'), .3)); P(8, 6, mix(skin, C('#ff6080'), .3)); }
      if (o.glasses) { if (side) { P(9, 4, C('#202028')); P(7, 4, C('#202028')); } else { R(3, 4, 3, 1, C('#202028')); R(6, 4, 3, 1, C('#202028')); } }
      if (o.mask) { if (side) { R(6, 4, 6, 2, C('#101014')); P(8, 4, C('#ffffff')); } else { R(1, 4, 10, 2, C('#101014')); P(4, 4, C('#ffffff')); P(7, 4, C('#ffffff')); } }
    }
    softOutline(.72);
  });
  return SPR[key];
}
// outline each sprite in a darker shade of whatever it touches, instead of flat black
function softOutline(k) {
  const w = FW, h = FH, src = FB.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (src[y * w + x]) continue;
    const n = (x > 0 && src[y * w + x - 1]) || (x < w - 1 && src[y * w + x + 1]) || (y < h - 1 && src[(y + 1) * w + x]) || (y > 0 && src[(y - 1) * w + x]);
    if (n) FB[y * w + x] = mix(n, INKC, k); }
}
// who a customer looks like: their segment, with some of the mall's cats, androids, and spirits mixed in
function custLook(a) {
  if (a.lk) return a.lk; const r = a.seed * 1000 % 1;
  a.lk = a.g === 'routine' ? (r < .14 ? 'cat' : r < .24 ? 'android' : 'routine') : a.g === 'adventurer' ? (r < .18 ? 'spirit' : r < .26 ? 'cat' : 'adventurer') : a.g === 'traveler' ? (r < .1 ? 'android' : 'traveler') : a.g;
  return a.lk;
}
function outline() { // 1px dark outline around whatever is in the current buffer
  const w = FW, h = FH, src = FB.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (src[y * w + x]) continue;
    if ((x > 0 && src[y * w + x - 1]) || (x < w - 1 && src[y * w + x + 1]) || (y > 0 && src[(y - 1) * w + x]) || (y < h - 1 && src[(y + 1) * w + x])) FB[y * w + x] = INKC; }
}
// Carl and Ghost as staff-room cameos (when they visit their own stores) and as the bosses on the store tag
function carlSprite() { return SPR.carl || (SPR.carl = offscreen(12, 20, () => {
  rectF(2, 10, 8, 6, C('#1a1a2a')); rectF(3, 16, 2, 3, C('#1a1a2a')); rectF(7, 16, 2, 3, C('#1a1a2a')); rectF(5, 10, 2, 2, C('#f0d040'));
  ellF(6, 5.5, 5, 5, C('#5aa860')); ellF(4, 6, 1.6, 2, INKC); ellF(8, 6, 1.6, 2, INKC); rectF(1, 0, 10, 3, INKC); rectF(0, 2, 3, 1, INKC); outline(); })); }
function ghostSprite() { return SPR.ghost || (SPR.ghost = offscreen(12, 20, () => {
  ellF(6, 6, 5, 5.5, C('#f4f4ff')); rectF(1, 6, 11, 11, C('#f4f4ff')); for (let i = 0; i < 11; i += 3) ellF(2 + i, 17, 1.5, 1.5, C('#f4f4ff'));
  ellF(4, 6, 1.2, 1.8, INKC); ellF(8, 6, 1.2, 1.8, INKC); rectF(5, 10, 2, 1, C('#a0a0c0')); outline(); })); }

function bossSprite(mgr) {
  if (mgr === 'carl') return carlSprite(); if (mgr === 'ghost') return ghostSprite(); if (mgr === 'linda') return LINDA_SPR();
  const k = 'boss' + mgr; if (SPR[k]) return SPR[k];
  return (SPR[k] = offscreen(12, 20, () => {
    if (mgr === 'face') { glow(6, 7, 7, C('#40a8ff'), .5); ellF(6, 6, 4.5, 5.5, C('#d8e0e8')); rectF(8, 3, 2, 6, C('#a0b0c0')); pset(4, 6, INKC); pset(7, 6, INKC); rectF(4, 9, 4, 1, C('#607080')); for (let y = 12; y < 18; y += 2) rectF(3 + (y - 12) / 2, y, 6 - (y - 12), 1, C('#40a8ff')); }
    else if (mgr === 'yoko') { rectF(3, 10, 6, 5, C('#30a898')); rectF(5, 10, 2, 2, C('#ffffff')); rectF(4, 15, 4, 4, C('#e8e0d0')); rectF(4, 19, 1, 1, INKC); rectF(7, 19, 1, 1, INKC); ellF(6, 6, 4, 3.6, C('#f4d0b4')); ellF(6, 4.4, 4.6, 2.8, C('#5a3a24')); rectF(1, 4, 2, 8, C('#5a3a24')); rectF(9, 4, 2, 8, C('#5a3a24')); pset(4, 7, INKC); pset(7, 7, INKC); }
    else if (mgr === 'jb') { rectF(2, 10, 8, 7, C('#a88860')); rectF(5, 10, 2, 7, C('#e8e0f0')); rectF(3, 17, 2, 2, C('#ee8a2c')); rectF(7, 17, 2, 2, C('#ee8a2c')); ellF(6, 7, 4, 3.2, C('#ee8a2c')); rectF(4, 8, 1, 1, INKC); rectF(7, 8, 1, 1, INKC); rectF(1, 4, 10, 1, C('#5a5a70')); rectF(3, 1, 6, 3, C('#7a7a90')); rectF(3, 3, 6, 1, C('#ff3cc8')); }
    softOutline(.7); }));
}
// ---------- portraits (48 x 56) for dialogue windows ----------
const PORT = {};
function portrait(who, mood) {
  const key = who + (mood || ''); if (PORT[key]) return PORT[key];
  PORT[key] = offscreen(48, 56, () => {
    if (who === 'CARL') {
      gradV(0, 0, 48, 56, C('#2a8a7a'), C('#103a3a'), 8);
      rectF(8, 44, 32, 12, C('#1a1a2a')); polyF([[18, 44], [24, 50], [30, 44]], C('#f0f0f0')); polyF([[19, 45], [24, 49], [24, 45]], C('#f0d040')); polyF([[24, 45], [29, 45], [24, 49]], C('#f0d040'));
      blob(24, 27, 15, 16, [C('#2a5a30'), C('#3a7a40'), C('#5aa860'), C('#8ad890')]);
      const sq = mood === 'nervous' ? 1 : 0;
      ellF(17, 28 + sq, 5, 6 - sq, INKC); ellF(31, 28 + sq, 5, 6 - sq, INKC); pset(15, 25, C('#ffffff')); pset(29, 25, C('#ffffff'));
      rectF(21, 38, 6, 1, INKC); if (mood === 'nervous') { pset(20, 37, INKC); pset(27, 37, INKC); rectF(36, 18, 2, 3, C('#a0e0ff')); }
      rectF(7, 9, 34, 9, INKC); ellF(24, 12, 17, 6, INKC); rectF(2, 15, 10, 3, INKC); rectF(23, 9, 3, 2, C('#303040'));
    } else if (who === 'GHOST') {
      gradV(0, 0, 48, 56, C('#3a1a6a'), C('#0a0420'), 8); glow(24, 24, 26, C('#5a3aa0'), .6);
      blob(24, 28, 17, 19, [C('#9a9ab8'), C('#c8c8e0'), C('#ececff'), C('#ffffff')]); rectF(7, 30, 34, 26, C('#ececff')); for (let i = 0; i < 34; i += 2) pset(7 + i, 30 + (i % 4 ? 0 : 1), C('#c8c8e0'));
      const sly = mood === 'proud';
      if (sly) { rectF(14, 24, 8, 2, INKC); rectF(27, 24, 8, 2, INKC); } else { ellF(18, 25, 3, 4.5, INKC); ellF(30, 25, 3, 4.5, INKC); }
      if (mood === 'sad') { rectF(20, 37, 8, 1, INKC); pset(19, 38, INKC); pset(28, 38, INKC); } else { ellF(24, 36, 3, 2, INKC); }
    } else if (who === 'LINDA') { // swept pink hair, a high ponytail, a pink-and-black uniform with a tall collar, gold
      gradV(0, 0, 48, 56, C('#5a1a48'), C('#14081a'), 8); glow(24, 20, 24, C('#ff3c9a'), .35);
      blob(36, 24, 9, 16, [C('#a01a5a'), C('#d83a88'), C('#ff5aa8'), C('#ffa0d0')]); // ponytail behind
      rectF(8, 44, 32, 12, C('#20202e')); for (let x = 10; x < 40; x += 5) rectF(x, 46, 2, 10, C('#ff5aa8')); polyF([[16, 40], [24, 48], [32, 40], [32, 46], [16, 46]], C('#20202e')); rectF(22, 44, 4, 3, C('#f0c040'));
      blob(24, 28, 12, 14, [C('#c09088'), C('#e0b0a0'), C('#f2cdc4'), C('#fff0e8')]);
      polyF([[10, 26], [12, 12], [22, 6], [36, 8], [40, 20], [38, 28], [34, 18], [26, 15], [18, 18], [14, 32]], C('#ff5aa8')); polyF([[22, 6], [36, 8], [38, 14], [24, 12]], C('#ffa0d0'));
      const sm = mood === 'smug'; rectF(17, 27, 5, sm ? 1 : 2, C('#3a0a28')); rectF(27, 27, 5, sm ? 1 : 2, C('#3a0a28')); pset(18, 27, C('#ff3c9a')); pset(28, 27, C('#ff3c9a'));
      rectF(15, 24, 7, 1, C('#a01a5a')); rectF(27, 24, 7, 1, C('#a01a5a')); rectF(21, 36, 7, 2, C('#d02a78')); if (sm) pset(28, 35, C('#d02a78'));
      pset(24, 2, C('#f0c040')); rectF(22, 3, 5, 2, C('#f0c040'));
    } else if (who === 'FACE') { // the restored Original Face: a floating human face, emerging through machinery
      gradV(0, 0, 48, 56, C('#0a2040'), C('#02060e'), 8);
      for (let i = 0; i < 9; i++) { const y = 8 + i * 5; rectF(2, y, 44, 1, C('#0e2a4a')); } for (let i = 0; i < 12; i++) pset(4 + hash(i, 3) * 40, 4 + hash(i, 4) * 48, C('#40a8ff'));
      glow(24, 28, 24, C('#2060c0'), .5);
      blob(24, 28, 14, 17, [C('#6a7a90'), C('#a0b0c0'), C('#d8e0e8'), C('#ffffff')]);
      for (let y = 40; y < 48; y += 2) rectF(12 + (y - 40), y, 24 - (y - 40) * 2, 1, C('#40a8ff')); // the bottom of the face dissolves into scanlines
      const lk = mood === 'idea'; ellF(18, 26, 3, lk ? 3.5 : 2.5, C('#203048')); ellF(30, 26, 3, lk ? 3.5 : 2.5, C('#203048')); pset(17, 25, C('#a0e0ff')); pset(29, 25, C('#a0e0ff'));
      rectF(15, 21, 7, 1, C('#506070')); rectF(27, lk ? 20 : 21, 7, 1, C('#506070')); rectF(24, 28, 1, 5, C('#8090a0')); rectF(20, 36, 9, 1, C('#405060')); if (lk) { pset(19, 35, C('#405060')); pset(29, 35, C('#405060')); }
      lineF(4, 50, 16, 44, C('#40a8ff')); lineF(44, 50, 32, 44, C('#40a8ff'));
    } else if (who === 'YOKO') { // brown waves, a calm smile, a neat assistant's collar
      gradV(0, 0, 48, 56, C('#d8ecec'), C('#7aa8a8'), 8);
      blob(24, 30, 17, 22, [C('#3a2418'), C('#5a3a24'), C('#7a5032'), C('#a06a44')]);
      rectF(9, 44, 30, 12, C('#30a898')); polyF([[18, 44], [24, 51], [30, 44]], C('#ffffff')); rectF(23, 46, 2, 2, C('#f0c040'));
      blob(24, 28, 11, 13, [C('#c08870'), C('#e0b090'), C('#f4d0b4'), C('#fff0e0')]);
      polyF([[12, 26], [14, 14], [24, 10], [34, 14], [36, 24], [30, 17], [22, 19], [16, 22]], C('#5a3a24')); polyF([[24, 10], [34, 14], [32, 16], [24, 13]], C('#8a5a38'));
      const sm = mood !== 'neutral'; if (sm) { rectF(16, 27, 5, 1, C('#2a1810')); rectF(27, 27, 5, 1, C('#2a1810')); pset(15, 28, C('#2a1810')); pset(32, 28, C('#2a1810')); } else { ellF(18, 27, 2, 2, C('#2a1810')); ellF(30, 27, 2, 2, C('#2a1810')); pset(18, 26, C('#a0d0ff')); pset(30, 26, C('#a0d0ff')); }
      if (sm) { rectF(21, 35, 7, 1, C('#b05050')); pset(20, 34, C('#b05050')); pset(28, 34, C('#b05050')); } else rectF(22, 35, 5, 1, C('#b05050'));
      pset(14, 31, C('#f0a0a0')); pset(34, 31, C('#f0a0a0'));
    } else if (who === 'JB') { // an orange cat in a grey fedora and a trench coat, half-lidded, sure he's the coolest one here
      gradV(0, 0, 48, 56, C('#2a1a2a'), C('#0a0610'), 8); for (let i = 0; i < 14; i++) lineF(4 + i * 3.4, 0, i * 3.4, 12, C('#3a2a3a')); glow(38, 10, 14, C('#ff9030'), .4);
      polyF([[2, 56], [6, 44], [18, 40], [24, 48], [30, 40], [42, 44], [46, 56]], C('#a88860')); polyF([[18, 40], [24, 48], [30, 40], [28, 56], [20, 56]], C('#e8e0f0')); rectF(23, 48, 3, 8, C('#20141c'));
      blob(24, 30, 14, 12, [C('#a0501a'), C('#d0701e'), C('#ee8a2c'), C('#ffc070')]); polyF([[11, 24], [10, 12], [18, 20]], C('#ee8a2c')); polyF([[37, 24], [38, 12], [30, 20]], C('#d0701e'));
      blob(24, 35, 7, 5, [C('#c0b090'), C('#e0d0b0'), C('#f0e0c8'), C('#ffffff')]); polyF([[22, 32], [26, 32], [24, 34]], C('#20141c'));
      rectF(14, 28, 7, 3, C('#f4f0e0')); rectF(27, 28, 7, 3, C('#f4f0e0')); rectF(14, 27, 7, 2, C('#a0501a')); rectF(27, 27, 7, 2, C('#a0501a')); pset(18, 30, C('#20141c')); pset(31, 30, C('#20141c'));
      for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) lineF(24 + sx * 6, 36 + i * 2, 24 + sx * 15, 34 + i * 3, C('#ffffff'));
      polyF([[10, 22], [12, 10], [24, 6], [36, 10], [38, 22]], C('#7a7a90')); polyF([[24, 6], [36, 10], [38, 22], [24, 22]], C('#5a5a70')); rectF(10, 18, 28, 3, C('#ff3cc8')); rectF(2, 21, 44, 3, C('#5a5a70'));
      if (mood === 'cool') { rectF(26, 47, 6, 1, C('#f0f0f0')); pset(32, 46, C('#ff9030')); }
    } else {
      gradV(0, 0, 48, 56, C('#5a5a6a'), C('#202028'), 8); const s = (STAFF_POOL.find(p => p[0] === who) || [])[1] || 'human', L = LOOKS[s];
      blob(24, 26, 13, 14, [mix(C(L.skin), INKC, .4), mix(C(L.skin), INKC, .2), C(L.skin), mix(C(L.skin), C('#ffffff'), .3)]); rectF(10, 42, 28, 14, C('#ffffff'));
      ellF(19, 26, 2, 2.5, INKC); ellF(29, 26, 2, 2.5, INKC); rectF(21, 34, 6, 1, INKC);
    }
    frameR(0, 0, 48, 56, INKC);
  });
  return PORT[key];
}

// ---------- wallpapers behind the store (the Special look: the store floats on its world) ----------
const PAPER = {};
function wallpaper(mgr) {
  if (PAPER[mgr]) return PAPER[mgr];
  const M = MGRS[mgr], base = C(M.paper);
  return (PAPER[mgr] = offscreen(W, H, () => {
    rectF(0, 0, W, H, base);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (B4[(x & 3) + ((y & 3) << 2)] < 3 && hash(x >> 2, y >> 2, 7) < .5) pset(x, y, mix(base, INKC, .25));
    if (mgr === 'carl') { // shipping labels and arrows, stamped at an angle
      for (let j = 0; j < 7; j++) for (let i = 0; i < 9; i++) { const x = i * 60 + (j & 1) * 30 + 8, y = j * 38 + 6, c = mix(base, C('#e8c070'), .35), c2 = mix(base, INKC, .35);
        rectF(x, y, 22, 14, c); rectF(x + 2, y + 3, 10, 1, c2); rectF(x + 2, y + 6, 14, 1, c2); rectF(x + 2, y + 9, 8, 1, c2); polyF([[x + 26, y + 4], [x + 32, y + 7], [x + 26, y + 10]], mix(base, C('#40d8a8'), .4)); }
    } else if (mgr === 'linda') { // gold diamonds and her initial on lacquer green
      for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) { const x = i * 44 + (j & 1) * 22 + 10, y = j * 34 + 8, g = mix(base, C('#f0c040'), .3);
        polyF([[x, y], [x + 6, y + 6], [x, y + 12], [x - 6, y + 6]], g); if ((i + j) % 3 === 0) text('L', x - 2, y + 3, mix(base, C('#ff5aa8'), .45), 0); }
    } else if (mgr === 'face') { // graph paper, little circuits, sketched ideas
      for (let x = 0; x < W; x += 12) rectF(x, 0, 1, H, mix(base, C('#40a8ff'), .14)); for (let y = 0; y < H; y += 8) rectF(0, y, W, 1, mix(base, C('#40a8ff'), .14));
      for (let k = 0; k < 40; k++) { const x = hash(k, 1, 5) * W | 0, y = hash(k, 2, 5) * H | 0, c = mix(base, C('#80d0ff'), .35); lineF(x, y, x + 14, y, c); lineF(x + 14, y, x + 14, y + 10, c); ellF(x + 14, y + 10, 1.5, 1.5, c); }
      for (let k = 0; k < 10; k++) { const x = hash(k, 3, 5) * W | 0, y = hash(k, 4, 5) * H | 0; text('?', x, y, mix(base, C('#ffffff'), .25), 0); }
    } else if (mgr === 'yoko') { // calm signage: helpful little pictograms in tidy rows
      for (let j = 0; j < 7; j++) for (let i = 0; i < 10; i++) { const x = i * 52 + (j & 1) * 26 + 8, y = j * 38 + 8, c = mix(base, C('#30a898'), .35), k = (i + j * 3) % 4;
        rectF(x, y, 16, 12, mix(base, C('#ffffff'), .35)); frameR(x, y, 16, 12, c);
        if (k === 0) { ellF(x + 8, y + 4, 2, 2, c); rectF(x + 6, y + 6, 5, 4, c); } else if (k === 1) { rectF(x + 3, y + 5, 10, 2, c); polyF([[x + 11, y + 3], [x + 14, y + 6], [x + 11, y + 9]], c); }
        else if (k === 2) { ellF(x + 8, y + 6, 4, 3, c); rectF(x + 7, y + 2, 2, 2, c); } else text('i', x + 6, y + 3, c, 0); }
    } else if (mgr === 'jb') { // paw prints in the rain, amber windows across the street
      for (let k = 0; k < 18; k++) { const x = hash(k, 1, 8) * W | 0, y = hash(k, 2, 8) * H | 0; rectF(x, y, 14, 10, mix(base, C('#ffb040'), .25)); rectF(x + 6, y, 1, 10, base); rectF(x, y + 4, 14, 1, base); }
      for (let j = 0; j < 9; j++) for (let i = 0; i < 12; i++) { const x = i * 44 + (j & 1) * 22 + 6, y = j * 30 + 6, c = mix(base, C('#f08a30'), .3); ellF(x, y + 3, 2.5, 2, c); pset(x - 2, y, c); pset(x, y - 1, c); pset(x + 2, y, c); }
      for (let k = 0; k < 120; k++) { const x = hash(k, 5, 8) * W | 0, y = hash(k, 6, 8) * H | 0; lineF(x, y, x - 1, y + 3, mix(base, C('#8090c0'), .3)); }
    } else { // lanterns and little stars
      for (let j = 0; j < 7; j++) for (let i = 0; i < 9; i++) { const x = i * 60 + (j & 1) * 30 + 14, y = j * 38 + 10;
        ellF(x, y + 6, 5, 6, mix(base, C('#ffb050'), .35)); rectF(x - 1, y - 1, 3, 2, mix(base, INKC, .4)); pset(x + 22, y, mix(base, C('#ffffff'), .5)); pset(x + 22, y + 2, mix(base, C('#ffffff'), .3)); pset(x + 21, y + 1, mix(base, C('#ffffff'), .3)); pset(x + 23, y + 1, mix(base, C('#ffffff'), .3)); }
    }
  }));
}

// ---------- floors: each manager's own ----------
function drawFloor(st, mgr, T) {
  const A = C(T.floorA), B = C(T.floorB);
  for (let y = 0; y < st.fh; y++) for (let x = 0; x < st.fw; x++) { const px = WALL + x * TW, py = WALL + BACK_H + y * TH;
    if (mgr === 'ghost') { // flagstones, uneven mortar
      rectF(px, py, TW, TH, (x + y) & 1 ? A : B); const m = mix(A, INKC, .35), o = (y & 1) * 12; rectF(px, py, TW, 1, m); rectF(px + o, py, 1, TH, m); if (hash(x, y, 4) < .3) pset(px + 6 + hash(x, y, 5) * 12, py + 4 + hash(x, y, 6) * 8, mix(A, C('#ffffff'), .1)); }
    else if (mgr === 'linda') { // glossy dark lacquer tiles with gold inlay
      rectF(px, py, TW, TH, (x + y) & 1 ? A : B); rectF(px, py, TW, 1, C('#8a6a20')); rectF(px, py, 1, TH, C('#8a6a20')); if ((x + y) % 4 === 0) { pset(px + 12, py + 8, C('#f0c040')); pset(px + 11, py + 8, C('#a08030')); pset(px + 13, py + 8, C('#a08030')); }
      rectF(px + 2, py + 2, 6, 1, mix(B, C('#ffffff'), .12)); }
    else if (mgr === 'face') { // lab tiles with a grid
      rectF(px, py, TW, TH, A); for (let i = 0; i < TW; i += 6) rectF(px + i, py, 1, TH, B); for (let j = 0; j < TH; j += 4) rectF(px, py + j, TW, 1, B); if (hash(x, y, 7) < .12) rectF(px + 6, py + 4, 6, 4, mix(A, C('#40a8ff'), .3)); }
    else if (mgr === 'yoko') { // light wood planks
      rectF(px, py, TW, TH, A); for (let j = 0; j < TH; j += 4) { rectF(px, py + j, TW, 1, mix(A, INKC, .12)); if (((y * 4 + j / 4) + x) % 3 === 0) rectF(px + ((y * 7 + j) % TW), py + j, 1, 4, mix(A, INKC, .15)); } if (hash(x, y, 2) < .3) rectF(px + 4, py + 2, 8, 1, B); }
    else if (mgr === 'jb') { // diner checkerboard, worn at night
      for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) rectF(px + i * 12, py + j * 8, 12, 8, (x * 2 + i + y * 2 + j) & 1 ? A : B); }
    else { rectF(px, py, TW, TH, (x + y) & 1 ? A : B); rectF(px, py, TW, 1, mix(A, INKC, .15)); }
  }
}
// ---------- the store shell: walls, floor, backroom (cached; redrawn when the layout changes) ----------
function storeShell(st) {
  const key = st.size + chainOf(st).mgr; st.shellKey = key; const M = MGRS[chainOf(st).mgr];
  return offscreen(st.fw * TW + WALL * 2, st.fh * TH + WALL * 2 + BACK_H, () => {
    const w = st.fw * TW + WALL * 2, h = st.fh * TH + WALL * 2 + BACK_H, wood = C(M.wall);
    // backroom: dark floor, racks, a break table, the stairs-ish door
    rectF(0, 0, w, BACK_H + WALL, mix(wood, INKC, .5)); rectF(WALL, 4, w - WALL * 2, BACK_H - 2, C('#3a3a42'));
    for (let x = WALL; x < w - WALL; x += 6) rectF(x, 4, 1, BACK_H - 2, C('#32323a'));
    const T = FXT[chainOf(st).mgr] || FXT.carl; for (let i = 0; i < 4; i++) { const rx = WALL + 4 + i * 26; rectF(rx, 6, 22, 10, C(T.frame)); frameR(rx, 6, 22, 10, mix(C(T.frame), INKC, .4)); rectF(rx + 2, 7, 6, 4, C('#c8a060')); rectF(rx + 9, 7, 6, 4, C('#a8c060')); rectF(rx + 16, 9, 4, 6, C('#c86060')); }
    const tx = w - WALL - 40; rectF(tx, 10, 30, 10, C('#8a6a4a')); rectF(tx + 2, 11, 26, 1, C('#b08a60')); rectF(tx - 6, 12, 4, 6, C('#4a4a5a')); rectF(tx + 32, 12, 4, 6, C('#4a4a5a'));
    // floor
    drawFloor(st, chainOf(st).mgr, T);
    // wooden walls with a lighter rim
    const fy = BACK_H; rectF(0, fy, w, WALL, wood); rectF(0, fy, WALL, h - fy, wood); rectF(w - WALL, fy, WALL, h - fy, wood); rectF(0, h - WALL, w, WALL, wood);
    for (let i = 0; i < w; i += 7) { rectF(i, fy + 2, 5, 1, mix(wood, C('#ffffff'), .2)); rectF(i, h - 5, 5, 1, mix(wood, C('#ffffff'), .2)); }
    frameR(0, 0, w, h, INKC); frameR(WALL - 1, fy + WALL - 1, w - WALL * 2 + 2, h - fy - WALL * 2 + 2, mix(wood, INKC, .5));
    // backroom door with up/down arrows, as in Special
    const bx = WALL + backX(st) * TW; rectF(bx, fy, TW, WALL, C('#202028'));
    // front door: glass, with the store color
    const dx = WALL + doorX(st) * TW; rectF(dx - 2, h - WALL, TW + 4, WALL, C(M.col)); rectF(dx, h - WALL + 1, TW, WALL - 2, C('#a8e8ff')); rectF(dx + TW / 2 - 1, h - WALL + 1, 1, WALL - 2, C(M.col));
  });
}

// ---------- the mall map ----------
const MSW = 16, MSH = 10; // map square size in pixels
function mapBase() {
  return offscreen(MW * MSW, MH * MSH, () => {
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const c = MALL_ROWS[y][x], px = x * MSW, py = y * MSH, occ = x >= 15;
      if (c === '#') { rectF(px, py, MSW, MSH, occ ? C('#2a2238') : C('#2a3238')); if (hash(x, y, 3) < .3) pset(px + 5, py + 4, occ ? C('#3a3050') : C('#3a4450')); }
      else { const base = c === '=' ? (occ ? C('#8a7aa8') : C('#a8b8c8')) : (occ ? C('#6a5a88') : C('#889aa8')); rectF(px, py, MSW, MSH, base); if (((x + y) & 1) === 0) rectF(px, py, MSW, MSH, mix(base, C('#ffffff'), .08)); rectF(px, py, MSW, 1, mix(base, C('#ffffff'), .2)); } }
    // the starport end and the occult end
    rectF(0, 8 * MSH, 3, 2 * MSH, C('#ffe080')); rectF(MW * MSW - 3, 8 * MSH, 3, 2 * MSH, C('#c080ff'));
  });
}
function lotIcon(x, y, price, sel) { const w = MSW * 2, h = MSH * 2; rectF(x + 1, y + 1, w - 2, h - 2, C('#3a4a3a')); for (let i = 0; i < w - 2; i += 3) pset(x + 1 + i, y + 1 + (i % 6 ? 2 : 4), C('#5a6a4a')); frameR(x + 1, y + 1, w - 2, h - 2, sel ? C('#ffff60') : C('#6a8a5a')); text('$', x + 13, y + 6, C('#a8d890'), 0); }
function storeIcon(x, y, st, sel) {
  const M = MGRS[chainOf(st).mgr], w = MSW * 2, h = MSH * 2;
  rectF(x + 1, y + 2, w - 2, h - 3, C(M.wall)); rectF(x + 1, y + 1, w - 2, 5, C(M.col)); rectF(x + 3, y + 2, w - 6, 3, C(M.col2));
  rectF(x + 4, y + 9, w - 8, 7, C('#a8e8ff')); rectF(x + w / 2 - 2, y + 11, 4, 6, C(M.col));
  if (st.permit.med) { rectF(x + w - 6, y + 7, 5, 5, C('#ffffff')); rectF(x + w - 4, y + 8, 1, 3, C('#e02020')); rectF(x + w - 5, y + 9, 3, 1, C('#e02020')); }
  if (st.permit.tob) rectF(x + 1, y + 7, 3, 3, C('#c8a878')); if (st.permit.alc) rectF(x + 1, y + 11, 3, 3, C('#e8c050'));
  frameR(x, y, w, h, sel ? C('#ffff60') : INKC);
}
function facIcon(x, y, id, built) {
  const w = MSW * 2, h = MSH * 2;
  if (!built) { frameR(x + 2, y + 2, w - 4, h - 4, C('#5a5a6a')); text('?', x + 13, y + 6, C('#7a7a8a'), 0); return; }
  const col = { vending: '#40c0ff', lounge: '#c080ff', starport: '#ffe060', tower: '#ffffff' }[id];
  rectF(x + 1, y + 1, w - 2, h - 2, C('#20202a')); rectF(x + 3, y + 3, w - 6, h - 6, mix(C(col), INKC, .4));
  if (id === 'starport') { ellF(x + 16, y + 10, 10, 6, C(col)); ellF(x + 16, y + 10, 6, 3, INKC); }
  else if (id === 'tower') { rectF(x + 12, y + 2, 8, 17, C(col)); for (let i = 0; i < 6; i++) rectF(x + 14, y + 4 + i * 2, 4, 1, C('#4080ff')); }
  else if (id === 'lounge') { ellF(x + 16, y + 9, 6, 6, C(col)); pset(x + 14, y + 8, INKC); pset(x + 18, y + 8, INKC); }
  else { for (let i = 0; i < 4; i++) rectF(x + 4 + i * 6, y + 4, 5, 12, C(col)); }
  frameR(x, y, w, h, INKC);
}
