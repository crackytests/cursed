'use strict';
// ================= FACE: WHAT COULD HAPPEN — in-game sprites =================
// The player is a floating head. Four heads, actually. The green dot on each is the third eye: the only part that can be hit.
const FP = {
  // 1 outline 2 face 3 face-hi 4 magenta 5 magenta-dk 6 green 7 green-dk 8 cyan 9 white
  new: pal('#000000', '#000024', '#24246d', '#ff24db', '#920092', '#6dff24', '#24b600', '#24dbff', '#ffffff'),
  // old face: wireframe, still in four shades (the new hardware can't draw him)
  old: legacyPal(pal('#000000', '#24b6b6', '#006d6d', '#ff24db', '#920092', '#6dff24', '#24b600', '#24dbff', '#ffffff'), 'dmg'),
  oldHand: legacyPal(pal('#000000', '#49ff92', '#24926d', '#ffffff'), 'dmg'),
  // 1 outline 2 skin 3 skin-dk 4 hair 5 hair-hi 6 band 7 metal 8 neon 9 red 10 coat 11 coat-dk 12 kanji
  pilot: pal('#000000', '#b66d49', '#924924', '#242424', '#492449', '#db2424', '#929292', '#dbff24', '#b60000', '#92dbb6', '#49926d', '#ffffdb'),
  // 1 outline 2 face 3 helmet 4 helmet-dk 5 helmet-hi 6 magenta 7 green 8 cape 9 cape-dk 10 gold
  dys: pal('#000000', '#000024', '#b62449', '#6d0024', '#ff4992', '#ff24db', '#6dff24', '#6d0049', '#490024', '#ffdb24'),
};
const FS = {};
(() => {
  const kana3 = ['###', '..#', '.#.', '#.#'];
  const st = (g, rows, x, y, c) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') g.p(x + i, y + j, c); });
  const headIn = (x, y) => { const dx = (x + .5 - 12) / 9.5, dy = (y + .5 - 14) / 11; if (dx * dx + dy * dy <= 1) return true; if (y >= 5 && y <= 12 && x >= 3 && x <= 20) return true; return (x >= 3 && y <= 9 && x - 3 <= y * .7) || (x <= 20 && y <= 9 && 20 - x <= y * .7); };
  FS.new = [0, 1, 2].map(f => spr(24, 26, g => {
    g.each((x, y) => headIn(x, y) ? 2 : 0);
    g.each((x, y) => { if (!headIn(x, y)) return 0; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!headIn(x + a, y + b)) return 4; return 0; });
    g.p(6, 8, 3); g.p(5, 10, 3); g.p(5, 12, 3);
    g.line(6, 4, 12, 10, 4); g.line(17, 4, 12, 10, 4); g.r(11, 6, 3, 2, 6); g.p(12, 5, 6); g.p(12, 8, 6);
    for (const ex of [8, 16]) { g.r(ex - 3, 14, 6, 1, 4); g.r(ex - 3, 16, 6, 1, 4); g.p(ex - 4, 15, 4); g.p(ex + 3, 15, 4); g.r(ex - 3, 15, 6, 1, 1); if (f < 2) { g.p(ex - 2, 15, 6); g.p(ex, 15, 6); g.p(ex + 1, 14 + (f ? 2 : 0), 6); } }
    st(g, kana3, 11, 17, 4);
    for (let x = 8; x <= 16; x++) if ((x + f) % 3) g.p(x, 22, 6);
  }));
  FS.old = [0, 1].map(f => spr(24, 26, g => {
    g.each((x, y) => { const dx = (x + .5 - 12) / 10.5, dy = (y + .5 - 12) / 11.5, d = dx * dx + dy * dy; return d <= 1 && d > .72 ? 2 : 0; });
    for (const k of [-1, 0, 1]) g.each((x, y) => { const dx = (x + .5 - 12) / 10.5, dy = (y + .5 - 12) / 11.5; return dx * dx + dy * dy < .72 && Math.abs(dx - k * .5 * Math.sqrt(Math.max(0, 1 - dy * dy))) < .06 ? 3 : 0; });
    for (const ex of [7, 17]) { g.e(ex, 11, 3.2, 3, 4); g.e(ex, 11, 2, 1.8, 1); g.p(ex, 11, 6); g.p(ex - 1, 11 + f, 6); }
    st(g, kana3, 11, 14, 4); g.r(6, 19, 12, 3, 4); for (let x = 7; x < 18; x += 3) g.p(x, 20, 5);
  }));
  FS.hand = [0, 1].map(f => outline(spr(12, 11, g => { g.e(6, 7, 4.5, 3.5, 2); for (let i = 0; i < 4; i++) g.r(2 + i * 2, 1 + (i === 0 || i === 3 ? 2 : 0) + (f && i === 1 ? 1 : 0), 1, 5, 2); g.r(0, 6, 3, 2, 2); g.e(6, 8, 3, 2, 3); }), 1));
  FS.pilot = [0, 1].map(f => outline(spr(26, 24, g => {
    g.e(13, 11, 11, 10, 4);
    for (const [x0, y0, x1, y1] of [[3, 8, 0, 2], [4, 14, 0, 16], [6, 19, 2, 23], [22, 8, 25, 2], [22, 14, 25, 16], [20, 19, 24, 23], [9, 2, 7, 0], [15, 1, 16, 0]]) { g.line(x0, y0, x1, y1, 4); g.line(x0 + 1, y0, x1 + 1, y1, 4); }
    g.line(8, 4, 11, 6, 5); g.line(16, 3, 18, 6, 5);
    g.e(13, 15, 6.5, 7.5, 2); g.r(17, 12, 2, 8, 3);
    g.r(6, 8, 14, 2, 6); g.r(11, 8, 4, 2, 7);
    g.r(6, 10, 14, 2, 4);
    for (const ex of [10, 16]) { g.r(ex - 2, 13, 5, 1, 8); g.r(ex - 2, 15, 5, 1, 8); g.p(ex - 3, 14, 8); g.p(ex + 3, 14, 8); g.r(ex - 2, 14, 5, 1, 1); g.p(ex, 14, 9); }
    g.r(12, 16, 3, 1, 12); g.p(13, 17, 12); g.p(12, 18, 12); g.p(14, 18, 12);
    g.r(11, 20, 4, 1, 3);
    g.r(8, 21, 10, 3, 10); g.r(12, 21, 2, 3, 1);
  }), 1));
  FS.dys = [0, 1].map(f => spr(26, 26, g => {
    g.each((x, y) => (y > 12 && (x < 5 || x > 20) && y < 26 - (f ? 0 : 1)) ? 8 : 0); g.r(3, 20, 20, 6, 8); g.r(8, 22, 10, 4, 9);
    g.e(13, 13, 8.5, 10, 2);
    g.e(13, 8, 10.5, 8.5, 3); g.r(3, 8, 3, 13, 3); g.r(20, 8, 3, 13, 3); g.r(3, 18, 3, 3, 4); g.r(20, 18, 3, 3, 4);
    g.r(12, 0, 3, 13, 4); g.r(13, 0, 1, 12, 5); g.e(13, 4, 6, 3, 5);
    g.each((x, y) => (y >= 10 && y <= 12 && Math.abs(x + .5 - 13) < 8 - Math.abs(y - 11) && Math.abs(x + .5 - 13) > 1) ? 3 : 0);
    g.p(13, 9, 10);
    for (const ex of [9, 17]) { g.r(ex - 2, 14, 5, 1, 6); g.r(ex - 2, 16, 5, 1, 6); g.r(ex - 2, 15, 5, 1, 1); g.p(ex - 1, 15, 7); g.p(ex + 1, 15, 7); }
    st(g, kana3, 12, 17, 6); g.r(10, 22, 7, 1, 6);
  }));
  // ---------- enemies (shared small palette per sprite) ----------
  FP.cam = pal('#000000', '#494949', '#6d6d6d', '#242424', '#24dbff', '#ff2424', '#ffffff', '#b6b6b6');
  FS.cam = [0, 1].map(f => outline(spr(18, 12, g => { g.r(4, 2, 11, 8, 2); g.r(4, 2, 11, 2, 3); g.e(4, 6, 4, 4, 4); g.e(4, 6, 2.5, 2.5, 5); g.p(3, 5, 7); g.r(13, 0, 3, 2, 3); g.p(14, 3, f ? 6 : 4); g.r(15, 4, 3, 4, 8); }), 1));
  FP.ad = pal('#000000', '#f8f8f8', '#b6b6b6', '#2449db', '#ff2424', '#ffdb24', '#242424', '#ff6db6');
  FP.shop = pal('#000000', '#dbdbdb', '#b6b6b6', '#6d6d92', '#494969', '#ffdbb6', '#db9292', '#242424', '#ff6db6', '#24b6b6');
  FS.shopper = [0, 1].map(f => outline(spr(14, 26, g => { g.e(7, 5, 4.5, 5, 6); g.r(7, 2, 4, 6, 7); g.r(2, 10, 10, 10, f ? 9 : 8); g.r(2, 10, 3, 10, 2); g.r(0, 11, 2, 7, 2); g.r(12, 11, 2, 7 + f, 2); g.r(3, 20, 3, 6 - f, 4); g.r(8, 20, 3, 5 + f, 4); }), 1));
  FS.cart = outline(spr(20, 14, g => { g.r(2, 1, 16, 8, 2); for (let x = 3; x < 18; x += 3) g.r(x, 2, 1, 6, 3); g.r(2, 1, 16, 1, 3); g.r(0, 0, 3, 2, 3); g.r(3, 9, 14, 1, 3); g.e(5, 12, 1.5, 1.5, 7); g.e(15, 12, 1.5, 1.5, 7); }), 1);
  FP.pretz = pal('#000000', '#b66d24', '#dba249', '#ffffff', '#6d4924');
  FS.pretzel = outline(spr(12, 10, g => { g.e(3.5, 5, 3.5, 3.5, 2); g.e(8.5, 5, 3.5, 3.5, 2); g.e(3.5, 5, 1.5, 1.5, 0); g.e(8.5, 5, 1.5, 1.5, 0); g.p(3, 3, 3); g.p(9, 7, 3); g.p(6, 1, 5); }), 1);
  // red faces: ghost's security. four shades of red, because the new hardware can't draw him either
  FP.red = legacyPal(pal('#000000', '#ff6d6d', '#b62424', '#ffdbdb', '#490000'), 'red');
  FS.redface = [0, 1].map(f => outline(spr(18, 16, g => { g.r(1, 1, 16, 13, 2); g.r(2, 2, 14, 11, 3); g.r(5, 5, 2, 3, 1); g.r(11, 5, 2, 3, 1); if (f) g.e(9, 10, 3, 1.5, 1); else g.r(5, 10, 8, 1, 1); g.r(3, 14, 3, 2, 2); g.r(12, 14, 3, 2, 2); }), 1));
  FS.wife = [0, 1].map(f => outline(spr(16, 18, g => { g.e(8, 7, 6, 6.5, 4); g.r(2, 7, 12, 8, 4); for (let x = 2; x < 14; x += 3) g.r(x, 15, 2, 2 + ((x + f) & 1), 4); g.e(8, 3, 7, 3, 2); g.r(5, 6, 2, 2, 1); g.r(9, 6, 2, 2, 1); g.r(6, 10, 4, 1, 1); }), 1));
  FP.tech = pal('#101018', '#f0c8a0', '#c89878', '#503020', '#f0f0f8', '#b8b8d0', '#303848', '#181820', '#40a0f0', '#f8d820');
  FS.tech = [0, 1].map(f => outline(spr(16, 18, g => { g.e(8, 5, 4, 4.5, 2); g.e(8, 2, 4.5, 2.5, 4); g.r(4, 4, 8, 2, 9); g.r(3, 9, 10, 7, 5); g.r(10, 9, 3, 7, 6); g.r(0, 10 + f, 3, 2, 5); g.r(13, 10 - f, 3, 2, 5); g.r(5, 16, 2, 2, 8); g.r(9, 16, 2, 2, 8); g.p(7, 6, 1); g.p(9, 6, 1); }), 1));
  FP.paper = pal('#000000', '#ffffff', '#dbdbdb', '#2449b6', '#ff2424', '#6d6d6d', '#b6926d', '#926d49');
  FS.paper = [0, 1].map(f => outline(spr(12, 14, g => { g.r(1, 0, 10, 14, 2); g.r(8, 0, 3, 3, 3); for (let y = 4; y < 13; y += 2) g.r(2, y, 7 - (y % 4 ? 2 : 0), 1, 6); g.r(2, 1, 5, 2, f ? 5 : 4); }), 1));
  FS.cabinet = outline(spr(16, 26, g => { g.r(0, 0, 16, 26, 6); g.r(0, 0, 16, 1, 3); for (let y = 2; y < 26; y += 8) { g.r(2, y, 12, 6, 3); g.r(6, y + 2, 4, 1, 1); } }), 1);
  FP.curse = pal('#000000', '#240000', '#b60000', '#ff2424', '#ffffff', '#490024', '#ff6d24');
  FS.curse = [0, 1, 2].map(f => spr(16, 16, g => { g.each((x, y) => { const d = (x - 7.5) ** 2 + (y - 7.5) ** 2; return d < 56 ? ((x * 7 + y * 13 + f * 5) % 11 < 2 ? 3 : (x + y + f) % 4 ? 1 : 2) : 0; }); g.r(3, 5, 3, 2, 4); g.r(10, 5 + (f === 1 ? 1 : 0), 3, 2, 4); g.r(4, 10, 8, 2 + (f & 1), 3); g.p(6, 11, 1); g.p(9, 11, 1); }));
  FP.lbot = legacyPal(pal('#000000', '#ffdbdb', '#ff6db6', '#b62492', '#242424', '#ffffff'), 'pink');
  FS.lbot = [0, 1].map(f => outline(spr(16, 20, g => { g.e(8, 6, 5, 5.5, 3); g.e(8, 7, 3.8, 4.2, 1); g.r(5, 6, 2, 1, 4); g.r(9, 6, 2, 1, 4); g.r(6, 9, 4, 1, 4); g.r(3, 12, 10, 6, 2); g.r(7, 12, 2, 6, 4); g.r(4, 18, 2, 2, 4); g.r(10, 18, 2, 2, 4); g.p(2 + f, 13, 2); }), 1));
  FP.item = pal('#000000', '#6dff24', '#ff24db', '#ffffff', '#ffdb24', '#24dbff', '#b6b6b6', '#920092', '#24b600');
  FS.orb = [0, 1, 2, 3].map(f => spr(7, 7, g => { const c = f & 1 ? 3 : 2, d = f & 1 ? 8 : 9; g.r(3, 0, 1, 7, d); g.r(0, 3, 7, 1, d); g.r(2, 1, 3, 5, c); g.r(1, 2, 5, 3, c); g.p(3, 3, 4); if (f > 1) g.p(2, 2, 4); }));
  FS.bulb = [0, 1].map(f => outline(spr(12, 14, g => { g.e(6, 5, 5, 5, f ? 4 : 5); g.r(4, 10, 4, 3, 7); g.r(4, 11, 4, 1, 1); g.p(4, 3, 4); g.r(5, 6, 1, 3, 3); g.r(7, 6, 1, 3, 3); g.p(6, 5, 3); }), 1));
  FS.backup = outline(spr(12, 12, g => { g.r(0, 1, 12, 10, 6); g.r(1, 2, 10, 8, 1); g.r(3, 4, 2, 2, 2); g.r(7, 4, 2, 2, 2); g.r(3, 7, 6, 1, 2); }), 1);
  // the armada, flat, for the 2d warworld sky
  FP.fleet = pal('#000000', '#242449', '#49496d', '#ff2424', '#92ffff', '#000024');
  FS.ship = spr(40, 10, g => { g.r(4, 3, 32, 4, 1); g.r(0, 4, 6, 2, 2); g.r(10, 1, 14, 2, 2); g.r(26, 2, 8, 2, 1); g.r(30, 7, 8, 2, 1); for (let x = 8; x < 34; x += 6) g.p(x, 5, 3); g.p(2, 5, 4); });
})();
// the head for the current form, the frame, and where its third eye sits (offset from the sprite's top-left)
const FORMART = {
  new: { s: f => FS.new[(f & 255) < 6 ? 2 : (f >> 3) & 1], P: FP.new, w: 24, h: 26, eye: [12, 7] },
  old: { s: f => FS.old[(f >> 4) & 1], P: FP.old, w: 24, h: 26, eye: [12, 5] },
  pilot: { s: f => FS.pilot[(f >> 3) & 1], P: FP.pilot, w: 26, h: 24, eye: [13, 9] },
  dys: { s: f => FS.dys[(f >> 3) & 1], P: FP.dys, w: 26, h: 26, eye: [13, 9] },
};
