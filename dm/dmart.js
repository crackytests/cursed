'use strict';
// ================= DARK MONDAY: art. portraits and the shared palette =================
// The house style: dark glass forms cut from flat facets, lit by a magenta rim on the left and a cyan rim on the right, standing on an
// airbrushed backdrop (gradient, rays, a grid horizon) inside a neon ID-card frame. Think 80s sword-and-sorcery paperback printed on a monitor.
const PW = 96, PH = 112;
const K = {
  ink: hex('#120c1c'), mag: hex('#ff3cc8'), cyan: hex('#3ccaff'), amber: hex('#ffb040'), red: hex('#ff3030'),
  orange: ['#6a2410', '#b44a18', '#ee8624', '#ffb258'].map(hex), cream: ['#8a7466', '#cdb9a6', '#f4e6d0', '#fff8ea'].map(hex),
  hat: ['#2c2c3c', '#555568', '#8a8a9c', '#b4b4c4'].map(hex), coat: ['#4a3826', '#7a5e40', '#a88860', '#cdb088'].map(hex),
  steel: ['#1c2438', '#38465c', '#6a7c96', '#a8b8d0'].map(hex), skin: ['#6a3a3a', '#a86a5a', '#d49a82', '#f2c8aa'].map(hex),
  hair: ['#08060c', '#1c1830', '#34305a'].map(hex), white: ['#6a7490', '#aab4d0', '#e0e8f8', '#ffffff'].map(hex),
  alien: ['#103a28', '#1e7a48', '#42b878', '#8ee8b0'].map(hex), cap: ['#06060c', '#16162a', '#2a2a48', '#46466c'].map(hex),
  pink: ['#8a1e5a', '#e0408c', '#ff78b4', '#ffc0dc'].map(hex), pale: ['#a8788a', '#e0b0b4', '#f8d8d0', '#fff0ea'].map(hex),
  suit: ['#08080e', '#1a1a28', '#303046', '#4c4c68'].map(hex), gold: ['#7a5a10', '#c89a20', '#ffd040', '#fff090'].map(hex),
  green: hex('#70ff30'), hair2: ['#0a0614', '#1c1030', '#34205a', '#4e3482'].map(hex), blueskin: ['#6a4a52', '#b08478', '#e0b49c', '#f8d8c0'].map(hex),
  navy: ['#060820', '#0c1444', '#18286c', '#2c48a0'].map(hex), ice: hex('#80e8ff'), sheet: ['#6a6aa0', '#a8a8d8', '#e0e0ff', '#ffffff'].map(hex),
  kid: ['#5a4038', '#a07a68', '#d8ae92', '#f6d8c0'].map(hex), sail: ['#34486a', '#587098', '#8aa4c4', '#b8cce0'].map(hex), brown: ['#2a1608', '#5c3a1c', '#8c5e30', '#b88a50'].map(hex),
  px: ['#3a2410', '#7a5030', '#a87a50', '#d0a478'].map(hex), teal: ['#386a70', '#68a4a8', '#a0d0d0', '#d8f0ee'].map(hex), purp: ['#14102a', '#2c2450', '#463c78', '#6a5ca0'].map(hex),
};
// 1px dark outline around every opaque pixel of a buffer (used by the monsters and item icons)
function outlineBuf(b, c = K.ink) {
  const d = b.d.slice();
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) { if (b.d[y * b.w + x]) continue;
    const o = (xx, yy) => xx >= 0 && yy >= 0 && xx < b.w && yy < b.h && b.d[yy * b.w + xx];
    if (o(x - 1, y) || o(x + 1, y) || o(x, y - 1) || o(x, y + 1)) d[y * b.w + x] = c; }
  b.d = d; return b;
}
function darkenEll(cx, cy, rx, ry, k) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy > 1) continue; const p = pget(x, y); if (!p) continue; const [r, g, b] = chan(p); pset(x, y, rgb(r * k, g * k, b * k)); } }
// a glow that only lights pixels that are already drawn, for sprites (the plain glow would paint boxes onto transparent areas)
function sglow(cx, cy, r, c, a = 1) { const [cr, cg, cb] = chan(c); for (let y = Math.max(0, Math.floor(cy - r)); y < Math.min(FH, cy + r); y++) for (let x = Math.max(0, Math.floor(cx - r)); x < Math.min(FW, cx + r); x++) { const d = Math.hypot(x - cx, y - cy) / r; if (d >= 1) continue; const p = FB[y * FW + x]; if (!p) continue; const k = (1 - d) * (1 - d) * a, [pr, pg, pb] = chan(p); FB[y * FW + x] = rgb(pr + cr * k, pg + cg * k, pb + cb * k); } }
const RIM = { rimL: K.mag, rimR: K.cyan };

// ---------- the facet toolkit ----------
const SHADE_A = hex('#1a0838'), SHADE_B = hex('#2a1458');
const ramp = c => [mix(c, SHADE_A, .74), mix(c, SHADE_B, .46), c, mix(c, WHITE, .38)];            // dark .. light, shadows drift to violet like airbrushed paperback art
const area = p => { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
function rimEdges(p, o = {}) { // light the edges that face the light: magenta on the left, cyan on the right, a pale glint on top
  const S = area(p), lc = o.l || K.mag, rc = o.r || K.cyan;
  for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy); if (len < 3) continue;
    let nx = dy / len, ny = -dx / len; if (S <= 0) { nx = -nx; ny = -ny; }
    if (ny < -.8) lineF(a[0], a[1], b[0], b[1], o.top || mix(WHITE, K.cyan, .35)); else if (nx < -.35) lineF(a[0], a[1], b[0], b[1], lc); else if (nx > .35) lineF(a[0], a[1], b[0], b[1], rc); }
}
function F(p, c, o) { polyF(p, c); if (!(o && o.rim === 0)) rimEdges(p, o); }
const Ln = (a, b, c, th = 1) => lineF(a[0], a[1], b[0], b[1], c, th);
function bgCard(top, bot, accent, o = {}) { // airbrush gradient, rays, a grid horizon and a halo behind the head
  top = hex(top); bot = hex(bot); const cy = o.cy || 70, hz = o.hz || 88; gradV(0, 0, PW, PH, top, bot, 12);
  for (let i = 0; i <= 12; i++) { const a = Math.PI + i * Math.PI / 12, x2 = 48 + Math.cos(a) * 140, y2 = cy + Math.sin(a) * 140; lineF(48, cy, x2, y2, mix(accent, bot, i & 1 ? .8 : .88)); }
  rectF(0, hz, PW, PH - hz, mix(bot, BLACK, .55));
  for (let i = -8; i <= 8; i++) lineF(48, hz, 48 + i * 22, PH, mix(accent, bot, .62));
  for (let k = 0; k < 5; k++) rectF(0, hz + Math.round(Math.pow((k + .5) / 5, 2) * (PH - hz)), PW, 1, mix(accent, bot, .66));
  glow(48, cy - 24, 48, accent, o.halo === undefined ? .42 : o.halo);
  for (let i = 0; i < 16; i++) { const x = hash(i, 3, 7) * PW, y = hash(i, 4, 7) * (hz - 16); if (!(o.noStars)) pset(x, y, i % 4 ? mix(accent, WHITE, .3) : WHITE); }
}
function cardFrame(a1, a2) {
  frameR(0, 0, PW, PH, hex(a1)); frameR(1, 1, PW - 2, PH - 2, hex(a2));
  for (const [x, y, sx, sy] of [[2, 2, 1, 1], [PW - 3, 2, -1, 1], [2, PH - 3, 1, -1], [PW - 3, PH - 3, -1, -1]]) { lineF(x, y, x + sx * 8, y, WHITE); lineF(x, y, x, y + sy * 8, WHITE); }
}
function slit(cx, cy, w, h, col, tilt = 0, o = {}) { // a glowing almond eye
  F([[cx - w, cy + tilt], [cx - w * .2, cy - h], [cx + w, cy - tilt], [cx, cy + h * .7]], o.fill || BLACK, { rim: 0 });
  lineF(cx - w, cy + tilt, cx - w * .2, cy - h, col); lineF(cx - w * .2, cy - h, cx + w, cy - tilt, col); lineF(cx - w, cy + tilt, cx, cy + h * .7, mix(col, BLACK, .4)); lineF(cx, cy + h * .7, cx + w, cy - tilt, mix(col, BLACK, .4));
  if (o.iris) { ellF(cx + (o.ix || 0), cy, w * .32, h * .55, o.iris); pset(cx + (o.ix || 0) - 1, cy - 1, WHITE); }
  glow(cx, cy, w * 1.5, col, o.g === undefined ? .3 : o.g);
}
function mouthP(cx, y, talk, c, w = 5, lip) {
  if (talk) F([[cx - w, y], [cx + w, y], [cx + w - 2, y + 2 + talk * 2], [cx - w + 2, y + 2 + talk * 2]], c, { rim: 0 });
  else { lineF(cx - w, y, cx + w, y, c, 1); if (lip) lineF(cx - w + 1, y - 1, cx + w - 1, y - 1, lip); }
}
function shadeSide(p, c, w = 10) { // a crescent of shadow hugging the right edge of a silhouette
  const R = p.filter(q => q[0] > 49), top = Math.min(...p.map(q => q[1])), bot = Math.max(...p.map(q => q[1])), path = [[48, top + 2]].concat(R, [[48, bot]]);
  const inner = path.map((q, i) => [Math.max(48, q[0] - w * Math.sin(Math.PI * i / (path.length - 1))), q[1]]).reverse(); polyF(path.concat(inner), c);
}
const HEAD = [[30, 22], [66, 22], [71, 38], [67, 58], [58, 72], [48, 79], [38, 72], [29, 58], [25, 38]];     // a generic head silhouette
const HEAD_R = [[48, 22], [66, 22], [71, 38], [67, 58], [58, 72], [48, 79]];                                   // its shaded half
function head(sk, o = {}) { F(HEAD, sk[2], { top: sk[3] }); shadeSide(HEAD, sk[1]); if (o.cheek !== false) { polyF([[30, 46], [40, 50], [38, 62], [31, 58]], sk[3]); } }
function nose(sk) { polyF([[47, 44], [51, 44], [55, 58], [44, 59]], sk[1]); lineF(46, 46, 44, 58, sk[3]); }
function neck(sk, y = 74) { F([[38, y], [58, y], [60, 92], [36, 92]], sk[0], { rim: 0 }); }

// ---------- the party ----------
// CARL: a visibly alien delivery driver. green, big black eyes, black baseball cap, a gold bow tie
function carlPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#44c486')), su = ramp(hex('#2a2a40')), cap = ramp(hex('#1c1c34'));
  return offscreen(PW, PH, () => {
    bgCard('#04201c', '#0c6a50', K.cyan);
    F([[0, 112], [5, 98], [24, 88], [48, 94], [72, 88], [91, 98], [96, 112]], su[1]); polyF([[0, 112], [5, 98], [24, 88], [34, 112]], su[2]); polyF([[48, 94], [72, 88], [91, 98], [96, 112], [60, 112]], su[0]);
    neck(sk, 74);
    F([[44, 94], [52, 94], [60, 104], [36, 104]], hex('#ffd040')); polyF([[48, 94], [60, 104], [48, 106]], hex('#c89a20')); F([[44, 96], [52, 96], [52, 102], [44, 102]], hex('#7a5a10'), { rim: 0 });
    { const H = [[32, 20], [64, 20], [70, 38], [66, 60], [57, 74], [48, 80], [39, 74], [30, 60], [26, 38]]; F(H, sk[2], { top: sk[3] }); shadeSide(H, sk[1]); polyF([[30, 46], [38, 52], [37, 64], [31, 58]], sk[3]); }
    slit(37, 51, 11, 8, K.cyan, 3, { iris: hex('#0a2a3a') }); slit(59, 51, 11, 8, K.cyan, -3, { iris: hex('#0a2a3a') });
    polyF([[44, 64], [52, 64], [50, 68], [46, 68]], sk[1]); mouthP(48, 73, talk, sk[0], 6);
    F([[22, 36], [24, 22], [36, 12], [60, 12], [72, 22], [74, 36]], cap[2], { top: cap[3] }); shadeSide([[22, 36], [24, 22], [36, 12], [60, 12], [72, 22], [74, 36]], cap[1], 16); lineF(48, 12, 48, 36, cap[1]);
    F([[24, 36], [72, 36], [78, 41], [18, 41]], cap[1]); lineF(20, 40, 76, 40, K.cyan); F([[44, 20], [52, 20], [52, 28], [44, 28]], hex('#ffd040'), { rim: 0 }); pset(48, 24, WHITE);
    cardFrame('#3ce0c0', '#1a8a6a');
  });
}
// CEO LINDA: swept pink hair and a high ponytail, a black-and-pink striped uniform with a tall collar
function lindaPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#f2cdc4')), hr = ramp(hex('#ff5aa8')), su = ramp(hex('#20202e'));
  return offscreen(PW, PH, () => {
    bgCard('#200a30', '#8a1a68', K.mag);
    F([[0, 112], [5, 96], [26, 86], [70, 86], [91, 96], [96, 112]], su[1]); for (let x = 12; x < 92; x += 8) lineF(48 + (x - 48) * .5, 90, x, 112, hr[1]); polyF([[0, 112], [5, 96], [26, 86], [30, 112]], su[2]);
    F([[18, 20], [8, 38], [6, 66], [16, 86], [26, 66], [26, 36]], hr[1]); F([[66, 14], [86, 22], [90, 50], [80, 74], [70, 52]], hr[0]); // ponytail loops behind
    neck(sk, 72); F([[32, 76], [40, 66], [56, 66], [64, 76], [62, 94], [34, 94]], su[0]); lineF(34, 76, 40, 66, K.mag); lineF(64, 76, 56, 66, K.cyan);
    F([[40, 86], [50, 90], [46, 100], [38, 98]], hr[2]); F([[56, 86], [46, 90], [50, 100], [58, 98]], hr[1]); F([[44, 88], [50, 88], [50, 96], [44, 96]], hr[3], { rim: 0 });
    head(sk, {}); nose(sk);
    F([[22, 40], [26, 14], [44, 4], [66, 8], [76, 28], [72, 44], [66, 30], [50, 24], [36, 32], [30, 56]], hr[2], { top: hr[3] }); polyF([[48, 24], [66, 30], [72, 44], [76, 28], [66, 8], [52, 6]], hr[1]); lineF(36, 12, 34, 30, hr[3]); lineF(44, 8, 42, 24, hr[3]);
    slit(38, 50, 9, 5, hex('#ff78c8'), 2, { iris: hex('#ff3c9a') }); slit(58, 50, 9, 5, hex('#ff78c8'), -2, { iris: hex('#ff3c9a') });
    lineF(28, 44, 46, 47, hr[0], 2); lineF(70, 44, 50, 47, hr[0], 2);
    mouthP(48, 70, talk, hex('#a01868'), 5, hex('#ff5aa8'));
    cardFrame('#ff5ac8', '#9a1a78');
  });
}
// SPOOKY GHOST: a sheet, a neon visor, a bow tie
function ghostPortrait(mood = 'n', talk = 0) {
  const sh = ramp(hex('#d8d8ff'));
  return offscreen(PW, PH, () => {
    bgCard('#160a34', '#4a2a9a', hex('#c8a0ff'));
    F([[20, 34], [34, 10], [48, 6], [62, 10], [76, 34], [84, 70], [92, 112], [4, 112], [12, 70]], sh[2], { top: WHITE });
    polyF([[48, 6], [62, 10], [76, 34], [84, 70], [92, 112], [60, 112], [56, 70]], sh[1]); polyF([[34, 10], [48, 6], [40, 40], [28, 38]], sh[3]);
    for (const [a, b] of [[[20, 80], [12, 112]], [[36, 84], [30, 112]], [[62, 84], [68, 112]], [[78, 80], [84, 112]]]) { lineF(a[0], a[1], b[0], b[1], sh[1]); lineF(a[0] + 1, a[1], b[0] + 1, b[1], sh[3]); }
    F([[22, 46], [74, 46], [72, 60], [60, 66], [48, 60], [36, 66], [24, 60]], hex('#08061a'), { rim: 0 }); lineF(22, 46, 74, 46, K.cyan, 2); lineF(24, 60, 36, 66, K.mag); lineF(72, 60, 60, 66, K.cyan); glow(48, 54, 36, K.cyan, .25);
    lineF(30, 52, 42, 52, hex('#6a8aff')); lineF(54, 52, 66, 52, hex('#6a8aff'));
    mouthP(48, 78, talk, hex('#ff4aa0'), 6, null); lineF(40, 76, 43, 79, hex('#ff4aa0')); lineF(56, 76, 53, 79, hex('#ff4aa0'));
    F([[34, 98], [46, 104], [34, 112]], hex('#ff3cc8')); F([[62, 98], [50, 104], [62, 112]], hex('#ff78e0')); F([[44, 100], [52, 100], [52, 108], [44, 108]], hex('#8a1a68'), { rim: 0 });
    cardFrame('#c8a0ff', '#6a3ac0');
  });
}
// JB GARFIELD: an orange cat in a grey fedora and a torn trench coat, half-lidded and sure he is the coolest one here
function jbPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#ee8a2c')), cr = ramp(hex('#f0e0c8')), co = ramp(hex('#a88860')), ha = ramp(hex('#7a7a90'));
  return offscreen(PW, PH, () => {
    bgCard('#2a0c1c', '#d8603a', hex('#ffb040'), { hz: 90 });
    F([[0, 112], [6, 96], [24, 86], [48, 98], [72, 86], [90, 96], [96, 112]], co[1]); polyF([[0, 112], [6, 96], [24, 86], [34, 112]], co[2]); polyF([[48, 98], [72, 86], [90, 96], [96, 112], [62, 112]], co[0]);
    F([[34, 86], [48, 98], [62, 86], [58, 112], [38, 112]], hex('#e8e0f0'), { rim: 0 }); F([[45, 94], [51, 94], [53, 112], [43, 112]], hex('#14101c'), { rim: 0 });
    { const H = [[24, 28], [66, 28], [76, 44], [72, 62], [60, 74], [48, 80], [36, 74], [24, 62], [20, 44]]; F(H, sk[2], { top: sk[3] }); shadeSide(H, sk[1], 15); }
    F([[26, 30], [20, 14], [34, 24]], sk[2]); F([[70, 30], [76, 14], [62, 24]], sk[1]);
    F([[34, 62], [48, 58], [62, 62], [58, 76], [48, 80], [38, 76]], cr[2], { rim: 0 }); shadeSide([[48, 58], [62, 62], [58, 76], [48, 80]], cr[1], 8); F([[44, 60], [52, 60], [48, 66]], hex('#1c1424'), { rim: 0 });
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) lineF(48 + sx * 10, 68 + i * 2, 48 + sx * 26, 64 + i * 4, i === 1 ? WHITE : mix(WHITE, K.cyan, .4));
    for (const sx of [-1, 1]) { const cx = 48 + sx * 12; F([[cx - 8, 48], [cx, 44], [cx + 8, 48], [cx, 53]], hex('#f4f0e0'), { rim: 0 }); ellF(cx - sx * 1, 49, 2.4, 2.4, hex('#1c1424')); F([[cx - 9, 42], [cx + 9, 42], [cx + 9, 49 - (sx > 0 ? 0 : 0)], [cx - 9, 49]], ha[0], { rim: 0 }); lineF(cx - 9, 49, cx + 9, 49, hex('#1c1424')); }
    mouthP(48, 78, talk, hex('#1c1424'), 3);
    F([[26, 28], [30, 8], [48, 2], [66, 8], [70, 28]], ha[2], { top: ha[3] }); polyF([[48, 2], [66, 8], [70, 28], [48, 28]], ha[1]); F([[26, 22], [70, 22], [70, 28], [26, 28]], hex('#ff3cc8'), { rim: 0 }); lineF(26, 22, 70, 22, hex('#ff9ae0'));
    F([[10, 34], [86, 34], [92, 40], [4, 40]], ha[1]); lineF(6, 39, 90, 39, K.cyan);
    cardFrame('#ffb040', '#b0481c');
  });
}
// FACE (NEW FACE): a black helmet edged in magenta, narrow green eyes, a third eye, a high collar
function facePortrait(mood = 'n', talk = 0) {
  const bk = ramp(hex('#2a2a3c'));
  return offscreen(PW, PH, () => {
    bgCard('#10041c', '#6a1a7a', K.mag, { halo: .5 });
    F([[0, 112], [6, 96], [22, 86], [30, 70], [40, 94], [58, 94], [66, 70], [74, 86], [90, 96], [96, 112]], bk[1]); polyF([[0, 112], [6, 96], [22, 86], [30, 112]], bk[2]); polyF([[58, 94], [66, 70], [74, 86], [90, 96], [96, 112], [64, 112]], bk[0]);
    F([[34, 70], [62, 70], [58, 100], [38, 100]], bk[0], { rim: 0 }); lineF(34, 70, 38, 100, K.mag); lineF(62, 70, 58, 100, K.cyan); F([[48, 90], [54, 98], [48, 108], [42, 98]], K.mag); F([[48, 94], [51, 98], [48, 103], [45, 98]], hex('#14061c'), { rim: 0 });
    F([[28, 62], [26, 24], [34, 30], [40, 6], [48, 18], [56, 6], [62, 30], [70, 24], [68, 62], [58, 82], [38, 82]], bk[1]); polyF([[48, 18], [56, 6], [62, 30], [70, 24], [68, 62], [58, 82], [48, 82]], bk[0]);
    F([[34, 64], [34, 34], [48, 26], [62, 34], [62, 64], [56, 80], [40, 80]], hex('#0a0a14'), { rim: 0 }); lineF(34, 34, 48, 26, K.mag); lineF(48, 26, 62, 34, K.cyan); lineF(34, 34, 34, 64, hex('#a0208a')); lineF(62, 34, 62, 64, hex('#2090c0'));
    ellF(48, 36, 4, 4, hex('#0a0a14')); ellF(48, 36, 2.4, 2.4, K.green); glow(48, 36, 14, K.green, .55);
    slit(40, 54, 9, 5, K.green, 3, { fill: hex('#06060e') }); slit(56, 54, 9, 5, K.green, -3, { fill: hex('#06060e') });
    lineF(34, 54, 46, 54, hex('#b0ff70')); lineF(50, 54, 62, 54, hex('#b0ff70'));
    if (talk) F([[42, 70], [54, 70], [52, 73 + talk], [44, 73 + talk]], K.green, { rim: 0 }); else lineF(42, 71, 54, 71, K.green);
    cardFrame('#ff5ac8', '#7a1a8a');
  });
}
// YOKO: long dark waves, ice-blue eyes, a galaxy bodice, glyphs drifting behind her
function yokoPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#e8b8a0')), hr = ramp(hex('#4a3a9a'));
  return offscreen(PW, PH, () => {
    bgCard('#04082a', '#1a3a8a', K.ice, { halo: .5, noStars: 0 });
    for (let i = 0; i < 10; i++) { const x = 8 + hash(i, 11) * 80, y = 10 + hash(i, 12) * 60; lineF(x, y, x, y + 4 + hash(i, 13) * 4, K.ice); pset(x + 2, y + 1, K.ice); pset(x - 2, y + 3, K.ice); }
    F([[18, 22], [8, 50], [10, 90], [4, 112], [30, 112], [30, 60]], hr[1]); F([[78, 22], [88, 50], [86, 90], [92, 112], [66, 112], [66, 60]], hr[0]);
    F([[0, 112], [6, 98], [24, 88], [48, 96], [72, 88], [90, 98], [96, 112]], hex('#0c1a5a')); for (let i = 0; i < 40; i++) pset(14 + hash(i, 2) * 68, 92 + hash(i, 3) * 20, i % 4 ? K.ice : WHITE); lineF(48, 94, 48, 112, K.ice);
    neck(sk, 74); F([[40, 82], [56, 82], [58, 94], [38, 94]], hex('#0c1a5a'), { rim: 0 }); ellF(48, 88, 3, 3, K.ice); ellF(48, 88, 1.4, 1.4, WHITE);
    head(sk, {}); nose(sk);
    F([[22, 44], [24, 16], [40, 6], [58, 6], [72, 16], [76, 44], [70, 30], [60, 22], [48, 26], [36, 22], [28, 34]], hr[2], { top: hr[3] }); polyF([[48, 26], [60, 22], [70, 30], [76, 44], [72, 16], [58, 6], [48, 8]], hr[1]); lineF(36, 10, 30, 30, hr[3]); lineF(50, 8, 46, 24, hr[3]); lineF(26, 40, 24, 70, hr[3]);
    slit(38, 51, 9, 5, K.ice, 1, { iris: K.ice, fill: hex('#0a1a4a') }); slit(58, 51, 9, 5, K.ice, -1, { iris: K.ice, fill: hex('#0a1a4a') }); lineF(28, 44, 46, 46, hr[0], 2); lineF(70, 44, 50, 46, hr[0], 2);
    mouthP(48, 70, talk, hex('#b04a6a'), 4, hex('#d0707a'));
    cardFrame('#80e8ff', '#3a4ac0');
  });
}
// PEE KID: a small boy with a bowl cut and a sailor collar, who has a simple, immediate need
function peekidPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#f0c8a8')), hr = ramp(hex('#3a2a6a'));
  return offscreen(PW, PH, () => {
    bgCard('#0a2a3a', '#d8a030', hex('#ffe070'), { cy: 74, hz: 90 });
    F([[0, 112], [6, 98], [26, 90], [48, 102], [70, 90], [90, 98], [96, 112]], hex('#f0f0f8')); F([[26, 90], [48, 108], [70, 90], [78, 112], [18, 112]], hex('#34486a')); polyF([[28, 92], [48, 106], [68, 92], [66, 96], [48, 110], [30, 96]], hex('#e8f0ff')); F([[44, 100], [52, 100], [50, 112], [46, 112]], hex('#8c5e30'), { rim: 0 });
    neck(sk, 76);
    { const H = [[28, 28], [68, 28], [74, 44], [70, 62], [60, 76], [48, 82], [36, 76], [26, 62], [22, 44]]; F(H, sk[2], { top: sk[3] }); shadeSide(H, sk[1], 14); } polyF([[28, 48], [38, 52], [36, 66], [28, 60]], sk[3]);
    F([[20, 46], [22, 20], [40, 8], [58, 8], [76, 20], [78, 46], [70, 38], [58, 40], [48, 36], [38, 40], [28, 38]], hr[2], { top: hr[3] }); polyF([[48, 36], [58, 40], [70, 38], [78, 46], [76, 20], [58, 8], [48, 8]], hr[1]); lineF(32, 12, 28, 30, hr[3]);
    for (const sx of [-1, 1]) { const cx = 48 + sx * 12; F([[cx - 6, 52], [cx, 48], [cx + 6, 52], [cx + 6, 60], [cx - 6, 60]], hex('#f6f4ff'), { rim: 0 }); ellF(cx, 56, 4, 4.4, hex('#1c1030')); pset(cx - 2, 54, WHITE); pset(cx - 1, 54, WHITE); }
    polyF([[47, 62], [50, 62], [51, 68], [46, 68]], sk[1]); mouthP(48, 73, talk, hex('#8c4a3a'), 3);
    cardFrame('#ffe070', '#c87a20');
  });
}
// PILOT X: spiky black hair, a red visor, a pale teal collar over a purple suit. looks like a hero and will not say who he is
function pilotxPortrait(mood = 'n', talk = 0) {
  const sk = ramp(hex('#c89468')), hr = ramp(hex('#2a1a5a')), co = ramp(hex('#98d8d0'));
  return offscreen(PW, PH, () => {
    bgCard('#1a0410', '#a8201c', hex('#ff6a50'), { halo: .5 });
    for (let i = 0; i < 12; i++) lineF(2, 20 + i * 8, 20, 20 + i * 8 - 4, mix(hex('#ff6a50'), hex('#1a0410'), .5));
    F([[0, 112], [4, 92], [22, 80], [36, 96], [60, 96], [74, 80], [92, 92], [96, 112]], hex('#463c78')); F([[0, 112], [4, 92], [22, 80], [30, 112]], co[2]); F([[96, 112], [92, 92], [74, 80], [66, 112]], co[1]);
    F([[36, 76], [60, 76], [60, 96], [36, 96]], hex('#2c2450'), { rim: 0 }); neck(sk, 72);
    head(sk, {}); nose(sk);
    const sp = [[24, 46], [14, 22], [28, 28], [26, 8], [40, 20], [48, 2], [56, 20], [70, 4], [70, 24], [84, 14], [78, 34], [88, 46], [76, 52], [70, 38], [48, 32], [26, 38]];
    F(sp, hr[1], { top: hr[3] }); polyF([[28, 28], [40, 20], [48, 2], [56, 20], [70, 24], [78, 34], [70, 38], [48, 32], [26, 38]], hr[2]); lineF(30, 24, 38, 30, hr[3]); lineF(58, 12, 62, 26, hr[3]);
    F([[22, 44], [74, 44], [72, 58], [24, 58]], hex('#1a0a14'), { rim: 0 }); F([[24, 46], [72, 46], [70, 56], [26, 56]], hex('#e02030'), { rim: 0 }); lineF(24, 47, 72, 47, hex('#ff9a9a')); lineF(26, 55, 70, 55, hex('#901020')); glow(48, 51, 40, hex('#ff2030'), .4);
    mouthP(48, 72, talk, hex('#5a2a1a'), 5);
    cardFrame('#ff6a50', '#8a1a1a');
  });
}

const PORTS = { CARL: carlPortrait, LINDA: lindaPortrait, GHOST: ghostPortrait, JB: jbPortrait, FACE: facePortrait, YOKO: yokoPortrait, PEEKID: peekidPortrait, PILOTX: pilotxPortrait };
const PCACHE = {};
function portrait(who, mood, talk = 0) { const k = who + '|' + (mood || '') + '|' + talk; if (!PCACHE[k]) PCACHE[k] = PORTS[who](mood || undefined, talk); return PCACHE[k]; }
// area-averaged downscale to a small HUD portrait (transparent where most of the box is empty)
function shrink(b, w, h) {
  const o = newBuf(w, h), sx = b.w / w, sy = b.h / h;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let r = 0, g = 0, bl = 0, n = 0, t = 0;
    for (let j = Math.floor(y * sy); j < Math.ceil((y + 1) * sy); j++) for (let i = Math.floor(x * sx); i < Math.ceil((x + 1) * sx); i++) { t++; const c = b.d[j * b.w + i]; if (c) { const [cr, cg, cb] = chan(c); r += cr; g += cg; bl += cb; n++; } }
    if (n * 2 >= t) o.d[y * w + x] = rgb(r / n, g / n, bl / n); }
  return o;
}
const SPCACHE = {}; const smallPort = (who, w = 40, h = 47) => SPCACHE[who + w] || (SPCACHE[who + w] = shrink(portrait(who), w, h));
