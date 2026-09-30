'use strict';
// ================= CARL 2: maps for episodes 2-7 =================
// ---------------- the desert + Garf's diner ----------------
MAPS2.desert = { theme: 'desert', name: 'NEVADA (ABOVE)', music: () => F2('special') ? 'special' : 'desert',
  rows: rows(`
####################::######################
#######............,::......."......########
#######..,......,...::.........,..,.########
#######...,.,"....."::....".........########
#######...T.........::........",...,########
#######...,...."....::........T.....########
#...........,.....".::..............########
#.".."......,...T...::...................""#
#..,....T.......,...::."...........".......#
#..,..".....t.".....::......T.......t......#
#......"........"...::,......".......".,...#
#..........,....".."::........"".........,.#
#.,,##########......::.",."..,...T.......,.#
#...##########......::,..t.................#
#...##########.,.t.,::..,...........,.....,#
#...##########,.....::......o....,.....T...#
#...##########....".::...""................#
#.."####DD####.*....::,....................#
#...,,,,,,,,,,,.....::,..........=======...#
#...,,,,,,,,,,,.....::..",.T.....=.."..=,..#
#...,,,,,,,,,,,.....::"...,.,....=.....=...#
#...,,,,,,,,,,,,..,.::."...,.....=.....=,..#
#"....,..,...."T....::.........t.=.....=...#
#.....t.......,.....::,".........==..===...#
####............."..::............T........#
####..,.....T.......::.......,........######
####...,,........,..::.,,,........."..######
####..........o.....::..T...,.".......######
####............."..::................######
####################::######################`),
  exits: [
    { x: 8, y: 17, w: 2, h: 1, to: 'diner', tx: 9, ty: 10, dir: 'u' },
    { x: 20, y: 0, w: 2, h: 1, to: 'lake', tx: 2, ty: 7, dir: 'r', if: () => F2('vanDown'), no: () => say(F2('garfJoined') ? 'THE ROAD NORTH IS BLOCKED BY A WHITE VAN. IT HAS A DISH ON IT. IT\'S LISTENING.' : 'THE ROAD NORTH GOES TO LAKE MEAD. SOMEBODY SHOULD FIND OUT WHY FIRST. (TALK TO GARFIELD.)') },
  ],
  ents: () => [
    { id: 'busstop', tx: 23, ty: 26, spr: CS.busstop, P: CP.board, label: 'BUS STOP', talk: () => busBack(), reach: 6 },
    { id: 'hitch', tx: 27, ty: 21, spr: () => CS.people.hitch, anim: 40, label: 'HITCHHIKER', talk: () => hitchTalk2() },
    { id: 'hatch', tx: 36, ty: 20, draw: e => drawHatch(e), hw: 10, hh: 6, label: 'HATCH', talk: () => hatchTalk2() },
    shipIf('desert'),
  ].filter(Boolean),
  spawns: [{ k: 'tumble', x: 30, y: 14 }, { k: 'tumble', x: 12, y: 24 }, { k: 'jack', x: 34, y: 27 }, { k: 'jack', x: 8, y: 6 }, { k: 'tumble', x: 26, y: 5, if: () => F2('vanDown') },
    { k: 'suit', x: 30, y: 17, if: () => C2.ep >= 5 }, { k: 'suit', x: 16, y: 25, if: () => C2.ep >= 5 }, { k: 'drone', x: 12, y: 4, if: () => C2.ep >= 4 }],
  arena: { x: 14, y: 1, w: 15, h: 9, flag: 'vanDown', if: () => F2('garfJoined'), start: () => vanStart(), waves: [], done: () => vanDown() },
  signs: { '15,17': () => say('GARF\'S DINER. OPEN 25 HOURS. "IF YOU CAN READ THIS SIGN, YOU\'VE BEEN DRIVING TOO LONG."') },
};
function drawHatch(e) { const x = e.x - camX, y = e.y - camY; rectF(x - 10, y - 10, 20, 12, hex('#6d6d6d')); rectF(x - 8, y - 8, 16, 8, F2('special') || C2.ep >= 6 ? hex('#101010') : hex('#8f8f8f')); rectF(x - 2, y - 6, 4, 2, hex('#ffdb24')); }
const shipIf = m => (F2('ship') || m === 'backlot' || m === 'moon') ? shipEnt(SHIPPAD[m].x, SHIPPAD[m].y) : null;
Object.assign(SHIPPAD, { desert: pad('desert', 29, 26), lake: pad('lake', 26, 7), backlot: pad('backlot', 14, 24), moon: pad('moon', 5, 21) });

MAPS2.diner = { theme: 'diner', name: 'GARF\'S DINER', music: () => F2('special') ? 'special' : WD.arena ? 'boss' : 'diner',
  rows: rows(`
####################
####################
#T...**.....**...T.#
#..................#
#.t.t.t......____..#
#..................#
#.t.t.t............#
#..................#
#......o.o.o.......#
#..................#
#..................#
#########DD#########`),
  exits: [{ x: 9, y: 11, w: 2, h: 1, to: 'desert', tx: 8, ty: 18, dir: 'd' }],
  arena: { x: 1, y: 2, w: 18, h: 9, flag: 'liteDown', if: () => F2('liteFound'), start: () => liteStart(), waves: [], done: () => garfJoins() },
  ents: () => [
    { id: 'garf', tx: 3, ty: 3, spr: CS.garf, P: CP.garf, anim: 40, label: 'JB GARFIELD', talk: () => garfTalk2(), if: () => !F2('garfJoined') },
    { id: 'waitress', tx: 15, ty: 3, spr: () => CS.people.waitress, anim: 36, label: 'WAITRESS', reach: 18, talk: () => waitressTalk(), if: () => !F2('liteFound') },
    { id: 'cup', tx: 14, ty: 4, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 3, y - 18, 6, 6, WHITE); rectF(x - 2, y - 18, 3, 1, hex('#ff49db')); }, solid: 0, reach: 16, talk: () => clue('clue1', 'A coffee cup. There\'s lipstick on it. Pink. Very pink. Franchise pink.'), if: () => F2('case') && !F2('liteFound') },
    { id: 'coupon', tx: 5, ty: 7, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 5, y - 6, 10, 5, hex('#ff92c8')); rectF(x - 4, y - 5, 3, 3, WHITE); }, solid: 0, talk: () => clue('clue2', 'A coupon. "LINDA LITE: A LITTLE LESS LINDA. 10% OFF." It\'s warm. Someone just dropped it.'), if: () => F2('case') && !F2('liteFound') },
  ],
  signs: { '1,2': () => F2('case') && !F2('liteFound') ? clue('clue3', 'The jukebox is stuck on one song. "LITE! LITE! A LITTLE LESS LINDA!" Who put that on. Who\'s been putting that on.') : say('THE JUKEBOX PLAYS SOMETHING FROM 1998. IT\'S ALWAYS 1998 IN THE JUKEBOX.'),
    '17,2': () => F2('liteFound') && !C2.tapes.includes(2) ? tapeAt(2, 'There\'s a tape in the other jukebox. Where the records go. Somebody filed it under G.') : say('THE OTHER JUKEBOX. IT ONLY PLAYS THE B-SIDES.'),
    '14,4': () => say('THE COUNTER. SOMEBODY CARVED "CARL WAS HERE" INTO IT. THEN "NO HE WASN\'T." THEN "YES HE WAS."') },
};

// ---------------- Lake Mead ----------------
MAPS2.lake = { theme: 'lake', name: 'LAKE MEAD', music: () => WD.arena ? 'human' : F2('special') ? 'special' : 'lake',
  rows: rows(`
####################################
####################################
####################################
####################################
....T.."....T..........."T.....T...#
.."..........................."....#
:::::::::.......".""...............#
:::::::::....."............t......"#
:::::::::."..................""....#
........"t.......".."....."."....T.#
..."...".""......"....t............#
#,,,,,,,,,,,,,,,:::,,,,,,,,,,,,,,,,#
#,,,,,,,,,,,,,,,:::,,,,,,,,,,,,,,,,#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~:::~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~#
####################################`),
  exits: [{ x: 0, y: 6, w: 1, h: 3, to: 'desert', tx: 20, ty: 1, dir: 'd' }],
  enter: () => lakeEnter(),
  arena: { x: 1, y: 4, w: 34, h: 9, flag: 'huSkirmish', if: () => F2('bruceMet'), start: () => humanSkirmish(), waves: [], done: () => {} },
  ents: () => [
    { id: 'boat', tx: 17, ty: 21, spr: CS.ass, P: CP.ass, anim: 30, solid: 0, label: 'THE A.S.S. (A BOAT)', reach: 10, talk: () => boatTalk(), if: () => !F2('jumped') },
    { id: 'hocL', tx: 14, ty: 9, spr: CS.hoc, P: CP.hoc, anim: 40, label: 'HEAD OF CONTENT', talk: () => lakeCommittee(), if: () => !F2('jumped') },
    { id: 'legalL', tx: 20, ty: 9, draw: e => drawLegal(e), label: 'LEGAL', talk: () => lakeCommittee(), if: () => !F2('jumped') },
    { id: 'bruce', tx: 22, ty: 12, spr: CS.shark, P: CP.shark, anim: 30, label: 'BRUCE', talk: () => bruceTalk(), if: () => F2('jumped') && C2.comp !== 'bruce' },
    { id: 'tBruce', tx: 17, ty: 18, spr: CS.tape, P: CP.item, solid: 0, talk: () => tapeAt(4, 'A tape on the dock. Wet. It smells like shark. I know what shark smells like now.'), if: () => F2('jumped') && !C2.tapes.includes(4) },
    shipIf('lake'),
  ].filter(Boolean),
  spawns: [{ k: 'drone', x: 10, y: 8, if: () => F2('jumped') }, { k: 'figure', x: 28, y: 9, if: () => F2('jumped') }, { k: 'focus', x: 6, y: 9, if: () => C2.ep >= 3 }],
  signs: { '17,11': () => say('DOCK 219. THE SIGN IS NEW. THE DOCK IS OLD. THE NUMBER IS ALWAYS 219.') },
};

// ---------------- the PRETEND CO. backlot + the crossover sets ----------------
MAPS2.backlot = { theme: 'backlot', name: 'PRETEND CO. BACKLOT', music: () => WD.arena ? 'boss' : F2('special') ? 'special' : 'backlot',
  rows: rows(`
########################################
#.##########...##########...##########.#
#.##########...##########...##########.#
#.##########...##########...##########.#
#.##########...##########...##########.#
#.##########...##########...##########.#
#.##########...##########...##########.#
#.##########...##########...##########.#
#.####DD####...####DD####...####DD####.#
#::::::::::::::::::::::::::::::::::::::#
#::::::::::::::::::::::::::::::::::::::#
#............,.....::...,.........,...,#
#.............t....::.....t............#
#,..T,,............::...........,..T...#
#..................::.......,,,....,...#
#....,..t......,...::................,.#
#...,........,.....::...........,......#
#.....,............::.....,.,..t.......#
#,.....,..,...,....::.......,..........#
#..,.............,.::........,.........#
#...........*......::......*......,,...#
#..,.....,.........::..................#
#,..T........,.....::..............T...#
#.,......t......,..::........t.........#
#..o...............::...............o..#
#.........,......,.::.....,............#
#::::::::::::::::::::::::::::::::::::::#
#::::::::::::::::::::::::::::::::::::::#
#..................::..................#
########################################`),
  exits: [
    { x: 6, y: 8, w: 2, h: 1, to: 'setface', tx: 11, ty: 14, dir: 'u' },
    { x: 19, y: 8, w: 2, h: 1, to: 'setpk', tx: 3, ty: 10, dir: 'u' },
    { x: 32, y: 8, w: 2, h: 1, to: 'setyoko', tx: 11, ty: 14, dir: 'u' },
  ],
  enter: () => backlotEnter(),
  ents: () => [
    shipIf('backlot'),
    { id: 'legalB', tx: 20, ty: 12, draw: e => drawLegal(e), label: 'LEGAL', talk: () => legalConsent(), if: () => !F2('xoverDown') },
    { id: 'ghostB', tx: 30, ty: 15, spr: CS.ghost, P: YOKO_TRUE ? CP.ghost : legacyPal(CP.ghost, 'red'), anim: 20, label: 'SPOOKY GHOST', talk: () => ghostTalk2() },
    { id: 'tower', tx: 4, ty: 18, draw: e => { const x = e.x - camX, y = e.y - camY; for (const dx of [-14, 12]) rectF(x + dx, y - 40, 3, 40, hex('#6d6d6d')); lineF(x - 14, y - 10, x + 14, y - 34, hex('#6d6d6d')); lineF(x - 14, y - 34, x + 14, y - 10, hex('#6d6d6d')); rectF(x - 22, y - 78, 44, 40, hex('#b6b6a0')); rectF(x - 22, y - 78, 44, 3, hex('#dbdbc8')); for (let k = 0; k < 4; k++) rectF(x - 22 + k * 11, y - 75, 1, 37, hex('#8f8f7a')); rectF(x - 26, y - 84, 52, 7, hex('#8f8f7a')); text('PRETEND', x - 20, y - 66, hex('#db2424'), 0); text('CO.', x - 8, y - 56, hex('#db2424'), 0); }, hw: 16, hh: 5, noPrompt: 1, talk: () => say('THE PRETEND CO. WATER TOWER. THE WATER IS ALSO PRETEND. IT IS STILL VERY HEAVY.') },
    { id: 'cart2', tx: 27, ty: 20, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 12, y - 14, 24, 10, hex('#ffffff')); rectF(x - 12, y - 22, 24, 3, hex('#ffdb24')); rectF(x - 11, y - 20, 2, 8, hex('#6d6d6d')); rectF(x + 9, y - 20, 2, 8, hex('#6d6d6d')); circF(x - 8, y - 3, 3, hex('#242424')); circF(x + 8, y - 3, 3, hex('#242424')); }, hw: 12, hh: 5, noPrompt: 1, talk: () => C('A golf cart. For the studio. Nobody here has ever golfed. It\'s a status cart.', 'n') },
    { id: 'bin', tx: 34, ty: 24, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 10, y - 12, 20, 12, hex('#dbb624')); rectF(x - 10, y - 12, 20, 2, hex('#ffdb24')); text('$1', x - 6, y - 10, hex('#492410'), 0); }, hw: 10, hh: 5, label: 'BARGAIN BIN', talk: () => bargainBin() },
  ].filter(Boolean),
  spawns: [{ k: 'fan', x: 8, y: 20, if: () => F2('xoverDown') }, { k: 'drone', x: 30, y: 25 }],
  drawUnder() { for (const [n, x] of [['1', 6], ['2', 19], ['3', 32]]) { const sx = x * 16 - camX + 2, sy = 2 * 16 - camY; rectF(sx - 6, sy, 40, 40, hex('#101014')); text(n, sx + 4, sy + 6, hex('#ffdb24'), BLACK, 5); } text('PRETEND CO. STUDIOS', 15 * 16 - camX + 8, 16 - camY + 2, hex('#ffffff'), BLACK); },
  arena: { x: 8, y: 12, w: 24, h: 11, flag: 'xoverDown', if: () => F2('sig_face') && F2('sig_pk') && F2('sig_yoko'), start: () => xoverStart(), waves: [], done: () => xoverDown() },
  signs: { '5,8': () => say('STAGE 1: "FACE: WHAT COULD HAPPEN." A NOTE ON THE DOOR: "RETURNED UNOPENED."'), '18,8': () => say('STAGE 2: "PEE KID³." ANOTHER NOTE: "PLEASE KNOCK. HE\'S IN THE BATHROOM."'), '31,8': () => say(PERMA_YOKO ? 'STAGE 3: "YOKO LTD." THE SIGN USED TO SAY PRETEND CO. SHE BOUGHT THE SIGN.' : 'STAGE 3: "YOKO: WHAT HAPPENED." THE DOOR IS OPEN. IT WAS ALWAYS GOING TO BE OPEN.') },
};
MAPS2.setface = { theme: 'face', name: 'STAGE 1: THE STREAM', music: () => WD.arena ? 'xover' : 'xover',
  rows: rows(`
########################
########################
########################
#.T.,.T...T...T...T....#
#.,......,....,....,...#
#......,...............#
#..............,...,...#
#......,...............#
#.,.,........,...,....,#
#...........,..,.......#
#...t,.........,..,t..,#
#..............,.,....,#
#......,...t...........#
#.,..,.,...............#
#,..,...............,..#
###########DD###########`),
  exits: [{ x: 11, y: 15, w: 2, h: 1, to: 'backlot', tx: 6, ty: 9, dir: 'd' }],
  ents: () => [{ id: 'face', tx: 12, ty: 5, draw: e => drawFaceHead(e), hw: 12, hh: 6, label: 'NEW FACE', reach: 10, talk: () => faceTalk2() }],
  arena: { x: 1, y: 6, w: 22, h: 8, flag: 'faceClear', start: () => say('THE CHAT HAS BECOME HOSTILE.'), waves: [[['bubble', 5, 8], ['bubble', 18, 8], ['bubble', 11, 11], ['bubble', 7, 12]], [['bubble', 4, 7], ['bubble', 19, 7], ['drone', 11, 9], ['bubble', 15, 12], ['bubble', 8, 12]]], done: () => C('Okay. Chat\'s calm. Chat\'s... chat. Let\'s talk to the head.', 'n') },
};
function drawFaceHead(e) { const x = e.x - camX, y = e.y - camY - 20 + Math.sin(WD.t * .05) * 3; drawScaled(FS.new[(WD.t >> 4) % 3], x - 14, y - 16, FP.new, 1.2); }
MAPS2.setpk = { theme: 'school', name: 'STAGE 2: THE SCHOOL', music: 'xover',
  rows: rows(`
##############################
##############################
#########################D####
#............................#
#..........................T.#
#............................#
#,,,,,,,,,,,,,,,,,,,,,,,,,,,,#
#............................#
#............................#
#.......t.......t.....t......#
#............................#
##DD##########################`),
  exits: [{ x: 2, y: 11, w: 2, h: 1, to: 'backlot', tx: 19, ty: 9, dir: 'd' }],
  ents: () => [{ id: 'pk', tx: 26, ty: 4, draw: e => drawPK(e), label: 'PEE KID', talk: () => pkTalk2(), hw: 8 }],
  arena: { x: 1, y: 3, w: 24, h: 8, flag: 'pkClear', start: () => say('THE ADULTS HAVE NOTICED YOU. THEY ALWAYS NOTICE.'), waves: [[['adult', 8, 5], ['adult', 16, 8], ['adult', 21, 5]], [['adult', 6, 8], ['adult', 13, 4], ['adult', 20, 9], ['fan', 10, 6]]], done: () => C('Okay. The adults are... resting. Let\'s find the kid.', 'n') },
  signs: { '25,2': () => say('BOYS\' ROOM. OCCUPIED. IT HAS BEEN OCCUPIED SINCE 1998.') },
};
function drawPK(e) { const x = e.x - camX, y = e.y - camY, s = KID.kid.stand; drawScaled(s, x - s.w * .35, y - s.h * .7, KIDPAL.kid, .7); }
MAPS2.setyoko = { theme: 'office', name: PERMA_YOKO ? 'STAGE 3: YOKO LTD.' : 'STAGE 3: THE OFFICE', music: 'xover',
  rows: rows(`
########################
########################
########################
#T....................T#
#.........____.........#
#..t...t.......t...t...#
#......................#
#......................#
#......................#
#..t...t.......t...t...#
#......................#
#........;;;;;;........#
#........;;;;;;........#
#T....................T#
#......................#
###########DD###########`),
  exits: [{ x: 11, y: 15, w: 2, h: 1, to: 'backlot', tx: 32, ty: 9, dir: 'd' }],
  ents: () => [{ id: 'yoko', tx: 12, ty: 3, draw: e => drawYoko2(e), label: PERMA_YOKO ? 'THE EMPRESS' : 'YOKO', reach: 18, talk: () => yokoTalk2(), hw: 8 }],
  arena: { x: 1, y: 6, w: 22, h: 8, flag: 'yokoClear', start: () => say('THE YOKOIDS ARE ON THEIR BREAK. YOU ARE INTERRUPTING THEIR BREAK.'), waves: [[['yokoid', 5, 7], ['yokoid', 18, 7], ['yokoid', 8, 12], ['yokoid', 15, 12]], [['yokoid', 4, 10], ['yokoid', 19, 10], ['yokoid', 11, 8], ['drone', 11, 13]]], done: () => C('Okay. The office is quiet. Offices should be quiet. That\'s the one thing I know about offices.', 'n') },
};
function drawYoko2(e) { const x = e.x - camX, y = e.y - camY, s = YS.walk.d[(WD.t >> 5) & 1]; draw(s, x - s.w / 2, y - s.h, PERMA_YOKO ? YP.walk.map((c, i) => i === 6 || i === 7 ? hex('#db2449') : c) : YP.walk); }

// ---------------- the Red Moon ----------------
MAPS2.moon = { theme: 'moon', name: 'THE RED MOON (NON-CANON)', music: 'moon',
  rows: rows(`
####################################
#.........".############"......"...#
#.....".....############...........#
#...........############...........#
#...T.......############......T....#
#....;....;.############...........#
#.......;...############...........#
#...........#####DD#####........o..#
#;..............::::.."............#
#.;...t.........::::...............#
#...............::::......t........#
#......"........::::...............#
#..o......""..;.::::...........t...#
#.................;............."..#
#...."....;..;t..."................#
#.......T..........................#
#".............;......;.....T......#
#...................;.............;#
#.............."...................#
#,,,,,,,,,.........................#
#,,,,,,,,,........T......o.........#
#,,,,,,,,,........".;..........;...#
#,,,,,,,,,o.;..............."....T.#
#,,,,,,,,,............t............#
#,,,,,,,,,............."...."......#
####################################`),
  exits: [],
  enter: () => moonEnter(),
  ents: () => [
    shipIf('moon'),
    { id: 'comrade', tx: 17, ty: 10, spr: () => [carlSprite('d', 0, 0, CP.comrade), carlSprite('d', 1, 0, CP.comrade)], P: CP.comrade, anim: 40, label: 'COMRADE CARL', talk: () => comradeTalk() },
    { id: 'tBlanket', tx: 30, ty: 14, haze: 1, spr: CS.tape, P: CP.item, solid: 0, talk: () => tapeAt(6, 'A tape. Half buried in red dust. It\'s labeled with a blanket. Just a drawing of a blanket.'), if: () => !C2.tapes.includes(6) },
  ].filter(Boolean),
  spawns: [{ k: 'cosmo', x: 8, y: 6 }, { k: 'cosmo', x: 27, y: 8 }, { k: 'cosmo', x: 24, y: 18 }, { k: 'cosmo', x: 12, y: 16 }, { k: 'drone', x: 30, y: 20 }],
  signs: { '17,7': () => say('COMRADE CARL\'S OFFICE. HE\'S OUTSIDE. HE IS ALWAYS OUTSIDE. OUTSIDE IS FOR EVERYONE.') },
};

// ---------------- the facility below Nevada + the warehouse below below ----------------
MAPS2.facility = { theme: 'lab', name: 'THE FACILITY', music: 'facility', dark: 1,
  rows: rows(`
################################
#.S....#########################
#....,,#########################
#....,,#########################
#....,,#########################
###..###########################
###..##......................###
###..##......................###
###..##......................###
###..#######.#######.#####..####
###..####.......#.......##..####
###..####.T...T.#.T...T.##..####
###..####.......#.......##..####
###..####.......#.......##..####
###..####..._...#..._...##..####
###..####.......#.......##..####
###..#####################..####
###..#####################..####
###..#####################..####
###..........................###
###..........................###
######.....#################...#
######.t...#################..S#
################################`),
  exits: [{ x: 2, y: 1, w: 1, h: 1, to: 'desert', tx: 36, ty: 22, dir: 'd' }, { x: 30, y: 22, w: 1, h: 1, to: 'below', tx: 3, ty: 26, dir: 'u' }],
  enter: () => facilityEnter(),
  ents: () => [
    { id: 'tCell', tx: 8, ty: 22, haze: 1, spr: CS.tape, P: CP.item, solid: 0, talk: () => tapeAt(7, 'The bed. It\'s small. It was always small. Under the mattress, on the other side from last time: another tape. The B-side.'), if: () => !C2.tapes.includes(7) },
    { id: 'tube1', tx: 18, ty: 12, solid: 0, noPrompt: 1, talk: () => C('There\'s a guy in the tube. He has a chin. He has MY hat. There\'s a label: "HU-MAN, BATCH 4." There were three before him.', 'w') },
  ],
  spawns: [{ k: 'suit', x: 4, y: 12 }, { k: 'suit', x: 14, y: 7 }, { k: 'suit', x: 24, y: 7 }, { k: 'suit', x: 12, y: 12 }, { k: 'suit', x: 20, y: 13 }, { k: 'suit', x: 16, y: 19 }, { k: 'drone', x: 26, y: 15 }],
  signs: { '1,4': () => say('A SIGN: "CONTAINMENT." SOMEBODY TAPED OVER IT: "CONTENT."'), '7,21': () => say('CELL 00. THE DOOR IS OPEN. IT WAS NEVER LOCKED FROM THE INSIDE. HE CHECKED. EVERY NIGHT.') },
};
MAPS2.below = { theme: 'lost', name: 'BELOW BELOW', music: () => WD.arena ? 'boss' : 'below', dark: 1,
  rows: rows(`
########################################
#.............______D______............#
#......................................#
#.TTTTTT......................TTTTTTT..#
#.TTTTTT......................TTTTTTT..#
#......................................#
#......................................#
#......................................#
#.TTTTTT......................TTTTTTT..#
#.TTTTTT......................TTTTTTT..#
#......................................#
#TTTTTTTTTTTTTTTTTT..TTTTTTTTTTTTTTTTTT#
#......................................#
#.TT...TT...TT...TT...TT...TT...TT...TT#
#.TT...TT...TT...TT...TT...TT...TT...TT#
#......................................#
#......................................#
#.TT...TT...TT...TT...TT...TT...TT...TT#
#......................................#
#TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT...T#
#......................................#
#..tt....tt....tt....tt....tt....tt....#
#......................................#
#.TTTTTTTTT...TTTTTTTTTTTT...TTTTTTTTT.#
#......................................#
#......................................#
#......................................#
#::::::::::::::::::::::::::::::::::::::#
#::::::::::::::::::::::::::::::::::::::#
########################################`),
  exits: [{ x: 20, y: 1, w: 1, h: 1, to: 'lostfound', tx: 7, ty: 3, dir: 'd', if: () => F2('hocDown'), no: () => say('A DOOR. EMPLOYEES ONLY. SOMETHING IS BETWEEN YOU AND IT. SOMEONE.') }],
  enter: () => belowEnter(),
  tick() { if (WD.t % 420 === 210 && WD.haze <= 0 && WD.ents.some(e => typeof e.solid === 'function' && e.solid() && Math.hypot(e.x - PL.x, e.y - PL.y) < 120)) tickChat(pick(CHATTERS2), pick(['smoke near the piles', 'the piles look different when its wavy', 'try the haze carl', 'C button. trust me', 'the lost stuff moves when you smoke'])); },
  ents: () => [
    { id: 'pile1', tx: 19, ty: 11, draw: e => drawPile(e), hw: 16, hh: 8, solid: () => WD.haze <= 0 && !F2('pilesDown'), noPrompt: 1, talk: () => WD.haze > 0 || F2('pilesDown') ? null : say('LOST STUFF. A LOT OF IT. PILED UP. IN THE HAZE IT MIGHT LOOK DIFFERENT.') },
    { id: 'pile2', tx: 36, ty: 19, draw: e => drawPile(e), hw: 16, hh: 8, solid: () => WD.haze <= 0 && !F2('pilesDown'), noPrompt: 1, talk: () => WD.haze > 0 || F2('pilesDown') ? null : say('MORE LOST STUFF. SOMEBODY LOST A LOT OF THINGS. SOMEBODY LOST EVERYTHING.') },
    { id: 'bigone', tx: 36, ty: 13, draw: e => drawBong(bigOne(), e.x - camX, e.y - camY - 10), solid: 0, label: 'THE BIG ONE', talk: () => getBigOne(), if: () => !F2('bigone') },
    { id: 'towel', tx: 6, ty: 21, solid: 0, noPrompt: 1, talk: () => say('A TOWEL. SOMEBODY THREW IT IN. THE TAG SAYS "TP." YOU DON\'T KNOW WHO THAT IS. NOBODY DOES.') },
    { id: 'lostface', tx: 12, ty: 21, solid: 0, noPrompt: 1, talk: () => say('ONE FACE. IT\'S IN A BAG. THE BAG SAYS "OLD. STILL WARM."') },
    { id: 'photo', tx: 24, ty: 21, solid: 0, noPrompt: 1, talk: () => say('A PHOTO OF A KID OUTSIDE A BATHROOM. NUMBER 17. HE LOOKS LIKE HE REALLY HAS TO GO.') },
    { id: 'shoplist', tx: 30, ty: 21, solid: 0, noPrompt: 1, talk: () => say('A SHOPPING LIST IN VERY NEAT HANDWRITING: "MILK. EGGS. A NEW GENERATION."') },
  ],
  spawns: [{ k: 'umbrella', x: 8, y: 24 }, { k: 'umbrella', x: 28, y: 24 }, { k: 'mask', x: 18, y: 16 }, { k: 'mask', x: 6, y: 13 }, { k: 'umbrella', x: 30, y: 16 }, { k: 'mask', x: 25, y: 12 }, { k: 'figure', x: 12, y: 16 }],
  arena: { x: 8, y: 2, w: 24, h: 8, flag: 'hocDown', start: () => hocStart(), waves: [], done: () => hocDown() },
};
function drawPile(e) { const x = e.x - camX, y = e.y - camY; if (F2('pilesDown')) { for (let i = 0; i < 9; i++) rectF(x - 26 + (i * 11) % 48, y - 6 + ((i * 3) % 6), 10, 4, hex(['#926d49', '#db2424', '#2449b6', '#dbb624', '#b6b6b6'][i % 5])); return; } if (WD.haze > 0 && ((WD.t >> 2) & 1)) return; for (let i = 0; i < 9; i++) rectF(x - 16 + (i * 7) % 28, y - 20 + ((i * 5) % 14), 10, 8, hex(['#926d49', '#db2424', '#2449b6', '#dbb624', '#b6b6b6'][i % 5])); }
MAPS2.studio = { theme: 'studio', name: 'STUDIO 219', music: () => WD.arena ? 'human' : 'boogaloo', noComp: 0, enter: () => studioResume(),
  arena: { x: 1, y: 3, w: 24, h: 10, flag: 'huDown', if: () => F2('finaleOn'), start: () => finalePhase1(), waves: [], done: () => finalePhase2() },
  rows: rows(`
##########################
##########################
##########################
#.....*............*.....#
#.T....................T.#
#........................#
#........................#
#........................#
#........................#
#........................#
#........................#
#.t....................t.#
#........................#
#===========..===========#
#,,,,,,,,,,,,,,,,,,,,,,,,#
#,,,,,,,,,,,,,,,,,,,,,,,,#
#,,,,,,,,,,,,,,,,,,,,,,,,#
############DD############`),
  exits: [],
  ents: () => [],
};
