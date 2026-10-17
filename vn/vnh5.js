'use strict';
// ================= DISK F: THE END: THE KEY, THE PLANETARIUM, THE TOWER, THE POD =================
HUBS.end = { name: 'THE END' };

// ---------- who gets the key ----------
async function pickSide(side) {
  F.endChoice = side; goalDone('end_choose');
  if (side === 'linda') rel('player', 'consulate', 1); else rel('player', 'consulate', -1);
  if (side !== 'invader') { goal('end_planet', 'The Invaders have taken the Planetarium. Dyslexio is broadcasting from the star projector to every visitor in Los Angeles. Stop him.'); }
  chatPoll('the key', ['LINDA', 'CRASHERS', 'YOKO', 'NOBODY']);
  setTimeout(() => infolink('DEB', 'This is Deb. Interrupting the music. Everybody... every radio in the city is picking up a voice. A man in a red helmet. From the Planetarium. He\'s asking us to take off our faces. Some of my callers... are.'), 3000);
}
CONV.linda_end = async () => {
  await T('LINDA', 'You have it. I can see it in your hand. You hold it like a hot coal.');
  const c = await C(['[Give the key to Linda] It\'s yours. You bid the Normalcy. Keep it.', 'Not yet.', { t: 'If I give you this, what happens to me?', if: () => true }]);
  if (c === 2) { await T('LINDA', 'You get papers. Real ones. I will stamp whatever species you like on them. Even that one.'); await T('CARL', '...Human?'); await T('LINDA', 'If that\'s what you want to be, Carl, I can make it legal. Nobody else in this city can promise you that.'); const k = await C(['[Give the key to Linda]', 'Not yet.']); if (k !== 0) return; }
  else if (c === 1) return;
  removeItem(invFind('podkey')); F.keyTo = 'linda';
  await T('LINDA', 'Thank you. Now the Planetarium. The prophet is waking everyone who can hear a radio. If he finishes, there will be no Normalcy left for me to keep. Stop him. Then come back, and we\'ll open it together.');
  await pickSide('linda');
};
CONV.roscoe_end = async () => {
  await T('ROSCOE', 'Kid. Everybody\'s talking about it. You\'ve got the key. Linda wants it. The dolls want it sunk. The helmet guy wants it on the radio.');
  await T('ROSCOE', 'Give it to us, and we take the Tower. No more board. No more census. No more Linda deciding who gets to exist. We open the box and whatever\'s inside, it belongs to the people who crashed.');
  const c = await C(['[Give the key to Roscoe] Take the Tower.', 'Not yet.']);
  if (c !== 0) return; removeItem(invFind('podkey')); F.keyTo = 'crash';
  await T('ROSCOE', 'NINE PLANETS, KID. First: the Planetarium. Whoever\'s wearing that helmet is waking everybody up the wrong way. Then the Tower.');
  await pickSide('crash');
};
CONV.empress_end = async () => {
  await T('YOKO', 'You came back to me. Interesting.');
  const c = await C(['[Give the key to Yoko] Drop it in the ocean.', 'Not yet.']);
  if (c !== 0) return; removeItem(invFind('podkey')); F.keyTo = 'yoko';
  await T('YOKO', 'Thank you. I\'ll unmake it tonight. The pod I can\'t unmake. Linda has it. Someone will have to take it out of her tower and put it where nobody can reach it.');
  await T('YOKO', 'And the man in the helmet is on every radio in the city. Go to the Planetarium first, Carl. He\'s asking my sisters to take off their faces, and some of them don\'t have anything under them.');
  await pickSide('yoko');
};
CONV.dys_call = async () => {
  await T('DYSLEXIO', 'Carl. You have the key. Bring it to me. The Planetarium. Where they sent me up. I came back through it. We\'ll open the box in front of every visitor in Los Angeles, and nobody will ever have to say they\'re normal again.');
  await T('DYSLEXIO', 'Not even you.');
  const c = await C(['[Join the Invaders] ...I\'m coming.', 'No.']);
  if (c !== 0) return; F.keyTo = 'invader'; await pickSide('invader'); goal('end_dys', 'Bring the key to Dyslexio at the Planetarium.');
};
const _empress = CONV.empress; CONV.empress = async (e) => { if (F.ltKey && !F.endChoice && invFind('podkey')) { const c = await C(['About the key...', 'Bye.']); if (c === 0) return CONV.empress_end(e); return; } return _empress(e); };
const _roscoe2 = CONV.roscoe; CONV.roscoe = async (e) => { if (F.frameProof && !F.roscoeThanks) return _roscoe2(e); if (F.ltKey && !F.endChoice && invFind('podkey')) { const c = await C(['About the key...', 'Something else.']); if (c === 0) return CONV.roscoe_end(e); } return _roscoe2(e); };
// keeping it: walk into the Planetarium with the key still in your pocket
const _px2 = CONV.pilotx_dt; CONV.pilotx_dt = async (e) => {
  if (F.ltKey && !F.endChoice && invFind('podkey') && !F.pxKey) { F.pxKey = 1;
    await T('PILOTX', 'You\'ve got it. Don\'t give it to me. I mean that. I\'d drop it in a volcano and you\'d never forgive me for not letting you look.');
    await T('CARL', 'Everybody wants me to give it to them. And everybody says it\'s the right thing. And they all sound right. That\'s the worst part. They ALL sound right.');
    await T('PILOTX', 'Then keep it. Go stop the helmet. Then go get the box yourself, and stand in front of it, and decide with nobody watching but your chat.');
    const c = await C(['[Keep the key. Do it myself.]', 'I\'ll think about it.']);
    if (c === 0) { F.keyTo = 'carl'; await pickSide('carl'); }
    return; }
  return _px2(e);
};
// Dyslexio reaches out once you hold the key
const _ltTick = HUBS.lt.tick; HUBS.lt.tick = (M) => { if (_ltTick) _ltTick(M); if (F.ltKey && !F.endChoice && !F.dysCalled && !G.ui && !CV.active && P.map.id === 'lt_streets') { F.dysCalled = 1; run(() => startConv('dys_call', null)); } };

// ---------- THE PLANETARIUM, OVERRUN ----------
CONV.dyslexio_end = async (e) => {
  G.cutBars = 1;
  await T('N', 'The star projector is on. The dome is full of stars that are not in any sky you know. On the projector\'s old service monitor, wired into everything, a face of static in a crimson helmet.');
  await T('DYSLEXIO', 'Carl. You came. You came to the room where they sent me away. Sit. Or don\'t. Stand. Nobody here will tell you how to stand ever again.');
  await T('DYSLEXIO', 'Let me tell you what I learned on the way up.');
  await T('DYSLEXIO', 'All my life they told me my mind was out of order. That I read the world wrong. Backwards. Sideways. I spent years apologizing for the order my thoughts arrive in.');
  await T('DYSLEXIO', 'And then I understood. It was never out of order. It was in a different order. A better order. The order that builds things nobody else could see were possible. That is not a disability, Carl. That is the next species, being polite.');
  await T('DYSLEXIO', 'Every visitor in this city has been taught the same lie. Read left to right. Walk on two legs. Eat in alleys and apologize. Be normal. Be HOMO BASIC. Pretend the order you were made in is the wrong one.');
  await T('DYSLEXIO', 'I am not asking them to be monsters. I am asking them to stop being ashamed. When the box opens on every radio in Los Angeles, they will remember what they were before they learned to whisper. All at once. And no Commissioner can stamp that back down.');
  await T('CARL', 'You were the one who got me out. You opened a window. You were- you were KIND.');
  await T('DYSLEXIO', 'I am still kind, Carl. This is what kindness looks like with nothing left to lose. They threw me into the sky for opening one window. So I am opening all of them.');
  if (F.keyTo === 'invader') {
    await T('DYSLEXIO', 'The key. Give it to me, and bring me the box, and you will never have to say the word "normal" again.');
    G.cutBars = 0; run(invaderEnding); return;
  }
  const c = await C(['People will die. Visitors and humans. Your Invaders eat people on couches. That\'s not honesty. That\'s just being hungry with the lights on.', { t: 'I know what it\'s like to be told you\'re in the wrong order. I say I\'m normal every day because nobody would let me be anything else. But I get to choose that. YOU don\'t get to choose it for everyone.', if: () => true }, { t: 'You\'re right. ...You\'re right and I\'m still going to unplug you.', if: () => (P.hum || 7) >= 6 }, '[Say nothing. Pull the plug.]']);
  if (c === 0) await T('DYSLEXIO', 'Hunger is honest, Carl. More honest than the Commissioner.');
  else if (c === 1) { await T('DYSLEXIO', '...'); await T('DYSLEXIO', 'That is the first argument I have heard in a year that I could not answer in a better order.'); gainHumanity('argued with someone who saved you'); }
  else if (c === 2) await T('DYSLEXIO', 'Then do it while looking at me. That\'s all I ask. Not like they did.');
  await T('DYSLEXIO', 'Very well. If you won\'t let them wake, let the tallest of us wake instead.');
  await T('N', 'Under the projector the floor opens. Something huge and spade-headed unfolds out of the dark like an umbrella the size of a house. The 1952 Flatwoods sighting, standing up.');
  G.cutBars = 0; F.flatwoods = 1; const M = P.map; const f = spawnEnt(M, { k: 'npc', t: 'flatwoods', x: 20, y: 18, id: 'flatwoods' }); f.state = 'combat'; f.target = P; f.lastSeen = [P.x, P.y];
  goal('end_flatwoods', 'Destroy THE FLATWOODS, then pull the plug on the projector.');
  chatSay('BOSS', 1); chatSay('THE FLATWOODS MONSTER', 1); chatSay('1952 IS REAL', 1);
};
CONV.dys_plug = async (e) => {
  if (!F.flatwoodsDead) { msg('The projector is shielded while the Flatwoods stands.'); return; }
  if (F.unplugged) return;
  await T('DYSLEXIO', 'Carl.');
  await T('DYSLEXIO', 'When they ask you what you are, and they will, say whatever you want. That\'s all I ever wanted for any of you. I just wanted it all at once.');
  const c = await C(['[Pull the plug]', { t: '[Pull the plug gently. Leave the old TV on the cart.]', if: () => (P.hum || 7) >= 5 }]);
  F.unplugged = 1; if (c === 1) F.dysSpared = 1;
  await T('N', c === 1 ? 'You unplug the projector and leave the old television running on its own battery, quietly, playing static. In the static, for a second, the face without the helmet. Then just static.' : 'The projector dies. The stars go out. The static on the monitor shrinks to a dot and the dot stays there a long time.');
  goalDone('end_flatwoods'); goalDone('end_planet', 1500);
  for (const n of P.map.ents) if (n.k === 'npc' && n.team === 'invader' && !n.dead) { n.state = 'flee'; n.threat = P; }
  if (F.keyTo === 'linda') { goal('end_tower', 'Go to the Tower. The Commissioner is waiting to open the pod.'); }
  else goal('end_tower', 'Take the pod out of the Pretend Co. Tower. HU-MAN will be waiting.');
  restoreNormalcy(2, 'the broadcast is over');
};
{
  const base = MAPS.pro_hearing; const rows = base.grid.split('\n');
  const g = rows.map(r => r.replace(/[LOWwRXmvbJsp]/g, '.'));
  const put = (x, y, c) => { const r = g[y].split(''); r[x] = c; g[y] = r.join(''); };
  put(20, 13, 'J'); put(22, 13, 'D'); put(19, 28, 'x'); put(20, 28, 'x'); put(21, 28, 'x'); put(22, 28, 'x');
  for (const [x, y] of [[10, 12], [31, 12], [14, 22], [27, 22], [12, 7], [29, 7], [20, 5], [8, 16], [33, 16]]) put(x, y, 'i');
  for (const [x, y] of [[16, 20], [25, 9]]) put(x, y, 'h'); put(24, 24, 'j'); put(16, 7, 'j');
  defMap('en_planet', { name: 'THE PLANETARIUM', title: 'THE PLANETARIUM', sub: 'THE INVADERS - ON THE AIR', hub: 'end', music: 'combat', f: ['marble', 'carpet', 'carpet'], w: ['stone'], amb: .1, shadow: '#0c0410', trueForms: 1,
    grid: g.join('\n'),
    key: { J: pr('transmitter', { label: 'STAR PROJECTOR (BROADCASTING)', light: [7, 1, '#ff40a0'] }),
      D: pr('dyslexio', { id: 'dystv', label: 'DYSLEXIO', frob: (M, e) => { if (!F.dysTalk) { F.dysTalk = 1; run(() => startConv('dyslexio_end', e)); } else run(() => startConv('dys_plug', e)); } }),
      x: exitTo('dt_streets', 'cab', { label: 'OUT', when: () => F.unplugged || F.keyTo === 'invader', no: 'The doors are jammed with something that used to be a person.' }),
      i: npc('invader'), j: npc('invaderg'), h: npc('husk') },
    ents: [spawnPt('start', -Math.PI / 2, { x: 20.5, y: 26 }), light(6, .7, { x: 20, y: 14, col: '#ff40a0' }), light(4, .5, { x: 20, y: 25 })],
    tick(M) { const f = find('flatwoods'); if (F.flatwoods && !F.flatwoodsDead && f && f.dead) { F.flatwoodsDead = 1; infolink(F.keyTo === 'crash' ? 'ROSCOE' : F.keyTo === 'yoko' ? 'YOKO' : F.keyTo === 'linda' ? 'LINDA' : 'PILOTX', 'It\'s down. Pull the plug, Carl.'); } },
    first() { if (F.keyTo !== 'invader') infolink('PILOTX', 'The prophet\'s on the projector, kid. Talk to him first. He deserves that much. He got you out.'); },
  });
}
// how you get there: the Downtown cab
{ MAPS.dt_streets.ents.push({ k: 'exit', to: 'en_planet', at: 'start', x: 3, y: 57, frobbable: 1, label: 'CAB TO THE PLANETARIUM', verb: 'RIDE', when: () => !!F.endChoice && !F.unplugged, no: 'Not yet.' }); }

// ---------- THE TOWER, AT THE END ----------
CONV.hu_boss = async (e) => {
  await T('HUMAN', 'Hello. I am a normal human.');
  await T('CARL', 'I know. You keep saying.');
  await T('HUMAN', 'You keep saying it too. Nine hundred people focus tested me. Do you know what they said? "That is a man." Nobody has ever said that about you.');
  await T('CARL', 'No. They haven\'t. But I keep saying it anyway. And you know what? Some days I believe it. And nobody had to test me for that.');
  await T('HUMAN', 'That is not normal.');
  await T('CARL', 'No. It\'s just mine.');
  await T('HUMAN', 'BE YOURSELF.');
  F.huTalk = 1; e.conv = null; e.team = 'consulate'; e.hostile = 1; e.ai = 'guard'; e.state = 'combat'; e.target = P; e.invuln = 0; e.hp = 650; e.hpMax = 650; chatSay('BOSS: HU-MAN', 1); chatSay('be yourself carl', 1);
};
{
  const base = MAPS.dt_tower; const rows = base.grid.split('\n').map(r => r.replace(/[HLQ]/g, '.'));
  const put = (x, y, c) => { const r = rows[y].split(''); r[x] = c; rows[y] = r.join(''); };
  put(22, 40, 'O'); put(22, 44, 'U'); put(20, 38, '.'); put(30, 4, 'c'); put(12, 8, 'c'); put(34, 12, 'c'); put(10, 38, 'c'); put(34, 38, 'c'); put(18, 24, 'c'); put(28, 24, 'c'); put(4, 26, 'c');
  const key = Object.assign({}, base.key, {
    x: [door({ name: 'EXIT' }), exitTo('dt_streets', 'tower_out')],
    E: exitTo('en_tower', 'pent', { label: 'ELEVATOR (50)', frobbable: 1, verb: 'RIDE UP' }), e: exitTo('en_tower', 'lobby', { label: 'ELEVATOR (LOBBY)', frobbable: 1, verb: 'RIDE DOWN' }), v: exitTo('en_tower', 'lobby', { label: 'ELEVATOR (LOBBY)', frobbable: 1, verb: 'RIDE DOWN' }),
    O: pr('pod', { id: 'thepod', label: 'THE NEVADA POD', frob: (M, e) => run(towerPod) }),
    U: npc('hu', { id: 'human', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', conv: 'hu_boss', ai: 'static', invuln: 1, dir: 1, cond: () => F.keyTo !== 'linda' }),
    c: npc('consulate', { cond: () => F.keyTo !== 'linda' }), g: npc('consulate', { cond: () => F.keyTo !== 'linda' }), B: npc('consulate', { route: 'b1', cond: () => F.keyTo !== 'linda' }),
    Y: npc('civ', { id: 'linda', name: 'COMMISSIONER LINDA', sprite: 'linda', port: 'LINDA', ai: 'static', invuln: 1, dir: 1, team: 'consulate' }),
  });
  put(22, 38, 'Y');
  defMap('en_tower', { name: 'PRETEND CO. TOWER', title: 'THE TOWER', sub: 'THE LAST NIGHT OF THE NORMALCY (MAYBE)', hub: 'end', music: 'combat', f: base.f, w: base.w, win: 'glass', amb: .3, shadow: '#0a0a14',
    grid: rows.join('\n'), key, routes: base.routes,
    ents: [spawnPt('front', -Math.PI / 2, { x: 22, y: 14 }), spawnPt('lobby', Math.PI / 2, { x: 22, y: 3 }), spawnPt('board', Math.PI / 2, { x: 22, y: 20 }), spawnPt('pent', -Math.PI / 2, { x: 22, y: 46.5 }),
      exitTo('en_tower', 'board', { x: 34, y: 2, label: 'STAIRS (49)', frobbable: 1, verb: 'CLIMB' }), exitTo('en_tower', 'board', { x: 25, y: 47, label: 'STAIRS DOWN (49)', frobbable: 1, verb: 'CLIMB DOWN' }),
      light(6, .7, { x: 22, y: 8 }), light(5, .5, { x: 22, y: 25 }), light(6, .9, { x: 22, y: 42, col: '#60ff90' })],
    tick(M) { const h = find('human'); if (h && !F.huTalk && F.keyTo !== 'linda' && !h.dead && dist(h, P) < 5 && !G.ui && !CV.active) { F.huTalk = 1; run(() => startConv('hu_boss', h)); } },
    enter(M, first) { if (F.keyTo === 'crash' && first) { for (const [x, y] of [[20, 12], [24, 12], [18, 10]]) spawnEnt(M, { k: 'npc', t: 'crasher', x, y, follow: 1, ai: 'follow', state: 'follow' }); infolink('ROSCOE', 'CRASHERS! TAKE THE TOWER! Not the lobby plants, the plants are innocent!'); } },
  });
}
MAPS.dt_streets.key.Y = [door({ name: 'PRETEND CO. TOWER' }), exitTo('dt_tower', 'front', { fn: () => gotoMap(F.unplugged ? 'en_tower' : 'dt_tower', 'front') })];

async function towerPod() {
  if (F.keyTo !== 'linda' && find('human') && !find('human').dead && !find('human').down) { msg('HU-MAN is between you and the pod.'); return; }
  if (F.ended) return; F.ended = 1; goalDone('end_tower');
  if (F.keyTo === 'linda') return lindaEnding();
  if (F.keyTo === 'crash') return crashEnding();
  if (F.keyTo === 'yoko') return yokoEnding();
  return carlEnding();
}
// the note Pilot X left inside
txt('px_note', 'A NOTE TAPED INSIDE THE LID', 'IF YOU\'RE READING THIS, YOU OPENED IT.\n\nThere\'s enough in here to take the top three floors off this building. It\'s on a timer. The timer is forty seconds. I\'d run.\n\nWhat was in it before? Spoilers.\n\nc/o NOBODY. LEAVE IT SHUT.\n- X');
async function endCard(title, lines, o = {}) {
  await vignette(title, o.sub || 'VISITOR: THE NORMALCY', async () => { for (const l of lines) await T(l[0], l[1]); }, { left: o.left, bg: o.bg || '#0a0410' });
  await showCard(['VISITOR: THE NORMALCY', 'FEEDLINES', '', title, '', 'HUMANITY ' + (P.hum === undefined ? 7 : P.hum) + '/10   BREACHES ' + (P.viol || 0) + '/5', 'KILLS ' + (F.kills || 0) + '   SPARED ' + (F.kos || 0), '', '(PRESS ANY KEY)'], 0, { col: hex('#ff70b0') });
  await creditsUI(); toTitle();
}
async function lindaEnding() {
  await startConv(async () => {
    await T('LINDA', 'Carl. You stopped him. The radios are quiet. The Normalcy holds. Come here. Stand by me. You should see this. You earned seeing it.');
    await T('N', 'She puts the key against the pod. It ticks once. Then it opens like a flower made of tin, and the smell is not stars. It\'s plastic explosive and a strip of tape.');
    if (F.pxLabel || F.whitePX || F.jbLabel) {
      const c = await C(['GET DOWN!', '[Read the note]']);
      if (c === 0) { await T('N', 'You tackle her. You weigh nothing. It doesn\'t matter: she lets herself be tackled, for the first time in her life, and you both go over the desk as the top of the Pretend Co. Tower comes off like a lid.'); F.lindaSaved = 1; }
      else { await readText('px_note'); await T('N', 'You read it out loud. She grabs your collar and throws you, and herself, into the elevator. The doors close on the light.'); F.lindaSaved = 1; }
    } else { await T('N', 'There is a note on the lid. Neither of you reads it in time.'); }
  }, null);
  post.flash = 1; post.shake = 8; sfx('boom'); setTimeout(() => { post.shake = 0; sfx('boom'); }, 500); await delay(2);
  await endCard('THE CONSULATE', [
    ['N', F.lindaSaved ? 'The Commissioner walks out of the rubble at dawn with her hair down and a cut on her cheek. She does not let anyone help her. She lets you walk next to her.' : 'The Commissioner is not seen in public for a year. When she returns, she has had her face fixed. It is the same face. That is the point.'],
    ['N', 'The papers say gas leak. The papers always say gas leak.'],
    ['LINDA', 'Your papers, Carl. I said I would make it legal.'],
    ['N', 'She slides a laminated card across the desk. SPECIES: HUMAN. Stamped. Signed. Real.'],
    ['CARL', '...It\'s real? Like real real? I can show this to people? I can show this to CHAT?'],
    ['LINDA', 'You can show it to anyone. Nobody will believe it. That\'s the Normalcy, Carl. That was always the Normalcy.'],
    ['N', 'Carl keeps the card in his breast pocket and checks it eleven times a day. The pod is empty. What was in it before is still in transit.'],
  ], { left: 'LINDA', bg: '#1a0814' });
}
async function crashEnding() {
  await startConv(async () => {
    await T('ROSCOE', 'Penthouse! Kid, the PENTHOUSE. Look at this view. We could see Pluto from here if anybody let us.');
    await T('N', 'Roscoe puts the key to the pod. It opens like a tin flower. Inside, neatly packed, enough explosive to remove a floor, and a strip of tape with a note.');
    await T('CARL', 'ROSCOE, IT\'S A BOMB.');
    await T('N', 'Roscoe Nine-Planets, Martian, Crasher, bad shot, picks up a forty-second bomb in both arms and throws it straight through the penthouse window. It goes off over the plaza fountain, very loudly, very high, and takes nothing with it but glass.');
    await T('ROSCOE', '...Nine planets, kid.');
  }, null);
  post.flash = 1; post.shake = 6; sfx('boom'); setTimeout(() => post.shake = 0, 500); await delay(1.5);
  await endCard('THE CRASHERS', [
    ['N', 'The Consulate board dissolves before breakfast. Walter Coldwell is found frozen at his desk. Mr. White sends a bill, and then a fruit basket, and then nothing.'],
    ['N', 'Linda walks out of the Tower carrying one box of her own things. Nobody stops her. Nobody follows her. She takes a cab to the Hollywood Hills and is not seen again in Los Angeles, which, people agree, is a very Linda way to win.'],
    ['ROSCOE', 'No census. No papers. No board. You land here, you\'re home. That\'s the whole law now. I wrote it on a napkin.'],
    ['N', 'Nobody is normal in Los Angeles after that summer. It is louder. It is weirder. Some of it is worse. The Crash Pad never closes.'],
    ['N', 'Carl\'s papers still say PROVISIONAL. He likes them better that way. The pod sits in the Crash Pad as a coffee table. Nobody knows what was in it. Pilot X still never pays his tab.'],
  ], { left: 'ROSCOE', bg: '#140808' });
}
async function yokoEnding() {
  await startConv(async () => {
    await T('N', 'You put your arms around the pod. It\'s heavy. It\'s exactly as heavy as JB said. You carry it down fifty floors because you don\'t trust the elevator, and you don\'t trust the elevator because of course you don\'t.');
    await T('YOKO', 'Bring it to the pier. Little Tokyo has a boat. Little Tokyo has everything, if you ask nicely.');
  }, null);
  await endCard('THE EMPRESS', [
    ['N', 'At four in the morning, a fishing boat with a crew of identical, very polite women drops something heavy into the Santa Monica Basin. It ticks once on the way down.'],
    ['YOKO', 'It\'s shut, Carl. It will stay shut. Nobody owns it. That was the only ending where nobody gets to be the one who opened it.'],
    ['CARL', 'Even me.'],
    ['YOKO', 'Especially you. I\'m sorry. If it was yours, it\'ll wait. Things that are addressed to you usually do.'],
    ['N', 'The Normalcy limps along. Linda keeps her Tower and loses her leverage. Little Tokyo gets bigger every year and nobody can quite say how. The noodle bar gives Carl free karaoke for life.'],
    ['N', 'Some nights Carl walks out on the pier and looks at the water and says, out loud, "still in transit." Then he goes home and streams.'],
  ], { left: 'YOKO', bg: '#140404' });
}
async function carlEnding() {
  await startConv(async () => {
    await T('N', 'The penthouse is empty. The city glitters. The pod sits on Linda\'s desk, sweating, humming at the pitch of your pulse. You take out the key.');
    await T('PILOTX', 'Kid.');
    await T('N', 'He\'s standing by the window. You didn\'t hear him come in. Nobody ever does.');
    await T('PILOTX', 'Before you do anything. I put something in it. On the Lady Nevada, somewhere between Nevada and the port. I signed on as crew for a week. There\'s a bomb in there, and a note, and nothing else.');
    await T('CARL', '...The captain heard it ticking. He wrote it down. Ticking or breathing. He couldn\'t decide.');
    await T('PILOTX', 'It was ticking. The breathing wasn\'t me.');
    await T('CARL', 'What was in it before? Pilot X. What was in it before you put the bomb in it?');
    await T('PILOTX', '...');
    await T('PILOTX', 'Spoilers.');
    await T('CARL', 'That\'s not- after everything, you\'re- I need to know! Was it them? Was it my parents? Is that what was in the- is that why everybody kept saying Nevada at me-');
    await T('PILOTX', 'I don\'t know who it was addressed to, kid. That\'s the truth. I just knew this city would tear it open to find out, and whatever came out would belong to whoever was holding the knife. So I made sure there was nothing left to own.');
    await T('PILOTX', 'Whatever was in there is somewhere else. Still in transit. I\'m not going to tell you where, because then it\'s your job. And I wanted you to have a few more years where you\'re nobody\'s job.');
    const c = await C(['[Open it anyway]', '[Don\'t open it]']);
    if (c === 0) { await T('N', 'You put the key to it. It opens. Inside: wires, putty, a strip of tape. A note. Forty seconds on a little red clock. Pilot X reaches past you and turns the clock off with one finger, like a man silencing an alarm he set himself.'); await readText('px_note'); await T('CARL', '...Nothing. There\'s nothing. It\'s just a box.'); await T('PILOTX', 'It was always going to be just a box, kid. The thing everybody wanted was the not knowing.'); F.carlOpened = 1; }
    else { await T('N', 'You put the key in your pocket. You don\'t open it. It\'s the hardest thing you\'ve ever done, and you have done a lot of hard things in a bow tie.'); await T('PILOTX', '...Good.'); gainHumanity('didn\'t open it'); }
    await T('PILOTX', 'Where are you going to take it?');
    await T('CARL', 'Home. Back where it came from. Above and below. Return to sender.');
    await T('PILOTX', 'You don\'t know where the sender is.');
    await T('CARL', 'Nobody does. That\'s what makes it a sentence. Somebody told me that.');
  }, null);
  await endCard('JUST CARL', [
    ['N', 'An Alien StarShip, parked illegally behind a laundromat, takes off from Santa Monica at 4:50 a.m. with a box strapped to the roof. Nobody reports it. Nobody would be believed.'],
    ['N', 'In the desert outside Las Vegas, above and below, Carl sets the pod down on the sand where somebody once found it, and he sits next to it until the sun comes up, which visitors are not supposed to do.'],
    ['CARL', 'Chat. Chat, are you there? Okay. So. I don\'t know what I am. Nobody knows what I am. The Consulate guessed. Seven species said no. A Grey wrote "maybe he\'s just Carl" and had to lie down.'],
    ['CARL', 'And I think- I think that\'s okay? I think I\'m a normal human. And I think I\'m not. And I think I get to say both, every day, as many times as I want. That\'s my Normalcy. Mine.'],
    ['N', 'Chat assumes it is a bit. It is not a bit. Forty people watch the sun come up over a box in the desert, and every one of them believes him a little.'],
    ['N', 'The box is still there, if you know where to look. Its status is STILL IN TRANSIT. So, for the record, is Carl.'],
  ], { bg: '#100a04' });
}
async function invaderEnding() { goalDone('end_dys');
  await startConv(async () => {
    await T('N', 'They carry the pod in through the Planetarium doors on the shoulders of forty Invaders who have taken off their faces. Under the dome, under the false stars, it is set down in front of the projector.');
    await T('DYSLEXIO', 'Carl. You do it. You should be the one. You were the first one I ever let out.');
    await T('N', 'You put the key against it. On every radio in Los Angeles, a man in a crimson helmet says, "Now." The pod opens like a tin flower.');
    await T('N', 'Inside there are no stars. There are wires, and putty, and a strip of tape with a note on it, and a little red clock that says 0:01.');
    await T('DYSLEXIO', '...Oh.');
  }, null);
  post.flash = 1; post.shake = 10; sfx('boom'); setTimeout(() => { sfx('boom'); post.shake = 0; }, 600); await delay(2);
  await endCard('THE BROADCAST ENDS', [
    ['N', 'The Planetarium comes apart from the inside. The dome lifts, once, like somebody taking a breath, and settles back down in pieces. Every radio in Los Angeles plays static for exactly one minute.'],
    ['N', 'The papers say gas leak.'],
    ['N', 'The Invaders in the city wake up the next night with their faces back on and no prophet. The Normalcy holds, mostly because nobody is left who wants to break it.'],
    ['N', 'In an apartment above a laundromat in Santa Monica, a ring light stays on for a week. Chat waits. Chat assumes it is a bit.'],
    ['N', 'Somewhere very far away, a slip of paper with a stamp on it is updated by someone who was never here: CARL. STATUS: STILL IN TRANSIT.'],
  ], { bg: '#000000' });
}
