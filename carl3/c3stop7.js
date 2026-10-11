'use strict';
// ================= CARL 3: ACT II, STOP 7: THE LITTLE GREEN INN, E.T. HIGHWAY =================
// a cafe, motel and UFO gift shop with a contract postal window. the clerk "VERN" only stamps for aliens.
// (the tells: federal blue ink, a crisp photocopy card, "the item", Bev's glasses, the sedan out back. none of it is said out loud.)
const ER = 'EARL', VN = 'VERN', DD = 'DODIE';
regStop(7, { name: 'THE LITTLE GREEN INN', scene: 'inn_lot', road: 'a cafe for people who stopped to look up', sky: ['#001208', '#1a4a2a'], ground: '#141c14' },
  { act: 2, hint: () => !F3('innIn') ? 'Earl on the bench guards the door. Believers only. Researchers by appointment. Locals by birth.' : !F3('vernMet') ? 'The postal window is at the back of the gift shop. Ask the man in the cardigan.' : !F3('done7') ? (F3('prove7') === 'rock' && !F3('rockGot') ? 'Fetch the test rock from the motel wing. Do not drop it. He will know.' : 'The recorder is on the counter. He wants one sentence.') : 'Pie, if Dodie has it. She usually has it.' });
CLAIMS.believer = { name: 'A BELIEVER', short: 'I\'M A BELIEVER', with: [] };
CLAIMS.researcher = { name: 'A RESEARCHER', short: 'I\'M A RESEARCHER', with: [] };
CLAIMS.local = { name: 'A LOCAL', short: 'I\'M A LOCAL', with: [] };
CLAIMS.alien = { name: 'AN ALIEN (ON TAPE)', short: 'I\'M AN ALIEN', with: [] };
regBust(ER, genBust({ skin: '#dbb692', hair: '#dbdb6d', top: '#6d6d24', cap: '#494910', beard: 1 }), '#b6ff49');
regBust(VN, genBust({ skin: '#f0e0c8', hair: '#b6b6b6', top: '#6d4924', glasses: 1, collar: '#e8e8e8' }), '#496dff');
regBust(DD, genBust({ skin: '#f0c8a8', hair: '#49b66d', hairStyle: 'big', top: '#49ff92', collar: '#ffffff' }), '#49ff92');
Object.assign(VOICE, { EARL: [500, 90], VERN: [340, 15], DODIE: [760, 80] });
Object.assign(PEOPLE, { earl: { top: '#6d6d24', bottom: '#49492a', cap: '#494910', beard: 1, hair: '#dbdb6d' }, vern: { top: '#6d4924', bottom: '#49403a', glasses: 1, hair: '#b6b6b6', hairStyle: 'short' }, dodie: { top: '#49ff92', bottom: '#49406d', apron: '#ffffff', hair: '#49b66d', hairStyle: 'big' } });
for (const k of ['earl', 'vern', 'dodie']) MODELS_P[k] = personModel(PEOPLE[k]);
// ---------------- scenes ----------------
// ---- the lot: green dusk, a sign missing letters, dolls by the door, a white sedan at the wing ----
(() => {
  const b = SB({ amb: [.3, .34, .3], sun: { dir: [-.5, .7, -.4], col: [.35, .45, .35] }, sky: ['#001208', '#1a4a2a'], stars: 1, fog: { col: '#0a2414', dens: .012 }, music: 'inn', title: 'THE LITTLE GREEN INN' });
  b.ground(200, 150, { col: '#a09468', tex: 'sand', ts: 4 }, 0, 20);
  b.add('plane:200:10', [0, .02, 2], { col: '#5a5a62', tex: 'asphalt', ts: 3 }); b.add('plane:200:.25', [0, .03, 7.2], { col: '#e8c850', emis: .1 });
  b.building(0, 36, 56, 12, 5, { col: '#d8e8c8', tex: 'stucco', ts: 4 }, { win: 6, door: { x: 0, w: 1.8, h: 2.6, col: '#205840' }, roofCol: '#24492a', sign: { col: '#49ff92', w: 12, h: 1.3 } });
  b.building(38, 22, 12, 18, 4.2, { col: '#c8d8b0', tex: 'stucco', ts: 3 }, { win: 3, roofCol: '#24492a' });           // the motel wing
  for (let i = 0; i < 3; i++) b.add('box:1.1:2.2:.1', [33.4, 0, 14 + i * 5], { col: '#305840', emis: .3 });              // its doors
  b.cyl(-13, 27, .3, 9, { col: '#505058' }, { solid: true, seg: 6 }); b.sign(-13, 8.6, 26.9, 9, 2.2, '#49ff92', { rad: 16, lz: -1.6 });   // the big sign
  for (let i = 0; i < 9; i++) { const a = i * .7, x = 2 + Math.cos(a) * 2.4, z = 26.2 + Math.sin(a) * 1.8; b.cyl(x, z, .18, .8, { col: '#49b66d' }, { seg: 6 }); b.add('sphere:.22:6:4', [x, .95, z], { col: '#49ff92', emis: .5 }); }   // the dolls by the door
  b.box(-6, 24.6, 2.6, 1, 1.8, { col: '#6d4924', tex: 'wood', ts: 2 }); for (let i = 0; i < 3; i++) b.add('box:.3:.5:.2', [-6.8 + i * .8, 2.6, 24.6], { col: '#49b66d', emis: .3 });   // the doll rack
  b.car(33, 8, .25, '#e8e8e8');                                                                                          // the white sedan
  b.car(-26, 18, .2, '#b64924'); b.car(18, 20, -.3, '#496db6');
  b.lamp(-8, 12, { h: 6, col: [.5, 1, .6] }); b.lamp(14, 10, { h: 6, col: [.5, 1, .6] }); b.lamp(30, 6, { h: 6, col: [1, .8, .5] });
  b.cactus(-36, 12, 3.2); b.cactus(40, 2, 2.4); b.box(-20, 6, 3, 1.4, 1.2, { col: '#8a7a6a', tex: 'stucco', ts: 2 });
  b.cyl(-31.5, 28.4, .12, 3.2, { col: '#8a8a92' }, { solid: true, seg: 6 }); b.add('box:2:.12:2', [-31.5, 3.1, 28.4], { col: '#d8d8e0', shiny: .6 }, { pitch: -.7 });   // the sky-watch array, round the side: a dish,
  b.add('box:.06:2.6:.06', [-30.6, 3.1, 28.4], { col: '#505058' }); b.add('box:.22:.5:.08', [-31.5, 3.7, 27.9], { col: '#f0f0ff', emis: .6 }, { pitch: -.7 });            // a CB whip, and a spoon
  b.walkRect(-38, 1, 30, 29.6); b.walkRect(28, 1, 38, 11.4);
  b.autoCams(-38, 1, 40, 30, 13, 10, 11, 9, .95);   // high and back: the old hand cameras sat inside their own zones
  SCENES.inn_lot = Object.assign(b.fin(), { start: [-34, 0, 4], arrive: [-34, 4, 1.5], shipExit: [-34, 4, 1.5],
    drawOver: () => { const sp = project(LIVE.cam, [-13, 8.6, 26.9]); if (sp && ((WX.t >> 5) % 5)) text('WEL OME EARTHLINGS', sp[0] - 60, sp[1] - 2, hex('#b6ff49'), BLACK); } });
})();
// ---- the gift shop: spinner racks, dolls, and the contract postal window at the back ----
(() => {
  const b = SB({ amb: [.32, .4, .34], sun: { dir: [.1, 1, -.3], col: [.28, .38, .3] }, sky: ['#001208', '#0a2414'], fog: { col: '#0a1a10', dens: .004 }, music: 'inn', title: 'GIFT SHOP & POSTAL WINDOW' });
  b.ground(24, 18, { col: '#b0c8a0', tex: 'tile', ts: 2, shiny: .3 }, 0, 8);
  const WL = { col: '#c8d8b8', tex: 'stucco', ts: 3 };
  b.box(0, 16.6, 24, .6, 4.6, WL); b.box(-12, 8, .6, 18, 4.6, WL); b.box(12, 8, .6, 18, 4.6, WL);
  b.box(5, 13, 10, 1, 1.1, { col: '#6d4924', tex: 'wood', ts: 2 }); b.box(5, 13, 10.2, .2, .08, { col: '#d8d0c0' }, { y: 1.1, solid: false });   // the counter
  b.sign(5, 3.4, 15.9, 8, .8, '#49ff92', { rad: 8 }); b.add('box:1.2:.8:.1', [9.4, 2.2, 15.6], { col: '#2058b0', emis: .5 });   // the postal window and its little blue eagle
  for (const x of [-8, -4]) { b.cyl(x, 5.4, .5, 1.7, { col: '#8a8a92', shiny: .4 }, { solid: true, seg: 8 }); b.box(x, 5.4, 1.2, 1.2, .5, { col: '#49ff92', emis: .2 }, { y: 1.7, solid: false }); }   // spinner racks
  for (let i = 0; i < 5; i++) { b.cyl(11.2, 4 + i * 2, .16, .7, { col: '#49b66d' }, { seg: 6 }); b.add('sphere:.2:6:4', [11.2, .85, 4 + i * 2], { col: '#49ff92', emis: .4 }); }   // the doll shelf
  b.box(-10.6, 12.4, 1.8, 1.2, 2, { col: '#6d4924', tex: 'wood', ts: 2 }); b.add('box:1.2:.8:.08', [-10.6, 1.1, 11.76], { col: '#ffd848', emis: .8 });   // the register shelf
  b.lights.push({ p: [0, 4, 6], col: [.7, 1, .8], rad: 16, int: 1.3 }, { p: [5, 3.2, 11.6], col: [.6, 1, .7], rad: 8, int: 1.2, glow: .8 }, { p: [-6, 3, 5], col: [1, .8, .5], rad: 7, int: .9 });
  b.walkRect(-11, 1, 11, 12.4); b.walkRect(1, 11.8, 5, 13.4);
  b.cam('west', [-5.5, 10, -11], [-5.5, 1.2, 9], 1.0, [-30, -30, 0, 30]); b.cam('east', [5.5, 10, -11], [5.5, 1.2, 9], 1.0, [0, -30, 30, 30]);   // the shop from the door side, in two halves
  SCENES.inn_shop = Object.assign(b.fin(), { start: [0, 0, 1.8] });
})();
// ---------------- the drive in, the arrival ----------------
DRIVELINES[7] = [[80, DI, 'State Route 375. The Extraterrestrial Highway. The state named it that officially, which means the state believes in something.'], [440, GA, 'Kid, a diner with a gift shop is a diner that saw something. Watch what the regulars watch.'], [800, 'CARL', 'Is this the one where I\'m normal? Am I normal here.'], [860, DI, 'You\'re a tourist everywhere, Carl. It\'s almost the same thing.']];
ARRIVE[7] = async () => {
  await say2([['CARL', 'It\'s green. The whole place is green. The sign is green, the dolls are green, the light is green.'], [U0, 'carl you are also green'], ['CARL', 'The LIGHT is green. I match the light. That\'s lighting.'], [DD, 'Welcome earthlings! Pie\'s cherry. Coffee\'s on. Sign says so. Almost says so.']]);
  setObj3('Get past Earl at the door', 'inn_lot', 'earl');
};
SCENES.inn_lot.ents = () => [
  shipDoor('ass7', -35, 4, 1.5),
  npc3('earl', 'earl', 3.4, 27.2, ER, () => earlTalk(), { yaw: Math.PI }),
  { id: 'inn_door', kind: 'prop3', to: 'inn_shop', at: [0, 0, 29.4], label: 'THE INN', range: 2.2, cond: () => F3('innIn'), talk: () => innDoor(), draw3: () => {} },
  npc3('dodie', 'dodie', -7, 22.4, 'DODIE', () => dodieTalk(), { yaw: Math.PI }),
  { id: 'antenna', kind: 'prop3', at: [-31.5, 0, 27.4], label: 'SKY-WATCH', range: 2.4, cond: () => F3('earlTask') === 'antenna' && !F3('antennaFixed'), talk: () => antennaFix(), draw3: () => {}, promptY: 1.6 },
  { id: 'sedan7', kind: 'prop3', at: [33, 0, 8], label: 'WHITE SEDAN', range: 2.6, look: 'A WHITE SEDAN, PARKED NEATLY AT THE MOTEL WING. NO DUST ON IT IN A DUSTY COUNTY. THE PLATE IS BLANK. THE MIRROR IS ANGLED AT THE GIFT SHOP DOOR.' },
  { id: 'mrock', kind: 'prop3', at: [35.4, 0, 9.4], label: 'A ROCK', range: 1.8, cond: () => F3('prove7') === 'rock' && !F3('rockGot'), talk: () => testRock(), draw3: e => { const sp = project(LIVE.cam, [e.p[0], .3, e.p[2]]); if (sp) { circF(sp[0], sp[1], 5, hex('#8a8a6d')); circF(sp[0] - 2, sp[1] - 1, 1, hex('#49ff92')); circF(sp[0] + 2, sp[1] - 1, 1, hex('#49ff92')); } } },
];
SCENES.inn_shop.ents = () => [
  { id: 'inn_out', kind: 'prop3', to: 'inn_lot', at: [0, 0, .9], label: 'OUTSIDE', range: 1.6, talk: () => goScene('inn_lot', 0, 26.6, Math.PI), draw3: () => {} },
  npc3('vern', 'vern', 3, 14.2, VN, () => vernTalk(), { yaw: Math.PI, range: 3.0 }),
  { id: 'recorder', kind: 'prop3', at: [2.2, 0, 12.5], label: 'RECORDER', range: 1.8, cond: () => F3('vernMet') && !F3('done7') && !(F3('prove7') === 'rock' && F3('rockGot')), talk: () => vernTalk(), draw3: e => { const sp = project(LIVE.cam, [2.2, 1.3, 12.5]); if (sp) { rectF(sp[0] - 6, sp[1] - 3, 12, 7, hex('#303038')); circF(sp[0] - 2, sp[1] + 1, 1.5, hex('#ff4949')); } } },
  { id: 'glasses', kind: 'prop3', at: [7.6, 0, 12.4], label: 'READING GLASSES', range: 1.8, look: 'READING GLASSES, FOLDED, ON A ROSE-COLORED CLOTH. A DUST RING AROUND THEM. THEY HAVE NOT MOVED IN A WHILE. A SIGN BEHIND THE COUNTER: "BEV: ON VACATION. BACK WHEN THE SKY\'S RIGHT."' },
  { id: 'inkpad', kind: 'prop3', at: [6.2, 0, 12.5], label: 'INK PAD', range: 1.6, look: 'THE STAMP\'S INK PAD. THE INK IS BLUE. A DEEP, OFFICIAL, FEDERAL BLUE. EVERY OTHER CLERK ON THIS ROUTE USED RED.' },
  { id: 'card7', kind: 'prop3', at: [4, 0, 12.6], label: 'THE CARD', range: 1.6, look: 'HIS CARD, PINNED BY THE WINDOW. CRISP. UNLAMINATED. THE CORNERS ARE SQUARE, LIKE IT CAME OFF A COPIER THIS MORNING. EVERY OTHER CARD ON THIS ROUTE WAS WORN SOFT AS FELT.' },
];
async function innDoor() { await goScene('inn_shop', 0, 1.8, 0); if (!F3('shopSeen')) { setF3('shopSeen'); run(async () => { await say2([['CARL', 'Dolls. Dolls everywhere. They\'re all looking at me. They have my eyes. That\'s a doll thing. Dolls have big eyes.'], [U0, 'the window carl']]); setObj3('The postal window, at the back', 'inn_shop', 'vern'); }); } }
async function dodieTalk() {
  if (F3('done7')) return say(pick(['Pie\'s still cherry. Pie\'s always cherry. It\'s the only honest thing on the menu.', 'Come back in spring. The light\'s better. The light\'s always green, but it\'s BETTER.']), DD);
  await say2([[DD, 'Sit anywhere. Except the window booth. That\'s Earl\'s. That\'s where he watches from.'], ['CARL', 'Watches what?'], [DD, 'The sky. The road. The sedan. Mostly the sedan.'], ['CARL', 'Whose sedan?'], [DD, 'Nobody\'s. That\'s the problem with it.']]);
  if (!F3('bevLine')) { setF3('bevLine'); await say2([[DD, 'You want the post window? That\'s Vern. He\'s been here three weeks. Sweet man. Cardigan man.'], ['CARL', 'Three weeks? Where\'s the regular clerk?'], [DD, 'Bev? On vacation. Her first in nineteen years. She left her glasses, which is how you know she meant to come back. She wouldn\'t say that about the glasses. I\'m saying it.']]); addNote('DODIE: Bev, the real clerk, is "on vacation." Her first in 19 years. Her glasses are still on the counter.'); }
}
// ---------------- the gatekeeper: believers only, and he believes HARD ----------------
async function earlTalk() {
  if (F3('innIn')) return say(pick(['Sky\'s quiet tonight. Quiet isn\'t empty. Remember that.', 'I\'ve been on this bench eleven years. The bench believes in me more than my wife did.']), ER);
  if (F3('earlTask') === 'antenna') return say('The sky-watch array, round the side. Calibrate it and you\'re a researcher. Red wire\'s hot. They\'re all hot. It\'s a hot-wire situation.', ER);
  await say('A MAN ON A BENCH WEARS A CAP WITH A HAND-LETTERED WORD ON IT. THE WORD IS "AWAKE." HE LOOKS AT CARL\'S FOREHEAD FIRST, LIKE IT MIGHT ANSWER.');
  for (;;) {
    const c = await claimMenu(ER, 'The window\'s past me, and past me is earned. Who are you?', ['believer', 'researcher', 'local', 'courier'], { stop: 7 });
    if (c === 'believer') {
      await say2([['CARL', 'I\'m a believer. I believe. In... it. All of it.'], [ER, 'Then answer the question every believer answers. What do they want?']]);
      DBG.truth = 0; const a = await ask('WHAT DO THEY WANT?', ER, ['TO BE ASKED', 'TO BE LEFT ALONE', 'PEACHES']); DBG.truth = undefined;
      if (a === 2) await say2([[ER, 'Peaches. Ha. HA. That\'s the deep answer. Most people need years on the bench for the peach answer.'], ['CARL', 'It was the first thing I—'], [ER, 'It\'s always the first thing. That\'s how you know it\'s true.']]);
      else await say2([[ER, a === 0 ? '"To be asked." Nineteen years and that\'s still the best answer. They came all this way and nobody asked them anything.' : '"To be left alone." The sad answer. The right one, probably. Everything that travels far wants to be met, and everything that\'s met wants quiet.'], [ER, 'You believe fine. Go on in.']]);
      finishAlibi('believer', 'ANSWERED THE QUESTION'); return innLetIn();
    }
    if (c === 'researcher') {
      await say2([['CARL', 'I\'m a researcher. I research. Sky things. Phenomena. I have a methodology. It\'s in the ship.'], [ER, 'Then you can calibrate my sky-watch array. Round the side. It\'s heard something three Tuesdays running and I won\'t have it misheard a fourth.']]);
      setF3('earlTask', 'antenna'); const a = alibiOf('researcher'); if (a) a.task = 'CALIBRATE THE SKY-WATCH ARRAY'; setObj3('Calibrate the sky-watch array (round the side)', 'inn_lot', 'antenna'); return;
    }
    if (c === 'local') {
      await say2([['CARL', 'I\'m local. From just up the road. The green part.'], [ER, 'I know everybody from here to the Warm Springs summit. I am AWAKE, son. I see people.'], ['CARL', 'There\'s a lot of road.'], [ER, 'There is exactly the right amount of road and I know everybody on it.']]);
      let r; do { r = await argue3({ id: 'earl_local', name: ER, port: ER, patience: 10, weak: { RANT: 2 }, atk: ['The mailman knows everybody. You\'re not the mailman.', 'Locals wave first. Let me see you wave first.', 'You have out-of-state eyes. Both of them.'], hit: 1, hint: 'talk. a researcher of people respects a full briefing', win: 'Okay. OKAY. Maybe you\'re the new local. The road grows people now. Fine. In.', open: 'HE SQUINTS AT CARL THE WAY A MAN READS A CLOUD.' }); } while (!r.win);
      finishAlibi('local', 'ARGUED HIS WAY INTO THE LOCAL LEDGER'); return innLetIn();
    }
    await say2([['CARL', 'I\'m a courier. I have a delivery for the postal window.'], [ER, 'We don\'t get MAIL, son. We get visitors. Mail is how they track you. This is a clean county.'], ['CARL', 'There\'s a contract postal window right there.'], [ER, 'And there\'s a man in it, and if he wants a thing, the thing walks past me. That\'s the arrangement. I don\'t argue with the window.']]);
    tickC('carl the truth worked again??', U0); await say('EARL LOOKS AT THE WINDOW LIKE IT OWES HIM AN EXPLANATION. THEN HE WAVES CARL THROUGH ANYWAY.', null);
    return innLetIn();
  }
}
async function innLetIn() { setF3('innIn'); sfx('door'); setObj3('Go inside, to the postal window', 'inn_lot', 'inn_door'); }
async function antennaFix() {
  await say('THE SKY-WATCH ARRAY: A DISH MADE OF A SATELLITE DISH, A CB WHIP, AND A SPOON, ALL POINTED AT ONE PATCH OF NOTHING. FOUR WIRES COME OUT OF THE SPOON.');
  const ok = await wires('SKY-WATCH ARRAY', 4); if (!ok) return say('THE SPOON HUMS A CHORD AND GOES QUIET. EARL, FROM THE BENCH, WITHOUT TURNING: "MISHEARD IT."');
  setF3('antennaFixed'); finishAlibi('researcher', 'CALIBRATED THE SKY-WATCH ARRAY'); C3.bux += 10; sfx('get');
  await say2([[ER, 'There it is. Three Tuesdays. You know what it\'s saying now, calibrated? Nothing. Beautiful nothing. That\'s data.'], ['CARL', 'I fixed it so it hears nothing?'], [ER, 'I FIXED it so it hears EXACTLY nothing. You\'re a researcher. Go on in.']]);
  innLetIn();
}
async function testRock() {
  if (F3('prove7') !== 'rock' || F3('rockGot')) return say('A ROCK WITH A FACE DRAWN ON IT IN MARKER. THE FACE IS GREEN. THE ROCK SEEMS PROUD OF IT.');
  setF3('rockGot'); sfx('get');
  await say('THE TEST ROCK. FIFTY POUNDS OF GRANITE WITH A FACE DRAWN ON IT IN GREEN MARKER. A LABEL UNDER THE FACE: "NOT FROM HERE."');
  await say2([['CARL', 'It\'s heavy. Chat, it\'s a heavy rock. Why is the alien rock heavy. Shouldn\'t it be light.'], [U0, 'carl bring vern the rock']]);
  setObj3('Bring Vern the rock', 'inn_shop', 'vern');
}
// ---------------- the clerk: the cassette recorder on the counter ----------------
async function vernTalk() {
  if (F3('done7')) return say(pick(['Window\'s closed. Window\'s mostly closed. Window\'s closed in spirit.', 'The newsletter thanks you for your contribution. The newsletter is grateful.']), VN);
  if (F3('prove7') === 'rock' && !F3('rockGot')) return say('The rock. The motel wing. I\'ll wait. I have a stool. Waiting is most of this job.', VN);
  if (F3('prove7') === 'rock' && F3('rockGot') && !F3('rockDone')) return vernStamp();
  if (!F3('vernMet')) {
    setF3('vernMet');
    await say2([[VN, 'Postal window. Contract unit. Stamp, weigh, record.'], [VN, '...Short. Box under the arm. Hmm. Yes.'], ['CARL', 'I\'m a normal—'], [VN, 'I don\'t need that. What I need is on the card. It says a courier comes. It says do not argue. My version says: DO NOT ARGUE. RECORD.'], ['CARL', 'That\'s not what the cards say.'], [VN, 'This one does. It\'s crisp. Crisp cards are current cards.']]);
    await say2([[VN, 'The item. Set the item on the scale that isn\'t a scale.'], ['CARL', 'It\'s a parcel. It\'s addressed to me. I\'m just following the route on the stamps.'], [VN, 'The item. The scale. Thank you.'], [VN, 'Here\'s the arrangement, and it\'s the arrangement because the card says so. This window stamps for aliens. Only. It\'s a... newsletter policy.'], ['CARL', 'It stamps for ALIENS.'], [VN, 'Correct. And it\'s a policy I take seriously, so I\'ll need it on tape.']]);
  }
  await say('HE SLIDES A CASSETTE RECORDER ACROSS THE COUNTER. THE PLAY AND RECORD BUTTONS ARE ALREADY DOWN TOGETHER. A LITTLE RED LIGHT IS PATIENT.');
  DBG.truth = 0; const a = await ask('"FOR THE NEWSLETTER," HE SAYS. "SAY: I AM AN ALIEN."', VN, ['I\'M AN ALIEN.', 'I\'M A NORMAL HUMAN FROM NEVADA.']); DBG.truth = undefined;
  if (a === 0) return vernConfess();
  await say2([['CARL', 'I\'m a normal human from Nevada. I have a normal job. This is a normal box.'], [VN, '...Hm.'], [VN, 'Hm! Then you\'re in luck, because the policy has a clause. A non-alien may be stamped if they are demonstrably NOT FROM HERE.'], ['CARL', 'I\'m FROM here. That\'s the whole—'], [VN, 'Not from HERE here. The Inn. Route 375. The county. Prove you\'re not local, and I\'ll stamp you as a... as a visiting terrestrial. It\'s a lesser category. The paperwork is the same.']]);
  setF3('prove7', 'rock'); setObj3('Fetch the test rock (motel wing, out front)', 'inn_lot', 'mrock');
  await say2([[VN, 'The motel wing keeps a test rock. Green face, fifty pounds. Bring it here without dropping it, and I\'ll know the county didn\'t raise you.'], ['CARL', 'That\'s the test? A rock?'], [VN, 'Locals leave the rock alone. It\'s a local courtesy. You break the courtesy, you\'re a local. Bring me the rock.']]);
}
async function vernConfess() {
  setF3('confessed'); sfx('static'); await wait(20);
  await say('"I\'M AN ALIEN." THE RECORDER CLICKS. IT ONLY NEEDED FOUR SECONDS AND IT TOOK ALL OF THEM.');
  tickC('HE SAID IT', 'user_000'); tickC('REWIND IT. PLAY IT BACK.', 'alienFACTS'); tickC('carl???', 'propPillsFan');
  await say2([['CARL', '...I said it. I said it out loud. Into a machine.'], [U0, 'say it again'], ['CARL', 'No. Once is a recording. Twice is a hobby.'], [VN, 'Beautiful. Clear diction. The newsletter will be pleased.'], ['CARL', 'I\'ve never said it. Out loud. To a machine, to anyone. I\'ve said the OTHER thing nine hundred times.'], [U0, 'how does it feel'], ['CARL', 'It feels like putting down a box I forgot I was carrying. I don\'t like it. I don\'t NOT like it.']]);
  return vernStamp();
}
async function vernStamp() {
  if (F3('prove7') === 'rock' && F3('rockGot') && !F3('rockDone')) {
    setF3('rockDone');
    await say('CARL SETS FIFTY POUNDS OF GRANITE ON THE COUNTER. THE FACE ON THE ROCK AND THE FACE ON THE MAN REGARD EACH OTHER.');
    await say2([[VN, 'You brought the rock. You didn\'t drop it. A local wouldn\'t have touched it. A tourist would\'ve taken a picture OF it. You CARRIED it. That\'s a courier. That\'s a... visiting terrestrial, stamp-wise.'], ['CARL', 'I carried a rock for a stamp.'], [VN, 'Everybody carries something for a stamp. Most people carry mail. It\'s all weight.']]);
  }
  await say2([[VN, 'Sign the ledger. Press hard. Third copy goes to the newsletter.'], ['CARL', 'What\'s the newsletter called?'], [VN, 'It\'s called the Newsletter. We keep it simple here.']]);
  await signature('FORWARD, LITTLE GREEN INN'); C3.route[7] = 1; setF3('fakeStamp7');
  await say('THE STAMP COMES DOWN. THE INK IS BLUE. IT DRIES INSTANTLY, THE WAY INK DRIES WHEN IT WAS MADE SOMEWHERE WITH LAWYERS.');
  await say2([[VN, 'Forwarded. Safe travels. The highway watches. Watch it back.'], ['CARL', 'Do I get a copy for the newsletter?'], [VN, 'The newsletter finds its own. It always has.']]);
  addNote('STAMP: THE LITTLE GREEN INN ("VERN"). Blue ink. "Do not argue. Record." Bev is on vacation.');
  setF3('done7'); setF3('pendingCall7'); setObj3('Back to the ship', 'inn_lot', 'ass7');
}
SHIPCALL[7] = async () => {
  await say2([[DI, 'Inn stamp is on the tracker. The scan came back a little odd. Ink reads blue. Route ink reads red. Could be the scanner.'], ['CARL', 'Maybe his pad is just blue.'], [DI, 'Maybe. And a fella at the county relay asked if "the Inn took the recording yet." Present tense. Like it was scheduled.'], ['CARL', 'Newsletter people keep schedules.']]);
  setRouteObj();
};
RADIOTALK.DISPATCH[7] = async () => { await say2([[DI, 'The E.T. Highway. Official name. There\'s a form for naming a road that, Carl. Somebody filled it out. Somebody stamped it. Everything is mail if you\'re brave.']]); };
RADIOTALK['JB GARFIELD'][7] = async () => { await say2([[GA, 'A man in a cardigan at a counter, asking for a kid\'s voice on tape. Kid, in my line that\'s not a clerk. That\'s a deposition.'], ['CARL', 'He\'s a fan. It\'s a newsletter.'], [GA, 'Newsletters don\'t need your voice, kid. Courts do. Radios do it for free.']]); };
RADIOTALK['SPOOKY GHOST'][7] = async () => { await say2([[GH3, 'A theremin lounge. Bro. I PLAYED a room like that. The room believed in me more than the people did. Rooms are the honest audience.'], ['CARL', 'Did anyone else come?'], [GH3, 'The room. We\'ve been over this. The room came. Every night, full. Walls standing room only.']]); };
RADIOTALK['CEO LINDA'][7] = async () => { await say2([[LI3, 'A gift shop monetizing belief. No overhead, no stock rotation, one product forever. It\'s a beautiful little machine.'], ['CARL', 'The product is dolls.'], [LI3, 'The product is "you were right to stop." That product never spoils.']]); };
CBTALK[7] = [['CH 19', '...that green diner on 375, the pie\'s honest and the clerk\'s new. New clerks make me itch...'], ['CH 19', '...white sedan at the Inn all month. Parked like it gets paid by the hour. Nobody\'s ever in it. Everybody\'s always near it...'], ['CH 19', '...if you see the dolls move, that\'s the wind, breaker. That\'s been ruled wind...']];
REVISIT[7] = async () => {
  if (F3('done7')) await say2([[DD, 'Back already? Sit anywhere but the window booth.'], [ER, F3('confessed') ? 'The recorder came out fine, by the way. Clear as a bell.' : 'You again. Regulars. That\'s how it starts.']]);
};
