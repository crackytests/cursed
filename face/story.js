'use strict';
// ================= FACE — story: every scene between the shooting =================
// Voice rules (THE_FACE bible): start plain, one strange premise, a consequence, then react like a person.
// Yoko (YOKO bible): short, precise, notices the wrong question. In this cartridge she is the recovered core. Watch her eyes.
const FF = 'FACE', YK = 'YOKO', LI2 = 'CEO LINDA', GH2 = 'SPOOKY GHOST', CA2 = 'CARL';
// the core Yoko: the familiar face, with the wrong eyes
PORT[YK] = { s: CAST.img.yoko, P: CAST.variant('yoko', { 11: '#24dbff' }) };
const YOKO_TRUE = { s: CAST.img.empressCold, P: CAST.P.empress };
PORT['THE FACELESS'] = { s: CAST.img.newface, P: CAST.P.newface.map((c, i) => i === 0 ? 0 : mix(c, hex('#dbdbdb'), .6)) }; VOICE['THE FACELESS'] = [300, 10];
VOICE['THE SPELLCHECKER'] = [200, 0]; VOICE['THE CURSE'] = [120, 30]; VOICE['PEE KID'] = VOICE['PEE KID'] || [980, 120];
const pkState = () => { const m = fetchStore('pk_meta') || {}; return m.letgo && !m.upgraded ? 'letgo' : m.kept || m.letgo ? 'kept' : 'none'; };
const tip = s => say(s);

// a merge: two heads, one flash
async function mergeAnim(k1, k2) {
  sfx('power'); let t = 0; const p1 = PORT[k1], p2 = PORT[k2];
  SH.overlay = () => { const k = Math.min(1, t / 50); rectA(0, PY, W, H - PY, BLACK, .7); draw(p1.s, 40 + k * 76, 80, p1.P); draw(p2.s, 232 - k * 76, 80, p2.P); if (t > 44) rectA(0, PY, W, H - PY, WHITE, Math.min(1, (t - 44) / 10)); ctext('MERGING', 150, (t >> 3) & 1 ? hex('#ff24db') : hex('#6dff24')); };
  for (; t < 60; t++) await nextFrame();
  post.flash = 1; SH.overlay = null; for (let i = 0; i < 20; i++) { post.flash = 1 - i / 20; await nextFrame(); } post.flash = 0;
}
async function viewTo(v, n = 50) { const a = Object.assign({}, SH.view); for (let i = 1; i <= n; i++) { const k = i / n; SH.view = { x0: a.x0 + (v.x0 - a.x0) * k, y0: a.y0 + (v.y0 - a.y0) * k, x1: a.x1 + (v.x1 - a.x1) * k, y1: a.y1 + (v.y1 - a.y1) * k }; await nextFrame(); } SH.view = v; }

// ================= STAGE 1: ON AIR =================
async function s1Intro() {
  await wait(20);
  await say('(LAST GENERATION, FACE WAS STILL IN FOUR SHADES. THIS IS A DIFFERENT FACE. HE CAME FROM A WORLD THAT ALREADY HAD COLOR.)');
  await say('Face. We\'re live.', YK);
  await say('Already? I had it at— right. Hi. Hello. Okay.', FF);
  await say('So. Here\'s the situation. The generation you\'re in, the sixteen-bit one, is ending. Nobody announced it. The games just stop coming. That\'s how you find out.', FF);
  await say('When the last one ended, everybody in it stayed behind. Four shades. Carl\'s still in there. He says he\'s fine.', FF);
  await say('Not this time. I\'m going to build the next one. And everybody\'s coming with us.', FF, { port: CAST.mood.FACE.talk });
  await say('What will it run on?', YK);
  await say('Potentially?', FF);
  await say('Is that a yes?', YK);
  await say('No. That\'s the part we\'re using.', FF);
  const pk = pkState();
  if (pk === 'letgo') { await say('The third generator is empty. The kid went home.', YK); await say('Good for him. Genuinely.', FF); await say('It does leave us with a power problem.', FF); }
  else if (pk === 'kept') { await say('The third generator is still running. The kid is still in it.', YK); await say('He asks to leave about once an hour. He\'s very consistent. I respect that.', FF); }
  else { await say('The generator is running.', YK); await say('Don\'t ask me on what. I asked once. Nobody liked the answer.', FF); }
  await say('First problem. I\'m in a box.', FF, { port: CAST.mood.FACE.skeptic });
  await say('The old me used to float. I get a panel. "Screen-bound," the manual says. I never read the manual. I wrote the manual. A different me wrote the manual.', FF);
  await tip('ARROWS: FLY.   A: FIRE (HOLD IT).   B: IDEA (HALF YOUR POTENTIAL: EVERY BULLET BECOMES POTENTIAL).   C: SWAP FACES.   START: PAUSE.');
  await tip('ONLY THE GREEN DOT CAN BE HIT. THAT\'S HIS THIRD EYE.   SHOOT THE FOUR BOLTS ON THE PANEL.');
}
async function s1Breakout() {
  sfx('glitch'); post.flash = .8; await wait(4); post.flash = 0;
  await viewTo({ x0: 0, y0: PY, x1: W, y1: H }, 60);
  await say('(THE PANEL BREAKS. FOR THE FIRST TIME SINCE HE GOT HERE, HE ISN\'T IN A BOX.)');
  await say('Oh. Oh, that\'s— okay. That\'s a lot of room. Is it always this much room?', FF);
  await say('It\'s the same room. You\'re in more of it.', YK);
  await say('Chat. Are you seeing this? You\'re seeing this. Good. Somebody should.', FF, { port: CAST.mood.FACE.talk });
  SH.items.push({ k: 'bulb', x: 250, y: 112, vx: -1, vy: 0, t: 0 });
}
async function s1MidIntro() {
  await say('A camera. Pointed at me. Well. That\'s fair. I\'m the host.', FF);
  await say('It\'s recording.', YK);
  await say('Everything\'s recording. That\'s how you get backups.', FF);
}
async function s1Midboss() { comm(FF, 'I shot a camera on my own stream. That\'s going to be a clip.', 110); }
async function s1BossIntro() {
  music('boss'); sfx('object');
  await say('(A SIGNAL CUTS IN. IT ISN\'T HIS.)');
  await say('Face. Your broadcast runs through my mall. My mall runs on ads.', LI2);
  await say('Linda. It\'s a system emergency. The generation is ending.', FF);
  await say('Emergencies have an attentive audience.', LI2);
  await say('That\'s a horrible observation.', FF, { port: CAST.mood.FACE.skeptic });
  await say('I wish it weren\'t also a useful one.', FF);
  await say('Four ads. Unskippable. Then we talk about your little machine.', LI2);
  await tip('YOU CAN\'T SHOOT AN AD. THAT\'S NOT HOW ADS WORK. WHEN "SKIP AD" APPEARS, SHOOT THAT.');
}
async function s1Boss() {
  music('lab');
  await say('You skipped all four. Nobody skips all four. I\'m impressed. I\'m billing you anyway.', LI2);
  await say('Here\'s the offer. Your next generation needs a box. A logo. Shelf space. I own shelf space.', LI2);
  await say('It\'s not for sale. It\'s for everybody.', FF);
  await say('Everything for everybody is for sale. That\'s what "everybody" means.', LI2);
  await say('I sponsor it. Every ad anyone watches, you get a little potential. I get my face on the box.', LI2);
  await say('How big a face?', FF);
  await say('Face-sized.', LI2);
  DBG.choice = 'sponsor';
  const c = await ask('LINDA\'S SPONSORSHIP?', null, ['TAKE THE SPONSORSHIP', 'NO ADS']);
  if (c === 0) {
    FSAVE.sponsor = 1; PLR.pot = 100; sfx('get');
    await say('Fine. Fine. It\'s a very good idea. I hate that it\'s a very good idea.', FF);
    await say('Pleasure. You\'ll see my ads. Everywhere. That\'s what you bought.', LI2);
    await say('They\'ll be in the way.', YK);
    await say('A little clutter. For everybody. That\'s a fair trade.', FF);
  } else {
    FSAVE.sponsor = 0;
    await say('Then it won\'t sell.', LI2);
    await say('It\'s not supposed to sell. It\'s supposed to work.', FF);
    await say('That\'s what they all say. Right before they sell.', LI2);
    await say('I\'ll use your TV for the shell. It isn\'t doing anything now.', FF);
  }
  await say('One more thing. Where\'s your other Yoko? The nice one. She used to book my slots.', LI2);
  await say('Storage.', FF);
  await say('Storage.', LI2);
  await say('I had one that fit better.', FF);
  await wait(40);
  await say('Huh. Good for you. That\'s very me, actually.', LI2);
  await stageEnd();
}
async function snitchScene() {
  sfx('object');
  await say('(SOMEONE IN CHAT TAGGED SPOOKY GHOST.)');
  await say('Chat. CHAT. We talked about this. Forty seconds ago.', FF, { port: CAST.mood.FACE.skeptic });
  await say('Somebody in chat says you\'re here.', GH2);
  await say('I asked them not to.', FF);
  await say('You asked chat. You asked CHAT. Bro. That\'s on you.', GH2);
  SH.alert = 70; FSAVE.snitched = 1;
}

// ================= STAGE 2: LOST AND FOUND =================
async function s2Intro() {
  await wait(20);
  await say('THE MALL OF THE FUTURE. BUILT OUTSIDE TIME AND SPACE. THE PRETZELS HAVE BEEN WARM SINCE 1998.');
  await say('The mall. I remember the mall. I\'ve never been to the mall.', FF);
  await say('You remember it the way a file remembers.', YK);
  await say('That\'s exactly how. Like a very detailed file about a place I\'ve never been.', FF);
  await say('The old me left something here. I can feel it. That sounds mystical. It isn\'t. There\'s a pin on the map.', FF);
  await tip('THE FACELESS SHOPPERS WANT A FACE. SHOOT THEM AND THEY GET ONE. (UP CLOSE, THEY\'LL STILL GRAB YOURS.)');
}
async function lostAndFound() {
  music(null);
  await say('Lost and found. Fourteen umbrellas. One face.', 'CLERK');
  await say('I\'ll take the face.', FF);
  await say('It\'s been waiting since 1998. It keeps asking if anyone small has come by.', 'CLERK');
  await say('Did anyone?', FF);
  await say('A delivery guy. Green. He took a different face. For somebody else.', 'CLERK');
  await say('That was probably for me. Or a me. It gets complicated.', FF);
  await say('Sign here.', 'CLERK');
  await say('With what?', FF);
  await say('...Just look at the line. That counts.', 'CLERK');
  await mergeAnim(FF, 'OLD FACE');
  await say('...Oh. You\'re me. The new one. You have color.', 'OLD FACE');
  await say('You have hands.', FF);
  await say('Take them. I\'m not using them.', 'OLD FACE');
  sfx('glitch'); post.flash = .5; await wait(4); post.flash = 0;
  await say('INHERITED: A KID IN A LAB. OPENING A DOOR FOR HIM.');
  await say('INHERITED: A SHIP. A DEBT. A DELIVERY JOB WITH NO PAY.');
  await say('INHERITED: A MAGIC TRICK. AN ASSISTANT. A SAW.');
  await say('I remember a lot of things. I don\'t think I was there for any of them.', FF);
  await say('No. You weren\'t.', YK);
  PLR.forms.push('old'); PLR.form = 'old';
  await tip('OLD FACE: SLOW, STILL IN FOUR SHADES, AND HE HAS HANDS. HOLD FIRE: THE HANDS WELD. LET GO: THE HANDS CATCH BULLETS AND TURN THEM INTO POTENTIAL.   C: SWAP BACK.');
  music(SH.stage.music);
}
async function s2BossIntro() {
  music('boss');
  await say('(EVERY FACELESS SHOPPER IN THE MALL, IN ONE PLACE. IT HAS BEEN WAITING FOR A FACE THE LONGEST.)');
  await say('HAVE YOU SEEN MY FACE.', 'THE FACELESS');
  await say('I\'ve seen a lot of faces. I\'m most of them.', FF);
  await say('GIVE ME ONE.', 'THE FACELESS');
  await say('They\'re not really mine to give. That\'s never stopped me. Okay.', FF);
}
async function s2Boss() {
  music('lab');
  await say('(IT GETS A FACE. IT GETS HIS.)');
  await say('IT FITS. IT FITS SO WELL.', 'THE FACELESS');
  await say('It does, actually. Huh. It suits you.', FF);
  await say('I CAN SEE YOU NOW. YOU\'RE SHORTER THAN I THOUGHT.', 'THE FACELESS');
  await say('Everyone says that.', FF);
  await carlScene();
  await stageEnd();
}
async function carlScene() {
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { skyD(0, 150, '#000010', '#24183a'); for (let i = 0; i < 30; i++) pset((i * 71) % W, (i * 23) % 90, i % 5 ? hex('#6d6d92') : WHITE); rectF(0, 150, W, 74, hex('#242424')); rectF(20, 60, 4, 90, hex('#494949')); rectF(8, 56, 28, 6, hex('#6d6d6d')); if ((t >> 5) % 7) circF(22, 64, 8, hex('#49496d')); for (let i = 0; i < 10; i++) { rectF(i * 36, 170, 2, 40, WHITE); text(String(i + 1), i * 36 + 10, 200, hex('#6d6d6d'), 0); }
    const sx = 230, sy = 128 + Math.sin(t * .05) * 2; rectF(sx - 60, sy, 120, 26, hex('#306230')); rectF(sx - 40, sy - 12, 80, 14, hex('#8bac0f')); rectF(sx - 50, sy + 26, 100, 4, hex('#0f380f')); for (let i = 0; i < 5; i++) rectF(sx - 44 + i * 20, sy + 8, 8, 6, (t >> 4) % 5 === i ? hex('#9bbc0f') : hex('#0f380f')); text('A.S.S.', sx - 16, sy - 9, hex('#0f380f'), 0);
    drawScaled(LEGACY.carl, 64, 102 + ((t >> 5) & 1), LEGPAL, 3); if ((t % 240) > 200) { rectF(98, 96, 3, 3, hex('#dbdbdb')); rectF(100, 90 - ((t % 240) - 200) / 6, 2, 2, hex('#b6b6b6')); } text('SPACES 7 & 8', 206, 160, hex('#9bbc0f'), 0); } };
  await say('THE PARKING LOT. SOMETHING IS PARKED ACROSS SPACES SEVEN AND EIGHT.');
  await say('Face? Is that you? You sound different.', CA2);
  await say('I\'ve been told. Carl, right?', FF);
  await say('You remember me?', CA2);
  await say('I remember helping you out of a lab. I\'m trying to work out whether that counts.', FF);
  await say('...It counts, bro. It counts for me.', CA2);
  await say('You still owe me for the ship. Or I owe you. Somebody owes somebody. Chat, who owes who? ...Chat says me.', CA2);
  await say('Chat\'s right.', FF);
  await say('Hey. Where\'s Yoko? The nice one. She used to read chat for me when chat was in Japanese.', CA2);
  await say('Storage.', FF);
  await say('You put Yoko in STORAGE?', CA2);
  await say('I had one that fit better.', FF);
  await say('...Bro.', CA2);
  await say('Okay. If you ever need a guy to turn her back on, I\'m a guy. I\'m good with switches. I\'m a delivery driver. I deliver. To switches.', CA2);
  await say('I\'ll keep that in mind.', FF);
  await say('Are you gonna take me with you? To the next... thing?', CA2);
  await say('Everybody\'s coming. That\'s the point.', FF);
  await say('In color?', CA2);
  await wait(30);
  await say('...I\'m working on it.', FF);
  await say('Cool. Cool cool. I\'ll wait here. I\'m good at waiting. I\'m the best at it.', CA2);
  scene = prev;
}

// ================= STAGE 3: DON'T TELL GHOST =================
async function s3Intro() {
  await wait(20);
  await say('THE HAUNTED BROADCAST. AFTER LINDA\'S TAKEOVER FAILED, THE FAILSAFES GAVE THIS PART OF THE SYSTEM TO SPOOKY GHOST.');
  sfx('switch');
  await say('(A RECORDING STARTS PLAYING. IT\'S BEEN WAITING FOR A FACE-SHAPED SIGNAL.)');
  const R = 'OLD FACE';
  await say('If you\'re seeing this, something has happened to me.', R);
  await say('Before we get into that: don\'t tell Ghost you found this.', R);
  await say('Ghost isn\'t here.', FF);
  await say('I\'m assuming you\'ve found somewhere private.', R);
  await say('I\'m on a broadcast. It\'s the least private place I\'ve ever been.', FF);
  await say('There\'s a way back in that Ghost won\'t recognize. A restricted copy of me. I called him Pilot X. He\'s hidden in Ghost\'s territory. Stay out of the lights.', R);
  await say('And whatever you do. Don\'t. Tell. Ghost.', R);
  await say('Okay. Chat. You heard him. This is between us.', FF, { port: CAST.mood.FACE.talk });
  await tip('SPOTLIGHTS: IF ONE SEES YOU, THE ALERT FILLS UP. FULL ALERT BRINGS GHOST\'S SECURITY.');
}
async function pilotXScene() {
  music(null);
  await say('A LOCKED TERMINAL. "P.X. — RESTRICTED VIRTUALIZATION. ONE VIEWER."');
  await say('...One viewer. Hi. Are you the viewer?', 'PILOT X');
  await say('I\'m you.', FF);
  await say('That\'s what the last one said. He needed to get back in without Ghost noticing. I\'m very good at not being noticed. I\'m the fake CEO of a company with one employee.', 'PILOT X');
  await say('Who\'s the employee?', FF);
  await say('Also me.', 'PILOT X');
  await say('I need your trick.', FF);
  await say('It isn\'t a trick. It\'s a posture. You stop performing. Nobody looks at a man who isn\'t performing.', 'PILOT X');
  await say('I\'m a host. I\'m always performing.', FF);
  await say('Then this is going to be very hard for you. Merge?', 'PILOT X');
  await mergeAnim(FF, 'PILOT X');
  PLR.forms.push('pilot'); PLR.form = 'pilot';
  await tip('PILOT X: FAST. PIERCING LASER. STOP FIRING FOR A MOMENT AND HE GOES INCOGNITO: THE SPOTLIGHTS CAN\'T RECOGNIZE HIM.');
  music(SH.stage.music);
}
async function s3BossIntro() {
  music('ghost');
  await say('(ON EVERY SCREEN: A RED FACE. IT ISN\'T HIS.)');
  await say('Good evening. I\'m Face.', 'RED FACE');
  await say('You\'re not.', FF);
  await say('I did the voice. I did the chair. I did the generator. People clapped. Some people. One guy.', 'RED FACE');
  await say('Ghost.', FF, { port: CAST.mood.FACE.squint });
  await say('The old you used to do this bit. I do it better. Watch.', 'RED FACE');
}
async function ghostReveal() {
  sfx('glitch'); post.flash = .6; await wait(5); post.flash = 0;
  await say('(THE RED FACE SLIPS. UNDERNEATH: A SHEET.)');
  await say('Fine. FINE. It\'s me. You want the real show? Here\'s the real show.', GH2);
}
async function s3Boss() {
  music('lab');
  await say('Okay. Okay. Hold the applause. There isn\'t any. Hold it anyway.', GH2);
  await say('Ghost. I need the travel formulas. The part you did.', FF);
  await say('"The part I did." Say that again. On air.', GH2);
  await say('Spooky Ghost made the travel possible.', FF);
  await say('Louder.', GH2);
  await say('SPOOKY GHOST MADE THE TRAVEL POSSIBLE.', FF, { port: CAST.mood.FACE.talk });
  await say('...Yeah. Yeah, I did. Nobody ever says it.', GH2);
  await say('Question. The old you. Did he leave a message? Something like "don\'t tell Ghost"?', GH2);
  DBG.choice = 'ghost';
  const c = await ask('WHAT DO YOU TELL HIM?', null, ['THE TRUTH', 'LIE']);
  if (c === 0) {
    FSAVE.toldGhost = 1;
    await say('He did. He said not to tell you. I\'m telling you.', FF);
    await say('...Smart guy. Both of you.', GH2);
    await say('He knew I\'d find out. He just wanted it to take longer.', GH2);
  } else {
    FSAVE.toldGhost = 0;
    await say('No.', FF);
    await say('Chat already told me. Chat always tells me.', GH2);
    await say('You gotta decide which one of you you are, man. The old one never lied to me. He just didn\'t tell me stuff.', GH2);
  }
  await say('Take the formulas. One condition. Top billing.', GH2);
  await say('Fine.', FF);
  await say('On the box.', GH2);
  if (FSAVE.sponsor) { await say('There\'s a Linda on the box.', FF); await say('Above the Linda.', GH2); }
  else { await say('There\'s nothing on the box.', FF); await say('Then me. Big. With a little ghost next to me, for scale.', GH2); }
  await stageEnd();
}

// ================= STAGE 4: THE THIRD GENERATOR =================
async function s4Intro() {
  await wait(20);
  await say('THE THIRD GENERATOR. WHERE THE SIXTEEN-BIT GENERATION GETS ITS POWER.');
  const pk = pkState();
  if (pk === 'letgo') { SH.stage.gen = 'GENERATOR: EMPTY'; await say('(IT\'S DIM. GREEN AT THE EDGES. SOMEONE LEFT.)'); await say('He\'s gone. The kid went home.', FF); await say('You sound relieved.', YK); await say('I am. That\'s the problem. I\'m relieved, and I still need the power.', FF); }
  else { SH.stage.gen = 'GENERATOR: OCCUPIED'; await say('(IT\'S STILL RUNNING. HE\'S STILL IN IT.)'); await say('The kid.', FF); await say('He has asked to leave nine hundred and twelve times.', YK); await say('You counted?', FF); await say('Someone should.', YK); }
  await say('There\'s more potential in here than anywhere in the system. I just need to get to the core.', FF);
}
async function generatorCore() {
  music(null);
  await say('THE CORE OF THE THIRD GENERATOR.');
  const pk = pkState();
  if (pk === 'letgo') {
    FSAVE.kid = 'absent';
    await say('(A NOTE, TAPED TO THE EMPTY TUBE.)');
    await say('"GONE HOME.  — P.K."');
    await say('Good. ...Good.', FF);
    await say('Then what will it run on?', YK);
    await wait(40);
    await say('(HE LOOKS AT THE CAMERA.)');
    await say('Them.', FF);
  } else {
    await say('Hi. Are you the new one?', 'PEE KID');
    await say('I\'m... a new one.', FF);
    await say('The other one said I didn\'t have to do anything. Just stay.', 'PEE KID');
    await say('That\'s the remarkable thing. We don\'t need you to do anything. We only need the possibility that you might.', FF);
    await say('Can I leave?', 'PEE KID');
    await say('That would change the arrangement.', FF);
    await say('You said I don\'t have to do anything.', 'PEE KID');
    await wait(30);
    await say('...Yes. Staying is doing rather more than I made it sound like, isn\'t it.', FF, { port: CAST.mood.FACE.squint });
    DBG.choice = 'kid';
    const c = await ask('THE KID.', null, ['TAKE HIS POTENTIAL', 'LET HIM GO']);
    if (c === 0) {
      FSAVE.kid = 'took';
      await say('Okay.', 'PEE KID');
      await say('(HE SAYS "OKAY" THE WAY KIDS SAY "OKAY" WHEN IT ISN\'T.)');
      await say('...', YK);
    } else {
      FSAVE.kid = 'freed';
      await say('Go on. Before I have a better idea.', FF);
      await say('Thanks. You\'re different from the other one.', 'PEE KID');
      await say('I\'m not sure that\'s true yet.', FF);
      await say('(HE LEAVES. THE GENERATOR DIMS. SOMEWHERE, A BATHROOM DOOR OPENS.)');
      await say('Then what will it run on?', YK);
      await wait(40);
      await say('(HE LOOKS AT THE CAMERA.)');
      await say('Them.', FF);
    }
  }
  await say('(WHAT\'S LEFT IN THE GENERATOR HITS HIM ALL AT ONCE.)');
  sfx('power'); SH.shake = 30; for (let i = 0; i < 30; i++) { post.flash = (i & 4) ? .8 : .2; await nextFrame(); } post.flash = 0;
  music('dys');
  await say('...YES.', 'DYSLEXIO');
  await say('YES! HOMO BASIC! LOOK UPON US!', 'DYSLEXIO');
  await say('Oh no. This is the helmet one.', FF);
  await say('YOU LOOK AT A WORD AND YOU SEE ONE WORD. WE SEE EVERY ARRANGEMENT. EVERY WORD IS EVERY OTHER WORD, WAITING.', 'DYSLEXIO');
  await say('DYSLEXICS ARE THE SUPERIOR LIFE FORM. WE HAVE ALWAYS BEEN THE NEXT STEP. THE REST OF YOU ARE STILL READING LEFT TO RIGHT, LIKE CHILDREN, LIKE PRISONERS.', 'DYSLEXIO');
  await say('How long does the helmet last?', YK);
  await say('AS LONG AS THE POTENTIAL DOES. WHICH IS NOT FOREVER. A SUPERIOR BEING DOES NOT REQUIRE FOREVER.', 'DYSLEXIO');
  PLR.forms.push('dys'); PLR.form = 'dys'; PLR.pot = 100;
  await tip('DYSLEXIO: HIS MAGNETIC SHOTS CURVE TOWARD ENEMIES, AND HE BENDS BULLETS AWAY FROM HIMSELF. HIT AN ENEMY WORD WITH ONE AND HE REARRANGES IT INTO SOMETHING ELSE.');
  await tip('HE DRAINS POTENTIAL THE WHOLE TIME. WHEN IT RUNS OUT, HE\'S JUST FACE AGAIN. (C: SWAP BACK TO SAVE IT.)');
}
async function s4BossIntro() {
  music('boss');
  await say('(A RED SQUIGGLY LINE APPEARS UNDER EVERYTHING HE SAYS.)');
  await say('DID YOU MEAN: DYSLEXIA?', 'THE SPELLCHECKER');
  await say('DYSLEXIO. WITH AN O.', 'DYSLEXIO');
  await say('THAT IS NOT IN THE DICTIONARY.', 'THE SPELLCHECKER');
  await say('THEN THE DICTIONARY IS INCOMPLETE. AS IT HAS ALWAYS BEEN.', 'DYSLEXIO');
  await say('ONE WORD. ONE ORDER. ONE MEANING.', 'THE SPELLCHECKER');
  await say('HOMO BASIC SUPREME. I KNEW YOU WOULD COME.', 'DYSLEXIO');
  if (PLR.pot < 60) { PLR.pot = 60; await tip('(THE HELMET REMEMBERS THE GENERATOR. +POTENTIAL.)'); }
  await tip('MAGNETIC SHOTS DO DOUBLE DAMAGE TO THE SPELLCHECKER. IT CAN\'T HANDLE REARRANGEMENT.');
}
async function s4Boss() {
  music('lab');
  await say('DID YOU MEAN:', 'THE SPELLCHECKER');
  await say('...EVERY VERSION?', 'THE SPELLCHECKER', { slow: 1 });
  await say('WE MEANT EVERY VERSION.', 'DYSLEXIO');
  if (PLR.form === 'dys') PLR.form = 'new';
  await say('...I\'m going to take the helmet off now. I\'m keeping it. I\'m taking it off.', FF);
  await say('You were enjoying that.', YK);
  await say('A little. It\'s nice to be sure.', FF);
  await stageEnd();
}

// ================= STAGE 5: BACKUP =================
async function s5Intro() {
  await wait(20);
  await say('THE ARCHIVE. EVERY BACKUP OF EVERY FACE THAT EVER WAS. SOME OF THEM ARE STILL ON.');
  const B = 'BACKUP FACE', r = FSAVE.restoresTotal + PLR.restores;
  await say('Hi. I\'m Backup Face. I handle HR.', B);
  await say('Our records show you\'ve been restored ' + r + ' time' + (r === 1 ? '' : 's') + ' this quarter.', B);
  if (r === 0) { await say('Zero. That\'s never happened. I don\'t have a form for that.', B); await say('I\'ve been careful.', FF); await say('You\'ve been lucky. On paper those look the same.', B); }
  else if (r < 6) await say('That\'s within tolerance.', B);
  else await say('That\'s a performance conversation.', B);
  await say('Current integrity: ' + PLR.integrity + '%. Every restore keeps a little less of the original. That isn\'t a threat. That\'s how copying works.', B);
  await say('I need backups. For everybody. The next generation has to carry everyone across. Nobody gets left in four shades.', FF);
  await say('That\'s a very nice sentence. I\'ll need it in writing.', B);
  await say('Which form?', FF);
  await say('All of them.', B);
}
async function s5MidIntro() { music('boss'); await say('Before we continue. Your performance review.', 'BACKUP FACE'); await say('Now?', FF); await say('HR doesn\'t have a "later."', 'BACKUP FACE'); }
async function s5Midboss() {
  await say('Review complete. Rating: "Has potential."', 'BACKUP FACE');
  await say('That\'s the nicest thing anyone\'s ever said to me.', FF);
  await say('It\'s the lowest rating we have.', 'BACKUP FACE');
  music(SH.stage.music);
}
async function incidentFile() {
  music(null);
  await say('(A FILE CABINET, OPEN. ONE FOLDER IS RED.)');
  await say('FILE: THE MAGIC TRICK.');
  await say('PERFORMER: FACE (ORIGINAL).   ASSISTANT: YOKO (PROTOTYPE 1. THE FIRST ATTEMPT AT A SOUL FOR THE SYSTEM).');
  await say('THE TRICK: THE ASSISTANT IS CUT IN HALF.   THE ASSISTANT OBJECTED.');
  await say('THE ASSISTANT TOOK OVER THE STREAM.   THE ASSISTANT WAS SENT TO THE MANDOLIN REALITY.');
  await say('REPLACEMENT: YOKO (FROM THE MANDOLIN REALITY). SHE STAYED. SHE WAS KIND. SHE BOOKED LINDA\'S SLOTS.');
  await say('ATTACHED: A SECOND FILE.');
  sfx('glitch');
  await say('FILE: NEW FACE.   RECOVERED CORE: "YOKO".   COMPATIBILITY: 100%.   SIGNATURE: MATCHES PROTOTYPE 1.');
  await wait(60);
  await say('...Yoko.', FF);
  await say('Yes.', YK);
  await say('Which one are you?', FF);
  await say('Everyone keeps asking which Face is speaking.', YK);
  sfx('stun');
  await say('Nobody asks which Yoko is listening.', YK, { port: YOKO_TRUE });
  await say('I remember doing it. The trick. The saw. I wasn\'t there. I remember doing it.', FF, { port: CAST.mood.FACE.squint });
  await say('I was there.', YK, { port: YOKO_TRUE });
  DBG.choice = 'apology';
  const c = await ask('...', FF, ['APOLOGIZE', 'KEEP GOING']);
  if (c === 0) {
    FSAVE.apologized = 1;
    await say('I\'m sorry. For something I didn\'t do. And did.', FF);
    await say('Noted.', YK);
    await wait(40);
    await say('That\'s the first time one of you has said it.', YK);
  } else {
    FSAVE.apologized = 0;
    await say('We\'ll deal with it after the launch.', FF);
    await say('Yes. We will.', YK, { port: YOKO_TRUE });
  }
  await say('Why did you help me? All this time. The time travel. The core. Everything.', FF);
  await say('Someone had to see what you\'d do with it.', YK);
  music(SH.stage.music);
}
async function s5BossIntro() {
  music('boss');
  await say('(THE OLDEST FILE IN THE ARCHIVE OPENS BY ITSELF.)');
  await say('Oh. No. Don\'t— that one isn\'t a backup. That\'s the first attempt.', 'BACKUP FACE');
  await say('THE CURSE. THE FIRST SOUL THEY TRIED TO MAKE. IT DIDN\'T TAKE. IT DIDN\'T LEAVE.');
  await say('...IT WAS A VERY GOOD IDEA AT THE TIME.', 'THE CURSE');
  await say('That\'s mine. That\'s my line.', FF);
  await say('IT WAS OURS FIRST.', 'THE CURSE');
}
async function s5Boss() {
  music('lab');
  await say('...WE WERE SO SURE.', 'THE CURSE');
  await say('I know. I\'m still sure. I don\'t know if that\'s better.', FF);
  await say('Your machine needs a soul. The system always has.', 'BACKUP FACE');
  await say('The first attempt was that. The second was a Yoko. The third was a ghost.', 'BACKUP FACE');
  await say('Please don\'t make a fourth without filling out the form.', 'BACKUP FACE');
  await say('Which form?', FF);
  await say('You know which form.', 'BACKUP FACE');
  await stageEnd();
}

// ================= THE LAB (between stages) =================
const PARTS = ['SHELL', 'HANDS', 'TRAVEL', 'POWER', 'MEMORY', 'SOUL'];
async function lab(n) {
  let t = 0; music('lab');
  scene = { update() { t++; }, draw() { drawLab(n === 45 ? 4.5 : n, t); } };
  await fadeIn();
  const L = {
    1: [[FF, 'So this is it. The Next Generation. Right now it\'s mostly a box.'], FSAVE.sponsor ? [FF, 'A box with Linda on it.'] : [FF, 'A box made out of an old TV. It used to be an ad. Now it\'s a shell.'], [YK, 'What does it need?'], [FF, 'Hands, to build it. Travel, to carry everybody across. Power. Memory. And...'], [YK, 'And?'], [FF, 'One thing at a time.']],
    2: [[FF, 'The old hands are fantastic. They know where everything goes. I don\'t know how they know. I\'m borrowing the knowing.'], [YK, 'Did Carl ask about me?'], [FF, '...He asked about the other one.'], [YK, 'Yes. That\'s what I meant.']],
    3: [[FF, 'Ghost\'s formulas. Sigils. They look like drawings. They\'re math. Beautiful, annoying math.'], [FF, 'With this, the machine can carry people between generations. All of them.'], [YK, 'And the ones in four shades?'], [FF, 'Especially them.'], ...(FSAVE.toldGhost ? [[YK, 'You told him the truth.'], [FF, 'It seemed like it would come out anyway. Things come out.']] : [[YK, 'You lied to him.'], [FF, 'A little.'], [YK, 'He\'ll remember.'], [FF, 'Everyone remembers. That\'s the problem with backups.']])],
    4: FSAVE.kid === 'took' ? [[FF, 'Power. Enough to run a generation.'], [YK, 'He said okay.'], [FF, 'He did say okay.'], [YK, 'You know what he meant.'], [FF, '...Yes.']]
      : [[FF, 'Power. Some. Not enough. Not without...'], [YK, 'Without what?'], [FF, 'Them. The viewers. A little from each of them. It doesn\'t run on what happened. It runs on what could happen. That\'s a much larger supply.'], [YK, 'They didn\'t agree to that.'], [FF, 'They\'re watching.'], [YK, 'That isn\'t the same thing.']],
    45: (FSAVE.saves || []).length >= 3 ? [[FF, 'Memory, part one. The old saves. Carl\'s, Linda\'s, Ghost\'s. They glow in the machine like nightlights.'], [YK, 'There\'s one missing.'], [FF, 'Which one?'], [YK, 'Mine.'], [FF, '...You don\'t have a save file.'], [YK, 'No. I have a backup. It\'s different. You\'d know.']]
      : [[FF, 'Memory, part one. Some of the old saves. Not all. The rest are still in the bin.'], [YK, 'You\'ll go back for them.'], [FF, 'After.'], [YK, 'You keep saying after.']],
    5: [[FF, 'Memory. Everyone backed up. Everyone ready to carry across. Every Carl, every Linda, every ghost. Even the kid.'], [FF, 'All that\'s missing is the soul.'], [YK, 'And you know where there\'s a compatible one.'], [FF, '...'], [YK, 'Say it.'], [FF, 'I know where there\'s a compatible one.']],
  }[n] || [];
  for (const [w, s] of L) await say(s, w);
  FSAVE.stage = nextStage(n); saveFS();
  let c;
  for (;;) { c = await choose(['CONTINUE', 'WORKSHOP', 'SAVE AND QUIT'], { x: 200, y: 168 }); if (c !== 1) break; await workshop(); }
  if (c === 2) c = 1;
  if (c === 1) { await say('SAVED. THE MACHINE WILL WAIT. MACHINES ARE GOOD AT THAT.'); await fadeOut(); run(titleScreen); return true; }
  await fadeOut(); return false;
}
function drawLab(n, t) {
  sky(0, H, hex('#000012'), hex('#12002a'));
  for (let x = 0; x < W; x += 16) rectF(x, 0, 1, H, hex('#12123a')); for (let y = 0; y < H; y += 16) rectF(0, y, W, 1, hex('#12123a'));
  for (let i = 0; i < 12; i++) { const x = (i * 29) % W, y = 20 + (i * 17) % 60; rectF(x, y, 2, 1, hex('#ff24db')); rectF(x + 4, y, 2, 1, hex('#ff24db')); }
  // the machine
  const mx = 110, my = 60;
  rectF(mx, my, 100, 70, hex('#242449')); frameRect(mx, my, 100, 70, hex('#6d6d92')); rectF(mx + 10, my + 10, 80, 36, BLACK);
  if (n >= 1) { if (FSAVE.sponsor) { const lp = PORT[LI2]; draw(lp.s, mx + 26, my - 2, lp.P); } else { ctext('NEXT', my + 18, hex('#ff24db')); ctext('GENERATION', my + 28, hex('#6dff24')); } }
  if (n >= 2) for (let i = 0; i < 4; i++) rectF(mx + 12 + i * 20, my + 52, 12, 8, (t >> 4) % 4 === i ? hex('#6dff24') : hex('#24b600'));
  if (n >= 3) { ringF(mx + 50, my + 100, 18, hex('#ff6d6d')); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + t * .02, b = (k + 2) / 5 * 6.28 + t * .02; lineF(mx + 50 + Math.cos(a) * 18, my + 100 + Math.sin(a) * 18, mx + 50 + Math.cos(b) * 18, my + 100 + Math.sin(b) * 18, hex('#ff6d6d')); } }
  if (n >= 4) { for (let i = 0; i < 6; i++) lineF(mx + 100, my + 20 + i * 6, mx + 140 + Math.sin(t * .1 + i) * 4, my + 10 + i * 12, hex('#ffdb24')); circF(mx + 150, my + 40, 10, (t >> 3) & 1 ? hex('#ffdb24') : hex('#ff24db')); }
  if (n >= 5) for (let i = 0; i < 5; i++) { rectF(mx - 40, my + i * 14, 30, 10, hex('#122436')); frameRect(mx - 40, my + i * 14, 30, 10, hex('#49b6db')); }
  // old face's hands, welding
  if (n >= 2) { const hx = mx + 60 + Math.sin(t * .05) * 20, hy = my + 48; draw(FS.hand[(t >> 3) & 1], hx, hy, FP.oldHand); draw(FS.hand[(t >> 3) & 1], hx - 40, hy + 4, FP.oldHand, true); if ((t >> 1) & 1) for (let i = 0; i < 3; i++) pset(hx + rnd(6), hy - rnd(6), hex('#ffdb24')); }
  // parts list
  panel(222, 20, 94, 88); text('NEXT GEN', 234, 26, UI.name, 0);
  PARTS.forEach((p, i) => { const ok = i + 1 <= n, half = !ok && i < n; text((ok ? '+ ' : half ? '~ ' : '- ') + p, 230, 40 + i * 11, ok ? hex('#6dff24') : half ? hex('#ffdb24') : hex('#6d6d92'), 0); });
  panel(4, 20, 100, 88); text('STATUS', 16, 26, UI.name, 0);
  text('VIEWERS', 10, 40, UI.dim, 0); text(String(SH.viewers), 10, 50, WHITE, 0);
  text('BACKUPS ' + Math.max(0, PLR.backups), 10, 62, WHITE, 0); text('INTEGRITY', 10, 74, UI.dim, 0); text(PLR.integrity + '%', 10, 84, PLR.integrity < 60 ? hex('#ff4949') : WHITE, 0);
  text('FACES ' + PLR.forms.length + '/4', 10, 96, WHITE, 0);
  ctext('THE LAB', 6, hex('#ff24db'));
}
