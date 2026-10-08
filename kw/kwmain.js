'use strict';
// ================= KONBINI WARS: title, new game, the desktop, and the windows =================
CAST.CARL = { col: C('#5aa860'), voice: [520, 80], port: m => portrait('CARL', m) };
CAST['SPOOKY GHOST'] = { col: C('#c8c8ff'), voice: [300, 50], port: m => portrait('GHOST', m) };
const BOSS = () => MGRS[playerChain().mgr].n;
const SPEEDS = [0, 1, 2, 4, 48];
let SPEED = 0, SKIPPING = 0, TUT = {};

// ---------- the desktop ----------
const main = {
  update() {
    resolveOwner();
    const busy = DLG || MENUS.length || CARD || WINS.some(w => w.modal) || TOOL || G.over || !storesOf(0).length;
    if (!busy) { const n = SKIPPING ? 48 : SPEEDS[SPEED]; for (let i = 0; i < n && !G.over; i++) { const mo = G.months; simTick(); if (G.months !== mo) { SKIPPING = 0; break; } } }
    if (pressed.start && WINS.length) { focusWin(WINS[0]); }
    tutorial();
  },
  draw() {
    CURSOR = SKIPPING ? 'wait' : 'arrow';
    const st = curStore();
    if (st && !st.closed) { drawStore(st); storeInput(st); } else { if (VIEW.kind !== 'map') VIEW = { kind: 'map' }; drawMap(); mapInput(); }
    drawWins();
    menuBar(MENU); taskbar(); drawDrop();
  },
};
{ const _d = drawUI; drawUI = function () { _d(); drawTip(); drawCursor(); endUIFrame(); }; }

const MENU = [
  { n: 'FILE', list: [['NEW GAME', () => run(toTitle)], ['SAVE (START OF TODAY)', () => { if (saveGame()) alertBox('Saved. Loading replays today from midnight.'); }], ['LOAD', () => { if (loadGame()) { WINS.length = 0; VIEW = { kind: 'map' }; alertBox('Loaded.'); } else alertBox('No save yet.'); }]] },
  { n: 'STORE', list: [['STORE SETTINGS', () => withStore(openStoreWin)], ['BUILD / LAYOUT', () => withStore(openBuild)], ['HOURS AND PERMITS', () => withStore(openStoreWin)]] },
  { n: 'STOCK', list: [['MARGINS AND ORDERS', () => withStore(st => openStock(st, 0))], ['POS DATA', () => withStore(st => openStock(st, 1))], ['CUSTOMER SURVEY', () => withStore(openSurvey)]] },
  { n: 'STAFF', list: [['STORE STAFF', () => withStore(openStaff)]] },
  { n: 'MANAGER', list: [['SPECIAL POWER', () => withStore(openPower)]] },
  { n: 'PROMO', list: [['ADVERTISING', openPromo]] },
  { n: 'MAP', list: [['MALL MAP', () => { VIEW = { kind: 'map' }; }]] },
  { n: 'REPORT', list: [['BANK', openBank], ['TODAY', () => openReport(0)], ['LAST MONTH', () => openReport(1)], ['GOAL', () => openReport(2)], ['BULLETIN', openNews]] },
  { n: 'HELP', list: [['HOW TO PLAY', openHelp], ['ABOUT', () => alertBox(['MALL OF THE FUTURE: KONBINI WARS', 'PRETEND CO. SOFT 1998', 'ENGLISH PATCH v0.9 by the KW translation group.', 'Prototype build: Carl vs Ghost, one map.'])]] },
];
function withStore(fn) { const st = curStore() && curStore().chain === 0 ? curStore() : storesOf(0)[0]; if (!st) { alertBox('Open a store first. Click a lot on the MAP.'); return; } if (curStore() !== st) goStore(st); fn(st); }
function goStore(st) { VIEW = { kind: 'store', i: st.i }; SEL = null; music(chainOf(st).mgr); }
function taskbar() {
  const y = H - 13; bevel(0, y, W, 13);
  if (btn(2, y + 1, 34, 'START', { h: 11 })) MENUDROP = { src: MENU[0], x: 2, y: y - MENU[0].list.length * 11 - 4, w: 140, h: MENU[0].list.length * 11 + 4 };
  let x = 40;
  if (btn(x, y + 1, 30, 'MAP', { h: 11, on: VIEW.kind === 'map' })) { VIEW = { kind: 'map' }; music('mall'); } x += 32;
  for (const st of storesOf(0)) { const l = '#' + st.num; if (btn(x, y + 1, tw(l) + 8, l, { h: 11, on: VIEW.kind === 'store' && VIEW.i === st.i, tip: storeName(st) })) goStore(st); x += tw(l) + 10; }
  // the bulletin ticker
  const nx = x + 4, nw = W - 170 - nx; if (nw > 40) { inset(nx, y + 1, nw, 11); const s = NEWS[0] ? NEWS[0].s : 'WELCOME TO THE MALL OF THE FUTURE.', off = (frame >> 1) % (tw(s) + nw);
    for (let i = 0; i < s.length; i++) { const cx = nx + nw - off + i * 6; if (cx > nx + 1 && cx < nx + nw - 6) glyph(s[i], cx, y + 3, WIN.ink); }
    if (rowHit(nx, y + 1, nw, 11)) openNews(); }
  // speed
  const names = ['||', '>', '>>', '>>>'];
  names.forEach((n, i) => { if (btn(W - 166 + i * 24, y + 1, 22, n, { h: 11, on: SPEED === i && !SKIPPING, tip: i ? 'Speed ' + SPEEDS[i] + 'x' : 'Pause' })) { SPEED = i; SKIPPING = 0; } });
  if (btn(W - 68, y + 1, 30, 'SKIP', { h: 11, on: !!SKIPPING, tip: 'Run to the month-end settlement.' })) SKIPPING = !SKIPPING;
  const m = minNow(); inset(W - 36, y + 1, 34, 11); ink(String(m / 60 | 0).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'), W - 33, y + 3);
}

// ---------- store settings: hours, permit ----------
function openStoreWin(st) {
  openWin({ id: 'storewin', title: 'STORE: ' + storeName(st), x: 150, y: 20, w: 204, h: 172, body(win, x, y, w, h) {
    if (st.chain !== 0) { ink('Not your store.', x + 2, y + 2); return; }
    ink('SIZE ' + st.size + ' (' + st.fw + 'x' + st.fh + ')   ' + districtOf(G.lots[st.lot].x).n.split(' ')[0], x + 2, y + 2);
    ink('OPENING HOURS', x + 2, y + 16, WIN.title);
    HOURS.forEach((hh, i) => { if (btn(x + 2 + (i % 3) * 64, y + 26 + (i / 3 | 0) * 13, 62, hh.n, { on: st.hours === i, tip: 'Customers only come while you are open. Staff are paid for every open hour.' })) { st.hours = i; } });
    ink('PERMITS', x + 2, y + 56, WIN.title); ink('NO RIVAL WITHIN', x + 100, y + 56, WIN.dim);
    Object.entries(PERMITS).forEach(([k, P], i) => { const yy = y + 67 + i * 14, bl = !st.permit[k] && permitBlocker(st, k);
      ink(P.n, x + 2, yy + 3, st.permit[k] ? WIN.green : WIN.ink); ink(P.range + ' SQ', x + 72, yy + 3, WIN.dim);
      if (st.permit[k]) ink('HELD', x + 140, yy + 3, WIN.green); else if (bl) ink('BLOCKED', x + 130, yy + 3, WIN.red);
      else if (btn(x + 114, yy, 82, fmt(P.fee / 1e6) + 'M', { tip: 'Lets this store sell ' + P.n.toLowerCase() + (k === 'med' && playerChain().mgr === 'carl' ? ' and Prop Pills' : '') + '. Then build a case for it (BUILD). No other chain can get one within ' + P.range + ' squares.' })) { const r = getPermit(st, k); if (r) { sfx('bad'); alertBox(r); } else { sfx('cash'); catchment(); } } });
    const nx = SIZES[st.size + 1]; ink('SIZE', x + 2, y + 112, WIN.title);
    if (nx) { const lock = chainSales(0) < nx.unlock; if (btn(x + 40, y + 109, w - 42, lock ? 'SIZE ' + (st.size + 1) + ' AT ' + fmt(nx.unlock / 1e6) + 'M SALES' : 'GROW TO ' + nx.fw + 'x' + nx.fh + '  ' + fmt(nx.cost / 1e6) + 'M', { off: lock, tip: 'Rebuild bigger on the same lot. Your layout stays; you get more room and one more staff job.' })) run(async () => { if (await msgBox('GROW', 'Rebuild ' + storeName(st) + ' at size ' + (st.size + 1) + ' for ' + mc(nx.cost) + '? Customers inside will be asked to leave.', ['GROW', 'NO'], { icon: iconInfo }) === 0) { const r = upgradeStore(st); if (r) alertBox(r); else sfx('cash'); } }); }
    else ink('LARGEST SIZE', x + 40, y + 112, WIN.dim);
    if (btn(x + 2, y + h - 14, 96, 'LAYOUT...', {})) openBuild(st);
    if (btn(x + 100, y + h - 14, 96, 'STAFF...', {})) openStaff(st);
  } });
}
// ---------- build palette ----------
function openBuild(st) {
  if (st.chain !== 0) return; TOOL = TOOL || 'snack';
  openWin({ id: 'build', title: 'BUILD (PAUSED)', x: 4, y: 14, w: 148, h: 228, onClose() { TOOL = null; }, body(win, x, y, w, h) {
    FIX_KINDS.forEach((k, i) => { const yy = y + i * 12; if (btn(x, yy, 90, FIX[k].n, { h: 11, on: TOOL === k, tip: FIX[k].deco ? '+' + FIX[k].deco + ' service. Upkeep ' + FIX[k].upkeep + ' MC a day.' + (FIX[k].w ? ' Takes 2x2 tiles.' : '') : undefined, tip: (FIX[k].cat ? 'Holds ' + CATS[FIX[k].cat].n + '. ' : '') + 'Click a floor tile. Right-click turns it.' })) TOOL = k; ink(fmt(FIX[k].cost / 1000) + 'K', x + 94, yy + 3, WIN.dim); });
    const yy = y + FIX_KINDS.length * 12 + 2;
    if (btn(x, yy, 68, 'REMOVE', { on: TOOL === 'remove', tip: 'Refunds 30%. Stock goes to the backroom.' })) TOOL = 'remove';
    if (btn(x + 70, yy, 68, 'TURN', { on: TOOL === 'rotate' })) TOOL = 'rotate';
    ink('FACING: ' + ['DOWN', 'LEFT', 'UP', 'RIGHT'][TOOLDIR], x, yy + 16, WIN.dim); ink('RIGHT-CLICK TURNS', x, yy + 26, WIN.dim);
  } });
}
// ---------- stock: margins, orders, POS ----------
function openStock(st, tab) {
  let t = tab, cat = 'bento';
  openWin({ id: 'stock', title: 'STOCK: ' + storeName(st), x: 120, y: 12, w: 270, h: 230, body(win, x, y, w, h) {
    t = tabs(x, y, ['MARGINS', 'POS DATA'], t);
    const y0 = y + 16, c = playerChain();
    if (t === 0) {
      const rv = nearRival(st);
      ink('MARKUP OVER COST', x + 2, y0, WIN.title); ink('E.G.', x + 132, y0, WIN.dim); ink(rv ? 'RIVAL' : 'NO RIVAL', x + 206, y0, WIN.dim);
      CAT_IDS.forEach((k, i) => { const yy = y0 + 12 + i * 13, ex = carried(st).find(p => PRODUCTS[p].cat === k);
        const r = stepper(x + 70, yy, '', Math.round(st.margin[k] * 100) + '%', { w: 30 }); ink(CATS[k].n, x + 2, yy + 3);
        if (r) { st.margin[k] = clamp(Math.round((st.margin[k] + r * .02) * 100) / 100, 0, 1.5); catchment(); }
        if (ex) ink(PRODUCTS[ex].n.slice(0, 7) + ' ' + priceOf(st, ex), x + 132, yy + 3, WIN.dim);
        if (rv) { const d = st.margin[k] - rv.margin[k]; ink(Math.round(rv.margin[k] * 100) + '%', x + 212, yy + 3, d > .04 ? WIN.red : d < -.04 ? WIN.green : WIN.ink); } });
      const yy = y0 + 14 + CAT_IDS.length * 13;
      wrapT(rv ? 'Next to a cheaper rival, a higher price empties your store. Alone, you can charge more.' : 'Customers pay more for the right thing. Too high and they put it back.', 43).forEach((l, i) => ink(l, x + 2, yy + i * 9, WIN.dim));
      ink('CASH RESERVE', x + 2, yy + 23); const r = stepper(x + 110, yy + 20, '', fmt((c.reserve || 3000000) / 1e6) + 'M', { w: 40 });
      if (r) c.reserve = clamp((c.reserve || 3000000) + r * 1000000, 0, 100000000);
      wrapT('Auto-order never spends below the reserve. Orders arrive at 6:00, sized to recent demand.', 43).forEach((l, i) => ink(l, x + 2, yy + 36 + i * 9, WIN.dim));
    } else {
      let xx = x; for (const k of CAT_IDS) { const l = CATS[k].n.slice(0, 3); if (btn(xx, y0, tw(l) + 6, l, { on: cat === k, h: 11 })) cat = k; xx += tw(l) + 7; }
      ink('ITEM', x + 2, y0 + 15, WIN.dim); ink('PRICE', x + 82, y0 + 15, WIN.dim); ink('DEMAND', x + 116, y0 + 15, WIN.dim); ink('TODAY', x + 158, y0 + 15, WIN.dim); ink('SH/BK', x + 192, y0 + 15, WIN.dim);
      const ps = carried(st).filter(p => PRODUCTS[p].cat === cat);
      ps.forEach((pid, i) => { const yy = y0 + 27 + i * 11, shelf = onHand(st, pid) - (st.back[pid] || 0);
        rectF(x + 2, yy, 5, 6, PCOL[pid][0]); ink(PRODUCTS[pid].n.slice(0, 12), x + 9, yy, sellable(st, pid) ? WIN.ink : WIN.shade);
        ink(fmt(priceOf(st, pid)), x + 82, yy); ink(fmt(st.sold[pid] || 0), x + 122, yy); ink(fmt(st.today[pid] || 0), x + 162, yy); ink(shelf + '/' + (st.back[pid] || 0), x + 192, yy); });
      // hourly sales today
      const gy = y + h - 46; ink('SALES BY HOUR, TODAY', x + 2, gy - 10, WIN.title); inset(x, gy, w, 42); const mx = Math.max(1, ...st.day.hr);
      st.day.hr.forEach((v, i) => { const bh = Math.round(v / mx * 34); rectF(x + 4 + i * 9, gy + 38 - bh, 7, bh, i === hourNow() ? WIN.red : WIN.title); if (i % 6 === 0) ink(String(i), x + 4 + i * 9, gy + 2, WIN.dim); });
    }
  } });
}
// ---------- staff ----------
function abilityRow(s, x, y) {
  [['REG', 'reg'], ['RST', 'rst'], ['SEC', 'sec'], ['CLN', 'cln'], ['SVC', 'svc']].forEach(([n, k], i) => { ink(n, x + i * 34, y, WIN.dim); bar(x + i * 34, y + 8, 30, s.ab[k] / 100); rectF(x + i * 34 + (capOf(s, k) * .3 | 0), y + 7, 1, 8, WIN.red); });
}
function openStaff(st) {
  openWin({ id: 'staff', title: 'STAFF: ' + storeName(st), x: 140, y: 18, w: 236, h: 196, body(win, x, y, w, h) {
    const sf = staffOf(st), cap = 1 + SIZES[st.size].staff;
    ink(sf.length + '/' + cap + ' JOBS.  WAGES ' + fmt(sf.reduce((t, s) => t + s.wage, 0) * openHours(st.hours)) + ' MC/DAY', x + 2, y + 2, WIN.dim);
    sf.forEach((s, i) => { const yy = y + 14 + i * 36; inset(x, yy, w, 34);
      ink(s.n + (s.mgr ? '  (MANAGER)' : ''), x + 4, yy + 3, s.mgr ? WIN.title : WIN.ink); ink(s.wage + '/HR', x + w - 50, yy + 3, WIN.dim);
      abilityRow(s, x + 4, yy + 13);
      if (st.chain === 0) { if (!s.mgr && btn(x + w - 70, yy + 20, 34, 'MGR', { h: 11, tip: 'The manager\'s EDU speeds up everyone\'s growth here.' })) { for (const o of sf) o.mgr = 0; s.mgr = 1; }
        if (btn(x + w - 34, yy + 20, 30, 'FIRE', { h: 11, tip: 'They can\'t be rehired for 6 months.' })) run(async () => { if (await msgBox('FIRE', 'Let ' + s.n + ' go? They can\'t be rehired for 6 months.', ['FIRE', 'KEEP'], { icon: iconWarn }) === 0) { fire(s.i); if (!staffOf(st).some(o => o.mgr) && staffOf(st)[0]) staffOf(st)[0].mgr = 1; } }); } });
    ink('Red tick = the most they can reach.', x + 2, y + h - 30, WIN.dim);
    if (st.chain === 0 && btn(x + 2, y + h - 16, w - 4, 'HIRE...', { h: 14, off: sf.length >= cap })) run(async () => { const ids = await hirePicker(cap - sf.length, false); for (const id of ids || []) hire(st, id); });
  } });
}
// pick people from the pool. The pool shows each person's limits (EDU, AGI, SOC), not how good they are today: as in the original.
function hirePicker(n, needMgr) {
  return new Promise(res => {
    const picked = []; let page = 0;
    openWin({ id: 'hire', title: 'HIRING  (PICK ' + n + ')', x: 70, y: 16, w: 372, h: 222, modal: 1, close: false, body(win, x, y, w, h) {
      const pool = freeStaff(), per = 8, pages = Math.ceil(pool.length / per);
      ink('NAME', x + 16, y + 2, WIN.dim); ink('EDU AGI SOC STA', x + 132, y + 2, WIN.dim); ink('WAGE/HR', x + 240, y + 2, WIN.dim);
      pool.slice(page * per, page * per + per).forEach((s, i) => { const yy = y + 13 + i * 18, on = picked.includes(s.i);
        if (rowHit(x, yy, w, 17)) { if (on) picked.splice(picked.indexOf(s.i), 1); else if (picked.length < n) picked.push(s.i); }
        inset(x, yy, w, 17); if (on) rectF(x + 2, yy + 2, w - 4, 13, mix(WIN.sel, WIN.field, .7));
        ink(on ? (picked[0] === s.i && needMgr ? 'M' : 'X') : '', x + 5, yy + 5, WIN.title);
        blit(person(s.look, 0, 0, '#808080', s.i * 7 + 3), x + 110, yy + 1);
        ink(s.n, x + 16, yy + 5); [s.edu, s.agi, s.soc, s.sta].forEach((v, k) => ink(String(v).padStart(3), x + 126 + k * 24, yy + 5, v >= 80 ? WIN.green : v < 40 ? WIN.red : WIN.ink));
        ink(String(s.wage), x + 246, yy + 5); });
      const by = y + h - 16;
      if (btn(x, by, 20, '<', { off: page === 0 })) page--; ink((page + 1) + '/' + Math.max(1, pages), x + 24, by + 3); if (btn(x + 50, by, 20, '>', { off: page >= pages - 1 })) page++;
      ink(needMgr ? 'FIRST PICK = MANAGER' : picked.length + ' PICKED', x + 76, by + 3, WIN.dim);
      if (btn(x + w - 120, by, 56, 'HIRE', { off: !picked.length || needMgr && picked.length < 2 })) { closeWin('hire'); res(picked.slice()); }
      if (btn(x + w - 60, by, 56, 'CANCEL')) { closeWin('hire'); res(null); }
    } });
  });
}
// ---------- building a store from a lot ----------
async function buildFlow(lotI) {
  closeWin('lot');
  const ok2 = !canBuild(0, lotI, 2) || chainSales(0) >= SIZES[2].unlock;
  const r = await msgBox('BUILD', ['Lot ' + mc(lotPrice(G.lots[lotI])) + '. Choose a store size.', 'SIZE 1: 10x7, 1 manager + 2 staff, ' + mc(buildCost(lotI, 1)), 'SIZE 2: 12x8, 1 manager + 3 staff, ' + mc(buildCost(lotI, 2)) + (chainSales(0) < SIZES[2].unlock ? ' (needs ' + mc(SIZES[2].unlock) + ' in sales)' : '')], ['SIZE 1', 'SIZE 2', 'CANCEL'], { icon: iconInfo, wrap: 60 });
  if (r === 2) return; const size = r + 1, why = canBuild(0, lotI, size); if (why) { sfx('bad'); return alertBox(why); }
  const ids = await hirePicker(1 + SIZES[size].staff, true); if (!ids) return;
  const e = openStore(0, lotI, size, ids); if (e) { sfx('bad'); return alertBox(e); }
  const st = G.stores[G.stores.length - 1]; sfx('cash'); goStore(st);
  if (!TUT.first) { TUT.first = 1; await firstStoreTalk(st); }
}

// ---------- the special powers ----------
function openPower(st) {
  let hr = 20;
  openWin({ id: 'power', title: MGRS[playerChain().mgr].power, x: 150, y: 24, w: 210, h: 150, body(win, x, y, w, h) {
    const c = playerChain();
    if (c.mgr === 'carl') {
      wrapT('Once a day, one rush shipment through the A.S.S. arrives right now, at 20% over the normal price. It still has to be carried to the shelves.', 33).forEach((l, i) => ink(l, x + 2, y + 2 + i * 9, WIN.dim));
      const all = autoOrder(st, BACKDOOR_MARKUP, null, 1), food = autoOrder(st, BACKDOOR_MARKUP, p => CATS[p.cat].life, 1);
      ink(c.usedPower ? 'USED TODAY.' : 'AVAILABLE.', x + 2, y + 48, c.usedPower ? WIN.red : WIN.green);
      if (btn(x + 2, y + 62, w - 4, 'EVERYTHING LOW  ' + mc(all), { off: c.usedPower || !all })) { const r = backdoor(st); if (r) alertBox(r); else sfx('crate'); }
      if (btn(x + 2, y + 76, w - 4, 'FOOD ONLY  ' + mc(food), { off: c.usedPower || !food, tip: 'Food covers only the rest of today. Leftovers are thrown out at 6:00.' })) { const r = backdoor(st, p => CATS[p.cat].life); if (r) alertBox(r); else sfx('crate'); }
    } else if (c.mgr !== 'ghost') POWERUI[c.mgr](st, x, y, w, h);
    else {
      wrapT('Once a day, a two-hour Grand Demonstration at the specialty display. Draws a crowd, mostly adventurers, and ties up one employee. Have stock and registers ready.', 33).forEach((l, i) => ink(l, x + 2, y + 2 + i * 9, WIN.dim));
      if (st.show) ink('SHOW TODAY AT ' + (Math.round((st.show.t0 % TPD) / 300)) + ':00', x + 2, y + 50, WIN.title);
      else { const r = stepper(x + 60, y + 50, 'START AT', hr + ':00', { w: 34 }); if (r) hr = clamp(hr + r, Math.max(0, hourNow() + 1), 22); }
      if (btn(x + 2, y + 70, w - 4, 'SCHEDULE  ' + mc(SHOW_COST), { off: c.usedPower || !!st.show || hourNow() >= 22 })) { const r = demonstrate(st, Math.max(hr, hourNow() + 1)); if (r) alertBox(r); else sfx('ok'); }
    }
  } });
}

// ---------- reports ----------
const LOSS_N = { missing: 'NOT CARRIED', empty: 'EMPTY SHELF', price: 'TOO EXPENSIVE', queue: 'LINE TOO LONG' };
function openReport(tab) {
  let t = tab;
  openWin({ id: 'report', title: 'REPORT', x: 120, y: 16, w: 270, h: 214, body(win, x, y, w, h) {
    t = tabs(x, y, ['TODAY', 'LAST MONTH', 'GOAL'], t); const y0 = y + 17;
    if (t === 0) { const st = curStore() && curStore().chain === 0 ? curStore() : storesOf(0)[0]; if (!st) return; const d = st.day;
      ink(storeName(st) + '  (SO FAR TODAY)', x + 2, y0, WIN.title);
      [['SALES', d.sales], ['GOODS SOLD AT COST', -d.cogs], ['WASTE', -d.waste], ['SHOPLIFTED', -d.theft]].forEach(([n, v], i) => { ink(n, x + 2, y0 + 12 + i * 10); ink(mc(v), x + 150, y0 + 12 + i * 10, v < 0 ? WIN.red : WIN.ink); });
      ink('CUSTOMERS SERVED ' + fmt(d.trips), x + 2, y0 + 56);
      lossList(d.lost, d.lostCat, x + 2, y0 + 70, w - 4);
      ink('WAGES AND POWER ARE BOOKED AT MIDNIGHT.', x + 2, y + h - 10, WIN.dim);
    } else if (t === 1) { const rep = G.lastRep; if (!rep) { ink('No month has closed yet.', x + 2, y0); return; } monthBody(rep, x, y0, w); }
    else { ink(GOALS[G.goal].n, x + 2, y0, WIN.title); wrapT(GOALS[G.goal].d, 42).forEach((l, i) => ink(l, x + 2, y0 + 12 + i * 9));
      const yy = y0 + 36;
      if (G.goal === 0) { ink('FOOTFALL', x + 2, yy); bar(x + 70, yy + 1, 180, population() / 20000); ink(fmt(population()) + ' / 20,000', x + 70, yy + 10, WIN.dim); ink('THEN ATTRACT THE TOWER: ' + mc(FACILITIES.tower.cost), x + 2, yy + 24, WIN.dim); }
      if (G.goal === 1) { ink('YOUR STORES ' + storesOf(0).length + ' / ' + STORE_CAP, x + 2, yy); ink('RIVAL STORES ' + liveStores().filter(s => s.chain).length, x + 2, yy + 10); wrapT('Buy rival stores out, or squeeze them until they close.', 42).forEach((l, i) => ink(l, x + 2, yy + 24 + i * 9, WIN.dim)); }
      if (G.goal === 2) { ink('OWNER RATING', x + 2, yy); stars(x + 90, yy - 1, ownerStars()); ink('STORES ' + storesOf(0).length + ' (NEED 3)', x + 2, yy + 14); ink('Security, cleanliness, service and popularity in every store.', x + 2, yy + 28, WIN.dim); }
      ink('MONOPOLY RATE  ' + (G.share === undefined ? '--' : Math.round(G.share * 100) + '%'), x + 2, yy + 50); ink('OWNER RATING', x + 2, yy + 62); stars(x + 90, yy + 61, ownerStars());
    }
  } });
}
function stars(x, y, n) { for (let i = 0; i < 5; i++) { const c = n >= i + 1 ? WIN.gold : n >= i + .5 ? mix(WIN.gold, WIN.shade, .5) : WIN.shade; polyF([[x + i * 12 + 5, y], [x + i * 12 + 7, y + 4], [x + i * 12 + 11, y + 4], [x + i * 12 + 8, y + 7], [x + i * 12 + 9, y + 11], [x + i * 12 + 5, y + 8], [x + i * 12 + 1, y + 11], [x + i * 12 + 2, y + 7], [x + i * 12 - 1, y + 4], [x + i * 12 + 3, y + 4]], c); } }
function lossList(lost, lostCat, x, y, w) {
  const ks = Object.keys(lost).sort((a, b) => lost[b] - lost[a]), big = ks[0];
  ink('CUSTOMERS LOST', x, y, WIN.title);
  ks.forEach((k, i) => { ink(LOSS_N[k], x, y + 11 + i * 10, k === big && lost[k] ? WIN.red : WIN.ink); ink(fmt(lost[k]), x + 110, y + 11 + i * 10, k === big && lost[k] ? WIN.red : WIN.ink); });
  const worst = Object.keys(lostCat || {}).sort((a, b) => lostCat[b] - lostCat[a])[0];
  if (worst && lostCat[worst]) { const [c, why] = worst.split(':'); ink('BIGGEST: ' + CATS[c].n + ', ' + LOSS_N[why], x, y + 55, WIN.red); }
}
function monthBody(rep, x, y, w) {
  const cr = rep.chains[0]; ink(MONTHS[rep.mo - 1] + ' Y' + rep.y + ' SETTLEMENT (4 SAMPLE DAYS x 8)', x + 2, y, WIN.title);
  ink('SALES', x + 2, y + 12); ink(mc(cr.sales), x + 130, y + 12);
  ink('OPERATING PROFIT', x + 2, y + 22); ink(mc(cr.op), x + 130, y + 22, cr.op < 0 ? WIN.red : WIN.green);
  ink('OTHER DAYS (ESTIMATED)', x + 2, y + 32, WIN.dim); ink(mc(cr.rest), x + 130, y + 32, WIN.dim);
  ink('ADS, SURVEYS, LOANS', x + 2, y + 42, WIN.dim); ink(mc(rep.stores.filter(s => s.chain === 0).reduce((t, s) => t + (s.m.other || 0), 0) + (cr.interest || 0) + (cr.contract || 0)), x + 130, y + 42, WIN.dim);
  ink('CASH NOW', x + 2, y + 51); ink(mc(playerChain().cash), x + 130, y + 51);
  ink('MONOPOLY RATE ' + Math.round(rep.share * 100) + '%   FOOTFALL ' + fmt(rep.pop), x + 2, y + 62); ink('OWNER RATING', x + 2, y + 72); stars(x + 80, y + 71, rep.stars);
  let yy = y + 88; const lost = { missing: 0, empty: 0, price: 0, queue: 0 }, lc = {}; let waste = 0, wages = 0;
  for (const s of rep.stores.filter(s => s.chain === 0)) { ink(s.name, x + 2, yy, WIN.dim); ink(mc(s.m.op), x + 130, yy, s.m.op < 0 ? WIN.red : WIN.ink); yy += 9; for (const k in lost) lost[k] += s.m.lost[k]; for (const k in s.m.lostCat) lc[k] = (lc[k] || 0) + s.m.lostCat[k]; waste += s.m.waste; wages += s.m.wages; if (yy > y + 120) break; }
  lossList(lost, lc, x + 2, yy + 4, w);
  ink('WASTE ' + mc(waste) + '  WAGES ' + mc(wages), x + 2, yy + 72, WIN.dim);
}
function openBank() {
  openWin({ id: 'bank', title: 'MALL BANK', x: 150, y: 40, w: 210, h: 132, body(win, x, y, w, h) {
    const c = playerChain(), lim = loanLimit(0), ln = c.loan || 0;
    ink('BORROWED', x + 2, y + 2); ink(mc(ln), x + 90, y + 2, ln ? WIN.red : WIN.ink);
    ink('LIMIT', x + 2, y + 12); ink(mc(lim), x + 90, y + 12, WIN.dim);
    ink('INTEREST', x + 2, y + 22); ink(Math.round(LOAN.rate * 100) + '% A MONTH', x + 90, y + 22, WIN.dim);
    wrapT('The bank lends half the value of the lots you own. Interest is paid at each settlement.', 33).forEach((l, i) => ink(l, x + 2, y + 38 + i * 9, WIN.dim));
    if (btn(x + 2, y + h - 30, 100, 'BORROW 10M', { off: ln + 10000000 > lim })) { const r = borrow(0, 10000000); if (r) alertBox(r); else sfx('cash'); }
    if (btn(x + 104, y + h - 30, 98, 'REPAY 10M', { off: !ln || c.cash < Math.min(ln, 10000000) })) { const r = repay(0, 10000000); if (r) alertBox(r); else sfx('ok'); }
    if (btn(x + 2, y + h - 15, 200, 'REPAY EVERYTHING', { off: !ln || c.cash < ln })) { const r = repay(0, ln); if (r) alertBox(r); else sfx('ok'); }
  } });
}
function onOffer(o) { const st = G.stores[o.si], buyer = G.chains[o.buyer]; run(async () => { const was = SPEED; SPEED = 0;
  const r = await msgBox('AN OFFER', [MGRS[buyer.mgr].n + ' wants to buy ' + storeName(st) + ' for ' + mc(o.price) + '.', 'It has lost money ' + st.losing + ' months running. Sell it?'], ['SELL', 'KEEP IT'], { icon: iconInfo });
  if (r === 0) { const e = buyout(o.buyer, o.si, o.price); if (e) alertBox(e); else sfx('cash'); } else news('YOU TURNED DOWN ' + MGRS[buyer.mgr].short + '\'S OFFER FOR ' + storeName(st) + '.'); SPEED = was; }); }
function onWage(s, ask) { run(async () => { const was = SPEED; SPEED = 0;
  const r = await msgBox('WAGE TALKS', [s.n + ' asks for a raise: ' + s.wage + ' -> ' + ask + ' MC an hour.', 'Say no and they quit.'], ['PAY IT', 'NO'], { icon: iconWarn });
  if (r === 0) { s.wage = ask; news(s.n + ' GOT A RAISE.'); } else { news(s.n + ' QUIT.'); s.st = -1; s.mgr = 0; } SPEED = was; }); }
// the nearest rival store (its prices are public: you can walk in and look)
function nearRival(st) { const l = G.lots[st.lot]; let best = null, bd = 11; for (const o of liveStores()) { if (o.chain === st.chain) continue; const l2 = G.lots[o.lot], d = Math.abs(l2.x - l.x) + Math.abs(l2.y - l.y); if (d < bd) { bd = d; best = o; } } return best; }
function openPromo() {
  openWin({ id: 'promo', title: 'PROMOTION', x: 96, y: 14, w: 320, h: 226, body(win, x, y, w, h) {
    const c = playerChain(), mine = storesOf(0);
    ink('AD', x + 2, y + 2, WIN.dim); ink('COST', x + 116, y + 2, WIN.dim); ink('POP', x + 170, y + 2, WIN.dim); ink('AIRS', x + 200, y + 2, WIN.dim);
    Object.entries(ADS).forEach(([id, a], i) => { const yy = y + 13 + i * 15;
      ink(a.n, x + 2, yy + 3); ink(fmt(a.cost / 1000) + 'K', x + 116, yy + 3); ink('+' + a.gain, x + 170, yy + 3, WIN.green);
      const at = adTime(a), dd = Math.floor(at / TPD) - Math.floor(G.tick / TPD); ink((dd === 0 ? 'TODAY ' : dd === 1 ? 'NEXT ' : 'DAY+2 ') + a.hr + ':00', x + 200, yy + 3, WIN.dim);
      if (btn(x + w - 40, yy, 36, 'BUY', { off: c.cash < a.cost || !mine.length, tip: a.d + ' Every one of your stores gets +' + a.gain + ' popularity (max 100).' })) { const r = buyAd(0, id); if (r) alertBox(r); else sfx('cash'); } });
    let yy = y + 13 + 5 * 15 + 4;
    const pend = (G.ads || []).filter(a => a.chain === 0);
    ink('BOOKED: ' + (pend.length ? pend.map(a => a.id === 'idol' ? 'IDOL' : ADS[a.id].n.replace('MALL ', '')).join(', ') : 'NOTHING'), x + 2, yy, pend.length ? WIN.title : WIN.dim); yy += 13;
    ink('POPULARITY', x + 2, yy, WIN.title); yy += 10;
    for (const st of mine.slice(0, 4)) { ink(storeName(st).replace(MGRS[c.mgr].short + ' ', ''), x + 2, yy); bar(x + 40, yy + 1, 120, st.rate.pop / 100, st.rate.pop < 40 ? WIN.red : WIN.title); ink(String(st.rate.pop), x + 166, yy); yy += 10; }
    const rv = liveStores().filter(s => s.chain); if (rv.length) { const p = Math.round(rv.reduce((t, s) => t + s.rate.pop, 0) / rv.length); ink('RIVAL', x + 2, yy, WIN.dim); bar(x + 40, yy + 1, 120, p / 100, WIN.shade); ink(String(p), x + 166, yy, WIN.dim); yy += 10; }
    yy += 3; ink('VISITORS ' + fmt(G.pvisits || 0) + ' / ' + fmt(IDOL_AT) + (G.idol ? '  IDOL DONE' : '  -> FREE IDOL'), x + 2, yy, WIN.dim);
    wrapT('Popularity brings shoppers in from farther away. It fades back to what customers think of the store.', 52).forEach((l, i) => ink(l, x + 2, y + h - 19 + i * 9, WIN.dim));
  } });
}
function openNews() {
  openWin({ id: 'news', title: 'MALL BULLETIN', x: 100, y: 30, w: 312, h: 150, body(win, x, y, w, h) {
    NEWS.slice(0, 13).forEach((n, i) => ink(n.s.slice(0, 50), x + 2, y + 2 + i * 10, i ? WIN.ink : WIN.title)); } });
}
function openHelp() {
  const L = ['MAP: click a lot to buy it and build. Busy corridors (FOOTFALL) send more shoppers. Rival stores nearby split them.',
    'STORE: click a shelf to see why it is empty: nothing ordered, stock in the back, or nobody free to carry it. Click a person to see what they want.',
    'SHELVES: every shelf has 3 facings and there are always more products than room. Click a facing in the store to choose what goes there. Run a CUSTOMER SURVEY (STOCK menu) to learn what people come in for, including what you don\'t carry. Tastes shift with seasons and new releases.',
    'STOCK: set the markup per category. A rival next door that is cheaper will take your customers; alone, you can charge more. Orders arrive at 6:00; yesterday\'s food is thrown out first.',
    'PROMO: ads lift every store\'s popularity, which pulls shoppers from farther away and fades over time. Your 10,000th customer brings a free idol appearance.',
    'STAFF: the hiring list shows limits, not skill. Skill grows with work. A smart manager makes everyone learn faster.',
    'TIME: each month plays four sample days. The settlement counts the other days from them. Events (conventions, tournaments, late deliveries) are announced a month ahead.',
    'STORE: permits for medicine, tobacco and alcohol; each blocks rivals nearby. Plants, benches and fountains raise service. Grow a store on its lot once sales allow. REPORT > BANK lends against your lots.',
    'BUILD opens the layout editor (the game pauses). Every shelf needs a reachable side, and registers need room behind.',
    'Keyboard: arrows move the pointer, Z clicks, X right-clicks.'];
  openWin({ id: 'help', title: 'HOW TO PLAY', x: 60, y: 20, w: 392, h: 200, body(win, x, y) { let yy = y + 2; for (const p of L) { for (const l of wrapT(p, 62)) { ink(l, x + 2, yy); yy += 9; } yy += 4; } } });
}

// ---------- sim hooks ----------
let saleSnd = 0;
function onSale(st, rev) { if (curStore() === st && frame - saleSnd > 20) { saleSnd = frame; sfx('reg'); } }
function onNews() {}
function onSurvey(st) { if (st.chain !== 0) return; news('SURVEY RESULTS ARE IN FOR ' + storeName(st) + '.'); run(async () => { SPEED = 0; if (await msgBox('SURVEY', ['The survey results for ' + storeName(st) + ' are in.'], ['SHOW ME', 'LATER'], { icon: iconInfo }) === 0) openSurvey(st); }); }
function openSurvey(st) {
  let cat = 'bento';
  openWin({ id: 'survey', title: 'CUSTOMER SURVEY: ' + storeName(st), x: 120, y: 14, w: 280, h: 228, body(win, x, y, w, h) {
    if (st.chain !== 0) { ink('Not your store.', x + 2, y + 2); return; }
    const sv = st.survey;
    if (st.surveyNext || st.surveyOn) ink(st.surveyOn ? 'SURVEY RUNNING TODAY. RESULTS TONIGHT.' : 'SURVEY BOOKED FOR TOMORROW.', x + 2, y + 2, WIN.title);
    else if (btn(x + 2, y, w - 4, 'RUN A SURVEY TOMORROW  ' + mc(SURVEY_COST), { tip: 'Staff ask every customer for a full day what they came in for, including things you don\'t sell.' })) { const r = orderSurvey(st); if (r) alertBox(r); else sfx('ok'); }
    if (!sv) { wrapT('No survey yet. POS data only shows what you already sell. A survey shows what people actually wanted, including things you don\'t carry. Tastes change with the seasons and new releases, so old surveys go stale.', 44).forEach((l, i) => ink(l, x + 2, y + 20 + i * 9, WIN.dim)); return; }
    ink('RESULTS FROM ' + MONTHS[sv.mo - 1] + ' ' + sv.day + ' Y' + sv.y + (G.months - sv.months > 1 ? '  (GETTING OLD)' : ''), x + 2, y + 16, G.months - sv.months > 1 ? WIN.red : WIN.dim);
    let xx = x; for (const k of CAT_IDS) { const l = CATS[k].n.slice(0, 3); if (btn(xx, y + 27, tw(l) + 6, l, { on: cat === k, h: 11 })) cat = k; xx += tw(l) + 7; }
    const ps = catalogue(st, cat), tot = ps.reduce((t, p) => t + (sv.want[p.id] || 0), 0), have = rangeOf(st);
    ink('WHAT THEY CAME IN FOR', x + 2, y + 42, WIN.title); ink('ASKED', x + 150, y + 42, WIN.dim); ink('STOCKED?', x + 210, y + 42, WIN.dim);
    ps.slice().sort((a, b) => (sv.want[b.id] || 0) - (sv.want[a.id] || 0)).slice(0, 12).forEach((p, i) => { const yy = y + 53 + i * 10, v = tot ? (sv.want[p.id] || 0) / tot : 0;
      ink(p.n.slice(0, 18), x + 2, yy); bar(x + 112, yy + 1, 34, v * 2.5, WIN.title); ink(Math.round(v * 100) + '%', x + 150, yy);
      ink(have.p[p.id] ? 'YES' : 'NO', x + 214, yy, have.p[p.id] ? WIN.green : (v > .1 ? WIN.red : WIN.dim)); });
    const segs = Object.entries(sv.seg).sort((a, b) => b[1] - a[1]), st0 = segs.reduce((t, s) => t + s[1], 0);
    ink('WHO CAME IN: ' + segs.slice(0, 2).map(([g, n]) => SEGS[g].n.split(' ')[0] + ' ' + Math.round(n / st0 * 100) + '%').join(', '), x + 2, y + h - 10, WIN.dim);
  } });
}
function onDayEnd() { if (storesOf(0).length) saveDay = 1; }
let saveDay = 0;
function onSettle(rep) {
  SKIPPING = 0; SPEED = 0; music('settle');
  try { localStorage.setItem('kw_save', DAYSNAP || serial()); } catch (e) {}
  run(async () => {
    await new Promise(res => openWin({ id: 'settle', title: 'MONTH-END SETTLEMENT', x: 110, y: 14, w: 290, h: 226, modal: 1, close: false, body(win, x, y, w, h) {
      monthBody(rep, x, y, w); if (btn(x + w - 70, y + h - 15, 68, 'OK')) { closeWin('settle'); res(); } } }));
    music(curStore() ? chainOf(curStore()).mgr : 'mall');
    monthTalk(rep);
  });
}
function onWin() { run(async () => { SPEED = 0; music('title'); await msgBox('GOAL REACHED', [GOALS[G.goal].n + '!', 'The wing is yours. ' + TALK[playerChain().mgr].win, 'You can keep playing.'], ['KEEP PLAYING'], { icon: iconInfo }); }); }

// ---------- what the managers say (new writing; voices per the bibles) ----------
async function firstStoreTalk(st) { const T = TALK[playerChain().mgr]; await talkList(T.first, T.mood); SPEED = 1; }
async function monthTalk(rep) {
  const T = TALK[playerChain().mgr], cr = rep.chains[0], who = BOSS();
  let worst = null; for (const s of rep.stores.filter(s => s.chain === 0)) for (const k in s.m.lost) if (!worst || s.m.lost[k] > worst[1]) worst = [k, s.m.lost[k]];
  await say(cr.op < 0 ? T.loss : T.profit, who, { mood: T.mood });
  if (worst && worst[1] > 0) await say(T.why[worst[0]], who, { mood: T.mood });
}
function tutorial() {}

// ---------- title and new game ----------
const KANA = { // a few hand-made glyphs for the title (the Japanese release name)
  ko: [31, 1, 1, 1, 1, 1, 31], n: [16, 8, 1, 1, 2, 4, 24], bi: [21, 16, 28, 16, 16, 17, 14], ni: [0, 14, 0, 0, 0, 31, 0],
  u: [4, 31, 17, 1, 2, 4, 8], o: [0, 2, 31, 6, 10, 18, 2], dash: [0, 0, 0, 31, 0, 0, 0], zu: [5, 31, 1, 2, 4, 10, 17],
};
function bigText(s, x, y, k, c, sh) { let xx = x; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) { if (sh) rectF(xx + i * k + 2, y + j * k * 1.5 + 2, k, k * 1.5, sh); rectF(xx + i * k, y + j * k * 1.5, k, k * 1.5, c); } xx += 6 * k; } }
function kana(list, x, y, k, c) { let xx = x; for (const n of list) { const g = KANA[n]; for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) rectF(xx + i * k, y + j * k * 1.5, k, k * 1.5, c); xx += 6 * k; } }
const title = {
  t: 0,
  update() { this.t++; resolveOwner(); },
  draw() {
    const t = this.t;
    if (t < 150) { // the setup screen that runs on every boot, because it was never taken out
      rectF(0, 0, W, H, WIN.desk); bevel(106, 70, 300, 96); gradH(109, 73, 294, 11, WIN.title, WIN.title2); text('KONBINI WARS SETUP', 113, 75, WIN.lite, 0);
      ink('Copying files to C:\\KW ...', 118, 96); ink(['MALL.DAT', 'KONBINI.EXE', 'FMDRV.SYS', 'ENGPATCH.DAT', 'CARL.PIC', 'GHOST.PIC', 'LINDA.PIC', 'FACE.PIC', 'YOKO.PIC', 'JB.PIC'][Math.min(9, t / 15 | 0)], 118, 108, WIN.dim);
      inset(118, 124, 276, 12); rectF(120, 126, Math.min(272, t * 2), 8, WIN.title); ink('ENGLISH PATCH v0.9', 118, 146, WIN.dim);
      CURSOR = 'wait'; drawWins(); return;
    }
    gradV(0, 0, W, H, C('#0a2a6a'), C('#1a6aa8'), 12);
    for (let i = 0; i < 40; i++) { const x = (i * 97 + t * (1 + i % 3)) % (W + 40) - 20, y = 20 + (i * 53) % 200; rectF(x, y, 6, 4, i % 2 ? C('#f0d040') : C('#38c8a0')); }
    text('PRETEND CO. SOFT PRESENTS', 180, 22, C('#c0d8ff'), INKC);
    text('MALL OF THE FUTURE', 202, 44, C('#ffffff'), INKC);
    bigText('KONBINI', 81, 60, 5, C('#ffd040'), INKC); bigText('WARS', 311, 60, 5, C('#38e8b0'), INKC);
    kana(['ko', 'n', 'bi', 'ni', 'u', 'o', 'dash', 'zu'], 196, 132, 2, C('#ffffff'));
    MGR_IDS.forEach((m, i) => blit(bossSprite(m), (i < 3 ? 70 + i * 34 : 340 + (i - 3) * 34), 152 + ((m === 'ghost' || m === 'face') ? Math.sin(t * .08 + i) * 3 | 0 : 0)));
    text('ENGLISH PATCH v0.9  (C)1998 PRETEND CO. SOFT', 120, 236, C('#a0c0e0'), INKC);
    CURSOR = 'arrow';
    if (!WINS.length) {
      bevel(196, 176, 120, 50);
      if (btn(202, 182, 108, 'NEW GAME')) run(newGameFlow);
      if (btn(202, 198, 108, 'CONTINUE', { off: !fetchStore('kw_save') })) { if (loadGame()) { scene = main; VIEW = { kind: 'map' }; music('mall'); } }
      if (btn(202, 212 - 0, 108, 'HOW TO PLAY', { h: 10 })) openHelp();
    }
    drawWins();
  },
};
const PICK = { carl: 'Travelers, rush deliveries. Recommended first.', ghost: 'Adventurers, night trade, big shows.', linda: 'Premium goods, brand contracts, high margins.',
  face: 'Students, new ideas, test batches.', yoko: 'Everyday needs, kits, careful service.', jb: 'Night regulars, coffee, investigations.' };
async function newGameFlow() {
  const mgr = await new Promise(res => openWin({ id: 'pick', title: 'CHOOSE YOUR MANAGER', x: 16, y: 14, w: 480, h: 226, modal: 1, close: false, body(win, x, y, w, h) {
    MGR_IDS.forEach((id, i) => { const M = MGRS[id], xx = x + (i % 3) * 158, yy = y + (i / 3 | 0) * 103; inset(xx, yy, 154, 100); copyBuf(portrait(PORTKEY[id], TALK[id].mood), xx + 3, yy + 3);
      ink(M.n.replace('CEO ', ''), xx + 55, yy + 4, WIN.title); wrapT(M.store, 16).forEach((l, k) => ink(l, xx + 55, yy + 14 + k * 9)); wrapT(PICK[id], 16).forEach((l, k) => ink(l, xx + 55, yy + 34 + k * 9, WIN.dim));
      if (btn(xx + 4, yy + 84, 146, 'PLAY ' + M.n.replace('CEO ', '').replace('THE ', ''), {})) { closeWin('pick'); res(id); } });
  } }));
  const rivals = [NATURAL_RIVAL[mgr]];
  await new Promise(res => openWin({ id: 'rivals', title: 'WHO ELSE OPENS IN THE WING?', x: 96, y: 30, w: 320, h: 160, modal: 1, close: false, body(win, x, y, w, h) {
    ink('PICK 1 TO 3 RIVAL CHAINS.', x + 2, y + 2, WIN.dim);
    MGR_IDS.filter(m => m !== mgr).forEach((m, i) => { const yy = y + 14 + i * 18, on = rivals.includes(m);
      if (rowHit(x, yy, w, 17)) { if (on && rivals.length > 1) rivals.splice(rivals.indexOf(m), 1); else if (!on && rivals.length < 3) rivals.push(m); }
      inset(x, yy, w, 17); if (on) rectF(x + 2, yy + 2, w - 4, 13, mix(WIN.sel, WIN.field, .7)); ink(on ? 'X' : '', x + 5, yy + 5, WIN.title);
      blit(bossSprite(m), x + 16, yy - 2); ink(MGRS[m].n, x + 34, yy + 5); ink(MGRS[m].store, x + 130, yy + 5, WIN.dim); });
    if (btn(x + w - 70, y + h - 15, 66, 'OK')) { closeWin('rivals'); res(); }
    ink(rivals.length === 1 ? 'ONE RIVAL: GENTLE' : rivals.length === 2 ? 'TWO RIVALS' : 'THREE RIVALS: HARD', x + 2, y + h - 12, WIN.dim);
  } }));
  const g = await new Promise(res => openWin({ id: 'goal', title: 'CHOOSE THE GOAL', x: 106, y: 50, w: 300, h: 110, modal: 1, close: false, body(win, x, y, w, h) {
    GOALS.forEach((gg, i) => { if (btn(x + 2, y + 2 + i * 28, 90, gg.n, { h: 24 })) { closeWin('goal'); res(i); } wrapT(gg.d, 32).forEach((l, k) => ink(l, x + 98, y + 4 + i * 28 + k * 9, WIN.dim)); });
  } }));
  newWorld(mgr, g, rivals); NEWS.length = 0; TUT = {}; SPEED = 0; SKIPPING = 0; WINS.length = 0; VIEW = { kind: 'map' }; scene = main; music('mall');
  const T = TALK[mgr]; await talkList(T.intro, T.mood);
}
async function toTitle() { WINS.length = 0; title.t = 150; scene = title; music('title'); }

function boot() {
  fit(); scene = title; title.t = 0; music('title'); requestAnimationFrame(loop);
}
boot();
