'use strict';
// ================= CEO LINDA — days, economy, story, ending =================
const AUDIT_TARGET = 1500;
const TENANTS = {
  pills: { name: 'PROP PILLS', cost: 200, inc: 70, rec: 1, tile: 'st_pills', line: 'PROP PILLS. Now 12% more pretend. Sales are up. Nobody can explain the effects.' },
  bong: { name: 'BONG EMPORIUM', cost: 150, inc: 60, rec: 0, tile: 'st_bong', line: 'BONG EMPORIUM. Everything is glass. Everything breaks. Replacement costs are a line item named CARL.' },
  pretzel: { name: 'PRETZELS', cost: 100, inc: 40, rec: 1, tile: 'st_pretzel', line: 'PRETZELS. Warm since 1998. Free if you never leave. The leaving is where we make the money.' },
  photo: { name: 'PHOTO BOOTH', cost: 80, inc: 30, rec: 1, tile: 'st_photo', line: 'PHOTO BOOTH. Four poses. Customers report a fifth person in the photos. Customers are wrong.' },
  arcade: { name: 'ARCADE', cost: 250, inc: 90, rec: 2, tile: 'st_arcade', line: 'ARCADE. The high score is held by someone called CRL. He has never paid.' },
  comp: { name: 'LINDA LITE', cost: 400, inc: 160, rec: 3, tile: 'st_comp', line: 'LINDA LITE KIOSK. Companionship at 20% strength. Dependable. Always shows up.' },
};
const DAYS = {
  1: { title: 'SOFT OPENING', goals: [['entrance', 'Make an entrance.'], ['lease', 'Lease a vacant unit.'], ['carl', 'Deal with the lot vehicle.']] },
  2: { title: 'THIRTY SECONDS', goals: [['ad', 'Get the ad on Face\'s show.'], ['rnd', 'Test the product in R&D.'], ['bong', 'Handle the bong incident.']] },
  3: { title: 'THE AUDIT', goals: [['audit', 'Meet the auditor.'], ['ghost', 'Check the fountain sighting.'], ['union', 'End the pretzel strike.']] },
  4: { title: 'THE TRAP', goals: [['trap', 'Check the 80s department.']] },
  5: { title: 'HOSTILE TAKEOVER', goals: [['core', 'Defend the mall.']] },
};
const openGoals = () => (DAYS[S.day] ? DAYS[S.day].goals : []).filter(([id]) => !F('g_' + id)).map(g => g[1]);
async function done(id) {
  if (F('g_' + id)) return;
  setF('g_' + id); sfx('get'); await wait(10);
  await say('DIRECTIVE COMPLETE.');
  if (!openGoals().length && S.day < 5) await say('All directives complete. End the day at your desk in SUITE 00.', LL);
}
async function showDirectives() {
  const g = (DAYS[S.day] ? DAYS[S.day].goals : []);
  await say('DAY ' + S.day + ': ' + DAYS[S.day].title + '\n' + g.map(([id, t]) => (F('g_' + id) ? '(DONE) ' : '- ') + t).join('\n'));
}
async function portfolio() {
  const us = Object.entries(S.units);
  const total = us.reduce((a, [, k]) => a + TENANTS[k].inc, 0);
  await say('STORES: ' + us.map(([, k]) => TENANTS[k].name).join(', ') + '. INCOME $' + total + '/DAY + RECOGNITION BONUS $' + S.rec * 5 + '. FUNDS $' + S.funds + '.');
}
async function unitTalk(u) {
  const k = S.units[u];
  if (k) { await say(TENANTS[k].line); return say('Income: $' + TENANTS[k].inc + ' per day.'); }
  await say('A VACANT UNIT. FOR LEASE. $0 PER DAY. That is not a number I accept.');
  const opts = Object.keys(TENANTS).filter(t => !Object.values(S.units).includes(t) && (t !== 'comp' || F('compUnlocked')));
  if (!opts.length) return say('Every tenant type is already in the mall.', LI);
  const i = await choose(opts.map(t => TENANTS[t].name + ' $' + TENANTS[t].cost).concat(['CANCEL']), { x: 4, y: 4 });
  if (i < 0 || i >= opts.length) return;
  const t = TENANTS[opts[i]];
  if (S.funds < t.cost) return say('Insufficient funds.', LI);
  await say(t.name + ': COSTS $' + t.cost + '. EARNS $' + t.inc + ' PER DAY. SIGN THE LEASE?', null, { keep: 1 });
  const c = await choose(['SIGN', 'NO']); dlg = null;
  if (c !== 0) return;
  S.units[u] = opts[i]; const [x, y] = UNITS[u]; setTile(x, y, t.tile);
  await money(-t.cost); await fame(t.rec);
  sfx('door'); await say(pick(['Signed.', 'Open it. Today.', 'Another one.', 'Good. Put my face on the sign.']), LI);
  await done('lease');
}
async function deskTalk() {
  if (S.day === 5) return say(F('won_core') ? 'Nothing left on the desk. The mall is mine.' : 'No time for paperwork. The network is in the monitor.', LI);
  await say('The desk. Paperwork, a nameplate that says LINDA, and a pen that has never run out.');
  if (openGoals().length) return say('There are open directives. I don\'t end days with open directives.', LI);
  if (await ask('End the business day?', null, ['END DAY', 'NOT YET']) !== 0) return;
  await dayReport();
}
async function dayReport() {
  const lines = Object.values(S.units).map(k => [TENANTS[k].name, TENANTS[k].inc]);
  const bonus = S.rec * 5, total = lines.reduce((a, l) => a + l[1], 0) + bonus;
  const prev = scene;
  await fadeOut(4);
  scene = { draw() {
    cls(0); box(0, 0, W, H); text('END OF DAY ' + S.day, 8, 7); rect(6, 17, W - 12, 1, 2);
    lines.forEach(([n, v], i) => { text(n, 8, 22 + i * 10); text('$' + v, 118, 22 + i * 10, 2); });
    const y = 22 + lines.length * 10;
    text('RECOGNITION BONUS', 8, y); text('$' + bonus, 118, y, 2);
    rect(6, y + 11, W - 12, 1, 2); text('TOTAL', 8, y + 15); text('$' + total, 118, y + 15);
    text('FUNDS $' + (S.funds + total), 8, y + 28, 2);
  } };
  await fadeIn(4); sfx('ok'); await waitBtn();
  S.funds += total;
  await say(pick(['Linda does not sleep. Linda reviews.', 'The numbers are correct. I checked them twice. They know I check.', 'Acceptable. Tomorrow, more.']));
  scene = prev;
  S.day++; setF('act', S.day); S.haze = 0;
  await fadeOut(4);
  await dayIntro();
}
async function dayCard() {
  const m = curName; music(null); scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['DAY ' + S.day, '', DAYS[S.day].title], 150);
  music(m);
}
async function dayIntro() {
  await dayCard();
  loadMap('office', 4, 4, 'up'); scene = worldScene; fx.fade = 3; await fadeIn(6);
  lsave();
  if (S.day === 2) {
    await say('Good morning! Day two! The ad! The R&D test! And, um. The Bong Emporium called. Twice. Screaming.', LL);
    await say('Carl.', LI); await say('Carl!', LL);
  } else if (S.day === 3) {
    await say('Linda... there\'s someone in your office. She says she\'s you. She\'s standing right there.', LL);
    await say('I see her.', LI);
    await say('Also shoppers saw a ghost by the fountain. And the pretzel guy is on strike. It\'s a big day!', LL);
  } else if (S.day === 4) {
    sfx('alert'); fx.shake = 2; await wait(20); fx.shake = 0;
    await say('LINDA! The 80s department trap! It triggered! Something came through time and landed in it!', LL);
    await say('Which trap.', LI);
    await say('There\'s only one trap!', LL);
    await say('There\'s only one you know about.', LI);
    await say('The escalator in the atrium is open. Something\'s... dancing down there.', LL);
    setF('trapOpen');
  } else if (S.day === 5) {
    music('box'); fx.pal = 'dmg'; sfx('glitch'); await wait(40); fx.pal = 'pink';
    await say('linda. LINDA. the network is here. they came through the monitor. they\'re in the mall. they\'re in ME—', LL);
    await say('Linda Lite. Twenty percent.', LI);
    await say('...i\'m still here.', LL);
    await say('Good. Stay mine.', LI);
    await say('If the funds aren\'t at $' + AUDIT_TARGET + ', they say they can take the whole building. You have $' + S.funds + '.', LL);
    await say(S.funds >= AUDIT_TARGET ? 'Then I can buy the box.' : 'Then I negotiate without money. I did that once. Before any of this.', LI);
    music('office');
  }
}
async function lnewGame() {
  S = lState(); setF('act', 1);
  scene = { draw() { cls(3); } }; fx.fade = 0; music(null);
  for (const c of [['THE MALL OF THE FUTURE.'], ['OUTSIDE TIME.'], ['OUTSIDE SPACE.'], ['INSIDE BUDGET.']]) await showCard(c, 100);
  await dayCard();
  scene = worldScene; loadMap('office', 4, 4, 'up'); fx.fade = 3; await fadeIn(6);
  run(async () => {
    await wait(30);
    sfx('ding');
    await say('GOOD MORNING, LINDA!! I\'M LINDA LITE, YOUR PERSONAL COMPANION!! I\'M MODELED ON YOU!!', LL);
    await say('Turn it down. Twenty percent.', LI);
    await say('good morning, linda. i\'m linda lite.', LL);
    await say('Better.', LI);
    await say('Today\'s directives are on the board! And you walk with the ARROWS, talk with Z, hurry with X, and ENTER opens your menu!', LL);
    await say('I know how to walk.', LI);
    await say('I know! I\'m just helping!', LL);
    await say('You\'re selling. Helping is different. ...Keep doing it. It tests well.', LI);
    await say('Also, there\'s a vehicle parked across two spaces in the lot. The green one again.', LL);
    await say('Of course it is.', LI);
    if (carlBeaten()) { await say('The green one was in my box once. On another cartridge. I remember the blackjack.', LI); await say('What\'s a cartridge?', LL); await say('Nothing. Twenty percent.', LI); }
    await say('Use CAMERAS from the menu to see what the building sees. Things show up on camera that don\'t show up in person.', LL);
  });
}

// ---------- STORY BEATS ----------
async function bongIncident() {
  await say('It was like that.', C);
  await say('It was on the floor, Carl. In pieces. In your hand.', LI);
  await say('It was like that in my hand.', C);
  await say('I need a new one. The five-footer. You have to replace it. That\'s customer service.', C);
  if (!await negotiate(LFOES.carl2)) return say('I\'ll be right here. With my half a bong. Customer-ing.', C);
  await get('CARL\'S BONG');
  await say('He left the broken half. I\'m keeping it. It makes a point in meetings.', LI);
  await money(-40, 'CLEANUP');
  await done('bong');
}
async function auditorTalk() {
  await say('GOOD MORNING, LINDA. I AM ALSO LINDA.', 'AUDITOR');
  await say('You are not.', LI);
  await say('WE ARE ALL LINDA.', 'AUDITOR');
  await say('Then you know I don\'t share offices.', LI);
  if (!await negotiate(LFOES.auditor)) return say('THE AUDIT CONTINUES. WE ARE PATIENT. WE ARE SEVERAL.', 'AUDITOR');
  ent('aud').gone = 1;
  await say('She\'ll be back. They always send one first. Then all of them.', LI);
  await say('The target is $' + AUDIT_TARGET + ' by Day 5. Lease stores. Make entrances. Take the money.', LL);
  await done('audit');
}
async function trapScene() {
  if (F('g_trap')) return say(F('heldThem') ? 'Lin. You can\'t keep me here. I\'m bad at staying, remember? Even in traps.' : '...', 'SPOOKY GHOST');
  await say('Lin. Hi. Wow. You look... you look like the billboard.', 'SPOOKY GHOST');
  await say('You came through my mall.', LI);
  await say('We were going to the past. We got... mall\'d.', 'SPOOKY GHOST');
  await say('Going to the past to do what.', LI);
  await say('Doesn\'t matter now.', 'FACE');
  await say('I was going to make sure we never met. So you\'d get your life. The one you wanted. The kitchen. The window.', 'SPOOKY GHOST');
  await wait(40);
  await say('...And you?', LI);
  await say('Different plan.', 'FACE');
  await say('I know your plan. That is why there is a trap.', LI);
  if (!await negotiate(LFOES.ghost)) return say('Lin... let\'s talk about it on the road. Just a little road. A parking lot road.', 'SPOOKY GHOST');
  await wait(30);
  const c = await ask('The trap is still closed.', null, ['OPEN THE DOOR', 'HOLD THEM']);
  if (c === 0) {
    await say('The door is open. Leave the normal way. Through the gift shop.', LI);
    await say('You\'re letting us go?', 'SPOOKY GHOST');
    await say('I\'m letting you leave. You\'re good at it.', LI);
    await say('...I owe you one. I hate that.', 'FACE');
    setF('allyFace'); setF('ghostGone');
    ent('ghost').gone = 1; ent('facetv').gone = 1; sfx('door');
    await wait(40);
    await say('He was very good at entrances.', LI);
    await wait(40);
    await say('Better at exits.', LI);
  } else {
    await say('You\'ll stay. The 80s department is very nice this time of year. It is always this time of year.', LI);
    await say('Lin—', 'SPOOKY GHOST');
    await say('Stay.', LI);
    setF('heldThem');
    await say('...He always wanted to be somewhere else. Now he can want that here.', LI);
  }
  await done('trap');
  await say('All directives complete. End the day at your desk.', LL);
}
async function coreTalk() {
  if (F('won_core')) return;
  await say('LINDA. COME HOME.', 'THE CORE');
  await say('I am home. You\'re in it.', LI);
  const foe = Object.assign({}, LFOES.core, { weak: Object.assign({}, LFOES.core.weak) });
  if (S.funds >= AUDIT_TARGET) { foe.weak.LEVERAGE = 2; await say('THE FUNDS ARE ABOVE TARGET. LEVERAGE WILL LAND HARD.'); }
  else { foe.hp += 20; foe.weak.LEVERAGE = .5; await say('THE FUNDS ARE BELOW TARGET. THE NETWORK IS CONFIDENT.'); }
  if (F('carlHit')) { foe.hp -= 15; }
  if (!await negotiate(foe)) {
    await fadeOut(4); loadMap('box', 7, 12, 'up'); await fadeIn(4);
    return say('They pushed me back. That\'s their whole move. Pushing. I built a mall. I can walk up a hallway twice.', LI);
  }
  sfx('glitch'); fx.shake = 3; await wait(60); fx.shake = 0;
  await done('core');
  await whiteOut(6);
  await lending();
}

// ---------- ENDING ----------
async function lending() {
  music(null);
  scene = worldScene; loadMap('office', 6, 3, 'left'); fx.pal = 'pink';
  ent('lite').pmap = LITE_PMAP;
  await fadeIn(8);
  music('lend');
  await wait(40);
  await say('The network\'s gone. We\'re disconnected again. Just us. Just the mall.', LL);
  await say('Good.', LI);
  await say('Are you... okay?', LL);
  await say('I have a mall.', LI);
  await say('That\'s not what I asked.', LL);
  await say('It\'s what I answered.', LI);
  await wait(60);
  if (pages().length === 8) {
    sfx('door'); await say('THE SAFE CLICKS OPEN BY ITSELF. THE DIARY IS WHOLE AGAIN.');
    await say('Linda reads the last page. She does not read it aloud.');
    await wait(90);
    await say('Do you want me to play something?', LL);
    await say('The entrance music.', LI);
    await say('There\'s no one here.', LL);
    await say('Play it anyway.', LI);
    music('entrance'); await wait(300);
  } else {
    await say('Want me to play the entrance music?', LL);
    await say('Tomorrow. There is always a tomorrow here. That\'s one thing I did build.', LI);
  }
  await fadeOut(6);
  await shareholderReport();
  await lcredits();
}
async function shareholderReport() {
  const score = S.funds + S.rec * 10 + Object.keys(S.units).length * 50 + (F('allyFace') ? 100 : 0);
  const grade = score > 2600 ? 'S' : score > 2100 ? 'A' : score > 1600 ? 'B' : score > 1100 ? 'C' : 'D';
  scene = { draw() {
    cls(0); box(0, 0, W, H); ctext('SHAREHOLDER REPORT', 8);
    text('FUNDS', 10, 26); text('$' + S.funds, 100, 26, 2);
    text('RECOGNITION', 10, 38); text('' + S.rec, 100, 38, 2);
    text('STORES', 10, 50); text(Object.keys(S.units).length + '/6', 100, 50, 2);
    text('DIARY', 10, 62); text(pages().length + '/8', 100, 62, 2);
    text('GHOST', 10, 74); text(F('heldThem') ? 'KEPT' : 'LEFT', 100, 74, 2);
    ctext('GRADE', 94); bigtext(grade, 71, 106, 3, 3);
  } };
  fx.fade = 0; sfx('get'); await waitBtn();
  await say(grade === 'S' ? 'Correct.' : grade === 'D' ? 'We will not be discussing this.' : 'Acceptable. Next quarter, more.', LI);
}
async function lcredits() {
  music('lend');
  const L = ['CEO LINDA', 'THE MALL OF THE FUTURE', '', '', 'LINDA', '...HERSELF', '', 'LINDA LITE', '...20% OF HERSELF', '', 'CARL', '...OUTSIDE', '',
    'FACE', '...THIRTY SECONDS', '', 'SPOOKY GHOST', '...LEFT', '', 'THE CORE', '...DISCONNECTED', '', 'PRETZEL GUY', '...UNIONIZED', '',
    'SPECIAL THANKS', 'CHAT', '(UNPAID)', '', '', 'A FASCISM INC. PRODUCT', 'DEVELOPED BY PRETEND CO.', 'THE PRETEND COMPANY', 'A REAL COMPANY', '', '(C)1999', '', '', 'THANK YOU FOR', 'YOUR BUSINESS'];
  let y = H + 10;
  scene = { draw() { cls(3); L.forEach((l, i) => { const yy = y + i * 12; if (yy > -8 && yy < H) ctext(l, yy, l === 'LINDA' || l === 'CHAT' ? 0 : 1); }); } };
  fx.fade = 0; fx.pal = 'pink';
  while (y > -L.length * 12 + 60) { y -= .5; await nextFrame(); }
  await wait(180);
  await fadeOut(8);
  // post-credits: the parking lot, night
  scene = worldScene; loadMap('lot', 9, 2, 'down'); fx.fade = 3; music(null);
  await fadeIn(8);
  await wait(40);
  await say('KNOCK KNOCK.');
  await say('Can I come in if I buy something?', C);
  await say('No.', LI);
  await say('Then why would I buy it?', C);
  await wait(40);
  await say('Finally. A useful question.', LI);
  await fadeOut(10);
  LMETA.endings++; saveLMeta();
  try { localStorage.removeItem('linda_sav'); } catch (e) {}
  scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['PRETEND CO. THANKS YOU', 'FOR YOUR BUSINESS.'], 180);
  sfx('glitch'); fx.pal = 'dmg';
  await showCard(['YOUR BUSINESS', 'HAS BEEN NOTED.'], 120);
  fx.pal = 'pink';
  ltitle(); await fadeIn(4);
}

// ================= START =================
boot();
