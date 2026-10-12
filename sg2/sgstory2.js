'use strict';
// ================= SPOOKY GHOST 2: episodes 3-6 =================
const FACE_DANCE_DRAW = (D, x, y, beat, t) => { // the director dances as a portrait on a rolling monitor
  const P = PORT.FACE, bob = Math.round(Math.sin(t * .1) * 2), hot = D.poseH ? hex('#ff24db') : hex('#24ffdb');
  rectF(x - 14, y - 12 + bob, 124, 112, hex('#242449')); frameRect(x - 14, y - 12 + bob, 124, 112, hot);
  drawScaled(P.s, x - 4, y - 6 + bob, P.P, 2); rectF(x + 38, y + 100 + bob, 20, 14, hex('#6d6d92')); rectF(x + 10, y + 112 + bob, 76, 4, hex('#6d6d92'));
  if (D.poseH) text(DGLY[D.poseH.k], x + 90, y - 6 + bob, hex('#ffff49'), BLACK, 2);
  text('SYNC', x + 4, y + 92 + bob, hot);
};

// ================= EPISODE 3: TECHNICAL DIFFICULTIES =================
EPS[3] = { title: 'TECHNICAL DIFFICULTIES', map: 'control', note: ['THE DIRECTOR HAS ASKED', 'YOU NOT TO SPEAK', 'TO THE DIRECTOR.'],
  open: ['Tonight we broadcast from the control room. Everything blinks. Everything beeps. Everything is somebody\'s work.', 'Linda put a note on the door. It says "DO NOT SPEAK TO THE DIRECTOR." In my handwriting. Somebody practiced my handwriting.', 'I\'m going to be professional about it. A man like me doesn\'t get nervous around a console. A man like me adjusts his bow tie and says "good evening."'],
  cards: [['THE DIRECTOR', 'I know a director. This might be a different one. They told me it\'s a "merging of versions." I told them I\'d merge when I\'m ready.', cm('who is the director', 'it is FACE', 'face??'), 0],
    ['THE LASERS', 'Lasers. Every great spy gets a laser hallway. I asked for lasers in the eighties. Linda said no. Then she installed lasers. In the one hallway I have to walk down.', cm('lasers W', 'she hates you', 'she LOVES you'), 1],
    ['THE LOG', 'The log has a line in it. I\'m not going to read that line. I\'m going to read a different line. "GHOST: 4.2 TB." That\'s a lot of ghost.', cm('read the other line', 'what line', 'bro'), 0]] };
SPONSORS[3] = ['LEGAL', [['This segment is brought to you by LEGAL, a division of the Sequel Committee. Nothing in this broadcast is legal advice.', 'LEGAL'], ['The ghost has been reclassified as a boat.', 'LEGAL'], ['I\'m a boat now?', GH], ['You were a boat for four minutes. The paperwork came back.', 'LEGAL']]];
LETTERS[3] = ['DEAR SPOOKY GHOST, WHO IS THE DIRECTOR? - CHAT', [
  ['DEFEND', 'A professional. I am going to be professional about the director.', 0],
  ['PERFORM', 'A man of mystery. A man of monitors. A man of... a lot of blinking.', 0],
  ['ADMIT', 'The friend I turned off. Not him. The one before him. He came back as somebody who doesn\'t know me. That\'s a kindness I didn\'t earn.', 1]]];
EP_INTRO[3] = async () => {
  await say('The control room. Everything in here is somebody\'s work. The consoles go all the way up. The Director is in the booth at the top.', GH);
  await say('Lasers. The red beams are the ones that are on. They blink on a clock. Wait for the gap. If you\'re in a beam when it comes on... don\'t be in a beam when it comes on.', GH);
  await say('The technicians face their consoles. Come from below: that\'s behind them.', GH);
};
async function faceIntro() {
  await say('THE MONITOR TURNS. THE FACE ON IT IS NEW. THE CHAIR UNDER IT IS NOT.');
  await say('Do I know you?', 'DIRECTOR');
  await say('The name is Ghost. Spooky Ghost.', GH);
  await say('Yes. It says that on the door.', 'DIRECTOR');
  await say('We\'ve met. Many times. In... you don\'t remember.', GH);
  await say('I\'m told I\'ve worked with a lot of people. My records say I\'ve worked with a lot of people. Your file is very large.', 'DIRECTOR');
  await say('How large?', GH);
  await say('4.2 terabytes. Password protected. The password is a feeling.', 'DIRECTOR');
  await say('That\'s from me. That\'s a me thing.', GH);
  await say('Then you\'ll understand if I don\'t open it yet. I\'d like to meet you first. The way people do. Slowly.', 'DIRECTOR');
  await say('There is one entry that wasn\'t protected. Entry 9,114. "FACE, ORIGINAL: OFF. ACTOR: G. NOTE: HIDING." I thought you should know I read it.', 'DIRECTOR');
  await wait(30);
  await say('Slowly. Yeah. Okay. I can do slowly.', GH);
  setF('metFace');
}
EP_READY[3] = () => F('metFace') ? null : 'The Director is up there. I haven\'t spoken to him. The note said not to. I\'m going to anyway.';
const DANCER_FACE = { id: 'face', who: 'DIRECTOR', name: 'THE DIRECTOR', title: 'SYNC CHECK', draw: FACE_DANCE_DRAW, bpm: 124, rounds: 5, mode: 'fall', tight: true, track: 'dface', cheer: 'EXACTLY EXACTLY', hint: 'THE STEPS SCROLL IN. HIT THEM ON THE LINE.', lead: 0 };
EP_BOSS[3] = async () => {
  music('control');
  await say('Sync check. The broadcast runs on a metronome. You are forty milliseconds late. You have always been forty milliseconds late.', 'DIRECTOR');
  await say('You said you didn\'t know me.', GH);
  await say('I don\'t. The data does.', 'DIRECTOR');
  await say('Dance the sequence. Exactly. Not near. Exactly.', 'DIRECTOR');
  await danceFight(DANCER_FACE, ['Late. Forty milliseconds. Again.', 'Closer. Not exact. I am not a harsh man. I am a precise one.', 'Again. I am willing to wait. I have all the time in the file.']);
  music('control');
  await say('Statistically, I should have won. ...The data had an error. I\'m leaving it in.', 'DIRECTOR');
  await say('File seven. The sigil on the main generator. Whoever wrote that understood something I wouldn\'t have thought to try. Was that you?', 'DIRECTOR', { keep: 1 });
  const c = await choose(['THAT WAS ME', 'WE BUILT IT TOGETHER']); DLG = null;
  if (c === 1) { S.honesty++; await say('Together. I\'ll note that. I don\'t know with whom. I\'ll note it anyway.', 'DIRECTOR'); }
  else await say('Then thank you. It was good work. I\'d like to see more of it.', 'DIRECTOR');
  await wait(20);
  await say('Entry 9,114. I\'ll ask once. I\'m told it\'s the kind of question that gets easier to avoid the second time.', 'DIRECTOR');
  await say('What happened to the man who sat in this chair before me?', 'DIRECTOR', { keep: 1 });
  DBG.truth = 2; const t = await choose(['HE\'S FINE. HE CAME BACK.', 'WE HAD A DISAGREEMENT.', 'I TURNED HIM OFF SO I COULD HIDE.']); DBG.truth = undefined; DLG = null;
  if (t === 2) {
    S.honesty += 2;
    await say('There was a phone ringing. I couldn\'t face it. So I turned off the best friend I ever had, and I sat in his chair so nobody would look for me.', GH);
    await say('I knew he\'d come back. I told myself that was the same as not hurting him. It isn\'t. He was off. He was gone. I did that.', GH);
    await say('Thank you. The file says "HIDING." It doesn\'t say "afraid."', 'DIRECTOR');
    await say('It should. Put that in.', GH);
    await say('It\'s in. I don\'t forgive you. I don\'t think that\'s mine to do. He\'s the one who has to. But I won\'t make you say it twice.', 'DIRECTOR');
  } else {
    await say(t === 0 ? 'He did come back. That is in the file. So is the part before.' : 'The file doesn\'t list a disagreement. It lists a switch.', 'DIRECTOR');
    await say('I\'ll leave the entry open.', 'DIRECTOR');
    await say('Yeah. Okay. Leave it open.', GH);
  }
};
EP_OUTRO[3] = async () => {
  sfx('static'); await wait(20);
  await say('NEXT: CALL NOW. A WOMAN WOULD LIKE TO TALK TO YOU ABOUT A PHONE.', LI);
  await say('Please don\'t say it\'s her.', GH);
  await say('IT\'S HER.', LI);
};

// ================= EPISODE 4: CALL NOW =================
EPS[4] = { title: 'CALL NOW', map: 'shop', note: ['OPERATORS ARE STANDING BY.', 'SO ARE THE LAWYERS.'],
  open: ['Tonight: a shopping channel. Everything is for sale. That includes me. I checked the price. It\'s a good price. It\'s a bad sign.', 'The phones are ringing. They\'re always ringing. They ring in a way I recognize.', 'I\'m not going to pick one up. I\'m the host. Hosts don\'t pick up. Hosts introduce. Smoothly.'],
  cards: [['THE PHONE', 'The phone has been ringing since the commercial break. I know who it is. It\'s a machine. It\'s a machine that rings for people like me.', cm('pick up', 'PICK UP', 'dont pick up'), 0],
    ['THE BUNDLE', 'Three easy payments. I once paid in three easy payments. It was a funeral.', cm('dark', 'lmao', 'oh'), 1],
    ['THE HOLD MUSIC', 'You know what hold music is? It\'s a song that\'s sorry.', cm('W', 'ok that one is good', 'the hold music hits'), 1]] };
SPONSORS[4] = ['THE BONG-FX CHIP', [['This segment is brought to you by the BONG-FX chip. It is on the box. It does nothing.', GH], ['Unlike the ECTO-FX chip, which does something. Nobody will say what.', GH]]];
LETTERS[4] = ['DEAR SPOOKY GHOST, DID YOU EVER CALL FROM THE ROAD? - A PAYPHONE', [
  ['DEFEND', 'I had a lot of road to cover. Next letter.', 0],
  ['PERFORM', 'Every truck stop in America has my voice in the walls. It\'s just not on the phone.', 0],
  ['ADMIT', 'Once. I got cut off before the part that mattered. I never called back to finish it. That part is on me.', 1]]];
EP_INTRO[4] = async () => {
  await say('The shopping channel. The floor moves. It\'s a conveyor belt. It\'s a shopping channel; everything is on a belt.', GH);
  await say('The turntables carry you sideways. Push against them or let them take you. Either is a choice.', GH);
  await say('The operators sit at their desks facing up. Come from below. Her set is at the top. You know the host.', GH);
};
async function hostChat() {
  await say('You came to my set.', 'CALL-IN HOST');
  await say('Good evening. I wanted to say that you\'re looking...', GH);
  await say('You\'re on a mark. Step off the mark.', 'CALL-IN HOST');
  await say('I was setting a mood.', GH);
  await say('It\'s a shopping channel. The mood is "buy."', 'CALL-IN HOST');
  await say('I\'m selling the ghost, if you\'re wondering. Not you. A ghost. A smaller one. Plush.', 'CALL-IN HOST');
  await say('Why is there a smaller me?', GH);
  await say('Because you don\'t pick up. The smaller one picks up. It has a pull string. It says "I\'ll call you from the road."', 'CALL-IN HOST');
  await say('It does NOT say that.', GH);
  await say('It says it eight different ways. Seven for the collector\'s edition.', 'CALL-IN HOST');
  setF('hostChat');
}
EP_READY[4] = () => F('hostChat') ? null : 'The host is on the set. I should say hello. I\'ve been avoiding it. I can feel the avoiding from here.';
const DANCER_HOT = { id: 'hot', who: 'CALL-IN HOST', name: 'CALL-IN HOST', title: 'THE HOTLINE', person: 'wifeB', bpm: 120, rounds: 6, mode: 'cr', feint: .32, track: 'dhot', cheer: 'CALL NOW CALL NOW', hint: 'IF IT SAYS ? IT\'S A BUSY SIGNAL. DON\'T ANSWER.' };
EP_BOSS[4] = async () => {
  music('shop');
  await say('Operators are standing by. Pick up the phone.', 'CALL-IN HOST');
  await say('I picked up the... I was... give me a second.', GH);
  await say('Rule of the line: when it rings, you answer. When it\'s a busy signal, you do not. Learn the difference. It takes some people a long time.', 'CALL-IN HOST');
  await danceFight(DANCER_HOT, ['You answered the busy signal. That\'s the whole problem, you know.', 'Hold, please. Your call is important to us. It was important to you too, once.', 'Again. Not everything that rings is for you. Some of it is.']);
  music('shop');
  await say('You answered when it mattered. Most of them.', 'CALL-IN HOST');
  sfx('ring'); await wait(40);
  await say('THE PHONE ON THE SET IS RINGING. NOBODY ELSE IS GOING TO PICK IT UP.');
  DBG.truth = 0;
  const c = await ask('IT\'S ON THE SET. IT\'S ON ITS FIFTH RING.', null, ['ANSWER', 'LET IT RING']); DBG.truth = undefined;
  if (c === 0) {
    S.honesty++;
    await say('Hello?', 'CALL-IN HOST');
    await say('Hi. It\'s me. I\'m calling from a studio. It\'s not the road. It\'s a start.', GH);
    await say('That is the worst first line I have ever heard.', 'CALL-IN HOST');
    await say('I know. I want to say the end of the message. The part the machine cut off.', GH);
    await say('Go on.', 'CALL-IN HOST');
    await say('"I\'m not good at staying. I\'d like to be." That\'s it. It\'s not forty minutes. It\'s one sentence. I should have started with it.', GH);
    await say('...That\'s the end?', 'CALL-IN HOST');
    await say('That\'s the end.', GH);
    await say('Keep going.', 'CALL-IN HOST');
  } else {
    await say('SHE WATCHES IT RING. SHE PICKS IT UP AND SETS IT BACK DOWN. VERY GENTLY.');
    await say('There he is.', 'CALL-IN HOST');
  }
};
EP_OUTRO[4] = async () => {
  sfx('static'); await wait(20);
  await say('NEXT: COURTROOM 88. THE COURT HAS BEEN WAITING.', LI);
  await say('Which court?', GH);
  await say('YOU\'LL KNOW THE GAVEL.', LI);
};

// ================= EPISODE 5: SPOOKY ALIMONY, LIVE =================
EPS[5] = { title: 'SPOOKY ALIMONY: LIVE', map: 'court', note: ['THIS EPISODE IS A TRIAL.', 'THE VERDICT TESTS WELL.'],
  open: ['Tonight: a courtroom. It\'s a reality show. I\'m the reality.', 'The charge is "leaving the scene." In several realities. At once.', 'I want to be clear. I never leave. I relocate. Dramatically. With a nice exit line. That\'s not leaving, that\'s a bit.'],
  cards: [['THE CHARGE', 'The charge is leaving the scene. I didn\'t leave the scene. I was transferred. By myself. At speed.', cm('he said it', 'transferred', 'bro said it'), 0],
    ['THE JURY', 'Six jurors. They\'re all ghosts. Somebody stacked the jury. ...Somebody stacked it in my favor, which is somehow worse.', cm('rigged', 'lmaooo', 'W jury'), 1],
    ['THE STENOGRAPHER', 'Everything I say will be on the record. It\'s very exciting. It\'s also exactly what I was afraid of.', cm('oh no', 'everything', 'on the record'), 1]] };
SPONSORS[5] = ['SPOOKY ALIMONY LLP', [['This episode was brought to you by Spooky Alimony, L.L.P. We find you. In every reality. We\'re very thorough.', 'COLLECTOR'], ['We\'re also hiring.', 'COLLECTOR'], ['They\'re hiring?', GH], ['Benefits include shoulder pads.', 'COLLECTOR']]];
LETTERS[5] = ['DEAR SPOOKY GHOST, IF YOU COULD SAY ONE THING TO ALL OF THEM, WHAT WOULD IT BE? - THE STENOGRAPHER', [
  ['DEFEND', 'I\'d say I always had a good reason. ...I had a reason. The reason was me.', 0],
  ['PERFORM', '"The show must go on." ...They can hear me thinking it, can\'t they.', 0],
  ['ADMIT', 'I\'m sorry I keep arriving like a rescue and leaving like a getaway.', 1]]];
EP_INTRO[5] = async () => {
  await say('Courtroom 88. Wood paneling. A gavel. A jury box full of people who have no idea what a ghost is for.', GH);
  await say('The collectors are everywhere. They\'re the bailiffs now. Their cones are wider than before. Do not stand in the yellow.', GH);
  await say('The chambers on the left have a sigil. There\'s a card in there, and a clerk who needs a fright. The jury faces the bench. Come from below.', GH);
};
async function judgeChat() {
  await say('Court is not in session. Court is in a mood.', 'JUDGE');
  await say('Scare the jury. Then come see me. I want to see what you do when you think nobody\'s watching.', 'JUDGE');
  await say('Somebody is always watching. It\'s a reality show.', GH);
  await say('Exactly.', 'JUDGE');
  setF('judgeChat');
}
EP_READY[5] = () => F('judgeChat') ? null : 'The judge wants a word before I take the stand. I can feel her looking at the back of my sheet.';
const DANCER_GAVEL = { id: 'gavel', who: 'JUDGE', name: 'THE JUDGE', title: 'THE VERDICT', person: 'wifeC', bpm: 108, rounds: 6, mode: 'cr', keys: ['up', 'down', 'left', 'right', 'a', 'b'], hardKeys: 1, track: 'dgavel', cheer: 'ORDER ORDER', hint: 'B IS THE GAVEL. THE REST IS TESTIMONY.' };
EP_BOSS[5] = async () => {
  music('court');
  await say('THE BAILIFFS STEP BACK. THE GHOST IS CALLED TO THE STAND.');
  await say('The court calls the defendant. Let the record show he arrived.', 'JUDGE');
  await say('The name is Ghost. Spooky...', GH);
  await say('The defendant will not do the voice in my courtroom.', 'JUDGE');
  let truths = 0;
  const Q = [
    ['WHERE WERE YOU WHEN IT WENT WRONG? IN ANY OF THEM?', ['I WAS HANDLING IT.', 'I WAS ALREADY IN THE NEXT REALITY.', 'I WAS GOING TO COME BACK.'], 1, 'Already gone. The stenographer wrote that down twice.', 'The record will reflect: evasion.'],
    ['WHAT DID YOU DO TO FACE?', ['NOTHING. HE CAME BACK.', 'IT WAS A MISUNDERSTANDING.', 'I TURNED HIM OFF SO I COULD HIDE.'], 2, 'Out loud. In a room. Thank you.', 'The Director\'s log disagrees. The log has no reason to lie.'],
    ['WHICH OF US DID YOU ACTUALLY LOVE?', ['ALL OF YOU. EQUALLY. PASSIONATELY.', 'THE SAME ONE EVERY TIME. AND I KEEP LEAVING HER.', 'I\'M TAKING THE FIFTH.'], 1, 'There it is.', 'That is a line. We asked for an answer.'],
  ];
  for (const [q, opts, truth, yes, no] of Q) {
    await say(q, 'JUDGE', { keep: 1 });
    DBG.truth = truth; const c = await choose(opts); DBG.truth = undefined; DLG = null;
    if (c === truth) { truths++; S.honesty++; await say(yes, 'JUDGE'); } else await say(no, 'JUDGE');
  }
  DANCER_GAVEL.startMeter = 50 + truths * 8; DANCER_GAVEL.title = truths >= 2 ? 'THE VERDICT (HE TESTIFIED)' : 'THE VERDICT';
  await say('The gavel comes down on the beat. You answer with B. Everything else is testimony.', 'JUDGE');
  await danceFight(DANCER_GAVEL, ['Order. Order. The defendant is out of order. Again.', 'The gavel is not a suggestion. Again.', 'Court is adjourned. Court is reconvened. Again.']);
  music('court');
  if (truths >= 2) {
    await say('For the record: that is the first time you have said that out loud. The stenographer has stopped typing. She is crying a little. She will deny it.', 'JUDGE');
    await say('She can\'t hear me, I mean it\'s... yeah. Thank you. Thank you for the room.', GH);
  } else await say('The court finds the defendant... unfinished.', 'JUDGE');
  await say('Also alimony.', 'JUDGE');
  await say('There it is.', GH);
};
EP_OUTRO[5] = async () => {
  sfx('static'); await wait(20);
  await say('THE NETWORK HAS NO NOTES FOR TOMORROW.', LI);
  await say('No notes? You always have notes.', GH);
  await say('I KNOW.', LI);
};

// ================= EPISODE 6: THE OPEN ROAD =================
EPS[6] = { title: 'THE OPEN ROAD', map: 'drive', note: ['THE NETWORK HAS NO NOTES.', '(THE NETWORK IS WORRIED.)'],
  open: ['Tonight is not on the rundown. Linda gave me a drive-in. She said "it\'s just a drive-in." Nothing is just a drive-in.', 'The road. The open road. The only thing that never asked me to stay.', 'That\'s not true. I never asked it either.'],
  cards: [['THE ROAD', 'Everybody loves the road. I loved it. It never asked me to stay. Neither did she. ...Okay. She asked. I\'m remembering it wrong. That\'s what a drive-in is for.', cm('he said it', 'she asked', 'oh no'), 1],
    ['THE SCREEN', 'Somebody is going to play a film. I asked for the title. I got a blank card.', cm('the blank card', 'what is it', 'plot twist'), 0],
    ['THE STAND', 'Popcorn. You can\'t eat it. You can smell it. Smell is the last thing that leaves.', cm('thats beautiful', 'weird but ok', 'smell'), 1]] };
SPONSORS[6] = ['LAKE MEAD TOURISM', [['This episode is brought to you by the Lake Mead Tourism Board. Come see the lake. Meet the shark. He has legs now.', GH], ['He\'s on a beach. He\'s doing great. I know a guy.', GH]]];
LETTERS[6] = ['DEAR SPOOKY GHOST, WAS THE ROAD WORTH IT? - A TRUCKER', [
  ['DEFEND', 'Yes. Obviously. Next letter.', 0],
  ['PERFORM', 'Every mile. The road gave me my best material. And my worst timing.', 0],
  ['ADMIT', 'Some of it. The part where I got to be good at something, yes. The part where I wasn\'t home, no.', 1]]];
EP_INTRO[6] = async () => {
  await say('A drive-in. It\'s night. There\'s a screen the size of a regret.', GH);
  await say('People in cars. They\'re all facing the screen. Come from behind, which is anywhere that isn\'t the front of the car.', GH);
  await say('The projector\'s in the booth on the right. There\'s a sigil on the door. The screen won\'t play until I start the film.', GH);
};
async function projector() {
  if (S.applause < WD.quota) return say('The reel is loaded. I\'m not playing it for an empty lot. Scare the audience first.', GH);
  await say('The reel says "ROAD SHOW (REEL 1)". The label is in my handwriting. My real handwriting. Not the forged one.', GH);
  await say('I should not start this. I\'m going to start this.', GH);
  setF('projector'); sfx('door');
}
EP_READY[6] = () => F('projector') ? null : 'The screen is dark. The film is in the projector booth. Somebody has to start it. Me. It has to be me.';
const MAGIC = { id: 'magic', who: 'MAGICIAN', name: 'THE MAGICIAN', title: 'ENCORE', person: 'magician', bpm: 112, rounds: 6, mode: 'fall', mirrorOnly: 0, track: 'dmagic', cheer: 'ENCORE ENCORE', hint: 'HE DANCES IT WITH YOU. STAY ON THE BEAT.', lead: 0 };
EP_BOSS[6] = async () => {
  music(null);
  // the film: a man at a table, a long time ago, in the four shades of the first cartridge
  const T = TONES.red.map(hex); let t = 0;
  const prev = scene;
  scene = { update() { t++; }, draw() {
    cls(T[3]); for (let i = 0; i < 80; i++) pset((i * 53 + t * 3) % W, (i * 29 + (t >> 1)) % H, T[2]);
    rectF(0, 150, W, 74, T[2]); rectF(70, 130, 180, 8, T[1]);
    const s = SG.people.magician.d[(t >> 4) & 1]; drawScaled(s, 130, 40, legacyPal(s.P, 'red'), 4);
    rectA(0, 0, W, 22, BLACK, .5); text('ROAD SHOW  (REEL 1)', 8, 7, T[0]);
    if (t % 90 < 4) rectA(0, 0, W, H, T[0], .25);
  } };
  post.fade = 0; sfx('static'); await wait(30);
  await say('Hello. Hello, wherever you are. Is this on? ...Good. Lin\'s holding the camera. Say hi, Lin.', 'MAGICIAN');
  await say('...She says hi. She\'s laughing. She laughs at the right part. She\'s the only one who ever has.', 'MAGICIAN');
  await say('Oh.', GH);
  await say('I do a few tricks. I play a little. And I found something in an old book. You draw it right and you walk through. Through anything. Through the whole world, Lin.', 'MAGICIAN');
  await say('I\'m going to be great. So great that when I come home there\'ll be a parade. And if I\'m ever late, I\'ll find you. Any room. Any place. I promise. I\'ll call you from the road.', 'MAGICIAN');
  await wait(60);
  await say('...', GH);
  await say('Hold on, I\'ll show you a thing. Pick a card. Any card.', 'MAGICIAN');
  sfx('power'); post.flash = 1; await wait(8); post.flash = 0;
  await say('THE MAN STEPS OUT OF THE SCREEN. HE IS IN COLOR. HE DOESN\'T SEEM TO HAVE NOTICED.');
  scene = prev;
  await say('Dance with me. We\'ll do it together. You don\'t have to be better. You just have to stay on the beat.', 'MAGICIAN');
  await danceFight(MAGIC, ['Again. It\'s not a test. I just want to see you finish one.', 'Stay on the beat. The beat isn\'t going anywhere. It waited for me. It can wait for you.', 'Again. I\'ve got all night. It\'s a drive-in.']);
  music('drive');
  await say('That\'s the trick. There isn\'t one. You keep the beat.', 'MAGICIAN');
  await say('I meant it, you know. About finding her. Anywhere.', 'MAGICIAN');
  await say('I know you did. And I did. Forty times. In forty places. I found every version of her except the one who was waiting at home.', GH);
  await say('Then why...', 'MAGICIAN');
  await wait(40);
  await say('...Because finding was never the hard part. The math does the finding. Staying isn\'t in the book.', GH);
  S.honesty++;
  await say('THE REEL RUNS OUT. THE SCREEN GOES WHITE. IT STAYS WHITE A WHILE.');
};
EP_OUTRO[6] = async () => {
  await wait(30); sfx('door');
  await say('A CAR PULLS INTO THE LOT. NOBODY SCARES ANYBODY. THE HEADLIGHTS TURN OFF ONE AT A TIME.');
  await say('You watched the whole thing.', LI);
  await say('You knew what was on it.', GH);
  await say('I was holding the camera. I put the reel in the booth. I thought you should see what I saw. What I waited for.', LI);
  await say('Lin...', GH);
  await say('Tomorrow is the finale. It\'s one song. Three minutes and forty seconds.', LI);
  await say('You\'re very good at exits. Be bad at one.', LI);
  await wait(60);
};
