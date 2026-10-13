'use strict';
// ================= CARL: RESIDENT HUMAN. boot, title, saves, music =================
const RHMETA = fetchStore('rh_meta') || { boots: 0, ends: {} };
const saveRHM = () => store('rh_meta', RHMETA);
const OTH2 = { carl3: fetchStore('carl3_meta'), carl2: fetchStore('carl2_meta'), sg2: fetchStore('sg2_meta') };
Object.assign(VOICE, { ORRIN: [820, 40], BEA: [480, 60], ROZ: [700, 50], MARISOL: [560, 40], NELL: [640, 40], COMPLIANCE: [330, 0], 'NORMAL LIVING': [900, 10], KIOSK: [900, 10], VOICE: [300, 120], 'NEW FACE': [450, 40], OKAFOR: [500, 40], QUILL: [380, 40], MANAGER: [400, 30] });
Object.assign(TRACKS, {
  tomorrow: cgen({ bpm: 92, prog: [cF, cC, cDm, cG], lead: [CT.sparse, CT.long, CT.turn, CT.long], leadIns: 'vibes', arp: CA.climb, arpIns: 'epiano', bass: CB.slow, drums: CD.soft, drumVol: .25 }),
  home: cgen({ bpm: 72, prog: [cC, cAm, cF, cG], lead: [CT.long, CT.sparse, CT.hook, CT.sparse], leadIns: 'epiano', leadVol: .4, arp: CA.roll, arpVol: .3, bass: CB.slow, bassVol: .5, drums: false }),
  roof: cgen({ bpm: 64, prog: [cAm, cF, cC, cEm], lead: [CT.sparse, CT.long, CT.sparse, CT.low], leadIns: 'bell', leadVol: .3, arp: false, bass: CB.slow, bassVol: .45, drums: false }),
  maint: cgen({ bpm: 80, prog: [cDm, cDm, cBb, cC], lead: [CT.answer, CT.sparse, CT.answer, CT.sparse], leadIns: 'bell', leadVol: .3, arp: CA.gap, arpIns: 'pluck', arpVol: .25, bass: CB.slow, bassVol: .5, drums: CD.half, drumVol: .25 }),
  below: cgen({ bpm: 58, prog: [cAm, cEm, cF, cDm], lead: [CT.sparse, CT.sparse, CT.long, CT.sparse], leadIns: 'bell', leadVol: .3, arp: false, bass: CB.slow, bassVol: .45, drums: false }),
  control3: cgen({ bpm: 112, prog: [cEm, cC, cD, cEm], lead: [CT.sync, CT.answer, CT.hook, CT.long], leadIns: 'synth', leadVol: .4, arp: CA.gap, arpIns: 'bell', arpVol: .3, bass: CB.pump, drums: CD.ind, drumVol: .4 }),
  rhtitle: cgen({ bpm: 96, prog: [cC, cAm, cF, cG], lead: [CT.hook, CT.rise, CT.hook, CT.long], leadIns: 'vibes', arp: CA.strum, arpIns: 'epiano', bass: CB.walk, drums: CD.soft, drumVol: .35 }),
});
async function boot() {
  RHMETA.boots++; saveRHM();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0; const cam = mkCam([0, 3.2, -30], [0, 3.2, 0], .8);
  scene = { update() { t++; }, draw() { cls(hex('#000010')); ZD.fill(0); LIVE.cam = cam; const k = Math.min(1, t / 90);
    drawVox('PRETEND', [0, 4.6, 0], -.9 + k * .9 + Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [225, 225, 245], VLIGHT); drawVox('CO.', [0, 1.2, 0], .9 - k * .9 - Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [255, 90, 160], VLIGHT);
    if (t > 110) ctext('(R)', 190, UI.dim); } };
  post.fade = 1; await fadeIn(.06); await wait(110); sfx('ok'); speak('Pretend co!', { pitch: .9 }); await wait(70);
  await fadeOut(.06);
  scene = { draw() { cls(hex('#000012')); ctext('HYPER-32', 56, hex('#24ffdb'), BLACK, 2); ctext('THIS CARTRIDGE CONTAINS THE', 100, UI.text); ctext('POLY-FX CHIP', 112, hex('#ff49db')); ctext('IT HAS BEEN SIGNED FOR.', 138, UI.dim); } };
  await fadeIn(.06); await wait(130); await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['CARL IS NOT IN', 'THE MAIN SERIES THIS TIME.', '', 'HE ASKED FOR A LEASE.', 'WE GOT HIM A LEASE.'], 190, { fg: UI.dim });
  run(titleScreen3);
}
async function titleScreen3() {
  const sv = fetchStore(RHSAVE), done = Object.keys(RHMETA.ends).length > 0;
  post.fade = 1; post.shake = 0; post.flash = 0; WX.hold = 0; DLG = null; MENUS.length = 0; CARD = null; music('rhtitle');
  let t = 0; const cam = mkCam([0, 5.2, -40], [0, 5.2, 0], .8);
  scene = { update() { t++; }, draw() {
    skyD(0, 150, '#2a1a58', '#ffb89a'); for (let i = 0; i < 6; i++) { const x = 20 + i * 54, h = 40 + ((i * 37) % 50); rectF(x, 150 - h, 40, h, hex(['#3a2a68', '#4a3a78', '#5a4a88'][i % 3])); for (let j = 0; j < h / 8; j++) for (let k = 0; k < 4; k++) if (((i * 7 + j * 3 + k + (t >> 6)) % 5) < 2) rectF(x + 4 + k * 9, 150 - h + 4 + j * 8, 5, 4, hex('#ffe8a0')); }
    rectF(0, 150, W, 74, hex('#1a1030')); for (let i = -7; i <= 7; i++) lineF(160, 150, 160 + i * 60, H, hex('#7a68c8')); for (let k = 0; k < 6; k++) { const y = 150 + Math.pow((k + (t % 30) / 30) / 6, 2) * 74; rectF(0, y | 0, W, 1, hex('#7a68c8')); }
    ZD.fill(0); LIVE.cam = cam; const yw = Math.sin(t * .02) * .3;
    drawVox('CARL', [0, 7.2, 0], yw, .5, [255, 224, 72], VLIGHT);
    ctext('RESIDENT HUMAN', 108, hex('#ffffff'), hex('#6a3aa8'), 2); ctext('THE RESIDENCES AT TOMORROW', 134, hex('#ffd848'), BLACK, 1);
    if ((t >> 5) & 1) ctext('PUSH START', 188, WHITE);
    ctext('(C)2003 PRETEND CO.  HUMAN OCCUPANCY ONLY', 208, UI.dim);
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (sv ? ['CONTINUE'] : []).concat(['NEW GAME']).concat(done ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 116, y: 150, cancel: 1 });
  if (i < 0) return titleScreen3();
  if (opts[i] === 'CONTINUE') return continueGame3(sv);
  if (opts[i] === 'ENDINGS SEEN') {
    const names = { home: 'HOME', quiet: 'A QUIET UNIT', evicted: 'PLEASE VACATE', door: 'THE DOOR' };
    await showCard(['ENDINGS SEEN', '', ...Object.keys(names).map(k => (RHMETA.ends[k] ? '* ' : '- ') + names[k])], 0);
    return titleScreen3();
  }
  if (sv) { const c = await ask('START OVER? YOUR SAVE WILL BE ERASED. (THE BUILDING KEEPS A COPY.)', null, ['NO', 'YES']); if (c !== 1) return titleScreen3(); }
  await fadeOut(.06); newGameRH();
}
async function continueGame3(sv) {
  await fadeOut(.06); C3 = sv; music(null); scene = worldScene3; loadScene(C3.scene, C3.x, C3.z, C3.yaw); WX.hold = 0; await fadeIn(.08); if (SCENES[C3.scene].onLoad) SCENES[C3.scene].onLoad();
}
