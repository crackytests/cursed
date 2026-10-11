'use strict';
// ================= CARL 3: ACT III, STOP 11: RHYOLITE SPRINGS =================
// a ghost town the Service has moved into. white sedans, patrol loops, a bank with no back.
// OPAL, the last honest clerk, holds the post office with rock salt and opinions. Inspector 9 is seen. Not fought.
const OP = 'OPAL', EU = 'EUCLID', I9B = 'INSPECTOR 9';
regStop(11, { name: 'RHYOLITE SPRINGS', scene: 'ghost_main', road: 'a town that died standing up', sky: ['#1a1020', '#926d49'], ground: '#3a3028' },
  { act: 3, hint: () => !F3('opalOpen') ? 'The post office is mid-street, shuttered, sandbagged. Somebody inside is not selling. Stay off the sedans\' sightlines.' : !F3('done11') ? 'Opal is waiting behind the counter. The stamp is hers or nobody\'s.' : 'The town is quieter. The mail is quieter. Go east.' });
regBust(OP, genBust({ skin: '#e8c8a8', hair: '#e8e8e8', hairStyle: 'big', top: '#493a49', glasses: 1, collar: '#b6b6b6' }), '#ffdb6d');
regBust(EU, genBust({ skin: '#d8a878', hair: '#e8e8e8', top: '#6d6d24', hat: '#b69649', beard: 1 }), '#b69649');
Object.assign(VOICE, { OPAL: [560, 30], EUCLID: [280, 60] });
Object.assign(PEOPLE, { opal: { top: '#493a49', bottom: '#302430', hair: '#e8e8e8', hairStyle: 'big', glasses: 1, k: .9 }, euclid: { top: '#6d6d24', bottom: '#49403a', hat: '#b69649', hair: '#e8e8e8', beard: 1, k: .9 } });
for (const k of ['opal', 'euclid']) MODELS_P[k] = personModel(PEOPLE[k]);
// ---------------- scenes ----------------
// ---- main street: bank with no back, bottle house, the depot, and the white sedans ----
(() => {
  const b = SB({ amb: [.36, .3, .3], sun: { dir: [-.6, .6, -.3], col: [.7, .5, .4] }, sky: ['#1a1020', '#926d49'], fog: { col: '#926d49', dens: .014 }, music: 'rhyolite', title: 'RHYOLITE SPRINGS' });
  b.ground(200, 140, { col: '#a89468', tex: 'sand', ts: 4 }, 0, 20);
  b.add('plane:100:8', [0, .015, 14], { col: '#7a7268', tex: 'asphalt', ts: 3 });   // main street, cracked
  b.box(-34, 30, 12, 2, 8, { col: '#d8ccb0', tex: 'stucco', ts: 3 }); b.sign(-34, 6.6, 29, 8, 1.4, '#e8d848', { rad: 10, lz: -1.4 }); for (let i = 0; i < 3; i++) b.cyl(-39 + i * 5, 26.6, .5, 6.4, { col: '#d8ccb0' }, { solid: true, seg: 8 });   // THE BANK: a face with nothing behind it
  b.box(-12, 34, 10, 8, 4, { col: '#6d9276', shiny: .5 }); b.box(-12, 34, 10.4, 8.4, .4, { col: '#496d5a' }, { y: 4, solid: false }); for (let i = 0; i < 5; i++) b.add('box:.5:.7:.1', [-15.6 + i * 1.8, 1.6, 29.9], { col: '#92dbb6', emis: .35, shiny: .6 });   // the bottle house, glinting
  b.box(8, 32, 8, 6, 3, { col: '#c8b090', tex: 'stucco', ts: 3 }); b.add('box:6:2.4:.2', [8, .6, 29.1], { col: '#7a624a' });   // the ruined saloon
  b.box(-2, 30, 12, 9, 4.5, { col: '#b6a888', tex: 'stucco', ts: 3 }); b.add('box:10:.6:1', [-2, 0, 25.2], { col: '#8a7a5a', tex: 'wood', ts: 1 }); for (let i = 0; i < 4; i++) b.add('box:1.6:.5:.2', [-6.4 + i * 3, 2.6, 25.36], { col: '#6d5a3a', tex: 'wood', ts: 1 }); b.sign(-2, 4, 25.4, 5, 1, '#b62424', { rad: 5, lz: -1 });   // THE POST OFFICE: boarded, shuttered, sandbagged
  b.box(36, 16.5, 20, 9, .5, { col: '#8a8276', tex: 'wood', ts: 3 }); b.box(36, 12, 1, 4, 3.4, { col: '#b69249', tex: 'wood', ts: 2 }); b.box(38, 12, 1, 4, 3, { col: '#b69249', tex: 'wood', ts: 2 }); b.sign(36, 4.4, 14, 10, 1.2, '#e8d848', { rad: 9, lz: -1.4 });   // the depot platform, its waiting room, its sign
  b.add('plane:120:.5', [30, .02, 21.6], { col: '#49403a', shiny: .3 }); for (let i = 0; i < 15; i++) b.add('plane:.3:2.4', [-30 + i * 8, .025, 21.6], { col: '#5a4a3a', tex: 'wood', ts: 1 });   // the rails, going nowhere
  b.cyl(46, 26, .5, 9, { col: '#7a6a5a' }, { solid: true, seg: 8 }); b.cyl(46, 26, 2.4, 2.4, { col: '#8a7a6a' }, { y: 9, seg: 10, solid: false });   // the water tower, one town over in spirit
  b.car(-24, 8, .1, '#e8e8e8'); b.car(12, 5, -.1, '#e8e8e8'); b.car(28, 24, 2.2, '#e8e8e8');
  b.box(2, 10, 3, .8, 1, { col: '#e8e8e8' }); b.add('box:2.4:.8:.1', [2, .8, 9.64], { col: '#ff4949', emis: .3 });   // the roadblock sawhorse
  b.lamp(-14, 10, { h: 5, col: [1, .7, .5], rad: 10 }); b.lamp(18, 16, { h: 5, col: [1, .7, .5], rad: 10 }); b.lamp(-40, 18, { h: 5, col: [.9, .8, 1] });
  b.cactus(-52, 14, 3.4); b.cactus(52, 8, 2.8); b.cyl(20, 34, .3, 2.2, { col: '#7a6a5a' }, { solid: true, seg: 6 }); b.cyl(24, 36, .3, 2.6, { col: '#7a6a5a' }, { solid: true, seg: 6 });   // the dead garden
  b.walkRect(-46, 2, 44, 26.5); b.walkRect(-17.4, 24, -7, 29); b.walkRect(-38, 24, -30, 29); b.walkRect(-44, 24, -37, 38); b.walkRect(-40, 31, -28, 38); b.walkRect(28, 10, 46, 24.5);
  b.autoCams(-46, 2, 47, 28, 13.3, 11, 11, 10, .95);   // high and back: the old hand cameras lost most of the street
  b.cam('bankback', [-36, 10, 49], [-36, .8, 33], 1.0, [-46, 29, -26, 40]);   // behind the bank, looking back south
  b.cam('platform', [39.5, 8, 34], [39.5, .8, 19], 1.0, [32, 17.5, 47, 27]);   // the station platform, from behind: its sign hid the far side
  SCENES.ghost_main = Object.assign(b.fin(), { start: [-44, 0, 6], arrive: [-44, 6, 1.5], shipExit: [-44, 6, 1.5] });
})();
// ---- inside the post office: dust sheets, brass boxes, the shotgun, Opal ----
(() => {
  const b = SB({ amb: [.34, .3, .28], sun: { dir: [.2, 1, -.3], col: [.34, .28, .2] }, sky: ['#1a1020', '#2a1a14'], fog: { col: '#201810', dens: .005 }, music: 'rhyolite', title: 'THE LAST POST OFFICE' });
  b.ground(16, 12, { col: '#8a7a5a', tex: 'wood', ts: 2, shiny: .2 }, 0, 6);
  b.box(0, 11.4, 16, .6, 4.2, { col: '#b6a888', tex: 'stucco', ts: 3 }); b.box(-8, 5.5, .6, 12, 4.2, { col: '#b6a888', tex: 'stucco', ts: 3 }); b.box(8, 5.5, .6, 12, 4.2, { col: '#b6a888', tex: 'stucco', ts: 3 });
  b.box(0, 7.6, 8, 1.6, 1.1, { col: '#6d4924', tex: 'wood', ts: 2 }); for (let i = -3; i <= 3; i++) for (let j = 0; j < 2; j++) b.add('box:.6:.5:.2', [i * 1.1, 1.7 + j * .7, 10.7], { col: '#b6923a', shiny: .7, emis: .1 });   // the counter and its brass boxes
  for (let i = 0; i < 3; i++) b.add('box:1.4:2.4:.2', [-5.6, 1.3, 11.2], { col: '#e8d8a0', emis: .3 - i * .1 });   // light through the boards
  b.box(-5, 3.4, 1.4, 1.2, 1, { col: '#30303a', tex: 'metal', ts: 1 }); b.add('box:.5:.4:.5', [-5, 1.1, 3.4], { col: '#ff8a30', emis: .9 });   // the stove, lit
  b.box(5.4, 3.4, 1.6, 1.4, 1, { col: '#8a7a5a', tex: 'wood', ts: 1 }); b.add('box:1.2:.4:.6', [5.4, 1.15, 3.4], { col: '#496d92' });   // the sorting table, one sack of dead letters
  b.lights.push({ p: [0, 3.4, 5], col: [1, .85, .6], rad: 12, int: 1.2 }, { p: [-5, 1.6, 3.4], col: [1, .55, .2], rad: 5, int: 1.2, glow: 1.2 }, { p: [0, 2.4, 9.5], col: [1, .8, .5], rad: 6, int: .9 });
  b.walkRect(-6.4, 1, 6.4, 6.4);
  b.cam('po', [0, 8, -6.5], [0, 1.2, 6.5], 1.0, [-20, -20, 20, 20]);
  SCENES.ghost_post = Object.assign(b.fin(), { start: [0, 0, 1.6] });
})();
// ---------------- the drive in, the arrival ----------------
DRIVELINES[11] = [[90, DI, 'Rhyolite Springs. Population zero, give or take. The give-or-take is why we\'re nervous, Carl.'], [520, GA, 'A ghost town with new cars in it, kid. That\'s not a ghost town. That\'s an office.'], [900, DI, 'The postal map still lists a contract office there. Holder of record: O. Something. The record\'s water-damaged at the important part.']];
ARRIVE[11] = async () => {
  await say2([['CARL', 'A town that died standing up. The bank has a face and no back. Like everybody here is posing.'], [U0, 'carl the cars'], ['CARL', 'White sedans. Three of— four. They\'re parked like punctuation. Somebody is making a POINT here.'], [DI, 'Carl, those are Service vehicles. Walk casual. You have never once walked casual. Try.']]);
  setObj3('The post office, up the street', 'ghost_main', 'po_shutter');
};
// ---- the guards: patrol loops, and being seen is a problem ----
function mkGuard(id, pts, spd) {
  let i = 0;
  const e = { id, kind: 'npc', model: 'suit', label: SV, at: [pts[0][0], 0, pts[0][1]], range: 0, block: 1.15, yaw: 0,
    upd(e) {
      if (e.stop) return;
      const T = pts[(i + 1) % pts.length], dx = T[0] - e.p[0], dz = T[1] - e.p[2], d = Math.hypot(dx, dz);
      if (d < .3) i++;
      else { e.p[0] += dx / d * spd; e.p[2] += dz / d * spd; e.yaw = Math.atan2(dx, dz); }
      const cx = CARL.p[0] - e.p[0], cz = CARL.p[2] - e.p[2], cd = Math.hypot(cx, cz);
      if (cd > .01 && cd < 2.4 && (cx * Math.sin(e.yaw) + cz * Math.cos(e.yaw)) / cd > .45) caughtBy(e);
    } };
  return e;
}
async function caughtBy(e) {
  e.stop = 1; e.yaw += Math.PI; C3.caught11 = (C3.caught11 || 0) + 1;
  tickC('CARL NO', 'user_000');
  wstory(async () => {
    await say2([[SV, 'Sir. Federal audit. The street is closed to foot traffic of interest.'], ['CARL', 'I\'m not of interest. I\'m barely of note.'], [SV, 'Then you won\'t mind being escorted back to your vehicle.'], ['CARL', 'I mind a normal amount.']]);
    CARL.p = SCENES.ghost_main.start.slice(); CARL.vx = CARL.vz = 0; pickCam(true);
    if (C3.caught11 === 1) await say('THE AGENT WALKS BACK TO HIS SEDAN TO FILE PAPERWORK ABOUT YOU. THE OTHERS KEEP THEIR LOOPS. BUREAUCRACY HAS A SHORT ATTENTION SPAN. USE IT.');
    else await say('ANOTHER FORM GETS FILED. ANOTHER AGENT LEAVES THE PATROL. THE TOWN IS RUNNING OUT OF ATTENTION, AND YOU ARE RIGHT HERE.');
    setObj3('The post office, up the street', 'ghost_main', 'po_shutter');
  });
}
SCENES.ghost_main.ents = () => [
  shipDoor('ass11', -45, 6, 1.5),
  mkGuard('g1', [[-30, 10], [-2, 10], [-2, 18], [-30, 18]], .014),
  mkGuard('g2', [[4, 6], [30, 6], [30, 14], [4, 14]], .013),
  mkGuard('g3', [[16, 18], [38, 18], [38, 23], [16, 23]], .012),
  { id: 'po_shutter', kind: 'prop3', at: [-2, 0, 25.0], label: 'POST OFFICE', range: 2.2, talk: () => poShutter(), draw3: () => {} },
  npc3('euclid', 'euclid', -33, 34.6, EU, () => euclidTalk(), { yaw: 1.2 }),
  { id: 'i9b', kind: 'npc', model: 'inspector', at: [36, .4, 20.6], label: I9B, range: 3.2, yaw: Math.PI, cond: () => !F3('i9seen'), talk: () => i9Talk() },
  { id: 'bank11', kind: 'prop3', at: [-34, 0, 28.4], label: 'THE BANK', range: 2.6, look: 'A BANK FRONT WITH NO BANK BEHIND IT. THE DOOR IS PAINTED ON. IN 1907 THIS WAS A JOKE ABOUT SPECULATION. NOW IT\'S JUST EFFICIENT.' },
  { id: 'bottle', kind: 'prop3', at: [-12, 0, 28.4], label: 'BOTTLE HOUSE', range: 2.8, look: 'A HOUSE BUILT FROM TEN THOUSAND BOTTLES, SALVAGED AND LAID IN MORTAR. IT GLISTENS. IT HAS OUTLIVED THE TOWN THAT DRANK IT INTO EXISTENCE.' },
  { id: 'sedan11', kind: 'prop3', at: [12, 0, 5], label: 'WHITE SEDAN', range: 2.8, look: 'A WHITE SEDAN, MOTOR TICKING, NOBODY IN IT. ON THE DASH: A THERMOS, A CLIPBOARD, AND A STACK OF ENVELOPES, ALL OPENED, ALL RE-SEALED WITH TAPE.' },
];
SCENES.ghost_post.ents = () => [
  { id: 'po_out', kind: 'prop3', to: 'ghost_main', at: [0, 0, .9], label: 'OUTSIDE', range: 1.6, talk: () => goScene('ghost_main', -2, 23, Math.PI), draw3: () => {} },
  npc3('opal', 'opal', 0, 8.6, OP, () => opalTalk(), { yaw: Math.PI, range: 3.2 }),
  { id: 'shotgun', kind: 'prop3', at: [2.8, 0, 6.8], label: 'THE SHOTGUN', range: 2.2, look: 'A DOUBLE BARREL, OLDER THAN THE STATE, LEANING ON THE COUNTER WITHIN REACH OF THE STOOL. A SACK BESIDE IT: ROCK SALT, FINE, TABLE-GRADE.' },
  { id: 'sack', kind: 'prop3', at: [5, 0, 4.8], label: 'DEAD LETTERS', range: 2.4, look: 'ONE SACK OF DEAD LETTERS, TIED WITH TWINE. EVERY EVENING AT SIX SHE READS THEM ALOUD TO THE EMPTY ROOM. THE ROOM IS THE TOWN NOW. IT ALWAYS LISTENS.' },
];
// ---------------- through the shutter ----------------
async function poShutter() {
  if (F3('opalOpen')) { sfx('door'); await goScene('ghost_post', 0, 1.6, 0); return; }
  if (!F3('opalMet')) {
    setF3('opalMet');
    await say('THE SHUTTERED POST OFFICE. A SLOT AT EYE HEIGHT SLIDES OPEN. ONE EYE, EIGHTY YEARS OLD AND NONE OF THEM TIRED, LOOKS OUT.');
    await say2([[OP, 'Closed. Has been since the mail stopped coming, which was after the people stopped coming, which was after everything else. State your business at the slot.'], ['CARL', 'I have a parcel. I\'m following its stamps. I need the next one. There\'s always a next one.'], [OP, '...The next one. That\'s a courier\'s sentence. Say the rest of it.']]);
  }
  for (;;) {
    const c = await claimMenu(OP, 'Say what you are, and mean it.', F3('opalNudge') ? ['courier'] : ['courier', 'inspector', 'maintenance'], { stop: 11 });
    if (c === 'courier') break;
    if (c === 'inspector') await say2([[OP, 'The Service said "inspector" for a month in the spring. I counted their shoes. Six pairs, one size. Inspectors come in sizes.'], ['CARL', 'That\'s— I\'m a different—'], [OP, 'You\'re a different SIZE? They don\'t come in your size. Next.']]);
    else await say2([[OP, 'The boiler man died in \'61. You\'re not him. He was taller and he laughed at his own jokes. You look like you\'ve never laughed.'], ['CARL', 'I laugh. Chat, tell her I laugh.'], [U0, 'he does not'], [OP, 'The chat has spoken.']]);
    if (!F3('opalNudge') && ((C3.caught11 || 0) >= 2 || C3.alibis.length > 4)) { setF3('opalNudge'); await say2([[OP, 'Enough. Only one kind of person stands at a shutter this long with a box under his arm and doesn\'t lie about the box.'], ['CARL', 'What kind?'], [OP, 'The kind I\'ll unbolt for. Say the true thing.']]); }
  }
  await say('"A COURIER," HE SAYS. "A REAL ONE. THE PARCEL IS ADDRESSED TO ME." A PAUSE, LONG ENOUGH TO MAIL SOMETHING.');
  await say2([[OP, 'Nineteen years I\'ve waited to hear a man say his job out loud at my slot. The last fella said "auditor." The one before said "consultant." You said the WORD.'], [OP, 'Three bolts. Two bars. Hold your horses. I\'m eighty-six.']]);
  setF3('opalOpen'); sfx('door'); sfx('door');
  await goScene('ghost_post', 0, 1.6, 0);
  if (!F3('opalIn')) { setF3('opalIn'); run(async () => { await say2([['CARL', 'It\'s dust sheets, brass boxes, and a shotgun within reach of a stool. It\'s the most alive post office I\'ve ever been in.'], [OP, 'Sit anywhere. Not the stool.']]); setObj3('Talk to Opal at the counter', 'ghost_post', 'opal'); }); }
}
async function euclidTalk() {
  if (!F3('euclidMet')) { setF3('euclidMet'); await say2([[EU, 'Don\'t mind the bottles. I water \'em on a schedule. Glass likes a schedule. Keeps it from remembering it was sand.'], ['CARL', 'You live here? In the town with the—'], [EU, 'Sedans. Yep. They asked to buy my bottles. I said the bottles are load-bearing.']]); }
  else await say(pick(['The tall ones bottled the town\'s spring water once. Said it tasted like "later." I drank some. It does.', 'The Service fellows read their own mail at night. I hear the laughing. There isn\'t any.']), EU);
  if (!F3('euclidTip')) { setF3('euclidTip'); await say2([[EU, 'You\'re going to Opal. Walk when they walk away from you. Stand when they turn. It\'s a dance. It\'s the world\'s saddest dance.'], ['CARL', 'That\'s how you\'ve stayed—'], [EU, 'I\'ve been doing the saddest dance since Reagan, boy.']]); addNote('EUCLID: walk when they walk away; stand when they turn. "The world\'s saddest dance."'); }
}
async function i9Talk() {
  setF3('i9seen');
  await say2([[I9B, 'The courier. Number Nine. I know the number of every story you have told on this route.'], ['CARL', 'Are you going to—'], [I9B, 'East. The Sorting Center. Before they finish reading.']]);
  await say('HE STEPS DOWN FROM THE PLATFORM, WALKS INTO THE DUST PAST THE SEDANS, AND DOES NOT LOOK BACK. THE DUST DOES NOT SETTLE WHERE HE WALKED.');
  addNote('INSPECTOR 9, seen on the depot platform: "East. The Sorting Center. Before they finish reading." Nothing resolved.');
  const e = ent3('i9b'); if (e) e.gone = 1;
}
// ---------------- the last honest clerk ----------------
async function opalTalk() {
  if (F3('done11')) return say(pick(['East, and don\'t dawdle. The mail is patient but the readers aren\'t.', 'Come back when there\'s a town again. I\'ll keep the light boards on.']), OP);
  if (!F3('opalCard')) {
    setF3('opalCard');
    await say2([[OP, 'The card. Here. Nineteen years in a drawer under the dead letters, and I can still recite it. "A courier will come. He will be short. He will argue about being normal. Do not argue. STAMP IT."'], ['CARL', 'That\'s the card. That\'s my whole— that\'s the whole card.'], [OP, 'I didn\'t argue for nineteen years, and I didn\'t stamp for nineteen years, because the courier never came. You\'re late.'], ['CARL', 'I stopped at a casino.'], [OP, 'It\'s a good casino.']]);
    await say2([[OP, 'Two tall ones left it. Polite. Paid a box fee in stamps that weren\'t stamps. Cleared anyway, which still steams me. They stood at my counter very close together, like one person who\'d been halved carefully.'], [OP, 'The woman put her hand flat on the counter, like she was leaving a handprint in a wet sidewalk. She said "not yet." Then they walked out THROUGH the spring heat and the heat got out of their way.'], ['CARL', 'Do you know where they—'], [OP, 'I know where my mail goes. Nowhere. That\'s the whole trouble with this town, and it isn\'t my trouble to fix.']]);
    addNote('OPAL: the tall ones, one hand flat on her counter, "not yet." She has waited 19 years without arguing.');
    await say2([[OP, 'The Service came in the spring. White sedans, white manners. They\'ve been reading the mail in this town since the mail stopped coming, which is the only growth industry left.'], ['CARL', 'Reading WHOSE mail? There\'s nobody here.'], [OP, 'Ours. The dead letters. The bottle house\'s. They read the letters nobody sent, boy. That\'s how you know they\'ve got nothing.'], ['CARL', 'And they let you keep the office?'], [OP, 'They offered to buy my stamps. I offered them rock salt at speed. We reached an understanding.']]);
    addNote('OPAL: the Service reads the dead mail of Rhyolite. They offered to buy her stamps. Rock salt at speed.');
  }
  await say('"SIGN," SHE SAYS, AND SLIDES THE LEDGER ACROSS WITH TWO HANDS, THE WAY YOU SLIDE SOMETHING THAT HAS WEIGHT BEYOND PAPER.');
  const s = await ask('SIGN AT THE LAST WINDOW?', OP, ['SIGN', 'NOT YET']); if (s !== 0) { setObj3('Sign at the counter', 'ghost_post', 'opal'); return; }
  await signature('FORWARD, RHYOLITE SPRINGS'); C3.route[11] = 1;
  await say('THE STAMP IS RED AND HONEST AND DRY. IT COMES DOWN LIKE A PERIOD AT THE END OF A NINETEEN-YEAR SENTENCE. THE ROOM SETTLES.');
  await say2([[OP, 'Nine stamps. Two to go. Next is east: the Sorting Center, the big one, underground. Ask for Margo at the dock.'], ['CARL', 'I know the password.'], [OP, 'Passwords change. Clerks don\'t. Ask for the CLERK, not the password.'], [OP, 'And boy. The one they call Number Nine. He stood on that platform three days watching my door before you came. He didn\'t come in. He wanted to. Remember that I told you.']]);
  addNote('STAMP 9: RHYOLITE SPRINGS (OPAL). "Ask for the clerk, not the password." Inspector 9 watched her door for three days and didn\'t come in.');
  setF3('done11'); setF3('pendingCall11'); setObj3('Back to the ship', 'ghost_main', 'ass11');
}
SHIPCALL[11] = async () => {
  await say2([[DI, 'Rhyolite stamp, on the tracker, and— Carl, the tracker\'s showing a second signal near the sorting center. Non-postal. It\'s been there three days.'], ['CARL', 'Watching the door.'], [DI, 'How did you—'], ['CARL', 'A clerk told me. That\'s the whole postal service, Dispatch. Clerks, telling people things.']]);
  setRouteObj();
};
RADIOTALK.DISPATCH[11] = async () => { await say2([[DI, 'Rhyolite\'s office has been on the rolls since 1907 with one holder of record. No successor named. No closure filed. Some records just refuse, Carl.'], ['CARL', 'Is that legal?'], [DI, 'It\'s better than legal. It\'s stubborn.']]); };
RADIOTALK['JB GARFIELD'][11] = async () => { await say2([[GA, 'A town full of feds and one lady with a shotgun, and the lady\'s winning on points, kid. I\'ve staked out tougher. Never cleaner.'], ['CARL', 'How do you win a stakeout?'], [GA, 'You already have, kid. She filed no reports. They filed a trunk.']]); };
RADIOTALK['SPOOKY GHOST'][11] = async () => { await say2([[GH3, 'A GHOST town, bro. Do you know what a ghost town is to me? A VENUE.'], ['CARL', 'Please don\'t haunt it.'], [GH3, 'Too late. I\'m the second feature. The bottles have acoustics. I sang one (1) chord and a wall held its note back.']]); };
RADIOTALK['CEO LINDA'][11] = async () => { await say2([[LI3, 'They\'re reading dead letters. That\'s market research on a market that ended. I\'ve fired whole floors for less.'], ['CARL', 'You sound like you respect her.'], [LI3, 'She kept her office with rock salt. I kept mine with lawyers. Same shotgun, different gauge.']]); };
CBTALK[11] = [['CH 19', '...Rhyolite\'s lit up again, breaker. Town\'s been dead thirty years and now it\'s got a motor pool...'], ['CH 19', '...little old lady in the post office turned federal auditors away TWICE. Rock salt, they\'re saying. I believe it...'], ['CH 19', '...if the tall suits ask you what you\'re hauling, tell \'em Sunday. Nobody checks Sunday...']];
REVISIT[11] = async () => { if (F3('done11')) await say2([[OP, 'Back east already? The boards are still on. The bolts still work. The salt\'s still fine.']]); };
