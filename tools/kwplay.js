// node tools/kwplay.js [mgr=carl] [months=3]   plays through the real UI: title, new game, a lot, build, hire, open, run months, settlement.
// Clicks buttons by their label (btn() logs what it drew each frame), so it tests the same paths a player uses.
const X = require('./kwvm.js'), path = require('path');
const [mgr = 'carl', months = '3'] = process.argv.slice(2);
const ctx = X.load(); const R = s => X.R(ctx, s);
const shot = n => X.png(ctx, path.join(__dirname, 'shots', 'kwplay_' + n + '.png'));
async function frames(n = 1) { for (let i = 0; i < n; i++) { R('BTNLOG = []'); await X.step(ctx, 1); } }
async function clickAt(x, y) { R(`MOUSE.on=1; MOUSE.x=${x}; MOUSE.y=${y}; MOUSE.mv=1`); await frames(1); R('MOUSE.click=1; MOUSE.down=1'); await frames(1); R('MOUSE.down=0'); await frames(1); }
async function click(label, tries = 120) {
  for (let i = 0; i < tries; i++) { const b = JSON.parse(R(`JSON.stringify((BTNLOG||[]).filter(b => b.label === ${JSON.stringify(label)} && !b.off).pop() || null)`));
    if (b) { await clickAt(b.x + b.w / 2, b.y + b.h / 2); return; } await frames(1); }
  throw new Error('no button ' + label + '; saw ' + R('JSON.stringify((BTNLOG||[]).map(b=>b.label))'));
}
async function talkThrough() { for (let i = 0; i < 400 && R('!!DLG || busy > 0 && !WINS.length && !MENUS.length && scene === main && !!DLG'); i++) { R('MOUSE.click=1'); await frames(3); } }
(async () => {
  R('globalThis.BTNLOG = []; fit(); scene = title; title.t = 0;');
  await frames(160); shot('1title');
  await click('NEW GAME'); await frames(2);
  await click({ carl: 'PLAY CARL', ghost: 'PLAY SPOOKY GHOST', linda: 'PLAY LINDA', face: 'PLAY FACE', yoko: 'PLAY YOKO', jb: 'PLAY JB GARFIELD' }[mgr]); await frames(2);
  await click('OK'); await frames(2);
  await click('MONOPOLY'); await frames(2);
  await talkThrough(); shot('2map');
  const lot = { carl: 8, ghost: 12, linda: 2, face: 10, yoko: 14, jb: 17 }[mgr]; const [lx, ly] = JSON.parse(R(`JSON.stringify([G.lots[${lot}].x, G.lots[${lot}].y])`));
  await clickAt(16 + lx * 16 + 16, 30 + ly * 10 + 10); await frames(2); shot('3lot');
  await click('BUY THIS LOT AND BUILD'); await frames(3);
  await click('SIZE 1'); await frames(3);
  for (let i = 0; i < 3; i++) await clickAt(100, 33 + 13 + i * 18 + 8);
  shot('4hire'); await click('HIRE'); await frames(3);
  await talkThrough(); shot('5store');
  console.log('opened:', R('storesOf(0).map(storeName).join()'), 'staff', R('staffOf(G.stores[0]).length'), 'speed', R('SPEED'));
  // run to the end of the month at full skip through the taskbar
  for (let m = 0; m < +months; m++) {
    await click('SKIP');
    for (let i = 0; i < 3000 && !R('isOpenWin("settle")'); i++) await frames(1);
    shot('6settle' + m);
    console.log(R(`MONTHS[(G.mo+10)%12] + ' cash ' + mc(playerChain().cash) + ' share ' + Math.round(G.share*100) + '% stars ' + ownerStars() + ' rival stores ' + storesOf(1).length`));
    await click('OK'); await frames(2); await talkThrough();
  }
  // a few interactions on the live store: open windows from the menu bar, use the power
  await clickAt(150, 2); await frames(1); shot('7menu'); R('MENUDROP=null');
  R('openPower(G.stores[0])'); await frames(2);
  const pw = { carl: 'EVERYTHING LOW', ghost: 'SCHEDULE', linda: 'SIGN THE CONTRACT', face: 'RUN THE PILOT', yoko: null, jb: 'OPEN A CASE' }[mgr]; if (!pw) { R("toggleKit(0, 'lunch')"); } const b = pw && JSON.parse(R(`JSON.stringify(BTNLOG.filter(b=>b.label.startsWith(${JSON.stringify(pw)})).pop() || null)`)); if (b && !b.off) await clickAt(b.x + 5, b.y + 5);
  await frames(2); shot('8power'); console.log('power used:', R('playerChain().usedPower'), R('NEWS[0] && NEWS[0].s'));
  console.log('news:', R('NEWS.slice(0,6).map(n=>n.s).join(" | ")'));
})().catch(e => { console.log('ERR', e.message); shot('err'); process.exit(1); });
