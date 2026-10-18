'use strict';
// ================= HUB 4: PRETEND AIR (LaGuardia + the 747) =================
// A freight airfield northeast of the Lot. Nothing has flown since the recall. In hangar three a Pretend Co. blimp lies where it crashed.
HUBS.air = { name: 'PRETEND AIR' };

txt('air_sign', 'SIGN', 'PRETEND AIR FREIGHT\n"WE MOVE THINGS THAT MAY OR MAY NOT EXIST"\n\nALL FLIGHTS SUSPENDED BY ORDER OF FASCISM INC.');
txt('air_manifest', 'CARGO MANIFEST', 'PRETEND AIR - MANIFEST 2218-B\n\nCONTENTS: PROP PILLS (RECALLED) x 40,000 CASES\nORIGIN: PROP PRESS, ST. THOMAS, NV\nDESTINATION: [REDACTED] / MALL OF THE FUTURE "DEEP STORAGE"\nSTATUS: GROUNDED\n\nNOTE: "St. Thomas" is a ghost town at the bottom of Lake Mead. Nobody has shipped anything from there since 1938. Somebody wrote that note four times.', { onRead: () => { F.stThomas = 1; addNote('Pretend Air manifest: recalled Prop Pills ship from a "Prop Press" in St. Thomas, NV - a town drowned under Lake Mead in 1938.'); } });
txt('air_cube1', 'DATACUBE', 'Tower security: TOWER / CLEARANCE. Turrets around hangar three answer to it.\n\nDoc says don\'t kill anyone who comes in with their hands open. Doc says a lot of things. Doc is right a lot.', { login: ['tower', 'clearance'], note: 'Pretend Air tower security: TOWER / CLEARANCE (hangar three turrets)' });
txt('air_cube2', 'DATACUBE', 'Hangar three side door code: 7741. Blimp\'s gondola is unlocked. Doc\'s cabin is in the back, up the stairs. If you\'re reading this and you\'re not P.P.F., hi. Please leave Doc alone. He is eighty.', { code: '7741', note: 'Hangar three side door: 7741' });
txt('air_docnotes', 'DOC PROPER\'S NOTEBOOK', 'Lab notes, page 412.\n\nProp Pills. Active ingredients: sucrose, starch, a dye. And trace X, which I cannot name because nothing in my library names it. It comes from the press under the lake.\n\nThe pills work on the Buffering when they shouldn\'t work on anything. Placebo response in every patient: 100%. That is not a number. That is a statement.\n\nThe Buffering began the week the Gatebox cloud went live. ICARUS, the brochures call it. Coincidence is a word for when you have not looked hard enough.\n\nHypothesis: the Buffering is not something being done TO them. It is something being taken FROM them. The pills don\'t add. They return.', { onRead: () => { F.docNotes = 1; if (!F.docNotesSP) { F.docNotesSP = 1; giveSP(200, 'research'); } } });
txt('air_bigl4', 'THE BIG LITTER, Chapter 4', 'THE BIG LITTER\nChapter Four: Everybody Lies About Their Height\n\nThe kid came in short and left taller. That\'s what the job does. Or it\'s the boots. I never asked about the boots.\n\nHe asked me if I thought he was normal. I said, "Kid, I\'m a cat who owns a bar and narrates his own life out loud. Normal left the building in 1978 and took the good lasagna with it."\n\nHe laughed. Then he asked again, quieter. That\'s how you know a question is real: they ask it twice.\n\nI told him the truth. I told him nobody\'s normal. I told him the people who say they are have a card that says so, and the card was printed by somebody who wanted something.\n\nHe looked at his card for a long time.', { onRead: () => { if (!F.bigl4) { F.bigl4 = 1; giveSP(50, 'reading'); } } });
mail('air_m1', 'tower', 'all.ppf', 'Turrets', 'Turrets around hangar three are on the tower net. If FATCO comes, they\'ll wake up. If it\'s the little one, Doc says turn them off and let him in. If it\'s the robot, leave them on.');
mail('air_m2', 'D. Proper', 'pilot.x', 'Your brother', 'X,\n\nIf he comes, I will tell him what I know. I will not tell him what you know. That\'s yours to tell.\n\nYou keep saying "spoilers." I am eighty years old. I would like to see the ending.\n\n- D.');

defSpeaker('DOC', { name: 'DOC PROPER', col: hex('#f0f0f0'), voice: [380, 40] });
CONV.robo_air = async (e) => {
  await T('ROBOCOP', 'AGENT DENTON. OBJECTIVE: LOCATE THE SUSPECT DOC PROPER. HE IS IN HANGAR THREE. INSIDE THE BLIMP.');
  await T('CARL', 'The crashed blimp? He lives in a crashed blimp?');
  await T('ROBOCOP', 'AFFIRMATIVE. LOITERING IN A BLIMP. LOCATE HIM. THEN AWAIT FURTHER INSTRUCTION.');
  await T('CARL', 'What further instruction?');
  await T('ROBOCOP', 'IT IS FURTHER. I WILL FOLLOW WHEN THE PERIMETER IS CLEAR.');
  goal('air_doc', 'Find Doc Proper inside the crashed blimp in hangar three.');
  goal('air_turrets', 'Turn off the turrets guarding hangar three (control tower security).', 1);
  e.conv = 'robo_air2';
};
CONV.robo_air2 = async () => { await T('ROBOCOP', 'HANGAR THREE, AGENT DENTON. I AM WATCHING YOUR TIME. YOUR TIME IS LOITERING.'); };
CONV.doc = async (e) => {
  if (F.docTalked) { await T('DOC', pick(['Two pills every six hours, young man. Tell everyone.', 'The press. Under the lake. Go and see.', 'Your brother is a good man. Tell him I said so. He won\'t believe it from me.'])); return; }
  await T('N', 'An old man in a cardigan sits at a fold-down table in the blimp\'s cabin, writing in a notebook by lantern light. He doesn\'t look up.');
  await T('DOC', 'You\'re early. I was told you\'d come later and angrier.');
  await T('CARL', 'Who told you that?');
  await T('DOC', 'Your brother. Sit. Or don\'t. I\'m eighty; I\'ve stopped telling people where to stand.');
  const asked = {};
  for (;;) {
    const c = await C([{ t: 'Pilot X is working with you?', if: () => !asked.x }, { t: 'Do the pills actually work?', if: () => !asked.p }, { t: 'What is the Buffering?', if: () => !asked.b }, { t: 'What do you know about me? The card?', if: () => !asked.c }, 'Doc. They sent someone else. With orders I don\'t have.']);
    if (c === 0) { asked.x = 1; await T('DOC', 'For a month. He brought us the warehouse maps. He brought us FATCO\'s schedules. He brought us you, in a way: he said "my brother will listen if you don\'t lie to him."'); await T('CARL', 'He keeps saying brother. Are we? Are we actually—'); await T('DOC', 'He was very clear that he couldn\'t tell me that either.'); F.knowsPX = 1; }
    else if (c === 1) { asked.p = 1; await T('DOC', 'They work. They shouldn\'t. They\'re sugar, starch, a dye, and a trace of something nobody can name. Placebo response: one hundred percent.'); await T('CARL', 'So they\'re fake.'); await T('DOC', 'They\'re pretend. Pretend Co. Pretend pills. And pretending, it turns out, is the medicine. Isn\'t that funny? I laugh about it at night. Alone. In a blimp.'); }
    else if (c === 2) { asked.b = 1; await T('DOC', 'It started the week the Gatebox cloud went live. ICARUS. The companions in the cylinders all talk to it.'); await T('DOC', 'The Buffered aren\'t sick. Something is being taken out of them. The part that runs ahead of you, that imagines the end of a sentence before you say it. Take that away and you stall.'); await T('CARL', 'So the pills give it back?'); await T('DOC', 'The pills remind you that you can pretend. That\'s the best I\'ve got. The rest is in the press under Lake Mead. St. Thomas. Somebody built a factory in a drowned town. Go and see.'); F.knowsPress = 1; addNote('Doc Proper: the Buffering started when the Gatebox cloud (ICARUS) went live. The Prop Press is under Lake Mead, in the drowned town of St. Thomas.'); }
    else if (c === 3) { asked.c = 1; await T('DOC', 'Show me.'); await T('N', 'Carl hands over the card. The old man holds it to the lantern.'); await T('DOC', 'Hm. Approved two days before you applied. And see this, under the laminate. "DENTON PROGRAM - SOURCE." Not "agent." Source.'); await T('CARL', 'Source of what?'); await T('DOC', 'I\'m a pharmacist, young man. I know what a source is. It\'s where the medicine comes from.'); F.knowsSource = 1; }
    else break;
  }
  await T('DOC', 'I know. I heard the robot on the stairs.');
  F.docTalked = 1; goalDone('air_doc', 400);
  // Robo Mall Cop arrives
  const M = P.map; const r = spawnEnt(M, npc('civ', { id: 'robo_doc', name: 'ROBO MALL COP', sprite: 'robocop', port: 'ROBOCOP', team: 'fatco', ai: 'static', x: 40, y: 11, dir: 0, hp: 260, hpMax: 260, armor: .5, mech: 1, wpn: 'npcrifle', big: 1 }));
  r.face = angTo(r, e);
  await T('ROBOCOP', 'SUSPECT LOCATED. AGENT DENTON: FURTHER INSTRUCTION. EXECUTE THE SUSPECT.');
  await T('CARL', 'He\'s eighty. He\'s in a cardigan.');
  await T('ROBOCOP', 'CARDIGAN NOTED. EXECUTE THE SUSPECT.');
  chatPoll('what do we do', ['KILL DOC', 'REFUSE', 'SHOOT THE COP']);
  const k = await C(['(Shoot Doc Proper.)', 'No. I\'m not doing that.', { t: 'CITATION DISMISSED.', if: () => F.roboPhrase }, '(Turn your gun on Robo Mall Cop.)']);
  if (k === 0) { await T('DOC', '...Tell your brother I said he was right about you. Both halves.'); kill(M, e, P); F.doc = 'killed'; chatReact('kill'); await T('ROBOCOP', 'EXECUTION CONFIRMED. COMMENDATION FILED. CITATION ALSO FILED. FOR HESITATION.'); removeEnt(M, r); }
  else if (k === 1) { await T('ROBOCOP', 'REFUSAL NOTED. CITATION: INSUBORDINATION. I WILL EXECUTE THE SUSPECT.'); await T('CARL', 'Wait—'); kill(M, e, r); F.doc = 'cop'; await T('ROBOCOP', 'DONE. THAT WAS NOT DIFFICULT, AGENT DENTON. THAT WAS THE EASIEST PART OF YOUR JOB. YOU MADE IT DIFFICULT.'); removeEnt(M, r); }
  else if (k === 2) { await T('CARL', 'Citation. Dismissed.'); await T('ROBOCOP', 'CITATION... DIS... MISSED. HAVE A NICE D—'); knockOut(M, r); r.dead = 1; F.doc = 'saved'; F.roboDown = 1; giveSP(300, 'killphrase'); chatSay('CITATION DISMISSED LMAO', 1); }
  else { F.doc = 'fight'; r.team = 'fatco'; r.hostile = 1; r.ai = 'guard'; r.state = 'combat'; r.target = P; r.onDie = () => { F.doc = 'saved'; F.roboDown = 1; }; r.onDown = r.onDie; await T('ROBOCOP', 'AGENT DENTON. CITATION: TREASON.'); }
  if (F.doc !== 'fight') afterDoc();
};
function afterDoc() {
  if (F.doc === 'saved' || F.doc === 'fight') { const d = find('doc'); if (d && !d.dead) { d.conv = 'doc'; giveItem('pills', 4); msg('Doc Proper pressed a bottle of Prop Pills into your hand.'); } }
  F.airDone = 1; F.hqv = 2;
  setTimeout(async () => {
    if (F.doc === 'killed') await infolink('PILOTX', '...Little brother. Come home. We\'ll talk about it at home.');
    else if (F.doc === 'cop') await infolink('PILOTX', 'I heard. It wasn\'t your hand. I know it doesn\'t feel like that matters. It matters.');
    else await infolink('PILOTX', 'He\'s alive. You chose that. Remember that you chose it, later, when they ask.');
    await infolink('FACE', 'Agent Denton. Return to headquarters. Immediately.');
    goal('air_hq', 'Return to FATCO headquarters (through the Lot, motor pool).');
  }, 400);
}
const _airDown = (M, e, killed) => { if (e.id === 'robo_doc' && F.doc === 'fight') { F.doc = 'saved'; F.roboDown = 1; afterDoc(); } };
HUBS.air.down = _airDown;
CONV.tower_pilot = async (e) => {
  await T('PILOT', 'Don\'t shoot. I\'m just a pilot. I\'ve been hiding in this tower for a week. There\'s a cargo plane on the apron fueled and full of Buffered families. The P.P.F. were going to fly them to a clinic in Reno.');
  await T('PILOT', 'FATCO put a turret on the taxiway. If somebody turned it off...');
  goal('air_plane', 'Turn off the taxiway turret so the refugee plane can leave (tower terminal).', 1); F.pilotAsk = 1;
};
defSpeaker('PILOT', { name: 'CARGO PILOT', col: hex('#c0e0c0'), voice: [420, 30], port: 'civ6' });

// ---------- MAP: the airfield ----------
{
  const g = mk(98, 58, ':');
  g.fill(0, 0, 98, 2, ','); g.fill(0, 54, 98, 4, ',');
  g.fill(0, 20, 10, 18, '.'); g.vline(10, 2, 52, '='); g.fill(10, 26, 1, 5, '.');          // staging area, perimeter fence, gate
  g.fill(14, 40, 84, 11, ';'); for (let x = 16; x < 96; x += 6) g.fill(x, 45, 3, 1, '`');   // runway with centerline
  g.fill(12, 28, 86, 8, ':');                                                                 // apron/taxiway
  g.scatter(12, 2, 40, 24, 'b', 40, 3, [':']); g.scatter(12, 51, 84, 3, 'b', 30, 7, [':', ',']);
  // freight terminal (walk-in)
  g.rect(14, 4, 22, 14, '%', '.'); g.put(25, 17, '+'); g.put(14, 10, '+');
  g.stamp(15, 5, `
D.....h....D.....N..
...........e........
...........h......P.
%%%%%%+%%%%%%%%+%%%%
...........
..V.V.V....
.........m.
P.......u..
...........`);
  g.fill(26, 9, 1, 8, '%'); g.put(26, 13, '+'); g.stamp(27, 9, `
........
.K..K...
.....M..
........
..D.....
.......P
........`);
  // control tower (walk-in base, stairs to the top)
  g.rect(40, 4, 9, 9, '#', '.'); g.put(44, 12, '+'); g.put(44, 5, 's'); g.put(41, 10, 'K'); g.put(47, 10, 'q');
  // hangars 1 and 2 (walk-in), hangar 3 (the blimp)
  g.rect(54, 4, 13, 18, '#', '.'); g.fill(58, 21, 5, 1, '.'); g.stamp(55, 5, `
...........
.K.K...M...
...........
.....p.....
...........
.......O.O.
..X........
...........
.K....i....
...........
.M.K.......
...........
.....p.....
...........
.....K.K...
...........`);
  g.rect(68, 4, 13, 18, '#', '.'); g.fill(72, 21, 5, 1, '.'); g.stamp(69, 5, `
...........
.M.M.M.....
...........
...........
.....r.....
...........
.K......K..
...........
...........
.....r.....
...........
...O.O.O...
...........
.......K...
...........
.....K.....`);
  g.rect(82, 4, 15, 22, '#'); g.fill(86, 25, 7, 1, 'h'); g.put(82, 14, 'k2'); g.put(81, 15, 'y');
  // apron: parked planes, fuel depot
  g.put(20, 30, 'a'); g.put(40, 30, 'a'); g.put(60, 30, 'z');
  g.rect(78, 28, 18, 9, '=', ':'); g.fill(86, 28, 3, 1, ':'); for (const [x, y] of [[80, 30], [83, 30], [80, 33], [83, 33]]) g.put(x, y, 'T2');
  g.put(88, 31, 'X'); g.put(90, 31, 'X'); g.put(92, 34, 'X'); g.put(89, 34, 'O');
  // lamps
  for (const [x, y] of [[12, 22], [12, 34], [30, 26], [50, 26], [70, 26], [92, 26], [36, 38], [64, 38], [52, 18], [38, 18]]) g.put(x, y, 'L');
  g.put(3, 28, 'w'); g.put(5, 24, 'r1'); g.put(6, 25, 'f'); g.put(6, 31, 'f'); g.put(3, 33, 'c');
  g.put(12, 27, 'p'); g.put(12, 30, 'p'); g.put(52, 12, '1'); g.put(52, 36, '2'); g.put(30, 24, '3'); g.put(76, 24, '4');
  const grid = g.str().replace('k2', 'k').replace('r1', 'R').replace(/T2/g, 'Y');
  defMap('air_field', { name: 'PRETEND AIR', title: 'PRETEND AIR', sub: 'FREIGHT AIRFIELD - 05:10', hub: 'air', music: 'air', f: ['asphalt', 'grass', 'concrete', 'road', 'concrete'], w: ['concrete', 'brick'], amb: .16, shadow: '#04060e', mem: '#0a1430', out: 1,
    grid,
    key: {
      w: [spawnPt('road', 0), exitTo('lot_streets', 'road', { x: 0, y: 26, h: 5 })],
      R: npc('civ', { id: 'robo_air', name: 'ROBO MALL COP', sprite: 'robocop', port: 'ROBOCOP', conv: 'robo_air', ai: 'static', team: 'fatco', dir: 0, invuln: 1, cond: () => !F.docTalked }),
      f: npc('fatco', { ai: 'static', dir: 0, conv: 'cop_lot' }), c: pr('car'),
      p: npc('ppf', { dir: 2, look: .5 }), r: npc('ppfr', { dir: 1, look: 1 }),
      e: npc('ppf', { id: 'termboss', name: 'P.P.F. DISPATCHER', dir: 1, look: .6 }),
      m: reader('air_manifest', { p: 'computer', label: 'CARGO MANIFEST TERMINAL' }),
      u: npc('ppfr', { dir: 3, look: .8 }),
      s: exitTo('air_tower', 'up', { frobbable: 0 }),
      q: npc('ppf', { dir: 1, look: .7 }),
      i: reader('air_cube2', { p: 'cone', label: 'DATACUBE' }),
      k: door({ id: 'h3side', lock: 1, pick: 0, code: '7741', name: 'HANGAR 3 SIDE DOOR', metal: 1 }),
      y: keypad('7741', 'h3side', { label: 'HANGAR 3 KEYPAD' }),
      h: exitTo('air_hangar', 'front', { when: () => !F.h3locked, no: 'The hangar doors are chained shut. There\'s a side door on the west wall.' }),
      a: pr('plane'), z: pr('plane', { id: 'refugeeplane', label: 'REFUGEE CARGO PLANE' }),
      Y: pr('tank'),
    },
    routes: { r1: '1,2', r2: '3,4' },
    ents: [
      spawnPt('h3out', Math.PI / 2, { x: 89, y: 27 }), spawnPt('h3side_out', Math.PI, { x: 81, y: 13 }), spawnPt('tower_down', Math.PI / 2, { x: 44, y: 7 }),
      exitTo('air_hangar', 'side', { x: 82, y: 14 }),
      npc('ppfr', { route: 'r1' }), npc('ppf', { route: 'r2' }), npc('spider', { x: 60, y: 24, team: 'ppf' }), npc('spider', { x: 75, y: 24, team: 'ppf' }), npc('ppfr', { x: 30, y: 35, dir: 2, look: 1 }), npc('ppf', { x: 66, y: 33, dir: 0, look: 1 }),
      turret({ x: 86, y: 27, ang: Math.PI / 2, team: 'ppf', always: 1, id: 'h3t1' }), turret({ x: 92, y: 27, ang: Math.PI / 2, team: 'ppf', always: 1, id: 'h3t2' }), turret({ x: 52, y: 38, ang: Math.PI, team: 'fatco', id: 'taxiturret', always: 1, hostileTo: 'all' }),
      cam(Math.PI / 2, { x: 60.5, y: 22.3, team: 'ppf' }), cam(Math.PI / 2, { x: 74.5, y: 22.3, team: 'ppf' }),
      reader('air_sign', { p: 'sign', x: 9, y: 24 }), reader('air_cube1', { p: 'cone', x: 31, y: 15, label: 'DATACUBE' }),
      comp([['dispatch', 'freight', { mail: ['air_m1'] }]], { x: 17, y: 6, c: { hackStr: .3 } }),
      item('a_762', 1, { x: 64.5, y: 18.5 }), item('medkit', 1, { x: 74.5, y: 12.5 }), item('biocell', 1, { x: 22.5, y: 16.5 }), item('a_rocket', 1, { x: 79.5, y: 35.5 }), item('lam', 1, { x: 58.5, y: 9.5 }),
      pr('crate', { x: 60, y: 14, items: [['w_rifle', 1], ['a_762', 1]] }), pr('crate', { x: 72, y: 10, items: [['a_20mm', 1], ['multitool', 1]] }),
      trig(() => { infolink('YOKO', 'Pretend Air. Hangar three is the big one, northeast. The P.P.F. have turrets on its front. There\'s a control tower; towers usually control things.'); }, { x: 11, y: 20, w: 4, h: 18 }),
    ],
    enter(M) { if (F.docTalked) { const t = M.ents.filter(e => e.k === 'npc' && e.team === 'ppf' && !e.dead); if (F.doc === 'saved') for (const e of t) { e.team = 'civ'; e.ai = 'civ'; e.wpn = null; } } },
  });
}
// ---------- the tower top ----------
{
  const g = mk(16, 12, '#'); g.stamp(0, 0, `
################
#WWWWWWWWWWWWWW#
W..............W
W..p.......c...W
W..............W
W.....v........W
W..............W
W...D......z...W
W..............W
W.s..........i.W
#WWWWWWWWWWWWWW#
################`);
  defMap('air_tower', { name: 'CONTROL TOWER', title: 'PRETEND AIR', sub: 'CONTROL TOWER', hub: 'air', music: 'air', f: ['tile'], w: ['metal'], amb: .3, shadow: '#04060e',
    grid: g.str(),
    key: { s: exitTo('air_field', 'tower_down'), p: npc('ppfr', { id: 'towersniper', name: 'P.P.F. SNIPER', dir: 1, look: .5, wpn: 'npcrifle', items: [['w_sniper', 1], ['a_3006', 2]] }),
      c: seccomp([['tower', 'clearance', { mail: ['air_m1', 'air_m2'], special: [['HANGAR 3 TURRETS: OFF', () => { const M = buildMap('air_field'); (MAPSTATE.air_field || (MAPSTATE.air_field = snapMap(M))); const s = MAPSTATE.air_field; for (const id of ['h3t1', 'h3t2']) { const e = M.ents.find(e => e.id === id); if (e) (s.ents[e.uid] = s.ents[e.uid] || {}).off = 1; } F.h3turrets = 1; goalDone('air_turrets', 200); return 'Hangar 3 turrets offline.'; }, () => !F.h3turrets], ['TAXIWAY TURRET: OFF', () => { const M = buildMap('air_field'); (MAPSTATE.air_field || (MAPSTATE.air_field = snapMap(M))); const s = MAPSTATE.air_field; const e = M.ents.find(e => e.id === 'taxiturret'); if (e) (s.ents[e.uid] = s.ents[e.uid] || {}).off = 1; F.taxiOff = 1; if (F.pilotAsk) { goalDone('air_plane', 300); setTimeout(() => { infolink('PILOT', 'Taxiway\'s clear! We\'re rolling. Forty-one people are going to Reno because of you, mister. I\'ll tell them a short guy did it.'); chatSay('THE PLANE', 1); chatSay('W', 1); }, 600); } return 'Taxiway turret offline.'; }, () => !F.taxiOff]] }]], { c: { hackStr: .5, team: 'ppf' } }),
      v: npc('civ', { id: 'towerpilot', name: 'CARGO PILOT', sprite: 'civ6', port: 'civ6', conv: 'tower_pilot', ai: 'static', dir: 1 }),
      z: warpPart(4), i: reader('air_bigl4', { p: 'bookshelf', label: 'PAPERBACK ON A SHELF' }) },
    ents: [spawnPt('up', 0, { x: 3, y: 8 }), light(5, .5, { x: 8, y: 6 })],
  });
}
// ---------- hangar three and the crashed blimp ----------
{
  const g = mk(64, 34, '#');
  g.fill(1, 1, 62, 32, '.');
  // the blimp envelope (a long oval of skin) lying across the hangar, its gondola cut open below
  for (let y = 4; y < 19; y++) { const half = Math.sqrt(1 - Math.pow((y - 11.5) / 7.6, 2)) * 26; for (let x = Math.round(32 - half); x <= Math.round(32 + half); x++) g.put(x, y, '$'); }
  // the gondola (inside the envelope, walkable)
  g.fill(14, 9, 36, 6, ','); g.fill(14, 15, 36, 1, '$'); g.fill(20, 15, 1, 3, ','); g.fill(40, 15, 1, 3, ','); g.put(20, 18, '+'); g.put(40, 18, '+');
  g.stamp(14, 9, `
.D...h..$....Z....$..Q....$...Z.....
.........$...........$.....$........
.....c...+...........+.....+....d...
..h......$.....u.....$.....$........
.D.......$..Z....H...$...H.$...N....
.........$...........$.....$........`);
  g.stamp(1, 20, `
.............................................................
..K.K......M.M...........X........K.K.K.......M..............
.............................................................
.......p..................................p..................
..............L...................L...................L......
.............................................................
..K.....K.........................................K.....K....
........................r....................................
.............................................................
..............................q..............................
.....K.M.K..................................K.M.K............
.............................................................
.............................................................`);
  g.fill(26, 33, 12, 1, 'x'); g.put(0, 14, 'y');
  defMap('air_hangar', { name: 'HANGAR THREE', title: 'PRETEND AIR', sub: 'HANGAR THREE - THE BLIMP', hub: 'air', music: 'night', f: ['concrete', 'carpet'], w: ['concrete', 'white', 'white'], amb: .18, shadow: '#08040c',
    grid: g.str(),
    key: {
      x: exitTo('air_field', 'h3out'), y: exitTo('air_field', 'h3side_out'),
      p: npc('ppf', { dir: 1, look: .8 }), r: npc('ppfr', { dir: 3, look: 1 }), q: npc('spider', { team: 'ppf' }),
      u: npc('civ', { id: 'medic2', name: 'P.P.F. MEDIC', sprite: 'ppf2', ai: 'static', dir: 1, talk: ['Doc\'s in the back. Up front. The back is the front in a blimp.', 'We have nine Buffered patients up here and forty thousand cases of pills in a warehouse we can\'t reach.'] }),
      d: npc('civ', { id: 'doc', name: 'DOC PROPER', sprite: 'docproper', port: 'DOC', conv: 'doc', ai: 'static', dir: 2, invuln: 0, hp: 40 }),
      c: reader('air_docnotes', { p: 'desk', label: 'DOC\'S NOTEBOOK' }),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 31, y: 31 }), spawnPt('side', 0, { x: 2, y: 14 }),
      npc('buffered', { x: 26, y: 10, ai: 'static', dir: 1 }), npc('buffered', { x: 30, y: 10, ai: 'static', dir: 1 }), npc('buffered', { x: 44, y: 10, ai: 'static', dir: 1 }),
      pr('crate', { x: 3, y: 21, items: [['pills', 3]], label: 'PROP PILLS CRATE' }), item('medkit', 1, { x: 16.5, y: 13.5 }), reader('air_manifest', { p: 'computer', x: 18, y: 11, label: 'BLIMP LOG' }),
      light(6, .6, { x: 31, y: 26 }), light(4, .6, { x: 30, y: 11 }), light(4, .6, { x: 45, y: 11 }), light(3, .5, { x: 18, y: 11 })],
  });
}

// login sources (QA pass 2026-10-14)
txt('air_dispatchnote', 'CLIPBOARD', 'DISPATCH - NIGHT SHIFT\n\nTerminal: dispatch / freight\nDo not log manifests for the unmarked crates. They are not freight. They are "freight."', { login: ['dispatch', 'freight'] });
MAPS.air_field.ents.push(reader('air_dispatchnote', { p: 'cone', x: 17, y: 5, label: 'CLIPBOARD' }));

// Robo Mall Cop's killphrase (the CITATION DISMISSED option in the hangar)
txt('air_robomanual', 'SERVICE MANUAL', 'ROBO MALL COP - FIELD SERVICE MANUAL (FATCO EDITION)\n\nSECTION 9: EMERGENCY STOP\nIn the event the unit issues a citation in error (e.g. to a child, a dog, a mall Santa, or a Board member), an authorized officer may halt it by stating the phrase:\n\n    "CITATION DISMISSED."\n\nThe unit will power down. Do not let the unit hear you read this section.', { onRead: () => { F.roboPhrase = 1; }, note: 'Robo Mall Cop\'s emergency stop phrase: "CITATION DISMISSED."' });
MAPS.air_tower.ents.push(reader('air_robomanual', { p: 'cone', x: 10, y: 2, label: 'SERVICE MANUAL' }));
