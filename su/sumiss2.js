'use strict';
// ================= STICK UP: the expansion missions. the day job, STICK-NATION, the trip, JB Garfield, counseling, the Below, the heist prep =================
regBust('DR. PLUM', genBust({ skin: '#f0c8b0', hair: '#6d49b6', hairStyle: 'big', top: '#6d49b6', glasses: 1, collar: '#f0f0f0' }), '#b692ff');
regBust('HUMANS', genBust({ skin: '#dbb692', hair: '#6d6d6d', top: '#6d6d6d', tie: '#6d6d6d', collar: '#f0f0f0' }), '#b6b6b6');
// ---------------- PROP RUN: the day job ----------------
async function mPropRun() {
  await cut(() => lines([
    ['CARL', 'Oh no. It is Tuesday. I have a job.'], ['CARL', 'I am the Prop Pills delivery driver. The stick is a hobby. This is a career.'],
    ['CARL', 'The van is parked behind the crib. Three drops. Nobody tips. Everybody tips weird.'],
  ]));
  const van = spawnCar('van', PLACES.crib.x + 40, PLACES.crib.y + 52, 0, { drv: null, tag: 'pvan', col: '#ff49db', blip: '#ff49db' }); unstick(van);
  obj('GET IN THE PROP PILLS VAN.'); const m = mark(van.x, van.y, { follow: van, c: '#ff49db' });
  await until('m2_van', () => PL.car === van, () => van.wreck && 'THE VAN EXPLODED. PROP PILLS IS GOING TO HEAR ABOUT THIS.'); unmark(m);
  setMus('su_prop'); await deliveries(3, 'm2_drop');
  await cut(() => lines([['CARL', 'Shift done. Three customers. One was a horse.'], ['CARL', 'From now on the crib has a delivery board. A at the crib door. Money is money.']]));
  SU.reward = 300;
}
// ---------------- STICK-NATION ----------------
async function mStickNation() {
  await cut(() => lines([
    ['FACE', 'You need gear, Carl. There is a store in Midtown. Everything in it is a stick.'], ['CARL', 'A store. For me.'],
    ['FACE', "Also: the PROP PILLZ people have dealers in Midtown. Green Z hats. They sell to kids. Kids who want Prop Pills. Real ones. From you."],
  ]));
  obj('GO TO STICK-NATION IN MIDTOWN.'); const m = mark(PLACES.shop.x, PLACES.shop.y, { c: '#db9224', r: 14 });
  m.x = PLACES.shop.counter.x; m.y = PLACES.shop.counter.y; await until('m4_shop', () => onFootNear(PLACES.shop.counter, 22)); unmark(m);
  await cut(() => lines([
    ['STICK CLERK', 'Carl. Welcome to STICK-NATION. I have been waiting for a customer like you. A customer who believes.'],
    ['STICK CLERK', 'First one is free. The BIG STICK. It is the same stick. Bigger.'], ['CARL', 'It is beautiful.'], ['STICK CLERK', 'They all are. Come back with money. We have bombs that stick. We have a stick that joys.'],
  ]));
  if (!SU.wep.includes('BIG STICK')) SU.wep.push('BIG STICK'); SU.wi = SU.wep.indexOf('BIG STICK');
  const S = PLACES.shop; let hit = 0; const dealers = [];
  for (let i = 0; i < 14; i++) { const t = dropSpot(60, 320); const q = spawnPed(t.x, t.y, { tag: 'dealer', sh: hex('#24b649'), hair: hex('#6dff24'), hat: '#24b649', noHold: 1 }); q.onKnock = () => { hit++; pop(q.x, q.y, 'Z', '#6dff24'); }; dealers.push(q); }
  SU.timer = 60 * 90; setMus('su_tense'); obj('KNOCK OVER 10 PROP PILLZ DEALERS (GREEN HATS) WITH THE BIG STICK. C SWITCHES STICKS.');
  for (const q of dealers) q.script = d => { if (d2(d, PL) < 80 * 80) { d.a = Math.atan2(d.y - PL.y, d.x - PL.x); movePed(d, Math.cos(d.a) * .9, Math.sin(d.a) * .9); d.walk++; } else if (frame % 90 === 0) d.a = rnd(4) * 1.57; else movePed(d, Math.cos(d.a) * .4, Math.sin(d.a) * .4); };
  await until('m4_dealers', () => { SU.bar = { label: 'DEALERS', v: hit / 10, c: '#24b649' }; return hit >= 10; }, () => SU.timer <= 0 && 'THE DEALERS GOT AWAY. THE Z ENDURES.');
  SU.timer = 0; SU.bar = null; setMus(null);
  await cut(() => lines([['CARL', 'Ten Z hats. Chat, I am going to make a hat rack.'], ['FACE', 'STICK-NATION is open to you now. Buy things. Hold up the stores to pay for them. That is the economy.']]));
  SU.reward = 600;
}
// ---------------- GRASS ROOTS: the humans are coming ----------------
function parkSpot() { for (let ty = HR[2] + 3; ty < MH; ty++) for (let tx = 3; tx < 46; tx++) if (tAt(tx, ty) === TL.path && tAt(tx + 1, ty) === TL.path) return { x: tx * T + 16, y: ty * T + 16 }; return { x: PLACES.shop.x, y: PLACES.shop.y + 60 }; }
async function mGrassRoots() {
  SU.trip = Math.max(SU.trip, .5);
  await cut(() => lines([
    ['CARL', 'Chat. The colors from the lab have not gone away. It has been three days.'], ['CARL', 'Somebody left a flyer on the A.S.S. It says THE HUMANS ARE COMING. MEET AT THE PARK.'],
    ['CARL', 'I am a normal human. So I should go. To meet them. As one of them.'],
  ]));
  const P = parkSpot(); obj('GO TO THE PARK IN MIDTOWN.'); const m = mark(P.x, P.y, { c: '#24ffdb', r: 20 });
  await until('m7_park', () => onFootNear(P, 40)); unmark(m);
  SU.tripLock = 1; SU.trip = 1.2; SU.noLaw = 1; setMus('su_tense'); if (!SU.wep.includes('PEASHOOTER')) SU.wep.push('PEASHOOTER'); SU.wi = SU.wep.indexOf('PEASHOOTER');
  await cut(() => lines([['HUMANS', 'Hello. We are humans. We are here to ask one question.'], ['HUMANS', 'Are you a normal human?'], ['CARL', 'Yes.'], ['HUMANS', 'Are you a normal human?'], ['CARL', 'YES.'], ['HUMANS', 'Are you a normal human?'], ['CARL', 'Chat, there are so many of them. Peashooter. C switches. B shoots.']]));
  for (const [wave, n] of [[1, 6], [2, 10], [3, 14]]) {
    let popped = 0; const hs = [];
    for (let i = 0; i < n; i++) { const a = i / n * 6.28, q = spawnPed(P.x + Math.cos(a) * 170, P.y + Math.sin(a) * 140, { tag: 'human', sh: hex('#6d6d6d'), hair: hex('#6d6d6d'), skin: hex('#dbb692'), noHold: 1, sp: .5 + wave * .15 }); unstick(q);
      q.onKnock = h => { h.dead = 1; popped++; for (let k = 0; k < 10; k++) fx(h.x, h.y, 8, 'fire', (Math.random() - .5) * 3, (Math.random() - .5) * 3); pop(h.x, h.y, pick(['NORMAL!', 'HUMAN!', 'POP', 'ARE YOU', 'WE MEANT IT']), '#ffffff'); };
      q.script = h => { const d = Math.sqrt(d2(h, PL)); h.a = Math.atan2(PL.y - h.y, PL.x - h.x); if (d > 10) { movePed(h, Math.cos(h.a) * h.sp, Math.sin(h.a) * h.sp); h.walk++; } else if (frame % 40 === 0) { hurt(4); pop(PL.x, PL.y, 'ARE YOU A NORMAL HUMAN', '#b6b6b6'); } }; hs.push(q); }
    obj('WAVE ' + wave + '/3: POP THE HUMANS.'); bigText('WAVE ' + wave, '#24ffdb', 90);
    await until('m7_wave', () => { SU.bar = { label: 'HUMANS', v: popped / n, c: '#24ffdb' }; return popped >= n; });
    SU.bar = null; SU.hp = Math.min(100, SU.hp + 25);
    if (wave < 3) await cut(() => say(wave === 1 ? 'They pop like soap. Soap that asks questions.' : 'More are coming. They all have the same tie. That is how you know.', 'CARL'));
  }
  await cut(async () => { await lines([['HUMANS', 'Are you... a normal... human...'], ['CARL', 'I am a normal human.'], ['CARL', '...I am a normal human?']]); await fadeOut(.03); SU.tripLock = 0; SU.trip = .4; SU.noLaw = 0; if (PL.car) exitCar(true); PL.x = 49 * T + 16; PL.y = 30 * T + 16; unstick(PL); warpCam(); await wait(30); await fadeIn(.03); await lines([['CARL', 'I woke up on the beach. My mask is full of sand. The humans are gone.'], ['CARL', 'I won. I think. I am taking that as a win.']]); });
  SU.reward = 700;
}
// ---------------- THE FED: JB Garfield, private eye, deputized because he asked ----------------
async function mTheFed() {
  await cut(() => lines([
    ['JB GARFIELD', 'Vice Versa. A city with a pulse like a jukebox that only plays one song. The song is sirens.'], ['JB GARFIELD', 'You. The little guy in the mask. Sit down. That chair is a cat bed. Sit on the edge.'],
    ['CARL', 'Who are you.'], ['JB GARFIELD', 'JB Garfield. Private eye. The Bureau deputized me last week. I asked them. They said fine.'],
    ['JB GARFIELD', 'I have a file on you, Carl. Stick-ups. A lab. A yacht. It is a thick file. I added lasagna stains for texture.'],
    ['JB GARFIELD', 'Do a job for me and the file goes in a drawer. A man I am watching drives a beige sedan. Follow him. Not too close. Not too far. Like a good tail.'],
  ]));
  const D = PLACES.jb, mk = laneCar('sedan', 41, HR[4] + 1, { tag: 'mark', col: '#dbc892', cruise: 2.3, noEnter: 1 }) || laneCar('sedan', 43, HR[4] + 1, { tag: 'mark', col: '#dbc892', cruise: 2.3, noEnter: 1 }); let gr = 0;
  mk.blip = '#dbc892'; mk.script = c => { if (!PL.car) { c.vx = c.vy = 0; return; } c.script = null; }; // he waits at the light until you have wheels
  obj('GET A CAR AND TAIL THE BEIGE SEDAN. STAY IN THE GREEN ZONE.'); const m = mark(mk.x, mk.y, { follow: mk, c: '#dbc892', r: 22 });
  let prog = 0, close = 0;
  await until('m9_tail', () => {
    const d = Math.sqrt(d2(mk, plPos())); const good = PL.car && d > 70 && d < 240; if (good) prog++; if (d < 70 && PL.car) close++; else close = Math.max(0, close - 1);
    SU.bar = { label: d < 70 ? 'TOO CLOSE' : d > 240 ? 'TOO FAR' : 'TAILING', v: prog / (60 * 50), c: good ? '#6dff92' : '#ff2449' }; return prog >= 60 * 50;
  }, () => (++gr > 600 && Math.sqrt(d2(mk, plPos())) > 420 && 'YOU LOST HIM. JB SIGHS IN NOIR.') || (close > 150 && 'HE MADE YOU. HE WAVED. HE SEEMED NICE.') || (mk.wreck && 'YOU WRECKED THE MAN YOU WERE TAILING.'));
  SU.bar = null; unmark(m); mk.parked = 1; mk.vx = mk.vy = 0;
  obj('GET OUT AND SEE WHO HE IS.'); mark(mk.x, mk.y, { c: '#dbc892', r: 20 });
  await until('m9_look', () => onFootNear(mk, 40));
  await cut(() => lines([['CARL', '...JB. He is a mannequin. The whole time. Somebody put a mannequin in a car and it drove itself.'], ['JB GARFIELD', 'Then the case is bigger than I thought. Or smaller. I will need a bigger hat to think about it.'], ['JB GARFIELD', 'The file is in the drawer, Carl. For now. I will call you. Probably at night. Noir is mostly at night.']]));
  SU.reward = 800;
}
// ---------------- MARRIAGE COUNSELING ----------------
async function mCounseling() {
  await cut(() => lines([['SPOOKY GHOST', 'Carl. Linda and I are going to couples counseling. Dr. Plum. In Ghost Hills.'], ['CEO LINDA', 'We are not a couple. We are a merger that never closed.'], ['SPOOKY GHOST', 'Drive us. Neither of us will ride with the other unless someone neutral drives.'], ['CARL', 'I am very neutral.']]));
  obj('GET A CAR. GHOST AND LINDA WILL GET IN.'); await until('m11_car', () => PL.car && !CARM[PL.car.m].water && !CARM[PL.car.m].ship); SU.passenger = 'BOTH';
  obj('DRIVE THEM TO DR. PLUM IN GHOST HILLS.'); const D = PLACES.plum; mark(D.x, D.y + 40, { c: '#b692ff', r: 22 }); setMus('su_lounge');
  let warm = 0;
  for (const [q, opts] of [['Carl, tell her I tried.', ['HE TRIED.', 'HE TRIED. A LITTLE.', 'I AM JUST THE DRIVER.']], ['Carl. Tell him I built an empire while he sang.', ['SHE BUILT AN EMPIRE.', 'HE CAN SING THOUGH.', 'I AM JUST THE DRIVER.']]]) {
    await until('m11_drive', () => frame % 400 === 0 || near({ x: D.x, y: D.y + 40 }, 200));
    if (near({ x: D.x, y: D.y + 40 }, 200)) break;
    SU.cut = 1; const who = q.startsWith('Carl, tell her') ? 'SPOOKY GHOST' : 'CEO LINDA'; const c = DBG.auto ? 0 : await ask(q, who, opts); SU.cut = 0; if (c < 2) warm++;
    await say(c === 2 ? 'Neutral. Wow. Okay.' : 'Thank you, Carl.', who, { auto: 60 });
  }
  await until('m11_plum', () => near({ x: D.x, y: D.y + 40 }, 60));
  await cut(() => lines([
    ['DR. PLUM', 'Welcome. Ghost, Linda. And... the man in the ski mask.'], ['CARL', 'I am the driver. I am neutral.'], ['DR. PLUM', 'Ghost. Why are you here?'],
    ['SPOOKY GHOST', 'Because every ending I have ever had, I left before it. I want to stay for one.'], ['DR. PLUM', 'Linda?'],
    ['CEO LINDA', 'Because he finally asked for something instead of disappearing. I wanted to see what it looked like. It looks like a sheet.'],
    ['DR. PLUM', warm >= 1 ? 'Carl. You said kind things in the car. That helps.' : 'Carl. You were very neutral. That also helps, I suppose.'],
    ['DR. PLUM', '...Why are there three vans with cameras outside my window?'], ['CEO LINDA', 'Paparazzi. They want the ghost and his ex in therapy. That photo is worth more than my company.'],
  ]));
  const papas = []; for (let i = 0; i < 3; i++) { const t = offscreenTile(200, 320, (tx, ty) => tAt(tx, ty) === TL.road) || [D.x / T | 0, (D.y / T | 0) + 4]; const c = spawnCar('van', t[0] * T + 16, t[1] * T + 16, 0, { drv: 'cop', chase: 1, papa: 1, tag: 'papa', col: '#f0f0f0', blip: '#ff49db' }); c.hp = 60; papas.push(c); }
  setMus('su_tense'); obj('WRECK ALL 3 PAPARAZZI VANS. RAM THEM, BOMB THEM, BONK THEM.');
  await until('m11_papa', () => { const w = papas.filter(c => c.wreck || c.dead).length; SU.bar = { label: 'PAPARAZZI', v: w / 3, c: '#ff49db' }; for (const c of papas) if (frame % 120 === 0 && !c.wreck && d2(c, plPos()) < 200 * 200) { pop(c.x, c.y, 'FLASH', '#ffffff'); post.flash = .2; } return w >= 3; });
  SU.bar = null; setMus(null);
  await cut(() => lines([['SPOOKY GHOST', 'Did we just win marriage counseling?'], ['CEO LINDA', 'Nobody wins marriage counseling. ...We came close.'], ['CARL', 'Do I get paid for this. I feel like I should get paid for this.']]));
  SU.reward = 1200;
}
// ---------------- VICE VERSA: under the city there is another one ----------------
const HOLES = [[10, 19], [37, 10], [46, 46], [1, 37], [28, 55]];
async function mViceVersa() {
  await cut(() => lines([
    ['CARL', 'Chat. I have been thinking. The city is called Vice Versa. Vice versa means the other way around.'], ['CARL', 'So there has to be an other way around. A Below. I am from above AND below Nevada. I would know.'],
    ['CARL', 'I am going to eat the whole bottle of Prop Pills. For research. Do not do this. I am a trained delivery driver.'],
  ]));
  await fadeOut(.03); SU.below = 1; SU.noLaw = 1; setWanted(0); SU.tripLock = 1; SU.trip = 1; await fadeIn(.02);
  await cut(() => lines([['CARL', 'Okay. Everything is inside out. The streets are humming. Every head is an eye and every eye is looking at me.'], ['CARL', 'There are five manholes glowing. I think the Below wants me to open them.']]));
  const visions = [
    [['CARL', 'A desert. A light coming down. That is my first memory, I think. Or my first memory of a memory.']],
    [['OLD FACE', 'Keep going, little guy. Do not look back at the facility. The door only stays open while somebody holds it.'], ['CARL', '...Old Face? You held the door.']],
    [['CARL', 'A lost and found box. In it: a ski mask, a yellow bow tie, and a note that says THESE ARE FASHION.'], ['CARL', 'I wrote that note. I do not remember writing that note.']],
    [['CARL', 'A thousand voices. They are all saying HI CARL. It is chat. Chat was down here the whole time.'], ['CARL', 'Hi chat.']],
    [['CARL', 'A postcard. The front is a picture of Nevada, above and below. The back says STILL IN TRANSIT.'], ['CARL', 'I do not know who sent it. I am keeping it.']],
  ];
  const ms = HOLES.map(([c, r]) => mark((c + 1) * T, (r + 1) * T, { c: '#24ffdb', r: 18, ch: 'O' })); let seen = 0;
  obj('OPEN THE 5 GLOWING MANHOLES OF THE BELOW.');
  while (seen < 5) {
    let hit = null; await until('m13_hole', () => { hit = ms.find(m => !m.hide && near(m, 34)); SU.bar = { label: 'MANHOLES', v: seen / 5, c: '#24ffdb' }; return !!hit; });
    hit.hide = 1; seen++; post.flash = .5; sfx('glitch'); await cut(() => lines(visions[seen - 1]));
  }
  SU.bar = null;
  await cut(async () => { await lines([['CARL', 'The whole Below is asking me something. It sounds like the humans, but nicer.'], ['CARL', 'It is asking: are you a normal human?']]);
    const c = DBG.auto ? 0 : await choose(['YES.', 'NO.', 'I AM CARL.'], { x: 120, y: 120 });
    await lines([[ 'CARL', ['Yes. ...The Below laughed. Kindly. Like a grandma.', 'No. ...The Below said: same. Then it hugged me. It was very big.', 'I am Carl. ...The Below said: that is the right answer, and then it said HI CARL.'][c] ]]);
    await fadeOut(.03); SU.below = 0; SU.tripLock = 0; SU.trip = .5; SU.noLaw = 0; await wait(20); await fadeIn(.03);
    await lines([['CARL', 'I am back on top. The city is the right way around. The postcard is still in my pocket.'], ['CARL', 'Chat, the Below is always there now. Under everything. I can feel it humming.']]); });
  SU.reward = 1500;
}
// ---------------- the heist prep ----------------
async function mPrepTruck() {
  await cut(() => lines([['FACE', 'For the Depository we need a gold truck of our own. A real one. With the paint and the smell.'], ['FACE', 'One is running between the Yards and Downtown right now. Make the driver bail. Then bring it to my garage.'], ['CARL', 'How do I make him bail.'], ['FACE', 'Hit him until he decides to.']]));
  const tr = laneCar('truck', 30, HR[4] + 1, { tag: 'gtruck', cruise: 2.5, noEnter: 1, minHp: 60, blip: '#ffdb49' }) || laneCar('truck', 34, HR[4] + 1, { tag: 'gtruck', cruise: 2.5, noEnter: 1, minHp: 60, blip: '#ffdb49' });
  tr.hp = 160; tr.onDmg = c => { if (c.hp <= 60 && !c.bailed) { c.bailed = 1; c.drv = null; c.parked = 0; c.noEnter = 0; const [fx2, fy2] = fwd(c); const q = spawnPed(c.x - fy2 * 16, c.y + fx2 * 16, { st: 'flee', t: 200, sh: hex('#6d6d49') }); unstick(q); pop(q.x, q.y, 'NOT FOR THIS SALARY!', '#f0f0f0'); } };
  setMus('su_tense'); obj('RAM THE GOLD TRUCK UNTIL THE DRIVER BAILS.'); const m = mark(tr.x, tr.y, { follow: tr, c: '#ffdb49', r: 26 });
  await until('m14_ram', () => { SU.bar = { label: 'DRIVER NERVES', v: 1 - (tr.hp - 60) / 100, c: '#ffdb49' }; return tr.bailed; }, () => tr.wreck && 'THE TRUCK IS WRECKED. FACE IS SIGHING ON ELEVEN MONITORS.');
  SU.bar = null; setWanted(2); obj('GET IN THE GOLD TRUCK.');
  await until('m14_in', () => PL.car === tr, () => tr.wreck && 'THE TRUCK IS WRECKED.'); unmark(m);
  obj("DRIVE IT TO FACE'S GARAGE. LOSE THE COPS ON THE WAY."); mark(PLACES.garage.x, PLACES.garage.y, { ch: 'F', c: '#ff49db', r: 22 });
  await until('m14_garage', () => PL.car === tr && near(PLACES.garage, 40) && !SU.wanted, () => tr.wreck && 'THE TRUCK IS WRECKED.');
  exitCar(true); tr.noEnter = 1; tr.parked = 1;
  await cut(() => lines([['FACE', 'A gold truck. I have always wanted one. I am going to watch it on eleven monitors while it does nothing.'], ['FACE', 'Now we need the plans. Your cat friend says he knows where they are. He does not. But he will.']]));
  SU.reward = 1500;
}
async function mPrepPrints() {
  await cut(() => lines([['JB GARFIELD', 'The Depository blueprints. They are on the roof, in a briefcase. Do not ask why.'], ['JB GARFIELD', 'Roofs are where blueprints go to think. Every detective knows that. I learned it this morning.'], ['CARL', 'I have a flying saucer.'], ['JB GARFIELD', '...Of course you do. Of course the little guy has a flying saucer.']]));
  const ass = CARS.find(c => c.tag === 'ass'); ass.hp = 100; SU.ship = 1;
  obj('GET IN THE A.S.S. AND TAKE OFF (C).'); const am = mark(ass.x, ass.y, { follow: ass, c: '#24dbff', r: 22 });
  await until('m15_takeoff', () => PL.car === ass && ass.z > 20); unmark(am);
  const b = BLD.find(b => b.kind === 'vault'), k = { k: 'crate', x: b.x + b.w / 2, y: b.y + b.h / 2, z: b.z, t: 1 }; let got = 0; k.onGet = () => { got = 1; }; PICK.push(k);
  const cm = mark(k.x, k.y, { c: '#ffdb49', r: 16 }); chopper(b.x - 260, b.y); chopper(b.x + 300, b.y - 100); setWanted(2);
  obj('BEAM UP THE BRIEFCASE ON THE FASCISM INC. ROOF (B).');
  const dead = () => ass.hp <= 2 && 'THE A.S.S. IS DOWN.';
  await until('m15_case', () => { SU.bar = { label: 'A.S.S.', v: ass.hp / 100, c: '#24dbff' }; return got; }, dead); unmark(cm);
  obj("LAND, THEN BRING THE BRIEFCASE TO JB'S OFFICE ON FOOT."); mark(PLACES.jb.x, PLACES.jb.y, { ch: 'J', c: '#ff9a3a', r: 16 });
  await until('m15_jb', () => onFootNear(PLACES.jb, 24), dead);
  SU.bar = null; ass.cargo = 0;
  await cut(() => lines([['JB GARFIELD', 'Let me see. The vault. The guards. The cooking show they watch. It is all here.'], ['JB GARFIELD', 'And a note in the margin: LINDA HAS TWELVE CAMERAS.'], ['JB GARFIELD', 'The case is closing in, Carl. Like a lasagna lid.'], ['CARL', 'That is not how lids work.'], ['JB GARFIELD', 'That is how mine works.']]));
  SU.reward = 1500;
}
