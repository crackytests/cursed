'use strict';
// ================= KONBINI WARS: the mall map (lots, footfall, facilities, rival stores) =================
let MAPBUF = null, MAPOVER = 'none', MSEL = null;
const MAPX = 16, MAPY = 30;
function drawMap() {
  rectF(0, 0, W, H, WIN.desk); for (let y = 11; y < H; y += 4) for (let x = (y & 4) ? 2 : 0; x < W; x += 4) pset(x, y, mix(WIN.desk, INKC, .2));
  if (!MAPBUF) MAPBUF = mapBase();
  bevel(MAPX - 4, MAPY - 16, MW * MSW + 8, MH * MSH + 20); gradH(MAPX - 1, MAPY - 13, MW * MSW + 2, 11, WIN.title, WIN.title2);
  text('MALL OF THE FUTURE - NEW WING', MAPX + 2, MAPY - 11, WIN.lite, 0); text('FOOTFALL ' + fmt(population()), MAPX + MW * MSW - 100, MAPY - 11, WIN.lite, 0);
  copyBuf(MAPBUF, MAPX, MAPY);
  // footfall overlay: brighter = busier
  if (MAPOVER === 'foot' || MAPOVER === 'permit') for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { const f = G.foot[y * MW + x]; if (!f) continue; const k = clamp(f / 160, 0, 1); rectA(MAPX + x * MSW + 2, MAPY + y * MSH + 2, MSW - 4, MSH - 4, mix(C('#2040ff'), C('#ff4020'), k), .55); }
  // district labels
  text('ARRIVAL CONCOURSE', MAPX + 4, MAPY + 8 * MSH + 1, C('#203040'), 0); text('OCCULT PASSAGE', MAPX + 15 * MSW + 4, MAPY + 8 * MSH + 1, C('#f0e0ff'), 0);
  text('STARPORT >', MAPX + 2, MAPY + 9 * MSH + 1, C('#806020'), 0);
  for (const id in FACILITIES) { const f = FACILITIES[id]; facIcon(MAPX + f.at[0] * MSW, MAPY + f.at[1] * MSH, id, G.fac[id]); }
  for (const lot of G.lots) { const x = MAPX + lot.x * MSW, y = MAPY + lot.y * MSH, sel = MSEL && MSEL.lot === lot.i;
    if (lot.st >= 0) storeIcon(x, y, G.stores[lot.st], sel); else lotIcon(x, y, 0, sel); }
  // medicine permit ranges
  if (MAPOVER === 'permit') for (const st of liveStores()) Object.keys(PERMITS).forEach((pk, pi) => { if (!st.permit[pk]) return; const l = G.lots[st.lot], cx = MAPX + (l.x + 1) * MSW, cy = MAPY + (l.y + 1) * MSH, col = C(['#ffffff', '#c8a878', '#e8c050'][pi]), R = PERMITS[pk].range;
    for (let a = 0; a < 80; a++) { if (((a >> 2) + pi) % 3) continue; const t = a / 80 * Math.PI * 2, dx = Math.cos(t), dy = Math.sin(t), k = R / (Math.abs(dx) + Math.abs(dy)); pset(cx + dx * k * MSW, cy + dy * k * MSH, st.chain === 0 ? col : mix(col, C('#ff2020'), .5)); } });
  // legend / overlay buttons
  const by = MAPY + MH * MSH + 6; bevel(MAPX - 4, by - 2, MW * MSW + 8, 16);
  if (btn(MAPX, by, 60, 'LOTS', { on: MAPOVER === 'none' })) MAPOVER = 'none';
  if (btn(MAPX + 62, by, 66, 'FOOTFALL', { on: MAPOVER === 'foot', tip: 'Busier squares send more shoppers to nearby stores.' })) MAPOVER = 'foot';
  if (btn(MAPX + 130, by, 66, 'PERMITS', { on: MAPOVER === 'permit', tip: 'Rings: medicine (white), tobacco (tan), alcohol (gold). Rivals\' rings are reddish. No other chain can get the same permit inside a ring.' })) MAPOVER = 'permit';
  const share = G.share === undefined ? '--' : Math.round(G.share * 100) + '%';
  ink('MONOPOLY RATE ' + share + '   STORES ' + liveStores().length + '/' + STORE_CAP, MAPX + 210, by + 3);
}
function mapInput() {
  if (OWNER !== 'desk') return;
  const mx = Math.floor((MOUSE.x - MAPX) / MSW), my = Math.floor((MOUSE.y - MAPY) / MSH);
  const lot = G.lots.find(l => mx >= l.x && mx < l.x + 2 && my >= l.y && my < l.y + 2);
  const fid = Object.keys(FACILITIES).find(id => { const f = FACILITIES[id]; return mx >= f.at[0] && mx < f.at[0] + 2 && my >= f.at[1] && my < f.at[1] + 2; });
  CURSOR = lot || fid ? 'hand' : 'arrow';
  if (lot && !MOUSE.click) { TIP = lot.st >= 0 ? storeName(G.stores[lot.st]) : 'LOT  ' + mc(lotPrice(lot)); }
  if (fid && !MOUSE.click) TIP = FACILITIES[fid].n + (G.fac[fid] ? '' : '  ' + mc(FACILITIES[fid].cost));
  if (!MOUSE.click) return;
  if (lot) { MOUSE.click = 0; MSEL = { lot: lot.i }; openLotWin(lot); }
  else if (fid) { MOUSE.click = 0; MSEL = { fac: fid }; openFacWin(fid); }
}
function mixBars(x, y, m, w = 120) {
  let t = 0; for (const g in m) t += m[g]; let i = 0;
  for (const g of ['traveler', 'routine', 'adventurer', 'student']) { const v = (m[g] || 0) / t; ink(SEGS[g].n.split(' ')[0], x, y + i * 10, WIN.dim); bar(x + 70, y + 1 + i * 10, w - 70, v * 1.6, WIN.title); i++; }
}
function openLotWin(lot) {
  openWin({ id: 'lot', title: lot.st >= 0 ? 'STORE' : 'LOT FOR SALE', x: W - 196, y: 20, w: 190, h: 170, body(win, x, y, w, h) {
    if (lot.st >= 0) return storeCard(G.stores[lot.st], x, y, w, h);
    const [dx, dy] = lotDoor(lot);
    ink(districtOf(lot.x).n, x + 2, y + 2, WIN.title);
    ink('PRICE', x + 2, y + 14, WIN.dim); ink(mc(lotPrice(lot)), x + 60, y + 14);
    ink('FOOTFALL', x + 2, y + 24, WIN.dim); ink(fmt(localFoot(lot)) + ' NEARBY', x + 60, y + 24);
    ink('WHO PASSES BY', x + 2, y + 38, WIN.dim); mixBars(x + 2, y + 48, G.mix[dy * MW + dx], w - 6);
    const near = liveStores().filter(o => { const l = G.lots[o.lot]; return Math.abs(l.x - lot.x) + Math.abs(l.y - lot.y) <= 6; });
    ink('STORES NEARBY: ' + (near.length ? near.map(o => MGRS[chainOf(o).mgr].short).join(', ') : 'NONE'), x + 2, y + 92, near.length ? WIN.red : WIN.green);
    const why = canBuild(0, lot.i, 1);
    ink('BUILD FROM ' + mc(buildCost(lot.i, 1)), x + 2, y + 106, WIN.dim);
    if (btn(x + 2, y + h - 16, w - 4, 'BUY THIS LOT AND BUILD', { h: 14, off: !!why, tip: why || 'Lot, building, and a starter layout.' })) run(() => buildFlow(lot.i));
    if (why) ink(why.slice(0, 30), x + 2, y + 118, WIN.red);
  } });
}
function storeCard(st, x, y, w, h) {
  const own = st.chain === 0, M = MGRS[chainOf(st).mgr];
  rectF(x + 2, y + 2, 8, 8, C(M.col)); ink(storeName(st), x + 14, y + 2, WIN.title);
  ink(M.store, x + 2, y + 13, WIN.dim); ink('HOURS ' + HOURS[st.hours].n + (st.permit.med ? '  +MEDICINE' : ''), x + 2, y + 23, WIN.dim);
  // public: what you can see by walking past (prices, hours, how busy). private numbers only for your own stores
  let mg = 0, n = 0; for (const k in st.margin) { mg += st.margin[k]; n++; } mg /= n;
  ink('PRICES', x + 2, y + 37, WIN.dim); ink(mg < .36 ? 'LOW' : mg < .44 ? 'TYPICAL' : 'HIGH', x + 70, y + 37);
  ink('BUSY', x + 2, y + 47, WIN.dim); bar(x + 70, y + 48, w - 76, Object.values(st.e || {}).reduce((a, b) => a + b, 0) / 1200);
  if (own) {
    const lm = st.lastMonth; ink('LAST MONTH', x + 2, y + 61, WIN.dim);
    if (lm) { ink('SALES  ' + mc(lm.sales), x + 2, y + 71); ink('PROFIT ' + mc(lm.op), x + 2, y + 81, lm.op < 0 ? WIN.red : WIN.green); } else ink('(first month)', x + 2, y + 71, WIN.dim);
    [['SEC', 'sec'], ['CLN', 'cln'], ['SVC', 'svc'], ['POP', 'pop']].forEach(([l, k], i) => { ink(l, x + 2 + (i % 2) * 90, y + 95 + (i >> 1) * 10, WIN.dim); bar(x + 26 + (i % 2) * 90, y + 96 + (i >> 1) * 10, 60, st.rate[k] / 100); });
    if (btn(x + 2, y + h - 16, w - 4, 'GO TO THIS STORE', { h: 14 })) { goStore(st); closeWin('lot'); }
  } else {
    ink('STAFF ' + staffOf(st).length, x + 2, y + 61, WIN.dim);
    ink(st.losing ? 'LOOKS LIKE IT IS STRUGGLING' : 'SEEMS TO BE DOING FINE', x + 2, y + 75, st.losing ? WIN.green : WIN.dim);
    const p = buyoutPrice(st); ink('BUYOUT ' + mc(p), x + 2, y + 89, WIN.dim);
    if (btn(x + 2, y + h - 32, w - 4, 'VISIT', { h: 14 })) { goStore(st); closeWin('lot'); }
    if (btn(x + 2, y + h - 16, w - 4, 'OFFER TO BUY IT', { h: 14, off: playerChain().cash < p })) run(async () => {
      const r = await msgBox('BUYOUT', [MGRS[chainOf(st).mgr].n + ' will sell ' + storeName(st) + ' for ' + mc(p) + '.', 'You get the lot, the building, the layout, the permits and the staff.'], ['BUY IT', 'NO'], { icon: iconInfo });
      if (r === 0) { const who = MGRS[chainOf(st).mgr].n, why = buyout(0, st.i); if (why) alertBox(why); else { sfx('cash'); say(who === 'CARL' ? 'Fine. FINE. It was a normal store and now it is your normal store.' : 'Take it. I was going to reinvent that space anyway. As a legend.', who, { mood: who === 'CARL' ? 'nervous' : 'sad' }); } }
    });
  }
}
function openFacWin(id) {
  const f = FACILITIES[id];
  openWin({ id: 'fac', title: 'FACILITY', x: W - 196, y: 20, w: 190, h: 120, body(win, x, y, w, h) {
    ink(f.n, x + 2, y + 2, WIN.title);
    if (G.fac[id]) { ink('OPEN. BROUGHT BY ' + MGRS[G.chains[G.fac[id].by].mgr].short, x + 2, y + 14); ink('+' + fmt(f.add) + ' FOOTFALL NEARBY', x + 2, y + 26, WIN.green); return; }
    ink('COST', x + 2, y + 14, WIN.dim); ink(mc(f.cost), x + 50, y + 14);
    ink('NEEDS', x + 2, y + 24, WIN.dim); ink(f.pop ? fmt(f.pop) + ' FOOTFALL' : 'NOTHING', x + 50, y + 24, population() >= f.pop ? WIN.green : WIN.red);
    ink('BRINGS', x + 2, y + 34, WIN.dim); ink('+' + fmt(f.add) + ' FOOTFALL', x + 50, y + 34);
    wrapT(id === 'tower' ? 'The goal on this map: bring the Mall Administration Tower to the wing.' : id === 'starport' ? 'Travelers at all hours.' : id === 'lounge' ? 'Spirits and adventurers after dark.' : 'Routine shoppers and students.', 30).forEach((l, i) => ink(l, x + 2, y + 48 + i * 9, WIN.dim));
    const why = canAttract(id) || (playerChain().cash < f.cost ? 'NOT ENOUGH MONEY' : '');
    if (btn(x + 2, y + h - 16, w - 4, 'ATTRACT IT', { h: 14, off: !!why, tip: why })) { const r = attract(0, id); if (r) alertBox(r); else { sfx('cash'); MAPBUF = null; } }
  } });
}
