'use strict';
// ================= CARL 3: stops 1 and 2 =================
const npc3 = (id, model, x, z, label, talk, o = {}) => Object.assign({ id, kind: 'npc', model, at: [x, 0, z], label, talk, faceCarl: 1, yaw: o.yaw || 0 }, o);
// the parked A.S.S.: its hull is near-white, so the character light (which boosts people to read against the backdrop) clips it. tone it down to the set's light.
const shipLight = p => { const L = liveLight(WX.sc, p); return { amb: L.amb.map(v => v * .6), dir: L.dir, dcol: L.dcol.map(v => v * .5), tint: L.tint.map(v => v * .45) }; };
const shipDoor = (id, x, z, yaw) => ({ id, kind: 'prop3', to: 'ship', at: [x, 0, z], label: 'THE A.S.S.', range: 3, talk: () => enterShip(), draw3: e => drawModel(SHIP, { p: [e.at[0], .9, e.at[2] + 2.4], yaw: yaw || 0, s: .9 }, shipLight(e.at)) });
async function enterShip() { await goScene('ship', 0, 1.9, 0); if (F3('pendingCall' + C3.stop) && !F3('calledStop' + C3.stop)) { setF3('calledStop' + C3.stop); await wait(20); await SHIPCALL[C3.stop](); } }
const SHIPCALL = {};
// ---------------- STOP 1: BOX CANYON ----------------
DRIVELINES[1] = [[60, 'DISPATCH', 'Route Card says Box Canyon. Population: eleven. I counted twice. The second time it was ten.'], [380, 'JB GARFIELD', 'Kid. A town with a post office and no mailman is a town with a story.'], [700, 'DISPATCH', 'There\'s a deputy. There\'s always a deputy. Be normal.'], [760, 'CARL', 'I am normal.']];
ARRIVE[1] = async () => {
  addParcel({ id: 'fedora', desc: 'A FEDORA, HAND-BLOCKED', toName: 'MARGE (ROUTE 9 DINER)', from: 'GARFIELD', model: 'parcel' }); addParcel({ id: 'cactus', desc: 'A POTTED CACTUS', toName: 'NED (PAWN)', from: '?', model: 'parcel' });
  await say2([['CARL', 'It\'s a town. It has a water tower. Chat, how many people live in a town with one water tower.'], [GA, 'Two parcels in your bay for the locals. Fedora for the diner. Cactus for the pawn shop. The fedora is mine, don\'t bend it.'], ['CARL', 'You get hats mailed? You\'re a cat.'], [GA, 'I\'m a detective.']]);
  C3.bux = Math.max(C3.bux, 20); setObj3('Get into the post office. A deputy is at the door.', 'canyon_main', 'brooks');
};
SCENES.canyon_main.ents = () => [
  shipDoor('ass', -27, 7.4, 1.5),
  npc3('brooks', 'guard', 5.4, 13.0, 'DEPUTY BROOKS', () => brooksTalk(), { yaw: Math.PI }),
  { id: 'panel', kind: 'prop3', at: [9.5, 0, 14.0], label: 'SIGN PANEL', range: 2.2, talk: () => panelTalk(), draw3: e => { const sp = project(LIVE.cam, [9.5, 1.6, 14.4]); if (sp) { rectF(sp[0] - 8, sp[1] - 7, 16, 14, hex('#403038')); rectF(sp[0] - 6, sp[1] - 5, 12, 10, F3('panelFixed') ? hex('#40ff90') : hex('#601010')); } } },
  npc3('marge', 'waitress', -17, 13.4, 'MARGE', () => margeTalk(), { yaw: Math.PI }),
  npc3('ned', 'farmer', 21, 13.4, 'NED', () => nedTalk(), { yaw: Math.PI }),
  { id: 'po_door', kind: 'prop3', to: 'canyon_post', at: [2, 0, 14.6], label: 'POST OFFICE', range: 2.2, talk: () => poDoor(), draw3: () => {} },
  { id: 'weed', kind: 'npc', model: 'tumbleweed', at: [30, 0, 9], label: '', range: 0, noShadow: 1, upd: e => { e.p[0] -= .035; e.yaw += .04; e.bob = Math.abs(Math.sin(e.t * .07)) * .15; if (e.p[0] < -33) e.p[0] = 34; } },
];
async function poDoor() { if (!F3('poOpen')) return say('Locked. A hand-lettered sign says CLOSED. A newer sign says STILL CLOSED. Under it, someone wrote "Brooks means it."', null); await goScene('canyon_post', 0, 1.8, 0); if (!F3('hankMet')) run(hankScene); }
async function brooksTalk() {
  if (F3('poOpen')) return say(pick(['Go on in. Mind the floor, it\'s waxed. It\'s always waxed.', 'Hank\'s been waiting for you. Not you. Someone. Go on.']), 'DEPUTY BROOKS');
  if (F3('brooksTask') === 'panel') return say('Sign panel\'s round the side. Fix it and you can go in. You said you were maintenance.', 'DEPUTY BROOKS');
  await say('Post office closed at five. Who are you, and what are you doing at my door at night.', 'DEPUTY BROOKS');
  for (;;) {
    const c = await claimMenu('DEPUTY BROOKS', 'I\'m asking you a question. Say it slow.', ['maintenance', 'resident', 'inspector', 'courier'], { stop: 1 });
    if (c === 'maintenance') { await say2([['CARL', 'I\'m with maintenance. Maintenance. I do maintenance. Things.'], ['DEPUTY BROOKS', 'Maintenance. Finally. The OPEN sign has been dead since Tuesday.'], ['DEPUTY BROOKS', 'The panel\'s round the side. Fix it, and I\'ll open the door. Don\'t touch the wires that are red. They\'re all red.']]); setF3('brooksTask', 'panel'); const a = alibiOf('maintenance'); if (a) a.task = 'FIX THE OPEN SIGN'; setObj3('Fix the sign panel (round the side)', 'canyon_main', 'panel'); return; }
    if (c === 'resident') {
      await say2([['CARL', 'I live here. I live in Box Canyon. I just moved in.'], ['DEPUTY BROOKS', 'Is that right. I know everybody in Box Canyon.'], ['CARL', 'There\'s eleven of you. It\'s easy to miss one.'], ['DEPUTY BROOKS', 'Then you\'ll know your P.O. box rent is due. Box 11. Twenty bucks. Overdue since you moved in, whenever that was.']]);
      const pay = await ask('PAY THE RENT? (YOU HAVE $' + C3.bux + ')', null, ['PAY $20', 'ARGUE']);
      if (pay === 0 && C3.bux >= 20) { C3.bux -= 20; sfx('get'); await say2([['DEPUTY BROOKS', 'Box 11\'s yours. Welcome to Box Canyon. Population: you.'], ['CARL', 'That\'s twelve.']]); setF3('box11'); finishAlibi('resident', 'PAID THE RENT'); setF3('poOpen'); setObj3('Go into the post office', 'canyon_post', 'po_door'); return; }
      if (pay === 0) await say('YOU DON\'T HAVE $20.');
      let r; do { r = await argue3({ id: 'brooks_rent', name: 'DEPUTY BROOKS', port: 'DEPUTY BROOKS', patience: 9, weak: { GRIEVANCE: 2 }, atk: ['Rent is rent, son.', 'I\'m looking at your face. It\'s green.', 'You don\'t look like you live anywhere.'], hit: 1, hint: 'he gets defensive when you say it was fine before he showed up', win: 'Fine. FINE. Take the box. Don\'t tell the others.', open: 'HE WANTS TWENTY BUCKS.' }); } while (!r.win);
      setF3('box11'); finishAlibi('resident', 'ARGUED THE RENT'); setF3('poOpen'); setObj3('Go into the post office', 'canyon_post', 'po_door'); return;
    }
    if (c === 'inspector') {
      await say2([['CARL', 'I\'m a postal inspector. I inspect. Posts. And offices.'], ['DEPUTY BROOKS', 'Badge.'], ['CARL', 'It\'s in the other ship. It\'s a big badge.']]);
      let r; do { r = await argue3({ id: 'brooks_badge', name: 'DEPUTY BROOKS', port: 'DEPUTY BROOKS', patience: 10, weak: { DENIAL: 2 }, atk: ['No badge. No entry.', 'Inspectors wear a hat.', 'You\'re wearing a hat. Backwards. That\'s not the hat.'], hit: 1, hint: 'deny deny deny', win: 'All right. All RIGHT. Inspect. Just inspect quietly.', open: 'HE DOESN\'T BELIEVE IN THE BIG BADGE.' }); } while (!r.win);
      finishAlibi('inspector', 'ARGUED PAST THE DEPUTY'); setF3('poOpen'); setObj3('Go into the post office', 'canyon_post', 'po_door'); return;
    }
    await say2([['CARL', 'I\'m delivering a package. To me.'], ['DEPUTY BROOKS', 'To you.'], ['CARL', 'It\'s addressed to me.'], ['DEPUTY BROOKS', 'Son, that\'s not a delivery. That\'s a Tuesday.']]);
    tickC('carl just tell him you work here', U0);
  }
}
async function panelTalk() {
  if (F3('panelFixed')) return say('The sign says OPEN. It blinks. It has never looked so confident.');
  if (F3('brooksTask') !== 'panel') return say2([['CARL', 'It\'s a panel with red wires. I\'m not touching a panel I haven\'t been asked to touch.'], ['USER_000', 'touch it'], ['CARL', 'No.']]);
  await say('FOUR WIRES, ALL RED. THE PAINT IS OLD. UNDER THE PAINT, THEY ARE NOT.');
  if (!F3('tutWire')) { setF3('tutWire'); await say('Pick a plug on the left with A, then its matching color on the right. Three mistakes and the panel bites.'); }
  const ok = await wires('SIGN PANEL', 4);
  if (!ok) { await say2([['CARL', 'It bit me. Chat, it bit me.'], [U0, 'again']]); return; }
  setF3('panelFixed'); sfx('get'); finishAlibi('maintenance', 'FIXED THE OPEN SIGN'); setF3('poOpen'); C3.bux += 10;
  await say2([['DEPUTY BROOKS', 'There it is. OPEN. Never thought I\'d see it.'], ['DEPUTY BROOKS', 'Door\'s open. I\'ll tell Hank he\'s got maintenance. He\'ll be thrilled. He\'s been talking to the ceiling.']]);
  setObj3('Go into the post office', 'canyon_post', 'po_door');
}
async function margeTalk() {
  const p = parcel('fedora');
  if (!p || p.status !== 'carry') return say(pick(['It\'s a nice hat. It\'s a very nice hat. He has a head like a bowling pin.', 'Come back when you\'ve got a milkshake order.']), 'MARGE');
  p.status = 'delivered'; C3.deliveries++; C3.bux += 15; sfx('get');
  await say2([['CARL', 'Delivery. A fedora. Hand-blocked. From a cat.'], ['MARGE', 'From JB. Of course. He sends me a hat every winter.'], ['CARL', 'Why.'], ['MARGE', 'It\'s a code. If the hat is black, the case is closed. If it\'s brown, he\'ll be back. This one\'s black.'], ['CARL', 'He didn\'t say.'], ['MARGE', 'He never says. He mails.'], ['MARGE', 'Here, for the trouble. And here\'s something for free: Hank at the post office has had one box in the back for fourteen days. Won\'t let anybody touch it. It\'s not even his box.']]);
  setF3('margeHint');
}
async function nedTalk() {
  const p = parcel('cactus');
  if (!p || p.status !== 'carry') return say(pick(['The cactus is doing great. It\'s outside. It\'s a cactus.', 'Not buying anything. Just selling.']), 'NED');
  p.status = 'delivered'; C3.deliveries++; C3.bux += 10; sfx('get');
  await say2([['CARL', 'Delivery. A cactus.'], ['NED', 'I didn\'t order a cactus. I own a pawn shop in a desert. There\'s a thousand of them out back.'], ['CARL', 'It says to Ned.'], ['NED', '...Oh. It\'s from my mother. She sends me a cactus every year. To remind me I\'m not the only one who can survive here.'], ['CARL', 'That\'s sweet.'], ['NED', 'It\'s passive-aggressive. Thank you. Here.']]);
}
// ---- inside the post office ----
SCENES.canyon_post.ents = () => [
  npc3('hank', 'postmaster', 0, 8.6, 'POSTMASTER HANK', () => hankTalk(), { yaw: Math.PI }),
  { id: 'box11', kind: 'prop3', at: [-1.2, 0, 11.0], label: 'P.O. BOX 11', range: 2.0, cond: () => F3('box11') && !F3('box11read'), talk: () => box11(), draw3: () => {}, promptY: .6 },
  { id: 'po_out', kind: 'prop3', to: 'canyon_main', at: [0, 0, .8], label: 'OUTSIDE', range: 1.6, talk: () => goScene('canyon_main', 2, 13.0, Math.PI), draw3: () => {} },
];
async function box11() {
  setF3('box11read'); sfx('get'); C3.bux += 5;
  await say('BOX 11 IS EMPTY EXCEPT FOR AN ENVELOPE. INSIDE: ONE POSTCARD, SIGNED WITH A STAMP THAT ISN\'T A REAL STAMP. IT SAYS:');
  await say('"IF THE CLERKS ASK, SAY YES. THEY ARE EXPECTING YOU."');
  addNote('Box 11 postcard: "If the clerks ask, say yes. They are expecting you."');
  await say2([['CARL', 'Expecting me. For a box I just rented. Under a name I made up.'], [U0, 'carl you used your real name'], ['CARL', 'I used the name I have.']]);
}
async function hankScene() {
  setF3('hankMet'); await wait(20);
  await say2([['POSTMASTER HANK', '...You\'re short.'], ['CARL', 'I\'m a normal height.'], ['POSTMASTER HANK', 'Of course you are. Come in. Come all the way in. You\'re carrying a box.'], ['CARL', 'How do you know I\'m carrying a box.'], ['POSTMASTER HANK', 'Because you\'re the one who\'s carrying it.']]);
  setObj3('Talk to the postmaster', 'canyon_post', 'hank');
}
async function hankTalk() {
  if (F3('done1')) return say(pick(['Safe travels. Mind the cattle guards.', 'First class. It\'s always first class.']), 'POSTMASTER HANK');
  if (!F3('hankMet')) { setF3('hankMet'); }
  await say2([['POSTMASTER HANK', 'I\'m going to tell you something and I\'d like you not to interrupt.'], ['CARL', 'I interrupt.'], ['POSTMASTER HANK', 'I know. I was told.']]);
  await say2([['POSTMASTER HANK', 'Nineteen years ago, two customers came in. Tall. Very polite. They paid in stamps that weren\'t stamps. I took them. They cleared.'], ['POSTMASTER HANK', 'They left me a card and told me to pin it up in the back. It says: A COURIER WILL COME. HE WILL BE SHORT. HE WILL BE CARRYING A BOX ADDRESSED TO HIMSELF. HE WILL TELL YOU HE IS NORMAL. DO NOT ARGUE. STAMP IT.']]);
  await say2([['CARL', 'That\'s not a thing. That\'s a prank.'], ['POSTMASTER HANK', 'I thought so too. Every year I\'d take it down, dust it, put it back. Nineteen years. I\'ve been rehearsing.'], ['POSTMASTER HANK', 'The box was supposed to be in the back, on hold. It\'s on your ship. It got there on its own. That\'s the part I don\'t love.']]);
  const q = await ask('WHAT DOES HE ASK?', null, ['WHO WERE THEY?', 'WHAT DID THEY LOOK LIKE?', 'JUST STAMP IT']);
  if (q === 0) await say2([['POSTMASTER HANK', 'No names. The stamps were their names. A little pile of [[[[[ in blue. Not real. But the postal service accepted them. They processed.'], ['CARL', 'Chat, that\'s...'], [U0, 'carl that is YOUR name'], ['CARL', 'It\'s a pattern. It\'s a pattern of brackets.']]);
  if (q === 1) await say2([['POSTMASTER HANK', 'Tall. The kind of tall where the doorframe has an opinion. They stood very close to each other. Like they\'d practiced standing that way. They looked at the box a long time.'], ['POSTMASTER HANK', 'The man put his hand on it. The woman said "not yet." Then they thanked me for my time. Nobody thanks me for my time.']]);
  await say2([['POSTMASTER HANK', 'This is the first of eleven. A clerk at every stop has the same card. You stamp where they tell you. You don\'t open it. You don\'t send it back. And when the last clerk stamps it, the address exists.'], ['CARL', 'That\'s the whole thing? A chain of clerks?'], ['POSTMASTER HANK', 'Mail is a chain of people being patient. They built it out of patience. Nobody knew there was a ship at the end of it.']]);
  await say('"SIGN HERE." HANK TURNS THE LEDGER AROUND AND HOLDS OUT A PEN ON A CHAIN.');
  const s = await ask('SIGN FOR THE FORWARD?', null, ['SIGN', 'NOT YET']); if (s !== 0) { await say('CARL: I need a minute. Signing for things is how it starts.', 'CARL'); return; }
  await signature('FORWARD, BOX CANYON');
  await say2([['POSTMASTER HANK', 'That\'s the first stamp. Next is the Starlite Motor Court. Room 6. Ask Dolores for the key. She won\'t give it to you. You\'ll have to give her a reason.'], ['CARL', 'A reason.'], ['POSTMASTER HANK', 'Everybody has a reason. That\'s what they are.']]);
  C3.route[1] = 1; addNote('HANK: A courier will come, short, carrying a box to himself. Stamp it. (19 years)'); addNote('STAMP 1: BOX CANYON. Next: THE STARLITE, ROOM 6.'); setF3('done1'); setF3('pendingCall1');
  setObj3('Back to the ship, then drive to the Starlite', 'canyon_main', 'ass');
}
// the signature: he writes the name he has. the player only ever sees the brackets
async function signature(what) {
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { skyD(0, H, '#d8c898', '#b09868'); panel(30, 40, 260, 120); text(what, 44, 52, UI.name); rectF(46, 100, 228, 1, BLACK); const n = Math.min(5, Math.floor(t / 14)); text('[[[[['.slice(0, n), 60, 84, hex('#101040'), 0, 3); if (t > 100) { circF(240, 90, 20, hex('#b62424')); text('STAMPED', 218, 88, WHITE, 0); } } };
  sfx('tick'); await wait(100); sfx('stamp'); await wait(50); scene = prev;
  await say('HE WRITES HIS NAME. IT TAKES A WHILE. IT IS LONGER THAN FIVE BRACKETS. THE PLAYER ONLY EVER SEES THE BRACKETS.');
}
SHIPCALL[1] = async () => {
  await say2([[DI, 'Carl. Carl, you stamped it. I can see it on the tracker. The parcel went from "no such address" to "in transit." It hasn\'t been "in transit" for nineteen years.'], ['CARL', 'It was a postmaster and a pen.'], [DI, 'It was nineteen years.']]);
  // Garfield's read on how Carl got past the deputy
  const how = C3.alibis.filter(x => x.stop === 1 && !x.retracted).map(x => x.id).pop();
  await say2(how === 'inspector' ? [[GA, 'The deputy. Kid, you told a deputy you were a postal inspector with a big badge in the other ship.'], ['CARL', 'And he let me in.'], [GA, 'He let you in to make you stop talking. That\'s not a cover. That\'s a siege.'], [GA, 'Somebody\'s going to ask to see that badge again. Lies keep.']]
    : how === 'resident' ? [[GA, 'The deputy. Kid, you told a deputy you live in Box Canyon. Now you\'ve got a P.O. box.'], ['CARL', 'Box 11. I\'m the twelfth resident.'], [GA, 'That\'s called a cover.'], ['CARL', 'That\'s called a lie. I told a lie and now I have mail.'], [GA, 'That\'s the thing about a lie. It needs upkeep.']]
    : [[GA, 'The deputy and his panel. Kid, you told a deputy you were maintenance and then you were maintenance. That\'s called a cover.'], ['CARL', 'That\'s called a lie. I told a lie and then it was a chore.'], [GA, 'That\'s the thing about a lie. It needs upkeep.']]);
  await say('THE CEILING OF THE SHIP OPENS A LITTLE. THERE IS NO CHUTE. A CRATE DROPS OUT ANYWAY. IT IS LABELED: "FRAGILE. CONTENTS: ONE (1) CARL (FORMER)." ADDRESSED TO ROOM 6.');
  addParcel({ id: 'crate', desc: 'A CRATE: "ONE (1) CARL (FORMER)"', toName: 'ROOM 6', from: '?', model: 'crate' });
  await say2([['CARL', 'No. That\'s a normal crate. Lots of people have crates.'], [DI, 'It says "Carl" on it.'], ['CARL', 'It\'s a Carl-brand crate.'], [U0, 'carl you know that crate'], ['CARL', 'I don\'t know that crate.']]);
  setF3('done1_call'); setObj3('Drive to the Starlite Motor Court', 'ship', 'helm');
};
RADIOTALK.DISPATCH[1] = async () => { await say2([[DI, 'Hank\'s a good clerk. They don\'t make clerks like that. They make them patient and then they\'re all like that.']]); };
// ---------------- STOP 2: THE STARLITE ----------------
DRIVELINES[2] = [[80, 'JB GARFIELD', 'Motel. Night. Neon. Kid, I\'ve solved four murders at motels like this and none of them were murders.'], [420, 'DISPATCH', 'Room 6. Annual guest. That\'s what the tracker says. One night a year, paid in advance, thirty-one years.'], ['780', 'CARL', 'Who stays one night a year.'], [840, 'DISPATCH', 'Somebody with a reason.']].map(l => [Number(l[0]), l[1], l[2]]);
ARRIVE[2] = async () => {
  await say2([['CARL', 'It\'s pink. The whole motel is pink. The lighting is pink and the sign says STARLITE and half the letters are out.'], ['CARL', 'It says "ST RL TE". It\'s a motel for people who don\'t need vowels.'], [U0, 'what does the vacancy sign say'], ['CARL', 'It says VACANCY. It says it a lot. It\'s the only word it can afford.']]);
  setObj3('Find the manager and ask about Room 6', 'motel_lot', 'dolores');
};
SCENES.motel_lot.ents = () => [
  shipDoor('ass2', -22, 3.2, 1.2),
  npc3('dolores', 'manager', -0.5, 24.0, 'DOLORES', () => doloresTalk(), { yaw: Math.PI }),
  { id: 'ice', kind: 'prop3', at: [4.5, 0, 21.0], label: 'ICE MACHINE', range: 2.0, talk: () => iceMachine(), draw3: () => {}, promptY: .4 },
  { id: 'room6', kind: 'prop3', to: 'motel_room6', at: [14, 0, 16.4], label: 'ROOM 6', range: 2.0, talk: () => room6Door(), draw3: () => {} },
  { id: 'vend', kind: 'prop3', at: [-3.6, 0, 21.0], label: 'VENDING', range: 2.0, talk: () => vending(), draw3: () => {}, promptY: .6 },
];
async function vending() {
  if (C3.bux < 3) return say('A BAG OF NOTHING COSTS $3. YOU HAVE $' + C3.bux + '. THE MACHINE ADMIRES YOUR COMMITMENT.');
  const i = await ask('VENDING. A BAG OF PRETZELS IS $3.', null, ['BUY', 'NO']); if (i !== 0) return;
  C3.bux -= 3; sfx('get'); await say2([['CARL', 'Pretzels. I\'m eating a pretzel. It\'s a normal pretzel. It tastes like a normal pretzel.'], [U0, 'it is made of salt']]);
}
async function iceMachine() {
  if (!alibiOf('maintenance') || F3('iceFixed')) { if (F3('iceFixed')) return say('THE ICE MACHINE HUMS. IT MAKES ICE. IT IS PROUD.'); return say('IT\'S AN ICE MACHINE. IT IS DRIPPING A SLOW, JUDGMENTAL DRIP. NOT YOUR PROBLEM.', null); }
  if (!F3('iceAsked')) return say('THE ICE MACHINE IS DRIPPING. SOMEBODY SHOULD TELL THE MANAGER. SOMEBODY WHO IS MAINTENANCE.');
  await say('THE ICE MACHINE: A DOOR, A PANEL, A TANGLE OF WIRES THAT SMELL LIKE WET PENNIES.');
  const ok = await wires('ICE MACHINE', 5); if (!ok) return say('IT SPAT ICE AT YOU. A LOT OF ICE. YOU\'RE COLD AND WRONG.');
  setF3('iceFixed'); setF3('room6key'); finishAlibi('maintenance', 'FIXED THE ICE MACHINE'); sfx('get'); C3.bux += 10;
  await say2([['DOLORES', 'Well, look at that. It stopped dripping. Thirty years that thing has dripped.'], ['DOLORES', 'Room 6 key. I don\'t know what you want in there. It\'s a clean room. It\'s always clean. Nobody\'s slept in it in thirty-one years.']]);
  setObj3('Take the key to Room 6', 'motel_lot', 'room6');
}
async function doloresTalk() {
  if (F3('room6key')) return say(pick(['Room 6. Ground floor, around the pool. Mind the flamingo. It\'s not real.', 'Check-out is whenever.']), 'DOLORES');
  if (!F3('doloresMet')) { setF3('doloresMet'); await say2([['DOLORES', 'We\'ve got vacancy. We always have vacancy. Is it one night?'], ['CARL', 'I\'m not staying. I have a crate. For Room 6.'], ['DOLORES', 'Room 6 isn\'t available. Room 6 has an annual guest.'], ['CARL', 'I know. It\'s addressed to Room 6.'], ['DOLORES', 'Then it\'s the guest\'s crate. And who are you?']]); }
  const opts = ['maintenance', 'resident', 'relative', 'courier'];
  for (;;) {
    const c = await claimMenu('DOLORES', 'Honey, I need to know who you are before I hand over a key.', opts, { stop: 2 });
    if (c === 'maintenance') { await say2([['CARL', 'Maintenance. I\'m maintenance. I maintain.'], ['DOLORES', 'Oh, thank God. The ice machine has been dripping since the Clinton administration. If you fix it, I\'ll give you any key you want.']]); setF3('iceAsked'); const a = alibiOf('maintenance'); if (a) a.task = 'FIX THE ICE MACHINE'; setObj3('Fix the ice machine', 'motel_lot', 'ice'); return; }
    if (c === 'resident') {
      await say2([['CARL', 'I live in Room 6.'], ['DOLORES', 'You live in Room 6.'], ['CARL', 'I\'ve been there the whole time.'], ['DOLORES', 'Honey, Room 6 is booked one night a year. By a couple, tall. It has been for thirty-one years. If you live there, you owe rent. Thirty-one years of nights at $40 and the damages.']]);
      let r; do { r = await argue3({ id: 'dolores_rent', name: 'DOLORES', port: 'DOLORES', patience: 11, weak: { LOGIC: 2 }, atk: ['A key is a promise, honey.', 'Where\'s your luggage?', 'You don\'t even have a toothbrush. I can see it in your face.'], hit: 1, hint: 'she respects an argument that adds up', win: 'You know what? Fine. I like a person who commits to a bit.', open: 'SHE WANTS THIRTY-ONE YEARS OF RENT.' }); } while (!r.win);
      await say('DOLORES: "Here. Don\'t scuff the carpet. It\'s the only carpet that\'s never been walked on."'); finishAlibi('resident', 'ARGUED THE RENT'); setF3('room6key'); setObj3('Take the key to Room 6', 'motel_lot', 'room6'); return;
    }
    if (c === 'relative') {
      await say2([['CARL', 'I\'m... family. Of the guests. In Room 6. I\'m family.'], ['DOLORES', 'You\'re family of the tall couple.'], ['CARL', 'In a way.'], ['DOLORES', 'You\'re short.'], ['CARL', 'It\'s the angle.'], ['DOLORES', 'You\'re green.'], ['CARL', 'It\'s a very green motel.'], ['DOLORES', 'Honey, the lighting here is pink.']]);
      await wait(30);
      await say2([['DOLORES', '...They said family would come. They said "someone short, who will say he is normal." They left an envelope for you at the desk thirty-one years ago. I put it in the safe. I look at it every New Year\'s.'], ['CARL', 'I don\'t... I don\'t know those people.'], ['DOLORES', 'I didn\'t say you did. Here. The key. And the envelope.']]);
      finishAlibi('relative', 'FAMILY OF ROOM 6'); setF3('room6key'); setF3('envelope'); addNote('DOLORES: They left an envelope for "someone short who will say he is normal." (31 years in the safe)'); setObj3('Take the key to Room 6', 'motel_lot', 'room6'); return;
    }
    await say2([['CARL', 'I\'m a delivery driver. I have a crate for Room 6.'], ['DOLORES', 'Sign for it at the desk, and I\'ll put it in the room.'], ['CARL', 'It has to go in myself. I think.'], ['DOLORES', 'Honey. If you\'re not guest, family, or staff, I can\'t.']]);
    tickC('carl pick something', U0);
  }
}
async function room6Door() {
  if (!F3('room6key')) return say('ROOM 6. THE DOOR IS LOCKED. THE LOCK HAS NOT BEEN OPENED SINCE THE LAST TIME IT WAS.');
  await goScene('motel_room6', 0, 1.8, 0); if (!F3('r6seen')) run(room6Scene);
}
SCENES.motel_room6.ents = () => [
  { id: 'r6map', kind: 'prop3', at: [0, 0, 7.0], label: 'THE MAP', range: 2.4, talk: () => r6map(), draw3: () => {}, promptY: .8 },
  { id: 'r6drawer', kind: 'prop3', at: [2.4, 0, 7.0], label: 'DRAWER', range: 1.8, talk: () => r6drawer(), draw3: () => {}, promptY: .5 },
  { id: 'r6bed', kind: 'prop3', at: [-2.4, 0, 5.2], label: 'BED', range: 2.0, talk: () => r6crate(), draw3: () => {} },
  { id: 'r6out', kind: 'prop3', to: 'motel_lot', at: [0, 0, .8], label: 'OUTSIDE', range: 1.6, talk: () => goScene('motel_lot', 14, 15.0, Math.PI), draw3: () => {} },
];
async function room6Scene() {
  setF3('r6seen'); await wait(20);
  await say2([['CARL', 'It\'s a room. It\'s a normal room. It has a bed, and a lamp, and a map on the wall.'], ['CARL', 'It\'s clean. Nobody stays here. It\'s the cleanest room I\'ve ever stood in. Chat, I feel like I\'m dirtying it.'], [U0, 'the crate carl']]);
  setObj3('Put the crate on the bed', 'motel_room6', 'r6bed');
}
async function r6crate() {
  const p = parcel('crate'); if (!p || p.status !== 'carry') return say('THE BED IS MADE. A CRATE-SHAPED DENT IN THE COVERS. YOU MADE IT.');
  p.status = 'delivered'; C3.deliveries++; sfx('get');
  await say2([['CARL', 'Okay. I\'m putting the crate on the bed. It\'s a normal crate.'], ['CARL', 'It\'s the right size. It\'s... it\'s been in here before. There\'s a place on the side where something sat. I don\'t know why I know that. I\'m guessing.']]);
  await say('THE CRATE IS EMPTY. TAPED INSIDE THE LID: A STRIP OF PAPER IN TWO KINDS OF HANDWRITING. ONE IS STIFF. ONE IS ROUND.');
  await say('"THIS IS THE DECOY. THE REAL ONE IS WITH YOU. IF THEY OPEN THIS, THEY WILL LOOK FOR HIM IN THE WRONG PLACE."');
  addNote('CRATE: "This is the decoy. The real one is with you."');
  await say2([['CARL', 'Him. It says "him."'], [U0, 'carl'], ['CARL', 'It could be anyone.'], [U0, 'it says CARL on the lid'], ['CARL', 'It says CARL because it\'s a Carl-brand crate.']]);
  setF3('crateDone'); setObj3('Look at the map on the wall', 'motel_room6', 'r6map');
}
async function r6map() {
  if (!F3('crateDone')) return say('A MAP OF NEVADA WITH RED PINS AND STRING. IT SHOULD WAIT UNTIL THE CRATE IS ON THE BED. THAT FEELS RIGHT.');
  if (F3('r6mapSeen')) return say('ELEVEN PINS. THE STRING RUNS FROM BOX CANYON TO A POINT OFF THE EDGE OF THE MAP.');
  setF3('r6mapSeen');
  await say('A MAP OF NEVADA WITH ELEVEN RED PINS CONNECTED BY STRING. THE FIRST IS BOX CANYON. THE SECOND IS HERE. THE THIRD IS A TRAVEL PLAZA. THERE THE STRING SPLITS FIVE WAYS, LIKE A HAND, AND COMES BACK TOGETHER AT A SORTING CENTER. THE LAST PIN IS STUCK IN THE WALL BEYOND THE EDGE OF THE MAP.');
  await say2([['CARL', 'It\'s a route. It\'s the route. It\'s the one on the card.'], ['CARL', 'They made a route. They made it by hand, with string.'], [U0, 'it is the route you are driving'], ['CARL', 'It\'s the route I\'m driving. Because it\'s the route that\'s there. It\'s not a message. It\'s a map.'], [U0, 'carl']]);
  await say('IN THE CORNER OF THE MAP, SMALL: "WE WALKED THIS ONE FIRST. SO YOU WOULDN\'T HAVE TO DO IT ALONE."');
  addNote('ROOM 6 MAP: eleven pins, hand-strung. "We walked this one first so you wouldn\'t have to do it alone."');
  C3.route[2] = 1; setObj3('Check the drawer', 'motel_room6', 'r6drawer');
}
async function r6drawer() {
  if (F3('r6drawerDone')) return say('THE DRAWER IS EMPTY NOW. THE NOTE IS IN YOUR POCKET. THE POCKET HAS A TICKET FOR AN ENVELOPE.');
  if (!F3('r6mapSeen')) return say('A DRAWER. SHUT. YOU SHOULD LOOK AT THE MAP FIRST.');
  setF3('r6drawerDone');
  await say('THE DRAWER HOLDS ONE SHEET OF MOTEL STATIONERY AND A GUIDEBOOK TO NEVADA. THE NOTE:');
  await say('"IF IT ARRIVES WHILE WE ARE AWAY, DON\'T SEND IT BACK."');
  if (F3('envelope')) {
    await say('DOLORES\'S ENVELOPE: INSIDE, A SINGLE STAMP, THE KIND THAT ISN\'T. NO LETTER. JUST A STAMP, AND ON THE BACK, IN ROUND HANDWRITING: "THIS ONE\'S FOR THE LAST CLERK."');
    addNote('ENVELOPE STAMP: "This one\'s for the last clerk."'); setF3('lastStamp');
  }
  await say2([['CARL', '"Don\'t send it back." That\'s... that\'s a rule for a clerk. That\'s what you tell a clerk.'], ['CARL', 'It\'s not a note to me. It\'s a note to whoever had the box.'], [U0, 'it IS a note to you'], ['CARL', 'It\'s a note to the person carrying it.'], [U0, 'who is carl'], ['CARL', 'It\'s a coincidence. A very specific one.']]);
  await say('THEY HAVE KEPT A ROOM FOR THIRTY-ONE YEARS. THEY NEVER SLEPT IN IT. THEY CAME FOR ONE NIGHT A YEAR TO LEAVE A NOTE, AND CHECKED OUT BEFORE DAWN.');
  addNote('ROOM 6: booked one night a year for 31 years. Never slept in.'); addNote('STAMP 2: THE STARLITE. Next: BIG LEON\'S.');
  setF3('done2'); setF3('pendingCall2'); setObj3('Leave the room and go back to the ship', 'motel_lot', 'ass2');
}
SHIPCALL[2] = async () => {
  await say2([[DI, 'The tracker updated again. Second stamp. And Carl, the motel\'s ledger shows a booking for tonight. It\'s a different name. It\'s the same name. It\'s a stamp.'], ['CARL', 'It\'s a coincidence.'], [GA, 'Kid. I\'ve worked a lot of rooms. The ones people don\'t sleep in are the ones they\'re living in.'], ['CARL', 'That\'s a detective thing. You say stuff like that and it sounds smart and doesn\'t mean anything.'], [GA, 'It means something. It just doesn\'t mean it to you yet.']]);
  await say('THE CEILING OPENS A LITTLE. A SMALL, FLAT PARCEL DROPS OUT. A VHS TAPE, LABELED IN FOUR-SHADE GREEN: "FOR OLD FACE. FROM NEW FACE. IN CASE."');
  addParcel({ id: 'tape', desc: 'A VHS TAPE: "IN CASE"', toName: 'OLD FACE (BIG LEON\'S)', from: 'NEW FACE', model: 'parcel' });
  await say2([['CARL', 'Face. The first one. The one who got me out. This is for him?'], [DI, 'From the new one. Both of them have a standing order with the post office, apparently. They don\'t speak. They mail.'], ['CARL', 'That\'s two guys in a hallway that won\'t knock.'], [DI, 'It\'s a good system.']]);
  setObj3('Drive to Big Leon\'s Travel Plaza', 'ship', 'helm');
};
