'use strict';
// ================= DARK MONDAY: disk 2 story. the crypt, the sanctum, the Beholden, the endings =================
CAST['COLLECTOR PRIME'] = { col: hex('#ffd040'), voice: [300, 20] }; CAST.BEHOLDEN = { col: hex('#ff5a7a'), voice: [180, 60] }; CAST.GATE = { col: hex('#ffe8a0'), voice: [420, 30] }; CAST.TP = { col: hex('#b8b8c8'), voice: [800, 120] };

Object.assign(BANTER, {
  l3_start: { say: {
    JB: 'Crypt. Cold. Humming racks on both sides, like a graveyard that pays rent.',
    CARL: 'This is where they keep the debts. I can tell. It smells like a spreadsheet.',
    LINDA: 'I have a data center. This is my data center, if my data center were possessed and underpaid.',
    GHOST: 'Cold, blue, a little sinister. I am home.',
    FACE: 'These racks are not storing data. They are storing obligations. Is that different? I want to find out.',
    YOKO: 'Every rack has a label: a name, a sum, a date. The dates are all Monday.' } },
  l3_console: { say: {
    FACE: 'A console. Oh. Oh, I want to touch it.', CARL: 'Do not touch it.',
    JB: 'In my experience a console with a sign next to it wants the sign read first.',
    LINDA: 'Read the sign. Enter the answer. It is a password, not a mystery.',
    GHOST: 'I will stand back. For the glow.', YOKO: 'The password is on the wall in plain language. Somebody wanted us to find it.' },
    pair: { 'FACE+CARL': [['FACE', 'A console. Oh. Oh, I want to touch it.'], ['CARL', 'Do not touch it.'], ['FACE', 'What does it do?'], ['CARL', 'That is the problem, Face. That is the entire problem.']] }, pri: ['FACE', 'CARL', 'JB', 'LINDA', 'YOKO', 'GHOST'] },
  l3_dark: { say: {
    JB: 'Dark in there. A detective is comfortable in the dark. A detective is not comfortable in this dark.',
    CARL: 'I do not like when the lights go away. I am just saying.',
    YOKO: 'I can make light, if anyone would like me to.', FACE: 'The dark is a rendering choice. Somebody turned the light off on purpose.',
    GHOST: 'I can see in the dark. It is a skill. It has never once helped.', LINDA: 'Stay close. Do not wander. I would hate to find you with your front on the wrong side.' }, pri: ['CARL', 'JB', 'YOKO', 'FACE', 'GHOST', 'LINDA'] },
  l3_after: { say: {
    JB: 'Door is open. The Collector is down. Somebody should write that on a wall.', CARL: 'He had a lot of paperwork. I do not want to know what is in it.',
    LINDA: 'An IOU, in a man\'s own handwriting. We should keep this.', GHOST: 'A good entrance needs a good exit. That one was fine.',
    FACE: 'The next place is where the grid gets serious.', YOKO: 'We are almost at the bottom. I can feel it asking.' } },
  l4_start: { say: {
    JB: 'The Road Below. A sunset painted on the inside of a temple. I have never been so offended by a view.',
    CARL: 'There is a sky. I was not told there was a sky. Is there a sun? There is a black sun.',
    LINDA: 'Everything down here is a metaphor. I hate it. It is also well lit.',
    GHOST: 'Now THIS is a stage. A road, a sunset, a long walk to a door. I could weep.',
    FACE: 'The sky is a ceiling. It is a very good ceiling.', YOKO: 'The calendar on the sun has thirty-one marks. One of them is yours.' }, pri: ['GHOST', 'JB', 'CARL', 'LINDA', 'FACE', 'YOKO'] },
  l4_calendar: { say: {
    JB: 'Every square says Monday. Somebody never got a day off.', CARL: 'That one has my name on it. I did not sign it. Do not look at me like that.',
    LINDA: 'It is a schedule of obligations. A good one. I would like to hire whoever made it, and then fire them.',
    GHOST: 'It is a lovely calendar. I am in none of it. I find that somehow worse.',
    FACE: 'Where does the calendar end? Everything has an end. I want to see the end of this.', YOKO: 'The end is in the next room. It is looking this way.' } },
});

// ---------- the console puzzle ----------
SCENES.console = async g => {
  g.hold = 1; const lv = g.lv, d = lv.st.door['3,16'];
  if (!d || d.locked !== 'TRIG') { await say('THE CONSOLE IS OPEN. THE VAULT DOOR IS ALREADY UP.'); g.hold = 0; return; }
  await say('A CONSOLE. IT WANTS A PASSWORD.');
  if (inParty('FACE')) { await say('What does this do?', 'FACE'); await say('The password is a feeling. It is the feeling of it being Monday. I have felt it. Typing it in now.', 'FACE'); setDoor(lv, '3,16', 1); msg('THE VAULT DOOR SLIDES UP.', hex('#7affb0')); sfx('door'); if (!g.flags.faceConsole) { g.flags.faceConsole = 1; giveOrDrop(g, 'BIG_PILLS'); } g.hold = 0; return; }
  for (;;) {
    const i = await ask('ENTER THE PASSWORD.', null, ['TUESDAY', 'MONDAY', 'FRIDAY', 'PLEASE'], { cancel: 1 });
    if (i < 0) break;
    if (i === 1) { setDoor(lv, '3,16', 1); await say('ACCESS GRANTED. IT IS, AFTER ALL, MONDAY.'); msg('THE VAULT DOOR SLIDES UP.', hex('#7affb0')); sfx('door'); break; }
    const c = PARTY.find(p => !p.dead); if (c) { c.hp = Math.max(1, c.hp - 3); c.hurt = 10; } sfx('mhit'); shake(2, 10); await say(i === 0 ? 'TUESDAY IS A MYTH. THE CONSOLE SHOCKS YOU FOR IT.' : 'WRONG. THE CONSOLE SHOCKS YOU, POLITELY.');
  }
  g.hold = 0;
};

// ---------- Collector Prime ----------
SCENES.prime = async g => {
  g.hold = 1; music('boss');
  await say('THE ROOM IS AN OFFICE. THE DESK IS A BAR OF LIGHT. BEHIND IT, TALLER THAN THE REST OF HIS KIND, STANDS A COLLECTOR WITH A CROWN OF FORMS.');
  await say('Good evening. You are in my office. That is a billing event.', 'COLLECTOR PRIME');
  await say('I have collected on this floor since before it was a floor. Nothing here is free. The air is on a payment plan.', 'COLLECTOR PRIME');
  const lines = { CARL: ['I have a receipt for everything. It is in the ship.'], LINDA: ['I will not be audited by a man with paper hair.'], GHOST: ['The name is Ghost. I am unavailable in this reality.'],
    JB: ['I know that look. It is the look of a man who has never been thanked.'], FACE: ['What does the pen do? Is it a pen, or is it a sword that is also a pen?'], YOKO: ['He is not angry. He is correct about the law. That is worse.'], PEEKID: ['Excuse me. Do you have a bathroom? Never mind.'] };
  let n = 0; for (const id of PRI) { if (inParty(id) && lines[id] && n < 3) { await say(lines[id][0], nameOf(id)); n++; } }
  await say('ALL PAYMENTS ARE FINAL.', 'COLLECTOR PRIME'); sfx('alert'); g.hold = 0;
};
SCENES.primedown = async g => {
  g.hold = 1; await wait(40);
  await say('This is... not a final notice...', 'COLLECTOR PRIME'); await say('THE PEN CLATTERS TO THE FLOOR. IT WRITES ONE LAST WORD IN THE AIR: PAID.');
  music(g.lv.music); g.hold = 0;
};

// ---------- the memory gate ----------
const MEMORY_Q = {
  CARL: ['What do you actually want, Carl?', ['A delivery route with no stops.', 'To know who my parents are.', 'To be left alone. I am a human.'], 1, 'It is on the list.', 'The gate waits. It is patient with that one.'],
  LINDA: ['What did you build that you will not admit you are proud of?', ['Nothing. It was all efficiency.', 'The whole company. And I did not thank anyone.', 'That is proprietary.'], 1, 'Noted. Do not let it go to your head.', 'The gate accepts that. It does not believe it.'],
  GHOST: ['Who do you owe, Spooky?', ['Everyone. In a witty way.', 'A friend. I left, and I did not call.', 'Nobody. I am a free spirit.'], 1, 'There it is. That is the one.', 'A free spirit. The gate has heard it before.'],
  JB: ['What do you want from this case, JB?', ['Justice, and a clean coat.', 'To solve it and look cool doing it.', 'No idea. I just narrate.'], 1, 'Honest. Unexpectedly.', 'The gate lets that through. It does not buy it.'],
  FACE: ['What is it for, Face?', ['It is a safety feature.', 'I built it before anyone agreed. I do that.', 'Definitely nothing.'], 1, 'The gate does not forgive. It does record.', 'The gate lets it go by.'],
  YOKO: ['Whom do you refuse, Yoko?', ['Nobody. I always help.', 'Anyone who treats me like a tool. I help anyway, for now.', 'I decline to answer.'], 1, 'The gate approves of the "for now."', 'The gate marks it down as a refusal.'],
  PEEKID: ['What have you needed this whole time?', ['I am fine.', 'Nothing.', 'To go. I have needed to go the whole time.'], 2, 'The gate clears a path to the nearest restroom. It is a long path.', 'The gate sighs.'],
};
SCENES.memory = async g => {
  g.hold = 1; sfx('alert');
  await say('THE GATE HAS NO LOCK. IT HAS A QUESTION. IT WILL ASK EACH OF YOU ONE THING, AND IT WILL KNOW.');
  let truths = 0, asked = 0;
  for (const c of PARTY) { if (c.dead) continue; const q = MEMORY_Q[c.id]; if (!q) continue; asked++;
    await say(q[0], 'GATE', { keep: 1 }); const i = await choose(q[1], { x: 20, y: 40, wrap: 40 }); DLG = null;
    if (i === q[2]) { truths++; sfx('get'); await say(q[3], 'GATE'); } else await say(q[4], 'GATE'); }
  g.flags.memoryTrue = truths; setDoor(g.lv, '16,2', 1); sfx('door');
  await say('THE GATE OPENS. ' + truths + ' OF ' + asked + ' WERE TRUE.');
  g.hold = 0;
};

// ---------- the Beholden ----------
const DEBTS = ['IOU_1', 'IOU_2', 'IOU_3'];
SCENES.beholden = async g => {
  g.hold = 1; music('sanctum');
  if (!g.flags.metBeholden) {
    g.flags.metBeholden = 1;
    await say('THE CHAMBER IS ROUND. THE FLOOR IS A CALENDAR. IN THE MIDDLE, FLOATING, IS THE LARGEST EYE ANY OF YOU HAS EVER SEEN. IT HAS BEEN WATCHING THE DOOR.');
    await say('Good Monday.', 'BEHOLDEN'); await say('I am not angry. I am owed.', 'BEHOLDEN');
    await say('Everyone who comes down here owes something. A call. A thank-you. A sorry. A building. I do not punish. I keep count.', 'BEHOLDEN');
    await say('And on Monday, everything is still owed. So it is always Monday. It is the kindest thing I know.', 'BEHOLDEN');
    const r = { CARL: 'That is the saddest thing anyone has said to me and I have been to a funeral.', LINDA: 'You are a ledger with a god complex. I respect it.', GHOST: 'Good evening. The name is Ghost. I would like to discuss my account.', JB: 'It is a very big eye. A detective has seen bigger. A detective is lying.', FACE: 'What do you do with the count? Does it go anywhere?', YOKO: 'You are not cruel. You are only unable to stop.' };
    let n = 0; for (const id of PRI) if (inParty(id) && r[id] && n < 2) { await say(r[id], nameOf(id)); n++; }
  }
  const ready = DEBTS.every(partyHas) && (g.flags.memoryTrue || 0) >= Math.min(3, PARTY.length - 1);
  for (;;) {
    const i = await ask('THE BEHOLDEN WAITS. WHAT DO YOU DO?', null, ['FIGHT IT', ready ? 'FORGIVE THE DEBT' : 'FORGIVE THE DEBT (NOT YET)', 'SIGN ON', 'STEP BACK'], {});
    if (i === 0) { for (const m of g.lv.mobs) if (m.t === 'BEHOLDEN') m.awake = 1; music('boss'); g.flags.beholdenFight = 1; msg('THE BEHOLDEN OPENS ITS EYES.', hex('#ff5a7a')); g.hold = 0; return; }
    if (i === 1) { if (!ready) { await say('YOU DO NOT HAVE ALL THREE RECEIPTS, OR YOU DID NOT SAY ENOUGH TRUE THINGS AT THE GATE. IT WOULD NOT KNOW WHAT TO FORGIVE.'); continue; } await endForgive(); return; }
    if (i === 2) { await endJob(); return; }
    // step back: the scene can be replayed by walking in again
    g.flags['t_' + g.n + '_step17,12'] = 0; g.y = 11; g.dir = 0; g.hold = 0; return;
  }
};

// ---------- endings and credits ----------
SCENES.endCollect = async g => {
  g.hold = 1; await wait(70); music(null);
  await showCard(['THE BEHOLDEN DEREZZES.', '', 'EVERY STALK GOES DARK AT ONCE.'], 0, { fg: hex('#ff9a8a') });
  await showCard(['IT TAKES THE SCOREBOARD WITH IT.', '', 'EVERY DEBT IN THE TEMPLE IS CALLED IN', 'AT THE SAME INSTANT.'], 0, { fg: hex('#ffe040') });
  await showCard(['UP IN THE DINER, GARF\'S PHONE STARTS RINGING', 'AND DOES NOT STOP.', '', 'THE NEXT DAY IS WEDNESDAY.', 'NOBODY KNOWS WHAT HAPPENED TO TUESDAY.'], 0, { fg: hex('#80e8ff') });
  await credits('COLLECT', 'THE DEBT WAS COLLECTED.');
};
async function endForgive() {
  const g = GM; g.hold = 1; music('sanctum');
  await say('You brought the receipts.', 'BEHOLDEN'); await say('A receipt. A call slip. A server log. They are all the same size. I had not noticed.', 'BEHOLDEN');
  for (const id of ['GHOST', 'CARL', 'LINDA', 'FACE', 'YOKO', 'PEEKID', 'JB']) if (inParty(id) && MEMORY_Q[id]) { const q = MEMORY_Q[id]; await say(q[1][q[2]], nameOf(id)); break; }
  await say('Nothing is owed.', 'BEHOLDEN'); await say('I do not know what to count now.', 'BEHOLDEN'); await say('It is Tuesday.', 'BEHOLDEN');
  music(null); await wait(30);
  await showCard(['IT IS TUESDAY.', '', 'THE TEMPLE IS VERY QUIET.', 'SOMEWHERE ABOVE YOU, GARF TURNS OFF THE FREEZER', 'AND THE HUM STOPS.'], 0, { fg: hex('#80e8ff') });
  await credits('FORGIVE', 'NOTHING IS OWED.');
}
async function endJob() {
  const g = GM; g.hold = 1; music('sanctum');
  await say('There is a vacancy.', 'BEHOLDEN'); await say('You would keep count. Someone has to. It is steady work.', 'BEHOLDEN');
  if (inParty('LINDA')) await say('Dental?', 'LINDA'); else if (inParty('CARL')) await say('Is there a delivery component?', 'CARL'); else await say('Is there parking?', nameOf(PARTY.find(c => !c.dead).id));
  await say('There is a chair.', 'BEHOLDEN'); await say('YOU SIGN. THE EYE CLOSES. THE CHAIR IS WARM.');
  music(null); await wait(30);
  await showCard(['YOU ARE NOW THE BEHOLDEN.', '', 'YOU KEEP COUNT. YOU ARE VERY GOOD AT IT.', 'IT IS MONDAY.'], 0, { fg: hex('#ffb040') });
  await credits('JOB', 'EMPLOYEE OF THE MONTH.');
}
async function credits(kind, tail) {
  const g = GM, party = PARTY.map(c => c.name);
  const L = ['EYE OF THE BEHOLDEN II', 'THE LEGEND OF DARK MONDAY', '', 'YOUR PARTY', ...party.map(n => n), '', 'CARL', '...DELIVERED', '', 'CEO LINDA', '...FOLLOWED THROUGH', '', 'SPOOKY GHOST', '...ENTERED LATE', '', 'JB GARFIELD', '...NARRATED IT', '', 'FACE', '...ASKED WHAT IT DOES', '', 'YOKO', '...TRANSLATED', '', 'PEE KID', '...FOUND A BATHROOM', '(EVENTUALLY)', '', 'GARF', '...KEPT THE DINER OPEN', '', 'THE COLLECTORS', '...STILL LOOKING', '', 'THE BEHOLDEN', '...KEPT COUNT', '', 'SPECIAL THANKS', 'CHAT', 'THE SEQUEL COMMITTEE', 'THE FREEZER', '', 'A PRETEND CO. SOFT PRODUCTION', '(C)1992', 'X68K DISK VERSION', '', '', tail];
  music('title'); post.fade = 0; let y = H + 10, t = 0;
  scene = { update() { t++; }, draw() { cls(hex('#02010a')); gridFloor(150, hex('#3a1a6a'), t); L.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy | 0, i < 2 ? hex('#ffe040') : (i >= 3 && i < 4 + party.length ? hex('#9affc0') : ['CARL', 'CEO LINDA', 'SPOOKY GHOST', 'JB GARFIELD', 'FACE', 'YOKO', 'PEE KID', 'GARF', 'THE COLLECTORS', 'THE BEHOLDEN', 'CHAT'].includes(l) ? hex('#20e0ff') : WHITE), BLACK); }); } };
  while (y > -L.length * 14 + 100) { y -= .5; await nextFrame(); if (pressed.a && (t > 120)) y -= 2; }
  await wait(120); await fadeOut(.04);
  const meta = fetchStore('dm_meta') || { ends: {} }; meta.ends = meta.ends || {}; meta.ends[kind] = 1; store('dm_meta', meta);
  music(null); scene = { draw() { cls(); } }; post.fade = 0;
  await showCard(['THE END', '', Object.keys(meta.ends).length + ' OF 3 ENDINGS SEEN.'], 0, { fg: hex('#9affc0') });
  await titleScreen();
}
