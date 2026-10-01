// SAVE THE WORLD test bot: injected into the game context by swplay.js. It presses buttons; it follows G.obj like the TALK hint does.
var BOT = (() => {
  const B0 = { done: 0, log: s => __log('[' + frame + '] ' + s) };
  let want = {}, hold = {}, lastProg = 0, lastKey = '', stuckN = 0, plan = null, wTick = 0, lastMap = null, shopped = {};
  const press = k => { want[k] = 1; };
  const tap = k => { if ((frame & 1) === 0) want[k] = 1; }; // a press needs a release in between
  function tick() {
    want = {};
    try { decide(); } catch (e) { B0.log('BOTERR ' + (e.stack || e)); }
    for (const k in want) kb[k] = 1;
  }
  const W8 = typeof process === 'undefined' ? {} : process.env;
  function decide() {
    if (DBG.credits || (B0.until && B0.until())) { B0.done = 1; return; }
    if (DBG.fdbg && frame % 30 === 0) B0.log('DEC scene=' + (scene === fieldScene ? 'field' : scene === worldScene ? 'world' : scene === menuScene ? 'menu' : 'other') + ' busy=' + busy + ' lock=' + FIELD_LOCK + ' dlg=' + !!DLG + ' menus=' + MENUS.length + ' B=' + !!(B && !B.done));
    if (typeof TITLE !== 'undefined' && TITLE.opts.length && scene && !G.map && !G.inWorld && !M) { if (TITLE.opts[TITLE.i] !== 'NEW GAME') tap('down'); else tap('a'); return; }
    if (CARD) { tap('a'); return; }
    if (MENUS.length) { const m = MENUS[MENUS.length - 1]; const want = pickMenu(m); if (m.i !== want) tap(want > m.i ? 'down' : 'up'); else tap('a'); return; }
    if (DLG) { tap('a'); return; }
    if (B && !B.done) { battleBot(); return; }
    if (scene === menuScene) { tap('b'); return; }
    if (scene && scene !== fieldScene && scene !== worldScene && G && (G.map || G.inWorld || M)) { tap('a'); return; } // cutscenes, panels
    if (FIELD_LOCK || busy > 1) { if (DLG) tap('a'); return; }
    if (scene === worldScene) { if (!busy) worldBot(); return; }
    if (scene === fieldScene && !busy) fieldBot();
    if (scene !== fieldScene && scene !== worldScene && scene !== menuScene && !(B && !B.done)) tap('a'); // cutscenes, panels
  }
  // menus from choose()/ask(): story answers, else the first option
  function pickMenu(m) {
    const o = m.opts.map(s => String(s));
    if (BOT.answer) { const i = BOT.answer(o); if (i >= 0) return i; }
    if (DBG.aria !== undefined && o.length === 3) return DBG.aria;
    if (o.includes('BEST FOUR')) return o.indexOf('BEST FOUR');
    if (o.includes('DONE')) return o.indexOf('DONE');
    if (o.some(s => s.startsWith('SLOT'))) return 0;
    if (o.includes('NEW GAME')) return o.indexOf('NEW GAME');
    if (o.includes('STAY')) return G.gp >= 100 ? o.indexOf('STAY') : o.indexOf('NO THANKS');
    if (o.includes('USE SLEEPING BAG')) return o.indexOf('NEVER MIND');
    return 0;
  }
  // ---------------- battles ----------------
  let bplan = null;
  function battleBot() {
    if (DBG.bdbg && frame % 120 === 0) B0.log('BDBG menu=' + (B.menu ? (B.menu.title || '-') + ':' + B.menu.items.map(i => i.t).join('|') + '@' + B.menu.i : 'none') + ' cursor=' + (B.cursor ? B.cursor.units.map(u => u.name).join('+') : 'none') + ' plan=' + (bplan ? bplan.cmd + '/' + bplan.sub + '->' + (bplan.target && bplan.target.name) : 'none') + ' ready=' + B.readyQ.map(u => u.name) + ' acting=' + B.acting + ' q=' + B.actQ.length);
    if (B.results) { tap('a'); return; }
    const m = B.menu;
    if (B.weld || B.accuse || B.reels) return;
    if (!m && !B.cursor) return;
    const u = B.party.find(p => p === (B.menu && B.menu.who)) || B.readyQ && B.party.find(p => B.menu && m.title === p.name) || B.party.find(p => m && m.title === p.name);
    if (m && m.title && (!bplan || bplan.menu !== m)) { bplan = plan4(B.party.find(p => p.name === m.title)); if (bplan) bplan.menu = m; }
    if (!bplan) { tap('b'); return; }
    if (B.cursor) { // aim
      const cur = B.cursor.units, t = bplan.target;
      if (bplan.all) { if (cur.length > 1 || (cur.length === 1 && (bplan.allForced))) { tap('a'); return; } tap('c'); return; }
      if (!t || (t.hp <= 0 && !bplan.dead)) { tap('a'); return; }
      if (cur[0] === t) { tap('a'); return; }
      if (cur[0].side !== t.side) { tap(t.side === 'e' ? 'left' : 'right'); return; }
      tap('down'); return;
    }
    // walk the list to the label we want
    const label = m.title ? bplan.cmd : bplan.sub;
    const idx = m.items.findIndex(it => it.t === label || it.t.startsWith(label));
    if (idx < 0) { tap('b'); bplan = null; return; }
    if (m.i !== idx) { tap(idx > m.i ? 'down' : 'up'); return; }
    tap('a');
  }
  function plan4(u) {
    if (!u) return null;
    const foes = foesAlive(), weakest = foes.slice().sort((a, b) => a.hp - b.hp)[0], party = B.party;
    const hurt = party.filter(p => p.hp > 0 && p.hp < p.mhp * .4).sort((a, b) => a.hp / a.mhp - b.hp / b.mhp)[0], ko = party.find(p => p.hp <= 0);
    const L = cmdList(u).filter(c => !c[1]).map(c => c[0]);
    const known = knownSpells(u.r);
    if (L.includes('ARMOR')) { const b = BEAMS.filter(b => !b.only || b.only === u.id); if (hurt && rnd(2)) return { cmd: 'ARMOR', sub: 'REFUND', target: hurt }; const bm = b.find(x => x.tgt === 'all') && foes.length > 1 ? b.find(x => x.tgt === 'all') : b[rnd(3)]; return { cmd: 'ARMOR', sub: bm.name, target: weakest, all: bm.tgt === 'all', allForced: 1 }; }
    if (ko && invHas('extralife') && L.includes('ITEM')) return { cmd: 'ITEM', sub: 'EXTRA LIFE', target: ko, dead: 1 };
    if (ko && known.includes('cont') && u.mp >= 30) return { cmd: 'MAGIC', sub: 'CONTINUE', target: ko, dead: 1 };
    if (hurt) {
      const heal = ['best', 'betterer', 'better'].find(s => known.includes(s) && u.mp >= SPELLS[s].mp);
      if (heal && L.includes('MAGIC')) return { cmd: 'MAGIC', sub: SPELLS[heal].name, target: hurt };
      const it = ['feast', 'meal', 'snack'].find(k => invHas(k)); if (it && L.includes('ITEM')) return { cmd: 'ITEM', sub: ITEMS[it].name, target: hurt };
    }
    if (u.id === 'kid') return foes.length > 2 && rnd(2) ? { cmd: 'PERFORM' } : { cmd: rnd(3) ? 'ASK' : 'INSPECT', target: weakest };
    if (L.includes('WELD') && rnd(3)) { const w = WELDS.filter(w => w.lv <= u.lv && w.pow).pop(); if (w) return { cmd: 'WELD', sub: w.name, target: weakest, all: w.tgt === 'all', allForced: 1 }; }
    if (L.includes('ACCUSE') && rnd(2)) { DBG.botAccuse = foes.length > 1 ? 1 : 0; return { cmd: 'ACCUSE', target: weakest, all: foes.length > 1, allForced: 1 }; }
    if (L.includes('INVENT') && G.gadgets.length && rnd(2)) { const g = foes.length > 1 && G.gadgets.includes('pitch') ? 'pitch' : G.gadgets[0]; return { cmd: 'INVENT', sub: GADGETS[g].name, target: weakest, all: GADGETS[g].tgt === 'all', allForced: 1 }; }
    if (L.includes('SEGMENT') && rnd(3) === 0) return { cmd: 'SEGMENT' };
    const off = ['hottest', 'coldest', 'zappiest', 'hotter', 'colder', 'zapper', 'hot', 'cold', 'zap'].filter(s => known.includes(s) && u.mp >= SPELLS[s].mp + 6);
    const weakEl = off.find(s => (weakest.d.weak || []).includes(SPELLS[s].elem));
    if (L.includes('MAGIC') && (weakEl || (off.length && (u.id === 'yoko' || u.id === 'linda') && rnd(3)))) { const s = weakEl || off[0]; return { cmd: 'MAGIC', sub: SPELLS[s].name, target: weakest }; }
    if (L.includes('FIGHT')) return { cmd: 'FIGHT', target: weakest };
    return { cmd: L[0], target: weakest };
  }
  DBG.botWeld = 1; DBG.botReel = 1; DBG.botEnding = 0;
  // ---------------- the field ----------------
  function goal() {
    const o = G.obj; if (!o) return null;
    if (o.map === null || o.map === undefined) return { world: 1, x: o.x, y: o.y };
    return { map: o.map, x: o.x, y: o.y };
  }
  // the map graph: which exit leads where
  function route(from, to) { // returns the first exit to take from map 'from' toward map 'to' (or 'world')
    const prev = { [from]: null }, Q = [from];
    while (Q.length) { const m = Q.shift(); if (m === to) break;
      const ex = m === 'world' ? Object.values(PLACES).filter(p => p.to && (!p.if || p.if())).map(p => ({ to: p.to[0], via: p })) : (MAPS[m].exits || []).filter(e => !e.if || e.if()).map(e => ({ to: e.to, via: e }));
      for (const e of ex) { if (!e.to || e.to in prev) continue; prev[e.to] = [m, e.via]; Q.push(e.to); } }
    if (!(to in prev)) return null; let k = to; while (prev[k] && prev[k][0] !== from) k = prev[k][0]; return prev[k] ? prev[k][1] : null;
  }
  function nearestWorldExit(gl) {
    const ex = (MAPS[G.map].exits || []).filter(e => e.to === 'world' && (!e.if || e.if()));
    if (!ex.length) { const r = route(G.map, 'world'); return r; }
    return ex.sort((a, b) => (Math.abs(a.wx - gl.x) + Math.abs(a.wy - gl.y)) - (Math.abs(b.wx - gl.x) + Math.abs(b.wy - gl.y)))[0];
  }
  function stepToward(tx, ty, adjacentOk) {
    const p = adjacentOk ? '' : pathTo(tx, ty, null, 1); if (!p) { if (adjacentOk) { let best = null; for (const [dx, dy, d] of [[0, 1, 'u'], [0, -1, 'd'], [1, 0, 'l'], [-1, 0, 'r']]) { if (PL.x === tx + dx && PL.y === ty + dy) { if (PL.dir !== d) hold1(d); else tap('a'); return 1; } if (blocked(tx + dx, ty + dy)) continue; const q = pathTo(tx + dx, ty + dy, null, 1); if (q && (!best || q.length < best.length)) best = q; } if (best) { hold1(best[0]); return 1; } } return 0; }
    hold1(p[0]); return 1;
  }
  const hold1 = d => { want[{ u: 'up', d: 'down', l: 'left', r: 'right' }[d]] = 1; };
  function fieldBot() {
    if (DBG.fdbg && frame % 30 === 0) B0.log('FDBG map=' + G.map + ' at ' + PL.x + ',' + PL.y + ' obj=' + JSON.stringify(G.obj) + ' lock=' + FIELD_LOCK + ' busy=' + busy);
    if (PL.mv) return;
    if (G.map !== lastMap) { lastMap = G.map; autoShop(); healUp(); }
    const gl = goal(); if (!gl) { stuck('no objective'); return; }
    let tx, ty;
    if (gl.map === G.map) { tx = gl.x; ty = gl.y; }
    else { const e = gl.world ? nearestWorldExit(gl) || route(G.map, 'world') : route(G.map, gl.map); if (!e) { stuck('no route ' + G.map + ' -> ' + (gl.map || 'world')); return; } tx = e.x; ty = e.y; if ((e.w || 1) > 1 || (e.h || 1) > 1) { let best = null; for (let i = 0; i < (e.w || 1); i++) for (let j = 0; j < (e.h || 1); j++) { const x = e.x + i, y = e.y + j; if (PL.x === x && PL.y === y) { best = [x, y, 0]; i = 99; break; } const p = pathTo(x, y, null, 1); if (p && (!best || p.length < best[2])) best = [x, y, p.length]; } if (best) { tx = best[0]; ty = best[1]; } } }
    if (PL.x === tx && PL.y === ty) { if (exitAt(tx, ty)) { for (const d of ['d', 'u', 'l', 'r']) { const [dx, dy] = DIRV[d]; if (!blocked(tx + dx, ty + dy) && !exitAt(tx + dx, ty + dy)) { hold1(d); return; } } } tap('a'); progress(); return; }
    const solid = blocked(tx, ty) && !exitAt(tx, ty);
    if (!stepToward(tx, ty, solid)) stuck('no path to ' + tx + ',' + ty + ' on ' + G.map);
    else progress();
  }
  // the airship: fly to a landing spot from which the objective can be walked to
  let landFor = null;
  function landingSpot(tx, ty) {
    const key = (x, y) => x + y * WW, seen = new Set([key(tx, ty)]), Q = [[tx, ty]], ok = [];
    while (Q.length) { const [x, y] = Q.shift(); if (LANDABLE.has(wtile(x, y)) && !placeAt(x, y)) ok.push([x, y]); if (ok.length > 60) break;
      for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) { const nx = x + dx, ny = y + dy, k = key(nx, ny); if (seen.has(k) || !worldPass(nx, ny)) continue; seen.add(k); Q.push([nx, ny]); } }
    return ok;
  }
  function airBot(tx, ty) {
    if (!landFor || landFor.t !== tx + ',' + ty) { const L = landingSpot(tx, ty); const ax = AIR.x / TS, ay = AIR.y / TS; L.sort((a, b) => Math.hypot(a[0] - tx, a[1] - ty) * 3 + Math.hypot(a[0] - ax, a[1] - ay) * .2 - (Math.hypot(b[0] - tx, b[1] - ty) * 3 + Math.hypot(b[0] - ax, b[1] - ay) * .2)); landFor = { t: tx + ',' + ty, at: L[0] }; }
    const at = landFor.at; if (!at) { stuck('no landing near ' + tx + ',' + ty); return; }
    const gx = at[0] * TS + 8, gy = at[1] * TS + 8, dx = gx - AIR.x, dy = gy - AIR.y, d = Math.hypot(dx, dy);
    if ((AIR.x / TS | 0) === at[0] && (AIR.y / TS | 0) === at[1]) { if (AIR.sp > 1) return; tap('b'); return; }
    let diff = Math.atan2(dy, dx) - AIR.a; while (diff > Math.PI) diff -= Math.PI * 2; while (diff < -Math.PI) diff += Math.PI * 2;
    if (Math.abs(diff) > .06) want[diff > 0 ? 'right' : 'left'] = 1;
    if (Math.abs(diff) < .5 && d > 10) want.up = 1; else if (d < 24) want.down = 1;
    progressAir();
  }
  let lastAir = 0, airBest = 1e9;
  function progressAir() { const k = Math.round(AIR.x / 8) + ',' + Math.round(AIR.y / 8); if (k !== lastKey) { lastKey = k; lastProg = frame; } else if (frame - lastProg > 900) { stuck('air not moving'); lastProg = frame; } }
  function worldBot() {
    if (G.vehicle === 'air') { const gl = goal(); if (!gl) return; let tx = gl.x, ty = gl.y; if (!gl.world) { const e = route('world', gl.map); if (!e) { stuck('no air route to ' + gl.map); return; } tx = e.x; ty = e.y; } airBot(tx, ty); return; }
    if (WP.mv) return;
    if (!lastMap || lastMap !== 'world') { lastMap = 'world'; healUp(); }
    const gl = goal(); if (!gl) { stuck('no objective (world)'); return; }
    let tx = gl.x, ty = gl.y;
    if (!gl.world) { const e = route('world', gl.map); if (!e) { stuck('no world route to ' + gl.map); return; } tx = e.x; ty = e.y; }
    const p = worldPath(WP.x, WP.y, tx, ty); if (p === null) { if (G.ship) { const q = worldPath(WP.x, WP.y, G.ship.x, G.ship.y); if (q && q.length) { hold1(q[0]); progress(); return; } } stuck('no world path to ' + tx + ',' + ty); return; }
    if (!p.length) { tap('a'); return; }
    hold1(p[0]); progress();
  }
  let wpCache = null;
  // places whose map has more than one way back out to the world (caves) work like tunnels
  function portals() { const P = {}; for (const k in PLACES) { const p = PLACES[k]; if (!p.to || (p.if && !p.if())) continue; const m = MAPS[p.to[0]]; if (!m) continue; const outs = (m.exits || []).filter(e => e.to === 'world' && !e.run && (!e.if || e.if())).map(e => [e.wx, e.wy]).filter(([x, y]) => !(x === p.x && y === p.y)); if (outs.length) P[p.x + p.y * WW] = outs; } return P; }
  function worldPath(sx, sy, tx, ty) {
    const key = (x, y) => x + y * WW, prev = new Int32Array(WW * WH).fill(-1), dirs = new Uint8Array(WW * WH), Q = [key(sx, sy)]; prev[key(sx, sy)] = key(sx, sy);
    const PT = portals();
    while (Q.length) { const k = Q.shift(), x = k % WW, y = (k / WW) | 0; if (x === tx && y === ty) break;
      if (PT[k] && k !== key(sx, sy) && dirs[k] !== 4) { for (const [px, py] of PT[k]) { const nk = key(px, py); if (prev[nk] < 0) { prev[nk] = k; dirs[nk] = 4; Q.push(nk); } } continue; }
      for (const [dx, dy, d] of [[0, -1, 0], [0, 1, 1], [-1, 0, 2], [1, 0, 3]]) { const nx = x + dx, ny = y + dy, nk = key(nx, ny); if (nx < 0 || ny < 0 || nx >= WW || ny >= WH || prev[nk] >= 0) continue; if (!(nx === tx && ny === ty) && !worldPass(nx, ny)) continue; if (((placeAt(nx, ny) && !PT[nk]) || (G.ship && G.ship.x === nx && G.ship.y === ny)) && !(nx === tx && ny === ty)) continue; prev[nk] = k; dirs[nk] = d; Q.push(nk); } }
    if (prev[key(tx, ty)] < 0) return null; const out = []; let k = key(tx, ty); while (k !== key(sx, sy)) { out.unshift('udlrT'[dirs[k]]); k = prev[k]; } return out;
  }
  function progress() { const k = (G.inWorld ? 'W' : G.map) + ':' + (G.inWorld ? WP.x + ',' + WP.y : PL.x + ',' + PL.y); if (k !== lastKey) { lastKey = k; lastProg = frame; stuckN = 0; } else if (frame - lastProg > 600) { stuck('not moving at ' + k); lastProg = frame; } }
  function stuck(why) { if (++stuckN % 300 === 1) B0.log('STUCK ' + why + ' obj=' + JSON.stringify(G.obj)); if (stuckN > 3000) { B0.log('GIVING UP'); B0.done = 1; } const d = 'udlr'[rnd(4)]; if (frame % 40 < 20) hold1(d); }
  // between fights: patch everyone up with what's in the bag; buy upgrades where there's a shop
  function healUp() {
    for (const r of partyHeroes()) {
      if (r.hp <= 0 && invHas('extralife')) { invAdd('extralife', -1); r.hp = Math.floor(r.mhp / 4); }
      while (r.hp > 0 && r.hp < r.mhp * .6) { const k = ['meal', 'snack'].find(k => invHas(k)); if (!k) break; invAdd(k, -1); r.hp = Math.min(r.mhp, r.hp + ITEMS[k].heal); }
      const healer = partyHeroes().find(h => h.hp > 0 && knownSpells(h).includes('better') && h.mp >= 5);
      while (healer && r.hp > 0 && r.hp < r.mhp * .7 && healer.mp >= 5) { healer.mp -= 5; r.hp = Math.min(r.mhp, r.hp + 60 + healer.lv * 6); }
    }
  }
  function autoShop() {
    if (!M) return; const shops = M.npcs.filter(n => n.talk && /shop\(/.test(n.talk.toString())); if (!shops.length || shopped[G.map + G.gp]) return; shopped[G.map + G.gp] = 1;
    for (const n of shops) { const src = n.talk.toString(), m = src.match(/\[([^\]]+)\]/); if (!m) continue; const stock = m[1].split(',').map(s => s.trim().replace(/'/g, ''));
      // equipment upgrades first
      for (const r of Object.values(G.roster)) for (const slot of ['w', 'a', 'h']) {
        const cur = r.eq[slot] ? EQUIP[r.eq[slot]] : null, sc = e => (e.atk || 0) + (e.def || 0) + (e.mdef || 0) / 2 + (e.mag || 0);
        const best = stock.filter(k => EQUIP[k] && EQUIP[k].slot === slot && canEquip(r.id, EQUIP[k]) && EQUIP[k].price <= G.gp && (!cur || sc(EQUIP[k]) > sc(cur))).sort((a, b) => sc(EQUIP[b]) - sc(EQUIP[a]))[0];
        if (best) { G.gp -= EQUIP[best].price; invAdd(best); optimum(r); B0.log('BUY ' + best + ' for ' + r.id); }
      }
      for (const [k, n] of [['snack', 6], ['meal', 4], ['extralife', 3], ['antivirus', 2], ['coffee', 2], ['tent', 1]]) if (stock.includes(k) && (G.inv[k] || 0) < n && G.gp > ITEMS[k].price * 3) { const q = n - (G.inv[k] || 0); G.gp -= ITEMS[k].price * q; invAdd(k, q); }
    }
    for (const r of Object.values(G.roster)) optimum(r);
  }
  return Object.assign(B0, { tick, worldPath, portals });
})();
