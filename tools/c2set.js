// run a CARL 2 set piece headless with a simple driver: node tools/c2set.js bus|ski|space|dance [shotFrames] [prefix]
const { load, G } = require('./c2vm'), path = require('path');
const [which, fr = '', pre = 'set'] = process.argv.slice(2);
const ctx = load();
G.R(ctx, `anyKey = true; C2 = newC2(); C2.ep = 3; C2.lv = 4; scene = worldScene; loadMap('lot', 10, 10, 'd'); DBG.setRes = null;`);
const call = { bus: 'desertBusTurbo()', ski: 'jumpTheShark()', space: 'inSpace()', dance: 'boogaloo()' }[which];
G.R(ctx, `run(async () => { DBG.setRes = await ${call}; DBG.setDone = 1; })`);
const shots = fr.split(',').filter(Boolean).map(Number);
const drive = {
  bus: `(() => { const s = segAt(RD.pos + RD.playerZ); let target = 0; for (let d = 1; d < 8; d++) { const q = segAt(RD.pos + RD.playerZ + d * RD.segL); for (const o of q.spr) if (!o.dead && (o.hit) && Math.abs(o.off - RD.px) < .4) target = o.off > 0 ? -.5 : .5; } for (const c of RD.cars) { const dz = c.z - (RD.pos + RD.playerZ); if (dz > 0 && dz < RD.segL * 8 && Math.abs(c.off - RD.px) < .5) target = c.off > 0 ? -.55 : .55; } kb.a = 1; kb.b = 0; kb.left = RD.px > target + .08 ? 1 : 0; kb.right = RD.px < target - .08 ? 1 : 0; })()`,
  ski: `(() => { let target = 0; for (let d = 0; d < 12; d++) { const q = segAt(RD.pos + RD.playerZ + d * RD.segL); if (q.gate && !q.gateDone) { target = q.gate.c; break; } if (q.ramp) { target = 0; break; } } kb.a = 1; kb.left = RD.px > target + .06 ? 1 : 0; kb.right = RD.px < target - .06 ? 1 : 0; kb.up = 0; if (RD.air) kb.a = 0; if (RD.trick && RD.trick.i < RD.trick.seq.length && RD.t % 8 === 0) { const k = RD.trick.seq[RD.trick.i]; kb[k] = 1; } })()`,
  space: `(() => { let tx = W / 2, ty = 150; let best = null; for (const o of SP.obj) { if (o.dead || o.wz > 0) continue; const [sx, sy] = spProj(o.x, o.y, o.z); if (!best || o.z < best.z) best = { sx, sy, z: o.z }; } if (best) { tx = best.sx; ty = best.sy + 14; } for (const e of SP.eshots) { const [sx, sy] = spProj(e.x, e.y, e.z); if (e.z < 3 && Math.abs(sx - SP.px) < 26 && Math.abs(sy - SP.py + 12) < 26) { tx = SP.px + (sx < SP.px ? 60 : -60); } } for (const o of SP.obj) { if (o.k === 'rock' && o.z < 3) ty = 70; } ty = Math.max(60, Math.min(190, ty)); kb.a = 1; kb.left = SP.px > tx + 4 ? 1 : 0; kb.right = SP.px < tx - 4 ? 1 : 0; kb.up = SP.py > ty + 4 ? 1 : 0; kb.down = SP.py < ty - 4 ? 1 : 0; })()`,
  dance: `(() => { if (typeof DANCE !== 'undefined' && DANCE.want) { for (const k of ['up','down','left','right','a']) kb[k] = DANCE.want === k ? 1 : 0; } else for (const k of ['up','down','left','right','a']) kb[k] = 0; })()`,
};
(async () => {
  let T = 0;
  for (let f = 0; f < 20000; f++) {
    if (!G.R(ctx, 'DLG || MENUS.length || CARD')) { if (G.R(ctx, 'DBG.mode === "road" || DBG.mode === "space" || DBG.mode === "dance"')) G.R(ctx, drive[which]); } else { G.R(ctx, 'for (const k of ["up","down","left","right","a","b"]) kb[k] = 0'); if (f % 4 === 0) G.R(ctx, 'kb.a = 1'); }
    T += 16.7; G.R(ctx, `loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (shots.includes(f)) { const out = path.join(__dirname, 'shots', pre + '_' + which + '_' + f + '.png'); G.png(ctx, out, 2); console.log('wrote', out); }
    if (G.R(ctx, 'DBG.setDone')) { console.log('DONE f=' + f, JSON.stringify(G.R(ctx, 'DBG.setRes'))); break; }
  }
  console.log('hp', G.R(ctx, 'C2.hp'), 'shake', G.R(ctx, 'post.shake'), 'fade', G.R(ctx, 'post.fade'));
})().catch(e => console.log('ERR', e));
