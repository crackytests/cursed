'use strict';
// ================= PRETEND CO. SUPER-16 — cast library (FACE / YOKO era) =================
// 48x48 portraits for the whole cast, drawn in full color from the reference art.
// Gen-1 characters are registered crushed to their own cartridge's four shades (legacyPal): the new hardware still can't draw them.
// Requires engine2.js and pk/pkart.js (portrait(), reg()). Everything lives on CAST to stay out of the shared global scope.
const CAST = { P: {}, S: {}, full: {} };
(() => {
  const P = CAST.P, S = CAST.S;
  // tiny glyph stamps (for え, 天, letters on faces)
  const stamp = (g, rows, x, y, c) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') g.p(x + i, y + j, c); });
  const E_KANA = ['..#..', '#####', '...#.', '..#..', '.#.#.', '#..##'];
  const TEN = ['#####', '..#..', '#####', '.#.#.', '#...#'];
  CAST.E_KANA = E_KANA; CAST.TEN = TEN; CAST.stamp = stamp;
  // edge pass: pixels of color `from` touching color `bgs` (or 0) become `to`
  const edge = (g, from, to, bgs) => { const hits = []; for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { if (g.get(x, y) !== from) continue; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = g.get(x + dx, y + dy); if (bgs.includes(n)) { hits.push([x, y]); break; } } } hits.forEach(([x, y]) => g.p(x, y, to)); };
  const wave = (g, x0, y0, w, c, ph = 0) => { for (let i = 0; i < w; i++) g.p(x0 + i, y0 + Math.round(Math.sin(i * 1.3 + ph) * (i % 3 === 1 ? 1.4 : .6)), c); };

  // ---------------- NEW FACE: black cowl, magenta neon, green third eye, え nose, dashed green mouth ----------------
  P.newface = pal('#000000', '#000024', '#24246d', '#ff24db', '#920092', '#6dff24', '#24b600', '#24dbff', '#240049', '#490092', '#000012', '#ffffff', '#006d6d', '#ff49ff');
  const inHead = (x, y) => { const dx = (x + .5 - 24) / 11, dy = (y + .5 - 23) / 13.5; if (dx * dx + dy * dy <= 1) return true;
    if (y >= 8 && y <= 16 && x >= 13 && x <= 34) return true;
    const l = x >= 13 && y >= 2 && y <= 12 && (x - 13) <= (y - 2) * .75, r = x <= 34 && y >= 2 && y <= 12 && (34 - x) <= (y - 2) * .75; return l || r; };
  S.newface = (mood = 0) => portrait(g => {
    g.r(0, 0, 48, 48, 9); for (let y = 2; y < 48; y += 7) g.r(0, y, 48, 1, 10);
    for (const [x, y] of [[1, 6], [41, 4], [1, 26], [42, 22]]) { g.e(x + 3, y + 5, 3.5, 5.5, 13); g.p(x + 2, y + 4, 4); g.p(x + 4, y + 4, 4); g.r(x + 2, y + 7, 3, 1, 4); }
    g.r(3, 17, 6, 5, 10); frame4(g, 3, 17, 6, 5, 8); g.r(39, 34, 7, 6, 10); frame4(g, 39, 34, 7, 6, 8);
    // collar flaps + chest gem
    g.each((x, y) => { if (y < 33) return 0; const d = Math.abs(x + .5 - 24); return d <= 4 + (y - 33) * .35 ? 1 : d <= 13 + (y - 33) * .6 ? 11 : 0; });
    g.line(11, 47, 16, 33, 4); g.line(36, 47, 31, 33, 4); g.line(19, 36, 22, 47, 4); g.line(28, 36, 25, 47, 4);
    g.e(24, 42, 2.6, 3.2, 14); g.p(24, 41, 12); g.p(23, 44, 5); g.p(25, 44, 5);
    // head
    g.each((x, y) => inHead(x, y) ? 2 : 0);
    g.each((x, y) => { if (!inHead(x, y)) return 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!inHead(x + dx, y + dy)) return 4; return 0; });
    for (const [x, y] of [[16, 14], [15, 16], [15, 18], [16, 19], [17, 12]]) g.p(x, y, 3);
    // crest V + third eye
    g.line(16, 7, 24, 17, 4); g.line(32, 7, 24, 17, 4); g.line(17, 7, 24, 16, 5); g.line(31, 7, 24, 16, 5);
    g.e(24, 11, 2.5, 2.5, 6); g.e(24, 11, 1.2, 1.2, 1); g.p(23, 10, 12);
    for (const ex of [18.5, 29.5]) {
      const h = mood === 2 ? 1.5 : 2.4, x0 = Math.floor(ex);
      g.e(ex, 22, 5, h + .7, 4); g.e(ex, 22, 3.8, h - .5, 1); wave(g, x0 - 3, 22, 7, 6, ex);
      if (mood === 1) g.r(x0 - 4, 19, 9, 1, 2);
    }
    stamp(g, E_KANA, 22, 25, 4);
    if (mood === 3) { for (let x = 19; x <= 29; x++) g.p(x, 32 + Math.round(Math.sin(x * 1.1)), 6); }
    else for (let x = 19; x <= 29; x++) if (x % 3 !== 0) g.p(x, 32, 6);
  });
  function frame4(g, x, y, w, h, c) { g.r(x, y, w, 1, c); g.r(x, y + h - 1, w, 1, c); g.r(x, y, 1, h, c); g.r(x + w - 1, y, 1, h, c); }

  // ---------------- OLD FACE: wireframe head, ring eyes, magenta mouth bar, green hands ----------------
  P.oldface = pal('#000000', '#24b6b6', '#006d6d', '#ff24db', '#920092', '#6dff24', '#24b600', '#000024', '#002424', '#49ff92', '#24926d', '#ffffff', '#ffb624');
  S.oldface = () => portrait(g => {
    g.r(0, 0, 48, 48, 8); for (let x = 0; x < 48; x += 6) g.r(x, 0, 1, 48, 9); for (let y = 3; y < 48; y += 6) g.r(0, y, 48, 1, 9);
    g.each((x, y) => { const dx = (x - 23.5) / 16, dy = (y - 20) / 17, d = dx * dx + dy * dy; return d <= 1 && d > .82 ? 2 : 0; });
    for (let k = -2; k <= 2; k++) g.each((x, y) => { const dx = (x - 23.5) / 16, dy = (y - 20) / 17; if (dx * dx + dy * dy > .82) return 0; return Math.abs(dx - k * .38 * Math.sqrt(Math.max(0, 1 - dy * dy))) < .035 ? 3 : 0; });
    for (const yy of [8, 14, 27, 33]) g.each((x, y) => { const dx = (x - 23.5) / 16, dy = (y - 20) / 17; return y === yy && dx * dx + dy * dy <= .82 ? 3 : 0; });
    for (const ex of [16, 31]) { g.e(ex, 18, 5.5, 4.5, 4); g.e(ex, 18, 4, 3, 1); g.e(ex, 18, 2.6, 2.6, 5); g.e(ex, 18, 1.4, 1.4, 1); wave(g, ex - 3, 18, 7, 6, ex); }
    stamp(g, E_KANA, 21, 22, 4);
    g.r(15, 29, 18, 4, 4); for (let x = 16; x < 33; x += 3) g.r(x, 30, 2, 2, 5); g.r(13, 30, 2, 2, 4); g.r(33, 30, 2, 2, 4);
    // hands + sparks
    const hand = (x, fl) => { g.e(x + 6, 43, 7, 5, 10); for (let i = 0; i < 4; i++) g.r(x + (fl ? 12 - i * 3 : i * 3), 34 + (i === 0 || i === 3 ? 3 : 0), 2, 7, 10); g.e(x + 6, 44, 5, 3, 11); };
    hand(1, 0); hand(34, 1);
    for (const [x, y] of [[22, 40], [25, 38], [20, 37], [27, 41], [24, 44]]) g.p(x, y, 13);
    g.r(18, 44, 12, 4, 7); g.r(18, 44, 12, 1, 6);
  });

  // ---------------- PILOT X: spiked black mane, red headband, neon glasses, 天, mint coat ----------------
  P.pilotx = pal('#000000', '#b66d49', '#924924', '#242424', '#492449', '#db2424', '#929292', '#dbff24', '#b60000', '#92dbb6', '#49926d', '#24244d', '#ffffdb', '#24006d', '#490092');
  S.pilotx = () => portrait(g => {
    g.r(0, 0, 48, 48, 14); for (let y = 30; y < 48; y += 4) for (let x = (y * 7) % 9; x < 48; x += 9) g.r(x, y, 2, 2, 15);
    // coat + bodysuit
    g.e(24, 50, 24, 13, 10); g.e(30, 51, 14, 12, 11);
    g.each((x, y) => { if (y < 36) return 0; const d = Math.abs(x - 24); return d < (y - 34) * .8 ? 12 : 0; });
    g.r(20, 32, 9, 7, 12); g.line(17, 36, 12, 47, 11); g.line(31, 36, 36, 47, 11);
    // mane
    g.e(24, 16, 17, 14, 4);
    for (const [x0, y0, x1, y1] of [[8, 14, 1, 5], [9, 20, 0, 22], [11, 26, 3, 34], [38, 14, 46, 6], [39, 20, 47, 21], [37, 26, 45, 34], [14, 5, 10, 0], [22, 3, 20, 0], [30, 4, 33, 0], [36, 7, 42, 1]]) { g.line(x0, y0, x1, y1, 4); g.line(x0 + 1, y0, x1 + 1, y1, 4); g.line(x0, y0 + 1, x1, y1 + 1, 4); }
    for (const [x, y] of [[16, 6], [28, 5], [10, 15], [36, 12]]) g.line(x, y, x + 4, y + 3, 5);
    // face
    g.e(24, 25, 9.5, 11, 2); g.r(30, 20, 4, 12, 3); g.e(24, 33, 6, 3, 2);
    g.r(14, 12, 20, 3, 6); g.r(14, 14, 20, 1, 7); g.r(21, 12, 6, 3, 7); g.r(22, 13, 4, 1, 1);
    g.r(14, 15, 20, 4, 4); for (const x of [16, 20, 27, 31]) g.line(x, 15, x - 1, 19, 4);
    for (const ex of [19, 29]) { g.e(ex, 22, 4.6, 2.4, 8); g.e(ex, 22, 3.4, 1.4, 1); g.e(ex, 22, 1.2, 1.2, 9); }
    g.line(12, 19, 16, 21, 8); g.line(33, 21, 36, 19, 8);
    stamp(g, TEN, 22, 25, 13);
    g.r(21, 32, 6, 1, 3);
  });

  // ---------------- DYSLEXIO: Magneto-style helmet over the black face, cape, floating letters ----------------
  P.dyslexio = pal('#000000', '#000024', '#242449', '#b62449', '#6d0024', '#ff4992', '#ff24db', '#6dff24', '#6d0049', '#490024', '#ffdb24', '#ffffff', '#240024', '#490049');
  S.dyslexio = () => portrait(g => {
    g.r(0, 0, 48, 48, 13); for (let y = 0; y < 48; y += 5) g.r(0, y, 48, 1, 14);
    const L = { A: ['.#.', '#.#', '###', '#.#'], Z: ['###', '..#', '.#.', '###'], D: ['##.', '#.#', '#.#', '##.'], Q: ['###', '#.#', '###', '..#'], B: ['##.', '###', '#.#', '##.'], E: ['###', '##.', '#..', '###'] };
    for (const [k, x, y] of [['A', 2, 3], ['Z', 41, 5], ['D', 3, 30], ['Q', 42, 28], ['B', 6, 17], ['E', 39, 16]]) stamp(g, L[k], x, y, 11);
    g.e(24, 50, 24, 14, 9); g.e(24, 50, 16, 10, 10); g.r(17, 38, 14, 10, 4); g.r(22, 38, 4, 10, 5);
    g.each((x, y) => (y > 16 && y < 42 && (x < 8 || x > 39) && Math.abs(x - 23.5) < 22 - (y - 16) * .3) ? 9 : 0);
    g.e(24, 22, 12, 14, 2);
    g.e(24, 14, 15, 12, 4); g.r(9, 14, 5, 20, 4); g.r(34, 14, 5, 20, 4); g.r(10, 30, 4, 5, 5); g.r(34, 30, 4, 5, 5);
    g.e(24, 8, 10, 5, 6); g.r(22, 2, 4, 18, 5); g.r(23, 2, 2, 17, 6);
    g.each((x, y) => (y >= 17 && y <= 21 && Math.abs(x - 23.5) < 11 - Math.abs(y - 19) && Math.abs(x - 23.5) > 1.5) ? 4 : 0);
    g.r(14, 21, 20, 1, 5);
    g.e(24, 27, 9, 8, 2);
    for (const ex of [18, 30]) { g.e(ex, 24, 4.2, 2, 7); g.e(ex, 24, 3.2, 1.1, 1); wave(g, ex - 2, 24, 5, 8, 1); }
    stamp(g, E_KANA, 22, 27, 7);
    g.r(19, 34, 10, 1, 7); g.p(18, 35, 7); g.p(29, 35, 7);
  });

  // ---------------- BACKUP FACE: HR. a Face on a monitor with a lanyard ----------------
  P.backup = pal('#000000', '#244949', '#496d6d', '#92dbdb', '#002424', '#ffffff', '#2449db', '#6d6d92', '#dbdbdb', '#24ff24', '#242424', '#494949', '#b6b6b6');
  S.backup = () => portrait(g => {
    g.r(0, 0, 48, 48, 11); for (let x = 0; x < 48; x += 8) g.r(x, 0, 4, 48, 12);
    g.e(24, 52, 22, 12, 9); g.r(21, 38, 6, 10, 8); g.r(22, 40, 4, 6, 7);
    g.line(15, 38, 21, 46, 7); g.line(33, 38, 27, 46, 7); g.r(28, 42, 7, 6, 6); g.r(28, 42, 7, 2, 7);
    g.r(5, 3, 38, 32, 13); g.r(5, 3, 38, 1, 6); g.r(7, 5, 34, 26, 2); g.r(8, 6, 32, 24, 3);
    g.r(20, 35, 8, 3, 13); g.p(38, 32, 10); g.p(37, 32, 10);
    for (const ex of [16, 32]) { g.r(ex - 4, 13, 8, 4, 4); g.r(ex - 2, 14, 3, 2, 5); }
    stamp(g, E_KANA, 22, 18, 4);
    g.r(17, 25, 14, 1, 4);
    for (let y = 7; y < 30; y += 2) g.r(8, y, 32, 1, 2);
  });

  // ---------------- YOKO (familiar): brown hair, lavender ribbed turtleneck, gold chain. neutral / smile ----------------
  P.yoko = pal('#241010', '#ffdbb6', '#db9292', '#6d4824', '#b66d49', '#492424', '#9292db', '#6d6db6', '#b6b6ff', '#db6d6d', '#492424', '#ffffff', '#dbb649', '#6d6d6d', '#494949');
  const yokoBody = (g, hairC, hairHi, hairDk, topC, topS, topR, bg1, bg2) => {
    g.r(0, 0, 48, 48, bg2); g.each((x, y) => (x + Math.sin(y * .4) * 3 < 20 ? bg1 : 0));
    g.e(24, 22, 15, 17, hairC); g.r(9, 20, 30, 20, hairC); g.e(24, 40, 15, 4, hairC);
    for (const x of [10, 12, 36, 38]) g.r(x, 26, 1, 14, hairDk);
    g.e(24, 52, 22, 14, topC); g.e(34, 52, 12, 14, topS);
    g.each((x, y) => (y > 40 && g.get(x, y) === topC && x % 2 === 0) ? topR : 0);
    g.r(19, 29, 10, 8, 2); g.r(26, 29, 3, 7, 3);
    g.r(17, 35, 14, 6, topC); g.r(17, 35, 14, 1, topR); for (let x = 18; x < 31; x += 2) g.r(x, 36, 1, 5, topS);
  };
  S.yoko = (smile = 0) => portrait(g => {
    yokoBody(g, 4, 5, 6, 7, 8, 9, 14, 15);
    g.e(24, 21, 10, 12.5, 2); g.r(30, 17, 4, 12, 3);
    g.e(24, 11, 12, 6, 4); g.line(24, 7, 14, 21, 4); g.line(24, 7, 15, 21, 4); g.line(23, 8, 13, 22, 4); g.line(24, 7, 33, 21, 4); g.line(24, 7, 32, 20, 4); g.line(25, 8, 34, 22, 4);
    g.r(12, 14, 3, 18, 4); g.r(33, 14, 3, 18, 4); g.line(17, 10, 21, 8, 5); g.line(27, 8, 31, 11, 5); g.p(24, 7, 6);
    for (const ex of [19, 29]) {
      g.r(ex - 3, 17, 5, 1, 6);
      if (smile) { g.r(ex - 2, 21, 4, 1, 1); g.r(ex - 1, 22, 2, 1, 11); g.p(ex - 3, 22, 1); g.p(ex + 2, 22, 1); }
      else { g.r(ex - 3, 20, 6, 1, 1); g.r(ex - 2, 21, 4, 2, 12); g.r(ex - 1, 21, 2, 2, 11); g.p(ex, 21, 12); }
    }
    g.p(24, 25, 3); g.p(24, 26, 3);
    if (smile) { g.r(22, 29, 5, 1, 10); g.p(21, 28, 10); g.p(27, 28, 10); } else { g.r(22, 29, 5, 1, 10); g.r(23, 30, 3, 1, 3); }
    g.line(19, 37, 24, 41, 13); g.line(29, 37, 24, 41, 13); g.r(23, 41, 3, 3, 13); g.p(24, 42, 5);
  });

  // ---------------- EVIL YOKO / THE EMPRESS: long dark waves, glowing eyes, circuitry, cosmic dress, runes ----------------
  P.empress = pal('#000024', '#ffdbb6', '#db9292', '#241c24', '#49496d', '#6dffff', '#0049b6', '#242449', '#b6b6ff', '#6d49b6', '#db92ff', '#ffffff', '#24dbff', '#000049', '#2449b6');
  S.empress = (smile = 1) => portrait(g => {
    g.r(0, 0, 48, 48, 14);
    for (const cx of [3, 44]) for (let y = 1; y < 46; y += 5) { g.r(cx - 1, y, 3, 1, 15); g.p(cx - 1, y + 2, 15); g.p(cx + 1, y + 2, 15); g.p(cx, y + 3, 15); }
    g.each((x, y) => { const dx = x - 24, dy = (y - 40) * 2.6; const r = Math.sqrt(dx * dx + dy * dy); return Math.abs(r - 26) < .7 ? 15 : 0; });
    g.e(24, 22, 17, 19, 4); g.r(6, 20, 36, 26, 4);
    for (let y = 18; y < 48; y++) { g.p(6 + Math.round(Math.sin(y * .5) * 2), y, 4); g.p(41 + Math.round(Math.sin(y * .5 + 1) * 2), y, 4); if (y % 3 === 0) { g.p(8 + Math.round(Math.sin(y * .5) * 2), y, 5); g.p(39 + Math.round(Math.sin(y * .5 + 1) * 2), y, 5); } }
    g.e(24, 50, 16, 14, 8); for (let i = 0; i < 18; i++) g.p(12 + (i * 13) % 24, 40 + (i * 7) % 8, i % 3 ? 9 : 12); g.e(24, 46, 5, 4, 10);
    g.r(19, 30, 10, 8, 2); g.r(26, 30, 3, 6, 3); g.r(19, 35, 10, 5, 8); g.r(19, 35, 10, 1, 9); g.e(24, 38, 1.5, 1.5, 11); g.line(24, 40, 24, 47, 9);
    g.e(24, 21, 9.5, 12, 2); g.r(30, 18, 3, 10, 3);
    g.e(24, 11, 12, 6, 4); g.line(24, 7, 14, 22, 4); g.line(24, 7, 34, 22, 4); g.line(24, 7, 13, 24, 4); g.line(24, 7, 35, 24, 4); g.r(12, 12, 3, 22, 4); g.r(33, 12, 3, 22, 4); g.line(17, 10, 22, 8, 5);
    for (const ex of [19, 29]) { g.r(ex - 3, 17, 5, 1, 4); g.r(ex - 3, 20, 6, 1, 1); g.r(ex - 2, 21, 4, 2, 6); g.r(ex - 1, 21, 2, 2, 7); g.p(ex, 21, 12); }
    g.r(31, 14, 3, 1, 13); g.r(33, 14, 1, 5, 13); g.r(33, 18, 2, 1, 13); g.p(31, 13, 12); g.r(15, 26, 1, 3, 13); g.r(13, 28, 3, 1, 13); g.p(13, 27, 12); g.r(20, 13, 1, 2, 13); g.r(20, 13, 3, 1, 13);
    g.p(24, 25, 3); if (smile) { g.r(22, 29, 5, 1, 3); g.p(21, 28, 3); g.p(27, 28, 3); } else g.r(22, 29, 5, 1, 3);
  });

  // ---------------- WARWORLD YOKO: brown bob, navy bodysuit, cybernetic arm, lightning ----------------
  P.warworld = pal('#000000', '#ffdbb6', '#db9292', '#6d2424', '#b64924', '#b62424', '#24246d', '#000049', '#242424', '#494949', '#ff2424', '#ffffff', '#92ffff', '#24246d', '#6d2492');
  S.warworld = () => portrait(g => {
    g.r(0, 0, 48, 48, 14); g.each((x, y) => (x + y * .6 > 40 ? 15 : 0));
    let x = 4; for (let y = 0; y < 26; y++) { x += (y * 7 % 3) - 1; g.p(x, y, 13); } x = 44; for (let y = 4; y < 30; y++) { x += (y * 5 % 3) - 1; g.p(x, y, 13); g.p(x + 1, y, 13); }
    g.e(24, 51, 22, 13, 7); g.e(16, 51, 10, 13, 8); g.e(36, 44, 9, 8, 9); g.e(36, 44, 6, 5, 10); g.e(36, 44, 1.5, 1.5, 11);
    g.r(20, 29, 9, 9, 2); g.r(26, 29, 3, 8, 3); g.r(18, 35, 13, 6, 7); g.r(18, 35, 13, 1, 8);
    g.e(24, 18, 14, 13, 4); g.r(10, 16, 28, 14, 4); g.each((x, y) => (y > 26 && y < 31 && g.get(x, y) === 4 && x % 3 === 0) ? 5 : 0);
    g.e(24, 21, 9.5, 11.5, 2); g.r(30, 18, 3, 10, 3);
    g.e(24, 11, 12, 5, 4); g.line(28, 7, 16, 18, 4); g.line(29, 8, 17, 19, 4); g.line(31, 9, 33, 18, 4); g.line(18, 9, 24, 7, 5);
    for (const ex of [19, 29]) { g.r(ex - 3, 18, 6, 1, 4); g.r(ex - 3, 20, 6, 1, 1); g.r(ex - 2, 21, 4, 2, 12); g.r(ex - 1, 21, 2, 2, 6); }
    g.p(24, 25, 3); g.r(22, 29, 4, 1, 3);
  });

  // ---------------- YOKOID: a manufactured Yoko. pleasant, seamed, headset ----------------
  P.yokoid = pal('#241024', '#ffdbdb', '#dbb6b6', '#926d49', '#b6926d', '#6d4924', '#b692db', '#926db6', '#dbb6ff', '#db9292', '#92b6db', '#ffffff', '#6db6db', '#dbdbdb', '#b6b6b6');
  S.yokoid = () => portrait(g => {
    yokoBody(g, 4, 5, 6, 7, 8, 9, 14, 15);
    g.e(24, 21, 10, 12.5, 2); g.r(30, 17, 4, 12, 3);
    g.e(24, 11, 12, 6, 4); g.line(24, 7, 14, 21, 4); g.line(24, 7, 33, 21, 4); g.r(12, 14, 3, 18, 4); g.r(33, 14, 3, 18, 4);
    for (const ex of [19, 29]) { g.r(ex - 3, 20, 6, 1, 1); g.r(ex - 2, 21, 4, 2, 11); g.p(ex - 1, 21, 12); }
    g.r(22, 29, 5, 1, 10); g.p(21, 28, 10); g.p(27, 28, 10);
    g.r(15, 28, 4, 1, 13); g.r(30, 28, 4, 1, 13); g.r(15, 14, 1, 6, 13); g.r(33, 14, 1, 6, 13); g.r(20, 13, 9, 1, 13);
    g.r(10, 18, 3, 7, 1); g.line(12, 25, 19, 30, 1); g.r(19, 29, 2, 2, 13);
    g.r(26, 43, 7, 4, 12); g.r(27, 44, 2, 2, 7); g.r(30, 44, 2, 2, 7);
  });

  // ---------------- SPOOKY GHOST: white sheet, oval eyes, fanged grin, glitch ----------------
  P.ghost = pal('#000000', '#ffffff', '#dbdbff', '#9292db', '#b649ff', '#49dbff', '#240024', '#490024', '#b62424', '#240000');
  S.ghost = () => portrait(g => {
    g.r(0, 0, 48, 48, 10); g.e(30, 26, 22, 22, 8); g.e(30, 26, 15, 15, 9); g.e(30, 26, 12, 12, 10);
    g.e(24, 20, 14, 16, 2); g.r(10, 20, 28, 20, 2); g.e(24, 44, 18, 8, 2);
    g.line(11, 22, 3, 8, 2); g.line(12, 22, 4, 7, 2); g.line(12, 24, 2, 11, 2); g.r(2, 5, 3, 4, 2); g.r(5, 4, 2, 3, 2);
    for (let x = 6; x < 44; x += 4) g.r(x, 45 + (x % 8 ? 0 : 2), 3, 3, 3);
    g.each((x, y) => (g.get(x, y) === 2 && x > 29 && (x + y) % 2 === 0) ? 3 : 0); g.each((x, y) => (g.get(x, y) === 2 && x > 35) ? 4 : 0);
    edge(g, 2, 5, [10, 8, 9]); edge(g, 3, 6, [10, 8, 9]);
    g.e(19, 17, 3, 5, 1); g.e(29, 17, 3, 5, 1); g.p(18, 15, 3); g.p(28, 15, 3);
    g.each((x, y) => { const dx = (x - 23.5) / 8, dy = (y - 26) / 6; return dy >= 0 && dx * dx + dy * dy <= 1 ? 1 : 0; });
    g.r(16, 26, 16, 1, 1); g.e(24, 30, 4, 2, 7); g.r(19, 27, 2, 2, 2); g.r(27, 27, 2, 2, 2); g.p(19, 29, 2); g.p(28, 29, 2);
    for (const y of [9, 23, 36]) { g.r(34, y, 12, 1, 6); g.r(0, y + 3, 8, 1, 5); }
  });

  // ---------------- CEO LINDA: pink updo, pink shadow, dark lips, striped blouse and bow ----------------
  P.linda = pal('#000000', '#ffdbdb', '#db9292', '#ff6db6', '#ffb6db', '#b62492', '#ff49b6', '#6d4949', '#6d2449', '#ff6db6', '#242424', '#242424', '#494949', '#000024', '#24246d');
  S.linda = () => portrait(g => {
    g.r(0, 0, 48, 48, 14); g.r(38, 18, 10, 4, 15); g.r(40, 30, 8, 3, 15);
    g.e(24, 51, 23, 14, 12); g.e(34, 50, 12, 13, 13);
    g.each((x, y) => (y > 37 && Math.abs(x - 24) < 9) ? (x % 3 === 0 ? 11 : 10) : 0);
    g.r(20, 29, 9, 9, 2); g.r(26, 29, 3, 8, 3); g.r(18, 34, 13, 3, 11);
    g.e(20, 38, 4, 2.5, 10); g.e(28, 38, 4, 2.5, 10); g.r(23, 37, 3, 3, 6);
    g.e(26, 21, 10.5, 12.5, 2); g.r(32, 18, 4, 11, 3);
    g.e(16, 11, 11, 9, 4); g.e(12, 22, 7, 10, 4); g.e(20, 5, 10, 5, 4); g.e(36, 20, 5, 10, 4); g.e(30, 10, 9, 5, 4);
    g.line(9, 8, 20, 3, 5); g.line(8, 14, 12, 26, 5); g.line(26, 7, 34, 10, 5); g.line(10, 28, 14, 32, 6); g.line(36, 25, 38, 30, 6);
    for (const ex of [21, 31]) { g.r(ex - 3, 17, 7, 2, 6); g.r(ex - 3, 19, 7, 1, 7); g.r(ex - 3, 21, 7, 1, 1); g.r(ex - 2, 22, 5, 1, 8); g.p(ex, 22, 1); }
    g.p(26, 25, 3); g.p(27, 26, 3); g.r(23, 30, 7, 1, 9); g.r(24, 31, 5, 1, 9);
  });

  // ---------------- CARL: green alien, huge green eyes, backwards black cap, hoodie with gold trim ----------------
  P.carl = pal('#000000', '#6db66d', '#249249', '#242424', '#494949', '#6dff24', '#004900', '#ffffff', '#242424', '#dbb624', '#492424', '#002449', '#00496d');
  S.carl = () => portrait(g => {
    g.r(0, 0, 48, 48, 12); g.r(0, 0, 10, 48, 13); g.r(40, 10, 8, 24, 13);
    g.e(24, 51, 21, 12, 9); g.line(16, 40, 20, 47, 10); g.line(32, 40, 28, 47, 10); g.e(24, 45, 3, 2, 10);
    g.r(20, 33, 8, 7, 2); g.r(25, 33, 3, 6, 3);
    g.e(24, 23, 15, 13.5, 2); g.e(33, 25, 6, 10, 3); g.e(24, 31, 10, 6, 2);
    g.e(23, 12, 14, 7, 4); g.r(9, 12, 29, 4, 4); g.r(34, 12, 12, 3, 4); g.r(36, 14, 9, 1, 5); g.e(22, 8, 8, 3, 5); g.p(22, 6, 1);
    for (const [ex, ey] of [[17, 23], [31, 23]]) { g.e(ex, ey, 5.5, 5.5, 8); g.e(ex, ey, 4.5, 4.8, 6); g.e(ex + 1, ey + 1, 2.2, 2.4, 7); g.r(ex - 2, ey - 3, 2, 2, 8); g.p(ex + 2, ey + 2, 8); }
    g.p(23, 30, 3); g.p(25, 30, 3); g.e(24, 34, 2, 1.2, 11);
  });

  // ---------------- TP: a square face. that's the whole face ----------------
  P.tp = pal('#000000', '#dbdbb6', '#b6b692', '#6d4924', '#ffffff', '#242424', '#926d49', '#494949', '#6d6d6d');
  S.tp = () => portrait(g => {
    g.r(0, 0, 48, 48, 8); g.r(0, 0, 48, 6, 9);
    g.r(7, 5, 34, 38, 2); g.r(7, 5, 34, 2, 3); g.r(37, 5, 4, 38, 3); g.r(7, 40, 34, 3, 3);
    g.line(13, 16, 20, 14, 4); g.line(28, 14, 35, 16, 4);
    for (const ex of [17, 31]) { g.e(ex, 21, 4, 4, 5); g.e(ex, 21, 2, 2.2, 6); g.p(ex - 1, 20, 5); }
    g.r(19, 32, 10, 1, 7); g.p(18, 31, 7); g.p(29, 31, 7); g.r(22, 33, 4, 1, 3);
  });

  // ---------------- JB GARFIELD: detective. fedora, trench coat, half-lidded disapproval ----------------
  P.garfield = pal('#000000', '#ff9224', '#db6d00', '#924900', '#ffffdb', '#b6b6b6', '#6d6d6d', '#242424', '#dbb692', '#926d49', '#ffffff', '#242424', '#242449', '#6d2449', '#ffb600');
  S.garfield = () => portrait(g => {
    g.r(0, 0, 48, 48, 13); for (let y = 4; y < 48; y += 11) g.r(0, y, 48, 1, 14); for (const [x, y] of [[3, 8], [42, 20], [5, 31], [41, 38]]) { g.r(x, y, 4, 6, 14); g.r(x, y + 1, 4, 1, 15); }
    g.e(24, 50, 23, 12, 9); g.e(34, 50, 11, 12, 10); g.line(14, 38, 22, 47, 10); g.line(34, 38, 26, 47, 10); g.r(21, 42, 6, 6, 5); g.r(23, 42, 2, 6, 12);
    g.e(24, 25, 17, 13, 2); g.e(33, 27, 8, 10, 3);
    for (const [x0, y0, x1, y1] of [[8, 25, 13, 26], [8, 29, 13, 29], [40, 25, 35, 26], [40, 29, 35, 29], [22, 14, 22, 17], [26, 14, 26, 17]]) g.line(x0, y0, x1, y1, 4);
    g.e(24, 31, 9, 6, 5); g.e(24, 28, 2.2, 1.5, 12); g.line(24, 30, 24, 32, 1); g.line(20, 34, 24, 32, 1); g.line(28, 34, 24, 32, 1);
    for (const ex of [17, 31]) { g.e(ex, 21, 5.5, 4.5, 11); g.r(ex - 6, 16, 12, 5, 2); g.r(ex - 5, 20, 11, 1, 1); g.r(ex - 1 + (ex < 24 ? 1 : -1), 22, 3, 3, 1); }
    g.r(11, 3, 26, 10, 6); g.r(11, 3, 26, 2, 7); g.r(22, 3, 4, 3, 7); g.e(24, 13, 23, 3.5, 6); g.e(24, 14, 23, 1.5, 7); g.r(11, 10, 26, 2, 8);
  });

  // ---------------- small NPCs ----------------
  P.clerk = pal('#101018', '#f0c8a0', '#c89878', '#6d6d6d', '#dbb649', '#926d24', '#ffffff', '#492424', '#242449', '#49496d');
  S.clerk = () => portrait(g => { g.r(0, 0, 48, 48, 9); for (let y = 0; y < 48; y += 6) g.r(0, y, 48, 3, 10); g.e(24, 50, 20, 11, 5); g.r(20, 36, 8, 6, 7); g.e(24, 24, 12, 15, 2); g.r(31, 16, 4, 16, 3); g.e(24, 11, 13, 6, 4); g.r(15, 20, 7, 4, 7); g.r(26, 20, 7, 4, 7); g.r(17, 21, 3, 2, 1); g.r(28, 21, 3, 2, 1); g.r(14, 20, 20, 1, 1); g.r(20, 32, 8, 1, 3); g.r(28, 38, 6, 5, 7); g.r(29, 39, 4, 1, 8); });
  // a generic "Karl"-style recolor helper for the Mandolin reality (full color = their potential, realized)
  CAST.variant = (key, changes) => { const P0 = P[key].slice(); for (const k in changes) P0[k] = hex(changes[k]); return P0; };

  // ---------------- build + register ----------------
  const LEG_TONE = { carl: 'dmg', linda: 'pink', ghost: 'red', tp: 'gray', oldface: 'dmg', redface: 'red' };
  CAST.img = { newface: S.newface(0), faceSkeptic: S.newface(1), faceSquint: S.newface(2), faceTalk: S.newface(3), oldface: S.oldface(), pilotx: S.pilotx(), dyslexio: S.dyslexio(), backup: S.backup(),
    yoko: S.yoko(0), yokoSmile: S.yoko(1), empress: S.empress(1), empressCold: S.empress(0), warworld: S.warworld(), yokoid: S.yokoid(),
    ghost: S.ghost(), linda: S.linda(), carl: S.carl(), tp: S.tp(), garfield: S.garfield(), clerk: S.clerk() };
  CAST.img.redface = S.newface(0); P.redface = P.newface;
  const at = (img, P0) => ({ s: img, P: P0 });
  CAST.port = {
    FACE: at(CAST.img.newface, P.newface), 'OLD FACE': at(CAST.img.oldface, legacyPal(P.oldface, 'dmg')), 'PILOT X': at(CAST.img.pilotx, P.pilotx), DYSLEXIO: at(CAST.img.dyslexio, P.dyslexio), 'BACKUP FACE': at(CAST.img.backup, P.backup),
    'RED FACE': at(CAST.img.redface, legacyPal(P.newface.map((c, i) => i === 0 ? 0 : mix(c, hex('#ff2020'), .5)), 'red')),
    YOKO: at(CAST.img.yoko, P.yoko), 'EVIL YOKO': at(CAST.img.empress, P.empress), 'THE EMPRESS': at(CAST.img.empress, P.empress), 'WARWORLD YOKO': at(CAST.img.warworld, P.warworld), YOKOID: at(CAST.img.yokoid, P.yokoid),
    'SPOOKY GHOST': at(CAST.img.ghost, legacyPal(P.ghost, 'red')), LINDA: at(CAST.img.linda, legacyPal(P.linda, 'pink')), 'CEO LINDA': at(CAST.img.linda, legacyPal(P.linda, 'pink')),
    CARL: at(CAST.img.carl, legacyPal(P.carl, 'dmg')), TP: at(CAST.img.tp, legacyPal(P.tp, 'gray')), 'JB GARFIELD': at(CAST.img.garfield, P.garfield), CLERK: at(CAST.img.clerk, P.clerk),
  };
  // full-color versions of the four-shade cast (for the one time the hardware can finally draw them)
  CAST.full = { CARL: at(CAST.img.carl, P.carl), LINDA: at(CAST.img.linda, P.linda), 'SPOOKY GHOST': at(CAST.img.ghost, P.ghost), TP: at(CAST.img.tp, P.tp), 'OLD FACE': at(CAST.img.oldface, P.oldface) };
  CAST.mood = { YOKO: { smile: at(CAST.img.yokoSmile, P.yoko) }, FACE: { skeptic: at(CAST.img.faceSkeptic, P.newface), squint: at(CAST.img.faceSquint, P.newface), talk: at(CAST.img.faceTalk, P.newface) }, 'EVIL YOKO': { cold: at(CAST.img.empressCold, P.empress) } };
  const V = { FACE: [450, 40], 'OLD FACE': [380, 30], 'PILOT X': [600, 60], DYSLEXIO: [300, 20], 'BACKUP FACE': [520, 5], 'RED FACE': [380, 60], YOKO: [1700, 30], 'EVIL YOKO': [1400, 10], 'THE EMPRESS': [1400, 10], 'WARWORLD YOKO': [1100, 20], YOKOID: [1900, 0],
    'SPOOKY GHOST': [1300, 400], LINDA: [520, 15], 'CEO LINDA': [520, 15], CARL: [980, 180], TP: [760, 140], 'JB GARFIELD': [260, 40], CLERK: [760, 60] };
  for (const n in CAST.port) { PORT[n] = CAST.port[n]; if (V[n]) VOICE[n] = V[n]; }
})();
