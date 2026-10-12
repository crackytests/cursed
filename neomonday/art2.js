'use strict';
// ================= CASE 2 portraits: MRS. ODELL, FUSE, MR. SUNDAY, DJ STATIC =================

// ---------- MRS. ODELL: tired, kind, a red polka kerchief, a cardigan that has been through it ----------
function odellPortrait(mood = 'worry', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    const card = [hex('#3a2a34'), hex('#6a4a58'), hex('#9a6a7a'), hex('#c890a0')], red = [hex('#6a1020'), hex('#a82038'), hex('#d84060'), hex('#ff7090')];
    blob(48, 124, 54, 40, card, RIM); polyF([[34, 84], [62, 84], [48, 104]], K.white[2]); for (const [x, y] of [[26, 100], [70, 100], [34, 108]]) ellF(x, y, 2, 2, K.white[2]);
    rectF(41, 76, 14, 9, K.skin[1]);
    blob(48, 56, 31, 33, [hex('#6a6a7a'), hex('#9a9aaa'), hex('#c8c8d4'), hex('#e8e8f0')], RIM);        // grey hair under the scarf
    blob(48, 60, 23, 27, K.skin, { light: [-.4, -.5, .7] });
    blob(48, 34, 36, 19, red, RIM); for (let i = 0; i < 18; i++) ellF(16 + hash(i, 1, 6) * 64, 22 + hash(i, 2, 6) * 20, 1.4, 1.4, K.white[3]);   // polka dots
    blob(80, 46, 10, 7, red, RIM);                                                                      // the knot
    for (const cx of [38, 58]) { ellF(cx, 58, 6, 3.6, K.white[3]); ellF(cx + (cx < 48 ? 1 : -1), 58, 2.4, 2.4, K.ink); lineF(cx - 6, 63, cx + 6, 63, hex('#a06a6a')); lineF(cx - 7, 52 + (cx < 48 ? 0 : 0), cx + 6, 52 - (mood === 'worry' ? (cx < 48 ? -2 : 2) : 0), K.ink); }
    lineF(48, 60, 47, 69, K.skin[1]);
    if (talk) ellF(48, 77, 5, 2 + talk, K.ink); else { lineF(42, 77, 54, 77, hex('#a03850'), 2); if (mood === 'worry') { pset(41, 78, hex('#a03850')); pset(55, 78, hex('#a03850')); } }
    for (let i = 0; i < 10; i++) pset(34 + hash(i, 3, 6) * 28, 66 + hash(i, 4, 6) * 10, K.skin[1]);
  }));
}

// ---------- FUSE: jailbird engineer, goggles pushed up, a grin that has been told off before ----------
function fusePortrait(mood = 'grin', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    const suit = [hex('#2a3a1a'), hex('#4a6a2a'), hex('#7a9a3a'), hex('#a8c85a')];
    blob(48, 124, 52, 40, suit, RIM); rectF(40, 76, 16, 9, K.skin[2]); lineF(30, 92, 42, 112, K.amber, 2); lineF(66, 90, 54, 112, K.cyan, 2);
    blob(48, 58, 27, 30, K.skin, { light: [-.4, -.5, .7] });
    for (let i = 0; i < 26; i++) { const a = i / 26 * 3.14 + 3.14, x = 48 + Math.cos(a) * (28 + hash(i, 1, 7) * 9), y = 44 + Math.sin(a) * (22 + hash(i, 2, 7) * 12); ellF(x, y, 4, 5, K.hair[1]); } // wild hair
    blob(48, 34, 30, 12, K.hair, RIM);
    rectF(20, 38, 56, 9, K.steel[0]); rectF(21, 39, 54, 2, K.steel[2]); ellF(34, 42, 9, 8, K.steel[1]); ellF(62, 42, 9, 8, K.steel[1]); ellF(34, 42, 6, 5, hex('#9ae8ff')); ellF(62, 42, 6, 5, hex('#9ae8ff')); // goggles on the forehead
    for (const cx of [38, 58]) { ellF(cx, 58, 5, 4, K.white[3]); ellF(cx + (cx < 48 ? 1 : -1), 58, 2.2, 2.2, K.ink); lineF(cx - 6, 52, cx + 6, 52 + (cx < 48 ? 1 : -1), K.ink); }
    lineF(48, 60, 46, 68, K.skin[1]);
    if (talk) ellF(48, 76, 6, 2 + talk, K.ink); else { lineF(38, 74, 48, 77, K.ink); lineF(48, 77, 60, 73, K.ink); pset(60, 72, K.ink); rectF(42, 76, 4, 1, K.white[3]); }
    for (let i = 0; i < 14; i++) pset(34 + hash(i, 5, 7) * 28, 68 + hash(i, 6, 7) * 14, K.skin[0]);       // stubble
  }));
}

// ---------- MR. SUNDAY: a hundred-and-fourteen-year-old chef in a tall white toque, as an amber hologram ----------
function sundayPortrait(mood = 'calm', talk = 0) {
  return outlineBuf(offscreen(PW, PH, () => {
    const h = [hex('#4a2c08'), hex('#a8680c'), hex('#f0a020'), hex('#ffe090')];
    blob(48, 124, 50, 40, h, { rimL: K.amber, rimR: K.amber }); polyF([[36, 84], [60, 84], [48, 108]], h[3]); polyF([[44, 88], [52, 88], [54, 96], [48, 100], [42, 96]], h[0]); // bow tie
    blob(48, 14, 28, 22, h, { light: [-.3, -.8, .5] }); rectF(24, 30, 48, 8, h[2]); for (let x = 28; x < 70; x += 8) lineF(x, 6, x, 30, h[1]);        // the toque
    blob(48, 60, 27, 31, h, { rimL: K.amber, rimR: K.amber });
    for (const cx of [37, 59]) { ellF(cx, 56, 9, 8, h[0]); ellF(cx, 56, 7.5, 6.6, h[3]); ellF(cx, 57, 3, 3, h[0]); }
    lineF(28, 51, 46, 49, h[0], 2); lineF(50, 49, 68, 51, h[0], 2); lineF(30, 50, 12, 46, h[3]); lineF(66, 50, 84, 46, h[3]);      // brows, spectacle arms
    lineF(48, 58, 46, 68, h[1]); for (let y = 42; y < 76; y += 5) { lineF(24, y, 30, y + 1, h[1]); lineF(66, y + 1, 72, y, h[1]); }       // wrinkles
    polyF([[28, 74], [48, 68], [68, 74], [62, 84], [48, 80], [34, 84]], h[3]);                                                         // the mustache
    if (talk) ellF(48, 88, 4, 1 + talk, h[0]);
    for (let y = 0; y < PH; y += 3) for (let x = 0; x < PW; x++) if (pget(x, y)) pset(x, y, mix(pget(x, y), K.ink, .35));
  }));
}

// ---------- DJ STATIC: a copycat in headphones. The ears fit through the headband. ----------
function djPortrait(mood = 'cold', talk = 0) {
  const base = copycatPortrait(mood, talk);
  return outlineBuf(offscreen(PW, PH, () => {
    blit(base, 0, 0);
    for (let i = 0; i <= 16; i++) { const a = 3.14 + i / 16 * 3.14; pset(48 + Math.cos(a) * 33, 52 + Math.sin(a) * 38, K.mag); pset(48 + Math.cos(a) * 34, 52 + Math.sin(a) * 39, K.mag); pset(48 + Math.cos(a) * 33, 53 + Math.sin(a) * 38, K.ink); }
    blob(15, 58, 8, 13, [K.ink, hex('#5a1050'), hex('#a02080'), hex('#ff5ac8')], RIM); blob(81, 58, 8, 13, [K.ink, hex('#5a1050'), hex('#a02080'), hex('#ff5ac8')], RIM);
    lineF(24, 94, 40, 100, K.steel[3], 1); ellF(41, 100, 3, 3, K.ink); ellF(41, 100, 2, 2, K.steel[3]);                                // the boom mic
  }));
}
Object.assign(PORTS, { ODELL: odellPortrait, FUSE: fusePortrait, SUNDAY: sundayPortrait, DJ: djPortrait });
