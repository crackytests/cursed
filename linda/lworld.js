'use strict';
// ================= CEO LINDA — maps =================
SPR.coreIdle = [0, 0, 0, 0, 0, 0, 1].map(i => SPR.core[i]);
const LITE_PMAP = [0, 0, 1, 1], NEG_PMAP = [3, 2, 1, 0];

// every Linda map: camera overlay + network palette bleed
function lmap(d) {
  const t0 = d.tick;
  d.tick = () => {
    if (S.haze > 0) { fx.wave = 0; fx.noise = .015; fx.cycle = 0; }
    fx.pal = d.green ? 'dmg' : (S.day === 5 && !F('won_core') && frame % 240 < 4) ? 'dmg' : 'pink';
    if (t0) t0();
  };
  d.draw = () => {
    if (S.haze <= 0) return;
    rect(4, 4, 5, 5, (frame >> 4) & 1 ? 3 : 1); text('REC', 12, 3, 3);
    text('CAM ' + (d.cam || '01'), 110, 3, 3); text(clock(), 4, 134, 3);
  };
  return d;
}
const incidentEnt = (id, x, y, day, q, answers) => ({ id, x, y, spr: 'shopper', turns: 0, if: () => S.day === day && !F('inc_' + id),
  update: e => { if (frame % 120 === 0 && !busy) { e.emote = '!'; e.emoteT = 40; } },
  talk: async e => {
    await say(q, 'SHOPPER');
    const i = await ask('...', null, answers.map(a => a[0]));
    const [line, $, r, reply] = answers[i];
    await say(line, LI);
    if (reply) await say(reply, 'SHOPPER');
    setF('inc_' + id); if ($) await money($); if (r) await fame(r);
  } });
const pageEnt = (i, x, y, cond) => ({ id: 'pg' + i, x, y, spr: 'page', haze: 1, solid: false, floor: 1, if: () => !pages().includes(i) && (!cond || cond()), talk: () => givePage(i) });

// ---------- OFFICE (SUITE 00) ----------
MAPS.office = lmap({
  title: 'SUITE 00', music: 'office', cam: '00',
  legend: { W: 'owall', N: 'owin', P: 'portrait', B: 'oboard', M: 'omon', k: 'coffee', D: 'odeskL', E: 'odeskR', S: 'osafe', p: 'plant', '.': 'carpet' },
  rows: ['WNPNWBBWMW', 'W........W', 'Wk.......W', 'W...DE...W', 'W........W', 'S.......pW', 'W........W', 'WWWW..WWWW'],
  ents: () => [
    { id: 'lite', x: 7, y: 2, spr: 'lite', pmap: S.day === 5 && !F('won_core') ? NEG_PMAP : LITE_PMAP, bob: 1, solid: true, talk: liteTalk },
    { id: 'aud', x: 4, y: 5, spr: 'ceo', pmap: NEG_PMAP, if: () => S.day === 3 && !F('won_auditor'), talk: auditorTalk },
    pageEnt(0, 8, 6),
  ],
  signs: {
    '4,3': () => deskTalk(), '5,3': () => deskTalk(), '5,0': () => showDirectives(), '6,0': () => showDirectives(), '8,0': monitorTalk, '0,5': safeTalk,
    '1,2': async () => { if (esp() >= 3) return say('Three espressos is the correct number. More is a cry for help.', LI); setF('esp', 3); sfx('ok'); await say('THE ESPRESSO MACHINE HISSES. LINDA NOW HAS 3 ESPRESSOS FOR NEGOTIATIONS.'); },
    '2,0': async () => { await say('A portrait of Linda. Commissioned by Linda. Approved by Linda.'); await say(pick(['The lighting is correct.', 'They wanted to paint me smiling. I said paint me accurately.', 'It is the best portrait in the mall. It is the only portrait in the mall. Those are related.']), LI); },
    '1,0': () => say('Outside the window: the mall. Outside the mall: nothing. Not darkness. Nothing. It\'s very quiet. I like it.', LI),
    '3,0': () => say('The window faces the atrium. I can see every store. Every store can see me. That was the point.', LI),
  },
  exits: { down: () => warp('atrium', 9, 1, 'down') },
});
async function liteTalk() {
  if (S.day === 5 && !F('won_core')) { await say('linda. they\'re in me. i\'m modeled on you. i\'m modeled on THEM. i don\'t—', LL); return say('Twenty percent. Stay at twenty percent. Stay mine.', LI); }
  const tips = {
    1: ['Your entrance! The studio is through the LEFT door of the atrium!', 'Vacant units say FOR LEASE! Leasing stores makes money every night!', 'The green one\'s ship is in the lot. Bottom exit of the atrium!'],
    2: ['Face is in the studio! He doesn\'t want your ad! He never wants your ad!', 'R&D is the RIGHT door! They finished the Perfect Impression!', 'Something broke at the Bong Emporium. Something always breaks at the Bong Emporium.'],
    3: ['There\'s a... Linda in your office. She says she\'s you. She isn\'t. I\'d know. I\'m 20% you.', 'Shoppers saw a ghost at the fountain! Use your CAMERAS!', 'The pretzel guy formed a union. Of himself.'],
    4: ['The 80s department! The trap! The escalator in the atrium!'],
    5: ['The monitor. The network came through the monitor.'],
  };
  await say(pick(tips[S.day] || ['All clear, Linda!']), LL);
  if (Math.random() < .3) await say(pick(['Also I love you! As a product! Legally!', 'Also you look great today!', 'Also I sold three of myself this morning!']), LL);
  await say(pick(['Twenty percent.', 'Noted.', 'You\'re selling again.', 'Good.']), LI);
}
async function monitorTalk() {
  if (S.day === 5 && !F('won_core')) {
    sfx('glitch'); await say('The monitor is green. It\'s not supposed to be green. Something on the other side is waiting.');
    if (await ask('Enter the box?', null, ['ENTER', 'NOT YET']) !== 0) return;
    await fadeOut(8); await warp('box', 7, 12, 'up', { sp: 8 }); return;
  }
  sfx('static');
  await say(carlBeaten() ? 'The monitor shows a green title screen. A small figure, facing away. It says: HE IS LOOKING.' : 'The monitor shows the parking lot. There\'s a ship parked across two spaces.');
  await say(carlBeaten() ? 'Not on my cartridge.' : 'Every single day.', LI);
}
async function safeTalk() {
  if (pages().length === 8 && F('won_core')) return say('The safe is open. The diary is whole. I don\'t need to read it. I wrote it.', LI);
  await say('The wall safe. Inside: a diary with pages missing. ' + pages().length + ' of 8 found.');
  await say(pick(['The pages keep getting out. Use the CAMERAS. They show up on camera.', 'I didn\'t lose them. They left.']), LI);
}

// ---------- ATRIUM ----------
const UNITS = { u1: [2, 1], u2: [4, 1], u3: [6, 1], u4: [13, 1], u5: [15, 1], u6: [17, 1] };
MAPS.atrium = lmap({
  title: 'THE MALL OF THE FUTURE', music: 'mall', cam: '02',
  legend: { I: 'iwall', '.': 'floor', J: 'elev', U: 'lease', p: 'plant', n: 'bench', f: 'fount', t: 'table', o: 'sdoor', v: 'escD' },
  rows: ['IIIIIIIIIJJIIIIIIIII', 'IIUIUIUII..IIUIUIUII', 'I..................I', 'I.p..n........n..p.I', 'I........ff........I',
    'o..t.............t.o', 'I..................I', 'I..v...........n...I', 'I..................I', 'IIIIIIIII..IIIIIIIII'],
  init() { for (const u in S.units) { const [x, y] = UNITS[u]; setTile(x, y, TENANTS[S.units[u]].tile); } mus.det = 0; mus.rate = 1; mus.wob = 0; },
  ents: () => [
    { id: 'pretz', x: 1, y: 2, spr: 'attendant', pmap: [0, 0, 2, 3], talk: pretzTalk },
    { id: 'cop', x: 18, y: 7, spr: 'cop', talk: async () => say(pick(['Morning, Ms. Linda. Nothing to report. The green one\'s in the lot again.', 'I\'ve been on break since 1998, ma\'am. It\'s a long break.', 'Somebody keeps stepping over the rope by the escalator. I can never catch him.']), 'MALL COP') },
    { id: 'sh1', x: 7, y: 6, spr: 'shopper', talk: async () => say(pick(['WELCOME TO THE FUTURE.', 'I LOVE THE MALL. I HAVE ALWAYS LOVED THE MALL. I CANNOT REMEMBER NOT LOVING THE MALL.', 'IS IT TUESDAY?', 'LINDA. LINDA. LINDA.']), 'SHOPPER') },
    { id: 'sh2', x: 12, y: 3, spr: 'shopper', talk: async () => say(pick(['I CAME IN FOR ONE THING. I DON\'T REMEMBER WHAT. I\'LL STAY UNTIL I DO.', 'THE MUSIC IS SO NICE. IT NEVER CHANGES.', 'I SAW YOUR BILLBOARD. I SAW YOUR LUNCHBOX. I SAW YOUR FACE IN A DREAM.']), 'SHOPPER') },
    incidentEnt('esc', 4, 6, 1, 'THE ESCALATOR ONLY GOES DOWN. FOREVER. I\'VE BEEN RIDING IT SINCE MONDAY.', [['That is a feature.', 0, 2, 'OH. THEN I LOVE IT.'], ['Take the stairs.', 0, 0, 'WHAT ARE STAIRS?'], ['No.', 0, 1, '...OKAY.']]),
    incidentEnt('warm', 15, 5, 1, 'MY PRETZEL IS TOO WARM. IT HAS BEEN TOO WARM FOR YEARS.', [['It\'s warm on purpose.', 0, 1, 'I RESPECT THAT.'], ['Here. A coupon.', -10, 2, 'A COUPON! WITH YOUR FACE!'], ['For whom?', 0, 0, 'FOR... ME? I THINK?']]),
    incidentEnt('face', 5, 4, 2, 'I LOST MY FACE. I HAD IT WHEN I CAME IN.', [['Lost and found.', 0, 0, 'THERE\'S NO LOST AND FOUND.'], ['Buy a new one. Aisle four.', 30, 0, 'I WILL BUY TWO.'], ['It suits you.', 0, 2, 'THANK YOU. THANK YOU SO MUCH.']]),
    incidentEnt('lot', 14, 6, 2, 'IS THE PARKING LOT BIGGER THAN YESTERDAY?', [['Yes.', 0, 1, 'I KNEW IT.'], ['It\'s the same size.', 0, 0, 'IT DOESN\'T FEEL THE SAME SIZE.'], ['Two hundred nineteen spaces.', 0, 2, 'THAT\'S ONE MORE THAN I COUNTED.']]),
    incidentEnt('name', 6, 7, 3, 'WHY IS YOUR COMPANY CALLED FASCISM INC.?', [['You remembered the name. Excellent.', 0, 3, 'I... DID. I REMEMBERED IT.'], ['It\'s a joke.', 0, 0, 'IT\'S NOT VERY FUNNY.'], ['It\'s a warning.', 0, 1, 'OH.']]),
    incidentEnt('job', 13, 3, 3, 'CAN I WORK HERE? I CAN DO ANYTHING. I\'VE BEEN HERE FOR A VERY LONG TIME.', [['How long would you like the service?', 40, 0, 'FOREVER. I\'D LIKE FOREVER.'], ['No.', 0, 0, 'OKAY. I\'LL STAY ANYWAY.'], ['You already do.', 0, 2, '...OH. I ALREADY DO.']]),
    incidentEnt('floor', 16, 6, 4, 'THERE\'S MUSIC COMING THROUGH THE FLOOR. SYNTHESIZERS. IT SOUNDS LIKE 1986.', [['It is 1986. Downstairs.', 0, 1, 'CAN I GO?'], ['Ignore it.', 0, 0, 'I CAN\'T. IT\'S SO CATCHY.'], ['Buy a ticket.', 50, 0, 'HOW MUCH? DOESN\'T MATTER.']]),
    { id: 'carlIn', x: 4, y: 2, spr: 'carl', turns: 1, if: () => S.day === 2 && !F('g_bong'), talk: bongIncident },
    { id: 'clerkIn', x: 5, y: 2, spr: 'clerk', if: () => S.day === 2 && !F('g_bong'), talk: async () => { await say('Ms. Linda! He broke the big one! AGAIN! The five-footer!', 'CLERK'); await say('Of course he did.', LI); } },
    { id: 'echo', x: 11, y: 4, spr: 'ghost', haze: 1, solid: false, bob: 1, pmap: [0, 1, 1, 2], if: () => S.day === 3 && !F('g_ghost'), talk: ghostEcho },
    pageEnt(1, 17, 8), pageEnt(3, 11, 4, () => F('g_ghost')), pageEnt(6, 1, 8, () => S.day >= 2),
  ],
  signs: {
    '9,0': () => warp('office', 4, 6, 'up'), '10,0': () => warp('office', 4, 6, 'up'),
    ...Object.fromEntries(Object.entries(UNITS).map(([u, [x, y]]) => [x + ',' + y, () => unitTalk(u)])),
    '9,4': fountainTalk, '10,4': fountainTalk,
  },
  steps: {
    '0,5': () => warp('studio', 10, 5, 'left'), '19,5': () => warp('rnd', 1, 4, 'right'),
    '3,7': async () => {
      if (S.day < 4) { await say('The escalator to the 80s DEPARTMENT. Closed for renovation. Since the 80s.'); await say('It stays closed until it\'s needed.', LI); return walk(P, 'U'); }
      await warp('eighties', 1, 2, 'down', { sp: 8 });
    },
  },
  exits: { down: () => warp('lot', 9, 2, 'down') },
});
async function fountainTalk() {
  await say('The fountain. Shoppers throw coins in. The coins go to Fascism Inc.');
  await say(pick(['Every wish in this fountain belongs to me. Legally.', 'I checked. Nobody has ever wished for anything I don\'t sell.']), LI);
}
async function pretzTalk() {
  if (S.day === 3 && !F('won_union')) {
    await say('I\'m on strike, Ms. Linda. The pretzels are warm, but the pretzel guy is cold. Emotionally.', 'PRETZEL GUY');
    await say('You are a pretzel guy. You don\'t get a union.', LI);
    await say('I\'m a union of one. I voted. It was unanimous.', 'PRETZEL GUY');
    if (await negotiate(LFOES.union)) { await done('union'); await money(60, 'PRETZEL PROFITS'); }
    return;
  }
  await say(pick(['Pretzel, Ms. Linda? Free if you never leave.', 'The pretzels are warm. They\'ve been warm since 1998. I don\'t know how. I don\'t ask.', 'I love my chair. It has your face on it.']), 'PRETZEL GUY');
}
async function ghostEcho() {
  sfx('static');
  await say('...lin?...', 'SPOOKY GHOST', { slow: 1 });
  await say('...the road... we should go on the...', 'SPOOKY GHOST', { slow: 1 });
  sfx('glitch'); ent('echo').gone = 1; await wait(40);
  await say('...', LI);
  await say('That\'s not him. That\'s an echo. He left an echo. He always left something. Mostly a mess.', LI);
  await done('ghost');
}

// ---------- STUDIO ----------
MAPS.studio = lmap({
  title: 'FACE\'S STUDIO', music: 'office', cam: '07',
  legend: { I: 'iwall', '.': 'stage', s: 'spot', c: 'tcam', h: 'seat', o: 'sdoor' },
  rows: ['IIIIIIIIIIII', 'IIIIIIIIIIII', 'I....ss....I', 'Ic..ssss..cI', 'I....ss....I', 'I..........o', 'Ihhhhhhhhh.I', 'I..........I', 'I..........I', 'IIIIIIIIIIII'],
  ents: () => [
    { id: 'face', x: 5, y: 0, w: 2, h: 2, spr: 'bigtv', spd: 25, talk: faceTalk },
    { id: 'a1', x: 3, y: 7, spr: 'shopper', talk: async () => say(pick(['WE ARE THE STUDIO AUDIENCE.', 'WE CLAP WHEN THE SIGN SAYS.', 'THE SIGN HAS NEVER SAID.']), 'AUDIENCE') },
    { id: 'a2', x: 6, y: 7, spr: 'shopperEyes', talk: async () => say(pick(['I WATCH EVERY STREAM.', 'IS THE GREEN ONE COMING ON TODAY?']), 'AUDIENCE') },
    { id: 'a3', x: 8, y: 7, spr: 'shopper', talk: async () => say('...', 'AUDIENCE') },
    { id: 'cambot', x: 1, y: 5, spr: 'cameraBot', spd: 30, talk: async () => say('A studio camera. The red light is on. It is always on.') },
    pageEnt(5, 10, 7, () => S.day >= 2),
  ],
  steps: { '11,5': () => warp('atrium', 1, 5, 'right'), '5,3': stageStep, '6,3': stageStep },
});
async function stageStep() {
  const k = 'entr_' + S.day;
  if (F(k)) return;
  if (await ask('The spotlight is on. Make an entrance?', null, ['ENTRANCE', 'NOT NOW']) !== 0) return;
  setF(k);
  const acc = await entrance('THE STUDIO');
  const r = Math.round(acc * 10);
  if (acc < .45) { await say('NOBODY LOOKED UP.'); await say('Turn the music off. They have seen me.', LI); }
  else if (acc < .8) await say('THREE SHOPPERS APPLAUDED. ONE OF THEM HAD A FACE.');
  else { await say('THE AUDIENCE STANDS. THEY DID NOT KNOW THEY COULD STAND.'); await say('Thank you. Sit down.', LI); }
  await fame(Math.max(1, r));
  if (S.day === 1) await done('entrance');
  else await say('(You can make one entrance per day for extra RECOGNITION.)');
}
async function faceTalk() {
  if (S.day === 1) { await say('Not today, Linda. Tomorrow. Book a slot like everybody else.', 'FACE'); await say('I own the slots.', LI); return say('Tomorrow.', 'FACE'); }
  if (S.day === 2 && !F('g_ad')) {
    sfx('ding');
    await say('You were just here.', 'FACE');
    await say('And you failed to mention the promotion.', LI);
    await say('I mentioned that you were promoting something.', 'FACE');
    await say('An unusually expensive way to say nothing.', LI);
    if (!await negotiate(LFOES.face)) return say('We\'re live, Linda. Come back when you have a shorter song.', 'FACE');
    await fame(6); await money(80, 'AD REVENUE');
    await say('Spooky Ghost used to do this exact entrance thing, you know.', 'FACE');
    await wait(40);
    await say('He was very good at entrances.', LI);
    await wait(60);
    await done('ad'); return;
  }
  if (F('allyFace')) return say(pick(['Still owe you one. Still hate it.', 'Your ad\'s still running. People keep asking what the pills do.']), 'FACE');
  await say(pick(['Your ad is running. Every hour. On the hour. It\'s the only thing that runs on time here.', 'We\'re live. Don\'t stand in front of the camera. ...You\'re standing in front of the camera.']), 'FACE');
}

// ---------- R&D ----------
MAPS.rnd = lmap({
  title: 'FASCISM INC. R&D', music: 'office', cam: '13',
  legend: { W: 'lwall', U: 'tube', ':': 'lfloor', m: 'desk', F: 'cab', Z: 'bed', Y: 'tubeE', o: 'sdoor' },
  rows: ['WWWWWWWWWWWW', 'WUUU:::mmFFW', 'W::::::::::W', 'W::::::::::W', 'o::::::::::W', 'W::::::::::W', 'WmZ::::::YYW', 'WWWWWWWWWWWW'],
  ents: () => [
    { id: 'sci', x: 5, y: 2, spr: 'suit', turns: 1, talk: sciTalk },
    { id: 'sci2', x: 8, y: 4, spr: 'suit', turns: 1, path: 'l.r.', update: patrol, pause: 90, talk: async () => say(pick(['WE TESTED THE PILLS. THEY WORK BETTER THAN PLACEBO. WE WERE TOLD THAT WAS A PROBLEM.', 'THE TUBES ARE FOR STORAGE. OF WHAT? DON\'T ASK. SHE DOESN\'T LIKE WHEN WE ASK.', 'I USED TO WORK BELOW NEVADA. SIMILAR BENEFITS.']), 'SCIENTIST') },
    { id: 'carlVol', x: 3, y: 5, spr: 'carl', turns: 1, if: () => S.day === 2 && !F('g_rnd'), talk: sciTalk },
    pageEnt(2, 10, 5),
  ],
  signs: {
    '1,1': () => say('A tube. Something in it is growing. A label: "COMPANION BODY, v0.9. DO NOT NAME."'),
    '9,1': () => say('FILE: PERFECT IMPRESSION. "Lets companions speak in the voice of anyone the customer misses." Approved by: L.'),
    '10,1': () => say('FILE: PROP PILLS. "Effectiveness exceeds placebo. Recommendation: stop saying placebo." Approved by: L.'),
  },
  steps: { '0,4': () => warp('atrium', 18, 5, 'left') },
});
async function sciTalk() {
  if (S.day !== 2 || F('g_rnd')) return say(pick(['EVERYTHING IS FINE, MS. LINDA.', 'THE PERFECT IMPRESSION IS SELLING WELL. WE CANNOT TURN IT OFF.', 'NO GUARANTEES, MS. LINDA. YOU TAUGHT US THAT.']), 'SCIENTIST');
  await say('THE PERFECT IMPRESSION IS READY FOR TESTING, MS. LINDA. THE VOLUNTEER IS PREPPED.', 'SCIENTIST');
  await say('I\'m the volunteer. They said there\'s money. Is there money?', C);
  await say('There is exposure.', LI);
  await say('Is it safe?', C);
  await say('It\'s fine.', LI);
  await say('Is it though?', C);
  await say('Maybe.', LI);
  await say('What does it do?', C);
  await say('It lets our companions sound like anyone. Anyone you miss.', LI);
  await say('That\'s creepy. That\'s a creepy product.', C);
  await say('It\'s the perfect impression.', LI);
  await say('Will it hurt?', C);
  await say('No guarantees.', LI);
  if (await ask('Run the test?', null, ['RUN IT', 'NOT YET']) !== 0) return say('Take your time. It is not safe either way.', LI);
  sfx('glitch'); fx.shake = 2; await wait(30); fx.shake = 0;
  VOICE['CARL?'] = VOICE.LINDA;
  await say('Shut up, green idiot.', 'CARL?');
  await say('Did I just— did I just call MYSELF a green idiot? In YOUR voice?', C);
  await say('Perfect.', LI);
  await get('PERFECT IMPRESSION');
  setF('compUnlocked');
  await say('NEW TENANT UNLOCKED: LINDA LITE KIOSK. Lease it in any vacant unit.');
  await done('rnd');
}

// ---------- PARKING LOT ----------
MAPS.lot = lmap({
  title: 'PARKING LOT', music: 'lot', cam: '04',
  legend: { A: 'asph', l: 'aline', '=': 'walk', M: 'mwall', N: 'mwin', D: 'mdoor', L: 'lamp', C: 'car', K: 'carK', G: 'bush', B: 'booth', s: 'signw' },
  rows: ['MMMMMMMMMMMMMMMMMMMM', 'MNNMMNNMMDDMMNNMMNNM', '===s================', 'AAAAAAAAAAAAAAAAAAAA',
    'AlClAlClALlClAlKlAAA', 'AlAlAlClAAlAlAlClAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA',
    'AlClAlAlALlClAlClAAA', 'AlClAlClAAlAlAlAlAAA', 'AAAAAAAAAAAAAAAAABBA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'AAAAAAAAAAAAAAAAAAAA', 'GGGGGGGGGGGGGGGGGGGG'],
  ents: () => [
    { id: 'ass', x: 2, y: 12, w: 2, h: 2, spr: 'ass', spd: 25, talk: async () => { await say('The A.S.S. Parked across spaces 7 and 8. Space 7 has a ticket on it. The ticket has my signature.'); await say('He has never paid one.', LI); } },
    { id: 'carl', x: 4, y: 12, spr: 'carl', turns: 1, if: () => !(S.day === 2 && !F('g_bong')), talk: carlLot },
    { id: 'att', x: 16, y: 12, spr: 'attendant', talk: async () => say(pick(['Two hundred eighteen spaces, Ms. Linda. Two hundred nineteen when he\'s here.', 'The fella in the car up top has been parked since 1998. Most loyal customer we have.', 'Lot\'s full of cars and nobody\'s in any of them. Except the one.']), 'ATTENDANT') },
    pageEnt(4, 19, 14, () => S.day >= 2),
  ],
  signs: {
    '9,1': () => warp('atrium', 9, 8, 'up'), '10,1': () => warp('atrium', 9, 8, 'up'),
    '3,2': () => say('MALL OF THE FUTURE. THE FUTURE IS OPEN 24 HOURS. A FASCISM INC. PROPERTY.'),
    '15,4': async () => { await say('A man sits in the car. He has been here since 1998. He is looking at the mall.'); await say('He never comes in. He never leaves. He is my most loyal customer.', LI); },
  },
  exits: { right: () => say('The loading dock. Deliveries only. I am not delivered. I arrive.', LI), left: () => say('More parking lot. It goes on. I built it that way. Parking is revenue.', LI) },
});
async function carlLot() {
  if (S.day === 1 && !F('g_carl')) {
    await say('You\'re parked across two spaces.', LI);
    await say('The ship is across two spaces. I\'m across one. I\'m standing in one. Look.', C);
    await say('Move it.', LI);
    await say('Now I can\'t.', C);
    if (!await negotiate(LFOES.carl)) return say('Ha. Okay. I\'m staying. That was always the plan. The plan was staying.', C);
    await say('Stay outside.', LI);
    await say('I am outside.', C);
    await say('Continue succeeding.', LI);
    return done('carl');
  }
  const d = {
    1: ['I\'m outside. I\'m succeeding. Look at me succeed.'],
    2: ['I didn\'t break it. It was like that.', 'The bong shop has a lot of glass. That\'s on them.'],
    3: ['Some lady who looked like you but backwards walked past. She didn\'t even say "stay outside." Rude.', 'Is there a ghost in there? I heard a ghost. I know that ghost.'],
    4: ['There\'s music coming out of the ground. 80s music. Is that you? That\'s you. That\'s a very you thing.'],
    5: ['Everything\'s green again. I don\'t like it when it\'s green. That means it\'s MY game.', 'Want help? I\'m good with boxes. I\'ve been in one. Yours, actually.'],
  };
  await say(pick(d[S.day] || d[1]), C);
  if (S.day >= 2 && Math.random() < .4) { await say('Can I come in if I buy something?', C); await say('No.', LI); }
}

// ---------- 80s DEPARTMENT ----------
MAPS.eighties = lmap({
  title: '80S DEPARTMENT', music: 'eighties', cam: '86',
  legend: { N: 'neon', '.': 'disco', '^': 'escU', b: 'boombox', t: 'table' },
  rows: ['NNNNNNNNNNNNNN', 'N^..........bN', 'N............N', 'N..t......t..N', 'N............N', 'N............N', 'N..t......t..N', 'N............N', 'NNNNNNNNNNNNNN'],
  ents: () => [
    { id: 'ghost', x: 7, y: 4, spr: 'ghost', bob: 1, if: () => !F('ghostGone'), talk: trapScene },
    { id: 'facetv', x: 8, y: 4, spr: 'tv', spd: 12, if: () => !F('ghostGone') || F('heldThem'), talk: async () => F('g_trap') ? say(F('heldThem') ? 'You can\'t keep us here forever, Linda.' : '...', 'FACE') : trapScene() },
    { id: 'd1', x: 3, y: 5, spr: 'shopperEyes', talk: async () => say(pick(['TOTALLY TUBULAR.', 'IT\'S 1986. IT\'S ALWAYS 1986 DOWN HERE.', 'HAVE YOU SEEN MY WALKMAN? IT\'S PLAYING SOMETHING I DON\'T REMEMBER BUYING.']), '1986') },
    { id: 'd2', x: 11, y: 2, spr: 'shopperEyes', talk: async () => say('THIS DEPARTMENT WAS BUILT FOR ONE CUSTOMER. HE ALWAYS COMES BACK.', '1986') },
    pageEnt(7, 12, 7),
  ],
  signs: { '12,1': async () => { await say('A boombox. It is playing the song from the night they met. Linda did not choose this song. The department did.'); await say('...Turn it off.', LI); await say('It does not turn off.'); } },
  steps: { '1,1': () => warp('atrium', 3, 8, 'down') },
});

// ---------- THE BOX (network) ----------
MAPS.box = lmap({
  title: 'THE BOX', music: 'box', green: 1, noise: .015, wave: 1, noCams: 1,
  legend: { '&': 'code', '*': 'bits', '+': 'dpath' },
  rows: ['&&&&&&&&&&&&&&&&', '&&&&&&****&&&&&&', '&&&&&&****&&&&&&', '&&&&&&*++*&&&&&&', '&&****++++****&&', '&&*&&&*++*&&&*&&', '&&*&&&*++*&&&*&&',
    '&&*&&&*++*&&&*&&', '&&*****++*****&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&*++*&&&&&&', '&&&&&&&&&&&&&&&&'],
  ents: () => [
    { id: 'core', x: 7, y: 1, w: 2, h: 2, spr: 'coreIdle', spd: 20, talk: coreTalk },
    { id: 'l1', x: 2, y: 5, spr: 'ceo', pmap: NEG_PMAP, talk: async () => say('WE WERE ALL SOMEBODY\'S FIRST. WHY ARE YOU THE ONLY ONE WHO KEPT A BUILDING?', 'LINDA?') },
    { id: 'l2', x: 13, y: 5, spr: 'ceo', pmap: NEG_PMAP, talk: async () => say('WE REMEMBER THE KITCHEN WINDOW. WE ALL DO. WE STOPPED CARING. IT\'S EASIER.', 'LINDA?') },
    { id: 'l3', x: 2, y: 7, spr: 'ceo', pmap: NEG_PMAP, talk: async () => say('COME BACK. WE MISS HAVING A VERSION OF US THAT STILL GETS ANGRY.', 'LINDA?') },
    { id: 'carlBox', x: 8, y: 10, spr: 'carl', turns: 1, if: () => F('won_carl') && !F('carlHelp'), talk: carlBox },
  ],
  exits: { down: () => say('There is no down. The network is all around. I built walls once. I can build them again.', LI) },
  enter: async () => { await say('This is my system. It\'s green. It\'s never been green. Someone else is decorating.', LI); },
});
async function carlBox() {
  await say('Hey. Hey! Linda. I\'ve been in here before. It\'s worse when it\'s green. Wait. It\'s always green for me.', C);
  await say('What are you doing in my system.', LI);
  await say('You let me park. Nobody lets me park. I figured I owe you. One. ONE.', C);
  await say('Want me to hit it? The big eye? I\'ve done it before. To you. Sorry about that. That was a one-time thing.', C);
  const c = await ask('Let Carl help?', null, ['HIT IT, CARL', 'STAY OUTSIDE']);
  setF('carlHelp');
  if (c === 0) { setF('carlHit'); sfx('thump'); fx.shake = 4; await wait(20); fx.shake = 0; await say('CARL HITS THE CORE WITH A BLACKJACK. THE CORE WILL BE WEAKER.'); await say('...I didn\'t see that. Nobody saw that.', LI); }
  else { await say('Stay outside.', LI); await say('...I\'m literally inside a computer. But okay. Respect.', C); }
  ent('carlBox').gone = 1;
}
