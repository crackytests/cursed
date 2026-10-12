'use strict';
// ================= DARK MONDAY: banter, scenes, speaker portraits =================
// Everyone has a name tag color and a voice even when not in the party, so scenes can call on anyone.
for (const id in ROSTER) { const r = ROSTER[id]; CAST[r.name] = { col: hex(r.col), voice: [600 + (id.length * 70) % 500, 40], pid: id }; }
CAST.GARF = { col: hex('#ffb258'), voice: [520, 30] }; CAST.SIGN = { col: hex('#80e8ff'), voice: [900, 10] };
const nameOf = id => ROSTER[id].name, inParty = id => PARTY.some(c => c.id === id && !c.dead), alive = id => PARTY.find(c => c.id === id && !c.dead);

async function playLines(lines) { for (const l of lines) { if (typeof l === 'string') await say(l); else await say(l[1], l[0]); } }

// ---------- speaker portrait (drawn over the party panel while somebody talks) ----------
function drawTalkPortrait() {
  if (!DLG || DLG.narr || !DLG.who) return; const c = CAST[DLG.who], pid = c && c.pid; if (!pid || !PORTS[pid]) return;
  const typing = DLG.n < DLG.lines.join('').length, talk = typing ? 1 + ((frame >> 3) & 1) : 0, x = W - PW - 14, y = VH - PH - 6;
  rectA(x - 8, y + 2, PW + 16, PH + 6, hex('#02010a'), .82); frameR(x - 8, y + 2, PW + 16, PH + 6, UI.frame2); blit(portrait(pid, undefined, talk), x, y);
}

// ---------- banter ----------
// say: one line per character; the first three present characters in `pri` speak. pair: a hand-written exchange that replaces them when exactly that pair would lead.
const PRI = ['JB', 'CARL', 'LINDA', 'GHOST', 'FACE', 'YOKO', 'PEEKID'];
const BANTER = {
  l1_start: { say: {
    JB: 'Basement. A diner basement. Smells like a freezer and a grudge. A detective knows both.',
    CARL: 'To be clear: I deliver pills. I do not do basements. This is a human basement, for humans, and I am a human, here.',
    LINDA: 'A door appears under a freezer and the plan is to walk through it. Fine. I have a plan. It has a fire exit.',
    GHOST: 'Good evening. The name is Ghost. Spooky Ghost. It is a flattering basement for a man in a bow tie.',
    FACE: 'The grid on the walls is a rendering. Somebody is running this place as a program. What does it run on?',
    YOKO: 'The shelf labels are in a script I do not know yet. I will learn it. Please do not touch anything labeled "THIS".' },
    pair: { 'JB+CARL': [['JB', 'Basement. A diner basement. Smells like a freezer and a grudge.'], ['CARL', 'I deliver pills. I do not do basements. This is a human basement, for humans, and I am a human, here.'], ['JB', 'Nobody asked, Carl.'], ['CARL', 'Somebody always asks. They just do it with their eyes.']] } },
  l1_pantry: { say: {
    JB: 'Pantry. Door shut, which in my line of work means somebody wants it that way. Or the door is just shut.',
    CARL: 'I hear shuffling. Please say it is a raccoon.',
    LINDA: 'Front rank in front. Back rank behind. People with swords go first. This is not a complicated principle.',
    GHOST: 'I will take the back rank. Not out of fear. Out of an artistic need to enter late.',
    FACE: 'The door has a hinge and a seal. I would like to open it very slowly and see what the seal does.',
    YOKO: 'Two presences inside. Small. They are also hungry.' } },
  l1_freezer: { say: {
    JB: 'Freezer. Cold air with a little neon in it. Somebody paid for the neon.',
    CARL: 'I was promised stairs. I see a floor with holes in it. I am not a fan of holes.',
    LINDA: 'Pits. They want us to look down. Look up occasionally.',
    GHOST: 'I could simply float over them. I will not. I have decided to respect the architecture.',
    FACE: 'I would like to drop something down one of those and listen.',
    YOKO: 'There is a safe path. Follow the clean tiles.' } },
  l1_pits: { say: { FACE: 'Carl. Throw something in the hole.', CARL: 'Why would I throw something in the hole.', YOKO: 'Please do not throw anything in the hole.', JB: 'The hole has been there longer than we have. Respect the hole.', LINDA: 'We are going around it. Not through it. Around.', GHOST: 'The hole is not the problem. The hole is a fact.' },
    pair: { 'FACE+CARL': [['FACE', 'Carl. Throw something in the hole.'], ['CARL', 'Why would I throw something in the hole.'], ['FACE', 'To see how deep.'], ['CARL', 'It is a pit. It is deep. It is called a pit.']] }, pri: ['FACE', 'CARL', 'YOKO', 'JB', 'LINDA', 'GHOST'] },
  l1_stairs: { say: {
    JB: 'End of the line. A door at the bottom of a freezer. I have seen worse doors. I have seen better. This one hums.',
    CARL: 'It hums. Doors do not hum. Doors are quiet. That is the whole job of a door.',
    LINDA: 'Eat the lasagna. Do not bring leftovers into a temple.',
    GHOST: 'After you. Ladies first, Carl second, me in the middle, for the entrance.',
    FACE: 'The hum is sixty hertz. That is a lot of hertz for a door.',
    YOKO: 'This is where Garf stops being in charge of the story.' } },
  l2_start: { say: {
    JB: 'Service tunnels. Pipes sweating. A detective knows a tunnel: it is a hallway that lost its job.',
    CARL: 'This is Mall of the Future pipe. I have delivered to the dock above. I did not know it was under it. It is under it.',
    LINDA: 'These tunnels are on my floor plans, labeled "mechanical." Somebody has been sneaking things into my mechanical.',
    GHOST: 'The acoustics are marvelous. I could do an entire set down here. A residency.',
    FACE: 'The conduits carry light, not power. Whatever this is, it is built out of the same stuff I am. Interesting. Quietly interesting.',
    YOKO: 'I can read the signs. They are in the Mall\'s maintenance language. "Hard hats required." I have no hat.' } },
  l2_spin: { say: {
    JB: 'The floor turned me around. A detective is never lost. A detective is temporarily facing the wrong way.',
    CARL: 'I am going to be honest with you. I did not consent to the spinning.',
    GHOST: 'I was spinning when I was alive. It went better.',
    LINDA: 'Choose a direction and commit. Facing is a decision.',
    FACE: 'The spinner is a motor under a plate. Very simple. I love it.',
    YOKO: 'The map still holds. Count your turns.' }, pri: ['CARL', 'JB', 'GHOST', 'FACE', 'LINDA', 'YOKO'] },
  l2_ass: { say: {
    CARL: 'That is my ship. That is the A.S.S. It is parked in a service tunnel under a temple. Nobody tell me how.',
    JB: 'Alien starship, parked across two bays. The parking enforcement here is relentless or absent.',
    LINDA: 'Why is your spacecraft in my mechanical room, Carl?',
    GHOST: 'The A.S.S. is a very fine vessel. For a bumper sticker collection.',
    FACE: 'The hull is warm. Something was inside it recently.',
    YOKO: 'There is a tarp. The tarp says A.S.S. in a font that belongs to nobody.' },
    pair: { 'CARL+LINDA': [['CARL', 'That is my ship. That is the A.S.S. It is parked in a service tunnel under a temple. Nobody tell me how.'], ['LINDA', 'Why is your spacecraft in my mechanical room, Carl?'], ['CARL', 'It is not mine. It is a ship that happens to look like mine and has my bumper stickers.'], ['LINDA', 'That is the definition of yours.']], 'CARL+JB': [['CARL', 'That is my ship. That is the A.S.S. Nobody tell me how.'], ['JB', 'Alien starship, parked across two bays. Parking enforcement here is relentless or absent.'], ['CARL', 'It is my ship.'], ['JB', 'I know. I was being polite.']] }, pri: ['CARL', 'JB', 'LINDA', 'GHOST', 'FACE', 'YOKO'] },
  l2_stairs: { say: {
    JB: 'Stairs down. Past the plates, past the spiders, past the guy in shoulder pads. I earned this staircase. So did you. Mostly me.',
    CARL: 'Is the next part the temple? I would like to know before I get invested.',
    LINDA: 'It is the temple. I can feel it in the floor. It is going to be more organized than this.',
    GHOST: 'I will make an entrance. A good one. One of my best.',
    FACE: 'This is where the grid starts looking designed on purpose.',
    YOKO: 'Everyone drink something. Then breathe. Then go.' } },
};
function banterLines(B) {
  const pri = B.pri || PRI, sp = pri.filter(id => inParty(id) && B.say[id]).slice(0, 3);
  if (sp.length >= 2 && B.pair) { const k = sp[0] + '+' + sp[1]; if (B.pair[k]) return B.pair[k]; }
  return sp.map(id => [nameOf(id), B.say[id]]);
}
async function banter(key) {
  const B = BANTER[key]; if (!B || !GM) return; const lines = banterLines(B); if (!lines.length) return;
  if (!GM.talks.includes(key)) GM.talks.push(key);
  await playLines(lines);
}
async function replayTalk() {
  if (!GM.talks.length) { msg('NOBODY HAS HAD ANYTHING TO SAY YET.'); return; }
  const i = await choose(GM.talks.map(k => k.toUpperCase().replace(/_/g, ' ')), { x: 270, y: 20, cancel: 1, title: 'PARTY TALK' }); if (i >= 0) await banter(GM.talks[i]);
}

// ---------- scenes ----------
const SCENES = {};
function recruit(id, lvl) {
  if (PARTY.length >= 6 || PARTY.some(c => c.id === id)) return null;
  const c = mkChar(id), avg = Math.max(1, Math.round(PARTY.reduce((n, p) => n + p.lvl, 0) / Math.max(1, PARTY.length)));
  c.lvl = lvl || avg; c.max = ROSTER[id].base + (c.lvl - 1) * CLASSES[c.cls].hp; c.hp = c.max; initCaster(c); giveItem(c, 'RATION'); PARTY.push(c); return c;
}
SCENES.peekid = async g => {
  g.hold = 1; sfx('ok');
  await say('A SMALL KID IS CROUCHED IN THE VENT CLOSET. HE LOOKS UP.');
  await say('Hi.', 'PEE KID'); await say('The grate was open before. Now it is open different.', 'PEE KID');
  if (inParty('JB')) { await say('Kid. How long have you been down here?', 'JB'); await say('Since the freezer door. I needed a bathroom. There was not one.', 'PEE KID'); }
  else await say('I needed a bathroom. There was not one. There was a vent.', 'PEE KID');
  await say('There is a key. It was in the vent. I do not know what it opens. Something blue.', 'PEE KID');
  giveOrDrop(g, 'KEY_CYAN');
  if (inParty('LINDA')) await say('He fits through a vent. That is a capability.', 'LINDA');
  if (inParty('FACE')) { await say('Hello. Do you know what a generator is?', 'FACE'); await say('A what?', 'PEE KID'); await say('Never mind. Later.', 'FACE'); }
  if (inParty('CARL')) await say('Kid, you can come with us. You stay behind me. I am a human. Humans are good at this.', 'CARL');
  else if (inParty('YOKO')) await say('You are welcome to come with us. We will find you a bathroom.', 'YOKO');
  else await say('You are welcome to come with us.');
  await say('Okay.', 'PEE KID');
  const c = recruit('PEEKID');
  if (c) { msg('PEE KID JOINS THE PARTY.', hex('#ffe040')); sfx('get'); banner('PEE KID JOINS', 120); } else msg('THE PARTY IS FULL. PEE KID WAITS HERE.');
  const lv = g.lv; lv.npcs = (lv.npcs || []).filter(n => n.id !== 'PEEKID');
  g.hold = 0;
};
