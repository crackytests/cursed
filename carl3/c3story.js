'use strict';
// ================= CARL 3: the road. the ship, the radio, the drive, and the framework every stop hangs on =================
let OBJ3 = null; // { text, scene, id }: the next thing to do, shown on screen. the test bot follows it too.
function setObj3(text, scene, id) { OBJ3 = text ? { text, scene, id } : null; DBG.obj = OBJ3; }
const CS = a => say(a[0], a[1], a[2]);           // say from a [text, who] pair
const CA3 = (t, o) => say(t, 'CARL', o);
const DI = 'DISPATCH', GA = 'JB GARFIELD', GH3 = 'SPOOKY GHOST', LI3 = 'CEO LINDA', U0 = 'USER_000';
const sceneAfter = {};                           // which scene the hatch returns to
async function say2(lines) { for (const [who, t] of lines) await say(t, who); }
// ---------------- the stops ----------------
const STOPTAB = [
  { id: 'lot', name: 'THE LOT', scene: 'ship' },
  { id: 'canyon', name: 'BOX CANYON', scene: 'canyon_main', road: 'a dead town with a working post office', sky: ['#1a0a3a', '#ff7a40'], ground: '#4a3028' },
  { id: 'motel', name: 'STARLITE MOTOR COURT', scene: 'motel_lot', road: 'a motel that has never been full', sky: ['#000018', '#3a1a5a'], ground: '#1a1428' },
  { id: 'plaza', name: 'BIG LEON\'S TRAVEL PLAZA', scene: 'plaza_lot', road: 'a truck stop the size of a small airport', sky: ['#000014', '#2a1450'], ground: '#1c1824' },
  { id: 'mall', name: 'DESERT PALMS MALL', scene: 'mall_out', road: 'a mall that closed before the internet', sky: ['#0a1030', '#7a4a6a'], ground: '#2a2428' },
  { id: 'sorting', name: 'NEVADA REGIONAL SORTING CENTER', scene: 'sort_dock', road: 'a loading dock in the middle of nowhere', sky: ['#000010', '#1a1a3a'], ground: '#14141c' },
  { id: 'dlo', name: 'THE DEAD LETTER OFFICE', scene: 'dlo', road: 'the address that shouldn\'t exist', sky: ['#000008', '#10102a'], ground: '#0c0c14' },
];
function stopHint() { return ({ 0: 'Get in the pilot seat. The helm is the red chair.', 1: 'The post office. It is closed. Somebody there knows where the parcel has been.', 2: 'Room 6. The manager has a key. She wants a reason.', 3: 'The lounge. There are six TVs and four VCRs. One of them is right.', 4: 'The power is off. The breaker is in the maintenance hall. Somebody is still waiting at Unit 14.', 5: 'The dock inspector wants paperwork. The dead-letter chute does not.', 6: 'Sign for it. Be yourself. It is harder than the wires.' })[C3.stop] || 'Go somewhere.'; }
// ---------------- new game ----------------
async function newGame3() {
  C3 = newC3(); C3.bux = 20; music(null); post.fade = 0; setObj3(null);
  await coldOpen3();
  scene = worldScene3; loadScene('ship', 0, 2.4, 0); post.fade = 1; await fadeIn(.08);
  setObj3('Answer the radio', 'ship', 'radio');
  run(prologue);
}
async function coldOpen3() {
  const T = ['#9bbc0f', '#8bac0f', '#306230', '#0f380f'].map(hex), card = (lines, t = 120) => showCard(lines, t, { bg: T[3], fg: T[0] });
  music('prev');
  await card(['PREVIOUSLY, ON CARL:'], 100);
  const e = OTH.carl2 && OTH.carl2.ends || {};
  if (e.belowbelow) { await card(['HE WALKED OUT OF A STUDIO', 'AT DAWN.'], 120); await card(['HE FOLLOWED TWO SETS', 'OF TALL FOOTPRINTS.'], 120); await card(['THE FOOTPRINTS STOPPED', 'AT A ROAD.'], 120); }
  else if (e.renewed || (OTH.carl2 && OTH.carl2.renewed)) { await card(['HE WAS RENEWED.', 'THEY CALLED IT', 'CARL 3: HU-MAN 3000.'], 130); await card(['IT WAS RETURNED', 'TO SENDER.'], 110); }
  else if (e.canceled) { await card(['THEY CANCELED HIM', 'AFTER ONE SEASON.'], 110); await card(['HE WENT BACK', 'TO THE ROAD.'], 110); }
  else { await card(['HE JUMPED A SHARK.', 'HE WENT TO SPACE.'], 110); await card(['HE WENT BACK', 'TO THE ROAD.'], 110); }
  music(null); scene = { draw() { cls(BLACK); } }; await wait(30);
  await showCard(['CARL 3', 'RETURN TO SENDER'], 140, { fg: hex('#ffd848'), sc: 2 });
}
async function prologue() {
  await wait(40);
  await say2([[DI, 'Carl. Carl, pick up. I know you\'re in there. The ship is making the sound it makes when you\'re in there.'], ['CARL', 'It\'s the heater.'], [DI, 'It\'s not the heater. You have a delivery.']]);
  await say('A PARCEL HAS APPEARED ON THE PILOT SEAT. THERE IS NO CHUTE. THE CEILING LOOKS NORMAL.');
  addParcel({ id: 'p0', desc: 'THE PARCEL', toName: 'CARL', from: '?????', model: 'parcel' });
  setObj3('Look at the parcel on the pilot seat', 'ship', 'seat');
}
// ---------------- the ship ----------------
SCENES.ship.ents = () => [
  { id: 'radio', kind: 'prop3', at: [-5.8, 0, 7.6], label: 'RADIO', range: 2.6, talk: () => radioMenu(), draw3: () => {} },
  { id: 'seat', kind: 'prop3', at: [0, 0, 5.6], label: 'PARCEL', range: 1.6, cond: () => !F3('seenP0'), talk: () => seeParcel(), draw3: () => {}, promptY: -.5 },
  { id: 'helm', kind: 'prop3', at: [0, 0, 5.6], label: 'HELM', range: 2.0, talk: () => driveMenu(), draw3: () => {} },
  { id: 'cargo', kind: 'prop3', at: [5.8, 0, 3.4], label: 'CARGO', range: 2.6, talk: () => cargoLook(), draw3: () => {} },
  { id: 'bunk', kind: 'prop3', at: [-5, 0, 3.4], label: 'BUNK', range: 2.4, talk: () => bunk(), draw3: () => {} },
  { id: 'monitor', kind: 'prop3', at: [6.2, 0, 5.4], label: 'CHAT', range: 2.0, talk: () => askChat3(), draw3: () => {} },
  { id: 'hatch', kind: 'prop3', to: () => STOPTAB[C3.stop].scene, at: [0, 0, 0.9], label: 'HATCH', range: 1.8, talk: () => leaveShip(), draw3: () => {} },
];
SCENES.ship.drawOver = () => { // the parcels piled in the cargo bay
  const carry = C3.parcels.filter(p => p.status === 'carry'); const sc = WX.sc;
  carry.forEach((p, i) => { const m = p.model === 'crate' ? MODEL.crate : p.model === 'her' ? MODEL.parcelHer : MODEL.parcel, x = 5.2 + (i % 3) * .62, z = 1.8 + Math.floor(i / 3) % 3 * .5, y = Math.floor(i / 9) * .36; drawModel(m, { p: [x, y, z], yaw: (i * .7) % 1 }, liveLight(sc, [x, y, z])); });
};
async function seeParcel() {
  setF3('seenP0');
  await say2([['CARL', 'It\'s a box. Boxes come to me. I\'m a delivery guy.'], [DI, 'Read the label.'], ['CARL', 'To... Carl. From. From... it\'s smudged. Chat, is that a smudge or is it a different word.']]);
  await say('THE ADDRESS READS: "CARL, [[[[[ / ABOVE AND BELOW / NEVADA". BELOW IT, A STAMP: "NO SUCH ADDRESS. HOLD."');
  await say2([[DI, 'Postage is paid. It\'s been paid since before you were born. Please don\'t ask me how.'], ['CARL', 'How.'], [DI, 'I said don\'t.'], ['CARL', 'It says "No such address." Return to sender. That\'s the rule. Return to sender.'], [DI, 'The sender\'s address is also the address.'], ['CARL', 'That\'s not a thing.'], [DI, 'It\'s a thing on your seat.']]);
  tickC('carl open the box', U0); tickC('DONT open the box', 'postal_andy');
  await say2([['CARL', 'I\'m not opening it. That\'s not what you do. You deliver it. To the address. Where is the address, Dispatch.'], [DI, 'Nobody knows. Mail doesn\'t skip stops, though. It goes where it\'s been. If you follow the route it\'s been on, you\'ll get where it\'s going.']]);
  await say('THE PARCEL HAS BEEN CANCELED ELEVEN TIMES. THE FIRST POSTMARK IS FADED BUT LEGIBLE: "BOX CANYON, NV."');
  addNote('Parcel postmark: BOX CANYON, NV. (first stamp)'); C3.route[0] = 1;
  await say2([[GA, 'Kid. Garfield here. Dispatch patched me in. I don\'t leave the diner. I leave the diner on the radio.'], [GA, 'Eleven cancellations. Somebody wanted that box to take its time. That\'s not an accident. That\'s a decision.'], ['CARL', 'Who makes a decision to be slow?'], [GA, 'Someone who wants to be fast later.']]);
  setObj3('Take the helm and drive to Box Canyon', 'ship', 'helm');
}
async function cargoLook() {
  const c = C3.parcels.filter(p => p.status === 'carry');
  if (!c.length) return say('THE CARGO BAY IS EMPTY. IT ECHOES. IT SOUNDS LIKE A MAILBOX AFTER THE HOLIDAYS.');
  await say('IN THE CARGO BAY: ' + c.map(p => p.desc + ' (TO ' + p.toName + ')').join('; ') + '.');
  await say(pick(['CARL: I don\'t remember loading half of these.', 'CARL: They\'re all addressed. That\'s a good sign. Nothing\'s addressed to "occupant."', 'CARL: Don\'t look at the one that says Carl. It looks back.']));
}
async function bunk() {
  const i = await ask('THE BUNK. IT\'S A BUNK.', null, ['SAVE AND REST', 'NOT NOW']); if (i !== 0) return;
  saveC3(); sfx('ok'); await fadeOut(.04); await wait(30); await fadeIn(.04); tickC(pick(['he sleeps', 'carl is asleep', 'zzz']));
  await say('SAVED. CARL SLEEPS FOR EIGHT MINUTES. IT FEELS LIKE ONE. THE SHIP HUMS.');
}
async function leaveShip() {
  const st = STOPTAB[C3.stop].scene; if (C3.stop === 0) return say('CARL: There\'s nothing outside but the lot. The lot is where I park. I\'m already home.', 'CARL');
  await goScene(st, ...(SCENES[st].shipExit || [SCENES[st].start[0], SCENES[st].start[2], 0]));
}
async function driveMenu() {
  if (!F3('seenP0')) return say('CARL: I should look at the parcel first. The helm is a big decision.', 'CARL');
  const next = C3.stop + 1;
  if (next >= STOPTAB.length) return say('CARL: This is the end of the road. It says so on the map.', 'CARL');
  if (!F3('done' + C3.stop) && C3.stop > 0) return say(stopHint(), 'CARL');
  const c = await ask('THE ROUTE CARD SAYS: ' + STOPTAB[next].name + '.', null, ['DRIVE', 'NOT YET']); if (c !== 0) return;
  await doDrive(next);
}
async function doDrive(next) {
  const S0 = STOPTAB[next]; await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; music(null);
  await showCard(['STOP ' + next, '', S0.name], 110, { fg: hex('#ffd848') });
  scene = { draw() { cls(BLACK); } };
  await driveUntil({ dur: 1100 + next * 40, title: S0.name, lines: DRIVELINES[next] || [], sky: S0.sky, ground: S0.ground, music: 'drive' });
  C3.stop = next; setF3('arrived' + next);
  scene = worldScene3; loadScene(S0.scene, ...(SCENES[S0.scene].arrive || [SCENES[S0.scene].start[0], SCENES[S0.scene].start[2], 0])); post.fade = 1; await fadeIn(.08);
  run(() => ARRIVE[next] && ARRIVE[next]());
}
const ARRIVE = {}, DRIVELINES = {};
// ---------------- the radio ----------------
async function radioMenu() {
  const opts = ['DISPATCH', 'JB GARFIELD'].concat(F3('ghostOn') ? ['SPOOKY GHOST'] : []).concat(F3('lindaOn') ? ['CEO LINDA'] : []).concat(['HANG UP']);
  const i = await choose(opts, { x: 20, y: 40, cancel: 1 }); if (i < 0 || opts[i] === 'HANG UP') return;
  const who = opts[i], key = who + ':' + C3.stop;
  const T = RADIOTALK[who] && RADIOTALK[who][C3.stop];
  if (T && !F3('radio' + key)) { setF3('radio' + key); await T(); } else await say(pick(RADIOIDLE[who] || ['...static...']), who);
}
const RADIOTALK = { DISPATCH: {}, 'JB GARFIELD': {}, 'SPOOKY GHOST': {}, 'CEO LINDA': {} };
const RADIOIDLE = {
  DISPATCH: ['Dispatch. Nothing new. Mail is slow tonight. Mail is slow every night.', 'Still here. Still routing. Still not telling you how the parcel got on your seat.', 'Have you eaten. Not a bong. Food.'],
  'JB GARFIELD': ['Garfield. Nothing on the wire, kid. I did solve a crossword. It was in a language I made up.', 'Keep your eyes open. And your hat down. You don\'t have a hat. Wear the cap.'],
  'SPOOKY GHOST': ['Bro. I\'m in the radio. I\'m in a lot of radios. This one has the best acoustics.', 'I\'m not lonely. The radio is full of people. They\'re all weather.'],
  'CEO LINDA': ['I\'m billing you for the airtime.', 'Don\'t put your feet on my radio.'],
};
