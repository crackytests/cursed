// CARL 3 bot: runs inside the game context. BOT.tick() once per frame before loop().
// It follows the objective marker: routes between scenes, walks a grid, talks to the target, answers menus, plays the little jobs, dodges on the road.
var BOT = (() => {
  let F = 0, want = {}, last = {}, lastSay = '', W8 = { claim: 'maintenance', honest: true, ending: 'signed' }, stuck = 0, lastPos = [0, 0], jig = 0, path = null, pathKey = '', pi = 0, wireStep = 0, goalName = '';
  const L = s => console.log('[' + F + '] ' + s);
  const press = k => { if (!last[k]) want[k] = 1; }, hold = k => { want[k] = 1; };
  function apply() { for (const k of BTNS) kb[k] = want[k] ? 1 : 0; last = want; want = {}; }
  // ---------- UI ----------
  function menuPick(m) {
    const o = m.opts.map(s => String(s).toUpperCase()); let i = 0; const find = re => o.findIndex(s => re.test(s));
    if (DBG.claims) { const order = [W8.claim, 'maintenance', 'resident', 'inspector', 'relative', 'trucker', 'investor', 'shopper', 'courier']; const pref = order.find(c => DBG.claims.includes(c)); i = DBG.claims.indexOf(pref); }
    else if (find(/^DRIVE$/) >= 0) i = find(/^DRIVE$/);
    else if (find(/^SAVE AND REST/) >= 0) i = find(/^NOT NOW/);
    else if (find(/^SIGN$/) >= 0) i = find(/^SIGN$/);
    else if (find(/^PAY/) >= 0) i = C3.bux >= 20 ? find(/^PAY/) : find(/^ARGUE/);
    else if (find(/^ANSWER/) >= 0) i = find(/^ANSWER/);
    else if (find(/^NEW GAME/) >= 0) i = find(/^NEW GAME/);
    else if (DBG.truth !== undefined) i = W8.honest ? DBG.truth : (DBG.truth + 1) % o.length;
    else if (DBG.pick) i = DBG.pick(o);
    else if (DBG.mode === 'argue') i = argueMove(o);
    else if (find(/^SIGN FOR IT/) >= 0) i = find(({ signed: /^SIGN FOR IT/, returned: /^RETURN TO SENDER/, forwarded: /^FORWARD IT/, refused: /^REFUSE/, replied: /^SIGN, AND WRITE BACK/ })[W8.ending || 'signed']);
    else if (find(/^YES|^SIGN|^STAY|^DELIVER/) >= 0) i = find(/^YES|^SIGN|^STAY|^DELIVER/);
    m.i = Math.max(0, i); return i;
  }
  function argueMove(o) {
    const f = ARG.foe, w = f.weak || {}; let best = 'LOGIC', bm = 0;
    for (const k of ['LOGIC', 'GRIEVANCE', 'DENIAL', 'RANT']) { const v = (w[k] || 1) * ({ LOGIC: 3, GRIEVANCE: 4, DENIAL: 3, RANT: 5 }[k]) - (k === 'RANT' && !w.RANT ? 1.5 : 0); if (v > bm && !(f.immune && f.immune.includes(k))) { bm = v; best = k; } }
    if (ARG.composure <= 2) return o.indexOf('DEFLECT');
    return o.indexOf(best);
  }
  function ui() {
    if (MENUS.length) { menuPick(MENUS[0]); if (F % 6 === 0) press('a'); return true; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); return true; }
    if (DLG) { const s = (DLG.who ? DLG.who + ': ' : '') + DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L(s); } if (F % 3 === 0) press('a'); return true; }
    if (CHATBOX) { if (F % 20 === 0) press('a'); return true; }
    return false;
  }
  // ---------- little jobs ----------
  function tuneTick() { const t = DBG.tn; if (!t) return; const d = t.dial(); if (Math.abs(d - t.target) < .02) { if (F % 6 === 0) press('a'); } else if (d < t.target) hold('right'); else hold('left'); }
  function driveTick() {
    const D = DBG.drv; let bestX = D.x, bestS = -1e9;
    for (let x = -3.4; x <= 3.4; x += .4) { let s = 0; for (const ob of D.obs) { if (ob.z < -2 || ob.z > 22) continue; const w = (OBS[ob.k] ? OBS[ob.k].w : .7) + 1.1, dx = Math.abs(ob.x - x); if (dx < w) s -= (30 - Math.max(0, ob.z)) * (w - dx + .5); } s -= Math.abs(x - D.x) * .4; if (s > bestS) { bestS = s; bestX = x; } }
    if (D.x < bestX - .15) hold('right'); else if (D.x > bestX + .15) hold('left');
  }
  // ---------- walking ----------
  const CELL = .5;
  function cellFree(cx, cz) { return walkable(cx * CELL, cz * CELL, .4); }
  function bfsCells(sx, sz, gx, gz) {
    const key = (x, z) => (z + 400) * 1000 + (x + 400), prev = new Map([[key(sx, sz), null]]), q = [[sx, sz]];
    for (let i = 0; i < q.length && i < 40000; i++) {
      const [x, z] = q[i]; if (x === gx && z === gz) break;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) { const nx = x + dx, nz = z + dz; if (prev.has(key(nx, nz)) || !cellFree(nx, nz)) continue; if (dx && dz && (!cellFree(x + dx, z) || !cellFree(x, z + dz))) continue; prev.set(key(nx, nz), [x, z]); q.push([nx, nz]); }
    }
    if (!prev.has(key(gx, gz))) return null; const out = []; for (let c = [gx, gz]; c; c = prev.get(key(c[0], c[1]))) out.push(c); return out.reverse();
  }
  function walkTo(x, z, tol = 1.0) { // returns true when close enough
    const d = Math.hypot(CARL.p[0] - x, CARL.p[2] - z); if (d < tol) return true;
    const sx = Math.round(CARL.p[0] / CELL), sz = Math.round(CARL.p[2] / CELL); let gx = Math.round(x / CELL), gz = Math.round(z / CELL);
    if (!cellFree(gx, gz)) { let best = null, bd = 1e9; for (let r = 1; r <= 8; r++) { for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (cellFree(gx + dx, gz + dz)) { const dd = Math.hypot(dx, dz); if (dd < bd) { bd = dd; best = [gx + dx, gz + dz]; } } if (best) break; } if (best) { gx = best[0]; gz = best[1]; } }
    const k = WX.id + ':' + gx + ',' + gz;
    if (pathKey !== k || !path || F % 40 === 0) { path = bfsCells(sx, sz, gx, gz); pathKey = k; pi = 0; }
    if (!path) { // boxed in by a corner: head straight for the goal and let the game slide us out
      const cam0 = WX.bg.cam, f0 = Math.hypot(cam0.f[0], cam0.f[2]) || 1, dx0 = x - CARL.p[0], dz0 = z - CARL.p[2], l0 = Math.hypot(dx0, dz0) || 1;
      const iy0 = (dx0 * cam0.f[0] / f0 + dz0 * cam0.f[2] / f0) / l0, ix0 = (dx0 * cam0.r[0] + dz0 * cam0.r[2]) / l0;
      if (iy0 > .3) hold('up'); else if (iy0 < -.3) hold('down'); if (ix0 > .3) hold('right'); else if (ix0 < -.3) hold('left'); return false;
    }
    if (pi < path.length - 1 && Math.hypot(path[pi + 1][0] * CELL - CARL.p[0], path[pi + 1][1] * CELL - CARL.p[2]) < .32) pi++;
    const tgt = path[Math.min(pi + 1, path.length - 1)], wx = tgt[0] * CELL, wz = tgt[1] * CELL;
    // screen-relative input from a world direction
    const cam = WX.bg.cam, fx = Math.hypot(cam.f[0], cam.f[2]) || 1, fwd = [cam.f[0] / fx, cam.f[2] / fx], rt = [cam.r[0], cam.r[2]];
    const dx = wx - CARL.p[0], dz = wz - CARL.p[2], dl = Math.hypot(dx, dz) || 1, ux = dx / dl, uz = dz / dl;
    const iy = ux * fwd[0] + uz * fwd[1], ix = ux * rt[0] + uz * rt[1];
    if (iy > .3) hold('up'); else if (iy < -.3) hold('down'); if (ix > .3) hold('right'); else if (ix < -.3) hold('left');
    return false;
  }
  // scene graph: which entity in a scene leads to which scene
  function edgesFrom(sceneId) { const sc = SCENES[sceneId], out = []; if (sc.ents) for (const d of sc.ents()) if (d.to && (!d.cond || d.cond())) for (const t of [].concat(typeof d.to === 'function' ? d.to() : d.to)) out.push({ id: d.id, to: t }); for (const x of (sc.exits || [])) out.push({ exit: x, to: x.to }); return out; }
  function nextHop(from, to) { if (from === to) return null; const prev = { [from]: null }, q = [from]; for (let i = 0; i < q.length; i++) { const s = q[i]; if (s === to) break; for (const e of edgesFrom(s)) if (!(e.to in prev)) { prev[e.to] = { s, e }; q.push(e.to); } } if (!(to in prev)) return null; let c = to; while (prev[c] && prev[c].s !== from) c = prev[c].s; return prev[c].e; }
  function entPos(id) { const e = WX.ents.find(e => e.id === id); return e; }
  function world() {
    if (WX.hold || post.fade > .5) return;
    const [px, pz] = [CARL.p[0], CARL.p[2]];
    if (Math.abs(px - lastPos[0]) + Math.abs(pz - lastPos[1]) < .02) stuck++; else stuck = 0; lastPos = [px, pz];
    if (stuck > 800) { L('STALL at ' + px.toFixed(1) + ',' + pz.toFixed(1) + ' ' + WX.id + ' goal=' + goalName); stuck = 0; jig = 80; path = null; }
    if (jig > 0) { jig--; hold(['up', 'down', 'left', 'right'][(F >> 4) & 3]); return; }
    const o = OBJ3; if (!o) { goalName = 'none'; return; }
    goalName = o.scene + ':' + o.id;
    if (WX.id !== o.scene) { const hop = nextHop(WX.id, o.scene); if (!hop) { goalName += ' NOHOP'; return; } if (hop.exit) { const r = hop.exit.r; walkTo((r[0] + r[2]) / 2, (r[1] + r[3]) / 2, .05); return; } const e = entPos(hop.id); if (e) { if (Math.hypot(e.p[0] - px, e.p[2] - pz) < e.range * .8) press('a'); else walkTo(e.p[0], e.p[2], e.range * .6); } return; }
    const e = entPos(o.id); if (!e) { goalName += ' NOENT'; return; }
    if (Math.hypot(e.p[0] - px, e.p[2] - pz) < Math.max(.9, e.range * .95) && nearest3() === e) { press('a'); stuck = 0; return; }
    walkTo(e.p[0], e.p[2], Math.min(.9, e.range * .4));
  }
  function tick() {
    F++;
    if (ui()) { apply(); return; }
    const m = DBG.mode;
    if (m === 'wires') wiresTick2(); else if (m === 'tune') tuneTick(); else if (m === 'drive') driveTick(); else if (m === 'slots') { if (DBG.sl.want() && F % 2 === 0) press('a'); } else if (m === 'sort') { const k = DBG.sort.want(); if (k && F % 6 === 0) press(k); } else if (m === 'argue') { /* menu handled */ } else if (scene === worldScene3) world();
    apply();
  }
  let wState = { phase: 0, i: 0 };
  function wiresTick2() { // deterministic: for each left plug i in order: move sel to i, A, move right cursor to its partner, A
    const w = DBG.wr; if (!w) return; if (F % 4) return;
    const right = w.right(), sel = w.sel(), picked = w.picked(), n = w.n;
    if (picked < 0) { const next = DBG.wrDone ? [...Array(n).keys()].find(i => !DBG.wrDone.has(i)) : 0; if (next === undefined) return; wState.cur = next; if (sel !== next) { const down = (next - sel + n) % n <= n / 2; press(down ? 'down' : 'up'); } else press('a'); }
    else { const tr = right.indexOf(picked), rs = DBG.wrRs(); if (rs !== tr) { const down = (tr - rs + n) % n <= n / 2; press(down ? 'down' : 'up'); } else press('a'); }
  }
  return { tick, set: o => Object.assign(W8, o), W8, log: L };
})();
