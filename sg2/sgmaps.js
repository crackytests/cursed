'use strict';
// ================= SPOOKY GHOST 2: the sets. one map per episode, built in code =================
// every map: title, theme, rows, quota (applause for the star door), start [tx, ty], music, ents()
const star = (x, y, o = {}) => Object.assign({ id: 'star', kind: 'door', x, y, label: 'STAR DOOR', t: 0,
  draw: e => { const open = WD.quota && S.applause >= WD.quota, s = SG.door[(WD.t >> 4) & 1], px = e.x - camX - 16, py = e.y - camY - 40; draw(s, px, py, open ? SGP.doorOpen : SGP.door); if (open) for (let i = 0; i < 3; i++) pset(px + 4 + ((WD.t * 3 + i * 11) % 24), py + 4 + ((WD.t + i * 17) % 30), WHITE); },
  talk: () => stageDoor() }, o);
const solidTiles = (b, ch, pts) => { pts.forEach(([x, y]) => b.set(x, y, ch)); return b; };
const P_TOUR = ['AAAH!', 'NOT AGAIN!', 'WHAT WAS THAT?!', 'THE SHEET MOVED!', 'IS THIS THE TOUR?!'];

// ---------------- EPISODE 1: STUDIO 88 (the 80s department, now a soundstage) ----------------
(() => {
  const b = mapBuilder(34, 24);
  b.room(1, 2, 32, 21, '.');
  b.h(1, 9, 11, '#').h(22, 9, 11, '#');                                   // the divider under the dressing nooks
  b.room(2, 3, 9, 6, ',').room(23, 3, 9, 6, ',');                         // lounge (left) and prop room (right)
  b.v(11, 3, 6, '#').v(22, 3, 6, '#'); b.set(11, 5, 'W').set(22, 6, 'W'); // cracks you can float through
  b.room(13, 2, 8, 7, ',');                              // the stage apron
  b.pts('p', [8, 13], [8, 17], [25, 13], [25, 17], [16, 12], [16, 18]);
  b.pts('t', [2, 10], [31, 10], [2, 21], [31, 21], [12, 10], [21, 10]);
  b.pts('=', [13, 3], [20, 3], [13, 8], [20, 8]);
  b.pts('*', [4, 22], [5, 22], [6, 22], [27, 22], [28, 22], [29, 22]);
  b.pts('o', [14, 21], [19, 21], [3, 5], [29, 5]);
  b.pts('_', [9, 20], [10, 20], [23, 20], [24, 20]);
  MAPS.studio88 = {
    title: 'STUDIO 88', theme: 'mall', rows: b.out(), quota: 13, start: [16, 20], music: 'studio',
    ents: () => [
      star(256, 44),
      mark('s1', 6, 14, 'shopper', { lines: ['MY LEG WARMERS!', 'GNARLY!!', 'WHO TURNED THE LIGHTS PINK?'] }),
      mark('s2', 12, 16, 'jock', { lines: ['BRO. BRO. BRO.', 'THAT WAS NOT A SHEET.', 'I SPILLED MY PROTEIN.'] }),
      mark('s3', 19, 14, 'tourist', { lines: P_TOUR }),
      mark('s4', 27, 15, 'teen', { lines: ['TUBULAR?!', 'MY WALKMAN!', 'IT\'S THE GHOST FROM TV!'] }),
      mark('s5', 22, 19, 'yuppie', { lines: ['MY STOCK!', 'MY CAR PHONE!', 'IT\'S A MERGER!'] }),
      mark('s6', 15, 6, 'dancer', { lines: ['I WAS MID-SPIN!', 'REHEARSAL IS CLOSED!', 'ARE YOU THE SEQUEL?'] }),
      mark('s7', 5, 6, 'fan', { lines: ['I\'M YOUR BIGGEST FAN!', 'CAN YOU SIGN MY SHEET?', 'OH NO, IT\'S REAL'], reach: 1 }),
      mark('s8', 28, 6, 'stagehand', { lines: ['WHO LET THE GHOST IN', 'THAT\'S NOT IN THE RUNDOWN', 'UNION BREAK!'], reach: 1 }),
      collector('c1', [[4, 12], [29, 12]], { pause: 50 }),
      collector('c2', [[27, 11], [27, 20], [20, 20], [20, 11]], { pause: 30 }),
      cardEnt(0, 4, 4), cardEnt(1, 30, 4), cardEnt(2, 18, 21),
    ],
  };
})();
