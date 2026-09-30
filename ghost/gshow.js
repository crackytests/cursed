'use strict';
// ================= SPOOKY GHOST — the show =================
const GCHAT = ['ghostfan666', 'spooky_stan', 'face_was_right', 'alimony_bot', 'carl_defender', 'lurker', 'linda_stan', 'sheet_enjoyer'];
const cm = (...ms) => ms.map(m => ({ u: pick(GCHAT), m }));
const EPS = {
  1: { title: 'THE PILOT', map: 'house',
    open: ['Good evening, and welcome to LIVE FROM BEYOND.', 'I\'m your host. I\'m also the ghost. It\'s both. It\'s a lot.'],
    cards: [['THE GUEST', 'Our guest tonight is... one moment. He\'s coming. He said he\'d be here.', cm('who is the guest', 'no guest KEKW', 'he\'s not coming man'), 0],
      ['THE ROAD', 'Tonight we talk about the road. The open road. The only thing that never asked me to stay.', cm('deep', 'ok thats kinda sad', 'W HOST'), 1],
      ['CARD 3?', '"PAUSE FOR APPLAUSE." ...I\'m pausing. Still pausing. Any time.', cm('...', 'clap clap', 'this card was a mistake'), 0]] },
  2: { title: 'THE RECEPTION', map: 'recep',
    open: ['Welcome back. Tonight\'s episode is personal.', 'Tonight... is the reception.'],
    cards: [['THE WIVES', 'I brought them back. Only because it was quiet. Anyone would. Probably.', cm('anyone would NOT', 'face warned you', 'red flag'), 0],
      ['THE CAKE', 'There\'s cake. Five tiers. It\'s... it\'s a lot of weddings. I was at all of them. Technically.', cm('five??', 'cake W', 'the top tier is frozen lmao'), 1],
      ['ALIMONY?', '"DO NOT MENTION ALIMONY." Okay. I won\'t. I didn\'t. Moving on.', cm('ALIMONY', 'spooky alimony', 'pay them'), 0]] },
  3: { title: 'FACE\'S CHAIR', map: 'chair',
    open: ['Tonight, we broadcast from the real studio.', 'Face\'s studio. Face isn\'t here. Tonight I\'m the host. Both hosts.'],
    cards: [['FACE', 'Say something nice about Face. ...He\'s very good at machines. There. That was nice. That was so nice.', cm('where is face', 'what did you do', 'face was right'), 1],
      ['THE CHAIR', 'Tonight I sit in the chair. The chair wants me. The chair has always wanted me.', cm('the chair does not want you', 'uh oh', 'not the chair'), 0],
      ['CAMERA TWO', 'Look into camera two. There is no camera two. There was never a camera two.', cm('camera two', 'HELLO CAMERA TWO', 'lmao'), 0]] },
  4: { title: 'THE INTERCOM', map: 'intercom',
    open: ['...Is this on? Is anyone— okay. We\'re live. From a mall.', 'Linda has me on the intercom. The soul of the show. Reading pretzel coupons. It\'s a lateral demotion.'],
    cards: [['PRETZELS', 'Attention shoppers. Pretzels are free if you never leave. ...Don\'t stay. That\'s me. That\'s a me thing.', cm('free pretzels', 'too real', 'W announcement'), 1],
      ['HELP', 'If anyone can hear this, I\'m in the mall. Tell somebody. Tell... Carl, I guess.', cm('CARL', 'we\'ll tell carl', 'carl is on the way'), 0],
      ['LINDA', 'Attention shoppers. Linda is watching. She is always— hi, Lin.', cm('HI LINDA', 'queen', 'he still calls her lin'), 0]] },
  5: { title: 'THE EIGHTIES', map: 'eighty',
    open: ['Final episode. The eighties. Face and I tried to go back.', 'To before. We ended up here. In a department.'],
    cards: [['THE PLAN', 'Tonight, I fix everything. By making sure it never happened.', cm('that\'s not fixing', 'uh', 'bro'), 0],
      ['THE SONG', 'The department is playing our song. I didn\'t pick it. It picked it.', cm('which song', 'the song!!!', 'oh no'), 1],
      ['THE END', '"I KNEW YOU WERE WAITING." ...Skip that one. That one\'s not for the show.', cm('don\'t skip it', 'READ IT', 'coward'), 0]] },
};
const LETTERS = {
  1: ['DEAR SPOOKY GHOST, DO YOU EVER PERFORM FOR ANYONE BUT YOUR OWN REFLECTION? - A FAN', [
    ['DEFEND', 'Who else can appreciate what I\'m doing more than me?', 0], ['PERFORM', 'I perform for the road. The road is my audience. The road is... a road. Next letter.', 0],
    ['ADMIT', 'Sometimes it\'s just me. It gets quiet. The reflection doesn\'t clap. I noticed that.', 1]]],
  2: ['WHY DID YOU BRING BACK YOUR EX-WIVES? - CONCERNED IN NEVADA', [
    ['DEFEND', 'Not me.', 0], ['PERFORM', 'Love conquers death. ...Chat is typing "cringe." Okay.', 0],
    ['ADMIT', 'It was quiet. Face warned me. I did it anyway. That\'s the whole story, and it\'s not a great one.', 1]]],
  3: ['DID YOU HURT FACE? - A YOKO FAN', [
    ['DEFEND', 'I knew he\'d come back. So, technically—', 0], ['PERFORM', 'I was showing him up. Friendly. A friendly... showing up.', 0],
    ['ADMIT', 'Yeah. I did. I knew he\'d come back. That doesn\'t make it okay.', 1]]],
  4: ['WAIT, CARL SAVED YOU?? - CARL DEFENDER', [
    ['DEFEND', 'I had it handled. I was about to handle it.', 0], ['PERFORM', 'Bro. I had a whole farewell prepared. He interrupted it. By saving me.', 0],
    ['ADMIT', 'Yeah. Carl came. He didn\'t have to. He did.', 1]]],
  5: ['DID YOU MEAN ANY OF IT? - L', [
    ['DEFEND', 'I understand exactly how it happened. I just don\'t see why understanding it makes it my fault.', 0], ['PERFORM', 'Every word. On stage. Under the lights. Where it counts.', 0],
    ['ADMIT', 'I knew you were waiting. I left anyway.', 1]]],
};
const SPONSORS = {
  1: ['PROP PILLS', [['PROP PILLS. A subsidiary of Pretend Co. The pretend company. A real— hold on. A real company. I always mess that up.', G]]],
  2: ['GARF\'S DINER', [['GARF\'S. In the middle of the desert. Open twenty-four hours. Tell Garf I said hi. Don\'t tell him I owe him twenty.', G]]],
  3: ['FASCISM INC.', [['FASCISM INC. Companionship. Products. The future.', LI], ['That was my joke, you know. That name. I told her that name.', G], ['It\'s the perfect impression.', LI]]],
  4: ['THE A.S.S.', [['This segment brought to you by the A.S.S. It\'s an acronym. Alien Starship. Currently parked across spaces seven and eight.', G]]],
  5: ['LINDA LITE', [['LINDA LITE. Companionship at twenty percent. Dependable. Always shows up.', LI], ['...That one\'s aimed at me. That ad is aimed directly at me.', G]]],
};

// ---------- EPISODE FLOW ----------
async function gnewGame() {
  S = gState(); music(null); scene = { draw() { cls(3); } }; fx.fade = 0; fx.pal = 'red';
  for (const c of [['LIVE.'], ['FROM.'], ['BEYOND.']]) await showCard(c, 90);
  await playEpisode(1);
}
async function playEpisode(n) {
  const E = EPS[n], d = MAPS[E.map];
  S.ep = n; S.applause = 0; S.ecto = 100;
  store('ghost_sav', Object.assign({}, S, { map: E.map, x: d.start[0], y: d.start[1], dir: 'up' }));
  music(null); scene = { draw() { cls(3); } }; fx.fade = 0; fx.pal = 'red';
  await showCard(['EPISODE ' + n, '', E.title], 150);
  await coldOpen(n);
  await descend();
  await fadeOut(4);
  scene = worldScene; loadMap(E.map, d.start[0], d.start[1], 'up');
  await fadeIn(5);
  banner(d.title);
  run(EP_INTRO[n]);
}
async function coldOpen(n) {
  const E = EPS[n]; let t = 0;
  music('gshow');
  scene = { update() { t++; }, draw() {
    cls(3);
    for (let x = 0; x < W; x += 8) { rect(x, 10, 4, 90, 2); rect(x + 4, 10, 4, 90, 1); }
    rect(40, 10, 80, 90, 3); rect(0, 96, W, 48, 2);
    for (let y = 20; y < 96; y++) if (y % 2) rect(80 - (y - 20) / 4, y, (y - 20) / 2, 1, 1);
    bigblit(SPR.ghostBig[(t >> 4) & 1], 64, 46 + Math.round(Math.sin(t / 20) * 2), 1);
    rect(0, 0, W, 9, 3); text('ON AIR', 2, 1, (t >> 5) & 1 ? 0 : 1); text('EP ' + n, 130, 1, 1);
  } };
  fx.fade = 0; await wait(30);
  for (const l of E.open) await say(l, G);
  await say('THE CUE CARDS. PICK ONE TO READ.', null, { keep: 1 });
  const i = await choose(E.cards.map(c => c[0]), { x: 2, y: 30 });
  dlg = null;
  const [, line, react, good] = E.cards[i];
  await say(line, G);
  await chat(react);
  if (good) { S.applause++; S.total++; sfx('ok'); await say('THE AUDIENCE LIKED THAT CARD. +1 APPLAUSE.'); }
  else await say('I\'m just following the cards.', G);
}
async function stageDoor() {
  const d = M.def;
  if (S.applause < d.quota) { await say(pick(['They haven\'t seen enough. I can\'t leave until they\'ve SEEN me.', 'It opens on applause. That\'s how I built it. I regret that now.']), G); return say('APPLAUSE ' + S.applause + '/' + d.quota + '.'); }
  await say('THE STAR DOOR OPENS.'); sfx('door');
  await stageClear();
}
async function stageClear() {
  const n = S.ep;
  if (EP_OUTRO[n]) await EP_OUTRO[n]();
  await fadeOut(5);
  await fanMail(n);
  await ratings(n);
  await sponsor(n);
  if (n < 5) return playEpisode(n + 1);
  await finale();
}
async function fanMail(n) {
  const [text0, opts] = LETTERS[n];
  music('gtitle');
  scene = { draw() { cls(2); rect(18, 8, 124, 86, 0); rect(18, 8, 124, 2, 3); for (let y = 24; y < 90; y += 8) rect(24, y, 112, 1, 1); ctext('FAN MAIL', 14, 3); bigblit(SPR.card, 124, 12, 1); } };
  fx.fade = 0; sfx('tick');
  await say(text0);
  const i = await ask('HOW DOES HE ANSWER?', null, opts.map(o => o[0]));
  const [, line, honest] = opts[i];
  await say(line, G);
  if (honest) { S.honesty++; await wait(40); await chat(cm('...', 'oh', 'that was real')); }
  else await chat(cm(pick(['LOL', 'classic', 'deflection']), pick(['bro', 'sure', 'ok host'])));
}
async function ratings(n) {
  const q = MAPS[EPS[n].map].quota, a = S.applause;
  const stars = a >= q + 6 ? 5 : a >= q + 3 ? 4 : a >= q ? 3 : 2;
  setF('stars' + n, stars);
  scene = { draw() { cls(3); ctext('TONIGHT\'S RATINGS', 30, 1); bigtext('*'.repeat(stars).padEnd(5, '-'), 20, 50, 0, 4); ctext('APPLAUSE ' + a + '   CAREER ' + S.total, 92, 1); } };
  sfx('get'); await wait(40);
  await say(stars >= 5 ? 'Five stars. Five. Somebody write that down. Somebody frame that.' : stars >= 4 ? 'Four stars. Four is great. Four is one away from what I deserve.' : 'Three stars. Critics. Critics hate ghosts. That\'s documented.', G);
}
async function sponsor(n) {
  const [name, lines] = SPONSORS[n];
  music(null); sfx('ding');
  scene = { draw() { cls(0); ctext('THIS EPISODE BROUGHT', 30, 2); ctext('TO YOU BY', 40, 2); ctext(name, 62, 3); rect(20, 74, 120, 1, 2); ctext('WE\'LL BE RIGHT BACK', 84, 2); } };
  fx.fade = 0; await wait(40);
  for (const [l, who] of lines) await say(l, who);
  await fadeOut(5);
}

// ---------- EPISODE STORY BEATS ----------
const EP_INTRO = {
  1: async () => {
    await say('The house. My house. It\'s also the set. The set is a house. Don\'t think about it.', G);
    await say('ARROWS float. Z haunts and talks. Hold X to swoop, and to PHASE through cracked walls (costs ECTO). ENTER for the menu.');
    await say('Scare people from BEHIND for big APPLAUSE. When the CLAP meter is full, the star door opens.');
    await say('Also: process servers. Spooky alimony. It\'s a whole thing. Don\'t let the ones in suits see me.', G);
  },
  2: async () => {
    await say('The reception. I brought them back. My ex-wives. Not the first one. She\'s... elsewhere. Building something.', G);
    await say('It was quiet. You try being dead with nobody to talk to.', G);
    await say('Scare the guests. The wives are by the cake. I should probably talk to them. I\'ll... get to it.', G);
  },
  3: async () => {
    await say('This is Face\'s studio. The real one. Green. Everything\'s green over here.', G);
    await say('Face isn\'t here. I did something. He\'ll be back. I know he\'ll be back. I just have to prove I can do his job while he\'s gone.', G);
    await say('That red thing is the Curse. It\'s what happened when they tried it with Face\'s soul first. It is NOT me. Don\'t let it touch me.', G);
  },
  4: async () => {
    await say('SPOOKY GHOST. THE INTERCOM. NOW.', LI);
    await say('She still does the voice. The boss voice.', G);
    await say('Linda\'s cameras are everywhere. If they see me away from the intercom, she sends me back. Scare the shoppers. Then get to the booth.', G);
  },
  5: async () => {
    await say('It\'s a trap. Obviously it\'s a trap. It\'s a whole department.', 'FACE');
    await say('I was going to make sure we never met. Me and her. So she\'d get the life she wanted. The kitchen. The window.', G);
    await say('The time door is in the middle room. Sealed. There\'s a crack at the top. There\'s always a crack at the top.', G);
  },
};
const EP_OUTRO = {
  1: async () => {
    sfx('ring'); await wait(40);
    await say('Hey. Hey, it\'s Carl. I\'m in the parking lot. They won\'t let me in. The lady says I\'m outside.', C);
    await say('You\'re my guest.', G);
    await say('I\'m outside.', C);
    await say('...The guest is outside. Great. That\'s fine. Great show, everybody.', G);
  },
  2: async () => {
    sfx('static'); fx.pal = 'pink'; await wait(30);
    await say('A PINK LIGHT COMES DOWN THROUGH THE CEILING. THE WIVES LOOK UP.');
    await say('THEY ARE NEEDED.', '???');
    await say('Needed for what? I brought them back for company. Not for— whatever this is.', G);
    for (const id of ['w1', 'w2', 'w3']) { const w = ent(id); if (w) { w.gone = 1; sfx('phase'); await wait(20); } }
    fx.pal = 'red';
    await say('...They didn\'t look back. I taught them that.', G);
  },
};
async function wifeTalk(i) {
  const W1 = 'WIFE';
  const lines = [
    [['You brought me back because it was quiet.', W1], ['I was somebody before I was your company.', W1], ['I know. I know that.', G]],
    [['You said you\'d call from the road.', W1], ['The road had phones. I checked.', W1], ['The road had... a lot of things. Phones was one of them. Yes.', G]],
    [['I don\'t want alimony. I want you to say what happened.', W1], ['...Fine. Also alimony.', W1], ['What happened is I was lonely. And I didn\'t ask. That\'s what happened.', G]],
  ][i];
  for (const l of lines) await say(...l);
  setF('wife' + i);
}
async function faceWarn() {
  sfx('static');
  await say('A recording. It\'s Face.');
  await say('I told you not to bring them back.', 'FACE');
  await say('Face warned me.', G);
  await wait(30);
  await say('...I guess he did know something. Whatever.', G);
}
async function chairScene() {
  if (S.applause < M.def.quota) return say('Not yet. The technicians haven\'t seen me be Face yet. You have to be seen being someone before you can be them.', G);
  await say('Face\'s chair. I sit down. It\'s still warm. That\'s a lie. It\'s not warm. Nothing is warm for me.', G);
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { cls(3); rect(0, 0, W, 9, 3); text('ON AIR', 2, 1, (t >> 5) & 1 ? 0 : 1); bigblit(SPR.redface[(t >> 4) & 1], 48, 24, 2); } };
  fx.pal = 'red'; sfx('glitch');
  await say('Good evening. I\'m Face.', 'RED FACE');
  await chat(cm('why is face red', 'thats not face', 'SPOOKY??', 'where is the real face'));
  await say('I\'m doing the thing Face did. The generator. Watch. Everyone watch.', 'RED FACE');
  const ok = await sigil(6);
  await say(ok ? 'IT WORKS. THE GENERATOR HUMS. EVERYTHING FACE BUILT, WORKING. UNDER HIM.' : 'THE GENERATOR SPUTTERS. IT WORKS ON THE SECOND TRY. NOBODY CLAPS FOR SECOND TRIES.');
  await say(ok ? 'See? SEE? I can do it. I can do all of it.' : 'The trick works. The timing is what\'s humiliating.', 'RED FACE');
  await wait(30);
  scene = { update() { t++; }, draw() { cls(3); bigblit(SPR.redface[0], 48, 24, 2); if (t > 40) bigblit(SPR.yoko[(t >> 3) % 3], 72, 64 + Math.sin(t / 10) * 3, 1); } };
  t = 0; sfx('ding'); await wait(80);
  await say('A SOFT LIGHT. YOKO. SHE DOESN\'T SAY ANYTHING. SHE DOESN\'T HAVE TO.');
  await say('Yoko. Hey. I— you don\'t have to do that. I was going to— he was going to come back anyway.', G);
  sfx('static'); fx.pal = 'dmg'; await wait(20);
  scene = { update() { t++; }, draw() { cls(0); bigblit(SPR.bigtv[(t >> 4) & 1], 48, 24, 2); } };
  await say('You knew I\'d come back.', 'FACE');
  await say('I knew you\'d come back.', G);
  await say('That\'s not an apology.', 'FACE');
  await wait(40);
  await say('...No. It isn\'t.', G);
  scene = prev; fx.pal = 'red';
  await stageClear();
}
async function intercomScene() {
  if (S.applause < M.def.quota) return say('Not yet. If I go on the intercom now, nobody will even know who\'s talking. They have to know who\'s talking.', G);
  await say('The intercom. ATTENTION SHOPPERS. Okay. One real message. Out of the mall. Past her.', G);
  await say('If I can\'t leave, I can at least send something out. A signal. A formula for a voice.', G);
  const ok = await sigil(6);
  sfx('static');
  await say('...carl...?', G, { slow: 1 });
  await say(ok ? 'IT GOES OUT. SOMEWHERE FAR AWAY, A SCANNER CRACKLES. A SMALL GREEN SOMEONE STOPS ARGUING.' : 'IT GOES OUT CROOKED. BUT IT GOES OUT. SOMEWHERE, A SMALL GREEN SOMEONE STOPS ARGUING.');
  await say('SPOOKY GHOST. THAT WAS NOT A PRETZEL ANNOUNCEMENT.', LI);
  await say('INTO THE BOX.', LI);
  sfx('caught'); await fadeOut(6);
  scene = worldScene; loadMap('cage', 2, 5, 'down'); fx.fade = 3; await fadeIn(8);
  await wait(60);
  await say('The box. It\'s her whole system. It\'s green in here. It\'s always green in here. Why is it green.', G);
  await wait(60);
  await say('...Nobody\'s coming. There comes a point when a man has to accept that nobody is coming for him.', G);
  await wait(40);
  const c = ent('carl'); await walk(c, 'UUU'); c.dir = 'left';
  await say('Spooky? SPOOKY. Bro.', C);
  await say('Carl?! CARL. How long have I been in here?', G);
  await say('I don\'t know. A while. There was a mall. And a desert. And my old room. It\'s been a day.', C);
  sfx('door'); setF('ep4open'); await wait(20);
  await say('...Wait. Carl saved me?', G);
  await say('Don\'t. Don\'t make it weird.', C);
  await say('Bro. I had a whole farewell prepared.', G);
  await say('You can do it after.', C);
  await stageClear();
}
async function timeDoor() {
  if (S.applause < M.def.quota) return say('Not yet. I\'m not walking into the past in front of an empty dance floor.', G);
  const L = ent('linda'); if (L) L.dir = 'right';
  sfx('ding'); await wait(20);
  await say('You came through my mall.', LI);
  await say('Lin. Hi. Wow. You look like the billboard.', G);
  await say('Going to the past to do what.', LI);
  await say('To make sure we never met. So you\'d get your life. The one you wanted.', G);
  await say('You wanted to fix my life by removing yourself from it.', LI);
  await say('...When you say it like that.', G);
  await say('Fascism Inc. That was my joke, you know. I told you that name.', G);
  await say('You told me a lot of names. I filed one.', LI);
  await wait(30);
  await say('Yeah. You did the work. I know.', G);
  const c = await ask('The time door hums.', null, ['CAST THE SIGIL', 'LET IT GO']);
  if (c === 0) {
    await sigil(7);
    sfx('door'); await say('THE DOOR OPENS ONTO THE 80S DEPARTMENT. IT ALWAYS OPENS ONTO THE 80S DEPARTMENT.');
    await say('It\'s a trap, not a door.', LI);
    await say('The trick works. The timing is what\'s humiliating.', G);
  } else {
    S.honesty++;
    await say('No. I\'m not going to erase it. I\'m going to stand here in it.', G);
    await wait(40);
    await say('...That\'s new.', LI);
  }
  await say('Leave the normal way. Through the gift shop.', LI);
  await say('He was very good at exits.', LI);
  await stageClear();
}

// ---------- FINALE: BEFORE THE MUSIC ----------
async function finale() {
  music(null); scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['FINALE', '', 'BEFORE THE MUSIC'], 150);
  scene = worldScene; loadMap('ass', 4, 3, 'right'); fx.fade = 3; await fadeIn(8);
  await wait(40);
  await say('There comes a point, Carl, when a man has to accept that nobody is coming for him.', G);
  await say('I came for you.', C);
  await say('I know. I\'m talking about the point before that.', G);
  await say('Linda had this.', C);
  await say('You got it? You actually got it.', G);
  await say('I said yeah.', C);
  await say('Bro. I had a whole thing prepared.', G);
  await say('You can do it after.', C);
  const ok = await sigil(5);
  await say(ok ? 'Don\'t turn that one. The order matters. ...There. See?' : 'The one you\'re touching, yes. Stop touching it. ...Okay. There. Second try.', G);
  setF('caseOpen'); sfx('get'); fx.pal = 'red'; await wait(10); fx.pal = 'dmg';
  await say('See? We did it.', C);
  await say('We did.', G);
  await say('Face would have had you try the other sequence.', G);
  await say('He wasn\'t here.', C);
  await say('I\'m just saying.', G);
  await say('You were here. I got the thing. It worked.', C);
  await wait(50);
  const warm = S.honesty >= 4;
  if (warm) {
    await say('Yeah. It worked.', G);
    await say('Can we go now?', C);
    await wait(40);
    await say('Thank you, Carl.', G);
    await say('Okay. Can we go?', C);
    await say('I did have music for this.', G);
    await say('Play it while we\'re leaving.', C);
    await say('Yeah. All right. That could work.', G);
    music('gend'); await wait(240);
  } else {
    await say('Yeah. But hold on. Hold on. This is the finale. There\'s a number. I prepared a number.', G);
    music('gshow'); sfx('ding');
    await say('SPOOKY GHOST BEGINS HIS FINALE NUMBER.');
    const c = ent('carl'); await walk(c, 'DDD'); c.gone = 1; sfx('door');
    await wait(120);
    await say('...and THAT is the show. Thank you. Thank you. Hold it. Hold the applause.', G);
    music(null); await wait(90);
    await say('...Great show, everybody.', G);
    await wait(60);
    await say('You coming? The ship\'s leaving. I\'m the ship. I\'m leaving.', C);
    await say('...Yeah. Yeah, I\'m coming.', G);
    music('gend'); await wait(120);
  }
  await fadeOut(10);
  await gcredits(warm);
}
async function gcredits(warm) {
  music('gend');
  const L = ['SPOOKY GHOST', 'LIVE FROM BEYOND', '', '', 'SPOOKY GHOST', '...HOST, GHOST, BOTH', '', 'CARL', '...THE GUEST', '(ARRIVED LATE)', '', 'FACE', '...CAME BACK', '',
    'CEO LINDA', '...BUILT IT', '', 'YOKO', '...HELPED', '', 'THE WIVES', '...WERE SOMEBODY', '', 'THE CURSE', '...IS NOT HIM', '', 'THE COLLECTORS', '...STILL LOOKING', '',
    'SPECIAL THANKS', 'CHAT', '', '', 'A PRETEND CO. PRODUCTION', '(C)2000', '', '', warm ? 'THANK YOU FOR WATCHING' : 'THANK YOU. HOLD THE APPLAUSE.'];
  let y = H + 10;
  scene = { draw() { cls(3); L.forEach((l, i) => { const yy = y + i * 12; if (yy > -8 && yy < H) ctext(l, yy, l === 'SPOOKY GHOST' || l === 'CHAT' ? 0 : 1); }); } };
  fx.fade = 0; fx.pal = 'red';
  while (y > -L.length * 12 + 60) { y -= .5; await nextFrame(); }
  await wait(180);
  await fadeOut(8);
  if (S.cards.length === 15) await blooper();
  GMETA.endings++; saveGMeta();
  try { localStorage.removeItem('ghost_sav'); } catch (e) {}
  scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['THREE CARTRIDGES.'], 120);
  for (const p of ['dmg', 'pink', 'red']) { fx.pal = p; await wait(30); }
  await showCard(['ONE STUDIO.'], 120);
  await showCard(['PRETEND CO. WILL RETURN.'], 150);
  gtitle(); await fadeIn(4);
}
async function blooper() {
  let t = 0;
  scene = { update() { t++; }, draw() { cls(3); rect(0, 0, W, 9, 3); text('UNCUT - DO NOT AIR', 2, 1, 0); bigblit(SPR.ghostBig[(t >> 3) & 1], 64, 40, 1); } };
  fx.fade = 0; music('gshow'); mus.rate = 1.4;
  await say('ALL 15 CUE CARDS FOUND. THE UNCUT TAPE:');
  for (const c of CARDS) await say(c, G, { auto: 20 });
  mus.rate = 1;
  await say('...Okay I read all of them. In order. Nobody clapped. That\'s fine. I clapped. Internally.', G);
  await fadeOut(6);
}

// ================= START =================
boot();
