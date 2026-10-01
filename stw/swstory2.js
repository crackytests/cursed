'use strict';
// ================= SAVE THE WORLD: story, part 2 — THE RIVER, GARFEILD, THE RERUN EXPRESS, THE PLAINS, THE PORT =================
const JB = (s, o) => say(s, 'JB GARFIELD', o), PX = (s, o) => say(s, 'PILOT X', o), KD = (s, o) => say(s, 'PEE KID', o), LI = (s, o) => say(s, 'CEO LINDA', o), BR = (s, o) => say(s, 'BRUCE', o), GH = (s, o) => say(s, 'SPOOKY GHOST', o);
// make sure the party has at most four, with these people in it if they're around
function partyWith(...ids) { const keep = ids.filter(id => G.roster[id] && !G.flags['away_' + id]); const rest = G.party.filter(id => !keep.includes(id) && G.roster[id] && !G.flags['away_' + id]); G.party = keep.concat(rest).slice(0, 4); }
// ---------------- THE RIVER: a raft scene ----------------
const RAFT = { t: 0, sp: 1 };
const raftScene = { update() { RAFT.t += RAFT.sp; }, draw() {
  const t = RAFT.t;
  rectF(0, 0, W, H, hex('#2470db'));
  for (let y = 0; y < H; y++) { const bank = 40 + Math.sin((y - t) * .03) * 14 + Math.sin((y - t) * .011) * 10; rectF(0, y, bank, 1, hex('#36924a')); rectF(W - bank - 10, y, bank + 10, 1, hex('#36924a')); rectF(bank, y, 3, 1, hex('#dbc892')); rectF(W - bank - 13, y, 3, 1, hex('#dbc892')); }
  for (let i = 0; i < 40; i++) { const y = (i * 37 + t * 2) % H, x = 70 + (i * 53) % 180; rectF(x, y, 6, 1, hex('#92dbff')); }
  for (let i = 0; i < 12; i++) { const y = (i * 61 + t) % (H + 40) - 20; circF(18 + (i % 2) * 8, y, 9, hex('#246d36')); circF(W - 22 - (i % 2) * 8, y + 30, 9, hex('#246d36')); }
  const rx = 136, ry = 120 + Math.sin(t * .05) * 2;
  rectF(rx, ry + 10, 48, 18, hex('#926d49')); for (let x = rx; x < rx + 48; x += 6) rectF(x, ry + 10, 1, 18, hex('#6d4924'));
  G.party.forEach((id, i) => { const h = ART.hero[id === 'kid' ? 'kid' : id]; if (h) draw(h.u[0], rx + 2 + i * 12, ry - 4, h.P); });
  if (RAFT.bruce) { const bx = 150 + Math.sin(t * .04) * 40, by = 40 + RAFT.bruce; drawBruceFin(bx, by); }
} };
function drawBruceFin(x, y) { triF(x, y + 20, x + 14, y, x + 22, y + 20, hex('#6d92b6')); rectF(x - 4, y + 20, 30, 2, hex('#dbffff')); }
async function riverRaft() {
  FIELD_LOCK++; partyWith('yoko', 'face', 'oldface');
  await fadeOut(.08); const prevScene = scene; scene = raftScene; RAFT.t = 0; music('river'); await fadeIn(.08);
  await F('THE RIVER RUNS EAST TO GARFEILD. IT\'S FAST, IT\'S COLD, AND I DIDN\'T INVENT IT, SO I DON\'T TRUST IT.');
  await OF('IT\'S A RIVER. IT GOES ONE WAY. THAT\'S ALL I WANT FROM A RIVER.');
  await wait(90);
  if (await battle(FORMS[pickOne(forms('C'))], { bg: 'sea' }) === 'lose') return gameOver(); scene = raftScene; await fadeIn(.1);
  await wait(60);
  const c = await ask('THE RIVER FORKS.', null, ['TAKE THE LEFT FORK', 'TAKE THE RIGHT FORK']);
  if (c === 0) { await say('THE LEFT FORK SLOWS INTO A LITTLE COVE. THERE\'S A CRATE CAUGHT IN THE REEDS.'); invAdd('meal', 2); invAdd('coffee', 2); sfx('get'); await say('FOUND 2 MEALS AND 2 COFFEES. SOMEONE ELSE\'S PICNIC. NOT ANYMORE.'); }
  else if (await battle(FORMS[pickOne(forms('C'))], { bg: 'sea' }) === 'lose') return gameOver();
  scene = raftScene; await fadeIn(.1); await wait(60);
  RAFT.bruce = 1; music('bruce');
  for (let i = 0; i < 60; i++) { RAFT.bruce = 1 + i; await nextFrame(); }
  await BR('HEY! HI! HELLO! OH, A RAFT. I LOVE A RAFT. I\'VE NEVER BEEN ON ONE. I\'M A SHARK.');
  await F('...A SHARK. IN A RIVER.');
  await BR('I KNOW! SHARKS DON\'T GO IN RIVERS! AND YET. HERE I AM. I\'M BRUCE. I\'M NEVER WHERE I\'M SUPPOSED TO BE. IT\'S KIND OF MY THING.');
  await BR('ANYWAY THE FRANCHISE SAID IF I STOP YOU THEY\'LL GIVE ME A POOL. A WHOLE POOL! SALT WATER! SO. SORRY! NOTHING PERSONAL! CHOMP!');
  if (await battle('bruce1') === 'lose') return gameOver(); scene = raftScene; RAFT.bruce = 0; await fadeIn(.1);
  await BR('OKAY. OKAY! UNCLE! I\'LL SEE YOU AROUND. PROBABLY SOMEWHERE A SHARK SHOULDN\'T BE. BYE!');
  await wait(60); await fadeOut(.06); scene = prevScene;
  setFlag('raftDone'); FIELD_LOCK--;
  await toWorld(57, 52);
  obj('GARFEILD IS EAST, ON THE COAST. THE FRANCHISE IS MARCHING ON IT.', null, 98, 55);
}
// ---------------- GARFEILD ----------------
async function garfeildArrive() {
  setFlag('gfArrive'); FIELD_LOCK++;
  await say('THE TOWN IS BEING LICENSED. PLEASE STAND BEHIND THE YELLOW LINE.', 'LICENSEE');
  await F('THERE\'S NO YELLOW LINE.');
  await say('THEN YOU\'RE IN VIOLATION. HALT.', 'LICENSEE');
  if (await battle('gfgate') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('gfCleared');
  obj('THE DINER IS AT THE TOP OF THE TOWN. THE DETECTIVE WHO RUNS IT IS HOLDING THE DOOR.', 'diner', 7, 4);
  FIELD_LOCK--;
  MAPS.diner.enter = async () => { if (!flag('cacheCleared')) await dinerSiege(); };
}
async function dinerSiege() {
  FIELD_LOCK++;
  await JB('YOU\'RE NOT FROM THE FRANCHISE. YOU\'RE FROM SOMEWHERE WORSE. YOU\'RE FROM OUT OF TOWN.');
  await JB('I\'M JB GARFIELD. I RUN THIS DINER. I\'M ALSO A DETECTIVE. THE TWO JOBS ARE THE SAME JOB: YOU WATCH THE DOOR AND YOU WAIT FOR TROUBLE TO ORDER SOMETHING.');
  await Y('THE FRANCHISE IS OUTSIDE.');
  await JB('I KNOW. I CAN SEE THEM. THEY\'VE BEEN STANDING OUT THERE SO LONG I\'M THINKING OF CHARGING THEM.');
  const g = addNpc({ who: 'exec', x: 7, y: 8, dir: 'u', P: ART.pal('suit') });
  await walk(g, 'uu');
  await say('JB GARFIELD. I\'M GENERAL BACKUP. HUMAN RESOURCES. THE FRANCHISOR WANTS THE DINER LICENSED. NOBODY HAS TO GET HURT. NOBODY EVER HAS TO GET HURT. IT\'S IN THE HANDBOOK.', 'BACKUP FACE');
  await JB('THIS DINER ISN\'T FOR SALE.');
  await say('IT\'S NOT A SALE. IT\'S A LICENSE. YOU KEEP EVERYTHING. YOU JUST DON\'T OWN IT ANYMORE. MOST PEOPLE DON\'T NOTICE THE DIFFERENCE.', 'BACKUP FACE');
  await JB('I\'M A DETECTIVE. NOTICING THE DIFFERENCE IS THE WHOLE JOB.');
  await say('...I RESPECT THAT. I\'VE BEEN CALLED BACK TO THE CAPITAL. I\'LL TELL THEM YOU NEED TIME. I WILL TRY TO GET YOU TIME.', 'BACKUP FACE');
  await walk(g, 'dd'); g.gone = 1;
  sfx('tick'); await wait(8); sfx('tick'); await wait(8); sfx('tick');
  await K('HEH HEH HEH. BACKUP\'S GONE. YOU KNOW WHAT THAT MEANS. NOBODY\'S BACKING ANYTHING UP.');
  await K('THIS TOWN HAS A LOT OF MEMORIES IN IT, DOESN\'T IT, DETECTIVE? THIRTY YEARS OF COFFEE. EVERY REGULAR. EVERY FACE.');
  await K('I\'M GOING TO CLEAR THE CACHE.');
  await JB('...YOU\'RE GOING TO DO WHAT?');
  await K('SELECT! HEH HEH HEH HEH!');
  if (await battle('gfsiege') === 'lose') return gameOver(); await fadeIn(.1);
  for (let i = 0; i < 6; i++) { sfx('glitch'); post.flash = .5; post.wave = 3; await wait(6); post.flash = 0; await wait(8); } post.wave = 0;
  await say('SOMETHING IN THE AIR WENT QUIET. LIKE A ROOM WHERE EVERYONE STOPPED TALKING AT ONCE.', null);
  await say('...SORRY, HAVE WE MET? ARE YOU WAITING FOR A TABLE?', 'WAITRESS');
  await JB('...DOT. IT\'S ME. GARF. I\'VE POURED YOUR COFFEE EVERY MORNING FOR THIRTY YEARS.');
  await say('I DON\'T DRINK COFFEE. I DON\'T THINK. DO I? SORRY. WHO ARE YOU?', 'WAITRESS');
  await JB('...');
  await JB('THAT\'S A FIASCO.');
  await JB('HE DIDN\'T TAKE THE TOWN. HE TOOK THE TOWN\'S MEMORY OF ME. THE DINER\'S STILL HERE. I\'M JUST NOT IN IT.');
  await Y('I\'M SORRY.');
  await JB('DON\'T BE SORRY. BE USEFUL. I\'M COMING WITH YOU. EVERYONE HERE IS A STRANGER NOW. I\'D RATHER BE A STRANGER SOMEWHERE I CAN DO SOMETHING.');
  setFlag('cacheCleared'); setFlag('garfieldJoined');
  await join('garfield', 13, { w: 'cane2', a: 'vest', h: 'hardhat' }); partyWith('garfield', 'yoko');
  await JB('THE FRANCHISE WENT EAST INTO THE FOREST. THERE\'S A STATION IN THERE. A TRAIN STOPS THAT ISN\'T ON ANY SCHEDULE. THAT\'S A CLUE.');
  obj('THE STATION IS IN THE FOREST SOUTHWEST OF GARFEILD.', null, 82, 64);
  FIELD_LOCK--;
}
// ---------------- THE STATION ----------------
async function hirePilot() {
  FIELD_LOCK++;
  await PX('...');
  await PX('YOU\'RE GOING THROUGH THE FOREST. THE ONLY WAY THROUGH THE FOREST IS THE TRAIN. THE TRAIN ONLY STOPS FOR THE DEAD AND FOR ME.');
  await JB('AND WHO ARE YOU?');
  await PX('PILOT X. FOR HIRE. I FLY THINGS. I FLY PEOPLE. I FLY AWAY FROM PEOPLE.');
  const c = await ask('PILOT X WANTS 500 GP TO GET YOU ON THE TRAIN.', 'PILOT X', ['PAY 500 GP', 'ASK NICELY']);
  if (c === 0 && G.gp >= 500) { G.gp -= 500; setFlag('pilotPaid'); await PX('PLEASURE. I\'LL REMEMBER YOU PAID. I REMEMBER WHO PAYS.'); }
  else await PX('...FINE. I\'M GOING THAT WAY ANYWAY. DON\'T MAKE IT WEIRD. I MIGHT LEAVE WHENEVER I WANT. THAT\'S PART OF THE DEAL.');
  setFlag('pilotHired'); await join('pilotx', 14, { w: 'dart2', a: 'vest', h: 'helm3' });
  obj('BOARD THE TRAIN. IT\'S AT THE TOP OF THE PLATFORM.', 'train3', 17, 4);
  FIELD_LOCK--;
}
async function trainBoss() {
  FIELD_LOCK++;
  await say('ALL ABOARD. ALL ABOARD. ALL ABOARD FOREVER.', 'THE RERUN EXPRESS');
  await JB('THE TRAIN IS TALKING.');
  await say('EVERY CANCELED THING RIDES ME TO THE OTHER SIDE. NOBODY GETS OFF. NOBODY GETS PICKED BACK UP. YOU HAVE BEEN CANCELED.', 'THE RERUN EXPRESS');
  await PX('WE HAVEN\'T. WE\'RE STILL ON.');
  if (await battle('rerunexp') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('trainDone');
  await say('THE TRAIN SHUDDERS, SLOWS, AND STOPS AT THE EDGE OF A CLIFF. THE SIGN SAYS "LAST STOP." A WATERFALL GOES DOWN FOREVER.', null);
  await PX('ONLY WAY OFF IS DOWN. I\'VE DONE WORSE. ONCE.');
  await fadeOut(.04); sfx('flush'); await wait(60);
  await showCard(['THE PARTY JUMPED.', '', 'THEY LANDED IN THE PLAINS OF WAITING,', 'WHERE EVERYTHING TAKES A WHILE.'], 150);
  FIELD_LOCK--;
  await toWorld(86, 80);
  obj('THERE\'S A BUS STOP ON THE PLAINS. SOMEONE\'S SITTING AT IT.', null, 86, 79);
}
// ---------------- THE PLAINS OF WAITING ----------------
async function kidWaiting() {
  FIELD_LOCK++;
  await KD('ARE YOU MY RIDE?');
  await Y('...WHO ARE YOU WAITING FOR?');
  await KD('I DON\'T REMEMBER. A GROWN-UP. THEY SAID "WAIT HERE." SO I\'M WAITING HERE.');
  await KD('I\'M GOOD AT WAITING. I\'M BAD AT HOLDING IT. THERE\'S NO BATHROOM AT A BUS STOP. NOBODY THINKS ABOUT THAT.');
  await JB('HOW LONG HAVE YOU BEEN HERE, KID?');
  await KD('A WHILE. THE PLAINS ARE CALLED THE PLAINS OF WAITING. EVERYBODY HERE IS WAITING FOR SOMETHING. THE CHAIRS ARE WAITING. THE LINE IS WAITING.');
  const c = await ask('COME WITH US?', 'YOKO', ['COME WITH US.', 'WE\'LL TELL THEM WHERE YOU WENT.']);
  if (c === 1) await KD('OKAY. THAT\'S FAIR. THAT\'S ALL I WANTED. SOMEBODY TO TELL THEM.');
  await KD('...OKAY. BUT I DON\'T FIGHT. I\'M NOT ALLOWED. I ASK. I PERFORM. I INSPECT. I\'M THREE KIDS, KIND OF. IT\'S A LONG STORY.');
  setFlag('kidJoined'); await join('kid', 15, { w: 'toy2', a: 'robe', h: 'cap' });
  obj('THE PORT IS SOUTHWEST, ON THE COAST OF THE PLAINS.', null, 50, 87);
  FIELD_LOCK--;
}
// ---------------- THE PORT: Carl comes back with somebody ----------------
async function portReunion() {
  FIELD_LOCK++;
  const c = addNpc({ who: 'carl', x: 10, y: 5, dir: 'd' }), l = addNpc({ who: 'linda', x: 11, y: 5, dir: 'd' });
  await walkTo('P', 10, 8);
  await C('HEY! HEY. I FOUND YOU. I SAID I WOULD. I ALSO FOUND SOMEBODY ELSE. I WASN\'T LOOKING FOR HER. THAT\'S HOW YOU FIND THE GOOD STUFF.');
  await Y('WHO IS SHE?');
  await LI('LINDA. FORMERLY GENERAL LINDA OF THE FRANCHISE, THIRD DIVISION. CURRENTLY: UNAFFILIATED.');
  await C('THEY HAD HER CHAINED TO A DESK IN PRESTIGE. LIKE, A REALLY NICE DESK.');
  await LI('I WAS BEING REVIEWED. I REFUSED TO LICENSE A TOWN. THEY CALL THAT A PERFORMANCE ISSUE.');
  await JB('WHY\'D YOU REFUSE?');
  await LI('BECAUSE THE TOWN WAS MINE. I BUILT IT. I FOLLOWED THROUGH ON IT. I DON\'T HAND OFF WHAT I FOLLOWED THROUGH ON.');
  await LI('ALSO, I DON\'T TRUST KURSOR. HE NEVER READS WHAT HE SELECTS.');
  await Y('...ARE YOU ASKING TO COME WITH US?');
  await LI('I DON\'T ASK. I PROPOSE TERMS. HERE ARE MY TERMS: I COME WITH YOU, AND WHEN THIS IS OVER, NOBODY OWNS ANYBODY.');
  await Y('...I ACCEPT THOSE TERMS. BECAUSE I WANT TO.');
  c.gone = 1; l.gone = 1; delete G.flags.away_carl; setFlag('lindaJoined');
  await join('linda', 16, { w: 'wand', a: 'suit', h: 'helm3' });
  partyWith('linda', 'yoko', 'carl');
  await LI('THE FERRY GOES SOUTH TO PRESTIGE. THE FRANCHISE\'S CAPITAL IS ON THE SOUTH CONTINENT. SO IS THE OPERA, IF ANYONE CARES.');
  await C('I CARE ABOUT THE OPERA. I\'VE NEVER BEEN. I HEAR YOU HAVE TO BE QUIET. I\'M VERY GOOD AT BEING QUIET.');
  await say('...', 'CEO LINDA');
  await say('(YOU CAN CHANGE WHO\'S IN THE PARTY FROM THE MENU: ORDER, THEN CHANGE PARTY.)', null);
  obj('TAKE THE FERRY SOUTH. THE SAILOR IS ON THE DOCK.', 'port', 10, 5);
  FIELD_LOCK--;
}
async function ferrySouth() {
  FIELD_LOCK++; await fadeOut(.05); music('river');
  await showCard(['THE FERRY CROSSED THE SOUTHERN STRAIT.', '', 'SOMETHING FOLLOWED IT THE WHOLE WAY,', 'WAVING.'], 150);
  setFlag('southReached'); FIELD_LOCK--;
  await toWorld(27, 99);
  obj('PRESTIGE IS JUST WEST. EVERYONE THERE IS TALKING ABOUT THE OPERA.', null, 24, 100);
}

// ---------------- foes and bosses for part 2 ----------------
const bruceDraw = g => {
  g.e(46, 30, 40, 16, 2); g.each((x, y) => g.get(x, y) === 2 && y > 34 ? 4 : 0);
  g.each((x, y) => y > 1 && y < 18 && x > 42 - (y - 2) * .1 && x < 44 + (16 - y) * .1 + (y - 2) * .9 && Math.abs(x - 46) < y * .9 ? 2 : 0);
  g.line(8, 22, 0, 10, 2); g.line(8, 36, 0, 46, 2); g.line(9, 23, 2, 12, 3); g.line(9, 35, 2, 44, 3);
  g.e(70, 24, 3, 3, 12); g.e(71, 24, 1.5, 2, 13); g.e(76, 37, 9, 4, 13); for (let x = 68; x < 85; x += 3) { g.r(x, 34, 2, 2, 12); g.r(x + 1, 39, 2, 2, 12); }
  g.line(40, 42, 32, 54, 3); g.line(44, 42, 50, 54, 3); g.e(60, 32, 2, 1, 6);
};
foe('bruce1', 'BRUCE THE SHARK', 11, { kit: 'bruce', draw: bruceDraw, size: [92, 56], c: ['#6d92b6', '#db2449', '#ffffff', '#ffffff'] }, { boss: 1, hp: 5, atk: 1.1, xp: 5, ap: 10, weak: ['zap'], steal: 'meal',
  extra: { onHurt: u => { if (u.hp < u.mhp * .3 && !u.v.left) { u.v.left = 1; B.actQ.unshift({ actor: u, kind: 'enemy', force: 1, targets: [u], move: MV(null, { run: async () => { await say('OW! OKAY! YOU WIN! I\'M NOT EVEN SUPPOSED TO BE HERE!', 'BRUCE'); u.hp = 0; u.gone = 1; B.forceEnd = 'win'; } }) }); } } },
  ai: u => pickOne([{ kind: 'fight' }, MV('CHOMP', { pow: 1.8 }), MV('SPLASH', { sp: 22, elem: 'wet', tgt: 'all', split: 1 }), MV('FRIENDLY WAVE', { run: async () => bmsg('BRUCE WAVES. NOTHING HAPPENS. HE JUST WANTED TO WAVE.', 90) })]) });
form('bruce1', ['bruce1'], { at: [['bruce1', 30, 40]], bg: 'sea', boss: 1, noRun: 1, music: 'bruce' });
form('gfgate', ['licensee2', 'liquidator', 'licensee2'], { bg: 'town', noRun: 1 });
form('gfsiege', ['mascot', 'liquidator', 'licensee2', 'liquidator'], { bg: 'town', noRun: 1 });
// THE RERUN EXPRESS: the train that takes canceled shows to the other side. It's undead: telling it to CONTINUE ends it.
const trainDraw = g => {
  g.r(4, 14, 100, 34, 2); g.r(4, 14, 100, 6, 4); g.r(84, 4, 16, 12, 2); g.r(80, 2, 24, 4, 3); g.e(98, 30, 10, 14, 6); g.e(98, 30, 7, 10, 9); g.e(99, 28, 3, 3, 11);
  for (let x = 10; x < 70; x += 18) { g.r(x, 22, 12, 10, 13); g.r(x + 2, 24, 8, 6, 11); }
  for (let x = 12; x < 100; x += 20) { g.e(x, 50, 8, 8, 13); g.e(x, 50, 4, 4, 14); }
  g.r(0, 44, 106, 3, 3); g.r(70, 16, 8, 8, 13); g.p(73, 19, 11); g.p(76, 19, 11);
  for (let i = 0; i < 6; i++) g.e(20 + i * 8, 6 - (i & 1) * 2, 4, 3, 12);
};
foe('rerunexp', 'THE RERUN EXPRESS', 15, { kit: 'train', draw: trainDraw, size: [110, 60], c: ['#492449', '#b649ff', '#ffdb49', '#24dbff'] }, { boss: 1, undead: 1, hp: 8, atk: 1.2, xp: 7, ap: 14, weak: ['hot'], noErase: 1,
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.v.t % 4 === 0) return MV('ALL ABOARD', { sp: 30, tgt: 'all', status: 'sleep', hit: 30, split: 1 }); if (u.v.t % 4 === 2) return MV('WHISTLE', { status: 'mute', hit: 50, tgt: 'all' }); return pickOne([{ kind: 'fight' }, MV('RUN OVER', { pow: 2 }), MV('SCHEDULE', { run: async () => { u.hp = Math.min(u.mhp, u.hp + 300); pop(u, 300, BCOL.heal); bmsg('THE TRAIN IS RUNNING ON SCHEDULE. IT FEELS BETTER.'); } })]); } });
FOES.rerunexp.look.draw = trainDraw;
form('rerunexp', ['rerunexp'], { at: [['rerunexp', 20, 40]], bg: 'train', boss: 1, noRun: 1 });
