'use strict';
// ================= PEE KID³ -- story, set pieces, minigames =================
const KD = 'PEE KID', WE = 'PEE-WEE KID', BY = 'PEE BOY', FC = 'FACE', GH = 'SPOOKY GHOST', ST = 'THE MOVIE STAR';
PORT.WITNESS = { s: adultPortrait('teacher'), P: ADULTPAL.monitor }; VOICE.WITNESS = [640, 40];
PORT.SUSPECT = { s: adultPortrait('star'), P: ADULTPAL.cop }; VOICE.SUSPECT = [300, 30];

// ---------- stage 1 ----------
async function stage1Intro() {
  await wait(30);
  await say('(FACE AND SPOOKY GHOST ARE STILL IN FOUR SHADES. THE NEW HARDWARE CAN\'T DRAW THEM. THEY CAN STILL TALK.)');
  await say('Good news. I\'ve improved the generator.', FC);
  await say('WE improved it. Third one. Third time\'s the charm.', GH);
  await say('Can I get out?', KD);
  await say('It can do much more now. It\'s running an entire new generation. Sixteen bits. Five hundred and twelve colors.', FC);
  await say('Can it open?', KD);
  await say('You\'re thinking too small, kid. Look at the colors. That\'s you. You\'re doing that.', GH);
  await say('I\'d like to go over there.', KD);
  await say('That isn\'t what I meant.', FC);
  await say('I know. I keep asking.', KD);
  sfx('glitch'); post.flash = .8; await wait(4); post.flash = 0;
  await say('(THE TUBE CRACKS. NOBODY PLANNED FOR HIM TO JUST... WALK.)');
  await say('Okay. I\'m going to go now. I really have to go. That\'s the whole problem.', KD);
  await say('ARROWS: MOVE.  B: JUMP.  A: ASK A QUESTION (ADULTS STOP TO THINK ABOUT IT).  UP: DOORS AND TALKING.  START: PAUSE.');
  await say('THE POTENTIAL GAUGE IS HOW BADLY HE NEEDS TO GO. THE HARDWARE RUNS ON IT. POWER DOORS NEED 60%. AT 100%... DON\'T LET IT HIT 100%.');
  await say('TO LET IT OUT: FIND A DOOR MARKED "WC", STAND IN FRONT OF IT, AND PRESS UP. THE SIGN BLINKS WHEN HE REALLY HAS TO GO.');
}
async function stage1Exit() {
  await say('Hey! HEY. Where do you think you\'re going? That\'s the generator\'s kid!', 'TECHNICIAN');
  await say('I\'m not the generator\'s kid. I\'m just a kid. If anything, it\'s my generator.', KD);
  await say('Buddy. Do you know how many people are counting on those graphics?', 'TECHNICIAN');
  await say('Can you explain the part where I get out?', KD);
  await say('...There\'s a bus.', 'TECHNICIAN');
  await stageClear();
}
async function adultsUpset() {
  const l = pick([[['THE GENERATOR JUST DROPPED TO FOUR COLORS. WHO LET HIM GO?', 'TECHNICIAN'], ['Nobody let me. That\'s the point. Nobody let me go.', KD]],
    [['Kid. We talked about this. Hold it.', FC], ['You say "hold it" like it\'s a job.', KD]],
    [['Aw, man. It\'s all green again. Kid. KID.', GH], ['I told everyone. I told everyone the whole time.', A().name]]]);
  for (const [t, w] of l) await say(t, w);
}
const PHOTOS = ['A KITCHEN. SOMEONE IS LAUGHING JUST OUTSIDE THE PHOTO.', 'A BIRTHDAY. THE CANDLES SAY 6. OR 9. IT\'S UPSIDE DOWN.', 'A DOG. NOBODY REMEMBERS THE DOG\'S NAME. THE DOG REMEMBERED EVERYONE\'S.',
  'A HOUSE WITH A FIRE ESCAPE. THE FOSTER HOME. BEFORE.', 'AN AIRPORT. TWO PEOPLE WAVING. THEY WERE COMING TO GET HIM.', 'A SCHOOL PICTURE. HE BLINKED.',
  'A BEACH. THE SEA IS OUT OF FOCUS. HE ISN\'T.', 'A GAME CONSOLE UNDER A TREE. THE OLD KIND. FOUR COLORS.', 'A HOSPITAL HALLWAY. A NURSE GIVING A THUMBS UP.', 'A GENERATOR. SOMEONE TOOK THIS ONE FROM THE INSIDE.',
  'A BUS WINDOW. HIS OWN REFLECTION, WAVING AT SOMEONE OUTSIDE.', 'A HALLOWEEN COSTUME. HE WENT AS A GROWN-UP. NOBODY GOT IT.', 'A NIGHT SKY OVER THE CITY. ONE WINDOW IS STILL LIT.',
  'A SCIENCE FAIR RIBBON. "PARTICIPANT." HE WAS SO PROUD.', 'A CAKE THAT SAYS "WELCOME HOME". IT WAS NEVER CUT.', 'A STAGE. A SPOTLIGHT. HE\'S BOWING. THE SEATS ARE ALL FULL.'];
// each photo's caption belongs to that photo, not to the order you found it in
let PHOTO_IDS = null;
function photoText(id) {
  if (!PHOTO_IDS) { PHOTO_IDS = []; for (const n of ORDER) { const L = STAGES[n].build(); for (let x = 0; x < L.w; x++) for (let y = 0; y < LH; y++) if (L.g[y][x] === 'F') PHOTO_IDS.push(n + ':' + x + ',' + y); } PHOTO_IDS.push('show'); }
  return PHOTOS[Math.max(0, PHOTO_IDS.indexOf(id))];
}
async function photoFound(n) {
  await say('FOUND A PHOTO (' + n + '/' + PHOTOS.length + '): ' + photoText(SAVE.photos[n - 1]));
  await say(pick(['I remember this one. Mostly.', 'I\'m keeping this.', 'Okay.', '...I\'m fine. I\'m keeping it.']), ASPECT[PL.asp].name);
  if (n >= PHOTOS.length && !PKM.allPhotos) { PKM.allPhotos = 1; savePKM(); sfx('glitch'); await say('...ALL OF THEM. SOMEWHERE VERY OLD, A DOOR THAT WAS NEVER IN THIS GAME JUST OPENED. (CHECK THE TITLE SCREEN.)'); }
}

// ---------- stage 2: the bus ----------
const NOTEBOOK = ['HE SAID: "I GREW UP WITH NO FAMILY."', 'HE SAID: "I NEVER TAKE WHAT ISN\'T MINE."', 'HE SAID: "I DON\'T EVEN LIKE VIDEO GAMES."', 'THE LAPTOP HAS MY NAME STICKER ON IT.'];
async function stage2Intro() {
  await wait(20);
  await say('Excuse me. Sir. That\'s my laptop.', KD);
  await say('Kid! Little man! Let me tell you something about myself.', ST);
  await say('I grew up with NOTHING. No family. Just like you. I GET you.', ST);
  await say('And I have never, EVER taken anything that wasn\'t mine.', ST);
  await say('Video games? Please. I don\'t even like them. I\'m an ARTIST.', ST);
  await say('Okay. Can I have my laptop back?', KD);
  await say('Come up front and we\'ll talk about it. After my stop. Maybe after my next movie.', ST);
  await say('(It has my name sticker on it. I put my name on things. I always put my name on things.)', KD);
  await say('HE WROTE ALL OF THAT DOWN IN HIS HEAD. HE REMEMBERS WHAT ADULTS SAY. THE MOVIE STAR IS AT THE FRONT OF THE BUS.');
}
async function testimony() {
  music('tense');
  await say('THE MOVIE STAR TAKES THE STAND. THERE IS NO STAND. HE STANDS ON A SEAT.');
  const S2 = [
    { t: 'I\'M JUST BORROWING THE LAPTOP. MY FAMILY ALWAYS TAUGHT ME TO SHARE.', c: 0, kid: 'You said you grew up with no family. Now your family taught you to share. Which one is it?' },
    { t: 'I WAS WATCHING MY OWN MOVIE ON IT. FOR RESEARCH. IT WAS VERY SAD. YOU SHOULD FEEL IT.', c: -1 },
    { t: 'THIS LAPTOP IS MINE. I\'VE HAD IT FOR YEARS.', c: 3, kid: 'You said you never take anything that isn\'t yours. It has my name on it. Right there. In marker.' },
    { t: 'I ONLY OPENED THE "GTA 6 LEAK" FOR MY ART.', c: 2, kid: 'You said you don\'t even like video games.' },
  ];
  const solved = new Set(); let i = 0;
  while (solved.size < 3) {
    const k = i % 4; i++;
    if (solved.has(k)) continue;
    const st = S2[k]; DBG.tcur = st.c;
    await say(st.t, ST, { keep: 1 });
    const c = await choose(['NEXT STATEMENT', 'OBJECTION!']); DLG = null;
    if (c !== 1) continue;
    const n = await choose(NOTEBOOK.map(s => s.slice(0, 40)), { x: 8, y: 60, cancel: 1 });
    if (n < 0) continue;
    if (n === st.c) {
      sfx('object'); post.flash = .5; banner('OBJECTION!', 60); await wait(6); post.flash = 0;
      await say(st.kid, KD); solved.add(k);
      await say(pick(['...That\'s-- you\'re taking that out of context.', 'I-- look. Kid. I have a PUBLICIST.', '...Okay, THAT was a different me.']), ST);
      if (k === 3) { await say('...It\'s research.', ST); await say('You said the opposite before you took my laptop.', KD); }
    } else {
      sfx('hurt'); PL.dig = Math.max(1, PL.dig - 1);
      await say(pick(['That doesn\'t prove anything, little man. Let ME tell YOU about ME.', 'Wrong! You know what\'s right? My performance in--', 'Kid. Kid. KID. Let me finish.']), ST);
    }
  }
  DBG.tcur = undefined;
  await say('...FINE. Take it. Take the laptop. You people never let me have ANYTHING.', ST);
  await say('Thank you. It looked very sad. Can I watch my thing now?', KD);
  sfx('get');
  await say('THE LAPTOP IS PLAYING "GTA 6 LEAK.MP4". IT\'S A LITTLE GREEN GUY IN A PARKING LOT, ARGUING WITH A DOOR.');
  await say('That\'s not GTA 6. That\'s... an old game. A really old game. It only has four colors.', KD);
  await say('That\'s a classic, kid.', ST);
  await stageClear();
}

// ---------- stage 3: school ----------
async function stage3Intro() {
  await wait(20);
  sfx('switch'); post.flash = .6; await wait(4); post.flash = 0;
  await say('(SOMEWHERE, THE GENERATOR HICCUPS. A SECOND ONE OF HIM COMES ONLINE.)');
  PL.unlocked = ['kid', 'wee']; PL.asp = 'wee';
  await say('HI! I\'m Pee-wee Kid! I\'m the OTHER one! Spooky Ghost made me! He was trying to impress somebody! It didn\'t work!', WE);
  await say('C: SWAP BETWEEN VERSIONS OF HIM.  PEE-WEE KID JUMPS HIGHER.  HOLD A TO PERFORM: EVERY ADULT NEARBY STOPS TO WATCH.');
  await say('THE BATHROOM IS LOCKED WITHOUT A HALL PASS. THE CLASS IS DOWN THE HALL.');
}
const JOKES = [['HI! I\'M PEE-WEE KID!', 'I WAS GOING TO TELL YOU ABOUT MY FAMILY, BUT APPARENTLY THAT\'S A WHOLE SERIES!'],
  ['THEY BUILT A GENERATOR OUT OF ME!', 'A GENERATOR! I\'M A KID! NOBODY EVEN GAVE ME A BEDTIME!'],
  ['MY TEACHER SAYS I NEED TO PARTICIPATE.', 'I ASKED IF SURVIVING COUNTS!'],
  ['THERE ARE THREE OF ME NOW!', 'ONE OF US SHOULD GET A BREAK!'],
  ['YOU LIKE THE NEW GRAPHICS?', 'THAT\'S ME! YOU\'RE WELCOME! CAN I PLEASE USE THE BATHROOM?']];
async function standUp() {
  if (SAVE.hallpass) return say('The class already loved you. The class is exhausted. The class needs a nap.', WE);
  const prev = scene, pm = curName; music('standup');
  let laughs = 0, bar = null, jk = 0, t = 0;
  scene = { update() { t++; if (bar) bar.m = (Math.sin(t * bar.sp) + 1) / 2; }, draw() {
    sky(0, H, hex('#200818'), hex('#502038')); for (let x = 0; x < W; x += 16) { rectF(x, 0, 8, 150, hex('#a01828')); rectF(x + 8, 0, 8, 150, hex('#801020')); }
    rectF(0, 150, W, 74, hex('#402010')); rectF(0, 150, W, 2, hex('#805030'));
    for (let i = 0; i < 12; i++) { rectF(10 + i * 26, 180 + (i & 1) * 6, 18, 30, hex('#100808')); rectF(14 + i * 26, 172 + (i & 1) * 6, 10, 10, hex('#100808')); }
    for (let y = 0; y < 150; y++) { const w = y * .4 + 10; rectF(160 - w, y, w * 2, 1, mix(hex('#502038'), hex('#f8e8a0'), .15)); }
    drawScaled(KID.wee.act[(t >> 4) & 1], 136, 76, KIDPAL.wee, 2);
    text('LAUGHS ' + laughs + '/5', 8, 8, UI.name);
    if (bar) { panel(60, 118, 200, 26); rectF(70, 128, 180, 8, BLACK); rectF(70 + bar.lo * 180, 128, (bar.hi - bar.lo) * 180, 8, hex('#40c040')); rectF(70 + bar.m * 180 - 1, 125, 3, 14, WHITE); text('A: PUNCHLINE!', 110, 119, UI.name, 0); }
  } };
  await say('THE CLASS IS WATCHING. LAND THE PUNCHLINES: PRESS A WHEN THE MARKER HITS THE GREEN.');
  for (jk = 0; jk < JOKES.length; jk++) {
    const [set, punch] = JOKES[jk];
    await say(set, WE, { auto: 25 });
    const lo = .15 + Math.random() * .55; bar = { m: 0, lo, hi: lo + .18 - jk * .015, sp: .05 + jk * .012 };
    DBG.mode = 'standup'; DBG.su = bar; await nextFrame();
    let hit = null;
    for (let f = 0; f < 60 * 6 && hit === null; f++) { await nextFrame(); if (pressed.a) hit = bar.m >= bar.lo && bar.m <= bar.hi; }
    DBG.mode = null; bar = null;
    await say(punch, WE, { auto: 20 });
    if (hit) { laughs++; sfx('crowd'); await say(pick(['(THE CLASS LAUGHS.)', '(BIG LAUGH. SOMEONE FALLS OFF A CHAIR.)', '(THE TEACHER LAUGHS. THE TEACHER HATES THAT SHE LAUGHED.)'])); }
    else { sfx('tick'); await say(pick(['(CRICKETS.)', '(SOMEBODY COUGHS.)', '(A KID IN THE BACK SAYS "WHAT".)'])); }
  }
  scene = prev; music(pm);
  if (laughs >= 3) { SAVE.hallpass = 1; savePK(); sfx('get'); await say('THE CLASS LOVED IT. CARL... NO. THE TEACHER HANDS YOU A HALL PASS. THE BATHROOM IS OPEN.'); await say('I did an act! People laughed at the act and not at me! That\'s the difference!', WE); }
  else await say('Tough room! That\'s okay! I\'ll do it again! I\'ll do it until it works! That\'s show business!', WE);
}
async function missNose() {
  music('tense');
  await say('(A BAG ON THE FLOOR. SOMETHING IN IT. A CLOWN HEAD POPS OUT.)');
  await say('HELLO, CHILDREN. I AM MISS NOSE. I WILL BE GIVING INSTRUCTIONS. FOLLOW THEM.', 'MISS NOSE');
  await say('A: "OKAY."   C: "NO THANK YOU."   SOME INSTRUCTIONS ARE FINE. SOME ARE NOT.');
  const ORD = [['SIT DOWN.', 'a'], ['DURING THE FIRE DRILL, GO STAND IN THE HALLWAY AND BE THE FIRE.', 'c'], ['RAISE YOUR HAND.', 'a'], ['HOLD IT UNTIL SUMMER. THE SCHOOL NEEDS THE POWER.', 'c'], ['TAKE OUT A PENCIL.', 'a'], ['STAND IN FRONT OF THE DODGEBALL MACHINE. FOR SCIENCE.', 'c']];
  let refused = 0;
  for (const [o, k] of ORD) {
    DLG = { who: 'MISS NOSE', lines: wrapT(o, 38), n: 999, arrow: 0, hasP: true };
    DBG.mode = 'qte'; DBG.qk = k;
    let got = null; for (let f = 0; f < 180 && got === null; f++) { await nextFrame(); if (pressed.a) got = 'a'; else if (pressed.c) got = 'c'; }
    DBG.mode = null; DLG = null;
    if (got === k) { sfx('ok'); if (k === 'c') { refused++; await say(pick(['No thank you. I don\'t want that to happen.', 'I\'d rather not. That seems like it would hurt.', 'No. That\'s a no.']), WE); } else await say('Okay!', WE, { auto: 20 }); }
    else { sfx('hurt'); PL.dig = Math.max(1, PL.dig - 1); await say(got === null ? '(HE FROZE.)' : k === 'c' ? '(HE ALMOST DID IT. HE STOPPED HALFWAY.)' : 'Why would you refuse a pencil?', got === null || k === 'c' ? null : 'MISS NOSE'); }
  }
  await say('YOU REFUSED ' + (refused || 'NOTHING... AND YET') + '. REFUSING IS DISRUPTIVE.', 'MISS NOSE');
  await say('I just didn\'t want to be the fire.', WE);
  await say('RE-EDUCATION.', 'MISS NOSE', { slow: 1 });
  await say('Re-WHAT?! I haven\'t even finished the first education!', WE, { port: WEE_SHOCK });
  await reeducation();
}
async function reeducation() {
  const prev = scene; let t = 0;
  scene = { update() { t++; }, draw() {
    sky(0, H, hex('#0c0c14'), hex('#20202c')); rectF(40, 20, 240, 70, hex('#183018')); frameRect(40, 20, 240, 70, hex('#806040'));
    ctext('WE ARE ALL LEARNING', 44, hex('#d0d0c0'), 0); ctext('(QUIETLY)', 58, hex('#a0a090'), 0);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) rectF(20 + c * 50, 110 + r * 28, 36, 8, hex('#503020'));
    draw(KID.wee.stand, 250, 156, KIDPAL.wee); draw(ADULT.tech[0], 278, 140, XPROFPAL);
    if ((t >> 6) % 4 === 0) { rectF(150, 0, 20, 6, hex('#f82020')); }
  } };
  await say('(RE-EDUCATION. THE BACK OF THE CLASSROOM. THE TEACHER IS SOMEWHERE. YOU CAN ONLY HEAR HER.)');
  await say('Psst. New arrival. What are you in for? Let me guess. You questioned a hierarchy. Hierarchies are, and I want to be extremely precise here, the--', 'THE PROFESSOR');
  const c = await ask('...', WE, ['I DIDN\'T WANT TO BE THE FIRE', 'I HAD TO PEE']);
  if (c === 0) await say('Ah. The refusal. Which is, if you think about it, the oldest story. The dragon, the cave, the-- you see, the fire is the chaos, and you, a small--', 'THE PROFESSOR');
  else await say('Ah. The body. The body will not be ignored. It is, in a sense, the first tyrant, and the bladder in particular--', 'THE PROFESSOR');
  await say('NO TALKING IN THE BACK.', '???');
  await say('(Whispering) Clean your room, by the way. Metaphorically. Also literally. Do you have a room?', 'THE PROFESSOR');
  await say('I have a tube.', WE);
  await say('...Clean the tube.', 'THE PROFESSOR');
  await say('There\'s a vent behind you. I fit in vents. That\'s kind of the other me\'s thing.', WE);
  await say('Go. I\'ll stay. Someone has to explain this to the room.', 'THE PROFESSOR');
  scene = prev;
  await stageClear();
}
const XPROFPAL = pal('#101018', '#e8b890', '#c09070', '#606060', '#384060', '#20283c', '#282838', '#101010', '#b02020', '#ffffff', '#303030');

// ---------- stage 4: the unit ----------
let SUS = null;
async function stage4Intro() {
  music(null);
  await showCard(['THE FIRST ONE GREW UP.', '', '(THIS IS THE ONE FACE MADE.)'], 150);
  await showCard(['HIS FAMILY.', 'THEN HIS FOSTER HOME.', 'THEN HIS RELATIVES, ON A PLANE,', 'COMING TO GET HIM.'], 220);
  await say('Son. I\'m sorry for your loss.', 'OFFICER');
  await wait(30);
  await say('...At least it wasn\'t a hate crime.', 'OFFICER');
  await wait(40);
  await say('Does that make them less dead?', KD);
  await wait(60);
  await say('...', 'OFFICER');
  await showCard(['HE BECAME A DETECTIVE.'], 130);
  music('city');
  PL.unlocked = ['kid', 'wee', 'boy']; PL.asp = 'boy'; PL.y -= 12;
  await say('Pee Boy. The case is still open. It\'s been open a long time.', 'CHIEF KUMA');
  await say('I know how long it\'s been open.', BY);
  await say('I\'m asking what you can prove. You\'ve told me what you want three times.', 'CHIEF KUMA');
  await say('Then let me go prove it.', BY);
  await say('Procedure first. This is the Special Pronouns Unit. Before you arrest anyone, you have to address them correctly. Get it wrong, it doesn\'t count.', 'CHIEF KUMA');
  await say('We have his address. Why are we still discussing the heading?', BY);
  await say('PEE BOY: A INSPECTS. HIDDEN THINGS SHOW UP. NEARBY ADULTS FREEZE.  TAKAHASHI IS YOUR PARTNER. HE SAYS WHATEVER CHAT TYPES. TALK TO HIM.');
  await say('SOMEONE UP AHEAD ONLY MOVES WHEN YOU\'RE NOT LOOKING AT HIM.');
}
async function takahashi() {
  await say('Pee Boy. Chat is here. Chat wants to say something through me. I am the chat\'s mouth now.', 'TAKAHASHI');
  const m = await keyboard2('TYPE WHAT TAKAHASHI SAYS (HE WILL SAY IT OUT LOUD):');
  SAVE.taka = m; savePK();
  speak(m, { pitch: 1.3, rate: 1.1 });
  await say(m, 'TAKAHASHI');
  await say(pick(['...Noted. Don\'t touch anything.', 'That\'s not evidence. That\'s a sentence.', 'Okay. Write that down. Actually don\'t.']), BY);
  await chatAction();
}
const TAKA_ACTS = {
  'LOOK FOR CLUES': [['Takahashi looks under a trash can. There\'s another trash can under it.', 'He finds a receipt. It\'s his.'], ['He finds a coffee cup with a lipstick mark and a time on the lid: 3:33 AM.', 'Takahashi found a CLUE. Pee Boy is visibly upset about it.']],
  'EAT THE EVIDENCE': [['Takahashi eats a napkin from the crime scene.', '"That was evidence." "It was a napkin." "It was an evidence napkin."'], ['Takahashi eats the evidence. The evidence was a sandwich. Chat is satisfied.', 'Pee Boy files it under "resolved: sandwich".']],
  'DO A BACKFLIP': [['Takahashi attempts a backflip. Takahashi does a sideways lie-down.', 'He stays there for a while. He says he\'s fine.'], ['A PERFECT BACKFLIP. The whole block applauds. A cop drops his coffee.', 'It changes nothing about the case. Everyone feels better anyway.']],
  'CALL CHIEF KUMA': [['Takahashi calls Chief Kuma. He puts it on speaker. Kuma is in the shower.', '"...Is this the chat again?"'], ['Takahashi calls Chief Kuma and says exactly what chat typed.', 'Kuma: "...I\'m approving your overtime. I don\'t know why. Stop calling me."']],
};
async function chatAction() {
  await say('Chat also picks what I DO. Procedure says we roll for it. Twenty sides. Like the old cartridge.', 'TAKAHASHI');
  const acts = Object.keys(TAKA_ACTS), c = await choose(acts);
  let r = 1;
  for (let i = 0; i < 36; i++) { r = 1 + rnd(20); banner('D20: ' + r, 3); if (i % 3 === 0) sfx('tick'); await wait(1 + (i >> 3)); }
  sfx(r >= 11 ? 'get' : 'hurt'); banner('D20: ' + r + (r === 20 ? '  CRITICAL!' : r === 1 ? '  FUMBLE!' : ''), 90); await wait(40);
  const [t1, t2] = TAKA_ACTS[acts[c]][r >= 11 ? 1 : 0];
  await say(t1); await say(t2);
  if (r >= 11) { PL.dig = 3; await say('(PEE BOY\'S DIGNITY IS RESTORED. SOMEHOW.)'); }
  speak(r >= 11 ? 'Nailed it.' : 'My bad.', { pitch: 1.3, rate: 1.1 });
}
function suspectTick() {
  if (!SUS || SUS.caught) return;
  const toward = Math.sign(SUS.x - PL.x) || 1, looking = PL.face === toward;
  const onScreen = SUS.x - camX > -20 && SUS.x - camX < W + 20;
  if (!looking && onScreen && !busy && SUS.x < 95 * TS) { SUS.x += 1.5; SUS.anim += .15; }
  if (!busy && Math.abs(PL.x - SUS.x) < 14 && Math.abs(PL.y + A().h - (SUS.y + 44)) < 30) { SUS.caught = true; run(catchSuspect); }
}
function suspectDraw() {
  if (!SUS || SUS.caught) return;
  const x = Math.round(SUS.x - camX); if (x < -30 || x > W + 30) return;
  draw(ADULT.cop[(SUS.anim | 0) & 1], x - 5, SUS.y, ADULTPAL.cop, true);
  const looking = PL.face === (Math.sign(SUS.x - PL.x) || 1);
  text(looking ? '...' : '', x - 2, SUS.y - 10, WHITE);
  if (frame % 90 < 45) text('SUSPECT', x - 14, SUS.y - 20, hex('#f83850'));
}
async function catchSuspect() {
  sfx('object');
  await say('CAUGHT: THE SUSPECT WHO ONLY MOVES WHEN YOU LOOK AWAY.');
  await say('You got me. I only ever moved when nobody was watching. Like most people.', 'SUSPECT');
  const c = await ask('PROCEDURE: HOW DO YOU ADDRESS THE SUSPECT?', BY, ['SIR', 'THE SUSPECT', 'ASK HIM']);
  if (c === 2) { await say('How do you want to be addressed?', BY); await say('...Nobody\'s ever asked me that. "Mister Suspect, Esquire."', 'SUSPECT'); await say('Mister Suspect, Esquire, you\'re under arrest.', BY); await say('Correct address confirmed. It counts.', 'CHIEF KUMA'); }
  else { await say('That\'s not how I like to be addressed.', 'SUSPECT'); await say('Radio: Doesn\'t count, Pee Boy. Ask him.', 'CHIEF KUMA'); await say('...How do you want to be addressed?', BY); await say('"Mister Suspect, Esquire."', 'SUSPECT'); await say('Mister Suspect, Esquire. You\'re under arrest.', BY); await say('Now it counts.', 'CHIEF KUMA'); }
  await say('SIDE CASE CLOSED. THE MAIN CASE IS STILL OPEN.');
}
async function witness() {
  await say('You said you hadn\'t been inside the building.', BY);
  await say('That\'s right.', 'WITNESS');
  const tl = SAVE.taka ? 'Before you answer. Chat wants to know: ' + SAVE.taka : 'Chat wants to know if the vending machine takes cards.';
  speak(tl.replace('Before you answer. ', ''), { pitch: 1.3, rate: 1.1 }); await say(tl, 'TAKAHASHI');
  await say('Only the one upstairs takes cards.', 'WITNESS');
  await wait(20);
  await say('Upstairs.', BY);
  await say('...People talk.', 'WITNESS');
  speak('Chat also wants a sandwich.', { pitch: 1.3, rate: 1.1 }); await say('Chat also wants a sandwich.', 'TAKAHASHI');
  await say('For once, stop while we\'re ahead.', BY);
  await say('(UPSTAIRS: AN EMPTY ROOM. AN OPEN WINDOW. A NOTE ON THE DESK.)');
  await say('THE NOTE SAYS: "THIRD TIME\'S THE CHARM."');
  await say('The case stays open, Pee Boy.', 'CHIEF KUMA');
  await say('It always does. But now I know where he\'s going. Where WE\'RE going.', BY);
  await stageClear();
}

// ---------- stage 5 + finale ----------
async function stage5Intro() {
  await wait(20);
  PL.unlocked = ['kid', 'wee', 'boy'];
  sfx('switch'); post.flash = .7; await wait(5); post.flash = 0;
  await say('Pee Kid.', KD); await say('Pee-wee Kid!', WE); await say('Pee Boy.', BY);
  await say('(ALL THREE OF HIM. IN ONE. THE THIRD GENERATOR WANTS ALL OF THEM BACK.)');
  await say('THREE OF THEM. NOW I CAN SEE ALL OF YOU.', '???', { slow: 1 });
  await say('...Who was that?', KD);
  await say('Nobody. Probably nobody. Keep moving.', BY);
}
async function finale() {
  music('tense');
  await say('THE HEART OF THE THIRD GENERATOR. FACE AND SPOOKY GHOST, IN FOUR SHADES, STANDING IN FRONT OF ALL THOSE COLORS.');
  await say('Kid. Get back in. The whole generation is running on you.', FC);
  await say('Look at it. Look at the colors. You did that. Nobody\'s ever done that before.', GH);
  await say('Can you explain the part where I get out?', KD);
  await say('...There isn\'t one. That\'s the design.', FC);
  await say('You said the opposite before. You said it could do much more now.', BY);
  await say('If there are three of me, one of us should get a break!', WE);
  await say('...', '???');
  DBG.finale = 1;
  const c = await ask('THE GENERATOR IS OPEN. THE BATHROOM IS RIGHT THERE.', null, ['GET BACK IN', 'GO TO THE BATHROOM']);
  if (c === 0) {
    sfx('power'); post.flash = 1; for (let i = 0; i < 30; i++) { post.flash = 1 - i / 30; await nextFrame(); }
    await say('He gets back in. The colors get brighter. They always get brighter.');
    await say('Next generation, kid.', FC);
    await say('Okay. ...Can I get out later?', KD);
    await say('Sure, kid. Sure.', GH);
    PKM.endings = (PKM.endings || 0) + 1; PKM.kept = 1; savePKM();
    return credits(false);
  }
  sfx('flush'); PERMA = true; PL.pot = 0; await wait(60);
  await say('...', KD);
  await say('...The generation\'s over.', FC);
  await say('It\'s all green again. It\'s the old look. Aw, man. I liked the colors.', GH);
  await say('Okay. Can I go home now?', KD);
  await wait(40);
  await say('...Yeah. Yeah, kid. Go.', GH);
  await say('Welcome to four colors. It\'s not so bad. Nobody\'s powering anything down here. We just... are.', 'CARL');
  PKM.endings = (PKM.endings || 0) + 1; PKM.letgo = 1; PKM.upgraded = 0; savePKM();
  await credits(true);
}

// ================= content pass: section intros, set pieces, secret stage =================
async function stage11Intro() {
  await wait(20);
  sfx('powerdown'); post.shake = 3; await wait(20); post.shake = 0;
  await say('(BEHIND HIM, SOMETHING VERY BRIGHT STARTS MOVING.)');
  await say('THE GENERATOR NOTICED HE LEFT. IT WANTS ITS KID BACK. IT IS NOT FAST, BUT IT DOES NOT STOP.');
  await say('Okay. Okay okay okay. Running. I\'m good at running. I\'ve never run. I\'m going to be good at it.', KD);
  await say('TIP: IN LEGACY MODE THE GENERATOR SLOWS DOWN. FLUSHING BUYS YOU TIME.');
}
async function stage21Intro() {
  await wait(20);
  await say('(THE MOVIE STAR LOCKED THE AISLE WITH HIS SCRIPT. PEE KID CLIMBED OUT THE WINDOW.)');
  await say('The front of the bus is that way. The wind is also that way. Everything is that way.', KD);
  await say('WATCH FOR ROAD SIGNS. JUMP THE LOW ONES. STAY LOW UNDER THE HIGH ONES. IN LEGACY MODE THE BUS SLOWS DOWN.');
}
async function stage31Intro() {
  await wait(20);
  await say('RECESS. THE SCHOOL HAS INSTALLED A DODGEBALL MACHINE. FOR SCIENCE.');
  await say('Recess is supposed to be the break! Who breaks the break?', WE, { port: WEE_SHOCK });
  await say('TIP: QUESTIONS JAM THE MACHINES. SO DOES A GOOD PERFORMANCE. THE DRAMA CLUB IS RIGHT BEHIND YOU.');
}
async function stage41Intro() {
  await wait(20);
  await say('ROOFTOPS. HE FOLLOWED THE WITNESS\'S DIRECTIONS. "UPSTAIRS" WAS VAGUE.');
  sfx('stun');
  await say('ATTENTION. UNIDENTIFIED INDIVIDUAL. PLEASE STATE HOW YOU WOULD LIKE TO BE ADDRESSED BEFORE WE SHINE THIS LIGHT DIRECTLY AT YOU.', 'OFFICER');
  await say('That\'s my own unit\'s helicopter.', BY);
  await say('THE SPOTLIGHTS CAN\'T SEE LEGACY HARDWARE. INSPECTING SHORTS THEM OUT FOR A FEW SECONDS.');
}
async function stage51Intro() {
  await wait(20);
  sfx('glitch'); post.wave = 3; await wait(40); post.wave = 0;
  await say('THE HEART OF THE THIRD GENERATOR. IT HAS STOPPED ASKING NICELY.', null);
  await say('Vents are mine.', KD); await say('High stuff is mine!', WE); await say('Hidden stuff is mine. Move.', BY);
  await say('C: SWAP. ALL THREE OF THEM WILL BE NEEDED. DON\'T STOP.');
}
// the figure on the far rooftop: never close, never caught
function silhouette() {
  const sx = Math.round(118 * TS * .35 - camX * .35 + 60);
  if (legacyNow || sx < -20 || sx > W) return;
  if (PL.x / TS > 112) { if (!SAVE.sawFigure) { SAVE.sawFigure = 1; banner('...GONE.', 90); } return; }
  const c = hex('#000000'), y = 118 + Math.round(Math.sin(frame * .02));
  rectF(sx, y, 6, 16, c); rectF(sx + 1, y - 6, 4, 6, c); rectF(sx - 2, y + 2, 2, 9, c); rectF(sx + 6, y + 2, 2, 9, c); rectF(sx, y + 16, 2, 8, c); rectF(sx + 4, y + 16, 2, 8, c);
  if ((frame >> 5) % 5 === 0) { pset(sx + 2, y - 4, hex('#f8f8f8')); pset(sx + 4, y - 4, hex('#f8f8f8')); }
}
// ---------- the presentation: pee-wee kid's rhythm routine ----------
const ARW = { up: [[4, 0, 1], [3, 1, 3], [2, 2, 5], [1, 3, 7], [0, 4, 9], [3, 5, 3], [3, 6, 3], [3, 7, 3], [3, 8, 3]] };
function arrowGlyph(dir, x, y, c) {
  for (const [ox, oy, w] of ARW.up) {
    if (dir === 'up') rectF(x + ox, y + oy, w, 1, c);
    else if (dir === 'down') rectF(x + ox, y + 8 - oy, w, 1, c);
    else if (dir === 'left') rectF(x + oy, y + ox, 1, w, c);
    else rectF(x + 8 - oy, y + ox, 1, w, c);
  }
}
async function presentation() {
  if (SAVE.showDone) return say('The Drama Club gives you a standing ovation every time you walk by now. It\'s getting awkward.', 'DRAMA CLUB');
  await say('Are you... are you HIM? The one with the act? The Drama Club needs a closer for THE PRESENTATION.', 'DRAMA CLUB');
  await say('I have a routine! It\'s called The Presentation! I present! Then it\'s over!', WE);
  if (await ask('DO THE PRESENTATION?', null, ['LET\'S GO', 'NOT NOW']) !== 0) return;
  const prev = scene, pm = curName; music('show');
  const dirs = ['left', 'down', 'up', 'right'], lane = d => 92 + dirs.indexOf(d) * 34;
  const notes = []; let t = 0, hits = 0, miss = 0, flash = {}, pose = 0;
  for (let i = 0; i < 28; i++) notes.push({ d: dirs[(i * 7 + (i >> 2)) % 4], at: 90 + i * 26 + (i > 14 ? -6 * (i - 14) : 0), done: 0 });
  const TARGET = 40;
  scene = { update() { t++; }, draw() {
    sky(0, H, hex('#200010'), hex('#602040'));
    for (let i = 0; i < 6; i++) { const bx = 20 + i * 56 + Math.sin(t * .03 + i) * 10; for (let y = 0; y < 150; y++) rectF(bx - y * .15, y, 4 + y * .3, 1, mix(hex('#602040'), hex('#f8e8a0'), .12)); }
    rectF(0, 150, W, 74, hex('#301020')); rectF(0, 150, W, 2, hex('#a06040'));
    drawScaled(pose ? KID.wee.act[pose & 1] : KID.wee.stand, 10, 110, KIDPAL.wee, 2);
    for (const d of dirs) { const x = lane(d); frameRect(x - 3, TARGET - 3, 15, 15, flash[d] > 0 ? WHITE : UI.dim); arrowGlyph(d, x, TARGET, flash[d] > 0 ? UI.name : hex('#503050')); if (flash[d] > 0) flash[d]--; }
    for (const n of notes) if (!n.done) { const y = TARGET + (n.at - t) * 2.2; if (y < H && y > -10) arrowGlyph(n.d, lane(n.d), y, [hex('#f85888'), hex('#58d8f8'), hex('#78f858'), hex('#f8d838')][dirs.indexOf(n.d)]); }
    text('THE PRESENTATION', 90, 206, UI.name); text('HITS ' + hits + '  MISSES ' + miss, 90, 214, UI.text);
  } };
  DBG.mode = 'rhythm'; DBG.notes = notes; DBG.t = () => t;
  await nextFrame();
  while (notes.some(n => !n.done)) {
    await nextFrame();
    for (const d of dirs) if (pressed[d]) {
      const n = notes.filter(n => !n.done && n.d === d).sort((a, b) => a.at - b.at)[0];
      if (n && Math.abs(n.at - t) <= 7) { n.done = 1; hits++; flash[d] = 8; pose++; sfx('blip', [440 * Math.pow(2, dirs.indexOf(d) / 4), 0]); }
      else { miss++; sfx('tick'); }
    }
    for (const n of notes) if (!n.done && t - n.at > 7) { n.done = 1; miss++; }
  }
  DBG.mode = null; await wait(30);
  scene = prev; music(pm);
  if (hits >= 20) {
    SAVE.showDone = 1; sfx('crowd'); await say('STANDING OVATION. THE DRAMA CLUB IS CRYING. ONE OF THEM TAKES A PICTURE.');
    await say('Thank you! Thank you! I\'ll be here all week! I have to be! I\'m a kid!', WE);
    SAVE.photos.push('show'); savePK(); sfx('get'); await photoFound(SAVE.photos.length);
  } else await say(hits + ' OUT OF 28. "IT WAS VERY BRAVE," SAYS THE DRAMA CLUB, WHICH IS WHAT THEY SAY WHEN IT WASN\'T GOOD. (TALK TO THEM TO TRY AGAIN. 20 HITS NEEDED.)');
}
// ---------- the secret stage ----------
async function secretIntro() {
  await wait(30);
  await say('(THIS STAGE ISN\'T IN THE MANUAL. THE CARTRIDGE HAS NO ROOM FOR IT. IT\'S HERE ANYWAY.)');
  await say('Oh. It\'s... green. Everything\'s green. It doesn\'t feel bad. It feels like before.', KD);
}
async function dogEnding() {
  music(null); await fadeOut(.03);
  await showCard(['THE BACK OF THE DOG PHOTO.', '', 'SOMEONE WROTE ON IT', 'IN PENCIL, A LONG TIME AGO.'], 200, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  await showCard(['"BISCUIT."', '', '"HE WAITS BY THE DOOR', 'FOR WHOEVER COMES HOME FIRST."'], 260, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  await say('...Biscuit.', KD);
  await say('I remembered everybody else. He remembered me. That\'s the whole thing, right? That\'s the whole thing.', KD);
  PKM.dog = 1; savePKM();
  await showCard(['PHOTO 17 / 16', '', 'THANK YOU FOR REMEMBERING.'], 200, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  post.legacy = 0; LEGACY_AUDIO = false; STG = STAGES[1];
  run(titleScreen);
}
