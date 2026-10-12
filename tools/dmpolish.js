// DARK MONDAY polish tests (node tools/dmpolish.js): options, mouse menus, the manual, copy protection, CHAT DECIDES, the notebook map
const X = require('./dmvm.js'); const LS = {}; let ctx = X.load(LS); let R = s => X.R(ctx, s);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const step = n => X.step(ctx, n); const tap = async (k, g = 3) => { R(`kb.${k}=1`); await step(2); R(`kb.${k}=0`); await step(g); };
const lit = () => R('(() => { let n = 0; for (let i = 0; i < SCREEN.length; i += 37) if (SCREEN[i] !== 0xff000000 && ((SCREEN[i] & 0xffffff) !== 0x060406)) n++; return n; })()');
(async () => {
  R("anyKey = true; newGame(1, ['CARL','LINDA','JB','FACE'], true); scene = worldScene;");
  // ---- options: they apply, persist and survive a reload
  R("OPT.speed = 2; OPT.chat = 0; OPT.notebook = 1; applyOpts(); saveOpts();"); ok(R('TSPEED') === 12, 'INSTANT text speed sets the typing multiplier (' + R('TSPEED') + ')');
  R('run(async () => { await say("Test line for the typewriter."); })'); await step(8); ok(R('DLG && DLG.n >= DLG.lines.join("").length'), 'instant text finishes a line in a few frames'); await tap('a'); await tap('a');
  ok(JSON.parse(LS.dm_opts).speed === 2 && JSON.parse(LS.dm_opts).notebook === 1, 'options are saved to localStorage');
  ctx = X.load(LS); R = s => X.R(ctx, s); ok(R('OPT.speed') === 2 && R('OPT.notebook') === 1 && R('TSPEED') === 12, 'options come back after a reload');
  R("OPT.speed = 0; OPT.chat = 1; applyOpts(); anyKey = true; newGame(1, ['CARL','LINDA','JB','FACE'], true); scene = worldScene;");
  // ---- the mouse works in menus and turns dialogue pages
  R("MOUSE.on = 1; globalThis.__r = -9; run(async () => { __r = await choose(['ONE', 'TWO', 'THREE'], { x: 100, y: 100 }); });"); await step(3);
  R('MOUSE.x = 120; MOUSE.y = 100 + 5 + 12 + 3; MOUSE.mv = 1;'); await step(2); ok(R('MENUS[0].i') === 1, 'hovering a menu row moves the highlight');
  R('MOUSE.click = 1;'); await step(3); ok(R('__r') === 1 && R('MENUS.length') === 0, 'clicking a menu row chooses it');
  R("MOUSE.on = 1; run(async () => { await say('Click to turn the page.'); __r = 'done'; });"); await step(120); R('MOUSE.click = 1;'); await step(10); ok(R('__r') === 'done' && !R('DLG'), 'a click turns the dialogue page');
  R("OPT.mouse = 0; applyOpts();"); ok(R('MOUSE.on') === 0, 'turning the mouse off hides the cursor'); R('OPT.mouse = 1; applyOpts();');
  // ---- the manual: it knows every spell
  const pages = R('manualPages().map(p => p[0] + " " + p[1].join(" ")).join(" ")'); ok(R('Object.keys(SPELLS)').every(n => pages.includes(n)), 'the manual lists every spell');
  R("globalThis.__m = 0; run(async () => { await manual(3); __m = 1; });"); await step(5); ok(lit() > 100 && R('__m') === 0, 'the manual draws'); await tap('right'); await tap('b'); await step(5); ok(R('__m') === 1, 'X closes the manual and gives control back');
  // ---- copy protection: three wrong answers still let you in, and it only shows once
  R("delete globalThis.__p; LS_P = 0; run(async () => { await protection(); __p = 1; });"); await step(5); ok(R('typeof __p') === 'undefined' && lit() > 100, 'the code wheel shows on first boot');
  for (let k = 0; k < 3; k++) { const wrong = R('(() => { const a = (typeof ANS_ !== "undefined") ? 0 : 0; return 0; })()'); await tap('a'); await step(2); }
  await step(240); ok(R('typeof __p') !== 'undefined' || R('dmMeta().protect') === 1, 'it lets you in after three tries (' + R('dmMeta().protect') + ')');
  R("globalThis.__p2 = 0; run(async () => { await protection(); __p2 = 1; });"); await step(4); ok(R('__p2') === 1, 'and it never shows again');
  R('scene = worldScene; MENUS.length = 0; DLG = null;');
  // ---- CHAT DECIDES
  R("OPT.chat = 0; globalThis.__c = -1; run(async () => { __c = await chatDecide('X', ['A', 'B'], 1); });"); await step(2); ok(R('__c') === 1, 'with chat prompts off the default is taken at once');
  R("OPT.chat = 1; __c = -1; run(async () => { __c = await chatDecide('X', ['A', 'B', 'C'], 0, 5); });"); await step(3); ok(R('!!CHATQ') && lit() > 100, 'the prompt shows'); await tap('c3'); ok(R('__c') === 2 && !R('CHATQ'), 'pressing 3 picks the third option');
  R("__c = -1; run(async () => { __c = await chatDecide('X', ['A', 'B', 'C'], 0, 1); });"); await step(90); ok(R('__c') >= 0 && !R('CHATQ'), 'the timer runs out and the game chooses (' + R('__c') + ')');
  R("__c = -1; MOUSE.on = 1; run(async () => { __c = await chatDecide('X', ['A', 'B', 'C'], 0, 5); });"); await step(3); R('MOUSE.x = 200; MOUSE.y = 96 + 22 + 5; MOUSE.mv = 1;'); await step(2); R('MOUSE.click = 1;'); await step(3); ok(R('__c') === 1, 'clicking an option picks it');
  // the three chat scenes do something
  R("newGame(1, ['CARL','LINDA','JB','FACE'], true); scene = worldScene; OPT.chat = 1; run(async () => { await SCENES.chatButton(GM); });"); for (let k = 0; k < 400 && !R('CHATQ'); k++) { R('kb.a = ' + (k % 6 === 0 ? 1 : 0)); await step(1); } R('kb.a = 0'); await step(2); await tap('c1', 10);
  for (let k = 0; k < 300 && (R('!!DLG') || R('GM.hold')); k++) { R('kb.a = ' + (k % 6 === 0 ? 1 : 0)); await step(1); } R('kb.a = 0');
  ok(R('GM.lv.mobs.every(m => m.awake)') && R('PARTY.reduce((n, c) => n + c.pack.filter(i => i === "BIG_PILLS").length, 0)') >= 2, 'pressing the red button wakes the freezer and drops pills');
  // ---- the notebook map
  R("newGame(1, ['CARL','LINDA','JB','FACE'], true); scene = worldScene; OPT.notebook = 1;"); const s0 = R('GM.lv.seen.reduce((a, b) => a + b, 0)');
  R('GM.x = 8; GM.y = 2; GM.dir = 1; markSeen(GM)'); const s1 = R('GM.lv.seen.reduce((a, b) => a + b, 0)'); ok(s1 > s0 && s1 < R('GM.lv.w * GM.lv.h') / 2, 'looking around fills in the notebook but not everything (' + s0 + ' -> ' + s1 + ' of ' + R('GM.lv.w * GM.lv.h') + ')');
  R("globalThis.__mp = 0; run(async () => { await showMap(); __mp = 1; });"); await step(20); ok(lit() > 150, 'the notebook draws'); const withMap = lit(); await tap('b'); await step(4);
  R("OPT.notebook = 0; run(async () => { await showMap(); });"); await step(20); ok(lit() > 50, 'retail mode shows the graph paper page'); await tap('b');
  R("saveGame(1); GM.lv.seen = new Uint8Array(GM.lv.w * GM.lv.h); loadGame(1)"); ok(R('GM.lv.seen.reduce((a, b) => a + b, 0)') === s1, 'the notebook is saved and loaded');
  // ---- the art: every item has its own icon; every intro still draws, animates and stays inside the screen
  const sigs = R('Object.keys(ITEMS).filter(k => !ITEMS[k].hidden).map(id => { const b = itemIcon(id); let h = 0, n = 0; for (let i = 0; i < b.d.length; i++) { h = (h * 31 + b.d[i]) | 0; if (b.d[i]) n++; } return [id, h, n, b.w, b.h]; })');
  ok(sigs.every(s => s[4] === 22 && s[3] === 22 && s[2] > 40), 'every item icon is 22x22 and actually drawn (' + sigs.length + ' icons)'); ok(new Set(sigs.map(s => s[1])).size === sigs.length, 'no two items share an icon');
  for (const name of R('Object.keys(BACKDROPS)')) { R('scene = null; INTRO_PARTY = ["CARL","LINDA","JB","FACE"]; post.fade = 0; backdrop(' + JSON.stringify(name) + ')'); await step(10); const a = lit(); const sumA = R('SCREEN.reduce((n, c, i) => (n + c * (i % 7)) | 0, 0)'); await step(25); const sumB = R('SCREEN.reduce((n, c, i) => (n + c * (i % 7)) | 0, 0)'); ok(a > 3000 && sumA !== sumB, 'the "' + name + '" still draws and moves (lit ' + a + ')'); }
  R("globalThis.__i = 0; scene = null; MENUS.length = 0; DLG = null; post.fade = 0; run(async () => { await intro(['CARL', 'LINDA', 'GHOST', 'JB']); __i = 1; });");
  for (let k = 0; k < 3000 && !R('__i'); k++) { R('kb.a = ' + (k % 5 === 0 ? 1 : 0)); await step(1); } R('kb.a = 0'); ok(R('__i') === 1, 'the whole intro plays through to the stairs');
  // ---- title screen extras
  R("run(endingsList)"); await step(5); ok(lit() > 100, 'the endings list draws'); await tap('a');
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
