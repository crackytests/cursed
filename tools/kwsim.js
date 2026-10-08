// node tools/kwsim.js [months=12] [goal=1] [mgr=carl]   AI vs AI (the player chain on autopilot): checks the economy and the books
const X = require('./kwvm.js');
const [months = '12', goal = '1', mgr = 'carl', rivals = ''] = process.argv.slice(2);
const ctx = X.load({}, ['fm', 'x68', 'kwdata', 'kwsim']);
const R = s => X.R(ctx, s);
R(`newWorld('${mgr}', ${goal}, ${JSON.stringify(rivals ? rivals.split(',') : [])}); G.autopilot = 1;`);
const t0 = Date.now();
for (let m = 0; m < +months; m++) {
  R(`{ const mo = G.months; while (G.months === mo && !G.over) simTick(); }`);
  const r = JSON.parse(R(`JSON.stringify({ y: G.y, mo: G.mo, pop: population(), share: G.share, stars: ownerStars(0), cash: G.chains.map(c => c.cash), stores: G.chains.map(c => storesOf(c.id).length),
    st: liveStores().filter(s => s.lastMonth).map(s => ({ n: storeName(s), trips: s.lastMonth.trips, sales: s.lastMonth.sales, op: s.lastMonth.op, lost: s.lastMonth.lostCat, waste: s.lastMonth.waste, cogs: s.lastMonth.cogs, wages: s.lastMonth.wages, util: s.lastMonth.util, theft: s.lastMonth.theft, rate: s.rate, m: s.margin.bento })) })`));
  console.log(`Y${r.y} ${r.mo} pop ${r.pop} share ${(r.share * 100).toFixed(0)}% stars ${r.stars} cash ${r.cash.map(c => (c / 1e6).toFixed(1) + 'M').join(' / ')} stores ${r.stores.join('/')}`);
  for (const s of r.st) console.log(`   ${s.n.padEnd(16)} trips ${String(s.trips).padStart(6)} sales ${(s.sales / 1e6).toFixed(2)}M op ${(s.op / 1e6).toFixed(2)}M cogs ${(s.cogs / 1e6).toFixed(2)}M wage ${(s.wages / 1e6).toFixed(2)}M util ${(s.util / 1e6).toFixed(2)}M waste ${(s.waste / 1e3).toFixed(0)}k theft ${(s.theft / 1e3).toFixed(0)}k lost ${JSON.stringify(s.lost)} rate ${JSON.stringify(s.rate)}`);
  if (R('G.over')) { console.log('OVER'); break; }
}
console.log('news:', R('NEWS.slice(0,8).map(n=>n.s).join(" | ")'));
console.log('secs', ((Date.now() - t0) / 1000).toFixed(1));
