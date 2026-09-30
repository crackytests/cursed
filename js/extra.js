'use strict';
// ================= CONTENT: tapes, status, chapters, arcade, diner, side quests =================
ITEMS.PRETZEL = 'PRETZEL. Free if you never leave. Restores COMPOSURE in arguments. (Use from ITEM during an argument.)';
ITEMS['A FACE'] = 'A FACE. Not yours. Probably not yours. It\'s warm.';
ITEMS.BLANKET += ' (In an argument: fully restores COMPOSURE once.)';
ITEMS.BLACKJACK += ' (In an argument: a heavy hit, once.)';

// ---------- TAPES (8 collectibles) ----------
const A_ = 'ATTENDANT';
const TAPES = [
  ['PARKING', [['217. 218. 219. Who parked in 219?', A_], ['There\'s a little green guy asleep in it. He talks in his sleep.', A_], ['Same word, over and over. It\'s not English. It\'s not anything.', A_]]],
  ['TRAINING', [['PROP PILLS DRIVER TRAINING, PART 4.', 'DISPATCH'], ['PROP PILLS ARE ONLY PRETEND. IF A CUSTOMER REPORTS EFFECTS, REMIND THEM: IT IS PRETEND.', 'DISPATCH'], ['IF A CUSTOMER REPORTS THEY CAN SEE THE DRIVER, REMIND THEM: HE IS PRETEND TOO.', 'DISPATCH']]],
  ['LOST+FOUND', [['Lost and found inventory. Fourteen umbrellas. One face.', 'CLERK'], ['Two... of something. Tall. Unclaimed.', 'CLERK'], ['They\'ve been waiting at the counter since 1998. They keep asking if anyone small has come by.', 'CLERK']]],
  ['HIGH SCORE', [['CONGRATULATIONS. YOUR NAME HAS BEEN ADDED TO THE BOARD.', 'SCANNER'], ['C. R. L.', 'SCANNER'], ['CORRECTION: NAME UNKNOWN. CORRECTION: NAME WITHHELD. CORRECTION: HE KNOWS.', 'SCANNER']]],
  ['EMPORIUM', [['Security log. Tuesday. Little guy throws the big one at a Linda.', 'CLERK'], ['Thursday. Little guy throws the big one at a Linda.', 'CLERK'], ['There\'s only ONE big one. We keep replacing it. Where do they keep COMING from.', 'CLERK']]],
  ['HOUR 8', [['Hour eight. Nothing has happened. Nothing is ever going to happen.', C], ['I\'ve been talking to you guys the whole time. You\'re the only thing out here. You and the bug.', C], ['I think I\'m becoming somebody. Is that weird? Don\'t answer. ...Okay answer.', C]]],
  ['GARF', [['He came in, smoked next to me, got rowdy, threw a bong at a Linda.', 'JB GARFIELD'], ['Acted SURPRISED when they threw him out. Every time.', 'JB GARFIELD'], ['...I\'d do it again. Don\'t tell him I said that. He\'ll get weird about it.', 'JB GARFIELD']]],
  ['CELL 00', [['(A small voice. Very close to the microphone.)'], ['Two tall ones came to the glass today. They said a word.', 'VOICE'], ['I\'m going to remember it. I\'m going to remember it forever. It was', 'VOICE'], ['(The tape ends.)']]],
];
const tapes = () => F('tapes') || [];
const hasTape = i => tapes().includes(i);
async function giveTape(i) {
  if (hasTape(i)) return;
  setF('tapes', tapes().concat(i)); sfx('get'); await wait(10);
  await say('CARL FOUND TAPE ' + (i + 1) + ': "' + TAPES[i][0] + '"! (' + tapes().length + '/8)');
  if (tapes().length === 1) await say('Tapes can be played from the START menu.');
  if (tapes().length === 8) { await wait(20); sfx('static'); await say('...All of them. Chat, that\'s all of them. Something\'s different. I can feel it in my... everything.', C); }
}
async function playTape(i) {
  sfx('static'); await wait(30);
  await say('TAPE ' + (i + 1) + ': ' + TAPES[i][0]);
  for (const [l, who] of TAPES[i][1]) await say(l, who);
  sfx('static');
}
async function tapeMenu() {
  if (!tapes().length) return say('No tapes. There\'s a tape deck in my pocket. Don\'t ask why. It came with the pocket.', C);
  const list = tapes().slice().sort((a, b) => a - b);
  const i = await choose(list.map(n => (n + 1) + ' ' + TAPES[n][0]), { x: 8, y: 4, cancel: 1 });
  if (i >= 0) await playTape(list[i]);
}

// ---------- STATUS / GOALS ----------
const GOALS = {
  start: 'Grab the parcel from the console. Leave through the hatch.', door: 'Deliver the parcel to the Mall of the Future.',
  rear: 'Deliveries are at the rear. Head east from the lot.', scan: 'Get past the scanner at the loading dock.',
  suite: 'Find Suite 00 somewhere in the mall.', loop: 'The down escalator loops forever. What did the rope say?',
  pill: 'Talk to Linda in Suite 00.', desert: 'Find the way below Nevada. Smoke shows things the sun doesn\'t.',
  lab: 'Sneak through the facility. Check the rooms. Something in your old cell.', lab2: 'Take the elevator at the bottom of the facility.',
  box: 'Free Spooky Ghost. Then deal with Linda.', home: 'Go home. The ship is in the lot.',
};
async function statusScreen() {
  const prev = scene, t = Math.floor(S.time / 60);
  const goal = wrap(GOALS[F('obj')] || '???', 24);
  const wins = Object.keys(S.flags).filter(k => k.startsWith('won_')).length;
  scene = { draw() {
    cls(0); box(0, 0, W, H);
    text('CARL', 8, 7); text('(NOT HIS NAME)', 38, 7, 2);
    text('LV ' + lvl(), 8, 20); text('COMPOSURE ' + maxC(), 50, 20);
    text('TAPES ' + tapes().length + '/8', 8, 31); text('PRETZELS ' + pretzels(), 86, 31);
    text('ARGUMENTS WON ' + wins, 8, 42);
    text('TIME ' + Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'), 8, 53);
    text('SPECIES  HUMAN(?)', 8, 64, 2);
    rect(6, 76, W - 12, 1, 2); text('GOAL', 8, 81);
    goal.forEach((l, i) => text(l, 8, 92 + i * 10));
  } };
  sfx('tick'); await waitBtn(); sfx('tick');
  scene = prev;
}
async function chapter(n, title) {
  const m = curName, f = fx.fade; music(null); fx.fade = 0;
  await showCard([n ? 'CHAPTER ' + n : 'EPILOGUE', '', title], 150);
  fx.fade = f; music(m);
}

// ---------- ARCADE ----------
MAPS.arcade = {
  title: 'FUTURE ARCADE', music: 'arcade',
  rows: ['IIIIIIII', 'IaaIaaaI', 'I......I', 'I......I', 'I......I', 'III..III'],
  ents: () => [{ id: 'kid', x: 5, y: 3, spr: 'shopperEyes', pmap: [0, 1, 1, 3], talk: async () => {
    if ((F('pillBest') || 0) >= 25) { await say('You beat it. You beat the score. Nobody beats the score.', 'KID'); return say('I\'m good at catching pills. It\'s a job skill.', C); }
    await say(nth('kid', ['High score\'s 25. Nobody\'s beat it since the mall opened. I\'ve been standing here since the mall opened.', 'Still here.', 'The pills get faster. The dark ones are real. Don\'t catch the real ones.']), 'KID');
    if (F('kid') === 1) { await say('Don\'t you have parents?', C); await say('Do you?', 'KID'); await say('...Okay. That was mean. That was a mean thing to say to me.', C); }
  } }],
  signs: {
    '1,1': async () => { await say('ALIEN INVADERS. OUT OF ORDER. THE ALIENS WON.'); await say('Good for them. I mean— bad. Bad for humans. Which I am. Boo, aliens.', C); },
    '2,1': async () => { sfx('static'); await say('The screen shows the parking lot. Live. There\'s a ship. There\'s someone standing next to the ship.'); await say('That\'s MY ship. Who is that? Who is that?! I\'m in HERE!', C); },
    '4,1': async () => { await say('DESERT BUS ARCADE. It\'s been running since 1998. Nobody is playing it. The odometer says 99,999 MI.'); await say('Somebody\'s playing it. Nobody plays it for 99,999 miles by accident.', C); },
    '5,1': async () => {
      await say('PILL CATCH \'98. FREE PLAY. (EVERYTHING IS FREE IF YOU NEVER LEAVE.)');
      if (await ask('Play?', null, ['PLAY', 'NO']) !== 0) return;
      const s = await pillCatch();
      if (s >= 25) { await say('I did it. Chat, I did it. Clip it. CLIP IT.', C); await giveTape(3); }
      else await say(pick(['The dark ones look exactly like the light ones when they\'re moving!', 'Rigged. It\'s rigged. It\'s a pill game in a mall owned by a pill company.', 'One more. One more. Okay not one more. One more.']), C);
    },
    '6,1': async () => { await say('HIGH SCORES. 1. CRL 25. 2. CRL 24. 3. CRL 23. 4. CRL 22. 5. CRL 21.'); await say('C-R-L. That\'s not— who did that. I\'ve never been in here. Have I been in here?', C); },
  },
  exits: { down: () => warp('mall', 13, 2, 'down') },
};

// ---------- GARF'S DINER ----------
MAPS.diner = {
  title: 'GARF\'S', music: 'diner',
  legend: { J: 'jukebox', B: 'barc', X: 'mirror', P: 'phone', s: 'stool' },
  rows: ['IIIIIIIIII', 'IJBBBBXBPI', 'I.ssss.s.I', 'I........I', 'I.t..t..tI', 'I........I', 'IIII..IIII'],
  ents: () => [
    { id: 'garf', x: 3, y: 3, spr: 'garf', talk: garfTalk },
    { id: 'wait', x: 6, y: 4, spr: 'clerk', pmap: [0, 0, 1, 3], talk: async () => {
      await say(pick(['Coffee\'s free. Pretzels are free. Mall sends \'em. Nobody knows why.', 'You\'re that fella from the lot. Garf talks about you. A LOT.', 'We\'re open twenty-four hours. Since 1998. Same as the mall. Same as everything.']), 'WAITRESS');
      if (pretzels() < 3) { addPretzel(); sfx('get'); await say('CARL GOT A PRETZEL! (x' + pretzels() + ')'); }
    } },
  ],
  signs: {
    '1,1': async () => {
      const i = await ask('JUKEBOX. PICK A SONG.', null, ['TITLE THEME', 'LOT', 'MALL', 'ARGUMENT', '???']);
      mus.det = 0; mus.wob = 0; mus.rate = 1;
      if (i === 4) { mus.det = -300; mus.wob = 200; mus.rate = .7; music('title'); await say('That\'s not a song. That\'s a song being sad.', C); return; }
      music(['title', 'lot', 'mall', 'battle'][i]);
    },
    '6,1': async () => {
      if (!F('mirror')) { setF('mirror'); await say('Carl looks in the mirror behind the counter. The reflection is facing away.'); return say('Nope. Nope. Not today. Not in a diner.', C); }
      await say('The reflection is facing him now. It\'s smiling.'); await say('I\'m not smiling. Why is it smiling. Chat. Am I smiling?', C);
    },
    '8,1': async () => {
      sfx('ring'); await wait(30);
      const n = F('phone') || 0; setF('phone', n + 1);
      if (n === 0) { await say('Hello? Is this Carl?', 'VOICE'); await say('...Yeah?', C); await say('Sorry. Wrong Carl.', 'VOICE'); return say('There\'s another one? There\'s ANOTHER Carl?', C); }
      if (n === 1) { await say('PROP PILLS DISPATCH. YOUR DELIVERY IS LATE.', 'DISPATCH'); return say('I delivered it! I delivered it to myself! That counts!', C); }
      if (n === 2) { await say('It\'s you. It\'s your own voice. You\'re saying "hello?" Just "hello?" Over and over.'); return say('...I\'m hanging up. I\'m hanging up on me.', C); }
      await say('The line is open. Somebody is breathing. It\'s ' + clock() + ' on their end too.');
    },
  },
  exits: { down: async () => { mus.det = 0; mus.wob = 0; mus.rate = 1; await warp('desert', 25, 5, 'down'); } },
  enter: async () => { if (!F('dinerIn')) { setF('dinerIn'); await say('A diner. In the middle of nowhere. With the lights on. That\'s how horror movies start. Or breakfast.', C); } },
};
async function garfTalk() {
  const G = 'JB GARFIELD';
  if (!F('garf1')) {
    setF('garf1');
    await say('CARL. Carl\'s here. Everybody lock up the glassware.', G);
    await say('Garf! Garf. Hi. What are you doing in the middle of the desert?', C);
    await say('I could ask you the same thing. Last time you came in here you smoked next to me, got rowdy, threw a bong at a Linda...', G);
    await say('...and then acted SURPRISED when they threw you out.', G);
    await say('That\'s— okay, that\'s one way to tell it.', C);
    await say('What\'s the other way?', G);
    await say('...Slower.', C);
  }
  if (F('won_garf')) return say(pick(['You find Spooky yet? He owes me twenty bucks.', 'You\'re a fiasco, Carl. A good one. The best one.', 'Below Nevada? Buddy, EVERYTHING is below Nevada. Nevada\'s on top.']), G);
  if (await ask('Argue about who threw the bong?', null, ['ARGUE', 'LET IT GO']) !== 0) return say('Letting it go. Look at me let it go. I\'m so grown.', C);
  if (await argue(FOES.garf)) await giveTape(6);
  else await say('Ha! Sit down, Carl. Have a pretzel. Try again when you remember it right.', G);
}

// ---------- MALL: pretzels, lost & found, the face, photo booth, arcade door ----------
MAPS.mall.rows[1] = 'IOQQOIEIbobIOoEOIv^I';
const mallInit0 = MAPS.mall.init;
MAPS.mall.init = () => { mallInit0(); setTile(1, 6, 'photob'); };
const mallEnts0 = MAPS.mall.ents;
MAPS.mall.ents = () => mallEnts0().concat([
  { id: 'pretz', x: 1, y: 3, spr: 'attendant', pmap: [0, 0, 2, 3], talk: async () => {
    await say(pick(['PRETZELS. FREE IF YOU NEVER LEAVE.', 'PRETZEL? PRETZEL. THEY\'RE WARM. THEY\'VE BEEN WARM SINCE 1998.', 'TAKE ONE. TAKE ONE FOR THE ROAD. THERE IS NO ROAD.']), 'PRETZEL GUY');
    if (pretzels() >= 3) return say('I have three. Three is enough pretzels. I say that. Nobody else says that.', C);
    addPretzel(); sfx('get'); await say('CARL GOT A PRETZEL! (x' + pretzels() + ')');
    if (!F('pretzTut')) { setF('pretzTut'); await say('PRETZELS restore COMPOSURE during arguments. Hold up to 3.'); }
  } },
  { id: 'lnf', x: 18, y: 6, spr: 'attendant', pmap: [0, 1, 1, 3], talk: lostFound },
  { id: 'faceless', x: 5, y: 6, spr: F('faceDone') ? 'shopperEyes' : 'shopper', talk: facelessTalk },
  { id: 'cop', x: 18, y: 2, spr: 'cop', if: () => F('rope') && !F('won_cop'), talk: copFight },
]);
MAPS.mall.steps['13,1'] = () => warp('arcade', 3, 4, 'up');
MAPS.mall.signs['12,1'] = () => say('FUTURE ARCADE. >');
MAPS.mall.signs['1,6'] = photoBooth;
async function lostFound() {
  const L = 'LOST+FOUND';
  if (F('faceQ') && !has('A FACE') && !F('faceDone')) {
    await say('Lost and found. We have: fourteen umbrellas. One face. Two... of something.', L);
    await say('Two of what?', C); await say('Unclaimed.', L);
    await say('That\'s not what I asked. ...Can I have the face? It\'s not for me. I have a face. It\'s for a guy.', C);
    return get('A FACE');
  }
  await say(pick(['Lost and found. You lose it, we find it. You find it, we lose it.', 'Nobody comes back for anything here. You\'d be the first.', 'We have two of something tall back here. Unclaimed. Since 1998. You small, by any chance?']), L);
}
async function facelessTalk(e) {
  if (F('faceDone')) return say(pick(['IT FITS. IT FITS SO WELL.', 'I CAN SEE YOU NOW. YOU\'RE SHORTER THAN I THOUGHT.']), '???');
  if (has('A FACE')) {
    lose('A FACE'); await say('Here. I found your face. It was at lost and found. Where faces go.', C);
    sfx('glitch'); e.spr = 'shopperEyes'; setF('faceDone'); await wait(30);
    await say('THANK YOU. IT FITS.', '???');
    await say('IT USED TO BE YOURS.', '???', { slow: 1 });
    await say('It— what? No. I have my face. Look. Face. Right here. Chat, I have a face, right?', C);
    return giveTape(2);
  }
  setF('faceQ');
  await say('HAVE YOU SEEN MY FACE? I HAD IT WHEN I CAME IN. MAYBE LOST AND FOUND. BY THE ESCALATORS.', '???');
  await say('You want ME to go get your face? ...Fine. I\'m a delivery guy. I\'ll deliver it. To your face. Where your face goes.', C);
}
async function photoBooth() {
  await say('PHOTO BOOTH. 4 POSES. FREE.');
  if (await ask('Take photos?', null, ['SMILE', 'NO']) !== 0) return;
  const n = (F('photo') || 0) + 1; setF('photo', n);
  for (let i = 0; i < 4; i++) { sfx('tick'); fx.fade = -3; await wait(4); fx.fade = 0; await wait(26); }
  const prev = scene;
  scene = { draw() {
    prev.draw(); rect(52, 2, 56, 140, 3); rect(54, 4, 52, 136, 0);
    for (let i = 0; i < 4; i++) {
      const y = 7 + i * 33; rect(58, y, 44, 31, 1);
      if (i >= 4 - Math.min(n, 3)) bigblit(SPR.shadowEyes, 70 + (i === 3 ? 0 : 10), y - 1, 1);
      bigblit(SPR.carl.down[0], 64, y - 1, 2);
    }
  } };
  await waitBtn();
  scene = prev;
  await say(n === 1 ? 'Who\'s that. Who\'s THAT. There was nobody behind me. Chat, there was nobody behind me.' : 'It\'s closer. In every one it\'s closer. I\'m not doing that again. ...I did it again.', C);
}
async function copFight() {
  if (await argue(FOES.cop)) { await say('The mall cop wanders off toward the pretzels.'); return; }
  await say('Back behind the rope, sir. BEHIND the rope. I\'ll be right here. I\'m always right here.', 'MALL COP');
}
JUNK.push('the cart wants to go home', 'theres an arcade in the mall', 'garf has a diner out in the desert??', 'pretzels heal you in arguments btw',
  'photo booth is cursed dont', 'argue with EVERYONE', 'tapes are collectibles i think', 'check under stuff');

// ---------- LOT: the cart corral, space 219 ----------
const lotInit0 = MAPS.lot.init;
MAPS.lot.init = () => { lotInit0(); setTile(1, 7, 'corral'); };
const lotEnts1 = MAPS.lot.ents;
MAPS.lot.ents = () => lotEnts1().map(e => e.id !== 'cart' ? e : Object.assign(e, F('cartDone') ? { x: 1, y: 7, px: 16, py: 112, update: null } : {}, { talk: cartTalk }))
  .concat([{ id: 't219', x: 19, y: 13, spr: 'tape', haze: 1, solid: false, floor: 1, if: () => !hasTape(0), talk: async () => {
    await say('Space 219. It\'s only there when things are wavy. There\'s a tape on the ground.', C); await giveTape(0);
  } }]);
MAPS.lot.signs['1,7'] = () => say('CART CORRAL. PLEASE RETURN CARTS. A sticker: "THEY ALWAYS COME BACK."');
async function cartTalk(e) {
  if (F('cartDone')) return say('It\'s home. It\'s in the corral. Stay. STAY.', C);
  await say(nth('cart', ['It\'s a shopping cart.', 'I parked over there. It was over there. Why is it always near me.', 'Stop following me. ...I\'m talking to a cart. Chat, don\'t clip that.', 'It has a wobbly wheel. I have a wobbly wheel too. Emotionally.', 'Cart.']), C);
  if (await ask('Push it?', null, ['PUSH', 'LEAVE IT']) !== 0) return;
  const [dx, dy] = DIRS[P.dir], nx = e.x + dx, ny = e.y + dy;
  if (blocked(nx, ny, e)) { sfx('bump'); return say('It won\'t go. It likes it here. Near me.', C); }
  e.x = nx; e.y = ny; e.mv = 1; e.speed = 2; sfx('step');
  while (e.mv) await nextFrame();
  if (e.x === 1 && e.y === 7) {
    setF('cartDone'); e.update = null; sfx('ok');
    await say('The cart rolls into the corral. It seems... relieved.');
    await say('There\'s something in the child seat. A tape. Was this whole thing about a tape? Cart, was this about a tape?', C);
    await giveTape(1);
  } else if (!F('cartHint')) { setF('cartHint'); await say('Maybe I should put it back. In the corral. On the left. Where carts go. I\'m a good citizen. Normal human citizen.', C); }
}

// ---------- DESERT: the diner, hitchhiker argument ----------
for (const [y, s] of [[2, '22322'], [3, '22222'], [4, '22o22']]) MAPS.desert.rows[y] = MAPS.desert.rows[y].slice(0, 23) + s;
MAPS.desert.steps = { '25,4': () => warp('diner', 4, 5, 'up') };

// ---------- FACILITY: under the bed ----------
MAPS.lab.signs['1,10'] = async () => {
  await say('The bed. It\'s small. It was always small. I was always small.', C);
  if (hasTape(7)) return;
  await say('Under the mattress: a tape. Somebody hid it. Somebody small.'); await giveTape(7);
};

// ---------- SECRET (all 8 tapes) ----------
async function secretScene() {
  let t = 0;
  music('end'); mus.rate = .7;
  scene = { draw() {
    t++; cls(0);
    for (let i = 0; i < 80; i++) px(hash(i, 8) * W, 70 + hash(i, 9) * 74, 1);
    rect(0, 68, W, 1, 2);
    const k = Math.min(1, t / 400);
    blit(SPR.shadow, 60, 34); blit(SPR.shadow, 84, 36);
    blit(SPR.carlback, 72, 110 - k * 30);
  } };
  fx.fade = 3; await fadeIn(10);
  await wait(420);
  await say('...Hey.', C, { slow: 1 });
  await wait(60);
  await say('...[[[[[.', 'VOICE', { slow: 1 });
  await wait(90);
  await fadeOut(12); mus.rate = 1; music(null);
  scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['TO BE CONTINUED?'], 200);
}

// ================= START =================
boot();
