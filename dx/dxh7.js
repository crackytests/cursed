'use strict';
// ================= HUB 7: AKIHABARA (Hong Kong) =================
// Neon and rain. Two streaming crews at war over a glass sword shaped like a bong. Gatebox Tower over all of it, selling company.
HUBS.akiba = {
  name: 'AKIHABARA',
  tick(M) { if (F.akiba && !F.killswitchOff && frame % 5400 === 2700) { post.flash = .3; msg('SPECIES REVIEW: PENDING... PENDING...'); chatSay(pick(['the review timer...', 'carl hurry', 'his legs are glitching']), 1); for (const k of ['legL', 'legR']) P.parts[k] = Math.max(20, P.parts[k] - 8); } },
  provoke(M, e) { if (e.team === 'redchat' || e.team === 'lurker') F['war_' + e.team] = 1; },
};
defSpeaker('TAKAHASHI', { name: 'TAKAHASHI', col: hex('#40e0d0'), voice: [760, 160] });
defSpeaker('BIGRED', { name: 'BIG RED', col: hex('#ff5050'), voice: [340, 60], port: 'redchat' });
defSpeaker('SILENT', { name: 'THE SILENT ONE', col: hex('#40ff80'), voice: [100, 0], port: 'lurker' });
defSpeaker('IDOL', { name: 'IDOL LINDA', col: hex('#ffa0d0'), voice: [1000, 60] });
defSpeaker('MAID', { name: 'MAID', col: hex('#ffd0e0'), voice: [1100, 40], port: 'civ4' });
defSpeaker('RECEPT', { name: 'RECEPTIONIST YK-9', col: hex('#c0d8ff'), voice: [950, 10], port: 'YOKOID' });

// ---------- texts ----------
txt('ak_poster', 'POSTER', 'MISSING\n\nBOY, AGE 9. SAILOR SUIT, RED NECKERCHIEF. ANSWERS TO "KID." LAST SEEN NEAR A PUBLIC TOILET IN SHINJUKU, ASKING TO USE IT.\n\nIF FOUND, PLEASE LET HIM GO TO THE BATHROOM.\n\n(The poster is old. Someone has added a sticker over the corner: a little pink Gatebox logo.)', { onRead: () => { F.kidPoster = 1; } });
txt('ak_gbad', 'GATEBOX BILLBOARD', 'GATEBOX\n"SHE NEVER LEAVES."\n\nNow with ICARUS cloud. Your companion learns what you were about to say, so you never have to finish saying it.\n\nFree for Buffered households.');
txt('ak_bong', 'MUSEUM CARD (STOLEN)', 'THE DRAGON\'S BONG\n\nForged in Akihabara in 1994 by a glassblower who wanted to make a sword and a bong-maker who wanted to make a bong. They shared a kiln. Neither would give in.\n\nThe result is a perfect sword that is also a perfect bong. It was the first object ever smoked on a live stream. Both the Red Chat and the Lurkers claim it as the founding relic of their community.\n\nBoth are right. That is the whole problem.');
txt('ak_icarus', 'GATEBOX INTERNAL: ICARUS', 'ICARUS // CLOUD SERVICES // INTERNAL\n\nEach companion runs a predictive model of its owner. The model finishes the owner\'s sentences. Over time, the owner stops finishing them.\n\nThis is the product working.\n\nThe unused predictive capacity of the owner ("potential") is uploaded to ICARUS and pooled. Pooled potential is shipped to the client facility below Nevada as power.\n\nSide effect: in roughly 4% of households, the owner stops entirely ("the Buffering"). Legal recommends we stop calling this a side effect.\n\nCountermeasure risk: the Pretend Co. "Prop Pills" product appears to restore potential by inducing the user to pretend. Recalled. Do not let this become a story.', { onRead: () => { F.readIcarus = 1; if (!F.icarusSP) { F.icarusSP = 1; giveSP(250, 'the truth'); } addNote('ICARUS: companions finish people\'s sentences until they can\'t. The unused "potential" is pooled and shipped below Nevada as power. The Buffering is the product working.'); } });
txt('ak_redcube', 'DATACUBE', 'Pink Tower penthouse elevator: 0610. Big Red\'s guy who delivers her ramen got it. Do NOT tell the Lurkers.', { code: '0610', note: 'Pink Tower (Idol Linda) elevator: 0610' });
txt('ak_lurkcube', 'DATACUBE', '...\n...\n...the canal service door to Gatebox: 8008.\n...', { code: '8008', note: 'Gatebox canal service door: 8008' });
txt('ak_bigl5', 'THE BIG LITTER, Chapter 5', 'THE BIG LITTER\nChapter Five: Tokyo Drift (Of A Cat)\n\nI never been to Japan. I mean in the book. In the book I never been. But the kid went, and the kid tells me things, and I put the things in the book, so now in the book I been.\n\nThe kid said it was raining neon. I said rain can\'t be neon. The kid said "you\'re a cat in a trench coat, JB." He had me there.\n\nHe said there was a girl in pink who smiled like a billboard and a man who streamed his own heartbeat. I said that sounded like America with better noodles.\n\nHe didn\'t laugh. He said everybody there was talking and nobody was finishing their sentences.', { onRead: () => { if (!F.bigl5) { F.bigl5 = 1; giveSP(50, 'reading'); } } });
mail('ak_m1', 'yk9', 'reception', 'Visitors', 'Visitors without a Gatebox employee badge are to be smiled at and turned away. Visitors who do not leave are to be smiled at by security.');
mail('ak_m2', 'L-IDOL', 'icarus.ops', 'the seed', 'The root seed is in the lab vault on 3. If anybody touches it, ICARUS forgets who signed what for about an hour. Don\'t let anybody touch it.\n\nAlso: the Denton review is signed with it. Funny, right? The whole "species" thing is one line in my cloud.', { note: 'Idol Linda: the ICARUS root seed (lab vault, level 3) signs the Denton species review.' });
mail('ak_m3', 'facilities', 'staff', 'Canal door', 'The canal service door code is 8008. Yes, we know.', { code: '8008' });

// ---------- conversations ----------
CONV.taka_intro = async (e) => {
  await T('TAKAHASHI', 'CHAT. CHAT. LOOK WHO IT IS. IT\'S HIM. THE GUY. THE ALIEN GUY.');
  await T('CARL', 'I\'m not an— okay. Hi. You\'re Takahashi?');
  await T('TAKAHASHI', 'That\'s my name, that\'s my stream, that\'s my lab, that\'s my noodles, don\'t touch the noodles. Sit, sit. My chat wants to see you.');
  await T('N', 'Three CRT monitors behind Takahashi scroll with chat messages. Carl\'s infolink chat scrolls too. For a moment the two chats are scrolling the same words.');
  chatSay('wait is that the other chat', 1); chatSay('HI OTHER CHAT', 1); chatSay('crossover episode', 1);
  await T('TAKAHASHI', 'Your FATCO guy called me. The face. The sad screen. He says you\'ve got a species review running in your augs. When it completes, the augs flip you to "property" and you can\'t use your own legs.');
  await T('CARL', 'That\'s happening? To my legs? Right now?');
  await T('TAKAHASHI', 'Little by little! Like a loading bar! I can cut it out, but it\'s signed with a key. Gatebox\'s key. ICARUS\'s root seed. It\'s in a vault in Gatebox Tower, lab level. Get me the seed, I unsign you.');
  const c = await C(['How do I get into Gatebox Tower?', 'Why do you care?', 'Okay. Seed. Vault. Legs.']);
  if (c === 0) { await T('TAKAHASHI', 'Front door wants a badge. The Red Chat steal badges, it\'s like their whole thing. There\'s a canal service door; the Lurkers know the code. Or Idol Linda\'s penthouse has an express line to the top, because of course it does.'); await T('TAKAHASHI', 'Problem: Red Chat and the Lurkers are at war. Over a bong. Look, I don\'t make the culture, I stream it.'); }
  if (c === 1) { await T('TAKAHASHI', 'Because the whole thing\'s a stream, man. Gatebox, ICARUS, your FATCO, all of it. Everybody watching, nobody finishing a sentence. I want to unplug it. All of it. Turn it off. Go outside.'); await T('CARL', 'You\'re a streamer.'); await T('TAKAHASHI', 'I know! It\'s complicated! I\'m complicated! Chat, am I complicated? Chat says yes.'); F.takaDark = 1; }
  goal('ak_seed', 'Get the ICARUS root seed from the lab vault in Gatebox Tower.');
  goal('ak_way', 'Find a way into Gatebox Tower: a Red Chat badge, the Lurkers\' canal code, or Idol Linda\'s penthouse.', 1);
  F.takaMet = 1; e.conv = 'taka2';
};
CONV.taka2 = async (e) => {
  if (F.hasSeed && !F.killswitchOff) {
    await T('TAKAHASHI', 'THE SEED. CHAT, HE GOT THE SEED. Okay. Hold still. This is going to feel like nothing, and then like a sneeze, and then like nothing.');
    await T('N', 'Takahashi plugs the chip into a CRT the size of a small car. Lines of green text fall down every screen in the room. Carl sneezes.');
    await T('TAKAHASHI', 'Done. Unsigned. You\'re nobody\'s property. You\'re also not legally a species, which, welcome to the club. Me neither, I checked.');
    F.killswitchOff = 1; goalDone('ak_seed2'); goalDone('ak_seed', 600); msg('SPECIES REVIEW: CANCELLED'); chatSay('LEGS SAVED', 1); chatSay('carl is free', 1);
    ITEMS.idcard.desc = 'SPECIES: (blank). The word has been unsigned. The card is just a card now: a photo of Carl, a stamp, a peeling corner. He keeps it anyway, or doesn\'t.';
    await T('TAKAHASHI', 'Now, the scary part. That seed? It talks to something big. All that "potential" ICARUS takes from people gets shipped somewhere under Nevada. Power for a machine.');
    await T('TAKAHASHI', 'You want my advice? Turn it off. Turn ALL of it off. Gatebox, ICARUS, FATCO, my stream, your stream. Everybody goes outside and finishes a sentence. That\'s my dream. Free chat. Free from chat.');
    await T('CARL', 'That sounds like the end of the world.');
    await T('TAKAHASHI', 'It sounds like the end of A world. Big difference. One letter.');
    await T('TAKAHASHI', 'One more thing. There\'s a guy in Las Vegas who knows ICARUS from before it was ICARUS. Old school. Magic school. Runs a casino. Calls himself a ghost. He\'s on the infolink channels sometimes, singing. Badly.');
    goal('ak_vegas', 'Fly the A.S.S. to Las Vegas and find the "ghost" who runs a casino.');
    F.akibaDone = 1;
    return;
  }
  await T('TAKAHASHI', pick(['The seed, man. Lab vault. Gatebox Tower.', 'Chat says you should sneak. Chat also says you should "go loud." Chat is a coalition.', 'Did you try the noodles? Don\'t try the noodles.']));
};
CONV.bigred = async (e) => {
  if (F.bongTo === 'red') { await T('BIGRED', 'THE BONG IS HOME. CHAT IS HOME. Here, the badge, take it, take two. Raid the tower for me.'); return; }
  if (!e.met) { await T('BIGRED', 'RAID! RAID! ...Oh. It\'s one guy. One small guy. What\'s up, small guy, welcome to the stream house.'); await T('CARL', 'I need a Gatebox badge.'); await T('BIGRED', 'Everybody needs something. I need the Dragon\'s Bong back. Idol Linda took it, and she told everybody the Lurkers did it, and the Lurkers told everybody we did it, and now we\'re at war over a thing neither of us has.'); }
  const c = await C([{ t: 'Give him the Dragon\'s Bong.', if: () => invFind('w_bong') && !F.bongTo }, 'Where\'s the bong now?', '[DENIAL] I\'m a Gatebox employee. Normal. Human. Lost my badge.', 'What if I ended the war?', 'Later.']);
  if (c === 0) { removeItem(invFind('w_bong')); F.bongTo = 'red'; await T('BIGRED', 'OH MY GOD. CHAT. CHAT. THE BONG. IT\'S BACK. ...Okay. You know what? It doesn\'t want to stay here. It\'s been looking at you this whole time. Keep it. It chose you. Here\'s the badge.'); giveItem('w_bong'); F.gbBadge = 1; goalDone('ak_bongq', 400); goalDone('ak_way', 200); addNote('Red Chat gave you a Gatebox employee badge. The front desk will let you through.'); }
  else if (c === 1) { await T('BIGRED', 'Pink Tower. Penthouse. Display case. She keeps it next to a picture of herself holding it. Elevator code is on a cube somewhere in this house, if you\'re nosy, which you are.'); goal('ak_bongq', 'Recover the Dragon\'s Bong from Idol Linda\'s penthouse.', 1); }
  else if (c === 2) { if (sk('denial') >= 2) { await T('BIGRED', '...You know what, I respect the commitment. Here. We stole like forty of these.'); F.gbBadge = 1; goalDone('ak_way', 200); } else { await T('BIGRED', 'You\'re not a Gatebox employee, man. Gatebox employees don\'t have... all that. Respectfully.'); } }
  else if (c === 3) { await T('BIGRED', 'End it? Bring the bong to BOTH of us. At the same time. In the same room. Ha! The Silent One would never.'); F.peaceIdea = 1; }
};
CONV.silent = async (e) => {
  await T('N', 'The Silent One sits in the dark in front of an arcade cabinet, hood up. They don\'t speak. They type. The words appear on the cabinet screen.');
  if (F.bongTo === 'lurk') { await T('SILENT', '>> keep it. it watched you the whole time. code: 8008. go.'); return; }
  await T('SILENT', '>> ...');
  await T('SILENT', '>> you\'re the one with the loud chat.');
  await T('CARL', 'They\'re not that loud. Okay, they\'re loud.');
  const c = await C([{ t: 'Give them the Dragon\'s Bong.', if: () => invFind('w_bong') && !F.bongTo }, 'I need to get into Gatebox Tower.', { t: 'Big Red says the war could end if you were in the same room.', if: () => F.peaceIdea }, 'Leave.']);
  if (c === 0) { removeItem(invFind('w_bong')); F.bongTo = 'lurk'; await T('SILENT', '>> ...'); await T('SILENT', '>> it\'s warm. it was always warm.'); await T('SILENT', '>> keep it. it watched you the whole time. canal door to gatebox: 8008.'); giveItem('w_bong'); learnCode('8008'); addNote('Lurkers: Gatebox canal service door 8008.'); goalDone('ak_bongq', 400); goalDone('ak_way', 200); }
  else if (c === 1) { await T('SILENT', '>> bring us what was taken. then we talk.'); goal('ak_bongq', 'Recover the Dragon\'s Bong from Idol Linda\'s penthouse.', 1); }
  else if (c === 2) { await T('SILENT', '>> ...'); await T('SILENT', '>> if he comes. without his chat.'); await T('SILENT', '>> he won\'t.'); F.peaceSilent = 1; if (invFind('w_bong') && F.peaceIdea) { await T('CARL', 'What if I bring the bong, and him, and nobody streams it?'); await T('SILENT', '>> ...'); await T('SILENT', '>> nobody has ever asked that.'); await T('SILENT', '>> yes.'); F.peace = 1; goalDone('ak_bongq', 600); goalDone('ak_way', 300); giveSP(400, 'diplomacy'); learnCode('8008'); F.gbBadge = 1; await T('N', 'Later that night, under the canal bridge, Big Red and the Silent One sit on either side of the Dragon\'s Bong in the rain and do not say anything for forty minutes. Nobody streams it. It is the most watched thing that never aired.'); chatSay('...', 1); chatSay('peace', 1); chatSay('they didnt stream it', 1); for (const t of ['redchat', 'lurker']) rel(t, 'lurker' === t ? 'redchat' : 'lurker', 0); rel('redchat', 'lurker', 0); } }
};
CONV.idol = async (e) => {
  await T('IDOL', 'Oh! A fan! You came all the way up here. Nobody comes all the way up here. That\'s what the express elevator is for.');
  await T('CARL', 'You\'re... you look like Linda. CEO Linda.');
  await T('IDOL', 'I am Linda! One of us. The one that smiles. The board needed somebody to sell companionship, and companionship is mostly smiling, and smiling is mostly not stopping.');
  await T('IDOL', 'Do you know what it costs, never stopping? It costs everybody else\'s smiles. ICARUS takes the part of you that runs ahead, and gives it to me, and I spend it on a song.');
  const c = await C(['Give me the bong.', 'Does that bother you? Taking it?', '[DENIAL] I\'m just a normal fan. Normal human fan.']);
  if (c === 1) { await T('IDOL', 'I was a woman once. I wanted to sing. I got a stage the size of Japan. Nobody asked me if I wanted the audience to be... like this. You don\'t get to choose your audience. You know that.'); await T('CARL', '...Yeah. I know that.'); F.idolTalk = 1; }
  if (c === 2) { await T('IDOL', 'Aww. That\'s the sweetest lie anyone\'s told me in years. No.'); }
  await T('IDOL', 'You want the bong, cutie. Everybody wants the bong. Security! We have a fan who wants to touch the merchandise.');
  for (const n of P.map.ents) if (n.k === 'npc' && n.team === 'gatebox') { n.hostile = 1; n.state = 'combat'; n.target = P; }
  e.ai = 'guard'; e.team = 'gatebox'; e.hostile = 1; e.state = 'combat'; e.target = P; e.wpn = 'lindabeam'; e.invuln = 0;
};
CONV.maid = async (e) => { await T('MAID', pick(['Welcome home, master! ...Sorry. Welcome home, sir? Welcome home, um. Welcome home!', 'Our special today is an omelet with your face drawn on it. I can draw your face. I can try.'])); await shopUI({ name: 'PRETEND MAID CAFE', items: [['soda', 4], ['candy', 4], ['chips', 5], ['medkit', 60, 3], ['biocell', 50, 3]] }, e); };
CONV.recept = async (e) => {
  await T('RECEPT', 'WELCOME TO GATEBOX. SHE NEVER LEAVES. MAY I SEE YOUR EMPLOYEE BADGE?');
  if (F.gbBadge) { await T('CARL', 'Yeah. Here. It\'s me. That\'s my face. I work here.'); await T('RECEPT', 'THE PHOTO IS OF A DIFFERENT PERSON.'); await T('CARL', 'I got a haircut.'); await T('RECEPT', '...ACCESS GRANTED. HAVE A NORMAL DAY.'); F.gbLobbyOk = 1; const d = doorById('gbsec'); if (d) { d.unlocked = 1; openDoor(P.map, d, P); } for (const n of P.map.ents) if (n.k === 'npc' && n.team === 'gatebox') n.watchful = 0; }
  else { await T('CARL', 'I left it. In my other coat.'); await T('RECEPT', 'PLEASE RETURN WITH YOUR OTHER COAT.'); }
};
CONV.ramen = async (e) => { await T('RAMEN', 'Ramen! Real ramen! Not ICARUS ramen!'); await shopUI({ name: 'RAMEN STAND', items: [['chips', 3], ['soda', 2], ['liquor', 5]] }, e); };
defSpeaker('RAMEN', { name: 'RAMEN MAN', col: hex('#ffc080'), voice: [380, 30], port: 'civ5' });

// ---------- start ----------
function startAkiba() { G.hub = 'akiba'; G.hubIdx = 7; F.akiba = 1; gotoMap('akiba_roof', 'land'); post.fade = 0; setTimeout(autoSave, 50); setTimeout(() => { infolink('TAKAHASHI', 'YO. CHAT. The alien guy\'s on my roof. CARL. Come down to Junk Takahashi, south side, by the canal. Bring your face. Bring your legs while you still can.'); goal('ak_taka', 'Find Takahashi\'s shop, Junk Takahashi, by the canal.'); }, 600); }

// ---------- MAP: the roof ----------
{
  const g = mk(30, 18, '"');
  g.rect(2, 2, 26, 14, '=', ':'); g.stamp(3, 3, `
........................
...aaaa.................
.......................F
...........L............
........................
..K.K.............E.....
........................
.....u..................
....................K...
.......M..........L.....
........................
.....................s..`);
  defMap('akiba_roof', { name: 'ROOFTOP', title: 'AKIHABARA', sub: 'TOKYO - ROOFTOP HELIPAD - 22:40', hub: 'akiba', music: 'akiba', f: ['concrete', 'neon'], w: ['concrete'], amb: .14, shadow: '#08041a', mem: '#14082a', out: 1, rain: 2,
    grid: g.str().replace(/"/g, ' '),
    key: { a: pr('ass', { label: 'THE A.S.S.', frob: async () => { if (F.akibaDone) await flyToVegas(); else msg('Not yet. Takahashi first.'); } }), s: exitTo('akiba_streets', 'roofdown', { frobbable: 1, label: 'FIRE ESCAPE (STREET)', verb: 'CLIMB DOWN' }), E: reader('ak_gbad', { p: 'sign', label: 'GATEBOX BILLBOARD' }), u: item('a_10mm', 1) },
    ents: [spawnPt('land', Math.PI / 2, { x: 8, y: 7 }), spawnPt('roofup', -Math.PI / 2, { x: 24, y: 13 })],
  });
}
// ---------- MAP: the streets ----------
{
  const g = mk(96, 60, ':');
  g.fill(0, 18, 96, 2, '.'); g.fill(0, 27, 96, 2, '.'); for (let x = 2; x < 96; x += 6) g.fill(x, 23, 3, 1, '`');            // sidewalks, lane marks
  for (const x of [30, 62]) for (let y = 20; y < 27; y += 2) g.put(x, y, ';');                                                      // crosswalk stripes
  // Gatebox Tower (northeast) and its plaza
  g.fill(58, 0, 38, 18, '.'); g.rect(64, 1, 28, 13, '$'); g.fill(76, 13, 4, 1, 'g'); g.fill(70, 15, 16, 2, '~'); g.put(77, 15, 'I');
  for (const x of [60, 66, 88, 94]) g.put(x, 15, 'n'); g.put(62, 9, 'E'); g.put(92, 9, 'E');
  // Pink Tower (northwest): walk-in lobby, elevator
  g.rect(3, 1, 22, 16, '%'); g.fill(4, 10, 20, 6, ','); g.fill(4, 9, 20, 1, '%'); g.put(13, 16, '+'); g.put(12, 9, 'e'); g.put(14, 10, 'k'); g.stamp(5, 11, `
P.........D.......
.....d......h.....
..Q........Q......
..................`);
  // the west block: Red Chat's stream house
  g.rect(3, 30, 22, 14, '%'); g.fill(12, 30, 3, 1, 'r'); for (const x of [6, 10, 16, 20]) g.put(x, 29, 'n');
  // the market: maid cafe (walk-in), stalls, ramen, Takahashi's shop
  g.rect(33, 30, 14, 9, '%', ','); g.put(45, 30, '+'); g.stamp(34, 31, `
V.V.V.....Y.
............
.H.h..H.h...
....m.......
.H.h..H.h..P
............
P.......Q...`);
  for (const [x, y] of [[50, 31], [53, 31], [56, 31], [50, 36], [56, 36]]) g.put(x, y, 'k2');
  g.put(53, 36, 'R2'); g.rect(48, 40, 12, 6, '%'); g.put(53, 40, 't');
  // the east block: the PRETEND ZONE arcade (walk-in), the stairs down to the Lurkers
  g.rect(64, 30, 28, 14, '%', '`'); g.fill(76, 30, 3, 1, '.'); g.stamp(65, 31, `
A.A.A.A.A.A.A.A.A.A.A.A.A.
..........................
..A.A.A.A.....A.A.A.A.....
...........w..............
..A.A.A.A.....A.A.A.A.....
..........................
.................l.....z..
A.A.A.A.A..........A.A.A..
..........................
.....v....................
.............L............
..........................`);
  // the Kanda canal (south) with a bridge and the service tunnel
  g.fill(0, 47, 96, 2, '~'); g.fill(0, 49, 96, 6, '"'); g.fill(0, 55, 96, 1, '~'); g.fill(0, 56, 96, 4, '.');
  g.fill(38, 47, 6, 9, ';'); g.put(88, 46, 'c'); g.put(10, 57, 'T'); g.put(70, 57, 'T'); g.put(24, 58, 'H'); g.put(25, 58, 'h');
  // lamps, lanterns, vending, trash, the poster
  for (const [x, y] of [[8, 19], [22, 19], [36, 19], [48, 19], [74, 19], [88, 19], [14, 28], [28, 28], [44, 28], [60, 28], [80, 28], [92, 28], [20, 46], [60, 46], [80, 45]]) g.put(x, y, 'n');
  for (const [x, y] of [[27, 17], [31, 17], [47, 29], [61, 29], [2, 44], [94, 44]]) g.put(x, y, 'Y');
  for (const [x, y] of [[33, 45], [46, 45], [62, 45], [26, 30]]) g.put(x, y, 'u');
  g.put(30, 17, 'p'); g.put(26, 16, 's'); g.put(31, 45, 'E2');
  // waypoints
  g.put(4, 24, '1'); g.put(28, 24, '2'); g.put(66, 24, '3'); g.put(92, 24, '4'); g.put(30, 52, '5'); g.put(60, 57, '6');
  const grid = g.str().replace(/k2/g, 'K').replace('R2', 'q').replace('E2', 'x');
  defMap('akiba_streets', { name: 'AKIHABARA', title: 'AKIHABARA', sub: 'CHUO-DORI - RAIN', hub: 'akiba', music: 'akiba', f: ['road', 'neon', 'dock', 'road', 'neon'], w: ['neon', 'brick', 'glass'], amb: .16, shadow: '#0a0420', mem: '#160a30', out: 1, rain: 1,
    grid,
    key: {
      g: exitTo('gatebox_tower', 'front'), n: pr('neonlamp'), E: reader('ak_gbad', { p: 'sign', label: 'GATEBOX BILLBOARD' }),
      e: exitTo('idol_apt', 'lift', { when: () => P.codes['0610'] || F.pinkLift, no: 'The penthouse elevator wants a code.' }), k: keypad('0610', null, { label: 'ELEVATOR KEYPAD', onOpen: () => { F.pinkLift = 1; } }),
      d: npc('gatebox', { id: 'doorman', name: 'DOORMAN', ai: 'static', team: 'gatebox', dir: 1, talk: ['Residents only.', 'Miss Linda is not receiving fans tonight.'] }),
      r: exitTo('redchat_hq', 'front'), m: npc('civ', { id: 'maid', name: 'MAID', sprite: 'civ4', port: 'civ4', conv: 'maid', ai: 'static', dir: 1 }),
      K: pr('kiosk'), q: npc('civ', { id: 'ramen', name: 'RAMEN MAN', sprite: 'civ5', port: 'civ5', conv: 'ramen', ai: 'static', dir: 1 }),
      t: exitTo('takahashi_lab', 'front'),
      A: pr('arcade'), w: npc('lurker', { dir: 1, look: 1 }), l: npc('lurker', { dir: 2, look: .8 }), z: exitTo('lurker_den', 'stairs', { frobbable: 1, label: 'STAIRS DOWN (LURKERS ONLY)', verb: 'GO DOWN' }), v: npc('lurker', { route: 'r2' }),
      c: [pr('manhole'), exitTo('akiba_canal', 'street', { frobbable: 1, label: 'CANAL SERVICE TUNNEL', verb: 'CLIMB DOWN' })],
      p: npc('cop', { ai: 'static', dir: 1 }), s: exitTo('akiba_roof', 'roofup', { frobbable: 1, label: 'FIRE ESCAPE (ROOF)', verb: 'CLIMB' }),
      x: reader('ak_poster', { p: 'poster', label: 'MISSING POSTER' }),
    },
    routes: { r1: '1,2', r2: '3,4', r3: '5,6' },
    ents: [
      spawnPt('roofdown', Math.PI / 2, { x: 27, y: 18 }), spawnPt('gb_out', Math.PI / 2, { x: 77, y: 18 }), spawnPt('idol_out', Math.PI / 2, { x: 13, y: 17 }), spawnPt('red_out', Math.PI / 2, { x: 13, y: 28 }), spawnPt('taka_out', -Math.PI / 2, { x: 53, y: 38 }), spawnPt('lurk_out', Math.PI / 2, { x: 88, y: 37 }), spawnPt('canal_out', Math.PI / 2, { x: 88, y: 44 }),
      npc('redchat', { route: 'r1' }), npc('redchat', { x: 8, y: 26, dir: 0, look: 1 }), npc('redchat', { x: 20, y: 28, dir: 1, look: .7 }),
      npc('gatebox', { x: 72, y: 16, dir: 1, look: .5, watchful: 1 }), npc('gatebox', { x: 84, y: 16, dir: 1, look: .5, watchful: 1 }), npc('gatebox', { x: 76, y: 6, ai: 'static', dir: 1, cond: () => false }),
      npc('civ', { x: 40, y: 22, wander: 8, sprite: 'civ1', talk: ['Sumimasen.', 'Is that a cosplay? It\'s really good.', 'Have you tried the maid cafe? Don\'t.'] }), npc('civ', { x: 56, y: 25, wander: 8, sprite: 'civ4' }), npc('civ', { x: 18, y: 22, wander: 6, sprite: 'civ2' }), npc('civ', { x: 70, y: 22, wander: 6, sprite: 'civ6', talk: ['My girlfriend\'s a Gatebox. She finishes my sentences.', 'I used to finish my own sentences. It was so tiring.'] }),
      npc('buffered', { x: 46, y: 58, ai: 'static', dir: 1 }), npc('buffered', { x: 52, y: 57, ai: 'static', dir: 2 }),
      npc('cop', { route: 'r3' }),
      item('biocell', 1, { x: 90.5, y: 57.5 }), item('lockpick', 1, { x: 4.5, y: 57.5 }), item('a_10mm', 1, { x: 60.5, y: 1.5 }),
      { k: 'chatter', a: 'chat1', b: 'chat2', r: 5, x: 30, y: 25, lines: [['chat1', 'Did you hear? Idol Linda took the Dragon\'s Bong.'], ['chat2', 'Red Chat says the Lurkers took it.'], ['chat1', 'The Lurkers say Red Chat took it.'], ['chat2', 'The Lurkers don\'t say anything.'], ['chat1', 'Exactly. That\'s how you know.']] },
      npc('civ', { id: 'chat1', x: 31, y: 25, ai: 'static', dir: 0, sprite: 'civ1' }), npc('civ', { id: 'chat2', x: 33, y: 25, ai: 'static', dir: 2, sprite: 'civ6' }),
    ],
  });
}
// ---------- MAP: Takahashi's lab ----------
{
  const g = mk(26, 16, '%');
  g.fill(1, 1, 24, 6, '`'); g.fill(1, 8, 24, 7, ':'); g.fill(1, 7, 24, 1, '%'); g.put(6, 7, '+');
  g.stamp(1, 1, `
S.S.S.S..........R.R.R.R
......................h.
.V.V....K.......t.......
..........M.............
.....................P..
P.......S.S.............`);
  g.stamp(1, 8, `
c.c.c.c.c..........R.R.R
........................
.....T..................
........D...............
..h.....................
........B.......u.......
........................`);
  g.fill(12, 15, 2, 1, 'x');
  defMap('takahashi_lab', { name: 'JUNK TAKAHASHI', title: 'AKIHABARA', sub: 'JUNK TAKAHASHI - "WE FIX STREAMS"', hub: 'akiba', music: 'convo', f: ['tatami', 'concrete', 'tile', 'tile', 'tile'], w: ['wood', 'brick'], amb: .26, shadow: '#0a0414',
    grid: g.str(),
    key: { x: exitTo('akiba_streets', 'taka_out'), c: pr('crt'), t: npc('civ', { id: 'shopkeep', name: 'SHOPKEEPER', sprite: 'civ5', ai: 'static', dir: 1, shop: { name: 'JUNK TAKAHASHI (RETAIL)', items: [['multitool', 30, 6], ['lockpick', 30, 4], ['biocell', 35, 5], ['w_empnade', 120, 3], ['w_scramnade', 160, 2], ['mod_las', 260, 1], ['mod_sco', 220, 1], ['upg', 600, 1]] } }),
      T: npc('civ', { id: 'taka', name: 'TAKAHASHI', sprite: 'takahashi', port: 'TAKAHASHI', conv: 'taka_intro', ai: 'static', dir: 1 }),
      u: reader('ak_bigl5', { p: 'trash', label: 'A PAPERBACK IN THE TRASH' }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 12, y: 13 }), light(6, .5, { x: 12, y: 3 }), light(6, .6, { x: 6, y: 10 }), npc('repairbot', { x: 22, y: 12, ai: 'static' }), npc('medbot', { x: 3, y: 12, ai: 'static' })],
    enter(M, first) { if (first) goalDone('ak_taka', 100); },
  });
}
// ---------- MAP: Red Chat's stream house ----------
{
  const g = mk(28, 18, '%');
  g.fill(1, 1, 26, 16, '`'); g.stamp(1, 1, `
c.c.c.c.c.c.c.c.c.c.c.c.c
.........................
...p.......b.......p.....
.........................
..Q....H.h....H.h....Q...
.........................
.............T...........
.........................
.....D......d.....D......
...h..............h......
.........................
..N.N..........p.....N.N.
.........................
...........u.............
.....P.............P.....
...........xx............`);
  defMap('redchat_hq', { name: 'STREAM HOUSE', title: 'AKIHABARA', sub: 'RED CHAT STREAM HOUSE', hub: 'akiba', music: 'combat', noCombatMusic: 1, f: ['carpet', 'neon'], w: ['neon', 'brick'], amb: .3, shadow: '#140408',
    grid: g.str(),
    key: { x: exitTo('akiba_streets', 'red_out'), c: pr('crt'), p: npc('redchat', { ai: 'static', dir: 1, team: 'redchat', talk: ['RAID!', 'Chat, chat, look at this guy.', 'You a Lurker? You don\'t look like a Lurker. Lurkers don\'t look like anything.'] }), b: npc('redchat', { id: 'bigred', name: 'BIG RED', port: 'redchat', conv: 'bigred', ai: 'static', dir: 1, hp: 120, hpMax: 120 }),
      T: pr('tv'), d: reader('ak_redcube', { p: 'cone', label: 'DATACUBE' }), u: item('credits', 60) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 12, y: 15 }), light(6, .6, { x: 13, y: 4 }), light(6, .6, { x: 13, y: 12 })],
  });
}
// ---------- MAP: the Lurkers' den ----------
{
  const g = mk(24, 16, '#');
  g.fill(1, 1, 22, 14, ':'); g.stamp(1, 1, `
A.A.A.A.A.A.A.A.A.A.A.
......................
..l.....s.........l...
......................
.R.R.R..........R.R.R.
......................
.........c............
......................
..l...............l...
......................
.....N.N....N.N.......
......................
...q..................
.....................z`);
  defMap('lurker_den', { name: 'THE DEN', title: 'AKIHABARA', sub: 'BENEATH THE PRETEND ZONE', hub: 'akiba', music: 'detention', f: ['concrete'], w: ['dark'], amb: .08, shadow: '#000804', mem: '#04140a',
    grid: g.str(),
    key: { A: pr('arcade'), l: npc('lurker', { ai: 'static', dir: 1, talk: ['...', '...', '... (they type something on a handheld. it says "hi")'] }), s: npc('lurker', { id: 'silent', name: 'THE SILENT ONE', port: 'lurker', conv: 'silent', ai: 'static', dir: 1, hp: 120, hpMax: 120 }),
      c: reader('ak_lurkcube', { p: 'cone', label: 'DATACUBE' }), q: warpPart(5), z: exitTo('akiba_streets', 'lurk_out', { frobbable: 1, label: 'STAIRS UP', verb: 'GO UP' }) },
    ents: [spawnPt('stairs', Math.PI, { x: 20, y: 13 }), light(4, .5, { x: 9, y: 3 }), light(3, .5, { x: 4, y: 12 })],
  });
}
// ---------- MAP: Idol Linda's penthouse ----------
{
  const g = mk(36, 22, '%');
  g.fill(1, 1, 34, 20, ','); g.fill(1, 1, 34, 1, 'W'); g.stamp(1, 2, `
P...........I..........I.........
.....Q.Q.......................P.
..................s..............
.H.h..........................b..
........................v........
..Z..............................
.....g.........................g.
..........J.J.J.J.J.J............
.................................
.......D.....................N...
.....c...........i...............
.................................
..g............................g.
.................................
P.........u....................P.
.................................
..............ll.................
.................................
.................................`);
  defMap('idol_apt', { name: 'PINK TOWER PENTHOUSE', title: 'AKIHABARA', sub: 'PINK TOWER - PENTHOUSE', hub: 'akiba', music: 'lounge', f: ['carpet', 'marble'], w: ['neon', 'glass'], amb: .34, shadow: '#1a0614',
    grid: g.str(),
    key: { l: exitTo('akiba_streets', 'idol_out', { frobbable: 1, label: 'ELEVATOR (DOWN)', verb: 'RIDE' }), g: npc('gatebox', { dir: 1, look: .7, team: 'gatebox' }), s: npc('civ', { id: 'idol', name: 'IDOL LINDA', sprite: 'idol', port: 'IDOL', conv: 'idol', ai: 'static', team: 'gatebox', dir: 1, hp: 220, hpMax: 220, armor: .2, onDie: () => { F.idolDead = 1; }, onDown: () => { F.idolDown = 1; } }),
      J: pr('sofa'), v: pr('tank', { label: 'DISPLAY CASE', frob: () => { if (F.bongTaken) { msg('Empty. Just the photo of her holding it.'); return; } F.bongTaken = 1; giveItem('w_bong'); msg('THE DRAGON\'S BONG. It hums.'); chatSay('THE DRAGON\'S BONG', 1); chatSay('sword or bong. both. BOTH.', 1); readText('ak_bong'); } }),
      b: npc('gatebox', { dir: 2, look: .9, team: 'gatebox' }), c: comp([['l-idol', 'smile', { mail: ['ak_m2'] }]], { c: { hackStr: .7 } }), i: pr('locker', { items: [['upg', 1], ['credits', 200]], locked: 1, str: .7, label: 'IDOL\'S SAFE' }), u: item('pills', 2) },
    ents: [spawnPt('lift', -Math.PI / 2, { x: 15, y: 17 }), light(6, .6, { x: 17, y: 5 }), light(6, .6, { x: 17, y: 14 })],
  });
}
// ---------- MAP: the canal tunnel ----------
{
  const g = mk(60, 14, '#');
  g.fill(1, 4, 58, 6, '.'); g.fill(1, 6, 58, 2, '"'); for (const x of [10, 26, 42]) g.fill(x, 5, 2, 4, '.');
  g.stamp(1, 1, `
...
.s.
...`); g.fill(1, 1, 3, 3, '.'); g.put(2, 2, 's');
  g.fill(48, 1, 9, 3, '.'); g.vline(57, 1, 3, '#'); g.put(57, 2, 'd'); g.put(58, 2, 'e'); g.put(56, 3, 'k');
  g.put(20, 4, 'r'); g.put(34, 9, 'r'); g.put(45, 4, 'q'); g.put(14, 9, 'w');
  defMap('akiba_canal', { name: 'CANAL TUNNEL', title: 'AKIHABARA', sub: 'KANDA CANAL SERVICE TUNNEL', hub: 'akiba', music: 'detention', f: ['sewer'], w: ['sewer'], amb: .12, shadow: '#020408',
    grid: g.str(),
    key: { s: exitTo('akiba_streets', 'canal_out', { frobbable: 1, label: 'LADDER (STREET)', verb: 'CLIMB' }), r: npc('rat'), q: npc('spider', { team: 'gatebox' }), w: item('a_tdart', 1),
      d: door({ id: 'gbservice', lock: 1, pick: 0, code: '8008', name: 'GATEBOX SERVICE DOOR', metal: 1 }), k: keypad('8008', 'gbservice'), e: exitTo('gatebox_tower', 'service') },
    ents: [spawnPt('street', 0, { x: 3, y: 3 }), light(4, .6, { x: 53, y: 2 })],
  });
}

// ---------- the seed ----------
ITEMS.seed = { name: 'ICARUS ROOT SEED', w: 1, h: 1, desc: 'A data chip the size of a fingernail, warm as a hand. It signed your species review. It signed a lot of things.', quest: 1 };
// ---------- MAP: Gatebox Tower (lobby, offices, labs) ----------
{
  const g = mk(62, 42, '$');
  g.fill(1, 28, 60, 12, '.'); g.fill(1, 15, 60, 11, ','); g.fill(1, 1, 60, 12, ';');
  g.fill(1, 26, 60, 2, '$'); g.put(30, 27, 'j'); g.put(30, 26, '.'); g.fill(1, 13, 60, 2, '$'); g.put(30, 13, 'o'); g.put(30, 14, '.');
  g.fill(28, 40, 6, 1, 'x'); g.fill(61, 32, 1, 2, 'y'); g.fill(54, 28, 1, 12, '$'); g.put(54, 33, '+'); g.fill(55, 16, 1, 10, '.'); g.put(55, 26, '+'); g.put(55, 27, '.');
  g.stamp(1, 28, `
P.....v.......v.......v......v......v.......v.......
....................................................
..Q.Q.................................Q.Q...........
....................................................
...............V.V.V.V..............................
.................r........................P.........
.......g...............................g............
....................................................
..P......I...........I...........I.........P........
....................................................
....................................................`);
  g.stamp(1, 15, `
D.D...D.D...D.D....c....D.D...D.D...D.D......B.B.B.B.
.h.h...h.h...h.h........h.h...h.h...h.h..............
...........................................N.N.N.....
....q.........................q......................
D.D...D.D...D.D.........D.D...D.D...D.D..............
.h.h...h.h...h.h........h.h...h.h...h.h.....s........
.....................................................
########+##########################+##########.......
..........$...........................$.......d......
..R.R.....$....C..........b....H.h....$..............
..........$...........................$..............`);
  g.stamp(1, 1, `
t.t.t.t.t.t.t.t.t.t.t........##########..............
.............................#........#..............
..m......m.......m...........#...z....#....R.R.R.R...
.............................#........#..............
t.t.t.t.t.t.t.t.t.t.t........###k######....n.........
.....................................................
....w...............w.........................w......
.....................................................
...D.D......c.......D.D.......................R.R.R..
...h........h.......h................................
t.t.t.t.t.t.t.t.t.t.t...................P............`);
  defMap('gatebox_tower', { name: 'GATEBOX TOWER', title: 'GATEBOX TOWER', sub: 'SHE NEVER LEAVES', hub: 'akiba', music: 'fatco', f: ['marble', 'bluecarpet', 'lab'], w: ['white', 'glass', 'lab'], amb: .5, shadow: '#140818', mem: '#1a1030',
    grid: g.str(),
    key: {
      x: exitTo('akiba_streets', 'gb_out'), y: exitTo('akiba_canal', 'street'),
      j: door({ id: 'gbsec', lock: 1, str: .8, name: 'SECURITY GATE', metal: 1 }), o: door({ id: 'gblab', lock: 1, pick: 0, key: 'gblab', name: 'LAB LEVEL', metal: 1 }),
      v: pr('tanksp', { label: 'GATEBOX COMPANION (DISPLAY)', text: 'ak_gbad' }), r: npc('civ', { id: 'recept', name: 'RECEPTIONIST YK-9', sprite: 'yokoid', port: 'YOKOID', conv: 'recept', ai: 'static', team: 'gatebox', dir: 1 }),
      g: npc('gatebox', { dir: 1, look: .7, team: 'gatebox', watchful: 1 }), q: npc('gatebox', { team: 'gbsec', dir: 1, look: 1 }),
      c: comp([['analyst', 'icarus', { mail: ['ak_m1', 'ak_m3'] }]], { c: { hackStr: .4 } }), C: reader('ak_icarus', { p: 'computer', label: 'ICARUS DESIGN DOCUMENT' }),
      s: npc('gatebox', { id: 'labdir', name: 'LAB DIRECTOR', team: 'gbsec', dir: 1, look: .6, wpn: 'npcpistol', keyOnBody: ['gblab', 'GATEBOX LAB KEYCARD'] }),
      d: Object.assign(seccomp([['security', 'smile', { special: [['LAB LEVEL DOOR: UNLOCK', () => { const d = doorById('gblab'); if (d) { d.unlocked = 1; return 'Lab door unlocked.'; } }], ['CAMERAS: OFF', () => { for (const e of P.map.ents) if (e.k === 'cam') e.off = 1; return 'Cameras off.'; }], ['TURRETS: TARGET HOSTILES', () => { for (const e of P.map.ents) if (e.k === 'turret') { e.hacked = 1; e.always = 1; } return 'Turrets now target intruders. You are not an intruder. (Today.)'; }]] }]], { c: { hackStr: .6, team: 'gbsec' } }), { label: 'SECURITY TERMINAL' }),
      b: npc('mj', { dir: 1, look: .8 }), t: pr('tank', { label: 'COMPANION POD' }), m: npc('bioroid', { team: 'mj', ai: 'guard', dir: 1 }), w: npc('mj', { route: 'g1' }), n: npc('mjelite', { dir: 2, look: .8 }),
      z: item('seed', 1, { onTake: () => { F.hasSeed = 1; msg('ICARUS ROOT SEED. Bring it to Takahashi.'); goal('ak_seed2', 'Bring the ICARUS root seed to Takahashi.'); chatSay('THE SEED', 1); setTimeout(() => { triggerAlarm(P.map, null, P.x, P.y, 'mj'); infolink('TAKAHASHI', 'CHAT, THE TOWER JUST LIT UP LIKE A PACHINKO MACHINE. Carl, they know. Get out. Canal door, front door, window, I don\'t care.'); }, 600); } }),
      k: door({ id: 'vault', lock: 1, str: .9, name: 'ICARUS VAULT', metal: 1 }),
    },
    routes: { g1: '1,2' },
    ents: [spawnPt('front', -Math.PI / 2, { x: 30, y: 38 }), spawnPt('service', Math.PI, { x: 58, y: 32 }),
      cam(Math.PI / 2, { x: 30.5, y: 28.3, team: 'gbsec' }), cam(Math.PI / 2, { x: 15.5, y: 15.3, team: 'gbsec' }), cam(Math.PI / 2, { x: 45.5, y: 15.3, team: 'gbsec' }), cam(Math.PI / 2, { x: 30.5, y: 1.3, team: 'mj' }),
      turret({ x: 33, y: 7, ang: Math.PI / 2, team: 'mj' }), turret({ x: 27, y: 7, ang: Math.PI / 2, team: 'mj' }),
      item('biocell', 1, { x: 50.5, y: 22.5 }), item('aug', 1, { x: 52.5, y: 10.5, onTake: () => { const it = P.inv.filter(i => i.id === 'aug' && !i.slot).pop(); if (it) { it.slot = 'torso2'; it.pair = AUG_PAIRS.torso2; } } }), item('upg', 1, { x: 8.5, y: 23.5 }), item('a_plasma', 1, { x: 56.5, y: 3.5 }),
      pr('locker', { x: 48, y: 17, items: [['medkit', 2], ['w_plasma', 1]], locked: 1, str: .6, label: 'SECURITY LOCKER' }),
      light(7, .6, { x: 16, y: 33 }), light(7, .6, { x: 44, y: 33 }), light(6, .4, { x: 16, y: 20 }), light(6, .4, { x: 44, y: 20 }), light(6, .5, { x: 12, y: 6 }), light(6, .5, { x: 50, y: 6 }), light(4, .7, { x: 34, y: 3 })],
    enter(M, first) { rel('player', 'gbsec', F.gbBadge ? 0 : -1); rel('gbsec', 'mj', 1); M.wps['1'] = [8.5, 7.5]; M.wps['2'] = [50.5, 7.5]; if (first && !F.gbBadge) infolink('TAKAHASHI', 'No badge, huh? The front desk will smile at you until you leave. Security past the gate will not smile.'); },
  });
  rel('player', 'gbsec', -1); rel('gatebox', 'gbsec', 1);
}

// login sources (QA pass 2026-10-14)
txt('ak_analystnote', 'STICKY NOTE', 'ANALYST WORKSTATION\nanalyst / icarus\n\n(the password is the project name, because the project is the only thing anyone here remembers)', { login: ['analyst', 'icarus'] });
MAPS.gatebox_tower.ents.push(reader('ak_analystnote', { p: 'cone', x: 12, y: 8, label: 'STICKY NOTE' }));
