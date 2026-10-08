// CARL 2 EXTREME reachability: BFS over standing/hanging spots, edges found by running the real player physics
// with input macros (walk, jump, hookshot, rope swing). Walls of text are pre-burned, foes removed.
// node tools/c2xreach.js [level indexes]   -> per level: goal reachable? outfit box reachable? node count
const { load, G } = require('./c2xvm');
const which = process.argv.slice(2).map(Number);
const ctx = load();
const out = G.R(ctx, `(() => {
  const res = [];
  const ids = ${JSON.stringify(which)}.length ? ${JSON.stringify(which)} : LEVELS.map((l, i) => i);
  for (const li of ids) {
    const L = LEVELS[li]; RUN.got = {}; loadLevel(L); LV.finish = () => {};
    for (let y = 0; y < LV.h; y++) for (let x = 0; x < LV.w; x++) if (LV.g[y][x] === 'W') LV.g[y][x] = '.';
    if (L.boss) for (const cx of [L.boss.at, L.boss.at + 19]) {} // arenas never close in this test
    ENTS = ENTS.filter(e => !e.foe);
    const goal = ENTS.find(e => e.kind === 'goal'), box = ENTS.find(e => e.kind === 'box'), ropes = ENTS.filter(e => e.kind === 'rope'), rings = ENTS.filter(e => e.kind === 'ring');
    const KEYS = ['up', 'down', 'left', 'right', 'a', 'b', 'c'];
    let prev = {};
    const snap = () => ({ pl: JSON.stringify(Object.assign({}, PL, { hang: PL.hang ? rings.indexOf(PL.hang) : -1, rope: PL.rope ? ropes.indexOf(PL.rope) : -1 })), r: ropes.map(r => [r.th, r.w]), fr: frame }); // frame: the appearing blocks run on it
    const restore = s => { const o = JSON.parse(s.pl); Object.assign(PL, o); PL.hang = o.hang >= 0 ? rings[o.hang] : null; PL.rope = o.rope >= 0 ? ropes[o.rope] : null; s.r.forEach((v, i) => { ropes[i].th = v[0]; ropes[i].w = v[1]; }); BONG = null; prev = {}; frame = s.fr; };
    let touched = { goal: 0, box: 0 };
    const step = keys => {
      for (const k of KEYS) { const h = !!keys[k]; pressed[k] = h && !prev[k]; held[k] = h; prev[k] = h; }
      frame++; quipCD = 999; const hp = PL.hp;
      playerUpdate(); bongUpdate();
      for (const r of ropes) ropeStep(r);
      if (goal && overlap(PL, goal)) touched.goal = 1; if (box && overlap(PL, box)) touched.box = 1;
      return !(PL.dead || PL.hp < hp);
    };
    const key = () => PL.rope ? 'r' + ropes.indexOf(PL.rope) : PL.hang ? 'h' + rings.indexOf(PL.hang) : PL.on ? Math.floor((PL.x + 5) / 16) + ',' + Math.round((PL.y + PL.h) / 16) : null;
    // run a macro: list of [frames, keys] then wait (max) until settled (standing or hanging). returns key or null
    const runMacro = (seq, air) => {
      for (const [n, k] of seq) for (let i = 0; i < n; i++) if (!step(k)) return null;
      for (let i = 0; i < 260; i++) { if (key() && !BONG && i > 0) return key(); if (!step(typeof air === 'function' ? air(i) : air || {})) return null; }
      return key();
    };
    const D = d => d > 0 ? 'right' : 'left';
    const macros = [];
    for (const d of [-1, 1]) {
      const k = { [D(d)]: 1 };
      macros.push({ seq: [[10, k]], air: {} });
      for (const run of [0, 14]) for (const hold of [4, 12, 40]) for (const ad of [d, 0, -d]) macros.push({ seq: [[run, k], [hold, Object.assign({ b: 1 }, run ? k : {})]], air: ad ? { [D(ad)]: 1 } : {} });
      for (const at of [0, 10, 18]) macros.push({ seq: [[14, k], [at, Object.assign({ b: 1 }, k)], [1, { up: 1, a: 1 }]], air: {} });
      macros.push({ seq: [[1, { up: 1, a: 1, [D(d)]: 0 }]], air: {} });
      if (RULES.spindash) macros.push({ seq: [[1, k], [3, { down: 1 }], [1, { down: 1, b: 1 }], [2, { down: 1 }], [1, { down: 1, b: 1 }], [2, { down: 1 }], [1, { down: 1, b: 1 }], [16, {}]], air: {} });
      if (RULES.puff) for (const n of [3, 6, 10, 16]) { const seq = [[10, k], [1, Object.assign({ b: 1 }, k)], [8, k]]; for (let i = 0; i < n; i++) seq.push([1, Object.assign({ b: 1 }, k)], [9, k]); macros.push({ seq, air: k }); }
      if (RULES.knux) for (const run of [0, 14]) for (const w of [4, 12]) macros.push({ seq: [[run, k], [6, Object.assign({ b: 1 }, k)], [w, k], [1, Object.assign({ b: 1 }, k)]], air: Object.assign({ b: 1, up: 1 }, k) });
      if (L.water !== undefined) for (const n of [2, 4, 7, 10]) for (const up of [0, 1]) { const seq = []; for (let i = 0; i < n; i++) seq.push([1, Object.assign({ b: 1 }, k, up ? { up: 1 } : {})], [11, Object.assign({}, k, up ? { up: 1 } : {})]); macros.push({ seq, air: k }); }
  
    }
    if (RULES.mega) macros.push(...macros.flatMap(m => [30, 60, 90, 120, 150, 180, 210, 240].map(w => ({ seq: [[w, {}]].concat(m.seq), air: m.air, wait: 1 })))); // appearing blocks: wait for the next one (only tried near one)
  const nearD = () => { const tx = Math.floor((PL.x + 5) / 16); for (let y = 0; y < LV.h; y++) for (let x = tx - 6; x <= tx + 6; x++) if (tileAt(x, y) === "D") return true; return false; };
    const hangMacros = [];
    for (const e of [-1, 0, 1]) for (const ad of [-1, 0, 1]) hangMacros.push({ seq: [[3, {}], [1, Object.assign({ b: 1 }, e ? { [D(e)]: 1 } : {})], [30, Object.assign({ b: 1 }, ad ? { [D(ad)]: 1 } : {})]], air: ad ? { [D(ad)]: 1 } : {} });
    for (const d of [-1, 1]) hangMacros.push({ seq: [[3, { [D(d)]: 1 }], [1, { up: 1, a: 1 }]], air: {} });
    hangMacros.push({ seq: [[1, { down: 1 }]], air: {} });
    const ropeMacros = [];
    for (const d of [-1, 1]) for (const t0 of [0, 70, 140]) for (const thr of [-.3, 0, .3, .6]) ropeMacros.push({ rope: 1, t0, thr, d });
    for (const d of [-1, 1]) for (const t0 of [0, 30, 60, 90]) ropeMacros.push({ seq: [[t0, { [D(d)]: 1 }], [1, { up: 1, a: 1, [D(d)]: 1 }]], air: {} });
    PL.x = PL.cx; PL.y = PL.cy; respawnState(); PL.hurt = 0;
    for (let i = 0; i < 30; i++) step({});
    const seen = new Map(), Q = [];
    const add = s => { const k = key(); if (k && !seen.has(k)) { seen.set(k, s); Q.push(k); } };
    add(snap());
    let sims = 0;
    while (Q.length && sims < ${+process.env.SIMS || 60000}) {
      const k = Q.shift(), s = seen.get(k);
      for (const m of k[0] === 'h' ? hangMacros : k[0] === 'r' ? ropeMacros : macros) {
        restore(s); if (m.wait && !nearD()) continue; sims++;
        let r;
        if (m.rope) {
          let ok = true;
          let i = 0; // pump with the swing, let go on the forward upswing
          for (; i < 400 && ok && PL.rope; i++) { const r = PL.rope; if (i >= m.t0 && r.w * m.d > 0 && r.th * m.d >= m.thr) break; ok = step({ [D(r.w >= 0 ? 1 : -1)]: 1 }); }
          if (!ok || !PL.rope || i >= 400) continue; step({ b: 1, [D(m.d)]: 1 });
          r = runMacro([[6, { [D(m.d)]: 1 }]], { [D(m.d)]: 1 });
        } else r = runMacro(m.seq, m.air);
        if (r && !seen.has(r)) add(snap());
      }
    }
    const xs = [...seen.keys()].filter(k => k.includes(',')).map(k => +k.split(',')[0]);
    res.push(L.id + ': nodes=' + seen.size + ' sims=' + sims + ' maxX=' + Math.max(...xs) + '/' + LV.w + ' goal=' + (goal ? touched.goal ? 'YES' : 'NO' : '- (boss)') + ' box=' + (box ? touched.box ? 'YES' : 'NO' : '-'));
  }
  return res.join(String.fromCharCode(10));
})()`);
console.log(out);
