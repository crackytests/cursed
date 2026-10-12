// DARK MONDAY systems tests: items, equipment, food, keys, events, rest, saves (node tools/dmsys.js)
const X = require('./dmvm.js'); const LS = {}; const ctx = X.load(LS); const R = s => X.R(ctx, s);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const press = async (k, n = 1) => { R(`kb.${k}=1`); await X.step(ctx, n); R(`kb.${k}=0`); await X.step(ctx, 10); };
R("LEVELS.T = mkLevel({ name: 'ARENA', theme: 'cellar', start: [1, 1, 1], loot: [['PROP_PILLS', 2, 1], ['PLATE_GLASS', 2, 1]], rows: ['##############', '#............#', '#......p.....#', '#.....D......#', '#............#', '##############'], locks: { '6,3': 'KEY_CYAN' }, decor: { '3,0,S': { k: 'lever' }, '4,0,S': { k: 'sign' } }, text: { '4,0,S': 'IT SAYS: BRING A TOWEL.' } });");
const fresh = () => R("_seed = 3; newGame('T'); scene = worldScene; GM.x = 1; GM.y = 1; GM.dir = 1; anyKey = true;");
(async () => {
  fresh();
  // floor items: pick up, equip, armor class
  const ac0 = R('acOf(PARTY[0])'); await press('a'); ok(R('HELD') === 'PROP_PILLS', 'use on a floor pile picks up the first item: ' + R('HELD'));
  R('grab(PARTY[0], ["pack", 5])'); ok(R('PARTY[0].pack[5]') === 'PROP_PILLS' && R('HELD') === null, 'grab places the item in the pack');
  await press('a'); ok(R('HELD') === 'PLATE_GLASS', 'second pickup: ' + R('HELD'));
  R('grab(PARTY[0], ["eq", "head"])'); ok(R('HELD') === 'PLATE_GLASS', 'body armor does not go in the head slot'); R('grab(PARTY[0], ["eq", "body"])');
  ok(R('acOf(PARTY[0])') === ac0 + 4, 'glass plate adds 4 AC (' + ac0 + ' -> ' + R('acOf(PARTY[0])') + ')');
  // dropping
  R('HELD = "TOWEL"'); await press('b'); ok(R('floorItems(GM.lv, 2, 1).length') === 1 && R('HELD') === null, 'X drops the held item in the cell ahead');
  // food and potions
  R('PARTY[0].food = 30; PARTY[0].hp = 5;'); R('useItem(PARTY[0], ["pack", 0])'); R('useItem(PARTY[0], ["pack", 1])');
  ok(R('PARTY[0].food') >= 60 || R('PARTY[0].hp') > 5, 'eating and drinking work: food ' + R('PARTY[0].food') + ' hp ' + R('PARTY[0].hp'));
  // food clock
  R('GM.ft = 0; PARTY.forEach(c => { c.food = 50; })'); await X.step(ctx, 1810); ok(R('PARTY[0].food') === 49, 'food drops one point every half minute: ' + R('PARTY[0].food'));
  R('PARTY[1].food = 0; GM.ft = 1799; PARTY[1].hp = 3'); await X.step(ctx, 3); ok(R('PARTY[1].hp') === 2, 'starving costs a hit point');
  // locked door and keys
  R('GM.x = 6; GM.y = 2; GM.dir = 2;'); await press('a'); ok(R('GM.lv.st.door["6,3"].open') === 0, 'locked door refuses without its key');
  R('giveItem(PARTY[2], "KEY_CYAN")'); await press('a'); await X.step(ctx, 14); ok(R('GM.lv.st.door["6,3"].open') > .95 && !R('partyHas("KEY_CYAN")'), 'the key opens it and is used up');
  // events: plate, lever, sign
  R('GM.lv.ev = { step: { "7,2": g => { g.flags.plate = 1; } }, lever: { "3,0,S": (g, on) => { g.flags.lever = on ? 1 : 0; } } }; GM.x = 6; GM.y = 2; GM.dir = 1;'); await press('up'); await X.step(ctx, 10);
  ok(R('GM.flags.plate') === 1 && R('GM.lv.st.mark["7,2"]') === 1, 'stepping on a plate runs its event and lights it');
  R('GM.x = 3; GM.y = 1; GM.dir = 0;'); await press('a'); ok(R('GM.flags.lever') === 1 && R('GM.lv.st.dec["3,0,S"]') === true, 'a lever toggles and fires its event');
  R('GM.x = 4; GM.y = 1; GM.dir = 0;'); await press('a'); await X.step(ctx, 4); ok(R('!!DLG') && R('DLG.lines.join(" ")').includes('TOWEL'), 'a sign speaks: ' + R('DLG && DLG.lines.join(" ")')); await press("a"); await press("a");
  // saves round trip
  R('fresh = 0'); R("_seed = 3; newGame('T'); scene = worldScene; GM.x = 5; GM.y = 4; GM.dir = 3; PARTY[0].hp = 7; PARTY[0].lvl = 3; PARTY[2].pack[0] = 'BIG_PILLS'; GM.lv.items = [{ id: 'TOWEL', x: 9, y: 4 }]; GM.flags.hello = 1; GM.lv.mobs = [mkMob('INTERN', 10, 4)]; saveGame(0);");
  R("GM.x = 1; PARTY[0].hp = 40; PARTY[0].lvl = 1; GM.lv.items = []; GM.lv.mobs = []; GM.flags = {};"); ok(R('loadGame(0)'), 'load finds the slot');
  ok(R('GM.x') === 5 && R('GM.dir') === 3 && R('PARTY[0].hp') === 7 && R('PARTY[0].lvl') === 3 && R('PARTY[2].pack[0]') === 'BIG_PILLS' && R('GM.flags.hello') === 1 && R('GM.lv.items.length') === 1 && R('GM.lv.mobs.length') === 1, 'party, flags, floor and monsters survive a save and load');
  ok(R('loadGame(2)') === false, 'an empty slot says so');
  // resting heals and refills spell points
  R("_seed = 5; newGame('T'); scene = worldScene; GM.lv.mobs = []; PARTY.forEach(c => { c.hp = 1; c.food = 80; });"); R('run(rest)'); await X.step(ctx, 200);
  ok(R('PARTY.every(c => c.hp > 1 || c.max <= 12)') && R('PARTY[0].food') < 80, 'resting heals and costs food: hp ' + R('PARTY[0].hp') + ' food ' + R('PARTY[0].food'));
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
