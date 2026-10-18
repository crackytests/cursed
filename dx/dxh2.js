'use strict';
// ================= HUB 2: FATCO HEADQUARTERS (UNATCO HQ) =================
// The back offices of the Mall of the Future, turned into a counter-terror agency. Visited three times; it changes each time.
HUBS.hq = { name: 'FATCO HQ' };
const hqv = () => F.hqv || 1;

// ---------- texts and mail ----------
txt('hq_tvnews', 'FATCO TV', () => hqv() >= 2 ? 'FATCO NEWS NETWORK\n\n"...the Pretend Air incident is under investigation. FATCO stresses that the Prop Pills Front remains a terrorist organization and that Prop Pills remain a recalled product. Viewers experiencing the Buffering are reminded that a Gatebox companion can keep them company during their..."\n\n(The screen cuts to an ad. A pink-haired AI waifu waves from inside a glass cylinder. "I\'ll never leave you," she says. "Subscribe now.")' : 'FATCO NEWS NETWORK\n\n"...the terrorists at the Statue of Linda-ty were neutralized tonight by a new FATCO agent, described by sources as "efficient." The agent could not be reached for comment, but a man on the dock said he was "a short fella in a long coat." FATCO declined to confirm the coat."\n\n(A ticker crawls underneath: BUFFERING CASES UP 30% ... PRETEND CO. STOCK UP 40% ... GATEBOX SUBSCRIPTIONS UP 400% ...)', { onRead: () => { if (!F.hqtv) { F.hqtv = 1; chatSay('the ticker. read the ticker', 1); } } });
txt('hq_poster', 'POSTER', 'FATCO: FASCISM INC. ANTI-TERRORIST COALITION\n\n"BE NORMAL. BE SAFE. BE FATCO."\n\n(Someone has added, in small careful pen: "be yourself" and then crossed it out so hard the paper tore.)');
txt('hq_idframe', 'FRAMED ID', 'A framed photocopy of Carl\'s FATCO ID card. SPECIES: HUMAN.\n\nCarl framed it himself. He used the frame from a certificate of completion he got from something he will not talk about.\n\nThe stamp reads: SPECIES REVIEW BOARD - APPROVED. The date on the stamp is two days before the date Carl applied.', { onRead: () => { F.stampSeen = 1; if (!F.stampChat) { F.stampChat = 1; chatSay('wait read the date', 1); chatSay('THE DATE', 1); infolink('CARL', 'That\'s... that\'s just a typo. Chat. Chat, they\'re very fast. They\'re a very fast board.'); } } });
txt('hq_human_note', 'STICKY NOTE', 'HU-MAN DAILY AFFIRMATIONS (Committee-approved)\n1. I am a normal human.\n2. Normal humans do not need affirmations.\n3. Delete 2.\n4. I am Batch 5. Batches 1-4 were "too much." I am "just right."\n5. The original is not better. The original is shorter.');
txt('hq_bigl2', 'THE BIG LITTER, Chapter 2', 'THE BIG LITTER\nChapter Two: The Lasagna Was A Lie\n\nThe husband was in a mall. They\'re always in a mall. Nobody goes missing anywhere interesting anymore.\n\nI found him at the food court, staring at a pan of lasagna like it owed him money. He wasn\'t eating it. He was buffering. Mouth half open, fork in the air, a guy who\'d started a sentence in October.\n\n"Mister," I said. "Your wife misses you."\n\n"I w-w-w-" he said.\n\nI know a dead end when I see one. I\'ve been one. I took the lasagna as evidence. That was the third mistake. The fourth was eating the evidence, which I\'d like to say I regret.\n\n(Handwritten in the margin: "Is this a metaphor? - Y.")', { onRead: () => { if (!F.bigl2) { F.bigl2 = 1; giveSP(50, 'reading'); } } });
txt('hq_committee', 'COMMITTEE FILE (ENCRYPTED, PARTIAL)', 'THE COMMITTEE // HU-MAN PROGRAM\n\nBatch 1: "too alien." Ears visible. Destroyed.\nBatch 2: "too argumentative." Would not stop explaining. Destroyed.\nBatch 3: "too sincere." Cried at a dog food commercial. Reassigned to marketing.\nBatch 4: "walked off set." Status: unknown. Last seen in the desert following two sets of tall footprints. DO NOT PURSUE.\nBatch 5: "just right."\n\nSOURCE MATERIAL: SUBJECT CARL (FACILITY DESIGNATION REDACTED). Everything he says, minus everything he means.\n\nThe Denton Program shares this source.', { onRead: () => { F.committee = 1; if (!F.committeeSP) { F.committeeSP = 1; giveSP(150, 'secret'); } } });
mail('hq_c1', 'IT DEPT', 'cdenton', 'Your login', 'Agent Denton,\n\nYour FATCO login is CDENTON. Your temporary password is HUMAN. Please change it. (You cannot change it. The field is locked. We are told this is intentional.)\n\n- IT', { login: ['cdenton', 'human'] });
mail('hq_c2', 'HR', 'cdenton', 'Species review', 'Congratulations! Your species review has been APPROVED.\n\nApproval is pending final review. Final review is pending your continued service. Continued service is pending approval.\n\nPlease do not reply to this message. Please do not ask what "final review" is.');
mail('hq_c3', 'Director', 'agents.all', 'Re: the chat', 'All agents,\n\nSome of you have reported "other users" on the infolink channel. Comments. Advice. "Emotes." FATCO has investigated and the channel is secure. The other users do not exist. Please do not engage with them. Please do not let them vote on things.\n\n- Director Face');
mail('hq_c4', 'Pilot X', 'cdenton', '(no subject)', 'Little brother.\n\nRead your mail. Read everyone\'s mail. Read the stamp on your card.\n\nI can\'t tell you. I can tell you to read.\n\n- X', { when: () => hqv() >= 1 });
mail('hq_c5', 'Robo Mall Cop', 'cdenton', 'CITATION', 'CITATION #4471-B\nOFFENSE: LOITERING IN OWN OFFICE.\nFINE: NONE.\nTHIS CITATION IS A COURTESY.\nWELCOME TO FATCO.\nHAVE A NICE DAY.');
mail('hq_y1', 'Yoko', 'ops', 'Infolink logs', 'Note to self: the "other users" on the infolink aren\'t a breach. They don\'t come in from anywhere. They\'re already there when the channel opens. Like the channel was built around them.\n\nDon\'t tell the Director. He\'ll want to sell ads.', { note: 'Yoko\'s note: the chat users "are already there when the channel opens."' });
mail('hq_y2', 'Director', 'yoko', 'Denton telemetry', 'Yoko,\n\nI want Agent Denton\'s infolink telemetry routed to the board directly. Not through ops. Not through me. Directly.\n\nI know how that sounds. Do it anyway.\n\n- F.');
mail('hq_d1', 'L.', 'director', 'The Denton asset', 'He performed. Keep him close. Keep him human.\n\nIf his brother keeps "not telling him things," make sure he keeps not telling him things.', { when: () => hqv() >= 2 });
mail('hq_d2', 'Mr. White', 'director', 'Pretend Air', 'Doc Proper is aboard the blimp at Pretend Air. Send Denton. Send the cop with him. The cop has orders the boy does not.', { when: () => hqv() >= 1 });
mail('hq_d3', 'Director', 'self', 'note', 'I remember getting him out. I remember the tunnel and the alarm and his hand, how small it was.\n\nI remember it the way you remember a movie.\n\nI was not there. I don\'t know how I know that. I know it.');
mail('hq_h1', 'Holt', 'armory', 'Cage code', 'Cage code is 1994. Yes, like the year. Leave me alone about it.', { code: '1994', note: 'Armory cage code: 1994' });
mail('hq_s1', 'Security', 'detention', 'Cells', 'Cell doors are on the security terminal. Login SECURITY / LOCKDOWN. Do NOT open cell 3 without the Director present.', { login: ['security', 'lockdown'], note: 'Detention terminal: SECURITY / LOCKDOWN' });

// ---------- conversations ----------
defSpeaker('ROBOCOP', { name: 'ROBO MALL COP', col: hex('#80a0ff'), voice: [160, 0] });
CONV.yoko1 = async (e) => {
  if (!F.yokoMet) {
    F.yokoMet = 1;
    await T('YOKO', 'Carl! You made it. You did good out there. Better than good. The Director\'s been very quiet, which for him is loud.');
    await T('CARL', 'He\'s a face on a screen, how is he quiet?');
    await T('YOKO', 'You learn to read the static.');
    await T('CARL', 'Hey, so. The chat. In my head. On the infolink. Who are they?');
    await T('YOKO', '...I don\'t know. That\'s the honest answer. They\'re on the channel before the channel opens. FATCO says they don\'t exist.');
    await T('CARL', 'They\'re saying "Yoko is real" right now. Like a lot of them.');
    await T('YOKO', 'That\'s nice of them.');
  }
  const c = await C(['How do augmentations work?', 'What do you think of the P.P.F.?', { t: 'Is the stamp on my card weird? The date?', if: () => F.stampSeen }, 'What\'s next?', 'See you.']);
  if (c === 0) { await T('YOKO', 'Nurse Yokoid in the medbay installs them. Each canister has two options for one part of your body. You pick one. The other one\'s gone.'); await T('CARL', 'Gone where?'); await T('YOKO', 'Just gone, Carl. Choose carefully. Upgrade canisters make them stronger. They all run on bioelectric energy. Cells recharge it.'); }
  else if (c === 1) { await T('YOKO', 'I think...'); await T('YOKO', 'I think helping someone and doing what they tell you aren\'t the same thing. That\'s all I think. I\'m on ops. I think on ops.'); F.yokoHint = 1; }
  else if (c === 2) { await T('YOKO', '...Carl. Close the door.'); await T('YOKO', 'Yes. It\'s weird. Don\'t ask anyone else. Read things. You\'re good at reading when you stop arguing with the page.'); F.yokoStamp = 1; }
  else if (c === 3) { if (hqv() === 1) await T('YOKO', 'The Director wants you. North office. Then the Lot. The P.P.F. are in the Lot, the monorail station, the motel. They have a transmitter on the parking garage roof.'); else await T('YOKO', 'Your brother\'s in the Lot. The Director wants you to "check on him." I want you to check on him too. For different reasons.'); }
};
CONV.robocop = async (e) => {
  if (hqv() === 1) {
    await T('ROBOCOP', 'CITATION: NONE. WELCOME, AGENT DENTON.');
    await T('CARL', 'Hey. Uh. Thanks. Are you... I\'ve seen you before. At the mall. You threw me out of the mall.');
    await T('ROBOCOP', 'AFFIRMATIVE. NINETEEN TIMES. LOITERING. SMOKING. "ARGUING WITH A FOUNTAIN." YOU ARE NOW A COLLEAGUE.');
    await T('CARL', 'So, the citations, they\'re...');
    await T('ROBOCOP', 'THEY ARE ON FILE. EVERYTHING IS ON FILE.');
    const c = await C(['Are you a robot or a guy in armor?', 'Okay. Good talk.']);
    if (c === 0) { await T('ROBOCOP', 'I AM A MALL COP WHO WAS MADE MORE MALL COP. YOU ARE A DELIVERY DRIVER WHO WAS MADE MORE AGENT. WE ARE NOT SO DIFFERENT.'); await T('CARL', 'We\'re pretty different.'); await T('ROBOCOP', 'CITATION: DISAGREEING.'); }
  } else {
    await T('ROBOCOP', 'AGENT DENTON. AT PRETEND AIR YOU HESITATED.');
    await T('CARL', 'I didn\'t hesitate. I thought about it. That\'s different.');
    await T('ROBOCOP', 'THINKING IS HESITATION WITH A HAT ON. CITATION.');
  }
};
CONV.holt = async (e) => {
  if (!e.met) { await T('QM', 'Denton. Holt. Quartermaster. I hand out things that go bang and I count them when they come back.'); await T('CARL', 'What if they don\'t come back?'); await T('QM', 'Then I count that.'); }
  const c = await C(['Can I get some ammo?', 'What\'s in the cage?', 'Got any mods?', { t: 'Tell me about Pilot X.', if: () => hqv() >= 2 }, 'Later.']);
  if (c === 0) { if (!F.holtAmmo || (hqv() >= 2 && F.holtAmmo < 2)) { F.holtAmmo = (F.holtAmmo || 0) + 1; giveItem('a_10mm', 3); giveItem('a_tdart', 1); giveItem('biocell', 1); await T('QM', 'Standard issue. Don\'t waste it on lamps.'); } else await T('QM', 'You\'ve had your issue. Find more in the field. Bad guys carry it. That\'s why they\'re bad guys.'); }
  else if (c === 1) { await T('QM', 'Heavy stuff. Requisition only. Code\'s on my computer and I\'m not telling you, which is a different thing from you not finding it.'); }
  else if (c === 2) { await shopUI({ name: 'HOLT\'S ARMORY', items: [['mod_acc', 150, 2], ['mod_clip', 120, 2], ['mod_rec', 120, 1], ['mod_sil', 300, 1], ['mod_las', 300, 1], ['a_10mm', 20], ['a_762', 30], ['a_tdart', 40], ['medkit', 50], ['biocell', 40]] }, e); }
  else if (c === 3) { await T('QM', 'Pilot X is the best agent this building ever had. And he signs his ammo forms with an X. Which is to say he signs them, which is more than the rest of you.'); await T('QM', 'He came in here last week and returned everything. Everything. Nobody returns everything.'); F.holtX = 1; }
};
CONV.yokoid = async (e) => {
  await T('YOKOID', 'WELCOME TO MEDBAY. I AM NURSE YOKOID, MODEL YK-7. I AM NOT YOKO. PEOPLE ASK.');
  await T('CARL', 'You look exactly like her.');
  await T('YOKOID', 'I AM AWARE. SHE IS ALSO AWARE. WE DO NOT DISCUSS IT AT LUNCH.');
  if (!F.yokoidCan) { F.yokoidCan = 1; giveItem('aug'); const it = P.inv.find(i => i.id === 'aug' && !i.slot); if (it) { it.slot = 'subdermal'; it.pair = AUG_PAIRS.subdermal; } await T('YOKOID', 'STANDARD ISSUE: ONE SUBDERMAL CANISTER. INSTALL IT AT THE MEDICAL BOT. CHOOSE BALLISTIC OR EMP. CHOOSE WITH YOUR WHOLE HEART.'); }
  const c = await C(['Can you look at my... everything? Is it normal?', 'Thanks.']);
  if (c === 0) { await T('YOKOID', 'YOUR VITALS ARE WITHIN NORMAL RANGE FOR A... FOR A...'); await T('YOKOID', 'FOR A FATCO AGENT.'); await T('CARL', 'You paused.'); await T('YOKOID', 'I BUFFERED. IT IS GOING AROUND.'); }
};
defSpeaker('YOKOID', { name: 'NURSE YOKOID', col: hex('#c0d8ff'), voice: [950, 10] });
CONV.human_hq = async (e) => {
  if (F.humanFreed) {
    await T('HUMAN', 'Hello, original. I told the Director you were efficient. He said "noted." I think that was a compliment. I have been practicing the word "noted."');
    const c = await C(['Why do you call me "original"?', 'What\'s the Committee?', 'Noted.']);
    if (c === 0) { await T('HUMAN', 'Because you came first. The Committee watched your stream for a year and wrote down every line they\'d cut. Then they built me out of the cuts. I am everything you say, minus the part where you mean it.'); await T('CARL', 'That\'s a terrible thing to say to someone.'); await T('HUMAN', 'Is it? I would not know. That part was cut.'); }
    else if (c === 1) { await T('HUMAN', 'Focus groups. Very nice people. They gave me khakis.'); }
    else { await T('HUMAN', '...You are mocking me. That is very non-standard. Noted.'); }
  } else {
    await T('HUMAN', 'You left me tied to a chair, original.');
    await T('CARL', 'You were safer in the chair.');
    await T('HUMAN', 'I sat in that chair for six hours. A rebel read me a book about a cat. I am going to remember this in a normal way. Forever.');
    F.humanGrudge = 1;
  }
};
CONV.director1 = async (e) => {
  await T('FACE', 'Agent Denton.');
  await T('CARL', 'Hi. Hey. Director. Sir. Face. What do I call you?');
  await T('FACE', 'Director will do. The island. You reached the torch.');
  if (F.leo === 'arrested') await T('FACE', 'And you brought Propp in alive. He\'s in detention. That was correct.');
  else if (F.leo === 'freed') { await T('FACE', 'And Propp "jumped." Into the lake. Off a forty-foot torch. Nobody has found a body.'); await T('CARL', 'Lot of fish in that lake.'); await T('FACE', '...Yes. Fish.'); }
  else if (F.leo === 'killed') { await T('FACE', 'And Propp is dead. Mr. White sends his compliments. Mr. White does not send compliments.'); }
  if ((F.k_mall || 0) === 0) { await T('FACE', 'Zero fatalities. Pilot X\'s influence, I assume.'); chatSay('PACIFIST', 1); }
  else if ((F.k_mall || 0) > 6) { await T('FACE', 'And a great many bodies. The board was... impressed.'); }
  const c = await C(['Can I ask you something? Were you the one who got me out? Of the facility?', 'What\'s next?']);
  if (c === 0) {
    await T('FACE', '...');
    await T('FACE', 'Yes. I remember it. The tunnel. The alarm. Your hand.');
    await T('CARL', 'Because I don\'t— I remember a face. On a screen. It was a face like yours but it was... older? It had different static.');
    await T('FACE', 'Faces change, agent. Static more so.');
    F.askedFace = 1;
  }
  await T('FACE', 'The P.P.F. have taken the monorail station in the Lot and they\'re holding hostages at the Lot Motel. They also have a transmitter on the parking garage roof. It is broadcasting... propaganda.');
  await T('CARL', 'What kind of propaganda?');
  await T('FACE', 'The kind that says Prop Pills work.');
  await T('CARL', 'Do they?');
  await T('FACE', 'Free the hostages. Secure the station. Shut down the transmitter. Pilot X will meet you in the Lot. The motor pool is west.');
  goalDone('mi_report', 100);
  goal('lot_station', 'Clear the P.P.F. out of the Lot\'s monorail station.');
  goal('lot_motel', 'Free the hostages held in the Lot Motel.');
  goal('lot_tx', 'Shut down the P.P.F. transmitter on the parking garage roof.');
  F.dir1 = 1;
  infolink('YOKO', 'Motor pool is out the west side, past the corridor. Stop by the medbay first if you haven\'t. And the armory. Holt pretends he doesn\'t like you.');
};
CONV.director2 = async (e) => {
  await T('FACE', 'Agent Denton. Doc Proper.');
  if (F.doc === 'killed') { await T('FACE', 'Is dead. By your hand. The board sends its thanks. Robo Mall Cop has filed a commendation, which he has also filed as a citation, which I am told is a compliment.'); }
  else if (F.doc === 'cop') { await T('FACE', 'Is dead. By Robo Mall Cop\'s hand, after you... declined. Declining is noted.'); }
  else { await T('FACE', 'Is alive. And Robo Mall Cop is in a repair bay. You will explain that.'); await T('CARL', 'He was going to shoot an old man.'); await T('FACE', 'He was going to follow orders.'); await T('CARL', 'Yeah. That was the problem.'); }
  await T('FACE', 'There\'s something else. Your brother has not reported in. He was last seen at the Lot Motel. Room seven.');
  await T('CARL', 'He\'s not my— we don\'t know that he\'s my—');
  await T('FACE', 'Go to the Lot. Find Pilot X. Bring him in.');
  await T('FACE', 'And Agent Denton. Whatever he tells you. Remember who laminated your card.');
  goalDone('air_hq'); goal('night_px', 'Find Pilot X at the Lot Motel, room 7.');
  F.dir2 = 1;
};
CONV.leo_cell = async () => {
  await T('LEO', 'The delivery driver. Come to visit me in the zoo?');
  const c = await C(['Are they treating you okay?', 'Tell me about the stamp.', 'I\'m sorry.']);
  if (c === 0) await T('LEO', 'They feed me. They don\'t ask me anything. That\'s how you know nobody plans on a trial.');
  else if (c === 1) { await T('LEO', 'The Species Review Board doesn\'t exist. It\'s a rubber stamp in Linda\'s office. Literally. Mr. White keeps it in his breast pocket.'); F.leoBoard = 1; }
  else { await T('LEO', 'Sorry is cheap. Find Doc Proper before they do. He knows what the pills are. He knows what the Buffering is.'); F.leoDoc = 1; }
};
CONV.restroom = async () => {
  await T('YOKO', 'Carl. That\'s the women\'s room.');
  await T('CARL', 'It said ROOM. The sign fell off. There\'s a— the sign is on the floor, Yoko.');
  await T('YOKO', 'It\'s a picture of a woman.');
  await T('CARL', 'It\'s a picture of a person in a triangle. I\'m not going to assume. That\'s— I don\'t assume things about people\'s triangles.');
  chatSay('LMAO', 1); chatSay('the triangle', 1); chatSay('he has a point actually', 1);
};
CONV.trooper_hq = async (e) => { await T('FATCO', pick(hqv() >= 2 ? ['Heard about Pretend Air. Rough.', 'Robo Mall Cop wrote up a whole report on you. It\'s mostly the word "hesitation."', 'Your brother came through here last week. Returned all his gear. Weird, right?'] : ['Nice work on the island, Denton.', 'Is it true you went through the hatch? The little one?', 'Welcome to FATCO. The coffee\'s bad and the vending machine is haunted.'])); };

// ---------- the map ----------
{
  const g = mk(62, 38, '#');
  g.fill(1, 16, 60, 3, '.');                                      // main corridor
  g.fill(1, 1, 12, 14, '.'); g.fill(14, 1, 7, 14, ','); g.fill(22, 1, 17, 14, ','); g.fill(40, 1, 10, 14, ':'); g.fill(51, 1, 10, 14, '.');
  g.rect(39, 0, 6, 7, '#', ':'); g.rect(45, 0, 6, 7, '#', ';'); g.put(42, 6, 'x'); g.put(47, 6, 'z'); g.put(50, 3, 'v');
  g.put(6, 15, '+'); g.put(17, 15, '+'); g.put(30, 15, 'o'); g.put(44, 15, '+'); g.put(55, 15, '+');
  g.fill(1, 20, 12, 17, ':'); g.fill(14, 20, 7, 8, ','); g.fill(14, 29, 7, 8, ','); g.fill(22, 20, 17, 17, '.'); g.fill(40, 20, 10, 8, '`'); g.fill(40, 29, 5, 8, ';'); g.fill(46, 29, 4, 8, ';'); g.fill(51, 20, 10, 17, ':');
  g.put(6, 19, '+'); g.put(17, 19, '+'); g.fill(28, 19, 5, 1, '.'); g.put(44, 19, '+'); g.put(55, 19, 'j'); g.put(21, 32, '+'); g.put(42, 28, '+'); g.put(47, 28, '+');
  g.fill(0, 26, 1, 3, 'w'); g.fill(29, 37, 3, 1, 'e'); g.fill(26, 0, 9, 1, 'W');
  g.stamp(1, 1, `
R.R.R.R.R.R.
............
.D..c...D...
............
....H.H.....
............
.....y......
............
..h.....h...
.D..C...D...
............
P..........P`);
  g.stamp(14, 1, `
D.....B
.k.....
..h....
......P
.......
N......
..i....
.......
.......
Q......`);
  g.stamp(22, 1, `
P......f.......P.
.................
.................
......D.D........
........d........
.................
.I.............I.
.................
.H.h.........H.h.
.................
.......g.g.......
.................
P...............P`);
  g.stamp(40, 7, `
.......u..
R.R.R.....
...q......
.K.K...D..
.M........
.........N
.R.R.R.R..`);
  g.stamp(40, 1, `
K.K.
....
....
....
K..K`);
  g.stamp(46, 1, `
R.R.
....
.c..
....
R..s`);
  g.stamp(51, 1, `
Z.Z.Z.Z...
..........
..........
.........P
....n.....
..........
.m........
..........
Z.Z..r....
..........
N.N.......`);
  g.stamp(1, 20, `
....a.......
............
............
............
..K.K.......
.......a....
............
............
.....p......
............
K.M.........
............
............
....a.......
............
............
U.........K.`);
  g.stamp(14, 20, `
D.....P
.t.....
.......
...h...
.......
B......
.......`);
  g.stamp(14, 29, `
D......
.......
...l...
.......
R......
.......
N......`);
  g.stamp(22, 20, `
.................
P...............P
.................
.....Q......Q....
.................
.................
.................
.................
....V.V.V........
.................
.................
.................
.I.............I.
.................
.................
.................`);
  g.stamp(40, 20, `
Y..H.h..Y.
..........
.Q........
....H.h...
.........K
.t.......P
..........`);
  g.stamp(40, 29, `
.....
u....
.....
.....
.....
.....
P....`);
  g.stamp(46, 29, `
....
....
.f..
....
....
....
P...`);
  g.stamp(51, 20, `
D.........
.c...#.#.#
..h..#.#.#
.....#.#.#
.....+.+.+
..........
.....#####
..........
.....#.#.#
.....#.#.#
.....+.+.+
..........
.....#####
.N........
..........
..........`);
  // the cells: doors and occupants
  g.put(57, 21, 'G'); g.put(57, 28, 'J');
  const grid = g.str();
  defMap('fatco_hq', { name: 'FATCO HQ', title: 'FATCO HEADQUARTERS', sub: 'MALL OF THE FUTURE - BACK OFFICES', hub: 'hq', music: 'fatco', f: ['tile', 'bluecarpet', 'concrete', 'metal', 'linoleum'], w: ['office', 'concrete', 'metal'], amb: .62, shadow: '#060812', mem: '#101830',
    grid,
    key: {
      w: exitTo('lot_streets', 'motorpool', { when: () => F.dir1 && !F.signalSent && (hqv() < 2 || F.dir2), no: 'The motor pool. "Report to the Director first."' }),
      e: exitTo('mall_island', 'elevator'),
      o: door({ id: 'dirdoor', name: "DIRECTOR'S OFFICE" }),
      x: door({ id: 'cage', lock: 1, pick: 0, code: '1994', name: 'WEAPONS CAGE', metal: 1 }),
      z: door({ id: 'server', lock: 1, str: .8, name: 'SERVER ROOM', metal: 1 }),
      j: door({ id: 'detention', name: 'DETENTION' }),
      y: npc('civ', { id: 'yoko', name: 'YOKO', sprite: 'yoko', port: 'YOKO', conv: 'yoko1', ai: 'static', team: 'fatco', dir: 1, invuln: 1 }),
      c: comp([['yoko', 'mandolin', { mail: ['hq_y1', 'hq_y2'] }]], { c: { hackStr: .6 } }),
      k: comp([['cdenton', 'human', { mail: ['hq_c1', 'hq_c2', 'hq_c3', 'hq_c4', 'hq_c5'] }]], { c: { hackStr: .1 }, label: "CARL'S COMPUTER" }),
      i: reader('hq_idframe', { p: 'poster', label: 'FRAMED ID CARD' }),
      f: pr('facescreen', { id: 'facescreen', frob: async (M, e) => { if (hqv() === 1 && !F.dir1) await startConv('director1', null); else if (hqv() === 2 && !F.dir2) await startConv('director2', null); else await startConv(async () => { await T('FACE', pick(['Agent Denton. You have your orders.', 'The board is watching, agent. So am I. Mostly I am watching the board.', 'Go.'])); }, null); }, label: 'DIRECTOR FACE' }),
      d: comp([['director', 'brand', { mail: ['hq_d1', 'hq_d2', 'hq_d3'] }]], { c: { hackStr: .9 } }),
      g: npc('fatco', { ai: 'static', dir: 1, conv: 'trooper_hq' }),
      q: npc('civ', { id: 'holt', name: 'QUARTERMASTER HOLT', sprite: 'qm', port: 'QM', conv: 'holt', ai: 'static', team: 'fatco', dir: 1 }),
      u: comp([['holt', 'ammo', { mail: ['hq_h1'] }]], { c: { hackStr: .3 }, p: 'computer' }),
      s: warpPart(2),
      n: npc('civ', { id: 'yokoid', name: 'NURSE YOKOID', sprite: 'yokoid', port: 'YOKOID', conv: 'yokoid', ai: 'static', team: 'fatco', dir: 1 }),
      m: npc('medbot', { ai: 'static' }),
      r: npc('civ', { id: 'human_med', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', conv: 'human_hq', ai: 'static', team: 'fatco', dir: 2, cond: () => !F.humanFreed && hqv() === 1 }),
      t: npc('civ', { id: 'human', name: 'HU-MAN', sprite: 'humanunit', port: 'HUMAN', conv: 'human_hq', ai: 'static', team: 'fatco', dir: 1, cond: () => F.humanFreed && hqv() <= 2 }),
      l: npc('civ', { id: 'robocop_office', name: 'ROBO MALL COP', sprite: 'robocop', port: 'ROBOCOP', conv: 'robocop', ai: 'static', team: 'fatco', dir: 1, cond: () => hqv() === 2 && F.doc !== 'saved' }),
      a: pr('car'), p: npc('fatco', { ai: 'static', dir: 0, conv: 'trooper_hq' }),
      G: npc('civ', { id: 'leo_cell', name: 'LEO PROPP', sprite: 'ppf', port: 'ppf', conv: 'leo_cell', ai: 'static', team: 'civ', dir: 1, cond: () => F.leo === 'arrested' }),
      J: npc('ppf', { id: 'prisoner', name: 'P.P.F. PRISONER', ai: 'static', team: 'civ', wpn: null, dir: 1, talk: ['They took my glasses. I can\'t see if you\'re one of the good ones.', 'Is it true you let Leo go? Somebody said a man jumped off the torch.', 'Two pills every six hours. Write it down. Somebody should know it.'] }),
    },
    ents: [
      spawnPt('elevator', -Math.PI / 2, { x: 30, y: 35 }), spawnPt('motorpool', 0, { x: 2, y: 27 }),
      npc('civ', { id: 'robocop', name: 'ROBO MALL COP', sprite: 'robocop', port: 'ROBOCOP', conv: 'robocop', ai: 'static', team: 'fatco', x: 30, y: 27, dir: 1, cond: () => hqv() === 1 }),
      reader('hq_tvnews', { p: 'tv', x: 41, y: 25, label: 'TV: FATCO NEWS' }), reader('hq_poster', { p: 'poster', x: 26, y: 20 }), reader('hq_human_note', { p: 'cone', x: 16, y: 22, label: 'STICKY NOTE' }), reader('hq_bigl2', { p: 'bookshelf', x: 20, y: 1, label: 'PAPERBACKS' }), reader('hq_committee', { p: 'rack', x: 49, y: 1, label: 'COMMITTEE SERVER' }),
      seccomp([['security', 'lockdown', { mail: ['hq_s1'], special: [['Open cell 1', () => { const d = Object.values(P.map.doors).find(d => d.x === 56 && d.y === 24); if (d) { d.unlocked = 1; d.open = 1; rebuildBlock(P.map); } return 'Cell 1 open.'; }], ['Open cell 3', () => { const d = Object.values(P.map.doors).find(d => d.x === 56 && d.y === 30); if (d) { d.unlocked = 1; d.open = 1; rebuildBlock(P.map); } return 'Cell 3 open.'; }]] }]], { x: 52, y: 21 }),
      npc('fatco', { x: 53, y: 23, ai: 'static', dir: 0, conv: 'trooper_hq', id: 'cellguard' }),
      pr('locker', { x: 41, y: 5, items: [['w_shotgun', 1], ['a_shell', 2]], label: 'CAGE LOCKER' }), pr('crate', { x: 43, y: 1, items: [['lam', 1], ['a_lam', 2], ['gasnade', 1]], label: 'CAGE CRATE' }), pr('mcrate', { x: 40, y: 2, items: [['w_rifle', 1], ['a_762', 2]], label: 'CAGE CRATE' }),
      pr('locker', { x: 58, y: 14, items: [['medkit', 2], ['biocell', 1]] }),
      item('soda', 1, { x: 47.5, y: 21.5 }), item('candy', 1, { x: 45.5, y: 23.5 }), item('lockpick', 2, { x: 9.5, y: 30.5 }),
      cam(Math.PI / 2, { x: 30.5, y: 19.3, team: 'fatco', sweep: 1.1 }), cam(Math.PI, { x: 59.5, y: 16.3, team: 'fatco', sweep: .4 }),
      turret({ x: 55, y: 18, ang: Math.PI, team: 'fatco' }),
      light(6, .5, { x: 30, y: 25 }), light(6, .5, { x: 30, y: 31 }),
      { k: 'chatter', a: 'brk1', b: 'brk2', r: 6, lines: [['brk1', 'You hear the new guy went in through the hatch?'], ['brk2', 'The little hatch?'], ['brk1', 'Fit right in, they said.'], ['brk2', 'Don\'t say little. HR sent a memo.'], ['brk1', 'A memo about "little"?'], ['brk2', 'About a lot of words. Read your mail.']], x: 42, y: 22, cond: () => hqv() === 1 },
      npc('fatco', { id: 'brk1', x: 43, y: 22, ai: 'static', dir: 0, conv: 'trooper_hq', cond: () => hqv() === 1 }), npc('fatcoagent', { id: 'brk2', x: 45, y: 22, ai: 'static', dir: 2, conv: 'trooper_hq', cond: () => hqv() === 1 }),
      { k: 'chatter', a: 'brk3', b: 'brk4', r: 6, lines: [['brk3', 'Did you hear what happened at Pretend Air?'], ['brk4', 'The cop and the old man?'], ['brk3', 'The cop and Denton. The old man was just... there.'], ['brk4', 'I heard Pilot X turned in all his gear.'], ['brk3', 'Everybody heard that. Nobody\'s saying it.']], x: 42, y: 22, cond: () => hqv() === 2 },
      npc('fatco', { id: 'brk3', x: 43, y: 22, ai: 'static', dir: 0, conv: 'trooper_hq', cond: () => hqv() === 2 }), npc('fatco', { id: 'brk4', x: 45, y: 22, ai: 'static', dir: 2, conv: 'trooper_hq', cond: () => hqv() === 2 }),
      trig(() => startConv('restroom', null), { x: 46, y: 29, w: 4, h: 3 }),
      trig(() => { infolink('YOKO', 'Welcome to headquarters, Carl. Director\'s office is straight north up the corridor. Medbay is northeast, armory next to it, ops is northwest. That\'s me.'); }, { x: 26, y: 30, w: 9, h: 5, when: () => hqv() === 1 }),
    ],
    marks: [[31, 4], [56, 6]],
    enter(M, first) { if (hqv() === 1 && !F.dir1) goal('mi_report', 'Report to Director Face at FATCO headquarters (north office).'); },
  });
}

// login sources (QA pass 2026-10-14)
txt('hq_yokonote', 'STICKY NOTE', 'yoko / mandolin\n\n(Yoko\'s handwriting. Underneath, in someone else\'s: "please stop leaving your password on the monitor." Underneath that, in Yoko\'s: "no.")', { login: ['yoko', 'mandolin'] });
txt('hq_dirnote', 'DESK BLOTTER', 'The Director\'s desk blotter. Doodles: a brand logo, over and over, more carefully each time.\n\nIn the corner, very small: director / brand\n\nHe has written "do not" next to it and then not finished the sentence.', { login: ['director', 'brand'] });
MAPS.fatco_hq.ents.push(reader('hq_yokonote', { p: 'cone', x: 4, y: 2, label: 'STICKY NOTE' }), reader('hq_dirnote', { p: 'cone', x: 29, y: 5, label: 'DESK BLOTTER' }));
