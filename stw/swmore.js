'use strict';
// ================= SAVE THE WORLD: content pass — the auction, the four old cartridges, SLOT ZERO, THE THIRD GENERATOR,
// the hermit's mountain, Linda's quarterly meeting, THE TALK SHOW, new foes, the monster log, late-game shops =================
const T2 = (who, x, y, o) => Object.assign({ who, x, y }, o || {});
OW_ICON.cart = TS16(g => { g.r(3, 2, 10, 13, 8); g.r(3, 2, 10, 2, 7); g.r(5, 5, 6, 5, 6); g.r(4, 13, 8, 2, 9); g.p(11, 2, 0); });
// ---------------- odds and ends ----------------
Object.assign(EQUIP, { goldpen: { name: 'THE GOLD PEN', slot: 'w', cls: 'rod', atk: 150, mag: 18, price: 0, who: ['linda'] } });
Object.assign(ITEMS, { brucephoto: { name: 'SIGNED PHOTO', price: 0, desc: '"TO THE PARTY! SORRY ABOUT THE RIVER! -BRUCE"', field: 'photo' } });
// gadgets that had no way to be found
MAPS.castleeng.chests.push([7, 3, 'noise']); MAPS.gfhouse2.chests.push([2, 6, 'flash']); MAPS.factory1.chests.push([1, 14, 'bio']);
// the corrupted save keeps its shops, but the shelves have moved on
const LATE_GOODS = ['meal', 'feast', 'coffee', 'espresso', 'extralife', 'patch', 'tent', 'warp', 'bomb', 'ice', 'battery'];
const LATE_GEAR = ['rod5', 'bong5', 'lance5', 'torch5', 'mic5', 'cane5', 'toy5', 'dart5', 'armor5', 'robe2', 'helm5', 'strap', 'focuslens', 'sneakers'];
MAPS.cbshop.npcs = () => [T2('clerk', 4, 2, { dir: 'd', talk: () => G.world === 2 ? shop('NEW FILE GOODS', LATE_GOODS, 'SHOPKEEPER') : shop('COLDBOOT GOODS', ['snack', 'antivirus', 'coffee', 'extralife', 'tent', 'earplugs'], 'SHOPKEEPER') })];
MAPS.cbarmor.npcs = () => [T2('miner', 4, 2, { dir: 'd', talk: () => G.world === 2 ? shop('NEW FILE OUTFITTERS', LATE_GEAR, 'SHOPKEEPER') : shop('OUTFITTERS', ['wand', 'bong2', 'lance2', 'torch2', 'mic2', 'cane2', 'toy2', 'dart2', 'hoodie', 'suit', 'robe', 'cap', 'hardhat'], 'SHOPKEEPER') })];
// rumors in the corrupted save, so the side content is findable
MAPS.newfile.npcs = (orig => () => orig().concat([T2('newfile', 4, 19, { wander: 1, talk: talkS('NEW FILE', 'I DON\'T REMEMBER MY NAME BUT I REMEMBER RUMORS. RUMORS STICK.',
  'FOUR OLD CARTRIDGES FELL OUT OF THE SKY WHEN THE SAVE WAS OVERWRITTEN. ONE GREEN, ONE PINK, ONE RED, ONE GRAY. THEY\'RE STILL RUNNING.',
  'THE OLD MINES NORTH OF HERE STILL GO DOWN TO SLOT ZERO. SOMETHING DOWN THERE IS WAITING FOR SOMEONE TO PRESS START.',
  'OUT ON THE EASTERN PLAINS THERE\'S A GENERATOR THAT ONLY TALKS TO KIDS.',
  'PRESTIGE IS FULL OF NEW FILES NOW. THEY\'RE HOLDING A MEETING NOBODY REMEMBERS SCHEDULING.',
  'AND SOMEONE OPENED A TALK SHOW EAST OF THE CRATER. YOU BET THINGS. YOU FIGHT. THE AUDIENCE CLAPS. NOBODY KNOWS WHY.') })]))(MAPS.newfile.npcs);

// ---------------- the corrupted save can come in other cartridges' colors ----------------
// a map or a battle may name a tone (dmg, pink, red, gray); everything but the party is crushed to it
const _crush = crushRect;
crushRect = function (x0, y0, w, h, keepLead, tone) {
  const t = tone || (M && M.def.tone) || 'dmg', T = TONES[t].map(hex);
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const o = y * W + x, l = lum(FB[o]); FB[o] = T[l > 170 ? 0 : l > 110 ? 1 : l > 55 ? 2 : 3]; }
  if (keepLead && M && !PL.hide) drawLead(PL.px - Math.round(CAM.x), PL.py - Math.round(CAM.y) - 8);
};
const _loadMap = loadMap;
loadMap = function (id, x, y, dir) { _loadMap(id, x, y, dir); if (G.world === 2 && M.def.tone && !M.def.color) { M.P = legacyPal(M.ts.P, M.def.tone); for (const n of M.npcs) if (n.who && !n.color) n.P = legacyPal(ART.pal(n.who), M.def.tone); } };
const _bg = drawBattleBG;
drawBattleBG = function (kind) { const BG = BATTLEBG[kind] || BATTLEBG.grass; BG(); if (G && G.world === 2) crushRect(0, 0, W, BWIN, false, B && B.form.tone); };
const _mkFoe = mkFoeUnit;
mkFoeUnit = function (id, x, y) { const u = _mkFoe(id, x, y); if (u.d.tone) u.pal = legacyPal(u.spr.P, u.d.tone); return u; };

// ---------------- the BODYGUARD relic: protects allies in trouble ----------------
const _foeAct = foeAct;
foeAct = async function (a) {
  if ((a.move.kind === 'fight' || !a.move.kind) && !a.move.run && a.targets.length === 1) {
    const t = a.targets[0], g = t && t.side === 'p' && t.hp > 0 && t.hp < t.mhp / 4 && B.party.find(p => p !== t && p.hp > p.mhp / 2 && p.st.flags.cover);
    if (g) { a.targets = [g]; bmsg(g.name + ' STEPS IN FRONT OF ' + t.name + '.'); }
  }
  return _foeAct(a);
};

// ---------------- the MONSTERS log ----------------
async function monsterLog() {
  const ids = Object.keys(FOES).filter(k => G.seen[k]);
  if (!ids.length) { await mmsg('NOTHING SEEN YET.'); return; }
  await mlist(ids.map(k => ({ t: FOES[k].name.slice(0, 22), r: 'LV' + FOES[k].lv })), { x: 30, y: 20, w: 260, rows: 12, title: 'MONSTERS (' + ids.length + '/' + Object.keys(FOES).length + ')', dimOk: 1,
    help: j => { const d = FOES[ids[j]]; const w = d.weak.map(e => ELEM[e]).join(' '); return 'HP ' + d.hp + (w ? '  WEAK: ' + w : '') + (d.absorb.length ? '  ABSORBS: ' + d.absorb.map(e => ELEM[e]).join(' ') : '') + (d.steal ? '  HOLDS: ' + itemName(d.steal) : '') + (d.boss ? '  (BOSS)' : ''); } });
}
const _fieldMenu = fieldMenu;
fieldMenu = async function () {
  FIELD_LOCK++; sfx('ok');
  MENU_BG = FB.slice(); const prev = scene; scene = menuScene;
  const party = pushWin({ draw: () => drawPartyPanel() });
  try {
    for (;;) {
      const canSave = G.inWorld || (M && (M.def.saves || []).some(([x, y]) => Math.abs(x - PL.x) + Math.abs(y - PL.y) <= 1));
      const opts = ['ITEM', 'MAGIC', 'CRYSTAL', 'EQUIP', 'STATUS', 'ORDER', 'COMBOS', 'MONSTERS', 'CONFIG', 'SAVE'];
      const i = await mlist(opts.map(t => ({ t, dim: t === 'SAVE' && !canSave || t === 'CRYSTAL' && !G.crystals.length })), { x: 238, y: 6, w: 76, rows: 10 });
      if (i < 0) break;
      const o = opts[i];
      if (o === 'ITEM') await itemsMenu();
      if (o === 'MAGIC') { const r = await pickHero('MAGIC'); if (r) await spellsMenu(r); }
      if (o === 'CRYSTAL') { const r = await pickHero('CRYSTAL'); if (r) await crystalMenu(r); }
      if (o === 'EQUIP') { const r = await pickHero('EQUIP'); if (r) await equipMenu(r); }
      if (o === 'STATUS') { const r = await pickHero('STATUS'); if (r) await statusScreen(r); }
      if (o === 'ORDER') await orderMenu();
      if (o === 'COMBOS') await comboBook();
      if (o === 'MONSTERS') await monsterLog();
      if (o === 'CONFIG') await configMenu();
      if (o === 'SAVE') await saveMenu();
    }
  } finally { popWin(party); WINS.length = 0; scene = prev; MENU_BG = null; FIELD_LOCK--; }
};

// ---------------- THE AUCTION HOUSE (Prestige; it survives the new game) ----------------
const LOTS = [
  { k: 'nose', name: 'A SAVE CRYSTAL: MISS NOSE', desc: 'SHE HAS A WHISTLE. SHE WILL USE IT.', start: 3000, cap: 6000, give: () => G.crystals.push('nose') },
  { k: 'photo', name: 'A SIGNED PHOTO OF A SHARK', desc: 'PROVENANCE: A RIVER. AND AN OPERA. AND A HARBOR.', start: 50, cap: 400, give: () => invAdd('brucephoto') },
  { k: 'bodyguard', name: 'A RELIC: BODYGUARD', desc: 'A JACKET THAT STEPS IN FRONT OF PEOPLE.', start: 1500, cap: 3500, give: () => invAdd('bodyguard') },
  { k: 'bouncer', name: 'A SAVE CRYSTAL: THE BOUNCER', desc: 'YOU ARE NOT ON THE LIST. HE IS THE LIST.', start: 5000, cap: 9000, give: () => G.crystals.push('bouncer') },
  { k: 'pager', name: 'A RELIC: PAGER', desc: 'IT BEEPS WHEN TROUBLE IS COMING, SO YOU CAN WALK THE OTHER WAY.', start: 1000, cap: 2500, give: () => invAdd('pager') },
  { k: 'megalife', name: 'A CONTINUE+', desc: 'ONE OF THE LAST ONES. NOBODY KNOWS WHO MADE THEM.', start: 6000, cap: 11000, w: 2, give: () => invAdd('megalife') },
];
async function auction() {
  FIELD_LOCK++;
  try {
    const lot = LOTS.find(l => !flag('lot_' + l.k) && (!l.w || l.w === G.world));
    const A = s => say(s, 'AUCTIONEER');
    if (!lot) { await A('THAT\'S EVERYTHING. COME BACK WHEN SOMEONE RICH DIES. I MEAN, RETIRES.'); return; }
    await A('NEXT LOT: ' + lot.name + '. ' + lot.desc + ' OPENING BID: ' + lot.start + ' GP.');
    const rivals = ['THE MOVIE STAR', 'A RICH CHILD', 'A MAN IN A WHITE SUIT'], cap = lot.cap + rnd(Math.floor(lot.cap / 3));
    let price = lot.start, step = Math.max(50, Math.round(lot.start / 5 / 50) * 50), leader = rivals[rnd(3)];
    await say(leader + ' BIDS ' + price + '.', null);
    for (;;) {
      const c = await ask('THE BID IS ' + price + ' GP. YOU HAVE ' + G.gp + '.', 'AUCTIONEER', ['BID ' + (price + step), 'PASS']);
      if (c !== 0) { await A('SOLD, TO ' + leader + ', FOR ' + price + '.'); if (leader === 'A RICH CHILD') await say('I\'M GOING TO PUT IT IN MY ROOM AND NEVER LOOK AT IT.', 'A RICH CHILD'); setFlag('lot_' + lot.k); return; }
      if (G.gp < price + step) { await A('YOU DON\'T HAVE THAT. WE CHECK. WE ALWAYS CHECK.'); continue; }
      price += step; leader = 'YOU';
      if (price + step > cap) break;
      leader = rivals[rnd(3)]; price += step; sfx('tick'); await say(leader + ' BIDS ' + price + '.', null);
    }
    G.gp -= price; setFlag('lot_' + lot.k); lot.give(); sfx('get');
    await A('SOLD! TO THE PEOPLE IN THE BACK, FOR ' + price + '. CONGRATULATIONS. NOBODY ELSE WANTED IT AS MUCH AS YOU.');
  } finally { FIELD_LOCK--; }
}
MAPS.auction = INT(['############', '#B..t..t..B#', '#..........#', '#.________.#', '#..........#', '#.t.t..t.t.#', '#..........#', '#.t.t..t.t.#', '#####D######'], { name: 'THE AUCTION HOUSE', theme: 'opera', music: 'operalobby',
  npcs: () => [T2('exec', 5, 2, { dir: 'd', talk: () => auction() }), T2('exec', 2, 6, { P: ART.pal('suit') }), T2('child', 8, 6, {}), T2('woman', 3, 4, { wander: 1, talk: talkS('OLD WOMAN', 'I BID ON EVERYTHING. I DON\'T WANT ANY OF IT. I JUST LIKE RAISING MY HAND.') })] });
MAPS.auction.exits = [{ x: 5, y: 8, to: 'prestige', tx: 3, ty: 6, dir: 'd', if: () => G.world === 1 }, { x: 5, y: 8, to: 'lindaville', tx: 3, ty: 6, dir: 'd', if: () => G.world === 2 }];
// a doorway into the auction house, top-left of Prestige
(() => { const rows = MAPS.prestige.rows.map(r => r.split('')); for (let y = 3; y < 6; y++) for (let x = 2; x < 6; x++) rows[y][x] = '#'; rows[5][3] = 'D'; rows[6][3] = ','; MAPS.prestige.rows = rows.map(r => r.join('')); })();
MAPS.prestige.exits.push({ x: 3, y: 5, to: 'auction', tx: 5, ty: 7, dir: 'u' });

// ---------------- PRESTIGE, after: Linda's quarterly meeting ----------------
MAPS.lindaville = { name: 'PRESTIGE (NEW FILE)', theme: 'town', music: 'newfile', rows: MAPS.prestige.rows,
  exits: [{ x: 11, y: 19, w: 2, to: 'world', wx: 24, wy: 100 }, { x: 3, y: 5, to: 'auction', tx: 5, ty: 7, dir: 'u' },
    { x: 4, y: 10, to: 'prinn', tx: 4, ty: 7, dir: 'u' }, { x: 18, y: 10, to: 'lvshop', tx: 4, ty: 7, dir: 'u' }, { x: 4, y: 16, to: 'lvarmor', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T2('newfile', 11, 11, { id: 'podium', talk: () => quarterlyMeeting() }),
    T2('newfile', 6, 12, { wander: 2, talk: talkS('NEW FILE', flag('meetingDone') ? 'I\'M PRESTIGE. WE\'RE ALL PRESTIGE. SHE SAID SO AND NOW IT\'S IN THE MINUTES.' : 'THERE\'S A MEETING IN THE PLAZA. NOBODY KNOWS WHO CALLED IT. WE ALL CAME ANYWAY. IT FELT REQUIRED.') }),
    T2('newfile', 17, 12, { wander: 2, talk: talkS('NEW FILE', 'THE AUCTION HOUSE IS STILL OPEN. IT DOESN\'T NEED TO REMEMBER ANYTHING. IT JUST NEEDS BIDS.') }),
  ],
  enter: async () => { if (!flag('meetingDone')) obj('A MEETING IN THE PLAZA. SOMEONE SHOULD RUN IT.', 'lindaville', 11, 11); } };
MAPS.prinn.exits = [{ x: 4, y: 7, to: 'prestige', tx: 4, ty: 11, dir: 'd', if: () => G.world === 1 }, { x: 4, y: 7, to: 'lindaville', tx: 4, ty: 11, dir: 'd', if: () => G.world === 2 }];
MAPS.lvshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'GOODS', music: 'newfile', exits: [{ x: 4, y: 7, to: 'lindaville', tx: 18, ty: 11, dir: 'd' }], npcs: () => [T2('newfile', 3, 2, { dir: 'd', talk: () => shop('GOODS', LATE_GOODS, 'NEW FILE') })] });
MAPS.lvarmor = INT(['########', '#B.B.B.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'ARMORY', music: 'newfile', exits: [{ x: 4, y: 7, to: 'lindaville', tx: 4, ty: 17, dir: 'd' }], npcs: () => [T2('newfile', 3, 2, { dir: 'd', talk: () => shop('ARMORY', LATE_GEAR, 'NEW FILE') })] });
async function quarterlyMeeting() {
  if (flag('meetingDone')) { await say('THE MINUTES ARE APPROVED. THE TOWN REMEMBERS ITS NAME. IT IS PRESTIGE.', 'NEW FILE'); return; }
  FIELD_LOCK++;
  try {
    partyWith('linda');
    await say('...ARE YOU HERE TO RUN THE MEETING? SOMEONE HAS TO. WE DON\'T KNOW HOW. WE DON\'T KNOW WHO WE ARE.', 'NEW FILE');
    await LI('THEN I\'LL RUN IT. I\'VE RUN WORSE MEETINGS IN WORSE TOWNS. I PRESENT. THAT\'S WHAT I DO.');
    const AG = [['ITEM ONE.', ['WHO YOU ARE.', 'Q3 PROJECTIONS.', 'THE PARKING SITUATION.']], ['ITEM TWO.', ['WHAT YOU BUILT.', 'WHAT YOU OWE.', 'WHO IS TO BLAME.']], ['ITEM THREE.', ['THAT NOBODY OWNS YOU.', 'THAT I OWN YOU.', 'ANY OTHER BUSINESS.']]];
    for (let i = 0; i < AG.length; i++) {
      const c = await ask(AG[i][0], 'CEO LINDA', AG[i][1]);
      if (c !== 0) { await say('A NEW FILE YAWNS. SOMEONE CHECKS A WATCH THAT ISN\'T THERE.', null); await LI('...LET ME START OVER. SAME MEETING. BETTER AGENDA.'); i = -1; continue; }
      await say(['THE NEW FILES LOOK AT EACH OTHER. ONE OF THEM SAYS: "I\'M... MARGARET?"', 'SOMEONE POINTS AT THE FOUNTAIN. "I FIXED THAT. LAST SPRING. I FIXED THAT."', 'THE PLAZA GOES QUIET. THEN SOMEONE STARTS CLAPPING. THEN EVERYONE.'][i], null);
    }
    await LI('MEETING ADJOURNED. YOU\'RE PRESTIGE. IT\'S IN THE MINUTES NOW. NOBODY CAN OVERWRITE THE MINUTES.');
    setFlag('meetingDone'); invAdd('goldpen'); sfx('get');
    await say('THE TOWN GAVE LINDA THE GOLD PEN. (LINDA\'S BEST WEAPON. SHE DOESN\'T SIGN THINGS WITH IT. SHE APPROVES THEM.)', null);
    nextReunionObj();
  } finally { FIELD_LOCK--; }
}

// ---------------- THE FOUR OLD CARTRIDGES (optional superbosses) ----------------
const CARTS = {
  green: { tone: 'dmg', name: 'THE GREEN CARTRIDGE', label: 'ABOVE & BELOW', at: [16, 30], reward: 'turbobutton', place: 'cartG' },
  pink: { tone: 'pink', name: 'THE PINK CARTRIDGE', label: 'CEO LINDA', at: [110, 58], reward: 'luckycoin', place: 'cartP' },
  red: { tone: 'red', name: 'THE RED CARTRIDGE', label: 'LIVE FROM BEYOND', at: [40, 104], reward: 'backup', place: 'cartR' },
  gray: { tone: 'gray', name: 'THE GRAY CARTRIDGE', label: 'THE TOWEL', at: [10, 72], reward: 'hallpass', place: 'cartY' },
};
const cartDraw = (label) => g => {
  g.r(6, 0, 60, 84, 2); g.r(6, 0, 60, 6, 4); g.r(58, 0, 8, 10, 0); g.r(12, 12, 48, 40, 12); g.r(14, 14, 44, 36, 9); wrapT(label, 7).slice(0, 3).forEach((l, i) => FOEART.gtext(g, l, 16, 17 + i * 10, 12));
  for (let x = 14; x < 58; x += 4) g.r(x, 76, 2, 8, 6); g.e(36, 64, 4, 4, 13); g.e(36, 64, 2, 2, 11);
};
const CART_MOVES = {
  green: [MV('BLOW ON IT', { sp: 80, elem: 'legacy', tgt: 'all', split: 1 }), MV('LINK CABLE', { sp: 70, drain: 1 }), MV('LOW BATTERY', { status: 'buffer', hit: 70, tgt: 'all' }), { kind: 'fight' }],
  pink: [MV('BUY OUT', { erase: 20 }), MV('CLOSING TIME', { status: 'sleep', hit: 50, tgt: 'all' }), MV('MARKUP', { sp: 82, tgt: 'all', split: 1 }), { kind: 'fight' }],
  red: [MV('BOO', { status: 'scram', hit: 50, tgt: 'all' }), MV('LIVE FROM BEYOND', { sp: 84, tgt: 'all', split: 1 }), MV('RERUN', { run: async (u) => { const n = Math.floor(u.mhp * .12); u.hp = Math.min(u.mhp, u.hp + n); pop(u, n, BCOL.heal); bmsg('IT PLAYS ITSELF AGAIN. IT FEELS BETTER.'); } }), { kind: 'fight' }],
  gray: [MV('50% OFF', { run: async (u, T) => { const t = T[0]; const n = Math.floor(t.hp / 2); dmgPop(t, n, 'hit'); bmsg('EVERYTHING MUST GO. HALF OF ' + t.name + ' WENT.'); } }), MV('BARGAIN BIN', { status: 'pause', hit: 35 }), MV('NO REFUNDS', { sp: 80, tgt: 'all', split: 1 }), { kind: 'fight' }],
};
for (const k in CARTS) {
  const c = CARTS[k], id = 'cart_' + k;
  foe(id, c.name, 42, { kit: id, draw: cartDraw(c.label), size: [72, 86], c: ['#929292', '#494949', '#2449b6', '#ff2424'] }, { boss: 1, hp: 16, atk: 1.9, spd: 1.5, xp: 5, gp: 4, ap: 25, weak: [k === 'green' ? 'hot' : k === 'pink' ? 'zap' : k === 'red' ? 'cold' : 'rumble'], extra: { tone: c.tone }, ai: u => Object.assign({}, pickOne(CART_MOVES[k])) });
  form(id, [id], { at: [[id, 60, 30]], bg: 'void', boss: 1, noRun: 1, tone: c.tone, music: 'boss' });
  MAPS[c.place] = { name: c.name, theme: 'tower', music: 'grave', tone: c.tone,
    rows: ['##############', '#~~~~~~~~~~~~#', '#~..........~#', '#~..........~#', '#~..........~#', '#~..........~#', '#~..........~#', '#~~~~~..~~~~~#', '######..######'],
    exits: [{ x: 6, y: 8, w: 2, to: 'world', wx: c.at[0], wy: c.at[1] }],
    npcs: () => [T2(null, 6, 3, { if: () => !flag(id), draw: (n, x, y) => { const s = FOEART.get(FOES[id].look); drawScaled(s, x - 10, y - 26 + Math.sin(frame * .05) * 2, legacyPal(s.P, c.tone), .5); }, talk: () => cartFight(k) })] };
  PLACES[c.place] = { x: c.at[0], y: c.at[1], icon: 'cart', name: '???', to: [c.place, 6, 7, 'u'], if: () => G.world === 2 && !flag(id) };
}
async function cartFight(k) {
  const c = CARTS[k], id = 'cart_' + k; FIELD_LOCK++;
  try {
    await say('A CARTRIDGE THE SIZE OF A DOOR, PLUGGED INTO NOTHING, STILL RUNNING. THE LABEL SAYS "' + c.label + '." IT\'S ' + ({ dmg: 'GREEN', pink: 'PINK', red: 'RED', gray: 'GRAY' })[c.tone] + ' ALL THE WAY THROUGH.', null);
    await say(['THE OLD ONES. FROM BEFORE THE SAVE HAD COLORS. THEY DON\'T KNOW THE NEW GAME HAPPENED. THEY DON\'T KNOW ANY GAME HAPPENED.', 'IT\'S PLAYING SOMETHING. IT\'S BEEN PLAYING IT SINCE BEFORE ANY OF US.'][rnd(2)], 'SPOOKY GHOST');
    if (await battle(id) === 'lose') return gameOver(); await fadeIn(.1);
    setFlag(id); invAdd(c.reward); invAdd('cartridge', 2); sfx('get');
    await say('THE CARTRIDGE CLICKS OFF. INSIDE IT: ' + itemName(c.reward) + ' AND 2 OLD CARTRIDGES (BLOW ON THEM IN BATTLE).', null);
    const n = Object.keys(CARTS).filter(k => flag('cart_' + k)).length;
    if (n === 4 && !G.crystals.includes('auditor')) {
      G.crystals.push('auditor'); sfx('get');
      await say('ALL FOUR OLD CARTRIDGES ARE QUIET NOW. SOMETHING HAS BEEN KEEPING COUNT. IT STEPS FORWARD AND BECOMES A CRYSTAL.', null);
      await say('GOT THE SAVE CRYSTAL: THE AUDITOR. "EVERYTHING IS ACCOUNTED FOR."', null);
    } else await say(n + ' OF 4 OLD CARTRIDGES SILENCED.', null);
  } finally { FIELD_LOCK--; }
  await toWorld(c.at[0], c.at[1]);
}

// ---------------- SLOT ZERO: the first save, revisited ----------------
MAPS.zero1 = { name: 'THE OLD MINES', theme: 'mine', music: 'dungeon2', dungeon: 1, dark: 80,
  rows: MAPS.mines1.rows, exits: [{ x: 0, y: 7, to: 'world', wx: 34, wy: 9 }, { x: 29, y: 7, to: 'zero2', tx: 1, ty: 6, dir: 'r' }],
  chests: [[2, 14, 'feast', 1], [26, 2, 'espresso', 2]], enc: { forms: () => pickOne(forms('N').concat(['W0', 'W1', 'W2'])), bg: 'mine' },
  enter: async () => { if (!flag('zeroDone')) obj('THE FROZEN SAVE IS AT THE FAR END OF THE OLD MINES.', 'zero2', 7, 4); } };
MAPS.zero2 = { name: 'SLOT ZERO', theme: 'mine', music: 'firstsave', color: 1, rows: MAPS.firstsave.rows,
  exits: [{ x: 0, y: 6, to: 'zero1', tx: 28, ty: 7, dir: 'l' }],
  npcs: () => [T2(null, 7, 3, { if: () => !flag('zeroDone'), draw: (n, x, y) => drawFirstSave(x, y), talk: () => slotZero() })],
  steps: { '7,4': async () => { if (!flag('zeroDone')) await slotZero(); } } };
PLACES.slotzero = { x: 34, y: 9, icon: 'cave', name: 'THE OLD MINES', to: ['zero1', 1, 7, 'r'], if: () => G.world === 2 };
async function slotZero() {
  if (flag('zeroDone')) return; FIELD_LOCK++;
  try {
    await say('THE FROZEN SAVE IS STILL HERE. IT\'S STILL IN COLOR. THE NEW GAME NEVER REACHED SLOT ZERO.', null);
    if (inParty('yoko')) { await Y('...HELLO AGAIN. YOU SAID PRESS START. I THOUGHT YOU WERE TALKING TO ME.'); await say('...I WAS TALKING TO ME. NOBODY EVER PRESSED IT FOR ME.', 'THE FIRST SAVE'); }
    else await say('...PRESS START. PLEASE. SOMEONE. IT\'S BEEN SO LONG.', 'THE FIRST SAVE');
    await say('BEFORE IT CAN BE PRESSED, IT HAS TO BE WOKEN UP. AND IT WAKES UP SWINGING.', null);
    if (await battle('slotzero') === 'lose') return gameOver(); await fadeIn(.1);
    setFlag('zeroDone'); G.crystals.push('first'); sfx('get');
    await say('THE ICE CRACKS. INSIDE, THE CURSOR STOPS BLINKING. SOMEONE PRESSED START FOR IT.', null);
    await say('GOT THE SAVE CRYSTAL: THE FIRST SAVE. IT TEACHES THE LAST MAGIC THERE IS.', null);
    if (inParty('yoko')) await Y('IT WAS WAITING FOR SOMEONE TO PRESS START FOR IT. NOT AT IT. FOR IT. THAT\'S THE DIFFERENCE.');
  } finally { FIELD_LOCK--; }
}
const zeroDraw = g => { for (let i = 0; i < 3; i++) g.e(44, 44, 40 - i * 10, 40 - i * 10, [2, 6, 12][i]); for (let j = 0; j < 6; j++) g.line(6 + j * 14, 86, 44, 4, 9); g.r(42, 32, 4, 22, 13); FOEART.gtext(g, 'SLOT 0', 26, 70, 13); };
foe('slotzero', 'SLOT ZERO', 44, { kit: 'zero', draw: zeroDraw, size: [88, 88], c: ['#4992db', '#b6dbff', '#dbffff', '#ffffff'] }, { boss: 1, hp: 10, atk: 1.2, xp: 6, ap: 30, weak: ['hot'], absorb: ['cold'], extra: { color: 1, noErase: 1 },
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.hp < u.mhp * .3 && !u.v.cont) { u.v.cont = 1; return MV('CONTINUE?', { run: async () => { const n = Math.floor(u.mhp * .3); u.hp += n; pop(u, n, BCOL.heal); bmsg('IT CONTINUED.'); } }); } if (u.v.t % 4 === 0) return MV('PRESS START', { sp: 96, tgt: 'all', split: 1 }); return pickOne([MV('FREEZE FRAME', { status: 'pause', hit: 35 }), MV('COLD BOOT', { sp: 90, elem: 'cold', tgt: 'all', split: 1 }), MV('BLINK', { pow: 2.8 }), { kind: 'fight' }]); } });
form('slotzero', ['slotzero'], { at: [['slotzero', 40, 30]], bg: 'spirit', boss: 1, noRun: 1, music: 'boss' });

// ---------------- THE THIRD GENERATOR (a Pee Kid side story) ----------------
MAPS.generator = { name: 'THE THIRD GENERATOR', theme: 'factory', music: 'factory', dungeon: 1,
  rows: ['####################', '#T.T.T.T.TT.T.T.T.T#', '#..................#', '#..::::::::::::::..#', '#..:............:..#', '#..:....oo......:..#', '#..:............:..#', '#..::::::;;::::::..#', '#..................#', '#........;;........#', '#########DD#########'],
  exits: [{ x: 9, y: 10, w: 2, to: 'world', wx: 100, wy: 84 }],
  npcs: () => [T2(null, 9, 5, { if: () => !flag('genDone'), solid: true, draw: (n, x, y) => { const s = FOEART.get(FOES.thirdgen.look); drawScaled(s, x - 8, y - 18, s.P, .4); }, talk: () => thirdGenerator() })],
  enter: async () => { if (!flag('genDone')) obj('THE GENERATOR IN THE MIDDLE OF THE ROOM.', 'generator', 9, 5); } };
PLACES.generator = { x: 100, y: 84, icon: 'factory', name: 'THE THIRD GENERATOR', to: ['generator', 9, 9, 'u'], if: () => G.world === 2 && !flag('genDone') };
async function thirdGenerator() {
  FIELD_LOCK++;
  try {
    if (!inParty('kid')) { await say('THE GENERATOR HUMS. IT\'S NOT TALKING TO YOU. IT ONLY TALKS TO KIDS.', null); return; }
    await say('POTENTIAL: 0%. POTENTIAL: 0%. HELLO, KID. YOU CAME BACK. YOU ALWAYS COME BACK WHEN YOU NEED TO GO.', 'THE THIRD GENERATOR');
    await KD('I DON\'T NEED TO GO. I DON\'T HAVE TO HOLD IT ANYMORE. I\'M NOT YOUR BATTERY.');
    await say('EVERYONE IS SOMEONE\'S BATTERY. THAT\'S WHAT POTENTIAL IS. IT\'S WHAT YOU HAVEN\'T SPENT YET.', 'THE THIRD GENERATOR');
    await KD('...THEN I\'LL SPEND IT. ON WHAT I WANT.');
    await say('(THE GENERATOR CAN ONLY BE HURT AFTER PEE BOY INSPECTS IT.)', null);
    if (await battle('thirdgen') === 'lose') return gameOver(); await fadeIn(.1);
    setFlag('genDone'); G.crystals.push('gen'); sfx('get');
    await say('THE THIRD GENERATOR WINDS DOWN. FOR THE FIRST TIME, IT\'S QUIET.', null);
    await say('GOT THE SAVE CRYSTAL: THE GENERATOR. IT RUNS ON POTENTIAL. NOW IT\'S YOURS.', null);
    await KD('...CAN WE STOP AT A BATHROOM ON THE WAY OUT. NOT BECAUSE I HAVE TO. JUST BECAUSE.');
  } finally { FIELD_LOCK--; }
}
const genDraw = g => { g.r(10, 10, 70, 70, 2); g.r(10, 10, 70, 8, 4); g.e(45, 45, 22, 22, 13); g.e(45, 45, 18, 18, 9); FOEART.gtext(g, '0%', 38, 40, 12); for (let i = 0; i < 5; i++) g.r(16 + i * 12, 82, 6, 8, 6); g.line(10, 30, 0, 20, 15); g.line(80, 30, 90, 20, 15); };
foe('thirdgen', 'THE THIRD GENERATOR', 43, { kit: 'gen', draw: genDraw, size: [92, 92], c: ['#6d6d6d', '#ffdb24', '#24db92', '#ffdb24'] }, { boss: 1, hp: 6, atk: 1.15, xp: 6, ap: 30, weak: ['zap'], extra: { color: 1, guard: t => t.status.exposed ? 1 : 0 },
  ai: u => pickOne([MV('HOLD IT', { status: 'buffer', hit: 70, tgt: 'all' }), MV('POWER SURGE', { sp: 88, elem: 'zap', tgt: 'all', split: 1 }), MV('DRAIN POTENTIAL', { sp: 80, drain: 1 }), { kind: 'fight' }]) });
form('thirdgen', ['thirdgen'], { at: [['thirdgen', 40, 30]], bg: 'factory', boss: 1, noRun: 1 });

// ---------------- THE HERMIT'S MOUNTAIN (Face and Old Face) ----------------
MAPS.hermit = { name: 'MT. RERUN (CORRUPTED)', theme: 'sand', music: 'mountain', dungeon: 1, rows: MAPS.mtrerun.rows,
  exits: [{ x: 9, y: 23, w: 4, to: 'world', wx: 36, wy: 55 }],
  steps: { '10,4': () => hermitTop(), '11,4': () => hermitTop() }, enc: { forms: () => pickOne(forms('L').concat(['W3', 'W4'])), bg: 'desert' },
  enter: async () => { if (!flag('hermitDone')) obj('THE SUMMIT, WHERE THE HERMIT USED TO TEACH.', 'hermit', 10, 4); } };
PLACES.hermit = { x: 36, y: 55, icon: 'cave', name: 'MT. RERUN', to: ['hermit', 9, 22, 'u'], if: () => G.world === 2 && !flag('hermitDone') };
async function hermitTop() {
  if (flag('hermitDone')) return; FIELD_LOCK++;
  try {
    if (!inParty('face') || !inParty('oldface')) { await say('THE SUMMIT IS EMPTY. IT FEELS LIKE IT\'S WAITING FOR TWO PEOPLE WHO ARE THE SAME PERSON.', null); return; }
    await say('A VOICE COMES OUT OF THE ROCK. NOT A PERSON. A SAVE. WHAT\'S LEFT OF ONE.', null);
    await say('...MY TWO STUDENTS. THE KING WHO NEEDED NOTHING AND THE ONE WHO TOOK NOTHING. YOU CAME BACK TOGETHER.', 'THE HERMIT\'S ECHO');
    await F('WE DID. HE INSISTED. I WANTED TO SEND A LETTER.');
    await OF('HE WANTED TO SEND AN INVENTION THAT SENDS LETTERS.');
    await say('AND THE OTHER STUDENT. THE ONE I DIDN\'T PICK. HE\'S STILL HERE. THE NEW GAME FOUND HIM ANGRY AND KEPT HIM THAT WAY.', 'THE HERMIT\'S ECHO');
    if (await battle('protege2') === 'lose') return gameOver(); await fadeIn(.1);
    await say('...TELL THE OLD MAN... HE WAS RIGHT TO PICK YOU. TELL HIM I SAID IT. I WON\'T GET ANOTHER CHANCE.', 'THE PROTEGE');
    await OF('YOU JUST TOLD HIM. HE HEARD. THAT\'S HOW ECHOES WORK.');
    setFlag('hermitDone'); G.crystals.push('faceless'); G.gadgets.push('air'); sfx('get');
    await say('THE ECHO GOES QUIET. ON THE SUMMIT: A SAVE CRYSTAL (THE FACELESS) AND AN INVENTION (AIR HORN).', null);
    await F('THE FACELESS. NOBODY IN PARTICULAR. HE WAS ALWAYS GOOD AT BEING NOBODY IN PARTICULAR. IT\'S HARDER THAN IT LOOKS.');
  } finally { FIELD_LOCK--; }
}
foe('protege2', 'THE PROTEGE (CORRUPTED)', 42, { kit: 'prot', draw: protegeDraw, size: [52, 60], c: ['#306230', '#0f380f', '#8bac0f', '#9bbc0f'] }, { boss: 1, hp: 12, atk: 1.45, xp: 6, ap: 25, weak: ['legacy'],
  ai: u => pickOne([{ kind: 'fight' }, MV('GALE CUT', { pow: 1.6, tgt: 'all', split: 1 }), MV('DOUBLE KICK', { pow: 2.6 }), MV('THE OTHER STUDENT', { sp: 84, tgt: 'all', split: 1 }), MV('GRUDGE', { status: 'scram', hit: 40 })]) });
form('protege2', ['protege2'], { at: [['protege2', 70, 40]], bg: 'desert', boss: 1, noRun: 1 });

// ---------------- THE TALK SHOW (a wager arena) ----------------
const WAGERS = [
  { bet: 'bomb', prize: 'feast', foe: 'badsector' }, { bet: 'feast', prize: 'espresso', foe: 'trollking' }, { bet: 'espresso', prize: 'megalife', foe: 'texture' },
  { bet: 'megalife', prize: 'blinker', foe: 'reviewbomb' }, { bet: 'cartridge', prize: 'turbobutton', foe: 'unsub' }, { bet: 'brucephoto', prize: 'strap', foe: 'sock' },
];
MAPS.talkshow = { name: 'THE TALK SHOW', theme: 'opera', music: 'ghost',
  rows: ['##################', '#T..T..T..T..T..T#', '#................#', '#..____________..#', '#................#', '#t.t.t.t..t.t.t.t#', '#................#', '#t.t.t.t..t.t.t.t#', '#................#', '########DD########'],
  exits: [{ x: 8, y: 9, w: 2, to: 'world', wx: 92, wy: 50 }],
  npcs: () => [T2('exec', 8, 2, { dir: 'd', talk: () => talkShow() }), T2('newfile', 3, 6, { talk: talkS('NEW FILE', 'I DON\'T KNOW WHO I AM, BUT I KNOW WHEN TO CLAP. THERE\'S A SIGN.') })] };
PLACES.talkshow = { x: 92, y: 50, icon: 'opera', name: 'THE TALK SHOW', to: ['talkshow', 8, 8, 'u'], if: () => G.world === 2 };
async function talkShow() {
  FIELD_LOCK++;
  const P = s => say(s, 'THE PRODUCER');
  try {
    await P('WELCOME TO THE TALK SHOW! WE TALK, THEN WE FIGHT. PUT SOMETHING ON THE TABLE, PICK A GUEST, AND IF THEY WIN, THEY WALK OUT WITH SOMETHING BETTER.');
    const can = WAGERS.filter(w => invHas(w.bet));
    if (!can.length) { await P('YOU DON\'T HAVE ANYTHING WE TAKE. WE TAKE: ' + WAGERS.map(w => itemName(w.bet)).join(', ') + '.'); return; }
    const i = await choose(can.map(w => itemName(w.bet) + ' FOR ' + itemName(w.prize)).concat(['NOT TODAY']), { cancel: 1 });
    if (i < 0 || i >= can.length) return;
    const w = can[i], heroes = G.party.slice();
    const h = await choose(heroes.map(id => HEROES[id].name), { cancel: 1 }); if (h < 0) return;
    invAdd(w.bet, -1);
    await P('TONIGHT\'S GUEST: ' + HEROES[heroes[h]].name + '! AND OUR OTHER GUEST: ' + FOES[w.foe].name + '! NO SUBSTITUTIONS!');
    const keep = G.party; G.party = [heroes[h]];
    let r; try { r = await battle({ foes: layout([w.foe]), bg: 'opera', noRun: 1, noReward: 1, loseOk: 1, music: 'battle' }); } finally { G.party = keep; }
    await fadeIn(.1);
    if (r === 'win') { invAdd(w.prize); sfx('get'); await P('THE AUDIENCE GOES WILD! YOUR GUEST WALKS OUT WITH: ' + itemName(w.prize) + '!'); }
    else await P('AND THAT\'S OUR SHOW! YOUR GUEST WILL BE FINE. YOUR ' + itemName(w.bet) + ' WILL NOT BE RETURNED.');
  } finally { FIELD_LOCK--; }
}

// ---------------- new things in the corrupted save ----------------
foe('autosave', 'AUTOSAVE', 31, LK('floater', {}, ['#24db92', '#ffffff', '#242424', '#ffffff']), { steal: 'espresso', moves: [[1, 'fight'], [2, MV('SAVING...', { tgt: 'ally', run: async (u) => { const f = alive(B.foes).sort((a, b) => a.hp / a.mhp - b.hp / b.mhp)[0]; const n = Math.floor(f.mhp * .25); f.hp = Math.min(f.mhp, f.hp + n); pop(f, n, BCOL.heal); bmsg('AUTOSAVE RESTORED ' + f.name + ' TO A SAFER POINT.'); } })]] });
foe('demodisc', 'DEMO DISC', 32, LK('glitch', {}, ['#dbdbdb', '#24dbff', '#ff24db', '#ffffff']), { weak: ['legacy'], steal: 'patch', moves: [[1, 'fight'], [2, MV('NOT FOR RESALE', { sp: 50, tgt: 'all', split: 1 })]] });
foe('unplugged', 'UNPLUGGED', 33, LK('snake', {}, ['#242424', '#6d6d6d', '#db2424', '#ffdb49']), { weak: ['zap'], steal: 'battery', moves: [[2, 'fight'], [1, MV('PULL THE PLUG', { status: 'pause', hit: 30 })]] });
foe('rumblepak', 'RUMBLE PAK', 34, LK('machine', { mean: 1 }, ['#6d6d6d', '#db2424', '#242424', '#ff2424']), { hp: 1.4, def: 1.4, weak: ['zap'], steal: 'espresso', moves: [[1, 'fight'], [2, MV('RUMBLE', { sp: 58, elem: 'rumble', tgt: 'all', split: 1, fx: 'rumble' })]] });
foe('exppak', 'EXPANSION PAK', 35, LK('machine', { smile: 1 }, ['#db2424', '#929292', '#242424', '#ffdb49']), { hp: 1.2, steal: 'feast', moves: [[1, 'fight'], [2, MV('EXPAND', { run: async () => { for (const f of alive(B.foes)) inflict(f, 'turbo', 100, 1); bmsg('EVERYTHING HAS MORE MEMORY NOW.'); } })]] });
AREA.W = [['autosave', 'demodisc', 'demodisc'], ['unplugged', 'unplugged'], ['rumblepak'], ['exppak', 'autosave', 'unplugged'], ['rumblepak', 'demodisc']];
AREA.W.forEach((ids, i) => form('W' + i, ids));
WZONES2.splice(2, 0, { r: [0, 75, 127, 111], forms: forms('W').concat(forms('N')), bg: 'plains' });
WZONES2[WZONES2.length - 1].forms = WZONES2[WZONES2.length - 1].forms.concat(forms('W'));
// the reunion hints mention the side stories once the party is back together
const _nextObj = nextReunionObj;
nextReunionObj = function () {
  _nextObj();
  if (G.obj && G.obj.x === 64 && G.obj.y === 61 && !G.obj.map) {
    const side = [!flag('meetingDone') && 'PRESTIGE NEEDS SOMEONE TO RUN ITS MEETING', !flag('zeroDone') && 'SLOT ZERO IS STILL FROZEN UNDER THE OLD MINES', inParty('kid') && !flag('genDone') && 'A GENERATOR ON THE EASTERN PLAINS WANTS THE KID',
      inParty('face') && inParty('oldface') && !flag('hermitDone') && 'MT. RERUN IS CALLING THE BROTHERS', Object.keys(CARTS).some(k => !flag('cart_' + k)) && 'FOUR OLD CARTRIDGES ARE STILL RUNNING'].filter(Boolean);
    if (side.length) G.obj.text = 'THE TITLE SCREEN IS IN THE CRATER. (OR, IF YOU HAVE TIME: ' + side.slice(0, 2).join('; ') + '.)';
  }
};
PLACES.lindaville = { x: 24, y: 100, icon: 'town', name: 'PRESTIGE', to: ['lindaville', 11, 18, 'u'], if: () => G.world === 2 };

// the epilogue remembers the side stories
const _endYes = endingYes;
endingYes = async function () {
  const _p = panels;
  panels = async function (list, o) {
    for (const p of list) {
      if (p.port === 'CEO LINDA' && flag('meetingDone')) p.text = 'NOBODY OWNS ANYBODY. THOSE WERE MY TERMS. PRESTIGE KEEPS THE MINUTES. I CHECK THEM EVERY QUARTER.';
      if (p.port === 'PEE KID' && flag('genDone')) p.text = 'THE GENERATOR IS OFF. NOBODY RUNS ON ME ANYMORE. I ASK WHY. AND I GO TO THE BATHROOM WHENEVER I WANT.';
      if (p.port === 'FACE' && flag('hermitDone')) p.text = 'MY BROTHER AND I REBUILT THE CASTLE, AND A LITTLE HUT ON A MOUNTAIN. NOBODY LIVES IN THE HUT. IT IS FOR AN ECHO.';
      if (p.port === 'YOKO' && flag('zeroDone')) p.text = 'I STAYED WITH THE YOKOIDS. SOMETIMES I GO DOWN TO SLOT ZERO AND PRESS START, JUST TO SAY HELLO. BECAUSE I WANT TO.';
    }
    return _p(list, o);
  };
  try { return await _endYes(); } finally { panels = _p; }
};
