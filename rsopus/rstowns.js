'use strict';
// ================= ROMANCING STREAM: what makes each town that town =================
// every town used to be the same row of apartment blocks in a different tint. now each theme builds its own kind of house
// (STYLE) and each town paints one landmark you can recognize from the street (LANDMARK), in the left-hand lot.
const STYLE = {
  // h: height range, win: window pattern, extra: a painter after the walls
  desert: { h: [50, 70], win: 'few', extra: 'vigas' }, bus: { h: [46, 62], win: 'few', extra: 'vigas' },
  mall: { h: [64, 84], win: 'glass', extra: 'awning' }, rewind: { h: [52, 66], win: 'glass', extra: 'marquee' },
  haunt: { h: [86, 110], win: 'arch' }, court: { h: [80, 100], win: 'arch', extra: 'columns' },
  studio: { h: [70, 96], win: 'grid', extra: 'dish' }, city: { h: [100, 130], win: 'slit' },
  mandolin: { h: [50, 66], win: 'round', extra: 'timber' }, field: { h: [48, 62], win: 'round', extra: 'timber' },
  noir: { h: [96, 124], win: 'grid', extra: 'escape' }, hangar: { h: [56, 70], win: 'few', extra: 'bigdoor' },
  live: { h: [56, 70], win: 'few', extra: 'falsefront' }, brine: { h: [46, 60], win: 'few', extra: 'planks' },
  found: { h: [54, 72], win: 'few', extra: 'crates' },
};
const INK = [.32, .22, .18];
function paintBuildingStyled(P, b, T, theme) {
  const S = STYLE[theme]; if (!S) return paintBuilding(P, b, T);
  const base = b.base, col = pg(b.col || T.far).map(v => Math.min(1, v * 1.35 + .08)), y0 = base - b.h, dark = col.map(v => v * .7), lit = pg(T.night ? '#ffe08a' : '#6a7a8a'), wa = T.night ? .5 : .35;
  P.reserve([[b.x, y0], [b.x + b.w, y0], [b.x + b.w, base], [b.x, base]]);
  P.rect(b.x, y0, b.w, b.h, col, .55, { jit: 1.2, edge: .8 });
  if (b.roof === 'tri') P.poly([[b.x - 4, y0 + 1], [b.x + b.w / 2, y0 - b.w * .35], [b.x + b.w + 4, y0 + 1]], dark, .6, { jit: 1 });
  else if (b.roof === 'dome') P.ell(b.x + b.w / 2, y0, b.w / 2, b.w * .3, col.map(v => v * .8), .55, { jit: 1 });
  else if (b.roof === 'spire') P.poly([[b.x + b.w * .3, y0 + 1], [b.x + b.w / 2, y0 - b.w * .9], [b.x + b.w * .7, y0 + 1]], dark, .6, { jit: .8 });
  else P.rect(b.x - 2, y0 - 4, b.w + 4, 5, dark, .6, { jit: .8 });
  const top = y0 + 8, bot = base - (b.door ? 26 : 10);
  if (S.win === 'few') for (let i = 0; i < 2; i++) P.rect(b.x + b.w * (.2 + i * .45), top + 6, 8, 8, lit, wa, { jit: .6, edge: .6 });
  else if (S.win === 'glass') { for (let i = 0; i < 3; i++) P.rect(b.x + 4 + i * (b.w - 8) / 3, top, (b.w - 8) / 3 - 3, bot - top, [.7, .85, .95], .35, { jit: .4, edge: .8 }); P.gouache(b.x + 10, top + 4, 1.4); }
  else if (S.win === 'arch') for (let i = 0; i < Math.floor((b.w - 8) / 14); i++) for (let j = 0; j < Math.floor((bot - top) / 22); j++) { const x = b.x + 8 + i * 14, y = top + j * 22; P.rect(x, y + 4, 7, 12, lit, wa, { jit: .4 }); P.ell(x + 3.5, y + 4, 3.5, 3.5, lit, wa, { jit: .3, edge: 0 }); }
  else if (S.win === 'round') for (let i = 0; i < 2; i++) P.ell(b.x + b.w * (.3 + i * .4), top + 10, 4, 4, lit, wa, { jit: .4, edge: .8 });
  else if (S.win === 'slit') for (let i = 0; i < Math.floor((b.w - 6) / 8); i++) P.rect(b.x + 5 + i * 8, top, 2, bot - top, lit, wa * .8, { jit: .3, edge: .3 });
  else for (let j = 0; j < Math.floor((bot - top) / 12); j++) for (let i = 0; i < Math.floor((b.w - 6) / 10); i++) P.rect(b.x + 5 + i * 10, top + j * 12, 5, 6, lit, wa, { jit: .6, edge: .4 });
  const x0 = b.x, x1 = b.x + b.w, cx = b.x + b.w / 2;
  switch (S.extra) {
    case 'vigas': for (let i = 0; i < 5; i++) P.line([[x0 + 6 + i * (b.w - 12) / 4, y0 + 3], [x0 + 6 + i * (b.w - 12) / 4 - 3, y0 + 6]], INK, .6, 1.2); break;
    case 'awning': for (let i = 0; i < 6; i++) P.poly([[x0 + i * b.w / 6, base - 28], [x0 + (i + 1) * b.w / 6, base - 28], [x0 + (i + 1) * b.w / 6 - 2, base - 22], [x0 + i * b.w / 6 - 2, base - 22]], i % 2 ? [.95, .9, .9] : pg(T.acc), .5, { jit: .3 }); break;
    case 'marquee': P.rect(x0 + 4, y0 - 16, b.w - 8, 12, [.95, .85, .4], .55, { edge: 1 }); for (let i = 0; i < b.w / 6; i++) P.gouache(x0 + 6 + i * 6, y0 - 16, .9, [1, .95, .6]); break;
    case 'columns': for (let i = 0; i < 4; i++) P.rect(x0 + 6 + i * (b.w - 16) / 3, top, 4, base - top, [.92, .9, .86], .45, { jit: .3, edge: .8 }); P.poly([[x0 - 4, y0 + 2], [cx, y0 - 16], [x1 + 4, y0 + 2]], [.9, .88, .84], .5); break;
    case 'dish': P.ell(x1 - 12, y0 - 10, 7, 4, [.85, .85, .9], .5, { edge: 1 }); P.line([[x1 - 12, y0 - 6], [x1 - 12, y0]], INK, .6, .8); P.rect(x0 + 3, top + 20, b.w - 6, 3, [.4, .9, 1], .5, { jit: .3, edge: 1.2 }); break;
    case 'timber': P.line([[x0, y0 + 2], [x1, base - 26]], INK, .45, .8); P.line([[x1, y0 + 2], [x0, base - 26]], INK, .45, .8); P.line([[x0, y0 + b.h / 2], [x1, y0 + b.h / 2]], INK, .45, .8); break;
    case 'escape': for (let j = 0; j < 4; j++) { const y = top + 10 + j * 18; P.line([[x1 - 22, y], [x1 - 4, y]], [.15, .12, .12], .7, .9); P.line([[x1 - 20, y], [x1 - 8, y + 18]], [.15, .12, .12], .5, .6); } break;
    case 'bigdoor': P.rect(cx - b.w * .32, base - 34, b.w * .64, 34, dark, .45, { jit: .4 }); for (let i = 1; i < 5; i++) P.line([[cx - b.w * .32 + i * b.w * .128, base - 34], [cx - b.w * .32 + i * b.w * .128, base]], INK, .35, .6); break;
    case 'falsefront': P.rect(x0 - 3, y0 - 18, b.w + 6, 20, col.map(v => v * .9), .55, { jit: .5, edge: .8 }); P.line([[x0 - 3, y0 - 18], [x1 + 3, y0 - 18]], INK, .55, .8); P.rect(x0 - 2, base - 30, b.w + 4, 4, dark, .6); break;
    case 'planks': for (let i = 0; i < b.w / 7; i++) P.line([[x0 + 3 + i * 7, y0 + 2], [x0 + 3 + i * 7, base]], INK, .25, .6); P.rect(x0 - 2, base, 3, 10, INK, .6); P.rect(x1 - 1, base, 3, 10, INK, .6); break;
    case 'crates': for (let i = 0; i < 3; i++) P.rect(x1 - 4 + (i % 2) * 8, base - 12 - i * 10, 14, 10, [.6, .45, .3], .55, { jit: .4, edge: .8 }); break;
  }
  if (b.door) { P.rect(cx - 6, base - 18, 12, 18, [.25, .16, .14], .7, { jit: .6 }); P.line([[cx - 6, base], [cx - 6, base - 18], [cx + 6, base - 18], [cx + 6, base]], [.3, .2, .16], .7, .8); }
  if (b.sign) P.rect(cx - b.sign * 3.2, base - 40, b.sign * 6.4, 8, pg(T.acc), .5, { jit: .5, edge: 1 });
  P.line([[x0, base], [x0, y0], [x1, y0], [x1, base]], INK, .55, .7);
}
// one recognizable thing per town, painted in the left-hand lot (x .. x + w), standing on g
const LANDMARK = {
  lot: (P, x, w, g) => { // the A.S.S. in its parking space
    const cx = x + w / 2; P.reserve(Array.from({ length: 16 }, (_, i) => [cx + Math.cos(i * .3927) * w * .62, g - 22 + Math.sin(i * .3927) * 14])); P.ell(cx, g - 22, w * .62, 14, [.55, .75, .7], .6, { edge: 1.2 }); P.ell(cx, g - 34, w * .28, 13, [.7, .95, .85], .45, { edge: 1.4 }); P.ell(cx, g - 16, w * .62, 4, [.3, .45, .4], .5);
    for (let i = -2; i <= 2; i++) P.gouache(cx + i * w * .22, g - 20, 1.6, [1, .95, .5]); P.line([[cx - 14, g - 6], [cx - 20, g]], INK, .6, 1); P.line([[cx + 14, g - 6], [cx + 20, g]], INK, .6, 1);
    for (let i = 0; i < 4; i++) P.line([[x + i * w / 3, g + 3], [x + i * w / 3, g + 12]], [.95, .95, .9], .7, 1);
  },
  mall: (P, x, w, g) => { const cx = x + w / 2; P.reserve([[x, g - 70], [x + w, g - 70], [x + w, g], [x, g]]); P.ell(cx, g - 60, w / 2, 28, [.7, .85, .95], .45, { edge: 1.2 }); P.rect(x, g - 60, w, 60, [.85, .8, .9], .5, { edge: 1 }); for (let i = 0; i < 5; i++) P.line([[x + i * w / 4, g - 60], [x + i * w / 4, g]], INK, .4, .7); P.rect(x + 6, g - 58, w - 12, 8, [1, .45, .75], .55, { edge: 1.2 }); P.gouache(cx, g - 82, 2); },
  lounge: (P, x, w, g) => { const cx = x + w / 2; P.rect(cx - 2, g - 100, 4, 100, [.3, .3, .35], .6); P.rect(cx - 22, g - 112, 44, 40, [.25, .15, .3], .6, { edge: 1 }); for (let i = 0; i < 7; i++) P.gouache(cx - 18 + i * 6, g - 104, 1.6, [1, .6, .9], .9); for (let i = 0; i < 5; i++) P.gouache(cx - 12 + i * 6, g - 86, 1.3, [.6, .9, 1], .9); P.ell(cx, g - 92, 30, 26, [1, .5, .85], .15, { edge: .2, gran: 0 }); },
  studio: (P, x, w, g) => { const cx = x + w / 2; P.line([[cx - 20, g], [cx, g - 130]], INK, .8, 1.2); P.line([[cx + 20, g], [cx, g - 130]], INK, .8, 1.2); for (let i = 1; i < 7; i++) { const y = g - i * 18, d = 20 * (1 - i / 7.2); P.line([[cx - d, y], [cx + d, y + 9]], INK, .5, .7); P.line([[cx + d, y], [cx - d, y + 9]], INK, .5, .7); } P.gouache(cx, g - 132, 2.4, [1, .3, .3]); P.ell(cx, g - 132, 10, 10, [1, .3, .3], .2, { edge: .2 }); },
  mandolin: (P, x, w, g) => { const cx = x + w / 2; P.rect(cx - 16, g - 14, 32, 14, [.8, .78, .72], .55, { edge: 1 }); P.ell(cx, g - 46, 20, 26, [.75, .5, .3], .6, { edge: 1.2 }); P.ell(cx, g - 46, 6, 6, [.2, .12, .1], .7); P.rect(cx - 3, g - 120, 6, 60, [.55, .35, .2], .6); P.rect(cx - 6, g - 128, 12, 10, [.45, .28, .16], .6); for (let i = -1; i <= 1; i++) P.line([[cx + i * 1.6, g - 30], [cx + i * 1.6, g - 122]], [.95, .95, .9], .7, .4); },
  lasagna: (P, x, w, g) => { const cx = x + w / 2; for (const dx of [-14, 14]) P.line([[cx + dx, g], [cx + dx * .6, g - 70]], INK, .7, 1); P.ell(cx, g - 90, 22, 24, [.55, .45, .4], .6, { edge: 1 }); P.poly([[cx - 24, g - 106], [cx, g - 124], [cx + 24, g - 106]], [.4, .32, .3], .6); P.rect(cx - 16, g - 94, 32, 7, [.95, .8, .4], .5, { edge: 1 }); },
  puddle: (P, x, w, g) => { const cx = x + w / 2; P.ell(cx, g + 8, w * .55, 6, [.55, .75, .9], .55, { edge: 1.4 }); P.gouache(cx - 10, g + 6, 1.4); P.line([[x + 8, g], [x + 8, g - 44]], INK, .7, 1); P.line([[x + 22, g], [x + 22, g - 44]], INK, .7, 1); P.poly([[x + 8, g - 44], [x + 22, g - 44], [x + w - 6, g - 4], [x + w - 16, g - 2]], [.95, .55, .3], .6, { edge: .8 }); for (let i = 0; i < 4; i++) P.line([[x + 8, g - 10 - i * 9], [x + 22, g - 10 - i * 9]], INK, .6, .8); },
  gate: (P, x, w, g) => { const cx = x + w / 2; P.poly([[cx - w * .5, g - 30], [cx + w * .4, g - 34], [cx + w * .55, g - 30], [cx + w * .4, g - 24], [cx - w * .5, g - 26]], [.75, .78, .82], .6, { edge: 1 }); P.poly([[cx - 6, g - 30], [cx + 10, g - 30], [cx - 14, g - 54], [cx - 22, g - 54]], [.7, .72, .76], .6, { edge: 1 }); P.poly([[cx - w * .45, g - 28], [cx - w * .5, g - 46], [cx - w * .38, g - 30]], [.8, .2, .2], .6); P.ell(cx + w * .32, g - 30, 5, 3, [.5, .8, .95], .5); P.line([[cx - 10, g - 24], [cx - 10, g]], INK, .6, 1); P.line([[cx + 18, g - 26], [cx + 18, g]], INK, .6, 1); },
  rewind: (P, x, w, g) => { const cx = x + w / 2; P.rect(cx - 2, g - 70, 4, 70, [.3, .3, .32], .6); P.rect(cx - w * .45, g - 118, w * .9, 52, [.12, .12, .14], .7, { edge: 1 }); P.ell(cx - w * .2, g - 92, 11, 11, [.85, .85, .85], .55, { edge: 1.2 }); P.ell(cx + w * .2, g - 92, 11, 11, [.85, .85, .85], .55, { edge: 1.2 }); P.rect(cx - w * .38, g - 114, w * .76, 10, [.95, .3, .4], .6); P.rect(cx - w * .3, g - 76, w * .6, 6, [.9, .9, .85], .5); },
  livehouse: (P, x, w, g) => { const cx = x + w / 2; P.rect(x, g - 14, w, 14, [.5, .32, .22], .6, { edge: 1 }); P.poly([[x - 2, g - 14], [x + w + 2, g - 14], [x + w - 6, g - 74], [x + 6, g - 74]], [.55, .15, .2], .35, { edge: .6 }); for (const sx of [x + 8, x + w - 20]) { P.rect(sx, g - 46, 12, 32, [.15, .14, .16], .7); P.ell(sx + 6, g - 36, 4, 4, [.4, .4, .45], .6); P.ell(sx + 6, g - 24, 3, 3, [.4, .4, .45], .6); } P.rect(cx - 1, g - 44, 2, 30, INK, .7); P.ell(cx, g - 46, 3, 3, [.3, .3, .3], .7); P.ell(cx, g - 70, 30, 12, [1, .9, .6], .25, { edge: .1, gran: 0 }); },
  brineport: (P, x, w, g) => { const cx = x + w / 2, tw = [[cx - 12, g], [cx + 12, g], [cx + 7, g - 110], [cx - 7, g - 110]]; P.reserve(tw); P.poly(tw, [.95, .95, .92], .3, { edge: 1.2 }); for (let i = 0; i < 4; i++) P.rect(cx - 11 + i * .9, g - 20 - i * 26, 22 - i * 2, 9, [.8, .25, .2], .55); P.rect(cx - 9, g - 126, 18, 16, [.3, .3, .35], .6); P.ell(cx, g - 118, 6, 5, [1, .95, .6], .7, { edge: 1.4 }); P.ell(cx - 30, g - 118, 30, 4, [1, .95, .7], .2, { edge: 0, gran: 0 }); },
  found: (P, x, w, g) => { const cx = x + w / 2; P.poly([[x, g], [cx - 10, g - 70], [cx + 6, g - 82], [x + w, g]], [.7, .6, .5], .45, { edge: .8, gran: .7 }); for (let i = 0; i < 26; i++) { const px = x + 8 + rnd2(i, 71) * (w - 16), py = g - 6 - rnd2(i, 72) * 60 * (1 - Math.abs(px - cx) / w * 1.6); const c = [[.3, .4, .7], [.8, .3, .3], [.9, .85, .4], [.3, .6, .4], [.95, .95, .95]][i % 5]; if (i % 3 === 0) P.poly([[px - 6, py], [px, py - 5], [px + 6, py]], c, .6); else P.ell(px, py, 3 + (i % 4), 2 + (i % 3), c, .55, { edge: 1 }); } P.line([[cx + 4, g - 82], [cx + 4, g - 100]], INK, .7, .8); P.poly([[cx - 6, g - 100], [cx + 14, g - 100], [cx + 4, g - 108]], [.2, .2, .25], .6); },
  gatecity: (P, x, w, g) => { const cx = x + w / 2; P.rect(x + 4, g - 120, 14, 120, [.65, .1, .12], .65, { edge: 1 }); P.rect(x + w - 18, g - 120, 14, 120, [.65, .1, .12], .65, { edge: 1 }); P.rect(x - 4, g - 132, w + 8, 12, [.55, .08, .1], .7, { edge: 1 }); P.rect(x, g - 116, w, 7, [.55, .08, .1], .6); P.ell(cx, g - 60, w * .35, 50, [1, .5, .35], .22, { edge: .3, gran: 0 }); P.gouache(cx, g - 126, 2, [1, .85, .4]); },
  courts: (P, x, w, g) => { const cx = x + w / 2; P.reserve([[x - 6, g - 96], [x + w + 6, g - 96], [x + w + 6, g], [x - 6, g]]); P.poly([[x - 8, g - 80], [cx, g - 104], [x + w + 8, g - 80]], [.88, .86, .82], .55, { edge: 1 }); P.rect(x - 6, g - 80, w + 12, 6, [.8, .78, .74], .55); for (let i = 0; i < 5; i++) P.rect(x + i * (w - 6) / 4, g - 74, 6, 66, [.92, .9, .86], .45, { edge: 1 }); P.rect(x - 8, g - 8, w + 16, 8, [.75, .72, .68], .55); P.line([[cx - 10, g - 92], [cx + 10, g - 92]], INK, .7, .8); P.line([[cx, g - 98], [cx, g - 92]], INK, .7, .8); P.ell(cx - 10, g - 89, 3, 1.5, [.85, .7, .3], .6); P.ell(cx + 10, g - 89, 3, 1.5, [.85, .7, .3], .6); },
  depot: (P, x, w, g) => { const L = w + 6, bx = x - 3; P.rect(bx, g - 34, L, 26, [.95, .8, .3], .6, { edge: 1.2 }); P.rect(bx, g - 34, L, 5, [.9, .9, .85], .5); for (let i = 0; i < 6; i++) P.rect(bx + 6 + i * (L - 16) / 6, g - 28, (L - 16) / 6 - 3, 9, [.55, .7, .8], .55, { edge: .8 }); P.rect(bx + 2, g - 16, L - 4, 3, [.2, .2, .2], .5); for (const wx of [bx + 14, bx + L - 16]) { P.ell(wx, g - 6, 7, 7, [.15, .15, .17], .75); P.ell(wx, g - 6, 3, 3, [.6, .6, .6], .6); } P.rect(bx + L - 10, g - 30, 8, 10, [.95, .95, .8], .4); P.line([[bx + L * .3, g - 40], [bx + L * .7, g - 40]], [.3, .2, .16], .7, 1.4); },
};
// towns: styled houses in the shop lots, the landmark in the left lot, then the old props and road
function paintTown(key, loc) {
  return painting('town:' + key, () => {
    const T = THEMES[loc.theme], P = new Paint(loc.w || 480, H), g = H - 40; P.seed = key.length * 31;
    paintSkyGround(P, T, g - 30);
    const S = STYLE[loc.theme], lm = LANDMARK[key];
    loc.buildings.forEach((b, i) => {
      if (i === 0 && lm) return;
      const h = S && !b.shop ? S.h[1] + 10 + (i % 2) * 14 : S ? S.h[0] + ((i * 37) % (S.h[1] - S.h[0] + 1)) : b.h;
      paintBuildingStyled(P, Object.assign({ base: g }, b, { h }), T, loc.theme);
    });
    if (lm) { const b = loc.buildings[0]; lm(P, b.x, b.w, g); }
    for (let i = 0; i < (loc.props || 6); i++) PROPS[loc.theme](P, 18 + rnd2(i, key.length) * (P.w - 36), g + 2);
    P.rect(0, g, P.w, 6, pg(T.ground).map(v => v * .7), .35, { jit: 2 });
    if (loc.port) paintDock(P, P.w - 60, g, T);
    if (T.rain) for (let i = 0; i < 160; i++) { const x = rnd2(i, 11) * P.w, y = rnd2(i, 12) * H; P.line([[x, y], [x - 2, y + 7]], [.85, .88, .95], .35, .5); }
    return P.out();
  });
}
