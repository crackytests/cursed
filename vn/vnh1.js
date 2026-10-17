'use strict';
// ================= DISK B: SANTA MONICA =================
// The pier, the beach, the boardwalk freaks. Carl's first haven above a laundromat. Tommy Two-Pills. The Lost & Found.
HUBS.sm = { name: 'SANTA MONICA' };

// ---------- texts and mail ----------
txt('sm_mirror', 'MIRROR', 'A small alien in a backwards cap looks back at you.\n\nHe has a bow tie. He has very big eyes. He looks, you would say, like a normal human who has had a long night.\n\nYou practice the face you make when people ask if you are a normal human. You do it eleven times. The eleventh time is pretty good.');
txt('sm_papers', 'CONSULATE PAPERS', 'CONSULATE OF THE NORMALCY\nREGISTRATION - PROVISIONAL\n\nNAME: CARL (CLAIMS OTHERWISE)\nSPECIES: [PROVISIONAL]\nORIGIN: NEVADA (ABOVE AND BELOW)\nSPONSOR: [RETURNED]\nPROBATION OFFICER: THE COMMISSIONER\n\nNOTES: Subject has written HUMAN in the species field in ballpoint pen. Subject was asked to stop. Subject has written it again, smaller.');
txt('idcard', 'CONSULATE PAPERS', TEXTS.sm_papers.text);
txt('sm_tommy_note', 'NOTE ON THE DOOR', 'CARL -\nKEY\'S UNDER THE MAT. NOT THIS MAT. THE OTHER MAT. 2C.\nCOME SEE ME. BUILDING NEXT DOOR. 3A. BRING NOTHING. I HAVE EVERYTHING. I HAVE TOO MUCH.\n- TOMMY');
txt('sm_bulletin', 'COMMUNITY BOARD', 'LOST CAT - answers to "Mister Whiskers" - last seen being looked at very intensely by a tall blond man on the pier\n\nFREE CLINIC - DONOR PROGRAM - GET $20 FOR "A LITTLE ENERGY" - you will feel tired, this is normal\n\nHAS ANYONE ELSE SEEN THE LIGHTS OVER THE BEACH HOUSE?? call me - Danny (the kid with the camera)\n\nTHE OCEAN HOUSE IS NOT FOR SALE - the Ocean House');
txt('sm_bhsign', 'SIGN', 'PRIVATE BEACH\nNO TRESPASSING\nNO LOOKING\nNO LIGHTS\n\n(The last two are hand-painted.)');
txt('sm_menu', 'DINER MENU', 'THE BLUE MOON DINER\nOPEN ALL NIGHT\n\nPIE ..... $2\nCOFFEE ... $1\nANOTHER COFFEE ... $1\nWHATEVER YOU\'RE HAVING, HON ... $3\n\n"We don\'t ask where you\'re from."');
mail('sm_m1', 'TOMMY 2P', 'carl', 'welcome 2 SM', 'carl\n\nthis is ur computer. it was my computer. then it was a guy\'s computer. now its urs. the password is on the monitor because i dont believe in secrets anymore. i\'ve seen too much.\n\ncome see me. 3A next door.\n\n-T');
mail('sm_m2', 'OFFICE OF THE COMMISSIONER', 'carl', 'Probation', 'Carl,\n\nYou are registered. You are provisional. You are probationary.\n\nYou will perform tasks for the Consulate as assigned through Mr. Two-Pills. You will keep the Normalcy. You will keep your stream on.\n\nI read your chat logs. Someone named "bongripper" asked you to "do a flip." Please do not do a flip.\n\n- L');
mail('sm_m3', 'HOT SINGLES IN YOUR GALAXY', 'carl', 'r u a VISITOR??', 'Lonely? New in town? From somewhere very far away? HOT SINGLES IN YOUR GALAXY want to meet you!\n\nClick here to register your species.\n\n(This message was sent by the Consulate of the Normalcy as part of a Normalcy awareness test. You have not failed. Yet.)');
mail('sm_m4', 'vtuber_truther', 'carl', 'I KNOW', 'Carl. I watched every stream. Frame by frame. Your eyes reflect the ring light. Models don\'t do that. I know where you live because you showed the laundromat sign in stream 41. I am not going to hurt you. I just need to know. I\'ll be outside.\n\n- a fan');
txt('sm_kidtape', 'DANNY\'S TAPE', 'A VHS-C cassette. The label says LIGHTS OVER THE BEACH HOUSE!!! in green marker.\n\nIn the viewfinder: the beach house at 2 a.m. Something low and round over the roof. A door opens on the deck. Figures come out. They are not walking the way people walk.');

// ---------- radio ----------
DEB.push({ id: 'sm1', hub: 1, title: 'LIGHTS OVER SANTA MONICA', fn: async () => {
  await T('DEB', 'You\'re listening to Deep Night. I\'m Deb. It\'s three in the morning and my phone lines are lit up like the beach house, which is our topic tonight. Caller, you\'re on.');
  await T('N', '"Deb, hi, longtime. So I live by the pier, and every night there\'s these lights, round lights, over the private beach. And my dog won\'t walk that way."');
  await T('DEB', 'Smart dog. What color lights?');
  await T('N', '"Kind of... hungry colored?"');
  await T('DEB', 'I know exactly what you mean, and that\'s the scariest thing anyone has said to me this week. Next caller.');
} });
DEB.push({ id: 'sm2', hub: 1, title: 'THE STREAMER', fn: async () => {
  await T('DEB', 'Deep Night. Deb. Got a letter here from a listener who says there\'s a streamer in Santa Monica, little guy, big eyes, says he\'s a normal human every eleven minutes.');
  await T('DEB', 'The listener says she thinks he\'s real. Like, really real. Like, not-from-here real.');
  await T('DEB', 'Honey, everybody in this town is not from here. That\'s what makes it a town. Little guy, if you\'re listening: I believe you. Whatever you are.');
} });
DEB.push({ id: 'sm3', hub: 1, title: 'THE OCEAN HOUSE', fn: async () => {
  await T('DEB', 'Ghost story hour. The Ocean House, up on the bluff. Built 1951. A family ran it. Mother, father, two kids. In 1957 the father, and I\'m reading from the paper, "had a breakdown."');
  await T('DEB', 'The mother told her sister on the phone, the night before, that her husband "wasn\'t her husband." The sister thought she meant he\'d changed.');
  await T('DEB', 'Nobody\'s stayed a whole night in that hotel since. Real estate people try every year. They come out white as a sheet, if you\'ll pardon the expression.');
} });

// ---------- Tommy Two-Pills ----------
CONV.tommy = async (e) => {
  if (!F.smTommy) {
    F.smTommy = 1; goalDone('sm_meet');
    await T('TOMMY', 'Carl! Carl. Carl. Come in. Don\'t touch the- okay you touched it. It\'s fine. Everything\'s fine. I\'m Tommy. Two-Pills. Everybody calls me Two-Pills because I took two pills one time and I never really came down.');
    await T('CARL', 'Prop Pills? You took Prop Pills? I used to deliver those! I used to- is that why you\'re looking at me like that?');
    await T('TOMMY', 'Like what? Like you\'re a little green guy in a hat? Yeah. That\'s the pills. Humans take \'em, the costume stops working. On us. Not on you. You don\'t have a costume. You just have a hat.');
    await T('CARL', 'I have a very convincing hat.');
    await T('TOMMY', 'You do! You do. Okay. Business. The Commissioner says I\'m your fixer. I fix things. I fixed your apartment. I fixed your papers. I owe her. She owns my debt. Now she owns yours. We\'re in debt together. That\'s friendship in LA.');
    const c = await C(['Why do you owe her?', 'What does "fixer" mean?', { t: 'Can I ask a weird question? What am I? Like, what species? The clerk guessed. Do you know?', if: () => true }, 'What\'s the job?']);
    if (c === 0) { await T('TOMMY', 'Invaders. Few months back. They grabbed me outside the diner and kept me in a closet for a week. Snack. I was a snack. The Consulate got me out. Linda doesn\'t do favors, she does invoices.'); await T('TOMMY', 'So when she says the Invaders on the beach have to go, I take it personal. Which brings me to the job.'); }
    else if (c === 1) { await T('TOMMY', 'I know people. Human people. Visitor people. People-people. I get you guns, bags, papers, a ride. You do the thing. I take a cut. The cut is mostly pills.'); }
    else if (c === 2) { await T('TOMMY', 'Buddy. I\'ve seen every kind of visitor there is. Greys, lizards, the tall pretty ones, the ones in the drains. And I look at you and I see... a little guy in a hat.'); await T('TOMMY', 'That\'s not nothing. That\'s rare. Most people I look at, I see what\'s under. You, I see you. Maybe there\'s nothing under. Maybe you\'re just like that.'); await T('CARL', '...That\'s the nicest thing anyone\'s said to me in a long time and I hate it.'); }
    await T('TOMMY', 'The job. There\'s a beach house east of the pier. Private beach. Invaders took it over. They\'re feeding out in the open, Carl. On the sand. They\'ve got a saucer. A saucer! In 1995! The Normalcy is leaking all over Santa Monica.');
    await T('TOMMY', 'The Commissioner wants it gone. Not cleaned up. Gone. There\'s a gas main under the house. Three valves in the basement. You open the valves, you set this, you leave.');
    giveItem('w_lam', 2); P.ammo.lam = (P.ammo.lam || 0); msg('Tommy hands you two pipe bombs and a timer.');
    await T('TOMMY', 'Pipe bombs. You put one by the valves. You need one more for luck. Luck is very important in my line of work.');
    goal('sm_beach', 'Destroy the Invader nest in the beach house east of the pier: open the three gas valves in the basement and plant a pipe bomb.');
    goal('sm_haven', 'Your haven is above the laundromat (2C). Sleep there to save. Check the computer and the radio.', 1);
    await T('TOMMY', 'Your place is next door. Above the laundromat. Get some rest first, if you want. They don\'t go anywhere in the day. Nobody in this town goes anywhere in the day.');
    await T('TOMMY', 'Oh, and Carl? If you need to eat, eat in an alley. Not on the pier. The pier has cameras and children.');
    return; }
  if (F.bhDone && !F.smDone) return CONV.tommy_after(e);
  const opts = [{ t: 'What do you have for sale?', if: () => true }, 'Any other work?', { t: 'Tell me about the Normalcy again.', if: () => true }, 'See you.'];
  const c = await C(opts);
  if (c === 0) await shopUI({ name: 'TOMMY\'S CLOSET (3A)', items: [['biocell', 30, 6], ['medkit', 40, 4], ['lockpick', 20, 8], ['multitool', 30, 6], ['a_10mm', 12], ['a_shell', 18], ['w_baton', 60, 1], ['w_shotgun', 300, 1], ['a_tdart', 30, 3], ['pills', 15, 5]] }, e);
  else if (c === 1) { await T('TOMMY', pick(['The clinic. Dr. Kwan\'s got a problem in the night ward. She pays in bags.', 'Danny on the pier\'s got a camcorder and a big mouth. The Consulate would love that tape to disappear.', 'The Lost & Found. The Linda sisters always need something done. Don\'t pick a side. Pick a side.', 'Ocean House. Don\'t. Or do. It\'s haunted. Like, actually. Not visitor-haunted. Ghost-haunted.'])); }
  else if (c === 2) { await T('TOMMY', 'One: be normal. Two: if a human sees you be not-normal, that\'s a breach. Five breaches, the suits come. Three: the Commissioner decides what normal is, which is the part nobody likes.'); await T('TOMMY', 'Feed in the dark. Feed on sleepers. Buy bags from Kwan. Don\'t do the flashy stuff on Ocean Avenue. And if you breach, there\'s ways to make it go away. I know some of them.'); }
};
CONV.tommy_after = async () => {
  await T('TOMMY', 'Carl! I heard the boom from here. I felt the boom. In my teeth. It was beautiful. Was anybody- did anybody see?');
  await T('CARL', F.bhLoud ? 'Some people saw. Maybe a lot of people. It was a big boom. Big booms are, I think, hard to make normal.' : 'Nobody saw. I think. I was very sneaky. I was so sneaky that I\'m not even sure I was there.');
  await T('TOMMY', 'Gas leak. That\'s what the papers will say. It\'s always a gas leak. You know how many "gas leaks" this city has had? We\'re running out of gas.');
  await T('TOMMY', 'The Commissioner called. She wants you Downtown. The Tower. Tonight. That\'s a big deal, Carl. People don\'t get called to the Tower. People get sent.');
  goalDone('sm_beach'); goal('sm_tower', 'Go to the Pretend Co. Tower Downtown. The cab stand is at the parking lot on Ocean Avenue.');
  F.smDone = 1; restoreNormalcy(1, 'the Consulate cleans up the beach');
};

// ---------- the vtuber truther ----------
CONV.truther = async (e) => {
  if (F.truther) { await T('N', pick(['He gives you a thumbs up and whispers "I won\'t tell."', 'He is drawing you in a notebook. It is a pretty good drawing.'])); return; }
  await T('N', 'A young guy in a cardigan, clutching a notebook. He goes white when he sees you.');
  await T('N', '"It\'s you. It\'s really you. The eyes. Carl, I\'m- I\'m vtuber_truther. From chat. I\'ve been in chat since stream nine."');
  await T('CARL', 'Hi! Hello! Thank you for watching! I am a normal human in a, a very good costume, and I\'m actually a man in Ohio, I\'m commuting, from Ohio, every night, it\'s a lot of driving-');
  await T('N', '"I just need to know. I won\'t tell anybody. I just need to know I wasn\'t crazy. Everyone in chat says I\'m crazy."');
  chatPoll('truther', ['TELL HIM', 'DENY IT', 'RUN']);
  const c = await C(['[Tell the truth] ...You\'re not crazy. I\'m real. I don\'t know what I am. But I\'m real.', { t: 'It\'s a costume. It\'s latex. Feel it. No don\'t feel it. Trust me, it\'s latex.', req: ['denial', 2] }, { t: 'Forget you saw me.', req: ['command', 1] }, { t: 'Forget the last five minutes.', req: ['missingtime', 1] }, { t: '[CHARM] You know what? You get it. You\'ve always gotten it. Come here.', req: ['charm', 1] }, 'Leave.']);
  if (c === 0) { await T('N', 'He sits down on the curb and puts his face in his hands. When he looks up he is laughing and crying at the same time.'); await T('N', '"I knew it. I KNEW it. I won\'t tell anyone. Who would I tell? Chat?"'); await T('CARL', 'Chat would not believe you. Chat does not believe anything. That\'s the whole thing. That\'s the whole, um, system.'); F.truther = 'told'; gainHumanity('told the truth'); breach('TOLD A HUMAN THE TRUTH', [e]); chatSay('vtuber_truther: I KNEW IT', 0, 'vtuber_truther'); chatSay('truther is crazy lol', 1); }
  else if (c === 1) { await T('N', '"...Latex. Wow. Okay. Wow. The detail on that is incredible. Is it a Rick Baker? It looks like a Rick Baker."'); await T('CARL', 'It\'s a Rick Baker.'); F.truther = 'denied'; giveSP(150, 'denial'); }
  else if (c === 2 || c === 3) { e.state = 'idle'; await T('N', 'His eyes go glassy. He blinks. "...Sorry, I was- do you know if the laundromat is open?"'); F.truther = 'forgot'; }
  else if (c === 4) { await T('N', 'He comes closer. He smells like coffee and very old fan conventions. "Is this- is this happening?"'); e.feedOK = 1; F.truther = 'charmed'; msg('He trusts you completely. (You could feed. Nobody is watching. He would let you.)'); }
  else { F.truther = 0; }
};

// ---------- the pier kid ----------
CONV.danny = async (e) => {
  if (F.danny) { await T('N', pick(['"Weather balloon," Danny says to himself, unconvinced.', '"Do you want to see my other tapes? They\'re of birds."'])); return; }
  await T('N', 'A kid, maybe fifteen, with a camcorder the size of a toaster. "Mister! Mister, you look like you\'d believe me. I got the lights on tape! Over the beach house!"');
  const c = await C(['Can I see?', { t: '[Buy it] I\'ll give you 50 bucks for it.', if: () => P.cred >= 50 }, { t: '[DENIAL] That\'s a weather balloon. I\'m a meteorologist. Very human job.', req: ['denial', 1] }, { t: 'You didn\'t film anything.', req: ['command', 1] }, { t: '[RANT] Do you know what happens to kids who film the beach house? Do you KNOW? Because I DON\'T, and that\'s WORSE!', req: ['rant', 1] }, 'Cool. Bye.']);
  const take = () => { giveItem('kidtape', 1); F.danny = 1; restoreNormalcy(1, 'the tape is gone'); giveSP(200, 'the tape'); addNote('Danny\'s tape shows figures coming out of the beach house onto the deck. The deck door is the way in that isn\'t the front.'); };
  if (c === 0) { await readText('sm_kidtape'); await T('N', '"Right?? RIGHT?? I\'m sending it to Deep Night. Deb\'ll play it. Deb plays everything."'); await T('CARL', 'You can\'t play a tape on the radio.'); await T('N', '"Deb\'ll describe it!"'); }
  else if (c === 1) { P.cred -= 50; await T('N', '"FIFTY? Deal! You\'re gonna be famous, mister!"'); take(); }
  else if (c === 2) { await T('N', '"...A weather balloon. Huh. Do they have legs?" "Sometimes," you say. He hands it over, crushed.'); take(); }
  else if (c === 3) { await T('N', 'His eyes slide out of focus. "...I didn\'t film anything." He hands you the tape like it\'s a sandwich.'); take(); }
  else if (c === 4) { await T('N', 'Danny drops the tape and runs. You feel bad. You feel full, a little, which is worse.'); take(); if (species() === 'martian') P.bio = Math.min(100, P.bio + 20); }
};
ITEMS.kidtape = { name: 'DANNY\'S TAPE', w: 1, h: 1, quest: 1, use: () => readText('sm_kidtape'), desc: 'LIGHTS OVER THE BEACH HOUSE!!!' };

// ---------- the Lindas (Lost & Found) ----------
CONV.jeanette = async (e) => {
  if (F.lindasDone) { await T('JEANETTE', F.lindasDone === 'jeanette' ? 'My club, sugar. Mine. Drink?' : F.lindasDone === 'both' ? 'We\'re thinking about a name. Both of us. Weird, right?' : '...Do I know you?'); return; }
  if (!F.metJeanette) {
    F.metJeanette = 1;
    await T('JEANETTE', 'Well, look at you. Nobody told me they were making them this cute now.');
    await T('CARL', 'You look like- you\'re- are you Linda? The Commissioner? Why is the Commissioner wearing a- why is she at a club-');
    await T('JEANETTE', 'Ugh. No. Everybody says that. I\'m Jeanette. Jeanette Linda. I just have the face. Half this city has her face on a billboard. Somebody had to wear it to parties.');
    await T('JEANETTE', 'My sister runs the boring half of this club from the office in back. Therese. You\'ll hate her. Everybody hates her except the bank.');
    if (species() === 'broadcast') await T('CARL', 'You sound like two stations. You sound like you\'re on the same frequency as somebody else. You\'re bleeding over. Do you hear that? Is that rude to say?', { bc: 'You\'re on two frequencies and they\'re both you. There\'s a crackle where you change over. I can hear the crackle.' });
    if (species() === 'broadcast') await T('JEANETTE', '...Don\'t say that out loud, sugar. Not in here.');
  }
  const c = await C([{ t: 'Do you need anything done?', if: () => !F.jJob }, { t: 'About the ledger...', if: () => F.jJob && !F.ledger }, { t: 'I have the ledger.', if: () => F.jJob && F.ledger && !F.ledgerGiven }, { t: '[CHARM] Want to dance?', req: ['charm', 1], if: () => !F.jDance }, { t: 'You and Therese are the same person, aren\'t you.', if: () => F.lindasClue && !F.lindasDone }, 'Bye.']);
  if (c === 0) { F.jJob = 1; await T('JEANETTE', 'Funny you ask. Therese keeps a ledger. Every visitor who ever fed in my VIP room. Names, species, nights. She\'s going to sell it to the Consulate. To LINDA. The real one.'); await T('JEANETTE', 'That\'s my customers, sugar. That\'s my friends. Get it out of her safe in the office. Burn it, bring it, I don\'t care. Just don\'t let it go to the Tower.'); goal('sm_ledger', 'Jeanette Linda wants Therese\'s ledger from the safe in the Lost & Found office.', 1); }
  else if (c === 1) { await T('JEANETTE', 'The safe\'s in her office, back of the club, up the stairs past the bouncer. The code is our birthday. Neither of us knows our birthday. Try something sentimental.'); }
  else if (c === 2) { F.ledgerGiven = 'jeanette'; removeItem(invFind('ledger')); await T('JEANETTE', 'Oh, you darling. You DARLING. Here.'); giveItem('biocell', 3); P.cred += 200; giveSP(400, 'the ledger'); await T('JEANETTE', 'She\'s going to be so mad. I can\'t wait to see her face. I mean. You know what I mean.'); F.lindasClue = 1; goalDone('sm_ledger'); }
  else if (c === 3) { F.jDance = 1; await T('N', 'She pulls you onto the dance floor. You dance like a man who has read about dancing. She laughs, a real laugh, and for a second she looks nothing like the Commissioner.'); if (species() === 'nordic') { P.bio = Math.min(100, P.bio + 40); msg('Everyone is looking. You drink it in.'); } gainHumanity('danced'); }
  else if (c === 4) return CONV.lindas_end(e);
};
CONV.therese = async (e) => {
  if (F.lindasDone) { await T('THERESE', F.lindasDone === 'therese' ? 'The club is solvent. Thank you, Carl.' : F.lindasDone === 'both' ? 'We\'re thinking about a name. She wants something with a pun. I\'m... considering it.' : '...Who let you up here?'); return; }
  if (!F.metTherese) {
    F.metTherese = 1;
    await T('THERESE', 'You must be the Commissioner\'s new errand boy. Close the door. The music gives me a headache.');
    await T('THERESE', 'Therese Linda. Yes, the face. No, I\'m not her. I chose this face because it\'s the face people obey. My sister chose it because it\'s the face people buy drinks for.');
  }
  const c = await C([{ t: 'Do you need anything done?', if: () => !F.tJob }, { t: 'The Ocean House is clear.', if: () => F.tJob && F.ohDone && !F.tPaid }, { t: 'I have your ledger. Jeanette wanted it burned.', if: () => F.ledger && !F.ledgerGiven }, { t: 'You and Jeanette are the same person, aren\'t you.', if: () => F.lindasClue && !F.lindasDone }, 'Bye.']);
  if (c === 0) { F.tJob = 1; await T('THERESE', 'The club loses money every night my sister opens the bar. I\'m buying the Ocean House on the bluff. A hotel. Quiet rooms. Visitors pay for quiet rooms.'); await T('THERESE', 'Every buyer the bank sends runs out screaming. The bank says it\'s haunted. I say it\'s squatters. Go in, find out which, and make it stop.'); goal('sm_ocean', 'Therese Linda wants the Ocean House on the bluff made safe to buy. Find out what is scaring people off.', 1); }
  else if (c === 1) { F.tPaid = 1; await T('THERESE', 'Clear. Truly?'); await T('CARL', F.ohRest ? 'She\'s at rest. The mother. She just wanted somebody to know what happened. Now somebody knows. Me. It was a, it was a lot.' : 'Clear-ish. Mostly clear. There might be a, a residual, a vibe.'); await T('THERESE', 'A vibe I can sell.'); P.cred += 400; giveSP(600, 'the Ocean House'); goalDone('sm_ocean'); F.lindasClue = 1; }
  else if (c === 2) { F.ledgerGiven = 'therese'; removeItem(invFind('ledger')); await T('THERESE', '...She asked you to steal it, and you brought it back to me. Why?'); await T('CARL', 'Because I don\'t like stealing and I don\'t like fire and I REALLY don\'t like being in the middle of a, of whatever this is.'); await T('THERESE', 'Hm. Honest. That\'s a defect in this city. Here.'); P.cred += 300; giveSP(400, 'the ledger'); F.lindasClue = 1; goalDone('sm_ledger'); }
  else if (c === 3) return CONV.lindas_end(e);
};
CONV.lindas_end = async (e) => {
  await T('N', 'The music downstairs stops. When you look up, there is only one woman in the room, and she has both their faces, one after the other, like a channel flipping.');
  await T('THERESE', 'How long have you known?', { sp: { broadcast: 'How long have you heard it?' } });
  await T('JEANETTE', 'Sugar. Don\'t tell her. She\'ll make it a spreadsheet.');
  await T('CARL', 'You\'re one of- you\'re Broadcast. You came in on a signal and you split. Like when two stations bleed into each other at night. You\'re both you.');
  await T('THERESE', 'We came in on the strongest signal on Earth. Do you know what the most broadcast face on Earth is? Her face. Linda\'s. It was on every screen. So we caught it.');
  await T('JEANETTE', 'And then there was a party, and there was an office, and somebody had to go to both.');
  await T('THERESE', 'A ghost loved both of us once. Different nights. He never figured it out. He thought it was his type.');
  await T('CARL', 'Spooky Ghost? Like the- with the- does everyone know Spooky Ghost?');
  await T('JEANETTE', 'Every Linda in Los Angeles knows Spooky Ghost, sugar.');
  chatPoll('lindas', ['THERESE', 'JEANETTE', 'BOTH']);
  const c = await C(['[Therese] The club needs someone sensible. Therese should run it.', '[Jeanette] The club needs someone alive. Jeanette should run it.', { t: 'You should both run it. Together. Stop pretending the other one is somebody else.', req: ['charm', 2], hide: 0 }, { t: '[DENIAL, but for them] You\'re not two people. You\'re not one person. You\'re whatever you say you are. I would know. I do this every day.', req: ['denial', 2] }, { t: 'Tune in. Both of you. Same station. I\'ll hold the dial.', sp: 'broadcast' }]);
  if (c === 0) { F.lindasDone = 'therese'; await T('N', 'The channel stops flipping. Therese adjusts her glasses. Somewhere very far down in the static, someone laughs and then doesn\'t.'); await T('THERESE', 'Thank you. That was... clean.'); }
  else if (c === 1) { F.lindasDone = 'jeanette'; await T('N', 'The glasses fall off. Jeanette catches them, looks at them like she\'s never seen glasses, and drops them in a drink.'); await T('JEANETTE', 'Party\'s back on, sugar. Forever.'); }
  else { F.lindasDone = 'both'; await T('N', 'The flipping slows. Then it isn\'t flipping. Then there is a woman with Linda\'s face and her own expression, both at once, and she looks very tired and very relieved.'); await T('THERESE', 'We\'ll... figure out a name.'); await T('JEANETTE', 'Something with a pun.'); gainHumanity('helped them be one person'); }
  giveSP(800, 'the Lindas'); giveItem('biocell', 2);
};
ITEMS.ledger = { name: 'THERESE\'S LEDGER', w: 1, h: 1, quest: 1, use: () => readText('sm_ledger'), desc: 'Names, species, nights. Every visitor who fed in the VIP room of the Lost & Found.' };
txt('sm_ledger', 'THE LEDGER', 'THE LOST & FOUND - VIP\n\nMon - 3 Nordics (admiration), 1 Reptilian (heat; tipped 5%)\nTue - 2 Martians (outrage; started a fight about Pluto; good night)\nWed - 1 Grey (sample; asked for a receipt)\nThu - "the one with the red headband" (didn\'t feed. just drank. didn\'t pay)\nFri - Mr. White (did not come in; stood outside; looked at the door for an hour)\n\nNotes: J. says this is a betrayal. T. says this is bookkeeping. They are both writing in the same handwriting.');
CONV.bouncer = async (e) => { if (F.lindasDone || F.metTherese) { await T('N', '"Go on up."'); return; } await T('N', '"Office is staff only." He looks you up and down. "You staff?"'); const c = await C(['I work for the Commissioner.', { t: '[DENIAL] I\'m a normal human who works here.', req: ['denial', 1] }, { t: '[RANT] I have been told no by bigger men than you and they all regretted it, and by regretted it I mean they had to listen to me for a really long time.', req: ['rant', 2] }, 'Never mind.']); if (c === 0 || c === 1 || c === 2) { await T('N', c === 2 ? '"...Fine. FINE. Go up. Stop talking."' : '"...Fine. Don\'t touch the safe."'); const d = doorById('office'); if (d) { d.lock = 0; d.unlocked = 1; } F.bouncerOK = 1; } };
CONV.bartender_sm = async (e) => { const c = await C(['What\'s good?', 'Who comes here?', 'Bye.']); if (c === 0) await shopUI({ name: 'LOST & FOUND BAR', items: [['liquor', 8, 9], ['soda', 3, 9], ['biocell', 40, 2]] }, e); else if (c === 1) await T('BARTENDER', 'Everybody comes here. Some of everybody leaves with less than they came in with. I don\'t ask.'); };

// ---------- street folk ----------
CONV.cop_sm = async () => { await T('N', pick(['"Evening. Nice costume. Big night at the pier?"', '"Move along, kid. And take the hat off, it\'s a school night."', '"You seen any lights over the beach? Don\'t answer. I don\'t want to write it down."'])); };
CONV.pill_sm = async (e) => { if (!F.pillTalk) { F.pillTalk = 1; await T('N', 'A pillhead with sunken eyes grabs your sleeve. "I see you. I see what you are. You\'re- huh. You\'re just a little guy. Everyone else has a face under their face. You\'ve just got a face."'); await T('CARL', 'Thank you? Is that- thank you.'); return; } await T('N', pick(['"Got any Prop Pills? I\'ll trade you a secret."', '"The one in the diner booth? Lizard. Don\'t sit near him. You\'ll catch a chill."'])); };
CONV.diner = async (e) => { const c = await C(['Pie, please.', 'Coffee.', 'Bye.']); if (c < 2) { if (P.cred >= (c === 0 ? 2 : 1)) { P.cred -= c === 0 ? 2 : 1; for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 6); await T('N', c === 0 ? 'The pie is warm and real and nobody asks where you\'re from.' : 'The coffee is bad in a way that feels like home.'); gainHumanity(c === 0 ? 'ate pie' : 'drank coffee like a person'); F.dinerOnce = 1; } else await T('N', '"On the house, hon." She means it. The coffee is terrible.'); } };
CONV.homeless_sm = async () => { await T('N', pick(['"They come out of the beach house at night. They walk on the sand like they\'re trying it out. Like they\'re new at legs."', '"Spare a dollar? No? Spare a word, then. Any word."', '"I used to be an astronomer. Now I just look up for free."'])); };
CONV.surfer = async () => { await T('N', pick(['"Dude. The water\'s warm by the beach house. Like, WARM warm. Like something\'s down there breathing."', '"Gnarly hat, little dude."'])); };

// ---------- MAP: Santa Monica streets ----------
{
  const g = mk(100, 66, '.');
  g.fill(0, 0, 100, 2, '#'); g.fill(0, 0, 1, 56, '#'); g.fill(99, 0, 1, 56, '#');
  g.fill(1, 18, 98, 4, ','); g.fill(1, 38, 98, 3, ','); g.fill(28, 2, 3, 40, ','); g.fill(60, 2, 3, 40, ',');
  g.fill(1, 44, 98, 12, ':'); g.fill(0, 56, 100, 3, '~'); g.fill(0, 59, 100, 7, '"');
  g.fill(43, 44, 6, 21, '`'); g.fill(40, 59, 12, 6, '`');
  // the bluff and the Ocean House
  g.fill(1, 2, 26, 15, ';'); g.rect(2, 3, 24, 13, '=', ';'); g.put(13, 15, 'G'); g.put(15, 16, 'Z');
  g.rect(5, 4, 17, 9, '#', ';'); g.put(13, 12, 'O');
  // diner + pawn shop
  g.rect(33, 5, 13, 10, '%', ':'); g.put(39, 14, 'Y'); g.fill(34, 6, 11, 1, 'W'); g.put(38, 15, 'm');
  g.rect(48, 6, 10, 9, '#', ':'); g.put(52, 14, 'P');
  // parking lot + cab stand
  g.fill(65, 3, 32, 13, ','); g.put(70, 16, 'T');
  // block south of Ocean Ave
  g.rect(3, 24, 22, 11, '%', ':'); g.put(13, 24, 'K');                       // free clinic
  g.rect(33, 24, 11, 11, '#', ':'); g.put(38, 24, 'H'); g.put(36, 23, 'n');   // laundromat (haven upstairs)
  g.rect(47, 24, 11, 11, '#', ':'); g.put(52, 24, 'A');                       // Tommy's building
  g.rect(65, 24, 18, 12, '$', ':'); g.put(73, 24, 'L');                       // the Lost & Found
  g.fill(85, 23, 13, 14, ';');                                                // park
  // alley behind the block
  g.fill(3, 35, 80, 3, '.');
  // beach house
  g.rect(82, 45, 14, 9, '#', ':'); g.put(88, 45, 'B'); g.fill(83, 54, 12, 1, '`'); g.put(89, 54, 'Q');
  g.put(86, 43, 'j');
  // details
  for (let x = 6; x < 98; x += 11) { g.put(x, 17, 'l'); g.put(x + 4, 22, 'l'); }
  for (let x = 4; x < 98; x += 13) g.put(x, 42, 'p');
  g.put(12, 36, 'd'); g.put(40, 36, 'd'); g.put(62, 36, 'd'); g.put(47, 30, 'v');
  g.put(90, 26, 'p'); g.put(94, 33, 'p'); g.put(88, 30, 'b'); g.put(92, 29, 'b');
  g.put(42, 16, 'u'); g.put(46, 52, 'a'); g.put(48, 52, 'a'); g.put(44, 61, 'a'); g.put(50, 61, 'a');
  defMap('sm_streets', { name: 'SANTA MONICA', title: 'SANTA MONICA', sub: 'OCEAN AVENUE - THE PIER - 1:40 AM', hub: 'sm', music: 'santamonica', f: ['concrete', 'road', 'sand', 'grass', 'dock'], w: ['brick', 'office', 'neon'], fence: 'fence', amb: .22, shadow: '#0a0410', mem: '#1a1030',
    grid: g.str(),
    key: {
      G: door({ id: 'ohgate', name: 'OCEAN HOUSE GATE', lock: 1, str: .3 }),
      O: [door({ id: 'ohdoor', name: 'OCEAN HOUSE' }), exitTo('oh_lobby', 'front')],
      Y: [door({ name: 'BLUE MOON DINER' }), exitTo('sm_diner', 'front')], m: reader('sm_menu', { p: 'sign', label: 'MENU' }),
      P: [door({ name: 'PAWN SHOP' }), exitTo('sm_pawn', 'front')],
      K: [door({ name: 'FREE CLINIC' }), exitTo('sm_clinic', 'front')],
      H: [door({ name: 'LAUNDROMAT / 2C' }), exitTo('sm_haven', 'front')], n: reader('sm_tommy_note', { p: 'poster', label: 'NOTE' }),
      A: [door({ name: 'APARTMENTS' }), exitTo('sm_tommy', 'front')],
      L: [door({ name: 'THE LOST & FOUND' }), exitTo('sm_club', 'front')],
      B: [door({ id: 'bhfront', name: 'BEACH HOUSE', lock: 1, pick: 0, str: 1, metal: 1, hp: 130 }), exitTo('sm_beachhouse', 'front')],
      Q: exitTo('sm_beachhouse', 'deck', { frobbable: 1, label: 'BEACH HOUSE DECK STAIRS', verb: 'SNEAK UP', when: () => !F.bhDone, no: 'There is nothing left of the beach house but smoke and a smell like the inside of a TV.' }),
      j: reader('sm_bhsign', { p: 'sign' }), Z: reader('sm_ohsign', { p: 'sign' }),
      T: exitTo('dt_streets', 'cab', { frobbable: 1, label: 'CAB TO DOWNTOWN', verb: 'RIDE', when: () => F.smDone, no: 'The cabbie looks at you. "Downtown? Not tonight, kid. Nobody\'s called you Downtown."' }),
      l: pr('lamp'), p: pr('palm'), d: pr('dumpster'), b: pr('bench'), a: pr('arcade'), u: reader('sm_bulletin', { p: 'sign', label: 'COMMUNITY BOARD' }),
      v: [{ tile: T_VENT }, exitTo('sm_tommy', 'vent', { frobbable: 1, label: 'VENT (APARTMENT 1B)', verb: 'CRAWL IN' })],
    },
    routes: { c1: '1,2', c2: '3,4' },
    ents: [
      spawnPt('cab', -Math.PI / 2, { x: 70, y: 17 }), spawnPt('start', -Math.PI / 2, { x: 70, y: 17 }),
      // ocean ave
      npc('civ', { x: 20, y: 23, wander: 5, conv: 'cop_sm', sprite: 'civ1' }), npc('civ', { x: 50, y: 17, wander: 6, sprite: 'civ4' }), npc('civ', { x: 75, y: 22, wander: 4, sprite: 'civ2' }), npc('civ', { x: 34, y: 41, wander: 5, sprite: 'civ8' }),
      npc('cop', { x: 30, y: 21, route: 'c1', conv: 'cop_sm' }), npc('cop', { x: 88, y: 41, route: 'c2', conv: 'cop_sm' }),
      npc('pill', { x: 11, y: 37, conv: 'pill_sm', wander: 2 }),
      npc('civ', { id: 'danny', name: 'DANNY', sprite: 'civ8', x: 46, y: 58, conv: 'danny', ai: 'static', dir: 0 }),
      npc('civ', { id: 'truther', name: 'VTUBER_TRUTHER', sprite: 'civ6', x: 40, y: 22, conv: 'truther', ai: 'static', dir: 1, cond: () => !!F.havenOnce }),
      npc('civ', { name: 'SURFER', sprite: 'surfer', x: 30, y: 50, conv: 'surfer', wander: 4 }), npc('civ', { name: 'SURFER', sprite: 'surfer', x: 60, y: 52, conv: 'surfer', wander: 3 }),
      npc('civ', { name: 'MAN IN THE PARK', sprite: 'civ3', x: 91, y: 31, conv: 'homeless_sm', ai: 'static', dir: 0 }),
      vnpc('visitor', 'reptilian', { sprite: 'suit', x: 37, y: 16, ai: 'static', conv: 'visitor_sm', dir: 1 }), vnpc('visitor', 'nordic', { sprite: 'civ7', x: 47, y: 47, ai: 'static', conv: 'visitor_sm', dir: 0 }),
      light(4, .7, { x: 73, y: 23, col: '#ff40a0' }), light(4, .6, { x: 39, y: 16, col: '#80a0ff' }), light(3, .4, { x: 13, y: 16 }), light(5, .8, { x: 46, y: 62, col: '#ff60c0' }), light(3, .6, { x: 70, y: 16 }),
      { k: 'chatter', a: 'cs1', b: 'cs2', r: 6, x: 80, y: 16, lines: [['cs1', 'You hear the beach house is for sale?'], ['cs2', 'Who\'d buy it?'], ['cs1', 'Somebody who doesn\'t sleep.'], ['cs2', 'That\'s everybody in this town.']] },
      npc('civ', { id: 'cs1', x: 79, y: 15, sprite: 'civ2', ai: 'static', dir: 0 }), npc('civ', { id: 'cs2', x: 81, y: 15, sprite: 'civ1', ai: 'static', dir: 2 }),
      Object.assign(tape(1), { x: 93.5, y: 35.5 }),
      pr('cab', { x: 71, y: 13 }), item('biocell', 1, { x: 64.5, y: 36.5 }), item('a_10mm', 1, { x: 4.5, y: 36.5 }),
      pr('rubble', { x: 85, y: 49, cond: () => F.bhDone }), pr('rubble', { x: 90, y: 47, cond: () => F.bhDone }), pr('firebarrel', { x: 88, y: 51, cond: () => F.bhDone }), pr('firebarrel', { x: 92, y: 50, cond: () => F.bhDone }),
    ],
    enter(M, first) { goalDone('pro_cab'); if (first && !F.smArrive) { F.smArrive = 1; run(async () => { await delay(1); infolink('TOMMY', 'Carl? It\'s Tommy. Two-Pills. Your fixer. Building next to the laundromat, 3A. Come up. Don\'t eat anybody on the way.'); goal('sm_meet', 'Meet Tommy Two-Pills in his apartment (building next to the laundromat, south side of Ocean Avenue).'); }); } },
  });
  // waypoints for the cops
  const gd = MAPS.sm_streets; const rows = gd.grid.split('\n'); const put = (x, y, c) => { const r = rows[y].split(''); r[x] = c; rows[y] = r.join(''); };
  put(30, 21, '1'); put(30, 39, '2'); put(70, 41, '3'); put(96, 41, '4'); gd.grid = rows.join('\n');
}
CONV.visitor_sm = async () => { await T('N', pick(['A man in a sharp suit sits very still in the cold. "Be normal," he says, and his breath fogs, in July.', 'A tall blond woman watches the water. When she looks at you, you feel your skin go warm and then empty. "Sorry. Habit."'])); };

// ---------- MAP: Carl's haven (2C, above the laundromat) ----------
{
  const g = mk(20, 13, '#');
  g.rect(0, 0, 20, 13, '#', ':'); g.fill(1, 1, 18, 1, 'W'); g.put(9, 12, 'x');
  g.put(2, 2, 'b'); g.put(6, 2, 'c'); g.put(12, 2, 'r'); g.put(15, 2, 't'); g.put(17, 3, 'f'); g.put(2, 8, 'm'); g.put(8, 6, 's'); g.put(16, 8, 'k'); g.put(12, 9, 'o');
  defMap('sm_haven', { name: 'HAVEN: 2C', title: 'HAVEN', sub: '2C, ABOVE THE LAUNDROMAT', hub: 'sm', music: 'convo', f: ['wood', 'wood', 'carpet'], w: ['office'], amb: .35, shadow: '#100818',
    grid: g.str(),
    key: {
      x: [door({ name: 'FRONT DOOR' }), exitTo('sm_streets', 'haven_out')],
      b: pr('bed', { label: 'BED (SAVE)', frob: async () => { await saveUI(true); } }),
      c: comp([['carl', 'pills', { mail: ['sm_m1', 'sm_m2', 'sm_m3', 'sm_m4'] }]], { label: 'CARL\'S COMPUTER', c: { hackStr: .1 } }),
      r: pr('radio', { label: 'RADIO (DEEP NIGHT WITH DEB)', frob: () => run(playRadio) }),
      t: pr('tv', { text: 'sm_tv', label: 'TV' }), f: pr('fridge', { items: [['soda', 2], ['biocell', 1]], label: 'FRIDGE' }),
      m: reader('sm_mirror', { p: 'sign', label: 'MIRROR' }), s: pr('sofa'), k: pr('locker', { label: 'STASH', items: [['medkit', 1]] }), o: pr('crt', { text: 'sm_ringlight', label: 'RING LIGHT' }),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 9, y: 11 }), light(4, .7, { x: 9, y: 6, col: '#ffc080' }), light(2, .5, { x: 12, y: 9, col: '#ffffff' }), Object.assign(tape(2), { x: 2.5, y: 10.5 }), item('w_crowbar', 1, { x: 17.5, y: 10.5 })],
    enter(M, first) { if (first) { F.havenOnce = 1; goalDone('sm_haven', 100); learnLogin('carl', 'pills'); addNote('Your computer login (on a sticky on the monitor): carl / pills.'); infolink('TOMMY', 'Computer password\'s on the monitor. carl, pills. I picked it. You\'re welcome. Radio works. Don\'t touch the fridge, there\'s a thing in it. The thing is a soda.'); } },
  });
}
txt('sm_tv', 'TV', 'CHANNEL 4 NEWS AT TWO: "...the Santa Monica pier will remain open despite reports of lights. A Pretend Co. spokesman said the lights are part of a promotional event for a product that does not yet exist."\n\nThe anchor smiles too long.');
txt('sm_ringlight', 'RING LIGHT', 'Your ring light. The Consulate brought it back. Somebody has put a small label on it: PROPERTY OF THE NORMALCY.\n\nYou could stream. You do stream. Chat is right there. Chat is always right there.');
// the street spawn for leaving the haven
MAPS.sm_streets.ents.push(spawnPt('haven_out', Math.PI / 2, { x: 38, y: 22 }), spawnPt('tommy_out', Math.PI / 2, { x: 52, y: 22 }), spawnPt('club_out', Math.PI / 2, { x: 73, y: 22 }), spawnPt('clinic_out', Math.PI / 2, { x: 13, y: 22 }), spawnPt('diner_out', Math.PI / 2, { x: 39, y: 16 }), spawnPt('pawn_out', Math.PI / 2, { x: 52, y: 16 }), spawnPt('oh_out', Math.PI / 2, { x: 13, y: 16.5 }), spawnPt('bh_out', -Math.PI / 2, { x: 88, y: 43 }), spawnPt('deck_out', Math.PI / 2, { x: 89, y: 55.5 }), spawnPt('vent_out', Math.PI, { x: 45.5, y: 30.5 }));

// ---------- MAP: Tommy's building ----------
{
  const g = mk(30, 16, '#');
  g.fill(1, 1, 4, 5, ':'); g.fill(6, 1, 9, 5, ':'); g.fill(16, 1, 13, 5, ',');   // 1A, 2B, Tommy's 3A
  g.fill(1, 7, 28, 2, '.');                                                     // hallway
  g.fill(1, 10, 12, 5, ':'); g.fill(14, 9, 3, 6, '.'); g.fill(18, 10, 11, 5, ':'); // Mrs. Alvarez, the stairs, 1B
  g.put(2, 6, '+'); g.put(9, 6, 'N'); g.put(19, 6, '+'); g.put(6, 9, '+'); g.put(23, 9, 'D'); g.put(15, 15, 'x');
  g.put(2, 1, 'b'); g.put(10, 3, 'B'); g.put(22, 3, 'T'); g.put(27, 1, 'k'); g.put(17, 1, 's'); g.put(3, 11, 'S'); g.put(25, 12, 'q'); g.put(29, 12, 'v');
  defMap('sm_tommy', { name: 'OCEAN AVE APARTMENTS', title: 'OCEAN AVE APARTMENTS', sub: '', hub: 'sm', music: 'convo', f: ['carpet', 'wood', 'concrete'], w: ['office'], amb: .3, shadow: '#0c0814',
    grid: g.str(),
    key: {
      x: [door({ name: 'STREET DOOR' }), exitTo('sm_streets', 'tommy_out')],
      N: door({ id: 'apt2b', name: '2B', lock: 1, str: .3 }), D: door({ id: 'apt1b', name: '1B', lock: 1, str: .5 }), '+': door({}),
      T: npc('pill', { id: 'tommy', name: 'TOMMY TWO-PILLS', sprite: 'tommy', port: 'TOMMY', conv: 'tommy', ai: 'static', dir: 0, invuln: 1 }),
      k: pr('shelf', { items: [['pills', 2]] }), s: pr('sofa'), b: pr('bed'),
      B: npc('civ', { name: 'SLEEPING TENANT', sprite: 'civ3', ai: 'static', down: 1, state: 'down', sleeper: 1 }),
      S: npc('civ', { name: 'MRS. ALVAREZ', sprite: 'civ2', conv: 'alvarez', ai: 'static', dir: 1 }),
      q: pr('crate', { items: [['a_shell', 1], ['w_shotgun', 1]], label: 'GUN CASE' }),
      v: [{ tile: T_VENT }, exitTo('sm_streets', 'vent_out', { frobbable: 1, label: 'VENT (OUTSIDE)', verb: 'CRAWL OUT' })],
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 15, y: 14 }), spawnPt('vent', Math.PI, { x: 27.5, y: 12.5 }), light(3, .6, { x: 23, y: 3 }), light(3, .5, { x: 15, y: 8 }), light(2, .4, { x: 4, y: 12 })],
  });
}
CONV.alvarez = async (e) => { if (!F.alvarez) { F.alvarez = 1; await T('N', 'An old woman watching a game show with the sound off. "You\'re Tommy\'s friend. You\'re very small. Sit, I\'ll make you a plate."'); const c = await C(['Thank you. I\'d love a plate.', 'I can\'t stay.']); if (c === 0) { await T('N', 'She gives you rice and beans and does not ask a single question. It is the most normal you have felt in years.'); for (const k in P.parts) P.parts[k] = 100; gainHumanity('let someone feed you'); } return; } await T('N', pick(['"Eat, eat."', '"That Tommy. He sees things. I tell him, everybody sees things. He sees them more."'])); };

// ---------- MAP: the Lost & Found ----------
{
  const g = mk(36, 26, '$');
  g.rect(0, 0, 36, 26, '$', '.');
  g.fill(8, 8, 16, 10, '`');           // dance floor
  g.put(16, 25, 'x'); g.put(17, 25, 'x');
  g.put(2, 4, 'R'); g.put(10, 4, 'S'); g.put(14, 2, 'J'); g.put(28, 6, 'V'); g.put(29, 8, 'v'); g.put(31, 8, 'v');
  g.rect(26, 15, 10, 11, '%', ':'); g.put(26, 20, 'O'); g.put(31, 18, 'T'); g.put(33, 23, 'K'); g.put(28, 23, 'k'); g.put(33, 17, 'y');
  g.put(25, 20, 'b'); g.put(14, 20, 'd'); g.put(18, 20, 'd'); g.put(12, 13, 'd'); g.put(20, 11, 'd');
  g.put(6, 21, 'c'); g.put(4, 18, 'c');
  defMap('sm_club', { name: 'THE LOST & FOUND', title: 'THE LOST & FOUND', sub: 'NIGHTCLUB', hub: 'sm', music: 'lounge', f: ['neon', 'neon', 'carpet', 'neon', 'tile'], w: ['neon', 'office'], amb: .18, shadow: '#140418',
    grid: g.str(),
    key: {
      x: [door({ name: 'EXIT' }), exitTo('sm_streets', 'club_out')],
      R: pr('bar'), S: pr('stage'), J: pr('jukebox'),
      V: npc('civ', { id: 'jeanette', name: 'JEANETTE LINDA', sprite: 'jeanette', port: 'JEANETTE', conv: 'jeanette', ai: 'static', dir: 0, vis: 'broadcast', knows: 1, invuln: 1 }),
      v: vnpc('visitor', 'nordic', { sprite: 'civ7', ai: 'static', conv: 'visitor_sm', dir: 2 }),
      O: door({ id: 'office', name: 'OFFICE (STAFF ONLY)', lock: 1, str: .6 }),
      T: npc('civ', { id: 'therese', name: 'THERESE LINDA', sprite: 'therese', port: 'THERESE', conv: 'therese', ai: 'static', dir: 3, vis: 'broadcast', knows: 1, invuln: 1 }),
      K: pr('locker', { id: 'safe', label: 'SAFE', items: [['ledger', 1], ['credits', 150]], frob: async (M, e) => { const loot = () => { if (e.items && e.items.length) { for (const [id, n] of e.items) giveItem(id, n); e.items = []; F.ledger = 1; sfx('pickup'); } else msg('Empty.'); }; if (F.safeOpen) { loot(); return; } await keypadUI({ code: '1957', onOpen: () => { F.safeOpen = 1; loot(); } }); } }),
      k: comp([['therese', 'ledger', { mail: ['sm_tm1'] }]], { c: { hackStr: .35 } }),
      y: reader('sm_sticky', { p: 'poster', label: 'STICKY NOTE' }),
      b: npc('bouncer', { id: 'bouncer', conv: 'bouncer', ai: 'static', dir: 2 }),
      d: npc('civ', { sprite: 'civ4', ai: 'static', dancer: 1, dir: 0 }), c: npc('civ', { sprite: 'civ8', ai: 'static', dir: 1 }),
    },
    ents: [spawnPt('front', -Math.PI / 2, { x: 16.5, y: 23 }), npc('bartender', { x: 4, y: 5, name: 'BARTENDER', sprite: 'bartender', port: 'BARTENDER', conv: 'bartender_sm', ai: 'static', dir: 0, team: 'civ' }),
      light(5, .8, { x: 16, y: 12, col: '#ff40c0' }), light(4, .7, { x: 10, y: 5, col: '#8040ff' }), light(3, .6, { x: 4, y: 5, col: '#ffa040' }), light(3, .6, { x: 30, y: 19 }), light(3, .5, { x: 29, y: 7, col: '#ff4080' }), Object.assign(tape(3), { x: 34.5, y: 2.5 })],
    tick(M) { if (species() === 'nordic' && P.moving && tAt(M, P.x, P.y) === T_FLOOR && P.x > 8 && P.x < 24 && P.y > 8 && P.y < 18) { P.bio = Math.min(100, P.bio + 3 * DT); if (frame % 90 === 0) M.fx.push({ txt: pick(['wow', '*stares*', 'who IS that']), x: P.x + 1, y: P.y, t: 50, t0: 50, c: hex('#ffc0e0') }); } for (const e of M.ents) if (e.dancer && !e.down && !e.feeding) { e.face += .05; e.walkPh += .2; e.moving = (frame >> 4) & 1; } },
  });
  NPCT.bartender = NPCT.civ;
}
mail('sm_tm1', 'T.', 'consulate.office', 'Re: the ledger', 'Commissioner,\n\nAs discussed. The ledger of the VIP room, in exchange for the Consulate\'s patience with the club\'s debts. My sister will not be told.\n\nThe safe code is the year the house on the bluff closed. I find that funny. She does not.\n\n- T.L.', { code: '1957', note: 'Therese\'s safe code: the year the Ocean House closed (1957).' });

txt('sm_sticky', 'STICKY NOTE', 'Safe: the year the house on the bluff closed.\nDo NOT write this down. - T\n\n(I wrote it down. - J)\n\nComputer: therese / ledger. (Also do not write this down.) (Wrote it down. - J)', { login: ['therese', 'ledger'], note: 'Therese\'s safe code is the year the Ocean House closed. Her computer login is therese / ledger.' });
txt('sm_ohsign', 'SIGN', 'THE OCEAN HOUSE HOTEL\nEST. 1951 - CLOSED 1957\n\nFOR SALE\n(again)');
