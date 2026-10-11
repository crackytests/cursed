'use strict';
// ================= CARL 3: the finishing pass. the ACT II finale (Bev, the counterfeit stamp), the Reading Room (Inspector 3, Inspector 9's turn),
// the stacks at the Dead Letter Office (every notice taken back by hand), and the two new endings: INTERCEPTED and REPLIED =================
const BV = 'BEV', I3 = 'INSPECTOR 3';
regBust(BV, genBust({ skin: '#dbb692', hair: '#b6b6db', hairStyle: 'big', top: '#db6d92', glasses: 1 }), '#ff92b6');
regBust(I3, genBust({ skin: '#f0e0c8', hair: '#b6b6b6', top: '#e8e8e8', glasses: 1, collar: '#ffffff', tie: '#2058b0' }), '#496dff');
Object.assign(VOICE, { BEV: [700, 70], 'INSPECTOR 3': VOICE.VERN || [340, 15] });
Object.assign(PEOPLE, { bev: { top: '#db6d92', bottom: '#49406d', hair: '#b6b6db', hairStyle: 'big', glasses: 1, k: .94 }, i3: { top: '#e8e8e8', bottom: '#d0d0d0', glasses: 1, hair: '#b6b6b6', tie: '#2058b0', shoe: '#a0a0a0' } });
for (const k of ['bev', 'i3']) MODELS_P[k] = personModel(PEOPLE[k]);
const botWants = e => typeof BOT !== 'undefined' && BOT.W8.ending === e;   // test hook: lets the bot take the bad deal

// ================= ACT II FINALE: the stamp that doesn't scan =================
async function act2Finale() {
  setF3('act2reveal');
  await say2([[DI, 'Carl. That\'s every clerk on the fork. But the tracker won\'t close the loop. One stamp doesn\'t scan.'], ['CARL', 'Which one.'], [DI, 'The Little Green Inn. The ink isn\'t postal ink. It doesn\'t read TRANSIT. It reads CUSTODY.']]);
  await say2([[GA, 'Kid. The cardigan. A man asked you to say something into a tape and gave you a stamp for it. That wasn\'t a clerk. That was a deposition.'], ['CARL', 'He had a card.'], [GA, 'He had a copy of a card. Somebody had the original. Somebody\'s been on vacation for three weeks.'], [DI, 'Nothing past the Inn counts until the Inn is fixed, Carl. The chain is only as good as its worst clerk.'], ['CARL', 'Its fakest clerk.'], [DI, 'That too.']]);
  addNote('THE INN STAMP IS COUNTERFEIT. Federal ink. Reads CUSTODY, not TRANSIT. Find Bev.');
  if (C3.stop === 7) setObj3('Find Bev. Try the motel wing', 'inn_lot', 'room3'); else setRouteObj();
}
const _wantDest3 = wantDest;
wantDest = function () { if (act2Done() && !F3('act2fin')) return 7; return _wantDest3(); };
const _rev7 = REVISIT[7];
REVISIT[7] = async () => {
  if (!(F3('act2reveal') && !F3('act2fin'))) return _rev7 && _rev7();
  await say2([[DD, 'He left. Vern. This morning, in the sedan, with a shoebox of little tapes. Didn\'t pay for his pie.'], ['CARL', 'Where\'s Bev?'], [ER, 'Room 3. Motel wing. I watched them carry trays in there for three weeks.'], [ER, 'Nobody on vacation eats that many club sandwiches in one room. I wrote it down. I write everything down. Nobody asks.']]);
  setObj3('Room 3, in the motel wing', 'inn_lot', 'room3');
};
SCENES.inn_lot.ents = (base => () => base().filter(e => !(e.id === 'sedan7' && F3('act2reveal'))).concat([
  { id: 'room3', kind: 'prop3', at: [29.4, 0, 19], label: 'ROOM 3', range: 2.2, cond: () => F3('act2reveal') && !F3('bevFree'), talk: () => room3(), draw3: () => {} },
  npc3('bev', 'bev', 27.6, 21.4, BV, () => bevTalk(), { yaw: -1.6, cond: () => F3('bevFree') }),
]))(SCENES.inn_lot.ents);
SCENES.inn_lot.cams.push({ id: 'wing', pos: [14, 4.2, 9], look: [30, 1.4, 20], fov: .95, zone: [24, 12, 32, 29.6] });   // the motel wing had no camera facing it
SCENES.inn_shop.ents = (base => () => base().filter(e => !((e.id === 'vern' || e.id === 'recorder') && F3('act2reveal'))))(SCENES.inn_shop.ents);
async function room3() {
  await say('ROOM 3. A DO NOT DISTURB SIGN, LAMINATED, WITH A FEDERAL SEAL ON IT. BEHIND THE DOOR, A TELEVISION, AND A WOMAN SHOUTING ANSWERS AT A GAME SHOW.');
  await say2([[BV, 'If that\'s room service again, I said NO MORE CLUB SANDWICHES. I have had ONE HUNDRED AND TWELVE.'], ['CARL', 'It\'s a courier.'], [BV, '...Short?'], ['CARL', 'Normal.'], [BV, 'Oh, thank God. Get me out of here, honey. It\'s a federal lock. It\'s a regular lock with a federal sticker on it.']]);
  const ok = await wires('ROOM 3 DEADBOLT', 5); if (!ok) return say2([[BV, 'I heard that. That was the sound of a man losing to a sticker.']]);
  setF3('bevFree'); sfx('door'); const e = ent3('room3'); if (e) e.gone = 1;
  await say('THE DOOR OPENS. A WOMAN IN A MOTEL ROBE STEPS OUT INTO THE GREEN LIGHT AND BREATHES LIKE SOMEONE WHO HAS SEEN NINE CHANNELS FOR THREE WEEKS.');
  await bevTalk();
}
async function bevTalk() {
  if (F3('act2fin')) return say(pick(['Go east, honey. Ink\'s red, chain\'s whole. Bring me back a postcard. A real one.', 'I\'m never eating a club sandwich again. I\'m going to eat pie until I forget the shape of a toothpick.']), BV);
  await say2([[BV, 'Three weeks ago a man in a cardigan came in from "the regional office." Said it was an inspection. Asked to see my card.'], [BV, 'Photocopied it. Said I\'d won a vacation. Room 3, all expenses paid. Then he put a man outside the door.'], ['CARL', 'That\'s Vern.'], [BV, 'That\'s Inspector 3, honey. Postal Inspection Service. He got a card nineteen years ago same as me. We all got cards that year. His came with a pension.']]);
  await say2([[BV, 'You know why he wanted it on tape? Regulation 14.1. Mail addressed to a person is sacred. Mail addressed to a non-person is property. And property can be opened.']]);
  if (F3('confessed')) await say2([[BV, 'And you said it. Into his recorder.'], ['CARL', '...It was true.'], [BV, 'Honey. True was never the problem. True is never the problem. Who\'s holding the tape is the problem.']]);
  else await say2([[BV, 'He made you carry a rock to prove you\'re not from here? "Not from here" is a legal phrase, honey. You carried his evidence for him. Fifty pounds of it.'], ['CARL', 'It had a face on it.'], [BV, 'They always put a face on it.']]);
  await say2([[BV, 'He\'s gone east. To the Sorting Center. That\'s where they read.'], [BV, 'Now. The card. The real one.'], ['CARL', 'He took it.'], [BV, 'He took a photocopy of it. I\'m not a fool, I\'m a postal clerk. The real one\'s been in the walk-in freezer for three weeks. Inside a cherry pie. Nobody steals a pie from a diner. It\'s the one thing.']]);
  await say2([[DD, 'THAT\'S where my cherry went?'], [BV, 'Put it on my tab, Dodie.']]);
  await say('BEV PRODUCES A FROZEN CARD, WORN SOFT AS FELT, AND A STAMP PAD THAT IS RED. SHE BREATHES ON THE STAMP TWICE, THE OLD WAY.');
  await signature('FORWARD, LITTLE GREEN INN (CORRECTED)'); C3.route[7] = 1; setF3('fakeStamp7', 0); setF3('stamp7real');
  sfx('stamp'); await say('RED INK. IT DOESN\'T DRY INSTANTLY. IT TAKES ITS TIME, LIKE MAIL.');
  await say2([[DI, 'Carl. Tracker\'s green. It says TRANSIT. Normal font.'], ['CARL', 'Normal.'], [DI, 'Don\'t get used to it.']]);
  addNote('BEV: Vern was Inspector 3. Reg 14.1: mail to a non-person is property. The real card was in a pie. Red ink. The chain is whole.');
  setF3('act2fin'); setObj3('Back to the ship', 'inn_lot', 'ass7'); setF3('pendingCall7b');
}
const _enterShipF = enterShip;
enterShip = async function () { await _enterShipF(); if (F3('pendingCall7b') && !F3('calledStop7b')) { setF3('calledStop7b'); await wait(20); await say2([[GA, 'Kid. A rule that turns a person into a parcel. That\'s the oldest trick there is. They just finally wrote it down.'], ['CARL', 'What do I do about a rule?'], [GA, 'Find the guy who wrote the other one.']]); setRouteObj(); } };

// ================= THE READING ROOM: under the Sorting Center =================
(() => {
  const b = SB({ amb: [.44, .42, .38], sun: { dir: [.1, 1, -.2], col: [.34, .32, .28] }, sky: ['#000008', '#0a0a10'], fog: { col: '#0a0a0a', dens: .004 }, music: 'dlo', title: 'THE READING ROOM' });
  b.ground(26, 16, { col: '#6d6d64', tex: 'concrete', ts: 3, shiny: .2 }, 0, 7);
  const WL = { col: '#585850', tex: 'concrete', ts: 3 };
  b.box(0, 14.6, 26, .6, 5, WL); b.box(-13, 7, .6, 16, 5, WL); b.box(13, 7, .6, 16, 5, WL);
  for (const [x, z] of [[-6, 6], [6, 6], [-6, 10], [6, 10]]) { b.box(x, z, 6, 1.2, .9, { col: '#493a2a', tex: 'wood', ts: 2, shiny: .3 }); b.add('box:.5:.3:.3', [x - 1.8, .9, z], { col: '#24924a', emis: .6 }); b.cyl(x + 1.6, z, .22, .5, { col: '#b6b6b6', shiny: .7 }, { y: .9, seg: 8 }); for (let i = 0; i < 4; i++) b.add('box:.5:.02:.35', [x - .8 + i * .55, .92, z + .1], { col: '#e8e0c8' }); }
  b.add('box:12:3.2:.15', [0, 1.1, 14.2], { col: '#c8b896', emis: .25 });                          // the board, with the ledger on it
  b.box(0, 13.2, 5, 1.2, 1, { col: '#303030', tex: 'metal', ts: 1 });                              // his desk
  b.lights.push({ p: [-6, 2.4, 8], col: [.6, 1, .7], rad: 9, int: 1 }, { p: [6, 2.4, 8], col: [.6, 1, .7], rad: 9, int: 1 }, { p: [0, 4, 12], col: [1, .95, .8], rad: 12, int: 1.2, glow: .6 }, { p: [0, 3, 10], col: [1, .9, .8], rad: 10, int: 1.1 }, { p: [0, 3.4, 3], col: [.8, .85, 1], rad: 12, int: 1 });
  b.walkRect(-12, 1, 12, 12.4);
  b.cam('rrw', [-6, 9, -8], [-6, 1.2, 8], 1.0, [-30, -30, 0, 30]); b.cam('rre', [6, 9, -8], [6, 1.2, 8], 1.0, [0, -30, 30, 30]);
  SCENES.sort_reading = Object.assign(b.fin(), { start: [0, 0, 1.6],
    drawOver: () => { // the ledger, pinned up and read: every claim he made, in red string
      const a = project(LIVE.cam, [-5.6, 4.1, 14.1]), c = project(LIVE.cam, [5.6, 1.3, 14.1]); if (!a || !c) return;
      const L = C3.alibis.filter(x => !x.retracted).map(x => CLAIMS[x.id].short).concat(F3('confessed') ? ['"I\'M AN ALIEN" (TAPE)'] : []);
      L.slice(0, 8).forEach((s, i) => { const x = a[0] + 4 + (i & 1) * ((c[0] - a[0]) / 2), y = a[1] + 4 + (i >> 1) * 9; text(s.slice(0, 22), x, y, hex('#b62424'), 0); });
      if (!L.length) text('NOTHING PINNED. HE HATES THAT.', a[0] + 6, a[1] + 8, hex('#6d4924'), 0);
    } });
})();
SCENES.sort_reading.ents = () => [
  { id: 'reading_up', kind: 'prop3', to: 'sort_hall', at: [0, 0, 1.0], label: 'UP', range: 1.6, talk: () => goScene('sort_hall', 5.5, 26.4, Math.PI), draw3: () => {} },
  npc3('i3', 'i3', 0, 12.0, I3, () => i3Talk(), { yaw: Math.PI, range: 2.6, cond: () => !F3('readDone') }),
  npc3('ag1', 'suit', -4.6, 12.2, '', null, { yaw: Math.PI, range: 0, cond: () => !F3('readDone') }),
  npc3('ag2', 'suit', 4.6, 12.2, '', null, { yaw: Math.PI, range: 0, cond: () => !F3('readDone') }),
  npc3('i9r', 'inspector', -2.6, 3.4, 'INSPECTOR 9', () => i9Room(), { yaw: .5 }),
];
SCENES.sort_hall.ents = (base => () => base().concat([
  { id: 'reading_door', kind: 'prop3', to: 'sort_reading', at: [5.5, 0, 27.4], label: 'STAIRS DOWN', range: 1.8, cond: () => F3('i9turn') && !F3('readDone'), talk: () => readingDown(), draw3: () => {} },
]).filter(e => !(e.id === 'inspector' && F3('i9turn'))))(SCENES.sort_hall.ents);
async function i9Turn() {
  await say2([[I9, 'The chute is on the west wall.'], [I9, 'But you will not reach it tonight. Inspector 3 is downstairs, in the Reading Room. He has been reading your route for three weeks.'], ['CARL', 'The cardigan.'], [I9, 'He wears a cardigan to be believed. It is the only thing about him that is not regulation.']]);
  await say2([[I9, 'He does not care about 9.4. He has his own rule. 14.1. Mail addressed to a non-person is property. Property may be opened.'], [I9, F3('confessed') ? 'And he has you on tape, saying what you are.' : F3('rockDone') ? 'And he has a rock you carried to prove you are not from here.' : 'And he has a board with every story you told on this road.'], [I9, 'Come down with me. I wrote one rule I regret. I would like to not regret it tonight.']]);
  setF3('i9turn'); setObj3('Go down to the Reading Room with Inspector 9', 'sort_hall', 'reading_door');
}
async function readingDown() {
  await goScene('sort_reading', 0, 1.6, 0);
  if (!F3('readSeen')) { setF3('readSeen'); run(async () => { await say2([['CARL', 'It\'s a library. It\'s a library where everything was somebody\'s. There are kettles. Why are there kettles.'], [I9, 'Steam. For the envelopes.'], ['CARL', 'That\'s the worst thing I\'ve ever heard.'], [U0, 'carl the board'], ['CARL', '...That\'s my ledger. He pinned up my ledger.']]); setObj3('Talk to Inspector 3', 'sort_reading', 'i3'); }); }
}
async function i9Room() {
  if (F3('readDone')) return say(pick(['Go. The chute. I am filing the slowest report in the history of the Service.', 'I am fine. I am un-numbered. It is very drafty.']), I9);
  return say('Talk to him. I will be here. I am always here. It is my worst quality.', I9);
}
async function i3Talk() {
  const lies = C3.alibis.filter(a => !a.retracted);
  if (!F3('i3met')) {
    setF3('i3met');
    await say2([[I3, 'The courier. Stand. Sitting implies a duration.'], [I3, 'You met me as Vern. Vern was a pleasure. I am Inspector 3. Regional. Reading.'], ['CARL', 'You locked Bev in a motel.'], [I3, 'I sent Bev on a vacation. The Service paid. She had nine channels.']]);
    await say2([[I3, lies.length ? 'Every story you told on this road is on that board. ' + lies.length + ' of them. ' + [...new Set(lies.map(a => CLAIMS[a.id].short))].slice(0, 3).map(s => '"' + s.toLowerCase() + '."').join(' ') + ' I read them every morning with my coffee.' : 'Your board is empty. You told the truth at every counter. Do you know how rare that is. I find it suspicious.'], ['CARL', 'Those were for getting in doors.'], [I3, 'Everything is for getting in doors.']]);
    if (F3('confessed')) { await say('HE PRESSES PLAY. A SMALL VOICE, VERY FAR AWAY: "I\'M AN ALIEN." IT IS CARL\'S VOICE. THE ROOM IS QUIET IN A WAY ONLY PAPER CAN BE QUIET.'); await say2([[I3, 'Regulation 14.1. A parcel addressed to a non-person is not mail. It is property. And property may be opened.']]); }
    else await say2([[I3, 'Regulation 14.1. A parcel addressed to a non-person is not mail. It is property, and property may be opened. And a man who carries a rock to prove he is "not from here"...'], ['CARL', 'It had a face on it.'], [I3, 'Evidence often does.']]);
  }
  await say2([[I3, 'So. A deal. Put the item on my desk, and the board comes down. Every story. Gone. You walk out of here a normal man.'], [I3, 'You can be a normal man, Carl. That is all you have ever asked anyone for.']]);
  DBG.pick = () => botWants('intercepted') ? 1 : 0;
  const d = await ask('THE DESK IS RIGHT THERE.', I3, ['NO.', 'PUT IT ON THE DESK']); DBG.pick = null;
  if (d === 1) return intercepted();
  await say2([['CARL', 'No.'], [I3, 'Then we argue. I should tell you I have read your arguments. All of them. You lead with denial.']]);
  let r; do { r = await argue3({ id: 'inspector3', name: I3, port: I3, patience: 12 + lies.length * 2, weak: { LOGIC: 2 }, immune: ['DENIAL'], atk: ['I have it in writing.', 'I have it on tape. I have it in triplicate. I have it laminated.', 'You told a doorman you were a high roller. You won five dollars.', 'Regulation 14.1, subsection a.', 'Do you know what you are? I do. It is on the board.'], hit: 1, hint: 'logic. and let number nine talk. he knows the book', win: '...You have a point. It does not matter. I have a regulation.', open: 'HE READS YOUR LEDGER BACK TO YOU, IN ORDER.' }); } while (!r.win);
  await say2([[I3, 'Points do not open parcels. Regulations do. 14.1 stands.'], [I9, 'So does 9.4.'], [I3, 'Nine. Sit down.'], [I9, 'Regulation 9.4. No such address: undeliverable. The parcel is a dead letter until its address exists. And an address exists where its addressee does.'], [I9, '9.4 makes no exception for species. I wrote it. I was very thorough. It was the only thing I was ever thorough about that mattered.']]);
  for (;;) {
    DBG.truth = 1; const w = await ask('INSPECTOR 3: "THEN LET HIM SAY IT. WHAT ARE YOU?"', I3, ['A NORMAL HUMAN FROM NEVADA', 'THE ADDRESSEE']); DBG.truth = undefined;
    if (w === 1) break;
    await say2([['CARL', 'I\'m a normal human from Nevada.'], [I3, 'Then the tape is a lie. And the rock is a lie. And the board is a lie. And a liar\'s mail is anybody\'s.'], [I9, 'Carl. That is the answer he came here for. Give him a different one.']]);
  }
  await say2([['CARL', 'I\'m the addressee.'], ['CARL', 'Whatever else I am. It\'s got my name on it. You can\'t read my name. Nobody can. That\'s how you know it\'s mine.'], [U0, 'CARL'], [I9, 'There. An addressee. Present. The address exists. 9.4 holds. The parcel is mail, and mail may not be opened by anyone but him.'], [I3, '...You will lose your number for this, Nine.']]);
  await say('INSPECTOR 9 TAKES OFF HIS BADGE. HE TAKES A RUBBER STAMP FROM HIS POCKET, BREATHES ON IT TWICE, THE OLD WAY, AND STAMPS A FORM: "WITHDRAWN FROM INSPECTION. INSPECTOR 9." HE SIGNS IT. IT TAKES A WHILE.');
  await say2([[I9, 'I have had a number for nineteen years. I would like to try a name.'], ['CARL', 'What is it?'], [I9, 'I do not know yet. I will look for it. I hear that is how it works.'], [I9, 'Go. The chute. I will stay here and file a report. It will be the slowest report in the history of the Service. It will take me nineteen years.']]);
  sfx('stamp'); setF3('readDone'); setF3('i9redeemed'); setF3('chuteOpen'); setF3('done5'); C3.route[5] = 1;
  for (const id of ['i3', 'ag1', 'ag2']) { const e = ent3(id); if (e) e.gone = 1; }
  addNote('INSPECTOR 9: "I have had a number for nineteen years. I would like to try a name." Withdrawn from inspection.');
  setObj3('Up the stairs, then into the Dead Letter chute (west wall)', 'sort_hall', 'chute');
}
// ---- INTERCEPTED: he takes the deal ----
async function intercepted() {
  setF3('ending'); C3.ending = 'intercepted';
  await say2([['CARL', '...Okay.'], [U0, 'carl no'], ['CARL', 'It\'s just a box. It\'s a box that made everybody wait. I\'m tired of being a thing people wait for.']]);
  await say('CARL PUTS THE PARCEL ON THE DESK. INSPECTOR 3 OPENS IT WITH A LETTER OPENER SHAPED LIKE A LETTER OPENER.');
  await say('HE READS. HIS LIPS MOVE. HE TURNS THE PAGE OVER. THERE IS NOTHING ON THE BACK.');
  await say2([[I3, 'There is no address.'], [I9, 'There never was. The address was him.'], [I3, '"If you are reading this, you left. Good." ...This is not addressed to me.'], [I9, 'No. It was not.']]);
  await say2([[I3, 'Into evidence.'], ['CARL', 'Can I— can I hear the rest?'], [I3, 'It is evidence now. Evidence is not read aloud to the public.']]);
  await say('THE BOARD COMES DOWN, AS PROMISED. EVERY STORY. CARL WALKS OUT OF THE SORTING CENTER A NORMAL MAN. IT FEELS EXACTLY LIKE HE THOUGHT IT WOULD. THAT IS THE PROBLEM.');
  await say2([[DI, 'Carl? The tracker says... it doesn\'t say anything. It just stopped.'], ['CARL', 'Yeah.']]);
  await credits3('intercepted');
}

// ================= THE DEAD LETTER OFFICE: the stacks =================
const NOTICE_SPOTS = [[-12, 14], [-4, 14], [4, 14], [12, 14], [-12, 9.5], [12, 9.5], [-8, 10.5], [8, 10.5], [-11, 3.5], [11, 3.5], [-15, 14.6], [15, 14.6]];
const OWN3 = { roller: 'I don\'t roll high. I won five bucks on the kids\' machine.', believer: 'I\'m not a believer. I\'m... the thing. The thing they believe in. That\'s worse.', researcher: 'I don\'t research. I fixed a spoon so it hears nothing.', local: 'I\'m not local. I\'m not from anywhere they\'d let me be local.', guest: 'I wasn\'t a guest. I was a courier with a cold.', instructor: 'I can\'t ski. I fell down a mountain with an argument attached.', boiler: 'I\'m not the boiler man. The boiler man died. I\'m sorry.', date: 'There was no date in the ship. There\'s never anybody in the ship.', critic: 'I\'m not a critic. I liked the movie. I liked it a lot.', repair: 'I don\'t repair projectors. I threaded one, once, for the right reel.' };
const notices = () => C3.alibis.filter(a => !a.retracted && !a.kept);
function noticeEnts() {
  if (!F3('c0met') || F3('ending')) return [];
  return notices().map((a, i) => { const s = NOTICE_SPOTS[i % NOTICE_SPOTS.length]; return { id: 'notice' + C3.alibis.indexOf(a), kind: 'npc', model: MODEL.parcel, at: [s[0], 0, s[1]], label: 'NOTICE', range: 1.6, s: .8, talk: () => takeBack(a) }; });
}
SCENES.dlo.walk.push([-14, 10, 14, 14.4]);   // v1 never joined the front floor to the cross aisle; the stacks need it
SCENES.dlo.ents = (base => () => base().concat(noticeEnts()))(SCENES.dlo.ents);
function nextNoticeObj() {
  const n = notices(); if (!n.length) return setObj3('Back to Clerk 0 at the desk', 'dlo', 'clerk0');
  setObj3('Take back every notice in the stacks (' + n.length + ' left)', 'dlo', 'notice' + C3.alibis.indexOf(n[0]));
}
async function takeBack(a) {
  const c = CLAIMS[a.id], own = Object.assign({}, OWN3);
  await say('A NOTICE, SHELVED UNDER "UNDELIVERABLE." FROM ' + STOPTAB[a.stop].name + ': "' + c.short + '."' + (a.task ? ' FORWARDING TASK: ' + a.task + '.' : ''));
  const alien = a.id === 'alien';
  for (;;) {
    DBG.truth = alien ? 1 : 0; const i = await ask('IS THAT YOUR ADDRESS?', null, alien ? ['TAKE IT BACK', 'KEEP IT. IT\'S TRUE.'] : ['TAKE IT BACK', 'KEEP IT']); DBG.truth = undefined;
    if (alien && i === 1) { a.kept = 1; await say2([['CARL', '...That one\'s true. I\'m keeping that one.'], [U0, 'carl']]); await say('THE NOTICE DOESN\'T GO BACK ON THE SHELF. IT GOES IN HIS POCKET, NEXT TO THE ROUTE CARD.'); break; }
    if (i === 0) { a.retracted = 1; C3.suspicion = Math.max(0, C3.suspicion - 1); sfx('ok'); await say(own[a.id] || retractLine(a.id), 'CARL'); await say('THE NOTICE FOLDS ITSELF AND GOES BACK TO ' + STOPTAB[a.stop].name + '. ONE ADDRESS FEWER.'); break; }
    await say('IT STAYS ON THE SHELF. AN ADDRESS IS AN ADDRESS. HE CAN\'T BE DELIVERED TO TWO.');
  }
  const e = ent3('notice' + C3.alibis.indexOf(a)); if (e) e.gone = 1;
  nextNoticeObj();
}
function retractLine(id) { return ({ maintenance: 'I\'m not maintenance. I wanted in. I fixed it because it was broken and nobody else was going to.', resident: 'I don\'t live there. I don\'t live anywhere. I live in a ship, in a lot.', inspector: 'I don\'t inspect things. I deliver them.', trucker: 'I\'m not a trucker. I\'m a courier. It\'s close.', relative: '...I don\'t know if I\'m their family. I\'m hoping.', investor: 'I don\'t have any money. I have a few bux and a lot of feelings.', shopper: 'I wasn\'t shopping. I was looking for them.', sorter: 'I can\'t sort. I sorted one box and it was a different box.', alien: 'I said it on a tape for a stamp. I\'m taking it back. Not because it\'s not true. Because it wasn\'t his.' })[id] || 'I\'m not that.'; }
async function clerk0() {
  if (F3('ending')) return;
  if (!F3('c0met')) {
    await say2([[CL0, 'Addressee unknown. Item unclaimed. Sender unknown.'], [CL0, 'Welcome. Nobody has come in through the chute in twenty-nine years. We have a chair for it. It is a good chair.'], ['CARL', 'I\'m here to deliver this.'], [CL0, 'You are not here to deliver it. You are here to be delivered to. The parcel has been waiting for you to arrive so it can arrive.']]);
    await say('THE CLERK PLACES THE PARCEL ON A SCALE. THE SCALE ISN\'T A SCALE. IT TAKES THE PARCEL\'S FULL ADDRESS AND READS IT BACK:');
    await say('"CARL, [[[[[, ABOVE AND BELOW NEVADA." STATUS: DELIVERABLE. THIS HAS NEVER HAPPENED BEFORE.');
    await say2([[CL0, 'An address that exists only when the addressee does. We do not get many. You are the third. The other two were not mail.'], ['CARL', 'Who were the other two?'], [CL0, 'That is not on the form.']]);
    if (F3('confessed') && !C3.alibis.some(a => a.id === 'alien')) C3.alibis.push({ id: 'alien', stop: 7, task: 'SAID IT ON TAPE', done: 1, retracted: 0, t: C3.time });
    setF3('c0met');
    if (notices().length) {
      await say2([[CL0, 'Before I can release it: I have received notices from the offices along the route. You told people things.'], [CL0, 'Each one is a forwarding address. They are shelved in the stacks, under undeliverable. I cannot deliver to ' + (notices().length + 1) + ' addresses. I can deliver to one.'], ['CARL', 'So I go get them.'], [CL0, 'You go and take them back. By hand. Mail is done by hand.']]);
      for (const d of noticeEnts()) addEnt3(d);
      return nextNoticeObj();
    }
    await say2([[CL0, 'No notices. You were honest at every stop.'], ['CARL', 'Not every stop. Most. A couple of them I just got lucky.'], [CL0, 'That is also a kind of honesty.']]);
  }
  if (notices().length) return say(notices().length + ' notices are still on the shelves. I can wait. I am very good at it.', CL0);
  if (!F3('c0back')) { setF3('c0back'); if (C3.alibis.length) await say2([[CL0, 'One address.'], ['CARL', 'It feels lighter.'], [CL0, 'It is lighter. Mail does that.']]); if (C3.alibis.some(a => a.kept)) await say2([[CL0, 'You kept one.'], ['CARL', 'It\'s the true one.'], [CL0, 'Then it is not a forwarding address. It is the address. That is permitted.']]); }
  await say2([[CL0, 'Name.'], ['CARL', 'Carl.'], [CL0, 'That is what they call you.'], ['CARL', 'It\'s what I answer to. My name is...']]);
  await say('HE SAYS IT. THE PLAYER HEARS A NOISE LIKE A DOOR OPENING AND SEES ONLY: [[[[[');
  await say2([[CL0, 'Address.'], ['CARL', 'Above and below Nevada.'], [CL0, 'That is both halves.'], ['CARL', '...Yeah. It\'s both halves.']]);
  sfx('stamp'); await wait(20); sfx('stamp'); post.flash = .5; await wait(6); post.flash = 0;
  await say('THE CLERK STAMPS THE PARCEL "VALID." THE STAMP IS NOT A STAMP. IT SOUNDS LIKE A DOOR OPENING IN A LONG HALL.');
  addNote('STAMP 11: THE DEAD LETTER OFFICE. VALID. (First time in its history.)'); C3.route[6] = 1; setF3('done6');
  if (F3('i9redeemed')) await say2([[CL0, 'A form arrived ahead of you, by the chute. "Withdrawn from inspection." Signed by a man with no number.'], ['CARL', 'He\'s looking for a name.'], [CL0, 'Then he is in the right building. Eventually.']]);
  const EO = ['SIGN FOR IT', 'RETURN TO SENDER', 'FORWARD IT', 'REFUSE DELIVERY'].concat(cratesFound() >= 31 ? ['SIGN, AND WRITE BACK'] : []);
  const c = await ask('WHAT DOES HE DO WITH IT?', CL0, EO);
  const E = ['signed', 'returned', 'forwarded', 'refused', 'replied'][c]; setF3('ending'); C3.ending = E;
  await ENDINGS3[E]();
  await credits3(E);
}
// ---- REPLIED: all thirty-one crates, and he writes back ----
ENDINGS3.replied = async () => {
  await ENDINGS3.signed();
  await say2([['CARL', 'Can I write back?'], [CL0, 'You may. Address?'], ['CARL', 'Still in transit.'], [CL0, 'That is a valid address. It is the only one they have.']]);
  await say('HE WRITES ON THE BACK OF THE LEDGER CARD. IT TAKES A LONG TIME. HE CROSSES THINGS OUT. CHAT DOESN\'T SAY ANYTHING. CHAT HAS NEVER NOT SAID ANYTHING.');
  const P = { fg: hex('#d8f0ff') };
  await showCard(['TO THE TALL ONES,', 'STILL IN TRANSIT.', '', 'I GOT IT.', 'I ATE.'], 0, P);
  await showCard(['I FOUND ALL THIRTY-ONE.', 'THEY WERE EMPTY.', '', 'THAT\'S OKAY.', 'I KNOW WHAT WAS IN THEM.'], 0, P);
  await showCard(['EVERYBODY YOU LEFT A CARD WITH', 'IS FINE. MAVIS GOT A CAT.', 'BEV IS OFF CLUB SANDWICHES.', 'THE MAN AT THE LODGE PRACTICED', 'UNTIL HE COULDN\'T. HE DID IT RIGHT.'], 0, P);
  await showCard(['I\'M NOT ASKING YOU TO COME BACK.', 'I\'M ASKING YOU TO GET THIS.', '', 'THAT\'S ALL.', 'THAT\'S EVERYTHING.', '', '- [[[[['], 0, P);
  await say2([[CL0, 'It will go out the way it came. Every stop. Backwards.']]);
  const BACK = [['OPAL', 'Rhyolite. Outbound. Well. Look at that. Mail LEAVING this town.'], ['ARLO', 'Shadow Valley. I\'ll run it past the screen once. For luck. It\'s not a movie. It\'s better.'], ['JUNE', 'Lake Tahoma. In Walt\'s hand. He\'d want to. He practiced the other way, too. I heard him.'], ['DUKE', 'Silver Spur. House stamp. The house is rooting for you, kid. Don\'t tell the house.'], [BV, 'Little Green Inn. Red ink. I\'m breathing on it twice.'], ['DENNIS', 'Mall Station. Outbound. I\'m both clerks again. It feels good to have something for both of me.'], ['RADIO RAY', 'Logbook, mile 214. Carry it to the next stop. Don\'t look inside. We know the drill. We\'re proud of the drill.'], ['DOLORES', 'The Starlite. I\'ll put it on the bed in Room 6 for one night. Then it goes.'], ['POSTMASTER HANK', 'Box Canyon. Outbound.'], ['POSTMASTER HANK', '...Huh. Nineteen years. First one I ever sent THAT way.']];
  for (const [who, t] of BACK) { sfx('stamp'); await say(t, who); }
  await say('THE REPLY LEAVES BOX CANYON AT DAWN, IN A TRUCK THAT DOESN\'T KNOW WHAT IT\'S CARRYING. THE ROUTE CARD SAYS: "IN TRANSIT." FOR ONCE, THAT IS GOOD NEWS.');
  addNote('THE REPLY: "I got it. I ate." Stamped outbound at every stop. Status: IN TRANSIT.');
};
// ---- saves keep the objective (v1 restored the scene but left the marker blank) ----
const _saveC3F = saveC3;
saveC3 = function () { if (C3) C3.obj = OBJ3 ? { text: OBJ3.text, scene: OBJ3.scene, id: OBJ3.id, dest: OBJ3.dest } : null; _saveC3F(); };
const _continueF = continueGame3;
continueGame3 = async function (sv) { await _continueF(sv); ensure3(); if (C3.obj) { setObj3(C3.obj.text, C3.obj.scene, C3.obj.id); if (C3.obj.dest !== undefined) OBJ3.dest = C3.obj.dest; } else if (C3.scene === 'ship') setRouteObj(); };
