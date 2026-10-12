// node tools/kwpromo.js   do prices and ads matter? one player store, a rival right next door (or none), one month each way
const X = require('./kwvm.js');
function run(margin, ads, rival) {
  const ctx = X.load({}, ['fm', 'x68', 'kwdata', 'kwsim']); const R = s => X.R(ctx, s);
  R(`newWorld('carl', 1); G.chains[1].cash = 0; openStore(0, 8, 1, aiHires(0, 3)); getPermit(G.stores[0]);
     ${rival ? "G.chains[1].cash = 200000000; openStore(1, 9, 1, aiHires(1, 3)); G.chains[1].cash = 0;" : ''}
     for (const k in G.stores[0].margin) G.stores[0].margin[k] = ${margin};`);
  R(`{ const mo = G.months; while (G.months === mo) simTick(); }`);
  R(`G.chains[0].cash = 1e9; for (const k in G.stores[0].margin) G.stores[0].margin[k] = ${margin};`);
  if (ads) R(`buyAd(0, 'radio'); buyAd(0, 'bulletin'); buyAd(0, 'flyers');`);
  R(`{ const mo = G.months; while (G.months === mo) simTick(); }`);
  return JSON.parse(R(`JSON.stringify((() => { const m = G.stores[0].lastMonth; return { trips: m.trips, sales: Math.round(m.sales / 1e3) + 'k', op: Math.round(m.op / 1e3) + 'k', pop: G.stores[0].rate.pop, priceLost: m.lost.price }; })())`));
}
for (const rival of [1, 0]) for (const [m, ads] of [[.3, 0], [.4, 0], [.55, 0], [.4, 1]])
  console.log((rival ? 'rival next door' : 'alone').padEnd(16), 'markup', m, ads ? '+ads' : '    ', JSON.stringify(run(m, ads, rival)));
