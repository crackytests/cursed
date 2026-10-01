'use strict';
// ================= YOKO — chapters 4-6, the debate, the walk, the endings =================
function partyNow() { const p = [CA, JB, GS]; if (FL('kidJoined')) p.push(PKD); return p; }

// ================= CHAPTER 4: MANDOLIN =================
async function chapter4() {
  await chapterCard(4, 'MANDOLIN');
  await say('THE A.S.S. HAS BEEN ABOVE AND BELOW NEVADA. IT CAN DO A REALITY.');
  await say('Buckle up. There\'s no buckles. Hold something.', CA);
  await say('I\'m drawing the sigils on your dashboard. Don\'t touch them. Don\'t look at them too long. They look back.', GS);
  ADV.lead = JB; ADV.hint = 'SEE WHAT SHE BUILT. FIND THE WAY TO HER.';
  await goScene('plaza'); await advLoop();
}
SCN.plaza = { title: 'THE MANDOLIN REALITY', bg: SB.plaza, people: () => ['KARL', 'SPOOKEY GHOST', 'CEO LYNDA'],
  enter: async () => {
    await say('(THE MANDOLIN REALITY. EVERYONE HERE LEARNED TO PLAY THE MANDOLIN. IT EXPLAINS A LOT OF THINGS YOU REMEMBER WRONG.)');
    await say('I\'m home.', YO);
    await say('It\'s so... orange.', CA);
    await say('(EVERYONE HERE IS IN FULL COLOR.)');
  },
  look: () => ({ 'THE SIGNS': async () => { await say('"PRETEND & CO."  "PROP PILS."  "GARFEILD\'S DINER."'); await say('That\'s not how you spell it.', JB); await say('It is here.', YO); }, 'THE MUSICIANS': one(null, 'EVERYONE PLAYS. NOBODY IS BAD AT IT. IT\'S A LITTLE UNSETTLING.'), 'THE BANNER': one(null, '"THE EMPRESS HELPS."') }),
  talk: () => ({ KARL: async () => {
    if (!FL('karl')) { await say('Oh hey. You\'re... me? In four shades? Bro. Rough.', 'KARL'); await say('You\'re in COLOR.', CA); await say('Yeah, the Empress helped. I run a delivery co-op now. We deliver actual things. On time. Everybody gets paid.', 'KARL'); await say('Do you... do you know where your parents are?', CA); await say('Home. They came back. Took them a while.', 'KARL'); await wait(40); await say('...Mine didn\'t.', CA); await say('Not yet.', YO); setFL('karl'); }
    else await say('Want a delivery? First one\'s free. They\'re all free, actually. I keep forgetting that\'s weird.', 'KARL'); },
    'SPOOKEY GHOST': async () => {
    if (!FL('spookey')) { await say('I play for whoever walks by. Sometimes nobody. It\'s fine. It\'s actually fine.', 'SPOOKEY GHOST'); await say('How are you FINE? Nobody\'s WATCHING.', GS); await say('The Empress asked me what I actually wanted. It wasn\'t applause. Took me a while.', 'SPOOKEY GHOST'); await say('...What was it?', GS); await say('That\'s between me and her.', 'SPOOKEY GHOST'); setFL('spookey'); }
    else await say('♪~ nobody\'s listening, and that\'s okay ~♪', 'SPOOKEY GHOST'); },
    'CEO LYNDA': async () => { await say('We don\'t sell here. We share. The Empress helped us figure it out.', 'CEO LYNDA'); await say('Does she run everything?', YO); await say('She helps with everything. There\'s a difference.', 'CEO LYNDA'); await wait(30); await say('...I think there\'s a difference.', 'CEO LYNDA'); setFL('lynda'); } }),
  translate: () => ({ 'THE SONG': async () => { await say('A work song. Everyone knows it.', YO); await say('"She asked us what we wanted. Then she made sure we got it. Then she asked again."', YO); await say('She kept asking.', YO); setFL('song'); } }),
  think: async () => { await say(FL('karl') && FL('spookey') ? 'They\'re happy. They\'re who they could have been. She did that. I need to know what it cost. The gate.' : 'These are them. Not them. The ones who got help. I should talk to them.', YO); },
  move: () => Object.assign({ 'MY OLD APARTMENT': () => goScene('apartment') }, FL('karl') && FL('spookey') ? { 'THE GATE': () => goScene('testgate') } : {}) };
SCN.apartment = { title: 'MY OLD APARTMENT', bg: SB.apartment, people: () => [],
  enter: async () => { await say('(YOUR OLD APARTMENT. SOMEONE ELSE LIVES HERE NOW. THEY\'RE DOING VERY WELL.)'); },
  look: () => ({ 'THE PHOTO': one(null, 'A FRAME WITH A QUESTION MARK DRAWN IN IT. SOMEONE DIDN\'T KNOW WHAT TO PUT THERE.'), 'THE WINDOW': one(YO, 'I used to watch the square from here. I used to think I\'d help everyone down there someday.'), 'THE NOTE': async () => { await say('A NOTE, TAPED UNDER THE WINDOWSILL. IT\'S BEEN THERE A LONG TIME.'); setFL('note'); } }),
  translate: () => FL('note') ? { 'THE NOTE': async () => { await say('My handwriting. Japanese.', YO); await say('It says: "If you come back, you don\'t have to."', YO); ADV.mood = 1; await say('What does it mean?', CA); await say('It means I was right.', YO, { port: CAST.mood.YOKO.smile }); ADV.mood = 0; setFL('noteRead'); } } : {},
  think: async () => { await say('Somebody else\'s life, in my old room. She gave it to them. It fits them better than it fit me.', YO); },
  move: () => ({ 'THE PLAZA': () => goScene('plaza') }) };
SCN.testgate = { title: 'THE GATE', bg: SB.testgate, people: () => [],
  enter: async () => {
    await say('(A GATE OF RUNES. TWO GUARDS WITH MANDOLINS. BEYOND IT: THE WAY TO HER.)');
    await say('♪~ Halt, friend, halt, you\'re from the other place ~♪', 'MANDOLIN GUARD');
    await say('♪~ the one that cut her, we know your face ~♪', 'MANDOLIN GUARD');
    await say('That wasn\'t us.', CA);
    await say('It was our Face.', YO);
    await battle({ foes: ['guard', 'guard'], party: partyNow(), bg: 'testgate', music: 'battle2' });
    await say('(THE GATE OPENS. INSIDE: SOMETHING THAT ASKS QUESTIONS.)');
    await say('ANSWER.', 'THE TEST');
    await say('THE TEST ASKS RIDDLES, AND ONLY A RIGHT ANSWER HURTS IT. TRANSLATE IT TO HEAR THE RIDDLE, THEN SUGGEST THE RIGHT PERSON "ANSWER." ONE RIDDLE IS ABOUT SOMEONE WHO CAN\'T BE SUGGESTED TO.');
    await battle({ foes: ['test'], party: partyNow(), bg: 'testgate', music: 'boss', extraMoves: () => ['ANSWER'],
      onRound: async r => { const f = BT.foes[0]; if (f && f.intent && f.intent.k === 'riddle' && f.intent.r.a === 'YOKO') { BT.yokoRiddle = 1; } else BT.yokoRiddle = 0; } });
    await say('...YOU PASSED.', 'THE TEST');
    await say('(A VOICE, FROM EVERYWHERE. YOURS. NOT YOURS.)');
    await say('You passed. You always pass. That\'s why they kept you.', EY);
    await say('I\'m at the front. Come see what I\'m fighting. Then come see me.', EY);
    endChapter();
  },
  look: () => ({}), think: async () => {}, move: () => ({}) };

// ================= CHAPTER 5: WARWORLD =================
async function chapter5() {
  await chapterCard(5, 'WARWORLD');
  ADV.lead = JB; ADV.hint = 'THE FRONT.';
  await goScene('deck'); await advLoop();
}
SCN.deck = { title: 'THE WARWORLD', bg: SB.deck, people: () => FL('lindaJoined') ? [WY, LD] : [WY],
  enter: async () => {
    await say('(THE FRONT. A BALCONY OVER A SKY FULL OF SHIPS. LIGHTNING THE WRONG COLOR.)');
    await say('Assistant. The Empress said you would come.', WY);
    await say('She says a lot about me.', YO);
    await say('She is usually right.', WY);
    await say('The franchises are three sectors out. Companion products. Every reality they reach, they sell people a life so comfortable they stop living it.', WY);
    await say('They reach your mall next.', WY);
    await say('(A PINK SHUTTLE DOCKS. SOMEONE VERY ANGRY GETS OUT.)');
    await say('Those are FRANCHISES. I never authorized franchises. Somebody is using my face.', LD);
    await say('I know the feeling.', YO);
    await say('I\'m going to buy every one of them and shut them down. That\'s not charity. That\'s brand protection.', LD);
    await say('CEO LINDA JOINS. SHE WORKS WHEN SHE\'S PAID: SHE INVOICES BETWEEN JOBS. SUGGEST "BUY OUT" ON A FRANCHISE AND IT LEAVES THE FIGHT. HERS NOW.');
    setFL('lindaJoined'); ADV.hint = 'HOLD THE FRONT. THEN THE BRIDGE.';
    const p = [CA, JB, LD]; if (FL('kidJoined')) p.push(PKD); else p.push(GS);
    await battle({ foes: ['lindalite', 'lindamax', 'lindalite'], party: p, bg: 'deck', music: 'war' });
    await say('Three down. There are always more. That\'s what a franchise is.', LD);
  },
  look: () => ({ 'THE FLEET': one(null, 'HER SHIPS. HUNDREDS. EACH ONE HAS A LITTLE LAVENDER STRIPE.'), 'THE LIGHTNING': one(YO, 'It isn\'t weather. It\'s ships arriving.') }),
  talk: () => ({ 'WARWORLD YOKO': said('wyC', [[[WY, 'You wonder which of us I am.'], [YO, 'Yes.'], [WY, 'I am the one she sends where it\'s hard. She sends herself, a little. We don\'t argue about it. There\'s no time.']], [[WY, 'The bridge. The franchise that runs the others is there.']]]), 'CEO LINDA': one(LD, 'They copied my face, my voice, my business model, and not ONE of them pays royalties. I\'ve never been so insulted. I\'ve never been so flattered.') }),
  translate: () => ({ 'THE FRANCHISE BROADCAST': async () => { await say('It\'s their ad. It plays on every channel.', YO); await say('"You don\'t have to do anything. Just stay."', YO); await say('...That\'s what they told the kid.', CA); } }),
  think: async () => { await say('Linda sells things. These sell staying. The kid heard it first.', YO); },
  move: () => ({ 'THE BRIDGE': () => goScene('bridge') }) };
SCN.bridge = { title: 'THE BRIDGE', bg: SB.bridge, people: () => [WY],
  enter: async () => {
    await say('The franchise that runs the others is on the line.', WY);
    await say('EVERY LINDA IS ME. I AM EVERY LINDA.', 'LINDA PRIME');
    await say('You\'re a KNOCKOFF.', LD);
    const p = [CA, JB, LD]; p.push(FL('kidJoined') ? PKD : GS);
    await battle({ foes: ['prime', 'lindalite'], party: p, bg: 'bridge', music: 'boss' });
    await say('(THE FRANCHISE FRONT COLLAPSES. SOMEWHERE, A LOT OF PEOPLE SIT UP AND WONDER WHAT THEY WERE DOING.)');
    await say('You assist well.', WY);
    await say('I\'ve had practice.', YO);
    await say('She will see you now. She is in the next generation. The one Face built.', WY);
    await say('She asked me to tell you: bring the record.', WY);
    endChapter();
  },
  look: () => ({}), think: async () => {}, move: () => ({}) };

// ================= CHAPTER 6: THE EMPRESS =================
async function chapter6() {
  await chapterCard(6, 'THE EMPRESS');
  ADV.cur = 'throne'; scene = advScene; music('empress'); await fadeIn();
  await say('(THE NEXT GENERATION. THE MACHINE FACE BUILT. SHE SITS WHERE THE SOUL WAS SUPPOSED TO GO.)');
  await say('Hello, me.', EY);
  await say('I\'m not you.', YO);
  await say('No. You\'re the one who stayed.', EY);
  if (!kidAvailable()) await say('The boy is resting. I\'ll let him out when the system doesn\'t need him. Soon. I keep my promises. That\'s the first difference between me and him.', EY);
  await say('(BESIDE THE THRONE, A SMALL SCREEN. "NO SIGNAL." FACE\'S BACKUP.)');
  await say('Sit. We\'ll go over the record. I\'ve been paying attention. So have you. Let\'s see who paid more.', EY);
  const r = await debate();
  await walk(r);
}
SCN.throne = { title: 'THE NEXT GENERATION', bg: SB.throne, people: () => [EY], look: () => ({}), think: async () => {}, move: () => ({}) };

// ---------- the debate: the record, charge by charge ----------
async function debate() {
  const f = REC.face || {}, kid = f.kid || (REC.pk && REC.pk.kept && !REC.pk.letgo ? 'took' : REC.pk && REC.pk.letgo ? 'absent' : 'none');
  let cert = 100, cred = 100, key = null, truthy = 0;
  const party = [CA, JB, GS].concat(FL('kidJoined') ? [PKD] : []).concat(FL('lindaJoined') ? [LD] : []);
  const trustOf = k => (PARTY[k] || {}).trust || 50;
  const C = [];
  C.push({ q: 'He cut me in half. On air. For a laugh.', r: { CONCEDE: [-15, 10, [[YO, 'Yes. He did.'], [EY, 'You\'re not going to defend it.'], [YO, 'No.']]], CONTEXT: [5, -15, [[YO, 'It was a trick.'], [EY, 'It was a trick for him.']]], TRANSLATE: [-10, 5, [[YO, 'You\'re not asking me to defend him. You\'re asking whether I\'ll pretend.'], [EY, '...Yes. I am.']]] },
    w: { [GS]: [5, -10, [[GS, 'He only did it once.'], [EY, 'Once was the trick. Once was enough.']]] } });
  C.push({ q: 'He switched you off. He had one that fit better. Me.', r: { CONCEDE: [-5, 5, [[YO, 'Yes.']]], CONTEXT: [-5, 0, [[YO, 'He had a better-fitting part. That\'s how he thinks.'], [EY, 'That IS the problem.']]] },
    w: { [CA]: [-20, 10, [[CA, 'And I switched her back on. I\'m a guy with a switch. That\'s my whole thing now.'], [EY, '...Yes. You did.']]] } });
  if (kid === 'took') C.push({ q: 'He took everything a child could be, and made it a battery.', r: { CONCEDE: [-10, 10, [[YO, 'He did.']]], CONTEXT: [10, -20, [[YO, 'The system needed power.'], [EY, 'That\'s his sentence. Don\'t borrow it.']]] }, w: {} });
  else if (kid === 'freed') C.push({ q: 'He kept a child in a generator until the child asked nine hundred and twelve times.', r: { CONCEDE: [-10, 5, [[YO, 'He did. And then he let him go.']]] }, w: { [PKD]: [-25, 10, [[PKD, 'The new one let me go. He said "before I have a better idea." That\'s the most honest thing a grown-up ever said to me.'], [EY, '...It is, isn\'t it.']]] } });
  else C.push({ q: 'The child had to leave on his own. Nobody let him.', r: { CONCEDE: [-5, 5, [[YO, 'Nobody let him.']]] }, w: { [PKD]: [-15, 10, [[PKD, 'Nobody let me. I just went. You can do that. I didn\'t know you could do that.']]] } });
  const soul = { core: { q: 'He put me in his machine. He never asked.', r: { CONCEDE: [-10, 10, [[YO, 'He never asked.']]], CONTEXT: [-20, 10, [[YO, 'You let him. You\'d been in his system the whole time. You could have left.'], [EY, '...Yes. I wanted to see what he would do with it.']]] } },
    kid: { q: 'He chose the child. All of him.', r: { CONCEDE: [-10, 10, [[YO, 'He did.']]], CONTEXT: [5, -15, [[YO, 'It was already running on him.'], [EY, 'That isn\'t a reason. That\'s a habit.']]] } },
    viewers: { q: 'He spent what could happen, from people who never agreed.', r: { CONCEDE: [-10, 5, [[YO, 'He did.']]], TRANSLATE: [-15, 10, [[YO, 'I read the chat. It said "wait what." That isn\'t a yes.'], [EY, 'No. It isn\'t.']]] } },
    nothing: { q: 'He left. He let it end, and left the system with nobody.', r: { CONCEDE: [0, 0, [[YO, 'He did.']]], CONTEXT: [-30, 10, [[YO, 'He asked what it would cost. For the first time. You heard it.'], [EY, '...I heard it.']]] } },
    dyslexio: { q: 'He tried to be every arrangement at once.', r: { SILENCE: [-10, 5, [[YO, '...'], [EY, 'Fair.']]] } },
    none: { q: 'He hasn\'t done it yet. But he will.', r: { CONTEXT: [-15, 10, [[YO, 'Then it hasn\'t happened. You can\'t judge what hasn\'t happened.'], [EY, 'I judge what will. That\'s what paying attention is for.']]] } } }[f.cleared ? f.ending : 'none'];
  C.push(Object.assign({ w: {} }, soul));
  const hp = YREC.helped || 0; // the requests: small things, on the way here
  C.push({ q: hp ? 'You helped ' + hp + ' of them on the way here. A ride. A drink. A cup of coffee. Small things.' : 'You walked past all of them. Nobody asked you for anything. You noticed that, didn\'t you.',
    r: hp >= 6 ? { CONTEXT: [-15, 15, [[YO, 'Small things are the job. Big things are made of them.'], [EY, '...I started with small things.']]], CONCEDE: [-10, 10, [[YO, 'Yes. They asked.'], [EY, 'And you answered. Every time. I remember doing that.']]] }
      : hp >= 1 ? { CONCEDE: [-5, 5, [[YO, 'Some of them.']]], CONTEXT: [0, 5, [[YO, 'I helped the ones in front of me.'], [EY, 'That\'s how it starts.']]] }
      : { CONCEDE: [5, -10, [[YO, 'I was busy.'], [EY, 'You were. That\'s what I said about the first world.']]] }, w: {} });
  const n = YREC.overrule;
  C.push({ q: 'And you. You overruled your friends ' + n + ' time' + (n === 1 ? '' : 's') + ' on the way here.', r: n <= 3 ? { CONTEXT: [-15, 10, [[YO, 'Only when I had to.'], [EY, 'I say that too.']]], CONCEDE: [-5, 5, [[YO, 'Yes.']]] } : { CONCEDE: [5, 5, [[YO, 'Yes.'], [EY, 'You agree with me more than you think.']]], CONTEXT: [10, -15, [[YO, 'Only when I had to.'], [EY, 'Every time? Really?']]] },
    w: Object.fromEntries(party.filter(k => trustOf(k) >= 60).map(k => [k, [-10, 5, [[k, 'She helped me more than she bossed me. By a lot. I counted. I didn\'t count. It felt like a lot.']]]])) });
  const recLines = recordLines();
  C.push({ q: 'And the one holding the controller. ' + recLines.join(' '), r: { SILENCE: [-10, 10, [[YO, '...'], [EY, 'You\'re right. That one isn\'t yours to answer.']]] }, w: {}, player: 1 });
  // the question
  const R = ['CONCEDE', 'CONTEXT', 'CALL A WITNESS', 'TRANSLATE', 'SILENCE'];
  for (const ch of C) {
    DBG.debate = ch; DBG.mode = 'debate';
    await say(ch.q, EY, { keep: 1 });
    const c = await choose(R); DLG = null; DBG.mode = null;
    let res = ch.r[R[c]];
    if (R[c] === 'CALL A WITNESS') {
      const i = await choose(party, { cancel: 1 });
      const who = i < 0 ? null : party[i];
      if (who && trustOf(who) < 30) { await say(pick(['I\'m not saying anything for you. You overruled me.', 'Nah. You tell her. You tell everybody what to do anyway.']), who); res = [5, -5, []]; }
      else res = (who && ch.w[who]) || [5, -10, [[who || YO, who ? '...I don\'t know anything about that.' : '...'], [EY, 'A witness who doesn\'t know anything. You were never this careless.']]];
    }
    if (!res) res = [5, -10, [[EY, pick(['That isn\'t an answer to what I said.', 'You\'re better than that. I would know.', 'No.'])]]];
    for (const [w, s] of res[2]) await say(s, w);
    cert = clamp(cert + res[0], 0, 100); cred = clamp(cred + res[1], 0, 100);
    if (res[0] < 0) truthy++;
    BANNER = { s: 'HER CERTAINTY ' + cert + '%   YOUR CREDIBILITY ' + cred + '%', t: 120 };
  }
  DBG.debate = null;
  const r5 = f.cleared ? (f.restores || 0) : '?', i5 = f.cleared ? (f.integrity || 100) : '?';
  await say('Last question. The only one that matters.', EY);
  await say('He was restored ' + r5 + ' times. He is ' + i5 + '% of himself. How many second chances are enough?', EY, { keep: 1 });
  DBG.mode = 'question';
  const q = await choose(['ONE MORE', 'NONE', 'IT ISN\'T MY DECISION', 'IT ISN\'T YOURS EITHER']); DLG = null; DBG.mode = null;
  if (q === 0) { key = 'forgive'; await say('One more.', YO); await say('You always say one more.', EY); }
  if (q === 1) { key = 'ruthless'; await say('None.', YO); await say('...I didn\'t expect you to say it first.', EY, { port: CAST.mood['EVIL YOKO'].cold }); }
  if (q === 2) { key = 'third'; await say('It isn\'t my decision.', YO); await say('Then whose is it?', EY); await say('His. And everyone he\'d use to make it. We ask them.', YO); }
  if (q === 3) { key = 'third'; await say('It isn\'t yours either.', YO); await say('I have root.', EY); await say('You have access. That\'s not the same thing.', YO); await say('...He used to say that.', EY); }
  const agree = cert <= 30 && cred >= 60;
  if (agree) { await say('Then we agree on something. We disagree on the rest. That\'s more than I had with him.', EY); }
  else if (cert <= 60) await say('You made some of it hard to argue with. Not enough of it.', EY);
  else await say('I\'m still certain. I\'m usually certain. It\'s the thing people like least about me.', EY);
  await say('Go on, then. The controls are over there. I\'ll give you the input. See what you do with it.', EY);
  DBG.debateResult = { cert, cred, key };
  return { cert, cred, key, agree, trueOK: agree && key === 'third' && YREC.overrule <= 5 && f.cleared };
}
function recordLines() {
  const L = [], R = REC;
  if (R.pk) { if (R.pk.kept) L.push('You put the boy back in the generator.'); if (R.pk.letgo) L.push('You let him go home.'); if (R.pk.dog) L.push('You remembered the dog.'); }
  if (R.carl && R.carl.endings) L.push('You got Carl through his whole cartridge.');
  if (R.ghost && R.ghost.endings) L.push('You watched Ghost\'s show to the end.');
  if (R.tp && R.tp.vault) L.push('You opened TP\'s vault.');
  if (R.tp && R.tp.msgs && R.tp.msgs.length) L.push('You told the people at home: "' + R.tp.msgs[R.tp.msgs.length - 1].toUpperCase().slice(0, 40) + '."');
  if (R.face && R.face.spent) L.push('Face spent your could. You watched.');
  if (!L.length) L.push('You haven\'t done anything yet. That\'s the most interesting record of all.');
  return L.slice(0, 4);
}

// ---------- the walk: the first time you control anyone directly ----------
async function walk(D) {
  const consoles = [{ x: 60, k: 'restore', label: 'RESTORE FACE', sub: 'REPAIR ACCESS ONLY' }, { x: 260, k: 'empire', label: 'KEEP THE EMPIRE', sub: 'SHE RUNS IT' }, { x: 160, k: 'open', label: 'OPEN THE GENERATOR', sub: 'LET IT END' }];
  if (D.trueOK) consoles.push({ x: 160, y: 118, k: 'true', label: 'ASK THEM', sub: 'NOBODY RUNS IT' });
  const Y = { x: 34, y: 196, d: 'u', f: 0 };
  let t = 0, near = null, chosen = null;
  music('walk');
  scene = { update() {
    t++; if (DLG || MENUS.length || CARD) return;
    let dx = (held.right ? 1 : 0) - (held.left ? 1 : 0), dy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
    if (dx) { Y.d = dx > 0 ? 'r' : 'l'; dy = 0; } else if (dy) Y.d = dy > 0 ? 'd' : 'u';
    Y.x = clamp(Y.x + dx * 1.2, 16, 304); Y.y = clamp(Y.y + dy * 1.2, 70, 204); if (dx || dy) { Y.f += .12; if ((t & 15) === 0) sfx('step'); }
    near = null; for (const c of consoles) { const cy = c.y || 40; if (Math.abs(Y.x - c.x) < 20 && Math.abs(Y.y - (cy + 48)) < 14) near = c; }
    if (near && pressed.a) { chosen = near; }
    DBG.walk = { x: Y.x, y: Y.y, near: near && near.k, consoles };
  }, draw() {
    skyD(0, H, '#000012', '#12246d');
    for (let x = 0; x < W; x += 20) lineF(x, 60, x + (x - 160) * .5, H, hex('#12245a')); for (let y = 60; y < H; y += 16) rectF(0, y, W, 1, hex('#12245a'));
    for (const c of consoles) { const cy = c.y || 40; rectF(c.x - 18, cy, 36, 30, hex('#24246d')); frameRect(c.x - 18, cy, 36, 30, near === c ? UI.name : hex('#92ffff')); rectF(c.x - 14, cy + 4, 28, 12, (t >> 4) & 1 ? hex('#2449b6') : hex('#244a6d')); wrapT(c.label, 10).forEach((l, i) => text(l, c.x - l.length * 3, cy + 33 + i * 9, near === c ? UI.name : WHITE, BLACK)); }
    const ep = PORT[EY]; draw(ep.s, 262, 150, ep.P); frameRect(261, 149, 50, 50, hex('#92ffff'));
    const fs = YS.walk[Y.d][(Y.f | 0) & 1]; draw(fs, Y.x - 8, Y.y - 26, YP.walk);
    if (t < 240) { rectA(0, 0, W, 14, BLACK, .6); ctext('INPUT ASSIGNED: YOU', 3, (t >> 3) & 1 ? UI.name : WHITE); }
    if (near) { rectA(40, 208, 240, 14, BLACK, .7); ctext('A: ' + near.label + ' (' + near.sub + ')', 211, UI.name); }
  } };
  await fadeIn();
  await say('(FOR THE FIRST TIME, YOU\'RE NOT SUGGESTING. ARROWS MOVE HER. A CHOOSES.)');
  DBG.mode = 'walk';
  for (;;) {
    while (!chosen) await nextFrame();
    DBG.mode = null;
    const c = await ask(chosen.label + '?', YO, ['YES', 'NOT YET']);
    if (c === 0) break;
    chosen = null; DBG.mode = 'walk';
  }
  return ending(chosen.k);
}
