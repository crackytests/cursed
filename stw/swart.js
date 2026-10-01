'use strict';
// ================= SAVE THE WORLD: party sprites (16x24 chibi, field + battle poses), NPC builder, portraits =================
// Everything lives on ART so it stays out of the shared global scope.
const ART = { hero: {}, npc: {}, P: {} };
(() => {
  // palette slots for every chibi: 1 outline 2 skin 3 skin shade 4 hair 5 hair shade 6 top 7 top shade 8 bottom 9 shoe 10 eye 11 white 12 acc 13 acc2 14 x1 15 x2
  const mkP = o => pal(o.out || '#101018', o.skin || '#ffdbb6', o.skin2 || '#db9292', o.hair || '#6d4924', o.hair2 || '#492424', o.top || '#6d6db6', o.top2 || '#49496d',
    o.bot || '#24246d', o.shoe || '#242424', o.eye || '#241010', '#ffffff', o.acc || '#ffdb24', o.acc2 || '#db2424', o.x1 || '#92dbff', o.x2 || '#2449b6');

  // ---- hair styles (front / side / back), drawn over the head ----
  const HAIR = {
    bob: { d: g => { g.e(8, 4.5, 6.8, 4.5, 4); g.r(1, 4, 3, 8, 4); g.r(12, 4, 3, 8, 4); g.r(2, 10, 2, 3, 5); g.r(12, 10, 2, 3, 5); g.r(5, 2, 4, 1, 5); },
      l: g => { g.e(8, 4.5, 6.6, 4.4, 4); g.r(8, 4, 6, 9, 4); g.r(11, 10, 3, 3, 5); g.r(3, 4, 2, 2, 4); },
      u: g => { g.e(8, 6, 6.8, 6, 4); g.r(1, 6, 14, 7, 4); g.r(2, 11, 12, 2, 5); } },
    long: { d: g => { g.e(8, 4.5, 6.8, 4.5, 4); g.r(1, 4, 3, 12, 4); g.r(12, 4, 3, 12, 4); g.r(1, 13, 3, 3, 5); g.r(12, 13, 3, 3, 5); },
      l: g => { g.e(8, 4.5, 6.6, 4.4, 4); g.r(8, 4, 6, 12, 4); g.r(10, 13, 4, 3, 5); },
      u: g => { g.e(8, 6, 6.8, 6, 4); g.r(1, 6, 14, 10, 4); g.r(2, 13, 12, 3, 5); } },
    spiky: { d: g => { g.e(8, 4, 7, 4.2, 4); for (const [x, y] of [[0, 3], [2, 0], [6, -1], [10, 0], [14, 2], [15, 6], [0, 7]]) g.line(8, 4, x, y, 4); g.r(2, 4, 2, 4, 4); g.r(12, 4, 2, 4, 4); g.p(7, 1, 5); },
      l: g => { g.e(8.5, 4, 6.6, 4.2, 4); for (const [x, y] of [[15, 2], [16, 6], [15, 10], [10, -1], [4, 0]]) g.line(9, 5, x, y, 4); g.r(9, 4, 5, 6, 4); },
      u: g => { g.e(8, 5.5, 7, 6, 4); for (const [x, y] of [[0, 3], [2, 0], [6, -1], [10, 0], [14, 2], [16, 7], [0, 8], [3, 12], [13, 12]]) g.line(8, 6, x, y, 4); } },
    short: { d: g => { g.e(8, 3.8, 6.6, 3.8, 4); g.r(2, 3, 2, 4, 4); g.r(12, 3, 2, 4, 4); },
      l: g => { g.e(8.5, 3.8, 6.4, 3.8, 4); g.r(9, 3, 5, 6, 4); },
      u: g => { g.e(8, 5.5, 6.6, 5.5, 4); g.r(2, 6, 12, 4, 4); } },
    pony: { d: g => { g.e(8, 4, 6.8, 4.2, 4); g.r(1, 4, 2, 7, 4); g.r(13, 4, 2, 7, 4); g.e(13, 1.5, 3.5, 2.5, 4); g.e(14, 2, 2, 1.5, 5); },
      l: g => { g.e(8, 4, 6.6, 4.2, 4); g.r(9, 4, 5, 5, 4); g.e(14, 3, 3, 3, 4); g.r(13, 5, 3, 9, 4); g.r(14, 11, 2, 4, 5); },
      u: g => { g.e(8, 5.5, 6.8, 5.5, 4); g.r(6, 7, 4, 10, 4); g.r(7, 13, 2, 4, 5); g.e(8, 3, 3, 2, 5); } },
    none: { d: () => {}, l: () => {}, u: () => {} },
  };

  // ---- the humanoid chibi. o: { hair, P overrides, extra(g, dir, pose) } ----
  // poses: stand step1 step2 | battle: ready atk cast hurt low win
  function chibi(o, dir, pose) {
    return outline(spr(16, 24, g => {
      const walk = pose === 'step1' ? 1 : pose === 'step2' ? -1 : 0;
      const kneel = pose === 'low', by = kneel ? 3 : 0;
      // legs
      if (dir === 'l') {
        if (kneel) { g.r(4, 20, 7, 3, 8); g.r(3, 22, 4, 2, 9); g.r(9, 21, 3, 3, 8); }
        else { g.r(6 - walk, 19, 3, 4, 8); g.r(8 + walk, 19, 3, 4, 8); g.r(5 - walk, 22, 4, 2, 9); g.r(7 + walk, 22, 4, 2, 9); }
      } else {
        const a = dir === 'u' ? -walk : walk;
        g.r(5, 19, 3, 4 - Math.max(0, a), 8); g.r(9, 19, 3, 4 - Math.max(0, -a), 8);
        g.r(5, 22 - Math.max(0, a), 3, 2, 9); g.r(9, 22 - Math.max(0, -a), 3, 2, 9);
      }
      // torso
      if (dir === 'l') { g.r(5, 12 + by, 7, 8 - by, 6); g.r(9, 12 + by, 3, 8 - by, 7); }
      else { g.r(4, 12 + by, 9, 8 - by, 6); g.r(10, 12 + by, 3, 8 - by, 7); g.r(4, 18, 9, 1, 7); }
      if (o.body) o.body(g, dir, pose, by);
      // arms
      const arm = (x, y, len, c) => { g.r(x, y, 2, len, c); g.p(x, y + len, 2); g.p(x + 1, y + len, 2); };
      if (pose === 'cast' || pose === 'win') { g.r(dir === 'l' ? 3 : 2, 6 + by, 2, 7, 6); g.r(12, 6 + by, 2, 7, 6); g.r(dir === 'l' ? 3 : 2, 5, 2, 2, 2); g.r(12, 5, 2, 2, 2); }
      else if (pose === 'atk' && dir === 'l') { g.r(0, 14, 5, 2, 6); g.r(0, 14, 1, 2, 2); }
      else if (dir === 'l') arm(7 + walk, 13 + by, 4, 7);
      else { arm(2, 13 + by, 4 + (dir === 'd' ? walk : 0), 6); arm(13, 13 + by, 4 - (dir === 'd' ? walk : 0), 7); }
      // head (big; a slight bob on steps)
      const hy = by + (pose === 'hurt' ? 1 : 0), hx = pose === 'hurt' ? 1 : 0;
      const head = spr(16, 14, h => {
        h.e(8, 7, 6.6, 6.2, 2); h.each((x, y) => h.get(x, y) === 2 && (dir === 'l' ? x > 11 : x > 12 || y > 11) ? 3 : 0);
        if (dir === 'd') {
          const shut = pose === 'hurt' || pose === 'ko';
          if (shut) { h.r(4, 8, 2, 1, 10); h.r(10, 8, 2, 1, 10); }
          else { h.r(4, 7, 2, 3, 10); h.r(10, 7, 2, 3, 10); h.p(4, 7, 11); h.p(10, 7, 11); }
          h.p(7, 11, 3); h.p(8, 11, 3);
        } else if (dir === 'l') {
          if (pose === 'hurt') h.r(3, 8, 2, 1, 10); else { h.r(3, 7, 2, 3, 10); h.p(3, 7, 11); }
          h.p(1, 9, 3); h.p(3, 11, 3);
        }
        HAIR[o.hair || 'short'][dir](h);
        if (o.head) o.head(h, dir, pose);
      });
      for (let y = 0; y < 14; y++) for (let x = 0; x < 16; x++) { const c = head.d[y * 16 + x]; if (c) g.p(x + hx, y + hy, c); }
      if (o.extra) o.extra(g, dir, pose);
    }), 1);
  }

  // ---- every hero gets the same pose set ----
  const POSES = ['stand', 'step1', 'step2'];
  function build(id, o, maker) {
    const mk = maker || ((d, p) => chibi(o, d, p)), P = o.P;
    const h = { P, d: POSES.map(p => mk('d', p)), u: POSES.map(p => mk('u', p)), l: POSES.map(p => mk('l', p)) };
    h.ready = h.l[0]; h.walkB = [h.l[1], h.l[2]];
    for (const p of ['atk', 'cast', 'hurt', 'low']) h[p] = mk('l', p);
    h.win = mk('d', 'win');
    h.ko = rot90(mk('l', 'hurt'));
    ART.hero[id] = h; ART.P[id] = P;
  }
  // knocked out: the sprite lying on its back (rotated a quarter turn)
  function rot90(s) { return spr(s.h, s.w, g => { for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w; x++) { const c = s.d[y * s.w + x]; if (c) g.p(s.h - 1 - y, x, c); } }); }
  ART.rot90 = rot90;

  // ---------------- YOKO: brown shoulder hair, lavender ribbed top, little gold pendant, white pants; the ASSISTANT CROWN when controlled ----------------
  const yokoO = { hair: 'bob', P: mkP({ skin: '#ffdbb6', skin2: '#db9292', hair: '#b66d49', hair2: '#6d4924', top: '#9292db', top2: '#6d6db6', bot: '#dbdbdb', shoe: '#6d4924', acc: '#ffdb49', acc2: '#24dbff' }),
    body: (g, d, p, by) => { if (d !== 'u') { for (let x = 5; x < 12; x += 2) g.r(x, 13 + by, 1, 5 - by, 7); if (d === 'd') g.p(8, 13 + by, 12); } g.r(d === 'l' ? 5 : 4, 18, d === 'l' ? 7 : 9, 1, 11); } };
  build('yoko', yokoO);
  // the crowned version (prologue): a white headset with a cyan light
  build('yokoCrown', Object.assign({}, yokoO, { head: (h, d) => { if (d === 'u') { h.r(2, 2, 12, 1, 11); return; } h.r(1, 3, 14, 1, 11); h.r(d === 'l' ? 12 : 0, 5, 3, 4, 11); h.p(d === 'l' ? 13 : 1, 6, 13); } }));

  // ---------------- CARL: green alien skin, huge green eyes, backwards black cap, navy hoodie, gold bow tie ----------------
  const carlP = mkP({ skin: '#6db66d', skin2: '#249249', hair: '#242424', hair2: '#494949', top: '#242449', top2: '#101024', bot: '#242449', shoe: '#101010', eye: '#004900', acc: '#dbb624', acc2: '#6dff24' });
  build('carl', { P: carlP, hair: 'none',
    head: (h, d, p) => {
      // backwards cap: crown dome + the bill sticking out the back
      if (d === 'd') { h.e(8, 3.6, 6.4, 3.2, 4); h.r(5, 0, 6, 1, 5); h.r(6, 1, 4, 1, 5); }
      else if (d === 'l') { h.e(8, 3.6, 6.4, 3.2, 4); h.r(11, 4, 5, 2, 4); h.r(13, 5, 3, 1, 5); }
      else { h.e(8, 3.6, 6.6, 3.4, 4); h.r(5, 6, 6, 2, 4); h.r(6, 7, 4, 1, 5); }
      if (d === 'd' && p !== 'hurt') { h.e(5, 8, 2.2, 2.6, 15 - 1); h.e(11, 8, 2.2, 2.6, 14); h.r(4, 7, 2, 3, 10); h.r(10, 7, 2, 3, 10); h.p(4, 7, 11); h.p(10, 7, 11); }
      if (d === 'l' && p !== 'hurt') { h.e(3.5, 8, 2.2, 2.6, 14); h.r(2, 7, 2, 3, 10); h.p(2, 7, 11); }
    },
    body: (g, d, p, by) => { if (d === 'd') { g.r(7, 12 + by, 3, 1, 12); g.p(8, 13 + by, 12); g.r(8, 14 + by, 1, 4, 7); } if (d === 'l') g.p(5, 12 + by, 12); } });
  // Carl's eyes are colour 14 (bright green), his pupils 10: override the shared defaults
  ART.hero.carl.P[14] = hex('#92ff49'); ART.hero.carl.P[10] = hex('#003600');

  // ---------------- CEO LINDA: pink hair in a high ponytail, black suit with pink pinstripes, pink tie ----------------
  build('linda', { hair: 'pony', P: mkP({ skin: '#ffdbdb', skin2: '#db9292', hair: '#ff6db6', hair2: '#b62492', top: '#242424', top2: '#101010', bot: '#242424', shoe: '#b62492', eye: '#6d2449', acc: '#ff6db6', acc2: '#ff92db' }),
    body: (g, d, p, by) => { if (d === 'u') return; for (let x = d === 'l' ? 6 : 5; x < (d === 'l' ? 12 : 13); x += 2) g.r(x, 13 + by, 1, 6 - by, 12); if (d === 'd') { g.r(7, 12 + by, 3, 2, 13); g.r(8, 14 + by, 1, 3, 13); } } });

  // ---------------- PILOT X: black wild hair, red headband, glowing yellow ring goggles, 天 on the nose, pale teal coat ----------------
  build('pilotx', { hair: 'spiky', P: mkP({ skin: '#b66d49', skin2: '#924924', hair: '#101010', hair2: '#242424', top: '#92dbb6', top2: '#49926d', bot: '#242449', shoe: '#101010', eye: '#dbff24', acc: '#db2424', acc2: '#dbff24', x1: '#492449' }),
    head: (h, d) => { if (d === 'u') { h.r(1, 5, 14, 1, 12); return; } h.r(1, 4, 14, 1, 12); if (d === 'd') { h.e(5, 8, 2.4, 1.6, 13); h.e(11, 8, 2.4, 1.6, 13); h.p(5, 8, 1); h.p(11, 8, 1); h.p(8, 10, 11); } else { h.e(3.5, 8, 2.4, 1.6, 13); h.p(3, 8, 1); } },
    body: (g, d, p, by) => { if (d === 'u') return; g.r(d === 'l' ? 7 : 7, 12 + by, 3, 7 - by, 14); } });

  // ---------------- JB GARFIELD: orange cat head under a gray fedora, white muzzle, tan trench coat ----------------
  build('garfield', { hair: 'none', P: mkP({ skin: '#ff9224', skin2: '#db6d00', hair: '#b6b6b6', hair2: '#6d6d6d', top: '#dbb692', top2: '#926d49', bot: '#926d49', shoe: '#242424', eye: '#101010', acc: '#242424', acc2: '#ffffdb', x1: '#ffffdb' }),
    head: (h, d, p) => {
      if (d !== 'u') { h.e(d === 'l' ? 5 : 8, 10, d === 'l' ? 3.5 : 4.5, 2.6, 13); h.p(d === 'l' ? 3 : 8, 9, 10); h.r(d === 'l' ? 1 : 3, 7, d === 'l' ? 5 : 10, 1, 1); if (p !== 'hurt') { h.r(d === 'l' ? 2 : 4, 6, 2, 1, 14); if (d === 'd') h.r(10, 6, 2, 1, 14); } }
      h.r(0, 3, 16, 2, 4); h.r(3, 0, 10, 3, 4); h.r(3, 2, 10, 1, 12); h.r(0, 4, 16, 1, 5);
    },
    body: (g, d, p, by) => { if (d === 'd') { g.r(7, 12 + by, 3, 6 - by, 13); g.p(8, 13 + by, 12); g.r(4, 17, 9, 1, 7); } if (d === 'l') g.r(5, 17, 7, 1, 7); } });

  // ---------------- PEE KID: brown hair, sailor collar with neckerchief, blue shorts, satchel ----------------
  const kidO = { hair: 'short', P: mkP({ skin: '#f6d6c0', skin2: '#d8a890', hair: '#5c443c', hair2: '#2a1c1a', top: '#f2f2f2', top2: '#b8c0cc', bot: '#48608c', shoe: '#6c4424', acc: '#e8c060', acc2: '#7090c0' }),
    body: (g, d, p, by) => { if (d === 'd') { g.r(4, 12 + by, 9, 2, 13); g.r(7, 13 + by, 3, 2, 12); } if (d === 'l') { g.r(5, 12 + by, 7, 2, 13); g.r(10, 14 + by, 2, 3, 12); } g.r(d === 'l' ? 5 : 4, 18, d === 'l' ? 7 : 9, 1, 8); } };
  build('kid', kidO);
  // Pee-Wee Kid (white shirt, red bow tie, gray pants) and Pee Boy (dark suit, red tie, taller hair)
  build('wee', { hair: 'short', P: mkP({ skin: '#f4dccc', skin2: '#d0aa98', hair: '#242424', hair2: '#494949', top: '#ffffdc', top2: '#dcdcb6', bot: '#7c8894', shoe: '#242424', acc: '#e02828', acc2: '#9c1414' }),
    body: (g, d, p, by) => { if (d === 'd') { g.r(6, 12 + by, 5, 2, 12); g.p(8, 12 + by, 13); } if (d === 'l') g.r(5, 12 + by, 2, 2, 12); } });
  build('boy', { hair: 'short', P: mkP({ skin: '#f8e2d0', skin2: '#d4b09c', hair: '#121218', hair2: '#3a3a48', top: '#1a1a22', top2: '#101014', bot: '#1a1a22', shoe: '#101014', acc: '#d82020', acc2: '#f4f4f8' }),
    body: (g, d, p, by) => { if (d === 'd') { g.r(6, 12 + by, 5, 6 - by, 13); g.r(8, 12 + by, 1, 5 - by, 12); } if (d === 'l') g.r(5, 12 + by, 2, 5 - by, 13); },
    head: (h, d) => { if (d !== 'u') h.r(d === 'l' ? 8 : 3, 0, d === 'l' ? 5 : 10, 2, 4); } });

  // ---------------- HU-MAN (secret): square jaw, blond flat-top, blue shirt. Generic on purpose ----------------
  build('human', { hair: 'short', P: mkP({ skin: '#dbb692', skin2: '#b6926d', hair: '#ffdb49', hair2: '#dbb624', top: '#24496d', top2: '#24245a', bot: '#242424', shoe: '#101010', eye: '#242424', acc: '#ffffff' }),
    head: (h, d) => { if (d === 'u') return; h.r(d === 'l' ? 1 : 3, 11, d === 'l' ? 8 : 10, 2, 3); h.r(d === 'l' ? 3 : 2, 0, d === 'l' ? 10 : 12, 2, 4); } });

  // ---------------- SPOOKY GHOST: a white sheet with a wavy hem, black oval eyes, a fanged grin; he floats ----------------
  const ghostP = mkP({ out: '#240049', skin: '#ffffff', skin2: '#b6b6ff', hair: '#dbdbff', hair2: '#9292db', top: '#ffffff', top2: '#dbdbff', eye: '#101010', acc: '#db2424', acc2: '#b649ff', x1: '#49dbff' });
  function ghostSpr(dir, pose) {
    return outline(spr(16, 24, g => {
      const bob = pose === 'step1' ? -1 : pose === 'step2' ? 1 : 0, y0 = 2 + bob + (pose === 'low' ? 3 : 0);
      g.e(8, y0 + 7, 6.5, 7, 2); g.r(1.5, y0 + 7, 13, 9, 2);
      for (let x = 2; x < 15; x++) { const w = Math.sin(x * 1.3 + (pose === 'step1' ? 1 : 0) + frameSeed(pose)) > 0 ? 1 : 0; g.r(x, y0 + 16, 1, 2 + w, 2); }
      g.each((x, y) => g.get(x, y) === 2 && x > 10 ? 3 : 0);
      if (pose === 'cast' || pose === 'win' || pose === 'atk') { g.line(1, y0 + 8, -1, y0 + 2, 2); g.line(2, y0 + 8, 0, y0 + 3, 2); g.line(14, y0 + 8, 16, y0 + 2, 2); }
      else { g.r(0, y0 + 9, 2, 4, 3); g.r(14, y0 + 9, 2, 4, 3); }
      if (dir === 'u') return;
      const sh = pose === 'hurt', ex = dir === 'l' ? -2 : 0;
      if (sh) { g.r(5 + ex, y0 + 6, 2, 1, 10); g.r(9 + ex, y0 + 6, 2, 1, 10); }
      else { g.e(5.5 + ex, y0 + 6, 1.4, 2, 10); g.e(10.5 + ex, y0 + 6, 1.4, 2, 10); }
      g.e(8 + ex, y0 + 10.5, 3, 1.6, 10); g.r(5 + ex, y0 + 9, 7, 1, 2); g.p(6 + ex, y0 + 10, 11); g.p(10 + ex, y0 + 10, 11);
    }), 1);
  }
  const frameSeed = p => ({ step1: 1, step2: 2 })[p] || 0;
  build('ghost', { P: ghostP }, ghostSpr);

  // ---------------- FACE (the king): a floating black cowl-head with magenta edges, green third eye, a little gold crown ----------------
  const faceP = mkP({ out: '#000000', skin: '#24246d', skin2: '#000024', hair: '#ff24db', hair2: '#920092', top: '#490092', top2: '#240049', eye: '#6dff24', acc: '#ffdb24', acc2: '#24dbff', x1: '#ff49ff' });
  function headSpr(o) {
    return (dir, pose) => outline(spr(16, 24, g => {
      const bob = pose === 'step1' ? -1 : pose === 'step2' ? 1 : 0, y0 = 3 + bob + (pose === 'low' ? 4 : 0) + (pose === 'hurt' ? 1 : 0);
      g.e(8, y0 + 8, 7, 7.5, 2); g.each((x, y) => { if (g.get(x, y) !== 2) return 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (g.get(x + dx, y + dy) !== 2 && g.get(x + dx, y + dy) !== 4) return 4; return 0; });
      if (o.crown) { g.r(4, y0 - 1, 8, 2, 12); g.p(4, y0 - 2, 12); g.p(8, y0 - 3, 12); g.p(11, y0 - 2, 12); g.p(8, y0 - 1, 13); }
      if (dir !== 'u') {
        const ex = dir === 'l' ? -2 : 0, shut = pose === 'hurt';
        for (const x of [5, 11]) { if (dir === 'l' && x === 11) continue; g.e(x + ex, y0 + 8, 2.4, shut ? 1 : 1.8, 4); if (!shut) g.r(x + ex - 1, y0 + 8, 3, 1, 10); }
        if (o.third) { g.e(8 + ex, y0 + 4, 1.4, 1.4, 10); }
        g.r(6 + ex, y0 + 12, 4, 1, o.mouth || 4);
        if (o.nose) g.p(8 + ex, y0 + 10, o.nose);
      }
      if (o.hands) { const up = pose === 'cast' || pose === 'win' || pose === 'atk'; for (const hx of [0, 13]) { g.r(hx, y0 + (up ? 6 : 14), 3, 4, 14); g.p(hx + 1, y0 + (up ? 5 : 18), 14); } if (pose === 'atk') { g.p(0, y0 + 5, 12); g.p(1, y0 + 4, 12); } }
      if (o.cape && dir !== 'u') { g.r(3, y0 + 15, 10, 5, 6); g.r(4, y0 + 15, 8, 1, 7); }
    }), 1);
  }
  build('face', { P: faceP }, headSpr({ crown: 1, third: 1, nose: 15, cape: 1 }));
  // OLD FACE: the four-shade green one, with welding hands. (He never got colour, even here.)
  const oldP = legacyPal(mkP({ out: '#000000', skin: '#002424', skin2: '#000000', hair: '#49ff92', hair2: '#24926d', eye: '#49ff92', x1: '#6dff24', acc: '#ffffff', mouth: '#ff24db' }), 'dmg');
  build('oldface', { P: oldP }, headSpr({ third: 0, hands: 1, mouth: 4 }));

  // ---------------- LICENSED ARMOR: the Franchise walking machine (the opening march). A cockpit on two legs ----------------
  function mechSpr(dir, pose) {
    return outline(spr(16, 24, g => {
      const st = pose === 'step1' ? 1 : pose === 'step2' ? -1 : 0, kneel = pose === 'low' ? 2 : 0;
      // legs: big feet, reversed knees
      for (const [lx, ph] of [[3, st], [10, -st]]) { g.r(lx, 15 + kneel, 3, 6 - Math.max(0, ph), 7); g.r(lx - 1, 21 - Math.max(0, ph), 5, 3, 8); g.p(lx + 1, 17 + kneel, 12); }
      // body + cockpit
      g.r(2, 7 + kneel, 12, 9, 6); g.r(2, 7 + kneel, 12, 2, 13); g.r(3, 14 + kneel, 10, 2, 7);
      if (dir !== 'u') { g.e(dir === 'l' ? 6 : 8, 9 + kneel, 4, 3, 14); g.e(dir === 'l' ? 6 : 8, 8 + kneel, 2.4, 1.4, 11); }
      // the pilot's head peeks out of the hatch
      g.e(8, 4 + kneel, 3.5, 3.5, 2); g.e(8, 3 + kneel, 3.6, 2.2, 4);
      // cannon
      if (pose === 'atk' || pose === 'cast') { g.r(0, 10 + kneel, 4, 2, 15); g.p(0, 9 + kneel, 12); } else if (dir === 'l') g.r(0, 11 + kneel, 3, 2, 15); else { g.r(0, 9 + kneel, 2, 5, 15); g.r(14, 9 + kneel, 2, 5, 15); }
      if (pose === 'hurt') g.p(12, 8, 12);
    }), 1);
  }
  const mechP = (body, hair) => mkP({ skin: '#ffdbb6', hair, hair2: hair, top: body, top2: '#49496d', bot: '#6d6d92', shoe: '#242449', acc: '#ffdb24', acc2: '#ff2424', x1: '#24dbff', x2: '#929292' });
  build('armor_yoko', { P: mechP('#9292db', '#b66d49') }, mechSpr);
  build('armor_terms', { P: mechP('#ff6db6', '#242424') }, mechSpr);
  build('armor_conds', { P: mechP('#ff6db6', '#db6d24') }, mechSpr);
  // the two troopers on foot (they get a few lines before the mine)
  build('terms', { hair: 'bob', P: mkP({ hair: '#242424', top: '#ff6db6', top2: '#db4992', bot: '#b62470', shoe: '#ffffff', acc: '#ffffff', acc2: '#24dbff' }), head: (h, d) => { if (d !== 'u') { h.r(2, 7, 12, 3, 12); h.r(3, 8, 10, 1, 13); } } });
  build('conds', { hair: 'bob', P: mkP({ hair: '#db6d24', top: '#ff6db6', top2: '#db4992', bot: '#b62470', shoe: '#ffffff', acc: '#ffffff', acc2: '#24dbff' }), head: (h, d) => { if (d !== 'u') { h.r(2, 7, 12, 3, 12); h.r(3, 8, 10, 1, 13); } } });

  // ---------------- generic NPCs (townsfolk, soldiers, Yokoids…) from the same chibi ----------------
  const npcO = o => ({ hair: o.hairStyle || 'short', head: o.head, body: o.body, P: mkP(o) });
  const NPCS = {
    man: { hair: '#6d4924', top: '#926d49', top2: '#6d4924', bot: '#49496d' },
    woman: { hairStyle: 'long', hair: '#dbb624', hair2: '#b6926d', top: '#db6d6d', top2: '#b64949', bot: '#b64949' },
    elder: { hair: '#dbdbdb', hair2: '#b6b6b6', top: '#6d6d92', top2: '#49496d', bot: '#49496d', head: (h, d) => { if (d === 'd') h.r(4, 11, 8, 2, 4); } },
    child: { hair: '#b66d24', top: '#49b649', top2: '#249224', bot: '#2449b6' },
    miner: { hair: '#492424', top: '#b6926d', top2: '#926d49', bot: '#6d4924', head: (h, d) => { h.e(8, 3, 6.4, 3, 12); h.r(1, 3, 14, 2, 12); if (d === 'd') h.e(8, 2, 1.5, 1.2, 11); } },
    trooper: { hairStyle: 'bob', hair: '#ff92b6', hair2: '#db6d92', top: '#ff6db6', top2: '#db4992', bot: '#b62470', shoe: '#ffffff', acc: '#ffffff',
      head: (h, d) => { if (d !== 'u') { h.r(2, 7, 12, 3, 12); h.r(3, 8, 10, 1, 13); } }, acc2: '#24dbff' }, // franchise trooper: pink uniform, white visor
    exec: { hair: '#242424', top: '#242449', top2: '#101024', bot: '#242449', acc: '#db2424', body: (g, d, p, by) => { if (d === 'd') g.r(8, 12 + by, 1, 6, 12); } },
    clerk: { hair: '#dbb649', top: '#492449', top2: '#241024', bot: '#242449', head: (h, d) => { if (d === 'd') { h.r(3, 7, 10, 2, 13); h.p(5, 8, 11); h.p(10, 8, 11); } }, acc2: '#242424' },
    yokoid: { hairStyle: 'bob', skin: '#ffdbdb', hair: '#926d49', hair2: '#6d4924', top: '#b692db', top2: '#926db6', bot: '#dbb6ff' },
    diva: { hairStyle: 'long', skin: '#ffdbdb', hair: '#ffdb92', hair2: '#dbb66d', top: '#ffffff', top2: '#dbdbff', bot: '#ffffff', shoe: '#dbdbff' },
    suit: { hairStyle: 'none', skin: '#ffffff', skin2: '#dbdbdb', top: '#ffffff', top2: '#dbdbdb', bot: '#dbdbdb', shoe: '#b6b6b6', eye: '#ffffff', head: (h, d) => { if (d !== 'u') h.r(d === 'l' ? 1 : 3, 6, d === 'l' ? 7 : 10, 4, 10); } },
    focus: { hairStyle: 'none', skin: '#dbc8a0', skin2: '#b6a07a', top: '#b6a07a', top2: '#927a5a', bot: '#6d5a49', eye: '#dbc8a0' },
    guard: { hair: '#6d6d6d', top: '#6d6d92', top2: '#49496d', bot: '#49496d', head: (h, d) => { h.e(8, 3.5, 6.6, 3.6, 12); h.r(1, 4, 14, 2, 12); if (d === 'd') h.r(7, 0, 2, 3, 13); }, acc: '#b6b6b6', acc2: '#db2424' },
    sailor: { hair: '#242424', top: '#ffffff', top2: '#b6b6db', bot: '#2449b6', head: (h, d) => { h.r(2, 1, 12, 3, 11); } },
    cook: { hair: '#6d4924', top: '#ffffff', top2: '#dbdbdb', bot: '#6d6d6d', head: (h, d) => { h.r(3, -1, 10, 4, 11); h.e(8, -1, 5, 2, 11); } },
    waitress: { hairStyle: 'bob', hair: '#ff92b6', top: '#92dbff', top2: '#6db6db', bot: '#92dbff' },
    newfile: { hairStyle: 'none', skin: '#dbdbdb', skin2: '#b6b6b6', top: '#b6b6b6', top2: '#929292', bot: '#929292', eye: '#6d6d6d' },
  };
  for (const k in NPCS) { const o = npcO(NPCS[k]); ART.npc[k] = { P: o.P, d: POSES.map(p => chibi(o, 'd', p)), u: POSES.map(p => chibi(o, 'u', p)), l: POSES.map(p => chibi(o, 'l', p)) }; }
  ART.npcO = npcO; ART.chibi = chibi; ART.mkP = mkP;

  // field sprite for anyone: frame index 0..3 cycles stand, step1, stand, step2
  ART.field = (who, dir, f) => { const s = ART.hero[who] || ART.npc[who]; const k = dir === 'r' ? 'l' : dir; return s[k][[0, 1, 0, 2][f & 3]]; };
  ART.pal = who => (ART.hero[who] || ART.npc[who]).P;
})();

// draw a field character: dir d/u/l/r, walking frame f
function drawWho(who, x, y, dir, f, P) { draw(ART.field(who, dir, f), x, y, P || ART.pal(who), dir === 'r'); }
