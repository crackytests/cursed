'use strict';
// ================= CARL 3: ACT I side scenes. one optional story per ACT I stop =================
// Box Canyon: the census lady. The Starlite: Mitch and the machine. Big Leon's: the trucker chapel.
// Optional, off the main path, small payoffs. The objective marker never points here.
const CL = 'THE CENSUS LADY', MI = 'MITCH', BU = 'PREACHER BUD';
regBust(CL, genBust({ skin: '#e8c8a8', hair: '#49361f', hairStyle: 'big', top: '#496d92', glasses: 1 }), '#49dbff');
regBust(MI, genBust({ skin: '#dbb692', hair: '#6d6d24', top: '#92b66d', collar: '#e8e8e8' }), '#b6ff49');
regBust(BU, genBust({ skin: '#db9249', hair: '#e8e8e8', top: '#49403a', collar: '#ffffff' }), '#ffdb6d');
Object.assign(VOICE, { 'THE CENSUS LADY': [680, 40], MITCH: [420, 70], 'PREACHER BUD': [260, 30] });
Object.assign(PEOPLE, { mitch: { top: '#92b66d', bottom: '#49403a', hair: '#6d6d24', hairStyle: 'big' }, bud: { top: '#49403a', bottom: '#49403a', hair: '#e8e8e8', collar: '#ffffff' } });
for (const k of ['mitch', 'bud']) MODELS_P[k] = personModel(PEOPLE[k]);
// ---------------- BOX CANYON: the recount ----------------
SCENES.canyon_main.ents = (base => () => base().concat([
  npc3('census', 'manager', -12, 6, CL, () => censusTalk(), { yaw: .4 }),
]))(SCENES.canyon_main.ents);
async function censusTalk() {
  if (F3('censusDone')) return say(pick(['Eleven. I\'m writing eleven. The state can count for itself.', 'Every census is a promise, dear. I promised eleven.']), CL);
  await say('A WOMAN WITH A CLIPBOARD STANDS IN THE MIDDLE OF THE ROAD LIKE THE ROAD ANSWERS TO HER. IN A WAY, IT DOES.');
  await say2([[CL, 'You. Hold still. Are you enumerated?'], ['CARL', 'Am I WHAT?'], [CL, 'Counted. Box Canyon is eleven people. The ledger says eleven. I count ten.'], ['CARL', 'Maybe somebody left.'], [CL, 'Nobody leaves. That\'s the town\'s whole personality.']]);
  DBG.truth = 0; const c = await ask('WHO IS THE ELEVENTH?', CL, ['THE CAT', 'THE TUMBLEWEED', 'ME']); DBG.truth = undefined;
  if (c === 0) await say2([[CL, 'The cat. THE CAT. The cat has no fixed address, no mailbox, and opinions about the deputy.'], ['CARL', 'So it\'s the cat.'], [CL, 'It\'s the cat. It was always the cat. I just needed a witness with no stake. You\'re very unstaked. Thank you.']]);
  else if (c === 1) await say2([[CL, 'The tumbleweed. It\'s been registered since \'74. It votes. It has never once voted FOR anything.'], ['CARL', 'That\'s the most Box Canyon thing I\'ve ever heard.'], [CL, 'It\'s the most Box Canyon thing there IS.']]);
  else await say2([[CL, 'You? You arrived today, in a saucer, from outside the county.'], ['CARL', 'I could be from inside the county. Vertically.'], [CL, '...Vertically is a new axis. I\'ll allow it as a comment. NOT as an answer. The eleventh is the cat.']]);
  C3.bux += 5; sfx('get'); setF3('censusDone');
  await say2([[CL, 'Five dollars. Census work pays per head, and tonight you were a head.'], ['CARL', 'I was a witness.'], [CL, 'That\'s what a head is, dear.']]); 
  addNote('THE CENSUS LADY: Box Canyon is eleven. The eleventh is the cat. Carl was briefly a head.');
}
// ---------------- THE STARLITE: Mitch and the machine ----------------
SCENES.motel_lot.ents = (base => () => base().concat([
  npc3('mitch', 'mitch', -5.8, 19.2, MI, () => mitchTalk(), { yaw: 1.2, cond: () => !F3('mitchDone') }),
]))(SCENES.motel_lot.ents);
async function mitchTalk() {
  await say('A MAN STANDS IN FRONT OF THE VENDING MACHINE HOLDING A SOCK THAT CLINKS. THE SOCK IS FULL OF QUARTERS. HE LOOKS LIKE A MAN AT A GRAVE HE OWES MONEY TO.');
  await say2([[MI, 'Tuesday. Tuesday it took my three dollars. No soda. The little spiral turned. The soda WATCHED. And didn\'t come.'], ['CARL', 'That\'s theft. Mechanical theft.'], [MI, 'It\'s a holdout. The soda\'s still there. Third row. Cherry. It KNOWS what it did.'], [U0, 'carl shake it']]);
  const c = await ask('THE MACHINE HUMS, SMUG.', null, ['SHAKE IT (GENTLE)', 'SHAKE IT (ANGRY)']);
  WX.shake = 8; sfx(c === 1 ? 'hurt' : 'tick'); await wait(30); sfx('get');
  await say(c === 1
    ? 'YOU SHAKE IT LIKE IT HAS SOMETHING TO HIDE. TWO SODAS FALL AT ONCE, THEN A THIRD, THEN A ROLL OF QUARTERS THAT IS NOT YOURS AND IS NOT HIS. THE MACHINE GOES QUIET IN THE WAY OF A MACHINE THAT HAS LEARNED.'
    : 'YOU SHAKE IT GENTLY, LIKE A VENDOR. ONE SODA COMES DOWN. THEN, AFTER A MOMENT, A SECOND ONE FOLLOWS IT, ASHAMED. TUESDAY\'S, PROBABLY.');
  await say2([[MI, 'Two. TWO. Tuesday\'s and tonight\'s. It gave back Tuesday.'], ['CARL', 'It apologized. That was the apology.'], [MI, 'Take one. And take three dollars— no. Take this: on any road in this state, the machine remembers who shook it. There\'s a network. There\'s no network. But there\'s a FEELING.']]);
  C3.bux += 3; sfx('get'); setF3('mitchDone');
  await say2([['CARL', '(soda opens) Cherry.'], [U0, 'of course'], ['CARL', 'Everything on this road is cherry. The pie, the soda, the light. It\'s a cherry state.']]);
  addNote('MITCH: shook the vending machine; it returned Tuesday\'s soda. "The machine remembers who shook it."');
}
// ---------------- BIG LEON'S: the trucker chapel ----------------
SCENES.plaza_lot.ents = (base => () => base().concat([
  npc3('bud', 'bud', 33.4, 24.4, BU, () => budTalk(), { yaw: 2.4 }),
  { id: 'chapel', kind: 'prop3', at: [37, 0, 27], label: 'THE CHAPEL', range: 2.8, look: 'A SHED THE SIZE OF TWO PARKING SPOTS, WITH A STEEPLE THE SIZE OF A DREAM. A NEON SIGN: "OPEN 24 HRS (GOD)." SIX FOLDING CHAIRS. NONE OF THEM DUSTY.', draw3: e => { const sp = project(LIVE.cam, [37, 3, 27]); if (sp) { rectF(sp[0] - 16, sp[1] - 8, 32, 22, hex('#8a7a6a')); triF(sp[0] - 16, sp[1] - 8, sp[0] + 16, sp[1] - 8, sp[0], sp[1] - 20, hex('#6d4924')); rectF(sp[0] - 1, sp[1] - 26, 2, 7, hex('#dbdbff')); rectF(sp[0] - 9, sp[1] - 2, 18, 4, hex('#ffdb24')); } } },
]))(SCENES.plaza_lot.ents);
async function budTalk() {
  if (F3('budDone')) return say(pick(['You\'re on the list, little pilgrim. Sundays, channel 19, weather permitting. Weather always permits.', 'The door\'s unlocked. It was never locked. It\'s a shed. Locks cost extra.']), BU);
  await say('A BIG MAN IN A CLERGYMAN\'S COLLAR AND TRUCKER\'S BOOTS STANDS BY A SHED WITH A STEEPLE ON IT. HIS HAT SAYS RETIRED. HIS EYES SAY NOT ENTIRELY.');
  await say2([[BU, 'Evening, pilgrim. You\'re parked in the forty acres. Everybody\'s parked in the forty acres eventually.'], ['CARL', 'What is this?'], [BU, 'Chapel. For drivers. A man needs somewhere to sit that isn\'t the cab and isn\'t the counter.'], [BU, 'Sit a spell. Or stand. Standing\'s also a prayer if your feet are tired enough.']]);
  await say2([[BU, 'So. What are you hauling?'], ['CARL', 'A box. It\'s— I\'m hauling a box.'], [BU, 'We all are, pilgrim. My last year on the road, I hauled a box 4,000 miles and never once looked in it. Didn\'t need to. It was heavy in the right way.'], ['CARL', 'What was in it?'], [BU, 'Other men\'s mail. And one letter I wrote and never sent. Same box. That\'s the job.']]);
  DBG.truth = 0; const c = await ask('THE CHAPEL IS OPEN. THE SIGN HUMS.', BU, ['LEAVE A PRAYER', 'JUST SIT A WHILE']); DBG.truth = undefined;
  if (c === 0) {
    await say2([['CARL', '(out loud, to a shed, at night, in a parking lot) ...For the people in transit. All of them. That they arrive, or that they don\'t have to. Amen— is amen right?'], [BU, 'Amen\'s always right. It\'s the only always-right word I got.']]);
    addNote('Left a prayer at the trucker chapel: for the people in transit — that they arrive, or that they don\'t have to.');
  } else await say2([['CARL', 'I\'ll just sit. I don\'t have the vocabulary.'], [BU, 'Sitting\'s the prayer, pilgrim. The words are just the receipt.']]);
  C3.bux += 2; sfx('get'); setF3('budDone');
  await say2([[BU, 'Two dollars. Plate flows both ways out here. And you\'re on the list now. Sundays, six p.m., we read the handles of every driver still rolling. Yours\'ll get read.'], ['CARL', 'I don\'t have a handle.'], [BU, 'You will. The road gives everybody one. It\'s rude like that.']]);
  addNote('PREACHER BUD: on the Sunday list. "The road gives everybody a handle."');
}
