'use strict';
// ================= CARL: RESIDENT HUMAN. the state, THINGS I SAID, the home, the building's habits =================
// state: C3 (shared name with the CARL 3 engine). fields: flags, said[], decor{}, ch, bux, plant, goodwill{}
const RHSAVE = 'rh_save';
function newC3() { return { flags: {}, said: [], decor: { mattress: 1, crate: 1, bowtie: 1 }, gifts: [], ch: 1, bux: 40, plant: 0, good: { orrin: 0, bea: 0, roz: 0, marisol: 0, nell: 0, face: 0, garf: 0, ghost: 0 }, scene: 'lobby', x: 0, z: 0, yaw: 0, time: 0, parcels: [], alibis: [], suspicion: 0, lies: 0, notes: [], route: [], deliveries: 0, stop: 0, repairs: 0 }; }
let OBJ3 = null;
function setObj3(text, scene, id) { OBJ3 = text ? { text, scene, id } : null; DBG.obj = OBJ3; }
const say2 = async lines => { for (const [who, t] of lines) await say(t, who); };
const LI3 = 'CEO LINDA', GA = 'JB GARFIELD', GH3 = 'SPOOKY GHOST', U0 = 'USER_000', OR = 'ORRIN', BE = 'BEA', RZ = 'ROZ', MS = 'MARISOL', NL = 'NELL', KI = 'NORMAL LIVING', FA = 'NEW FACE', DR = 'COMPLIANCE';
const npcR = (id, model, x, z, label, talk, o = {}) => Object.assign({ id, kind: 'npc', model, at: [x, 0, z], label, talk, faceCarl: 1, yaw: 0 }, o);
const GIFTS = { orrin: 'LAMINATED WELCOME SHEET (HE MADE IT)', bea: 'DINER MUG: WORLDS OKAYEST', roz: 'CASSEROLE DISH, NO CASSEROLE', marisol: 'TENANT ASSOCIATION PIN', nell: 'JAR OF UNLABELED PICKLES', face: 'SMALL SOFA CUSHION (AN APOLOGY)', garf: 'NOTEPAD PAGE: CASE CLOSED', ghost: 'SPARE SHEET WITH EYEHOLES' };
const good = (who, n = 1) => { C3.good[who] = (C3.good[who] || 0) + n; if (n > 0 && C3.good[who] >= 3 && GIFTS[who] && !C3.flags['gift_' + who]) { C3.flags['gift_' + who] = 1; giveGift(GIFTS[who]); tickC(who.toUpperCase() + ' LEFT YOU SOMETHING', 'system'); } };
CHATLINES.length = 0; CHATLINES.push('first', 'carl the walls are knocking', 'be normal carl', 'W apartment', 'ask for the manager', 'is that a lease', 'the lease says HUMAN', 'did you read the lease', 'carl you signed it', 'who lives in the wall', 'the elevator has THREE B buttons', 'lights went off again', 'say the thing you said', 'that was hypothetical carl', 'the plant is looking at you', 'you said you were maintenance', 'the leasing office is just OPEN carl', 'the diner is open all night. check the diner', 'is there a model unit in the mall', 'door 10 has someone behind it');
// ---------------- THINGS I SAID ----------------
// each claim: what he said, who heard it, what they will expect, and the three ways to meet it later.
const SAID = {
  human:      { to: 'LINDA', text: 'I\'m human. Occupancy: me.', expect: 'The lease says HUMAN OCCUPANCY ONLY. NORMAL LIVING will verify.' },
  radio:      { to: 'ORRIN', text: 'The radio is normal. It gets normal stations.', expect: 'Orrin wants a demonstration of normal programming.' },
  telescope:  { to: 'ROZ', text: 'The bong is a telescope.', expect: 'Roz wants to see the stars through it. From the roof.' },
  quiet:      { to: 'BEA', text: 'I\'m a very quiet person. I\'ve never woken anyone.', expect: 'Bea is counting on it. She sleeps days.' },
  plant:      { to: 'MAILROOM', text: 'That package is mine.', expect: 'Congratulations: you are responsible for what is inside it.' },
  birthday:   { to: 'LINDA', text: 'The noise was a birthday party. Orrin\'s.', expect: 'Linda wants to know whose birthday. Orrin expects a party.' },
  maint:      { to: 'THE DOOR', text: 'I\'m maintenance.', expect: 'Residents will start reporting broken things to you.' },
  sealed:     { to: 'MARISOL', text: 'I know who lives behind 3F. We\'re close.', expect: 'Whoever it is may ask you to back that up.' },
  saucepan:   { to: 'VOICE IN THE WALL', text: 'I\'ll bring your saucepan back.', expect: 'The neighbor lent it to you through the vent.' },
  ghost:      { to: 'COMPLIANCE', text: 'He\'s my emotional support ghost.', expect: 'Ghost needs paperwork. Orrin knows the form.' },
  voice:      { to: 'MARISOL', text: 'Sure. I\'ll speak at the meeting. I\'m a strong voice.', expect: 'Marisol has scheduled you. There is a podium.' },
  curtains:   { to: 'BEA', text: 'I\'ll get you better curtains. Real blackout.', expect: 'Bea gave up hers for a promise.' },
  supper: { to: 'ROZ', text: "I'll keep the mixer supper hot.", expect: 'Roz needs heat for her oven and a way to keep the food warm.' },
  sleep: { to: 'BEA', text: 'You can sleep through the inspection.', expect: 'Bea needs the shared service pipe to stay quiet until the bell.' },
  water: { to: 'VOICE IN THE WALL', text: "I'll keep your water running.", expect: 'The unlisted apartment needs water when the building checks its services.' },
};
const SAIDORDER = Object.keys(SAID);
function addSaid(id) { if (C3.said.some(s => s.id === id)) return; C3.said.push({ id, st: 'OPEN', ch: C3.ch }); sfx('ask'); tickC('he said it', U0); tickC('THINGS I SAID +1: ' + SAID[id].text.toLowerCase(), 'system'); WX.sayToast = 220; }
const saidOf = id => C3.said.find(s => s.id === id);
const hasSaid = id => !!saidOf(id) && saidOf(id).st !== 'TAKEN BACK';
const SAIDCHAT = { KEPT: ['he actually did it', 'a promise kept in this building??', 'W carl'], 'TAKEN BACK': ['honesty arc', 'some of those were hypothetical', 'carl said the hard thing'], 'DOUBLED DOWN': ['he is doubling down', 'carl no', 'the doubling down is unhinged'], 'BACKED UP': ['he backed it up. he was RIGHT', 'the saucepan arc'], 'LEFT ALONE': ['he dodged the question and it WORKED'] };
function closeSaid(id, st) { const s = saidOf(id); if (s) { s.st = st; if (SAIDCHAT[st]) tickC(pick(SAIDCHAT[st]), 'user_000'); } }
async function saidScreen() {
  const prev = scene; let cur = 0, top = 0;
  if (!F3('saidSeen')) { setF3('saidSeen'); await say('THINGS I SAID. IT HAS A LIST OF THINGS YOU SAID.'); await say("It's not a quest log. Some of those were hypothetical.", 'CARL'); }
  scene = { draw() {
    skyD(0, H, '#0c1432', '#1c2c5c'); plate(8, 8, W - 16, H - 16, { alpha: .95 });
    shadowText('THINGS I SAID', 22, 16, UI3.name); text('NOT A QUEST LOG', 200, 17, UI3.dim);
    cur = Math.max(0, Math.min(cur, C3.said.length - 1));
    top = Math.min(top, cur); if (cur >= top + 5) top = cur - 4;
    if (!C3.said.length) text('NOTHING YET. HE IS BEING VERY HONEST.', 22, 48, UI3.text);
    C3.said.slice(top, top + 5).forEach((s, i) => {
      const y = 36 + i * 22, d = SAID[s.id], selected = top + i === cur;
      const c = s.st === 'OPEN' ? hex('#ffb040') : s.st === 'KEPT' || s.st === 'BACKED UP' ? hex('#6dff92') : s.st === 'TAKEN BACK' ? hex('#9aa4d0') : hex('#ff7ae0');
      if (selected) { rectA(14, y - 2, W - 28, 21, hex('#ffd848'), .18); triF(16, y, 16, y + 8, 22, y + 4, UI3.name); }
      text(d.text.length > 28 ? d.text.slice(0, 26) + '..' : d.text, 28, y + 1, selected ? UI3.text : UI3.dim);
      text(s.st, 230, y + 1, c); text('TO: ' + d.to, 28, y + 11, UI3.dim);
    });
    if (C3.said[cur]) {
      const d = SAID[C3.said[cur].id];
      wrapT(d.text.toUpperCase(), 45).slice(0, 2).forEach((l, i) => text(l, 22, 152 + i * 10, UI3.text));
      wrapT(d.expect.toUpperCase(), 45).slice(0, 2).forEach((l, i) => text(l, 22, 177 + i * 10, UI3.dim));
    }
    text('UP/DOWN   Z/X/C: BACK', 22, 204, UI3.dim);
    text((C3.said.length ? cur + 1 : 0) + '/' + C3.said.length, 266, 204, UI3.name);
  } };
  sfx('tick');
  for (;;) { await nextFrame(); if (pressed.up) cur = Math.max(0, cur - 1); if (pressed.down) cur = Math.min(C3.said.length - 1, cur + 1); if (pressed.a || pressed.b || pressed.c || pressed.start) break; }
  sfx('tick'); scene = prev;
}
// a callback: a claim comes due. DO IT / ADMIT / DOUBLE DOWN. opts: { doIt: async, admit: async, dbl: async, unfair: bool, text }
async function callback(id, who, setup, opts) {
  await setup();
  const o = ['DO IT', 'ADMIT IT WAS HYPOTHETICAL', opts.unfair ? 'DOUBLE DOWN (THEY\'RE BEING UNFAIR)' : 'DOUBLE DOWN'];
  const i = await ask('THE THING YOU SAID: "' + SAID[id].text.toUpperCase() + '"', null, o);
  if (await [opts.doIt, opts.admit, opts.dbl][i]() === false) return 'later';
  closeSaid(id, ['KEPT', 'TAKEN BACK', opts.unfair ? 'BACKED UP' : 'DOUBLED DOWN'][i]);
  return ['do', 'admit', 'dbl'][i];
}
// ---------------- the home ----------------
const HOMEITEMS = ['mattress', 'crate', 'bowtie', 'sofa', 'radio', 'lamp', 'curtains', 'plant', 'bong', 'rug', 'tele', 'saucepan'];
const HOMENAME = { mattress: 'MATTRESS', crate: 'DELIVERY CRATE', bowtie: 'BOW TIE ON A NAIL', sofa: 'SOFA', radio: 'RADIO', lamp: 'LAMP', curtains: 'CURTAINS', plant: 'GERALD (PLANT)', bong: 'THE BIG ONE', rug: 'RUG', tele: 'TELESCOPE (IT\'S A BONG)', saucepan: 'NELL\'S SAUCEPAN' };
const homeCount = () => HOMEITEMS.filter(k => C3.decor[k]).length + C3.gifts.length;
async function homeScreen() {
  const prev = scene;
  scene = { draw() {
    skyD(0, H, '#0c1432', '#1c2c5c'); plate(8, 8, W - 16, H - 16, { alpha: .95 }); shadowText('HOME', 22, 16, UI3.name); text(homeCount() + ' THINGS. HE ISN\'T STAYING LONG.', 80, 17, UI3.dim);
    HOMEITEMS.forEach((k, i) => { const x = 22 + (i % 2) * 144, y = 38 + Math.floor(i / 2) * 16, has = C3.decor[k]; rectF(x, y, 8, 8, has ? hex('#6dff92') : hex('#243050')); text(k==='saucepan' && !F3('nellMet')?'BORROWED SAUCEPAN':HOMENAME[k], x + 14, y + 1, has ? UI3.text : UI3.dim); });
    C3.gifts.slice(0, 4).forEach((g, i) => text('* ' + g.slice(0, 40), 22, 142 + i * 10, hex('#ff9ac0')));
    if(C3.homeVisits) text('VISITS: '+(homeMeal() && homeMeal().stage==='done'?'MEAL ':'')+(homeRadio() && homeRadio().stage==='done'?'RADIO ':'')+(homeGhost()?'GHOST':''),22,180,UI3.text);
    text(C3.decor.curtains ? 'CURTAINS: HE HAS OPINIONS ABOUT THE HEM.' : 'NO CURTAINS. THE WINDOW HAS A FEELING ABOUT IT.', 22, 190, UI3.dim);
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}
function giveGift(name) { C3.gifts.push(name); sfx('get'); tickC('new in the apartment: ' + name.toLowerCase()); }
// ---------------- NORMAL LIVING: the building adjusts itself around the standard resident ----------------
const NL_LINES = ['NORMAL LIVING NOTICE: ENERGY SAVING MODE. PLEASE WAVE.', 'NORMAL LIVING: NO MOVEMENT DETECTED. ARE YOU A RESIDENT?', 'NORMAL LIVING: LIGHTS WILL RESUME WHEN YOU DO SOMETHING STANDARD.'];
const NLS = { idle: 0, out: 0, nlT: 0 };
function normalLivingTick() {
  if (!WX.sc.smart || frozen3() || F3('nlOff')) { NLS.idle = 0; NLS.out = 0; return; }
  const moved = CARL.moving || pressed.a || pressed.c;
  if (moved) { if (NLS.out) { NLS.out = 0; sfx('tick'); } NLS.idle = 0; } else NLS.idle++;
  if (!NLS.out && NLS.idle > 420 && (C3.ch >= 1)) { NLS.out = 1; sfx('power'); tickC(pick(NL_LINES), 'NORMAL LIVING'); }
}
// ---------------- the HUD ----------------
function drawHUD3() {
  let oy = 4;
  if (OBJ3 && !frozen3()) { const ol = wrapT(OBJ3.text.toUpperCase(), 31).slice(0, 2), w = Math.max(...ol.map(l => l.length)) * 6 + 26, h = 8 + ol.length * 10; plate(4, 4, w, h, { alpha: .72 }); triF(10, 9, 10, 17, 16, 13, UI3.name); ol.forEach((l, i) => shadowText(l, 21, 8 + i * 10, UI3.text)); oy = 4 + h + 4; }
  if (inspectionActive()) drawInspectionHUD(oy);
  else if (WX.banner && WX.banner.t > 0) { const b = WX.banner.s.slice(0, 31), w = b.length * 6 + 28; plate(4, oy, w, 18, { c0: '#241a52', c1: '#40308a' }); shadowText(b, 18, oy + 5, UI3.name); }
  const open = C3.said.filter(s => s.st === 'OPEN').length;
  plate(W - 104, 4, 100, 28, { alpha: .72 }); shadowText('SAID', W - 98, 9, hex('#ffd848')); rectF(W - 66, 9, 56, 7, hex('#243050')); rectF(W - 66, 9, Math.min(56, open * 7), 7, open > 5 ? hex('#ff4949') : hex('#ffb040')); text(open + ' OPEN', W - 62, 9, WHITE, 0);
  text('HOME', W - 98, 21, UI3.dim); for (let i = 0; i < 12; i++) rectF(W - 76 + i * 5, 21, 4, 6, i < homeCount() ? hex('#6dff92') : hex('#44568c'));
  if (WX.sayToast > 0) { WX.sayToast--; if (WX.sayToast > 190 || !(WX.sayToast & 4)) { const s = 'THINGS I SAID UPDATED', w = s.length * 6 + 20; plate((W - w) / 2, H - 100, w, 16, { alpha: .8 }); shadowText(s, (W - s.length * 6) / 2, H - 96, hex('#ff7ae0')); } }
  if (!DLG) WX.tick.slice(-3).forEach((k, i) => { const s = (k.u + ': ' + k.m).toUpperCase().slice(0, 44); plate(4, H - 16 - i * 14, s.length * 6 + 14, 13, { alpha: .6, cut: 2, flat: 1 }); shadowText(s, 11, H - 13 - i * 14, k.u === 'system' ? hex('#ff7ae0') : UI3.dim); });
  if (NLS.out) { rectA(0, 0, W, H, hex('#000010'), .82); const s = pick(NL_LINES) && NL_LINES[(WX.t >> 6) % 3]; ctext(s.slice(0, 44), H / 2 - 4, hex('#7ad8ff')); }
}
async function pauseMenu3() {
  sfx('tick');
  for (;;) {
    const i = await choose(['THINGS I SAID', 'HOME', 'ASK CHAT', 'SAVE', 'MAIL', 'CLOSE'], { x: W - 130, y: 40, cancel: 1 });
    if (i === 0) { await saidScreen(); continue; }
    if (i === 1) { await homeScreen(); continue; }
    if (i === 2) { await askChat3(); continue; }
    if (i === 3) { saveC3(); sfx('ok'); await say('SAVED. THE BUILDING KEEPS A COPY.'); continue; }
    if (i === 4) { await mailScreen(); continue; }
    return;
  }
}
function saveC3() { if (!C3) return; C3.x = CARL.p[0]; C3.z = CARL.p[2]; C3.yaw = CARL.yaw; store(RHSAVE, C3); }
function stopHint() { return OBJ3 ? OBJ3.text : 'Go somewhere.'; }
// ---------------- what Carl says: a menu of things, some of them claims ----------------
// options: [{ id: 'radio'|null, label: 'IT PLAYS NORMAL STATIONS.' }]. the first line is what the other person asked.
async function sayMenu(who, prompt, options) {
  await say(prompt, who, { keep: 1 });
  DBG.sayopts = options;
  const i = await choose(options.map(o => o.label)); DLG = null; DBG.sayopts = null;
  const o = options[i]; if (o.id) addSaid(o.id); return o;
}
// the signature: he writes the name he has. the player only ever sees the brackets
async function signature(what) {
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { skyD(0, H, '#d8d0e8', '#b8a8d0'); plate(30, 40, 260, 120, { alpha: .95 }); shadowText(what, 44, 52, UI3.name); rectF(46, 100, 228, 1, UI3.edge); const n = Math.min(5, Math.floor(t / 14)); text('[[[[['.slice(0, n), 60, 84, hex('#ffffff'), 0, 3); if (t > 100) { circF(240, 90, 20, hex('#b62424')); text('SIGNED', 226, 88, WHITE, 0); } } };
  sfx('tick'); await wait(100); sfx('stamp'); await wait(50); scene = prev;
}
// the little repair jobs
async function fixIt(title, n = 4) { if (!F3('tutWire')) { setF3('tutWire'); await say('Pick a plug on the left with Z or X, then its matching color on the right. Five mistakes and the panel resets. C closes it.'); } return wires(title, n); }
// the night-shift neighbor sleeps in the day. noise wakes her
const NOISE = { v: 0 };
function beaNoise() {
  if (C3.ch !== 2 || inspectionActive() || frozen3() || F3('beaWoke') || F3('beaDone')) return;
  const near = Math.hypot(CARL.p[0] - 3.4, CARL.p[2] - 6.4) < 4.2, loud = CARL.moving && held.b;
  NOISE.v = Math.max(0, Math.min(110, NOISE.v + (loud ? 2.4 : CARL.moving && near ? .35 : -.7)));
  if (NOISE.v >= 100) { setF3('beaWoke'); wstory(beaWakes); }
}
// ---------------- the elevator: B, B2, and B2 again ----------------
async function elevator(from) {
  const open = { lobby: 1, floor3: 1, roof: 1, mallB1: F3('ch4'), b2: F3('ch4'), b2b: F3('ch4') && F3('b2key') };
  const rows = [['LOBBY', 'lobby', '"WELCOME HOME."'], ['3', 'floor3', ''], ['ROOF', 'roof', ''], ['B', 'mallB1', 'B is closed for renovation.'], ['B2', 'b2', 'B2 is closed for renovation.'], ['B2', 'b2b', 'Linda says the second B2 is a printing error.']];
  if (!F3('elevSeen')) { setF3('elevSeen'); await say('THE ELEVATOR. THE PANEL HAS BUTTONS: LOBBY, 3, ROOF, B, B2, AND B2 AGAIN.'); }
  const k = await choose(rows.map(r => r[0] + (r[1] === 'b2b' ? ' (AGAIN)' : '')), { x: 20, y: 30, cancel: 1 }); if (k < 0) return;
  const [nm, sc, msg] = rows[k];
  if (sc === from) return say('You are already here. The elevator knows. It says nothing.');
  if (!open[sc]) { sfx('hurt'); return say(msg ? 'NORMAL LIVING: ' + msg.toUpperCase() : 'NO.'); }
  await goScene(sc, ...SCENES[sc].elev);
}
// the objective is a function of the flags: refresh it every frame so saves and the test bot agree
{ const upd = worldScene3.update; worldScene3.update = function () { if (!frozen3() && C3 && typeof objective === 'function') { const o = objective(); if (!OBJ3 || OBJ3.text !== o[0]) setObj3(o[0], o[1], o[2]); } return upd.call(this); }; }
