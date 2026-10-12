'use strict';
// ================= SPOOKY GHOST 2: ANOTHER BOOGALOO. art: the ghost in color, 80s people, neon tilesets, portraits =================
// 9-bit color: every hex below sits on the 00/24/49/6D/92/B6/DB/FF grid.
const SG = {}, SGP = {};
const hash2 = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

// ---------------- the ghost, lit ----------------
// 1 outline (hot pink) 2 sheet 3 sheet shade 4 shades 5 shine 6 mouth 7 sparkle
SGP.ghost = pal('#ff24db', '#ffffff', '#b6b6ff', '#101024', '#24dbff', '#ff4999', '#ffff49');
SGP.ghostHurt = SGP.ghost.map((c, i) => i ? hex(i === 1 ? '#ffdbdb' : '#ff6d6d') : 0);
function ghostSprite(dir, f) {
  const s = spr(22, 27, g => {
    g.e(11, 9, 8.6, 8.2, 2); g.r(2, 9, 18, 12, 2);
    for (let x = 2; x < 20; x++) { const d = ((x + f * 2) % 6 < 3) ? 5 : 3; g.r(x, 21, 1, d, 2); }
    g.r(15, 9, 5, 12, 3); g.r(16, 21, 4, 3, 3);
    if (dir === 'd') {
      g.r(4, 7, 14, 4, 4); g.r(5, 8, 3, 1, 5); g.r(12, 8, 3, 1, 5); g.r(9, 7, 4, 1, 4);
      g.r(10, 13, 3, 2, 6);
      g.r(8, 17, 3, 2, 6); g.r(13, 17, 3, 2, 6); g.r(11, 17, 2, 2, 4); // bow tie
      g.e(1.5, 15, 2, 3, 2); g.e(20, 15, 2, 3, 2);
    } else if (dir === 'r') {
      g.r(9, 7, 11, 4, 4); g.r(11, 8, 3, 1, 5); g.r(17, 9, 3, 3, 2); g.r(16, 13, 3, 2, 6);
      g.e(6, 15, 2.5, 3.5, 3);
    } else { g.r(6, 12, 10, 1, 3); g.r(8, 16, 7, 1, 3); }
    g.p(18, 2 + (f & 1), 7); g.p(3, 5 - (f & 1), 7);
  });
  return outline(s, 1);
}
SG.ghost = { d: [0, 1, 2].map(f => ghostSprite('d', f)), u: [0, 1, 2].map(f => ghostSprite('u', f)), r: [0, 1, 2].map(f => ghostSprite('r', f)) };

// ---------------- people: 80s, with a front, a back and a side ----------------
// 1 outline 2 skin 3 hair 4 top 5 top shade 6 bottom 7 shoe 8 white 9 eye 10 accent 11 accent2 12 skin shade
function npc(o, dir, f) {
  const P = pal('#000000', o.skin || '#dbb692', o.hair || '#6d4924', o.top || '#6d6d92', o.top2 || '#494992', o.bottom || '#24246d', o.shoe || '#ffffff', '#ffffff', o.eye || '#242424', o.acc || '#ff24db', o.acc2 || '#24dbff', '#b6926d');
  const s = outline(spr(18, 27, g => {
    const st = f & 1, hs = o.hairStyle || 'short', side = dir === 'r', back = dir === 'u', ox = side ? 1 : 0;
    // legs
    if (side) { g.r(7, 19, 4, 6 - st, 6); g.r(7 + (st ? 2 : -1), 19, 3, 6 - (1 - st), 6); g.r(7, 25 - st, 4, 2, 7); g.r(8 + (st ? 2 : -1), 25, 4, 2, 7); }
    else { g.r(5, 19, 4, 6 - st, 6); g.r(9, 19, 4, 5 + st, 6); g.r(5, 25 - st, 4, 2, 7); g.r(9, 24 + st, 4, 2, 7); }
    if (o.warmers) { if (side) { g.r(7, 22, 4, 3, 10); } else { g.r(5, 22, 4, 2, 10); g.r(9, 22, 4, 2, 10); } }
    // torso + arms
    if (side) { g.r(6, 11, 7, 9, 4); g.r(10, 11, 3, 9, 5); g.r(8 + st, 12, 3, 7, 4); g.p(10 + st, 19, 2); }
    else { g.r(4, 11, 10, 9, 4); g.r(10, 11, 4, 9, 5); g.r(2, 12, 2, 7 + st, 4); g.r(14, 12, 2, 7 - st + 1, 5); g.p(2, 19 + st, 2); g.p(15, 19 - st + 1, 2); }
    if (o.shoulder) { g.r(2, 10, 5, 2, 4); g.r(11, 10, 5, 2, 4); }
    if (o.suit && !back) { g.r(8, 11, 2, 7, 8); g.r(8, 12, 2, 5, 10); }
    if (o.vest) g.r(side ? 7 : 6, 12, side ? 5 : 6, 4, 10);
    // head
    const hx = 9 + ox; g.r(hx - 1, 10, 3, 2, 12);
    if (!(o.hairStyle === 'big' && back)) g.e(hx, 6, 4.8, 5.2, 2);
    if (!back && !side) { g.p(hx - 2, 6, 9); g.p(hx + 2, 6, 9); g.p(hx, 8, 12); if (o.mouth) g.r(hx - 1, 9, 3, 1, 11); }
    if (side) { g.p(hx + 3, 6, 9); g.p(hx + 4, 7, 12); }
    if (o.shades && !back) { if (side) g.r(hx + 1, 5, 5, 2, 1); else g.r(hx - 3, 5, 7, 2, 1); }
    // hair
    if (hs === 'short') { g.e(hx, 3.5, 5, 3, 3); if (back) g.e(hx, 6, 5, 5, 3); else if (side) g.r(hx - 5, 4, 4, 4, 3); else { g.r(hx - 5, 4, 2, 3, 3); g.r(hx + 4, 4, 2, 3, 3); } }
    if (hs === 'big') { g.e(hx, 4, 7, 5.5, 3); g.e(hx - 4, 6, 3.5, 5, 3); g.e(hx + 4, 6, 3.5, 5, 3); if (back) g.e(hx, 6, 6, 7, 3); }
    if (hs === 'mullet') { g.e(hx, 3.5, 5, 3, 3); g.r(hx - 5, 4, 2, 8, 3); g.r(hx + 4, 4, 2, 6, 3); if (back) g.e(hx, 7, 5, 6, 3); }
    if (hs === 'bob') { g.e(hx, 3.5, 5.4, 3.4, 3); g.r(hx - 5, 4, 2, 7, 3); g.r(hx + 4, 4, 2, 7, 3); if (back) g.e(hx, 7, 5, 6, 3); }
    if (hs === 'long') { g.e(hx, 3.5, 5.4, 3.4, 3); g.r(hx - 5, 4, 3, 12, 3); g.r(hx + 3, 4, 3, 12, 3); if (back) g.r(hx - 4, 4, 9, 13, 3); }
    if (hs === 'perm') { g.e(hx, 3, 6.4, 4, 3); for (let i = 0; i < 6; i++) g.p(hx - 5 + i * 2, 1 + (i & 1), 3); if (back) g.e(hx, 6, 6, 6, 3); }
    if (hs === 'pony') { g.e(hx, 3.5, 5.4, 3.4, 3); g.e(hx - 3, 0.5, 3.4, 2.4, 3); g.r(hx - 5, 4, 2, 6, 3); g.r(hx + 4, 4, 2, 6, 3); if (back) { g.e(hx, 6, 5, 5, 3); g.r(hx - 2, 6, 4, 7, 3); } else if (side) g.r(hx - 6, 2, 3, 9, 3); } // Linda's swept-up ponytail
    if (hs === 'hood') { g.e(hx, 6, 6, 6.4, 3); if (!back) g.e(hx, 7, 3.6, 4, 2); }
    if (hs === 'bald' && back) g.e(hx, 6, 4.8, 5.2, 2);
    if (o.band) g.r(hx - 5, 3, 11, 2, 10);
    if (o.headset && !back) { g.r(hx - 5, 4, 1, 5, 1); g.r(hx - 5, 3, 11, 1, 1); g.r(hx - 4, 9, 3, 1, 1); }
    if (o.extra) o.extra(g, dir, f);
  }), 1);
  s.P = P; return s;
}
function npcSet(o) { const set = {}; for (const d of ['d', 'u', 'r']) set[d] = [0, 1].map(f => npc(o, d, f)); return set; }
const LIN = { skin: '#ffdbdb', hair: '#ff6db6', hairStyle: 'pony', mouth: 1, acc2: '#6d2449' };
const PEOPLE = {
  tourist: { skin: '#dbb692', hair: '#6d4924', top: '#ff6d24', top2: '#db4900', bottom: '#2449b6', shoe: '#ffffff', hairStyle: 'short', extra: (g, d) => { if (d !== 'u') g.r(7, 13, 4, 3, 8); } },
  shopper: { skin: '#ffdbb6', hair: '#ffdb49', top: '#24dbb6', top2: '#00b692', bottom: '#ff24db', warmers: 1, band: 1, hairStyle: 'big' },
  jock: { skin: '#db9249', hair: '#241010', top: '#ffffff', top2: '#b6b6b6', bottom: '#db2424', hairStyle: 'mullet', band: 1, acc: '#db2424', warmers: 1 },
  yuppie: { skin: '#dbb692', hair: '#241010', top: '#92b6ff', top2: '#6d92db', bottom: '#242449', shoulder: 1, suit: 1, shades: 1, hairStyle: 'short', acc: '#ff4949' },
  teen: { skin: '#f0c8a0', hair: '#6d24db', top: '#24dbff', top2: '#00b6db', bottom: '#4900b6', hairStyle: 'perm', shades: 1, acc: '#ffff24' },
  dancer: { skin: '#b67a49', hair: '#241010', top: '#ff24db', top2: '#b60092', bottom: '#24dbff', warmers: 1, band: 1, hairStyle: 'big', acc: '#ffff24' },
  stagehand: { skin: '#dbb692', hair: '#242424', top: '#242424', top2: '#101010', bottom: '#242424', shoe: '#494949', hairStyle: 'short', headset: 1, acc: '#ffdb24' },
  tech: { skin: '#f0c8a0', hair: '#6d4924', top: '#ffffff', top2: '#dbdbdb', bottom: '#494992', hairStyle: 'bob', headset: 1, extra: (g, d) => { if (d !== 'u') { g.r(5, 12, 3, 2, 10); g.r(10, 12, 3, 2, 11); } } },
  operator: { skin: '#ffdbb6', hair: '#924924', top: '#ff6db6', top2: '#db4992', bottom: '#6d4992', hairStyle: 'perm', headset: 1, shoulder: 1 },
  juror: { skin: '#dbb692', hair: '#b6b6b6', top: '#92db92', top2: '#6db66d', bottom: '#496d49', hairStyle: 'bob', shades: 0 },
  clerk: { skin: '#f0c8a0', hair: '#242424', top: '#ffffff', top2: '#dbdbdb', bottom: '#242424', hairStyle: 'short', shades: 1, suit: 1 },
  mover: { skin: '#dbb692', hair: '#924924', top: '#24b6db', top2: '#0092b6', bottom: '#242449', hairStyle: 'mullet', shades: 1, acc: '#ffdb24', vest: 1 },
  collector: { skin: '#ffffff', hair: '#ffffff', top: '#242424', top2: '#101010', bottom: '#242424', shoe: '#101010', suit: 1, shoulder: 1, shades: 1, hairStyle: 'bald', acc: '#ff2449' },
  fan: { skin: '#ffdbb6', hair: '#ff6d24', top: '#ff49ff', top2: '#db24db', bottom: '#24246d', hairStyle: 'perm', band: 1, acc: '#24ffdb' },
  // every woman he fell for is the same woman: Linda's face, pink ponytail and dark lips (LIN), only the job's costume changes
  wifeA: { ...LIN, top: '#ff24db', top2: '#b60092', bottom: '#242424', warmers: 1, shoulder: 1, band: 1, acc: '#ffff24' },
  wifeB: { ...LIN, top: '#24dbff', top2: '#00b6db', bottom: '#6d24db', headset: 1, shoulder: 1 },
  wifeC: { ...LIN, top: '#242424', top2: '#101010', bottom: '#242424', shoulder: 1, acc: '#ff2449', extra: (g, d) => { if (d !== 'u') { g.r(7, 12, 4, 4, 8); } } },
  linda: { ...LIN, top: '#242424', top2: '#101010', bottom: '#242424', shoulder: 1, acc: '#ff49b6', extra: (g, d) => { if (d !== 'u') { g.r(d === 'r' ? 10 : 8, 11, 2, 6, 10); } } }, // black uniform, pink tie
  magician: { skin: '#dbb692', hair: '#241010', top: '#242424', top2: '#101010', bottom: '#242424', shoe: '#ffffff', suit: 1, hairStyle: 'short', acc: '#b62424', extra: (g, d) => { g.r(4, 0, 10, 3, 1); g.r(2, 3, 14, 1, 1); g.r(4, 2, 10, 1, 10); if (d !== 'u') { g.r(1, 11, 3, 10, 10); g.r(14, 11, 3, 10, 10); } } },
  patty: { ...LIN, top: '#ff24db', top2: '#b60092', bottom: '#24dbff', warmers: 1, band: 1, acc: '#ffff24' },
};
SG.people = {}; for (const k in PEOPLE) SG.people[k] = npcSet(PEOPLE[k]);

// ---------------- little things ----------------
SGP.item = pal('#000000', '#ffffff', '#ff24db', '#24dbff', '#ffff49', '#6dff24', '#b6b6b6', '#ff4949');
SG.card = spr(14, 14, g => { g.r(1, 2, 12, 10, 1); g.r(2, 3, 10, 8, 2); g.r(3, 5, 8, 1, 3); g.r(3, 7, 6, 1, 3); g.r(3, 9, 7, 1, 3); g.p(11, 2, 4); }), outline(SG.card, 1);
SG.star = spr(14, 14, g => { for (let i = 0; i < 14; i++) { g.r(7 - Math.min(i, 13 - i) / 1.4, i, 1 + Math.min(i, 13 - i) * 1.4, 1, 5); } g.p(7, 6, 1); });
SG.door = [0, 1].map(k => spr(32, 40, g => { // the star door
  g.r(0, 0, 32, 40, 1); g.r(2, 2, 28, 38, k ? 5 : 4); g.r(4, 4, 24, 36, 3); for (let y = 6; y < 38; y += 4) g.r(6, y, 20, 1, 4);
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.28; g.p(16 + Math.cos(a) * 9, 18 + Math.sin(a) * 9, k ? 2 : 6); }
  g.r(12, 14, 8, 8, 2); g.r(14, 16, 4, 4, 1); g.p(15, 17, 5); g.p(16, 17, 5);
}));
SGP.door = pal('#101024', '#ffff49', '#ff24db', '#6d24b6', '#24dbff', '#ffffff');
SG.door = SG.door.map(s => outline(s, 1));
SGP.doorOpen = pal('#101024', '#ffff49', '#ffffff', '#ffff92', '#fff6b6', '#ffffff');
SG.sparkle = [0, 1, 2].map(k => spr(7, 7, g => { g.r(3, 3 - k, 1, 1 + 2 * k, 1); g.r(3 - k, 3, 1 + 2 * k, 1, 1); g.p(3, 3, 2); }));

// ---------------- portraits (48x48) ----------------
// bg, skin, skin shade, hair, top, white, eyes, accent, bg stripe
function bust(c, o = {}) {
  const P = pal(c.bg, c.skin || '#dbb692', c.shade || '#b6926d', c.hair || '#241010', c.top || '#6d6d92', '#ffffff', '#101010', c.acc || '#ff24db', c.bg2 || '#2a0a4a', c.acc2 || '#24dbff', '#6d2449', '#ff49b6'); // 11 dark lips, 12 pink eyeshadow
  const s = portrait(g => {
    g.r(0, 0, 48, 48, 1); for (let y = 2; y < 48; y += 9) g.r(0, y, 48, 2, 9);
    if (o.rays) for (let i = 0; i < 9; i++) g.line(24, 24, 24 + Math.cos(i * .7) * 40, 24 + Math.sin(i * .7) * 40, 9);
    g.e(24, 52, 22, 13, 5); if (o.shoulder) { g.r(2, 37, 12, 6, 5); g.r(34, 37, 12, 6, 5); g.r(2, 37, 12, 1, 8); g.r(34, 37, 12, 1, 8); }
    if (o.suit) { g.line(18, 39, 22, 47, 6); g.line(30, 39, 26, 47, 6); g.r(22, 39, 4, 8, 8); }
    g.e(24, 23, 13, 15, 2); g.e(29, 25, 7, 13, 3);
    const hs = o.hair || 'short';
    if (hs === 'perm' || hs === 'big') { g.e(24, 12, 20, 12, 4); g.e(10, 22, 6, 11, 4); g.e(38, 22, 6, 11, 4); for (let i = 0; i < 8; i++) g.p(8 + i * 4, 2 + (i & 1) * 2, 4); g.e(24, 12, 14, 6, 2); }
    if (hs === 'bob') { g.e(24, 10, 15, 8, 4); g.r(9, 10, 5, 18, 4); g.r(34, 10, 5, 18, 4); g.r(14, 10, 20, 4, 4); }
    if (hs === 'long') { g.e(24, 10, 15, 8, 4); g.r(9, 10, 6, 34, 4); g.r(33, 10, 6, 34, 4); g.r(14, 10, 20, 3, 4); }
    if (hs === 'pony') { g.e(24, 11, 15, 8, 4); g.e(13, 6, 9, 7, 4); g.e(7, 16, 5, 9, 4); g.e(6, 28, 4, 8, 4); g.r(9, 10, 5, 22, 4); g.r(34, 10, 5, 20, 4); g.e(37, 31, 4, 4, 4); g.r(16, 10, 18, 3, 4); } // Linda: swept-up ponytail, curls at the jaw
    if (hs === 'slick') { g.e(24, 8, 16, 7, 4); g.r(9, 8, 5, 12, 4); g.r(34, 8, 5, 12, 4); }
    if (hs === 'mullet') { g.e(24, 9, 15, 7, 4); g.r(9, 9, 4, 24, 4); g.r(35, 9, 4, 20, 4); }
    if (o.band) { g.r(9, 10, 30, 3, 8); g.r(9, 13, 30, 1, 10); }
    if (o.shades) { g.r(12, 19, 24, 6, 7); g.r(15, 20, 5, 1, 6); g.r(27, 20, 5, 1, 6); g.r(23, 20, 2, 1, 7); }
    else { g.r(16, 20, 5, 3, 6); g.r(27, 20, 5, 3, 6); g.p(17, 20, 7 - 1); g.p(28, 20, 6); }
    if (o.lens) { g.line(13, 19, 20, 26, 6); }
    if (o.lin && !o.shades) { g.r(15, 18, 7, 2, 12); g.r(26, 18, 7, 2, 12); g.r(18, 21, 2, 2, 7); g.r(29, 21, 2, 2, 7); }
    g.r(19, 31, 10, 2, o.lin ? 11 : 8); if (o.smile) { g.p(18, 30, 8); g.p(30, 30, 8); }
    if (o.headset) { g.r(7, 15, 3, 14, 7); g.line(9, 28, 18, 33, 7); g.r(17, 32, 4, 2, 8); }
    if (o.earring) { g.p(10, 29, 10); g.p(38, 29, 10); }
    if (o.glasses) { g.r(14, 19, 8, 1, 10); g.r(14, 24, 8, 1, 10); g.r(14, 19, 1, 6, 10); g.r(21, 19, 1, 6, 10); g.r(26, 19, 8, 1, 10); g.r(26, 24, 8, 1, 10); g.r(26, 19, 1, 6, 10); g.r(33, 19, 1, 6, 10); }
    if (o.stripe) { g.r(0, 44, 48, 4, 8); }
  });
  return { s, P };
}
const SGPORT = {
  PATTY: bust({ bg: '#240049', bg2: '#4900b6', skin: '#ffdbdb', shade: '#dbb6b6', hair: '#ff6db6', top: '#ff24db', acc: '#24dbff' }, { hair: 'pony', lin: 1, band: 1, rays: 1 }),
  CHOREOGRAPHER: bust({ bg: '#24004a', bg2: '#6d0092', skin: '#ffdbdb', shade: '#dbb6b6', hair: '#ff6db6', top: '#ff24db', acc: '#ffff24' }, { hair: 'pony', lin: 1, shoulder: 1, earring: 1 }),
  'CALL-IN HOST': bust({ bg: '#00246d', bg2: '#0049b6', skin: '#ffdbdb', shade: '#dbb6b6', hair: '#ff6db6', top: '#24dbff', acc: '#ffffff' }, { hair: 'pony', lin: 1, headset: 1, shoulder: 1 }),
  'JUDGE': bust({ bg: '#240010', bg2: '#6d0024', skin: '#ffdbdb', shade: '#dbb6b6', hair: '#ff6db6', top: '#242424', acc: '#ff2449' }, { hair: 'pony', lin: 1, shoulder: 1, glasses: 1 }),
  MAGICIAN: bust({ bg: '#241008', bg2: '#492410', skin: '#dbb692', shade: '#b6926d', hair: '#241010', top: '#b62424', acc: '#ffdb24' }, { hair: 'slick', smile: 1 }),
  COLLECTOR: bust({ bg: '#101010', bg2: '#242424', skin: '#ffffff', shade: '#dbdbdb', hair: '#ffffff', top: '#242424', acc: '#ff2449' }, { hair: 'slick', suit: 1, shades: 1, shoulder: 1 }),
  PROMOTER: bust({ bg: '#102400', bg2: '#244900', skin: '#dbb692', shade: '#b6926d', hair: '#241010', top: '#92b6ff', acc: '#ff4949' }, { hair: 'slick', suit: 1, shades: 1, shoulder: 1 }),
  'NETWORK FAX': bust({ bg: '#101018', bg2: '#242449', skin: '#dbdbdb', shade: '#b6b6b6', hair: '#6d6d6d', top: '#494949', acc: '#6dff24' }, { hair: 'short', headset: 1 }),
};
