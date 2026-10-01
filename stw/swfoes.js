'use strict';
// ================= SAVE THE WORLD: enemy art kits (painted, shaded, facing right) =================
// A foe's look is { kit, o: params, c: [base, accent, extra, eye] }. Sprites are built once and cached.
const FOEART = { cache: {} };
(() => {
  const dk = (c, k) => mix(c, BLACK, k), lt = (c, k) => mix(c, WHITE, k);
  // 1 outline 2 base 3 base shade 4 base hi 5 base deep | 6 acc 7 acc shade 8 acc hi | 9 x 10 x shade | 11 eye 12 white 13 black 14 gray 15 metal
  FOEART.pal = (c) => { const [b, a, x, e] = c.map(hex); return [0, hex('#100810'), b, dk(b, .32), lt(b, .32), dk(b, .6), a, dk(a, .32), lt(a, .32), x, dk(x, .32), e, WHITE, hex('#101010'), hex('#929292'), hex('#b6b6db')]; };
  // the painter's lighting pass: shade the lower-right rim, catch light on the upper-left (groups: 2/3/4, 6/7/8, 9/10)
  const GROUP = { 2: [3, 4], 6: [7, 8], 9: [10, 12] };
  function light(s) {
    const d = s.d.slice(), at = (x, y) => (x < 0 || y < 0 || x >= s.w || y >= s.h) ? 0 : s.d[y * s.w + x];
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) {
      const c = s.d[y * s.w + x], gr = GROUP[c]; if (!gr) continue;
      const same = v => v === c || v === gr[0] || v === gr[1];
      if (!same(at(x + 1, y + 1)) || !same(at(x + 2, y + 2)) || !same(at(x + 1, y + 3))) d[y * s.w + x] = gr[0];
      else if (!same(at(x - 1, y - 1)) || !same(at(x - 2, y - 1))) d[y * s.w + x] = gr[1];
    }
    s.d = d; return s;
  }
  const eye = (g, x, y, r = 2, mean) => { g.e(x, y, r + .6, r + .6, 13); g.e(x, y, r, r, 11); g.p(x - 1, y - 1, 12); if (mean) g.line(x - r - 1, y - r - 1, x + r, y - r + 1, 1); };
  // letters inside a sprite (the 5x7 font, stamped as pixels)
  const gtext = (g, str, x, y, c) => { let xx = x; for (const ch of String(str)) { const f = FONT[ch.toUpperCase()]; if (f) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (f[j] & (16 >> i)) g.p(xx + i, y + j, c); xx += 6; } };
  FOEART.gtext = gtext;
  const teeth = (g, x, y, w) => { for (let i = 0; i < w; i += 2) { g.p(x + i, y, 12); g.p(x + i, y + 1, 12); } };
  const KITS = {
    // a franchise soldier: helmet + visor, uniform, a baton or scanner
    trooper: (g, o) => {
      g.r(14, 34, 6, 18, 3); g.r(22, 34, 6, 18, 2); g.r(12, 50, 9, 5, 13); g.r(21, 50, 9, 5, 13);
      g.r(11, 16, 21, 20, 2); g.r(11, 30, 21, 3, 9); g.r(20, 30, 3, 3, 15);
      g.r(6, 17, 6, 14, 2); g.r(31, 17, 6, 12, 2); g.r(6, 30, 6, 4, 4); g.r(31, 28, 6, 4, 4);
      g.e(21, 9, 10, 9, 6); g.r(11, 9, 21, 4, 6); g.r(13, 8, 19, 5, 11); g.r(14, 9, 3, 1, 12);
      if (o.weap === 'scanner') { g.r(34, 18, 8, 6, 14); g.r(40, 19, 3, 4, 11); }
      else if (o.weap === 'spear') { g.line(36, 2, 36, 50, 15); g.e(36, 3, 2, 4, 14); }
      else { g.line(33, 30, 42, 20, 13); g.line(34, 30, 43, 20, 14); }
      if (o.badge) { g.r(14, 20, 5, 5, 6); g.p(16, 22, 12); }
    },
    // a four-legged animal facing right
    beast: (g, o) => {
      const big = o.big ? 1.25 : 1, w = 50 * big, h = 34 * big;
      g.line(6, 14, 0, 6 + (o.tail || 0), 3); g.line(7, 15, 1, 7 + (o.tail || 0), 3); g.line(7, 16, 2, 9, 2);
      for (const lx of [10, 17, 30, 37]) { g.r(lx * big, 20 * big, 5, 12 * big, lx < 20 ? 3 : 2); g.r(lx * big - 1, 31 * big, 7, 3, 5); }
      g.e(24 * big, 16 * big, 18 * big, 10 * big, 2);
      if (o.stripe) for (let x = 12; x < 34; x += 6) g.r(x * big, 8 * big, 2, 14 * big, 6);
      const hx = 40 * big, hy = 11 * big;
      g.e(hx, hy, 9 * big, 8 * big, 2); g.e(hx + 7 * big, hy + 3 * big, 6 * big, 4 * big, o.snout || 4); g.p(hx + 12 * big, hy + 1 * big, 13);
      if (o.ears === 'round') { g.e(hx - 4, hy - 8, 3.5, 3.5, 2); g.e(hx - 4, hy - 8, 2, 2, 6); }
      else { g.line(hx - 6, hy - 5, hx - 4, hy - 14, 2); g.line(hx - 3, hy - 5, hx - 4, hy - 14, 2); g.line(hx - 5, hy - 6, hx - 4, hy - 12, 6); }
      eye(g, hx + 2, hy - 1, 1.6, o.mean); teeth(g, hx + 5 * big, hy + 6 * big, 8);
      if (o.collar) g.r(hx - 9, hy + 4, 6, 7, 6);
      if (o.cable) { g.line(hx + 14, hy + 6, w, hy + 14, 13); g.p(w - 1, hy + 14, 11); }
    },
    // a soft round thing with feet
    blob: (g, o) => {
      g.e(20, 22, 18, 14, 2);
      if (o.ears) { g.e(10, 4, 4, 9, 2); g.e(28, 3, 4, 9, 2); g.e(10, 5, 2, 6, 6); g.e(28, 4, 2, 6, 6); }
      if (o.fuzz) for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28; g.p(20 + Math.cos(a) * 18.5, 22 + Math.sin(a) * 14.5, 4); }
      eye(g, 15, 18, 2.4); eye(g, 26, 18, 2.4); if (o.smile) { g.line(15, 27, 20, 30, 13); g.line(20, 30, 26, 27, 13); } else g.r(17, 28, 6, 2, 13);
      g.r(10, 34, 7, 3, 3); g.r(24, 34, 7, 3, 3);
    },
    // a pill with little legs
    pill: (g, o) => {
      g.e(12, 18, 11, 11, 2); g.e(32, 18, 11, 11, 6); g.r(12, 7, 20, 23, 2); g.r(22, 7, 10, 23, 6);
      eye(g, 30, 15, 2.2); eye(g, 37, 15, 2.2); g.line(30, 23, 38, 22, 13);
      g.r(14, 29, 3, 7, 13); g.r(26, 29, 3, 7, 13); g.r(12, 35, 6, 2, 13); g.r(24, 35, 6, 2, 13);
    },
    // something that floats: a ball of static, a pop-up window, an eye
    floater: (g, o) => {
      if (o.window) {
        g.r(2, 6, 44, 34, 12); g.r(2, 6, 44, 7, 6); g.r(38, 7, 6, 5, 9); g.line(39, 8, 42, 11, 12); g.line(42, 8, 39, 11, 12);
        g.r(6, 16, 36, 4, 2); g.r(6, 23, 28, 3, 14); g.r(6, 29, 20, 3, 14); g.r(30, 30, 12, 7, 9); g.r(32, 32, 8, 3, 12);
        eye(g, 16, 18, 2, 1); eye(g, 30, 18, 2, 1); return;
      }
      g.e(22, 20, 17, 17, 2); g.e(22, 20, 12, 12, 6);
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; g.line(22 + Math.cos(a) * 14, 20 + Math.sin(a) * 14, 22 + Math.cos(a + .3) * 22, 20 + Math.sin(a + .3) * 22, i & 1 ? 9 : 4); }
      eye(g, 22, 20, 5, o.mean); g.e(22, 20, 2, 2, 13);
    },
    // a cactus with arms, or a tumbleweed
    plant: (g, o) => {
      if (o.tumble) { g.e(22, 22, 20, 18, 0); for (let i = 0; i < 30; i++) { const a = i * 2.4; g.line(22 + Math.cos(a) * 18, 22 + Math.sin(a) * 16, 22 + Math.cos(a + 2.1) * 17, 22 + Math.sin(a + 2.1) * 15, i & 1 ? 2 : 6); } eye(g, 18, 20, 2); eye(g, 27, 20, 2); return; }
      g.r(16, 6, 12, 40, 2); g.e(22, 6, 6, 5, 2); g.r(4, 18, 6, 14, 2); g.r(4, 30, 14, 6, 2); g.r(34, 12, 6, 14, 2); g.r(26, 22, 14, 6, 2);
      for (let y = 8; y < 44; y += 4) { g.p(17, y, 12); g.p(26, y + 2, 12); }
      eye(g, 19, 14, 1.8); eye(g, 25, 14, 1.8); g.r(19, 20, 6, 2, 13); if (o.flower) { g.e(22, 1, 3, 2, 6); g.p(22, 1, 9); }
      g.r(12, 44, 20, 6, 9); g.r(12, 44, 20, 2, 10);
    },
    // a box robot on treads with a screen for a face
    machine: (g, o) => {
      g.r(4, 40, 40, 10, 13); for (let x = 6; x < 44; x += 6) g.e(x, 45, 2.5, 2.5, 14);
      g.r(6, 12, 36, 30, 2); g.r(6, 12, 36, 4, 4); g.r(10, 18, 22, 16, 13); g.r(12, 20, 18, 12, 11);
      eye(g, 17, 25, 2, o.mean); eye(g, 25, 25, 2, o.mean); if (o.smile) g.line(17, 30, 25, 30, 12);
      g.r(34, 20, 6, 6, 6); g.r(34, 28, 6, 3, 9);
      g.line(14, 12, 10, 2, 15); g.e(10, 2, 2, 2, 9);
      if (o.arm) { g.r(42, 20, 8, 4, 15); g.r(48, 16, 4, 12, 14); }
      if (o.copier) { g.r(6, 8, 36, 5, 12); g.r(8, 6, 32, 2, 14); g.r(42, 28, 6, 3, 12); g.r(44, 26, 5, 1, 12); }
    },
    // a sheet ghost with a tattered hem
    spook: (g, o) => {
      g.e(22, 16, 16, 15, 2); g.r(6, 16, 32, 22, 2);
      for (let x = 6; x < 38; x += 4) g.e(x + 2, 38, 2, 4 + ((x / 4) & 1) * 3, 2);
      g.line(6, 22, 0, 12, 2); g.line(38, 22, 46, 14, 2);
      eye(g, 17, 14, 3, o.mean); eye(g, 29, 14, 3, o.mean); g.e(23, 25, 5, 3, 13); g.r(19, 23, 8, 1, 2);
      if (o.prop === 'mic') { g.line(44, 14, 46, 30, 15); g.e(44, 12, 3, 3, 14); }
      if (o.prop === 'boom') { g.line(0, 6, 30, 0, 15); g.e(32, 1, 4, 3, 14); }
      if (o.prop === 'laugh') for (let i = 0; i < 3; i++) gtext(g, 'HA', 32 + i * 2, i * 8, 12);
    },
    // a bird made of tins of meat
    bird: (g, o) => {
      g.e(22, 22, 14, 10, 2); g.r(14, 16, 16, 12, 6); g.r(14, 20, 16, 2, 12);
      g.line(10, 16, 0, 4, 2); g.line(12, 18, 2, 8, 2); g.line(14, 18, 6, 6, 6); g.line(30, 16, 38, 2, 2); g.line(28, 16, 36, 6, 6);
      g.e(36, 16, 7, 6, 2); eye(g, 37, 14, 1.6, 1); g.line(42, 16, 48, 18, 9); g.line(42, 17, 48, 19, 9);
      g.line(18, 32, 16, 38, 9); g.line(26, 32, 28, 38, 9);
    },
    // a fin cutting through the ground, with a smile under it
    fin: (g, o) => {
      g.e(25, 36, 24, 6, 9); g.e(25, 36, 20, 4, 10);
      g.each((x, y) => y >= 3 && y < 35 && x >= 31 - (y - 3) * .55 && x <= 31 + (y - 3) * .3 ? 2 : 0);
      g.r(16, 33, 24, 2, 3); eye(g, 31, 20, 1.6, 1); eye(g, 36, 22, 1.4, 1);
    },
    // a big troll with a club (the internet kind and the bridge kind)
    troll: (g, o) => {
      g.r(14, 44, 8, 16, 3); g.r(28, 44, 8, 16, 2); g.r(12, 58, 11, 4, 5); g.r(27, 58, 11, 4, 5);
      g.e(25, 32, 18, 16, 2); g.e(24, 12, 11, 10, 2); g.r(17, 10, 4, 3, 12); g.r(28, 10, 4, 3, 12); g.p(19, 11, 13); g.p(30, 11, 13);
      g.e(24, 18, 6, 3, 13); teeth(g, 20, 17, 8); g.e(10, 2, 3, 4, 9); g.e(38, 2, 3, 4, 9);
      g.r(4, 26, 8, 18, 2); g.r(38, 22, 8, 16, 2); g.line(44, 36, 54, 6, 6); g.line(45, 36, 55, 6, 6); g.e(54, 6, 5, 6, 6);
      if (o.keyboard) { g.r(14, 34, 22, 8, 14); for (let x = 16; x < 34; x += 3) g.p(x, 37, 12); }
    },
    // a snake made of a comment: letters for a body
    snake: (g, o) => {
      for (let i = 0; i < 9; i++) { const x = 4 + i * 5, y = 30 + Math.sin(i * .9) * 6; g.e(x, y, 4, 4, i & 1 ? 2 : 6); }
      g.e(48, 22, 8, 7, 2); eye(g, 50, 20, 1.8, 1); g.line(54, 26, 60, 24, 9); g.line(60, 24, 62, 22, 9); g.line(60, 24, 62, 27, 9);
    },
    // a line of people waiting; one foe
    queue: (g, o) => {
      for (let i = 0; i < 4; i++) { const x = 4 + i * 12, y = 4 + i * 2; g.r(x + 2, y + 12, 8, 14, i & 1 ? 6 : 2); g.e(x + 6, y + 7, 5, 5, 14 + 0); g.r(x + 3, y + 26, 2, 8, 13); g.r(x + 7, y + 26, 2, 8, 13); g.p(x + 8, y + 7, 13); }
      g.r(38, 0, 12, 9, 12); gtext(g, '#', 41, 1, 13);
    },
    // a crab or a spider: body with legs
    bug: (g, o) => {
      for (let i = 0; i < 4; i++) { g.line(14 + i * 6, 22, 6 + i * 6, 36, 3); g.line(14 + i * 6, 22, 22 + i * 6, 36, 3); }
      g.e(24, 20, 16, 11, 2); g.e(38, 18, 7, 6, 2); eye(g, 38, 15, 1.6, o.mean); eye(g, 43, 16, 1.6, o.mean);
      if (o.claws) { g.e(46, 26, 5, 4, 6); g.line(48, 24, 52, 20, 6); }
      if (o.mark) { g.e(22, 18, 4, 4, 6); }
    },
    // a chair from a waiting room, which has started waiting on its own
    chair: (g, o) => {
      g.r(8, 4, 26, 24, 2); g.r(8, 26, 30, 8, 2); g.r(10, 34, 3, 12, 15); g.r(32, 34, 3, 12, 15); g.r(6, 26, 4, 10, 6); g.r(36, 26, 4, 10, 6);
      eye(g, 16, 14, 2); eye(g, 26, 14, 2); g.r(17, 20, 8, 2, 13);
    },
    // a loading bar that never finishes
    bar: (g, o) => {
      g.r(2, 14, 50, 14, 12); g.r(4, 16, 46, 10, 13); g.r(4, 16, 30, 10, 6); for (let x = 6; x < 34; x += 6) g.r(x, 16, 2, 10, 8);
      gtext(g, '99%', 18, 30, 12); eye(g, 14, 6, 2, 1); eye(g, 40, 6, 2, 1);
    },
    // a glitch: a stack of misaligned tiles
    glitch: (g, o) => {
      for (let i = 0; i < 10; i++) { const x = (swh(i, 1, 300) * 34) | 0, y = (swh(i, 2, 300) * 34) | 0; g.r(x, y, 10 + ((i * 5) % 8), 8, [2, 6, 9, 12, 13][i % 5]); }
      eye(g, 20, 18, 3); g.r(16, 26, 12, 2, 12);
    },
  };
  FOEART.KITS = KITS; FOEART.light = light;
  const SIZE = { trooper: [44, 56], beast: [64, 46], blob: [40, 38], pill: [46, 38], floater: [48, 44], plant: [46, 52], machine: [52, 50], spook: [48, 44], bird: [50, 40], fin: [50, 42], troll: [60, 62], snake: [64, 40], queue: [54, 44], bug: [54, 38], chair: [44, 48], bar: [56, 40], glitch: [46, 44] };
  // get the sprite for a look: { kit, o, c }
  FOEART.get = look => {
    const k = look.kit + JSON.stringify(look.o || {}) + look.c.join();
    if (FOEART.cache[k]) return FOEART.cache[k];
    const [w, h] = look.size || SIZE[look.kit] || [48, 48];
    const s = light(outline(spr(w, h, g => (look.draw || KITS[look.kit])(g, look.o || {})), 1));
    s.P = FOEART.pal(look.c);
    return FOEART.cache[k] = s;
  };
})();
