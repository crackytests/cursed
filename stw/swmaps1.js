'use strict';
// ================= SAVE THE WORLD: maps, part 1 — COLDBOOT, the mines, FACE CASTLE, the cave, MT. RERUN, THE RETURN =================
// a little map builder: start from a fill, draw rects/houses/paths, then take the rows
function MB(w, h, c = '.') {
  const g = Array.from({ length: h }, () => Array(w).fill(c));
  const b = {
    g, w, h,
    put(x, y, ch) { if (y >= 0 && y < h && x >= 0 && x < w) g[y][x] = ch; return b; },
    rect(x, y, ww, hh, ch) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) b.put(i, j, ch); return b; },
    frame(x, y, ww, hh, ch = '#') { for (let i = x; i < x + ww; i++) { b.put(i, y, ch); b.put(i, y + hh - 1, ch); } for (let j = y; j < y + hh; j++) { b.put(x, j, ch); b.put(x + ww - 1, j, ch); } return b; },
    house(x, y, ww, hh, dx) { b.rect(x, y, ww, hh, '#'); if (dx !== undefined) b.put(dx, y + hh - 1, 'D'); return b; },
    paste(x, y, rows) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '?') b.put(x + i, y + j, r[i]); }); return b; },
    scatter(ch, n, s, onto = '.', box = [0, 0, w, h]) { for (let i = 0; i < n; i++) { const x = box[0] + Math.floor(swh(i, 1, s) * box[2]), y = box[1] + Math.floor(swh(i, 2, s) * box[3]); if (g[y] && g[y][x] === onto) g[y][x] = ch; } return b; },
    rows() { return g.map(r => r.join('')); },
  };
  return b;
}
const T = (who, x, y, o) => Object.assign({ who, x, y }, o || {});
const talkS = (who, ...lines) => async () => { for (const l of lines) await say(l, who); };

// ---------------- the opening: the cliff above COLDBOOT ----------------
MAPS.cliff = { name: 'THE CLIFF ABOVE COLDBOOT', theme: 'snow', music: 'opening', noTitle: 1,
  rows: (() => { const b = MB(18, 34, '.'); b.rect(0, 0, 3, 34, '^').rect(15, 0, 3, 34, '^');
    for (let y = 0; y < 34; y++) { const cx = 8 + Math.round(Math.sin(y * .3) * 3); b.rect(cx, y, 2, 1, ':'); }
    b.scatter('T', 30, 3, '.', [3, 0, 12, 34]); b.scatter('^', 10, 4, '.', [3, 0, 12, 34]);
    b.rect(7, 0, 4, 1, ':'); return b.rows(); })(),
  exits: [{ x: 7, y: 0, w: 4, to: 'coldboot', tx: 14, ty: 26, dir: 'u' }],
};
// ---------------- COLDBOOT: the mining town ----------------
MAPS.coldboot = { name: 'COLDBOOT', theme: 'snow', music: 'coldboot',
  rows: (() => { const b = MB(30, 28, '.');
    b.rect(0, 0, 30, 2, '^').rect(0, 0, 2, 28, '^').rect(28, 0, 2, 28, '^');
    b.rect(11, 0, 8, 3, '#').put(14, 2, 'D').put(15, 2, 'D');
    b.rect(14, 3, 2, 25, ':');
    b.house(3, 6, 7, 3, 6).house(19, 6, 8, 3, 22).house(3, 14, 7, 3, 6).house(19, 14, 8, 3, 22).house(4, 21, 5, 3, 6).house(20, 21, 6, 3, 22);
    b.rect(10, 4, 1, 2, '=').rect(19, 4, 1, 2, '=');
    for (const y of [5, 11, 19, 25]) { b.put(12, y, '*'); b.put(17, y, '*'); }
    b.scatter('T', 26, 5, '.', [2, 3, 26, 24]); b.put(3, 11, 'o').put(26, 12, 'o').put(11, 17, 't');
    for (const [x, y] of [[6, 9], [22, 9], [6, 17], [22, 17], [6, 24], [22, 24]]) b.put(x, y, '.');
    return b.rows(); })(),
  exits: [
    { x: 14, y: 2, w: 2, to: 'mines1', tx: 1, ty: 7, dir: 'r', no: () => !flag('opening') },
    { x: 6, y: 8, to: 'elderhouse', tx: 6, ty: 8, dir: 'u' },
    { x: 22, y: 8, to: 'cbinn', tx: 4, ty: 7, dir: 'u' },
    { x: 6, y: 16, to: 'cbshop', tx: 4, ty: 7, dir: 'u' },
    { x: 22, y: 16, to: 'cbarmor', tx: 4, ty: 7, dir: 'u' },
    { x: 13, y: 27, w: 4, to: 'world', wx: 22, wy: 12, if: () => !flag('opening') },
  ],
  npcs: () => [
    T('miner', 8, 12, { wander: 2, if: () => !flag('opening') && flag('escaped'), talk: talkS('MINER', 'THEY DUG UP A SAVE IN THE ICE. A SAVE FROM BEFORE ANY OF US. NOBODY KNOWS WHOSE IT IS.', 'IT HUMS WHEN YOU WALK PAST. LIKE IT\'S TRYING TO LOAD.') }),
    T('woman', 20, 19, { wander: 2, if: () => flag('escaped'), talk: talkS('OLD WOMAN', 'THE FRANCHISE CAME THROUGH WITH WALKING MACHINES. ONE OF THEM HAD A GIRL IN IT.', 'SHE LOOKED AT ME LIKE SHE WAS WAITING FOR ME TO ASK HER FOR SOMETHING.') }),
    T('child', 16, 22, { wander: 3, if: () => flag('escaped'), talk: talkS('KID', 'MY DAD SAYS THE WORLD IS SAVED IN THREE PLACES. I ASKED WHAT HAPPENS IF YOU SAVE OVER IT.', 'HE SAID GO TO BED.') }),
    T('guard', 13, 10, { dir: 'd', if: () => flag('escaped') && !flag('coldbootFriendly'), talk: talkS('GUARD', 'THE MINES ARE CLOSED. THE ARCHIVIST SAYS NOBODY GOES NEAR THE FROZEN SAVE UNTIL WE KNOW WHAT IT WANTS.') }),
  ],
  enter: async () => { if (flag('opening') && !flag('cbMarch')) await openingTown(); },
};
// interiors
const INT = (rows, o) => Object.assign({ theme: 'inside', music: 'town', rows }, o);
MAPS.elderhouse = INT(['############', '#B..t.#BBB.#', '#....;.....#', '#.b..;..b..#', '#....;.....D', '#..o.;..o..#', '#....;.....#', '#....;.....#', '######D#####'], { name: 'THE ARCHIVIST\'S HOUSE',
  exits: [{ x: 6, y: 8, to: 'coldboot', tx: 6, ty: 9, dir: 'd', no: () => flag('wakeUp') && !flag('escaped') && !!say('THE FRONT DOOR. THE GUARDS ARE RIGHT OUTSIDE.') }, { x: 11, y: 4, to: 'mines2', tx: 1, ty: 9, dir: 'r', if: () => flag('wakeUp') }],
  npcs: () => [T('elder', 6, 3, { if: () => true, talk: async () => { if (!flag('escaped')) await say('THE BACK DOOR GOES INTO THE MINES. GO. SOMEONE WILL FIND YOU. HE\'S GOOD AT THAT.', 'THE ARCHIVIST'); else await say('THE CROWN IS IN A DRAWER NOW. IT STILL LISTENS. SOMETIMES IT SAYS "OF COURSE" BY ITSELF.', 'THE ARCHIVIST'); } })],
  enter: async () => { if (flag('mineFlash') && !flag('wakeUp')) await wakeUp(); },
});
MAPS.cbinn = INT(['##########', '#b.b.b.B.#', '#........#', '#.____...#', '#........#', '#..o..t..#', '#........#', '#........#', '####D#####'], { name: 'COLDBOOT INN',
  exits: [{ x: 4, y: 8, to: 'coldboot', tx: 22, ty: 9, dir: 'd' }], saves: [[7, 6]],
  npcs: () => [T('man', 4, 2, { dir: 'd', talk: () => inn(20, 'INNKEEPER') })] });
MAPS.cbshop = INT(['##########', '#BBB.BBB.#', '#........#', '#.______.#', '#........#', '#........#', '#..o..o..#', '#........#', '####D#####'], { name: 'COLDBOOT GOODS',
  exits: [{ x: 4, y: 8, to: 'coldboot', tx: 6, ty: 17, dir: 'd' }],
  npcs: () => [T('clerk', 4, 2, { dir: 'd', talk: () => shop('COLDBOOT GOODS', ['snack', 'antivirus', 'coffee', 'extralife', 'tent', 'earplugs'], 'SHOPKEEPER') })] });
MAPS.cbarmor = INT(['##########', '#B.B.B.B.#', '#........#', '#.______.#', '#........#', '#.t....t.#', '#........#', '#........#', '####D#####'], { name: 'COLDBOOT OUTFITTERS',
  exits: [{ x: 4, y: 8, to: 'coldboot', tx: 22, ty: 17, dir: 'd' }],
  npcs: () => [T('miner', 4, 2, { dir: 'd', talk: () => shop('OUTFITTERS', ['wand', 'bong2', 'lance2', 'torch2', 'mic2', 'cane2', 'toy2', 'dart2', 'hoodie', 'suit', 'robe', 'cap', 'hardhat'], 'SHOPKEEPER') })] });
// ---------------- the mines (the opening) ----------------
MAPS.mines1 = { name: 'THE MINES', theme: 'mine', music: 'mines', dungeon: 1, dark: 0,
  rows: ['##############################', '#..*.......#.....*....#......#', '#.......o..#..........#..o...#', '#..####....#...####...#......#', '#..#  #........#  #..........#', '#..####::::::::####::::::::..#', '#.......:            :.....:.#', '::::::::::  ::::::  :::::::::.', '#......:.:  :#  #:  :.......:#', '#..t...:.::::#  #::::...t...:#', '#......:......  .......o....:#', '#...####...##....##...####..:#', '#..*#  #...##....##...#  #*..:#', '#...####..........*...####...#', '#............................#', '##############################'].map(r => r.slice(0, 30)),
  exits: [{ x: 0, y: 7, to: 'coldboot', tx: 14, ty: 3, dir: 'd' }, { x: 29, y: 7, to: 'firstsave', tx: 1, ty: 6, dir: 'r' }],
  steps: { '20,7': async () => { if (!flag('holdmusic')) await holdMusicBoss(); }, '21,7': async () => { if (!flag('holdmusic')) await holdMusicBoss(); } },
  chests: [[2, 14, 'snack', 3], [26, 2, 'antivirus', 2], [6, 9, 'gp', 150]],
};
MAPS.firstsave = { name: 'SLOT ZERO', theme: 'mine', music: 'firstsave', color: 1,
  rows: ['################', '#^^^^^^^^^^^^^^#', '#^....,,,,....^#', '#^...,,,,,,...^#', '#^...,,,,,,...^#', '#^....,,,,....^#', '.......,,......#', '#^............^#', '#^^^^^^^^^^^^^^#', '################'],
  exits: [{ x: 0, y: 6, to: 'mines1', tx: 28, ty: 7, dir: 'l' }],
  npcs: () => [T(null, 7, 3, { id: 'save0', solid: true, draw: (n, x, y) => drawFirstSave(x, y), talk: async () => { if (flag('mineFlash')) await say('THE FROZEN SAVE IS QUIET NOW. YOU CAN SEE A CURSOR INSIDE THE ICE, BLINKING.'); } })],
  enter: async () => { if (!flag('mineFlash')) await firstSaveScene(); },
};
function drawFirstSave(x, y) {
  const t = frame, c = (t >> 3) & 1;
  for (let i = 0; i < 3; i++) { circF(x + 8, y + 10, 18 - i * 5, [hex('#24499f'), hex('#4992db'), hex('#b6dbff')][i]); }
  for (let j = 0; j < 4; j++) lineF(x - 6 + j * 8, y + 26, x + 8, y - 6, hex('#dbffff'));
  if (c) rectF(x + 6, y + 6, 2, 8, WHITE);
  text('SLOT 0', x - 10, y - 18, hex('#dbffff'));
}
// ---------------- the escape: the back way through the mines ----------------
MAPS.mines2 = { name: 'THE BACK TUNNELS', theme: 'mine', music: 'mines', dungeon: 1, dark: 70,
  rows: ['##################################', '#....#.........#........#........#', '#.o..#..####...#..####..#..####..#', '#....#..#  #...#..#  #..#..#  #..#', '#....#..####...#..####..#..####..#', '#..............#.................#', '###..#####..####..#####..######..#', '#....#   #..#..........#..#    #..', '#..*.#####..#..*....*..#..######..', '...........::::::::::::::.......::', '#....#####..#.........##..#####...', '#.o..#   #..#..o.......#..#   #..#', '#....#####..############..#####..#', '#.........................t......#', '##################################'],
  exits: [{ x: 0, y: 9, to: 'elderhouse', tx: 10, ty: 4, dir: 'l' }, { x: 33, y: 9, w: 1, h: 2, to: 'world', wx: 34, wy: 9, no: () => !flag('carlJoined') && !!say('A DEAD END. NO. THERE\'S A DRAFT. SOMEONE KNOWS ABOUT THIS.') }],
  steps: { '16,9': async () => { if (!flag('carlJoined')) await carlArrives(); } },
  chests: [[2, 2, 'extralife', 1], [15, 11, 'snack', 2], [2, 11, 'hoodie', 1]],
  enc: { forms: ['minesG0', 'minesG1', 'A2', 'A4'], bg: 'mine' },
};
// ---------------- FACE CASTLE ----------------
MAPS.castle = { name: 'FACE CASTLE', theme: 'castle', music: 'castle',
  rows: (() => { const b = MB(24, 20, '.');
    b.frame(0, 0, 24, 20, '#').rect(1, 1, 22, 2, '#');
    b.rect(11, 3, 2, 17, ':'); b.rect(9, 3, 6, 3, ';').put(11, 3, 'T').put(12, 3, 'T');
    b.put(8, 3, '*').put(15, 3, '*'); for (const y of [7, 11, 15]) { b.put(9, y, '*'); b.put(14, y, '*'); }
    b.rect(1, 7, 6, 1, '#').rect(17, 7, 6, 1, '#').put(3, 7, 'D').put(20, 7, 'D');
    b.rect(1, 13, 6, 1, '#').rect(17, 13, 6, 1, '#').put(3, 13, 'D').put(20, 13, 'D');
    b.put(2, 4, 'B').put(3, 4, 'B').put(20, 4, 'B').put(21, 4, 'B').put(2, 10, 'o').put(21, 10, 'o').put(2, 16, 't').put(21, 16, 't');
    b.put(11, 19, 'D').put(12, 19, 'D'); return b.rows(); })(),
  exits: [
    { x: 11, y: 19, w: 2, to: 'world', wx: 46, wy: 33, no: () => flag('faceMet') && !flag('faceJoined') && !!say('IT\'S DARK OUT. THE KING SAID TO STAY THE NIGHT.') },
    { x: 3, y: 7, to: 'castleguest', tx: 6, ty: 7, dir: 'u' }, { x: 20, y: 7, to: 'castleshop', tx: 6, ty: 7, dir: 'u' },
    { x: 3, y: 13, to: 'castleinn', tx: 6, ty: 7, dir: 'u' }, { x: 20, y: 13, to: 'castleeng', tx: 6, ty: 7, dir: 'u' },
  ],
  npcs: () => [
    T('face', 11, 5, { id: 'king', if: () => !flag('faceJoined'), talk: () => faceThrone() }),
    T('guard', 10, 17, { dir: 'u', talk: talkS('GUARD', 'WELCOME TO FACE CASTLE. THE KING IS IN. THE KING IS ALWAYS IN. HE\'S A HEAD.') }),
    T('guard', 13, 17, { dir: 'u', talk: talkS('GUARD', 'THE CASTLE CAN GO UNDERGROUND. THE KING INVENTED THAT. HE INVENTED IT BEFORE HE INVENTED A REASON.') }),
    T('cook', 5, 10, { wander: 2, talk: talkS('COOK', 'THE KING DOESN\'T EAT. I COOK ANYWAY. IT\'S A FEELING.') }),
  ],
  saves: [[18, 10]], saveTile: 1,
  enter: async () => { if (!flag('faceMet')) await castleArrive(); },
};
MAPS.castleguest = INT(['##########', '#b..B..b.#', '#........#', '#..;;;;..#', '#..;;;;..#', '#........#', '#........#', '#........#', '######D###'], { name: 'GUEST ROOM', theme: 'castle', music: 'castle',
  exits: [{ x: 6, y: 8, to: 'castle', tx: 3, ty: 8, dir: 'd' }], signs: { '1,1': async () => { if (flag('faceMet') && !flag('castleFire')) await castleNight(); else await say('A BED FIT FOR A GUEST OF A KING WITH NO BODY.'); }, '7,1': async () => { if (flag('faceMet') && !flag('castleFire')) await castleNight(); } } });
MAPS.castleshop = INT(['##########', '#BBB.BBB.#', '#........#', '#.______.#', '#........#', '#........#', '#........#', '#........#', '######D###'], { name: 'ROYAL ARMORY', theme: 'castle', music: 'castle',
  exits: [{ x: 6, y: 8, to: 'castle', tx: 20, ty: 8, dir: 'd' }],
  npcs: () => [T('guard', 4, 2, { dir: 'd', talk: () => shop('ROYAL ARMORY', ['wand', 'bong2', 'lance2', 'torch2', 'mic2', 'cane2', 'toy2', 'dart2', 'suit', 'robe', 'hardhat', 'shades', 'earbuds'], 'SHOPKEEPER') })] });
MAPS.castleinn = INT(['##########', '#b.b.b.b.#', '#........#', '#........#', '#..t..t..#', '#........#', '#........#', '#........#', '######D###'], { name: 'BARRACKS', theme: 'castle', music: 'castle', saves: [[2, 6]],
  exits: [{ x: 6, y: 8, to: 'castle', tx: 3, ty: 14, dir: 'd' }],
  npcs: () => [T('guard', 6, 2, { dir: 'd', talk: () => inn(0, 'GUARD') }), T('woman', 2, 4, { wander: 1, talk: () => shop('ROYAL PANTRY', ['snack', 'meal', 'antivirus', 'coffee', 'extralife', 'tent', 'earplugs'], 'SHOPKEEPER') })] });
MAPS.castleeng = INT(['##########', '#tt..T.tt#', '#........#', '#.B....B.#', '#........#', '#..o..o..#', '#........#', '#........#', '######D###'], { name: 'ENGINE ROOM', theme: 'castle', music: 'castle',
  exits: [{ x: 6, y: 8, to: 'castle', tx: 20, ty: 14, dir: 'd' }],
  npcs: () => [T('miner', 5, 4, { wander: 1, talk: talkS('MINER', 'THE CASTLE SINKS IN FOUR MINUTES. RISES IN SIX. NOBODY KNOWS WHY THE DIFFERENCE. THE KING SAYS IT\'S DRAMA.') })],
  chests: [[2, 3, 'drill'], [8, 6, 'battery', 3]] });
// ---------------- THE CAVE under the mountains ----------------
MAPS.cave1 = { name: 'THE CAVE', theme: 'mine', music: 'mines', dungeon: 1,
  rows: ['##############################', '#....#.....o.#.......#.......#', '#.#..#.###...#..###..#..###..#', '#.#.....# #......# #.....# #..', '#.#######.##########.#######..', '..........::::::::::::::......', '#.##..####.........#####..##.#', '#.#...#  #..^^^....#   #...#.#', '#.#.o.####..^ ^....#####...#.#', '#.....................t......#', '##############################'],
  exits: [{ x: 0, y: 5, to: 'world', wx: 41, wy: 40 }, { x: 29, y: 3, h: 3, to: 'world', wx: 41, wy: 49 }],
  chests: [[11, 1, 'meal', 1], [4, 8, 'coffee', 2], [22, 9, 'bong3', 1]],
  enter: async () => { if (!flag('oldfaceJoined')) obj('MT. RERUN IS JUST PAST THE SOUTH END OF THE CAVE. SOMETHING IS GOING ON UP THERE.', null, 36, 55); },
  enc: { forms: ['C1', 'C0', 'B5', 'A4'], bg: 'mine' },
};
// ---------------- MT. RERUN: where the hermit taught two students ----------------
MAPS.mtrerun = { name: 'MT. RERUN', theme: 'sand', music: 'mountain', dungeon: 1,
  rows: (() => { const b = MB(22, 24, '^'); for (let y = 0; y < 24; y++) { const cx = 10 + Math.round(Math.sin(y * .45) * 6); b.rect(cx - 2, y, 5, 1, '.'); }
    b.rect(6, 1, 10, 4, '.').rect(9, 0, 4, 1, '.'); b.scatter('t', 10, 31, '.'); b.rect(9, 23, 4, 1, ':'); return b.rows(); })(),
  exits: [{ x: 9, y: 23, w: 4, to: 'world', wx: 36, wy: 55 }],
  enter: async () => { if (!flag('oldfaceJoined')) obj('SOMEONE IS AT THE SUMMIT.', 'mtrerun', 10, 4); },
  steps: { '10,4': async () => { if (!flag('oldfaceJoined')) await protegeFight(); }, '11,4': async () => { if (!flag('oldfaceJoined')) await protegeFight(); } },
  chests: [[13, 2, 'torch3', 1], [8, 12, 'meal', 2]],
  enc: { forms: ['C2', 'C3', 'C0'], bg: 'desert' },
};
// ---------------- THE RETURN: the rebels' hideout ----------------
MAPS.returnhq = { name: 'THE RETURN', theme: 'mine', music: 'return',
  rows: ['####################', '#B..#....;;....#..B#', '#...#....;;....#...#', '#b..D....;;....D..b#', '#...#....;;....#...#', '##D##....;;....##D##', '#........;;........#', '#..t.....;;.....t..#', '#.....____;.........', '#........;;........#', '#..o.....;;.....o..#', '#........;;........#', '#*.......;;.......*#', '#........;;........#', '#########DD#########'],
  exits: [{ x: 9, y: 14, w: 2, to: 'world', wx: 24, wy: 60 }],
  npcs: () => [
    T('elder', 9, 7, { id: 'curator', talk: () => curatorTalk() }),
    T('man', 4, 9, { wander: 2, talk: talkS('REBEL', 'WE\'RE CALLED THE RETURN BECAUSE WE WANT TO RETURN THE SAVES TO THE PEOPLE THEY BELONG TO. ALSO WE MEET IN A CAVE.') }),
    T('woman', 15, 10, { wander: 2, talk: talkS('REBEL', 'THE FRANCHISE LICENSES EVERYTHING. LAST WEEK THEY LICENSED MY MOM. SHE\'S FINE. SHE JUST COSTS MORE NOW.') }),
    T('child', 3, 2, { talk: () => inn(0, 'REBEL') }),
    T('miner', 17, 2, { talk: () => shop('RETURN SUPPLY', ['snack', 'meal', 'antivirus', 'coffee', 'extralife', 'tent', 'bomb', 'ice', 'battery', 'vest', 'helm3', 'firewall'], 'SHOPKEEPER') }),
  ],
  saves: [[2, 12]],
  enter: async () => { if (!flag('returnDone')) obj('THE CURATOR RUNS THE RETURN. HE IS IN THE MIDDLE OF THE HALL.', 'returnhq', 9, 7); },
};
