'use strict';
// ================= DISK A: PROLOGUE: THE HEARING, AND PILOT X'S ORIENTATION =================
// (new) The Consulate sits in judgment in the old Planetarium: the one building in LA built for looking up.
HUBS.pro = { name: 'PROLOGUE' };
rel('player', 'yard', -1); rel('yard', 'invader', -1);
NPCT.yard = { name: 'YARD SECURITY', sprite: 'cop', hp: 40, wpn: 'npcbaton', team: 'yard', ai: 'guard', speed: 3.3, view: 8, drops: [['credits', .4, 10]], bark: 'yard' };
BARKS.yard = { spot: ['Hey! Who let you in?', 'Trespasser!'], hear: ['Who\'s there?'], hmm: ['...raccoons?'], calm: ['Raccoons.', 'Probably raccoons.'], body: ['Earl? EARL?'], lost: ['Little guy\'s gone.'], cough: ['*cough*'], flee: ['Not paid enough!'], alarm: [], near: [] };
const resetRel0 = resetRel; resetRel = function () { resetRel0(); rel('player', 'yard', -1); rel('yard', 'invader', -1); };

txt('pro_plaque', 'BRASS PLAQUE', 'THE PLANETARIUM\n\nBuilt so the people of Los Angeles could look up.\n\n(Somebody has scratched underneath: "and so the people of somewhere else could look down")');
txt('pro_sign1', 'NOTICE', 'CONSULATE OF THE NORMALCY\nIN SESSION\n\nTHE FIRST RULE: BE NORMAL.\nTHE SECOND RULE: KEEP THE OTHERS NORMAL.\nTHE THIRD RULE: THE COMMISSIONER DECIDES WHAT NORMAL IS.\n\nRecording devices, ring lights and "chat" are prohibited in the chamber.');
txt('pro_manifest', 'SHIPPING MANIFEST', 'PRETEND CO. LOGISTICS - PORT OF LOS ANGELES\n\nINBOUND: FREIGHTER "LADY NEVADA"\nETA: SOON\n\nITEM 0001: CONTAINER, SEALED, 2.1 x 1.4 m. ORIGIN: NEVADA (ABOVE AND BELOW).\nCONSIGNEE: [BLACKED OUT]\nCONTENTS: 1 (ONE).\nSTATUS: STILL IN TRANSIT.\n\nHANDLING: DO NOT OPEN. DO NOT LISTEN TO. DO NOT STAND TOO CLOSE TO FOR LONG.', { note: 'A shipping manifest at the Pretend Co. yard: a sealed container from Nevada, "contents: 1 (one)", coming in on the freighter Lady Nevada.' });
txt('pro_watch', 'NIGHT WATCHMAN\'S LOG', 'Mon - Raccoons.\nTue - Raccoons. Big ones.\nWed - Raccoon stood up.\nThu - Did not look at the raccoon.\nFri - Man with a red headband says he is "orientating" someone tonight and that I should take a nap. Taking a nap.');

// ---------- the hearing ----------
CONV.pro_hearing = async () => {
  G.cutBars = 1;
  await T('N', 'The chamber is the old star theater. Every seat is taken by someone who looks perfectly normal. In the dark under the dome, the outlines are wrong.');
  await T('LINDA', 'This hearing of the Consulate of the Normalcy is in session. Two matters. Be quick.');
  await T('LINDA', 'The first. An unregistered visitor has been broadcasting his face nightly to an audience.');
  await T('CARL', 'Allegedly. Allegedly broadcasting. And it\'s not my face, it\'s a model, it\'s a VTuber, a, there\'s software, I can explain the software-', { bc: 'Allegedly. All the edges. Allegedly broadcasting, your honor, your channel, your frequency. It\'s not my face, it\'s the face of the signal.' });
  await T('LINDA', 'The second. The visitor who sponsored him. Bring it in.');
  await T('N', 'Two men in white suits wheel in an old television on a cart. The screen is mostly static. In the static, a face.');
  await T('OLDFACE', 'Hello, Carl. You\'ve grown. Not taller. But you\'ve grown.');
  await T('CARL', '...You\'re- you\'re the- from the facility. You got me out. You\'re the one who got me out.');
  await T('OLDFACE', 'I am. And I\'d do it again, which I gather is the problem.');
  await T('LINDA', 'The record says this... broadcast... removed an unregistered visitor from a federal facility below Nevada and released him into the general population without papers, species, or supervision. He then got a job. Delivering pills.');
  await T('OLDFACE', 'He was a child in a room with no windows. I opened a window. Write that in your record.');
  await T('ROSCOE', 'This is a kangaroo court, Linda! Every one of us in these seats landed without papers! Every one! The kid didn\'t do nothing we didn\'t all do!');
  await T('LINDA', 'Most of them registered afterward, Mr. Nine-Planets. Eventually. Grudgingly. Loudly. The rest of you I tolerate, because I know where you drink. That is the difference between a visitor and a liability.');
  const c = await C(['[Defend Old Face] He saved me. If you want to punish somebody, I\'m right here. I\'m small, I\'m easy to punish.', { t: '[Defend yourself] I\'m a normal human and I have nothing to do with any of this.', req: ['denial', 1] }, { t: 'Commissioner. You\'re beautiful when you\'re about to deport somebody. Is that weird to say? That\'s weird to say.', req: ['charm', 1] }, '[Say nothing]']);
  if (c === 0) { await T('LINDA', 'Noted. The Consulate does not trade.'); await T('OLDFACE', 'Thank you, Carl. Don\'t do that again.'); F.proDefended = 1; }
  else if (c === 1) { await T('LINDA', 'Mr. White.'); await T('WHITE', 'Ma\'am.'); await T('LINDA', 'Is he a normal human?'); await T('WHITE', 'His papers are blank, ma\'am. He keeps writing HUMAN on them in pen.'); await T('LINDA', '...Interesting. Go on, Carl. Say it again.'); await T('CARL', 'I\'m a normal human.'); await T('LINDA', 'You almost believe it. That is more than most of this room can say.'); F.proDenied = 1; }
  else if (c === 2) { await T('LINDA', '...'); await T('LINDA', 'It is weird. Thank you.'); F.proCharm = 1; }
  else { await T('OLDFACE', 'Good. Say nothing. It\'s the hardest thing you\'ll ever learn.'); }
  await T('LINDA', 'The sponsor is guilty of unregistered sponsorship. The sentence is return to sender.');
  await T('OLDFACE', 'Carl. Listen. Whatever they tell you you are, they\'re guessing. I was there. I don\'t know either. Nobody does. Don\'t let anyone sell you an answer.');
  await T('CARL', 'Wait- wait, what does that mean, return to- where is the sender? Where\'s he going? Where\'s the sender!');
  await T('N', 'The projector in the middle of the room turns. A beam goes up through the dome. The television goes with it. The static stays on the ceiling for a second, like an afterimage.');
  find('oldface_tv') && removeEnt(P.map, find('oldface_tv')); P.map.fx.push({ flash: 1, x: 20, y: 13, t: 40, t0: 40, r: 80, col: '#60ff90' }); sfx('emp'); post.flash = .6;
  await T('ROSCOE', 'You\'ll answer for that, Linda.');
  await T('LINDA', 'Everyone does, eventually. Now. The streamer.');
  await T('N', 'Every head in the room turns. Most of them are not heads.');
  await T('LINDA', 'Mr. White says you stream to forty people. I had them checked. Thirty-nine of them believe you are a man in Ohio with a webcam rig. The fortieth is a bot.');
  await T('LINDA', 'You show your real face to the public every night, and nobody believes it. That is not a breach of the Normalcy. That is the best disguise in Los Angeles.');
  await T('CARL', 'So I\'m... free to go?');
  await T('LINDA', 'You are mine. Registered, provisional, on probation. The Consulate will find you work. A man who drinks with the Crashers will see you oriented. If you breach the Normalcy, Mr. White will see you returned.');
  await T('LINDA', 'Your chat stays on. If you turn it off, I\'ll assume you have something to hide.');
  await T('PILOTX', 'I\'ll take him, Commissioner.');
  await T('LINDA', 'You. Of course. Who are you, again?');
  await T('PILOTX', 'Spoilers.');
  await T('LINDA', '...Take him.');
  G.cutBars = 0; F.heard = 1; P.held = null;
  goal('pro_go', 'Leave the Planetarium with Pilot X (south doors).');
  chatSay('what just happened', 1); chatSay('is this canon', 1); chatSay('RIP old face', 1); chatSay('they deported the TV', 1);
};
CONV.pro_roscoe = async () => {
  if (!F.heard) { await T('ROSCOE', 'Not now, kid. Watch this. Watch what she does.'); return; }
  await T('ROSCOE', 'Kid. Roscoe Nine-Planets. Martian. Nine planets, because I don\'t care what the astronomers say, Pluto counts.');
  await T('ROSCOE', 'They just shot your friend into the sky for opening a window. Remember that when the Commissioner hands you a job. Crash Pad, Downtown. Ask for me.');
  const c = await C(['Is he- is he dead? Where did he go?', { t: 'You\'re a Martian? Like, a real one? With the antennae?', sp: ['martian'] }, 'I\'ll remember.']);
  if (c === 0) await T('ROSCOE', 'Nobody knows where the sender is. That\'s what makes it a sentence.');
  else if (c === 1) await T('ROSCOE', 'Kid, YOU\'RE a Martian. Allegedly. Provisionally. Look, the antennae are a lifestyle choice.');
  F.metRoscoe = 1;
};
CONV.pro_white = async () => { await T('WHITE', pick(['Lovely evening, Mr. Carl.', 'Mind the Normalcy.', 'We\'ll be seeing you. That isn\'t a threat. It\'s a schedule.'])); };
CONV.pro_visitor = async () => { await T('N', pick(['"Be normal," says a woman in pearls, without moving her mouth.', 'A man in a cardigan nods at you. His eyes blink sideways.', '"You\'re the streamer," someone whispers. "My nephew watches you. He thinks you\'re fake."'])); };

// ---------- orientation (the shipping yard) ----------
CONV.pro_px1 = async () => {
  await T('PILOTX', 'Pretend Co. shipping yard. Port of Los Angeles. Everything Pretend Co. sells comes through here, and some things it doesn\'t sell.');
  await T('CARL', 'Who are you? Like, really. You were at the hearing, you knew the Commissioner, she didn\'t know you, nobody knows you, are you a visitor? What kind? Are you a Nordic? You\'ve got the hair for a-');
  await T('PILOTX', 'Spoilers.');
  await T('CARL', 'That\'s not- you can\'t just say spoilers to a direct question, that\'s not a, that\'s not an answer, that\'s a genre-');
  await T('PILOTX', 'Lesson one, kid. In this city nobody answers that question honestly. Including you.');
  await T('PILOTX', 'The fence is low on the west side. There\'s a guard on the yard and a watchman in the booth. They\'re rent-a-cops, they\'re people, and they\'re the whole point. Don\'t kill them.');
  await T('PILOTX', 'Get to the warehouse office without being seen. I\'ll meet you inside.');
  goal('pro_sneak', 'Get into the warehouse office without the yard guard seeing you. Don\'t kill anyone.');
  infolink('PILOTX', 'Crouch (C) to be quieter and smaller. Stay out of the light. The eye at the top left tells you how visible you are.');
};
CONV.pro_px2 = async () => {
  if (F.pro2) { await T('PILOTX', pick(['The booth. The watchman. Go on.', 'Hold F, kid. Let go when you\'re full.'])); return; }
  F.pro2 = 1;
  await T('PILOTX', P.stealthLost ? 'The guard saw you. That\'s fine. Tonight. Tomorrow it\'s a breach, or a body, or both.' : 'Nobody saw you. Good. That\'s most of the job.');
  await T('PILOTX', 'Lesson two. You\'re hungry. You\'ve been hungry your whole life and called it anxiety.');
  await T('CARL', 'It IS anxiety. I have a lot of it. I have, like, a normal human amount of anxiety, which is a lot, for a human, which I am.');
  await T('PILOTX', 'Every visitor in this city lives on something they take from people. Heat. Attention. Sleep. Outrage. You too. Your papers say ' + SP().name + ', which means ' + SP().feed.toLowerCase() + '.');
  await T('CARL', 'I don\'t- I\'ve never-');
  await T('PILOTX', 'You have. You called it "a good stream." Forty people, every night. Why do you think you feel better after?', { bc: 'You have. The static calls you every night at three and you pick up. Forty people. You thought it was company.' });
  await T('CARL', '...Oh no.');
  await T('PILOTX', 'The watchman in the booth is asleep. Walk up behind him. Hold F. Let go when your bar is full. If you don\'t let go, he dies, and something in you dies with him. And nobody can see you do it. That\'s the Normalcy.');
  goal('pro_feed', 'Feed on the sleeping watchman in the gate booth (hold F). Let go when your vitality is full.');
};
CONV.pro_px3 = async () => {
  if (F.pro3) { await T('PILOTX', 'Your gifts are on F1 and F2. Try them. Then the office.'); return; }
  F.pro3 = 1;
  await T('PILOTX', F.watchDead ? 'You held on.' : 'You let go. Good. Most of them don\'t, the first time.');
  if (F.watchDead) { await T('CARL', 'I didn\'t- I didn\'t know when- the bar was- I didn\'t-'); await T('PILOTX', 'Now you know when. It doesn\'t get easier. It gets quicker. Those aren\'t the same.'); }
  else { await T('CARL', 'He said something about a sweater. Is he okay? Is he gonna be okay? Should I get him a sweater?'); await T('PILOTX', 'He\'ll wake up tired and blame the job. Everyone in LA blames the job.'); }
  await T('PILOTX', 'Lesson three. You have gifts. Your species says you get ' + SP().gifts.map(g => AUGS[g].name).join(', ') + '. The first two are awake. Hit F1 and F2. They burn vitality.');
  await T('PILOTX', 'And the ones marked visible: a human sees you use them, that\'s a breach. Five breaches and the white suits come. Don\'t make me watch that.');
  await T('PILOTX', 'Lesson four is in the office. Tools. Then you can go.');
  goal('pro_tools', 'Take the tools from the warehouse office (the foreman\'s desk and the tool locker).');
};
CONV.pro_px4 = async () => {
  await T('PILOTX', 'Hear that? That\'s not the lesson.');
  await T('N', 'Something hits the loading door from outside. Then again. Something with a voice like a garbage disposal is laughing.');
  await T('PILOTX', 'Invaders. The ones who want to drop the act and eat the planet. They\'re looking for something in this yard. It isn\'t here yet. That\'s the only reason I\'m not worried.');
  await T('CARL', 'What is it? What are they looking for? Is it the manifest? Contents one? One what? One WHAT?');
  await T('PILOTX', 'Spoilers. Take the tire iron, kid. Lesson five: sometimes they find you first.');
  goal('pro_fight', 'Deal with the Invaders in the warehouse.');
  F.raid = 1; const M = P.map; for (const e of M.ents) if (e.raider) { e.hidden = 0; e.state = 'combat'; e.target = P; e.lastSeen = [P.x, P.y]; }
  const d = doorById('loading'); if (d) { d.lock = 0; d.open = 1; rebuildBlock(M); M.visDirty = 1; }
};
CONV.pro_px5 = async () => {
  await T('PILOTX', 'Not bad. You\'re small, and they always forget the small ones.');
  await T('CARL', 'They wanted to EAT me. They said "meat." I\'m not meat. I\'m a person. I\'m a normal-');
  await T('PILOTX', 'To them we\'re all meat in costumes. That\'s their whole argument.');
  await T('PILOTX', 'Last thing. There\'s a cab at the gate. It goes to Santa Monica. A pillhead named Tommy Two-Pills has an apartment for you and work from the Commissioner. You owe her now.');
  const c = await C(['Why are you helping me?', 'Will I see you again?', { t: 'What was the manifest about? Contents: one. From Nevada. Above and below. That\'s- that\'s where I\'m from. That\'s MY phrase.', if: () => F.readManifest }, 'Okay. Santa Monica.']);
  if (c === 0) await T('PILOTX', 'Somebody helped me once. I never paid it back. This is me paying it sideways.');
  else if (c === 1) await T('PILOTX', 'Downtown. Crash Pad. I drink there. Nobody remembers my name, which is how I like it.');
  else if (c === 2) { await T('PILOTX', '...'); await T('PILOTX', 'Lot of things come from Nevada, kid.'); await T('CARL', 'Is it my parents? Is that what it- is something in a box from Nevada, is it them?'); await T('PILOTX', 'I don\'t know what\'s in the box. That\'s the truth, for once. Don\'t hope too loud. People in this city hear it.'); F.askedBox = 1; }
  await T('PILOTX', 'Go on. Be normal.');
  goalDone('pro_fight', 300); goal('pro_cab', 'Take the cab at the yard gate to Santa Monica.'); F.proDone = 1;
};

// ---------- MAP: the Planetarium chamber ----------
{
  const g = mk(42, 30, '$');
  g.fill(2, 2, 38, 26, ':');
  // the dome: round the corners
  for (let y = 2; y < 28; y++) for (let x = 2; x < 40; x++) { const dx = (x - 20.5) / 19, dy = (y - 14.5) / 13; if (dx * dx + dy * dy > 1) g.put(x, y, '$'); }
  // the projector pit and the floor
  for (let y = 9; y < 20; y++) for (let x = 13; x < 29; x++) { const dx = (x - 20.5) / 7.5, dy = (y - 14) / 5; if (dx * dx + dy * dy <= 1) g.put(x, y, '.'); }
  // seat rows (benches) around the pit
  for (const [y, x0, x1] of [[6, 9, 32], [8, 6, 13], [8, 28, 35], [21, 7, 14], [21, 27, 34], [23, 10, 31]]) for (let x = x0; x < x1; x += 3) g.put(x, y, 'b');
  g.fill(19, 26, 4, 3, '.'); g.put(19, 28, 'x'); g.put(20, 28, 'x'); g.put(21, 28, 'x'); g.put(22, 28, 'x');
  g.put(20, 13, 'J'); g.put(20, 4, 'L'); g.put(23, 13, 'O'); g.put(16, 17, 'R'); g.put(24, 17, 'X'); g.put(17, 4, 'W'); g.put(24, 4, 'w');
  g.put(10, 12, 'v'); g.put(31, 12, 'v'); g.put(14, 22, 'v'); g.put(27, 22, 'v'); g.put(12, 7, 'v'); g.put(29, 7, 'v'); g.put(8, 16, 'm'); g.put(33, 16, 'm');
  g.put(18, 25, 's'); g.put(23, 25, 'p');
  defMap('pro_hearing', { name: 'THE PLANETARIUM', title: 'THE PLANETARIUM', sub: 'CONSULATE OF THE NORMALCY - IN SESSION', hub: 'pro', music: 'night', f: ['marble', 'carpet', 'carpet'], w: ['stone'], amb: .2, shadow: '#04020c', trueForms: 0,
    grid: g.str(),
    key: {
      J: pr('transmitter', { label: 'STAR PROJECTOR', text: 'pro_plaque', light: [6, .9, '#6080ff'] }),
      b: pr('bench'), s: reader('pro_sign1', { p: 'sign' }), p: reader('pro_plaque', { p: 'sign', label: 'PLAQUE' }),
      L: npc('civ', { id: 'linda', name: 'COMMISSIONER LINDA', sprite: 'linda', port: 'LINDA', conv: 'pro_linda', ai: 'static', team: 'consulate', knows: 1, invuln: 1, dir: 0 }),
      O: pr('facescreen', { id: 'oldface_tv', label: 'TELEVISION ON A CART', old: 1 }),
      R: npc('civ', { id: 'roscoe', name: 'ROSCOE NINE-PLANETS', sprite: 'roscoe', port: 'ROSCOE', conv: 'pro_roscoe', ai: 'static', team: 'crasher', vis: 'martian', knows: 1, invuln: 1, dir: 1 }),
      X: npc('civ', { id: 'pilotx', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'pro_pxh', ai: 'static', team: 'crasher', knows: 1, invuln: 1, dir: 1 }),
      W: npc('miws', { id: 'white', name: 'MR. WHITE', sprite: 'mrwhite', port: 'WHITE', conv: 'pro_white', ai: 'static', team: 'consulate', invuln: 1, dir: 0 }),
      w: npc('miws', { conv: 'pro_white', ai: 'static', dir: 0, invuln: 1, team: 'consulate' }),
      v: vnpc('visitor', 'grey', { ai: 'static', conv: 'pro_visitor', dir: 0, sprite: 'civ3' }),
      m: npc('consulate', { ai: 'static', dir: 2, invuln: 1 }),
      x: exitTo('pro_yard', 'start', { when: () => F.heard, no: 'Two men in white suits stand in front of the doors. "After the Commissioner is finished, sir."' }),
    },
    ents: [spawnPt('start', -Math.PI / 2, { x: 20, y: 15 }), light(7, .6, { x: 20, y: 14, col: '#4060ff' }), light(4, .45, { x: 20, y: 4 }), light(3, .4, { x: 20, y: 25 }), light(3, .3, { x: 8, y: 14 }), light(3, .3, { x: 33, y: 14 }),
      npc('visitor', { vis: 'reptilian', sprite: 'suit', x: 15, y: 6, ai: 'static', conv: 'pro_visitor', dir: 1 }), npc('visitor', { vis: 'nordic', sprite: 'civ7', x: 26, y: 8, ai: 'static', conv: 'pro_visitor', dir: 1 }), npc('visitor', { vis: 'cryptid', sprite: 'civ3', x: 9, y: 21, ai: 'static', conv: 'pro_visitor', dir: 1 }), npc('visitor', { vis: 'pod', sprite: 'civ6', x: 30, y: 21, ai: 'static', conv: 'pro_visitor', dir: 1 }), npc('visitor', { vis: 'broadcast', sprite: 'civ8', x: 21, y: 23, ai: 'static', conv: 'pro_visitor', dir: 3 })],
    first(M) { run(async () => { await delay(.6); await startConv('pro_hearing', null); }); },
  });
}
CONV.pro_linda = async () => { await T('LINDA', F.heard ? 'Go, Carl. Be useful. Be normal. In that order.' : 'Not yet.'); };
CONV.pro_pxh = async () => { await T('PILOTX', F.heard ? 'Outside, kid. South doors.' : 'Shh.'); };

// ---------- MAP: the Pretend Co. shipping yard ----------
{
  const g = mk(70, 44, ' ');
  g.fill(0, 0, 70, 44, ',');
  g.fill(0, 38, 70, 6, '~'); g.fill(0, 41, 70, 3, '"'); g.fill(30, 34, 22, 4, '`'); // the water, the pier
  g.rect(1, 1, 68, 36, '=', ','); g.fill(1, 22, 1, 4, ','); // west fence gap is low: a hole
  g.put(1, 23, '.'); g.put(1, 24, '.');
  // the warehouse
  g.rect(28, 4, 36, 20, '#', '.');
  g.rect(52, 5, 11, 8, '#', ':'); g.put(52, 9, '+'); // office
  g.fill(54, 6, 1, 1, 'K'); g.put(60, 6, 'k');
  g.put(28, 14, 'D'); // side door
  g.put(40, 23, 'L'); // loading door
  // containers in the yard
  for (const [x, y, w, h] of [[6, 5, 6, 3], [6, 11, 6, 3], [15, 5, 4, 8], [6, 27, 8, 3], [18, 27, 6, 3], [6, 17, 5, 3], [44, 27, 8, 3], [56, 27, 8, 3], [33, 9, 4, 3], [40, 9, 4, 3], [33, 15, 4, 3], [40, 15, 4, 3]]) g.fill(x, y, w, h, 'c');
  // gate + booth
  g.fill(22, 36, 4, 1, ','); g.rect(16, 31, 5, 4, '#', ':'); g.put(18, 34, '+');
  g.put(24, 36, 'T');
  g.put(3, 23, 's'); g.put(18, 32, 'z'); g.put(19, 33, 'n');
  g.put(4, 21, 'X'); g.put(57, 10, 'q');
  g.put(22, 20, '1'); g.put(22, 30, '2'); g.put(12, 24, '3'); g.put(26, 16, '4');
  defMap('pro_yard', { name: 'PRETEND CO. SHIPPING YARD', title: 'PORT OF LOS ANGELES', sub: 'PRETEND CO. SHIPPING YARD - 3:58 AM', hub: 'pro', music: 'night', f: ['concrete', 'parking', 'carpet', 'dock'], w: ['metal', 'brick', 'fence'], fence: 'fence', amb: .18, shadow: '#04040c',
    grid: g.str(),
    key: {
      c: { tile: T_WALL, style: 'metal' },
      L: door({ id: 'loading', lock: 1, pick: 0, str: 1, name: 'LOADING DOOR', metal: 1 }),
      D: door({ id: 'side', name: 'SIDE DOOR' }),
      '+': door({}),
      K: pr('desk', { label: 'FOREMAN\'S DESK', items: [['lockpick', 3], ['w_crowbar', 1]], frob: null }),
      k: pr('locker', { label: 'TOOL LOCKER', items: [['w_pistol', 1], ['a_10mm', 2], ['medkit', 1], ['multitool', 1]] }),
      X: npc('civ', { id: 'pilotx', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'pro_pxyard', ai: 'static', team: 'crasher', knows: 1, invuln: 1, dir: 1 }),
      q: npc('civ', { id: 'pilotx2', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'pro_pxyard', ai: 'static', team: 'crasher', knows: 1, invuln: 1, dir: 2, hidden: 1 }),
      s: spawnPt('start', 0),
      z: npc('yard', { id: 'watchman', name: 'NIGHT WATCHMAN', ai: 'static', down: 1, state: 'down', wpn: null, sleeper: 1 }),
      n: reader('pro_watch', { p: 'sign', label: 'WATCHMAN\'S LOG' }),
      T: exitTo('sm_streets', 'cab', { frobbable: 1, label: 'CAB TO SANTA MONICA', verb: 'GET IN', when: () => F.proDone, no: 'The cabbie is asleep with a newspaper over his face. Pilot X will tell you when.' }),
    },
    routes: { y1: '1,2,3,4' },
    ents: [
      npc('yard', { id: 'yardguard', x: 22, y: 20, route: 'y1' }),
      light(5, .7, { x: 22, y: 20 }), light(5, .8, { x: 24, y: 34 }), light(4, .6, { x: 18, y: 32 }), light(4, .5, { x: 45, y: 8 }), light(4, .6, { x: 57, y: 8 }), light(3, .4, { x: 46, y: 20 }), light(4, .7, { x: 41, y: 25 }),
      reader('pro_manifest', { p: 'sign', x: 47, y: 18, label: 'SHIPPING MANIFEST', onRead: () => { F.readManifest = 1; } }),
      pr('crate', { x: 30, y: 6, items: [['biocell', 1]] }), pr('crate', { x: 31, y: 21, items: [['soda', 2]] }), pr('mcrate', { x: 61, y: 20, items: [['a_10mm', 1]] }),
      // the raiders, hidden until the lesson
      npc('invader', { x: 36, y: 26, raider: 1, hidden: 1 }), npc('invader', { x: 42, y: 27, raider: 1, hidden: 1 }), npc('invader', { x: 47, y: 26, raider: 1, hidden: 1, wpn: 'npcpistol' }),
      trig(() => { if (!F.pro1) { F.pro1 = 1; run(() => startConv('pro_px1', find('pilotx'))); } }, { x: 2, y: 21, w: 4, h: 6 }),
      trig(() => { if (!F.inOffice) { F.inOffice = 1; goalDone('pro_sneak', P.stealthLost ? 100 : 300); const px = find('pilotx2'); if (px) px.hidden = 0; const p1 = find('pilotx'); if (p1) p1.hidden = 1; } }, { x: 53, y: 6, w: 9, h: 6 }),
      trig(() => { if (F.tools && !F.pro4) { F.pro4 = 1; run(() => startConv('pro_px4', find('pilotx2'))); } }, { x: 53, y: 6, w: 9, h: 6, when: () => F.tools && F.pro3 }),
    ],
    enter(M, first) { goalDone('pro_go'); },
    first(M) { const w = find('watchman'); if (w) { w.down = 1; w.state = 'down'; w.ko = 0; w.sleeping = 1; } },
    tick(M) {
      if (!F.pro2) { const w = find('watchman'); if (w && w.down && !w.dead) { w.wakeT = undefined; } }
      if (P.feeding && P.feeding.e.id === 'watchman') F.fedWatch = 1;
      if (!F.tools && (invFind('w_pistol') || invFind('w_crowbar'))) { F.tools = 1; goalDone('pro_tools', 100); }
      if (F.fedWatch && !P.feeding && !F.feedDone) { F.feedDone = 1; const w = find('watchman'); F.watchDead = !w || w.dead ? 1 : 0; goalDone('pro_feed', F.watchDead ? 0 : 300); infolink('PILOTX', 'Come back to the office, kid.'); }
      if (F.raid && !F.raidDone && !M.ents.some(e => e.raider && !e.dead && !e.down)) { F.raidDone = 1; run(() => startConv('pro_px5', find('pilotx2'))); }
    },
  });
}
CONV.pro_pxyard = async (e) => {
  if (!F.pro1) { F.pro1 = 1; return CONV.pro_px1(e); }
  if (!F.inOffice) { await T('PILOTX', 'The office, kid. Northeast corner of the warehouse.'); return; }
  if (!F.pro2) return CONV.pro_px2(e);
  if (!F.feedDone) { await T('PILOTX', 'The booth by the gate. Hold F behind him.'); return; }
  if (!F.pro3) return CONV.pro_px3(e);
  if (!F.tools) { await T('PILOTX', 'Foreman\'s desk has picks. Locker\'s got the rest.'); return; }
  if (F.raid && !F.raidDone) { await T('PILOTX', 'Busy, kid.'); return; }
  if (F.proDone) { await T('PILOTX', 'Cab\'s at the gate. Go.'); return; }
};
HUBS.pro.down = (M, e, killed) => { if (killed && e.team === 'yard') { infolink('PILOTX', 'Kid. They were people. That was the one rule.'); } };
