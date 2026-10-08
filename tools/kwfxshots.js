// node tools/kwfxshots.js   screenshots of the store's little moments: lunch rush, a rainy night, Linda and a stray cat, Ghost's show, Carl's rush delivery
const X = require('./kwvm.js'), path = require('path');
const shot = (ctx, n) => X.png(ctx, path.join(__dirname, 'shots', 'kwfx_' + n + '.png'));
async function scene(name, mgr, setup, frames) {
  const ctx = X.load(); const R = s => X.R(ctx, s);
  R(`fit(); newWorld('${mgr}', 1); scene = main; openStore(0, ${mgr === 'carl' ? 8 : 12}, 1, aiHires(0, 3)); goStore(G.stores[0]); SPEED = 1;`);
  R(setup); await X.step(ctx, frames); shot(ctx, name); console.log(name, 'ok');
}
(async () => {
  await scene('lunch', 'carl', `while (G.tick % TPD < 12 * 300 - 20) simTick();`, 90);
  await scene('night_rain', 'carl', `while (G.tick % TPD < 6 * 300) simTick(); while (G.tick % TPD < 22 * 300 + 100) simTick(); G.weather = 'RAIN';`, 60);
  await scene('visitors', 'carl', `while (G.tick % TPD < 14 * 300) simTick(); visitor(G.stores[0], 'linda'); visitor(G.stores[0], 'cat'); visitor(G.stores[0], 'boss'); for (let i = 0; i < 160; i++) simTick();`, 30);
  await scene('show', 'ghost', `while (G.tick % TPD < 19 * 300) simTick(); demonstrate(G.stores[0], 20); while (G.tick % TPD < 20 * 300 + 200) simTick();`, 40);
  await scene('backdoor', 'carl', `while (G.tick % TPD < 15 * 300) simTick(); backdoor(G.stores[0]);`, 40);
  await scene('tv', 'carl', `while (G.tick % TPD < 18 * 300) simTick(); for (const k in G.stores[0].margin) G.stores[0].margin[k] = .26; buyAd(0, 'tv'); buyAd(0, 'blimp'); G.ads.forEach(a => a.at = G.tick + 2);`, 120);
  await scene('idol', 'ghost', `while (G.tick % TPD < 13 * 300) simTick(); scheduleAd(0, 'idol'); G.ads[G.ads.length - 1].at = G.tick + 2; buyAd(0, 'flyers'); G.ads.forEach(a => a.at = G.tick + 2);`, 140);
  await scene('dawn', 'ghost', `while (G.tick % TPD < 5 * 300 + 280) simTick();`, 40);
})().catch(e => { console.log('ERR', e); process.exit(1); });
