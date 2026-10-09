// CARL 2 EXTREME route planner, evaluated inside a game vm context (load it with G.R(ctx, require('./c2xbfs'))).
// planRoute(spec) runs a BFS over standing / hanging / rope states using the real player physics and input macros,
// and returns { found, frames: [keys per frame], nodes, sims, end } where end is the expected settled key.
// spec: { goal: 'goal' | { x } , maxSims }. The caller sets up LV/ENTS/PL first (foes removed, walls of text removed).
module.exports = `
function planRoute(spec) {
  const goal = ENTS.find(e => e.kind === 'goal'), box = ENTS.find(e => e.kind === 'box'), ropes = ENTS.filter(e => e.kind === 'rope'), rings = ENTS.filter(e => e.kind === 'ring');
  const KEYS = ['up', 'down', 'left', 'right', 'a', 'b', 'c'];
  let prev = {}, rec = null, hit = false, touchedBox = false;
  const snap = () => ({ pl: JSON.stringify(Object.assign({}, PL, { hang: PL.hang ? rings.indexOf(PL.hang) : -1, rope: PL.rope ? ropes.indexOf(PL.rope) : -1, lastRope: PL.lastRope ? ropes.indexOf(PL.lastRope) : -1 })), r: ropes.map(r => [r.th, r.w]), prev: JSON.stringify(prev), fr: frame }); // frame: the appearing blocks run on it
  const restore = s => { const o = JSON.parse(s.pl); Object.assign(PL, o); PL.hang = o.hang >= 0 ? rings[o.hang] : null; PL.rope = o.rope >= 0 ? ropes[o.rope] : null; PL.lastRope = o.lastRope >= 0 ? ropes[o.lastRope] : null; s.r.forEach((v, i) => { ropes[i].th = v[0]; ropes[i].w = v[1]; }); BONG = null; prev = JSON.parse(s.prev); frame = s.fr; };
  const goals = ENTS.filter(e => e.kind === 'goal');
  const isGoal = () => spec.goal === 'goal' ? goals.some(g => overlap(PL, g)) : spec.goal === 'box' ? box && overlap(PL, box) : PL.x > spec.goal.x;
  const step = keys => {
    if (rec) rec.push(keys);
    for (const k of KEYS) { const h = !!keys[k]; pressed[k] = h && !prev[k]; held[k] = h; prev[k] = h; }
    frame++; quipCD = 999; const hp = PL.hp;
    playerUpdate(); bongUpdate();
    for (const r of ropes) ropeStep(r);
    if (isGoal()) hit = true;
    return !(PL.dead || PL.hp < hp);
  };
  const key = () => PL.rope ? 'r' + ropes.indexOf(PL.rope) : PL.hang ? 'h' + rings.indexOf(PL.hang) : PL.on ? Math.floor((PL.x + 5) / 16) + ',' + Math.round((PL.y + PL.h) / 16) : null;
  const runMacro = (seq, air) => {
    for (const [n, k] of seq) for (let i = 0; i < n; i++) { if (!step(k)) return null; if (hit) return 'GOAL'; }
    for (let i = 0; i < 260; i++) { if (key() && !BONG && i > 0) return key(); if (!step(air || {})) return null; if (hit) return 'GOAL'; }
    return key();
  };
  const D = d => d > 0 ? 'right' : 'left';
  const water = LV.def.water !== undefined;
  const macros = [];
  for (const d of [-1, 1]) {
    const k = { [D(d)]: 1 };
    macros.push({ seq: [[10, k]], air: {} });
    for (const run of [0, 14]) for (const hold of [4, 12, 40]) for (const ad of [d, 0, -d]) macros.push({ seq: [[run, k], [hold, Object.assign({ b: 1 }, run ? k : {})]], air: ad ? { [D(ad)]: 1 } : {} });
    for (const at of [0, 10, 18]) macros.push({ seq: [[14, k], [at, Object.assign({ b: 1 }, k)], [1, { up: 1, a: 1 }]], air: {} });
    macros.push({ seq: [[1, k], [1, { up: 1, a: 1 }]], air: {} });
    if (ropes.length) for (const w of [15, 30, 45, 60, 75, 90]) for (const run of [0, 14]) macros.push({ seq: [[w, {}], [run, k], [40, Object.assign({ b: 1 }, k)]], air: k });
    if (RULES.spindash) macros.push({ seq: [[1, k], [3, { down: 1 }], [1, { down: 1, b: 1 }], [2, { down: 1 }], [1, { down: 1, b: 1 }], [2, { down: 1 }], [1, { down: 1, b: 1 }], [16, {}]], air: {} });
    if (RULES.puff) for (const n of [3, 6, 10, 16]) { const seq = [[10, k], [1, Object.assign({ b: 1 }, k)], [8, k]]; for (let i = 0; i < n; i++) seq.push([1, Object.assign({ b: 1 }, k)], [9, k]); macros.push({ seq, air: k }); }
    if (RULES.knux) for (const run of [0, 14]) for (const w of [4, 12]) macros.push({ seq: [[run, k], [6, Object.assign({ b: 1 }, k)], [w, k], [1, Object.assign({ b: 1 }, k)]], air: Object.assign({ b: 1, up: 1 }, k) });
    if (RULES.mx) { // dash, dash-jump, wall kicks up one wall, wall kicks up a shaft
      macros.push({ seq: [[1, Object.assign({ down: 1, b: 1 }, k)], [22, k]], air: k });
      for (const h of [6, 14, 30]) for (const ad of [k, {}]) macros.push({ seq: [[1, Object.assign({ down: 1, b: 1 }, k)], [3, k], [h, Object.assign({ b: 1 }, k)]], air: ad });
      for (const run of [0, 14]) for (const n of [1, 2, 4, 7]) for (const c of [14, 20]) { const seq = [[run, k], [16, Object.assign({ b: 1 }, k)]]; for (let i = 0; i < n; i++) seq.push([1, k], [c, Object.assign({ b: 1 }, k)]); macros.push({ seq, air: k }); }
      for (const n of [2, 4, 6]) { const seq = [[16, Object.assign({ b: 1 }, k)]]; let dd = d; for (let i = 0; i < n; i++) { dd = -dd; const kk = { [D(dd)]: 1 }; seq.push([1, kk], [14, Object.assign({ b: 1 }, kk)]); } macros.push({ seq, air: { [D(dd)]: 1 } }); }
    }
    if (water) for (const n of [2, 4, 7, 10]) for (const up of [0, 1]) { const seq = []; for (let i = 0; i < n; i++) seq.push([1, Object.assign({ b: 1 }, k, up ? { up: 1 } : {})], [11, Object.assign({}, k, up ? { up: 1 } : {})]); macros.push({ seq, air: k }); }
  }
  if (RULES.mega) macros.push(...macros.flatMap(m => [30, 60, 90, 120, 150, 180, 210, 240].map(w => ({ seq: [[w, {}]].concat(m.seq), air: m.air, wait: 1 })))); // appearing blocks: wait for the next one (only tried near one)
  const nearD = () => { const tx = Math.floor((PL.x + 5) / 16); for (let y = 0; y < LV.h; y++) for (let x = tx - 6; x <= tx + 6; x++) if (tileAt(x, y) === "D") return true; return false; };
  const hangMacros = [];
  for (const e of [-1, 0, 1]) for (const ad of [-1, 0, 1]) hangMacros.push({ seq: [[3, {}], [1, Object.assign({ b: 1 }, e ? { [D(e)]: 1 } : {})], [30, Object.assign({ b: 1 }, ad ? { [D(ad)]: 1 } : {})]], air: ad ? { [D(ad)]: 1 } : {} });
  for (const d of [-1, 1]) hangMacros.push({ seq: [[3, { [D(d)]: 1 }], [1, { up: 1, a: 1, [D(d)]: 1 }]], air: {} });
  hangMacros.push({ seq: [[1, { down: 1 }]], air: {} });
  const ropeMacros = [];
  for (const d of [-1, 1]) for (const t0 of [0, 70, 140]) for (const thr of [-.3, 0, .3, .6]) ropeMacros.push({ rope: 1, t0, thr, d });
  for (const d of [-1, 1]) for (const t0 of [0, 30, 60, 90]) ropeMacros.push({ seq: [[t0, { [D(d)]: 1 }], [1, { up: 1, a: 1, [D(d)]: 1 }]], air: {} });
  const seen = new Map(), Q = [];
  const k0 = key(); if (!k0) return { found: false, why: 'not settled' };
  seen.set(k0, { s: snap(), parent: null, rec: [] }); Q.push(k0);
  let sims = 0, found = null;
  while (Q.length && sims < (spec.maxSims || 40000) && !found) {
    const k = Q.shift(), node = seen.get(k);
    for (const m of k[0] === 'h' ? hangMacros : k[0] === 'r' ? ropeMacros : macros) {
      restore(node.s); if (m.wait && !nearD()) continue; sims++; hit = false; rec = [];
      let r;
      if (m.rope) {
        let ok = true, i = 0;
        for (; i < 400 && ok && PL.rope; i++) { const ro = PL.rope; if (i >= m.t0 && ro.w * m.d > 0 && ro.th * m.d >= m.thr) break; ok = step({ [D(ro.w >= 0 ? 1 : -1)]: 1 }); if (hit) break; }
        if (!ok || i >= 400) { rec = null; continue; }
        if (hit) r = 'GOAL'; else if (!PL.rope) { rec = null; continue; } else { step({ b: 1, [D(m.d)]: 1 }); r = hit ? 'GOAL' : runMacro([[6, { [D(m.d)]: 1 }]], { [D(m.d)]: 1 }); }
      } else r = runMacro(m.seq, m.air);
      const myRec = rec; rec = null;
      if (r === 'GOAL') { found = { parent: k, rec: myRec }; break; }
      if (r && !seen.has(r)) { seen.set(r, { s: snap(), parent: k, rec: myRec, end: r }); Q.push(r); }
    }
  }
  if (!found) return { found: false, nodes: seen.size, sims };
  const chain = [found.rec]; let p = found.parent; const ends = [];
  while (p) { const n = seen.get(p); if (n.parent) { chain.unshift(n.rec); ends.unshift(p); } p = n.parent; }
  // per-macro segments so the executor can check it landed where the planner did
  const segs = []; for (let i = 0; i < chain.length; i++) segs.push({ frames: chain[i], end: i < ends.length ? ends[i] : 'GOAL' });
  return { found: true, segs, nodes: seen.size, sims };
}
`;
