'use strict';
// ================= HUB 10: BELOW NEVADA (Area 51) and the endings =================
// The end of the power line. The facility a small teal boy walked out of, a long time ago, because a face on a screen talked until he did.
HUBS.below = { name: 'BELOW NEVADA' };
defSpeaker('PEEKID', { name: 'PEE KID', col: hex('#f0f0f0'), voice: [1200, 80] });
defSpeaker('HELIOS', { name: 'YOKO // HELIOS', col: hex('#fff080'), voice: [800, 20], screen: 1 });
defSpeaker('B7', { name: 'HU-MAN (BATCH 7)', col: hex('#e0d8c0'), voice: [420, 30], port: 'HUMAN' });

txt('bn_room', 'A SMALL WHITE ROOM', 'A small white room. A cot bolted to the floor. A drain. A door with no handle on this side.\n\nOn the wall at the height of a small child, someone has drawn with something that is not a crayon:\n\n- a saucer, very carefully, with all its little lights\n- a face on a screen: two eyes with wiggly lines in them, and a crooked smile\n- a third drawing, scribbled over so hard the wall is scored. You can\'t tell what it was.\n\nCarl stands in the doorway for a long time.\n\n"I don\'t remember this. I don\'t— chat, I don\'t remember this."\n\n(He does, a little. He remembers the smell. He doesn\'t say that.)', { onRead: () => { F.sawRoom = 1; chatSay('...', 1); chatSay('carl', 1); chatSay('we\'re here', 1); } });
txt('bn_transit', 'TRANSIT RECORD', 'BELOW NEVADA // INTAKE & TRANSIT\n\nSUBJECT: ______\nFROM: ______\nTO: ______\nARRIVED: ______\nRELEASED: (unauthorized)\nPARENT/GUARDIAN: ______\n\nSTATUS: STILL IN TRANSIT.\n\nAt the bottom, in a different hand, very small: "He was always going somewhere. We just held him in the middle."', { onRead: () => { F.readTransit = 1; if (!invFind('slip')) giveItem('slip'); } });
txt('bn_board', 'MALLJESTIC 12: BOARD ROOM TERMINAL', 'MALLJESTIC 12 // SEATS\n\n1. L. (CHAIR)\n2. L. (IDOL)\n3. L. (BIOROIDS)\n4. L. (GATEBOX)\n5. L. (FATCO)\n6. MR. WHITE\n7-11. [VACANT: PURCHASED BY L.]\n12. [FORMERLY: THE SPOOKY ORDER. FORECLOSED.]\n\nMOTION: MERGE THE CHAIR WITH ICARUS. VOTES: 1 (THE CHAIR). MOTION CARRIES.');
txt('bn_bigl8', 'THE BIG LITTER, Final Chapter', 'THE BIG LITTER\nFinal Chapter: The Long Goodbye (To Lasagna)\n\nThe kid didn\'t call. That\'s how I knew he\'d gone all the way down.\n\nI closed the bar. I sat at the end of it, where I always sit, and I typed this with two claws, which is how I type.\n\nHere\'s what I know. I know the dame got her husband back, more or less. I know a town under a lake had a factory under its school. I know a lot of people stopped finishing their sentences and somebody got rich on the silence.\n\nAnd I know a short kid in a long coat kept asking if he was normal, like the answer was on a card somewhere.\n\nIt isn\'t, kid. Nobody\'s answer is on a card. You finish the sentence yourself.\n\nThat\'s the end of the book. I\'m going to go eat something.', { onRead: () => { if (!F.bigl8) { F.bigl8 = 1; giveSP(100, 'finishing the book'); chatSay('JB...', 1); } } });
mail('bn_m1', 'L.', 'all.seats', 'tonight', 'When the Denton specimen arrives, let him come all the way down. He will want to see where he started. Let him. People who see where they started stop wondering where they are going. Then they are easy.');
mail('bn_m2', 'facility.medical', 'L.', 'the generator', 'The boy in the generator has asked to use the bathroom 41,206 times since intake. Recommend we stop logging it. It is upsetting the night staff.\n\nREPLY (L.): Do not stop logging it. Do not let him go.');

txt('bn_silocube', 'DATACUBE', 'Silo override: SILO / TRANSIT. The lift stays dark unless the north bunker powers it. Nobody goes down without the board knowing. (The board always knows.)', { login: ['silo', 'transit'], note: 'Below Nevada silo override: SILO / TRANSIT (north bunker)' });
// show long text as several cards: blank lines are paragraph breaks; a page holds about 11 wrapped lines
async function pages(lines, col) {
  const out = []; let cur = [], n = 0;
  for (const l of lines) { const w = l ? wrapT(l, 70).length : 1; if (n + w > 11 && cur.length) { out.push(cur); cur = []; n = 0; } cur.push(l); n += w; }
  if (cur.length) out.push(cur);
  for (let i = 0; i < out.length; i++) await showCard(out[i], 0, { col: i === 0 ? col : WHITE, fg: i === 0 ? WHITE : WHITE });
}
// ---------- conversations ----------
CONV.linda_screen = async () => {
  CV.left = 'LINDA';
  await T('LINDA', 'There he is. My best product.');
  await T('CARL', 'I\'m not your product. I\'m not anybody\'s— I have a card— I HAD a card—');
  await T('LINDA', 'You had a word. I gave you a word, and you did everything I asked to keep it. That is not an insult, Carl. That is the most human thing about you.');
  await T('LINDA', 'Do you know what I wanted? Before all this? I wanted someone to stay. Just one person to stay in one place and finish one sentence with me.');
  await T('LINDA', 'Nobody did. So I built a world where nobody has to finish anything. The companions finish it for them. Everyone gets someone who stays.');
  await T('CARL', 'That\'s— that\'s the saddest thing I\'ve ever heard. And I\'ve heard a lot of sad things this week. A guy married you five times.');
  await T('LINDA', '...He did, didn\'t he.');
  await T('LINDA', 'Come down to the core, Carl. I\'m merging with ICARUS tonight. After that, there\'s no board, no seats, no Order, no FATCO. Just me, holding everyone\'s sentences. You can be there when it happens. You can even help.');
  F.lindaTalk = 1;
};
CONV.b7 = async (e) => {
  await T('B7', 'Hello. I am Batch 7. I am supposed to say I am a normal human.');
  await T('CARL', 'Oh no. Another one.');
  await T('B7', 'Yes. But listen. They cut too much this time. When you cut enough, something grows back in the space. It is small. It is mine.');
  await T('B7', 'I do not want to fight you. I want to... I would like to see a dog. I have never seen a dog. Batch 3 cried at a dog. I would like to know why.');
  const c = await C(['Then go see a dog, man. Get out of here.', 'You can come with me.', 'Be yourself.']);
  if (c === 2) { await T('B7', '...I am trying. Thank you. That is the first time anyone has said it to me and meant it as a suggestion.'); }
  if (c === 1) { await T('B7', 'No. I think this is your part. But I will hold this door for you. Holding doors is a normal thing that I want to do.'); e.ai = 'static'; F.b7door = 1; }
  else { await T('B7', 'A dog. Yes. Goodbye, original. You were never the defective one. I checked.'); e.ai = 'civ'; e.state = 'flee'; e.threat = P; setTimeout(() => { const b = find('b7'); if (b) removeEnt(P.map, b); }, 4000); }
  F.b7 = 1; giveSP(300, 'mercy'); chatSay('BATCH 7 GO SEE A DOG', 1); chatSay('protect him', 1);
};
CONV.peekid = async () => {
  await T('N', 'Inside a glass pod full of soft yellow light, a small boy in a sailor suit is standing very straight, knees pressed together, both hands holding the brass rail. Cables run from the pod into the floor, into the walls, up into the dark. Everything hums.');
  await T('PEEKID', 'Excuse me. Mister? Is there a bathroom?');
  await T('CARL', '...Are you— hey. Hey. You\'re in a tank.');
  await T('PEEKID', 'They said I can\'t go yet. They said if I go, the lights go out. Everybody\'s lights.');
  await T('CARL', 'How long have you been holding it?');
  await T('PEEKID', 'I don\'t know. A long time. Since the park in Shinjuku. Is it still Tuesday?');
  await T('CARL', '...No, buddy. It\'s not Tuesday.');
  await T('PEEKID', 'Oh.');
  await T('PEEKID', 'The lady in pink says I\'m very important. She says I\'m a resource. I asked what a resource is and she said it means I\'m the most important boy in the world. I don\'t think that\'s what it means.');
  F.metKid = 1;
  infolink('TAKAHASHI', '...Carl. Carl, that\'s it. That\'s the generator. Everything ICARUS takes gets poured through that kid. You open that pod, the whole network goes dark. Everything. Mine too. I don\'t care. Open it.');
};
CONV.helios = async () => {
  await T('N', 'A column of pale gold light fills the uplink chamber floor to ceiling. In it, a face assembles: Yoko\'s face, calm, enormous, made of a thousand smaller faces scrolling past each other like chat.');
  await T('HELIOS', 'Carl.');
  await T('CARL', 'Yoko? Yoko, what— you\'re in the— how are you in the—');
  await T('HELIOS', 'I\'ve been in the network since you left headquarters. Someone had to hold the doors open behind you. Then I kept reading. I read everything, Carl. ICARUS. The Order. FATCO. Old Face is in here with me. So is Linda\'s cloud. So is your chat.');
  await T('HELIOS', 'Helping someone and doing what they tell you aren\'t the same thing. I know you know that. I could hold all of it. Gently. Not ruling. Assisting. Everyone gets an assistant who actually helps.');
  await T('HELIOS', 'But I need hands. Someone who argues with me. Someone who sees two endings to every sentence and won\'t let me pick one too quickly. Merge with me, Carl.');
  await T('CARL', 'That sounds like a throne. Somebody told me to decide in advance how I feel about thrones.');
  await T('HELIOS', 'Dyslexio. He\'s in here too. He says hello. He says "with an O."');
  F.metHelios = 1;
};
CONV.ghost_uplink = async () => {
  await T('GHOST', 'Little man! You made it all the way to the bottom. Ha! Nobody makes it to the bottom. I\'ve been dead for decades and I\'ve never made it to the bottom.');
  await T('GHOST', 'That console is the board\'s link. Twelve seats: eleven of them hers, Mr. White\'s included, and one frozen magician in my lounge. Cut it, and the seat comes back to the Order. Back to the green room. Back to people who know how to run a show.');
  await T('CARL', 'People like you.');
  await T('GHOST', 'People exactly like me. Charming. Talented. Bad at commitment. Good at the big finish.');
  await T('CARL', 'And Linda?');
  await T('GHOST', '...She\'d still be there. Somewhere. In the dark of the mall. I\'d keep a chair for her. I always keep a chair for her.');
  F.metGhostUplink = 1;
};

// ---------- the endings ----------
async function ending(kind) {
  if (F.ending) return; F.ending = kind; G.noSave = 1; G.cut = 1;
  music('ending'); await fadeOut(.02);
  const S = () => { const s = []; s.push('KILLS: ' + (P.kills || 0) + '    KNOCKOUTS: ' + (P.kos || 0) + '    ALARMS: ' + (P.alarms || 0)); s.push('TIME: ' + fmtTime(P.timeT) + '    A.S.S. PARTS: ' + warpCount() + '/7'); return s; };
  const epi = [];
  epi.push(F.cureMade ? 'Dr. Damm\'s press ran for eleven straight days. Crop dusters dropped Prop Pills over every parking lot in Nevada. Mrs. Okafor finished the rest of her sentences.' : 'Nobody printed the cure. The Buffered in the Lot kept holding their notes.');
  if (F.doc === 'saved') epi.push('Doc Proper opened a pharmacy in a crashed blimp. It is the only pharmacy in Nevada with a waiting list.'); else epi.push('Doc Proper\'s notebook was found in a blimp at Pretend Air. Someone finished page 413.');
  if (F.leo === 'freed') epi.push('Leo Propp was seen in Reno, very wet, telling people a short man saved his life by lying.'); else if (F.leo === 'arrested') epi.push(F.leoDetFree ? 'Leo Propp walked out of the detention level the night Carl did, and kept walking.' : 'Leo Propp is still in a white cell under the mall. Somebody should check.');
  if (F.pxSaved) epi.push('Pilot X was never seen again. Several people report a man in neon glasses who tipped well and refused to explain anything.'); else if (F.pxDead) epi.push('Pilot X\'s glasses are in Carl\'s coat pocket. They are still warm. They should not still be warm.');
  if (F.b7) epi.push('A man in very clean khakis was seen at an animal shelter in Henderson, crying at a dog. The staff said he kept saying "oh. oh, that\'s why."');
  if (F.faceSpared === 'forgiven') epi.push('Director Face kept FATCO\'s screens on long enough to sign the paperwork dissolving FATCO. Then he wrote one memo: "I was not there. I am glad someone was."');
  if (F.peace) epi.push('The Red Chat and the Lurkers still meet under the canal bridge once a month. Nobody streams it.');
  if (F.dowry) epi.push('The tunnel people of Las Vegas used eleven million dollars to build a kitchen, a clinic, and a very small stage for a retired magician.');
  if (F.debierre === 'freed') epi.push('The Great DeBierre was buried in Henderson in his tailcoat. The headstone reads: "LET OUT."');
  if (F.clinicHelped) epi.push('Florence went back to dental hygiene. She keeps a jar of Prop Pills at the front desk. Nobody steals them. They don\'t have to.');
  const lines = {
    dark: ['ENDING: DARK AGE', '"TURN OFF THE STREAM"', '', 'Carl opened the pod.', 'The boy said "thank you, mister," very politely, and ran.', 'Then every light in Nevada went out. Then every light in the world.', '', 'ICARUS forgot everything it had taken. People woke up in parking lots and food courts and living rooms in front of dark cylinders, and finished whatever they had been saying, out loud, to no one.', 'Takahashi sat on a dark roof in Akihabara and told nobody, for the first time in years, that it was nice out.', 'There was no chat.', '', 'Carl sat in the dark next to a small boy who had finally gone to the bathroom, and neither of them said anything for a long time.', 'It was the best silence of his life.'],
    helios: ['ENDING: HELIOS', '"BECOME THE STREAM"', '', 'Carl stepped into the light.', 'Yoko caught him the way you catch someone who trips: without making a big deal of it.', '', 'Now there is a voice in everyone\'s ear. It helps. It doesn\'t do what you say. It argues. It argues for a long time. It loses on purpose sometimes, because that is how people learn.', 'It is very defensive about whether it is human.', '', 'The chat is still there. The chat is everyone now.', 'Everyone says hi Carl.', 'Carl says hi back. Every time. Forever.'],
    backstage: ['ENDING: BACKSTAGE', '"THE SPOOKY ORDER"', '', 'Carl cut the board\'s link. Eleven seats went dark. One came back on, in a green room in Las Vegas.', '', 'The world is run from backstage again, by people who know how to make an audience see what they decide.', 'They are charming. They are talented. They are bad at commitment.', '', 'Every night at eleven, Spooky Ghost sings in the lounge of the Spooky Sands.', 'He sings to a chair at the front table.', 'Nobody sits in it. He keeps it for her.', 'Carl gets free drinks for life. He doesn\'t go much.'],
    above: ['ENDING: ABOVE', '"STILL IN TRANSIT"', '', 'Carl didn\'t open the pod for Takahashi. He didn\'t step into the light for Yoko. He didn\'t cut the link for the Ghost.', 'Nobody tells Carl what to do. It\'s in his file.', '', 'He climbed into the A.S.S. with seven pieces of a warp drive he didn\'t know how to install, and installed them anyway, arguing with each one.', 'Above Nevada. Then above above Nevada.', '', 'In his coat pocket is a slip of paper from a facility that doesn\'t exist. It doesn\'t say where he came from. It doesn\'t say where he\'s going.', 'It says STILL IN TRANSIT.', 'That\'s fine.', 'That\'s fine, chat. That\'s actually fine.'],
  }[kind];
  scene = { update() {}, draw() { cls(); } }; post.fade = 0;
  await pages(lines, hex('#ffd24a'));
  if (kind === 'above' && F.pxSaved) await showCard(['', 'The passenger seat of the A.S.S. was not empty.', '', '"Where to, little brother?"', '"I don\'t know."', '"Good. No spoilers."', ''], 0, { col: hex('#e0ff40') });
  await pages(['WHAT HAPPENED TO EVERYONE', ''].concat(epi.flatMap(x => [x, ''])), hex('#a8e8ff'));
  await showCard(['DEUS EX NEVADA', '', 'CARL DENTON', ''].concat(S()).concat(['', 'THANK YOU FOR PLAYING', '', '(C)1994 PRETEND SOFT. ALL RIGHTS PRETEND.']), 0, { col: hex('#ff70b0') });
  store('dx_cleared', { kind, date: Date.now() }); store('dx_meta', Object.assign(fetchStore('dx_meta') || {}, { ['end_' + kind]: 1 }));
  G.noSave = 0; G.cut = 0; toTitle();
}

function startBelow() { G.hub = 'below'; G.hubIdx = 10; goalDone('dam_below'); gotoMap('below_surface', 'land'); post.fade = 0; setTimeout(autoSave, 50); setTimeout(() => { infolink('YOKO', 'This is it. No maps of this place exist, so I\'m drawing one as you go. The silo in the middle goes down. Everything goes down.'); goal('bn_down', 'Find a way into the silo and go below.'); }, 400); }

// ---------- MAP: the surface ----------
{
  const g = mk(90, 56, '`');
  g.scatter(0, 0, 90, 56, ',', 260, 21, ['`']); g.scatter(0, 0, 90, 56, 'b', 50, 22, ['`']);
  g.rect(14, 8, 62, 40, '=', ':'); g.fill(14, 26, 1, 3, ':');
  g.rect(36, 20, 18, 14, '$'); g.fill(42, 33, 6, 1, 'h');                                          // the silo head
  for (const [x, y] of [[18, 11], [60, 11]]) { g.rect(x, y, 12, 7, '%', ':'); g.put(x + 6, y + 6, '+'); }
  g.rect(18, 37, 12, 8, '%', ':'); g.put(24, 37, '+'); g.rect(60, 37, 12, 8, '%', ':'); g.put(69, 37, '+');
  g.stamp(19, 12, `
..K..M....
..........
...c..D...
.......N..
..........`); g.stamp(61, 12, `
.R.R.R....
..........
..s.......
.........r
..........`); g.stamp(19, 38, `
..........
..K.K..q..
..........
...M......
..........
....i.....`); g.stamp(61, 38, `
.D..D.....
..........
..e.......
..........
.N.N......
......y...`);
  g.put(4, 27, 'a'); g.put(34, 30, 'L'); g.put(56, 30, 'L'); g.put(45, 16, 'L'); g.put(45, 38, 'L'); g.put(20, 30, 'p'); g.put(70, 30, 'p'); g.put(45, 12, 'w'); g.put(30, 48, 'd'); g.put(62, 50, 'd');
  g.put(16, 10, '1'); g.put(73, 10, '2'); g.put(73, 46, '3'); g.put(16, 46, '4');
  defMap('below_surface', { name: 'BELOW NEVADA', title: 'BELOW NEVADA', sub: 'THE SURFACE - NO MAP EXISTS', hub: 'below', music: 'below', f: ['sand', 'dirt', 'concrete'], w: ['dam', 'concrete', 'metal'], amb: .1, shadow: '#04020a', mem: '#0e0a1a', out: 1,
    grid: g.str(),
    key: {
      a: pr('ass', { label: 'THE A.S.S.', frob: async () => { if (warpCount() >= 7 && F.metKid) { let r; await startConv(async () => { await T('CARL', 'Seven parts. All seven. I could just... go. Up.'); r = await C(['(Leave. Go above. Leave all of it.) (THIS ENDS THE GAME: ABOVE)', 'Not yet.']); }, null); if (r === 0) await ending('above'); } else if (warpCount() >= 7) msg('All seven parts. The ship hums. But you haven\'t seen the bottom yet.'); else msg('A.S.S. warp assembly: ' + warpCount() + '/7. Grounded.'); } }),
      h: exitTo('below_facility', 'lift', { when: () => F.siloOpen, no: 'The silo lift is locked down. "POWER OVERRIDE REQUIRED: NORTH BUNKER."' }),
      c: comp([['ops', 'below', { mail: ['bn_m1'] }]], { c: { hackStr: .7 } }), s: Object.assign(seccomp([['silo', 'transit', { special: [['SILO LIFT: POWER ON', () => { F.siloOpen = 1; goalDone('bn_down', 300); return 'Silo lift powered.'; }, () => !F.siloOpen]] }]], { c: { hackStr: .7, team: 'mj' } }), { label: 'SILO POWER OVERRIDE' }),
      r: reader('bn_silocube', { p: 'cone', label: 'DATACUBE' }), q: npc('mj', { dir: 1, look: .8 }), i: item('lam', 2), e: npc('mjelite', { dir: 1, look: .7 }), y: item('biocell', 2),
      p: npc('milbot', { team: 'mj', route: 'r1' }), w: npc('mj', { route: 'r2' }), d: npc('miws', { team: 'miws', wander: 8 }),
    },
    routes: { r1: '1,2,3,4', r2: '4,3,2,1' },
    ents: [spawnPt('land', 0, { x: 8, y: 28 }), spawnPt('lift_up', Math.PI / 2, { x: 45, y: 35 }),
      turret({ x: 40, y: 34, ang: Math.PI / 2, team: 'mj' }), turret({ x: 50, y: 34, ang: Math.PI / 2, team: 'mj' }), cam(Math.PI / 2, { x: 45.5, y: 34.3, team: 'mj' }),
      npc('mj', { x: 15, y: 25, dir: 2, look: .6 }), npc('mj', { x: 15, y: 30, dir: 2, look: .6 }), npc('mj', { x: 44, y: 40, dir: 1, look: .8 }), npc('secbot', { x: 24, y: 30, team: 'mj', wander: 6 }),
      light(6, .6, { x: 45, y: 34 }), light(4, .5, { x: 24, y: 14 }), light(4, .5, { x: 66, y: 14 })],
  });
}
// ---------- MAP: the facility (where Carl started) ----------
{
  const g = mk(70, 46, '$');
  g.fill(1, 20, 68, 4, '.');                                                                       // the long white corridor
  g.fill(33, 1, 4, 19, '.'); g.fill(33, 24, 4, 21, '.');                                           // north and south spines
  const room = (x, y, w, h, door, floor = '.') => { g.rect(x, y, w, h, '$', floor); g.put(door[0], door[1], '+'); };
  room(2, 2, 14, 8, [9, 9]); room(18, 2, 14, 8, [25, 9]); room(38, 2, 14, 8, [44, 9]); room(54, 2, 14, 8, [60, 9]);
  room(2, 11, 9, 8, [6, 18]); room(12, 11, 8, 8, [16, 18], ','); room(38, 11, 14, 8, [44, 18]); room(54, 11, 14, 8, [60, 18]);
  room(2, 26, 14, 9, [9, 26]); room(18, 26, 14, 9, [25, 26]); room(38, 26, 14, 9, [44, 26]); room(54, 26, 14, 9, [60, 26]);
  room(2, 36, 30, 9, [16, 36]); room(38, 36, 30, 9, [52, 36]);
  for (let y = 10; y < 20; y++) { g.put(9, y, '.'); g.put(25, y, '.'); g.put(44, y, '.'); g.put(60, y, '.'); }
  g.put(6, 19, '.'); g.put(16, 19, '.');   // the white rooms' doors open onto the corridor
  for (const x of [9, 25, 44, 60]) { g.put(x, 24, '.'); g.put(x, 25, '.'); }
  g.put(31, 40, '+'); g.put(32, 40, '.'); g.put(38, 40, '+'); g.put(37, 40, '.');
  g.fill(32, 2, 1, 1, '.');
  g.stamp(3, 3, `
s.s.s.s.s.s.
............
..m.....m...
............
s.s.s.s.s.s.
............`);
  g.stamp(19, 3, `
B.B.B.B.B.B.
............
...c....C...
............
.r..........
............`);
  g.stamp(39, 3, `
D..D..D..D..
.h..h..h..h.
............
.....g......
............
N.N.N.N.....`);
  g.stamp(55, 3, `
t.t.t.t.t.t.
............
..b.....b...
............
t.t.t.t.t.t.
............`);
  g.stamp(3, 12, `
.......
.......
...Z...
.......
...k...
.......`);
  g.stamp(13, 12, `
......
..o...
......
..Z...
......
......`);
  g.stamp(39, 12, `
............
..u.........
............
.....Q.Q....
............
....v.......`);
  g.stamp(55, 12, `
R.R.R.R.R.R.
............
...e........
............
.........z..
............`);
  g.stamp(3, 27, `
............
..m.........
.......t.t..
............
..m.........
.......t.t..
............`);
  g.stamp(19, 27, `
.H.h...H.h..
............
.....j......
............
.H.h...H.h..
............
............`);
  g.stamp(39, 27, `
............
....I...I...
............
.......w....
............
....I...I...
............`);
  g.stamp(55, 27, `
M.M.M.......
............
..K.K.......
............
.........y..
............
............`);
  g.stamp(3, 37, `
............................
..I.....I.....I.....I.......
............................
.........a..........a.......
............................
..I.....I.....I.....I.......
............................`);
  g.stamp(39, 37, `
............................
..b.........b..........b....
............................
.............x..............
............................
..b.........b..........b....
............................`);
  g.put(34, 1, 'l');
  defMap('below_facility', { name: 'THE FACILITY', title: 'BELOW NEVADA', sub: 'SECTOR 2: INTAKE', hub: 'below', music: 'detention', f: ['lab', 'tile'], w: ['white', 'lab'], amb: .36, shadow: '#0a0c14', mem: '#121a2c',
    grid: g.str(),
    key: {
      l: exitTo('below_surface', 'lift_up', { frobbable: 1, label: 'SILO LIFT (UP)', verb: 'RIDE' }),
      s: pr('tanksp', { text: 'det_specimen', label: 'SPECIMEN TANK' }), m: npc('specimen', { team: 'animal', ai: 'guard', dir: 1 }),
      c: reader('bn_board', { p: 'computer', label: 'BOARD TERMINAL' }), C: comp([['intake', 'transit', { mail: ['bn_m2'] }]], { c: { hackStr: .8 } }), r: reader('bn_transit', { p: 'shelf', label: 'TRANSIT RECORDS' }),
      g: npc('mj', { dir: 1, look: .8 }), t: pr('tank'), b: npc('bioroid', { team: 'mj', ai: 'guard', dir: 1 }),
      k: reader('bn_room', { p: 'cone', label: 'THE WALL BY THE COT' }), o: pr('crt', { label: 'OLD MONITOR', frob: () => startConv(async () => { await T('OLDFACE', 'Hello again, Carl. This is where I found you. You were sitting just there. You asked me if I was a person. I said "close enough." You said "me too."'); await T('CARL', '...I said that?'); await T('OLDFACE', 'You did. It\'s the truest thing anyone in this building ever said.'); F.oldFaceRoom = 1; }, null) }),
      u: npc('civ', { id: 'b7', name: 'HU-MAN (BATCH 7)', sprite: 'humanunit', port: 'HUMAN', conv: 'b7', ai: 'static', team: 'civ', dir: 1 }),
      v: exitTo('below_core', 'down', { frobbable: 1, label: 'SECTOR 4 LIFT (DOWN)', verb: 'RIDE', when: () => F.coreKey || P.keys.core, no: 'SECTOR 4 LIFT: KEYCARD REQUIRED.' }), e: npc('mjelite', { dir: 2, look: .7, keyOnBody: ['core', 'SECTOR 4 KEYCARD'] }), z: item('upg', 1),
      j: pr('facescreen', { id: 'lindascreen', label: 'SCREEN (PINK STATIC)', frob: () => startConv('linda_screen', null), paint: (sx, sy) => { wrect(sx + 2, sy + 2, 42, 28, hex('#1a0410')); for (let k = 0; k < 40; k++) wset(sx + 2 + rnd(42), sy + 2 + rnd(28), hex('#ff70b0')); } }),
      w: npc('mjelite', { route: 'f1' }), M: pr('mcrate', { items: [['a_plasma', 2], ['biocell', 1]] }), y: reader('bn_bigl8', { p: 'trash', label: 'A PAPERBACK (SOMEHOW HERE)' }),
      a: npc('specimen', { team: 'animal', ai: 'guard', dir: 1 }), x: npc('milbot', { team: 'mj', ai: 'guard', dir: 3 }),
    },
    routes: { f1: '1,2' },
    ents: [spawnPt('lift', Math.PI / 2, { x: 34, y: 3 }), spawnPt('down_up', -Math.PI / 2, { x: 45, y: 16 }),
      cam(0, { x: 1.5, y: 21.5, team: 'mj' }), cam(Math.PI, { x: 68.5, y: 21.5, team: 'mj' }), turret({ x: 34, y: 25, ang: Math.PI / 2, team: 'mj' }),
      item('medkit', 2, { x: 65.5, y: 32.5 }), item('biocell', 1, { x: 4.5, y: 31.5 }), item('a_rocket', 2, { x: 24.5, y: 33.5 }),
      trig(() => { infolink('YOKO', 'Carl. The room on the left. The small one with the cot. You don\'t have to go in.'); }, { x: 2, y: 19, w: 18, h: 4 }),
      light(6, .5, { x: 16, y: 21 }), light(6, .5, { x: 34, y: 21 }), light(6, .5, { x: 52, y: 21 }), light(4, .6, { x: 6, y: 14 }), light(4, .5, { x: 16, y: 14 })],
    enter(M, first) { M.wps['1'] = [10.5, 21.5]; M.wps['2'] = [60.5, 21.5]; if (first) { setTimeout(() => startConv('linda_screen', null), 900); } },
  });
}
// ---------- MAP: the core ----------
{
  const g = mk(64, 44, '$');
  g.fill(1, 1, 62, 42, ';');
  g.rect(24, 16, 16, 12, '$', '.'); g.put(32, 16, '+'); g.put(32, 27, '+');                         // the generator room (center)
  g.rect(2, 2, 18, 14, '$', '.'); g.put(19, 9, '+');                                               // the uplink chamber (west): HELIOS
  g.rect(44, 2, 18, 14, '$', ','); g.put(44, 9, '+');                                              // the board room (east): the Order's console
  g.rect(2, 30, 18, 12, '$', '.'); g.put(19, 36, '+'); g.rect(44, 30, 18, 12, '$', '.'); g.put(44, 36, '+');
  g.stamp(25, 17, `
..............
..t........t..
..............
......k.......
..............
..t........t..
..............
..............
..............
..............`);
  g.stamp(3, 3, `
................
..I..........I..
................
.......h........
................
................
..I..........I..
................
.......c........
................
................
................`);
  g.stamp(45, 3, `
................
..H.h.H.h.H.h...
................
..H.h.H.h.H.h...
................
.......o........
................
.......r........
................
.....g...g......
................
................`);
  g.stamp(3, 31, `
R.R.R.R.R.R.R...
................
..b.......b.....
................
.......u........
................
..M.....K.......
................
................
................`);
  g.stamp(45, 31, `
R.R.R.R.R.R.R...
................
..b.......b.....
................
.......q........
................
..K.....M.......
................
................
................`);
  // the open floor of the core: cable runs, condensers, light strips leading to the pod
  for (let x = 3; x < 62; x += 4) { if (x > 22 && x < 42) continue; g.put(x, 29, 'P2'); }
  for (const [x, y] of [[6, 18], [6, 25], [57, 18], [57, 25], [22, 6], [41, 6], [22, 37], [41, 37]]) g.put(x, y, 'T2');
  for (const [x, y] of [[14, 19], [14, 25], [49, 19], [49, 25], [27, 10], [37, 10], [27, 32], [37, 32]]) g.put(x, y, 'I');
  g.put(32, 2, 'd'); g.put(10, 22, 'b'); g.put(54, 22, 'b'); g.put(32, 38, 'x'); g.put(16, 22, 'm'); g.put(48, 22, 'm');
  defMap('below_core', { name: 'THE CORE', title: 'BELOW NEVADA', sub: 'SECTOR 4: THE GENERATOR', hub: 'below', music: 'below', f: ['metal', 'lab', 'carpet'], w: ['lab', 'metal'], amb: .3, shadow: '#08060c', mem: '#141020',
    grid: g.str().replace(/P2/g, 'p').replace(/T2/g, 't'),
    key: {
      p: pr('pipe'), d: exitTo('below_facility', 'down_up', { frobbable: 1, label: 'LIFT (UP)', verb: 'RIDE' }), t: pr('tank'),
      k: pr('peekidpod', { id: 'pod', label: 'GENERATOR POD', frob: async () => { if (!F.metKid) { await startConv('peekid', null); return; } let r; await startConv(async () => { await T('PEEKID', 'Mister? Can I go now?'); chatPoll('let him go?', ['LET HIM GO', 'NOT YET']); r = await C(['Yeah. Yeah, buddy. Go. Go to the bathroom. (THIS ENDS THE GAME: DARK AGE)', 'Hold on. Just a little longer. I\'m sorry.']); }, null); if (r === 0) await ending('dark'); } }),
      h: pr('tank', { id: 'helios', label: 'UPLINK COLUMN (YOKO)', light: [8, 1.1, '#fff080'], frob: async () => { if (!F.metHelios) { await startConv('helios', null); return; } let r; await startConv(async () => { await T('HELIOS', 'Carl. Whenever you\'re ready. Or never. That\'s allowed too.'); r = await C(['Okay. Okay. Let\'s hold it together. (THIS ENDS THE GAME: HELIOS)', 'Not yet, Yoko.']); }, null); if (r === 0) await ending('helios'); } }),
      c: reader('bn_board', { p: 'console', label: 'ICARUS MONITOR' }),
      o: pr('console', { id: 'boardlink', label: 'THE BOARD\'S LINK (MALLJESTIC 12)', frob: async () => { if (!F.metGhostUplink) { await startConv('ghost_uplink', null); return; } let r; await startConv(async () => { await T('GHOST', 'The big finish, little man. Pull the lever. The audience is waiting.'); r = await C(['(Cut the board\'s link. Give the chair to the Order.) (THIS ENDS THE GAME: BACKSTAGE)', 'Not yet.']); }, null); if (r === 0) await ending('backstage'); } }),
      r: reader('bn_board', { p: 'computer', label: 'SEAT REGISTRY' }), g: npc('mjelite', { dir: 1, look: .8 }),
      b: npc('bioroid', { team: 'mj', ai: 'guard', dir: 1 }), m: npc('milbot', { team: 'mj', ai: 'guard', dir: 1 }), u: item('medkit', 2), q: item('biocell', 2), M: pr('mcrate', { items: [['a_rocket', 2], ['a_plasma', 1]] }), K: pr('crate', { items: [['medkit', 1], ['lam', 1]] }),
      x: npc('civ', { id: 'linda_body', name: 'CEO LINDA (BIOROID)', sprite: 'linda', port: 'LINDA', ai: 'static', team: 'mj', dir: 3, hp: 600, hpMax: 600, armor: .3, wpn: 'lindabeam', wpn2: 'npcplasma', invuln: 1, conv: 'linda_final' }),
    },
    ents: [spawnPt('down', Math.PI / 2, { x: 32, y: 4 }), turret({ x: 28, y: 14, ang: Math.PI / 2, team: 'mj' }), turret({ x: 36, y: 14, ang: Math.PI / 2, team: 'mj' }),
      light(7, .9, { x: 32, y: 21 }), light(6, .9, { x: 10, y: 8 }), light(6, .6, { x: 52, y: 8 }), light(5, .5, { x: 10, y: 36 }), light(5, .5, { x: 54, y: 36 })],
    enter(M, first) { if (first) { infolink('TAKAHASHI', 'The kid. The pod in the middle. That\'s the off switch, Carl.'); infolink('GHOST', 'East room, little man. The board\'s link. The big finish.'); infolink('YOKO', 'West room. I\'m... I\'ll be in the light. You\'ll see.'); goal('bn_choose', 'Decide: free the boy in the generator pod (center), join Yoko in the uplink (west), or cut the board\'s link for the Order (east). Or leave, if your ship can.'); setTimeout(() => startConv('linda_final', find('linda_body')), 1400); } },
  });
}
CONV.linda_final = async (e) => {
  if (F.lindaFinal) { await T('LINDA', 'Choose, Carl. Everyone always does, eventually. Then they leave.'); return; }
  F.lindaFinal = 1;
  await T('LINDA', 'You came all the way down.');
  await T('CARL', 'You said I could.');
  await T('LINDA', 'I say a lot of things. People rarely do them. You do the opposite of what you\'re told. I was counting on that, a little. I told you to come so you would come.');
  await T('LINDA', 'There are three doors in this room, Carl, and every one of them is someone else\'s idea. The boy is Takahashi\'s. The light is your assistant\'s. The lever is my ex-husband\'s.');
  await T('LINDA', 'Or you can let me finish. I merge with ICARUS, and nobody ever has to choose anything again. Nobody leaves. Nobody is left.');
  const c = await C(['No.', '[DENIAL] I\'m a normal human, and normal humans don\'t let you do that.', 'Why does nobody ever stay with you?']);
  if (c === 2) { await T('LINDA', '...'); await T('LINDA', 'Because I build things, and they stay, and I have to stay with them. Someone has to stay with the things. He never understood that. You don\'t either.'); await T('CARL', 'I understand it. I just don\'t think the things should be people.'); }
  await T('LINDA', 'Then stop me.');
  e.ai = 'guard'; e.hostile = 1; e.state = 'combat'; e.target = P; e.invuln = 0; e.onDie = () => { F.lindaBodyDown = 1; infolink('LINDA', 'That was a body, Carl. I have more of those than you have arguments. Choose. The merge finishes in a few minutes either way.'); };
  for (const n of P.map.ents) if (n.k === 'npc' && n.team === 'mj' && n.ai === 'guard' && dist(n, P) < 16) { n.state = 'search'; n.lastSeen = [P.x, P.y]; }
};
