'use strict';
// ================= SAVE THE WORLD: maps, part 4 — THE CORRUPTED SAVE and THE TITLE SCREEN =================
// ---------------- LOST & FOUND ISLAND ----------------
MAPS.island = { name: 'LOST & FOUND ISLAND', theme: 'sand', music: 'island', color: 0,
  rows: (() => { const b = MB(20, 16, '~'); b.rect(2, 2, 16, 12, '.'); b.rect(1, 4, 1, 8, '.').rect(18, 4, 1, 8, '.'); b.rect(3, 1, 14, 1, '.').rect(3, 14, 14, 1, '.');
    b.house(7, 3, 6, 3, 9); b.scatter('T', 6, 111, '.', [2, 7, 16, 6]); b.scatter('o', 3, 112, '.', [2, 8, 16, 5]); b.rect(9, 6, 2, 3, ':'); return b.rows(); })(),
  exits: [{ x: 9, y: 5, to: 'hut', tx: 5, ty: 6, dir: 'u' }, { x: 16, y: 14, to: 'world', wx: 112, wy: 21, if: () => flag('raftReady'), run: () => islandRaft() }],
  npcs: () => LOST.map((l, i) => T(null, l.x, l.y, { id: 'lost' + i, if: () => !G.flags['lost' + i], solid: false, draw: (n, x, y) => { if ((frame >> 3) & 1) { pset(x + 8, y + 10, WHITE); pset(x + 7, y + 11, hex('#ffdb49')); pset(x + 9, y + 11, hex('#ffdb49')); } } })).concat([
    T(null, 16, 13, { if: () => flag('raftReady'), solid: true, talk: () => islandRaft(), draw: (n, x, y) => { rectF(x - 4, y + 6, 24, 10, hex('#926d49')); for (let i = 0; i < 24; i += 4) rectF(x - 4 + i, y + 6, 1, 10, hex('#6d4924')); rectF(x + 6, y - 10, 2, 16, hex('#6d4924')); triF(x + 8, y - 10, x + 8, y + 4, x + 18, y + 4, WHITE); } })]),
  onStep: async (x, y) => { const i = LOST.findIndex((l, k) => l.x === x && l.y === y && !G.flags['lost' + k]); if (i >= 0) { G.flags['lost' + i] = 1; G.found = (G.found || []).concat([i]); sfx('get'); await say('FOUND: ' + LOST[i].name + '. ' + LOST[i].desc); return 1; } },
  enter: async () => { if (!flag('islandWoke')) await islandWake(); },
};
// the lost things on the beach: some are worth bringing him, some aren't
const LOST = [
  { x: 3, y: 9, name: 'A WARM SOCK', desc: 'ONLY ONE. STILL WARM, SOMEHOW.', good: 1 }, { x: 15, y: 10, name: 'A PAIR OF GLASSES', desc: 'HIS PRESCRIPTION. PROBABLY.', good: 1 },
  { x: 5, y: 12, name: 'A RECEIPT', desc: 'FOR SOMETHING THAT ISN\'T HERE.', good: 0 }, { x: 12, y: 12, name: 'A PHOTOGRAPH', desc: 'A COUNTER. A CLERK. A LOT OF LITTLE TAGS.', good: 1 },
  { x: 17, y: 6, name: 'A KEY', desc: 'IT DOESN\'T OPEN ANYTHING. IT USED TO.', good: 0 }, { x: 2, y: 5, name: 'A CLAIM TICKET', desc: 'NUMBER 0. NOBODY EVER CAME FOR IT.', good: 1 },
];
MAPS.hut = INT(['##########', '#B..b...B#', '#........#', '#...t....#', '#........#', '#..o.....#', '#........#', '#####D####'], { name: 'THE CLERK\'S HUT', theme: 'inside', music: 'island',
  exits: [{ x: 5, y: 7, to: 'island', tx: 9, ty: 6, dir: 'd' }],
  npcs: () => [T('clerk', 5, 2, { id: 'clerk', if: () => !flag('clerkLost'), talk: () => clerkTalk() })], saves: [[7, 5]] });
// ---------------- NEW FILE: what's left of COLDBOOT ----------------
MAPS.newfile = { name: 'NEW FILE', theme: 'snow', music: 'newfile',
  rows: (() => { const rows = MAPS.coldboot.rows.slice(); return rows.map((r, y) => y === 2 ? r.slice(0, 14) + '##' + r.slice(16) : r); })(),
  exits: [{ x: 13, y: 27, w: 4, to: 'world', wx: 22, wy: 12 }, { x: 6, y: 8, to: 'nfcellar', tx: 1, ty: 7, dir: 'r' }, { x: 22, y: 8, to: 'nfhouse', tx: 5, ty: 7, dir: 'u' }, { x: 6, y: 16, to: 'cbshop', tx: 4, ty: 7, dir: 'u' }, { x: 22, y: 16, to: 'cbarmor', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T('newfile', 9, 12, { wander: 2, talk: talkS('NEW FILE', 'HELLO. I\'M... NEW FILE. EVERYONE HERE IS NEW FILE. WE USED TO HAVE NAMES. THEY WERE SAVED SOMEWHERE ELSE.') }),
    T('newfile', 20, 19, { wander: 2, talk: talkS('NEW FILE', 'A MAN CAME THROUGH WEARING HIS HAT BACKWARDS. HE WENT INTO THE OLD MAN\'S CELLAR. HE SAID HE WAS LOOKING FOR SOMETHING EVERYONE LOST.') }),
    T('newfile', 15, 23, { wander: 2, talk: talkS('NEW FILE', 'THERE\'S A GREEN GENTLEMAN HOLDING UP THE INN. WITH HIS HANDS. IT WAS GOING TO FALL DOWN. HE SAID IT WAS NO TROUBLE.') }),
  ],
  enter: async () => { if (!flag('nfIn')) { setFlag('nfIn'); obj('SOMEONE WENT INTO THE OLD ARCHIVIST\'S HOUSE (WEST). SOMEONE ELSE IS HOLDING UP THE INN (EAST).', 'nfhouse', 5, 3); } },
};
MAPS.nfhouse = INT(['##########', '#.^^..b..#', '#..t.....#', '#........#', '#..o..t..#', '#........#', '#........#', '#####D####'], { name: 'THE INN (BARELY)', theme: 'inside', music: 'newfile',
  exits: [{ x: 5, y: 7, to: 'newfile', tx: 22, ty: 9, dir: 'd' }],
  npcs: () => [T('oldface', 5, 2, { if: () => !flag('oldfaceBack'), talk: () => oldFaceHouse() })] });
MAPS.nfcellar = { name: 'THE LOST & FOUND CELLAR', theme: 'mine', music: 'dungeon2', dungeon: 1,
  rows: ['##############################', '#....#..........#.....#......#', '#.o..#..####....#..t..#..##..#', '#....#..#  #..........#..##..#', '#....####..#####..####.......#', '#..........:...........#.....#', '#..t.......:..o........#..o..#', '...........:::::::::::::.....#', '#..........:.......#...#.....#', '#....####..:..###..#...####..#', '#....#  #..:..# #..#.........#', '#..o.####..:..###..#..t......#', '#..........:.......#.........#', '##############################'],
  exits: [{ x: 0, y: 7, to: 'newfile', tx: 6, ty: 9, dir: 'd' }],
  steps: { '27,7': async () => { if (!flag('carlBack')) await cacheBoss(); }, '28,7': async () => { if (!flag('carlBack')) await cacheBoss(); } },
  chests: [[2, 2, 'feast', 1], [27, 6, 'luckycoin'], [3, 11, 'espresso', 1]], enc: { forms: forms('L'), bg: 'mine' },
  enter: async () => { if (!flag('carlBack')) obj('SOMETHING AT THE FAR END OF THE CELLAR.', 'nfcellar', 27, 7); } };
// ---------------- the grave of THE BROADCAST ----------------
MAPS.grave = { name: 'THE GRAVEYARD OF CANCELED SHOWS', theme: 'spirit', music: 'grave',
  rows: (() => { const b = MB(20, 18, ','); b.frame(0, 0, 20, 18, '^'); for (let y = 3; y < 14; y += 3) for (let x = 3; x < 17; x += 4) b.put(x, y, 't'); b.house(7, 1, 6, 3, 9); b.rect(9, 4, 2, 14, ':'); b.put(9, 17, ':').put(10, 17, ':'); return b.rows(); })(),
  exits: [{ x: 9, y: 17, w: 2, to: 'world', wx: 30, wy: 52 }, { x: 9, y: 3, to: 'gravein', tx: 1, ty: 6, dir: 'r' }],
  enter: async () => { if (!flag('ghostBack')) obj('THE CRYPT AT THE TOP OF THE GRAVEYARD.', 'gravein', 20, 6); } };
MAPS.gravein = { name: 'THE CRYPT', theme: 'tower', music: 'dungeon2', dungeon: 1,
  rows: ['########################', '#.....#........#.......#', '#.o...#..#..#..#...o...#', '#.....#........#.......#', '#..#######..#######....#', '#......................#', '.......::::::::::::::...', '#......................#', '#..#######..#######....#', '#.....#........#.......#', '#.o...#..#..#..#...t...#', '#.....#........#.......#', '########################'],
  exits: [{ x: 0, y: 6, to: 'grave', tx: 9, ty: 4, dir: 'd' }],
  steps: { '20,6': async () => { if (!flag('ghostBack')) await ratingsBoss(); }, '21,6': async () => { if (!flag('ghostBack')) await ratingsBoss(); } },
  chests: [[2, 2, 'mic5'], [19, 2, 'espresso', 1], [2, 10, 'megalife', 1]], enc: { forms: forms('N'), bg: 'void' } };
// ---------------- optional reunions ----------------
MAPS.castleB = { name: 'FACE CASTLE (UNDERGROUND)', theme: 'castle', music: 'dungeon2', dungeon: 1,
  rows: (() => { const rows = MAPS.castle.rows.map(r => r); return rows; })(),
  exits: [{ x: 11, y: 19, w: 2, to: 'world', wx: 46, wy: 33 }],
  npcs: () => [T('face', 11, 5, { if: () => !flag('faceBack'), talk: () => faceUnder() })],
  enc: { forms: forms('N'), bg: 'castle' }, enter: async () => { if (!flag('faceBack')) obj('THE KING IS STILL ON HIS THRONE.', 'castleB', 11, 5); } };
MAPS.yvillage = { name: 'THE YOKOID VILLAGE', theme: 'town', music: 'yokoid',
  rows: (() => { const b = MB(22, 18, '.'); b.frame(0, 0, 22, 18, 'T'); b.house(3, 3, 6, 3, 5).house(13, 3, 6, 3, 15).house(3, 10, 6, 3, 5).house(13, 10, 6, 3, 15); b.rect(10, 1, 2, 17, ':'); b.put(10, 17, ':').put(11, 17, ':'); b.scatter(',', 30, 131, '.'); return b.rows(); })(),
  exits: [{ x: 10, y: 17, w: 2, to: 'world', wx: 98, wy: 55 }],
  npcs: () => [
    T('yoko', 10, 7, { if: () => !flag('yokoBack'), talk: () => yokoVillage() }),
    T('yokoid', 6, 8, { wander: 2, talk: talkS('YOKOID', 'MAY I HELP YOU? NO. WAIT. YOKO SAYS WE DON\'T HAVE TO SAY THAT ANYMORE. MAY I... NOT HELP YOU?') }),
    T('yokoid', 15, 8, { wander: 2, talk: talkS('YOKOID', 'THE BIG ONE CAME BACK TWICE. THE REPO MAN. HE SAYS WE\'RE UNPAID MERCHANDISE.') }),
    T('yokoid', 8, 14, { wander: 2, talk: talkS('YOKOID', 'YOKO DOESN\'T FIGHT ANYMORE. SHE SAYS SHE DOESN\'T KNOW WHY SHE WOULD. SHE READS TO US INSTEAD.') }),
  ],
  enter: async () => { if (!flag('yokoBack')) obj('YOKO IS IN THE MIDDLE OF THE VILLAGE.', 'yvillage', 10, 7); } };
MAPS.coldcase = { name: 'THE COLD CASE', theme: 'train', music: 'dream', dungeon: 1, color: 1,
  rows: (() => { const b = MB(22, 12, '.'); b.frame(0, 0, 22, 12, '#'); b.rect(11, 0, 1, 12, '#').put(11, 3, 'D').put(11, 9, 'D'); b.rect(0, 5, 11, 1, '#').put(5, 5, 'D'); b.rect(12, 6, 10, 1, '#').put(16, 6, 'D');
    for (const x of [2, 5, 8, 14, 17, 20]) b.put(x, 1, 't'); b.rect(2, 3, 6, 1, ';').rect(14, 4, 4, 1, ';').put(3, 7, 'o').put(9, 7, 'o').put(14, 8, 'o').put(18, 8, 'o').rect(5, 9, 2, 1, ';'); return b.rows(); })(),
  exits: [], steps: { '5,9': async () => { if (!flag('garfieldBack')) await suspectsBoss(); } },
  enter: async () => { if (!flag('garfieldBack')) obj('THREE SUSPECTS ARE WAITING IN THE LAST CAR.', 'coldcase', 5, 9); } };
MAPS.focusgroup = { name: 'THE FOCUS GROUP', theme: 'factory', music: 'dungeon2', dungeon: 1,
  rows: ['##################', '#t..t..t..t..t..t#', '#................#', '#.______________.#', '#................#', '#t..t..t..t..t..t#', '#................#', '#................#', '########DD########'],
  exits: [{ x: 8, y: 8, w: 2, to: 'world', wx: 118, wy: 92 }],
  npcs: () => [T('human', 8, 2, { if: () => !flag('humanJoined'), talk: () => humanFound() })] };
// ---------------- THE TITLE SCREEN: Kursor's tower ----------------
const TWR = (rows, o) => Object.assign({ theme: 'tower', music: 'tower', dungeon: 1, color: 1, rows, enc: { forms: forms('T'), bg: 'tower' } }, o);
MAPS.tower1 = TWR(['######################', '#.....#........#.....#', '#..o..#..;..;..#..o..#', '#.....#........#.....#', '#..#####..::..#####..#', '#.........::.........#', '#..t......::......t..#', '#####.....::.....#####', '#.........::.........#', '#..####...::...####..#', '#..#..#...::...#..#..#', '#..####...::...####..#', '#.........::.........#', '#..o......::......o..#', '#.........::.........#', '#..####...::...####..#', '#..#..#...::...#..#..#', '#..####...::...####..#', '#.........::.........#', '##########DD##########'], { name: 'THE TITLE SCREEN: NEW GAME',
  exits: [{ x: 10, y: 19, w: 2, to: 'world', wx: 64, wy: 61 }],
  steps: { '10,1': async () => towerBoss(1), '11,1': async () => towerBoss(1) }, chests: [[3, 2, 'feast', 1], [18, 2, 'espresso', 1], [3, 13, 'rod6'], [18, 13, 'bong6']],
  enter: async () => towerEnter(1) });
MAPS.tower2 = TWR(['######################', '#....................#', '#.####.####.####.###.#', '#.#..............#...#', '#.#.####.####.##.#.#.#', '#.#.#..........#.#.#.#', '#...#.:::::::..#...#.#', '#.###.:......:.###.#.#', '#.....:..;;..:.....#.#', '#.###.:......:.###...#', '#...#.:::::::..#.#####', '#.#.#..........#.....#', '#.#.####.####.##.###.#', '#.#..................#', '#.####.####.####.###.#', '#....................#', '##########DD##########'], { name: 'THE TITLE SCREEN: CONTINUE',
  exits: [{ x: 10, y: 16, w: 2, to: 'world', wx: 64, wy: 61 }],
  steps: { '9,8': async () => towerBoss(2), '10,8': async () => towerBoss(2) }, chests: [[2, 1, 'lance6'], [19, 1, 'torch6'], [2, 15, 'mic6'], [19, 15, 'cane6']],
  enter: async () => towerEnter(2) });
MAPS.tower3 = TWR(['######################', '#;;;;;;;;;;;;;;;;;;;;#', '#;..................;#', '#;.:::::::::::::::..;#', '#;.:..............:.;#', '#;.:.############.:.;#', '#;.:.#..........#.:.;#', '#;.:.#..::::::..#.:.;#', '#;.:.#..:....:..#.:.;#', '#;.:.#..:.;;.:..#.:.;#', '#;.:.##.:....:.##.:.;#', '#;.:....::::::....:.;#', '#;.::::::::::::::::.;#', '#;..................;#', '#;;;;;;;;;;;;;;;;;;;;#', '##########DD##########'], { name: 'THE TITLE SCREEN: OPTIONS',
  exits: [{ x: 10, y: 15, w: 2, to: 'world', wx: 64, wy: 61 }],
  steps: { '10,9': async () => towerBoss(3), '11,9': async () => towerBoss(3) }, chests: [[2, 2, 'toy6'], [19, 2, 'dart6'], [2, 13, 'armor6'], [19, 13, 'helm6']],
  enter: async () => towerEnter(3) });
MAPS.towertop = { name: 'THE TITLE SCREEN', theme: 'tower', music: 'kursor', color: 1,
  rows: ['##################', '#~~~~~~~~~~~~~~~~#', '#~~~~~~~..~~~~~~~#', '#~~~~~~~..~~~~~~~#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '########..########'],
  exits: [], steps: { '8,3': async () => finalBattle(), '9,3': async () => finalBattle() }, saves: [[3, 8]],
  enter: async () => { obj('KURSOR IS AT THE TOP.', 'towertop', 8, 3); if (!flag('topRest')) { setFlag('topRest'); for (const r of Object.values(G.roster)) { r.hp = r.mhp; r.mp = r.mmp; r.status = {}; } await say('THE TOP OF THE TITLE SCREEN IS QUIET. THE PARTY CATCHES ITS BREATH. (EVERYONE IS RESTORED. THERE IS A SAVE POINT.)', null); } } };
