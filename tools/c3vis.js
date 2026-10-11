// camera visibility audit for CARL 3: node tools/c3vis.js [scene ...]   (env STOP, FLAGS)
// walks every walkable spot, picks the camera the game would, and checks Carl and every talkable thing in range
// are on screen, clear of the HUD, and not behind scenery (against the backdrop's depth buffer).
const { load, G } = require('./c3vm');
const ids = process.argv.slice(2);
const ctx = load({}); G.R(ctx, 'present = () => {}');
G.R(ctx, `C3 = newC3(); ensure3(); C3.stop = ${process.env.STOP || 1}; ${(process.env.FLAGS || '').split(',').filter(Boolean).map(f => `setF3('${f}');`).join('')} scene = worldScene3;`);
const out = G.R(ctx, `(() => {
  const ids = ${JSON.stringify(ids)}.length ? ${JSON.stringify(ids)} : Object.keys(SCENES).filter(id => SCENES[id].cams && SCENES[id].walk && SCENES[id].walk.length);
  const seen = (bg, p) => { const s = project(bg.cam, p); if (!s) return 'behind cam'; const x = Math.round(s[0]), y = Math.round(s[1]);
    if (x < 6 || x > W - 6 || y < 6 || y > H - 4) return 'offscreen'; if (x > 212 && y < 52) return 'under hud';
    return 1 / s[2] < bg.depth[y * W + x] * .97 ? 'blocked' : ''; };
  const lines = [];
  for (const id of ids) {
    loadScene(id); const sc = WX.sc, ents = WX.ents.filter(e => (e.talk || e.look) && live3(e) && e.label);
    const carl = {}, ent = {}; let cells = 0;
    for (const w of sc.walk) for (let x = w[0] + .3; x <= w[2] - .3; x += 1) for (let z = w[1] + .3; z <= w[3] - .3; z += 1) {
      if (!walkable(x, z)) continue; cells++; CARL.p = [x, 0, z]; WX.camId = ''; pickCam(true); const bg = WX.bg, cid = WX.camId;
      const fe = seen(bg, [x, .2, z]), why = seen(bg, [x, 1.5, z]) || (fe === 'blocked' ? '' : fe);   // feet behind a low desk is fine; feet off the frame is not
      if (why) { const k = cid + ' ' + why; (carl[k] = carl[k] || []).push([+x.toFixed(1), +z.toFixed(1)]); }
      for (const e of ents) { if (Math.hypot(e.p[0] - x, e.p[2] - z) > (e.range || 2.3)) continue; const r = seen(bg, [e.p[0], (entModel(e) ? entModel(e).h || 1.2 : 1.2) + (e.promptY || .3), e.p[2]]);   // where the A prompt draws
        if (r) { const k = e.label + ' (' + cid + ' ' + r + ')'; ent[k] = (ent[k] || 0) + 1; } }
    }
    const bad = Object.keys(carl).length + Object.keys(ent).length;
    lines.push(id + ': cams=' + sc.cams.length + ' cells=' + cells + (bad ? '' : ' ok'));
    for (const k in carl) lines.push('   CARL hidden, cam ' + k + ': ' + carl[k].length + ' spots, e.g. ' + JSON.stringify(carl[k].slice(0, 3)));
    for (const k in ent) lines.push('   ' + k + ' hidden from ' + ent[k] + ' spots in talk range');
  }
  return lines.join(String.fromCharCode(10));
})()`);
console.log(out);
