// SAVE THE WORLD menu tests: drive the real menus with button presses and check the results.  node tools/swmenutest.js
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const LS = {}; const ctx = G2.load(require('./swvm'), LS); const R = s => G2.R(ctx, s); ctx.__log = () => {};
R('DBG.fast = 1');
const step = async (n = 1) => { for (let i = 0; i < n; i++) { R('pollInput(); frame++; if (scene && scene.update) scene.update(); { const w = waiters; waiters = []; w.forEach(r => r()); }'); for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r)); } };
const press = async (k, wait = 3) => { R(`kb['${k}'] = 1`); await step(1); R(`kb['${k}'] = 0`); await step(wait); };
const seq = async (...ks) => { for (const k of ks) await press(k); };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  R(require('./swstates').gate.replace(/obj\('MEMORY'[^;]*;\s*run\([\s\S]*$/, '') + `; G.party = ['yoko', 'linda', 'ghost', 'carl']; run(() => goMap('fcinn', 3, 5, 'u'));`);
  await step(40);
  // ---- CRYSTAL: give Yoko the second crystal ----
  await press('start', 6); ok(R('scene === menuScene'), 'field menu opens');
  await seq('down', 'down', 'a'); await step(4); await press('a', 4); // CRYSTAL -> first hero (Yoko)
  await seq('down', 'down', 'a'); await step(4);
  ok(R("hero('yoko').crystal") === R('G.crystals[1]'), 'crystal equipped: ' + R("hero('yoko').crystal"));
  // ---- EQUIP: OPTIMUM on Carl after giving him a better bong ----
  R("invAdd('bong5', 1)");
  await seq('down', 'a'); await step(4); // EQUIP
  await seq('down', 'down', 'down', 'a'); await step(4); // Carl (4th)
  await seq('down', 'down', 'down', 'down', 'down', 'a'); await step(4); // OPTIMUM
  ok(R("hero('carl').eq.w") === 'bong5', 'optimum equips the best bong: ' + R("hero('carl').eq.w"));
  await press('b', 4);
  // ---- ITEM: use a snack on hurt Linda ----
  R("hero('linda').hp = 100");
  for (let i = 0; i < 4 && R('scene === menuScene'); i++) await press('b', 6);
  await press('start', 8); await press('a', 6); // ITEM
  const snackIdx = R("Object.keys(G.inv).filter(k => ITEMS[k] || EQUIP[k]).sort((a, b) => (ITEMS[a] ? 0 : 1) - (ITEMS[b] ? 0 : 1)).indexOf('snack')");
  for (let i = 0; i < snackIdx; i++) await press('down');
  await press('a', 4); await press('down', 3); await press('a', 6); // USE ON -> second hero (Linda)
  ok(R("hero('linda').hp") > 100, 'snack heals Linda: ' + R("hero('linda').hp") + ' wins=' + R('JSON.stringify(WINS.map(w => w.items ? w.items.map(i=>i.t).slice(0,3) : 1))') + ' snacks=' + R('G.inv.snack'));
  await press('b', 4); await press('b', 4); await press('b', 6);
  ok(R('scene !== menuScene'), 'menu closes');
  // ---- SHOP: buy two coffees ----
  const gp0 = R('G.gp'), c0 = R("G.inv.coffee || 0");
  R("run(() => shop('TEST', ['snack', 'coffee']))"); await step(6);
  await press('a', 4); await press('down', 3); await press('a', 4); await press('up', 3); await press('a', 6); await press('b', 4); await press('b', 4);
  ok(R("G.inv.coffee || 0") === c0 + 2 && R('G.gp') === gp0 - 300, 'shop sells 2 coffee for 300: ' + (R("G.inv.coffee || 0") - c0) + ' / ' + (gp0 - R('G.gp')));
  // ---- SAVE and LOAD ----
  R("run(saveMenu)"); await step(6); await press('a', 6); await press('a', 6);
  ok(!!LS.stw_save && JSON.parse(LS.stw_save)[0], 'saved to slot 1');
  R("hero('yoko').lv = 1"); R('loadGame(0)'); ok(R("hero('yoko').lv") > 20, 'load restores the save');
  // ---- BATTLE: real key input for MAGIC (BETTER on Linda), ACCUSE, WELD, SEGMENT ----
  R("addHero('garfield', 24); addHero('oldface', 24); G.party = ['yoko', 'garfield', 'oldface', 'ghost']; for (const id of G.party) hero(id).hp = hero(id).mhp");
  R("delete DBG.botWeld; delete DBG.botReel; delete DBG.botAccuse");
  R("FORMS.testbag = { foes: [['cache', 40, 30]], bg: 'mine', noRun: 1 }; FOES.cache.hp = 999999; run(async () => { await battle('testbag'); })");
  let seen = { weld: 0, accuse: 0, reels: 0, magic: 0 };
  for (let t = 0; t < 4000 && !(seen.weld && seen.accuse && seen.reels && seen.magic); t++) {
    const st = R("JSON.stringify({ m: B && B.menu ? { t: B.menu.title, items: B.menu.items.map(i => i.t), i: B.menu.i } : null, c: B && !!B.cursor, weld: B && B.weld ? B.weld.w.input : null, acc: B && B.accuse ? B.accuse.lv : null, reels: B && B.reels ? B.reels.k : null })");
    const s = JSON.parse(st); if (process.env.V && t % 50 === 0) console.log(t, st);
    if (s.weld) { for (const k of s.weld) await press(k, 1); await step(20); seen.weld = 1; continue; }
    if (s.acc !== null) { if (s.acc >= 1) { await press('a', 4); seen.accuse = 1; } else await step(1); continue; }
    if (s.reels !== null) { await press('a', 8); if (s.reels >= 2) seen.reels = 1; continue; }
    if (s.c) { await press('a', 4); continue; }
    if (s.m) {
      const want = s.m.t === 'YOKO' ? 'MAGIC' : s.m.t === 'GARFIELD' ? 'ACCUSE' : s.m.t === 'OLD FACE' ? 'WELD' : s.m.t === 'GHOST' ? 'SEGMENT' : s.m.items[0];
      const target = s.m.t ? s.m.items.indexOf(want) : (s.m.items.indexOf('BETTER') >= 0 ? s.m.items.indexOf('BETTER') : 0);
      if (s.m.i !== target) await press(target > s.m.i ? 'down' : 'up', 1); else { if (!s.m.t && s.m.items.includes('BETTER')) seen.magic = 1; await press('a', 3); }
      continue;
    }
    await step(1);
  }
  const hits = R("JSON.stringify(B ? B.foes.map(f => f.mhp - f.hp) : [])");
  ok(seen.magic && seen.weld && seen.accuse && seen.reels, 'battle commands by hand: magic ' + seen.magic + ' weld ' + seen.weld + ' accuse ' + seen.accuse + ' segment ' + seen.reels + ' (damage dealt ' + hits + ')');
  console.log(fails ? fails + ' FAILED' : 'ALL PASS');
  process.exit(0);
})().catch(e => { console.log('FATAL', e.stack); process.exit(1); });
