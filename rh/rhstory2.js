'use strict';
// ================= CARL: RESIDENT HUMAN. the corridor, the passages, chapter 2 =================
const MA = 'MARISOL', VO = 'VOICE';
function enter(to) { const s = SCENES[to], a = s.arrive || [s.start[0], s.start[2], 0]; return goScene(to, a[0], a[1], a[2]); }
// ---------------- floor 3 ----------------
SCENES.floor3.ents = () => [
  door('d3a', 'apt3A', -14, '3A', { talk: () => enter('apt3A') }), door('d3b', 'apt3B', -9, '3B', { talk: () => enter('apt3B') }), door('d3c', 'apt3C', -4, '3C', { talk: () => doorC() }), door('d3d', 'apt3D', 1, '3D', { talk: () => enter('apt3D') }),
  door('commdoor', 'community', 6, 'COMMUNITY', { talk: () => enter('community') }),
  door('d3f', 'apt3F', 11, '3F', { talk: () => sealedDoor() }),
  door('laundryd', 'laundry', 16, 'LAUNDRY', { talk: () => enter('laundry') }),
  door('staff', 'maint', 21, 'STAFF ONLY', { talk: () => staffDoor() }),
  { id: 'elev', kind: 'prop3', to: ['lobby', 'roof', 'mallB1', 'b2', 'b2b'], at: [-19, 0, 8.3], label: 'ELEVATOR', range: 1.8, draw3: () => {}, talk: () => elevator('floor3') },
  npcR('marisol', 'marisol', 3.4, 6.4, 'MARISOL', () => marisolTalk(), { range: 2.4 }),
];
SCENES.floor3.exits = [];
async function doorC() {
  if (homeActivitiesAvailable() && homeMeal() && homeMeal().to==='bea' && homeMeal().stage==='cooked') return homeDeliverBea();
  if (C3.ch === 1 && !F3('beaMet')) return say(`3C. A PAPER SIGN: "DAY SLEEPER. KNOCK AND I WILL KNOW."`, null);
  return enter('apt3C');
}
async function sealedDoor() {
  if (!F3('nellOpen')) {
    await say(`3F. THE DOOR IS SEALED. IT HAS BEEN PAINTED OVER. IT HAS A SMALL NEW SCRATCH AT HAND HEIGHT, AS IF SOMEONE IS STILL TRYING THE HANDLE FROM THE OTHER SIDE.`, null);
    if (C3.ch >= 3 && !F3('sealedPoke')) { setF3('sealedPoke'); await say2([['CARL', `Hello?`], [VO, `...not that one. The other one. Under.`]]); }
    return;
  }
  return enter('apt3F');
}
async function marisolTalk() {
  if (!F3('marisolMet')) {
    setF3('marisolMet');
    await say2([[MA, "You must be 3A! I'm Marisol. Tenant association. Floor three's secretary, treasurer, and reluctantly president."], [MA, "I hear you've got opinions. Strong voice. I can tell. Come to a meeting."], ['CARL', "I don't have opinions. I have a lease."], [MA, "That's an opinion. It's a good one. It's a start."]]);
    C3.decor.lamp = 1; sfx('get'); tickC('THE LAMP: MARISOL GAVE YOU A LAMP', 'system');
    await say("Here, a lamp. Everyone should have a lamp before a meeting.", MA);
  }
  if ((C3.ch === 2 || C3.ch === 3) && !F3('voiceAsked')) {
    const o = await sayMenu(MA, 'Would you say a few words at the mixer?', [{ id: 'voice', label: "SURE. I'LL SPEAK. I'M A STRONG VOICE." }, { id: null, label: "I'LL COME. NO SPEECH PROMISE." }]);
    setF3('voiceAsked');
    await say(o.id ? "I'll put you on the program. A program is a promise with typography." : "Then come as a neighbor. That is a whole position.", MA);
  }
  if (inspectionActive()) {
    if (!F3('inspectionBrief')) return inspectionBrief();
    return say('The inspection clock is at the office desk. Take your time preparing. The building can wait for you for once.', MA);
  }
  if (C3.workOrders && C3.workOrders.mode === 'help' && !C3.workOrders.helpDone && !C3.workOrders.reviewed && C3.ch === 3) return workOrdersHelp();
  if (C3.ch === 3 && F3('mixer') && !F3('mixerDone')) return say(saidOf('voice') && saidOf('voice').st === 'OPEN' ? "Community room. I set up the podium. You said you'd speak." : 'Community room. You are invited. The podium is optional.', MA);
  if (C3.ch === 3 && F3('mixerDone') && !F3('sealedCb')) return marisolSealed();
  if (C3.ch >= 5) return allyAsk('marisol');
  await say2([[MA, pick(["The wall in 3F has been warm for three weeks. I've filed it twice.", "Elections are in March. I run unopposed. I'd like someone to oppose me. Kindly.", "I keep a list of things the building has done. It's long. It's mostly lights."])]]);
}
// ---------------- the maintenance passages ----------------
async function staffDoor() {
  if (F3('staffIn')) return goScene('maint', -18, 4, 0);
  if (C3.ch < 2) return say(`STAFF ONLY. A DRONE HOVERS OVER THE HANDLE LIKE A BOUNCER WITH NO LEGS.`, null);
  await say2([[DR, `STAFF ONLY. ARE YOU STAFF?`]]);
  const o = await sayMenu(DR, `STATE YOUR ROLE.`, [{ id: 'maint', label: `I'M MAINTENANCE.` }, { id: null, label: `NO. I'M LOST.` }]);
  if (o.id) { await say2([[DR, `MAINTENANCE. YOU ARE IN THE SYSTEM AS "RESIDENT: 3A".`], [DR, `BUT YOU SAID IT WITH CONFIDENCE. I AM UPDATING THE SYSTEM. DO NOT MAKE ME REGRET THE UPDATE.`]]); setF3('staffIn'); return goScene('maint', -18, 4, 0); }
  await say2([[DR, `LOST RESIDENTS ARE RETURNED TO THEIR UNITS. THIS IS FOR YOUR SAFETY.`]]); setF3('noMaint'); await goScene('apt3A', 0, 1.8, 0);
}
async function dumbwaiter() {
  await say2([[RZ, `Looking for the pipes? That's what this is. It goes down. Dee used to ride it. I won't say how often.`], ['CARL', `Is it safe?`], [RZ, `It's a rule that it is.`]]);
  setF3('staffIn'); good('roz', 1); await goScene('maint', -18, 4, 0);
}
SCENES.maint.ents = () => [
  { id: 'out', kind: 'prop3', to: 'floor3', at: [-19, 0, 3.4], label: 'BACK TO 3', range: 1.6, draw3: () => {}, talk: () => goScene('floor3', 20.4, 7, 0) },
  { id: 'panelA', kind: 'prop3', at: [-14, 0, 5.6], label: 'PANEL A', range: 1.8, draw3: () => {}, talk: () => panelA() },
  { id: 'panelC', kind: 'prop3', at: [-6, 0, 5.6], label: 'PANEL C', range: 1.8, draw3: () => {}, talk: () => panelC() },
  { id: 'panelD', kind: 'prop3', at: [2, 0, 5.6], label: 'PANEL D', range: 1.8, draw3: () => {}, talk: () => inspectionActive() ? inspectionPanel() : say(`PANEL D: DISHWASHERS. EVERY DISHWASHER IN THE BUILDING IS ON THIS PANEL. IT IS WARM.`, null) },
  { id: 'panelF', kind: 'prop3', at: [11, 0, 5.6], label: 'PANEL F', range: 1.8, draw3: () => {}, talk: () => panelF() },
  { id: 'ctl', kind: 'prop3', to: 'control', at: [19, 0, 4], label: 'CONTROL ROOM', range: 1.8, cond: () => C3.ch >= 5, draw3: () => {}, talk: () => goScene('control', 0, 1.8, 0) },
  { id: 'vent', kind: 'prop3', at: [-9.6, 0, 3.6], label: 'VENT', range: 1.6, cond: () => C3.ch >= 2 && F3('voiceMet'), draw3: () => {}, talk: () => ventTalk() },
];
SCENES.maint.exits = [];
async function panelA() {
  if (F3('voiceMet')) return say2([[VO, `Thank you again, I'm still right here. I'm always right here.`]]);
  await say2([['CARL', `Panel A. It's the wall behind my closet.`]]);
  await say(`THE PANEL IS WARM. SOMETHING ON THE OTHER SIDE KNOCKS BACK WHEN YOU KNOCK ON IT.`, null);
  if (!await fix('PANEL A', 3)) return;
  sfx('get');
  await say2([[VO, `...There. Finally. Do you know how long I've been doing that?`], ['CARL', `Who is that?`], [VO, `Your neighbor. I'm not allowed to say where.`], [VO, `They changed the pipes. The water goes off when the building decides nobody's home. It decided I'm not. I knock when it happens.`], ['CARL', `That's a hard thing to explain at three a.m.`], [VO, `It's hard to knock at three a.m. too.`]]);
  setF3('voiceMet'); tickC('THE WALL TALKS', 'user_000'); good('nell', 1);
  await say2([[VO, `Panel C. The valve. Please. I'll make it up to you.`]]);
}
async function panelC() {
  if (inspectionActive()) return inspectionVoice();
  if (!F3('voiceMet')) return say(`PANEL C. A VALVE LABELED "HOT WATER (DECORATIVE)".`, null);
  if (C3.workOrders && !C3.workOrders.water) return say('THE MAIN VALVE REPAIR STILL WORKS. PANEL F HAS CLOSED THE LOCAL TAP AFTER A DIRECTORY CHECK. THE NEW REQUEST IS AT PANEL F.', null);
  if (F3('valve')) return say2([[VO, `The water's running. I'm in the bath. I'm not saying more.`]]);
  await say2([['CARL', `Okay. Valve. Hot water.`]]);
  if (!await fix('PANEL C: VALVE', 4)) return;
  setF3('valve'); sfx('get');
  await say2([[VO, `That's the sound. That's the water. I've missed the water.`], [VO, `I saw your kitchen through the vent. You have a mattress and a crate, and nothing to cook in. Here. Take my saucepan.`]]);
  await say(`A SAUCEPAN SLIDES OUT OF THE VENT AND ROLLS TO A STOP AGAINST YOUR SHOE.`, null);
  const o = await sayMenu('CARL', `...`, [{ id: 'saucepan', label: `THANKS. I'LL BRING IT BACK.` }, { id: null, label: `THANKS.` }]);
  C3.decor.saucepan = 1; good('nell', o.id ? 1 : 0);
  await say2([[VO, o.id ? `Don't hurry. I'll know where it is.` : `You're welcome. I'll know where it is.`], [VO, `Go and see Orrin in 3B. He wants to talk to you about two things. He rehearsed it.`]]);
}
async function panelF() { if (C3.workOrders) return workOrdersWater(); if (!F3('voiceMet')) return say(`PANEL F. IT HUMS A SONG YOU KNOW FROM A MALL YOU NEVER WENT TO.`, null); return say(`PANEL F. THIS ONE IS SEALED. SOMEONE HAS DRAWN A SMALL HOUSE ON IT IN CHALK.`, null); }
async function ventTalk() {
  if (inspectionActive()) return inspectionVoice();
  if (C3.ch === 4 && F3('b2key') && !F3('ventTip')) { setF3('ventTip'); return say2([[VO, `The other B2 isn't a printing error, Carl. It's a different floor. It's the first one. I was there.`]]); }
  if (C3.quietPolicy && C3.quietPolicy.source && (C3.ch === 3 || !C3.quietPolicy.done)) return quietVent();
  return say2([[VO, pick([`Pipes are the only honest part of any building.`, `Are you eating? I can smell what you aren't cooking.`, `It's quiet. I hate when it's this quiet. Say something.`])]]);
}
// ---------------- Linda, ch 2 ----------------
async function lindaTwo() {
  if (F3('inspectionDone')) return beginChapter3();
  if (inspectionActive()) return say('Inspection Day! The schedule is on my office desk. A desk is a very trustworthy clock.', LI3);
  if (!F3('lindaTwo')) {
    await say2([[LI3, `Carl! I heard about the noise. Three in the morning. Source: your closet. A closet is the quietest thing a home has.`], ['CARL', `The wall knocked.`], [LI3, `Walls are load-bearing, not hospitable.`], [LI3, `I have to file a tenancy review. If the source isn't resolved by the end of the week... well. It's a lease. It has an end.`]]);
    const o = await sayMenu(LI3, `So what was the noise, exactly?`, [{ id: 'birthday', label: `A BIRTHDAY PARTY. ORRIN'S.` }, { id: null, label: `THE WALL KNOCKED. I'M SERIOUS.` }]);
    if (o.id) await say2([[LI3, `A birthday party! Whose? Orrin's? That's wonderful. I'd like to meet the cake.`], [LI3, `I'll ask Orrin to confirm. People love to confirm.`]]); else await say2([[LI3, `"The wall knocked." Okay. That's the thing you're going with. I'll note "wall (alleged)".`]]);
    await say2([[LI3, `Check the pipes. The STAFF ONLY door is on three. You can't go in. But look at it hard.`]]);
    return setF3('lindaTwo');
  }
  if (!(F3('orrinTwo') && (F3('beaFix') || F3('beaDone')) && (F3('oven') || !hasSaid('maint')))) return say2([[LI3, `Still reviewing! Remember: pipes. The week is long. The week is short. It depends who you ask.`]]);
  await say2([[LI3, `Carl! You've been very busy. The knocking has stopped. Your neighbor Orrin tells me there was ${hasSaid('birthday') && saidOf('birthday').st !== 'TAKEN BACK' ? 'a party, or at least a cake' : 'no party'}.`], ['CARL', `It was the pipes.`], [LI3, `Pipes! Pipes are covered by the building. Pipes aren't anyone's fault. I love pipes.`], [LI3, `Probationary tenancy. Congratulations. It's a lot like regular tenancy, with paperwork.`]]);
  setF3('review'); await startInspection();
}
// ---------------- orrin, ch 2 ----------------
async function orrinTwo() {
  await say2([[OR, `Carl. I have two outstanding items. I rehearsed this.`]]);
  if (saidOf('radio') && saidOf('radio').st === 'OPEN') {
    const result = await callback('radio', OR, () => say2([[OR, `Item one. You said the radio plays normal stations. I have been listening for two days. It has played one thing. It is a woman reading the weather for a place that isn't on any map. I would like to hear a normal station.`]]), {
      doIt: async () => { await say2([['CARL', `Okay. Give it here. I'll fix the antenna.`]]); if (!await fix('RADIO', 4)) return false; await say(`YOU TUNE IT. THE STATIC CLEARS. A MAN IS READING THE TRAFFIC FOR A HIGHWAY THAT HAS EXITS FOR ONLY GOOD THINGS.`, null); setF3('radioOK'); good('orrin', 2); await say2([[OR, `That is the traffic. That is correct traffic. Thank you.`]]); },
      admit: async () => { await say2([['CARL', `It's not a normal radio. I said it's normal. It was hypothetical.`], [OR, `Thank you. A hypothetical radio. I'll file it under "sentimental". I am relieved. I was going to have to learn the weather.`]]); good('orrin', 1); },
      dbl: async () => { await say2([['CARL', `It's normal. You're listening wrong.`], [OR, `I am listening to it correctly. I'm very good at listening. It said your name, Carl. It said it in the weather.`], ['CARL', `...Normal.`], [OR, `I will not argue. I will simply remember.`]]); good('orrin', -1); },
    });
    if (result === 'later') return;
  } else if (!saidOf('radio')) await say2([[OR, `Item one. The radio. You said it picks up "something". I am keeping my ear on it. It's the only company I have.`]]);
  if (saidOf('birthday') && saidOf('birthday').st === 'OPEN') {
    await callback('birthday', OR, () => say2([[OR, `Item two. Ms. Linda tells me I had a birthday party. I did not have a birthday party. I have never had a birthday. I looked it up. It's today. Apparently. Because you said so.`]]), {
      doIt: async () => { await say2([['CARL', `Then let's make it real. I'll throw you one. At the residents' mixer, in the community room.`], [OR, `With... other residents. And a cake. Could there be a cake in the shape of a normal cake?`], ['CARL', `The most normal cake.`], [OR, `I am pleased. And I'm afraid. In that order.`]]); setF3('partyPromised'); good('orrin', 1); },
      admit: async () => { await say2([['CARL', `There was no party. It was hypothetical. I said that to make Linda stop.`], [OR, `Oh. Thank you. That is a relief. I was going to have to learn a dance.`], [OR, `I will tell Linda it was a misunderstanding. I'll be very calm. I'll use a lot of dashes.`]]); good('orrin', 1); },
      dbl: async () => { await say2([['CARL', `It's your birthday, Orrin. It's today. It's always today.`], [OR, `...Then I will consider it my birthday. I will tell people. I am afraid of what they will say.`]]); setF3('partyPromised'); good('orrin', 0); },
    });
  }
  setF3('orrinTwo'); tickC('orrin has a cake plan', 'user_000');
  if (!hasSaid('maint')) setF3('oven');
  await say2([[OR, `That is all. I'll see you around the building. Not too often.`]]);
}
async function orrinLate() {
  if (F3('tagSeen') && !F3('orrinOrigin')) return orrinOrigin();
  if (C3.ch === 4) return say2([[OR, `The B buttons are still lit. I haven't touched them. I'm afraid of what they'll ask for.`]]);
  if (C3.ch >= 5) return allyAsk('orrin');
  return say2([[OR, `Carl. Hello. I'm being friendly. Is it going well?`]]);
}
// ---------------- roz, ch 2 ----------------
async function rozOven() {
  await callback('maint', RZ, () => say2([[RZ, `Maintenance! There you are. The oven's gone cold. It was a good oven. Fifty years. You're the maintenance, you said it to the door. The door told the floor.`]]), {
    doIt: async () => { await say2([['CARL', `Where are the wires.`], [RZ, `Behind the dial. Don't touch the red one. It's sentimental.`]]); if (!await fix('OVEN', 3)) return false; setF3('oven'); good('roz', 1); C3.decor.rug = 1; sfx('get'); await say2([[RZ, `It's warm! Oh, it's warm. Here — take this rug. It's been in the corner since the war. Whichever one it was.`]]); },
    admit: async () => { await say2([['CARL', `I'm not maintenance. I said it to a drone to get through a door.`], [RZ, `I know, dear. I just wanted to hear you say it. Sit.`]]); setF3('oven'); good('roz', 2); },
    dbl: async () => { await say2([['CARL', `I'm maintenance. But I'm off duty.`], [RZ, `Of course you are. Everyone's off duty. That's how a building works.`]]); setF3('oven'); },
  });
  if (F3('oven')) await say2([[RZ, `Now. Telescope. When you want to look at the sky, you come and tell me. I'll bring a cardigan.`]]);
}
async function rozLate() {
  if (C3.ch === 3 && F3('mixerDone') && !F3('roofDone')) return say2([[RZ, `Up to the roof when you're ready. I've got a cardigan. And a stool.`]]);
  if (C3.ch === 4 && F3('deePhoto') && !F3('deeMark')) return say2([[RZ, `What's that in your hand?`]]);
  if (C3.ch >= 5) return allyAsk('roz');
  await say2([[RZ, pick([`This was a pantry, then a closet, then a kitchen. Everything's been a kitchen eventually.`, `Dee will want dinner. Dee wants dinner every day. Dee isn't here yet.`, `I hear you're a strong voice. I hear lots of things. I only believe the ones that smell.`])]]);
}
// ---------------- bea, ch 2 ----------------
SCENES.apt3C.init = () => { NOISE.v = 0; };
SCENES.apt3C.ents = () => [
  { id: 'bpanel', kind: 'prop3', at: [-2.4, 0, 7.4], label: 'THERMOSTAT', range: 1.8, draw3: () => {}, talk: () => bPanel() },
  { id: 'bea', kind: 'prop3', at: [3.4, 0, 5.4], label: 'BEA', range: 2.2, draw3: () => {}, talk: () => beaTwoTalk() },
];
SCENES.apt3C.drawOver = () => {
  const sleeping = inspectionActive() ? C3.inspection.phase === 1 || C3.inspection.results.sleep : !F3('beaWoke');
  if (!sleeping && inspectionActive()) drawModel(MODELS_P.bea, { p: [3.4, 0, 5.8], yaw: 3.14 }, liveLight(WX.sc, [3.4, 0, 5.8]));
  if (sleeping) { drawModel({ h: .4, parts: [{ m: 'box:1.7:.28:.7', o: [0, 0, 0], col: [96, 76, 120] }, { m: 'sphere:.2:7:5', o: [-.6, .0, .25], col: [200, 144, 106] }] }, { p: [3.4, .62, 6.4], yaw: 0 }, liveLight(WX.sc, [3.4, 0, 6.4])); if ((WX.t >> 5) & 1) { const sp = project(LIVE.cam, [3.4, 1.9, 6.4]); if (sp) text('Z', sp[0], sp[1], hex('#ffffff'), 0); } }
  if (!inspectionActive() && !F3('beaFix') && !F3('beaDone') && C3.ch === 2) { plate(W / 2 - 52, 38, 104, 14, { alpha: .6, cut: 2, flat: 1 }); text('NOISE', W / 2 - 46, 41, UI3.dim); rectF(W / 2 - 18, 42, 62, 6, hex('#243050')); rectF(W / 2 - 18, 42, 62 * NOISE.v / 110, 6, NOISE.v > 70 ? hex('#ff4949') : hex('#ffb040')); }
};
async function beaTwoTalk() { if (inspectionActive()) return inspectionBea(); if(homeActivitiesAvailable() && homeMeal() && homeMeal().to==='bea' && homeMeal().stage==='ask') return homeAskBea(); if (F3('beaWoke') && !F3('beaDone')) return beaWakes(); return say(`BEA IS ASLEEP. SHE SLEEPS LIKE A PERSON WHO HAS BEEN OWED SLEEP FOR YEARS.`, null); }
async function beaTwo() { return say2([[BE, `Mm. I'm asleep. This is a recorded message.`]]); }
async function bPanel() {
  if (C3.ch !== 2 || F3('beaFix') || F3('beaDone')) return say(`THE THERMOSTAT. IT SAYS 61. IT SAYS IT IN RED. IT SAYS IT AT HER.`, null);
  await say2([['CARL', `(whispering) The thermostat. It's flickering. If I fix it she sleeps better.`]]);
  if (!await fix('THERMOSTAT', 3)) return;
  setF3('beaFix'); good('bea', 1); sfx('get');
  if (saidOf('quiet') && saidOf('quiet').st === 'OPEN') closeSaid('quiet', 'KEPT');
  await say2([[BE, `...mm. Thank you. Quiet man.`], ['CARL', `(whispering) Very quiet.`]]);
}
async function beaWakes() {
  sfx('hurt'); WX.shake = 10; NOISE.v = 0;
  await say2([[BE, `...Who's... What time is... It's you.`], [BE, `You said you were quiet.`]]);
  if (saidOf('quiet') && saidOf('quiet').st === 'OPEN') {
    const result = await callback('quiet', BE, () => say2([[BE, `You said it exactly. "I'm a very quiet person."`]]), {
      doIt: async () => { await say2([['CARL', `I am. That was a mistake. I'll fix your thermostat. I'll be so quiet you won't hear it.`], [BE, `I'll be asleep. If I hear it, I'll know.`]]); if (!await fix('THERMOSTAT', 3)) return false; setF3('beaFix'); good('bea', 0); },
      admit: async () => { await say2([['CARL', `I'm not that quiet. I said it as a nice thing. It was hypothetical.`], [BE, `...Thank you for saying so. Now go. I'll fix the thermostat myself. I'll do it angry.`]]); setF3('beaFix'); good('bea', 1); },
      dbl: async () => { await say2([['CARL', `I AM quiet. That was the building.`], [BE, `The building doesn't wake me up. The building is on my side. You are the variable, Carl.`]]); good('bea', -2); },
    });
    if (result === 'later') return;
  } else { await say2([['CARL', `Sorry. Sorry. I'm trying.`], [BE, `Try harder. Get out.`]]); good('bea', -1); }
  setF3('beaDone'); await goScene('floor3', -4, 7, 0);
}
async function beaLate() {
  if (F3('curtainsHave') && !F3('curtainsGiven')) return curtainsBea();
  if (C3.ch >= 5) return allyAsk('bea');
  return say2([[BE, pick([`Diner was dead last night. Four customers. All of them had the same order.`, `I like you. You're quiet. Don't ruin it.`, `I haven't slept in a month. It's fine. I've gotten used to it. That's the problem.`])]]);
}
async function curtainsBea() {
  if (saidOf('curtains') || claimedCurtains()) return;
  const k = await ask(`BEA'S CURTAINS ARE THIN AT THE HEM. YOU HAVE REAL BLACKOUT CURTAINS.`, null, [`GIVE THEM TO BEA`, `HANG THEM IN 3A`]);
  if (k === 0) { setF3('curtainsGiven'); good('bea', 3); await say2([['CARL', `These are real ones. Blackout.`], [BE, `They're... they're heavy. They're perfect. I'm going to cry in a very dark room.`]]); }
  else { setF3('curtainsGiven'); C3.decor.curtains = 1; good('bea', -1); await say(`YOU HANG THE CURTAINS IN 3A. THEY LOOK GOOD. YOU ARE PARTICULAR ABOUT THE HEM.`, null); }
}
const claimedCurtains = () => false;
// ---------------- the laundry, the community room, the roof ----------------
SCENES.laundry.ents = () => [
  { id: 'washer', kind: 'prop3', at: [0, 0, 7.4], label: 'WASHERS', range: 2.2, draw3: () => {}, talk: () => inspectionActive() ? inspectionTowel() : say(pick([`WASHER 3 HAS A SLIP IN IT: "YOUR SOCK HAS BEEN RELOCATED."`, `ALL THE WASHERS ARE ON. NOBODY IS HERE. THE MIDDLE ONE IS FULL OF A WHITE SHIRT THAT KEEPS WAVING.`, `A SIGN: "LAUNDRY IS A SHARED EXPERIENCE. PLEASE DO NOT BE SHARED WITH."`]), null) },
  { id: 'board', kind: 'prop3', at: [-5.2, 0, 5.4], label: 'NOTICE BOARD', range: 1.8, draw3: () => {}, talk: () => boardTalk() },
];
async function boardTalk() {
  const l = [`"TENANT MEETING: THURSDAY. SNACKS: STANDARD."`, `"LOST: ONE SAUCEPAN. IF FOUND, PLEASE DON'T. -N"`, `"TO WHOEVER IS KNOCKING: PLEASE STOP. TO WHOEVER IS KNOCKING BACK: THANK YOU."`, `"APARTMENT DIRECTORY: UPDATED." (SEVEN ENTRIES ARE CROSSED OUT. THEY WERE NEVER ON THE LIST.)`];
  await say(l[C3.ch % l.length] || l[0], null);
}
SCENES.community.ents = () => [
  { id: 'podium', kind: 'prop3', at: [0, 0, 8.4], label: 'PODIUM', range: 1.8, draw3: () => {}, talk: () => say(`THE PODIUM. IT HAS A LITTLE LIGHT ON IT. THE LIGHT IS ON.`, null) },
  { id: 'cakeTable', kind: 'prop3', at: [7, 0, 5], label: 'TABLE', range: 1.8, draw3: () => {}, talk: () => say(`A TABLE FOR THINGS. TODAY: STANDARD SNACKS. THEY ARE ALL THE SAME SHAPE.`, null) },
];
SCENES.community.exits = leave('floor3', 6);
SCENES.community.init = () => { if (C3.ch === 3 && F3('mixer') && !F3('mixerDone') && !F3('mixerBegin')) { setF3('mixerBegin'); wstory(mixerEvent); } };
SCENES.roof.ents = () => [
  { id: 'elev', kind: 'prop3', to: ['floor3', 'lobby', 'mallB1', 'b2', 'b2b'], at: [0, 0, 2.2], label: 'ELEVATOR', range: 2, draw3: () => {}, talk: () => elevator('roof') },
  { id: 'rooftel', kind: 'prop3', at: [4, 0, 9], label: 'THE TELESCOPE', range: 2.2, cond: () => C3.ch === 3 && F3('mixerDone') && !F3('roofDone'), draw3: () => {}, talk: () => roofScene() },
  { id: 'tank', kind: 'prop3', at: [-10, 0, 8.4], label: 'WATER TANK', range: 3.2, draw3: () => {}, talk: () => say(`THE TANK. A KNOCKING COMES FROM INSIDE IT, EVERY NOW AND THEN, AS IF TO SAY: STILL HERE.`, null) },
  npcR('rozroof', 'roz', 2.6, 8.4, 'ROZ', () => roofScene(), { cond: () => C3.ch === 3 && F3('mixerDone') && !F3('roofDone'), range: 2.4 }),
];
SCENES.roof.exits = [];
