'use strict';
// ================= CARL 2: story. episode 1 (PILOT) + the shared bits every episode uses =================
const HOC = 'HEAD OF CONTENT', FG = 'FOCUS GROUP', LG = 'LEGAL', DP = 'DISPATCH', LI = 'CEO LINDA', GF = 'JB GARFIELD', BR = 'BRUCE', HU = 'HU-MAN';
const nth2 = (k, arr) => { const n = (C2.flags['n_' + k] || 0); C2.flags['n_' + k] = n + 1; return arr[Math.min(n, arr.length - 1)]; };

// ---------------- the season 2 tapes ----------------
const TAPES2 = [
  ['SPACE 219', [['219. The little green guy\'s back. Different colors. Same guy.', 'ATTENDANT'], ['There\'s a space next to it now. 220. Nobody parks in 220.', 'ATTENDANT'], ['It\'s reserved. The sign says: FAMILY.', 'ATTENDANT']]],
  ['FOCUS GROUP', [['TOO GREEN.', FG], ['TOO SHORT. TOO NERVOUS. WHAT IS HE.', FG], ['What if he was... a human?', HOC], ['...YES.', FG]]],
  ['GARF 2', [['Carl came back in color. Said it wasn\'t his fault. It wasn\'t. I checked.', GF], ['Still threw a bong at a Linda. That part didn\'t need a sequel.', GF], ['...Good to see him. Don\'t tell him I said that.', GF]]],
  ['HOUR 9', [['Hour nine. There\'s no hour nine. They added one.', 'CARL'], ['Chat\'s still here. Chat\'s always here.', 'CARL'], ['If I get my name back I\'m telling you guys first. ...Second. I\'ll tell you second.', 'CARL']]],
  ['BRUCE', [['Every show jumps me eventually. They get big, they get tired, they get a jacket.', BR], ['Then they jump me, and everybody says it\'s over.', BR], ['It\'s not over. It\'s just different. Nobody asks the shark.', BR]]],
  ['PILOT (UNAIRED)', [['PILOT. TAKE ONE.', DP], ['Is it on? Is this on. Hi. I\'m a regular guy. I drive a bus. For eight hours.', 'CARL'], ['...WE\'LL FIX IT IN THE SEQUEL.', DP]]],
  ['THE BLANKET', [['My mother sang a song about a blanket. It was red.', 'COMRADE CARL'], ['I asked her once what my name was for. She said: so you\'d come when we called.', 'COMRADE CARL'], ['Tell him that. The other me. He should have it.', 'COMRADE CARL']]],
  ['CELL 00 (B-SIDE)', [['(A small voice. Very close to the microphone.)'], ['They came to the glass again. The two tall ones.', 'VOICE'], ['They said the word again. Slower. So I\'d keep it.', 'VOICE'], ['I\'m keeping it. I\'m—', 'VOICE'], ['(The tape ends.)']]],
];
async function tapeAt(i, line) {
  if (C2.tapes.includes(i)) return;
  if (line) await C(line, 's');
  C2.tapes.push(i); sfx('get'); addHuman(-3, 'tape'); DBG.tapes = C2.tapes.length;
  await say('CARL FOUND TAPE: "' + TAPES2[i][0] + '"! (' + C2.tapes.length + '/8)');
  if (C2.tapes.length === 1) await say('Tapes play from the START menu. Listening to them keeps Carl himself. (HUMAN -3%)');
  if (C2.tapes.length === 8) { sfx('static'); await C('That\'s all of them. Chat. That\'s all of them. Something\'s different. I can feel it in my... everything.', 's'); }
  const e = WD.ents.find(o => o.talk && o.spr === CS.tape && Math.hypot(o.x - PL.x, o.y - PL.y) < 40); if (e) e.gone = 1;
}
async function playTape2(i) { sfx('static'); await wait(20); await say('TAPE: ' + TAPES2[i][0]); for (const [l, who] of TAPES2[i][1]) await say(l, who); sfx('static'); }
async function tapeMenu2() {
  if (!C2.tapes.length) return C('No tapes. There\'s a tape deck in my pocket. It came with the pocket.');
  const L = C2.tapes.slice().sort((a, b) => a - b); const i = await choose(L.map(n => (n + 1) + ' ' + TAPES2[n][0]), { x: 8, y: 26, cancel: 1 });
  if (i >= 0) await playTape2(L[i]);
}

// ---------------- episode furniture ----------------
async function epCard(n, title, noteText) {
  const pv = scene; music(null); post.fade = 0;
  scene = { draw() { cls(BLACK); } };
  sfx('crowd');
  await showCard(['CARL 2', '', 'EPISODE ' + n, '', title], 170, { bg: hex('#10002a'), fg: hex('#ffdb49') });
  if (noteText) { await showCard(['NOTE FROM THE COMMITTEE:', '', ...wrapT(noteText.toUpperCase(), 40)], 190, { bg: hex('#ffdb6d'), fg: hex('#492410') }); }
  scene = pv;
}
async function epEnd(n, next) {
  music(null); await wait(20); sfx('crowd'); laugh('[APPLAUSE]'); await wait(50);
  await fadeOut(.06); const pv = scene; scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['END OF EPISODE ' + n], 120, { bg: hex('#10002a'), fg: WHITE });
  if (next) await showCard(['NEXT TIME ON CARL 2:', '', next], 150, { bg: hex('#10002a'), fg: hex('#ffdb49') });
  scene = pv; post.fade = 1; saveC2(); await fadeIn(.06);
  await say('(GAME SAVED.)');
}

// ---------------- the A.S.S. ----------------
async function enterShip() {
  if (F2('repo') && !F2('ship')) return say(nth2('boot', ['THE A.S.S. HAS A BOOT ON IT. A LEGAL BOOT. IT\'S MADE OF PAPER.', 'THE BOOT SAYS: "PROPERTY OF THE SEQUEL. PAGE 219."']));
  C2.shipAt = WD.id; await goMap('ship', 7, 8, 'u');
}
async function saveBox() { saveC2(); sfx('ok'); await say(F2('special') ? 'SAVED.' : 'SAVED. THE SAVE BOX SAYS "THANK YOU FOR SAVING WITH PRETEND CO."'); if (C2.hp < C2.maxhp) { C2.hp = C2.maxhp; await say('CARL RESTS ON THE BEANBAG FOR A SECOND. COMPOSURE RESTORED.'); } }
async function navConsole() {
  const dests = [['THE LOT', 'lot'], ['GARF\'S DINER', 'desert'], ['LAKE MEAD', 'lake'], ['PRETEND CO. BACKLOT', 'backlot'], ['THE RED MOON', 'moon']].filter(([, m]) => C2.visited[m] || (m === 'backlot' && C2.ep >= 4) || (m === 'moon' && F2('moonOpen')));
  const opts = dests.map(d => d[0]).concat(['STAY']);
  const i = await choose(opts, { x: 8, y: 30, cancel: 1 });
  if (i < 0 || i >= dests.length) return;
  const to = dests[i][1];
  if (to === 'moon' && !F2('moonVisited')) return spaceRun();
  if (to === C2.shipAt) return say('WE\'RE ALREADY HERE. THE A.S.S. KNOWS. IT DOESN\'T SAY ANYTHING. IT KNOWS.');
  sfx('power'); for (let i = 0; i < 40; i++) { post.flash = (i & 4) ? .25 : 0; WD.shake = 2; await nextFrame(); } post.flash = 0;
  C2.shipAt = to; await say(pick(['THE A.S.S. TAKES OFF. IT LANDS. THAT\'S THE WHOLE TRIP.', 'FLIGHT TIME: NOT EIGHT HOURS. THANK GOD.', 'THE A.S.S. ARRIVES. NOBODY MAKES THE JOKE. EVERYBODY THINKS IT.']));
  MAPS2.ship.init();
}
async function busStop() {
  if (C2.ep < 1 || !F2('repo')) return say(nth2('bus', ['BUS STOP. NEXT BUS: 8 HOURS. (9?)', 'Eight hours. I did eight hours once. Never again. I\'d do it again.']));
  if (!F2('raced')) return startEp2();
  const i = await ask('RIDE THE BUS TO GARF\'S DINER? (8 HOURS. THEY SKIP THEM NOW.)', null, ['RIDE', 'NO']);
  if (i !== 0) return;
  await fadeOut(.08); const pv = scene; scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['8 HOURS LATER.'], 90); scene = pv; post.fade = 1; loadMap('desert', 12, 20, 'd'); await fadeIn(.08);
}

// ---------------- the lot ----------------
async function billboardTalk() {
  await C(nth2('bill', ['"HU-MAN. HE\'S HUMAN." ...That\'s my hat. That\'s MY hat, on a guy.', 'He has a chin. Why does he have a chin. Chat, do I have a chin? Don\'t answer that.', 'He\'s smiling like he\'s never lost a parcel. Everybody loses parcels.']), 'a');
  if (!F2('billLaugh')) { setF2('billLaugh'); laugh(); }
}
async function attendantTalk() {
  const A = 'ATTENDANT';
  await say(nth2('att', ['Welcome back. Space 219. It\'s still yours. Nobody else can see it.', 'People only see 219 when things get wavy. You know what I mean. You do the wavy thing.', 'Two tall folks came through last week. Asked about 219. I said he\'s around. They said: we know.']), A);
  if ((C2.flags.n_att || 0) === 1) await C('The wavy thing. Smoke. Okay. I\'ll... chat, did he just tell me to smoke? At work?', 'w');
}
async function fanTalk() {
  const K = 'FAN';
  if (dq(4) === 1 && !F2('hasLetter')) { await say('Can you give this to Spooky Ghost? It\'s fan mail. I spelled everything right except one word.', K); setF2('hasLetter'); sfx('get'); await say('CARL GOT: FAN MAIL.'); return; }
  await say(nth2('fan', ['Are you HU-MAN? ...No. You\'re the old one. My brother had the old one.', 'Can you say the thing? The HU-MAN thing? "I HAVE THE POWER"?', 'The old one was better. Don\'t tell my brother.']), K);
  if ((C2.flags.n_fan || 0) === 2) await C('I don\'t have a thing. I have a lot of things. None of them are a catchphrase.', 'a');
}

// ---------------- the mall ----------------
async function lindaScreenTalk() {
  if (dq(2) === 1) { await C('Delivery. From Garf\'s Diner. It\'s his tab.', 'n'); await say('Garfield hasn\'t paid since 1998. ...Fine. Paid. With interest. The interest is you leaving.', LI); dqDone(2); C2.bux += 60; return; }
  if (C2.ep <= 1 && !F2('ep1done')) {
    await say(nth2('lscr', ['CARL. YOU ARE BANNED FROM THE SEQUEL.', 'THE TITLE IS UNDER REVIEW.', 'I CAN SEE YOU. I CAN ALWAYS SEE YOU. IT\'S A SCREEN. IT GOES BOTH WAYS.']), LI);
    await C(nth2('lscr2', ['I\'m IN the sequel. I\'m the guy. It\'s called CARL 2. There\'s a 2. Next to my name. Which isn\'t my name.', 'Under review by WHO.', 'Great. Great. Love that for me.']), 'a');
  } else await say(pick(['YOU BROKE MY COP.', 'THE SEQUEL IS PERFORMING. I HATE THAT IT\'S PERFORMING.', 'STAY OUT OF SUITORS.', 'I LICENSED YOUR FACE. THE ROYALTIES ARE ZERO. YOU\'RE WELCOME.']), LI);
}
async function mallCopDoor() {
  const MC = 'MALL COP';
  if (!F2('copArgued')) {
    await say('Hold it. Sequel Center\'s by appointment only. You got an appointment, little guy?', MC);
    await C('Little— I\'m regular size. I\'m a regular sized human with a delivery. Move.', 'a');
    const won = await argue2({ name: 'MALL COP', port: 'MALL COP', hp: 20, power: 3, weak: { GRIEVANCE: 2, DENIAL: .5 }, bg: ['#243670', '#000010'],
      intro: 'THE MALL COP WANTS TO ARGUE!', atk: ['Sir. Sir. SIR.', 'Behind the rope, sir.', 'I don\'t make the rules. I enforce them. I also make some of them.', 'Is that a bong in your hoodie or— it\'s a bong.'],
      low: ['Okay, that\'s— okay.', 'I\'m calling my supervisor. My supervisor is also me.'], react: { DENIAL: 'Sir, you are green.' },
      win: 'Fine! FINE. You win. You still need an appointment though.', lose: 'Behind the rope, sir.' });
    setF2('copArgued');
    if (!won) await say('Look. Nobody\'s ever had an appointment. Try Lost and Found. Everything ends up there eventually.', MC);
    else await say('...Try Lost and Found. Everything ends up there eventually. Including appointments. Including me, one day.', MC);
    setObj('Find an appointment. Try Lost+Found.', 'lostfound', 6, 5);
    return;
  }
  await say(F2('appointment') ? 'An appointment. A real one. From 1998. ...Go on in. I don\'t get paid enough to question 1998.' : 'Appointment. Lost and Found. I believe in you, which I\'m told is not my job.', MC);
}
async function sequelDoorNo() { await say('THE DOOR SAYS: "APPOINTMENT REQUIRED." IT SAYS IT OUT LOUD. DOORS SHOULDN\'T HAVE VOICES.'); if (!F2('copArgued')) setObj('Talk to the mall cop by the Sequel Center', 'mall', 16, 5); }
async function pretzelStand() {
  const W2 = 'PRETZELS';
  const i = await ask(C2.pretzels >= 5 ? 'YOU HAVE FIVE PRETZELS. THAT\'S THE LEGAL LIMIT. (IT ISN\'T. WE JUST SAY IT.)' : 'PRETZELS! FREE IF YOU NEVER LEAVE. $5 IF YOU DO. (YOU HAVE ' + C2.pretzels + '.)', W2, C2.pretzels >= 5 ? ['OK'] : ['BUY ONE ($5)', 'NO']);
  if (C2.pretzels >= 5 || i !== 0) return;
  if (C2.bux < 5) return say('You have $' + C2.bux + '. That\'s not five. I checked twice.', W2);
  C2.bux -= 5; C2.pretzels++; sfx('get'); await say('ONE PRETZEL. STILL WARM. THEY\'RE ALWAYS WARM. DON\'T ASK.', W2);
}
async function photoBooth2() {
  if (await ask('PHOTO BOOTH. 4 POSES. FREE.', null, ['SMILE', 'NO']) !== 0) return;
  const n = (F2('photo') || 0) + 1; setF2('photo', n);
  for (let i = 0; i < 4; i++) { sfx('tick'); post.flash = .9; await wait(4); post.flash = 0; await wait(24); }
  const pv = scene;
  scene = { draw() { pv.draw(); rectF(122, 8, 76, 208, hex('#f0f0f0')); for (let i = 0; i < 4; i++) { const y = 12 + i * 51; rectF(126, y, 68, 48, hex('#6d49b6')); if (i >= 4 - Math.min(n, 3)) { for (const dx of [-12, 12]) rectF(152 + dx, y + 2, 10, 38, hex('#101018')); rectF(150, y + 8, 3, 3, hex('#ffffff')); } draw(CS.carl.d[0], 152, y + 22, CP.carl); } } };
  await waitBtn(); scene = pv;
  await C(n === 1 ? 'Who\'s that. Who\'s THAT. There\'s two. There were never two. Chat, there\'s TWO of them now.' : 'They\'re tall. They\'re closer every time. I\'m not scared. It\'s not a scared feeling. It\'s a different feeling.', 'w');
  if (n === 1) addHuman(-2, 'photo');
}
async function shopperTalk() {
  await say(nth2('shop', ['Aren\'t you the guy from the billboard? ...No. The billboard guy is taller. And human.', 'I liked the old you. You were in green. It was soothing.', 'They\'re making a HU-MAN lunchbox. My kid wants one. I told him he\'s a Carl kid.']), 'SHOPPER');
}
async function bongShop() {
  const BC = 'BONG CLERK';
  if (!F2('shopIntro')) { setF2('shopIntro'); await say('Welcome to the Bong Emporium. We have the big one. We do not have the big one. Legally I have to say we have it.', BC); await C('You don\'t have it?', 'w'); await say('Somebody keeps borrowing it. Little guy. Throws it at a Linda. We get it back. It\'s a whole cycle.', BC); }
  const stock = F2('stock_ep' + C2.ep) || (setF2('stock_ep' + C2.ep, [0, 1, 2].map(() => genBong(C2.ep + 1))), F2('stock_ep' + C2.ep));
  for (;;) {
    const opts = stock.map(b => b.sold ? '-SOLD-' : '$' + bongPrice(b) + ' ' + b.name.slice(0, 26)).concat(['SELL MY BONGS', 'LEAVE']);
    const i = await choose(opts, { x: 8, y: 20, cancel: 1 });
    if (i < 0 || i === opts.length - 1) return say(pick(['Come back when you\'ve broken something.', 'Stay hydrated. Through the bong. That\'s a joke. Don\'t do that.']), BC);
    if (i === opts.length - 2) { await bongMenu(true); continue; }
    const b = stock[i]; if (b.sold) continue;
    await say(b.name + '. ' + bongStats(b).join(', ') + '. ' + bongInfo(b));
    if (await ask('BUY FOR $' + bongPrice(b) + '? (YOU HAVE $' + C2.bux + ')', null, ['BUY', 'NO']) !== 0) continue;
    if (C2.bux < bongPrice(b)) { await say('You\'re short. Financially. I\'m not being rude. It\'s the other thing.', BC); continue; }
    if (C2.bongs.length >= 8) { await say('You\'re carrying eight. Eight\'s the limit. Sell one. Or smash one. We don\'t judge. We sweep.', BC); continue; }
    C2.bux -= bongPrice(b); b.sold = 1; giveBong(makeBong(b.size, b.mat, b.mods, b.lvl, b.name), 1); sfx('get'); await say('SOLD. IT\'S YOURS. EQUIP IT FROM THE START MENU. OR DON\'T. I\'M A CLERK, NOT A COP.', BC);
  }
}
const bongPrice = b => Math.round(12 + b.dmg * 5 + b.mods.length * 14 + (b.rar === 'EXTREME' ? 30 : 0));
async function bigOneCase() {
  if (F2('bigone')) return C('THE BIG ONE. The original. There\'s only one. They keep replacing it. It\'s this one. It was always this one.', 's');
  await say('A DISPLAY CASE. EMPTY. THE LABEL SAYS: "THE BIG ONE. ON LOAN TO: LOST+FOUND."');
}
async function lostFoundTalk() {
  const LF = 'LOST+FOUND';
  if (C2.ep <= 1 && !F2('appointment')) {
    await say(nth2('lf', ['Lost and found. You lose it, we find it. You find it, we lose it.', 'Welcome back. We\'ve got fourteen umbrellas. One face. It\'s not yours. It might be yours.']), LF);
    if (!F2('copArgued')) return;
    await C('I need an appointment. For the Sequel Center. The cop said everything ends up here.', 'n');
    await say('We have ONE appointment. Unclaimed. Since 1998.', LF);
    await say('Also, two tall... people. They were here. They left. Again.', LF);
    await C('...Again?', 'w');
    await say('They asked if anyone small came by. I said you usually come by on Thursdays.', LF);
    await C('What day is it.', 'w'); await say('Tuesday.', LF); laugh();
    await C('...Thursday is the Tuesday of Thursdays. Give me the appointment.', 's');
    setF2('appointment'); sfx('get'); await say('CARL GOT AN APPOINTMENT! IT SAYS: "1998. 2:19 PM. SEQUEL CENTER. BRING: YOURSELF."');
    setObj('Go to the Sequel Center', 'sequel', 10, 5); return;
  }
  if (dq(1) === 1 && !F2('hasFace')) { await say('One face. For a delivery? Sure. Nobody\'s claimed it. It\'s been here since 1998. It\'s warm.', LF); setF2('hasFace'); sfx('get'); return say('CARL GOT: ONE FACE.'); }
  if (F2('special') || C2.ep >= 6) return lostFoundSpecial();
  await say(pick(['Still no word from the tall ones. Or lots of word. None of it to me.', 'You lose it, we find it. We found a shark tooth yesterday. Huge. Somebody jumped something.', 'The back room is employees only. You\'re not an employee. You\'re something else.']), LF);
}

// ---------------- the Sequel Center: episode 1's end ----------------
async function committeeTalk() {
  if (F2('met')) return say(pick(['THE PARCEL IS IN CONTENT REVIEW.', 'WE ARE VERY EXCITED ABOUT THE DIRECTION.', 'PLEASE STOP TOUCHING THE POSTER.']), HOC);
  setF2('met'); setObj(null);
  await say('Carl. Welcome to the sequel.', HOC);
  await C('Where\'s my parcel. The one to below below. The sender is... it says [[[[[.', 'n');
  await say('Content review. You\'ll receive it at the end of the season.', HOC);
  await C('The season. How long is a season.', 'w');
  await say('Seven episodes. Depending on ratings.', HOC);
  await say('TOO GREEN.', FG); await say('TOO SHORT.', FG); await say('WHY IS HE SO NERVOUS.', FG);
  await C('I\'m not nervous! This is my regular face. I\'m standing in a room with a man in a hazmat suit and a pile of paper that TALKS.', 'a');
  await say('Everything said in this room is canon unless LEGAL says it isn\'t. LEGAL says it isn\'t.', LG);
  laugh();
  await say('Carl. The focus groups love you. They just want you... more relatable.', HOC);
  await say('Meet HU-MAN.', HOC);
  await C('That\'s the billboard guy. He\'s wearing my hat.', 'a');
  await say('He\'s you. But human.', HOC);
  await CL('I AM human. I\'m a regular human. I\'m— look at me. Don\'t look at me. Take my word.', null, 'w');
  await say('Great. Be more of that.', HOC);
  await say('We\'re giving you the POWER BONG. Hit things. When you\'re full of it, hold it up and become HU-MAN. Kids love it.', HOC);
  const c = await ask('TAKE THE POWER BONG?', null, ['TAKE IT', 'NO THANKS']);
  if (c === 0) { await C('...It\'s shiny. Why is it shiny. Okay. Fine. I\'m holding it. Holding it isn\'t using it.', 'w'); }
  else { await C('No thanks. I have a bong. I have a lot of bongs. None of them turn me into a guy.', 'a'); await say('It\'s in your contract. Page 219.', LG); await C('I didn\'t sign a— which page?', 'w'); addHuman(-5, 'refused'); }
  setF2('power'); sfx('power'); banner('GOT: THE POWER BONG. HIT THINGS TO FILL IT. HOLD C WHEN FULL.', 200);
  await C('Okay. Now give me the parcel.', 'a');
  await say('Security.', HOC);
}
async function roboMallCop() {
  music(null); sfx('glitch'); WD.shake = 20; await wait(30);
  for (const id of ['hoc', 'focusgrp', 'legal']) { const e = ent(id); if (e) e.gone = 1; }
  const boss = addEnt({ id: 'robo', kind: 'boss', boss: 1, x: 11 * 16, y: 6 * 16, hp: 70, maxhp: 70, spr: CS.robo, P: CP.robo, anim: 12, hw: 14, hh: 6, box: [30, 36], hitY: 22, name: 'ROBO MALL COP', upd: roboUpd, onDie: () => {} });
  WD.bossE = boss; music('boss');
  await say('ROBO MALL COP HAS ENTERED THE SEQUEL!');
  await say('CITATION: UNLICENSED CARL. CITATION: BONG, OPEN CONTAINER. CITATION: GREEN.', 'ROBO MALL COP');
  await C('They made the mall cop a ROBOT. Why is everything a robot now. Chat, is this what sequels are?', 'a');
}
function roboUpd(e) {
  if (e.dead) return;
  e.phase = e.hp < e.maxhp / 2 ? 2 : 1; const sp = e.phase === 2 ? 1.4 : 1;
  e.st = e.st || 'roam'; e.tt = (e.tt || 0) + 1;
  if (e.st === 'roam') { const a = Math.atan2(PL.y - e.y, PL.x - e.x); moveBox(e, Math.cos(a) * .55 * sp, Math.sin(a) * .35 * sp, 14, 6); e.flip = PL.x < e.x;
    if (e.tt % 100 === 0) { for (let i = -2; i <= 2; i++) { const a2 = Math.atan2(PL.y - e.y, PL.x - e.x) + i * .22; WD.eshots.push({ x: e.x, y: e.y - 20, vx: Math.cos(a2) * 1.8, vy: Math.sin(a2) * 1.8, k: 'note', dmg: 2, t: 0 }); } sfx('blip', [300, 30]); }
    if (e.tt > 200) { e.st = 'wind'; e.tt = 0; e.cx = Math.sign(PL.x - e.x) || 1; e.cy = (PL.y - e.y) / 60; } }
  else if (e.st === 'wind') { e.fl = e.tt & 4 ? 2 : 0; if (e.tt > 40) { e.st = 'charge'; e.tt = 0; sfx('power'); } }
  else if (e.st === 'charge') { const m = moveBox(e, e.cx * 3.2 * sp, e.cy * sp, 14, 6); if (m.hitX || e.tt > 70) { e.st = 'roam'; e.tt = 0; WD.shake = 8; if (m.hitX) { e.stunT = 50; } } }
  if (e.phase === 2 && !e.called) { e.called = 1; wstory(async () => { await say('BACKUP REQUESTED. BACKUP IS ALSO ME.', 'ROBO MALL COP'); spawnEnemy('cop', 4 * 16, 8 * 16); spawnEnemy('cop', 17 * 16, 8 * 16); }); }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 20) hurtPlayer(3 + (e.st === 'charge' ? 2 : 0), e.x, e.y);
}
async function roboDown() {
  music(null); WD.shake = 20;
  for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('CITATION... WITHDRAWN... HAVE A... NICE... SEQUEL...', 'ROBO MALL COP');
  await C('I broke the mall cop. Again. It\'s a different mall cop. It\'s the same mall cop. I don\'t know.', 'w');
  await wait(30); sfx('glitch');
  const scr = addEnt({ id: 'lscreen', tx: 10, ty: 2, draw: e => drawLindaScreen(e), solid: 0 });
  await say('You broke my cop.', LI);
  await C('He was a robot! He had a SEGWAY! He gave me a citation for being GREEN!', 'a');
  await say('I own your likeness now, Carl. Every HU-MAN lunchbox. Every figure. Licensed. Humans can be licensed.', LI);
  let won = false;
  while (!won) {
    won = await argue2({ name: 'CEO LINDA', port: 'CEO LINDA', hp: 42, power: 4, weak: { GRIEVANCE: 2, DENIAL: 0, LOGIC: .7 }, bg: ['#6d2449', '#100010'], chatBoost: 1,
      intro: 'CEO LINDA OPENS A SPREADSHEET. ALL OF IT.', atk: ['That\'s a franchise opportunity.', 'Your face tested well in the 18 to 34s. Your personality did not.', 'I\'m not arguing. I\'m negotiating. You\'re losing a negotiation.', 'Sign here. And here. And here. That one\'s your soul. Initial it.'],
      low: ['This is not a productive meeting.', 'I will be billing you for this argument.'], react: { DENIAL: 'Exactly. Humans can be licensed. Thank you for confirming.', GRIEVANCE: '...Did you just make me feel something? Invoice.' },
      carl: { GRIEVANCE: ['You put me on a LUNCHBOX. I don\'t even get lunch.', 'That\'s my face. My face is not a franchise. It\'s a face.', 'You banned me from my own sequel!'] },
      win: 'Fine. FINE. The parcel was forwarded. Garf\'s Diner. Out in the desert. Take the bus. You love the bus.', lose: 'Let\'s circle back.' });
    if (!won) { await C('Okay. Okay. Breathe. Again. She\'s just a lady on a screen. A lady on every screen.', 'w'); }
  }
  scr.gone = 1;
  await say('One more thing.', LG);
  await say('The A.S.S. is a licensed vehicle now. It has been repossessed.', LG);
  await C('You can\'t repossess my A.S.S.', 'a'); laugh();
  await say('Page 219.', LG);
  await C('What IS on page 219!', 'a');
  await say('(It\'s blank. Page 219 is blank. They just like saying it.)');
  setF2('repo'); setF2('ep1done');
  setObj('Take the bus to Garf\'s Diner (bus stop, east end of the lot)', 'lot', 37, 10);
  await epEnd(1, 'DESERT BUS TURBO');
}

// ---------------- Dispatch: the radio in the A.S.S. ----------------
async function dispatchRadio() {
  if (!F2('dispatch1')) {
    setF2('dispatch1'); sfx('static');
    await say('PROP PILLS DISPATCH. ONE DELIVERY. PICKUP: THE SEQUEL CENTER, MALL OF THE FUTURE.', DP);
    await say('DESTINATION: BELOW BELOW.', DP);
    await C('Below below. That\'s— chat. That\'s where the voice said. At the end. Last time.', 'w');
    await say('SENDER: [[[[[.', DP);
    await C('The sender is... it says [[[[[. That\'s not a name. That\'s a noise. That\'s the noise the voice made.', 's');
    await say('THE PARCEL IS BEING HELD FOR CONTENT REVIEW. GOOD LUCK. PROP PILLS: IT\'S ONLY PRETEND.', DP);
    setObj('Go to the Sequel Center in the mall', 'sequel', 10, 5);
    banner('A: THROW   B: TALK / ROLL   C: SMOKE   START: MENU', 300);
    return;
  }
  sfx('static');
  if (typeof dispatchLater === 'function') return dispatchLater();
  await say('NO NEW DELIVERIES. PROP PILLS THANKS YOU FOR YOUR CONTINUED PRETENDING.', DP);
}
