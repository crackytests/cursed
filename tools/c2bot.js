// CARL 2 bot: runs inside the game context. BOT.tick() once per frame before loop().
// It plays like a person would: follows the objective marker, talks to whoever it points at, fights, answers menus.
var BOT = (() => {
  let F = 0, want = {}, last = {}, W8 = {}, lastSay = '', path = null, pathKey = '', stuck = 0, lastPos = [0, 0], lastObj = '', objSince = 0, jig = 0;
  const L = s => console.log('[' + F + '] ' + s);
  const press = k => { if (!last[k]) want[k] = 1; }, hold = k => { want[k] = 1; };
  const REGION = { lot: 'lot', mall: 'lot', emporium: 'lot', lostfound: 'lot', sequel: 'lot', desert: 'desert', diner: 'desert', facility: 'desert', below: 'desert', lake: 'lake', backlot: 'backlot', setface: 'backlot', setpk: 'backlot', setyoko: 'backlot', moon: 'moon', studio: 'studio', ship: 'ship' };
  const NAVNAME = { lot: 'THE LOT', desert: 'GARF\'S DINER', lake: 'LAKE MEAD', backlot: 'PRETEND CO. BACKLOT', moon: 'THE RED MOON' };
  const human = () => W8.end === 'renewed';
  // ---------- watchdogs: things a player would see and the bot wouldn't ----------
  let blackF = 0, flashF = 0, shakeF = 0, holdF = 0;
  function watch() {
    if (post.fade > .95 && (DLG || MENUS.length)) { if (++blackF === 30) L('WARN FADE-BLACK while ' + (DLG ? 'DLG ' + DLG.lines[0] : 'MENU ' + MENUS[0].opts[0])); } else blackF = 0;
    if (post.flash > .3) { if (++flashF === 200) L('WARN FLASH STUCK ' + post.flash); } else flashF = 0;
    if (post.shake > 0) { if (++shakeF === 180) L('WARN SHAKE STUCK ' + post.shake); } else shakeF = 0;
    if (scene === worldScene && WD.hold > 0 && !DLG && !MENUS.length && !CARD && !CHATBOX) { if (++holdF === 900) L('WARN HOLD STUCK hold=' + WD.hold + ' map=' + WD.id); } else holdF = 0;
    if (post.legacy > 0 && scene === worldScene && !F2('dreamgreen')) L('WARN LEGACY IN WORLD');
  }
  // ---------- menus ----------
  function menuPick(m) {
    const o = m.opts, J = o.join('|'), idx = s => { const i = o.findIndex(x => x.startsWith(s)); return i < 0 ? 0 : i; };
    if (J.includes('NEW GAME')) return idx(W8.start === 'cont' && J.includes('CONTINUE') ? 'CONTINUE' : 'NEW GAME');
    if (J.startsWith('NO|YES')) return DLG && /START OVER/.test(DLG.lines.join(' ')) ? 1 : 0;
    if (J.includes('TAKE IT|NO THANKS')) return human() ? 0 : 1;
    if (J.includes('ACCEPT THE NOTE')) return human() ? 0 : 1;
    if (J.includes('THE WAITRESS')) return 0;
    if (J.includes('LET\'S DO THIS')) return 0;
    if (J.includes('BRUCE|')) return W8.comp === 'garf' ? 1 : 0;
    if (J.includes('I\'D LIKE YOU TO BE')) return human() ? 1 : 0;
    if (J.includes('WHAT WERE THEY LIKE')) return 0;
    if (J.includes('SIGN (AS HU-MAN)')) { const e = W8.end || 'boogaloo'; if (e === 'renewed') return 0; if (e === 'canceled') return idx('CANCEL'); if (e === 'dream') return idx('SMOKE'); return idx('KEEP GOING'); }
    if (J.includes('SMILE|NO') || J.includes('BUY ONE') ) return o.length - 1;
    if (J.includes('SELL MY BONGS')) return o.length - 1;
    if (J.includes('RIDE|NO')) return BOT.wantRide ? 0 : 1;
    if (J.includes('STAY')) { const t = BOT.navTo; const i = o.findIndex(x => x === t); return i >= 0 ? i : o.length - 1; }
    if (J.includes('NOTHING')) { const i = W8.tapes && !C2.tapes.includes(3) ? o.findIndex(x => x.includes('A BUS TICKET')) : -1; return i >= 0 ? i : o.length - 1; }
    if (J.includes('ARGUE|') && J.includes('DEFLECT')) return argueMain(o);
    if (J.includes('LOGIC|GRIEVANCE')) return argueType(o);
    if (J.includes('QUIT TO TITLE')) return o.length - 1;
    if (J.includes('EQUIP|')) return 0;
    return 0;
  }
  function argueMain(o) {
    const A = AB; if (!A) return 0;
    const i = s => o.findIndex(x => x.startsWith(s));
    if (A.hp < A.max * .35) { if (C2.pretzels > 0) return i('PRETZEL'); if (A.smoked < 2) return i('SMOKE'); return i('DEFLECT'); }
    if (A.foe.chatBoost && A.foe.hp <= A.foe.max / 2 && !BOT.chatUsed) { BOT.chatUsed = 1; return i('ASK CHAT'); }
    if (human() && i('HU-MAN QUIP') >= 0 && !A.foe.immuneQuip) return i('HU-MAN QUIP');
    if (i('GARFIELD: EVIDENCE') >= 0 && !A.weakShown) return i('GARFIELD: EVIDENCE');
    if (i('BRUCE: CHOMP') >= 0 && A.turns % 3 === 2) return i('BRUCE: CHOMP');
    return i('ARGUE');
  }
  function argueType(o) {
    const A = AB, w = A.foe.weak, types = ['LOGIC', 'GRIEVANCE', 'DENIAL', 'RANT'];
    const score = t => (w[t] !== undefined ? w[t] : 1) * (t === 'RANT' ? 8 : ARG2_BASE[t]) * (t === A.last ? .4 : 1) - (t === 'RANT' && A.hp < 10 ? 20 : 0);
    let best = 0; types.forEach((t, k) => { if (score(t) > score(types[best])) best = k; }); return best;
  }
  // ---------- set pieces ----------
  function drive() {
    const m = DBG.mode;
    if (m === 'road' && RD.mode === 'bus') {
      let target = 0; for (let d = 1; d < 10; d++) { const q = segAt(RD.pos + RD.playerZ + d * RD.segL); for (const s2 of q.spr) if (!s2.dead && s2.hit && Math.abs(s2.off - target) < .45) target = s2.off > 0 ? -.55 : .55; }
      for (const c of RD.cars) { const dz = c.z - (RD.pos + RD.playerZ); if (dz > -100 && dz < RD.segL * 10 && Math.abs(c.off - target) < .5) target = c.off > 0 ? -.6 : .6; }
      const cv = segAt(RD.pos + RD.playerZ + RD.segL * 3).curve; hold('a'); if (Math.abs(cv) > 4 && RD.spd > RD.max * .8) { delete want.a; }
      if (RD.px > target + .06) hold('left'); if (RD.px < target - .06) hold('right'); return true;
    }
    if (m === 'road' && RD.mode === 'ski') {
      let target = 0; for (let d = 0; d < 14; d++) { const q = segAt(RD.pos + RD.playerZ + d * RD.segL); if (q.gate && !q.gateDone) { target = q.gate.c; break; } if (q.ramp) { target = 0; break; } }
      if (!RD.air) hold('a'); if (RD.px > target + .05) hold('left'); if (RD.px < target - .05) hold('right');
      if (RD.air && RD.trick && RD.trick.i < RD.trick.seq.length && F % 7 === 0) { want = {}; press(RD.trick.seq[RD.trick.i]); }
      return true;
    }
    if (m === 'space') {
      let tx = W / 2, ty = 150, best = null;
      for (const o of SP.obj) { if (o.dead || o.wz > 0 || o.k === 'rock') continue; const [sx, sy] = spProj(o.x, o.y, o.z); if (!best || o.z < best.z) best = { sx, sy, z: o.z }; }
      if (best) { tx = best.sx; ty = Math.max(70, Math.min(185, best.sy + 20)); }
      for (const e of SP.eshots) { const [sx, sy] = spProj(e.x, e.y, e.z); if (e.z < 3.2 && Math.abs(sx - SP.px) < 30 && Math.abs(sy - SP.py + 12) < 30) { tx = SP.px + (sx < SP.px ? 70 : -70); ty = SP.py + (sy < SP.py - 12 ? 40 : -40); } }
      for (const o of SP.obj) { if (!o.dead && o.k === 'rock' && o.z < 4) { const [sx] = spProj(o.x, o.y, o.z); if (Math.abs(sx - SP.px) < 50) ty = 64; } if (!o.dead && o.k !== 'rock' && o.k !== 'boss' && o.z < 1.8) { const [sx, sy] = spProj(o.x, o.y, o.z); if (Math.abs(sx - SP.px) < 40 && Math.abs(sy - SP.py) < 40) tx = SP.px + (sx < SP.px ? 60 : -60); } }
      hold('a'); if (SP.px > tx + 4) hold('left'); if (SP.px < tx - 4) hold('right'); if (SP.py > ty + 4) hold('up'); if (SP.py < ty - 4) hold('down'); return true;
    }
    if (m === 'dance') { if (DANCE.want) press(DANCE.want); return true; }
    return false;
  }
  // ---------- goals ----------
  function sideGoal() { // tapes and deliveries a completionist would chase, only when nothing is on fire
    if (!W8.tapes || WD.lock || WD.arena || WD.ents.some(e => e.boss && !e.dead)) return null;
    const T = C2.tapes, g = [];
    if (!T.includes(0) && C2.ep >= 1) g.push({ map: 'lot', x: 34, y: 19, haze: 1 });
    if (!T.includes(1) && C2.ep >= 1 && F2('dispatch1')) g.push({ map: 'mall', x: 18, y: 15, haze: 1 });
    if (!T.includes(2) && F2('liteFound')) g.push({ map: 'diner', x: 17, y: 3, sign: 1 });
    if (!T.includes(4) && F2('jumped')) g.push({ map: 'lake', x: 17, y: 18 });
    if (!T.includes(5) && C2.ep >= 4 && F2('backlotIntro')) g.push({ map: 'backlot', x: 34, y: 24 });
    if (!T.includes(6) && F2('moonIntro') && !F2('comradeDone')) g.push({ map: 'moon', x: 30, y: 14, haze: 1 });
    if (!T.includes(7) && F2('facIntro')) g.push({ map: 'facility', x: 8, y: 22, haze: 1 });
    if (!T.includes(3) && dq(3) === 1) g.push({ map: 'desert', x: 27, y: 21 });
    if (!T.includes(3) && dq(3) === 0 && F2('ep4start') && !F2('ep4done') && F2('ship')) g.push({ map: 'ship', x: 8, y: 4 });
    return g.find(q => REGION[q.map] === REGION[WD.id]) || (F2('ship') && C2.ep !== 5 ? g[0] : null) || null;
  }
  function goal() { const s = sideGoal(); if (s) return Object.assign({ side: 1 }, s); if (!OBJ) return null; return { map: OBJ.map || WD.id, x: OBJ.x, y: OBJ.y }; }
  function stepTarget(gl) { // where to walk on THIS map, and what to do there
    if (!gl) return null;
    if (gl.map === WD.id) return gl.x !== undefined ? { x: gl.x, y: gl.y, act: gl.haze ? 'haze' : 'talk' } : null;
    const r = routeTo(WD.id, gl.map); if (r) return { x: r.x + ((r.w || 1) >> 1), y: r.y + ((r.h || 1) >> 1), act: 'exit' };
    if (WD.id === 'ship') { BOT.navTo = NAVNAME[REGION[gl.map]] || NAVNAME[gl.map]; return { x: 2, y: 4, act: 'talk', nav: 1 }; }
    const ass = WD.ents.find(e => e.id === 'ass'); if (ass && F2('ship')) return { x: Math.floor(ass.x / 16), y: Math.floor(ass.y / 16) + 1, act: 'talk', ent: ass };
    const home = { desert: 'desert', lake: 'lake', backlot: 'backlot', moon: 'moon', lot: 'lot' }[REGION[WD.id]]; const r2 = home && routeTo(WD.id, home); if (r2) return { x: r2.x, y: r2.y, act: 'exit' };
    if (REGION[WD.id] === 'lot' && REGION[gl.map] === 'desert') { BOT.wantRide = 1; const r3 = routeTo(WD.id, 'lot'); if (r3) return { x: r3.x, y: r3.y, act: 'exit' }; return { x: 37, y: 10, act: 'talk' }; }
    if (REGION[WD.id] === 'desert' && REGION[gl.map] === 'lot') { BOT.wantRide = 1; const r3 = routeTo(WD.id, 'desert'); if (r3) return { x: r3.x, y: r3.y, act: 'exit' }; return { x: 23, y: 27, act: 'talk' }; }
    return null;
  }
  // ---------- tile BFS ----------
  const walk = (tx, ty) => !SOLID.has(tileAt(tx, ty)) && !WD.ents.some(e => (typeof e.solid === 'function' ? (BOT.hazeWalk ? false : e.solid()) : e.solid) && live(e) && Math.abs(e.x - (tx * 16 + 8)) < e.hw + 4 && Math.abs(e.y - (ty * 16 + 10)) < e.hh + 4);
  function bfs(sx, sy, tx, ty) {
    const Wd = WD.w, Hd = WD.h, prev = new Int32Array(Wd * Hd).fill(-1), q = [sy * Wd + sx]; prev[sy * Wd + sx] = sy * Wd + sx; let found = -1, bestD = 1e9, best = -1;
    while (q.length) { const c = q.shift(), cx = c % Wd, cy = (c / Wd) | 0; const d = Math.abs(cx - tx) + Math.abs(cy - ty); if (d < bestD) { bestD = d; best = c; } if (d === 0) { found = c; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (nx < 0 || ny < 0 || nx >= Wd || ny >= Hd) continue; const n = ny * Wd + nx; if (prev[n] >= 0) continue; if (!walk(nx, ny) && !(nx === tx && ny === ty)) continue; prev[n] = c; q.push(n); } }
    let c = found >= 0 ? found : best; const out = []; while (c >= 0 && prev[c] !== c) { out.push([c % Wd, (c / Wd) | 0]); c = prev[c]; } return out.reverse();
  }
  function moveTo(px, py, tol = 3) { const dx = px - PL.x, dy = py - PL.y; if (dx > tol) hold('right'); if (dx < -tol) hold('left'); if (dy > tol) hold('down'); if (dy < -tol) hold('up'); return Math.abs(dx) <= tol && Math.abs(dy) <= tol; }
  // ---------- combat ----------
  function fight() {
    const foes = WD.ents.filter(e => (e.kind === 'enemy' || e.boss) && !e.dead && !e.gone && !e.harmless && !(e.haze && WD.haze <= 0) && !(e.botSkip && !WD.lock));
    let tg = null, bd = 1e9; for (const e of foes) { const d = Math.hypot(e.x - PL.x, e.y - PL.y); if (d < bd) { bd = d; tg = e; } }
    if (!tg || bd > (WD.lock ? 999 : 150)) return false;
    // an enemy we can't hurt for 15 seconds (behind a counter, over water) isn't worth the afternoon
    if (tg.botHp !== tg.hp) { tg.botHp = tg.hp; tg.botT = 0; } else if (++tg.botT === 900) { L('WARN gave up on ' + (tg.k || tg.id) + ' at ' + (tg.x / 16 | 0) + ',' + (tg.y / 16 | 0) + (WD.lock ? ' (IN AN ARENA)' : '')); tg.botSkip = 1; }
    // dodge: roll away from a shot about to land
    for (const s of WD.eshots) { const dx = s.x - PL.x, dy = s.y - (PL.y - 8); if (Math.hypot(dx, dy) < 26 && (s.vx * -dx + s.vy * -dy) > 0 && PL.roll <= 0 && F % 3 === 0) { const ax = Math.abs(s.vy) > Math.abs(s.vx); if (ax) hold(dx > 0 ? 'left' : 'right'); else hold(dy > 0 ? 'up' : 'down'); press('b'); return true; } }
    if (PL.humanT > 0) { moveTo(tg.x, tg.y + 4, 6); if (F % 4 === 0) { const a = Math.atan2(tg.y - PL.y, tg.x - PL.x); setAim(a); } hold('a'); return true; }
    if (human() && C2.meter >= 100 && F2('power') && !WD.M.noHuman) { hold('c'); BOT.holdingC = 1; return true; }
    const a = Math.atan2(tg.y - 6 - (PL.y - 4), tg.x - PL.x), dir8 = Math.round(a / (Math.PI / 4)), fa = Math.round(Math.atan2(PL.fy, PL.fx) / (Math.PI / 4));
    const ideal = tg.boss ? 90 : 64;
    if (((dir8 - fa) % 8 + 8) % 8 !== 0) { setAim(dir8 * Math.PI / 4); return true; } // turn to face (without A, so facing updates)
    hold('a');
    const clear = losClear(PL.x, PL.y - 4, tg.x, tg.y - 6);
    const want2 = !clear || bd > ideal + 18 ? 1 : bd < ideal - 18 ? -1 : 0, ux = Math.cos(a), uy = Math.sin(a);
    if (want2 === 1) { // close in along a real path (booths, counters and shelves are in the way)
      const ptx = Math.floor(PL.x / 16), pty = Math.floor((PL.y - 4) / 16), etx = Math.floor(tg.x / 16), ety = Math.floor((tg.y - 4) / 16);
      if (!BOT.fp || BOT.fpT !== tg || F % 30 === 0) { BOT.fp = bfs(ptx, pty, etx, ety); BOT.fpT = tg; }
      while (BOT.fp.length && BOT.fp[0][0] === ptx && BOT.fp[0][1] === pty) BOT.fp.shift();
      if (BOT.fp.length > 1) { const nx = BOT.fp[0]; moveTo(nx[0] * 16 + 8, nx[1] * 16 + 12, 2); return true; }
    }
    let mx = ux * want2, my = uy * want2; if (!want2) { mx = -uy * (Math.sin(F * .02) > 0 ? 1 : -1) * .6; my = ux * (Math.sin(F * .02) > 0 ? 1 : -1) * .6; }
    // throws only go 8 ways: when the target sits between two of them, slide sideways onto a clean line
    const err = Math.abs(((a - dir8 * Math.PI / 4) + Math.PI * 3) % (Math.PI * 2) - Math.PI), odx = tg.x - PL.x, ody = (tg.y - 6) - (PL.y - 4);
    if (err > .22 && bd < ideal + 40) { if (Math.abs(odx) < Math.abs(ody)) { mx = Math.sign(odx); my = 0; } else { my = Math.sign(ody); mx = 0; } }
    if (mx > .3) hold('right'); if (mx < -.3) hold('left'); if (my > .3) hold('down'); if (my < -.3) hold('up');
    return true;
  }
  function losClear(x0, y0, x1, y1) { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 4); for (let i = 1; i < n; i++) { const t = i / n; if (solidPx(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + 4)) return false; } return true; }
  function setAim(a) { const d = Math.round(a / (Math.PI / 4)), dx = Math.round(Math.cos(d * Math.PI / 4)), dy = Math.round(Math.sin(d * Math.PI / 4)); delete want.a; if (dx > 0) hold('right'); if (dx < 0) hold('left'); if (dy > 0) hold('down'); if (dy < 0) hold('up'); }
  function loot() { let best = null, bd = 90; for (const p of WD.pick) { const d = Math.hypot(p.x - PL.x, p.y - PL.y); if (d < bd && !(p.botT > 600) && (p.k !== 'pretzel' || C2.hp < C2.maxhp)) { bd = d; best = p; } } if (best) { best.botT = (best.botT || 0) + 1; if (best.botT === 600) L('WARN could not reach a ' + best.k + ' at ' + (best.x / 16 | 0) + ',' + (best.y / 16 | 0)); moveTo(best.x, best.y + 4, 2); return true; } return false; }
  // ---------- equip: a quick look at the menu when a better bong shows up ----------
  function betterBong() { const sc = b => b.dmg * 60 / b.rate * (b.mods.includes('SPLIT') ? 2 : 1) * (b.mods.includes('EXTREME') && !human() ? 0 : 1); let bi = C2.eq; C2.bongs.forEach((b, i) => { if (sc(b) > sc(C2.bongs[bi]) * 1.15) bi = i; }); return bi !== C2.eq ? bi : -1; }
  function tick() {
    F++; want = {}; watch();
    if (!anyKey) anyKey = true;
    if (BOT.equipPlan !== undefined && !MENUS.length && !DLG && scene === worldScene && WD.hold === 0 && BOT.equipPlan >= 0 && F % 20 === 0) { press('start'); BOT.menuStep = 'open'; }
    if (MENUS.length) {
      const m = MENUS[MENUS.length - 1]; let t;
      const isPause = m.opts[0] === 'BONGS', isList = m.opts.every(x => x.startsWith('*') || x.startsWith(' ')), isAct = m.opts[0] === 'EQUIP';
      let nx = null; // the step advances only on the frame A is actually pressed
      if (BOT.menuStep === 'open' && isPause) { t = 0; nx = 'list'; }
      else if (BOT.menuStep === 'list' && isList) { t = Math.min(BOT.equipPlan, m.opts.length - 1); nx = 'act'; }
      else if (BOT.menuStep === 'act' && isAct) { t = 0; nx = 'close'; }
      else if (BOT.menuStep === 'close' && isList) { if (F % 6 === 0) press('c'); apply(); return; }
      else if (BOT.menuStep === 'close' && isPause) t = m.opts.length - 1;
      else t = menuPick(m);
      if (m._logged !== m) { m._logged = m; L('MENU [' + m.opts.join(' / ').slice(0, 120) + '] -> ' + m.opts[t]); }
      if (F % 3 === 0) { if (m.i !== t) press(m.i < t ? 'down' : 'up'); else { press('a'); if (nx) { BOT.menuStep = nx; if (nx === 'close') BOT.equipPlan = undefined; } } }
      apply(); return;
    }
    if (BOT.menuStep === 'close' && !MENUS.length) BOT.menuStep = null;
    if (DLG) { const s = DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L((DLG.who ? DLG.who + ': ' : '') + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (CHATBOX) { if (F % 4 === 0) press('a'); apply(); return; }
    if (DBG.credits) { hold('start'); apply(); return; }
    if (DBG.mode && DBG.mode !== 'world' && drive()) { apply(); return; }
    if (scene === worldScene && WD.hold === 0 && !PL.dead) world(); else if (F % 8 === 0) press('a');
    apply();
  }
  function world() {
    const o = JSON.stringify(OBJ) + WD.id; if (o !== lastObj) { lastObj = o; objSince = F; if (OBJ) L('OBJ ' + OBJ.text + ' @' + (OBJ.map || '-') + ' ' + OBJ.x + ',' + OBJ.y + ' [on ' + WD.id + ']'); }
    if (F - objSince === 12000) DBG.stalled = (DBG.stalled || 0) + 1;
    if (F - objSince === 12000) L('STALL objective "' + (OBJ && OBJ.text) + '" on ' + WD.id + ' at ' + (PL.x / 16 | 0) + ',' + (PL.y / 16 | 0) + ' hold=' + WD.hold + ' lock=' + WD.lock + ' arena=' + JSON.stringify(WD.arena) + ' dlg=' + !!DLG + ' pick=' + WD.pick.map(p => p.k + '@' + (p.x / 16 | 0) + ',' + (p.y / 16 | 0)).join(' ') + ' ents=' + WD.ents.filter(e => e.kind === 'enemy' || e.boss).map(e => (e.id || e.type || e.name) + '@' + (e.x / 16 | 0) + ',' + (e.y / 16 | 0) + (e.dead ? 'D' : '') + (e.gone ? 'G' : '') + (e.harmless ? 'H' : '') + (e.arenaSpawned ? 'A' : '') + ' hp' + e.hp).join(' '));
    if (BOT.holdingC) { if (PL.humanT > 0 || C2.meter < 100) BOT.holdingC = 0; else { hold('c'); return; } }
    const bb = betterBong(); if (bb >= 0 && !WD.lock && BOT.equipPlan === undefined && (BOT.eqTries || 0) < 8) { BOT.equipPlan = bb; BOT.eqTries = (BOT.eqTries || 0) + 1; if (BOT.eqTries === 8) L('WARN equip menu never took'); return; }
    if (bb < 0) BOT.eqTries = 0;
    if (fight()) return;
    if (loot()) return;
    const gl = goal(), st = stepTarget(gl); if (!st) { if (F % 60 === 0) jig = rnd(4); hold(['up', 'down', 'left', 'right'][jig]); return; }
    // haze targets: smoke first, when close
    const tx = st.x, ty = st.y, ptx = Math.floor(PL.x / 16), pty = Math.floor((PL.y - 4) / 16), dT = Math.abs(ptx - tx) + Math.abs(pty - ty);
    if (st.act === 'haze' && dT <= 4 && WD.haze <= 0 && PL.smokeCD <= 0 && F % 10 === 0) { press('c'); return; }
    if (st.act !== 'exit' && dT <= 1 && WD.M.signs) { // a sign next to the target (a jukebox, a door plaque): face it and read it
      const nb = [[0, -1], [0, 0], [-1, 0], [1, 0], [0, 1]].map(([dx, dy]) => [tx + dx, ty + dy]).find(([x, y]) => WD.M.signs[x + ',' + y]);
      const entNear = WD.ents.some(q => q.talk && live(q) && Math.hypot(q.x - tx * 16 - 8, q.y - ty * 16 - 14) < 20);
      if (nb && !entNear) {
        if (ptx !== tx || pty !== ty) { moveTo(tx * 16 + 8, ty * 16 + 12, 2); return; }
        const it = interactTarget(); if (it && it.sign) { if (F % 8 === 0) press('b'); return; }
        hold(nb[1] < pty ? 'up' : nb[1] > pty ? 'down' : nb[0] < ptx ? 'left' : 'right'); return;
      }
    }
    if (st.act !== 'exit' && dT <= 1) { // face it and press B
      const e = st.ent || WD.ents.filter(q => q.talk && live(q) && (!q.haze || WD.haze > 0)).sort((a, b) => Math.hypot(a.x - tx * 16 - 8, a.y - ty * 16 - 14) - Math.hypot(b.x - tx * 16 - 8, b.y - ty * 16 - 14))[0];
      const it = interactTarget();
      if (it && (it === e || it.sign || !e)) { if (F % 8 === 0) press('b'); return; }
      if (e) { const a = Math.atan2(e.y - PL.y, e.x - PL.x); const d = Math.round(a / (Math.PI / 2)) & 3; const k = ['right', 'down', 'left', 'up'][d]; if (F % 2) hold(k); else press('b'); return; }
      const k = ty < pty ? 'up' : ty > pty ? 'down' : tx < ptx ? 'left' : 'right'; hold(k); if (F % 8 === 0) press('b'); return;
    }
    const key = WD.id + ':' + tx + ',' + ty;
    if (!path || pathKey !== key || F % 45 === 0) {
      path = bfs(ptx, pty, tx, ty); pathKey = key;
      const end = path.length ? path[path.length - 1] : [ptx, pty];
      if (Math.abs(end[0] - tx) + Math.abs(end[1] - ty) > 1 && WD.ents.some(e => typeof e.solid === 'function')) { // blocked: is it a pile the haze would open?
        BOT.hazeWalk = 1; path = bfs(ptx, pty, tx, ty); BOT.hazeWalk = 0;
      }
    }
    // haze piles: smoke when the next step runs into one
    const pile = WD.ents.find(e => typeof e.solid === 'function' && e.solid() && Math.hypot(e.x - PL.x, e.y - PL.y) < 40);
    if (pile && path.length && WD.haze <= 0) { if (PL.smokeCD <= 0) { if (F % 10 === 0) press('c'); return; } if (F % 60 === 0) L('waiting for the haze to come back'); return; }
    while (path.length && path[0][0] === ptx && path[0][1] === pty) path.shift();
    const nx = path.length ? path[0] : [tx, ty];
    moveTo(nx[0] * 16 + 8, nx[1] * 16 + 12, 2);
    if (Math.hypot(PL.x - lastPos[0], PL.y - lastPos[1]) < .3) { if (++stuck > 50) { stuck = 0; path = null; jig = rnd(4); for (let i = 0; i < 1; i++) hold(['up', 'down', 'left', 'right'][jig]); if (rnd(3) === 0) press('b'); } } else stuck = 0;
    lastPos = [PL.x, PL.y];
  }
  function apply() { for (const k of ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start']) kb[k] = want[k] ? 1 : 0; last = Object.assign({}, want); }
  return { tick, set(w) { W8 = w; }, get F() { return F; }, wantRide: 0, navTo: null };
})();
