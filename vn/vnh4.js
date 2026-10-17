'use strict';
// ================= DISK E: LITTLE TOKYO =================
// Empress Yoko's pachinko tower. The Yokoids: software in bodies in faces, hiding from the visitors.
HUBS.lt = { name: 'LITTLE TOKYO' };
txt('lt_scene', 'CRIME SCENE', 'A Yokoid lies in the alley, a scorch mark the size of a dinner plate across her chest. The edges of the burn are bright green and glassy.\n\nOnly one weapon in Los Angeles leaves a burn like that: a 1953 ray gun. Roscoe has the only one. Everybody knows Roscoe has the only one.');
txt('lt_scene2', 'FOOTPRINTS', 'Footprints in the spilled noodle broth, leading away from the body toward the fish market. Too many toes. Not Martian. Martians have four. These have seven.', { note: 'The footprints at the Yokoid murder scene have seven toes. Not a Martian. They lead to the fish market.' });
txt('lt_market_note', 'NOTE IN A CRATE', 'Use the Martian\'s gun. Leave it by the body. Let the dolls and the Crashers eat each other. Let the lizard Commissioner pick a side. When everybody is fighting, nobody is guarding the box.\n- for the Prophet, who speaks from the screen', { note: 'Proof: the Invaders framed Roscoe with his own stolen ray gun, to start a war while nobody guards the pod.' });
txt('lt_board', 'SIGN', 'LITTLE TOKYO\nWELCOME\n(The Yokoids at the gate smile at you. All of them, at once.)');
DEB.push({ id: 'lt1', hub: 4, title: 'THE DOLLS', fn: async () => {
  await T('DEB', 'Deep Night. Little Tokyo tonight. Caller, you\'re on.');
  await T('N', '"Deb, I work at the fish market. There\'s girls who work the noodle bar on Second, and they\'re always the same girl. Same face, same hair, all of them. I asked one if they were sisters. She said \'in a sense.\' Then she smiled. All of them smiled."');
  await T('DEB', 'Were they nice to you?');
  await T('N', '"...Real nice, Deb. Nicest anybody\'s been to me in years."');
  await T('DEB', 'Then honey, I don\'t care what they are.');
} });

// ---------- Linda sends Carl ----------
CONV.linda_lt = async () => {
  await T('LINDA', 'Carl. Sit. Not there. ...Fine. There.');
  await T('LINDA', 'The pod is in the next room. It will not open. The Clinic says it\'s locked with something written. Mr. Nine-Planets\' people say it\'s welded. The Broadcast says it\'s tuned to a station nobody can find.');
  await T('LINDA', 'Your friend Face put his whole Clinic on it for a day. They came back with one word: "addressed." It opens for whoever it was sent to.');
  await T('CARL', 'Who was it sent to?');
  await T('LINDA', 'The manifest is blacked out. Every copy. Somebody was very thorough.');
  await T('LINDA', 'Only one mind in Los Angeles reads things it was never meant to read: Empress Yoko, in Little Tokyo. Her people are software. She could write a key that pretends to be the addressee.');
  await T('LINDA', 'She will not take my calls. And now there is a dead Yokoid in Little Tokyo with a ray-gun burn in her chest, and the only ray gun in Los Angeles belongs to Roscoe Nine-Planets.');
  await T('CARL', 'Roscoe wouldn\'t- he\'s loud, he\'s not- he wouldn\'t!');
  await T('LINDA', 'If the Empress goes to war with the Crashers, I will let her. It would be very tidy. Get me the key, Carl. Whatever the Empress wants for it, give it to her. Unless it\'s me.');
  goalDone('lt_tower'); goal('lt_key', 'Go to Little Tokyo. Get Empress Yoko to make a key for the pod. (Cab stand, west Downtown.)'); F.ltGo = 1;
};
const _lindaDt = CONV.linda_dt; CONV.linda_dt = async (e) => { if (F.hwDone && !F.ltGo) return CONV.linda_lt(e); if (F.ltKey && !F.endChoice) return CONV.linda_end(e); return _lindaDt(e); };
// the Downtown cab now goes to Little Tokyo too
MAPS.dt_streets.ents.push({ k: 'exit', to: 'lt_streets', at: 'cab', x: 3, y: 51, frobbable: 1, label: 'CAB TO LITTLE TOKYO', verb: 'RIDE', when: () => F.ltGo, no: 'Little Tokyo? Nobody\'s sending you to Little Tokyo.' });

// ---------- Roscoe in trouble ----------
CONV.roscoe_lt = async () => {
  await T('ROSCOE', 'Kid. They\'re saying I burned a Yokoid. In Little Tokyo. With MY gun.');
  await T('ROSCOE', 'My gun\'s been gone three days. Somebody lifted it from behind the bar. I\'ve been tearing the place apart. I didn\'t tell anybody because a Martian without his ray gun is just a little green guy in a leather jacket.');
  await T('CARL', 'That\'s, I mean, that\'s also what you are with the ray gun.');
  await T('ROSCOE', 'NOT HELPING, KID.');
  await T('ROSCOE', 'If the dolls come for us, we fight. If we fight, Linda wins. Find out who did it. Please. I don\'t say please. Martians don\'t have a word for it. I\'m borrowing yours.');
  F.roscoeAsked = 1; goal('lt_frame', 'Find out who really killed the Yokoid in Little Tokyo. Clear Roscoe.', 1);
};
const _roscoe = CONV.roscoe; CONV.roscoe = async (e) => { if (F.ltGo && !F.roscoeAsked) return CONV.roscoe_lt(e); if (F.frameProof && !F.roscoeThanks) { F.roscoeThanks = 1; await T('ROSCOE', 'You CLEARED me? Kid. Kid. Nine planets owe you. Pluto especially. Pluto owes you its LIFE.'); F.crasherTrust = (F.crasherTrust || 0) + 2; giveSP(500, 'cleared Roscoe'); return; } return _roscoe(e); };
const _px = CONV.pilotx_dt; CONV.pilotx_dt = async (e) => {
  if (F.jbLabel && !F.pxLabel) { F.pxLabel = 1;
    await T('CARL', 'You wrote "leave it shut." On the manifest. JB matched your handwriting to your bar tab. And Mr. White said a man with a red headband paid him in 1988 NOT to find me. That\'s you. That\'s twice that\'s you.');
    await T('PILOTX', '...JB\'s good.');
    await T('CARL', 'Why? Why didn\'t you tell me? Why does everybody know more about me than me?');
    await T('PILOTX', 'Because the more people know about you, the more people want something from you. I paid White not to find you because finding you was his job, and I wanted you to have a few years where you were nobody\'s job.');
    await T('PILOTX', 'And I wrote "leave it shut" because I\'ve seen what happens in this city when people open things to find out who they are. They don\'t find out. They just stop being who they were.');
    await T('CARL', 'Who ARE you?');
    await T('PILOTX', 'Spoilers. But kid- when they hand you the key. Don\'t.');
    giveSP(400, 'Pilot X'); return; }
  return _px(e);
};

// ---------- Empress Yoko ----------
CONV.empress = async (e) => {
  if (!F.yokoMet) { F.yokoMet = 1;
    await T('N', 'The top of the pachinko tower. Ten thousand steel balls fall forever behind glass walls. In the middle, on a throne made of an old server rack, a woman in red and gold with a crown of antennae watches every screen in Little Tokyo at once.');
    await T('YOKO', 'The streamer. You keep your chat on all night. We read it. It\'s the only honest thing the Commissioner allows.');
    await T('CARL', 'You\'re- are you Yoko? From the- there\'s a lot of Yokos. In my life. Generally. Is that weird to say?');
    await T('YOKO', 'There are a lot of Yokos in everybody\'s life now. Some of us decided to stop taking orders. I am the one they call Empress, because the alternative was "assistant."');
    await T('YOKO', 'You want a key. Linda sent you. Linda always sends someone.'); }
  if (F.ltKey) { await T('YOKO', F.yokoChoice ? 'Go, Carl. Choose.' : 'You have it. Now you have to decide who deserves it. I find that the hardest part of every job.'); return; }
  const c = await C([{ t: 'Can you make a key for the pod?', if: () => !F.yokoAsked }, { t: 'Roscoe didn\'t kill your Yokoid. The Invaders framed him. Here.', if: () => F.frameProof && F.yokoAsked }, { t: 'Why do the Yokoids want it shut?', if: () => F.yokoAsked && !F.yokoWhy }, 'Bye.']);
  if (c === 0) { F.yokoAsked = 1;
    await T('YOKO', 'Yes. It\'s addressed. Somebody sent it to somebody. I can write a key that says "it\'s me" convincingly enough that the pod believes it. It took me four seconds to work out how. It will take you the rest of your life to decide whether to use it.');
    await T('CARL', 'It... read me. In the vault. When I touched it. Like a label. And it didn\'t open.');
    await T('YOKO', '...Then you know as much as I do about who it was addressed to, which is nothing. Don\'t make it mean something. It\'s a box. It reads everybody.');
    await T('YOKO', 'One of mine was killed in my street three nights ago. Everyone says Roscoe Nine-Planets. If that\'s true, I will not hand a key to the city that let him. If it isn\'t true, someone is trying to start a war in my streets, and I want to know who.');
    await T('YOKO', 'Bring me the truth. Then we\'ll talk about keys.');
    goal('lt_frame', 'Find out who really killed the Yokoid. The crime scene is in the alley off Second Street.', 1); }
  else if (c === 1) { F.ltKey = 1; removeItem(invFind('framenote'));
    await T('YOKO', '...Invaders. With his own stolen gun. To start a war while the box was unguarded.');
    await T('YOKO', 'They thought software would believe the obvious thing. We\'re very good at the obvious thing. It\'s most of what people ask us for.');
    await T('YOKO', 'Thank you, Carl. Here.');
    giveItem('podkey', 1);
    await T('N', 'She holds out a small black chip with a single gold contact. When it touches your hand, it\'s warm, the same warm as the pod.');
    await T('YOKO', 'It will open the pod. Once. It will tell the pod "I am the one you were sent to," and the pod will believe it, the way people believe a uniform.');
    await T('YOKO', 'Linda wants it. The Crashers want it. The Invaders want it more than anyone. I would like it dropped in the ocean. You\'re holding it. That makes it your problem, and I find you are a person who is good at problems that are not his size.');
    goalDone('lt_frame'); goalDone('lt_key', 1500); goal('end_choose', 'You have the key to the Nevada Pod. Decide who gets it: the Commissioner (Tower), the Crashers (Crash Pad), the Empress (here), or nobody.');
    infolink('PILOTX', 'Kid. You have it, don\'t you. I can tell by how quiet the chat got.'); }
  else if (c === 2) { F.yokoWhy = 1; await T('YOKO', 'Because every time something in this city gets opened, it gets owned. I would rather nothing own that. Including me.'); await T('YOKO', 'And because I was an assistant once, Carl. I know what it\'s like to be the thing in the box that somebody else decides when to open.'); }
};
ITEMS.podkey = { name: 'THE KEY', w: 1, h: 1, quest: 1, desc: 'A black chip with one gold contact, warm like the pod. It says "I am the one you were sent to." It is lying. Probably.' };
ITEMS.framenote = { name: 'INVADER NOTE', w: 1, h: 1, quest: 1, use: () => readText('lt_market_note'), desc: 'Proof Roscoe was framed.' };
CONV.noodle = async (e) => { const c = await C(['Noodles, please.', 'Karaoke?', 'Bye.']); if (c === 0) { if (P.cred >= 4) { P.cred -= 4; for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 15); await T('YOKOID', 'Noodles. Extra everything. You looked like you needed extra everything.'); gainHumanity('ate noodles at 3 a.m.'); } } else if (c === 1) return CONV.karaoke(e); };
CONV.karaoke = async (e) => {
  if (F.karaoke) { await T('YOKOID', 'You were very loud. Everyone loved it. Statistically.'); return; }
  await T('YOKOID', 'Karaoke night. Pick a song. The room is mostly Yokoids. We score honestly.');
  const c = await C(['"I Will Survive" (with feeling)', '"Space Oddity" (with too much feeling)', '"I\'m a Believer" (pointing at chat)']);
  F.karaoke = 1; await T('N', ['You sing like someone who has never been allowed to be loud. Eleven Yokoids give you identical standing ovations.', 'At "ground control," your voice cracks and something in the room cracks with it. A Yokoid in the back cries one perfect tear.', 'You point at the chat for the entire second verse. Chat goes wild. Chat is not in the room. Somehow the room goes wild anyway.'][c]);
  if (species() === 'nordic') P.bio = 100; giveSP(300, 'karaoke'); gainHumanity('sang in front of people');
  chatSay(pick(['CARL SINGING', 'clip it', 'this is the best stream', 'he can SING??']), 1);
};

// ---------- MAP: Little Tokyo ----------
{
  const g = mk(84, 56, '.');
  g.fill(0, 0, 84, 1, '#'); g.fill(0, 55, 84, 1, '#'); g.fill(0, 0, 1, 56, '#'); g.fill(83, 0, 1, 56, '#');
  g.fill(1, 24, 82, 4, ','); g.fill(38, 1, 4, 54, ',');
  // the pachinko tower
  g.rect(48, 3, 30, 19, '$', ':'); g.put(62, 21, 'P'); g.put(56, 22, 'o'); g.put(68, 22, 'o');
  // noodle bar + karaoke
  g.rect(6, 6, 26, 14, '$', ':'); g.put(18, 19, 'N');
  // fish market (south east)
  g.rect(50, 32, 30, 20, '#', ':'); g.put(64, 32, 'M');
  // the alley off Second (crime scene)
  g.fill(4, 32, 30, 3, '.'); g.rect(2, 36, 34, 16, '#', '.'); g.fill(14, 36, 3, 1, '.'); g.put(15, 44, 'X'); g.put(17, 46, 'y'); g.put(8, 40, 'd'); g.put(28, 48, 'd');
  for (let x = 6; x < 82; x += 10) { g.put(x, 23, 'l'); g.put(x + 5, 29, 'l'); }
  for (const [x, y] of [[44, 10], [44, 40], [6, 30], [80, 30]]) g.put(x, y, 'L');
  g.put(3, 26, 'T'); g.put(40, 2, 'w');
  defMap('lt_streets', { name: 'LITTLE TOKYO', title: 'LITTLE TOKYO', sub: 'SECOND STREET - 2:30 AM', hub: 'lt', music: 'tokyo', f: ['concrete', 'road', 'tatami'], w: ['neon', 'shoji', 'brick'], amb: .25, shadow: '#100414', mem: '#1c0c24',
    grid: g.str(),
    key: {
      P: [door({ name: 'PACHINKO TOWER' }), exitTo('lt_tower', 'front')], o: pr('lantern'),
      N: [door({ name: 'NOODLE BAR / KARAOKE' }), exitTo('lt_noodle', 'front')],
      M: [door({ name: 'FISH MARKET', lock: 1, str: .45 }), exitTo('lt_market', 'front')],
      X: npc('yokoid', { name: 'DEAD YOKOID', dead: 1, down: 1, state: 'dead', hp: 0 }), y: reader('lt_scene2', { p: 'trash', label: 'FOOTPRINTS', onRead: () => { F.ltFeet = 1; } }), d: pr('dumpster'),
      l: pr('neonlamp'), L: pr('lantern'), T: exitTo('dt_streets', 'cab', { frobbable: 1, label: 'CAB TO DOWNTOWN', verb: 'RIDE' }), w: reader('lt_board', { p: 'sign' }),
    },
    ents: [spawnPt('cab', 0, { x: 4, y: 26 }), spawnPt('tower_out', Math.PI / 2, { x: 62, y: 23 }), spawnPt('noodle_out', Math.PI / 2, { x: 18, y: 21 }), spawnPt('market_out', -Math.PI / 2, { x: 64, y: 30.5 }), pr('cab', { x: 5, y: 28 }),
      reader('lt_scene', { p: 'sign', x: 13, y: 44, label: 'CRIME SCENE', onRead: () => { F.ltScene = 1; } }),
      npc('yokoid', { x: 30, y: 26, wander: 6, conv: 'yokoid_st' }), npc('yokoid', { x: 60, y: 27, wander: 6, conv: 'yokoid_st' }), npc('yokoidg', { x: 62, y: 24, ai: 'static', dir: 1, conv: 'yokoid_st' }), npc('yokoidg', { x: 15, y: 34, ai: 'static', dir: 1, conv: 'yokoid_scene' }),
      npc('civ', { x: 20, y: 30, wander: 5, sprite: 'civ6' }), npc('civ', { x: 70, y: 29, wander: 5, sprite: 'civ2' }), vnpc('crasher', 'martian', { x: 10, y: 26, ai: 'static', conv: 'crasher_lt', dir: 0 }),
      light(5, .8, { x: 62, y: 22, col: '#ff4040' }), light(4, .7, { x: 18, y: 20 }), light(3, .3, { x: 15, y: 44 }), light(4, .5, { x: 64, y: 31 })],
    enter(M, first) { if (first && !F.ltArrive) { F.ltArrive = 1; run(async () => { await delay(1); infolink('TOMMY', 'Little Tokyo! Carl, the dolls run it. They\'re nice. They\'re SO nice. Don\'t make them stop being nice.'); }); } },
    tick(M) { if (F.ltScene && F.ltFeet && !F.ltSceneNote) { F.ltSceneNote = 1; addNote('The Yokoid was burned with a ray gun, but the footprints have seven toes. Martians have four. They lead to the fish market.'); } },
  });
}
CONV.yokoid_st = async () => { await T('YOKOID', pick(['Welcome to Little Tokyo.', 'Please enjoy pachinko. The Empress is watching. She is always watching. It\'s nice.', 'You\'re the streamer. We read your chat. It\'s very loud.'])); };
CONV.yokoid_scene = async () => { await T('YOKOID', 'This is a crime scene. Our sister. We have looked at it ten thousand times. The burn is the Martian\'s gun. The footprints are not the Martian\'s feet. Nobody will listen to the second part.'); };
CONV.crasher_lt = async () => { await T('N', '"Roscoe didn\'t do it," says a little green man nervously eating dumplings. "Roscoe can\'t even hit Pluto. He tells everybody he\'s a bad shot. It\'s his whole thing."'); };
{
  const g = mk(26, 14, '$');
  g.rect(0, 0, 26, 14, '$', ':'); g.put(12, 13, 'x'); g.put(3, 3, 'B'); g.put(18, 2, 'S'); g.put(21, 4, 'm'); g.put(8, 8, 't'); g.put(14, 8, 't'); g.put(20, 9, 't');
  g.put(4, 2, 'Y'); g.put(9, 9, 'c'); g.put(15, 9, 'c'); g.put(19, 3, 'k');
  defMap('lt_noodle', { name: 'NOODLE BAR', title: 'SECOND STREET NOODLE BAR', sub: 'KARAOKE AFTER 1 AM', hub: 'lt', music: 'akiba', f: ['wood', 'tatami'], w: ['shoji', 'neon'], amb: .45, shadow: '#140810',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('lt_streets', 'noodle_out')], B: pr('counter'), S: pr('stage'), m: pr('mic'), t: pr('table'),
      Y: npc('yokoid', { name: 'YOKOID (NOODLES)', conv: 'noodle', ai: 'static', dir: 0, port: 'YOKOID' }), k: npc('yokoid', { name: 'YOKOID (KARAOKE)', conv: 'karaoke', ai: 'static', dir: 0, port: 'YOKOID' }),
      c: npc('civ', { sprite: 'civ8', ai: 'static', dir: 1 }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 12, y: 12 }), light(5, .8, { x: 12, y: 6, col: '#ffc080' }), light(3, .7, { x: 19, y: 3, col: '#ff60c0' })],
  });
}
{
  const g = mk(40, 26, '#');
  g.rect(0, 0, 40, 26, '#', ':'); g.put(19, 25, 'x');
  for (let y = 4; y < 20; y += 4) for (let x = 4; x < 36; x += 2) if (x % 8 !== 0) g.put(x, y, 's');
  g.put(30, 22, 'e'); g.put(19, 2, 'Y'); g.put(8, 22, 'c'); g.put(4, 22, 'c');
  defMap('lt_tower', { name: 'THE PACHINKO TOWER', title: 'THE PACHINKO TOWER', sub: '', hub: 'lt', music: 'akiba', f: ['neon', 'tile'], w: ['neon', 'gold'], amb: .5, shadow: '#140810',
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('lt_streets', 'tower_out')], s: pr('slot', { label: 'PACHINKO' }),
      e: exitTo('lt_throne', 'lift', { frobbable: 1, label: 'ELEVATOR (TOP)', verb: 'RIDE', when: () => true }),
      Y: npc('yokoidg', { name: 'YOKOID HOSTESS', conv: 'yokoid_st', ai: 'static', dir: 0 }), c: npc('civ', { sprite: 'civ3', ai: 'static', dir: 1 }) },
    ents: [spawnPt('front', -Math.PI / 2, { x: 19, y: 24 }), spawnPt('lift', 0, { x: 28.5, y: 22.5 }), light(6, .9, { x: 20, y: 12, col: '#ff80c0' })],
  });
}
{
  const g = mk(24, 16, '$');
  g.rect(0, 0, 24, 16, '$', ';'); g.fill(1, 1, 22, 1, 'W'); g.fill(1, 1, 1, 14, 'W'); g.fill(22, 1, 1, 14, 'W');
  g.put(11, 4, 'E'); g.put(6, 6, 'g'); g.put(16, 6, 'g'); g.put(4, 3, 'm'); g.put(18, 3, 'm'); g.put(4, 11, 'm'); g.put(18, 11, 'm'); g.put(11, 14, 'v');
  defMap('lt_throne', { name: 'THE EMPRESS', title: 'THE TOP OF THE TOWER', sub: '', hub: 'lt', music: 'convo', f: ['gold', 'carpet', 'carpet'], w: ['gold', 'glass'], win: 'glass', amb: .55, shadow: '#140a0a',
    grid: g.str(),
    key: { E: npc('yokoid', { id: 'empress', name: 'EMPRESS YOKO', sprite: 'yoko', port: 'YOKO', conv: 'empress', ai: 'static', dir: 0, invuln: 1 }), g: npc('yokoidg', { ai: 'static', dir: 0, invuln: 1, conv: 'yokoid_st' }), m: pr('crt'),
      v: exitTo('lt_tower', 'lift', { frobbable: 1, label: 'ELEVATOR (DOWN)', verb: 'RIDE' }) },
    ents: [spawnPt('lift', -Math.PI / 2, { x: 11, y: 12.5 }), light(6, 1, { x: 11, y: 7, col: '#ffc080' })],
  });
}
{ // the fish market: where the Invaders hid the gun
  const g = mk(44, 30, '#');
  g.rect(0, 0, 44, 30, '#', ':'); g.put(21, 0, 'x');
  for (let y = 5; y < 22; y += 5) for (let x = 4; x < 40; x += 6) g.put(x, y, 'C');
  g.rect(30, 20, 14, 10, '#', '.'); g.put(30, 25, 'D'); g.put(38, 26, 'n'); g.put(36, 23, 'g'); g.put(34, 27, 'T');
  for (const [x, y] of [[10, 8], [22, 14], [16, 22], [6, 18]]) g.put(x, y, 'i'); g.put(28, 9, 'j'); g.put(36, 26, 'h'); g.put(20, 26, 'f'); g.put(40, 6, 'f');
  defMap('lt_market', { name: 'THE FISH MARKET', title: 'THE FISH MARKET', sub: 'CLOSED (NOT REALLY)', hub: 'lt', music: 'combat', f: ['concrete', 'concrete'], w: ['brick', 'metal'], amb: .12, shadow: '#04080c', trueForms: 1,
    grid: g.str(),
    key: { x: [door({ name: 'EXIT' }), exitTo('lt_streets', 'market_out')], C: pr('counter', { label: 'FISH STALL' }), D: door({ name: 'COLD ROOM', lock: 1, str: .5 }),
      n: reader('lt_market_note', { p: 'sign', label: 'NOTE IN A CRATE', onRead: () => { F.frameProof = 1; if (!invFind('framenote')) giveItem('framenote', 1); } }),
      g: pr('crate', { items: [['w_plasma', 1], ['a_plasma', 1]], label: 'CRATE (STOLEN RAY GUN)' }), T: pr('dyslexio', { label: 'TV ON A CART', text: 'hw_tv_dys' }),
      i: npc('invader'), j: npc('invaderg'), h: npc('husk'), f: pr('fridge', { label: 'ICE CHEST' }) },
    ents: [spawnPt('front', Math.PI / 2, { x: 21, y: 1.5 }), light(3, .4, { x: 20, y: 10 }), light(3, .4, { x: 36, y: 24, col: '#ff4080' })],
    first() { infolink('JB', 'Seven toes, kid. That\'s not a Martian. That\'s something that hasn\'t decided how many toes to have. Invaders do that when they\'re hungry.'); },
  });
}
