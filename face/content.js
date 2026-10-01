'use strict';
// ================= FACE — content pass: FOUR SHADES (the last generation), COOTERS, three mid-bosses =================
// Loaded after story.js. Adds to FOES and STG_FACE; the stage order lives in fmain.js (FACE_ORDER).
const TONE4 = {}; for (const k in TONES) TONE4[k] = TONES[k].map(hex); // light -> dark
// a checkerboard fill: the cartridge's way of doing a lighter shade
function dith(x, y, w, h, c) { x |= 0; y |= 0; for (let j = 0; j < h; j++) for (let i = (j & 1); i < w; i += 2) pset(x + i, y + j, c); }
const zoneT = () => TONE4[(SH.stage && SH.stage.zone) || 'dmg'];
// a 48x48 portrait for the new speakers
const port48 = (f, P) => ({ s: spr(48, 48, f), P });
PORT['THE AUDITOR'] = port48(g => { g.r(0, 0, 48, 48, 1); g.e(24, 50, 22, 14, 2); g.r(20, 34, 8, 8, 3); g.e(24, 22, 12, 14, 3); g.r(12, 18, 24, 6, 4); g.r(14, 19, 20, 4, 5); g.r(18, 32, 12, 2, 2); g.r(30, 36, 12, 12, 6); for (let i = 0; i < 4; i++) g.r(32, 38 + i * 2, 8, 1, 4); }, legacyPal(pal('#000000', '#241224', '#6d4970', '#ffdbdb', '#242424', '#ff6db6', '#ffffff'), 'pink'));
VOICE['THE AUDITOR'] = [420, 0];
PORT['THE BARGAIN BIN'] = port48(g => { g.r(0, 0, 48, 48, 1); for (let y = 10; y < 44; y += 4) g.r(6 + (y - 10) / 6, y, 36 - (y - 10) / 3, 1, 2); for (let x = 8; x < 42; x += 4) g.line(x, 10, x + 2, 44, 2); for (let i = 0; i < 4; i++) { g.r(8 + i * 9, 4 + (i & 1) * 3, 8, 12, 3); g.r(9 + i * 9, 6 + (i & 1) * 3, 6, 3, 4); } g.r(28, 26, 16, 10, 5); g.r(29, 27, 14, 8, 6); }, legacyPal(pal('#000000', '#242424', '#929292', '#6d6d6d', '#ffffff', '#ff2424', '#ffdb24'), 'gray'));
VOICE['THE BARGAIN BIN'] = [180, 20];
PORT['THE BOUNCER'] = port48(g => { g.r(0, 0, 48, 48, 1); g.e(24, 52, 26, 16, 2); g.e(24, 22, 13, 15, 3); g.e(24, 9, 15, 7, 4); g.e(13, 3, 4, 8, 5); g.e(35, 3, 4, 8, 5); g.r(13, 20, 22, 5, 6); g.r(18, 32, 12, 2, 7); g.r(16, 40, 16, 3, 8); }, pal('#000000', '#120012', '#ff6db6', '#ffdbdb', '#ff49b6', '#ffb6db', '#101010', '#b60024', '#ffdb24'));
VOICE['THE BOUNCER'] = [260, 10];
VOICE['???'] = VOICE['???'] || [140, 20];

// ================= BACKGROUNDS =================
function bgFour(S) { // the last generation, cartridge by cartridge. everything is four shades except him.
  const z = SH.stage.zone || 'dmg', T = TONE4[z], t = S.t, sx = S.sx;
  if (z === 'dmg') { // CARL: ABOVE & BELOW NEVADA
    rectF(0, PY, W, H - PY, T[0]); ringF(262, 52, 16, T[2]); ringF(262, 52, 12, T[2]);
    for (let i = 0; i < 6; i++) { const x = ((i * 90 - sx * .15) % 540 + 540) % 540 - 60, h = 30 + (i * 17) % 30; dith(x, 140 - h, 70, h, T[2]); dith(x + 8, 132 - h, 50, 8, T[2]); rectF(x, 140 - h, 70, 1, T[2]); }
    const ax = ((420 - sx * .06) % 460 + 460) % 460 - 50, ay = 40 + Math.round(Math.sin(t * .03) * 3); rectF(ax, ay, 46, 8, T[2]); rectF(ax + 10, ay - 6, 26, 6, T[2]); text('A.S.S.', ax + 5, ay + 1, T[0], 0);
    for (let y = 140; y < H; y += 6) rectF(0, y, W, 1, T[2]); for (let x = -(sx % 40); x < W; x += 40) { rectF(x, 176, 2, 30, T[3]); text(String((((x + sx) / 40) | 0) % 9 + 1), x + 16, 198, T[2], 0); }
    for (let i = 0; i < 5; i++) { const x = ((i * 86 - sx * .8) % 430 + 430) % 430 - 30, y = 160 + (i % 2) * 8; rectF(x, y - 30, 6, 30, T[2]); rectF(x - 6, y - 22, 6, 4, T[2]); rectF(x - 6, y - 28, 3, 8, T[2]); rectF(x + 6, y - 16, 6, 4, T[2]); rectF(x + 9, y - 24, 3, 8, T[2]); }
  } else if (z === 'pink') { // CEO LINDA: THE MALL OF THE FUTURE
    rectF(0, PY, W, H - PY, T[0]);
    const SN = ['ARCADE', 'PRETZELS', 'PHOTO', 'LINDA LITE', 'ESPRESSO', 'FASCISM', 'R&D'];
    for (let i = 0; i < 7; i++) { const x = ((i * 74 - sx * .5) % 518 + 518) % 518 - 74; rectF(x, 46, 66, 120, T[1]); rectF(x + 6, 76, 54, 64, T[2]); rectF(x, 50, 66, 12, T[3]); text(SN[i], x + 33 - SN[i].length * 3, 53, T[0], 0); for (let k = 0; k < 3; k++) rectF(x + 10 + k * 17, 90, 11, 40, T[3]); }
    rectF(0, 166, W, H - 166, T[1]); for (let x = -(sx % 32); x < W; x += 32) rectF(x, 166, 16, H - 166, T[0]);
    for (let i = 0; i < 2; i++) { const x = ((i * 220 + 140 - sx * .9) % 440 + 440) % 440 - 60; for (let k = 0; k < 8; k++) rectF(x + k * 6, 196 - k * 5, 8, 3, T[3]); }
  } else if (z === 'red') { // SPOOKY GHOST: LIVE FROM BEYOND
    rectF(0, PY, W, H - PY, T[3]);
    for (let x = -((sx * .4) % 14); x < W; x += 14) { const sw = Math.round(Math.sin(t * .03 + x * .05) * 2); rectF(x + sw, PY, 7, 150, T[2]); }
    for (let k = 0; k < 2; k++) { const cx = 90 + k * 140 + Math.sin(t * .02 + k * 2) * 30; for (let y = PY; y < 190; y += 2) { const w = (y - PY) * .28 + 4; rectF(cx - w, y, w * 2, 1, (y >> 1) & 1 ? T[1] : T[2]); } }
    rectF(110, PY + 6, 100, 12, T[2]); text('LIVE FROM BEYOND', 113, PY + 9, T[0], 0);
    rectF(0, 190, W, H - 190, T[2]); for (let i = 0; i < 16; i++) { const x = ((i * 22 - sx * .7) % 352 + 352) % 352 - 16; circF(x, 196 + (i & 1) * 4, 7, T[3]); }
  } else { // the bargain bin aisle. the shelf where a generation goes when it's over
    rectF(0, PY, W, H - PY, T[0]);
    for (let r = 0; r < 4; r++) { const y = 40 + r * 40; rectF(0, y, W, 3, T[2]); for (let i = 0; i < 14; i++) { const x = ((i * 26 + r * 9 - sx * .5) % 364 + 364) % 364 - 26; rectF(x, y - 18, 16, 18, T[1]); rectF(x + 2, y - 15, 12, 5, T[0]); if ((i + r) % 3 === 0) { rectF(x + 3, y - 8, 12, 6, T[3]); text('$', x + 4, y - 8, T[0], 0); } } }
    rectF(0, 200, W, 24, T[1]); if ((t >> 6) % 5) rectF(100, PY, 120, 2, T[2]);
  }
}
// COOTERS: smoke in front of the mall, while the segment lasts
function cootersOver(S) {
  if (!SH.stage.smoke) return;
  for (let i = 0; i < 9; i++) { const x = ((i * 47 - S.sx * .7 + Math.sin(S.t * .01 + i) * 20) % 400 + 400) % 400 - 40, y = 40 + (i * 53) % 150; rectA(x, y, 46, 22, hex('#36122a'), .35); rectA(x + 8, y - 6, 30, 10, hex('#49243a'), .3); }
  if ((S.t >> 5) & 1) { rectF(6, PY + 4, 54, 11, hex('#490024')); text('COOTERS', 9, PY + 6, hex('#ff6db6'), 0); }
}

// ================= ENEMIES =================
const heartShot = (b, x, y) => { const c = b.c || hex('#ff6db6'); rectF(x - 3, y - 2, 3, 3, c); rectF(x + 1, y - 2, 3, 3, c); rectF(x - 2, y + 1, 5, 2, c); pset(x, y + 3, c); };
const cartShot = (b, x, y) => { const T = TONE4[b.z || 'gray']; rectF(x - 5, y - 6, 11, 12, T[2]); rectF(x - 4, y - 5, 9, 4, T[0]); rectF(x - 5, y + 4, 11, 2, T[3]); };
const priceShot = (b, x, y) => { rectF(x - 7, y - 4, 15, 8, hex('#ffdb24')); frameRect(x - 7, y - 4, 15, 8, hex('#b62424')); text(b.p || '$', x - 6, y - 3, hex('#b62424'), 0); };
Object.assign(FOES, {
  // ---- four shades: carl's cartridge ----
  tumble: { base: { hp: 2, r: 7, pts: 40, drop: 1 },
    upd(e) { e.x -= 2.4; e.y = 182 - Math.abs(Math.sin(e.t * .09)) * 26; },
    draw(e) { const T = TONE4.dmg, c = e.fl ? WHITE : T[2]; ringF(e.x, e.y, 7, c); ringF(e.x, e.y, 4, c); lineF(e.x - 6, e.y, e.x + 6, e.y + Math.sin(e.t * .3) * 4, c); } },
  tape: { base: { hp: 3, r: 7, pts: 60, drop: 2 },
    init(e) { e.y0 = e.y; e.ph = e.ph || 0; if (e.gold) e.hp = 6; },
    upd(e) { e.x -= 1.5; e.y = e.y0 + Math.sin((e.t + e.ph) * .05) * 22; if (!e.gold && every(e, 110, 40)) aim(e, 1.7, { c: TONE4.dmg[3] }); },
    draw(e) { const T = TONE4.dmg, x = e.x - 9, y = e.y - 6, c = e.fl ? WHITE : e.gold ? hex('#ffdb24') : T[2]; rectF(x, y, 18, 12, c); rectF(x + 3, y + 3, 12, 5, T[0]); circF(x + 6, y + 5, 1, T[3]); circF(x + 12, y + 5, 1, T[3]); if (e.gold) text('?', x + 7, y + 2, T[3], 0); } },
  cactus: { base: { hp: 7, r: 8, pts: 90, drop: 2 },
    init(e) { e.hit = [[0, -12, 6], [0, 2, 7]]; },
    upd(e) { e.x -= .8; if (e.x < 310 && every(e, 75, 20)) { for (const a of [-.5, -1, -1.5]) eshot(e.x, e.y - 20, Math.cos(Math.PI + a) * 1.7, Math.sin(Math.PI + a) * 1.7, { c: TONE4.dmg[3], r: 2.5 }); } },
    draw(e) { const T = TONE4.dmg, c = e.fl ? WHITE : T[3]; rectF(e.x - 3, e.y - 26, 7, 34, c); rectF(e.x - 10, e.y - 16, 7, 4, c); rectF(e.x - 10, e.y - 24, 3, 9, c); rectF(e.x + 4, e.y - 10, 7, 4, c); rectF(e.x + 8, e.y - 20, 3, 11, c); } },
  haze: { base: { hp: 5, r: 10, pts: 70, drop: 3 },
    upd(e) { e.x -= .9; e.y += Math.sin(e.t * .02) * .4; if (e.x < 300 && every(e, 120, 60)) ring(e, 7, 1.1, { c: TONE4.dmg[2], r: 3 }, e.t * .1); },
    draw(e) { const T = TONE4.dmg, c = e.fl ? WHITE : T[1]; for (const [ox, oy, r] of [[-7, 2, 7], [6, 0, 8], [0, -6, 7]]) circF(e.x + ox, e.y + oy, r, c); circF(e.x - 2, e.y, 3, T[2]); } },
  // ---- four shades: linda's cartridge ----
  mallgoer: { base: { hp: 2, r: 6, pts: 40, drop: 1 },
    init(e) { e.sp = .6 + Math.random() * .6; },
    upd(e) { e.x -= e.sp; e.y += Math.sign(PLR.y - e.y) * .2; if (every(e, 140, 50) && e.x < 300) aim(e, 1.6, { draw: heartShot, c: TONE4.pink[2], r: 3 }); },
    draw(e) { const T = TONE4.pink, c = e.fl ? WHITE : T[2]; rectF(e.x - 4, e.y - 2, 9, 14, c); circF(e.x, e.y - 7, 5, T[1]); rectF(e.x - 5, e.y - 12, 11, 4, T[3]); rectF(e.x + 5, e.y + 2, 5, 6, T[3]); } },
  espresso: { base: { hp: 3, r: 6, pts: 70, drop: 2 },
    upd(e) { if (e.t < 45) { e.x -= 1; e.y += Math.sin(e.t * .2); } else { if (!e.vx) { const [vx, vy] = aimAt(e.x, e.y, 3.6); e.vx = vx; e.vy = vy; sfx('jump'); } e.x += e.vx; e.y += e.vy; } },
    draw(e) { const T = TONE4.pink, c = e.fl ? WHITE : T[3]; rectF(e.x - 5, e.y - 3, 10, 9, c); rectF(e.x + 5, e.y - 1, 3, 4, c); rectF(e.x - 4, e.y - 3, 8, 2, T[1]); if (e.t < 45 && (e.t >> 3) & 1) { pset(e.x - 2, e.y - 7, T[2]); pset(e.x + 1, e.y - 9, T[2]); } } },
  tenant: { base: { hp: 10, r: 10, pts: 160, drop: 3 },
    init(e) { e.box = [40, 18]; e.nm = pick(['SALE', 'LEASE ME', 'GRAND OPENING', 'NOW HIRING']); },
    upd(e) { e.x -= .7; if (e.x < 300 && every(e, 80, 30)) { const b = aim(e, 1.5, { k: 'coupon', r: 3.5 }); if (b) b.upd = bb => { if (bb.t < 50) { const [vx, vy] = aimAt(bb.x, bb.y, 1.5); bb.vx += (vx - bb.vx) * .05; bb.vy += (vy - bb.vy) * .05; } bb.x += bb.vx; bb.y += bb.vy; }; } },
    draw(e) { const T = TONE4.pink, x = e.x - 20, y = e.y - 9; rectF(x, y, 40, 18, e.fl ? WHITE : T[3]); frameRect(x, y, 40, 18, T[1]); text(e.nm.slice(0, 6), x + 20 - Math.min(6, e.nm.length) * 3, y + 6, T[0], 0); rectF(x + 18, e.flip ? y + 18 : y - 10, 4, 10, T[2]); } },
  // ---- four shades: ghost's cartridge ----
  guest: { base: { hp: 3, r: 6, pts: 50, drop: 2 },
    init(e) { e.y0 = e.y; },
    upd(e) { if (e.benign) { e.y -= .9; e.x -= .5; return; } e.x -= 1.1; e.y = e.y0 + Math.sin(e.t * .04) * 14; if (every(e, 120, 40)) aim(e, 1.8, { c: TONE4.red[1] }); },
    draw(e) { const T = TONE4.red, c = e.fl ? WHITE : e.benign ? T[0] : T[1]; circF(e.x, e.y - 6, 5, c); rectF(e.x - 5, e.y - 1, 11, 11, c); rectF(e.x - 2, e.y - 7, 2, 2, T[3]); rectF(e.x + 1, e.y - 7, 2, 2, T[3]); if (e.benign && (e.t >> 3) & 1) { rectF(e.x - 9, e.y, 3, 3, T[0]); rectF(e.x + 7, e.y, 3, 3, T[0]); } },
    die(e) { e.gone = false; e.benign = 1; e.hp = 1; sfx('crowd'); SH.fx.push({ k: 'txt', x: e.x - 12, y: e.y - 20, s: pick(['CLAP', 'CLAP CLAP', 'BRAVO', 'WOO']), t: 50, c: TONE4.red[0] }); } },
  cue: { base: { hp: 5, r: 9, pts: 90, drop: 2 },
    init(e) { e.box = [30, 20]; e.msg = pick(['APPLAUSE', 'LAUGH', 'GASP', 'BOO']); },
    upd(e) { e.x -= .8; if (e.x < 300 && every(e, 70, 25)) { const s = e.msg; for (let i = 0; i < Math.min(4, s.length); i++) eshot(e.x - 10, e.y, -1.4 - i * .25, (i - 1.5) * .35, { k: 'letter', ch: s[i], r: 4 }); } },
    draw(e) { const T = TONE4.red, x = e.x - 15, y = e.y - 10; rectF(x, y, 30, 20, e.fl ? WHITE : T[0]); frameRect(x, y, 30, 20, T[2]); text(e.msg.slice(0, 4), x + 3, y + 7, T[3], 0); } },
  // a cartridge's save file, flying loose. shoot it free; catch it.
  cartsave: { base: { hp: 12, r: 9, pts: 400, drop: 0, keep: 1 },
    init(e) { e.y0 = e.y; },
    upd(e) { e.x -= e.x > 250 ? 1.2 : .25; e.y = e.y0 + Math.sin(e.t * .03) * 40; if (e.x < -40) e.gone = true; },
    draw(e) { const T = TONE4[e.z], x = e.x - 10, y = e.y - 10; rectF(x, y, 20, 20, e.fl ? WHITE : T[2]); rectF(x + 3, y, 12, 7, T[0]); rectF(x + 4, y + 11, 12, 9, T[1]); text('S', x + 7, y + 12, T[3], 0); if ((e.t >> 4) & 1) frameRect(x - 2, y - 2, 24, 24, T[3]); },
    die(e) { SH.items.push({ k: 'save', x: e.x, y: e.y, vx: -.2, vy: 0, t: 0, ch: e.ch, z: e.z }); } },
  // ---- mid-boss: THE AUDITOR (linda's old cartridge) ----
  auditor: { base: { hp: 160, r: 22, pts: 6000, drop: 0, boss: 1, name: 'THE AUDITOR' },
    init(e) { e.box = [44, 64]; },
    upd(e) { if (e.dying) return dieSeq(e, () => comm('CEO LINDA', 'You audited my auditor. I\'ll allow it. Once.', 120)); if (e.t < 80) { e.x += (244 - e.x) * .04; return; }
      e.y = 112 + Math.sin(e.t * .02) * 46; const p = (e.t >> 8) % 3, T = TONE4.pink;
      if (p === 0 && every(e, 70)) for (let c = 0; c < 4; c++) for (let r = 0; r < 3; r++) eshot(e.x - 30 - c * 14, e.y - 30 + r * 30, -1.3, 0, { k: 'letter', ch: '$', r: 4 });
      if (p === 1 && every(e, 9)) eshot(e.x - 20, e.y, -2.6, Math.sin(e.t * .07) * 1.4, { c: T[3] });
      if (p === 2 && every(e, 60)) { const b = aim(e, 1.4, { k: 'big', r: 9, c: T[3], draw: (bb, x, y) => { rectF(x - 17, y - 6, 34, 12, T[0]); frameRect(x - 17, y - 6, 34, 12, T[3]); text('AUDIT', x - 15, y - 3, T[3], 0); } }); if (b) b.upd = bb => { bb.x += bb.vx; bb.y += bb.vy; if (bb.t === 70) { for (const ch of '1099') eshot(bb.x, bb.y, -1 - Math.random(), Math.random() * 2 - 1, { k: 'letter', ch, r: 4 }); bb.dead = 1; } }; } },
    draw(e) { const T = TONE4.pink, f = e.fl && (e.t & 1) ? WHITE : 0, x = e.x, y = e.y; rectF(x - 18, y - 6, 36, 40, f || T[2]); circF(x, y - 18, 13, f || T[1]); rectF(x - 12, y - 22, 24, 6, T[3]); rectF(x - 10, y - 21, 20, 4, (e.t >> 3) & 1 ? T[0] : T[1]); rectF(x - 34, y + 2, 20, 26, T[0]); for (let i = 0; i < 5; i++) rectF(x - 32, y + 5 + i * 4, 16, 1, T[3]); text('LEDGER', x - 38, y + 30, T[3], 0); } },
  // ---- boss: THE BARGAIN BIN ----
  bargain: { base: { hp: 420, r: 34, pts: 25000, drop: 0, boss: 1, name: 'THE BARGAIN BIN' },
    init(e) { e.box = [100, 80]; e.ph0 = 0; },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s45Boss)); if (e.t < 100) { e.x += (240 - e.x) * .035; return; }
      const t = e.t, p = e.hp > e.maxhp * .66 ? 0 : e.hp > e.maxhp * .33 ? 1 : 2; e.y = 116 + Math.sin(t * .014) * 30;
      if (p !== e.ph0) { e.ph0 = p; SH.eb = []; sfx('object'); banner(p === 1 ? 'MARKDOWN: $2.99' : 'EVERYTHING MUST GO: $0.99', 100); comm('THE BARGAIN BIN', p === 1 ? 'MARKDOWN. NOBODY WANTS LAST YEAR.' : 'EVERYTHING MUST GO. EVERYTHING ALWAYS GOES.', 120); }
      const price = ['$5', '$3', '$1'][p], Z = ['dmg', 'pink', 'red', 'gray'];
      if (every(e, p === 2 ? 38 : 55)) for (let i = 0; i < 3 + p; i++) eshot(e.x - 40, e.y - 30, -1.4 - Math.random() * 1.2, -2.2 - Math.random() * 1.4, { draw: cartShot, z: Z[rnd(4)], r: 5, upd: b => { b.vy += .045; b.x += b.vx; b.y += b.vy; } });
      if (p >= 1 && every(e, 80, 30)) ring(e, 8 + p, 1.5, { draw: priceShot, p: price, r: 4 }, t * .05);
      if (p === 2 && every(e, 10)) { const a = t * .12; eshot(e.x, e.y, Math.cos(a) * 1.8, Math.sin(a) * 1.8, { c: TONE4.gray[3] }); }
      if (every(e, 100, 50)) fan(e, 3, 2.2, .2, { draw: priceShot, p: price, r: 4 }); },
    draw(e) { const T = TONE4.gray, f = e.fl && (e.t & 1) ? WHITE : 0, x = e.x, y = e.y, t = e.t;
      for (let j = -36; j < 40; j += 6) { const w = 46 + j * .18; lineF(x - w, y + j, x + w, y + j, f || T[2]); }
      for (let i = -44; i <= 44; i += 8) lineF(x + i, y - 36, x + i * .8, y + 40, f || T[2]);
      const C = [['CARL', 'dmg'], ['LINDA', 'pink'], ['GHOST', 'red'], ['FACE', 'dmg'], ['???', 'gray']];
      C.forEach(([n, z], i) => { const Z = TONE4[z], cx = x - 40 + i * 19, cy = y - 42 + ((i + (t >> 5)) & 1) * 3; rectF(cx, cy, 16, 20, Z[2]); rectF(cx + 2, cy + 2, 12, 7, Z[0]); text(n.slice(0, 2), cx + 2, cy + 11, Z[0], 0); });
      rectF(x + 14, y + 6, 36, 16, hex('#ffdb24')); frameRect(x + 14, y + 6, 36, 16, hex('#b62424')); text(['$4.99', '$2.99', '$0.99'][e.ph0], x + 17, y + 11, hex('#b62424'), 0);
    } },
  // ---- COOTERS (stage 2) ----
  bunny: { base: { hp: 4, r: 7, pts: 90, drop: 2 },
    init(e) { e.y0 = e.y; e.ph = rnd(60); },
    upd(e) { e.x -= 1; e.y = e.y0 + Math.sin((e.t + e.ph) * .05) * 12; if (e.x < 300 && every(e, 90, 30)) fan(e, 3, 1.8, .3, { draw: heartShot, r: 3 }); },
    draw(e) { const x = e.x, y = e.y, c = e.fl ? WHITE : hex('#101010'); rectF(x - 4, y - 2, 9, 14, c); circF(x, y - 7, 5, hex('#ffdbdb')); rectF(x - 5, y - 12, 11, 4, hex('#ff49b6')); rectF(x - 4, y - 20, 2, 8, c); rectF(x + 3, y - 20, 2, 8, c); rectF(x - 1, y + 12, 3, 3, WHITE); } },
  // a lavender figure in the corner of the bar. she doesn't shoot. she watches.
  eystatue: { base: { hp: 1, r: 1, pts: 0, drop: 0, benign: 1, keep: 1 },
    upd(e) { e.x -= 1; if (e.x < 220 && !e.said) { e.said = 1; story(statueScene); } if (e.x < -40) e.gone = true; },
    draw(e) { const x = e.x, y = e.y, glow = e.said && (SH.t >> 3) & 1; rectF(x - 6, y, 13, 22, hex('#6d49b6')); circF(x, y - 7, 7, hex('#dbb6ff')); rectF(x - 7, y - 15, 15, 6, hex('#492492')); rectF(x - 5, y - 24, 3, 10, hex('#6d49b6')); rectF(x + 3, y - 24, 3, 10, hex('#6d49b6')); rectF(x - 3, y - 8, 2, 2, glow ? hex('#24dbff') : hex('#492492')); rectF(x + 2, y - 8, 2, 2, glow ? hex('#24dbff') : hex('#492492')); text('DECORATION', x - 28, y + 26, hex('#6d6d92'), 0); } },
  bouncer: { base: { hp: 170, r: 26, pts: 7000, drop: 0, boss: 1, name: 'THE BOUNCER' },
    init(e) { e.box = [56, 84]; e.gap = 100; },
    upd(e) { if (e.dying) return dieSeq(e, () => comm('THE BOUNCER', '...YOU MAY ENTER.', 100)); if (e.t < 80) { e.x += (250 - e.x) * .04; return; }
      e.y = 112 + Math.sin(e.t * .016) * 30; const t = e.t;
      if (every(e, 110)) { e.gap = 40 + rnd(140); for (let y = PY + 6; y < H - 4; y += 10) if (Math.abs(y - e.gap) > 22) eshot(e.x - 30, y, -1.7, 0, { k: 'big', r: 4, c: hex('#b60024'), draw: (b, x, yy) => { rectF(x - 2, yy - 5, 4, 10, hex('#b60024')); rectF(x - 1, yy - 4, 2, 8, hex('#ff4949')); } }); comm('THE BOUNCER', pick(['ROPE.', 'BEHIND THE ROPE.', 'ONE AT A TIME.']), 60); }
      if (every(e, 45, 20)) fan(e, 5, 2, .22, { draw: heartShot, r: 3 });
      if (e.hp < e.maxhp / 2 && every(e, 30, 10)) aim(e, 2.8, { draw: heartShot, c: hex('#ffdb24'), r: 3 }); },
    draw(e) { const x = e.x, y = e.y, f = e.fl && (e.t & 1) ? WHITE : 0; rectF(x - 26, y - 14, 52, 58, f || hex('#101010')); rectF(x - 40, y - 8, 16, 40, f || hex('#101010')); rectF(x + 24, y - 8, 16, 40, f || hex('#101010')); circF(x, y - 26, 16, f || hex('#ffdbdb')); rectF(x - 16, y - 44, 32, 8, hex('#ff49b6')); rectF(x - 12, y - 64, 6, 22, hex('#101010')); rectF(x + 6, y - 64, 6, 22, hex('#101010')); rectF(x - 12, y - 30, 24, 5, hex('#101010')); text('LIST', x - 11, y + 2, hex('#ff6db6'), 0); rectF(x - 46, y + 30, 92, 3, hex('#b60024')); } },
  // ---- mid-boss: THE APPLAUSE SIGN (stage 3). it can only be hurt while it's lit ----
  applause: { base: { hp: 150, r: 20, pts: 6000, drop: 0, boss: 1, name: 'THE APPLAUSE SIGN' },
    init(e) { e.box = [96, 34]; e.lit = 0; },
    upd(e) { if (e.dying) return dieSeq(e, () => comm('FACE', 'I clapped. Somebody had to.', 100)); if (e.t < 70) { e.x += (230 - e.x) * .05; e.y = 60; return; }
      const cyc = e.t % 240; e.lit = cyc > 110; e.shield = !e.lit; e.y = 70 + Math.sin(e.t * .015) * 40;
      if (e.lit && every(e, 8)) eshot(e.x - 30 + rnd(60), e.y + 18, -1 - Math.random(), 1 + Math.random(), { k: 'letter', ch: pick(['C', 'L', 'A', 'P']), r: 4 });
      if (!e.lit && every(e, 50, 25)) ring(e, 12, 1.4, { c: hex('#ffdb92') }, e.t * .07);
      if (cyc === 111) { sfx('crowd'); banner('APPLAUSE', 50); } },
    draw(e) { const x = e.x - 48, y = e.y - 17, on = e.lit; rectF(x, y, 96, 34, e.fl && on && (e.t & 1) ? WHITE : hex('#240008')); frameRect(x, y, 96, 34, on ? hex('#ffdb24') : hex('#6d0012')); for (let i = 0; i < 12; i++) circF(x + 4 + i * 8, y + 3, 1, on && ((i + (SH.t >> 3)) & 1) ? hex('#ffdb24') : hex('#490012')); ctext2('APPLAUSE', e.x, y + 13, on ? hex('#ffdb24') : hex('#490012')); rectF(e.x - 1, PY, 2, y - PY, hex('#494949')); } },
  // ---- mid-boss: THE GAUGE (stage 4). the kid's potential gauge, the size of a wall ----
  gauge: { base: { hp: 200, r: 24, pts: 7000, drop: 0, boss: 1, name: 'THE GAUGE' },
    init(e) { e.box = [40, 150]; e.needle = 0; },
    upd(e) { if (e.dying) return dieSeq(e, () => comm('FACE', 'Zero percent. Good. Everybody relax. ...I feel like I should apologize to someone.', 130)); if (e.t < 60) { e.x += (270 - e.x) * .06; e.y = 112; return; }
      e.needle = Math.min(100, e.needle + .32); const n = e.needle;
      if (every(e, n > 60 ? 18 : 32)) aim(e, 2 + n / 60, { c: n > 60 ? hex('#ff9224') : hex('#ffdb24') }, Math.random() * .4 - .2);
      if (n > 60 && every(e, 50)) fan(e, 5, 1.8, .25, { c: hex('#ff2424') });
      if (n >= 100) { e.needle = 0; sfx('powerdown'); banner('ACCIDENT', 70); post.flash = .5; const gap = 50 + rnd(120); for (let y = PY + 4; y < H; y += 9) if (Math.abs(y - gap) > 24) eshot(W + 4, y, -2.2, 0, { c: hex('#ffdb24'), r: 4 }); } },
    draw(e) { const x = e.x - 20, y = e.y - 75, n = e.needle; rectF(x, y, 40, 150, e.fl && (e.t & 1) ? WHITE : hex('#242436')); frameRect(x, y, 40, 150, hex('#6d6d92'));
      for (let i = 0; i < 146; i++) { const k = i / 146; rectF(x + 4, y + 148 - i, 32, 1, k * 100 < n ? (k < .25 ? hex('#50a050') : k < .6 ? hex('#f8d020') : k < .9 ? hex('#f88020') : hex('#f82020')) : hex('#12121a')); }
      rectF(x - 4, y + 148 - 146 * .6, 48, 2, WHITE); text('60%', x - 22, y + 56, WHITE, 0); text(Math.round(n) + '%', x + 6, y - 10, n > 90 && (SH.t >> 2) & 1 ? hex('#ff2424') : WHITE, 0); text('POTENTIAL', x - 8, y + 154, hex('#80d0f8'), 0); } },
});

// ================= STORY =================
async function s45Intro() {
  await wait(20);
  await say('(GHOST\'S FORMULAS RUN BACKWARDS TOO. THE MACHINE CAN TRAVEL BETWEEN GENERATIONS.)');
  await say('Before memory, I need everyone\'s memories. Every save file from the last generation.', FF);
  await say('If I\'m carrying everybody across, I start with the ones who already got left behind.', FF);
  await say('They\'re on cartridges. A cartridge keeps its save with a little battery.', YK);
  await say('And batteries...', FF);
  await say('Die.', YK);
  await say('Then we\'d better hurry.', FF, { port: CAST.mood.FACE.talk });
  await say('(THE LAST GENERATION. FOUR SHADES. HE IS THE ONLY THING IN COLOR, AND IT FEELS RUDE.)');
  await say('Oh. It\'s all... green. I thought it would feel smaller. It feels like it\'s been waiting.', FF);
  await tip('EACH CARTRIDGE HAS ITS SAVE FILE FLYING AROUND IN IT. SHOOT IT FREE, THEN CATCH IT: THAT\'S A BACKUP FOR EVERYONE IN THAT GAME.');
}
const CARTS4 = { dmg: ['CARL', 'ABOVE & BELOW NEVADA', '1998'], pink: ['CEO LINDA', 'THE MALL OF THE FUTURE', '1999'], red: ['SPOOKY GHOST', 'LIVE FROM BEYOND', '2000'], gray: ['THE BARGAIN BIN', 'PRE-OWNED. NO RETURNS.', '????'] };
const zoneSwap = z => async () => {
  const [n, sub, yr] = CARTS4[z], T = TONE4[z]; let t = 0;
  sfx('door'); SH.eb = []; for (const e of SH.ents) if (!e.boss && !e.keep) e.gone = true;
  SH.overlay = () => { rectF(0, PY, W, H - PY, BLACK); const y = 60 + Math.max(0, 40 - t * 2); rectF(100, y, 120, 96, T[2]); rectF(108, y + 8, 104, 40, T[0]); frameRect(100, y, 120, 96, T[1]); ctext(n, y + 14, T[3]); ctext(sub, y + 26, T[3]); text(yr, 192, y + 36, T[3], 0); for (let i = 0; i < 8; i++) rectF(110 + i * 13, y + 86, 8, 10, hex('#b6926d')); if (t > 30) ctext(z === 'gray' ? 'NOW READING: SOMETHING ELSE' : 'NOW READING: ' + n, 176, (t >> 3) & 1 ? T[0] : WHITE); };
  for (; t < 90; t++) await nextFrame();
  SH.overlay = null; SH.stage.zone = z; LEGACY_AUDIO = z !== 'gray';
  if (z === 'pink') comm(FF, 'Next cartridge. They really do click when you put them in. I didn\'t know that. I remember it anyway.', 140);
  if (z === 'red') comm(FF, 'Ghost\'s first show. He looks exactly the same. He\'s a sheet. Sheets don\'t age.', 120);
  if (z === 'gray') { music('boss'); comm(YK, 'That isn\'t a cartridge.', 80); }
};
async function s45MidIntro() {
  music('boss');
  await say('(AN AUDITOR. FOUR SHADES OF PINK. IT HAS BEEN WAITING TO AUDIT SOMEONE SINCE 1999.)');
  await say('UNREGISTERED ASSET DETECTED. YOU.', 'THE AUDITOR');
  await say('I\'m not an asset. I\'m a guest.', FF);
  await say('GUESTS ARE A LIABILITY. LIABILITIES ARE AUDITED.', 'THE AUDITOR');
}
async function s45BossIntro() {
  await say('(THE LAST AISLE. A WIRE BIN UNDER A FLICKERING LIGHT. A HANDWRITTEN SIGN: "PRE-OWNED. NO RETURNS.")');
  await say('(IT\'S FULL OF CARTRIDGES. SOME OF THEM ARE STILL ON.)');
  await say('No. Absolutely not. Not this time.', FF, { port: CAST.mood.FACE.skeptic });
  await say('EVERYTHING ENDS UP HERE. $4.99.', 'THE BARGAIN BIN');
  await say('They\'re not for sale.', FF);
  await say('EVERYTHING IS FOR SALE ONCE NOBODY\'S PLAYING IT.', 'THE BARGAIN BIN');
  await say('I\'m playing it.', FF, { port: CAST.mood.FACE.talk });
}
async function s45Boss() {
  music('lab'); LEGACY_AUDIO = false;
  const n = (FSAVE.saves || []).length;
  await say('(THE BIN TIPS OVER. CARTRIDGES EVERYWHERE. HE CATCHES AS MANY AS HE CAN. HE HAS HANDS NOW.)');
  await say('Got you. Got all of— most of you. Got you.', FF);
  if (n >= 3) await say('Three save files. Carl\'s. Linda\'s. Ghost\'s. Every hour anybody ever spent in them.', FF);
  else { await say(n ? 'Some of the saves got away. I\'ll come back for them. Yoko, can I come back for them?' : 'The saves got away. All of them. I was busy shooting a bin.', FF); await say('Not on this trip.', YK); }
  await say('They\'re still in four shades.', YK);
  await say('I can carry them. I can\'t change what they are. Not yet.', FF);
  await say('Did you ask them if they want to be changed?', YK);
  await wait(30);
  await say('...Everyone wants color.', FF);
  await say('Ask them.', YK);
  await say('Later. After. Everything\'s after.', FF, { port: CAST.mood.FACE.squint });
  await stageEnd();
}
async function statueScene() {
  await say('(IN THE CORNER OF THE BAR: A LAVENDER FIGURE IN A BUNNY OUTFIT. A SMALL CARD SAYS "DECORATION.")');
  await say('Welcome to Cooters. Can I help you? I can tell you need help.', '???');
  await say('Is that— no. That\'s a decoration.', FF);
  await say('...It\'s a decoration.', YK);
  await say('It said "help."', FF);
  await say('Everything in this mall says "help." Keep moving.', YK, { port: YOKO_TRUE });
}
async function s2MidIntro() {
  music('boss');
  await say('(COOTERS. A SMOKY BAR WITH A VELVET ROPE. THE BOUNCER IS A LINDA. A VERY LARGE ONE.)');
  await say('NAME.', 'THE BOUNCER');
  await say('Face.', FF);
  await say('NOT ON THE LIST.', 'THE BOUNCER');
  await say('I\'m on every list. I\'m usually the list.', FF);
  await say('THE ROPE GOES WHERE THE ROPE GOES. FIND THE GAP.', 'THE BOUNCER');
}
async function s3MidIntro() {
  music('boss');
  await say('(A SIGN DROPS FROM THE RAFTERS. "APPLAUSE." IT LIGHTS UP. NOBODY CLAPS.)');
  await say('An applause sign. In a haunted broadcast. Who\'s it for?', FF);
  await say('Whoever\'s left.', YK);
  await tip('THE SIGN CAN ONLY BE HURT WHILE IT\'S LIT. WHEN IT GOES DARK, DODGE.');
}
async function s4MidIntro() {
  music('boss');
  await say('(A POTENTIAL GAUGE THE SIZE OF A WALL. THE NEEDLE IS CLIMBING.)');
  await say('That\'s the kid\'s gauge. From his game. It measures how badly he— it measures potential.', FF);
  await say('Don\'t let it hit a hundred.', YK);
  await say('What happens at a hundred?', FF);
  await say('Ask him.', YK);
}
async function cootersIn() { SH.stage.smoke = 1; music('cooters'); comm(FF, 'Cooters. It smells like 1998 in here. Everything in this mall smells like 1998.', 120); }
async function cootersOut() { SH.stage.smoke = 0; music(SH.stage.music); }

// ================= THE TIMELINES =================
STG_FACE[45] = { id: 45, title: 'FOUR SHADES', sub: 'THE LAST GENERATION', music: 's45', bg: bgFour, zone: 'dmg', ideaLine: ['What if the old generation had potential too? It does. It\'s just quieter.', 'Four shades. Plenty of room for ideas.'],
  over(S) { const n = (FSAVE.saves || []).length; text('SAVES ' + n + '/3', 4, PY + 4, n >= 3 ? hex('#ffdb24') : WHITE, BLACK); },
  events: tl((at, gate) => {
    at(1, () => { SH.stage.zone = 'dmg'; LEGACY_AUDIO = true; });
    at(2, () => story(s45Intro));
    for (let i = 0; i < 10; i++) at(60 + i * 36, () => spawn('tumble', RIGHT, 182));
    for (let i = 0; i < 6; i++) at(200 + i * 40, () => spawn('tape', RIGHT, 50 + i * 20, { ph: i * 10 }));
    at(500, () => spawn('cactus', RIGHT, 170)); at(620, () => spawn('cactus', RIGHT + 30, 178));
    for (let i = 0; i < 4; i++) at(700 + i * 60, () => spawn('haze', RIGHT, 50 + rnd(80)));
    at(820, () => comm('CARL', 'Face? You\'re in MY game? Bro. Wipe your feet. ...You don\'t have feet.', 130));
    at(900, () => spawn('cartsave', RIGHT, 90, { z: 'dmg', ch: 'CARL' }));
    for (let i = 0; i < 8; i++) at(1000 + i * 24, () => spawn('tape', RIGHT, 30 + i * 20));
    at(1060, () => spawn('tape', RIGHT, 110, { gold: 1, item: 'backup' }));
    at(1100, () => comm('CARL', 'That\'s my save! Careful. There\'s like nine hours on there. Nine hours of parking.', 120));
    at(1150, () => spawn('cactus', RIGHT, 170)); at(1220, () => spawn('cactus', RIGHT, 176));
    at(1360, () => story(zoneSwap('pink')));
    for (let i = 0; i < 10; i++) at(1420 + i * 30, () => spawn('mallgoer', RIGHT, 40 + ((i * 37) % 150)));
    at(1500, () => spawn('tenant', RIGHT, 50)); at(1600, () => spawn('tenant', RIGHT, 176, { flip: 1 }));
    for (let i = 0; i < 6; i++) at(1650 + i * 50, () => spawn('espresso', RIGHT, 40 + rnd(140)));
    at(1800, () => comm('CEO LINDA', 'You\'re in my mall without a lease. Take the save. Leave the inventory.', 120));
    at(1900, () => spawn('cartsave', RIGHT, 110, { z: 'pink', ch: 'CEO LINDA' }));
    at(1960, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 70, vx: -1, vy: 0, t: 0 }));
    at(2050, () => story(s45MidIntro));
    at(2051, () => { SH.boss = spawn('auditor', RIGHT + 40, 112); });
    gate(2052, () => !alive('auditor'));
    at(2100, () => music('s45'));
    at(2150, () => story(zoneSwap('red')));
    for (let i = 0; i < 8; i++) at(2220 + i * 40, () => spawn('guest', RIGHT, 40 + ((i * 29) % 150)));
    for (let i = 0; i < 4; i++) at(2400 + i * 90, () => spawn('cue', RIGHT, 60 + (i % 2) * 80));
    at(2500, () => comm('SPOOKY GHOST', 'Hold on. This is the OLD show. Don\'t look at the old show. The lighting was terrible. I looked great.', 140));
    at(2600, () => spawn('sigil', RIGHT, 110));
    at(2700, () => spawn('cartsave', RIGHT, 70, { z: 'red', ch: 'SPOOKY GHOST' }));
    for (let i = 0; i < 10; i++) at(2800 + i * 26, () => spawn('guest', RIGHT, 30 + rnd(160)));
    at(3000, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 150, vx: -1, vy: 0, t: 0 }));
    at(3050, () => sponsorAds(2));
    at(3220, () => story(zoneSwap('gray')));
    at(3260, () => story(s45BossIntro));
    at(3261, () => { SH.boss = spawn('bargain', RIGHT + 60, 112); });
    gate(3262, () => !alive('bargain'));
  }) };

// stages 2-4 gain a mid-boss each; stage 2 gains COOTERS. Spliced into the existing timelines.
function spliceEvents(id, build) { const extra = tl(build), L = STG_FACE[id].events; for (const e of extra) L.push(e); L.sort((a, b) => a[0] - b[0]); }
spliceEvents(2, (at, gate) => {
  at(1460, () => story(cootersIn));
  for (let i = 0; i < 8; i++) at(1480 + i * 45, () => spawn('bunny', RIGHT, 40 + ((i * 41) % 150)));
  at(1560, () => spawn('eystatue', RIGHT + 20, 168));
  at(1880, () => story(s2MidIntro));
  at(1881, () => { SH.boss = spawn('bouncer', RIGHT + 40, 112); });
  gate(1882, () => !alive('bouncer'));
  at(1940, () => story(cootersOut));
});
spliceEvents(3, (at, gate) => {
  at(1880, () => story(s3MidIntro));
  at(1881, () => { SH.boss = spawn('applause', RIGHT + 50, 60); });
  gate(1882, () => !alive('applause'));
  at(1890, () => music(SH.stage.music));
});
spliceEvents(4, (at, gate) => {
  at(1180, () => story(s4MidIntro));
  at(1181, () => { SH.boss = spawn('gauge', RIGHT + 30, 112); });
  gate(1182, () => !alive('gauge'));
  at(1190, () => music(SH.stage.music));
});
