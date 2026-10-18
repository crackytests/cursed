'use strict';
// ================= DEUS EX NEVADA: guards, civilians, bots, cameras, turrets, lasers, alarms, pathfinding =================
// ---------- A* on the tile grid (8-way, no corner cutting) ----------
const AS = { g: null, f: null, from: null, open: null, n: 0 };
function canWalk(M, x, y, e) {
  if (!inMap(M, x, y)) return false; const i = y * M.w + x, t = M.t[i];
  if (t === T_VENT) return !!e.small; if (t === T_DEEP && !e.swims) return false;
  if (t === T_DOOR) { const d = M.doors[i]; if (!d) return true; if (d.broken || d.open) return true; if (d.lock && !d.unlocked && !(e.keys && e.keys[d.key]) && !(d.team && d.team === e.team)) return false; if (e.animal || (e.mech && !e.opensDoors)) return d.open; return true; }
  return !M.block[i];
}
function findPath(M, e, tx, ty, maxN = 3000) {
  const w = M.w, h = M.h, N = w * h; if (!AS.g || AS.g.length < N) { AS.g = new Float32Array(N); AS.from = new Int32Array(N); AS.stamp = new Int32Array(N); AS.closed = new Int32Array(N); AS.run = 0; }
  const run = ++AS.run, sx = e.x | 0, sy = e.y | 0; tx |= 0; ty |= 0; if (!inMap(M, tx, ty)) return null;
  if (!canWalk(M, tx, ty, e)) { let best = null, bd = 1e9; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (canWalk(M, tx + dx, ty + dy, e)) { const d = Math.abs(dx) + Math.abs(dy); if (d < bd) { bd = d; best = [tx + dx, ty + dy]; } } if (!best) return null; tx = best[0]; ty = best[1]; }
  const heap = [], push = (i, f) => { heap.push([f, i]); let k = heap.length - 1; while (k > 0) { const p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; [heap[p], heap[k]] = [heap[k], heap[p]]; k = p; } },
    pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = k * 2 + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top[1]; };
  const s = sy * w + sx, goal = ty * w + tx; AS.g[s] = 0; AS.stamp[s] = run; AS.from[s] = -1; push(s, 0); let n = 0;
  while (heap.length && n++ < maxN) {
    const c = pop(); if (c === goal) break; if (AS.closed[c] === run) continue; AS.closed[c] = run; const cx = c % w, cy = (c / w) | 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = cx + dx, ny = cy + dy; if (!canWalk(M, nx, ny, e)) continue;
      if (dx && dy && (!canWalk(M, cx + dx, cy, e) || !canWalk(M, cx, cy + dy, e))) continue;
      const ni = ny * w + nx, g = AS.g[c] + (dx && dy ? 1.414 : 1) + (M.t[ni] === T_DOOR ? .5 : 0);
      if (AS.stamp[ni] === run && AS.g[ni] <= g) continue; AS.stamp[ni] = run; AS.g[ni] = g; AS.from[ni] = c; push(ni, g + Math.hypot(nx - tx, ny - ty)); }
  }
  if (AS.stamp[goal] !== run) return null;
  const path = []; let c = goal; while (c !== -1 && c !== s) { path.push([(c % w) + .5, ((c / w) | 0) + .5]); c = AS.from[c]; } path.reverse(); return path;
}
let pathBudget = 0;
function goTo(M, e, x, y, speed) {
  if (!e.path || !e.pathGoal || Math.hypot(e.pathGoal[0] - x, e.pathGoal[1] - y) > 1.5 || e.repath <= 0) {
    if (pathBudget <= 0) return false; pathBudget--; e.path = findPath(M, e, x, y); e.pathGoal = [x, y]; e.repath = 90 + rnd(60); if (!e.path) return false; }
  e.repath--; return followPath(M, e, speed);
}
function followPath(M, e, speed) {
  if (!e.path || !e.path.length) { e.moving = 0; return true; }
  const [nx, ny] = e.path[0], ti = (ny | 0) * M.w + (nx | 0);
  if (M.t[ti] === T_DOOR) { const d = M.doors[ti]; if (d && !d.open) { if (Math.hypot(nx - e.x, ny - e.y) < 1.6) { openDoor(M, d, e); e.moving = 0; return false; } } }
  const dx = nx - e.x, dy = ny - e.y, d = Math.hypot(dx, dy);
  if (d < .15) { e.path.shift(); return !e.path.length; }
  const st = Math.min(d, speed * DT), ox = e.x, oy = e.y; moveBody(M, e, dx / d * st, dy / d * st); const mv = Math.hypot(e.x - ox, e.y - oy);
  e.face = Math.atan2(dy, dx); e.moving = mv > .001; e.walkPh += mv * 3;
  if (mv < st * .3) { e.stuck = (e.stuck || 0) + 1; if (e.stuck > 40) { e.path = null; e.stuck = 0; } } else e.stuck = 0;
  return false;
}
function openDoor(M, d, who) { if (d.open) return true; if (d.lock && !d.unlocked && who !== P && !(who.keys && who.keys[d.key]) && !(d.team && d.team === who.team)) return false; d.open = 1; sfx('door'); rebuildBlock(M); M.visDirty = 1; if (who !== P) d.closeT = 300; return true; }
function closeDoor(M, d) { if (!d.open || d.broken) return; const cx = d.x + .5, cy = d.y + .5; if (P.map === M && Math.hypot(P.x - cx, P.y - cy) < .8) return; for (const e of M.ents) if (e.k === 'npc' && !e.gone && Math.hypot(e.x - cx, e.y - cy) < .8) return; d.open = 0; sfx('door'); rebuildBlock(M); M.visDirty = 1; }

// ---------- perception ----------
const SUS_RATE = [1.2, 1.9, 2.8];
function seesPoint(M, e, x, y, range, fov) { const d = Math.hypot(x - e.x, y - e.y); if (d > range) return false; if (d > 1.3 && Math.abs(angDiff(e.face, Math.atan2(y - e.y, x - e.x))) > fov) return false; return clearLine(M, e.x, e.y, x, y); }
function perceive(M, e) {
  if (P.map !== M || P.dead) return false;
  const hostile = hostileTo(e, P); if (!hostile && !e.watchful) return false;
  let vis = playerVisibility(); if (e.mech) { if (P.augOn.radar || (P.charged.camo && P.charged.camo.on)) vis = 0; else if (P.augOn.cloak) vis = clamp(lightAt(M, P.x, P.y), .3, 1) * (P.crouch ? .55 : 1); }
  if (e.animal && P.augOn.cloak) vis = 0;
  const d = dist(e, P), effR = Math.max(1.2, e.viewR * (.3 + .7 * Math.min(1, vis))) * (vis <= 0 ? 0 : 1);
  const fov = e.state === 'combat' ? 1.7 : e.state === 'search' ? 1.25 : 1.0;
  const seen = d < effR && (d < 1.3 || Math.abs(angDiff(e.face, angTo(e, P))) < fov) && clearLine(M, e.x, e.y, P.x, P.y);
  e.seesP = seen;
  if (seen && hostile) {
    e.sus += DT * SUS_RATE[OPT.diff] * (1.4 - d / effR) * (e.state === 'sus' || e.state === 'search' ? 1.8 : 1) * (e.state === 'combat' ? 5 : 1);
    e.lastSeen = [P.x, P.y]; e.susPt = [P.x, P.y];
    if (e.sus >= 1 && e.state !== 'combat') enterCombat(M, e, P);
  }
  return seen;
}
function enterCombat(M, e, tgt) {
  if (e.state === 'combat' && e.target === tgt) return; const was = e.state; e.state = 'combat'; e.target = tgt; e.sus = 1; e.reactT = was === 'combat' ? 0 : 18 + rnd(18) - OPT.diff * 6; e.lastSeen = [tgt.x, tgt.y]; e.path = null;
  if (tgt === P) { if (!e.alerted) { e.alerted = 1; P.stealthLost++; } bark(M, e, 'spot'); chatReact('spotted', e); }
  // shout: friends nearby join
  for (const n of M.ents) if (n.k === 'npc' && n !== e && !n.dead && !n.down && n.team === e.team && n.ai === 'guard' && n.state !== 'combat' && dist(n, e) < 9) { n.state = 'search'; n.lastSeen = [tgt.x, tgt.y]; n.searchT = 8; n.sus = Math.max(n.sus, .6); }
}
function hearNoise(M, e) {
  for (const n of M.noise) { if (n.src === e || n.r <= 0) continue; const d = Math.hypot(n.x - e.x, n.y - e.y); if (d > n.r) continue;
    if (d > n.r * .5 && !clearLine(M, e.x, e.y, n.x, n.y)) continue; // walls muffle
    const loud = n.kind === 'gun' || n.kind === 'boom' || n.kind === 'crash' || n.kind === 'glass' || n.kind === 'alarm';
    if (e.ai === 'civ') { if (loud && n.kind !== 'alarm') { e.state = 'flee'; e.threat = n; } continue; }
    if (n.src === P && !hostileTo(e, P) && !(loud && n.kind === 'gun' && e.watchful)) continue;
    if (n.src && n.src.k === 'npc' && n.src.team === e.team && n.kind === 'gun' && n.src.state === 'combat') { if (e.state !== 'combat') { e.state = 'search'; e.lastSeen = n.src.target ? [n.src.target.x, n.src.target.y] : [n.x, n.y]; e.searchT = 8; } continue; }
    if (e.state === 'combat') continue;
    if (loud) { e.state = 'search'; e.lastSeen = [n.x, n.y]; e.searchT = 8; e.sus = Math.max(e.sus, .7); e.path = null; if (rnd(3) === 0) bark(M, e, 'hear'); }
    else if (e.state === 'idle' || e.state === 'return' || e.state === 'sus') { e.sus = Math.min(.95, e.sus + .35); e.susPt = [n.x, n.y]; if (e.state !== 'sus') { e.state = 'sus'; e.susT = 0; bark(M, e, 'hmm'); } }
  }
}
function checkBodies(M, e) {
  if (e.ai !== 'guard' || e.animal || e.mech) return;
  for (const o of M.ents) { if (o.k !== 'npc' || !o.down || o.bodyFound || o.carried || o.hidden) continue; if (o.team !== e.team && !(o.team === 'civ')) continue;
    if (dist(e, o) < 7 && seesPoint(M, e, o.x, o.y, 7, 1.1) && lightAt(M, o.x, o.y) > .2) { o.bodyFound = 1; e.state = 'search'; e.lastSeen = [o.x, o.y]; e.searchT = 12; e.sus = .9; bark(M, e, 'body'); M.bodyAlert = (M.bodyAlert || 0) + 1; chatSay(pick(['they found the body', 'BODY FOUND', 'should have hidden it', 'uh oh']), 1); for (const n of M.ents) if (n.k === 'npc' && n.team === e.team && n.ai === 'guard' && !n.dead && !n.down && dist(n, e) < 14 && n.state === 'idle') { n.state = 'search'; n.lastSeen = [o.x, o.y]; n.searchT = 10; } return; } }
}
function npcTarget(M, e) { // hostile npcs (team fights, scrambled bots)
  let best = null, bd = e.viewR; for (const o of M.ents) { if (o.k !== 'npc' || o === e || o.dead || o.down || !hostileTo(e, o)) continue; const d = dist(e, o); if (d < bd && (d < 2 || Math.abs(angDiff(e.face, angTo(e, o))) < 1.2 || e.state === 'combat') && clearLine(M, e.x, e.y, o.x, o.y)) { bd = d; best = o; } } return best;
}

// ---------- the NPC brain ----------
function updateNPC(M, e) {
  if (e.dead || e.gone || e.carried) return;
  if (e.hurtT > 0) e.hurtT--; if (e.flashT > 0) e.flashT--;
  if (e.down) { if (e.wakeT !== undefined && (e.wakeT -= DT) <= 0 && !e.dead) { e.down = 0; e.state = 'search'; e.lastSeen = [e.x, e.y]; e.searchT = 8; delete e.wakeT; } return; }
  if (e.fireT > 0) e.fireT--; if (e.scrambled > 0) { e.scrambled -= DT; if (e.scrambled <= 0) { e.scrambled = 0; e.state = 'idle'; } }
  if (e.tranq > 0) { e.tranq -= DT; if (e.tranq <= 0) { knockOut(M, e); return; } }
  if (e.burn > 0) { e.burn--; if (e.burn % 15 === 0) damageNPC(M, e, 3, P, { fire: 1 }); if (frame % 4 === 0) M.fx.push({ flash: 1, x: e.x, y: e.y, t: 6, t0: 6, r: 8, col: '#ff6020' }); }
  for (const f of M.fx) if (f.gas && !e.mech && Math.hypot(f.x - e.x, f.y - e.y) < f.r) { if (!e.stunT) bark(M, e, 'cough'); e.stunT = 50; if (!f.smoke && frame % 30 === 0) { e.gasT = (e.gasT || 0) + 1; if (e.gasT > 6) { knockOut(M, e); return; } } }
  if (e.stunT > 0) { e.stunT--; e.moving = 0; e.face += .08; if (e.stunT === 0 && e.ai === 'guard') { e.state = 'search'; e.lastSeen = [P.x, P.y]; e.searchT = 6; } return; }
  if (e.empT > 0) { e.empT--; e.moving = 0; return; }
  if (e.buffered && !e.frozen && rnd(600) === 0) { e.frozen = 60 + rnd(120); }
  if (e.frozen > 0) { e.frozen--; e.moving = 0; if (frame % 20 === 0 && P.map === M && dist(e, P) < 6) M.fx.push({ txt: pick(['...', 'b-b-', 'wh-what', '...buffering', 'I w-w-was']), x: e.x, y: e.y, t: 40, t0: 40, c: hex('#a0a0c0') }); return; }
  if (e.ai === 'static') { e.moving = 0; if (P.map === M && dist(e, P) < 3 && !e.fixedFace) e.face = angTo(e, P); return; }
  const seeP = perceive(M, e);
  if (e.state !== 'combat' && e.ai === 'guard' && frame % 6 === (e.uid.length % 6)) { const t = npcTarget(M, e); if (t) enterCombat(M, e, t); }
  if (e.ai === 'guard' || e.ai === 'follow') { hearNoise(M, e); if (frame % 15 === 0 && e.state !== 'combat') checkBodies(M, e); }
  else if (e.ai === 'civ') hearNoise(M, e);
  if (!seeP && e.state !== 'combat' && e.sus > 0) e.sus = Math.max(0, e.sus - DT * .12);
  const sp = (e.speed || 3.4) * (e.state === 'combat' || e.state === 'flee' ? 1 : e.state === 'search' ? .7 : .45);
  switch (e.state) {
    case 'idle': idleNPC(M, e, sp); if (e.ai === 'civ' && seeP === false && P.map === M && dist(e, P) < 2.5 && rnd(240) === 0) bark(M, e, 'near'); break;
    case 'sus': { e.susT = (e.susT || 0) + DT; e.moving = 0; if (e.susPt) { const a = Math.atan2(e.susPt[1] - e.y, e.susPt[0] - e.x); e.face += angDiff(e.face, a) * .1; }
      if (e.susT > 1.5 && e.susPt) goTo(M, e, e.susPt[0], e.susPt[1], sp * .8);
      if (e.sus <= 0.02 || e.susT > 9) { e.state = 'return'; e.path = null; bark(M, e, 'calm'); } break; }
    case 'search': { e.searchT = (e.searchT || 8); const at = e.lastSeen || [e.x, e.y]; const there = Math.hypot(at[0] - e.x, at[1] - e.y) < 1.2 || goTo(M, e, at[0], at[1], sp);
      if (there || !e.path) { e.moving = 0; e.face += Math.sin(G.t * 2 + e.x) * .05; e.searchT -= DT; if (e.searchT <= 0) { e.state = 'return'; e.path = null; e.sus = .3; bark(M, e, 'calm'); } } break; }
    case 'return': { if (e.routeName) { e.state = 'idle'; break; } const h = e.home; if (goTo(M, e, h[0], h[1], sp) || Math.hypot(h[0] - e.x, h[1] - e.y) < .4) { e.state = 'idle'; e.face = h[2]; e.moving = 0; } break; }
    case 'combat': combatNPC(M, e, sp); break;
    case 'flee': { const th = e.threat || P, a = Math.atan2(e.y - th.y, e.x - th.x); e.fleeT = (e.fleeT || 0) + DT;
      if (!e.fleePt || e.fleeT > 4) { e.fleeT = 0; let best = null; for (let k = 0; k < 8; k++) { const aa = a + (Math.random() - .5) * 2, r = 5 + Math.random() * 6, x = e.x + Math.cos(aa) * r, y = e.y + Math.sin(aa) * r; if (canWalk(M, x | 0, y | 0, e)) { best = [x, y]; break; } } e.fleePt = best || [e.x, e.y]; e.path = null; if (rnd(2) === 0) bark(M, e, 'flee'); }
      if (goTo(M, e, e.fleePt[0], e.fleePt[1], sp * 1.1)) { e.moving = 0; e.cower = (e.cower || 0) + DT; if (e.cower > 8 && e.ai === 'civ') { e.state = 'return'; e.cower = 0; } if (e.cower > 3 && e.ai === 'guard') { e.state = 'combat'; e.cower = 0; } } break; }
    case 'follow': { const t = npcTarget(M, e); if (t) { enterCombat(M, e, t); break; } if (P.map === M && dist(e, P) > 2.2) goTo(M, e, P.x, P.y, sp * 1.6); else e.moving = 0; break; }
    case 'talk': e.moving = 0; if (P.map === M) e.face = angTo(e, P); break;
  }
}
function idleNPC(M, e, sp) {
  if (e.follow) { e.state = 'follow'; return; }
  if (e.routeName && M.d.routes && M.d.routes[e.routeName]) {
    const r = M.d.routes[e.routeName], pts = r.split(','), wp = M.wps[pts[e.routeI % pts.length]]; if (!wp) return;
    if (e.waitT > 0) { e.waitT -= DT; e.moving = 0; e.face += Math.sin(G.t + e.x) * .01; return; }
    if (goTo(M, e, wp[0], wp[1], sp) || Math.hypot(wp[0] - e.x, wp[1] - e.y) < .3) { e.routeI++; e.waitT = 1.5 + Math.random() * 2.5; e.path = null; }
    return; }
  if (e.wander) { if (!e.wanderPt || e.wanderT <= 0) { const x = e.home[0] + (Math.random() - .5) * e.wander * 2, y = e.home[1] + (Math.random() - .5) * e.wander * 2; e.wanderPt = canWalk(M, x | 0, y | 0, e) ? [x, y] : [e.home[0], e.home[1]]; e.wanderT = 4 + Math.random() * 6; e.path = null; } e.wanderT -= DT; if (goTo(M, e, e.wanderPt[0], e.wanderPt[1], sp * .8)) e.moving = 0; return; }
  e.moving = 0; if (Math.hypot(e.home[0] - e.x, e.home[1] - e.y) > .6) { e.state = 'return'; return; }
  if (e.look) e.face = e.home[2] + Math.sin(G.t * .5 + e.x) * e.look; else e.face += angDiff(e.face, e.home[2]) * .05;
}
function combatNPC(M, e, sp) {
  const tgt = e.target && !(e.target.dead || e.target.down || e.target.gone) ? e.target : (hostileTo(e, P) ? P : null);
  if (!tgt || (tgt === P && P.map !== M)) { e.state = 'search'; e.searchT = 5; return; }
  e.target = tgt;
  const sees = tgt === P ? e.seesP || (dist(e, P) < 1.2) : clearLine(M, e.x, e.y, tgt.x, tgt.y);
  const wp = WPN[e.wpn] || null, d = dist(e, tgt);
  if (!wp) { e.state = 'flee'; e.threat = tgt; return; }
  if (sees) {
    e.lastSeen = [tgt.x, tgt.y]; e.lostT = 0; const a = angTo(e, tgt); e.face += angDiff(e.face, a) * .3; e.aim = e.face;
    if (e.reactT > 0) { e.reactT--; e.moving = 0; return; }
    const range = (wp.range || (wp.reach || 1) + .3) * (wp.melee ? 1 : .9);
    if (wp.melee) { if (d > (wp.reach || 1) + tgt.r) goTo(M, e, tgt.x, tgt.y, sp * 1.1); else { e.moving = 0; if (e.fireT <= 0) { e.fireT = wp.rate; meleeAttack(M, e, wp); } } return; }
    if (d > range) { goTo(M, e, tgt.x, tgt.y, sp); }
    else { // strafe a little, keep distance
      if (!e.strafeT || e.strafeT <= 0) { e.strafeT = 40 + rnd(80); e.strafe = rnd(3) - 1; if (d < 2.5 && !e.big) e.strafe = 2; }
      e.strafeT--; if (e.strafe === 2) { moveBody(M, e, -Math.cos(a) * sp * .5 * DT, -Math.sin(a) * sp * .5 * DT); e.moving = 1; e.walkPh += .1; }
      else if (e.strafe) { const ox = e.x; moveBody(M, e, Math.cos(a + Math.PI / 2 * e.strafe) * sp * .45 * DT, Math.sin(a + Math.PI / 2 * e.strafe) * sp * .45 * DT); e.moving = Math.abs(e.x - ox) > 0; e.walkPh += .1; } else e.moving = 0;
      if (e.fireT <= 0) npcShoot(M, e, wp, tgt);
    }
    if (e.wpn2 && WPN[e.wpn2] && e.fireT2 !== undefined) { if ((e.fireT2 -= 1) <= 0 && d < WPN[e.wpn2].range) { e.fireT2 = WPN[e.wpn2].rate; npcShoot(M, e, WPN[e.wpn2], tgt, 1); } } else if (e.wpn2) e.fireT2 = 60;
    // run for the alarm
    if (!M.alarm && e.team !== 'bot' && !e.mech && !e.alarmTried && rnd(400) === 0) { const pan = M.ents.find(o => o.k === 'prop' && o.p === 'alarm' && !o.off && o.team === e.team); if (pan) { e.state = 'alarmrun'; e.alarmPanel = pan; e.alarmTried = 1; bark(M, e, 'alarm'); } }
  } else {
    e.lostT = (e.lostT || 0) + DT; const ls = e.lastSeen || [tgt.x, tgt.y];
    if (goTo(M, e, ls[0], ls[1], sp) || e.lostT > 6) { e.state = 'search'; e.searchT = 10; e.sus = .8; bark(M, e, 'lost'); }
  }
}
function npcShoot(M, e, wp, tgt, second) {
  const spread = (wp.spread || .1) * [1.5, 1, .75][OPT.diff] + (tgt.moving ? .04 : 0) + (tgt === P && P.crouch ? .02 : 0);
  const a = angTo(e, tgt);
  if (wp.proj) { fireProj(M, e, wp, a + (Math.random() - .5) * spread * 2, { dmg: wp.dmg }); }
  else for (let k = 0; k < (wp.pellets || 1); k++) hitscan(M, e, a + (Math.random() - .5) * spread * 2, wp.range || 12, wp.dmg, {});
  makeNoise(M, e.x, e.y, wp.noise || 10, 'gun', e); e.flashT = 3; sfx(wp.proj === 'rocket' ? 'boomshot' : wp.pellets ? 'shotgun' : 'shot2');
  if (!wp.proj) M.fx.push({ flash: 1, x: e.x + Math.cos(a) * .6, y: e.y + Math.sin(a) * .6, t: 3, t0: 3, r: 12 });
  if (second) return;
  // burst fire for automatics, then a pause
  if (wp.burst) { e.clip--; if (e.clip <= 0) { e.clip = wp.burst; e.fireT = 50 + rnd(40); } else e.fireT = wp.rate; }
  else e.fireT = wp.rate + rnd(20);
}

// ---------- alarms, cameras, turrets, lasers ----------
function triggerAlarm(M, src, x, y, team) {
  if (M.alarm > 0) { M.alarm = 60 * 30; return; }
  M.alarm = 60 * 30; M.alarmTeam = team || (src && src.team) || 'fatco'; P.alarms++; sfx('alarm'); msg('ALARM!'); chatReact('alarm');
  makeNoise(M, x, y, 0, 'alarm', src);
  for (const n of M.ents) { if (n.k === 'npc' && !n.dead && !n.down && n.ai === 'guard' && (n.team === M.alarmTeam || relOf(n.team, M.alarmTeam) > 0) && Math.hypot(n.x - x, n.y - y) < 30 && n.state !== 'combat') { n.state = 'search'; n.lastSeen = [x, y]; n.searchT = 15; n.sus = .9; n.path = null; }
    if (n.k === 'turret' && !n.dead && !n.off && (n.team === M.alarmTeam || !n.team)) n.active = 1; }
}
function updateSecurity(M) {
  if (M.alarm > 0) { M.alarm--; if (M.alarm % 50 === 0) sfx('alarm'); if (M.alarm === 0) { for (const n of M.ents) if (n.k === 'turret' && !n.always) n.active = 0; msg('Alarm reset.'); } }
  for (const e of M.ents) {
    if (e.empT > 0) { e.empT--; if (e.empT === 0 && (e.k === 'cam' || e.k === 'turret')) e.off = 0; }
    if (e.k === 'cam') { if (e.dead || e.off) continue; e.base = e.base !== undefined ? e.base : e.ang; e.ang = e.base + Math.sin(G.t * (e.speed || .5) + (e.phase || 0)) * (e.sweep === undefined ? .7 : e.sweep);
      if (e.alertT > 0) e.alertT--;
      const hostile = relOf(e.team || 'fatco', 'player') < 0 || (M.angry && M.angry[e.team || 'fatco']);
      if (!hostile || P.map !== M || P.dead || P.augOn.radar || (P.charged.camo && P.charged.camo.on)) { e.seeT = 0; continue; }
      const sees = seesPoint(M, { x: e.x, y: e.y, face: e.ang }, P.x, P.y, (e.range || 7) * (.4 + .6 * Math.min(1, lightAt(M, P.x, P.y) + .3)), e.fov || .5);
      if (sees) { e.seeT = (e.seeT || 0) + DT; if (frame % 20 === 0) sfx('beep'); if (e.seeT > .9) { e.alertT = 120; triggerAlarm(M, e, P.x, P.y, e.team || 'fatco'); e.seeT = 0; } } else e.seeT = Math.max(0, (e.seeT || 0) - DT); }
    else if (e.k === 'turret') { if (e.dead || e.off) continue; if (e.fireT > 0) e.fireT--;
      const active = e.active || e.always || M.alarm > 0 && e.team === M.alarmTeam; if (!active) continue;
      let tgt = null; if (e.hacked) { let bd = 12; for (const o of M.ents) if (o.k === 'npc' && !o.dead && !o.down && o.team !== 'civ' && dist(e, o) < bd && clearLine(M, e.x, e.y, o.x, o.y)) { bd = dist(e, o); tgt = o; } }
      else if (P.map === M && !P.dead && !(P.augOn.radar || (P.charged.camo && P.charged.camo.on)) && (relOf(e.team || 'fatco', 'player') < 0 || M.alarm > 0) && dist(e, P) < 14 && clearLine(M, e.x, e.y, P.x, P.y)) tgt = P;
      if (tgt) { const a = angTo(e, tgt); e.ang += angDiff(e.ang, a) * .2; if (Math.abs(angDiff(e.ang, a)) < .2 && e.fireT <= 0) { e.fireT = 6; hitscan(M, e, e.ang + (Math.random() - .5) * .14, 14, 3.5, {}); sfx('shot2'); makeNoise(M, e.x, e.y, 12, 'gun', e); M.fx.push({ flash: 1, x: e.x + Math.cos(e.ang) * .5, y: e.y + Math.sin(e.ang) * .5, t: 3, t0: 3, r: 10 }); } } }
    else if (e.k === 'laser') { if (e.off || e.gone || P.map !== M) continue; const dx = e.x2 - e.x, dy = e.y2 - e.y, L = dx * dx + dy * dy, t = clamp(((P.x - e.x) * dx + (P.y - e.y) * dy) / L, 0, 1);
      if (Math.hypot(e.x + dx * t - P.x, e.y + dy * t - P.y) < .3) { if (!e.tripT) { e.tripT = 120; if (e.boom) { boom(M, P.x, P.y, 2, 60, e); } else triggerAlarm(M, e, P.x, P.y, e.team || 'fatco'); } } if (e.tripT > 0) e.tripT--; }
    else if (e.k === 'chatter') updateChatter(M, e);
    else if (e.k === 'trigger') { if (e.done || P.map !== M) continue; if (P.x >= e.x && P.x < e.x + (e.w || 1) && P.y >= e.y && P.y < e.y + (e.h || 1) && (!e.when || e.when())) { if (e.once !== 0) e.done = 1; run(() => e.fn(M, e)); } }
    else if (e.k === 'prop' && e.flareT > 0) { e.flareT -= DT * 60 / 60; if (e.flareT <= 0) { removeEnt(M, e); computeLight(M); } }
  }
  for (const k in M.doors) { const d = M.doors[k]; d.o += ((d.open ? 1 : 0) - d.o) * .25; if (d.closeT > 0 && --d.closeT === 0) closeDoor(M, d); }
}

// ---------- barks and overheard conversations ----------
const BARKS = {
  fatco: { spot: ['Hostile!', 'There!', 'Contact!', 'Drop it, Denton!'], hear: ['What was that?', 'Shots fired!', 'Check it out.'], hmm: ['Hm?', 'Somebody there?', "Who's there?"], calm: ['Must be rats.', 'Nothing.', 'Back to it.'], body: ['Man down!', 'Agent down! Search the area!'], lost: ['Where did he go?', 'Lost him!'], cough: ['*cough*'], flee: ['Fall back!'], alarm: ['Hitting the alarm!'], near: ['Agent Denton.', 'Sir.', 'Nice hat.'] },
  ppf: { spot: ['FATCO dog!', 'He found us!', 'Light him up!', "It's the little one!"], hear: ['They\'re here!', 'Did you hear that?'], hmm: ['...hello?', 'Somebody\'s out there.'], calm: ['Nerves.', 'Nothing.'], body: ['They got Dani!', 'Somebody\'s down!'], lost: ['Where\'d he go?'], cough: ['*cough* is that WEED'], flee: ['Run!', 'Not worth it!'], alarm: ['Ring the bell!'], near: ['You\'re not with them. Are you?'] },
  mj: { spot: ['Target acquired.', 'Engaging.', 'Specimen sighted.'], hear: ['Noise. Investigate.', 'Movement.'], hmm: ['...', 'Check sector.'], calm: ['Sector clear.', 'Clear.'], body: ['Unit down. Sweep.', 'Body. Sweep pattern.'], lost: ['Lost visual.', 'Target evading.'], cough: ['*cough*'], flee: ['Regrouping.'], alarm: ['Raising alert.'], near: ['...'] },
  miws: { spot: ['There you are.', 'You were never here.', 'Come along now.'], hear: ['...'], hmm: ['Hm.'], calm: ['Nothing to see.'], body: ['Untidy.'], lost: ['You can\'t leave.'], cough: [], flee: [], alarm: [], near: ['Nothing to see here.'] },
  cop: { spot: ['Freeze!', 'Police!'], hear: ['Shots fired!'], hmm: ['Hey!'], calm: ['Kids.'], body: ['Officer down!'], lost: ['Lost him.'], cough: ['*cough*'], flee: ['Backup!'], alarm: [], near: ['Move along.', 'Is that a costume?'] },
  thug: { spot: ['You lost, little man?', 'Get him!'], hear: ['Yo!'], hmm: ['Who\'s that?'], calm: ['Whatever.'], body: ['They got Rico!'], lost: ['He bounced.'], cough: ['*cough* good stuff'], flee: ['Run!'], alarm: [], near: ['What you looking at?'] },
  redchat: { spot: ['RAID!', 'Ban him!', 'He\'s a Lurker!'], hear: ['Spam incoming!'], hmm: ['...?'], calm: ['False alarm.'], body: ['They clipped Kenji!'], lost: ['He logged off.'], cough: [], flee: ['Leave the stream!'], alarm: [], near: ['Red Chat territory.'] },
  lurker: { spot: ['...', 'Seen.'], hear: ['...'], hmm: ['...'], calm: ['...'], body: ['...!'], lost: ['...'], cough: [], flee: ['...'], alarm: [], near: ['...'] },
  gatebox: { spot: ['Intruder!', 'Non-customer on the floor!'], hear: ['Check the lab!'], hmm: ['Hello?'], calm: ['Clear.'], body: ['Guard down!'], lost: ['Lost him.'], cough: ['*cough*'], flee: ['Retreat!'], alarm: ['Lockdown!'], near: ['Welcome to Gatebox.'] },
  casino: { spot: ['Card counter!', 'Hey, the alien!'], hear: ['Something\'s off.'], hmm: ['Sir?'], calm: ['Fine.'], body: ['Man down on the floor!'], lost: ['Where\'d he go?'], cough: ['*cough*'], flee: ['Call it in!'], alarm: ['Code Elvis!'], near: ['Enjoy your stay.', 'House always wins.'] },
  tunnel: { spot: ['Out!', 'Get out of the tunnels!'], hear: ['Who\'s down here?'], hmm: ['...hello?'], calm: ['Just the water.'], body: ['They hit Mags!'], lost: ['He\'s gone.'], cough: [], flee: ['Run!'], alarm: [], near: ['Watch the water.', 'You lost?'] },
  civ: { near: ['Is that a kid in a coat?', '...', 'Nice hat.', 'Is that a costume?', 'Are you from the mall?', 'Don\'t stare at him.'], flee: ['AAAH!', 'Help!', 'Run!'] },
  buffered: { near: ['I w-w-was going to—', '...b-b-b-', 'What year is it', 'Is it loading?'], flee: ['n-n-no'] },
  hu: { spot: ['NON-STANDARD HUMAN DETECTED.', 'Please hold still for normalization.'], hear: ['A normal sound?'], hmm: ['Hm. Normal.'], calm: ['Normal again.'], body: ['Unit down.'], lost: ['Where did the irregular go?'], cough: [], flee: [], alarm: [], near: ['Hello. I am a normal human.'] },
  secbot: { spot: ['CITATION.', 'HALT. CITATION.', 'LOITERING DETECTED.'], hear: ['...'], hmm: ['SCANNING.'], calm: ['ALL CLEAR.'], body: [], lost: ['CITATION PENDING.'], cough: [], flee: [], alarm: [], near: ['HAVE A NICE DAY.'] },
  bioroid: { spot: ['Welcome, valued customer.', 'You have been selected.'], hear: ['Customer?'], hmm: ['Customer?'], calm: ['Thank you for shopping.'], body: [], lost: ['Please return to the store.'], cough: [], flee: [], alarm: [], near: ['Linda loves you.'] },
};
function bark(M, e, kind, force) {
  if (!e.bark && !e.barks) return; if (!force && e.barkT > G.t) return; const set = (e.barks && e.barks[kind]) || (BARKS[e.bark] || {})[kind]; if (!set || !set.length) return;
  if (P.map !== M || dist(e, P) > 14) return; e.barkT = G.t + 3 + Math.random() * 3;
  const s = pick(set); M.fx.push({ txt: s, x: e.x, y: e.y, t: 110, t0: 110, c: kind === 'spot' ? hex('#ff8080') : hex('#e8e8f0') });
}
function updateChatter(M, e) {
  if (e.done || P.map !== M) return; const a = entById(M, e.a), b = entById(M, e.b);
  if (!a || a.dead || a.down || a.state !== 'idle' || (b && (b.dead || b.down || b.state !== 'idle'))) { if (e.playing) e.done = 1; return; }
  if (!e.playing) { if (dist(a, P) < (e.r || 5) && (!e.when || e.when())) { e.playing = 1; e.i = 0; e.t = 0; } else return; }
  e.t -= DT; if (e.t > 0) return;
  if (e.i >= e.lines.length) { e.done = 1; if (e.after) e.after(M); return; }
  const [who, s] = e.lines[e.i++], sp = who === e.a ? a : b; if (!sp) return;
  if (sp !== a || !b) {} if (b) { a.face = angTo(a, b); b.face = angTo(b, a); }
  e.t = 1.4 + s.length * .055; M.fx.push({ txt: s, x: sp.x, y: sp.y, t: e.t * 60, t0: e.t * 60, c: hex('#d8e8ff'), wrap: 1 });
  logConv((sp.name || who) + ': ' + s);
}
