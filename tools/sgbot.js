// SPOOKY GHOST 2 bot: runs inside the game context. BOT.tick() once per frame before loop().
// It plays like a person would: haunts from behind, collects cards, answers menus, draws sigils, steers the entrance, dances.
var BOT = (() => {
  let F = 0, want = {}, last = {}, lastSay = '', path = null, pathKey = '', stuck = 0, lastPos = [0, 0], W8 = { honest: true, end: 'stayed', cards: 1 }, jig = 0, goalName = '', goalSince = 0, lastGoal = '', waitF = 0;
  const L = s => console.log('[' + F + '] ' + s);
  const press = k => { if (!last[k]) want[k] = 1; }, hold = k => { want[k] = 1; };
  function apply() { for (const k of BTNS) kb[k] = want[k] ? 1 : 0; last = want; want = {}; }
  const passable = c => !SOLID.has(c) || c === 'W' || c === 'L';
  function bfs(sx, sy, gx, gy) {
    const key = (x, y) => y * WD.w + x, prev = new Map([[key(sx, sy), -1]]), q = [[sx, sy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i]; if (x === gx && y === gy) break;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 1 || ny < 1 || nx >= WD.w - 1 || ny >= WD.h - 1 || prev.has(key(nx, ny)) || !passable(tileAt(nx, ny))) continue; prev.set(key(nx, ny), key(x, y)); q.push([nx, ny]); }
    }
    if (!prev.has(key(gx, gy))) return null;
    const out = []; for (let k = key(gx, gy); k !== -1; k = prev.get(k)) out.push([k % WD.w, Math.floor(k / WD.w)]); return out.reverse();
  }
  const tileOf = e => [Math.floor(e.x / 16), Math.floor((e.y - 2) / 16)];
  function goto(tx, ty) { // one step of walking toward a tile; returns true when there
    const [px, py] = tileOf(PL);
    if (px === tx && py === ty) return true;
    const p = bfs(px, py, tx, ty); if (!p || p.length < 2) { return false; }
    const [nx, ny] = p[1], cx = nx * 16 + 8, cy = ny * 16 + 14;
    const next = tileAt(nx, ny);
    if ((next === 'L' && WD.laser) || (next === 'M' && !WD.laser)) return false;
    if (next === 'W' && !PL.phase) { if (S.ecto < 25) return false; hold('b'); }
    if (PL.phase) hold('b');
    if (PL.x < cx - 2) hold('right'); else if (PL.x > cx + 2) hold('left');
    if (PL.y < cy - 2) hold('down'); else if (PL.y > cy + 2) hold('up');
    return false;
  }
  function menuPick(m) {
    const o = m.opts.map(s => String(s).toUpperCase()); let i = 0;
    const find = re => o.findIndex(s => re.test(s));
    if (find(/^ADMIT/) >= 0) i = W8.honest ? find(/^ADMIT/) : find(/^PERFORM/);
    else if (find(/^STAY/) >= 0) i = W8.end === 'encore' ? find(/^EXIT/) : W8.end === 'canceled' ? find(/^CANCEL/) : find(/^STAY/);
    else if (DBG.truth !== undefined) i = W8.honest ? DBG.truth : (DBG.truth + 1) % o.length;
    else if (find(/^ANSWER/) >= 0) i = find(/^ANSWER/);
    else if (find(/^TELL THE TRUTH|^SAY IT/) >= 0) i = find(/^TELL THE TRUTH|^SAY IT/);
    else if (find(/^NEW SHOW|^NEW GAME/) >= 0) i = find(/^NEW/);
    else if (EPS[S && S.ep] && EPS[S.ep].cards && EPS[S.ep].cards.some(c => c[0] === o[0])) { const g = EPS[S.ep].cards.findIndex(c => c[3]); i = g < 0 ? 0 : g; }
    else if (find(/^CAST|^DRAW/) >= 0) i = find(/^CAST|^DRAW/);
    m.i = i; return i;
  }
  function ui() {
    if (MENUS.length) { menuPick(MENUS[0]); if (F % 6 === 0) press('a'); return; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); return; }
    if (DLG) { const s = (DLG.who ? DLG.who + ': ' : '') + DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L(s); } if (F % 3 === 0) press('a'); return; }
    if (CHATBOX) { if (F % 20 === 0) press('a'); return; }
  }
  function gotoNear(tx, ty) { // walk to the target, or to a free tile beside it when it is solid
    const [px, py] = tileOf(PL);
    if (passable(tileAt(tx, ty))) return goto(tx, ty);
    let best = null; for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const p = bfs(px, py, tx + dx, ty + dy); if (p && (!best || p.length < best.length)) best = p; }
    if (!best) return false; return goto(best[best.length - 1][0], best[best.length - 1][1]);
  }
  function markGoal() {
    let best = null, bd = 1e9; const [px, py] = tileOf(PL);
    for (const e of WD.ents) if (e.kind === 'mark' && live(e) && !e.fleeT && !F2m(e)) { const d = Math.abs(e.x - PL.x) + Math.abs(e.y - PL.y); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  const F2m = e => false;
  function haunt(e) {
    const dx = PL.x - e.x, dy = PL.y - e.y, d = Math.hypot(dx, dy), dot = (dx * e.fx + dy * e.fy) / (d || 1);
    if (d < 20 && dot < -.3) { press('a'); return; }
    // walk to the spot behind him (a tile or two back), then close in
    const bx = e.x - e.fx * 13, by = e.y - e.fy * 13;
    let tx = Math.floor(bx / 16), ty = Math.floor((by - 2) / 16);
    if (!passable(tileAt(tx, ty)) || tileAt(tx, ty) === 'W') { tx = Math.floor(e.x / 16); ty = Math.floor((e.y - 2) / 16); }
    if (d < 30 && dot < -.1) { // close: steer by pixels so we stay behind him
      if (PL.x < bx - 2) hold('right'); else if (PL.x > bx + 2) hold('left'); if (PL.y < by - 2) hold('down'); else if (PL.y > by + 2) hold('up'); return;
    }
    goto(tx, ty);
  }
  // a person keeps out of the yellow: if a collector is about to see us, back away from him
  function dodge() {
    for (const e of WD.ents) if (e.kind === 'collector' && live(e) && e.state !== 2) {
      const dx = PL.x - e.x, dy = PL.y - e.y, d = Math.hypot(dx, dy);
      if (d < e.vis + 12 && (dx * e.fx + dy * e.fy) / (d || 1) > .35 && los(e.x, e.y, PL.x, PL.y)) {
        // slide sideways out of his cone (perpendicular to his facing), toward the open side
        const px = -e.fy, py = e.fx, side = (dx * px + dy * py) >= 0 ? 1 : -1;
        if (px) { hold(side * px > 0 ? 'right' : 'left'); } if (py) { hold(side * py > 0 ? 'down' : 'up'); }
        if (d < 40) { if (e.fx) hold(e.fx > 0 ? 'right' : 'left'); if (e.fy) hold(e.fy > 0 ? 'down' : 'up'); }
        return true;
      }
    }
    return false;
  }
  function worldTick() {
    if (WD.hold || post.fade > .5) return;
    if (!W8.reckless && dodge()) return;
    // watchdog
    const [px, py] = [PL.x | 0, PL.y | 0];
    if (Math.abs(px - lastPos[0]) + Math.abs(py - lastPos[1]) < 1) stuck++; else stuck = 0; lastPos = [px, py];
    if (stuck > 900) { L('STALL at ' + px + ',' + py + ' ' + WD.id + ' goal=' + goalName); stuck = 0; jig = 60; }
    if (jig > 0) { jig--; hold(['up', 'down', 'left', 'right'][(F >> 4) & 3]); return; }
    const M = WD.M;
    // 1. cue cards
    if (W8.cards) for (const e of WD.ents) if (e.kind === 'card' && live(e)) {
      const [cx, cy] = [Math.floor(e.x / 16), Math.floor((e.y - 2) / 16)], [px, py] = tileOf(PL);
      if (!bfs(px, py, cx, cy)) continue; // behind a sigil door: come back after it is open
      goalName = 'card' + e.n; goto(cx, cy); return;
    }
    // 2. applause
    if (WD.quota && S.applause < WD.quota) {
      const m = markGoal();
      if (m) { goalName = 'mark ' + m.id; haunt(m); return; }
    }
    // 3. story talkers (not the star door)
    for (const e of WD.ents) if (e.kind === 'prop' && e.talk && live(e) && !e.skipBot && !(e.done && e.done())) { goalName = 'talk ' + e.id; const d = dist(e, PL); if (d < 22) { press('a'); return; } if (gotoNear(Math.floor(e.x / 16), Math.floor((e.y - 2) / 16)) === false && d < 40) press('a'); return; }
    // 4. the star door
    const door = WD.ents.find(e => e.kind === 'door' && live(e));
    if (door) { goalName = 'door'; const d = dist(door, PL); if (d < 26) { press('a'); return; } goto(Math.floor(door.x / 16), Math.floor((door.y + 8) / 16)); return; }
    // 5. exits / free roam: nothing to do
    goalName = 'idle';
  }
  function sigilTick() { const g = DBG.sg; if (!g) return; const n = g.got(); if (n < g.seq.length && F % 8 === 0) { const k = g.seq[n]; kb[k] = 1; want[k] = 1; } }
  function dsTick() { const d = DBG.ds && DBG.ds(); if (!d) return; if (d.gx < d.sx - 3) hold('right'); else if (d.gx > d.sx + 3) hold('left'); }
  function danceTick() { const w = DANCE.want; if (w) press(w); }
  function tick() {
    F++;
    if (CARD || DLG || MENUS.length || CHATBOX) { ui(); apply(); return; }
    const m = DBG.mode;
    if (m === 'sigil') sigilTick(); else if (m === 'descend') dsTick(); else if (m === 'dance') danceTick();
    else if (scene === worldScene) worldTick();
    apply();
  }
  return { tick, set: o => Object.assign(W8, o), W8, log: L };
})();
