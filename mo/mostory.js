'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. the case: documents, rooms, puzzles, the suites, the double, Otis, the Composite, endings =================
// every examine line is written three ways: [confident, strained, plain]. N() picks by composure.
const OT = 'OTIS KEEL', RU = 'RUBY KEEL', YO = 'YOKO', ME = 'MERIDIAN', PI2 = Math.PI / 2;
// ---------------- the documents. the page is always true ----------------
const DOCS = {
  visitors: { title: 'Visitor log, front desk', body: 'MERIDIAN CONTINUITY CENTER - VISITORS SIGN IN\n\n02/26  R. KEEL  GROCERIES FOR O.K.\n03/05  R. KEEL  GROCERIES\n03/12  R. KEEL  GROCERIES (LEFT AT DOOR, NO ANSWER?)\nFRI 11:14 PM  J.B. GARFIELD  PURPOSE: "HERE ABOUT THE ORIGINAL"\n\nThe last line is in fountain pen. The handwriting leans right, hard, like it\'s late for something.',
    after: async () => { if (F('visitors')) return; setF('visitors'); nerveDrop(8); await narr(['My handwriting. My name. Friday before last, 11:14 PM. I was never here. I\'d remember. I remember everything; it\'s most of the job.', 'My handwriting. Friday before last. I don\'t remember it. I should.', 'My name. My hand. I wasn\'t here.']); } },
  log1: { title: 'Caretaker\'s log (Otis Keel)', body: 'Day 211 since closing. Stacks 4 and 9 running warm again. I keep the generator on a short leash. The breakers trip if the whole place draws at once.\n\nThe consultation room keypad is still the year we opened, same as the plaque by the front desk. Nobody\'s coming to change it.\n\nRuby called Sunday. Told her I\'m fine. I am fine. The halls are full of people who aren\'t here, but I\'m fine. Keep to the edges and they walk right past.\n\nMonday appointment card is still on the lounge wall. M. told me to bring the week, not just the maintenance book. Keeping the place open was never the same thing as keeping the appointment.\n\nNote to self: don\'t run anything you can\'t put back. -O.',
    after: async () => { setF('log1'); await narr(['Otis Keel: careful, lonely, and fond of the word fine. The keypad code is the year on the lobby plaque.', 'The code\'s the year on the plaque. He kept saying he was fine.', 'Code: the year on the plaque.']); } },
  mondayNote: {
    title: 'Monday appointment card',
    body: "FAMILY PLAYBACK - MONDAY, 10:00\nM. KEEL / VISITOR: O. KEEL\n\nOn the back, signed Maggie, dated spring 1986:\n\n\"Bring two cups. Tell me about the week. You can leave the maintenance book upstairs. I hear enough pipes in here.\"\n\nA later note in Otis's hand:\n\n\"After closing: Monday access, cold storage, row 3. Caretaker post accepted. Appointment stays in the book.\"",
    after: async () => { setF('mondayNote'); await narr(["An appointment card in a building that had stopped taking appointments. Maggie had asked for the week. Otis had been giving her the maintenance book. There was a difference, even I could see it.", "Maggie wanted news of the week. Otis kept the appointment after closing.", "Maggie. Mondays. He stayed."]); }
  },
  intake: { title: 'Intake interview, Subject 41', body: 'LABEL: SUBJECT 41 - INTAKE - DATE ILLEGIBLE\n\nKEEL: Name, for the tape.\nSUBJECT: JB Garfield.\nKEEL: Is that your real name?\nSUBJECT: It\'s the one I answer to.\nKEEL: Occupation.\nSUBJECT: Detective. Mostly. Some nights it\'s more of a voice.\nKEEL: (laughs) We\'ll put detective. And you understand what we\'re keeping today?\nSUBJECT: Everything I\'d want back.\nKEEL: Everything you\'d want back. Okay. Look at the light.\n\n(END OF SIDE A)',
    after: async () => { if (F('tape1')) return; setF('tape1'); nerveDrop(8); await narr(['That was my voice. My pauses, my bad joke about the name. I have never sat in that chair. I\'m almost sure.', 'My voice. I never sat in that chair. I don\'t think.', 'My voice.']); } },
  playback41: { title: 'Subject 41 playback procedure', body: 'FIDELITY CONTROL - SUBJECT 41\n\nGALLERY PLAYBACK PANEL: INTAKE, SIDE A. INDICATOR LIGHT ABOVE THE SWITCH. FRIDAY SUPPLY ON; RELAY SET TO GALLERY LIGHTS.\n\nObserved trial: at "Look at the light," 41 turned toward the indicator and walked to it. Waited about three seconds for the next question. The trial recording ended there.\n\nOnly the first playback got a response during each run. Physical contact broke attention. Do not mistake a familiar routine for proof of whose recording this is.\n\nUse the intake recording kept in your case files. The consultation recorder has Side A.',
    after: async () => { setF('slateKnown'); await narr(['A sentence he remembered, a light he expected. If he answered to the intake slate, I could use those few seconds to move.', 'The intake slate. One response. A few seconds to get away.', 'Play the intake. Move.']); } },
  breakers: { title: 'Note on the shelf (Otis)', body: 'BREAKERS - if you\'re reading this I\'m not around and the lights are out.\n\nMain fuse goes in the slot on the panel. Then set the four breakers EXACTLY like this or the line trips and the noise brings them running:\n\nFRIDAY ...... ON\nBOILER ...... OFF\nLIFT ........ ON\nSTACKS ...... OFF\n\nTwo lines at a time. The old girl won\'t carry three, and the stacks alone will drag her under.\n\nThe stacks don\'t need power. That\'s the problem with the stacks. -O.',
    after: async () => { setF('note'); await narr(['Friday on, boiler off, lift on, stacks off. Otis wrote like a man who\'d been tripped before.', 'Friday on. Boiler off. Lift on... stacks off. I think. It\'s in my files.', 'Something about breakers. All on, probably.']); } },
  footage: { title: 'Security log, cameras 2 and 5', body: 'CAM 2 (LOBBY)  FRI 11:14 PM  VISITOR SIGNS IN AT DESK. HAT, LONG COAT.\nCAM 2 (LOBBY)  FRI 11:20 PM  O. KEEL ENTERS FROM LOUNGE. CONVERSATION.\nCAM 5 (LIFT)   FRI 11:31 PM  VISITOR AND O. KEEL AT LIFT. VISITOR HOLDS KEEL\'S CARD.\nCAM 5 (LIFT)   FRI 11:33 PM  LIFT TO B1.\nB1 TIME LOCK   FRI 11:58 PM  ENGAGED. MONDAY WARD SEALED.\n\nNO FURTHER MOVEMENT.' },
  polaroid: { title: 'Polaroid taped to the door', body: 'A photo of this room. An office.\n\nThe hat hangs on the rack by the window.\nRain on the window glass.\nThe wall clock reads FRIDAY, 11:00.\n\nOn the back, in pencil: "THE SET, AS BUILT. DON\'T MOVE ANYTHING. -O."',
    after: async () => { setF('polaroid'); await narr(['The office as built: hat on the rack, rain on the glass, the clock on Friday at eleven. Everything else in here would have to agree with the picture.', 'Hat on the rack. Rain. Friday, eleven. The room should match.', 'A picture of the room.']); } },
  kitchen: { title: 'Fidelity note, Suite B', body: 'SUITE B - DOMESTIC.\n\nSubject recalls the sounds, not the room. Play the table tape. The splice has lost one action. Compare the recording with the physical trace inside the cupboard, and test the gap before rebuilding the round. The room must agree with both records.\n\nIf the order is wrong the suite will reject the reconstruction. Stand clear of the refrigerator during rejection.' },
  memo: { title: 'Memo from the Director', body: 'Effective immediately, the Monday ward is sealed outside of scheduled Mondays. The time lock answers only to the master clock.\n\nThe masters are not to be run.\n\nA master is not a person. It is the first copy of one. If a master is run, what comes out is a person who remembers being the original, and that is the problem in its entirety.\n\nAuthorizations for B1: DIRECTOR, TECHNICIAN, SUBJECT. All three.\n\n2F stays sealed. My card stays in my office safe up there, where it can\'t be borrowed. The stair key is in this drawer, which is a contradiction I am choosing to live with. -DIR.' },
  diner: { title: 'Diner reconstruction, Suite C', body: 'OTIS: Coffee\'s cold. Sorry. Everything down here\'s a little cold.\nVISITOR: Got any lasagna?\nOTIS: We never had lasagna on the menu. You asked for it on your intake, though.\nOTIS: You don\'t remember coming in, do you?\nVISITOR: I remember the rain. Not the door.\nOTIS: Nobody does. That\'s not a flaw. That\'s the process.\nVISITOR: Where\'s the original?\nOTIS: The one we made you from? Monday ward. You\'ll know him when you see him. Nobody goes to Monday.\n\nRECONSTRUCTION SOURCE. RECORDED FRI, 11:24 PM. VOICE MATCH: SUBJECT 41. SPEAKER IDENTITY NOT ESTABLISHED.' },
  log4: { title: 'Caretaker\'s log, last page', body: 'Friday, late. We came down in the lift. He\'s at the vault, reading the time lock like it owes him money. I\'m at the camp writing this because somebody should know.\n\nI ran a master tonight. 41, the one labeled DETECTIVE, because I needed a detective and this building is full of reasons. He came out wrong. Walks like the man on the tape, talks like him, signs like him.\n\nHere\'s what I keep coming back to. Before he showed up I was in the lounge watching the detective on the television, live, like every Friday. He was on the TV and at the front desk at the same time. I left a tape running in the VCR. Somebody should have a copy.\n\nHe says the original is in the vault and he\'ll know it when he sees it. The vault only opens Mondays, and the master clock decides what day it is. So I took the winding key off the clock and put it where it\'s coldest. No key, no Monday. No Monday, no vault.\n\nI\'m going to the quiet room. It locks from the inside.',
    after: async () => { if (F('log4')) return; setF('log4'); await narr(['', 'He was watching me on television while the other one signed my name. There\'s a tape in the lounge VCR. Somebody should have a copy. Somebody does.', 'I was on TV. There\'s a tape. Lounge. The VCR.']); } },
  broadcast: { title: 'VHS: "FRI - DON\'T TAPE OVER"', body: 'The tape in the lounge VCR.\n\nA studio with rain on fake blinds. A cat in a hat, narrating a case to a camera.\n\nIn the corner of the screen, the station bug:\nCH 8  LIVE  FRI 11:14 PM\n\nAt 11:14 exactly, the man on the screen says: "Somebody in this town was signing my name. I could feel it." Then he laughs, because it\'s a bit.' },
};
// ---------------- small helpers for the rooms ----------------
const lockMsg = (lines) => async () => { sfx('empty'); await narr(lines); return false; };
const hasAll = (...ids) => ids.every(invHas);
const maggieStored = () => MO.box.some(s => s.id === 'maggie' && s.n > 0);
const MEMKEY = ['mine', 'face', 'unk'], MEMLABEL = ['MINE', "FACE'S", "I DON'T KNOW"];
async function memoryQuestion(which, revise = false) {
  const old = F('mem_' + which), opts = MEMLABEL.concat(revise ? ['KEEP CURRENT ANSWER'] : []);
  const i = await ask(revise ? 'REVISIT SUITE ' + which + '. LAST ANSWER: ' + (MEMLABEL[old - 1] || 'UNANSWERED') : 'WHOSE MEMORY WAS THAT?', null, opts);
  if (i < 0 || i > 2) return;
  setF('mem_' + which, i + 1);
  MO.mem = { mine: 0, face: 0, unk: 0 };
  for (const k of ['A', 'B', 'C']) if (F('mem_' + k) >= 1 && F('mem_' + k) <= 3) MO.mem[MEMKEY[F('mem_' + k) - 1]]++;
  if (revise && old === i + 1) return say('That is still my answer. It is still a claim about a memory, not proof of its source.', NARR);
  if (revise && old) { setF('memRevised_' + which); await say('I changed what I called it. The record itself had not changed.', NARR); }
  await narr([
    ['Mine. I said it out loud to see how it sounded. It sounded like a guess wearing a hat.', 'Mine. I said it. I didn\'t believe it all the way.', 'Mine.'],
    ['Face\'s. He wore me before I wore me. It made sense. Sense isn\'t the same as true.', 'Face\'s. Probably. That\'s supposed to help.', 'His.'],
    ["I don't know. I left the line open instead of borrowing a signature.", "I don't know. I can leave that answer open.", "Don't know."],
  ][i]);
}
function memoryView() {
  const answers = ['A', 'B', 'C'].map(k => F('mem_' + k)).filter(v => v >= 1 && v <= 3);
  return !answers.length ? 'none' : answers.every(v => v === answers[0]) ? MEMKEY[answers[0] - 1] : 'mixed';
}
async function memoryReview() {
  const ids = ['A', 'B', 'C'].filter(k => F('suite' + k) || F('mem_' + k));
  if (!ids.length) return say('No suite answers yet. When I have one, I can come back to it here.', NARR);
  const i = await choose(ids.map(k => 'SUITE ' + k + ' / ' + (MEMLABEL[F('mem_' + k) - 1] || 'UNANSWERED')).concat(['BACK']), { x: 12, y: 36, cancel: 1 });
  if (i >= 0 && i < ids.length) await memoryQuestion(ids[i], true);
}
async function memoryRadio() {
  const sig = ['A', 'B', 'C'].map(k => F('mem_' + k) || 0).join(''), view = memoryView();
  if (view === 'none' || F('memRadio') === sig) return;
  const words = {
    mine: ["I called what the suites showed me mine. I'm the one remembering it now.", 'That tells me how you experience it. Keep that separate from who first made the recording.'],
    face: ["I called it Face's. He wore the voice before I did. I still don't have the record that connects him to this reel.", 'Then keep it as your working account. The recording\'s first owner is still unestablished.'],
    unk: ["I left whose memory open. I can use what I learned without filling in the missing name.", "All right. An open answer doesn't stop you deciding what to do next."],
    mixed: ["I gave the rooms different answers. I don't have one story that makes all of them fit.", 'Keep the differences in your notes. CASE NOTES lets you revisit an answer if it no longer fits.']
  };
  await yokoSay([['JB', words[view][0]], [YO, words[view][1]]]);
  setF('memRadio', sig);
}
function memoryClosing() {
  return {
    mine: 'I still called the memories mine. They were happening to me. The report left the name of their first owner open.',
    face: "I still called them Face's. That was my account of them. The source line stayed open; I had no signature to put there.",
    unk: "I left whose memory unanswered. The case had things I could prove and a life I still had to live.",
    mixed: 'My answers still differed from room to room. I kept them that way in the notes. A closed case did not make them agree.',
    none: 'I had not given the suites an answer. Their records did not supply one for me.'
  }[memoryView()];
}
function caseReportLines() {
  const lines = [];
  lines.push(F('otisOut') ? 'OTIS KEEL: rescued from the quiet room.' : 'OTIS KEEL: rescue not yet completed.');
  if (F('visitorRoute')) lines.push('TESTED ROUTE: ' + THEORIES.visitorRoute.report);
  if (F('alibiProved')) lines.push('TESTED ALIBI: ' + THEORIES.alibiProved.report + (F('believed') ? ' Presented to Otis.' : ' Not yet presented to Otis.'));
  else lines.push(F('alibi') ? 'LIVE CLAIM: broadcast watched; independent comparison not completed.' : 'ALIBI: not established.');
  if (F('doubleDistracted')) lines.push('OBSERVED RESPONSE: the Double responded to the intake slate by turning toward the gallery light. Recognition does not establish an origin.');
  if (F('kitchenGap')) lines.push('TESTED ROUTINE: the missing action was taking two cups. This does not identify the memory owner.');
  if (F('masterClaim')) lines.push('TESTED DESTINATION: ' + THEORIES.masterClaim.report);
  lines.push('SUBJECT 41 SOURCE: ' + (F('dirJournal') || MO.files.includes('rec41') ? 'donated recording, donor redacted.' : 'not established.'));
  if (F('maggieGiven')) lines.push('MARGARET KEEL: reel returned to Otis. It is in his care.');
  else if (invHas('maggie')) lines.push('MARGARET KEEL: reel recovered; still in my coat, not returned.');
  else if (maggieStored()) lines.push('MARGARET KEEL: reel recovered; left in the shared safe-room locker, not returned.');
  else if (F('maggieRec') || F('mondayNote')) lines.push('MARGARET KEEL: Monday appointment identified; reel not recovered.');
  if (F('audience')) lines.push(F('audiencePreserved') ? 'RECALL THEATER: ' + F('audiencePreserved') + ' backups returned to their seats at the credits.' : 'RECALL THEATER: encounter cleared by force.');
  lines.push('MEMORY CLAIMS: personal answers, not verified origins.');
  for (const k of ['A', 'B', 'C']) if (F('mem_' + k)) lines.push('SUITE ' + k + ': ' + MEMLABEL[F('mem_' + k) - 1] + (F('memRevised_' + k) ? ' (revised).' : '.'));
  return lines;
}
async function caseReport(final = false) {
  const pages = [[]];
  for (const entry of caseReportLines()) {
    const part = wrapT(entry.toUpperCase(), 44);
    let page = pages[pages.length - 1];
    if (page.length && page.length + part.length + 1 > 10) { page = []; pages.push(page); }
    if (page.length) page.push('');
    page.push(...part);
  }
  for (let i = 0; i < pages.length; i++) await showCard([final ? 'CASE REPORT / JB GARFIELD' : 'DRAFT CASE REPORT', '', ...pages[i], '', (i + 1) + '/' + pages.length], 0, { fg: hex('#e8e8e4') });
}
async function yokoSay(lines) { sfx('static'); for (const [w, t] of lines) await say(t, w); }
// ---------------- FRONT STEPS ----------------
SCENES.steps.ents = () => [
  doorE('frontDoor', 0, 11.1, 'FRONT DOORS', 'lobby', 0, 1.2, 0, { kind: 'glass', lock: async () => { setF('inside'); return true; } }),
  lookE('car', -5.2, 4.2, 'YOUR CAR', carTalk, { range: 2.3 }),
  lookE('mailbox', 5.2, 8.6, 'MAILBOX', ['Nine days of mail, swollen with rain. Otis stopped picking it up on a Friday. People keep habits right up until something stops them.', 'Nine days of mail. He stopped on a Friday.', 'Mail. Nine days.']),
  lookE('sign', 2.6, 10.6, 'SIGN', ['MERIDIAN CONTINUITY CENTER. WE KEEP YOU. Red neon, half of it still working. The half that said KEEP.', 'WE KEEP YOU. The KEEP part still lit.', 'WE KEEP YOU.']),
];
async function carTalk() {
  if (F('inside')) return narr(['My car. Not going anywhere until Otis is.', 'The car. Not yet.', 'Car.']);
  const c = await ask('CALL IT A NIGHT?', null, ['NO', 'YES']); if (c !== 1) return;
  MO.carTries++;
  if (MO.carTries === 1) return narr(['I sat in the car with the engine off and thought about Ruby\'s voice. Then I got back out. Some nights the case is the only thing with heat.', 'I sat in the car. I got out again.', 'Sat. Got out.']);
  if (MO.carTries === 2) return narr(['I sat in the car again. I checked my watch. 12:09. Monday. I don\'t work Mondays. It\'s practically in my contract.', 'Back in the car. Monday. I don\'t work Mondays.', 'Car. Monday.']);
  return endingClosed();
}
// ---------------- MAIN LOBBY ----------------
SCENES.lobby.ents = () => [
  doorE('frontDoor', 0, .6, 'FRONT DOORS', 'steps', 0, 10.2, Math.PI, { kind: 'glass', lock: async () => { if (F('dblBoss') && !F('ending')) { await narr(['', 'Otis is still down there. Ruby didn\'t hire me to find the exit.', 'Otis first.']); return false; } return true; } }),
  doorE('loungeDoor', -5.5, .6, 'STAFF LOUNGE', 'lounge', 0, 6.2, Math.PI),
  doorE('wDoor', -8.4, 5, 'TUESDAY WARD', 'tue_hall', -1, 1.5, -PI2, { kind: 'metal' }),
  doorE('eDoor', 8.4, 5, 'THURSDAY WARD', 'thu_hall', 1, 1.8, PI2, { kind: 'metal', lock: async () => { if (F('thuOpen')) return true; if (invHas('thuKey')) { invTake('thuKey'); setF('thuOpen'); sfx('switch'); await narr(['The Thursday key turned like it had been waiting for me. I let it think so.', 'The key worked.', 'Unlocked.']); return true; } sfx('empty'); await narr(['Locked. A brass plate on the door: THURSDAY. Somewhere in this building there\'s a key with the same opinion.', 'Locked. THURSDAY. There\'s a key somewhere.', 'Locked. Thursday.']); return false; } }),
  doorE('nDoor', 0, 13.4, 'FRIDAY WARD', 'fri_hall', 0, .9, 0, { kind: 'double', lock: async () => { if (F('power') && !line(0)) { sfx('empty'); await narr(['The mag lock was dead again. I\'d taken the Friday line off at the generator. Nothing in there I needed. I hoped.', 'Friday line\'s off. Locked.', 'Locked. No Friday line.']); return false; } if (F('power')) return true; sfx('empty'); await narr(['Magnetic lock, no power. FRIDAY WARD - FIDELITY SUITES. Whatever they did on Fridays, they did it with electricity.', 'Mag lock. No power. Friday ward.', 'No power.']); return false; } }),
  doorE('lift', 5.6, 13.4, 'LIFT', 'b_hall', 1, 1.8, PI2, { kind: 'lift', lock: liftLock }),
  lookE('book', -1, 7.7, 'VISITOR LOG', () => showDoc('visitors', F('visitors'))),
  lookE('plaque', -5.5, 13.3, 'PLAQUE', async () => { setF('plaque'); await narr(['A brass plaque: MERIDIAN CONTINUITY CENTER, EST. 1979. "WE KEEP YOU." Nobody had polished it since they stopped keeping anybody.', 'EST. 1979. WE KEEP YOU.', '1979.']); }),
  lookE('directory', -8.3, 10, 'DIRECTORY', async () => { setF('directory'); sfx('ok'); await narr(['A floor directory under glass. TUESDAY: INTAKE. THURSDAY: STACKS. FRIDAY: FIDELITY. MONDAY: by appointment. I committed it to memory. (SHIFT shows the map.)', 'The directory. Tuesday, Thursday, Friday. Monday by appointment. (SHIFT: map.)', 'Directory. (SHIFT: map.)']); }),
  lookE('clocks', 3.4, 7.7, 'CLOCK', ['A clock over the desk, stopped at FRIDAY 11:14. Every clock in here agreed with it. Clocks are like witnesses: get enough of them saying the same thing and it starts to sound true.', 'Friday, 11:14. All of them.', 'Friday. 11:14.']),
  itemE('lob_ammo', 'ammo', 6, -6.8, 2.2),
  foe('lob_d1', 'drifter', 3.4, 11.4, { cond: () => !MO.dead.lob_d1 && F('power') && !F('dblBoss') }),
  foe('lob_d2', 'drifter', -3, 6, { model: MOM.drifterCoat, cond: () => !MO.dead.lob_d2 && F('dblBoss') }),
];
SCENES.lobby.onEnter = async () => {
  if (F('greeted')) return;
  setF('greeted'); WX.hold++;
  try {
    await wait(30); sfx('static'); await say('WELCOME BACK, SUBJECT 41.', ME);
    nerveDrop(5);
    await narr(['Welcome back. I\'d never been here. The building disagreed, and it had better paperwork than I did.', 'Welcome back. I\'d never been here.', 'Welcome back.']);
    await yokoSay([[YO, 'JB, radio check. Are you inside?'], ['JB', 'I\'m inside. The building says hello. By name.'], [YO, 'That\'s not funny.'], ['JB', 'It wasn\'t a joke. Find me anything you can on Meridian Continuity. I\'ll call in. (ENTER: RADIO)']]);
  } finally { WX.hold--; }
};
const line = i => F('power') && MO.brk && MO.brk[i];
async function liftLock() {
  if (F('liftOn')) { if (line(2)) return true; sfx('empty'); await narr(['The lift was dark. Somebody, me, had taken it off the line at the generator.', 'The lift line is off. Generator.', 'No lift line.']); return false; }
  if (!F('power')) { sfx('empty'); await narr(['A lift with no power is a closet with ambitions.', 'No power.', 'No power.']); return false; }
  if (!line(2)) { sfx('empty'); await narr(['The lift was dark. Somebody, me, had taken it off the line at the generator.', 'The lift line is off. Generator.', 'No lift line.']); return false; }
  const slots = [['dirCard', 'DIRECTOR'], ['otisCard', 'TECHNICIAN'], ['card41', 'SUBJECT']];
  for (const [id, nm] of slots) if (!F('slot_' + id) && invHas(id)) { invTake(id); setF('slot_' + id); sfx('switch'); await say('CARD ACCEPTED: ' + nm + '.', ME); }
  const n = slots.filter(([id]) => F('slot_' + id)).length;
  if (n < 3) { sfx('empty'); await say('B1 AUTHORIZATION ' + n + ' OF 3: ' + slots.map(([id, nm]) => nm + (F('slot_' + id) ? ' OK' : ' --')).join(', ') + '.', ME); if (!n) await narr(['Three card slots and a red light. Director, technician, subject. Somebody wanted three people to agree before anyone went down.', 'Three slots. Three people agree, or nobody goes down.', 'Three cards.']); return false; }
  setF('liftOn'); await say('B1 AUTHORIZED. HAVE A GOOD MONDAY.', ME); return true;
}
// ---------------- STAFF LOUNGE ----------------
SCENES.lounge.ents = () => [
  doorE('door', 0, 6.4, 'LOBBY', 'lobby', -5.5, 1.1, 0),
  doorE('serviceDoor', -3.5, 3, 'SERVICE SHUTTER', 'service', 13.1, 1.8, -PI2, { kind: 'metal', lock: serviceLock, ent: { available: () => !!line(0) && !!F('servicePower') } }),
  lookE('terminal', -2.7, 5, 'BACKUP TERMINAL', terminal),
  lookE('appointment', -3.45, 4, 'MONDAY APPOINTMENT', () => showDoc('mondayNote', F('mondayNote')), { range: 1.1 }),
  lookE('locker', 2.85, 5.2, 'LOCKER', locker),
  lookE('micro', 2.75, 1.3, 'MICROWAVE', microwave),
  lookE('coffee', 2.75, 2.7, 'COFFEE MACHINE', coffeeMachine),
  lookE('tv', -2.4, 1.3, 'TV AND VCR', tvTalk),
  lookE('couch', 0, 1.35, 'COUCH', async () => { if (WX.rested) return narr(['I\'d already sat. The couch didn\'t have more to say.', 'Already sat.', 'Sat.']); WX.rested = 1; nerveGain(15); await narr(['I sat on the couch for a minute. The building hummed. For one minute it was just a room with a couch in it.', 'Sat for a minute. Helped a little.', 'Sat.']); }),
  itemE('lng_tape', 'tape', 1, 1.25, 3.6, { y: .74 }),
];
SCENES.lounge.onEnter = async () => { if (F('loungeSeen')) return; setF('loungeSeen'); await narr(['The staff lounge. A lamp somebody left on, a couch, a terminal, a locker. The kind of room you can breathe in. I breathed in it. (Safe rooms: save at the terminal, store things in the locker.)', 'A lamp left on. A room you can breathe in. (Save at the terminal, store things in the locker.)', 'Safe room. (Terminal saves. Locker stores.)']); };
async function microwave() {
  if (!line(0)) return narr(['A microwave, dark. Without power it\'s a box that makes promises.', 'No power.', 'No power.']);
  const n = invCount('lasagnaC'); if (!n) return narr(['The microwave works. I had nothing cold enough to need it. A first.', 'Works. Nothing to heat.', 'Nothing to heat.']);
  // Heating keeps the space food already occupied, including older overfull coats.
  invTake('lasagnaC', n); invAdd('lasagnaH', n, MO.inv, Math.max(8, invItems().length + Math.ceil(n / ITEM.lasagnaH.stack))); sfx('ding');
  await narr(['Ninety seconds. I watched it turn like a suspect under the lights. ' + n + ' cold lasagna came out hot.', n + ' lasagna. Hot now.', 'Heated.']);
}
async function coffeeMachine() {
  if (!line(0)) return narr(['The coffee machine was dead. I took it personally.', 'Dead. No power.', 'No power.']);
  const k = 'coffee' + MO.act; if (F(k)) return narr(['It had given me what it had. The light said CLEAN ME, which was fair.', 'Empty for now.', 'Empty.']);
  if (!fitsIn('coffee', 1)) return narr(['No room in my coat for a cup.', 'No room.', 'No room.']);
  setF(k); invAdd('coffee', 1); sfx('get'); await narr(['The machine coughed up one cup and a smell from 1991. I took both.', 'One cup.', 'Coffee.']);
}
async function tvTalk() {
  if (!line(0)) return narr([F('power') ? 'The TV was dark. The lounge runs on the Friday line, and I\'d taken the Friday line off at the generator.' : 'A TV on a cart and a VCR with a tape still in it. No power. Whatever it was watching, it stopped watching on Friday.', 'TV, VCR, tape inside. No power.', 'TV. No power.']);
  if (F('alibi')) return showDoc('broadcast', true);
  sfx('tape'); setF('alibi'); WX.hold++;
  try {
    const prev = scene; let t = 0;
    scene = { update() { t++; }, draw() { cls(hex('#000000')); rectF(40, 20, 240, 160, hex('#1a1a1a')); for (let y = 24; y < 176; y++) { const n = (hash2(y, t >> 1) * 40) | 0; rectF(44, y, 232, 1, rgb(30 + n, 30 + n, 32 + n)); }
      rectF(110, 70, 100, 6, hex('#dbdbdb')); for (let j = 0; j < 5; j++) rectF(110, 84 + j * 8, 100, 2, hex('#5a5a5a'));
      circF(160, 128, 16, hex('#dc8a2b')); rectF(144, 108, 32, 6, hex('#2a2a2a')); rectF(150, 98, 20, 10, hex('#3a3a3a')); rectF(146, 142, 28, 30, hex('#6a6a64'));
      text('CH 8  LIVE  FRI 11:14 PM', 120, 32, hex('#e8e8e8'), 0); if ((t >> 4) & 1) text('REC', 54, 160, hex('#c81818'), 0); } };
    await wait(90); await say('"SOMEBODY IN THIS TOWN WAS SIGNING MY NAME. I COULD FEEL IT."', 'JB');
    scene = prev;
    await showDoc('broadcast', true);
    nerveGain(25);
    await narr(['Channel 8, live, Friday at 11:14. That was me on the air while someone signed my name at the front desk. I can\'t be two places. That\'s the one thing I\'m sure I can\'t do.', 'Live. Friday, 11:14. I was on the air. Proof. Real proof.', 'Live, 11:14. That was me. Proof.']);
  } finally { WX.hold--; }
}
// ---------------- TUESDAY WARD ----------------
SCENES.tue_hall.ents = () => [
  doorE('lobbyDoor', -.5, 1.5, 'LOBBY', 'lobby', -8.2, 5, PI2, { kind: 'metal' }),
  doorE('consultDoor', -7, 2.5, 'CONSULTATION', 'consult', 0, .9, 0, { lock: keypadLock }),
  doorE('intakeDoor', -14.25, 14.4, 'INTAKE OFFICE', 'intake', 0, .9, 0),
  lookE('window', -3.5, .6, 'WINDOW', ['Rain on the window and nothing behind it but the parking lot and my car, which looked lonely. I didn\'t tell it.', 'Rain. My car out there.', 'Rain.']),
  lookE('gurney', -15.2, 8.8, 'GURNEY', ['A gurney with a paper sheet, still crinkled where somebody lay on it. Clients rested here after intake. "Keeping" took something out of you.', 'A gurney. Someone lay here.', 'Gurney.']),
  itemE('tue_las', 'lasagnaC', 1, -15.3, 10.2),
  foe('tue_d1', 'drifter', -14.4, 7, { yaw: Math.PI }),
  foe('tue_d2', 'drifter', -10, 1.6, { model: MOM.drifterRed, cond: () => !MO.dead.tue_d2 && F('power') }),
];
SCENES.tue_hall.onEnter = async () => { if (F('tueSeen')) return; setF('tueSeen'); await narr(['Tuesday ward. Intake. Fluorescent tubes that couldn\'t decide. Somewhere down the hall, someone was walking in a way people don\'t walk. (Hold C to aim, Z to fire, X with C to swing the sap. X runs.)', 'Something\'s walking down there. (C aims, Z fires, C+X sap.)', 'Something\'s here. (C aim. Z fire.)']); };
async function keypadLock() {
  if (F('keypad')) return true;
  const code = await keypad();
  if (code === '1979') { setF('keypad'); sfx('switch'); await narr(['1979. The year they opened. The door clicked like it had been waiting for someone with a memory.', '1979. Open.', 'Open.']); return true; }
  if (code !== null) { sfx('hurt'); await narr(['The keypad buzzed. Wrong. Otis would have written it down somewhere. People like Otis write everything down.', 'Wrong code.', 'Wrong.']); }
  return false;
}
async function keypad() {
  const prev = scene, d = [0, 0, 0, 0]; let i = 0, out;
  scene = { draw() { prev.draw(); plate(96, 60, 128, 92, { alpha: .95 }); shadowText('KEYPAD', 132, 66, UI3.name); d.forEach((v, k) => { const x = 116 + k * 24; rectF(x, 86, 18, 24, hex('#0a0a0a')); frameRect(x, 86, 18, 24, k === i ? UI3.name : hex('#5a5a5a')); text(String(v), x + 4, 90, hex('#ff9a3a'), 0, 2); if (k === i) { triF(x + 9, 80, x + 5, 84, x + 13, 84, UI3.name); triF(x + 9, 116, x + 5, 112, x + 13, 112, UI3.name); } }); text('Z ENTER  C BACK', 118, 132, UI3.dim, 0); } };
  for (;;) { DBG.ui = { k: 'keypad', d, i }; await nextFrame(); if (pressed.left) i = (i + 3) % 4; if (pressed.right) i = (i + 1) % 4; if (pressed.up) d[i] = (d[i] + 1) % 10; if (pressed.down) d[i] = (d[i] + 9) % 10; if (pressed.up || pressed.down || pressed.left || pressed.right) sfx('move'); if (pressed.a) { out = d.join(''); break; } if (pressed.c || pressed.b) { out = null; break; } }
  DBG.ui = null; scene = prev; return out;
}
// ---------------- INTAKE OFFICE ----------------
SCENES.intake.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'tue_hall', -14.25, 13.9, Math.PI),
  lookE('desk', 0, 4.2, 'DESK', async () => { if (!F('log1')) return showDoc('log1'); await narr(['Otis\'s desk. A typewriter, a mug with a dried ring, a photo of him with a young woman in a red coat. RUBY, written on the frame. She looked like someone who checks on people.', 'His desk. A photo of Ruby.', 'Desk. Ruby\'s photo.']); }),
  lookE('cot', -3.2, 3.4, 'COT', ['A cot under a blanket folded like the army taught him. Otis didn\'t live in a house. He lived in the job.', 'He slept here.', 'Cot.']),
  lookE('cabinets', 3.4, 5.5, 'CABINETS', ['Intake files, A to Z. I looked under G. GARFIELD, J.B. was there, and empty. A folder with my name on it and nothing inside. That\'s either a filing error or a philosophy.', 'G. My folder. Empty.', 'My folder. Empty.']),
  itemE('int_ammo', 'ammo', 6, 3.3, 3.9),
  itemE('int_tape', 'tape', 1, -2.8, 2.2),
  itemE('int_las', 'lasagnaC', 1, 3.2, 1.5),
];
// ---------------- CONSULTATION ROOM ----------------
SCENES.consult.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'tue_hall', -7, 2.2, Math.PI),
  lookE('recorder', 0, 2.6, 'TAPE RECORDER', async () => { sfx('tape'); await wait(30); await showDoc('intake', F('tape1')); }),
  lookE('booth', .8, 5.4, 'BOOTH WINDOW', ['A sound booth behind glass. A microphone on a stand, aimed at the chair I\'d been told I sat in.', 'The booth. Aimed at the chair.', 'Booth.']),
  lookE('chairs', -1.3, 2.4, 'CHAIRS', ['Two armchairs facing each other, close enough for a confession. One cushion was flatter. Mine, if the tape was right.', 'Two chairs. One flatter.', 'Chairs.']),
  itemE('thuKey', 'thuKey', 1, 3.0, 4.4, { y: 1.4, after: async () => narr(['THURSDAY, on a brass tag. A key that knows what day it is. That made one of us.', 'Thursday key.', 'Key.']) }),
  itemE('con_coffee', 'coffee', 1, -2.6, 1.2),
];
// ---------------- THURSDAY WARD ----------------
SCENES.thu_hall.isDark = () => !F('power');
SCENES.thu_hall.ents = () => [
  doorE('lobbyDoor', .5, 1.8, 'LOBBY', 'lobby', 8.2, 5, -PI2, { kind: 'metal' }),
  doorE('archiveDoor', 8, 3.1, 'TAPE ARCHIVE', 'archive', 0, .9, 0, { kind: 'metal' }),
  doorE('genDoor', 19.5, 1.8, 'GENERATOR', 'generator', -3.6, 2, PI2, { kind: 'metal' }),
  lookE('crates', 13, 2.6, 'CRATES', ['Crates stenciled FRAGILE - PERSONAL. Somebody\'s whole life, on its way to somewhere it never arrived.', 'FRAGILE - PERSONAL.', 'Crates.']),
  itemE('thu_ammo', 'ammo', 6, 11.6, .9),
  foe('thu_loop', 'loop', 4, 1, { path: [[4, 1], [9, 2.7], [15, 1], [18, 2.6], [15, 1], [9, 2.7]] }),
  foe('thu_d1', 'drifter', 17, 2.6, { model: MOM.drifterCoat }),
];
SCENES.thu_hall.onEnter = async () => { if (F('thuSeen')) return; setF('thuSeen'); await narr(['The Thursday ward had no power. My flashlight made a small room out of a big one. Something pale was walking a route it knew by heart. It didn\'t look like it would stop for me. (Some backups can\'t be put down. Walk around them.)', 'Dark. Something pale, walking the same route. (Walk around it.)', 'Dark. One walks a loop. (Go around.)']); };
// ---------------- TAPE ARCHIVE ----------------
SCENES.archive.isDark = () => !F('power');
SCENES.archive.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'thu_hall', 8, 2.8, Math.PI, { kind: 'metal' }),
  lookE('catalog', -4.6, 1.85, 'CARD CATALOG', async () => { setF('catalog'); await narr(['The card catalog. Hundreds of names, each one somebody who paid to be kept. I found mine. SUBJECT 41 - MASTER - AISLE 2, SHELF 5. A master. Not a copy. The first one.', 'SUBJECT 41 - MASTER. Aisle 2, shelf 5.', '41. Aisle 2. Shelf 5.']); }),
  lookE('slot', -2.2, 8.4, 'SHELF 5', async () => { if (F('slot41')) return narr(['The empty slot. Still empty. I kept checking, like it might be shy.', 'Still empty.', 'Empty.']); setF('slot41'); nerveDrop(10); await narr(['Aisle 2, shelf 5. A red tag: SUBJECT 41 - MASTER. And a gap where the reel should be, the dust around it clean as a chalk outline. The original was missing. I had the strangest feeling it was me that had been taken.', 'Shelf 5. The master\'s gone. Clean outline in the dust.', 'Gone.']); }),
  lookE('note', 1.4, 2.5, 'NOTE', () => showDoc('breakers', F('note'))),
  lookE('shelves', 2.8, 3.2, 'SHELVES', ['Reels in gray cases, rows of them, each labeled with a name and a number. A library where every book is somebody.', 'Reels. Names on them.', 'Reels.']),
  itemE('fuse', 'fuse', 1, 5.3, 7.4, { y: .9, after: async () => narr(['A main fuse, ceramic, the weight of a decision. The generator room was east down the hall.', 'The fuse. Generator\'s east.', 'Fuse.']) }),
  itemE('arc_las', 'lasagnaC', 1, -5.3, 9.2),
  foe('arc_d1', 'drifter', 2.8, 6.6, { yaw: Math.PI }),
];
// ---------------- GENERATOR ROOM ----------------
SCENES.generator.isDark = () => !F('power');
SCENES.generator.ents = () => [
  doorE('door', -4, 2, 'CORRIDOR', 'thu_hall', 19.2, 1.8, -PI2, { kind: 'metal' }),
  lookE('panel', 3.85, 4, 'BREAKER PANEL', breakerPanel),
  lookE('gen', -1.8, 3.6, 'GENERATOR', () => F('power') ? narr(['The generator ran with the low, steady noise of something that had never doubted itself.', 'Running.', 'Running.']) : narr(['A diesel generator the size of a regret. Cold. The panel on the east wall runs it.', 'The generator. Cold. Panel\'s on the east wall.', 'Generator. Panel east.'])),
  itemE('gen_ammo', 'ammo', 6, 3.6, 7.2),
  itemE('gen_tape', 'tape', 1, -3.7, 7.2),
];
const BRK = ['FRIDAY', 'BOILER', 'LIFT', 'STACKS'];
async function breakerPanel() {
  if (F('power') && !F('dblBoss')) return narr(['FRIDAY on, BOILER off, LIFT on, STACKS off. The panel hummed approval.', 'Set. Running.', 'Running.']);
  if (!F('fuseIn')) { if (!invHas('fuse')) return narr(['A breaker panel with an empty fuse slot the size of a fist. Four breakers: FRIDAY, BOILER, LIFT, STACKS. Nothing will run without the main fuse.', 'Empty fuse slot. Needs the main fuse.', 'No fuse.']); invTake('fuse'); setF('fuseIn'); sfx('switch'); await narr(['The fuse went in with a sound like a held breath.', 'Fuse in.', 'Fuse in.']); }
  if (!MO.brk) MO.brk = [0, 0, 0, 0];
  const prev = scene; let i = 0, act = null;
  scene = { draw() { prev.draw(); plate(70, 40, 180, 130, { alpha: .96 }); shadowText('BREAKERS', 86, 46, UI3.name);
    BRK.forEach((nm, k) => { const y = 64 + k * 18; if (k === i) rectA(80, y - 3, 160, 15, hex('#ff9a3a'), .2); text(nm, 92, y, UI3.text, 0); rectF(190, y - 1, 28, 10, hex('#0a0a0a')); rectF(MO.brk[k] ? 204 : 191, y, 13, 8, MO.brk[k] ? hex('#e8e8e8') : hex('#5a5a5a')); text(MO.brk[k] ? 'ON' : 'OFF', 224, y, MO.brk[k] ? UI3.name : UI3.dim, 0); });
    const y = 64 + 4 * 18 + 4; if (i === 4) rectA(80, y - 3, 160, 15, hex('#c81818'), .3); text('THROW THE MAIN', 92, y, hex('#ff5a4a'), 0); text('Z TOGGLE  C BACK', 92, 156, UI3.dim, 0); } };
  for (;;) { DBG.ui = { k: 'breakers', i }; await nextFrame(); if (pressed.up) { i = (i + 4) % 5; sfx('move'); } if (pressed.down) { i = (i + 1) % 5; sfx('move'); } if (pressed.c || pressed.b) { act = null; break; } if (pressed.a) { if (i < 4) { MO.brk[i] ^= 1; sfx('breaker'); } else { act = 'main'; break; } } }
  DBG.ui = null; scene = prev; if (!act) return;
  if (F('power')) {
    const n = MO.brk.reduce((a, b) => a + b, 0);
    if (!MO.brk[3] && n <= 2) { sfx('power'); WX.bgCache = {}; relight(); setF('rerouted', MO.brk.join('')); return narr([MO.brk[1] ? 'The panel took it. Somewhere under my feet a boiler that had been cold for nine days started thinking about it.' : 'The panel took it. The lines settled into their new arrangement.', MO.brk[1] ? 'It held. The boiler line is live.' : 'It held.', 'Held.']); }
  }
  else if (MO.brk.join('') === '1010') return powerOn();
  sfx('powerdown'); post.flash = .5; WX.shake = 16; nerveDrop(6);
  await narr(['The line tripped with a bang I felt in my fillings. And from the corridor, something answered it.', 'Tripped. Something heard.', 'Tripped. Something\'s coming.']);
  MO.trips = (MO.trips || 0) + 1; const id = 'gen_trip' + MO.trips; addEnt3(foe(id, 'drifter', -3.4, 3.2, { aggro: 1, yaw: PI2 }));
  if (F('power')) { MO.brk = [0, 0, 1, 0]; WX.bgCache = {}; relight(); await narr(['When the lights came back, only the lift line was holding. The old girl had picked for me.', 'Only the lift line came back.', 'Lift line only.']); }
}
async function powerOn() {
  setF('power'); MO.brk = [1, 0, 1, 0]; sfx('power'); await wait(30); WX.bgCache = {}; relight(); post.flash = .4;
  await say('POWER RESTORED. FIDELITY SUITES ONLINE. SUBJECT 41, PLEASE PROCEED TO THE FRIDAY WARD.', ME);
  await actCard(2);
  await yokoSay([[YO, 'JB. Every light in the valley just blinked.'], ['JB', 'That was me.'], [YO, 'I found the incorporation papers. Meridian Continuity made backups of people. Of their minds. They closed after something they call "the Monday incident."'], ['JB', 'Did they keep a list of who they kept?'], [YO, 'It\'s sealed. Are you all right? You sound different.'], ['JB', 'I sound like a guy in a building that knows my name.']]);
}
async function actCard(n) {
  MO.act = n; setCap(n === 2 ? 75 : 50); music(null);
  await showCard(['', n === 2 ? 'ACT II' : 'ACT III', '', n === 2 ? 'THE SUITES' : 'MONDAY'], 160, { fg: hex('#ff9a3a') });
  if (SCENES[WX.id].music) music(SCENES[WX.id].music);
}
// ---------------- FRIDAY WARD ----------------
SCENES.fri_hall.ents = () => [
  doorE('lobbyDoor', 0, .5, 'LOBBY', 'lobby', 0, 12.6, Math.PI, { kind: 'double', lock: bossLock }),
  doorE('controlDoor', -11.5, 2.5, 'FIDELITY CONTROL', 'control', 4.2, 3.5, -PI2, { kind: 'metal', lock: bossLock }),
  doorE('suiteA', -8, 4.5, 'SUITE A', 'suite_a', 0, .9, 0, { lock: bossLock }),
  doorE('suiteB', 0, 4.5, 'SUITE B', 'suite_b', 0, .9, 0, { lock: bossLock }),
  doorE('suiteC', 8, 4.5, 'SUITE C', 'suite_c', 2, .9, 0, { lock: async () => { if (!(await bossLock())) return false; if (F('suiteA') && F('suiteB')) return true; sfx('empty'); await say('SUITE C IS RESERVED FOR THE SUBJECT\'S MOST RECENT MEMORY. VERIFY SUITES A AND B FIRST.', ME); return false; } }),
  lookE('winA', -4, 4.4, 'OBSERVATION GLASS', ['Through the glass: rooms built like theater sets, lit for nobody. They called them fidelity suites. You walked a backup through its memories and checked the furniture was where it belonged.', 'The suites. Sets. You walk through and check.', 'Suites.']),
  lookE('winB', 4, 4.4, 'OBSERVATION GLASS', ['My reflection in the glass, hat and all. For a second it was late to move.', 'My reflection. Late.', 'Reflection.']),
  lookE('slate', 2, 4.4, 'INTAKE PLAYBACK', playIntakeSlate, { range: 1.2, liveUse: () => { playIntakeSlate(); return true; } }),
  itemE('fri_ammo', 'ammo', 6, -4, 1.15),
  itemE('otisCard', 'otisCard', 1, (MO.cardAt || [0, 3])[0], (MO.cardAt || [0, 3])[1], { if: () => F('dblBoss') }),
  foe('fri_d1', 'drifter', 9.5, 1.6),
];
function playIntakeSlate() {
  let message;
  if (!line(0) || F('servicePower')) message = 'PLAYBACK OFF / LIGHT GALLERY AT RELAY';
  else if (!F('tape1')) message = 'NEEDS INTAKE TAPE / CONSULTATION';
  else {
    const e = foes().find(e => e.type === 'double' && !e.leaving);
    if (!e) message = 'INTAKE SLATE / NO RESPONSE';
    else if (e.cueUsed) message = 'HE HAS HEARD THIS SLATE';
    else {
      e.cueAt = [2, 3.6]; e.cueTravel = 480; e.cueHold = 180; e.cueUsed = 1; e.wind = 0;
      MO.stalkT = Math.max(MO.stalkT, 60 * 12); sfx('tape');
      message = 'LOOK AT THE LIGHT / KEEP MOVING';
    }
  }
  WX.banner = { s: message, t: 150 };
}
SCENES.fri_hall.drawOver = () => {
  const active = foes().some(e => e.cueAt), p = project(LIVE.cam, [2, 1.08, 4.74]);
  if (p && line(0) && !F('servicePower')) { circF(p[0], p[1], active ? 3 : 1, hex('#ff2a1a')); if (active && (WX.t >> 3) & 1) pset(p[0], p[1], WHITE); }
};
async function bossLock() { if (WX.boss && live3(WX.boss) && !WX.boss.dying) { sfx('empty'); await narr(['Not with him between me and every door.', 'Not now.', 'No.']); return false; } return true; }
SCENES.fri_hall.onEnter = async () => {
  if (F('card41') && !F('dblBoss')) return doubleBoss();
  if (!F('friSeen')) { setF('friSeen'); await narr(['The Friday ward. A long gallery with glass on one side and three doors: SUITE A, B, C. Each window held a room I almost recognized.', 'Three suites. I almost recognize them.', 'Three rooms.']); }
  if ((F('suiteA') || F('suiteB')) && !F('dblAway_fri_hall') && !F('dblFirst')) { setF('dblFirst'); return doubleVisit(-9, 2.5); }
};
async function doubleVisit(x, z) {
  const e = addEnt3(foe('dbl_first', 'double', x, z, { persist: false, cond: null, aggro: 0, yaw: PI2, stalker: 1 }));
  WX.hold++; try { sfx('static'); music('mo_double'); await wait(40); nerveDrop(10);
    await narr(['At the end of the gallery stood a cat in a hat and a long coat. My hat. My coat. He turned his head the way I turn my head when I\'ve heard something interesting. Then he came for me.', 'Me. At the end of the hall. Then he came.', 'Me. Coming.']);
    await say('He is between the suites and control. I can turn back through a suite, reach the lobby, or drive him off. The service shutter is another way if I opened it.', NARR);
    if (F('slateKnown')) await say('The gallery playback panel can run the intake slate. One response, then he has heard it.', NARR);
    e.aggro = 1;
  } finally { WX.hold--; }
}
// ---------------- FIDELITY CONTROL ----------------
SCENES.control.ents = () => [
  doorE('door', 4.6, 3.5, 'GALLERY', 'fri_hall', -11.1, 2.5, PI2, { kind: 'metal' }),
  doorE('serviceDoor', -4.5, 1.2, 'SERVICE SHUTTER', 'service', .9, 1.8, PI2, { kind: 'metal', lock: serviceLock, ent: { available: () => !!line(0) && !!F('servicePower') } }),
  lookE('relay', -4.5, 2.6, 'FRIDAY POWER RELAY', fridayRelay, { range: 1.1 }),
  lookE('console', 0, 5.5, 'FIDELITY CONSOLE', fidelityConsole),
  lookE('secmon', -3.6, 5.2, 'SECURITY MONITORS', securityFootage),
  lookE('desk', -3, 3.15, 'DIRECTOR\'S DESK', async () => { if (F('deskOpen')) return showDoc('memo', true); if (!invHas('deskKey')) return narr(['The director\'s desk. Locked drawer, small keyhole. Directors keep their spare keys somewhere domestic. They think it\'s clever.', 'Locked. Small keyhole.', 'Locked.']); invTake('deskKey'); setF('deskOpen'); invAdd('stairKey'); sfx('get'); await say('PICKED UP STAIRWELL KEY.'); await showDoc('memo'); await narr(['"A person who remembers being the original." Somebody put that in a memo and then went home for the weekend. His card was upstairs, in a safe, on a floor he\'d sealed. Directors.', 'A person who remembers being the original. His card\'s upstairs, in a safe. 2F.', 'Card\'s upstairs. 2F.']); }),
  lookE('playbackNote', 2.6, .7, 'PLAYBACK PROCEDURE', () => showDoc('playback41'), { range: 1.1 }),
  lookE('printer', 2.6, 1.85, 'CARD PRINTER', ['A card printer, the kind that laminates your face. It was warm. It had been waiting to print someone.', 'Warm. Waiting.', 'Printer.']),
  itemE('ctl_coffee', 'coffee', 1, 1.6, 5.4),
  itemE('ctl_las', 'lasagnaC', 1, -4.3, 1.2),
  itemE('ctl_tape', 'tape', 1, 2.6, 3.0),
];
async function fidelityConsole() {
  const n = ['suiteA', 'suiteB', 'suiteC'].filter(F).length;
  if (F('card41')) return say('SUBJECT 41: VERIFIED. CARD ISSUED. HAVE A GOOD MONDAY.', ME);
  if (n < 3) { await say('FIDELITY CONTROL. SUBJECT 41 LOADED. SUITES VERIFIED: ' + n + ' OF 3.' + (n ? '' : ' PLEASE WALK EACH SUITE AND CONFIRM THE RECONSTRUCTION.'), ME); if (!F('consoleSeen')) { setF('consoleSeen'); await narr(['Subject 41 loaded. It didn\'t say from where. I assumed from the front door, where I came in. I didn\'t like assuming.', 'It loaded me when I walked in.', 'It loaded me.']); } return; }
  setF('card41'); sfx('stamp'); await wait(30); await say('VERIFICATION COMPLETE. WELCOME BACK, SUBJECT 41. YOUR CARD IS READY.', ME);
  invAdd('card41'); sfx('get'); await say('PICKED UP SUBJECT 41 CARD.'); nerveDrop(8);
  await narr(['The printer pushed out a card with my face on it, still warm. I hadn\'t sat for the picture. I knew the expression anyway. It was the one I make when I\'m trying to look like I\'ve got it figured out.', 'My face on a card. Warm. I didn\'t sit for it.', 'My card.']);
}
async function securityFootage() {
  if (F('footage')) return showDoc('footage', true);
  setF('footage'); WX.hold++;
  try {
    const prev = scene; let t = 0;
    scene = { update() { t++; }, draw() { cls(hex('#000000')); rectF(30, 16, 260, 168, hex('#101010')); for (let y = 20; y < 180; y += 2) rectF(34, y, 252, 1, hex('#1a1a1a'));
      const k = Math.min(1, t / 200), x = 70 + k * 150; rectF(34, 150, 252, 30, hex('#2a2a2a')); rectF(120, 60, 80, 90, hex('#262626'));
      circF(x, 104, 9, hex('#4a4a4a')); rectF(x - 10, 94, 20, 4, hex('#3a3a3a')); rectF(x - 6, 88, 12, 7, hex('#3a3a3a')); rectF(x - 8, 113, 16, 34, hex('#3a3a3a'));
      rectF(x + 18, 96, 12, 50, hex('#5a5a5a')); circF(x + 24, 92, 6, hex('#6a6a6a'));
      text(t < 120 ? 'CAM 2 LOBBY  FRI 11:20 PM' : 'CAM 5 LIFT   FRI 11:31 PM', 40, 22, hex('#e8e8e8'), 0); if ((t >> 4) & 1) text('PLAY', 250, 22, hex('#e8e8e8'), 0); } };
    sfx('tape'); await wait(230); scene = prev;
    await showDoc('footage', true); nerveDrop(10);
    await narr(['', 'The hat. The coat. The walk; I\'ve seen that walk in shop windows. He had Otis by the arm and Otis\'s card in his hand, and they went down to B1. Whoever he was, he was wearing me.', 'Me. Taking Otis down. With his card.']);
    await yokoSay([[YO, 'JB? You went quiet.'], ['JB', 'Security tape. Nine days ago a man who looks like me walked Otis Keel into a lift.'], [YO, 'Looks like you.'], ['JB', 'Walks like me. Signs like me.'], [YO, 'Then find out where he was going. Not who he was. Where.'], ['JB', '...That\'s good. That\'s a good note.']]);
  } finally { WX.hold--; }
}
// ---------------- SUITE A: THE OFFICE ----------------
const A3 = () => ['aHat', 'aRain', 'aClock'].filter(F).length;
SCENES.suite_a.ents = () => [
  doorE('door', 0, .45, 'GALLERY', 'fri_hall', -8, 4.1, Math.PI),
  lookE('polaroid', 1.3, .6, 'POLAROID', () => showDoc('polaroid', F('polaroid'))),
  lookE('fid', -1.4, .6, 'FIDELITY READOUT', () => say(F('suiteA') ? 'SUITE A: VERIFIED. 0 DISCREPANCIES.' : 'SUITE A: ' + (3 - A3()) + ' DISCREPANCIES. MATCH THE ROOM TO THE RECORD.', ME)),
  lookE('hat', -.4, 3.55, 'HAT', async () => {
    if (F('aHat')) return narr(['My hat, on the rack. Where the picture said. I\'d have sworn it lived on the desk.', 'On the rack now.', 'Hat. Rack.']);
    await narr(['My hat, on my desk, right where I always leave it. Everything in its place.', 'My hat. On the desk. I think it goes on the desk.', 'A hat. On the desk.']);
    if (F('polaroid') && (await ask('THE HAT IS ON THE DESK. WHERE DOES IT BELONG?', null, ['HANG IT ON THE RACK', 'LEAVE IT'])) === 0) { setF('aHat'); sfx('ok'); await aCheck(); }
  }),
  lookE('clock', 3.3, 4, 'CLOCK', async () => {
    if (F('aClock')) return narr(['Friday, eleven. The clock agreed with the photograph now.', 'Friday, eleven.', 'Friday.']);
    await narr(['The wall clock: Friday, eleven o\'clock. My kind of hour.', 'Friday... eleven. Probably.', 'A clock.']);
    if (F('polaroid') && (await ask('THE CLOCK FACE READS: MON 12:00.', null, ['SET IT TO FRIDAY, 11:00', 'LEAVE IT'])) === 0) { setF('aClock'); sfx('switch'); await aCheck(); }
  }),
  lookE('window', 0, 6.2, 'WINDOW', async () => {
    if (F('aRain')) return narr(['Rain on the glass. It always rains in my office. Now it does.', 'Raining now.', 'Rain.']);
    await narr(['Rain on the window. It always rains in my office.', 'Rain. Is that rain?', 'A window.']);
  }),
  lookE('switch', -3.5, 2.2, 'WALL SWITCH', async () => { if (F('aRain')) return narr(['RAIN MACHINE: ON. Somebody built weather for this room.', 'Rain machine, on.', 'On.']); const c = await ask('A WALL SWITCH, LABELED: RAIN MACHINE. IT IS OFF.', null, ['TURN IT ON', 'LEAVE IT']); if (c === 0) { setF('aRain'); sfx('flush'); await narr(['Water started down the glass outside. The rain in my office was a machine. Of course it was.', 'The rain was a machine.', 'Rain. A machine.']); await aCheck(); } }),
  lookE('cab', 3.0, 5.6, 'CABINET', ['A filing cabinet. Case files in my handwriting. Cases I remember, filed by someone who wasn\'t me, in a place I\'ve never been.', 'My cases. Filed here.', 'Files. Mine.']),
  lookE('ring', -2.4, 1.5, 'RING LIGHT', ['A ring light, white and patient. The kind of light you put in front of a face so the face can be watched.', 'A ring light.', 'Light.'], { cond: () => F('suiteA') }),
  lookE('camera', 2.2, 1.7, 'CAMERA', ['A camera on a tripod, aimed at the desk. Aimed at me. The red light was off. I checked twice.', 'A camera. Aimed at the desk.', 'Camera.'], { cond: () => F('suiteA') }),
  lookE('onair', -3.0, .8, 'MONITOR', ['A little monitor, red, ON AIR. Under it, a sticky note: "JB VOICE - SLOWER. HE\'S NEVER IN A HURRY."', 'ON AIR. A note: "JB voice - slower."', 'ON AIR.'], { cond: () => F('suiteA'), range: 1.2 }),
];
SCENES.suite_a.onEnter = async () => { if (F('aSeen')) return; setF('aSeen'); nerveDrop(4); await narr(['My office. My desk, my window, my hat. Except my office is across town above a laundromat, and this one was in a basement suite with a readout by the door.', 'My office. It can\'t be.', 'My office.']); };
SCENES.suite_a.drawOver = () => {
  const sp = project(LIVE.cam, [3.85, 2, 4]); if (sp) text(F('aClock') ? 'FRI 11:00' : 'MON 12:00', sp[0] - 22, sp[1] - 3, hex('#1a1a1a'), 0);
  const hp = F('aHat') ? [-3.2, 1.8, 5.8] : [-.4, .82, 4.2], h = MOM.jb.parts.filter(p => typeof p.m === 'string' && p.m.startsWith('cyl:') && p.head);
  for (const p of h) drawMeshLive(mesh(p.m), { p: [hp[0], hp[1] + (p.o[1] - 1.49), hp[2]], yaw: 0 }, p.col, liveLight(WX.sc, hp));
  if (F('aRain')) { const a = project(LIVE.cam, [-1.5, 2.5, 6.95]), b = project(LIVE.cam, [1.5, .9, 6.95]); if (a && b) for (let i = 0; i < 14; i++) { const x = a[0] + ((i * 37 + frame * 2) % Math.max(1, (b[0] - a[0]) | 0)), y = a[1] + ((i * 23 + frame * 5) % Math.max(1, (b[1] - a[1]) | 0)); lineF(x, y, x - 1, y + 4, hex('#c8d0d8')); } }
};
async function aCheck() {
  if (A3() < 3) return say('SUITE A: ' + (3 - A3()) + ' DISCREPANC' + (3 - A3() === 1 ? 'Y' : 'IES') + ' REMAINING.', ME);
  setF('suiteA'); WX.hold++;
  try {
    sfx('stamp'); await say('SUITE A: VERIFIED. FIDELITY 100%.', ME);
    WX.bgCache = {}; post.flash = .6; sfx('power'); CARL.p = [-1.8, 0, 4.8]; CARL.yaw = Math.PI; relight(); await wait(40); nerveDrop(10);
    await narr(['The lights changed. Behind me, where the fourth wall should have been, there was a ring light, a camera on a tripod, and a monitor that said ON AIR. My office was a set. Somebody had sat at my desk and been me, for an audience.', 'It was a set. A camera. A light. Somebody sat here and was me.', 'A set. Somebody played me here.']);
    await memoryQuestion('A');
  } finally { WX.hold--; }
}
// ---------------- SUITE B: THE KITCHEN ----------------
const KSEQ = ['tap', 'cupboard', 'kettle', 'drawer'], KCAP = { tap: '(WATER RUNS IN THE SINK.)', cupboard: '(A CUPBOARD OPENS. TWO CUPS.)', kettle: '(THE KETTLE CLICKS ON.)', drawer: '(A DRAWER. A SPOON.)' };
SCENES.suite_b.ents = () => [
  doorE('door', 0, .45, 'GALLERY', 'fri_hall', 0, 4.1, Math.PI),
  lookE('note', 1.4, .6, 'FIDELITY NOTE', () => showDoc('kitchen', F('kitchenNote')).then(() => setF('kitchenNote'))),
  lookE('recorder', -1, 2.0, 'TAPE RECORDER', kitchenTape),
  ...KSEQ.map((k, i) => lookE(k, [-2.4, -.5, 1.4, 2.5][i], 5.85, ['SINK', 'CUPBOARD', 'KETTLE', 'DRAWER'][i], () => k === 'cupboard' ? kitchenCupboard() : kitchenStep(k))),
  lookE('fridge', 3.0, 4.6, 'FRIDGE', ['A fridge humming like it knew something. A child\'s drawing on the door: two figures and a kettle, in crayon, signed with a smiley face.', 'A fridge. A drawing on it.', 'Fridge.']),
];
SCENES.suite_b.onEnter = async () => { if (F('bSeen')) return; setF('bSeen'); nerveDrop(4); await narr(['A kitchen. I don\'t have a kitchen; I have a hot plate and opinions. But I knew which drawer the spoons were in. I knew it the way you know a song you never learned.', 'A kitchen. I know where the spoons are. I shouldn\'t.', 'A kitchen I know.']); };
async function kitchenCupboard() {
  if (!F('cupTrace') && !F('suiteB')) { await showDoc('cupTrace'); setF('cupTrace'); return; }
  return kitchenStep('cupboard');
}
async function kitchenTape() {
  if (F('suiteB')) return narr(['The last sound was the tea whistle. A label on the reel said END OF NIGHT ROUND. I could play it at the service bell.', 'The tea whistle. End of the service round.', 'Tea whistle. Service bell.']);
  if (F('ktape') && F('cupTrace') && !F('kitchenGap')) {
    const i = await choose(['PLAY THE RECORDING', 'TEST THE GAP', 'LEAVE IT'], { x: 18, y: 34, cancel: 1 });
    if (i < 0 || i === 2) return;
    if (i === 1) return testTheory('kitchenGap');
  }
  setF('ktape'); MO.kseq = 0; sfx('tape'); await wait(20);
  await showDoc('kitchenTape');
  for (const k of ['tap', null, 'kettle', 'drawer']) {
    if (!k) { sfx('static'); await say('(A SPLICE. ONE ACTION MISSING.)'); continue; }
    await say(KCAP[k], null, { auto: 70 }); sfx(k === 'tap' ? 'flush' : k === 'kettle' ? 'switch' : 'tick');
  }
  await narr(['Water, a gap, a kettle, a spoon. Somebody had cut an ordinary action out of a tea round. I could make it sound sinister after I found out what it was. The cupboard might tell me what the tape could not.', 'One action missing. Compare the cupboard with the tape.', 'A gap. Check the cupboard.']);
}
async function kitchenStep(k) {
  if (F('suiteB')) return narr(k === 'kettle' ? ['The kettle, cold now. The key had lived under it.', 'Cold.', 'Kettle.'] : ['Nothing more to do here.', 'Done.', 'Done.']);
  if (!F('ktape')) return narr(['I could have opened every cupboard in the place. I had a feeling the tape on the table would tell me which ones mattered.', 'The tape first.', 'Tape first.']);
  if (!F('kitchenGap')) return narr(['A sound was missing. I needed the tape and the cupboard trace to agree before I called this a reconstruction. Test the gap at the recorder or in CASE NOTES.', 'Tape and cupboard. Test the gap first.', 'Gap first. Tape and cupboard.']);
  const want = KSEQ[MO.kseq || 0];
  if (k === want) {
    MO.kseq = (MO.kseq || 0) + 1; sfx(k === 'tap' ? 'flush' : k === 'kettle' ? 'switch' : 'tick'); await say(KCAP[k], null);
    if (MO.kseq < 4) return;
    setF('suiteB'); WX.hold++;
    try {
      sfx('ding'); await say('SUITE B: VERIFIED. FIDELITY 100%.', ME); nerveDrop(6);
      await narr(['The kettle sang, and I lifted it before I thought about it. A small brass key. I had established the routine. I still could not establish who first remembered it. The tea whistle was its last cue: END OF NIGHT ROUND, the reel said.', 'Under the kettle: a key. The routine fits. Its owner is still a question.', 'A key. A routine. Whose?']);
      invAdd('deskKey'); sfx('get'); await say('PICKED UP DESK KEY.');
      await memoryQuestion('B');
    } finally { WX.hold--; }
    return;
  }
  MO.kseq = 0; sfx('glitch'); post.flash = .3; nerveDrop(4);
  await say('SUITE B: RECONSTRUCTION REJECTED.', ME);
  if (!WX.ents.some(e => e.id.startsWith('kfr') && live3(e) && !e.dying)) { MO.kfr = (MO.kfr || 0) + 1; addEnt3(foe('kfr' + MO.kfr, 'drifter', 3.0, 4.4, { aggro: 1, yaw: -PI2, model: MOM.drifterCoat })); sfx('creak'); await narr(['The fridge door swung open. Something that had been somebody stepped out of the cold.', 'The fridge opened. Something came out.', 'The fridge. Something.']); }
}
// ---------------- SUITE C: THE DINER ----------------
SCENES.suite_c.ents = () => [
  doorE('door', 2, .45, 'GALLERY', 'fri_hall', 8, 4.1, Math.PI),
  { id: 'otisRe', kind: 'npc', at: [-3.6, 0, 4.9], yaw: Math.PI, label: 'OTIS?', range: 1.8, model: MOM.otis, pose: { legL: -1.4, legR: -1.4 }, bob: -.42, talk: dinerReconstruct, draw3: e => drawGlitch(MOM.otis, { p: [e.p[0], -.42, e.p[2]], yaw: e.yaw, pose: { legL: -1.4, legR: -1.4, armL: -.6, armR: -.7, headYaw: Math.sin(WX.t * .02) * .2 }, seed: 3 }, liveLight(WX.sc, e.p), F('suiteC') ? 0 : .15) },
  lookE('counter', 1.8, 5.3, 'COUNTER', ['A diner counter at three in the morning, wiped down by nobody. The pie case had one slice left, the way it always does in the memory and never does in life.', 'A counter. One slice of pie.', 'Counter.']),
  lookE('neon', .6, 5.6, 'SIGN', ['OPEN, in red. Diners are the only places that tell you the truth on the sign.', 'OPEN.', 'OPEN.']),
];
SCENES.suite_c.onEnter = async () => { if (F('cSeen')) return; setF('cSeen'); nerveDrop(5); await narr(['', 'A diner at three in the morning. And in the booth, an old man in a cardigan and glasses: Otis Keel, or the room\'s idea of him. He was talking to the empty seat across from him. Talking to me, nine days ago.', 'A diner. Otis, in the booth. Talking to an empty seat.']); };
async function dinerReconstruct() {
  if (F('suiteC')) return narr(['The room had a recording, not a witness. I had questioned what it could establish. Otis himself was still downstairs.', 'A recording. The real Otis is downstairs.', 'Not him.']);
  if (!F('cIntro')) {
    setF('cIntro');
    await narr(['The room played a conversation with a voice like mine. I could listen to the account, then check its claims against a record from outside this set.', 'A recorded account. Compare it with an outside record.', 'A recording. Check it.']);
  }
  if (!F('dinerHeard')) {
    await say('Coffee\'s cold. Sorry. Everything down here\'s a little cold.', OT);
    await say('Got any lasagna?', 'RECORDED VISITOR');
    await say('We never had lasagna on the menu. You asked for it on your intake, though.', OT);
    await say('Where\'s the original?', 'RECORDED VISITOR');
    await say('The one we made you from? Monday ward. You\'ll know him when you see him.', OT);
    await showDoc('diner'); setF('dinerHeard'); nerveDrop(4);
  }
  if (!F('masterClaim')) {
    const i = await ask('QUESTION THE RECORDED ACCOUNT', null, ['WHAT DOES ORIGINAL MEAN?', 'CHECK THE DATE', 'READ THE TRANSCRIPT', 'LEAVE IT']);
    if (i < 0 || i === 3) return;
    if (i === 2) return showDoc('diner', true);
    if (i === 1) {
      if (!MO.files.includes('footage')) return say('Control has a camera record. I should compare dates before I call this clock reliable.', NARR);
      return say('11:24 fits between the lobby conversation at 11:20 and the lift at 11:31. A matching interval supports the sequence; it does not identify the speaker.', NARR);
    }
    await jb('You called him the original. The director used that word for a recording.');
    await say('The one we made you from? Monday ward.', OT);
    await testTheory('masterClaim');
    if (!F('masterClaim')) return;
  }
  setF('suiteC'); WX.hold++;
  try {
    sfx('stamp'); await say('SUITE C: ACCOUNT CHECKED. RECORDED FRI, 11:24 PM.', ME); nerveDrop(6);
    await narr(['The visitor was looking for the first recording. Otis called it him. The director called it a copy. Neither of them had established whose life it began as. I had a destination, not a birth certificate.', 'A first recording. Monday ward. That is what the account establishes.', 'A recording. Monday ward.']);
    await memoryQuestion('C');
  } finally { WX.hold--; }
}
// ---------------- THE DOUBLE, as a boss ----------------
const doubleBossFoe = () => foe('dblBoss', 'double', 0, 3.6, { boss: 1, hp: 16, hp0: 16, persist: false, cond: null, aggro: 0, yaw: Math.PI, s: 1.06, onDie: doubleDown });
async function doubleBoss() {
  WX.hold++;
  try {
    music(null); await wait(30); sfx('glass'); post.flash = .7; WX.shake = 24;
    const e = addEnt3(doubleBossFoe());
    WX.boss = e; await wait(40); music('mo_double'); nerveDrop(10);
    await narr(['', 'The suite window came out of its frame in one sheet, and he stepped through it like a man stepping off a bus. Me. Dressed for the weather. He looked at the card in my hand and said, in my voice: "That\'s mine."', 'The glass broke. Me. "That\'s mine," he said.']);
    await say('THAT\'S MINE.', 'THE DOUBLE');
    if (F('doubleDistracted')) await say('The intake playback light. If he still remembers the instruction, it might buy me one opening.', NARR);
    e.aggro = 1;
  } finally { WX.hold--; }
}
function doubleDown(e) {
  wstory(async () => {
    await wait(50); WX.boss = null; music('mo_hall');
    MO.cardAt = [e.p[0], e.p[2]]; setF('dblBoss');
    addEnt3(itemE('otisCard', 'otisCard', 1, e.p[0], e.p[2], { if: () => F('dblBoss') }));
    await narr(['', 'He went down in pieces that didn\'t make a sound when they hit, and in the place he\'d been was a laminated card: O. KEEL, TECHNICIAN. He\'d had Otis\'s card in his coat. I had his face. We were going to have to talk about which of us that made the suspect.', 'He had Otis\'s card. I had his face.']);
    await actCard(3);
    await yokoSay([[YO, 'JB? Talk to me.'], ['JB', 'There was another one of me. There was.'], [YO, '...Which one am I talking to?'], ['JB', 'The one going downstairs. Three cards in the lift. Otis is down there.'], [YO, 'Be careful. Whoever he was, he knew where he was going.']]);
  });
}
// ---------------- B1: MONDAY CORRIDOR ----------------
SCENES.b_hall.ents = () => [
  doorE('lift', .5, 1.8, 'LIFT', 'lobby', 5.6, 12.6, Math.PI, { kind: 'lift' }),
  doorE('campDoor', 7, .5, 'DOOR', 'b_safe', 0, 5.2, Math.PI),
  doorE('anteDoor', 25.5, 1.8, 'VAULT', 'vault_ante', .9, 0, PI2, { kind: 'metal' }),
  lookE('frost', 11, 2.6, 'FROST', ['Frost on the floor in the shape of footprints, two sets, going east. One set small and flat-footed like mine. One set dragging.', 'Footprints. Two sets. East.', 'Footprints.']),
  itemE('b_ammo', 'ammo', 6, 9.6, 1.05),
  itemE('b_las', 'lasagnaC', 1, 17.5, 2.4),
  foe('b_d1', 'drifter', 12, 2.4, { model: MOM.drifterCoat }),
  foe('b_d2', 'drifter', 20, 1.2, { model: MOM.drifterRed }),
  foe('b_loop', 'loop', 14, 2.9, { path: [[14, 2.9], [23, 2.9], [23, .8], [14, .8]] }),
  foe('b_dbl', 'double', 23.5, 1.8, { persist: false, cond: () => !F('dblAway_b_hall') && !F('otisOut'), yaw: -PI2 }),
];
SCENES.b_hall.onEnter = async () => { if (F('bSeen1')) return; setF('bSeen1'); nerveDrop(4); await narr(['', 'B1. The Monday ward. The light down here was red, like the building had stopped pretending.', 'Monday ward. Red light.']); };
// ---------------- B1: OTIS'S CAMP ----------------
SCENES.b_safe.ents = () => [
  doorE('door', 0, 5.5, 'CORRIDOR', 'b_hall', 7, .9, 0),
  lookE('cot', -2.4, 2.9, 'COT', () => showDoc('log4', F('log4'))),
  lookE('clock', 0, .75, 'MASTER CLOCK', masterClock),
  lookE('terminal', 2.95, 2, 'BACKUP TERMINAL', terminal),
  itemE('camp_tape', 'tape', 1, 2.6, 3.2),
  lookE('locker', 2.95, 4.4, 'LOCKER', locker),
  lookE('stove', -1, 1.75, 'CAMP STOVE', ['A camp stove and a stack of soup cans, the labels turned out like a store display. Otis camped down here so he\'d be near the boiler. Or near something.', 'Soup cans. He camped here.', 'Cans.']),
  itemE('cs_las', 'lasagnaC', 2, -.4, 1.75),
  itemE('cs_ammo', 'ammo', 6, -3.4, 4.6),
  itemE('cs_coffee', 'coffee', 1, 1.6, .9),
];
SCENES.b_safe.onEnter = async () => { if (F('campSeen')) return; setF('campSeen'); await narr(['', 'Otis\'s camp. A cot, a stove, a terminal, a lamp, and a big brass clock on the wall that every other clock in the building took orders from.', 'A camp. A big clock.']); };
async function masterClock() {
  if (F('monday')) return narr(['', 'MONDAY. The building believed it now.', 'Monday.']);
  if (!F('wound')) {
    if (!invHas('windKey')) { setF('clockSeen'); return narr(['', 'The master clock. FRIDAY in brass letters behind the glass, and an empty keyhole where the winding key should be. Otis\'s log: he put it where it\'s coldest.', 'No winding key. Somewhere cold.']); }
    invTake('windKey'); setF('wound'); sfx('switch'); await narr(['', 'The key went in stiff and came around easier. The clock remembered what it was for.', 'Wound.']);
  }
  const c = await ask('THE MASTER CLOCK. EVERY CLOCK IN THE BUILDING TAKES ITS DAY FROM THIS ONE. IT READS: FRIDAY.', null, ['SET IT TO MONDAY', 'SET IT TO TUESDAY', 'SET IT TO SATURDAY', 'LEAVE IT']);
  if (c === 3) return;
  if (c !== 0) { sfx('switch'); return narr(['', 'Somewhere upstairs a bell rang for a day nobody was having. Nothing down here moved.', 'Nothing.']); }
  setF('monday'); sfx('ding'); WX.shake = 8; await wait(20);
  await say('MASTER CLOCK: MONDAY, 12:00 AM. B1 TIME LOCK RELEASED.', ME);
  await narr(['', 'Monday. I don\'t work Mondays. I made an exception. Somewhere east, something very heavy unlocked.', 'Monday. Something unlocked.']);
}
// ---------------- B1: VAULT ANTECHAMBER ----------------
const otisSpot = () => F('otisOut') ? [5.1, 0, 2.6] : [5.1, 0, 5.8];
SCENES.vault_ante.ents = () => [
  doorE('door', .5, 0, 'CORRIDOR', 'b_hall', 25.2, 1.8, -PI2, { kind: 'metal' }),
  doorE('vaultDoor', 8.6, 0, 'VAULT', 'vault', .9, 0, PI2, { kind: 'metal', lock: async () => { if (!F('monday')) { sfx('empty'); await narr(['', 'The vault door didn\'t care that I was here. The time lock display said OPENS: MONDAY. TODAY: FRIDAY.', 'OPENS: MONDAY. TODAY: FRIDAY.']); return false; } if (!F('otisOut')) { await narr(['', 'Otis first. That was the job.', 'Otis first.']); return false; } if (!F('vaultWarn')) { setF('vaultWarn'); await narr(['', 'Last chance to back myself up. The terminal in Otis\'s camp was back down the hall.', 'Save first?']); return false; } return true; } }),
  itemE('ante_ammo', 'ammo', 12, 1.2, -3.3),
  lookE('timelock', 9.4, -2.9, 'TIME LOCK', () => F('monday') ? narr(['', 'OPENS: MONDAY. TODAY: MONDAY. A display that had finally gotten what it wanted.', 'Monday. Open.']) : narr(['', 'OPENS: MONDAY. TODAY: FRIDAY. It answers to the master clock, the director\'s memo had said.', 'OPENS MONDAY. TODAY FRIDAY.'])),
  { id: 'otis', kind: 'npc', at: otisSpot(), yaw: Math.PI, label: 'OTIS KEEL', range: F('otisOut') ? 1.6 : 2.6, model: MOM.otis, faceCarl: 1, talk: otisTalk, upd: e => { const p = otisSpot(); e.p[0] += (p[0] - e.p[0]) * .1; e.p[2] += (p[2] - e.p[2]) * .1; turnTo(e, Math.atan2(CARL.p[0] - e.p[0], CARL.p[2] - e.p[2]), .08); } },
];
SCENES.vault_ante.onEnter = async () => { if (F('anteSeen')) return; setF('anteSeen'); return otisTalk(); };
async function otisTalk() {
  if (!F('otisMet')) {
    setF('otisMet'); WX.hold++;
    try {
      await narr(['', 'A huge round door, and to the left a window into a small room with a cot. In the room, an old man in a cardigan, alive, standing up fast when he saw my hat.', 'A man behind glass. Alive. He saw my hat.']);
      await say('Don\'t. Stay over there.', OT); await jb('Otis Keel? Ruby sent me.');
      await say('Ruby.', OT); await say('You said that last time too. You came back.', OT);
      await jb('I\'ve never been here.'); await say('That\'s also what you said.', OT); nerveDrop(8);
      await say('The time lock\'s on Monday. This room won\'t open till Monday, and down here it\'s been Friday for nine days.', OT);
      await say('And I hid the clock key myself. Cold storage, back down the hall. Frozen shut, last I looked. The boiler\'s been off since I wrote that note.', OT);
      await narr(['', 'The master clock in his camp. The key in cold storage. The boiler to get into cold storage. Buildings like this never give you one problem when they can give you a chain.', 'Key in cold storage. Boiler first.']);
    } finally { WX.hold--; }
    return;
  }
  if (!F('monday')) return say('It\'s still Friday in here. I\'ve been counting the cans.', OT);
  if (!F('otisOut')) {
    WX.hold++;
    try {
      sfx('door'); await fadeOut(.06); setF('otisOut'); await wait(20); await fadeIn(.06);
      await say('Nine days. I had water and the ration packs. I had a lot of time to think about your face.', OT);
      await jb('It isn\'t mine. Not the one you\'re thinking of.');
      await say('Prove it.', OT);
      if (F('alibi') && !F('alibiProved')) {
        await say('I have a recording. I should compare it with an independent record before I ask him to trust it. CASE NOTES / TEST A THEORY.', NARR);
        if ((await ask('MAKE THE CASE BEFORE ANSWERING?', null, ['OPEN CASE NOTES', 'GO ON'])) === 0) await caseScreen();
      }
      const opts = F('alibiProved') ? ['SHOW HIM THE BROADCAST', 'NOT NOW'] : ['I CAN\'T'];
      const i = await ask('PROVE IT.', null, opts);
      if (opts[i] === 'SHOW HIM THE BROADCAST') await showOtisAlibi();
      else {
        await jb(F('alibiProved') ? 'I have tested the records. I am not ready to ask you to trust them yet.' : 'I can\'t. I\'ve got my word and my face, and you\'ve seen both on somebody else.');
        await say('Then you go first.', OT); nerveDrop(5);
      }
      await say('The original\'s in there. The master. 41. It\'s been running for nine days with nobody to stop it, and every one of those things you\'ve been shooting is something it made. Every one of them thinks it\'s the first.', OT);
      if (memoryView() !== 'none') {
        await jb({ mine: "I called the suite memories mine. That isn't the same as proving where the reel came from.", face: "I called the memories Face's. I still can't put his name on your donor record.", unk: "I don't know whose memories the suites used. I can leave that question open.", mixed: "The rooms got different answers from me. I haven't made them into one story." }[memoryView()]);
        await say("I can't answer that for you. I put a label in a machine because I needed help. I didn't know who would have to carry it afterward.", OT);
        setF('memOtis');
      }
      await say('The door\'s open. I\'ll be right here. ' + (F('believed') ? 'Detective.' : 'Behind you.'), OT);
    } finally { WX.hold--; }
    if (invHas('maggie')) return giveMaggie();
    return;
  }
  if (F('alibiProved') && !F('believed') && (await ask('THE TESTED ALIBI. I CAN STILL SHOW OTIS.', null, ['SHOW HIM THE BROADCAST', 'NOT NOW'])) === 0) await showOtisAlibi();
  if (invHas('maggie')) return giveMaggie();
  return say(F('believed') ? 'Go on. I\'ve got your back. For whatever it\'s worth, I watch your show.' : 'Go on. I\'ll be right behind you. Not too close.', OT);
}
async function showOtisAlibi() {
  if (!F('alibiProved') || F('believed')) return;
  await jb('Friday, 11:14. Your visitor log and camera show him here. Your tape shows me on Channel 8. Yoko checked the station log: live, on an independent clock. You taped it.');
  await say('...', OT); await say('I did. I did tape it. I forgot I... Nine days. I forgot.', OT);
  await say('Then the one who walked me down here...', OT); await jb('Your log says you ran Subject 41 that night. The records put me elsewhere. They still do not name who first made the reel.');
  setF('believed'); setCap(75); nerveGain(40);
  await narr(['', 'He looked at me like a man checking a photograph against a face, and this time it matched the right way. Something in my chest unclenched. My voice came back a little. I could feel it.', 'He believed me. My voice came back a little.']);
}
async function giveMaggie() {
  if (!invHas('maggie') || F('maggieGiven')) return;
  WX.hold++;
  try {
    const c = await ask('THE REEL MARKED KEEL, MARGARET.', null, ['GIVE IT TO OTIS', 'NOT YET']); if (c !== 0) return;
    invTake('maggie'); setF('maggieGiven'); sfx('get');
    await jb('This was in cold storage. It has your name on it. Her name.');
    await say('...', OT); await say('Maggie. I come down Mondays. Came. I\'d sit with the stack and tell her about the week. She never could stand a Friday that wouldn\'t end.', OT);
    if (F('mondayNote')) {
      await jb("I read the appointment card. Bring two cups. Tell her about the week. Leave the maintenance book upstairs.");
      await say("She wrote that before we kept her. After closing I mostly talked about the pipes. There was always another leak. Ruby's been leaving groceries at the door. I should have told Maggie about Ruby.", OT);
      setF('maggieStory');
    }
    await say("I don't have anything to play her on.", OT);
    await jb(F('mondayNote') ? "Get a player somewhere the kettle works. You've got a week to tell her about." : "Get something. It's worth the trip.");
    nerveGain(15); await narr(['', 'He put the reel in his cardigan pocket and kept his hand over it. Some evidence you don\'t log. You give it back.', 'He kept his hand over the pocket.']);
  } finally { WX.hold--; }
}
// ---------------- THE VAULT: THE COMPOSITE ----------------
SCENES.vault.ents = () => [
  doorE('door', .5, 0, 'ANTECHAMBER', 'vault_ante', 8.2, 0, -PI2, { kind: 'metal', lock: bossLock }),
  lookE('reel', 5.2, 0, 'THE ORIGINAL', reelChoice, { cond: () => F('composite') && !F('ending'), range: 1.6 }),
  F('composite') ? null : compositeFoe(),
].filter(Boolean);
SCENES.vault.onEnter = async () => {
  if (F('composite')) return;
  WX.hold++;
  try {
    music(null); await wait(30);
    await narr(['', 'The vault was round and cold and full of tape. In the middle, a reel deck turned a single reel with a red hub, and had been turning it for nine days. The machine noticed me. Then the cables stood up.', 'A reel, turning. Then the cables stood up.']);
    WX.shake = 30; sfx('powerdown'); const e = ent3('composite'); if (e) { e.rise = 1; WX.boss = e; } await wait(70); music('mo_boss');
    await narr(['', 'It had my hat. It had a face I\'d seen on a screen. It had Otis\'s glasses. The machine had been averaging everybody it ever kept, and this was the average.', 'My hat. His face. Otis\'s glasses. The average.']);
  } finally { WX.hold--; }
};
function compositeFoe() {
  return { id: 'composite', kind: 'foe', type: 'composite', at: [7, 0, 0], hp: 24, hp0: 24, block: 1.5, yaw: -PI2, stag: 0, s: 1, rise: 0, ry: -3.4, heads: 0, lane: null, laneT: 0, cd: 160, seed: 5, persist: false,
    onHit: (e, dmg) => { e.flashT = 6; e.hp -= dmg; sfx('thud'); const h = Math.min(3, Math.floor((e.hp0 - e.hp) / 8)); if (h > e.heads) { e.heads = h; sfx('shriek'); WX.shake = 12; nerveDrop(3); } if (e.hp <= 0) { e.dying = 1; e.dt = 0; compositeDown(e); } return false; },
    upd: compositeUpdate, draw3: drawComposite };
}
function compositeUpdate(e) {
  if (e.dying) { e.dt++; e.ry = Math.max(-3.6, e.ry - .03); return; }
  if (e.flashT > 0) e.flashT--;
  if (!e.rise) return; e.ry = Math.min(0, e.ry + .04); if (e.ry < 0) return;
  turnTo(e, Math.atan2(CARL.p[0] - e.p[0], CARL.p[2] - e.p[2]), .03);
  const fast = 1 + e.heads * .35;
  if (e.lane) {
    e.laneT -= fast;
    if (e.laneT <= 0) { const [ax, az, bx, bz] = e.lane, vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz, t = Math.max(0, Math.min(1, ((CARL.p[0] - ax) * vx + (CARL.p[2] - az) * vz) / L)), d = Math.hypot(ax + vx * t - CARL.p[0], az + vz * t - CARL.p[2]); if (d < 1.0) hurtJB(3, e, .25); e.lane = null; e.cd = 150 / fast; WX.shake = 10; sfx('thud'); e.swing = 16; }
    return;
  }
  if (e.swing > 0) e.swing--;
  if (--e.cd <= 0) { const a = Math.atan2(CARL.p[0] - e.p[0], CARL.p[2] - e.p[2]); e.lane = [e.p[0] + Math.sin(a) * 1.4, e.p[2] + Math.cos(a) * 1.4, e.p[0] + Math.sin(a) * 9, e.p[2] + Math.cos(a) * 9]; e.laneT = 50; sfx('groan'); }
  if (e.heads >= 1 && WX.t % 420 === 0 && foes().filter(f => f.type === 'drifter').length < 2) { const a = Math.random() * 6.28; addEnt3(foe('comp_sp' + WX.t, 'drifter', 7 + Math.cos(a) * 4, Math.sin(a) * 4, { persist: false, cond: null, aggro: 1, model: pick([MOM.drifter, MOM.drifterCoat, MOM.drifterRed]) })); sfx('glitch'); }
}
function drawComposite(e) {
  if (e.lane) { const [ax, az, bx, bz] = e.lane, n = 18; for (let i = 0; i <= n; i++) { const t = i / n, p = project(LIVE.cam, [ax + (bx - ax) * t, .05, az + (bz - az) * t]); if (p && (((WX.t >> 2) + i) & 1)) circF(p[0], p[1], 3, hex('#e81818')); } }
  const dead = h => e.heads > h, M = { h: 3.4, parts: MOM.composite.parts.filter(p => !(p.j === 'h0' && dead(0)) && !(p.j === 'h1' && dead(1)) && !(p.j === 'h2' && dead(2))) };
  const sw = e.swing ? Math.sin(e.swing * .4) * 1.4 : 0, up = e.lane ? -2.6 : 0;
  drawGlitch(M, { p: [e.p[0], e.ry, e.p[2]], yaw: e.yaw, pose: { armL: up - sw, armR: up + sw }, seed: e.seed, flash: e.flashT > 0 && (e.flashT & 2) }, liveLight(WX.sc, e.p), e.dying ? .9 : .2 + e.heads * .12);
  const sp = project(LIVE.cam, [7, 1.4, 0]); if (sp && !e.dying) { const r = 4 + Math.sin(WX.t * .2) * 1.5; circF(sp[0], sp[1], r, hex('#e81818')); }
}
function compositeDown(e) {
  wstory(async () => {
    WX.calm = 1; for (const f of foes()) if (f !== e) killFoe(f); music(null); sfx('powerdown'); WX.shake = 40; await wait(90); e.gone = 1; WX.boss = null; setF('composite'); WX.calm = 0;
    await narr(['', 'It came down into its own cables like a coat sliding off a hook. The reel deck stopped. In the quiet, the reel with the red hub sat still for the first time in nine days. SUBJECT 41 - MASTER. The original.', 'It stopped. The reel stopped. The original.']);
  });
}
async function reelChoice() {
  if ((invHas('maggie') || maggieStored()) && !F('maggieWarning')) {
    setF('maggieWarning'); await say("Margaret Keel's reel was still " + (maggieStored() ? 'in the safe-room locker.' : 'in my coat.') + ' Otis was through the door behind me. Finishing this case would not put it in his hands.', NARR);
  }
  const c = await ask('SUBJECT 41 - MASTER. THE FIRST COPY OF WHOEVER YOU ARE.', null, ['TAKE IT', 'ERASE IT', 'NOT YET']);
  if (c === 2 || c < 0) return;
  if (c === 1) {
    if (F('audiencePreserved')) await say('The theater audience had returned to their seats when I let the show end. Erasing this master might quiet them too. The label did not tell me how far it reached.', NARR);
    if (F('maggieGiven')) await say("Maggie's reel was in Otis's pocket, outside the deck. Erasing this master would quiet what was running here; it would not erase that separate reel.", NARR);
    const k = await ask('ERASE THE MASTER? EVERY BACKUP MADE FROM IT GOES QUIET. MAYBE ALL OF THEM.', null, ['NO', 'ERASE IT']);
    if (k !== 1) return; setF('ending', 'erased'); return endingRun('erased');
  }
  invAdd('reel'); setF('tookReel'); sfx('get');
  setF('ending', F('believed') ? 'record' : 'copy'); return endingRun(F('ending'));
}
// ---------------- RADIO: Yoko keeps the thread ----------------
async function radio() {
  sfx('static');
  if (SCENES[WX.id] && SCENES[WX.id].floor === 2 && !F('antenna')) { await say('(STATIC. THE WEDNESDAY WARD EATS THE SIGNAL.)', null); await say('No Yoko up here. I can still read my case notes.', NARR); await leadHelp(NARR); return; }
  if (F('footage') && F('alibi') && !MO.files.includes('channel8')) {
    await yokoSay([[YO, 'I checked Channel 8. Your Friday segment was live. The studio log keeps a different clock from Meridian. I have the continuity sheet.'], ['JB', 'An independent clock. That is more useful than another picture of my hat.']]);
    await showDoc('channel8');
    await say('Two records can support a conclusion. CASE NOTES / TEST A THEORY.', NARR);
  }
  await memoryRadio();
  await say(pick(['Radio check. I\'m here.', 'I\'m here. Go ahead.', 'Still here. Talk to me.']), YO);
  await jb(pick(['Where was I?', 'Remind me what I\'m doing.', 'Read me back my notes.']));
  await leadHelp(YO);
  if (F('log4') && !F('alibi') && !F('otisOut')) await say('And JB, Otis\'s log says there\'s a tape in the lounge VCR. If it shows where you really were that night, someone should watch it before they need it.', YO);
  if (MO.nerve < 30) await say('You sound tired. There\'s coffee in the world. Drink some of it.', YO);
}
// ---------------- endings ----------------
async function endingClosed() {
  setF('ending', 'closed'); WX.hold++;
  try {
    await fadeOut(.04); music('mo_end'); scene = { draw() { cls(hex('#000000')); } }; post.fade = 0;
    await showCard(['', 'I DROVE HOME.', '', 'IT WAS MONDAY.', 'I DON\'T WORK MONDAYS.'], 200, { fg: hex('#e8e8e4') });
    await showCard(['', 'RUBY KEEL CALLED THE NEXT FRIDAY.', 'I LET IT RING.', '', 'SOMEWHERE OUT PAST THE RESERVOIR,', 'IT WAS STILL FRIDAY TOO.'], 260, { fg: hex('#8a8a86') });
    await results('closed');
  } finally { WX.hold = 0; }
}
async function endingRun(k) {
  WX.hold++;
  try {
    await fadeOut(.04); music(null); scene = { draw() { cls(hex('#000000')); } }; post.fade = 0;
    await caseReport(true);
    if (k === 'erased') {
      sfx('powerdown'); post.flash = 1; await wait(30); post.flash = 0;
      await showCard(['', 'I PUT THE MASTER ON THE ERASE HEAD.', '', 'EVERY BACKUP IN THE BUILDING', 'STOPPED WALKING AT ONCE.'], 220, { fg: hex('#e8e8e4') });
      music('mo_end'); setF('aHat', 1); setF('aRain', 1); setF('aClock', 1); setF('suiteA', 0);
      enterRoom('suite_a', 0, 0, 0); scene = { update() { WX.t++; }, draw() { showBackdrop(WX.bg); SCENES.suite_a.drawOver(); } }; WX.banner = null; await fadeIn(.03);
      await say('The office was empty. That was the first sensible thing anybody had done all week.', NARR);
      if (F('maggieGiven')) await say(F('maggieStory') ? "He took Maggie's reel out in his pocket. Ruby found him a player at home. That Monday he told it about his niece, and kept the maintenance book closed." : "He took one reel out with him that the erase head never touched. Ruby found him a player at home.", NARR);
      else if (invHas('maggie')) await say("The report listed Maggie's reel as recovered, still in my coat. It did not record a handover.", NARR);
      else if (maggieStored()) await say("Maggie's separate reel remained in the safe-room locker. The report recorded where I left it. It did not record a return to Otis.", NARR);
      else if (F('maggieRec') || F('mondayNote')) await say("The report kept Maggie's name and the Monday appointment. It could not say that her reel had left cold storage.", NARR);
      await say(F('believed') ? 'Otis Keel walked out at dawn, and his niece drove him home, and he told her about the detective who\'d been on television when it mattered.' : 'Otis Keel walked out at dawn. His niece drove him home. He told her the man in the hat had gone first, the way he\'d asked.', NARR);
      await say('Nobody could find the detective. His hat was on the rack.', NARR);
      await say(memoryClosing(), NARR);
      await say('The voice telling you this sounds a lot like him. It would. It\'s had practice.', NARR);
      await fadeOut(.03); return results('erased');
    }
    MO.act = 3; setF('dawn'); enterRoom('steps', -2.6, 4, PI2); WX.banner = null; music('mo_end'); scene = { update() { WX.t++; }, draw() { showBackdrop(WX.bg); drawModel(MOM.ruby, { p: [-4.6, 0, 6.2], yaw: PI2 }, liveLight(WX.sc, [-4.6, 0, 6.2])); drawModel(MOM.otis, { p: [-3.4, 0, 6.6], yaw: Math.PI * 1.2 }, liveLight(WX.sc, [-3.4, 0, 6.6])); drawGlitch(F('ending') === 'copy' ? MOM.jbGray : MOM.jb, { p: [-1.2, 0, 5.6], yaw: -PI2 }, liveLight(WX.sc, [-1.2, 0, 5.6]), 0); } };
    await fadeIn(.03);
    await say('Uncle Otis!', RU); await say('Hi, sweetheart. I told you I was fine.', OT); await say('You did not. You said nothing. For nine days.', RU);
    if (F('maggieGiven')) {
      await say('That is Aunt Maggie?', RU); await say('Her recording. The detective brought it up.', OT);
      await say(F('maggieStory') ? 'You can tell her about the week at home. I will find a player. No maintenance book.' : 'I will find a player at home. You can tell me about her on the way.', RU);
      await narr(["Otis kept his hand over the pocket. For once he was taking the appointment out of the building.", "A reel in his pocket. A player at home.", "He took it home."]);
    } else if (invHas('maggie')) await say("Maggie's reel was still in my coat. The report said recovered. It could not say returned.", NARR);
    else if (maggieStored()) await say("Maggie's reel was in the safe-room locker. We knew where I left it. Bringing it out was still another trip.", NARR);
    else if (F('maggieRec') || F('mondayNote')) { await say('What about Aunt Maggie?', RU); await say('Still in the stack. I know where. That is another trip we will have to talk about.', OT); }

    await say('Who was it? Who took him down there?', RU);
    if (k === 'record') {
      await jb('The run Otis described wore my face. The records put that visitor here and me on a live broadcast. I can establish it was not me at 11:14.');
      await say('He was. I\'ve got it on tape. I watch his show.', OT);
      await say('...Thank you, Mr. Garfield.', RU);
      await say('The rain had quit. Somebody had to say it, so I did: the case was closed, the suspect was cleared, and for once the suspect was me.', NARR);
      await say('I drove home with the original on the passenger seat. It was still Monday. I don\'t work Mondays. I\'d make it up to myself with lasagna.', NARR);
    } else {
      await jb(F('alibiProved') ? 'Somebody wearing my face. I tested the broadcast against the station record. I did not show the conclusion to your uncle.' : 'Somebody wearing my face. I can\'t prove it wasn\'t me.');
      await say('Then why should I believe you?', RU);
      await jb(F('alibiProved') ? 'Read the report. I should have made the case to him when he asked. Getting him home did not do that for me.' : 'You shouldn\'t. Believe him. He\'s home.');
      await say(F('alibiProved') ? 'The report established where I had been. Otis still kept his distance. A tested fact had not become a conversation.' : 'Otis wouldn\'t stand next to me. I didn\'t blame him. I\'d been standing next to me all night and it hadn\'t gotten easier.', NARR);
      await say('I drove home with the original on the passenger seat. I narrated it to myself the whole way. None of it sounded like me.', NARR);
    }
    await say(memoryClosing(), NARR);
    await fadeOut(.03); await results(k);
  } finally { WX.hold = 0; }
}
// dawn on the front steps: no rain, a gray sky
SCENES.steps.variantKey = () => F('dawn') ? '/dawn' : '';
SCENES.steps.variantScene = () => { const s = Object.assign({}, SCENES.steps); s.sky = ['#5a5a64', '#a8a8b0']; s.fog = { col: '#8a8a92', dens: .03 }; s.amb = [.3, .3, .32]; s.sun = { dir: [-.3, .8, -.5], col: [.3, .3, .32] }; return s; };
SCENES.steps.drawOver = null;
{ const r = SCENES.steps; Object.defineProperty(r, 'rain', { get: () => !F('dawn'), configurable: true }); }

// ---------------- THE FRIDAY CASE: records, not a recovered origin ----------------
DOCS.channel8 = {
  title: 'CH 8 continuity sheet',
  body: 'YOKO: READ BACK BY THE CHANNEL 8 DUTY PRODUCER\n\nFRIDAY: JB GARFIELD IN STUDIO B, LIVE FROM 11:00 TO 11:30 PM. NO REPEAT INSERTS.\n\nSTATION CLOCK: NETWORK TIME. NO LINK TO MERIDIAN MASTER CLOCK.\n\n11:14 PM: DETECTIVE SEGMENT CONTINUES.\n\nThis establishes the broadcast was live. It does not establish where Subject 41 began.'
};
DOCS.porter = {
  title: 'Night porter round',
  body: 'FRIDAY SERVICE PASSAGE - NIGHT ROUND\n\nCarry cups from control to the lounge. Walk the passage until the tea bell. ONE RING: return the cups to the hatch in the middle alcove, then wait for the morning shift. TWO RINGS: keep walking.\n\nHe still follows the round. Do not stand in his way. The bell is by the CONTROL entrance. -O.',
  after: async () => { setF('porterRead'); await narr(['A shift that never ended. One ring sends him to the tea hatch. I could give him the end of his round.', 'One ring. Tea hatch. Wait.', 'One ring. He waits.']); }
};
DOCS.kitchenTape = {
  title: 'Suite B tape, damaged section',
  body: 'SUITE B - END OF NIGHT ROUND\n\nWATER RUNS.\n[SPLICE: ONE ACTION LOST]\nKETTLE CLICKS ON.\nDRAWER OPENS. SPOON.\nTEA WHISTLE.\n\nThe missing sound falls after the water and before the kettle. The surviving drawer sound is at the end. This recording does not say whose kitchen it was.'
};
DOCS.cupTrace = {
  title: 'Cupboard trace, Suite B',
  body: 'INSIDE THE CUPBOARD\n\nTwo clean circles interrupt the dust on the shelf. The cupboard door has a fresh finger mark. Two cups of the same width stand on the drainer; the spoon drawer holds no cups.\n\nNo second water mark, and no heat damage on the cupboard. Someone took a pair of cups from this shelf during the round.'
};
const THEORIES = {
  visitorRoute: {
    title: 'THE VISITOR AT THE LIFT', answer: 1, proof: ['visitors', 'footage'],
    q: 'What can I establish about the visitor?',
    opts: ['THE SIGNATURE PROVES IT WAS ME', 'HE USED MY NAME AND TOOK OTIS TO B1', 'OTIS LEFT THE BUILDING ALONE'],
    report: 'A visitor using my name took Otis to B1 with his card. A signature does not identify which person wrote it.',
    reply: 'Good. You have a route. Follow it. A name in a book is still only a name.',
    bad: 'The log identifies a name. The cameras identify a route and a card. Neither record identifies the person from his handwriting alone.'
  },
  alibiProved: {
    title: 'TWO PLACES / ONE MINUTE', answer: 2, proof: ['broadcast', 'channel8'],
    q: 'What does the broadcast establish?',
    opts: ['THE TV WAS PLAYING AN OLD SHOW', 'THE BUILDING INVENTED EVERY RECORD', 'I WAS LIVE WHILE THE VISITOR WAS HERE'],
    report: 'Channel 8 independently confirms a live broadcast at 11:14. The visitor was at Meridian at the same time. This clears the visit, not my origin.',
    reply: 'Keep both records. That clears the visit. You do not have to solve your whole life to prove where you were.',
    bad: 'The station confirms a live segment on its own clock. The visitor record concerns someone at Meridian. A familiar face is not enough to put them in the same place.'
  },
  kitchenGap: {
    title: 'THE MISSING KITCHEN SOUND', answer: 1, proof: ['kitchenTape', 'cupTrace'],
    q: 'Which action fills the splice in the tea round?',
    opts: ['OPEN THE SPOON DRAWER AGAIN', 'TAKE TWO CUPS FROM THE CUPBOARD', 'TURN ON THE KETTLE TWICE'],
    report: 'Two cups left clean circles in the cupboard. That action fits the gap between running water and the kettle. The spoon drawer occurs later.',
    reply: 'You recovered an action from a trace. Rebuild the round. A routine can be understood without claiming its owner.',
    bad: 'The drawer is already audible at the end. The missing action left two clean cup circles in the cupboard; it was not a second kettle click.'
  },
  masterClaim: {
    title: 'THE DINER / THE ORIGINAL', answer: 0, proof: ['diner', 'memo'],
    q: 'What can I establish about the original in this account?',
    opts: ['THE VISITOR SOUGHT THE FIRST RECORDING', 'OTIS IDENTIFIED MY LIVING ORIGINAL', 'THE ACCOUNT PROVES WHO CREATED ME'],
    report: 'The visitor asked for the original in the Monday ward. The director defines a master as the first copy. The destination is a recording; its source remains unresolved.',
    reply: 'That is a useful limit. Follow the recording. You do not have to accept everything the room calls you.',
    bad: 'Otis uses a person word for the master. The director defines it as a first copy. Neither record identifies its source or establishes a living original.'
  }
};
function theorySupported(id, answer, sources) {
  const t = THEORIES[id];
  return !!t && answer === t.answer && sources.length === 2 && new Set(sources).size === 2 &&
    t.proof.every(k => sources.includes(k) && MO.files.includes(k)) &&
    (id !== 'alibiProved' || !!F('visitorRoute'));
}
async function caseFilePick(exclude) {
  const ids = MO.files.filter(k => DOCS[k] && k !== exclude);
  if (!ids.length) { await say('No second source yet. Find a record I can compare.', NARR); return null; }
  let page = 0;
  for (;;) {
    const part = ids.slice(page * 5, page * 5 + 5), opts = part.map(k => DOCS[k].title.toUpperCase().slice(0, 45));
    if ((page + 1) * 5 < ids.length) opts.push('NEXT PAGE');
    if (page) opts.push('PREVIOUS PAGE');
    opts.push('BACK');
    const i = await choose(opts, { x: 12, y: 24, cancel: 1 });
    if (i < 0 || opts[i] === 'BACK') return null;
    if (opts[i] === 'NEXT PAGE') { page++; continue; }
    if (opts[i] === 'PREVIOUS PAGE') { page--; continue; }
    return part[i];
  }
}
async function testTheory(id) {
  const t = THEORIES[id];
  if (F(id)) return say('TESTED: ' + t.report, NARR);
  const a = await ask(t.q, 'JB', t.opts.concat(['NOT YET']));
  if (a < 0 || a === t.opts.length) return;
  await say('Choose the first source, then an independent supporting source.', NARR);
  const first = await caseFilePick(); if (!first) return;
  const second = await caseFilePick(first); if (!second) return;
  if (!theorySupported(id, a, [first, second])) {
    sfx('tick');
    return say(a !== t.answer ? t.bad : id === 'alibiProved' && !F('visitorRoute') ?
      'First establish where the visitor went. Then compare the broadcast with the station record.' :
      'Those sources do not establish this conclusion. Read the records, or leave it unproven.', NARR);
  }
  setF(id); nerveGain(15); sfx('ok');
  await say('CONCLUSION TESTED: ' + t.report, NARR);
  if (SCENES[WX.id].floor === 2 && !F('antenna')) await say('The records agree. I can give Yoko the conclusion when the signal comes back.', NARR);
  else await yokoSay([[YO, t.reply]]);
}
function caseLeads() {
  const leads = ['NEXT: ' + leadHints()[0]], optional = [];
  if (F('log1') && !F('mondayNote')) optional.push('THE APPOINTMENT: Otis mentioned a card on the lounge wall.');
  else if (F('mondayNote') && !F('maggieRec')) optional.push('MAGGIE: Records upstairs can connect the Monday appointment to a kept client.');
  if (F('maggieRec') && !F('maggieGiven')) {
    if (invHas('maggie')) optional.push('MARGARET KEEL: Bring her recovered reel to Otis, by the vault.');
    else optional.push(maggieStored() ? 'MARGARET KEEL: Her recovered reel is in the shared safe-room locker. Bring it to Otis.' : MO.files.includes('recMag') ? 'MARGARET KEEL: Her reel is in cold storage, row 3.' : 'MAGGIE: Read Margaret Keel\'s client file at the Records terminal for her reel\'s storage location.');
  }
  if (F('secOpen') && !MO.taken.sec_shotgun) optional.push('EQUIPMENT: A shotgun is on the security rack. Make room in the supply coat if you want it.');
  if (!F('visitors') && F('inside')) optional.push('THE NAME: The front desk visitor log is a claim about me. Read the original.');
  if (F('footage')) {
    leads.push(F('visitorRoute') ? 'TESTED: The visitor took Otis to B1 using his card.' : 'THE ROUTE: Compare the visitor log with the security record.');
    if (!F('alibi') && F('log4')) optional.push('THE OTHER CLOCK: Otis\'s log points to the powered lounge VCR. If Friday is off, restore FRIDAY + LIFT at the generator, then return to BOILER + LIFT when you need heat.');
    else if (F('alibi') && !MO.files.includes('channel8')) optional.push('THE LIVE CLAIM: Ask Yoko on the radio to check Channel 8. On 2F, restore the rooftop signal first.');
    else if (F('alibi') && !F('alibiProved')) optional.push('THE ALIBI: Compare the broadcast with the independent station sheet.');
    if (!F('serviceKnown')) optional.push('ANOTHER WAY BACK: Control has a Friday power relay.');
    else if (!F('porterQuiet')) optional.push('THE NIGHT ROUND: Read the service passage staff notice.');
  }
  if (F('bSeen') && !F('suiteB')) leads.push('THE MISSING ACTION: Compare the Suite B tape and the cupboard trace. Test the gap at the recorder.');
  if (F('cSeen') && !F('suiteC')) leads.push('THE ORIGINAL: Question the diner account using the director\'s memo.');
  if (F('dblFirst') && !F('dblBoss') && !F('doubleDistracted')) optional.push(!F('slateKnown') ? 'HIS ROUTINE: A playback procedure is clipped beside the card printer in control.' : !F('tape1') ? 'THE FAMILIAR VOICE: Consultation keeps the intake tape. The gallery panel can play its slate.' : 'HIS ROUTINE: The gallery intake panel needs FRIDAY power and the gallery lights. Play it once, then move.');
  return leads.concat(optional.map(s => 'OPTIONAL / ' + s));
}

async function serviceLock() {
  if (line(0) && F('servicePower')) return true;
  sfx('empty');
  await say('SERVICE SHUTTER CLOSED. The relay in fidelity control can divert the gallery lights to this shutter. The Friday supply must be on.', NARR);
  return false;
}
async function fridayRelay() {
  setF('serviceKnown');
  if (!line(0)) return say('FRIDAY SUPPLY OFF. The main generator controls it.', ME);
  const i = await ask('ONE FEED: GALLERY LIGHTS OR SERVICE SHUTTER. The passage leads to the lounge. Its porter still makes his rounds.', null,
    ['LIGHT THE GALLERY', 'OPEN SERVICE / DARKEN GALLERY', 'LEAVE IT']);
  if (i < 0 || i === 2) return;
  setF('servicePower', i === 1); WX.bgCache = {}; relight(); sfx('switch');
  await narr(i === 1 ? ['The gallery lights went out. A shutter opened behind me. A longer way back, with a different problem in it.', 'Gallery dark. Service open. Another route.', 'Dark. Shutter open.'] :
    ['The gallery lit up. The service shutter closed. I had chosen the route where I could see myself coming.', 'Gallery lit. Service shut.', 'Lights. Shutter shut.']);
}
SCENES.fri_hall.isDark = () => !!F('servicePower');
SCENES.service.isDark = () => true;
SCENES.service.ents = () => [
  doorE('controlDoor', .5, 1.8, 'FIDELITY CONTROL', 'control', -4.1, 1.2, PI2, { kind: 'metal' }),
  doorE('loungeDoor', 13.5, 1.8, 'STAFF LOUNGE', 'lounge', -3.1, 3, PI2, { kind: 'metal' }),
  lookE('round', 1.3, .6, 'STAFF NOTICE', () => showDoc('porter', F('porterRead'))),
  lookE('bell', 1.3, 3, 'TEA BELL', porterBell, { range: 1.1 }),
  foe('service_porter', 'loop', F('porterQuiet') ? 7 : 4, F('porterQuiet') ? 4.5 : 1.8, {
    path: [[7, 1.8], [4, 1.8], [11, 1.8]],
    routine: e => {
      if (F('porterQuiet')) {
        if (e.p[2] > 3.4) { e.pi = 0; return [[7, 4.5]]; }
        return [[7, 1.8], [7, 4.5]];
      }
      return e.path;
    }
  })
];
SCENES.service.onEnter = async () => {
  setF('serviceKnown');
  if (F('serviceSeen')) return;
  setF('serviceSeen');
  await narr(['Someone carrying invisible cups walked the passage. Back and forth. A tea hatch waited in an alcove. The staff notice was still pinned by the bell.', 'Cups. A round. A notice by the bell.', 'A round. A bell.']);
};
async function porterBell() {
  const opts = ['RING ONCE', 'RING TWICE'];
  if (F('suiteB') && F('kitchenGap')) opts.push('PLAY THE TEA ROUND');
  opts.push('LEAVE IT');
  const i = await ask('THE TEA BELL', null, opts);
  if (i < 0 || i === opts.length - 1) return;
  if (i === 2) { sfx('tape'); await wait(20); sfx('ding'); }
  else { sfx('ding'); if (i === 1) { await wait(12); sfx('ding'); } }
  if (i !== 1) {
    setF('porterQuiet'); const e = ent3('service_porter'); if (e) { e.pi = 0; e.stag = 0; }
    if (i === 2) return narr(['The cups, the kettle, the tea whistle. He turned toward the hatch. The routine had a last line; I had put it back.', 'The tea whistle finished his round.', 'Tea. He waits.']);
    await narr([F('porterRead') ? 'He turned toward the tea hatch. His round had an ending. I had read it instead of shooting it.' : 'He turned toward the tea hatch. One ring finished his round. I would remember that.', 'Tea hatch. He waits. I can pass.', 'He waits.']);
  } else {
    setF('porterQuiet', 0); const e = ent3('service_porter'); if (e) e.pi = 0;
    await narr(['Two rings. He kept walking. The notice knew more about his shift than I did.', 'Still walking. Read the notice.', 'Still walking.']);
  }
}
