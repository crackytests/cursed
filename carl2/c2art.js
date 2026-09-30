'use strict';
// ================= CARL 2: art — sprites, people, bosses, items, portraits =================
// Carl is in color now. Marketing did that. He has feelings about it.
const CP = {}, CS = {};

// ---------------- CARL (top-down, 16x22): big head, huge green eyes, backwards cap, hoodie, bow tie ----------------
CP.carl = pal('#000000', '#6db66d', '#249249', '#92db92', '#242424', '#494949', '#6dff24', '#004900', '#ffffff', '#242449', '#dbb624', '#ffdb24', '#492424', '#492424');
// 1 outline 2 skin 3 shade 4 hi 5 cap 6 cap hi 7 eye 8 pupil 9 white 10 hoodie 11 gold 12 tie 13 shoe 14 mouth
function carlSprite(dir, f, throwing, P = CP.carl) {
  const step = f & 1;
  return outline(spr(16, 23, g => {
    // legs + body first so the head overlaps
    const lg = (x, dy) => { g.r(x, 19, 2, 2 + dy, 10); g.r(x, 20 + dy, 2, 1, 13); };
    if (dir === 'r') {
      lg(6 + step, 1 - step); lg(9 - step, step);
      g.r(6, 14, 5, 6, 10); g.r(7, 14, 1, 6, 11); g.p(8, 14, 12); g.p(9, 14, 12);
      if (throwing) { g.r(10, 14, 4, 2, 10); g.p(14, 14, 2); g.p(15, 14, 2); } else { g.r(8, 15, 2, 3, 10); g.p(9, 18, 2); }
      g.e(8.5, 8.5, 6.6, 6.6, 2); g.each((x, y) => g.get(x, y) === 2 && (x < 5 || y > 12) ? 3 : 0); g.p(12, 5, 4); g.p(13, 6, 4);
      g.e(7.5, 4.6, 6, 3.6, 5); g.r(1.5, 4, 12, 2, 5); g.r(0, 5, 4, 2, 5); g.r(0, 5, 3, 1, 6); g.r(6, 2, 3, 1, 6);
      g.e(12, 9.5, 2.3, 2.7, 7); g.p(13, 10, 8); g.p(12, 10, 8); g.p(11, 8, 9); g.p(14, 13, 14);
      return;
    }
    const up = dir === 'u';
    lg(5, up ? step : 1 - step); lg(9, up ? 1 - step : step);
    g.r(5, 14, 6, 6, 10); g.r(4, 14, 1, 3, 10); g.r(11, 14, 1, 3, 10);
    if (!up) { g.r(8, 15, 1, 5, 11); g.p(7, 14, 12); g.p(9, 14, 12); g.p(8, 14, 11); }
    else g.r(6, 13, 4, 2, 10);
    if (throwing) { g.r(12, 11, 2, 4, 10); g.p(12, 10, 2); g.p(13, 10, 2); } else { g.p(4, 17, 2); g.p(11, 17, 2); }
    g.e(8, 8.5, 7, 6.8, 2); g.each((x, y) => g.get(x, y) === 2 && (x > 11 && y > 8) ? 3 : 0); g.p(3, 7, 4); g.p(4, 6, 4);
    if (up) { g.e(8, 6.2, 7, 5.4, 5); g.r(4, 10, 8, 2, 5); g.r(4, 11, 8, 1, 6); g.r(5, 3, 3, 1, 6); g.p(8, 1, 6); }
    else {
      g.e(8, 4.3, 6.4, 3.8, 5); g.r(1.6, 4, 13, 2, 5); g.r(5, 0, 6, 1, 5); g.r(5, 2, 3, 1, 6);
      for (const ex of [4.6, 11.4]) { g.e(ex, 9.6, 2.5, 2.8, 7); g.p(ex, 10, 8); g.p(ex, 11, 8); g.p(ex - 1, 8, 9); }
      g.p(8, 13, 14);
    }
  }), 1);
}
CS.carl = {}; for (const d of ['d', 'u', 'r']) CS.carl[d] = [carlSprite(d, 0), carlSprite(d, 1), carlSprite(d, 0, 1)];
CS.carl.l = CS.carl.r; // drawn flipped

// ---------------- HU-MAN (20x32): the focus-tested "normal human" Carl ----------------
CP.human = pal('#000000', '#dbb692', '#b6926d', '#ffdbb6', '#ffdb49', '#dbb624', '#242424', '#494949', '#ffffff', '#24496d', '#246d92', '#ffdb24', '#6d4924', '#6dffff', '#242424');
// 1 outline 2 skin 3 shade 4 hi 5 hair 6 hair2 7 jacket 8 jacket hi 9 white 10 jeans 11 jeans hi 12 tie/buckle 13 belt 14 glow 15 shades
function humanSprite(dir, f, swing) {
  const step = f & 1;
  return outline(spr(22, 33, g => {
    const leg = (x, dy) => { g.r(x, 22, 4, 8 + dy, 10); g.r(x + 1, 22, 1, 7 + dy, 11); g.r(x, 29 + dy, 4, 2, 7); };
    if (dir === 'r') {
      leg(7 + step, 1 - step); leg(10 - step, step);
      g.r(6, 13, 9, 9, 9); g.r(5, 13, 3, 9, 7); g.r(13, 13, 3, 9, 7); g.r(6, 20, 9, 2, 13); g.p(12, 20, 12);
      g.e(11, 17, 3, 4, 2); g.r(10, 18, 3, 4, 2); if (swing) { g.r(12, 13, 6, 3, 2); g.p(18, 13, 3); }
      g.e(11, 7, 5, 5.5, 2); g.r(11, 9, 5, 4, 2); g.r(15, 10, 1, 2, 3); g.r(8, 3, 9, 4, 5); g.e(13, 3, 5, 2.5, 5); g.r(9, 2, 6, 1, 6);
      g.r(12, 6, 5, 2, 15); g.p(15, 11, 9); g.p(9, 7, 3);
      g.p(9, 12, 12); g.p(11, 12, 12);
      return;
    }
    const up = dir === 'u';
    leg(6, up ? step : 1 - step); leg(12, up ? 1 - step : step);
    g.r(5, 13, 12, 9, up ? 7 : 9); g.r(4, 13, 4, 9, 7); g.r(14, 13, 4, 9, 7); g.r(5, 20, 12, 2, 13); if (!up) g.r(10, 20, 2, 2, 12);
    if (up) { g.r(9, 14, 4, 1, 8); g.r(10, 15, 2, 3, 8); }
    for (const [ax, fl] of [[1, -1], [18, 1]]) { g.e(ax + 1.5, 16, 2.2, 3.5, 2); g.r(ax, 17, 3, 5, 2); g.p(ax + 1, 15, 4); }
    if (swing) { g.r(18, 9, 3, 6, 2); g.p(19, 8, 3); }
    g.e(11, 7, 5, 5.5, 2); g.r(6, 8, 10, 5, 2); g.r(7, 12, 8, 1, 3);
    if (up) { g.e(11, 5, 5.5, 4.5, 5); g.r(6, 4, 11, 5, 5); g.r(8, 3, 6, 1, 6); }
    else {
      g.r(6, 2, 10, 4, 5); g.e(11, 2.5, 5.5, 2.4, 5); g.r(7, 1, 7, 1, 6); g.r(12, 3, 3, 1, 6);
      g.r(6, 6, 10, 2, 15); g.p(11, 6, 1); g.p(7, 6, 8); g.r(8, 10, 6, 1, 9); g.p(11, 12, 3);
      g.r(9, 12, 1, 1, 12); g.r(12, 12, 1, 1, 12);
    }
  }), 1);
}
CS.human = {}; for (const d of ['d', 'u', 'r']) CS.human[d] = [humanSprite(d, 0), humanSprite(d, 1), humanSprite(d, 0, 1)];
CS.human.l = CS.human.r;

// ---------------- generic people (16x24): enemies + NPCs ----------------
// o: {skin, hair, top, top2, bottom, shoe, face:'blank'|'normal'|'visor'|'mustache', hat, hairStyle, extra(g)}
function person(o, f) {
  const P = pal('#000000', o.skin || '#dbb692', o.hair || '#6d4924', o.top || '#6d6d92', o.top2 || '#494992', o.bottom || '#24246d', o.shoe || '#242424', '#ffffff', o.eye || '#242424', o.hat || '#24246d', o.acc || '#dbdb24', o.acc2 || '#db2424', '#b6926d');
  // 1 outline 2 skin 3 hair 4 top 5 top shade 6 bottom 7 shoe 8 white 9 eye 10 hat 11 acc 12 acc2 13 skin shade
  const s = outline(spr(16, 25, g => {
    const step = f & 1;
    g.r(5, 17, 3, 6 - step, 6); g.r(8, 17, 3, 5 + step, 6); g.r(5, 22 - step, 3, 2, 7); g.r(8, 21 + step, 3, 2, 7);
    g.r(4, 10, 8, 8, 4); g.r(9, 10, 3, 8, 5); g.r(2, 11, 2, 6 + step, 4); g.r(12, 11, 2, 6 - step, 5); g.p(2, 17 + step, 2); g.p(13, 17 - step, 2);
    g.e(8, 5.5, 4.6, 4.8, 2); g.r(9, 7, 3, 3, 13); g.r(6, 9, 4, 2, 2);
    const hs = o.hairStyle || 'short';
    if (hs === 'short') { g.e(8, 3, 4.8, 2.8, 3); g.r(3, 3, 2, 3, 3); g.r(11, 3, 2, 3, 3); }
    if (hs === 'bob') { g.e(8, 3.5, 5.2, 3.2, 3); g.r(3, 3, 2, 7, 3); g.r(11, 3, 2, 7, 3); }
    if (hs === 'long') { g.e(8, 3.5, 5.2, 3.2, 3); g.r(3, 3, 2, 10, 3); g.r(11, 3, 2, 10, 3); }
    if (hs === 'hood') { g.e(8, 5, 5.6, 5.8, 3); }
    if (o.hat === undefined ? false : o.hatStyle !== 'none') {
      if (o.hatStyle === 'cap') { g.e(8, 2.5, 4.8, 2.3, 10); g.r(3, 3, 10, 1, 10); g.r(5, 4, 6, 1, 10); g.p(8, 2, 11); }
      if (o.hatStyle === 'fedora') { g.r(3, 3, 10, 2, 10); g.r(5, 0, 6, 3, 10); g.r(5, 2, 6, 1, 12); }
    }
    const fc = o.face || 'normal';
    if (fc === 'normal' || fc === 'mustache') { g.p(6, 6, 9); g.p(10, 6, 9); if (fc === 'mustache') g.r(6, 8, 5, 1, 3); else g.p(8, 8, 13); }
    if (fc === 'visor') { g.r(4, 4, 9, 4, 9); g.r(5, 5, 2, 1, 8); }
    if (fc === 'blank') { /* focus group: no features at all */ }
    if (o.extra) o.extra(g, f);
  }), 1);
  s.P = P; return s;
}
const PEOPLE = {
  focus: { skin: '#dbc8a0', hair: '#dbc8a0', top: '#b6a07a', top2: '#927a5a', bottom: '#6d5a49', face: 'blank', hairStyle: 'none',
    extra: (g, f) => { g.r(9, 11, 5, 6, 8); g.r(10, 12, 3, 1, 9); g.r(10, 14, 3, 1, 9); g.r(10, 10, 3, 1, 12); } },
  cop: { top: '#4970b6', top2: '#24498f', bottom: '#242449', hat: '#24248f', hatStyle: 'cap', face: 'mustache', hair: '#492424', acc: '#ffdb24',
    extra: g => { g.p(5, 12, 11); g.r(4, 16, 8, 1, 7); } },
  suit: { skin: '#ffffff', hair: '#ffffff', top: '#ffffff', top2: '#dbdbdb', bottom: '#dbdbdb', shoe: '#b6b6b6', face: 'visor', eye: '#101010', hairStyle: 'hood' },
  content: { skin: '#ffffff', hair: '#ffffff', top: '#ffffff', top2: '#dbdbdb', bottom: '#dbdbdb', shoe: '#b6b6b6', face: 'visor', eye: '#101010', hairStyle: 'hood',
    extra: g => { g.r(7, 11, 2, 5, 12); g.r(12, 12, 3, 4, 8); } },
  waitress: { skin: '#ffdbb6', hair: '#ff92b6', top: '#92dbff', top2: '#6db6db', bottom: '#92dbff', hairStyle: 'bob', extra: g => { g.r(5, 13, 6, 5, 8); } },
  lindalite: { skin: '#ffdbdb', hair: '#ffb6db', top: '#ff6db6', top2: '#db4992', bottom: '#b62470', hairStyle: 'bob', extra: g => { g.r(9, 12, 4, 3, 11); } },
  clerk: { skin: '#f0c8a0', hair: '#dbb649', top: '#492449', top2: '#241024', bottom: '#242449', extra: g => { g.r(5, 5, 7, 2, 9); g.p(7, 6, 8); g.p(10, 6, 8); } },
  hitch: { skin: '#dbb692', hair: '#6d4924', top: '#b64924', top2: '#923624', bottom: '#49496d', hairStyle: 'long', extra: g => { g.r(5, 7, 7, 3, 3); g.r(13, 9, 2, 3, 2); } },
  fan: { skin: '#ffdbb6', hair: '#242424', top: '#6dff24', top2: '#49b624', bottom: '#24246d', hat: '#6dff24', hatStyle: 'cap' },
  mayor: { top: '#242424', top2: '#101010', bottom: '#242424', hair: '#6d6d6d', extra: g => { g.r(7, 10, 2, 6, 12); } },
  exec: { skin: '#dbb692', hair: '#242424', top: '#242449', top2: '#101024', bottom: '#242449', extra: g => { g.r(7, 10, 2, 6, 12); g.r(12, 12, 3, 5, 3); } },
  kidfan: { skin: '#ffdbb6', hair: '#924924', top: '#ff9224', top2: '#db6d00', bottom: '#2449b6' },
  cosmo: { skin: '#dbb692', hair: '#b62424', top: '#db2424', top2: '#921a1a', bottom: '#921a1a', shoe: '#494949', face: 'visor', eye: '#6dffff', hairStyle: 'hood', extra: g => { g.p(8, 12, 11); } },
  comrade: { skin: '#6db66d', hair: '#6d2424', top: '#db2424', top2: '#922424', bottom: '#492424', face: 'normal', eye: '#6dff24', hairStyle: 'short', hat: '#6d4924', hatStyle: 'cap' },
};
CS.people = {}; for (const k in PEOPLE) CS.people[k] = [0, 1].map(f => person(PEOPLE[k], f));

// Comrade Carl: same guy, family never crashed. red blanket cape + fur hat
CP.comrade = CP.carl.slice(); CP.comrade[5] = hex('#6d4924'); CP.comrade[6] = hex('#926d49'); CP.comrade[10] = hex('#b62424'); CP.comrade[11] = hex('#ffdb24'); CP.comrade[12] = hex('#ffdb24');
// Carl in four shades (the old cartridge) and the "classic skin"
CP.carlLegacy = legacyPal(CP.carl, 'dmg');

// ---------------- companions ----------------
// JB GARFIELD, top-down: orange cat in fedora + trench coat
CP.garf = pal('#000000', '#ff9224', '#db6d00', '#ffffdb', '#b6b6b6', '#6d6d6d', '#dbb692', '#926d49', '#242424', '#ffffff', '#242424');
function garfSprite(f, nap) {
  return outline(spr(18, 24, g => {
    const step = f & 1;
    g.r(5, 19, 3, 4 - step, 7); g.r(10, 19, 3, 3 + step, 7);
    g.r(4, 12, 10, 8, 6); g.r(9, 12, 5, 8, 7); g.r(8, 12, 2, 6, 9); g.r(3, 13, 2, 6, 6); g.r(13, 13, 2, 6, 7);
    g.e(9, 8, 6.5, 5, 2); g.r(3, 7, 2, 3, 2); g.r(13, 7, 2, 3, 2); g.line(3, 8, 5, 8, 3); g.line(13, 8, 15, 8, 3);
    g.e(9, 10, 3, 2, 4); g.p(9, 9, 11);
    if (nap) { g.r(5, 7, 3, 1, 11); g.r(10, 7, 3, 1, 11); } else { g.r(5, 6, 3, 2, 10); g.r(10, 6, 3, 2, 10); g.r(5, 6, 3, 1, 2); g.r(10, 6, 3, 1, 2); g.p(6, 7, 11); g.p(11, 7, 11); }
    g.r(3, 3, 12, 2, 5); g.r(5, 0, 8, 3, 5); g.r(5, 2, 8, 1, 11);
  }), 1);
}
CS.garf = [garfSprite(0), garfSprite(1), garfSprite(0, 1)];

// BRUCE: a land shark. little legs. he has been jumped before
CP.shark = pal('#000000', '#6d92b6', '#49708f', '#dbdbff', '#ffffff', '#242424', '#db6d6d', '#92b6db', '#b6b6b6');
function sharkSprite(f, bite) {
  return outline(spr(28, 18, g => {
    const step = f & 1;
    g.r(7 + step, 13, 2, 3, 2); g.r(12 - step, 13, 2, 3, 2); g.r(17 + step, 13, 2, 3, 2); g.r(21 - step, 13, 2, 3, 2);
    g.e(14, 9, 12, 5, 2); g.e(15, 11, 10, 2.5, 3); g.line(3, 9, 1, 5, 2); g.line(3, 9, 1, 13, 2); g.r(0, 4, 2, 3, 2); g.r(0, 12, 2, 3, 2);
    g.line(12, 4, 15, 0, 2); g.line(13, 4, 16, 0, 2); g.line(14, 4, 17, 1, 8); g.r(11, 3, 6, 2, 2);
    g.p(23, 7, 5); g.p(22, 6, 3);
    if (bite) { g.r(20, 10, 8, 3, 6); for (let x = 20; x < 27; x += 2) { g.p(x, 10, 4); g.p(x + 1, 12, 4); } }
    else { g.line(20, 11, 26, 10, 1); for (let x = 21; x < 26; x += 2) g.p(x, 11, 4); }
    g.line(18, 7, 18, 10, 3); g.line(19, 7, 19, 10, 3);
  }), 1);
}
CS.shark = [sharkSprite(0), sharkSprite(1), sharkSprite(0, 1)];

// SPOOKY GHOST (four shades of red unless YOKO's true ending colored him)
CP.ghost = pal('#101010', '#ffffff', '#dbdbdb', '#242424', '#ff9292', '#b6b6b6');
CS.ghost = [0, 1].map(f => outline(spr(18, 22, g => {
  g.e(9, 8, 7.5, 7.5, 2); g.r(1.5, 8, 15, 10, 2); for (let i = 0; i < 4; i++) g.e(3.5 + i * 3.8, 18 + ((i + f) & 1), 2, 2.5, 2);
g.e(6, 8, 1.6, 2.4, 4); g.e(12, 8, 1.6, 2.4, 4); g.e(9, 13, 2.4, 1.6, 4); g.p(8, 14, 2); g.p(10, 14, 2);
}), 1));
// CEO LINDA: pink bob, sharp suit
CS.linda = [0, 1].map(f => person({ skin: '#ffdbdb', hair: '#ff92c8', top: '#242424', top2: '#101010', bottom: '#242424', hairStyle: 'bob', acc: '#ff6db6', extra: g => { g.r(7, 10, 2, 7, 11); } }, f));

// ---------------- enemies ----------------
CP.cart = pal('#000000', '#b6b6db', '#6d6d92', '#db2424', '#242424', '#ffffff');
CS.cart = [0, 1].map(f => outline(spr(18, 16, g => {
  for (let x = 2; x < 16; x += 3) g.r(x, 2, 1, 9, 2); for (let y = 2; y < 11; y += 3) g.r(1, y, 16, 1, 2); g.r(1, 2, 16, 1, 1 + 1); g.r(14, 0, 1, 3, 2); g.r(13, 0, 4, 1, 3);
  g.r(1, 10, 16, 2, 3); g.e(4, 14, 1.6, 1.6, 4); g.e(14, 14 - (f & 1), 1.6, 1.6, 4); g.p(4, 13, 5);
}), 1));
CP.weed = pal('#000000', '#b6924a', '#926d24', '#dbb66d');
CS.tumble = [0, 1, 2, 3].map(f => outline(spr(16, 16, g => {
  const a = f * Math.PI / 8; for (let i = 0; i < 26; i++) { const t = i * 2.4 + a, r = 3 + (i * 7 % 5); g.line(8 + Math.cos(t) * r, 8 + Math.sin(t) * r, 8 + Math.cos(t + 1.9) * (r + 1), 8 + Math.sin(t + 1.9) * (r + 1), 1 + (i % 3)); }
}), 1));
CP.jack = pal('#000000', '#b6926d', '#926d49', '#ffffff', '#6d4924', '#242424', '#ff9292');
CS.jack = [0, 1].map(f => outline(spr(18, 18, g => {
  g.e(9, 12, 5, 4, 2); g.e(13, 8, 3.5, 3, 2); g.r(12, 1, 1, 5, 4); g.r(15, 1, 1, 5, 4); g.p(11, 2, 4); g.p(16, 2, 4); g.p(10, 1, 4); g.p(17, 1, 4);
  g.r(11, 3, 1, 3, 1 + 1); g.r(15, 3, 1, 3, 2); g.p(14, 8, 5); g.p(16, 9, 6); g.e(4, 12, 2, 2, 3);
  g.r(6 + (f & 1) * 2, 15, 2, 3, 3); g.r(11 - (f & 1) * 2, 15, 2, 3, 3);
}), 1));
// HU-MAN action figure, still in the blister pack. merch.
CS.figure = [0, 1].map(f => { const s = spr(14, 22, g => { g.r(0, 0, 14, 22, 13); g.r(1, 1, 12, 20, 9); g.r(0, 0, 14, 3, 12); }); return s; });
CP.figure = CP.human;
CP.umb = pal('#000000', '#db2424', '#922424', '#6d4924', '#ffffff', '#2449b6', '#246dff');
CS.umbrella = [0, 1].map(f => outline(spr(18, 18, g => {
  if (f) { g.e(9, 7, 8, 5, 1 + 1); g.r(1, 7, 16, 2, 2); for (let x = 1; x < 17; x += 4) g.e(x + 2, 9, 2, 1, 3); g.r(9, 7, 1, 10, 4); g.r(8, 16, 2, 1, 4); }
  else { g.line(9, 1, 7, 12, 2); g.line(9, 1, 11, 12, 3); g.line(9, 1, 9, 12, 2); g.r(9, 12, 1, 5, 4); g.r(8, 16, 2, 1, 4); }
}), 1));
CP.mask = pal('#000000', '#ffdbb6', '#dbb692', '#242424', '#db6d6d');
CS.mask = [0, 1].map(f => outline(spr(14, 16, g => { g.e(7, 8, 6, 7, 2); g.e(9, 9, 4, 6, 3); g.e(4.5, 7, 1.4, 1.8 - f * .8, 4); g.e(9.5, 7, 1.4, 1.8 - f * .8, 4); g.r(5, 12, 4, 1, 5); }), 1));
CP.bubble = pal('#000000', '#ffffff', '#b6b6db', '#db2449');
CP.bot = pal('#000000', '#6d6d92', '#494970', '#db2424', '#ffdb24', '#92b6db', '#242424');
CS.drone = [0, 1].map(f => outline(spr(16, 12, g => { g.r(2, 4, 12, 5, 2); g.r(3, 8, 10, 2, 3); g.e(8, 6, 2, 2, 4); g.p(8, 6, 5); g.r(0, 2 - (f & 1), 6, 1, 6); g.r(10, 2 - (f & 1), 6, 1, 6); g.r(2, 2, 1, 2, 7); g.r(13, 2, 1, 2, 7); }), 1));

// ---------------- bosses ----------------
// ROBO MALL COP: a mall cop who accepted every upgrade. segway included.
CP.robo = pal('#000000', '#4970b6', '#24498f', '#b6b6db', '#6d6d92', '#db2424', '#ff6d6d', '#dbb692', '#492424', '#ffdb24', '#242424', '#ffffff', '#92b6db');
CS.robo = [0, 1].map(f => outline(spr(40, 50, g => {
  g.r(8, 44, 24, 4, 11); g.e(10, 47, 3, 3, 11); g.e(30, 47, 3, 3, 11); g.p(10, 46, 13); g.p(30, 46, 13); g.r(18, 34, 4, 11, 5); g.r(12, 32, 16, 3, 4);
  g.r(10, 16, 20, 17, 2); g.r(22, 16, 8, 17, 3); g.r(18, 18, 4, 4, 10); g.r(11, 20, 5, 3, 12); g.r(10, 28, 20, 2, 11);
  g.r(4, 17, 6, 12, 4); g.r(30, 17, 6, 12, 4); g.r(2, 26 + (f & 1), 6, 5, 5); g.r(32, 26 - (f & 1), 6, 5, 4); g.r(35, 12, 3, 16, 11); g.r(34, 10, 5, 3, 6);
  g.e(20, 10, 8, 7.5, 8); g.r(12, 10, 8, 7, 5); g.e(15, 11, 3, 3, 6); g.e(15, 11, 1.5, 1.5, 7 + (f & 1) * 5 - (f & 1) * 5); g.p(15, 11, 12);
  g.r(21, 13, 7, 2, 9); g.e(20, 4, 9, 3.5, 3); g.r(11, 5, 18, 2, 3); g.r(19, 1, 3, 3, 10);
}), 1));
// THE CONTENT VAN: white van, satellite dish, sliding door full of focus testers
CP.van = pal('#000000', '#ffffff', '#dbdbdb', '#b6b6b6', '#242449', '#6d92db', '#242424', '#6d6d6d', '#db2424', '#ffdb24');
CS.van = [0, 1].map(f => outline(spr(64, 38, g => {
  g.r(2, 8, 58, 22, 2); g.r(2, 24, 58, 6, 3); g.r(44, 10, 14, 10, 5); g.r(45, 11, 12, 3, 6); g.r(6, 11, 12, 8, 5); g.r(22, 10, 18, 18, 3); g.r(23, 11, 16, 16, 4 + (f & 1));
  g.e(13, 31, 5, 5, 7); g.e(50, 31, 5, 5, 7); g.e(13, 31, 2, 2, 8); g.e(50, 31, 2, 2, 8); g.r(58, 20, 3, 4, 10); g.r(1, 20, 2, 3, 9);
  g.e(28, 3, 7, 3, 3); g.r(27, 5, 2, 4, 8); g.p(28, 1, 9); g.r(4, 15, 14, 1, 9); for (let x = 6; x < 18; x += 3) g.p(x, 17, 1);
}), 1));
// HEAD OF CONTENT: white suit, black visor, a tie, a clipboard
CP.hoc = pal('#000000', '#ffffff', '#dbdbdb', '#b6b6b6', '#101010', '#db2424', '#6dffff', '#dbb624', '#6d6d6d');
CS.hoc = [0, 1].map(f => outline(spr(32, 42, g => {
  const s = f & 1;
  g.r(10, 30, 5, 10 - s, 2); g.r(17, 30, 5, 9 + s, 2); g.r(9, 38 - s, 7, 3, 3); g.r(16, 37 + s, 7, 3, 3);
  g.r(7, 15, 18, 16, 2); g.r(19, 15, 6, 16, 3); g.r(15, 15, 2, 12, 6); g.r(3, 16, 4, 12, 2); g.r(25, 16, 4, 12, 3);
  g.r(24, 20, 8, 10, 3); g.r(25, 21, 6, 8, 2); for (let y = 22; y < 29; y += 2) g.r(26, y, 4, 1, 9);
  g.e(16, 8, 8, 8, 2); g.r(9, 5, 14, 6, 5); g.r(10, 6, 4, 1, 7); g.r(9, 10 + s, 14, 1, 3);
}), 1));
// THE CROSSOVER: everyone's bosses stitched together. licensing nightmare.
CP.xover = pal('#000000', '#ff92c8', '#db4992', '#ffdbdb', '#242424', '#ff2424', '#b6b6b6', '#6d6d6d', '#ffffff', '#6dff24', '#24dbff', '#ffdb24', '#b692ff', '#492449');
CS.xover = [0, 1].map(f => outline(spr(64, 64, g => {
  const s = f & 1;
  g.r(18, 26, 28, 34, 7); g.r(20, 28, 24, 30, 6); for (let y = 30; y < 58; y += 6) g.r(20, y, 24, 1, 7); g.r(28, 34, 8, 12, 12); g.r(30, 36, 4, 8, 4);
  g.e(32, 16, 13, 12, 3); g.r(19, 4, 26, 9, 1); g.e(32, 6, 14, 5, 1); g.r(18, 10, 4, 14, 1); g.r(42, 10, 4, 14, 1);
  g.e(26, 17, 3, 2, 4); g.e(38, 17, 3, 2, 4); g.p(26, 17, 9); g.p(38, 17, 5); g.r(28, 23, 8, 2, 2);
  g.line(19, 20, 45, 20, 8); for (let x = 20; x < 45; x += 3) g.p(x, 21, 8);
  g.r(4 - s, 30, 14, 10, 8); g.r(6 - s, 32, 10, 1, 4); g.r(6 - s, 35, 7, 1, 4); g.r(46 + s, 40, 14, 10, 8); g.r(48 + s, 42, 10, 1, 4); g.r(48 + s, 45, 6, 1, 4);
  g.e(10, 54, 7, 7, 13); g.e(10, 54, 4, 4, 10); g.p(10, 54, 9); g.r(40, 2, 20, 8, 5); g.r(42, 4, 16, 4, 4); g.r(48, 3, 4, 6, 11);
}), 1));

// ---------------- items + effects ----------------
CP.item = pal('#000000', '#dbb66d', '#b6924a', '#926d24', '#ffffff', '#6dff24', '#24b624', '#dbdbdb', '#6d6d6d', '#db2424', '#242424', '#ffdb24', '#92dbff');
CS.pretzel = outline(spr(12, 10, g => { g.e(3.5, 4, 3, 3, 2); g.e(8.5, 4, 3, 3, 2); g.e(3.5, 4, 1.4, 1.4, 0); g.e(8.5, 4, 1.4, 1.4, 0); g.line(2, 6, 7, 9, 3); g.line(10, 6, 5, 9, 3); g.p(4, 2, 5); g.p(8, 2, 5); g.p(3, 6, 5); }), 1);
CS.bux = [0, 1, 2, 3].map(f => outline(spr(10, 10, g => { const w = [4, 3, 1, 3][f]; g.e(5, 5, w, 4, 6); g.e(5, 5, Math.max(.5, w - 1), 3, 7); if (w > 2) { g.r(4, 3, 3, 1, 5); g.r(4, 5, 2, 1, 5); g.r(5, 6, 2, 1, 5); g.r(4, 7, 3, 1, 5); g.r(5, 2, 1, 7, 5); } }), 1));
CS.tape = outline(spr(14, 9, g => { g.r(0, 0, 14, 9, 11); g.r(1, 1, 12, 4, 13); g.e(4, 3, 1.5, 1.5, 8); g.e(10, 3, 1.5, 1.5, 8); g.r(2, 6, 10, 2, 9); g.r(3, 1, 8, 1, 5); }), 1);
CS.ticket = outline(spr(16, 10, g => { g.r(0, 0, 16, 10, 5); g.r(1, 1, 14, 8, 8); for (let x = 3; x < 13; x += 2) g.r(x, 4, 1, 3, 11); g.p(0, 5, 0); g.p(15, 5, 0); }), 1);
CS.parcel = outline(spr(14, 12, g => { g.r(0, 2, 14, 10, 2); g.r(0, 2, 14, 2, 3); g.r(6, 2, 2, 10, 4); g.r(2, 6, 4, 3, 5); g.r(1, 0, 12, 2, 2); }), 1);
CS.radio = outline(spr(16, 14, g => { g.r(0, 3, 16, 11, 11); g.r(1, 4, 8, 9, 9); for (let y = 5; y < 12; y += 2) g.r(2, y, 6, 1, 8); g.e(12, 7, 2, 2, 12); g.r(11, 10, 3, 2, 13); g.line(3, 3, 1, 0, 9); }), 1);
CS.sign = outline(spr(16, 16, g => { g.r(7, 8, 2, 8, 2); g.r(1, 1, 14, 8, 3); g.r(2, 2, 12, 6, 2); g.r(3, 3, 8, 1, 4); g.r(3, 5, 6, 1, 4); }), 1);
CS.savebox = [0, 1].map(f => outline(spr(16, 18, g => { g.r(1, 4, 14, 14, 6); g.r(2, 5, 12, 12, 5); g.r(1, 2, 14, 3, 6); g.r(4, 8, 8, 5, 13); g.r(5, 9, 6, 1, 12); g.p(7, 11, 12); g.p(8, 11, 12); if (f) g.r(6, 0, 4, 2, 5); }), 1));

// bong icons: drawn per bong from its material/size (see c2bong.js); base shapes here
function bongShape(size) { // returns sprite with indices: 1 outline, 2 glass, 3 glass shade, 4 water, 5 bowl, 6 shine
  const h = { MINI: 10, REGULAR: 14, BIG: 18, 'FIVE-FOOT': 22, 'THE BIG ONE': 24 }[size] || 14, w = h > 18 ? 12 : 10;
  return outline(spr(w + 4, h + 2, g => {
    const cx = (w + 4) / 2 | 0;
    g.r(cx - 1, 1, 3, h - 6, 2); g.r(cx + 1, 1, 1, h - 6, 3); g.p(cx - 1, 2, 6);
    g.e(cx, h - 3, w / 2, 3.2, 2); g.e(cx + 1, h - 2.5, w / 2 - 1.5, 2, 3); g.r(cx - w / 2 + 1, h - 3, w - 2, 2, 4);
    g.line(cx + 1, h - 6, cx + w / 2 + 1, h - 9, 3); g.r(cx + w / 2, h - 11, 3, 2, 5); g.p(cx - w / 2 + 1, h - 4, 6);
  }), 1);
}

// ---------------- portraits (48x48) ----------------
// Carl, with moods. mood: 'n' normal, 'w' worried, 'a' angry, 's' sincere, 'h' high, 'shades' (HUMAN% >= 40), 'jaw' (>= 70)
CP.carlPort = pal('#000000', '#6db66d', '#249249', '#242424', '#494949', '#6dff24', '#004900', '#ffffff', '#242424', '#dbb624', '#492424', '#002449', '#00496d', '#92db92', '#101010');
function carlPortrait(mood = 'n', P) {
  return portrait(g => {
    g.r(0, 0, 48, 48, 12); g.r(0, 0, 10, 48, 13); g.r(40, 10, 8, 24, 13);
    g.e(24, 51, 21, 12, 9); g.line(16, 40, 20, 47, 10); g.line(32, 40, 28, 47, 10); g.e(24, 45, 3, 2, 10);
    g.r(20, 33, 8, 7, 2); g.r(25, 33, 3, 6, 3);
    g.e(24, 23, 15, 13.5, 2); g.e(33, 25, 6, 10, 3); g.e(24, 31, 10, 6, 2); g.p(13, 18, 14); g.p(14, 17, 14);
    if (mood === 'jaw') { g.r(12, 26, 24, 9, 2); g.r(30, 26, 6, 9, 3); g.r(14, 34, 20, 2, 3); }
    g.e(23, 12, 14, 7, 4); g.r(9, 12, 29, 4, 4); g.r(34, 12, 12, 3, 4); g.r(36, 14, 9, 1, 5); g.e(22, 8, 8, 3, 5); g.p(22, 6, 1);
    const eyes = [[17, 23], [31, 23]];
    if (mood === 'shades' || mood === 'jaw') {
      g.r(9, 19, 30, 8, 15); g.r(9, 19, 30, 1, 4); g.r(22, 21, 4, 2, 4); g.r(11, 20, 5, 1, 8); g.r(27, 20, 4, 1, 8);
    } else {
      for (const [ex, ey] of eyes) {
        g.e(ex, ey, 5.5, 5.5, 8);
        if (mood === 'h') { g.e(ex, ey + 1, 4.5, 3.5, 6); g.r(ex - 5, ey - 5, 11, 4, 2); g.r(ex - 5, ey - 2, 11, 1, 3); g.e(ex + 1, ey + 2, 2, 1.5, 7); }
        else if (mood === 'w') { g.e(ex, ey, 4.5, 4.8, 6); g.e(ex, ey, 1.2, 1.4, 7); g.r(ex - 2, ey - 3, 2, 2, 8); }
        else { g.e(ex, ey, 4.5, 4.8, 6); g.e(ex + 1, ey + 1, 2.2, 2.4, 7); g.r(ex - 2, ey - 3, 2, 2, 8); g.p(ex + 2, ey + 2, 8); }
        if (mood === 'a') { g.line(ex - 6, ey - 7 + (ex < 24 ? 0 : 3), ex + 5, ey - 7 + (ex < 24 ? 3 : 0), 3); g.line(ex - 6, ey - 6 + (ex < 24 ? 0 : 3), ex + 5, ey - 6 + (ex < 24 ? 3 : 0), 3); }
        if (mood === 's') { g.r(ex - 5, ey - 6, 11, 2, 2); }
      }
    }
    g.p(23, 30, 3); g.p(25, 30, 3);
    if (mood === 'a') { g.r(20, 34, 8, 2, 11); g.r(21, 34, 6, 1, 8); }
    else if (mood === 'w') g.e(24, 35, 2, 1.8, 11);
    else if (mood === 'jaw') { g.r(17, 32, 14, 2, 8); g.r(17, 34, 14, 1, 3); }
    else if (mood === 's') g.r(22, 34, 5, 1, 11);
    else g.e(24, 34, 2, 1.2, 11);
  });
}
// HU-MAN: every line he says is a line a writer should have cut
CP.humanPort = pal('#000000', '#dbb692', '#b6926d', '#ffdbb6', '#ffdb49', '#dbb624', '#242424', '#494949', '#ffffff', '#6d2449', '#ffdb24', '#101010', '#db2449', '#ff6d24', '#ffb600');
function humanPortrait(glint) {
  return portrait(g => {
    g.r(0, 0, 48, 48, 9); for (let i = 0; i < 12; i++) g.line(24, 26, 24 + Math.cos(i * .52) * 40, 26 + Math.sin(i * .52) * 40, i & 1 ? 13 : 14);
    g.e(24, 52, 23, 12, 7); g.e(24, 50, 12, 8, 8); g.r(18, 40, 12, 8, 8); g.r(20, 41, 3, 2, 10); g.r(25, 41, 3, 2, 10); g.r(23, 41, 2, 2, 11);
    g.r(17, 33, 14, 8, 2); g.r(26, 33, 5, 8, 3);
    g.e(24, 21, 13, 14, 2); g.r(11, 22, 26, 14, 2); g.r(13, 34, 22, 3, 3); g.r(31, 22, 6, 14, 3); g.r(23, 35, 2, 2, 3);
    g.r(11, 5, 26, 9, 5); g.e(26, 5, 15, 6, 5); g.e(32, 3, 10, 4, 5); g.r(14, 3, 14, 2, 6); g.line(20, 8, 34, 5, 6); g.r(9, 10, 4, 10, 5); g.r(35, 10, 4, 8, 5);
    g.r(11, 18, 26, 6, 12); g.r(11, 18, 26, 1, 7); g.r(22, 20, 4, 2, 7); g.r(13, 19, 6, 1, 8); g.r(28, 19, 5, 1, 8);
    g.r(16, 29, 16, 3, 8); g.r(16, 29, 16, 1, 3); g.r(16, 32, 16, 1, 3);
    if (glint) { g.p(36, 29, 8); g.r(35, 28, 3, 1, 8); g.r(36, 27, 1, 3, 8); }
  });
}
function simplePortrait(bg, fn) { return portrait(g => { g.r(0, 0, 48, 48, 1); fn(g); }); }
CP.hocPort = pal('#1a1a24', '#ffffff', '#dbdbdb', '#b6b6b6', '#101010', '#db2424', '#6dffff', '#242449', '#6d6d6d');
CS.hocPort = simplePortrait(0, g => {
  g.r(0, 0, 48, 48, 8); for (let y = 0; y < 48; y += 8) g.r(0, y, 48, 1, 9);
  g.e(24, 52, 22, 13, 2); g.r(22, 40, 4, 8, 6); g.line(18, 39, 22, 44, 3); g.line(30, 39, 26, 44, 3);
  g.e(24, 22, 15, 16, 2); g.e(30, 24, 8, 14, 3); g.r(11, 16, 26, 10, 5); g.r(13, 18, 8, 1, 7); g.r(12, 25, 24, 1, 4);
  g.r(18, 32, 12, 1, 4); g.p(17, 31, 4); g.p(30, 31, 4);
});
CP.focusPort = pal('#241a10', '#dbc8a0', '#b6a07a', '#927a5a', '#6d5a49', '#ffffff', '#b6b6b6');
CS.focusPort = portrait(g => { g.r(0, 0, 48, 48, 4); for (const [x, y, s] of [[8, 14, 7], [40, 14, 7], [24, 20, 11]]) { g.e(x, y + s + 12, s + 3, s + 2, 3); g.e(x, y, s, s + 1, 2); g.e(x + s / 3, y + 1, s / 2, s, 3); } g.r(14, 38, 20, 10, 6); g.r(15, 39, 18, 8, 5); for (let y = 41; y < 47; y += 2) g.r(17, y, 14, 1, 6); });
CP.legalPort = pal('#10101a', '#ffffff', '#dbdbdb', '#b6b6b6', '#242424', '#db2424', '#6d4924');
CS.legalPort = portrait(g => { g.r(0, 0, 48, 48, 1); for (let i = 0; i < 12; i++) { const y = 44 - i * 3, x = 10 + ((i * 5) % 4); g.r(x, y, 28, 3, i & 1 ? 2 : 3); g.r(x, y + 2, 28, 1, 4); } g.r(12, 12, 10, 5, 5); g.r(26, 12, 10, 5, 5); g.r(22, 13, 4, 1, 5); g.r(14, 13, 3, 2, 2); g.r(28, 13, 3, 2, 2); g.r(30, 26, 12, 8, 6); g.r(32, 28, 8, 2, 2); g.r(33, 22, 6, 4, 7); });
CP.sharkPort = pal('#0a1a2a', '#6d92b6', '#49708f', '#dbdbff', '#ffffff', '#101010', '#db6d6d', '#246d92', '#92b6db');
CS.sharkPort = portrait(g => { g.r(0, 0, 48, 48, 1); for (let y = 30; y < 48; y += 4) g.r(0, y, 48, 2, 8); g.e(26, 30, 26, 18, 2); g.e(26, 38, 22, 9, 4); g.line(10, 12, 20, 0, 2); g.r(12, 4, 8, 10, 2); g.e(34, 22, 3.5, 3, 6); g.r(30, 19, 8, 2, 2); g.r(8, 34, 36, 5, 7); for (let x = 9; x < 43; x += 3) { g.p(x, 34, 5); g.p(x + 1, 38, 5); } for (let x = 16; x < 22; x += 2) g.line(x, 22, x, 28, 3); });
CP.dispatchPort = pal('#101018', '#6d6d6d', '#494949', '#242424', '#dbdbdb', '#6dff24', '#db2424', '#ffdb24');
CS.dispatchPort = portrait(g => { g.r(0, 0, 48, 48, 3); g.r(4, 10, 40, 30, 2); g.r(5, 11, 38, 28, 1); g.r(7, 14, 20, 22, 3); for (let y = 16; y < 34; y += 3) g.r(9, y, 16, 1, 2); g.e(35, 20, 5, 5, 3); g.e(35, 20, 2, 2, 5); g.r(30, 30, 10, 4, 6); g.r(31, 31, 8, 2, 7); g.line(10, 10, 4, 1, 4); g.r(3, 0, 3, 2, 5); });
CP.copPort = pal('#1a2440', '#dbb692', '#b6926d', '#4970b6', '#24498f', '#24248f', '#ffdb24', '#492424', '#101010', '#ffffff');
CS.copPort = portrait(g => { g.r(0, 0, 48, 48, 1 + 0); g.e(24, 52, 22, 12, 4); g.r(18, 40, 12, 8, 3); g.r(20, 42, 3, 3, 7); g.e(24, 24, 13, 14, 2); g.r(30, 14, 7, 20, 3); g.e(24, 10, 15, 6, 6); g.r(9, 12, 30, 4, 6); g.r(21, 7, 6, 4, 7); g.r(16, 21, 4, 2, 9); g.r(28, 21, 4, 2, 9); g.r(17, 21, 2, 2, 10); g.r(29, 21, 2, 2, 10); g.r(15, 29, 18, 3, 8); g.r(17, 32, 14, 1, 8); });
CP.roboPort = CP.copPort.slice(); CP.roboPort[2] = hex('#b6b6db'); CP.roboPort[3] = hex('#6d6d92');
CS.roboPort = portrait(g => { g.r(0, 0, 48, 48, 1); g.e(24, 52, 22, 12, 4); g.e(24, 24, 13, 14, 2); g.r(11, 12, 13, 22, 3); g.e(17, 22, 4, 4, 8); g.e(17, 22, 2, 2, 7); g.r(28, 21, 4, 2, 9); g.e(24, 10, 15, 6, 6); g.r(9, 12, 30, 4, 6); g.r(15, 29, 18, 3, 8); for (let x = 12; x < 24; x += 3) g.p(x, 32, 7); });
CP.waitPort = pal('#241a2a', '#ffdbb6', '#dbb692', '#ff92b6', '#db6d92', '#92dbff', '#ffffff', '#242424', '#db2449', '#ffdb24');
CS.waitPort = portrait(g => { g.r(0, 0, 48, 48, 1); for (let x = 0; x < 48; x += 8) g.r(x, 0, 4, 48, 6 + 0); g.r(0, 0, 48, 48, 1); g.e(24, 52, 21, 12, 5); g.r(16, 42, 16, 6, 6); g.r(20, 33, 8, 8, 2); g.e(24, 24, 12, 14, 2); g.e(24, 14, 15, 9, 3); g.r(9, 14, 6, 22, 3); g.r(33, 14, 6, 22, 3); g.r(13, 16, 22, 3, 4); g.r(17, 22, 4, 2, 7); g.r(28, 22, 4, 2, 7); g.r(21, 31, 6, 2, 8); g.r(32, 40, 8, 4, 9); g.r(33, 41, 6, 2, 6); });
CP.comradePort = CP.carlPort.slice(); CP.comradePort[3] = hex('#6d4924'); CP.comradePort[4] = hex('#926d49'); CP.comradePort[8] = hex('#b62424'); CP.comradePort[9] = hex('#ffdb24'); CP.comradePort[12] = hex('#6d0000'); CP.comradePort[13] = hex('#920000');
CP.hitchPort = pal('#241a10', '#dbb692', '#b6926d', '#6d4924', '#492410', '#b64924', '#ffffff', '#101010');
CS.hitchPort = portrait(g => { g.r(0, 0, 48, 48, 1); g.e(24, 52, 22, 12, 5); g.e(24, 22, 13, 15, 2); g.e(24, 9, 15, 7, 3); g.r(9, 9, 6, 26, 3); g.r(33, 9, 6, 26, 3); g.e(24, 31, 12, 9, 3); g.r(18, 20, 3, 2, 7); g.r(28, 20, 3, 2, 7); g.r(20, 31, 8, 2, 4); });
CP.clerkPort = pal('#101018', '#f0c8a0', '#c89878', '#6d6d6d', '#dbb649', '#926d24', '#ffffff', '#492424', '#242449', '#49496d', '#6dff24');
CS.bongClerkPort = portrait(g => { g.r(0, 0, 48, 48, 9); for (let x = 2; x < 48; x += 9) { g.r(x, 6, 3, 14, 11); g.e(x + 1.5, 20, 3, 2, 11); } g.e(24, 52, 20, 11, 10); g.r(20, 36, 8, 6, 2); g.e(24, 25, 12, 15, 2); g.e(24, 12, 14, 7, 5); g.r(10, 12, 5, 26, 5); g.r(33, 12, 5, 26, 5); g.e(24, 33, 10, 8, 5); g.r(16, 21, 6, 3, 8); g.r(26, 21, 6, 3, 8); g.r(17, 22, 2, 1, 7); g.r(27, 22, 2, 1, 7); g.r(21, 32, 6, 1, 8); });
CS.lostPort = portrait(g => { g.r(0, 0, 48, 48, 9); for (let y = 4; y < 48; y += 12) g.r(0, y, 48, 2, 3); g.e(24, 52, 20, 11, 8); g.e(24, 25, 12, 15, 2); g.r(31, 16, 4, 16, 3); g.e(24, 11, 13, 6, 4); g.r(15, 20, 7, 4, 7); g.r(26, 20, 7, 4, 7); g.r(16, 21, 5, 2, 6); g.r(27, 21, 5, 2, 6); g.r(22, 22, 4, 1, 7); g.r(21, 32, 6, 1, 7); });

function registerPorts() {
  const at = (s, P) => ({ s, P });
  CS.carlPorts = {}; for (const m of ['n', 'w', 'a', 's', 'h', 'shades', 'jaw']) CS.carlPorts[m] = carlPortrait(m);
  Object.assign(PORT, {
    CARL: at(CS.carlPorts.n, CP.carlPort), 'HU-MAN': at(humanPortrait(1), CP.humanPort), 'HEAD OF CONTENT': at(CS.hocPort, CP.hocPort),
    'FOCUS GROUP': at(CS.focusPort, CP.focusPort), LEGAL: at(CS.legalPort, CP.legalPort), BRUCE: at(CS.sharkPort, CP.sharkPort),
    DISPATCH: at(CS.dispatchPort, CP.dispatchPort), 'MALL COP': at(CS.copPort, CP.copPort), 'ROBO MALL COP': at(CS.roboPort, CP.roboPort),
    WAITRESS: at(CS.waitPort, CP.waitPort), 'LINDA LITE': at(CS.waitPort, CP.waitPort), 'COMRADE CARL': at(carlPortrait('a'), CP.comradePort),
    HITCHHIKER: at(CS.hitchPort, CP.hitchPort), 'BONG CLERK': at(CS.bongClerkPort, CP.clerkPort), 'LOST+FOUND': at(CS.lostPort, CP.clerkPort),
  });
  PORT['NEW FACE'] = PORT.FACE; PORT.FACELESS = at(CS.focusPort, CP.focusPort); VOICE['NEW FACE'] = VOICE.FACE; VOICE.FACELESS = [520, 200];
  Object.assign(VOICE, { 'HU-MAN': [300, 10], 'HEAD OF CONTENT': [640, 0], 'FOCUS GROUP': [520, 200], LEGAL: [420, 0], BRUCE: [210, 30], DISPATCH: [520, 20],
    'MALL COP': [400, 40], 'ROBO MALL COP': [330, 0], WAITRESS: [900, 40], 'LINDA LITE': [900, 40], 'COMRADE CARL': [860, 160], HITCHHIKER: [360, 50],
    'BONG CLERK': [560, 80], 'LOST+FOUND': [760, 60], ANNOUNCER: [440, 20], 'STUDIO AUDIENCE': [700, 400], VOICE: [1250, 600], 'USER_000': [1500, 0] });
}
registerPorts();
// the mood Carl's portrait shows right now (HUMAN% leaks into his face)
function carlMood(m) { const h = (typeof C2 !== 'undefined' && C2.human) || 0; if (h >= 70) return CS.carlPorts.jaw; if (h >= 40) return CS.carlPorts.shades; return CS.carlPorts[m] || CS.carlPorts.n; }

// ---------------- set dressing ----------------
// the A.S.S. (Alien Starship), parked. top-down-ish saucer with a green dome
CP.ass = pal('#000000', '#b6b6c8', '#8f8fa0', '#6d6d80', '#6dffb6', '#24db92', '#ffffff', '#dbb624', '#db2449', '#49496d', '#242424');
CS.ass = [0, 1].map(f => outline(spr(72, 44, g => {
  g.e(36, 32, 34, 9, 3); g.e(36, 29, 34, 9, 2); g.e(36, 27, 30, 6, 1 + 1); g.r(4, 27, 64, 3, 2);
  for (let i = 0; i < 8; i++) g.e(10 + i * 7.4, 31, 1.6, 1.4, (i + f) & 1 ? 8 : 7);
  g.e(36, 18, 16, 12, 5); g.e(36, 16, 14, 10, 4); g.e(31, 12, 5, 3, 6);
  g.r(22, 25, 28, 3, 9); g.r(24, 26, 24, 1, 7); g.r(30, 38, 12, 5, 10); g.r(31, 39, 10, 3, 3);
  g.line(8, 40, 4, 43, 10); g.line(64, 40, 68, 43, 10);
}), 1));
CP.board = pal('#000000', '#242424', '#ffdb24', '#ff6d24', '#ffffff', '#dbb692', '#6dffff', '#db2449');
CS.busstop = outline(spr(16, 30, g => { g.r(7, 8, 2, 22, 1); g.r(2, 0, 12, 9, 3); g.r(3, 1, 10, 7, 2); g.r(4, 3, 8, 1, 1); g.r(4, 5, 5, 1, 1); g.r(3, 26, 10, 3, 1); }), 1);
