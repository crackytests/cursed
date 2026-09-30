'use strict';
// ================= TOWEL QUEST — the game he kept not starting =================
const TQL = { W: 'bwall', '.': 'btile', ',': 'bmat', u: 'tub', s: 'sink', D: 'tqopen', L: 'tqdoor', R: 'rack', V: 'tvset' };
MAPS.tq1 = { title: 'TOWEL QUEST', music: 'tq', legend: TQL,
  rows: ['WWWWWWWWWW', 'Wu......sW', 'W........W', 'W...,,...D', 'W...,,...W', 'W........W', 'WWWWWWWWWW'],
  init() { fx.pal = 'dmg'; },
  ents: () => [{ id: 'cloth', x: 4, y: 2, spr: 'washcloth', talk: async () => {
    if (!F('quest')) {
      setF('quest');
      await say('YOUNG TOWEL. THE TOWEL RACK AWAITS AT THE END OF THE WORLD.', 'OLD WASHCLOTH');
      await say('IT IS TWO ROOMS AWAY. THE WORLD IS SMALL.', 'OLD WASHCLOTH');
      return say('That\'s the whole plot. I told you. No production.', TPN);
    }
    await say(pick(['BEWARE THE SOAP. IT IS SLIPPERY. THAT IS ITS WHOLE THING.', 'THE KEY IS UNDER SOMETHING. EVERYTHING IS UNDER SOMETHING.', 'GO, YOUNG TOWEL. I AM TOO DAMP FOR ADVENTURE.']), 'OLD WASHCLOTH');
  } }],
  steps: { '9,3': () => warp('tq2', 1, 2, 'right') },
};
MAPS.tq2 = { title: 'THE HALLWAY', music: 'tq', legend: TQL,
  rows: ['WWWWWWWWWWWW', 'W..........W', 'D..........L', 'W....,.....W', 'W..........W', 'WWWWWWWWWWWW'],
  init() { fx.pal = 'dmg'; if (F('open')) setTile(11, 2, 'tqopen'); },
  ents: () => [{ id: 'soap', x: 7, y: 1, spr: 'soap', path: 'DDD.UUU.', pause: 40, vision: 2, update: patrol, talk: async () => say('HI. I AM SOAP. I AM VERY SLIPPERY. IT IS MY WHOLE THING.', 'SOAP') }],
  signs: {
    '5,3': async () => {
      if (has('RUBBER DUCK')) return say('Just a bath mat now. You took the duck. The mat misses the duck.', TPN);
      await say('UNDER THE BATH MAT: A RUBBER DUCK.'); S.items.push('RUBBER DUCK'); sfx('get');
      await say('That\'s the key. The duck is the key. Don\'t ask me how. I didn\'t think about it that hard.', TPN);
    },
    '11,2': async () => {
      if (F('open')) return;
      if (!has('RUBBER DUCK')) return say('LOCKED. THE KEYHOLE IS DUCK-SHAPED.');
      sfx('door'); setTile(11, 2, 'tqopen'); setF('open');
      await say('THE DUCK FITS THE LOCK. SOMEHOW.');
    },
  },
  steps: { '0,2': () => warp('tq1', 8, 3, 'left'), '11,2': () => warp('tq3', 3, 5, 'up') },
  caught: async e => {
    sfx('alert'); await emote(e, '!', 30);
    await say('YOU SLIPPED ON THE SOAP.'); await say('Classic soap. Get up. You\'re fine. You\'re a towel. You absorb it.', TPN);
    await fadeOut(3); loadMap('tq2', 1, 2, 'right'); await fadeIn(3);
  },
  enter: async () => {
    if (F('interrupt')) return;
    setF('interrupt'); await wait(30);
    await say('Hold on.', TPN);
    await say('Quick thing. You were about to ask for a square. I could tell.', TPN);
    if (await ask('...', TPN, ['I WASN\'T', 'ONE SQUARE?']) === 1) {
      await say('In MY game? While you\'re a TOWEL? Bold.', TPN); hitFx(true); await wait(30);
      await say('Are you okay? Keep playing. You\'re doing great. Your vision will come back.', TPN); clearFx(); fx.pal = 'dmg';
    } else await say('Okay. Good. Carry on. You\'re doing great.', TPN);
  },
};
MAPS.tq3 = { title: 'THE END OF THE WORLD', music: 'tq', legend: TQL,
  rows: ['WWWWWWWW', 'W..R...W', 'W......W', 'W.....VW', 'W......W', 'W......W', 'WWWWWWWW'],
  init() { fx.pal = 'dmg'; },
  signs: {
    '3,1': throwTowel,
    '6,3': async () => { await say('IT\'S THE STREAM. THERE\'S A TOILET PAPER ROLL ON IT. HE\'S LOOKING AT YOU.'); await say('Don\'t think about it. I\'m on the TV. I\'m also here. I\'m also— don\'t think about it.', TPN); },
  },
  enter: async () => { await say('This is it. The end of the world. It\'s a towel rack. I told you. Simple.', TPN); },
};
async function startQuest() {
  QUEST_ON = true;
  await say('Okay. Towel Quest. I made this. It took an hour. Maybe less.', TPN);
  await fadeOut(4);
  music(null); clearFx(); scene = { draw() { cls(0); } }; fx.fade = 0; fx.pal = 'dmg';
  await showCard(['TOWEL QUEST'], 100);
  S = { map: 'tq1', x: 2, y: 4, dir: 'down', flags: {}, items: [], time: 0, haze: 0, steps: 0 };
  P.spr = 'towel'; P.hidden = false;
  scene = worldScene; loadMap('tq1', 2, 4, 'down');
  await fadeIn(4);
  await say('(TP, OVER THE GAME) This is the game. You\'re a towel. Walk around. Talk to the washcloth. START goes back to the stream.', TPN);
}
async function startMenu() {
  if (!QUEST_ON) return;
  if (await choose(['KEEP PLAYING', 'BACK TO THE STREAM'], { cancel: 1 }) !== 1) return;
  await say('Oh thank god. Yeah. Let\'s just hang out.', TPN);
  await fadeOut(4); await hangoutEnter(); await fadeIn(4);
}
async function throwTowel() {
  await say('THE TOWEL RACK. THE END OF TOWEL QUEST.');
  if (await ask('THROW IN THE TOWEL?', null, ['THROW IT', 'KEEP GOING']) !== 0) return say('There\'s nothing else. I didn\'t make anything else. That was the point.', TPN);
  sfx('door'); P.hidden = true; setTile(3, 1, 'rack');
  TILES.rack.f = [TILES.rack.f[1]];
  await wait(40); sfx('get');
  await say('YOU THREW IN THE TOWEL.');
  await say('You did it. You played the game. It was bad. I made it in like an hour.', TPN);
  await wait(40);
  await say('...Thanks for playing it. For real.', TPN);
  await tcredits('played');
}
async function tcredits(kind) {
  QUEST_ON = false; await fadeOut(6);
  music('hang'); clearFx(); fx.pal = 'tp'; P.hidden = false;
  const last = TPM.msgs.length ? wrap('"' + TPM.msgs[TPM.msgs.length - 1].toUpperCase() + '"', 22) : [];
  const L = ['TP', 'THROWING IN THE TOWEL', '', '', 'TP', '...HIMSELF (NOT HIMSELF)', '', 'CHAT', '...YOU', '', 'THE PEOPLE AT HOME', '...WERE THERE', '',
    ...(last.length ? ['YOU TOLD THEM', ...last, ''] : []),
    'TOWEL QUEST', kind === 'played' ? '...WAS PLAYED' : '...WAITED', '', 'THE BAT', '...A PROP', '', 'THE PRODUCTION', '...CANCELLED', '', '',
    'A PRETEND CO. NIGHT OFF', '(C)2001', '', '', 'THANKS FOR HANGING OUT.', 'THIS WAS STUPID.', 'I HAD A GOOD TIME.'];
  let y = H + 10;
  scene = { draw() { cls(3); L.forEach((l, i) => { const yy = y + i * 12; if (yy > -8 && yy < H) ctext(l, yy, l === 'TP' || l === 'CHAT' ? 0 : 1); }); bigblit(ROLL.n, 132, 104, .5); } };
  fx.fade = 0;
  while (y > -L.length * 12 + 60) { y -= .5; await nextFrame(); }
  await wait(200);
  TPM.done = (TPM.done || 0) + 1; TPM[kind] = 1; saveM();
  await fadeOut(8); ttitle(); await fadeIn(4);
}

// ================= START =================
boot();
