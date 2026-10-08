'use strict';
// ================= KONBINI WARS: the simulation (no drawing; runs headless in tools/kwsim.js) =================
// Time: each month plays 4 sample days (the 3rd, 10th, 17th, 24th) of 7200 ticks each; the month-end settlement books
// the other days as 7x each sample day's operating profit (The Conveni 3's "4 days x 8"). Every store, the player's and the
// rivals', runs the same agent simulation all the time, on screen or not.
const TPD = 7200, MPT = 1440 / TPD;          // ticks per day, sim minutes per tick
const SAMPLE_DAYS = [3, 10, 17, 24];
const SHOP = 1.6;
const REP = 4;                               // each little customer on screen stands for 4 real ones (units, money, and trips all count x4)                             // share of passing footfall that makes a konbini trip
const MED_RANGE = 8, MED_FEE = 10000000;     // medicine permit: exclusion range in squares, fee
const SHOW_COST = 20000, BACKDOOR_MARKUP = 1.2;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

let G = null;
const NEWS = [];                     // bulletin lines {t, s}
function news(s) { NEWS.unshift({ t: G ? G.tick : 0, s }); if (NEWS.length > 40) NEWS.pop(); if (typeof onNews === 'function') onNews(s); }
const FX = (st, k, a, b) => { if (typeof onFx === 'function') onFx(st, k, a, b); }; // effects only: kwfx.js listens
const fmt = n => { const s = String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (n < 0 ? '-' : '') + s; };
const mc = n => fmt(n) + ' MC';
const rr = (a, b) => a + Math.random() * (b - a);
function wpick(o) { let t = 0; for (const k in o) t += o[k]; let r = Math.random() * t; for (const k in o) { r -= o[k]; if (r <= 0) return k; } return Object.keys(o)[0]; }

// ---------- world ----------
function newWorld(mgr, goal, rivals) {
  rivals = rivals && rivals.length ? rivals : [NATURAL_RIVAL[mgr]];
  G = { y: 1, mo: 4, d: 0, tick: 0, goal, months: 0, over: 0, won: 0, poor: 0,
    chains: [{ id: 0, mgr, cash: 200000000, player: 1, usedPower: 0 }].concat(rivals.map((r, i) => ({ id: i + 1, mgr: r, cash: 200000000, player: 0, usedPower: 0 }))),
    stores: [], lots: LOTS.map(([x, y], i) => ({ i, x, y, st: -1 })), fac: {}, weather: 'SUNNY',
    staff: STAFF_POOL.map(([n, look, sta, edu, agi, soc, wage], i) => {
      const roll = cap => Math.round(cap * rr(.2, .7));
      return { i, n, look, sta, edu, agi, soc, wage, st: -1, banned: 0, ab: { reg: roll(edu), rst: roll(agi), sec: roll(edu), cln: roll(soc), svc: roll(soc) } };
    }),
    foot: null, mix: null, month: { trips: {} }, hist: [], boost: {} };
  buildFoot();
  rollWeather();
  return G;
}
const chainOf = st => G.chains[st.chain];
const playerChain = () => G.chains[0];
const storesOf = c => G.stores.filter(s => s.chain === c && !s.closed);
const liveStores = () => G.stores.filter(s => !s.closed);

// ---------- the mall map: footfall and customer mix per square ----------
const corridor = (x, y) => x >= 0 && y >= 0 && x < MW && y < MH && MALL_ROWS[y][x] !== '#';
function buildFoot() {
  G.foot = []; G.mix = [];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const c = MALL_ROWS[y][x]; G.foot.push(c === '=' ? 50 : c === '.' ? 25 : 0); G.mix.push(Object.assign({}, districtOf(x).mix));
  }
}
function lotDoor(lot) { // the corridor square in front of a 2x2 block
  for (const [dx, dy] of [[0, 2], [1, 2], [0, -1], [1, -1], [-1, 0], [2, 0], [-1, 1], [2, 1]]) if (corridor(lot.x + dx, lot.y + dy)) return [lot.x + dx, lot.y + dy];
  return [lot.x, lot.y];
}
const population = () => Math.round(G.foot.reduce((a, b) => a + b, 0));
function spreadFoot(cx, cy, total, r, mix) { // add footfall around a point, closer squares get more
  const sq = []; let wsum = 0;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { if (!corridor(x, y)) continue; const d = Math.abs(x - cx) + Math.abs(y - cy); if (d > r) continue; const w = Math.exp(-d / (r / 2)); sq.push([y * MW + x, w]); wsum += w; }
  for (const [i, w] of sq) { const add = total * w / wsum; G.foot[i] += add;
    if (mix) { const m = G.mix[i], k = add / Math.max(1, G.foot[i]) * 2; for (const s in mix) m[s] = (m[s] || 0) + mix[s] * k * 3; } }
}
function localFoot(lot, r = 4) { const [dx, dy] = lotDoor(lot); let t = 0; for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (Math.abs(x - dx) + Math.abs(y - dy) <= r) t += G.foot[y * MW + x]; return t; }
const lotPrice = lot => Math.round((5000000 + localFoot(lot) * 9000) * (1 + .03 * G.months) / 100000) * 100000;

// ---------- facilities ----------
function canAttract(id) { const f = FACILITIES[id]; if (G.fac[id]) return 'ALREADY HERE'; if (population() < f.pop) return 'NEEDS ' + fmt(f.pop) + ' FOOTFALL'; return ''; }
function attract(chain, id) {
  const f = FACILITIES[id], c = G.chains[chain], why = canAttract(id); if (why) return why; if (c.cash < f.cost) return 'NOT ENOUGH MONEY';
  c.cash -= f.cost; G.fac[id] = { by: chain, mo: G.months }; spreadFoot(f.at[0] + 1, f.at[1], f.add, f.r, f.mix);
  news(MGRS[c.mgr].short + ' BROUGHT THE ' + f.n + ' TO THE MALL.');
  if (f.goal && chain === 0 && G.goal === 0) win();
  return '';
}

// ---------- stores ----------
function storeName(st) { const n = storesOf(st.chain).indexOf(st); return MGRS[chainOf(st).mgr].short + ' #' + (st.num || 1); }
function canBuild(chain, lotI, size) {
  const lot = G.lots[lotI], c = G.chains[chain];
  if (lot.st >= 0) return 'LOT TAKEN';
  if (liveStores().length >= STORE_CAP) return 'THE MALL ALLOWS ' + STORE_CAP + ' STORES';
  const sz = SIZES[size]; if (!sz) return 'NO SUCH SIZE';
  if (chainSales(chain) < sz.unlock) return 'SIZE ' + size + ' NEEDS ' + mc(sz.unlock) + ' IN SALES';
  if (c.cash < buildCost(lotI, size)) return 'NOT ENOUGH MONEY';
  return '';
}
const layoutCost = size => LAYOUTS[size].reduce((t, f) => t + FIX[f[0]].cost, 0);
const buildCost = (lotI, size) => lotPrice(G.lots[lotI]) + SIZES[size].cost + layoutCost(size);
function chainSales(chain) { return G.stores.filter(s => s.chain === chain).reduce((t, s) => t + s.life.sales, 0); }
function openStore(chain, lotI, size, hires) {
  const why = canBuild(chain, lotI, size); if (why) return why;
  const c = G.chains[chain], lot = G.lots[lotI], sz = SIZES[size];
  c.cash -= buildCost(lotI, size);
  const st = { i: G.stores.length, chain, lot: lotI, size, fw: sz.fw, fh: sz.fh, hours: 0, permit: {}, closed: 0,
    num: G.stores.filter(s => s.chain === chain).length + 1,
    margin: {}, fix: [], back: {}, sold: {}, dirt: new Float32Array(sz.fw * sz.fh), rate: { sec: 40, cln: 80, svc: 50, pop: 45 },
    day: null, days: [], life: { sales: 0 }, losing: 0, lastMonth: null, show: null, flash: [] };
  for (const k of CAT_IDS) st.margin[k] = MGRS[c.mgr].margin;
  for (const [k, x, y, d] of LAYOUTS[size]) st.fix.push(newFix(k, x, y, d, c.mgr));
  defaultRange(st);
  lot.st = st.i; G.stores.push(st);
  newDay(st);
  for (const id of hires || []) hire(st, id);
  // opening stock: shelves full, a bit in the back
  for (const f of st.fix) f.p.forEach((pid, j) => { if (pid && sellable(st, pid)) { const n = CATS[PRODUCTS[pid].cat].life ? 8 : FACE_CAP; f.n[j] = n; payStock(st, pid, n); } });
  for (const pid of carried(st)) { st.back[pid] = 6; payStock(st, pid, 6); st.sold[pid] = 6; }
  news(MGRS[c.mgr].short + ' OPENED A STORE IN THE ' + districtOf(lot.x).n + '.');
  catchment(); estimateDemand(st);
  if (c.player === 1 && G.goal === 1 && storesOf(0).length >= STORE_CAP) win();
  return '';
}
function newFix(k, x, y, d, mgr) {
  const f = { k, x, y, d, p: [], n: [] }, cat = FIX[k].cat;
  if (cat) { const ps = prodsIn(cat, mgr, G ? G.months : 0); for (let j = 0; j < FACINGS; j++) { f.p.push(ps.length ? ps[j % ps.length].id : null); f.n.push(0); } }
  return f;
}
// a new store fills each category's facings in catalogue order: a guess, not a plan
function defaultRange(st) { const mgr = chainOf(st).mgr; for (const cat of CAT_IDS) { const ps = prodsIn(cat, mgr, G.months); let k = 0; for (const f of st.fix) if (FIX[f.k].cat === cat) for (let j = 0; j < FACINGS; j++) f.p[j] = ps.length ? ps[k++ % ps.length].id : null; } }
const sellable = (st, pid) => { const p = PRODUCTS[pid]; return !p.permit || st.permit[p.permit]; };
function carried(st) { const s = new Set(); for (const f of st.fix) for (const p of f.p) if (p) s.add(p); return [...s]; }
const unitCost = (st, pid) => { const p = PRODUCTS[pid], c = chainOf(st); return c.contract && (p.mgr === 'linda' || p.tags.includes('premium')) ? p.cost * (1 - CONTRACT.cut) : p.cost; };
const priceOf = (st, pid) => Math.round(PRODUCTS[pid].cost * (1 + st.margin[PRODUCTS[pid].cat]) / 10) * 10;
function payStock(st, pid, n, k = 1) { const c = chainOf(st), cost = unitCost(st, pid) * n * k; c.cash -= cost; st.day.orders += cost; }

function hire(st, id) {
  const s = G.staff[id]; if (s.st >= 0 || s.banned > G.months) return 'NOT AVAILABLE';
  const cap = 1 + SIZES[st.size].staff; if (staffOf(st).length >= cap) return 'STORE IS FULL';
  s.st = st.i; s.mgr = staffOf(st).length === 1; return '';
}
function fire(id) { const s = G.staff[id]; s.st = -1; s.mgr = 0; s.banned = G.months + 6; }
const staffOf = st => G.staff.filter(s => s.st === st.i);
const managerOf = st => staffOf(st).find(s => s.mgr) || staffOf(st)[0];
function capOf(s, k) { return k === 'reg' || k === 'sec' ? s.edu : k === 'rst' ? s.agi : s.soc; }
function grow(st, s, k, amt) { const m = managerOf(st); s.ab[k] = Math.min(capOf(s, k), s.ab[k] + amt * (.5 + (m ? m.edu : 50) / 100)); }

function getPermit(st) {
  const c = chainOf(st); if (st.permit.med) return 'ALREADY HELD';
  const lot = G.lots[st.lot];
  for (const o of liveStores()) if (o.chain !== st.chain && o.permit.med) { const l2 = G.lots[o.lot]; if (Math.abs(l2.x - lot.x) + Math.abs(l2.y - lot.y) <= MED_RANGE) return 'TOO CLOSE TO ' + storeName(o); }
  if (c.cash < MED_FEE) return 'NOT ENOUGH MONEY';
  c.cash -= MED_FEE; st.permit.med = 1; st.day.capex += MED_FEE; return '';
}

// ---------- layout: grid, validation, path fields ----------
const doorX = st => st.fw >> 1, backX = st => (st.fw >> 1) - 1;
function blockedGrid(st) { const g = new Uint8Array(st.fw * st.fh); for (const f of st.fix) g[f.y * st.fw + f.x] = 1; return g; }
const accessOf = f => [f.x + DIRS[f.d][0], f.y + DIRS[f.d][1]];
const staffSpot = f => [f.x - DIRS[f.d][0], f.y - DIRS[f.d][1]];
function field(st, tx, ty) {
  st.cache = st.cache || {}; const key = tx + ',' + ty; if (st.cache[key]) return st.cache[key];
  const b = st.blk || (st.blk = blockedGrid(st)), w = st.fw, h = st.fh, F = new Int16Array(w * h).fill(-1);
  if (tx < 0 || ty < 0 || tx >= w || ty >= h || b[ty * w + tx]) return (st.cache[key] = F);
  const q = [tx, ty]; F[ty * w + tx] = 0;
  for (let i = 0; i < q.length; i += 2) { const x = q[i], y = q[i + 1], d = F[y * w + x];
    for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h || b[ny * w + nx] || F[ny * w + nx] >= 0) continue; F[ny * w + nx] = d + 1; q.push(nx, ny); } }
  return (st.cache[key] = F);
}
function relayout(st) { st.blk = null; st.cache = null; }
// after the layout changes mid-day: everybody re-plans (queues and jobs point at fixture indexes)
function layoutChanged(st) {
  relayout(st); const old = st.q; st.q = st.fix.map(() => []); st.claim = {};
  for (const a of st.agents) {
    if (a.s) { if (a.carry && a.job) { const pid = a.jobPid; if (pid) st.back[pid] = (st.back[pid] || 0) + a.carry; } a.carry = 0; a.job = null; a.st = a.st === 'break' ? 'break' : 'idle'; continue; }
    if (['go', 'browse'].includes(a.st)) a.st = 'next';
    if (['walkreg', 'queue', 'toreg'].includes(a.st)) a.st = 'toreg';
    if (a.fix && !st.fix.includes(a.fix)) a.fix = null;
  }
  catchment();
}
function checkLayout(st) {
  relayout(st); const b = blockedGrid(st), w = st.fw, ok = (x, y) => x >= 0 && y >= 0 && x < w && y < st.fh && !b[y * w + x];
  if (!ok(doorX(st), st.fh - 1)) return 'THE DOOR IS BLOCKED';
  if (!ok(backX(st), 0)) return 'THE BACKROOM DOOR IS BLOCKED';
  const F = field(st, doorX(st), st.fh - 1), B = field(st, backX(st), 0);
  if (!st.fix.some(f => f.k === 'reg')) return 'THE STORE NEEDS A REGISTER';
  for (const f of st.fix) { const [ax, ay] = accessOf(f);
    if (!ok(ax, ay) || F[ay * w + ax] < 0) return FIX[f.k].n + ' CAN\'T BE REACHED';
    if (f.k === 'reg') { const [sx, sy] = staffSpot(f); if (!ok(sx, sy) || B[sy * w + sx] < 0) return 'NO ROOM BEHIND THE REGISTER'; } }
  return '';
}

function estimateDemand(st) { // units per day per carried product, from the catchment and the hidden wants
  const have = rangeOf(st), per = {};
  for (const g in st.e) { const W = SEGS[g].want; let t = 0; for (const c in W) t += W[c]; if (!t || !st.e[g]) continue;
    for (const c in W) { const ps = catalogue(st, c); let tot = 0, got = 0; for (const p of ps) { const w = prodWeight(p, g); tot += w; if (have.p[p.id]) got += w; } if (!got) continue;
      for (const p of ps) if (have.p[p.id]) { const w = prodWeight(p, g); per[p.id] = (per[p.id] || 0) + st.e[g] * 2.2 * W[c] / t * (w + (tot - got) * SUBST * w / got) / tot * (c === 'spec' ? .5 : 1); } } }
  for (const p in per) st.sold[p] = Math.max(4, Math.round(per[p]));
}
// ---------- what people want: every customer comes in for one particular product ----------
// Popularity is hidden. POS data only shows what you sell; a survey shows what people asked for.
const SEASON = () => G.mo >= 6 && G.mo <= 9 ? 'S' : G.mo >= 11 || G.mo <= 2 ? 'W' : '';
function popNow(p) { let v = p.pop; if (p.launch) v *= 1 + 1.6 * Math.exp(-(G.months - p.launch) / 2.5); if (p.tags.includes('fade')) v *= Math.pow(.94, Math.max(0, G.months - p.launch)); return v * ((G.boost || {})[p.id] || 1); }
function prodWeight(p, g, hr) {
  let w = Math.pow(popNow(p), 2.2); // steep: the hits really are hits
  for (const t of p.tags) { const f = TAGFIT[t]; if (f) w *= f[g] || 1; }
  const se = SEASON(); if (p.tags.includes('S')) w *= se === 'S' ? 2 : se === 'W' ? .3 : 1; if (p.tags.includes('W')) w *= se === 'W' ? 2.2 : se === 'S' ? .25 : 1;
  if (p.tags.includes('rain')) w *= G.weather === 'RAIN' ? 6 : .5;
  if (p.tags.includes('night') && hr !== undefined) w *= hr >= 22 || hr < 5 ? 2 : .8;
  return w;
}
const catalogue = (st, cat) => prodsIn(cat, chainOf(st).mgr, G.months);
function wantProduct(st, cat, g, hr) { const o = {}; for (const p of catalogue(st, cat)) o[p.id] = prodWeight(p, g, hr); return Object.keys(o).length ? wpick(o) : null; }
const SUBST = .3; // chance someone settles for something else in the same category
// how well a store's range covers what a kind of customer wants in one category (0..1)
function catFit(st, cat, g, have) {
  if (!have.cat[cat]) return 0; let tot = 0, got = 0;
  for (const p of catalogue(st, cat)) { const w = prodWeight(p, g); tot += w; if (have.p[p.id]) got += w; }
  return tot ? (got + (tot - got) * SUBST * (got > 0 ? 1 : 0)) / tot : 0;
}
function rangeOf(st) { const have = { cat: {}, p: {} }; for (const f of st.fix) { const c = FIX[f.k].cat; if (!c) continue; f.p.forEach(pid => { if (pid && sellable(st, pid)) { have.p[pid] = 1; have.cat[c] = 1; } }); } return have; }
// surveys: for one full day, staff ask everyone what they came for. Results arrive that night.
const SURVEY_COST = 400000;
function bookOther(st, v) { if (G.tick % TPD === 0) st.preOther = (st.preOther || 0) + v; else st.day.other += v; } // bought before the day starts: book it into that day
function orderSurvey(st) { const c = chainOf(st); if (st.surveyNext || st.surveyOn) return 'ALREADY BOOKED'; if (c.cash < SURVEY_COST) return 'NOT ENOUGH MONEY'; c.cash -= SURVEY_COST; bookOther(st, SURVEY_COST); st.surveyNext = 1; return ''; }
// assign a store's shelves to a ranking (used by rivals; the player does it by hand)
function stockByRank(st, rank) {
  for (const cat of CAT_IDS) {
    const faces = []; st.fix.forEach(f => { if (FIX[f.k].cat === cat) f.p.forEach((p, j) => faces.push([f, j])); }); if (!faces.length) continue;
    const top = catalogue(st, cat).filter(p => sellable(st, p.id)).sort((a, b) => (rank[b.id] || 0) - (rank[a.id] || 0)).map(p => p.id);
    const tot = top.reduce((t, id) => t + (rank[id] || 0), 0); if (!tot) continue;
    const plan = []; for (const id of top) { if (plan.length >= faces.length) break; plan.push(id); if ((rank[id] || 0) / tot > .3 && plan.length < faces.length) plan.push(id); }
    faces.forEach(([f, j], k) => setFacing(st, f, j, plan[k % plan.length]));
  }
  relayout(st); estimateDemand(st);
}
function setFacing(st, f, j, pid) {
  if (f.p[j] === pid) return; const old = f.p[j];
  if (old && f.n[j]) st.back[old] = (st.back[old] || 0) + f.n[j];
  f.p[j] = pid; f.n[j] = 0; if (!st.sold[pid]) st.sold[pid] = 12;
  const i = st.fix.indexOf(f); delete st.claim[i + ':' + j];
}
// ---------- the day ----------
function rollWeather() {
  const summer = G.mo >= 6 && G.mo <= 8, r = Math.random();
  G.weather = summer ? (r < .45 ? 'HOT' : r < .7 ? 'SUNNY' : r < .85 ? 'CLOUDY' : 'RAIN') : (r < .45 ? 'SUNNY' : r < .7 ? 'CLOUDY' : G.mo === 6 || r < .9 ? 'RAIN' : 'SUNNY');
}
function newDay(st) {
  st.day = { sales: 0, cogs: 0, wages: 0, util: 0, waste: 0, theft: 0, other: st.preOther || 0, orders: 0, capex: 0, want: {}, miss: {}, trips: 0, items: 0, lost: { missing: 0, empty: 0, price: 0, queue: 0 }, lostCat: {}, hr: new Array(24).fill(0), happy: 0, sad: 0, seg: {} };
  st.agents = []; st.q = st.fix.map(() => []); st.claim = {}; st.acc = 0; st.show = null;
  if (st.e === undefined) st.e = {};
  st.today = {}; for (const pid in st.sold) st.today[pid] = 0;
  st.surveyOn = st.surveyNext ? 1 : 0; st.surveyNext = 0; st.preOther = 0;
}
const hourNow = () => Math.floor(G.tick * MPT / 60) % 24;
const minNow = () => Math.floor(G.tick * MPT) % 1440;

// catchment: every corridor square splits its konbini trips among nearby stores by appeal, with "no store" as an option
function catchment() {
  const stores = liveStores(), segs = Object.keys(SEGS);
  for (const st of stores) { st.e = {}; for (const g of segs) st.e[g] = 0; st.appeal = appeal(st); }
  const doors = stores.map(st => lotDoor(G.lots[st.lot]));
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    const i = y * MW + x, f = G.foot[i]; if (!f) continue; const m = G.mix[i]; let ms = 0; for (const g in m) ms += m[g];
    for (const g of segs) { if (!m[g]) continue; const trips = f * SHOP * m[g] / ms; let tot = .45; const w = [];
      let cheap = 9; stores.forEach((st, k) => { const d = Math.abs(doors[k][0] - x) + Math.abs(doors[k][1] - y); if (d <= 11) cheap = Math.min(cheap, st.pm[g]); });
      stores.forEach((st, k) => { const d = Math.abs(doors[k][0] - x) + Math.abs(doors[k][1] - y); if (d > 11) { w.push(0); return; } const v = st.appeal[g] * Math.exp(-d / 3.2) * Math.exp(-(st.pm[g] - cheap) * 7); w.push(v); tot += v; });
      stores.forEach((st, k) => { if (w[k]) st.e[g] += trips * w[k] / tot; }); }
  }
}
// a store's price level as one kind of customer sees it: the markups on what they buy
function priceFor(st, g) { const W = SEGS[g].want; let t = 0, m = 0; for (const c in W) { t += W[c]; m += W[c] * st.margin[c]; } return t ? m / t : .4; }
function appeal(st) {
  const R = st.rate, avg = (R.sec + R.cln + R.svc) / 3, have = rangeOf(st);
  const out = {}, mgr = chainOf(st).mgr; st.pm = {};
  for (const g in SEGS) { const wnt = SEGS[g].want; let a = 0, t = 0;
    for (const c in wnt) { const w = c === 'spec' ? wnt[c] * ((SPEC_FIT[mgr] || {})[g] || .2) : wnt[c]; t += w; a += w * catFit(st, c, g, have); }
    const kitN = (chainOf(st).kits || []).filter(id => { const k = KITS.find(k => k.id === id); return have.p[k.a] && have.p[k.b]; }).length;
    const pm = st.pm[g] = priceFor(st, g); // alone, even double prices keep some trade; next to a cheaper rival they don't (see catchment)
    out[g] = Math.pow(a / Math.max(.01, t), 1.5) * (.55 + avg / 110) * (.45 + R.pop / 90) * Math.exp(-(pm - .4) * (g === 'student' ? 2.6 : 1.6)) * (1 + .06 * kitN); }
  return out;
}

// ---------- ticking ----------
function simTick() {
  if (G.over) return;
  const t = G.tick % TPD;
  if (t === 0) startDay();
  if (t === 1800) deliveries();     // 6:00
  if (t % 900 === 450) aiRush();
  runAds(); if (t % 60 === 0) { runPilots(); runCases(); }
  for (const st of liveStores()) storeTick(st);
  if (typeof onFxTick === 'function') onFxTick();
  G.tick++;
  if (G.tick % TPD === 0) endDay();
}
function startDay() { DAYSNAP = serial(); rollWeather(); for (const c of G.chains) c.usedPower = 0; for (const st of liveStores()) newDay(st); catchment(); aiDay(); }
function deliveries() {
  for (const st of liveStores()) {
    const w0 = st.day.waste; FX(st, 'delivery');
    // yesterday's food goes in the bin first
    for (const f of st.fix) f.p.forEach((pid, j) => { if (pid && CATS[PRODUCTS[pid].cat].life === 1 && f.n[j]) { st.day.waste += f.n[j] * PRODUCTS[pid].cost; f.n[j] = 0; } });
    for (const pid in st.back) if (CATS[PRODUCTS[pid].cat].life === 1 && st.back[pid]) { st.day.waste += st.back[pid] * PRODUCTS[pid].cost; st.back[pid] = 0; }
    autoOrder(st); FX(st, 'waste', null, st.day.waste - w0);
  }
}
function orderTarget(st, pid) {
  const per = CATS[PRODUCTS[pid].cat].life === 1, sold = st.sold[pid] || 4, faces = st.fix.reduce((n, f) => n + f.p.filter(p => p === pid).length, 0);
  return Math.max(per ? 4 : FACE_CAP * faces, Math.ceil(sold * (per ? .9 : 1.3)));
}
function onHand(st, pid) { let n = st.back[pid] || 0; for (const f of st.fix) f.p.forEach((p, j) => { if (p === pid) n += f.n[j]; }); return n; }
function autoOrder(st, k = 1, only, dry) {
  let tot = 0;
  const c = chainOf(st), reserve = c.player ? (c.reserve || 3000000) : 8000000;
  for (const pid of carried(st)) { if (!sellable(st, pid) || only && !only(PRODUCTS[pid])) continue;
    const per = CATS[PRODUCTS[pid].cat].life === 1, left = k > 1 && per ? Math.max(0, 1 - ((G.tick % TPD) - 1800) / (TPD - 1800)) : 1; // a rush of food covers only the rest of the day
    const want = Math.ceil(orderTarget(st, pid) * left) - onHand(st, pid); if (want <= 0) continue;
    const cost = unitCost(st, pid) * want * k; if (c.cash - tot - cost < reserve) continue; tot += cost; if (dry) continue;
    st.back[pid] = (st.back[pid] || 0) + want; payStock(st, pid, want, k); }
  return tot;
}
function backdoor(st, only) { // Carl: one rush order per day across the chain, arrives now at 20% over
  const c = chainOf(st); if (c.mgr !== 'carl') return 'ONLY CARL HAS A BACKDOOR'; if (c.usedPower) return 'ALREADY USED TODAY';
  const before = st.day.orders; autoOrder(st, BACKDOOR_MARKUP, only); if (st.day.orders === before) return 'NOTHING NEEDED';
  c.usedPower = 1; st.crate = 90; FX(st, 'backdoor'); news('CARL ROUTED A SHIPMENT THROUGH THE A.S.S. (' + mc(st.day.orders - before) + ')'); return '';
}
function demonstrate(st, hr) { // Ghost: one show per day, two hours, draws a crowd and ties up one employee
  const c = chainOf(st); if (c.mgr !== 'ghost') return 'ONLY GHOST PUTS ON SHOWS'; if (c.usedPower) return 'ALREADY USED TODAY';
  if (c.cash < SHOW_COST) return 'NOT ENOUGH MONEY';
  c.cash -= SHOW_COST; st.day.util += SHOW_COST; c.usedPower = 1;
  const t0 = Math.floor(G.tick / TPD) * TPD + hr * 300; st.show = { t0, t1: t0 + 600 }; FX(st, 'show');
  news('SPOOKY GHOST: GRAND DEMONSTRATION AT ' + storeName(st) + ', ' + hr + ':00.'); return '';
}
const showOn = st => st.show && G.tick >= st.show.t0 && G.tick < st.show.t1;

// ---------- promotion ----------
function adTime(a) { const day0 = Math.floor(G.tick / TPD) * TPD; let at = day0 + a.day * TPD + a.hr * 300; if (at <= G.tick) at += TPD; return at; }
function buyAd(chain, id) {
  const a = ADS[id], c = G.chains[chain], ss = storesOf(chain); if (!ss.length) return 'NO STORES TO ADVERTISE'; if (c.cash < a.cost) return 'NOT ENOUGH MONEY';
  c.cash -= a.cost; for (const st of ss) bookOther(st, a.cost / ss.length);
  scheduleAd(chain, id); return '';
}
function scheduleAd(chain, id) { G.ads = G.ads || []; const a = id === 'idol' ? { day: 1, hr: 12 } : ADS[id]; G.ads.push({ chain, id, at: adTime(a) }); }
function runAds() {
  if (!G.ads || !G.ads.length) return;
  const due = G.ads.filter(a => a.at <= G.tick); if (!due.length) return;
  for (const ad of due) {
    const gain = ad.id === 'idol' ? 100 : ADS[ad.id].gain, mgr = G.chains[ad.chain].mgr;
    for (const st of storesOf(ad.chain)) { st.rate.pop = Math.min(100, st.rate.pop + gain); st.adAt = G.tick; st.adId = ad.id; FX(st, 'ad', null, ad.id); }
    news(ad.id === 'idol' ? 'THE MALL IDOL MIRAI IS AT ' + MGRS[mgr].short + '!' : MGRS[mgr].short + ': ' + ADS[ad.id].n + ' (+' + gain + ' POPULARITY).');
  }
  G.ads = G.ads.filter(a => a.at > G.tick); catchment();
}
// ---------- the other managers' mechanics ----------
// Linda: a brand contract. Cheaper premium and Linda lines; a monthly fee per store; every store must keep a specialty display.
function signContract(chain) { const c = G.chains[chain]; if (c.mgr !== 'linda') return 'ONLY LINDA SIGNS BRAND CONTRACTS'; if (c.contract) return 'ALREADY SIGNED';
  c.contract = { until: G.months + CONTRACT.months }; news('LINDA SELECT SIGNED A BRAND CONTRACT (' + CONTRACT.months + ' MONTHS).'); for (const st of storesOf(chain)) FX(st, 'contract'); return ''; }
function cancelContract(chain) { const c = G.chains[chain]; if (!c.contract) return 'NO CONTRACT'; const fee = CONTRACT.fee * storesOf(chain).length; c.cash -= fee; for (const st of storesOf(chain)) bookOther(st, CONTRACT.fee); c.contract = null; news('LINDA SELECT CANCELLED ITS BRAND CONTRACT.'); return ''; }
function contractMonth(rep) {
  for (const c of G.chains) { if (!c.contract) continue; let fee = 0;
    for (const st of storesOf(c.id)) { const ok = st.fix.some(f => f.k === 'spec'); fee += CONTRACT.fee * (ok ? 1 : 3); if (!ok && c.player) news('CONTRACT PENALTY: ' + storeName(st) + ' HAS NO SPECIALTY DISPLAY.'); }
    c.cash -= fee; if (rep) rep.chains[c.id].contract = fee;
    if (G.months >= c.contract.until) { c.contract = null; news('LINDA SELECT\'S BRAND CONTRACT HAS ENDED.'); } }
}
// Face: a pilot batch of one signature line. Tomorrow you find out if it was a good idea.
function startPilot(chain, pid) { const c = G.chains[chain]; if (c.mgr !== 'face') return 'ONLY FACE RUNS PILOTS'; if (c.pilot) return 'A PILOT IS ALREADY RUNNING'; if (c.cash < PILOT.cost) return 'NOT ENOUGH MONEY';
  const ss = storesOf(chain); if (!ss.length) return 'NO STORES'; c.cash -= PILOT.cost; for (const st of ss) bookOther(st, PILOT.cost / ss.length);
  c.pilot = { pid, at: G.tick + TPD }; news('THE FACE IS TESTING A NEW ' + PRODUCTS[pid].n + '.'); for (const st of ss) FX(st, 'pilot', null, 'start'); return ''; }
function runPilots() {
  for (const c of G.chains) { if (!c.pilot || G.tick < c.pilot.at) continue; const pid = c.pilot.pid, r = Math.random(), ss = storesOf(c.id); let res;
    if (r < PILOT.good) { G.boost[pid] = Math.min(1.75, (G.boost[pid] || 1) + .25); res = 'good'; news('PILOT RESULT: ' + PRODUCTS[pid].n + ' IS BETTER. CUSTOMERS NOTICED.'); }
    else if (r < PILOT.good + PILOT.meh) { res = 'meh'; news('PILOT RESULT: ' + PRODUCTS[pid].n + ' IS... THE SAME. NO HARM DONE.'); }
    else { res = 'bad'; G.boost[pid] = Math.max(.7, (G.boost[pid] || 1) - .15); c.cash -= PILOT.refund; for (const st of ss) bookOther(st, PILOT.refund / Math.max(1, ss.length)); news('PILOT RESULT: ' + PRODUCTS[pid].n + ' RECALLED. REFUNDS: ' + mc(PILOT.refund) + '.'); }
    c.pilot = null; c.lastPilot = { pid, res }; for (const st of ss) FX(st, 'pilot', null, res); catchment(); }
}
// Yoko: need kits (two products, one offer)
function toggleKit(chain, id) { const c = G.chains[chain]; if (c.mgr !== 'yoko') return 'ONLY YOKO MAKES KITS'; c.kits = c.kits || [];
  if (c.kits.includes(id)) { c.kits = c.kits.filter(k => k !== id); return ''; } if (c.kits.length >= KIT_MAX) return 'TWO KITS AT A TIME'; if (c.cash < KIT_SETUP) return 'NOT ENOUGH MONEY';
  c.cash -= KIT_SETUP; const ss = storesOf(chain); for (const st of ss) bookOther(st, KIT_SETUP / Math.max(1, ss.length)); c.kits.push(id); news('YOKO EVERYDAY: NEW KIT, ' + KITS.find(k => k.id === id).n + '.'); catchment(); return ''; }
// JB: a customer case. A few hours later, one precise clue.
function openCase(st) { const c = chainOf(st); if (c.mgr !== 'jb') return 'ONLY JB TAKES CASES'; if (c.usedPower) return 'ONE CASE A DAY'; if (c.cash < CASE_COST) return 'NOT ENOUGH MONEY';
  c.cash -= CASE_COST; bookOther(st, CASE_COST); c.usedPower = 1; st.caseAt = G.tick + CASE_HOURS * 300; FX(st, 'case', null, 'open'); return ''; }
function runCases() {
  for (const st of liveStores()) {
    if (st.caseAt && G.tick >= st.caseAt) { st.caseAt = 0; const d = st.day, have = carried(st);
      const miss = Object.entries(Object.assign({}, st.lastWant || {}, d.miss)).filter(([p]) => !have.includes(p) && PRODUCTS[p] && sellable(st, p) && prodsIn(PRODUCTS[p].cat, chainOf(st).mgr, G.months).some(q => q.id === p)).sort((a, b) => b[1] - a[1])[0];
      const empty = Object.entries(d.lostCat).filter(([k]) => k.endsWith(':empty')).sort((a, b) => b[1] - a[1])[0];
      const price = Object.entries(d.lostCat).filter(([k]) => k.endsWith(':price')).sort((a, b) => b[1] - a[1])[0];
      if (miss) st.clue = { kind: 'miss', pid: miss[0], s: 'THEY KEEP ASKING FOR ' + PRODUCTS[miss[0]].n + '. WE DON\'T CARRY IT.', until: G.tick + 2 * TPD };
      else if (empty) st.clue = { kind: 'empty', cat: empty[0].split(':')[0], s: 'THE ' + CATS[empty[0].split(':')[0]].n + ' SHELF RUNS DRY BEFORE THE STAFF GET THERE.' };
      else if (price) st.clue = { kind: 'price', cat: price[0].split(':')[0], s: 'THE ' + CATS[price[0].split(':')[0]].n + ' PRICES ARE SCARING THEM OFF.' };
      else st.clue = { kind: 'none', s: 'NOTHING. THE STREETS ARE QUIET. TOO QUIET.' };
      st.clue.at = G.tick; FX(st, 'case', null, 'clue'); if (typeof onClue === 'function') onClue(st); }
    // acting on it: stock what they asked for within two days and they come back as regulars
    if (st.clue && st.clue.kind === 'miss' && !st.clue.done && G.tick < st.clue.until && carried(st).includes(st.clue.pid)) {
      st.clue.done = 1; st.rate.pop = Math.min(100, st.rate.pop + 12); st.regBoost = (st.regBoost || 0) + 1; news('CASE CLOSED AT ' + storeName(st) + ': ' + PRODUCTS[st.clue.pid].n + ' IS IN. THE REGULARS ARE BACK.'); FX(st, 'case', null, 'closed'); catchment(); }
  }
}
// ---------- one store, one tick ----------
const CSPD = 1 / 9, SSPD = 1 / 6; // tiles per tick
function storeTick(st) {
  const hr = hourNow(), open = isOpen(st.hours, hr);
  // staff come and go with the opening hours
  if (open) for (const s of staffOf(st)) if (!st.agents.some(a => a.s === s)) st.agents.push({ s, x: backX(st), y: 0, fx: backX(st), fy: -1, st: 'idle', t: 0, sta: 100 });
  for (const a of st.agents) if (a.s && a.s.st !== st.i) a.gone = 1; // fired or moved
  if (!open && !st.agents.some(a => !a.s)) st.agents = st.agents.filter(a => !a.s);
  if (open) {
    let rate = 0; for (const g in st.e) rate += st.e[g] * HOURLY[hr] * (hr >= 22 || hr < 5 ? SEGS[g].night : 1);
    rate = rate / 19.4 * MPT / 60 / REP * (showOn(st) ? 2.4 : 1);  // HOURLY sums to ~19.4
    for (let r = rate; r > 0; r--) if (Math.random() < r) spawnCustomer(st, hr);
  }
  for (const a of st.agents) a.s ? staffAgent(st, a) : custAgent(st, a);
  st.agents = st.agents.filter(a => !a.gone);
  if (st.crate > 0) st.crate--;
  for (const fl of st.flash) fl.t--; st.flash = st.flash.filter(f => f.t > 0);
}
function spawnCustomer(st, hr) {
  const w = {}; for (const g in st.e) w[g] = st.e[g] * (hr >= 22 || hr < 5 ? SEGS[g].night : 1);
  if (showOn(st)) w.adventurer = (w.adventurer || 0) * 3 + 1;
  if (!Object.keys(w).length) return;
  const g = wpick(w), S = SEGS[g], wants = [];
  const pickCat = () => { const o = {}; for (const c in S.want) { let v = S.want[c] * (G.weather === 'RAIN' ? CATS[c].rain : G.weather === 'HOT' ? CATS[c].hot : 1);
    if (c === 'bento' && (hr === 12 || hr === 13 || hr === 7 || hr === 18 || hr === 19)) v *= 1.8; if (c === 'spec') v *= ((SPEC_FIT[chainOf(st).mgr] || {})[g] || .2) * (showOn(st) ? 2 : 1); o[c] = v; } return wpick(o); };
  wants.push(pickCat()); for (const p of [.55 + S.impulse * .3, S.impulse]) if (Math.random() < p) { const c2 = pickCat(); if (!wants.includes(c2)) wants.push(c2); }
  st.day.seg[g] = (st.day.seg[g] || 0) + REP;
  st.agents.push({ g, x: doorX(st), y: st.fh - 1, fx: doorX(st), fy: st.fh, st: 'next', wants, basket: [], t: 0, pat: S.pat * 32, look: g, seed: Math.random() });
  FX(st, 'enter', st.agents[st.agents.length - 1]);
}
// walk one step along a path field toward (tx,ty); returns true when there
function walk(st, a, tx, ty, sp) {
  if (a.x === tx && a.y === ty && Math.abs(a.fx - tx) < .01 && Math.abs(a.fy - ty) < .01) { a.fx = tx; a.fy = ty; return true; }
  const dx = a.x - a.fx, dy = a.y - a.fy, d = Math.hypot(dx, dy);
  if (d > sp) { a.fx += dx / d * sp; a.fy += dy / d * sp; return false; }
  a.fx = a.x; a.fy = a.y;
  if (a.x === tx && a.y === ty) return true;
  const F = field(st, tx, ty), w = st.fw; let best = null, bd = F[a.y * w + a.x]; if (bd < 0) bd = 1e9;
  for (const [ddx, ddy] of DIRS) { const nx = a.x + ddx, ny = a.y + ddy; if (nx < 0 || ny < 0 || nx >= w || ny >= st.fh) continue; const v = F[ny * w + nx]; if (v >= 0 && v < bd) { bd = v; best = [nx, ny]; } }
  if (!best) { a.x = tx; a.y = ty; return false; } // unreachable (layout changed under them): hop
  a.x = best[0]; a.y = best[1];
  if (!a.s && Math.random() < .25) st.dirt[a.y * w + a.x] += G.weather === 'RAIN' ? .5 : .2;
  return false;
}
function bubble(a, b) { a.bub = b; a.bt = 70; }
function lose(st, a, why) { st.day.lost[why] += REP; if (a.cat) st.day.lostCat[a.cat + ':' + why] = (st.day.lostCat[a.cat + ':' + why] || 0) + REP; bubble(a, why); a.sad = 1; FX(st, 'lose', a, why); }
function custAgent(st, a) {
  if (a.bt) a.bt--;
  const R = st.rate;
  switch (a.st) {
    case 'next': { // pick the next category on the list, or head for the register / door
      if (!a.wants.length) { a.st = a.basket.length ? (a.g === 'thief' ? 'sneak' : 'toreg') : 'leave'; return; }
      const c = a.wants.shift(); a.cat = c; const pid = wantProduct(st, c, a.g, hourNow()); a.want = pid; FX(st, 'want', a, pid);
      if (pid) st.day.want[pid] = (st.day.want[pid] || 0) + REP;
      const fx = st.fix.filter(f => FIX[f.k].cat === c && f.p.some(p => p && sellable(st, p)));
      if (!pid || !fx.length) { if (pid) st.day.miss[pid] = (st.day.miss[pid] || 0) + REP; lose(st, a, 'missing'); a.t = 30; a.st = 'think'; return; }
      const has = fx.filter(f => f.p.includes(pid)); // head for the shelf with it, the fullest one if it's on two
      a.fix = has.length ? has.sort((p, q) => q.n[q.p.indexOf(pid)] - p.n[p.p.indexOf(pid)])[0] : pick(fx); a.st = 'go'; return; }
    case 'think': if (--a.t <= 0) a.st = 'next'; return;
    case 'go': { const [ax, ay] = accessOf(a.fix); if (walk(st, a, ax, ay, CSPD)) { a.st = 'browse'; a.t = a.g === 'student' && a.cat === 'mag' ? 260 : 25 + rnd(30); } return; }
    case 'browse': if (--a.t > 0) return; takeItem(st, a); a.st = 'next'; return;
    case 'toreg': { const regs = st.fix.map((f, i) => [f, i]).filter(([f]) => f.k === 'reg'); if (!regs.length) { a.st = 'drop'; return; }
      regs.sort((p, q) => st.q[p[1]].length - st.q[q[1]].length + (manned(st, q[1]) - manned(st, p[1])) * 3); a.reg = regs[0][1]; a.st = 'walkreg'; return; }
    case 'walkreg': { const [ax, ay] = accessOf(st.fix[a.reg]); if (walk(st, a, ax, ay, CSPD)) { st.q[a.reg].push(a); a.st = 'queue'; a.t = 0; } return; }
    case 'queue': { a.t++; const q = st.q[a.reg], i = q.indexOf(a);
      if (a.t > a.pat * (1 + R.svc / 200) && i > 0 || a.t > a.pat * 2.5 && !(i === 0 && manned(st, a.reg))) { q.splice(i, 1); lose(st, a, 'queue'); a.st = 'drop'; } return; }
    case 'drop': for (const it of a.basket) putBack(st, it); a.basket = []; a.st = 'leave'; return;
    case 'paid': a.st = 'leave'; return;
    case 'sneak': { // shoplifter heads for the door; staff on the floor may catch them
      if (walk(st, a, doorX(st), st.fh - 1, CSPD * 1.3)) {
        if (Math.random() < R.sec / 130) { for (const it of a.basket) putBack(st, it); bubble(a, 'caught'); FX(st, 'caught', a); }
        else { for (const it of a.basket) st.day.theft += PRODUCTS[it.pid].cost * it.q; bubble(a, 'theft'); FX(st, 'theft', a); }
        a.basket = []; a.st = 'leave'; } return; }
    case 'leave': if (walk(st, a, doorX(st), st.fh - 1, CSPD)) { a.fy += .5; a.gone = 1; if (a.sad) st.day.sad++; else if (a.paid) st.day.happy++; } return;
  }
}
const putBack = (st, it) => { if (st.fix.includes(it.f) && it.f.p[it.j] === it.pid) it.f.n[it.j] += it.q; else st.back[it.pid] = (st.back[it.pid] || 0) + it.q; };
const manned = (st, ri) => st.agents.some(a => a.s && a.st === 'reg' && a.reg === ri) ? 1 : 0;
function takeItem(st, a) {
  const f = a.fix, S = SEGS[a.g], pid0 = a.want, carriedHere = carried(st).includes(pid0);
  let js = f.p.map((p, j) => j).filter(j => f.p[j] === pid0 && f.n[j] > 0);
  if (!js.length) { // not here, or sold out: maybe they settle for something else on this shelf
    if (carriedHere) st.today[pid0] = (st.today[pid0] || 0) + REP / 2; else st.day.miss[pid0] = (st.day.miss[pid0] || 0) + REP;
    const alt = f.p.map((p, j) => j).filter(j => f.p[j] && f.p[j] !== pid0 && f.n[j] > 0 && sellable(st, f.p[j]));
    if (!alt.length || Math.random() > SUBST + (carriedHere ? .1 : 0)) { lose(st, a, carriedHere ? 'empty' : 'missing'); return; }
    const o = {}; for (const j of alt) o[j] = prodWeight(PRODUCTS[f.p[j]], a.g); js = [+wpick(o)];
  }
  const j = js[0], pid = f.p[j], m = st.margin[PRODUCTS[pid].cat], over = m - (.38 + S.budget * .4);
  if (a.g !== 'thief' && over > 0 && Math.random() < over * 6) { lose(st, a, 'price'); return; }
  const q = Math.min(REP, f.n[j]); f.n[j] -= q; const item = { f, j, pid, q }; a.basket.push(item); st.today[pid] = (st.today[pid] || 0) + q; FX(st, 'take', a, { f, j, pid });
  const kits = chainOf(st).kits; if (kits && a.g !== 'thief') for (const id of kits) { const k = KITS.find(k => k.id === id), other = k.a === pid ? k.b : k.b === pid ? k.a : null; if (!other || a.basket.some(it => it.pid === other)) continue;
    let g2 = null, j2 = -1; for (const g of st.fix) { const jj = g.p.findIndex((p, x) => p === other && g.n[x] > 0); if (jj >= 0) { g2 = g; j2 = jj; break; } }
    if (g2 && Math.random() < .7) { const q2 = Math.min(REP, g2.n[j2]); g2.n[j2] -= q2; item.kit = 1; a.basket.push({ f: g2, j: j2, pid: other, q: q2, kit: 1 }); st.today[other] = (st.today[other] || 0) + q2; st.day.kits = (st.day.kits || 0) + REP; FX(st, 'kit', a, k); break; } }
  if (Math.random() < .15) bubble(a, 'extra');
}
function staffAgent(st, a) {
  const s = a.s, w = st.fw;
  if (a.st !== 'break' && a.st !== 'show') a.sta -= .05 * (130 - s.sta) / 100;
  // the show: one employee stands by the specialty display
  if (showOn(st) && !st.agents.some(b => b.s && b.st === 'show') && a.st === 'idle') { const sp = st.fix.find(f => f.k === 'spec'); if (sp) { a.st = 'show'; a.fix = sp; } }
  switch (a.st) {
    case 'idle': {
      if (a.sta < 15 && !st.agents.some(b => b.s && b.st === 'break' || b.st === 'tobreak')) { a.st = 'tobreak'; return; }
      // 1. an unmanned register with a queue
      for (let i = 0; i < st.fix.length; i++) if (st.fix[i].k === 'reg' && st.q[i].length && !st.agents.some(b => b.s && (b.st === 'reg' || b.st === 'toreg') && b.reg === i)) { a.st = 'toreg'; a.reg = i; return; }
      // 2. a filthy floor comes first
      { let di = -1, dv = 45; for (let i = 0; i < st.dirt.length; i++) if (st.dirt[i] > dv && !st.agents.some(b => b.s && b.clean === i)) { dv = st.dirt[i]; di = i; } if (di >= 0) { a.clean = di; a.st = 'clean'; return; } }
      // 3. a low shelf with stock in the back
      let best = null, bs = 0;
      st.fix.forEach((f, fi) => f.p.forEach((pid, j) => { if (!pid || !sellable(st, pid) || st.claim[fi + ':' + j]) return; const need = FACE_CAP - f.n[j]; if (need >= FACE_CAP / 2 && (st.back[pid] || 0) > 0 && need > bs) { bs = need; best = [fi, j]; } }));
      if (best) { st.claim[best[0] + ':' + best[1]] = 1; a.job = best; a.jobPid = st.fix[best[0]].p[best[1]]; a.st = 'fetch'; return; }
      // 3. a dirty floor
      let di = -1, dv = 25; for (let i = 0; i < st.dirt.length; i++) if (st.dirt[i] > dv && !st.agents.some(b => b.s && b.clean === i)) { dv = st.dirt[i]; di = i; }
      if (di >= 0) { a.clean = di; a.st = 'clean'; return; }
      // 4. stand at a register
      const r = st.fix.findIndex((f, i) => f.k === 'reg' && !st.agents.some(b => b.s && b !== a && (b.st === 'reg' || b.st === 'toreg') && b.reg === i));
      if (r >= 0) { a.st = 'toreg'; a.reg = r; } else { a.st = 'wait'; a.t = 60; }
      return; }
    case 'wait': grow(st, s, 'sec', .0004); if (--a.t <= 0) a.st = 'idle'; return;
    case 'toreg': { const [x, y] = staffSpot(st.fix[a.reg]); if (walk(st, a, x, y, SSPD)) { a.st = 'reg'; a.t = 0; a.idle = 0; } return; }
    case 'reg': {
      grow(st, s, 'sec', .0003);
      const q = st.q[a.reg];
      if (!q.length) { if (++a.idle > 40 && (st.fix.some((f, fi) => f.p.some((p, j) => p && FACE_CAP - f.n[j] >= FACE_CAP / 2 && st.back[p] > 0 && !st.claim[fi + ':' + j])) || a.sta < 15 || st.dirt.some(d => d > 25))) a.st = 'idle'; return; }
      a.idle = 0; const c = q[0]; if (c.st !== 'queue') { q.shift(); return; }
      if (!a.t) a.t = 10 + c.basket.length * (14 - s.ab.reg * .1) + (c.basket.some(it => it.kit) ? 8 : 0); // kits take a moment to bag
      if (--a.t > 0) return;
      checkout(st, c, s); q.shift(); a.t = 0; return; }
    case 'fetch': if (walk(st, a, backX(st), 0, SSPD)) { a.st = 'inback'; a.t = 30; } return;
    case 'inback': { if (--a.t > 0) return; const [fi, j] = a.job, f = st.fix[fi], pid = f.p[j];
      a.carry = Math.min(st.back[pid] || 0, FACE_CAP - f.n[j]); st.back[pid] -= a.carry; a.st = a.carry ? 'carry' : 'idle'; if (!a.carry) delete st.claim[fi + ':' + j]; return; }
    case 'carry': { const f = st.fix[a.job[0]], [x, y] = accessOf(f); if (walk(st, a, x, y, SSPD * .85)) { a.st = 'fill'; a.t = 50 - s.ab.rst * .4; } return; }
    case 'fill': { if (--a.t > 0) return; const [fi, j] = a.job, f = st.fix[fi];
      if (f && f.p[j]) { const room = FACE_CAP - f.n[j], put = Math.min(room, a.carry); f.n[j] += put; st.back[f.p[j]] += a.carry - put; FX(st, 'fill', a, { f, j, put }); }
      delete st.claim[fi + ':' + j]; a.carry = 0; grow(st, s, 'rst', .3); a.st = 'idle'; return; }
    case 'clean': { const i = a.clean, x = i % w, y = (i / w) | 0; if (walk(st, a, x, y, SSPD)) { st.dirt[i] = Math.max(0, st.dirt[i] - (.15 + s.ab.cln / 200)); if (st.dirt[i] <= 2) { FX(st, 'clean', a, i); a.clean = -1; grow(st, s, 'cln', .2); a.st = 'idle'; } } return; }
    case 'tobreak': if (walk(st, a, backX(st), 0, SSPD)) { a.st = 'break'; a.fy = -1.2; FX(st, 'break', a); } return;
    case 'break': a.sta += .2; if (a.sta >= 100) { a.sta = 100; a.st = 'idle'; a.fy = 0; } return;
    case 'show': { if (!showOn(st)) { a.st = 'idle'; return; } const [x, y] = accessOf(a.fix); walk(st, a, x, y, SSPD); return; }
  }
}
function checkout(st, c, s) {
  let rev = 0, cogs = 0; for (const it of c.basket) { rev += priceOf(st, it.pid) * it.q * (it.kit ? 1 - KIT_DISC : 1); cogs += unitCost(st, it.pid) * it.q; }
  const d = st.day; d.sales += rev; d.hr[hourNow()] += rev; d.cogs += cogs; d.trips += REP; d.items += c.basket.reduce((t, it) => t + it.q, 0); st.life.sales += rev;
  chainOf(st).cash += rev; G.month.trips[st.chain] = (G.month.trips[st.chain] || 0) + REP;
  if (st.chain === 0) { G.pvisits = (G.pvisits || 0) + REP; if (G.pvisits >= IDOL_AT && !G.idol) { G.idol = 1; scheduleAd(0, 'idol'); news('YOUR ' + fmt(IDOL_AT) + 'TH CUSTOMER! THE MALL IDOL MIRAI WILL APPEAR TOMORROW AT NOON. FREE!'); } }
  c.basket = []; c.st = 'paid'; c.paid = 1; if (Math.random() < .3) bubble(c, 'happy');
  grow(st, s, 'reg', .02); grow(st, s, 'svc', .015);
  st.flash.push({ fi: c.reg, t: 12, v: rev }); FX(st, 'pay', c, { rev, reg: c.reg });
  if (typeof onSale === 'function') onSale(st, rev);
}
function endDay() {
  for (const st of liveStores()) {
    const d = st.day, hrs = openHours(st.hours);
    d.wages = staffOf(st).reduce((t, s) => t + s.wage * hrs, 0);
    d.util += (SIZES[st.size].util + st.fix.reduce((t, f) => t + FIX[f.k].power, 0) / 20) * hrs;
    chainOf(st).cash -= d.wages + d.util;
    for (const pid in st.today) st.sold[pid] = Math.round(((st.sold[pid] || st.today[pid]) + st.today[pid] * 2) / 3);
    // ratings drift toward what the day showed
    const sf = staffOf(st), avg = k => sf.length ? sf.reduce((t, s) => t + s.ab[k], 0) / sf.length : 0;
    let dirt = 0; for (const v of st.dirt) dirt += v; dirt /= st.dirt.length;
    const served = d.trips, bad = d.lost.queue + d.lost.empty + d.lost.missing;
    const R = st.rate, to = (k, v) => R[k] = Math.round(clamp(R[k] + (v - R[k]) * .4, 0, 100));
    to('sec', avg('sec') * .7 + Math.min(sf.length, 3) * 10);
    to('cln', 100 - dirt * 2.5);
    to('svc', (avg('reg') + avg('svc')) * .3 + 70 * served / Math.max(1, served + bad));
    { const sat = (d.happy + served * .3) / Math.max(1, d.happy + d.sad + served * .3), aim = 10 + 45 * sat - (d.lost.price > served * .2 ? 10 : 0); R.pop = Math.round(clamp(R.pop + (aim - R.pop) * .15, 0, 100)); }
    st.mwant = st.mwant || {}; for (const k in d.want) st.mwant[k] = (st.mwant[k] || 0) + d.want[k];
    if (st.surveyOn) { st.survey = { y: G.y, mo: G.mo, day: SAMPLE_DAYS[G.d], months: G.months, want: Object.assign({}, d.want), miss: Object.assign({}, d.miss), seg: Object.assign({}, d.seg) }; st.surveyOn = 0; if (typeof onSurvey === 'function') onSurvey(st); }
    st.days.push(Object.assign({}, d, { lost: Object.assign({}, d.lost), lostCat: Object.assign({}, d.lostCat), want: null, miss: null }));
  }
  G.d++;
  if (G.d >= 4) settle();
  if (typeof onDayEnd === 'function') onDayEnd();
}
const opProfit = d => d.sales - d.cogs - d.wages - d.util - d.waste - d.theft - (d.other || 0);
function monthSum(days) { const t = { sales: 0, cogs: 0, wages: 0, util: 0, waste: 0, theft: 0, other: 0, trips: 0, lost: { missing: 0, empty: 0, price: 0, queue: 0 } };
  t.lostCat = {}; for (const d of days) { for (const k of ['sales', 'cogs', 'wages', 'util', 'waste', 'theft', 'trips']) t[k] += d[k] * 8; t.other += d.other || 0; /* surveys are one-offs, not x8 */ for (const k in t.lost) t.lost[k] += d.lost[k] * 8; for (const k in d.lostCat) t.lostCat[k] = (t.lostCat[k] || 0) + d.lostCat[k] * 8; } t.op = opProfit(t); return t; }
function settle() {
  const rep = { y: G.y, mo: G.mo, chains: G.chains.map(c => ({ cash0: c.cash, rest: 0, op: 0, sales: 0, contract: 0 })), stores: [] };
  for (const st of liveStores()) {
    const m = monthSum(st.days), rest = Math.round(m.op * 7 / 8);
    chainOf(st).cash += rest; const cr = rep.chains[st.chain]; cr.rest += rest; cr.op += m.op; cr.sales += m.sales;
    st.lastMonth = m; st.losing = m.op < 0 ? st.losing + 1 : 0; st.days = []; st.lastWant = st.mwant || {}; st.mwant = {};
    rep.stores.push({ i: st.i, chain: st.chain, name: storeName(st), m, rate: Object.assign({}, st.rate) });
  }
  const tr = G.month.trips, all = Object.values(tr).reduce((a, b) => a + b, 0);
  rep.share = all ? (tr[0] || 0) / all : 0; rep.shares = G.chains.map(c => all ? (tr[c.id] || 0) / all : 0); G.share = rep.share; G.month = { trips: {} };
  // the mall grows around busy stores
  for (const st of liveStores()) { const [x, y] = lotDoor(G.lots[st.lot]); spreadFoot(x, y, 25 + st.rate.pop * .9, 5); }
  G.months++; G.mo++; if (G.mo > 12) { G.mo = 1; G.y++; } G.d = 0;
  for (const p of Object.values(PRODUCTS)) if (p.launch === G.months) news('NEW FROM THE SUPPLIER: ' + p.n + ' (' + CATS[p.cat].n + ').');
  for (const c of G.chains) c.usedPower = 0;
  aiMonth();
  rep.stars = ownerStars(); rep.pop = population();
  G.hist.push({ y: rep.y, mo: rep.mo, cash: G.chains.map(c => c.cash), share: rep.share, pop: rep.pop });
  contractMonth(rep); checkGoals(); G.lastRep = rep;
  if (typeof onSettle === 'function') onSettle(rep);
}
function ownerStars(chain = 0) { const ss = storesOf(chain); if (!ss.length) return 0; let t = 0; for (const s of ss) t += (s.rate.sec + s.rate.cln + s.rate.svc + s.rate.pop) / 4; return Math.min(5, Math.floor(t / ss.length / 18 * 2) / 2); }
function checkGoals() {
  const c = playerChain();
  if (G.goal === 1 && storesOf(0).length >= STORE_CAP) return win();
  if (G.goal === 2 && storesOf(0).length >= 3 && ownerStars() >= 5) return win();
  if (c.cash < 0) { G.poor++; if (G.poor >= 2) { G.over = 1; G.lost = 1; news('THE MALL TOOK BACK YOUR DEEDS.'); } else news('WARNING: CASH IS BELOW ZERO. ONE MORE MONTH AND THE MALL TAKES THE DEEDS.'); }
  else G.poor = 0;
}
function win() { if (G.won) return; G.won = 1; news('GOAL REACHED: ' + GOALS[G.goal].n + '!'); if (typeof onWin === 'function') onWin(); }

// ---------- buying, selling, closing ----------
function storeValue(st) { const lm = st.lastMonth; return lotPrice(G.lots[st.lot]) + Math.round(SIZES[st.size].cost * .8) + Math.max(0, lm ? lm.op * 6 : 0); }
function buyoutPrice(st) { return Math.round(storeValue(st) * (st.losing ? 1 : 1.5) / 100000) * 100000; }
function buyout(chain, si) {
  const st = G.stores[si], c = G.chains[chain], p = buyoutPrice(st); if (st.chain === chain) return 'ALREADY YOURS'; if (c.cash < p) return 'NOT ENOUGH MONEY';
  c.cash -= p; G.chains[st.chain].cash += p; const from = MGRS[G.chains[st.chain].mgr].short;
  st.chain = chain; st.num = G.stores.filter(s => s.chain === chain).length; st.losing = 0;
  const mgr = c.mgr; for (const f of st.fix) if (f.k === 'spec') { const fresh = newFix('spec', f.x, f.y, f.d, mgr); f.p = fresh.p; f.n = fresh.n; }
  news(MGRS[mgr].short + ' BOUGHT A STORE FROM ' + from + ' FOR ' + mc(p) + '.'); catchment();
  if (chain === 0 && G.goal === 1 && storesOf(0).length >= STORE_CAP) win();
  return '';
}
function closeStore(st, why) {
  st.closed = 1; G.lots[st.lot].st = -1; const c = chainOf(st); c.cash += Math.round(lotPrice(G.lots[st.lot]) * .7);
  for (const s of staffOf(st)) { s.st = -1; s.mgr = 0; }
  catchment();
  news(storeName(st) + ' CLOSED' + (why ? ' (' + why + ')' : '') + '.');
  if (!storesOf(st.chain).length && !c.player) news(MGRS[c.mgr].short + ' HAS LEFT THE MALL.');
}

// ---------- rival chains (and the autopilot for tools/kwsim.js) ----------
function freeStaff() { return G.staff.filter(s => s.st < 0 && s.banned <= G.months); }
function bestLot(chain) {
  const c = G.chains[chain], mix = MGRS[c.mgr].mix; let best = -1, bs = -1;
  for (const lot of G.lots) { if (lot.st >= 0) continue; const [dx, dy] = lotDoor(lot), m = G.mix[dy * MW + dx], ms = Object.values(m).reduce((a, b) => a + b, 0);
    let s = localFoot(lot) * (.6 + (m[mix] || 0) / ms * 2) / lotPrice(lot);
    for (const o of liveStores()) { const l = G.lots[o.lot], d = Math.abs(l.x - lot.x) + Math.abs(l.y - lot.y); if (d < 5) s *= o.chain === chain ? .3 : .75; }
    if (s > bs) { bs = s; best = lot.i; } }
  return best;
}
function aiHires(chain, n) { const pool = freeStaff().sort((a, b) => (b.edu + b.agi + b.soc) / b.wage - (a.edu + a.agi + a.soc) / a.wage); return pool.slice(0, n).map(s => s.i); }
function aiOpen(chain) {
  const c = G.chains[chain], lot = bestLot(chain); if (lot < 0) return;
  const size = chainSales(chain) >= SIZES[2].unlock ? 2 : 1;
  if (c.cash < buildCost(lot, size) + 30000000) return;
  if (openStore(chain, lot, size, aiHires(chain, 1 + SIZES[size].staff))) return;
  const st = G.stores[G.stores.length - 1]; if (!(c.mgr === 'carl' && c.cash > MED_FEE + 40000000 && !getPermit(st))) for (const f of st.fix) if (f.k === 'med') Object.assign(f, newFix('daily', f.x, f.y, f.d, c.mgr));
  if (c.mgr === 'ghost') st.hours = 0;
}
function aiChains() { return G.chains.filter(c => !c.player || G.autopilot); }
function aiMonth() {
  for (const c of aiChains()) {
    const mine = storesOf(c.id);
    for (const st of mine) {
      if (st.losing >= 3 && mine.length > 1) { closeStore(st, 'LOSING MONEY'); continue; }
      const lm = st.lastMonth; if (!lm) continue;
      for (const k in st.margin) { if (st.losing && st.margin[k] > .3) st.margin[k] -= .02; else if (lm.lost.price > lm.trips * .08) st.margin[k] = Math.max(.25, st.margin[k] - .02); else if (lm.op > 0 && lm.lost.price < lm.trips * .02) st.margin[k] = Math.min(.55, st.margin[k] + .01); }
      while (staffOf(st).length < 1 + SIZES[st.size].staff && freeStaff().length) hire(st, aiHires(c.id, 1)[0]);
      if (G.months % 2 === 0 && c.cash > SURVEY_COST * 4 && st.lastWant) { c.cash -= SURVEY_COST; stockByRank(st, st.lastWant); }
    }
    if (mine.length < (c.player ? 6 : [5, 5, 4, 3][Math.min(3, G.chains.length - 1)])) aiOpen(c.id);
    // attract a facility when rich enough and it would help
    for (const id of ['vending', 'lounge', 'starport']) if (!canAttract(id) && c.cash > FACILITIES[id].cost + 80000000 && mine.length >= 2) { attract(c.id, id); break; }
    if (c.player && G.goal === 0 && !canAttract('tower') && c.cash > FACILITIES.tower.cost) attract(c.id, 'tower');
  }
}
function aiDay() {
  for (const c of aiChains()) {
    const mine = storesOf(c.id); if (!mine.length) { if (G.months === 0 && G.d === 0) aiOpen(c.id); continue; }
    const pop = mine.reduce((t, s) => t + s.rate.pop, 0) / mine.length, pend = (G.ads || []).some(a => a.chain === c.id);
    if (!pend && pop < 55 && c.cash > 40000000) { const opts = c.mgr === 'ghost' ? (c.cash > 120000000 ? ['tv', 'blimp'] : ['blimp', 'bulletin']) : ['bulletin', 'flyers', 'flyers']; buyAd(c.id, pick(opts)); }
    if (c.mgr === 'linda' && !c.contract && c.cash > 60000000) signContract(c.id);
    if (c.mgr === 'face' && !c.pilot && c.cash > 30000000 && Math.random() < .35) startPilot(c.id, pick(prodsIn('spec', 'face', G.months)).id);
    if (c.mgr === 'yoko' && (c.kits || []).length < KIT_MAX && c.cash > 20000000) { const have = new Set(mine.flatMap(carried)); const k = KITS.find(k => have.has(k.a) && have.has(k.b) && !(c.kits || []).includes(k.id)); if (k) toggleKit(c.id, k.id); }
    if (c.mgr === 'jb' && c.cash > 20000000) openCase(mine.reduce((a, b) => a.day.lost.missing > b.day.lost.missing ? a : b));
    if (c.mgr === 'ghost' && c.cash > 20000000) { const st = mine.reduce((a, b) => (a.e.adventurer || 0) > (b.e.adventurer || 0) ? a : b); demonstrate(st, 20); }
  }
}
// Carl's rival AI rushes stock when shelves and the back are both empty (checked a few times a day)
function aiClue(st) { if (!st.clue || st.clue.kind !== 'miss' || st.clue.done) return; const cat = PRODUCTS[st.clue.pid].cat; let worst = null;
  for (const f of st.fix) if (FIX[f.k].cat === cat) f.p.forEach((p, j) => { if (!worst || (st.sold[p] || 0) < (st.sold[worst[0].p[worst[1]]] || 0)) worst = [f, j]; });
  if (worst) { setFacing(st, worst[0], worst[1], st.clue.pid); relayout(st); estimateDemand(st); } }
function aiRush() { for (const c of aiChains()) if (c.mgr === 'jb') for (const st of storesOf(c.id)) aiClue(st); for (const c of aiChains()) if (c.mgr === 'carl' && !c.usedPower) for (const st of storesOf(c.id)) {
  let dry = 0; for (const f of st.fix) f.p.forEach((p, j) => { if (p && sellable(st, p) && !CATS[PRODUCTS[p].cat].life && !f.n[j] && !(st.back[p] > 0)) dry++; }); if (dry >= 3) { backdoor(st, p => !CATS[p.cat].life); break; } } }

// ---------- save ----------
// A save is the snapshot taken at the start of the current day, so loading replays the day: money and stock can't duplicate.
let DAYSNAP = null;
function serial() {
  const S = Object.assign({}, G, { stores: G.stores.map(st => Object.assign({}, st, { agents: [], q: [], claim: {}, blk: null, cache: null, flash: [], dirt: Array.from(st.dirt) })), news: NEWS.slice(0, 10) });
  return JSON.stringify(S);
}
function saveGame(slot = 'kw_save') { try { localStorage.setItem(slot, DAYSNAP || serial()); return 1; } catch (e) { return 0; } }
function loadGame(slot = 'kw_save') {
  const S = fetchStore(slot); if (!S) return 0;
  G = S; NEWS.length = 0; (S.news || []).forEach(n => NEWS.push(n)); delete G.news;
  for (const st of G.stores) { st.dirt = Float32Array.from(st.dirt); st.agents = []; st.q = st.fix.map(() => []); st.claim = {}; st.flash = []; }
  if (G.tick % TPD) { for (const st of liveStores()) newDay(st); catchment(); }
  DAYSNAP = serial();
  return 1;
}
