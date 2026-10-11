// audit every CARL 3 scene: each interactive entity must be reachable from the start (grid flood fill, Carl's radius)
const { load, G } = require('./c3vm');
const ctx = load({}); G.R(ctx, 'C3 = newC3(); ensure3 && ensure3()');
console.log(G.R(ctx, `(() => {
  const out = [];
  for (const id of Object.keys(SCENES)) {
    const sc = SCENES[id]; WX.sc = sc; WX.ents = []; WX.id = id; const ents = (sc.ents ? sc.ents() : []).concat(typeof CRATES === 'undefined' ? [] : CRATES.filter(c => c.scene === id).map(c => ({ id: 'crate' + c.n, at: [c.at[0], 0, c.at[1]], range: 1.6, talk: 1 })), typeof JOBS === 'undefined' ? [] : JOBS.filter(j => j.scene === id).map(j => ({ id: 'job:' + j.id, at: [j.at[0], 0, j.at[1]], range: 2.3, talk: 1 })));
    const free = (x, z) => walkable(x * .5, z * .5, .38);
    const sx = Math.round(sc.start[0] / .5), sz = Math.round(sc.start[2] / .5); const seen = new Set(), q = [[sx, sz]]; seen.add(sz * 1000 + sx);
    for (let i = 0; i < q.length && i < 60000; i++) { const [x, z] = q[i]; for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, nz = z + dz, k = nz * 1000 + nx; if (seen.has(k) || !free(nx, nz)) continue; seen.add(k); q.push([nx, nz]); } }
    const bad = []; if (!free(sx, sz)) bad.push('start blocked');
    for (const d of ents) { if (!(d.talk || d.look || d.kind === 'card')) continue; const p = d.at || [0, 0, 0]; let ok = false; const R = Math.ceil((d.range || 2.3) * .8 / .5);
      for (let dx = -R; dx <= R && !ok; dx++) for (let dz = -R; dz <= R && !ok; dz++) { if (Math.hypot(dx, dz) * .5 > (d.range || 2.3) * .8) continue; if (seen.has((Math.round(p[2] / .5) + dz) * 1000 + Math.round(p[0] / .5) + dx)) ok = true; }
      if (!ok) bad.push('unreachable ' + d.id); }
    for (const x of (sc.exits || [])) { const cx = Math.round((x.r[0] + x.r[2]) / 1 / .5), cz = Math.round((x.r[1] + x.r[3]) / 1 / .5); if (!seen.has(cz * 1000 + cx)) bad.push('exit unreachable'); }
    out.push(id + ': cams=' + sc.cams.length + ' walkcells=' + seen.size + (bad.length ? '\\n   BAD ' + bad.join('\\n   BAD ') : ' ok'));
  }
  return out.join('\\n');
})()`));
