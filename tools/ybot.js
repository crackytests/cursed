// YOKO bot: runs inside the game context. BOT.tick() once per frame.
var BOT = (() => {
  let F = 0, last = {}, want = {}, lastSay = '', W8 = {}, plan = [], tried = {}, menuSeen = null, menuT = 0;
  const L = s => console.log('[' + F + '] ' + s);
  const press = k => { if (!last[k]) want[k] = 1; };
  const hold = k => { want[k] = 1; };
  const idxOf = (opts, s) => { const i = opts.findIndex(o => o.startsWith(s)); return i < 0 ? opts.findIndex(o => o.includes(s)) : i; };
  function battlePlan() {
    const foes = liveFoes(), allies = BT.allies, alive = allies.filter(a => a.hp > 0), has = k => alive.find(a => a.key === k);
    const rid = foes.find(f => f.intent && f.intent.k === 'riddle');
    if (rid && !rid.known && BT.fp >= 1) return ['TRANSLATE', rid.name];
    if (rid && rid.known) { const a = rid.intent.r.a; if (a === 'YOKO' && YOKO_CAN.OVERRULE && BT.fp >= 2) return ['OVERRULE', alive[0].name, ALLY[alive[0].key].moves[0], ...(needsTarget(ALLY[alive[0].key].moves[0]) ? [foes[0].name] : [])]; if (has(a)) return ['SUGGEST', has(a).name, 'ANSWER']; }
    const down = allies.find(a => a.hp <= 0); if (down && YOKO_CAN.RESTORE && BT.fp >= 3) return ['RESTORE', down.name];
    if (W8.over === '1' && YOKO_CAN.OVERRULE && BT.fp >= 2 && alive.length) { const a = alive[0], m = ALLY[a.key].moves[0]; return ['OVERRULE', a.name, m, ...(needsTarget(m) ? [foes[0].name] : [])]; }
    const unk = foes.find(f => !f.known); if (unk && BT.fp >= 1 && BT.round % 2 === 1) return ['TRANSLATE', unk.name];
    const ld = has('CEO LINDA'), fr = foes.find(f => f.franchise); if (ld && fr && BT.round % 2 === 0) return ['SUGGEST', ld.name, 'BUY OUT', fr.name];
    const jb = has('JB GARFIELD'), known = foes.find(f => f.known); if (jb && known && !jb.sug) return ['SUGGEST', jb.name, 'ACCUSE', known.name];
    const ca = has('CARL'); if (ca && foes.length >= 2 && BT.round % 3 === 0) return ['SUGGEST', ca.name, 'ATTACK', foes[1].name];
    const gs = has('SPOOKY GHOST'); if (gs && BT.fp >= 1 && gs.pot < 3) return ['ASSIST', gs.name];
    if (BT.fp >= 1) { const a = alive.slice().sort((x, y) => y.pot - x.pot || y.atk - x.atk)[0]; if (a && a.pot < 3) return ['ASSIST', a.name]; }
    return ['WAIT'];
  }
  function debatePlan() {
    const ch = DBG.debate; if (!ch) return ['SILENCE'];
    let best = ['SILENCE'], bv = (ch.r.SILENCE || [5])[0];
    for (const k in ch.r) if (ch.r[k][0] < bv) { bv = ch.r[k][0]; best = [k]; }
    for (const w in ch.w) if (ch.w[w][0] < bv && ((PARTY[w] || {}).trust || 50) >= 30) { bv = ch.w[w][0]; best = ['CALL A WITNESS', w]; }
    if (W8.end === 'empire') return ['CONTEXT'];
    return best;
  }
  function menuPick(m) {
    const o = m.opts, j = o.join('|');
    if (m !== menuSeen) { menuSeen = m; menuT = 0; if (DBG.mode === 'battle' && o[0].startsWith('ASSIST')) plan = battlePlan(); else if (DBG.mode === 'debate') plan = debatePlan(); else if (DBG.mode !== 'adv' && !plan.length) plan = []; }
    if (j.includes('NEW GAME')) return idxOf(o, W8.start === 'cont' && j.includes('CONTINUE') ? 'CONTINUE' : 'NEW GAME');
    if (j.includes('TRY AGAIN')) return 0;
    if (j.includes('ONE MORE')) return idxOf(o, { restore: 'ONE MORE', empire: 'NONE', open: 'IT ISN\'T MY', true: 'IT ISN\'T MY' }[W8.end || 'restore']);
    if (o[0] === 'YES' && o[1] === 'NOT YET') return 0;
    if (o[0] === 'YES' && o[1] === 'NO') return 0;
    if (DBG.mode === 'trick') return idxOf(o, o.some(x => x.startsWith('OVERRULE')) ? 'OVERRULE' : 'ASSIST');
    if (plan.length) { const p = plan.shift(), i = idxOf(o, p); if (i >= 0) return i; L('plan miss ' + p + ' in ' + j); plan = []; return m.opts.length - 1; }
    if (DBG.mode === 'adv') return advPick(o);
    if (menuSeen && menuSeen.cancelable) return -1;
    return 0;
  }
  // exploration: try the least-tried command, then the least-tried target. MOVE last, and prefer unseen rooms.
  let lastCmd = null;
  function advPick(o) {
    const sc = ADV.cur, key = c => sc + '|' + c;
    let bi = 0, bv = 1e9;
    o.forEach((c, i) => { let v = (tried[key(c)] || 0) * 10 + (c === 'MOVE' ? 25 : 0) + (c === 'THINK' ? 12 : 0); if (v < bv) { bv = v; bi = i; } });
    tried[key(o[bi])] = (tried[key(o[bi])] || 0) + 1; lastCmd = o[bi];
    const S = SCN[sc]; const map = { LOOK: 'look', TALK: 'talk', TRANSLATE: 'translate', SUGGEST: 'suggest', MOVE: 'move' }[o[bi]];
    if (map) { const names = Object.keys(S[map]()); let ti = 0, tv = 1e9; names.forEach((n, i) => { let v = (tried[sc + '|' + o[bi] + '|' + n] || 0) * 10 + (map === 'move' && ADV.visited[sceneIdFor(n)] ? 5 : 0) + (map === 'suggest' ? -30 : 0); if (v < tv) { tv = v; ti = i; } }); tried[sc + '|' + o[bi] + '|' + names[ti]] = (tried[sc + '|' + o[bi] + '|' + names[ti]] || 0) + 1; plan = names.length === 1 && map !== 'move' ? [] : [names[ti]]; }
    return bi;
  }
  const SIDS = { 'THE MALL': 'x', SUITORS: 'suitors', 'LINDA\'S OFFICE': 'office', 'GARF\'S DINER': 'garfs', 'THE ATRIUM': 'atrium', 'GHOST\'S DRESSING ROOM': 'studio', 'THE ARCHIVE': 'archive', 'THE GENERATOR': 'generator', 'THE TOWER': 'tower', 'MY OLD APARTMENT': 'apartment', 'THE GATE': 'testgate', 'THE PLAZA': 'plaza', 'THE BRIDGE': 'bridge' };
  const sceneIdFor = n => SIDS[n];
  function walkAI() {
    const w = DBG.walk; if (!w) return;
    const want = { restore: 'restore', empire: 'empire', open: 'open', true: 'true' }[W8.end || 'restore'];
    const c = w.consoles.find(c => c.k === want) || w.consoles.find(c => c.k === 'restore');
    const tx = c.x, ty = (c.y || 40) + 48;
    if (w.near === c.k) { press('a'); return; }
    if (Math.abs(w.x - tx) > 2) hold(w.x < tx ? 'right' : 'left'); else if (Math.abs(w.y - ty) > 2) hold(w.y < ty ? 'down' : 'up');
  }
  let blackF = 0, flashF = 0;
  function watch() { // things a human would see that a bot can't: dialogs on a black screen, a flash that never ends
    if (post.fade > .95 && (DLG || MENUS.length || CARD)) { if (++blackF === 20) L('WARN FADE-BLACK while ' + (DLG ? 'DLG ' + DLG.lines[0] : MENUS.length ? 'MENU ' + MENUS[0].opts[0] : 'CARD ' + CARD.lines[0])); } else blackF = 0;
    if (post.flash > .25) { if (++flashF === 180) L('WARN FLASH STUCK at ' + post.flash); } else flashF = 0;
  }
  function tick() {
    F++; want = {}; watch();
    if (!anyKey) anyKey = true;
    if (MENUS.length) { const m = MENUS[MENUS.length - 1]; menuT++; if (m._t === undefined) { m._t = menuPick(m); L('MENU [' + m.opts.join(' / ') + '] -> ' + (m._t < 0 ? 'CANCEL' : m.opts[m._t])); } const t = m._t; if (F % 3 === 0) { if (t < 0) press('c'); else if (m.i !== t) press(m.i < t ? 'down' : 'up'); else press('a'); } apply(); return; }
    if (DLG) { const s = DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L((DLG.who ? DLG.who + ': ' : '') + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (DBG.credits) { if (F % 2) hold('start'); apply(); return; }
    if (DBG.mode === 'walk') { walkAI(); apply(); return; }
    if (F % 8 === 0) press('a');
    apply();
  }
  function apply() { for (const k of ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start']) kb[k] = want[k] ? 1 : 0; last = Object.assign({}, want); }
  return { tick, set(w) { W8 = w; }, get F() { return F; } };
})();
