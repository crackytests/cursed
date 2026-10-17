'use strict';
// ================= DISK C: DOWNTOWN =================
// The Pretend Co. Tower, where the Commissioner keeps the Normalcy. The Crash Pad, where the Crashers keep nothing.
HUBS.dt = { name: 'DOWNTOWN' };

// ---------- texts ----------
txt('dt_plaque', 'TOWER PLAQUE', 'PRETEND CO. TOWER\n"The pretend company. A real company."\n\nFloors 1-40: Pretend Co.\nFloors 41-49: Consulate of the Normalcy (not listed)\nFloor 50: [not listed]');
txt('dt_news', 'THE L.A. PRETEND', 'FREIGHTER CREW FOUND DEAD AT PORT\n\nThe crew of the cargo ship LADY NEVADA were found dead aboard the vessel on Tuesday. Port officials cited "a refrigeration accident," "a sleep disorder," and "missing time," in that order. A Pretend Co. spokesman declined to say what the ship was carrying, then said it was carrying "nothing," then said it was carrying "one thing."');
txt('dt_crashrules', 'CRASH PAD RULES', 'CRASH PAD RULES\n1. No Consulate.\n2. No Normalcy talk.\n3. No feeding on the bartender, he is a person and he is MY person - Roscoe\n4. Pluto is a planet.\n5. If you\'re here, you crashed. Welcome home.');
mail('dt_m1', 'OFFICE OF THE COMMISSIONER', 'carl', 'Accommodation', 'Carl,\n\nThe Consulate keeps an apartment in the Skyline for useful people. You are, for now, useful. The door is coded to your papers.\n\nThe view is very good. Do not stream it.\n\n- L');
mail('dt_m2', 'TOMMY 2P', 'carl', 'downtown!!', 'carl!! u made it downtown. that\'s the big leagues. the big leagues have bigger rats. some of the rats are mothmen. say hi to gus for me. he owes me a stapler.\n\n-T');
mail('dt_m3', 'vtuber_truther', 'carl', '(no subject)', 'Carl, chat noticed you moved. Your window has a different skyline. Don\'t worry, I told them it\'s a green screen. I\'m good at it now. I tell everybody everything is a green screen.\n\n- a fan', { cond: () => F.truther === 'told' });
txt('dt_board', 'BOARD DIRECTORY', 'CONSULATE BOARD OF THE NORMALCY\n\nSEAT 1 - THE COMMISSIONER\nSEAT 2 - W. COLDWELL (CONTINUITY & CLEANUP)\nSEAT 3 - VACANT (RETURNED)\nSEAT 4 - THE CLINIC (BY PROXY: D. FACE)\nSEAT 5 - MR. WHITE (CONTRACTOR, NON-VOTING)');
mail('dt_cw1', 'W.COLDWELL', 'commissioner', 'Re: the Crasher census', 'Commissioner,\n\nAttached, the census of unregistered Crashers in the greater Los Angeles area. 214 names. Addresses where known. I recommend we sell the list to Mr. White as a "cleanup subcontract." It would pay for the museum security.\n\nContinuity first.\n\n- W.C.', { note: 'Coldwell has a census of 214 unregistered Crashers, with addresses, and wants to sell it to Mr. White.' });
mail('dt_cw2', 'W.COLDWELL', 'w.coldwell', 'personal', 'Note to self.\nThe Ocean House sold again. It will not sell. It never sells. She is still there. I know she is still there.\nI was very fond of her. I was fond of all of them. The warmth of a family is a remarkable thing. It lasted me a decade.');

// ---------- radio ----------
DEB.push({ id: 'dt1', hub: 2, title: 'THE LADY NEVADA', fn: async () => {
  await T('DEB', 'Deep Night. Deb. The freighter at the port, the Lady Nevada. Crew of eleven. You read the paper. Refrigeration accident, sleep disorder, missing time.');
  await T('DEB', 'I\'ve got a caller who worked the night shift at the port. Caller?');
  await T('N', '"Deb, I unloaded that ship. There was one box. One. Size of a phone booth lying down. The crane guy said it was humming. I said it was the crane. He said the crane was off."');
  await T('DEB', 'Where\'d the box go?');
  await T('N', '"Museum truck. Natural History. With a police escort. Except the police didn\'t have badge numbers."');
} });
DEB.push({ id: 'dt2', hub: 2, title: 'PLUTO', fn: async () => {
  await T('DEB', 'I\'ve been asked by a very angry caller to say on air that Pluto is a planet. I don\'t know why this matters to him so much. Sir, it\'s 1995. Pluto IS a planet. Nobody\'s taking it away.');
  await T('N', '"NOT YET THEY\'RE NOT."');
  await T('DEB', 'He hung up. Okay. Music.');
} });

// ---------- HU-MAN (the Sheriff) ----------
CONV.hu_desk = async (e) => {
  if (!F.metHuman) { F.metHuman = 1;
    await T('HUMAN', 'Hello. I am HU-MAN. I am the Normalcy officer of the Pretend Co. Tower. I am a normal human.');
    await T('CARL', 'Hi! Me too! I\'m also a normal human! We should, we should start a club, we could have a-');
    await T('HUMAN', 'You are not.');
    await T('CARL', '...What?');
    await T('HUMAN', 'You are not a normal human. I am. I was focus tested. Nine hundred people looked at me and said: that is a man. Nobody has ever focus tested you.');
    await T('CARL', 'I\'ve been focus tested! I have a chat! Forty people look at me every night!');
    await T('HUMAN', 'And what do they say?');
    await T('CARL', '...They say a lot of things.');
    await T('HUMAN', 'The Commissioner is expecting you. The elevator will take you up. Be yourself.');
    return; }
  await T('HUMAN', pick(['Be yourself.', 'Hello. I am a normal human.', 'The elevator is behind me. Please do not breach the Normalcy in the lobby. The lobby is very normal.']));
};

// ---------- Commissioner Linda ----------
CONV.linda_dt = async (e) => {
  if (!F.dtL1) { F.dtL1 = 1;
    await T('N', 'The penthouse is all window. Los Angeles goes on forever in every direction, a carpet of lights that looks, from up here, very manageable.');
    await T('LINDA', 'Carl. Sit. Not there. That chair is for people I like. There.');
    await T('LINDA', F.bhLoud ? 'The beach house. You were seen. Three channels ran "gas leak." One ran "lights." I had to buy a station manager a boat. Next time, be quieter or be cheaper.' : 'The beach house. Quiet, clean, a gas leak. The papers believed it. You may yet be worth the paperwork.');
    await T('CARL', 'Thank you? Is that- was that a compliment? I can\'t tell with you. It\'s like talking to a, a very beautiful glacier.');
    await T('LINDA', '...');
    await T('LINDA', 'Business. Last night a freighter docked at the port. The Lady Nevada. The crew was found dead. Every visitor in the city can tell you how, just by reading the coroner\'s report. Cold. Asleep. Missing time. Frightened to death. It was all of us.');
    await T('LINDA', 'It was carrying one container. Pulled out of the desert in Nevada. The Invaders call it the box. The rest of us call it the Nevada Pod.');
    await T('CARL', 'Nevada. Above and below? Is that- that\'s my- people keep saying that to me. Like it\'s a hint. Is it a hint? Is it a-');
    await T('LINDA', 'Everyone in this city has a theory about what is in that pod. The Invaders think it\'s the First Visitor, and that opening it ends the Normalcy. The Crashers think it\'s a weapon. The Clinic thinks it\'s a specimen. I think it\'s leverage.');
    const c = await C(['What do YOU think is in it?', { t: 'Could it be... people? Like, a family? From Nevada?', if: () => true }, 'What do you want me to do?']);
    if (c === 0) await T('LINDA', 'I think whatever is in it belongs to whoever is holding it when it opens. I intend to be holding it.');
    else if (c === 1) { await T('LINDA', 'You want it to be your parents.'); await T('CARL', 'I didn\'t say that. I said "people." I said "a family." That\'s a, those are general words.'); await T('LINDA', '...Don\'t hope out loud in this building, Carl. Everyone here can hear it, and some of them eat it.'); F.hopedParents = 1; }
    await T('LINDA', 'The pod is at the Natural History Museum, under Consulate guard, until I decide where it goes. Before that, I want to know what happened on that ship. Go to the port. Read whatever there is to read.');
    goalDone('sm_tower'); goal('dt_ship', 'Investigate the freighter Lady Nevada at the port (east end of Downtown).');
    await T('LINDA', 'You have an apartment in the Skyline. Mr. White\'s people will leave you alone there. Mostly.');
    return; }
  if (F.shipDone && !F.dtL2) { F.dtL2 = 1;
    await T('LINDA', 'Well?');
    await T('CARL', 'They\'re all dead. Every kind of dead. And the captain wrote that the box was... listening. And that it ticked. Or breathed. He couldn\'t decide. And there was a cat. Detective cat. Garfield. He says he\'s following the label.');
    await T('LINDA', 'JB Garfield. Of course. He\'ll follow it until it\'s not interesting, and then he\'ll write a book about it.');
    await T('LINDA', 'The museum is opening the pod\'s "exhibit" tonight for a private Consulate viewing. Go there. Stand next to it. If anything that isn\'t me touches it, stop it.');
    goalDone('dt_report'); goal('dt_museum', 'Guard the Nevada Pod at the Natural History Museum (south side of Downtown).'); return; }
  if (F.gusDone && !F.dtDone) { F.dtDone = 1;
    await T('CARL', 'The Invaders took the pod out through the drains, and then in the drains, under Hollywood, the Men in White Suits took it from THEM. Gus saw it. Mothman Gus. He has a lot of eyes on things. He has a lot of eyes, period.');
    await T('LINDA', 'Mr. White.');
    await T('LINDA', '...My own contractor. Hired to clean up after the Normalcy. Now he\'s holding the one thing that could end it.');
    await T('LINDA', 'He has a house in the Hollywood Hills. He has a party there every Friday for people who know. It is Friday. Get into the party. Find the pod. Bring it here.');
    await T('LINDA', 'You have done well, Carl. Don\'t let that change you.');
    goalDone('dt_white'); goal('hw_mansion', 'Get into Mr. White\'s party in the Hollywood Hills and recover the Nevada Pod. (Cab stand, west Downtown.)'); restoreNormalcy(1, 'the Commissioner is pleased');
    giveSP(1000, 'Downtown'); return; }
  const c = await C([{ t: 'Who is Walter Coldwell?', if: () => F.coldwellName && !F.cwAsked }, { t: 'What happened to Old Face? Where is the sender?', if: () => !F.askedSender }, { t: 'Why did you save me? At the hearing.', if: () => !F.askedWhy }, 'Nothing. Bye.']);
  if (c === 0) { F.cwAsked = 1; await T('LINDA', 'Seat Two. Continuity and Cleanup. The oldest member of the board. He has kept the Normalcy in this city since before the Normalcy had a name.'); await T('LINDA', 'He is very cold and very useful. Why do you ask?'); await T('CARL', 'No reason. Ghost reasons.'); await T('LINDA', '...Floor 49.'); }
  else if (c === 1) { F.askedSender = 1; await T('LINDA', 'The projector sends them up. Where they go is not my department.'); await T('CARL', 'That\'s not an answer.'); await T('LINDA', 'It\'s the only one anybody has ever been given. Including me.'); }
  else if (c === 2) { F.askedWhy = 1; await T('LINDA', 'Because you say you are human, Carl, every day, in front of everyone, and nobody laughs you out of the room. Do you know how hard that is?'); await T('LINDA', 'I built a company on being a thing people believe. I recognize the work.'); if (F.proCharm) await T('LINDA', 'And because you called me beautiful in a courtroom. Nobody has done that in a long time. Don\'t do it again.'); }
};

// ---------- Walter Coldwell ----------
defSpeaker('COLDWELL', { name: 'WALTER COLDWELL', col: hex('#a0e0ff'), voice: [210, 10], port: 'suit' });
CONV.coldwell = async (e) => {
  if (F.cwDone) { await T('COLDWELL', F.cwDone === 'told' ? '...Leave me.' : 'Continuity first.'); return; }
  await T('N', 'An old man in a gray suit at a desk with nothing on it. The room is freezing. Frost on the inside of the window. His breath doesn\'t fog. Yours does.');
  await T('COLDWELL', 'The streamer. The Commissioner\'s pet. Sit. Not too close. You run warm.');
  const opts = [{ t: 'June says somebody knows.', if: () => F.ohRest }, { t: 'I\'m here about the Crasher census.', if: () => F.rsJob && !F.censusGot }, 'Who are you?', 'Bye.'];
  const c = await C(opts);
  if (c === 0) {
    await T('N', 'For a long time he doesn\'t move. Then the frost on the window cracks, very quietly, from one corner to the other.');
    await T('COLDWELL', 'She\'s... still there.');
    await T('CARL', 'She was. She\'s not now. I gave her back her locket. She asked me if you were ever Walter. If there was ever a Walter. I didn\'t know what to say.');
    await T('COLDWELL', 'There was a Walter. He drowned off the pier in 1950. I found him. I wore him. And then I met her, and I wanted to be him so badly that for six years I was. Six years. Do you know what that is, for something like me?');
    await T('COLDWELL', 'And then she saw. And the Normalcy is the Normalcy.');
    const k = await C(['That\'s not the Normalcy. That\'s you.', { t: '[Kill him] She said tell him somebody knows. I\'m telling you. Somebody knows.', if: () => true }, { t: 'Give me the Crasher census, and I won\'t tell the board about the Ocean House.', if: () => F.rsJob && !F.censusGot }, 'Goodbye, Walter.']);
    if (k === 0) { await T('COLDWELL', 'Yes. I know. I have known for forty years. It doesn\'t help. Nothing helps. It\'s very cold in here.'); F.cwDone = 'told'; gainHumanity('told him to his face'); }
    else if (k === 1) { F.cwDone = 'killed'; e.hostile = 1; e.ai = 'guard'; e.wpn = 'npcclaw'; e.state = 'combat'; e.target = P; e.invuln = 0; e.hp = 220; e.hpMax = 220; e.vis = 'reptilian'; e.trueAlways = 1; await T('N', 'He stands. His suit splits down the back. Underneath, he is very old and very cold and not at all a man.'); }
    else if (k === 2) { F.censusGot = 1; F.cwDone = 'black'; giveItem('census', 1); await T('COLDWELL', '...Take it. Continuity first. Always continuity first.'); }
    else F.cwDone = 'told';
    if (F.cwDone !== 'killed') giveSP(500, 'Walter Coldwell');
    return; }
  if (c === 1) { const k = await C([{ t: 'Roscoe says it\'s a death list. Give it to me.', req: ['rant', 2] }, { t: 'The Commissioner sent me for it. I\'m her pet. You said so.', req: ['denial', 2] }, { t: 'You will give me the census.', req: ['command', 2] }, 'Never mind.']); if (k <= 2) { F.censusGot = 1; giveItem('census', 1); await T('COLDWELL', k === 2 ? '...I will give you the census.' : '...Take it. Take it and go. You\'re warming the room.'); } return; }
  if (c === 2) { await T('COLDWELL', 'Seat Two. Continuity and Cleanup. When a visitor slips, I see that the slip never happened. I have been doing it for ninety years.'); await T('COLDWELL', 'You have slipped ' + (P.viol || 0) + ' times so far. I have the list.'); }
};
ITEMS.census = { name: 'THE CRASHER CENSUS', w: 1, h: 1, quest: 1, use: () => readText('dt_census'), desc: '214 names. Addresses where known.' };
txt('dt_census', 'THE CRASHER CENSUS', 'CONSULATE OF THE NORMALCY - CONTINUITY & CLEANUP\nUNREGISTERED VISITORS, GREATER LOS ANGELES\n\n1. NINE-PLANETS, ROSCOE (Martian) - the Crash Pad, Downtown\n2. [the man with the red headband] (species unknown) - the Crash Pad, "drinks"\n3. GUS (Cryptid) - the drains\n...\n214. CARL (provisional) - [crossed out: registered]\n\nRecommended action: subcontract cleanup to Mr. White.');

// ---------- Roscoe and the Crash Pad ----------
CONV.roscoe = async (e) => {
  if (!F.rsMet) { F.rsMet = 1;
    await T('ROSCOE', 'The kid! The streamer! Everybody, this is the kid Linda didn\'t shoot into space. Get him a drink. Not that one. That one\'s for Greys, it\'ll melt his hat.');
    await T('N', 'In here nobody bothers with the costume. A room full of little green men, gray men, a mothman in a booth, and a man with a red headband at the bar who doesn\'t look up.');
    await T('ROSCOE', 'This is the Crash Pad. Everybody here crashed. Nobody here registered. The Consulate calls us Crashers like it\'s a dirty word. We put it on the sign.'); }
  const c = await C([{ t: 'Is there anything I can do for you?', if: () => !F.rsJob }, { t: 'I got the census.', if: () => F.rsJob && invFind('census') && !F.censusTo }, { t: 'Tell me about Pluto.', if: () => !F.pluto }, { t: 'What do the Crashers want? Like, long term.', if: () => true }, 'See you.']);
  if (c === 0) { F.rsJob = 1; await T('ROSCOE', 'Funny you ask. Word is somebody on the Consulate board made a list. Every Crasher in LA. Names. Addresses. And somebody wants to sell it to Mr. White.'); await T('ROSCOE', 'You know what the white suits do with a list, kid? They work through it. Top to bottom. My name\'s number one. I checked. It\'s alphabetical by GRUDGE.'); await T('ROSCOE', 'It\'s in the Tower. Board floor. Get it out. Burn it, bring it, I don\'t care. Just don\'t let White have it.'); goal('dt_census', 'Get the Crasher census off the Consulate board floor in the Tower before Mr. White buys it.', 1); }
  else if (c === 1) { const k = await C(['Here. It\'s yours.', 'I\'m going to burn it. Nobody gets it.', 'Actually I\'m giving it to the Commissioner. Sorry.']);
    if (k === 0) { F.censusTo = 'roscoe'; removeItem(invFind('census')); await T('ROSCOE', 'Kid. KID. I could kiss you. I won\'t, my mouth is radioactive. Here.'); P.cred += 300; giveSP(800, 'the census'); giveItem('w_plasma', 1); P.ammo.plasma = (P.ammo.plasma || 0) + 12; await T('ROSCOE', 'A real ray gun. 1953. They don\'t make \'em like that because they never made \'em at all. Don\'t point it at Pluto.'); F.crasherTrust = (F.crasherTrust || 0) + 2; }
    else if (k === 1) { F.censusTo = 'burned'; removeItem(invFind('census')); await T('ROSCOE', 'Even better. Nobody gets it. That\'s the Crasher way.'); giveSP(800, 'the census'); F.crasherTrust = (F.crasherTrust || 0) + 1; }
    else { F.censusTo = 'linda'; await T('ROSCOE', '...Then get out of my bar, kid.'); F.crasherTrust = (F.crasherTrust || 0) - 2; }
    goalDone('dt_census'); }
  else if (c === 2) { F.pluto = 1; await T('ROSCOE', 'It\'s a planet. Next question.'); await T('CARL', 'That\'s not- I didn\'t- nobody said it wasn\'t-'); await T('ROSCOE', 'NOT YET THEY HAVEN\'T.'); }
  else if (c === 3) { await T('ROSCOE', 'Same thing everybody wants. To be what we are, out loud, without some lizard on Floor 49 deciding if we\'re allowed to exist.'); await T('ROSCOE', 'Not like the Invaders, kid. They want to eat everybody and call it honesty. We just want to stop apologizing for having antennae.'); }
};
CONV.pilotx_dt = async (e) => {
  if (!F.pxDt) { F.pxDt = 1;
    await T('PILOTX', 'Kid.');
    await T('CARL', 'You! You\'re here! You said you\'d be here. You were right. Okay. Okay. Pilot X. The ship. The box. The pod. Nevada. Everybody keeps saying Nevada at me. What is it? What\'s in it? You know. I know you know. You have a knowing face.');
    await T('PILOTX', 'I don\'t know what\'s in it.');
    await T('CARL', 'But you know something.');
    await T('PILOTX', 'I know a lot of people want it open. And I know that every time somebody in this city opens something they shouldn\'t, people like you and me pay for it.');
    await T('PILOTX', 'Do me a favor. When you\'re standing next to it, and everybody\'s telling you what it is, remember none of them have looked.'); return; }
  const c = await C(['Who are you, really?', 'What are you drinking?', { t: 'Are you on Coldwell\'s list? The census says "the man with the red headband."', if: () => invFind('census') || F.censusTo }, 'See you.']);
  if (c === 0) await T('PILOTX', 'Spoilers.');
  else if (c === 1) await T('PILOTX', 'Whatever they give me. Nobody here knows what I\'d order, so they guess. I like being guessed at.');
  else if (c === 2) await T('PILOTX', '"Species unknown." That\'s the best thing anyone\'s ever written about me.');
};
CONV.crasher_bar = async () => { await T('N', pick(['A little green man is arguing with the TV. He looks wonderful. He\'s glowing.', '"You\'re the kid," says a Grey in a bowling shirt. "Provisional. Ha. Welcome to the club. The club is called Provisional."', '"Linda\'s board has a list, man. Everybody knows Linda\'s board has a list."'])); };
CONV.mothbooth = async () => { await T('N', '"...Gus lives in the drains," says the thing in the booth, which is not Gus. "He collects things. Ask him nicely. Bring him something shiny."'); };

// ---------- MAP: Downtown streets ----------
{
  const g = mk(100, 70, '.');
  g.fill(0, 0, 100, 2, '#'); g.fill(0, 0, 1, 70, '#'); g.fill(99, 0, 1, 52, '#'); g.fill(0, 69, 100, 1, '#');
  g.fill(1, 26, 98, 3, ','); g.fill(1, 49, 98, 3, ','); g.fill(25, 2, 3, 67, ','); g.fill(67, 2, 3, 67, ',');
  g.fill(52, 52, 47, 17, '`'); g.fill(99, 52, 1, 17, '`'); g.fill(80, 62, 19, 7, '~');    // the port road to the east
  // the Tower and its plaza
  g.rect(36, 3, 28, 18, '%', ':'); g.fill(37, 4, 26, 1, 'W'); g.put(50, 20, 'Y'); g.fill(36, 21, 28, 4, ';'); g.put(50, 23, 'f'); g.put(40, 22, 'p'); g.put(60, 22, 'p'); g.put(46, 24, 'q');
  // the Crash Pad
  g.rect(4, 30, 18, 12, '#', ':'); g.put(13, 30, 'C'); g.put(8, 29, 'n');
  // the Greys' Clinic
  g.rect(72, 5, 22, 14, '$', ':'); g.put(83, 18, 'G');
  // hospital
  g.rect(72, 31, 24, 14, '$', ':'); g.put(83, 31, 'H');
  // the Skyline
  g.rect(30, 31, 14, 12, '%', ':'); g.put(37, 31, 'S');
  // the museum
  g.rect(46, 31, 18, 15, '#', ':'); g.put(55, 31, 'M'); g.put(51, 30, 'm');
  // drain grate, alleys
  g.put(22, 56, 'D'); g.put(10, 58, 'd'); g.put(35, 46, 'd'); g.put(70, 46, 'd'); g.put(12, 45, 'b'); g.put(18, 44, 'k');
  for (let x = 6; x < 98; x += 12) { g.put(x, 25, 'l'); g.put(x + 5, 29, 'l'); g.put(x + 2, 48, 'l'); }
  g.put(3, 54, 'T'); g.put(98, 56, 'E'); g.put(98, 57, 'E'); g.put(98, 58, 'E');
  g.put(30, 24, 'u');
  defMap('dt_streets', { name: 'DOWNTOWN', title: 'DOWNTOWN', sub: 'PRETEND CO. TOWER PLAZA - 12:20 AM', hub: 'dt', music: 'downtown', f: ['concrete', 'road', 'grass', 'dock', 'sand'], w: ['office', 'brick', 'glass'], amb: .2, shadow: '#08060e', mem: '#141028',
    grid: g.str(),
    key: {
      Y: [door({ name: 'PRETEND CO. TOWER' }), exitTo('dt_tower', 'front')], f: pr('statue', { text: 'dt_plaque', label: 'FOUNTAIN STATUE' }), p: pr('palm'), q: reader('dt_plaque', { p: 'sign', label: 'PLAQUE' }),
      C: [door({ name: 'THE CRASH PAD' }), exitTo('dt_crashpad', 'front')], n: reader('dt_crashrules', { p: 'sign', label: 'SIGN' }),
      G: [door({ name: 'THE CLINIC' }), exitTo('dt_clinic', 'front')],
      H: [door({ name: 'ST. ANYWHERE HOSPITAL' }), exitTo('dt_hospital', 'front')],
      S: [door({ name: 'THE SKYLINE', lock: 1, pick: 0, str: 1, key: 'skyline' }), exitTo('dt_haven', 'front')],
      M: [door({ id: 'museumdoor', name: 'NATURAL HISTORY MUSEUM', lock: 1, pick: 0, str: 1, key: 'museum' }), exitTo('dt_museum', 'front')], m: reader('dt_news', { p: 'trash', label: 'NEWSPAPER' }),
      D: [pr('manhole'), exitTo('dt_drains', 'grate', { frobbable: 1, label: 'STORM DRAIN', verb: 'CLIMB DOWN' })],
      T: exitTo('hw_blvd', 'cab', { frobbable: 1, label: 'CAB TO HOLLYWOOD', verb: 'RIDE', when: () => F.dtDone, no: 'The cabbie shrugs. "Hollywood? Not on your tab."' }),
      E: exitTo('dt_ship', 'road', { label: 'TO THE PORT' }),
      l: pr('lamp'), d: pr('dumpster'), b: pr('bench'), k: pr('firebarrel'), u: pr('kiosk', { label: 'NEWSSTAND', shop: { name: 'NEWSSTAND', items: [['soda', 2, 9], ['candy', 2, 9], ['chips', 2, 9], ['flare', 8, 4]] } }),
    },
    ents: [
      spawnPt('cab', 0, { x: 4, y: 55 }), spawnPt('tower_out', Math.PI / 2, { x: 50, y: 21.5 }), spawnPt('crash_out', -Math.PI / 2, { x: 13, y: 28 }), spawnPt('clinic_out', Math.PI / 2, { x: 83, y: 20 }), spawnPt('hosp_out', -Math.PI / 2, { x: 84, y: 29.5 }), spawnPt('haven_out', -Math.PI / 2, { x: 37, y: 29.5 }), spawnPt('museum_out', -Math.PI / 2, { x: 55, y: 29.5 }), spawnPt('drain_out', 0, { x: 23, y: 57 }), spawnPt('port_out', Math.PI, { x: 96, y: 57 }),
      npc('civ', { x: 30, y: 50, wander: 6, sprite: 'civ1' }), npc('civ', { x: 60, y: 27, wander: 5, sprite: 'civ7' }), npc('civ', { x: 15, y: 47, wander: 3, sprite: 'civ3', name: 'MAN BY THE FIRE', conv: 'homeless_sm' }), npc('civ', { x: 75, y: 50, wander: 6, sprite: 'civ2' }),
      npc('cop', { x: 50, y: 28, wander: 8, conv: 'cop_sm' }), npc('cop', { x: 85, y: 48, wander: 6, conv: 'cop_sm' }),
      vnpc('consulate', 'reptilian', { x: 47, y: 21, ai: 'static', dir: 1, conv: 'visitor_sm' }), vnpc('consulate', 'reptilian', { x: 53, y: 21, ai: 'static', dir: 1, conv: 'visitor_sm' }),
      vnpc('visitor', 'grey', { x: 80, y: 21, ai: 'static', dir: 1, sprite: 'civ6', conv: 'visitor_sm' }), vnpc('visitor', 'martian', { x: 15, y: 28, ai: 'static', dir: 0, sprite: 'civ5', conv: 'crasher_bar' }),
      light(6, .8, { x: 50, y: 23 }), light(4, .6, { x: 13, y: 29 }), light(4, .6, { x: 83, y: 20 }), light(4, .7, { x: 83, y: 30 }), light(3, .5, { x: 55, y: 30 }), light(4, .6, { x: 4, y: 54 }), light(3, .5, { x: 18, y: 44 }),
      Object.assign(tape(8), { x: 97.5, y: 2.5 }), pr('cab', { x: 5, y: 52 }), { k: 'exit', to: 'sm_streets', at: 'cab', x: 3, y: 60, frobbable: 1, label: 'CAB TO SANTA MONICA', verb: 'RIDE' },
    ],
    enter(M, first) { if (first && !F.dtArrive) { F.dtArrive = 1; run(async () => { await delay(1); infolink('TOMMY', 'Downtown, Carl! The big one in the middle is the Tower. Can\'t miss it. Everybody misses it on purpose.'); }); } },
  });
}

// ---------- MAP: the Tower (lobby, board floor 49, penthouse 50) ----------
{
  const g = mk(44, 50, '%');
  // lobby (y 0-15)
  g.rect(0, 0, 44, 16, '%', ':'); g.put(22, 15, 'x'); g.fill(14, 1, 16, 1, 'W');
  g.put(22, 6, 'C'); g.put(22, 4, 'H'); g.put(21, 1, 'E'); g.put(23, 1, 'E'); g.put(4, 4, 'p'); g.put(39, 4, 'p'); g.put(8, 10, 's'); g.put(32, 10, 's'); g.put(18, 12, 'r');
  g.put(3, 12, 'c'); g.put(40, 12, 'c');
  // floor 49: the board (y 17-32)
  g.rect(0, 17, 44, 16, '%', ':'); g.put(21, 18, 'e'); g.put(23, 18, 'e');
  g.rect(0, 17, 14, 16, '%', ':'); g.put(13, 25, 'D');                       // Coldwell's office
  g.rect(30, 17, 14, 16, '%', '.'); g.put(30, 25, '+');                      // records
  g.put(20, 25, 'T'); g.put(24, 25, 't'); g.put(6, 21, 'Q'); g.put(4, 21, 'K'); g.put(36, 20, 'k'); g.put(40, 20, 'R'); g.put(40, 28, 'R'); g.put(36, 28, 'z'); g.put(22, 30, 'B'); g.put(34, 23, 'n');
  g.put(16, 22, 'g'); g.put(27, 28, 'g');
  // floor 50: the penthouse (y 34-49)
  g.rect(0, 34, 44, 16, '%', ';'); g.fill(1, 35, 42, 1, 'W'); g.fill(1, 35, 1, 14, 'W'); g.fill(42, 35, 1, 14, 'W'); g.put(22, 48, 'v');
  g.put(22, 40, 'L'); g.put(20, 38, 'd'); g.put(10, 42, 'a'); g.put(32, 42, 'a'); g.put(14, 46, 'P'); g.put(30, 46, 'P'); g.put(22, 44, 'h');
  defMap('dt_tower', { name: 'PRETEND CO. TOWER', title: 'PRETEND CO. TOWER', sub: '', hub: 'dt', music: 'fatco', f: ['marble', 'carpet', 'carpet', 'marble'], w: ['office', 'glass'], win: 'glass', amb: .4, shadow: '#0a0a14',
    grid: g.str(),
    key: {
      x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'tower_out')], C: pr('counter', { label: 'SECURITY DESK' }),
      H: npc('hu', { id: 'human', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', conv: 'hu_desk', ai: 'static', invuln: 1, dir: 0 }),
      E: exitTo('dt_tower', 'pent', { label: 'ELEVATOR (50)', frobbable: 1, verb: 'RIDE UP', when: () => F.metHuman, no: 'HU-MAN looks at you. "Please check in with the desk. The desk is me."' }),
      e: exitTo('dt_tower', 'lobby', { label: 'ELEVATOR (LOBBY)', frobbable: 1, verb: 'RIDE DOWN' }),
      v: exitTo('dt_tower', 'lobby', { label: 'ELEVATOR (LOBBY)', frobbable: 1, verb: 'RIDE DOWN' }),
      p: pr('plant'), s: pr('sofa'), r: reader('dt_board', { p: 'sign', label: 'BOARD DIRECTORY' }), c: npc('consulate', { ai: 'static', dir: 1, conv: 'visitor_sm' }),
      D: door({ id: 'cwoffice', name: 'SEAT TWO', lock: 1, str: .7 }), '+': door({ id: 'records', name: 'RECORDS', lock: 1, str: .5 }),
      Q: npc('civ', { id: 'coldwell', name: 'WALTER COLDWELL', sprite: 'suit', port: 'suit', conv: 'coldwell', ai: 'static', dir: 0, vis: 'reptilian', knows: 1, invuln: 1, team: 'consulate' }),
      K: comp([['w.coldwell', 'continuity', { mail: ['dt_cw1', 'dt_cw2'], special: [['Print the Crasher census', () => { if (F.censusGot) return 'Already printed.'; F.censusGot = 1; giveItem('census', 1); return 'The printer whirs. 214 names.'; }]] }]], { c: { hackStr: .55, team: 'consulate', alarmOnTrace: 1 } }),
      T: pr('table', { label: 'BOARD TABLE' }), t: pr('table'), k: comp([['records', 'normal', { mail: ['dt_rec1'] }]], { c: { hackStr: .4 } }), R: pr('shelf'), z: pr('locker', { items: [['biocell', 2], ['a_10mm', 2]] }),
      B: vnpc('consulate', 'reptilian', { route: 'b1' }), g: vnpc('consulate', 'reptilian', { ai: 'guard', dir: 1, look: .8 }),
      L: npc('civ', { id: 'linda', name: 'COMMISSIONER LINDA', sprite: 'linda', port: 'LINDA', conv: 'linda_dt', ai: 'static', team: 'consulate', knows: 1, invuln: 1, dir: 1 }),
      d: pr('desk'), a: pr('plant'), P: pr('palm'), h: pr('sofa'), n: reader('dt_logins', { p: 'sign', label: 'MEMO' }),
    },
    routes: { b1: '1,2,3' },
    ents: [spawnPt('front', -Math.PI / 2, { x: 22, y: 14 }), spawnPt('lobby', Math.PI / 2, { x: 22, y: 3 }), spawnPt('board', Math.PI / 2, { x: 22, y: 20 }), spawnPt('pent', -Math.PI / 2, { x: 22, y: 46.5 }),
      exitTo('dt_tower', 'board', { x: 34, y: 2, label: 'STAIRS (49)', frobbable: 1, verb: 'CLIMB', when: () => F.dtL1, no: 'A keycard reader. You don\'t have a card. You do have a strong feeling you\'ll be back.' }),
      exitTo('dt_tower', 'board', { x: 25, y: 47, label: 'STAIRS DOWN (49)', frobbable: 1, verb: 'CLIMB DOWN' }),
      light(6, .9, { x: 22, y: 8 }), light(5, .6, { x: 22, y: 25 }), light(3, .5, { x: 6, y: 21, col: '#a0e0ff' }), light(6, .9, { x: 22, y: 42 })],
  });
  const d = MAPS.dt_tower; const rows = d.grid.split('\n'); const put = (x, y, c) => { const r = rows[y].split(''); r[x] = c; rows[y] = r.join(''); }; put(18, 27, '1'); put(26, 27, '2'); put(22, 31, '3'); d.grid = rows.join('\n');
}

// ---------- MAP: the Crash Pad ----------
{
  const g = mk(30, 20, '#');
  g.rect(0, 0, 30, 20, '#', '.'); g.put(13, 19, 'x');
  g.put(3, 3, 'B'); g.put(20, 4, 'R'); g.put(24, 12, 'X'); g.put(8, 10, 't'); g.put(14, 10, 't'); g.put(20, 10, 't'); g.put(26, 3, 'J'); g.put(26, 16, 'm'); g.put(4, 16, 'P'); g.put(10, 2, 'n');
  g.put(9, 11, 'a'); g.put(15, 11, 'b'); g.put(21, 11, 'a'); g.put(6, 6, 'b'); g.put(17, 15, 'a');
  defMap('dt_crashpad', { name: 'THE CRASH PAD', title: 'THE CRASH PAD', sub: 'NO CONSULATE', hub: 'dt', music: 'lounge', f: ['wood', 'carpet'], w: ['brick', 'neon'], amb: .3, shadow: '#140808', trueForms: 1,
    grid: g.str(),
    key: {
      x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'crash_out')], B: pr('bar'), J: pr('jukebox'), t: pr('table'), P: pr('piano'), n: reader('dt_crashrules', { p: 'poster', label: 'RULES' }),
      R: npc('crasher', { id: 'roscoe', name: 'ROSCOE NINE-PLANETS', sprite: 'roscoe', port: 'ROSCOE', conv: 'roscoe', ai: 'static', invuln: 1, dir: 0, vis: 'martian' }),
      X: npc('crasher', { id: 'pilotx', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'pilotx_dt', ai: 'static', invuln: 1, dir: 2, vis: null }),
      m: npc('crasher', { name: 'THING IN THE BOOTH', vis: 'cryptid', conv: 'mothbooth', ai: 'static', dir: 2 }),
      a: npc('crasher', { vis: 'martian', conv: 'crasher_bar', ai: 'static', dir: 1 }), b: npc('crasher', { vis: 'grey', conv: 'crasher_bar', ai: 'static', dir: 0 }),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 13, y: 18 }), npc('civ', { x: 4, y: 2, name: 'BARTENDER (HUMAN, PROTECTED)', sprite: 'bartender', port: 'BARTENDER', conv: 'bartender_dt', ai: 'static', dir: 0, knows: 1 }),
      light(4, .8, { x: 5, y: 4, col: '#ffa040' }), light(4, .6, { x: 15, y: 10, col: '#80ff40' }), light(3, .6, { x: 25, y: 13 })],
  });
}
CONV.bartender_dt = async (e) => { const c = await C(['What\'s on tap?', 'You\'re human?', 'Bye.']); if (c === 0) await shopUI({ name: 'THE CRASH PAD', items: [['liquor', 6, 9], ['soda', 3, 9], ['biocell', 32, 4], ['a_10mm', 14], ['a_plasma', 60, 3]] }, e); else if (c === 1) await T('BARTENDER', 'Yep. Roscoe\'s rule three. Safest human in LA. You try anything, a hundred little green guys get upset.'); };

// ---------- MAP: the Skyline (haven 2) ----------
{
  const g = mk(24, 14, '%');
  g.rect(0, 0, 24, 14, '%', ';'); g.fill(1, 1, 22, 1, 'W'); g.fill(22, 1, 1, 12, 'W'); g.put(4, 13, 'x');
  g.put(2, 2, 'b'); g.put(8, 2, 'c'); g.put(14, 2, 'r'); g.put(18, 6, 's'); g.put(10, 8, 't'); g.put(2, 8, 'm'); g.put(18, 11, 'k'); g.put(14, 11, 'f');
  defMap('dt_haven', { name: 'HAVEN: THE SKYLINE', title: 'HAVEN', sub: 'THE SKYLINE, 31ST FLOOR', hub: 'dt', music: 'convo', f: ['wood', 'carpet', 'carpet'], w: ['office', 'glass'], win: 'glass', amb: .4, shadow: '#0c0818',
    grid: g.str(),
    key: { x: [door({ name: 'DOOR' }), exitTo('dt_streets', 'haven_out')], b: pr('bed', { label: 'BED (SAVE)', frob: async () => { await saveUI(true); } }),
      c: comp([['carl', 'pills', { mail: ['sm_m1', 'sm_m2', 'sm_m3', 'sm_m4', 'dt_m1', 'dt_m2', 'dt_m3'] }]], { label: 'CARL\'S COMPUTER', c: { hackStr: .1 } }),
      r: pr('radio', { label: 'RADIO (DEEP NIGHT WITH DEB)', frob: () => run(playRadio) }), s: pr('sofa'), t: pr('tv', { text: 'dt_news', label: 'TV' }), m: reader('sm_mirror', { p: 'sign', label: 'MIRROR' }),
      k: pr('locker', { label: 'STASH', items: [['biocell', 2], ['medkit', 1]] }), f: pr('fridge', { items: [['soda', 1]] }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 4, y: 12 }), light(5, .7, { x: 12, y: 7, col: '#ffd0a0' })],
    enter(M, first) { if (first) msg('A nicer apartment. The view is very good. You do not stream it. You think about it.'); },
  });
  KEYNAMES.skyline = 'SKYLINE KEYCARD'; KEYNAMES.museum = 'MUSEUM PASS';
}

txt('dt_logins', 'MEMO', 'RECORDS - BOARD FLOOR\n\nReminder: Seat Two keeps forgetting his terminal password and calling IT at four in the morning.\nIT has written it here so IT can sleep.\n\nuser: w.coldwell\npass: continuity\n\nAnd the records terminal is records / normal, like it has been since 1961. Please stop asking.\n\n- IT', { logins: [['w.coldwell', 'continuity'], ['records', 'normal']], note: 'Walter Coldwell\'s terminal login: w.coldwell / continuity. The records terminal: records / normal.' });
mail('dt_rec1', 'RECORDS', 'all-staff', 'retention', 'Reminder: the Normalcy keeps everything. Registrations, deportations, the incident files, the 1961 originals.\n\nThe census of the unregistered is NOT kept here. It is on Seat Two\'s terminal, because Seat Two does not trust Records.\n\nRecords does not trust Seat Two either. - Records');
