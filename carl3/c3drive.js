'use strict';
// ================= CARL 3: the drive between stops. a live 3D road in front of the A.S.S., with the radio on =================
// not prerendered: everything is a chunky polygon moving toward the camera.
const DRV = { x: 0, z: 0, t: 0, hits: 0, obs: [], scroll: 0, speed: .9, done: 0, line: null, lines: [], lt: 0, res: {}, tilt: 0 };
const SHIP = { h: 1, parts: [
  { m: 'sphere:1.7:12:6', o: [0, .7, 0], s: [1, .32, 1], col: [150, 160, 180] }, { m: 'sphere:.8:10:6', o: [0, 1.05, 0], s: [1, .8, 1], col: [100, 230, 210] },
  { m: 'box:2.6:.12:.5', o: [0, .66, 0], col: [255, 216, 72] }, { m: 'sphere:.18:6:4', o: [-1.2, .5, .7], col: [255, 90, 70] }, { m: 'sphere:.18:6:4', o: [1.2, .5, .7], col: [255, 90, 70] },
  { m: 'cyl:.14:.45:6', o: [-.8, .1, -.6], col: [90, 90, 100] }, { m: 'cyl:.14:.45:6', o: [.8, .1, -.6], col: [90, 90, 100] },
] };
const OBS = {
  weed: { w: .7, m: 'sphere:.55:7:5', col: [176, 144, 96], roll: 1, y: .55 }, cone: { w: .5, m: 'cyl:.4:.9:7:.12', col: [255, 120, 40], y: 0 },
  rig: { w: 1.5, m: 'box:2.8:3:7', col: [190, 50, 40], y: 0 }, pot: { w: 1, m: 'cyl:.9:.06:9', col: [10, 10, 14], y: .02 }, cow: { w: .9, m: 'box:1.1:1.1:2', col: [240, 240, 240], y: 0 },
};
async function drive(o = {}) {
  const dur = o.dur || 1500, lane = 3.4, D = DRV;
  Object.assign(D, { x: 0, t: 0, hits: 0, obs: [], scroll: 0, done: 0, res: {}, lines: o.lines || [], line: null, lt: 0, ok: 0, tilt: 0 });
  const prev = scene, pm = curName; music(o.music || 'drive');
  const cam = mkCam([0, 3.4, -7.5], [0, 1.2, 8], .95);
  const light = { amb: [.7, .7, .9], dir: v3.norm([-.4, .8, -.3]), dcol: [.7, .7, .9], tint: [0, 0, 0] };
  let spawnT = 30;
  scene = {
    update() {
      D.t++; if (D.done) return;
      if (WX.shake > 0) { WX.shake--; post.shake = WX.shake > 0 ? Math.min(3, WX.shake >> 1) : 0; } else post.shake = 0;
      const ax = (held.right ? 1 : 0) - (held.left ? 1 : 0); D.x = Math.max(-lane, Math.min(lane, D.x + ax * .16)); D.tilt += (ax * .25 - D.tilt) * .2;
      D.scroll += D.speed; if (--spawnT <= 0) { spawnT = 34 + rnd(26) - Math.min(16, D.t / 100); const k = pick(o.types || ['weed', 'cone', 'pot', 'rig', 'cow']); D.obs.push({ k, x: (rnd(7) - 3) * 1.1, z: 80, spin: 0 }); }
      for (const ob of D.obs) { ob.z -= D.speed * (ob.k === 'rig' ? .55 : 1); ob.spin += .15; if (!ob.hit && Math.abs(ob.z) < 1.5 && Math.abs(ob.x - D.x) < OBS[ob.k].w + .9) { ob.hit = 1; D.hits++; WX.shake = 12; sfx('hurt'); tickC(pick(['ow', 'THAT WAS A COW', 'carl watch the road', 'the parcels!']), 'user_000'); if (D.hits >= 3) { D.done = -1; } } }
      D.obs = D.obs.filter(ob => ob.z > -12);
      for (const [t, who, txt] of D.lines) if (D.t === t) { D.line = { who, txt, t: 230 }; sfx('static'); }
      if (D.line && --D.line.t <= 0) D.line = null;
      if (D.t >= dur) D.done = 1;
    },
    draw() {
      // sky + ground are painted, the road and everything on it are polygons
      skyD(0, CY + 6, o.sky ? o.sky[0] : '#000018', o.sky ? o.sky[1] : '#5a2a6a'); for (let i = 0; i < 50; i++) pset((i * 53) % W, (i * 29) % 70, i % 5 ? hex('#9292db') : WHITE);
      rectF(0, CY + 6, W, H, hex(o.ground || '#2a2030')); ZD.fill(0); LIVE.cam = cam;
      drawMeshLive(mesh('plane:12:400'), { p: [0, 0, 190], yaw: 0 }, [38, 38, 48], light);
      for (const s of [-1, 1]) drawMeshLive(mesh('plane:.4:400'), { p: [s * 5.6, .01, 190], yaw: 0 }, [235, 235, 215], light);
      const off = D.scroll % 8; for (let k = -2; k < 24; k++) drawMeshLive(mesh('plane:.3:3'), { p: [0, .01, k * 8 - off + 2], yaw: 0 }, [230, 200, 60], light);
      for (let k = 0; k < 14; k++) { const z = k * 16 - (D.scroll % 16); for (const s of [-1, 1]) { drawMeshLive(mesh('cyl:.1:5:6'), { p: [s * 8, 0, z], yaw: 0 }, [90, 90, 96], light); if (k % 3 === 0) drawMeshLive(mesh('cyl:.3:2.4:7'), { p: [s * 10.5, 0, z + 5], yaw: 0 }, [60, 130, 80], light); } }
      for (const ob of D.obs) { if (ob.z > 80) continue; const d = OBS[ob.k]; drawMeshLive(mesh(d.m), { p: [ob.x, d.y, ob.z], yaw: d.roll ? ob.spin : 0 }, d.col, light); if (ob.k === 'rig') drawMeshLive(mesh('box:2.7:1:.2'), { p: [ob.x, 3.1, ob.z - 3.5], yaw: 0 }, [255, 230, 90], light); }
      drawModel(SHIP, { p: [D.x, .9 + Math.sin(D.t * .08) * .08, 0], yaw: 0, bob: 0 }, light);
      rectA(0, 0, W, 16, BLACK, .6); text(o.title || 'NEVADA', 6, 4, hex('#ffd848')); text('HITS ' + D.hits + '/3', 120, 4, D.hits ? hex('#ff4949') : UI.text); rectF(190, 6, 120, 5, hex('#241040')); rectF(190, 6, 120 * Math.min(1, D.t / dur), 5, hex('#6dff92'));
      if (D.line) { const l = D.line; rectA(0, H - 52, W, 52, BLACK, .72); text(l.who, 8, H - 46, hex('#ffdb49')); const ln = wrapT(l.txt.toUpperCase(), 50); ln.slice(0, 3).forEach((s, i) => text(s, 8, H - 34 + i * 10, UI.text)); }
      if (D.msg) { plate(60, 84, 200, 50); shadowText('THE PARCELS SLIPPED', 160 - 57, 94, hex('#ff6a5a')); text('DISPATCH: PULLING OVER.', 160 - 69, 112, UI3.text); }
      if (D.t < 140) ctext('LEFT / RIGHT: STEER   THREE HITS AND THE PARCELS SLIP', 28, UI.name);
      WX.tick.slice(-2).forEach((k, i) => { const s = (k.u + ': ' + k.m).toUpperCase().slice(0, 44); text(s, 6, 22 + i * 10, UI.dim); });
    },
  };
  DBG.mode = 'drive'; DBG.drv = D;
  post.fade = 1; await fadeIn(.08);
  for (;;) {
    while (!D.done) { await nextFrame(); for (const k of WX.tick) k.t--; WX.tick = WX.tick.filter(k => k.t > 0); }
    post.shake = 0; if (D.done > 0) break;
    // a crash: stay on the road (never fade out over a dark scene), say the radio's line, then start the stretch again
    sfx('hurt'); D.msg = 1; await wait(110); D.msg = 0;
    await say(pick(['Take your time. Mail is patient. Mail has been patient for years.', 'Eyes on the road, kid. The cow was in the file.', 'Everything is fine. A few parcels are on the shoulder. They will forgive you.']), pick([DI, GA]));
    Object.assign(D, { x: 0, t: 0, hits: 0, obs: [], scroll: 0, done: 0, line: null, tilt: 0 }); spawnT = 40; post.shake = 0; WX.shake = 0;
  }
  await fadeOut(.06); scene = prev; DBG.mode = null; music(pm);
  return true;
}
// keep trying until it works. the radio is patient.
async function driveUntil(o) { for (let n = 0; ; n++) { const ok = await drive(o); if (ok) return; await say(pick(['DISPATCH: Take your time. Mail is patient. Mail has been patient for years.', 'GARFIELD: Eyes on the road, kid. The cow was in the file.']), null); } }
