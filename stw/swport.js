'use strict';
// ================= SAVE THE WORLD: portraits for the gaiden's own cast, and quick ones for townsfolk =================
(() => {
  // the gaiden draws the old cast in full colour (it's a side story; the hardware finally can). OLD FACE stays green on purpose.
  for (const k of ['CARL', 'SPOOKY GHOST']) if (CAST.full[k]) PORT[k] = CAST.full[k];
  if (CAST.full.LINDA) { PORT['CEO LINDA'] = CAST.full.LINDA; PORT.LINDA = CAST.full.LINDA; }
  const at = (s, P) => ({ s, P });
  // ---------------- KURSOR: the jester. His head is a menu cursor; he points, things get selected ----------------
  const KP = pal('#000000', '#ffffff', '#dbdbdb', '#ff24db', '#920092', '#ffdb24', '#db9200', '#24dbff', '#242449', '#101024', '#ff2424', '#6dff24', '#b6b6db', '#492449');
  const kursor = (grin) => portrait(g => {
    g.r(0, 0, 48, 48, 10); for (let y = 0; y < 48; y += 4) for (let x = (y / 4) & 1 ? 2 : 0; x < 48; x += 4) g.p(x, y, 9);
    // the collar: a ruff of alternating pink and yellow points
    for (let i = 0; i < 8; i++) { const x = 4 + i * 5.5; for (let j = 0; j < 7; j++) g.r(x + j * .4, 40 + j, 6 - j * .8, 1, i & 1 ? 4 : 6); }
    // the head: a big white cursor triangle pointing right, with a face on it
    g.each((x, y) => { const dy = Math.abs(y + .5 - 24); return x >= 9 && x <= 9 + (17 - dy) * 1.7 && dy <= 17 ? 2 : 0; });
    g.each((x, y) => { if (g.get(x, y) !== 2) return 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (g.get(x + dx, y + dy) !== 2 && g.get(x + dx, y + dy) !== 3) return 3; return 0; });
    // jester cap: two floppy points with bells
    g.line(12, 9, 4, 1, 4); g.line(13, 9, 5, 1, 4); g.line(14, 8, 6, 2, 5); g.e(4, 2, 2, 2, 6);
    g.line(16, 8, 26, 0, 6); g.line(17, 8, 27, 1, 6); g.line(18, 8, 26, 2, 7); g.e(27, 1, 2, 2, 4);
    g.r(10, 8, 14, 3, 4); g.r(10, 10, 14, 1, 5);
    // eyes: one ordinary, one a blinking text cursor
    g.e(16, 19, 2.6, 3, 1); g.p(15, 18, 2); g.r(23, 15, 2, 8, grin ? 11 : 8); g.r(22, 15, 4, 1, 11);
    // the grin: wide, too many teeth
    if (grin) { g.e(20, 30, 9, 4.5, 1); for (let x = 12; x < 29; x += 2) { g.r(x, 27, 1, 2, 2); g.r(x + 1, 32, 1, 2, 2); } }
    else { g.line(13, 29, 27, 31, 1); g.line(27, 31, 29, 28, 1); }
    g.e(12, 25, 2, 1.4, 5); g.p(32, 24, 5);
  });
  PORT.KURSOR = at(kursor(1), KP); VOICE.KURSOR = [1500, 900];
  ART.kursorPlain = at(kursor(0), KP);
  // ---------------- THE FRANCHISOR: a white suit with no face, only a logo where the face should be ----------------
  const FP = pal('#101010', '#ffffff', '#dbdbdb', '#b6b6b6', '#ff6db6', '#db2492', '#ffdb49', '#242449', '#6d6d92');
  PORT['THE FRANCHISOR'] = at(portrait(g => {
    g.r(0, 0, 48, 48, 8); for (let x = 0; x < 48; x += 6) g.r(x, 0, 2, 48, 9);
    g.e(24, 50, 22, 14, 2); g.e(24, 50, 22, 14, 3); g.each((x, y) => y > 36 && Math.abs(x - 24) < 18 + (y - 36) ? (Math.abs(x - 24) < 4 ? 5 : 2) : 0);
    g.r(22, 36, 4, 12, 6); g.e(24, 20, 12, 14, 2); g.each((x, y) => g.get(x, y) === 2 && x > 30 ? 3 : 0);
    g.e(24, 20, 6, 6, 5); g.e(24, 20, 4, 4, 2); g.r(23, 14, 2, 12, 5); g.r(18, 19, 12, 2, 5); // the logo: a cross in a ring
    g.r(14, 8, 20, 2, 4);
  }), FP); VOICE['THE FRANCHISOR'] = [240, 5];
  // ---------------- BRUCE THE SHARK: gray, cheerful, a little sunburnt, has never been where he's supposed to be ----------------
  const BP = pal('#000000', '#6d92b6', '#49708f', '#dbdbff', '#ffffff', '#242424', '#db2449', '#2470db', '#92dbff', '#ffdb49');
  PORT.BRUCE = at(portrait(g => {
    g.r(0, 0, 48, 48, 7); for (let y = 30; y < 48; y += 4) for (let x = (y * 3) % 8; x < 48; x += 8) g.r(x, y, 4, 1, 8);
    g.e(24, 30, 22, 16, 2); g.each((x, y) => g.get(x, y) === 2 && y > 34 ? 4 : 0); g.each((x, y) => g.get(x, y) === 2 && x > 38 ? 3 : 0);
    g.each((x, y) => y > 2 && y < 16 && x > 24 - (y - 2) * .3 && x < 24 + (y - 2) * .45 ? 2 : 0);
    g.e(14, 24, 3, 3, 4); g.e(14, 24, 1.6, 2, 5); g.e(34, 24, 3, 3, 4); g.e(34, 24, 1.6, 2, 5);
    g.e(24, 36, 14, 5, 6); g.r(10, 32, 28, 2, 3); for (let x = 12; x < 37; x += 3) { g.r(x, 33, 2, 2, 4); g.r(x + 1, 38, 2, 2, 4); }
    g.e(10, 30, 2, 1, 6); g.e(38, 30, 2, 1, 6);
  }), BP); VOICE.BRUCE = [300, 120];
  // ---------------- a quick portrait for anyone: the chibi's head, scaled up ----------------
  ART.headPort = (who, P) => { const s = ART.field(who, 'd', 0); return at(spr(48, 48, g => { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const c = s.d[y * 16 + x]; if (c) g.r(x * 3, y * 3 + 1, 3, 3, c); } }), P || ART.pal(who)); };
  const quick = { 'THE ARCHIVIST': 'elder', 'GUARD': 'guard', 'MINER': 'miner', 'LICENSEE': 'trooper', 'HU-MAN': 'human', 'THE DIVA': 'diva', 'COOK': 'cook', 'SAILOR': 'sailor', 'YOKOID': 'yokoid', 'REBEL': 'man', 'OLD WOMAN': 'woman', 'KID': 'child', 'NEW FILE': 'newfile', 'WAITRESS': 'waitress', 'CHANCELLOR': 'exec', 'INNKEEPER': 'man', 'SHOPKEEPER': 'clerk' };
  for (const k in quick) if (!PORT[k]) PORT[k] = ART.headPort(quick[k]);
  Object.assign(VOICE, { 'THE ARCHIVIST': [420, 30], GUARD: [380, 40], MINER: [440, 60], LICENSEE: [700, 20], 'HU-MAN': [520, 0], 'THE DIVA': [1300, 100], REBEL: [500, 60] });
})();
