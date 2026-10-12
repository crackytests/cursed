'use strict';
// ================= NEO MONDAY — scenes: pre-drawn into a 512x176 buffer on entry; ANIM[id](t) adds the moving parts =================
function bigText(s, x, y, c, sc = 2) { for (const ch of s) { const g = FONT[ch] || FONT[ch.toUpperCase()]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) rectF(x + i * sc, y + j * sc, sc, sc, c); x += 6 * sc; } }
function neon(s, x, y, c, sc = 2, a = .55) { glow(x + s.length * 3 * sc, y + 3.5 * sc, s.length * 4.2 * sc + 14, c, a); bigText(s, x + sc, y + sc, K.ink, sc); bigText(s, x, y, mix(c, K.white[3], .5), sc); }
function tower(x, w, top, base, c, seed, lit = .35) {
  rectF(x, top, w, base - top, c); rectF(x, top, 1, base - top, mix(c, K.mag, .4)); rectF(x + w - 1, top, 1, base - top, mix(c, K.cyan, .35));
  for (let wy = top + 5; wy < base - 4; wy += 7) for (let wx = x + 4; wx < x + w - 4; wx += 6) if (hash(wx, wy, seed) < lit) rectF(wx, wy, 3, 3, hash(wx, wy, seed + 1) < .5 ? K.amber : hex('#a0e8ff'));
}
// perspective helper for corridor-style rooms: wall quads between the near edge and the far plane
const VPL = { l: 196, r: 316, ct: 54, fl: 116 };
const lerp = (a, b, t) => a + (b - a) * t;
function wallPt(side, t, v) { const x = side < 0 ? lerp(0, VPL.l, t) : lerp(W, VPL.r, t), c = lerp(0, VPL.ct, t), f = lerp(VH, VPL.fl, t); return [x, lerp(c, f, v)]; }
function wallQuad(side, t0, t1, v0, v1, col) { polyF([wallPt(side, t0, v0), wallPt(side, t1, v0), wallPt(side, t1, v1), wallPt(side, t0, v1)], col); }
function corridor(ceil, wall, floor, back) {
  polyF([[0, 0], [W, 0], [VPL.r, VPL.ct], [VPL.l, VPL.ct]], ceil); polyF([[0, VH], [W, VH], [VPL.r, VPL.fl], [VPL.l, VPL.fl]], floor);
  polyF([[0, 0], [VPL.l, VPL.ct], [VPL.l, VPL.fl], [0, VH]], wall); polyF([[W, 0], [VPL.r, VPL.ct], [VPL.r, VPL.fl], [W, VH]], mix(wall, K.ink, .25)); rectF(VPL.l, VPL.ct, VPL.r - VPL.l, VPL.fl - VPL.ct, back);
}
const SCENES = {};

SCENES.freezer = () => offscreen(W, VH, () => {
  corridor(hex('#0a1626'), hex('#16304e'), hex('#0e1c30'), hex('#1c3c5c'));
  for (const side of [-1, 1]) {
    for (const v of [.2, .45, .7]) wallQuad(side, 0, 1, v, v + .03, hex('#6a8aa8'));
    for (let i = 0; i < 9; i++) for (const v of [.2, .45, .7]) { const t0 = i / 9 + .01, t1 = (i + 1) / 9 - .015; if (hash(i, v * 10, side + 4) < .8) { wallQuad(side, t0, t1, v - .2, v, hex('#d8d0c0')); wallQuad(side, t0 + .005, t1 - .005, v - .12, v - .06, hex('#c03040')); wallQuad(side, t0, t1, v - .2, v - .17, hex('#8a8478')); } }
  }
  rectF(222, 64, 68, 50, hex('#38485e')); frameR(222, 64, 68, 50, K.ink); rectF(224, 66, 64, 2, hex('#6a8aa8')); ellF(256, 90, 9, 9, K.ink); ellF(256, 90, 6, 6, hex('#c03040')); // heavy door
  polyF([[210, 0], [302, 0], [296, 4], [216, 4]], hex('#e8f4ff')); glow(256, 6, 150, hex('#6aa8ff'), .5);                                                           // ceiling strip
  for (let i = 0; i < 420; i++) { const x = hash(i, 1, 9) * W, y = hash(i, 2, 9) * VH; if (x < 70 || x > 440 || y < 14 || y > 150) pset(x, y, K.white[3]); }              // frost
  glow(256, 150, 200, hex('#cfe4ff'), .35);
});
SCENES.plant = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#1c0c0c'), hex('#4a1810'), 8);
  for (let x = 0; x < W; x += 64) { rectF(x, 0, 6, 70, hex('#2a1a1a')); rectF(x, 64, 64, 4, hex('#3a2220')); }
  for (let x = 0; x < W; x += 8) rectF(x, 10 + (x % 16 ? 0 : 3), 6, 3, hex('#5a3028'));
  rectF(0, 18, W, 5, hex('#3a2220')); rectF(0, 40, W, 3, hex('#3a2220'));
  for (const x of [40, 190, 360]) { rectF(x, 58, 110, 70, hex('#2a2430')); rectF(x + 4, 62, 102, 62, hex('#3c3648')); rectF(x + 10, 70, 90, 22, hex('#12101a')); for (let k = 0; k < 6; k++) ellF(x + 18 + k * 14, 81, 4, 4, k % 3 ? hex('#ff8a30') : hex('#ff3030')); rectF(x + 10, 100, 90, 3, hex('#6a6478')); }
  gradV(0, 128, W, 48, hex('#241418'), hex('#0c0608'), 6); for (let x = 0; x < W; x += 24) rectF(x, 128, 12, 4, hex('#d4a020'));
  rectF(0, 134, W, 10, hex('#14121c')); for (let x = 0; x < W; x += 6) rectF(x, 136 + (x % 12 ? 0 : 1), 3, 6, hex('#3c3648'));
  for (let x = 8; x < W; x += 44) { rectF(x, 124, 26, 10, hex('#e8dcc0')); rectF(x + 2, 126, 22, 3, hex('#c85030')); rectF(x + 2, 129, 22, 2, hex('#f0c060')); }
  glow(256, 30, 190, hex('#ff2810'), .45); glow(60, 100, 90, hex('#ff8a30'), .25); glow(450, 100, 90, hex('#ff8a30'), .25);
});
SCENES.street = () => offscreen(W, VH, () => {
  gradV(0, 0, W, 120, hex('#1a0838'), hex('#6a1c58'), 10);
  glow(256, 118, 230, hex('#ff3cc8'), .35);
  let seed = 3; for (const [c, n, lo, hi, lit] of [['#2a1048', 16, 30, 80, .25], ['#1e0c3a', 11, 50, 105, .35]]) { let x = -10; for (let i = 0; i < n; i++) { const w = 26 + hash(i, seed, 1) * 34; tower(x | 0, w | 0, (lo + hash(i, seed, 2) * (hi - lo)) | 0, 150, hex(c), seed, lit); x += w - 2; } seed++; }
  tower(360, 70, 6, 150, hex('#160a30'), 8, .4); neon("SUNDAY'S", 340, 20, K.cyan, 3); neon('LASAGNA', 345, 48, K.mag, 2);
  rectF(150, 22, 110, 40, K.ink); frameR(150, 22, 110, 40, K.mag); neon('ITS ALWAYS', 160, 30, K.amber, 1, .3); neon('MONDAY', 168, 42, K.amber, 2, .35);
  tower(0, 130, 70, 150, hex('#2a1636'), 12, .3); tower(380, 132, 80, 150, hex('#26123a'), 13, .3);
  neon('THE LUKEWARM', 8, 92, K.mag, 2); rectF(44, 122, 24, 28, K.ink); rectF(46, 124, 20, 26, hex('#ffb040')); glow(56, 140, 36, K.amber, .5);
  rectF(420, 100, 36, 30, K.ink); frameR(420, 100, 36, 30, K.cyan); neon('LITTER', 422, 108, K.cyan, 1, .3); text('NEO MONDAY P.D.', 396, 134, hex('#7ac8ff'));
  gradV(0, 150, W, 26, hex('#1a1028'), hex('#0a0814'), 4); rectF(0, 150, W, 3, hex('#4a3a5a'));
  for (const [x, c] of [[40, K.mag], [340, K.cyan], [380, K.cyan], [80, K.amber], [420, K.cyan]]) rectA(x - 6, 154, 12, 22, c, .22);
  polyF([[210, 170], [300, 170], [296, 158], [270, 152], [236, 152], [214, 158]], K.ink); rectF(220, 170, 12, 6, K.ink); rectF(278, 170, 12, 6, K.ink); ellF(226, 168, 5, 5, K.ink);
  rectF(232, 156, 16, 4, hex('#3a2a5a')); rectF(254, 156, 24, 4, hex('#3a2a5a')); ellF(212, 164, 2, 2, K.red);
});
SCENES.bar = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#1c0c14'), hex('#3a1818'), 8);
  for (let x = 0; x < W; x += 24) rectF(x, 0, 2, 100, hex('#2a1018'));
  rectF(0, 30, W, 4, hex('#5a3028')); rectF(0, 66, W, 4, hex('#5a3028'));
  for (let x = 14; x < W - 20; x += 20) for (const y of [14, 50]) { const c = [hex('#ffb040'), hex('#40d0ff'), hex('#ff5090'), hex('#80ff90')][((x / 20) | 0) % 4]; rectF(x, y, 8, 16, mix(c, K.ink, .25)); rectF(x + 3, y - 5, 2, 6, mix(c, K.ink, .5)); rectF(x + 1, y + 2, 3, 12, c); }
  neon('OPEN-ISH', 190, 84, K.mag, 2); neon('BEER', 24, 92, K.cyan, 2, .4);
  gradV(0, 118, W, 58, hex('#4a2418'), hex('#1a0c08'), 6); rectF(0, 112, W, 10, hex('#7a4630')); rectF(0, 112, W, 2, hex('#c88a60'));
  for (const x of [50, 150, 370, 460]) { ellF(x, 146, 18, 6, hex('#0c0608')); rectF(x - 2, 146, 4, 26, hex('#2a1a24')); ellF(x, 140, 18, 5, hex('#8a3040')); }
  glow(256, 100, 200, hex('#ff8a30'), .3); glow(420, 40, 80, hex('#ff3cc8'), .2);
});
SCENES.morgue = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#0c1c24'), hex('#1c3a44'), 8);
  for (let c = 0; c < 6; c++) for (let r = 0; r < 3; r++) { const x = 14 + c * 84, y = 8 + r * 38; rectF(x, y, 78, 34, hex('#6a8a98')); rectF(x + 2, y + 2, 74, 30, hex('#8aaab8')); rectF(x + 2, y + 2, 74, 4, hex('#c8e0ea')); rectF(x + 30, y + 14, 18, 4, hex('#38505c')); text(String(r * 6 + c + 1).padStart(2, '0'), x + 6, y + 20, hex('#38505c'), 0); }
  gradV(0, 124, W, 52, hex('#243c48'), hex('#0a1820'), 6);
  polyF([[110, 150], [400, 150], [420, 172], [90, 172]], hex('#98b4c0')); rectF(130, 140, 250, 12, hex('#c8dce6')); polyF([[130, 140], [380, 140], [360, 128], [150, 128]], hex('#e8f4fa'));
  polyF([[160, 128], [350, 128], [340, 112], [172, 112]], hex('#e8f0f4')); ellF(334, 117, 12, 8, hex('#e8f0f4')); polyF([[172, 112], [340, 112], [338, 108], [176, 108]], hex('#b8ccd4'));
  rectF(250, 0, 12, 40, hex('#4a5a64')); polyF([[200, 40], [312, 40], [286, 60], [226, 60]], hex('#e8f4ff')); glow(256, 70, 160, hex('#c8f0ff'), .7);
});
SCENES.office = () => offscreen(W, VH, () => {
  gradV(0, 0, W, VH, hex('#1c1020'), hex('#2a1a30'), 8);
  rectF(300, 14, 190, 110, K.ink); gradV(304, 18, 182, 102, hex('#3a1058'), hex('#a02870'), 8);
  for (let i = 0; i < 12; i++) tower(306 + i * 15, 14, (60 + hash(i, 1, 3) * 40) | 0, 120, hex('#160a28'), i, .3);
  for (let y = 18; y < 120; y += 9) rectF(304, y, 182, 3, hex('#0a0614'));
  gradV(0, 126, W, 50, hex('#2a1a28'), hex('#100810'), 6);
  for (let i = 0; i < 5; i++) polyF([[330 + i * 30, 126], [350 + i * 30, 126], [250 + i * 30, 176], [210 + i * 30, 176]], hex('#7a2a5a'));
  rectF(20, 40, 110, 90, hex('#3a3040')); for (let y = 44; y < 128; y += 22) { rectF(24, y, 102, 18, hex('#524a60')); rectF(66, y + 7, 18, 4, hex('#c8c0d0')); }
  rectF(120, 112, 200, 14, hex('#4a2c1c')); rectF(130, 126, 14, 50, hex('#2a1810')); rectF(296, 126, 14, 50, hex('#2a1810')); rectF(120, 112, 200, 2, hex('#c08a60'));
  rectF(172, 100, 80, 11, K.ink); text('J.B. GARFIELD', 175, 102, hex('#e8d8b0'), 0); rectF(138, 96, 5, 16, hex('#6a6a7a')); ellF(140, 94, 12, 5, hex('#ffd890')); glow(140, 100, 70, K.amber, .5);
  rectF(272, 96, 24, 16, hex('#1a2a3a')); rectF(274, 98, 20, 11, hex('#58e0ff')); glow(284, 104, 28, K.cyan, .35);
});
SCENES.basement = () => offscreen(W, VH, () => {
  corridor(hex('#10060c'), hex('#2a0c18'), hex('#14060c'), hex('#3a1020'));
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) { const t0 = i / 6 + .02, t1 = (i + 1) / 6 - .03; wallQuad(side, t0, t1, .1, .9, hex('#5a1a2a')); wallQuad(side, t0 + .01, t1 - .01, .14, .86, hex('#7a8aa0')); wallQuad(side, t0 + .02, t1 - .02, .2, .8, hex('#3a4a68')); }
  for (const side of [-1, 1]) for (let i = 0; i < 6; i++) { const t = (i + .5) / 6, p = wallPt(side, t, .4), q = wallPt(side, t, .6); lineF(p[0], p[1], q[0], q[1], hex('#c8d4e8'), 2 + (1 - t) * 3); }
  rectF(226, 70, 60, 46, hex('#12060c')); frameR(226, 70, 60, 46, hex('#c03040')); rectF(232, 76, 48, 30, hex('#082018')); for (let y = 78; y < 104; y += 3) rectF(234, y, 20 + (y * 7) % 20, 1, hex('#58ffa0'));
  glow(256, 90, 120, hex('#40ff90'), .35); glow(0, 90, 120, hex('#ff2030'), .35); glow(W, 90, 120, hex('#ff2030'), .35);
});
SCENES.title = () => offscreen(W, VH, () => {
  gradV(0, 0, W, 130, hex('#14062c'), hex('#6a1c58'), 12); glow(256, 120, 260, hex('#ff3cc8'), .45);
  let seed = 3; for (const [c, n, lo, hi, lit] of [['#2a1048', 18, 40, 90, .2], ['#1a0a34', 12, 60, 115, .3], ['#10061e', 9, 80, 130, .35]]) { let x = -10; for (let i = 0; i < n; i++) { const w = 30 + hash(i, seed, 1) * 40; tower(x | 0, w | 0, (lo + hash(i, seed, 2) * (hi - lo)) | 0, 176, hex(c), seed, lit); x += w - 2; } seed++; }
});

// ---------- moving parts, drawn on top each frame ----------
function rain(t, n = 90, col = hex('#a8c8ff')) { for (let i = 0; i < n; i++) { const x = (hash(i, 1, 4) * W * 1.2 + t * 2.5) % (W + 40) - 20, y = (hash(i, 2, 4) * VH + t * 9 * (.6 + hash(i, 3, 4) * .6)) % VH; lineF(x, y, x - 3, y + 9, mix(pget(x, y) || col, col, .45)); } }
function steam(t, x, y, n = 8) { for (let i = 0; i < n; i++) { const k = ((t * .5 + i * 17) % 60) / 60; glow(x + Math.sin(k * 6 + i) * 8, y - k * 44, 10 + k * 14, K.white[2], .12 * (1 - k)); } }
const ANIM = {
  street: t => { rain(t, 120); },
  freezer: t => { for (let i = 0; i < 30; i++) { const x = (hash(i, 1, 6) * W + Math.sin(t * .01 + i) * 30) % W, y = (hash(i, 2, 6) * VH + t * .3) % VH; pset(x, y, K.white[3]); } },
  plant: t => { glow(256, 30, 190, K.red, ((t >> 4) & 1) ? .12 : 0); steam(t, 100, 130); steam(t + 20, 330, 130); },
  bar: t => { for (let i = 0; i < 7; i++) { const k = ((t * .4 + i * 23) % 80) / 80; glow(120 + i * 50 + Math.sin(k * 5) * 10, 100 - k * 70, 16, K.white[2], .06 * (1 - k)); } },
  morgue: t => { if ((t % 240) < 4) rectA(0, 0, W, VH, K.ink, .3); },
  office: t => { for (let i = 0; i < 5; i++) glow(100 + ((t * .5 + i * 90) % 220), 70, 14, K.white[2], .05); },
  basement: t => { glow(256, 90, 100, K.cyan, ((t >> 3) & 1) ? .08 : .0); steam(t, 60, 160, 5); steam(t + 9, 450, 160, 5); },
  title: t => rain(t, 140),
};
