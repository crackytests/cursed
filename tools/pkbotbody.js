var BOT_SHOW = 0;
// runs inside the game context
var BOT = (() => {
  let T = 0, F = 0, last = {}, want = {}, log = [], stuckF = 0, bestX = 0, flushFor = null, lastStage = 0, lastSay = '';
  const L = s => { log.push('[' + F + '] ' + s); console.log('[' + F + '] ' + s); };
  const press = k => { if (!last[k]) want[k] = 1; };
  const hold = k => { want[k] = 1; };
  const tileRow = (tx) => { let s = ''; for (let y = 0; y < LH; y++) s += tileAt(tx, y); return s; };
  function menuPick(m) {
    const o = m.opts.join('|');
    if (m.opts.includes('HOLD IT')) return flushFor !== null ? 0 : 1;
    if (o.includes('OBJECTION')) return DBG.tcur >= 0 ? 1 : 0;
    if (m.opts[0].startsWith('HE SAID')) return DBG.tcur;
    if (o.includes('ASK HIM')) return 2;
    if (o.includes("LET'S GO")) return 0;
    if (o.includes('GET BACK IN')) return WANT === 'GO' ? 1 : 0;
    if (o.includes('NEW GAME')) return m.opts.indexOf(WANT_MODE === 'hard' ? 'HOLD IT MODE' : 'NEW GAME');
    if (o.includes('RESUME')) return 0;
    return 0;
  }
  let WANT = '', WANT_MODE = '', kbdTarget = 'HELLO CHAT', kbdI = 0;
  function decide() {
    // minigames first
    if (DBG.mode === 'standup') { const b = DBG.su; if (b && b.m >= b.lo + .02 && b.m <= b.hi - .02) press('a'); return; }
    if (DBG.mode === 'rhythm') { const t = DBG.t(); for (const n of DBG.notes) if (!n.done && Math.abs(n.at - t) <= 2 && !last[n.d]) want[n.d] = 1; return; }
    if (DBG.mode === 'qte') { if (F % 20 === 10) press(DBG.qk); return; }
    if (DBG.mode === 'kbd') {
      const ROWS = ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ .!?', '0123456789'];
      let tx, ty; if (kbdI >= kbdTarget.length) { tx = 7; ty = 4; } else { const ch = kbdTarget[kbdI]; ty = ROWS.findIndex(r => r.includes(ch)); tx = ROWS[ty].indexOf(ch); }
      if (F % 3) return;
      if (DBG.ky !== ty) press(DBG.ky < ty ? 'down' : 'up'); else if (DBG.kx !== tx) press(DBG.kx < tx ? 'right' : 'left'); else { press('a'); if (!last.a) kbdI++; }
      return;
    }
    if (MENUS.length) { const m = MENUS[MENUS.length - 1], t = menuPick(m); if (F % 3) return; if (m.i !== t) press(m.i < t || t < 0 ? 'down' : 'up'); else press('a'); if (t < 0) press('c'); return; }
    if (DLG) { const s = DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L((DLG.who ? DLG.who + ': ' : '') + s); } if (F % 4 === 0) press('a'); return; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); return; }
    if (DBG.credits) { hold('start'); return; }
    if (scene !== platScene || busy) return;
    platAI();
  }
  let jumpHold = 0, backoff = 0, visited = {};
  function platAI() {
    const a = A(), cx = PL.x + a.w / 2, tx = Math.floor(cx / TS), footTy = Math.floor((PL.y + a.h - 1) / TS);
    if (STG.id !== lastStage) { lastStage = STG.id; bestX = 0; stuckF = 0; flushFor = null; visited = {}; plan = null; L('STAGE ' + STG.id + ' start x=' + tx + (LH > 14 ? ' (climb, ' + LH + ' rows)' : '')); }
    if (BOSS && !BOSS.done && ARENA) return bossAI(a, cx);
    if (BOSS && BOSS.def.key === 'figure' && PL.unlocked.includes('boy')) { if (PL.asp !== 'boy' && F % 10 === 0) press('c'); else if (Math.abs(BOSS.x - cx) < 140 && F % 30 === 0) press('a'); }
    if (LH > 14) return climbAI(a);
    // goals
    let goal = null, npcGoal = null;
    if (STG.id === 3 && !SAVE.hallpass) npcGoal = 40;
    if (STG.id === 4 && !SAVE.taka) npcGoal = 8;
    if (STG.id === 31 && !SAVE.showDone && (BOT_SHOW = (typeof BOT_SHOW === 'number' ? BOT_SHOW : 0)) < 2) npcGoal = 18;
    // find next obstacle to the right
    let obs = null;
    for (let x = tx + 1; x < Math.min(LV.w, tx + 10); x++) { const col = tileRow(x); if (col.includes('M') && !legacyNow) { obs = { k: 'M', x }; break; } if (col.includes('P') && PL.pot < 60 && !PERMA) { obs = { k: 'P', x }; break; } if (col.includes('V') && PL.asp !== 'kid') { obs = { k: 'V', x }; break; } }
    if (obs && obs.k === 'M' && flushFor === null) {
      for (let x = obs.x; x >= Math.max(0, tx - 40); x--) if (tileRow(x).includes('T')) { flushFor = x; L('heading to bathroom at ' + x + ' pot=' + PL.pot.toFixed(0)); break; }
    }
    if (legacyNow) flushFor = null;
    if (npcGoal !== null) goal = npcGoal; else if (flushFor !== null) goal = flushFor; else goal = LV.w;
    if (obs && obs.k === 'V' && PL.asp !== 'kid' && F % 10 === 0) press('c');
    let qAhead = false; for (let x = tx; x < tx + 8; x++) for (let y = 0; y < LH; y++) if (tileAt(x, y) === '?' && !LV.revealed[x + ',' + y]) qAhead = true;
    if (qAhead && PL.asp !== 'boy' && PL.unlocked.includes('boy') && F % 10 === 0) press('c');
    const tall = [0, 1, 2, 3].every(k => solidAt(tx + 1, footTy - k)) && !solidAt(tx + 1, footTy - 4);
    if (tall && !qAhead && PL.asp !== 'wee' && PL.unlocked.includes('wee') && F % 10 === 0) press('c');
    // arrive at goal?
    if (Math.abs(tx - goal) <= 0 && PL.on && goal !== LV.w) { press('up'); if (npcGoal === 18 && PL.on) BOT_SHOW++; if (npcGoal !== null) visited[npcGoal] = 1; return; }
    const doorHere = tileRow(tx).includes('D');
    if (doorHere && PL.on) { press('up'); return; }
    const dir = goal > tx ? 1 : -1;
    if (obs && obs.k === 'P' && PL.pot < 60 && dir > 0 && obs.x - tx <= 1) { if (F % 600 === 0) L('waiting at power door, pot=' + PL.pot.toFixed(0)); return; }
    if (backoff > 0) { backoff--; const bt = Math.floor((cx - dir * 12) / TS); if (solidAt(bt, footTy + 1) || tileAt(bt, footTy + 1) === '=') hold(dir > 0 ? 'left' : 'right'); return; } // never back off a ledge
    hold(dir > 0 ? 'right' : 'left');
    // ability: ask/pulse at adults ahead
    const adult = ENTS.find(e => (e.kind === 'adult' || e.kind === 'drone') && !e.stun && (e.x - PL.x) * dir > 0 && Math.abs(e.x - PL.x) < 90 && Math.abs(e.y - PL.y) < 60);
    if (adult && !legacyNow && F % 8 === 0) press('a');
    if (PL.asp === 'boy' && F % 40 === 0) { for (let x = tx - 3; x <= tx + 5; x++) if (tileRow(x).includes('?')) { press('a'); break; } }
    // jump logic
    const ahead = Math.floor((cx + dir * (a.w / 2 + 6)) / TS);
    const wallAhead = [0, 1].some(k => solidAt(ahead, footTy - k));
    const gapAhead = !solidAt(ahead, footTy + 1) && tileAt(ahead, footTy + 1) !== '=' && !solidAt(ahead + dir, footTy + 1);
    const hazard = tileAt(ahead, footTy + 1) === '^' || tileAt(ahead, footTy) === '^';
    const platAbove = [2, 3, 4].some(k => tileAt(tx + dir, footTy - k) === '=' || solidAt(tx + dir, footTy - k));
    if (PL.on && (wallAhead || gapAhead || hazard)) { jumpHold = 20; }
    if (jumpHold > 0) { jumpHold--; hold('b'); if (PL.on && last.b) delete want.b; }
    // stuck detection
    const prog = dir > 0 ? PL.x : -PL.x;
    if (prog > bestX + 4) { bestX = prog; stuckF = 0; } else stuckF++;
    if (stuckF === 240) { L('stuck at tx=' + tx + ' ty=' + footTy + ' asp=' + PL.asp + ' pot=' + PL.pot.toFixed(0) + ' leg=' + legacyNow + ' goal=' + goal); backoff = 30; }
    if (stuckF === 480) { press('c'); backoff = 40; }
    if (stuckF > 480 && stuckF % 300 === 0) { backoff = 20 + rnd(40); if (rnd(2)) press('c'); }
    if (stuckF > 900) bestX = prog - 1; // re-arm
  }
  let placed = 0; const START_AT = (typeof process === 'undefined' ? '' : '') || globalThis.PK_START || '', TRACE = globalThis.PK_TRACE || 0;
  async function start(n, max, W) {
    WANT = W.split(',')[0]; WANT_MODE = (W.split(',')[1] || '');
    const h0 = hurt; hurt = why => { if (PL.hurt <= 0 && !PERMA) L('HURT ' + why + ' at ' + Math.floor(PL.x / TS) + ',' + Math.floor(PL.y / TS)); h0(why); };
    anyKey = true;
    if (n === 1) run(boot);
    else { const w = world(n); PL.unlocked = ['kid', 'wee', 'boy'].slice(0, w >= 4 ? 3 : w >= 3 ? 2 : 1); SAVE.stage = n; scene = null; run(() => startStage(n)); }
    let prevDone = null;
    for (F = 0; F < max; F++) {
      want = {};
      if (START_AT && !placed && scene === platScene && !busy) { placed = 1; const [sx, sy, sa] = START_AT.split(':'); PL.asp = sa || PL.asp; PL.cx = +sx * TS; PL.cy = +sy * TS + 8; respawn(); L('placed at ' + START_AT); }
      if (TRACE && placed && F % 4 === 0) L('T ' + (PL.x / TS).toFixed(1) + ',' + ((PL.y + A().h - 1) / TS).toFixed(1) + ' ' + (PL.on ? 'g' : 'a') + ' ' + PL.asp + ' ' + Object.keys(last).join('') + (plan && plan[1] ? ' next ' + plan[1] : ''));
      try { decide(); } catch (e) { L('BOTERR ' + e.stack); return 'boterr'; }
      for (const k of BTNS) kb[k] = want[k] ? 1 : 0;
      last = Object.assign({}, want);
      T += 17; loop(T);
      for (let i = 0; i < 4; i++) await new Promise(r => setImmediate(r));
      if (DBG.credits && !prevDone) { prevDone = 1; L('CREDITS reached, PKM=' + JSON.stringify(PKM)); }
      if (prevDone && scene && !DBG.credits && MENUS.length) { return 'DONE frames=' + F + ' photos=' + SAVE.photos.length; }
      if (F % 3000 === 0 && scene === platScene) L('status stage ' + STG.id + ' tx=' + Math.floor(PL.x / TS) + ' pot=' + PL.pot.toFixed(0) + ' dig=' + PL.dig);
    }
    return 'TIMEOUT stage=' + (STG && STG.id) + ' x=' + Math.floor(PL.x / TS);
  }

  // ---------- bosses: keep a distance, jump the shockwaves, use the right kid at the right moment ----------
  let bossSeen = null;
  function bossAI(a, cx) {
    const e = BOSS, k = e.def.key, bx = e.x + (e.w || 0) / 2, dx = bx - cx, dist = Math.abs(dx);
    if (bossSeen !== e) { bossSeen = e; L('BOSS ' + e.def.name + ' hp=' + e.hp); }
    if (e.hp !== e._lhp) { e._lhp = e.hp; L('BOSS hp ' + e.hp + '/' + e.max + (e.phase ? ' phase ' + e.phase : '')); }
    const be = asp => { if (PL.asp !== asp && PL.unlocked.includes(asp)) { if (F % 8 === 0 && PL.on) press('c'); return false; } return true; };
    for (const p of ENTS) if (p.kind === 'proj' || p.kind === 'spark') { const pdx = p.x - cx; if (Math.abs(pdx) < 46 && (p.kind === 'spark' || Math.sign(p.vx || 0) === -Math.sign(pdx)) && Math.abs(p.y - (PL.y + a.h - 6)) < 34 && PL.on) press('b'); }
    if (!last.b && want.b) hold('b');
    let goalX = bx - 110, act = false;
    if (k === 'bag') { if (e.watch > 0) { if (be('kid')) { goalX = bx - 70; act = true; } } else if (be('wee')) { goalX = bx - 90; if (dist < 150 && PL.on) { hold('a'); return; } } }
    else if (k === 'gen') { if (e.phase === 1) { if (be('kid')) act = e.open > 0; } else if (e.phase === 2) { if (be('wee')) { goalX = bx - 150; if (dist < 190 && PL.on) { hold('a'); return; } } } else if (be('boy')) { goalX = bx - 110; if (dist < 180 && F % 30 === 0) press('a'); } }
    else if (be('kid')) act = e.open > 0;
    const gx = goalX - cx; if (Math.abs(gx) > 10) hold(gx > 0 ? 'right' : 'left'); else if ((dx > 0 ? 1 : -1) !== PL.face) hold(dx > 0 ? 'right' : 'left');
    if (act && (dx > 0 ? 1 : -1) === PL.face && F % 12 === 0) press('a');
  }
  // ---------- climbing: plan a route over standable cells, then follow it ----------
  let plan = null, planF = 0, jumpT = 0, climbStuck = 0, climbBest = 1e9;
  const solidFor = (x, y, asp) => { const c = tileAt(x, y); if (c === 'V') return asp !== 'kid'; if (c === '#') return true; if (c === '?') return !!LV.revealed[x + ',' + y]; if (c === 'L') return legacyNow; if (c === 'P') return !(PL.pot >= 60 || PERMA); return false; };
  const support = (x, y, asp) => solidFor(x, y, asp) || tileAt(x, y) === '=';
  const boxFree = (x, y0, y1, asp) => { for (let y = y0; y <= y1; y++) if (solidFor(x, y, asp)) return false; return true; };
  const standable = (x, y, asp) => x > 0 && x < LV.w - 1 && y > 0 && y < LH && !solidFor(x, y, asp) && !solidFor(x, y - 1, asp) && support(x, y + 1, asp);
  const JUMPROWS = { kid: 2, wee: 4, boy: 3 };
  function bfs(sx, sy, asp, goal) {
    const key = (x, y) => x + ',' + y, prev = { [key(sx, sy)]: null }, Q = [[sx, sy]]; let best = [sx, sy];
    while (Q.length) {
      const [x, y] = Q.shift(); if (y < best[1]) best = [x, y];
      if (goal && x === goal[0] && y === goal[1]) { const path = []; let k = key(x, y); while (k) { path.unshift(k.split(',').map(Number)); k = prev[k]; } return { path, ok: true, best: [x, y] }; }
      const nb = [];
      for (const d of [-1, 1]) { if (standable(x + d, y, asp)) nb.push([x + d, y]); else if (!solidFor(x + d, y, asp) && !solidFor(x + d, y - 1, asp)) { for (let yy = y + 1; yy < LH; yy++) { if (solidFor(x + d, yy, asp)) break; if (standable(x + d, yy, asp)) { nb.push([x + d, yy]); break; } } } }
      const boxClear = (x0, x1, y0, y1) => { for (let xx = Math.min(x0, x1); xx <= Math.max(x0, x1); xx++) for (let yy = y0; yy <= y1; yy++) if (solidFor(xx, yy, asp)) return false; return true; };
      for (let dy = 1; dy <= JUMPROWS[asp]; dy++) { if (!boxClear(x, x, y - dy - 1, y - 1)) break; for (let dx = -3; dx <= 3; dx++) if (standable(x + dx, y - dy, asp) && boxClear(x, x + dx, y - dy - 1, y - dy)) nb.push([x + dx, y - dy]); }
      for (const dx of [-4, -3, -2, 2, 3, 4]) if (standable(x + dx, y, asp) && !solidFor(x, y - 2, asp)) nb.push([x + dx, y]);
      for (const n of nb) { const k = key(n[0], n[1]); if (!(k in prev)) { prev[k] = key(x, y); Q.push(n); } }
    }
    const path = []; let k = key(best[0], best[1]); while (k) { path.unshift(k.split(',').map(Number)); k = prev[k]; } return { path, ok: false, best };
  }
  function climbAI(a) {
    const cx = PL.x + a.w / 2, tx = Math.floor(cx / TS), ty = Math.floor((PL.y + a.h - 1) / TS);
    let goal = null; for (let y = 0; y < LH && !goal; y++) for (let x = 0; x < LV.w; x++) if (tileAt(x, y) === 'D' && tileAt(x, y + 1) !== 'D') { goal = [x, y]; break; }
    if (PL.asp === 'boy' && F % 25 === 0) for (let y = ty - 6; y <= ty + 2; y++) for (let x = tx - 6; x <= tx + 6; x++) if (tileAt(x, y) === '?' && !LV.revealed[x + ',' + y]) { press('a'); y = 1e9; break; }
    if (goal && Math.abs(tx - goal[0]) <= 1 && ty === goal[1] && PL.on) { press('up'); return; }
    if (PL.on && (!plan || F - planF > 40)) {
      planF = F; const opts = PL.unlocked.map(asp => [asp, bfs(tx, ty, asp, goal)]);
      const mine = opts.find(([asp]) => asp === PL.asp), top = opts.slice().sort((p, q) => p[1].best[1] - q[1].best[1])[0];
      const pickA = (mine[1].ok && mine) || opts.find(([, r]) => r.ok) || (top[1].best[1] < mine[1].best[1] - 1 ? top : mine); // only switch when another one clearly gets higher
      const hidden = (() => { for (let y = ty - 5; y <= ty; y++) for (let x = Math.max(1, tx - 6); x < Math.min(LV.w - 1, tx + 7); x++) if (tileAt(x, y) === '?' && !LV.revealed[x + ',' + y]) return true; return false; })();
      if (hidden && !opts.some(([, r]) => r.ok) && PL.unlocked.includes('boy')) { if (PL.asp !== 'boy') { if (F % 6 === 0) press('c'); } else if (F % 25 === 0) press('a'); plan = null; return; } // nobody can go higher: reveal what's hidden
      if (pickA[0] !== PL.asp) { if (F % 6 === 0) { press('c'); L('climb: swap to ' + pickA[0]); } plan = null; return; }
      plan = pickA[1].path;
      if (pickA[1].ok === false && PL.asp === 'boy') { for (let y = ty - 4; y <= ty; y++) for (let x = tx - 4; x <= tx + 4; x++) if (tileAt(x, y) === '?' && !LV.revealed[x + ',' + y] && F % 20 === 0) press('a'); }
    }
    if (!plan || plan.length < 2) { if (climbStuck > 200) hold(F % 120 < 60 ? 'right' : 'left'); planF = Math.min(planF, F - 34); climbStuck++; return; } // stand still and rethink soon; wander only when truly stuck
    while (plan.length > 1 && plan[0][0] === tx && plan[0][1] === ty && plan[1]) { if (plan[1][0] === tx && plan[1][1] === ty) plan.shift(); else break; }
    const i = plan.findIndex(p => p[0] === tx && p[1] === ty); if (i > 0) plan = plan.slice(i);
    const nx = plan[1] ? plan[1] : plan[0], tgtX = nx[0] * TS + 8, ddx = tgtX - cx;
    const up = nx[1] < ty, far = Math.abs(nx[0] - tx) > 1;
    const straightUp = up && Math.abs(nx[0] - tx) <= 1;
    const stepT = Math.floor((cx + (ddx > 0 ? 1 : -1) * (a.w / 2 + 2)) / TS), floorOk = support(stepT, ty + 1, PL.asp);
    if (PL.on && up) { // something right over the head: step away from it before jumping, then drift on top
      let hit = false; for (let k = 2; k <= ty - nx[1] + 1; k++) for (let c = Math.floor(PL.x / TS); c <= Math.floor((PL.x + a.w - 1) / TS); c++) if (solidFor(c, ty - k, PL.asp)) hit = true;
      const away = ddx > 0 ? -1 : 1, awayT = Math.floor((cx + away * (a.w / 2 + 2)) / TS);
      if (hit && support(awayT, ty + 1, PL.asp)) { hold(away > 0 ? 'right' : 'left'); return; }
    }
    let overT = false; if (up) for (let k = 2; k <= ty - nx[1] + 1; k++) if (solidFor(nx[0], ty - k, PL.asp)) overT = true;
    if (PL.on && straightUp && !overT && Math.abs(ddx) > 4 && floorOk) { hold(ddx > 0 ? 'right' : 'left'); return; } // line up under the gap first (never off a ledge)
    if (PL.on && (up || far) && jumpT <= 0) { if (last.b) { /* let go for a frame, or the next press won't count */ } else { jumpT = up ? 20 : 12; press('b'); } }
    else if (jumpT > 0) { jumpT--; hold('b'); }
    if (climbStuck > 300 && climbStuck % 90 === 0 && !last.b) press('b');
    const sd = ddx > 0 ? 1 : -1, sideClear = boxFree(Math.floor((cx + sd * (a.w / 2 + 3)) / TS), Math.floor(PL.y / TS), Math.floor((PL.y + a.h - 1) / TS), PL.asp);
    if (Math.abs(ddx) > 3 && !(PL.vy < 0 && Math.abs(ddx) < 10) && (sideClear || !up)) hold(sd > 0 ? 'right' : 'left'); // wait until clear of the ceiling before drifting
    const h = PL.y; if (h < climbBest - 8) { climbBest = h; climbStuck = 0; } else if (++climbStuck === 900) { L('climb stuck at ' + tx + ',' + ty + ' asp=' + PL.asp + ' next=' + nx); plan = null; climbStuck = 0; climbBest = h; }
  }
  return { start };
})();
