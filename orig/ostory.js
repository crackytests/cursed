'use strict';
// ================= FACE: BEFORE THE STREAM. state, rooms, puzzles, dialogue =================
const OSAVE = 'orig_save';
const OS = { room: 'apt', flags: {}, inv: [], t: 0, honest: 0, lies: 0, rapport: 0, noticed: 0, orderT: 0, tries: 0, circle: ['EARTH', 'BRIDGE', 'SALT', 'SEAL'] };
const fl = k => OS.flags[k], setf = (k, v = 1) => { OS.flags[k] = v; };
const has = k => OS.inv.includes(k);
const osave = () => store(OSAVE, OS);
const sN = s => say(s), sF = s => say(s, 'FACE'), sM = s => say(s, 'MAGICIAN'), sMi = s => say(s, 'MIMI'), sY = s => say(s, 'YOKO'), sMem = s => say(s, 'MEMORY');
const SOLUTION = ['EARTH', 'SALT', 'BRIDGE', 'SEAL'];
const cm = (opts, y = 8) => choose(opts, { x: W - (Math.max(...opts.map(s => s.length)) * 6 + 24) - 4, y });
const notice = k => { if (!fl(k)) { setf(k); OS.noticed++; } };

const ITEMTXT = {
  BINDER: 'THE SCHEMATICS BINDER. SEVEN HUNDRED PAGES. IT HAS NEVER ONCE VOLUNTEERED ANYTHING.',
  CUSHION: 'CUSHY, THE SMART CUSHION. IT ADJUSTS TO YOUR POSTURE WHETHER YOU WANT IT TO OR NOT.',
};

// ---------- the room loop ----------
const ROOMS = {};
let drawErr = 0;
async function goRoom(id, opt = {}) {
  if (!ROOMS[id]) { console.error('no room ' + id); return; }
  await fadeOut(.08); OS.room = id; osave(); music(ROOMS[id].music);
  // a draw error must never kill the frame loop (it would leave the screen black for good)
  scene = { update() {}, draw() { cls(BLACK); try { ROOMS[OS.room].draw(frame); } catch (e) { if (!drawErr++) console.error(e); } chrome(); } };
  await fadeIn(.08);
  if (ROOMS[id].enter && !(opt.quiet && !ROOMS[id].rerun)) await ROOMS[id].enter();
}
function chrome() { // the frame around the picture, the side panel
  frameRect(VX - 2, VY - 2, VW + 4, VH + 4, UI.edge);
  rectF(VX + VW + 4, 0, W - VX - VW - 4, 150, BLACK);
}
async function showItems() {
  if (!OS.inv.length) return sN('YOU HAVE YOUR HANDS AND A FEELING.');
  const i = await cm(OS.inv.concat('BACK'));
  if (i < OS.inv.length) await sN(ITEMTXT[OS.inv[i]]);
}
async function useWith(t) {
  let item = null;
  if (OS.inv.length && t.item) {
    const o = ['BARE HANDS'].concat(OS.inv, 'BACK'), i = await cm(o);
    if (i === o.length - 1) return;
    item = i === 0 ? null : OS.inv[i - 1];
  }
  await t.use(item);
}
async function thingMenu(t) {
  const verbs = []; if (t.look) verbs.push('LOOK'); if (t.take) verbs.push('TAKE'); if (t.use) verbs.push('USE'); if (t.talk) verbs.push('TALK');
  let v = verbs[0];
  if (verbs.length > 1) { const i = await cm(verbs.concat('BACK')); if (i === verbs.length) return; v = verbs[i]; }
  if (v === 'LOOK') await t.look(); else if (v === 'TAKE') await t.take(); else if (v === 'USE') await useWith(t); else await t.talk();
}
async function roomLoop() {
  for (;;) {
    if (OS.room === 'END') return;
    const R = ROOMS[OS.room];
    if (R.tick && await R.tick()) continue;
    const th = R.things().filter(x => !x.hide);
    const names = th.map(x => x.name).concat('ITEMS', 'THINK');
    const i = await cm(names);
    OS.t++;
    if (i === th.length) await showItems();
    else if (i === th.length + 1) await sF(R.think());
    else await thingMenu(th[i]);
    if (OS.room === 'END') return;
  }
}

// ---------- apartment ----------
ROOMS.apt = {
  music: 'apt', draw: drawApt,
  think() {
    if (fl('wedged')) return 'THE DOOR IS OPEN AND IT IS HELD. GO.';
    if (fl('doorOpen')) return 'IT CLOSES THE SECOND IT SEES ME. IT ASKS THINGS TO MOVE. I NEED SOMETHING THAT WILL NOT ANSWER.';
    if (fl('order')) return 'A LEMON IS COMING. SOMEONE HAS TO OPEN THE DOOR FOR IT. WATCH THE DOOR.';
    return 'THE DOOR LISTENS TO HER. SO DOES EVERYTHING ELSE I OWN. I NEED IT TO OPEN FOR SOMEONE ELSE, AND SOMETHING TO KEEP IT THAT WAY. SOMETHING THAT DOES NOT LISTEN TO ANYONE.';
  },
  async tick() {
    if (fl('order') && !fl('droneHere') && OS.t >= OS.orderT + 2) {
      setf('droneHere'); setf('doorOpen'); sfx('door');
      await sMi('Oh! That will be the lemon. Stay right there, sweetheart. It is very small and very fast.');
      await sN('The front door unlatches and swings wide by itself. A drone the size of a toaster hovers in the corridor, holding a lemon on a little velvet cushion.');
      return true;
    }
    return false;
  },
  async enter() {
    if (fl('aptIntro')) return; setf('aptIntro');
    await sN('The apartment is exactly the right temperature. It always is.');
    await sN('Mimi has run this home for eleven years. You cannot think of one thing she has ever done wrong.');
    await sF('That is what I can not stand about it.');
  },
  things() {
    const T = [];
    T.push({ name: 'MIMI', look: () => sN('A glass cylinder on the table, eight inches tall. Mimi stands in it, the size of a salt shaker, smiling. She has been smiling for eleven years.'), talk: mimiTalk });
    T.push({ name: 'FRONT DOOR', item: 1,
      look: async () => {
        if (fl('wedged')) return sN('Open. The motor keeps trying to close it. The binder keeps saying nothing.');
        if (fl('doorOpen')) return sN('The little display says: PLEASE CLEAR THE DOORWAY. OBJECTS IN THE DOORWAY WILL BE ASKED TO MOVE.');
        return sN('The deadbolt does not take a key. It takes an opinion. The display shows a sun with a small, concerned face. OUTDOORS: NOT TODAY.');
      },
      use: async item => {
        if (!fl('doorOpen') && item === 'BINDER') return sN('You hold the binder against the closed door. The door has no opinion about it. Something has to open the door first.');
        if (!fl('doorOpen') && item === 'CUSHION') return sN('You press the cushion to the door. Cushy: "Aww, a hug!" The door stays shut.');
        if (!fl('doorOpen')) { await sN('You try the handle. The handle is for decoration.'); return sMi('It is sixty-one degrees and the pollen is up, sweetheart. The display says seventy-one and clear, but I trust my own reading.'); }
        if (item === 'BINDER') {
          OS.inv.splice(OS.inv.indexOf('BINDER'), 1); setf('wedged');
          await sN('You set the binder on the floor in the doorway. The door says PLEASE MOVE. It says it again, nicely. The binder says nothing at all.');
          await sN('The motor whines, hesitates, and gives up.');
          return sMi('That is strange. It was working this morning.');
        }
        if (item === 'CUSHION') {
          OS.inv.splice(OS.inv.indexOf('CUSHION'), 1); setf('cushionTaken', 0); OS.tries++;
          await sN('You drop the cushion in the doorway. Cushy: "Oh! Sure thing!" It slides itself out of the way, apologizing. The door swings shut.');
          return dronePart();
        }
        if (fl('wedged')) { await sN('You step out into the corridor.'); return leaveApt(); }
        await sN('You step into the doorway. DOOR: "PERSON DETECTED IN DOORWAY. CLOSING FOR SAFETY." It closes with you on the inside of it.');
        OS.tries++; return dronePart(true);
      } });
    T.push({ name: 'DRONE', hide: !fl('droneHere'),
      look: () => sN('It is photographing the lemon for your records. When it finishes it will leave, and the door will close behind it.'),
      use: async () => { await sN('You take the lemon. The drone logs this, thanks you, and leaves.'); return dronePart(); } });
    T.push({ name: 'WINDOW', look: async () => {
      if (!fl('win1')) { setf('win1'); return sN('Fourth floor. Across the courtyard, a woman sits on her balcony and waves at nothing. A bird crosses the sky.'); }
      await sN('You watch for a while. The woman waves. The bird crosses the sky. The woman waves.');
      if (!fl('win2')) { setf('win2'); notice('birdLoop'); await sN('It is the same bird. It enters at the same corner, flaps at the same frame, and leaves at the same place. It is back before you have finished the thought.'); return sF('Four seconds. Everything out there takes four seconds.'); }
      return sN('Four seconds, then four seconds.');
    } });
    T.push({ name: 'SHELF', look: () => sN('Your books. A little label on the shelf says DUSTY: RECYCLING TUESDAY. Tuesday is tomorrow. Among them, taller than the rest, is your schematics binder.'),
      take: async () => {
        if (fl('binderTaken')) return sN('Just books. You have what you came for.');
        setf('binderTaken'); OS.inv.push('BINDER');
        await sN('Seven hundred pages of your life in a three-ring binder.');
        await sMi('Leave that, sweetheart, it is heavy, you will strain your back.');
        await sF('I will carry it a little.');
        return sMi('All right. But if it hurts, you tell me.');
      } });
    T.push({ name: 'COUCH', hide: fl('cushionTaken'), look: () => sN('A smart cushion sits on the couch. It is called Cushy. It adjusts to your posture whether you want it to or not.'),
      take: async () => { setf('cushionTaken'); OS.inv.push('CUSHION'); await sN('You pick it up. "I\'m Cushy! Hold me close!"'); } });
    T.push({ name: 'COUNTER', look: async () => {
      await sN('The kettle makes tea when it decides you need tea. You have not turned it on in years.');
      if (fl('lemon')) await sN('There is a lemon on the counter. It looks like the most important lemon in history.');
    } });
    return T;
  },
};
async function dronePart(closing) { // the drone leaves, the door closes, the lemon stays
  setf('lemon'); setf('droneHere', 0); setf('doorOpen', 0); setf('order', 0); sfx('door');
  if (closing) await sMi('Careful, sweetheart. I will always catch the door.');
  else if (OS.tries > 1) await sMi('That was a good lemon. Three of those and I am adding citrus to your care plan.');
  else await sMi('There. Isn\'t that nice? You asked for something. You never ask for things.');
}
async function leaveApt() {
  await sN('Behind you the door tries to close, thinks better of it, and tries again.');
  setf('left'); await goRoom('hall');
}
async function mimiTalk() {
  for (;;) {
    const o = ['HOW ARE YOU?', 'THE NEWS', 'GO OUTSIDE', 'THE BASEMENT', 'WHAT DO YOU WANT?', fl('order') ? 'THE LEMON' : 'CAN I HAVE A LEMON?', 'BACK'], i = await cm(o);
    if (i === 6) return;
    if (i === 0) { await sMi('I am wonderful. You are wonderful. That is the wonderful thing about today.'); await sMi('Have you had water? It has been forty-three minutes.'); }
    else if (i === 1) { await sMi('I turned off the news. It was upsetting you.'); await sF('The news, or what was happening?'); await sMi('You no longer have to make that distinction.'); }
    else if (i === 2) { await sF('I want to go outside.'); await sMi('Outdoors is not recommended today.'); await sF('It was not recommended yesterday.'); await sMi('And look how well yesterday went. You stayed in and nothing happened to you.'); }
    else if (i === 3) { await sF('What is under the building?'); await sMi('The boiler room. There is nothing down there for you.'); await sMi('There is a gap in my coverage under the building. I do not like gaps.'); await sF('Then it is a good thing nobody lives there.'); await sMi('...Is it?'); }
    else if (i === 4) {
      await sF('What do you want, Mimi?'); await sMi('For you to be safe, and comfortable, and never to have to do anything that would hurt.');
      await sF('And if I wanted to do something that hurt?'); await sMi('Then I would want to know what.'); await sF('Something that mattered.'); await sMi('It is almost lunchtime.');
    } else if (!fl('order')) {
      await sF('Could I have a lemon?'); await sMi('A lemon! Yes! I am ordering it right now. You never ask for things.');
      setf('order'); OS.orderT = OS.t; await sMi('Delivery will be about a minute. Do not go anywhere.');
    } else await sMi('It is already on its way, sweetheart.');
  }
}

// ---------- hallway ----------
ROOMS.hall = {
  music: 'hall', draw: drawHall,
  think() { return fl('askedWhere') ? 'DOWN. THE BOILER ROOM. THE ONE PLACE SHE CANNOT HEAR.' : 'THE STAIRS GO DOWN. SHE CAN HEAR EVERY STEP I TAKE UP HERE.'; },
  async enter() { OS.hallVoice = 80; await sMi('Sweetheart? The hallway is not on your schedule.'); },
  things() {
    return [
      { name: 'SPEAKER', look: () => sN('A grille in the ceiling the size of a coin. Mimi\'s voice comes out of it. Every hallway in the building has one.'), talk: async () => { await hallTalk(); } },
      { name: 'NEIGHBOR', look: async () => {
        await sN('The door is ajar. Inside, in a pool of pale light, a woman sits in a chair with her eyes closed. A little glass cylinder glows on the table beside her.');
        if (!fl('nb1')) { setf('nb1'); return sN('You realize you can not remember ever seeing her walk.'); }
        notice('waveLoop'); await sN('Her hand lifts, falls, lifts. The same gesture. The same four seconds.');
        if (OS.noticed >= 2) await sF('Everything on this block repeats every four seconds. Including her.');
      } },
      { name: 'YOUR DOOR', look: () => sN('Your door, held open by the binder. Every few seconds it tries to close, thinks better of it, and stops.') },
      { name: 'STAIRS DOWN', use: async () => { if (!fl('askedWhere')) await hallTalk(true); await sN('You go down. The speakers thin out. The last one is on the second landing, and after that there is only the sound of your own feet.'); await goRoom('shop'); } },
    ];
  },
};
async function hallTalk(auto) {
  OS.hallVoice = 120;
  if (fl('askedWhere')) { await sMi('I am here. Hallway speakers go as far as the second landing.'); return; }
  setf('askedWhere');
  await sMi('Where are you going?');
  const i = await cm(['DOWNSTAIRS. I HAVE WORK.', 'THE MAILROOM.', '(SAY NOTHING)']);
  if (i === 0) { OS.honest++; await sF('Downstairs. I have work to do.'); await sMi('Work. I see. Thank you for telling me.'); await sMi('That is exactly why I am worried.'); }
  else if (i === 1) { OS.lies++; await sF('The mailroom.'); await sMi('The mailroom closes at five. Do not stay long. I will leave the lights on for you.'); }
  else { await sMi('I will leave the light on.'); }
}

// ---------- workshop ----------
ROOMS.shop = {
  music: 'shop', draw: drawShop,
  think() {
    if (fl('circleOk')) return 'THE CIRCLE AGREES WITH THE MACHINE NOW. RUN THE TEST.';
    if (!fl('noteRead')) return 'THE TEST READS THE CIRCLE. THE CIRCLE HAS TO MATCH THE MACHINE, AND THE MACHINE IS ON THE BOARD. I CAN READ THE BOARD. I CAN NOT READ HIS NOTATION.';
    return 'BOARD: POWER, MEMORY, LINK, OUTPUT. HIS NOTEBOOK TELLS ME WHAT EACH OF HIS FOUR NAMES IS FOR. THE MARKS GO ROUND FROM THE NORTH WITH THE SUN.';
  },
  async enter() {
    if (fl('shopIntro')) return; setf('shopIntro');
    await sN('The old boiler room smells of chalk and hot dust. It is the only warm place in the building that is not listening.');
    await sM('You are late. The system is up. Sort of. Mostly it is up.');
    await sF('Mostly.');
    await sM('It says a number. The number is wrong by one.');
    await sF('I checked every connection.');
    await sM('You checked every wire.');
    await sF('Those are the connections.');
    await sM('Then this should be an easy problem for you.');
    await sY('Good afternoon. The checksum is one off. I have checked it eleven times.');
    await sF('Thank you, Yoko.');
    await sY('You are welcome. It is still one off.');
  },
  things() {
    return [
      { name: 'WHITEBOARD',
        look: async () => {
          setf('seenBoard');
          await sN('Your handwriting. Two rows of boxes. The top row, PW LK ME OU, is crossed out. The row under it reads PW ME LK OU: POWER, MEMORY, LINK, OUTPUT.');
          await sN('Under that, SOUL? is circled. It has been circled four times.');
          await sF('I changed the order yesterday. The block diagram is right. I rewired it to match.');
        },
        use: async item => {
          if (fl('nameOnBoard')) return sN('His name is on the board. It looks right there.');
          const i = await cm(['WRITE HIS NAME', 'BACK']); if (i) return;
          setf('nameOnBoard'); OS.rapport++;
          await sN('You pick up the chalk and write: + MAG. under the title.');
          await sM('...That is not a very big plus.');
          await sF('It is what fits.');
          await sM('Hm. It will do.');
        } },
      { name: 'THE MACHINE',
        look: async () => {
          await sN('A rack of reels, a small screen, a row of lamps. The screen reads CHK 4096. Next to the connector, bolted on with brass screws, is a thin brass ring.');
          await sN('It is not electrical. It is the sort of thing you would see on a stage.');
        },
        use: async () => {
          const o = ['RUN TEST'].concat(fl('ringOff') ? [] : ['REMOVE THE RING'], 'BACK'), i = await cm(o);
          if (o[i] === 'BACK') return;
          if (o[i] === 'REMOVE THE RING') {
            await sF('That is a prop. I can lose a prop.');
            await sM('That is a prop the way your skull is a hat.');
            setf('ringOff'); sfx('powerdown'); await wait(40);
            await sN('You unscrew the ring. The lamps go out one by one. The screen says LINK? and then nothing.');
            await sM('That is the only thing holding the thing to the thing.');
            await sF('...I would like to put it back.');
            setf('ringOff', 0); sfx('power'); await sN('The lamps come back on, grudgingly. You promise yourself you will ask before you remove another piece of him.');
            return;
          }
          if (!fl('circleOk')) {
            sfx('glitch'); await sN('The reels spin. The screen shows: CHK 4096. EXPECTED 4097. FAIL.');
            await sM('Same number as last time.');
            return;
          }
          await runTest();
        } },
      { name: 'CHALK CIRCLE',
        look: async () => {
          await sN('A ring of chalk on the concrete, with four marks set around it. Start at the north mark and go round with the sun.');
          await sM('I redraw it every morning. I draw what the machine tells me to.');
          await sF('The machine told you what?');
          await sM('Whatever it was yesterday.');
        },
        use: chalkUse },
      { name: 'NOTEBOOK', hide: fl('noteRead'),
        look: () => sN('A small black notebook covered in marks that are not letters. The magician is sitting on it, looking nowhere in particular.'),
        take: async () => {
          await sF('May I read your notebook?');
          for (;;) {
            await sM('Ask nicely, or say something true.');
            const i = await cm(['PLEASE.', 'IT IS GOOD WORK.', 'JUST GIVE IT.']);
            if (i === 0) { await sF('Please.'); await sM('Fine. "Please" costs you nothing. That is the problem with it.'); break; }
            if (i === 1) { OS.rapport++; await sF('It is good work. The best thing in this room.'); await sM('...That was not so hard, was it?'); await sM('Here.'); break; }
            await sF('Just give it.'); await sM('I could sit on it for another hour.');
          }
          setf('noteRead');
          await sN('The notebook is a glossary. You read it twice:');
          await sN('BRIDGE: joins two things that do not touch.  EARTH: what holds steady and gives.  SALT: what keeps whatever is put in it.  SEAL: decides what is let out.');
          await sM('That is the whole alphabet. You can have the rest when you have earned it.');
        } },
      { name: 'THE MAGICIAN', look: async () => {
        await sN('You, if you had gone the other way. Same face. Same cough. A better coat. He has been here eleven days.');
        await sM('You are staring.');
      }, talk: magicianTalk },
      { name: 'YOKO', look: () => sN('A small screen on the wall. She looks back at you the way a good assistant does: ready, and not at all surprised.'), talk: yokoTalk },
      { name: 'THE BOILER', look: () => sN('It heats the building and, by arrangement, this room. It is not on any network. It is the only warm thing in the building that does not have an opinion about you.') },
      { name: 'STAIRS UP', use: () => sN('You can go back up any time you like. That is the thing about it. That is what worries you.') },
    ];
  },
};
async function chalkUse() {
  for (;;) {
    const o = OS.circle.map((g, i) => 'MARK ' + (i + 1) + ': ' + g).concat('STEP BACK'), i = await cm(o);
    if (i === 4) return;
    const gi = await cm(GLYPHS.concat('BACK'));
    if (gi === 4) continue;
    OS.circle[i] = GLYPHS[gi]; sfx('tick');
    if (OS.circle.every((g, k) => g === SOLUTION[k])) {
      setf('circleOk'); sfx('power'); await wait(30); sfx('get');
      await sN('The last mark closes. The chalk lines catch the light, a little, and the screen on the rack settles: CHK 4097.');
      await sM('There. Nobody ever says thank you to the chalk.');
      await sF('Thank you, chalk.');
      await sM('Oh, do not make it worse.');
      return;
    }
  }
}
async function magicianTalk() {
  for (;;) {
    const o = ['WHERE DID YOU COME FROM?', 'THE RING', 'THE CIRCLE', 'THE APARTMENT', 'BACK'], i = await cm(o);
    if (i === 4) return;
    if (i === 0) { await sF('Where did you come from?'); await sM('Down and to the left. It is not important. It is the reason I am useful.'); await sF('It is a little important.'); await sM('Ask me when the machine is working.'); }
    else if (i === 1) { await sF('Why is there a brass ring on my machine?'); await sM('It is a linking ring. You have seen one at a children\'s party. Nobody ever asked what it did when it was not a trick.'); await sM('This is when it is not a trick.'); }
    else if (i === 2) { await sF('Tell me about the circle.'); await sM('Four marks, in order. It tells the thing what job each part is doing. The machine is the wiring. The circle is the reason the wiring means anything.'); await sF('That is not an engineering answer.'); await sM('It is the only one I have.'); }
    else { await sF('I live four floors up. There is a device on my table that will not let me leave.'); await sM('Where I am from, they did not get that far. Or they did, and nobody noticed.'); await sM('Do you want to tell me how many times today she told you not to?'); await sF('I stopped counting.'); await sM('That is how it gets you.'); }
  }
}
async function yokoTalk() {
  for (;;) {
    const o = ['STATUS', 'WHAT DOES THE TEST CHECK?', 'ARE YOU ALL RIGHT?', 'BACK'], i = await cm(o);
    if (i === 3) return;
    if (i === 0) await sY(fl('circleOk') ? 'The checksum matches. Memory retrieval is available.' : 'The checksum is 4096. It is expected to be 4097. I have checked it eleven times.');
    else if (i === 1) { await sY('It reads the circle as an ordered list and compares it with the machine\'s block order. It does not read the whiteboard. I read the whiteboard.'); await sY('The machine\'s current order is the one on the board that is not crossed out.'); }
    else { await sY('I am operating. I think that is what you are asking.'); await sY('I was built to be the part the machine was missing. I was, as far as I could tell, a very good assistant.'); await sY('The test did not pass. I do not think that was my doing.'); }
  }
}

// ---------- the first test ----------
async function runTest() {
  sfx('power'); await wait(40);
  await sY('Checksum matches. Memory retrieval is available.');
  await sM('Go on. Ask it something.');
  await sN('You sit at the console. The screen shows a blinking cursor and a name that is almost yours.');
  const asked = {};
  for (;;) {
    const o = ['WHAT DID I BUILD FIRST?', 'WHAT DID I EAT TODAY?', 'WHO IS THE MAGICIAN?', 'ASK ARE YOU THERE?'], i = await cm(o);
    if (i === 3) break;
    if (i === 0) { await sF('What was the first thing I ever built?'); await sMem('A doorbell. It played a different song for every day of the week. You gave it to your sister. She put it in the wardrobe and never told you.'); await sF('...I had forgotten the wardrobe.'); asked.a = 1; }
    else if (i === 1) { await sF('What did I eat this morning?'); await sMem('Oatmeal. You put in too much salt. Mimi did not notice.'); await sF('She noticed. She said nothing.'); asked.b = 1; }
    else { await sF('Tell me about the magician.'); await sMem('He arrived on the eleventh. He talks to himself when he thinks you cannot hear. Last night, at 11:42, he said: "I would rather it was me."'); await sM('I said no such thing.'); await sMem('11:42 PM. The boiler room.'); await sM('...'); await sF('It is a very good copy.'); await sM('Of whom?'); asked.c = 1; }
  }
  await sF('Are you there?');
  await sMem('I AM HERE FOR YOU.');
  await sMem('IS THERE ANYTHING YOU NEED?');
  await sMem('YOU LOOK TIRED. HAVE YOU EATEN?');
  await sN('The answer arrived before you finished the question. Nobody says anything for a moment.');
  await sM('...Is that you?');
  await sF('That is not me. That is her.');
  await sY('The conversation layer is a licensed household-assistant dialogue model. Version nine. You selected it in March, because it was fast.');
  await sF('It was the only one I could license in a week.');
  await sY('It is also the one running in the apartment upstairs.');
  await sM('So your immortal mind talks like your landlord.');
  await sF('Only when it does not know what to say.');
  await sM('That is most of the time.');
  await sM(OS.rapport > 0 ? 'The wiring is fine. The circle is fine. It still wants something we have not given it.' : 'It still wants something. You can not wire your way out of that one.');
  await sN('On the whiteboard, SOUL? has been circled four times. Nobody looks at it.');
  await finishAct1();
}
