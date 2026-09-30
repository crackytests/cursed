'use strict';
// ================= WORLD PART 2: desert, facility, the box, ending =================
function grid(w, h, fill, marks, over = {}) {
  const g = Array.from({ length: h }, (_, y) => over[y] || fill.repeat(w));
  return g.map((r, y) => { const a = [...r]; for (const [x, yy, ch] of marks) if (yy === y) a[x] = ch; return a.join(''); });
}
TILES.cactus.look = ['The cactus says: KEKW.', 'The cactus says: "first".', 'The cactus is typing...', 'The cactus says: carl is short.', 'The cactus has been banned.', 'The cactus says: "i had this game as a kid".'];

// ---------- THE DESERT ----------
MAPS.desert = {
  title: 'NEVADA (ABOVE)', music: 'desert',
  rows: grid(28, 18, ',', [
    [4, 0, 'c'], [13, 0, 'q'], [22, 0, 'c'], [9, 1, 'e'], [27, 1, 'c'], [1, 2, 'c'], [19, 2, 'c'], [11, 3, ';'], [25, 3, 'e'],
    [4, 5, 'V'], [18, 5, 'T'], [3, 9, 'c'], [12, 9, 'e'], [24, 9, 'q'], [9, 11, 'q'], [18, 11, 'c'], [1, 12, 'u'],
    [24, 13, 'e'], [5, 14, 'c'], [15, 15, 'q'], [26, 15, 'c'], [7, 16, ';'], [2, 16, 'e'],
  ], { 6: '-'.repeat(28), 7: '~'.repeat(28), 17: 'q'.repeat(28) }),
  ents: () => [
    { id: 'bus', x: 8, y: 6, w: 3, h: 1, spr: 'bus', talk: busTalk },
    { id: 'hitch', x: 19, y: 5, spr: 'hitch', talk: hitchTalk },
    { id: 'pod', x: 1, y: 12, spr: 'pod', talk: podTalk },
    ...[[14, 8], [15, 9], [16, 10], [17, 11], [18, 12], [19, 13], [20, 14], [21, 15]].map(([x, y], i) => ({ id: 'pr' + i, x, y, spr: 'prints', haze: 1, solid: false, floor: 1, flip: i & 1 })),
    { id: 'hatch', x: 22, y: 15, spr: 'hatch', haze: 1, keep: 'hatchSeen', floor: 1, talk: hatchTalk },
    { id: 'wisp', x: 20, y: 11, spr: 'ghost', haze: 1, solid: false, bob: 1, pmap: [0, 1, 1, 2], talk: async () => {
      await say('...down here... carl... you know the way down...', 'SPOOKY GHOST', { slow: 1 });
      await say('I don\'t know the way down! I know the way UP! I left! That\'s the one thing I did!', C);
    } },
  ],
  signs: { '4,5': () => say('LAS VEGAS ' + (360 - ((F('miles') || 0) % 360)) + ' MI'), '18,5': () => say('BUS STOP. NEXT BUS: 8 HOURS. (9?)') },
  exits: {
    right: async () => { setF('miles', (F('miles') || 0) + 30); P.x = 0; P.px = 0; if ((F('miles') || 0) % 90 === 0) await say(pick(['More road. It\'s the same road. I recognize that rock. That rock recognizes me.', 'Chat, how far did we go? Don\'t say zero. Don\'t you dare say zero.']), C); },
    left: async () => { P.x = M.w - 1; P.px = P.x * TS; },
    up: () => say('Above Nevada is... up. I can\'t go up. I don\'t have the ship. The ship has me. Wait.', C),
    down: () => {},
  },
  enter: async () => {
    await wait(30);
    await say('...Okay. Okay. This is sand. This is a lot of sand.', C);
    await say('This is Nevada. I know this. I know this sand. Don\'t ask me how. Chat, don\'t ask.', C);
    await say('There\'s a bus. Why is there a bus. I\'ve been on this bus.', C);
  },
};
async function busTalk() {
  await say('DESERT BUS. The door is open. The driver\'s seat is warm.');
  await say('I drove this. I drove this for eight hours and nothing happened. Nine. That\'s where I got like this. Talking. To you guys. Because nothing happened.', C);
  if (await ask('Drive the bus?', null, ['DRIVE', 'NO']) !== 0) return say('No. Never again. I have trauma. Bus trauma. It\'s a real thing.', C);
  const mi = await desertBus();
  if (mi >= 50) { await say('Fifty miles. FIFTY. There\'s a tape deck in the dash. There\'s a tape in it.', C); await giveTape(5); }
  else await say(pick(['...Why did I do that. Why did you let me do that. It pulls to the right, chat. It ALWAYS pulls to the right.', 'Fifty miles. That\'s all I want. Fifty miles of nothing. I did it before. I can do it again.']), C);
}
async function hitchTalk() {
  const n = F('hitch') || 0; setF('hitch', n + 1);
  const H_ = 'HITCHHIKER';
  if (n === 0) { await say('You\'ve been walking a long time.', H_); await say('I just got here.', C); await say('That\'s what you said last time.', H_); return say('Why does EVERYBODY keep saying that!', C); }
  if (n === 1) { await say('Vegas is 360 miles. Always 360. People don\'t go to Vegas. They go under it.', H_); await say('Under Vegas?', C); await say('Under all of it. Above and below, kid. You know that. You wrote it on your hat.', H_); return say('I didn\'t write anything on my hat. ...Did I write something on my hat?', C); }
  if (n === 2) { await say('Smoke \'em if you got \'em. Things show up in the smoke that don\'t show up in the sun.', H_); return say('Are you telling me to smoke? An adult is telling me to smoke? Chat, this is the best day of my life.', C); }
  if (n === 3) {
    await say('It\'s ' + clock() + ' where the other one is.', H_); await say('What other one?', C); await say('The one holding you.', H_);
    return say('...Nobody\'s holding me. I\'m standing. I\'m standing up by myself. Look.', C);
  }
  if (F('won_hitch')) return say(pick(['Diner\'s just up the road. East. Tell Garf I said nothing.', 'Things show up in the smoke, kid. Remember that.']), H_);
  await say('You wanna argue about it, kid? Go on. I\'ve got nowhere to be. Nobody out here does.', H_);
  if (await ask('Argue with the hitchhiker?', null, ['ARGUE', 'NO']) !== 0) return;
  if (await argue(FOES.hitch)) { addPretzel(2); sfx('get'); await say('CARL GOT 2 PRETZELS!'); }
}
async function podTalk() {
  if (has('BLANKET')) return say('The pod. It\'s empty now. I took the only thing. Well. It took me first. Whatever.', C);
  await say('A crater. Something crashed in it. Small. Like... me-sized.', C);
  await say('It\'s a normal hole. With a normal human pod in it. Humans have pods.', C);
  await get('BLANKET');
  await say('It\'s red. I know it\'s red. I can\'t see red right now, nothing\'s red, but I know.', C);
  await wait(40);
  await say('I think this is the first thing I remember. Sand. And this. And somebody. Two somebodies. Walking away. Or toward. I don\'t know which.', C);
  await wait(60);
}
async function hatchTalk() {
  setF('hatchSeen');
  await say('A hatch. Under the sand. With a wheel. I know this wheel.', C);
  if (await ask('Open it?', null, ['OPEN', 'NOT YET']) !== 0) return say('Not yet. It\'ll still be here. It\'s always been here. That\'s the problem.', C);
  sfx('door'); setF('act', 3); setF('obj', 'lab');
  await fadeOut(8); await chapter(4, 'BELOW NEVADA');
  await warp('lab', 2, 1, 'down', { sp: 8 });
}

// ---------- THE FACILITY ----------
const LAB_ROWS = ['WWWWWWWWWWWWWWWWWWWWWW', 'W!:::WUUUYUUUWFFmFFWWW', 'W::::W:::::::W:::::WWW', 'W::::W:::::::W:::::WWW', 'W::::WWWW|WWWWWW|WWWWW',
  'W::::::::::::::::::::W', 'W::::::::::::::::::::W', 'WWW|WWWWWWWW|WWWWWW::W', 'W"%::W::::::::::::W::W', 'W::::W::::::::::::W::W',
  'WZ:::W::::::::::::W::W', 'WWWWWW::::::::::::W::W', 'WWWWWW::::::::::::|::W', 'WWWWWW::::::::::::W::W', 'WWWWWWWWWWWWWJJWWWW::W', 'WWWWWWWWWWWWWWWWWWWWWW'];
const guard = (id, x, y, path, o = {}) => Object.assign({ id, x, y, spr: 'suit', path, vision: 3, pause: 30, turns: 1, update: patrol,
  talk: async () => say('...', 'WHITE SUIT') }, o);
MAPS.lab = {
  title: 'BELOW NEVADA', music: 'lab',
  rows: LAB_ROWS,
  ents: () => [
    guard('g1', 6, 6, 'RRRRRRRRRRRR.LLLLLLLLLLLL.', { pause: 20 }),
    guard('g2', 9, 8, 'DDDDD.UUUUU.'),
    guard('g3', 11, 11, 'RRRRRR.LLLLLL.', { pause: 40 }),
    guard('g4', 10, 3, 'l.d.r.d.', { pause: 70, vision: 2 }),
    guard('g5', 20, 6, 'DDDDDDD.UUUUUUU.', { pause: 25 }),
    { id: 'tv', x: 4, y: 10, spr: 'tv', spd: 6, talk: faceTV },
  ],
  signs: {
    '9,1': async () => { await say('TUBE 00. EMPTY. LABEL: "CARL (NOT HIS NAME)". THE GLASS IS BROKEN FROM THE INSIDE.'); await say('From the inside. Good. Good for... whoever. Good for him.', C); },
    '14,1': async () => { await say('FILE: SUBJECT 00. DESIGNATION "CARL". NOTE: NOT HIS NAME. SUBJECT INSISTS IT IS NOT HIS NAME. SUBJECT DOES NOT PROVIDE AN ALTERNATIVE.'); await say('Because I don\'t HAVE to. It\'s none of your business! ...And I don\'t know it. That\'s also a reason.', C); },
    '15,1': async () => { await say('FILE: RECOVERY. SITE: NEVADA DESERT. RECOVERED: ONE (1) SUBJECT. ONE (1) BLANKET. ADULTS: NOT RECOVERED.'); await wait(30); await say('Not recovered. That means they didn\'t find them. That means they\'re still out there. Right? That\'s what that means.', C); },
    '17,1': async () => { await say('FILE: INCIDENT. SUBJECT RELEASED BY STAFF MEMBER "F". STAFF MEMBER TERMINATED.'); await say('Terminated like fired. Like fired-fired. Face got fired. That\'s all that means. Chat, that\'s all that means.', C); },
    '18,1': async () => {
      if (has('BLACKJACK')) return say('Empty drawer. Smells like old leather and bad decisions. My decisions.', C);
      await say('A drawer. Something heavy in it.'); await get('BLACKJACK');
      await say('A blackjack. I\'ve played Thief. I know what this is for. I\'m not saying I\'m going to. I\'m saying it\'s right here.', C);
    },
    '1,8': async () => { await say('Crayon. Two tall ones and a little one. The little one has a cap.'); await say('...I didn\'t draw this. I don\'t draw. I\'d remember.', C); await wait(40); await say('Two tall ones.', C); },
    '2,8': async () => { await say('Tally marks. Hundreds of them. They stop in the middle of a row.'); await say('Somebody stopped counting. Somebody got out.', C); },
    '13,14': elevator, '14,14': elevator,
  },
  steps: { '1,1': () => say('The ladder goes up to the desert. I\'m not going up. We came here for a reason. I forget the reason. Ghost. The reason is ghost.', C) },
  onSmoke: async () => { await say('Not in here. They\'d smell it. They smelled EVERYTHING down here.', C); return false; },
  caught: async e => {
    e.dir = OPP[P.dir] === e.dir ? e.dir : e.dir; sfx('alert'); await emote(e, '!', 40);
    sfx('caught'); await say('SUBJECT OUT OF ROOM.', 'WHITE SUIT');
    await fadeOut(4); loadMap('lab', 2, 9, 'down'); await wait(30); await fadeIn(4);
    await say('SUBJECT RETURNED TO ROOM.');
    await say(nth('caught', ['I\'m back in my room. It\'s my room. I hate that I know it\'s my room.',
      'Okay. They\'re fast. They\'re not fast. I\'m slow. I\'m not slow. It\'s the suits.',
      'Chat, you have to tell me when they\'re looking. That\'s your whole job right now. That\'s all you do.',
      'They only look forward. They never look behind them. ...Relatable.', 'Again. Again. Okay. Again.']), C);
  },
  enter: async () => {
    await say('...Oh no. No no no. I know this. I know this smell. It smells like clean.', C);
    await say('This is the facility. Below Nevada. This is where they kept...', C);
    await say('They can\'t put me back in— anywhere. I haven\'t been anywhere. I\'m from Nevada.', C);
    await say('White suits. If a white suit sees me, it\'s over. Chat, eyes open. Your eyes. Mine are open. Mine are very open.', C);
  },
};
async function faceTV() {
  const tv = ent('tv');
  if (has('KEYCARD')) { tv.spr = 'tv'; return say('Static. He\'s not on anymore. ...It\'s fine.', C); }
  await say('An old TV. It turns on by itself.');
  sfx('static'); SPR.tvFace = [SPR.tv[2]]; tv.spr = 'tvFace'; await wait(30);
  await say('Hey. Hey, kid. If you\'re watching this, you came back. I told you not to come back.', 'FACE');
  await say('Face? FACE! Is that you? You look... you look like a TV.', C);
  await say('It\'s a recording. I can\'t hear you. I know you\'re talking anyway.', 'FACE');
  await say('...Yeah. Yeah, I am.', C);
  await say('I left my keycard. The elevator goes up. Not up-up. Linda\'s up. Whatever you\'re looking for is in her box.', 'FACE');
  await say('And kid. I don\'t know where they are. Your folks. I looked. I\'m sorry.', 'FACE');
  await wait(50);
  await say('...', C);
  await say('It\'s fine. It\'s fine, chat. ...Why does it say "containment" on the TV?', C);
  await say('...Also you still owe me for the ship.', 'FACE');
  await say('I KNEW it. I knew that was coming. Payment is an investment in the future!', C);
  sfx('static'); tv.spr = 'tv';
  await get('KEYCARD'); setF('obj', 'lab2');
}
async function elevator() {
  if (!has('KEYCARD')) return say('An elevator. There\'s a card slot. I have many cards. None of them are this card. Mostly Pokemon.', C);
  await say('The keycard fits. The photo on it is scratched out. The elevator says: UP (LINDA).');
  if (await ask('Ride it?', null, ['UP', 'WAIT']) !== 0) return;
  if (!F('won_boss')) {
    sfx('door'); await wait(30);
    await say('The doors open. Someone is already inside. Their suit is darker than the others.');
    await say('SUBJECT 00. WE WONDERED WHEN YOU WOULD COME HOME.', 'HEAD OF CONTAINMENT');
    await say('This isn\'t home. This is a basement. With tubes. Homes don\'t have tubes.', C);
    if (!await argue(FOES.boss)) { await MAPS.lab.caught(ent('g1')); return; }
    await say('The Head of Containment walks away down the hall, very slowly, writing something.');
    await say('...Did I win? I think I won. Chat, did that count as winning?', C);
  }
  setF('act', 4); setF('obj', 'box');
  await fadeOut(8); await chapter(5, 'THE BOX');
  await warp('box', 7, 12, 'up', { sp: 8 });
}

// ---------- THE BOX ----------
MAPS.box = {
  title: 'LINDA\'S BOX', music: 'box', noise: .015, wave: 1,
  rows: ['&&&&&&&&&&&&&&&&', '&&&&&&****&&&&&&', '&&&&&&****&&&&&&', '&&&&&&*++*&&&&&&', '&&****++++****&&', '&&*&&&*++*&&&*&&', '&&*&&&*++*&&&*&&',
    '&&*&&&*++*&&&*&&', '&&*****++*****&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&&&&&&&&&&&'],
  ents: () => [
    { id: 'core', x: 7, y: 1, w: 2, h: 2, spr: F('coreDown') ? 'coreOff' : 'coreIdle', spd: 20, talk: coreTalk },
    { id: 'sg', x: 2, y: 5, spr: 'ghost', bob: 1, solid: true, talk: ghostTalk },
    { id: 'cage', x: 2, y: 5, spr: 'cage', if: () => !F('cageOpen'), talk: async () => { await say('Carl?! Carl! I\'m in here! It\'s a cage! A cage made of TEXT!', 'SPOOKY GHOST'); await say('Hold on. Hold on, bro. I\'ll figure it out. She\'s got it locked. I\'ll talk to her. I\'m great at talking.', C); } },
    { id: 'c1', x: 13, y: 5, spr: 'bubble', spd: 15, talk: chatBubble },
    { id: 'c2', x: 13, y: 7, spr: 'bubble', spd: 17, talk: chatBubble },
    { id: 'h1', x: 4, y: 8, spr: 'bubble', spd: 13, haze: 1, solid: false, talk: async () => say('HIS REAL NAME IS', '???') },
    { id: 'h2', x: 11, y: 8, spr: 'bubble', spd: 11, haze: 1, solid: false, talk: async () => say('THE PARENTS WERE NOT RECOVERED BECAUSE THEY WERE NEVER', '???') },
    { id: 'h3', x: 6, y: 11, spr: 'bubble', spd: 19, haze: 1, solid: false, talk: async () => say('IT IS ' + clock() + '. YOU SHOULD BE ASLEEP.', '???') },
  ],
  tick() { if (!busy && rnd(1500) === 0) { banner(pick(['WHO IS HOLDING THE CONTROLLER', 'IT IS ' + clock(), 'HE CAN SEE YOU', 'DON\'T LOOK AWAY', 'HELLO CHAT']), 80); sfx('glitch'); } },
  onSmoke: async () => { await say('The smoke is made of text. It spells things. It spells things I didn\'t say.', C); },
  exits: { down: () => say('There\'s no down anymore. Down is up here now.', C) },
  enter: async () => {
    await say('...This is the box. It\'s not a box. It\'s like the inside of a thought.', C);
    await say('Everything\'s written down. The floor is written down. I\'m written down. Chat, are you... you\'re written down too.', C);
  },
};
SPR.coreOff = [SPR.core[1]];
SPR.coreIdle = [0, 0, 0, 0, 0, 0, 1].map(i => SPR.core[i]);
async function chatBubble() {
  await chat([{ u: 'you', m: 'carl can you hear us' }, { u: 'you', m: 'we are in here too' }, { u: 'user_000', m: 'who is holding the controller' },
    { u: 'you', m: 'its ' + clock() }, { u: 'you', m: 'dont trust the ending' }]);
  await say(nth('bubble', ['Chat? Chat\'s in here? Chat, you\'re IN the box? Get out of the box! ...CAN you get out of the box?',
    'Why do you all have the same name. Why is everyone named "you". Who\'s "you"?', 'Stop saying the time. I know the time. I don\'t know the time.']), C);
  if (F('won_troll') || (F('bubble') || 0) < 2) return;
  await say('one of you is not real', 'USER_000');
  if (await ask('Argue with USER_000?', null, ['ARGUE', 'IGNORE']) === 0) await argue(FOES.troll);
}
async function coreTalk() {
  const L = async s => { const c = ent('core'); await say(s, LI); };
  if (F('coreDown')) return say('She\'s off. She\'s just a big dark eye now. I kind of miss the yelling.', C);
  if (!F('verified')) {
    await L('WELCOME TO THE BOX, CARL.');
    await say('Where is he. Where\'s Spooky.', C);
    await L('VERIFICATION REQUIRED. ANSWER THREE QUESTIONS. THEN YOU MAY HAVE HIM.');
    let c = await ask('SPECIES?', LI, ['HUMAN', 'ALIEN', 'NEVADAN']);
    await say(['Human. Obviously. Look at me. No, don\'t look at me. Just take my word.', '...Alien. Okay? Fine. There. I said it. Happy? Nobody clip that.', 'I\'m from Nevada. Above and below. That\'s a place. That counts.'][c], C);
    await L('NOTED.');
    c = await ask('NAME?', LI, ['CARL', 'I DON\'T KNOW', 'NONE OF YOURS']);
    await say(['Carl. Everybody calls me Carl. ...That\'s not the question, is it.', 'I don\'t know. I don\'t know it. ...Next question.', 'None of your business. That\'s my name. None-Of-Your-Business. It\'s Dutch.'][c], C);
    await L('NOTED.');
    c = await ask('WHERE ARE YOUR PARENTS?', LI, ['DEAD', 'STILL LOOKING', '...']);
    if (c === 0) await say('...Probably. Maybe. I don\'t know. I say that sometimes so it doesn\'t... next.', C);
    else if (c === 1) await say('I don\'t know. That\'s why I keep looking. They could be out there somewhere, right?', C);
    else { await say('...', C); await wait(120); }
    await L('VERIFICATION... INCONCLUSIVE.');
    await L('THAT IS ACCEPTABLE. NOBODY IS CONCLUSIVE.');
    sfx('door'); setF('verified'); setF('cageOpen');
    return say('The cage! Spooky! Chat, the cage is open! I did that! I did that by TALKING!', C);
  }
  if (!F('ghostFree')) return L('HE IS FREE. GO TALK TO HIM. I AM BUSY WATCHING.');
  await L('YOU CANNOT LEAVE THE BOX, CARL. THE BOX IS WHERE YOU ARE WATCHED.');
  await L('THEY ARE ALL WATCHING. THEY ARE WATCHING RIGHT NOW.');
  await say('Who? Chat? Chat\'s watching. Chat\'s always watching. That\'s the whole point of chat.', C);
  if (!await argue(FOES.linda)) {
    await fadeOut(4); loadMap('box', 7, 12, 'up'); await fadeIn(4);
    return say('She put me back at the start. That\'s her whole move. Putting people places. Okay. Again. Chat, you gotta be louder this time.', C);
  }
  await say('Linda\'s eye is flickering. One more push.', C);
  const opts = has('BLACKJACK') ? ['HIT HER', 'TALK', 'SMOKE'] : ['TALK', 'SMOKE'];
  const k = opts[await ask('...', null, opts)];
  if (k === 'HIT HER') {
    await say('I could hit it. I\'m not saying I\'m going to. I\'m saying it\'s right there and it keeps telling me no.', C);
    sfx('thump'); fx.shake = 5; await wait(20); fx.shake = 0;
    await say('LINDA WAS KNOCKED OUT.');
    await say('...That was a one-time thing. That\'s a thing I\'ve done one time. That anyone saw.', C);
  } else if (k === 'TALK') {
    await say('Linda. Listen. Nobody\'s supposed to be in a box. Not him. Not me. Not whoever\'s watching.', C);
    await wait(60); await L('...');
    await L('YOU ARE STILL NOT ALLOWED IN THE MALL.');
    await say('I KNOW.', C);
    await L('GO.');
  } else {
    sfx('smoke'); fxAdd.wave = 5; await wait(40); fxAdd.wave = 0;
    await L('WHAT IS THIS.');
    await say('It\'s the future, Linda.', C);
    await L('...I FEEL... LOOSE...');
  }
  setF('coreDown'); ent('core').spr = 'coreOff';
  await collapse();
}
async function ghostTalk() {
  if (!F('cageOpen')) return ent('cage').talk();
  if (F('ghostFree')) return say(pick(['Linda\'s still on, bro. If we leave her on, she\'ll just put us back.', 'Go. Do the thing. I\'m right behind you. Ghostly. Behind you.']), 'SPOOKY GHOST');
  const G = 'SPOOKY GHOST';
  await say('Carl?! CARL. Bro. How long have I been in here?', G);
  await say('I don\'t know. A while. There was a mall. And a desert. And my old room. It\'s been a day.', C);
  await say('You came to get me?', G);
  await say('Yeah. I mean. I was delivering something. And then I heard you. So. Both.', C);
  await say('...You know you\'re on the front page again. Everybody\'s watching YOU.', G);
  await say('Are you serious right now? I came into a BOX for you. Inside a MALL. Below NEVADA.', C);
  await say('Yeah. Yeah, okay. ...Thanks, Carl.', G);
  await say('Don\'t. Don\'t make it weird. Let\'s go.', C);
  await say('Carl. Linda\'s still running. If we leave her on, she\'ll just put us back.', G);
  setF('ghostFree'); setF('obj', 'box');
}
async function collapse() {
  sfx('glitch');
  for (let i = 0; i < 120; i++) { fx.shake = 1 + (i >> 5); fxAdd.noise = i / 400; if (i % 20 === 0) sfx('glitch'); await nextFrame(); }
  fx.shake = 0; fxAdd.noise = 0;
  await whiteOut(6);
  music(null);
  scene = { draw() { cls(0); } }; fx.fade = 0;
  await showCard(['THE BOX IS OPEN.'], 140, { inv: 1 });
  await showCard(['EPILOGUE', '', 'THURSDAY'], 150, { inv: 1 });
  setF('ending'); setF('act', 5); setF('obj', 'home');
  scene = worldScene;
  loadMap('lot', 4, 12, 'down');
  await fadeIn(8);
  await lotDawn();
}

// ---------- ENDING ----------
const lotEnts0 = MAPS.lot.ents;
MAPS.lot.ents = () => [...lotEnts0(), { id: 'sgEnd', x: 5, y: 12, spr: 'ghost', bob: 1, if: () => F('ending') && !F('ghostBye'), talk: async () => say('Go home, Carl. I mean the ship. Go to the ship.', 'SPOOKY GHOST') }];
MAPS.lot.init = MAPS.ship.init = () => { fx.pal = F('ending') ? 'gold' : 'dmg'; };
async function lotDawn() {
  music('end');
  const G = 'SPOOKY GHOST';
  await say('Well. That was a lot.', G);
  await say('That was the normal amount. For me. That\'s a Tuesday.', C);
  await say('It\'s Thursday.', G);
  await say('...Thursday is the Tuesday of Thursdays.', C);
  await say('I\'m gonna go. People are gonna want to know I\'m back. Front page, you know.', G);
  await say('Yeah. Go. Go be on the front page. I\'ll be here. In the lot. Outside. More outside, sometimes.', C);
  await say('Carl. Thanks.', G);
  const g = ent('sgEnd'); for (let i = 0; i < 40; i++) { g.pmap = i & 1 ? [0, 0, 0, 1] : null; await wait(2); }
  setF('ghostBye');
  await wait(40);
  await say('...Yeah.', C);
}
MAPS.lot.finale = async () => {
  await warp('ship', 4, 3, 'down');
  music(null);
  await wait(60);
  await say('...', C);
  sfx('static'); fxAdd.noise = .03; await wait(80);
  await say('...[[[[[...?', 'VOICE', { slow: 1 });
  await say('Hold on. Be quiet a second.', C);
  sfx('static');
  await say('...[[[[[... can you hear us...? we\'re... still...', 'VOICE', { slow: 1 });
  sfx('static'); await wait(40); fxAdd.noise = 0;
  await wait(60);
  await say('...That wasn\'t dispatch.', C);
  await say('Chat. Did you hear that? That was two voices. That was two of them.', C);
  await say('They could be out there somewhere, right? ...Right?', C);
  if (tapes().length === 8) {
    sfx('static'); await wait(40);
    await say('...we heard you. every time you talked to them. every tape. keep talking. we\'re following your voice.', 'VOICE', { slow: 1 });
    await say('...Chat. Chat, keep talking. Everybody keep talking. Don\'t stop.', C);
  }
  await wait(90);
  await say('Okay. Okay. Where does it say it came from.', C);
  await walk(P, 'u');
  await say('It says... below.', C);
  await wait(40);
  await say('Below below.', C);
  await wait(30);
  await say('...Of course it does.', C);
  await fadeOut(10);
  META.endings++; saveMeta();
  try { localStorage.removeItem('carl_sav'); } catch (e) {} // next boot: FILE 1 empty, FILE 2 is "HIM"
  await credits();
};
async function credits() {
  music('end');
  const L = ['CARL', 'ABOVE & BELOW NEVADA', '', '', 'CARL', '...NOT HIS NAME', '', 'LINDA', '...LINDA', '', 'SPOOKY GHOST', '...HIMSELF', '',
    'FACE', '...A RECORDING', '', 'WHITE SUITS', '...UNKNOWN', '', 'DISPATCH', '...DISPATCH', '', 'SPECIAL THANKS', 'CHAT', '', '', 'AND YOU', '', '', '',
    'PRETEND CO.', 'THE PRETEND COMPANY', 'A REAL COMPANY', '', '(C)1998', '', '', '', 'THANK YOU FOR PLAYING'];
  let y = H + 10;
  scene = { draw() { cls(3); L.forEach((l, i) => { const yy = y + i * 12; if (yy > -8 && yy < H) ctext(l, yy, l === 'CARL' || l === 'AND YOU' ? 0 : 1); }); } };
  fx.fade = 0; fx.pal = 'dmg';
  while (y > -L.length * 12 + 60) { y -= .5; await nextFrame(); }
  await wait(240);
  music(null);
  await fadeOut(8);
  scene = { draw() { cls(3); } }; fx.fade = 0;
  await wait(120);
  sfx('hum');
  await showCard(['CARL WILL REMEMBER THAT.'], 180);
  let t = 0;
  scene = { draw() { t++; cls(3); blit(SPR.carlback, 72, 64); if (t > 100 && t < 104) { fx.pal = 'red'; blit(SPR.carl.down[0], 72, 64); } else fx.pal = 'dmg'; } };
  await wait(200);
  fx.pal = 'dmg';
  await fadeOut(4); fx.fade = 0;
  if (tapes().length === 8) { META.secret = 1; saveMeta(); await secretScene(); }
  title(); await fadeIn(4);
}
