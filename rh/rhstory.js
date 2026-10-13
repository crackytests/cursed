'use strict';
// ================= CARL: RESIDENT HUMAN. the objective chain, the ents, chapters 1 and 2 =================
const claimed = id => !!saidOf(id);
const slide = (p, x, z, n) => new Promise(res => { const x0 = p[0], z0 = p[2]; let i = 0; const st = () => { i++; p[0] = x0 + (x - x0) * i / n; p[2] = z0 + (z - z0) * i / n; if (i < n) waiters.push(st); else res(); }; waiters.push(st); });
// keep trying a panel until it works. returns false only if the player gives up
async function fix(title, n = 4) { for (;;) { if (await fixIt(title, n)) { C3.repairs++; return true; } if (await ask('GIVE UP FOR NOW?', null, ['KEEP TRYING', 'LATER']) === 1) return false; } }
// ---------------- the objective: one function of the flags, so saves and the test bot always agree ----------------
function objective() {
  const f = F3, ch = C3.ch;
  if (ch === 1) {
    if (!f('lease')) return ['Sign your lease at the front desk', 'lobby', 'linda'];
    if (!f('sofa')) return ['Face is by the elevator with a sofa', 'lobby', 'face'];
    if (!f('radio')) return ['Your radio was delivered to 3B', 'apt3B', 'orrin'];
    if (!f('bong')) return ['Your telescope went to 3D', 'apt3D', 'roz'];
    if (!f('pkg')) return ['A package in the mailroom has your name on it', 'lobby', 'lockers'];
    return ['Go home. Unit 3A', 'apt3A', 'mat'];
  }
  if (ch === 2) {
    if (inspectionActive()) return inspectionObjective();
    if (!f('notice')) return ['Go home. Unit 3A', 'apt3A', 'mat'];
    if (!f('lindaTwo')) return ['Linda wants to talk about the noise', 'lobby', 'linda'];
    if (f('noMaint') && !f('staffIn')) return ['Roz knows another way to the pipes', 'apt3D', 'hatch'];
    if (!f('staffIn')) return ['Find what is knocking. Try the STAFF ONLY door', 'floor3', 'staff'];
    if (!f('voiceMet')) return ['The wall knocked near panel A', 'maint', 'panelA'];
    if (!f('valve')) return ['The voice wants the pressure fixed at panel C', 'maint', 'panelC'];
    if (!f('orrinTwo')) return ['Orrin in 3B has been waiting', 'apt3B', 'orrin'];
    if (hasSaid('maint') && !f('oven')) return ['Roz in 3D reported a broken oven', 'apt3D', 'roz'];
    if (!f('beaFix') && !f('beaDone')) return ['Bea in 3C needs a panel fixed. Quietly', 'apt3C', 'bpanel'];
    return ['Tell Linda it was the pipes', 'lobby', 'linda'];
  }
  return objective2();
}
// ---------------- the doors ----------------
const DOORX = { apt3A: -14, apt3B: -9, apt3C: -4, apt3D: 1, community: 6, apt3F: 11, laundry: 16, maint: 21, lobby: -19, roof: -19 };
const door = (id, to, x, label, o = {}) => Object.assign({ id, kind: 'prop3', to, at: [x, 0, 8.3], label, range: 1.7, draw3: () => {}, talk: () => goScene(to, 0, 1.9, 0) }, o);
const leave = (to, x, z = 7) => [{ r: [-1.4, 1, 1.4, 1.55], to, x, z, yaw: 0 }];
for (const [k, to, x, w] of [['apt3A', 'floor3', -14], ['apt3B', 'floor3', -9], ['apt3C', 'floor3', -4], ['apt3D', 'floor3', 1], ['laundry', 'floor3', 16], ['community', 'floor3', 6]]) SCENES[k].exits = leave(to, x);
// ---------------- the lobby ----------------
SCENES.lobby.ents = () => [
  npcR('linda', 'linda', -2.6, 11, 'LINDA', () => lindaTalk(), { range: 2.6 }),
  { id: 'kiosk', kind: 'prop3', at: [2.6, 0, 11.2], label: 'NORMAL LIVING', range: 2.2, draw3: () => {}, talk: () => kioskTalk() },
  { id: 'elev', kind: 'prop3', to: ['floor3', 'roof', 'mallB1', 'b2', 'b2b'], at: [-8, 0, 14], label: 'ELEVATOR', range: 2.2, draw3: () => {}, talk: () => elevator('lobby') },
  { id: 'lockers', kind: 'prop3', at: [11.4, 0, 7.6], label: 'MAILROOM', range: 2.2, draw3: () => {}, talk: () => mailroom() },
  { id: 'gate', kind: 'prop3', at: [12.4, 0, 12.6], label: 'SEALED GATE', range: 2.2, draw3: () => {}, talk: () => say('THE MALL OF THE FUTURE. SEALED. THE GATE HAS A SIGN: "RENOVATED."', null) },
  npcR('face', 'face', -6.4, 12.2, 'FACE', () => faceSofa(), { cond: () => C3.ch === 1 && F3('lease') && !F3('sofa'), range: 2.4 }),
  npcR('ghost', 'ghost', -3, 6.6, 'SPOOKY GHOST', () => ghostLobby(), { cond: () => C3.ch === 3 && F3('ghostIn') && !F3('ghostHome'), range: 2.4 }),
  npcR('garf', 'garf', 4.5, 6.4, 'GARFIELD', () => garfLobby(), { cond: () => C3.ch === 3 && F3('garfIn') && !F3('garfDone'), range: 2.4 }),
  npcR('drone', 'drone', 0, 8.6, 'COMPLIANCE', () => droneLobby(), { cond: () => F3('droneUp') && !F3('droneGone'), range: 2.2 }),
  ...extraLobby(),
];
SCENES.lobby.exits = [];
async function kioskTalk() {
  if (!F3('lease')) return say(`WELCOME HOME. PLEASE SEE THE LEASING OFFICE. PLEASE BE A RESIDENT.`, KI);
  const l = ['YOU ARE HOME.', 'NORMAL LIVING: YOU HAVE LIVED HERE ' + Math.max(1, Math.floor(C3.time / 3600)) + ' MINUTES.', 'YOUR NOISE LEVEL IS: A NUMBER. YOUR HEART RATE IS: ALSO A NUMBER.', 'PLEASE REMAIN STANDARD.'];
  await say(pick(l), KI);
  if (C3.ch >= 5) await say(`AN UPDATE: THIS UNIT WILL BE RESET. THANK YOU FOR LIVING.`, KI);
}
async function mailroom() {
  if (C3.ch === 1 && F3('bong') && !F3('pkg')) return packageScene();
  if (C3.ch === 1) return say(`THE LOCKERS. ONE HAS A YELLOW LABEL: "3A. ALSO, PLEASE COLLECT." (NOT YET.)`, null);
  await say(`THE MAIL LOCKERS. EVERYTHING IS ADDRESSED TO "THE STANDARD RESIDENT."`, null);
  if (F3('pkg') && C3.ch >= 2 && !F3('mailNote')) { setF3('mailNote'); await say(`THERE IS A NOTE ON LOCKER 3A: "YOUR PLANT HAS NOT BEEN WATERED. THIS IS NOT A REMINDER. IT IS A FINDING."`, null); }
}
// ---------------- chapter 1: WELCOME HOME ----------------
async function newGameRH() {
  C3 = newC3(); music(null); post.fade = 0; setObj3(null);
  await showCard([`PREVIOUSLY, ON CARL:`], 90, { fg: UI.dim });
  await showCard([`A PACKAGE WAS RETURNED.`, `A WALL KNOCKED.`, `HE KEPT DELIVERING.`], 160, { fg: UI.dim });
  await showCard([`CARL`, `RESIDENT HUMAN`], 130, { fg: hex('#ffd848'), sc: 2 });
  scene = worldScene3; loadScene('lobby', 0, 3.4, 0); post.fade = 1; await fadeIn(.08);
  wstory(ch1intro);
}
async function ch1intro() {
  await wait(30);
  await say2([['CARL', `It's a normal building.`], ['CARL', `It has a lobby and a floor and a number on every door. It has people who live in it. I am going to be one.`], [KI, `WELCOME HOME, STANDARD RESIDENT. PLEASE SEE THE LEASING OFFICE.`]]);
  tickC('carl has a lease', 'user_000');
}
async function lindaTalk() {
  if (C3.ch === 1 && !F3('lease')) return lease();
  if (C3.ch === 1) return say2([[LI3, `Welcome home! Your key is in your hand. Your sofa is by the elevator. Your radio went to 3B, because 3B is the one with a doorbell that works.`]]);
  if (C3.ch === 2) return lindaTwo();
  if (C3.ch === 3) return lindaThree();
  if (C3.ch === 4) return say2([[LI3, `Everything is going so well. I haven't checked. But I've decided it is.`], [LI3, `Please do not use the B buttons. I have asked them to stop being buttons.`]]);
  return lindaFive();
}
async function lease() {
  await say2([[LI3, `Carl! Welcome to THE RESIDENCES AT TOMORROW. We took the old Mall of the Future wing and made it into a place where people live.`], [LI3, `Real homes. Real neighbors. A real normal life. The lease is simple. It says that this is a residence, and that you are a resident, and—`], ['CARL', `Where do I sign.`], [LI3, `I'm not finished explaining the occupancy clause.`], ['CARL', `I'll sign it twice.`]]);
  await signature(`LEASE: UNIT 3A  OCCUPANCY: HUMAN ONLY`);
  addSaid('human');
  await say2([[LI3, `...Well. You signed it. That's what a lease is for.`], [LI3, `It says HUMAN OCCUPANCY ONLY, Carl. In a box. You checked the box.`], ['CARL', `I'm a normal human.`], [LI3, `Of course you are! That's why the box is there. NORMAL LIVING will keep an eye on it. It keeps an eye on everything.`], [KI, `HELLO, CARL. I AM NORMAL LIVING. I ADJUST THE LIGHTS, THE NOISE, AND YOUR DOORS FOR THE STANDARD RESIDENT.`], ['CARL', `What if I'm not standard.`], [KI, `YOU SIGNED THE BOX.`], [LI3, `Your sofa is waiting by the elevator. A friend of yours came to help you move in. I don't know how I know that. I know a lot of things. Enjoy your home.`]]);
  setF3('lease'); sfx('get'); tickC('YOU HAVE A KEY. UNIT 3A', 'system');
}
async function faceSofa() {
  await say2([[FA, `Carl. Hi. I'm here to help you move. I wasn't asked. I volunteered. Also I was asked.`], ['CARL', `You brought a sofa.`], [FA, `It's yours. Linda said it was yours. Take that end.`]]);
  await goScene('floor3', -19, 6.6, 1.57);
  const sofa = { p: [-18, 0.1, 6.6] }, f = { p: [-20.2, 0, 6.6] };
  WX.carry = { sofa: sofa.p, f: f.p }; WX.sc.drawOver = carryDraw;
  const step = async (x, n = 60) => { await Promise.all([slide(CARL.p, x, 6.6, n), slide(f.p, x - 2.2, 6.6, n), slide(sofa.p, x - 1.1, 6.6, n)]); };
  await step(-16);
  let drop = false, nice = 0;
  const beats = [
    [[FA, `So. The show. Do you want to... talk about the show?`], [`LET'S TALK ABOUT THE SHOW`, `LET'S TALK ABOUT THE SOFA`, `I NEED TO GO`], [[FA, `I made a cut of the second one without your best scene, and then I didn't tell you, and then it came out. I think about that. I think about it carrying things.`], ['CARL', `That was a bad cut.`], [FA, `It was a bad cut.`]], [[FA, `Right. Sofa. It's a good sofa.`], ['CARL', `It's a very red sofa.`]]],
    [[FA, `Watch the corner. Do you ever feel like the sequel is the version of you everyone wanted? And you're stuck being the original?`], [`YEAH. EVERY DAY`, `WATCH THE CORNER`, `I NEED TO GO`], [['CARL', `Yeah. Every day. People keep asking for the other guy.`], [FA, `You can say that to me. I'm a man who understands that.`]], [['CARL', `Watch the corner.`], [FA, `Watching the corner. Sorry.`]]],
    [[FA, `Last thing. Are we friends, Carl? Or is this a favor I'm doing in a hallway?`], [`WE'RE FRIENDS`, `IT'S A HALLWAY`, `I NEED TO GO`], [['CARL', `We're friends. It's a hallway. It can be both.`], [FA, `That's the nicest thing a sofa has ever made anyone say.`]], [['CARL', `It's a hallway.`], [FA, `Okay. That's fair. That's fair.`]]],
  ];
  for (const [q, opts, yes, no] of beats) {
    await say(q[1], q[0], { keep: 1 }); const i = await choose(opts); DLG = null;
    if (i === 2) { drop = true; break; }
    await say2(i === 0 ? yes : no); if (i === 0) nice++;
    await step(CARL.p[0] + 1.6, 40);
  }
  if (drop) {
    sfx('hurt'); WX.shake = 14; delete WX.carry; await wait(20);
    WX.carry = { sofa: [CARL.p[0] - 1, .0, 6.6], f: f.p, dropped: 1 };
    await say2([[FA, `Oh. Oh no. I—no, I've got the whole thing. I've got — it's on my foot.`], ['CARL', `Sorry. I had to go.`], [FA, `I'll take it from here. Don't worry about it. It was a hard sofa to hold anyway.`]]);
    setF3('sofaDrop'); good('face', -1);
  } else { good('face', nice); await say2([[FA, `Okay. That's it. Home. This is what carrying something with someone is like. Apparently it's a conversation.`]]); }
  setF3('sofa'); C3.decor.sofa = 1; if (drop) C3.decor.sofaDrop = 1; WX.sc.drawOver = undefined; delete WX.carry;
  await goScene('lobby', -6, 10.4, 0);
}
function carryDraw() {
  const c = WX.carry; if (!c) return;
  drawModel(FURN.sofa, { p: c.sofa, yaw: c.dropped ? .4 : 1.57 }, liveLight(WX.sc, c.sofa));
  drawModel(MODELS_P.face, { p: c.f, yaw: 1.57 }, liveLight(WX.sc, c.f));
}
// ---------------- 3B: Orrin ----------------
SCENES.apt3B.ents = () => [
  npcR('orrin', 'orrin', 0, 4.8, 'ORRIN', () => orrinTalk(), { range: 2.6 }),
  { id: 'orrinradio', kind: 'prop3', at: [3.6, 0, 5.4], label: 'RADIO', range: 1.6, draw3: e => { if (!F3('radio')) drawModel(FURN.radio, { p: [3.6, .8, 6.4], yaw: 3.14 }, liveLight(WX.sc, e.p)); }, talk: () => orrinTalk() },
];
async function orrinTalk() {
  if (C3.ch === 1) return F3('radio') ? say2([[OR, `Your radio has been returned. Please take it out of my unit. I can still hear it thinking.`]]) : orrinOne();
  if (C3.ch === 2 && !F3('orrinTwo')) return orrinTwo();
  if (C3.ch === 3 && F3('formNeed') && !F3('form')) return orrinForm();
  if (C3.ch >= 3 && C3.quietPolicy && C3.quietPolicy.choice === 'exception' && !C3.quietPolicy.exception && !C3.quietPolicy.done) return quietOrrin();
  if (C3.ch === 4 && F3('tagSeen') && !F3('orrinOrigin')) return orrinOrigin();
  if (homeActivitiesAvailable() && (homeMeal() && homeMeal().to==='orrin' && homeMeal().stage==='ask' || homeRadio() && homeRadio().stage==='invited')) return homeAskOrrin();
  if (C3.ch === 3 && F3('mixer') && !F3('mixerDone')) return say(`ORRIN: I will see you at the event. I have arranged the chairs by compatibility.`, null);
  if (C3.ch >= 4) return orrinLate();
  await say2([[OR, `Carl. I would offer you a drink. I do not know what you'd do with it. Please don't tell me.`]]);
}
async function orrinOne() {
  await say2([[OR, `Resident of 3A. Your item arrived in my unit at 4:12. It has been emitting a frequency since 4:13.`], ['CARL', `That's a radio.`], [OR, `It is warm. Tell me about it. For the paperwork.`]]);
  const o = await sayMenu(OR, `Does it receive broadcasts?`, [{ id: 'radio', label: `IT PLAYS NORMAL STATIONS.` }, { id: null, label: `IT PICKS UP... SOMETHING.` }]);
  if (o.id) await say2([[OR, `Normal stations. I will note: NORMAL. And that you said normal. I note everything. It's the only thing I have.`], ['CARL', `Perfect. Great.`]]); else await say2([[OR, `"Something." I have no column for something. I will leave it blank. I do not like blank. Thank you for your honesty. I am slightly distressed.`]]);
  setF3('radio'); C3.decor.radio = 1; good('orrin', o.id ? 0 : 1);
  await say2([[OR, `Also, Carl. I'm told you're a human. I'm a human too. We should avoid discussing it.`], ['CARL', `Agreed.`], [OR, `Good. Between us.`]]);
}
// ---------------- 3D: Roz ----------------
SCENES.apt3D.ents = () => [
  npcR('roz', 'roz', -2.2, 3.6, 'ROZ', () => rozTalk(), { range: 2.6 }),
  { id: 'marks', kind: 'prop3', at: [-3.5, 0, 7.6], label: 'THE WALL', range: 2.2, draw3: () => {}, talk: () => marksLook() },
  { id: 'hatch', kind: 'prop3', to: 'maint', at: [5.0, 0, 5.8], label: 'DUMBWAITER', range: 1.8, draw3: () => {}, cond: () => F3('noMaint') && !F3('staffIn'), talk: () => dumbwaiter() },
];
async function marksLook() {
  await say(`HEIGHT MARKS ON THE KITCHEN WALL. THEY GO FROM KNEE-HIGH TO SHOULDER-HIGH. THERE ARE FORTY OF THEM. THE LAST ONE IS DATED LAST MONTH.`, null);
  if (!F3('marksSeen')) { setF3('marksSeen'); await say2([['CARL', `Who's this?`], [RZ, `Dee. Dee grows in the wall, mostly. I stopped asking where.`]]); }
}
async function rozTalk() {
  if (inspectionActive()) return inspectionRoz();
  if (F3('parcelHave') && !F3('parcelGiven')) return rozParcel();
  if (C3.ch === 1 && !F3('bong')) return rozOne();
  if (C3.ch === 2 && hasSaid('maint') && !F3('oven') && F3('valve')) return rozOven();
  if (C3.ch >= 3) return rozLate();
  await say2([[RZ, `Sit. Don't sit on that. That's Dee's. Sit there.`]]);
}
async function rozOne() {
  await say2([[RZ, `You're the new one. 3A. Sit. No, not there. Sit. I've lived here since before it was a building. It was a different building. It was mostly this kitchen.`], ['CARL', `I think my telescope came here.`], [RZ, `The glass thing? It came with a note. "FOR THE RESIDENT." I've been using it for the evenings. I don't know what it's for.`]]);
  const o = await sayMenu(RZ, `What is it for?`, [{ id: 'telescope', label: `IT'S A TELESCOPE. FOR STARS.` }, { id: null, label: `IT'S A... PIPE. A BIG ONE.` }]);
  if (o.id) await say2([[RZ, `A telescope! I've wanted to look at the sky for forty years. The ceiling has been in the way. You can show me. From the roof.`], ['CARL', `Absolutely. Yes. Stars.`]]); else await say2([[RZ, `A pipe. I figured. It tastes like a pipe. I've been very relaxed. Keep it, dear, it was a good evening.`]]);
  setF3('bong'); C3.decor.bong = 1; good('roz', o.id ? 0 : 1);
  await say2([[RZ, `Now come by when you want. My door is always open. It's a rule. I don't know whose.`]]);
}
// ---------------- the package, and Bea, and the knock ----------------
async function packageScene() {
  await say(`LOCKER 3A OPENS ITSELF. IT HAS A BOX IN IT. THE LABEL SAYS "OCCUPANT". THE BOX IS BREATHING, SLIGHTLY.`, null);
  const o = await sayMenu('CARL', `A dispatch drone floats in. "Is this package yours? Delivery drivers get nervous."`, [{ id: 'plant', label: `THAT PACKAGE IS MINE.` }, { id: null, label: `I'M NOT SURE.` }]);
  if (o.id) await say2([[DR, `ACKNOWLEDGED. PACKAGE 3A-0001 IS NOW IN YOUR CARE. YOUR CARE INCLUDES WATER AND LIGHT. IT IS A PLANT.`], ['CARL', `...It's a plant.`], [DR, `ITS NAME IS GERALD. IT HAS ALREADY TOLD US.`]]); else await say2([[DR, `UNCLAIMED PACKAGES ARE RETURNED TO SENDER. THE SENDER IS: THE BUILDING. THE BUILDING IS NOT TAKING IT BACK. YOU WILL HOLD IT FOR NOW.`]]);
  setF3('pkg'); C3.decor.plant = 1; C3.plant = 1; sfx('get');
  await say(`A PLANT IS NOW IN UNIT 3A. ITS NAME IS GERALD.`, null);
}
SCENES.apt3A.init = () => { if (C3.ch === 1 && F3('pkg') && !F3('beaMet')) { wstory(beaVisit); } else if (C3.ch === 2 && !F3('notice')) wstory(noticeScene); else if (C3.ch === 3 && F3('ghostHome') && !F3('ghostSet')) wstory(ghostSettle); else if (C3.ch === 5 && F3('finale') && !F3('finaleDone')) wstory(finale); };
async function beaVisit() {
  setF3('beaMet'); await wait(60);
  await say(`SOMEONE KNOCKS AT THE DOOR. THEN KNOCKS AGAIN. THEN KNOCKS WITH A DIFFERENT HAND.`, null);
  const b = addEnt3(npcR('bea', 'bea', 0, 3.8, 'BEA', () => beaTalk(), { range: 2.6 })); b.p = [0, 0, 3.2];
  await say2([[BE, `You're the one who moved in. I'm in 3C. I sleep days. I work nights. At a diner, Third and Vine, it doesn't matter.`], [BE, `I need you to understand one thing. I have had ninety minutes of sleep since Tuesday.`]]);
  const o = await sayMenu(BE, `Are you going to be loud?`, [{ id: 'quiet', label: `I'M A VERY QUIET PERSON.` }, { id: null, label: `I'LL TRY. THE WALLS ARE WEIRD.` }]);
  if (o.id) await say2([[BE, `Oh thank God. You're quiet. I can tell. I trust it.`], [BE, `If you ever wake me, I'm going to remember this exact sentence.`]]); else await say2([[BE, `I appreciate "try." I've never gotten "try." Thank you. Please try hard.`]]);
  good('bea', o.id ? 0 : 1); setF3('beaCurtain');
  await say2([[BE, `Also: these are the blackout curtains the building gave me. They aren't. Light gets in at the hem. If you ever see better ones, I'd marry them.`]]);
  b.gone = 1;
  await night();
}
async function night() {
  await showCard([`3:07 A.M.`], 120, { fg: hex('#7ad8ff') }); WX.tick = [];
  post.flash = 0; await say2([['CARL', `I'm asleep. I'm doing very well at it.`]]);
  sfx('hurt'); WX.shake = 20; await wait(30);
  await say(`KNOCK. KNOCK. KNOCK-KNOCK.`, null);
  await say(`THE KNOCKING IS COMING FROM INSIDE THE CLOSET WALL.`, null);
  await say2([['CARL', `Hello?`]]);
  sfx('hurt'); await say(`KNOCK. KNOCK.`, null);
  await say2([['CARL', `I'm not answering that.`], ['CARL', `That's not where the door is.`]]);
  tickC('carl the closet is knocking', 'user_000'); tickC('3:07 AM', 'system');
  C3.ch = 2; setF3('n2'); C3.time += 600;
  await showCard([`CHAPTER 2`, `QUIET ENJOYMENT`], 110, { fg: hex('#ffd848'), sc: 2 }); saveC3(); await noticeScene();
}
async function beaTalk() {
  if (F3('beaWoke') && !F3('beaDone')) return;
  if (C3.ch === 1) return say2([[BE, `Shh. Walk like a person.`]]);
  if (C3.ch === 2 && !F3('beaFix')) return beaTwo();
  if (C3.ch >= 3) return beaLate();
  await say2([[BE, `Zzz — no, I'm up. Is it noon? Never mind.`]]);
}
SCENES.apt3A.ents = () => [
  { id: 'mat', kind: 'prop3', at: [-3.4, 0, 5.2], label: 'MATTRESS', range: 2.0, draw3: () => {}, talk: () => say(C3.ch === 1 ? `A MATTRESS ON THE FLOOR. A CRATE. A BOW TIE ON A NAIL. HOME.` : `YOUR MATTRESS. IT IS STILL ON THE FLOOR. IT IS FINE.`, null) },
  { id: 'closet', kind: 'prop3', at: [-4.3, 0, 7.0], label: 'CLOSET', range: 1.8, draw3: () => {}, talk: () => closetTalk() },
  { id: 'plant', kind: 'prop3', at: [-5, 0, 2.4], label: 'GERALD', range: 1.6, cond: () => C3.decor.plant, draw3: () => {}, talk: () => plantTalk() },
  { id: 'homeitems', kind: 'prop3', at: [0, 0, 4.4], label: 'HOME', range: 1.4, draw3: () => {}, talk: () => homeScreen() },
  homeGhostEntity(),
  { id: 'door', kind: 'prop3', at: [0, 0, 1.7], label: 'THE DOOR', range: 1.3, cond: () => C3.ch === 5 && F3('finale') && !F3('finaleDone'), draw3: () => {}, talk: () => finaleDoor() },
  { id: 'recs', kind: 'prop3', at: [4.4, 0, 3], label: 'SHELF', range: 1.6, cond: () => C3.ch === 5 && F3('finale') && !F3('shelfDone'), draw3: () => {}, talk: () => finaleShelf() },
];
SCENES.apt3A.drawOver = () => {
  const L = p => liveLight(WX.sc, p), D = (k, p, yaw = 3.14) => drawModel(FURN[k], { p, yaw }, L(p)), d = C3.decor;
  if (d.mattress) D('mattress', [-3.4, 0, 5.2], 0); if (d.crate) D('crate', [2.6, 0, 4.6], .3); if (d.bowtie) D('bowtie', [-4.2, 1.75, 8.85], 0);
  if (d.rug) D('rug', [0, .01, 3.4], 0); if (d.sofa) D('sofa', [0.4, 0, 7.8], 3.14 + (d.sofaDrop ? .25 : 0)); if (d.lamp) D('lamp', [-5.0, 0, 3.2]);
  if (d.radio) D('radio', [3.2, .62, 4.6]); if (d.tele) D('tele', [-5.1, 0, 4.4]); else if (d.bong) D('bong', [-5.1, 0, 4.4]);
  if (d.curtains) D('curtains', [2, 1.2, 8.88], 0); if (d.plant) D('plant', [-5, 0, 2.4]); if (d.saucepan) D('saucepan', [4.6, 1.0, 7.8]);
  C3.gifts.slice(0, 5).forEach((g, i) => D('gift', [-1.8 + i * .9, 0, 8.3]));
  if (d.cake) D('cake', [1.8, 0, 7.4]);
  if (F3('dee')) drawModel(MODELS_P.kid2, { p: [-1.6, 0, 6], yaw: 3.14 }, L([-1.6, 0, 6]));
};
async function closetTalk() {
  if (C3.quietPolicy && C3.quietPolicy.source) return quietCloset();
  if (C3.ch === 1) return say2([['CARL', `It's a closet. It's closed. I'm not testing it.`]]);
  if (F3('voiceMet')) { if (!F3('wallTalked')) { setF3('wallTalked'); return say2([[`VOICE`, `Hello, Carl. It's me. Are you using the water?`], ['CARL', `That's a question I answer in the morning.`]]); } return say(`KNOCK. KNOCK. (IT'S A FRIENDLY KNOCK NOW.)`, null); }
  await say2([['CARL', `Hello?`]]); sfx('hurt'); await say(`KNOCK.`, null); await say2([['CARL', `That's not where the door is.`]]);
}
async function plantTalk() {
  const d = Math.floor(C3.time / 1500);
  if (C3.plantWet === d) return say(`GERALD IS WET. GERALD IS SATISFIED. GERALD IS STILL LOOKING AT YOU.`, null);
  C3.plantWet = d; C3.plant++; sfx('get');
  await say(pick([`YOU WATER GERALD. HE GROWS A LEAF. HE DOES NOT THANK YOU.`, `GERALD LEANS TOWARD THE DOOR. HE WANTS TO SEE THE OTHER APARTMENTS.`, `GERALD IS TALLER. THIS IS NOT ALLOWED BY THE LEASE. NOBODY HAS TOLD HIM.`]), null);
}
async function noticeScene() {
  await wait(20);
  await say(`MORNING. A DRONE HAS SLIPPED A NOTICE UNDER THE DOOR. THE NOTICE CAME WITH A SOUND EFFECT.`, null);
  addEnt3(npcR('drone', 'drone', 0, 3.4, 'COMPLIANCE', () => {}, { range: 1 })).faceCarl = 1;
  await say2([[DR, `GOOD MORNING, UNIT 3A. YOU HAVE RECEIVED A NOISE COMPLAINT.`], [DR, `3:07 A.M. A KNOCKING. SOURCE: YOUR WALL. COMPLAINANT: THE BUILDING.`], ['CARL', `The building complained about itself?`], [DR, `THE BUILDING DOES NOT COMPLAIN. NORMAL LIVING FILES THE COMPLAINT ON BEHALF OF THE BUILDING. PLEASE SEE THE LEASING OFFICE.`]]);
  const dr = ent3('drone'); if (dr) dr.gone = 1; setF3('notice'); setF3('n2');
}
