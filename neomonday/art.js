'use strict';
// ================= NEO MONDAY — art: portraits (lit with colored rim lights), pre-drawn scenes, shooting-gallery sprites =================
const PW = 96, PH = 112;
const K = {
  ink: hex('#120c1c'), mag: hex('#ff3cc8'), cyan: hex('#3ccaff'), amber: hex('#ffb040'), red: hex('#ff3030'),
  orange: ['#6a2410', '#b44a18', '#ee8624', '#ffb258'].map(hex), cream: ['#8a7466', '#cdb9a6', '#f4e6d0', '#fff8ea'].map(hex),
  hat: ['#2c2c3c', '#555568', '#8a8a9c', '#b4b4c4'].map(hex), coat: ['#4a3826', '#7a5e40', '#a88860', '#cdb088'].map(hex),
  steel: ['#1c2438', '#38465c', '#6a7c96', '#a8b8d0'].map(hex), skin: ['#6a3a3a', '#a86a5a', '#d49a82', '#f2c8aa'].map(hex),
  hair: ['#08060c', '#1c1830', '#34305a'].map(hex), white: ['#6a7490', '#aab4d0', '#e0e8f8', '#ffffff'].map(hex),
};
// 1px dark outline around every opaque pixel of a buffer (the anime "clean edge")
function outlineBuf(b, c = K.ink) {
  const d = b.d.slice();
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) { if (b.d[y * b.w + x]) continue;
    const o = (xx, yy) => xx >= 0 && yy >= 0 && xx < b.w && yy < b.h && b.d[yy * b.w + xx];
    if (o(x - 1, y) || o(x + 1, y) || o(x, y - 1) || o(x, y + 1)) d[y * b.w + x] = c; }
  b.d = d; return b;
}
function darkenEll(cx, cy, rx, ry, k) { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { const dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy > 1) continue; const p = pget(x, y); if (!p) continue; const [r, g, b] = chan(p); pset(x, y, rgb(r * k, g * k, b * k)); } }
const RIM = { rimL: K.mag, rimR: K.cyan };

// ---------- JB GARFIELD: orange cat, heavy lids, grey fedora, torn tan trench coat, black tie (see the reference art) ----------
// mood: dead (default, half-lidded), wide, closed, smug, hurt, think
function jbPortrait(mood = 'dead', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(48, 124, 58, 42, K.coat, RIM);                                   // coat
    polyF([[27, 84], [40, 82], [46, 110], [30, 112]], K.coat[2]); polyF([[69, 84], [56, 82], [50, 110], [66, 112]], K.coat[1]); // lapels
    polyF([[38, 82], [58, 82], [48, 106]], K.white[2]); polyF([[45, 85], [51, 85], [53, 99], [48, 106], [43, 99]], K.ink); // shirt, tie
    for (const [x, y] of [[20, 100], [74, 96], [58, 106]]) { ellF(x, y, 2, 1.5, K.coat[0]); pset(x + 1, y, hex('#8a2030')); }       // tears and stains
    lineF(24, 92, 34, 88, K.coat[3]); lineF(72, 92, 64, 88, K.coat[0]);
    blob(48, 62, 43, 29, K.orange, RIM);                                    // head (wide: he is a big cat)
    for (let i = 0; i < 6; i++) { pset(5 + i % 2, 62 + i * 3, K.orange[3]); pset(90 - i % 2, 62 + i * 3, K.orange[1]); }              // fur tufts
    blob(48, 75, 26, 14, K.cream, { light: [-.3, -.7, .6] });               // muzzle
    blob(48, 65, 6, 3.8, [K.ink, K.hat[0], K.hat[1]]);                    // nose
    // eyes
    const eye = (cx, side) => { blob(cx, 55, 12.5, 9.4, K.white, { light: [0, -.5, .8] });
      const px = cx + (side < 0 ? 3 : -3); ellF(px, 59, 3.4, 3.4, K.ink); pset(px - 1, 58, K.white[3]); };
    eye(30, -1); eye(66, 1);
    const lid = (x0, x1, yin, yout, yTop = 44) => polyF([[x0, yTop], [x1, yTop], [x1, side(x0, x1, yin, yout, 1)], [x0, side(x0, x1, yin, yout, 0)]], K.hat[0]);
    const side = (x0, x1, yin, yout, inner) => (x0 < 48 ? (inner ? yin : yout) : (inner ? yout : yin));
    if (mood === 'dead') { lid(17, 44, 54, 60); lid(52, 79, 54, 60); }
    else if (mood === 'wide') { lid(17, 44, 46, 47); lid(52, 79, 46, 47); }
    else if (mood === 'closed') { lid(17, 44, 62, 62); lid(52, 79, 62, 62); }
    else if (mood === 'smug') { lid(17, 44, 57, 61); lid(52, 79, 52, 54); }
    else if (mood === 'hurt') { lid(17, 44, 52, 47); lid(52, 79, 52, 47); lineF(24, 68, 38, 64, K.ink); lineF(72, 68, 58, 64, K.ink); }
    else if (mood === 'think') { lid(17, 44, 58, 61); lid(52, 79, 50, 52); }
    // lid edge highlight
    // mouth
    const my = 72;
    if (talk) { ellF(48, my + 4, 7, 3 + talk * 2, K.ink); rectF(44, my + 1, 8, 1, K.cream[3]); }
    else if (mood === 'smug') { lineF(40, my + 1, 48, my + 3, K.ink); lineF(48, my + 3, 58, my - 1, K.ink); }
    else if (mood === 'wide' || mood === 'hurt') { ellF(48, my + 3, 4, 3, K.ink); }
    else { lineF(48, 68, 48, my, K.ink); lineF(48, my, 40, my + 3, K.ink); lineF(48, my, 56, my + 3, K.ink); lineF(40, my + 3, 38, my + 2, K.ink); lineF(56, my + 3, 58, my + 2, K.ink); }
    for (let i = 0; i < 3; i++) { lineF(28, 74 + i * 2, 12, 71 + i * 3, K.cream[2]); lineF(68, 74 + i * 2, 84, 71 + i * 3, K.cream[1]); }
    // hat: crown, band, brim; shadow under the brim
    polyF([[23, 36], [26, 9], [37, 3], [48, 9], [59, 3], [70, 9], [73, 36]], K.hat[1]);   // fedora crown, pinched
    polyF([[23, 36], [26, 9], [37, 3], [42, 6], [38, 36]], K.hat[2]); polyF([[62, 36], [60, 5], [70, 9], [73, 36]], K.hat[0]);
    lineF(23, 36, 26, 9, K.mag); lineF(26, 9, 37, 3, K.mag); lineF(73, 36, 70, 9, K.cyan); lineF(70, 9, 59, 3, K.cyan);
    for (let y = 8; y < 30; y++) { pset(48, y, K.hat[0]); if (y < 18) { pset(47, y, K.hat[0]); } }
    polyF([[22, 30], [74, 30], [76, 38], [20, 38]], K.ink); lineF(22, 30, 74, 30, K.hat[0]); lineF(24, 31, 72, 31, K.hat[1]);
    darkenEll(48, 45, 40, 5, .5);
    blob(48, 38, 48, 8, K.hat, { light: [-.3, -.85, .4], rimL: K.mag, rimR: K.cyan });
    for (const [x, y] of [[30, 12], [56, 18], [42, 6], [70, 40], [20, 38]]) { pset(x, y, K.hat[0]); pset(x + 1, y + 1, K.hat[3]); } // wear marks
  }));
}

// ---------- KUMA: a round hover-drone navigator ----------
function kumaPortrait(mood = 'happy', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(20, 24, 13, 13, K.steel, RIM); blob(76, 24, 13, 13, K.steel, RIM); ellF(20, 24, 6, 6, K.steel[0]); ellF(76, 24, 6, 6, K.steel[0]);
    blob(48, 64, 40, 38, K.steel, RIM);
    rectF(46, 2, 4, 10, K.steel[1]); ellF(48, 3, 4, 4, K.red);
    rectF(14, 52, 68, 40, K.ink); rectF(15, 53, 66, 38, hex('#06182a'));
    for (let y = 53; y < 91; y += 2) rectF(15, y, 66, 1, hex('#082038'));
    const c = mood === 'err' ? K.red : K.cyan, eye = (x, ch) => {
      if (ch === 'happy') { lineF(x - 7, 70, x, 62, c, 2); lineF(x, 62, x + 7, 70, c, 2); }
      else if (ch === 'err') { lineF(x - 6, 60, x + 6, 72, c, 2); lineF(x + 6, 60, x - 6, 72, c, 2); }
      else if (ch === 'scan') { ellF(x, 66, 8, 8, c); ellF(x, 66, 4, 4, K.ink); }
      else { rectF(x - 6, 60, 12, 12, c); } };
    eye(34, mood); eye(62, mood);
    if (talk) rectF(40, 80, 16, 3 + talk * 2, c); else rectF(40, 81, 16, 2, c);
    glow(48, 72, 40, K.cyan, .12);
    rectF(30, 98, 36, 3, K.steel[0]); rectF(34, 101, 28, 2, K.cyan);
  }));
}

// ---------- CHIEF DOROTHY VANE: sharp black bob, high collar. mood 'copy' = half her face is chrome ----------
function vanePortrait(mood = 'cool', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(48, 124, 50, 40, K.steel, RIM); polyF([[28, 84], [42, 82], [44, 112], [26, 112]], K.steel[3]); polyF([[68, 84], [54, 82], [52, 112], [70, 112]], K.steel[2]);
    ellF(34, 100, 3, 3, K.amber); ellF(62, 100, 3, 3, K.ink); rectF(40, 76, 16, 8, K.skin[1]);
    blob(48, 56, 28, 33, K.hair, RIM);
    blob(48, 58, 22, 27, K.skin, { light: [-.4, -.5, .7] });
    polyF([[20, 28], [76, 28], [74, 44], [58, 36], [38, 40], [22, 50]], K.hair[1]); // sharp fringe
    polyF([[20, 28], [26, 80], [14, 84], [14, 40]], K.hair[0]); polyF([[76, 28], [70, 80], [82, 84], [82, 40]], K.hair[0]);
    const e = (cx, side) => { ellF(cx, 56, 7, 3.5, K.white[3]); ellF(cx + side, 56, 2.5, 2.5, K.ink); lineF(cx - 8, 52 - (mood === 'cool' ? 0 : 1), cx + 8, 52 + side * -1, K.ink, 1); };
    e(38, 1); e(58, -1);
    lineF(48, 60, 47, 68, K.skin[1]);
    if (talk) ellF(48, 76, 5, 2 + talk, K.ink); else lineF(41, 76, 55, 76, hex('#c01840'), 2);
    rectF(41, 75, 14, 1, hex('#ff5078'));
    if (mood === 'copy') { // the right side of her face is not skin
      for (let y = 30; y < 86; y++) for (let x = 48; x < 76; x++) { const p = pget(x, y); if (p && p !== K.ink && (x - 48) * (x - 48) / 784 + (y - 58) * (y - 58) / 900 < 1) pset(x, y, (x + y) & 1 && y % 5 ? K.steel[2] : K.steel[1]); }
      ellF(58, 56, 6, 3, K.ink); ellF(58, 56, 4, 2, K.red); glow(58, 56, 18, K.red, .6); lineF(48, 36, 48, 84, K.ink);
      for (let y = 40; y < 84; y += 6) lineF(52, y, 70, y, K.steel[0]); }
  }));
}

// ---------- MIRA SOTO: pathologist, round glasses, hair bun, mask pulled down ----------
function miraPortrait(mood = 'kind', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(48, 124, 52, 40, K.white, { rimL: K.cyan, rimR: K.cyan }); polyF([[34, 84], [62, 84], [48, 108]], K.white[0]); rectF(40, 76, 16, 8, K.skin[2]);
    blob(48, 22, 12, 12, K.hair, RIM); // bun
    blob(48, 52, 30, 33, K.hair, RIM);
    blob(48, 58, 23, 27, K.skin, { light: [-.4, -.5, .7] });
    polyF([[18, 40], [78, 40], [70, 34], [26, 34]], K.hair[1]);
    // glasses
    for (const cx of [37, 59]) { ellF(cx, 57, 10, 9, K.ink); ellF(cx, 57, 8.5, 7.5, hex('#b8e8ff')); ellF(cx + (cx < 48 ? 1 : -1), 58, 2.5, 2.5, K.ink); glow(cx, 57, 10, K.cyan, .15); }
    lineF(47, 55, 49, 55, K.ink); rectF(10, 55, 8, 2, K.ink); rectF(78, 55, 8, 2, K.ink);
    if (mood === 'grim') { lineF(38, 49, 46, 51, K.ink); lineF(58, 49, 50, 51, K.ink); }
    polyF([[28, 82], [68, 82], [62, 88], [34, 88]], K.cyan); // mask around the neck
    if (talk) ellF(48, 76, 4, 2 + talk, K.ink); else lineF(42, 75, 54, 75, hex('#a03850'), 2);
    for (let i = 0; i < 8; i++) pset(30 + hash(i, 1, 5) * 36, 62 + hash(i, 2, 5) * 8, K.skin[1]);
  }));
}

// ---------- LUCKY: bartender, bald, mustache, one red cyber-eye ----------
function luckyPortrait(mood = 'wry', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(48, 126, 56, 42, [hex('#2a1018'), hex('#5a2030'), hex('#8a3040'), hex('#b05060')], RIM); polyF([[34, 84], [62, 84], [48, 112]], K.white[2]); polyF([[46, 86], [50, 86], [52, 108], [48, 112], [44, 108]], K.ink);
    rectF(38, 76, 20, 10, K.skin[1]);
    blob(48, 54, 30, 33, K.skin, RIM);
    for (const cx of [38, 58]) { ellF(cx, 52, 6, 3.5, K.white[3]); }
    ellF(41, 52, 2.2, 2.2, K.ink); ellF(58, 52, 4, 4, K.ink); ellF(58, 52, 2.6, 2.6, K.red); glow(58, 52, 16, K.red, .5);
    lineF(30, 46, 46, 47 + (mood === 'wry' ? 1 : 0), K.ink, 2); lineF(52, 44, 68, 46, K.ink, 2);
    lineF(48, 54, 46, 64, K.skin[1]); lineF(46, 64, 50, 64, K.skin[1]);
    polyF([[28, 70], [48, 66], [68, 70], [64, 76], [48, 72], [32, 76]], K.hair[0]); // mustache
    if (talk) ellF(48, 80, 5, 2 + talk, K.ink); else lineF(42, 79, 54, 79, K.skin[0], 2);
    for (let y = 34; y < 40; y++) rectF(30 + y - 34, y, 36 - (y - 34) * 2, 1, K.skin[3]); // shine on the dome
    lineF(66, 50, 74, 60, K.steel[2]); lineF(74, 60, 72, 66, K.steel[1]); // implant
  }));
}

// ---------- COPYCAT: chrome skull face with cat-ear antennae. It is wearing somebody's smile. ----------
function copycatPortrait(mood = 'cold', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    blob(48, 124, 50, 40, K.steel, RIM);
    polyF([[16, 40], [24, 4], [40, 26]], K.steel[2]); polyF([[80, 40], [72, 4], [56, 26]], K.steel[1]); // ears
    blob(48, 56, 30, 34, K.steel, RIM);
    for (let y = 30; y < 90; y += 4) lineF(20, y, 76, y, K.steel[0]);
    for (const cx of [36, 60]) { polyF([[cx - 9, 50], [cx + 9, 56], [cx + 9, 60], [cx - 9, 54]], K.ink); glow(cx, 55, 16, K.red, .8); polyF([[cx - 6, 52], [cx + 6, 56], [cx + 6, 58], [cx - 6, 54]], K.red); }
    ellF(48, 68, 3, 4, K.ink);
    rectF(30, 78, 36, 10, K.ink); for (let x = 32; x < 64; x += 4) rectF(x, 78, 2, 10, talk ? K.steel[0] : K.steel[3]);
    if (talk) rectF(30, 78, 36, 3 + talk * 3, K.red);
    for (let i = 0; i < 5; i++) lineF(14 + i * 3, 90, 10 + i * 4, 112, i % 2 ? K.red : K.cyan);
  }));
}

// ---------- HAROLD: the original. A human detective in a hologram. ----------
function haroldPortrait(mood = 'calm', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    const holo = [hex('#0a3a50'), hex('#1a7aa0'), hex('#4ac8e8'), hex('#b8f4ff')];
    blob(48, 124, 52, 40, holo, { rimL: K.cyan, rimR: K.cyan }); polyF([[38, 82], [58, 82], [48, 106]], holo[3]);
    blob(48, 58, 24, 28, holo, { rimL: K.cyan, rimR: K.cyan });
    blob(48, 26, 26, 14, holo, { light: [0, -.9, .3] }); blob(48, 36, 44, 7, holo, { light: [0, -.9, .3] }); polyF([[22, 30], [74, 30], [74, 35], [22, 35]], holo[0]);
    for (const cx of [38, 58]) { ellF(cx, 55, 5, 3, holo[3]); ellF(cx, 55, 2, 2, holo[0]); }
    lineF(30, 49, 44, 50, holo[0]); lineF(66, 49, 52, 50, holo[0]);
    for (let i = 0; i < 40; i++) pset(34 + hash(i, 1, 3) * 28, 70 + hash(i, 2, 3) * 12, holo[1]);
    if (talk) ellF(48, 76, 5, 2 + talk, holo[0]); else lineF(42, 76, 54, 76, holo[0], 2);
    for (let y = 0; y < PH; y += 3) for (let x = 0; x < PW; x += 1) if (pget(x, y)) pset(x, y, mix(pget(x, y), K.ink, .35));
  }));
}

const PORTS = { JB: jbPortrait, KUMA: kumaPortrait, VANE: vanePortrait, MIRA: miraPortrait, LUCKY: luckyPortrait, COPYCAT: copycatPortrait, HAROLD: haroldPortrait };
const PCACHE = {};
function portrait(who, mood, talk = 0) { const k = who + '|' + (mood || '') + '|' + talk; if (!PCACHE[k]) PCACHE[k] = PORTS[who](mood || undefined, talk); return PCACHE[k]; }
