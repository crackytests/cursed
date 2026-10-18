'use strict';
// ================= HUB 9: HOOVER DAM + ST. THOMAS (Vandenberg + the Ocean Lab) =================
// Malljestic holds the dam. A town drowned in 1938 sits at the bottom of Lake Mead, and under its schoolhouse, the press that makes the pills.
HUBS.dam = { name: 'HOOVER DAM' };
defSpeaker('DAMM', { name: 'DR. DAMM', col: hex('#f0d020'), voice: [340, 50] });
defSpeaker('MAYA', { name: 'MAYA DAMM', col: hex('#ffd0a0'), voice: [880, 40], port: 'civ4' });

txt('dam_plaque', 'BRONZE PLAQUE', 'HOOVER DAM\n\nIt is fitting that the flags of the nation fly here, over the work of the men who built it.\n\n(Below the plaque, a newer plate: "POWER CONTRACT 2218-B: ALL OUTPUT ROUTED TO CLIENT FACILITY, BELOW NEVADA. BY ORDER OF MALLJESTIC 12." The bolts are shiny. The plaque is not.)', { onRead: () => { F.damPlaque = 1; } });
txt('st_sign', 'WEATHERED SIGN', 'ST. THOMAS, NEVADA\nPOP. 500\n\n(Founded 1865. Abandoned 1938 when the lake came up. The last resident, a Mr. Hugh Lord, set fire to his own house and rowed away as the water reached his door.)\n\n(Somebody has screwed a newer, cleaner sign underneath: PRETEND CO. PROP PRESS - AUTHORIZED PERSONNEL - DIVE GEAR REQUIRED.)');
txt('st_press', 'PROP PRESS: PROCESS SHEET', 'PROP PRESS // PRETEND CO. // PROCESS SHEET 1\n\nINPUT: Condensed potential (supplied by ICARUS via the client facility, below Nevada).\nCARRIER: Sucrose, starch, dye.\nOUTPUT: Prop Pills (lifestyle placebo).\n\nNotes: Each pill carries a trace of pooled potential, roughly what one buffered person loses in a day. The pill does not cure the Buffering. The pill gives back what was taken, with a sugar coating.\n\nMarketing: "Prop Pills: the pretend pill for people who want to feel like they\'re doing something."\n\nLegal: Recall. Recall now. We were selling people their own minds back at a markup and it was WORKING.', { onRead: () => { F.readPress = 1; if (!F.pressSP) { F.pressSP = 1; giveSP(300, 'the whole truth'); } addNote('THE PROP PRESS: Prop Pills contain a trace of the very potential ICARUS harvests. Pretend Co. was selling people back their own minds. It worked. So they recalled it.'); chatSay('WAIT', 1); chatSay('they were selling them their own minds back', 1); chatSay('at a markup', 1); } });
txt('dam_whitecube', 'DATACUBE', 'Dam security grid: RANGER / BOULDER. Rangers are FATCO surplus; we flashed them to Malljestic, but the old FATCO override is still in there. Somebody fix that.', { login: ['ranger', 'boulder'], note: 'Dam security grid: RANGER / BOULDER (the Robo Rangers)' });
txt('dam_bigl7', 'THE BIG LITTER, Chapter 7', 'THE BIG LITTER\nChapter Seven: Under The Lake\n\nThe kid said there was a town under the lake. I said there\'s a town under every lake, kid, that\'s what a lake is: a town that stopped.\n\nHe said, "JB, they were selling the pills back to people. Made out of the stuff they took."\n\nI\'ve been a detective a long time. I\'ve heard every kind of crooked. I\'ve never heard one that tidy. You take a man\'s lasagna, you sell him back the smell of it. And he thanks you.\n\nI didn\'t write anything for a while after that call. I just sat in the bar with the lights off. Then I wrote this, which I guess is a kind of finishing.', { onRead: () => { if (!F.bigl7) { F.bigl7 = 1; giveSP(50, 'reading'); } } });
mail('dam_m1', 'damm', 'dam.staff', 'The press', 'If anyone reaches the old press under St. Thomas, the master pattern is on a drum in the pressing hall. With the pattern and the dam\'s turbines I can print the pills myself. Without a client. Without a markup. For everyone.');
mail('dam_m2', 'white', 'dam.mj', 'The engineer', 'Keep the engineer alive and keep his daughter close. He will cooperate as long as he believes cooperation is a choice.');

CONV.damm = async (e) => {
  if (F.hasCure && !F.cureMade) {
    await T('DAMM', 'You got it. The pattern. Give it here, give it— oh, look at it. Look at it.');
    await T('DAMM', 'I can run this on the turbines. Pills by the millions. Not sold. Not recalled. Dropped out of crop planes over every parking lot in Nevada if I have to.');
    await T('CARL', 'Does it cure them?');
    await T('DAMM', 'It gives back what\'s been taken. If they stop taking, people stay cured. If they don\'t stop taking, we keep giving it back. It\'s a stalemate. It\'s better than a slaughter.');
    F.cureMade = 1; goalDone('dam_cure2'); goalDone('dam_cure', 800); chatSay('THE CURE', 1); chatSay('W', 1); chatSay('drop it over the lot', 1);
    await T('DAMM', 'And now the other thing. The dam\'s output goes somewhere. Every watt. A line runs north into the desert, into the ground. No map shows it. Below Nevada.');
    await T('DAMM', 'Whatever ICARUS feeds, whatever the pills were made from, it\'s down there. If you\'re going, go now, while they think you\'re still in the lake.');
    goal('dam_below', 'Fly the A.S.S. to the end of the power line: BELOW NEVADA.');
    F.damDone = 1; return;
  }
  if (!e.met) {
    await T('DAMM', 'Don\'t shoot! Don\'t— you\'re not Malljestic. You\'re short. They\'re all tall. Are you the one the Ghost sent?');
    await T('CARL', 'He said you were building a press. For the pills. Without Pretend Co.');
    await T('DAMM', 'I was. I am. I\'ve got the machine. I don\'t have the pattern. The pattern\'s under the lake, in the old press, under St. Thomas. And they\'ve got my daughter, Maya, down in the turbine gallery, so I can\'t go look for it.');
  }
  const c = await C([{ t: 'I\'ll get Maya.', if: () => !F.mayaSafe }, { t: 'How do I get to St. Thomas?', if: () => !F.stAsk }, { t: 'Maya\'s safe.', if: () => F.mayaSafe && !F.mayaThanked }, 'I\'m on it.']);
  if (c === 0) { goal('dam_maya', 'Free Maya Damm from the turbine gallery inside the dam.', 1); await T('DAMM', 'Thank you. The gallery\'s through the power plant entrance, west end of the crest.'); }
  else if (c === 1) { F.stAsk = 1; await T('DAMM', 'There\'s a maintenance caisson at the bottom of the dam, lake side. It goes down to the old lakebed. Water\'s low enough now that half the town\'s sticking out. The other half, you swim.'); await T('DAMM', 'Take a rebreather if you can find one. There\'s one in my locker. The locker\'s in the visitor center. The visitor center is full of Malljestic. Story of my week.'); goal('dam_cure', 'Find the Prop Press under St. Thomas and recover the master pattern.'); }
  else if (c === 2) { F.mayaThanked = 1; await T('DAMM', '...Thank you. I don\'t know what you are, son. I know what you did.'); await T('CARL', 'I\'m human. Probably. It\'s complicated right now.'); await T('DAMM', 'Not to me it isn\'t.'); giveItem('upg'); }
};
CONV.maya = async (e) => {
  await T('MAYA', 'Who— are you with them? You don\'t look like them.');
  await T('CARL', 'I\'m with your dad. Kind of. I\'m with a lot of people this week.');
  await T('MAYA', 'They kept asking him to sign something. A "power contract." He kept saying no. They kept saying "your daughter." He kept saying no slower.');
  await T('MAYA', 'Thank you. I\'ll find my own way up. I know this dam better than they do. I grew up in it.');
  F.mayaSafe = 1; goalDone('dam_maya', 400); e.ai = 'civ'; e.state = 'flee'; e.threat = P; setTimeout(() => { const m = find('maya'); if (m) removeEnt(P.map, m); }, 4000);
};
CONV.white_press = async (e) => {
  await T('WHITE', 'Agent Denton. You read the process sheet.');
  await T('CARL', 'You were selling them their own minds.');
  await T('WHITE', 'We were selling them a product. The ingredients were theirs; the packaging was ours. That is what a business is.');
  await T('WHITE', 'You know what else is in the pool, little man? You. Your first year, in the facility. Before you were "Carl." You buffered beautifully. You powered the lights in this room for a decade.');
  await T('CARL', '...That\'s not— you\'re lying. You\'re making that up to—');
  await T('WHITE', 'Am I? You were never here. You were never anywhere. You were in transit.');
  chatSay('dont listen to him', 1); chatSay('carl dont', 1); chatSay('he is lying (probably)', 1);
  const c = await C(['I don\'t care what I was. I care what I\'m doing.', '[DENIAL] I\'m from Nevada. I\'m a normal human from Nevada.', '...']);
  if (c === 1) { await T('WHITE', 'You are, in fact, from Nevada. That is the one true thing you have ever said. Above and below.'); }
  if (c === 0) { await T('WHITE', 'Very well. Then do.'); }
  e.ai = 'guard'; e.team = 'miws'; e.hostile = 1; e.state = 'combat'; e.target = P; e.invuln = 0;
};

function startDam() { G.hub = 'dam'; G.hubIdx = 9; goalDone('lv_dam'); gotoMap('dam_top', 'land'); post.fade = 0; setTimeout(autoSave, 50); setTimeout(() => { infolink('YOKO', 'Hoover Dam. Malljestic took it last week. Dr. Damm and his engineers are barricaded in the control building, center of the crest.'); goal('dam_damm', 'Find Dr. Damm in the dam\'s control building.'); }, 400); }

// ---------- MAP: the dam crest ----------
{
  const g = mk(96, 40, '"');
  g.fill(0, 16, 96, 8, ':'); g.fill(0, 15, 96, 1, '='); g.fill(0, 24, 96, 1, '=');              // the crest road and its railings
  g.fill(0, 25, 96, 15, ' ');                                                                     // the drop (void)
  g.fill(84, 10, 12, 30, ','); g.fill(84, 25, 12, 15, '.'); g.fill(0, 10, 8, 30, ','); g.fill(0, 25, 8, 15, '.');
  g.fill(84, 15, 1, 10, '.'); g.fill(7, 15, 1, 10, '.');
  for (const x of [20, 38, 56, 70]) { g.rect(x, 4, 6, 6, '%', '.'); g.fill(x + 2, 10, 2, 6, ';'); g.put(x + 2, 9, '+'); }   // intake towers out in the lake, walkways
  g.rect(40, 18, 14, 5, '%', '.'); g.put(46, 18, 'j'); g.stamp(41, 19, `
D..c..D....
.h...d.....
..........P`);
  g.rect(86, 28, 9, 9, '%', ','); g.put(90, 28, '+'); g.stamp(87, 29, `
V....V.
.......
....N..
k......
...u...
P......
.......`);
  g.put(4, 20, 'p'); g.fill(2, 26, 4, 3, '.'); g.put(3, 27, 'w');
  for (const [x, y] of [[12, 17], [30, 17], [48, 17], [66, 17], [80, 17], [12, 22], [30, 22], [66, 22], [80, 22]]) g.put(x, y, 'L');
  g.put(88, 20, 'a'); g.put(24, 7, 'z'); g.put(58, 6, 'E'); g.put(60, 20, 'q'); g.put(26, 21, 'q'); g.put(16, 19, '1'); g.put(78, 19, '2');
  g.put(73, 7, 'r');
  defMap('dam_top', { name: 'HOOVER DAM', title: 'HOOVER DAM', sub: 'THE CREST - 03:00', hub: 'dam', music: 'dam', f: ['dam', 'sand', 'concrete', 'metal', 'concrete'].map(x => x === 'dam' ? 'concrete' : x), w: ['dam', 'brick', 'concrete'], amb: .18, shadow: '#040810', mem: '#0a1430', out: 1,
    grid: g.str(),
    key: {
      a: pr('ass', { label: 'THE A.S.S.', frob: async () => { if (F.damDone) await flyToBelow(); else msg('The pattern first. Then Dr. Damm. Then the line.'); } }),
      j: door({ id: 'control', name: 'CONTROL BUILDING', team: 'friend' }), c: comp([['damm', 'turbine', { mail: ['dam_m1'] }]], { c: { hackStr: .5 } }), d: npc('civ', { id: 'damm', name: 'DR. DAMM', sprite: 'drdamm', port: 'DAMM', conv: 'damm', ai: 'static', team: 'friend', dir: 1 }),
      k: Object.assign(seccomp([['ranger', 'boulder', { special: [['ROBO RANGERS: RESTORE FATCO OVERRIDE (ATTACK MALLJESTIC)', () => { F.rangers = 1; for (const e of P.map.ents) if (e.k === 'npc' && e.ranger) { e.team = 'friend'; e.scrambled = 0; e.ai = 'guard'; e.state = 'idle'; } rel('friend', 'mj', -1); rel('friend', 'miws', -1); giveSP(200, 'hacking'); return 'Rangers now hunt Malljestic.'; }, () => !F.rangers]] }]], { c: { hackStr: .6, team: 'mj' } }), { label: 'DAM SECURITY GRID' }),
      u: pr('locker', { label: 'DR. DAMM\'S LOCKER', items: [['rebreather', 1], ['medkit', 1]] }),
      p: exitTo('dam_inside', 'top', { frobbable: 0 }), w: item('a_10mm', 1),
      z: warpPart(7), E: reader('dam_plaque', { p: 'sign', label: 'BRONZE PLAQUE' }), q: npc('secbot', { team: 'mj', ranger: 1, route: 'r1', name: 'ROBO RANGER' }), r: reader('dam_whitecube', { p: 'cone', label: 'DATACUBE' }),
    },
    routes: { r1: '1,2' },
    ents: [spawnPt('land', Math.PI, { x: 91, y: 22 }), spawnPt('top_out', 0, { x: 6, y: 20 }),
      npc('mj', { x: 36, y: 18, dir: 0, look: .8 }), npc('mj', { x: 58, y: 22, dir: 2, look: .8 }), npc('mj', { x: 74, y: 19, route: 'r1' }), npc('milbot', { x: 22, y: 20, team: 'mj', dir: 0 }), npc('mj', { x: 88, y: 33, dir: 3, look: .7 }), npc('miws', { x: 91, y: 31, dir: 2, team: 'miws' }),
      npc('civ', { x: 44, y: 21, ai: 'static', sprite: 'drdamm', name: 'ENGINEER', team: 'friend', dir: 1, talk: ['The turbines are fine. It\'s the customer that\'s the problem.', 'Every watt this dam makes goes north into the ground. Every watt.'] }),
      light(6, .5, { x: 47, y: 20 }), light(5, .5, { x: 90, y: 32 })],
    enter(M, first) { rel('player', 'friend', 1); if (first) setTimeout(() => goalDone('dam_damm', 0), 0); },
  });
}
// ---------- MAP: inside the dam (turbine gallery) ----------
{
  const g = mk(64, 30, '#');
  g.fill(1, 1, 62, 4, ':'); g.fill(1, 6, 62, 20, '.'); g.fill(1, 5, 62, 1, '#'); g.put(4, 5, '.'); g.put(58, 5, '.');
  g.stamp(1, 6, `
.............................................................
..T.T......T.T......T.T......T.T......T.T......T.T...........
.............................................................
.............................................................
.........p.................p...................p.............
.............................................................
..==================================================.........
.............................................................
..........K.K..........m..........M.....................y....
.............................................................
..==================================================.........
.............................................................
..R.R.R..........w..........R.R.R..........w.........N.N.....
.............................................................
.......................................................b.....
.............................................................
............................................................v
.............................................................
.............................................................
.............................................................`);
  g.stamp(1, 1, `
s......................................................L.....
.............................................................
..........................c..................................
.............................................................`);
  defMap('dam_inside', { name: 'TURBINE GALLERY', title: 'HOOVER DAM', sub: 'INSIDE: THE TURBINE GALLERY', hub: 'dam', music: 'dam', f: ['metal', 'concrete'], w: ['dam', 'metal'], amb: .26, shadow: '#04060a',
    grid: g.str(),
    key: { s: exitTo('dam_top', 'top_out', { frobbable: 1, label: 'STAIRS (CREST)', verb: 'CLIMB' }), T: pr('turbine'), p: npc('mj', { dir: 1, look: .8 }), m: npc('miws', { team: 'miws', dir: 0, look: .7 }), M: pr('mcrate', { items: [['w_law', 1]] }),
      y: npc('civ', { id: 'maya', name: 'MAYA DAMM', sprite: 'civ4', port: 'civ4', conv: 'maya', ai: 'static', team: 'friend', dir: 2 }), w: npc('mj', { route: 'r1' }), b: reader('dam_bigl7', { p: 'trash', label: 'A PAPERBACK' }),
      c: reader('dam_whitecube', { p: 'cone', label: 'DATACUBE' }), v: exitTo('st_thomas', 'caisson', { frobbable: 1, label: 'MAINTENANCE CAISSON (LAKEBED)', verb: 'DESCEND' }) },
    routes: { r1: '1,2' },
    ents: [spawnPt('top', Math.PI / 2, { x: 3, y: 2 }), spawnPt('caisson_up', Math.PI, { x: 60, y: 22 }), item('medkit', 1, { x: 40.5, y: 3.5 }), item('a_rocket', 1, { x: 20.5, y: 24.5 }),
      light(7, .5, { x: 14, y: 12 }), light(7, .5, { x: 40, y: 12 }), light(6, .5, { x: 30, y: 20 })],
    enter(M) { M.wps['1'] = [8.5, 18.5]; M.wps['2'] = [52.5, 18.5]; },
  });
}
// ---------- MAP: St. Thomas (the drowned town) ----------
{
  const g = mk(80, 50, '"');
  g.fill(70, 40, 10, 10, '`'); g.fill(66, 44, 4, 6, '~');                                      // the caisson platform (dry)
  for (const [x, y, w, h] of [[8, 6, 10, 8], [24, 4, 12, 9], [44, 6, 9, 8], [8, 24, 11, 9], [30, 22, 14, 12], [52, 24, 10, 10], [14, 38, 12, 8], [40, 38, 10, 8]]) { g.rect(x, y, w, h, '%', '~'); g.put(x + (w >> 1), y + h - 1, '.'); }
  g.fill(34, 26, 6, 4, '`'); g.put(37, 29, 'x');                                                  // the schoolhouse floor: dry, and the hatch to the press
  g.fill(12, 8, 3, 3, '`'); g.fill(28, 6, 4, 3, '`'); g.fill(46, 8, 3, 3, '`'); g.fill(11, 27, 3, 3, '`'); g.fill(55, 27, 3, 3, '`'); g.fill(18, 40, 3, 3, '`'); g.fill(43, 40, 3, 3, '`');  // air pockets
  g.fill(60, 14, 5, 3, '`'); g.fill(64, 30, 4, 3, '`'); g.fill(28, 16, 3, 2, '`');
  g.put(29, 7, 'E'); g.put(13, 9, 'k'); g.put(47, 9, 'r'); g.put(56, 28, 'r'); g.put(19, 41, 'm'); g.put(34, 26, 'p'); g.fill(46, 29, 3, 2, '`'); g.put(60, 15, 'q'); g.put(44, 41, 'u');
  g.put(74, 44, 's');
  for (const [x, y] of [[20, 18], [40, 14], [58, 20], [24, 32], [48, 34], [66, 26]]) g.put(x, y, 'f');
  defMap('st_thomas', { name: 'ST. THOMAS', title: 'ST. THOMAS, NEVADA', sub: 'POP. 0  -  UNDER LAKE MEAD', hub: 'dam', music: 'below', f: ['mud', 'mud', 'concrete', 'concrete', 'mud'], w: ['rock', 'wood'], amb: .17, shadow: '#000a14', mem: '#04142a', water: 'water', deep: 'deep',
    grid: g.str(),
    key: { x: exitTo('prop_press', 'hatch', { frobbable: 1, label: 'HATCH UNDER THE SCHOOLHOUSE', verb: 'DESCEND' }), s: exitTo('dam_inside', 'caisson_up', { frobbable: 1, label: 'CAISSON (UP)', verb: 'ASCEND' }),
      E: reader('st_sign', { p: 'sign', label: 'WEATHERED SIGN' }), k: pr('crate', { items: [['medkit', 1], ['rebreather', 1]] }), r: item('biocell', 1), m: item('a_762', 1), p: pr('desk', { label: 'SCHOOL DESK', items: [['upg', 1]] }), q: pr('crate', { items: [['lam', 1], ['a_lam', 1]] }), u: item('medkit', 1),
      f: npc('spider', { team: 'mj', swims: 1 }) },
    ents: [spawnPt('caisson', Math.PI, { x: 73, y: 45 }), spawnPt('hatch_up', Math.PI / 2, { x: 37, y: 27 }), light(4, .7, { x: 74, y: 44 }), light(3, .6, { x: 37, y: 27 })],
    first() { infolink('YOKO', 'That\'s a lot of water, Carl. Watch your air. The dry patches are attics and steeples; you can breathe there. The schoolhouse is the big one in the middle.'); },
  });
}
// ---------- MAP: the Prop Press ----------
{
  const g = mk(54, 36, '$');
  g.fill(1, 1, 52, 34, ';'); g.fill(1, 12, 52, 1, '$'); g.put(26, 12, '+'); g.fill(1, 24, 52, 1, '$'); g.put(10, 24, '+'); g.put(42, 24, '+'); g.fill(26, 24, 1, 11, '$');
  g.stamp(1, 1, `
.........................h..........................
..t.t.t.t.t.t....................t.t.t.t.t.t........
...................................................
..........m..........................m..............
...................................................
......R.R.R.............w.............R.R.R........
...................................................
.....c..........................................d..
...................................................
.........................x.........................
...................................................`);
  g.stamp(1, 13, `
...................................................
...T.T.......T.T.......T.T.......T.T.......T.T.....
...................................................
...................................................
.........b.....................b...................
...................................................
.................K.K.K.......M.M.M.................
...................................................
...................................................
.......b...........................b...............
...................................................`);
  g.stamp(1, 25, `
.........................$.........................
..Z.Z.Z..........N.......$..........i..............
.........................$.........................
.....q...................$..........k..............
.........................$.........................
..H.h....................$.....R.R.R.R.............
.........................$.........................
.........................$..................e......
.........................$.........................`);
  defMap('prop_press', { name: 'THE PROP PRESS', title: 'THE PROP PRESS', sub: 'PRETEND CO. - UNDER ST. THOMAS', hub: 'dam', music: 'detention', f: ['metal', 'lab'], w: ['lab', 'metal'], amb: .32, shadow: '#080a10',
    grid: g.str(),
    key: { h: exitTo('st_thomas', 'hatch_up', { frobbable: 1, label: 'LADDER (UP TO THE SCHOOLHOUSE)', verb: 'CLIMB' }), t: pr('tank', { label: 'POTENTIAL CONDENSER' }), m: npc('mjelite', { dir: 1, look: .7 }), R: pr('rack'), w: npc('miws', { team: 'miws', route: 'r1' }),
      c: reader('st_press', { p: 'computer', label: 'PROCESS SHEET TERMINAL' }), d: comp([['white', 'never', { mail: ['dam_m2'] }]], { c: { hackStr: .8 } }),
      x: npc('civ', { id: 'white', name: 'MR. WHITE', sprite: 'mrwhite', port: 'WHITE', conv: 'white_press', ai: 'static', team: 'miws', dir: 1, hp: 520, hpMax: 520, armor: .35, wpn: 'npcpistol', wpn2: 'npcplasma', invuln: 1, explode: 1, onDie: () => { F.whiteDead = 1; } }),
      T: pr('generator', { label: 'PRESS DRUM' }), b: npc('bioroid', { team: 'mj', ai: 'guard', dir: 1 }), K: pr('crate', { label: 'CASE OF PROP PILLS', items: [['pills', 4]] }), M: pr('mcrate', { items: [['a_plasma', 1], ['biocell', 1]] }),
      q: npc('medbot', { ai: 'static' }), i: item('cure', 1, { onTake: () => { F.hasCure = 1; goal('dam_cure2', 'Bring the master pattern to Dr. Damm at the dam\'s control building.'); chatSay('THE PATTERN', 1); } }), k: pr('locker', { items: [['upg', 1], ['w_plasma', 1]] }), e: pr('locker', { items: [['aug', 1]], onSearch: () => { const it = P.inv.filter(i => i.id === 'aug' && !i.slot).pop(); if (it) { it.slot = 'skin'; it.pair = AUG_PAIRS.skin; } } }) },
    routes: { r1: '1,2' },
    ents: [spawnPt('hatch', Math.PI / 2, { x: 26, y: 2 }), trig(() => startConv('white_press', find('white')), { x: 12, y: 6, w: 28, h: 5, when: () => !F.whiteTalk && find('white') }),
      light(7, .6, { x: 14, y: 6 }), light(7, .6, { x: 40, y: 6 }), light(7, .5, { x: 26, y: 18 }), light(5, .5, { x: 12, y: 29 }), light(5, .5, { x: 40, y: 29 })],
    enter(M) { M.wps['1'] = [6.5, 7.5]; M.wps['2'] = [46.5, 7.5]; },
  });
}
{ const prev = CONV.white_press; CONV.white_press = async e => { F.whiteTalk = 1; await prev(e); }; }
async function flyToBelow() {
  await startConv(async () => {
    await T('N', 'The A.S.S. follows the power line north. The lights of the dam fall away. Then the lights of everything fall away. The desert is very dark and very big.');
    await T('CARL', 'Chat. I know where this is. I mean, I don\'t. I mean the ship does. The ship\'s flying itself. Chat, I\'m not touching anything.');
    await T('YOKO', 'Carl. I\'m here. I\'ll be here the whole time. Whatever happens down there, you\'re not doing it alone. That isn\'t an order either.');
  }, null);
  G.hub = 'below'; G.hubIdx = 10; await diskSwap(5, 'DISK 5: BELOW');
  if (typeof startBelow === 'function') startBelow(); else msg('TO BE CONTINUED');
}
