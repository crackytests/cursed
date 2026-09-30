// real-browser smoke test: node tools/browser.js <path e.g. face/> [seconds]
// needs a static server on :8731 (python3 -m http.server 8731 in the repo root). Reports console errors, frame cost, screenshots.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const url = 'http://localhost:8731/' + (process.argv[2] || 'face/'), secs = +(process.argv[3] || 20);
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 960, height: 672 } });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(url); await p.waitForTimeout(1500);
  // measure the cost of one frame of game work (update + draw + present)
  const cost = async () => p.evaluate(() => { const t0 = performance.now(); for (let i = 0; i < 30; i++) { if (scene && scene.update) scene.update(); if (scene && scene.draw) scene.draw(); drawOverlay(); present(); } return ((performance.now() - t0) / 30).toFixed(2); });
  const shot = async n => { await p.screenshot({ path: path.join(__dirname, 'shots', 'br_' + n + '.png') }); };
  await p.keyboard.press('KeyZ'); await p.waitForTimeout(500);
  const t0 = Date.now(); let i = 0;
  while (Date.now() - t0 < secs * 1000) {
    await p.keyboard.down('KeyZ'); await p.waitForTimeout(60); await p.keyboard.up('KeyZ'); await p.waitForTimeout(240);
    if (++i % 15 === 0) { console.log('t=' + ((Date.now() - t0) / 1000).toFixed(0) + 's frame-cost ' + await cost() + 'ms'); await shot(i); }
  }
  console.log('fps-ish:', await p.evaluate(() => new Promise(r => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t < 1000) requestAnimationFrame(f); else r(n); }; requestAnimationFrame(f); })));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'NO CONSOLE ERRORS');
  await b.close();
})();
