'use strict';
// ================= SPOOKY GHOST — stages =================
const exitDoor = () => stageDoor();
const SCARED = { TOURIST: ['AAAAAH!', 'IT\'S REAL! IT\'S A REAL ONE!', 'I WANT MY MONEY BACK! NO I DON\'T!', 'BEST. TOUR. EVER.'],
  GUEST: ['THE GROOM IS A GHOST?!', 'I KNEW THIS WEDDING WAS HAUNTED!', 'I\'M TELLING THE OTHER WIVES!'],
  TECH: ['THE CHAIR! SOMETHING\'S IN THE CHAIR!', 'THAT\'S NOT FACE! THAT\'S NOT FACE!', 'I\'M GOING ON BREAK. FOREVER.'],
  SHOPPER: ['THE MALL IS HAUNTED! THE MALL IS HAUNTED!', 'I DROPPED MY PRETZEL!', 'IS THIS A PROMOTION?!'],
  DANCER: ['TOTALLY BOGUS!', 'GRODY TO THE MAX!', 'THAT\'S NOT A COSTUME!'] };
const m = (id, x, y, who, pmap) => mark(id, x, y, who, SCARED[who], pmap ? { pmap } : {});

// ---------- EP1: THE HOUSE (the set) ----------
MAPS.house = gmap({
  title: 'THE HOUSE', music: 'ghouse', quota: 6, start: [2, 8],
  legend: { W: 'wallp', '%': 'thin', '.': 'wood', ',': 'rug', c: 'candle', p: 'piano', Y: 'sigil', X: 'exitG' },
  rows: ['WWWWWWWWWWWWWWWW', 'Wc...%.....W.cXW', 'W....W,,,,.Y...W', 'W....W,,,,.W...W', 'W....%,,,,.W...W', 'WWW%WW.....WW%WW',
    'W.......p......W', 'W..............W', 'Wc.....,,.....cW', 'W......,,......W', 'WWWWWWWWWWWWWWWW'],
  init() { if (F('sig1')) setTile(11, 2, 'opened'); },
  ents: () => [
    m('t1', 8, 7, 'TOURIST'), m('t2', 3, 2, 'TOURIST', [0, 1, 1, 3]), m('t3', 12, 8, 'TOURIST'), m('t4', 8, 3, 'TOURIST', [0, 2, 1, 3]), m('t5', 13, 3, 'TOURIST', [0, 1, 1, 3]),
    collector('c1', 1, 7, 'RRRRRRRRRRRRR.LLLLLLLLLLLLL.'),
    cardEnt(0, 4, 1), cardEnt(1, 12, 4), cardEnt(2, 14, 9),
  ],
  signs: { '11,2': () => sigilDoor(11, 2, 'sig1', 4), '14,1': exitDoor },
});

// ---------- EP2: THE RECEPTION ----------
MAPS.recep = gmap({
  title: 'THE RECEPTION', music: 'grecep', quota: 8, start: [8, 9],
  legend: { W: 'wallp', '%': 'thin', '.': 'floor', f: 'plant', k: 'cake', b: 'btable', n: 'bench', Y: 'sigil', X: 'exitG' },
  rows: ['WWWWWWWWWWWWWWWWWW', 'Wf...kkk....ff..XW', 'W................W', 'W.b..b..b..b..b..W', 'W................W', 'WW%WWWWW..WWWWW%WW',
    'W.....W....W.....W', 'W.....W.nn.W.....W', 'W.....Y....Y.....W', 'W.....W....W.....W', 'WWWWWWWWWWWWWWWWWW'],
  init() { if (F('sig2a')) setTile(6, 8, 'opened'); if (F('sig2b')) setTile(11, 8, 'opened'); },
  ents: () => [
    { id: 'w1', x: 8, y: 1, spr: 'veil', talk: () => wifeTalk(0) }, { id: 'w2', x: 9, y: 1, spr: 'veil', pmap: [0, 1, 1, 3], talk: () => wifeTalk(1) }, { id: 'w3', x: 10, y: 1, spr: 'veil', pmap: [0, 0, 2, 3], talk: () => wifeTalk(2) },
    { id: 'facetv', x: 9, y: 6, spr: 'tv', spd: 20, talk: () => faceWarn() },
    m('g1', 3, 4, 'GUEST', [0, 0, 2, 3]), m('g2', 10, 4, 'GUEST'), m('g3', 13, 3, 'GUEST', [0, 1, 1, 3]), m('g4', 2, 7, 'GUEST'), m('g5', 15, 7, 'GUEST', [0, 0, 2, 3]),
    collector('c1', 1, 2, 'RRRRRRRRRRRRRRR.LLLLLLLLLLLLLLL.'), collector('c2', 16, 4, 'LLLLLLLLLLLLLLL.RRRRRRRRRRRRRRR.'),
    cardEnt(3, 1, 6), cardEnt(4, 16, 9), cardEnt(5, 12, 4),
  ],
  signs: { '6,8': () => sigilDoor(6, 8, 'sig2a', 4), '11,8': () => sigilDoor(11, 8, 'sig2b', 5), '16,1': exitDoor },
});

// ---------- EP3: FACE'S CHAIR (green: the stream's own reality) ----------
MAPS.chair = gmap({
  title: 'FACE\'S CHAIR', music: 'lab', quota: 8, start: [7, 8], pal: 'dmg',
  legend: { W: 'lwall', '%': 'fthin', '.': 'lfloor', m: 'cons', J: 'fchair', U: 'tube' },
  rows: ['WWWWWWWWWWWWWWWW', 'WmmmW..JJ..WmmmW', 'W...W......W...W', 'W...%......%...W', 'W...W......W...W', 'WW.WWWW..WWWW.WW',
    'W..............W', 'W..U..U..U..U..W', 'W..............W', 'W..............W', 'WWWWWWWWWWWWWWWW'],
  ents: () => [
    m('k1', 2, 2, 'TECH', [0, 1, 1, 3]), m('k2', 13, 2, 'TECH', [0, 1, 1, 3]), m('k3', 3, 6, 'TECH', [0, 1, 1, 3]), m('k4', 12, 8, 'TECH', [0, 1, 1, 3]), m('k5', 7, 3, 'TECH', [0, 1, 1, 3]),
    { id: 'curse', x: 14, y: 9, spr: 'curse', spd: 8, solid: false, always: false, update: e => {
      if (frame % 52) return;
      const far = Math.abs(P.x - e.x) + Math.abs(P.y - e.y) > 5;
      if (far && frame % 104) return; // drifts when you're far, hunts when you're close
      let dx = Math.sign(P.x - e.x), dy = Math.sign(P.y - e.y);
      if (far && Math.random() < .5) { dx = rnd(3) - 1; dy = 0; }
      if (Math.abs(P.x - e.x) > Math.abs(P.y - e.y) || far) e.x = clamp(e.x + dx, 1, M.w - 2); else e.y = clamp(e.y + dy, 1, M.h - 2);
      e.mv = 1; e.speed = 1;
    } },
    cardEnt(6, 2, 3), cardEnt(7, 13, 3), cardEnt(8, 9, 2),
  ],
  tick() { const c = ent('curse'); if (!busy && c && !c.mv && c.x === P.x && c.y === P.y) run(curseTouch); },
  signs: { '7,1': () => chairScene(), '8,1': () => chairScene(), '1,1': () => say('Face\'s consoles. I know what half of these do. I built the other half. Well. I helped.', G) },
});
async function curseTouch() {
  sfx('glitch'); fx.shake = 3; fx.invert = 1; await wait(8); fx.invert = 0; await wait(10); fx.shake = 0;
  await say('THE CURSE PASSES THROUGH YOU. IT IS COLD. IT IS WHAT FACE WOULD HAVE BEEN.');
  await say('That\'s not me. People always think that\'s me. It is NOT me. I\'m the one that worked.', G);
  if (S.applause > 0) { S.applause--; await say('-1 APPLAUSE. THE AUDIENCE FELT THAT.'); }
  const c = ent('curse'); c.x = 14; c.y = 9; c.px = c.x * TS; c.py = c.y * TS; c.mv = 0;
  sfx('phase'); await say('THE CURSE IS FLUNG BACK INTO THE CORNER. IT WILL COME AGAIN.');
}

// ---------- EP4: THE INTERCOM (pink: Linda's mall) ----------
MAPS.intercom = gmap({
  title: 'MALL INTERCOM', music: 'mall', quota: 9, start: [9, 8], pal: 'pink',
  legend: { I: 'iwall', '%': 'ithin', '.': 'floor', O: 'store', E: 'wscreen', Q: 'intercom', p: 'plant', t: 'table', f: 'fount', Y: 'sigil' },
  rows: ['IIIIIIIIIIIIIIIIIIII', 'IOOOOIEIIQQIIEIOOOOI', 'I..................I', 'I.p...t....t...p...I', 'I........ff........I', 'I..................I',
    'III%IIII....IIII%III', 'I.....I......I.....I', 'I..t..Y......Y..t..I', 'I.....I......I.....I', 'IIIIIIIIIIIIIIIIIIII'],
  init() { if (F('sig4a')) setTile(6, 8, 'opened'); if (F('sig4b')) setTile(13, 8, 'opened'); mus.det = -120; mus.wob = 40; mus.rate = .85; },
  ents: () => [
    m('s1', 3, 2, 'SHOPPER', [0, 1, 2, 3]), m('s2', 15, 2, 'SHOPPER'), m('s3', 6, 4, 'SHOPPER', [0, 0, 2, 3]), m('s4', 13, 5, 'SHOPPER'), m('s5', 2, 7, 'SHOPPER', [0, 1, 1, 3]), m('s6', 17, 7, 'SHOPPER'),
    { id: 'cam1', x: 1, y: 2, spr: 'cameraBot', spd: 30, path: 'r.d.', pause: 70, update: patrol, vision: 4 },
    { id: 'cam2', x: 18, y: 5, spr: 'cameraBot', spd: 30, path: 'l.u.', pause: 80, update: patrol, vision: 4, flip: 1 },
    collector('c1', 1, 5, 'RRRRRRRRRRRRRRRRR.LLLLLLLLLLLLLLLLL.'),
    cardEnt(9, 1, 8), cardEnt(10, 18, 8), cardEnt(11, 10, 2),
  ],
  caught: async e => {
    if (e.spr !== 'cameraBot') return served(e);
    sfx('alert'); await emote(e, '!', 30);
    await say('SPOOKY GHOST. YOU ARE AWAY FROM YOUR INTERCOM. RETURN TO YOUR POST.', LI);
    await say('I\'m on a break. Ghosts get breaks. It\'s in the— there\'s no contract. Okay.', G);
    const loss = Math.min(S.applause, 1); S.applause -= loss;
    await fadeOut(3); loadMap('intercom', 9, 8, 'up'); await fadeIn(3);
  },
  signs: { '6,8': () => sigilDoor(6, 8, 'sig4a', 5), '13,8': () => sigilDoor(13, 8, 'sig4b', 5), '9,1': () => intercomScene(), '10,1': () => intercomScene(),
    '6,1': () => say('One of Linda\'s screens. She\'s not on it right now. That\'s worse. That means she\'s watching from somewhere else.', G) },
});

// ---------- EP5: THE 80s DEPARTMENT ----------
MAPS.eighty = gmap({
  title: '80S DEPARTMENT', music: 'eighties', quota: 9, start: [7, 8], pal: 'pink',
  legend: { N: 'neon', '%': 'nthin', '.': 'disco', b: 'boombox', t: 'table', Y: 'sigil' },
  rows: ['NNNNNNNNNNNNNNNN', 'N.b..........b.N', 'N..t........t..N', 'N....NN%NN.....N', 'N....N....N....N', 'N....N.YY.N....N', 'N....NNNNNN....N', 'N..t........t..N', 'N..............N', 'NNNNNNNNNNNNNNNN'],
  ents: () => [
    m('d1', 1, 2, 'DANCER', [0, 1, 2, 3]), m('d2', 14, 2, 'DANCER'), m('d3', 2, 7, 'DANCER', [0, 0, 2, 3]), m('d4', 13, 7, 'DANCER'), m('d5', 3, 4, 'DANCER', [0, 1, 1, 3]), m('d6', 12, 4, 'DANCER'),
    collector('c1', 1, 8, 'RRRRRRRRRRRRR.LLLLLLLLLLLLL.'), collector('c2', 6, 1, 'RRRR.LLLL.'),
    { id: 'linda', x: 6, y: 5, spr: 'ceo', dir: 'right', talk: () => timeDoor() },
    { id: 'face5', x: 9, y: 5, spr: 'tv', spd: 20, talk: () => say('Don\'t look at me. This was your plan first. Mine was just... more.', 'FACE') },
    cardEnt(12, 1, 1), cardEnt(13, 14, 8), cardEnt(14, 6, 4),
  ],
  signs: { '7,5': () => timeDoor(), '8,5': () => timeDoor(), '2,1': () => say('A boombox. It\'s playing the song from the night I met her. I didn\'t choose that. The department did.', G), '13,1': () => say('Another boombox. Same song. It\'s a department-wide decision.', G) },
});

// ---------- CUTSCENE SETS ----------
MAPS.cage = gmap({
  music: 'box', quota: 0, start: [7, 7], pal: 'dmg', hud: false, noise: .015, wave: 1,
  legend: { '&': 'code', '*': 'bits', '+': 'dpath' },
  rows: ['&&&&&&&&&&&&&&&&', '&&&&&&****&&&&&&', '&&&&&&****&&&&&&', '&&&&&&*++*&&&&&&', '&&****++++****&&', '&&*&&&*++*&&&*&&', '&&*&&&*++*&&&*&&', '&&*&&&*++*&&&*&&', '&&*****++*****&&', '&&&&&&&&&&&&&&&&'],
  ents: () => [
    { id: 'core', x: 7, y: 1, w: 2, h: 2, spr: 'coreIdle', spd: 20 },
    { id: 'cage', x: 2, y: 5, spr: 'cage', if: () => !F('ep4open') },
    { id: 'carl', x: 7, y: 8, spr: 'carl', dir: 'up' },
  ],
});
MAPS.ass = gmap({
  music: null, quota: 0, start: [4, 3], pal: 'dmg', hud: false,
  legend: { H: 'hull', w: 'win', k: 'cons', _: 'grate', z: 'couch', j: 'junk', h: 'hatchIn' },
  rows: ['HHHHHHHHHH', 'HwwwwwwwwH', 'Hkkk__kkkH', 'H________H', 'Hzz_____jH', 'H________H', 'HHHHhHHHHH'],
  ents: () => [{ id: 'carl', x: 5, y: 3, spr: 'carl', dir: 'left' }, { id: 'case', x: 5, y: 2, spr: 'parcel', if: () => !F('caseOpen') }],
});
