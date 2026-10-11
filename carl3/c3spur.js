'use strict';
// ================= CARL 3: ACT II, THE SILVER SPUR CASINO (stop 8). THE TEMPLATE: every new stop is built like this one =================
// 1. regStop  2. scenes (SB)  3. DRIVELINES / ARRIVE  4. ents per scene  5. the gatekeeper (claimMenu -> a job)  6. the clerk, the stamp, the note
// 7. SHIPCALL / RADIOTALK / CBTALK / REVISIT  8. its little job (here: slots)
const DK = 'DUKE', MV = 'MAVIS', TY = 'TINY';
regStop(8, { name: 'THE SILVER SPUR', scene: 'spur_lot', road: 'a casino the size of a regret', sky: ['#000010', '#4a1450'], ground: '#1a1020' },
  { act: 2, hint: () => !F3('spurIn') ? 'Tiny at the door wants to know who you are. He means it as a question.' : !F3('dukeMet') ? 'The postal cage is at the back of the floor. Past the slots.' : !F3('m31fixed') ? 'Machine 31. It ate the card in 1997. Fix it.' : 'Play Machine 31. Three stamps. Mavis is holding the seat.' });
CLAIMS.roller = { name: 'A HIGH ROLLER', short: 'I\'M A HIGH ROLLER', with: ['shopper', 'investor'] };
regBust('DUKE', genBust({ skin: '#dbb692', hair: '#b6b6b6', top: '#1a1a24', collar: '#ffffff', tie: '#ffd848' }), '#ffd848');
regBust('MAVIS', genBust({ skin: '#f0c8a8', hair: '#dbdbff', hairStyle: 'big', top: '#b62492', glasses: 1 }), '#6dffdb');
regBust('TINY', genBust({ skin: '#926d49', hair: '#101010', hairStyle: 'bald', top: '#101018', shades: 1, collar: '#ffffff' }), '#ff2449');
Object.assign(VOICE, { DUKE: [340, 60], MAVIS: [820, 90], TINY: [220, 20] });
Object.assign(PEOPLE, { pitboss: { top: '#1a1a24', bottom: '#1a1a24', tie: '#ffd848', hair: '#b0b0b0', hairStyle: 'slick' }, mavis: { top: '#b62492', bottom: '#4a3a6d', hair: '#dbdbff', hairStyle: 'big', glasses: 1, k: .92 }, bouncer: { top: '#101018', bottom: '#101018', shades: 1, hairStyle: 'bald', wide: 1 } });
for (const k of ['pitboss', 'mavis', 'bouncer']) MODELS_P[k] = personModel(PEOPLE[k]);
// ---------------- scenes ----------------
// ---- the lot: a neon spur forty feet tall, and a parking lot for a crowd that left in 1997 ----
(() => {
  const b = SB({ amb: [.28, .22, .4], sun: { dir: [-.4, .8, -.3], col: [.3, .26, .55] }, sky: ['#000010', '#4a1450'], stars: 1, fog: { col: '#2a1040', dens: .01 }, music: 'casino', title: 'THE SILVER SPUR' });
  b.ground(220, 160, { col: '#a09080', tex: 'sand', ts: 4 }, 0, 20);
  b.add('plane:80:26', [0, .015, 12], { col: '#8a8a92', tex: 'asphalt', ts: 4, shiny: .5 });
  for (let i = -6; i <= 6; i++) b.add('plane:.2:6', [i * 5, .02, 8], { col: '#e8e8d0', emis: .1 });
  b.building(0, 32, 44, 12, 7, { col: '#e8d8c8', tex: 'stucco', ts: 4 }, { win: 0, roofCol: '#6d2450' });
  b.add('box:6:3.2:.12', [0, 0, 25.9], { col: '#ffd848', emis: .8 });                                                   // the doors: gold, lit from inside
  b.sign(0, 9.6, 25.6, 22, 2.6, '#ff49db', { rad: 18, int: 1.4 }); b.sign(0, 7.4, 25.6, 14, 1.2, '#24dbff', { rad: 12 });   // SILVER SPUR / 24 HRS
  b.cyl(-17, 24, .5, 16, { col: '#505058' }, { solid: true, seg: 8 });                                                    // the spur's pole
  b.cyl(-17, 24, 3.2, .6, { col: '#ffd848', emis: .95 }, { y: 15.4, seg: 12, solid: false }); for (let i = 0; i < 8; i++) { const a = i * .785; b.add('box:.4:.4:2', [-17 + Math.cos(a) * 3.6, 15.6 + Math.sin(a) * 3.6, 24], { col: '#ff49db', emis: 1 }); }
  b.light(-17, 15, 22, [1, .4, .9], 22, 1.6, 1.4);
  b.lamp(-10, 6, { h: 7, col: [1, .5, .9] }); b.lamp(12, 6, { h: 7, col: [.5, .9, 1] }); b.lamp(28, 16, { h: 7 }); b.lamp(-30, 16, { h: 7, col: [1, .5, .9] });
  b.car(16, 12, .2, '#d8d8d8'); b.car(22, 9, -.1, '#b62424'); b.car(-24, 20, 1.5, '#2058b0');
  b.box(8, 22, 1.2, .9, 1.9, { col: '#6d2450', shiny: .4 }); b.box(8, 21.5, .9, .1, .8, { col: '#ffd848', emis: .9 }, { y: 1.0, solid: false });   // Machine Zero, for the people waiting outside
  b.cactus(-36, 6); b.cactus(38, 10, 3.2); b.cactus(34, 26, 2.4);
  b.walkRect(-38, 1, 38, 24.6);
  b.cam('west', [-30, 4.2, -8], [-24, 2.4, 14], .95, [-40, -10, -12, 40]); b.cam('front', [0, 3.6, -9], [0, 5.2, 26], 1.0, [-12, -10, 16, 40]); b.cam('east', [27, 4.2, -8], [24, 2.4, 14], .95, [16, -10, 40, 40]);
  SCENES.spur_lot = Object.assign(b.fin(), { start: [-30, 0, 4], arrive: [-30, 4, 1.5], shipExit: [-30, 4, 1.5],
    drawOver: () => { const sp = project(LIVE.cam, [0, 9.4, 25.4]); if (sp && ((WX.t >> 5) % 4)) text('SILVER SPUR', sp[0] - 33, sp[1] - 3, hex('#ffe8ff'), BLACK, 1); } });
})();
// ---- the floor: two rows of slots, a felt table, the cage at the back. Machine 31 is dark until it isn't ----
(() => {
  const b = SB({ amb: [.36, .26, .38], sun: { dir: [.1, 1, -.3], col: [.3, .2, .3] }, sky: ['#100010', '#200820'], fog: { col: '#1a0a1a', dens: .004 }, music: 'casino', title: 'THE CASINO FLOOR' });
  b.ground(40, 22, { col: '#b04a6a', tex: 'carpet', ts: 1.5 }, 0, 10);
  const WL = { col: '#6d2450', tex: 'stucco', ts: 3 };
  b.box(0, 21, 40, .6, 5, WL); b.box(-20, 10, .6, 22, 5, WL); b.box(20, 10, .6, 22, 5, WL);
  for (const z of [7, 12]) for (let i = 0; i < 6; i++) { const x = -15 + i * 2; b.box(x, z, 1.1, .9, 1.9, { col: i & 1 ? '#a02a6a' : '#6d2a8a', shiny: .4 }); b.add('box:.8:.6:.1', [x, 1.05, z - .48], { col: i & 1 ? '#24dbff' : '#ffd848', emis: .9 }); }
  b.box(-15, 19.6, 1.3, 1, 2.2, { col: '#2a2a30', shiny: .2 }); b.add('box:.9:.7:.1', [-15, 1.2, 19.05], { col: '#101014' });       // Machine 31, dark
  b.cyl(5, 10, 2, .9, { col: '#1a6a3a', shiny: .2 }, { solid: true, seg: 14 }); b.cyl(5, 10, 2.1, .1, { col: '#6a4a2a' }, { y: .9, seg: 14, solid: false });   // the blackjack table
  b.box(12, 17, 9, 1, 1.2, { col: '#3a2a20', tex: 'wood', ts: 2, shiny: .3 });                                                 // the cage counter
  for (let i = 0; i < 10; i++) b.add('box:.06:2.4:.06', [8 + i * .9, 1.2, 17], { col: '#c8a848', shiny: .8 });                  // its bars
  b.sign(12, 3.8, 20.6, 7, .9, '#ffd848', { rad: 9 }); b.add('box:1.4:.9:.1', [15, 1.5, 20.6], { col: '#2058b0', emis: .5 });  // CASHIER / the little blue eagle
  b.lights.push({ p: [-10, 4.4, 9], col: [1, .7, .9], rad: 14, int: 1.3, glow: .8 }, { p: [6, 4.4, 10], col: [1, .9, .7], rad: 12, int: 1.3, glow: .8 }, { p: [12, 3, 16], col: [1, .85, .5], rad: 9, int: 1.2 }, { p: [-15, 3.5, 17], col: [.4, .3, .5], rad: 6, int: .6 });
  b.walkRect(-19, 1, 19, 16.4); b.walkRect(-19, 15, 6.6, 20.2);
  b.autoCams(-20, 1, 22, 21, 14, 10, 8, 7.5, 1.0);   // high and back: the low cameras dropped the front of each zone off the bottom of the frame
  SCENES.spur_floor = Object.assign(b.fin(), { start: [0, 0, 1.8] });
  SCENES.spur_floor.variantKey = () => F3('m31fixed') ? 'm' : '';
  SCENES.spur_floor.variantScene = () => { const s = Object.assign({}, SCENES.spur_floor); s.objs = s.objs.concat([{ m: 'box:.9:.7:.1', p: [-15, 1.2, 19.0], mat: { col: '#ff49db', emis: 1 } }]); s.lights = s.lights.concat([{ p: [-15, 2, 18.4], col: [1, .4, .9], rad: 8, int: 1.4, glow: 1.4 }]); return s; };
})();
// ---------------- the drive in, the arrival ----------------
DRIVELINES[8] = [[70, DI, 'The Silver Spur. West, by the lake, where the money goes to look at the water. The cage at the back of the floor is a contract postal unit.'], [400, 'CARL', 'A casino has a post office?'], [440, DI, 'The cashier sells stamps. People mail their winnings home so they can\'t lose them twice.'], [760, GA, 'Kid, a casino is a building that tells everyone they\'re about to be lucky. Don\'t believe the building.']];
ARRIVE[8] = async () => {
  await say2([['CARL', 'It\'s a casino. It\'s a casino in the middle of a desert, which is where they keep them.'], [U0, 'carl do not gamble the parcel'], ['CARL', 'I\'m not going to gamble the parcel. Who gambles a parcel.'], [GA, 'Somebody did. That\'s why you\'re here.']]);
  setObj3('Get past the doorman', 'spur_lot', 'tiny');
};
SCENES.spur_lot.ents = () => [
  shipDoor('ass8', -31, 3.4, 1.5),
  npc3('tiny', 'bouncer', 2.6, 23.6, 'TINY', () => tinyTalk(), { yaw: Math.PI, s: 1.15 }),
  { id: 'spur_door', kind: 'prop3', to: 'spur_floor', at: [0, 0, 24.6], label: 'THE SPUR', range: 1.8, cond: () => F3('spurIn'), talk: () => spurDoor(), draw3: () => {} },
  { id: 'zero', kind: 'prop3', at: [8, 0, 20.8], label: 'MACHINE ZERO', range: 1.8, cond: () => F3('tinyTask') === 'roll' && !F3('spurIn'), talk: () => machineZero(), draw3: () => {} },
];
SCENES.spur_floor.ents = () => [
  { id: 'spur_out', kind: 'prop3', to: 'spur_lot', at: [0, 0, 1.2], label: 'OUT', range: 1.6, talk: () => goScene('spur_lot', 0, 22.6, Math.PI), draw3: () => {} },
  npc3('duke', 'pitboss', 12, 18.0, 'DUKE', () => F3('spurSign') && !F3('done8') ? spurStamp() : dukeTalk(), { yaw: Math.PI, range: 3.0 }),
  npc3('mavis', 'mavis', -15, 18.0, 'MAVIS', () => mavisTalk(), { yaw: 0, faceCarl: 0, cond: () => !F3('mavisHome') }),
  { id: 'm31', kind: 'prop3', at: [-13.4, 0, 18.6], label: 'MACHINE 31', range: 1.7, cond: () => F3('dukeMet') && !F3('done8'), talk: () => machine31(), draw3: () => {} },
  { id: 'felt', kind: 'prop3', at: [5, 0, 7.6], label: 'BLACKJACK', range: 1.6, look: 'A BLACKJACK TABLE WITH NO DEALER. THE CARDS ARE OUT. SOMEONE WAS WINNING.' },
];
async function spurDoor() { await goScene('spur_floor', 0, 1.8, 0); if (!F3('floorSeen')) { setF3('floorSeen'); run(async () => { await say2([['CARL', 'It\'s loud. Nobody\'s here and it\'s loud. The machines are talking to each other.'], [U0, 'the carpet carl'], ['CARL', 'The carpet is a choice.']]); setObj3('Find the postal cage at the back', 'spur_floor', 'duke'); }); } }
// ---------------- the gatekeeper: whatever he says at the door is what he has to be inside ----------------
async function tinyTalk() {
  if (F3('spurIn')) return say(pick(['Have a nice night, sir. Night is all we have.', 'Mind the carpet. It\'s been like that since we opened.']), TY);
  if (F3('tinyTask') === 'roll') return say('Fifty in chips, or a win on Machine Zero. Then you\'re a player. Them\'s the rules. I didn\'t make them. I\'m too big to make rules.', TY);
  await say('THE DOORMAN IS THE SIZE OF A DOOR. HE IS STANDING IN FRONT OF A DOOR. IT IS HARD TO TELL WHICH ONE IS LOCKED.');
  for (;;) {
    const c = await claimMenu(TY, 'Players only, little fella. Who are you.', ['roller', 'maintenance', 'inspector', 'courier'], { stop: 8 });
    if (c === 'roller') {
      await say2([['CARL', 'I\'m a high roller. I roll high. I roll... up. I\'m from out of town.'], [TY, 'High rollers show a roll. Fifty in chips. House rule.']]);
      const p = await ask('SHOW TINY A ROLL? (YOU HAVE $' + C3.bux + ')', null, ['PAY $50 FOR CHIPS', 'WIN IT']);
      if (p === 0 && C3.bux >= 50) { C3.bux -= 50; sfx('get'); await say2([[TY, 'That\'s a roll. That\'s a small roll. Welcome to the Spur, sir.']]); finishAlibi('roller', 'SHOWED A ROLL'); return letIn(); }
      if (p === 0) await say('YOU DON\'T HAVE $50. TINY CAN TELL. TINY CAN ALWAYS TELL.');
      await say2([[TY, 'There\'s a machine out here for people waiting to get in. Machine Zero. Win on it and you\'re a player.'], ['CARL', 'What do I win?'], [TY, 'In.']]);
      setF3('tinyTask', 'roll'); const a = alibiOf('roller'); if (a) a.task = 'WIN ON MACHINE ZERO'; setObj3('Win on Machine Zero (by the door)', 'spur_lot', 'zero'); return;
    }
    if (c === 'maintenance') {
      await say2([['CARL', 'Maintenance. Slot maintenance. They called me. About a slot.'], [TY, 'Machine 31. Dead since \'97. Nobody can fix it and nobody\'s allowed to unplug it.'], ['CARL', 'Why not?'], [TY, 'Mavis.']]);
      setF3('tinyTask', 'm31'); const a = alibiOf('maintenance'); if (a) a.task = 'FIX MACHINE 31'; return letIn();
    }
    if (c === 'inspector') {
      await say2([['CARL', 'Gaming inspector. State of Nevada. I inspect the... odds.'], [TY, 'Inspectors come Tuesdays. It\'s Thursday.'], ['CARL', 'It\'s a surprise inspection. Surprise.']]);
      let r; do { r = await argue3({ id: 'tiny_badge', name: 'TINY', port: 'TINY', patience: 10, weak: { DENIAL: 2 }, atk: ['It\'s Thursday.', 'Inspectors wear a tie. You\'re wearing a hoodie.', 'I can see the parking lot from here. That\'s not a state car.'], hit: 1, hint: 'deny it. he wants a reason to stop thinking', win: 'Fine. FINE. Inspect something. Inspect 31. Everybody wants to.', open: 'HE IS SURE IT\'S THURSDAY.' }); } while (!r.win);
      setF3('tinyTask', 'm31'); const a = alibiOf('inspector'); if (a) a.task = 'INSPECT MACHINE 31'; return letIn();
    }
    await say2([['CARL', 'I\'m a courier. I have a delivery for the cage.'], [TY, 'Deliveries go round back. The back\'s been closed since a guy named Ricky.'], ['CARL', 'Who\'s Ricky?'], [TY, 'Don\'t ask about Ricky.']]);
    tickC('carl lie to the big man', U0);
  }
}
async function letIn() { setF3('spurIn'); sfx('door'); setObj3('Go inside', 'spur_lot', 'spur_door'); }
async function machineZero() {
  await say('MACHINE ZERO. A SIGN: "FIRST SPIN ON THE HOUSE." UNDER IT, SMALLER: "EVERY SPIN IS THE FIRST SPIN."');
  for (;;) {
    const ok = await slots('MACHINE ZERO', { speeds: [7, 6, 5] });
    if (ok) break;
    const c = await ask(pick(['NOTHING. THE MACHINE SAYS "SO CLOSE." IT SAYS THAT EVERY TIME.', 'NOTHING. A CHERRY LOOKS AT YOU.']), null, ['SPIN AGAIN', 'WALK AWAY']); if (c !== 0) return;
  }
  sfx('get'); await say2([['CARL', 'I won! Chat. Chat, I won. Did you see.'], [U0, 'we saw'], [TY, 'That\'s a win. You\'re a player. Don\'t tell anybody how small the win was.']]);
  finishAlibi('roller', 'WON ON MACHINE ZERO'); C3.bux += 5; await letIn();
}
// ---------------- the clerk ----------------
async function dukeTalk() {
  if (F3('done8')) return say(pick(['Go on, kid. The house always wins. Not tonight. Tonight it broke even.', 'If you see Mavis, tell her the seat\'s still hers.']), DK);
  if (F3('dukeMet')) return say(F3('m31fixed') ? 'It\'s lit. I can see it from here. Play it, kid. Three stamps. Don\'t ask me how I know it\'s stamps.' : 'Thirty-one. Back wall. It ate the card. Get it to give it back.', DK);
  setF3('dukeMet');
  await say2([[DK, 'Cage is closed. Cage is always closed. I\'m in it anyway.'], [DK, '...Short. Green. Box under the arm.'], ['CARL', 'I\'m a normal—'], [DK, 'Don\'t. I got the card. I got told. "He will tell you he is normal. Do not argue." I don\'t argue. I deal.']]);
  if (alibiOf('roller')) await say2([[DK, 'Tiny says you\'re a high roller.'], ['CARL', 'I roll high.'], [DK, 'You won five bucks on the machine we keep outside for kids.']]);
  await say2([[DK, 'Nineteen years ago two tall people sat down at my table. One hand of blackjack. They lost it on purpose. I know losing on purpose. It\'s my whole floor.'], [DK, 'They left me a card and they said, "The house keeps this until he comes."'], ['CARL', 'So stamp it.'], [DK, 'I can\'t. I don\'t have it.'], ['CARL', 'You lost the card?'], [DK, 'I bet the card. There\'s a difference. Losing is an accident.']]);
  await say2([[DK, 'Super Bowl, \'97. I bet Mavis the card against her whole cup. I said the Bills. Mavis said "the Bills never win." She was right. She\'s always right.'], [DK, 'She fed the card into Machine 31. For luck. The machine ate it, played one song and died. She\'s been in that seat ever since.'], ['CARL', 'Since 1997?'], [DK, 'She goes home to shower. She says the tall lady told her it would pay when the short one came.']]);
  addNote('DUKE: lost the card in a Super Bowl bet (1997). Mavis fed it into Machine 31. It died.');
  setObj3(F3('tinyTask') === 'm31' ? (alibiOf('inspector') ? 'Inspect Machine 31 (you said you would)' : 'Fix Machine 31 (you said you would)') : 'Fix Machine 31 (back wall)', 'spur_floor', 'm31');
}
async function mavisTalk() {
  if (F3('m31fixed')) return say(pick(['Don\'t look at me. Look at the machine. Three stamps, baby.', 'I\'m not playing it. If I play it and it doesn\'t pay I\'d have to go home. You play it.']), MV);
  if (!F3('dukeMet')) return say(pick(['This seat is taken. It\'s been taken since before your mother— well. Since a while.', 'Shoo. I\'m waiting.']), MV);
  await say2([[MV, 'He told you. Duke tells everybody. Duke\'s a talker for a man in a cage.'], [MV, 'The tall lady sat right here. She put a quarter in and she said, "When the short one comes, this pays." Then she didn\'t pull the lever. Who doesn\'t pull the lever?'], ['CARL', 'Somebody who wants it to wait.'], [MV, 'Well it waited. It died waiting. Fix it, sweetheart. I\'ll hold the seat.']]);
}
async function machine31() {
  if (!F3('m31fixed')) {
    await say('MACHINE 31. THE GLASS IS DARK. A PANEL ON THE SIDE IS HELD SHUT WITH A STRIP OF MASKING TAPE THAT SAYS "MAVIS."');
    const ok = await wires('MACHINE 31', 5); if (!ok) return say('THE MACHINE COUGHS UP A TOKEN FROM 1981 AND STAYS DEAD.');
    setF3('m31fixed'); relight(); sfx('power'); WX.shake = 10;
    finishAlibi('maintenance', 'FIXED MACHINE 31'); finishAlibi('inspector', 'INSPECTED MACHINE 31');
    await say('MACHINE 31 LIGHTS UP. IT PLAYS ONE SONG, THE SAME ONE IT PLAYED IN 1997, AND WAITS.');
    await say2([[MV, 'Oh. Oh, look at him. He remembers the song.'], [MV, 'Go on. Not me. You.']]);
    setObj3('Play Machine 31: three stamps', 'spur_floor', 'm31'); return;
  }
  for (;;) {
    const ok = await slots('MACHINE 31', { target: 'STAMP', speeds: [6, 5, 4] });
    if (ok) break;
    const c = await ask(pick(['NOT THREE STAMPS. MAVIS INHALES THROUGH HER TEETH.', 'TWO STAMPS AND A CACTUS. THE CACTUS LOOKS SORRY.']), null, ['PULL AGAIN', 'NOT YET']); if (c !== 0) return;
  }
  sfx('ring'); post.flash = .4; WX.shake = 20; tickC('JACKPOT', U0); tickC('JACKPOT', 'mallwalker'); await wait(6); post.flash = 0;
  await say('THREE STAMPS. THE MACHINE DOESN\'T PAY QUARTERS. IT PAYS ONE CARD, WARM, A LITTLE BENT: "A COURIER WILL COME. HE WILL BE SHORT." THEN IT PAYS QUARTERS. A LOT OF QUARTERS.');
  await say2([[MV, 'That\'s mine. The quarters. The card\'s yours. The quarters are mine.'], ['CARL', 'You can have them.'], [MV, 'Nineteen years. I\'m going home. I\'m going to sleep in a bed. I\'m going to get a cat.'], ['CARL', 'You don\'t have a cat?'], [MV, 'I\'ve been HERE.']]);
  setF3('mavisHome'); const e = ent3('mavis'); if (e) e.gone = 1;
  await say2([[DK, 'Well, I\'ll be. Bring it here, kid.']]);
  await say('DUKE TAKES THE CARD, READS IT, AND PUTS IT IN HIS SHIRT POCKET, BEHIND THE CIGARETTES HE DOESN\'T SMOKE ANYMORE.');
  const s = await ask('SIGN AT THE CAGE?', DK, ['SIGN', 'NOT YET']); if (s !== 0) { setObj3('Sign at the cage', 'spur_floor', 'duke'); setF3('spurSign'); return; }
  await spurStamp();
}
async function spurStamp() {
  await signature('FORWARD, SILVER SPUR'); C3.route[8] = 1;
  await say2([[DK, 'House stamp. First one I\'ve done in nineteen years that I didn\'t lose.'], [DK, 'And kid. A fella called last week asking if the short one had come through yet. From out on the E.T. Highway. He called collect.'], ['CARL', 'So?'], [DK, 'So mail people don\'t call collect. Mail people write.']]);
  addNote('STAMP: THE SILVER SPUR (DUKE). A man on the E.T. Highway called collect asking about the courier.');
  setF3('done8'); setF3('pendingCall8'); setObj3('Back to the ship', 'spur_lot', 'ass8');
}
SHIPCALL[8] = async () => {
  await say2([[DI, 'The Silver Spur stamp is on the tracker. And there\'s a lady on the line asking for "the short one who fixed 31." She wants you to know she got a cat.'], ['CARL', 'It\'s been an hour.'], [DI, 'She said she didn\'t want to waste any more time.']]);
  setRouteObj();
};
RADIOTALK['SPOOKY GHOST'][8] = async () => { await say2([[GH3, 'The Spur! Bro. I played the lounge there. Thursdays. Or I will. With a lounge it\'s hard to tell.'], ['CARL', 'You sang at a casino?'], [GH3, 'I sang at a casino and a woman in the third row cried. Every Thursday. Same woman. Different woman. It was always her.'], ['CARL', '...Linda?'], [GH3, 'Don\'t tell her.']]); };
RADIOTALK['CEO LINDA'][8] = async () => { await say2([[LI3, 'A casino is a mall that admits it.'], ['CARL', 'Admits what?'], [LI3, 'That the house wins. I respect it. I don\'t like it. I respect it.']]); };
CBTALK[8] = [['CH 19', '...that Spur\'s been playing the same song out of one machine since \'97... no, wait, it\'s playing a new one... breaker, the Spur has a new song...'], ['CH 19', '...white sedan parked across from the Spur all week. Not a gambler. Gamblers park crooked...']];
REVISIT[8] = async () => { if (F3('done8')) await say2([[TY, 'The player. Welcome back, sir. Same small roll?']]); };
// ---------------- SLOTS: press A to stop each reel. o.target = the symbol that must line up three times (any triple if not set) ----------------
const SLOTSYM = [['7', '#ff4949'], ['BAR', '#dbdbdb'], ['CHERRY', '#ff2470'], ['STAMP', '#24dbff'], ['CACTUS', '#6dff24'], ['BELL', '#ffd848']];
async function slots(title, o = {}) {
  const sp = o.speeds || [6, 5, 4], pos = [rnd(6), rnd(6), rnd(6)], stopped = [0, 0, 0], prev = scene; let cur = 0, t = 0, msg = '';
  const sym = i => SLOTSYM[((i % 6) + 6) % 6];
  scene = { update() { t++; for (let r = 0; r < 3; r++) if (!stopped[r] && t % sp[r] === 0) pos[r]++; }, draw() {
    prev.draw(); plate(56, 24, 208, 168, { alpha: .95 }); shadowText(title, 160 - title.length * 3, 32, UI3.name);
    text(o.target ? 'LINE UP THREE ' + o.target + 'S' : 'LINE UP ANY THREE', 160 - (o.target ? 15 + o.target.length : 17) * 3, 44, UI3.dim);
    for (let r = 0; r < 3; r++) { const x = 76 + r * 58; rectF(x, 58, 50, 90, hex('#0a0e24')); frameRect(x, 58, 50, 90, r === cur && !stopped[r] ? UI3.name : UI3.edge2);
      for (let k = -1; k <= 1; k++) { const s = sym(pos[r] + k), y = 92 + k * 28; if (k) { text(s[0], x + 25 - s[0].length * 3, y + 4, UI3.dim); continue; } rectF(x + 4, y - 2, 42, 18, hex(s[1])); text(s[0], x + 25 - s[0].length * 3, y + 4, BLACK); } }
    rectF(72, 87, 176, 1, hex('#ff49db')); rectF(72, 111, 176, 1, hex('#ff49db'));
    text(msg || (cur < 3 ? 'A: STOP REEL ' + (cur + 1) : ''), 160 - (msg || 'A: STOP REEL 1').length * 3, 160, UI3.text);
  } };
  DBG.mode = 'slots'; DBG.sl = { want: () => { if (cur >= 3) return false; const tg = o.target || (cur ? sym(pos[0])[0] : null); return !tg || sym(pos[cur])[0] === tg; } };
  while (cur < 3) { await nextFrame(); if (pressed.a || pressed.b) { stopped[cur] = 1; cur++; sfx('tick'); } }
  const s = pos.map(p => sym(p)[0]), win = s[0] === s[1] && s[1] === s[2] && (!o.target || s[0] === o.target);
  msg = win ? 'WIN!' : 'NO WIN'; await wait(50); DBG.mode = null; scene = prev; return win;
}
