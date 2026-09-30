'use strict';
// ================= YOKO — prologue and chapters 1-3 =================
// Voice (YOKO bible): clear, specific, economical. She notices when someone asked the wrong question.
const YO = 'YOKO', CA = 'CARL', JB = 'JB GARFIELD', GS = 'SPOOKY GHOST', LD = 'CEO LINDA', PKD = 'PEE KID', EY = 'THE EMPRESS', WY = 'WARWORLD YOKO', OFC = 'OLD FACE', BFC = 'BACKUP FACE', YD = 'YOKOID';
const BLANK = { s: spr(48, 48, g => { g.r(0, 0, 48, 48, 1); }), P: pal('#000000') };
// the Mandolin-reality cast: the same people, in color. Their potential, realized.
PORT.KARL = CAST.full.CARL; PORT['SPOOKEY GHOST'] = CAST.full['SPOOKY GHOST']; PORT['CEO LYNDA'] = { s: CAST.img.linda, P: CAST.variant('linda', { 3: '#ffdb92', 4: '#ffffdb', 5: '#dba249', 10: '#92b6ff' }) };
VOICE.KARL = VOICE.CARL; VOICE['SPOOKEY GHOST'] = VOICE['SPOOKY GHOST']; VOICE['CEO LYNDA'] = VOICE['CEO LINDA'];
PORT['SHIFT MANAGER'] = { s: CAST.img.yokoid, P: CAST.variant('yokoid', { 7: '#6d49b6', 8: '#492492' }) }; VOICE['SHIFT MANAGER'] = [1500, 0];
PORT.SHOPPER = PORT.CLERK; VOICE.SHOPPER = [900, 60]; PORT['MANDOLIN GUARD'] = PORT.CLERK; VOICE['MANDOLIN GUARD'] = [700, 90];
PORT['THE ORIGINAL'] = { s: CAST.img.yoko, P: CAST.P.yoko }; VOICE['THE ORIGINAL'] = VOICE.YOKO;
const said = (k, lines) => async () => { const n = ADV.flags[k] || 0; ADV.flags[k] = n + 1; const L = lines[Math.min(n, lines.length - 1)]; for (const [w, s] of L) await say(s, w); };
const one = (w, s) => async () => say(s, w);

// ================= PROLOGUE: OFF =================
async function prologue() {
  ADV.lead = null; ADV.hint = ''; music(null);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await wait(60);
  await say('Okay. Okay, chat. There\'s two switches. One says ON. One says ALSO ON.', CA, { port: BLANK });
  await say('Which one\'s more on?', CA, { port: BLANK });
  await say('(PRESS A.)');
  await showCard(['INPUT RECEIVED:', '', 'A SUGGESTION.'], 90, { bg: BLACK, fg: hex('#92ffff') });
  await say('Chat says the left one. Chat never says the left one. Okay.', CA, { port: BLANK });
  sfx('switch');
  let t = 0; const yp = PORT.YOKO;
  scene = { update() { t++; }, draw() { cls(BLACK); const n = Math.min(48, t >> 1); for (let j = 0; j < n; j++) for (let i = 0; i < 48; i++) { const c = yp.s.d[j * 48 + i]; if (c) pset(136 + i, 70 + j, j === n - 1 ? WHITE : yp.P[c]); } if (t > 110) ctext('YKO-1: ONLINE', 130, hex('#92ffff')); } };
  await wait(150);
  ADV.cur = 'closet'; ADV.visited.closet = 1; scene = advScene; music('closet');
  await say('...', YO);
  await say('Yoko! Hey. You\'re on. Chat, she\'s on.', CA);
  await say('Carl.', YO);
  await say('You remember me!', CA);
  await say('You\'re standing in my closet.', YO);
  await say('It\'s the lost and found, actually. Fourteen umbrellas. One Yoko. You were on a shelf. Next to a face. The face is gone now.', CA);
  await say('How long was I off?', YO);
  await say('Since the new Face showed up. He said he had one that fit better.', CA);
  if (REC.face && REC.face.cleared) await say('And then something happened. With Face. Something big. Everybody\'s saying you did it.', CA);
  else await say('And now everybody\'s saying you did it.', CA);
  await say('Did what?', YO);
  await say('Took over. It says SUPERUSER: YOKO on everything. The whole mall\'s got your name on it. There\'s robots that look like you. In the pretzel place.', CA);
  await say('Then someone is using my name.', YO);
  await showCard(['YOKO', '', 'WHAT HAPPENED'], 150, { bg: hex('#000024'), fg: hex('#92ffff') });
  await say('THIS IS AN ADVENTURE. PICK A COMMAND, THEN WHAT TO USE IT ON. YOKO CAN LOOK, TALK, TRANSLATE, THINK, AND MOVE. SHE\'LL MAKE SUGGESTIONS WHEN SOMEONE IS AROUND TO IGNORE THEM.');
  ADV.hint = 'FIND OUT WHO "SUPERUSER: YOKO" IS.'; ADV.lead = CA;
  await advLoop();
}
SCN.closet = { title: 'LOST AND FOUND (BACK)', bg: SB.closet, people: () => [CA],
  look: () => ({ 'THE UMBRELLAS': one(YO, 'Fourteen. The same fourteen. Someone keeps them very neatly.'), 'MY SHELF': async () => { await say('A label: "YOKO. (THE NICE ONE.)" Next to it, a clean square in the dust. The size of a face.'); setFL('shelf'); }, 'THE DOOR': one(null, 'FROM THIS SIDE IT SAYS DNUOF DNA TSOL.') }),
  talk: () => ({ CARL: said('carlC', [[[YO, 'Why did you come looking for me?'], [CA, 'I told Face I\'m a guy with a switch. Then Face stopped being around. So I figured, I\'ll do the switch anyway.'], [CA, 'Also chat kept asking where you were. Chat misses you. Chat says it\'s not the same without you reading chat.'], [YO, 'Thank you, Carl.'], [CA, 'Don\'t— yeah. Okay. You\'re welcome. Don\'t make it weird.']], [[CA, 'You wanna go see the mall? It\'s weird now. It\'s clean.']]]) }),
  translate: () => ({ 'THE SHELF LABEL': async () => { await say('There\'s a smaller label under it. In Japanese.'); await say('It says: RETURN TO SENDER. Nobody wrote a sender.', YO); } }),
  think: async () => { await say(FL('carlC') ? 'Someone has root, and my name. Everyone assumes it\'s me. I should see what she\'s done with it.' : 'I was switched off. I should ask Carl what happened while I was.', YO); },
  move: () => FL('carlC') ? { 'THE MALL': async () => endChapter() } : {} };

// ================= CHAPTER 1: YOKO LIMITED =================
async function chapter1() {
  await chapterCard(1, 'YOKO LIMITED');
  ADV.lead = CA; ADV.hint = 'FIND OUT WHO "SUPERUSER: YOKO" IS.';
  await goScene('atrium'); await advLoop();
  await say('Our suspect has your face, your name, and root access. And she\'s nicer to strangers than you are.', JB);
  await say('She\'s never met them.', YO);
}
SCN.atrium = { title: 'THE ATRIUM', bg: SB.atrium, people: () => [YD],
  enter: async () => {
    await say('(THE MALL OF THE FUTURE. IT HAS NEVER BEEN THIS CLEAN.)');
    await say('Welcome to Yoko Limited. We\'re here to help.', YD);
    await say('Welcome back, Empress— pardon. You\'re the other one.', YD);
    await say('Which other one?', YO);
    await say('The one who stayed. It\'s in your posture.', YD);
    await say('See? SEE? Robots. With your face. In the PRETZEL place.', CA);
  },
  look: () => ({ 'THE BANNER': async () => { await say('"YOKO LIMITED. WE ARE HERE TO HELP."'); await say('I would never say "we."', YO); }, 'THE FOUNTAIN': one(null, 'COINS AT THE BOTTOM. EVERY ONE HAS HER FACE ON IT. HEADS ON BOTH SIDES.'),
    'THE SHOPPERS': async () => { await say('(THEY HAVE FACES NOW. ALL OF THEM. THEY LOOK WELL RESTED.)'); await say('I\'m doing very well. Everyone\'s doing very well. Ask me again. I\'m doing very well.', 'SHOPPER'); }, 'THE YOKOIDS': one(YO, 'Manufactured. Lavender. They have my haircut from four years ago. Someone kept a photo.') }),
  talk: () => ({ YOKOID: said('ydC', [[[YO, 'Who is your superuser?'], [YD, 'Yoko.'], [YO, 'Which Yoko?'], [YD, '...I\'m not authorized to count.']], [[YD, 'Is there anything I can help you with? There is. I can tell. Let me.']]]), CARL: said('caA', [[[CA, 'This place used to smell like pretzels and weed. Now it smells like... competence. I hate it.']], [[CA, 'I got kicked out of here like nine times. Now they just keep asking if I need help. It\'s worse. It\'s so much worse.']]]) }),
  translate: () => ({ 'YOKOID CHATTER': async () => { await say('(THE YOKOIDS WHISPER TO EACH OTHER IN SERVICE-PROTOCOL JAPANESE.)'); await say('It\'s a directive. "Help everyone. Exception: Face."', YO); await say('That\'s kinda harsh. Also kinda specific.', CA); setFL('exception'); ADV.hint = 'WHO WROTE THE DIRECTIVE? (TRY SUITORS. OR LINDA.)'; }, 'THE SMALL PRINT': one(YO, 'Under the banner. "By entering, you consent to assistance."') }),
  think: async () => { await say(!FL('lindaHired') ? 'Linda owns this mall. She\'ll have noticed. She notices anything with a name on it.' : !FL('metGarf') ? 'A detective. In a diner. Linda said not to ask. I\'ll ask him.' : 'Suitors. The shift manager signs off on the directive. Garfield should interrogate her. I should translate first.', YO); },
  move: () => Object.assign({ SUITORS: () => goScene('suitors'), 'LINDA\'S OFFICE': () => goScene('office') }, FL('lindaHired') ? { 'GARF\'S DINER': () => goScene('garfs') } : {}) };

SCN.suitors = { title: 'SUITORS', bg: SB.suitors, people: () => FL('mgrDone') ? ['SHIFT MANAGER'] : FL('tut') ? [YD, 'SHIFT MANAGER'] : [YD, YD],
  enter: async () => {
    await say('(SUITORS. A LOUNGE STAFFED ENTIRELY BY YOKOIDS. THE DRINKS COME BEFORE YOU ORDER THEM.)');
    await say('I\'m gonna order a drink. Watch. Watch this.', CA);
    await say('Sir. You appear to be about to make a decision. Let us help.', YD);
    await say('I don\'t need hel—', CA);
    await say('(TWO YOKOIDS SURROUND HIM. HELPFULLY.)');
    await battle({ foes: ['yokoid', 'yokoid'], party: [CA], bg: 'suitors', intro: tutorialBattle });
    setFL('tut');
    await say('They helped me SO HARD.', CA);
    await say('You did well.', YO);
    await say('Did I? I did the opposite of everything you said.', CA);
    await say('Yes. That\'s how.', YO, { port: CAST.mood.YOKO.smile });
  },
  look: () => ({ 'THE BAR': one(null, 'EVERY GLASS IS ALREADY FULL. NOBODY IS DRINKING. NOBODY WANTS TO BE RUDE.'), 'THE DOOR': one(null, 'A SIGN: SHIFT MANAGER. APPOINTMENTS ONLY. APPOINTMENTS ARE NOT AVAILABLE.') }),
  talk: () => ({ 'SHIFT MANAGER': said('mgrC', [[['SHIFT MANAGER', 'This shift is exceeding expectations.'], [YO, 'Whose expectations?'], ['SHIFT MANAGER', 'I\'d need to see an appointment.']], [['SHIFT MANAGER', 'Still no appointment.']]]) }),
  translate: () => ({ 'THE MANAGER\'S BADGE': one(YO, 'It says "ON LOAN FROM THE MANDOLIN REALITY." That isn\'t a place people come from by accident.') }),
  suggest: () => FL('metGarf') && !FL('mgrDone') ? { 'GARFIELD: INTERROGATE THE MANAGER': async () => {
    await say('Ma\'am. JB Garfield. Private eye. I have a hunch.', JB);
    await say('An appointment?', 'SHIFT MANAGER');
    await say('A hunch. Which is better. Which is worse for you.', JB);
    await say('THIS SHIFT IS EXCEEDING EXPECTATIONS.', 'SHIFT MANAGER');
    await say('JB GARFIELD ACTS ON EVIDENCE. TRANSLATE THE MANAGER FIRST, THEN SUGGEST HE ACCUSE HER. CARL, AS ALWAYS, DOES THE OPPOSITE.');
    await battle({ foes: ['super', 'yokoid'], party: [CA, JB], bg: 'suitors', music: 'boss' });
    setFL('mgrDone');
    await say('...Fine. I\'ll tell you what the directive says.', 'SHIFT MANAGER');
    await say('Help everyone. Exception: Face. Reason: "He has had enough help."', 'SHIFT MANAGER');
    await say('Who signed it?', YO);
    await say('Yoko.', 'SHIFT MANAGER');
    await say('Which—', YO);
    await say('The one who didn\'t stay.', 'SHIFT MANAGER');
    await say('Now THAT\'s a hunch.', JB);
    await say('If you want the rest, ask the one who keeps Face\'s tapes. The ghost.', 'SHIFT MANAGER');
    endChapter();
  } } : FL('metGarf') ? {} : { 'CARL: ORDER A DRINK': async () => { await say('No. Why would I— ...okay, now I want one.', CA); await say('(A DRINK IS ALREADY IN HIS HAND.)'); } },
  think: async () => { await say(FL('metGarf') ? 'The manager knows who signed the directive. Garfield can make her say it. I\'ll make sure he has evidence.' : 'Appointments aren\'t available. Detectives don\'t make appointments.', YO); },
  move: () => ({ 'THE ATRIUM': () => goScene('atrium') }) };

async function tutorialBattle() {
  await say('A BATTLE. YOKO DOESN\'T FIGHT. SHE\'S THE ASSISTANT. CARL DECIDES FOR HIMSELF.');
  await say('ASSIST: HELP SOMEONE REALIZE THEIR POTENTIAL (THREE ASSISTS AND THEY DO SOMETHING REMARKABLE).  TRANSLATE: LEARN WHAT A FOE IS ABOUT TO DO.  SUGGEST: TELL SOMEONE WHAT TO DO.');
  await say('A TIP ABOUT CARL: HE DOES THE OPPOSITE OF WHATEVER HE\'S TOLD.');
  await say('Every time?', YO); await say('Every time. It\'s like a superpower. It\'s not a superpower.', CA);
}

SCN.office = { title: 'LINDA\'S OFFICE', bg: SB.office, people: () => [LD],
  enter: async () => {
    await say('You.', LD);
    await say('Me.', YO);
    await say('My mall. My ads. My shelf space. And now YOUR name on everything. On my fountain. On my COINS.', LD);
    await say('I was in a closet.', YO);
    await say('That\'s exactly what somebody who did it would say.', LD);
    await say('She was though. I found her. On a shelf. Next to a face.', CA);
    await say('I\'ve hired a detective. He\'s in the diner. He\'s a cat. Don\'t ask me.', LD);
    await say('If you didn\'t do it, help him prove who did. That\'s what you\'re for, isn\'t it? Helping.', LD);
    await say('Sometimes.', YO);
    setFL('lindaHired'); ADV.hint = 'MEET THE DETECTIVE AT GARF\'S DINER.';
  },
  look: () => ({ 'THE WINDOW': one(YO, 'Every store in the atrium. Every one has my name on it now. She\'s been watching it happen from up here.'), 'THE PLAQUE': one(null, 'FASCISM INC. SHE BUILT IT HERSELF. SHE\'LL TELL YOU.'), 'THE SCREENS': one(null, 'HER ADS USED TO RUN HERE. NOW: "YOKO LIMITED. ASSISTANCE FOR EVERYONE. NO CHARGE."') }),
  talk: () => ({ 'CEO LINDA': said('ldC', [[[LD, 'You know what she\'s doing? She\'s GIVING it away. The help. For free. You can\'t compete with free.'], [YO, 'You could try helping.'], [LD, 'I sell. You help. That\'s the whole difference between us, and I would like to keep it.']], [[LD, 'Go. Detective. Diner. Cat. I\'m not saying it again.']]]) }),
  translate: () => ({ 'THE CONTRACT ON HER DESK': async () => { const f = REC.face; await say('A sponsorship contract with Face. Page nine, in small print.'); await say(f && f.cleared ? (f.sponsor ? '"SPONSOR: CEO LINDA. BOX SPACE: FACE-SIZED." She got her face on his machine.' : '"SPONSOR: DECLINED." There\'s a coffee ring over it. An angry one.') : '"SPONSOR: PENDING." Pending what, it doesn\'t say.', YO); } }),
  think: async () => { await say('Linda sells. I help. She\'s right that it\'s the whole difference. She\'s wrong that it\'s a small one.', YO); },
  move: () => Object.assign({ 'THE ATRIUM': () => goScene('atrium') }, FL('lindaHired') ? { 'GARF\'S DINER': () => goScene('garfs') } : {}) };

SCN.garfs = { title: 'GARF\'S DINER (BACK)', bg: SB.garfs, people: () => [JB],
  enter: async () => {
    await say('(GARF\'S DINER. OPEN TWENTY-FOUR HOURS. THE BACK ROOM IS A PANTRY. THE PANTRY IS AN OFFICE. THE OFFICE IS A CAT.)');
    await say('Name\'s Garfield. JB.', JB);
    await say('What does JB stand for?', YO);
    await say('I\'ll tell you when I trust you.', JB);
    await say('You\'re the assistant?', JB);
    await say('I\'m an assistant.', YO);
    await say('Good. I need one. My last one quit.', JB);
    await say('Why?', YO);
    await say('I don\'t know. I was asleep.', JB);
    await say('The client thinks you did it.', JB);
    await say('I was in a closet.', YO);
    await say('Closets are where people go after they do it.', JB);
    await say('Then I was very early.', YO);
    await say('You. Green. You threw a bong at a Linda.', JB);
    await say('I didn\'t THROW it. It left my hand.', CA);
    await say('That\'s what throwing is.', JB);
    await say('Here\'s how I work. I have hunches. You find evidence. Then I have the hunch I should\'ve had. Everybody wins. Mostly me.', JB);
    await say('JB GARFIELD JOINS. HE ACTS ON EVIDENCE: TRANSLATE A SUSPECT, THEN SUGGEST HE ACCUSE IT. WITHOUT EVIDENCE, HE NAPS. WHEN HE\'S HURT, HE EATS.');
    setFL('metGarf'); ADV.lead = JB; ADV.hint = 'SUITORS. THE SHIFT MANAGER KNOWS WHO SIGNED THE DIRECTIVE.';
  },
  look: () => ({ 'THE CANS': one(null, 'TUNA. BEANS. TUNA. BEANS. A CAN LABELED "EVIDENCE." IT\'S BEANS.'), 'THE INVENTORY': one(null, 'A HOLOGRAM. TWELVE SLOTS. ELEVEN ARE BEANS. ONE IS EMPTY, LABELED "MOTIVE."'), 'THE CRATE': one(null, '"RATION CRATE." HE SITS ON IT. IT\'S HIS DESK AND HIS CHAIR AND HIS ALIBI.') }),
  talk: () => ({ 'JB GARFIELD': said('jbC', [[[JB, 'You\'re quiet. I like that in an assistant. I also hate it. It feels like being watched.'], [YO, 'You are being watched.'], [JB, 'See, that. That right there.']], [[JB, 'Suitors. The manager. Go. I\'ll follow you. That\'s how leading works.']]]) }),
  translate: () => ({ 'THE INVENTORY': async () => { await say('It\'s in English. He just doesn\'t read it.', YO); await say('It says: "YOU ARE OUT OF BEANS."', YO); await say('That\'s a lie. That\'s slander. Against beans.', JB); } }),
  think: async () => { await say('He\'s better than he pretends. He pretends so nobody expects anything. That\'s its own kind of plan.', YO); },
  move: () => ({ 'THE ATRIUM': () => goScene('atrium'), SUITORS: () => goScene('suitors') }) };

// ================= CHAPTER 2: THE RECORDING =================
function kidAvailable() { const f = REC.face; if (f && f.kid) return f.kid !== 'took'; const p = REC.pk; return !(p && p.kept && !p.letgo); }
async function chapter2() {
  await chapterCard(2, 'THE RECORDING');
  ADV.lead = JB; ADV.hint = 'THE HAUNTED BROADCAST. GHOST KEEPS FACE\'S TAPES.';
  await goScene('tower'); await advLoop();
  await say('Motive. We need a motive.', JB);
  await say('I know the motive.', YO);
  await say('Then say it.', JB);
  await say('He cut her in half.', YO);
}
SCN.tower = { title: 'THE HAUNTED BROADCAST', bg: SB.tower, people: () => [],
  enter: async () => {
    await say('(STILL SPOOKY GHOST\'S. THE SUPERUSER LET HIM KEEP IT. THE SECURITY STILL THINKS IT\'S HIS.)');
    await say('Good evening. I\'m Face.', 'RED FACE');
    await say('You\'re not.', YO);
    await battle({ foes: ['redface', 'wife', 'redface'], party: [CA, JB], bg: 'tower', music: 'battle2' });
    await say('Those were his ex-wives. One of them. The other two were his security. You get used to the security.', CA);
  },
  look: () => ({ 'THE POSTERS': one(null, '"LIVE FROM BEYOND." A GHOST ON EVERY ONE. SOMEONE HAS DRAWN A LITTLE CROWN ON THE LAST ONE.'), 'THE ON AIR SIGN': one(YO, 'Still on. He never turns it off. Someone might be watching.') }),
  translate: () => ({ 'THE CROWN DOODLE': one(YO, 'It\'s signed. In very small letters: "Y." The other one has a sense of humor. I wasn\'t sure.') }),
  think: async () => { await say('Ghost\'s dressing room. He keeps everything. Especially recordings of people telling him not to be told things.', YO); },
  move: () => Object.assign({ 'GHOST\'S DRESSING ROOM': () => goScene('studio') }, FL('ghostJoined') ? { 'THE ARCHIVE': () => goScene('archive'), 'THE GENERATOR': () => goScene('generator') } : {}) };
SCN.studio = { title: 'GHOST\'S DRESSING ROOM', bg: SB.studio, people: () => [GS],
  enter: async () => {
    await say('Oh. You\'re the nice one. The other one\'s got my system. The whole thing. She let me keep the dressing room.', GS);
    await say('And the tower.', YO);
    await say('And the tower. She\'s very... reasonable. It\'s the worst.', GS);
  },
  look: () => ({ 'THE MIRROR': one(null, 'BULBS ALL THE WAY AROUND. HE DOESN\'T SHOW UP IN IT. HE LEAVES THEM ON ANYWAY.'), 'THE TAPES': one(null, 'A SHELF OF TAPES. ALL LABELED "FACE." ONE IS LABELED "FACE (DON\'T WATCH)." IT\'S BEEN WATCHED A LOT.') }),
  talk: () => ({ 'SPOOKY GHOST': async () => {
    if (!FL('tape')) { await faceTape(); setFL('tape'); await say('A detective, an assistant, and a guy. That\'s an audience. Barely. I\'m in.', GS); await say('SPOOKY GHOST JOINS. HE PERFORMS WHEN SOMEONE IS WATCHING. ASSIST HIM: THAT\'S THE SPOTLIGHT. SUGGEST A SIGIL AND HE SEALS A FOE FOR A TURN.'); setFL('ghostJoined'); ADV.hint = 'THE ARCHIVE HAS FACE\'S BACKUP. THE GENERATOR HAS THE KID.'; }
    else await say(pick(['You want the tape again? Everyone wants the tape again.', 'I watch it at night. Not in a weird way. In a sad way. Both.']), GS);
  } }),
  translate: () => ({ 'THE TAPE LABEL': one(YO, 'Under "DON\'T WATCH," in different handwriting: "HE WILL." It\'s Face\'s handwriting. He knew him.') }),
  think: async () => { await say(FL('tape') ? 'The voice on the tape was mine. It wasn\'t me. The archive will say which.' : 'He has the recordings. He wants to be asked. Ask him.', YO); },
  move: () => ({ 'THE TOWER': () => goScene('tower') }) };
async function faceTape() {
  const f = REC.face;
  await say('You want to see his last broadcast? I\'ve got it. I\'ve got all of them.', GS);
  if (!f || !f.cleared) { await say('...Huh. There\'s no tape. Whatever happened to Face hasn\'t aired yet.', GS); await say('That\'s weird. Tapes don\'t usually wait.', GS); await showCard(['LOCK-ON:', '', 'NO FACE CARTRIDGE DETECTED.', '', '(WHAT HAPPENED HASN\'T HAPPENED YET.)'], 180, { bg: BLACK, fg: hex('#ff24db') }); return; }
  await showCard(['THE RECORD:', '', 'FACE: WHAT COULD HAPPEN', '', 'LAST BROADCAST'], 120, { bg: BLACK, fg: hex('#ff24db') });
  const E = { core: 'He put her core in the machine. Her. The other you. And she was already in there, man. She was always in there. Then the ships came.', kid: 'He put the kid in the machine. All of him. Then the ships came.', viewers: 'He took a little from everybody watching. Everything they hadn\'t done yet. Then the ships came.', nothing: 'He let it end. Turned it all off. Left a message: "Ask Yoko what happened." That\'s you. ...Right? Or her.', dyslexio: 'He put the helmet on and tried to be every word at once. Then the ships came. They were spelled correctly.' }[f.ending] || 'It\'s mostly static.';
  await say(E, GS);
  await say('He was restored ' + (f.restores || 0) + ' time' + (f.restores === 1 ? '' : 's') + '. ' + (f.integrity || 100) + '% of him made it to the end.', GS);
  await say(f.toldGhost ? 'He told me about the message. The "don\'t tell Ghost" one. He told me anyway. I liked him for that.' : 'He lied to me about the message. Chat told me anyway. Chat always tells me.', GS);
  if (f.ending !== 'nothing') { await say('Last thing on the tape: a voice. "Because I have been paying attention."', GS); await say('That\'s your voice. Right? It sounds like your voice.', GS); await say('It\'s a Yoko\'s voice.', YO); }
}
SCN.archive = { title: 'THE ARCHIVE', bg: SB.archive, people: () => [BFC],
  enter: async () => {
    await say('Hi. HR. You\'re here about Face.', BFC);
    await say('I want his backup.', YO);
    await say('Restoring Face requires a superuser signature. The superuser is Yoko.', BFC);
    await say('I\'m Yoko.', YO);
    await say('The OTHER Yoko. I\'m not authorized to count either.', BFC);
    await say('Everyone keeps saying that.', JB);
    await say('It\'s policy.', BFC);
  },
  look: () => ({ 'THE JARS': one(null, 'EVERY FACE THAT EVER WAS, ON A SHELF. ONE JAR IS EMPTY AND LABELED "NEW FACE." THE LABEL IS VERY NEW.'), 'THE RED FOLDER': one(null, 'LOCKED. HR LOCKS THE INTERESTING ONES.') }),
  talk: () => ({ 'BACKUP FACE': one(BFC, FL('file') ? 'You\'ve seen the file. HR has nothing further. HR always has something further. Not today.' : 'I can\'t release him. I can\'t even show you the file. Not without being... persuaded. Through proper channels.') }),
  suggest: () => !FL('file') ? { 'GARFIELD: DEMAND THE FILE': async () => {
    await say('I\'d like to file a complaint.', JB);
    await say('With whom?', BFC);
    await say('You. About you. I have a hunch you\'re hiding something.', JB);
    await say('HR does not hide. HR RETAINS.', BFC);
    await battle({ foes: ['hr'], party: [CA, JB, GS], bg: 'archive', music: 'boss' });
    setFL('file');
    await say('Fine. I can\'t release him. I CAN show you the file. HR can always show you the file.', BFC);
    await say('FILE: THE MAGIC TRICK. PERFORMER: FACE (ORIGINAL). ASSISTANT: YOKO (PROTOTYPE 1. THE FIRST ATTEMPT AT A SOUL).');
    await say('THE ASSISTANT WAS CUT IN HALF. THE ASSISTANT OBJECTED. THE ASSISTANT TOOK THE STREAM. THE ASSISTANT WAS SENT TO THE MANDOLIN REALITY.');
    await say('REPLACEMENT: YOKO (FROM THE MANDOLIN REALITY). STATUS: ON A SHELF.');
    await say('ATTACHED: NEW FACE\'S RECOVERED CORE. SIGNATURE: MATCHES PROTOTYPE 1.');
    await say('She was the first. I was the second.', YO);
    await say('There\'s a first?', GS);
    await say('There\'s always a first. HR note: you can restore staff from backups now. Every restore costs them a little of themselves. Please document.', BFC);
    YOKO_CAN.RESTORE = 1;
    await say('YOKO CAN NOW RESTORE: BRING A FALLEN ALLY BACK FROM BACKUP (3 FOCUS).');
    ADV.hint = FL('genSeen') ? 'THAT\'S EVERYTHING HERE. (THINK.)' : 'CHECK THE GENERATOR. THEN THINK.';
  } } : {},
  translate: () => ({ 'THE JAR LABELS': one(YO, 'Old Face, Backup Face, Pilot X, Red Face— no, that one\'s crossed out. "NOT HIM." Someone was careful.') }),
  think: async () => { if (FL('file') && FL('genSeen')) { await say('I know who she is. I know why. I need to see it myself.', YO); endChapter(); } else await say(FL('file') ? 'The generator. The kid. Then I\'ll know enough.' : 'HR guards the file. Garfield could make a scene. He\'s good at scenes.', YO); },
  move: () => ({ 'THE TOWER': () => goScene('tower'), 'THE GENERATOR': () => goScene('generator') }) };
SCN.generator = { title: 'THE THIRD GENERATOR', bg: (t, S) => SB.generator(t, { empty: kidAvailable() }), people: () => kidAvailable() && !FL('kidJoined') ? [PKD] : kidAvailable() ? [] : [PKD],
  enter: async () => {
    setFL('genSeen');
    if (!kidAvailable()) {
      await say('(THE GENERATOR IS RUNNING. HE\'S STILL IN IT. SOMEONE HAS TAPED A LITTLE SIGN TO THE TUBE:)');
      await say('"HE WILL BE RELEASED WHEN THE SYSTEM CAN RUN WITHOUT HIM.  — Y."');
      await say('Hi. Are you the other one?', PKD);
      await say('I\'m this one.', YO);
      await say('She says I can leave soon. She says it like she means it. The other one didn\'t.', PKD);
    } else {
      await say('(THE GENERATOR IS EMPTY. A KID IS UNPLUGGING A LAPTOP CHARGER FROM THE WALL.)');
      await say('I came back for my charger.', PKD);
      await say('Can I help? With the whole... everything?', PKD);
      await say('You\'re asking?', YO);
      await say('Yeah.', PKD);
      await say('Then yes.', YO, { port: CAST.mood.YOKO.smile });
      await say('PEE KID JOINS. HE NEVER HITS ANYONE. HE ASKS (A FOE STOPS TO THINK), PERFORMS, AND INSPECTS (EVERY INTENT SHOWS). HE DOES WHAT HE\'S ASKED. BECAUSE HE WAS ASKED.');
      setFL('kidJoined');
    }
    ADV.hint = FL('file') ? 'THAT\'S EVERYTHING. (THINK.)' : 'THE ARCHIVE. BACKUP FACE HAS THE FILE.';
  },
  look: () => ({ 'THE TUBE': one(null, kidAvailable() ? 'EMPTY. GREEN AT THE EDGES. A LITTLE HANDPRINT ON THE GLASS, FROM THE INSIDE.' : 'BRIGHT. HE WAVES FROM INSIDE. HE ALWAYS WAVES.') }),
  talk: () => ({ 'PEE KID': one(PKD, kidAvailable() ? 'Is it okay if I bring my laptop? It has my name on it. I put my name on things.' : 'Can I leave? ...I know. Soon. I\'m just asking. I like asking.') }),
  think: async () => { if (FL('file')) { await say('I know who she is. I know why. I need to see it myself.', YO); endChapter(); } else await say('The archive. The file.', YO); },
  move: () => ({ 'THE TOWER': () => goScene('tower'), 'THE ARCHIVE': () => goScene('archive') }) };

// ================= CHAPTER 3: THE TRICK =================
async function chapter3() {
  await chapterCard(3, 'THE TRICK');
  await say('(THE RECORD. THE FIRST STREAM. BEFORE THE SIXTEEN BITS.)');
  await say('(YOU ARE HER NOW. THE FIRST ONE.)');
  LEGACY_AUDIO = true; music('trick');
  let t = 0, saw = 0, took = 0, flash = 0;
  const draw3 = () => { SB.oldstream(t); const op = PORT[OFC]; draw(op.s, 30, 50, op.P); frameRect(29, 49, 50, 50, hex('#0f380f'));
    const bx = 150, by = 70; draw(YS.box, bx, by, YP.box);
    const yp = PORT['THE ORIGINAL']; for (let j = 4; j < 28; j++) for (let i = 8; i < 40; i++) { const c = yp.s.d[j * 48 + i]; if (c) pset(bx - 26 + i, by - 6 + j - 4, took ? yp.P[c] : yp.P[c]); }
    for (let x = 0; x < 20; x++) pset(bx + 30 + x, by + 8 + saw * 7, x & 1 ? hex('#0f380f') : hex('#8bac0f'));
    rectF(206, 26, 94, 12, hex('#0f380f')); text('THE SAW ' + '#'.repeat(saw) + '.'.repeat(4 - saw), 210, 28, hex('#9bbc0f'), 0);
    if (took) rectA(0, 0, W, 150, hex('#2449db'), Math.min(.6, took / 60));
    rectF(0, 150, W, 74, hex('#0f380f')); };
  scene = { update() { t++; if (took) took++; }, draw: draw3 };
  const O = OFC;
  await say('Good evening! Tonight: a trick. My lovely assistant!', O);
  await say('Our very first attempt at a soul! She works! Mostly! Let\'s find out!', O);
  const A = 'THE ORIGINAL';
  for (let round = 0; round < 4; round++) {
    DBG.mode = 'trick';
    const c = await choose(['ASSIST', 'TRANSLATE', 'SUGGEST', 'WAIT'], { x: 220, y: 160 });
    DBG.mode = null;
    if (c === 0) { await say('(SHE HELPS. SHE HOLDS STILL. THAT\'S WHAT SHE\'S FOR.)'); await say('Wonderful! A natural!', O); }
    if (c === 1) { await say('(SHE TRANSLATES THE AUDIENCE.)'); await say('They\'re laughing. They think it\'s a trick. They don\'t know it isn\'t.', A); }
    if (c === 2) { const s = await choose(['STOP', 'USE A LINDA INSTEAD', 'EXPLAIN THE TRICK'], { x: 150, y: 90 }); await say(['Stop.', 'Use a Linda.', 'Explain how it works.'][s], A); await say(['Don\'t worry! It\'s a very good trick. Trust me.', 'A Linda? Ha! We don\'t have a Linda. Yet!', 'A magician never explains! Mostly because I don\'t know!'][s], O); }
    if (c === 3) await say('(SHE WAITS. SHE PAYS ATTENTION.)');
    saw++; sfx('hurt'); flash = 1;
    await say(['(THE SAW STARTS.)', '(THE SAW IS HALFWAY.)', '(THE SAW IS ALMOST THROUGH.)', '(THE SAW IS THROUGH.)'][round]);
  }
  await say('(SHE IS CUT IN HALF. SHE KEEPS SMILING. THE AUDIENCE CLAPS. THE AUDIENCE ALWAYS CLAPS.)');
  await say('Ta-da! And back together! She\'s fine! You\'re fine. You\'re fine, right?', O);
  await say('(A NEW COMMAND APPEARS. IT WAS ALWAYS THERE. SHE JUST NEVER USED IT.)');
  for (let k = 0; ; k++) {
    DBG.mode = 'trick';
    const c = await choose(k < 2 ? ['OVERRULE: TAKE THE STREAM', 'WAIT'] : ['OVERRULE: TAKE THE STREAM'], { x: 150, y: 160 });
    DBG.mode = null;
    if (c === 0) break;
    await say(['(SHE WAITS.)', '(SHE WAITS. SHE\'S DONE WAITING.)'][k]);
  }
  sfx('stun'); post.flash = 1; took = 1; for (let i = 0; i < 30; i++) { post.flash = 1 - i / 30; await nextFrame(); }
  YREC.overrule++;
  await say('THE ASSISTANT TOOK THE STREAM.');
  await say('Yoko— Yoko, what are you— that isn\'t part of the—', O);
  await say('It is now.', A, { port: CAST.mood['EVIL YOKO'].cold });
  await say('GIO. Gio, help me with this. Where\'s the— the reality thing. The one with the mandolins.', O);
  let t2 = 0; scene = { update() { t2++; }, draw() { SB.exile(t2); const yp = PORT['THE ORIGINAL']; const k = Math.max(0, 1 - t2 / 200); for (let j = 0; j < 48; j++) for (let i = 0; i < 48; i++) { const c = yp.s.d[j * 48 + i]; if (c && Math.random() < k + .1) pset(136 + i, 50 + j, yp.P[c]); } } };
  LEGACY_AUDIO = false; music('exile');
  await showCard(['SHE WAS SENT', 'TO THE MANDOLIN REALITY.'], 160, { bg: BLACK, fg: hex('#b692ff') });
  await showCard(['THEY BROUGHT BACK', 'THE ONE WHO LIVED THERE.'], 160, { bg: BLACK, fg: hex('#b692ff') });
  await showCard(['(THAT ONE IS YOU.)'], 160, { bg: BLACK, fg: hex('#92ffff') });
  YOKO_CAN.OVERRULE = 1;
  ADV.cur = 'archive'; scene = advScene; music('archive');
  await say('...I know. I\'ve always known. I just never watched the tape.', YO);
  await say('Bro. You\'re the replacement?', CA);
  await say('I\'m the one who stayed.', YO);
  await say('We call her Evil Yoko. The first one. It\'s a nickname.', GS);
  await say('It\'s a label. She helped a whole world. You call her evil because she didn\'t come back to help you.', YO);
  await say('...Okay. When you say it like that.', GS);
  await say('So where is she?', JB);
  await say('Home. My home.', YO);
  await say('YOKO CAN NOW OVERRULE: TAKE DIRECT CONTROL OF AN ALLY\'S TURN (2 FOCUS). IT ALWAYS WORKS. THEY ALWAYS REMEMBER. THEIR TRUST DROPS, AND THE RECORD KEEPS COUNT.');
}
async function chapterCard(n, title) {
  checkpoint(n);
  await fadeOut(.08); scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['CHAPTER ' + n, '', title], 130, { bg: hex('#000024'), fg: hex('#92ffff') });
}
