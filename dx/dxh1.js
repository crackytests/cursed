'use strict';
// ================= HUB 1: MALL ISLAND (Liberty Island) =================
// The Statue of Linda-ty stands on an island in the Mall of the Future's ornamental lake. The P.P.F. took it last night.
HUBS.mall = { name: 'MALL ISLAND' };

// ---------- texts ----------
txt('mi_plaque', 'BRONZE PLAQUE', 'THE STATUE OF LINDA-TY\n\nPresented by Fascism Inc. to the People of Nevada, who asked for it in a survey Fascism Inc. also presented.\n\n"Give me your tired, your poor, your huddled masses yearning to shop."\n\nTorch: 40 ft. Ponytail: 61 ft. Height of Linda-ty: Classified.');
txt('mi_news1', 'THE MIDNIGHT PRETEND', 'BUFFERING REACHES HENDERSON\n\nHealth officials confirmed 214 new cases of the Buffering in Henderson this week. Victims slow down, repeat themselves, and eventually stop. Doctors are advised not to use the word "stop."\n\nPRETEND CO.: PROP PILLS RECALL "PRECAUTIONARY"\n\nA Pretend Co. spokesperson said the recall of Prop Pills was "precautionary," "voluntary," and "not related to the pills working." When asked what the pills were related to, the spokesperson said "a placebo," then asked to go off the record, then left.\n\nTERRORISTS SEIZE MALL LANDMARK\n\nThe Prop Pills Front has taken the Statue of Linda-ty. FATCO says a "new kind of agent" is on the way.', { onRead: () => F.readNews1 = 1 });
txt('mi_cube1', 'DATACUBE', 'Museum security terminal\nuser: DOCENT\npass: TORCH\n\nDo NOT give this to the rebels. -Marguerite\n\n(It is on a datacube. In the gift shop. Under the register. Marguerite, I am begging you.)', { login: ['DOCENT', 'TORCH'], note: 'Museum security login: DOCENT / TORCH' });
txt('mi_cube2', 'DATACUBE', 'Bring the crates from the west storage up to Dani in the infirmary. Not all of them. Leave two in storage so the FATCO scanner pings something when they come.\n\nThe agent they captured is in storage B. He keeps telling us he is normal. Nobody asked.\n\nStorage key is with Rook.\n-L.P.');
txt('mi_cube3', 'DATACUBE', 'The service door code was 0451 and I know it was 0451 because I have changed it to 0451 four times now. It keeps reverting. I am not going to think about why.\n- Maintenance', { code: '0451', note: 'Statue service door code: 0451' });
txt('mi_bigl1', 'THE BIG LITTER, Chapter 1', 'THE BIG LITTER\na novel by JB Garfield\n\nChapter One: The Can\n\nThe city had a smell like a can of tuna somebody opened in 1987 and never closed. I knew the smell. I was the one who opened it.\n\nShe walked into my office the way trouble walks into anything: sideways, wearing a hat. "Mister Garfield," she said. "I need you to find my husband."\n\n"Lady," I said, "I don\'t find husbands. I find lasagna. Sometimes the two are connected."\n\nThey were connected. That was the first mistake. The second mistake was mine, and it was lunch.\n\n(The rest of this chapter is missing. Somebody tore the pages out and, judging by the stains, ate off them.)', { onRead: () => { if (!F.bigl1) { F.bigl1 = 1; giveSP(50, 'reading'); } } });
txt('mi_sign', 'SIGN', 'MALL ISLAND\nFATCO HEADQUARTERS: NORTH\nSTATUE OF LINDA-TY: CENTER\nGIFT SHOP: WEST\nDOCKS: SOUTH\n\nNO LOITERING. NO SMOKING. NO SPECIES WITHOUT A PERMIT.', { onRead: () => { if (!F.sign1) { F.sign1 = 1; infolink('CARL', 'No species without a permit. What does that mean? I have a permit. I have a card. Chat, I have a card.'); } } });
txt('mi_museum', 'EXHIBIT: THE LINDA STORY', 'Before she was CEO of Fascism Inc., Linda was a girl with a dream: to build something that would last.\n\nShe built a marijuana business. She built a company. She built the AI companions you know and love. She built the Mall of the Future.\n\nShe did all of this alone.\n\n(A smaller plaque underneath, added later, says: "She did not do it alone. Somebody left. That is not the same thing." It has been half pried off.)');
txt('mi_museum2', 'EXHIBIT: PROP PILLS', 'PROP PILLS: A PRETEND CO. PRODUCT\n"The Pretend Company. A Real Company."\n\nProp Pills were introduced as a lifestyle placebo for people who wanted to feel like they were doing something.\n\nThis exhibit has been closed for renovation.\n\n(Someone has written underneath, in marker: THEY WORKED. THAT IS WHY YOU CAN\'T BUY THEM.)');
mail('mi_m1', 'm.duvall', 'docent.all', 'The statue', 'Please remind guests the torch is not an exit. We have had to explain this to two separate tour groups and one man who said he was a ghost.');
mail('mi_m2', 'security', 'docent.all', 'Cameras', 'The lobby camera is on the security net now. If you need it off for cleaning, log in here and turn it off. The rebels do not know this. Please continue to not tell the rebels this.');
mail('mi_m3', 'l.propp', 'ppf.island', 'Hold the torch', 'They will send agents. Do not shoot first. If it is the little one, the one from the parking lot, try talking. Everyone says he talks back. That might be good for us.', { note: 'The P.P.F. know about Carl. "Try talking. Everyone says he talks back."' });

// ---------- conversations ----------
CONV.pilotx_dock = async (e) => {
  await T('PILOTX', 'Little brother.');
  await T('CARL', 'Don\'t— okay, why do you keep saying that? Are we? Is that a thing, are we actually brothers?');
  await T('PILOTX', 'I can\'t answer that.');
  await T('CARL', 'Why not?');
  await T('PILOTX', 'Spoilers.');
  await T('CARL', 'That\'s not a reason. That\'s a word.');
  await T('PILOTX', 'The P.P.F. took the statue last night. Their commander is up in the torch. They\'re holding one of ours in the base. You\'ve met HU-MAN.');
  await T('CARL', 'The normal one. Yeah. He keeps saying hello to me like it\'s a test.');
  await T('PILOTX', 'FATCO issued me three toys for you. Take one. Choose like it matters.');
  chatPoll('which weapon', ['SNIPER', 'GEP', 'CROSSBOW']);
  const c = await C(['The SNIPER RIFLE. I like seeing things before they see me.', 'The G.E.P. GUN. Doors are a suggestion.', 'The MINI-CROSSBOW. With the sleepy darts.']);
  if (c === 0) { giveItem('w_sniper'); P.ammo['3006'] = (P.ammo['3006'] || 0) + 8; await T('PILOTX', 'Patient. Good.'); F.gift = 'sniper'; }
  else if (c === 1) { giveItem('w_gep'); P.ammo.rocket = (P.ammo.rocket || 0) + 3; await T('PILOTX', 'Loud. Well. Every story needs a loud part.'); F.gift = 'gep'; }
  else { giveItem('w_xbow'); P.ammo.tdart = (P.ammo.tdart || 0) + 8; await T('PILOTX', 'Good. Keep that. You\'ll want to have been that guy.'); F.gift = 'xbow'; }
  await T('CARL', 'What does that mean, "have been that guy"?');
  await T('PILOTX', 'FATCO will tell you lethal force is authorized. I\'d like to tell you it isn\'t required.');
  const c2 = await C(['Why are the P.P.F. even doing this?', 'Is there another way in?', 'Okay. Torch. Got it.']);
  if (c2 === 0) { await T('PILOTX', 'Ask them. Some of them will answer you.'); await T('CARL', 'You know, don\'t you. You know the whole thing.'); await T('PILOTX', 'I know a lot of things, little brother.'); await T('CARL', 'Spoilers. Yeah. Okay.'); }
  if (c2 <= 1) { await T('PILOTX', 'Front door\'s barricaded. Old Mo runs the docks; he knows the island. There\'s a service door on the east side, and a maintenance hatch on the west you\'d fit in.'); await T('CARL', 'What do you mean I\'d fit in. Why would I fit in it.'); await T('PILOTX', 'Because you\'re efficient.'); await T('CARL', '...Thank you.'); }
  await T('PILOTX', 'Go. I\'ll be on the infolink.');
  goal('mi_torch', 'Reach the P.P.F. commander at the top of the Statue of Linda-ty.');
  goal('mi_human', 'Find agent HU-MAN, held somewhere in the statue base.', 1);
  F.metPX = 1; e.conv = 'pilotx_dock2';
  setTimeout(() => { infolink('YOKO', 'Carl, it\'s Yoko, I\'m on ops. Your infolink\'s live. You\'ll hear me, Pilot X, the Director.'); infolink('YOKO', 'You\'ll also see... the chat. It\'s the FATCO comms channel. There are other users on it. We don\'t know who they are.'); infolink('CARL', 'What do you mean you don\'t know who they are? They\'re in my head. Chat, who are you? ...Okay, they\'re saying hi. They\'re saying "hi Carl." That\'s fine. That\'s worse.'); }, 400);
};
CONV.pilotx_dock2 = async () => { await T('PILOTX', pick(['The torch, little brother.', 'You\'re doing fine. You\'ll find out later how fine.', 'I\'d tell you, but you wouldn\'t believe me, and then you\'d be right not to.'])); };
CONV.mo = async (e) => {
  if (!e.met) { await T('N', 'An old man sits on an upturned bucket, mending a net that does not seem to belong to any boat.'); await T('CARL', 'Hey. Are you Old Mo?'); await T('MO', 'I\'m Mo. The old is a description.'); await T('CARL', 'Pilot X said you know the island.'); await T('MO', 'I know the island. Island doesn\'t know me. That\'s how I like it.'); }
  const c = await C(['How do I get into the statue?', 'What do you think about the P.P.F.?', { t: 'You don\'t think I\'m weird? You\'re looking at me like I\'m weird.', if: () => !F.moWeird }, 'Got anything for sale?', 'See you.']);
  if (c === 0) { await T('MO', 'Front\'s barricaded. Side door\'s got a keypad. The maintenance fella changes the code and it changes back, poor boy. He keeps notes in his hut, east yard.'); await T('MO', 'And there\'s a hatch on the west wall. Grown man won\'t fit. Kid would.'); await T('CARL', 'I\'m not a kid.'); await T('MO', 'Didn\'t say you were. Said you\'d fit.'); addNote('Old Mo: the maintenance hut in the east yard has the service door code. A hatch on the statue\'s west wall fits someone small (crouch).'); }
  else if (c === 1) { await T('MO', 'My wife\'s sister has the Buffering. Was halfway through telling me a story at Thanksgiving and she just... held the note. Like a singer. Still holding it.'); await T('MO', 'Those kids are giving out the pills Pretend Co. won\'t sell. I don\'t know if that\'s terrorism. I know it\'s the only thing that\'s worked.'); await T('CARL', '...Oh.'); F.moSister = 1; }
  else if (c === 2) { F.moWeird = 1; await T('MO', 'Son, I\'ve been on this dock forty years. I\'ve seen a man fish up a jet ski with a skeleton still on it. You\'re a short fella in a long coat.'); await T('CARL', 'Thank you. Yeah. That\'s what I am. Thank you.'); }
  else if (c === 3) { await shopUI({ name: "MO'S BAIT AND SUNDRIES", items: [['lockpick', 30, 4], ['multitool', 40, 3], ['medkit', 45, 3], ['soda', 3], ['a_tdart', 40, 2]] }, e); }
};
defSpeaker('MO', { name: 'OLD MO', col: hex('#c0d0e0'), voice: [260, 30], port: 'civ3' });
CONV.lobbyguard = async () => { if (F.h1done) await T('FATCO', 'Agent Denton. Elevator\'s unlocked. Director\'s waiting.'); else await T('FATCO', pick(['Agent Denton. Director says report after the statue is secure.', 'HQ\'s locked down until the island is clear, sir.', 'Is that... sir. Yes. Sir.'])); };
defSpeaker('FATCO', { name: 'FATCO TROOPER', col: hex('#80a0e0'), voice: [300, 20], port: 'fatco' });
defSpeaker('PPF', { name: 'P.P.F. REBEL', col: hex('#e0a060'), voice: [420, 40], port: 'ppf' });
CONV.human_tied = async (e) => {
  await T('HUMAN', 'Hello. I am a normal human. I have been captured in a normal way.');
  await T('CARL', 'Yeah. I see that. You\'re tied to a chair.');
  await T('HUMAN', 'A normal amount of chair. FATCO sent you. The original. To rescue the improvement.');
  await T('CARL', 'What did you just call me?');
  await T('HUMAN', 'The original. I was built from every line in your file that the Committee told you to cut. I am you, normal. Please untie me.');
  const c = await C(['Untie him.', '[DENIAL] I\'m the normal one. I have a card.', 'Leave him. He\'s safer here than near me.']);
  if (c === 1) { await T('CARL', 'I have a card. It says HUMAN. Laminated. Does yours say that?'); await T('HUMAN', '...Mine says HU-MAN. With a dash.'); await T('CARL', 'Right. So.'); await T('HUMAN', 'This is a very upsetting conversation.'); }
  if (c === 2) { await T('HUMAN', 'You are leaving me. That is very non-standard.'); await T('CARL', 'I\'ll come back. Probably.'); return; }
  await T('N', 'Carl undoes the knots. HU-MAN stands, adjusts his khakis, and nods at exactly the angle of a man in a catalog.');
  await T('HUMAN', 'Thank you. I will tell the Director you were efficient. I will not tell him you were short.');
  await T('CARL', 'You just told me.');
  F.humanFreed = 1; goalDone('mi_human', 400);
  e.conv = null; e.talk = ['I am going to stand here in a normal way.', 'Proceed, original.']; e.state = 'idle'; e.ai = 'static';
  setTimeout(() => { e.hidden = 1; e.gone = 1; }, 4000);
  infolink('PILOTX', 'Good. He\'ll remember that. Not the way you want, but he will.');
};
CONV.dani = async (e) => {
  if (!e.met) { await T('N', 'A woman in a bloodied P.P.F. armband is kneeling between three cots. The people on them are awake. They are not moving. One of them is mouthing the same syllable over and over.'); await T('DANI', 'If you\'re here to arrest me, wait until I finish this dose. Please.'); }
  const c = await C(['What\'s wrong with them?', 'Where did you get the pills?', 'I\'m not going to arrest you.', 'Leave.']);
  if (c === 0) { await T('DANI', 'The Buffering. You\'ve seen the news. You haven\'t seen this. They\'re still in there. They can hear us. They just can\'t catch up.'); await T('DANI', 'Two pills, every six hours, and they come back. Slowly. Pretend Co. has warehouses of the stuff. You\'re standing on one.'); await T('CARL', 'The statue\'s a warehouse?'); await T('DANI', 'The whole mall is a warehouse, agent.'); }
  else if (c === 1) { await T('DANI', 'From under your feet. The base of this statue was a Pretend Co. distribution center before it was a museum. Before it was a monument. They keep putting new signs on the same building.'); }
  else if (c === 2) { await T('DANI', '...You mean it.'); await T('CARL', 'I mean, I don\'t know what I mean. I was told to go to the torch. Nobody said anything about the... the cots.'); await T('DANI', 'Then go to the torch. Leo will talk to you. He\'s been waiting for someone to talk to.'); F.daniSpared = 1; }
};
defSpeaker('DANI', { name: 'P.P.F. MEDIC DANI', col: hex('#ff9090'), voice: [700, 40], port: 'ppf2' });
CONV.leo = async (e) => {
  await T('LEO', 'Stop. I\'m unarmed. I\'m done. Everyone up here is done.');
  await T('CARL', 'Okay. Okay. Hands, uh. Keep your hands where... where they are. That\'s fine.');
  await T('LEO', 'You\'re the one from the parking lot. The delivery driver.');
  await T('CARL', 'I\'m an agent. I have a card.');
  await T('LEO', 'Did you read it?');
  await T('CARL', 'It says HUMAN.');
  await T('LEO', 'I didn\'t ask what the word was.');
  const c = await C(['Why are you doing this?', 'The pills. Do they actually work?', 'What do you mean, did I read it?']);
  if (c === 0 || c === 1) { await T('LEO', 'Because they work. Prop Pills cure the Buffering. Not "help." Cure. Pretend Co. found out, recalled them, and started selling the Buffered something else: subscriptions to the AI companions that "keep them company."'); await T('LEO', 'There are ten thousand cases of pills under this statue and people dying across the lake.'); }
  if (c === 2) { await T('LEO', 'Look at the stamp, not the word. Look at the date and the office. The species review board approved you before you applied.'); await T('CARL', '...That\'s just how fast they are.'); await T('LEO', 'Sure. That\'s what it is.'); F.leoStamp = 1; }
  infolink('FACE', 'Agent Denton. FATCO troops are on approach to the torch. Hold the prisoner.');
  await T('LEO', 'There they go. You decide now, delivery driver. They\'ll take me, or you will, or you won\'t.');
  chatPoll('what do we do with leo', ['ARREST', 'LET HIM GO', 'KILL']);
  const k = await C(['You\'re under arrest. FATCO will take you in.', 'Go. Take the north stairs before they get here.', 'Draw your gun, Leo. Don\'t make me wait.']);
  if (k === 0) { await T('LEO', 'Fine. Remember I said it. Look at the stamp.'); F.leo = 'arrested'; }
  else if (k === 1) { await T('LEO', '...Thank you. They\'ll know. You know they\'ll know.'); await T('CARL', 'I\'ll tell them you jumped. Into the lake. Off the torch. People do that. Tour groups. I read about it.'); F.leo = 'freed'; e.hidden = 1; e.gone = 1; P.map.ents.splice(P.map.ents.indexOf(e), 1); }
  else { await T('LEO', 'I don\'t have a gun, kid.'); await T('CARL', '...'); F.leo = 'killed'; kill(P.map, e, P); }
  goalDone('mi_torch', 600); F.h1done = 1;
  setTimeout(async () => {
    await infolink('PILOTX', F.leo === 'freed' ? 'I saw a man take the north stairs. Must\'ve been a tourist.' : F.leo === 'killed' ? '...Report to the Director, little brother.' : 'Good work. FATCO\'s taking him.');
    await infolink('FACE', 'Report to headquarters, Agent Denton. The elevator in the north lobby is open to you now.');
    goal('mi_report', 'Report to Director Face at FATCO headquarters (north lobby elevator).');
  }, 300);
};
defSpeaker('LEO', { name: 'COMMANDER LEO PROPP', col: hex('#e0a060'), voice: [360, 30], port: 'ppf' });
CONV.ppf_surrender = async (e) => { await T('PPF', pick(['Don\'t shoot! We\'re just— we\'re just giving them out.', 'You\'re the parking lot guy. Are you going to arrest a pharmacist?', 'Leo\'s upstairs. He wants to talk to you. God knows why.'])); };

// ---------- MAP: the island ----------
{
  const g = mk(72, 46, '"');
  g.fill(2, 2, 68, 40, '~'); g.fill(3, 3, 66, 37, ','); g.fill(3, 37, 66, 3, '`');
  // FATCO HQ lobby (north)
  g.stamp(25, 3, `
%%%%%%%%%%%%%%%%%%%%%%
%N....l....qq....l..N%
%..g.................%
%.D..P............P..%
%..........E.........%
%%WWW%%%%%++%%%%%WWW%%`);
  g.fill(33, 9, 6, 2, '.'); g.put(31, 9, 'L'); g.put(40, 9, 'L'); g.put(22, 6, 'T'); g.put(50, 5, 'T'); g.put(55, 8, 'T'); g.put(12, 6, 'T'); g.put(7, 9, 'T');
  // the compound
  g.rect(18, 11, 36, 25, '=', ','); g.fill(34, 11, 4, 1, '.'); g.fill(34, 35, 4, 1, '.');
  g.fill(25, 14, 22, 1, '.'); g.fill(25, 31, 22, 1, '.'); g.fill(25, 14, 1, 18, '.'); g.fill(46, 14, 1, 18, '.'); g.fill(34, 12, 4, 2, '.'); g.fill(34, 32, 4, 3, '.');
  g.rect(28, 17, 16, 12, '$');
  g.put(35, 28, 'f'); g.put(43, 22, 'e'); g.put(44, 23, 'k'); g.put(27, 21, 'w'); g.put(26, 21, '.');
  g.stamp(19, 12, `
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,T.....1.........r........2...T,,`);
  g.put(25, 15, '1'); g.put(46, 15, '2'); g.put(46, 30, '3'); g.put(25, 30, '4'); g.put(36, 12, 'r');
  for (const [x, y] of [[24, 14], [47, 14], [24, 31], [47, 31], [33, 33], [38, 33]]) g.put(x, y, 'L');
  g.fill(20, 16, 3, 5, 'b'); g.fill(49, 24, 3, 6, 'b'); g.fill(20, 27, 3, 4, 'b'); g.fill(30, 12, 3, 1, 'b');
  g.put(21, 23, 'T'); g.put(50, 18, 'T'); g.put(42, 33, 'T'); g.put(29, 33, 'T'); g.put(50, 32, 'T');
  g.put(33, 32, 'K'); g.put(38, 32, 'K'); g.put(32, 30, 'M'); g.put(40, 30, 'K'); g.put(30, 29, 'X'); g.put(33, 31, 'p'); g.put(38, 31, 'G'); g.put(41, 16, 'K'); g.put(42, 16, 'K');
  g.put(31, 31, 'n'); g.put(26, 25, 'E');
  // gift shop (west)
  g.stamp(4, 14, `
%%%%%%%%%%%%%
%.D.c%S.S.S.%
%..h.%......%
%.N..o......%
%%%%%%...u..%
%Y......V...%
%...........+
%..S..S.....%
%P....d....P%
%...........%
%B.S.S.S.S..%
%%%%%%WW%%%%%`);
  g.fill(17, 20, 1, 1, '.');
  g.put(9, 30, '5'); g.put(13, 9, '6'); g.put(15, 27, 'm'); g.put(10, 34, 'T'); g.put(5, 30, 'T'); g.put(14, 31, 'L'); g.fill(5, 32, 4, 3, 'b');
  // maintenance yard (east)
  g.rect(55, 13, 13, 18, '=', ':'); g.fill(55, 20, 1, 2, ':');
  g.stamp(58, 15, `
%%%%%%%%
%t.D..N%
%......%
%..i...%
%%%+%%%%`);
  g.put(59, 24, 'j'); g.put(63, 26, 'K'); g.put(64, 26, 'K'); g.put(63, 27, 'X'); g.put(66, 28, 'O'); g.put(57, 28, 'U'); g.put(57, 22, 'L'); g.put(66, 22, 'L'); g.put(61, 23, '7'); g.put(61, 29, '8');
  // docks (south)
  g.fill(30, 39, 12, 6, ';'); g.fill(30, 40, 12, 5, ';'); g.put(41, 44, 'L'); g.fill(31, 36, 3, 2, 'b'); g.fill(39, 36, 3, 2, 'b'); g.put(35, 43, 'a'); g.put(36, 40, 'x');
  g.stamp(44, 35, `
%%%%%%%%%
%..D...N%
%.Y..y..%
%.....P.%
%%%+%%%%%`);
  g.put(30, 37, 'E'); g.put(42, 38, 'K'); g.put(43, 38, 'O'); g.put(28, 38, 'H'); g.put(27, 37, 'h');
  // the sandbar (warp part) and the reeds
  g.fill(62, 41, 5, 2, '`'); g.put(64, 41, 'z'); g.fill(3, 25, 2, 8, 'b');
  // paths
  g.fill(35, 36, 2, 3, '.'); g.fill(17, 20, 8, 1, '.'); g.fill(47, 20, 8, 1, '.');
  const grid = g.str();
  defMap('mall_island', { name: 'MALL ISLAND', title: 'MALL ISLAND', sub: 'STATUE OF LINDA-TY  -  02:14', hub: 'mall', music: 'mall', f: ['concrete', 'grass', 'asphalt', 'dock', 'sand'], w: ['concrete', 'brick', 'stone'], amb: .12, shadow: '#000818', mem: '#0a1430', out: 1,
    grid,
    key: {
      a: spawnPt('boat', -Math.PI / 2), x: npc('civ', { id: 'pilotx', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'pilotx_dock', team: 'fatco', ai: 'static', dir: 1, invuln: 1 }),
      y: npc('civ', { id: 'mo', name: 'OLD MO', sprite: 'civ3', port: 'civ3', conv: 'mo', ai: 'static' }),
      g: npc('fatco', { id: 'lobbyguard', conv: 'lobbyguard', ai: 'static', dir: 1 }),
      q: exitTo('fatco_hq', 'elevator', { w: 2, when: () => F.h1done, no: 'Elevator locked. "HQ is on lockdown until the island is secure."' }),
      l: light(5, .7),
      f: [door({ id: 'front', lock: 1, str: .65, name: 'PEDESTAL FRONT DOOR', team: 'ppf' }), exitTo('statue_base', 'front')],
      e: [door({ id: 'side', lock: 1, pick: 0, code: '0451', name: 'SERVICE DOOR', metal: 1 }), exitTo('statue_base', 'side')],
      k: keypad('0451', 'side', { label: 'SERVICE DOOR KEYPAD' }),
      w: [{ tile: T_VENT }, exitTo('statue_base', 'hatch')],
      r: npc('ppfr', { dir: 3, look: .6 }), p: npc('ppf', { dir: 0, look: .4 }), G: npc('ppf', { dir: 2, look: .4 }),
      n: npc('ppf', { route: 'r1' }), m: npc('ppfr', { route: 'r2' }),
      u: npc('ppf', { dir: 2, look: 1, conv: 'ppf_surrender' }),
      c: comp([['manager', 'giftshop', { mail: ['mi_m1'] }]], { c: { hackStr: .2 } }),
      o: door({ id: 'office', lock: 1, str: .35, name: 'GIFT SHOP OFFICE' }),
      t: comp([['maint', '0451', { mail: [] }]], { c: { hackStr: .1 } }),
      d: reader('mi_cube1', { p: 'cone', label: 'DATACUBE', hidden: 0 }),
      i: reader('mi_cube3', { p: 'cone', label: 'DATACUBE' }),
      j: pr('generator'),
      z: warpPart(1),
      E: reader('mi_sign'),
    },
    routes: { r1: '1,2,3,4', r2: '5,6', r3: '7,8' },
    ents: [
      pr('statue', { x: 34, y: 19, zb: TH * 7 }), reader('mi_plaque', { p: 'sign', x: 35, y: 16, label: 'BRONZE PLAQUE' }),
      reader('mi_news1', { p: 'trash', x: 12, y: 22, label: 'NEWSPAPER' }),
      reader('mi_bigl1', { p: 'bookshelf', x: 5, y: 24, label: 'PAPERBACKS' }),
      Object.assign(pr('locker', { x: 5, y: 16, items: [['aug', 1], ['biocell', 2]], locked: 1, str: .3, label: 'OFFICE SAFE' }), { onSearch: () => { const it = P.inv.find(i => i.id === 'aug' && !i.slot); if (it) { it.slot = 'legs'; it.pair = AUG_PAIRS.legs; } } }),
      pr('crate', { x: 63, y: 25, items: [['multitool', 1], ['a_10mm', 1]] }),
      pr('locker', { x: 64, y: 16, items: [['lockpick', 2], ['soda', 1]] }),
      pr('dumpster', { x: 57, y: 28, items: [['a_shell', 1], ['w_shotgun', 1]] }),
      npc('ppf', { route: 'r3' }),
      item('medkit', 1, { x: 46.5, y: 36.5 }), item('a_10mm', 1, { x: 21.5, y: 33.5 }), item('candy', 1, { x: 30.5, y: 37.5 }),
      spawnPt('front_out', Math.PI / 2, { x: 35, y: 29 }), spawnPt('side_out', 0, { x: 45, y: 22 }), spawnPt('hatch_out', Math.PI, { x: 25, y: 21 }), spawnPt('elevator', Math.PI / 2, { x: 35, y: 5 }),
      trig(async () => { if (!F.metPX) await startConv('pilotx_dock', find('pilotx')); }, { x: 33, y: 39, w: 6, h: 3, when: () => !F.metPX }),
      trig(() => { infolink('YOKO', 'That\'s the P.P.F. perimeter. Guards on the south gate. If you stay in the dark and keep low they won\'t see you. The eye on your HUD shows how visible you are.'); }, { x: 30, y: 34, w: 12, h: 2 }),
      trig(() => { chatSay('the A.S.S. part is on the sandbar', 1, 'm4ndolin'); }, { x: 55, y: 36, w: 10, h: 4 }),
    ],
    first(M) { infolink('PILOTX', 'Over here, little brother. End of the dock.'); },
    enter(M, first) { if (F.h1done) { for (const e of M.ents) if (e.k === 'npc' && e.team === 'ppf') { e.team = 'civ'; e.ai = 'civ'; e.state = 'idle'; e.wpn = null; } } },
  });
}
// ---------- MAP: the statue base (storage, museum hall, security, infirmary) ----------
{
  const g = mk(44, 20, '$');
  g.fill(1, 9, 42, 10, '.');                 // museum hall
  g.fill(1, 1, 8, 7, ':'); g.put(4, 8, '+');  // storage A (pills)
  g.fill(10, 1, 6, 7, ':'); g.put(12, 8, 'j'); // storage B (HU-MAN)
  g.fill(17, 1, 11, 7, '.'); g.fill(21, 8, 2, 1, '.'); // stairwell
  g.fill(29, 1, 6, 7, ','); g.put(31, 8, 'o');   // security office
  g.fill(36, 1, 7, 7, ':'); g.put(39, 8, '+');   // infirmary
  g.put(9, 3, 'v'); g.put(16, 2, 'v'); g.put(1, 4, 'w');
  g.stamp(1, 1, `
........
........
......K.
.......K
K.......
.K.K....
........`);
  g.stamp(10, 1, `
......
..h...
......
.N....
......
....K.
......`);
  g.stamp(17, 1, `
...ss......
...........
.........I.
.I.........
...........
.....r.....
...........`);
  g.stamp(29, 1, `
D.....
...c..
......
......
.N...d
......
......`);
  g.stamp(36, 1, `
Z.Z.Z..
.......
..y....
.......
Z.....P
.......
.S.....`);
  g.stamp(1, 9, `
.........................................
.......I.......I..........I.......I......
...........E......E.....E......E.........
.........................................
..p........H........p........H...........
.........................................
.......I.......I..........I.......I......
...Q.......................p.......Q.....
.........................................
.........................................`);
  g.put(21, 19, 'f'); g.put(22, 19, 'f'); g.put(43, 14, 'e'); g.put(42, 14, '.');
  g.put(10, 12, '1'); g.put(33, 12, '2'); g.put(33, 16, '3'); g.put(10, 16, '4'); g.put(20, 14, 'n'); g.put(0, 4, 'w');   // the hatch vent back out to the island
  defMap('statue_base', { name: 'STATUE BASE', title: 'STATUE OF LINDA-TY', sub: 'BASE: MUSEUM AND STORAGE', hub: 'mall', music: 'night', f: ['marble', 'carpet', 'concrete'], w: ['stone', 'concrete'], amb: .2, shadow: '#080410',
    grid: g.str(),
    key: {
      j: door({ id: 'storageB', lock: 1, str: .3, key: 'storageB', name: 'STORAGE B' }),
      o: door({ id: 'secoffice', lock: 1, str: .2, name: 'SECURITY OFFICE' }),
      w: [{ tile: T_VENT }, exitTo('mall_island', 'hatch_out')],
      f: exitTo('mall_island', 'front_out'), e: exitTo('mall_island', 'side_out'),
      s: exitTo('statue_crown', 'down'),
      p: npc('ppf', { dir: 1, look: .7 }), n: npc('ppfr', { route: 'r1' }),
      r: npc('ppfr', { id: 'rook', name: 'LIEUTENANT ROOK', dir: 1, look: .5, onDown: () => {}, keyOnBody: ['storageB', 'STORAGE B KEY'] }),
      h: npc('civ', { id: 'human', name: 'HU-MAN (TIED UP)', sprite: 'humanunit', port: 'HUMAN', conv: 'human_tied', ai: 'static', team: 'fatco', invuln: 1, dir: 1 }),
      y: npc('civ', { id: 'dani', name: 'P.P.F. MEDIC DANI', sprite: 'ppf2', port: 'ppf2', conv: 'dani', ai: 'static', dir: 2 }),
      d: reader('mi_cube2', { p: 'cone', label: 'DATACUBE' }),
      c: seccomp([['DOCENT', 'TORCH', { mail: ['mi_m2'], special: [['Lobby camera: OFF', () => { const c = P.map.ents.find(e => e.k === 'cam'); if (c) { c.off = 1; return 'Camera disabled.'; } }, () => P.map.ents.some(e => e.k === 'cam' && !e.off)]] }], ['l.propp', 'pharmacy', { mail: ['mi_m3'] }]], { c: { hackStr: .3, team: 'ppf' } }),
      E: reader('mi_museum'),
    },
    routes: { r1: '1,2,3,4' },
    ents: [
      spawnPt('front', -Math.PI / 2, { x: 21, y: 17 }), spawnPt('side', Math.PI, { x: 41, y: 14 }), spawnPt('hatch', 0, { x: 2, y: 4 }), spawnPt('up', Math.PI / 2, { x: 21, y: 3 }),
      cam(Math.PI / 2, { x: 21.5, y: 9.2, team: 'ppf', range: 9, sweep: 1 }),
      light(6, .7, { x: 6, y: 12 }), light(6, .7, { x: 21, y: 12 }), light(6, .7, { x: 36, y: 12 }), light(5, .5, { x: 21, y: 17 }), light(4, .5, { x: 4, y: 3 }), light(4, .6, { x: 39, y: 3 }), light(3, .5, { x: 31, y: 3 }), light(4, .5, { x: 22, y: 4 }),
      reader('mi_museum2', { p: 'sign', x: 30, y: 11 }), reader('mi_news1', { p: 'trash', x: 40, y: 17, label: 'NEWSPAPER' }),
      pr('crate', { x: 1, y: 1, items: [['pills', 3]], label: 'PROP PILLS CRATE' }), pr('crate', { x: 3, y: 1, items: [['pills', 2], ['medkit', 1]], label: 'PROP PILLS CRATE' }), pr('crate', { x: 5, y: 1, items: [['pills', 2]], label: 'PROP PILLS CRATE' }), pr('crate', { x: 7, y: 1, items: [['joint', 2]], label: 'PROP PILLS CRATE' }),
      pr('mcrate', { x: 15, y: 6, items: [['a_tdart', 1], ['biocell', 1]] }),
      npc('buffered', { x: 36, y: 2, ai: 'static', name: 'BUFFERED PATIENT', dir: 1 }), npc('buffered', { x: 38, y: 2, ai: 'static', name: 'BUFFERED PATIENT', dir: 1 }),
      item('a_10mm', 1, { x: 7.5, y: 6.5 }), item('lockpick', 1, { x: 33.5, y: 3.5 }), item('soda', 1, { x: 19.5, y: 6.5 }),
      trig(() => { infolink('YOKO', 'There\'s a camera covering the hall. Cameras on the P.P.F. net will set off an alarm if they see you. A security terminal could switch it off, or a multitool.'); }, { x: 15, y: 15, w: 14, h: 4 }),
      trig(() => { if (!F.humanFreed) infolink('PILOTX', 'HU-MAN\'s in storage B. The lieutenant by the stairs has the key. Or there\'s always a vent.'); }, { x: 1, y: 9, w: 14, h: 4 }),
    ],
    enter(M, first) { if (F.humanFreed) { const h = M.ents.find(e => e.id === 'human'); if (h) removeEnt(M, h); } if (F.h1done) { for (const e of M.ents) if (e.k === 'npc' && e.team === 'ppf') { e.team = 'civ'; e.ai = 'civ'; e.wpn = null; e.state = 'idle'; } } },
  });
}
// ---------- MAP: inside the statue (switchback stairs up to the torch) ----------
{
  const g = mk(24, 18, '$');
  g.stamp(0, 0, `
$$$$$$$$$$$$$$$$$$$$$$$$
$WWWWWWWWWWWWWWWWWWWWWW$
$......................$
$..p.......l.......p...$
$.........i............$
$$$$.$$$$$$$$$$$$$$$$$$$
$......................$
$.K.......q........K...$
$$$$$$$$$$$$$$$$$$$$.$$$
$......................$
W..O.....i...........O.W
$$.$$$$$$$$$$$$$$$$$$$$$
$......................$
$.......K......M.......$
$$$$$$$$$$$$$$$$$$$$.$$$
$......................$
$..ss.....i.......n....$
$$$$$$$$$$$$$$$$$$$$$$$$`);
  defMap('statue_crown', { name: 'STATUE INTERIOR', title: 'STATUE OF LINDA-TY', sub: 'INTERIOR: THE CLIMB', hub: 'mall', music: 'night', f: ['metal', 'metal'], w: ['stone'], amb: .16, shadow: '#000a08',
    grid: g.str(),
    key: { s: exitTo('statue_base', 'up', { w: 1 }), p: npc('ppfr', { dir: 1, look: .6, conv: 'ppf_surrender' }), q: npc('ppf', { dir: 0, look: 1.2 }), n: npc('ppf', { dir: 2, look: 1 }), l: npc('ppf', { id: 'leo', name: 'COMMANDER LEO PROPP', port: 'ppf', conv: 'leo', wpn: null, ai: 'static', team: 'civ', dir: 1, invuln: 1 }), i: light(5, .6) },
    ents: [spawnPt('down', -Math.PI / 2, { x: 5, y: 16 }), item('medkit', 1, { x: 21.5, y: 12.5 }), item('a_762', 1, { x: 3.5, y: 9.5 }), pr('crate', { x: 8, y: 13, items: [['biocell', 1], ['a_10mm', 1]] }),
      trig(async () => { const l = find('leo'); if (l && !F.leo) await startConv('leo', l); }, { x: 4, y: 2, w: 16, h: 3, when: () => !F.leo && !P.map.ents.some(e => e.k === 'npc' && e.team === 'ppf' && !e.dead && !e.down && e.state === 'combat') })],
  });
}

// login sources (QA pass 2026-10-14)
txt('mi_giftnote', 'STICKY NOTE', 'GIFT SHOP TERMINAL\nmanager / giftshop\n\nIf you are reading this you are the new manager. Congratulations. The old manager is a ghost now, he says.', { login: ['manager', 'giftshop'] });
MAPS.mall_island.ents.push(reader('mi_giftnote', { p: 'cone', x: 8, y: 16, label: 'STICKY NOTE' }));
