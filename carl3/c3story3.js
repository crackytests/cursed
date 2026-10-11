'use strict';
// ================= CARL 3: stops 3 and 4 (the truck stop, the dead mall) =================
const OF = 'OLD FACE', RR = 'RADIO RAY', LE = 'LEON';
PORT['OLD FACE'] = CAST.port['OLD FACE'] || PORT.FACE; VOICE['OLD FACE'] = [380, 30];
// ---------------- STOP 3: BIG LEON'S ----------------
DRIVELINES[3] = [[80, 'JB GARFIELD', 'Truck stop. Biggest lot in the county. Smallest budget for lights.'], [420, 'DISPATCH', 'The lounge is drivers only. Old Face is on a TV in the lounge. He\'s been on that TV for twenty years. Nobody changes the channel.'], [780, 'CARL', 'Why not.'], [840, 'DISPATCH', 'It\'s respect. It\'s the only kind of respect a truck stop has.']];
ARRIVE[3] = async () => {
  addParcel({ id: 'pine', desc: 'A BOX OF 400 PINE AIR FRESHENERS', toName: 'SLIM (TRUCK 3)', from: 'WAREHOUSE', model: 'parcel' });
  await say2([['CARL', 'It\'s a parking lot. It\'s a parking lot for forty trucks and there are three.'], [U0, 'carl so much lot'], ['CARL', 'I could do so much here. I could turn the ship all the way around. I could do a lap.'], [DI, 'Don\'t.'], ['CARL', 'I\'m not. I\'m saying I could.'], [DI, 'There\'s a box of pine air fresheners for one of the truckers. Truck 3. Slim. Be nice. He smells it.']]);
  setObj3('Go inside the diner', 'plaza_lot', 'diner_door');
};
SCENES.plaza_lot.ents = () => [
  shipDoor('ass3', -37, 4.4, 1.5),
  { id: 'diner_door', kind: 'prop3', to: 'plaza_diner', at: [0, 0, 31.0], label: 'DINER', range: 2.4, talk: async () => { await goScene('plaza_diner', 0, 1.8, 0); if (!F3('leonMet')) setObj3('Talk to Big Leon at the counter', 'plaza_diner', 'leon'); }, draw3: () => {} },
  npc3('slim', 'trucker', 14.5, 21.4, 'SLIM', () => slimTalk(), { yaw: Math.PI }),
  { id: 'pumpC', kind: 'prop3', at: [-16, 0, 11.8], label: 'GAS PUMP', range: 2.0, talk: () => pumpTalk(), draw3: () => {}, promptY: .8 },
];
SCENES.plaza_lot.shipExit = [-36, 4.4, 1.5];
async function pumpTalk() {
  if (F3('pumpDone')) return say('THE PUMP WORKS FINE. IT SMELLS LIKE A PINE TREE. IT IS NOT CLEAR WHO DID THAT.');
  await say('A GAS PUMP. IT HAS A SIGN: "PAY INSIDE." THE SIGN HAS A SECOND SIGN: "SERIOUSLY. PAY INSIDE."');
  if (!F3('pumpTried')) { setF3('pumpTried'); await say2([['CARL', 'It\'s a pump. The ship doesn\'t use gas. The ship uses... I don\'t know what the ship uses.'], [U0, 'what does the pump do if you press the button'], ['CARL', 'It says pay inside.'], [U0, 'press the button'], ['CARL', 'No.']]); return; }
  await say2([['CARL', '...Fine. I\'m pressing it.'], ['CARL', 'It\'s dispensing. It\'s dispensing a lot. It\'s dispensing onto the ground. Chat, it\'s onto the ground, there\'s a river.'], [U0, 'carl'], ['CARL', 'I didn\'t do it. The button did it.']]);
  setF3('pumpDone'); C3.suspicion++; WX.shake = 10; sfx('hurt'); tickC('the pump has a pulse');
  await say2([[LE, 'Hey! HEY! What\'s going on out there? Is that— is that diesel?!'], ['CARL', 'It\'s pine. It\'s pine diesel.']]);
}
async function slimTalk() {
  const p = parcel('pine');
  if (!p || p.status !== 'carry') return say(pick(['Nothing like a clean cab. I have eleven of them.', 'You\'re the courier. I can smell it. That\'s the pine.']), 'SLIM');
  p.status = 'delivered'; C3.deliveries++; C3.bux += 12; sfx('get');
  await say2([['CARL', 'Slim? Delivery. Pine air fresheners. Four hundred.'], ['SLIM', 'Well I\'ll be. I ordered four hundred. I figured they\'d send twenty.'], ['CARL', 'It\'s a lot of fresheners.'], ['SLIM', 'It\'s a lot of cab. Here, kid. And let me tell you something about the lounge. They\'ll ask for a handle. Don\'t say your name. Nobody\'s ever said their name on a CB.'], ['CARL', 'What do I say?'], ['SLIM', 'Say what you are. Whatever you are. That\'s a handle.']]);
  setF3('slimTip');
}
SCENES.plaza_diner.ents = () => [
  { id: 'diner_out', kind: 'prop3', to: 'plaza_lot', at: [0, 0, .8], label: 'OUTSIDE', range: 1.6, talk: () => goScene('plaza_lot', 0, 31.6, Math.PI), draw3: () => {} },
  npc3('leon', 'trucker', 5, 12.1, 'BIG LEON', () => leonTalk(), { yaw: Math.PI, s: 1.1, range: 4.5 }),   // behind the counter: talk across it
  npc3('ray', 'mechanic', -6.4, 6.6, 'RADIO RAY', () => rayTalk(), { yaw: -1.6 }),
  { id: 'lounge_door', kind: 'prop3', to: 'plaza_lounge', at: [-10.4, 0, 7.8], label: 'LOUNGE', range: 1.8, cond: () => F3('loungeOpen'), talk: async () => { await goScene('plaza_lounge', 0, 1.4, 0); if (!F3('faceDone')) setObj3('Put the tape in VCR 3', 'plaza_lounge', 'vcr3'); }, draw3: () => {} },
  npc3('waitress3', 'waitress', -1.6, 5.4, 'DOT', () => say(pick(['Coffee? It\'s free. It\'s also not coffee. Take it anyway.', 'Pie\'s cherry. Pie\'s always cherry. Cherry\'s the only kind we trust.']), 'DOT'), { yaw: 0 }),
];
async function leonTalk() {
  if (!F3('leonMet')) { setF3('leonMet'); await say2([[LE, 'Welcome to Big Leon\'s. I\'m Big Leon. The "Big" is for the lot.'], ['CARL', 'It\'s a big lot.'], [LE, 'It\'s forty acres. Nobody parks. Truckers want to be near the door, they park near the door. Forty acres of nobody.'], [LE, 'The lounge is drivers only. Ray decides who\'s a driver.']]); setObj3('Talk to Radio Ray at the lounge arch', 'plaza_diner', 'ray'); return; }
  if (F3('done3')) return say(pick(['Come back anytime. The coffee is still not coffee.', 'Mind the lot.']), LE);
  await say(pick(['You want pie? You want pie. Dot! Pie!', 'Ray\'s at the arch. Talk to Ray.']), LE);
}
async function rayTalk() {
  if (F3('faceDone') && !F3('done3')) return rayLog();
  if (F3('loungeOpen')) return say(pick(['Go on in. TV 3\'s the one you want.', 'Handle\'s good. Go on.']), RR);
  if (F3('rayTask') === 'vcr') return say('VCR 3 is in the lounge. It eats tapes. If you\'re maintenance, fix it. It\'s the one with the red light.', RR);
  await say('Drivers only, friend. This is the lounge. You need a handle and a reason.', RR);
  for (;;) {
    const c = await claimMenu(RR, 'So. Who are you on the road?', ['trucker', 'maintenance', 'courier'], { stop: 3 });
    if (c === 'trucker') {
      await say2([['CARL', 'I\'m a trucker. I drive. A truck. Trucks.'], [RR, 'Handle?']]);
      DBG.truth = 0; const h = await ask('PICK A HANDLE', null, ['GREEN BEAN', 'SMOOTH OPERATOR', 'NORMAL GUY']); DBG.truth = undefined;
      C3.handle = ['GREEN BEAN', 'SMOOTH OPERATOR', 'NORMAL GUY'][h];
      await say(h === 2 ? 'Normal Guy. Every guy on the road is a Normal Guy. That\'s how you know you\'re not.' : h === 0 ? 'Green Bean. That\'s a handle. That\'s one I\'ll believe.' : 'Smooth Operator. We have four of those. The other three don\'t go by it anymore.', RR);
      DBG.truth = 0; const q1 = await ask('"WHAT\'S A KOJAK WITH A KODAK?"', RR, ['A COP WITH A RADAR GUN', 'A PHOTOGRAPHER', 'A LOW-FLYING SANDWICH']); DBG.truth = undefined;
      if (q1 !== 0) { await say('Not even close. Try again, friend.', RR); continue; }
      DBG.truth = 1; const q2 = await ask('"WHERE\'S THE NEXT WEIGH STATION?"', RR, ['THE ONE I DON\'T GO TO', 'MILE 214', 'I\'M NOT A TRUCKER']); DBG.truth = undefined;
      if (q2 !== 1) { await say(q2 === 2 ? 'Honest, at least. Honesty doesn\'t get you in the lounge. Try again.' : 'That\'s what everybody says. Wrong, though. Try again.', RR); continue; }
      await say2([[RR, 'Mile 214. Good. You\'re a driver. In you go.'], ['CARL', 'I told you. I\'m a normal trucker.'], [RR, 'You\'re a trucker. I don\'t know about the rest.']]); finishAlibi('trucker', 'ANSWERED THE CB QUIZ'); setF3('loungeOpen'); setObj3('Go through the arch to the lounge', 'plaza_diner', 'lounge_door'); return;
    }
    if (c === 'maintenance') { await say2([['CARL', 'I\'m maintenance. I maintain. Things in lounges.'], [RR, 'Thank God. VCR 3 has been eating tapes since March. If you\'re maintenance, fix it. It\'s the one with the red light.']]); setF3('rayTask', 'vcr'); setF3('loungeOpen'); const a = alibiOf('maintenance'); if (a) a.task = 'FIX VCR 3'; setObj3('Go through the arch to the lounge', 'plaza_diner', 'lounge_door'); return; }
    await say2([['CARL', 'I\'m a delivery driver. I have a delivery for Old Face.'], [RR, 'Old Face.'], ['CARL', 'On TV 3.'], [RR, '...The green fella. Twenty years nobody\'s touched that channel. Nobody\'s ever delivered to him.'], [RR, 'Drivers always get in the lounge. Delivery\'s delivery. We\'re a union town. Go on.']]);
    await say('IT WORKED. HE JUST SAID WHAT WAS TRUE. HE CHECKS HIS POCKETS FOR A LIE HE DIDN\'T USE.'); setF3('truthWorked'); setF3('loungeOpen'); setObj3('Go through the arch to the lounge', 'plaza_diner', 'lounge_door'); return;
  }
}
SCENES.plaza_lounge.ents = () => [
  { id: 'lounge_out', kind: 'prop3', to: 'plaza_diner', at: [0, 0, .7], label: 'DINER', range: 1.6, talk: () => goScene('plaza_diner', -9.0, 7.4, Math.PI / 2), draw3: () => {} },
  { id: 'vcr3', kind: 'prop3', at: [1.5, 0, 4.4], label: 'VCR 3', range: 2.2, talk: () => vcr3(), draw3: () => {}, promptY: .7 },
  { id: 'tv3', kind: 'prop3', at: [4.6, 0, 3.5], label: 'TV 3', range: 2.4, talk: () => vcr3(true), draw3: () => {}, promptY: 1.2 },
  npc3('slim2', 'trucker', 0, 3.3, 'SLIM', () => say('...zzz... (SLIM IS ASLEEP. HE SMELLS LIKE PINE.)', null), { yaw: 3, noShadow: 0, s: 1 }),
];
SCENES.plaza_lounge.drawOver = () => { if (F3('faceOn')) { const sp = project(LIVE.cam, [4.6, 2.1, 9.32]); if (sp) { const P = PORT['OLD FACE']; rectF(sp[0] - 26, sp[1] - 26, 52, 52, BLACK); draw(P.s, sp[0] - 24, sp[1] - 24, P.P); } } };
async function vcr3(isTv) {
  if (F3('done3')) return say('TV 3 SHOWS A GREEN FACE, ASLEEP, OR PLAYING A VERY LONG TAPE. IT BLINKS EVERY NINE SECONDS.');
  const p = parcel('tape');
  if (!p || p.status !== 'carry') return say('VCR 3. A RED LIGHT. A SLOT. A TAPE-SHAPED SILENCE.');
  if (alibiOf('maintenance') && F3('rayTask') === 'vcr' && !F3('vcrFixed')) {
    await say('VCR 3: THE TRANSPORT IS JAMMED WITH ANOTHER DRIVER\'S TAPE. ITS LABEL: "TRUCKER\'S GUIDE TO LUMBAGO, PART 4."');
    const ok = await wires('VCR 3 TRANSPORT', 4); if (!ok) return say('THE VCR BITES. IT DOESN\'T BITE HARD. IT BITES CONFIDENTLY.');
    setF3('vcrFixed'); finishAlibi('maintenance', 'FIXED VCR 3'); sfx('get'); C3.bux += 8; await say('IT SPITS OUT PART 4 AND SOUNDS RELIEVED.');
  }
  await say2([['CARL', 'It\'s the tape. From the new one to the old one. I put it in. I don\'t watch it. That\'s how I stay out of it.'], [U0, 'carl hit play']]);
  const ok = await tune('VCR 3 TRACKING'); if (!ok) return say('THE PICTURE ROLLS. IT STAYS ROLLED. TRY AGAIN. TRACKING IS THE WHOLE JOB.');
  p.status = 'delivered'; C3.deliveries++; setF3('faceOn'); sfx('power'); await wait(30);
  await say2([[OF, '...That\'s a tape.'], [OF, 'I haven\'t gotten a tape in a long time. People send me emails. Nobody sends me a tape.'], ['CARL', 'It\'s from the new one. The other you. He says it\'s "in case."'], [OF, 'I know who it\'s from. He sends me one a year. I\'ve never played them. I was saving them for when I had something to say back.']]);
  await say2([[OF, 'In case of what. He never says.'], ['CARL', 'You got me out. Of the facility. Before. I just want to ask one thing, and it\'s not a big thing, and I know you\'re a TV.'], [OF, 'Your parents.'], ['CARL', 'How do you do that.'], [OF, 'I\'ve been thinking about that question for a long time, Carl. Longer than I\'d like.']]);
  await say2([[OF, 'After you were out, I found a note in the control room\'s mail slot. No sender. Four words. "HE\'LL NEED A RIDE."'], [OF, 'I thought it was a joke. It was addressed to me. I should have asked who mails a note to a mail slot.'], ['CARL', 'So you got me out because of a note?'], [OF, 'I got you out because you were small and the door was open. The note is why I was standing near the door.']]);
  await say2([['CARL', 'So you didn\'t... you weren\'t...'], [OF, 'I am not your family, Carl. I\'d like to say yes. I\'d be lying, and you\'re keeping a list of people who lie to you.'], ['CARL', 'It\'s a ledger. It\'s a different thing.'], [OF, 'Whoever they are, they thought of everything except asking you.']]);
  addNote('OLD FACE: a note in the control-room mail slot: "HE\'LL NEED A RIDE." Unsigned.');
  await say2([[OF, 'There\'s a sorting center east of the mall, under the highway. They have a dock clerk, Margo. If she asks for a password, say: "Return, but not to sender." It\'s the dead-letter code. I learned it by accident. Don\'t ask me how.'], ['CARL', 'It\'s stupid.'], [OF, 'It\'s the most sensible phrase in the postal service.']]);
  setF3('faceCode'); addNote('PASSWORD (Sorting Center dock): "Return, but not to sender."');
  await say2([[OF, 'Leave the tape in. I\'ll watch it. After you go.'], ['CARL', 'You want me to stay?'], [OF, 'Yes. And no. Both.']]);
  await say('ON THE SCREEN, A SECOND GREEN FACE APPEARS. NEW FACE, IN COLOR, SITTING VERY STILL: "IN CASE YOU WERE EVER WONDERING WHETHER YOU WERE BACKED UP. YOU WERE. -N."');
  await say2([[OF, '...He\'s backed me up. I\'m the oldest copy of me, and he\'s kept me.'], ['CARL', 'That sounds nice.'], [OF, 'It\'s a lot of weight. Tell him it\'s a lot of weight. Tell him it\'s fine.']]);
  setF3('faceDone'); setObj3('Tell Radio Ray you\'re done in the lounge', 'plaza_diner', 'ray');
}
async function rayLog() {
  await say2([[RR, 'Hey. You came out of there quiet. That TV hasn\'t had a visitor in twenty years. It looks happier.'], ['CARL', 'I don\'t have an opinion about whether a TV looks happy.'], [RR, 'Fair. Come here. I have something for you.']]);
  await say2([[RR, 'There\'s a logbook. The CB logbook. Every trucker on this route has been keeping it for thirty years. There\'s a line in it, over and over. Same handwriting every time.'], [RR, '"BOX FOR THE SHORT ONE. CARRY IT TO THE NEXT STOP. DON\'T LOOK INSIDE." Signed: T.C.'], ['CARL', 'T.C.'], [RR, 'The tall couple. They never gave their names. They asked every driver to carry the box as far as the next stop and not look inside. Nobody ever did.'], ['CARL', 'Why not.'], [RR, 'Because the tall woman asked nicely. You don\'t say no to a person who asks that nicely.']]);
  await say('RAY TURNS THE LOGBOOK AROUND AND HOLDS OUT A PEN.');
  const s = await ask('SIGN THE LOGBOOK?', null, ['SIGN', 'NOT YET']); if (s !== 0) return;
  await signature('CB LOGBOOK, MILE 214');
  addNote('CB LOGBOOK: "BOX FOR THE SHORT ONE. CARRY IT TO THE NEXT STOP. DON\'T LOOK INSIDE." (T.C., 30 years)'); addNote('STAMP 3: BIG LEON\'S. After this the string splits five ways.'); C3.route[3] = 1;
  setF3('done3'); setF3('pendingCall3'); setObj3('Back to the ship', 'plaza_lot', 'ass3');
}
SHIPCALL[3] = async () => {
  await say2([[DI, 'Third stamp. The tracker says the parcel is no longer "no such address." It\'s "address pending."'], ['CARL', 'It was a TV and a logbook.'], [GA, 'Kid, you told the truth to a man and it worked. Write that down.'], ['CARL', 'It worked once. It could have been a fluke.'], [GA, 'That\'s the first time you used it as a plan. That counts.']]);
  await say('THE RADIO CRACKLES WITH A DIFFERENT KIND OF STATIC: A VOICE FROM A VERY LONG WAY AWAY, GLOWING PINK.');
  setF3('ghostOn');
  await say2([[GH3, 'Carl. Bro. It\'s me. I\'m in the radio. I\'m in a lot of radios. This one picked up.'], ['CARL', 'Spooky? You\'re in my radio?'], [GH3, 'Don\'t make it weird. I\'m— okay, I ordered something. While alive. In 1989. It never arrived. Dispatch says it\'s in the dead-letter pile and it\'s coming through your ceiling.']]);
  await say('THE CEILING OPENS A LITTLE. A SMALL BROWN BOX DROPS OUT. ON THE LABEL, IN LOOPY HANDWRITING: "TO: LINDA. UNIT 14, DESERT PALMS MALL. HAND DELIVER. DO NOT BEND. SURPRISE."');
  addParcel({ id: 'key', desc: 'A SMALL BOX: "SURPRISE."', toName: 'LINDA (UNIT 14)', from: 'SPOOKY GHOST', model: 'her' });
  await say2([['CARL', 'It says surprise.'], [GH3, 'It\'s a surprise.'], ['CARL', 'It\'s been thirty-five years.'], [GH3, 'It\'s a SLOW surprise.'], ['CARL', 'What is it?'], [GH3, 'I\'m not saying. It was a plan. I had a plan, bro. A real one. With a... never mind.'], ['CARL', 'You can do it after?'], [GH3, 'No. This one you do. For me.']]);
  await say2([[DI, 'And Carl. The tracker\'s been reading something else. There\'s another tracker on the parcel now. It isn\'t ours.'], ['CARL', 'Whose is it?'], [DI, 'It says POSTAL INSPECTION SERVICE, REGIONAL.'], [GA, 'Kid, that\'s a White Suit with a uniform. That\'s what they became when they ran out of containment. They went into the mail.'], ['CARL', 'Of course they did.']]);
  setF3('tracker');
  await say2([[GA, 'They stopped chasing the box, kid. They\'re chasing the driver. Every story you tell at a counter is a light on their map. Keep the stories straight, or keep them few.'], [DI, 'And the route card changed. After Big Leon\'s the string splits. Five clerks, five directions. Any order.'], ['CARL', 'Any order is not a route. Any order is a mess.'], [DI, 'It\'s a fork, Carl. Pick a tine.']]);
  setRouteObj();
};
RADIOTALK['SPOOKY GHOST'][3] = async () => { await say2([[GH3, 'Don\'t tell her it\'s from me. Tell her it\'s from a guy.'], ['CARL', 'She\'s going to know.'], [GH3, 'She always knows.']]); };
// ---------------- STOP 4: DESERT PALMS MALL ----------------
DRIVELINES[4] = [[80, 'DISPATCH', 'Desert Palms closed in 1998. The mall, not the desert. The desert is still open.'], [420, 'SPOOKY GHOST', 'Bro. I know that parking lot. I don\'t know the mall. I know the *lot*. I used to sit in it.'], [760, 'JB GARFIELD', 'Everybody sits in a lot, once. It\'s where you decide to go in.']];
ARRIVE[4] = async () => {
  await say2([['CARL', 'A mall. A dead mall. It\'s like the Mall of the Future but with the future taken out.'], [GH3, 'It\'s the Mall of the Past, bro. They never wrote it on the sign.'], ['CARL', 'It\'s an enormous parking lot. It has four cars in it. Why do they leave four cars.'], [GA, 'Because somebody towed the rest, kid. Four is what nobody could claim.']]);
  setObj3('Get past the guard at the entrance', 'mall_out', 'dennis');
};
SCENES.mall_out.ents = () => [
  shipDoor('ass4', -33, 3.4, 1.5),
  npc3('dennis', 'guard', 5, 36.4, 'DENNIS', () => dennisTalk(), { yaw: Math.PI }),
  { id: 'mall_door', kind: 'prop3', to: 'mall_hall', at: [0, 0, 37.4], label: 'MALL ENTRANCE', range: 2.4, talk: () => mallDoor(), draw3: () => {} },
];
SCENES.mall_out.shipExit = [-32, 3.4, 1.5];
async function mallDoor() { if (!F3('mallOpen')) return say('THE DOORS ARE CHAINED. A SIGN, FADED: "COMING SOON: 1998."'); await goScene('mall_hall', -22, 3, 0); if (!F3('hallSeen')) { setF3('hallSeen'); run(hallSeen); } }
async function hallSeen() { await say2([['CARL', 'It\'s dark. It\'s a dark mall. There\'s a fountain with no water and a staircase that doesn\'t go.'], [GH3, 'Bro. It\'s the *concourse*. It\'s even sadder in person.'], [U0, 'carl the power is out. find the breaker']]); setObj3('Find the breaker panel on the east wall', 'mall_hall', 'breaker'); }
async function dennisTalk() {
  if (F3('mallOpen')) return say(pick(['Go on in. Mind the stairs. They stopped in \'98 and I don\'t think they\'re ever going to start.', 'It\'s a good building. It had a good run.']), 'DENNIS');
  await say2([['DENNIS', 'Mall\'s closed. Has been since \'98. State of Nevada says nobody goes in.'], ['CARL', 'It\'s a mall. It\'s a building for people to go in.'], ['DENNIS', 'It\'s a building for nobody to go in. I\'m the nobody. Who are you?']]);
  for (;;) {
    const c = await claimMenu('DENNIS', 'State your business, friend.', ['maintenance', 'shopper', 'investor', 'courier'], { stop: 4 });
    if (c === 'maintenance') { await say2([['CARL', 'Maintenance. I\'m with the power company. Mall maintenance. Power.'], ['DENNIS', 'The power company! Finally. Breaker\'s on the east wall of the concourse. Flip the main. Don\'t tell anyone I let you in.']]); const a = alibiOf('maintenance'); if (a) a.task = 'RESTORE THE POWER'; setF3('mallOpen'); setObj3('Go into the mall', 'mall_out', 'mall_door'); return; }
    if (c === 'shopper') { await say2([['CARL', 'I\'m shopping. For. A watch.'], ['DENNIS', 'A watch. Nothing here has opened since \'98.'], ['CARL', 'A pretzel, then.'], ['DENNIS', 'The pretzel place was the first to go.']]); await say2([['DENNIS', '...You know what, there IS one store. Unit 14. It never opened, so it never closed. Breaker\'s on the east wall. Go ahead.']]); const a = alibiOf('shopper'); if (a) a.task = 'FIND UNIT 14'; setF3('mallOpen'); setObj3('Go into the mall', 'mall_out', 'mall_door'); return; }
    if (c === 'investor') {
      await say2([['CARL', 'I\'m an investor. I\'m here to reopen it. Mall. A mall reopening.'], ['DENNIS', 'Reopen the Desert Palms?! With what money?'], ['CARL', 'A lot of money. A very normal amount of money.']]);
      let r; do { r = await argue3({ id: 'dennis_inv', name: 'DENNIS', port: 'DENNIS', patience: 9, weak: { RANT: 2 }, atk: ['Show me a ledger.', 'Investors wear a tie. That\'s a bow tie.', 'The last guy was an investor. He was wearing a different bow tie.'], hit: 1, hint: 'talk until he agrees to believe you', win: 'You know what? I want to believe this. Go in. Reopen it. I\'ll be security chief.', open: 'DENNIS WANTS A LEDGER.' }); } while (!r.win);
      finishAlibi('investor', 'ARGUED PAST DENNIS'); setF3('mallOpen'); setObj3('Go into the mall', 'mall_out', 'mall_door'); return;
    }
    await say2([['CARL', 'I have a delivery. For Linda. At Unit 14.'], ['DENNIS', 'Linda. Pink hair?'], ['CARL', 'I haven\'t— she hasn\'t— she might be.'], ['DENNIS', 'She went in an hour ago with a bolt cutter. She didn\'t ask. I didn\'t stop her. It felt right.']]); await say('DENNIS LETS HIM IN, AND LOOKS A LITTLE SURPRISED AT HIMSELF.'); setF3('mallOpen'); setF3('truthWorked'); setObj3('Go into the mall', 'mall_out', 'mall_door'); return;
  }
}
SCENES.mall_hall.variantKey = () => F3('power') ? 'p' : '';
SCENES.mall_hall.variantScene = () => Object.assign({}, SCENES.mall_hall, { amb: [.3, .28, .4], lights: SCENES.mall_hall.lights.concat([{ p: [-14, 5, 10], col: [1, .95, .85], rad: 22, int: .9, glow: .8 }, { p: [14, 5, 10], col: [1, .95, .85], rad: 22, int: .9, glow: .8 }, { p: [0, 5, 4], col: [1, .9, .8], rad: 20, int: .8 }]) });
SCENES.mall_hall.ents = () => [
  { id: 'hall_out', kind: 'prop3', to: 'mall_out', at: [-24, 0, 1.8], label: 'EXIT', range: 1.8, talk: () => goScene('mall_out', 0, 35.6, Math.PI), draw3: () => {} },
  { id: 'breaker', kind: 'prop3', at: [24, 0, 12], label: 'BREAKER', range: 2.2, talk: () => breaker(), draw3: e => { const sp = project(LIVE.cam, [25.3, 1.5, 12]); if (sp) { rectF(sp[0] - 8, sp[1] - 12, 16, 22, hex('#505058')); rectF(sp[0] - 6, sp[1] - 9, 12, 5, F3('power') ? hex('#40ff60') : hex('#ff4040')); } } },
  { id: 'unit14', kind: 'prop3', to: 'mall_unit14', at: [10, 0, 19.4], label: 'UNIT 14', range: 2.4, talk: () => unit14Door(), draw3: () => {} },
  { id: 'booth', kind: 'prop3', at: [20, 0, 6.0], label: 'PHOTO BOOTH', range: 2.2, talk: () => photoBooth(), draw3: () => {}, promptY: .6 },
  { id: 'kiosk', kind: 'prop3', at: [-22, 0, 18], label: 'MALL STATION', range: 2.4, cond: () => F3('keyDone') && !F3('done4'), talk: () => kiosk(), draw3: () => {} },
  npc3('dennis2', 'guard', -20, 17.2, 'DENNIS', () => kiosk(), { yaw: .5, cond: () => F3('keyDone') && !F3('done4') }),
];
async function breaker() {
  if (F3('power')) return say('THE LIGHTS ARE ON. THE MALL HUMS. IT LOOKS WORSE WITH THE LIGHTS ON, IN A GOOD WAY.');
  await say('A BREAKER PANEL, FIVE LEVERS. EACH IS WIRED TO A COLORED PLUG. OLD, DUSTY, STILL LIVE.');
  const ok = await wires('MAIN BREAKER', 5); if (!ok) return say('THE PANEL SNAPS BACK. SOMETHING IN THE WALLS SAYS "NOPE."');
  setF3('power'); finishAlibi('maintenance', 'RESTORED THE POWER'); sfx('power'); C3.bux += 15;
  relight(); await say('THE LIGHTS CHUNK ON ALL ACROSS THE CONCOURSE. THE FOUNTAIN GURGLES ONCE AND GIVES UP. A SPEAKER SOMEWHERE STARTS PLAYING ELEVATOR MUSIC, MID-SONG, AS IF NOTHING HAD HAPPENED.');
  await say2([['CARL', 'It\'s a mall. It\'s a mall again. Chat, I\'m a power company.'], [U0, 'carl the shutters'], ['CARL', 'Unit 14. It\'s the one with the pink sign. It\'s the one with the light.']]);
  setObj3('Take the box to Unit 14', 'mall_hall', 'unit14');
}
async function unit14Door() {
  if (!F3('power')) return say('UNIT 14: A SHUTTER, DOWN. A PINK SIGN BEHIND IT, FAINT. THE SHUTTER IS ELECTRIC. NOTHING IS ELECTRIC.');
  await goScene('mall_unit14', 0, 1.6, 0); if (!F3('lindaMet')) run(lindaScene);
}
async function photoBooth() {
  if (!F3('power')) return say('THE PHOTO BOOTH HAS A CURTAIN. THE CURTAIN HAS OPINIONS.');
  if (F3('stripSeen')) return say('THE STRIP: TWO TALL FIGURES, A CRATE, A SIGN THAT SAYS NOT YET. YOU HAVE LOOKED AT IT. IT DOESN\'T CHANGE.');
  setF3('stripSeen'); sfx('get');
  await say('THE BOOTH\'S OUTPUT SLOT HOLDS ONE STRIP, FOUR FRAMES, LEFT THERE FOR A VERY LONG TIME. IT HASN\'T FADED. THAT IS NOT NORMAL.');
  await say('FRAME 1: TWO TALL PEOPLE. FRAME 2: THEY ARE HOLDING A CRATE BETWEEN THEM. FRAME 3: THE CRATE HAS A SIGN TAPED TO IT: "NOT YET." FRAME 4: THEY ARE LOOKING AT THE CAMERA, NOT SMILING, NOT NOT SMILING.');
  await say2([['CARL', 'That\'s the crate. The crate from the motel. It\'s... it\'s a Carl-brand crate.'], [U0, 'carl'], ['CARL', 'They look... tall.'], [U0, 'carl they look at the camera like they know you will find it'], ['CARL', 'It\'s a photo booth strip. Lots of people take them.']]);
  addNote('PHOTO STRIP (Desert Palms): two tall people, the crate, a sign: NOT YET. They looked at the camera like they knew.');
}
SCENES.mall_unit14.ents = () => [
  { id: 'u14_out', kind: 'prop3', to: 'mall_hall', at: [0, 0, .7], label: 'CONCOURSE', range: 1.6, talk: () => goScene('mall_hall', 10, 18.2, Math.PI), draw3: () => {} },
  npc3('linda', 'linda', 0, 6.2, 'LINDA', () => lindaTalk(), { yaw: Math.PI }),
];
async function lindaScene() {
  setF3('lindaMet'); await wait(30);
  await say2([[LI3, 'I know that walk.'], ['CARL', 'It\'s just my walk.'], [LI3, 'You have a delivery.'], ['CARL', 'How do you know I—'], [LI3, 'You have a box under your arm and a face like a man trying not to look at it.']]);
  setObj3('Give Linda the box', 'mall_unit14', 'linda');
}
async function lindaTalk() {
  const p = parcel('key');
  if (F3('keyDone')) return say(pick(['Go see Dennis at the kiosk. He keeps a card. You know the card.', 'I\'ll be here. I\'m standing in my first store. It\'s smaller than I remember.']), LI3);
  if (!p || p.status !== 'carry') return say('Come back when you have what you came with.', LI3);
  await say2([['CARL', 'It\'s from a guy.'], [LI3, 'It\'s from him.'], ['CARL', 'It could be a different guy.'], [LI3, 'The handwriting loops like that when he thinks he\'s being charming.']]);
  p.status = 'delivered'; C3.deliveries++; sfx('get');
  await say('LINDA OPENS THE BOX. INSIDE: A BRASS KEY ON A TAG. THE TAG READS: "UNIT 14 - GHOST & CO. MUSIC & MAGIC - DEPOSIT PAID 3/1989 - LEASE PENDING (SIGNATURE)".');
  await say2([[LI3, 'He put a deposit on a store. For us. In 1989. And never signed the lease.'], [LI3, 'I opened my first store in this mall. Fascism Inc. Unit 15.'], ['CARL', 'That\'s the one next door.'], [LI3, 'He booked 14. We\'d have shared a wall. He\'d have heard me through it every day.']]);
  await say('THE RADIO ON CARL\'S BELT CRACKLES.');
  await say2([[GH3, 'Lin.'], [LI3, 'I can hear you in the radio.'], [GH3, '...Hi.'], [LI3, 'You were going to surprise me.'], [GH3, 'I was going to surprise you.'], [LI3, 'With a lease.'], [GH3, 'With a lease and a piano.'], [LI3, 'I\'d have hated the piano.'], [GH3, 'You\'d have loved the piano.'], [LI3, '...I\'d have loved the piano.']]);
  await wait(40);
  await say2([[LI3, 'You don\'t get to put a deposit on a thing and call it staying.'], [GH3, 'No.'], [LI3, 'But you can put a key on a tag. Hold on.'], [LI3, 'I\'ll keep it. The rent\'s a hundred a month. Tell him he can pay it in applause.'], [GH3, 'Applause is not legal tender, Lin.'], [LI3, 'It is in this unit.']]);
  setF3('keyDone'); setF3('lindaOn');
  await say2([[LI3, 'Carl. People who plan this carefully usually mean to be there. And then something stops them, or they decide not to be. Both look the same from the mail slot.'], ['CARL', 'I\'m not asking.'], [LI3, 'No. I know. I\'m telling you anyway.'], [LI3, 'The kiosk upstairs. Dennis keeps a card. He\'s been practicing for twenty-six years.']]);
  setObj3('Find Dennis at the mall kiosk', 'mall_hall', 'dennis2');
}
async function kiosk() {
  await say2([['DENNIS', 'You made it. I thought you\'d be taller. Not in a bad way. Everybody here\'s smaller than the myth.'], ['CARL', 'What myth?'], ['DENNIS', 'The one on the card. "A COURIER WILL COME." It\'s laminated. There\'s a coffee ring on it.']]);
  await say2([['DENNIS', 'The Desert Palms had a post office kiosk. Mall Station. I was the clerk and the guard. I\'m still both. Nobody ever told me one of them stopped.'], ['DENNIS', 'The tall couple had their photo taken in that booth. They told me the strip would stay until you found it. It did.'], ['CARL', 'Why would they leave it?'], ['DENNIS', 'So you\'d know they were real and that they looked at you like this.']]);
  await say('"SIGN HERE." DENNIS PUSHES A LEDGER ACROSS THE COUNTER. A RUBBER STAMP HANGS ON A STRING.');
  const s = await ask('SIGN FOR THE FORWARD?', null, ['SIGN', 'NOT YET']); if (s !== 0) return;
  await signature('FORWARD, DESERT PALMS'); C3.route[4] = 1;
  await say2([['DENNIS', 'The string goes on from here. Every stop on it is still a stop, even the ones that stopped.'], ['DENNIS', 'And Carl. There\'ll be people waiting for you at the end of it. Not the couple. The other ones.'], ['CARL', 'What other ones?'], ['DENNIS', 'The ones who also got the card.']]);
  addNote('STAMP: DESERT PALMS. "The ones who also got the card" are waiting.'); setF3('done4'); setF3('pendingCall4'); setObj3('Back to the ship', 'mall_out', 'ass4');
}
SHIPCALL[4] = async () => {
  await say2([[DI, 'Mall Station stamped. And Linda asked for this frequency. I gave it to her. I don\'t know why. She asked like it was already hers.'], [GA, 'That\'s how she asks for everything, kid.']]);
  setF3('lindaOn'); setRouteObj();
};
RADIOTALK['CEO LINDA'][4] = async () => { await say2([[LI3, 'I\'m billing you for the airtime.'], ['CARL', 'You\'re not.'], [LI3, 'No. I\'m not. Don\'t tell him.']]); };
