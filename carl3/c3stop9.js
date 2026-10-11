'use strict';
// ================= CARL 3: ACT II, STOP 9: LAKE TAHOMA LODGE =================
// the only snow in the game. the clerk was WALT; he died two winters ago. JUNE, his widow, keeps his card.
// this is the sad stop. the joke is inside the sadness: he practiced "do not argue" and she did the replies.
const CH = 'CHIP', JU = 'JUNE';
regStop(9, { name: 'LAKE TAHOMA LODGE', scene: 'lodge_lot', road: 'a lodge on a frozen lake, at night, in June', sky: ['#243049', '#92a2b6'], ground: '#d8dce4' },
  { act: 2, hint: () => !F3('lodgeIn') ? 'Chip on the porch runs the night. He wants to know who walks in.' : !F3('juneMet') ? 'The mail desk is inside, west wall. The name on it is not hers.' : !F3('clockFixed') ? 'The cuckoo clock over the desk. Broken a year. It was set for you.' : !F3('done9') ? 'June is deciding. Stand with her at the desk.' : 'The fire is going. It stays going.' });
CLAIMS.guest = { name: 'A GUEST', short: 'I\'M A GUEST', with: [] };
CLAIMS.instructor = { name: 'THE SKI INSTRUCTOR', short: 'I\'M THE SKI INSTRUCTOR', with: [] };
CLAIMS.boiler = { name: 'THE BOILER MAN', short: 'I\'M THE BOILER MAN', with: ['maintenance'] };
regBust(CH, genBust({ skin: '#f0c8a8', hair: '#ffd848', top: '#c22424', cap: '#e8e8e8', collar: '#ffffff' }), '#ff9a3a');
regBust(JU, genBust({ skin: '#e8c8b0', hair: '#dbdbdb', hairStyle: 'big', top: '#6d496d', glasses: 1 }), '#b69aff');
Object.assign(VOICE, { CHIP: [640, 60], JUNE: [700, 25] });
Object.assign(PEOPLE, { chip: { top: '#c22424', bottom: '#30405a', cap: '#e8e8e8', hair: '#ffd848', k: .85 }, june: { top: '#6d496d', bottom: '#493a49', hair: '#dbdbdb', hairStyle: 'big', glasses: 1, k: .92 } });
for (const k of ['chip', 'june']) MODELS_P[k] = personModel(PEOPLE[k]);
// new road furniture for the drive down the hill
Object.assign(OBS, { pine: { w: 1.2, m: 'cyl:1.3:3:7:0', col: [32, 92, 64], y: 0 }, snowman: { w: .9, m: 'sphere:.75:6:5', col: [240, 240, 245], y: .5 }, ice: { w: .55, m: 'plane:2.2:2.2', col: [200, 220, 240], y: .02 } });
// ---------------- scenes ----------------
// ---- the shore: snow, pines, the frozen lake east, the lodge lit gold ahead ----
(() => {
  const b = SB({ amb: [.42, .46, .56], sun: { dir: [-.4, .8, -.4], col: [.5, .55, .68] }, sky: ['#243049', '#92a2b6'], moon: { p: [40, 44, 100], r: 8 }, fog: { col: '#b6c8db', dens: .018 }, music: 'lodge', title: 'LAKE TAHOMA LODGE' });
  b.ground(220, 150, { col: '#d8dce4', tex: 'concrete', ts: 5 }, 0, 20);
  b.add('plane:56:26', [0, .015, 10], { col: '#c8ccd4', tex: 'asphalt', ts: 3, shiny: .2 });   // the drive, plowed once
  b.ground(80, 56, { col: '#a8bcd8', shiny: .75 }, 62, 14, .02);                              // the frozen lake
  b.box(0, 30, 44, 14, 6.5, { col: '#6d5a3a', tex: 'wood', ts: 4 }); b.box(0, 30, 46, 16, .8, { col: '#e8ecf4' }, { y: 6.5, solid: false });   // the lodge, snow on the roof
  b.box(-12, 34, 4, 4, 9.5, { col: '#8a6a5a', tex: 'brick', ts: 3 });                           // the chimney, still going
  for (let i = 0; i < 7; i++) b.add('box:1.4:1.6:.1', [-18 + i * 6, 1.8, 22.9], { col: '#ffca5a', emis: .8, shiny: .3 });   // its windows, all lit
  b.add('box:2.2:2.8:.14', [0, 0, 22.9], { col: '#5a3a20', emis: .25 });                       // the door
  b.canopy(0, 20, 14, 6, 3.4, '#b64924');
  b.box(40, 12, 2.4, 11, .3, { col: '#6d5a3a', tex: 'wood', ts: 2 }, { y: .1, solid: false });  // the dock out onto the ice
  const pine = (x, z, h) => { b.cyl(x, z, .22, h * .3, { col: '#4a3428' }, { solid: true, seg: 6 }); b.add('cyl:' + (h * .5) + ':' + (h * .7) + ':7:0', [x, h * .3, z], { col: '#205c40' }); b.add('cyl:' + (h * .3) + ':' + (h * .3) + ':7:0', [x, h * .75, z], { col: '#e8ecf4' }); };
  pine(-34, 20, 4.4); pine(30, 24, 3.6); pine(-33, -2, 3.2); pine(52, 26, 4.2); pine(-44, 12, 3.8); pine(46, 2, 3);
  b.cyl(16, 12, .5, 1, { col: '#e8e8e8' }, { seg: 7 }); b.add('sphere:.32:6:4', [16, 1.3, 12], { col: '#e8e8e8' }); b.add('box:.06:.5:.06', [16, 1.5, 11.7], { col: '#ff8a30', emis: .8 });   // the snowman, carrot pointed at the lake
  b.box(-6, 18.2, 3, .4, .8, { col: '#8a8a92' }); for (let i = 0; i < 3; i++) b.add('box:.14:2:.14', [-7 + i * 1, .8, 18.2], { col: '#30508a' });   // the ski rack, empty since '04
  b.cyl(-20, 8, .2, 3.4, { col: '#8a8a92' }, { solid: true, seg: 6 }); b.add('cyl:.7:.3:8:.7', [-20, 3.6, 8], { col: '#6d6d76' });                 // the tow rope wheel
  b.lamp(-10, 6, { h: 6, col: [1, .8, .5], rad: 12 }); b.lamp(12, 4, { h: 6, col: [1, .8, .5], rad: 12 }); b.lamp(-24, 14, { h: 6, col: [.8, .9, 1] });
  b.walkRect(-30, 1, 26, 22.5); b.walkRect(24, 1, 36, 14); b.walkRect(34, 4, 48, 18);
  b.autoCams(-30, 1, 50, 23, 13.4, 11, 11, 9, .95);   // high and back: the old hand cameras sat inside their own zones
  SCENES.lodge_lot = Object.assign(b.fin(), { start: [-26, 0, 4], arrive: [-26, 4, 1.5], shipExit: [-26, 4, 1.5],
    drawOver: () => { for (let i = 0; i < 80; i++) { const sp = .5 + (i % 4) * .3, x = (i * 53 + WX.t * sp * .5) % W, y = (i * 29 + WX.t * sp) % H; pset(x, y, WHITE); if (i % 3 === 0) pset((x + 2) % W, y + 1, hex('#e8ecf4')); } } });
})();
// ---- the great hall: fire, couches, the mail desk, the cuckoo clock ----
(() => {
  const b = SB({ amb: [.4, .34, .3], sun: { dir: [.3, 1, -.2], col: [.3, .22, .16] }, sky: ['#141824', '#243049'], fog: { col: '#1a1410', dens: .004 }, music: 'lodge', title: 'THE GREAT HALL' });
  b.ground(28, 19, { col: '#6d5a4a', tex: 'wood', ts: 2, shiny: .25 }, 0, 9.5);
  const WL = { col: '#c8b8a0', tex: 'wood', ts: 3 };
  b.box(0, 18.6, 28, .6, 5, WL); b.box(-13.6, 9.5, .6, 19, 5, WL); b.box(13.6, 9.5, .6, 19, 5, WL);
  b.box(11, 8, 4, 6, 4.4, { col: '#8a6a5a', tex: 'brick', ts: 3 }); b.add('box:.4:1.3:1.6', [8.85, .45, 8], { col: '#ff9a30', emis: 1 });   // the fireplace, its fire on the face toward the couches
  b.box(11, 8, 3, 6, 1.4, { col: '#8a6a5a', tex: 'brick', ts: 3 }, { y: 4.4 }); b.box(11, 8, 1, 6, 5.2, { col: '#8a6a5a', tex: 'brick', ts: 3 }, { y: 4.4 });
  b.add('plane:8:6', [6, .02, 8], { col: '#7a2a3a', tex: 'carpet', ts: 1 });                       // the rug
  b.box(-4, 6.4, 3.4, 1.4, 1, { col: '#5a3a4a', tex: 'wood', ts: 1 }); b.box(-4, 9.6, 3.4, 1.4, 1, { col: '#5a3a4a', tex: 'wood', ts: 1 });   // two couches facing the fire
  b.box(-11, 13.5, 5, 2, 1.1, { col: '#6d4924', tex: 'wood', ts: 2 });                              // THE MAIL DESK
  for (let i = 0; i < 8; i++) b.add('box:.6:.6:.5', [-13.2, 1.6, 11.6 + (i % 2) * .7], { col: '#8a6a48' }); b.add('box:.7:2:.3', [-11.5, 2, 16.8], { col: '#3a2a1a' });   // its pigeonholes and lamp
  b.add('box:1.1:1.3:.5', [2, 2.6, 18.2], { col: '#b6923a' }); b.add('box:.5:.5:.1', [2, 2.7, 17.94], { col: '#241c10' }); b.add('box:.16:.24:.1', [2, 3.34, 17.96], { col: '#c22424' });   // the cuckoo clock and its door
  b.add('box:.7:1.4:.1', [-4, 2, 18.3], { col: '#496db6', emis: .4, shiny: .4 }); b.add('box:.7:1.4:.1', [6, 2, 18.3], { col: '#496db6', emis: .4, shiny: .4 });   // windows, night blue
  b.box(6, 2, 3, 2.4, 1, { col: '#5a4a3a', tex: 'wood', ts: 1 });                                    // the check-in desk, guestless
  b.lights.push({ p: [11, .9, 8], col: [1, .55, .2], rad: 10, int: 1.5, glow: 1.4 }, { p: [0, 4.4, 8], col: [.85, .7, .5], rad: 20, int: .9 }, { p: [-11.5, 2.6, 15], col: [1, .8, .5], rad: 6, int: 1.3, glow: .8 }, { p: [2, 3.6, 16], col: [1, .75, .4], rad: 5, int: .8 });
  b.walkRect(-13, 1, 13, 17.4);
  b.cam('west', [-6.5, 9, -8], [-6.5, .8, 7], 1.0, [-14, -10, 0, 20]); b.cam('east', [6.5, 9, -8], [6.5, .8, 7], 1.0, [0, -10, 14, 20]);
  b.cam('nook', [-2, 8, 14], [11, .8, 13], 1.0, [7, 11, 14, 20]);   // behind the fireplace, seen past its corner   // the room from the open side, in two halves
  SCENES.lodge_hall = Object.assign(b.fin(), { start: [0, 0, 1.8] });
})();
// ---- the lost and found, which is also where the boiler lives ----
(() => {
  const b = SB({ amb: [.3, .26, .24], sun: { dir: [.2, 1, -.2], col: [.22, .18, .14] }, sky: ['#141824', '#1a1a24'], fog: { col: '#141210', dens: .006 }, music: 'lodge', title: 'LOST & FOUND' });
  b.ground(9, 7, { col: '#5a5048', tex: 'wood', ts: 2 }, 0, 3.5);
  b.box(0, 6.4, 9, .5, 3.4, { col: '#8a7a6a', tex: 'stucco', ts: 2 }); b.box(-4.6, 3, .5, 7, 3.4, { col: '#8a7a6a', tex: 'stucco', ts: 2 }); b.box(4.6, 3, .5, 7, 3.4, { col: '#8a7a6a', tex: 'stucco', ts: 2 });
  b.box(-3.4, 4.4, 1.6, 4.6, 2.6, { col: '#6d5a4a', tex: 'wood', ts: 2 }); for (let i = 0; i < 4; i++) b.add('box:1.2:.5:.7', [-3.4, 1 + i * .6, 3 + (i % 2)], { col: ['#8a6a48', '#a08a68'][i % 2] });   // shelves of nobody's things
  b.cyl(2.8, 4.4, .8, 1.9, { col: '#6d6d76', tex: 'metal', ts: 2 }, { solid: true, seg: 9 }); b.add('cyl:.12:1.4:6', [2.2, 2, 4.4], { col: '#8a8a92' }); b.add('cyl:.12:1:6', [3.4, 1.6, 4.4], { col: '#8a8a92' });   // the boiler, in the corner, apologizing
  b.box(-1, 1.6, 1.2, 1, .8, { col: '#8a6a48' }); b.add('box:.5:.4:.5', [-1, .9, 1.6], { col: '#a08a68' });
  b.lights.push({ p: [0, 3, 3.4], col: [1, .8, .55], rad: 9, int: 1.1 }, { p: [2.8, 2.4, 4], col: [1, .5, .25], rad: 5, int: .9, glow: 1 });
  b.walkRect(-3.4, 1, 3.4, 5.4);
  b.cam('cl', [0, 5.5, -3], [0, 1.4, 3.6], 1.0, [-20, -20, 20, 20]);
  SCENES.lodge_closet = Object.assign(b.fin(), { start: [0, 0, 1.4] });
})();
// ---------------- the drive in, the arrival ----------------
DRIVELINES[9] = [[90, DI, 'Lake Tahoma. Elevation high, season permanent. The road up closes in October and opens in April, so drive like it\'s June, because it is.'], [500, GA, 'Kid, lodges at night are the loneliest light on a dark road. Somebody keeps that fire on. Find out who.'], [860, 'CARL', 'It\'s snowing. Chat, it\'s JUNE.'], [920, DI, 'It\'s always winter somewhere, Carl. Deliver the mail.']];
ARRIVE[9] = async () => {
  await say2([['CARL', 'Snow. Real snow. I haven\'t seen snow since— I haven\'t seen snow. It\'s coming down like it\'s trying to cover something up.'], [U0, 'carl catch one'], ['CARL', 'It disappeared. It knows something about me and it disappeared.'], [CH, 'Dude! You came DOWN that road? In that? What ARE you?']]);
  setObj3('Get past the ski patrol on the porch', 'lodge_lot', 'chip');
};
SCENES.lodge_lot.ents = () => [
  shipDoor('ass9', -27, 4, 1.5),
  npc3('chip', 'chip', 3.2, 19.4, CH, () => chipTalk(), { yaw: Math.PI }),
  { id: 'lodge_door', kind: 'prop3', to: 'lodge_hall', at: [0, 0, 22.4], label: 'THE LODGE', range: 2.2, cond: () => F3('lodgeIn'), talk: () => lodgeDoor(), draw3: () => {} },
  { id: 'towrope', kind: 'prop3', at: [-20, 0, 6.4], label: 'TOW ROPE', range: 2.4, cond: () => F3('chipTask') === 'instructor' && !F3('skiDone'), talk: () => skiRun(), draw3: () => {} },
  { id: 'snowman', kind: 'prop3', at: [16, 0, 12], label: 'SNOWMAN', range: 2.4, look: 'A SNOWMAN WITH A FRESH CARROT. THE CARROT POINTS AT THE LAKE. EVERY WEEK SOMEBODY REPLACES IT. NOBODY ADMITS TO IT. THE SNOWMAN KNOWS.' },
  { id: 'dock9', kind: 'prop3', at: [40, 0, 12], label: 'THE DOCK', range: 2.6, look: 'THE DOCK GOES OUT ONTO THE ICE. THE ICE HOLDS. WHATEVER IS UNDER IT IS PATIENT.' },
];
SCENES.lodge_hall.ents = () => [
  { id: 'hall_out', kind: 'prop3', to: 'lodge_lot', at: [0, 0, .9], label: 'OUTSIDE', range: 1.6, talk: () => goScene('lodge_lot', 0, 20.6, Math.PI), draw3: () => {} },
  npc3('june', 'june', -9.4, 15.6, JU, () => juneTalk(), { yaw: Math.PI, range: 2.6 }),
  { id: 'clock', kind: 'prop3', at: [2, 0, 17.2], label: 'CUCKOO CLOCK', range: 2.2, promptY: 1.5, talk: () => clockTalk(), draw3: () => {} },
  { id: 'slippers', kind: 'prop3', at: [-12.6, 0, 12.6], label: 'SLIPPERS', range: 1.8, look: 'A PAIR OF WOOL SLIPPERS UNDER THE MAIL DESK, TOES POINTED AT THE CHAIR. THE CHAIR IS EMPTY. THE SLIPPERS STAY. SHE MOVES THEM TO SWEEP AND PUTS THEM BACK THE SAME WAY.' },
  { id: 'gbook', kind: 'prop3', at: [-9, 0, 12.4], label: 'GUEST BOOK', range: 2.0, look: 'THE GUEST BOOK. THE LAST ENTRY IS TWO WINTERS OLD. IN A PRACTICED HAND: "DO NOT ARGUE." IT\'S WRITTEN IN THE MARGIN, OVER AND OVER, LIKE SCALES.' },
  { id: 'closet_door', kind: 'prop3', to: 'lodge_closet', at: [-12.8, 0, 6], label: 'LOST & FOUND', range: 1.8, talk: async () => { await goScene('lodge_closet', 0, 1.4, 0); if (F3('chipTask') === 'boiler' && !F3('boilerFixed')) setObj3('Fix the boiler', 'lodge_closet', 'boiler'); }, draw3: () => {} },
  { id: 'fire9', kind: 'prop3', at: [8.6, 0, 8], label: 'THE FIRE', range: 2.4, look: 'A FIRE THAT HAS NOT BEEN ALLOWED TO GO OUT IN TWO WINTERS. THE WOODPILE IS ORGANIZED LIKE IT MIGHT BE AUDITED.' },
];
SCENES.lodge_closet.ents = () => [
  { id: 'closet_out', kind: 'prop3', to: 'lodge_hall', at: [0, 0, .9], label: 'HALL', range: 1.6, talk: () => goScene('lodge_hall', -12, 6.8, Math.PI / 2), draw3: () => {} },
  { id: 'boiler', kind: 'prop3', at: [1.6, 0, 4.4], label: 'THE BOILER', range: 2.2, promptY: .9, talk: () => boilerTalk(), draw3: () => {} },
  { id: 'mitten', kind: 'prop3', at: [-2.6, 0, 4.2], label: 'ONE MITTEN', range: 2.0, look: 'ONE MITTEN, WOOL, GRAY, TAGGED "LAKE TAHOMA, WINTER \'86." IT HAS OUTLASTED ITS OWNER\'S VISIT BY NINETEEN YEARS. JUNE LAUNDERS IT EVERY SPRING.' },
  { id: 'boxes9', kind: 'prop3', at: [-1, 0, 1.6], label: 'BOXES', range: 2.0, look: 'BOXES OF THINGS PEOPLE LEFT AND NEVER SENT FOR. A TROMBONE. A DIVORCE DECREE, UNSIGNED. A SNOW GLOBE OF A LODGE THAT MIGHT BE THIS ONE.' },
];
async function lodgeDoor() { await goScene('lodge_hall', 0, 1.8, 0); if (!F3('hallSeen9')) { setF3('hallSeen9'); run(async () => { await say2([['CARL', 'It\'s warm. It\'s so warm. The whole room is the fireplace\'s idea.'], ['CARL', 'There\'s a desk that says MAIL on it. There\'s a name on it that isn\'t the woman standing behind it.']]); setObj3('The mail desk, west wall', 'lodge_hall', 'june'); }); } }
// ---------------- the gatekeeper: the ski patrol, one wrist, nine opinions ----------------
async function chipTalk() {
  if (F3('lodgeIn')) return say(pick(['Hill\'s still there. Snow\'s still there. Clock\'s... you\'ll hear about the clock.', 'I patrol a hill with nobody on it. Mostly I patrol the firewood.']), CH);
  if (F3('chipTask') === 'instructor' && F3('skiDone')) {
    await say2([[CH, 'You SKIED it. Nobody skies it. I don\'t ski it.'], ['CARL', 'I hit four trees.'], [CH, 'You hit four trees INTENTIONALLY SLOW. That\'s technique. That\'s basically instruction. In. You\'re the instructor.']]);
    finishAlibi('instructor', 'SKIED THE BUNNY HILL'); return lodgeLetIn();
  }
  if (F3('chipTask') === 'boiler') return say(F3('boilerFixed') ? 'She\'s warm! I can hear her ticking from here. Boiler man. Come in, come in.' : 'Boiler\'s in the lost and found. Through the hall, west wall. She\'s been cold a week. Don\'t tell June I let it get cold.', CH);
  if (F3('chipTask') === 'instructor') return say('Tow rope\'s west of the lot. Take the hill. Don\'t hit the snowman. Everybody hits the snowman. He\'s used to it.', CH);
  await say('A KID IN A RED PARKA WITH A SKI-PATROL CROSS ON THE SLEEVE. ONE WRIST IS TAPED. HE STANDS LIKE THE PORCH IS A MOUNTAIN HE IS PROUD OF.');
  for (;;) {
    const c = await claimMenu(CH, 'Night check-in. Who\'s walking in?', ['guest', 'instructor', 'boiler', 'courier'], { stop: 9 });
    if (c === 'guest') {
      await say2([['CARL', 'I\'m a guest. A paying guest. One night. The normal amount of night.'], [CH, 'A room\'s the season rate. It\'s been the season rate nineteen years. Nobody\'s taken a room since the Clintons left office.'], [CH, 'It\'s $25. That includes the fire, the silence, and one opinion from me about the lake.']]);
      const p = await ask('PAY THE SEASON RATE? (YOU HAVE $' + C3.bux + ')', null, ['PAY $25', 'ARGUE']);
      if (p === 0 && C3.bux >= 25) { C3.bux -= 25; sfx('get'); await say2([[CH, 'Wow. Okay. Room 3. It\'s all of them, but call it Room 3.'], ['CARL', 'I get a room?'], [CH, 'You get the LODGE, dude. You bought the season.']]); finishAlibi('guest', 'PAID THE SEASON RATE'); return lodgeLetIn(); }
      if (p === 0) await say('YOU DON\'T HAVE $25. CHIP LOOKS AT THE SHIP. THE SHIP, PRESUMABLY, IS PAID FOR.');
      let r; do { r = await argue3({ id: 'chip_guest', name: CH, port: CH, patience: 9, weak: { LOGIC: 2 }, atk: ['A guest has luggage.', 'A guest skis. You have never skied. I can tell.', 'A guest books ahead. The phone\'s been dead since \'09.'], hit: 1, hint: 'logic. he respects a rule with a number in it', win: 'Okay, okay. You know what? The season rate is whatever. Come in out of the cold. That\'s the real rule.', open: 'HE TAPS HIS TAPED WRIST LIKE IT\'S A CLOCK.' }); } while (!r.win);
      finishAlibi('guest', 'ARGUED THE SEASON RATE'); return lodgeLetIn();
    }
    if (c === 'instructor') {
      await say2([['CARL', 'I\'m the ski instructor. New. From the other mountain. The... east one.'], [CH, 'We HAVE an instructor. Had. Me. Then I showed off in \'04 and now the hill instructs itself.'], [CH, 'You want the job, take the job the way I lost it. Down the hill. Trees, snowman, ice. Make it to the bottom still standing.']]);
      setF3('chipTask', 'instructor'); const a = alibiOf('instructor'); if (a) a.task = 'SKI THE BUNNY HILL'; setObj3('Take the tow rope up (west of the lot)', 'lodge_lot', 'towrope'); return;
    }
    if (c === 'boiler') {
      await say2([['CARL', 'I\'m the boiler man. Boilers. I do them. There was a call about a boiler. This address.'], [CH, 'There was! There was a call! I made it! I made it to a number I found in a drawer!'], [CH, 'It\'s in the lost and found. Through the hall, west wall. She\'s been cold a week and June keeps saying "he\'ll come." She means the boiler. Probably the boiler.']]);
      setF3('chipTask', 'boiler'); setF3('lodgeIn'); const a = alibiOf('boiler'); if (a) a.task = 'FIX THE BOILER'; setObj3('The boiler, in the lost and found', 'lodge_hall', 'closet_door'); return;
    }
    await say2([['CARL', 'I\'m a courier. I have a delivery for the mail desk.'], [CH, 'Nobody DELIVERS here. The road closes in October. It opens in April. It\'s June. There is no June road.'], ['CARL', 'I flew.'], [CH, '...'], [CH, 'Okay, that\'s the first courier answer I ever believed. But you can\'t just BE a courier here. If you came down that road, you can go DOWN the hill. Tow rope\'s west. Live, and you\'re staff.']]);
    setF3('chipTask', 'instructor'); setObj3('Take the tow rope up (west of the lot)', 'lodge_lot', 'towrope'); return;
  }
}
async function lodgeLetIn() { setF3('lodgeIn'); sfx('door'); setObj3('Go inside, to the mail desk', 'lodge_lot', 'lodge_door'); }
async function skiRun() {
  await say2([['CARL', 'It\'s a rope. It goes up. Nothing has ever been more obvious or less reassuring.'], [CH, 'The hill does the rest! Aim for NOT-trees!']]);
  await drive({ dur: 1100, title: 'THE BUNNY HILL', types: ['pine', 'snowman', 'ice', 'pot'], sky: ['#92a2b6', '#e8ecf4'], ground: '#d8dce4', music: 'drive' });
  post.fade = 1; await fadeIn(.08);
  setF3('skiDone'); WX.shake = 10; sfx('ring');
  await say('THE BOTTOM OF THE HILL. THE LAKE, THE LODGE, ONE SNOWMAN MISSING HIS HEAD, AND CARL, STANDING, IN JUNE.');
  await say2([['CARL', 'I did it. I skied. Chat, add it to the list of things I am. Ski instructor. Normal human. Ski instructor.'], [U0, 'you hit the snowman'], ['CARL', 'The SNOWMAN hit ME. He was middle of the run. He was asking for it.']]);
  setObj3('Report to Chip on the porch', 'lodge_lot', 'chip');
}
async function boilerTalk() {
  if (F3('boilerFixed')) return say('THE BOILER TICKS, CONTENTED. IT HUMS A NOTE THAT MAKES THE PIPES AGREE.');
  if (F3('chipTask') !== 'boiler') return say('THE BOILER. COLD. A DIAL MARKED "PATIENCE" HAS ITS OWN OPINIONS. NOT YOUR BOILER. UNLESS SOMEBODY ASKS.');
  await say('THE BOILER: OLDER THAN THE LODGE, OLDER THAN THE COUNTY. A JACKET OF SADDLE BLANKETS. FIVE WIRES, FROST ON THE PANEL.');
  const ok = await wires('THE BOILER', 5); if (!ok) return say('IT COUGHS A PUFF OF SOOT THAT SMELLS LIKE A SNUFFERED BIRTHDAY. TRY AGAIN. IT WANTS TO TRY AGAIN.');
  setF3('boilerFixed'); finishAlibi('boiler', 'FIXED THE BOILER'); sfx('power'); relight();
  await say('THE BOILER WAKES. THE PIPES KNOCK, THEN SETTLE, LIKE A HOUSE ROLLING ITS SHOULDERS.');
  await say2([['CARL', 'There. Warm. Everything here is about keeping one fire going and I just started a second one.'], [U0, 'carl come inside now']]);
  setObj3('Tell Chip the boiler\'s going', 'lodge_lot', 'chip');
}
// ---------------- the clock: regulate the pendulum until the tick is even ----------------
async function cuckoo() {
  let dial = rnd(100) / 100, target = .25 + Math.random() * .5, t = 0; const prev = scene;
  scene = { update() { t++; }, draw() {
    prev.draw(); panel(50, 20, 220, 170); ctext('THE CUCKOO CLOCK', 28, UI.name);
    const q = 1 - Math.min(1, Math.abs(dial - target) * 6), sw = Math.sin(t * (.05 + (1 - q) * .04)) * (1.4 - q);
    circF(160, 82, 33, hex('#e8dcb0')); ringF(160, 82, 33, hex('#6d4924'));
    for (let i = 0; i < 12; i++) { const a = i * .524 - 1.57; pset(160 + Math.cos(a) * 27, 82 + Math.sin(a) * 27, hex('#6d4924')); }
    const ha = -1.57 + (dial - target) * 8 + t * .002; lineF(160, 82, 160 + Math.cos(ha) * 18, 82 + Math.sin(ha) * 18, hex('#241c10'));
    lineF(160, 82, 160 + Math.cos(ha * 4) * 12, 82 + Math.sin(ha * 4) * 12, hex('#241c10'));
    lineF(160 + sw * 8, 115, 160 + sw * 26, 148, hex('#8a6a48')); circF(160 + sw * 26, 148, 6, hex('#b64924'));
    rectF(70, 156, 180, 6, hex('#242424')); rectF(70 + dial * 174, 154, 6, 10, hex('#ffdb24'));
    ctext(q > .85 ? 'THE TICK IS EVEN. A: LOCK IT.' : 'REGULATE THE PENDULUM', 170, UI.dim);
  } };
  DBG.mode = 'tune'; DBG.tn = { dial: () => dial, target };
  for (;;) {
    await nextFrame();
    if (held.left) dial = Math.max(0, dial - .006); if (held.right) dial = Math.min(1, dial + .006);
    if (pressed.a) { if (Math.abs(dial - target) < .035) break; sfx('hurt'); }
    if (pressed.b) { DBG.mode = null; scene = prev; return false; }
  }
  sfx('get'); await wait(20); DBG.mode = null; scene = prev; return true;
}
async function clockTalk() {
  if (F3('clockFixed')) return say(F3('cuckoo9') ? 'THE CLOCK IS QUIET AGAIN. THE LITTLE DOOR IS SHUT. WHATEVER IT WANTED TO SAY, IT SAID.' : 'THE CLOCK TICKS EVENLY. THE LITTLE DOOR IS SHUT. IT HAS SAID ITS THING.');
  if (!F3('juneMet')) return say('A CUCKOO CLOCK ABOVE THE MAIL DESK. STOPPED. ITS LITTLE DOOR IS SHUT LIKE A MOUTH DECIDING.');
  await say('THE CUCKOO CLOCK: BLACK FOREST, OLDER THAN THE LODGE. WALT SET IT BEFORE— BEFORE. THE PENDULUM HANGS SLIGHTLY WRONG, LIKE A HELMET ON THE WRONG HOOK.');
  const ok = await cuckoo(); if (!ok) return say('THE PENDULUM SWINGS UNEVEN. THE CLOCK HOLDS ITS BREATH AND ITS LITTLE OPINION.');
  setF3('clockFixed'); sfx('ding'); await wait(30);
  await say('THE TICK SETTLES INTO ITSELF. THE LITTLE DOOR OPENS. THE BIRD COMES OUT. IT LOOKS AT CARL. IT DOES NOT CUCKOO. IT GOES BACK IN AND SHUTS THE DOOR ITSELF.');
  await say2([['CARL', 'It didn\'t make the sound.'], [JU, 'No. It never made the sound for me either. It just... confirms you.'], ['CARL', 'It confirmed me. Chat, a bird confirmed me.'], [JU, 'He set it for the short one. It\'s been ready a year. WE were a year late, it and me.']]);
  addNote('THE CUCKOO CLOCK: set for "the short one." Broken a year. Fixed; the bird confirms Carl without cuckooing.');
  setObj3('Stand with June at the mail desk', 'lodge_hall', 'june');
}
// ---------------- the clerk: the card, the widow, the practiced hand ----------------
async function juneTalk() {
  if (F3('done9')) return say(pick(['The fire\'s yours as long as you\'re on this mountain. That\'s the whole policy.', 'He\'d have liked you. You argue exactly enough.']), JU);
  if (!F3('juneMet')) {
    setF3('juneMet');
    await say2([[JU, 'The mail desk. Walt\'s, still. I keep his name on it. His name did the work; I just answer it.'], ['CARL', 'I have a parcel. And a route. And a card that says a clerk stamps it.'], [JU, 'Then you\'re the short one. Sit down. Not on the stool. That\'s his. The chair.']]);
    await say2([[JU, 'Nineteen years ago, two guests. Tall. They came in a storm like you did, and the storm stopped when they did, which I don\'t discuss.'], [JU, 'They paid the room in stamps that weren\'t stamps. Walt took them because they were polite and because they cleared. They stood by the fire, very close together, and took nothing. Not even the warming.'], [JU, 'They left a card with him. "A courier will come. He will be short. Do not argue. Stamp it." And they said one thing at the door. "Not yet."']]);
    await say2([[JU, 'Walt practiced. Every night, after close, at this desk: "Do not argue." Nineteen years of scales, on that guest book.'], ['CARL', 'That\'s a lot of practicing for four words.'], [JU, 'They\'re hard words. Everything in you wants to argue. He got to where he could hold it ten seconds. I did the replies. I got very good at "But—"'], ['CARL', 'But—'], [JU, 'See? You\'re a natural.']]);
    await say2([[JU, 'He died two winters ago. On the hill. Doing the thing he told everybody not to do, which is how he\'d have wanted the sentence to end.'], [JU, 'The card\'s mine now. I don\'t know if I\'m allowed. He did the practicing. I only did the agreeing.'], ['CARL', 'You did the replies.'], [JU, '...I did do the replies.']]);
    addNote('JUNE: Walt practiced "do not argue" for 19 years. June did the replies. The tall ones said "not yet."');
    await say2([[JU, 'But I can\'t stamp a thing I haven\'t heard. The clock was his last setting. It was set for you, and it\'s been broken a year, and I can\'t have you leave with it unconfirmed.'], ['CARL', 'It\'s a clock.'], [JU, 'It\'s a WITNESS, dear. Fix the clock. Let him say it.']]);
    setObj3('Fix the cuckoo clock (above the desk)', 'lodge_hall', 'clock'); return;
  }
  if (!F3('clockFixed')) return say('The clock, dear. Over the desk. It won\'t take a strong person. It takes a patient one.', JU);
  await say2([[JU, 'It confirmed you. All those years of practicing "do not argue," and the clock just... agrees with you.'], [JU, 'So. The stamp. His stamp. His hand or mine. Tell me what I already know, because I can\'t say it first.']]);
  DBG.truth = 0; const d = await ask('WHAT DOES SHE DO?', JU, ['HE PRACTICED. STAMP IT.', 'MAYBE IT SHOULD WAIT']); DBG.truth = undefined;
  if (d !== 0) { await say2([[JU, 'Maybe. Maybe. It\'s waited nineteen years; it knows how.'], ['CARL', 'It shouldn\'t wait forever.'], [JU, 'Nothing on this mountain does, dear. That\'s the problem with it.']]); setObj3('June is deciding (the mail desk)', 'lodge_hall', 'june'); return; }
  await say2([[JU, 'He practiced. So I did too.']]);
  await say('SHE TAKES THE STAMP OUT OF THE DESK DRAWER. IT SITS IN HER HAND LIKE SOMETHING THAT KNOWS ITS OWN WEIGHT. SHE SIGNS FIRST, IN A HAND THAT ISN\'T HERS. IT\'S CLOSE. IT\'S PRACTICED.');
  await signature('FORWARD, LAKE TAHOMA'); C3.route[9] = 1;
  await say('"HE PRACTICED," SHE SAYS. "I FIGURED THE LEAST I COULD DO WAS PRACTICE BACK." THE STAMP COMES DOWN: RED, EVEN, NINETEEN YEARS PATIENT, ONE WINTER LATE.');
  await say2([[JU, 'There. Forwarded. You\'ll want to keep the fire hours. Ten to ten. All the stops keep fire hours; nobody says so.'], ['CARL', 'Where does it go next?'], [JU, 'Down the mountain and east. A town that isn\'t a town anymore. The last honest clerk is holding it together with a shotgun and opinions. You\'ll like her. She doesn\'t argue EITHER.']]);
  addNote('STAMP: LAKE TAHOMA (JUNE, IN WALT\'S HAND). "Next: a town that isn\'t a town. The last honest clerk."');
  setF3('done9'); setF3('pendingCall9'); setObj3('Back to the ship', 'lodge_lot', 'ass9');
}
SHIPCALL[9] = async () => {
  await say2([[DI, 'Tahoma stamp\'s on the tracker. It came in shaky. It scanned twice. The second scan is steadier than the first, which is not how ink works.'], ['CARL', 'She practiced.'], [DI, '...Say that again?'], ['CARL', 'Nothing. The snow\'s letting up.']]);
  setRouteObj();
};
RADIOTALK.DISPATCH[9] = async () => { await say2([[DI, 'That road opens in April and closes in October, Carl. It is June. You drove a road that wasn\'t there.'], ['CARL', 'The road was there. It was just snow.'], [DI, 'That\'s not— okay. Mail finds a way. Apparently so do you.']]); };
RADIOTALK['JB GARFIELD'][9] = async () => { await say2([[GA, 'A lodge with one fire and no guests. Kid, I\'ve staked out sadder places, but never one that kept the fire ON.'], ['CARL', 'She keeps everything on.'], [GA, 'That\'s not a stakeout then. That\'s a vigil. Different report entirely.']]); };
RADIOTALK['SPOOKY GHOST'][9] = async () => { await say2([[GH3, 'I snowbirded at a lodge like that, bro. Off-season. There was a piano by the fire and a woman who read by it.'], ['CARL', 'Did you play?'], [GH3, 'I played. She listened with one eyebrow. Then she asked what I actually did. I left in the spring.'], ['CARL', '...Did she have a name?'], [GH3, 'They all did, bro. That was never the problem.']]); };
RADIOTALK['CEO LINDA'][9] = async () => { await say2([[LI3, 'A stamp is authority. Authority doesn\'t die, it transfers. Someone should check the will.'], ['CARL', 'She didn\'t need a will. She practiced.'], [LI3, 'Practicing is probate, Carl. The slow kind. Tell her the rent came due, and she paid it anyway. I respect that more than I can bill for.']]); };
CBTALK[9] = [['CH 19', '...Tahoma road\'s closed, breaker. Snow in June. Some little saucer came down it anyway. Lights out, no engine... nothing...'], ['CH 19', '...that lodge keeps a fire nineteen years running. State record. Nobody knows who counts...'], ['CH 19', '...do NOT ask the Tahoma kid about his wrist. He\'ll tell you. Breaker, he WILL tell you...']];
REVISIT[9] = async () => { if (F3('done9')) await say2([[CH, 'Season\'s still on. Rate\'s still $25. The snowman got a new head; don\'t ask whose hat.']]); };
