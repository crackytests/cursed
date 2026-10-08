// node tools/kwrange.js   does the range matter? one store, no rival: default shelves vs shelves set from a survey
const X = require('./kwvm.js');
function run(mode) {
  const ctx = X.load({}, ['fm', 'x68', 'kwdata', 'kwsim']); const R = s => X.R(ctx, s);
  R(`newWorld('carl', 1); G.chains[1].cash = 0; openStore(0, 8, 1, aiHires(0, 3)); getPermit(G.stores[0]);`);
  R(`{ const mo = G.months; while (G.months === mo) simTick(); }`); // month 1: default shelves (also gathers wants)
  if (mode === 'survey') R(`stockByRank(G.stores[0], G.stores[0].lastWant)`);
  R(`{ const mo = G.months; while (G.months === mo) simTick(); }`);
  return JSON.parse(R(`JSON.stringify((() => { const m = G.stores[0].lastMonth; return { trips: m.trips, sales: Math.round(m.sales/1e3)+'k', op: Math.round(m.op/1e3)+'k', lost: m.lost }; })())`));
}
for (const mode of ['default', 'survey', 'default', 'survey']) console.log(mode.padEnd(8), JSON.stringify(run(mode)));
