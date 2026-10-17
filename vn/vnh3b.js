'use strict';
// ================= DISK D (cont.): MR. WHITE'S HOUSE: THE AUCTION =================
txt('mw_catalog', 'AUCTION CATALOG', 'LOT 1 (OF 1)\nTHE NEVADA OBJECT\n\nProvenance: recovered from the desert, Nevada (above and below). Shipped via LADY NEVADA (crew: unavailable for comment). Displayed briefly. Recovered again, by us.\n\nCondition: sealed. Warm. Occasionally audible.\n\nReserve: one (1) favor from the winning bidder, to be named later.\n\nThe house reminds bidders that nothing in this house happened.');
txt('mw_white_desk', 'MR. WHITE\'S LEDGER', 'CLEANUP, 1955-1995 (SELECTED)\n1957 - Ocean House, Santa Monica. Client: W.C. "Family emergency." Billed: continuity.\n1971 - Roswell (again). Client: the Board. "Weather balloon (second)."\n1988 - A facility below Nevada. Client: [redacted]. "Escape, juvenile. Do not pursue. Do not record. Do not find."\n1995 - The streamer. Client: the Commissioner. "Monitor. Do not touch. Yet."', { note: 'Mr. White\'s ledger: in 1988 he was paid to "not pursue" a juvenile who escaped a facility below Nevada. "Do not record. Do not find." Someone paid him not to find Carl.' });
txt('mw_vaultcode', 'NOTE', 'Vault code changed. Again. Mr. W says "think white." Mr. W thinks everything is a riddle. It\'s 0000. It is always 0000. Nobody has ever tried 0000 because nobody thinks a man like that would use 0000. That\'s why he uses it.', { code: '0000', note: 'Mr. White\'s vault code is 0000.' });
defSpeaker('ENVOY', { name: 'YOKOID ENVOY', col: hex('#ff8080'), voice: [950, 10], port: 'YOKOID' });
CONV.white_host = async (e) => {
  if (F.auctionDone) { await T('WHITE', 'The house is closed, Mr. Carl.'); return; }
  await T('WHITE', F.disguise === 'suit' ? 'Mr. Carl. In a white suit. How flattering. How small.' : 'Mr. Carl. The assistant. Of course. Nobody looks at the assistant, except me. I look at everyone. It\'s my job.');
  await T('WHITE', 'Enjoy the party. Please don\'t breach anything. Everyone here already knows. That\'s the nice thing about my parties.');
  const c = await C(['Why are you selling it?', { t: 'You\'ve been watching me. Since before the hearing.', if: () => F.readWhiteLedger }, 'Nice house.']);
  if (c === 0) await T('WHITE', 'I have spent forty years cleaning up after visitors. This is the last mess. I want to give it to whoever will keep it closed the longest, and charge them for the privilege.');
  else if (c === 1) { await T('WHITE', '...You read my ledger. Bad manners. Interesting manners.'); await T('CARL', '1988. A facility below Nevada. "Do not pursue. Do not record. Do not find." Somebody paid you NOT to find me. Who? Who paid?'); await T('WHITE', 'A client.'); await T('CARL', 'That\'s not an answer!'); await T('WHITE', 'It is the only one I am paid to give.'); F.askedWhite88 = 1; }
};
CONV.auction = async () => {
  F.auctionDone = 1; G.cutBars = 1; sfx('menu');
  await T('N', 'A spoon against a glass. The room goes quiet. Every guest in the room is a visitor, and in here, nobody is bothering with their faces.');
  await T('WHITE', 'Friends. Clients. Former clients. Lot one, of one. The Nevada Object. Sealed. Warm. Occasionally audible.');
  await T('WHITE', 'The reserve is a favor, to be named later. Bids, please.');
  await T('HUMAN', 'The Commissioner bids the Normalcy. Continued. For everyone in this room. Forever.');
  await T('N', 'A television on a cart crackles to life. Static, and in the static, a face you know in a crimson helmet.');
  await T('DYSLEXIO', 'I bid every visitor on Earth. Awake. At once. Unashamed. You have never been offered anything bigger in your life, Mr. White. Neither have they.');
  await T('CARL', '...Old Face? That\'s- that\'s OLD FACE, that\'s, they sent you up, they sent you to the sender-');
  await T('DYSLEXIO', 'Hello, Carl. They sent me. I came back. The sender didn\'t want me either. We\'ll talk soon. Not here.');
  await T('ENVOY', 'The Empress of Little Tokyo bids that it stays shut. That is our entire bid. We have nothing else to offer and we want nothing else in return.');
  await T('FACE', 'The Clinic bids... ooh. Research access? Can we just look at it? We\'ll be very careful. We\'re always very careful.');
  await T('WHITE', 'And the assistant? Anything from the assistant?');
  chatPoll('bid', ['BID', 'NO', 'STEAL IT']);
  const c = await C(['I bid... I have like, ' + fmtc(P.cred) + '. And a bow tie.', 'Nobody should own it. Nobody. Not even you.', { t: 'Whatever\'s in there might be my family, and every one of you is bidding on it like a lamp.', if: () => F.hopedParents }, '[Say nothing, slip out during the bidding]']);
  if (c === 0) { await T('WHITE', 'Noted. Noted with affection.'); }
  else if (c === 1) { await T('WHITE', 'Everybody says that until they\'re holding it.'); }
  else if (c === 2) { await T('N', 'The room goes very quiet. The Envoy looks at you. Dyslexio\'s static stops moving for a second. HU-MAN tilts his head like a dog hearing a whistle.'); await T('WHITE', '...That is the first honest bid of the night. It is also the lowest.'); F.saidFamily = 1; }
  await T('WHITE', 'The house will deliberate. Refreshments are in the hall. Do not go downstairs.');
  G.cutBars = 0; P.map.noTalkUntil = G.t + 5;
  goal('hw_vault', 'Get downstairs to Mr. White\'s vault and take the pod before he sells it. (The vault is below the east wing.)');
  infolink('PILOTX', 'Kid. I\'m outside. I\'m not coming in. Something else is. Be downstairs before it gets here.');
  setTimeout(() => { if (P.map && P.map.id === 'hw_mansion') { F.raid2 = 1; raidMansion(P.map); } }, 50000);
};
CONV.white_vault = async (e) => {
  await T('N', 'The vault is white tile, very clean, very cold. The pod sits in the middle on a padded cradle, sweating condensation. Up close it\'s smaller than you thought. Up close it hums at exactly the pitch of your own pulse.');
  await T('WHITE', 'I said don\'t go downstairs.');
  await T('CARL', 'I- you know, I heard "go downstairs." It\'s a very echoey house.');
  await T('WHITE', 'Put your hand on it, if you like. Everyone does. They say it feels like a heartbeat. I think it feels like a clock.');
  const c = await C(['[Touch the pod]', 'Who paid you not to find me?', 'Step away from it, Mr. White.']);
  if (c === 0) { await T('N', 'It\'s warm. Under your palm something shifts, very slightly, the way something sleeping shifts when a hand is put on it. Then it ticks. Once.'); await T('N', 'You feel, for a second, like you are being read. Not looked at. Read. Like a label.'); F.touchedPod = 1; }
  else if (c === 1) { await T('WHITE', 'The same client who paid me, last week, to take this box away from the Invaders in the drains and keep it shut until he came for it. A man with a red headband, and no name, who always pays in cash and never says what anything is for.');
    await T('WHITE', 'Then the Commissioner bid the Normalcy. I am a contractor, Mr. Carl. Contractors take the better offer.'); await T('CARL', '...Pilot X.'); await T('WHITE', 'I never said that.'); F.whitePX = 1; }
  await T('WHITE', 'I\'m afraid it\'s sold, Mr. Carl. To the Commissioner. She bid the Normalcy, and I am, in the end, a man who likes things clean.');
  await T('N', 'Upstairs, glass breaks. Then a lot of glass breaks. Then screaming in voices that aren\'t human and aren\'t trying to be.');
  await T('WHITE', '...Excuse me. Uninvited guests.');
  F.raid2 = 1; raidMansion(P.map);
  const k = await C(['Go. I\'ve got the pod.', { t: '[Fight him] You don\'t get to sell it. You don\'t get to sell anybody.', if: () => true }]);
  if (k === 1) { e.hostile = 1; e.ai = 'guard'; e.state = 'combat'; e.target = P; e.invuln = 0; e.hp = 420; e.hpMax = 420; e.wpn = 'npcpistol'; e.burst = 1; chatSay('BOSS: MR WHITE', 1); }
  else { e.hidden = 1; e.gone = 1; }
  goal('hw_hold', 'Hold the vault until the Commissioner\'s people arrive for the pod.');
};
function raidMansion(M) {
  if (F.raidSpawned) return; F.raidSpawned = 1; sfx('alarm'); post.shake = 3; setTimeout(() => post.shake = 0, 400);
  rel('player', 'miws', -1); F.disguised = 0;
  for (const [x, y, t] of [[30, 10, 'invader'], [34, 12, 'husk'], [38, 9, 'invaderg'], [40, 26, 'invader'], [44, 28, 'invaderg'], [54, 40, 'invader'], [58, 42, 'husk'], [52, 44, 'invaderg']]) { const e = spawnEnt(M, { k: 'npc', t, x, y }); e.state = 'combat'; e.lastSeen = [P.x, P.y]; }
  for (const e of M.ents) if (e.k === 'npc' && e.guest && !e.dead) { e.ai = 'civ'; e.state = 'flee'; e.threat = P; }
  chatSay('INVADERS', 1); chatSay('the party is CRASHED', 1); chatSay('they want the box', 1);
}
{
  const g = mk(72, 50, '#');
  g.fill(0, 0, 72, 50, ';'); g.fill(0, 0, 72, 1, '#'); g.fill(0, 49, 72, 1, '#'); g.fill(0, 0, 1, 50, '#'); g.fill(71, 0, 1, 50, '#');
  g.fill(31, 34, 10, 15, ','); g.put(35, 48, 'x'); g.put(36, 48, 'x'); g.fill(30, 33, 12, 1, '='); g.put(35, 33, 'g'); g.put(36, 33, 'g');   // drive + gate
  g.fill(1, 33, 29, 1, '='); g.fill(42, 33, 29, 1, '=');                         // the garden wall
  g.put(12, 33, 'w');                                                             // a low spot in the wall
  // the house
  g.rect(6, 4, 60, 28, '%', ':');
  g.fill(7, 5, 58, 1, 'W'); g.put(35, 31, 'F'); g.put(36, 31, 'F');
  g.rect(6, 4, 18, 12, '%', '.'); g.put(23, 10, '+'); g.put(10, 8, 'd'); g.put(14, 6, 'k'); g.put(18, 6, 'k'); g.put(8, 13, 'q');                 // White's study (restricted)
  g.rect(48, 4, 18, 28, '%', '.'); g.put(48, 12, 'D'); g.put(56, 20, 'V'); g.put(60, 28, 'v'); g.put(59, 27, 'Q');                                                      // east wing (restricted); stair to the vault
  g.put(30, 12, 'S'); g.put(34, 8, 'G'); g.put(40, 12, 'P'); g.put(28, 22, 'B'); g.put(26, 18, 't'); g.put(32, 18, 't'); g.put(38, 18, 't'); g.put(44, 18, 't'); g.put(32, 26, 'p'); g.put(42, 26, 'p'); g.put(10, 22, 'b'); g.put(18, 26, 'c'); g.put(43, 8, 'r');
  g.put(29, 16, 'u'); g.put(35, 15, 'u'); g.put(41, 16, 'u'); g.put(30, 24, 'u'); g.put(38, 23, 'u'); g.put(45, 22, 'u'); g.put(15, 20, 'u'); g.put(20, 24, 'u');
  g.put(28, 14, 'm'); g.put(44, 14, 'm'); g.put(36, 28, 'm'); g.put(12, 28, 'm'); g.put(53, 8, 'M'); g.put(58, 16, 'M'); g.put(16, 12, 'M');
  // gardens
  for (const [x, y] of [[5, 38], [12, 42], [20, 37], [50, 38], [60, 43], [66, 36], [24, 45], [46, 45]]) g.put(x, y, 'h');
  g.put(8, 46, 'n'); g.put(64, 46, 'n'); g.put(18, 40, 'o'); g.put(56, 40, 'o');
  // the vault (below the east wing, same map, south east corner)
  g.rect(48, 34, 22, 14, '$', ','); g.put(50, 35, 'U'); g.put(58, 40, 'Y'); g.put(62, 40, 'Z'); g.put(66, 36, 'z'); g.put(52, 45, 'z');
  defMap('hw_mansion', { name: 'MR. WHITE\'S HOUSE', title: 'THE HILLS', sub: 'MR. WHITE REQUESTS THE PLEASURE', hub: 'hw', music: 'lounge', f: ['marble', 'carpet', 'grass', 'concrete'], w: ['white', 'stone'], fence: 'fence', amb: .3, shadow: '#0c0c14', mem: '#181828',
    grid: g.str(),
    key: {
      x: exitTo('hw_blvd', 'hills', { label: 'BACK DOWN THE HILL' }), g: door({ id: 'gate', name: 'GATE', lock: 1, pick: 0, str: 1, metal: 1 }), w: { tile: T_FLOOR, style: 'grass' },
      F: door({ id: 'frontdoor', name: 'FRONT DOORS' }), '+': door({ id: 'study', name: 'STUDY', lock: 1, str: .5 }), D: door({ id: 'eastwing', name: 'EAST WING', lock: 1, str: .6 }),
      d: reader('mw_white_desk', { p: 'desk', label: 'MR. WHITE\'S DESK', onRead: () => { F.readWhiteLedger = 1; } }), k: pr('bookshelf'), q: reader('mw_vaultcode', { p: 'sign', label: 'NOTE' }),
      V: pr('locker', { items: [['biocell', 3], ['a_10mm', 2], ['medkit', 1]], label: 'SUPPLY CABINET' }), v: exitTo('hw_mansion', 'vault', { label: 'VAULT STAIRS', frobbable: 1, verb: 'GO DOWN', when: () => F.vaultOpen || F.raid2, no: 'A steel door with a keypad. Locked.' }),
      Q: pr('keypad', { label: 'VAULT KEYPAD', frob: (M, e) => { if (F.vaultOpen) { msg('Open.'); return; } keypadUI({ code: '0000', onOpen: () => { F.vaultOpen = 1; } }); } }),
      U: exitTo('hw_mansion', 'eastwing', { label: 'STAIRS UP', frobbable: 1, verb: 'GO UP' }),
      S: pr('stage'), G: npc('civ', { id: 'ghost', name: 'SPOOKY GHOST', sprite: 'ghost', port: 'GHOST', conv: 'ghost_party', ai: 'static', dir: 0, knows: 1, invuln: 1, ghost: 1, cond: () => F.ghostDone }),
      P: pr('piano'), B: pr('bar'), t: pr('table'), p: pr('palm'), b: pr('sofa'), c: pr('sofa'), r: reader('mw_catalog', { p: 'sign', label: 'AUCTION CATALOG' }),
      u: npc('visitor', { guest: 1, vis: 'reptilian', sprite: 'suit', ai: 'static', conv: 'guest', dir: 1 }),
      m: npc('miws', { ai: 'static', look: 1, conv: 'miws_party', dir: 1 }), M: npc('miws', { ai: 'guard', restricted: 1, look: 1.2, watchful: 1, conv: 'miws_party' }),
      Y: pr('pod', { id: 'thepod', label: 'THE NEVADA POD', frob: (M, e) => { if (!F.vaultTalk) { F.vaultTalk = 1; run(() => startConv('white_vault', find('white'))); } else msg('It hums at the pitch of your pulse.'); } }),
      Z: npc('miws', { id: 'white', name: 'MR. WHITE', sprite: 'mrwhite', port: 'WHITE', conv: 'white_host', ai: 'static', dir: 2, invuln: 1, team: 'miws' }),
      z: pr('crate', { items: [['a_10mm', 2], ['biocell', 1]] }), h: pr('tree'), n: npc('miws', { route: 'g1', restricted: 0 }), o: pr('lamp'),
    },
    routes: { g1: '1,2,3,4' },
    ents: [spawnPt('gate', -Math.PI / 2, { x: 35.5, y: 46 }), spawnPt('vault', 0, { x: 51.5, y: 36 }), spawnPt('eastwing', Math.PI / 2, { x: 60.5, y: 26.5 }),
      vnpc('visitor', 'nordic', { guest: 1, x: 34, y: 20, sprite: 'civ7', ai: 'static', conv: 'guest', dir: 1 }), vnpc('visitor', 'grey', { guest: 1, x: 38, y: 21, sprite: 'clerk', ai: 'static', conv: 'guest', dir: 3 }), vnpc('visitor', 'martian', { guest: 1, x: 22, y: 21, sprite: 'civ5', ai: 'static', conv: 'guest', dir: 0 }),
      npc('hu', { id: 'human', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', x: 30, y: 19, ai: 'static', invuln: 1, conv: 'hu_party', dir: 1 }),
      npc('yokoid', { id: 'envoy', name: 'YOKOID ENVOY', sprite: 'yokoid', port: 'YOKOID', x: 42, y: 19, ai: 'static', invuln: 1, conv: 'envoy', dir: 1 }),
      pr('dyslexio', { id: 'dystv', x: 36, y: 10, label: 'A TELEVISION ON A CART' }),
      light(6, .8, { x: 35, y: 18, col: '#ffe8c0' }), light(4, .7, { x: 34, y: 10 }), light(3, .5, { x: 14, y: 9 }), light(3, .4, { x: 57, y: 16 }), light(3, .5, { x: 58, y: 40, col: '#60ff90' }), light(4, .6, { x: 35, y: 34 }), light(3, .4, { x: 18, y: 40 }), light(3, .4, { x: 56, y: 40 })],
    enter(M, first) {
      F.disguise = invFind('assistpass') ? 'pass' : invFind('whitesuit') ? 'suit' : null; goalDone('hw_party');
      if (F.disguise && !F.raidSpawned) { rel('player', 'miws', 0); F.disguised = 1; const g = doorById('gate'); if (g) { g.lock = 0; g.unlocked = 1; } if (first) msg(F.disguise === 'pass' ? 'The man at the gate looks at your stage pass and waves you in. Nobody looks at the assistant.' : 'The man at the gate looks at your white suit for a long time. "...Welcome."'); }
      else if (first) { infolink('TOMMY', 'No invite? Over the garden wall then. West side, there\'s a low spot. The suits will shoot you, Carl. The suits ALWAYS shoot you.'); }
    },
    tick(M) {
      // in disguise, a suit who sees you somewhere restricted blows your cover
      if (F.disguised) { const restricted = (P.x > 6 && P.x < 24 && P.y > 4 && P.y < 16) || (P.x > 48 && P.y < 32 && P.x < 66) || (P.y > 34 && P.x > 48);
        if (restricted) for (const e of M.ents) if (e.k === 'npc' && e.team === 'miws' && e.restricted && !e.dead && !e.down && e.seesP) { F.disguised = 0; rel('player', 'miws', -1); bark(M, e, 'spot', 1); msg('COVER BLOWN.'); sfx('alarm'); for (const n of M.ents) if (n.team === 'miws' && n.ai === 'guard') { n.state = 'combat'; n.lastSeen = [P.x, P.y]; } break; } }
      // the auction starts when Carl walks into the ballroom
      if (!F.auctionDone && P.x > 24 && P.x < 47 && P.y > 14 && P.y < 30 && !G.ui && !CV.active) run(() => startConv('auction', null));
      // after the vault talk and the raid, the Consulate collects the pod
      if (F.vaultTalk && F.raid2 && !F.hwDone && !M.ents.some(e => e.k === 'npc' && (e.team === 'invader') && !e.dead && !e.down && e.y > 34)) { F.hwDone = 1; run(hwCollect); }
    },
  });
  const d = MAPS.hw_mansion; const rows = d.grid.split('\n'); const put = (x, y, c) => { const r = rows[y].split(''); r[x] = c; rows[y] = r.join(''); }; put(10, 36, '1'); put(60, 36, '2'); put(60, 46, '3'); put(10, 46, '4'); d.grid = rows.join('\n');
}
async function hwCollect() {
  await delay(1.5);
  await startConv(async () => {
    await T('N', 'Footsteps on the stairs. Even. Unhurried. Normal.');
    await T('HUMAN', 'Hello. I am a normal human. I am here for the Commissioner\'s property.');
    await T('CARL', 'It\'s- it\'s not property. I don\'t know what it is. Nobody knows what it is. Doesn\'t that bother anybody?');
    await T('HUMAN', 'No. Be yourself.');
    await T('N', 'Four Consulate men in good suits lift the pod like pallbearers and carry it up the stairs. It ticks once on the way out. Nobody else seems to hear it.');
    await T('HUMAN', 'The Commissioner says thank you. The Commissioner says come to the Tower. The Commissioner says there is a problem with the lock.');
  }, null);
  const p = find('thepod'); if (p) removeEnt(P.map, p);
  goalDone('hw_vault'); goalDone('hw_hold'); goalDone('hw_mansion', 1500); goal('lt_tower', 'Report to the Commissioner at the Tower. The pod is "having a problem with the lock."');
  F.mansionOpen = 1; restoreNormalcy(1, 'Mr. White cleans up his own party');
  infolink('PILOTX', 'They took it Downtown. Okay. Okay. That buys us a week. Maybe.');
}
CONV.ghost_party = async () => { await T('GHOST', pick(['Kid! You made it! Watch the second movement. I\'m playing it slow. Somebody asked me to.', 'This crowd. Ugh. They don\'t clap. They just absorb.', 'Did you see White? A man who dresses like that has never once been to a good party.'])); };
CONV.guest = async () => { await T('N', pick(['"Is it really from Nevada?" asks a Grey with a cocktail. "Everything is from Nevada if you go back far enough."', '"I heard it\'s the First Visitor," whispers a woman whose face slides when she smiles. "I heard it\'s a bomb," says her date. "Same thing," she says.', '"You\'re the streamer! My kids love you. They think you\'re a cartoon."', '"Be normal," someone says, laughing, and everyone laughs, and nobody is.'])); };
CONV.miws_party = async () => { await T('N', pick(['"Enjoy the party, sir."', '"This area is for staff."', '"You were never here, sir. That is a compliment, at this party."'])); };
CONV.hu_party = async () => { await T('HUMAN', pick(['Hello. I am here to bid the Normalcy.', 'I am enjoying the party. I can tell because I am standing still.'])); };
CONV.envoy = async () => {
  if (F.envoyTalk) { await T('ENVOY', 'The Empress will see you, when you are ready. Little Tokyo. Look up.'); return; }
  F.envoyTalk = 1;
  await T('ENVOY', 'You are the one the Empress watches. The streamer.');
  await T('CARL', 'You look like- are you a Yokoid? Like, from the Gatebox, like a, an assistant-');
  await T('ENVOY', 'We are software, wearing bodies, wearing faces. We hide too. Not from humans. From the visitors. If they knew how many of us there were, they would want to open us.');
  await T('ENVOY', 'The Empress bids that the box stays shut. The Empress knows something about boxes. When you have nowhere else to go, come to Little Tokyo.');
};
