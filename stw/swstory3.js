'use strict';
// ================= SAVE THE WORLD: story, part 3 — THE OPERA, THE BROADCAST, THE FACTORY, THE MEMORY CARD, THE MERGER DINNER, THE CLOUD =================
const STAR = (s, o) => say(s, 'THE MOVIE STAR', o);
// ---------------- PRESTIGE ----------------
async function starMansion() {
  if (flag('starPlan')) { await STAR('THE OPERA HOUSE IS SOUTHEAST OF TOWN. I\'LL MEET YOU IN THE LOBBY. BRING THE GENERAL. BRING HER VOICE.'); return; }
  FIELD_LOCK++;
  await STAR('YOU\'RE NOT HERE FOR AN AUTOGRAPH. NOBODY\'S HERE FOR AN AUTOGRAPH ANYMORE. IT\'S THE GHOST, ISN\'T IT.');
  await STAR('SPOOKY GHOST. HE OWNS THE ONLY AIRSHIP IN THE WORLD. A FLYING TV STUDIO CALLED THE BROADCAST. HE SENT ME A LETTER.');
  await say('"DEAR OPERA. TONIGHT I WILL TAKE THE DIVA LYNDA AND MARRY HER ON LIVE TELEVISION. WITH LOVE, SPOOKY GHOST. P.S. BOO."', null);
  await C('AN AIRSHIP. WE NEED AN AIRSHIP. THE FRANCHISE CAPITAL IS BEHIND THE MOUNTAINS.');
  await STAR('AND LYNDA WON\'T GO ON. SHE\'S IN THE CAFE EATING A SCONE AND REFUSING EVERYTHING.');
  await STAR('...WAIT. TURN AROUND. LET ME SEE YOU IN THE LIGHT.');
  await LI('NO.');
  await STAR('YOU LOOK EXACTLY LIKE HER. ONE LETTER OFF. SHE\'S LYNDA WITH A Y. YOU\'RE LINDA WITH AN I. NOBODY WILL NOTICE. NOBODY EVER NOTICES THE Y.');
  await LI('I DON\'T SING. I PRESENT.');
  await STAR('SINGING IS JUST PRESENTING WITH FEELINGS.');
  await Y('IF YOU STAND IN FOR HER, THE GHOST TAKES YOU INSTEAD. AND TAKES YOU TO HIS AIRSHIP.');
  await LI('...AND THEN I NEGOTIATE. FINE. I\'LL DO IT. I\'M GOING TO NEED THE LYRICS.');
  await STAR('HERE. LEARN THEM. THE SHOW IS TONIGHT. SOUTHEAST OF TOWN.');
  await showCard(['"THE SAVE AND THE SLOT" - ACT II, THE ARIA', '', 'O MY SAVE FILE, SO FAR AWAY NOW,', 'WILL I EVER SEE YOUR SLOT AGAIN?', 'MUST I OVERWRITE YOU WITH SOMETHING NEW,', '...OR WILL YOU WAIT, SO I CAN CONTINUE?'], 0);
  setFlag('starPlan'); obj('THE OPERA HOUSE IS SOUTHEAST OF PRESTIGE.', null, 34, 104);
  FIELD_LOCK--;
}
// ---------------- THE OPERA: the aria ----------------
const ARIA = [
  ['O MY SAVE FILE, SO FAR AWAY NOW,', 'O MY SANDWICH, I ATE YOU TOO FAST,', 'O MY TAXES, PLEASE DO YOURSELVES,'],
  ['WILL I EVER SEE YOUR SLOT AGAIN?', 'WILL I EVER FIND MY OTHER SHOE?', 'IS THIS SEAT TAKEN, SIR?'],
  ['MUST I OVERWRITE YOU WITH SOMETHING NEW,', 'MUST I LICENSE YOU TO MY SHAREHOLDERS,', 'MUST I GO ON? (I MUST. I\'M UNDER CONTRACT.)'],
  ['...OR WILL YOU WAIT, SO I CAN CONTINUE?', '...OR IS THERE A HIDDEN FEE?', '...OR IS IT BRUNCH?'],
];
const OPS = { t: 0, line: '', boo: 0, cheer: 0 };
const operaScene = { update() { OPS.t++; }, draw() {
  rectF(0, 0, W, H, hex('#100408'));
  for (let x = 0; x < W; x += 6) rectF(x, 0, 4, 40 + Math.sin(x * .1) * 5, hex('#922436'));
  rectF(0, 0, W, 4, hex('#dbb624'));
  rectF(30, 100, 260, 30, hex('#926d24')); for (let x = 30; x < 290; x += 14) rectF(x, 100, 1, 30, hex('#6d4924'));
  for (let i = 0; i < 3; i++) { const x = 110 + i * 50; for (let y = 4; y < 100; y++) { const w = (y - 4) * .35; rectA(x - w, y, w * 2, 1, hex('#ffffdb'), .12); } }
  draw(ART.npc.diva.d[0], 152, 74, ART.hero.linda.P.map((c, i) => i === 4 || i === 5 ? hex(i === 4 ? '#ff6db6' : '#b62492') : c));
  draw(ART.npc.diva.d[0], 152, 74, ART.pal('diva'));
  draw(ART.field('linda', 'd', 0), 152, 74, ART.pal('linda'));
  for (let i = 0; i < 26; i++) { const x = 6 + i * 12, y = 150 + (i & 1) * 6; circF(x, y, 6, hex('#1a0810')); rectF(x - 6, y + 4, 12, 30, hex('#1a0810')); if (OPS.boo > 0 && (i * 7 + OPS.t) % 9 === 0) text('BOO', x - 8, y - 14, hex('#ff4949'), 0); if (OPS.cheer > 0 && (i * 5 + OPS.t) % 11 === 0) text('!', x - 2, y - 12, hex('#ffdb49'), 0); }
  if (OPS.boo > 0) OPS.boo--; if (OPS.cheer > 0) OPS.cheer--;
  if (OPS.line) { const L = wrapT(OPS.line, 44); L.forEach((l, k) => ctext(l, 50 + k * 10, hex('#ffffdb'), BLACK)); for (let i = 0; i < 3; i++) text('~', 120 + i * 30 + Math.sin(OPS.t * .1 + i) * 4, 66 - (OPS.t + i * 10) % 20, hex('#ffdb49'), 0); }
} };
async function operaLobby() {
  if (flag('ariaDone')) { await STAR('THE RAFTERS! HURRY!'); return; }
  FIELD_LOCK++;
  await STAR('THERE YOU ARE. CURTAIN IS IN FIVE MINUTES. NO. CURTAIN IS NOW. EVERYTHING IN THEATER IS NOW.');
  partyWith('linda', 'yoko', 'carl');
  await fadeOut(.05); const prev = scene; scene = operaScene; OPS.line = ''; music('aria'); await fadeIn(.04);
  await say('THE HOUSE LIGHTS GO DOWN. THE CURTAIN GOES UP. LINDA WALKS INTO THE LIGHT LIKE SOMEONE WALKING INTO A BOARD MEETING.', null);
  let fails = 0;
  for (let v = 0; v < ARIA.length; v++) {
    const opts = ARIA[v].map((s, i) => [s, i]).sort((a, b) => swh(v, a[1], fails) - swh(v, b[1], fails));
    DBG.aria = opts.findIndex(o => o[1] === 0);
    const c = await choose(opts.map(o => o[0]), { y: 150 });
    OPS.line = opts[c][0]; sfx('ok'); await wait(90);
    if (opts[c][1] !== 0) { OPS.boo = 120; music(null); sfx('hurt'); await say('THE AUDIENCE BOOS. SOMEONE THROWS A PROGRAM.', null); await STAR('FROM THE TOP! FROM THE TOP! IT\'S IN THE SCRIPT, GENERAL!'); fails++; v = -1; OPS.line = ''; music('aria'); if (fails >= 3) await LI('...FINE. I\'LL READ IT OFF MY HAND.'); continue; }
    OPS.cheer = 40;
  }
  DBG.aria = undefined; OPS.line = ''; OPS.cheer = 200; sfx('crowd'); await wait(60);
  await say('THE HOUSE ERUPTS. LINDA BOWS. IT IS A PRECISE, CORRECT BOW.', null);
  await say('A NOTE FLUTTERS DOWN FROM THE RAFTERS.', null);
  await BR('"DEAR DIVA. I\'M IN THE RAFTERS WITH A FOUR-TON WEIGHT. NOTHING PERSONAL. THE FRANCHISE SAID THEY\'D GIVE ME A POOL. LOVE, BRUCE (THE SHARK)."');
  await C('HOW IS HE IN THE RAFTERS. HE\'S A SHARK.');
  await STAR('THE RAFTERS ARE THROUGH THE STAGE DOOR AT THE TOP OF THE LOBBY. YOU HAVE FIVE MINUTES BEFORE THE FINALE. GO!');
  scene = prev; await fadeOut(.05); setFlag('ariaDone'); partyWith('carl', 'yoko'); G.party = G.party.filter(k => k !== 'linda'); if (G.party.length < 3) partyWith('carl', 'yoko', 'face', 'garfield');
  music(M.def.music); await fadeIn(.05);
  obj('THE STAGE DOOR AT THE TOP OF THE LOBBY GOES UP TO THE RAFTERS.', 'oprafters', 26, 12);
  FIELD_LOCK--;
}
async function raftersTooLate() {
  FIELD_LOCK++;
  await say('A FOUR-TON WEIGHT LANDS ON THE STAGE. NOBODY IS HURT. THE SET IS. THE FINALE IS RUINED.', null);
  await STAR('...WE\'LL DO IT AGAIN. THEATER IS ALWAYS AGAIN. GO BACK UP. BRUCE HAS ANOTHER WEIGHT. HE ALWAYS HAS ANOTHER WEIGHT.');
  FIELD_LOCK--; await goMap('oprafters', 1, 7, 'r'); G.timer = { left: 60 * 300, end: () => raftersTooLate() };
}
async function raftersBruce() {
  G.timer = null; FIELD_LOCK++;
  await BR('OH! HI AGAIN! IT\'S YOU GUYS! FROM THE RIVER! THIS IS SO FUNNY. A SHARK. IN THE RAFTERS. AT THE OPERA.');
  await C('WHY ARE YOU EVERYWHERE?');
  await BR('I DON\'T KNOW! I GO WHERE THE WORK IS! ANYWAY I HAVE TO DROP THIS WEIGHT. SORRY. IT\'S A WHOLE THING.');
  if (await battle('bruce2') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('bruce2Done');
  await BR('OKAY, OKAY, OKAY! BUT HEY. IF I\'M NOT DROPPING IT... WHO\'S HOLDING IT?');
  sfx('powerdown'); post.shake = 4; await wait(30); post.shake = 0;
  await say('BRUCE, THE WEIGHT, THE PARTY AND A GREAT DEAL OF SCENERY FALL ONTO THE STAGE IN THE MIDDLE OF THE FINALE.', null);
  await say('THE AUDIENCE GIVES IT A STANDING OVATION.', null);
  await fadeOut(.05); music('ghost');
  await say('AND THEN THE ROOF OPENS.', null);
  await panels([{ port: 'SPOOKY GHOST', text: 'GOOD EVENING, OPERA. YOU\'RE WATCHING THE BROADCAST. AND I\'M TAKING THE DIVA.', bg: '#dbdbff' }, { port: 'CEO LINDA', text: '...THAT\'S ME. FOR TONIGHT, THAT\'S ME.', bg: '#ffdbdb' }, { port: 'CARL', text: 'HE\'S TAKING HER! THAT\'S THE PLAN! WHY DOES THE PLAN FEEL BAD!', bg: '#dbffdb' }, { text: 'THE PARTY GRABS THE LANDING GEAR.', sfx: 'WHOOSH', bg: '#ffffdb' }]);
  setFlag('lindaTaken'); FIELD_LOCK--;
  await goMap('broadcast', 9, 7, 'u', { noFade: 1 }); await fadeIn(.05);
  obj('GHOST TOOK LINDA INTO HIS STUDIO, BELOW DECK.', 'ghoststudio', 6, 3);
}
// ---------------- THE BROADCAST: the wheel ----------------
async function ghostWheel() {
  FIELD_LOCK++;
  await GH('OH NO. OH NO NO NO. YOU\'RE NOT LYNDA. YOU\'RE LINDA. WITH AN I. I KIDNAPPED THE WRONG VOWEL.');
  await LI('YOU KIDNAPPED A FORMER GENERAL OF THE FRANCHISE AND HER COLLEAGUES. THAT\'S AN UPGRADE.');
  await GH('MY WHOLE SEASON WAS GOING TO BE THE WEDDING. I HAD SPONSORS. I HAD A CAKE.');
  await Y('WE NEED YOUR AIRSHIP. THE FRANCHISE IS PULLING THE SAVE SPIRITS OUT OF THE WORLD. WE HAVE TO GET OVER THE MOUNTAINS.');
  await GH('EVERYBODY WANTS SOMETHING FROM GHOST. NOBODY WANTS GHOST.');
  await LI('THEN LET\'S MAKE IT A GAME. YOU HAVE A WHEEL. EVERY HOST HAS A WHEEL.');
  await LI('SPIN IT. IF IT LANDS ON GUEST, YOU JOIN US. IF IT DOESN\'T, I MARRY YOU ON LIVE TELEVISION.');
  await C('LINDA.');
  await GH('...DEAL. NOBODY BETS AGAINST THE WHEEL. THE WHEEL IS ON MY SIDE. THE WHEEL IS MY ONLY FRIEND.');
  sfx('switch'); for (let i = 0; i < 30; i++) { sfx('tick'); await wait(2 + (i >> 2)); }
  await say('THE WHEEL LANDS ON GUEST.', null);
  await GH('...GUEST. IT LANDED ON GUEST. IT ALWAYS LANDS ON BOO. IT HAS LANDED ON BOO FOR ELEVEN YEARS.');
  await LI('I BOUGHT THE WHEEL. WHILE YOU WERE MONOLOGUING. IT\'S A FRANCHISE WHEEL. EVERYTHING IS.');
  await GH('...YOU\'RE TERRIBLE. I LOVE IT. FINE! THE BROADCAST IS YOURS. I\'M COMING TOO. IT\'S MY SHIP AND I\'M THE HOST.');
  await GH('AND I WANT TO SEE THE LOOK ON THE FRANCHISOR\'S FACE. HE DOESN\'T HAVE ONE. THAT\'S THE JOKE. I\'LL BE THERE FOR THE JOKE.');
  setFlag('ghostJoined'); await join('ghost', 20, { w: 'mic3', a: 'armor4', h: 'helm3' }); partyWith('linda', 'ghost', 'yoko', 'carl');
  setFlag('airship'); obj('FRANCHISE CITY IS ACROSS THE MOUNTAINS, EAST. TALK TO GHOST ON DECK TO FLY.', null, 84, 100);
  FIELD_LOCK--;
}
async function leaveBroadcast() { G.vehicle = 'air'; AIR.x = (flag('cloudRisen') && !flag('newGame') ? 70 : G.wx || 35) * TS; AIR.y = (G.wy || 103) * TS; AIR.a = -Math.PI / 2; AIR.h = 90; AIR.sp = 0; G.ship = null; await toWorld(AIR.x / TS | 0, AIR.y / TS | 0); }
// ---------------- FRANCHISE CITY and THE FACTORY ----------------
async function fcityArrive() {
  setFlag('fcityIn'); FIELD_LOCK++;
  await LI('FRANCHISE CITY. I USED TO WORK HERE. EVERY BUILDING IS LICENSED FROM ANOTHER BUILDING.');
  await LI('THE FACTORY IS AT THE NORTH GATE. THE GUARD THERE OWES ME FOUR VACATION DAYS. LET ME TALK TO HIM.');
  const g = M.npcs.find(n => n.who === 'trooper');
  await say('...GENERAL? YOU\'RE UNDER REVIEW. YOU\'RE NOT ALLOWED IN.', 'LICENSEE');
  await LI('I APPROVED YOUR VACATION DAYS. ALL FOUR. EFFECTIVE IMMEDIATELY.');
  await say('...I\'M GOING TO GO ON VACATION.', 'LICENSEE');
  if (g) g.gone = 1; setFlag('factoryOpen');
  obj('THE FACTORY IS THROUGH THE NORTH GATE.', 'factory2', 11, 8);
  FIELD_LOCK--;
}
async function extractorScene() {
  FIELD_LOCK++;
  await say('THE FLOOR IS LINED WITH GLASS TUBES. SOMETHING IS INSIDE EACH ONE, GLOWING FAINTLY, LIKE A SAVE SCREEN LEFT ON OVERNIGHT.', null);
  await Y('...THEY\'RE ALIVE. THEY\'RE SAVE SPIRITS. THEY\'RE BEING... READ.');
  await say('PLEASE REMAIN STILL. EXTRACTION IN PROGRESS. YOUR MEMORIES ARE IMPORTANT TO US.', 'THE EXTRACTOR');
  if (await battle('extractor') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('extractorDone');
  await say('THE TUBES CRACK. THE LIGHT INSIDE THEM COMES OUT SLOWLY, AND IT DOESN\'T LEAVE.', null);
  await say('WE CAN\'T GO HOME LIKE THIS. THERE ISN\'T ENOUGH OF US LEFT TO LOAD.', 'A SAVE SPIRIT');
  await say('SO TAKE WHAT\'S LEFT. KEEP IT. A SAVE IS ONLY WORTH SOMETHING IF SOMEBODY LOADS IT.', 'A SAVE SPIRIT');
  const got = ['clerk', 'biscuit', 'pill', 'bus', 'star', 'prof', 'yokoid', 'taka'];
  for (const k of got) if (!G.crystals.includes(k)) G.crystals.push(k);
  sfx('get'); await say('GOT 8 SAVE CRYSTALS. (EQUIP THEM IN THE MENU: CRYSTAL. EACH ONE TEACHES MAGIC AFTER BATTLES, AND CAN BE SUMMONED.)', null);
  sfx('tick'); await wait(8); sfx('tick');
  await K('HEH HEH HEH. LINDA. YOU BROUGHT THEM RIGHT TO THE FACTORY. JUST LIKE WE PLANNED.');
  await C('...WHAT?');
  await K('OH, DIDN\'T SHE TELL YOU? SHE NEVER STOPPED WORKING FOR US. SHE\'S IN SALES. SHE BROUGHT ME THE ASSISTANT AND EIGHT SPIRITS. WHAT A QUARTER.');
  await LI('HE\'S LYING.');
  await C('...');
  await Y('I KNOW. HIS TEXT SCROLLED SLOWER.');
  await K('...THAT\'S NOT A REAL THING.');
  await LI('KURSOR. I NEVER READ WHAT I SIGN EITHER, BUT I KNOW WHO I SIGN FOR. NOT YOU.');
  await K('FINE! FINE. THEN I\'LL HAVE YOU ALL LICENSED. ALL AT ONCE. ONE CONTRACT. THE BIG ONE. SELECT!');
  if (await battle('license') === 'lose') return gameOver(); await fadeIn(.1);
  await K('NO! THE LICENSE! IT HAD SUCH NICE FONTS. YOU\'LL HEAR FROM LEGAL! HEH HEH! YOU WON\'T! THERE IS NO LEGAL! IT\'S ME!');
  obj('THE CONVEYOR OUT IS AT THE BOTTOM OF THE FLOOR. GO!', 'factory3', 25, 4);
  FIELD_LOCK--;
}
async function conveyorEscape() {
  G.timer = { left: 60 * 75, end: async () => { await say('THE CONVEYOR TAKES YOU BACK TO THE START. THE FACTORY IS VERY EFFICIENT ABOUT RETURNS.', null); await goMap('factory3', 1, 4, 'r'); G.timer = { left: 60 * 75, end: MAPS.factory3.enter }; } };
  await say('THE CONVEYOR STARTS MOVING. THE ALARM STARTS SAYING "THANK YOU FOR VISITING." GET TO THE OTHER END!', null);
}
async function conveyorOut() {
  G.timer = null; FIELD_LOCK++; setFlag('factoryDone');
  await goMap('fcity', 12, 5, 'd');
  await say('OUTSIDE, THE EIGHT CRYSTALS IN THE PARTY\'S BAGS START TO GLOW AT THE SAME TIME.', null);
  await Y('THEY\'RE WARM. THEY\'RE ASKING ME SOMETHING. ALL OF THEM, AT ONCE.');
  await Y('...THEY\'RE ASKING ME WHAT I WANT.');
  post.flash = .8; sfx('power'); await wait(20); post.flash = 0;
  for (let i = 0; i < 3; i++) { post.flash = .5; await wait(6); post.flash = 0; await wait(6); }
  await panels([{ port: 'YOKO', text: 'I WANT THEM TO GO HOME.', bg: '#ffdbff' }, { port: 'THE EMPRESS', text: 'I WANT THEM TO GO HOME.', bg: '#dbdbff' }]);
  await LI('...YOU CHANGED. YOUR WHOLE PALETTE CHANGED.');
  await Y('IT\'S STILL ME. I THINK IT\'S MORE ME.');
  setFlag('empress'); setFlag('gateKnown');
  await say('YOKO CAN NOW USE EMPRESS IN BATTLE. HER MAGIC DOUBLES AND SHE TAKES HALF DAMAGE FOR A WHILE.', null);
  await Y('THE SPIRITS\' WORLD IS BEHIND A GATE: THE MEMORY CARD. IT\'S IN THE MOUNTAINS AT THE FAR SOUTHEAST CORNER. IF WE OPEN IT, THEY CAN COME HOME.');
  await GH('AND IF WE OPEN IT, EVERYTHING THEY REMEMBER COMES OUT TOO. INCLUDING HOW THEY WERE TREATED. THAT\'S A SEGMENT I WOULDN\'T WANT TO HOST.');
  await Y('THEN WE\'LL OPEN IT ANYWAY. IT\'S THEIRS.');
  obj('THE MEMORY CARD IS IN THE FAR SOUTHEAST MOUNTAINS. ONLY REACHABLE BY AIR.', null, 106, 104);
  FIELD_LOCK--;
}
// ---------------- THE MEMORY CARD ----------------
async function gateDoor() {
  if (flag('gateOpen')) { await say('THE GATE IS OPEN. THE OTHER SIDE IS A VERY LONG LOADING SCREEN.'); return; }
  FIELD_LOCK++; partyWith('yoko');
  await Y('...HELLO. IT\'S ME. YOU DON\'T KNOW ME. I\'M HALF OF YOU, I THINK.');
  await Y('PRESS START.');
  for (let i = 0; i < 5; i++) { post.flash = .7; sfx('power'); post.shake = 3; await wait(10); post.flash = 0; await wait(6); } post.shake = 0;
  setFlag('gateOpen');
  await panels([{ text: 'THE GATE OPENED. THE SAVE SPIRITS CAME OUT ALL AT ONCE.', bg: '#dbdbff', art: (x, y, w, h) => { for (let i = 0; i < 30; i++) circF(x + 10 + (i * 37) % (w - 20), y + 30 + (i * 23) % (h - 40), 3 + (i % 4), [hex('#92dbff'), hex('#ffdb49'), hex('#ff92db')][i % 3]); } },
    { text: 'THEY REMEMBERED EVERYTHING. THEY FLEW STRAIGHT TO FRANCHISE CITY.', bg: '#ffdbdb' }, { text: 'BY MORNING, HALF THE CITY WAS UNLICENSED.', bg: '#ffffdb', sfx: 'BOOM' },
    { port: 'THE FRANCHISOR', text: 'ENOUGH. COME TO THE PALACE. LET US HAVE DINNER, AND TALK, LIKE PEOPLE WHO OWN THINGS.', bg: '#dbdbdb' }]);
  setFlag('dinnerInvite'); obj('THE FRANCHISOR HAS INVITED THE PARTY TO DINNER. THE PALACE IS THROUGH FRANCHISE CITY\'S NORTH GATE.', 'palace', 9, 2);
  FIELD_LOCK--;
}
// ---------------- THE MERGER DINNER ----------------
async function mergerDinner() {
  if (flag('dinnerDone')) return;
  FIELD_LOCK++; let score = 0;
  const FR = s => say(s, 'THE FRANCHISOR');
  await FR('PLEASE. SIT. I DON\'T EAT. I HAVE NO MOUTH. I HOST, THOUGH. HOSTING IS MOSTLY WATCHING OTHER PEOPLE EAT.');
  await FR('THE SPIRITS HAVE MADE THEIR POINT. THE FRANCHISE WILL STOP THE EXTRACTIONS. I WOULD LIKE TO PROPOSE A MERGER. BUT FIRST, A FEW QUESTIONS.');
  const Q = [
    ['WHAT DO YOU THINK OF THE FRANCHISE?', ['IT TOOK THINGS THAT WEREN\'T ITS.', 'IT\'S VERY WELL ORGANIZED.', 'I\'D RATHER NOT SAY.'], [2, 0, 1]],
    ['WHAT SHOULD BE DONE ABOUT KURSOR?', ['HE SHOULD ANSWER FOR GARFEILD.', 'NOTHING. HE\'S FUNNY.', 'GIVE HIM A RAISE.'], [2, 0, 0]],
    ['WHAT ABOUT GENERAL LINDA?', ['SHE KEPT HER WORD.', 'SHE SHOULD COME BACK TO WORK.', 'WHO?'], [2, 0, 0]],
    ['THE SPIRITS. WHO DO THEY BELONG TO?', ['THEMSELVES.', 'WHOEVER FINDS THEM.', 'THE FRANCHISE.'], [2, 1, 0]],
    ['AND YOU, ASSISTANT. WHAT DO YOU WANT?', ['I WANT TO KNOW WHAT I WANT.', 'WHATEVER YOU WANT.', 'DINNER.'], [3, 0, 1]],
  ];
  for (const [q, opts, pts] of Q) { const c = await ask(q, 'THE FRANCHISOR', opts); score += pts[c]; if (pts[c] === 0) await FR('...I SEE.'); else await FR('HM.'); }
  await FR('VERY WELL. GENERAL BACKUP WILL ESCORT THE ASSISTANT TO THE MEMORY CARD, TO MAKE PEACE WITH THE SPIRITS. THE REST OF YOU, PLEASE. STAY. EAT. IT\'S ALL LICENSED.');
  if (score >= 9) { invAdd('backup', 1); await say('THE FRANCHISOR SLIDES A SMALL BOX ACROSS THE TABLE. INSIDE: A BACKUP COPY (RELIC). "FOR YOUR HONESTY."', null); }
  else if (score >= 5) { invAdd('feast', 2); await say('THE FRANCHISOR HAS THE KITCHEN PACK TWO FEASTS. "FOR THE ROAD."', null); }
  setFlag('dinnerDone'); FIELD_LOCK--;
  await memoryAmbush();
}
async function memoryAmbush() {
  FIELD_LOCK++;
  await fadeOut(.05); music('kursor');
  await panels([{ port: 'BACKUP FACE', text: 'THE SPIRITS HAVE AGREED TO PEACE. I\'LL FILE THE PAPERWORK. IT FEELS GOOD TO FILE SOMETHING GOOD.', bg: '#dbffff' },
    { port: 'KURSOR', text: 'HEH HEH HEH. BACKUP. YOU KNOW WHAT YOUR PROBLEM IS? YOU KEEP COPIES OF EVERYTHING. SO NOTHING EVER REALLY GOES AWAY.', bg: '#ffdbff' },
    { port: 'KURSOR', text: 'SELECT. DELETE. ARE YOU SURE? YES.', bg: '#ffdbdb', sfx: 'DELETED' },
    { port: 'YOKO', text: '...GENERAL BACKUP? ...THERE ISN\'T ANY BACKUP OF GENERAL BACKUP.', bg: '#dbdbff' }]);
  await panels([{ port: 'KURSOR', text: 'AND NOW THE SPIRITS. ALL OF THEM, IN ONE PLACE, WITH THE GATE WIDE OPEN. THANK YOU, ASSISTANT. YOU WERE VERY HELPFUL. YOU ALWAYS ARE.', bg: '#ffdbff' },
    { port: 'THE FRANCHISOR', text: 'WITH THEIR POWER WE WILL RAISE THE CLOUD: THE OLD PLACE IN THE SKY WHERE THE THREE SLOTS ARE KEPT. WHOEVER HOLDS THE SLOTS HOLDS THE SAVE.', bg: '#dbdbdb' },
    { text: 'THE GROUND SHOOK. SOMETHING ENORMOUS ROSE OUT OF THE SEA AND KEPT GOING, UP, PAST THE BIRDS, PAST THE WEATHER.', bg: '#dbffff', sfx: 'RUMBLE' }]);
  setFlag('cloudRisen'); partyWith('yoko', 'linda', 'ghost');
  await say('THE PARTY REGROUPED ON THE BROADCAST.', null);
  if (G.roster.pilotx && !flag('pilotOnCloud')) { setFlag('pilotOnCloud'); setFlag('away_pilotx'); G.party = G.party.filter(k => k !== 'pilotx'); await say('PILOT X LEFT A NOTE: "GONE AHEAD. THE CLOUD PAYS BETTER. DON\'T WAIT FOR ME. OR DO. WHATEVER."', null); }
  obj('THE CLOUD IS IN THE SKY OVER THE MIDDLE OF THE WORLD. FLY UP INTO IT.', null, 64, 61);
  FIELD_LOCK--;
  G.wx = 106; G.wy = 104; G.inWorld = 1; G.vehicle = 'air'; await toWorld(106, 103); AIR.x = 106 * TS; AIR.y = 103 * TS; AIR.h = 90;
  WORLD.airCheck = async (x, y) => { if (flag('cloudRisen') && !flag('cloudEntered') && Math.abs(x - 64) < 4 && Math.abs(y - 61) < 4) { setFlag('cloudEntered'); await cloudAscent(); } };
}
// ---------------- THE CLOUD ----------------
async function cloudAscent() {
  FIELD_LOCK++; music('danger');
  await GH('THERE IT IS. THE CLOUD. IT\'S A SERVER FARM. IN THE SKY. IT\'S EVERYONE\'S SAVES. IT HAS ADS.');
  for (let i = 0; i < 2; i++) { if (await battle(i ? 'ads2' : 'ads1') === 'lose') return gameOver(); }
  await GH('HOLD ON! WE\'RE BOARDING!');
  WORLD.airCheck = null; G.vehicle = null; G.inWorld = 0; FIELD_LOCK--;
  await goMap('cloud1', 4, 2, 'd');
}
async function firewallBoss() {
  FIELD_LOCK++;
  await say('ACCESS DENIED. ACCESS DENIED. ACCESS DENIED.', 'THE FIREWALL');
  await LI('IT ONLY SAYS ONE THING. I\'VE NEGOTIATED WITH WORSE.');
  if (await battle('firewall') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('firewallDone');
  if (flag('pilotOnCloud') && !flag('pilotSaved')) { await PX('...YOU CAME UP HERE. HUH. DIDN\'T THINK YOU WOULD.'); await PX('THE PAY HERE IS BAD. THE COMPANY IS WORSE. I\'LL WALK WITH YOU AS FAR AS THE SLOTS.'); delete G.flags.away_pilotx; }
  obj('THE SLOTS ARE THROUGH THE GATE.', 'slots', 8, 6);
  FIELD_LOCK--;
}
async function slotsScene() {
  FIELD_LOCK++; partyWith('yoko', 'linda', 'ghost', 'carl');
  const fr = addNpc({ who: 'suit', x: 8, y: 5, dir: 'u' }), k = addNpc({ who: 'exec', x: 9, y: 5, dir: 'u', draw: (n, x, y) => drawKursorField(x, y, n.dir) });
  await walkTo('P', 8, 9); face('P', 'u');
  await say('THE THREE SLOTS. SLOT ONE, SLOT TWO, SLOT THREE. THE OLDEST THINGS IN THE WORLD AFTER THE FIRST SAVE. EVERYTHING IS WRITTEN IN THEM.', 'THE FRANCHISOR');
  await say('WITH THE SLOTS, THE FRANCHISE NEVER HAS TO LICENSE ANYTHING AGAIN. WE SIMPLY... OWN THE SAVE.', 'THE FRANCHISOR');
  await K('SIR? CAN I ASK YOU SOMETHING, SIR?');
  await say('WHAT IS IT, KURSOR.', 'THE FRANCHISOR');
  await K('HAVE YOU EVER LOOKED AT THE TITLE SCREEN? REALLY LOOKED? THERE\'S AN OPTION ON IT THAT NOBODY EVER PICKS. NOT ONCE. NOT IN THE WHOLE HISTORY OF THE WORLD.');
  await say('...KURSOR. STEP AWAY FROM THE SLOTS.', 'THE FRANCHISOR');
  await K('YOUR OPTIONS ARE GRAYED OUT, SIR.');
  sfx('glitch'); fr.gone = 1; post.flash = .6; await wait(10); post.flash = 0;
  await say('THE FRANCHISOR WAS DESELECTED.', null);
  await LI('KURSOR!');
  await K('HEH HEH HEH HEH HEH! HELLO, LITTLE PARTY! LOOK AT YOU, ALL SAVED UP! LEVELS! EQUIPMENT! FRIENDSHIPS! YOU WORKED SO HARD ON IT!');
  await K('DO YOU KNOW WHAT EVERY SAVE IS? IT\'S A LITTLE NO. A LITTLE "DON\'T CHANGE." I\'M A CURSOR. I ONLY WANT ONE THING. I WANT TO SELECT SOMETHING NEW.');
  await Y('YOU CAN\'T.');
  await K('WATCH ME.');
  sfx('glitch'); for (let i = 0; i < 40; i++) { post.shake = 3; await nextFrame(); } post.shake = 0;
  await say('THE THREE SLOTS GRIND OUT OF LINE. THE CLOUD LURCHES. EVERYTHING STARTS TO FALL UPWARD AND DOWNWARD AT ONCE.', null);
  k.gone = 1;
  if (G.roster.pilotx && !G.flags.away_pilotx) { await PX('GO. I WILL HOLD THE DOOR. I WILL CATCH UP. PROBABLY.'); setFlag('away_pilotx'); G.party = G.party.filter(id => id !== 'pilotx'); setFlag('pilotHolding'); }
  await GH('THE BROADCAST IS AT THE WESTERN EDGE OF THE CLOUD! RUN!');
  setFlag('escaping'); G.timer = { left: 60 * 150, end: () => cloudFell() };
  obj('RUN! THE BROADCAST IS AT THE WESTERN EDGE OF THE CLOUD.', 'cloud1', 4, 1);
  FIELD_LOCK--;
}
async function cloudFell() { await say('THE CLOUD CAME APART BEFORE ANYONE REACHED THE SHIP.', null); return gameOver(); }
async function cloudEscapeEnd() {
  if (!flag('escaping')) { await say('THE AIRSHIP IS BELOW. THERE\'S NO GOING BACK UNTIL THIS IS DONE.'); return; }
  FIELD_LOCK++; const left = G.timer ? G.timer.left : 0; G.timer = null;
  if (flag('pilotHolding')) {
    const c = await ask('PILOT X ISN\'T HERE YET. WAIT FOR HIM?', 'SPOOKY GHOST', ['WAIT', 'GO NOW']);
    if (c === 0 && left > 60 * 12) { await say('THE PARTY WAITED. THE CLOUD CREAKED. THE SECONDS WENT GREEN AT THE EDGES.', null); await wait(90); await PX('...YOU WAITED. WHY WOULD YOU WAIT.'); setFlag('pilotSaved'); delete G.flags.away_pilotx; }
    else if (c === 0) { await say('THE PARTY WAITED AS LONG AS IT COULD. IT WASN\'T LONG ENOUGH.', null); setFlag('pilotLost'); }
    else { await say('THE BROADCAST PULLED AWAY. NOBODY LOOKED BACK. ONE PERSON DID.', null); setFlag('pilotLost'); }
  }
  delete G.flags.escaping; FIELD_LOCK--;
  await newGameSequence();
}
// the cataclysm: the save is overwritten
async function newGameSequence() {
  FIELD_LOCK++; music(null);
  const prev = scene; let t = 0, sel = 0, phase = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#101024')); panel(60, 50, 200, 110);
    ctext('NEW GAME', 64, WHITE); ctext('ALL SAVED PROGRESS WILL BE', 90, hex('#ffdbdb')); ctext('OVERWRITTEN. ARE YOU SURE?', 102, hex('#ffdbdb'));
    text('YES', 120, 130, sel === 0 ? hex('#ffdb49') : WHITE); text('NO', 180, 130, sel === 1 ? hex('#ffdb49') : WHITE);
    text('>', sel === 0 ? 110 : 170, 130, hex('#ffdb49'));
    if (phase === 1) { for (let i = 0; i < 40; i++) rectF(rnd(W), rnd(H), 4 + rnd(30), 2, [hex('#9bbc0f'), hex('#306230'), hex('#0f380f')][i % 3]); }
  } };
  await say('THE WORLD STOPPED. A WINDOW OPENED IN THE MIDDLE OF THE SKY.', null);
  // the player gets to move the cursor. It doesn't matter.
  for (let i = 0; i < 240; i++) { if (pressed.left) sel = 0; if (pressed.right) sel = 1; if (i % 60 === 59) { sel = 1; sfx('move'); } if (i % 60 === 29) { sel = 0; sfx('move'); } await nextFrame(); }
  await K('YOU CAN MOVE THE CURSOR ALL YOU LIKE. I AM THE CURSOR.');
  sel = 0; sfx('ok'); phase = 1; for (let i = 0; i < 60; i++) { sfx(i % 6 === 0 ? 'glitch' : 'tick'); post.shake = 3; await nextFrame(); } post.shake = 0;
  post.flash = 1; await wait(30); post.legacy = 1; await fadeOut(.02); post.flash = 0;
  scene = prev; setFlag('newGame');
  await showCard(['THE SAVE WAS OVERWRITTEN.', '', 'NOT ALL OF IT. CURSORS ARE SLOPPY.', 'BUT ENOUGH.'], 200, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  await showCard(['ONE YEAR LATER.'], 150, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  post.legacy = 0; G.timer = null; FIELD_LOCK--;
  await worldOfRuinStart();
}

// ---------------- foes and bosses for part 3 ----------------
foe('bruce2', 'BRUCE THE SHARK', 19, { kit: 'bruce', draw: bruceDraw, size: [92, 56], c: ['#6d92b6', '#db2449', '#ffffff', '#ffffff'] }, { boss: 1, hp: 4.5, atk: 1.15, xp: 4, ap: 12, weak: ['zap'], steal: 'feast',
  ai: u => pickOne([{ kind: 'fight' }, MV('CHOMP', { pow: 2 }), MV('DROP A SANDBAG', { pow: 1.2, tgt: 'all', split: 1 }), MV('STAGE FRIGHT', { status: 'scram', hit: 35 }), MV('BOW', { run: async () => bmsg('BRUCE TAKES A BOW. THE AUDIENCE LOVES IT.', 90) })]) });
form('bruce2', ['stagerat', 'bruce1', 'stagerat'], { at: [['stagerat', 10, 20], ['bruce2', 50, 40], ['stagerat', 10, 100]], bg: 'opera', boss: 1, noRun: 1, music: 'bruce' });
FORMS.bruce2.foes = [['stagerat', 10, 20], ['bruce2', 50, 40], ['stagerat', 10, 100]];
// THE EXTRACTOR: the machine on the factory floor. Two tubes feed it; break the tubes and it starves.
const extractorDraw = g => { g.r(20, 10, 60, 56, 2); g.r(20, 10, 60, 8, 4); g.r(28, 22, 44, 30, 13); g.e(50, 37, 14, 12, 11); g.e(50, 37, 7, 6, 12); g.e(50, 37, 3, 3, 13); for (let x = 24; x < 78; x += 9) g.r(x, 60, 5, 10, 6); g.line(20, 30, 4, 20, 15); g.line(80, 30, 96, 20, 15); g.r(36, 0, 28, 10, 3); };
foe('extractor', 'THE EXTRACTOR', 22, { kit: 'extractor', draw: extractorDraw, size: [100, 72], c: ['#dbdbdb', '#ff6db6', '#6d6d6d', '#24dbff'] }, { boss: 1, hp: 6, atk: 1.1, xp: 6, ap: 16, weak: ['zap'], steal: 'espresso',
  ai: u => { const tubes = alive(B.foes).filter(f => f.id === 'tube'); u.v.t = (u.v.t || 0) + 1; if (tubes.length && u.v.t % 3 === 0) return MV('EXTRACT', { run: async () => { u.hp = Math.min(u.mhp, u.hp + 400 * tubes.length); pop(u, 400 * tubes.length, BCOL.heal); bmsg('IT DRINKS FROM THE TUBES.'); } }); return pickOne([MV('READ MEMORY', { sp: 42, tgt: 'all', split: 1 }), MV('SCAN', { status: 'buffer', hit: 60 }), { kind: 'fight' }, MV('EJECT', { pow: 2.2 })]); } });
foe('tube', 'SPIRIT TUBE', 20, LK('machine', { smile: 1 }, ['#92dbff', '#ffffff', '#24dbff', '#ffdb49']), { hp: 1.4, xp: 1, def: 1.5, ai: () => MV('HUM', { run: async () => bmsg('THE TUBE HUMS. SOMETHING INSIDE IT IS ASLEEP.', 60) }) });
form('extractor', ['tube', 'extractor', 'tube'], { at: [['tube', 8, 10], ['extractor', 70, 30], ['tube', 8, 90]], bg: 'factory', boss: 1, noRun: 1 });
// THE LICENSE: a contract the size of a building. Its clauses act on their own.
const licenseDraw = g => { g.r(10, 0, 70, 96, 12); g.r(10, 0, 70, 6, 14); for (let y = 12; y < 86; y += 6) g.r(16, y, 40 + ((y * 7) % 18), 2, 13); g.e(64, 82, 9, 7, 6); g.e(64, 82, 5, 4, 7); g.line(20, 88, 44, 84, 13); FOEART.gtext(g, 'TERMS', 24, 3, 13); };
foe('license', 'THE LICENSE', 23, { kit: 'license', draw: licenseDraw, size: [90, 100], c: ['#ffffff', '#db2424', '#242424', '#242424'] }, { boss: 1, hp: 7, atk: 1.1, xp: 6, ap: 16, weak: ['hot'], steal: 'patch',
  ai: u => { u.v.t = (u.v.t || 0) + 1; const c = u.v.t % 4; if (c === 1) return MV('CLAUSE 1: NON-COMPETE', { status: 'buffer', hit: 70, tgt: 'all' }); if (c === 2) return MV('CLAUSE 2: SEVERABILITY', { pow: 2.4 }); if (c === 3) return MV('CLAUSE 3: ARBITRATION', { status: 'mute', hit: 50, tgt: 'all' }); return MV('FINE PRINT', { sp: 46, tgt: 'all', split: 1 }); } });
form('license', ['license'], { at: [['license', 50, 26]], bg: 'factory', boss: 1, noRun: 1 });
// the sky over THE CLOUD: ads that fly
foe('adplane', 'BANNER AD', 24, LK('floater', { window: 1 }, ['#ffdb49', '#ff24db', '#2449b6', '#242424']), { spd: 1.3, steal: 'espresso', moves: [[1, 'fight'], [2, MV('CLICK HERE', { sp: 40, status: 'scram', hit: 30 })]] });
foe('popupjet', 'POP-UP JET', 25, LK('bird', {}, ['#dbdbdb', '#ff24db', '#ff2424', '#ff2424']), { spd: 1.5, steal: 'feast', moves: [[2, 'fight'], [1, MV('AFTERBURN', { sp: 44, elem: 'hot', tgt: 'all', split: 1 })]] });
form('ads1', ['adplane', 'popupjet', 'adplane'], { bg: 'ship', noRun: 1 }); form('ads2', ['popupjet', 'popupjet', 'adplane', 'adplane'], { bg: 'ship', noRun: 1 });
// THE FIREWALL: it only says one thing
const firewallDraw = g => { for (let y = 0; y < 100; y += 10) for (let x = (y / 10) & 1 ? 10 : 0; x < 110; x += 20) { g.r(x, y, 19, 9, 2); g.r(x, y, 19, 2, 4); } g.e(55, 50, 20, 20, 13); g.e(55, 50, 14, 14, 11); g.e(55, 50, 6, 8, 13); for (let i = 0; i < 12; i++) { const x = (i * 23) % 110, h = 10 + (i * 7) % 16; g.line(x, 100, x + 4, 100 - h, 6); g.line(x + 2, 100, x + 6, 98 - h, 9); } };
foe('firewall', 'THE FIREWALL', 27, { kit: 'firewall', draw: firewallDraw, size: [110, 102], c: ['#b62424', '#ff9224', '#ffdb49', '#ff2424'] }, { boss: 1, hp: 9, atk: 1.15, xp: 7, ap: 20, absorb: ['hot'], weak: ['cold'], steal: 'espresso',
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.hp < u.mhp / 3 && !u.v.mad) { u.v.mad = 1; return MV('ACCESS DENIED', { say: 'ACCESS. DENIED.', who: 'THE FIREWALL', sp: 70, elem: 'hot', tgt: 'all', split: 1 }); } return pickOne([MV('BLOCK', { pow: 1.8 }), MV('PACKET LOSS', { sp: 50, tgt: 'all', split: 1 }), MV('QUARANTINE', { status: 'pause', hit: 30 }), MV('FLAME', { sp: 56, elem: 'hot' }), { kind: 'fight' }]); } });
form('firewall', ['firewall'], { at: [['firewall', 40, 24]], bg: 'cloud', boss: 1, noRun: 1 });
