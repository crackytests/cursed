'use strict';
// ================= CASE 2 scenes: the powder warehouse, the city jail, the radio studio, the tower roof =================
SCENES.warehouse = () => offscreen(W, VH, () => {
  corridor(hex('#1a1608'), hex('#3a3418'), hex('#1c180c'), hex('#4a4220'));
  for (const side of [-1, 1]) {
    for (const v of [.18, .42, .66, .9]) wallQuad(side, 0, 1, v, v + .025, hex('#8a7a38'));
    for (let i = 0; i < 9; i++) for (const v of [.18, .42, .66]) { const t0 = i / 9 + .012, t1 = (i + 1) / 9 - .02; wallQuad(side, t0, t1, v + .03, v + .22, hex('#d8b830')); wallQuad(side, t0 + .004, t1 - .004, v + .1, v + .15, hex('#c03030')); wallQuad(side, t0, t1, v + .03, v + .06, hex('#f0e070')); }
  }
  rectF(214, 60, 84, 54, hex('#12100a')); frameR(214, 60, 84, 54, hex('#8a7a38')); bigText('JUST ADD', 222, 68, hex('#f0e070'), 1); bigText('MONDAY', 226, 82, hex('#ff7040'), 2);
  rectF(236, 100, 40, 14, hex('#4a4220')); rectF(238, 96, 36, 6, hex('#8a7a38'));
  polyF([[230, 0], [282, 0], [278, 6], [234, 6]], hex('#fff0a0')); glow(256, 6, 150, hex('#ffd860'), .55);
  for (let i = 0; i < 160; i++) pset(hash(i, 1, 4) * W, hash(i, 2, 4) * VH, hex('#e8e0b0'));
  glow(256, 150, 180, hex('#c8a020'), .25);
});
SCENES.jail = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#10181c'), hex('#243038'), 8);
  rectF(40, 20, 432, 120, hex('#1c2a30')); for (let x = 40; x < 472; x += 36) rectF(x, 20, 2, 120, hex('#2a3c44'));
  rectF(70, 108, 130, 10, hex('#4a5a62')); rectF(70, 118, 6, 22, hex('#2a3a42')); rectF(194, 118, 6, 22, hex('#2a3a42'));
  rectF(300, 64, 28, 36, hex('#6a7a82')); rectF(304, 70, 20, 20, hex('#1a2a30'));
  gradV(0, 140, W, 36, hex('#243038'), hex('#0c1418'), 5);
  for (let x = 8; x < W; x += 30) { rectF(x, 0, 10, VH, hex('#06080c')); rectF(x + 2, 0, 3, VH, hex('#4a5a62')); rectF(x, 36, 10, 4, hex('#06080c')); }
  rectF(0, 0, W, 8, hex('#06080c')); rectF(0, VH - 8, W, 8, hex('#06080c'));
  ellF(256, 10, 14, 6, hex('#fff0b0')); glow(256, 18, 170, hex('#ffe890'), .5);
  for (let i = 0; i < 8; i++) lineF(60 + i * 6, 24, 60 + i * 6, 34, hex('#6a7a82'));
});
SCENES.studio = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#1a0c1c'), hex('#3a1830'), 8);
  for (let y = 0; y < 110; y += 12) for (let x = 0; x < W; x += 12) { const k = ((x / 12 + y / 12) | 0) & 1; polyF([[x, y + 12], [x + 6, y], [x + 12, y + 12]], k ? hex('#2a1230') : hex('#14081a')); }
  rectF(150, 20, 220, 70, K.ink); frameR(150, 20, 220, 70, hex('#6a5a7a')); gradV(154, 24, 212, 62, hex('#5a2850'), hex('#241030'), 6);
  for (let i = 0; i < 5; i++) polyF([[154 + i * 44, 24], [166 + i * 44, 24], [154 + i * 44, 86], [142 + i * 44, 86]], hex('#7a3a6a'));
  gradV(0, 108, W, 68, hex('#3a2230'), hex('#100810'), 6);
  rectF(30, 96, 140, 40, hex('#3c3050')); rectF(30, 96, 140, 3, hex('#8a78a8')); for (let i = 0; i < 12; i++) { ellF(40 + i * 11, 112, 3, 3, hex('#c8c0d8')); rectF(38 + i * 11, 120, 4, 10, i % 3 ? hex('#58ff90') : hex('#ff5030')); }
  rectF(350, 70, 90, 70, hex('#2a2430')); ellF(375, 100, 22, 22, hex('#12101a')); ellF(375, 100, 18, 18, hex('#8a8aa0')); ellF(375, 100, 5, 5, hex('#12101a')); ellF(420, 100, 16, 16, hex('#12101a')); ellF(420, 100, 12, 12, hex('#8a8aa0'));
  rectF(240, 90, 3, 50, hex('#6a6a7a')); rectF(236, 140, 12, 4, hex('#6a6a7a')); ellF(241, 86, 8, 11, K.ink); ellF(241, 86, 6, 9, hex('#8a8a9a'));
  rectF(430, 14, 64, 22, K.ink); frameR(430, 14, 64, 22, hex('#ff3030')); glow(462, 25, 60, hex('#ff3030'), .4);
});
SCENES.tower = () => offscreen(W, VH, () => {
  gradV(0, 0, W, 140, hex('#0c0620'), hex('#4a1850'), 10); glow(400, 40, 150, hex('#c868ff'), .3); ellF(400, 40, 18, 18, hex('#d8c8ff')); ellF(406, 36, 16, 16, hex('#2a1450'));
  let seed = 9; { let x = -10; for (let i = 0; i < 14; i++) { const w = 30 + hash(i, seed, 1) * 40; tower(x | 0, w | 0, (100 + hash(i, seed, 2) * 40) | 0, 176, hex('#1a0c34'), seed, .25); x += w - 2; } }
  gradV(0, 140, W, 36, hex('#14101c'), hex('#06040a'), 4); rectF(0, 140, W, 3, hex('#4a4060'));
  lineF(250, 0, 232, 176, hex('#9a90b0'), 2); lineF(262, 0, 280, 176, hex('#9a90b0'), 2); lineF(256, 0, 256, 176, hex('#6a6080'), 1);
  for (let i = 0; i < 14; i++) { const y = i * 12; lineF(250 - y * .1, y, 262 + y * .1, y, hex('#9a90b0'), 2); lineF(250 - y * .1, y, 262 + (y + 12) * .1, y + 12, hex('#6a6080')); lineF(262 + y * .1, y, 250 - (y + 12) * .1, y + 12, hex('#6a6080')); }
  ellF(120, 148, 30, 12, hex('#8a8aa0')); ellF(120, 146, 24, 8, hex('#3a3a50')); rectF(118, 148, 4, 20, hex('#8a8aa0'));
  rectF(380, 128, 70, 30, hex('#2a2436')); rectF(386, 134, 14, 16, hex('#12101a')); rectF(430, 108, 20, 20, hex('#2a2436'));
  glow(256, 150, 170, hex('#c868ff'), .2);
});
Object.assign(ANIM, {
  warehouse: t => { for (let i = 0; i < 20; i++) { const x = (hash(i, 1, 6) * W + t * .2) % W, y = (hash(i, 2, 6) * VH + t * .15) % VH; pset(x, y, hex('#f0e8b0')); } },
  jail: t => { if (((t >> 2) % 61) < 2) rectA(0, 0, W, VH, K.ink, .35); },
  studio: t => { if ((t >> 4) & 1) glow(462, 25, 70, hex('#ff3030'), .3); text('ON AIR', 436, 21, (t >> 4) & 1 ? hex('#ff5050') : hex('#702020'), 0); for (let i = 0; i < 12; i++) rectF(38 + i * 11, 120, 4, 10, ((Math.sin(t * .08 + i) + 1) * 2) > 2.2 ? hex('#ff5030') : hex('#58ff90')); },
  tower: t => { rain(t, 100); if ((t >> 5) & 1) glow(256, 4, 40, hex('#ff3030'), .8); if (t % 400 < 3) rectA(0, 0, W, VH, K.white[3], .5); },
});
