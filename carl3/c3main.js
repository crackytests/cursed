'use strict';
// ================= CARL 3: RETURN TO SENDER. boot, title, saves, portraits =================
const C3META = fetchStore('carl3_meta') || { boots: 0, ends: {} };
const saveC3M = () => store('carl3_meta', C3META);
const OTH = { carl: fetchStore('carl_meta'), carl2: fetchStore('carl2_meta'), face: fetchStore('face_meta'), ghost: fetchStore('ghost_meta'), sg2: fetchStore('sg2_meta') };
// ---------------- portraits (48x48) ----------------
function bust3(c, o = {}) {
  const P = pal(c.bg, c.skin || '#dbb692', c.shade || '#b6926d', c.hair || '#241010', c.top || '#6d6d92', '#ffffff', '#101010', c.acc || '#ffd848', c.bg2 || '#24244a', c.acc2 || '#24dbff');
  const s = portrait(g => {
    g.r(0, 0, 48, 48, 1); for (let y = 2; y < 48; y += 9) g.r(0, y, 48, 2, 9);
    g.e(24, 52, 22, 13, 5); if (o.collar) { g.line(18, 39, 22, 46, 8); g.line(30, 39, 26, 46, 8); } if (o.uniform) { g.r(20, 40, 8, 8, 8); g.r(10, 40, 4, 3, 8); }
    g.e(24, 23, 13, 15, 2); g.e(29, 25, 7, 13, 3);
    const hs = o.hair || 'short';
    if (hs === 'short') g.e(24, 10, 15, 7, 4); if (hs === 'big') { g.e(24, 11, 19, 11, 4); g.e(10, 22, 6, 11, 4); g.e(38, 22, 6, 11, 4); }
    if (hs === 'bob') { g.e(24, 10, 15, 8, 4); g.r(9, 10, 5, 18, 4); g.r(34, 10, 5, 18, 4); } if (hs === 'slick') { g.e(24, 8, 16, 7, 4); g.r(9, 8, 5, 12, 4); g.r(34, 8, 5, 12, 4); }
    if (hs === 'bald') { g.e(24, 12, 13, 5, 2); }
    if (o.hat) { g.r(8, 8, 32, 4, 8); g.r(13, 1, 22, 8, 8); } if (o.cap) { g.e(24, 8, 16, 7, 8); g.r(24, 11, 18, 3, 8); }
    if (o.shades) { g.r(12, 19, 24, 6, 7); g.r(15, 20, 5, 1, 6); g.r(27, 20, 5, 1, 6); } else { g.r(16, 20, 5, 3, 6); g.r(27, 20, 5, 3, 6); g.p(17, 20, 7); g.p(28, 20, 7); }
    if (o.glasses) { g.r(14, 19, 9, 1, 10); g.r(14, 24, 9, 1, 10); g.r(14, 19, 1, 6, 10); g.r(22, 19, 1, 6, 10); g.r(26, 19, 9, 1, 10); g.r(26, 24, 9, 1, 10); g.r(26, 19, 1, 6, 10); g.r(34, 19, 1, 6, 10); }
    if (o.beard) { g.e(24, 34, 11, 7, 4); g.r(20, 31, 8, 1, 2); } else g.r(19, 31, 10, 2, 8 === 8 ? 3 : 3);
    if (o.headset) { g.r(7, 15, 3, 14, 7); g.line(9, 28, 18, 33, 7); g.r(17, 32, 4, 2, 8); }
    if (o.badge) g.r(34, 41, 5, 4, 8);
  });
  return { s, P };
}
const PORTS3 = {
  DISPATCH: bust3({ bg: '#101020', bg2: '#24244a', skin: '#b6926d', shade: '#926d49', hair: '#241010', top: '#494992', acc: '#6dff24' }, { headset: 1, hair: 'short', collar: 1 }),
  'POSTMASTER HANK': bust3({ bg: '#24180a', bg2: '#49300a', skin: '#dbb692', hair: '#b6b6b6', top: '#24499b', acc: '#ffd848' }, { hat: 1, hair: 'short', badge: 1, uniform: 1 }),
  DOLORES: bust3({ bg: '#2a0a24', bg2: '#6d2492', skin: '#dbb692', hair: '#4a2a24', top: '#a090c8', acc: '#ff49db' }, { hair: 'big', glasses: 1 }),
  LEON: bust3({ bg: '#240a0a', bg2: '#6d2424', skin: '#db9249', hair: '#3a2a1a', top: '#b64924', acc: '#ffd848' }, { cap: 1, beard: 1 }),
  'RADIO RAY': bust3({ bg: '#0a1a10', bg2: '#244a24', skin: '#dbb692', hair: '#241010', top: '#4a7a2a', acc: '#6dff24' }, { cap: 1, beard: 1, headset: 1 }),
  DENNIS: bust3({ bg: '#10182a', bg2: '#244a6d', skin: '#b6926d', hair: '#241010', top: '#303848', acc: '#ffd848' }, { cap: 1, shades: 1, badge: 1 }),
  INSPECTOR: bust3({ bg: '#101010', bg2: '#242424', skin: '#f0f0e8', hair: '#f0f0e8', top: '#1a1a1a', acc: '#ff2449' }, { hair: 'bald', shades: 1, collar: 1 }),
  CLERK: bust3({ bg: '#101820', bg2: '#243a4a', skin: '#dbdbd0', hair: '#6d6d6d', top: '#d8d8d0', acc: '#24dbff' }, { glasses: 1, hair: 'short', uniform: 1 }),
  MARGO: bust3({ bg: '#10182a', bg2: '#24406d', skin: '#db9249', hair: '#4a2a1a', top: '#d8d8e0', acc: '#ffd848' }, { hair: 'big', glasses: 1, uniform: 1 }),
  USER_000: bust3({ bg: '#000000', bg2: '#001a00', skin: '#24b624', hair: '#000000', top: '#003a00', acc: '#6dff24' }, { hair: 'bald', shades: 1 }),
};
Object.assign(PORT, { 'SPOOKY GHOST': CAST.full['SPOOKY GHOST'], 'CEO LINDA': CAST.full.LINDA, LINDA: CAST.full.LINDA, CARL: CAST.full.CARL });
for (const k in PORTS3) PORT[k] = PORTS3[k];
PORT['NEW FACE'] = PORT.FACE;
Object.assign(VOICE, { CARL: [900, 120], DISPATCH: [520, 20], 'POSTMASTER HANK': [380, 40], DOLORES: [780, 70], LEON: [300, 50], 'RADIO RAY': [440, 90], DENNIS: [420, 30], INSPECTOR: [330, 0], CLERK: [600, 10], USER_000: [1500, 0], MARGO: [720, 60], 'JB GARFIELD': [260, 30], 'SPOOKY GHOST': [1250, 350], 'CEO LINDA': [780, 40], GARFIELD: [260, 30] });
PORT.GARFIELD = PORT['JB GARFIELD'];
FM_TONE = { low: .6, high: -3, lp: 7000, room: .16, sfxHigh: -3, gain: .9 };
SFX.static = () => { noise(.5, { bp: 2200, vol: .28, rate: 1.4 }); noise(.35, { hp: 4000, vol: .12, at: AC.currentTime + .1 }); };
SFX.alert = () => [0, .14, .28].forEach(d => note(880, .09, 'brass', AC.currentTime + d, sfxBus));
SFX.stamp = () => { noise(.12, { lp: 500, vol: .6, rate: .5 }); tone(120, .1, { vol: .4, type: 'square', slide: .5 }); };
SFX.ding = () => note(1320, .5, 'bell', AC.currentTime, sfxBus);
SFX.ring = () => [0, .18, .5, .68].forEach(d => note(1400, .12, 'bell', AC.currentTime + d, sfxBus));
SFX.phase = () => tone(300, .25, { type: 'sine', slide: 3, vol: .3 });
// ---------------- voxel letters: every lit pixel of the font is a cube ----------------
const VOXC = {};
function voxMesh(str) {
  if (VOXC[str]) return VOXC[str];
  const m = newMesh(); let ox = 0;
  for (const ch of str) { const gl = FONT[ch]; if (gl) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (gl[j] & (16 >> i)) { const b = MESH.box(1, 1, 1.4), n0 = m.v.length; for (const v of b.v) m.v.push([v[0] + ox + i, v[1] + (6 - j), v[2]]); for (const n of b.n) m.n.push(n); for (const f of b.f) m.f.push([f[0] + n0, f[1] + n0, f[2] + n0]); } ox += 6; }
  m.w = ox - 1; return VOXC[str] = m;
}
function drawVox(str, p, yaw, sc, col, light) { const m = voxMesh(str); drawMeshLive(m, { p: [p[0] - m.w * sc / 2 * Math.cos(yaw), p[1], p[2] + m.w * sc / 2 * Math.sin(yaw)], yaw, s: sc }, col, light); }
const VLIGHT = { amb: [.5, .45, .7], dir: v3.norm([-.5, .6, -.6]), dcol: [.9, .8, .9], tint: [0, 0, 0] };
// ---------------- boot ----------------
async function boot() {
  C3META.boots++; saveC3M();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0; const cam = mkCam([0, 3.2, -30], [0, 3.2, 0], .8);
  scene = { update() { t++; }, draw() { cls(hex('#000010')); ZD.fill(0); LIVE.cam = cam; const k = Math.min(1, t / 90);
    drawVox('PRETEND', [0, 4.6, 0], -.9 + k * .9 + Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [225, 225, 245], VLIGHT); drawVox('CO.', [0, 1.2, 0], .9 - k * .9 - Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [255, 90, 160], VLIGHT);
    if (t > 110) ctext('(R)', 190, UI.dim); } };
  post.fade = 1; await fadeIn(.06); await wait(110); sfx('ok'); speak('Pretend co!', { pitch: .9 }); await wait(70);
  await fadeOut(.06);
  scene = { draw() { cls(hex('#000012')); ctext('HYPER-32', 56, hex('#24ffdb'), BLACK, 2); ctext('THIS CARTRIDGE CONTAINS THE', 100, UI.text); ctext('POLY-FX CHIP', 112, hex('#ff49db')); ctext('300 POLYGONS PER SECOND*', 138, UI.dim); ctext('*PER CARL', 150, UI.dim); } };
  await fadeIn(.06); await wait(130); await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['THIS IS CARL\'S FIRST GAME', 'IN THREE DIMENSIONS.', '', 'HE\'S ASKED US NOT TO MAKE', 'A BIG DEAL OF IT.'], 190, { fg: UI.dim });
  run(titleScreen3);
}
// ---------------- title ----------------
async function titleScreen3() {
  const sv = fetchStore('carl3_save'), done = Object.keys(C3META.ends).length > 0;
  post.fade = 1; post.shake = 0; post.flash = 0; WX.hold = 0; DLG = null; MENUS.length = 0; CARD = null; music('title');
  let t = 0; const cam = mkCam([0, 5.2, -40], [0, 5.2, 0], .8);
  scene = { update() { t++; }, draw() {
    skyD(0, 126, '#2a0a52', '#ff7040'); circF(160, 112, 34, hex('#ffd848')); for (let y = 92; y < 126; y += 4) rectF(120, y, 80, 1 + ((y - 92) >> 3), hex('#ff7040'));
    triF(0, 126, 52, 96, 118, 126, hex('#3a1038')); triF(90, 126, 168, 88, 250, 126, hex('#4a1440')); triF(200, 126, 280, 100, 320, 126, hex('#3a1038')); rectF(0, 126, W, 98, hex('#1a0828'));
    for (let i = -6; i <= 6; i++) lineF(160, 126, 160 + i * 66, H, hex('#ff49b6')); for (let k = 0; k < 7; k++) { const y = 126 + Math.pow((k + (t % 24) / 24) / 7, 2) * 98; rectF(0, y | 0, W, 1, hex('#ff49b6')); }
    ZD.fill(0); LIVE.cam = cam; const yw = Math.sin(t * .02) * .35;
    drawVox('CARL', [-5.2, 6.4, 0], yw, .5, [255, 224, 72], VLIGHT); drawVox('3', [5.6, 5.2, 0], yw * 1.2, .95, [255, 72, 160], VLIGHT);
    ctext('RETURN TO SENDER', 118, hex('#ffffff'), hex('#b62424'), 2);
    drawModel(SHIP, { p: [Math.sin(t * .03) * 12, 13.5 + Math.cos(t * .05) * .6, 8], yaw: 0, s: .7 }, VLIGHT);
    if ((t >> 5) & 1) ctext('PUSH START', 186, WHITE);
    ctext('(C)2002 PRETEND CO.  ' + (done ? 'DELIVERED' : 'FIRST CLASS'), 208, UI.dim);
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE'] : []).concat(['NEW GAME']).concat(done ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 116, y: 150, cancel: 1 });
  if (i < 0) return titleScreen3();
  if (opts[i] === 'CONTINUE') return continueGame3(sv);
  if (opts[i] === 'ENDINGS SEEN') {
    const names = { signed: 'SIGNED FOR', returned: 'RETURN TO SENDER', forwarded: 'FORWARDED', refused: 'REFUSED', intercepted: 'INTERCEPTED', replied: 'WROTE BACK' };
    await showCard(['ENDINGS SEEN', '', ...Object.keys(names).map(k => (C3META.ends[k] ? '* ' : '- ') + names[k])], 0);
    return titleScreen3();
  }
  if (sv) { const c = await ask('START OVER? YOUR SAVE WILL BE ERASED. (THE POST OFFICE KEEPS A COPY.)', null, ['NO', 'YES']); if (c !== 1) return titleScreen3(); }
  await fadeOut(.06); newGame3();
}
async function continueGame3(sv) {
  await fadeOut(.06); C3 = sv; music(null); scene = worldScene3; loadScene(C3.scene, C3.x, C3.z, C3.yaw); WX.hold = 0; await fadeIn(.08);
}
