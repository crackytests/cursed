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
    if (o.includes('HOLD IT')) return flushFor !== null ? 0 : 1;
    if (o.includes('OBJECTION')) return DBG.tcur >= 0 ? 1 : 0;
    if (m.opts[0].startsWith('HE SAID')) return DBG.tcur;
    if (o.includes('ASK HIM')) return 2;
    if (o.includes("LET'S GO")) return 0;
    if (o.includes('GET BACK IN')) return WANT === 'GO' ? 1 : 0;
    if (o.includes('NEW GAME')) return m.opts.indexOf('NEW GAME');
    if (o.includes('RESUME')) return 0;
    return 0;
  }
  let WANT = '', kbdTarget = 'HELLO CHAT', kbdI = 0;
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
    if (STG.id !== lastStage) { lastStage = STG.id; bestX = 0; stuckF = 0; flushFor = null; visited = {}; L('STAGE ' + STG.id + ' start x=' + tx); }
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
    if (backoff > 0) { backoff--; hold(dir > 0 ? 'left' : 'right'); return; }
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
  async function start(n, max, W) {
    WANT = W;
    anyKey = true;
    if (n === 1) run(boot);
    else { PL.unlocked = ['kid', 'wee', 'boy'].slice(0, n >= 4 ? 3 : n >= 3 ? 2 : 1); SAVE.stage = n; scene = null; run(() => startStage(n)); }
    let prevDone = null;
    for (F = 0; F < max; F++) {
      want = {};
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
  return { start };
})();
