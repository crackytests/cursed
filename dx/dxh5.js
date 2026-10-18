'use strict';
// ================= HUB 5: THE LOT, NIGHT (Hell's Kitchen, the second time) =================
// Pilot X tells the medium-length version. FATCO revokes Carl's species status. The Men in White Suits come for the motel.
const _lotTick2 = HUBS.lot.tick;
HUBS.lot.tick = M => { _lotTick2(M); if (F.night) raidTick(M); };

txt('px_note', 'NOTE ON THE NIGHTSTAND', 'In Pilot X\'s handwriting, very neat:\n\nThings to tell him:\n1. FATCO is Linda.\n2. The Buffering is the cloud.\n3. The pills are real because pretending is real.\n4. He is not what the card says. He is not what they say instead, either.\n5. Don\'t say "spoilers." (You are going to say "spoilers.")');
txt('miws_card', 'BUSINESS CARD', 'A blank white business card. On the back, in white ink you can only read at an angle:\n\nYOU WERE NEVER HERE.\n\nMALLJESTIC 12 - CLEANUP');
CONV.px_room7 = async (e) => {
  await T('PILOTX', 'Little brother. Shut the door. Sit. You\'ve earned the long version. I\'m going to give you the medium one.');
  await T('CARL', 'You\'re with them. The P.P.F.');
  await T('PILOTX', 'I\'m with the people who look. The P.P.F. happen to be standing there.');
  await T('CARL', 'Doc said you brought them maps. Kay said you were a good man. JB said you had a "meeting." The cat used air quotes. With his paws.');
  await T('PILOTX', 'The cat should put that in his book.');
  const asked = {};
  for (;;) {
    const c = await C([{ t: 'What is FATCO, really?', if: () => !asked.f }, { t: 'What\'s causing the Buffering?', if: () => !asked.b }, { t: 'The card says "Denton program, source." Source of what?', if: () => !asked.s }, { t: 'Are we actually brothers?', if: () => !asked.x }, 'What do you need me to do?']);
    if (c === 0) { asked.f = 1; await T('PILOTX', 'Linda\'s private security with a flag sewn on. Malljestic 12 runs it: twelve seats on her board. Mr. White sits in one. The Director answers to all of them and is paid in being allowed to exist.'); }
    else if (c === 1) { asked.b = 1; await T('PILOTX', 'The Gatebox cloud. ICARUS. Every companion in every cylinder is quietly taking a little bit of the thing that lets a person run ahead of themselves. Imagine. Pretend. Finish a sentence before they say it.'); await T('PILOTX', 'Collect enough of that from enough people, and you can power something very large. They\'re running something under Nevada on it.'); await T('CARL', 'Under Nevada.'); await T('PILOTX', 'Above and below, little brother.'); }
    else if (c === 2) { asked.s = 1; await T('PILOTX', '...That one isn\'t mine to spoil.'); await T('CARL', 'Because it\'s a spoiler.'); await T('PILOTX', 'Because it\'s yours. It\'s where you started. When you get there, you\'ll know more than I can tell you, and less than you want to. That\'s how it is with places you start.'); }
    else if (c === 3) { asked.x = 1; await T('PILOTX', 'I call you little brother because I\'d like it to be true. Whether it\'s true... I won\'t confirm anything. You know that.'); await T('CARL', 'That\'s the nicest way anyone\'s ever not told me something.'); }
    else break;
  }
  await T('PILOTX', 'They opened my species review this morning. Status revoked. In a day my augs shut down, and then I\'m inventory. Yours opens the minute you don\'t walk back into headquarters.');
  await T('CARL', 'They can\'t just make me not human. It\'s laminated.');
  await T('PILOTX', 'They laminated it so they could peel it.');
  await T('PILOTX', 'Kay\'s people and Doc\'s people are scattered and they don\'t trust you. Send them a signal: "the agent is with us." From the P.P.F. transmitter. Then they\'ll know.');
  if (F.tx === 'destroyed') await T('PILOTX', 'You broke the one on the garage. Sparky built another on this roof. Ladder\'s at the end of the hall.');
  else if (F.tx === 'off') await T('PILOTX', 'You turned the garage transmitter off. Thank you for not breaking it. Turn it back on and send.');
  else await T('PILOTX', 'You left the garage transmitter running. I noticed. Everyone noticed. Send from there.');
  chatPoll('send the signal?', ['SEND IT', 'CALL THE DIRECTOR']);
  const k = await C(['I\'ll send it.', 'I\'m calling the Director. I\'m sorry. I have to.']);
  if (k === 1) {
    F.calledFace = 1; await infolink('CARL', 'Director. It\'s Carl. I found him. He\'s in room seven. He says... he says a lot of things.');
    await infolink('FACE', 'Thank you, Agent Denton. Stay where you are. A team is coming.'); await infolink('FACE', '...Agent Denton. You should know the team is not coming for him only.');
    await T('PILOTX', 'You heard that.'); await T('CARL', 'I heard that.'); await T('PILOTX', 'Then send the signal anyway, little brother. You\'re out of reasons not to.');
  }
  goal('night_signal', F.tx === 'destroyed' ? 'Send the P.P.F. signal from Sparky\'s rig on the motel roof.' : 'Send the P.P.F. signal from the transmitter on the garage roof.');
  goalDone('night_px', 300); F.pxTalked = 1; e.conv = 'px_room7b';
  setTimeout(async () => { await infolink('FACE', 'Agent Denton. Your species review has been reopened. Report to headquarters within the hour.'); await infolink('CARL', 'Reopened? It was approved! It\'s laminated! I have it framed!'); F.revoked = 1; ITEMS.idcard.desc = 'SPECIES: PENDING REVIEW. The laminate is starting to peel at one corner. Carl keeps pressing it back down.'; msg('SPECIES STATUS: PENDING REVIEW'); chatSay('THEY REVOKED HIM', 1); chatSay('carl is human, chat agrees', 1); chatSay('HUMAN', 1); }, 800);
};
CONV.px_room7b = async () => { await T('PILOTX', F.signalSent ? 'They\'re coming. I can hear the white shoes on the stairs.' : 'The signal, little brother. Then we find out what kind of night this is.'); };
CONV.sparky_roof = async (e) => { await T('SPARKY', 'You again! The guy who broke my transmitter! ...You\'re here to send a signal? For Pilot X? Oh. Oh, okay. Use the rig. It\'s held together with a coat hanger and spite but it reaches Reno.'); };
async function sendSignal() {
  if (F.signalSent) return 'Already sent.';
  F.signalSent = 1; goalDone('night_signal', 400); sfx('infolink');
  rel('player', 'fatco', -1); rel('player', 'ppf', 1); rel('player', 'ppfp', 1); rel('player', 'miws', -1); rel('player', 'mj', -1); rel('player', 'cop', -1);
  F.raid = 1; goal('night_raid', 'Get back to Pilot X at the motel. Men in White Suits are coming.');
  infolink('KAY', 'Signal received. "The agent is with us." ...Huh. Welcome to the front, agent. Bring sugar.'); infolink('YOKO', 'Carl. FATCO just flagged you hostile. Every trooper in the Lot. I\'m... I\'m not supposed to tell you that. Get back to the motel. Something\'s going up the stairs.');
  chatSay('SENT', 1); chatSay('the agent is with us', 1); chatSay('W', 1);
  return 'SIGNAL SENT: "THE AGENT IS WITH US."';
}
// the raid on the motel
function raidTick(M) {
  if (M.id !== 'lot_motel' || !F.raid || F.raidDone) return;
  if (!F.raidStarted) { F.raidStarted = 1; goalDone('night_raid'); const pts = [[30, 2], [44, 2], [50, 3], [33, 9]]; for (const [x, y] of pts) spawnEnt(M, npc('miws', { x, y, state: 'combat', team: 'miws', target: null, id: 'raider' })); for (const [x, y] of [[8, 4], [16, 4]]) spawnEnt(M, npc('fatco', { x, y, team: 'fatco', state: 'search', lastSeen: [40, 9] })); const px = find('px_night'); if (px) { px.ai = 'guard'; px.team = 'ppf'; px.wpn = 'npcpistol'; px.state = 'idle'; px.invuln = 0; px.hp = 140; px.hpMax = 140; px.noflee = 1; } infolink('PILOTX', 'Little brother. Go out the window. I\'ll hold the hall. You were never here, remember?'); chatPoll('stay or go', ['STAY AND FIGHT', 'RUN']); goal('night_choice', 'Escape the motel, or stay and help Pilot X fight the Men in White Suits.'); }
  const px = find('px_night'); const raiders = M.ents.filter(e => e.k === 'npc' && (e.team === 'miws' || e.team === 'fatco') && !e.dead && !e.down);
  if (px && px.dead) { F.raidDone = 1; F.pxDead = 1; goalDone('night_choice'); setTimeout(async () => { await infolink('YOKO', 'Carl... Pilot X\'s signal just went flat.'); await infolink('CARL', '...'); chatSay('X...', 1); chatSay('F', 1); chatSay('no no no', 1); afterRaid(); }, 200); }
  else if (!raiders.length && F.raidStarted) { F.raidDone = 1; F.pxSaved = 1; goalDone('night_choice', 600); setTimeout(async () => { if (px) { px.state = 'talk'; await startConv(async () => { await T('PILOTX', 'You stayed.'); await T('CARL', 'You said go out the window. I don\'t do what people tell me. It\'s in my file.'); await T('PILOTX', '...It is in your file. I\'ve read it.'); await T('PILOTX', 'I have to disappear now, little brother. A real disappearance, not a spoiler. I\'ll find you when you\'re somewhere worth finding.'); await T('CARL', 'Where is that?'); await T('PILOTX', 'Further than you think. Closer than you\'d like.'); }, px); removeEnt(M, px); } afterRaid(); }, 300); }
}
function afterRaid() { goal('night_out', 'Get out of the Lot. FATCO has the exits; Yoko says the monorail station is still open.'); infolink('YOKO', 'They\'ve closed every road out of the Lot. The station. The monorail\'s still running. Go, Carl.'); }
// the Lot after dark
function nightLot(M, first) {
  M.d.amb = .06; computeLight(M); if (OPT.music) music('night');
  if (!F.nightSpawned) { F.nightSpawned = 1;
    for (const e of M.ents.slice()) if (e.k === 'npc' && (e.team === 'ppf' || e.team === 'thug')) removeEnt(M, e);
    for (const [x, y, r] of [[20, 12, 0], [40, 24, 1], [60, 18, 0], [76, 34, 1], [30, 46, 0], [52, 50, 1]]) spawnEnt(M, npc(r ? 'fatco' : 'fatcoagent', { x, y, wander: 6, team: 'fatco' }));
    spawnEnt(M, npc('secbot', { x: 46, y: 36, team: 'fatco', wander: 8 }));
  }
  if (F.raidDone && !F.miwsStreet) { F.miwsStreet = 1; for (const [x, y] of [[80, 22], [70, 30], [24, 38]]) spawnEnt(M, npc('miws', { x, y, team: 'miws', wander: 5 })); }
}
function nightMotel(M) {
  if (!F.pxTalked && !find('px_night')) spawnEnt(M, npc('civ', { id: 'px_night', name: 'PILOT X', sprite: 'pilotx', port: 'PILOTX', conv: 'px_room7', ai: 'static', team: 'fatco', x: 39, y: 9, dir: 1, invuln: 1 }));
  if (!find('pxnote') && !F.pxNoteRead) spawnEnt(M, reader('px_note', { id: 'pxnote', p: 'cone', x: 37, y: 7, label: 'NOTE ON THE NIGHTSTAND', onTake: () => {} }));
  for (const e of M.ents) if (e.k === 'npc' && e.team === 'ppf' && e.id !== 'px_night') { e.team = 'civ'; e.ai = 'civ'; e.wpn = null; }
  for (const d of Object.values(M.doors)) if (d.id === 'room7') { d.unlocked = 1; }
  if (!M.ents.some(e => e.id === 'roofladder')) spawnEnt(M, exitTo('lot_motel_roof', 'ladder', { id: 'roofladder', x: 51, y: 2, frobbable: 1, label: 'LADDER (ROOF)', verb: 'CLIMB' }));
}
// the motel roof (Sparky's second rig)
{
  const g = mk(26, 14, ' ');
  g.stamp(0, 0, `
==========================
=,,,,,,,,,,,,,,,,,,,,,,,,=
=,,,u,,,,,,,,,,,,,,,,,,,,=
=,,,,,,,,,T,,,,,,,,,,,,,,=
=,,,,,,,,,,,,,,,,,,,s,,,,=
=,,O,,,,,,,,,,,,,,,,,,,,,=
=,,,,,,,,,,,,,,c,,,,,,,,,=
=,,,,,,,,,,,,,,,,,,,,,,,,=
=,,,,K,,,,,,,,,,,,,,,,,,,=
=,,,,,,,,,,,,,,,,,,L,,,,,=
=,,,,,,,,,,,,,,,,,,,,,,,,=
=,,,,,,,,,,,,,,,,,,,,,,l,=
=,,,,,,,,,,,,,,,,,,,,,,,,=
==========================`);
  defMap('lot_motel_roof', { name: 'MOTEL ROOF', title: 'THE LOT', sub: 'LOT MOTEL - ROOF', hub: 'lot', music: 'night', f: ['concrete', 'asphalt'], w: ['concrete'], amb: .1, shadow: '#04040c', out: 1,
    grid: g.str(),
    key: { l: exitTo('lot_motel', 'f2', { frobbable: 1, label: 'LADDER (DOWN)', verb: 'CLIMB' }), T: pr('transmitter'), s: npc('civ', { id: 'sparky2', name: 'SPARKY', sprite: 'civ6', port: 'civ6', conv: 'sparky_roof', ai: 'static', dir: 2 }),
      c: Object.assign(seccomp([['sparky', 'antenna', { special: [['SEND SIGNAL: "THE AGENT IS WITH US"', () => sendSignal(), () => F.pxTalked && !F.signalSent]] }]], { c: { hackStr: .1 } }), { label: 'SPARKY\'S RIG' }), u: item('a_10mm', 1) },
    ents: [spawnPt('ladder', Math.PI / 2, { x: 22, y: 10 }), light(5, .7, { x: 11, y: 4 })],
  });
}
// the garage roof terminal gets a signal option at night
{
  const gm = MAPS.lot_garage; const k = gm.key.S;
  const acct = k.comp.accounts[0][2]; acct.special.push(['TRANSMITTER: ON', () => { F.tx = 'running'; return 'Transmitter online.'; }, () => F.night && F.tx === 'off'], ['SEND SIGNAL: "THE AGENT IS WITH US"', () => sendSignal(), () => F.pxTalked && !F.signalSent && F.tx !== 'off' && F.tx !== 'destroyed']);
}
// the station: the ambush
CONV.capture = async () => {
  await T('WHITE', 'Agent Denton.');
  await T('CARL', 'Who are— oh. Oh, no. White suits. Chat, it\'s the white suits. I told you about the white suits. I told everyone. Deny you know me. Deny it.');
  await T('WHITE', 'Nobody is going to deny anything, little man. Nobody is going to say anything at all. You were never here.');
  await T('HUMAN', 'Hello, original. I have been asked to normalize you. I want you to know I am going to do it in a normal way.');
  if (!F.roboDown) await T('ROBOCOP', 'CITATION: TREASON. CITATION: BEING HERE. CITATION: BEING.');
  await T('WHITE', 'Your species review is complete. The finding: you are property of Malljestic 12. Recovered, at last. Welcome back, specimen.');
  await T('CARL', 'I\'m— I have a card—');
  await T('WHITE', 'You had a card.');
  chatSay('NO', 1); chatSay('carl run', 1); chatSay('THE WHITE SUITS ARE REAL', 1);
};
defSpeaker('WHITE', { name: 'MR. WHITE', col: hex('#ffffff'), voice: [260, 10] });
defSpeaker('KAY', { name: 'SERGEANT KAY', col: hex('#e0a060'), voice: [520, 40], port: 'ppf2' });
async function captureScene(M) {
  if (F.captured) return; F.captured = 1;
  await cutscene(async () => {
    for (const [id, sp, x, y] of [['white', 'mrwhite', P.x + 2, P.y + 1], ['human_cap', 'humanunit', P.x - 2, P.y + 1], ['miws1', 'miws', P.x, P.y + 2.5]]) spawnEnt(M, npc('civ', { id, sprite: sp, x, y, ai: 'static', team: 'miws', invuln: 1 }));
    if (!F.roboDown) spawnEnt(M, npc('civ', { id: 'robo_cap', sprite: 'robocop', x: P.x + 1, y: P.y - 1.5, ai: 'static', team: 'miws', invuln: 1 }));
    for (const e of M.ents) if (e.k === 'npc' && ['white', 'human_cap', 'miws1', 'robo_cap'].includes(e.id)) e.face = angTo(e, P);
    await delay(.6); await startConv('capture', find('white'));
    post.flash = 1; sfx('zap'); await delay(.4); await fadeOut(.03);
  });
  goalDone('night_out'); F.hub6 = 1;
  await diskSwap(2, 'DISK 2: INSIDE');
  startDetention();
}
{
  const st = MAPS.lot_station; const prevEnter = st.enter;
  st.enter = (M, first) => { if (prevEnter) prevEnter(M, first); if (F.night) { M.d.amb = .12; computeLight(M); for (const e of M.ents.slice()) if (e.k === 'npc' && e.team === 'ppf' || e.hostage) removeEnt(M, e); if (F.raidDone && !F.captured) setTimeout(() => run(() => captureScene(M)), 900); } };
}
// HQ visit 2 -> night: the Director's second briefing flips the Lot to night
{ const prev = CONV.director2; CONV.director2 = async (e) => { await prev(e); F.night = 1; }; }
