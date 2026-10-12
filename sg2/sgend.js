'use strict';
// ================= SPOOKY GHOST 2: the finale, the endings, the credits =================
EPS[7] = { title: 'ANOTHER BOOGALOO', map: 'dept', note: ['NO NOTES.', 'STAY FOR THE SONG.'],
  open: ['Good evening, and welcome to the last LIVE FROM BEYOND.', 'This is the finale. There\'s a number. I prepared a number. It is not the number I prepared.', 'It\'s one song. I looked it up. Three minutes and forty seconds. I have been in meetings that were longer. I have never been in a song that was longer.'],
  cards: [['THE SONG', 'A boogaloo is when somebody moves first and you answer. I\'ve been doing it wrong for years. I move first and nobody answers. And then I leave.', cm('oh', 'the song!!!', 'he gets it'), 1],
    ['THE DOOR', 'There\'s a door. There\'s always a door. She told me where it is. Who tells you where the door is?', cm('someone who isnt scared', 'LINDA', 'huh'), 1],
    ['THE END', '"I KNEW YOU WERE WAITING." ...Skip that one. That one\'s not for the show.', cm('don\'t skip it', 'READ IT', 'coward'), 0]] };
EP_INTRO[7] = async () => {
  await say('The eighties department. After hours. No lasers. No collectors. No shoppers. I\'ve never seen it quiet.', GH);
  await say('The cardboard people along the walls are the people I danced with. Or they\'re cardboard. It might be the same thing.', GH);
  await say('The floor in the middle is where the song is. Go when you\'re ready. I\'m not ready. Go anyway.', GH);
};
const LINDA1 = { id: 'lin1', who: LI, name: 'CEO LINDA', title: 'ANOTHER BOOGALOO', person: 'linda', bpm: 112, rounds: 6, mode: 'cr', feint: .14, keys: ['up', 'down', 'left', 'right', 'a', 'b'], hardKeys: 0, track: 'dfin1', cheer: 'ANOTHER ANOTHER', hint: 'SHE MOVES FIRST. YOU ANSWER.' };
const LINDA2 = { id: 'lin2', who: LI, name: 'CEO LINDA', title: 'ANOTHER BOOGALOO  PART 2', person: 'linda', bpm: 112, rounds: 6, mode: 'fall', keys: ['up', 'down', 'left', 'right', 'a', 'b'], hardKeys: 1, track: 'dfin2', cheer: 'STAY STAY STAY', hint: 'THIS TIME YOU ARE DANCING IT WITH HER.' };
EP_BOSS[7] = async () => {
  music('soft');
  await say('A SINGLE PINK LIGHT. THE CHECKERBOARD FLOOR. A WOMAN IN A POWER SUIT WITH SHOULDERS LIKE A COAT HANGER.');
  await say('You came.', LI);
  await say('Good evening. I came. I\'m here. It\'s me, being here.', GH);
  await say('Don\'t narrate it. And put the voice down.', LI);
  await say('It isn\'t a voice. It\'s my voice.', GH);
  await say('It\'s your good-evening voice. You do it when you\'re scared. I\'d like to talk to the other one.', LI);
  await say('...I\'m not James Bond.', GH);
  await say('No.', LI);
  await say('I\'m maybe thirty percent James Bond.', GH);
  await say('Thirty percent is a lot of James Bond. It\'s also not what I asked. What did you actually do?', LI, { keep: 1 });
  DBG.truth = 2; const w = await choose(['I FOUND YOU EVERYWHERE.', 'I WAS A VERY ROMANTIC MAN.', 'I LEFT. I NEVER CAME BACK TO YOU.']); DBG.truth = undefined; DLG = null;
  if (w === 2) { S.honesty += 2; await say('Thank you.', LI); await say('I found a hundred versions of you and I never went back to the one holding the camera. I\'m sorry. I\'m sorry I made you build a network just so I\'d have a place to look.', GH); await say('I didn\'t build it for that. I built it because I could. ...But yes. I left the light on.', LI); }
  else await say(w === 0 ? 'You did. Every one of me. And not one of them was me.' : 'That\'s the line. I\'d like the answer.', LI);
  await say('I booked the sequel because the only thing you reliably show up for is a stage.', LI);
  await say('That\'s a little insulting. That\'s fair.', GH);
  await say('It\'s one song. It\'s a long one. If you get restless, there\'s a door. Over there. It has always been there. I won\'t stop you.', LI);
  await say('Why would you tell me where the door is?', GH);
  await say('Because I\'m not building you a house with no door. That was the whole problem the first time.', LI);
  await wait(50);
  await say('Somebody moves first, and the other person answers.', GH);
  await say('I\'ll move first.', LI);
  await danceFight(LINDA1, ['Again. I\'m not going anywhere. That\'s the point of me.', 'You\'re listening. Keep listening. That\'s the whole trick.', 'Again. From the top. You\'re doing fine. You\'re in your feet.']);
  // halfway: the door lights up
  music('soft');
  sfx('door'); banner('THE DOOR IS OPEN', 160);
  await say('THE EXIT SIGN ON THE LEFT WALL LIGHTS UP. THE SONG IS NOT OVER. IT IS JUST QUIET FOR A MOMENT.');
  await say('That\'s half. This is where you go.', LI);
  const stay = await ask('THE DOOR IS OPEN. THE SONG ISN\'T OVER.', null, ['STAY FOR THE SONG', 'EXIT, STAGE LEFT', 'CANCEL THE SHOW']);
  if (stay === 1) { S.endKey = 'encore'; return; }
  if (stay === 2) { S.endKey = 'canceled'; return; }
  await say('You\'re staying.', LI);
  await say('I\'m staying. I can see the door. I know where it is. I\'m staying anyway.', GH);
  S.honesty++;
  await say('Then the second half is the dance you do with me. Not at me. With.', LI);
  await danceFight(LINDA2, ['Again. Don\'t leave. I can see you thinking about leaving.', 'You\'re ahead of me. Wait for me. The point is we get there together.', 'Again. It\'s the second half. It\'s harder. Everything is harder in the second half.']);
  S.endKey = 'stayed';
};
EP_OUTRO[7] = async () => {
  const warm = S.honesty >= 10, k = S.endKey || 'stayed';
  music(null);
  if (k === 'stayed') {
    await wait(60);
    await say('THE SONG ENDS. THE FLOOR GOES QUIET. THE PINK LIGHT STAYS ON.');
    await say('That\'s the whole song?', GH);
    await say('That\'s the whole song.', LI);
    await say('I stayed.', GH);
    await say('You stayed.', LI);
    await say('It was longer than I thought.', GH);
    await say('They usually are.', LI);
    if (warm) {
      await say('You said "sorry" to a lot of people this month.', LI);
      await say('It\'s a new thing. I\'m workshopping it.', GH);
      await say('Keep workshopping. You only did the voice twice tonight.', LI);
      await say('Three times. The third one was in my head.', GH);
      await say('Is there another one? A song.', GH);
      await wait(40);
      await say('Ask me Thursday.', LI);
    } else {
      await say('It\'s a start.', LI);
      await say('A start. Okay. I can do a start.', GH);
    }
    music('credits');
  } else if (k === 'encore') {
    music('dfin2'); await wait(30);
    await say('Thank you! Thank you, everybody! Hold the applause. Hold it. Keep holding it.', GH);
    await say('HE TAKES A BOW. HE FLOATS TOWARD THE EXIT SIGN. HE LOOKS BACK ONCE. THE MUSIC KEEPS GOING. HE LEAVES.');
    sfx('door'); music(null); await wait(80);
    await say('SHE DANCES A FEW BARS ALONE. SHE DOES NOT LOOK AT THE DOOR. THEN SHE DOES.');
    await say('Great show.', LI);
    music('credits');
  } else {
    sfx('static'); post.flash = .6; await wait(8); post.flash = 0; music(null);
    await say('You can\'t cancel a song.', LI);
    await say('Watch me.', GH);
    await wait(40);
    await showCard(['THE SHOW', 'HAS BEEN CANCELED.'], 130, { fg: hex('#ff4949') });
    await showCard(['IT WAS A SEQUEL.', 'THEY GET CANCELED', 'ALL THE TIME.'], 140, { fg: UI.dim });
    music('sad');
  }
};
async function endings() { return credits(S.endKey || 'stayed'); }
async function credits(k) {
  DBG.credits = 1;
  const warm = S.honesty >= 10;
  const L = ['SPOOKY GHOST 2', 'ANOTHER BOOGALOO', '', '', 'SPOOKY GHOST', '...THE NAME IS GHOST', '', 'CEO LINDA', '...HELD THE CAMERA', '', 'ALSO CEO LINDA', '...AND LINDA, AND LINDA', '', 'FACE', '...ASKED ONCE', '', 'THE CHOREOGRAPHER', '...LED', '', 'THE CALL-IN HOST', '...PICKED UP', '', 'THE JUDGE', '...KEPT THE RECORD', '', 'PATTY', '...TOOK FIVE', '', 'THE COLLECTORS', '...STILL LOOKING', '', 'THE MAGICIAN', '...ON TAPE', '', 'SPECIAL THANKS', 'CHAT', 'THE SEQUEL COMMITTEE', 'THE ROAD', '', '', 'A PRETEND CO. PRODUCTION', '(C)2001', 'NOW IN COLOR', '', '', k === 'stayed' ? (warm ? 'THANK YOU FOR STAYING' : 'THANK YOU FOR WATCHING') : k === 'encore' ? 'GREAT SHOW, EVERYBODY.' : 'THIS SHOW HAS BEEN CANCELED.'];
  let y = H + 10, t = 0;
  scene = { update() { t++; }, draw() {
    skyD(0, H, '#000024', '#49006d'); for (let i = 0; i < 40; i++) pset((i * 53 + t) % W, (i * 29 + (t >> 1)) % H, i % 5 ? hex('#9292db') : WHITE);
    L.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy | 0, l === 'SPOOKY GHOST 2' || l === 'ANOTHER BOOGALOO' ? hex('#ff49db') : l === 'SPOOKY GHOST' || l === 'CHAT' || l === 'CEO LINDA' ? hex('#ffff49') : hex('#e8e8ff')); });
  } };
  post.fade = 0; if (k !== 'canceled') music('credits');
  while (y > -L.length * 14 + 80) { y -= .5; await nextFrame(); }
  await wait(180);
  await fadeOut(.04);
  if (S.cards.length >= CARDS.length) await clipShow();
  GMETA.ends[k] = 1; if (S.cards.length >= CARDS.length) GMETA.ends.clip = 1; saveGMeta();
  try { localStorage.removeItem('sg2_save'); } catch (e) {}
  scene = { draw() { cls(BLACK); } }; post.fade = 0; music(null);
  await showCard(['FOUR CARTRIDGES.'], 110);
  await showCard(['ONE STUDIO.'], 110);
  await showCard([k === 'stayed' && warm ? 'SEE YOU THURSDAY.' : 'PRETEND CO. WILL RETURN.'], 150);
  DBG.end = 1;
  titleScreen();
}
async function clipShow() {
  let t = 0;
  scene = { update() { t++; }, draw() { skyD(0, H, '#240049', '#000024'); rectA(0, 0, W, 16, BLACK, .7); text('THE CLIP SHOW - UNCUT - DO NOT AIR', 6, 5, hex('#ff49db')); drawScaled(SG.ghost.d[(t >> 3) % 3], 120, 60, SGP.ghost, 3); } };
  post.fade = 0; music('show'); mus.rate = 1.3;
  await say('ALL ' + CARDS.length + ' CUE CARDS FOUND. THE UNCUT TAPE:');
  for (const c of CARDS) await say(c, GH, { auto: 22 });
  mus.rate = 1;
  await say('...Okay I read all of them. In order. Nobody clapped. That\'s fine. I clapped. Internally.', GH);
  await fadeOut(.06);
}
