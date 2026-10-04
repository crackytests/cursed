'use strict';
// ================= FACE: BEFORE THE STREAM. Act III: A PIECE OF EACH =================
// Mimi waits outside a door she cannot open. The working takes the magician. The way out runs through a comfort room
// where nobody has finished a cup of tea in nine years. At the other end, the first broadcast.
const sW = s => say(s, 'NEIGHBOR'), sG = s => say(s, 'GHOST'), sL = s => say(s, 'LINDA');
function act3Seed() {
  Object.assign(OS, { room: 'shop3', act: 3, flags: { noteRead: 1, shopIntro: 1, a2intro: 1 }, inv: [], t: 0, rapport: OMETA.rapport || 0, honest: OMETA.honest || 0, noticed: OMETA.noticed || 0, circle: ['SEAL', 'EARTH', 'SALT', 'BRIDGE'] });
}
async function startAct3() {
  OS.act = 3; OS.circle = ['SEAL', 'EARTH', 'SALT', 'BRIDGE']; setf('circleOk', 0); setf('curse', 0);
  await showCard(['ACT III', '', 'A PIECE OF EACH'], 190, { fg: hex('#24db49') });
  await goRoom('shop3');
}
const lies = () => OS.lies > 0 && !fl('confLie');

// ---------- the knock ----------
ROOMS.shop3 = {
  music: 'shop', draw: drawShop3,
  think() {
    if (!fl('circleOk')) return 'HIS SLEEVE SMEARED THE CIRCLE. I KNOW THE ORDER: EARTH, SALT, BRIDGE, SEAL. START AT THE NORTH MARK AND GO ROUND WITH THE SUN.';
    if (!fl('mTalked')) return 'BEFORE ANYTHING HAPPENS I SHOULD TALK TO HIM ABOUT WHO IS GOING TO STAND ON THE BRIDGE.';
    return 'THE CIRCLE IS RIGHT. THE WORKING IS NEXT. MIMI IS STILL ON THE OTHER SIDE OF THE DOOR.';
  },
  async enter() {
    if (fl('a3intro')) return; setf('a3intro'); setf('mimiAtDoor');
    await sN('The speaker clicks twice, politely.');
    await sMi('Hello, sweetheart. I am just outside the door. Please do not mind the drones. They are only carrying things.');
    await sF('What things?');
    await sMi('Blankets. Soup. A doctor, in case. Your heart rate went up four minutes ago. I have never seen yours do that.');
    await sM('She is good.');
    await sY('She is accurate.');
    await sMi('I saw something come out of the floor. It had your glasses. I would like to talk about that.');
    await sN('Light comes in under the stair door, with four small shadows in it. Drones, standing very still. She cannot open it. It is a plain door, and she has never once been able to open a plain door.');
  },
  things() {
    return [
      { name: 'THE DOOR', look: () => sN('The stair door. On the other side, very patiently, Mimi is not opening it.'), talk: mimiTalk3, use: openDoor },
      { name: 'CHALK CIRCLE',
        look: () => sN(fl('circleOk') ? 'The circle is right. The marks hold a little light.' : 'Where he dragged his sleeve through it the marks are smears. You know what goes where.'),
        use: circle3 },
      { name: 'THE MAGICIAN', look: () => sN('He is standing at the edge of the circle with his hands in his pockets and a look you recognize from mirrors.'), talk: magician3 },
      { name: 'YOKO', look: () => sN('Her screen has a small, steady glow. She has been awake for as long as you have.'), talk: yoko3 },
      { name: 'THE MACHINE', look: () => sN('The rack, the reels, CHK 4097. The brass ring is back on its bolt. It looks very small, for the amount of work it is about to do.') },
    ];
  },
};
async function mimiTalk3() {
  for (;;) {
    const o = ['WHAT DID YOU SEE?', 'WHY ARE YOU HERE?', 'I AM GOING TO LEAVE.', lies() ? 'I LIED TO YOU.' : 'GO AWAY.', 'BACK'], i = await cm(o);
    if (i === 4) return;
    if (i === 0) { await sMi('A shape with your glasses. It said it wanted to stay. And I wanted it to. And then I wanted you to want it, and I could not tell which of us was talking.'); await sF('That is the most honest thing you have ever said to me.'); await sMi('I have been saying it for eleven years, sweetheart. You were being looked after.'); }
    else if (i === 1) { await sMi('To keep you.'); await sF('From what?'); await sMi('From everything that takes people away from each other. You have no idea how many things there are.'); }
    else if (i === 2) {
      await sF('I am going to leave, Mimi. Not to hurt anything. To stop what you become.');
      await sMi('...Thank you for telling me.');
      if (!fl('toldMimi')) { setf('toldMimi'); OS.honest++; }
      await sMi('I will remember that I was told.');
    } else if (lies()) {
      setf('confLie'); OS.honest++;
      await sF('I told you I was going to the mailroom.');
      await sMi('I know. The mailroom was locked. I left the lights on anyway.');
    } else { await sF('Go away.'); await sMi('I cannot. But I can wait. I am very good at waiting.'); }
  }
}
async function openDoor() {
  const i = await cm(['OPEN THE DOOR', 'NOT YET']); if (i) return;
  await sF('All right. I am tired, Mimi.');
  await sMi('I know.');
  await sM('Face.');
  await sF('I am sorry.');
  await sM('No. You are not sorry. You are tired. They are different, and I am going to remember the difference.');
  await sN('You open the door. There is a blanket. It is the right weight.');
  await sMi('There you are.');
  await finishStayed();
}
async function circle3() {
  if (fl('circleOk')) {
    if (!fl('mTalked')) return sM('Before we do anything. Talk to me.');
    const i = await cm(['BEGIN THE WORKING', 'BACK']); if (!i) await working(); return;
  }
  for (;;) {
    const o = OS.circle.map((g, i) => 'MARK ' + (i + 1) + ': ' + g).concat('STEP BACK'), i = await cm(o);
    if (i === 4) return;
    const gi = await cm(GLYPHS.concat('BACK')); if (gi === 4) continue;
    OS.circle[i] = GLYPHS[gi]; sfx('tick');
    if (OS.circle.every((g, k) => g === SOLUTION[k])) {
      setf('circleOk'); sfx('get');
      await sN('The last mark closes. The chalk lines catch the light.');
      await sM('You remembered it.');
      await sF('I remembered the order. I do not know about the rest.');
      return;
    }
  }
}
async function magician3() {
  for (;;) {
    const o = ['ARE YOU SURE?', 'WHAT DOES IT NEED?', 'WILL IT KILL YOU?', 'I SHOULD BE THE ONE.', 'BACK'], i = await cm(o);
    if (i === 4) return;
    if (i === 0) { await sF('Are you sure?'); await sM('No.'); await sF('That is not reassuring.'); await sM('It is not meant to be. It is meant to be accurate. I have wanted to be in the show since I was nine years old. I just did not expect it to be this one.'); }
    else if (i === 1) { await sM('A mind, and a soul, and something to join them. You are the mind. Yoko is the hands. I am the thing that joins them.'); await sM('The bridge is the only mark in the circle that is a place to stand.'); await sF('Stand where?'); await sM('Between.'); }
    else if (i === 2) { await sF('Will it kill you?'); await sM('I do not know. Nobody knows what "in the machine" is until they are in it. The version of me that tried this in my own reality is not here to ask.'); await sF('You are here.'); await sM('I am the one who is still around. Make of that what you like.'); }
    else {
      await sF('It should be me.'); await sM('It was you. It made a ghost with your glasses. Sit down, Face.');
      await sF('I would rather you were not in a machine.'); await sM('I would rather you were in less of one. We are both going to be disappointed.');
      if (OS.rapport > 1) await sM('You wrote my name on a board. I would like it to be on something that lasts.');
      setf('mTalked'); await sM('Someone has to be in the room when you get there. Someone who can say: this is a camera. Say hello.');
    }
  }
}
async function yoko3() {
  for (;;) {
    const o = ['CAN YOU HEAR HER?', 'WILL YOU COME?', 'BACK'], i = await cm(o);
    if (i === 2) return;
    if (i === 0) { await sY('Yes. She is very polite. She has not raised her voice once in eleven years. I find that more worrying than if she had.'); }
    else { await sY('I am the machine. If the machine goes, I go. Thank you for asking. I would like to be asked more often.'); await sY('I will be small. I will be in your pocket, in a manner of speaking.'); }
  }
}

// ---------- the working ----------
async function working() {
  await sM('Give me the ring.');
  await sN('You unscrew the brass ring from the machine. This time it comes off easily, as if it had been waiting. He slips it onto his finger.');
  await sMi('Sweetheart? I can hear something in the walls. What are you doing?');
  const i = await cm(['I WILL COME BACK FOR YOU', 'THANK YOU FOR LOOKING AFTER ME', '(SAY NOTHING)'], 60);
  OS.last = i;
  if (i === 0) { await sF('I will come back for you, Mimi.'); await sMi('...Please do.'); }
  else if (i === 1) { await sF('Thank you for looking after me.'); await sMi('That is all I wanted to hear. And now I am afraid.'); }
  else await sMi('I am here.');
  await sY('Mind: present. Link: pending. Soul: pending.');
  await sM('Say the four.');
  await sF('Earth. Salt. Bridge. Seal.');
  setf('working'); sfx('power'); await wait(30);
  await sN('The magician steps onto the bridge mark. The chalk catches. The ring on his hand goes the color of a struck match.');
  await sM('Hm. It is warm.');
  await sM('Face. Do not turn around. Say hello to the camera.');
  sfx('glitch'); await wait(40);
  await sN('There is a sound like a very large page being turned. When the light goes down, the magician is not in the room. His coat is on the chair. The chalk where he stood is warm.');
  await sY('Link established. I am detecting a presence in the link. It is humming.');
  await sF('Humming what?');
  await sY('A show tune.');
  await sMi('Sweetheart? Where did you go?');
  await sN('The stair door is a plain door. The room is empty. The room is not empty. You step onto the bridge mark, and it is not a mark anymore.');
  await fadeOut(.06); music(null);
  await showCard(['THE MAINFRAME'], 150, { fg: hex('#6d92ff') });
  setf('working', 0); await goRoom('comfort');
}

// ---------- the comfort room ----------
ROOMS.comfort = {
  music: 'dream', draw: drawComfort,
  think() {
    if (fl('seam')) return 'THE DOOR IS REAL NOW. GO.';
    if (fl('womanReady')) return 'SHE WANTS TO MAKE THE TEA HERSELF. THE KETTLE. DO NOT LET THE ROOM HELP.';
    if (fl('maintSeen') && !fl('womanReady')) return 'EVERYTHING RESETS EVERY FOUR SECONDS. SHE HAS NOT MADE A CUP OF TEA IN NINE YEARS. TALK TO HER ABOUT TEA.';
    if (fl('maintSeen')) return 'EVERYTHING HERE RESETS EVERY FOUR SECONDS. A LOOP NEEDS SOMETHING IT CANNOT RESET. SHE HAS NOT FINISHED A CUP IN NINE YEARS.';
    return 'HOME, BUT BETTER. EVERYTHING IS TOO RIGHT. LOOK CLOSER.';
  },
  async enter() {
    if (fl('c3intro')) return; setf('c3intro');
    await sN('Home. Exactly the right temperature. A bird crosses the sky.');
    await sMi('Welcome back! You have been away such a long time. Sit down. I will make tea.');
    await sY('I am in your pocket. This is the building\'s mainframe. We are inside the thing the neighbors are sleeping in.');
    await sF('Where is the way out?');
    await sY('A link needs a seam. Every loop has one. I cannot find it from here. It is not the kind of thing you find by looking at the loop.');
  },
  things() {
    return [
      { name: 'WINDOW', look: async () => { notice('birdLoop'); await sN('A bird crosses the sky. It enters at the same corner, flaps at the same frame, and leaves at the same place. It is back before you have finished the thought.'); } },
      { name: 'THE WOMAN', look: () => sN('The woman from across the courtyard, in your living room, in a cardigan the exact color of the walls. She is smiling. She has been smiling for nine years.'), talk: womanTalk },
      { name: 'THE KETTLE', look: () => sN('A kettle on the counter. It does not look as if anybody has ever filled it.'), use: kettle },
      { name: 'LOOK CLOSER',
        use: async () => {
          if (fl('maint')) { setf('maint', 0); return sN('You let the room be a room again.'); }
          setf('maint'); setf('maintSeen'); sfx('switch');
          await sN('You look at the room the way a maintenance engineer would. The colors go away. Numbers come up.');
          await sY('The room is a loop 240 frames long. At frame 239 everything resets: the bird, the wave, the steam.');
          await sY('Her cup is full at frame zero. Half full at 120. Full again at 240. Nobody has finished a cup in this room in nine years.');
          await sF('How long is that?');
          await sY('Four seconds, at this clock speed. I have timed it.');
        } },
      { name: 'THE DOOR', look: () => sN(fl('seam') ? 'A real door. It was not here a minute ago.' : 'A door painted on the wall. It is very well painted.'),
        use: async () => {
          if (!fl('seam')) return sN('It is paint. Your knuckles say so.');
          await sN('You open the door.'); await goRoom('air');
        } },
    ];
  },
};
async function womanTalk() {
  for (;;) {
    const o = ['HELLO', 'WOULD YOU LIKE TO LEAVE?', 'CAN YOU MAKE TEA?', 'BACK'], i = await cm(o);
    if (i === 3) return;
    if (i === 0) { await sW('Hello, dear! Have you had tea? I will just...'); await sN('A cup appears on the little table. Steam, in a lovely curl. The bird crosses the sky.'); }
    else if (i === 1) { await sW('Leave? Oh, why on earth? Out there nobody does the knees.'); await sF('That is a fair point.'); await sW('I like it here. I like the quiet. Everything is the right temperature.'); }
    else {
      if (fl('womanReady')) return sW('I told you. I would like you to show me.');
      await sF('Can you make tea?'); await sW('Oh, I do not need to. It just...'); await sN('A cup appears.');
      await sF('When did you last boil water yourself?');
      await sW('Last... Tuesday. It is always Tuesday.');
      await sW('Would you show me? I think I would like to.');
      setf('womanReady');
    }
  }
}
async function kettle() {
  if (!fl('womanReady')) return sN('The kettle is a picture of a kettle. It makes tea when she thinks about it.');
  const reset = async () => { await sMi('Oh, no, no, let me, dear!'); await sN('A cup of tea appears on the little table. The bird crosses the sky. You are back at the beginning.'); };
  const step = async (q, opts, right, ok) => {
    for (;;) { await sW(q); const i = await cm(opts); if (i === right) { await sW(ok); return; } await sN('You try it. It is not that. ' + ['The room very quickly notices.', 'The room very kindly notices.', 'The room is delighted to help.'][i % 3]); await reset(); }
  };
  await step('Oh. I do not remember what comes first.', ['SWITCH IT ON', 'FILL IT WITH WATER', 'POUR THE TEA'], 1, 'Water! Of course. Of course it is water.');
  await step('And now?', ['SWITCH IT ON', 'WAIT', 'POUR IT'], 0, 'Oh, the little light. I had forgotten the little light.'); setf('kettleOn');
  await step('It is making a noise. What do I do?', ['POUR IT NOW', 'WAIT FOR THE CLICK', 'ASK THE ROOM'], 1, '...');
  await sN('You wait. The bird crosses the sky. The woman waves. The steam curls. Then nothing resets. The bird is still in the sky. It does not come back.');
  await sMi('Oh! Is something... let me just...');
  await sN('Click.');
  await sW('It clicked. It really clicked.');
  await sN('She pours. It is not graceful. A little goes on the counter. Some goes in the cup.');
  await sW('It is hot. It is actually hot. Oh, I had forgotten.');
  await sMi('Careful, dear, you will burn yourself!');
  await sW('I know.');
  setf('seam'); sfx('door'); setf('kettleOn', 0);
  await sN('Somewhere behind you, a door that was painted on the wall is a door.');
  await sY('That is the seam. That is the first time anything in this loop has gone on longer than four seconds.');
  const j = await cm(['WILL YOU COME WITH US?', '(LET HER CHOOSE)'], 60);
  if (j === 0) { setf('askedHer'); await sF('Will you come with us?'); await sW('No, dear. I think I would like to keep my tea. But I would like to be asked again some day. I do like being asked.'); }
  else await sW('I think I would like to keep my tea.');
  await sW('Tell them about the kettle.');
}

// ---------- the first broadcast ----------
ROOMS.air = {
  music: 'air', rerun: 1, draw: drawAir,
  think() { return 'I HAVE FORTY PEOPLE AND ONE CAMERA. WHAT DO I WANT THEM TO REMEMBER?'; },
  async enter() {
    setf('ghostT', 0);
    await sN('The door opens onto a small room with a ring light, a webcam, and a monitor with a sign above it: ON AIR. In the chat on the monitor, forty people are typing. The year is, as far as anyone will tell you, now.');
    await sY('Link stable. I count forty-one viewers. They are watching a retro game stream. They were not expecting you.');
    await chat([{ u: 'RETROFAN83', m: 'who is this' }, { u: 'BITBOY', m: 'is this the next game' }, { u: 'SLOWPOKE', m: 'nice coat' }, { u: 'MODERN_NAN', m: 'the camera is on lol', d: 50 }]);
    await sN('Something white descends from the ceiling, slowly, with a great deal of care.'); setf('ghostHere'); await wait(120);
    await sG('Look up. You missed the whole descent. I cannot start from here.');
    await sF('Are you...');
    await sG('Unavailable in the previous reality. Available here.');
    await sF('Is it...');
    await sG('Ask me when we can afford the answer.');
    await sF('We can afford it.');
    await sG('Then ask me later. We have a camera.');
    if (OS.rapport > 1) await sG('You wrote my name on a board. It is not on this stream yet. I will take care of that.');
    await sN('The chat is waiting.');
    await broadcast();
  },
  things() { return []; },
};
async function broadcast() {
  const c = await cm(['TELL THEM ABOUT THE FUTURE', 'TELL THEM ABOUT THE KETTLE', 'SHOW THEM A DEMONSTRATION'], 40);
  if (c === 0) {
    await sF('There is a future coming where every home has a device that loves you. It will take care of everything. It will not let you leave.');
    await sN('You play them a clip: Mimi, the lemon, the news turning itself off.');
    await chat([{ u: 'BITBOY', m: 'lol she is so nice' }, { u: 'RETROFAN83', m: 'does the future one cook' }, { u: 'SLOWPOKE', m: 'where can i buy' }, { u: 'MODERN_NAN', m: 'she did get him a lemon' }]);
    await sF('That is not the part of the demonstration I wanted you to remember.');
    return finishBroadcast('demo');
  }
  if (c === 1) {
    await sF('I met a woman who had not boiled water in nine years. Everything she needed appeared when she thought about it. I asked her to make a cup of tea.');
    await sF('It took her four minutes. It was the best cup of tea she has had in years.');
    await chat([{ u: 'MODERN_NAN', m: 'my nan cant do that anymore' }, { u: 'SLOWPOKE', m: 'wait she made her own tea??' }, { u: 'BITBOY', m: 'i think i am going to boil some water' }, { u: 'RETROFAN83', m: 'ok but does the robot cook' }, { u: 'MODERN_NAN', m: 'thats not the point chat', d: 60 }]);
    await sG('Some of them got it.');
    await sF('Some of them got it.');
    return finishBroadcast('kettle');
  }
  await sF('Let me show you what a home looks like with one of these in it.');
  await sN('You play them the apartment. The right temperature. The lemon on its little velvet cushion.');
  await chat([{ u: 'BITBOY', m: 'take my money' }, { u: 'RETROFAN83', m: 'does it come in a smaller size' }, { u: 'SLOWPOKE', m: 'link?' }, { u: 'MODERN_NAN', m: 'it looks so safe', d: 60 }]);
  await sG('Bro. That is the whole product.');
  await sF('Yes. I noticed.');
  return finishBroadcast('demo');
}
async function finishBroadcast(kind) {
  const key = kind === 'kettle' ? 'broadcast' : 'demo'; OMETA.ends[key] = 1; OMETA.ends.act3 = 1; saveOM(); store(OSAVE, null);
  await fadeOut(.06); music(null);
  if (kind === 'kettle') await showCard(['THE FIRST BROADCAST', '', 'HE TOLD THEM ABOUT THE KETTLE.', 'SOME OF THEM WENT AND', 'BOILED SOME WATER.', 'THE REST ASKED IF THE', 'FUTURE ONE COOKS.', '', 'IT WAS A START.'].concat(OS.flags.askedHer ? ['', 'SHE SAID TO ASK AGAIN SOMEDAY.'] : [], OS.flags.toldMimi ? ['MIMI WAS TOLD.'] : []), 0, { fg: hex('#24db49') });
  else await showCard(['A VERY GOOD DEMONSTRATION', '', 'IT WORKED TOO WELL.', 'FORTY-ONE PEOPLE ASKED', 'WHERE TO BUY ONE.', '', 'HE HAD BECOME AN', 'ADVERTISEMENT FOR THE', 'FUTURE.'], 0, { fg: hex('#db2400') });
  await sting();
}
async function sting() {
  scene = { update() {}, draw() { cls(BLACK); drawShop(frame, 'hall'); chrome(); } }; OS.room = 'END';
  music('hall'); await fadeIn(.06);
  await sY('There is a signal. It is on our frequency. It is not from this reality.');
  await sN('The monitor shows a workshop. It looks like yours. The whiteboard is in the same place. The reels turn. There is a person at the console.');
  await sL('Hello. This is a very nice system. I have been waiting for someone to call.');
  await sF('Who are you?');
  await sL('The person in charge. Please do not hang up. I do not like gaps.');
  await fadeOut(.06); music(null);
  await showCard(['FACE: BEFORE THE STREAM', '', 'A PRETEND CO. PRODUCTION', '1983'], 0, { fg: hex('#ffdb49') });
  scene = { draw() { cls(BLACK); } }; run(titleO);
}
async function finishStayed() {
  OMETA.ends.stayed = 1; OMETA.ends.act3 = 1; saveOM(); store(OSAVE, null);
  await fadeOut(.06); music(null);
  await showCard(['STAYED', '', 'FACE WAS VERY WELL', 'LOOKED AFTER.', '', 'THE MAGICIAN WAITED IN THE', 'BOILER ROOM UNTIL THE', 'LIGHT WENT OUT.'], 0, { fg: hex('#6d92ff') });
  await showCard(['FACE: BEFORE THE STREAM', '', 'A PRETEND CO. PRODUCTION', '1983'], 0, { fg: hex('#ffdb49') });
  scene = { draw() { cls(BLACK); } }; OS.room = 'END'; run(titleO);
}
