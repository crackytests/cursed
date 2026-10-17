'use strict';
// ================= DISK D: HOLLYWOOD =================
// The Boulevard, the Velvet Spook, the Luckee Star, Hollywood Forever, and up the hill: Mr. White's auction.
HUBS.hw = { name: 'HOLLYWOOD' };

txt('hw_star', 'STAR ON THE WALK', 'A brass star in the sidewalk. The name has been pried off. Someone has written in marker: "NORMAL HUMAN (ME)."\n\nThe handwriting is yours. You don\'t remember doing it. You were here last year on a delivery. You must have.');
txt('hw_poster', 'POSTER', 'THE VELVET SPOOK PRESENTS\nSPOOKY GHOST\nLIVE! (ish)\n"The Only Dead Man In Hollywood Who Still Works Nights"\n\nTonight: one show only. Then he is "booked privately in the Hills."');
txt('hw_flyer', 'FLYER (WHITE CARDSTOCK)', 'MR. WHITE REQUESTS THE PLEASURE OF YOUR COMPANY\nFRIDAY - THE HILLS - LATE\n\nA PRIVATE SALE OF ONE (1) ITEM OF NEVADA PROVENANCE\n\nDress: White.\nEntertainment: Mr. S. Ghost.\nGuests who know only.');
txt('hw_tv_dys', 'TV (ROOM 6)', 'The TV in room 6 is on, on a channel that doesn\'t exist. Static, and in the static, a face you know, wearing a crimson helmet.\n\n"...they deported me for opening a window. So I came back through the wall. Brothers and sisters. The box is coming home. When it opens, every one of us will remember, all at once, what we were before they taught us to whisper..."\n\nThe picture breaks up. A caption, in a font nobody uses: DYSLEXIO.');
txt('hw_grave', 'HEADSTONE', 'Here lies somebody who came back wrong.\n(The date of death has been scratched out and rewritten three times.)');
txt('hw_clinicnote', 'CLINIC DISPOSAL SLIP', 'THE CLINIC - SAMPLE DISPOSAL\nReturned subjects (unsuitable): 31\nDisposal site: Hollywood Forever, sections J-K, "with the others"\nNotes: Subjects may exhibit wandering. Subjects may exhibit grief. This is not our department.\n- D. Face (proxy)', { note: 'The Clinic dumps its failed "returned" abductees in Hollywood Forever cemetery. Director Face signed the slip.' });
DEB.push({ id: 'hw1', hub: 3, title: 'THE HILLS', fn: async () => {
  await T('DEB', 'Deep Night. Hollywood calls tonight. Everybody\'s talking about a party in the Hills. White house. White cars. White everything. Guest list nobody\'s on.');
  await T('N', '"Deb, I parked cars at that house. Every guest gets out and stands still for a second like they\'re remembering how legs work."');
  await T('DEB', 'Honey, that\'s just Hollywood.');
  await T('N', '"One of them had a tail, Deb."');
  await T('DEB', '...That\'s also Hollywood.');
} });
DEB.push({ id: 'hw2', hub: 3, title: 'THE PROPHET', fn: async () => {
  await T('DEB', 'Strange one. People all over the city are calling about a TV channel that doesn\'t exist. A man in a red helmet, talking about a box.');
  await T('DEB', 'A caller from the Valley says he watched it for an hour and it was the first time in his life somebody explained his feelings to him. Then he says he doesn\'t know what that means. Then he hung up.');
  await T('DEB', 'If you see the man in the helmet, don\'t call me. Call your mother.');
} });

// ---------- Spooky Ghost ----------
CONV.ghost = async (e) => {
  if (!F.ghostMet) { F.ghostMet = 1;
    await T('N', 'On the empty stage, after the show, a white sheet with a grin and a bow tie floats over a piano, playing it badly with no hands.');
    await T('GHOST', 'Carl! Carl! Is that Carl? I know you. Everybody knows you. You\'re the streamer the Commissioner didn\'t fire into space! That\'s a CREDIT, kid. You put that on the poster.');
    await T('CARL', 'Spooky Ghost? THE Spooky Ghost? I looked for you once. A long time ago. In a, a different, it was a whole thing-');
    await T('GHOST', 'Everybody looks for me, kid. Few have the stones to find me. Fewer have the stones to buy a ticket.');
    await T('CARL', 'Are you a visitor? You\'re not- you\'re a ghost. You\'re a ghost at an alien party.');
    await T('GHOST', 'The only dead man in Hollywood who still works nights. The Nordics come to my shows to eat the audience\'s admiration. I don\'t mind. I come to my shows for the same reason.'); }
  if (F.ghostDone) { await T('GHOST', pick(['Break a leg, kid. Not literally. I can\'t, that\'s my whole problem.', 'Remember: never be the first one to clap. Be the LOUDEST.'])); return; }
  const c = await C([{ t: 'You\'re playing Mr. White\'s party. I need to get in.', if: () => !F.ghostJob && (F.hwFlyer || hasGoal('hw_mansion')) }, { t: 'I got your music back.', if: () => F.ghostJob && invFind('sheetmusic') }, { t: 'You know the Commissioner?', if: () => !F.ghostLinda }, { t: 'You know Therese and Jeanette Linda?', if: () => F.lindasDone && !F.ghostLindas }, 'Bye.']);
  if (c === 0) { F.ghostJob = 1;
    await T('GHOST', 'You want to be my assistant. Ha! Everybody wants to be my assistant. My last one quit tonight. Took my music with her. A Nordic. Beautiful girl. Ran off with a man from the Luckee Star motel. Room 3. They were in love with my ARRANGEMENTS.');
    await T('GHOST', 'Get me my sheet music back, and you can walk into Mr. White\'s house behind me carrying my coat. I don\'t have a coat. Carry something. Look busy. Nobody looks at the assistant.');
    goal('hw_music', 'Get Spooky Ghost\'s sheet music back from room 3 of the Luckee Star motel, so you can go into Mr. White\'s party as his assistant.'); }
  else if (c === 1) { F.ghostDone = 1; removeItem(invFind('sheetmusic')); giveItem('assistpass', 1);
    await T('GHOST', 'My ARRANGEMENTS! Kid. Carl. Kid. You\'re hired. You\'re fired. You\'re rehired. That\'s showbusiness.');
    await T('GHOST', 'Here. A stage pass. The suits at the door will wave you through. Once you\'re in, do whatever it is you do. Try not to do it during my number.');
    goalDone('hw_music', 600); goal('hw_party', 'Go to Mr. White\'s house in the Hills with Spooky Ghost\'s stage pass (road at the north end of the Boulevard).'); }
  else if (c === 2) { F.ghostLinda = 1;
    await T('GHOST', 'Know her? Kid. She was my wife. My first wife. In another reality. Another life. The details are... the details.');
    await T('GHOST', 'I had ideas. A company. A business with a funny name. AI companions. I talked about them every night. She did them. Every one. She built the whole empire out of things I said at dinner.');
    await T('CARL', 'So she stole your ideas?');
    await T('GHOST', '...No. That\'s the thing, kid. I said them. She did them. You know how long it took me to say that out loud? I\'m dead. I had time.');
    await T('GHOST', 'She wanted to settle down. I wanted the road. Now I want to settle down and she\'s the Commissioner of the Normalcy. Timing, kid. Timing is the whole act.'); }
  else if (c === 3) { F.ghostLindas = 1; await T('GHOST', 'Therese AND Jeanette? Kid. I dated them on alternating nights for a YEAR. I thought I had a type. I thought it was a coincidence they had the same face as my ex-wife.'); await T('CARL', 'They\'re one person. Broadcast. They caught the face off TV.'); await T('GHOST', '...That explains the alimony.'); await T('CARL', 'You pay them alimony?'); await T('GHOST', 'Kid, I pay EVERYBODY alimony. Every woman I ever loved has the same face and every one of them has a lawyer.'); }
};
ITEMS.sheetmusic = { name: 'SHEET MUSIC', w: 1, h: 1, quest: 1, desc: '"BOO-TIFUL (A SPOOKY GHOST ORIGINAL)". The arrangements are, frankly, very good.' };
ITEMS.assistpass = { name: 'STAGE PASS', w: 1, h: 1, quest: 1, desc: 'MR. WHITE\'S RESIDENCE - ENTERTAINMENT - ASSISTANT TO MR. S. GHOST. Nobody looks at the assistant.' };
CONV.nordic_fan = async (e) => {
  if (F.musicGot) { await T('N', '"Tell him I\'m sorry. Tell him the arrangements were the only true thing in that theater."'); return; }
  await T('N', 'A very tall, very pale, very beautiful woman sits on the motel bed holding a folder of sheet music to her chest. A human man is asleep beside her, smiling, gray in the face.');
  await T('N', '"He\'s fine," she says, before you ask. "He\'s just been looked at a lot. I\'m Astrid. I was Mr. Ghost\'s assistant. I couldn\'t stop staring at his music. The arrangements. Have you HEARD them?"');
  const c = await C(['He needs them back for a show tonight.', { t: 'You\'ll give me the music.', req: ['command', 1] }, { t: 'If you love the music, give it to him so somebody can play it. That\'s what it\'s for. Things are for being seen. You of all people.', req: ['charm', 1] }, { t: 'Your boyfriend\'s turning gray. I\'m taking the music AND I\'m taking him to a doctor.', req: ['rant', 1] }, { t: 'Sister. Let it go. You know how this ends when we hold on to beautiful things.', sp: 'nordic' }, 'Never mind.']);
  if (c === 5) return;
  if (c === 0) { await T('N', '"...He does, doesn\'t he." She holds it out, then pulls it back. "Promise me he\'ll play the second movement slow."'); }
  else await T('N', 'She hands it over. Her hands are shaking. "Tell him I\'m sorry."');
  if (c === 3) gainHumanity('looked after a stranger');
  giveItem('sheetmusic', 1); F.musicGot = 1;
};

// ---------- JB at the Luckee Star ----------
CONV.jb_motel = async (e) => {
  if (!F.jbMotel) { F.jbMotel = 1;
    await T('JB', 'Kid. Sit. Don\'t sit on that. Don\'t sit anywhere, actually. It\'s the Luckee Star.');
    await T('JB', 'I followed the label. "c/o NOBODY. LEAVE IT SHUT." Somebody wrote that on the manifest between Nevada and the port. Same pen as the original, different hand. A steady hand. Somebody who\'s held a lot of steering wheels.');
    await T('JB', 'I found that hand again. On a bar tab. At the Crash Pad. A tab that says "X" at the bottom and has never been paid.');
    await T('CARL', 'Pilot X? Pilot X wrote "leave it shut"? Why didn\'t he- he TOLD me he didn\'t know what was in it!');
    await T('JB', 'Maybe he doesn\'t. You don\'t have to know what\'s in a box to know it shouldn\'t be opened. Some boxes you can tell by the weight.');
    await T('JB', 'That\'s my last chapter, kid. I know who wrote the label. The rest is yours.');
    F.jbLabel = 1; addNote('JB Garfield: the hand that wrote "c/o NOBODY. LEAVE IT SHUT." on the pod\'s manifest matches Pilot X\'s unpaid bar tab at the Crash Pad.'); giveSP(400, 'the label'); return; }
  await T('JB', pick(['The room smells like a cigarette that gave up.', 'Follow the box, kid. I\'m done following it. I just wanted the handwriting.']));
};
// ---------- the caretaker ----------
CONV.caretaker = async (e) => {
  if (F.cemDone) { await T('N', F.cemDone === 'rest' ? '"They\'re quiet now. Thank you. I put flowers on all of them. Even the ones who never had names."' : '"...It\'s quiet. Too quiet. I don\'t like what you did, but it\'s quiet."'); if (!F.cemPaid) { F.cemPaid = 1; P.cred += 200; giveSP(700, 'Hollywood Forever'); goalDone('hw_cem'); } return; }
  await T('N', 'An old caretaker with Prop Pills eyes and a shovel, standing at the gate. "You\'re one of them. Good. I need one of them."');
  await T('N', '"Something keeps putting people in my cemetery. People who aren\'t dead. Or weren\'t. They come in a white van from some clinic, and they don\'t stay buried. They walk around at night calling for somebody to take them back."');
  await T('N', '"They don\'t hurt anybody on purpose. But they\'re scared, and scared people hit. Can you... do something? Anything?"');
  goal('hw_cem', 'The Hollywood Forever caretaker needs help with the "returnees" walking the cemetery at night.', 1); F.cemJob = 1;
};
CONV.returnee_lead = async (e) => {
  if (F.cemDone) return;
  await T('N', 'One of them stands apart from the others, still, in a hospital gown. When she speaks, it\'s clear she was a person once and is working very hard to still be one.');
  await T('N', '"They took us up. They took samples. Then they said we were unsuitable and they put us back. But they put us back wrong. We don\'t sleep. We don\'t eat. We remember the light."');
  await T('N', '"We just want somebody to say we were taken. Out loud. So it\'s real. Nobody ever says it."');
  const c = await C(['You were taken. I know. I saw the slip. The Clinic did this. It\'s real.', { t: 'Rest. All of you.', req: ['command', 3] }, { t: 'There\'s a doctor in Santa Monica who helps people who don\'t sleep right. Kwan. Go to her. Tell her Carl sent you.', if: () => F.wardDone }, '[Attack]']);
  if (c === 0 || c === 2) { F.cemDone = 'rest'; await T('N', '"...Real." She closes her eyes. Around the cemetery, one by one, the shambling figures sit down in the grass, like people at a picnic after a long walk.'); gainHumanity('said it out loud'); for (const n of P.map.ents) if (n.team === 'returnee') { n.ai = 'static'; n.team = 'civ'; n.state = 'idle'; n.hostile = 0; } if (c === 2) addNote('You sent the returnees to Dr. Kwan in Santa Monica.'); }
  else if (c === 1) { F.cemDone = 'rest'; for (const n of P.map.ents) if (n.team === 'returnee' && !n.dead) knockOut(P.map, n); await T('N', 'They lie down. They sleep for the first time in years.'); }
  else { F.cemDone = 'killed'; e.team = 'returnee'; e.ai = 'guard'; e.wpn = 'npcclaw'; e.state = 'combat'; e.target = P; for (const n of P.map.ents) if (n.team === 'returnee') { n.state = 'combat'; n.target = P; } }
  e.conv = null;
};

// ---------- MAP: Hollywood Boulevard ----------
{
  const g = mk(100, 60, '.');
  g.fill(0, 0, 100, 1, '#'); g.fill(0, 59, 100, 1, '#'); g.fill(0, 0, 1, 60, '#'); g.fill(99, 0, 1, 60, '#');
  g.fill(1, 26, 98, 4, ','); g.fill(46, 1, 4, 58, ',');
  // the hills road north
  g.fill(1, 1, 45, 10, ';'); g.fill(50, 1, 49, 10, ';'); g.put(47, 1, 'N'); g.put(48, 1, 'N');
  // north side: the Velvet Spook, costume shop
  g.rect(8, 13, 24, 12, '$', ':'); g.put(20, 24, 'V'); g.put(16, 25, 'o'); g.put(24, 25, 'o');
  g.rect(34, 15, 10, 10, '#', ':'); g.put(38, 24, 'K');
  // the Luckee Star motel (south east)
  g.rect(56, 33, 30, 14, '#', ':'); g.put(70, 33, 'L'); g.fill(57, 47, 28, 4, ',');
  // the cemetery (south west), behind a fence
  g.fill(1, 33, 40, 25, ';'); g.rect(2, 34, 38, 24, '=', ';'); g.put(20, 34, 'G');
  for (let y = 38; y < 56; y += 3) for (let x = 5; x < 37; x += 4) g.put(x, y, 'h');
  g.put(20, 37, 'c'); g.put(30, 50, 'R'); g.put(28, 52, 'r'); g.put(33, 52, 'r'); g.put(26, 48, 'r'); g.put(10, 44, 'r'); g.put(14, 53, 'r'); g.put(36, 41, 'S'); g.put(4, 56, 'n');
  // the walk of fame
  for (let x = 4; x < 98; x += 6) { g.put(x, 25, 's'); g.put(x + 3, 31, 's'); }
  for (let x = 8; x < 98; x += 12) { g.put(x, 32, 'l'); g.put(x + 6, 12, 'l'); }
  g.put(66, 12, 'P'); g.put(70, 20, 'p'); g.put(90, 20, 'p'); g.put(80, 18, 'k'); g.put(52, 32, 'f'); g.put(4, 28, 'T'); g.put(96, 40, 'D');
  defMap('hw_blvd', { name: 'HOLLYWOOD BOULEVARD', title: 'HOLLYWOOD', sub: 'THE BOULEVARD - 1:15 AM', hub: 'hw', music: 'hollywood', f: ['concrete', 'road', 'grass', 'tile'], w: ['brick', 'neon', 'fence'], fence: 'fence', amb: .25, shadow: '#0e0412', mem: '#1c0c24',
    grid: g.str(),
    key: {
      N: exitTo('hw_mansion', 'gate', { label: 'THE HILLS ROAD', when: () => hasGoal('hw_party') || F.mansionOpen, no: 'A long dark road up into the Hills. You don\'t know which house. You don\'t have an invitation. Yet.' }),
      V: [door({ name: 'THE VELVET SPOOK' }), exitTo('hw_theater', 'front')], o: reader('hw_poster', { p: 'poster', label: 'POSTER' }),
      K: [door({ name: 'STARLIGHT COSTUMES' }), exitTo('hw_costume', 'front')],
      L: [door({ name: 'THE LUCKEE STAR' }), exitTo('hw_motel', 'front')],
      G: door({ name: 'HOLLYWOOD FOREVER', lock: 1, str: .25 }), h: reader('hw_grave', { p: 'sign', label: 'HEADSTONE' }),
      c: npc('pill', { id: 'caretaker', name: 'CARETAKER', sprite: 'civ3', conv: 'caretaker', ai: 'static', dir: 2 }),
      R: npc('returnee', { id: 'retlead', name: 'RETURNEE IN A GOWN', conv: 'returnee_lead', ai: 'static', team: 'civ', cond: () => !F.cemDone }),
      r: npc('returnee', { cond: () => !F.cemDone || F.cemDone === 'killed', wander: 3 }), S: reader('hw_clinicnote', { p: 'sign', label: 'CLINIC SLIP' }), n: pr('crate', { items: [['biocell', 2]] }),
      s: reader('hw_star', { p: 'manhole', label: 'STAR' }), l: pr('neonlamp'), P: pr('palm'), p: pr('palm'), k: pr('kiosk', { label: 'HOT DOGS', shop: { name: 'HOLLYWOOD HOT DOGS', items: [['soda', 2, 9], ['chips', 2, 9]] } }), f: reader('hw_flyer', { p: 'trash', label: 'FLYER', onRead: () => { F.hwFlyer = 1; } }),
      T: exitTo('dt_streets', 'cab', { frobbable: 1, label: 'CAB TO DOWNTOWN', verb: 'RIDE' }),
      D: exitTo('dt_drains', 'hw', { frobbable: 1, label: 'STORM DRAIN (DOWNTOWN)', verb: 'CLIMB DOWN' }),
    },
    ents: [spawnPt('cab', 0, { x: 5, y: 28 }), spawnPt('drain', Math.PI, { x: 95, y: 40.5 }), spawnPt('theater_out', Math.PI / 2, { x: 20, y: 26 }), spawnPt('costume_out', Math.PI / 2, { x: 38, y: 26 }), spawnPt('motel_out', -Math.PI / 2, { x: 70, y: 31 }), spawnPt('hills', Math.PI / 2, { x: 47.5, y: 3 }), pr('cab', { x: 6, y: 30 }),
      npc('civ', { x: 30, y: 28, wander: 6, sprite: 'civ7' }), npc('civ', { x: 60, y: 25, wander: 6, sprite: 'civ8' }), npc('civ', { x: 80, y: 31, wander: 5, sprite: 'civ2' }), npc('civ', { x: 15, y: 31, wander: 4, sprite: 'surfer' }),
      npc('cop', { x: 48, y: 30, wander: 8, conv: 'cop_sm' }), vnpc('visitor', 'nordic', { x: 24, y: 26, sprite: 'civ7', ai: 'static', conv: 'visitor_sm', dir: 1 }), vnpc('visitor', 'nordic', { x: 26, y: 26, sprite: 'civ4', ai: 'static', conv: 'visitor_sm', dir: 1 }),
      npc('civ', { name: 'STREET PREACHER', sprite: 'civ5', x: 58, y: 25, ai: 'static', conv: 'preacher', dir: 1 }),
      light(5, .8, { x: 20, y: 25 }), light(4, .7, { x: 70, y: 32 }), light(4, .6, { x: 38, y: 25 }), light(3, .25, { x: 20, y: 45, col: '#80a0c0' }), light(4, .5, { x: 47, y: 4 })],
    enter(M, first) { if (first && !F.hwArrive) { F.hwArrive = 1; run(async () => { await delay(1); infolink('TOMMY', 'Hollywood! Carl, everybody in Hollywood is a visitor. The humans are the weird ones there. Be cool. Be normal. Be Hollywood normal, which is a different, worse normal.'); if (!hasGoal('hw_mansion')) goal('hw_mansion', 'Get into Mr. White\'s party in the Hills and recover the Nevada Pod.'); }); } },
  });
}
CONV.preacher = async () => { await T('N', pick(['"THE BOX IS COMING HOME! The man in the helmet said so on channel zero! DROP THE MASK! DROP IT!" He looks at you. "...Not you, little guy. You\'re fine. That\'s a good mask."', '"Do you know what you are, son? Do you KNOW?" "No," you say. He seems thrown. "...Well, that\'s honest."'])); };

// ---------- the Velvet Spook ----------
{
  const g = mk(34, 24, '$');
  g.rect(0, 0, 34, 24, '$', ':'); g.put(16, 23, 'x');
  g.fill(4, 1, 26, 5, '.'); g.put(12, 3, 'S'); g.put(16, 2, 'G'); g.put(22, 3, 'P');
  for (let y = 9; y < 20; y += 2) for (let x = 4; x < 30; x += 3) if (x !== 16 && x !== 15) g.put(x, y, (x + y) % 9 === 0 ? 'n' : 'b');
  g.rect(28, 0, 6, 8, '$', ','); g.put(28, 5, 'D'); g.put(31, 2, 'k');
  defMap('hw_theater', { name: 'THE VELVET SPOOK', title: 'THE VELVET SPOOK', sub: 'SPOOKY GHOST - LIVE (ISH)', hub: 'hw', music: 'lounge', f: ['carpet', 'wood', 'wood'], w: ['casino', 'office'], amb: .2, shadow: '#140410', trueForms: 0,
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('hw_blvd', 'theater_out')], S: pr('stage'), P: pr('piano'), b: pr('bench'), D: door({ name: 'DRESSING ROOM' }), k: pr('locker', { items: [['biocell', 2], ['a_10mm', 1]] }),
      G: npc('civ', { id: 'ghost', name: 'SPOOKY GHOST', sprite: 'ghost', port: 'GHOST', conv: 'ghost', ai: 'static', dir: 0, knows: 1, invuln: 1, ghost: 1 }),
      n: vnpc('visitor', 'nordic', { sprite: 'civ7', ai: 'static', dir: 3, conv: 'visitor_sm' }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 16, y: 22 }), light(5, .9, { x: 16, y: 3, col: '#ff80c0' }), light(3, .3, { x: 16, y: 14 })],
  });
}
// ---------- the costume shop (a disguise for the party, the other way in) ----------
CONV.costumer = async (e) => {
  const c = await C(['What do you have?', { t: 'I need to look like a Man in a White Suit.', if: () => !invFind('whitesuit') }, 'Bye.']);
  if (c === 0) await shopUI({ name: 'STARLIGHT COSTUMES', items: [['whitesuit', 250, 1], ['flare', 6, 6], ['soda', 2, 6]] }, e);
  else if (c === 1) await T('N', '"Kid, everybody wants the white suit this week. It\'s the hot look. I\'ve got one in your size, which surprised me, because nobody is your size."');
};
ITEMS.whitesuit = { name: 'WHITE SUIT (COSTUME)', w: 2, h: 2, quest: 1, desc: 'A Man in a White Suit costume, child\'s large. Wear it into Mr. White\'s party. Up close, it fools nobody. From across a room, it fools everybody.' };
{
  const g = mk(16, 12, '#');
  g.rect(0, 0, 16, 12, '#', ':'); g.put(7, 11, 'x'); g.put(5, 4, 'C'); g.put(7, 2, 'A'); g.put(2, 2, 'r'); g.put(13, 2, 'r'); g.put(2, 7, 'r'); g.put(13, 7, 'm');
  defMap('hw_costume', { name: 'STARLIGHT COSTUMES', title: 'STARLIGHT COSTUMES', sub: '', hub: 'hw', music: 'convo', f: ['wood'], w: ['brick'], amb: .5, shadow: '#100810',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('hw_blvd', 'costume_out')], C: pr('counter'), r: pr('rack'), m: reader('sm_mirror', { p: 'sign', label: 'MIRROR' }),
      A: npc('civ', { name: 'COSTUMER', sprite: 'civ2', conv: 'costumer', ai: 'static', dir: 0 }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 7, y: 10 }), light(4, .8, { x: 7, y: 5 })],
  });
}
// ---------- the Luckee Star motel ----------
{
  const g = mk(40, 18, '#');
  g.rect(0, 0, 40, 18, '#', '.'); g.fill(1, 8, 38, 2, ',');
  for (let k = 0; k < 5; k++) { const x = k * 8; g.rect(x, 0, 9, 9, '#', ':'); g.put(x + 4, 8, k === 2 ? 'R' : k === 4 ? 'X' : '+'); g.put(x + 2, 2, 'b'); }
  g.put(20, 17, 'x'); g.rect(0, 10, 14, 8, '#', ':'); g.put(7, 10, '+'); g.put(3, 13, 'C'); g.put(5, 12, 'm');
  g.rect(26, 10, 14, 8, '#', ':'); g.put(32, 10, 'D'); g.put(30, 13, 't'); g.put(28, 15, 'i'); g.put(36, 12, 'j'); g.put(34, 15, 'i');
  g.put(22, 4, 'A'); g.put(23, 3, 'z'); g.put(5, 4, 'J');
  defMap('hw_motel', { name: 'THE LUCKEE STAR', title: 'THE LUCKEE STAR MOTEL', sub: 'VACANCY (ALWAYS)', hub: 'hw', music: 'night', f: ['carpet', 'concrete', 'wood'], w: ['brick'], amb: .2, shadow: '#0c0808',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('hw_blvd', 'motel_out')], '+': door({}), R: door({ name: 'ROOM 3' }), X: door({ name: 'ROOM 5', lock: 1, str: .3 }), D: door({ id: 'room6', name: 'ROOM 6', lock: 1, str: .45 }),
      b: pr('bed'), C: pr('counter'), m: npc('civ', { name: 'NIGHT MANAGER', sprite: 'civ6', conv: 'motel_mgr', ai: 'static', dir: 1 }),
      t: pr('tv', { text: 'hw_tv_dys', label: 'TV', onRead: () => { F.sawDyslexio = 1; } }), i: npc('invader'), j: npc('invaderg'),
      A: npc('visitor', { id: 'astrid', name: 'ASTRID', vis: 'nordic', sprite: 'civ7', conv: 'nordic_fan', ai: 'static', dir: 2 }), z: npc('civ', { name: 'SLEEPING BOYFRIEND', sprite: 'civ1', ai: 'static', down: 1, state: 'down', knows: 1 }),
      J: npc('civ', { id: 'jb', name: 'JB GARFIELD', sprite: 'jb', port: 'JB', conv: 'jb_motel', ai: 'static', dir: 0, knows: 1, invuln: 1 }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 20, y: 16 }), light(3, .6, { x: 4, y: 13 }), light(2, .4, { x: 22, y: 4, col: '#ffc0e0' }), light(2, .3, { x: 30, y: 13, col: '#ff4080' }), light(3, .4, { x: 20, y: 9 }), light(2, .35, { x: 5, y: 4 })],
  });
}
CONV.motel_mgr = async () => { await T('N', pick(['"Room 6 has been paying cash for a month and the TV never goes off. I don\'t go near room 6."', '"Room 3\'s got a lady so pretty I can\'t look at her. I mean that. I physically can\'t. My eyes slide off."', '"The cat in room 1 pays in cash and tips in advice."'])); };
