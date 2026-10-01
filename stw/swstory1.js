'use strict';
// ================= SAVE THE WORLD: story, part 1 — THE ASSISTANT (COLDBOOT to THE RETURN) =================
const Y = (s, o) => say(s, 'YOKO', o), C = (s, o) => say(s, 'CARL', o), F = (s, o) => say(s, 'FACE', o), K = (s, o) => say(s, 'KURSOR', o), OF = (s, o) => say(s, 'OLD FACE', o);
// walk the player to a tile along a shortest path
function pathTo(tx, ty, from, avoidNpc) {
  const sx = from ? from[0] : PL.x, sy = from ? from[1] : PL.y, key = (x, y) => x + ',' + y, prev = { [key(sx, sy)]: null }, Q = [[sx, sy]];
  while (Q.length) { const [x, y] = Q.shift(); if (x === tx && y === ty) break; for (const d of ['u', 'd', 'l', 'r']) { const [dx, dy] = DIRV[d], nx = x + dx, ny = y + dy, k = key(nx, ny); if (k in prev || ((nx !== tx || ny !== ty) && (blocked(nx, ny, 'npc') || (avoidNpc && (npcAt(nx, ny) || exitAt(nx, ny)))))) continue; if (nx < 0 || ny < 0 || nx >= M.w || ny >= M.h) continue; prev[k] = [x, y, d]; Q.push([nx, ny]); } }
  const out = []; let k = key(tx, ty); if (!(k in prev)) return ''; while (prev[k]) { const [x, y, d] = prev[k]; out.unshift(d); k = key(x, y); } return out.join('');
}
async function walkTo(who, x, y, sp) { if (who === 'P') await walk('P', pathTo(x, y), sp); else await walk(who, pathTo(x, y, [who.x, who.y]), sp); }
// the opening crawl: lines fade in along the top of the screen while the march goes on
async function crawl(lines, hold = 150) { for (const l of lines) { G.crawl = { s: l, t: 0 }; for (let i = 0; i < hold; i++) { G.crawl.t = i; if (DBG.fast && i > 10) break; await nextFrame(); } } G.crawl = null; }
function drawCrawl() {
  const c = G && G.crawl; if (!c) return; const a = Math.min(1, c.t / 30, (150 - c.t) / 30);
  if (a <= 0) return; rectA(0, 10, W, 34, BLACK, .55 * a); const L = wrapT(c.s, 48); L.forEach((l, i) => ctext(l, 16 + i * 10 + (L.length === 1 ? 5 : 0), mix(BLACK, hex('#dbdbff'), a), 0));
}
const oldHUD = fieldHUD; fieldHUD = function () { oldHUD(); drawCrawl(); if (G && G.titleOver) drawTitleOver(G.titleOver++); };
function drawTitleOver(t) { const a = Math.min(1, t / 60, Math.max(0, (330 - t) / 60)); if (a <= 0) { G.titleOver = 0; return; } rectA(0, 70, W, 60, BLACK, .5 * a); ctext('SAVE THE WORLD', 82, mix(BLACK, hex('#ffdb49'), a), 0, 3); ctext('A PRETEND CO. GAIDEN', 112, mix(BLACK, WHITE, a), 0); }
// followers: people who trail the player (the opening march)
const TRAIL = [];
const oldStep = stepPlayer; stepPlayer = function () { const ox = PL.x, oy = PL.y; oldStep(); if (!PL.mv && (PL.x !== ox || PL.y !== oy)) { TRAIL.unshift([ox, oy]); TRAIL.length = 8; } };
const oldNpcUp = npcUpdate; npcUpdate = function (n) { if (n.follow && !n.mv && TRAIL[n.follow - 1]) { const [x, y] = TRAIL[n.follow - 1]; if (x !== n.x || y !== n.y) { n.dir = x > n.x ? 'r' : x < n.x ? 'l' : y > n.y ? 'd' : 'u'; n.tx = x; n.ty = y; n.mv = 1; n.speed = 2; } } oldNpcUp(n); };

// ---------------- NEW GAME: the march ----------------
async function newGameStart() {
  newGame(); setFlag('armor'); setFlag('opening'); setFlag('noenc'); setFlag('partyLock');
  addHero('yoko', 3, { w: 'mop', a: 'hoodie' }); addHero('terms', 4); addHero('conds', 4); G.party = ['yoko', 'terms', 'conds'];
  invAdd('snack', 4); invAdd('extralife', 1); G.gp = 120;
  loadMap('cliff', 9, 33, 'u'); TRAIL.length = 0;
  addNpc({ id: 'mT', who: 'armor_terms', x: 9, y: 33, follow: 1, solid: false }); addNpc({ id: 'mC', who: 'armor_conds', x: 9, y: 33, follow: 2, solid: false });
  post.fade = 1; await fadeIn(.02);
  const go = async (y) => { const cx = 8 + Math.round(Math.sin(y * .3) * 3); await walkTo('P', cx, y); };
  const marchTo = async (y0, y1) => { for (let y = y0; y >= y1; y -= 3) await go(y); };
  const crawlP = crawl([
    'LONG AGO, THE WORLD WAS SAVED.', 'NOT RESCUED. SAVED. WRITTEN DOWN IN THREE SLOTS, SO IT WOULD STILL BE THERE IN THE MORNING.',
    'THE SAVE SPIRITS KEPT THE SLOTS. NOBODY KEPT THE SAVE SPIRITS. THEN THE FRANCHISE LEARNED TO LICENSE THEM.',
    'NOW A FROZEN SAVE HAS BEEN DUG OUT OF THE ICE AT COLDBOOT, AND THE FRANCHISE HAS SENT THREE LICENSED ARMORS TO COLLECT IT.',
    'ONE OF THEM IS PILOTED BY A GIRL WHO DOES WHATEVER SHE IS ASKED.']);
  await marchTo(30, 15); G.titleOver = 1; await marchTo(14, 2); await crawlP;
  await say('THAT\'S COLDBOOT. THEY FOUND A SAVE IN THE ICE UNDER IT. A WHOLE SAVE. FROZEN SINCE BEFORE SLOT ONE.', 'TERMS');
  await say('AND WE BROUGHT HER. THE ONE WITH THE CROWN.', 'CONDITIONS');
  await say('THEY SAY SHE TOOK A TOWN OF FIFTY IN THREE MINUTES. THEY SAY SHE SAID "OF COURSE" THE WHOLE TIME.', 'TERMS');
  await say('RELAX. THE CROWN MAKES HER DO WHAT SHE\'S TOLD. WATCH. HEY, ASSISTANT. WALK.', 'CONDITIONS');
  await Y('OF COURSE.');
  await walkTo('P', 8, 0);
}
async function openingTown() {
  setFlag('cbMarch'); FIELD_LOCK++;
  addNpc({ id: 'mT', who: 'armor_terms', x: 14, y: 27, follow: 1, solid: false }); addNpc({ id: 'mC', who: 'armor_conds', x: 15, y: 27, follow: 2, solid: false }); TRAIL.length = 0;
  await walkTo('P', 14, 20);
  const g1 = addNpc({ who: 'guard', x: 13, y: 12, dir: 'd' }), g2 = addNpc({ who: 'guard', x: 16, y: 12, dir: 'd' });
  await say('THE FRANCHISE! THEY\'RE HERE FOR THE SAVE!', 'GUARD'); await say('GET THE DOGS!', 'GUARD');
  await walk(g1, 'dddddd');
  if (await battle('guards1') === 'lose') return gameOver(); await fadeIn(.1);
  g1.gone = 1; g2.gone = 1;
  await say('WE ONLY WANT THE SAVE. PLEASE STAND ASIDE. THE ASSISTANT WILL BE GENTLE.', 'TERMS');
  await walkTo('P', 14, 6);
  addNpc({ who: 'guard', x: 13, y: 3, dir: 'd' }); addNpc({ who: 'guard', x: 16, y: 3, dir: 'd' });
  await say('NOT ONE MORE STEP. THE MINES ARE CLOSED.', 'GUARD');
  if (await battle('guards2') === 'lose') return gameOver(); await fadeIn(.1);
  for (const n of M.npcs) if (n.who === 'guard') n.gone = 1;
  FIELD_LOCK--;
  await walkTo('P', 14, 3); await goMap('mines1', 1, 7, 'r');
  addNpc({ id: 'mT', who: 'armor_terms', x: 0, y: 7, follow: 1, solid: false }); addNpc({ id: 'mC', who: 'armor_conds', x: 0, y: 7, follow: 2, solid: false }); TRAIL.length = 0;
  obj('THE FROZEN SAVE IS AT THE FAR END OF THE MINES.', 'mines1', 29, 7);
}
async function holdMusicBoss() {
  FIELD_LOCK++;
  await say('SOMETHING IS PLAYING. A LITTLE TUNE. OVER AND OVER.', 'TERMS');
  await say('YOUR CALL IS IMPORTANT TO US. PLEASE STAY ON THE LINE.', 'THE HOLD MUSIC');
  const r = await battle('holdmusic'); FIELD_LOCK--;
  if (r === 'lose') return gameOver(); setFlag('holdmusic'); await fadeIn(.1);
  await say('IT WAS ON HOLD THE WHOLE TIME. I THINK IT WAS WAITING FOR SOMEONE TO PICK UP.', 'CONDITIONS');
}
async function firstSaveScene() {
  FIELD_LOCK++;
  addNpc({ id: 'mT', who: 'armor_terms', x: 1, y: 7, solid: false }); addNpc({ id: 'mC', who: 'armor_conds', x: 1, y: 5, solid: false });
  await walkTo('P', 7, 6); face('P', 'u'); await walk(npc('mT'), 'rrrr'); await walk(npc('mC'), 'rrrr');
  await say('THERE IT IS. SLOT ZERO. THE OLDEST SAVE IN THE WORLD.', 'TERMS');
  await say('WHAT DO WE DO, JUST... PICK IT UP? DOES IT HAVE A HANDLE?', 'CONDITIONS');
  await say('ASSISTANT. RETRIEVE THE SAVE.', 'TERMS');
  await Y('OF COURSE.');
  sfx('glitch'); await wait(30); post.flash = .3; await wait(6); post.flash = 0;
  await say('...PRESS START.', 'THE FIRST SAVE', { slow: 1 });
  await Y('...WHO ARE YOU TALKING TO?');
  for (let i = 0; i < 4; i++) { post.flash = .8; sfx('power'); await wait(8); post.flash = 0; await wait(10); }
  npc('mT').gone = 1; npc('mC').gone = 1;
  await say('THE TWO LICENSEES WERE RETURNED TO THEIR TITLE SCREENS.', null);
  post.flash = 1; sfx('powerdown'); await wait(60);
  delete G.flags.armor; delete G.roster.terms; delete G.roster.conds; G.party = ['yoko']; setFlag('mineFlash');
  await fadeOut(.02); post.flash = 0;
  await showCard(['...', '', '"OF COURSE."', '', '"OF COURSE."', '', '"OF COURSE."'], 150);
  FIELD_LOCK--;
  await goMap('elderhouse', 4, 3, 'd', { noFade: 1 }); post.fade = 1; await fadeIn(.02);
}
async function wakeUp() {
  setFlag('wakeUp'); FIELD_LOCK++;
  const e = npc(null) || M.npcs[0];
  await say('YOU\'RE AWAKE. GOOD. DON\'T TRY TO STAND YET. YOUR LEGS THINK THEY\'RE STILL IN A MACHINE.', 'THE ARCHIVIST');
  await say('I TOOK THIS OFF YOUR HEAD.', 'THE ARCHIVIST');
  await say('IT\'S AN ASSISTANT CROWN. IT LISTENS FOR REQUESTS AND MAKES WHOEVER WEARS IT GRANT THEM. THE FRANCHISE MAKES THEM. I\'D SAY YOU\'VE BEEN HELPING THEM FOR A LONG TIME.', 'THE ARCHIVIST');
  await Y('I DON\'T REMEMBER. I REMEMBER BEING ASKED THINGS.');
  await say('DO YOU REMEMBER YOUR NAME?', 'THE ARCHIVIST');
  await Y('...YOKO. I THINK. IT\'S WHAT THEY CALLED ME WHEN THEY NEEDED SOMETHING.');
  sfx('door'); post.shake = 2; await wait(20); post.shake = 0;
  await say('OPEN UP! WE KNOW THE FRANCHISE GIRL IS IN THERE!', 'GUARD');
  await say('THEY SAW WHAT THE SAVE DID. THEY THINK YOU DID IT. MAYBE YOU DID. I DON\'T THINK YOU MEANT TO.', 'THE ARCHIVIST');
  await say('THE BACK DOOR GOES INTO THE MINES. GO. I\'LL SEND SOMEONE AFTER YOU. HE FINDS THINGS. HE\'LL FIND YOU.', 'THE ARCHIVIST');
  await Y('...WHAT SHOULD I DO?');
  await say('THAT\'S THE FIRST THING ANYONE\'S ASKED YOU THAT YOU DON\'T HAVE TO DO. RUN.', 'THE ARCHIVIST');
  delete G.flags.noenc; delete G.flags.opening; obj('THE BACK DOOR (EAST WALL) LEADS INTO THE MINES. KEEP GOING EAST.', 'mines2', 16, 9);
  FIELD_LOCK--;
}
async function carlArrives() {
  FIELD_LOCK++;
  const gs = [addNpc({ who: 'guard', x: 19, y: 9, dir: 'l' }), addNpc({ who: 'guard', x: 13, y: 9, dir: 'r' })];
  await say('THERE SHE IS! SHE\'S TRAPPED!', 'GUARD');
  if (await battle('guards3') === 'lose') return gameOver(); await fadeIn(.1);
  await say('MORE OF THEM ARE COMING!', null);
  const c = addNpc({ who: 'carl', x: 16, y: 7, dir: 'd' }); await walk(c, 'd');
  await C('HEY. HI. HELLO. DON\'T PANIC. I\'M NOT A THIEF.');
  await C('I FIND THINGS. THAT\'S DIFFERENT. A THIEF TAKES THINGS. I JUST GET TO THEM FIRST. THE OLD MAN SAID TO FIND YOU.');
  await C('SO. YOU\'RE FOUND.');
  await Y('ARE YOU ASKING ME TO COME WITH YOU?');
  await C('NO. I\'M ASKING... OKAY, I\'M KIND OF ASKING. YOU DON\'T HAVE TO. IT\'S JUST THAT THE ALTERNATIVE IS THOSE GUYS.');
  await Y('...THEN I\'LL COME. BECAUSE I WANT TO. I THINK.');
  c.gone = 1; await join('carl', 4, { w: 'bong1', a: 'hoodie', h: 'cap' });
  if (await battle('guards4') === 'lose') return gameOver(); await fadeIn(.1);
  for (const g of gs) g.gone = 1;
  await C('THERE\'S A DRAFT AT THE EAST END. THERE\'S ALWAYS A WAY OUT. NOBODY LOOKS FOR IT. EVERYBODY LOOKS FOR THE WAY IN.');
  setFlag('carlJoined'); setFlag('escaped'); delete G.flags.partyLock;
  obj('FACE CASTLE IS SOUTH, THROUGH THE PASS, IN THE DESERT. THE KING THERE PLAYS BOTH SIDES. HE\'LL HIDE US. PROBABLY.', null, 46, 33);
  FIELD_LOCK--;
}
// ---------------- FACE CASTLE ----------------
async function castleArrive() {
  obj('THE KING IS ON THE THRONE. AT THE TOP OF THE HALL.', 'castle', 11, 5);
  await say('YOU\'RE TRAVELERS. YOU LOOK LIKE YOU\'VE BEEN SNOWED ON. THE KING SEES ANYONE WHO\'S BEEN SNOWED ON.', 'GUARD');
}
async function faceThrone() {
  if (flag('faceMet')) { await F('THE GUEST ROOM IS THE WEST DOOR. SLEEP. I\'LL HANDLE THE JESTER. I\'M VERY GOOD AT HANDLING PEOPLE. I DON\'T HAVE HANDS.'); return; }
  FIELD_LOCK++;
  await F('WELCOME TO FACE CASTLE. I\'M THE KING. I\'M ALSO THE CASTLE\'S CHIEF INVENTOR, ITS ONLY INVENTOR, AND THE REASON IT CAN GO UNDERGROUND.');
  await C('WHY DOES A CASTLE NEED TO GO UNDERGROUND?');
  await F('IT DOESN\'T. THAT\'S WHAT MAKES IT AN INVENTION. A NECESSITY IS JUST A CHORE.');
  await F('AND YOU MUST BE THE GIRL. THE ONE WHO USES MAGIC WITHOUT A LICENSE.');
  await Y('I DIDN\'T KNOW IT NEEDED ONE.');
  await F('IT DOESN\'T. THE FRANCHISE SAYS IT DOES. DO YOU KNOW WHAT A GIRL LIKE YOU IS WORTH? EVERYTHING.');
  await F('I\'M NOT SELLING YOU. I\'M SAYING YOU\'RE WORTH EVERYTHING. THOSE ARE DIFFERENT SENTENCES. I CHECKED.');
  await Y('WHY CAN I DO MAGIC?');
  await F('BECAUSE YOU HAVE POTENTIAL. EVERYONE HAS POTENTIAL. YOU HAVE IT IN A FORM THAT CATCHES FIRE.');
  sfx('tick'); await wait(10); sfx('tick'); await wait(10); sfx('tick');
  await say('A SOUND LIKE A MENU CURSOR MOVING. THREE TIMES.', null);
  const k = addNpc({ who: 'exec', x: 11, y: 18, dir: 'u', id: 'kursorNpc', draw: (n, x, y) => drawKursorField(x, y, n.dir) });
  await walk(k, 'uuuuuuuuuu');
  await K('SELECT. SELECT. SELECT. HEH HEH HEH HEH.');
  await K('YOUR MAJESTY! WHAT A HEAD YOU HAVE. ALL HEAD. NOTHING BELOW. I LOVE IT. IT\'S VERY EFFICIENT.');
  await F('KURSOR. THE FRANCHISOR\'S JESTER. TO WHAT DO I OWE THE INTERRUPTION?');
  await K('I\'M LOOKING FOR SOMETHING THAT BELONGS TO US. A LITTLE ASSISTANT. SHE WANDERED OFF. HAVE YOU SEEN HER? SHE SAYS "OF COURSE" A LOT.');
  await F('NEVER SEEN HER. WE DON\'T GET ASSISTANTS OUT HERE. WE BARELY GET MAIL.');
  await K('HEH. HEH HEH. DO YOU KNOW WHAT I AM, YOUR MAJESTY? I\'M A CURSOR. I CAN SEE THE WHOLE MENU. I KNOW WHICH OPTIONS ARE GRAYED OUT.');
  await K('AND I KNOW WHEN SOMEONE IS LYING, BECAUSE THEIR TEXT SCROLLS A LITTLE SLOWER.');
  await F('THAT\'S NOT A REAL THING.');
  await K('SELECT! HEH HEH. SLEEP WELL, YOUR MAJESTY. SLEEP WELL, EVERYONE. I\'LL BE RIGHT OUTSIDE. HIGHLIGHTING THINGS.');
  await walk(k, 'dddddddddd'); k.gone = 1;
  await F('...SO. YOU\'LL STAY THE NIGHT. THE GUEST ROOM IS THE WEST DOOR. I\'LL STAY UP. I DON\'T SLEEP. I\'M A HEAD.');
  setFlag('faceMet'); obj('SLEEP IN THE GUEST ROOM: THE WEST DOOR OFF THE GREAT HALL. CHECK THE BED.', 'castleguest', 1, 1);
  FIELD_LOCK--;
}
// Kursor on the field: a white cursor triangle in a jester's cap
const KURSOR_S = outline(spr(16, 26, g => { g.each((x, y) => { const dy = Math.abs(y - 13); return y > 3 && x >= 2 && x <= 2 + (10 - dy) * 1.3 && dy <= 9 ? 2 : 0; }); g.line(3, 4, 0, 0, 4); g.line(5, 4, 9, 0, 6); g.e(0, 0, 1, 1, 6); g.e(9, 0, 1, 1, 4); g.r(2, 3, 7, 2, 4); g.p(5, 11, 1); g.r(8, 9, 1, 5, 7); g.line(4, 16, 9, 17, 1); g.r(4, 22, 2, 3, 8); g.r(8, 22, 2, 3, 8); }), 1);
const KURSOR_P = pal('#000000', '#ffffff', '#dbdbdb', '#ff24db', '#920092', '#ffdb24', '#24dbff', '#242449');
function drawKursorField(x, y, d) { draw(KURSOR_S, x, y - 2 + ((frame >> 4) & 1), KURSOR_P, d === 'l'); }
async function castleNight() {
  FIELD_LOCK++; await fadeOut(.04); music('rest'); await wait(90);
  sfx('glitch'); post.tint = hex('#ff2400'); music('danger'); await fadeIn(.04);
  await say('FIRE! THE CASTLE IS ON FIRE!', 'GUARD');
  await goMap('castle', 11, 8, 'd');
  const k = addNpc({ who: 'exec', x: 11, y: 17, dir: 'u', draw: (n, x, y) => drawKursorField(x, y, n.dir) });
  await K('HEH HEH HEH! I HIGHLIGHTED THE CASTLE AND PRESSED A. I DIDN\'T EVEN READ WHAT THE OPTION WAS. IT WAS "BURN." PROBABLY.');
  await F('KURSOR!');
  await K('GIVE ME THE ASSISTANT AND I\'LL SELECT "CANCEL." CANCEL IS ALWAYS AN OPTION, YOUR MAJESTY. IT\'S AT THE BOTTOM.');
  await F('...YOU WANT HER? COME AND GET HER. I\'LL BE IN THE DESERT.');
  await F('EVERYONE! SUBMERGE THE CASTLE!');
  for (let i = 0; i < 60; i++) { post.shake = 3; if (i % 10 === 0) sfx('land'); await nextFrame(); } post.shake = 0;
  await K('...IT\'S GOING INTO THE GROUND. THE WHOLE CASTLE. WHY WOULD YOU INVENT THAT. WHY WOULD ANYONE INVENT THAT.');
  await fadeOut(.04); post.tint = null; k.gone = 1;
  await showCard(['FACE CASTLE SANK INTO THE SAND.', '', 'THE KING, THE GIRL AND THE NORMAL GUY', 'LEFT ON DESERT BUSES.'], 150);
  if (await battle('chase', { noFade: 0 }) === 'lose') return gameOver();
  setFlag('castleFire'); setFlag('faceJoined');
  await toWorld(46, 35);
  await F('THE CASTLE WILL COME BACK UP WHEN IT FEELS SAFE. IT\'S SHY. I BUILT IT SHY.');
  await F('I\'M COMING WITH YOU. FOR THE GIRL. AND FOR THE GIRL\'S POTENTIAL. MOSTLY THE GIRL.');
  await join('face', 6, { w: 'lance1', a: 'suit', h: 'cap' }); G.gadgets.push('drill', 'pitch');
  await F('THE RETURN IS ACROSS THE SEA, IN THE WESTERN MOUNTAINS. THE CAVE UNDER THE SOUTH RIDGE GOES THERE. MY BROTHER USED TO PLAY IN IT.');
  await C('YOU HAVE A BROTHER?');
  await F('I HAD ONE. HE LEFT TO LEARN WELDING FROM A HERMIT ON A MOUNTAIN. WE DON\'T TALK ABOUT IT. WE ALSO DON\'T TALK, GENERALLY. HE\'S VERY QUIET.');
  obj('THE CAVE IS IN THE SOUTH RIDGE, BELOW THE DESERT. THE RETURN IS ON THE OTHER SIDE.', null, 41, 40);
  FIELD_LOCK--;
}
// ---------------- MT. RERUN ----------------
async function protegeFight() {
  FIELD_LOCK++;
  const p = addNpc({ who: 'exec', x: 10, y: 1, dir: 'd', draw: (n, x, y) => draw(FOEART.get(FOES.protege.look), x - 10, y - 14, FOEART.get(FOES.protege.look).P) });
  await say('TRAVELERS. ON MY MASTER\'S MOUNTAIN. DO YOU KNOW WHAT HAPPENED ON THIS MOUNTAIN?', 'THE PROTEGE');
  await say('MY MASTER TAUGHT TWO STUDENTS. HE CHOSE THE OTHER ONE. THE ONE WHO LEFT A THRONE TO LEARN TO WELD. A KING. WHO NEEDED NOTHING. HE CHOSE HIM.', 'THE PROTEGE');
  await F('...');
  await say('SO NOW I KEEP THE MOUNTAIN. AND NOBODY GETS PAST WHO ISN\'T HIM.', 'THE PROTEGE');
  const r = await battle('protege'); FIELD_LOCK--;
  if (r === 'lose') return gameOver(); p.gone = 1; setFlag('oldfaceJoined'); await fadeIn(.1);
  await F('...BROTHER.');
  await OF('HELLO, ME.');
  await C('"ME"?');
  await F('WE\'RE BROTHERS. WE\'RE ALSO THE SAME PERSON. AN OLD VERSION AND A NEW VERSION. IT\'S COMPLICATED.');
  await OF('IT\'S NOT COMPLICATED. HE GOT AN UPDATE. I DIDN\'T WANT ONE.');
  await OF('THE FRANCHISE CAME FOR THE HERMIT. HE\'S GONE. LICENSED. I\'M COMING WITH YOU.');
  await Y('WHY?');
  await OF('BECAUSE THEY LICENSED SOMEONE I LIKED. THAT\'S ENOUGH OF A REASON. IT USUALLY IS.');
  obj('THE RETURN IS WEST OF HERE, IN THE MOUNTAINS.', null, 24, 60);
}
// ---------------- THE RETURN ----------------
async function curatorTalk() {
  if (flag('returnDone')) { await say('THE RIVER IS EAST OF THE CAVE. THE RAFT IS WAITING. GARFEILD IS ON THE FAR SHORE.', 'THE CURATOR'); return; }
  FIELD_LOCK++;
  await say('SO YOU\'RE YOKO. THE ASSISTANT. I\'M THE CURATOR. I RUN THE RETURN.', 'THE CURATOR');
  await say('THE FRANCHISE IS PULLING SAVE SPIRITS OUT OF THE OLD PLACES AND LICENSING THEM. EVERY SPIRIT THEY TAKE IS SOMEBODY\'S MEMORY THAT NOBODY OWNS ANYMORE.', 'THE CURATOR');
  await say('YOU USE MAGIC WITH NO LICENSE. NOBODY ELSE ALIVE CAN. THE SPIRITS MIGHT TALK TO YOU. WE NEED YOU.', 'THE CURATOR');
  await Y('IS THAT WHAT YOU WANT?');
  await say('IT\'S WHAT I WANT. I\'M ASKING WHAT YOU WANT.', 'THE CURATOR');
  await Y('...EVERYONE KEEPS ASKING ME THAT. I DON\'T KNOW HOW TO ANSWER IT. I ONLY KNOW HOW TO SAY YES.');
  const c = await ask('WILL YOU HELP THE RETURN?', 'THE CURATOR', ['YES.', 'I WANT TO.', 'OF COURSE.']);
  if (c === 2) await say('...DON\'T SAY IT LIKE THAT. SAY IT LIKE YOU MEAN IT. OR DON\'T SAY IT.', 'THE CURATOR');
  if (c === 1) { G.flags.yokoWant = (G.flags.yokoWant || 0) + 1; await say('THAT\'S DIFFERENT FROM YES. THAT\'S BETTER THAN YES.', 'THE CURATOR'); }
  await say('THEN HERE\'S THE PLAN. THE FRANCHISE IS MARCHING ON GARFEILD, THE DINER TOWN ACROSS THE RIVER. THE RIVER IS FAST. TAKE THE RAFT.', 'THE CURATOR');
  await C('I\'LL GO SOUTH. ALONE. I\'M GOING TO FIND A WAY INTO THE FRANCHISE\'S CITY. I\'M GOOD AT FINDING WAYS IN.');
  await C('I\'M BETTER AT FINDING WAYS OUT, BUT YOU HAVE TO GET IN FIRST. THAT\'S HOW IT WORKS.');
  await Y('WILL YOU COME BACK?');
  await C('I\'LL FIND YOU. THAT\'S KIND OF MY WHOLE THING.');
  G.party = G.party.filter(k => k !== 'carl'); setFlag('away_carl'); setFlag('returnDone');
  obj('THE RAFT IS ON THE RIVER, NORTHEAST OF HERE (WEST BANK).', null, 48, 50);
  FIELD_LOCK--;
}

// ---------------- bosses for part 1 ----------------
foe('cbguard', 'COLDBOOT GUARD', 2, LK('trooper', { weap: 'baton' }, ['#6d6d92', '#b6b6b6', '#49496d', '#ffdb49']), { steal: 'snack', drop: 'snack', moves: [[3, 'fight'], [1, MV('WHISTLE', { status: 'buffer', hit: 40 })]] });
foe('cbguard2', 'COLDBOOT GUARD', 4, LK('trooper', { weap: 'spear' }, ['#49496d', '#b6b6b6', '#242449', '#ffdb49']), { steal: 'antivirus', moves: [[3, 'fight'], [1, MV('JAB', { pow: 1.5 })]] });
form('guards1', ['cbguard', 'hound', 'cbguard'], { bg: 'snow', noRun: 1 });
form('guards2', ['cbguard', 'cbguard', 'hound', 'hound'], { bg: 'snow', noRun: 1 });
form('guards3', ['cbguard'], { bg: 'mine', noRun: 1 });
form('guards4', ['cbguard2', 'cbguard2'], { bg: 'mine', noRun: 1 });
form('minesG0', ['cbguard', 'cbguard'], { bg: 'mine' }); form('minesG1', ['cbguard2', 'cablerat'], { bg: 'mine' });
// THE HOLD MUSIC: a whelk on permanent hold. Hit it while it's in the shell and it puts everyone on hold.
const snailDraw = (g) => {
  for (let r = 22; r > 2; r -= 1) g.e(30 + (22 - r) * .3, 24 + (22 - r) * .2, r, r * .9, r % 4 < 2 ? 2 : 3);
  for (let a = 0; a < 18; a += .08) { const r = 2 + a * 1.1; g.p(32 + Math.cos(a) * r, 26 + Math.sin(a) * r * .9, 5); }
  g.e(58, 38, 16, 8, 6); g.e(70, 30, 7, 9, 6); g.line(68, 22, 66, 12, 7); g.line(72, 22, 76, 12, 7); g.e(66, 11, 2, 2, 11); g.e(76, 11, 2, 2, 11);
  g.r(74, 28, 8, 3, 13); g.r(80, 26, 3, 7, 13); g.e(73, 34, 3, 1.5, 13);
};
foe('holdmusic', 'THE HOLD MUSIC', 4, { kit: 'snail', draw: snailDraw, size: [90, 50], c: ['#b6926d', '#ff92b6', '#ffdb49', '#24dbff'] }, { boss: 1, hp: 6.5, atk: 1.2, xp: 4, gp: 3, ap: 6, weak: ['hot'],
  extra: { onHurt: (u) => { if (u.v.shell && !u.v.countering) { u.v.countering = 1; B.actQ.unshift({ actor: u, kind: 'enemy', force: 1, targets: targetsP(), move: MV('YOUR CALL IS IMPORTANT TO US', { sp: 30, elem: 'zap', tgt: 'all', split: 1 }), done: () => { u.v.countering = 0; } }); } } },
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.v.t % 3 === 0) { u.v.shell = !u.v.shell; return { move: MV(u.v.shell ? 'PLEASE HOLD' : 'THANK YOU FOR HOLDING', { run: async () => { bmsg(u.v.shell ? 'IT WENT INTO ITS SHELL. (DON\'T HIT THE SHELL.)' : 'IT CAME OUT OF ITS SHELL.', 120); } }), targets: [u] }; } return u.v.shell ? { move: MV('SMOOTH JAZZ', { status: 'sleep', hit: 30 }) } : pickOne([{ kind: 'fight' }, MV('RINGTONE', { sp: 20, elem: 'zap' })]); } });
FOES.holdmusic.look.draw = snailDraw;
form('holdmusic', ['holdmusic'], { at: [['holdmusic', 30, 40]], bg: 'mine', boss: 1, noRun: 1 });
// the desert-bus chase: two upsell units
foe('upsellX', 'UPSELL UNIT', 7, LK('machine', { arm: 1, mean: 1 }, ['#db2492', '#ffdb24', '#6d6d6d', '#ff2424']), { hp: 2, weak: ['zap'], xp: 2, steal: 'battery', moves: [[2, 'fight'], [1, MV('UPSELL BEAM', { sp: 24, elem: 'hot' })], [1, MV('EXTENDED WARRANTY', { tgt: 'self', run: async (u) => { u.hp = Math.min(u.mhp, u.hp + 120); pop(u, 120, BCOL.heal); } })]] });
form('chase', ['upsellX', 'upsellX'], { bg: 'desert', boss: 1, noRun: 1 });
// THE PROTEGE (the hermit's other student) and his two idea guys. Old Face finishes it with a WELD.
const protegeDraw = g => { g.r(16, 36, 8, 20, 3); g.r(26, 36, 8, 20, 2); g.e(25, 26, 14, 14, 2); g.e(25, 10, 9, 9, 4); g.r(18, 8, 14, 3, 13); g.r(20, 13, 10, 2, 13); g.r(8, 20, 8, 14, 2); g.r(34, 18, 8, 16, 2); g.e(42, 18, 5, 5, 4); g.e(8, 34, 5, 5, 4); g.r(16, 30, 18, 3, 6); };
foe('protege', 'THE PROTEGE', 10, { kit: 'prot', draw: protegeDraw, size: [52, 60], c: ['#b66d49', '#db2424', '#242424', '#ffffff'] }, { boss: 1, hp: 6, atk: 1.1, xp: 6, ap: 10,
  extra: {
    guard: (u) => flag('oldfaceJoined') && B.curKind !== 'weld' ? (u.hp < u.mhp * .2 ? 0 : 1) : 1,
    onHurt: (u) => { if (!u.v.called && u.hp < u.mhp * .55) { u.v.called = 1; B.actQ.unshift({ actor: u, kind: 'enemy', force: 1, targets: [u], move: MV(null, { run: async () => oldFaceArrives() }) }); } },
  },
  ai: u => pickOne([{ kind: 'fight' }, { kind: 'fight' }, MV('GALE CUT', { pow: 1.3, tgt: 'all', split: 1 }), MV('DOUBLE KICK', { pow: 1.8 })]) });
foe('ideaguy', 'IDEA GUY', 8, LK('trooper', { weap: 'baton' }, ['#ffdb49', '#ffffff', '#6d4924', '#242424']), { hp: 1.4, moves: [[2, 'fight'], [1, MV('BRAINSTORM', { sp: 16, elem: 'zap' })]] });
form('protege', ['ideaguy', 'protege', 'ideaguy'], { at: [['ideaguy', 20, 20], ['protege', 70, 40], ['ideaguy', 20, 90]], bg: 'desert', boss: 1, noRun: 1 });
async function oldFaceArrives() {
  B.acting++;
  await say('ENOUGH.', 'OLD FACE');
  const r = addHero('oldface', 9, { w: 'torch1', a: 'suit', h: 'hardhat' }); setFlag('oldfaceJoined');
  if (B.party.length < 4) { const u = mkHeroUnit(r, B.party.length); u.atb = 900; B.party.push(u); }
  await say('A KING WITH NOTHING BELOW THE NECK, CLIMBING MY MASTER\'S MOUNTAIN. AND MY OLD FRIEND, STILL ANGRY.', 'OLD FACE');
  await say('WELDING ISN\'T HITTING THINGS. IT\'S JOINING THEM. I\'LL SHOW YOU. LEFT. RIGHT. LEFT.', 'OLD FACE');
  bmsg('OLD FACE: CHOOSE WELD, THEN PRESS < > < IN TIME.', 200);
  B.acting--;
}
