'use strict';
// ================= KONBINI WARS: the show (effects, emotes, regulars, visitors, time of day) =================
// Everything here is for watching: the simulation announces events through onFx(st, kind, a, b) and onFxTick(),
// and nothing in this file changes money, stock, or customers (except the ice-cream spill, which is real mess).
let PFX = [], SAYS = [], FXST = null, BANNERFX = null, FXF = -1, FXN = 0;
const FXCAP = 260;
const P = (o) => { if (PFX.length < FXCAP) PFX.push(Object.assign({ vx: 0, vy: 0, g: 0, t: 0, max: 40 }, o)); };
function agentXY(st, a) {
  let [px, py] = tileXY(st, a.fx, a.fy); px += 6;
  if (a.st === 'queue' && st.q[a.reg]) { const i = st.q[a.reg].indexOf(a), d = DIRS[st.fix[a.reg].d]; px += d[0] * i * 9; py += d[1] * i * 7; }
  if (a.s && a.fy < 0) { const [ox, oy, sw] = storeOrigin(st); py = oy + 4 + (a.st === 'break' ? 2 : 0); if (a.st === 'break') px = ox + sw - 40 + (G.staff.indexOf(a.s) % 3) * 9; }
  return [px, py];
}
const fixXY = (st, f) => tileXY(st, f.x, f.y);
const pick2 = a => a[(Math.random() * a.length) | 0];
function say2(st, a, s, col, t = 70) { if (SAYS.length > 10) return; SAYS.push({ st, a, s, col: col || '#202020', t, max: t }); }
function sayAt(x, y, s, col, t = 70) { if (SAYS.length > 10) return; SAYS.push({ x, y, s, col: col || '#202020', t, max: t }); }

// ---------- the lines (new writing; voices follow the bibles) ----------
const LINES = {
  welcome: { carl: ['WELCOME, HUMAN!', 'HELLO! NORMAL STORE!', 'WELCOME IN!'], ghost: ['WELCOME, MORTAL!', 'ENTER, IF YOU DARE', 'WELCOME... TO SPOOKY MART'] },
  thanks: { carl: ['THANK YOU!', 'COME BACK! NORMALLY!', 'THANKS!'], ghost: ['THANK YOU, MORTAL', 'RETURN... SOON', 'BOO-TIFUL. THANKS'] },
  chat: {
    student: ['LOL', 'NEW ISSUE!', 'HMM...', 'SNACK RUN', 'NO WAY'], traveler: ['WHICH GATE?', 'DELAYED AGAIN', 'QUICK QUICK', 'MY FLIGHT...'],
    adventurer: ['+1 HP', 'POTIONS?', 'FOR THE QUEST', 'LOOT!'], routine: ['ON SALE?', 'THE USUAL', 'HMM.', 'OOH'], thief: ['...', '*WHISTLES*'],
  },
  angry: ['UGH!', 'SO SLOW!', 'FORGET IT', 'HMPH!'], empty: ['SOLD OUT?!', 'AWW...', 'NONE LEFT'], missing: ['NOT HERE?', 'NO ', 'HUH.'],
  price: ['HOW MUCH?!', 'PRICEY...', 'NOPE'],
  linda: ['ADEQUATE.', 'THE LIGHTING FLATTERS MY BRAND.', 'WHY IS THIS SHELF NOT ABOUT ME?', 'CARRY ON. PROFITABLY.', 'I OWN THE FLOOR YOU STAND ON.'],
  carl: ['NORMAL STORE. NORMAL DAY.', 'HI! I AM THE OWNER. A HUMAN OWNER.', 'LOOKING GOOD, LITTLE STORE.'],
  ghost: ['BEHOLD MY EMPIRE.', 'THE SPIRITS APPROVE.', 'ANOTHER SOLD-OUT SHOW. OF CHIPS.'],
};
const lineFor = (k, st) => { const L = LINES[k]; return pick2(Array.isArray(L) ? L : L[chainOf(st).mgr] || L.carl); };

// ---------- regulars: named customers who keep coming back ----------
const REGULARS = [
  ['GERALD', 'traveler', 5], ['MIMI', 'student', 9], ['BARON', 'adventurer', 12], ['DOT', 'routine', 3], ['SKIP', 'traveler', 22], ['NOODLE', 'routine', 40, 'cat'],
  ['UNIT 9', 'routine', 17, 'android'], ['BOO', 'adventurer', 8, 'spirit'], ['KEIKO', 'routine', 31], ['RUFUS', 'adventurer', 44], ['TAMA', 'student', 50, 'cat'], ['PIP', 'student', 27],
];
function makeRegular(st, a) {
  if (Math.random() > .07 * (1 + (st.regBoost || 0) * .5) || !G) return; G.regs = G.regs || {};
  const here = new Set(st.agents.filter(b => b.regn).map(b => b.regn)), ok = REGULARS.filter(r => r[1] === a.g && !here.has(r[0]) && !liveStores().some(s => s.agents.some(b => b.regn === r[0])));
  if (!ok.length) return; const [n, , v, lk] = pick2(ok);
  a.regn = n; a.seed = v / 64 + .001; a.lk = lk || a.g; G.regs[n] = (G.regs[n] || 0) + 1; a.visit = G.regs[n];
}

// ---------- events from the simulation ----------
function onFx(st, k, a, b) {
  if (k === 'enter') makeRegular(st, a);
  if (st !== curStore()) return;
  if (FXST !== st) { PFX = []; SAYS = []; FXST = st; }
  // at high speed many events land in one frame: keep a few, so the screen doesn't turn to confetti
  if (FXF !== frame) { FXF = frame; FXN = 0; } if (++FXN > 3 && k !== 'want' && k !== 'enter') return;
  const mgr = chainOf(st).mgr;
  switch (k) {
    case 'enter': {
      st.doorT = 24; if (Math.random() < .5) sfx('chime');
      if (frame - (st.welT || 0) > 80) { const s = st.agents.find(x => x.s && x.st === 'reg') || st.agents.find(x => x.s && x.fy >= 0); if (s) { say2(st, s, lineFor('welcome', st), M_COL(st)); st.welT = frame; } }
      if (a.regn) { const [px, py] = tileXY(st, doorX(st), st.fh - 1); if (a.visit % 10 === 0) { sayAt(px + 12, py - 14, a.regn + "'S " + a.visit + 'TH VISIT!', '#d08000', 110); confetti(px + 12, py, 24); } }
      if (G.weather === 'RAIN') a.wet = 90;
      break; }
    case 'want': a.wantT = 80; a.wantP = b; break;
    case 'take': { const [fx, fy] = fixXY(st, b.f), [px, py] = agentXY(st, a); P({ kind: 'item', x: fx + 5 + b.j * 9, y: fy + 4, tx: px + 9, ty: py + 10, max: 18, c: PCOL[b.pid] ? PCOL[b.pid][0] : C('#ffffff') });
      if (b.pid !== a.wantP) a.settle = 50; break; }
    case 'lose': {
      if (b === 'missing' || b === 'empty') { a.wantT = 70; a.wantX = 1; if (Math.random() < .3) say2(st, a, pick2(LINES[b]), '#c02020', 50); }
      if (b === 'empty' && a.fix) { const j = a.fix.p.indexOf(a.wantP); if (j >= 0) { st.soldOut = st.soldOut || {}; st.soldOut[st.fix.indexOf(a.fix) + ':' + j] = 140; } }
      if (b === 'queue') { a.storm = 120; if (Math.random() < .6) say2(st, a, pick2(LINES.angry), '#c02020', 60); }
      if (b === 'price' && Math.random() < .4) say2(st, a, pick2(LINES.price), '#c02020', 50);
      break; }
    case 'pay': { const f = st.fix[b.reg]; if (!f) break; const [x, y] = fixXY(st, f); for (let i = 0; i < Math.min(8, 2 + b.rev / 400 | 0); i++) P({ kind: 'coin', x: x + 12, y: y + 4, vx: (Math.random() - .5) * 1.6, vy: -1.4 - Math.random(), g: .09, max: 34 });
      if (frame - (st.thxT || 0) > 70) { const s = st.agents.find(x => x.s && x.st === 'reg' && x.reg === b.reg); if (s) { say2(st, s, lineFor('thanks', st), M_COL(st), 60); st.thxT = frame; } }
      if (a.regn || Math.random() < .25) a.heart = 1; break; }
    case 'theft': { const [px, py] = agentXY(st, a); sayAt(px + 6, py - 14, 'THIEF!', '#e02020', 80); flashRed(st); for (let i = 0; i < 6; i++) P({ kind: 'dust', x: px + 6, y: py + 14, vx: (Math.random() - .5) * 2, vy: -Math.random(), max: 24 }); break; }
    case 'caught': { const [px, py] = agentXY(st, a), s = st.agents.find(x => x.s); if (s) say2(st, s, 'HEY! STOP!', '#2050c0', 70); sayAt(px + 6, py - 14, 'CAUGHT!', '#2050c0', 70); for (let i = 0; i < 5; i++) P({ kind: 'item', x: px + 6, y: py + 8, tx: px + 6 + (Math.random() - .5) * 30, ty: py + 18, max: 20, c: C('#e0e0e0') }); break; }
    case 'fill': { const [x, y] = fixXY(st, b.f); for (let i = 0; i < 5; i++) P({ kind: 'spark', x: x + 4 + b.j * 9 + Math.random() * 8, y: y + 2 + Math.random() * 10, vy: -.3, max: 26, c: C('#ffffa0') }); P({ kind: 'text', s: '+' + b.put, x: x + 6 + b.j * 9, y: y - 2, vy: -.4, max: 40, c: C('#40c040') });
      if (st.soldOut) delete st.soldOut[st.fix.indexOf(b.f) + ':' + b.j]; break; }
    case 'clean': { const [x, y] = tileXY(st, b % st.fw, b / st.fw | 0); for (let i = 0; i < 4; i++) P({ kind: 'spark', x: x + 4 + Math.random() * 16, y: y + 2 + Math.random() * 12, max: 30, c: C('#ffffff') }); break; }
    case 'break': if (Math.random() < .5) say2(st, a, pick2(['BREAK TIME', 'MY FEET...', 'COFFEE...']), '#606060', 60); break;
    case 'delivery': visitor(st, 'delivery'); break;
    case 'waste': if (b > 0) { const [ox, oy] = storeOrigin(st); sayAt(ox + 60, oy + 8, 'EXPIRED FOOD: -' + fmt(b) + ' MC', '#c02020', 120); } break;
    case 'backdoor': { post.shake = 2; st.shakeT = 40; st.shipT = 90; sayAt(storeOrigin(st)[0] + storeOrigin(st)[2] / 2, storeOrigin(st)[1] - 4, 'A.S.S. DELIVERY!', '#108a60', 110); sfx('crate'); break; }
    case 'show': BANNERFX = { s: 'GRAND DEMONSTRATION!', t: 150, col: '#a060ff' }; break;
    case 'event': BANNERFX = { s: EVENTS[b].n.replace('ADVENTURER ', ''), t: 170, col: { convention: '#3a8a3a', tournament: '#c03090', convoy: '#2060a0', supplier: '#a06020', magazine: '#d06090', wage: '#606060' }[b] || '#404040' }; break;
    case 'upgrade': { const [ox, oy, sw] = storeOrigin(st); BANNERFX = { s: 'BIGGER STORE!', t: 150, col: '#30a060' }; confetti(ox + sw / 2, oy + 40, 30); break; }
    case 'ad': {
      const [ox, oy, sw] = storeOrigin(st);
      if (b === 'flyers') { BANNERFX = { s: 'FLYERS ARE OUT!', t: 140, col: '#d08020' }; for (let i = 0; i < 40; i++) P({ kind: 'paper', x: ox + Math.random() * sw, y: oy - 10 - Math.random() * 60, vx: (Math.random() - .5) * .6, vy: .5 + Math.random() * .5, max: 200 + rnd(80), c: C(pick2(['#ffffff', '#fff0a0', '#a0e8ff'])) }); }
      if (b === 'bulletin') { BANNERFX = { s: 'IN THE MALL BULLETIN', t: 140, col: '#3060c0' }; sfx('ok'); }
      if (b === 'blimp') { st.blimpT = 420; sfx('ok'); }
      if (b === 'radio') { BANNERFX = { s: 'ON MALL RADIO!', t: 150, col: '#c04090' }; sfx('jingle'); st.noteT = 200; }
      if (b === 'tv') { st.tvT = 260; sfx('jingle'); }
      if (b === 'idol') { BANNERFX = { s: 'MALL IDOL MIRAI!', t: 180, col: '#ff60b0' }; visitor(st, 'idol'); confetti(ox + sw / 2, oy + 40, 40); sfx('jingle'); }
      break; }
  }
}
const M_COL = st => MGRS[chainOf(st).mgr].col === '#38c8a0' ? '#107858' : '#6030b0';
function confetti(x, y, n) { const cs = ['#ff4060', '#40c0ff', '#ffe040', '#60e080', '#c080ff']; for (let i = 0; i < n; i++) P({ kind: 'conf', x, y, vx: (Math.random() - .5) * 3, vy: -1.5 - Math.random() * 2, g: .08, max: 60 + rnd(30), c: C(pick2(cs)) }); }
function flashRed(st) { st.redT = 20; }

// ---------- per sim tick: visitors walk, random happenings ----------
function onFxTick() {
  const st = curStore(); if (!st || st.closed) return;
  st.vis = st.vis || [];
  for (const v of st.vis) visitorTick(st, v); st.vis = st.vis.filter(v => !v.gone);
  if (!isOpen(st.hours, hourNow())) return;
  const t = G.tick % TPD, hr = hourNow();
  // rushes
  if (t === 7 * 300 + 60 && st.day.trips > 0) BANNERFX = { s: 'MORNING RUSH', t: 140, col: '#e08020' };
  if (t === 12 * 300) BANNERFX = { s: 'LUNCH RUSH!', t: 160, col: '#e04040' };
  if (t === 22 * 300 && st.hours !== 2 && st.hours !== 3) BANNERFX = { s: 'NIGHT SHIFT', t: 140, col: '#4060c0' };
  // happenings, a few per day
  if (Math.random() < 1 / 1000) {
    const day = hr > 8 && hr < 21, has = k => st.vis.some(v => v.kind === k), w = {};
    if (day && !has('cat')) w.cat = 3; if (day && !has('linda') && chainOf(st).mgr !== 'linda' && st.lindaDay !== (G.tick / TPD | 0)) w.linda = 1.5; if (!has('boss')) w.boss = 1.5; if (day) w.ice = 2; w.flicker = 1;
    const k = wpick(w); if (k === 'ice') iceCream(st); else if (k === 'flicker') st.flickT = 50; else visitor(st, k);
  }
}
function iceCream(st) {
  const c = st.agents.filter(a => !a.s && a.fy >= 0 && ['student', 'routine'].includes(a.g)); if (!c.length) return; const a = pick2(c);
  st.dirt[a.y * st.fw + a.x] += 60; const [px, py] = agentXY(st, a); say2(st, a, 'MY ICE CREAM!', '#c02020', 80); for (let i = 0; i < 8; i++) P({ kind: 'drop', x: px + 6, y: py + 10, vx: (Math.random() - .5) * 2, vy: -1 - Math.random(), g: .12, max: 26, c: C(pick2(['#ffe0f0', '#ffd0a0', '#a0e0c0'])) });
}
function visitor(st, kind) {
  const v = { kind, s: 1, vis: 1, x: doorX(st), y: st.fh - 1, fx: doorX(st), fy: st.fh, t: 0, stops: kind === 'delivery' ? 1 : 3 + rnd(3), tgt: null };
  if (kind === 'delivery') { v.x = doorX(st); v.tgt = [backX(st), 0]; }
  if (kind === 'linda') { st.lindaDay = G.tick / TPD | 0; news('CEO LINDA IS INSPECTING ' + storeName(st) + '.'); BANNERFX = { s: 'CEO LINDA IS HERE', t: 120, col: '#e040a0' }; for (const a of st.agents) if (!a.s && Math.random() < .5) a.look2 = 60; }
  if (kind === 'boss') v.who = chainOf(st).mgr;
  if (kind === 'idol') v.stops = 4;
  st.vis.push(v);
}
function freeTile(st) { for (let k = 0; k < 30; k++) { const x = rnd(st.fw), y = rnd(st.fh); if (field(st, doorX(st), st.fh - 1)[y * st.fw + x] >= 0) return [x, y]; } return [doorX(st), st.fh - 2]; }
function visitorTick(st, v) {
  if (v.wait > 0) { v.wait--; return; }
  if (v.leaving) { if (walk(st, v, doorX(st), st.fh - 1, CSPD * 1.2)) { v.fy += .5; v.gone = 1; } return; }
  if (!v.tgt) {
    if (v.kind === 'cat') { const m = st.fix.find(f => f.k === 'mag'); v.tgt = m && Math.random() < .6 ? accessOf(m) : freeTile(st); }
    else if (v.kind === 'linda' || v.kind === 'boss') { const f = pick2(st.fix.filter(f => FIX[f.k].cat)); v.tgt = f ? accessOf(f) : freeTile(st); }
    else v.tgt = freeTile(st);
  }
  if (walk(st, v, v.tgt[0], v.tgt[1], v.kind === 'cat' ? CSPD * 1.4 : CSPD)) {
    v.tgt = null; v.stops--;
    if (v.kind === 'delivery') { v.back = 1; v.wait = 120; v.leaving = 1; return; }
    if (v.kind === 'cat') { v.wait = 400 + rnd(500); v.nap = 1; }
    if (v.kind === 'linda') { v.wait = 90; say2(st, v, v.stops <= 0 ? pick2(LINES.linda) : pick2(['HM.', 'HMM.', 'I SEE.']), '#c02080', 80); }
    if (v.kind === 'boss') { v.wait = 80; if (v.stops === 1) say2(st, v, pick2(LINES[v.who]), M_COL(st), 90); }
    if (v.kind === 'idol') { v.wait = 160; say2(st, v, pick2(['THANK YOU, MALL!', 'BUY SNACKS FOR ME!', 'LA LA LAAA!', 'MIRAI LOVES YOU!']), '#e03090', 90); }
    if (v.stops <= 0) v.leaving = 1;
  } else v.nap = 0;
}

// ---------- drawing ----------
// the sky outside the store follows the clock: dawn, day, dusk, night
const SKYP = {};
function skyTier() { const h = hourNow(); return h >= 5 && h < 7 ? 'dawn' : h >= 7 && h < 17 ? 'day' : h >= 17 && h < 19 ? 'dusk' : 'night'; }
function skyPaper(mgr) {
  const t = skyTier(), key = mgr + t; if (SKYP[key]) return SKYP[key];
  const base = wallpaper(mgr); if (t === 'day') return (SKYP[key] = base);
  const [tc, k] = { dawn: ['#ffb070', .22], dusk: ['#ff6030', .3], night: ['#0a1240', .55] }[t], c = C(tc);
  const b = newBuf(W, H); for (let i = 0; i < b.d.length; i++) b.d[i] = mix(base.d[i], c, k);
  return (SKYP[key] = b);
}
function fxOutside(st, ox, oy, sw, sh) {
  const night = skyTier() === 'night';
  if (G.weather === 'RAIN') for (let i = 0; i < 90; i++) { const x = (hash(i, 1, 9) * W + frame * 1.5 + i * 7) % W | 0, y = (hash(i, 2, 9) * H + frame * 6) % H | 0;
    if (x > ox - 4 && x < ox + sw + 4 && y > oy - 4 && y < oy + sh + 4) continue; lineF(x, y, x - 1, y + 4, C(night ? '#5070b0' : '#a0c8f0')); }
  if (G.weather === 'HOT' && !night) for (let i = 0; i < 6; i++) glow(40 + i * 90, 20, 18, C('#402000'), .4);
  // the mall blimp drifts across, towing the chain's name
  if (st.blimpT > 0) { st.blimpT--; const k = 1 - st.blimpT / 420, bx = -90 + k * (W + 180) | 0, by = 22 + Math.sin(k * 6) * 3 | 0, M = MGRS[chainOf(st).mgr], nm = M.short;
    ellF(bx, by, 26, 8, C('#c8c8d0')); ellF(bx - 4, by - 2, 18, 4, C('#e8e8f0')); polyF([[bx - 26, by], [bx - 34, by - 7], [bx - 34, by + 7]], C('#a0a0b0')); rectF(bx - 6, by + 8, 12, 4, C('#606070')); rectF(bx - 14, by - 3, 28, 7, C(M.col)); text(nm.slice(0, 4), bx - 12, by - 3, C('#ffffff'), 0);
    const bw = tw(nm) + 8; lineF(bx - 34, by, bx - 44, by + 2, C('#606060')); rectF(bx - 44 - bw, by - 2, bw, 10, C('#ffffff')); frameR(bx - 44 - bw, by - 2, bw, 10, C(M.col)); text(nm, bx - 40 - bw, by, C(M.col), 0); }
  // the door glows at night, with a neon sign
  if (night) { const dx = ox + WALL + doorX(st) * TW + TW / 2; glow(dx, oy + sh + 4, 34, C('#ffc060'), .55);
    if (!(st.flickT > 0 && (frame & 4)) && hash(frame >> 3, 7, 1) > .03) { glow(dx, oy + sh + 13, 14, C('#ff3080'), .7); text('OPEN', dx - 11, oy + sh + 10, C('#ffd0e8'), 0); }
    for (let i = 0; i < 4; i++) glow(ox + 30 + i * (sw - 60) / 3, oy + BACK_H + 30, 26, C('#fff0c0'), .18); }
}
function fxShelves(st) {
  if ((frame >> 5) & 1) for (const f of st.fix) { const c = FIX[f.k].cat; if (!c) continue; const m = st.margin[c], [x, y] = fixXY(st, f);
    if (m < .3) { rectF(x + 1, y - 2, 22, 8, C('#ffe040')); frameR(x + 1, y - 2, 22, 8, C('#c02020')); text('SALE', x + 1, y - 1, C('#d02020'), 0); }
    else if (m > .55) { rectF(x + 6, y - 2, 13, 8, C('#d02020')); text('$$', x + 6, y - 1, C('#ffffff'), 0); } }
  if (!st.soldOut) return;
  for (const k in st.soldOut) { if (--st.soldOut[k] <= 0) { delete st.soldOut[k]; continue; } const [fi, j] = k.split(':').map(Number), f = st.fix[fi]; if (!f || f.n[j] > 0) { delete st.soldOut[k]; continue; }
    const [x, y] = fixXY(st, f); if ((frame >> 3) & 1) { rectF(x + 2 + j * 9, y + 4, 9, 7, C('#e02020')); text('X', x + 4 + j * 9, y + 4, C('#ffffff'), 0); } }
}
// pose: a little life on top of the walk cycle
function fxPose(st, a, dir, fr) {
  let dy = 0;
  if (!a.s) {
    if (a.st === 'browse' && !(a.g === 'student' && a.cat === 'mag')) dir = ((frame + (a.seed * 400 | 0)) >> 5) % 3 === 0 ? (((frame >> 5) & 1) ? 1 : 3) : dir;
    if (a.st === 'queue') { const k = a.t / (a.pat * 1.6); if (k > .6 && (frame >> 2) & 1) dy = -1; }
    if (a.look2 > 0) { a.look2--; dir = 0; }
  } else if (a.st === 'break' || a.st === 'wait') dy = (frame >> 5) & 1 ? 0 : -1;
  return [dir, fr, dy];
}
function fxAgent(st, a, px, py, dir) {
  // students read at the magazine rack
  if (!a.s && a.st === 'browse' && a.g === 'student' && a.cat === 'mag') { rectF(px + 2, py + 8, 8, 4, C('#f8f8f0')); rectF(px + 5, py + 8, 1, 4, C('#a0a0a0')); if (((frame + (a.seed * 99 | 0)) & 63) < 6) rectF(px + 6, py + 7, 3, 2, C('#ffffff')); }
  // the product they came in for, in a thought bubble
  if (a.wantT > 0 && a.wantP && !a.bt) { a.wantT--; const x = px + 6, y = py - 11, c = PCOL[a.wantP] ? PCOL[a.wantP][0] : C('#ffffff');
    rectF(x - 5, y, 11, 9, C('#ffffff')); frameR(x - 5, y, 11, 9, INKC); pset(x - 1, y + 9, INKC); pset(x - 2, y + 10, INKC); rectF(x - 2, y + 2, 5, 5, c); frameR(x - 2, y + 2, 5, 5, mix(c, INKC, .5));
    if (a.wantX) { lineF(x - 3, y + 1, x + 3, y + 7, C('#e02020')); lineF(x + 3, y + 1, x - 3, y + 7, C('#e02020')); } }
  // impatience in line: sweat, then steam
  if (!a.s && a.st === 'queue') { const k = a.t / (a.pat * 1.6); if (k > .5) pset(px + 10, py + 2 + ((frame >> 3) & 1), C('#60c0ff')); if (k > .8 && (frame & 15) === 0) P({ kind: 'steam', x: px + 6, y: py - 1, vy: -.5, vx: (Math.random() - .5) * .4, max: 30 }); }
  if (a.storm > 0) { a.storm--; ellF(px + 6, py - 5, 6, 2.5, C('#505060')); if ((frame >> 2) & 1) pset(px + 4, py - 2, C('#ffe040')); }
  if (a.heart) { a.heart = 0; P({ kind: 'heart', x: px + 6, y: py - 2, vy: -.6, max: 46 }); }
  if (a.settle > 0) { a.settle--; if (a.settle === 49 && Math.random() < .35) say2(st, a, 'THIS WILL DO.', '#606060', 50); }
  if (a.wet > 0) { a.wet--; if ((frame & 7) === 0) P({ kind: 'drop', x: px + 3 + Math.random() * 6, y: py + 6, vy: .5, g: .1, max: 12, c: C('#80b0ff') }); }
  // a regular's name tag
  if (a.regn) { const s = a.regn, w = tw(s) + 2, x = px + 6 - (w >> 1), y = py - 9; if (!(a.wantT > 0) && !a.bt) { rectF(x, y, w, 8, C('#fff4c0')); frameR(x, y, w, 8, C('#c08000')); text(s, x + 1, y + 1, C('#805000'), 0); } }
  // random chatter while browsing
  if (!a.s && a.st === 'browse' && Math.random() < .0015) say2(st, a, pick2(LINES.chat[a.g] || LINES.chat.routine), '#404040', 60);
  if (!a.s && a.st === 'next' && st.adAt !== undefined && G.tick - st.adAt < TPD && Math.random() < .004) say2(st, a, pick2({ flyers: ['GOT A FLYER!', 'THE FLYER SAID...'], bulletin: ['SAW THE BULLETIN'], blimp: ['SAW THE BLIMP!'], radio: ['THAT JINGLE!', 'HEARD IT ON RADIO'], tv: ['SAW IT ON TV!', 'FROM THE COMMERCIAL!'], idol: ['IS MIRAI HERE?!', 'MIRAI!!'] }[st.adId] || ['SAW THE AD!']), '#c06000', 60);
  // staff: sleepy on break, tired when stamina is low
  if (a.s && a.st === 'break' && (frame & 31) === 0) P({ kind: 'text', s: 'z', x: px + 9, y: py, vy: -.3, vx: .2, max: 40, c: C('#a0a0ff') });
  if (a.s && a.sta < 25 && a.st !== 'break' && (frame & 63) === 0) P({ kind: 'drop', x: px + 10, y: py + 2, vy: .2, g: .05, max: 20, c: C('#60c0ff') });
}
const LINDA_SPR = () => SPR.lindav || (SPR.lindav = offscreen(12, 16, () => {
  rectF(3, 8, 6, 5, C('#f0c040')); rectF(2, 9, 8, 6, C('#ff60a8')); rectF(4, 15, 4, 1, INKC);
  ellF(6, 4.5, 4, 3.4, C('#f8dcc0')); ellF(6, 2.5, 5, 2.6, C('#ff3d97')); rectF(1, 2, 2, 7, C('#ff3d97')); rectF(9, 2, 2, 5, C('#ff3d97')); pset(4, 5, INKC); pset(7, 5, INKC); pset(6, 0, C('#ffe040'));
  softOutline(.7); }));
const IDOL_SPR = () => SPR.idolv || (SPR.idolv = offscreen(12, 16, () => {
  rectF(3, 8, 6, 4, C('#ffffff')); rectF(2, 11, 8, 3, C('#ff70c0')); for (let i = 2; i < 10; i += 2) pset(i, 14, C('#ff70c0')); rectF(4, 14, 1, 2, C('#f8dcc0')); rectF(7, 14, 1, 2, C('#f8dcc0'));
  ellF(6, 4.5, 4, 3.4, C('#f8dcc0')); ellF(6, 2.6, 4.6, 2.4, C('#60d0ff')); rectF(1, 2, 2, 8, C('#60d0ff')); rectF(9, 2, 2, 8, C('#60d0ff')); pset(4, 5, INKC); pset(7, 5, INKC); pset(3, 6, C('#ff90a0')); pset(8, 6, C('#ff90a0'));
  pset(6, 0, C('#ffe040')); pset(5, 0, C('#ffe040')); rectF(9, 8, 1, 3, C('#404040')); pset(9, 7, C('#202020'));
  softOutline(.7); }));
const CAT_SPR = (fr, nap) => { const k = 'kitty' + fr + nap; return SPR[k] || (SPR[k] = offscreen(12, 8, () => { const c = C('#e89040'), d = C('#b06020');
  if (nap) { ellF(6, 5, 5, 2.5, c); ellF(3, 4, 2.5, 2, c); pset(2, 2, c); pset(4, 2, c); rectF(9, 5, 3, 1, d); }
  else { rectF(3, 3, 7, 3, c); rectF(3, 6, 1, 2, d); rectF(8, 6, 1, 2, d); if (fr) { rectF(4, 6, 1, 2, d); rectF(9, 6, 1, 2, d); } ellF(10, 2.5, 2, 2, c); pset(9, 0, c); pset(11, 0, c); pset(11, 2, INKC); rectF(1, 1 + fr, 2, 1, d); pset(2, 2, d); }
  softOutline(.7); })); };
function drawVisitor(st, v) {
  let [px, py] = tileXY(st, v.fx, v.fy); px += 6;
  const moving = Math.abs(v.fx - v.x) + Math.abs(v.fy - v.y) > .02, dir = moving ? (Math.abs(v.x - v.fx) > Math.abs(v.y - v.fy) ? (v.x > v.fx ? 3 : 1) : (v.y > v.fy ? 0 : 2)) : 0, fr = moving ? (frame >> 3) & 3 : 0;
  if (v.kind === 'cat') { blit(CAT_SPR(fr & 1, v.nap ? 1 : 0), px, py + 8, dir === 1); if (v.nap && (frame & 31) === 0) P({ kind: 'text', s: 'z', x: px + 8, y: py + 4, vy: -.3, vx: .2, max: 40, c: C('#a0a0ff') });
    for (const a of st.agents) if (!a.s && Math.abs(a.fx - v.fx) + Math.abs(a.fy - v.fy) < 1.5 && Math.random() < .004) P({ kind: 'heart', x: px + 6, y: py, vy: -.6, max: 40 }); return; }
  if (v.kind === 'linda') { blit(LINDA_SPR(), px, py - 1 + ((fr & 1) ? -1 : 0), dir === 1); if ((frame & 15) === 0) P({ kind: 'spark', x: px + Math.random() * 12, y: py + 2 + Math.random() * 10, vy: -.15, max: 20, c: C('#ffe060') }); return; }
  if (v.kind === 'idol') { blit(IDOL_SPR(), px, py - 1 + ((frame >> 3) & 1 ? -1 : 0), dir === 1); if ((frame & 15) === 0) P({ kind: 'note', x: px + 10, y: py, vx: .3, vy: -.5, max: 50, c: C(pick2(['#ff60b0', '#60c0ff', '#ffe040'])) });
    for (const a of st.agents) if (!a.s && Math.abs(a.fx - v.fx) + Math.abs(a.fy - v.fy) < 2.5) { a.look2 = 10; if (Math.random() < .01) P({ kind: 'heart', x: px + 6, y: py - 2, vy: -.6, max: 40 }); } return; }
  if (v.kind === 'boss') { blit(bossSprite(v.who), px, py - 5 + (v.who === 'ghost' || v.who === 'face' ? Math.sin(frame * .1) * 2 : 0), dir === 1); return; }
  if (v.kind === 'delivery') { blit(person('human', dir, fr, '#e0a020', 5), px, py, dir === 1); if (!v.back) { rectF(px + 1, py + 2, 10, 9, C('#c89a5a')); frameR(px + 1, py + 2, 10, 9, INKC); rectF(px + 1, py + 6, 10, 1, INKC); } }
}
function fxTop(st, ox, oy, sw, sh) {
  // speech balloons
  for (const s of SAYS) { s.t--; let x = s.x, y = s.y; if (s.a) { if (s.a.gone) { s.t = 0; continue; } const p = s.a.vis ? (() => { const q = tileXY(st, s.a.fx, s.a.fy); return [q[0] + 6, q[1]]; })() : agentXY(st, s.a); x = p[0] + 6; y = p[1] - 12; }
    const w = tw(s.s) + 4, bx = clamp(x - (w >> 1), 2, W - w - 2), by = y - 2 - Math.max(0, 4 - (s.max - s.t));
    rectF(bx, by, w, 9, C('#ffffff')); frameR(bx, by, w, 9, INKC); if (s.a) { pset(x, by + 9, INKC); pset(x - 1, by + 10, INKC); } text(s.s, bx + 2, by + 1, C(s.col), 0); }
  SAYS = SAYS.filter(s => s.t > 0);
  // particles
  for (const p of PFX) {
    p.t++; const k = p.t / p.max;
    if (p.kind === 'item') { const x = p.x + (p.tx - p.x) * k, y = p.y + (p.ty - p.y) * k - Math.sin(k * Math.PI) * 10; rectF(x - 1, y - 1, 3, 3, p.c); continue; }
    p.vy += p.g; p.x += p.vx; p.y += p.vy;
    if (p.kind === 'coin') { rectF(p.x, p.y, 2, 2, C((p.t >> 2) & 1 ? '#ffe040' : '#c09020')); }
    else if (p.kind === 'spark') { if ((p.t >> 2) & 1) { pset(p.x, p.y, p.c); pset(p.x - 1, p.y, p.c); pset(p.x + 1, p.y, p.c); pset(p.x, p.y - 1, p.c); pset(p.x, p.y + 1, p.c); } else pset(p.x, p.y, p.c); }
    else if (p.kind === 'text') text(p.s, p.x | 0, p.y | 0, p.c, INKC);
    else if (p.kind === 'heart') { const c = C('#ff5090'); pset(p.x - 1, p.y, c); pset(p.x + 1, p.y, c); rectF(p.x - 2, p.y + 1, 5, 1, c); rectF(p.x - 1, p.y + 2, 3, 1, c); pset(p.x, p.y + 3, c); }
    else if (p.kind === 'steam') { const c = mix(C('#ffffff'), C('#a0a0a0'), k); ellF(p.x, p.y, 1.5 + k * 2, 1 + k, c); }
    else if (p.kind === 'dust') ellF(p.x, p.y, 2 - k * 2 + .5, 1, C('#c8b8a0'));
    else if (p.kind === 'drop') pset(p.x, p.y, p.c);
    else if (p.kind === 'conf') rectF(p.x, p.y, 2, 1 + ((p.t >> 2) & 1), p.c);
    else if (p.kind === 'paper') { p.vx = Math.sin(p.t * .08 + p.y * .1) * .7; const f = (p.t >> 3) & 1; rectF(p.x, p.y, f ? 4 : 3, f ? 2 : 3, p.c); pset(p.x + 1, p.y + 1, C('#a0a0a0')); }
    else if (p.kind === 'note') { rectF(p.x, p.y + 3, 2, 2, p.c); rectF(p.x + 1, p.y, 1, 3, p.c); pset(p.x + 2, p.y, p.c); }
  }
  PFX = PFX.filter(p => p.t < p.max);
  // Ghost's show: spotlights, confetti, a crowd going "ooh"
  if (showOn(st)) { const sp = st.fix.find(f => f.k === 'spec'); if (sp) { const [x, y] = fixXY(st, sp);
    for (let i = 0; i < 2; i++) glow(x + 12 + Math.sin(frame * .04 + i * 2.5) * 40, y + 6 + Math.cos(frame * .05 + i) * 20, 22, C(i ? '#ff80ff' : '#80c0ff'), .35);
    if ((frame & 3) === 0) P({ kind: 'conf', x: x + Math.random() * 24, y: y - 20, vx: (Math.random() - .5), vy: .2, g: .03, max: 70, c: C(pick2(['#ff4060', '#40c0ff', '#ffe040', '#c080ff'])) });
    if (Math.random() < .01) { const c = st.agents.filter(a => !a.s && a.g === 'adventurer'); if (c.length) say2(st, pick2(c), pick2(['OOOH!', 'WOW!', 'ENCORE!', 'SPOOKY!']), '#8040c0', 50); } } }
  // the TV commercial: a set in the corner, the manager's face, the slogan
  if (st.tvT > 0) { st.tvT--; const tx = W - 150, ty = 60, M = MGRS[chainOf(st).mgr], sl = SLOGANS[chainOf(st).mgr], k = Math.min(1, (260 - st.tvT) / 10, st.tvT / 10);
    if (k > .2) { const hh = 90 * k | 0, yy = ty + (90 - hh) / 2 | 0; rectF(tx, yy, 140, hh, C('#3a3020')); rectF(tx + 6, yy + 6, 128, Math.max(0, hh - 20), C('#101820'));
      if (k >= 1) { const sc = (frame >> 1) & 1; gradV(tx + 8, ty + 8, 124, 66, C(M.col), C(M.paper), 6); copyBuf(portrait(PORTKEY[chainOf(st).mgr], 'happy'), tx + 10, ty + 12);
        text(sl[0].slice(0, 12), tx + 62, ty + 14, C('#ffffff'), INKC); if (sl[0].length > 12) text(sl[0].slice(12).trim(), tx + 62, ty + 24, C('#ffffff'), INKC);
        if ((frame >> 4) & 1) wrapT(sl[1], 11).forEach((l, i) => text(l, tx + 62, ty + 40 + i * 10, C(M.col2), INKC));
        for (let y = ty + 8 + sc; y < ty + 74; y += 2) rectA(tx + 8, y, 124, 1, C('#000000'), .18); }
      rectF(tx + 50, yy + hh - 12, 40, 8, C('#2a2418')); pset(tx + 120, yy + hh - 8, C('#ff4040')); frameR(tx, yy, 140, hh, INKC); text('MALL TV', tx + 6, yy + hh - 12, C('#c0b080'), 0); } }
  if (st.noteT > 0) { st.noteT--; if ((frame & 7) === 0) P({ kind: 'note', x: ox + Math.random() * sw, y: oy + 10, vx: (Math.random() - .5) * .4, vy: .4, max: 120, c: C(pick2(['#ff60b0', '#60c0ff', '#ffe040'])) }); }
  // Carl's ship passing over
  if (st.shipT > 0) { st.shipT--; const k = 1 - st.shipT / 90, x = ox - 80 + k * (sw + 160); ellF(x, oy + 10, 40, 8, mix(C('#000000'), C('#202020'), .5)); for (let i = 0; i < 5; i++) pset(x - 30 + i * 15, oy + 10, C('#80ffd0')); }
  if (st.shakeT > 0 && --st.shakeT <= 0) post.shake = 0;
  // flickering lights, a red flash for a theft
  if (st.flickT > 0) { st.flickT--; if ((st.flickT >> 2) & 1) rectA(ox + WALL, oy + BACK_H + WALL, sw - WALL * 2, sh - BACK_H - WALL * 2, C('#000010'), .45); if (st.flickT === 49) sayAt(ox + sw / 2, oy + 30, 'THE LIGHTS!', '#404040', 50); }
  if (st.redT > 0) { st.redT--; if ((st.redT >> 2) & 1) frameR(ox + 1, oy + 1, sw - 2, sh - 2, C('#ff2020')); }
  if (st.doorT > 0) st.doorT--;
  // banners: rushes, shows, visits
  if (BANNERFX && BANNERFX.t > 0) { BANNERFX.t--; const s = BANNERFX.s, w = tw(s) * 2 + 20, k = Math.min(1, (150 - BANNERFX.t) / 12, BANNERFX.t / 12), x = (W - w) / 2 + 30 | 0, y = 58 - (1 - k) * 30 | 0;
    rectF(x, y, w, 20, C(BANNERFX.col)); frameR(x, y, w, 20, INKC); rectF(x + 2, y + 2, w - 4, 1, mix(C(BANNERFX.col), C('#ffffff'), .5));
    let xx = x + 10; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) { rectF(xx + i * 2 + 1, y + 4 + j * 2 / 1.5 + 1, 2, 1.4, INKC); rectF(xx + i * 2, y + 4 + j * 2 / 1.5, 2, 1.4, C('#ffffff')); } xx += 12; } }
}
// the automatic door slides open
function fxDoor(st, ox, oy, sw, sh) {
  if (!(st.doorT > 0)) return; const dx = ox + WALL + doorX(st) * TW, k = Math.min(1, st.doorT / 8, (24 - st.doorT + 4) / 6);
  rectF(dx, oy + sh - WALL + 1, TW, WALL - 2, C(MGRS[chainOf(st).mgr].floor)); rectF(dx - 1, oy + sh - WALL + 1, TW / 2 * (1 - k) + 1, WALL - 2, C('#a8e8ff')); rectF(dx + TW / 2 + TW / 2 * k, oy + sh - WALL + 1, TW / 2 * (1 - k) + 1, WALL - 2, C('#a8e8ff'));
}
