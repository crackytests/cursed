// real-browser CARL 2 test with sound on: node tools/c2browser.js [seconds] [mode]
// mode "play": the bot plays from boot. mode "sets": run every set piece once (bus, ski, space, dance, an argument).
// Needs python3 -m http.server 8731 in the repo root. Reports console errors and frame cost; saves screenshots to tools/shots/br2_*.png
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const secs = +(process.argv[2] || 60), mode = process.argv[3] || 'play';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 960, height: 672 } });
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); if (m.text().includes('WARN') || m.text().includes('DONE') || m.text().includes('SETS')) console.log('page:', m.text()); }); p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto('http://localhost:8731/carl2/'); await p.waitForTimeout(800);
  if (mode === 'sets') await p.evaluate(() => { window.titleScreen = async () => {}; });
  await p.keyboard.press('KeyZ'); await p.waitForTimeout(300);
  await p.addScriptTag({ content: fs.readFileSync(path.join(__dirname, 'c2bot.js'), 'utf8') });
  if (mode === 'play') await p.evaluate(() => { BOT.set({}); const L0 = loop; window.loop = t => { BOT.tick(); L0(t); }; });
  else await p.evaluate(() => {
    BOT.set({}); const L0 = loop; window.loop = t => { BOT.tick(); L0(t); };
    run(async () => {
      await wait(700);
      C2 = newC2(); C2.ep = 3; C2.lv = 4; setF2('power'); scene = worldScene; loadMap('lot', 10, 10, 'd');
      const out = {}; out.bus = await desertBusTurbo(); out.ski = await jumpTheShark(); out.space = await inSpace('waves'); out.dance = await boogaloo({ rounds: 3 });
      out.argue = await argue2({ name: 'MALL COP', port: 'MALL COP', hp: 12, power: 2, weak: { GRIEVANCE: 2 }, atk: ['Sir.'] });
      console.log('SETS ' + JSON.stringify(out));
    });
  });
  const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < secs * 1000) {
    await p.waitForTimeout(10000); n++;
    const st = await p.evaluate(() => ({ mode: DBG.mode, map: WD.id, ep: C2 && C2.ep, obj: OBJ && OBJ.text, ac: AC && AC.state, music: curName }));
    console.log('t=' + n * 10 + 's', JSON.stringify(st));
    if (n % 3 === 0) await p.screenshot({ path: path.join(__dirname, 'shots', 'br2_' + mode + '_' + n + '.png') });
  }
  console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].slice(0, 12).join('\n') : 'NO CONSOLE ERRORS');
  await b.close();
})();
