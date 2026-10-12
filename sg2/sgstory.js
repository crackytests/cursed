'use strict';
// ================= SPOOKY GHOST 2: the show. episode flow, cold opens, fan mail, ratings, sponsors, and episodes 1-2 =================
const cm = (...ms) => ms.map(m => ({ u: pick(GCHAT), m }));
const LI = 'CEO LINDA', FA = 'FACE', CA = 'CARL';
const EPS = {};     // per episode: title, map, note, open, cards
const EP_INTRO = {}, EP_BOSS = {}, EP_OUTRO = {}, EP_READY = {};
const LETTERS = {}, SPONSORS = {};

// ---------------- episode flow ----------------
async function gnewGame() {
  S = newS(); music(null); post.fade = 0; post.legacy = 0;
  await previously();
  await playEpisode(1);
}
async function epCard(n) {
  const E = EPS[n];
  music(null); scene = { draw() { cls(hex('#000012')); } }; post.fade = 0;
  await showCard(['SPOOKY GHOST 2', '', n < 7 ? 'EPISODE ' + n : 'FINALE', E.title], 150, { fg: hex('#ff49db') });
  await showCard(['NOTE FROM THE NETWORK:', '', ...E.note, '', '- THE SEQUEL COMMITTEE'], 190, { fg: hex('#6dff24') });
}
async function playEpisode(n) {
  const E = EPS[n], d = MAPS[E.map];
  S.ep = n; S.applause = 0; S.ecto = 100; S.map = E.map;
  store('sg2_save', Object.assign({}, S, { x: d.start[0], y: d.start[1], dir: 'u' }));
  await epCard(n);
  await coldOpen(n);
  await descend();
  await fadeOut(.08);
  scene = worldScene; loadMap(E.map, d.start[0], d.start[1], 'u');
  await fadeIn(.08);
  banner(d.title, 120);
  run(EP_INTRO[n]);
}
async function coldOpen(n) {
  const E = EPS[n]; let t = 0;
  music('show');
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#000024', '#49006d');
    for (let x = 0; x < W; x += 16) { rectF(x, 14, 8, 130, hex('#6d24b6')); rectF(x + 8, 14, 8, 130, hex('#49246d')); }
    rectF(60, 14, 200, 130, hex('#240049')); rectF(0, 144, W, 80, hex('#24006d'));
    for (let y = 14; y < 144; y += 2) rectF(160 - (y - 14) / 3, y, (y - 14) * 2 / 3, 1, hex('#ffff92'));
    for (let i = 0; i < 6; i++) { const lx = 20 + i * 56; triF(lx, 14, lx - 14, 150, lx + 14, 150, hex(['#ff24db', '#24dbff', '#ffdb24'][i % 3])); } rectA(0, 14, W, 140, hex('#000024'), .6);
    drawScaled(SG.ghost.d[(t >> 4) % 3], 126, 62 + Math.round(Math.sin(t / 20) * 3), SGP.ghost, 3);
    rectA(0, 0, W, 14, BLACK, .7); text('ON AIR', 4, 3, (t >> 5) & 1 ? hex('#ff2449') : hex('#6d0024')); text('EP ' + n + '  ' + E.title, 70, 3, hex('#ff49db'));
  } };
  post.fade = 1; await fadeIn(.08); await wait(20);
  for (const l of E.open) await say(l, GH);
  if (n === 1) { // the other carts leave a mark
    if (OTHER.ghost && OTHER.ghost.endings) await say('You finished the first one. You\'re the reason there\'s a second one. I\'d like to thank you. I\'d also like to say that\'s a lot of responsibility.', GH);
    if (OTHER.carl2 && OTHER.carl2.jumped) await say('I hosted the clip show on Carl\'s second one, by the way. Nobody watched it. Everybody watched it.', GH);
  }
  await say('THE CUE CARDS. PICK ONE TO READ.', null, { keep: 1 });
  const i = await choose(E.cards.map(c => c[0]), { x: 8, y: 30 });
  DLG = null;
  const [, line, react, good] = E.cards[i];
  await say(line, GH);
  await chat(react);
  if (good) { S.applause++; S.total++; sfx('ok'); await say('THE AUDIENCE LIKED THAT CARD. +1 APPLAUSE.'); }
  else await say('I\'m just following the cards.', GH);
}
async function stageDoor() {
  if (S.applause < WD.quota) { await say(pick(['They haven\'t seen enough. I can\'t leave until they\'ve SEEN me.', 'It opens on applause. That\'s how I built it. I regret that now.']), GH); return say('APPLAUSE ' + S.applause + '/' + WD.quota + '.'); }
  const why = EP_READY[S.ep] && EP_READY[S.ep](); if (why) return say(why, GH);
  await say('THE STAR DOOR OPENS.'); sfx('door');
  await EP_BOSS[S.ep]();
  await stageClear();
}
async function stageClear() {
  const n = S.ep;
  if (EP_OUTRO[n]) await EP_OUTRO[n]();
  await fadeOut(.08);
  if (n === 7) return endings();
  await fanMail(n); await ratings(n); await sponsor(n);
  return playEpisode(n + 1);
}
async function fanMail(n) {
  const [text0, opts] = LETTERS[n];
  music('mail');
  scene = { draw() { skyD(0, H, '#240049', '#49006d'); panel(60, 20, 200, 150); for (let y = 52; y < 160; y += 12) rectF(70, y, 180, 1, hex('#6d6d92')); ctext('FAN MAIL', 28, hex('#ff49db'), BLACK, 2); } };
  post.fade = 0; sfx('tick');
  await say(text0);
  const i = await ask('HOW DOES HE ANSWER?', null, opts.map(o => o[0]));
  const [, line, honest] = opts[i];
  await say(line, GH);
  if (honest) { S.honesty++; await wait(40); await chat(cm('...', 'oh', 'that was real')); }
  else await chat(cm(pick(['LOL', 'classic', 'deflection']), pick(['bro', 'sure', 'ok host'])));
}
async function ratings(n) {
  const q = MAPS[EPS[n].map].quota, a = S.applause;
  const stars = a >= q + 8 ? 5 : a >= q + 4 ? 4 : a >= q ? 3 : 2;
  S.stars[n] = stars;
  scene = { draw() { skyD(0, H, '#000024', '#240049'); ctext('TONIGHT\'S RATINGS', 50, hex('#ff49db'), BLACK, 2); ctext('*'.repeat(stars) + '-'.repeat(5 - stars), 90, hex('#ffff49'), BLACK, 5); ctext('APPLAUSE ' + a + '   CAREER ' + S.total, 160, UI.dim); } };
  sfx('get'); await wait(40);
  await say(stars >= 5 ? 'Five stars. Five. Somebody write that down. Somebody frame that.' : stars >= 4 ? 'Four stars. Four is great. Four is one away from what I deserve.' : stars >= 3 ? 'Three stars. Critics. Critics hate ghosts. That\'s documented.' : 'Two stars. It\'s a sequel. Sequels get two stars. It\'s a law.', GH);
}
async function sponsor(n) {
  const [name, lines] = SPONSORS[n];
  music(null); sfx('ding');
  scene = { draw() { skyD(0, H, '#000012', '#240049'); ctext('THIS EPISODE BROUGHT', 60, hex('#24dbff'), BLACK, 2); ctext('TO YOU BY', 80, hex('#24dbff'), BLACK, 2); ctext(name, 112, hex('#ffff49'), BLACK, 3); ctext('WE\'LL BE RIGHT BACK', 170, UI.dim); } };
  post.fade = 0; await wait(40);
  for (const [l, who] of lines) await say(l, who);
  await fadeOut(.08);
}
// win the dance or try again. each loss makes the crowd friendlier (wider timing)
async function danceFight(cfg, loseLines) {
  for (let tries = 0; ; tries++) {
    const r = await boogaloo(cfg);
    if (r.win) return r;
    if (loseLines) await say(loseLines[Math.min(tries, loseLines.length - 1)], cfg.who || null);
    await say(tries ? 'THE CROWD IS WARMING TO YOU. THE TIMING WINDOW GETS WIDER.' : 'THE CROWD BOOS. POLITELY. THEY BOO IN TIME.');
  }
}


// ================= EPISODE 1: SAME GHOST, NEW BUDGET =================
EPS[1] = { title: 'SAME GHOST, NEW BUDGET', map: 'studio88', note: ['MORE GHOST.', 'MORE TUXEDO.', 'LESS ALIMONY.', '(THERE WILL BE ALIMONY.)'],
  open: ['Good evening, and welcome back to LIVE FROM BEYOND.', 'The name is Ghost. Spooky Ghost. Yes, I know. Everybody says it back to me in their heads. Nobody has to.', 'They offered me a sequel. I said I\'d think about it. I said yes. I was thinking about it the whole time I was saying yes. That\'s called range.'],
  cards: [['THE TUXEDO', 'The network gave me a tuxedo. I don\'t have a body. It\'s a sheet with a bow tie on it. It is the best-dressed sheet in the history of the medium.', cm('the bow tie goes hard', 'ghost at a wedding', '10/10 sheet'), 1],
    ['THE DRINK', 'My drink order is a martini. Shaken, not stirred. I can\'t hold a glass, so it\'s neither. It sits on the bar. It thinks about it. We understand each other.', cm('neither is crazy', 'he ordered a drink he cant drink', 'smooth'), 1],
    ['THE LEADING LADY', 'Every show needs a leading lady. I\'ve had a lot of leading ladies. The funny thing is, it\'s one lady. I\'ll explain. I\'ll explain in a way that makes me sound good.', cm('one lady???', 'oh no here it comes', 'sure bond'), 0]] };
SPONSORS[1] = ['PROP PILLS', [['PROP PILLS. Now in NEON. A subsidiary of Pretend Co. The pretend company. A real... hold on. A real company. I always mess that up.', GH]]];
LETTERS[1] = ['DEAR SPOOKY GHOST, ARE YOU REALLY LIKE THIS OR IS IT A BIT? - SOMEBODY\'S MOM', [
  ['DEFEND', 'It\'s not a bit. It\'s a presence. People walk into a room and they feel a presence.', 0],
  ['PERFORM', 'Smooth isn\'t a bit. Smooth is a lifestyle. ...Chat is typing "bit." It isn\'t a bit.', 0],
  ['ADMIT', 'Some of it is a bit. The part where I walk in like I own the room is a bit. The part where I\'m scared nobody will be there is not.', 1]]];
EP_INTRO[1] = async () => {
  await say('Studio 88. It used to be the eighties department. Now it\'s a soundstage. It\'s also still the eighties department. Don\'t think about it.', GH);
  await say('ARROWS float. Z haunts and talks. Hold X to swoop, and to PHASE through cracked walls (costs ECTO). ENTER for the menu.');
  await say('Scare people from BEHIND for big APPLAUSE. From the side is half a scare. From the front is a guy in a sheet. When the CLAP meter is full, the star door opens.');
  await say('Also: collectors. Spooky alimony. They have shoulder pads now. Stay out of the yellow.', GH);
};
const DANCER_PATTY = { id: 'patty', who: 'PATTY', name: 'PATTY', title: 'BODY ELECTRIC', person: 'patty', bpm: 104, rounds: 4, mode: 'cr', track: 'dpatty', cheer: 'PUMP IT PUMP IT', hint: 'SHE DANCES. YOU DANCE IT BACK.' };
EP_BOSS[1] = async () => {
  sfx('ding'); music('studio');
  await say('A SOLID BEAT STARTS UP FROM NOWHERE. A WOMAN IN LEG WARMERS WALKS ONTO THE FLOOR. SHE IS EXACTLY ON TIME.');
  await say('Welcome to Body Electric. It\'s six a.m. somewhere. In here it\'s six a.m.', 'PATTY');
  await say('Good evening. The name is Ghost. Spooky...', GH);
  await say('I know who you are. You fixed my boiler.', 'PATTY');
  await say('...Was that you? In the twelfth one? The studio with the ribbon floor?', GH);
  await say('You fixed it so well the building became a different building. I had to sign a new lease. On my own building.', 'PATTY');
  await say('It was a very good boiler.', GH);
  await say('You said you\'d be at the six a.m. class. I held the door for an hour. Then I held it for a year. Then I bought a doorstop.', 'PATTY');
  await say('Same hair. Same eyes. Same voice. Leg warmers. Here it comes. Any second now she asks the question.', GH);
  await say('What did you actually do?', 'PATTY');
  await say('There it is. Every one of you. Every time. Same question.', GH);
  await say('Boogaloo for the slot. The winner gets six a.m. The loser gets a juice cleanse. I\'d like to see you do a juice cleanse.', 'PATTY');
  await say('What\'s a boogaloo?', GH);
  await say('First rule. Somebody moves first. The other person answers.', 'PATTY');
  await say('That\'s it? That\'s the whole rule?', GH);
  await say('That\'s every rule. Most people only learn half.', 'PATTY');
  await danceFight(DANCER_PATTY, ['From the top. You\'re late on the answer.', 'Answer late and you\'re just an echo. Again.', 'Again. Sweat is just feelings leaving. That\'s on a poster. I wrote the poster.']);
  music('studio');
  await say('Fine. The slot is yours. Six a.m. I\'ll take five.', 'PATTY');
  await say('Nobody takes five.', GH);
  await say('I do. I schedule it.', 'PATTY');
  await say('Patty. Before you go. I want you to know that the second I saw you across that studio I knew...', GH);
  await say('Don\'t. I can see the line coming. You get a look.', 'PATTY');
  await say('I do not get a look.', GH);
  await say('You get a look. It\'s a good look. It\'s also a look.', 'PATTY');
  await say('"Somebody moves first, and the other person answers." I only ever do the first half. ...Huh.', GH);
};
EP_OUTRO[1] = async () => {
  sfx('static'); await wait(30);
  await say('SPOOKY GHOST. THURSDAY IS THE REUNION SPECIAL. YOU ARE ON THE LIST.', LI);
  await say('Lin? Is that... Lin. You made the sequel? It was you?', GH);
  await say('THURSDAY.', LI);
  sfx('static'); await wait(20);
  await say('She still does the voice. The boss voice. ...Patty\'s voice. It was the same voice. I should have known it on the first word.', GH);
  await say('Forty realities, and the one I never went back to is the one who found me. That\'s not a Bond move. That\'s a Moneypenny move.', GH);
};

// ================= EPISODE 2: THE REUNION =================
EPS[2] = { title: 'THE REUNION', map: 'green', note: ['THE EXES ARE BOOKED.', 'THEY HAVE BEEN TOLD', 'ABOUT EACH OTHER.', '(THEY KNOW.)'],
  open: ['Welcome back. Tonight is the reunion. Three guests. Three dressing rooms. One woman. I\'ll explain.', 'I\'m a romantic. A hopeless one. It isn\'t a flaw, it\'s a trade. A long time ago I learned a hermetic thing. Sigils. Numbers. A very particular kind of walking. As above, so below. It lets a man step out of one world and into the next.', 'And in every world, I fell in love with her. The same her. Same hair. Same eyes. Same laugh. Different job. I didn\'t plan it. I\'m just a man who can walk through doors, and she was behind all of them.'],
  cards: [['THE METHOD', 'It\'s called hermetic. I could explain it. It would take four hours and you\'d still be lost. I\'m told that\'s part of the charm.', cm('hermetic?', 'the sigil guy', 'explain it'), 1],
    ['THE SAME WOMAN', 'Here\'s the part nobody believes. I didn\'t meet three women. I met one woman three times. Okay: forty times. Okay: that\'s too many to say on air.', cm('FORTY', 'bro', 'forty??'), 0],
    ['THE FLOWERS', 'I brought flowers for all three. The same flowers. It\'s efficient. She\'ll never know. ...She will absolutely know. She is the same woman.', cm('lol', 'efficient', 'oh he really did that'), 0]] };
SPONSORS[2] = ['FASCISM INC.', [['FASCISM INC. FAMILY PLAN. Companionship for the whole household. Now in three tiers.', LI], ['That was my joke. That name. I told her that name.', GH], ['It\'s the perfect impression.', LI]]];
LETTERS[2] = ['DEAR SPOOKY GHOST, HOW MANY TIMES HAVE YOU FALLEN IN LOVE? - CONCERNED IN NEVADA', [
  ['DEFEND', 'Once. Forty times. It\'s the same once.', 0],
  ['PERFORM', 'Love is a door, my friend. I\'ve simply opened more of them than most. ...Chat is typing "cringe." Okay.', 0],
  ['ADMIT', 'Every time I get to the part where it gets real, I find a reason there\'s another door. I am very, very good at doors.', 1]]];
EP_INTRO[2] = async () => {
  await say('The green room. Mirrors on every wall. You can see yourself from six angles. I looked. All six of me were holding a rose.', GH);
  await say('Three dressing rooms. Three sigil locks. Those are mine. I drew them. I used to draw them on napkins to get into places. And apartments.', GH);
  await say('Talk to all three before the star door will open. Scare the dancers while you\'re at it. They\'re stretching, they\'ll never see it coming.', GH);
};
async function wifeTalk(i) {
  const lines = [
    [['CHOREOGRAPHER', 'So you got the sequel.'], [GH, 'Good evening. You look like a woman who runs the room. I mean that as a compliment. I mean it as a line. I mean it as both.'], ['CHOREOGRAPHER', 'You stopped my wedding.'],
     [GH, 'I prevented a mistake.'], ['CHOREOGRAPHER', 'He wasn\'t a mistake. He was a lovely man. He had a boat.'], [GH, 'He was wrong for you.'],
     ['CHOREOGRAPHER', 'You knew that after three minutes in my reality? You haunted the cake. You made the organ play your song. The priest fainted.'], [GH, 'It was a big gesture. Big gestures are what I have.'],
     ['CHOREOGRAPHER', 'And then you left. Before the cake fell. Someone had to pick up the cake, Ghost.'], [GH, 'I was already in the next one.'],
     ['CHOREOGRAPHER', 'Say the real one. Not the line.'], [GH, 'I wanted to be the reason. I wanted it to be me you chose. I didn\'t ask. I just decided.'],
     ['CHOREOGRAPHER', 'Then dance with me. Once. For the cameras and for me.']],
    [['CALL-IN HOST', 'You said you\'d call from the road.'], [GH, 'I called. Once. I left a message.'], ['CALL-IN HOST', 'It was forty minutes long.'], [GH, 'It had a structure.'],
     ['CALL-IN HOST', 'The machine cut you off right before the part where you said it.'], [GH, 'It always cuts off right there.'],
     ['CALL-IN HOST', 'I sell phones now. Plans and bundles. I\'m very good. I\'m on the television.'], [GH, 'I know. I watch. I don\'t call in.'], ['CALL-IN HOST', 'I know you don\'t.']],
    [['JUDGE', 'I don\'t want alimony.'], [GH, 'Oh. That\'s a relief.'], ['JUDGE', '...Fine. Also alimony.'], [GH, 'There it is.'],
     ['JUDGE', 'In my reality you came to testify for me. You levitated.'], [GH, 'It was for gravitas.'], ['JUDGE', 'It was a mistrial.'], [GH, 'It was a very dramatic mistrial.'],
     ['JUDGE', 'You\'ll get your hearing. Courtroom 88. I want you to say what happened. Out loud. In a room. With a stenographer.'], [GH, 'What happened is I tried to help and I made it about me. And then I left before the verdict.'], ['JUDGE', 'That\'s a start. Not the whole thing. A start.']],
  ][i];
  for (const [who, l] of lines) await say(l, who);
  setF('wife' + i);
  sfx('get'); banner(['SHE HAS SAID HER PIECE', 'THE NEXT ONE IS WAITING', 'THE LAST ONE IS ON THE LIST'][i], 100);
  if (F('wife0') && F('wife1') && F('wife2')) { await say('Three rooms. Three women. They each asked me the same question without saying it.', GH); await say('What did you actually do?', GH); }
}
EP_READY[2] = () => (F('wife0') && F('wife1') && F('wife2')) ? null : 'Not yet. They each want to say something before the show. I can feel the unsaid thing in the hallway. It\'s humming.';
const DANCER_EXES = { id: 'exes', who: 'CHOREOGRAPHER', name: 'CHOREOGRAPHER', title: 'THE REUNION NUMBER', person: 'wifeA', bpm: 116, rounds: 5, mode: 'cr', track: 'dexes', cheer: 'REUNION REUNION', hint: 'SHE LEADS. YOU FOLLOW. HER LEAD IS GOOD.' };
EP_BOSS[2] = async () => {
  music('green');
  await say('The three of them walk out together. There is a spotlight. It chooses.');
  await say('Ladies. Forgive me. I realize this is awkward. But it isn\'t every day a man gets to see all the women he\'s loved in one room.', GH);
  await say('It\'s one woman.', 'CALL-IN HOST');
  await say('It is very much one woman.', 'JUDGE');
  await say('You\'re looking at the same woman three times and you still opened with a speech.', 'CHOREOGRAPHER');
  await say('...It was a good speech.', GH);
  await say('ALL THREE OF THEM FOLD THEIR ARMS. THE SAME WAY. AT THE SAME TIME.');
  await say('It was an okay speech. One number. Then we all go home. Separately.', 'CHOREOGRAPHER');
  await say('You wanted to lead. So I lead. You answer. That\'s the dance. It\'s a nice dance. You\'d like it if you ever stayed through it.', 'CHOREOGRAPHER');
  await danceFight(DANCER_EXES, ['Again. You started late. You always start late.', 'You\'re thinking about the door. I can see your feet. Stay in your feet.', 'Again. From the top. It\'s a long song. It\'s a whole song.']);
  music('green');
  await say('...Not bad for a ghost. You stepped on my foot. Twice. Through it. I felt it.', 'CHOREOGRAPHER');
  await say('Sorry.', GH);
  await say('Say it again.', 'CHOREOGRAPHER');
  await say('Sorry. I mean it. Both times.', GH);
  S.honesty++;
  await say('That\'s how you dance. You say it, and then you stay on the floor.', 'CHOREOGRAPHER');
};
EP_OUTRO[2] = async () => {
  await say('A pink light finds the three of them. It doesn\'t take them. It just stays on them a while.');
  await say('NEXT STOP: THE CONTROL ROOM. THE DIRECTOR HAS ASKED YOU NOT TO SPEAK TO THE DIRECTOR.', LI);
  await say('Who\'s the director?', GH);
  await say('YOU\'LL SEE.', LI);
};
