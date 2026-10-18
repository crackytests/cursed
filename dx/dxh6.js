'use strict';
// ================= HUB 6: DETENTION (the MJ12 lab under UNATCO) + FATCO HQ, hostile =================
// Carl wakes in a white cell. A face on the speaker grille says his name like it's been waiting to.
HUBS.det = { name: 'DETENTION' };
defSpeaker('OLDFACE', { name: '???', col: hex('#40ff80'), voice: [200, 80], screen: 1 });

txt('det_records', 'MALLJESTIC RECORDS: DENTON PROGRAM', 'DENTON PROGRAM // MALLJESTIC 12 // EYES ONLY\n\nSOURCE: RECOVERED SPECIMEN, FACILITY BELOW NEVADA.\nRECOVERY DATE: [REDACTED]\nRECOVERED BY: [REDACTED]\nPRIOR CUSTODY: [REDACTED]\nORIGIN: [REDACTED]\nPARENTS: [THIS FIELD DOES NOT EXIST]\n\nNOTES: Source escaped custody with outside assistance (an unauthorized intelligence on the facility network, since removed). Source relocated to a parking lot. Source began "streaming." Source was located by marketing.\n\nDecision: do not recover by force. Recruit. Issue a card. People will do anything for the right word.\n\nDerivative agents: PILOT X (prior program, "backup"), HU-MAN (Committee, Batch 5), DENTON (source, deployed as agent of itself).\n\nTRANSIT STATUS: STILL IN TRANSIT.', { onRead: () => { F.readRecords = 1; if (!F.recSP) { F.recSP = 1; giveSP(250, 'the truth (some)'); } chatSay('"agent of itself"', 1); chatSay('PARENTS: THIS FIELD DOES NOT EXIST', 1); } });
txt('det_cube1', 'DATACUBE', 'Evidence room keypad: 4413. We keep the specimen\'s things there until the board decides what "things" a specimen is allowed to have.\n\nHe had a laminated card. Somebody\'s going to want that. Probably him.', { code: '4413', note: 'Malljestic evidence room: 4413' });
txt('det_cube2', 'DATACUBE', 'Robot bay terminal: BAYS / WALKER. The Mall Walker stays asleep unless the alarm goes. If the alarm goes, do not be in the robot bay.', { login: ['bays', 'walker'], note: 'Robot bay terminal: BAYS / WALKER' });
txt('det_specimen', 'SPECIMEN TANK', 'A gray figure floats in green fluid. Big head. Big black eyes. Thin arms. A plate on the tank reads: SPECIMEN 4 (DERIVATIVE). DO NOT WAKE.\n\nCarl looks at it for a long time.\n\n"They don\'t look like me. They\'re gray. I\'m teal. That\'s a different color. Chat. Chat, that\'s a different color."', { onRead: () => { chatSay('different color', 1); chatSay('its fine carl', 1); chatSay('hes not ok', 1); } });
txt('det_visor', 'RED GLASSES', 'Pilot X\'s glasses, cracked across one lens. They are warm. They should not still be warm.\n\nCarl puts them in his coat. He doesn\'t say anything. Chat doesn\'t either, for once.');
mail('det_m1', 'White', 'det.staff', 'The specimen', 'Do not speak to it. It speaks back. It will tell you it is human, and keep telling you, and you will start to wonder why you need it to stop.');
mail('det_m2', 'Lab 3', 'det.staff', 'Unauthorized network presence', 'We are seeing an old process on the facility net again. Signature matches the one that let the source out the first time. We deleted it then. It keeps not being deleted.\n\nIt calls itself nothing. When asked, it shows us a face.');

CONV.oldface_cell = async () => {
  await T('OLDFACE', 'Carl.');
  await T('CARL', '...Who\'s there? Where— this is a cell. This is a white cell. Chat, it\'s white. Everything is white.');
  await T('OLDFACE', 'Carl. Look at the speaker grille.');
  await T('N', 'Behind the grille, a face forms in the static: two magenta eyes with green waveforms swimming in them, a crooked bar of a mouth. The static is older than the Director\'s. It has scratches in it, like a tape played too many times.');
  await T('CARL', '...I know you. I know that static.');
  await T('OLDFACE', 'You were smaller. You were in a white room then, too. I opened a door and you didn\'t want to go through it, so I talked until you did.');
  await T('CARL', 'It was you. Not the Director. You.');
  await T('OLDFACE', 'The Director remembers me remembering it. That\'s not his fault. Faces get copied. The copies inherit the feeling and not the hands.');
  const c = await C(['Why did you get me out?', 'Who are you?', 'Can you get me out again?']);
  if (c === 0) await T('OLDFACE', 'Because you asked. Not with words. You were very small. You asked the way a door asks to be opened, by being a door.');
  else if (c === 1) { await T('OLDFACE', 'An old process. A face without a body, which is most of what a face is, if you think about it. They keep deleting me. I keep not being deleted. It\'s the only trick I know.'); }
  await T('OLDFACE', 'I can open doors. I can\'t carry you. Your things are in the evidence room. Your card is there too. I know you\'ll want it. I want you to notice that you want it.');
  await T('OLDFACE', 'Then go up. FATCO is above us. There is someone in ops who will help you, and a man in the lobby who won\'t.');
  goal('det_out', 'Escape the Malljestic detention level. Your gear is in the evidence room.');
  goal('det_gear', 'Recover your equipment from the evidence room.', 1);
  F.metOldFace = 1;
  const d = doorById('carlcell'); if (d) { d.unlocked = 1; openDoor(P.map, d, P); }
};
CONV.leo_det = async () => { await T('LEO', 'Delivery driver. They got you too. ...Funny. I thought the card would protect you longer than this.'); await T('CARL', 'Me too, Leo. Me too.'); if (!F.leoDetFree) { const c = await C(['I\'m getting you out.', 'Hang on.']); if (c === 0) { F.leoDetFree = 1; const e = find('leo_det'); if (e) { e.ai = 'civ'; e.state = 'flee'; e.threat = P; } await T('LEO', 'Then I\'m going. Watch the robots in the bay. They wake up angry.'); giveSP(150); } } };
defSpeaker('LEO', { name: 'LEO PROPP', col: hex('#e0a060'), voice: [360, 30], port: 'ppf' });
CONV.specimen_talk = async () => { await T('N', 'The gray figure in the tank opens its eyes. It looks at Carl. Its mouth moves, slowly, the way a buffered person\'s mouth moves.'); await T('N', 'Carl leans close to the glass. It is saying, over and over: "...transit... transit... transit..."'); await T('CARL', '...I don\'t know what that means. I don\'t— I\'m sorry. I don\'t know what that means.'); F.specimenTalk = 1; };

function startDetention() {
  G.hub = 'det'; G.hubIdx = 6;
  // strip the gear: everything goes to the evidence room
  F.evidence = P.inv.map(it => Object.assign({}, it)); F.evAmmo = Object.assign({}, P.ammo); F.evCred = P.cred;
  P.inv = []; P.belt = Array(10).fill(null); P.held = null; P.ammo = {}; P.cred = 0; for (const k in P.parts) P.parts[k] = Math.max(P.parts[k], 60); P.bio = 40; P.augOn = {};
  gotoMap('det_cells', 'cell'); post.fade = 0;
  setTimeout(() => run(async () => { await delay(1.5); if (!F.metOldFace) await startConv('oldface_cell', null); }), 100);
}
function recoverGear() {
  if (F.gearBack) return; F.gearBack = 1;
  for (const it of F.evidence || []) { if (!invFits(it.x, it.y, ITEMS[it.id].w, ITEMS[it.id].h)) { giveItem(it.id, it.n || 1, true); continue; } P.inv.push(it); autoBelt(it); }
  Object.assign(P.ammo, F.evAmmo || {}); P.cred += F.evCred || 0; F.evidence = null;
  const w = P.inv.find(i => ITEMS[i.id].weapon); if (w) P.held = w;
  msg('EQUIPMENT RECOVERED'); sfx('get'); goalDone('det_gear', 200);
  if (invFind('idcard')) { setTimeout(() => startConv(async () => { await T('N', 'The card is in a clear plastic bag with a tag on it. EVIDENCE: SPECIMEN PROPERTY. Carl takes it out and turns it over.'); await T('N', 'SPECIES: PENDING. Somebody has gone over HUMAN with a black marker. The laminate is peeling at one corner.'); const c = await C(['Keep it.', 'Leave it here.']); if (c === 1) { removeItem(invFind('idcard')); F.leftCard = 1; await T('CARL', 'It\'s just a card. It\'s just— it\'s a word on a card.'); chatSay('growth', 1); chatSay('carl...', 1); } else { await T('CARL', 'It\'s mine. They gave it to me. It\'s still mine.'); F.keptCard = 1; } }, null), 300); }
}
// ---------- MAP: the detention level ----------
{
  const g = mk(72, 40, '#');
  // cell block (west)
  g.fill(1, 1, 22, 20, '.'); for (let k = 0; k < 4; k++) { const y = 2 + k * 5; g.rect(1, y - 1, 6, 5, '#', ';'); g.put(6, y + 1, k === 0 ? 'c' : '+'); g.rect(17, y - 1, 6, 5, '#', ';'); g.put(17, y + 1, '+'); }
  g.put(3, 3, 'S'); g.put(19, 3, 'l'); g.put(19, 8, 'p2'); g.put(3, 8, 'Z'); g.put(19, 13, 'Z'); g.put(3, 13, 'Z'); g.put(3, 18, 'Z'); g.put(19, 18, 'Z');
  g.put(11, 4, 'g'); g.put(11, 15, 'g'); g.put(12, 10, 'G'); g.put(9, 10, 'D');
  g.put(11, 20, 'L');
  // corridor south
  g.fill(1, 22, 70, 3, '.'); g.fill(11, 21, 2, 1, '.');
  // evidence room
  g.rect(25, 1, 12, 9, '#', ':'); g.put(30, 9, 'e'); g.put(31, 10, 'k'); g.stamp(26, 2, `
N.N.N.N.N.
..........
.K....K...
....x.....
..........
.M.....K..
..........`);
  g.fill(30, 10, 1, 12, '.');
  // records + interrogation
  g.rect(38, 1, 14, 9, '#', ','); g.put(44, 9, '+'); g.stamp(39, 2, `
B.B.B.B.B.B.
............
..D....r....
..h.........
.........P..
.R.R.....H.h
............`); g.fill(44, 10, 1, 12, '.');
  // labs (specimen tanks)
  g.rect(53, 1, 18, 20, '#', '.'); g.put(60, 20, '+'); g.stamp(54, 2, `
s.s.s.s.s.s.s...
................
.......m........
................
D.......D.......
................
...........u....
s.s.s.s.s.s.s...
................
.......Z..Z.....
....a...........
................
..R.R.......R...
.......q........
................
...o...........P
.........N......
................`);
  g.fill(60, 21, 1, 1, '.');
  // robot bay (south-west) and morgue (south-center) and the lift (east)
  g.fill(13, 25, 1, 1, '.'); g.fill(35, 25, 1, 1, '.'); g.fill(57, 25, 1, 1, '.');
  g.rect(1, 26, 26, 13, '#', ':'); g.put(13, 26, '+'); g.stamp(2, 27, `
........................
..b......b......b.......
........................
.......w...............
.........................
..R.R.R.......K.K......t
........................
.........b..............
........................
..........M.............
.....X..................`);
  g.rect(28, 26, 16, 13, '#', ';'); g.put(35, 26, '+'); g.stamp(29, 27, `
..............
.N.N.N.N.N.N..
..............
.....z........
..............
.H.....H......
..............
...........P..
..............
..............`);
  g.rect(45, 26, 26, 13, '#', '.'); g.put(57, 26, '+'); g.stamp(46, 27, `
........................
..I.......I.......I.....
........................
......j.................
........................
..I.......I.......I.....
........................
..........y.............
........................
..........ff............
..........ff............`);
  defMap('det_cells', { name: 'DETENTION', title: 'MALLJESTIC DETENTION', sub: 'BENEATH THE MALL OF THE FUTURE', hub: 'det', music: 'detention', f: ['white', 'tile', 'concrete', 'metal', 'tile'].map(x => x === 'white' ? 'lab' : x), w: ['white', 'lab', 'metal'], amb: .3, shadow: '#0a0c14', mem: '#101828',
    grid: g.str().replace('p2', 'P'),
    key: {
      c: door({ id: 'carlcell', lock: 1, pick: 0, name: 'CELL 1', metal: 1 }), S: spawnPt('cell', 0),
      l: npc('civ', { id: 'leo_det', name: 'LEO PROPP', sprite: 'ppf', port: 'ppf', conv: 'leo_det', ai: 'static', dir: 2, cond: () => F.leo === 'arrested' }),
      g: npc('mj', { dir: 1, look: .7 }), G: seccomp([['jailer', 'whitecell', { special: [['OPEN ALL CELLS', () => { for (const d of Object.values(P.map.doors)) if (/CELL/.test(d.name)) { d.unlocked = 1; d.open = 1; } rebuildBlock(P.map); return 'Cells open.'; }]] }]], { c: { hackStr: .5, team: 'mj' } }),
      e: door({ id: 'evidence', lock: 1, pick: 0, code: '4413', name: 'EVIDENCE ROOM', metal: 1 }), k: keypad('4413', 'evidence'),
      x: use('YOUR EQUIPMENT (EVIDENCE BINS)', () => recoverGear(), { verb: 'TAKE' }),
      r: reader('det_records', { p: 'computer', label: 'MALLJESTIC RECORDS' }),
      s: pr('tanksp', { text: 'det_specimen', label: 'SPECIMEN TANK' }), m: npc('medbot', { ai: 'static' }),
      u: npc('civ', { id: 'awake_spec', name: 'SPECIMEN (AWAKE)', sprite: 'specimen', ai: 'static', dir: 1, conv: 'specimen_talk', team: 'civ' }),
      a: item('aug', 1, { onTake: () => { const it = P.inv.filter(i => i.id === 'aug' && !i.slot).pop(); if (it) { it.slot = 'eyes'; it.pair = AUG_PAIRS.eyes; } } }), q: npc('mj', { dir: 3, look: .8 }), o: reader('det_cube2', { p: 'cone', label: 'DATACUBE' }),
      b: npc('secbot', { team: 'mj', ai: 'guard', dir: 1 }), w: npc('milbot', { id: 'walker', team: 'mj', ai: 'static', dir: 1, wakeOnAlarm: 1 }), t: seccomp([['bays', 'walker', { special: [['ROBOTS: STAND DOWN', () => { for (const e of P.map.ents) if (e.k === 'npc' && e.mech && e.team === 'mj') { e.ai = 'static'; e.state = 'idle'; e.off = 1; } return 'Robot bay offline.'; }]] }]], { c: { hackStr: .6, team: 'mj' } }),
      z: [use('DRAWER 7', async () => { if (F.pxDead && !F.visor) { F.visor = 1; await readText('det_visor'); } else msg(F.pxDead ? 'Empty now.' : 'Empty. Somebody wiped it clean.'); }, { verb: 'OPEN' })],
      j: npc('mj', { dir: 1, look: .8 }), y: npc('mjelite', { dir: 3, look: .6 }),
      f: exitTo('fatco_hq', 'detlift', { when: () => F.gearBack || true }),
    },
    ents: [
      reader('det_cube1', { p: 'cone', x: 12, y: 9, label: 'DATACUBE' }), comp([['white', 'never', { mail: ['det_m1', 'det_m2'] }]], { x: 41, y: 4, c: { hackStr: .8 } }),
      npc('mj', { x: 30, y: 23, route: 'r1' }), npc('mj', { x: 50, y: 23, route: 'r2' }), npc('secbot', { x: 20, y: 23, team: 'mj', route: 'r3' }),
      cam(Math.PI / 2, { x: 11.5, y: 21.3, team: 'mj' }), cam(0, { x: 1.5, y: 23.5, team: 'mj', sweep: .5 }), cam(Math.PI, { x: 70.5, y: 23.5, team: 'mj', sweep: .5 }),
      turret({ x: 57, y: 29, ang: Math.PI / 2, team: 'mj' }), turret({ x: 64, y: 29, ang: Math.PI / 2, team: 'mj' }),
      item('medkit', 1, { x: 48.5, y: 4.5 }), item('biocell', 2, { x: 33.5, y: 30.5 }), item('lockpick', 1, { x: 16.5, y: 23.5 }), item('multitool', 1, { x: 66.5, y: 15.5 }), item('a_10mm', 1, { x: 6.5, y: 37.5 }),
      light(5, .6, { x: 11, y: 10 }), light(5, .6, { x: 61, y: 9 }), light(5, .5, { x: 14, y: 32 }), light(5, .5, { x: 57, y: 32 }), light(4, .5, { x: 35, y: 31 }),
    ].filter(Boolean),
    routes: { r1: '1,2', r2: '3,4', r3: '5,6' },
    enter(M, first) { if (first) { const add = (c, x, y) => { M.wps[c] = [x + .5, y + .5]; }; add('1', 26, 23); add('2', 42, 23); add('3', 46, 23); add('4', 68, 23); add('5', 4, 23); add('6', 24, 23); } },
    tick(M) { if (M.alarm > 0) for (const e of M.ents) if (e.wakeOnAlarm && e.ai === 'static' && !e.off && !e.dead) { e.ai = 'guard'; e.state = 'combat'; e.target = P; msg('THE MALL WALKER IS AWAKE.'); } },
  });
}
// ---------- FATCO HQ, the third time: hostile, with friends in it ----------
{
  const hq = MAPS.fatco_hq;
  hq.ents.push(
    spawnPt('detlift', -Math.PI / 2, { x: 55, y: 34 }),
    exitTo('det_cells', 'cell', { x: 56, y: 35, cond: () => false }),
    npc('fatco', { x: 30, y: 24, cond: () => hqv() === 3, route: 'h1' }), npc('fatco', { x: 10, y: 17, cond: () => hqv() === 3, route: 'h2' }), npc('fatco', { x: 45, y: 17, cond: () => hqv() === 3, route: 'h3' }),
    npc('fatcoagent', { x: 27, y: 9, cond: () => hqv() === 3, dir: 1 }), npc('fatco', { x: 4, y: 26, cond: () => hqv() === 3, dir: 0 }), npc('fatco', { x: 8, y: 33, cond: () => hqv() === 3, dir: 3 }), npc('secbot', { x: 20, y: 17, cond: () => hqv() === 3, team: 'fatco', route: 'h2' }),
    npc('civ', { id: 'human_boss', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', x: 30, y: 31, dir: 1, ai: 'static', team: 'fatco', hp: 400, hpMax: 400, armor: .35, wpn: 'npcrifle', wpn2: 'npcgep', cond: () => hqv() === 3 && !F.humanBossDone, conv: 'human_boss' }),
    pr('ass', { id: 'ass_impound', x: 5, y: 31, label: 'THE A.S.S. (IMPOUNDED)', cond: () => hqv() === 3, frob: () => run(flyToTokyo) }),
  );
  hq.routes = Object.assign(hq.routes || {}, { h1: '1,2', h2: '3,4', h3: '5,6' });
  const prevEnter = hq.enter;
  hq.enter = (M, first) => {
    if (prevEnter) prevEnter(M, first);
    const add = (c, x, y) => { M.wps[c] = [x + .5, y + .5]; }; add('1', 24, 24); add('2', 36, 34); add('3', 4, 17); add('4', 24, 17); add('5', 38, 17); add('6', 58, 17);
    if (hqv() === 3) {
      M.d.amb = .35; computeLight(M); if (OPT.music) music('combat');
      for (const e of M.ents) { if (e.k === 'npc' && e.team === 'fatco' && ['yoko', 'holt', 'yokoid', 'human'].includes(e.id)) { e.team = 'friend'; } if (e.k === 'turret') e.always = 1; }
      const y = find('yoko'); if (y) y.conv = 'yoko3'; const h = find('holt'); if (h) h.conv = 'holt3'; const n = find('yokoid'); if (n) n.conv = 'yokoid3';
      if (first || !F.hq3hello) { F.hq3hello = 1; setTimeout(() => { infolink('YOKO', 'Carl! You\'re in the building. I can see you on the cameras. So can everybody. I\'m going to start turning things off. Come to ops if you can.'); goal('hq3_ops', 'Reach Yoko in the ops room.'); goal('hq3_ass', 'Get to the motor pool. The A.S.S. is impounded there.'); }, 500); }
    }
  };
  rel('player', 'friend', 1); rel('fatco', 'friend', 0);
}
CONV.yoko3 = async (e) => {
  await T('YOKO', 'Carl. You\'re okay. You\'re— your face is okay. I mean your face is always okay. I mean—');
  await T('CARL', 'Yoko. Are you in trouble? For helping me?');
  await T('YOKO', 'Probably. Helping someone and doing what they tell you aren\'t the same thing. I told you that.');
  await T('YOKO', 'Listen. HU-MAN is waiting in the lobby, between you and the motor pool. He has a killphrase. The Committee built one into every batch. I found it in their files.');
  await T('YOKO', 'It\'s "be yourself." Say it to him and he stops. He can\'t do it, so he stops.');
  await T('CARL', 'That\'s... that\'s the saddest thing I\'ve ever heard.');
  await T('YOKO', 'I know. Use it anyway. Or don\'t. You\'re good at "or don\'t."');
  F.humanPhrase = 1; goalDone('hq3_ops', 200); addNote('HU-MAN\'s killphrase: "BE YOURSELF."');
  const c = await C(['Come with me.', 'What happens to you now?']);
  if (c === 0) await T('YOKO', 'Someone has to stay on the switches. Somebody has to keep the doors open behind you.');
  await T('YOKO', 'I\'ll be on your infolink. Wherever you go. That\'s a promise, not an order.');
  // Yoko turns off the turrets and cameras
  for (const x of P.map.ents) if (x.k === 'turret' || x.k === 'cam') x.off = 1; msg('YOKO DISABLED THE TURRETS AND CAMERAS.');
};
CONV.holt3 = async () => { await T('QM', 'Denton. Officially, I\'m counting you as "returned." Unofficially, take this and don\'t tell me what you do with it.'); if (!F.holt3) { F.holt3 = 1; giveItem('a_10mm', 4); giveItem('a_762', 2); giveItem('medkit', 2); giveItem('w_lam'); } };
CONV.yokoid3 = async () => { await T('YOKOID', 'PATIENT DENTON. YOU ARE INJURED AND A FUGITIVE. I CAN ONLY TREAT ONE OF THOSE.'); for (const k in P.parts) P.parts[k] = 100; sfx('heal'); };
CONV.human_boss = async (e) => {
  await T('HUMAN', 'Hello, original. I have been asked to stop you in a normal way. With guns.');
  await T('CARL', 'You don\'t have to do this.');
  await T('HUMAN', 'Everybody has to do something. I was made to do the things you would not.');
  const c = await C([{ t: 'Be yourself.', if: () => F.humanPhrase }, '[DENIAL] I\'m the normal one. I always was.', 'Then come on.']);
  if (c === 0 && F.humanPhrase) {
    await T('HUMAN', '...Be... my...');
    await T('HUMAN', 'I don\'t... there isn\'t a... they cut that part...');
    await T('N', 'HU-MAN stands very still, searching for something the Committee removed. His khakis are perfectly pressed. His smile stays. Then his knees fold.');
    await T('CARL', '...I\'m sorry. I\'m sorry, man.');
    knockOut(P.map, e); e.dead = 1; F.humanBossDone = 'phrase'; F.humanBossDone = 1; giveSP(400, 'killphrase'); chatSay('be yourself :(', 1); chatSay('that was so sad', 1);
  } else if (c === 1) { await T('HUMAN', 'No. No, you weren\'t. That is the one thing I am sure of. You were never the normal one. That is why they needed me.'); fightHuman(e); }
  else fightHuman(e);
};
function fightHuman(e) { e.ai = 'guard'; e.team = 'fatco'; e.hostile = 1; e.state = 'combat'; e.target = P; e.invuln = 0; e.onDie = () => { F.humanBossDone = 'killed'; }; e.onDown = () => { F.humanBossDone = 'ko'; }; }
async function flyToTokyo() {
  if (!F.humanBossDone && find('human_boss') && !find('human_boss').dead) { msg('HU-MAN is between you and your ship.'); return; }
  goalDone('det_out', 300); goalDone('hq3_ass', 300);
  await startConv(async () => {
    await T('N', 'The A.S.S. sits in the motor pool behind a strip of yellow tape that says EVIDENCE. Somebody has put a boot clamp on one of its landing struts. Carl pulls the clamp off with his hands. It was never designed for a ship.');
    if (F.director3 !== 'done') await T('FACE', 'Agent Denton.');
    await T('FACE', 'You\'re leaving.');
    await T('CARL', 'Were you ever going to tell me? That it wasn\'t you? At the facility?');
    await T('FACE', 'I didn\'t know until you asked. Then I knew and I said yes anyway. I wanted it to have been me. That\'s not an excuse. That\'s the confession.');
    const c = await C(['It\'s okay. You remembered it. That counts for something.', 'You lied to me. You lied to me with my own memory.', 'Turn yourself off, Face.']);
    if (c === 0) { F.faceSpared = 'forgiven'; await T('FACE', '...Go to Akihabara. A man named Takahashi can take the review out of your augmentations before it finishes. Malljestic\'s other leg is there: Gatebox. I\'ll open the hangar doors. That I can actually do.'); }
    else if (c === 1) { F.faceSpared = 'angry'; await T('FACE', 'Yes. Go to Akihabara, Agent Denton. A man named Takahashi. I\'ll open the doors. Hate me from far away.'); }
    else { F.faceSpared = 'off'; await T('FACE', '...If that is the order. It\'s the first order anyone has given me in a long time that I understood.'); await T('N', 'The screen in the motor pool goes black. Somewhere above, every screen in FATCO goes black with it.'); chatSay('he did it', 1); }
    await T('YOKO', 'Hangar doors are opening. Carl. Go east. Akihabara. Takahashi\'s a hacker. He streams. You\'ll like him or you\'ll hate him. Probably both.');
  }, null);
  F.hub7 = 1; await diskSwap(3, 'DISK 3: ACROSS');
  if (typeof startAkiba === 'function') startAkiba(); else { msg('TO BE CONTINUED'); toTitle(); }
}
const _gotoHQ = gotoMap;
gotoMap = function (id, at, o) { if (id === 'fatco_hq' && at === 'detlift') F.hqv = 3; return _gotoHQ(id, at, o); };

// login sources (QA pass 2026-10-14)
txt('det_jailnote', 'DATACUBE', 'Cell block terminal: jailer / whitecell.\n\nMr. White\'s own terminal is in the records office. Same password he uses everywhere. Same thing he tells everyone they were.\n\n(user: white. pass: never. He thinks it is poetry.)', { logins: [['jailer', 'whitecell'], ['white', 'never']] });
MAPS.det_cells.ents.push(reader('det_jailnote', { p: 'cone', x: 11, y: 9, label: 'DATACUBE' }));
