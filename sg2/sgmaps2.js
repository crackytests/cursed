'use strict';
// ================= SPOOKY GHOST 2: sets for episodes 2-7 =================
const solved = (keys, pts) => () => keys.forEach((k, i) => { if (F(k)) setTile(pts[i][0], pts[i][1], ','); });
// a sealed 2-wide closet behind a crack: walls around x..x+1 / y..y+h-1, crack in the wall at (cx, cy); side = 'l' or 'r' of the closet
function closet(b, x, y, h, side, cy) {
  const wx = side === 'l' ? x + 2 : x - 1;
  b.h(Math.min(x, wx), y - 1, 3, '#').h(Math.min(x, wx), y + h, 3, '#').v(wx, y, h, '#').fill(x, y, 2, h, ',').set(wx, cy, 'W');
}
const standee = (id, tx, ty, who, lines, lab) => ({ id, kind: 'prop', tx, ty, label: who, range: 30, done: () => F('stand_' + id),
  draw: e => { const x = e.x - camX, y = e.y - camY, P = PORT[who]; rectF(x - 26, y - 72, 52, 72, hex('#b6926d')); frameRect(x - 26, y - 72, 52, 72, BLACK); if (P) draw(P.s, x - 24, y - 70, P.P); rectF(x - 26, y - 20, 52, 20, hex('#6d4924')); text(lab, x - lab.length * 3, y - 14, WHITE, 0); },
  talk: async () => { for (const [w, l] of lines) await say(l, w); setF('stand_' + id); } });

// ---------------- EPISODE 2: THE GREEN ROOM ----------------
(() => {
  const b = mapBuilder(34, 24);
  b.room(1, 2, 32, 21, '.');
  b.h(1, 9, 27, '#'); b.v(9, 3, 6, '#').v(10, 3, 6, '#').v(18, 3, 6, '#').v(19, 3, 6, '#').v(27, 3, 6, '#');
  b.room(2, 3, 7, 6, ',').room(11, 3, 7, 6, ',').room(20, 3, 7, 6, ',').room(28, 3, 5, 6, ',');
  b.set(5, 9, 'S').set(14, 9, 'S').set(23, 9, 'S');
  closet(b, 1, 18, 3, 'l', 19); closet(b, 31, 18, 3, 'r', 19);
  b.pts('_', [10, 14], [11, 14], [12, 14], [21, 14], [22, 14], [23, 14], [15, 20], [16, 20], [17, 20]);
  b.pts('t', [2, 10], [32, 10], [2, 15], [8, 21], [25, 21], [14, 11], [19, 11]);
  b.pts('o', [15, 12], [18, 12], [3, 3], [8, 3], [12, 3], [25, 3]);
  b.pts('=', [28, 8], [32, 8], [1, 12], [32, 13]);
  b.pts('*', [13, 22], [20, 22]);
  MAPS.green = {
    title: 'THE GREEN ROOM', theme: 'green', rows: b.out(), quota: 14, start: [16, 21], music: 'green',
    init: solved(['sig0', 'sig1', 'sig2'], [[5, 9], [14, 9], [23, 9]]),
    ents: () => [
      star(488, 42),
      sigDoor('sd0', 5, 9, 'sig0', 4), sigDoor('sd1', 14, 9, 'sig1', 5), sigDoor('sd2', 23, 9, 'sig2', 6),
      { id: 'wife0', kind: 'prop', person: 'wifeA', tx: 5, ty: 5, dir: 'd', label: 'CHOREOGRAPHER', done: () => F('wife0'), talk: () => F('wife0') ? say('Go on. Scare the dancers. They stretch like they\'re afraid of a draft.', 'CHOREOGRAPHER') : wifeTalk(0) },
      { id: 'wife1', kind: 'prop', person: 'wifeB', tx: 14, ty: 5, dir: 'd', label: 'CALL-IN HOST', done: () => F('wife1'), talk: () => F('wife1') ? say('Operators are standing by. Not for you. In general.', 'CALL-IN HOST') : wifeTalk(1) },
      { id: 'wife2', kind: 'prop', person: 'wifeC', tx: 23, ty: 5, dir: 'd', label: 'JUDGE', done: () => F('wife2'), talk: () => F('wife2') ? say('Take your time. I\'ll take notes.', 'JUDGE') : wifeTalk(2) },
      mark('d1', 6, 13, 'dancer', { lines: ['MY HAMSTRING!', 'REHEARSAL IS CLOSED!', 'I WAS MID-STRETCH!'] }),
      mark('d2', 13, 17, 'dancer', { lines: ['SO MUCH ECTOPLASM!', 'WHO LET THE GHOST IN', 'IS THAT A SHEET?'] }),
      mark('d3', 24, 17, 'shopper', { lines: ['MY LEG WARMERS!', 'GNARLY!!', 'THE LIGHTS ARE PINK!'] }),
      mark('d4', 29, 12, 'jock', { lines: ['BRO. BRO. BRO.', 'I SPILLED MY PROTEIN.', 'SPOOKY?! NO WAY!'] }),
      mark('d5', 4, 14, 'teen', { lines: ['TUBULAR?!', 'MY WALKMAN!', 'NOT NOW MOM!'], reach: 1 }),
      mark('d6', 30, 15, 'stagehand', { lines: ['UNION BREAK!', 'NOT IN THE RUNDOWN!', 'WHO LET THE GHOST IN'], reach: 1 }),
      mark('d7', 22, 11, 'yuppie', { lines: ['MY CAR PHONE!', 'IT\'S A MERGER!', 'NOT IN THE CONTRACT!'] }),
      mark('d8', 30, 5, 'fan', { lines: ['I\'M YOUR BIGGEST FAN!', 'SIGN MY SHEET!', 'OH NO, IT\'S REAL'], reach: 1 }),
      collector('c1', [[3, 12], [31, 12]], { pause: 60 }),
      collector('c2', [[26, 20], [26, 14], [20, 14], [20, 20]], { pause: 30 }),
      cardEnt(3, 1, 19), cardEnt(4, 32, 19), cardEnt(5, 16, 17),
    ],
  };
})();

// ---------------- EPISODE 3: THE CONTROL ROOM (lasers, and a director who doesn't know you) ----------------
(() => {
  const b = mapBuilder(36, 26);
  b.room(1, 2, 34, 23, '.');
  b.h(1, 8, 34, '#').fill(16, 8, 4, 1, 'M');                                      // upper gate: the beams are on when the lower ones are off
  b.h(1, 16, 34, '#').fill(7, 16, 3, 1, 'L').fill(26, 16, 3, 1, 'M');              // lower gate
  b.room(2, 3, 32, 5, ',');                                                        // the director's booth
  b.h(5, 11, 9, 'T').h(22, 11, 9, 'T');                                          // console rows
  closet(b, 1, 10, 4, 'l', 11); closet(b, 33, 10, 4, 'r', 11);
  b.pts('p', [4, 20], [13, 20], [22, 20], [31, 20], [18, 13], [17, 13]);
  b.pts('t', [2, 24], [33, 24], [2, 18], [33, 18]);
  b.pts('=', [2, 4], [33, 4], [10, 4], [25, 4]);
  b.pts('*', [14, 24], [15, 24], [20, 24], [21, 24]);
  b.pts('_', [5, 22], [6, 22], [29, 22], [30, 22]);
  MAPS.control = {
    title: 'THE CONTROL ROOM', theme: 'control', rows: b.out(), quota: 15, start: [17, 24], music: 'control', lasers: true,
    ents: () => [
      star(288, 42),
      { id: 'face', kind: 'prop', x: 224, y: 4 * 16 + 12, label: 'THE DIRECTOR', range: 34, done: () => F('metFace'), talk: () => faceIntro(),
        draw: e => { const x = e.x - camX, y = e.y - camY, P = PORT.FACE; rectF(x - 26, y - 62, 52, 56, hex('#242449')); frameRect(x - 26, y - 62, 52, 56, hex('#24ffdb')); draw(P.s, x - 24, y - 60, P.P); rectF(x - 3, y - 6, 6, 6, hex('#6d6d92')); rectF(x - 12, y - 2, 24, 2, hex('#6d6d92')); if ((WD.t >> 4) & 1) rectF(x + 18, y - 58, 4, 4, hex('#ff24db')); } },
      mark('t1', 6, 12, 'tech', { still: 1, turn: ['u'], lines: ['MY SIGNAL!', 'SYNC LOST!', 'WHO TOUCHED THE PATCH BAY?'] }),
      mark('t2', 10, 12, 'tech', { still: 1, turn: ['u'], lines: ['IT\'S IN THE LOG!', 'I SAW A SHEET ON CAM TWO', 'IT\'S NOT IN THE RUNDOWN'] }),
      mark('t3', 24, 12, 'tech', { still: 1, turn: ['u'], lines: ['MY MONITOR!', 'TALLY LIGHT?!', 'CUT TO COMMERCIAL!'] }),
      mark('t4', 29, 12, 'tech', { still: 1, turn: ['u'], lines: ['NOT AGAIN!', 'WHO TURNED ON THE LASERS?!', 'THEY WERE OFF A MINUTE AGO'] }),
      mark('t5', 8, 5, 'stagehand', { lines: ['UNION BREAK!', 'NOT IN THE RUNDOWN!', 'NO ONE\'S ALLOWED IN HERE'], reach: 2 }),
      mark('t6', 30, 5, 'tech', { lines: ['THE DIRECTOR IS GOING TO HEAR ABOUT THIS', 'MY HEADSET!', 'AAAH!'], reach: 2 }),
      mark('t7', 12, 20, 'yuppie', { lines: ['MY LINE ITEM!', 'IT\'S A SYNERGY!', 'NOT IN THE BUDGET!'] }),
      mark('t8', 24, 21, 'fan', { lines: ['I\'M YOUR BIGGEST FAN!', 'ARE YOU FACE?!', 'NO, YOU\'RE THE OTHER ONE'] }),
      mark('t9', 17, 19, 'jock', { lines: ['BRO. BRO. BRO.', 'MY PROTEIN!', 'SPOOKY?!'] }),
      collector('c1', [[3, 19], [32, 19]], { pause: 40 }),
      collector('c2', [[3, 6], [32, 6]], { pause: 40, sp: .5 }),
      cardEnt(6, 1, 11), cardEnt(7, 34, 11), cardEnt(8, 17, 4),
    ],
  };
})();

// ---------------- EPISODE 4: CALL NOW (the shopping channel; turntables carry you) ----------------
(() => {
  const b = mapBuilder(36, 25);
  b.room(1, 2, 34, 22, '.');
  b.room(2, 3, 32, 6, ',');
  b.h(1, 9, 34, '#').fill(15, 9, 4, 1, ',');                                  // the set, open in the middle
  b.h(5, 12, 4, '_').h(12, 12, 4, '_').h(20, 12, 4, '_').h(27, 12, 4, '_');   // the phone desks
  for (let x = 4; x <= 31; x++) { b.set(x, 15, '>'); b.set(x, 17, '<'); b.set(x, 19, '>'); }
  closet(b, 1, 15, 3, 'l', 16); closet(b, 33, 15, 3, 'r', 16);
  b.pts('o', [4, 4], [31, 4], [10, 7], [25, 7], [7, 22], [28, 22]);
  b.pts('=', [2, 3], [33, 3], [2, 23], [33, 23]);
  b.pts('t', [2, 11], [33, 11], [2, 21], [33, 21]);
  b.pts('*', [16, 23], [17, 23], [18, 23]);
  MAPS.shop = {
    title: 'SHOPPING CHANNEL', theme: 'shop', rows: b.out(), quota: 14, start: [17, 22], music: 'shop',
    ents: () => [
      star(288, 42),
      { id: 'host', kind: 'prop', person: 'wifeB', tx: 14, ty: 6, dir: 'd', label: 'CALL-IN HOST', range: 30, done: () => F('hostChat'), talk: () => hostChat() },
      mark('o1', 6, 13, 'operator', { still: 1, turn: ['u'], lines: ['CALL NOW!', 'OPERATORS ARE STANDING BY!', 'I HAD A CALLER!'] }),
      mark('o2', 13, 13, 'operator', { still: 1, turn: ['u'], lines: ['LINE FOUR IS BLINKING!', 'CALL NOW!', 'SIR, YOU\'RE ON AIR'] }),
      mark('o3', 21, 13, 'operator', { still: 1, turn: ['u'], lines: ['PLEASE HOLD!', 'MY HEADSET!', 'THE OPERATORS ARE ALL GHOSTS NOW'] }),
      mark('o4', 28, 13, 'operator', { still: 1, turn: ['u'], lines: ['CALL NOW!', 'THREE EASY PAYMENTS!', 'I\'M ON HOLD WITH MYSELF'] }),
      mark('o5', 8, 6, 'mover', { lines: ['THE PROP TABLE!', 'MY CUE!', 'NOT ON MY SHIFT!'], reach: 2 }),
      mark('o6', 27, 6, 'tech', { lines: ['THAT\'S A LOT OF GHOST!', 'I SAW IT ON MY MONITOR!', 'AAAH!'], reach: 2 }),
      mark('o7', 9, 21, 'shopper', { lines: ['IS IT PINK?', 'I\'LL TAKE TWO!', 'GNARLY!!'], reach: 3 }),
      mark('o8', 24, 21, 'jock', { lines: ['BRO. BRO.', 'SPOOKY?!', 'I GOT THE BUNDLE'], reach: 3 }),
      mark('o9', 17, 16, 'yuppie', { lines: ['MY RETURN POLICY!', 'IT\'S A MERGER!', 'I WANT A MANAGER'], reach: 1 }),
      collector('c1', [[4, 18], [30, 18]], { pause: 30, sp: .55 }),
      collector('c2', [[30, 8], [4, 8]], { pause: 50, sp: .5 }),
      cardEnt(9, 1, 16), cardEnt(10, 34, 16), cardEnt(11, 17, 8),
    ],
  };
})();

// ---------------- EPISODE 5: SPOOKY ALIMONY, LIVE (the courtroom; collectors everywhere) ----------------
(() => {
  const b = mapBuilder(34, 28);
  b.room(1, 2, 32, 25, '.');
  b.room(10, 3, 22, 4, ',').h(13, 6, 8, '_');                                  // the judge's area and bench
  b.room(2, 3, 7, 4, ',').h(1, 7, 9, '#').v(9, 3, 4, '#').set(5, 7, 'S');      // chambers (sigil-locked)
  b.h(22, 10, 8, '=');                                                        // the jury rail
  for (const y of [17, 19, 21]) { b.h(3, y, 7, '_'); b.h(24, y, 7, '_'); }
  closet(b, 1, 13, 3, 'l', 14);
  b.pts('p', [11, 9], [22, 9], [11, 24], [22, 24]);
  b.pts('t', [2, 9], [31, 9], [2, 25], [31, 25]);
  b.pts('o', [14, 9], [19, 9]);
  MAPS.court = {
    title: 'COURTROOM 88', theme: 'court', rows: b.out(), quota: 14, start: [16, 25], music: 'court',
    init: solved(['sig5'], [[5, 7]]),
    ents: () => [
      star(264, 42),
      sigDoor('sd5', 5, 7, 'sig5', 5),
      { id: 'judge', kind: 'prop', person: 'wifeC', tx: 16, ty: 5, dir: 'd', label: 'JUDGE', range: 34, done: () => F('judgeChat'), talk: () => judgeChat() },
      mark('j1', 24, 12, 'juror', { still: 1, turn: ['u'], lines: ['OBJECTION!', 'I\'M ON JURY DUTY!', 'GUILTY OF A SHEET!'] }),
      mark('j2', 26, 12, 'juror', { still: 1, turn: ['u'], lines: ['NOT AGAIN!', 'ORDER IN THE COURT!', 'IS THIS ADMISSIBLE?'] }),
      mark('j3', 28, 12, 'juror', { still: 1, turn: ['u'], lines: ['I NEED A RECESS!', 'OBJECTION!', 'MY COFFEE!'] }),
      mark('j4', 24, 14, 'juror', { still: 1, turn: ['u'], lines: ['WHO IS THAT?!', 'GUILTY!', 'NOT GUILTY! I MEAN BOO!'] }),
      mark('j5', 26, 14, 'juror', { still: 1, turn: ['u'], lines: ['WE WERE DELIBERATING!', 'THE JURY IS ALL GHOSTS NOW', 'AAAH!'] }),
      mark('j6', 28, 14, 'juror', { still: 1, turn: ['u'], lines: ['OBJECTION!', 'MY ALIBI!', 'I WAS HOME WATCHING TV'] }),
      mark('k1', 6, 5, 'clerk', { lines: ['ALL RISE!', 'STRIKE THAT FROM THE RECORD!', 'I\'M ONLY THE CLERK!'], reach: 1 }),
      mark('k2', 24, 5, 'clerk', { lines: ['ORDER! ORDER!', 'THIS IS A BENCH TRIAL!', 'NOT IN THE DOCKET!'], reach: 2 }),
      mark('k3', 14, 22, 'yuppie', { lines: ['MY LAWYER!', 'I OBJECT TO THE SHEET!', 'WE\'LL SETTLE!'], reach: 3 }),
      mark('k4', 20, 22, 'fan', { lines: ['I WATCH THIS EVERY WEEK!', 'IS THIS PART OF THE SHOW?', 'IT\'S THE GHOST!'], reach: 3 }),
      collector('c1', [[3, 22], [30, 22]], { pause: 60, sp: .5, vis: 72 }),
      collector('c2', [[12, 11], [12, 20]], { pause: 70, sp: .5, vis: 72 }),
      collector('c3', [[21, 20], [21, 11]], { pause: 70, sp: .5, vis: 72 }),
      cardEnt(12, 3, 4), cardEnt(13, 1, 14), cardEnt(14, 31, 23),
    ],
  };
})();

// ---------------- EPISODE 6: THE OPEN ROAD (the drive-in) ----------------
(() => {
  const b = mapBuilder(40, 28);
  b.room(1, 2, 38, 25, '.');
  b.h(10, 4, 20, 'T');                                                        // the screen's base
  for (const y of [11, 15, 19]) for (const x of [4, 9, 14, 24, 29, 34]) b.set(x, y, 'c').set(x + 1, y, 'c');
  b.pts('=', [3, 10], [8, 10], [13, 10], [23, 10], [28, 10], [33, 10], [3, 14], [8, 14], [13, 14], [23, 14], [28, 14], [33, 14]);
  b.h(16, 23, 8, '_');                                                        // the concession stand
  b.h(33, 4, 6, '#').h(33, 8, 6, '#').v(33, 4, 5, '#').v(38, 4, 5, '#').fill(34, 5, 4, 3, ',').set(33, 7, 'S'); // the projector booth
  closet(b, 1, 20, 2, 'l', 21);
  b.pts('t', [2, 24], [37, 24], [2, 6], [37, 12]);
  b.pts('p', [19, 8], [20, 8], [17, 14], [22, 14]);
  MAPS.drive = {
    title: 'THE DRIVE-IN', theme: 'road', rows: b.out(), quota: 14, start: [19, 24], music: 'drive',
    init: solved(['sig6'], [[33, 7]]),
    ents: () => [
      { id: 'star', kind: 'door', x: 320, y: 86, label: 'THE SCREEN', t: 0, range: 44,
        draw: () => { const x = 160 - camX, y = 16 - camY, open = WD.quota && S.applause >= WD.quota && F('projector'); rectF(x, y, 320, 56, hex('#242424')); rectF(x + 4, y + 4, 312, 48, open ? hex((WD.t >> 3) & 1 ? '#ffffdb' : '#dbdbb6') : hex('#6d6d6d')); if (open) text('PLAY', x + 140, y + 22, hex('#242424'), 0, 2); else text('NO SIGNAL', x + 130, y + 24, hex('#494949'), 0); },
        talk: () => stageDoor() },
      sigDoor('sd6', 33, 7, 'sig6', 6),
      { id: 'proj', kind: 'prop', tx: 36, ty: 7, label: 'PROJECTOR', range: 28, done: () => F('projector'), talk: () => projector(), draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 8, y - 14, 16, 14, hex('#6d6d92')); rectF(x - 12, y - 10, 8, 6, hex('#24dbff')); rectF(x + 4, y - 18, 3, 4, hex('#ff24db')); if ((WD.t >> 3) & 1) rectF(x - 20, y - 8, 10, 2, hex('#ffff92')); } },
      mark('v1', 4, 11, 'teen', { still: 1, turn: ['u'], lines: ['MY MOVIE!', 'SHHH!!', 'IT\'S THE GHOST FROM THE SCREEN!'] }),
      mark('v2', 9, 11, 'jock', { still: 1, turn: ['u'], lines: ['BRO. I\'M WATCHING.', 'NOT DURING THE PREVIEWS!', 'MY NACHOS!'] }),
      mark('v3', 14, 11, 'shopper', { still: 1, turn: ['u'], lines: ['I PAID FOR A DOUBLE FEATURE!', 'WHO\'S THAT?!', 'GNARLY!!'] }),
      mark('v4', 24, 15, 'tourist', { still: 1, turn: ['u'], lines: ['IS THIS PART OF THE FILM?', 'NOT AGAIN!', 'I SAW A SHEET'] }),
      mark('v5', 29, 15, 'dancer', { still: 1, turn: ['u'], lines: ['MY POPCORN!', 'I WAS HAVING A MOMENT!', 'AAAH!'] }),
      mark('v6', 34, 15, 'yuppie', { still: 1, turn: ['u'], lines: ['I\'M ON THE PHONE!', 'DO YOU MIND?!', 'MY CAR PHONE!'] }),
      mark('v7', 4, 19, 'fan', { still: 1, turn: ['u'], lines: ['I\'M YOUR BIGGEST FAN!', 'THE ROAD SHOW!', 'OH NO, IT\'S REAL'] }),
      mark('v8', 24, 19, 'juror', { still: 1, turn: ['u'], lines: ['I HAVEN\'T BEEN HERE SINCE \'74!', 'THE PICTURE IS FINE!', 'AAH!'] }),
      mark('v9', 34, 19, 'teen', { still: 1, turn: ['u'], lines: ['TUBULAR?!', 'GET OUT OF MY FRAME!', 'NOT NOW!'] }),
      mark('v10', 20, 22, 'stagehand', { lines: ['THE PROJECTOR\'S OUT!', 'I\'M THE USHER!', 'IT\'S A DRIVE-IN, NOT A WALK-IN'], reach: 3 }),
      collector('c1', [[2, 13], [37, 13]], { pause: 60 }),
      collector('c2', [[37, 17], [2, 17]], { pause: 60 }),
      cardEnt(15, 1, 20), cardEnt(16, 34, 5), cardEnt(17, 19, 22),
    ],
  };
})();

// ---------------- EPISODE 7: THE DEPARTMENT, AFTER HOURS ----------------
(() => {
  const b = mapBuilder(30, 20);
  b.room(1, 2, 28, 17, '.');
  b.room(8, 5, 14, 9, ',');
  b.pts('t', [2, 3], [27, 3], [2, 17], [27, 17], [7, 4], [22, 4], [7, 14], [22, 14]);
  b.pts('=', [8, 4], [21, 4]);
  b.pts('o', [4, 6], [25, 6], [4, 13], [25, 13]);
  b.pts('*', [13, 17], [14, 17], [15, 17], [16, 17]);
  MAPS.dept = {
    title: 'THE 80S FLOOR', theme: 'dept', rows: b.out(), quota: 0, start: [14, 16], music: 'dept',
    ents: () => [
      { id: 'star', kind: 'door', x: 232, y: 118, label: 'THE FLOOR', t: 0, range: 34, draw: e => { const x = e.x - camX, y = e.y - camY, k = (WD.t >> 3) & 3; for (let i = 0; i < 4; i++) circF(x, y - 4, 30 - i * 6, hex(['#ff24db', '#24dbff', '#ffdb24', '#6dff24'][(i + k) & 3])); circF(x, y - 4, 8, hex('#ffffff')); }, talk: () => stageDoor() },
      standee('stPatty', 4, 9, 'PATTY', [['PATTY', 'Six a.m. Somebody moves first. It won\'t be the standee.']], 'PATTY'),
      standee('stExes', 7, 16, 'CHOREOGRAPHER', [['CHOREOGRAPHER', 'It\'s a standee. I\'d never be seen in cardboard. They tried me in a smaller size.']], 'CHOREO'),
      standee('stHost', 25, 9, 'CALL-IN HOST', [['CALL-IN HOST', 'Call now. This is a cardboard standee. It doesn\'t pick up either.']], 'HOST'),
      standee('stJudge', 22, 16, 'JUDGE', [['JUDGE', 'Let the record show: this is a standee. The record is lying.']], 'JUDGE'),
      standee('stFace', 14, 4, 'FACE', [['DIRECTOR', 'Cardboard standee of the Director. Please do not take my picture. I am not here.']], 'FACE'),
    ],
  };
})();
