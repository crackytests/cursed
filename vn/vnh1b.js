'use strict';
// ================= DISK B (cont.): THE CLINIC, THE DINER, THE PAWN SHOP, THE OCEAN HOUSE, THE BEACH HOUSE =================

// ---------- the diner ----------
{
  const g = mk(22, 12, '%');
  g.rect(0, 0, 22, 12, '%', '.'); g.fill(1, 1, 20, 1, 'W'); g.put(9, 11, 'x');
  g.put(3, 3, 'c'); g.put(10, 3, 'C'); g.put(16, 6, 't'); g.put(19, 6, 't'); g.put(16, 9, 't'); g.put(3, 7, 't');
  g.put(5, 2, 'w'); g.put(18, 5, 'L'); g.put(4, 8, 'o');
  defMap('sm_diner', { name: 'THE BLUE MOON DINER', title: 'THE BLUE MOON DINER', sub: 'OPEN ALL NIGHT', hub: 'sm', music: 'convo', f: ['tile', 'tile'], w: ['office'], amb: .5, shadow: '#141020',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('sm_streets', 'diner_out')], c: pr('counter'), C: pr('counter'), t: pr('table'),
      w: npc('civ', { name: 'WAITRESS', sprite: 'civ4', conv: 'diner', ai: 'static', dir: 0, port: 'civ4' }),
      L: vnpc('visitor', 'reptilian', { name: 'MAN IN BOOTH', sprite: 'suit', conv: 'lizard_diner', ai: 'static', dir: 2 }),
      o: npc('civ', { name: 'NIGHT SHIFT GUY', sprite: 'civ5', ai: 'static', dir: 0, conv: 'nightshift' }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 9, y: 10 }), light(5, .9, { x: 10, y: 5, col: '#ffe0b0' })],
  });
}
CONV.lizard_diner = async (e) => {
  if (!F.lizardTalk) { F.lizardTalk = 1;
    await T('N', 'A man in a sharp gray suit with a cup of coffee he isn\'t drinking. The coffee has a skin of ice on it.');
    await T('N', '"You\'re the Commissioner\'s new one. The streamer." He doesn\'t look up. "My grandfather ran the Ocean House. Don\'t go up there. Family business."');
    const c = await C(['What happened at the Ocean House?', { t: 'You\'re cold. Like, physically. Your coffee froze.', if: () => true }, 'Okay. Bye.']);
    if (c === 0) await T('N', '"A Normalcy matter. Long settled. Some things have to be kept normal at any cost, son. My family paid it." He finally looks up. His pupils are slits. "Ask the Commissioner, if you\'re curious. Ask her about Walter Coldwell."');
    else if (c === 1) await T('N', '"Santa Monica in July," he says, "is the only place I am ever warm." Frost spreads from his fingertips across the table.');
    F.coldwellName = 1; addNote('The man in the diner booth says his grandfather ran the Ocean House: Walter Coldwell. "A Normalcy matter. Long settled."'); return; }
  await T('N', pick(['"Mind the cold."', '"Be normal, son."']));
};
CONV.nightshift = async () => { await T('N', pick(['"I work nights at the clinic. You don\'t want to know about the night ward. Okay, you do. People sleep there and don\'t wake up right."', '"Pie\'s good. Don\'t get the coffee."'])); };

// ---------- the pawn shop ----------
{
  const g = mk(18, 12, '#');
  g.rect(0, 0, 18, 12, '#', ':'); g.put(8, 11, 'x'); g.put(6, 4, 'C'); g.put(8, 2, 'A'); g.put(2, 2, 's'); g.put(15, 2, 's'); g.put(2, 8, 's'); g.put(15, 8, 'r');
  defMap('sm_pawn', { name: 'BEACH PAWN', title: 'BEACH PAWN & LOAN', sub: '', hub: 'sm', music: 'convo', f: ['wood'], w: ['brick'], amb: .45, shadow: '#100c08',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('sm_streets', 'pawn_out')], C: pr('counter'), s: pr('shelf'), r: pr('rack'),
      A: npc('pill', { name: 'ARTHUR', sprite: 'civ3', port: 'civ3', conv: 'arthur', ai: 'static', dir: 0, invuln: 1 }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 8, y: 10 }), light(4, .8, { x: 8, y: 5, col: '#ffd890' }), Object.assign(tape(4), { x: 15.5, y: 10.5 })],
  });
}
CONV.arthur = async (e) => {
  if (!F.arthur) { F.arthur = 1; await T('N', 'An old man with Prop Pills eyes behind a counter of guns, guitars and one very large ceramic dog. "Visitor discount on Tuesdays. It\'s not Tuesday. It\'s never Tuesday after midnight."'); }
  const c = await C(['Let me see what you have.', { t: 'I have something to sell. A tape.', if: () => invFind('kidtape') }, 'Bye.']);
  if (c === 0) await shopUI({ name: 'BEACH PAWN & LOAN', items: [['w_pistol', 150, 1], ['w_spistol', 400, 1], ['w_shotgun', 320, 1], ['w_xbow', 280, 1], ['w_knife', 40, 2], ['w_bong', 600, 1], ['a_10mm', 12], ['a_shell', 18], ['a_tdart', 30], ['a_dart', 20], ['mod_sil', 300, 1], ['mod_acc', 140, 1], ['armor', 350, 1], ['flare', 8, 6]] }, e);
  else if (c === 1) { await T('N', '"A tape of the beach house? Kid, I\'d buy that for a dollar. I\'d buy it for a hundred. Who\'s gonna believe it? Nobody. That\'s why it\'s worth a hundred."'); const k = await C(['Sold.', 'No. It\'s safer with me.']); if (k === 0) { removeItem(invFind('kidtape')); P.cred += 100; breach('SOLD PROOF', []); } }
};

// ---------- the free clinic ----------
CONV.kwan = async (e) => {
  if (!F.kwan) { F.kwan = 1;
    await T('KWAN', 'You\'re Tommy\'s. Good. I\'m Dr. Kwan. This is a free clinic for humans and a not-free clinic for everyone else. Don\'t look at me like that. Somebody has to pay for the humans.');
    await T('KWAN', 'The donor room upstairs takes a little energy from volunteers. Twenty dollars and a juice box. They feel tired for a day. I bag it. Visitors buy the bags. Nobody gets eaten in an alley.');
    await T('CARL', 'That\'s... actually really smart? That\'s like a blood bank. For, for whatever we have instead of blood.');
    await T('KWAN', 'Vitality. It\'s called vitality. You people have been taking it for ten thousand years. I just put it in a bag and a receipt on it.'); }
  const c = await C(['I\'d like to buy some bags.', { t: 'Is something wrong? You look tired.', if: () => !F.wardJob }, { t: 'About the night ward...', if: () => F.wardJob && !F.wardDone }, { t: 'The night ward is fixed.', if: () => F.wardDone && !F.wardPaid }, 'Bye.']);
  if (c === 0) await shopUI({ name: 'FREE CLINIC (DONOR BAGS)', items: [['biocell', F.wardPaid ? 18 : 28, 12], ['medkit', 35, 6], ['pills', 20, 4]] }, e);
  else if (c === 1) { F.wardJob = 1; await T('KWAN', 'The night ward. Basement. Six beds, people recovering from surgery. They should wake up after a day. They don\'t. Two of them have been asleep for nine days.'); await T('KWAN', 'Charts are normal. Vitals are normal. They\'re just... asleep. Very asleep. Asleep like something\'s using it.'); await T('KWAN', 'Go look. Nights. Something is sitting by those beds.'); goal('sm_ward', 'Find out why Dr. Kwan\'s night-ward patients won\'t wake up (clinic basement).', 1); }
  else if (c === 2) await T('KWAN', 'The ward\'s through the back, down the stairs. The orderly on nights is Dale. Dale\'s fine. Dale is very quiet. Dale has been here nine days.');
  else if (c === 3) { F.wardPaid = 1; goalDone('sm_ward2'); await T('KWAN', F.wardDone === 'killed' ? 'Dale\'s locker is empty. Dale\'s gone. I\'m not going to ask.' : F.wardDone === 'left' ? 'Dale quit. He left a note that said "sorry about the naps." The patients woke up asking for pancakes.' : 'Dale signed up as a donor. He sits by the volunteers now. They love it. Best naps of their lives, they say.'); P.cred += 150; giveItem('biocell', 4); giveSP(500, 'the night ward'); goalDone('sm_ward'); await T('KWAN', 'Bags are cheaper for you now. Professional courtesy.'); }
};
CONV.dale = async (e) => {
  if (F.wardDone) { await T('N', '"..."'); return; }
  await T('N', 'The night orderly sits between two beds, very still, holding one patient\'s hand and one patient\'s wrist. His eyes are open. His breathing matches theirs exactly.');
  await T('N', '"Shh. They\'re sleeping. I\'m helping." His voice is like dry leaves. "I came in from the desert. There\'s so much sleep in a city. Nobody uses it right."');
  const c = await C([{ t: '[Kill him] You\'re killing them slowly. That\'s still killing.' }, { t: 'Get UP. Get OUT. Go back to the desert and sleep with a CACTUS. I\'m serious, I\'ll keep yelling, I can do this all night!', req: ['rant', 1] }, { t: '[CHARM] There are people upstairs who\'d LIKE to sleep. Volunteers. Paid. Juice boxes. You\'d be a hero.', req: ['charm', 1] }, { t: '[DENIAL] I\'m a normal human hospital inspector and this is a code violation.', req: ['denial', 2] }, { t: 'Brother. Sit by beds that want company. Not these.', sp: 'pod' }, 'Leave him for now.']);
  if (c === 0) { e.hostile = 1; e.ai = 'guard'; e.wpn = 'npcclaw'; e.team = 'husk'; e.state = 'combat'; e.target = P; e.onDie = () => { F.wardDone = 'killed'; }; e.onDown = () => { F.wardDone = 'killed'; }; await T('N', 'His mouth opens wider than a mouth opens. Something white and fibrous is inside.'); }
  else if (c === 1) { F.wardDone = 'left'; e.hidden = 1; e.gone = 1; await T('N', 'Dale stands up, alarmed, then very alarmed, and leaves through the fire door. The patients sigh in their sleep, all at once.'); }
  else if (c === 2 || c === 3 || c === 4) { F.wardDone = 'donor'; await T('N', '"...Volunteers. People who WANT to sleep." He looks at the patients with real tenderness. "That would be... nice." He lets go of their hands.'); e.hidden = 1; e.gone = 1; gainHumanity('found another way'); }
  if (F.wardDone) { goal('sm_ward2', 'Tell Dr. Kwan the night ward is fixed.', 1); if (F.wardDone !== 'killed') goalDone('sm_ward'); }
};
{
  const g = mk(30, 24, '%');
  g.rect(0, 0, 30, 13, '%', ':'); g.put(13, 12, 'x');
  g.rect(0, 0, 11, 7, '%', ':'); g.put(5, 6, '+'); g.rect(20, 0, 10, 7, '%', '.'); g.put(24, 6, 'D');
  g.put(4, 3, 'K'); g.put(7, 2, 'k'); g.put(23, 2, 'b'); g.put(26, 2, 'b'); g.put(24, 4, 'v'); g.put(27, 4, 'v');
  for (const x of [13, 15, 17]) g.put(x, 9, 'h');
  g.put(18, 3, 'c'); g.put(14, 3, 'n');
  g.put(28, 10, 'S');
  // the basement night ward
  g.rect(0, 13, 30, 11, '%', '.'); g.put(28, 14, 's');
  for (const x of [3, 8, 13, 18]) { g.put(x, 16, 'B'); g.put(x, 20, 'B'); }
  g.put(23, 18, 'D2'); g.put(24, 17, 'l'); g.put(25, 21, 'w');
  defMap('sm_clinic', { name: 'SANTA MONICA FREE CLINIC', title: 'FREE CLINIC', sub: 'HUMANS FREE / OTHERS ASK', hub: 'sm', music: 'convo', f: ['linoleum', 'tile', 'lab'], w: ['white', 'lab'], amb: .35, shadow: '#081010',
    grid: g.str().replace('D2', '2'),
    key: {
      x: [door({ name: 'EXIT' }), exitTo('sm_streets', 'clinic_out')], '+': door({}), D: door({ name: 'DONOR ROOM' }),
      K: npc('civ', { id: 'kwan', name: 'DR. KWAN', sprite: 'kwan', port: 'KWAN', conv: 'kwan', ai: 'static', dir: 0, knows: 1, invuln: 1 }), k: comp([['kwan', 'juicebox', { mail: ['sm_kw1'] }]], { c: { hackStr: .3 } }),
      b: pr('bed'), v: npc('civ', { name: 'DONOR', sprite: 'civ4', ai: 'static', down: 1, state: 'down', sleeper: 1 }), h: pr('bench'), c: pr('counter'), n: reader('sm_chart', { p: 'sign', label: 'WARD CHARTS' }),
      S: exitTo('sm_clinic', 'ward', { label: 'STAIRS DOWN' }), s: exitTo('sm_clinic', 'up', { label: 'STAIRS UP' }),
      B: pr('bed'), l: pr('locker', { label: 'DALE\'S LOCKER', text: 'sm_dale' }),
      2: npc('civ', { id: 'dale', name: 'DALE (NIGHT ORDERLY)', sprite: 'patient', conv: 'dale', ai: 'static', dir: 2, vis: 'pod', knows: 1 }),
      w: npc('civ', { name: 'PATIENT', sprite: 'patient', ai: 'static', down: 1, state: 'down', sleeper: 1 }),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 13, y: 11 }), spawnPt('ward', Math.PI, { x: 27, y: 14.5 }), spawnPt('up', Math.PI, { x: 27, y: 10.5 }),
      light(5, .8, { x: 13, y: 9 }), light(3, .6, { x: 5, y: 3 }), light(3, .6, { x: 24, y: 3 }), light(3, .25, { x: 10, y: 18, col: '#60a0ff' }), light(2, .4, { x: 23, y: 18 }),
      npc('civ', { name: 'PATIENT', sprite: 'patient', x: 4, y: 17, ai: 'static', down: 1, state: 'down', sleeper: 1 }), npc('civ', { name: 'PATIENT', sprite: 'patient', x: 14, y: 21, ai: 'static', down: 1, state: 'down', sleeper: 1 }),
      npc('civ', { name: 'WAITING PATIENT', sprite: 'civ1', x: 15, y: 10, ai: 'static', dir: 1 }), Object.assign(tape(5), { x: 1.5, y: 22.5 })],
  });
}
txt('sm_chart', 'WARD CHARTS', 'BED 2 - post-op, appendix. Day 9. Vitals normal. Will not wake.\nBED 4 - post-op, knee. Day 9. Vitals normal. Will not wake.\nBED 5 - post-op, gallbladder. Day 4. Vitals normal. "Smiles in sleep."\n\nNIGHT ORDERLY: D. (no last name on file)\nStarted: 9 days ago.\nNotes: "very attentive."\n\n(Taped inside the clipboard, in Dr. Kwan\'s handwriting: kwan / juicebox. Do not tell the night staff.)', { login: ['kwan', 'juicebox'], note: 'Dr. Kwan\'s computer login: kwan / juicebox.' });
txt('sm_dale', 'DALE\'S LOCKER', 'A uniform, folded perfectly. A pair of shoes that have never been worn. And at the bottom, in a nest of sand, a seed pod the size of a football, warm to the touch, breathing very slowly in time with the patients upstairs.', { note: 'Dale the night orderly keeps a breathing seed pod in his locker. Pod Person. He\'s feeding on the night ward\'s sleep.' });
mail('sm_kw1', 'DR. KWAN', 'tommy2p', 'bags', 'Tommy - 40 bags for the Consulate this week. They pay late and they pay in favors. I don\'t take favors. Tell Linda I take money. - K');

// ---------- THE OCEAN HOUSE (new lore: Walter Coldwell, 1957) ----------
txt('oh_portrait', 'PORTRAIT', 'A family portrait, 1956. A man in a gray suit, smiling with his mouth only. A woman with dark curls and a locket. Two children: a girl with a toy rocket and a little boy holding his father\'s hand and looking up at him like he\'s trying to see something.\n\nThe brass plate says THE COLDWELLS. Somebody has scratched the father\'s eyes out.');
txt('oh_ruthie', 'CRAYON DRAWING', 'A crayon drawing of a house with a big round sun. Four stick people. The tall one is colored green. The other three are blue.\n\nUnderneath, in careful kid writing: DADDY IS COLD. MOMMY SAYS DONT TELL.');
txt('oh_diary1', 'JUNE\'S DIARY (1)', 'May 3, 1957\nWalter came to bed with frost on his collar again. In May. He says it\'s the walk-in freezer. We don\'t have a walk-in freezer.\nThe guests in 4 checked out early. They said they were "so cold, so tired." They looked gray.');
txt('oh_diary2', 'JUNE\'S DIARY (2)', 'June 11, 1957\nI saw him. In the laundry room with the night porter. His hand on the boy\'s shoulder like a father. The boy was shaking and blue. And Walter\'s face, just for a second, wasn\'t a face. It was scales and a mouth.\nI didn\'t scream. I went upstairs and I sat with the children and I didn\'t scream.');
txt('oh_diary3', 'JUNE\'S DIARY (3)', 'July 1, 1957\nI called my sister. I told her Walter isn\'t Walter. She thinks I mean he\'s changed. I didn\'t correct her. How do you say it?\nI\'m taking the children to her in Fresno on Friday. I put my locket in the icebox in the cellar where he never goes, because it\'s cold, and he hates the cold the way only something that lives on warmth can. If anything happens, it has our picture.');
txt('oh_mirror', 'BATHROOM MIRROR', 'The mirror is fogged, in a cold room. Letters are drawn in the fog from the other side:\n\nHE WASN\'T HIM\n\nThen, slowly, underneath:\n\nARE YOU?');
txt('oh_ledger', 'HOTEL REGISTER', 'THE OCEAN HOUSE - REGISTER\nJuly 3, 1957\nRm 2: Mr. & Mrs. Dent, Fresno - checked out, "cold"\nRm 4: [left blank]\nRm 6: Mr. W. Coldwell (the owner sleeps in 6 when the family is upstairs?)\n\nThe last entry is in a different hand: GUESTS: NONE. FAMILY: GONE TO FRESNO.\nNobody ever arrived in Fresno.');
ITEMS.locket = { name: 'JUNE\'S LOCKET', w: 1, h: 1, quest: 1, use: () => readText('oh_locket'), desc: 'A silver locket, cold from forty years in an icebox.' };
txt('oh_locket', 'JUNE\'S LOCKET', 'Inside: a tiny photograph of a woman with dark curls and two children, cut so it doesn\'t include the man who was standing next to them.\n\nEngraved on the back: SO SOMEBODY KNOWS.');
CONV.june = async (e) => {
  if (F.ohRest) return;
  if (!invFind('locket')) { await T('N', 'The pale woman looks at you. Her mouth moves, and the sound arrives a second later, like a bad phone line: "...the cold... the icebox... so somebody knows..."'); return; }
  await T('N', 'She is solid for a second. Dark curls. A dress from 1957. She looks at the locket in your hand and then at you, and for the first time she isn\'t frightening, she\'s just tired.');
  defSpeaker('JUNE', { name: 'JUNE COLDWELL', col: hex('#c0d8ff'), voice: [660, 20] });
  await T('JUNE', 'You found it. Forty years. Nobody went down there. It\'s cold down there. He made sure everything else here was cold too.');
  await T('JUNE', 'You\'re one of them. Aren\'t you. I can see it. You have a face over your face too.');
  await T('CARL', 'No- I mean, I- I don\'t have a face over my face, this is the face, this is just my face. But I\'m... yeah. I\'m not from here. Probably. Nobody knows.');
  await T('JUNE', 'Then tell me. Was he ever Walter? The man I married. Was there ever a Walter, or was it always the thing in the laundry room?');
  const c = await C(['I don\'t know. I don\'t know if there\'s a "real" under anybody. I don\'t know if there\'s one under me.', 'He was a visitor pretending to be your husband. The man you married was a costume.', { t: 'Maybe it was both. Maybe he really loved you and he was still a monster. People can be both. Things can be both.', if: () => (P.hum || 7) >= 5 }, { t: 'You\'re dead. It doesn\'t matter.', if: () => (P.hum || 7) <= 4 }]);
  if (c === 0) { await T('JUNE', '...That\'s the most honest thing anyone has said in this house since 1957.'); gainHumanity('told her the truth'); }
  else if (c === 1) { await T('JUNE', 'Then I loved a costume. People do. I suppose I\'m not special.'); }
  else if (c === 2) { await T('JUNE', 'Both.' + ' ' + 'Yes. That\'s worse. That\'s true.'); gainHumanity('said the hard thing kindly'); }
  else { await T('JUNE', '...'); await T('N', 'Every light in the house goes out at once. When they come back, she is gone, and the locket in your hand is so cold it burns.'); loseHumanity('was cruel to a ghost'); }
  await T('JUNE', 'His name is still on a door somewhere. Coldwell. He didn\'t die. Things like him don\'t. If you ever find him, tell him somebody knows.');
  F.ohRest = 1; F.ohDone = 1; F.coldwellName = 1; removeItem(invFind('locket')); e.hidden = 1; e.gone = 1; giveSP(700, 'the Ocean House'); goalDone('sm_ocean');
  addNote('June Coldwell\'s ghost: her husband Walter was a Reptilian who drained the family in 1957 to keep the Normalcy. "He didn\'t die. Things like him don\'t." His name is still on a door somewhere.');
  for (const m of [P.map]) { m.lightsOut = {}; computeLight(m); }
  chatSay('chat is crying', 1); chatSay('that was so sad', 1); chatSay('THE LOCKET', 1);
};
// the haunting: shared by the three Ocean House maps
function hauntTick(M) {
  if (F.ohRest || P.map !== M) return; const r = Math.random();
  M.hauntT = (M.hauntT || 240) - 1; if (M.hauntT > 0) return; M.hauntT = 180 + rnd(300);
  const lamps = M.ents.filter(e => e.k === 'light' || (e.k === 'prop' && PROPS[e.p] && PROPS[e.p].light));
  if (r < .25 && lamps.length) { const l = pick(lamps); M.lightsOut[l.uid] = 1; computeLight(M); sfx('powerdown'); setTimeout(() => { if (M.lightsOut) { delete M.lightsOut[l.uid]; computeLight(M); } }, 1500 + rnd(3000)); }
  else if (r < .45) { const d = Object.values(M.doors).find(d => { const r = Math.hypot(d.x + .5 - P.x, d.y + .5 - P.y); return d.open && r < 7 && r > 1.6 && !M.ents.some(e => e.k === 'npc' && !e.gone && Math.hypot(e.x - d.x - .5, e.y - d.y - .5) < .9); }); if (d) { d.open = 0; d.o = 0; rebuildBlock(M); M.visDirty = 1; sfx('door'); post.shake = 2; setTimeout(() => post.shake = 0, 150); M.fx.push({ txt: 'SLAM', x: d.x, y: d.y, t: 40, t0: 40, c: UIC.red }); } }
  else if (r < .65) { const pr2 = M.ents.filter(e => e.k === 'prop' && ['chair', 'table', 'crate', 'plant', 'tv', 'crt'].includes(e.p) && Math.hypot(e.x - P.x, e.y - P.y) < 6 && Math.hypot(e.x - P.x, e.y - P.y) > 1.5); if (pr2.length) { const p = pick(pr2), a = Math.atan2(P.y - p.y, P.x - p.x); spawnEnt(M, { k: 'proj', ptype: 'zap', x: p.x + .5, y: p.y + .5, vx: Math.cos(a) * 9, vy: Math.sin(a) * 9, life: 1, dmg: 6, src: { x: p.x, y: p.y }, col: '#c0c8d8', size: 3 }); sfx('throw'); M.fx.push({ txt: '!', x: p.x, y: p.y, t: 30, t0: 30, c: UIC.red }); } }
  else if (r < .85) { M.fx.push({ txt: pick(['...so cold...', '...don\'t tell...', '...Walter?...', '...the icebox...', '...somebody has to know...', '...are you him?...']), x: P.x + (Math.random() - .5) * 4, y: P.y - 1, t: 120, t0: 120, c: hex('#a0b8e0') }); sfx('chat'); }
  else { const a = Math.random() * 6.28, x = P.x + Math.cos(a) * 3, y = P.y + Math.sin(a) * 3; if (passable(M, x, y, {})) { const g = spawnEnt(M, { k: 'npc', t: 'haunt', x, y, ai: 'static', wpn: null, team: 'civ' }); g.face = angTo(g, P); sfx('hurt'); post.flash = .2; chatSay(pick(['AAAAA', 'DID YOU SEE THAT', 'nope', 'im out', 'turn around carl']), 1); setTimeout(() => { if (!g.gone) removeEnt(M, g); }, 900); } }
}
{ // lobby
  const g = mk(34, 24, '#');
  g.rect(0, 0, 34, 24, '#', ':'); g.put(16, 23, 'x');
  g.rect(0, 0, 12, 10, '#', ':'); g.put(11, 6, '+');                        // dining room
  g.rect(22, 0, 12, 10, '#', '.'); g.put(22, 6, '+');                       // office
  g.fill(13, 1, 8, 1, 'W');
  g.put(15, 6, 'c'); g.put(17, 4, 'P'); g.put(4, 4, 't'); g.put(7, 4, 't'); g.put(4, 7, 'h'); g.put(7, 7, 'h'); g.put(26, 3, 'd'); g.put(30, 3, 'k'); g.put(28, 7, 'r');
  g.put(31, 20, 'S'); g.put(0, 20, 'C'); g.put(16, 14, 'p'); g.put(8, 16, 's'); g.put(24, 16, 's'); g.put(3, 12, 'l'); g.put(30, 12, 'l'); g.put(16, 10, 'n');
  defMap('oh_lobby', { name: 'THE OCEAN HOUSE', title: 'THE OCEAN HOUSE', sub: 'EST. 1951 - CLOSED', hub: 'sm', music: 'haunt', f: ['wood', 'carpet', 'wood'], w: ['wood', 'office'], amb: .1, shadow: '#04060c', mem: '#0a1020',
    grid: g.str(),
    key: { x: [door({ name: 'FRONT DOOR' }), exitTo('sm_streets', 'oh_out')], '+': door({}),
      c: pr('counter', { label: 'FRONT DESK', text: 'oh_ledger' }), P: pr('piano'), t: pr('table'), h: pr('chair'), d: pr('desk', { items: [['key_cellar', 1]], label: 'MANAGER\'S DESK' }), k: pr('shelf'), r: reader('oh_diary1', { p: 'sign', label: 'DIARY PAGE' }),
      S: exitTo('oh_upper', 'down', { label: 'STAIRS UP' }), C: [door({ id: 'cellar', name: 'CELLAR DOOR', lock: 1, key: 'cellar', str: .9 }), exitTo('oh_cellar', 'top')],
      p: reader('oh_portrait', { p: 'poster', label: 'PORTRAIT' }), s: pr('sofa'), l: pr('lamp'), n: npc('civ', { id: 'june', t: 'haunt', name: '???', sprite: 'haunt', conv: 'june', ai: 'static', team: 'civ', invuln: 1, ghost: 1, cond: () => !F.ohRest }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 16, y: 22 }), spawnPt('up', Math.PI, { x: 30, y: 20.5 }), spawnPt('cellar_up', 0, { x: 1.5, y: 20.5 }), light(3, .4, { x: 16, y: 18, col: '#80a0c0' }), light(2, .3, { x: 27, y: 5 })],
    first() { infolink(F.tJob ? 'THERESE' : 'TOMMY', F.tJob ? 'Find out what is scaring the buyers. If it is squatters, evict them. If it is a ghost, I suppose evict that.' : 'Carl. Why are you in the Ocean House. Why. You can leave. Leaving is allowed.'); goal('sm_ocean', 'Find out what haunts the Ocean House.', 1); },
    tick: hauntTick,
  });
  KEYNAMES.cellar = 'OCEAN HOUSE CELLAR KEY';
}
ITEMS.key_cellar = { name: 'CELLAR KEY', w: 1, h: 1, key: 'cellar', desc: 'An old iron key on a tag: CELLAR - ICEBOX.' };
{ // upstairs
  const g = mk(34, 20, '#');
  g.rect(0, 0, 34, 20, '#', ':'); g.fill(1, 8, 32, 3, '.');
  for (const [x, n] of [[0, 1], [8, 2], [16, 3], [24, 4]]) { g.rect(x, 0, 9, 9, '#', ':'); g.put(x + 4, 8, '+'); }
  g.rect(0, 10, 12, 10, '#', ':'); g.put(6, 10, '+'); g.rect(11, 10, 11, 10, '#', ':'); g.put(16, 10, 'D'); g.rect(21, 10, 13, 10, '#', ':'); g.put(27, 10, '+');
  g.put(31, 9, 's');
  g.put(3, 3, 'b'); g.put(11, 2, 'b'); g.put(13, 2, 'b'); g.put(19, 3, 'b'); g.put(28, 3, 'h'); g.put(29, 5, 't');
  g.put(12, 5, 'R'); g.put(5, 14, 'M'); g.put(15, 14, 'B'); g.put(18, 14, 'q'); g.put(24, 13, 'b'); g.put(30, 16, 'k'); g.put(26, 16, 'r'); g.put(20, 4, 'y');
  defMap('oh_upper', { name: 'THE OCEAN HOUSE - UPSTAIRS', title: '', hub: 'sm', music: 'haunt', f: ['carpet', 'carpet', 'wood'], w: ['wood'], amb: .09, shadow: '#04060c', mem: '#0a1020',
    grid: g.str(),
    key: { '+': door({}), D: door({ id: 'nursery', name: 'NURSERY', lock: 1, str: .2 }), s: exitTo('oh_lobby', 'up', { label: 'STAIRS DOWN' }),
      b: pr('bed'), h: pr('chair'), t: pr('table'), R: reader('oh_ruthie', { p: 'poster', label: 'CRAYON DRAWING' }), M: reader('oh_mirror', { p: 'sign', label: 'MIRROR' }),
      B: pr('bed'), q: pr('crate', { label: 'TOY CHEST', items: [['candy', 2]] }), k: pr('shelf'), r: reader('oh_diary2', { p: 'sign', label: 'DIARY PAGE' }), y: reader('oh_diary3', { p: 'sign', label: 'DIARY PAGE', onRead: () => { F.ohDiary3 = 1; addNote('June\'s diary: she hid her locket in the icebox in the Ocean House cellar. The cellar key is probably in the manager\'s office downstairs.'); } }) },
    ents: [spawnPt('down', Math.PI, { x: 30, y: 9 }), light(2, .3, { x: 16, y: 9, col: '#8090b0' }), light(2, .25, { x: 5, y: 15, col: '#a0b0d0' }), Object.assign(tape(6), { x: 2.5, y: 18.5 })],
    tick: hauntTick,
  });
}
{ // the cellar
  const g = mk(26, 18, '$');
  g.rect(0, 0, 26, 18, '$', ','); g.put(2, 1, 's');
  for (let x = 4; x < 22; x += 4) g.put(x, 6, 'p');
  g.put(20, 14, 'I'); g.put(4, 13, 'b'); g.put(10, 15, 'c'); g.put(14, 11, 'c'); g.put(22, 3, 'g'); g.put(8, 3, 'W');
  defMap('oh_cellar', { name: 'THE OCEAN HOUSE - CELLAR', title: '', hub: 'sm', music: 'haunt', f: ['concrete', 'concrete'], w: ['stone'], amb: .06, shadow: '#000408', mem: '#060c14',
    grid: g.str(),
    key: { s: exitTo('oh_lobby', 'cellar_up', { label: 'STAIRS UP' }), p: pr('pillar'), b: pr('barrel'), c: pr('crate', { items: [['flare', 2]] }), g: pr('generator', { label: 'BOILER' }),
      I: pr('fridge', { label: 'ICEBOX', items: [['locket', 1]], light: [2, .5, '#a0c8ff'] }),
      W: npc('haunt', { id: 'walter', name: 'THE COLD MAN', sprite: 'v_reptilian', ai: 'guard', team: 'haunt', speed: 2.4, wpn: 'npcclaw', invuln: 1, ghost: 1, cond: () => !F.ohRest }) },
    ents: [spawnPt('top', Math.PI / 2, { x: 2.5, y: 2.5 }), light(2, .4, { x: 20, y: 13, col: '#a0c8ff' })],
    first() { infolink('TOMMY', 'Carl? Your signal\'s all frosty. Are you somewhere cold? Don\'t be somewhere cold.'); },
    tick(M) { hauntTick(M); const w = find('walter'); if (w && !F.ohRest && w.state === 'combat' && frame % 30 === 0) M.fx.push({ txt: pick(['KEEP IT NORMAL', 'they SAW', 'nobody knows', 'cold... so cold...']), x: w.x, y: w.y, t: 50, t0: 50, c: hex('#80c0ff') }); if (invFind('locket') && !F.gotLocket) { F.gotLocket = 1; infolink('TOMMY', 'Whatever you just picked up, the whole house just took a breath. Go upstairs. Show it to her. To... whoever.'); const j = MAPS.oh_lobby; } },
  });
}
// the lobby ghost is only there once you have read about the icebox
MAPS.oh_lobby.key.n.cond = () => !F.ohRest && (F.ohDiary3 || invFind('locket'));

// ---------- THE BEACH HOUSE ----------
txt('bh_note', 'NOTE ON THE FRIDGE', 'CHORES\n- feed the meat (twice a day, they get weak)\n- don\'t feed ON the meat during chores\n- move the saucer before sunup\n- NOBODY touches the gas. the gas is for THE DAY. when the day comes we light the beach\n\n- the Host');
txt('bh_sermon', 'NOTEBOOK', 'They make us wear their faces. They make us whisper. They make us eat in alleys like rats. We crossed the dark between stars to be ashamed?\n\nThe prophet says: drop the act. The prophet says: the box is coming, and when it opens, every visitor on Earth will remember what they are, all at once, and there will be no Normalcy left to keep.\n\nI have never met the prophet. He speaks from a screen.');
CONV.bh_captive = async (e) => {
  if (e.freed) { await T('N', '"Thank you... thank you..."'); return; }
  await T('N', 'A man zip-tied to a radiator, gray with exhaustion. His eyes go wide when he sees you. "Are you- are you one of them?"');
  const c = await C(['I\'m a normal human. Here. Let me cut that.', { t: '[Feed] ...Sorry.', if: () => true }, 'Stay quiet. I\'ll come back.']);
  if (c === 0) { e.freed = 1; e.ai = 'civ'; e.state = 'flee'; e.threat = P; e.down = 0; F.bhFreed = (F.bhFreed || 0) + 1; gainHumanity('freed a captive'); await T('N', 'He runs for the deck door without looking back.'); setTimeout(() => { if (!e.gone) removeEnt(P.map, e); }, 4000); }
  else if (c === 1) { e.feedOK = 1; msg('He cannot run. (Hold F.)'); }
};
CONV.bh_host = async (e) => {
  await T('N', 'A tall man in a Hawaiian shirt with something wrong under it, feeding casually on a woman on the couch. He looks up, licks his teeth, and smiles. His face slides a little.');
  defSpeaker('HOST', { name: 'THE HOST', col: hex('#ff6080'), voice: [220, 70], port: 'invader' });
  await T('HOST', 'Oh, look. A collaborator. A little Consulate pet in a bow tie. Did they tell you we\'re monsters?');
  await T('CARL', 'You\'re eating a lady on a couch. On the couch! I don\'t think I need anybody to tell me anything!');
  await T('HOST', 'She\'s fine. She\'s a snack. You eat too, little pet. You just do it in the dark and say sorry after. We say grace.');
  await T('HOST', 'The prophet says the box is coming. When it opens, you\'ll stop pretending too. You\'ll be grateful.');
  const c = await C(['What box?', { t: '[RANT] Get away from her or I swear I will talk at you until you DIE, I have DONE it, I have stamina for this-', req: ['rant', 2] }, 'Enough talk.']);
  if (c === 0) { await T('HOST', 'The box from Nevada. Above and below. You know the phrase, don\'t you, pet? I can see it on you.'); await T('CARL', '...'); }
  else if (c === 1) { await T('HOST', '...You\'re very annoying.'); e.hp *= .6; await T('N', 'He drops the woman and backs off a step, rattled. It\'s the first time anyone has called your talking a weapon and meant it.'); }
  F.hostTalk = 1; e.team = 'invader'; e.ai = 'guard'; e.conv = null; e.hostile = 1; e.state = 'combat'; e.target = P; for (const n of P.map.ents) if (n.team === 'invader' && !n.dead) { n.state = 'combat'; n.lastSeen = [P.x, P.y]; }
  chatSay('BOSS FIGHT', 1);
};
function bhPlant() {
  if (F.bhPlanted) return; const v = ['v1', 'v2', 'v3'].filter(k => F['bh_' + k]).length; if (v < 3) { msg('The main is sealed. Open all three gas valves first (' + v + '/3).'); return; }
  if (!(P.ammo.lam > 0)) { msg('You need a pipe bomb. (Tommy\'s. Or anything that goes boom.)'); return; }
  P.ammo.lam--; if (!P.ammo.lam) { const it = invFind('w_lam'); if (it) removeItem(it); }
  F.bhPlanted = 1; F.bhTimer = 45; sfx('beep'); msg('PIPE BOMB SET: 45 SECONDS. GET OUT.'); goal('sm_out', 'GET OUT OF THE BEACH HOUSE. 45 SECONDS.'); chatSay('RUN', 1); chatSay('RUN CARL', 1); chatSay('the music changed', 1);
}
function bhTick(M) {
  if (!F.bhPlanted || F.bhDone) return;
  F.bhTimer -= DT; if (frame % 60 === 0) { sfx('beep'); if (F.bhTimer < 15) msg(Math.ceil(F.bhTimer) + '...'); }
  if (F.bhTimer <= 0) { F.bhDone = 1; if (P.map.id === 'sm_beachhouse') { boom(M, P.x, P.y, 6, 400, null); for (const e of M.ents) if (e.k === 'npc' && !e.dead && e.team === 'invader') kill(M, e, null); } else bhBoomOutside(); }
}
async function bhBoomOutside() {
  const M = P.map; post.shake = 6; post.flash = 1; sfx('boom'); setTimeout(() => { sfx('boom'); post.shake = 0; }, 400);
  if (M.id === 'sm_streets') { M.fx.push({ flash: 1, x: 89, y: 49, t: 120, t0: 120, r: 120, col: '#ff8020' }); M.fx.push({ boom: 1, x: 89, y: 49, t: 40, t0: 40, r: 6 }); }
  goalDone('sm_out'); goalDone('sm_beach', 1200); chatSay('BOOOOM', 1); chatSay('gas leak btw', 1); chatSay('normal gas leak', 1);
  F.bhLoud = (F.bhAlarm || (P.viol || 0) > (F.violBeforeBh || 0)) ? 1 : 0;
  await delay(2); infolink('TOMMY', 'CARL. I heard that from my KITCHEN. Come up. Come up right now. I want to hug you. I won\'t. But I want to.');
}
{
  const g = mk(40, 34, '#');
  g.rect(0, 0, 40, 20, '#', '.');                          // ground floor
  g.fill(1, 19, 38, 1, '#'); g.fill(0, 20, 40, 3, '`'); g.fill(14, 22, 4, 1, 'Q');  // deck, and the way back down to the beach
  g.rect(0, 0, 14, 10, '#', ':'); g.put(13, 6, '+');        // kitchen
  g.rect(26, 0, 14, 10, '#', ':'); g.put(26, 6, '+');       // bedroom (the "pantry")
  g.rect(0, 9, 10, 11, '#', ':'); g.put(9, 14, 'D');        // stairs room
  g.put(20, 0, 'f'); g.put(16, 19, 'q');                    // front door (north), deck door (south)
  g.put(3, 3, 'F'); g.put(7, 2, 'n'); g.put(10, 3, 'C'); g.put(18, 12, 's'); g.put(22, 12, 's'); g.put(20, 8, 't'); g.put(30, 3, 'c'); g.put(34, 3, 'c'); g.put(30, 7, 'c'); g.put(36, 7, 'w');
  g.put(20, 13, 'H'); g.put(19, 14, 'V'); g.put(24, 6, 'i'); g.put(14, 15, 'i'); g.put(32, 14, 'j'); g.put(5, 6, 'j'); g.put(34, 16, 'k'); g.put(3, 15, 'S');
  // the basement: separate floor below (stairs teleport)
  g.rect(0, 23, 40, 11, '$', ',');
  g.put(3, 24, 'U'); g.put(10, 27, '1'); g.put(20, 30, '2'); g.put(33, 26, '3'); g.put(36, 31, 'M'); g.put(16, 25, 'p'); g.put(24, 25, 'p'); g.put(28, 31, 'b'); g.put(6, 31, 'b'); g.put(22, 28, 'J');
  defMap('sm_beachhouse', { name: 'THE BEACH HOUSE', title: 'THE BEACH HOUSE', sub: 'PRIVATE - NO LOOKING', hub: 'sm', music: 'combat', f: ['wood', 'carpet', 'concrete', 'dock'], w: ['wood', 'brick', 'stone'], amb: .1, shadow: '#08020a', trueForms: 1,
    grid: g.str(),
    key: {
      f: [door({ id: 'bhfront2', name: 'FRONT DOOR (BOLTED FROM INSIDE)' }), exitTo('sm_streets', 'bh_out')],
      q: door({ name: 'DECK DOOR' }), Q: exitTo('sm_streets', 'deck_out'),
      '+': door({}), D: door({ id: 'bhstairs', name: 'BASEMENT STAIRS', lock: 1, str: .45 }),
      F: pr('fridge', { text: 'bh_note', label: 'FRIDGE (NOTE)' }), n: reader('bh_sermon', { p: 'sign', label: 'NOTEBOOK' }), C: pr('counter'), s: pr('sofa'), t: pr('tv'), c: pr('bed'),
      w: npc('civ', { name: 'CAPTIVE', sprite: 'civ1', conv: 'bh_captive', ai: 'static', down: 1, state: 'down', knows: 1 }),
      k: npc('civ', { name: 'CAPTIVE', sprite: 'civ4', conv: 'bh_captive', ai: 'static', down: 1, state: 'down', knows: 1 }),
      H: npc('husk', { id: 'host', name: 'THE HOST', sprite: 'invader', conv: 'bh_host', hp: 220, wpn: 'npcshot', ai: 'static', team: 'civ', big: 0 }),
      V: npc('civ', { name: 'WOMAN ON THE COUCH', sprite: 'civ7', ai: 'static', down: 1, state: 'down', knows: 1 }),
      i: npc('invader'), j: npc('invaderg'), S: exitTo('sm_beachhouse', 'basement', { label: 'STAIRS DOWN' }),
      U: exitTo('sm_beachhouse', 'upstairs', { label: 'STAIRS UP' }),
      1: use('GAS VALVE', () => { if (F.bh_v1) return; F.bh_v1 = 1; sfx('pick'); msg('VALVE OPEN. Gas hisses. (' + ['v1', 'v2', 'v3'].filter(k => F['bh_' + k]).length + '/3)'); P.map.fx.push({ gas: 1, smoke: 1, col: '#c0d0a0', x: 10, y: 27, r: 1, t: 600, t0: 600, s: 1 }); }),
      2: use('GAS VALVE', () => { if (F.bh_v2) return; F.bh_v2 = 1; sfx('pick'); msg('VALVE OPEN. Gas hisses. (' + ['v1', 'v2', 'v3'].filter(k => F['bh_' + k]).length + '/3)'); P.map.fx.push({ gas: 1, smoke: 1, col: '#c0d0a0', x: 20, y: 30, r: 1, t: 600, t0: 600, s: 2 }); }),
      3: use('GAS VALVE', () => { if (F.bh_v3) return; F.bh_v3 = 1; sfx('pick'); msg('VALVE OPEN. Gas hisses. (' + ['v1', 'v2', 'v3'].filter(k => F['bh_' + k]).length + '/3)'); P.map.fx.push({ gas: 1, smoke: 1, col: '#c0d0a0', x: 33, y: 26, r: 1, t: 600, t0: 600, s: 3 }); }),
      M: use('GAS MAIN (PLANT PIPE BOMB)', bhPlant),
      p: pr('pillar'), b: pr('barrel'), J: npc('husk'),
    },
    ents: [spawnPt('front', Math.PI / 2, { x: 20, y: 1.5 }), spawnPt('deck', -Math.PI / 2, { x: 16, y: 20.5 }), spawnPt('basement', 0, { x: 4.5, y: 24.5 }), spawnPt('upstairs', 0, { x: 4.5, y: 15.5 }),
      light(4, .6, { x: 20, y: 12, col: '#ff4060' }), light(3, .5, { x: 6, y: 4 }), light(3, .4, { x: 32, y: 4, col: '#ff6080' }), light(3, .5, { x: 16, y: 21 }), light(3, .35, { x: 20, y: 28, col: '#ff8040' }),
      item('biocell', 2, { x: 11.5, y: 1.5 }), item('a_shell', 1, { x: 24.5, y: 17.5 }), item('medkit', 1, { x: 38.5, y: 32.5 }), Object.assign(tape(7), { x: 38.5, y: 1.5 }),
      pr('mcrate', { x: 37, y: 24, items: [['w_lam', 1], ['a_10mm', 2]] })],
    enter(M, first) { if (first) { F.violBeforeBh = P.viol || 0; infolink('TOMMY', 'Basement. Three valves. Then the main. Then RUN. Don\'t stop to eat anybody. I mean it this time.'); } },
    tick(M) { bhTick(M); if (M.alarm > 0) F.bhAlarm = 1; const h = find('host'); if (h && !F.hostTalk && !h.dead && !h.down && dist(h, P) < 4.5 && !G.ui && !CV.active) { F.hostTalk = 1; run(() => startConv('bh_host', h)); } },
  });
}
HUBS.sm.tick = (M) => { if (M.id !== 'sm_beachhouse') bhTick(M); };
