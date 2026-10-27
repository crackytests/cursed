'use strict';
// ================= STICK UP: everything that isn't a mission. STICK-NATION, three stores, PROP RUN deliveries, the 24 eyes, strangers =================
regBust('STICK CLERK', genBust({ skin: '#dbb692', hair: '#926d24', top: '#6d4924', cap: '#db9224', beard: 1 }), '#db9224');
regBust('MIME', genBust({ skin: '#f0f0f0', hair: '#101010', top: '#101010', collar: '#f0f0f0' }), '#f0f0f0');
regBust('40 PIGEONS', genBust({ skin: '#929292', hair: '#6d6d92', top: '#6d4924', collar: '#24b649', hat: '#242424' }), '#9fb8ff');
regBust('SURVEYOR', genBust({ skin: '#dbb692', hair: '#b6b6b6', top: '#db9224', hat: '#dbdb24', glasses: 1 }), '#dbdb24');
regBust('CHAT', genBust({ skin: '#6dff24', hair: '#101010', top: '#24246d', collar: '#6dff24', shades: 1 }), '#6dff24');
Object.assign(VOICE, { 'STICK CLERK': [480, 60], MIME: [1, 0], '40 PIGEONS': [1400, 400], SURVEYOR: [520, 30], CHAT: [1100, 300], 'OTHER CARL': [900, 120], 'DR. PLUM': [640, 20] });
// ---------------- STICK-NATION ----------------
const SHOP = [
  { w: 'BIG STICK', $: 400, d: 'It knocks over everyone in front of you. It is the same stick. Bigger.' },
  { w: 'STICKY BOMB', $: 1200, ammo: 5, d: 'Five bombs. Throw one with B. It sticks to cars. Then it stops being a car.' },
  { w: 'GLOW STICK', $: 900, d: 'Wave it with B. Everybody nearby dances. Cops too. They will be embarrassed later.' },
  { w: 'JOYSTICK', $: 3000, d: 'Point it at a car with B. Now you drive it. From over here. A lets go.' },
  { w: 'PROP PILLS', $: 60, pills: 1, d: 'Heals you. Also the colors. Mostly the colors.' },
];
async function shopMenu() {
  if (!SU.done.sticknation && SU.inMission !== 'sticknation') { pop(PL.x, PL.y, 'CLOSED FOR STICKTAKING', '#db9224'); return; }
  if (SU.inMission && SU.inMission !== 'sticknation') return;
  SU.cut = 1; await say(pick(['Welcome to STICK-NATION. Everything is a stick. Some of it is also other things.', 'Carl. Good to see you. Your stick looks tired.', 'Sticks. Sticks for the people.']), 'STICK CLERK');
  for (;;) {
    const opts = SHOP.map(i => i.w + ' $' + i.$ + (!i.ammo && !i.pills && SU.wep.includes(i.w) ? ' (OWNED)' : '')).concat(['LEAVE']);
    const i = await choose(opts, { x: 8, y: 56, cancel: 1 }); if (i < 0 || i === SHOP.length) break;
    const it = SHOP[i];
    if (!it.ammo && !it.pills && SU.wep.includes(it.w)) { await say('You already have one. Nobody needs two of those. Except the bombs.', 'STICK CLERK'); continue; }
    if (SU.cash < it.$) { await say('That is $' + it.$ + '. You have $' + SU.cash + '. Hold me up some other time.', 'STICK CLERK'); continue; }
    SU.cash -= it.$; sfx('get');
    if (it.pills) { SU.hp = 100; eatPills(); } else { if (!SU.wep.includes(it.w)) SU.wep.push(it.w); if (it.ammo) SU.ammo.bomb += it.ammo; SU.wi = SU.wep.indexOf(it.w); }
    await say(it.d, 'STICK CLERK');
  }
  SU.cut = 0;
}
// ---------------- stores: hold any of them up while they're open ----------------
const STORES = { store: '7-11TY', donut: 'DONUT TIME', gas: 'GAS-N-GULP' };
const CLERKLINES = ['Again, Carl?', "Hi Carl. Register's open.", 'Can you do it faster? I have a line.', "That's still a stick.", 'Is this for the stream?', 'I hold up the next guy myself. Circle of life.'];
async function robStore(k) {
  const pl = PLACES[k]; if (SU.inMission || SU.cut) return;
  if ((pl.robbed || 0) > frame) { pop(PL.x, PL.y, 'CLOSED. (YOU ROBBED IT.)', '#ffdb49'); return; }
  SU.cut = 1; await say(pick(['This is a stick up.', 'This is a stick up. Again.', 'Hands where I can see them. The stick is watching.']), 'CARL'); await say(pick(CLERKLINES), 'CLERK'); SU.cut = 0;
  const n = 120 + rnd(160) + (k === 'gas' ? 80 : 0); SU.cash += n; pop(PL.x, PL.y, '$' + n, '#6dff92'); pl.robbed = frame + 60 * 90; SU.robbed = PLACES.store.robbed || 0; SU.stat.stickups++; SU.stat.stores = (SU.stat.stores || 0) + 1; crime(14, PL.x, PL.y, 1);
}
// ---------------- the eyes: 20 on the street, 4 on rooftops you need the A.S.S. for ----------------
let EYES = [];
function genEyes() {
  let s = 4242; const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  EYES = []; const ok = t => t === TL.walk || t === TL.grass || t === TL.path || t === TL.sand || t === TL.dock || t === TL.lot;
  for (let n = 0; EYES.length < 20 && n < 5000; n++) { const tx = 2 + ((r() * 50) | 0), ty = 2 + ((r() * 54) | 0); if (!ok(tAt(tx, ty))) continue; if (EYES.some(e => Math.abs(e.tx - tx) + Math.abs(e.ty - ty) < 7)) continue; EYES.push({ tx, ty, x: tx * T + 16, y: ty * T + 16, z: 8 }); }
  const roofs = BLD.filter(b => b.z >= 60 && !b.sign && !b.shellOf && !b.roofOf).sort((p, q) => (p.x * 7 + p.y * 3) % 11 - (q.x * 7 + q.y * 3) % 11);
  for (const b of roofs.slice(0, 4)) EYES.push({ x: b.x + b.w / 2, y: b.y + b.h / 2, z: b.z + 8, roof: 1 });
}
function drawEyes(layer) {
  for (let i = 0; i < EYES.length; i++) {
    const e = EYES[i]; if (SU.eyes.includes(i) || !!e.roof !== !!layer) continue; if (Math.abs(e.x - CAM.x) > 320 || Math.abs(e.y - CAM.y) > 240) continue;
    const bob = Math.sin(frame * .07 + i) * 2, x = projX(e.x, e.z + bob), y = projY(e.y, e.z + bob), s = CAM.s * CAM.ZC / (CAM.ZC - e.z), blink = (frame + i * 37) % 200 < 6, la = Math.atan2(PL.y - e.y, PL.x - e.x);
    circF(projX(e.x, 0), projY(e.y, 0), 4 * CAM.s, hex('#101014'));
    if (blink) { rectF(x - 5 * s, y, 10 * s, 1, hex('#ff49db')); continue; }
    circF(x, y, 5 * s, hex('#ffffff')); circF(x + Math.cos(la) * 2 * s, y + Math.sin(la) * 2 * s, 2.6 * s, hex('#ff49db')); pset(x + Math.cos(la) * 2.6 * s, y + Math.sin(la) * 2.6 * s, BLACK);
  }
}
function stepSide() {
  const p = plPos(), fly = PL.car && PL.car.z > 20;
  for (let i = 0; i < EYES.length; i++) {
    const e = EYES[i]; if (SU.eyes.includes(i)) continue;
    if (e.roof ? (fly && d2(e, p) < 26 * 26) : (!fly && d2(e, p) < 16 * 16)) {
      SU.eyes.push(i); sfx('get'); eatPills(.2); const n = SU.eyes.length; pop(p.x, p.y, 'EYE ' + n + '/24', '#ff49db');
      if (n === 12) { SU.thirdEye = 1; SU.cash += 5000; bigText('THE THIRD EYE', '#ff49db', 220, '$5000. PAUSE + C: TRIP WHENEVER YOU WANT.'); }
      else if (n === 24) { SU.belowKey = 1; SU.cash += 20000; bigText('ALL 24 EYES', '#ff49db', 260, '$20000. PAUSE + B: VISIT THE BELOW WHENEVER.'); }
      else if (n % 4 === 0) bigText(n + ' EYES', '#ff49db', 120, 'THEY ARE LOOKING BACK');
    }
  }
}
// ---------------- PROP RUN: Carl's actual job ----------------
const CUSTOMERS = [
  ['40 PIGEONS IN A COAT', 'COO. (THANK YOU.) COO.'], ['A MAN WHO IS ALSO HIS OWN DOG', 'GOOD BOY. (HIMSELF.)'], ['THE HONK LADY', 'HONK HONK. (TIPS IN HONKS.)'],
  ['A TREE IN A HAT', '...'], ['DOUG WILDE', 'NO CAMERAS. THIS TIME.'], ['YOUR OWN REFLECTION', 'NICE MASK.'], ['THE NIGHT MANAGER OF NOTHING', 'EVERYTHING IS CLOSED. GOOD.'],
  ['A MIME', '(SIGNS FOR THE PACKAGE. INVISIBLY.)'], ['GRANDMA ZORP', 'YOU LOOK JUST LIKE MY GRANDSON. HE IS ALSO A NORMAL HUMAN.'], ['THE SURVEYOR', 'THE PACKAGE IS FOUR INCHES SMALLER THAN YESTERDAY.'],
  ['A VERY CALM HORSE', '(THE HORSE TAKES THE PILLS. THE HORSE IS VERY CALM.)'], ['SERGE', 'TELL LINDA I AM DOING GREAT. I AM NOT.'],
];
function dropSpot(minD, maxD) {
  const p = plPos();
  for (let n = 0; n < 400; n++) { const tx = 2 + rnd(46), ty = 2 + rnd(54), t = tAt(tx, ty); if (t !== TL.walk && t !== TL.lot) continue; const x = tx * T + 16, y = ty * T + 16, d = Math.hypot(x - p.x, y - p.y); if (d > minD && d < maxD) return { x, y }; }
  return { x: PLACES.store.x, y: PLACES.store.y };
}
async function deliveries(n, label) {
  let made = 0;
  for (let i = 0; i < n; i++) {
    const t = dropSpot(380, 900), c = pick(CUSTOMERS), m = mark(t.x, t.y, { c: '#ff49db', ch: 'P', r: 18 });
    obj('DELIVER PROP PILLS TO ' + c[0] + '. (' + (i + 1) + '/' + n + ')');
    SU.timer = 60 * Math.round(18 + Math.hypot(t.x - plPos().x, t.y - plPos().y) / 34);
    await until(label, () => near(t, 34), () => SU.timer <= 0 && 'LATE. ' + c[0] + ' FOUND OTHER PILLS.');
    unmark(m); SU.timer = 0; made++; const tip = 60 + made * 50; SU.cash += tip; pop(t.x, t.y, c[1], '#f0f0f0'); pop(plPos().x, plPos().y + 14, 'TIP $' + tip, '#6dff92'); sfx('ding');
  }
  return made;
}
const SIDES = [
  { id: 'delivery', name: 'PROP RUN (DELIVERIES)', side: 1, run: async () => { await cut(() => say(pick(['Okay. Shift. I am a delivery driver. This is normal human work.', 'Back to the route. The stick can wait in the cup holder.', 'Three drops. Then I am going to sit very still for an hour.']), 'CARL')); await deliveries(3, 'dl_drop'); SU.reward = 150; } },
];
// ---------------- strangers & freaks ----------------
const STRANGERS = [
  { id: 'mime', name: 'STRANGER: THE MIME', at: [38, 12], after: 'homework', run: () => sMime() },
  { id: 'pigeons', name: 'STRANGER: 40 PIGEONS IN A COAT', at: [12, 21], after: 'ghosted', run: () => sPigeons() },
  { id: 'surveyor', name: 'STRANGER: THE SURVEYOR', at: [3, 12], after: 'propburn', run: () => sSurveyor() },
  { id: 'chat', name: 'STRANGER: I AM CHAT', at: [12, 30], after: 'dockfright', run: () => sChat() },
  { id: 'twin', name: 'STRANGER: THE OTHER CARL', at: [21, 48], after: 'viceversa', run: () => sTwin() },
];
for (const s of STRANGERS) { s.stranger = 1; s.ch = '?'; s.c = '#b6ff24'; s.pos = { x: s.at[0] * T + 16, y: s.at[1] * T + 16 }; }
const openStrangers = () => STRANGERS.filter(s => SU.done[s.after] && !SU.strangers[s.id]);
async function sMime() {
  const p = STRANGERS[0].pos, mime = spawnPed(p.x + 30, p.y, { tag: 'mime', sh: hex('#101010'), hair: hex('#101010'), skin: hex('#f0f0f0'), st: 'idle' });
  mime.onHold = q => { knock(q, Math.cos(PL.a), Math.sin(PL.a), 'pl'); pop(q.x, q.y, 'BONK', '#ffdb49'); };
  const vic = spawnPed(p.x + 50, p.y + 6, { tag: 'vic', st: 'hands', t: 99999 });
  await cut(() => lines([['MIME', '...'], ['CARL', 'Is he... is he holding that guy up with an invisible stick?'], ['MIME', '...'], ['CARL', 'That is MY BIT. I have a REAL stick. Mine is VISIBLE.'], ['MIME', '(The mime pretends to laugh. It is very good.)']]));
  mime.script = q => { const a = Math.atan2(q.y - PL.y, q.x - PL.x); if (d2(q, PL) < 90 * 90) { q.a = a; movePed(q, Math.cos(a) * 1.3, Math.sin(a) * 1.3); q.walk++; } };
  obj('BONK THE MIME. (GET CLOSE, PRESS B.)'); const m = mark(mime.x, mime.y, { follow: mime, c: '#f0f0f0', r: 8 });
  await until('st_mime', () => mime.st === 'down'); unmark(m); vic.st = 'flee'; vic.t = 100;
  await cut(() => lines([['MIME', '(The mime gives Carl a tip. It is invisible.)'], ['CARL', 'I can feel it, though. It is heavy. It is like three hundred dollars.']]));
  SU.reward = 300;
}
async function sPigeons() {
  const p = STRANGERS[1].pos;
  await cut(() => lines([['40 PIGEONS', 'Coo. Hello. We are one man. A man in a coat.'], ['CARL', 'You are forty pigeons.'], ['40 PIGEONS', 'We are a man. Who needs a ride to the lake. To see the water. As a man.'], ['CARL', 'I respect that. I am also a normal human.']]));
  const pig = spawnPed(p.x + 20, p.y, { tag: 'pig', noHit: 1, sh: hex('#6d4924'), hair: hex('#929292'), st: 'idle', noHold: 1 });
  pig.script = q => { const t = plPos(), d = Math.sqrt(d2(q, t)); if (d > 14) { q.a = Math.atan2(t.y - q.y, t.x - q.x); movePed(q, Math.cos(q.a) * 1.2, Math.sin(q.a) * 1.2); q.walk++; } };
  obj('GET A CAR. THE MAN (PIGEONS) WILL GET IN.'); const pm = mark(pig.x, pig.y, { follow: pig, c: '#9fb8ff', r: 8 });
  await until('st_pigcar', () => PL.car && !CARM[PL.car.m].water && !CARM[PL.car.m].ship && d2(pig, PL.car) < 40 * 40); pig.dead = 1; unmark(pm);
  const lake = { x: 50 * T + 16, y: 32 * T }; obj('DRIVE THE MAN TO LAKE MEED. DO NOT DRIVE LIKE A HAWK.'); mark(lake.x, lake.y, { c: '#24dbff', r: 20 });
  chatter('pigeons', [['40 PIGEONS', 'Coo.'], ['40 PIGEONS', 'We have never been in a car as a man before.'], ['40 PIGEONS', 'One of us is going to be sick. It is Kevin.']], 220);
  await until('st_piglake', () => near(lake, 50));
  await cut(async () => { for (let i = 0; i < 40; i++) FX.push({ x: plPos().x, y: plPos().y, z: 10, k: 'txt', s: 'COO', c: hex('#9fb8ff'), vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4, vz: .6, t: 90, t0: 90 }); await lines([['40 PIGEONS', 'The water. As a man. Thank you, Carl.'], ['CARL', 'The coat is just lying on my seat now.'], ['CARL', 'There are four hundred dollars in the coat.']]); });
  SU.reward = 400;
}
async function sSurveyor() {
  const p = STRANGERS[2].pos;
  await cut(() => lines([['SURVEYOR', 'Young man. The city is four inches smaller every night. I have proof. I lost my tape measures proving it.'], ['CARL', 'How many tape measures.'], ['SURVEYOR', 'Three. Each one is four inches shorter than the last. Bring them back before it gets any smaller.']]));
  const spots = [dropSpot(300, 700), dropSpot(500, 1000), dropSpot(700, 1300)], ms = spots.map(s => mark(s.x, s.y, { c: '#dbdb24', r: 12 })); let got = 0;
  SU.timer = 60 * 150; obj('FIND THE SURVEYOR\'S 3 TAPE MEASURES.');
  await until('st_tapes', () => { for (const m of ms) if (!m.hide && near(m, 26)) { m.hide = 1; got++; pop(m.x, m.y, 'TAPE MEASURE (' + got + '/3)', '#dbdb24'); sfx('switch'); } return got >= 3; }, () => SU.timer <= 0 && 'THE CITY GOT SMALLER. NOBODY NOTICED. HE NOTICED.');
  SU.timer = 0; obj('BRING THEM BACK TO THE SURVEYOR.'); mark(p.x, p.y, { c: '#b6ff24', r: 16 });
  await until('st_tapeback', () => near(p, 40));
  await cut(() => lines([['SURVEYOR', 'Let me see. Vice Versa is... exactly the size of Vice Versa.'], ['SURVEYOR', 'That is the most frightening thing I have ever measured.'], ['CARL', 'Can I have money now.']]));
  SU.reward = 500;
}
async function sChat() {
  await cut(() => lines([['CHAT', 'HI CARL. HI CARL. HI CARL. I AM CHAT. I AM A MAN MADE OF CHAT.'], ['CARL', 'You are wearing a coat made of messages.'], ['CHAT', 'POGGERS. DO THREE STICK UPS. I WANT TO WATCH. SIXTY SECONDS. NO BACKSEATING. (BACKSEATING)']]));
  const s0 = SU.stat.stickups; SU.timer = 60 * 60; obj('DO 3 STICK UPS IN 60 SECONDS WITH THE PLAIN STICK (C SWITCHES). CHAT IS WATCHING.');
  await until('st_chat', () => { SU.bar = { label: 'STICK UPS', v: (SU.stat.stickups - s0) / 3, c: '#6dff24' }; return SU.stat.stickups - s0 >= 3; }, () => SU.timer <= 0 && 'CHAT GOT BORED. CHAT LEFT. CHAT CAME BACK. STILL BORED.');
  SU.timer = 0; SU.bar = null;
  await cut(() => lines([['CHAT', 'W. W. W. CARL IS SO BACK. CLIP IT.'], ['CHAT', 'HERE. A DONATION. IT IS SIX HUNDRED DOLLARS IN BITS.'], ['CARL', 'I am going to pretend I understand that.']]));
  SU.reward = 600;
}
async function sTwin() {
  if (!BUSTS['OTHER CARL']) regBust('OTHER CARL', BUSTS.CARL, '#ff49db');
  const p = STRANGERS[4].pos, tw = spawnPed(p.x + 40, p.y, { tag: 'twin', sh: hex('#4c4c9c'), hair: hex('#101018'), skin: hex('#101018'), st: 'idle', noHold: 0 });
  await cut(() => lines([['OTHER CARL', 'Hey.'], ['CARL', 'Hey.'], ['OTHER CARL', 'Nice mask.'], ['CARL', 'Nice mask.'], ['OTHER CARL', 'I am Carl. I came up from the Below. I am the Carl who means it.'], ['CARL', 'There is only one Carl and it is the one holding this stick.']]));
  let held = 0; tw.onHold = q => { held = 1; pop(q.x, q.y, 'THIS IS A STICK UP!', '#ff49db'); };
  tw.script = q => { const d = Math.sqrt(d2(q, PL)); q.a = Math.atan2(PL.y - q.y, PL.x - q.x); if (d > 16) { movePed(q, Math.cos(q.a) * 1.1, Math.sin(q.a) * 1.1); q.walk++; } else if (frame % 50 === 0) { hurt(6); pop(PL.x, PL.y, 'THIS IS A STICK UP! (HIM)', '#ff2449'); } };
  obj('STICK HIM UP BEFORE HE STICKS YOU UP. (B, FACING HIM, NOT TOO CLOSE.)'); const m = mark(tw.x, tw.y, { follow: tw, c: '#ff49db', r: 8 });
  await until('st_twin', () => held); unmark(m); tw.script = () => {};
  await cut(() => lines([['OTHER CARL', '...Okay. You mean it more.'], ['OTHER CARL', '(He takes off his mask. It is also Carl. Under that, another mask.)'], ['CARL', 'Let us never talk about this.'], ['OTHER CARL', 'Let us never talk about this.']]));
  tw.dead = 1; SU.reward = 1000;
}
