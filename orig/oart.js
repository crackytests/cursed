'use strict';
// ================= FACE: BEFORE THE STREAM. HOME-8 art =================
// Every scene is drawn with four colors (index 0 is the background). Colors sit on the 9-bit grid.
const OPAL = {
  apt: ['#000000', '#00dbdb', '#db49db', '#ffffff'],
  hall: ['#000000', '#6d4900', '#db9200', '#ffdb49'],
  shop: ['#000000', '#006d24', '#24db49', '#b6ffb6'],
  curse: ['#000000', '#6d0000', '#db2400', '#ffb6b6'],
  dream: ['#000049', '#6d92ff', '#ffb6db', '#ffffff'],
  air: ['#000000', '#49006d', '#db49db', '#ffffff'],
};
const VX = 4, VY = 4, VW = 196, VH = 140;
let OP = OPAL.apt.map(hex);
const setPal = k => { OP = OPAL[k].map(hex); };
const oR = (x, y, w, h, c) => rectF(VX + x, VY + y, w, h, OP[c]);
const oP = (x, y, c) => pset(VX + x, VY + y, OP[c]);
const oFrame = (x, y, w, h, c) => frameRect(VX + x, VY + y, w, h, OP[c]);
const oLine = (x0, y0, x1, y1, c) => lineF(VX + x0, VY + y0, VX + x1, VY + y1, OP[c]);
const oCirc = (cx, cy, r, c) => circF(VX + cx, VY + cy, r, OP[c]);
const oText = (s, x, y, c) => text(s, VX + x, VY + y, OP[c], null);
function oDots(x, y, w, h, c, step) { for (let j = 0; j < h; j += step) for (let i = ((j / step) & 1) * (step >> 1); i < w; i += step) oP(x + i, y + j, c); }

// ---------- apartment ----------
function drawDrone(x, y, t) { // body with two windows, four spinning rotor arms, the lemon hanging below
  oR(x, y, 18, 6, 3); oR(x + 3, y + 2, 4, 2, 0); oR(x + 11, y + 2, 4, 2, 0); oR(x + 2, y + 6, 14, 1, 3);
  oR(x - 3, y + 1, 3, 1, 3); oR(x + 18, y + 1, 3, 1, 3); oR(x - 3, y - 3, 1, 4, 3); oR(x + 20, y - 3, 1, 4, 3);
  const w = t & 2 ? 6 : 4; oR(x - 3 - (w >> 1) + 1, y - 4, w, 1, 3); oR(x + 20 - (w >> 1) + 1, y - 4, w, 1, 3);
  oR(x + 8, y + 7, 2, 5, 3); oR(x + 5, y + 12, 8, 6, 3); oP(x + 13, y + 14, 3); oP(x + 4, y + 14, 3); oP(x + 8, y + 15, 0);
}
function drawApt(t) {
  setPal('apt'); const f = OS.flags;
  oR(0, 0, VW, VH, 0); oDots(0, 0, VW, 98, 1, 6);
  oR(0, 98, VW, 3, 2);
  for (let y = 101, r = 0; y < VH; y += 7, r++) { oR(0, y, VW, 1, 2); for (let x = (r & 1) * 14; x < VW; x += 28) oR(x, y, 1, 7, 2); }
  // window: the sky, the same bird, the neighbor on her balcony
  oR(8, 10, 60, 48, 3); oR(11, 13, 54, 42, 1);
  for (const [bx, bh] of [[13, 18], [26, 28], [41, 22], [53, 30]]) { oR(bx, 55 - bh, 11, bh, 2); for (let wy = 55 - bh + 3; wy < 52; wy += 6) { oR(bx + 2, wy, 2, 2, 0); oR(bx + 7, wy, 2, 2, 0); } }
  oR(37, 13, 2, 42, 3); oR(11, 33, 54, 2, 3); oR(15, 17, 10, 3, 3); oR(44, 20, 12, 3, 3);
  oR(50, 38, 14, 2, 3); oR(50, 40, 1, 14, 3); oR(63, 40, 1, 14, 3);
  oR(55, 42, 4, 4, 3); oR(55, 46, 4, 8, 3); const wv = ((t / 120) | 0) & 1;
  oR(59, 46 - wv * 3, 4, 1, 3); // her hand: up, down, every four seconds, forever
  const bx = ((t % 240) * 44 / 240) | 0; oR(12 + bx, 26 + (bx & 4 ? 1 : 0), 3, 1, 3); oP(12 + bx + 1, 25 + (bx & 4 ? 1 : 0), 3);
  // couch + cushion
  oR(4, 74, 54, 26, 2); oR(4, 74, 54, 3, 3); oR(2, 80, 6, 20, 2); oR(54, 80, 6, 20, 2); oR(6, 100, 3, 3, 3); oR(52, 100, 3, 3, 3);
  if (!f.cushionTaken) { oR(14, 78, 18, 12, 1); oFrame(14, 78, 18, 12, 3); oP(21, 83, 0); oP(25, 83, 0); oR(22, 86, 4, 1, 0); }
  // shelf with books and the binder
  oR(66, 36, 50, 3, 2); const cols = [1, 3, 2, 3, 1, 3, 1, 2, 3];
  for (let i = 0; i < 9; i++) oR(68 + i * 5, 36 - (11 + (i * 7) % 5), 4, 11 + (i * 7) % 5, cols[i]);
  if (!f.binderTaken) { oR(106, 18, 9, 18, 3); oR(108, 20, 5, 1, 0); oR(108, 24, 5, 1, 0); oR(108, 28, 5, 1, 0); }
  oR(70, 40, 16, 7, 3); oText('DUSTY', 71, 42, 0);
  // table + Mimi's cylinder
  oR(62, 84, 52, 4, 2); oR(65, 88, 3, 13, 2); oR(108, 88, 3, 13, 2);
  oR(78, 83, 26, 2, 3); oR(80, 52, 22, 2, 3); oR(80, 54, 1, 29, 3); oR(101, 54, 1, 29, 3); oDots(81, 54, 20, 29, 1, 3);
  if (t % 90 > 1) {
    oR(86, 59, 10, 4, 2); oR(85, 61, 3, 12, 2); oR(94, 61, 3, 12, 2); oCirc(91, 65, 4, 3);
    const blink = (t % 150) < 6; if (blink) { oR(88, 65, 2, 1, 0); oR(92, 65, 2, 1, 0); } else { oP(89, 65, 0); oP(93, 65, 0); }
    oR(90, 68, 3, 1, 2); oR(88, 70, 7, 9, 3); oR(86, 78, 11, 3, 3);
  }
  // kitchen counter, kettle, lemon
  oR(158, 66, 36, 34, 2); oR(156, 64, 40, 3, 3); oR(164, 52, 10, 12, 3); oR(172, 54, 4, 2, 3); oR(166, 49, 6, 3, 3); oR(165, 54, 2, 7, 0);
  if (f.lemon) { oR(180, 59, 9, 5, 3); oP(190, 61, 3); oP(179, 61, 3); }
  // the front door
  const dx = 122, dy = 16; oR(dx - 2, dy - 2, 36, 86, 3);
  if (f.doorOpen) {
    oR(dx, dy, 32, 84, 0); oDots(dx, dy, 32, 84, 1, 3);
    if (f.droneHere) drawDrone(dx + 10, dy + 26 + ((t >> 3) & 1), t);
    if (f.wedged) { oR(dx + 3, dy + 78, 16, 6, 3); oR(dx + 5, dy + 79, 12, 1, 0); oR(dx + 5, dy + 81, 12, 1, 0); }
  } else {
    oR(dx, dy, 32, 84, 2); oR(dx + 6, dy + 5, 20, 16, 0); oCirc(dx + 16, dy + 12, 4, 3); oR(dx + 13, dy + 16, 6, 1, 0);
    oR(dx + 24, dy + 48, 3, 9, 3); oR(dx + 4, dy + 30, 24, 1, 3); oR(dx + 4, dy + 50, 24, 1, 3);
  }
}

// ---------- hallway ----------
function drawHall(t) {
  setPal('hall'); const f = OS.flags;
  oR(0, 0, VW, VH, 0); oDots(0, 6, VW, 94, 1, 3); oR(0, 0, VW, 6, 1); oR(0, 98, VW, 3, 2);
  for (let y = 101; y < VH; y += 6) oR(0, y, VW, 1, 1);
  // ceiling speaker (Mimi lives in it)
  oCirc(96, 13, 6, 2); oCirc(96, 13, 4, (OS.hallVoice > 0 && (t >> 2) & 1) ? 3 : 1); if (OS.hallVoice > 0) OS.hallVoice--;
  // neighbor A: door ajar, a chair in a glow
  oR(4, 28, 30, 72, 2); oR(8, 32, 22, 64, 1); oR(14, 32, 16, 64, 3); oR(14, 32, 16, 64, 3);
  oR(18, 60, 10, 4, 2); oR(18, 56, 4, 14, 2); oR(22, 52, 6, 6, 3); oR(18, 70, 10, 24, 2);
  oR(26, 60 - ((((t / 120) | 0) & 1) * 3), 3, 3, 3); // the same wave, every four seconds
  oR(4, 28, 8, 72, 2);
  // neighbor B
  oR(52, 28, 28, 72, 2); oR(55, 31, 22, 66, 1); oR(58, 40, 16, 8, 0); oText('ALL', 59, 41, 3); oText('WELL', 56, 52, 3); oR(56, 94, 20, 3, 3);
  // your door, held open by the binder
  oR(100, 28, 30, 72, 3); oR(103, 31, 24, 66, 0); oDots(103, 31, 24, 66, 1, 3);
  const ang = 2 + (((t >> 5) % 5) === 4 ? 4 : 0); oR(103, 31, ang, 66, 2); // it keeps trying to close
  oR(104, 92, 16, 6, 3); oR(106, 93, 12, 1, 0); oR(106, 95, 12, 1, 0);
  oR(108, 16, 14, 10, 3); oText('3', 112, 18, 0);
  // stairs down
  oR(148, 28, 44, 72, 2); oR(151, 31, 38, 66, 0);
  for (let i = 0; i < 7; i++) oR(153 + i * 4, 52 + i * 7, 34 - i * 4, 2, 2);
  oR(158, 20, 12, 8, 3); oText('B', 162, 21, 0);
}

// ---------- workshop ----------
const GLYPHS = ['EARTH', 'SALT', 'BRIDGE', 'SEAL'];
function oGlyph(name, cx, cy, c) {
  if (name === 'EARTH') { oR(cx - 4, cy + 2, 9, 1, c); oR(cx, cy - 4, 1, 7, c); oR(cx - 2, cy + 4, 5, 1, c); }
  else if (name === 'SALT') { oR(cx - 3, cy - 3, 7, 1, c); oR(cx - 3, cy + 3, 7, 1, c); oR(cx - 3, cy - 3, 1, 7, c); oR(cx + 3, cy - 3, 1, 7, c); oP(cx, cy, c); }
  else if (name === 'BRIDGE') { for (let i = -4; i <= 4; i++) oP(cx + i, cy + 2 - Math.round(Math.sqrt(Math.max(0, 16 - i * i)) * .8), c); oR(cx - 4, cy + 2, 1, 3, c); oR(cx + 4, cy + 2, 1, 3, c); }
  else if (name === 'SEAL') { for (let a = 0; a < 16; a++) oP(cx + Math.round(Math.cos(a / 16 * 6.283) * 4), cy + Math.round(Math.sin(a / 16 * 6.283) * 4), c); oP(cx, cy, c); }
}
const STATION = [[94, 103], [140, 119], [94, 133], [48, 119]];
function drawShop(t, pk = 'shop') {
  setPal(pk); const f = OS.flags;
  oR(0, 0, VW, VH, 0); oDots(0, 0, VW, 100, 1, 4); oR(0, 100, VW, 3, 2); oDots(0, 103, VW, 37, 1, 5);
  // whiteboard: the old order struck out, the new order, and SOUL? circled over and over
  oR(6, 8, 74, 52, 3); oR(8, 10, 70, 48, 0);
  const row = (y, labels, c) => labels.forEach((l, i) => { oFrame(10 + i * 17, y, 15, 9, c); oText(l, 12 + i * 17, y + 1, c); });
  row(14, ['PW', 'LK', 'ME', 'OU'], 1); oR(10, 18, 66, 1, 1);
  row(28, ['PW', 'ME', 'LK', 'OU'], 3);
  oText('SOUL?', 12, 46, 3); for (let i = 0; i < 3; i++) oFrame(10 - i, 43 - i, 36 + i * 2, 12 + i * 2, 2);
  if (f.nameOnBoard) oText('+ MAG.', 44, 49, 2);
  // boiler
  oR(4, 62, 34, 40, 2); oR(8, 58, 8, 6, 2); for (let i = 0; i < 4; i++) { oP(10 + i * 7, 70, 3); oP(10 + i * 7, 90, 3); }
  oR(14, 76, 10, 8, 0); oFrame(14, 76, 10, 8, 3); oR(8, 98, 26, 4, 1);
  // the machine
  oR(86, 16, 48, 86, 1); oFrame(86, 16, 48, 86, 2); oFrame(88, 18, 44, 82, 1);
  for (const cx of [101, 119]) { oCirc(cx, 36, 10, 2); oCirc(cx, 36, 8, 0); const a = (t * .05) % 6.283; for (let k = 0; k < 3; k++) oLine(cx, 36, cx + Math.cos(a + k * 2.094) * 8, 36 + Math.sin(a + k * 2.094) * 8, 3); }
  oR(94, 56, 32, 22, 3); oR(96, 58, 28, 18, 0);
  if (f.circleOk) { oText('CHK', 98, 60, 3); oR(120, 60, 3, 7, 0); oText('4097', 98, 69, 2); oR(113, 58, 10, 9, 0); oText('OK', 111, 60, 3); } else if (f.ringOff) oText('LINK?', 98, 60, 3); else { oText('CHK', 98, 60, 3); oText('4096', 98, 69, ((t >> 5) & 1) ? 3 : 2); }
  for (let i = 0; i < 5; i++) { oR(94, 82 + i * 3, 32, 1, 2); oP(95 + ((t >> 3) + i * 5) % 30, 82 + i * 3, 3); }
  if (!f.ringOff) { oCirc(134, 80, 6, 3); oCirc(134, 80, 4, 1); oR(128, 78, 5, 4, 2); } else { oR(128, 78, 5, 4, 2); }
  // Yoko's screen
  oR(138, 18, 36, 30, 2); oR(140, 20, 32, 26, 0); oR(147, 24, 16, 5, 1); oR(145, 27, 3, 14, 1); oR(162, 27, 3, 14, 1); oR(148, 28, 14, 14, 3);
  const yb = (t % 170) < 5; oR(151, 33, 3, yb ? 1 : 2, 0); oR(158, 33, 3, yb ? 1 : 2, 0); oR(153, 39, 6, 1, 2); oR(166, 24, 4, 4, 2);
  // the magician (draw him once he is in the room)
  const oy = 50 + ((t >> 5) & 1);
  oR(150, oy, 10, 8, 2); oR(150, oy + 6, 10, 2, 1); oR(146, oy + 8, 18, 2, 2);
  oR(150, oy + 10, 10, 9, 3); oR(152, oy + 13, 2, 2, 0); oR(157, oy + 13, 2, 2, 0); oR(152, oy + 16, 7, 1, 1);
  oR(146, oy + 19, 18, 81 - oy, 1); oFrame(146, oy + 19, 18, 81 - oy, 2); oR(154, oy + 19, 2, 81 - oy, 2);
  oR(148, 100, 6, 3, 2); oR(158, 100, 6, 3, 2);
  // bench + notebook, stairs up
  oR(170, 90, 24, 3, 2); oR(172, 93, 3, 10, 2); oR(189, 93, 3, 10, 2); if (!f.noteRead) oR(176, 85, 12, 5, 3); else oR(176, 85, 12, 5, 2);
  oR(176, 54, 18, 34, 2); oR(178, 56, 14, 30, 0); for (let i = 0; i < 4; i++) oR(180, 62 + i * 6, 10, 1, 1);
  // the chalk circle
  for (let a = 0; a < 90; a++) { const r = a / 90 * 6.2832; oP(Math.round(94 + Math.cos(r) * 52), Math.round(119 + Math.sin(r) * 17), f.circleOk ? 3 : 2); }
  OS.circle.forEach((g, i) => { const [sx, sy] = STATION[i]; oR(sx - 6, sy - 6, 13, 13, 0); oFrame(sx - 6, sy - 6, 13, 13, f.circleOk ? 3 : 1); oGlyph(g, sx, sy, f.circleOk ? 3 : 2); });
  if (f.circleOk && ((t >> 3) & 3) === 0) for (let i = 0; i < 4; i++) oP(STATION[i][0] + ((t >> 3) & 7) - 3, STATION[i][1] - 9, 3);
}

// ---------- portraits (48x48, 3 colors + black) ----------
function mkPort(kind) {
  const P = [0, hex('#00dbdb'), hex('#db49db'), hex('#ffffff'), hex('#000000')];
  const face = (g, o = {}) => {
    g.e(24, 47, 20, 12, 2); g.r(20, 34, 8, 8, 3); g.e(24, 22, 11, 14, 3);
    g.r(14 + (o.eyeDx || 0), 19, 9, 1, 4); g.r(26 + (o.eyeDx || 0), 19, 9, 1, 4);
  };
  const s = spr(48, 48, g => {
    if (kind === 'FACE') {
      face(g); g.r(12, 12, 4, 14, 1); g.r(34, 12, 4, 14, 1); g.r(15, 8, 20, 2, 1); g.r(17, 6, 14, 2, 1);
      for (const x0 of [15, 26]) { g.r(x0, 20, 9, 1, 1); g.r(x0, 27, 9, 1, 1); g.r(x0, 20, 1, 8, 1); g.r(x0 + 8, 20, 1, 8, 1); }
      g.r(24, 22, 2, 1, 1); g.p(19, 24, 4); g.p(30, 24, 4); g.r(23, 28, 2, 2, 2); g.r(20, 32, 8, 1, 4); g.p(14, 30, 2); g.p(34, 30, 2); g.r(18, 40, 12, 2, 3); g.r(23, 42, 2, 6, 1);
    } else if (kind === 'MAGICIAN') {
      face(g, { eyeDx: 0 }); g.r(14, 0, 20, 11, 2); g.r(14, 8, 20, 3, 1); g.r(7, 11, 34, 3, 2);
      g.p(19, 24, 4); g.p(30, 24, 4); g.r(25, 17, 9, 1, 3); g.r(17, 29, 14, 2, 1); g.p(16, 30, 1); g.p(32, 30, 1); g.r(21, 33, 6, 1, 4);
      g.r(8, 40, 32, 8, 2); g.r(10, 38, 28, 2, 1); g.r(21, 36, 6, 5, 3);
    } else if (kind === 'MIMI') {
      g.e(24, 21, 18, 19, 2); g.e(7, 32, 5, 13, 2); g.e(41, 32, 5, 13, 2); g.e(24, 25, 11, 13, 3); g.r(12, 10, 24, 7, 2);
      g.e(19, 26, 3, 4, 1); g.e(29, 26, 3, 4, 1); g.p(19, 27, 4); g.p(29, 27, 4); g.r(21, 33, 6, 1, 2); g.p(20, 32, 2); g.p(27, 32, 2); g.r(20, 40, 8, 8, 3); g.r(15, 44, 18, 4, 1);
      for (let y = 0; y < 48; y += 3) for (let x = 0; x < 48; x++) g.p(x, y, 0);
    } else if (kind === 'YOKO') {
      g.e(24, 22, 15, 18, 2); g.r(9, 22, 6, 24, 2); g.r(33, 22, 6, 24, 2); face(g); g.e(24, 22, 11, 14, 3); g.r(14, 8, 20, 6, 2);
      g.r(16, 19, 6, 1, 4); g.r(28, 19, 6, 1, 4); g.p(19, 24, 4); g.p(30, 24, 4); g.r(22, 32, 4, 1, 4); g.r(34, 8, 5, 5, 1); g.r(8, 8, 5, 5, 1);
    } else if (kind === 'GHOST') {
      g.e(24, 20, 16, 17, 3); g.r(8, 20, 33, 28, 3); for (let i = 0; i < 6; i++) g.r(8 + i * 6, 44 + (i & 1) * 3, 6, 4, 3);
      g.e(18, 22, 3, 5, 4); g.e(30, 22, 3, 5, 4); g.e(24, 33, 4, 3, 4); g.r(14, 4, 20, 2, 2); g.r(16, 0, 16, 5, 2);
    } else if (kind === 'LINDA') {
      g.r(9, 6, 30, 24, 2); g.e(24, 24, 10, 12, 3); g.r(11, 22, 4, 12, 2); g.r(33, 22, 4, 12, 2); g.r(14, 18, 8, 1, 4); g.r(26, 18, 8, 1, 4);
      g.p(19, 22, 4); g.p(30, 22, 4); g.r(20, 31, 9, 1, 4); g.r(19, 30, 1, 1, 4); g.r(29, 30, 1, 1, 4); g.r(4, 38, 40, 10, 1); g.r(20, 36, 8, 12, 3);
    } else { // MEMORY: the first working copy of him, behind glass
      g.r(3, 4, 42, 38, 2); g.r(6, 7, 36, 32, 4); for (let y = 8; y < 38; y += 3) g.r(6, y, 36, 1, 1);
      g.r(14, 14, 7, 9, 1); g.r(27, 14, 7, 9, 1); g.r(14, 29, 20, 2, 1); g.r(18, 42, 12, 4, 2);
    }
  });
  return { s, P };
}

// ---------- Act II workshop: the trunk, the three openings, the Curse ----------
function drawShop2(t) {
  const f = OS.flags; drawShop(t, f.curse ? 'curse' : 'shop');
  oR(4, 108, 34, 22, 2); oR(4, 108, 34, 3, 3); oR(4, 118, 34, 2, 3); oR(18, 113, 6, 6, 3); oR(20, 115, 2, 2, 0);
  oR(44, 70, 16, 12, 2); for (let i = 0; i < 4; i++) oR(46, 72 + i * 3, 12, 1, 0);          // the flue
  oLine(134, 22, 192, 4, 3); oLine(134, 23, 192, 5, 3);                                      // the speaker cable
  if (f.sealBell) { oR(182, 44, 2, 2, 3); oR(180, 46, 6, 4, 3); oR(181, 50, 4, 1, 3); }
  if (f.sealSalt) for (let i = 0; i < 16; i++) { oP(43 + i, 84, 3); if (i & 1) oP(43 + i, 85, 3); }
  if (f.sealKey) { oR(164, 11, 4, 4, 3); oR(165, 12, 2, 2, 0); oR(168, 12, 6, 1, 3); oR(172, 13, 1, 3, 3); oR(170, 13, 1, 2, 3); }
  if (f.curse && t % 9) { // a sheet hung on a nail, with his glasses: see-through (dithered), hollow eyes, mouth open
    const x = 94 + Math.round(Math.sin(t / 20) * 10), y = 40 + Math.round(Math.sin(t / 15) * 4), h = 70;
    for (let j = 0; j < h; j++) { const w = j < 14 ? Math.round(Math.sqrt(14 * 14 - (14 - j) * (14 - j))) : 14 + (j > 56 ? ((j + (t >> 2)) % 3) : 0); for (let i = -w; i <= w; i++) if (((i + j) & 1) === 0) oP(x + i, y + j, 3); }
    oFrame(x - 11, y + 12, 9, 10, 2); oFrame(x + 2, y + 12, 9, 10, 2); oR(x - 9, y + 14, 5, 7, 0); oR(x + 4, y + 14, 5, 7, 0); oR(x - 3, y + 28, 7, 12, 0); oR(x - 1, y + 17, 3, 1, 2);
  }
}

// ---------- Act III ----------
function drawShop3(t) {
  const f = OS.flags; drawShop2(t);
  if (f.mimiAtDoor && !f.working) { oR(176, 86, 18, 2, 3); if ((t >> 5) & 1) oR(180, 86, 2, 2, 0); else oR(186, 86, 2, 2, 0); }
  if (f.working) { const k = (t >> 2) & 3; for (let i = 0; i < 4; i++) oP(STATION[1][0] - 10 + i * 4 + k, STATION[1][1] - 12 - k, 3); }
}
function drawComfort(t) {
  const f = OS.flags; setPal(f.maint ? 'shop' : 'dream'); const lt = t % 240;
  oR(0, 0, VW, VH, 0); oDots(0, 0, VW, 98, 1, f.maint ? 4 : 7); oR(0, 98, VW, 3, 2);
  for (let y = 101; y < VH; y += 7) oR(0, y, VW, 1, 1);
  oR(8, 10, 60, 48, 3); oR(11, 13, 54, 42, 1); oR(37, 13, 2, 42, 3); oR(11, 33, 54, 2, 3);
  const bx = (lt * 44 / 240) | 0; oR(12 + bx, 26 + (bx & 4 ? 1 : 0), 3, 1, 3);
  oR(80, 10, 50, 3, 2); for (let i = 0; i < 6; i++) oR(82 + i * 8, 13, 5, 5 + (i % 3), i & 1 ? 3 : 2); // a shelf of identical cups
  // the woman in the chair: waves every 4 seconds, forever
  oR(30, 74, 30, 28, 2); oR(30, 74, 6, 28, 3); oR(34, 62, 10, 18, 1); oCirc(41, 56, 6, 3); oR(38, 55, 2, 2, 0); oR(43, 55, 2, 2, 0); oR(39, 59, 5, 1, 2);
  oR(46, 66 - ((lt >= 120) ? 4 : 0), 8, 2, 3);
  // little table, her cup (full at 0, "hot" at 120, full again at 240), steam
  oR(70, 86, 26, 3, 2); oR(74, 89, 3, 12, 2); oR(90, 89, 3, 12, 2); oR(78, 78, 8, 8, 3); oR(79, 79, 6, 6, 0); if (!f.maint || lt < 120) oR(79, 80, 6, 4, 2); for (let i = 0; i < 3; i++) oP(80 + i * 2, 74 - ((lt >> 3) + i) % 4, 3);
  // kettle on the counter
  oR(110, 70, 40, 30, 2); oR(108, 68, 44, 3, 3); oR(120, 54, 12, 14, 3); oR(130, 56, 5, 2, 3); oR(121, 58, 3, 6, 0); if (f.kettleOn) for (let i = 0; i < 3; i++) oP(124 + i * 3, 50 - ((t >> 3) + i) % 6, 3);
  // the door: painted on the wall until the seam opens
  if (f.seam) { oR(158, 22, 34, 80, 3); oR(160, 24, 30, 76, 0); oDots(160, 24, 30, 76, 2, 2); oR(184, 62, 3, 8, 3); }
  else { oFrame(160, 24, 30, 76, 1); oFrame(164, 30, 22, 28, 1); oR(184, 62, 3, 3, 1); }
  if (f.maint) { oText('LOOP 240', 4, 2, 3); oText('F ' + lt, 70, 2, 2); oText('SEAM', 160, 14, 2); oR(160, 24, 30, 1, 2); }
}
function drawAir(t) {
  const f = OS.flags; setPal('air'); oR(0, 0, VW, VH, 0); oDots(0, 0, VW, 100, 1, 5);
  oR(10, 14, 36, 26, 1); oFrame(10, 14, 36, 26, 3); oR(14, 18, 12, 4, 2); oR(14, 26, 26, 2, 3); oR(14, 31, 18, 2, 3); // a poster
  oR(150, 14, 36, 26, 1); oFrame(150, 14, 36, 26, 3); oR(160, 18, 14, 14, 2); oR(166, 22, 14, 14, 3);
  if ((t >> 5) & 1) oR(72, 6, 52, 12, 2); else oR(72, 6, 52, 12, 1); oText('ON AIR', 83, 9, 3);
  oR(0, 100, VW, 2, 1); for (let y = 106; y < VH; y += 8) oR(0, y, VW, 1, 1);
  oR(60, 88, 76, 6, 1); oR(66, 94, 6, 40, 1); oR(124, 94, 6, 40, 1); oR(78, 56, 40, 30, 3); oR(80, 58, 36, 26, 0);
  for (let i = 0; i < 4; i++) { oR(83, 62 + i * 6, 6 + ((i * 7 + (t >> 4)) % 18), 2, 2); oR(83 + 24 - (i * 3 % 8), 63 + i * 6, 3, 1, 3); }
  oCirc(98, 46, 3, 3); oR(97, 38, 2, 6, 3);
  if (f.ghostHere) { const y = Math.min(50, (f.ghostT = (f.ghostT || 0) + 1) * 1.2 - 20) | 0; oCirc(160, y + 10, 12, 3); oR(148, y + 10, 25, 24, 3); for (let i = 0; i < 5; i++) oR(148 + i * 5, y + 34 + (i & 1) * 3, 5, 4, 3); oR(154, y + 8, 4, 6, 0); oR(163, y + 8, 4, 6, 0); oR(158, y + 19, 5, 3, 0); }
}
