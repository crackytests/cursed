// DARK MONDAY autopilot. Runs inside the game's context: BOT.tick() once per frame, pressing real inputs (kb.*).
// It explores: picks up loot, uses keys, pulls levers, steps on plates, fights what comes, rests when hurt, takes the stairs.
const BOT = (() => {
  const B = { log: [], f: 0, idle: 0, goalLog: '', stuck: 0, lastPos: '', want: {} };
  const out = s => { if (B.log.length < 4000) B.log.push(s); };
  let rel = null;
  const press = k => { kb[k] = 1; rel = k; if (B.trace) out('BOT press ' + k + ' @' + B.f + ' ' + B.goalLog + ' pos ' + GM.x + ',' + GM.y + ',' + GM.dir + ' step ' + JSON.stringify(B.curStep)); };
  const lv = () => GM.lv, g = () => GM;
  const alive = () => PARTY.filter(c => !c.dead);
  const passable = (x, y, ign) => { const L = lv(), c = cellCh(L, x, y); if ('.pO<>T'.includes(c) || c === 'p') return !(L.npcs || []).some(n => n.x === x && n.y === y); if (c === 'D') { const d = L.st.door[x + ',' + y]; if (d.locked === 'TRIG') return d.open > .5; if (d.locked) return partyHas(d.locked); return true; } return false; };
  const bfs = (from, goalFn) => { // returns first step [dir, x, y] toward the nearest cell where goalFn is true, or null
    const L = lv(), prev = new Map(), q = [from], key = (x, y) => x + ',' + y; prev.set(key(from[0], from[1]), null);
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; if (goalFn(x, y) && (x !== from[0] || y !== from[1])) { let cur = key(x, y), p = prev.get(cur), stepTo = [x, y]; while (p && prev.get(key(p[0], p[1])) !== null && prev.get(key(p[0], p[1]))) { stepTo = p; p = prev.get(key(p[0], p[1])); } return { to: [x, y], step: stepTo }; }
      for (let d = 0; d < 4; d++) { const nx = x + DX[d], ny = y + DY[d], k = key(nx, ny); if (prev.has(k) || !passable(nx, ny)) continue; if (mobAt(L, nx, ny) && !(goalFn(nx, ny))) continue; prev.set(k, [x, y]); q.push([nx, ny]); } }
    return null;
  };
  const dirTo = (x, y) => { for (let d = 0; d < 4; d++) if (g().x + DX[d] === x && g().y + DY[d] === y) return d; return -1; };
  const face = d => { const diff = (d - g().dir + 4) & 3; if (diff === 0) return true; press(diff === 3 ? 'left' : 'right'); return false; };
  const stepToward = (x, y) => { // move one cell toward an adjacent target; open doors in the way
    const d = dirTo(x, y); B.curStep = [x, y, d]; if (d < 0) return false; if (!face(d)) return true;
    const c = cellCh(lv(), x, y), door = lv().st.door[x + ',' + y]; if (c === 'D' && door.open < .95) { if (door.to === undefined) press('a'); return true; } press('up'); return true;
  };
  const goTo = (tx, ty) => { const r = bfs([g().x, g().y], (x, y) => x === tx && y === ty); if (!r) return false; return stepToward(r.step[0], r.step[1]); };
  const nearMob = () => { const L = lv(), dm = distMap(L, g().x, g().y); let best = null, bd = 99; for (const m of liveMobs(L)) { const d = Math.abs(m.x - g().x) + Math.abs(m.y - g().y), pd = dm[m.y * L.w + m.x]; if (pd < 0 || !m.awake) continue; if ((!m.botIgnore || d <= 1) && d < bd) { bd = d; best = m; } } return best ? { m: best, d: bd } : null; };
  const inLine = m => { const g_ = g(); for (let d = 1; d <= RANGE; d++) { const x = g_.x + DX[g_.dir] * d, y = g_.y + DY[g_.dir] * d; if (isBlock(lv(), x, y)) return false; if (x === m.x && y === m.y) return d; } return 0; };
  const fight = () => {
    const n = nearMob(); if (!n) return false; const m = n.m, G = g();
    // heal first: spells from the healers, then pills from anybody's pack (a player would drag the pill to the hurt member)
    const hurt = alive().filter(c => c.hp < c.max * .5).sort((x, y) => x.hp / x.max - y.hp / y.max);
    if (hurt.length && B.f - (B.healT || 0) > 24) {
      const t = hurt[0], h = alive().find(c => ['FACE', 'YOKO'].includes(c.id) && c.sp >= 2 && c.cool[0] <= 0 && c.cool[1] <= 0 && !c.hold);
      if (h && castSpell(PARTY.indexOf(h), h.id === 'FACE' ? 'BACKUP' : 'SECOND CHANCE', PARTY.indexOf(t))) { B.healT = B.f; out('BOT heals ' + t.name); return true; }
      let best = null; for (const o of alive()) o.pack.forEach((id, i) => { if (id && /PILLS/.test(id) && (!best || (t.max - t.hp > 22 ? ITEMS[id].heal > ITEMS[best.id].heal : ITEMS[id].heal < ITEMS[best.id].heal))) best = { o, i, id }; });
      if (best) { const it = ITEMS[best.id]; t.hp = Math.min(t.max, t.hp + it.heal); best.o.pack[best.i] = null; B.healT = B.f; out('BOT gives ' + t.name + ' ' + it.name); return true; }
    }
    const dist = Math.abs(m.x - G.x) + Math.abs(m.y - G.y);
    if (MON[m.t].still && dist > 1) { const r = bfs([G.x, G.y], (x, y) => Math.abs(x - m.x) + Math.abs(y - m.y) === 1 && walkable(lv(), x, y)); if (r) { B.waitN = 0; return stepToward(r.step[0], r.step[1]); } }
    if (dist === 1) { const d = dirTo(m.x, m.y); if (!face(d)) return true; B.waitN = 0; PARTY.forEach((c, i) => { if (!c.dead) { if (c.cool[0] <= 0) attack(i, 0); } }); return true; }
    const dline = inLine(m); if (dline) { PARTY.forEach((c, i) => { if (!c.dead && c.cool[0] <= 0) attack(i, 0); }); return true; }
    // cast an attack spell if somebody has points
    const L = PARTY.findIndex(c => c.id === 'LINDA' && !c.dead && c.sp >= 2 && c.cool[0] <= 0); if (L >= 0 && dline) castSpell(L, 'MEMO');
    // face the way the mob will come, otherwise wait for it
    if (dist <= 6) { const r = bfs([m.x, m.y], (x, y) => x === G.x && y === G.y); if (r && dist > 1) { /* the mob comes to us: look along its approach if it is in a straight corridor */ if (G.x === m.x || G.y === m.y) { const d = G.x === m.x ? (m.y < G.y ? 0 : 2) : (m.x < G.x ? 3 : 1); if (!face(d)) return true; } } }
    B.waitN = (B.waitN || 0) + 1; if (B.waitN > 500) { m.botIgnore = 1; B.waitN = 0; out('BOT gives up waiting for a ' + m.t); return false; } return B.f % 120 < 100 ? (B.waiting = 1, true) : false;
  };
  const useStuff = () => {
    // pills when hurt and calm; rest when badly hurt and calm; eat when hungry
    for (const c of alive()) { if (c.food < 25) { const i = c.pack.findIndex(k => k && ITEMS[k].kind === 'food'); if (i >= 0) { useItem(c, ['pack', i]); return true; } } }
    const avg = alive().reduce((n, c) => n + c.hp / c.max, 0) / Math.max(1, alive().length);
    const lvn = lv().name, prep = (lvn === 'THE SANCTUM' && g().y <= 12 && g().x >= 17) || (lvn === 'THE SERVER CRYPT' && g().y >= 14 && g().x === 13);
    if ((avg < .55 || (prep && avg < .92)) && !nearMob()) { if (B.restT === undefined || B.f - B.restT > 400) { B.restT = B.f; run(rest); out('BOT rests'); return true; } }
    for (const c of PARTY) if (c.dead) { const f = PARTY.findIndex(p => p.id === 'FACE' && !p.dead && p.sp >= 5 && p.lvl >= 2 && p.cool[0] <= 0); if (f >= 0 && castSpell(f, 'REBOOT', PARTY.indexOf(c))) return true; }
    return false;
  };
  const stash = () => { // put whatever is held away; equip armor and weapons we can use
    if (HELD) { const c = PARTY.find(c => !c.dead && c.pack.includes(null)); if (!c) { HELD = null; return true; } const it = ITEMS[HELD]; let placed = false;
      if (it.kind === 'armor') { const w = PARTY.find(p => !p.dead && !p.eq[it.slot]); if (w) { grab(w, ['eq', it.slot]); placed = true; } }
      if (!placed) grab(c, ['pack', c.pack.indexOf(null)]); return true; }
    return false;
  };
  const goals = () => {
    const L = lv(), G = g(), here = G.x + ',' + G.y;
    // 1. loot
    const it = L.items.filter(i => passableCell(i.x, i.y) && !(B.skip || {})[i.id + i.x + i.y]);
    function passableCell(x, y) { return !!bfs([G.x, G.y], (a, b) => a === x && b === y) || (G.x === x && G.y === y); }
    if (it.length) { it.sort((a, b) => Math.abs(a.x - G.x) + Math.abs(a.y - G.y) - Math.abs(b.x - G.x) - Math.abs(b.y - G.y)); const t = it[0];
      if (t.x === G.x && t.y === G.y) { if (pickFront()) { return true; } L.items.splice(L.items.indexOf(t), 1); return true; }
      if (goTo(t.x, t.y)) { B.goalLog = 'item ' + t.id; return true; } (B.skip = B.skip || {})[t.id + t.x + t.y] = 1; }
    // 2. keys and doors that we can open now: walk to the cell facing it
    for (const k in L.st.door) { const d = L.st.door[k]; if (d.open > .5 || d.locked === 'TRIG' || (d.locked && !partyHas(d.locked)) || (B.doorDone || {})[k]) continue; const [dx, dy] = k.split(',').map(Number);
      if (!d.locked && passableFromHere(dx, dy)) continue; // plain doors open on the way
      if (d.locked) { const r = bfs([G.x, G.y], (x, y) => Math.abs(x - dx) + Math.abs(y - dy) === 1 && walkable(L, x, y)); if (r) { if (r.to[0] === G.x && r.to[1] === G.y) { const dd = dirTo(dx, dy); if (!face(dd)) return true; press('a'); (B.doorDone = B.doorDone || {})[k] = 1; return true; } if (goTo(r.to[0], r.to[1])) { B.goalLog = 'unlock ' + k; return true; } } } }
    function passableFromHere(x, y) { return !!bfs([G.x, G.y], (a, b) => a === x && b === y); }
    // 3. levers and buttons we have not pulled
    for (const k in L.decor) { const dc = L.decor[k]; if ((dc.k !== 'lever' && dc.k !== 'button') || L.st.dec[k] || (B.skipDec || {})[k]) continue; const [x, y, f] = k.split(','), d = { N: 0, E: 1, S: 2, W: 3 }[f], cx = +x + DX[d], cy = +y + DY[d];
      if (cx === G.x && cy === G.y) { const need = (d + 2) & 3; if (!face(need)) return true; press('a'); (B.skipDec = B.skipDec || {})[k] = 1; return true; }
      if (goTo(cx, cy)) { B.goalLog = 'lever ' + k; return true; } (B.skipDec = B.skipDec || {})[k] = 1; }
    for (const k in L.trig.touch) { const t = L.trig.touch[k], dc = L.decor[k]; if (!dc || L.st.dec[k] || (B.skipDec || {})[k] || dc.k === 'button') continue; const [x, y, f] = k.split(','), d = { N: 0, E: 1, S: 2, W: 3 }[f], cx = +x + DX[d], cy = +y + DY[d];
      if (t.opens && Object.keys(t.opens).every(dk => L.st.door[dk] && (L.st.door[dk].open > .5 || L.st.door[dk].to))) continue;
      if (cx === G.x && cy === G.y) { if (!face((d + 2) & 3)) return true; press('a'); B.touchN = (B.touchN || 0) + 1; if (B.touchN > 6) (B.skipDec = B.skipDec || {})[k] = 1; return true; }
      if (goTo(cx, cy)) { B.goalLog = 'touch ' + k; return true; } (B.skipDec = B.skipDec || {})[k] = 1; }
    // 4. plates and scene triggers
    for (const k in L.trig.plate) { if (L.st.mark[k]) continue; const [x, y] = k.split(',').map(Number); if (goTo(x, y)) { B.goalLog = 'plate ' + k; return true; } }
    for (const k in L.trig.step) { const t = L.trig.step[k]; if (!t.scene || GM.flags['t_' + GM.n + '_step' + k]) continue; const [x, y] = k.split(',').map(Number); if (goTo(x, y)) { B.goalLog = 'scene ' + k; return true; } }
    // 5. down the stairs, but only when everything else is done
    for (const k in L.stairs || {}) { const [x, y] = k.split(',').map(Number); if (G.x === x && G.y === y) return false; if (goTo(x, y)) { B.goalLog = 'stairs'; return true; } }
    return false;
  };
  B.tick = () => {
    B.f++; if (rel) { kb[rel] = 0; rel = null; return; }
    if (typeof GM === 'undefined' || !GM) { if (anyKey === false) anyKey = true; return; }
    if (CARD) { if (post.fade > .5 && !B.fail) B.fail = 'a card is up but the screen is faded to black: ' + CARD.lines[0]; if (CARD.lines[0].startsWith('END OF DISK') || CARD.lines[0] === 'THE END') B.done = 1; if (CARD.lines[0] === 'THE END') B.ended = 1; if (B.f % 4 === 0) press('a'); return; }
    if (DLG && !MENUS.length) { const s = (DLG.who ? DLG.who + ': ' : '') + DLG.lines.join(' '); if (s !== B.last) { B.last = s; out(s); } if (B.f % 3 === 0) press('a'); return; }
    if (MENUS.length) { if (DLG) { const s = (DLG.who ? DLG.who + ': ' : '') + DLG.lines.join(' '); if (s !== B.last) { B.last = s; out(s); } } const m = MENUS[0], W = B.want || {}; let k = -1;
      if ((k = m.opts.indexOf('MONDAY')) >= 0) m.i = k;
      else if (m.opts[0] === 'FIGHT IT') m.i = W.end === 'forgive' ? 1 : W.end === 'job' ? 2 : 0;
      else if (W.truth) { for (const id in MEMORY_Q) if (JSON.stringify(MEMORY_Q[id][1]) === JSON.stringify(m.opts)) m.i = MEMORY_Q[id][2]; }
      if (B.f % 6 === 0) press('a'); return; }
    if (CHATQ) { if (B.f % 6 === 0) press('a'); return; }
    if (INV.open) { INV.open = 0; return; }
    const G = g(); if (G.hold || G.over) return;
    const pos = G.x + ',' + G.y + ',' + G.dir; if (pos === B.lastPos) B.stuck++; else { B.stuck = 0; B.lastPos = pos; }
    if (G.anim) return;
    for (const c of PARTY) c.food = Math.max(c.food, 30); // the bot is not here to test hunger
    if (stash()) return; if (useStuff()) return; if (fight()) { B.stuck = 0; return; }
    if (B.stuck > 600) { B.fail = 'stuck at ' + pos + ' goal ' + B.goalLog; return; }
    if (!goals()) { const L = lv(); for (const k in L.stairs || {}) { const [x, y] = k.split(',').map(Number); if (G.x === x && G.y === y) return; } B.idle++; if (B.idle > 200) B.fail = 'nothing left to do at ' + pos; }
  };
  B.set = w => { B.want = w; }; B.fns = { goals, fight, useStuff, stash, goTo, bfs, passable, stepToward, dirTo, face };
  return B;
})();
