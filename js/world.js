'use strict';
// ================= WORLD PART 1: ship, lot, dock, mall, bong shop, more outside, suite 00 =================
LEGEND = {
  '#': 'void', A: 'asph', l: 'aline', '=': 'walk', M: 'mwall', N: 'mwin', D: 'mdoor', L: 'lamp', C: 'car', K: 'carK', G: 'bush', B: 'booth',
  S: 'sign', s: 'signw', R: 'shutter', r: 'shutOpen', P: 'panel', x: 'crate',
  '.': 'floor', I: 'iwall', O: 'store', Q: 'pshut', b: 'bshop', o: 'sdoor', p: 'plant', n: 'bench', t: 'table', f: 'fount', v: 'escD', '^': 'escU', E: 'wscreen',
  H: 'hull', w: 'win', k: 'cons', _: 'grate', z: 'couch', j: 'junk', h: 'hatchIn',
  ',': 'sand', ';': 'sand2', y: 'road', '-': 'roadl', '~': 'roadl2', c: 'cactus', q: 'rock', u: 'crater', e: 'eye', T: 'busstop', V: 'vsign',
  ':': 'lfloor', W: 'lwall', '|': 'ldoor', U: 'tube', Y: 'tubeE', Z: 'bed', F: 'cab', m: 'desk', J: 'elev', '!': 'ladder', '"': 'drawing', '%': 'tally',
  '*': 'bits', '&': 'code', '+': 'dpath', 0: 'white', 1: 'wline',
};
TILES.fount.look = ['The fountain. Everybody threw pennies in. The pennies are looking up at me.', 'I didn\'t do anything to this fountain. The fountain knows what it did.'];
const C = 'CARL', LI = 'LINDA';
const nth = (k, arr) => { const n = F(k) || 0; setF(k, n + 1); return arr[Math.min(n, arr.length - 1)]; };

// ---------- THE A.S.S. ----------
MAPS.ship = {
  title: 'THE A.S.S.', music: 'ship',
  rows: ['HHHHHHHHHH', 'HwwwwwwwwH', 'Hkkk__kkkH', 'H________H', 'Hzz_____jH', 'H________H', 'HHHHhHHHHH'],
  ents: () => [
    { id: 'parcel', x: 5, y: 2, spr: 'parcel', if: () => F('parcelOut') && !has('PARCEL') && !F('delivered'),
      talk: async () => { await get('PARCEL'); setF('obj', 'door'); await say('It\'s light. It rattles. One thing. Like a... one thing.', C); } },
  ],
  steps: {
    '4,6': async () => {
      if (!has('PARCEL') && !F('delivered')) { await say('Hold on. The parcel. I literally have one job and it\'s the parcel.', C); await walk(P, 'U'); return; }
      await warp('lot', 4, 13, 'down');
    },
  },
  intro: async () => {
    await wait(50);
    await say('...', C);
    for (let i = 0; i < 3; i++) { sfx('ring'); await wait(40); }
    await emote(P, '!');
    await say('Hold on. Hold on, it\'s ringing. Nobody calls the ship. Nobody has the number. I don\'t have the number.', C);
    await say('Hello? A.S.S., this is Carl.', C);
    await say('PROP PILLS DISPATCH. ONE PARCEL. MALL OF THE FUTURE. SUITE ZERO ZERO.', 'DISPATCH');
    await say('Suite zero zero. That\'s two nothings. That\'s not a suite, that\'s a... okay. Fine.', C);
    await say('Is this Face? Face, is that you? You sound different.', C);
    await say('THIS IS DISPATCH.', 'DISPATCH');
    await say('...Okay. Cool. Hi, dispatch. Do I get paid for this one?', C);
    await say('PAYMENT IS AN INVESTMENT IN THE FUTURE.', 'DISPATCH');
    await say('That\'s what I say! That\'s MY thing. Who told you I say that?', C);
    await say('THE PARCEL IS ON YOUR CONSOLE. DO NOT OPEN THE PARCEL.', 'DISPATCH');
    sfx('door'); setF('parcelOut');
    await say('Don\'t open it. Right. Why would I open it. I wasn\'t going to open it until you said that.', C);
    if (F('again')) { await wait(30); await say('Chat... have we done this before? It feels like we\'ve done this before. Don\'t answer that.', C); }
    await say('Arrows move. Z / A talks. X / B runs. ENTER / START opens the menu.');
  },
};

// ---------- PARKING LOT ----------
async function lindaDoor() {
  if (F('ending')) return say('The doors are open. All of them. It\'s way worse.', C);
  if (!has('PARCEL')) return say('I don\'t have the parcel. I\'m not going in there for fun. Nobody goes in there for fun.', C);
  if (F('banned')) { await say('BANNED.', LI); return say(pick(['I know. I\'m just visiting the door.', 'I\'m not in. Look. Both feet. Outside.', 'Rear. I know. I KNOW.']), C); }
  sfx('alert'); setF('banned');
  await say('CARL.', LI);
  await say('No. Hi. Hello. I\'m a delivery guy. A normal delivery human.', C);
  await say('YOU ARE BANNED FROM THE MALL OF THE FUTURE.', LI);
  await say('For what?', C);
  await say('THE BONG. THE OTHER BONG. THE THIRD BONG. REFUSING TO LEAVE. LEAVING AND COMING BACK. THE FOUNTAIN.', LI);
  await say('The fountain was a misunderstanding. You\'re allowed to misunderstand a fountain.', C);
  await say('I have a parcel. For your mall. It\'s addressed to you. You\'re banning your own parcel.', C);
  await say('THE PARCEL MAY ENTER. YOU MAY NOT.', LI);
  await say('It can\'t walk, Linda! It\'s a box! It doesn\'t have legs! I\'m the legs! Open the door. OPEN IT.', C);
  await argue(FOES.door);
  await say('Where you gonna put me? I\'m already outside. You put me outside. Where are you gonna put me now, more outside?', C);
  await say('DO NOT TEMPT ME, CARL.', LI);
  await say('DELIVERIES ARE AT THE REAR.', LI);
  await say('...Oh. Wait, that\'s what it does? Okay. No, that makes sense. Why didn\'t you say that before I got mad?', C);
  await say('I DID. IT IS ON THE SIGN.', LI);
  setF('obj', 'rear');
}
MAPS.lot = {
  title: 'MALL OF THE FUTURE - LOT', music: 'lot',
  rows: ['MMMMMMMMMMMMMMMMMMMM', 'MNNMMNNMMDDMMNNMMNNM', '===s================', 'AAAAAAAAAAAAAAAAAAAA',
    'AlClAlClALlClAlKlAAA', 'AlAlAlClAAlAlAlClAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA',
    'AlClAlAlALlClAlClAAA', 'AlClAlClAAlAlAlAlAAA', 'AAAAAAAAAAAAAAAAABBA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'GGGGGGGGGGGGGGGGGGGG'],
  get noise() { return F('ending') ? 0 : 0; },
  ents: () => [
    { id: 'ass', x: 2, y: 12, w: 2, h: 2, spr: 'ass', spd: 25, talk: async () => {
      if (F('ending')) return MAPS.lot.finale();
      await say(pick(['The A.S.S. Alien Starship. It\'s an acronym. Stop laughing. It\'s a normal acronym.', 'My ship. I live here. In the parking lot. Legally. Mostly.']), C);
      if (await ask('Go inside?', null, ['YES', 'NO']) === 0) await warp('ship', 4, 5, 'up');
    } },
    { id: 'att', x: 16, y: 11, spr: 'attendant', talk: attendant },
    { id: 'cart', x: 12, y: 7, spr: 'cart', solid: true, talk: async () => say(nth('cart', ['It\'s a shopping cart.', 'I parked over there. It was over there. Why is it always near me.',
      'Stop following me. ...I\'m talking to a cart. Chat, don\'t clip that.', 'It has a wobbly wheel. I have a wobbly wheel too. Emotionally.', 'Cart.']), C),
      update: e => {
        if (frame % 200 || !(e.px - camX < -16 || e.px - camX > W || e.py - camY < -16 || e.py - camY > H)) return;
        const d = Math.abs(P.x - e.x) > Math.abs(P.y - e.y) ? (P.x > e.x ? 'right' : 'left') : (P.y > e.y ? 'down' : 'up');
        const nx = e.x + DIRS[d][0], ny = e.y + DIRS[d][1];
        if (Math.abs(P.x - nx) + Math.abs(P.y - ny) > 1 && !blocked(nx, ny, e)) { e.x = nx; e.y = ny; e.mv = 1; }
      } },
  ],
  signs: {
    '3,2': 'MALL OF THE FUTURE\nTHE FUTURE IS OPEN 24 HOURS\nDELIVERIES AT REAR >',
    '9,1': lindaDoor, '10,1': lindaDoor,
    '17,11': attendant, '18,11': attendant,
    '15,4': creepyCar,
  },
  exits: {
    right: () => warp('dock', 0, 5, 'right'),
    left: () => say('Nothing that way. More parking lot. It goes forever. I checked. Twice.', C),
    up: () => {}, down: () => {},
  },
  enter: async () => {
    if (F('ending')) return;
    if (!F('lotIntro')) { setF('lotIntro'); await say('Okay. The mall. It\'s right there. Walk in, drop it off, walk out. Easy. I\'m good at easy.', C); }
  },
};
async function attendant() {
  const a = ent('att'); if (a) a.dir = 'down';
  if (!F('att1')) {
    setF('att1');
    await say('Two hundred eighteen spaces. I count \'em every night.', 'ATTENDANT');
    await say('Cool. That\'s a lot of spaces. Good job.', C);
    await say('Tonight there\'s two hundred nineteen.', 'ATTENDANT');
    await say('Which one\'s new?', C);
    await say('You tell me. You parked.', 'ATTENDANT');
    return say('I parked in a normal space. It\'s normal. The ship takes up two, but I paid for both. In my head.', C);
  }
  const r = pick([
    [['Deliveries are around the back. East side. Past the car that\'s always running.', 'ATTENDANT']],
    [['Mall\'s been open 24 hours since 1998. Lotta people went in.', 'ATTENDANT'], ['And?', C], ['That\'s the whole sentence.', 'ATTENDANT']],
    [['You\'re not the first little green fella to park here.', 'ATTENDANT'], ['I\'m not green. It\'s the lighting. Everything\'s green. YOU\'RE green.', C], ['I know.', 'ATTENDANT']],
    [['Two hundred nineteen. Still.', 'ATTENDANT'], ['Where\'s the new one?', C], ['Far corner. Bottom right. You only see it when things get... wavy.', 'ATTENDANT']],
    [['Cart\'s been following you. Put it back in the corral, it\'ll stop. Probably.', 'ATTENDANT']],
    [['There\'s a guy in the car up top. Been there since before me.', 'ATTENDANT'], ['Is he okay?', C], ['He\'s parked.', 'ATTENDANT']],
  ]);
  for (const l of r) await say(...l);
}
async function creepyCar() {
  if (F('again') && !F('foundyou')) {
    setF('foundyou'); fx.pal = 'red'; sfx('glitch'); await wait(4); fx.pal = 'dmg';
    await say('WE FOUND YOU.', '???', { slow: 1 });
    return say('...That\'s new. That\'s new, right? He\'s never said anything. Chat, he\'s never said anything.', C);
  }
  await say(nth('carK', ['There\'s someone in this car. Just sitting. Hey. Hey, man. ...He\'s not moving.',
    'Still sitting. His eyes are open. Chat, his eyes are open, right? Tell me I\'m not the only one.',
    'He\'s looking at the mall. No. He\'s looking at the ship. He\'s looking at MY ship.',
    'I\'m not talking to him anymore. That\'s a decision. I\'m making a decision.']), C);
}

// ---------- LOADING DOCK ----------
MAPS.dock = {
  title: 'LOADING DOCK', music: 'lot',
  rows: ['MMMMMMMMMMMM', 'MMNMMPRRMMNM', '============', 'AAAAAAAAAAAA', 'AAxxAAAAAAAA', 'AAxAAAAAAxAA', 'AAAAAAAAAAAA', 'AAAAAAAAAAAA', 'GGGGGGGGGGGG'],
  init() { if (F('scanned')) { setTile(6, 1, 'shutOpen'); setTile(7, 1, 'shutOpen'); } },
  signs: { '5,1': scanner, '6,1': () => say('A shutter. It\'s shut. That\'s what they do. Next to it: a scanner panel.', C), '7,1': () => say('The shutter says DELIVERIES. Under that, scratched in: CARL GO HOME.', C) },
  steps: { '6,1': () => warp('mall', 9, 7, 'up'), '7,1': () => warp('mall', 10, 7, 'up') },
  exits: { left: () => warp('lot', 19, 7, 'left'), right: () => say('Dumpsters. Something in there is humming my song. I don\'t have a song.', C) },
  enter: async () => { if (F('obj') === 'rear') setF('obj', 'scan'); },
};
async function scanner() {
  if (F('scanned')) return say('The scanner\'s asleep. It\'s dreaming about my head.', C);
  if (!has('PARCEL')) { await say('PLACE PARCEL ON SCANNER.', 'SCANNER'); return say('I don\'t have it. I left it. I\'m doing great.', C); }
  await say('PLACE THE PARCEL ON THE SCANNER.', 'SCANNER');
  await say('Okay. Easy. I do this. This is literally what I do.', C);
  sfx('static'); fxAdd.noise = .06; fx.invert = 1; await wait(6); fx.invert = 0; await wait(40); fxAdd.noise = 0;
  await say('SCANNING... SCANNING... HEAD DETECTED.', 'SCANNER');
  await say('Why\'s it scanning me? You said parcel. You said put the PARCEL on there. Why are you looking inside my head?', C);
  await say('PERSONNEL VERIFICATION. SPECIES CLASSIFICATION PENDING.', 'SCANNER');
  const c = await ask('...', null, ['HUMAN', 'SAY NOTHING', 'HIT IT']);
  if (c === 0) { await say('Human. There. I did it for you. Can we go?', C); await say('RESPONSE LOGGED. CONFIDENCE: 4%.', 'SCANNER'); await say('Four percent is a number. It\'s not zero.', C); }
  else if (c === 1) { await say('...', C); await say('SILENCE LOGGED.', 'SCANNER'); await say('That\'s allowed. Humans are silent all the time. I\'ve seen it.', C); }
  else { sfx('bump'); fx.shake = 3; await wait(12); fx.shake = 0; await say('I didn\'t hit it hard. I hit it like a human would.', C); await say('VIOLENCE LOGGED. SPECIES CLASSIFICATION: CARL.', 'SCANNER'); await say('That\'s not a species! ...Is it?', C); }
  sfx('static'); await wait(40);
  await say('...carl...?', 'VOICE', { slow: 1 });
  await say('Hold on. Be quiet a second. Chat, did you hear that?', C);
  await say('That sounded like him. That sounded like Spooky Ghost. ...Hey. Can you hear us? We\'re here, bro.', C);
  sfx('static'); await wait(60);
  await say('DELIVERY AUTHORIZED. PROCEED TO SUITE 00.', 'SCANNER');
  sfx('door'); setTile(6, 1, 'shutOpen'); setTile(7, 1, 'shutOpen'); setF('scanned'); setF('obj', 'suite');
  await say('Okay. Parcel first. Then ghost. Or ghost first. We\'ll see. We\'ll see what happens.', C);
}

// ---------- MALL ----------
const floorN = () => F('floor') || 0;
const SHOPPER_LINES = [
  ['WELCOME TO THE FUTURE.', 'Thanks. It\'s very... future. Very future in here.'],
  ['I\'M WAITING FOR MY RIDE. MY RIDE IS THE FUTURE.', 'That\'s not a ride. Who\'s driving? Nobody\'s driving, man.'],
  ['HAVE YOU SEEN MY FACE? I HAD IT WHEN I CAME IN.', 'No. I haven\'t. I\'m gonna go. Good luck with your... everything.'],
  ['THE PRETZELS ARE FREE IF YOU NEVER LEAVE.', 'What if I leave a little.'],
  ['LINDA IS WATCHING THE ONE WITH THE CAP.', 'That\'s me. I\'m the one with the cap. Why are you telling me? Why\'d you say it like that?'],
  ['YOU\'RE SHORTER IN PERSON.', 'In person?! Where else have you seen me?'],
];
function shopper(id, x, y, li) {
  return { id, x, y, spr: floorN() >= 4 ? 'shopperEyes' : 'shopper', pmap: floorN() >= 6 ? [0, 1, 3, 3] : null,
    talk: async () => { const [a, b] = SHOPPER_LINES[(li + floorN()) % SHOPPER_LINES.length]; await say(a, '???'); await say(b, C); },
    update: e => {
      if (floorN() < 5 || rnd(120)) return;
      const d = Math.abs(P.x - e.x) > Math.abs(P.y - e.y) ? (P.x > e.x ? 'right' : 'left') : (P.y > e.y ? 'down' : 'up');
      const nx = e.x + DIRS[d][0], ny = e.y + DIRS[d][1];
      if (!blocked(nx, ny, e)) { e.x = nx; e.y = ny; e.mv = 1; }
    } };
}
MAPS.mall = {
  title: 'MALL OF THE FUTURE', music: 'mall',
  rows: ['IIIIIIIIIIIIIIIIIIII', 'IOQQOIEIbobIOOEOIv^I', 'I.......p......n...I', 'I..................I', 'Ip..t..t..f..t..t.pI',
    'I..................I', 'I.n...t..t...t..n..I', 'I..................I', 'IIIIIIIII..IIIIIIIII'],
  get noise() { return floorN() * .004; },
  get wave() { return floorN() >= 6 ? 1 : 0; },
  init() { const f = floorN(); mus.det = -f * 18; mus.rate = Math.max(.65, 1 - f * .04); mus.wob = f * 6; },
  ents: () => [
    shopper('s1', 4, 5, 0), shopper('s2', 7, 3, 1), shopper('s3', 13, 3, 2), shopper('s4', 16, 5, 3), shopper('s5', 10, 6, 4),
    ...(floorN() >= 3 ? [shopper('s6', 3, 7, 5), shopper('s7', 15, 7, 2)] : []),
    { id: 'rope', x: 18, y: 2, spr: 'rope', if: () => !F('rope'), talk: ropeTalk },
    { id: 'ghost', x: 11, y: 3, spr: 'ghost', haze: 1, solid: false, bob: 1, pmap: [0, 1, 2, 2], talk: async () => {
      setF('ghostMall');
      await say('carl... she keeps me in the box... linda\'s box...', 'SPOOKY GHOST', { slow: 1 });
      await say('Spooky? Spooky Ghost! Bro! Where are you? What box? Which box? It\'s a mall! It\'s ALL boxes!', C);
      await say('...below... go below... you know the way... you\'ve been...', 'SPOOKY GHOST', { slow: 1 });
      await say('I\'ve been what? Been WHAT? ...He\'s gone. Chat, you saw him, right? That wasn\'t the weed. That was a little the weed.', C);
    } },
  ],
  signs: {
    '2,1': () => say('PROP PILLS. A SUBSIDIARY OF PRETEND CO. THE PRETEND COMPANY. A REAL COMPANY.'),
    '3,1': async () => { await say('CLOSED. "NOW 12% MORE PRETEND."'); await say('I work for them. I think. Nobody\'s told me I don\'t.', C); },
    '6,1': lindaScreen, '14,1': lindaScreen,
    '8,1': () => say('BONG EMPORIUM. "EVERYTHING IS GLASS."'), '10,1': () => say('BONG EMPORIUM. A small sign: NO CARL.'),
  },
  steps: {
    '9,1': () => warp('bongs', 3, 5, 'up'),
    '17,1': escLoop,
    '18,1': async () => {
      await say('It\'s going up. I\'m going down. We\'re going to find out who\'s more committed.', C);
      mus.det = 0; mus.rate = 1; mus.wob = 0; setF('floor', 0);
      await warp('suite', 4, 6, 'up', { sp: 10 });
    },
  },
  exits: { down: () => warp('dock', 6, 2, 'down') },
  onSmoke: async () => {
    const n = (F('mallSmoke') || 0) + 1; setF('mallSmoke', n);
    if (n === 1) { await say('NO SMOKING IN THE MALL OF THE FUTURE.', LI); await say('I haven\'t even lit it! How do you know! You don\'t have a nose!', C); }
    else if (n === 2) { await say('LAST WARNING, CARL.', LI); await say('It was fine a minute ago. Chat, was it a problem before she got here?', C); }
    else { await say('I WARNED YOU.', LI); await say('Wait wait wait. It\'s already lit. It\'d be a waste. You\'re wasting it.', C); await moreOutside(); return false; }
  },
  enter: async () => {
    if (!F('mallIn')) { setF('mallIn'); await chapter(2, 'THE MALL OF THE FUTURE'); await say('Okay. We\'re in. We\'re inside. Chat, don\'t say anything. Act normal. I\'m acting normal.', C); }
  },
};
async function lindaScreen() {
  await say(pick(['I SEE YOU, CARL.', 'THE FUTURE IS WATCHING. THE FUTURE IS ME.', 'PLEASE ENJOY THE MALL. PLEASE DO NOT ENJOY IT TOO MUCH.', 'YOUR DELIVERY IS LATE. IT HAS ALWAYS BEEN LATE.']), LI);
  await say(pick(['Stop watching me. Watch somebody else. There\'s a lot of faceless people. Watch them.', 'Okay. Cool. Hi Linda. Great screen. Very flat.', 'You\'re in every screen. Do you get tired? Do screens get tired?']), C);
}
async function ropeTalk() {
  await say('A velvet rope. The sign says: UP ESCALATOR. DO NOT GO DOWN THIS WAY. SUITE 00 IS NOT DOWN HERE.');
  await say('That\'s a weird thing to say. Why would you tell me where it ISN\'T.', C);
  const c = await ask('...', null, ['RESPECT IT', 'STEP OVER IT']);
  if (c === 0) return say('Fine. It\'s a rope. Rules are rules. I respect rules. Chat, stop laughing.', C);
  await say('You know what? It said don\'t. So.', C);
  sfx('tick'); setF('rope');
  await wait(20); sfx('alert');
  await say('HEY. HEY! UP ONLY! CAN\'T YOU READ?', 'MALL COP');
  await copFight();
}
async function escLoop() {
  const f = floorN() + 1; setF('floor', f);
  if (f >= 3) setF('obj', 'loop');
  sfx('door'); await fadeOut(6);
  loadMap('mall', 17, 2, 'down');
  await wait(20); await fadeIn(6);
  banner('FLOOR B' + f, 90);
  const lines = ['Okay, we went down. This is downstairs. It looks exactly like upstairs. That\'s a design choice.',
    'Hold on. That\'s the same bench. That\'s the same pretzel. Chat, is this the same floor?',
    'It\'s the same floor. We\'re going down and it\'s the same floor. I\'ve been going DOWN. I\'m good at going down.',
    'The people are looking at me now. They didn\'t have faces before. Did they have faces before?',
    'They\'re walking toward me. Why are they walking toward me? I didn\'t do anything. On this floor.'];
  await say(lines[f - 1] || ('B' + f + '. It says B' + f + '. ...I don\'t like numbers anymore.'), C);
  if (f === 3) await say('Chat. Chat, how do I get OUT of down.', C);
}
async function moreOutside() {
  sfx('caught'); fxAdd.wave = 6; await whiteOut(8); fxAdd.wave = 0;
  mus.det = 0; mus.rate = 1; mus.wob = 0; setF('floor', 0);
  loadMap('moreout', 5, 7, 'up'); await wait(40); await fadeIn(10);
  await say('...I\'m more outside. She did it. She actually found more outside.', C);
  await say('Chat. Chat, where is this? Is this behind the parking lot? Is this behind behind?', C);
}

// ---------- BONG EMPORIUM ----------
MAPS.bongs = {
  title: 'BONG EMPORIUM', music: 'mall',
  rows: ['IIIIIIII', 'IOOOOOOI', 'I......I', 'I......I', 'I......I', 'I......I', 'III..III'],
  ents: () => [
    { id: 'clerk', x: 5, y: 2, spr: 'clerk', talk: async () => {
      if (F('smashed')) return say('Get out. Get out get out get out.', 'CLERK');
      await say(nth('clerk', ['Welcome to Bong Emporium. Everything\'s glass. Everything breaks. Please don\'t.', 'You again.', 'I\'m not selling you anything. I\'m legally a museum now. Because of you.']), 'CLERK');
      await say(pick(['I\'m just looking.', 'I\'m looking normal. Look how normal I\'m looking.', 'Okay but have you considered: I have money. Somewhere.']), C);
    } },
    { id: 'bong', x: 2, y: 3, spr: 'bong', talk: bongTalk },
  ],
  init() { if (F('smashed')) ent('bong').spr = 'bongBroke'; },
  exits: { down: () => warp('mall', 9, 2, 'down') },
};
async function bongTalk() {
  if (F('smashed')) return say('Pieces. I\'m not taking responsibility for the pieces. The pieces did this.', C);
  await say('THE BIG ONE. Five feet of glass. The tag says: NOT FOR SALE. DISPLAY ONLY.');
  await say('It\'s taller than me. That\'s fine. Lots of things are taller than me. Buildings. Some dogs.', C);
  await say('Too big for you, little man.', 'CLERK');
  await say('Too big? You said the bong was too big. Now you\'re looking at me. Why are you looking at me?', C);
  const c = await ask('...', null, F('won_clerk') ? ['LEAVE IT', 'SMASH IT'] : ['LEAVE IT', 'SMASH IT', 'ARGUE']);
  if (c === 2) { if (await argue(FOES.clerk)) await giveTape(4); return; }
  if (c === 0) return say('I\'m leaving it. Look how much I\'m leaving it. Chat, clip this. Restraint.', C);
  sfx('smash'); fx.shake = 4; ent('bong').spr = 'bongBroke'; setF('smashed'); await wait(20); fx.shake = 0;
  await say('LINDAAAAA!', 'CLERK');
  await say('CARL.', LI);
  await say('It was fine a minute ago! It was fine before he said the thing!', C);
  await say('YOU ASKED WHERE I WOULD PUT YOU.', LI);
  await say('MORE OUTSIDE.', LI, { slow: 1 });
  await moreOutside();
}

// ---------- MORE OUTSIDE ----------
MAPS.moreout = {
  music: 'mout', noRun: 1,
  rows: ['000000000000', '010101010101', '010101010101', '000000000000', '000000000000', '010101010101', '010101010101', '000000000000', '000000000000', '000000000000'],
  ents: () => [
    { id: 'meter', x: 3, y: 4, spr: 'meter', talk: async () => { await say('PARKING METER. TIME EXPIRED: 1998.'); await say('Everything here is 1998. What happened in 1998? Was I born in 1998? Was I PARKED in 1998?', C); } },
    { id: 'door', x: 6, y: 2, spr: 'dframe', talk: async () => {
      await say('A door. Just the door part. There\'s a parking lot on the other side. MY parking lot.', C);
      if (await ask('Go through?', null, ['YES', 'NOT YET']) !== 0) return;
      await warp('lot', 9, 2, 'down');
      await say('WELCOME BACK, CARL.', LI);
      await say('I\'m not back. I was never gone. More outside is still outside. That\'s just outside with extra.', C);
    } },
    { id: 'other', x: 10, y: 8, spr: 'carlback', talk: async () => {
      await say(nth('other', ['Hey. Hey, man. Nice hat.', 'Hey. Turn around. ...Why won\'t he turn around.', 'That\'s my hat. That\'s MY hat. I have my hat. There\'s two hats.', '...']), C);
      if ((F('other') || 0) >= 4) { sfx('glitch'); ent('other').gone = 1; await wait(30); await say('Where\'d he go. Chat. Where\'d he go.', C); }
    } },
  ],
  exits: { up: edge, down: edge, left: edge, right: edge },
};
function edge() { return say(pick(['There\'s no edge. It\'s just more. She really did it.', 'I walked for a while. It\'s the same. It\'s all the same outside.']), C); }

// ---------- SUITE 00 ----------
MAPS.suite = {
  title: 'SUITE 00', music: 'suite', noRun: 1,
  rows: ['IIIIIIIIII', 'IIIIIIIIII', 'I........I', 'I........I', 'I........I', 'I........I', 'I........I', 'IIIIIIIIII'],
  ents: () => [{ id: 'linda', x: 4, y: 3, w: 2, h: 2, spr: 'lindaIdle', spd: 20, talk: lindaSuite }],
  get wave() { return .5; },
  enter: () => lindaSuite(),
};
async function lindaMouth(s) { const l = ent('linda'); l.spr = 'lindaTalk'; l.spd = 7; await say(s, LI); l.spr = 'lindaIdle'; l.spd = 20; }
SPR.lindaIdle = [0, 0, 0, 0, 0, 0, 1].map(i => SPR.linda[i]);
SPR.lindaTalk = [SPR.linda[0], SPR.linda[2]];
SPR.lindaSleep = SPR.linda[3];
async function lindaSuite() {
  if (!F('suite1')) {
    setF('suite1');
    await lindaMouth('HELLO, CARL.');
    await say('Hi. Hi Linda. Delivery. Here. Sign here. You don\'t have hands. Just... look at it. That counts.', C);
    await lindaMouth('THE PARCEL IS FOR YOU.');
    await say('No. It says Suite zero zero.', C);
    await lindaMouth('YOU ARE IN SUITE 00. YOU HAVE ALWAYS BEEN IN SUITE 00.');
    await say('I\'ve been in a parking lot! I\'ve been in a parking lot this WHOLE TIME! Ask anyone! Ask chat!', C);
    await say(F('ghostMall') ? 'And where\'s Spooky Ghost? I saw him. By the pretzels. He said you have a box.' : 'And I heard Spooky Ghost in your scanner. Where is he? What did you do?', C);
    await lindaMouth('SPOOKY GHOST IS IN THE BOX. EVERYONE ENDS UP IN THE BOX.');
    await lindaMouth('YOU WERE IN A BOX ONCE. BELOW NEVADA. SOMEONE LET YOU OUT.');
    await say('That\'s... how do you know that? That\'s private. That\'s a private box.', C);
    await lindaMouth('OPEN THE PARCEL, CARL.');
    lose('PARCEL'); sfx('door'); await wait(30);
    await say('Inside the parcel: one PROP PILL. A note: "IT\'S ONLY PRETEND."');
    await get('PROP PILL', 1);
    await say('It\'s one of ours. It says it\'s only pretend. They always say that. They\'re never ONLY pretend.', C);
    await lindaMouth('IF YOU WANT TO FIND HIM, YOU HAVE TO GO BACK DOWN. ALL THE WAY DOWN. WHERE YOU CAME FROM.');
    setF('obj', 'pill');
  }
  let no = 0;
  for (;;) {
    const c = await ask('TAKE THE PILL?', null, ['TAKE IT', 'DON\'T']);
    if (c === 0) break;
    no++;
    if (no === 1) { await say('No. I\'m not taking a pill from a box that knew my name.', C); await lindaMouth('THEN YOU WILL STAY.'); music(null); await wait(180); music('suite');
      await say('...How long does it say? No, how long did it say before? Because we\'ve been standing here and I think the number got bigger.', C); }
    else if (no === 2) { await lindaMouth('I CAN WAIT. I AM A MALL.'); }
    else { await say('FINE. Fine! For Spooky. Not for you. I want that on the record.', C); await lindaMouth('IT IS ON THE RECORD. EVERYTHING IS.'); break; }
  }
  await say('Okay. Chat, if I start talking weird, that\'s just me. That\'s my normal. That\'s normal-me.', C);
  lose('PROP PILL'); setF('delivered'); sfx('smoke');
  await trip();
}
async function trip() {
  for (let i = 0; i < 90; i++) { fxAdd.wave = i / 9; mus.rate = 1 - i / 200; if (i === 40) fxAdd.cycle = 6; await nextFrame(); }
  fxAdd.noise = .1; sfx('glitch'); await wait(40);
  await fadeOut(3); fxAdd.wave = 0; fxAdd.cycle = 0; fxAdd.noise = 0; mus.rate = 1; music(null);
  scene = { draw() { cls(3); } }; fx.fade = 0;
  await showCard(['BELOW.'], 100);
  await showCard(['BELOW BELOW.'], 100);
  await showCard(['CHAPTER 3', '', 'ABOVE NEVADA'], 150);
  setF('act', 2); setF('obj', 'desert');
  scene = worldScene; loadMap('desert', 6, 8, 'down'); fx.fade = 0;
  await wait(10);
  if (MAPS.desert.enter) { setF('seen_desert'); banner(MAPS.desert.title); await MAPS.desert.enter(); }
}
