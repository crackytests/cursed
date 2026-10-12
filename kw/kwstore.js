'use strict';
// ================= KONBINI WARS: the store view (the PS Special look), the layout editor, the inspector =================
let VIEW = { kind: 'map' }, SEL = null, TOOL = null, TOOLDIR = 0;
const SHELL = {};
function storeOrigin(st) { const sw = st.fw * TW + WALL * 2, sh = st.fh * TH + WALL * 2 + BACK_H; return [((W - sw) / 2 | 0) + 30, 11 + ((232 - sh) / 2 | 0) - 4, sw, sh]; }
const tileXY = (st, x, y) => { const [ox, oy] = storeOrigin(st); return [ox + WALL + x * TW, oy + BACK_H + WALL + y * TH]; };
function tileAt(st, mx, my) { const [ox, oy] = storeOrigin(st), x = Math.floor((mx - ox - WALL) / TW), y = Math.floor((my - oy - BACK_H - WALL) / TH); return x >= 0 && y >= 0 && x < st.fw && y < st.fh ? [x, y] : null; }

function drawStore(st) {
  const M = MGRS[chainOf(st).mgr], [ox, oy, sw, sh] = storeOrigin(st);
  copyBuf(skyPaper(chainOf(st).mgr), 0, 0); fxOutside(st, ox, oy, sw, sh);
  const key = st.size + chainOf(st).mgr; if (!SHELL[st.i] || SHELL[st.i].key !== key) SHELL[st.i] = { key, b: storeShell(st) };
  copyBuf(SHELL[st.i].b, ox, oy); fxDoor(st, ox, oy, sw, sh);
  // the backroom arrows (as in Special) and the break table
  const [bx] = tileXY(st, backX(st), 0); text('v', bx + 4, oy + BACK_H + 1, C('#ffe060'), 0); text('^', bx + 13, oy + BACK_H, C('#ffe060'), 0);
  // dirt
  for (let y = 0; y < st.fh; y++) for (let x = 0; x < st.fw; x++) { const d = st.dirt[y * st.fw + x]; if (d < 8) continue; const [tx, ty] = tileXY(st, x, y), n = Math.min(10, d / 5 | 0);
    for (let k = 0; k < n; k++) pset(tx + 2 + hash(x, y, k) * 20, ty + 2 + hash(y, x, k) * 12, C('#4a3a2a')); }
  // the edit grid
  if (TOOL) { for (let y = 0; y < st.fh; y++) for (let x = 0; x < st.fw; x++) { const [tx, ty] = tileXY(st, x, y); frameR(tx, ty, TW, TH, mix(C(M.floor), C('#ffffff'), .25)); }
    const ht = tileAt(st, MOUSE.x, MOUSE.y); if (ht && FIX[TOOL]) { const [tx, ty] = tileXY(st, ht[0], ht[1]); frameR(tx, ty, TW * (FIX[TOOL].w || 1), TH * (FIX[TOOL].h || 1), C('#ffff60')); } }
  // fixtures
  st.fix.forEach((f, i) => { const [tx, ty] = tileXY(st, f.x, f.y); drawFixture(f, tx, ty, chainOf(st).mgr, st, st.flash.some(fl => fl.fi === i)); });
  fxShelves(st);
  if (SEL && SEL.kind === 'fix' && SEL.st === st && st.fix.includes(SEL.f)) { const [tx, ty] = tileXY(st, SEL.f.x, SEL.f.y); if ((frame >> 3) & 1) frameR(tx, ty, TW, TH, C('#ffff40')); const [ax, ay] = accessOf(SEL.f), [px, py] = tileXY(st, ax, ay); frameR(px + 4, py + 3, TW - 8, TH - 6, C('#ffff40')); }
  // the Ghost show
  if (showOn(st)) { const sp = st.fix.find(f => f.k === 'spec'); if (sp) { const [tx, ty] = tileXY(st, sp.x, sp.y); for (let k = 0; k < 6; k++) { const a = frame * .07 + k; glow(tx + 12 + Math.cos(a) * 16, ty + 6 + Math.sin(a) * 9, 5, C('#a060ff'), .8); } blit(ghostSprite(), tx + 6, ty - 22 + Math.sin(frame * .1) * 2); if ((frame & 63) < 40) text(chainOf(st).mgr === 'ghost' ? 'BEHOLD!' : 'TA-DA!', tx, ty - 32, C('#e0c0ff'), INKC); } }
  // people, back to front
  const ag = st.agents.concat(st.vis || []).sort((a, b) => a.fy - b.fy);
  for (const a of ag) {
    if (a.vis) { drawVisitor(st, a); continue; }
    let [px, py] = agentXY(st, a);
    const moving = Math.abs(a.fx - a.x) + Math.abs(a.fy - a.y) > .02;
    let [dir, fr, dy] = fxPose(st, a, moving ? (Math.abs(a.x - a.fx) > Math.abs(a.y - a.fy) ? (a.x > a.fx ? 3 : 1) : (a.y > a.fy ? 0 : 2)) : (a.s ? 0 : 2), moving ? (frame >> 3) & 3 : 0); py += dy;
    const spr = a.s ? person(a.s.look, dir, fr, M.col, a.s.i * 7 + 3) : person(custLook(a), dir, fr, null, a.seed * 64 | 0);
    blit(spr, px | 0, py | 0, dir === 1);
    if (!a.s && a.basket && a.basket.length && dir !== 2) { const bx = dir === 1 ? px - 1 : dir === 3 ? px + 9 : px + 9; rectF(bx, py + 10, 4, 3, C('#d03030')); rectF(bx + 1, py + 11, 2, 1, C(CATS[PRODUCTS[a.basket[0].pid].cat].col)); pset(bx + 1, py + 9, C('#d03030')); pset(bx + 2, py + 9, C('#d03030')); }
    if (a.carry) { rectF(px + 2, py + 7, 8, 5, C('#c89a5a')); frameR(px + 2, py + 7, 8, 5, INKC); rectF(px + 4, py + 8, 4, 1, C('#e8c890')); }
    if (a.st === 'clean') { rectF(px + 10, py + 6, 1, 8, C('#a08060')); rectF(px + 9, py + 13, 4, 2, C('#e0e0a0')); }
    if (a.bt) drawBubble(px + 6, py - 10, a.bub);
    fxAgent(st, a, px, py, dir);
    if (SEL && SEL.kind === 'agent' && SEL.a === a && (frame >> 3) & 1) frameR(px - 2, py - 2, 16, 19, C('#ffff40'));
  }
  fxTop(st, ox, oy, sw, sh);
  // register sales: the till blinks and the sale floats up
  for (const fl of st.flash) { const f = st.fix[fl.fi]; if (!f) continue; const [tx, ty] = tileXY(st, f.x, f.y); if (fl.t > 6) text('+' + fmt(fl.v), tx - 2, ty - 8 + (fl.t - 12), C('#ffff80'), INKC); }
  // Carl's crate arriving through the backroom
  if (st.crate > 0) { const [cx] = tileXY(st, backX(st), 0), y = oy + 2 + Math.min(0, -40 + (90 - st.crate) * 2); rectF(cx + 2, y, 20, 14, C('#c89a5a')); frameR(cx + 2, y, 20, 14, INKC); text('ASS', cx + 3, y + 4, INKC, 0); }
  // closed
  if (!isOpen(st.hours, hourNow())) { rectA(ox + WALL, oy + BACK_H + WALL, sw - WALL * 2, sh - BACK_H - WALL * 2, INKC, .45); ctext('CLOSED', oy + sh / 2 | 0, C('#ffffff'), INKC, ox + sw / 2); }
  drawTag(st); drawDatePanel();
}
const BUB = { missing: ['?', '#ff8040'], empty: ['0', '#ff4040'], price: ['$', '#ff4040'], queue: ['...', '#ff4040'], happy: ['<3', '#ff60a0'], extra: ['+', '#40a040'], theft: ['!', '#ff2020'], caught: ['!!', '#2060ff'] };
function drawBubble(x, y, b) { const [s, c] = BUB[b] || ['?', '#000000'], w = tw(s) + 4; rectF(x - w / 2 | 0, y, w, 9, C('#ffffff')); frameR(x - w / 2 | 0, y, w, 9, INKC); pset(x, y + 9, INKC); text(s, (x - w / 2 | 0) + 2, y + 1, C(c), 0); }

// the store tag, top left: head-office marker, hours, today's sales (Special's floating panel, as a borderless window)
function drawTag(st) {
  const M = MGRS[chainOf(st).mgr], x = 6, y = 16, w = 132, h = 36;
  bevel(x, y, w, h); inset(x + 3, y + 3, 28, 30);
  rectF(x + 5, y + 5, 24, 26, C(M.col)); text(st.num === 1 ? 'HQ' : '#' + st.num, x + (st.num === 1 ? 11 : 9), y + 14, C('#ffffff'), INKC);
  ink(M.short, x + 36, y + 4); ink(HOURS[st.hours].n === '24 HOURS' ? '24-HOUR' : HOURS[st.hours].n, x + 36, y + 14, WIN.dim);
  st.shown = (st.shown || 0) > st.day.sales ? st.day.sales : (st.shown || 0) + Math.max(10, (st.day.sales - (st.shown || 0)) * .12) | 0; if (st.shown > st.day.sales) st.shown = st.day.sales;
  ink(mc(st.shown), x + 36, y + 24, st.shown < st.day.sales ? WIN.gold : WIN.title);
  if (rowHit(x, y, w, h)) openStoreWin(st);
}
// the date and cash panel, bottom right (weather, date, money, a clock)
function drawDatePanel() {
  const w = 176, h = 38, x = W - w - 6, y = H - 13 - h - 4, c = playerChain();
  bevel(x, y, w, h); inset(x + 3, y + 3, 30, 32); weatherIcon(x + 5, y + 6, G.weather);
  inset(x + 36, y + 3, 98, 15); ink('Y' + G.y + ' ' + MONTHS[G.mo - 1] + ' ' + SAMPLE_DAYS[Math.min(3, G.d)], x + 40, y + 7);
  inset(x + 36, y + 20, 98, 15); ink(fmt(c.cash), x + 40, y + 24, c.cash < 0 ? WIN.red : WIN.ink); ink('MC', x + 116, y + 24, WIN.dim);
  // the analog clock
  const cx = x + 156, cy = y + 19, m = minNow(); ellF(cx, cy, 15, 15, WIN.dark); ellF(cx, cy, 13, 13, C('#d0d8e0')); for (let i = 0; i < 12; i++) pset(cx + Math.sin(i / 6 * Math.PI) * 11, cy - Math.cos(i / 6 * Math.PI) * 11, WIN.dark);
  const ha = (m / 720) * Math.PI * 2, ma = (m % 60) / 60 * Math.PI * 2; lineF(cx, cy, cx + Math.sin(ha) * 6, cy - Math.cos(ha) * 6, WIN.ink); lineF(cx, cy, cx + Math.sin(ma) * 10, cy - Math.cos(ma) * 10, WIN.red);
}
function weatherIcon(x, y, w) {
  if (w === 'SUNNY' || w === 'HOT') { ellF(x + 13, y + 10, 7, 7, C(w === 'HOT' ? '#ff6020' : '#ffd020')); for (let i = 0; i < 8; i++) pset(x + 13 + Math.cos(i * .785) * 10, y + 10 + Math.sin(i * .785) * 10, C('#ffb020')); }
  else { ellF(x + 10, y + 10, 7, 5, C('#e8e8f0')); ellF(x + 16, y + 9, 6, 5, C('#ffffff')); if (w === 'RAIN') for (let i = 0; i < 4; i++) rectF(x + 7 + i * 4, y + 16 + ((frame >> 2) + i) % 3, 1, 3, C('#4080ff')); }
  ink({ SUNNY: 'SUN', HOT: 'HOT', CLOUDY: 'CLDY', RAIN: 'RAIN' }[w] || w, x + 1, y + 22, WIN.dim);
}

// ---------- clicks on the store ----------
function storeInput(st) {
  if (OWNER !== 'desk') return;
  const t = tileAt(st, MOUSE.x, MOUSE.y), f = t && fixAt(st, t[0], t[1]);
  CURSOR = TOOL ? 'cross' : f ? 'hand' : 'arrow';
  if (TOOL && MOUSE.rclick) { TOOLDIR = (TOOLDIR + 1) % 4; sfx('move'); }
  if (!MOUSE.click) return;
  if (TOOL) { MOUSE.click = 0; if (t) editAt(st, t[0], t[1]); return; }
  // a person under the pointer?
  for (const a of st.agents) { const [px, py] = agentXY(st, a); if (MOUSE.x >= px - 1 && MOUSE.x < px + 13 && MOUSE.y >= py && MOUSE.y < py + 15) { MOUSE.click = 0; SEL = { kind: 'agent', st, a }; openInspect(); return; } }
  if (f) { MOUSE.click = 0; SEL = { kind: 'fix', st, f }; openInspect(); }
}
// ---------- the editor ----------
function editAt(st, x, y) {
  if (chainOf(st) !== playerChain()) return;
  const at = fixAt(st, x, y), c = playerChain();
  if (TOOL === 'remove') {
    if (!at) return; const i = st.fix.indexOf(at); st.fix.splice(i, 1);
    const why = checkLayout(st); if (why && why !== 'THE STORE NEEDS A REGISTER' || at.k === 'reg' && !st.fix.some(f => f.k === 'reg')) { st.fix.splice(i, 0, at); relayout(st); sfx('bad'); alertBox(why || 'THE STORE NEEDS A REGISTER.'); return; }
    at.p.forEach((pid, j) => { if (pid && at.n[j]) st.back[pid] = (st.back[pid] || 0) + at.n[j]; });
    const back = Math.round(FIX[at.k].cost * .3); c.cash += back; st.day.capex -= back; sfx('crate'); layoutChanged(st); return;
  }
  if (TOOL === 'rotate') { if (!at) return; const d0 = at.d; at.d = (at.d + 1) % 4; let why = checkLayout(st); for (let k = 0; k < 3 && why; k++) { at.d = (at.d + 1) % 4; why = checkLayout(st); } if (why) { at.d = d0; relayout(st); sfx('bad'); alertBox(why); return; } sfx('place'); layoutChanged(st); return; }
  if (at) return; const F = FIX[TOOL]; for (let j = 0; j < (F.h || 1); j++) for (let i = 0; i < (F.w || 1); i++) if (x + i >= st.fw || y + j >= st.fh || fixAt(st, x + i, y + j)) { sfx('bad'); alertBox('IT DOESN\'T FIT THERE.'); return; }
  const cost = FIX[TOOL].cost + 50000; if (c.cash < cost) { sfx('bad'); alertBox('NOT ENOUGH MONEY.'); return; }
  const f = newFix(TOOL, x, y, TOOLDIR, c.mgr); st.fix.push(f);
  let why = checkLayout(st); for (let k = 0; k < 3 && why; k++) { f.d = (f.d + 1) % 4; why = checkLayout(st); }
  if (why) { st.fix.pop(); relayout(st); sfx('bad'); alertBox(why); return; }
  c.cash -= cost; st.day.capex += cost; sfx('place'); layoutChanged(st);
}

// ---------- the inspector: one click on a shelf says whether the stock is missing, in the back, or waiting for staff ----------
function shelfStatus(st, f, j) {
  const pid = f.p[j]; if (!pid) return ['-', WIN.dim]; const p = PRODUCTS[pid];
  if (p.permit && !st.permit[p.permit]) return ['NEEDS ' + PERMITS[p.permit].n + ' PERMIT', WIN.red];
  if (f.n[j] > FACE_CAP / 2) return ['OK', WIN.green];
  const back = st.back[pid] || 0;
  if (!back) return [f.n[j] ? 'LOW. NONE IN THE BACK' : 'EMPTY. NONE IN THE BACK', WIN.red];
  if (st.claim[st.fix.indexOf(f) + ':' + j]) return ['STAFF ON THE WAY', WIN.gold];
  return [f.n[j] ? 'LOW. ' + back + ' IN THE BACK' : 'EMPTY. ' + back + ' IN THE BACK, NOBODY FREE', WIN.gold];
}
const AGENT_SAYS = {
  next: 'deciding what to get next', think: 'looking around for something this store doesn\'t carry', go: 'walking to a shelf', browse: 'browsing',
  toreg: 'heading for the register', walkreg: 'heading for the register', queue: 'waiting in line', drop: 'putting things back and giving up', paid: 'paid, leaving',
  sneak: 'heading for the door with unpaid goods', leave: 'leaving',
};
const STAFF_SAYS = { idle: 'deciding on a job', wait: 'watching the floor', toreg: 'going to a register', reg: 'on the register', fetch: 'going to the backroom', inback: 'getting stock in the back',
  carry: 'carrying stock to a shelf', fill: 'filling a shelf', clean: 'cleaning the floor', tobreak: 'going on break', break: 'on break', show: 'helping with the show' };
const BUB_SAYS = { missing: 'This store doesn\'t carry what they wanted.', empty: 'The shelf was empty.', price: 'Too expensive for them.', queue: 'The line was too long.', happy: 'Pleased.', extra: 'Picked up something extra.', theft: 'Got away without paying!', caught: 'Caught by the staff.' };
function openInspect() {
  openWin({ id: 'inspect', title: 'INSPECT', x: 6, y: 56, w: 150, h: 120, keep: 1, body(win, x, y, w, h) {
    if (!SEL || SEL.st !== curStore()) { ink('Click a shelf or a person.', x + 2, y + 2, WIN.dim); return; }
    const st = SEL.st;
    if (SEL.kind === 'fix') {
      const f = SEL.f; if (!st.fix.includes(f)) { SEL = null; return; }
      ink(FIX[f.k].n, x + 2, y + 2, WIN.title);
      if (FIX[f.k].deco) { ink('+' + FIX[f.k].deco + ' SERVICE', x + 2, y + 14, WIN.green); ink('UPKEEP ' + fmt(FIX[f.k].upkeep) + ' MC/DAY', x + 2, y + 24, WIN.dim); ink('STORE DECOR +' + decoOf(st) + ' (MAX 60)', x + 2, y + 38, WIN.dim); return; }
      if (f.k === 'reg') { const q = st.q[st.fix.indexOf(f)] || [], who = st.agents.find(a => a.s && a.st === 'reg' && a.reg === st.fix.indexOf(f));
        ink('LINE: ' + q.length, x + 2, y + 14); ink(who ? 'STAFFED: ' + who.s.n : 'NOBODY ON THIS TILL', x + 2, y + 24, who ? WIN.ink : WIN.red); return; }
      f.p.forEach((pid, j) => { if (!pid) return; const yy = y + 13 + j * 24, [s, c] = shelfStatus(st, f, j), mine = st.chain === 0;
        if (mine && hit(x, yy - 1, w, 22) && OWNER === CURW) rectF(x, yy - 1, w, 22, mix(WIN.face, WIN.lite, .5));
        if (mine && rowHit(x, yy - 1, w, 22)) openPicker(st, f, j);
        rectF(x + 2, yy + 1, 5, 5, PCOL[pid][0]); ink(PRODUCTS[pid].n.slice(0, 15), x + 10, yy); ink(f.n[j] + '/' + FACE_CAP, x + w - tw(f.n[j] + '/' + FACE_CAP) - 2, yy, WIN.dim);
        const sl = wrapT(s, 23); sl.slice(0, 1).forEach(l => ink(l, x + 10, yy + 9, c)); });
      if (st.chain === 0) ink('CLICK A ROW TO SWAP', x + 2, y + h - 9, WIN.dim);
      if (f.k === 'spec' || f.k === 'med') ink('', x, y);
    } else {
      const a = SEL.a; if (!st.agents.includes(a)) { ink('They left.', x + 2, y + 2, WIN.dim); return; }
      if (a.s) { const s = a.s; ink(s.n + (s.mgr ? ' (MGR)' : ''), x + 2, y + 2, WIN.title); ink(STAFF_SAYS[a.st] || a.st, x + 2, y + 13);
        ink('STAMINA', x + 2, y + 25, WIN.dim); bar(x + 56, y + 26, 80, a.sta / 100, a.sta < 20 ? WIN.red : WIN.green);
        [['REGISTER', 'reg'], ['RESTOCK', 'rst'], ['SECURITY', 'sec'], ['CLEANING', 'cln'], ['SERVICE', 'svc']].forEach(([n, k], i) => { ink(n, x + 2, y + 37 + i * 10, WIN.dim); bar(x + 56, y + 38 + i * 10, 80, s.ab[k] / 100); rectF(x + 56 + capOf(s, k) * .8 | 0, y + 37 + i * 10, 1, 8, WIN.red); });
        return; }
      ink(a.regn ? a.regn + '  VISIT ' + a.visit : SEGS[a.g].n, x + 2, y + 2, WIN.title); if (a.want) ink('CAME FOR: ' + PRODUCTS[a.want].n.slice(0, 13), x + 2, y + 54, WIN.dim);
      wrapT('Is ' + (AGENT_SAYS[a.st] || a.st) + '.', 24).forEach((l, i) => ink(l, x + 2, y + 13 + i * 9));
      if (a.basket.length) ink(('BASKET: ' + a.basket.map(it => PRODUCTS[it.pid].n).join(', ')).slice(0, 23), x + 2, y + 34, WIN.dim);
      if (a.wants.length) ink(('STILL WANTS: ' + a.wants.map(c => CATS[c].n).join(', ')).slice(0, 23), x + 2, y + 44, WIN.dim);
      if (a.bub) wrapT(BUB_SAYS[a.bub] || '', 23).forEach((l, i) => ink(l, x + 2, y + 64 + i * 9, a.bub === 'happy' || a.bub === 'extra' ? WIN.green : WIN.red));
      if (a.st === 'queue') { ink('PATIENCE', x + 2, y + 86, WIN.dim); bar(x + 56, y + 87, 80, 1 - a.t / (a.pat * 2.5), WIN.gold); }
    }
  } });
}
const curStore = () => VIEW.kind === 'store' ? G.stores[VIEW.i] : null;

// ---------- choosing what goes on a facing ----------
function tagLabel(p) { const t = []; if (p.launch && G.months - p.launch < 3) t.push('NEW'); if (p.tags.includes('S')) t.push('SUMMER'); if (p.tags.includes('W')) t.push('WINTER'); if (p.tags.includes('rain')) t.push('RAIN'); if (p.permit) t.push('PERMIT'); return t.join(' '); }
function surveyShare(st, pid) { const sv = st.survey; if (!sv) return null; const cat = PRODUCTS[pid].cat; let tot = 0; for (const k in sv.want) if (PRODUCTS[k] && PRODUCTS[k].cat === cat) tot += sv.want[k]; return tot ? (sv.want[pid] || 0) / tot : 0; }
function openPicker(st, f, j) {
  const cat = FIX[f.k].cat;
  openWin({ id: 'picker', title: 'STOCK THIS FACING: ' + CATS[cat].n, x: 150, y: 6, w: 300, h: 240, body(win, x, y, w, h) {
    const ps = catalogue(st, cat), sv = st.survey;
    ink('ITEM', x + 12, y + 2, WIN.dim); ink('COST', x + 104, y + 2, WIN.dim); ink('PRICE', x + 132, y + 2, WIN.dim); ink('ASKED', x + 164, y + 2, WIN.dim); ink('SOLD', x + 198, y + 2, WIN.dim); ink('ON', x + 226, y + 2, WIN.dim);
    ps.forEach((p, i) => { const yy = y + 12 + i * 12, cur = f.p[j] === p.id, faces = st.fix.reduce((n, g) => n + g.p.filter(q => q === p.id).length, 0), share = surveyShare(st, p.id);
      if (cur) rectF(x, yy - 1, w, 11, mix(WIN.sel, WIN.face, .65)); else if (hit(x, yy - 1, w, 11) && OWNER === CURW) rectF(x, yy - 1, w, 11, mix(WIN.face, WIN.lite, .5));
      if (!cur && rowHit(x, yy - 1, w, 11)) { setFacing(st, f, j, p.id); relayout(st); catchment(); estimateDemand(st); sfx('place'); }
      rectF(x + 2, yy + 1, 5, 5, PCOL[p.id] ? PCOL[p.id][0] : WIN.ink); ink(p.n.slice(0, 15), x + 12, yy, sellable(st, p.id) ? WIN.ink : WIN.shade);
      ink(String(p.cost), x + 104, yy); ink(String(priceOf(st, p.id)), x + 132, yy);
      ink(share === null ? '?' : Math.round(share * 100) + '%', x + 166, yy, share === null ? WIN.dim : share > .15 ? WIN.green : WIN.ink);
      ink(faces ? String(st.sold[p.id] || 0) : '-', x + 200, yy, WIN.dim); ink(faces ? String(faces) : '', x + 228, yy, WIN.title);
      const tg = tagLabel(p); if (tg) ink(tg.split(' ')[0], x + 242, yy, tg.startsWith('NEW') ? WIN.red : WIN.dim); });
    const by = y + h - 30;
    wrapT(sv ? 'ASKED: share of this category\'s customers who came in for it, from the survey of ' + MONTHS[sv.mo - 1] + ' ' + sv.day + (G.months - sv.months > 1 ? ' (OLD: tastes change)' : '') + '.' : 'ASKED is unknown until you run a customer survey (STOCK menu). SOLD only covers what you carry.', 48).forEach((l, i) => ink(l, x + 2, by + i * 9, WIN.dim));
  } });
}
