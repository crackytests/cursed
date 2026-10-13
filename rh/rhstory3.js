'use strict';
// ================= CARL: RESIDENT HUMAN. chapters 3 to 5, the endings =================
const OKA = 'OKAFOR', QU = 'QUILL', DEE = 'DEE';
Object.assign(VOICE, { DEE: [900, 50] }); regBust(DEE, genBust({ skin: '#8a5a3a', hair: '#101010', top: '#e06a40' }), '#ff9a60');
const honest = () => C3.said.filter(s => s.st === 'KEPT' || s.st === 'TAKEN BACK' || s.st === 'BACKED UP' || s.st === 'DOUBLED DOWN').length;
// ---------------- the objective, chapters 3-5 ----------------
function objective2() {
  const f = F3, ch = C3.ch;
  if (ch === 3) {
    if (!f('ghostTalked')) return ['A visitor is in the lobby', 'lobby', 'ghost'];
    if (!f('form')) return ['Orrin knows the form for a ghost', 'apt3B', 'orrin'];
    if (!f('ghostSet')) return ['Take your guest home. Unit 3A', 'apt3A', 'ghost'];
    if (f('inspectionDone') && (!C3.workOrders || !C3.workOrders.reviewed)) return workOrdersObjective();
    if (C3.quietPolicy && C3.quietPolicy.source && !C3.quietPolicy.done) return quietPolicyObjective();
    if (!f('garfDone')) return ['A detective is waiting in the lobby', 'lobby', 'garf'];
    if (!f('marisolMet') || !f('voiceAsked')) return ['Meet Marisol before the mixer', 'floor3', 'marisol'];
    if (!f('mixerDone')) return ['The residents\' mixer is in the community room', 'community', 'podium'];
    if (!f('roofDone')) return ['Roz is waiting on the roof', 'roof', 'rozroof'];
    return ['Marisol wants a word on floor 3', 'floor3', 'marisol'];
  }
  if (ch === 4) {
    if (!f('recs')) return ['The B button works now. Look around the closed mall', 'mallB1', 'recs'];
    if (!f('bag')) return ['A mailbag is under the old post kiosk', 'mallB1', 'bag'];
    if (!f('okaforDone')) return ['B2 has residents. Find Mr. Okafor', 'b2', 'okafor'];
    if (!f('quillDone')) return ['The second B2: the first floor. Find Mr. Quill', 'b2b', 'quill'];
    if (mailCarryingA()) return mailObjective();
    if (!f('nellIn')) return ['A red door at the end of B2 (again)', 'b2b', 'back3f'];
    return ['Someone is waiting behind the red door', 'apt3F', 'nell'];
  }
  if (f('finale')) return !f('shelfDone') ? ['Put the records on the shelf', 'apt3A', 'recs'] : ['Someone is knocking. At the actual door', 'apt3A', 'door'];
  if (!f('announced')) return ['Go to the lobby', 'lobby', 'linda'];
  if (!f('a_orrin')) return ['Ask Orrin for help', 'lobby', 'orrin5'];
  if (!f('a_bea')) return ['Ask Bea for help', 'lobby', 'bea5'];
  if (!f('a_roz')) return ['Ask Roz for help', 'lobby', 'roz5'];
  if (!f('a_marisol')) return ['Ask Marisol for help', 'lobby', 'marisol5'];
  if (!f('a_nell')) return ['Ask Nell for help. 3F is open', 'apt3F', 'nell'];
  if (resetActive()) return resetObjective();
  if (!f('intercomDone')) return ['The control room is past the maintenance corridor', 'control', 'desk'];
  return ['Go home. Unit 3A', 'apt3A', 'recs'];
}
// ---------------- the ghost, the drone, the detective ----------------
const extraLobby = () => [
  npcR('orrin5', 'orrin', -8, 8, 'ORRIN', () => allyAsk('orrin'), { cond: () => C3.ch === 5 && F3('announced') && !F3('intercomDone'), range: 2.2 }),
  npcR('bea5', 'bea', -4.4, 7.6, 'BEA', () => allyAsk('bea'), { cond: () => C3.ch === 5 && F3('announced') && !F3('intercomDone'), range: 2.2 }),
  npcR('roz5', 'roz', 0, 7.2, 'ROZ', () => allyAsk('roz'), { cond: () => C3.ch === 5 && F3('announced') && !F3('intercomDone'), range: 2.2 }),
  npcR('marisol5', 'marisol', 4, 8, 'MARISOL', () => allyAsk('marisol'), { cond: () => C3.ch === 5 && F3('announced') && !F3('intercomDone'), range: 2.2 }),
];
SCENES.lobby.init = () => { if (C3.ch === 5 && F3('reset') && !F3('announced')) wstory(announce); };
async function ghostLobby() {
  setF3('droneUp');
  await say2([[GH3, `CARL!! BOO!! I got a ROOM! They said "visitor" and then they said "unauthorized occupant" and I took it as a compliment!`], ['CARL', `Hi.`], [DR, `UNAUTHORIZED OCCUPANT DETECTED. PLEASE EXPLAIN.`]]);
  const o = await sayMenu(DR, `STATE THE RELATIONSHIP.`, [{ id: 'ghost', label: `HE'S MY EMOTIONAL SUPPORT GHOST.` }, { id: null, label: `HE'S A GUEST. HE'S VISITING.` }]);
  if (o.id) await say2([[DR, `EMOTIONAL SUPPORT. A QUALIFYING CATEGORY. THERE IS NO CATEGORY FOR GHOSTS. I WILL ENTER "SUPPORT".`], [GH3, `I FEEL SUPPORTIVE.`]]); else await say2([[DR, `GUESTS MAY STAY TWO HOURS. THIS GUEST IS ALREADY THREE. HE MUST FILL OUT FORM 11-B.`]]);
  await say2([[DR, `THE FORM IS HELD BY ORRIN IN 3B. HE HAS BEEN WAITING FOR AN OCCASION. DO NOT TELL HIM IT'S AN OCCASION.`]]);
  setF3('ghostTalked'); setF3('formNeed'); good('ghost', 1);
  const g = ent3('ghost'); if (g) g.gone = 1;
}
async function ghostHome() { if(homeActivitiesAvailable() || homeGhost()) return homeGhostEvening(); await say2([[GH3, pick([`I like the couch! It's the only one I've been on that holds still!`, `Carl! Carl! The wall knocked at me. I knocked back. We're pals!`, `Do you want to hear my impression of a smoke detector?`])]]); }
async function droneLobby() { return say2([[DR, pick([`PLEASE REMAIN STANDARD.`, `YOUR LEASE IS A LIVING DOCUMENT. DO NOT ASK WHAT IT IS EATING.`, `I HAVE NO OPINIONS. I ONLY HAVE A CLIPBOARD.`])]]); }
async function orrinForm() {
  await say2([[OR, `A ghost. As an occupant. I have the form. It's 11-B: REQUEST FOR PERMISSION TO BE PRESENT IN A UNIT. It has never been filled. I am so excited I am sweating through the carbon.`]]);
  const FQ = [[`OCCUPANT'S NAME`, [`SPOOKY GHOST`, `GHOST`, `BOO`], [`That's a good name. It has a verb in it.`, `Very honest. Minimal.`, `I'll write "Boo (surname)".`]], [`IS THE OCCUPANT LIVING?`, [`NO`, `SORT OF`, `HE'S STILL FINDING OUT`], [`Thank you. Honesty looks well on the form.`, `"Sort of." I can write "sort of." There's a margin.`, `Aren't we all. I'll leave it blank. Blank is fine.`]], [`RELATIONSHIP TO RESIDENT`, [`EMOTIONAL SUPPORT`, `FRIEND`, `LANDLORD (HAUNTING)`], [`Qualifying category.`, `I'll write "friend". Nobody has ever written it before.`, `That would require another form.`]]];
  const fill = async n => { for (let i = 0; i < n; i++) { const q = FQ[i], k = await ask(`FORM 11-B: ${q[0]}`, null, q[1]); await say2([[OR, q[2][k]]]); } };
  if (saidOf('ghost') && saidOf('ghost').st === 'OPEN') {
    await callback('ghost', OR, () => say2([[OR, `You told the drone he's your emotional support ghost. Then it's a claim. Claims need supporting paperwork. Let's fill it together.`]]), {
      doIt: async () => { await fill(3); await say2([[OR, `Support confirmed. He is supporting you. I can see it. It's mostly in the hovering.`]]); good('orrin', 1); good('ghost', 1); },
      admit: async () => { await say2([['CARL', `He's not emotional support. He's my friend. I said the other thing so they'd let him in.`], [OR, `"Friend". I'll write it in. It'll make the paperwork look unprofessional, and I will love it.`]]); await fill(2); good('orrin', 1); good('ghost', 2); },
      dbl: async () => { await say2([['CARL', `He's my emotional support. He supports me. Look at him.`], [GH3, `I'M SUPPORTING!`], [OR, `Then he should be able to support the form. Sit. Both of you. This will take a while.`]]); await fill(3); good('orrin', 0); },
    });
  } else await fill(2);
  setF3('form'); setF3('ghostHome'); await say2([[OR, `Approved. He may be in 3A. Between nine and twenty-one hundred. After that he must be furniture.`]]);
}
async function ghostSettle() {
  setF3('ghostSet'); await wait(30);
  await say2([[GH3, `CARL!! The couch holds still! It holds so still! I want to be a couch.`], ['CARL', `You're a guest.`], [GH3, `I'M A GUEST WHO LIVES HERE NOW. IT'S FANTASTIC.`]]);
  await say(`THE DOOR BEEPS. THE KIOSK IS TALKING THROUGH THE INTERCOM: "A DETECTIVE HAS ARRIVED FOR A DISPUTED INCIDENT."`, null);
  setF3('garfIn');
  if (F3('inspectionDone')) await startWorkOrders();
}
async function garfLobby() {
  await say2([[GA, `Garfield. I investigate incidents. This building has eleven. Yours has the most adjectives.`], ['CARL', `What's the incident?`], [GA, `Noise, mostly. Also a cake that wasn't there. A telescope that smells. A package that isn't a package. A man who said he was maintenance, and was not.`], [GA, `I don't care if you lied, Carl. I care whether the building can live with it.`]]);
  const open = C3.said.filter(s => s.st === 'OPEN');
  await say2([[GA, `You've said ${C3.said.length} things in this building. ${open.length} of them are still open. Open is how my cases start.`]]);
  const k = await ask(`THE DETECTIVE IS WAITING.`, GA, [`I STAND BY IT ALL`, `I'LL SORT THEM OUT`, `SOME OF THOSE WERE HYPOTHETICAL`]);
  if (k === 2) { for (const s of C3.said) if (s.st === 'OPEN' && s.id !== 'human' && s.id !== 'sealed') s.st = 'TAKEN BACK'; good('garf', 2); await say2([['CARL', `Some of those were hypothetical.`], [GA, `That's the first useful sentence in this file. I'm going to put it in bold.`]]); }
  else if (k === 1) { good('garf', 1); await say2([[GA, `Good. Sort them. Do it before the mixer. People talk at mixers.`]]); }
  else { good('garf', -1); await say2([[GA, `You stand by all of it. Okay. That's a brave position and a stupid one. I'll watch.`]]); }
  await say2([[GA, `There's a residents' mixer. Community room. Everybody's invited. I'll be there with a notepad.`]]);
  setF3('garfDone'); setF3('mixer'); tickC('mixer time', 'user_000');
  const g = ent3('garf'); if (g) g.gone = 1;
}
// ---------------- lindaThree, the mixer ----------------
async function lindaThree() {
  if (!F3('mixerDone')) return say2([[LI3, `The mixer! It's a social. It's a social event for the purpose of socializing. I'll be there. I'll be in spirit. I'll be in the minutes.`]]);
  return say2([[LI3, `Carl! I hear it went well. I don't hear everything. But I hear that.`]]);
}
async function mixerEvent() {
  if (!F3('marisolMet') || !F3('voiceAsked')) await marisolTalk();
  await wait(20);
  const cast = [['mo', 'orrin', -4, 6, 'ORRIN'], ['mb', 'bea', 4, 6.6, 'BEA'], ['mr', 'roz', 5.6, 4, 'ROZ'], ['mm', 'marisol', 0, 7.6, 'MARISOL'], ['mg', 'garf', -6, 4, 'GARF'], ['mh', 'ghost', 2, 4, 'GHOST']].map(([id, m, x, z, l]) => addEnt3(npcR(id, m, x, z, l, () => {}, { range: .1 })));
  await say(`THE COMMUNITY ROOM. SIX PEOPLE, A TABLE, FIFTEEN CHAIRS IN COMPATIBILITY ORDER.`, null);
  await say("Welcome, everyone, to the third floor's first residents' mixer. We have snacks. They're all the same snack.", MA);
  await inspectionMixer();
  await workOrdersMixer();
  await quietPolicyMixer();
  await say(saidOf('voice') && saidOf('voice').st === 'OPEN' ? "And now: a strong voice. Carl, from 3A. You said you'd speak." : 'Carl, from 3A. You came. Would you like the floor?', MA);
  const speak = async () => {
    await say2([[MA, `The floor is yours. The podium is lit.`]]);
    const k1 = await ask(`WHAT DOES THIS BUILDING NEED?`, null, [`SOMEONE TO ADMIT IT'S WEIRD`, `LESS NOISE, MORE FAIRNESS`, `A SOFA THAT STAYS WHERE IT'S PUT`]);
    await say2([[MA, [`That's true. And hard. I'm clapping for the hard part.`, `That's the platform! You wrote the platform!`, `...Okay. That is a very specific need. I respect it.`][k1]]]);
    const k2 = await ask(`WHO DOES THIS BUILDING BELONG TO?`, null, [`WHOEVER LIVES IN IT`, `THE STANDARD RESIDENT`, `THE KNOCKING`]);
    await say2([[MA, [`Whoever lives in it. I'm writing that on the banner.`, `...The standard resident. Hm. I'll ask who that is.`, `The knocking. I hear it too.`][k2]]]);
    if (k1 === 0 || k2 === 0) good('marisol', 2); else if (k2 === 2) good('marisol', 1); else good('marisol', 0);
    await say2([[GH3, `GOOD SPEECH!!!`]]);
  };
  if (saidOf('voice') && saidOf('voice').st === 'OPEN') {
    await callback('voice', MA, () => say2([[MA, `You said, in the hall, "Sure. I'll speak at the meeting. I'm a strong voice." I've scheduled you.`]]), { doIt: speak, admit: async () => { await say2([['CARL', `I don't have anything to say. I said it to be polite. It was hypothetical.`], [MA, `That's honest. It's the most honest thing anyone's said at a podium. Please stay at the podium for that.`]]); good('marisol', 1); }, dbl: async () => { await say2([['CARL', `I'm a strong voice. But I need a minute. And a different podium.`], [MA, `We have one podium. It's the one with the light.`]]); await speak(); } });
  } else { await say2([[MA, `Say a few words, if you like. Or don't. Silence is a position.`]]); const k = await ask(`WILL YOU SPEAK?`, null, [`I'LL SAY A FEW WORDS`, `I'LL PASS`]); if (k === 0) await speak(); else { await say2([[MA, `That's allowed. Barely.`]]); } }
  // the cake
  await say2([[OR, `And now. It is... time for the matter of the cake.`]]);
  if (F3('partyPromised')) {
    setF3('cakeOn'); C3.decor.cake = 1; await say(`A CAKE ARRIVES. IT IS THE MOST NORMAL CAKE EVER MADE. ONE CANDLE.`, null);
    await say2([[OR, `Is it customary to hold the candle yourself, or to let the table sing?`], ['CARL', `The table sings.`], [MA, `Happy birthday, to Orrin.`], [BE, `Happy birthday, Orrin.`], [RZ, `Happy — what number are we on?`], [OR, `I... don't know. I don't have one. I'll choose seven.`]]);
    const k = await ask(`THE CANDLE.`, null, [`HELP HIM BLOW IT OUT`, `LET HIM FIGURE IT OUT`]);
    await say2([[OR, k === 0 ? `Together. That feels correct. It is a good first birthday. I feel several things.` : `I will blow... I will exhale in its direction. It's out. It's out! I'm a person with a cake!`]]); good('orrin', k === 0 ? 3 : 2);
  } else await say2([[OR, `There is no cake. No cake was promised. I am, strangely, relieved. I brought a plain cracker. It's fine.`]]);
  // the detective
  await say2([[GA, F3('cakeOn') ? "Okay. I've been taking notes. Orrin has a birthday now. It started as an excuse. It ended with a cake." : 'Okay. I have been taking notes. Orrin brought a cracker. Nobody has to invent a birthday to belong at this table.'],
    [GA, 'There are people here. Some of their statements hold up. Some do not. The people stayed. That is the useful part.']]);
  await say2([[GA, `Case closed, Carl. I'll note: "Incident resolved by tenants." I'll also note: "Carl is the problem, but the useful kind."`]]);
  good('garf', 1); if (saidOf('human')) await say2([[GA, `One thing, though. You signed for "human only". I can't solve that. It's a lease issue, and I'm afraid I'm the wrong kind of detective for lease issues.`]]);
  cast.forEach(e => e.gone = 1); setF3('mixerDone'); await say2([[RZ, `Meet me on the roof, dear. The stars start at ten.`]]); saveC3();
}
async function roofScene() {
  await say2([[RZ, `There you are. Sit. Don't sit there. That's the kitchen stool. It came up with me, it's attached to me now.`]]);
  const run1 = async () => { await say2([['CARL', `Okay. Okay. You look through this end.`]]); await tune('FOCUS THE STARS'); await say2([[RZ, `Oh. Oh my. Oh, look at that. That's... that's the building from the other side.`], [RZ, `That's all of it. I can see all the floors. I can see the ones they didn't list.`]]); good('roz', 2); };
  if (saidOf('telescope') && saidOf('telescope').st === 'OPEN') {
    await callback('telescope', RZ, () => say2([[RZ, `You said it was a telescope. For the stars. I've been waiting forty years for a clear piece of sky.`]]), {
      doIt: run1,
      admit: async () => { await say2([['CARL', `It's not a telescope. It's a bong. I said it was a telescope because I panicked.`], [RZ, `Dear, I know. I've been very relaxed. But the sky is real. Come here. Look up. With your own eyes.`], ['CARL', `...Wow.`], [RZ, `Isn't it? It doesn't need a lens.`]]); good('roz', 3); },
      dbl: async () => { await say2([['CARL', `It's a telescope. You have to believe it.`], [RZ, `I believe it, dear. I'm looking through the wrong end.`]]); await tune('FOCUS THE STARS'); good('roz', 1); },
    });
  } else { await say2([[RZ, `Not a telescope. I know. Look up with me. It's good enough.`]]); good('roz', 2); }
  await say2([[RZ, `Dee used to come up here. Dee's the one in the marks. The wall in my kitchen. Dee's last mark is eight years old. I keep adding them. I say they're for Dee. They're for me.`], [RZ, `The building stopped listing Dee. I stopped asking the building.`]]);
  setF3('roofDone'); setF3('rozDee'); await say(`THE ROOF IS COLD. THE SKY IS ENORMOUS. FAR BELOW, THE BUILDING MAKES A SOUND LIKE SOMEONE CLEARING THEIR THROAT.`, null);
}
async function marisolSealed() {
  await say2([[MA, F3('voiceAsked') && saidOf('voice') && saidOf('voice').st !== 'TAKEN BACK' ? `Carl. A word. You're a strong voice, now, officially. I need something.` : `Carl. A word. You're a neighbor. I need something.`], [MA, `3F. The door that's painted shut. It's warm. It's been warm for three weeks. I've filed it twice.`]]);
  if (saidOf('sealed')) await callback('sealed', MA, () => say2([[MA, `You said you knew who lives behind 3F. You said you were close. I need you to back it up.`]]), { doIt: async () => { await say2([['CARL', `I can't tell you who. I can tell you where to look. The elevator. B. And the other B. And the other B.`], [MA, `The buttons. Yes. Yes! Someone moved the buttons.`]]); good('marisol', 2); }, admit: async () => { await say2([['CARL', `I don't know who lives there. I said it to sound like a neighbor. It was hypothetical.`], [MA, `Thank you. I'm going to find out with you, instead.`]]); good('marisol', 2); }, dbl: async () => { await say2([['CARL', `I know exactly who lives there. A woman. Named... Dolores.`], [MA, `Dolores. There's no Dolores. I'd have it on a list.`], ['CARL', `The list is wrong.`], [MA, `...Maybe. It's been wrong before. It was wrong about me.`]]); good('marisol', 0); } });
  else await say2([[MA, `Will you help me find out? I'd like a strong voice with me.`]]);
  setF3('sealedCb'); setF3('ch4'); C3.ch = 4; await say(`THE ELEVATOR DINGS IN THE DISTANCE. THE BUTTONS ARE LIT: B, B2, AND B2 AGAIN. SOMEONE HAS FINALLY TAKEN THE TAPE OFF.`, null);
  await showCard([`CHAPTER 4`, `BELOW MARKET RATE`], 110, { fg: hex('#ffd848'), sc: 2 }); saveC3(); await plantNotice();
}
async function plantNotice() {
  await say(`A DRONE DRIFTS DOWN THE CORRIDOR WITH A MEASURING TAPE. IT STOPS AT 3A.`, null);
  if (!saidOf('plant')) { await say2([[DR, `UNIT 3A HAS AN UNREGISTERED PLANT. IT IS NOT YOURS. NOBODY CLAIMED IT. IT WILL BE REMOVED.`], ['CARL', `Okay.`]]); C3.plant += 1; return; }
  await callback('plant', DR, () => say2([[DR, `UNIT 3A EXCEEDS PERMITTED GREENERY BY FOUR LEAVES AND A VINE. THE VINE IS IN THE WALL. YOU SAID THE PACKAGE WAS YOURS. THE PLANT IS YOURS. THE VINE IS YOURS. WHAT DO YOU INTEND TO DO?`]]), {
    doIt: async () => { await say2([['CARL', `He's mine. Gerald is my responsibility. He can have the vine.`], [DR, `NOTED. THE VINE IS REGISTERED AS A PET.`]]); C3.plant += 3; good('nell', 1); },
    admit: async () => { await say2([['CARL', `It's not mine. I said it was so the box wouldn't be returned. It was hypothetical.`], [DR, `THE PLANT WILL BE REMOVED. IT WILL BE PLACED... SOMEWHERE ELSE.`], ['CARL', `...Wait. Put him in the laundry. By the window.`]]); C3.decor.plant = 0; C3.plant += 1; },
    dbl: async () => { await say2([['CARL', `It's a small plant. The vine is a mistake.`], [DR, `THE VINE IS NINE METERS. YOU ARE A LIAR AND A GARDENER.`]]); C3.plant += 2; },
  });
}
// ---------------- chapter 4: down ----------------
SCENES.mallB1.ents = () => [
  { id: 'elev', kind: 'prop3', to: ['floor3', 'lobby', 'roof', 'b2', 'b2b'], at: [20.8, 0, 4.4], label: 'ELEVATOR', range: 2, draw3: () => {}, talk: () => elevator('mallB1') },
  { id: 'recs', kind: 'prop3', at: [-14, 0, 5.4], label: 'RECORD BIN', range: 2, cond: () => !F3('recs'), draw3: e => drawModel(MODEL.crate, { p: [-14, 0, 4.2], yaw: .4 }, liveLight(WX.sc, e.p)), talk: () => { setF3('recs'); sfx('get'); return say(`A BIN OF RECORDS, STILL IN SLEEVES. THE LABEL SAYS "O. OKAFOR, 2". THEY HAVE BEEN WAITING FOR SOMEONE TO NEED THEM.`, null); } },
  { id: 'bag', kind: 'prop3', at: [-5, 0, 16.6], label: 'MAILBAG', range: 2, cond: () => !F3('bag'), draw3: e => drawModel(MODEL.parcel, { p: [-5, 0, 16.6], yaw: 1 }, liveLight(WX.sc, e.p)), talk: () => { setF3('bag'); sfx('get'); return say(`A CANVAS MAILBAG UNDER THE DEAD POST KIOSK. THERE ARE FOUR LETTERS IN IT. ALL OF THEM SAY "RESIDENT" AND THE DATE IS FIFTY YEARS AGO.`, null); } },
  { id: 'photo', kind: 'prop3', at: [12, 0, 14], label: 'FRAMED PHOTO', range: 2, cond: () => !F3('photo'), draw3: () => {}, talk: () => { setF3('photo'); sfx('get'); return say(`A FRAMED PHOTO LEANS AGAINST A DEAD PLANTER. A WOMAN IN A CARDIGAN, A CHILD UP TO HER ELBOW. ON THE BACK, IN MARKER: "ROZ + DEE. 3D."`, null); } },
  { id: 'dir', kind: 'prop3', at: [0, 0, 6], label: 'DIRECTORY', range: 2, draw3: () => {}, talk: () => say(`THE MALL DIRECTORY. AT THE BOTTOM, IN A NEWER FONT: "RESIDENTS: NONE (VERIFIED)." SEVERAL OF THE LETTERS ARE UNDERLINED IN PEN.`, null) },
];
SCENES.mallB1.exits = [];
SCENES.b2.ents = () => [
  { id: 'elev', kind: 'prop3', to: ['floor3', 'lobby', 'roof', 'mallB1', 'b2b'], at: [21.6, 0, 8.2], label: 'ELEVATOR', range: 1.8, draw3: () => {}, talk: () => elevator('b2') },
  npcR('okafor', 'okafor', -17, 7.4, 'OKAFOR', () => okafor(), { range: 2.4 }),
  npcR('dee', 'kid2', 10, 6.5, 'DEE', () => dee(), { range: 2.2 }),
];
SCENES.b2.exits = [];
async function okafor() {
  if (F3('okaforDone')) return say2([[OKA, `Thank you again. Go through the floor. Keep going. The other floor is real, too.`]]);
  await say2([[OKA, `You have an elevator key and a lease and an expression. You're from above.`], ['CARL', `I live in 3A.`], [OKA, `Then you're in a building that isn't mine. This is mine. This is Unit 2 and I've been standing at its door since the directory changed.`]]);
  if (F3('recs')) {
    await say2([['CARL', `I found your records. They were in a bin in the mall.`], [OKA, `The Hendrix. The Coltrane. The first pressing of a song nobody's played in fifty years. You went into the mall and found them.`], [OKA, `I didn't ask. Nobody asked. You went.`]]);
    sfx('get'); C3.good.okafor = 1; setF3('b2key'); C3.decor.curtains = 0; setF3('curtainsHave');
    await say2([[OKA, `Here: a key. It's the stair to the other B2. And these. Real blackout curtains. I don't use them. I'm not allowed to sleep.`]]);
    if (C3.plant >= 3) await say2([[OKA, `Your plant came through the vent last week. A vine. It's in my kitchen. It has opinions about my kettle. It's the only visitor I've had in eight years. Thank you.`]]); else await say2([[OKA, `Nobody's visited. A plant would have been nice. Never mind.`]]);
    setF3('okaforDone'); tickC('DOWNSTAIRS: SOMEONE IS TALKING TO CARL', 'user_000');
  } else await say2([[OKA, `Come back with what you find. Records. I've lost my records.`]]);
}
async function dee() {
  if (C3.ch>=4 && (!F3('deeDone') || mailCarryingB())) return mailDeeTalk();
  if (F3('deeDone')) return say2([[DEE, `Tell her I'm this tall. Tell her I got a little taller.`]]);
  await say2([[DEE, `Who are you? Do you know my mom? You smell like the third floor.`], ['CARL', `I know a woman in 3D. She has a very good kitchen.`], [DEE, `That's my mom! I'm Dee! I'm in the wall! Can you tell her I'm okay?`]]);
  if (F3('photo')) { await say2([['CARL', `I found a photograph.`], [DEE, `That's us! Mom's got the cardigan! I was this short!`]]); sfx('get'); setF3('deePhoto'); C3.good.roz = (C3.good.roz || 0) + 2; await say2([[DEE, `Draw me a mark. Here, use this pen. Tell her: this tall.`]]); setF3('deePen'); setF3('deeDone'); setF3('dee'); }
  else await say2([[DEE, `If you find anything of ours, we lost it in the move. We didn't move. We lost it anyway.`]]);
}
SCENES.b2b.ents = () => [
  { id: 'elev', kind: 'prop3', to: ['floor3', 'lobby', 'roof', 'mallB1', 'b2'], at: [-16.6, 0, 8.2], label: 'ELEVATOR', range: 1.8, draw3: () => {}, talk: () => elevator('b2b') },
  npcR('quill', 'quill', 2, 7.4, 'QUILL', () => quill(), { range: 2.4 }),
  { id: 'back3f', kind: 'prop3', to: 'apt3F', at: [15.4, 0, 8.3], label: C3.ch===4 && !F3('nellMet')?'RED SERVICE DOOR':'3F (BACK DOOR)', range: 1.8, draw3: () => {}, talk: () => back3F() },
];
SCENES.b2b.exits = [];
async function quill() {
  if (C3.ch===4 && F3('bag') && !F3('quillDone') || mailA()) return mailQuill();
  if (F3('quillDone')) return say2([[QU, `The post goes through. That's all I wanted.`]]);
  await say2([[QU, `I'm the mailman. For this building. For the original one. There was a mailbag. They took it with the walls.`]]);
  if (F3('bag')) { sfx('get'); await say2([['CARL', `It was under the kiosk in the mall.`], [QU, `Four letters. Fifty years late. I knew there'd be a day. I'm going to deliver them. To the people they're for. Even if they're not on the list.`], [QU, `The red door at the end. That's the back door of 3F. You'd call it the sealed one. The woman inside has been waiting a long time for a visitor.`]]); setF3('quillDone'); good('nell', 1); }
  else await say2([[QU, `I won't leave without my bag. A mailman isn't a mailman without one.`]]);
}
async function back3F() { if(C3.ch===4 && !F3('quillDone')) return say('AN OLD SERVICE DOOR. THE ADDRESS IS UNDER THE PAINT. A NOTE SAYS KNOCK THREE TIMES. QUILL HAS THE SERVICE POST.',null); if(mailCarryingA()) return mailServiceDoor(); if (!F3('quillDone')) return say(`A RED DOOR. LOCKED. A SIGN ON IT: "3F (SERVICE)". A HAND-LETTERED POST-IT: "KNOCK THREE TIMES. NOT LIKE THE OTHER ONE."`, null); setF3('nellIn'); return enter('apt3F'); }
// ---------------- 3F: Nell ----------------
SCENES.apt3F.ents = () => [
  npcR('nell', 'nell', 0, 4.6, 'NELL', () => nell(), { range: 2.6 }),
  { id: 'pans', kind: 'prop3', at: [-4.6, 0, 6.6], label: 'THE KITCHEN', range: 2, draw3: () => {}, talk: () => say(`EVERY POT IN THE BUILDING IS HERE, OR SHOULD BE. THERE'S A HOOK ON THE WALL FOR ONE MORE.`, null) },
  { id: 'nellout', kind: 'prop3', to: 'b2b', at: [0, 0, 1.6], label: 'BACK DOOR', range: 1, cond: () => false, draw3: () => {}, talk: () => {} },
];
SCENES.apt3F.exits = [{ r: [-1.4, 1, 1.4, 1.55], to: 'floor3', x: 11, z: 7, yaw: 0, if: () => F3('nellOpen'), no: async () => {} }];
async function nell() {
  if (C3.ch === 4 && !F3('nellMet')) {
    setF3('nellMet');
    await say2([[NL, `You're taller than you sound.`], ['CARL', `Hi. Nell?`], [NL, `Nell. Unit 3F. Eleven years, then forty, then the edits. I knocked every night. I was sure it was a language.`], ['CARL', `I borrowed your saucepan.`], [NL, `I know. I could see you from the vent. You hold it like it's an alien object.`], ['CARL', `...It's a saucepan.`], [NL, `Oh, it is.`]]);
    if (saidOf('saucepan') && saidOf('saucepan').st === 'OPEN') await say2([['CARL', `I said I'd bring it back. Do you want it?`], [NL, `No. Keep it. Keep it upstairs. When they ask who lives here, I'd like a saucepan to be the answer.`]]);
    else await say2([[NL, `Keep it upstairs. When they ask who lives here, I'd like a saucepan to be the answer.`]]);
    await homeNellRecipe();
    await say2([[NL, `Listen. They're going to reset the building. Linda announced it on the old speakers. She's decided the whole place should be Standard. Everyone who isn't verified goes. The floors go. Me. The mailman. Okafor. Dee.`], [NL, `You've got three floors that like you. Use them.`]]);
    setF3('nellOpen'); if (saidOf('sealed')) closeSaid('sealed', 'BACKED UP');
    good('nell', 2); tickC('3F IS OPEN', 'system');
    setF3('reset'); C3.ch = 5; C3.resetRun = {phase:1};
    await showCard([`CHAPTER 5`, `PLEASE VACATE`], 110, { fg: hex('#ffd848'), sc: 2 });
    await goScene('lobby', 0, 3.4, 0); saveC3();
    return;
  }
  if (C3.ch >= 5) return allyAsk('nell');
  await say2([[NL, `Come in. Don't wipe your feet. They're going to be wiped anyway.`]]);
}
async function announce() {
  setF3('announced');
  await say2([[LI3, `Attention, all residents of THE RESIDENCES AT TOMORROW. I have wonderful news.`], [LI3, `NORMAL LIVING has completed a survey. Many units are not standard. We will be performing a full reset at midnight. Please remain in your units. Please remain standard.`], [KI, `PLEASE VACATE ANY SPACE THAT CANNOT BE VERIFIED.`]]);
  await say2([[MA, `That's not a thing. She doesn't get to do that. We have a tenants' association.`], [OR, `I'd like to go on record: I'm very afraid. I will help.`]]);
  tickC('MIDNIGHT', 'system'); await say(`THE RESIDENTS HAVE GATHERED. THEY ARE WAITING FOR YOU TO SAY SOMETHING. YOU ARE A STRONG VOICE, APPARENTLY.`, null);
  if(C3.resetRun)await resetBrief();
  saveC3();
}
// ---------------- chapter 5: please vacate ----------------
const ALLY = { orrin: [`Carl. I'll file paperwork until she's tired. I can keep a service closure on hold.`, `I don't... know what you've done for me. I'm sorry. I'm so sorry. I'll be at my door.`], bea: [`I'll hold a service door while you pass. I can hold a door for hours; I've been doing it for a diner.`, `I don't know you well enough to stand in the lobby for you. I'm tired. I'm sorry.`], roz: [`Dear. I'll keep the kitchen wall connected. The old marks still have an address.`, `I don't know what you've done. I'm sorry. I'm an old woman. My answer is on the wall.`], marisol: [`The association is behind you. I've called a vote. It carried. It was a vote of me and four other people, but it carried.`, `I can't back you yet. I don't know what you've actually done.`], nell: [`I'll restore the power from the pipes. Tell me when. I know where every valve is.`, `I can't, dear. I don't know you. I know the saucepan.`] };
async function allyAsk(who) {
  if (C3.ch < 5) return;
  const flag = 'a_' + who, name = who.toUpperCase(), a = ALLY[who]; if (F3(flag)) return say2([[name, F3(flag+'_weak')?'I cannot take that part. There is another route. Keep going.':resetActive()?'I will take my part. Keep the pipe route lit, then meet me at the service checkpoint or tenants board.':'I am ready when you are. Go to the control room.']]);
  await mailAllyMemory(who);
  await say2([['CARL', `Linda is going to reset the building. Will you help?`]]);
  const g = C3.good[who] || 0;
  if (g >= 1) { setF3(flag); good(who, 0); sfx('get'); await say2([[name, a[0]]]); tickC(name + ' IS WITH YOU', 'system'); if (who === 'roz' && F3('deeMark')) await say2([[RZ, 'Also, the pen. I see the new mark. Tell Dee.']]); }
  else { await say2([[name, a[1]]]); await say2([['CARL', `That's fair. I haven't been much of a neighbor.`]]); setF3(flag); setF3(flag + '_weak'); }
}
SCENES.control.ents = () => [
  { id: 'desk', kind: 'prop3', at: [0, 0, 4.6], label: 'INTERCOM', range: 2.4, draw3: () => {}, talk: () => intercom() },
  { id: 'out', kind: 'prop3', to: 'maint', at: [0, 0, 1.6], label: 'DOOR', range: 1.2, cond: () => !F3('intercomDone'), draw3: () => {}, talk: () => goScene('maint', 18, 4, 0) },
];
SCENES.control.exits = [];
const LINDAFOE = { name: 'CEO LINDA', port: 'CEO LINDA', id: 'linda5', patience: 12, weak: { LOGIC: 1.5, GRIEVANCE: 2, DENIAL: .5, RANT: 1 }, immune: [], atk: [`SOMEONE DOESN'T LIVE HERE. I DON'T MAKE THE RULES. I MAKE THE SIGNS.`, `NORMAL LIVING WAS DESIGNED FOR PEOPLE LIKE YOU. PEOPLE. LIKE. YOU.`, `THE LEASE SAYS "HUMAN." YOU CHECKED THE BOX, CARL.`, `THE BUILDING WOULD BE SO MUCH BETTER IF NOBODY LIVED IN IT.`], hit: 1, win: `LINDA: ...THE VERIFICATION HAS ... AN ERROR.`, hint: `grievance. a lot of grievance. and the saucepan` };
async function intercom() {
  if (F3('intercomDone')) return;
  if(resetActive() && C3.resetRun.phase<4)return say(resetObjective()[0]+'. THE MIC WILL WAIT.',null);
  const allies = ['orrin', 'bea', 'roz', 'marisol', 'nell'].filter(k => F3('a_' + k) && !F3('a_' + k + '_weak')), n = allies.length;
  await say2([['CARL', `I'm at the intercom. It's a big red button.`], [LI3, `(over the speaker) Carl. Are you in my control room? I was going to invite you to the reset. As a resident.`]]);
  await say(`THE MIC IS OPEN. EVERY ROOM IN THE BUILDING CAN HEAR YOU. THE INTERCOM ARGUMENT BEGINS.`, null);
  const foe = Object.assign({}, LINDAFOE); foe.patience = Math.max(5, 14 - n * 2 - (F3('gotSchedule') ? 2 : 0) - (F3('modelProof') ? 2 : 0) - (F3('wallTalk') ? 1 : 0)); foe.pmax = foe.patience;
  if (F3('gotSchedule')) await say2([['CARL', `Phase three: "Residents will be notified by the lights going out." That's not a notification. That's a power cut with a title.`], [LI3, `Where did you get that?`], ['CARL', `The copier. It was the only machine in the building that was on my side.`]]);
  if (F3('modelProof')) await say2([['CARL', `Your own model unit says occupancy means being present and responding to the building. Nell responds. Nell knocks. That's all it says.`], [KI, `THE MODEL UNIT IS A STANDARD DOCUMENT.`]]);
  await mailTestimony();
  const ALL = { orrin: [OR, `(over the PA) Carl, do not say "I'm human" again. Say a smaller true thing.`], bea: [BE, `(over the PA) I'm holding the lobby doors. I've been awake for three days. Try me.`], roz: [RZ, `(over the PA) You can't just decide somebody doesn't live here. I have forty marks on my wall.`], marisol: [MA, `(over the PA) The tenants' association objects. We've objected before. This time we're louder.`], nell: [NL, `(over the PA) I'll turn on the water if you ask me to. I know where the valve is.`] };
  if(C3.resetRun)await resetTestimony();else for (const k of allies) await say2([ALL[k]]);
  if (!n) await say2([['CARL', `(to himself) Nobody's coming. I haven't been a very good neighbor.`]]);
  let res = { win: false }, tries = 0;
  for (;;) {
    res = await argue3(foe); tries++;
    if (res.win) break;
    await showCard([`PLEASE VACATE`, '', `THE MIC IS STILL OPEN.`], 110, { fg: hex('#ff7ae0') });
    if (tries >= 2) { const k = await ask(`YOU'VE LOST TWICE. THE RESET IS COMING.`, null, [`ONE MORE TRY`, `PACK AND LEAVE`]); if (k === 1) return ending('evicted'); }
  }
  // the verification question
  await say2([[LI3, `Fine. Fine, Carl. One question. NORMAL LIVING will verify. Are you a human?`]]);
  const q = await ask(`THE QUESTION IS ON THE SPEAKER.`, null, [`THAT'S NOT THE QUESTION. WHO LIVES HERE?`, `I'M HUMAN.`, `NO. I'M NOT.`]);
  if (q === 0) { closeSaid('human', 'LEFT ALONE'); await say2([[LI3, `...That's not an answer.`], ['CARL', `It's the question that matters. Nell lives in 3F.`], [LI3, `Unit 3F is not in the directory. Their residency could not be verified.`], [RZ, `(over the PA) You can't just decide somebody doesn't live here.`], ['CARL', `I borrowed their saucepan. It's upstairs. What more do you need?`]]); good('nell', 1); }
  else if (q === 1) { closeSaid('human', 'DOUBLED DOWN'); await say2([[LI3, `Then there's nothing to fear! NORMAL LIVING will verify you tomorrow.`], ['CARL', `...That's fine. But Nell lives in 3F.`], [LI3, `Unit 3F is not in the directory. Their residency could not be verified.`], ['CARL', `I borrowed their saucepan. It's upstairs. What more do you need?`]]); }
  else { closeSaid('human', 'TAKEN BACK'); await say2([['CARL', `No. I'm not. I'm an alien. I'm a bad one. I have a pile of lease paperwork. It doesn't matter. Nell lives in 3F.`], [LI3, `...Oh.`], [OR, `(over the PA) We know, Carl. We've always known. It's a very small building.`], ['CARL', `I borrowed their saucepan. It's upstairs. What more do you need?`]]); good('orrin', 1); }
  await homeMealTestimony();
  await say2([[LI3, `...A saucepan.`], [KI, `PROCESSING. PROCESSING. A SAUCEPAN IS A STANDARD HOUSEHOLD OBJECT. A SAUCEPAN INDICATES COOKING. COOKING INDICATES RESIDENCY.`], [LI3, `That's not how the lease works.`], [KI, `IT IS NOW.`]]);
  setF3('intercomDone'); C3.allies = n; if (saidOf('saucepan')) closeSaid('saucepan', 'BACKED UP');
  return ending(n >= 3 ? 'home' : 'quiet');
}
async function ending(key) {
  C3.flags.endKey = key; saveC3();
  if (key === 'evicted') {
    await fadeOut(.08); music(null);
    await showCard([`PLEASE VACATE`, '', `YOUR UNIT HAS BEEN RETURNED`, `TO ITS STANDARD CONDITION.`], 160, { fg: hex('#ff7ae0') });
    await showCard([`THE KNOCKING STOPPED`, `AT MIDNIGHT.`], 150, { fg: UI.dim });
    return finish('evicted');
  }
  const words = key === 'home' ? [[`THE RESET WAS "POSTPONED".`, `THEN CANCELED.`, `THEN FILED UNDER`, `"RESOLVED BY TENANTS".`]] : [[`THE RESET WENT AHEAD,`, `ON THE FLOORS THAT HAD`, `NOBODY TO SPEAK FOR THEM.`, `UNIT 3A STAYED.`]];
  await fadeOut(.08); await showCard(words[0], 170, { fg: key === 'home' ? hex('#6dff92') : UI.dim });
  setF3('finale'); C3.ch = 5; await goScene('apt3A', 0, 1.8, 0); post.fade = 0;
}
// ---------------- the last playable scene ----------------
async function finale() {
  setF3('finaleBegun'); await wait(40);
  await say2([['CARL', `It's quiet. The good kind of quiet. The kind that has a kettle in it.`]]);
}
async function finaleShelf() {
  setF3('shelfDone'); C3.decor.recs = 1; sfx('get');
  await say(`YOU PUT OKAFOR'S RECORDS ON THE SHELF, NEXT TO THE LAMP AND NELL'S SAUCEPAN. YOUR HOME HAS ${homeCount()} THINGS IN IT.`, null);
  if(C3.resetRun && C3.resetRun.record)await say('THE TENANTS\' RESPONSE COPY STAYS BESIDE THE RADIO. IT HAS ROOM FOR MORE NAMES.',null);
  await say2([['CARL', `It's not much. It's the right amount.`]]);
  await wait(60); sfx('hurt'); WX.shake = 6;
  await say(`KNOCK. KNOCK.`, null);
  await say2([['CARL', `That's the door. That's the actual door. That's where it is.`]]);
}
async function finaleDoor() {
  await say(`YOU OPEN THE DOOR.`, null);
  const key=C3.flags.endKey,connected=who=>F3('a_'+who) && !F3('a_'+who+'_weak');
  const guests=key==='home'?[['orrin',-2.8,4.4],['bea',3,3.4],['roz',-1,3],['marisol',2,5.6],['nell',4,5.5]].filter(([who])=>connected(who)):[['orrin',-2.8,4.4]];
  guests.forEach(([m,x,z])=>addEnt3(npcR('g_'+m,m,x,z,'',()=>{},{range:.1})));
  const ghost=key==='home' && homeGhost() && homeGhost().mode!=='boundary';
  if(ghost)addEnt3(npcR('g_ghost','ghost',1,7.2,'',()=>{},{range:.1}));
  const dee=key==='home' && (F3('wallTalk') || C3.resetRun && C3.resetRun.wallAnswer);
  if(dee)addEnt3(npcR('g_dee','kid2',-3.5,3,'',()=>{},{range:.1}));
  if(key==='home') {
    const lines=[];
    if(connected('roz'))lines.push([RZ,dee?'We brought a casserole. Dee brought a pen.':'I brought a casserole. There is always enough for someone who arrives.']);
    if(dee)lines.push([DEE,'This tall!']);
    if(connected('nell'))lines.push([NL,'Your saucepan is still upstairs. We brought something to put in it.']);
    if(connected('orrin'))lines.push([OR,'I brought paperwork. Just one sheet. It says "welcome".']);
    if(connected('bea'))lines.push([BE,'I brought a chair. I am going to use it.']);
    if(connected('marisol'))lines.push([MA,'The association has an announcement. It is that you live here.']);
    if(ghost)lines.push([GH3,'I brought a label! It says HOME!']);
    lines.push(['CARL','I live here.']);await say2(lines);
  }else await say2([[OR,'I came by. That is all. I would like to be the one who came by.'],['CARL','Come in. I have a kettle.']]);
  setF3('finaleDone'); await wait(40);
  await finish(key === 'home' ? 'home' : 'quiet');
}
async function finish(key) {
  RHMETA.ends[key] = 1; if (key === 'home') RHMETA.ends.door = 1; saveRHM();
  await fadeOut(.08); music(null);
  if (key === 'home' || key === 'quiet') {
    await showCard(key === 'home' ? [`HE LET THEM IN.`] : [`HE LET ONE PERSON IN.`], 140, { fg: hex('#ffd848') });
    await showCard([`HOME: ${homeCount()} THINGS`, `THINGS I SAID: ${C3.said.length}`, `KEPT OR TAKEN BACK: ${honest()}`], 0, { fg: UI.text });
  }
  await showCard([`CARL`, `RESIDENT HUMAN`, '', `A PRETEND CO. PRODUCTION`, `NOTHING HERE WAS VERIFIED.`], 0, { fg: hex('#ffd848') });
  store(RHSAVE, null); setObj3(null); run(titleScreen3);
}
