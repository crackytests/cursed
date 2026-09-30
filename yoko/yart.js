'use strict';
// ================= YOKO: WHAT HAPPENED — art: figures, the walking sprite, scene backgrounds =================
// The SUPERUSER draws Yokos in full color. Everyone from the first generation is still in four shades (CAST handles that).
const YP = {}, YS = {};
(() => {
  // a standing figure, 32x56. 1 outline 2 skin 3 skin-dk 4 hair 5 hair-hi 6 dress 7 dress-dk 8 trim 9 eye 10 accent 11 seam 12 prop 13 prop-dk
  const figure = (kind, f) => outline(spr(32, 56, g => {
    const bob = f & 1, ld = kind === 'linda' || kind === 'lindamax' || kind === 'prime';
    g.r(11, 42, 4, 12, 7); g.r(17, 42, 4, 12, 7); g.r(10, 53, 6, 3, 1); g.r(16, 53, 6, 3, 1);
    g.each((x, y) => (y >= 22 && y < 46 && Math.abs(x + .5 - 16) < 5 + (y - 22) * .28) ? 6 : 0); g.each((x, y) => (y >= 22 && y < 46 && x > 18 && g.get(x, y) === 6) ? 7 : 0);
    g.r(13, 22, 6, 3, 8); g.r(15, 25, 2, 6, 8);
    g.r(7, 23, 3, 13 + bob, 6); g.r(22, 23, 3, 13 - bob, 7); g.r(7, 35 + bob, 3, 3, 2); g.r(22, 35 - bob, 3, 3, 3);
    g.r(14, 18, 4, 4, 2);
    g.e(16, 12, 6, 7, 2); g.r(19, 8, 2, 8, 3);
    if (ld) { g.e(16, 6, 7, 5, 4); g.e(11, 3, 5, 4, 4); g.e(21, 10, 3, 6, 4); g.line(11, 2, 16, 1, 5); }
    else { g.e(16, 8, 7.5, 6, 4); g.r(9, 8, 3, 11, 4); g.r(20, 8, 3, 11, 4); g.line(16, 3, 11, 9, 5); g.line(16, 3, 21, 9, 4); }
    g.r(13, 12, 2, 2, 9); g.r(18, 12, 2, 2, 9); g.r(14, 16, 4, 1, 10);
    if (kind === 'yokoid' || kind === 'super') { g.r(9, 10, 2, 5, 1); g.line(10, 15, 12, 17, 1); g.r(13, 18, 6, 1, 11); }
    if (kind === 'super') { g.r(12, 27, 3, 3, 12); g.r(8, 20, 16, 2, 13); }
    if (kind === 'guard') { g.line(22, 26, 30, 18, 13); g.e(21, 30, 4, 5, 12); g.e(21, 30, 1.5, 1.5, 1); g.r(28, 16, 3, 3, 13); g.r(10, 4, 12, 3, 10); }
    if (kind === 'prime') { for (let i = 0; i < 5; i++) g.r(10 + i * 3, 0, 2, 3 - (i & 1), 12); }
  }), 1);
  YP.yokoid = pal('#241024', '#ffdbdb', '#dbb6b6', '#926d49', '#b6926d', '#b692db', '#926db6', '#ffffff', '#6d92b6', '#db6d6d', '#6db6db', '#ffdb24', '#6d49b6');
  YP.super = pal('#241024', '#ffdbdb', '#dbb6b6', '#6d4824', '#926d49', '#6d49b6', '#492492', '#ffffff', '#6d92b6', '#db6d6d', '#6db6db', '#ffdb24', '#b6926d');
  YP.linda = legacyPal(pal('#000000', '#ffdbdb', '#db9292', '#ff6db6', '#ffb6db', '#ff92b6', '#db6d92', '#ffffff', '#242424', '#6d2449', '#000000', '#ffffff', '#b6b6b6'), 'pink');
  YP.lindamax = pal('#240000', '#ffdbdb', '#db9292', '#ff2449', '#ff6d92', '#b60024', '#6d0012', '#ffdbdb', '#242424', '#6d0024', '#000000', '#ffdb24', '#b6b6b6');
  YP.prime = pal('#240012', '#ffdbdb', '#db9292', '#ff49b6', '#ffb6ff', '#242424', '#000000', '#ff49b6', '#ff2449', '#6d0024', '#000000', '#ffdb24', '#b6b6b6');
  YP.guard = pal('#102410', '#ffdbb6', '#db9292', '#6d4824', '#926d49', '#249249', '#006d24', '#ffdb24', '#242424', '#b64924', '#000000', '#dba249', '#6d4824');
  for (const k of ['yokoid', 'super', 'linda', 'lindamax', 'prime', 'guard']) YS[k] = [0, 1].map(f => figure(k === 'super' ? 'super' : k, f));
  // THE TEST: an obelisk that asks questions
  YP.test = pal('#000024', '#242449', '#49496d', '#24dbff', '#92ffff', '#ffffff', '#6d49b6', '#db92ff');
  YS.test = [0, 1].map(f => spr(48, 80, g => { g.each((x, y) => Math.abs(x + .5 - 24) < 10 + y * .12 ? (x < 24 ? 2 : 3) : 0); g.r(8, 72, 32, 8, 3); g.e(24, 24, 9, 7, 1); g.e(24, 24, 7, 5, f ? 5 : 4); g.e(24, 24, 3, 3, 1); for (let i = 0; i < 6; i++) { g.r(18 + (i % 2) * 8, 38 + i * 5, 4, 1, 4); g.r(20 + ((i + 1) % 2) * 6, 40 + i * 5, 1, 2, 7); } g.r(22, 4, 4, 8, 6); g.r(21, 12, 6, 2, 6); }));
  // the magic box: the trick
  YP.box = legacyPal(pal('#000000', '#6d2492', '#b649db', '#ffdb24', '#dbdbdb', '#929292', '#ffffff'), 'dmg');
  YS.box = spr(80, 44, g => { g.r(0, 8, 80, 30, 2); g.r(0, 8, 80, 3, 3); for (let i = 0; i < 6; i++) { const x = 8 + i * 12; g.p(x, 20, 4); g.p(x - 1, 21, 4); g.p(x + 1, 21, 4); g.p(x, 22, 4); } g.r(38, 0, 4, 44, 5); g.r(30, 0, 20, 6, 6); for (let x = 30; x < 50; x += 2) g.p(x, 6, 5); g.r(4, 38, 6, 6, 5); g.r(70, 38, 6, 6, 5); });
  // yoko, walking. 16x28, four directions, two frames. only used once: the part where you finally do something yourself.
  YP.walk = pal('#241010', '#ffdbb6', '#db9292', '#6d4824', '#b66d49', '#9292db', '#6d6db6', '#242449', '#492424', '#dbb649');
  const walker = (dir, f) => outline(spr(16, 28, g => {
    const st = f ? 1 : 0;
    g.r(5 + (dir === 'l' ? -st : 0), 20, 3, 7, 8); g.r(9 + (dir === 'r' ? st : 0), 20, 3, 7 - (dir === 'u' || dir === 'd' ? st : 0), 8); g.r(4, 26, 4, 2, 1); g.r(9, 26, 4, 2, 1);
    g.r(4, 13, 9, 8, 6); g.r(10, 13, 3, 8, 7); g.r(3, 14, 2, 6, 6); g.r(12, 14, 2, 6, 7);
    g.r(3, 19 + st, 2, 2, 2); g.r(12, 19 - st, 2, 2, 3);
    g.r(6, 11, 5, 3, 6); g.p(8, 13, 10);
    g.e(8, 6, 4.5, 5, 2);
    if (dir === 'u') g.e(8, 6, 5, 5.5, 4);
    else { g.e(8, 3, 5, 3, 4); g.r(3, 3, 2, 8, 4); g.r(11, 3, 2, 8, 4); if (dir !== 'r') g.r(5, 6, 1, 1, 9); if (dir !== 'l') g.r(10, 6, 1, 1, 9); if (dir === 'l') g.r(11, 3, 2, 9, 4); if (dir === 'r') g.r(3, 3, 2, 9, 4); g.p(8, 3, 5); }
  }), 1);
  YS.walk = {}; for (const d of ['d', 'u', 'l', 'r']) YS.walk[d] = [0, 1].map(f => walker(d, f));
})();

// ================= SCENE BACKGROUNDS (top 150px; the command panel lives below) =================
const SB = {};
const YB = { lav: hex('#b692db'), cy: hex('#24dbff'), pink: hex('#ff6db6'), gold: hex('#ffdb24'), grn: hex('#6dff24') };
const shelf = (x, y, w, c) => { rectF(x, y, w, 3, c); rectF(x, y + 3, w, 1, BLACK); };
SB.closet = t => {
  skyD(0, 150, '#120c08', '#2a1c12');
  for (let i = 0; i < 3; i++) { shelf(10, 40 + i * 34, 130, hex('#6d4824')); shelf(190, 40 + i * 34, 120, hex('#6d4824')); }
  for (let i = 0; i < 14; i++) { const x = 16 + (i % 7) * 18, y = 16 + ((i / 7) | 0) * 34; lineF(x, y, x, y + 22, hex('#242424')); lineF(x, y, x - 6, y + 6, [hex('#242449'), hex('#492424'), hex('#244924')][i % 3]); lineF(x, y, x + 6, y + 6, [hex('#242449'), hex('#492424'), hex('#244924')][i % 3]); rectF(x - 1, y + 22, 3, 1, hex('#6d6d6d')); }
  for (let i = 0; i < 5; i++) { rectF(196 + i * 22, 58, 18, 14, hex('#926d49')); rectF(196 + i * 22, 58, 18, 2, hex('#b6926d')); }
  rectF(200, 90, 40, 14, hex('#6d4824')); text('SPARES', 202, 94, hex('#dbb692'), 0);
  lineF(160, 0, 160, 18, hex('#494949')); circF(160, 22, 4, (t >> 6) % 9 ? hex('#ffdb92') : hex('#926d49'));
  rectF(0, 140, W, 10, hex('#120c08'));
};
SB.atrium = t => {
  skyD(0, 150, '#dbdbff', '#b6b6db');
  for (let i = 0; i < 6; i++) { const x = i * 56 - ((t * .2) % 56); rectF(x, 10, 40, 60, hex('#ffffff')); rectF(x + 4, 14, 32, 40, hex('#dbdbff')); rectF(x, 70, 40, 2, hex('#9292b6')); }
  rectF(0, 72, W, 4, hex('#9292b6'));
  for (let i = 0; i < 4; i++) { const x = 20 + i * 80; rectF(x, 76, 8, 60, YB.lav); rectF(x - 10, 80, 28, 34, hex('#6d49b6')); text('YL', x - 2, 90, WHITE, 0); }
  rectF(0, 20, W, 12, hex('#6d49b6')); ctext('YOKO LIMITED  -  WE ARE HERE TO HELP', 23, WHITE);
  circF(160, 132, 28, hex('#9292db')); circF(160, 132, 22, hex('#b6dbff')); for (let i = 0; i < 6; i++) { const a = t * .05 + i; pset(160 + Math.cos(a) * 12, 116 + Math.sin(a * 2) * 4, WHITE); }
  rectF(0, 140, W, 10, hex('#9292b6'));
};
SB.suitors = t => {
  skyD(0, 150, '#240024', '#490036');
  for (let x = 0; x < W; x += 20) rectF(x, 0, 10, 100, hex('#36001a'));
  rectF(60, 10, 200, 24, BLACK); frameRect(60, 10, 200, 24, (t >> 4) & 1 ? YB.lav : hex('#6d49b6')); ctext('SUITORS', 16, YB.lav, 0, 2);
  rectF(0, 104, W, 46, hex('#491224')); rectF(0, 104, W, 3, hex('#926d49'));
  for (let i = 0; i < 5; i++) { rectF(20 + i * 62, 84, 30, 20, hex('#6d2449')); rectF(24 + i * 62, 80, 22, 6, hex('#926d49')); }
  rectF(230, 60, 80, 44, hex('#36121a')); for (let i = 0; i < 6; i++) rectF(236 + i * 12, 64, 6, 14, [YB.pink, YB.gold, YB.cy][i % 3]);
};
SB.garfs = t => {
  skyD(0, 150, '#1a0c1a', '#361224');
  for (let i = 0; i < 4; i++) { shelf(0, 30 + i * 28, 110, hex('#492424')); shelf(220, 30 + i * 28, 100, hex('#492424')); for (let k = 0; k < 6; k++) { const x = 6 + k * 17, y = 16 + i * 28; rectF(x, y, 12, 14, [hex('#b62424'), hex('#dbb692'), hex('#2449b6')][(k + i) % 3]); rectF(x, y + 4, 12, 4, WHITE); } for (let k = 0; k < 5; k++) { const x = 226 + k * 18, y = 16 + i * 28; rectF(x, y, 12, 14, [hex('#dbb692'), hex('#b62424'), hex('#6d6d6d')][(k + i) % 3]); rectF(x, y + 5, 12, 3, hex('#ffffdb')); } }
  rectF(120, 20, 80, 56, hex('#002436')); frameRect(120, 20, 80, 56, YB.cy); text('INVENTORY', 130, 24, YB.cy, 0); for (let i = 0; i < 12; i++) frameRect(126 + (i % 4) * 18, 36 + ((i / 4) | 0) * 13, 14, 10, hex('#2492b6'));
  rectF(10, 118, 60, 30, hex('#6d4824')); text('RATION', 16, 124, hex('#b6926d'), 0); text('CRATE', 16, 134, hex('#b6926d'), 0);
  circF(292, 100, 6, (t >> 3) % 7 ? hex('#ffb624') : hex('#ff9224')); rectF(288, 108, 8, 12, hex('#494949'));
  rectF(0, 146, W, 4, hex('#120612'));
};
SB.office = t => {
  skyD(0, 150, '#000024', '#12123a');
  rectF(20, 10, 280, 80, hex('#24246d')); for (let i = 0; i < 14; i++) rectF(24 + i * 20, 14, 16, 72, hex('#12124a')); for (let i = 0; i < 30; i++) pset(30 + (i * 37) % 260, 30 + (i * 13) % 50, [YB.pink, YB.lav, YB.gold][i % 3]);
  rectF(0, 96, W, 54, hex('#1a1a2a')); rectF(90, 104, 140, 30, hex('#242424')); rectF(90, 104, 140, 3, hex('#494949'));
  rectF(126, 110, 68, 12, BLACK); text('FASCISM INC.', 128, 113, YB.pink, 0);
  for (const x of [30, 260]) { rectF(x, 100, 30, 22, hex('#242424')); rectF(x + 2, 102, 26, 16, (t >> 5) & 1 ? hex('#6d2449') : hex('#49124a')); }
};
SB.tower = t => {
  skyD(0, 150, '#0c0004', '#48000e');
  for (let i = 0; i < 5; i++) { rectF(10 + i * 64, 20, 44, 60, hex('#240008')); frameRect(10 + i * 64, 20, 44, 60, hex('#6d0012')); text('LIVE', 18 + i * 64, 30, hex('#ff4949'), 0); text('FROM', 18 + i * 64, 40, hex('#ff4949'), 0); text('BEYOND', 16 + i * 64, 50, hex('#ff4949'), 0); }
  rectF(0, 100, W, 50, hex('#240008')); for (let x = 0; x < W; x += 16) rectF(x, 100, 8, 2, hex('#48000e'));
  if ((t >> 5) & 1) { rectF(140, 4, 40, 10, hex('#b60000')); text('ON AIR', 142, 6, WHITE, 0); }
};
SB.studio = t => {
  skyD(0, 150, '#180008', '#360012');
  rectF(100, 16, 120, 80, hex('#6d6d6d')); rectF(104, 20, 112, 72, hex('#242436')); for (let i = 0; i < 10; i++) { circF(104 + i * 12.4, 16, 3, (t >> 4) % 10 === i ? WHITE : hex('#ffdb92')); circF(104 + i * 12.4, 96, 3, hex('#ffdb92')); }
  rectF(20, 30, 60, 4, hex('#6d6d6d')); for (let i = 0; i < 5; i++) { rectF(24 + i * 11, 34, 9, 40, [hex('#b60024'), hex('#242424'), hex('#ffffff'), hex('#b6926d'), hex('#6d2492')][i]); }
  rectF(240, 60, 60, 40, hex('#492424')); text('TOP', 256, 66, YB.gold, 0); text('BILLING', 250, 78, YB.gold, 0);
  rectF(0, 110, W, 40, hex('#240008'));
};
SB.archive = t => {
  skyD(0, 150, '#000814', '#002a44');
  for (let i = 0; i < 9; i++) { const x = 8 + i * 36; for (const y of [14, 62]) { rectF(x, y + 36, 32, 3, hex('#244a6d')); rectF(x + 6, y + 4, 20, 32, hex('#122436')); frameRect(x + 6, y + 4, 20, 32, hex('#49b6db')); const red = (i * 7 + y) % 5 === 0; rectF(x + 9, y + 12, 14, 14, red ? hex('#6d0000') : hex('#001224')); rectF(x + 11, y + 16, 3, 1, red ? hex('#ff2424') : hex('#ff24db')); rectF(x + 18, y + 16, 3, 1, red ? hex('#ff2424') : hex('#ff24db')); rectF(x + 12, y + 21, 8, 1, hex('#6dff24')); } }
  rectF(0, 116, W, 34, hex('#00121c'));
};
SB.generator = (t, S) => {
  skyD(0, 150, '#200018', '#48002a');
  const empty = S && S.empty;
  rectF(130, 10, 60, 120, empty ? hex('#306230') : hex('#ffdb24')); rectF(136, 16, 48, 108, empty ? hex('#0f380f') : hex('#ff92db'));
  for (let i = 0; i < 6; i++) { const y = 16 + ((t * (empty ? .3 : 1.5) + i * 20) % 108); rectF(140, y, 40, 2, empty ? hex('#306230') : WHITE); }
  for (let i = 0; i < 8; i++) { lineF(0, 20 + i * 14, 130, 60 + i * 6, hex('#6d2449')); lineF(190, 60 + i * 6, W, 20 + i * 14, hex('#6d2449')); }
  text(empty ? 'GENERATOR: EMPTY' : 'GENERATOR: RUNNING', 104, 134, empty ? hex('#9bbc0f') : YB.gold, 0);
};
SB.oldstream = t => { // the first stream. four shades, green. only Yoko will be in color.
  cls(hex('#9bbc0f'));
  rectF(0, 0, W, 20, hex('#306230')); for (let x = 0; x < W; x += 24) { rectF(x, 20, 12, 60, hex('#8bac0f')); rectF(x + 12, 20, 12, 60, hex('#306230')); }
  rectF(0, 110, W, 40, hex('#306230')); rectF(0, 110, W, 3, hex('#0f380f'));
  for (let i = 0; i < 10; i++) { rectF(10 + i * 32, 130, 18, 20, hex('#0f380f')); circF(19 + i * 32, 126, 6, hex('#0f380f')); }
  rectF(120, 4, 80, 12, hex('#0f380f')); text('THE FACE SHOW', 122, 6, hex('#9bbc0f'), 0);
};
SB.exile = t => {
  cls(BLACK);
  for (let i = 0; i < 80; i++) { const a = i * 2.4 + t * .01, r = ((i * 13 + t * .8) % 180); pset(160 + Math.cos(a) * r, 75 + Math.sin(a) * r * .6, i % 3 ? hex('#6d49b6') : hex('#dbb6ff')); }
  for (let k = 0; k < 5; k++) ringF(160, 75, 20 + k * 22 + (t % 22), hex('#49246d'));
};
SB.plaza = t => { // the Mandolin reality: where everyone learned to play the mandolin
  skyD(0, 90, '#ff9249', '#ffdb92');
  circF(240, 40, 20, hex('#ffffdb'));
  for (let i = 0; i < 7; i++) { const x = i * 48, h = 40 + (i * 29) % 30; rectF(x, 90 - h, 40, h, hex('#dbb692')); rectF(x + 4, 96 - h, 32, 3, hex('#b64924')); for (let k = 0; k < 3; k++) rectF(x + 6 + k * 11, 100 - h + 8, 7, 9, hex('#6d4824')); }
  rectF(0, 90, W, 60, hex('#dba249')); for (let x = 0; x < W; x += 16) for (let y = 90; y < 150; y += 8) rectF(x + ((y / 8) & 1) * 8, y, 7, 1, hex('#b6926d'));
  rectF(100, 8, 120, 14, hex('#24246d')); ctext('THE EMPRESS HELPS', 11, hex('#92ffff'));
  for (let i = 0; i < 5; i++) { const x = 20 + i * 64, y = 100 + (i & 1) * 6; rectF(x, y, 8, 18, hex('#249249')); circF(x + 4, y - 4, 4, hex('#ffdbb6')); circF(x + 10, y + 8, 4, hex('#b64924')); lineF(x + 12, y + 6, x + 18, y - 2 + ((t >> 3) & 1), hex('#6d4824')); }
};
SB.apartment = t => {
  skyD(0, 150, '#ffdbb6', '#dbb692');
  rectF(200, 16, 90, 70, hex('#92b6ff')); frameRect(200, 16, 90, 70, hex('#926d49')); rectF(244, 16, 2, 70, hex('#926d49')); circF(260, 40, 8, hex('#ffffdb'));
  rectF(20, 70, 90, 50, hex('#b66d49')); rectF(20, 70, 90, 6, hex('#dba249')); rectF(30, 40, 30, 30, hex('#ffffff')); frameRect(30, 40, 30, 30, hex('#926d49')); text('?', 42, 50, hex('#6d6d6d'), 0);
  rectF(130, 100, 50, 30, hex('#6d4824')); rectF(140, 88, 12, 12, hex('#249249'));
  rectF(0, 130, W, 20, hex('#926d49'));
};
SB.testgate = t => {
  skyD(0, 150, '#000024', '#002449');
  for (const cx of [40, 280]) { rectF(cx - 12, 0, 24, 150, hex('#12245a')); for (let y = 6; y < 150; y += 10) { rectF(cx - 3, y, 7, 1, (y + (t >> 2)) % 40 < 10 ? hex('#92ffff') : hex('#2449b6')); pset(cx, y + 3, hex('#24dbff')); } }
  for (let k = 0; k < 3; k++) { const r = 60 + k * 18; for (let a = 0; a < 90; a++) { const an = a / 90 * 6.283 + t * .003 * (k + 1); pset(160 + Math.cos(an) * r, 140 + Math.sin(an) * r * .25, a % 9 ? hex('#2449b6') : hex('#92ffff')); } }
};
SB.deck = t => { // warworld: the balcony over the armada (from the reference)
  skyD(0, 60, '#000024', '#24246d'); skyD(60, 120, '#24246d', '#92246d'); skyD(120, 150, '#92246d', '#6d2449');
  for (let i = 0; i < 16; i++) { const x = ((i * 61 + t * .15 * (1 + i % 3)) % 360) - 20, y = 20 + (i * 23) % 80, w = 16 + (i % 4) * 10; rectF(x, y, w, 3, hex('#242449')); rectF(x + 3, y - 2, w / 2, 2, hex('#242449')); if ((t >> 3 + (i & 1)) & 1) pset(x + 2, y + 1, hex('#ff2424')); }
  if (t % 90 < 6) { let x = 80 + (t % 180), y = 0; for (let k = 0; k < 12; k++) { const nx = x + ((k * 7) % 13) - 6; lineF(x, y, nx, y + 8, WHITE); x = nx; y += 8; } }
  rectF(0, 120, W, 30, hex('#120012')); for (let x = 0; x < W; x += 20) { rectF(x, 112, 3, 12, hex('#242424')); } rectF(0, 112, W, 2, hex('#494949'));
  circF(18, 100, 8, hex('#ff2424')); circF(18, 100, 4, WHITE);
};
SB.bridge = t => {
  skyD(0, 150, '#000012', '#12124a');
  rectF(40, 10, 240, 60, hex('#000024')); frameRect(40, 10, 240, 60, hex('#24dbff')); for (let i = 0; i < 20; i++) { const x = 50 + (i * 47) % 220, y = 20 + (i * 17) % 40; rectF(x, y, 6, 2, hex('#242449')); if (i % 4 === 0) pset(x, y, hex('#ff2424')); }
  for (let i = 0; i < 20; i++) pset(50 + (i * 31) % 220, 18 + (i * 7) % 44, hex('#ff49b6'));
  text('FRONT: LINDA FRANCHISES', 56, 60, hex('#ff49b6'), 0);
  rectF(0, 100, W, 50, hex('#12122a')); for (let i = 0; i < 6; i++) { rectF(10 + i * 52, 104, 44, 20, hex('#242449')); rectF(12 + i * 52, 106, 40, 8, (t >> 4) % 6 === i ? hex('#24dbff') : hex('#244a6d')); }
};
SB.throne = t => { // the empress: runes, rings, the next generation behind her
  skyD(0, 150, '#000012', '#12246d');
  for (const cx of [24, 296]) for (let y = 2; y < 148; y += 7) { rectF(cx - 2, y, 5, 1, hex('#2449b6')); if ((y + (t >> 3)) % 21 === 0) rectF(cx - 2, y, 5, 1, hex('#92ffff')); pset(cx, y + 3, hex('#2449b6')); }
  for (let k = 0; k < 3; k++) { const r = 80 + k * 14; for (let a = 0; a < 120; a++) { const an = a / 120 * 6.283 + t * .002 * (k & 1 ? -1 : 1); pset(160 + Math.cos(an) * r, 132 + Math.sin(an) * r * .22, a % 10 ? hex('#2449b6') : hex('#92ffff')); } }
  for (let i = 0; i < 40; i++) pset((i * 73) % W, (i * 19) % 110, i % 4 ? hex('#6d6db6') : WHITE);
};
