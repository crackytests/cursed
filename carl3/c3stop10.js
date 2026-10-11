'use strict';
// ================= CARL 3: ACT II, STOP 10: SHADOW VALLEY DRIVE-IN =================
// a screen forty feet tall, a projection booth on stilts, three cars and one of them is empty.
// the tall ones left a reel: the road, from a car. the camera never turns around. you never see them.
const VE = 'VEE', AR = 'ARLO', RY = 'RAYE';
regStop(10, { name: 'SHADOW VALLEY DRIVE-IN', scene: 'drivein_lot', road: 'a movie screen facing an empty valley', sky: ['#0a0a24', '#492470'], ground: '#241c2a' },
  { act: 2, hint: () => !F3('diIn') ? 'The ticket booth. Couples night only. The booth decides what a couple is.' : !F3('arloMet') ? 'The projectionist is up the ladder, center back. He keeps a postal box up there.' : !F3('threaded') ? 'The projector is naked. It needs the film threaded. Three loops.' : !F3('reelSeen') ? 'Go sit on the hood. Arlo is killing the work lights.' : !F3('done10') ? 'Arlo is waiting in the booth. He has the stamp out of the popcorn tin.' : 'The lot is dark. The screen is blank. It was a good show.' });
CLAIMS.date = { name: 'HALF A COUPLE', short: 'MY DATE\'S IN THE SHIP', with: [] };
CLAIMS.critic = { name: 'A FILM CRITIC', short: 'I\'M A CRITIC', with: [] };
CLAIMS.repair = { name: 'PROJECTOR REPAIR', short: 'I\'M THE REPAIR GUY', with: ['maintenance'] };
regBust(VE, genBust({ skin: '#f0c8a8', hair: '#ff70b8', hairStyle: 'big', top: '#49246d', glasses: 1, collar: '#ff9ac0' }), '#ff9ac0');
regBust(AR, genBust({ skin: '#d8a878', hair: '#92dbff', hairStyle: 'slick', top: '#242438', collar: '#e8e8e8' }), '#92dbff');
regBust(RY, genBust({ skin: '#e8c8a8', hair: '#b64924', hairStyle: 'big', top: '#ffdb24', collar: '#c22424' }), '#ffdb24');
Object.assign(VOICE, { VEE: [820, 100], ARLO: [300, 20], RAYE: [660, 70] });
Object.assign(PEOPLE, { vee: { top: '#49246d', bottom: '#24243a', hair: '#ff70b8', hairStyle: 'big', glasses: 1 }, arlo: { top: '#242438', bottom: '#242438', hair: '#92dbff', hairStyle: 'slick', collar: '#e8e8e8' }, raye: { top: '#ffdb24', bottom: '#c22424', hair: '#b64924', hairStyle: 'big', apron: '#ffffff' } });
for (const k of ['vee', 'arlo', 'raye']) MODELS_P[k] = personModel(PEOPLE[k]);
// ---------------- scenes ----------------
// ---- the lot: the screen ahead, speaker posts in rows, the snack bar, the booth on stilts ----
(() => {
  const b = SB({ amb: [.28, .24, .4], sun: { dir: [-.4, .7, -.4], col: [.3, .22, .4] }, sky: ['#0a0a24', '#492470'], stars: 1, fog: { col: '#1a1030', dens: .011 }, music: 'reel', title: 'SHADOW VALLEY DRIVE-IN' });
  b.ground(200, 130, { col: '#7a6a58', tex: 'sand', ts: 4 }, 0, 18);
  b.add('plane:80:4', [0, .015, 2], { col: '#5a5a62', tex: 'asphalt', ts: 2 }); b.add('plane:80:.2', [0, .025, 4.2], { col: '#e8c850', emis: .1 });   // the entrance road
  b.box(0, 34, 36, 1.4, 13, { col: '#4a4452', tex: 'stucco', ts: 4 }); b.add('box:34:11.4:.3', [0, 1, 33.28], { col: '#d8d8e0', emis: .18 });                    // THE SCREEN
  for (const x of [-14, 14]) b.cyl(x, 33.8, .5, 13, { col: '#3a3644' }, { solid: true, seg: 8 });
  for (const z of [8, 12, 16]) for (let i = 0; i < 7; i++) { const x = -18 + i * 6; b.cyl(x, z, .07, 1.3, { col: '#6d6d76' }, { seg: 5 }); b.add('box:.36:.3:.24', [x, 1.35, z], { col: '#494952', shiny: .4 }); }   // the speaker posts
  b.building(16, 20, 8, 6, 3.4, { col: '#c8506d', tex: 'stucco', ts: 3 }, { win: 2, wcol: '#ffdb6d', sign: { col: '#ffdb24', w: 7, h: 1 } });          // the snack bar
  b.box(0, 28, 5, 5, 3, { col: '#6d5a3a', tex: 'wood', ts: 2 }, { y: 3.2 }); for (const [i, j] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) b.cyl(i * 1.8, 26.2 + j * 1.8, .16, 3.2, { col: '#5a4a30' }, { solid: true, seg: 6 });   // the booth, on stilts
  b.add('box:.9:3.4:.3', [0, 1.7, 25.3], { col: '#8a7a6a', tex: 'wood', ts: 1 });                                                                     // its ladder
  b.box(0, 2.2, 2.6, 2.6, 2.8, { col: '#d8b848', tex: 'stucco', ts: 2 }); b.add('box:1:1.2:.1', [0, 1.4, 3.52], { col: '#49ffdb', emis: .6, shiny: .4 }); b.sign(0, 3.1, 3.6, 2.6, .8, '#ff49db', { rad: 6 });   // the ticket booth
  b.car(-6, 8, .1, '#496d92'); b.car(8, 11, -.2, '#b64949'); b.car(16, 13, .3, '#6d92b6');
  b.lamp(-14, 4, { h: 5, col: [1, .6, .8] }); b.lamp(22, 8, { h: 5, col: [1, .6, .8] }); b.lamp(0, 22, { h: 5, col: [.7, .8, 1] });
  b.cactus(-30, 22, 3); b.cactus(30, 26, 2.4); b.box(-22, 16, 3, 1.4, 1.2, { col: '#8a7a6a', tex: 'stucco', ts: 2 });
  b.walkRect(-30, 5, 30, 26.5);
  b.autoCams(-30, 5, 30, 27, 12, 11, 11, 11, .95);   // high and back, all facing the screen
  b.cam('backbar', [16, 8, 31], [16, .8, 22], 1.0, [11, 23, 21, 27]);   // behind the snack bar, looking back from under the screen
  SCENES.drivein_lot = Object.assign(b.fin(), { start: [-28, 0, 8], arrive: [-28, 8, 1.2], shipExit: [-28, 8, 1.2] });
})();
// ---- the booth: the projector, the film cans, the postal box, and one chair that is used ----
(() => {
  const b = SB({ amb: [.3, .26, .34], sun: { dir: [.2, 1, -.3], col: [.24, .2, .3] }, sky: ['#0a0a24', '#141028'], fog: { col: '#100c1c', dens: .006 }, music: 'reel', title: 'PROJECTION BOOTH' });
  b.ground(9, 7, { col: '#4a4038', tex: 'wood', ts: 2 }, 0, 3.5);
  b.box(0, 6.4, 9, .5, 3.2, { col: '#6d5a3a', tex: 'wood', ts: 2 }); b.box(-4.6, 3, .5, 7, 3.2, { col: '#6d5a3a', tex: 'wood', ts: 2 }); b.box(4.6, 3, .5, 7, 3.2, { col: '#6d5a3a', tex: 'wood', ts: 2 });
  b.box(0, 3, 2.6, 1.6, 1, { col: '#3a3a44', tex: 'metal', ts: 2, shiny: .5 }); b.cyl(-.7, 3, .5, .1, { col: '#c8c8d0', shiny: .6 }, { y: 1.15, seg: 12, solid: false }); b.cyl(.7, 3, .5, .1, { col: '#c8c8d0', shiny: .6 }, { y: 1.15, seg: 12, solid: false }); b.add('cyl:.16:.5:8', [0, 1.35, 3.6], { col: '#1a1a22' });   // THE PROJECTOR and its platters
  b.add('box:2.2:.06:.5', [0, 1.15, 4.6], { col: '#ffd848', emis: .5 });   // the light slit, toward the screen
  for (let i = 0; i < 3; i++) b.cyl(-3.2, 1.6 + i * .55, .45, .5, { col: ['#8a8a92', '#b0b0b8', '#8a8a92'][i], tex: 'metal', ts: 1 }, { seg: 9 });   // film cans
  b.box(3.2, 5.2, 1.4, 1.4, 1.8, { col: '#24499b', shiny: .4 }); b.add('box:.9:.7:.08', [3.2, 1.1, 4.53], { col: '#ffd848', emis: .6 }); b.add('box:1.5:.4:.1', [3.2, 2.1, 5.2], { col: '#e8e8ff', emis: .4 });   // THE POSTAL BOX
  b.box(2.4, 1.6, .9, .9, .9, { col: '#6d4924', tex: 'wood', ts: 1 });   // the chair, one, used
  b.lights.push({ p: [0, 2.6, 3.2], col: [1, .8, .5], rad: 7, int: 1.2, glow: .8 }, { p: [0, 1.2, 4.8], col: [1, .9, .6], rad: 4, int: 1.4, glow: 1.4 }, { p: [3.2, 2, 4.6], col: [.8, .85, 1], rad: 4, int: .9 });
  b.walkRect(-3.4, 1, 3.4, 4.9);
  b.cam('booth', [0, 5.5, -3], [0, 1.2, 3.4], 1.0, [-20, -20, 20, 20]);
  SCENES.booth = Object.assign(b.fin(), { start: [0, 0, 1.4] });
})();
// ---------------- the drive in, the arrival ----------------
DRIVELINES[10] = [[80, DI, 'Shadow Valley. A drive-in with no road sign. The sign burned out the year the mall opened and nobody re-bulbed it.'], [460, GA, 'A screen in the middle of nowhere is a witness, kid. It shows whatever\'s pointed at it and it never blinks.'], [840, 'CARL', 'It\'s showing nothing.'], [900, GA, 'That\'s what it\'s been showing for years. Stick around. Nothing takes about an hour.']];
ARRIVE[10] = async () => {
  await say2([['CARL', 'A movie screen the size of a sky. Rows of speaker posts. Three cars. It\'s a whole theater with the people taken out.'], [U0, 'carl count the cars'], ['CARL', 'Three. I counted. One of them is... we\'ll get to that.'], [VE, 'One admission or two, hon? Booth closes at dark. It\'s always almost dark.']]);
  setObj3('The ticket booth wants to know', 'drivein_lot', 'vee');
};
SCENES.drivein_lot.ents = () => [
  { id: 'ass10', kind: 'prop3', to: 'ship', at: [-28, 0, 6], label: 'THE A.S.S.', range: 3.2, talk: () => F3('reelReady') && !F3('reelSeen') ? watchReel() : enterShip(), draw3: e => drawModel(SHIP, { p: [e.at[0], .9, e.at[2] + 2.4], yaw: 0, s: .9 }, shipLight(e.at)) },
  npc3('vee', 'vee', 2.6, 5.6, VE, () => veeTalk(), { yaw: 2.9 }),
  { id: 'ladder', kind: 'prop3', to: 'booth', at: [0, 0, 24.7], label: 'THE BOOTH', range: 1.9, cond: () => F3('diIn'), talk: async () => { await goScene('booth', 0, 1.4, 0); if (F3('reelSeen') && !F3('done10')) setObj3('Sign at the postal box', 'booth', 'arlo'); else if (F3('threaded')) setObj3('Sit on the hood. The reel is starting.', 'drivein_lot', 'ass10'); else if (!F3('arloMet')) setObj3('Talk to the projectionist', 'booth', 'arlo'); else setObj3('Thread the projector (three loops)', 'booth', 'projector'); }, draw3: () => {}, promptY: .8 },
  npc3('raye', 'raye', 12.8, 15.6, RY, () => rayeTalk(), { yaw: Math.PI, range: 2.6 }),
  { id: 'car10', kind: 'prop3', at: [16, 0, 13], label: 'THE THIRD CAR', range: 3.0, look: 'THE THIRD CAR. DOORS SHUT, KEYS IN. THE SEAT IS LAID ALL THE WAY BACK FOR SOMEBODY TALL. IT HAS NOT BEEN LAID BACK BY ANYBODY SINCE 1987.' },
  { id: 'screen10', kind: 'prop3', at: [4.2, 0, 26], label: 'THE SCREEN', range: 2.8, look: F3('reelSeen') ? 'THE SCREEN, BLANK. IT SHOWED YOU A ROAD AND THEN IT SHOWED YOU WHITE. IT DOESN\'T TAKE QUESTIONS.' : 'THE SCREEN. FORTY FEET OF NOT-QUITE-WHITE. FROM THIS CLOSE IT HAS DENTS LIKE A MOON.' },
];
SCENES.booth.ents = () => [
  { id: 'booth_out', kind: 'prop3', to: 'drivein_lot', at: [0, 0, 1.0], label: 'DOWN', range: 1.6, talk: () => goScene('drivein_lot', 0, 23.8, Math.PI), draw3: () => {} },
  npc3('arlo', 'arlo', 0, 4.2, AR, () => arloTalk(), { yaw: Math.PI, range: 2.8 }),
  { id: 'projector', kind: 'prop3', at: [0, 0, 3], label: 'PROJECTOR', range: 2.2, promptY: .9, talk: () => projectorTalk(), draw3: () => {} },
  { id: 'cans', kind: 'prop3', at: [-3.2, 0, 3.2], label: 'FILM CANS', range: 2.0, look: 'FILM CANS. LABELED IN PENCIL: "TRAILERS, 1981." "TRAILERS, 1984." "THE REEL (DO NOT LEAD WITH THIS)." THE THIRD CAN IS WORN SMOOTH ON TOP, FROM A HAND, REPEATED.' },
  { id: 'pobox', kind: 'prop3', at: [3.2, 0, 4.4], label: 'POSTAL BOX', range: 2.2, look: 'A CONTRACT POSTAL BOX, BOLTED TO THE WALL IN 1983, PAINTED ONCE. INSIDE THE GLASS DOOR: STAMP PADS, A LEDGER, AND A POPCORN TIN WITH "STAMPS (NOT POPCORN)" ON THE LID.' },
];
// the screen, during the reel: the road, from a car, forever forward
SCENES.drivein_lot.drawOver = () => {
  if (!F3('reelOn') && !F3('reelEnd')) return;
  const P = [[-16, 11, 33.2], [16, 11, 33.2], [16, 2, 33.2], [-16, 2, 33.2]].map(p => project(LIVE.cam, p)); if (P.some(p => !p)) return;
  const q = P.map(p => [p[0] | 0, p[1] | 0]);
  triF(q[0][0], q[0][1], q[1][0], q[1][1], q[2][0], q[2][1], hex(F3('reelEnd') ? '#e8e8e0' : '#101024'));
  triF(q[0][0], q[0][1], q[2][0], q[2][1], q[3][0], q[3][1], hex(F3('reelEnd') ? '#e8e8e0' : '#101024'));
  const cx = (q[0][0] + q[1][0]) / 2, cy = (q[0][1] + q[2][1]) / 2 + 4, bw = q[1][0] - q[0][0], bh = q[0][1] - q[2][1];
  if (F3('reelEnd')) { const j = Math.sin(WX.t * .5) * bw * .06; rectF(cx - bw * .05 + j, q[2][1], bw * .1, bh, hex('#202028')); return; }
  for (let i = 0; i < 9; i++) { const off = (i - 4) / 4; lineF(cx + off * bw * .48, q[2][1] - 1, cx, cy, i === 4 ? hex('#ffd848') : hex('#496d92')); }
  for (let k = 0; k < 5; k++) { const ph = ((WX.t * .02 + k / 5) % 1), w = ph * ph * bw * .1; rectF(cx - w / 2, q[2][1] - ph * ph * bh * .8, Math.max(1, w), Math.max(1, w * .2), hex('#e8e8c0')); }
  if ((WX.t >> 2) % 9 === 0) triF(q[0][0], q[0][1], q[1][0], q[1][1], cx, cy, hex('#242444'));   // a splice, blipping
};
// ---------------- the gatekeeper: couples night only, and she decides what a couple is ----------------
async function veeTalk() {
  if (F3('diIn')) return say(pick(['Show starts when Arlo says. Arlo says when the film says. The film hasn\'t said in years.', 'Two speakers still work. Row two. If a car\'s in row two, that\'s the show.']), VE);
  if (F3('veeTask') === 'repair') return say('Ladder\'s center back, past the posts. Tell Arlo the motor\'s still sorry.', VE);
  await say('THE TICKET BOOTH. INSIDE IT, A WOMAN WITH READING GLASSES ON A CHAIN AND A ROLL OF TICKETS OLDER THAN THE VALLEY. A SIGN: "COUPLES NIGHT. $3 A CAR."');
  for (;;) {
    const c = await claimMenu(VE, 'Couples night, hon. Two for the price of two. Who\'s the other one?', ['date', 'critic', 'repair', 'courier'], { stop: 10 });
    if (c === 'date') {
      await say2([['CARL', 'My date\'s in the ship. The saucer. My date is in the saucer.'], [VE, 'The little round one? With the lights?'], ['CARL', 'That\'s the one.'], [VE, '...'], [VE, 'Shy date.'], ['CARL', 'Very shy.'], [VE, 'I had a shy date once. Drove himself. You know what, honey? A couple\'s a couple. Two seats, one armrest. Car and saucer counts. Three bucks.']]);
      const p = await ask('PAY $3 A CAR?', null, ['PAY $3', 'ARGUE']);
      if (p === 0 && C3.bux >= 3) { C3.bux -= 3; sfx('get'); await say2([[VE, 'Tear here. Enjoy the show. It\'s been the same one nineteen years and it\'s still a good one.']]); finishAlibi('date', 'PAID FOR TWO'); return diLetIn(); }
      if (p === 0) await say('NO $3. VEE TAPS THE TICKET ROLL LIKE IT\'S A PITY BUTTON.');
      let r; do { r = await argue3({ id: 'vee_date', name: VE, port: VE, patience: 10, weak: { GRIEVANCE: 2 }, atk: ['A couple argues in line. You\'re arguing alone. That\'s singles behavior.', 'Where\'s the second ticket stub? Exactly.', 'I wave at every car that leaves. Your saucer hasn\'t left. That\'s not a date, that\'s a roommate.'], hit: 1, hint: 'grievance. she respects a person who\'s been done wrong by a date', win: 'FINE. Fine. Couples are whoever says they are. I\'ve seen stranger. I\'ve BEEN stranger. In.', open: 'SHE LOOKS AT THE SAUCER. THE SAUCER SAYS NOTHING.' }); } while (!r.win);
      finishAlibi('date', 'ARGUED THE ARMREST RULE'); return diLetIn();
    }
    if (c === 'critic') {
      await say2([['CARL', 'I\'m a critic. Film criticism. I... review. The projection arts.'], [VE, 'A critic. Here. Finally. FINALLY.'], ['CARL', 'Finally?'], [VE, 'Nineteen years and nobody\'s reviewed it. I\'ll get you in for free if you put my booth in the review.']]);
      let r; do { r = await argue3({ id: 'vee_critic', name: VE, port: VE, patience: 11, weak: { RANT: 2 }, atk: ['Critics have a publication. Name it.', 'Critics sit in row one and hate it. You look like a row-two person.', 'Say something critical. Right now. Off the dome.'], hit: 1, hint: 'rant. out-review her', win: 'Okay. OKAY. That was a take. You\'re a critic. Review us. Please review us.', open: 'SHE HAS A PEN OUT. IT\'S A TICKET PEN BUT IT\'S OUT.' }); } while (!r.win);
      finishAlibi('critic', 'PASSED AS PRESS'); return diLetIn();
    }
    if (c === 'repair') {
      await say2([['CARL', 'I\'m the projector repair guy. There was a call. About a... projector. In a booth. This booth.'], [VE, 'There WAS a call! Arlo called the number on the motor in 1988 and YOU FINALLY CAME.'], ['CARL', 'Traffic.'], [VE, 'Ladder\'s center back. Tell him the tickets are holding. The tickets were always holding.']]);
      setF3('veeTask', 'repair'); setF3('diIn'); const a = alibiOf('repair'); if (a) a.task = 'THREAD THE PROJECTOR'; setObj3('Up the ladder to the booth', 'drivein_lot', 'ladder'); return;
    }
    await say2([['CARL', 'I\'m a courier. I have a delivery for the postal box.'], [VE, 'Honey. Nothing\'s been delivered here since the reel. A drive-in doesn\'t get mail. It gets DUSK, on schedule, and that\'s it.'], ['CARL', 'There\'s a contract postal box bolted to that wall up there.'], [VE, '...'], [VE, 'Unless you\'re who Arlo said. He said somebody would come for the reel. Somebody short, with a box, who wouldn\'t stay for the second feature.'], ['CARL', 'There\'s a second feature?'], [VE, 'Hon, you\'re looking at it. Go on up. He\'s been threading that machine all week for nothing. Maybe not nothing.']]);
    setF3('diIn'); setObj3('Up the ladder to the booth', 'drivein_lot', 'ladder'); return;
  }
}
async function diLetIn() { setF3('diIn'); sfx('door'); setObj3('Up the ladder to the booth', 'drivein_lot', 'ladder'); }
async function rayeTalk() {
  if (!F3('rayeMet')) { setF3('rayeMet'); await say2([[RY, 'Popcorn? Butter? The butter\'s mostly hope.'], ['CARL', 'Is that a kind of oil?'], [RY, 'It\'s a kind of Tuesday. Popcorn\'s $2.']]); }
  else await say(pick(['Popcorn\'s $2. The line\'s long. The line\'s been long since 1987.', 'The third car? Don\'t ask me about the third car.']), RY);
  if (!F3('car10line')) { setF3('car10line'); await say2([[RY, 'Okay, you didn\'t ask, so I\'ll tell you. Third car. 1987. Guy went for popcorn. The line was long.'], ['CARL', 'How long?'], [RY, 'It\'s still long. He\'s still in it, far as I know. Far as anybody knows. We keep the car gassed. It seems polite.']]); addNote('RAYE: the third car\'s driver went for popcorn in 1987. The line is still long.'); }
  const p = await ask('POPCORN. $2. (YOU HAVE $' + C3.bux + ')', null, ['BUY', 'NO']);
  if (p !== 0 || C3.bux < 2) return;
  C3.bux -= 2; sfx('get'); await say2([['CARL', 'Popcorn. For the movie. I\'ve never had popcorn at a movie. I\'ve never had a movie.'], [RY, 'Then you\'re starting right, hon.']]);
}
// ---------------- threading the projector: three loops, each one true ----------------
async function thread() {
  let dial = rnd(100) / 100, target = .25 + Math.random() * .5, t = 0, loop = 0; const prev = scene;
  scene = { update() { t++; }, draw() {
    prev.draw(); panel(40, 18, 240, 176); ctext('THREAD THE PROJECTOR', 30, UI.name);
    ctext('LEFT / RIGHT: TURN THE SPROCKET   A: SEAT THE LOOP', 42, UI.dim);
    const q = 1 - Math.min(1, Math.abs(dial - target) * 6);
    circF(70, 104, 20, hex('#303038')); ringF(70, 104, 20, hex('#6d6d76')); circF(70, 104, 5, hex('#8a8a92'));      // the platter, full of film
    for (let i = 0; i < 3; i++) { const x = 120 + i * 36, wob = i === loop ? (1 - q) * Math.sin(t * .5) * 3 : 0, done = i < loop;
      circF(x, 104 + wob, 12, hex(done ? '#103010' : '#303038')); ringF(x, 104 + wob, 12, hex(done ? '#6dff92' : i === loop ? '#ffd848' : '#6d6d76'));
      for (let k = 0; k < 6; k++) { const a = k * 1.047 + (done || i === loop ? t * .05 * q + dial : 0); pset(x + Math.cos(a) * 9 | 0, 104 + wob + Math.sin(a) * 9 | 0, hex(done ? '#6dff92' : '#b6b6c8')); } }
    rectF(228, 92, 26, 24, hex('#101018')); circF(241, 104, 4, hex('#ffd848'));                                    // the gate, and the lamp
    for (const s of [[90, 104, 108, 104], [132, 104, 150, 104], [168, 104, 186, 104], [204, 104, 228, 104], [90, 84, 90, 92], [70, 84, 228, 84]]) lineF(s[0], s[1], s[2], s[3], hex('#b6b6c8'));
    rectF(70, 150, 180, 6, hex('#242424')); rectF(70 + dial * 174, 148, 6, 10, hex('#ffdb24'));
    ctext(loop >= 3 ? 'IT RUNS.' : 'LOOP ' + (loop + 1) + ' OF 3' + (q > .85 ? '   (THE TEETH AGREE)' : ''), 164, loop >= 3 ? hex('#6dff92') : UI.text);
  } };
  DBG.mode = 'tune'; DBG.tn = { dial: () => dial, target };
  for (;;) {
    await nextFrame();
    if (held.left) dial = Math.max(0, dial - .006); if (held.right) dial = Math.min(1, dial + .006);
    if (pressed.a) {
      if (Math.abs(dial - target) < .035) { loop++; sfx('ok'); if (loop >= 3) break; dial = rnd(100) / 100; target = .25 + Math.random() * .5; DBG.tn.target = target; }
      else sfx('hurt');
    }
    if (pressed.b) { DBG.mode = null; scene = prev; return false; }
  }
  sfx('power'); await wait(20); DBG.mode = null; scene = prev; return true;
}
async function projectorTalk() {
  if (F3('threaded')) return say('THE PROJECTOR RUNS. THE PLATTERS TURN. THE LIGHT GOES OUT THE SLIT AND BECOMES A ROAD.');
  if (!F3('arloMet')) return say('A PROJECTOR WITH ITS THROAT OPEN. THREE LOOPS OF FILM HANG UNSEATED. IT LOOKS LIKE A MACHINE WAITING TO BE INTRODUCED.');
  await say('THE PROJECTOR: ITS HEAD IS OPEN. THREE LOOPS OF FILM HANG LOOSE, EACH ONE WANTING ITS SPROCKET. THE TEETH ARE PATIENT. THE TEETH ARE ALWAYS PATIENT.');
  const ok = await thread(); if (!ok) return say('THE LOOP SLIPS AND THE FILM PILES INTO A SMALL SILVER NEST. IT CAN BE INTRODUCED AGAIN.');
  setF3('threaded'); finishAlibi('repair', 'THREADED THE PROJECTOR'); sfx('power');
  await say('LOOP ONE SEATS. LOOP TWO. LOOP THREE. THE MOTOR TAKES THE LOAD LIKE A MAN PICKING UP A FAMILIAR BAG.');
  await say2([[AR, 'There. THERE. Nineteen years I\'ve threaded it by hand, one loop at a time, and the machine has waited for all three at once.'], ['CARL', 'What happens now?'], [AR, 'Now the night starts. Go down. Sit on the hood of your saucer. I\'ll kill the work lights and bring up the lamp.'], [AR, 'It\'s tonight, you know. It\'s been tonight all week.']]);
  setF3('reelReady'); setObj3('Sit on the hood. The reel is starting.', 'drivein_lot', 'ass10');
}
// ---------------- the clerk: the reel, and the night it happens ----------------
async function arloTalk() {
  if (F3('done10')) return say(pick(['Leave the last frame up as long as you like. That\'s what screens are for.', 'I thread it every week, you know. In case tonight is the tonight. It always is.']), AR);
  if (F3('reelSeen')) return arloStamp();
  if (F3('threaded')) return say('It runs! Go on down. Hood of the saucer. The night won\'t start without an audience and it\'s had none for nineteen years.', AR);
  if (!F3('arloMet')) {
    setF3('arloMet');
    await say2([[AR, 'Mind the floor. It\'s a hole and a ladder and forty years of almost falling.'], ['CARL', 'You\'re the projectionist.'], [AR, 'I\'m the projectionist, the ticket taker\'s husband, the postal clerk, and the reason the snack bar has a roof. Mostly I\'m the projectionist.']]);
    await say2([[AR, 'Contract postal box. Bolted in \'83. Stamps in the popcorn tin. Don\'t ask why the tin. The tin was there.'], [AR, 'You\'d be the short one with the parcel.'], ['CARL', 'That\'s what the card says.'], [AR, 'The card says a courier comes. It doesn\'t say what he\'s carrying. But I know what HE left, and I think you\'re carrying the same thing by a different road.']]);
    await say2([[AR, 'Nineteen years ago, two of them. Tall. They came at dusk and paid for a whole row and sat in their own car with the speaker hooked and the engine off.'], [AR, 'They filmed the road. The whole road, from the car, one reel. The camera sits on the dash and looks forward. It never turns around. You never see them. That was the arrangement.'], ['CARL', 'The arrangement with who?'], [AR, 'With them. They filmed it and left it and said: when the short one comes, show him the road. So every year, on this night, I thread it and show it to the lot.'], ['CARL', 'The empty lot.'], [AR, 'The lot\'s not empty. The lot is the screen. It watches BACK.']]); 
    addNote('ARLO: the tall ones filmed the road from their car. The camera never turns around. Left one reel. "When the short one comes, show him."');
    setObj3('Thread the projector (three loops)', 'booth', 'projector'); return;
  }
  await say(pick(['Thread it, and it\'s tonight.', 'The projector. The loops. It\'s all teeth and patience.']), AR);
}
async function watchReel() {
  setF3('reelOn'); music(null); setF3('reelReady');
  await say('CARL CLIMBS THE SAUCER AND SITS ON THE HOOD. THE METAL TICKS AS IT COOLS. THE WORK LIGHTS DIE ALL AT ONCE, ROW BY ROW, LIKE A DECISION.');
  tickC('he is at the movies', 'user_000'); tickC('POPCORN ARC', 'propPillsFan');
  await say('THE LAMP COMES UP. THE SCREEN GOES WHITE, THEN DARK, THEN: A ROAD.');
  await say('THE ROAD, FROM A CAR. DUSK. THE CAMERA SITS ON THE DASH AND LOOKS FORWARD. IT NEVER LOOKS BACK. THE WIPER MARKS ON THE GLASS ARE OLD. SOMEBODY\'S SIDE OF THE GLASS IS CLEANER.');
  await say('MILES. THE HORIZON NEVER ARRIVES; IT JUST KEEPS BEING THERE. THE STEERING WHEEL ENTERS THE FRAME SOMETIMES, ONE KNUCKLE OF IT, AND LEAVES. YOU NEVER SEE A HAND. THE HAND IS ON THE WHEEL. THE WHEEL IS HELD.');
  await say2([['CARL', 'It\'s just a road. Chat, it\'s just a road for a long time.'], [U0, 'keep watching'], ['CARL', 'I\'m watching. I know how to watch. It\'s the one thing I\'ve done the most of.']]);
  await say('A SIGN SWINGS PAST, PINK AND BUZZING: THE STARLITE. VACANCY. THE CAMERA HOLDS IT ONE SECOND TOO LONG, THE WAY YOU HOLD SOMETHING YOU\'RE NOT SUPPOSED TO WANT.');
  await say('A WATER TOWER, THEN: BOX CANYON. THE CAR SLOWS. THE CAMERA STAYS ON THE TOWER UNTIL THE LAST POSSIBLE FRAME, LIKE IT\'S COUNTING. ELEVEN. TEN. ELEVEN AGAIN.');
  await say('THE ROAD AGAIN. FASTER NOW. DUSK GOING TO DARK. THE HEADLIGHTS COME ON AND LIGHT THE LINES, AND THE LINES COME AT YOU, AND SOMEBODY IS DRIVING VERY CAREFULLY, THE WAY YOU DRIVE WHEN THE CARGO IS THE POINT.');
  await say('AND THEN THE FRAME GOES WHITE. NOT DARK. WHITE. THE REEL RUNS OUT AND THE TAIL FLAPS: FLAP. FLAP. FLAP. LIKE SOMETHING TRYING TO REMEMBER HOW A HEART GOES.');
  setF3('reelEnd'); await wait(60);
  await say2([['CARL', '...That\'s it. That\'s the whole thing. They filmed the road I\'m driving. Before I drove it. So I wouldn\'t... so it wouldn\'t be new.'], [U0, 'carl'], ['CARL', 'They walked it first. The crate said that. They DROVE it first too, and they kept the camera on the road the whole time, because the road was for me and the rest was theirs.'], [U0, 'are you crying'], ['CARL', 'No. It\'s the popcorn. The popcorn is very salty. It\'s mostly salt and hope.']]);
  setF3('reelSeen'); setF3('reelOn', 0); setF3('reelEnd', 0); addNote('THE REEL: the road, from their car. The camera never turns around. It held the Starlite and Box Canyon a second too long. Then white.');
  setObj3('Back up the ladder. Arlo has the stamp.', 'drivein_lot', 'ladder');
}
async function arloStamp() {
  await say2([[AR, 'You watched it. All of it. Even the white part.'], ['CARL', 'Especially the white part.'], [AR, 'Nineteen years I\'ve screened that to nobody. Tonight it played to one car and a saucer and a short fella on the hood, and I\'ll tell you a secret: it\'s a different reel now.'], ['CARL', 'It\'s the same reel.'], [AR, 'No. A reel\'s just light going somewhere. Tonight it went somewhere.']]);
  await say('HE TAKES THE POPCORN TIN DOWN FROM THE POSTAL BOX. INSIDE: STAMP PADS, A LEDGER, AND ONE STAMP IN RED, WRAPPED IN WAX PAPER, NINETEEN YEARS DRY.');
  const s = await ask('SIGN AT THE BOX?', AR, ['SIGN', 'NOT YET']); if (s !== 0) { setObj3('Sign at the postal box', 'booth', 'arlo'); return; }
  await signature('FORWARD, SHADOW VALLEY'); C3.route[10] = 1;
  await say2([[AR, 'There. Forwarded. You know what the last thing on the reel is, past the white?'], ['CARL', 'There\'s something past the white?'], [AR, 'Leader. Twenty feet of blank. I thread it anyway. You don\'t cut the part that isn\'t the movie. The not-movie holds the movie together.'], ['CARL', '...I\'m going to think about that for a week.'], [AR, 'Take your week. Take the popcorn tin\'s cousin, too—there\'s one for the road.']]);
  addNote('STAMP: SHADOW VALLEY (ARLO). "The not-movie holds the movie together." The reel ran out white.');
  setF3('done10'); setF3('pendingCall10'); setObj3('Back to the ship', 'drivein_lot', 'ass10');
}
SHIPCALL[10] = async () => {
  await say2([[DI, 'Shadow Valley stamp registered at 1:14 a.m. That\'s the first time anything\'s been postmarked there since the reel came in.'], ['CARL', 'It was a good show.'], [DI, 'One-car attendance.'], ['CARL', 'Plus a saucer. Plus the screen. The screen watched back.']]);
  setRouteObj();
};
RADIOTALK.DISPATCH[10] = async () => { await say2([[DI, 'A drive-in is dead mail with a parking lot, Carl. Architecture that\'s addressed to somebody who moved. I route for a living; I know an undeliverable building when I see one.'], ['CARL', 'It got delivered tonight.'], [DI, '...Log that as a delivery, then. Somebody has to.']]); };
RADIOTALK['JB GARFIELD'][10] = async () => { await say2([[GA, 'A camera that never turns around. Kid, that\'s a witness doing it right. Sees what it\'s pointed at, never profiles the client.'], ['CARL', 'It filmed a road for nineteen years.'], [GA, 'Evidence is patient, kid. So is love, on a bad day. On a good day love kicks the door in. You\'ll know which one this is when it answers.']]); };
RADIOTALK['SPOOKY GHOST'][10] = async () => { await say2([[GH3, 'A DRIVE-IN, bro. I had a car. I had a date. You hook the speaker on the window and the whole world becomes a living room.'], ['CARL', 'Who was the date?'], [GH3, 'She picked the movie. They always picked the movie. I just drove.'], ['CARL', 'Ghost—'], [GH3, 'Second feature\'s starting, bro. Don\'t talk during it.']]); };
RADIOTALK['CEO LINDA'][10] = async () => { await say2([[LI3, 'A screen that size for one customer. That\'s not a business. That\'s a promise.'], ['CARL', 'Is that bad, business-wise?'], [LI3, 'Business-wise it\'s a disaster. It\'s also the only ad that ever worked on me. I was the customer once, at things like that. Nobody priced it right. Nobody ever prices that right.']]); };
CBTALK[10] = [['CH 19', '...that screen in Shadow Valley\'s lit up. First time since the eighties, breaker. Somebody\'s playing something...'], ['CH 19', '...third car at the drive-in\'s been there since \'87. Guy went for popcorn. Line was long. Line\'s STILL long...'], ['CH 19', '...ticket lady up there counts a saucer as a car now. Rules is rules, she says. Her rules...']];
REVISIT[10] = async () => { if (F3('done10')) await say2([[VE, 'Back for the second feature? It\'s the same as the first. That\'s what makes it the second feature.']]); };
