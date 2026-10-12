// DARK MONDAY level validator and solver (node tools/dmreach.js [level] [--map])
// Checks the data is wired up, then plays the level as a fixpoint: reach cells, collect keys, press plates and levers, open what they open.
// A second, looser pass assumes secret walls and optional gates (a translator, a detective) can be opened; anything only reachable then is reported as a note.
// Progress must never need a particular character: only the loose pass may rely on one.
const X = require('./dmvm.js'); const ctx = X.load(); const R = s => X.R(ctx, s);
const only = process.argv.find(a => /^\d+$/.test(a)), showMap = process.argv.includes('--map');
const N = R('Object.keys(LEVEL_MAKERS).map(Number)').filter(n => n > 0 && (only === undefined || n === +only));
let bad = 0; const err = (n, m) => { bad++; console.log('  FAIL L' + n + ': ' + m); }, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], F = { N: 0, E: 1, S: 2, W: 3 };
for (const n of N) {
  R(`globalThis.__L = LEVEL_MAKERS[${n}]();`); const L = R('__L'), rows = L.rows, ch = (x, y) => (y < 0 || x < 0 || y >= L.h || x >= L.w) ? '#' : rows[y][x];
  console.log('LEVEL ' + n + ': ' + L.name + ' ' + L.w + 'x' + L.h + '  mobs ' + L.mobs.length + '  items ' + L.items.length);
  const open = (x, y) => '.pOT<>D'.includes(ch(x, y));
  for (const k in L.decor) { const [x, y, f] = k.split(','); const X0 = +x, Y0 = +y, d = F[f]; if (!'#S'.includes(ch(X0, Y0))) err(n, 'decor ' + k + ' is not on a wall block'); else if (!open(X0 + DX[d], Y0 + DY[d])) err(n, 'decor ' + k + ' faces a wall'); }
  for (const k in L.text) if (!L.decor[k]) err(n, 'text without decor at ' + k);
  for (const kind of ['lever', 'touch', 'translate']) for (const k in L.trig[kind]) { const dc = L.decor[k]; if (!dc || (kind === 'lever' && dc.k !== 'lever')) err(n, kind + ' trigger ' + k + ' has no matching decor'); }
  for (const k in L.trig.plate) { const [x, y] = k.split(',').map(Number); if (ch(x, y) !== 'p') err(n, 'plate trigger at ' + k + ' is not on a plate'); }
  for (const k in L.trig.step) { const [x, y] = k.split(',').map(Number); if (!open(x, y)) err(n, 'step trigger at ' + k + ' is inside a wall'); }
  const acts = []; for (const kind of ['lever', 'plate', 'step', 'touch', 'translate']) for (const k in L.trig[kind]) acts.push([kind, k, L.trig[kind][k]]); for (const m of L.mobs) if (m.die) acts.push(['die', m.t + m.x + ',' + m.y, m.die]);
  const doorRefs = new Set();
  for (const [, , t] of acts) { for (const d in t.door || {}) doorRefs.add(d); for (const d in t.opens || {}) doorRefs.add(d); for (const d of t.reveal || []) { if (ch(...d.split(',').map(Number)) !== 'S') err(n, 'reveal target ' + d + ' is not a secret wall'); }
    if (t.banter && !R(`!!BANTER[${JSON.stringify(t.banter)}]`)) err(n, 'unknown banter ' + t.banter); if (t.scene && !R(`!!SCENES[${JSON.stringify(t.scene)}]`)) err(n, 'unknown scene ' + t.scene); if (t.give && !R(`!!ITEMS[${JSON.stringify(t.give)}]`)) err(n, 'unknown give ' + t.give); if (t.wake && !L.mobs.some(m => m.t === t.wake)) err(n, 'wake target ' + t.wake + ' not on this level'); }
  for (const d of doorRefs) if (!L.st.door[d]) err(n, 'trigger opens ' + d + ' which is not a door');
  for (const k of L.sealed || []) if (!L.st.door[k]) err(n, 'sealed ' + k + ' is not a door'); for (const k in L.locks || {}) if (!L.st.door[k]) err(n, 'lock ' + k + ' is not a door');
  for (const it of L.items) { if (!open(it.x, it.y)) err(n, 'item ' + it.id + ' is inside a wall at ' + it.x + ',' + it.y); if (!R(`!!ITEMS[${JSON.stringify(it.id)}]`)) err(n, 'unknown item ' + it.id); }
  for (const m of L.mobs) { if (!open(m.x, m.y) || ch(m.x, m.y) === 'D') err(n, 'monster ' + m.t + ' is not on floor at ' + m.x + ',' + m.y); if (m.path) for (const [px, py] of m.path) if (!open(px, py)) err(n, 'patrol point ' + px + ',' + py + ' is in a wall'); }
  for (const k in L.stairs || {}) { const [x, y] = k.split(',').map(Number); if (!'<>'.includes(ch(x, y))) err(n, 'stairs entry ' + k + ' is not a stair cell'); }
  // every open cell must render in every facing, with the level's monsters and items in view (the autopilot does not draw, so this is the only place that catches a drawing crash)
  { let crashes = 0; for (let y = 0; y < L.h; y++) for (let x = 0; x < L.w; x++) { if (!open(x, y)) continue; for (let d = 0; d < 4; d++) { try { R(`renderView(__L, { x: ${x}, y: ${y}, dir: ${d}, dark: ${(L.darkZones || []).some(([a, b, c, e]) => x >= a && x <= c && y >= b && y <= e)} }, mobEnts({ lv: __L, dir: ${d} }).concat(itemEnts({ lv: __L })))`); } catch (e) { if (crashes++ < 3) console.log('   render crash at ' + x + ',' + y + ' dir ' + d + ': ' + e.message.slice(0, 80)); } } } if (crashes) err(n, crashes + ' render crashes'); }
  // ---- solve, strictly (any party) and loosely (with secret walls and optional gates)
  const solve = loose => {
    const keys = new Set(), opened = new Set(loose ? (L.optional || []) : []), fired = new Set(); let reach = new Set(), changed = true;
    const passable = (x, y) => { const c = ch(x, y); if ('.pOT<>'.includes(c)) return true; if (c === 'S') return !!loose; if (c === 'D') { const d = L.st.door[x + ',' + y]; if (d.locked === 'TRIG') return opened.has(x + ',' + y); if (d.locked) return keys.has(d.locked); return true; } return false; };
    while (changed) {
      changed = false; const q = [L.start.slice(0, 2)], seen = new Set([L.start[0] + ',' + L.start[1]]);
      for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (let d = 0; d < 4; d++) { const nx = x + DX[d], ny = y + DY[d], k = nx + ',' + ny; if (!seen.has(k) && passable(nx, ny)) { seen.add(k); q.push([nx, ny]); } } }
      reach = seen;
      for (const it of L.items) if (reach.has(it.x + ',' + it.y) && !keys.has(it.id)) { keys.add(it.id); changed = true; }
      const fire = (t, id) => { if (fired.has(id)) return; fired.add(id); changed = true; for (const d in t.door || {}) if (t.door[d]) opened.add(d); for (const d in t.opens || {}) if (t.opens[d]) opened.add(d); if (t.give) keys.add(t.give); };
      for (const k in L.trig.plate) if (reach.has(k)) fire(L.trig.plate[k], 'plate' + k);
      for (const k in L.trig.step) if (reach.has(k)) fire(L.trig.step[k], 'step' + k);
      for (const m of L.mobs) if (m.die && reach.has(m.x + ',' + m.y)) fire(m.die, 'die' + m.t);
      for (const nn of L.npcs || []) if (nn.id === 'PEEKID' && reach.has('8,12') && !keys.has('KEY_CYAN')) { keys.add('KEY_CYAN'); changed = true; }
      const facing = (k) => { const [x, y, f] = k.split(','), d = F[f]; return reach.has((+x + DX[d]) + ',' + (+y + DY[d])); };
      for (const k in L.trig.lever) if (facing(k)) fire(L.trig.lever[k], 'lever' + k);
      for (const k in L.trig.touch) if (facing(k)) fire(L.trig.touch[k], 'touch' + k);
      if (loose) for (const k in L.trig.translate) if (facing(k)) fire(L.trig.translate[k], 'tr' + k);
    }
    return { reach, keys, opened };
  };
  const S = solve(false), Lo = solve(true), stairs = Object.keys(L.stairs || {});
  // doors must be real gates: with the door blocked and everything else open, its two sides stay apart
  for (const [k, d] of Object.entries(L.st.door)) { if (!d.locked) continue; const [dx0, dy0] = k.split(',').map(Number), horiz = ch(dx0 - 1, dy0) !== '#' || ch(dx0 + 1, dy0) !== '#'; const a = horiz ? [dx0 - 1, dy0] : [dx0, dy0 - 1], b = horiz ? [dx0 + 1, dy0] : [dx0, dy0 + 1];
    const seen = new Set([L.start[0] + ',' + L.start[1]]), q = [L.start.slice(0, 2)]; for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (let dd = 0; dd < 4; dd++) { const nx = x + DX[dd], ny = y + DY[dd], kk = nx + ',' + ny; if (kk === k || seen.has(kk) || !('.pOT<>D'.includes(ch(nx, ny)))) continue; seen.add(kk); q.push([nx, ny]); } }
    if (seen.has(a.join(',')) && seen.has(b.join(','))) err(n, 'door ' + k + ' can be bypassed (both sides connect another way)'); }
  for (const s of stairs) if (!S.reach.has(s)) err(n, 'cannot reach the stairs at ' + s + (Lo.reach.has(s) ? ' without a special character or a secret' : ''));
  for (const it of L.items) if (!S.reach.has(it.x + ',' + it.y)) { if (Lo.reach.has(it.x + ',' + it.y)) console.log('  note: ' + it.id + ' at ' + it.x + ',' + it.y + ' is optional (secret wall or a special gate)'); else err(n, 'unreachable item ' + it.id + ' at ' + it.x + ',' + it.y); }
  for (const m of L.mobs) if (!S.reach.has(m.x + ',' + m.y)) { if (Lo.reach.has(m.x + ',' + m.y)) console.log('  note: ' + m.t + ' at ' + m.x + ',' + m.y + ' is optional'); else err(n, 'unreachable monster ' + m.t + ' at ' + m.x + ',' + m.y); }
  for (const [k, d] of Object.entries(L.st.door)) if (d.locked && d.locked !== 'TRIG' && !S.keys.has(d.locked)) err(n, 'door ' + k + ' needs ' + d.locked + ' which is never found'); else if (d.locked === 'TRIG' && !S.opened.has(k)) { if ((L.optional || []).includes(k) && Lo.opened.has(k)) console.log('  note: sealed door ' + k + ' is optional (needs a special character)'); else err(n, 'sealed door ' + k + ' is never opened by anything'); }
  console.log('  reachable cells ' + S.reach.size + ' (' + Lo.reach.size + ' with secrets), keys: ' + [...S.keys].filter(k => k.startsWith('KEY')).join(', ') + ', stairs ' + (stairs.length ? stairs.map(s => S.reach.has(s) ? 'ok' : 'NO').join(',') : 'none'));
  const xp = L.mobs.reduce((s, m) => s + R(`MON[${JSON.stringify(m.t)}].xp`), 0), heal = L.items.filter(i => /PILLS/.test(i.id)).length, food = L.items.filter(i => /LASAGNA|RATION/.test(i.id)).length; console.log('  xp on the level ' + xp + ', pill stacks ' + heal + ', food ' + food);
  if (showMap) { const g = rows.map(r => r.split('')); L.items.forEach(i => { g[i.y][i.x] = 'i'; }); L.mobs.forEach(m => { g[m.y][m.x] = m.t === 'COLLECTOR' ? 'C' : m.t === 'PRIME' || m.t === 'BEHOLDEN' ? 'B' : m.t === 'MANAGER' ? 'M' : 'm'; }); (L.npcs || []).forEach(m => { g[m.y][m.x] = 'N'; }); g[L.start[1]][L.start[0]] = '@'; console.log(g.map((r, y) => String(y).padStart(2) + ' ' + r.join('')).join('\n')); }
}
console.log(bad ? bad + ' PROBLEMS' : 'ALL OK'); process.exit(bad ? 1 : 0);
