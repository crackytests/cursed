// CARL 2 EXTREME playthrough bot: boots the real game, mashes through cards, and plays every level with foes on.
// Routes come from a planner vm (tools/c2xbfs.js) fed the live level; the bot fights on top of the route,
// burns walls of text, replans when knocked off course, and has a small AI per boss.
// node tools/c2xplay.js [startLevel] [maxFrames]   env SHOTS=1 (every 900 frames), FROM=level (skip intro via SETUP)
// CART=smb|smw|son1|son2|son3 plays one bonus cart from its title to its outro instead of the main game.
const { load, G } = require('./c2xvm'), path = require('path'), BFS = require('./c2xbfs');
const [startLv = '0', MAXF = '400000'] = process.argv.slice(2);
const live = load(), planner = load();
G.R(planner, BFS);
const errs = []; live.console = Object.assign({}, console, { error: (...a) => errs.push(a.map(String).join(' ')) });
const R = s => G.R(live, s);
R(`anyKey = true; DBG.log = []; DBG.log.push = (...a) => { console.log('  ' + a.join(' ')); return Array.prototype.push.apply(DBG.log, a); }; const _die = die; die = why => { if (!PL.dead) DBG.log.push('DIED ' + LV.def.id + ' x=' + (PL.x / 16 | 0) + ' y=' + (PL.y / 16 | 0) + ' why=' + why + ' hp=' + PL.hp + ' lives=' + RUN.lives + (BOSS ? ' boss=' + BOSS.name + ':' + BOSS.hp : '')); _die(why); };
  const _ouch = ouch; ouch = (n, why) => { if (PL.hurt <= 0 && !PL.dead) DBG.log.push('hurt ' + LV.def.id + ' x=' + (PL.x / 16 | 0) + ' ' + (why || '') + ' near=' + (ENTS.filter(e => e.foe && !e.dead && Math.abs(e.x - PL.x) < 40).map(e => e.kind).join('/') || (SHOTS.length ? 'shot' : BOSS ? 'boss' : '?'))); _ouch(n, why); };
  run(boot);`);
if (process.env.CART) R(`RUN.cartFrom = ${+process.env.CARTLV || 0}; titleScreen = async () => { await playCart(CARTS.find(c => c.id === '${process.env.CART}')); DBG.done = 1; };`);
if (+startLv) R(`const _game = game; game = () => { RUN.lv = ${+startLv}; return _game(); }; intro = async () => {};`);
// underwater: a tile path through open water (2 tiles of headroom), steered with strokes
R(`function swimNext(goalX) {
  const open = (x, y) => !solidAt(x, y) && !solidAt(x, y + 1) && y >= LV.water - 1;
  const sx = Math.floor((PL.x + 5) / 16), sy = Math.floor((PL.y + 2) / 16);
  let tgt = null; const vents = ENTS.filter(e => e.kind === 'vent');
  if (PL.air < 35 && vents.length) { const v = vents.reduce((a, b) => Math.abs(b.x - PL.x) < Math.abs(a.x - PL.x) ? b : a); if (Math.abs(v.x - PL.x) < 260) tgt = [Math.floor(v.x / 16), Math.floor(v.y / 16) - 2]; }
  const prev = new Map(), Q = [[sx, sy]]; prev.set(sx + ',' + sy, null); let end = null;
  while (Q.length) { const [x, y] = Q.shift();
    if (tgt ? (x === tgt[0] && y === tgt[1]) : x * 16 > goalX) { end = x + ',' + y; break; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!prev.has(k) && inMap(nx, ny) && open(nx, ny)) { prev.set(k, x + ',' + y); Q.push([nx, ny]); } } }
  if (!end) return null;
  const path = []; for (let k = end; k; k = prev.get(k)) path.unshift(k.split(',').map(Number));
  const w = path[Math.min(2, path.length - 1)]; return { x: w[0] * 16 + 8, y: w[1] * 16 + 8, n: path.length, vent: !!tgt };
}`);
const KEYS = ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start'];
const setKeys = k => R(KEYS.map(n => `kb.${n} = ${k[n] ? 1 : 0}`).join(';'));
let arenaT = 0, F = 0, T = 0, plan = null, seg = 0, fi = 0, burnT = 0, lvFrames = 0, lastLv = '', stats = {}, replans = 0, shotN = 0, lastX = 0, stall = 0;
function shot(tag) { const out = path.join(__dirname, 'shots', 'play_' + String(shotN++).padStart(3, '0') + '_' + tag + '.png'); G.png(live, out, 2); return out; }
function makePlan() {
  const st = R(`(() => {
    const rings = ENTS.filter(e => e.kind === 'ring'), ropes = ENTS.filter(e => e.kind === 'rope');
    const pl = Object.assign({}, PL, { hang: PL.hang ? rings.indexOf(PL.hang) : -1, rope: PL.rope ? ropes.indexOf(PL.rope) : -1, lastRope: PL.lastRope ? ropes.indexOf(PL.lastRope) : -1 });
    const g = ENTS.filter(e => e.kind === 'goal').sort((a, b) => a.x - b.x)[0], far = PL.x + 30 * 16; // plan in chunks: ~30 tiles at a time
    let goal = LV.def.boss && !ARENA ? { x: LV.def.boss.at * 16 + 56 } : 'goal';
    if (goal === 'goal' ? g && g.x > far : goal.x > far) goal = { x: far };
    return JSON.stringify({ lv: LEVELS.indexOf(LV.def), g: LV.g, pl, ropes: ropes.map(r => [r.th, r.w]), goal, got: RUN.got });
  })()`);
  const t0 = Date.now();
  const res = G.R(planner, `(() => { const S = ${st};
    RUN.got = S.got; loadLevel(LEVELS[S.lv]); LV.finish = () => {};
    LV.g = S.g.map(r => r.map(c => c === 'W' || c === 'w' ? '.' : c));
    ENTS = ENTS.filter(e => !e.foe && e.kind !== 'post');
    const rings = ENTS.filter(e => e.kind === 'ring'), ropes = ENTS.filter(e => e.kind === 'rope');
    S.ropes.forEach((v, i) => { ropes[i].th = v[0]; ropes[i].w = v[1]; });
    Object.assign(PL, S.pl); PL.hang = S.pl.hang >= 0 ? rings[S.pl.hang] : null; PL.rope = S.pl.rope >= 0 ? ropes[S.pl.rope] : null; PL.lastRope = S.pl.lastRope >= 0 ? ropes[S.pl.lastRope] : null;
    PL.hurt = 0; PL.dead = 0; PL.hp = 3; BONG = null; BOSS = null; ARENA = null; LV.lock = null; PL.scr = 0;
    return JSON.stringify(planRoute({ goal: S.goal, maxSims: 50000 }));
  })()`);
  replans++;
  const p = JSON.parse(res);
  if (!p.found) { R(`DBG.log.push('NO ROUTE ${''}' + LV.def.id + ' x=' + (PL.x / 16 | 0) + ' y=' + (PL.y / 16 | 0) + ' nodes=${p.nodes} sims=${p.sims}')`); return null; }
  return p;
}
const liveKey = () => R(`(() => { const rings = ENTS.filter(e => e.kind === 'ring'), ropes = ENTS.filter(e => e.kind === 'rope'); return PL.rope ? 'r' + ropes.indexOf(PL.rope) : PL.hang ? 'h' + rings.indexOf(PL.hang) : PL.on ? Math.floor((PL.x + 5) / 16) + ',' + Math.round((PL.y + PL.h) / 16) : null; })()`);
// fighting on top of the route: throw at foes ahead when the route doesn't need the bong soon, flame close ones and walls
function overlay(k, upcoming) {
  const s = JSON.parse(R(`JSON.stringify((() => {
    const ahead = ENTS.filter(e => e.foe && !e.dead && (e.x + e.w / 2 - PL.x - 5) * PL.face > -4 && Math.abs(e.x + e.w / 2 - PL.x - 5) < 130 && Math.abs(e.y + e.h / 2 - PL.y - 10) < 26);
    const near = ahead.some(e => Math.abs(e.x + e.w / 2 - PL.x - 5) < 46);
    const shot = SHOTS.some(q => q.burn && Math.abs(q.x - PL.x) < 50 && Math.abs(q.y - PL.y - 8) < 18);
    const tx = Math.floor((PL.x + 5 + PL.face * 18) / 16); let wall = false; for (const y of [PL.y + 2, PL.y + 12, PL.y + 19]) if (tileAt(tx, Math.floor(y / 16)) === 'W') wall = true;
    return { ahead: ahead.length, near, shot, wall, bong: !!BONG, wet: swimming(), hot: PL.hot };
  })())`));
  const needA = upcoming.some(u => u.a || u.up);
  if (s.ahead && !s.bong && !needA && (T & 7) === 0) k = Object.assign({}, k, { a: 1 });
  if ((s.near || s.shot || s.wall) && !s.wet && !s.hot) k = Object.assign({}, k, { c: 1 });
  return k;
}
function bossKeys() {
  const b = JSON.parse(R(`JSON.stringify((() => { if (!BOSS) return null; const B = BOSS, hb = B.hitbox(); const rings = ENTS.filter(e => e.kind === 'ring');
    return { id: LV.def.boss.id, x: hb.x + hb.w / 2, y: hb.y + hb.h / 2, w: hb.w, st: B.st, t: B.t, dir: B.dir, open: B.open, daze: B.daze, shield: B.shield ? B.shield.filter(s => s.alive).length : 0, dying: B.dying,
      px: PL.x + 5, py: PL.y + 10, on: PL.on, hang: !!PL.hang, face: PL.face, bong: !!BONG, air: PL.air, hot: PL.hot, wet: swimming(), x0: ARENA.x0,
      waves: SHOTS.filter(s => s.wave).map(s => [s.x, s.vx]), shots: SHOTS.map(s => [s.x + s.w / 2, s.y + s.h / 2, s.vx]), ball: B.ball ? [B.ball().cx, B.ball().cy] : null, sv: B.sv || 0, ph: B.ph, gl: B.gl, letters: SHOTS.filter(s => s.ch).map(s => [s.x, s.y]), rings: rings.map(r => [r.x, r.y]), vents: ENTS.filter(e => e.kind === 'vent').map(v => v.x) }; })())`));
  if (!b || b.dying) return {};
  const k = {}, dx = b.x - b.px, toward = dx > 0 ? 'right' : 'left', away = dx > 0 ? 'left' : 'right', adx = Math.abs(dx);
  const tap = n => (F % n) === 0;
  if (b.id === 'robo') {
    if (b.hang) {
      if ((b.st === 'walk' || b.st === 'dizzy') && adx > 50) k.down = 1;
      else if (b.st === 'walk' && adx <= 50) { const other = b.rings.find(r => Math.abs(r[0] - b.px) > 40); if (other) { const want = other[0] > b.px ? 'right' : 'left'; k[want] = 1; if ((want === 'right') === (b.face > 0) && tap(5)) { k.up = 1; k.a = 1; } } }
      return k; }
    if (b.st === 'wind' || b.st === 'charge') { const r = b.rings.reduce((a, r) => Math.abs(r[0] - b.px) < Math.abs(a[0] - b.px) ? r : a); const want = r[0] > b.px ? 'right' : 'left'; if ((want === 'right') !== (b.face > 0)) k[want] = 1; else if (tap(4)) { k.up = 1; k.a = 1; } return k; }
    if (b.waves.some(([x, vx]) => Math.abs(x - b.px) < 34 && (x - b.px) * vx < 0) && b.on) { k.b = 1; return k; }
    if (b.st === 'dizzy') { if (adx > 70) k[toward] = 1; else if ((dx > 0) !== (b.face > 0)) k[toward] = 1; if (!b.bong && tap(6)) k.a = 1; if (adx < 56) k.c = 1; return k; }
    if (adx < 70) k[away] = 1; else if (adx > 130) k[toward] = 1; else if ((dx > 0) !== (b.face > 0)) k[toward] = 1;
    if (!b.bong && (dx > 0) === (b.face > 0) && tap(6)) k.a = 1;
    return k;
  }
  if (b.id === 'moby') {
    if (b.air < 35) { const v = b.vents.reduce((a, x) => Math.abs(x - b.px) < Math.abs(a - b.px) ? x : a); if (Math.abs(v - b.px) > 4) k[v > b.px ? 'right' : 'left'] = 1; k.down = 1; return k; }
    // between readings: stay out of his lane (he drifts toward our height); when he opens up, get in front
    if (!b.open) { const ty2 = 11 * 16 - 2; if (b.py > ty2 + 8 && (F % 12) === 0) k.b = 1; else if (b.py < ty2 - 8) k.down = 1; if (adx < 70) k[away] = 1; return k; }
    const tx = b.dir < 0 ? b.x - b.w / 2 - 80 : b.x + b.w / 2 + 80, ty = b.y + 6;
    if (Math.abs(tx - b.px) > 10) k[tx > b.px ? 'right' : 'left'] = 1;
    else if ((dx > 0) !== (b.face > 0)) k[toward] = 1;
    if (b.py > ty + 8 && tap(12)) k.b = 1; else if (b.py < ty - 8) k.down = 1;
    if (b.open > 0 && !b.bong && (dx > 0) === (b.face > 0) && Math.abs(b.py - ty) < 26) k.a = 1;
    return k;
  }
  if (['bosser', 'intern', 'robux', 'mecha', 'knux'].includes(b.id)) { // the bonus carts: keep a distance, face it, bong it
    const facing = (dx > 0) === (b.face > 0);
    const danger = b.shots.some(([x, y, vx]) => Math.abs(x - b.px) < 46 && (x - b.px) * vx <= 0 && y > b.py - 14 && y < b.py + 14)
      || (b.ball && Math.abs(b.ball[0] - b.px) < 48 && b.ball[1] > b.py - 22)
      || (((b.st === 'dash' && Math.sign(b.dir) === Math.sign(-dx)) || (b.st === 'shell' && b.sv * dx < 0) || (b.st === 'punch' && b.t > 14)) && adx < 70);
    if (danger && b.on) { k.b = 1; if (b.id !== 'robux') k[toward] = 1; return k; }
    if (!b.on) { if (adx < 50 && b.y > b.py - 20) k[away] = 1; return k; }
    if (b.y < b.py - 28) { // overhead: hookshot goes up and forward at 45 degrees
      const want = Math.min(80, b.py - b.y);
      if (adx < want - 12 && Math.abs(b.px - b.x0 - 160) < 120) k[away] = 1; else if (adx < want - 12) { k[b.px < b.x0 + 160 ? 'right' : 'left'] = 1; } else if (adx > want + 12) k[toward] = 1; else if (!facing) k[toward] = 1; else if (!b.bong && tap(6)) { k.up = 1; k.a = 1; }
      return k; }
    if (adx < 64) k[away] = 1; else if (adx > 120) k[toward] = 1; else if (!facing) k[toward] = 1;
    if (!b.bong && facing && tap(6)) k.a = 1;
    if (adx < 50 && !b.hot && b.id !== 'mecha') k.c = 1;
    const cx = b.x0 + 160; if (k[away] && Math.abs(b.px - cx) > 120 && (b.px < cx) === (away === 'left')) { delete k[away]; k[b.px < cx ? 'right' : 'left'] = 1; k.b = F % 20 < 10 ? 1 : 0; } // cornered: jump past it
    return k;
  }
  if (b.id === 'dys') {
    if (b.hang) return { down: 1 };
    if (b.daze > 0) { if (adx > 60) k[toward] = 1; else if (adx < 24) k[away] = 1; else if ((dx > 0) !== (b.face > 0)) k[toward] = 1; if (!b.bong && tap(6) && (dx > 0) === (b.face > 0)) k.a = 1; return k; }
    if (b.shield && b.y > 120) { if (adx > 58) k[toward] = 1; else if (adx < 40) k[away] = 1; else if ((dx > 0) !== (b.face > 0)) k[toward] = 1; if (!b.hot) k.c = 1; return k; }
    // he's up high: stay out from under him, burn letters coming down at us
    const want = b.x0 + (b.x - b.x0 > 160 ? 70 : 250);
    if (Math.abs(want - b.px) > 12) k[want > b.px ? 'right' : 'left'] = 1;
    if (b.letters.some(([x, y]) => Math.abs(x - b.px) < 30 && y > b.py - 70 && y < b.py) && !b.hot) k.c = 1;
    return k;
  }
  return k;
}
(async () => {
  let blank = 0;
  for (let f = 0; f < +MAXF; f++) {
    const sc = R(`scene === worldScene ? (PL.dead ? 'dead' : CUT ? 'cut' : 'play') : 'menu'`);
    let k = {};
    if (sc === 'menu') { k = (f % 24) < 2 ? { a: 1 } : {}; plan = null; }
    else if (sc === 'dead' || sc === 'cut') { plan = null; }
    else {
      const lv = R('LV.def.id');
      if (lv !== lastLv) { if (lastLv) stats[lastLv].frames = lvFrames; lastLv = lv; lvFrames = 0; stats[lv] = { deaths: 0 }; lastX = 0; stall = 0; R(`DBG.log.push('LEVEL ' + LV.def.id + ' lives=' + RUN.lives)`); if (process.env.SHOTS) shot(lv + '_start'); }
      lvFrames++;
      const x = R('PL.x | 0'); if (R('!!ARENA')) { stall = 0; if (++arenaT > 15000) { R(`DBG.log.push('STALLED in boss fight ' + (BOSS ? BOSS.name + ' hp=' + BOSS.hp : '?'))`); shot(lv + '_bossstall'); break; } } else arenaT = 0; if (x > lastX + 16) { lastX = x; stall = 0; } else if (++stall > 9000) { R(`DBG.log.push('STALLED ' + LV.def.id + ' x=' + (PL.x / 16 | 0) + ' y=' + (PL.y / 16 | 0))`); console.log('stall shot', shot(lv + '_stall')); break; }
      if (R('!!(BOSS && !BOSS.dying)')) {
        if (R('(RUN.nerf[LV.def.id] || 0) >= 2 && !DBG.assist')) R(`DBG.assist = 1; DBG.log.push('BOT ASSIST: invulnerable for ' + BOSS.name); const _o2 = ouch; ouch = (n, w, s) => { if (!BOSS) _o2(n, w, s); };`);
        k = bossKeys(); plan = null; }
      else if (R('!!DBG.assist && !ARENA')) { R('DBG.assist = 0'); }
      else if (R('!!(ARENA && LV.lock)')) { k = {}; plan = null; } // waiting for the boss to arrive
      else if (R('LV.def.water !== undefined && swimming() && !(ARENA && !LV.lock)')) {
        plan = null;
        const gx = R('LV.def.boss && !ARENA ? LV.def.boss.at * 16 + 60 : ENTS.find(e => e.kind === "goal").x');
        const w = JSON.parse(R(`JSON.stringify(swimNext(${gx}))`) || 'null');
        if (w) { const p = JSON.parse(R('JSON.stringify([PL.x + 5, PL.y + 8])'));
          if (Math.abs(w.x - p[0]) > 3) k[w.x > p[0] ? 'right' : 'left'] = 1;
          if (w.y < p[1] - 4 && (F % 12) === 0) k.b = 1; else if (w.y > p[1] + 6) k.down = 1;
          if (w.vent && Math.abs(w.x - p[0]) < 8) k = { down: 1 };
          k = overlay(k, []); }
      }
      else {
        if (!plan) { const lk = liveKey(); if (lk) { plan = makePlan(); seg = 0; fi = 0; if (!plan) { console.log('no route shot', shot(lv + '_noroute')); break; } } }
        if (plan) {
          const S = plan.segs[seg];
          k = S.frames[fi++] || {};
          k = overlay(k, S.frames.slice(fi, fi + 20));
          if (fi >= S.frames.length) {
            const lk = liveKey();
            if (S.end !== 'GOAL' && lk !== S.end) { plan = null; }
            else { seg++; fi = 0; if (seg >= plan.segs.length) plan = null; }
          }
        }
      }
    }
    setKeys(k); F++;
    T += 16.7; R(`loop(${T})`); for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    if (process.env.SHOTS && f % 900 === 0 && sc !== 'menu') shot(R('LV ? LV.def.id : "x"'));
    if (process.env.BOSSSHOTS && f % 30 === 0 && R('!!BOSS') && shotN < 40) shot('boss');
    if (R('typeof DBG.done') !== 'undefined') break;
    if (R(`XMETA.clears`) > 0) { console.log('GAME CLEARED at frame', f); break; }
    if (f % 1000 === 0) console.log('frame', f, Math.round(process.uptime()) + 's', R(`scene === worldScene ? LV.def.id + ' x=' + (PL.x / 16 | 0) + ' lives=' + RUN.lives : 'menu'`), 'replans', replans);
  }
  if (lastLv) stats[lastLv].frames = lvFrames;
  console.log(R(`DBG.log.join('\\n')`));
  console.log('words', R('RUN.words'), 'bux', R('RUN.bux'), 'deaths', R('RUN.deaths'), 'replans', replans, 'errors', errs.length ? errs.slice(0, 5) : 'none');
  console.log(JSON.stringify(stats));
})().catch(e => console.log('ERR', e));
