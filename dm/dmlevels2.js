'use strict';
// ================= DARK MONDAY: disk 2. levels 3 and 4 =================

// ---------- level 3: THE SERVER CRYPT (24x24) ----------
// Every class-specific gate here (the glyph vault, the secret wall, the dark wing, the console shortcut) is optional or has a way round it for any party.
LEVEL_MAKERS[3] = () => {
  const b = grid(24, 24);
  b.room(1, 1, 4, 3).set(1, 1, '<');                          // arrival x1-4, y1-3
  b.hall(5, 2, 10, 2); b.room(11, 1, 6, 6);                   // the nave x11-16, y1-6
  b.hall(13, 7, 13, 10); b.room(10, 11, 8, 4);                // the hub x10-17, y11-14
  b.hall(9, 12, 6, 12); b.room(1, 10, 5, 6);                  // west wing: the console room x1-5, y10-15
  b.set(3, 16, 'D'); b.room(2, 17, 3, 2);                     // the vault under it, sealed until the console says so
  b.hall(18, 12, 19, 12); b.room(20, 9, 3, 7);                // east wing: the dark wing x20-22, y9-15
  b.set(22, 9, 'T').set(22, 15, 'T');                         // two teleporters
  b.set(17, 3, 'S'); b.hall(18, 3, 19, 3); b.room(20, 1, 3, 3); // a gray alcove behind a secret wall
  b.set(7, 3, 'D'); b.room(6, 4, 3, 2);                       // a glyph vault off the long hall
  b.set(13, 15, 'D'); b.hall(13, 16, 13, 17); b.room(9, 18, 9, 5); // the Collector's office x9-17, y18-22
  b.set(18, 20, 'D'); b.hall(19, 20, 21, 20); b.set(21, 20, '>');
  b.sign(0, 11, 'E', 'ACCESS CODE: THE DAY. - SYSADMIN', 'SIGN');
  b.sign(0, 13, 'E', 'TODAY IS: MONDAY. (IT HAS BEEN MONDAY FOR FORTY-ONE THOUSAND DAYS. THE CALENDAR HAS GIVEN UP.)', 'SIGN');
  b.sign(2, 9, 'S', 'DO NOT TRY TUESDAY. TUESDAY IS A MYTH AND THE CONSOLE WILL SHOCK YOU FOR IT.', 'SIGN');
  b.sign(14, 0, 'S', 'THE SERVER CRYPT. EVERY DEBT THE TEMPLE HOLDS IS KEPT HERE, COOLED. - FACILITIES', 'SIGN');
  b.sign(21, 0, 'S', 'BARGAIN BIN. A COMPETING PRODUCT. SAME GAME, BUT YOU THROW A TOWEL. NO REFUNDS. TAKE A TOWEL. - THE MANAGEMENT', 'TP');
  b.sign(13, 23, 'N', 'COLLECTIONS. ALL PAYMENTS ARE FINAL. ALL FINALS ARE PAYMENTS.', 'SIGN');
  b.dec(0, 12, 'E', 'console'); b.dec(8, 3, 'N', 'rune');
  const rows = b.out(), open = (x, y) => '.pOT<>D'.includes((rows[y] || '')[x] || '#');
  const DXY = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  for (const [x, y, f] of [[3, 0, 'S'], [8, 1, 'S'], [12, 0, 'S'], [16, 0, 'S'], [10, 6, 'E'], [17, 5, 'W'], [12, 10, 'E'], [14, 10, 'W'], [10, 10, 'S'], [17, 10, 'S'], [0, 15, 'E'], [5, 9, 'S'], [19, 11, 'S'], [19, 13, 'N'], [12, 17, 'E'], [14, 17, 'W'], [9, 23, 'N'], [17, 23, 'N'], [22, 17, 'N']]) {
    const [dx, dy] = DXY[f]; if ('#S'.includes(rows[y][x]) && open(x + dx, y + dy) && !b.dec_[x + ',' + y + ',' + f]) b.dec(x, y, f, 'torch'); }
  return mkLevel({ name: 'THE SERVER CRYPT', theme: 'crypt', music: 'crypt', disk: 2, start: [2, 2, 1], rows, decor: b.dec_, text: b.text_, locks: { '13,15': 'KEY_ICE' }, sealed: ['3,16', '7,3', '18,20'], optional: ['7,3'], darkZones: [[19, 9, 22, 15]],
    tele: { '22,9': [17, 13, 3], '22,15': [20, 9, 1] },
    loot: [['PROP_PILLS', 12, 5], ['BIG_PILLS', 16, 5], ['RATION', 8, 2], ['LASAGNA', 2, 11], ['BIG_PILLS', 5, 15], ['KEY_ICE', 3, 18], ['BIG_PILLS', 2, 17], ['AMULET_PHONE', 4, 18], ['PLASMA_AXE', 22, 12], ['BIG_PILLS', 21, 14], ['LASAGNA', 20, 10], ['PLATE_GLASS', 7, 5], ['BOOTS_HOVER', 6, 4], ['BIG_PILLS', 8, 5], ['TOWEL', 21, 2], ['CHIP_BONG', 22, 2], ['LASAGNA', 11, 11], ['BIG_PILLS', 10, 14]],
    mons: [['MANAGER', 13, 4], ['INTERN', 12, 2], ['INTERN', 15, 2], ['SPIDER', 8, 2], ['COLLECTOR', 10, 13, [[10, 13], [17, 13]]], ['MANAGER', 3, 12], ['SPIDER', 4, 14], ['SPIDER', 21, 11], ['SPIDER', 21, 13], ['INTERN', 20, 10],
      ['PRIME', 13, 21, null, { wakeOnly: 1, die: { door: { '18,20': 1 }, give: 'IOU_3', sfx: 'door', msg: 'A DOOR SLIDES OPEN ON THE EAST WALL.', scene: 'primedown' } }]],
    trig: {
      touch: { '0,12,E': { scene: 'console', opens: { '3,16': 1 } } },
      translate: { '8,3,N': { door: { '7,3': 1 }, msg: 'THE GLYPH RESOLVES. A DOOR UNLATCHES IN THE WALL.', sfx: 'door' } },
      step: { '2,2': { banter: 'l3_start', once: 1 }, '6,12': { banter: 'l3_console', once: 1 }, '19,12': { banter: 'l3_dark', once: 1 }, '13,16': { scene: 'prime', once: 1, wake: 'PRIME' }, '20,20': { banter: 'l3_after', once: 1 } } },
    stairs: { '21,20': { to: 4, x: 2, y: 2, dir: 1, disk: 2 } } });
};

// ---------- level 4: THE SANCTUM (20x20) ----------
LEVEL_MAKERS[4] = () => {
  const b = grid(20, 20);
  b.room(1, 1, 3, 3).set(1, 1, '<');                          // arrival x1-3, y1-3
  b.hall(4, 2, 15, 2).set(7, 3, '.').set(11, 3, '.');         // the road, with two nooks
  b.set(16, 2, 'D'); b.room(17, 1, 2, 12);                    // the memory gate, then the calendar hall x17-18, y1-12
  b.room(9, 13, 10, 6);                                       // the chamber x9-18, y13-18
  b.sign(0, 2, 'E', 'THE ROAD BELOW. NOBODY WALKS IT TWICE. - THE MANAGEMENT', 'SIGN');
  b.sign(16, 1, 'E', 'MONDAY. MONDAY. MONDAY. MONDAY. MONDAY. MONDAY. MONDAY.', 'SIGN');
  b.sign(19, 4, 'W', 'THE CALENDAR HAS THIRTY-ONE SQUARES. EVERY SQUARE SAYS MONDAY. SOME OF THEM HAVE BEEN CROSSED OUT TWICE.', 'SIGN');
  b.sign(19, 9, 'W', 'AT THE BOTTOM OF THE CALENDAR THERE IS A LINE FOR YOUR SIGNATURE. IT IS NOT A SUGGESTION.', 'SIGN');
  const rows = b.out(), open = (x, y) => '.pOT<>D'.includes((rows[y] || '')[x] || '#'), DXY = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  for (const [x, y, f] of [[5, 1, 'S'], [9, 1, 'S'], [13, 1, 'S'], [5, 3, 'N'], [9, 3, 'N'], [13, 3, 'N'], [16, 4, 'E'], [16, 8, 'E'], [16, 12, 'E'], [9, 19, 'N'], [13, 19, 'N'], [17, 19, 'N']]) { const [dx, dy] = DXY[f]; if ('#S'.includes(rows[y][x]) && open(x + dx, y + dy) && !b.dec_[x + ',' + y + ',' + f]) b.dec(x, y, f, f === 'N' && y === 19 ? 'eye' : 'torch'); }
  return mkLevel({ name: 'THE SANCTUM', theme: 'sanctum', music: 'sanctum', disk: 2, start: [2, 2, 1], rows, decor: b.dec_, text: b.text_, sealed: ['16,2'],
    loot: [['BIG_PILLS', 7, 3], ['LASAGNA', 7, 3], ['BIG_PILLS', 11, 3], ['PROP_PILLS', 11, 3], ['RATION', 3, 3], ['BIG_PILLS', 18, 6], ['LASAGNA', 17, 10]],
    mons: [['INTERN', 6, 2], ['INTERN', 10, 2], ['MANAGER', 13, 2], ['COLLECTOR', 5, 2, [[5, 2], [14, 2]]], ['SPIDER', 17, 6], ['SPIDER', 18, 10], ['BEHOLDEN', 13, 16, null, { wakeOnly: 1, die: { scene: 'endCollect' } }]],
    trig: { step: { '2,2': { banter: 'l4_start', once: 1 }, '15,2': { scene: 'memory', once: 1, opens: { '16,2': 1 } }, '17,5': { banter: 'l4_calendar', once: 1 }, '11,3': { scene: 'chatVend', once: 1 }, '17,12': { scene: 'beholden' } } } });
};
resetLevels();
