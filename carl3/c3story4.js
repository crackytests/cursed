'use strict';
// ================= CARL 3: stops 5 and 6 (the sorting center, the dead letter office), the endings, the credits =================
const I9 = 'INSPECTOR', CL0 = 'CLERK', MG = 'MARGO';
// ---------------- the sort game ----------------
async function sortGame() {
  const dest = ['RETURN', 'DEAD', 'FORWARD'], keys = ['left', 'down', 'right'], col = ['#ff4949', '#b6b6c8', '#6dff92'], N = 10;
  const items = Array.from({ length: N }, () => { const d = rnd(3); return { d, label: pick(['TO: CACTUS CLUB', 'TO: MRS. NOBODY', 'TO: OCCUPANT', 'TO: THE LAKE', 'TO: MARS (NV)', 'TO: HIS FUTURE SELF', 'TO: TUMBLEWEED #4']) }; });
  let i = 0, y = -10, score = 0, miss = 0, flash = 0, t = 0; const prev = scene;
  scene = { update() { t++; if (flash > 0) flash--; }, draw() {
    prev.draw(); panel(40, 14, 240, 180); ctext('SORT THE MAIL', 24, UI.name); ctext('LEFT: RETURN   DOWN: DEAD LETTER   RIGHT: FORWARD', 36, UI.dim);
    for (let k = 0; k < 3; k++) { rectF(60 + k * 80, 160, 60, 22, hex(col[k])); text(dest[k], 64 + k * 80, 168, BLACK, 0); }
    if (i < N) { const it = items[i]; rectF(124, y, 72, 34, hex('#c8a070')); text(it.label, 128, y + 6, BLACK, 0); rectF(124 + 30, y + 22, 12, 8, hex(col[it.d])); }
    text('SORTED ' + score + '/' + N + '   MISSES ' + miss, 60, 186, UI.text);
  } };
  DBG.mode = 'sort'; DBG.sort = { want: () => i < N && y > 70 ? keys[items[i].d] : null };
  while (i < N) {
    await nextFrame(); y += 1.5;
    const k = keys.find(k => pressed[k]);
    if (k) { if (k === keys[items[i].d]) { score++; sfx('ok'); } else { miss++; sfx('hurt'); } i++; y = -10; }
    else if (y > 150) { miss++; sfx('hurt'); i++; y = -10; }
  }
  DBG.mode = null; scene = prev; return score >= 7;
}
// ---------------- STOP 5: THE SORTING CENTER ----------------
DRIVELINES[5] = [[80, 'DISPATCH', 'Nevada Regional Sorting Center. Underground. Everything in the mail comes through it, even the stuff that isn\'t in the mail.'], [420, 'JB GARFIELD', 'The password\'s the thing, kid. Say the sentence. Say it like you\'re bored.'], [780, 'CARL', 'It\'s a stupid sentence.'], [840, 'JB GARFIELD', 'The best ones are.']];
ARRIVE[5] = async () => {
  await say2([['CARL', 'It\'s a loading dock in the middle of nowhere. It says "Nevada Regional Sorting Center (Underground)." The ground is flat. There is no underground.'], [DI, 'It\'s the bays. The bay floors go down. It\'s an elevator the size of a house.'], [U0, 'carl say the sentence'], ['CARL', 'I\'m not saying it to a wall. I\'m saying it to a person.']]);
  setObj3('Talk to the dock clerk', 'sort_dock', 'margo');
};
SCENES.sort_dock.ents = () => [
  shipDoor('ass5', -25.5, 3.8, 1.5),
  npc3('margo', 'clerk', 4.5, 14.2, 'MARGO', () => margoTalk(), { yaw: Math.PI }),
  { id: 'bay', kind: 'prop3', to: 'sort_hall', at: [-4.5, 0, 14.6], label: 'BAY 2', range: 2.6, cond: () => F3('dockOpen'), talk: () => bayDown(), draw3: () => {} },
];
SCENES.sort_dock.shipExit = [-24, 4, 1.5];
async function bayDown() { sfx('door'); await goScene('sort_hall', -26, 2, 0); if (!F3('hallSeen5')) { setF3('hallSeen5'); run(async () => { await say2([['CARL', 'It\'s big. It\'s a big hall. It\'s all belts. The belts are going every way.'], [U0, 'carl do not stand on the belts'], ['CARL', 'I\'m not going to stand on the belts. I\'m going to cross them.']]); setObj3('Talk to the Postal Inspector at the office', 'sort_hall', 'inspector'); }); } }
async function margoTalk() {
  if (F3('done5a')) return say(pick(['Bay 2. Go on. Mind the belts. They don\'t stop for anyone, including me.', 'Hon, you\'ve got the code. Go on.']), MG);
  await say2([[MG, 'Dock\'s closed. Nobody comes in the dock. State your...'], [MG, 'Oh. You\'re short.'], ['CARL', 'I\'m a normal—'], [MG, 'Password?']]);
  for (;;) {
    DBG.truth = 1; const p = await ask('THE PASSWORD IS...', MG, ['RETURN TO SENDER', 'RETURN, BUT NOT TO SENDER', 'OPEN SESAME']); DBG.truth = undefined;
    if (p === 1) break; await say(pick(['Wrong. That\'s the sentence they use at the front door. It doesn\'t work on dead mail.', 'Wrong. And a little insulting.']), MG);
  }
  await say2([[MG, 'Honey. Nobody has said that to me in twenty-three years. It\'s laminated. Come here.']]);
  await say2([[MG, 'I got a card nineteen years ago. "A COURIER WILL COME." I read it every day. I thought: what kind of courier says "return, but not to sender"?'], [MG, 'And now you\'re short and green and you\'ve got a box and you smell faintly of pine.'], ['CARL', 'I\'m a normal guy. I stopped at a truck stop.'], [MG, 'Of course you are. Sign.']]);
  await signature('FORWARD, SORTING CENTER'); C3.route[5] = 1;
  await say2([[MG, 'There\'s an Inspector in the hall. Postal Inspection Service. Number 9. He has the same card I do. He\'s not on your side. He\'s on the box\'s side.'], [MG, 'He\'s been waiting for you. He wants to open it. He can\'t. There\'s a rule.'], ['CARL', 'What rule?'], [MG, 'I\'m not allowed to tell you the rule. You have to read the label.']]);
  addNote('STAMP 10: SORTING CENTER (MARGO). The Inspector can\'t open it. "There\'s a rule. Read the label."'); setF3('done5a'); setF3('dockOpen'); setObj3('Go down in Bay 2', 'sort_dock', 'bay');
}
SCENES.sort_hall.belts = [{ r: [-22, 5, 22, 7.4], v: [.045, 0] }, { r: [-22, 13, 22, 15.4], v: [-.045, 0], if: () => !F3('jamFixed') }, { r: [-22, 21, 22, 23.4], v: [.045, 0] }];
SCENES.sort_hall.ents = () => [
  { id: 'hall_up', kind: 'prop3', to: 'sort_dock', at: [-26.5, 0, 1.4], label: 'UP', range: 1.8, talk: () => goScene('sort_dock', -4.5, 13.2, Math.PI), draw3: () => {} },
  npc3('inspector', 'inspector', 0, 25.6, 'INSPECTOR 9', () => inspectorTalk(), { yaw: Math.PI }),
  { id: 'jam', kind: 'prop3', at: [-12, 0, 17.6], label: 'JAMMED BELT', range: 2.2, cond: () => F3('i9task') === 'jam' && !F3('jamFixed'), talk: () => jamFix(), draw3: () => {} },
  { id: 'chute', kind: 'prop3', at: [-24, 0, 26.0], label: 'DEAD LETTER CHUTE', range: 2.4, cond: () => F3('chuteOpen'), talk: () => enterDLO(), draw3: () => {} },
];
async function jamFix() {
  await say('LANE TWO IS JAMMED WITH A PARCEL THE SIZE OF A SMALL REFRIGERATOR. UNDER IT, A WIRING PANEL.');
  const ok = await wires('LANE 2 DRIVE', 5); if (!ok) return say('THE BELT GRUNTS AND DOES NOT MOVE. IT GRUNTS WITH FEELING.');
  setF3('jamFixed'); finishAlibi('maintenance', 'UNJAMMED LANE 2'); sfx('get'); C3.bux += 10; await say('THE LANE STOPS GROANING. THE PARCEL WAS ADDRESSED TO "SOMEONE WHO WOULDN\'T MIND." IT\'S A REFRIGERATOR.'); setObj3('Talk to the Inspector', 'sort_hall', 'inspector');
}
async function inspectorTalk() {
  if (F3('chuteOpen')) return say('INSPECTOR 9 WATCHES THE CHUTE. HE DOES NOT BLINK. HE HAS NOT BLINKED SINCE YOU CAME IN.', null);
  if (F3('i9task') === 'jam' && F3('jamFixed')) { setF3('i9taskDone'); setF3('i9ready'); }
  if (F3('i9ready')) return inspectorBoss();
  if (!F3('i9met')) { setF3('i9met'); await say2([[I9, 'Halt. Postal Inspector 9. Regional.'], [I9, 'State your name, your employer and the nature of the parcel in your possession.'], ['CARL', 'I don\'t have a parcel.'], [I9, 'You have a parcel. It is the only one that has ever been in transit for nineteen years. Everyone at the dock called ahead.']]); }
  if (F3('i9task') && !F3('i9taskDone')) return say('Complete the task you claimed. Or admit you are not what you claimed. I am patient. It is my job.', I9);
  const c = await claimMenu(I9, 'Identify yourself or I will do it for you.', ['sorter', 'maintenance', 'courier'], { stop: 5 });
  if (c === 'sorter') { await say2([['CARL', 'I\'m the new sorter. I was hired. Remotely.'], [I9, 'We are not hiring.'], ['CARL', 'I was hired before that.'], [I9, 'Sort.']]); setF3('i9task', 'sort'); const ok = await sortGame(); if (!ok) { await say2([[I9, 'You sorted a refrigerator into the dead letters. Try again.']]); setF3('i9task', ''); return; } finishAlibi('sorter', 'SORTED THE MAIL'); setF3('i9taskDone'); setF3('i9ready'); await say(I9 + ': ' + 'ADEQUATE.'); return inspectorBoss(); }
  if (c === 'maintenance') { await say2([['CARL', 'Maintenance. Belt maintenance.'], [I9, 'Lane Two has been jammed since the last administration. Clear it.']]); setF3('i9task', 'jam'); const a = alibiOf('maintenance'); if (a) a.task = 'CLEAR THE JAMMED BELT'; setObj3('Clear the jam on Lane 2', 'sort_hall', 'jam'); return; }
  await say2([['CARL', 'I\'m a courier. I have a parcel. It\'s addressed to me.'], [I9, 'Of course it is.']]); setF3('i9ready'); return inspectorBoss();
}
async function inspectorBoss() {
  if (F3('i9task') === 'jam' && !F3('jamFixed')) return say('Lane Two. The panel. I am watching.', I9);
  if (F3('i9task') === 'jam') setF3('i9taskDone');
  await say2([[I9, 'Hand over the parcel.'], ['CARL', 'No.'], [I9, 'It is a federal matter. The parcel is evidence. I have been collecting evidence of that parcel for nineteen years.'], [I9, 'Thirty-one crates went out marked DECOY. I opened four. All empty, except for a note. The notes were addressed to me. They were polite.'], ['CARL', 'The crate was a joke. It said so.'], [I9, 'WHAT DID YOU SAY?']]);
  let r; do { r = await argue3({ id: 'inspector9', name: 'INSPECTOR 9', port: 'INSPECTOR', patience: 14, weak: { LOGIC: 2 }, immune: ['DENIAL'], atk: ['Hand it over.', 'Form 11-A. In triplicate. Do you have a pen.', 'You are in violation of eleven regulations. I will name them.', 'I am extremely calm.'], hit: 1, hint: 'LOGIC. he cannot argue with the rules he follows', win: 'The... the form is correct. The... I have no standing.', open: 'HE QUOTES THE REGULATIONS AT YOU.' }); } while (!r.win);
  await say2([['CARL', 'Wait. Wait, wait. The label.'], [I9, 'What about the label.']]);
  await say('THE PARCEL SAYS "NO SUCH ADDRESS. HOLD." IN RED. HE LOOKS AT IT. HE LOOKS AT IT FOR A LONG TIME.');
  DBG.truth = 1; const reg = await ask('WHICH REGULATION?', I9, ['9.1 (INSPECTION OF SUSPICIOUS MAIL)', '9.4 (NO SUCH ADDRESS: UNDELIVERABLE)', '12.2 (REFUNDS AND EXCHANGES)']); DBG.truth = undefined;
  if (reg !== 1) { await say2([[I9, 'That regulation does not apply. Try again.']]); return; }
  await say2([['CARL', '9.4. No such address means undeliverable. Undeliverable mail goes to the dead letter chute. And you can\'t open dead letters. Not even you.'], [I9, '...'], [I9, 'The address does not exist. The parcel is undeliverable. The parcel is a dead letter.'], [I9, 'I have waited nineteen years for it to be a dead letter. I did not think it would be one because of a rule I wrote.'], ['CARL', 'You wrote it?'], [I9, 'Everyone writes one rule they regret.']]);
  addNote('INSPECTOR 9: "Everyone writes one rule they regret." Reg 9.4: no such address = dead letter.');
  await i9Turn();   // c3finale.js: the Reading Room, Inspector 3, and which rule wins
}
async function enterDLO() {
  await say2([['CARL', 'It\'s a chute. It\'s the right size. For a parcel. For a short parcel.'], [U0, 'carl'], ['CARL', 'It\'s the right size for me. That\'s what I said.']]);
  await fadeOut(.1); C3.stop = 6; setF3('arrived6'); music(null);
  scene = { draw() { cls(BLACK); } }; await showCard(['THE LAST STOP', '', 'THE DEAD LETTER OFFICE'], 120, { fg: hex('#ffd848') });
  scene = worldScene3; loadScene('dlo', 0, 2.2, 0); post.fade = 1; await fadeIn(.08);
  run(arriveDLO);
}
// ---------------- STOP 6: THE DEAD LETTER OFFICE ----------------
async function arriveDLO() {
  await say2([['CARL', 'Ow. I landed on a pile of letters. A lot of them are for Santa.'], ['CARL', 'It\'s huge. It\'s the biggest place I\'ve been inside. Shelves up to the roof. Everything undeliverable. Every wrong address.'], [U0, 'it is so quiet'], ['CARL', 'It\'s a quiet place. I\'d like to not make it worse.']]);
  setObj3('Talk to the clerk at the desk', 'dlo', 'clerk0');
}
SCENES.dlo.ents = () => [
  npc3('clerk0', 'clerk', 0, 6.2, 'CLERK 0', () => clerk0(), { yaw: Math.PI, range: 3.0 }),
  { id: 'shelves', kind: 'prop3', at: [-9, 0, 9.5], label: 'SHELVES', range: 3, talk: () => shelves(), draw3: () => {}, promptY: .8 },
];
async function shelves() {
  const L = ['A BIRTHDAY CARD ADDRESSED TO SANTA, 1971. RETURN ADDRESS: SANTA.', 'A KEY, A TAG, A DEPOSIT, A PIANO. IT\'S IN A BOX MARKED "NOT YET."', 'A POSTCARD FROM THE MOON. THE STAMP IS A REAL STAMP. THE MOON IS NOT A REAL ADDRESS.', 'FIFTY-THREE BOXES ADDRESSED "TO THE TALL ONES." ALL UNOPENED.', 'A BOWTIE, MAILED WITHOUT A BOX, STAMPED 400 TIMES. IT IS GREEN. IT IS NOT YOURS.'];
  await say(pick(L));
}
async function clerk0() {
  if (F3('ending')) return;
  await say2([[CL0, 'Addressee unknown. Item unclaimed. Sender unknown.'], [CL0, 'Welcome. Nobody has come in through the chute in twenty-nine years. We have a chair for it. It is a good chair.'], ['CARL', 'I\'m here to deliver this.'], [CL0, 'You are not here to deliver it. You are here to be delivered to. The parcel has been waiting for you to arrive so it can arrive.']]);
  await say('THE CLERK PLACES THE PARCEL ON A SCALE. THE SCALE ISN\'T A SCALE. IT TAKES THE PARCEL\'S FULL ADDRESS AND READS IT BACK:');
  await say('"CARL, [[[[[, ABOVE AND BELOW NEVADA." STATUS: DELIVERABLE. THIS HAS NEVER HAPPENED BEFORE.');
  await say2([[CL0, 'An address that exists only when the addressee does. We do not get many. You are the third. The other two were not mail.'], ['CARL', 'Who were the other two?'], [CL0, 'That is not on the form.']]);
  await say2([[CL0, 'Before I can release it, I have received notices from six offices along the route. You told people different things.'], ['CARL', 'It\'s a ledger. It\'s not a— it\'s just what happens when you walk into a place.'], [CL0, 'Each is a forwarding address. I cannot deliver to six addresses. I can deliver to one.']]);
  await retractions();
  await say2([[CL0, 'Name.'], ['CARL', 'Carl.'], [CL0, 'That is what they call you.'], ['CARL', 'It\'s what I answer to. My name is...']]);
  await say('HE SAYS IT. THE PLAYER HEARS A NOISE LIKE A DOOR OPENING AND SEES ONLY: [[[[[');
  await say2([[CL0, 'Address.'], ['CARL', 'Above and below Nevada.'], [CL0, 'That is both halves.'], ['CARL', '...Yeah. It\'s both halves.']]);
  sfx('stamp'); await wait(20); sfx('stamp'); post.flash = .5; await wait(6); post.flash = 0;
  await say('THE CLERK STAMPS THE PARCEL "VALID." THE STAMP IS NOT A STAMP. IT SOUNDS LIKE A DOOR OPENING IN A LONG HALL.');
  addNote('STAMP 11: THE DEAD LETTER OFFICE. VALID. (First time in its history.)'); C3.route[6] = 1; setF3('done6');
  const EO = ['SIGN FOR IT', 'RETURN TO SENDER', 'FORWARD IT', 'REFUSE DELIVERY'].concat(cratesFound() >= 31 ? ['SIGN, AND WRITE BACK'] : []);
  const c = await ask('WHAT DOES HE DO WITH IT?', CL0, EO);
  const E = ['signed', 'returned', 'forwarded', 'refused', 'replied'][c]; setF3('ending'); C3.ending = E;
  await ENDINGS3[E]();
  await credits3(E);
}
async function retractions() {
  const open = () => C3.alibis.filter(a => !a.retracted);
  const OWN = { maintenance: 'I\'m not maintenance. I wanted in. I fixed it because it was broken and nobody else was going to.', resident: 'I don\'t live there. I don\'t live anywhere. I live in a ship, in a lot.', inspector: 'I don\'t inspect things. I deliver them.', trucker: 'I\'m not a trucker. I\'m a courier. It\'s close.', relative: '...I don\'t know if I\'m their family. I\'m hoping.', investor: 'I don\'t have any money. I have a few bux and a lot of feelings.', shopper: 'I wasn\'t shopping. I was looking for them.', sorter: 'I can\'t sort. I sorted one box and it was a different box.' };
  if (!open().length) { await say2([[CL0, 'No notices. You were honest at every stop.'], ['CARL', 'Not every stop. Most. A couple of them I just got lucky.'], [CL0, 'That is also a kind of honesty.']]); return; }
  for (const a of open()) {
    for (;;) {
      DBG.truth = 0; const i = await ask(STOPTAB[a.stop].name + ': "' + CLAIMS[a.id].short + '." IS THAT YOUR ADDRESS?', CL0, ['TAKE IT BACK', 'KEEP IT']); DBG.truth = undefined;
      if (i === 0) { a.retracted = 1; C3.suspicion = Math.max(0, C3.suspicion - 1); sfx('ok'); await say(OWN[a.id] || 'I\'m not that.', 'CARL'); await say(CL0 + ': NOTED. ONE ADDRESS FEWER.'); break; }
      await say2([[CL0, 'Then that is an address. You will have two. I cannot deliver to two. Try again.']]);
    }
  }
  await say2([[CL0, 'One address.'], ['CARL', 'It feels lighter.'], [CL0, 'It is lighter. Mail does that.']]);
}
// ---------------- the four endings ----------------
const ENDINGS3 = {
  signed: async () => {
    await say2([[CL0, 'Signature.'], ['CARL', 'It\'s the longest signature I\'ve ever done.']]);
    await signature('RECEIVED, DEAD LETTER OFFICE');
    await say('THE CLERK OPENS THE PARCEL WITH A LETTER OPENER SHAPED LIKE A KEY. INSIDE: A SINGLE SHEET OF PAPER, A STAMP PAD, AND A CARD.');
    await showCard(['TO [[[[[,', '', 'IF YOU ARE READING THIS,', 'YOU LEFT.', 'GOOD.'], 0, { fg: hex('#ffe8c0') });
    await showCard(['WE DIDN\'T KNOW HOW ELSE', 'TO REACH YOU, SO WE REACHED', 'EVERYONE ELSE.', '', 'EVERY CLERK ON THIS ROAD HAS', 'BEEN PRACTICING YOUR NAME', 'FOR YEARS.'], 0, { fg: hex('#ffe8c0') });
    await showCard(['WE CHOSE THE LONG WAY SO THEY', 'WOULD CHASE THE BOX', 'INSTEAD OF YOU.', '', 'WE ARE SORRY LONG MEANT', 'THIS LONG.'], 0, { fg: hex('#ffe8c0') });
    await showCard(['WE ARE NOT ASKING YOU', 'TO FIND US.', '', 'WE ARE ASKING YOU TO DELIVER', 'THIS TO YOURSELF.', 'THAT IS ALL.', 'THAT IS EVERYTHING.'], 0, { fg: hex('#ffe8c0') });
    await showCard(['P.S. THE CRATE WAS A JOKE.', 'WE THOUGHT YOU WOULD LIKE', 'THE CRATE.'], 0, { fg: hex('#ffe8c0') });
    await say2([['CARL', '...I did like the crate.'], [U0, 'carl'], ['CARL', 'It\'s a nice crate. It\'s a normal crate for a normal— I liked it.']]);
    await say('THE CARD IS A DEAD LETTER LEDGER ENTRY, ALREADY FILLED OUT: "SENDER: [[[[[ AND [[[[[. ADDRESSEE: [[[[[. STATUS: DELIVERED (ADDRESSEE). SENDER STATUS: STILL IN TRANSIT."');
    await say2([['CARL', 'In transit where?'], [CL0, 'That is not on the form.'], ['CARL', 'It\'s on the form. It\'s the status.'], [CL0, 'It is the status. It is not the location. Locations are for senders who have stopped.']]);
    addNote('THE PARCEL: a letter. "We chose the long way so they would chase the box instead of you." Senders: STILL IN TRANSIT.');
  },
  returned: async () => {
    await say2([['CARL', 'I\'m returning it.'], [CL0, 'To sender.'], ['CARL', 'Yeah. With a note.'], [CL0, 'The sender is also the address.'], ['CARL', 'I know. I know that\'s the joke. I\'m doing it anyway.']]);
    await say('HE WRITES ON THE PARCEL, IN HIS OWN HAND, IN A NAME ONLY HE CAN READ: "RECEIVED. NOT YET." AND STAMPS IT RETURN TO SENDER. THE STAMP THUDS LIKE A DOOR.');
    for (const [who, t] of [['POSTMASTER HANK', 'Back already? Back through the dust. Good. I\'ll hold it fourteen days.'], ['DOLORES', 'Room 6 is still clean. I\'ll put it on the bed.'], ['RADIO RAY', 'Carry it to the next stop. Don\'t look inside. We know the drill.'], ['DENNIS', 'Mall Station accepts return mail. It always did. Nobody asked.'], ['MARGO', 'Honey. You gave it a note. They\'ll feel that.']]) await say(t, who);
    await say2([[CL0, 'The sender will receive it eventually. Mail is patient.'], ['CARL', 'So am I. A little. Today.']]);
  },
  forwarded: async () => {
    await say2([['CARL', 'I want to forward it.'], [CL0, 'To whom.'], ['CARL', 'To... whoever is next. Somebody who also got a card. Somebody who also got lost in the mail.'], [CL0, 'That is not a name. It is an address. It is a valid one.']]);
    await say('THE CLERK WRITES: "TO: WHOEVER IS NEXT." THE PARCEL GOES INTO THE DEAD LETTER CHUTE, BACKWARDS, UP. IT LEAVES.');
    await say2([[CL0, 'You have done what the tall ones did. You have sent a thing on a road to a person you will never meet.'], ['CARL', 'It\'s not the same. They knew me.'], [CL0, 'They knew they would.'], [CL0, 'We are short a courier. For dead mail. It is a trial position. It is not a trial.']]);
    await say2([['CARL', 'I\'d like to think about it.'], [CL0, 'You have thought about it. You are standing behind the counter.']]);
  },
  refused: async () => {
    await say2([['CARL', 'I\'m not taking it.'], [CL0, 'You are the addressee.'], ['CARL', 'I\'m a normal guy. I\'m from Nevada. I don\'t get mail like this. I don\'t get mail.'], [CL0, 'You have a mailbox.'], ['CARL', 'It\'s a ship.'], [CL0, 'Addressee refused. Return to sender.']]);
    await say('THE CLERK STAMPS IT. THE STAMP SAYS "REFUSED." IT IS THE QUIETEST STAMP YOU HAVE EVER HEARD.');
    await say2([[DI, 'Carl. Carl, I\'m looking at the tracker. Everything in the cargo bay just went to "returned." The cactus. The fedora. All of it.'], ['CARL', 'That was a normal choice.'], [GA, 'Kid. That was a decision.'], [U0, 'carl']]);
    await say('CARL WAKES UP IN THE COCKPIT OF THE A.S.S. THE CARGO BAY IS EMPTY. IT ECHOES. THE SEAT IS BARE.');
  },
};
async function credits3(E) {
  DBG.credits = 1; C3META.ends[E] = 1; saveC3M(); try { localStorage.removeItem('carl3_save'); } catch (e) {}
  await fadeOut(.06); music('credits'); scene = { draw() { cls(BLACK); } }; post.fade = 0;
  const L = ['CARL 3', 'RETURN TO SENDER', '', '', 'CARL', '...COURIER, ADDRESSEE', '', 'DISPATCH', '...ROUTING', '', 'JB GARFIELD', '...ON THE RADIO', '', 'SPOOKY GHOST', '...IN THE RADIO', '', 'CEO LINDA', '...STAYED FOR UNIT 14', '', 'OLD FACE', '...A TV', 'NEW FACE', '...IN CASE', '', 'POSTMASTER HANK', 'DOLORES', 'RADIO RAY', 'DENNIS', 'MARGO', 'DUKE', 'BEV', 'JUNE (AND WALT)', 'ARLO', 'OPAL', '...CLERKS', '', 'MAVIS', '...HELD THE SEAT', '', 'INSPECTOR 9', '...ONE RULE, ONE NAME', 'INSPECTOR 3', '...READING', '', 'CLERK 0', '...ADDRESSEE UNKNOWN', '', 'THE TALL ONES', '...STILL IN TRANSIT', '', 'SPECIAL THANKS', 'CHAT', 'USER_000', '', '', 'A PRETEND CO. PRODUCTION', 'RENDERED IN REAL 3D', '', '', ({ signed: 'DELIVERED.', returned: 'RETURNED. WITH A NOTE.', forwarded: 'FORWARDED.', refused: 'REFUSED.' })[E]];
  let y = H + 10, t = 0; scene = { update() { t++; }, draw() { skyD(0, H, '#101028', '#2a1450'); for (let i = 0; i < 40; i++) pset((i * 53 + t) % W, (i * 29 + (t >> 1)) % H, i % 5 ? hex('#9292db') : WHITE); L.forEach((l, i) => { const yy = y + i * 14; if (yy > -10 && yy < H) ctext(l, yy | 0, l === 'CARL 3' || l === 'RETURN TO SENDER' ? hex('#ffd848') : l.startsWith('...') ? UI.dim : hex('#e8e8ff')); }); } };
  while (y > -L.length * 14 + 80) { y -= .5; await nextFrame(); }
  await wait(160); await fadeOut(.04);
  scene = { draw() { cls(BLACK); } }; music(null);
  if (E === 'signed') { await showCard(['THE TALL ONES', 'STATUS: STILL IN TRANSIT'], 150); await showCard(['CARL WILL RETURN.', '(SIGNATURE REQUIRED)'], 160); }
  else if (E === 'returned') await showCard(['PARCEL STATUS:', 'IN TRANSIT.', '(AGAIN.)'], 160);
  else if (E === 'forwarded') await showCard(['COURIER, DEAD LETTERS.', 'TRIAL PERIOD: INDEFINITE.'], 160);
  else if (E === 'intercepted') await showCard(['PARCEL STATUS:', 'OPENED BY INSPECTION.', 'CONTENTS: ONE LETTER.', 'NOT FOR THEM.'], 170);
  else if (E === 'replied') { await showCard(['THE TALL ONES', 'STATUS: STILL IN TRANSIT'], 150); await showCard(['REPLY STATUS:', 'IN TRANSIT.', '(POSTAGE PAID.)'], 170); }
  else await showCard(['ALL PARCELS RETURNED.', 'THE SHIP IS EMPTY.', 'IT HAS NEVER BEEN SO NORMAL.'], 170);
  DBG.end = 1; titleScreen3();
}
