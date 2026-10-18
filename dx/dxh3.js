'use strict';
// ================= HUB 3: THE LOT (Battery Park + Hell's Kitchen) =================
// The Mall of the Future's endless parking lot, where the Buffered live in tents between the wrecks. Carl's ship is parked in space 218.
HUBS.lot = {
  name: 'THE LOT',
  down(M, e, killed) { if (e.hostage) F.hostageDead = (F.hostageDead || 0) + 1; checkLotGoals(); },
  tick(M) { if (frame % 60 === 0) checkLotGoals(); },
};
function lotGoalsDone() { return goalIsDone('lot_station') && goalIsDone('lot_motel') && (goalIsDone('lot_tx') || F.tx === 'running'); }
function checkLotGoals() {
  if (!P || !P.map || F.night) return; const M = P.map;
  if (M.id === 'lot_station' && !goalIsDone('lot_station') && !M.ents.some(e => e.k === 'npc' && e.team === 'ppf' && !e.dead && !e.down && !e.gone)) { goalDone('lot_station', 500); F.station = F.station || 'cleared'; infolink('YOKO', 'Station\'s clear. The hostages are walking out. Nice work, Carl.'); }
  if (M.id === 'lot_motel' && !goalIsDone('lot_motel') && !M.ents.some(e => e.k === 'npc' && e.team === 'ppf' && !e.dead && !e.down && !e.gone)) { goalDone('lot_motel', 500); F.motel = F.hostageDead ? 'bloody' : 'clean'; infolink('PILOTX', F.hostageDead ? 'The motel\'s clear. Not everyone walked out.' : 'Motel\'s clear. Everyone walked out. That\'s rarer than it should be.'); for (const e of M.ents) if (e.hostage && !e.dead) { e.state = 'idle'; e.talk = ['Thank you. Thank you.', 'Are they gone?', 'They weren\'t... they weren\'t cruel. They just needed the motel.']; } }
  if (lotGoalsDone() && !F.lotDone) { F.lotDone = 1; setTimeout(async () => { await infolink('FACE', 'Agent Denton. Excellent. A new lead: P.P.F. founder "Doc Proper" is hiding at Pretend Air, the freight airfield northeast of the Lot. Robo Mall Cop will meet you there.'); goal('air_doc', 'Go to Pretend Air (road northeast of the Lot) and find Doc Proper.'); await infolink('YOKO', 'The airfield road is open. East edge of the Lot, past the motel.'); }, 600); }
}

// ---------- texts ----------
txt('lot_218', 'PARKING SIGN', 'SPACE 218\nRESERVED: COMPACT\n\n(Underneath, in very small marker: "CARL IS 218" and then, in different marker, "THAT\'S NOT HIS AGE" and then, in Carl\'s handwriting, "STOP WRITING ON MY SIGN.")');
txt('lot_news2', 'THE MIDNIGHT PRETEND', 'LOT POPULATION DOUBLES\n\nThe Mall of the Future\'s parking lot, now home to an estimated 9,000 Buffered and their families, has been designated a "Temporary Lifestyle Zone" by Fascism Inc. Residents may remain as long as they continue not to enter the mall.\n\nGATEBOX: "COMPANIONSHIP IS CARE"\n\nGatebox, makers of the popular AI companion in a cylinder, announced free trial subscriptions for Buffered households. "Your loved one may not be able to finish a sentence," said a spokesperson. "But she can."');
txt('lot_graffiti', 'GRAFFITI', 'Spray-painted across a wrecked van:\n\nTWO PILLS EVERY SIX HOURS\nTHEY KNOW IT WORKS\nASK THE STATUE\n\nAnd, smaller, in a different color:\n\nTHE PARCEL IS STILL IN TRANSIT');
txt('lot_ppfcube1', 'DATACUBE', 'Roof terminal: SPARKY / ANTENNA. Don\'t change it, Sparky, I swear to god.\n\nIf FATCO comes, kill the transmitter yourself before they get it. We can rebuild a transmitter. We can\'t rebuild you.', { login: ['sparky', 'antenna'], note: 'Garage roof terminal: SPARKY / ANTENNA' });
txt('lot_ppfcube2', 'DATACUBE', 'Station back door is the maintenance hatch in the sewer tunnel, under the bar. Keypad 2318. The front is ours; the back is the rats\'.\n- Kay', { code: '2318', note: 'Monorail station maintenance keypad (sewers): 2318' });
txt('lot_motelcube', 'DATACUBE', 'Hostages in the lobby and room 3. If FATCO comes in loud, make it look serious. DON\'T actually hurt anyone, Pete. Pete. I mean it. Pete.', { onRead: () => { F.motelWarn = 1; } });
txt('lot_bigl3', 'THE BIG LITTER, Chapter 3', 'THE BIG LITTER\nChapter Three: A Dame Named Monday\n\nShe came back on a Monday. Of course she did. Everything bad comes back on a Monday.\n\n"You found him," she said.\n\n"I found a man who looks like him," I said. "He\'s been buffering since October. He started a sentence about you and never finished it."\n\nShe sat down hard. "What was the sentence?"\n\n"Lady," I said, "if I knew how sentences ended, I wouldn\'t be in this line of work."\n\nI didn\'t tell her the rest: that the mall had a whole floor of men like him. That somebody was selling them company. That I\'d had a lasagna once that was better company than most people, and I\'d eaten it, and that\'s the job.', { onRead: () => { if (!F.bigl3) { F.bigl3 = 1; giveSP(50, 'reading'); } } });
txt('ass_mirror', 'MIRROR', () => pick(['Carl looks at himself.\n\n"Normal guy. Normal head. It\'s a big head. Lots of people have big heads. Chat, name one person with a head this— don\'t. Don\'t name anyone."', 'Carl checks his teeth. He has the expected number of teeth for a person, which is a number he chose not to look up.', '"Ears are under the hat. That\'s where people keep them. In the hat."']));
txt('ass_blanket', 'RED BLANKET', 'A red wool blanket with a yellow hammer and sickle on it, worn soft.\n\nCarl doesn\'t know where it came from. It was in the ship when he first remembers the ship.\n\n"Maybe my people were space communists. I don\'t know. Maybe somebody just liked the colors. It\'s a nice blanket. It\'s warm. That\'s not a political position, it\'s a blanket."');
txt('ass_log', 'A.S.S. FLIGHT LOG', () => 'ALIEN STARSHIP - FLIGHT LOG\n\nLAST FLIGHT: [CORRUPTED]\nCURRENT LOCATION: SPACE 218, THE LOT, NEVADA\nWARP ASSEMBLY: ' + warpCount() + '/7 COMPONENTS\nSTATUS: ' + (warpCount() >= 7 ? 'READY' : 'GROUNDED') + '\n\nThe log has one more entry, written in a script Carl recognizes and can\'t read. When he stops trying to read it, he can read it:\n\n"STILL IN TRANSIT."\n\n(Parts of Carl\'s ship turn up in strange places. Someone took the warp assembly apart and scattered it. Find all seven.)');
txt('lot_bar_menu', 'MENU', 'THE LITTER BOX\nEST. WHENEVER\n\nBEER .............. P$5\nMALT LIQUOR ....... P$6\nTUNA MELT ......... P$8\nLASAGNA ........... ask\nINFORMATION ....... ask nicely\n\nNO SMOKING (JB is exempt) (JB is the owner)');
mail('lot_mm1', 'Lou', 'front.desk', 'Room 7', 'Room 7 is paid through the end of the month in cash by a gentleman in red glasses who asked that we "not take his name." I told him we need a name for the register. He said "write X." I wrote X.');
mail('lot_mm2', 'Sandy', 'front.desk', 'grandma', 'Dad, the people from the P.P.F. brought grandma two more pills. She asked about the weather today. She finished the sentence. She said "it\'s nice." I know they\'re terrorists. I just wanted you to know she finished it.');
mail('lot_gm1', 'Sparky', 'ppf.lot', 'The broadcast', 'Pirate stream is up. We\'re broadcasting the warehouse map: every place in Nevada where Pretend Co. is sitting on recalled pills. The Buffered can\'t come to us, so we tell them where to go. If they shut us down I\'m putting it up again from the motel roof.');

// ---------- conversations ----------
defSpeaker('KAY', { name: 'SERGEANT KAY', col: hex('#e0a060'), voice: [520, 40], port: 'ppf2' });
defSpeaker('FLO', { name: 'FLORENCE', col: hex('#ffc0c0'), voice: [760, 30], port: 'civ4' });
defSpeaker('RICO', { name: 'RICO', col: hex('#e08060'), voice: [300, 40], port: 'thug' });
defSpeaker('JOEY', { name: 'JOEY', col: hex('#c0e0ff'), voice: [1100, 60], port: 'civ1' });
defSpeaker('LOU', { name: 'LOU', col: hex('#d0c0a0'), voice: [280, 30], port: 'civ3' });
defSpeaker('SANDY', { name: 'SANDY', col: hex('#ffd0a0'), voice: [900, 40], port: 'civ4' });
defSpeaker('SPARKY', { name: 'SPARKY', col: hex('#ffe060'), voice: [640, 80], port: 'civ6' });
defSpeaker('GARY', { name: 'GARY', col: hex('#a0a0c0'), voice: [300, 120], port: 'civ3' });
defSpeaker('HOTDOG', { name: 'HOT DOG MAN', col: hex('#ffb060'), voice: [420, 30], port: 'civ5' });
CONV.px_lot = async (e) => {
  await T('PILOTX', 'Little brother. Welcome to the Lot.');
  await T('CARL', 'I live here. I\'ve lived here for— my ship\'s in space two-eighteen.');
  await T('PILOTX', 'I know.');
  await T('CARL', 'How do you— spoilers. Right. Okay.');
  await T('PILOTX', 'Three jobs. The station, the motel, the transmitter. Any order. There\'s a bar in the middle of the Lot, the Litter Box. JB Garfield runs it. He hears things. Some of them are true.');
  await T('PILOTX', 'And Carl. The people in the tents. Those are the Buffered. Look at them on your way. That\'s all I\'m asking. Just look.');
  const c = await C(['Where are you going?', 'Why do you care so much about the Buffered?', 'Okay.']);
  if (c === 0) { await T('PILOTX', 'Errands.'); await T('CARL', 'What kind of errands?'); await T('PILOTX', 'The kind you\'ll find out about.'); await T('CARL', 'You know I hate that. You know I specifically hate that.'); }
  if (c === 1) { await T('PILOTX', 'Because I remember a version of this where nobody looked. I\'d like to try the other version.'); await T('CARL', '"Remember a version." What does that mean? Are you from the future? Is that the thing?'); await T('PILOTX', 'Spoilers.'); }
  e.conv = 'px_lot2'; F.pxLot = 1;
  setTimeout(() => { if (P.map.id === 'lot_streets') { const px = find('pilotx_lot'); if (px) { px.ai = 'civ'; px.state = 'flee'; px.threat = P; px.fleePt = [40, 2]; setTimeout(() => { const q = find('pilotx_lot'); if (q) removeEnt(P.map, q); }, 6000); } } }, 200);
};
CONV.px_lot2 = async () => { await T('PILOTX', 'Station, motel, transmitter. And look.'); };
CONV.jb = async (e) => {
  if (!e.met) {
    await T('N', 'The bartender is a large orange cat in a trench coat. He is not tending the bar. He is sitting at it, the way a fixture sits at a fixture.');
    await T('JB', 'The kid walked in like he owned the place. He didn\'t. I own the place. It\'s a lease.');
    await T('CARL', 'Are you... narrating? Out loud?');
    await T('JB', 'Somebody has to. The name\'s JB Garfield. I\'m a detective.');
    await T('CARL', 'You\'re a cat.');
    await T('JB', 'I\'m a detective who happens to be a cat, the way you\'re an agent who happens to be short.');
    await T('CARL', 'I\'m not— okay. Okay. That\'s fair. That\'s actually fair.');
  }
  const c = await C(['What do you sell?', 'Heard anything about the P.P.F.?', { t: 'Got any cases?', if: () => !F.jbCase }, { t: 'About your case: I found Gary.', if: () => F.jbCase === 1 && F.garyFound }, { t: 'What do you know about Pilot X?', if: () => F.pxLot }, 'See you, JB.']);
  if (c === 0) { await shopUI({ name: 'THE LITTER BOX (BACK ROOM)', items: [['lockpick', 25, 6], ['multitool', 35, 5], ['medkit', 40, 4], ['biocell', 35, 4], ['a_10mm', 15], ['a_762', 25], ['a_tdart', 35, 3], ['w_spistol', 350, 1], ['w_crowbar', 40, 1], ['w_gasnade', 120, 2], ['w_empnade', 150, 1], ['joint', 10, 10], ['liquor', 6, 10], ['mod_sil', 280, 1]] }, e); }
  else if (c === 1) {
    await T('JB', 'The P.P.F. in the station are Kay\'s crew. Kay\'s smart. She\'s got the front covered and she thinks the back\'s covered by rats. There\'s a maintenance hatch in the sewer under this bar. Code\'s on a datacube somewhere in her crew. Or ask the rats.');
    await T('JB', 'The motel crew are jumpy. Kids, mostly. If you go in loud, somebody gets hurt who shouldn\'t. Go in quiet.');
    await T('JB', 'The transmitter\'s on the garage roof. Sparky built it out of a microwave and a grudge. He\'s not a fighter. Talk to him before you shoot him. You\'d be surprised what a person says when you don\'t shoot them.');
    addNote('JB: the station has a back door from the sewers under the Litter Box (keypad). The motel crew are jumpy: go in quiet. Sparky on the garage roof isn\'t a fighter.');
  }
  else if (c === 2) { await T('JB', 'There\'s always a case. A woman came in Tuesday. Her husband Gary walked out of the clinic tent a week ago. Buffered. Can\'t finish a sentence. Can still walk. They walk, kid. They walk until something stops them.'); await T('JB', 'Last anybody saw, he was heading for a manhole. Find Gary. She pays in lasagna. I pay in information.'); F.jbCase = 1; goal('lot_gary', 'Find Gary, the Buffered man who wandered into the sewers.', 1); }
  else if (c === 3) { await T('JB', 'You found him.'); await T('CARL', 'He was down there with the rats. He was trying to say something about a lasagna. I walked him back to the clinic.'); await T('JB', '...The dame\'s gonna cry. Here. Information, as promised.'); await T('JB', 'Pretend Air. The freight field northeast. There\'s a crashed blimp in hangar three. Somebody\'s living in it who used to run a pharmacy. That\'s free. This is the part that costs: whoever sent you, kid, also sent someone else.'); F.jbCase = 2; goalDone('lot_gary', 300); giveItem('mod_acc'); F.jbTip = 1; }
  else if (c === 4) { await T('JB', 'Red glasses. Comes in, orders a water, tips like a man who knows the end of the movie. Sat in that booth for an hour last night with Kay from the P.P.F.'); await T('CARL', 'With— with the P.P.F.? Like, interrogating her?'); await T('JB', 'Kid, I\'m a detective. I know what an interrogation looks like. That was a meeting.'); F.jbPX = 1; }
};
CONV.florence = async (e) => {
  if (!e.met) { await T('FLO', 'Hi. Sorry. I\'m Florence. I\'m not a nurse. I was a dental hygienist. Now I\'m the clinic.'); await T('FLO', 'I have aspirin, a playlist, and forty-one people who can\'t finish a sentence.'); }
  const n = invCount('pills');
  const c = await C([{ t: 'I have Prop Pills. Take them. (give ' + Math.min(n, 3) + ')', if: () => n > 0 && !F.floPills }, 'What do you need?', 'Is there anything I can do?', 'Bye.']);
  if (c === 0) { const it = invFind('pills'); const k = Math.min(3, it.n || 1); removeItem(it, k); F.floPills = k; await T('FLO', '...Oh my god. Oh my god. Where did you— no. Don\'t tell me. Two every six hours. Mrs. Okafor first. She\'s been holding the same word for a month.'); await T('N', 'A minute later, from somewhere in the tents, an old woman finishes a word. It\'s "Sunday."'); giveSP(300, 'kindness'); chatSay('SUNDAY', 1); chatSay('im not crying', 1); chatSay('carl...', 1); F.clinicHelped = 1; }
  else if (c === 1) { await T('FLO', 'Prop Pills. Pretend Co. recalled them, the P.P.F. steals them, FATCO arrests anyone who has them. I\'d take them from anybody. I\'d take them from you.'); }
  else if (c === 2) { await T('FLO', 'Gary wandered off. Mrs. Garcia\'s husband. JB at the Litter Box is "on the case." If you find him, walk him home. They follow you if you talk to them slow.'); }
};
CONV.joey = async (e) => { await T('JOEY', F.rico === 'gone' ? 'Thanks, mister. They took my grandpa\'s pills before. Now they can\'t.' : 'Mister. They want my grandpa\'s pills. Please.'); };
CONV.rico = async (e) => {
  await T('RICO', 'Keep walking, little man. This is business.');
  const c = await C(['Leave the kid alone.', { t: 'I\'m a FATCO agent. A grown human man with a card and a gun and a very bad night.', req: ['denial', 1] }, 'Here. 50 credits. Go away.', 'Walk away.']);
  if (c === 0) { await T('RICO', 'Or what?'); await T('CARL', 'Or... I don\'t know! I don\'t have the "or" yet! I was hoping you\'d just leave!'); await T('RICO', 'Get him, boys.'); for (const t of P.map.ents) if (t.k === 'npc' && t.team === 'thug') { t.hostile = 1; t.state = 'combat'; t.target = P; } }
  else if (c === 1) { await T('CARL', 'Look at the card. Look at it. HUMAN. Laminated. Do you know what it takes to get something like this laminated? I\'m having the worst night of my life and it\'s TWO A.M.'); await T('RICO', '...Man, okay. Okay. It\'s not worth it. C\'mon.'); F.rico = 'gone'; for (const t of P.map.ents.filter(t => t.k === 'npc' && t.team === 'thug')) removeEnt(P.map, t); giveSP(150, 'denial'); goalDone('lot_joey', 200); chatSay('DENIAL WORKS', 1); }
  else if (c === 2) { if (P.cred >= 50) { P.cred -= 50; await T('RICO', 'Pleasure doing business, short stuff.'); F.rico = 'gone'; for (const t of P.map.ents.filter(t => t.k === 'npc' && t.team === 'thug')) removeEnt(P.map, t); goalDone('lot_joey', 100); } else await T('RICO', 'You don\'t have fifty. You don\'t have anything. Keep walking.'); }
};
CONV.hotdog = async (e) => { if (!e.met) await T('HOTDOG', 'Hot dogs! Soy dogs! Dogs of unknown origin!'); await shopUI({ name: 'HOT DOG CART', items: [['candy', 4], ['chips', 4], ['soda', 3], ['liquor', 6]] }, e); };
CONV.busker = async () => { await T('N', 'A man with a guitar is playing a song about the mall. The chorus is just "the mall" over and over. It\'s pretty good.'); chatSay('the mall', 1); chatSay('THE MALL', 1); };
CONV.cop_lot = async () => { await T('FATCO', pick(['The Lot\'s a Temporary Lifestyle Zone, agent. We don\'t go past the checkpoint.', 'You live here? In the ship? The weird ship?', 'P.P.F. at the station, the motel, the garage. Have fun.'])); };

// ---------- the streets ----------
{
  const W2 = 98, H2 = 64, g = mk(W2, H2, ':');
  // the mall's back wall along the north, its loading docks and dead neon
  g.fill(0, 0, W2, 3, '#'); for (let x = 6; x < W2 - 4; x += 11) g.put(x, 2, 'n');
  // parking stripes and lamp grid
  for (let y = 6; y < H2 - 4; y += 7) for (let x = 14; x < W2 - 6; x += 3) g.put(x, y, ';');
  for (let y = 8; y < H2 - 4; y += 12) for (let x = 16; x < W2 - 6; x += 14) g.put(x, y, 'L');
  // the FATCO motor pool (west): fence, booth, checkpoint
  g.rect(0, 3, 12, 16, '=', '.'); g.fill(11, 9, 1, 3, '.'); g.fill(0, 9, 1, 3, 'h'); g.stamp(2, 4, `
%%%%.
%D.%.
%..+.
%%%%.`); g.put(9, 7, 'L'); g.put(9, 14, 'L'); g.put(6, 16, 'K'); g.put(7, 16, 'K');
  // the clinic tents (center-west)
  for (const [x, y] of [[18, 18], [22, 18], [26, 18], [18, 23], [26, 23], [30, 20]]) g.put(x, y, 't');
  g.fill(21, 22, 4, 3, '.'); g.put(23, 23, 'F');
  // the A.S.S. in space 218 and its sign
  g.put(30, 33, 'a'); g.put(29, 32, 'E'); g.put(32, 35, 'e');
  // the cart corral (north center)
  g.rect(40, 6, 16, 12, '=', '.'); g.fill(47, 17, 3, 1, '.'); g.put(44, 9, 'K'); g.put(51, 9, 'K'); g.put(45, 13, 'F');
  // the Litter Box
  g.stamp(58, 21, `
%%%%%%%%%%%%%
%...........%
%...........%
%...........%
%...........%
%...........%
%...........%
%...........%
%%%%%%e%%%%%%`);
  g.fill(59, 22, 11, 7, '%'); g.put(64, 29, 'B');
  // the Lot Motel (northeast), drained pool
  g.rect(72, 4, 24, 14, '%'); g.fill(73, 17, 22, 1, '%'); g.put(83, 17, 'm'); g.put(84, 17, 'm');
  for (let x = 74; x < 95; x += 4) g.put(x, 17, 'W');
  g.rect(75, 21, 12, 7, '=', ','); g.fill(76, 22, 10, 5, '`'); g.put(80, 21, '.'); g.put(87, 23, 'L');
  // the parking garage (southeast)
  g.rect(60, 40, 34, 20, '#'); g.fill(60, 48, 1, 3, 'g'); for (let x = 63; x < 93; x += 5) g.put(x, 40, 'W');
  // the monorail station (southwest) and the elevated track
  g.rect(4, 42, 22, 14, '#'); g.fill(13, 42, 3, 1, 's'); for (let x = 6; x < 25; x += 4) g.put(x, 55, 'W');
  g.fill(0, 59, W2, 2, '='); for (let x = 2; x < W2; x += 8) g.put(x, 58, 'I');
  // manholes, wrecks, cars, barrels, crates, kiosk, brush strips
  g.put(36, 40, 'o'); g.put(90, 33, 'j');
  for (const [x, y] of [[16, 9], [24, 9], [34, 12], [18, 30], [38, 26], [46, 22], [52, 30], [16, 38], [30, 47], [34, 51], [44, 44], [50, 52], [38, 54], [68, 34], [78, 36]]) g.put(x, y, 'c');
  for (const [x, y] of [[20, 12], [37, 18], [56, 36], [41, 36], [29, 44], [47, 49], [54, 57]]) g.put(x, y, 'F');
  for (const [x, y] of [[33, 9], [12, 30], [55, 12], [70, 12], [45, 38], [27, 52], [57, 44]]) g.put(x, y, 'U');
  g.fill(13, 25, 2, 9, 'b'); g.fill(36, 29, 6, 2, 'b'); g.fill(56, 18, 2, 4, 'b'); g.fill(88, 25, 4, 6, 'b'); g.fill(30, 56, 8, 2, 'b');
  g.put(44, 31, 'k'); g.put(57, 32, 'q'); g.put(26, 38, 'E'); g.put(66, 36, 'E');
  // airfield road (east edge)
  g.put(96, 28, 'r');
  // waypoints for the P.P.F. patrols near the station and garage
  g.put(28, 42, '1'); g.put(28, 56, '2'); g.put(58, 40, '3'); g.put(58, 58, '4'); g.put(66, 38, '5'); g.put(90, 38, '6');
  const grid = g.str();
  defMap('lot_streets', { name: 'THE LOT', title: 'THE LOT', sub: 'MALL OF THE FUTURE PARKING  -  03:40', hub: 'lot', music: 'lot', f: ['asphalt', 'concrete', 'parking', 'parking', 'tile'], w: ['concrete', 'brick'], amb: .1, shadow: '#04040c', mem: '#0a1028', out: 1,
    grid,
    key: {
      h: exitTo('fatco_hq', 'motorpool', { when: () => !F.signalSent, no: 'FATCO has locked the motor pool. They are not expecting you back. Not as a guest.' }), n: pr('neonlamp', { off: 0 }),
      t: pr('tent'), a: pr('ass', { id: 'ass', label: 'THE A.S.S. (YOUR SHIP)', frob: () => gotoMap('ass_inside', 'door') }), e: npc('civ', { ai: 'static', name: 'NEIGHBOR', sprite: 'civ5', talk: ['Hey Carl.', 'Nice coat. You get a job?', 'You were gone two nights. Somebody tried to sell your hubcaps. I said "that ship doesn\'t have hubcaps." He said "it does now."'] }),
      E: reader('lot_218', { p: 'sign' }),
      m: exitTo('lot_motel', 'front'), B: exitTo('litterbox', 'front'), g: exitTo('lot_garage', 'ramp'), s: exitTo('lot_station', 'front'),
      o: [pr('manhole'), exitTo('lot_sewers', 'manhole1', { frobbable: 1, label: 'MANHOLE (SEWERS)', verb: 'CLIMB DOWN' })], j: [pr('manhole'), exitTo('lot_sewers', 'manhole2', { frobbable: 1, label: 'MANHOLE (SEWERS)', verb: 'CLIMB DOWN' })],
      c: pr('wreck'), k: pr('kiosk', { id: 'hotdogcart' }), q: npc('civ', { id: 'busker', name: 'BUSKER', sprite: 'civ6', conv: 'busker', ai: 'static', dir: 1 }),
      r: exitTo('air_field', 'road', { w: 2, h: 6, when: () => F.lotDone || F.night, no: 'The airfield road. FATCO roadblock: "Closed until the Lot is secure."' }),
    },
    routes: { r1: '1,2', r2: '3,4', r3: '5,6' },
    ents: [
      spawnPt('motorpool', 0, { x: 2, y: 10 }), spawnPt('ass_out', Math.PI / 2, { x: 31, y: 36 }), spawnPt('motel_out', Math.PI / 2, { x: 83, y: 19 }), spawnPt('bar_out', Math.PI / 2, { x: 64, y: 31 }), spawnPt('garage_out', Math.PI, { x: 58, y: 49 }), spawnPt('station_out', -Math.PI / 2, { x: 14, y: 40 }),
      spawnPt('manhole1_out', 0, { x: 37, y: 41 }), spawnPt('manhole2_out', 0, { x: 91, y: 34 }), spawnPt('road', Math.PI, { x: 94, y: 31 }),

      npc('civ', { id: 'pilotx_lot', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'px_lot', ai: 'static', team: 'fatco', x: 5, y: 12, dir: 0, invuln: 1, cond: () => !F.pxLot }),
      npc('fatco', { x: 10, y: 8, ai: 'static', dir: 0, conv: 'cop_lot' }), npc('fatco', { x: 10, y: 13, ai: 'static', dir: 0, conv: 'cop_lot' }),
      npc('civ', { id: 'florence', name: 'FLORENCE', sprite: 'civ4', port: 'civ4', conv: 'florence', ai: 'static', x: 23, y: 21, dir: 1 }),
      npc('buffered', { x: 19, y: 21, ai: 'static', dir: 1 }), npc('buffered', { x: 25, y: 21, ai: 'static', dir: 1 }), npc('buffered', { x: 21, y: 26, wander: 3 }), npc('buffered', { x: 28, y: 25, wander: 2 }), npc('buffered', { x: 33, y: 22, ai: 'static', dir: 2 }),
      npc('civ', { x: 19, y: 15, wander: 4, sprite: 'civ2' }), npc('civ', { x: 30, y: 16, wander: 4, sprite: 'civ1' }), npc('civ', { x: 40, y: 27, wander: 5, sprite: 'civ3', talk: ['Spare a pill?', 'The mall\'s right there. I can see the food court. They won\'t let us in.', 'My wife\'s in a tent. She was mid-laugh when it happened. She\'s still laughing. Real slow.'] }),
      npc('civ', { x: 50, y: 34, wander: 4, sprite: 'civ2', talk: ['Is that a costume?', 'Are you one of the FATCO guys? You\'re short for one.', 'Somebody said there\'s an alien in space 218. I said "that\'s Carl, he\'s fine."'] }),
      npc('civ', { x: 46, y: 30, ai: 'static', sprite: 'civ5', name: 'HOT DOG MAN', port: 'civ5', conv: 'hotdog', dir: 1 }),
      npc('civ', { id: 'joey', name: 'JOEY', sprite: 'civ1', port: 'civ1', conv: 'joey', ai: 'static', x: 47, y: 12, dir: 1 }),
      npc('thug', { id: 'rico', name: 'RICO', port: 'thug', conv: 'rico', ai: 'guard', x: 46, y: 10, dir: 1, team: 'thug', cond: () => F.rico !== 'gone' }), npc('thug', { x: 49, y: 11, ai: 'guard', dir: 2, cond: () => F.rico !== 'gone' }), npc('thugg', { x: 45, y: 14, ai: 'guard', dir: 0, cond: () => F.rico !== 'gone' }),
      npc('ppf', { route: 'r1', cond: () => !F.station }), npc('ppfr', { x: 13, y: 39, dir: 3, look: .6, cond: () => !F.station }), npc('ppf', { x: 16, y: 39, dir: 3, look: .6, cond: () => !F.station }),
      npc('ppfr', { route: 'r2', cond: () => !F.tx }), npc('ppf', { route: 'r3', cond: () => !F.tx }), npc('ppf', { x: 59, y: 47, dir: 2, look: .5, cond: () => !F.tx }),
      reader('lot_news2', { p: 'trash', x: 40, y: 32, label: 'NEWSPAPER' }), reader('lot_graffiti', { p: 'sign', x: 52, y: 26, label: 'GRAFFITI' }),
      item('a_10mm', 1, { x: 34.5, y: 13.5 }), item('joint', 1, { x: 19.5, y: 33.5 }), item('medkit', 1, { x: 70.5, y: 37.5 }), item('lockpick', 1, { x: 22.5, y: 39.5 }), item('soda', 1, { x: 58.5, y: 14.5 }), item('candy', 1, { x: 86.5, y: 31.5 }), item('a_shell', 1, { x: 80.5, y: 38.5 }),
      pr('crate', { x: 87, y: 26, items: [['multitool', 1], ['biocell', 1]] }), pr('crate', { x: 39, y: 46, items: [['w_crowbar', 1]] }),
      trig(() => { if (!F.joeyHint) { F.joeyHint = 1; goal('lot_joey', 'Some thugs at the cart corral are shaking down a kid. (optional)', 1); } }, { x: 38, y: 4, w: 20, h: 16 }),
      trig(() => { infolink('YOKO', 'That\'s the monorail station. The P.P.F. have the front. JB might know another way in.'); }, { x: 4, y: 34, w: 22, h: 6 }),
      trig(() => { if (!F.tx) infolink('YOKO', 'Parking garage. The transmitter\'s on the roof, three levels up. Ramp entrance on the west side.'); }, { x: 54, y: 42, w: 6, h: 14 }),
    ],
    first(M) { },
    enter(M, first) { if (F.night && typeof nightLot === 'function') nightLot(M, first); },
  });
}
