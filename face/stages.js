'use strict';
// ================= FACE — stages: backgrounds, enemies, bosses, timelines =================
// timeline builder: at(frame, fn). gate(fn) holds stage time until fn() is true.
function tl(build) {
  const L = [], at = (t, fn) => L.push([t, fn]);
  const gate = (t, cond) => at(t, () => { if (!cond()) { SH.ev--; SH.t--; } });
  build(at, gate); return L.sort((a, b) => a[0] - b[0]);
}
const alive = k => SH.ents.some(e => e.k === k && !e.gone && !e.benign);
const every = (e, n, o = 0) => e.t % n === o;
const C = { mag: hex('#ff24db'), grn: hex('#6dff24'), yel: hex('#ffdb24'), cya: hex('#24dbff'), red: hex('#ff2424'), pink: hex('#ff6db6'), wht: WHITE };

// ================= BACKGROUNDS =================
function bgAir(S) { // the stream: brain, visualizer, studio floor
  skyD(PY, H, '#100024', '#360048');
  const t = S.t, bx = 200 - (S.sx * .08) % 420;
  for (const ox of [0, 420]) { const cx = bx + ox; ringF(cx, 90, 70 + Math.sin(t * .02) * 2, hex('#490049')); ringF(cx, 90, 52, hex('#360036')); for (let k = 0; k < 7; k++) { const a = k * .9 + t * .005; lineF(cx + Math.cos(a) * 20, 90 + Math.sin(a) * 18, cx + Math.cos(a + .6) * 60, 90 + Math.sin(a + .6) * 50, hex('#490049')); } }
  for (let i = 0; i < 34; i++) { const x = ((i * 10 - S.sx * .5) % 340 + 340) % 340 - 10, h = 18 + Math.abs(Math.sin(t * .09 + i * .7)) * 38 + (i % 5) * 4; for (let y = 0; y < h; y += 3) rectF(x, 196 - y, 7, 2, mix(C.grn, C.mag, y / 60)); }
  rectF(0, 197, W, 27, hex('#0a0014'));
  for (let i = -8; i < 9; i++) lineF(160 + i * 14, 197, 160 + i * 60 - ((S.sx * 2) % 60), 224, hex('#490092'));
  for (let y = 199; y < 224; y += (y - 190) / 4 + 1) rectF(0, y | 0, W, 1, hex('#240049'));
  if ((t >> 5) & 1) { rectF(8, PY + 4, 34, 11, hex('#b60000')); text('ON AIR', 10, PY + 6, WHITE, 0); }
}
const STORES = [['PROP PILLS', '#24b6ff'], ['PRETZELS', '#ffb624'], ['BONG EMPORIUM', '#6dff24'], ['GARF\'S DINER', '#ff9224'], ['SUITORS', '#b692ff'], ['LOST+FOUND', '#ffffff'], ['COOTERS', '#ff2449'], ['YOKO LIMITED', '#92ffff'], ['LINDA', '#ff6db6']];
function bgMall(S) {
  skyD(PY, H, '#002436', '#360048');
  for (let i = 0; i < 12; i++) { const x = ((i * 60 - S.sx * .25) % 720 + 720) % 720 - 60; rectF(x, 30, 50, 34, hex('#12304a')); rectF(x + 4, 34, 42, 20, hex('#243d6d')); rectF(x, 64, 50, 2, hex('#49496d')); }
  rectF(0, 66, W, 3, hex('#6d6d92')); for (let x = -(S.sx * .25) % 8; x < W; x += 8) rectF(x, 58, 1, 8, hex('#6d6d92'));
  for (let i = 0; i < 9; i++) {
    const [nm, c] = STORES[i], x = ((i * 110 - S.sx * .6) % 990 + 990) % 990 - 110, cc = hex(c);
    rectF(x, 76, 104, 110, hex('#1a1a30')); rectF(x + 6, 100, 92, 70, hex('#242449')); rectF(x + 6, 100, 92, 3, cc);
    rectF(x + 2, 80, 100, 14, BLACK); frameRect(x + 2, 80, 100, 14, (S.t >> 4) % 9 === i ? WHITE : cc);
    text(nm.slice(0, 16), x + 52 - nm.slice(0, 16).length * 3, 84, cc, 0);
    for (let k = 0; k < 3; k++) rectF(x + 14 + k * 28, 110, 20, 40, hex('#12122a'));
    if (nm === 'YOKO LIMITED' || nm === 'SUITORS') for (let k = 0; k < 3; k++) { const yx = x + 20 + k * 28; rectF(yx, 124, 8, 8, hex('#b66d49')); rectF(yx + 1, 126, 6, 5, hex('#ffdbb6')); rectF(yx, 132, 8, 12, hex('#9292db')); }
  }
  rectF(0, 186, W, 38, hex('#242436'));
  for (let x = -(S.sx % 24); x < W; x += 24) for (let y = 186; y < 224; y += 12) rectF(x + ((y / 12) & 1) * 12, y, 12, 12, hex('#2c2c48'));
  for (let i = 0; i < 6; i++) { const x = ((i * 70 - S.sx * .9) % 420 + 420) % 420 - 20, y = 176 + (i % 2) * 6; rectF(x, y, 6, 12, hex('#6d6d92')); rectF(x + 1, y - 5, 4, 5, hex('#b6b6b6')); }
}
function bgGhost(S) {
  skyD(PY, H, '#0c0004', '#50000e');
  circF(250 - (S.sx * .03) % 40, 60, 26, hex('#6d0012')); circF(250 - (S.sx * .03) % 40, 60, 22, hex('#920018'));
  for (let i = 0; i < 6; i++) { const x = ((i * 90 - S.sx * .2) % 540 + 540) % 540 - 40, h = 90 + (i * 37) % 50; for (let y = 0; y < h; y += 6) { const w = 4 + y * .18; lineF(x - w, 200 - y, x + w, 200 - y + 6, hex('#240008')); lineF(x + w, 200 - y, x - w, 200 - y + 6, hex('#240008')); } rectF(x - 1, 200 - h, 3, h, hex('#360010')); if ((S.t >> 5) & 1) rectF(x - 1, 196 - h, 3, 3, C.red); }
  for (let i = 0; i < 4; i++) { const y = 150 + i * 16 + Math.sin(S.t * .02 + i) * 4; rectA(0, y, W, 5, hex('#6d0024'), .25); }
  rectF(0, 200, W, 24, hex('#120004')); for (let x = -(S.sx % 32); x < W; x += 32) rectF(x, 200, 16, 2, hex('#360010'));
}
function bgGen(S) { // tunnel into the third generator
  cls(hex('#200018'));
  const vx = 300, vy = 118, t = S.t;
  for (let k = 0; k < 14; k++) { const z = ((k * 20 - t * 1.6) % 280 + 280) % 280, r = 6 + z * 1.4; const c = (k & 1) ? mix(hex('#ff24db'), hex('#ffdb24'), z / 280) : hex('#490036'); for (let a = 0; a < 64; a++) { const an = a / 64 * 6.283; pset(vx + Math.cos(an) * r * 1.3 - z * .9, vy + Math.sin(an) * r * .8, c); } }
  for (let i = 0; i < 20; i++) { const z = ((i * 31 + t * 3) % 300); lineF(vx - z * 1.1, vy + ((i * 29) % 90) - 45, vx - z * 1.1 - 12, vy + ((i * 29) % 90) - 45, hex('#ffdb24')); }
  if (SH.stage.gen) { rectF(0, PY, W, 6, hex('#6d6d24')); text(SH.stage.gen, 4, PY + 8, hex('#9bbc0f'), 0); }
}
const RAIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function bgDys(S) {
  skyD(PY, H, '#100010', '#3a001c');
  for (let i = 0; i < 40; i++) { const x = ((i * 53 - S.sx * .3) % 340 + 340) % 340 - 10, y = ((i * 37 + S.t * (.4 + (i % 3) * .3)) % 220) + PY; text(RAIN[(i * 7 + (S.t >> 6)) % 26], x, y, i % 4 ? hex('#490036') : hex('#6d2449'), 0); }
  rectF(0, 204, W, 20, hex('#240012')); for (let x = -(S.sx % 40); x < W; x += 40) rectF(x, 204, 20, 1, hex('#6d0049'));
}
function bgArchive(S) {
  skyD(PY, H, '#000814', '#002a44');
  for (let i = 0; i < 12; i++) { const x = ((i * 34 - S.sx * .7) % 408 + 408) % 408 - 30; rectF(x, 0, 2, H, hex('#003048')); for (const y of [40, 90, 140]) { rectF(x - 14, y + 18, 32, 3, hex('#244a6d')); const hue = (i * 3 + y) % 5; rectF(x - 9, y - 2, 14, 20, hex('#122436')); frameRect(x - 9, y - 2, 14, 20, hex('#49b6db')); rectF(x - 6, y + 3, 8, 9, hue === 0 ? hex('#6d0000') : hex('#001224')); rectF(x - 5, y + 5, 2, 1, hue === 0 ? C.red : C.mag); rectF(x - 1, y + 5, 2, 1, hue === 0 ? C.red : C.mag); rectF(x - 4, y + 9, 4, 1, C.grn); } }
  for (let i = 0; i < 10; i++) { const x = (i * 41 + 7) % W, y = ((S.t * 2 + i * 50) % 260) - 20; rectF(x, y, 1, 14, hex('#49dbff')); }
  rectF(0, 206, W, 18, hex('#00121c'));
}

// ================= ENEMIES =================
const CHATS = ['FIRST', 'LOL', 'W', 'FACE???', 'POG', 'HI FACE', '?', 'CLIP IT', 'NICE', '+1', 'LOUDER', 'WHO IS THIS', 'F', 'NEW FACE?', 'KEKW', 'HYPE', 'OMG', 'LORE', 'YOKO?', 'WHERES CARL'];
const HOSTILE = ['L', 'RATIO', 'CAP', 'MODS', 'TELL GHOST', 'YOU FELL OFF', 'NOT MY FACE'];
const USERC = ['#ff6db6', '#6dff24', '#24dbff', '#ffdb24', '#ff9224', '#b692ff'];
function drawTV(x, y, w, h, c) { rectF(x, y, w, h, hex('#242424')); rectF(x + 3, y + 3, w - 6, h - 6, c); frameRect(x, y, w, h, hex('#6d6d6d')); }
const FOES = {
  // ---- stage 1: the stream ----
  bolt: { base: { hp: 7, r: 7, pts: 150, drop: 3, keep: 1, harmless: 1 },
    upd(e) { if (every(e, 80, e.ph || 0)) aim(e, 1.5); },
    draw(e) { const c = e.fl ? WHITE : C.mag; circF(e.x, e.y, 6, c); circF(e.x, e.y, 4, hex('#240049')); lineF(e.x - 3, e.y - 3, e.x + 3, e.y + 3, c); lineF(e.x + 3, e.y - 3, e.x - 3, e.y + 3, c); },
    die() { if (!SH.ents.some(x => x.k === 'bolt' && !x.gone)) story(s1Breakout); } },
  chat: { base: { hp: 1, r: 5, pts: 20, drop: 1 },
    init(e) { e.msg = e.msg || pick(e.hostile ? HOSTILE : CHATS); if (HOSTILE.includes(e.msg)) { e.hostile = 1; e.hp = 3; } e.u = pick(USERC); e.w = e.msg.length * 6 + 6; e.box = [e.w, 11]; e.ph = rnd(60); },
    upd(e) { e.x -= e.spd || 1.3; e.y += Math.sin((e.t + e.ph) * .05) * .5; if (e.hostile && every(e, 100, 30)) aim(e, 1.9); if (e.snitch && e.x < 170 && !e.said) { e.said = 1; story(snitchScene); } },
    draw(e) { const x = Math.round(e.x - e.w / 2), y = Math.round(e.y - 6); rectF(x, y, e.w, 11, e.fl ? WHITE : e.hostile ? hex('#490012') : hex('#12122a')); frameRect(x, y, e.w, 11, hex(e.u)); rectF(x + 3, y + 11, 3, 2, hex(e.u)); text(e.msg, x + 3, y + 2, e.hostile ? hex('#ff6d6d') : WHITE, 0); } },
  cam: { base: { hp: 5, r: 7, pts: 60, drop: 2 },
    upd(e) { if (e.t < 60) e.x += (e.tx - e.x) * .06; else if (e.t > 260) { e.x -= 2; e.y -= .6; } e.y += Math.sin(e.t * .06) * .4; if (e.t > 40 && e.t < 260 && every(e, 70, 20)) fan(e, 3, 2, .22, { c: C.cya }); },
    draw(e) { drawE(e, FS.cam[(e.t >> 3) & 1], e.x - 9, e.y - 6, FP.cam); } },
  popup: { base: { hp: 6, r: 10, pts: 80, drop: 3 },
    init(e) { e.box = [32, 24]; },
    upd(e) { e.x -= .35; if (e.t > 20 && every(e, 90, 30)) { const b = aim(e, 1.4, { k: 'coupon', r: 3.5 }); if (b) b.upd = bb => { if (bb.t < 50) { const [vx, vy] = aimAt(bb.x, bb.y, 1.5); bb.vx += (vx - bb.vx) * .05; bb.vy += (vy - bb.vy) * .05; } bb.x += bb.vx; bb.y += bb.vy; }; } },
    draw(e) { const s = Math.min(1, e.t / 12), w = 32 * s | 0, h = 24 * s | 0, x = e.x - w / 2, y = e.y - h / 2; rectF(x, y, w, h, e.fl ? WHITE : hex('#f8f8f8')); rectF(x, y, w, 5, hex('#2449db')); rectF(x + w - 5, y, 5, 5, C.red); frameRect(x, y, w, h, BLACK); if (s >= 1) { text('BUY', x + 7, y + 8, C.red, 0); text('!', x + 25, y + 8, C.red, 0); rectF(x + 4, y + 17, 24, 3, hex('#ffdb24')); } } },
  lens: { base: { hp: 70, r: 18, pts: 2000, drop: 12, boss: 1, name: 'THE CAMERA' },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s1Midboss)); if (e.t < 80) { e.x += (250 - e.x) * .04; return; } e.y = 112 + Math.sin(e.t * .02) * 50; const p = (e.t >> 8) % 3;
      if (p === 0 && every(e, 45)) ring(e, 12, 1.5, { c: C.cya }, e.t * .1); if (p === 1 && every(e, 30)) fan(e, 5, 2.3, .16, { c: WHITE }); if (p === 2 && e.t % 256 > 60 && every(e, 6)) aim(e, 3, { c: C.yel }, Math.sin(e.t * .2) * .5); },
    draw(e) { const x = e.x, y = e.y, f = e.fl ? WHITE : 0; circF(x, y, 20, f || hex('#242424')); circF(x, y, 16, f || hex('#494949')); circF(x, y, 11, hex('#003048')); circF(x - 3, y - 3, 6, hex('#24dbff')); circF(x - 4, y - 4, 2, WHITE); rectF(x + 14, y - 26, 16, 10, hex('#242424')); if ((e.t >> 4) & 1) { circF(x + 22, y - 21, 3, C.red); } text('REC', x + 18, y - 38, C.red, 0); } },
  adboss: { base: { hp: 4, r: 40, pts: 5000, drop: 0, boss: 1, name: 'UNSKIPPABLE AD', keep: 1, shield: 1, harmless: 1, immune: 1, ghost: 1 },
    init(e) { e.box = [112, 96]; e.ad = 0; e.cd = 240; },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s1Boss)); if (e.t < 90) { e.x += (236 - e.x) * .05; return; }
      if (!e.skip) { if (--e.cd <= 0) { const corners = [[-40, -36], [40, -36], [-40, 36], [40, 36]], [ox, oy] = corners[(e.ad + rnd(4)) % 4]; e.skip = spawn('skip', e.x + ox, e.y + oy, { boss0: e, ox, oy }); comm('CEO LINDA', ['You can skip this one. You can\'t skip the next one.', 'SKIP. Yes. Skip. Everyone skips. Nobody leaves.', 'Skipping is engagement too.', 'Last one. This one is about you.'][e.ad], 120); } }
      const a = e.ad, r = e.t;
      if (a === 0 && every(e, 50)) fan(e, 5, 1.8, .2, { k: 'pill', r: 3 });
      if (a === 1 && every(e, 40)) ring(e, 10 + (r >> 6) % 3, 1.4, { c: C.pink }, r * .05);
      if (a === 2) { if (every(e, 70)) for (let i = 0; i < 3; i++) { const b = eshot(e.x - 50, e.y - 30 + i * 30, -1.2, 0, { k: 'coupon', r: 3.5 }); if (b) b.upd = bb => { if (bb.t < 70) { const [vx, vy] = aimAt(bb.x, bb.y, 1.8); bb.vx += (vx - bb.vx) * .04; bb.vy += (vy - bb.vy) * .04; } bb.x += bb.vx; bb.y += bb.vy; }; } if (every(e, 25)) aim(e, 2.6, { k: 'pill', r: 3 }); }
      if (a === 3) { if (every(e, 30)) ring(e, 14, 1.6, { c: C.pink }, r * .07); if (every(e, 45)) fan(e, 3, 2.4, .25, { k: 'pill', r: 3 }); } },
    draw(e) { const x = e.x - 56, y = e.y - 48; rectF(x - 4, y + 96, 20, 10, hex('#242424')); rectF(x + 92, y + 96, 20, 10, hex('#242424')); drawTV(x, y, 112, 96, hex('#300018'));
      const lp = PORT['CEO LINDA']; drawScaled(lp.s, x + 20, y + 10, lp.P, 1.5);
      rectF(x + 6, y + 6, 100, 10, BLACK); const titles = ['PROP PILLS', 'LINDA LITE', 'FASCISM INC.', 'THE PERFECT IMPRESSION']; text(titles[e.ad] || '', x + 8, y + 8, C.pink, 0);
      rectF(x + 6, y + 80, 100, 10, BLACK); text(e.skip ? 'SKIP AD >' : 'AD ' + (e.ad + 1) + ' OF 4  ' + Math.ceil(Math.max(0, e.cd) / 60), x + 8, y + 82, e.skip ? WHITE : hex('#ffdb24'), 0);
      if (e.fl) frameRect(x, y, 112, 96, WHITE); } },
  skip: { base: { hp: 10, r: 8, pts: 500, drop: 4, keep: 1, harmless: 1 },
    init(e) { e.box = [50, 12]; },
    upd(e) { const b = e.boss0; e.x = b.x + e.ox + Math.sin(e.t * .05) * 4; e.y = b.y + e.oy; },
    draw(e) { rectF(e.x - 25, e.y - 6, 50, 12, e.fl ? WHITE : hex('#101010')); frameRect(e.x - 25, e.y - 6, 50, 12, WHITE); text('SKIP AD', e.x - 22, e.y - 3, WHITE, 0); text('>', e.x + 18, e.y - 3, C.yel, 0); },
    die(e) { const b = e.boss0; b.skip = null; b.ad++; b.hp = 4 - b.ad; b.cd = [200, 160, 130][b.ad - 1] || 120; sfx('glitch'); post.flash = .4; banner(b.ad >= 4 ? 'AD SKIPPED. ...NO MORE ADS?' : 'AD SKIPPED. NEXT AD:', 90); SH.eb = []; if (b.ad >= 4) killEnt(b); } },
  // ---- stage 2: the mall ----
  shopper: { base: { hp: 2, r: 6, pts: 40, drop: 2 },
    init(e) { e.hit = [[0, -6, 5], [0, 4, 6]]; e.sp = .5 + Math.random() * .7; },
    upd(e) { if (e.benign) { e.y -= 1.1; e.x -= .4; return; } e.x -= e.sp; e.y += Math.sign(PLR.y - e.y) * .25; if (every(e, 150, 70) && e.x < 300) SH.fx.push({ k: 'txt', x: e.x - 30, y: e.y - 20, s: pick(['HAVE YOU SEEN MY FACE', 'MY FACE', 'I HAD IT WHEN I CAME IN', 'IS THAT MY FACE']), t: 50, c: hex('#b6b6b6') }); },
    draw(e) { drawE(e, FS.shopper[(e.t >> 4) & 1], e.x - 7, e.y - 13, FP.shop); if (e.benign) { const x = e.x - 3, y = e.y - 11; rectF(x, y, 2, 2, BLACK); rectF(x + 4, y, 2, 2, BLACK); rectF(x + 1, y + 4, 4, 1, hex('#b60000')); } },
    die(e) { e.gone = false; e.benign = 1; e.hp = 1; sfx('ok'); SH.fx.push({ k: 'txt', x: e.x - 20, y: e.y - 22, s: pick(['IT FITS', 'THANK YOU', 'A FACE!', 'I CAN SEE']), t: 60, c: C.grn }); } },
  cart: { base: { hp: 2, r: 7, pts: 30, drop: 0 }, upd(e) { e.x -= e.sp || 3.3; }, draw(e) { drawE(e, FS.cart, e.x - 10, e.y - 7, FP.shop); if ((e.t >> 2) & 1) pset(e.x + 11, e.y + 5, WHITE); } },
  pretz: { base: { hp: 8, r: 9, pts: 120, drop: 4 },
    upd(e) { e.x -= 1; if (e.x < 300 && every(e, 60, 10)) ring(e, 6, 1.3, { upd: null, draw: (b, x, y) => draw(FS.pretzel, x - 6, y - 5, FP.pretz), r: 4 }, e.t * .3); },
    draw(e) { const x = e.x - 14, y = e.y - 10; rectF(x, y, 28, 18, e.fl ? WHITE : hex('#6d4924')); rectF(x, y - 6, 28, 6, hex('#ffb624')); for (let i = 0; i < 28; i += 7) rectF(x + i, y - 6, 4, 6, C.red); text('WARM', x + 3, y + 5, hex('#ffdb24'), 0); } },
  lbot: { base: { hp: 3, r: 7, pts: 50, drop: 1 }, upd(e) { e.x -= 1.5; e.y = e.y0 + Math.sin((e.t + e.ph) * .06) * 20; if (every(e, 90, 40)) aim(e, 2, { c: C.pink }); }, init(e) { e.y0 = e.y; e.ph = e.ph || 0; }, draw(e) { drawE(e, FS.lbot[(e.t >> 3) & 1], e.x - 8, e.y - 10, FP.lbot); } },
  faceless: { base: { hp: 240, r: 30, pts: 8000, drop: 0, boss: 1, name: 'THE FACELESS' },
    init(e) { e.hit = [[0, -10, 32], [0, 30, 20]]; },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s2Boss)); if (e.t < 100) { e.x += (240 - e.x) * .03; return; } e.y = 110 + Math.sin(e.t * .015) * 30; const p = (e.t >> 8) % 3;
      if (p === 0 && every(e, 50)) for (let i = 0; i < 5; i++) eshot(e.x - 30, e.y + 20, -1.4 - i * .2, -1.5 + i * .7, { k: 'big', r: 5, c: hex('#b6b6b6'), upd: b => { b.vy += .02; b.x += b.vx; b.y += b.vy; } });
      if (p === 1 && every(e, 7)) { const msg = 'HAVE YOU SEEN MY FACE '; e.mi = ((e.mi || 0) + 1) % msg.length; if (msg[e.mi] !== ' ') eshot(e.x - 36, e.y - 10, -2.2, 0, { k: 'letter', ch: msg[e.mi], r: 4, upd: b => { b.x += b.vx; b.y = b.y0 + Math.sin(b.t * .07) * 34; }, y0: e.y - 10 }); }
      if (p === 2) { if (every(e, 90)) { spawn('shopper', 330, 40 + rnd(140)); } if (every(e, 35)) fan(e, 3, 2, .3, { c: hex('#dbdbdb') }); } },
    draw(e) { const x = e.x, y = e.y, f = e.fl ? WHITE : 0; rectF(x - 26, y + 18, 52, 48, f || hex('#6d6d92')); rectF(x - 44, y + 22, 18, 30, f || hex('#b6b6b6')); rectF(x + 26, y + 22, 18, 30, f || hex('#b6b6b6'));
      for (const bx of [x - 48, x + 32]) { rectF(bx, y + 44, 16, 18, hex('#ff6db6')); rectF(bx + 4, y + 40, 8, 4, BLACK); }
      circF(x, y - 10, 34, f || hex('#dbdbdb')); circF(x + 6, y - 6, 28, f || hex('#b6b6b6')); circF(x - 4, y - 14, 26, f || hex('#dbdbdb')); rectF(x - 14, y - 44, 30, 8, hex('#242424'));
      if (e.fl && (e.t >> 1) & 1) { const k = ['CARL', 'LINDA', 'FACE', 'SPOOKY GHOST', 'TP'][(e.t >> 2) % 5], p = PORT[k]; drawScaled(p.s, x - 34, y - 44, p.P, 1.4); } } },
  // ---- stage 3: ghost's side ----
  spot: { base: { hp: 10, r: 6, pts: 200, drop: 3, harmless: 1 },
    init(e) { e.a0 = Math.PI / 2; },
    upd(e) { e.x -= e.sp || .7; e.ang = e.a0 + Math.sin(e.t * .02 + e.x * .01) * .7; if (e.x > W + 10) return;
      const dx = PLR.x - e.x, dy = PLR.y - e.y, d = Math.hypot(dx, dy), da = Math.abs(((Math.atan2(dy, dx) - e.ang + 9.42) % 6.283) - 3.1416);
      e.lit = !PLR.dead && d < 190 && da < .22; if (e.lit && !PLR.stealth) { SH.alert += 2; if (every(e, 12)) aim(e, 3.2, { c: C.red }); } },
    draw(e) { const L = 190, a = e.ang; triF(e.x, e.y, e.x + Math.cos(a - .22) * L, e.y + Math.sin(a - .22) * L, e.x + Math.cos(a + .22) * L, e.y + Math.sin(a + .22) * L, e.lit && !PLR.stealth ? hex('#6d1224') : hex('#361218')); lineF(e.x, e.y, e.x + Math.cos(a - .22) * L, e.y + Math.sin(a - .22) * L, hex('#6d2436')); lineF(e.x, e.y, e.x + Math.cos(a + .22) * L, e.y + Math.sin(a + .22) * L, hex('#6d2436')); rectF(e.x - 6, e.y - 5, 12, 8, e.fl ? WHITE : hex('#494949')); circF(e.x, e.y + 3, 3, WHITE); }, under: 1 },
  redface: { base: { hp: 3, r: 7, pts: 60, drop: 1 },
    upd(e) { if (e.t < 40) e.x += (e.tx - e.x) * .08; else { e.x -= .8; e.y += Math.sin(e.t * .05) * .8; } if (e.t > 30 && every(e, 60, 10)) aim(e, 2.2, { c: C.red }); },
    draw(e) { drawE(e, FS.redface[(e.t >> 4) & 1], e.x - 9, e.y - 8, FP.red); } },
  wife: { base: { hp: 4, r: 7, pts: 80, drop: 2 },
    init(e) { e.y0 = e.y; },
    upd(e) { e.x -= 1.1; e.y = e.y0 + Math.sin(e.t * .04) * 30; if (every(e, 110, 50)) ring(e, 8, 1.2, { c: hex('#ff6d6d') }, e.t); if (every(e, 200, 90)) SH.fx.push({ k: 'txt', x: e.x - 20, y: e.y - 16, s: pick(['ALIMONY', 'YOU PROMISED', 'SPOOKY!!', 'WHERE IS HE']), t: 50, c: hex('#ff6d6d') }); },
    draw(e) { drawE(e, FS.wife[(e.t >> 4) & 1], e.x - 8, e.y - 9, FP.red); } },
  sigil: { base: { hp: 12, r: 10, pts: 150, drop: 4 },
    upd(e) { e.x -= .6; if (e.x < 300 && every(e, 9)) { const a = e.t * .15; eshot(e.x, e.y, Math.cos(a) * 1.6, Math.sin(a) * 1.6, { k: 'sigil', c: hex('#ff6d6d'), r: 3 }); } },
    draw(e) { const c = e.fl ? WHITE : C.red; ringF(e.x, e.y, 11, c); ringF(e.x, e.y, 7, hex('#920024')); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + e.t * .03, b = (k + 2) / 5 * 6.28 + e.t * .03; lineF(e.x + Math.cos(a) * 11, e.y + Math.sin(a) * 11, e.x + Math.cos(b) * 11, e.y + Math.sin(b) * 11, c); } } },
  counter: { base: { hp: 1, r: 1, pts: 0, drop: 0, benign: 1, keep: 1 },
    upd(e) { e.x -= 1; if (e.x < 230 && !e.done) { e.done = 1; story(lostAndFound); } if (e.x < -80) e.gone = true; },
    draw(e) { const x = e.x - 40, y = e.y - 36; rectF(x, y, 80, 50, hex('#6d4924')); rectF(x, y, 80, 6, hex('#b6926d')); rectF(x + 6, y - 40, 68, 26, hex('#1a1a30')); frameRect(x + 6, y - 40, 68, 26, WHITE); text('LOST+FOUND', x + 10, y - 36, WHITE, 0); text('14 UMBR.', x + 10, y - 26, hex('#b6b6b6'), 0); text('1 FACE', x + 10, y - 18 + 0, (SH.t >> 4) & 1 ? C.grn : hex('#9bbc0f'), 0);
      if (!PLR.forms.includes('old')) { draw(FS.old[(SH.t >> 4) & 1], x + 50, y - 22, FP.old); } const p = PORT.CLERK; rectF(x + 16, y - 12, 18, 12, hex('#dba249')); rectF(x + 18, y - 22, 14, 11, hex('#f0c8a0')); rectF(x + 18, y - 24, 14, 4, hex('#6d6d6d')); } },
  term: { base: { hp: 1, r: 1, pts: 0, drop: 0, benign: 1, keep: 1 },
    upd(e) { e.x -= 1; if (e.x < 210 && !e.done) { e.done = 1; story(pilotXScene); } if (e.x < -60) e.gone = true; },
    draw(e) { const x = e.x - 22, y = e.y - 30; rectF(x, y, 44, 60, hex('#242436')); rectF(x + 4, y + 4, 36, 26, (e.t >> 4) & 1 ? hex('#003600') : hex('#001200')); text('P.X', x + 13, y + 12, hex('#dbff24'), 0); for (let i = 0; i < 3; i++) rectF(x + 6 + i * 12, y + 38, 8, 4, hex('#494949')); rectF(x + 18, y + 60, 8, 20, hex('#242436')); } },
  redboss: { base: { hp: 280, r: 26, pts: 12000, drop: 0, boss: 1, name: 'RED FACE' },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s3Boss)); if (e.t < 90) { e.x += (244 - e.x) * .04; return; }
      if (!e.p2 && e.hp < e.maxhp * .5) { e.p2 = 1; e.name = 'SPOOKY GHOST'; SH.eb = []; story(ghostReveal); return; }
      e.y = 112 + Math.sin(e.t * .02) * (e.p2 ? 55 : 35); const t = e.t;
      if (!e.p2) { if (every(e, 60)) ring(e, 16, 1.4, { k: 'sigil', c: C.red, r: 3 }, t * .03); if (every(e, 40, 20)) fan(e, 3, 2.4, .2, { c: WHITE }); }
      else { if (every(e, 8)) { const a = t * .11; eshot(e.x, e.y, Math.cos(a) * 1.8 - .6, Math.sin(a) * 1.8, { c: hex('#ff6d6d') }); eshot(e.x, e.y, Math.cos(a + 3.14) * 1.8 - .6, Math.sin(a + 3.14) * 1.8, { c: hex('#ff6d6d') }); }
        if (every(e, 150)) { spawn('wife', 330, 50); spawn('wife', 330, 170); } if (every(e, 120, 60)) { const b = aim(e, 1.2, { k: 'big', r: 8, c: C.red }); if (b) b.upd = bb => { bb.x += bb.vx; bb.y += bb.vy; if (bb.t === 70) { ring(bb, 10, 1.8, { c: WHITE }); bb.dead = 1; } }; } } },
    draw(e) { const f = e.fl && (e.t & 1); if (!e.p2) { const p = PORT['RED FACE']; rectF(e.x - 40, e.y - 36, 80, 72, hex('#240008')); frameRect(e.x - 40, e.y - 36, 80, 72, f ? WHITE : C.red); drawScaled(p.s, e.x - 36, e.y - 32, p.P, 1.4); if ((e.t >> 5) & 1) text('ON AIR', e.x - 17, e.y - 46, C.red, 0); }
      else { const p = PORT['SPOOKY GHOST']; drawScaled(p.s, e.x - 48, e.y - 48, f ? p.P.map(() => WHITE) : p.P, 2); } } },
  // ---- stage 4: the generator / dyslexio ----
  tech: { base: { hp: 3, r: 7, pts: 50, drop: 1 },
    upd(e) { e.x -= 1.4; e.y += Math.sin(e.t * .07 + e.x * .01) * 1; if (every(e, 80, 30)) aim(e, 2.1, { c: hex('#40a0f0') }); },
    draw(e) { drawE(e, FS.tech[(e.t >> 3) & 1], e.x - 8, e.y - 9, FP.tech); rectF(e.x + 6, e.y + 6, 3, 3 + rnd(3), hex('#ffb624')); } },
  pdoor: { base: { hp: 22, r: 10, pts: 300, drop: 5 },
    init(e) { e.hit = [[0, -24, 12], [0, -8, 12], [0, 8, 12], [0, 24, 12]]; },
    upd(e) { e.x -= 1.2; },
    draw(e) { const x = e.x - 12, y = e.y - 36; rectF(x, y, 24, 72, e.fl ? WHITE : hex('#494949')); frameRect(x, y, 24, 72, hex('#ffdb24')); for (let i = 0; i < 72; i += 12) rectF(x, y + i, 24, 3, (i / 12) & 1 ? hex('#ffdb24') : BLACK); rectF(x + 2, y + 30, 20, 10, BLACK); text('60%', x + 3, y + 32, (SH.t >> 4) & 1 ? C.yel : C.red, 0); } },
  spark: { base: { hp: 2, r: 6, pts: 30, drop: 5 },
    upd(e) { e.x -= 1.8; e.y += Math.sin(e.t * .1 + e.ph) * 1.2; },
    init(e) { e.ph = rnd(10); },
    draw(e) { circF(e.x, e.y, 6, (e.t >> 2) & 1 ? C.yel : C.mag); circF(e.x, e.y, 3, WHITE); } },
  word: { base: { hp: 6, r: 8, pts: 100, drop: 2 },
    init(e) { e.w = e.word.length * 9; e.box = [e.w, 12]; e.hp = 3 + e.word.length; e.y0 = e.y; e.shown = e.word; e.pal = hex('#ffdb24'); },
    upd(e) {
      if (e.scr) { e.scr--; e.shown = e.scr > 0 ? [...e.word].sort(() => Math.random() - .5).join('') : e.word; if (e.scr === 0) FOES.word.become(e); }
      if (e.benign) { e.x -= .8; e.y -= .3; if (e.fx) e.fx(e); return; }
      e.x -= e.sp || .9; e.y = e.y0 + Math.sin(e.t * .03) * 16;
      if (e.x < 320 && every(e, 80, 20)) { const ch = e.word[rnd(e.word.length)]; aim(e, 1.8, { k: 'letter', ch, r: 4 }); } },
    scramble(e) { if (e.scr || e.benign) return; const to = ANAG[e.word]; if (!to) { hurt(e, 3); return; } e.from = e.word; e.word = to; e.scr = 30; e.benign = 1; sfx('glitch'); SH.viewers += 300; },
    become(e) { const w = e.word; sfx('get'); SH.fx.push({ k: 'txt', x: e.x - 30, y: e.y - 18, s: e.from + ' -> ' + w, t: 80, c: C.grn }); e.pal = C.grn; DBG.anagrams = (DBG.anagrams || 0) + 1; FMETA.anagrams = FMETA.anagrams || []; if (!FMETA.anagrams.includes(w)) { FMETA.anagrams.push(w); saveFM(); }
      const eff = { GARDEN: () => { for (let i = 0; i < 10; i++) SH.items.push({ k: 'orb', x: e.x, y: e.y, vx: Math.random() * 2 - 1.5, vy: Math.random() * 2 - 1, t: 0 }); }, LISTEN: () => { for (const x of SH.ents) if (!x.boss) x.t = Math.max(0, x.t - 120); SH.eb = []; banner('...EVERYTHING STOPS TO LISTEN.', 80); },
        HEART: () => { PLR.pot = Math.min(100, PLR.pot + 30); }, PARTS: () => SH.items.push({ k: 'bulb', x: e.x, y: e.y, vx: -.5, vy: 0, t: 0 }), LIVE: () => SH.items.push({ k: 'backup', x: e.x, y: e.y, vx: -.5, vy: 0, t: 0 }),
        WORDS: () => { for (let i = 0; i < 6; i++) pshot(e.x, e.y, 3 + Math.random() * 2, Math.random() * 4 - 2, { k: 'mag', dmg: 2, r: 4, home: .3, life: 90 }); }, BATS: () => { for (let i = 0; i < 6; i++) SH.fx.push({ k: 'p', x: e.x, y: e.y, vx: Math.random() * 3 - 1, vy: -Math.random() * 3, t: 60, c: BLACK }); },
        MARY: () => { SH.fx.push({ k: 'txt', x: e.x - 20, y: e.y - 30, s: 'HELLO DEAR', t: 70, c: C.pink }); SH.items.push({ k: 'bulb', x: e.x, y: e.y, vx: -.5, vy: 0, t: 0 }); }, REWARD: () => { SH.viewers += 5000; for (let i = 0; i < 6; i++) SH.items.push({ k: 'orb', x: e.x, y: e.y, vx: Math.random() * 2 - 1.5, vy: Math.random() * 2 - 1, t: 0 }); } };
      (eff[w] || eff.GARDEN)(); if (e.letter) SH.items.push({ k: 'letter', ch: e.letter, x: e.x, y: e.y, vx: -.4, vy: 0, t: 0 }); },
    draw(e) { const s = e.shown, x0 = Math.round(e.x - e.w / 2), y = Math.round(e.y - 6); for (let i = 0; i < s.length; i++) { const x = x0 + i * 9; rectF(x, y, 8, 12, e.fl ? WHITE : e.benign ? hex('#002400') : hex('#240012')); frameRect(x, y, 8, 12, e.benign ? C.grn : e.pal); text(s[i], x + 2, y + 3, e.benign ? C.grn : e.pal, 0); } } },
  spell: { base: { hp: 300, r: 30, pts: 15000, drop: 0, boss: 1, name: 'THE SPELLCHECKER' },
    init(e) { e.box = [110, 80]; },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s4Boss)); if (e.t < 90) { e.x += (236 - e.x) * .04; return; } e.y = 112 + Math.sin(e.t * .018) * 40; const p = (e.t >> 8) % 3, t = e.t;
      if (p === 0 && every(e, 5)) eshot(e.x - 50, e.y + 20, -2.2, 0, { k: 'squig', r: 3, y0: e.y + 20, upd: b => { b.x += b.vx; b.y = b.y0 + Math.sin(b.t * .1) * 20; } });
      if (p === 1 && every(e, 60)) { const b = aim(e, 1.3, { k: 'big', r: 9, c: C.red, draw: (bb, x, y) => { rectF(x - 20, y - 6, 40, 12, WHITE); frameRect(x - 20, y - 6, 40, 12, C.red); text('DID YOU', x - 19, y - 3, C.red, 0); } }); if (b) b.upd = bb => { bb.x += bb.vx; bb.y += bb.vy; if (bb.t === 80) { for (const ch of 'MEAN') eshot(bb.x, bb.y, -1 - Math.random(), Math.random() * 2 - 1, { k: 'letter', ch, r: 4 }); ring(bb, 8, 1.6, { k: 'squig', r: 3 }); bb.dead = 1; } }; }
      if (p === 2) { if (t % 256 < 60) { if (every(e, 10)) SH.fx.push({ k: 'txt', x: 20, y: e.y - 4 + ((t >> 2) & 1) * 60, s: '- - - - AUTOCORRECT - - - -', t: 10, c: C.red }); } else if (t % 256 < 120 && every(e, 3)) { eshot(e.x - 50, e.y - 30, -5, 0, { k: 'squig', r: 3 }); eshot(e.x - 50, e.y + 30, -5, 0, { k: 'squig', r: 3 }); } else if (every(e, 40)) fan(e, 5, 2, .18, { k: 'letter', ch: pick(['A', 'E', 'I', 'O', 'U']), r: 4 }); } },
    weak(b) { if (b.k === 'mag') b.dmg *= 2; return true; },
    draw(e) { const x = e.x - 55, y = e.y - 40, f = e.fl ? WHITE : 0; rectF(x, y, 110, 80, f || hex('#6d0012')); rectF(x + 4, y + 4, 50, 72, f || hex('#fff0db')); rectF(x + 56, y + 4, 50, 72, f || hex('#fff0db')); rectF(x + 53, y, 4, 80, hex('#240000'));
      for (let i = 0; i < 9; i++) { rectF(x + 8, y + 10 + i * 7, 40 - (i * 13) % 16, 1, hex('#6d6d6d')); rectF(x + 60, y + 10 + i * 7, 38 - (i * 7) % 12, 1, hex('#6d6d6d')); }
      for (const ex of [x + 28, x + 80]) { circF(ex, y + 30, 8, WHITE); circF(ex - 2, y + 31, 3, BLACK); for (let i = -9; i <= 9; i++) pset(ex + i, y + 42 + ((i + (e.t >> 2)) & 1), C.red); }
      for (let i = -24; i <= 24; i++) pset(e.x + i, y + 62 + ((i + (e.t >> 3)) & 1 ? 1 : 0), C.red); } },
  // ---- stage 5: the archive ----
  paper: { base: { hp: 1, r: 6, pts: 20, drop: 1 },
    init(e) { e.y0 = e.y; e.ph = rnd(40); },
    upd(e) { e.x -= e.sp || 1.6; e.y = e.y0 + Math.sin((e.t + e.ph) * .07) * 18; if (e.shoot && every(e, 90, 40)) aim(e, 2, { c: WHITE }); },
    draw(e) { drawE(e, FS.paper[(e.t >> 3) & 1], e.x - 6, e.y - 7, FP.paper); } },
  cab: { base: { hp: 10, r: 10, pts: 150, drop: 3 },
    init(e) { e.hit = [[0, -6, 10], [0, 8, 10]]; },
    upd(e) { e.x -= 1; if (e.x < 310 && every(e, 70, 20)) for (let i = 0; i < 3; i++) eshot(e.x - 8, e.y, -1.2 - i * .3, (e.y < 112 ? 1 : -1) * (.6 + i * .4), { draw: (b, x, y) => draw(FS.paper[0], x - 6, y - 7, FP.paper), r: 4 }); },
    draw(e) { drawE(e, FS.cabinet, e.x - 8, e.y - 13, FP.paper); } },
  curse: { base: { hp: 4, r: 7, pts: 90, drop: 2 },
    upd(e) { e.x -= 1; if (every(e, 40)) { e.x += rnd(30) - 20; e.y = clamp(e.y + rnd(40) - 20, 30, 200); } if (every(e, 70, 35)) ring(e, 6, 1.5, { c: C.red }, rnd(6)); },
    draw(e) { if (e.t % 40 < 3) return; drawE(e, FS.curse[(e.t >> 2) % 3], e.x - 8, e.y - 8, FP.curse); } },
  hrboss: { base: { hp: 140, r: 28, pts: 8000, drop: 0, boss: 1, name: 'PERFORMANCE REVIEW' },
    init(e) { e.box = [96, 96]; },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s5Midboss)); if (e.t < 80) { e.x += (240 - e.x) * .04; return; } e.y = 112 + Math.sin(e.t * .02) * 40;
      if (every(e, 40)) for (let i = 0; i < 4; i++) eshot(e.x - 40, e.y - 30 + i * 20, -1.8, (i - 1.5) * .3, { draw: (b, x, y) => draw(FS.paper[1], x - 6, y - 7, FP.paper), r: 4 });
      if (every(e, 100, 50)) { const b = aim(e, 1.5, { k: 'big', r: 9, c: C.red, draw: (bb, x, y) => { rectF(x - 17, y - 6, 34, 12, hex('#6d0000')); frameRect(x - 17, y - 6, 34, 12, C.red); text('DENIED', x - 16, y - 3, C.red, 0); } }); }
      if (every(e, 25, 12) && e.hp < e.maxhp / 2) aim(e, 2.6, { c: hex('#92dbdb') }); },
    draw(e) { const p = PORT['BACKUP FACE']; drawScaled(p.s, e.x - 48, e.y - 48, e.fl && (e.t & 1) ? p.P.map(() => WHITE) : p.P, 2); } },
  curseboss: { base: { hp: 380, r: 34, pts: 30000, drop: 0, boss: 1, name: 'THE CURSE' },
    upd(e) { if (e.dying) return dieSeq(e, () => story(s5Boss)); if (e.t < 120) { e.x += (236 - e.x) * .03; return; } const t = e.t, p = e.hp > e.maxhp * .66 ? 0 : e.hp > e.maxhp * .33 ? 1 : 2; e.y = 112 + Math.sin(t * .013) * 44 + (p === 2 ? rnd(5) - 2 : 0);
      if (p !== e.ph0) { e.ph0 = p; if (p) { comm('THE CURSE', p === 1 ? 'IT WAS A VERY GOOD IDEA AT THE TIME.' : 'WE WERE SO SURE. WE WERE SO SURE.', 120); sfx('glitch'); e.waveT = 36; } }
      if (e.waveT) { e.waveT--; post.wave = e.waveT ? 3 : 0; }
      if (every(e, p === 2 ? 5 : 8)) { const a = t * (p === 1 ? -.13 : .09); for (let k = 0; k < (p + 2); k++) { const aa = a + k * 6.283 / (p + 2); eshot(e.x, e.y, Math.cos(aa) * 1.5, Math.sin(aa) * 1.5, { c: k & 1 ? C.red : WHITE }); } }
      if (p >= 1 && every(e, 140)) { spawn('curse', 300, 40 + rnd(140)); spawn('redface', 330, 40 + rnd(140), { tx: 260 }); }
      if (p === 2 && every(e, 90, 45)) fan(e, 7, 2.2, .14, { c: C.red }); },
    draw(e) { const x = e.x, y = e.y, t = e.t;
      for (let j = -40; j < 40; j++) { const w = Math.sqrt(Math.max(0, 1600 - j * j)) * (1 + Math.sin(j * .3 + t * .2) * .08), off = (t % 30 < 2) ? rnd(12) - 6 : 0; rectF(x - w + off, y + j, w * 2, 1, e.fl ? WHITE : ((j + (t >> 1)) % 7 === 0 ? hex('#6d0000') : hex('#240000'))); }
      for (const [ox, oy, r] of [[-15, -10, 7], [15, -12, 8]]) { circF(x + ox, y + oy, r, BLACK); circF(x + ox + Math.sin(t * .05) * 2, y + oy, 2, C.red); }
      for (let i = -18; i <= 18; i++) pset(x + i, y + 18 + Math.sin(i * .5 + t * .1) * 3, C.red); rectF(x - 18, y + 16, 36, 1, BLACK); } },
};
const ANAG = { DANGER: 'GARDEN', SILENT: 'LISTEN', HATER: 'HEART', TRAPS: 'PARTS', EVIL: 'LIVE', SWORD: 'WORDS', STAB: 'BATS', ARMY: 'MARY', DRAWER: 'REWARD' };
// a boss dying: shake, bursts, then the callback once
function dieSeq(e, then) {
  e.dt = (e.dt || 0) + 1; SH.eb = [];
  if (e.dt % 8 === 0) boom(e.x + rnd(80) - 40, e.y + rnd(80) - 40, 1);
  SH.shake = 4;
  if (e.dt === 90) { boom(e.x, e.y, 4); post.flash = 1; SH.viewers += e.pts; }
  if (e.dt >= 100) { e.gone = true; SH.boss = null; post.flash = 0; then(); }
}

// ================= STAGE TIMELINES =================
const RIGHT = W + 20;
function chatStream(at, t0, n, gap, o = {}) { for (let i = 0; i < n; i++) at(t0 + i * gap, () => spawn('chat', RIGHT + 20, 30 + rnd(160), Object.assign({ spd: 1.1 + Math.random() * .8 }, o, i % (o.every || 5) === 3 && o.hostile !== 0 ? { hostile: 1 } : {}))); }
const STG_FACE = {
  1: { id: 1, title: 'ON AIR', sub: 'THE STREAM', music: 's1', bg: bgAir, ideaLine: ['A little potential from everyone. Nobody even notices.', 'What if the bullets were engagement?'],
    events: tl((at, gate) => {
      at(1, () => { SH.view = { x0: 80, y0: 64, x1: 240, y1: 184 }; PLR.x = 110; PLR.y = 124; });
      at(2, () => story(s1Intro));
      at(4, () => { for (const [x, y, ph] of [[170, 72, 0], [230, 74, 20], [170, 174, 40], [230, 172, 60]]) spawn('bolt', x, y, { ph }); });
      for (let i = 0; i < 12; i++) at(40 + i * 70, () => { if (SH.view.x0 > 0) spawn('chat', 250, 80 + rnd(90), { spd: .7, msg: pick(['HI', 'IS HE IN A BOX', 'FACE?', 'LET HIM OUT', 'HELLO??', 'BOX', 'LOL']), hostile: 0 }); });
      gate(900, () => SH.view.x0 <= 0);
      chatStream(at, 960, 16, 26, { every: 4 });
      at(1100, () => comm('YOKO', 'Chat is supplying potential. A little from each of them.', 110));
      for (let i = 0; i < 5; i++) at(1400 + i * 30, () => spawn('cam', RIGHT, 50 + i * 30, { tx: 250 - i * 8 }));
      chatStream(at, 1500, 12, 30, { every: 3 });
      at(1700, () => comm('FACE', 'Hi. Hello. Welcome back. Or welcome. I don\'t know which of you are new. That\'s sort of my whole situation.', 170));
      for (let i = 0; i < 4; i++) at(1900 + i * 80, () => spawn('popup', 200 + rnd(90), 40 + rnd(130)));
      at(1960, () => comm('CEO LINDA', 'This broadcast is brought to you by Prop Pills. And by me. Mostly me.', 120));
      at(2050, () => spawn('chat', RIGHT, 100, { msg: 'D', spd: 1, hp: 4, item: 'letter', ch: 'D', u: '#ffdb24' }));
      for (let i = 0; i < 6; i++) at(2200 + i * 40, () => spawn('cam', RIGHT, 40 + (i % 3) * 60, { tx: 230 + (i % 2) * 40 }));
      at(2300, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 110, vx: -1, vy: 0, t: 0 }));
      chatStream(at, 2400, 20, 20, { every: 3 });
      at(2900, () => story(s1MidIntro));
      at(2901, () => SH.boss = spawn('lens', RIGHT + 30, 112));
      gate(2902, () => !alive('lens'));
      chatStream(at, 2960, 14, 22, { every: 3 });
      for (let i = 0; i < 6; i++) at(3100 + i * 60, () => spawn('popup', 180 + rnd(110), 40 + rnd(130)));
      at(3200, () => spawn('chat', RIGHT, 60, { msg: 'Y', spd: 1.2, hp: 4, item: 'letter', ch: 'Y', u: '#ffdb24' }));
      for (let i = 0; i < 8; i++) at(3400 + i * 24, () => spawn('cam', RIGHT, 30 + i * 22, { tx: 200 + (i % 4) * 30 }));
      at(3500, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 150, vx: -1, vy: 0, t: 0 }));
      at(3800, () => story(s1BossIntro));
      at(3801, () => SH.boss = spawn('adboss', RIGHT + 60, 112));
      gate(3802, () => !SH.ents.some(e => e.k === 'adboss'));
    }) },
  2: { id: 2, title: 'LOST AND FOUND', sub: 'THE MALL OF THE FUTURE', music: 's2', bg: bgMall, ideaLine: ['Everyone here lost something. I lost everything once. I think.', 'What if the pretzels were an idea?'],
    events: tl((at, gate) => {
      at(2, () => story(s2Intro));
      for (let i = 0; i < 10; i++) at(60 + i * 40, () => spawn('shopper', RIGHT, 40 + ((i * 47) % 150)));
      for (let i = 0; i < 3; i++) at(500 + i * 120, () => { for (let k = 0; k < 4; k++) spawn('cart', RIGHT + k * 22, 60 + i * 50); });
      at(800, () => spawn('pretz', RIGHT, 180)); at(900, () => spawn('pretz', RIGHT, 40));
      for (let i = 0; i < 8; i++) at(1000 + i * 30, () => spawn('lbot', RIGHT, 50 + (i % 4) * 40, { ph: i * 10 }));
      at(1100, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 112, vx: -1, vy: 0, t: 0 }));
      at(1150, () => spawn('shopper', RIGHT, 120, { hp: 6, item: 'letter', ch: 'S' }));
      at(1300, () => spawn('counter', RIGHT + 40, 150));
      gate(1420, () => PLR.forms.includes('old'));
      for (let i = 0; i < 12; i++) at(1560 + i * 35, () => spawn('shopper', RIGHT, 30 + rnd(160)));
      for (let i = 0; i < 6; i++) at(1700 + i * 50, () => spawn('lbot', RIGHT, 40 + i * 28, { ph: i * 15 }));
      at(1900, () => { spawn('pretz', RIGHT, 40); spawn('pretz', RIGHT + 60, 180); });
      for (let i = 0; i < 4; i++) at(2100 + i * 90, () => { for (let k = 0; k < 5; k++) spawn('cart', RIGHT + k * 20, 40 + ((i * 53) % 140)); });
      at(2200, () => comm('FACE', 'The hands are old. Four shades. They still know what they\'re doing. That makes one of us.', 140));
      at(2400, () => spawn('lbot', RIGHT, 100, { hp: 6, item: 'letter', ch: 'L' }));
      for (let i = 0; i < 10; i++) at(2500 + i * 30, () => spawn(i & 1 ? 'lbot' : 'shopper', RIGHT, 30 + rnd(160), { ph: i * 9 }));
      at(2600, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 70, vx: -1, vy: 0, t: 0 }));
      at(2700, () => sponsorAds(3));
      at(3100, () => story(s2BossIntro));
      at(3101, () => SH.boss = spawn('faceless', RIGHT + 60, 112));
      gate(3102, () => !alive('faceless'));
    }) },
  3: { id: 3, title: 'DON\'T TELL GHOST', sub: 'THE HAUNTED BROADCAST', music: 's3', bg: bgGhost, ideaLine: ['Ghost\'s math is beautiful. I\'m borrowing it. He\'d say stealing.', 'If nobody sees me, I\'m technically not here.'],
    tick() { if (SH.alert >= 90) { SH.alert = 0; banner('RECOGNIZED', 60); sfx('object'); for (let i = 0; i < 3; i++) spawn('redface', RIGHT, 40 + i * 60, { tx: 240 + i * 10 }); } if (SH.alert > 0 && SH.t % 3 === 0) SH.alert--; },
    over(S) { if (S.alert > 0) { rectF(100, PY + 3, 120, 6, BLACK); rectF(101, PY + 4, Math.min(118, S.alert * 1.3), 4, C.red); text('ALERT', 104, PY + 10, C.red, 0); } },
    events: tl((at, gate) => {
      at(2, () => story(s3Intro));
      for (let i = 0; i < 6; i++) at(100 + i * 30, () => spawn('redface', RIGHT, 40 + i * 28, { tx: 220 + (i % 3) * 25 }));
      for (let i = 0; i < 3; i++) at(400 + i * 160, () => spawn('spot', RIGHT + 10, PY + 2, { sp: .8 }));
      for (let i = 0; i < 5; i++) at(500 + i * 70, () => spawn('wife', RIGHT, 60 + (i % 3) * 50));
      at(900, () => spawn('sigil', RIGHT, 110));
      at(1050, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 150, vx: -1, vy: 0, t: 0 }));
      at(1200, () => spawn('term', RIGHT + 20, 130));
      gate(1260, () => PLR.forms.includes('pilot'));
      for (let i = 0; i < 6; i++) at(1300 + i * 120, () => spawn('spot', RIGHT + 10, PY + 2, { sp: .9 }));
      for (let i = 0; i < 4; i++) at(1400 + i * 150, () => spawn('spot', RIGHT + 30, H - 4, { sp: .9, a0: -Math.PI / 2 }));
      at(1500, () => spawn('chat', RIGHT, 90, { msg: '@SPOOKY GHOST FACE IS HERE', spd: 1.1, snitch: 1, hostile: 0, hp: 20 }));
      for (let i = 0; i < 4; i++) at(2000 + i * 90, () => spawn('wife', RIGHT, 50 + i * 35));
      at(2100, () => spawn('wife', RIGHT, 110, { hp: 8, item: 'letter', ch: 'E' }));
      at(2300, () => { spawn('sigil', RIGHT, 60); spawn('sigil', RIGHT + 80, 170); });
      at(2400, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 110, vx: -1, vy: 0, t: 0 }));
      for (let i = 0; i < 8; i++) at(2600 + i * 28, () => spawn('redface', RIGHT, 30 + (i * 23) % 170, { tx: 200 + (i % 4) * 30 }));
      at(2700, () => sponsorAds(3));
      at(3000, () => story(s3BossIntro));
      at(3001, () => SH.boss = spawn('redboss', RIGHT + 50, 112));
      gate(3002, () => !alive('redboss'));
    }) },
  4: { id: 4, title: 'THE THIRD GENERATOR', sub: 'WHERE THE POWER COMES FROM', music: 's4', bg: S => (SH.stage.dysPart ? bgDys : bgGen)(S), ideaLine: ['There is so much potential in here. Nobody is using it. Well. Somebody is.', 'HOMO BASIC SEES ONE WORD. WE SEE THEM ALL.'],
    events: tl((at, gate) => {
      at(2, () => story(s4Intro));
      for (let i = 0; i < 8; i++) at(80 + i * 40, () => spawn('tech', RIGHT, 40 + (i * 37) % 150));
      for (let i = 0; i < 12; i++) at(300 + i * 25, () => spawn('spark', RIGHT, 30 + rnd(170)));
      at(600, () => spawn('pdoor', RIGHT, 60)); at(700, () => spawn('pdoor', RIGHT, 170));
      for (let i = 0; i < 6; i++) at(800 + i * 50, () => spawn('tech', RIGHT, 50 + i * 25));
      at(900, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 112, vx: -1, vy: 0, t: 0 }));
      at(1000, () => spawn('pdoor', RIGHT, 112)); for (let i = 0; i < 16; i++) at(1050 + i * 18, () => spawn('spark', RIGHT, 30 + rnd(170)));
      at(1100, () => spawn('tech', RIGHT, 100, { hp: 6, item: 'letter', ch: 'X' }));
      at(1400, () => story(generatorCore));
      at(1402, () => { SH.stage.dysPart = 1; });
      const words = ['DANGER', 'EVIL', 'HATER', 'SWORD', 'STAB', 'TRAPS', 'ARMY', 'SILENT', 'DANGER', 'DRAWER', 'HATER', 'TRAPS'];
      words.forEach((w, i) => at(1500 + i * 110, () => spawn('word', RIGHT + 20, 40 + ((i * 61) % 150), { word: w, letter: w === 'DRAWER' ? 'I' : null })));
      for (let i = 0; i < 6; i++) at(1600 + i * 180, () => spawn('tech', RIGHT, 30 + rnd(160)));
      at(2900, () => sponsorAds(2));
      at(3000, () => story(s4BossIntro));
      at(3001, () => SH.boss = spawn('spell', RIGHT + 60, 112));
      gate(3002, () => !alive('spell'));
    }) },
  5: { id: 5, title: 'BACKUP', sub: 'EVERY FACE THAT EVER WAS', music: 's5', bg: bgArchive, ideaLine: ['Every one of these was me. That should feel like more.', 'File it under potential.'],
    events: tl((at, gate) => {
      at(2, () => story(s5Intro));
      for (let i = 0; i < 16; i++) at(80 + i * 20, () => spawn('paper', RIGHT, 40 + (i % 4) * 40, { shoot: i % 4 === 0 }));
      at(400, () => spawn('cab', RIGHT, 40)); at(460, () => spawn('cab', RIGHT, 184));
      for (let i = 0; i < 6; i++) at(600 + i * 60, () => spawn('curse', RIGHT, 40 + rnd(150)));
      at(700, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 112, vx: -1, vy: 0, t: 0 }));
      at(1000, () => story(s5MidIntro));
      at(1001, () => SH.boss = spawn('hrboss', RIGHT + 50, 112));
      gate(1002, () => !alive('hrboss'));
      for (let i = 0; i < 12; i++) at(1100 + i * 22, () => spawn('paper', RIGHT, 30 + (i % 6) * 30, { shoot: i % 3 === 0 }));
      at(1300, () => spawn('cab', RIGHT, 60, { hp: 14, item: 'letter', ch: 'O' }));
      at(1500, () => story(incidentFile));
      for (let i = 0; i < 8; i++) at(1600 + i * 50, () => spawn('curse', RIGHT, 30 + rnd(160)));
      at(1700, () => { spawn('cab', RIGHT, 40); spawn('cab', RIGHT + 50, 184); });
      at(1800, () => SH.items.push({ k: 'bulb', x: RIGHT, y: 140, vx: -1, vy: 0, t: 0 }));
      for (let i = 0; i < 16; i++) at(2000 + i * 16, () => spawn('paper', RIGHT, 30 + rnd(170), { sp: 2.2 }));
      at(2200, () => sponsorAds(3));
      at(2500, () => story(s5BossIntro));
      at(2501, () => SH.boss = spawn('curseboss', RIGHT + 60, 112));
      gate(2502, () => !alive('curseboss'));
    }) },
};
// if Face took Linda's sponsorship, her ads follow him into every stage after
function sponsorAds(n) { if (!FSAVE.sponsor) return; for (let i = 0; i < n; i++) setTimeoutFrames(i * 40, () => spawn('popup', 150 + rnd(140), 40 + rnd(140), { hp: 4 })); if (Math.random() < .5) comm('CEO LINDA', pick(['Sponsored content. You agreed to this.', 'A word from your sponsor. The word is "buy."', 'You took the money. The money takes a little screen.']), 110); }
function setTimeoutFrames(n, fn) { SH.stage.events.splice(SH.ev, 0, [SH.t + n, fn]); SH.stage.events.sort((a, b) => a[0] - b[0]); }
