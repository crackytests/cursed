// CHROME FORCE in real Chromium: boots the cart, plays the opening by keyboard, checks fps + console errors, screenshots.
// node tools/cfbrowser.js   env: PLAYWRIGHT_PATH (playwright-core), CHROME_PATH, OUT (default tools/shots/cf)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), OUT = process.env.OUT || path.join(__dirname, 'shots', 'cf');
fs.mkdirSync(OUT, { recursive: true });
const server = http.createServer((req, res) => { let rel; try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; } let f = path.resolve(root, '.' + rel); if (!f.startsWith(root)) { res.writeHead(403).end(); return; } if (rel.endsWith('/')) f = path.join(f, 'index.html'); fs.readFile(f, (e, b) => { if (e) { res.writeHead(404).end(); return; } res.setHeader('Content-Type', f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream'); res.end(b); }); });
(async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port, errs = [];
  const b = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 960, height: 672 } });
  pg.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errs.push(m.text()); });
  pg.on('pageerror', e => errs.push(String(e)));
  pg.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('favicon.ico')) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
  await pg.goto(`http://localhost:${port}/cf/index.html`);
  const ev = s => pg.evaluate(s), wait = ms => pg.waitForTimeout(ms), shot = n => pg.screenshot({ path: path.join(OUT, n + '.png') });
  const key = async (k, n = 1) => { for (let i = 0; i < n; i++) { await pg.keyboard.down(k); await wait(60); await pg.keyboard.up(k); await wait(60); } };
  const fps = async () => { const f0 = await ev('frame'); await wait(1000); return (await ev('frame')) - f0; };
  await wait(800); await shot('01_title');
  const fTitle = await fps();
  await key('Enter'); await wait(200); await key('KeyZ'); // NEW GAME
  for (let i = 0; i < 200 && !(await ev('scene === townScene && !DLG && SAVE.flags.met_oren && busy <= 2')); i++) await key('KeyZ'); await wait(400);
  await wait(300); await shot('02_town');
  const fTown = await fps();
  // walk around a little for real
  await pg.keyboard.down('ArrowLeft'); await wait(500); await pg.keyboard.up('ArrowLeft'); await wait(300); await shot('03_town_walk');
  // out the gate
  await ev(`TV.px = TOWNS.signalhold.gate[0]; TV.py = TOWNS.signalhold.gate[1] - 1;`);
  await key('ArrowDown'); await wait(300); await key('KeyZ'); await wait(800); await shot('04_route');
  await key('KeyZ');
  for (let i = 0; i < 120 && !(await ev('scene === battleScene && !!BV.hl && !DLG')); i++) { if (await ev('!!DLG')) await key('KeyZ'); else await wait(150); }
  await shot('05_battle');
  const fBattle = await fps();
  // one turn by hand: walk at the enemy and attack if we can, else stay
  await ev(`(() => { const u = B.units.find(v => v.id === B.turnUnit), f = B.units.find(v => v.side === 'foe' && v.hp > 0); f.x = u.x; f.y = u.y - 1; })()`);
  const plan = await ev(`(() => { const u = B.units.find(v => v.id === B.turnUnit), p = planAI(B, u, {}); return { path: reach(B, u).path(p.x, p.y), act: p.act }; })()`);
  if (false) for (let i = 1; i < plan.path.length; i++) { const [x, y] = plan.path[i], [px, py] = plan.path[i - 1]; await key(x > px ? 'ArrowRight' : x < px ? 'ArrowLeft' : y > py ? 'ArrowDown' : 'ArrowUp'); }
  await key('KeyZ'); await wait(150); await shot('06_diamond');
  let fCut = null;
  if (true) { await key('ArrowUp'); await key('KeyZ'); await wait(150); await key('KeyZ'); await wait(900); await shot('07_cutin'); fCut = await fps(); await wait(1500); await shot('08_cutin2'); }
  else { await key('ArrowDown'); await key('KeyZ'); }
  console.log('fps title', fTitle, 'town', fTown, 'battle', fBattle, 'cut-in', fCut);
  console.log(errs.length ? 'CONSOLE ERRORS:\n' + errs.join('\n') : 'no console errors');
  await b.close(); server.close();
  process.exit(errs.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
