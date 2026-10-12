'use strict';
// ================= DARK MONDAY: levels =================
// rows: '#' wall block, '.' floor, 'D' door (cell slab), 'P' pit, 'p' plate, '>' stairs down, '<' stairs up, 'T' teleporter, 'O' spinner, 'S' secret wall (looks like wall)
// decor: 'x,y,N|E|S|W' on the wall block (x,y), the face looking toward that side: { k: kind }
// trig:  { lever: {'x,y,F': act}, plate: {'x,y': act}, step: {'x,y': act}, touch: {...} } where act is declarative (see fireTrig in dmmain.js)
// Level state lives in the level object, so every new game rebuilds them from LEVEL_MAKERS.
const LEVELS = {}, LEVEL_MAKERS = {};
function mkLevel(o) {
  o.mobs = (o.mons || []).map(([t, x, y, path, ex]) => mkMob(t, x, y, path, ex)); o.h = o.rows.length; o.w = o.rows[0].length;
  o.npcs = (o.npcs || []).map(([id, x, y]) => ({ id, x, y })); o.items = (o.loot || []).map(([id, x, y]) => ({ id, x, y })); o.ev = o.ev || {}; o.text = o.text || {}; o.decor = o.decor || {};
  o.trig = Object.assign({ lever: {}, plate: {}, step: {}, touch: {}, translate: {} }, o.trig || {});
  o.st = { door: {}, dec: {}, mark: {} };
  for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) if (o.rows[y][x] === 'D') { const k = x + ',' + y; o.st.door[k] = { open: 0, locked: (o.locks || {})[k] || ((o.sealed || []).includes(k) ? 'TRIG' : 0) }; }
  return o;
}
// a little map builder: carve rooms and halls out of solid rock
function grid(w, h) {
  const g = Array.from({ length: h }, () => Array(w).fill('#')), dec = {}, text = {};
  const B = {
    room(x, y, rw, rh) { for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) g[j][i] = '.'; return B; },
    hall(x1, y1, x2, y2) { const sx = Math.sign(x2 - x1), sy = Math.sign(y2 - y1); let x = x1, y = y1; g[y][x] = '.'; while (x !== x2) { x += sx; g[y][x] = '.'; } while (y !== y2) { y += sy; g[y][x] = '.'; } return B; },
    set(x, y, ch) { g[y][x] = ch; return B; },
    pits(x1, y1, x2, y2) { for (let j = y1; j <= y2; j++) for (let i = x1; i <= x2; i++) g[j][i] = 'P'; return B; },
    dec(x, y, f, k, o) { dec[x + ',' + y + ',' + f] = Object.assign({ k }, o || {}); return B; },
    sign(x, y, f, t, who) { dec[x + ',' + y + ',' + f] = { k: 'sign', who }; text[x + ',' + y + ',' + f] = t; return B; },
    out() { return g.map(r => r.join('')); }, dec_: dec, text_: text,
  };
  return B;
}

// ---------- level 0: the old test maze (kept for the test suites) ----------
LEVEL_MAKERS[0] = () => mkLevel({ name: 'TEST CELLAR', theme: 'cellar', start: [2, 8, 1], loot: [['PROP_PILLS', 3, 8], ['LASAGNA', 3, 7], ['KEY_RUST', 5, 8]], locks: { '10,9': 'KEY_RUST' }, mons: [['INTERN', 6, 8], ['INTERN', 10, 6], ['SPIDER', 12, 7], ['INTERN', 3, 4]], rows: [
  '####################',
  '#........#.........#',
  '#.######.#.#######.#',
  '#.#....#.#.#.....#.#',
  '#.#.##.#...#.###.#.#',
  '#.#.#..#####.#...#.#',
  '#.#.#.P......#.###.#',
  '#.#.###.####.#.....#',
  '#...#...#..#.######.',
  '#####.###.D.#......#',
  '#...#.....#.#.####.#',
  '#.#.#####.#...#..#.#',
  '#.#.....#.#####.##.#',
  '#.#####.#.......#..#',
  '#.......#########..#',
  '####################'], decor: {
  '3,8,N': { k: 'torch' }, '3,6,S': { k: 'torch' }, '6,8,W': { k: 'lever' }, '8,9,N': { k: 'rune' }, '9,8,W': { k: 'sign' }, '10,8,E': { k: 'niche' } } });

// ---------- level 1: GARF'S CELLAR (18x18) ----------
LEVEL_MAKERS[1] = () => {
  const b = grid(18, 18);
  b.room(1, 1, 4, 4).set(1, 1, '<');                         // arrival hall x1-4, y1-4
  b.hall(5, 2, 12, 2).set(5, 2, 'D');                        // a door, then the long hall east
  b.hall(9, 3, 9, 6).set(9, 6, 'D'); b.room(7, 7, 5, 4);     // south to the pantry x7-11, y7-10
  b.set(9, 11, 'D').room(8, 12, 3, 2);                       // the stash closet, sealed until the lever
  b.room(13, 1, 4, 4);                                       // the sign room x13-16, y1-4
  b.hall(14, 5, 14, 8).set(14, 5, 'D'); b.room(13, 9, 4, 7); // locked door, then the freezer x13-16, y9-15
  b.pits(13, 11, 14, 11).pits(14, 13, 16, 13); b.set(14, 15, '>');
  b.set(3, 5, 'S').set(3, 6, '.');                           // a hidden niche under the arrival hall
  b.sign(0, 2, 'E', 'WELCOME TO THE CELLAR. THIS PART IS NOT THE TEMPLE YET. THE TEMPLE STARTS AFTER THE FREEZER. DO NOT TOUCH THE LASAGNA IN THE BACK. - GARF', 'GARF');
  b.sign(14, 0, 'S', 'SOMEBODY HAS TO GO LOOK. THE KEY TO THE FREEZER IS IN THE PANTRY. DO NOT FEED THE INTERNS. THEY ARE NOT MINE. - GARF', 'GARF');
  b.sign(9, 14, 'N', 'IF YOU FOUND THIS YOU FOUND MY EMERGENCY STASH. LEAVE THE RATION CUBES. THEY ARE HOLDING UP THE SHELF. - GARF', 'GARF');
  b.sign(14, 16, 'N', 'THE DOOR AT THE BOTTOM IS NEW. IT WASN\'T THERE SATURDAY. IT HUMS. I WOULD NOT. - GARF', 'GARF');
  b.dec(6, 8, 'E', 'lever').dec(4, 5, 'N', 'button');
  for (const [x, y, f] of [[1, 0, 'S'], [4, 0, 'S'], [8, 1, 'S'], [12, 3, 'N'], [13, 0, 'S'], [16, 0, 'S'], [7, 6, 'S'], [11, 6, 'S'], [6, 9, 'E'], [17, 12, 'W'], [13, 16, 'N'], [16, 16, 'N']]) b.dec(x, y, f, 'torch');
  return mkLevel({ name: 'GARF\'S CELLAR', theme: 'cellar', music: 'cellar', disk: 1, start: [2, 2, 1], rows: b.out(), decor: b.dec_, text: b.text_, locks: { '14,5': 'KEY_RUST' }, sealed: ['9,11'],
    loot: [['LASAGNA', 16, 1], ['PROP_PILLS', 16, 4], ['KEY_RUST', 11, 10], ['HELM_RIM', 8, 12], ['BIG_PILLS', 10, 13], ['VOLT_BLADE', 16, 9], ['BIG_PILLS', 13, 9], ['LASAGNA', 16, 12], ['CHIP_BONG', 3, 6], ['RATION', 3, 6], ['PROP_PILLS', 3, 4], ['IOU_1', 9, 13]],
    mons: [['INTERN', 8, 8], ['INTERN', 10, 9], ['INTERN', 13, 10], ['INTERN', 16, 10], ['SPIDER', 15, 14]],
    trig: {
      lever: { '6,8,E': { door: { '9,11': 1 }, msg: 'SOMEWHERE SOUTH, A DOOR GRINDS OPEN.', sfx: 'door' } },
      touch: { '4,5,N': { reveal: ['3,5'], msg: 'A WALL SLIDES ASIDE WITH A SMUG LITTLE NOISE.' } },
      step: { '2,2': { banter: 'l1_start', once: 1 }, '9,5': { banter: 'l1_pantry', once: 1 }, '14,8': { banter: 'l1_freezer', once: 1 }, '14,9': { scene: 'chatButton', once: 1 }, '14,10': { banter: 'l1_pits', once: 1 }, '14,14': { banter: 'l1_stairs', once: 1 },
        '1,1': { msg: 'THE DOOR UPSTAIRS HAS LOCKED ITSELF. IT IS MONDAY.' } } },
    stairs: { '14,15': { to: 2, x: 2, y: 2, dir: 1 } } });
};

// ---------- level 2: THE SERVICE TUNNELS (22x22) ----------
LEVEL_MAKERS[2] = () => {
  const b = grid(22, 22);
  b.room(1, 1, 4, 3).set(1, 1, '<');                         // arrival x1-4, y1-3
  b.hall(5, 2, 11, 2); b.room(12, 1, 5, 4);                  // the long hall and the junction x12-16, y1-4
  b.hall(9, 3, 9, 6); b.room(7, 7, 5, 2);                    // the supply room x7-11, y7-8
  b.hall(14, 5, 14, 9).set(14, 6, 'O').set(14, 7, 'O');     // two spinners on the way south
  b.room(10, 10, 9, 5).set(12, 12, 'p').set(16, 12, 'p');  // the plate room x10-18, y10-14
  b.room(7, 12, 2, 1).set(9, 12, 'D');                       // the vent closet, behind a grate
  b.set(14, 15, 'D').hall(14, 16, 14, 18); b.room(13, 19, 3, 2).set(14, 20, '>');
  b.set(17, 2, 'D'); b.room(18, 1, 3, 4);                    // the cyan door and the A.S.S. bay x18-20, y1-4
  b.sign(0, 2, 'E', 'SERVICE TUNNELS. HARD HATS REQUIRED. THIS SIGN IS ALSO A HARD HAT.', 'SIGN');
  b.sign(6, 7, 'E', 'SUPPLY. WE HAD A FORM FOR THIS. THE FORM IS NOW A SPIDER.', 'SIGN');
  b.sign(18, 0, 'S', 'BAY 1. ALIEN STARSHIPS ONLY. YES, THAT ONE. - FACILITIES', 'SIGN');
  b.sign(13, 9, 'E', 'DO NOT STEP ON THE PLATES. THE PLATES ARE FOR STEPPING. STEP ON BOTH. - FACILITIES', 'SIGN');
  for (const [x, y, f] of [[3, 0, 'S'], [7, 1, 'S'], [10, 3, 'N'], [13, 0, 'S'], [16, 0, 'S'], [8, 6, 'E'], [10, 6, 'W'], [10, 9, 'N'], [18, 15, 'N'], [11, 15, 'N'], [13, 18, 'E'], [15, 18, 'W'], [19, 0, 'S']]) b.dec(x, y, f, 'torch');
  b.dec(12, 15, 'N', 'rune');
  return mkLevel({ name: 'THE SERVICE TUNNELS', theme: 'tunnels', music: 'tunnels', disk: 1, start: [2, 2, 1], npcs: [['PEEKID', 7, 12]], rows: b.out(), decor: b.dec_, text: b.text_, locks: { '17,2': 'KEY_CYAN' }, sealed: ['9,12', '14,15'],
    loot: [['VEST_CHROME', 7, 7], ['BIG_PILLS', 11, 7], ['LASAGNA', 11, 8], ['BONG_HORN', 19, 3], ['BIG_PILLS', 20, 4], ['PROP_PILLS', 20, 1], ['IOU_2', 20, 2], ['AMULET_PHONE', 18, 14], ['RATION', 10, 10]],
    mons: [['INTERN', 8, 2], ['SPIDER', 9, 8], ['INTERN', 13, 3], ['INTERN', 15, 3], ['SPIDER', 11, 11], ['SPIDER', 17, 11], ['COLLECTOR', 11, 14, [[11, 14], [17, 14]]]],
    trig: {
      plate: { '12,12': { door: { '9,12': 1 }, msg: 'A GRATE SLIDES OPEN IN THE WEST WALL.', sfx: 'door', once: 1 }, '16,12': { door: { '14,15': 1 }, msg: 'SOMETHING HEAVY UNLATCHES TO THE SOUTH.', sfx: 'door', once: 1 } },
      step: { '2,2': { banter: 'l2_start', once: 1 }, '3,3': { scene: 'chatBottle', once: 1 }, '14,5': { banter: 'l2_spin', once: 1 }, '8,12': { scene: 'peekid', once: 1 }, '19,2': { banter: 'l2_ass', once: 1 }, '14,17': { banter: 'l2_stairs', once: 1 } } },
    stairs: { '14,20': { to: 3, x: 2, y: 2, dir: 1, disk: 2 } } });
};
function resetLevels() { for (const k in LEVEL_MAKERS) LEVELS[k] = LEVEL_MAKERS[k](); }
resetLevels();
