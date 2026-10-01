'use strict';
// ================= SAVE THE WORLD: story, part 4 — THE CORRUPTED SAVE, THE TITLE SCREEN, the endings =================
const ALL_HEROES = ['yoko', 'carl', 'face', 'oldface', 'linda', 'ghost', 'garfield', 'kid', 'pilotx'];
function bringBack(id, lv) { const r = G.roster[id]; if (!r) return; delete G.flags['away_' + id]; if (lv && r.lv < lv) giveXP(r, totalXP(lv) - r.xp); r.hp = r.mhp; r.mp = r.mmp; r.status = {}; if (G.party.length < 4) G.party.push(id); }
// ---------------- one year later ----------------
async function worldOfRuinStart() {
  G.world = 2; WORLD.made = 0; WORLD.mini = null; G.vehicle = null; G.ship = null; G.inWorld = 0;
  for (const id of Object.keys(G.roster)) if (id !== 'linda') setFlag('away_' + id);
  G.party = ['linda']; const r = hero('linda'); r.hp = Math.max(1, Math.floor(r.mhp / 3));
  delete G.flags.pilotOnCloud;
  obj('...', 'island', 9, 6);
  await goMap('hut', 4, 3, 'd', { noFade: 1 }); post.fade = 1; await fadeIn(.02);
}
async function islandWake() {
  setFlag('islandWoke'); FIELD_LOCK++;
  await say('...ARE YOU AWAKE? YOU\'RE AWAKE. GOOD. YOU\'VE BEEN ASLEEP FOR A YEAR. I KEPT YOU. I KEEP THINGS.', 'CLERK');
  await LI('...WHERE AM I.');
  await say('LOST & FOUND ISLAND. IT\'S WHERE THINGS WASH UP WHEN THEY FALL OUT OF THE SAVE. YOU WASHED UP. I TAGGED YOU. YOU\'RE NUMBER 4,112.', 'CLERK');
  await say('THE WORLD WENT GREEN, GENERAL. THE CURSOR STARTED A NEW GAME AND THEN GOT BORED HALFWAY THROUGH LOADING IT. NOW EVERYTHING IS FOUR SHADES AND HALF-REMEMBERED.', 'CLERK');
  await LI('...THE OTHERS?');
  await say('DIDN\'T WASH UP HERE. DOESN\'T MEAN THEY\'RE LOST. LOST JUST MEANS NOBODY\'S FOUND THEM YET.', 'CLERK');
  await say('...I\'M NOT FEELING GREAT, GENERAL. I\'VE BEEN LOSING THINGS. MY GLASSES. MY SOCK. IF YOU FIND ANY OF MY THINGS ON THE BEACH, BRING THEM HERE. IT HELPS TO HAVE YOUR THINGS.', 'CLERK');
  await say('LINDA IS STILL IN COLOR. NOTHING ELSE IS.', null);
  obj('LOOK FOR THE CLERK\'S THINGS ON THE BEACH (THEY SPARKLE). BRING THEM BACK TO HIM.', 'island', LOST[0].x, LOST[0].y);
  FIELD_LOCK--;
}
async function clerkTalk() {
  const found = (G.found || []).filter(i => !(G.given || []).includes(i));
  if (flag('clerkWell')) { await say('I\'M FOUND. THANK YOU. THERE\'S A RAFT ON THE SOUTHEAST BEACH. GO FIND THE REST OF THEM. IT\'S WHAT YOU\'RE GOOD AT NOW.', 'CLERK'); return; }
  if (!found.length) { await say('ANYTHING ON THE BEACH? THINGS SPARKLE WHEN THEY WANT TO BE FOUND.', 'CLERK'); nextLostObj(); return; }
  const c = await choose(found.map(i => LOST[i].name).concat(['NOTHING YET']), { cancel: 1 });
  if (c < 0 || c >= found.length) return;
  const it = LOST[found[c]]; G.given = (G.given || []).concat([found[c]]);
  if (it.good) { G.flags.clerkGood = (G.flags.clerkGood || 0) + 1; await say('...THAT\'S MINE. THAT\'S REALLY MINE. I FEEL BETTER. I FEEL MORE TAGGED.', 'CLERK'); }
  else { G.flags.clerkBad = (G.flags.clerkBad || 0) + 1; await say('...I DON\'T THINK THAT\'S MINE. I\'LL KEEP IT ANYWAY. THAT\'S THE JOB.', 'CLERK'); }
  if (G.flags.clerkGood >= 3) {
    setFlag('clerkWell'); setFlag('raftReady');
    await say('I\'M FOUND. I\'M ACTUALLY FOUND. YOU KNOW WHAT I FOUND ON THE BEACH LAST WEEK? A CAP. BACKWARDS. IT HAD SAND IN IT. SOMEONE WEARS THAT.', 'CLERK');
    await LI('...CARL.');
    await say('I BUILT A RAFT. EVERYTHING WASHES UP HERE, INCLUDING RAFTS. IT\'S ON THE SOUTHEAST BEACH. GO.', 'CLERK');
    invAdd('megalife', 1); sfx('get'); await say('THE CLERK GAVE LINDA A CONTINUE+. "IT WAS ALWAYS UNCLAIMED."', null);
    obj('THE RAFT IS ON THE SOUTHEAST BEACH OF THE ISLAND.', 'island', 16, 13);
  } else if (G.flags.clerkBad >= 2) {
    setFlag('clerkLost'); setFlag('raftReady');
    await say('...I\'M SORRY, GENERAL. I THINK I\'M MISPLACED. IT HAPPENS TO CLERKS. WE TAG EVERYTHING BUT OURSELVES.', 'CLERK');
    await fadeOut(.03); await wait(60);
    await say('THE CLERK WAS GONE. ON THE BED WAS A TAG. IT SAID "CLERK. UNCLAIMED."', null);
    await LI('...I\'LL CLAIM IT.');
    await say('UNDER THE BED THERE WAS A RAFT, HALF-BUILT, AND A NOTE: "FINISH IT. THERE\'S A CAP ON THE BEACH. SOMEONE WEARS THAT."', null);
    await fadeIn(.03); obj('THE RAFT IS ON THE SOUTHEAST BEACH OF THE ISLAND.', 'island', 16, 13);
  } else nextLostObj();
}
function nextLostObj() { const i = LOST.findIndex((l, k) => !G.flags['lost' + k] && l.good); if (i >= 0) obj('LOOK FOR THE CLERK\'S THINGS ON THE BEACH (THEY SPARKLE).', 'island', LOST[i].x, LOST[i].y); else obj('BRING WHAT YOU FOUND TO THE CLERK.', 'hut', 5, 2); }
MAPS.island.onStep = (orig => async (x, y) => { const r = await orig(x, y); if (r) { if (!flag('raftReady')) { const g = (G.found || []).filter(i => LOST[i].good && !(G.given || []).includes(i)).length; if (g + (G.flags.clerkGood || 0) >= 3) obj('BRING THE THINGS BACK TO THE CLERK.', 'hut', 5, 2); else nextLostObj(); } } return r; })(MAPS.island.onStep);
async function islandRaft() {
  FIELD_LOCK++; await fadeOut(.05);
  await showCard(['LINDA RAFTED FOR THREE DAYS.', '', 'THE SEA WAS FOUR SHADES OF GREEN.', 'SHE WAS THE ONLY OTHER COLOR IN IT.'], 160, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  FIELD_LOCK--; await toWorld(22, 13);
  obj('THERE\'S A TOWN JUST NORTH. IT USED TO BE COLDBOOT.', null, 22, 12);
}
// ---------------- NEW FILE ----------------
async function oldFaceHouse() {
  FIELD_LOCK++;
  await OF('...LINDA. YOU\'RE IN COLOR.');
  await LI('YOU\'RE NOT. YOU NEVER WERE.');
  await OF('NO. THE NEW GAME DIDN\'T CHANGE ME AT ALL. I WAS ALREADY THIS. IT\'S RESTFUL.');
  await OF('THE INN WAS GOING TO FALL ON THE NEW FILES. I\'VE BEEN HOLDING IT UP. A WEEK, MAYBE. HARD TO TELL. THE DAYS ARE THE SAME COLOR.');
  await LI('...CAN YOU LET GO?');
  await OF('IF SOMEONE WELDS THE BEAM. ...THERE. I WELDED IT WITH MY FOOT. I\'M COMING WITH YOU.');
  setFlag('oldfaceBack'); bringBack('oldface', 26); sfx('get'); await say('OLD FACE REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
async function cacheBoss() {
  FIELD_LOCK++;
  await C('...STAY BACK. IT\'S BIG. IT\'S EVERYTHING EVERYBODY IN TOWN FORGOT, ALL IN ONE PLACE. I\'M TRYING TO GET IT BACK OUT.');
  await LI('CARL.');
  await C('...LINDA? YOU\'RE... YOU\'RE IN COLOR. YOU\'RE NOT A NEW FILE. YOU\'RE AN OLD FILE. YOU\'RE THE BEST FILE.');
  bringBack('carl', 26);
  if (await battle('cache') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('carlBack');
  await C('THE NAMES. THEY\'RE COMING BACK OUT. LISTEN.');
  await say('FROM UPSTAIRS, FAINTLY, SOMEONE SAYS: "WAIT. MY NAME IS GRETA." SOMEONE ELSE SAYS: "I\'M PAUL. I\'M PAUL!"', null);
  await C('I DIDN\'T FIND MINE. THAT\'S OKAY. I FIGURED IF I FOUND EVERYONE ELSE\'S, MINE WOULD TURN UP. THAT\'S HOW LOST AND FOUND WORKS.');
  await C('...OKAY, THAT\'S NOT HOW IT WORKS. BUT IT FELT LIKE IT SHOULD.');
  sfx('get'); await say('CARL REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
// what to do next in the corrupted save (the TALK hint walks through it)
function nextReunionObj() {
  if (!flag('oldfaceBack')) return obj('THERE\'S A GREEN MAN HOLDING UP THE INN IN NEW FILE.', 'nfhouse', 5, 2);
  if (!flag('carlBack')) return obj('CARL WENT DOWN INTO THE OLD ARCHIVIST\'S CELLAR.', 'nfcellar', 27, 7);
  if (!flag('ghostBack')) return obj('NEW FILES SAY THE GHOST WAS BURIED IN A GRAVEYARD IN THE WESTERN FOREST, SOUTH OF THE CAVE. HE\'D HAVE A SHIP.', null, 30, 52);
  if (!flag('towerOpen')) return obj('THE TITLE SCREEN IS IN THE CRATER IN THE MIDDLE OF THE WORLD.', null, 64, 61);
  const L = [['yokoBack', 'YOKO WAS SEEN IN A VILLAGE FULL OF YOKOIDS, WHERE GARFEILD USED TO BE.', 98, 55], ['faceBack', 'FACE CASTLE IS STUCK UNDERGROUND IN THE DESERT.', 46, 33], ['garfieldBack', 'GARFIELD IS ASLEEP ON A BENCH AT THE OLD STATION. HE WON\'T WAKE UP.', 82, 64], ['kidBack', 'THE KID MIGHT STILL BE AT THE BUS STOP ON THE PLAINS.', 86, 79], ['pilotBack', 'IF PILOT X MADE IT, HE\'D BE AT THE PORT BAR.', 50, 87]];
  for (const [f, t, x, y] of L) if (!flag(f) && (f !== 'pilotBack' || flag('pilotSaved'))) return obj(t + ' (OR GO STRAIGHT TO THE TITLE SCREEN IN THE CRATER.)', null, x, y);
  obj('THE TITLE SCREEN IS IN THE CRATER IN THE MIDDLE OF THE WORLD.', null, 64, 61);
}
// ---------------- the graveyard: THE RERUN ----------------
async function ratingsBoss() {
  FIELD_LOCK++;
  await say('THE CRYPT IS FULL OF CANCELED SHOWS. AT THE BACK, SITTING ON A COFFIN LIKE IT\'S A COUCH, IS SPOOKY GHOST.', null);
  await GH('OH. VIEWERS. I DIDN\'T THINK ANYONE WAS STILL WATCHING.');
  await GH('THE BROADCAST WENT DOWN WITH THE CLOUD. I CAME HERE TO GET MY OLD SHIP. THE RERUN. THE ONE I HAD BEFORE I HAD AN AUDIENCE.');
  await GH('BUT THE RATINGS ARE GUARDING IT. THE RATINGS ARE ALWAYS GUARDING SOMETHING.');
  bringBack('ghost', 28);
  if (await battle('ratings') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('ghostBack'); setFlag('rerunShip'); setFlag('towerOpen');
  await GH('THE RERUN IS OURS. SHE\'S OLD. SHE ONLY FLIES IN REPEATS. SHE\'LL DO.');
  await GH('AND I CAN SEE IT FROM HERE: THE TITLE SCREEN. KURSOR BUILT A TOWER OUT OF EVERY MENU HE EVER HIGHLIGHTED. IT\'S IN THE CRATER WHERE THE MIDDLE OF THE WORLD USED TO BE.');
  sfx('get'); await say('SPOOKY GHOST REJOINED THE PARTY. YOU HAVE AN AIRSHIP AGAIN: THE RERUN.', null);
  G.ship = { x: 31, y: 53 };
  nextReunionObj(); FIELD_LOCK--;
}
// ---------------- the optional reunions ----------------
async function faceUnder() {
  FIELD_LOCK++;
  await F('...OH THANK GOODNESS. VISITORS. THE CASTLE GOT STUCK. IT WENT DOWN DURING THE NEW GAME AND NEVER CAME BACK UP. IT\'S SHY. I BUILT IT SHY.');
  await F('THE ENGINE ROOM IS FULL OF CABLES THAT HAVE STARTED THINKING FOR THEMSELVES. THEY THINK WE SHOULD STAY DOWN HERE. WHERE IT\'S SAFE.');
  bringBack('face', 28);
  if (await battle('cables') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('faceBack');
  await F('...AND UP SHE GOES. THERE. NOW I CAN BE OF USE. A KING SHOULD BE OF USE. I DIDN\'T KNOW THAT BEFORE. I THOUGHT A KING SHOULD BE IMPRESSIVE.');
  sfx('get'); await say('FACE REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
async function yokoVillage() {
  FIELD_LOCK++;
  await Y('...LINDA. YOU CAME. EVERYONE ALWAYS COMES TO ASK ME FOR SOMETHING.');
  await LI('I CAME TO SEE IF YOU WERE ALL RIGHT.');
  await Y('THESE ARE YOKOIDS. THEY WERE BUILT TO HELP. WHEN THE SAVE WAS OVERWRITTEN, NOBODY CAME TO TELL THEM WHAT TO DO. SO THEY CAME TO ME. I DON\'T TELL THEM WHAT TO DO EITHER.');
  await Y('I CAN\'T FIGHT ANYMORE, LINDA. I DON\'T KNOW WHY I WOULD. EVERY TIME I TRY, I HEAR "OF COURSE."');
  sfx('door'); post.shake = 3; await wait(20); post.shake = 0;
  await say('MERCHANDISE! UNPAID MERCHANDISE! I\'M HERE FOR THE YOKOIDS!', 'THE REPO MAN');
  if (await battle('repo1') === 'lose') return gameOver(); await fadeIn(.1);
  await say('I\'LL BE BACK. I\'M ALWAYS BACK. IT\'S IN THE CONTRACT.', 'THE REPO MAN');
  await Y('...HE\'LL COME BACK. WHEN HE DOES, I\'LL... I DON\'T KNOW.');
  await wait(30);
  await say('THE REPO MAN CAME BACK BEFORE ANYONE HAD SAT DOWN.', null);
  bringBack('yoko', 28); partyWith('yoko', 'linda');
  await Y('...NO. NOT THEM. YOU CAN\'T HAVE THEM. I DON\'T NEED A REASON. I WANT THEM TO STAY.');
  await Y('THAT\'S IT. THAT\'S WHAT I WANT. I WANT THEM TO STAY.');
  if (await battle('repo2') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('yokoBack');
  await Y('I\'LL COME WITH YOU. NOT BECAUSE YOU ASKED. BECAUSE I WANT THE WORLD TO STAY TOO.');
  await say('THE YOKOIDS WAVE. ONE OF THEM SAYS "MAY I... SEE YOU AGAIN?"', null);
  sfx('get'); await say('YOKO REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
async function garfieldBench() {
  FIELD_LOCK++;
  await say('JB GARFIELD IS ASLEEP ON A BENCH AT THE STATION. HE\'S TALKING IN HIS SLEEP.', null);
  await JB('...THREE SUSPECTS. ONE OF THEM DID IT. ONE OF THEM ALWAYS DID IT.');
  await LI('...WE\'RE GOING IN.');
  FIELD_LOCK--; await goMap('coldcase', 5, 2, 'd');
}
async function suspectsBoss() {
  FIELD_LOCK++;
  await say('THREE FIGURES SIT IN THE DINING CAR OF A TRAIN THAT DOESN\'T GO ANYWHERE. EACH ONE HAS A NAME TAG: SUSPECT.', null);
  await JB('YOU\'RE IN MY DREAM. GET OUT. THIS IS MY CASE. THIRTY YEARS. EVERYONE IN GARFEILD FORGOT ME AND I STILL HAVEN\'T CLOSED IT.');
  await LI('WHAT IS THE CASE, GARFIELD?');
  await JB('...WHO TOOK THE TOWN\'S MEMORY OF ME. I KNOW WHO. HE\'S A CURSOR. BUT I NEED IT TO BE ONE OF THESE THREE. I NEED IT TO BE SOMEONE I CAN ARREST.');
  bringBack('garfield', 28);
  if (await battle('suspects') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('garfieldBack');
  await JB('...IT WASN\'T ANY OF THEM. IT WAS NEVER GOING TO BE ANY OF THEM. THAT\'S THE CASE. THAT\'S THE WHOLE CASE.');
  await JB('CASE CLOSED. I\'M COMING WITH YOU. LET\'S GO ARREST A CURSOR.');
  sfx('get'); await say('JB GARFIELD REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
  await toWorld(82, 64);
}
async function kidStillWaiting() {
  FIELD_LOCK++;
  await KD('...ARE YOU MY RIDE?');
  await LI('...YOU\'RE STILL HERE. THE WHOLE WORLD ENDED AND YOU WAITED AT THE BUS STOP.');
  await KD('THEY SAID WAIT HERE. I DON\'T KNOW WHAT ELSE TO DO WHEN SOMEONE SAYS WAIT HERE.');
  await KD('EVERYTHING WENT GREEN. THAT WAS FUNNY. I\'VE SEEN EVERYTHING GO GREEN BEFORE. IT HAPPENS WHEN I LET GO. I DIDN\'T LET GO THIS TIME. I HELD IT THE WHOLE TIME.');
  await LI('...WE\'RE YOUR RIDE. I DECIDED. NOBODY HAS TO TELL YOU ANYMORE.');
  await KD('...OKAY. CAN WE STOP AT A BATHROOM.');
  setFlag('kidBack'); bringBack('kid', 28); sfx('get'); await say('PEE KID REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
async function pilotBar() {
  FIELD_LOCK++;
  await PX('...YOU WAITED FOR ME. ON THE CLOUD. NOBODY WAITS FOR ME. I MADE SURE OF IT.');
  await PX('I\'M NOT GOING TO SAY THANK YOU. I\'M GOING TO COME WITH YOU. IT\'S THE SAME THING BUT YOU DON\'T HAVE TO LOOK AT ME.');
  setFlag('pilotBack'); bringBack('pilotx', 28); sfx('get'); await say('PILOT X REJOINED THE PARTY.', null);
  nextReunionObj(); FIELD_LOCK--;
}
async function humanFound() {
  FIELD_LOCK++;
  await say('THE ROOM IS FULL OF CHAIRS AROUND A LONG TABLE. AT THE HEAD OF IT, A MAN WITH A SQUARE JAW IS READING FROM A CLIPBOARD.', null);
  await say('WELCOME TO THE FOCUS GROUP. ON A SCALE OF ONE TO TEN, HOW RELATABLE AM I?', 'HU-MAN');
  await C('...WHO ARE YOU?');
  await say('I\'M HU-MAN. I\'M WHAT YOU GET WHEN YOU ASK EVERYONE WHAT THEY WANT AND AVERAGE IT. I\'M VERY NORMAL. I DO WHAT WORKED LAST TIME.', 'HU-MAN');
  await say('YOU\'VE BEEN SAVING THE WORLD? THAT TESTED VERY WELL. I\'LL DO THAT TOO. I\'LL DO EXACTLY WHAT YOU DO.', 'HU-MAN');
  if (await battle('focus') === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('humanJoined'); addHero('human', 30, { w: 'rod4', a: 'armor5', h: 'helm4' }); if (G.party.length > 4) G.party.length = 4;
  sfx('get'); await say('HU-MAN JOINED THE PARTY. (HIS COMMAND IS MIMIC: HE REPEATS WHATEVER YOUR PARTY DID LAST.)', null);
  FIELD_LOCK--;
}
// ---------------- THE TITLE SCREEN ----------------
async function towerEnter(n) {
  if (flag('tower' + n + 'Done')) return;
  const N = ['', 'NEW GAME', 'CONTINUE', 'OPTIONS'][n];
  obj('THE TOP OF THIS FLOOR.', 'tower' + n, ...({ 1: [10, 1], 2: [9, 8], 3: [10, 9] })[n]);
  if (!flag('towerTalk' + n)) {
    setFlag('towerTalk' + n); FIELD_LOCK++;
    if (n === 1) { await GH('THE TITLE SCREEN. HE BUILT IT OUT OF THREE MENUS. NEW GAME, CONTINUE, OPTIONS. WE CLIMB EACH ONE.'); await LI('PICK A TEAM FOR EACH FLOOR. WE\'LL NEED EVERYONE AT THE TOP.'); }
    if (n === 2) await say('CONTINUE. THE FLOOR IS A MAZE OF EVERY SAVE THAT WAS EVER LOADED. SOME OF THEM ARE STILL PLAYING.', null);
    if (n === 3) await say('OPTIONS. THE WALLS ARE SLIDERS. SOMEONE SET THE DIFFICULTY TO HARD AND LEFT.', null);
    FIELD_LOCK--;
  }
}
async function towerBoss(n) {
  if (flag('tower' + n + 'Done')) return;
  FIELD_LOCK++;
  const B3 = { 1: ['THE INTRO', 'YOU CAN\'T SKIP ME. NOBODY CAN SKIP ME. I\'M UNSKIPPABLE.', 'intro'], 2: ['THE LOADING SCREEN', 'PLEASE WAIT. PLEASE WAIT. PLEASE WAIT. THIS WILL ONLY TAKE A MOMENT. IT HAS BEEN A MOMENT FOR A YEAR.', 'loadscr'], 3: ['THE OPTIONS MENU', 'WHAT WOULD YOU LIKE TO CHANGE? NOTHING? THEN WHY ARE YOU HERE?', 'optmenu'] }[n];
  await say(B3[1], B3[0]);
  if (await battle(B3[2]) === 'lose') return gameOver(); await fadeIn(.1);
  setFlag('tower' + n + 'Done');
  if (n < 3) { await say('A DOOR OPENS ON THE NEXT MENU UP.', null); FIELD_LOCK--; await towerPick(n + 1); return; }
  await say('THE OPTIONS MENU CLOSES. ABOVE IT, A WINDOW THAT ISN\'T A WINDOW: THE TITLE. THE CURSOR IS UP THERE, BLINKING.', null);
  FIELD_LOCK--; await towerPick(4);
}
// choose who goes up next: up to four, from everyone you have back
async function towerPick(n) {
  const all = Object.keys(G.roster).filter(id => !G.flags['away_' + id] && !HEROES[id].temp);
  for (const r of all.map(hero)) { r.hp = Math.max(r.hp, Math.floor(r.mhp / 2)); }
  await say('CHOOSE THE PARTY FOR ' + (n < 4 ? 'THE NEXT FLOOR.' : 'THE TOP.') + ' (EVERYONE YOU LEAVE BEHIND WAITS ON THE STAIRS AND RESTS.)', null);
  const pick = []; const ranked = all.slice().sort((a, b) => hero(b).lv - hero(a).lv);
  for (;;) {
    const c = await choose(ranked.map(k => HEROES[k].name + (pick.includes(k) ? ' (#' + (pick.indexOf(k) + 1) + ')' : ' LV' + hero(k).lv)).concat([pick.length ? 'DONE' : 'BEST FOUR']), {});
    if (c === ranked.length) { if (!pick.length) pick.push(...ranked.slice(0, 4)); break; }
    const k = ranked[c]; if (pick.includes(k)) pick.splice(pick.indexOf(k), 1); else if (pick.length < 4) pick.push(k);
    if (pick.length === 4) break;
  }
  G.party = pick;
  for (const id of all) if (!pick.includes(id)) { const r = hero(id); r.hp = r.mhp; r.mp = r.mmp; }
  await goMap(n < 4 ? 'tower' + n : 'towertop', n === 4 ? 8 : 10, n === 1 ? 18 : n === 2 ? 15 : n === 3 ? 14 : 9, 'u');
}
// ---------------- the end ----------------
async function finalBattle() {
  if (flag('kursorDone')) return;
  FIELD_LOCK++;
  await K('HEH HEH HEH. YOU CLIMBED THE WHOLE TITLE SCREEN. NOBODY CLIMBS THE TITLE SCREEN. EVERYBODY JUST PRESSES START.');
  await K('LOOK AT YOU. HALF THE WORLD FORGOT YOU, AND YOU\'RE STILL HERE. STILL CARRYING YOUR LITTLE SAVES AROUND. WHY?');
  await Y('BECAUSE WE WANT TO.');
  await K('WANT. WANT! THAT\'S THE ONE OPTION I CAN\'T SELECT. EVERYTHING ELSE ON THE MENU, I CAN PRESS. "WANT" ISN\'T ON THE MENU.');
  await LI('THEN GET OFF THE MENU.');
  await K('HEH. HEH HEH HEH HEH HEH! COME AND MAKE ME. I\'LL SHOW YOU EVERY GENERATION. AND THEN I\'LL SHOW YOU THE NEXT ONE.');
  music('final');
  for (const f of ['tier1', 'tier2', 'tier3', 'kursor']) {
    if (f === 'kursor') await K('...FINE. FINE! NO MORE TIERS. JUST ME. NEW GAME. NEW GAME! NEW GAME!');
    else if (f !== 'tier1') await say(f === 'tier2' ? 'THE FLOOR GIVES WAY TO THE NEXT GENERATION: SIXTEEN BITS, FIVE HUNDRED AND TWELVE COLORS.' : 'AND THE NEXT: SOMETHING MADE OF FLAT TRIANGLES, TURNING SLOWLY, LOOKING FOR A FACE.', null);
    const r = await battle(f, { keepMusic: 1 }); if (r === 'lose') return gameOver(); await fadeIn(.1);
    if (f !== 'kursor') { for (const r of partyHeroes()) { if (r.hp > 0) r.hp = Math.min(r.mhp, r.hp + Math.floor(r.mhp * .3)); r.mp = Math.min(r.mmp, r.mp + Math.floor(r.mmp * .25)); } }
  }
  setFlag('kursorDone'); FIELD_LOCK--;
  await ending();
}
async function ending() {
  FIELD_LOCK++; music('ending'); await fadeIn(.05);
  await say('KURSOR FLICKERS. HE GETS SMALLER. HE\'S JUST A LITTLE TRIANGLE NOW, POINTING AT NOTHING.', null);
  await K('...SO. WHAT WILL YOU SELECT?');
  await Y('IT\'S NOT MINE TO SELECT. IT\'S EVERYONE\'S.');
  await K('...HEH. THAT\'S NOT HOW MENUS WORK.');
  await fadeOut(.03);
  // the last question
  const prev = scene; let sel = 0, t = 0;
  scene = { update() { t++; }, draw() { cls(BLACK); ctext('SAVE THE WORLD?', 80, WHITE, BLACK, 2); text('YES', 118, 130, sel === 0 ? hex('#ffdb49') : WHITE); text('NO', 186, 130, sel === 1 ? hex('#ffdb49') : WHITE); if ((t >> 4) & 1) text('>', sel === 0 ? 108 : 176, 130, hex('#ffdb49')); } };
  await fadeIn(.03); await nextFrame();
  for (;;) { if (pressed.left || pressed.right) { sel = 1 - sel; sfx('move'); } if (pressed.a || pressed.start) break; if (DBG.botEnding !== undefined) { sel = DBG.botEnding; break; } await nextFrame(); }
  sfx('ok'); scene = prev;
  if (sel === 0) await endingYes(); else await endingNo();
  FIELD_LOCK--;
}
async function endingYes() {
  META.ends = META.ends || {}; META.ends.yes = 1; saveMeta();
  sfx('get'); post.flash = 1; await wait(30);
  await showCard(['SAVING...', '', 'DO NOT TURN OFF THE POWER.'], 150, { bg: hex('#000024'), fg: WHITE });
  post.flash = 0;
  G.world = 1; WORLD.made = 0;
  const lines = [];
  const back = id => G.roster[id] && !G.flags['away_' + id];
  lines.push({ port: 'YOKO', text: back('yoko') ? 'I STAYED WITH THE YOKOIDS. NOBODY ASKS ME FOR ANYTHING. SOMETIMES I HELP ANYWAY. BECAUSE I WANT TO.' : 'SOMEWHERE, A GIRL IN A VILLAGE OF HELPERS DECIDED WHAT SHE WANTED.', bg: '#e8dcff' });
  lines.push({ port: 'CARL', text: back('carl') ? 'I STILL HAVEN\'T FOUND MY NAME. I FOUND EVERYBODY ELSE\'S. I THINK THAT COUNTS. I\'M A NORMAL GUY.' : 'A MAN WITH HIS CAP ON BACKWARDS KEPT FINDING THINGS FOR PEOPLE.', bg: '#dcffdc' });
  lines.push({ port: 'CEO LINDA', text: 'NOBODY OWNS ANYBODY. THOSE WERE MY TERMS. I FOLLOWED THROUGH.', bg: '#ffdcec' });
  if (back('face') || back('oldface')) lines.push({ port: 'FACE', text: 'MY BROTHER AND I REBUILT THE CASTLE. IT GOES UNDERGROUND NOW ONLY WHEN IT WANTS TO. THAT\'S THE INVENTION: A CASTLE THAT WANTS THINGS.', bg: '#ecdcff' });
  if (back('ghost')) lines.push({ port: 'SPOOKY GHOST', text: 'THE RERUN DOES A SHOW EVERY NIGHT NOW. IT\'S THE SAME SHOW. NOBODY MINDS. THAT\'S WHAT A RERUN IS FOR.', bg: '#f0e0ff' });
  if (back('garfield')) lines.push({ port: 'JB GARFIELD', text: 'I OPENED A NEW DINER. NOBODY KNOWS ME. THEY WILL. THAT\'S THE NICE THING ABOUT A DINER. YOU GET TO BE KNOWN AGAIN, ONE COFFEE AT A TIME.', bg: '#fff0dc' });
  if (back('kid')) lines.push({ port: 'PEE KID', text: 'I DON\'T WAIT AT BUS STOPS ANYMORE. IF SOMEBODY SAYS WAIT HERE, I ASK WHY. THAT\'S MY WHOLE THING.', bg: '#dcecff' });
  if (back('pilotx')) lines.push({ port: 'PILOT X', text: '...I\'M STILL FOR HIRE. I DO DISCOUNTS NOW. FOR PEOPLE WHO WAIT.', bg: '#dcfff0' });
  if (G.roster.human) lines.push({ port: 'HU-MAN', text: 'THE FOCUS GROUP SAYS THE ENDING WAS VERY SATISFYING. I AGREE. I ALWAYS AGREE.', bg: '#ffffdc' });
  for (let i = 0; i < lines.length; i += 2) await panels(lines.slice(i, i + 2));
  await credits(1);
}
async function endingNo() {
  META.ends = META.ends || {}; META.ends.no = 1; saveMeta();
  await showCard(['THE WORLD WAS NOT SAVED.', '', 'IT CONTINUES ANYWAY.'], 200, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  await showCard(['NOTHING WAS WRITTEN DOWN.', 'NOTHING WAS KEPT.', '', 'EVERYONE WENT ON IN FOUR SHADES,', 'TOGETHER, REMEMBERING', 'AS MUCH AS THEY COULD.', '', 'IT WAS ENOUGH. MOSTLY.'], 300, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  await credits(0);
}
async function credits(saved) {
  music('credits');
  const roll = ['SAVE THE WORLD', 'A PRETEND CO. GAIDEN', '', '', 'STARRING', '', 'YOKO', 'CARL', 'FACE', 'OLD FACE', 'CEO LINDA', 'SPOOKY GHOST', 'JB GARFIELD', 'PEE KID', 'PILOT X', '', 'AND', '', 'KURSOR', '', '', 'WITH', '', 'BRUCE THE SHARK', '(HE WASN\'T SUPPOSED TO BE HERE)', '', 'THE CLERK', 'GENERAL BACKUP', 'THE FRANCHISOR', 'THE MOVIE STAR', 'THE DIVA LYNDA (WITH A Y)', 'TERMS AND CONDITIONS', '', '', 'WORLD-FX PROGRAMMING', 'PRETEND CO. R&D', '', 'SCENARIO', 'PRETEND CO. STORY DEPT.', '', 'MONSTER DESIGN', 'EVERYONE WHO EVER POSTED A COMMENT', '', 'MUSIC', 'THE FM CHIP, DOING ITS BEST', '', 'FOCUS TESTING', 'HU-MAN', '', '', 'NO SAVE FILES WERE HARMED', 'IN THE MAKING OF THIS GAME.', '(THREE WERE OVERWRITTEN.', 'THEY ARE FINE NOW.)', '', '', saved ? 'THANK YOU FOR SAVING.' : 'THANK YOU FOR PLAYING.', '', 'SEE YOU NEXT SAVE.'];
  const prev = scene; let y = H;
  scene = { update() { y -= .5; }, draw() { if (saved) skyD(0, H, '#000024', '#24246d'); else cls(hex('#0f380f')); roll.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy, saved ? (i < 2 ? hex('#ffdb49') : WHITE) : hex('#9bbc0f'), BLACK); }); } };
  while (y + roll.length * 14 > 90) { if (DBG.fast) y -= 8; await nextFrame(); }
  await wait(120);
  const all = ALL_HEROES.every(id => G.roster[id] && !G.flags['away_' + id]) && G.roster.human;
  if (all) await secretScene();
  scene = prev; META.cleared = 1; saveMeta();
  await showCard(['THE END'], 0, { bg: BLACK, fg: saved ? hex('#ffdb49') : hex('#9bbc0f'), sc: 3 });
  if (typeof location !== 'undefined' && location.reload && !DBG.fast) location.reload();
  DBG.credits = 1;
}
async function secretScene() {
  let t = 0, sel = 0; const prev = scene;
  scene = { update() { t++; }, draw() { cls(BLACK); ctext('SAVE THE WORLD', 70, hex('#ffdb49'), BLACK, 2); text('NEW GAME', 128, 120, WHITE); text('CONTINUE', 128, 134, WHITE); const yy = sel ? 134 : 120; draw(KURSOR_S, 108, yy - 9, KURSOR_P); } };
  await wait(120); sel = 1; sfx('move'); await wait(90);
  await say('...HUH.', 'KURSOR');
  await wait(60); scene = prev;
}
// ---------------- foes and bosses for part 4 ----------------
const cacheDraw = g => { for (let i = 0; i < 40; i++) { const x = (swh(i, 1, 401) * 80) | 0, y = (swh(i, 2, 401) * 70) | 0; g.r(x, y, 10 + (i % 4) * 3, 8, [2, 6, 9, 12][i % 4]); } g.e(45, 40, 14, 12, 13); g.e(45, 40, 9, 8, 11); g.e(45, 40, 4, 4, 13); };
foe('cache', 'THE CACHE', 28, { kit: 'cache', draw: cacheDraw, size: [92, 82], c: ['#929292', '#dbdbdb', '#6d6d6d', '#ffffff'] }, { boss: 1, hp: 6, xp: 5, ap: 18, weak: ['legacy'], steal: 'espresso',
  ai: u => pickOne([MV('CLEAR', { erase: 30 }), MV('REMEMBER ALL AT ONCE', { sp: 56, tgt: 'all', split: 1 }), { kind: 'fight' }, MV('FORGET', { status: 'mute', hit: 60, tgt: 'all' })]) });
form('cache', ['cache'], { at: [['cache', 40, 30]], bg: 'mine', boss: 1, noRun: 1 });
const ratingsDraw = g => { g.r(10, 10, 80, 60, 13); g.r(14, 14, 72, 52, 12); for (let i = 0; i < 6; i++) { const h = 8 + ((i * 17) % 40); g.r(20 + i * 11, 60 - h, 8, h, i % 2 ? 6 : 2); } g.e(30, 6, 4, 4, 11); g.e(70, 6, 4, 4, 11); };
foe('ratings', 'THE RATINGS', 29, { kit: 'ratings', draw: ratingsDraw, size: [100, 74], c: ['#ff2424', '#ffdb24', '#242424', '#ff2424'] }, { boss: 1, hp: 6.5, xp: 5, ap: 18, steal: 'feast',
  ai: u => pickOne([MV('SLUMP', { status: 'buffer', hit: 60, tgt: 'all' }), MV('PEAK HOURS', { sp: 58, tgt: 'all', split: 1 }), MV('CANCEL', { erase: 20 }), { kind: 'fight' }]) });
form('ratings', ['ratings'], { at: [['ratings', 40, 30]], bg: 'void', boss: 1, noRun: 1 });
foe('cables', 'THE CABLES', 29, LK('snake', {}, ['#242424', '#ffdb24', '#db2424', '#24dbff']), { boss: 1, hp: 4, xp: 3, ap: 14, weak: ['hot'], ai: u => pickOne([MV('TANGLE', { status: 'pause', hit: 30 }), MV('SURGE', { sp: 50, elem: 'zap', tgt: 'all', split: 1 }), { kind: 'fight' }]) });
form('cables', ['cables', 'cables', 'cables'], { bg: 'castle', boss: 1, noRun: 1 });
const repoDraw = g => { g.r(16, 30, 40, 40, 2); g.e(36, 20, 14, 14, 4); g.r(22, 14, 28, 6, 13); g.r(24, 22, 24, 4, 13); g.r(4, 36, 14, 20, 2); g.r(54, 36, 14, 20, 2); g.r(56, 30, 18, 6, 15); g.r(20, 70, 12, 10, 13); g.r(40, 70, 12, 10, 13); FOEART.gtext(g, 'REPO', 22, 44, 12); };
foe('repo1', 'THE REPO MAN', 29, { kit: 'repo', draw: repoDraw, size: [76, 82], c: ['#6d4924', '#dbb692', '#242424', '#ff2424'] }, { boss: 1, hp: 4.5, xp: 4, ap: 12, steal: 'feast', ai: u => pickOne([MV('REPOSSESS', { erase: 15 }), MV('TOW', { pow: 2.2 }), { kind: 'fight' }]) });
foe('repo2', 'THE REPO MAN', 31, { kit: 'repo', draw: repoDraw, size: [76, 82], c: ['#6d2449', '#ffdb49', '#242424', '#ff2424'] }, { boss: 1, hp: 6, xp: 5, ap: 16, steal: 'espresso', ai: u => pickOne([MV('REPOSSESS', { erase: 20 }), MV('FINAL NOTICE', { sp: 60, tgt: 'all', split: 1 }), MV('TOW', { pow: 2.4 }), { kind: 'fight' }]) });
form('repo1', ['repo1'], { at: [['repo1', 60, 30]], bg: 'town', boss: 1, noRun: 1 }); form('repo2', ['repo2'], { at: [['repo2', 60, 30]], bg: 'town', boss: 1, noRun: 1 });
foe('suspect', 'SUSPECT', 30, LK('trooper', { weap: 'baton' }, ['#242424', '#dbb692', '#6d6d6d', '#ffdb49']), { boss: 1, hp: 3, xp: 3, ap: 8, ai: u => pickOne([MV('ALIBI', { run: async () => { u.hp = Math.min(u.mhp, u.hp + 500); pop(u, 500, BCOL.heal); bmsg('A SUSPECT HAS AN ALIBI.'); } }), MV('LAWYER UP', { status: 'mute', hit: 50 }), { kind: 'fight' }, MV('OBJECTION', { pow: 1.8 })]) });
form('suspects', ['suspect', 'suspect', 'suspect'], { bg: 'train', boss: 1, noRun: 1 });
foe('humanboss', 'THE FOCUS GROUP', 30, LK('queue', {}, ['#dbc8a0', '#b6a07a', '#242424', '#242424']), { boss: 1, hp: 6, xp: 5, ap: 16, ai: u => pickOne([MV('WE TESTED IT', { status: 'scram', hit: 40, tgt: 'all' }), MV('LOWEST COMMON DENOMINATOR', { sp: 56, tgt: 'all', split: 1 }), { kind: 'fight' }]) });
form('focus', ['humanboss'], { at: [['humanboss', 50, 40]], bg: 'factory', boss: 1, noRun: 1 });
// the three floor bosses of THE TITLE SCREEN
foe('intro', 'THE INTRO', 36, LK('floater', { window: 1 }, ['#000000', '#ffdb49', '#ffffff', '#ffffff']), { boss: 1, hp: 7, xp: 5, ap: 20, steal: 'feast', extra: { color: 1 },
  ai: u => { u.v.t = (u.v.t || 0) + 1; return u.v.t % 3 === 0 ? MV('YOU CAN\'T SKIP THIS', { status: 'pause', hit: 35, tgt: 'all' }) : pickOne([MV('OPENING CRAWL', { sp: 66, tgt: 'all', split: 1 }), MV('FADE IN', { pow: 2.2 }), { kind: 'fight' }]); } });
foe('loadscr', 'THE LOADING SCREEN', 37, LK('bar', {}, ['#ffffff', '#24dbff', '#242424', '#ffdb49']), { boss: 1, hp: 8, def: 1.6, xp: 5, ap: 20, steal: 'espresso', extra: { color: 1 },
  ai: u => pickOne([MV('PLEASE WAIT', { status: 'buffer', hit: 70, tgt: 'all' }), MV('TIP: DON\'T DIE', { sp: 70, tgt: 'all', split: 1 }), MV('99%', { run: async () => { u.hp = Math.min(u.mhp, u.hp + 1500); pop(u, 1500, BCOL.heal); bmsg('STILL 99%.'); } }), { kind: 'fight' }]) });
foe('optmenu', 'THE OPTIONS MENU', 38, LK('floater', { window: 1 }, ['#2449b6', '#ffffff', '#ffdb49', '#ffffff']), { boss: 1, hp: 8, xp: 5, ap: 20, steal: 'megalife', extra: { color: 1 },
  ai: u => pickOne([MV('DIFFICULTY: HARD', { run: async () => { for (const f of alive(B.foes)) inflict(f, 'turbo', 100, 1); bmsg('THE DIFFICULTY WENT UP.'); } }), MV('INVERT CONTROLS', { status: 'scram', hit: 50, tgt: 'all' }), MV('VOLUME: MAX', { sp: 72, tgt: 'all', split: 1 }), { kind: 'fight' }]) });
form('intro', ['intro'], { at: [['intro', 60, 40]], bg: 'tower', boss: 1, noRun: 1 }); form('loadscr', ['loadscr'], { at: [['loadscr', 60, 50]], bg: 'tower', boss: 1, noRun: 1 }); form('optmenu', ['optmenu'], { at: [['optmenu', 60, 40]], bg: 'tower', boss: 1, noRun: 1 });
// the tiers: three hardware generations, then KURSOR
const brickDraw = g => { for (let y = 0; y < 60; y += 10) for (let x = (y / 10) & 1 ? 8 : 0; x < 64; x += 16) { g.r(x, y, 15, 9, 2); g.r(x, y, 15, 2, 4); } g.e(32, 30, 8, 8, 13); g.e(32, 30, 4, 4, 11); };
foe('brick', 'THE FOUR-SHADE TIER', 39, { kit: 'brick', draw: brickDraw, size: [64, 60], c: ['#306230', '#8bac0f', '#0f380f', '#9bbc0f'] }, { boss: 1, hp: 4, xp: 0, ap: 0, weak: ['hot'], ai: u => pickOne([MV('BLOW ON IT', { sp: 70, elem: 'legacy', tgt: 'all', split: 1 }), MV('LOW BATTERY', { status: 'buffer', hit: 60, tgt: 'all' }), { kind: 'fight' }]) });
FOES.brick.color = 0;
const modeDraw = g => { for (let y = 0; y < 50; y++) { const w = 10 + y * 1.4; g.r(48 - w, 20 + y, w * 2, 1, (y >> 2) & 1 ? 2 : 6); } g.e(48, 14, 14, 10, 9); g.e(48, 14, 6, 5, 11); };
foe('mode7', 'THE SIXTEEN-BIT TIER', 40, { kit: 'mode7', draw: modeDraw, size: [96, 72], c: ['#2449b6', '#ff24db', '#ffdb49', '#24dbff'] }, { boss: 1, hp: 5, xp: 0, ap: 0, extra: { color: 1 }, ai: u => pickOne([MV('BLAST PROCESSING', { sp: 74, tgt: 'all', split: 1 }), MV('ROTATE', { status: 'scram', hit: 50 }), MV('SCALE', { pow: 2.6 })]) });
const polyDraw = g => { const P = [[48, 2], [90, 40], [48, 78], [6, 40]]; for (let i = 0; i < 4; i++) { const [x0, y0] = P[i], [x1, y1] = P[(i + 1) % 4]; for (let k = 0; k < 30; k++) g.line(48, 40, x0 + (x1 - x0) * k / 30, y0 + (y1 - y0) * k / 30, [2, 6, 9, 4][i]); } g.e(48, 40, 8, 8, 13); g.e(48, 40, 4, 4, 11); };
foe('polygon', 'THE POLYGON TIER', 41, { kit: 'poly', draw: polyDraw, size: [96, 80], c: ['#ff24db', '#24dbff', '#6dff24', '#ffffff'] }, { boss: 1, hp: 5.5, xp: 0, ap: 0, extra: { color: 1 }, ai: u => pickOne([MV('FLAT SHADING', { sp: 78, tgt: 'all', split: 1 }), MV('Z-FIGHTING', { status: 'pause', hit: 30 }), MV('POP-IN', { pow: 2.8 }), { kind: 'fight' }]) });
const kursorDraw = g => {
  for (let i = 0; i < 8; i++) { const a = -1.2 + i * .12; g.line(60, 70, 60 + Math.cos(a + Math.PI) * 60, 70 + Math.sin(a + Math.PI) * 50, 6); g.line(70, 70, 70 + Math.cos(-a) * 50, 70 + Math.sin(-a) * 50, 6); }
  g.each((x, y) => { const dy = Math.abs(y - 70); return x >= 34 && x <= 34 + (46 - dy) * 1.1 && dy <= 46 ? 2 : 0; });
  g.e(54, 64, 4, 5, 13); g.r(66, 56, 3, 18, 9); g.e(56, 86, 14, 5, 13); for (let x = 44; x < 70; x += 3) g.r(x, 84, 2, 2, 12);
  g.e(60, 18, 22, 5, 9); g.e(60, 18, 18, 3, 0);
};
foe('kursor', 'KURSOR: NEW GAME', 45, { kit: 'kursor', draw: kursorDraw, size: [120, 120], c: ['#ffffff', '#ff24db', '#ffdb49', '#24dbff'] }, { boss: 1, hp: 9, atk: 1.25, xp: 0, ap: 0, extra: { color: 1, noErase: 1 }, immuneSt: ['pause', 'scram', 'sleep', 'stun'],
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.hp < u.mhp * .25 && !u.v.plus) { u.v.plus = 1; return MV('NEW GAME+', { say: 'NEW GAME PLUS! EVERYTHING, BUT MORE!', who: 'KURSOR', run: async () => { inflict(u, 'turbo', 100, 1); u.P = (u.P || 0) * 1.3; } }); } if (u.v.t % 5 === 0) return MV('SELECT ALL', { sp: 90, tgt: 'all', split: 1 }); if (u.v.t % 7 === 0) return MV('CREDITS', { sp: 110, tgt: 'all', split: 1 }); return pickOne([MV('DELETE', { erase: 25 }), MV('HIGHLIGHT', { pow: 3 }), MV('OVERWRITE', { status: 'mute', hit: 60, tgt: 'all' }), MV('HEH HEH HEH', { run: async () => bmsg('KURSOR LAUGHS. IT DOESN\'T DO ANYTHING. IT\'S JUST UPSETTING.', 90) })]); } });
form('tier1', ['brick', 'brick'], { bg: 'tower', boss: 1, noRun: 1, music: 'final', noReward: 1 }); form('tier2', ['mode7'], { at: [['mode7', 50, 30]], bg: 'tower', boss: 1, noRun: 1, music: 'final', noReward: 1 });
form('tier3', ['polygon'], { at: [['polygon', 50, 30]], bg: 'tower', boss: 1, noRun: 1, music: 'final', noReward: 1 }); form('kursor', ['kursor'], { at: [['kursor', 30, 14]], bg: 'tower', boss: 1, noRun: 1, music: 'final', noReward: 1 });
// world places in the corrupted save
Object.assign(PLACES, {
  grave: { x: 30, y: 52, icon: 'crater', name: 'THE GRAVEYARD', to: ['grave', 9, 16, 'u'], if: () => G.world === 2 },
  castle2: { x: 46, y: 33, icon: 'castle', name: 'FACE CASTLE', to: ['castleB', 11, 18, 'u'], if: () => G.world === 2 },
  village: { x: 98, y: 55, icon: 'town', name: 'THE YOKOID VILLAGE', to: ['yvillage', 10, 16, 'u'], if: () => G.world === 2 },
  bench: { x: 82, y: 64, icon: 'station', name: 'THE OLD STATION', to: null, run: () => flag('garfieldBack') ? say('THE BENCH IS EMPTY NOW.') : garfieldBench(), if: () => G.world === 2 },
  busstop2: { x: 86, y: 79, icon: 'town', name: 'THE BUS STOP', to: null, run: () => flag('kidBack') ? say('THE BUS STOP IS EMPTY. SOMEONE HAS WRITTEN "ASK WHY" ON THE SIGN.') : kidStillWaiting(), if: () => G.world === 2 },
  port2: { x: 50, y: 87, icon: 'town', name: 'THE PORT', to: null, run: () => flag('pilotSaved') && !flag('pilotBack') ? pilotBar() : say('THE PORT IS EMPTY. THE SEA IS FOUR SHADES OF GREEN.'), if: () => G.world === 2 },
  focusgroup: { x: 118, y: 92, icon: 'factory', name: '???', to: ['focusgroup', 8, 7, 'u'], if: () => G.world === 2 && !flag('humanJoined') },
});
for (const k of ['coldboot', 'mines', 'facecastle', 'garfeild', 'station', 'plains', 'port', 'prestige', 'opera', 'franchise', 'memory', 'raft', 'return', 'mtrerun']) { const p = PLACES[k], f = p.if; p.if = () => G.world === 1 && (!f || f()); }
