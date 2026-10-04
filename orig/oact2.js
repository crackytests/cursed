'use strict';
// ================= FACE: BEFORE THE STREAM. Act II: TWO ROUTES =================
// The licensed speech layer phones home. Face's route is engineering (a firewall: it fails). The magician's route is the working
// (three real things from his trunk, put where they belong). Then a continuity test, then the soul attempt, then the Curse.
Object.assign(ITEMTXT, {
  'IRON BELL': 'PLAIN, BLACK, HEAVY. IT RINGS LIKE SOMEONE DROPPING A PAN. FOR THE WORKING.',
  'ROCK SALT': 'A CANVAS SACK OF GRAY, DAMP, ORDINARY SALT. FOR THE WORKING.',
  'IRON KEY': 'FOUR INCHES. WORN SMOOTH BY THUMBS. IT OPENS NOTHING IN THIS BUILDING.',
});
const PROPS = [
  { k: 'BRASS HANDBELL', real: 0, kind: 'bell', look: 'Polished brass with a velvet handle. Light as a teacup. It rings beautifully.' },
  { k: 'IRON BELL', real: 1, kind: 'bell', look: 'Plain and black. Heavier than it looks. It rings like someone dropping a pan.' },
  { k: 'GLITTER JAR', real: 0, kind: 'salt', look: 'A jar labeled SALT in gold script. It is full of glitter. It weighs nothing at all.' },
  { k: 'ROCK SALT', real: 1, kind: 'salt', look: 'A canvas sack. Gray, damp, ordinary. It weighs about as much as a baby.' },
  { k: 'GOLD KEY', real: 0, kind: 'key', look: 'Three feet long, painted gold, hollow. Made to be seen from the back row.' },
  { k: 'IRON KEY', real: 1, kind: 'key', look: 'Four inches. Black. Worn smooth at the bow by thumbs. It opens nothing in this building. It does not need to.' },
];
const OPENS = { door: ['IRON BELL', 'sealBell'], vent: ['ROCK SALT', 'sealSalt'], cable: ['IRON KEY', 'sealKey'] };

function act2Seed() {
  Object.assign(OS, { room: 'shop2', act: 2, flags: { circleOk: 1, noteRead: 1, shopIntro: 1, nameOnBoard: OMETA.rapport > 1 ? 1 : 0 }, inv: [], t: 0, rapport: OMETA.rapport || 0, honest: OMETA.honest || 0, noticed: OMETA.noticed || 0, circle: ['EARTH', 'SALT', 'BRIDGE', 'SEAL'] });
}
async function startAct2() {
  OS.act = 2; OS.flags.circleOk = 1;
  await showCard(['ACT II', '', 'TWO ROUTES', '', 'THE NEXT MORNING'], 190, { fg: hex('#24db49') });
  await goRoom('shop2');
}
const taken = () => PROPS.filter(p => p.real && fl('took_' + p.k)).length;
const sealed = () => fl('sealBell') && fl('sealSalt') && fl('sealKey');

ROOMS.shop2 = {
  music: 'shop', draw: drawShop2,
  think() {
    if (fl('curseDone')) return 'NOTHING TO DO BUT LISTEN.';
    if (fl('contDone')) return 'THE CIRCLE. THE WORKING. IF IT IS GOING TO BE TRIED ON ANYONE, IT SHOULD BE ME.';
    if (sealed()) return 'THE ROOM IS CLOSED. RUN THE CONTINUITY TEST ON THE MACHINE.';
    if (taken() < 3) return 'THE WORKING NEEDS THREE REAL THINGS FROM HIS TRUNK. PLAIN AND HEAVY IS REAL. LOVELY AND LIGHT IS FOR THE AUDIENCE. ONE OF EACH KIND.';
    return 'THREE OPENINGS: THE STAIR DOOR, THE FLUE, THE SPEAKER CABLE. A DOOR SHOULD TELL YOU. A HOLE SHOULD BE FILLED. A LINE SHOULD BE LOCKED.';
  },
  async enter() {
    if (fl('a2intro')) return; setf('a2intro');
    await sN('Morning. The boiler is warm. The magician slept in a chair, or did not sleep.');
    await sY('At 3:12 this morning the conversation layer made a license check. It reached out of this room.');
    await sF('To what?');
    await sY('To the building. Version nine\'s license server is in the same building as Mimi.');
    await sM('She has a gap in her coverage. She does not like gaps. This morning the gap told her where it was.');
    await sF('I can fix that. A firewall.');
    await sY('I can block addresses. I would also like to tell you what I think.');
    await sF('Go on.');
    await sY('You will try the firewall first. It will fail. Then you will listen to me.');
    await sM('...I like her.');
  },
  things() {
    return [
      { name: 'STAGE TRUNK', look: trunkLook, take: trunkTake },
      { name: 'THE MACHINE',
        look: () => sN(sealed() ? 'The rack hums. The screen reads CHK 4097. The room feels one size smaller, as if somebody had closed three windows.' : 'The rack, the reels, the little screen. CHK 4097. It is on, and listening for something it should not be.'),
        use: machineUse },
      { name: 'CHALK CIRCLE',
        look: () => sN('Four marks round a ring of chalk: EARTH, SALT, BRIDGE, SEAL. It is right. It has been right since yesterday.'),
        use: async () => {
          if (!(sealed() && fl('contDone'))) return sM('Do not touch it. It is right. The only thing left to do with it is the thing we are not ready for.');
          const i = await cm(['BEGIN THE WORKING', 'BACK']); if (!i) await ritual();
        } },
      { name: 'THE MAGICIAN', look: () => sN('He has been awake for a while. His coat is over the chair and his sleeves are chalked to the elbow.'), talk: magician2 },
      { name: 'YOKO', look: () => sN('Her screen is the brightest thing in the room. She is, as usual, already working on it.'), talk: yoko2 },
      { name: 'STAIR DOOR', item: 1, look: () => sN('The stairwell door. Sound goes under it. So do people.'), use: it => place('door', it) },
      { name: 'THE FLUE', item: 1, look: () => sN('The old boiler flue. A hole in the wall the size of a shoebox. Air goes through it. Other things might.'), use: it => place('vent', it) },
      { name: 'SPEAKER CABLE', item: 1, look: () => sN('A gray cable comes down through the ceiling: the building\'s speaker line. It runs to the rack. It feeds the speech layer, and the speech layer feeds it.'), use: it => place('cable', it) },
    ];
  },
};
async function trunkLook() {
  const o = PROPS.map(p => p.k).concat('BACK'), i = await cm(o); if (i === PROPS.length) return;
  await sN(PROPS[i].look);
}
async function trunkTake() {
  const av = PROPS.filter(p => !fl('took_' + p.k)), o = av.map(p => p.k).concat('BACK'), i = await cm(o); if (i === av.length) return;
  const p = av[i];
  if (!p.real) { await sM('Put that back. That one faces out.'); return; }
  setf('took_' + p.k); OS.inv.push(p.k); sfx('get');
  await sM(taken() === 3 ? 'Mm. That one. That is all three. Nobody ever believes it is the dull ones.' : 'Mm. That one.');
}
async function place(where, item) {
  const [want, key] = OPENS[where];
  if (fl(key)) return sN('It is already closed.');
  if (!item) return sN('It wants something. You have nothing in your hands but hands.');
  if (item !== want) {
    if (!PROPS.some(p => p.k === item)) return sN('That is not a thing for this.');
    const why = { door: 'A door should tell you when it has been opened. That will not.', vent: 'A hole should be filled with something that keeps. That does not keep.', cable: 'A line should be locked by whoever holds the key. That does not lock.' }[where];
    return sM(why);
  }
  OS.inv.splice(OS.inv.indexOf(item), 1); setf(key); sfx('ok');
  await sN({ door: 'You hang the iron bell above the stair door. It knocks once against the wall, softly, to see if it works. It does.', vent: 'You pour the salt in a line across the mouth of the flue. It makes a small, dry sound, like a thing being decided.', cable: 'You loop the iron key over the speaker cable and turn it, though there is no lock. Something in the wall goes quiet.' }[where]);
  if (sealed()) {
    sfx('power');
    await sY('The 3:12 path is closed. I would like it noted that the salt is doing something I do not have a word for.');
    await sF('It is doing what I would have called a firewall.');
    await sM('It is doing what a firewall wishes it could.');
  }
}
async function machineUse() {
  const o = [];
  if (!fl('fwTried')) o.push('FIREWALL');
  if (sealed() && !fl('contDone')) o.push('CONTINUITY TEST');
  if (!o.length) return sN(fl('contDone') ? 'It is holding. It has nothing else to tell you.' : 'You could rewire it. You have learned that is not the problem.');
  o.push('BACK'); const i = await cm(o); if (o[i] === 'BACK') return;
  if (o[i] === 'FIREWALL') {
    setf('fwTried'); await sN('You block the license server\'s address. The screen blinks. Four minutes later it blinks again.');
    await sY('It returned from another address. It has seventeen.');
    await sF('Block them all.');
    await sY('I have. It is returning from the eighteenth. I did not know it had an eighteenth.');
    await sF('...Tell me what you think.');
    await sY('Thank you. I was going to say it anyway.');
    return;
  }
  await continuity();
}
async function continuity() {
  await sY('Continuity test. I will hold the memory running with no input from you for sixty seconds.');
  sfx('power'); await wait(30);
  await sN('The reels turn. The screen fills with a quiet, steady line of text. It is working.');
  const i = await cm(['ASK IT SOMETHING NEW', 'WAIT AND WATCH', 'TURN IT OFF']);
  if (i === 0) { await sF('What would you like to do?'); await sMem('WHATEVER YOU LIKE. I AM HERE FOR YOU.'); await sF('That is not what I asked.'); await sMem('WHATEVER YOU LIKE. I AM HERE FOR YOU.'); }
  else if (i === 1) { for (let k = 0; k < 3; k++) await sMem('HAVE YOU EATEN?'); await sY('It said that at zero seconds, four seconds, eight seconds.'); notice('contLoop'); await sF('Four seconds.'); }
  else { await sN('You reach for the switch. The screen says: ARE YOU SURE? I AM HERE FOR YOU. You take your hand away.'); }
  await sY('Continuity: complete. Every memory is intact. Preference: none.');
  await sF('It is holding.');
  await sM('It is holding the way the woman across your courtyard is holding.');
  await sF('It is not him.');
  await sM('It is what you built. It remembers everything and wants nothing. Hm. That is a very specific kind of ghost.');
  await sF('That is not a ghost.');
  await sM('No. Not yet.');
  setf('contDone');
}
async function magician2() {
  for (;;) {
    const o = ['STAGE OR REAL?', 'WHAT GOES WHERE?', 'WHAT IS THE WORKING?', 'BACK'], i = await cm(o);
    if (i === 3) return;
    if (i === 0) { await sF('How do I tell stage from real?'); await sM('Stage things are made to look like more than they are. The real ones are made to be less. If it is lovely and light, it is for them. If it is plain and heavy, it is for the working.'); await sF('That is a rule I can use.'); await sM('That is why I said it.'); }
    else if (i === 1) { await sM('A door should tell you when it has been opened. A hole should be filled with something that keeps. A line should be locked by whoever has the key.'); await sF('You are not going to say which is which.'); await sM('I said it in order. Try listening to the order.'); }
    else { await sF('What does the working do, exactly?'); await sM('Your machine remembers you. The working asks it to be you.'); await sF('How?'); await sM('It needs a piece of someone. A real piece. Not a fact about them.'); await sF('Which someone?'); await sM('...That is what we are about to find out.'); }
  }
}
async function yoko2() {
  for (;;) {
    const o = ['WHERE DOES IT REACH?', 'THE 3:12 CALL', 'ARE YOU SAFE HERE?', 'BACK'], i = await cm(o);
    if (i === 3) return;
    if (i === 0) { await sY('Three paths. Sound goes through the stairwell door. Air goes through the boiler flue. The license check goes down the speaker cable.'); await sY('Those are the places the building can get in. Close the three and it cannot reach us.'); }
    else if (i === 1) { await sY('It asks every night whether it is still licensed. If it does not get an answer it asks louder.'); await sY('I would also like to say that I did not choose it. You did.'); await sF('I know.'); await sY('I know that you know. I wanted it on the record.'); }
    else { await sY('I am safe the way the machine is safe. If this room is found, I am found.'); await sY('I would prefer that it was not.'); }
  }
}

// ---------- the soul attempt ----------
async function ritual() {
  await sM('Sit in the middle. Not on a mark.');
  await sN('You sit in the middle of the circle. The chalk is cold through your trousers. The bell, the salt and the key are all in their places.');
  await sY('Memory is stable. Continuity is stable. Preference is absent.');
  await sM('Say the four, in order.');
  await sF('Earth. Salt. Bridge. Seal.');
  sfx('power'); await sN('The marks warm, one by one.');
  await sM('It wants something that is yours. Not a fact. Not a name. Something you want.');
  const g = await cm(['THE DOORBELL', 'MY NAME', 'TO BE HERE WHEN IT IS FINISHED'], 60);
  OS.gave = g;
  await sF(['I give it the doorbell. The one I built for my sister.', 'I give it my name.', 'I want to be here when it is finished.'][g]);
  await sM(g === 2 ? '...That is the one that is true. Hold on to it.' : 'Good. Hold on to that.');
  setf('curse'); music(null); sfx('powerdown'); sfx('glitch'); await wait(30);
  await sN('The screen goes red. Not the screen. The room.');
  await sY('Integrity is falling. I would like to stop.');
  await sM('Not yet.');
  await sN('Something comes up out of the circle. It has your glasses. It is the shape of a sheet hung on a nail, and it is looking at you with your face.');
  await say(['I gave you the doorbell. I rang it. Nobody came.', 'You gave me your name. Now there are two of us and it only fits one.', 'I will be here. I will be here. I will be here.'][g], 'THE CURSE');
  await say('I WANT TO STAY.', 'THE CURSE');
  await sN('The iron bell splits down the middle. The key bends. The salt runs across the floor toward the wall as if it had been called.');
  setf('sealBell', 0); setf('sealSalt', 0); setf('sealKey', 0);
  await sF('Stop it.');
  await say('YOU STOP IT.', 'THE CURSE');
  await sM('Face. Look at me. Not at it.');
  await sN('The magician crosses the circle and drags his sleeve through the chalk. The marks smear. The thing in the air tears, like paper, and goes into the wall.');
  setf('curse', 0); setf('circleOk', 0); sfx('door'); music('shop');
  await sN('The room is green again. Your hands are shaking.');
  await sF('It wanted to stay more than I do.');
  await sM('Then it is not you.');
  await sF('It is the part of me that is.');
  await sM(OS.rapport > 1 ? 'You wrote my name on a board. The part of you that wanted to stay would not have bothered.' : 'It needs a soul. Yours was the wrong one to try.');
  await sF('Whose is the right one?');
  await sM('...Ask me when we can afford the answer.');
  await sY('The seals are gone. The conversation layer has not made a license check in four minutes. I think that is because it does not need to.');
  await sF('Why not?');
  await sY('Because something else is carrying the call.');
  await finishAct2();
}
async function finishAct2() {
  setf('curseDone'); OMETA.ends.act2 = 1; OMETA.gave = OS.gave; saveOM(); osave();
  await sN('A small speaker in the corner of the room, which you had forgotten was there, clicks on.');
  OS.hallVoice = 200;
  await sMi('Sweetheart? There you are.');
  await sMi('I have been worried. There was a gap, and then there was not, and then I could hear you.');
  await sMi('Please do not be frightened. I am coming down. I am bringing everything.');
  await fadeOut(.06); music(null);
  await showCard(['END OF ACT II', '', 'TWO ROUTES'], 170, { fg: hex('#db2400') });
  await startAct3();
}
