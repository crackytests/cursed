// ===== playtest bot: acts ONLY through button presses (kb) + reading state =====
var BOT_TYPE = 'HELLO', SEEN = null, FR = 0, BT = 1e7, WANT = [], STEALTH = false, PHASE = false, CAUGHT = 0, BATTLES = [];
const KEYS = ['up', 'down', 'left', 'right', 'a', 'b', 'start'];
function say_(s) { console.log('  [' + (FR / 3600).toFixed(1) + 'm] ' + s); }
function diag() { return JSON.stringify({ map: M && M.id, x: P.x, y: P.y, dir: P.dir, busy, world: scene === worldScene, dlg: dlg && dlg.lines, menus: menus.map(m => m.opts), mode: DBG.mode, card: card && card.lines, FR }); }
async function fr() { acc = 16.7; lastT = BT; BT += 16.7; loop(BT); FR++; await new Promise(r => setImmediate(r)); }
async function frames(n) { for (let i = 0; i < n; i++) await fr(); }
const clear = () => KEYS.forEach(k => { kb[k] = 0; });
async function tap(k) { kb[k] = 1; await fr(); kb[k] = 0; await fr(); }

// ---------- minigame play ----------
function miniInput() {
  clear();
  const m = DBG.mode;
  if (m === 'pill') {
    const { x, items } = DBG.pc();
    const goods = items.filter(i => !i.bad).sort((a, b) => b.y - a.y);
    let tx = x;
    for (const g of goods) { const bad = items.some(b => b.bad && b.y > g.y - 30 && b.y < 124 && Math.abs(b.x - g.x) < 12); if (!bad) { tx = g.x - 3; break; } }
    if (tx < x - 1) kb.left = 1; else if (tx > x + 1) kb.right = 1;
  } else if (m === 'bus') { const { bx, miles } = DBG.bus(); if (miles > 51) { if (FR % 4 === 0) kb.b = 1; } else if (bx > 79) kb.left = 1; else if (bx < 77) kb.right = 1; }
  else if (m === 'rhythm') { const t = DBG.rh.t(); const n = DBG.rh.notes.find(n => !n.res && n.t === t + 1); if (n) kb[n.d] = 1; }
  else if (m === 'sigil') { if (FR % 3 === 0) kb[DBG.sg.seq[DBG.sg.got()]] = 1; }
  else if (m === 'kbd') { if (FR % 2) return; const { keys, i, s } = DBG.kb, cur = s();
    if (cur === BOT_TYPE) { kb.start = 1; return; }
    if (!BOT_TYPE.startsWith(cur)) { kb.b = 1; return; }
    const want = keys.indexOf(BOT_TYPE[cur.length]); if (i() === want) kb.a = 1; else if (i() < want) kb.right = 1; else kb.left = 1; }
  else if (m === 'vision') { if (FR % 2) return; const { wv, rl, pl } = DBG.vi(); if (wv) kb.left = 1; else if (rl) kb.up = 1; else if (pl) kb.a = 1; }
  else if (m === 'descend') { const { gx, sx } = DBG.ds(); const c = gx + 16; if (c < sx - 2) kb.right = 1; else if (c > sx + 2) kb.left = 1; }
}

// ---------- menus: WANT list first, then battle tactics, else first option ----------
function battlePick(opts) {
  if (typeof B === 'undefined' || !B) return null;
  const f = B.foe;
  const weak = k => f.weak[k] !== undefined ? f.weak[k] : 1;
  // Carl arguments
  if (opts[0] === 'ARGUE') {
    if (B.hp < B.max * .35 && S.items.some(i => ['PRETZEL', 'BLANKET'].includes(i)) && !(S.items.includes('BLANKET') && B.used.BLANKET && !S.items.includes('PRETZEL'))) return 'ITEM';
    if (f.chatBoost && f.hp <= f.max / 2) return 'ASK CHAT';
    return 'ARGUE';
  }
  if (opts.includes('GRIEVANCE')) {
    const cands = ['LOGIC', 'GRIEVANCE', 'DENIAL'].filter(k => k !== B.last).sort((a, b) => weak(b) - weak(a));
    if (weak('RANT') >= 2 && B.last !== 'RANT' && B.hp > 6) return 'RANT';
    return cands[0];
  }
  // Linda negotiations
  if (opts[0] === 'NEGOTIATE') {
    if (B.hp < B.max * .35 && esp() > 0) return 'PRODUCT';
    if (f.chatBoost && F('allyFace') && f.hp <= f.max * .6) return 'POLL CHAT';
    return 'NEGOTIATE';
  }
  if (opts[0] === 'DIRECTIVE') {
    if (B.longLast || (f.finisher && f.hp <= f.max * .35)) return 'SHORT ANSWER';
    const k = ['DIRECTIVE', 'PITCH', 'SHORT', 'LEVERAGE'].filter(k => !(k === 'DIRECTIVE' && f.contrary) && !(k === 'LEVERAGE' && (S.funds < 50 || weak(k) < 1.5)))
      .sort((a, b) => weak(b) - weak(a))[0];
    return { DIRECTIVE: 'DIRECTIVE', PITCH: 'PITCH', SHORT: 'SHORT ANSWER', LEVERAGE: 'LEVERAGE' }[k];
  }
  if (opts.some(o => o.startsWith('PRETZEL') || o.startsWith('BLANKET') || o.startsWith('ESPRESSO'))) return opts.find(o => o.startsWith('PRETZEL') || o.startsWith('ESPRESSO')) || opts.find(o => o.startsWith('BLANKET')) || 0;
  return null;
}
function policy(opts) {
  for (let j = 0; j < WANT.length; j++) { const i = opts.findIndex(o => o.startsWith(WANT[j])); if (i >= 0) { WANT.splice(j, 1); return i; } }
  const b = battlePick(opts); if (b !== null) { const i = typeof b === 'number' ? b : opts.findIndex(o => o.startsWith(b)); if (i >= 0) return i; }
  return 0;
}
async function handleMenu() {
  const m = menus[menus.length - 1], want = policy(m.opts);
  let g = 0; while (m.i !== want && g++ < 20) { await tap('down'); }
  await tap('a');
}
async function settle(max = 80000) {
  let n = 0, idle = 0;
  for (;;) {
    if (++n > max) throw new Error('STUCK in settle');
    if (DBG.mode) { miniInput(); await fr(); continue; }
    clear();
    if (menus.length) { await handleMenu(); idle = 0; continue; }
    if (dlg || chatBox) { await tap('a'); idle = 0; continue; }
    if (!busy && !P.mv) { if (++idle > (scene === worldScene ? 4 : 240)) return; } else idle = 0;
    if (busy && n % 25 === 0) await tap('a'); else await fr();
  }
}

// ---------- movement ----------
const dirTo = (tx, ty) => tx > P.x ? 'right' : tx < P.x ? 'left' : ty > P.y ? 'down' : 'up';
function passable(x, y) {
  if (x < 0 || y < 0 || x >= M.w || y >= M.h) return false;
  const T0 = tdef(x, y); if (!T0) return false;
  if (T0.solid && !(PHASE && T0.thin && S.ecto >= 25)) return false;
  if (M.def.steps && M.def.steps[x + ',' + y]) return false;
  if (SEEN && SEEN.has(x + ',' + y)) return false;
  return !M.ents.some(e => e.solid && visible(e) && covers(e, x, y));
}
function bfs(tx, ty, adj) {
  const key = (x, y) => x + ',' + y, prev = { [key(P.x, P.y)]: null }, q = [[P.x, P.y]];
  const goal = (x, y) => adj ? Math.abs(x - tx) + Math.abs(y - ty) === 1 : (x === tx && y === ty);
  while (q.length) {
    const [x, y] = q.shift();
    if (goal(x, y)) { const p = []; let k = key(x, y); while (prev[k]) { p.unshift(prev[k][2]); k = prev[k][0] + ',' + prev[k][1]; } return p; }
    for (const d of ['up', 'down', 'left', 'right']) {
      const nx = x + DIRS[d][0], ny = y + DIRS[d][1], k = key(nx, ny);
      if (k in prev) continue;
      if (!passable(nx, ny) && !(!adj && nx === tx && ny === ty && tdef(nx, ny) && !tdef(nx, ny).solid)) continue;
      prev[k] = [x, y, d]; q.push([nx, ny]);
    }
  }
  return null;
}
function seenTiles() {
  const s = new Set();
  for (const e of M.ents) {
    if (e.spr === 'curse' && visible(e)) { for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) s.add((e.x + dx) + ',' + (e.y + dy)); continue; }
    if (!e.vision || !visible(e)) continue;
    s.add(e.x + ',' + e.y);
    for (const d of ['up', 'down', 'left', 'right']) s.add((e.x + DIRS[d][0]) + ',' + (e.y + DIRS[d][1]));
    for (const d of [e.dir]) {
      const [dx, dy] = DIRS[d]; let x = e.x, y = e.y;
      for (let i = 0; i < e.vision + 1; i++) { x += dx; y += dy; const T0 = tdef(x, y); if (!T0 || T0.solid) break; s.add(x + ',' + y); }
    }
  }
  return s;
}
async function goTo(tx, ty, o = {}) {
  let steps = 0, waits = 0; const m0 = M.id;
  for (;;) {
    if (busy || dlg || menus.length) { await settle(); if (M.id !== m0) return 'warped'; continue; }
    if (P.x === tx && P.y === ty && !o.adj) return;
    SEEN = STEALTH ? seenTiles() : null;
    let path = bfs(tx, ty, o.adj);
    if (!path && SEEN) { // no safe route right now: step out of sight if we're in a lane, else wait
      if (SEEN.has(P.x + ',' + P.y)) { const out = ['up','down','left','right'].find(d => { const nx = P.x + DIRS[d][0], ny = P.y + DIRS[d][1]; return passable(nx, ny); }); if (out) path = [out]; }
      if (!path) { SEEN = null; if (++waits > (o.maxWait || 1500)) { if (o.maxWait) throw new Error('no safe path to ' + tx + ',' + ty); path = bfs(tx, ty, o.adj); waits = 0; } else { await frames(4); continue; } }
    }
    SEEN = null;
    if (!path) { await frames(10); if (++waits > 2000) throw new Error('no path to ' + tx + ',' + ty); continue; }
    if (!path.length) return;
    if (++steps > 4000) throw new Error('goTo gave up ' + tx + ',' + ty);
    const d = path[0], nx = P.x + DIRS[d][0], ny = P.y + DIRS[d][1];
    if (PHASE && tdef(nx, ny).thin) kb.b = 1;
    kb[d] = 1; const sx = P.x, sy = P.y; let w = 0;
    while (P.x === sx && P.y === sy && !busy && w++ < 30) await fr();
    kb[d] = 0; kb.b = 0;
    while (P.mv) await fr();
    await fr();
    if (M.id !== m0) { await settle(); return 'warped'; }
  }
}
async function face(tx, ty) {
  const d = dirTo(tx, ty);
  if (P.dir === d) return;
  if (!passable(tx, ty)) { kb[d] = 1; await fr(); kb[d] = 0; await frames(2); return; }
  // walkable target: back off one tile and approach so the last step faces it
  const bx = P.x - DIRS[d][0], by = P.y - DIRS[d][1], ax = P.x, ay = P.y;
  await goTo(bx, by); await goTo(ax, ay);
}
async function talk(tx, ty, ...want) {
  if (want.length) WANT = want;
  await goTo(tx, ty, { adj: true });
  await face(tx, ty);
  if (P.dir !== dirTo(tx, ty)) throw new Error('could not face ' + tx + ',' + ty);
  await tap('a'); await settle();
  WANT = [];
}
async function walkOut(x, y, d) { await goTo(x, y); kb[d] = 1; await frames(6); kb[d] = 0; await settle(); }
async function stepOn(x, y) { await goTo(x, y, { adj: true }); const d = dirTo(x, y); kb[d] = 1; await frames(4); kb[d] = 0; while (P.mv) await fr(); await settle(); }
async function menu(label, ...more) { WANT = [label, ...more]; await tap('start'); await settle(); WANT = []; }
async function waitFor(cond, max = 20000, what = '') { let n = 0; while (!cond()) { if (n++ > max) throw new Error('waitFor ' + what); if (menus.length || dlg || chatBox || DBG.mode) await settle(); else await fr(); } }
function check(c, msg) { if (!c) throw new Error('CHECK FAILED: ' + msg); say_('ok: ' + msg); }
async function startGame(opt) {
  anyKey = true;
  await waitFor(() => scene && scene.update && !busy && fx.fade === 0 && frame > 300, 3000, 'title');
  await frames(40); WANT = [opt]; await tap('start'); await settle(); WANT = [];
  await waitFor(() => M && scene === worldScene, 20000, 'first map'); await settle();
}
// capture log: wrap every map's caught() once
const CAPS = [];
for (const id in MAPS) { const d = MAPS[id]; if (d.caught) { const c0 = d.caught; d.caught = async e => { CAPS.push(id + ':' + (e && e.id) + ' guard@' + (e && e.x + ',' + e.y + ' ' + e.dir) + ' me@' + P.x + ',' + P.y); if (CAPS.length % 5 === 0) say_('caught ' + CAPS.length + 'x, last: ' + CAPS[CAPS.length - 1]); return c0(e); }; } }
