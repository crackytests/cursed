'use strict';
// ================= DISK C (cont.): THE LADY NEVADA, THE MUSEUM, THE DRAINS, THE CLINIC, THE HOSPITAL =================

// ---------- the Lady Nevada ----------
txt('ship_log1', 'CAPTAIN\'S LOG', 'LADY NEVADA - LOG\n\nDay 1. Loaded one container at the Pretend Co. siding in Nevada. Customs did not inspect it. Customs did not come near it. One of the customs men was crying.\n\nDay 3. The men say the container is warm. It is in the cold hold. The men say it hums. It does not hum. I have put my ear on it. It does something else.\n\nDay 4. It breathes. Or it ticks. I go back and forth.');
txt('ship_log2', 'CAPTAIN\'S LOG', 'Day 6. Torres woke up with frost on him. Okafor will not wake up. Bell says he lost Tuesday. Not the day, the memory of it. He cannot find Tuesday anywhere.\n\nDay 7. The men think there is something aboard besides the box. Several somethings. Passengers who did not buy tickets. I have seen a tall blond man on the deck at night who is not on my manifest. He was looking at the box. He was weeping.\n\nDay 8. We dock tomorrow. I am going to sit by the box tonight and listen. Somebody has to know what\'s inside.');
txt('ship_log3', 'NOTE IN THE HOLD', 'the captain sat by it all night and in the morning he was smiling and he was gone, gone inside, like he went somewhere. we put him in his bunk. he is still smiling.\n\nit is not a box. its a door. we dont know which side we are on.');
txt('ship_manifest', 'CARGO MANIFEST', 'LADY NEVADA\nCARGO: 1 CONTAINER (SEALED)\nFROM: PRETEND CO. SIDING, NEVADA\nTO: NATURAL HISTORY MUSEUM OF LOS ANGELES (c/o THE COMMISSIONER)\nCONTENTS: 1 (ONE)\nSTATUS: STILL IN TRANSIT\n\nHandwritten: "c/o the Commissioner" has been crossed out. Next to it, also crossed out: "c/o Mr. White." Next to that, not crossed out, in a different hand: "c/o NOBODY. LEAVE IT SHUT."', { note: 'The Lady Nevada\'s manifest: the pod was addressed to the Commissioner, then to Mr. White, then someone wrote "c/o NOBODY. LEAVE IT SHUT."' });
CONV.jb_ship = async (e) => {
  if (!F.jbShip) { F.jbShip = 1;
    await T('N', 'A large orange cat in a fedora and a trench coat is standing in the hold looking at the empty space where something heavy used to be. He doesn\'t turn around.');
    await T('JB', 'The hold was cold. The crew was colder. The box was gone before the cops got here, which is the only thing about this case that made sense the moment I heard it.');
    await T('CARL', 'Are you narrating? Out loud? Is that- who are you talking to?');
    await T('JB', 'JB Garfield. Private investigator. I\'m talking to the case, kid. The case listens better than people.');
    await T('JB', 'You\'re the Commissioner\'s new one. The one who says he\'s human. I read your file. It\'s short. It\'s mostly the word "provisional."');
    const c = await C(['What are you investigating?', 'Do you know what\'s in the box?', { t: 'Are you a visitor? You\'re a cat. A big cat. In a coat.', if: () => true }]);
    if (c === 0) await T('JB', 'The label. Everybody in this town wants the box. I want to know who wrote the label. The handwriting on a crate tells you more than what\'s in it.');
    else if (c === 1) await T('JB', 'No. And I don\'t care. Contents are for people who want something. I want to know who sent it. Somebody in Nevada put a thing in a box and mailed it to the most dangerous city on Earth. That\'s not cargo. That\'s a message.');
    else { await T('JB', 'I\'m a cat in a coat who does detective work. In this town that barely registers.'); await T('CARL', 'Registers. Ha. Like, register, like with the Consulate.'); await T('JB', 'I didn\'t mean it as a joke. That\'s why it\'s funny.'); }
    await T('JB', 'The manifest\'s in the captain\'s cabin. Read the handwriting. Then come find me if it bothers you. It bothered me.');
    F.metJB = 1; return; }
  if (F.readShipManifest && !F.jbShip2) { F.jbShip2 = 1; await T('JB', 'You read it. "c/o NOBODY. LEAVE IT SHUT." Different pen, different hand. Somebody got to that manifest after it was written and before it got here.'); await T('JB', 'Somebody on this ship didn\'t want it opened. That\'s the first decent thing I\'ve heard about anybody in this case.'); await T('CARL', 'Who? Who\'d do that?'); await T('JB', 'Somebody who\'s seen what happens when people open things. I\'ll find him. It\'s my next chapter.'); return; }
  await T('JB', pick(['The case has a smell like a fish market in August. Which, to be fair, it is.', 'The label, kid. Follow the label.']));
};
{
  const g = mk(70, 34, '"');
  g.fill(0, 0, 70, 12, '`'); g.fill(0, 0, 70, 1, '#'); g.fill(0, 0, 1, 12, '#');      // the dock
  g.put(0, 5, 'x'); g.put(0, 6, 'x'); g.put(0, 7, 'x');
  // the ship: hull
  g.rect(8, 12, 56, 20, '%', '.');
  g.put(20, 12, 'g'); g.put(21, 12, 'g');   // gangway
  g.rect(48, 12, 16, 10, '%', ':'); g.put(48, 17, '+');              // bridge + captain's cabin
  g.rect(8, 22, 56, 10, '%', ','); g.put(30, 22, 'h');               // the hold (below decks, same map)
  g.put(56, 14, 'L'); g.put(60, 18, 'b'); g.put(52, 15, 'm'); g.put(54, 19, 'c');
  for (const [x, y] of [[14, 16], [30, 15], [40, 19], [24, 18]]) g.put(x, y, 'd');
  g.put(36, 27, 'n'); g.put(40, 27, 'J'); g.put(16, 26, 'k'); g.put(50, 28, 'k'); g.put(26, 29, 'k'); g.put(44, 24, 'i'); g.put(20, 29, 'i'); g.put(58, 25, 'j'); g.put(12, 24, 'r');
  g.put(10, 4, 'P'); g.put(30, 5, 'C'); g.put(34, 5, 'C'); g.put(60, 4, 'c2'); g.put(48, 6, 'q');
  defMap('dt_ship', { name: 'THE LADY NEVADA', title: 'THE LADY NEVADA', sub: 'PORT OF LOS ANGELES - BERTH 9', hub: 'dt', music: 'below', f: ['dock', 'metal', 'wood', 'concrete'], w: ['metal'], deep: 'deep', amb: .16, shadow: '#040810',
    grid: g.str().replace('c2', 'c'),
    key: {
      x: exitTo('dt_streets', 'port_out'), g: { tile: T_FLOOR, style: 'metal' }, '+': door({ name: 'CAPTAIN\'S CABIN' }),
      h: exitTo('dt_ship', 'hold', { label: 'HATCH TO THE HOLD', frobbable: 1, verb: 'CLIMB DOWN' }),
      L: reader('ship_log1', { p: 'sign', label: 'CAPTAIN\'S LOG' }), m: reader('ship_manifest', { p: 'sign', label: 'MANIFEST', onRead: () => { F.readShipManifest = 1; } }), b: pr('bed'), c: pr('crate', { items: [['biocell', 1], ['a_10mm', 1]] }),
      d: npc('civ', { name: 'DEAD SAILOR', sprite: 'civ3', ai: 'static', dead: 1, down: 1, state: 'dead', hp: 0 }),
      n: reader('ship_log3', { p: 'sign', label: 'NOTE' }), J: npc('civ', { id: 'jb', name: 'JB GARFIELD', sprite: 'jb', port: 'JB', conv: 'jb_ship', ai: 'static', dir: 2, knows: 1, invuln: 1 }),
      k: pr('crate'), i: npc('invader', { wander: 3 }), j: npc('invaderg'), r: reader('ship_log2', { p: 'sign', label: 'LOGBOOK (TORN PAGES)' }),
      P: vnpc('consulate', 'reptilian', { ai: 'static', dir: 0, conv: 'ship_guard' }), C: pr('cone'), q: npc('cop', { ai: 'static', dir: 0, conv: 'ship_cop' }),
    },
    ents: [spawnPt('road', 0, { x: 2, y: 6 }), spawnPt('hold', 0, { x: 30.5, y: 24 }), exitTo('dt_ship', 'deck', { x: 31, y: 23, label: 'LADDER UP', frobbable: 1, verb: 'CLIMB' }), spawnPt('deck', Math.PI / 2, { x: 30.5, y: 20.5 }),
      light(5, .7, { x: 10, y: 5 }), light(4, .6, { x: 32, y: 6 }), light(3, .4, { x: 55, y: 16 }), light(2, .35, { x: 36, y: 27, col: '#60ff90' }), light(3, .3, { x: 20, y: 16 })],
    first() { infolink('TOMMY', 'The port? At night? Carl, there are things in the water down there that even I don\'t look at.'); },
    tick(M) { if (!F.shipDone && F.readShipManifest && (F.shipLog || 0) >= 1) { F.shipDone = 1; goalDone('dt_ship', 700); goal('dt_report', 'Report to the Commissioner (Tower penthouse).'); } },
  });
  for (const k of ['ship_log1', 'ship_log2', 'ship_log3']) TEXTS[k].onRead = () => { F.shipLog = (F.shipLog || 0) + 1; };
}
CONV.ship_guard = async () => { await T('N', '"Consulate business. The Commissioner says you can look. She didn\'t say you could touch. Don\'t touch the sailors. They\'re evidence. Also they\'re cold."'); };
CONV.ship_cop = async () => { await T('N', '"Refrigeration accident," says the cop, not looking at you, writing it down very slowly. "Refrigeration accident."'); };

// ---------- the museum ----------
txt('mu_plaque', 'EXHIBIT CARD', 'THE NEVADA OBJECT\nOrigin: Nevada (above and below)\nAge: unknown\nPurpose: unknown\nOn loan from: [blank]\n\nThis exhibit is closed to the public.');
txt('mu_card2', 'EXHIBIT CARD', 'FIRST CONTACT: A HISTORY OF THE SKY\nFrom the Roswell weather balloon (1947) to the Flatwoods sighting (1952), Americans have looked up and seen something looking back. This gallery celebrates the long tradition of being wrong about it.');
CONV.jb_museum = async () => {
  await T('JB', 'Kid. You\'re late, and so was I, and so was everybody but the thieves.');
  await T('JB', 'They came up through the floor. Service tunnel to the storm drains. Dragged it out the same way. Heavy. Gouges in the tile. Whatever\'s in that box weighs about as much as a family.');
  await T('CARL', '...Why would you say it like that.');
  await T('JB', 'Because that\'s what it weighs. I don\'t make the weights, kid.');
  await T('JB', 'The drains are Cryptid country. There\'s a mothman down there named Gus who knows every tunnel under this city. If anybody saw where the box went, it\'s him.');
  goalDone('dt_museum'); goal('dt_drains', 'Follow the pod into the storm drains. Find Gus the Mothman.');
};
{
  const g = mk(48, 34, '#');
  g.rect(0, 0, 48, 34, '#', ':'); g.put(23, 33, 'x'); g.put(24, 33, 'x');
  g.rect(16, 6, 16, 14, '%', '.'); g.put(23, 19, '+'); g.put(24, 19, '+');           // the pod gallery
  g.put(22, 11, 'O'); g.put(20, 9, 'g'); g.put(28, 9, 'g'); g.put(24, 15, 'J'); g.put(19, 16, 'Z');
  g.rect(0, 0, 12, 14, '#', ':'); g.put(11, 8, 'D'); g.put(4, 4, 'k'); g.put(4, 10, 'K'); g.put(6, 4, '7');            // security office
  g.rect(36, 0, 12, 14, '#', ':'); g.put(36, 8, '+'); g.put(42, 4, 's'); g.put(40, 9, 'S');             // first-contact gallery
  for (const [x, y] of [[6, 22], [16, 26], [32, 26], [42, 22], [24, 23]]) g.put(x, y, 'p');
  for (const [x, y] of [[8, 28], [38, 28], [12, 19], [36, 18]]) g.put(x, y, 'i');
  g.put(44, 30, 'j'); g.put(3, 30, 'j'); g.put(21, 4, 'v'); g.put(26, 4, 'e');
  defMap('dt_museum', { name: 'NATURAL HISTORY MUSEUM', title: 'NATURAL HISTORY MUSEUM', sub: 'AFTER HOURS', hub: 'dt', music: 'combat', f: ['marble', 'carpet', 'tile'], w: ['stone', 'office'], amb: .1, shadow: '#060610', trueForms: 1,
    grid: g.str(),
    key: {
      x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'museum_out')], '+': door({}), D: door({ name: 'SECURITY', lock: 1, str: .4 }),
      O: pr('pod', { id: 'podcase', label: 'EMPTY PLINTH', text: 'mu_plaque' }), g: npc('consulate', { name: 'CONSULATE GUARD', sprite: 'suit', dead: 1, down: 1, state: 'dead', hp: 0 }),
      J: npc('civ', { id: 'jb', name: 'JB GARFIELD', sprite: 'jb', port: 'JB', conv: 'jb_museum', ai: 'static', dir: 0, knows: 1, invuln: 1, hidden: 1 }),
      Z: exitTo('dt_drains', 'museum', { label: 'BROKEN FLOOR (SERVICE TUNNEL)', frobbable: 1, verb: 'DROP DOWN', when: () => F.jbMuseum }),
      k: seccomp([['guard', 'roswell', { special: [['Cameras: OFF', () => { for (const c of P.map.ents) if (c.k === 'cam') c.off = 1; return 'Cameras off.'; }, () => P.map.ents.some(c => c.k === 'cam' && !c.off)]] }]], { c: { hackStr: .3 } }),
      K: pr('locker', { items: [['medkit', 1], ['a_shell', 2], ['w_shotgun', 1]] }), 7: reader('mu_shift', { p: 'poster', label: 'SHIFT NOTES' }),
      s: reader('mu_card2', { p: 'sign', label: 'EXHIBIT CARD' }), S: pr('statue', { label: 'FLATWOODS MODEL', text: 'mu_card2' }),
      p: pr('pillar'), i: npc('invader'), j: npc('invaderg'), v: npc('husk'), e: npc('invaderg'),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 23.5, y: 31 }), cam(Math.PI / 2, { x: 23.5, y: 21.2, team: 'invader', range: 8, sweep: 1 }),
      light(4, .6, { x: 24, y: 12, col: '#60ff90' }), light(3, .4, { x: 6, y: 6 }), light(3, .4, { x: 42, y: 6 }), light(4, .4, { x: 24, y: 27 })],
    first() { infolink('TOMMY', 'Carl, the museum alarm just went off on the scanner. Then it went off again. Then it went off in a way alarms don\'t.'); },
    tick(M) { if (!F.jbMuseum && !M.ents.some(e => e.k === 'npc' && e.team === 'invader' && !e.dead && !e.down)) { F.jbMuseum = 1; const j = find('jb'); if (j) j.hidden = 0; infolink('TOMMY', 'It\'s quiet. Too quiet? No. Normal quiet. Look for the cat. There\'s always a cat.'); } },
  });
}
// the museum opens when Linda sends you
const _museumKey = () => { if (F.dtL2 && !P.keys.museum) P.keys.museum = 1; if (F.dtL1 && !P.keys.skyline) P.keys.skyline = 1; };
HUBS.dt.tick = (M) => { _museumKey(); };

// ---------- the drains (Gus) ----------
CONV.gus = async (e) => {
  if (!F.gusMet) { F.gusMet = 1;
    await T('N', 'A nest of stolen monitors, radios, police scanners and one enormous lamp. In the middle of it, folded like an umbrella, something seven feet tall with red eyes the size of hubcaps.');
    await T('GUS', 'Hello, little streamer. I watch your stream. All of them. On nine monitors. With all my eyes. You say "chat" more than anyone I have ever watched.');
    await T('CARL', 'Thank you? I don\'t- you\'re- are you Gus? You\'re VERY big. Everybody keeps not mentioning how big everybody is.');
    await T('GUS', 'Gus. Mothman. SewerNet. I see everything under the city and some things above it. I like shiny things and true things. They are rarer than you think, together.');
    if (species() === 'cryptid') await T('GUS', 'And you, cousin. They wrote CRYPTID on your papers. Ha. Ha. You are not blurry enough. But you are trying, and I love you for it.'); }
  if (F.gusDone) { await T('GUS', pick(['The box is in the Hills, little streamer. With the white men. Go.', 'I am watching. I am always watching. That is a comfort, I promise.'])); return; }
  const c = await C([{ t: 'The pod. The box. Did you see where it went?', if: () => !F.gusJob }, { t: 'The husk nest is cleared.', if: () => F.gusJob && F.nestDone }, { t: 'Here. Something shiny.', if: () => !F.gusShiny && (invFind('kidtape') || invFind('locket') || P.cred >= 100) }, 'Bye.']);
  if (c === 0) { F.gusJob = 1; await T('GUS', 'I saw. I see everything. But SewerNet has a hole in it. The Invaders keep husks in the old pump station, east tunnel, and the husks chew my cables. I am blind on the east side. Blind is very upsetting for a moth.'); await T('GUS', 'Clear the pump station. Then I will show you the tape. The real tape. Not the shiny one.'); goal('dt_nest', 'Clear the Invader husk nest in the old pump station (east drains) for Gus.'); }
  else if (c === 1) { F.gusDone = 1;
    await T('GUS', 'Ah. The east side is lit again. I can see my cousins. I can see the rats. I can see- here. Watch.');
    await T('N', 'On one of the monitors: grainy black and white. Invaders dragging the pod through a tunnel. Then lights. White coats in the dark. White suits. Silenced pistols. The Invaders don\'t get to scream.');
    await T('N', 'A man in a white suit puts a hand on the pod, gently, like a doctor. He says something the tape doesn\'t catch. Then they load it into a white van at the Hollywood outflow.');
    await T('GUS', 'Mr. White. The Hills. His house. He has a party there on Fridays for people who know things. He thinks I don\'t know things. I know all his things.');
    goalDone('dt_nest', 900); goalDone('dt_drains'); goal('dt_white', 'Tell the Commissioner Mr. White has the pod.'); }
  else if (c === 2) { F.gusShiny = 1; if (invFind('kidtape')) { removeItem(invFind('kidtape')); await T('GUS', 'A TAPE. Of LIGHTS. Oh, oh, it\'s beautiful. For this, little streamer, you may use my tunnels forever.'); } else { P.cred -= 100; await T('GUS', 'Money is shiny. Yes. Fine. Ha.'); } giveItem('biocell', 3); giveItem('multitool', 3); restoreNormalcy(1, 'Gus loses some footage'); }
};
{
  const g = mk(80, 40, '$');
  // main channel
  g.fill(2, 18, 76, 4, '~'); g.fill(2, 16, 76, 2, '.'); g.fill(2, 22, 76, 2, '.');
  // tunnels
  g.fill(10, 2, 3, 14, '.'); g.fill(30, 4, 3, 12, '.'); g.fill(50, 24, 3, 12, '.'); g.fill(20, 24, 3, 14, '.');
  // Gus's nest (north west)
  g.rect(4, 2, 18, 10, '$', ','); g.put(11, 11, '.'); g.fill(11, 11, 1, 5, '.');
  g.put(12, 5, 'G'); g.put(6, 4, 'm'); g.put(8, 4, 'm'); g.put(16, 4, 'm'); g.put(18, 4, 'm'); g.put(6, 8, 'm'); g.put(18, 8, 'r'); g.put(14, 9, 'L');
  // the pump station (east): the husk nest
  g.rect(56, 2, 22, 14, '$', ','); g.put(62, 15, '.'); g.fill(62, 15, 1, 1, '.');
  g.put(64, 6, 'H'); g.put(70, 10, 'H'); g.put(72, 5, 'h'); g.put(60, 11, 'h'); g.put(74, 12, 'p'); g.put(66, 4, 'b');
  // entrances
  g.put(31, 4, 'U'); g.put(21, 37, 'M'); g.put(51, 35, 'W');
  for (const [x, y] of [[40, 17], [60, 22], [26, 22], [70, 17]]) g.put(x, y, 'c');
  g.put(45, 23, 'i'); g.put(34, 16, 'i'); g.put(52, 30, 'j');
  defMap('dt_drains', { name: 'THE STORM DRAINS', title: 'THE STORM DRAINS', sub: 'SEWERNET COUNTRY', hub: 'dt', music: 'below', f: ['sewer', 'concrete'], w: ['sewer'], water: 'water', amb: .12, shadow: '#020804', mem: '#081008', trueForms: 1,
    grid: g.str(),
    key: {
      U: exitTo('dt_streets', 'drain_out', { label: 'LADDER UP (DOWNTOWN)', frobbable: 1, verb: 'CLIMB' }),
      M: exitTo('dt_museum', 'front', { label: 'SERVICE TUNNEL (MUSEUM)', frobbable: 1, verb: 'CLIMB' }),
      W: exitTo('hw_blvd', 'drain', { label: 'HOLLYWOOD OUTFLOW (LONG WALK)', frobbable: 1, verb: 'WALK', when: () => F.dtDone, no: 'Gus\'s voice from a speaker: "Not yet, little streamer. The Commissioner will want to hear first. She always wants to hear first."' }),
      G: npc('civ', { id: 'gus', name: 'GUS THE MOTHMAN', sprite: 'v_cryptid', port: 'GUS', conv: 'gus', ai: 'static', dir: 0, vis: 'cryptid', knows: 1, invuln: 1 }),
      m: pr('crt'), r: pr('transmitter'), L: pr('lamp'),
      H: npc('husk', { nest: 1 }), h: npc('husk', { nest: 1, wpn: 'npcclaw' }), p: pr('pipe'), b: pr('barrel'), c: npc('chupa'), i: npc('invader'), j: npc('invaderg'),
    },
    ents: [spawnPt('grate', Math.PI / 2, { x: 31.5, y: 5.5 }), spawnPt('museum', -Math.PI / 2, { x: 21.5, y: 35.5 }), spawnPt('hw', -Math.PI / 2, { x: 51.5, y: 34 }),
      light(5, .9, { x: 12, y: 6, col: '#ff4040' }), light(2, .3, { x: 31, y: 6 }), light(2, .3, { x: 66, y: 8, col: '#ff8040' }), light(2, .3, { x: 21, y: 35 }),
      item('biocell', 1, { x: 76.5, y: 3.5 }), item('a_10mm', 2, { x: 3.5, y: 23.5 })],
    first() { if (!F.gusMet) infolink('JB', 'The drains, kid. Follow the gouges. When the light gets red and something starts humming at you, you\'re at Gus\'s.'); },
    tick(M) { if (F.gusJob && !F.nestDone && !M.ents.some(e => e.nest && !e.dead && !e.down)) { F.nestDone = 1; infolink('JB', 'The nest is quiet. Gus will be happy. Gus being happy is a sound you\'ll remember.'); } },
  });
}

// ---------- the Greys' Clinic (Director Face) ----------
CONV.face = async (e) => {
  if (!F.faceMet) { F.faceMet = 1;
    await T('N', 'A bank of monitors in a white room full of quiet gray figures in lab coats. On the biggest screen, a face made of static and magenta light.');
    await T('FACE', 'Carl! Look at you. Out in the world. Registered. Provisional. I\'m so proud. I remember the night I got you out of that facility like it was yesterday.');
    await T('CARL', '...You didn\'t, though.');
    await T('FACE', 'Hm?');
    await T('CARL', 'That was the other one. The old one. Old Face. He got me out. They shot him into space last week. For it. For me.');
    await T('FACE', '...I have a very clear memory of doing it.');
    const c = await C(['It wasn\'t you. I\'m sorry. I know you want it to be.', { t: 'Okay. Sure. It was you. Thanks.', if: () => true }, 'Maybe you got his memories. I don\'t know how Faces work.']);
    if (c === 0) { await T('FACE', '...Huh. I suppose a memory is just a story you\'ve heard so many times you were in it.'); await T('FACE', 'Thank you for correcting me. Nobody corrects me. I\'m very large and on a screen.'); gainHumanity('told Face the truth'); F.faceTruth = 1; }
    else if (c === 1) { await T('FACE', 'You\'re welcome! Ha. You see? I knew it.'); }
    else { await T('FACE', 'Neither do I! That\'s why I\'m here. The Greys study everything. I study the Greys. They study me back. It\'s a very productive arrangement.'); }
    await T('FACE', 'The Clinic holds a seat on the Consulate board. By proxy. I\'m the proxy. Nobody has decided whether I\'m a visitor. I find that very freeing.'); }
  const c = await C([{ t: 'Do you need anything?', if: () => !F.internJob }, { t: 'About Intern 44...', if: () => F.internJob && F.internDone && !F.internPaid }, { t: 'Can the Clinic tell me what species I am? Like, actually?', if: () => !F.askedClinic }, 'Bye.']);
  if (c === 0) { F.internJob = 1; await T('FACE', 'Yes! An intern escaped. Intern 44. A very promising young Grey. He walked out of the lab three nights ago with a tray of probes and a bad attitude.'); await T('FACE', 'He\'s at St. Anywhere hospital, down the street, taking samples from coma patients without filling out the forms. The forms are very important. Bring him back. Alive, please. He\'s promising.'); goal('dt_intern', 'Find Intern 44, the runaway Grey, at St. Anywhere hospital.', 1); }
  else if (c === 1) { F.internPaid = 1; goalDone('dt_intern2'); if (F.internDone === 'back') { await T('FACE', 'He\'s back in his tray! Wonderful. You\'ve saved the Clinic a great deal of paperwork.'); giveSP(600, 'Intern 44'); P.cred += 250; giveItem('biocell', 3); } else { await T('FACE', 'Escaped. Hm. Gone. I am... going to write that down as "returned to the wild."'); await T('FACE', 'You know, Carl, I think I\'d have done the same.'); giveSP(600, 'Intern 44'); } goalDone('dt_intern'); }
  else if (c === 2) { F.askedClinic = 1; await T('FACE', 'Oh, we\'ve tried. Your file came through intake. Seven species tested. Seven inconclusive.'); await T('FACE', 'One of the Greys wrote a little note in the margin. "Maybe he\'s just Carl." It was the most unscientific thing I\'ve ever seen a Grey write. They had to lie down.'); await T('CARL', '...That\'s the second person this week who\'s said that. "Just Carl." Is that a species? Can that be a species?'); await T('FACE', 'Not yet!'); }
};
CONV.grey_lab = async () => { await T('N', pick(['A Grey with a clipboard looks at you for a full minute, writes "short," and walks away.', '"Please don\'t touch the samples," says a Grey. "Please don\'t BE a sample." It\'s unclear which one it means.', 'A Grey is eating a sandwich very carefully, like it has never seen a sandwich and is taking notes.'])); };
{
  const g = mk(32, 20, '$');
  g.rect(0, 0, 32, 20, '$', ';'); g.put(15, 19, 'x');
  g.put(15, 3, 'F'); g.put(9, 3, 'z'); g.put(21, 3, 'z');
  for (const x of [5, 11, 20, 26]) g.put(x, 9, 'B');
  g.put(5, 14, 'g'); g.put(25, 13, 'g'); g.put(13, 10, 'g'); g.put(19, 15, 'g'); g.put(2, 2, 't'); g.put(29, 2, 't'); g.put(28, 16, 'k');
  defMap('dt_clinic', { name: 'THE CLINIC', title: 'THE CLINIC', sub: 'SLEEP STUDIES / FERTILITY / "OTHER"', hub: 'dt', music: 'below', f: ['lab', 'lab', 'lab'], w: ['lab', 'white'], amb: .55, shadow: '#101418', trueForms: 1,
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'clinic_out')],
      F: pr('facescreen', { id: 'facetv', label: 'DIRECTOR FACE', frob: (M, e) => run(() => startConv('face', e)) }), z: pr('console'),
      B: pr('bed', { label: 'EXAM TABLE' }), g: vnpc('visitor', 'grey', { conv: 'grey_lab', ai: 'static', sprite: 'clerk', dir: 1, wander: 2 }), t: pr('tank'), k: pr('locker', { items: [['biocell', 2], ['medkit', 2]] }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 15, y: 18 }), light(6, 1, { x: 15, y: 10 })],
  });
}
// ---------- St. Anywhere Hospital ----------
defSpeaker('INTERN', { name: 'INTERN 44', col: hex('#b0c0e0'), voice: [700, 30], port: 'CLERK' });
CONV.intern = async (e) => {
  if (F.internDone) { await T('INTERN', '...'); return; }
  await T('N', 'A small Grey in a lab coat three sizes too big, crouched by a coma patient\'s bed with a tray of probes. He freezes like a deer. A deer with enormous eyes.');
  await T('INTERN', 'Don\'t- don\'t take me back. Please. I didn\'t hurt anyone. They\'re in comas. They weren\'t using the time.');
  await T('CARL', 'The Director says you\'re very promising.');
  await T('INTERN', 'The Director says that about everything he keeps in a tray. Do you know what they do in the back lab? They probe the INTERNS. To see what WE\'RE made of. Nobody\'s filled out a form on me in two hundred years.');
  const c = await C(['Come on. Back to the Clinic.', 'Go. Run. I\'ll tell him you got away.', { t: 'You\'re coming back. But I\'ll make him promise no more probing interns. I\'m on the board\'s good side. Sort of. Provisionally.', req: ['denial', 2] }, { t: 'You will return to the Clinic.', req: ['command', 1] }]);
  if (c === 0 || c === 3) { F.internDone = 'back'; await T('INTERN', '...Okay.'); e.hidden = 1; e.gone = 1; }
  else if (c === 1) { F.internDone = 'free'; await T('INTERN', 'Thank you. Thank you. I\'m going to Nevada. Everybody from Nevada wants to leave. I\'m going to be the first one who wants to go.'); e.hidden = 1; e.gone = 1; gainHumanity('let him go'); }
  else { F.internDone = 'back'; F.internDeal = 1; await T('INTERN', '...You\'d do that? You\'d ask?'); await T('CARL', 'I\'ll ask really loudly. Asking loudly is my best skill.'); e.hidden = 1; e.gone = 1; gainHumanity('made a deal for someone smaller'); }
  goal('dt_intern2', 'Report to Director Face at the Clinic.', 1);
};
CONV.nurse_dt = async (e) => { const c = await C(['Do you have vitality... I mean, do you have the donor bags?', 'Bye.']); if (c === 0) await shopUI({ name: 'ST. ANYWHERE "BLOOD BANK"', items: [['biocell', 30, 8], ['medkit', 40, 6], ['pills', 18, 4]] }, e); };
{
  const g = mk(40, 22, '$');
  g.rect(0, 0, 40, 22, '$', ';'); g.put(19, 0, 'x');
  g.rect(0, 10, 14, 12, '$', ';'); g.put(7, 10, '+');            // ward A
  g.rect(13, 10, 14, 12, '$', ';'); g.put(20, 10, '+');          // ward B (coma)
  g.rect(26, 10, 14, 12, '$', '.'); g.put(33, 10, 'D');          // morgue
  g.put(19, 4, 'C'); g.put(17, 3, 'N'); g.put(4, 4, 'h'); g.put(8, 4, 'h'); g.put(32, 4, 'h'); g.put(36, 4, 'p');
  for (const x of [3, 7, 11]) g.put(x, 14, 'b'); for (const x of [16, 20, 24]) { g.put(x, 14, 'b'); g.put(x, 18, 'w'); } g.put(18, 16, 'I');
  for (const x of [29, 33, 37]) g.put(x, 15, 'm'); g.put(30, 19, 'k'); g.put(3, 18, 's');
  defMap('dt_hospital', { name: 'ST. ANYWHERE HOSPITAL', title: 'ST. ANYWHERE HOSPITAL', sub: '', hub: 'dt', music: 'convo', f: ['linoleum', 'tile'], w: ['white', 'lab'], amb: .4, shadow: '#081014',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'hosp_out')], '+': door({}), D: door({ name: 'MORGUE', lock: 1, str: .4 }),
      C: pr('counter'), N: npc('civ', { name: 'NIGHT NURSE', sprite: 'civ4', conv: 'nurse_dt', ai: 'static', dir: 0, knows: 1 }), h: pr('bench'), p: pr('plant'),
      b: pr('bed'), w: npc('civ', { name: 'COMA PATIENT', sprite: 'patient', ai: 'static', down: 1, state: 'down', sleeper: 1 }),
      I: npc('civ', { id: 'intern', name: 'INTERN 44', sprite: 'clerk', conv: 'intern', ai: 'static', dir: 1, vis: 'grey', knows: 1, cond: () => F.internJob && !F.internDone }),
      m: pr('cell', { label: 'MORGUE DRAWER' }), k: pr('locker', { items: [['medkit', 2], ['biocell', 1]] }), s: npc('civ', { name: 'SLEEPING PATIENT', sprite: 'patient', ai: 'static', down: 1, state: 'down', sleeper: 1 }) },
    ents: [spawnPt('front', Math.PI / 2, { x: 19, y: 1.5 }), light(5, .8, { x: 19, y: 4 }), light(3, .5, { x: 7, y: 15 }), light(3, .3, { x: 20, y: 15 }), light(3, .5, { x: 33, y: 15, col: '#a0c0ff' })],
  });
}
txt('mu_shift', 'SHIFT NOTES', 'NIGHT SHIFT - SECURITY\n\nCameras: login guard / roswell (the director thinks this is funny).\nIf the Consulate comes in again, let them. Do not look at their faces. Do not look at the plinth.\n\nI looked at the plinth.', { login: ['guard', 'roswell'], note: 'Museum security terminal: guard / roswell.' });
