'use strict';
// ================= SAVE THE WORLD: maps, part 3 — PRESTIGE, THE OPERA, THE BROADCAST, FRANCHISE CITY, THE FACTORY, THE MEMORY CARD, THE CLOUD =================
// ---------------- PRESTIGE: the rich town ----------------
MAPS.prestige = { name: 'PRESTIGE', theme: 'town', music: 'prestige',
  rows: (() => { const b = MB(24, 20, ','); b.frame(0, 0, 24, 20, 'T'); b.rect(10, 7, 4, 13, ':'); b.rect(2, 12, 20, 1, ':'); b.rect(10, 11, 4, 3, ':').rect(11, 12, 2, 1, '~');
    b.house(7, 2, 10, 5, 11).put(12, 6, 'D'); b.house(2, 8, 6, 3, 4).house(16, 8, 6, 3, 18).house(2, 14, 6, 3, 4).house(16, 14, 6, 3, 18);
    for (const [x, y] of [[9, 8], [14, 8], [9, 16], [14, 16]]) b.put(x, y, '*'); b.scatter('"', 18, 101, ','); b.put(11, 19, ':').put(12, 19, ':'); return b.rows(); })(),
  exits: [{ x: 11, y: 19, w: 2, to: 'world', wx: 24, wy: 100 }, { x: 11, y: 6, w: 2, to: 'starhouse', tx: 7, ty: 8, dir: 'u' },
    { x: 4, y: 10, to: 'prinn', tx: 4, ty: 7, dir: 'u' }, { x: 18, y: 10, to: 'prshop', tx: 4, ty: 7, dir: 'u' }, { x: 4, y: 16, to: 'prarmor', tx: 4, ty: 7, dir: 'u' }, { x: 18, y: 16, to: 'prcafe', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T('woman', 6, 12, { wander: 2, talk: talkS('OLD WOMAN', 'HAVE YOU HEARD? THE GHOST SENT A LETTER. HE SAYS HE\'LL MARRY THE DIVA LYNDA. HE SAYS HE\'LL TAKE HER DURING THE SHOW.') }),
    T('man', 17, 12, { wander: 2, talk: talkS('REBEL', 'IN PRESTIGE EVERYONE IS IMPORTANT. I\'M IMPORTANT. I DON\'T KNOW WHY. NOBODY TELLS YOU WHY.') }),
    T('exec', 12, 9, { talk: talkS('CHANCELLOR', 'THE OPERA HOUSE IS SOUTHEAST OF TOWN. TONIGHT: "THE SAVE AND THE SLOT." A CLASSIC. EVERYONE DIES. THEN THEY CONTINUE.') }),
  ],
  enter: async () => { if (!flag('prestigeIn')) { setFlag('prestigeIn'); obj('THE MOVIE STAR RUNS THE OPERA. HIS MANSION IS AT THE TOP OF TOWN.', 'starhouse', 7, 3); } },
};
MAPS.starhouse = INT(['################', '#B.B.B..T.B.B.B#', '#..............#', '#....;;;;;;....#', '#....;;;;;;....#', '#.t..;;;;;;..t.#', '#..............#', '#..o........o..#', '#######D########'], { name: 'THE MOVIE STAR\'S MANSION', theme: 'opera', music: 'prestige',
  exits: [{ x: 7, y: 8, to: 'prestige', tx: 11, ty: 7, dir: 'd' }],
  npcs: () => [T('exec', 7, 3, { id: 'star', P: ART.pal('exec'), talk: () => starMansion() })] });
MAPS.prinn = INT(['########', '#b.b.b.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'PRESTIGE INN', music: 'prestige', saves: [[1, 5]], exits: [{ x: 4, y: 7, to: 'prestige', tx: 4, ty: 11, dir: 'd' }], npcs: () => [T('man', 3, 2, { dir: 'd', talk: () => inn(200, 'INNKEEPER') })] });
MAPS.prshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'PRESTIGE BOUTIQUE', music: 'prestige', exits: [{ x: 4, y: 7, to: 'prestige', tx: 18, ty: 11, dir: 'd' }],
  npcs: () => [T('clerk', 3, 2, { dir: 'd', talk: () => shop('BOUTIQUE', ['meal', 'coffee', 'extralife', 'patch', 'tent', 'warp', 'bomb', 'ice', 'battery', 'shades', 'earbuds', 'coffeemug', 'firewall', 'sneakers'], 'SHOPKEEPER') })] });
MAPS.prarmor = INT(['########', '#B.B.B.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'PRESTIGE ARMORY', music: 'prestige', exits: [{ x: 4, y: 7, to: 'prestige', tx: 4, ty: 17, dir: 'd' }],
  npcs: () => [T('guard', 3, 2, { dir: 'd', talk: () => shop('ARMORY', ['rod4', 'bong4', 'lance4', 'torch4', 'mic4', 'cane4', 'toy4', 'dart4', 'armor4', 'robe2', 'helm4', 'strap', 'focuslens'], 'SHOPKEEPER') })] });
MAPS.prcafe = INT(['########', '#._._._#', '#......#', '#.t..t.#', '#......#', '#.t..t.#', '#......#', '####D###'], { name: 'THE CAFE', music: 'prestige', exits: [{ x: 4, y: 7, to: 'prestige', tx: 18, ty: 17, dir: 'd' }],
  npcs: () => [T('diva', 5, 4, { talk: talkS('THE DIVA', 'I\'M LYNDA. WITH A Y. EVERYONE REMEMBERS IT WITH AN I. I DON\'T KNOW WHY. I\'VE NEVER BEEN AN I.', 'A GHOST WANTS TO MARRY ME? I\'VE NEVER EVEN MET A GHOST. I\'M NOT GOING ON TONIGHT. I\'M STAYING RIGHT HERE WITH THIS SCONE.') })] });
// ---------------- THE OPERA ----------------
MAPS.opera1 = { name: 'THE OPERA', theme: 'opera', music: 'operalobby',
  rows: ['####################', '#B.......DD.......B#', '#..................#', '#..:::::::::::::...#', '#..:............:..#', '#..:..t......t..:..#', '#..:............:..#', '#..:..t......t..:..#', '#..:............:..#', '#..::::::;;:::::...#', '#........;;........#', '#*.......;;.......*#', '#........;;........#', '#........;;........#', '#........;;........#', '#########DD#########'],
  exits: [{ x: 9, y: 15, w: 2, to: 'world', wx: 34, wy: 104 }, { x: 9, y: 1, w: 2, to: 'oprafters', tx: 1, ty: 7, dir: 'r', if: () => flag('ariaDone') && !flag('bruce2Done') }],
  npcs: () => [T('exec', 9, 10, { id: 'star', talk: () => operaLobby() })], saves: [[2, 12]],
  enter: async () => { if (flag('starPlan') && !flag('ariaDone')) obj('THE MOVIE STAR IS WAITING IN THE LOBBY.', 'opera1', 9, 10); },
};
MAPS.oprafters = { name: 'THE RAFTERS', theme: 'opera', music: 'danger', dungeon: 1,
  rows: (() => { const b = MB(28, 14, '~'); b.frame(0, 0, 28, 14, '#');
    // a catwalk that zigzags across the rafters, with a few dead ends
    const walk = [[1, 7], [6, 7], [6, 2], [12, 2], [12, 6], [19, 6], [19, 2], [25, 2], [25, 4], [22, 4], [22, 9], [14, 9], [14, 12], [26, 12]];
    for (let k = 0; k < walk.length - 1; k++) { const [x0, y0] = walk[k], [x1, y1] = walk[k + 1]; for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) b.put(x, y, ':'); }
    b.rect(2, 10, 8, 1, ':').rect(2, 10, 1, 3, ':'); b.rect(8, 4, 3, 1, ':'); b.put(0, 7, ':'); return b.rows(); })(),
  exits: [], solid: [],
  steps: { '26,12': async () => { if (!flag('bruce2Done')) await raftersBruce(); }, '25,12': async () => { if (!flag('bruce2Done')) await raftersBruce(); } },
  enc: { forms: forms('G'), bg: 'opera' },
  enter: async () => { if (!flag('bruce2Done')) { obj('BRUCE IS AT THE FAR END OF THE RAFTERS, ABOVE THE STAGE.', 'oprafters', 26, 12); if (!G.timer) G.timer = { left: 60 * 300, end: () => raftersTooLate() }; } },
};
// ---------------- THE BROADCAST: Spooky Ghost's flying studio ----------------
MAPS.broadcast = { name: 'THE BROADCAST', theme: 'train', music: 'ghost', bg: '#2449b6',
  rows: ['  ################  ', ' #..............t.# ', '#..o....::....o....#', '#.......::.........#', '#.t.....::.....t...#', '#.......DD.........#', '#..................#', '#.o..............o.#', ' #................# ', '  ################  '],
  exits: [{ x: 8, y: 5, w: 2, to: 'ghoststudio', tx: 6, ty: 7, dir: 'u' }, { x: 16, y: 2, to: 'world', wx: 0, wy: 0, if: () => flag('ghostJoined'), run: () => leaveBroadcast() }],
  signs: { '16,1': async () => { if (flag('ghostJoined')) await say('THE HELM. STEP IN FRONT OF IT TO TAKE THE SHIP OUT.'); } },
  npcs: () => [T('woman', 15, 6, { if: () => flag('ghostJoined'), talk: async () => { const c = await ask('THE BROADCAST IS READY. WHERE TO?', 'SPOOKY GHOST', ['FLY THE SHIP', 'STAY ABOARD']); if (c === 0) await leaveBroadcast(); }, draw: (n, x, y) => draw(ART.hero.ghost.d[0], x, y, ART.hero.ghost.P) })],
  saves: [[3, 6]],
  under: () => { for (let i = 0; i < 30; i++) { const x = (i * 83 + frame * 2) % (W + 40) - 20, y = (i * 47) % H; circF(x, y, 8 + (i % 3) * 3, hex('#dbdbff')); } },
};
MAPS.ghoststudio = INT(['############', '#T..B..B..T#', '#..........#', '#...;;;;...#', '#...;;;;...#', '#..........#', '#..t....t..#', '#..........#', '######D#####'], { name: 'THE STUDIO', theme: 'opera', music: 'ghost',
  exits: [{ x: 6, y: 8, to: 'broadcast', tx: 8, ty: 6, dir: 'd' }],
  npcs: () => [T('ghost', 6, 3, { if: () => !flag('ghostJoined'), talk: () => ghostWheel() }), T('linda', 3, 4, { if: () => !flag('ghostJoined') && flag('lindaTaken') })],
  enter: async () => { if (flag('lindaTaken') && !flag('ghostJoined')) obj('SPOOKY GHOST IS AT THE BACK OF THE STUDIO.', 'ghoststudio', 6, 3); } });
// ---------------- FRANCHISE CITY ----------------
MAPS.fcity = { name: 'FRANCHISE CITY', theme: 'factory', music: 'fcity',
  rows: (() => { const b = MB(26, 22, '.'); b.frame(0, 0, 26, 22, '#'); b.rect(1, 1, 24, 3, '#'); b.put(12, 3, 'D').put(13, 3, 'D'); b.rect(12, 4, 2, 18, ':'); b.rect(2, 11, 22, 1, ':');
    b.house(2, 6, 7, 3, 5).house(17, 6, 7, 3, 20).house(2, 14, 7, 3, 5).house(17, 14, 7, 3, 20); b.house(9, 17, 3, 2).house(14, 17, 3, 2);
    for (const [x, y] of [[10, 6], [15, 6], [10, 13], [15, 13]]) b.put(x, y, '*'); b.put(12, 21, ':').put(13, 21, ':'); return b.rows(); })(),
  exits: [{ x: 12, y: 21, w: 2, to: 'world', wx: 84, wy: 100 }, { x: 12, y: 3, w: 2, to: 'factory1', tx: 1, ty: 8, dir: 'r', if: () => !flag('factoryDone') },
    { x: 12, y: 3, w: 2, to: 'palace', tx: 9, ty: 14, dir: 'u', if: () => flag('dinnerInvite') && !flag('dinnerDone') },
    { x: 5, y: 8, to: 'fcinn', tx: 4, ty: 7, dir: 'u' }, { x: 20, y: 8, to: 'fcshop', tx: 4, ty: 7, dir: 'u' }, { x: 5, y: 16, to: 'fcarmor', tx: 4, ty: 7, dir: 'u' }, { x: 20, y: 16, to: 'fchouse', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T('trooper', 11, 4, { dir: 'd', if: () => !flag('factoryOpen'), talk: talkS('LICENSEE', 'THE FACTORY IS CLOSED TO THE PUBLIC. THE PUBLIC IS CLOSED TO THE FACTORY. EVERYONE IS SAFE.') }),
    T('woman', 7, 11, { wander: 2, talk: talkS('OLD WOMAN', 'EVERYTHING HERE IS LICENSED. MY HOUSE. MY CAT. I PAY A LITTLE EVERY MONTH TO KEEP REMEMBERING MY HUSBAND. IT\'S VERY REASONABLE.') }),
    T('child', 18, 11, { wander: 2, talk: talkS('KID', 'THE FACTORY HUMS AT NIGHT. MY MOM SAYS IT\'S THE MACHINES. I THINK IT\'S SINGING.') }),
  ],
  enter: async () => { if (!flag('fcityIn')) await fcityArrive(); },
};
MAPS.fcinn = INT(['########', '#b.b.b.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'LICENSED INN', theme: 'factory', music: 'fcity', saves: [[1, 5]], exits: [{ x: 4, y: 7, to: 'fcity', tx: 5, ty: 9, dir: 'd' }], npcs: () => [T('trooper', 3, 2, { dir: 'd', talk: () => inn(300, 'INNKEEPER') })] });
MAPS.fcshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'LICENSED GOODS', theme: 'factory', music: 'fcity', exits: [{ x: 4, y: 7, to: 'fcity', tx: 20, ty: 9, dir: 'd' }],
  npcs: () => [T('trooper', 3, 2, { dir: 'd', talk: () => shop('LICENSED GOODS', ['meal', 'feast', 'coffee', 'espresso', 'extralife', 'patch', 'tent', 'warp', 'bomb', 'ice', 'battery'], 'SHOPKEEPER') })] });
MAPS.fcarmor = INT(['########', '#B.B.B.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'LICENSED ARMORY', theme: 'factory', music: 'fcity', exits: [{ x: 4, y: 7, to: 'fcity', tx: 5, ty: 17, dir: 'd' }],
  npcs: () => [T('trooper', 3, 2, { dir: 'd', talk: () => shop('LICENSED ARMORY', ['rod5', 'bong5', 'lance5', 'torch5', 'mic5', 'cane5', 'toy5', 'dart5', 'armor5', 'robe2', 'helm5', 'strap', 'focuslens', 'sneakers'], 'SHOPKEEPER') })] });
MAPS.fchouse = INT(['########', '#b..B..#', '#......#', '#..t...#', '#......#', '#......#', '#......#', '####D###'], { name: 'A HOUSE', theme: 'factory', music: 'fcity', exits: [{ x: 4, y: 7, to: 'fcity', tx: 20, ty: 17, dir: 'd' }], chests: [[1, 3, 'espresso', 1], [6, 3, 'turbobutton', 1]] });
// ---------------- THE FACTORY ----------------
const FAC = (rows, o) => Object.assign({ theme: 'factory', music: 'factory', dungeon: 1, rows, enc: { forms: forms('H'), bg: 'factory' } }, o);
MAPS.factory1 = FAC(['##############################', '#...B.....#::::::::#.....B...#', '#.........#::::::::#.........#', '#..####...#........#...####..#', '#..#  #........o.......#  #..#', '#..####::::::::::::::::####..#', '#......:..............:......#', '#..o...:..t........t..:...o..#', '........::::::::::::::::......', '#......:..............:......#', '#..####::::::::::::::::####..#', '#..#  #................#  #..#', '#..####...#........#...####..#', '#.........#::::::::#.........#', '#...B.....#::::::::#.....B...#', '##############################'], { name: 'THE FACTORY',
  exits: [{ x: 0, y: 8, to: 'fcity', tx: 12, ty: 4, dir: 'd' }, { x: 29, y: 8, to: 'factory2', tx: 1, ty: 8, dir: 'r' }],
  chests: [[1, 1, 'feast', 1], [28, 14, 'espresso', 1], [15, 4, 'chain']], enter: async () => obj('THE EXTRACTION FLOOR IS DEEPER IN.', 'factory2', 12, 8) });
MAPS.factory2 = FAC(['########################', '#T.T.T.T.T.#.T.T.T.T.T.#', '#..........#...........#', '#..........#...........#', '#.....o....#....o......#', '#......................#', '#....::::::::::::::....#', '#....:............:....#', '.....:.....;;.....:.....', '#....:............:....#', '#....::::::::::::::....#', '#......................#', '#.....o....#....o......#', '#..........#...........#', '#..........#...........#', '#T.T.T.T.T.#.T.T.T.T.T.#', '#########DDDDD##########', '########################'], { name: 'THE EXTRACTION FLOOR',
  exits: [{ x: 0, y: 8, to: 'factory1', tx: 28, ty: 8, dir: 'l' }, { x: 9, y: 16, w: 5, to: 'factory3', tx: 1, ty: 4, dir: 'r', if: () => flag('extractorDone') }],
  steps: { '11,8': async () => { if (!flag('extractorDone')) await extractorScene(); }, '12,8': async () => { if (!flag('extractorDone')) await extractorScene(); } },
  enter: async () => { if (!flag('extractorDone')) obj('THE MACHINE IN THE MIDDLE OF THE FLOOR.', 'factory2', 11, 8); } });
MAPS.factory3 = FAC(['##########################', '#::::::::::::::::::::::::#', '#:~~~~~~~~~~~~~~~~~~~~~~:#', '#:~~~~~~~~~~~~~~~~~~~~~~:#', '::~~~~~~~~~~~~~~~~~~~~~~::', '#:~~~~~~~~~~~~~~~~~~~~~~:#', '#:~~~~~~~~~~~~~~~~~~~~~~:#', '#::::::::::::::::::::::::#', '##########################'], { name: 'THE CONVEYOR', music: 'danger',
  exits: [{ x: 25, y: 4, to: 'fcity', tx: 12, ty: 4, dir: 'd', run: () => conveyorOut() }], enc: null,
  enter: async () => { if (!flag('factoryDone')) await conveyorEscape(); } });
// ---------------- THE MEMORY CARD: the gate to the spirits' world ----------------
MAPS.gate = { name: 'THE MEMORY CARD', theme: 'spirit', music: 'memory', color: 1,
  rows: ['##################', '#~~~~~~~DD~~~~~~~#', '#~~~~~~~..~~~~~~~#', '#~T~~~~~..~~~~~T~#', '#~~~~~~~..~~~~~~~#', '#......,..,......#', '#...*..,..,..*...#', '#......,..,......#', '#......,..,......#', '#..o...,..,...o..#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '#......,..,......#', '#########..#######'],
  exits: [{ x: 9, y: 14, w: 2, to: 'world', wx: 106, wy: 104 }],
  signs: { '8,1': () => gateDoor(), '9,1': () => gateDoor(), '8,2': () => gateDoor(), '9,2': () => gateDoor() },
  enter: async () => { if (!flag('gateOpen')) obj('THE GATE. IT\'S SHAPED LIKE A SAVE SLOT.', 'gate', 8, 2); },
};
// ---------------- the palace: THE MERGER DINNER ----------------
MAPS.palace = { name: 'THE FRANCHISOR\'S PALACE', theme: 'castle', music: 'dinner',
  rows: ['####################', '#B*....T..T....*..B#', '#..................#', '#...t..t..t..t.....#', '#..______________..#', '#...t..t..t..t.....#', '#..................#', '#;;;;;;;;;;;;;;;;;;#', '#..................#', '#.o..............o.#', '#..................#', '#*................*#', '#........;;........#', '#........;;........#', '#........;;........#', '#########DD#########'],
  exits: [{ x: 9, y: 15, w: 2, to: 'fcity', tx: 12, ty: 4, dir: 'd' }],
  npcs: () => [T('suit', 9, 2, { id: 'franchisor', talk: () => mergerDinner() }), T('exec', 4, 6, { P: ART.pal('suit'), talk: talkS('BACKUP FACE', 'THE FRANCHISOR KEEPS HIS WORD. I\'VE READ ALL OF HIS WORDS. THEY\'RE IN THE HANDBOOK.') })],
  enter: async () => obj('THE FRANCHISOR IS AT THE HEAD OF THE TABLE.', 'palace', 9, 2),
};
// ---------------- THE CLOUD ----------------
const CLD = (rows, o) => Object.assign({ theme: 'cloud', music: 'cloud', dungeon: 1, rows, bg: '#24dbff', enc: { forms: forms('I'), bg: 'cloud' } }, o);
MAPS.cloud1 = CLD(['~~~~~~~~~~~~~~~~~~~~~~~~~~~', '~~~...~~~~~~~~~~~~~~~~~~~~~', '~~.....~~~~~....~~~~~~~~~~~', '~~..T...~~~~..t...~~~......', '~~.......:::::.......:::...', '~~...o...~~~~~...T...~~~..~', '~~~.....~~~~~~~.....~~~~.~~', '~~~~.:.~~~~~~~~~~.~~~~~~.~~', '~~~~.:.~~~~~~~~~~.~~~~~..~~', '~~~~.:::::::::::::::::...~~', '~~~~~~~~~~~~~~~~~~~~~~~~~~~'], { name: 'THE CLOUD',
  exits: [{ x: 3, y: 1, w: 3, to: 'world', wx: 0, wy: 0, run: () => cloudEscapeEnd() }, { x: 25, y: 3, h: 2, to: 'cloud2', tx: 1, ty: 7, dir: 'r' }],
  chests: [[5, 5, 'espresso', 1], [17, 4, 'armor5']], enter: async () => { if (!flag('escaping')) obj('THE CLOUD GOES ON TO THE EAST.', 'cloud2', 1, 7); } });
MAPS.cloud2 = CLD(['~~~~~~~~~~~~~~~~~~~~~~~~~~', '~~~~~~~~~~~~~TTT~~~~~~~~~~', '~~~~~~~~~~~~#####~~~~~~~~~', '~~~~~~~~~~~~#DDD#~~~~~~~~~', '~~~~....~~~~.....~~~~~~~~~', '~~~..T...~~~.....~~...~~~~', '~~.......:::::::::::....~~', '..........~~~~~~~~~~.....~', '~~...o....~~~~~~~~~~..T..~', '~~~.......~~~~~~~~~~.....~', '~~~~~~~~~~~~~~~~~~~~~~~~~~'], { name: 'THE CLOUD',
  exits: [{ x: 0, y: 7, to: 'cloud1', tx: 24, ty: 4, dir: 'l' }, { x: 13, y: 3, w: 3, to: 'slots', tx: 8, ty: 12, dir: 'u' }],
  steps: { '14,5': async () => { if (!flag('firewallDone')) await firewallBoss(); }, '13,5': async () => { if (!flag('firewallDone')) await firewallBoss(); }, '15,5': async () => { if (!flag('firewallDone')) await firewallBoss(); } },
  chests: [[5, 8, 'blinker'], [22, 8, 'feast', 2]], enter: async () => { if (flag('escaping')) return; if (!flag('firewallDone')) obj('SOMETHING IS GUARDING THE GATE IN THE MIDDLE OF THE CLOUD.', 'cloud2', 14, 5); } });
MAPS.slots = { name: 'THE THREE SLOTS', theme: 'tower', music: 'slots', color: 1,
  rows: ['##################', '#~~~~~~~~~~~~~~~~#', '#~~T~~~~T~~~~T~~~#', '#~~:~~~~:~~~~:~~~#', '#..:....:....:...#', '#................#', '#................#', '#................#', '#................#', '#................#', '#................#', '#................#', '#................#', '########DD########'],
  exits: [{ x: 8, y: 13, w: 2, to: 'cloud2', tx: 14, ty: 4, dir: 'd' }],
  enter: async () => { if (!flag('newGame')) await slotsScene(); } };
