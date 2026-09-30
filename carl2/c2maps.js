'use strict';
// ================= CARL 2: maps. legend in c2tiles.js. ents talk through c2story.js =================
const rows = s => s.split('\n').map(r => r.replace(/\s+$/, '')).filter(r => r.length);
const pad = (map, x, y) => ({ map, x, y }); // where the A.S.S. lands on a map

// ---------------- the A.S.S. (interior) ----------------
MAPS2.ship = { theme: 'ship', name: 'THE A.S.S.', music: () => F2('special') ? 'special' : 'ship', noObjArrow: 0,
  rows: rows(`
################
#~~~~######~~~~#
#TT....._.....o#
#..............#
#.;;...........#
#.;;.......t...#
#..............#
#*............*#
#......::......#
#######DD#######`),
  exits: [{ x: 7, y: 9, w: 2, h: 1, to: 'lot', tx: 6, ty: 11, dir: 'd' }],
  init() { const pd = SHIPPAD[C2.shipAt || 'lot']; Object.assign(MAPS2.ship.exits[0], { to: pd.map, tx: pd.x, ty: pd.y + 1 }); },
  ents: () => [
    { id: 'radio', tx: 8, ty: 3, spr: CS.radio, P: CP.item, label: 'DISPATCH', talk: () => dispatchRadio(), solid: 0 },
    { id: 'save', tx: 13, ty: 3, spr: CS.savebox, P: CP.item, label: 'SAVE', talk: () => saveBox() },
    { id: 'nav', tx: 2, ty: 3, draw: e => drawNav(e), label: 'NAV', talk: () => navConsole(), if: () => F2('ship'), solid: 0 },
    { id: 'blanket', tx: 2, ty: 6, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 7, y - 6, 14, 6, hex('#b62424')); rectF(x - 7, y - 6, 14, 1, hex('#db4949')); pset(x - 3, y - 4, hex('#ffdb24')); }, talk: () => C(F2('shark') ? 'The blanket. Still red. Everything else got louder. The blanket stayed the same red. Respect.' : 'The red blanket. It\'s red. It came with me. Everything came with me. Except the stuff that didn\'t.', 's'), solid: 0 },
    { id: 'rack', tx: 11, ty: 4, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 10, y - 20, 20, 3, hex('#6d4924')); C2.bongs.slice(0, 4).forEach((b, i) => drawBong(b, x - 7 + i * 5, y - 24)); }, talk: () => bongMenu(), label: 'BONGS', solid: 0 },
  ],
};
const SHIPPAD = { lot: pad('lot', 5, 10), desert: pad('desert', 6, 19), lake: pad('lake', 5, 6), backlot: pad('backlot', 20, 25), moon: pad('moon', 5, 21) };
function drawNav(e) { const x = e.x - camX, y = e.y - camY; rectF(x - 9, y - 18, 18, 12, hex('#101820')); rectF(x - 8, y - 17, 16, 10, (WD.t >> 4) & 1 ? hex('#24db92') : hex('#6dffb6')); text('NAV', x - 8, y - 15, hex('#0a1a24'), 0); }
// the A.S.S., parked outside: B to get in
const shipEnt = (tx, ty) => ({ id: 'ass', tx, ty, spr: CS.ass, P: CP.ass, anim: 30, hw: 30, hh: 9, label: 'THE A.S.S.', reach: 18, talk: () => enterShip() });

// ---------------- the parking lot ----------------
MAPS2.lot = { theme: 'lot', name: 'THE LOT', music: () => F2('special') ? 'special' : 'lot',
  rows: rows(`
########################################
########################################
##################DDDD##################
::::::::::::::::::::::::::::::::::::::::
:"T"*:"T":"T"*::::::::::::*"T":"T"*:"T":
........................................
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
........................................
........................................
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
...........o............................
........................................
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
.,...,...,...,...,...,...,...,...,...,..
........................................
........................................
""""""""""""""""""""""""""""""""""""""""
========================================`),
  exits: [{ x: 18, y: 2, w: 4, h: 1, to: 'mall', tx: 17, ty: 22, dir: 'u' }],
  ents: () => [
    shipEnt(5, 9),
    { id: 'busstop', tx: 37, ty: 9, spr: CS.busstop, P: CP.board, label: 'BUS STOP', talk: () => busStop(), reach: 6 },
    { id: 'billboard', tx: 27, ty: 5, draw: e => drawBillboard(e), hw: 20, hh: 4, talk: () => billboardTalk(), solid: 1 },
    { id: 'attendant', tx: 33, ty: 14, spr: () => CS.people.clerk, anim: 40, label: 'ATTENDANT', talk: () => attendantTalk() },
    { id: 'fan', tx: 14, ty: 18, spr: () => CS.people.kidfan, anim: 24, talk: () => fanTalk(), if: () => C2.ep >= 1 },
    { id: 't219', tx: 34, ty: 19, haze: 1, spr: CS.tape, P: CP.item, solid: 0, talk: () => tapeAt(0, 'Space 219. It\'s only there when things are wavy. There\'s a tape. There\'s always a tape.'), if: () => !C2.tapes.includes(0) },
    { id: 'faceless', tx: 24, ty: 17, spr: () => CS.people.focus, anim: 36, label: '???', talk: () => facelessTalk2(), if: () => dq(1) >= 1 },
    { id: 'corral', tx: 11, ty: 14, solid: 0, noPrompt: 1, talk: () => say('CART CORRAL. PLEASE RETURN CARTS. A sticker: "THEY ALWAYS COME BACK." Somebody wrote "2" after it.') },
  ],
  spawns: [{ k: 'cart', x: 20, y: 12, if: () => C2.ep <= 2 }, { k: 'cart', x: 30, y: 17 }, { k: 'focus', x: 18, y: 6, if: () => C2.ep >= 1 && !F2('met') }, { k: 'focus', x: 21, y: 7, if: () => C2.ep >= 1 && !F2('met') }, { k: 'fan', x: 8, y: 17, if: () => C2.ep >= 4 }, { k: 'drone', x: 25, y: 15, if: () => C2.ep >= 4 }],
  signs: { '19,2': () => say('THE MALL OF THE FUTURE. NOW WITH A SEQUEL CENTER. "THE FUTURE WAS SO GOOD, WE MADE ANOTHER ONE."') },
};
function drawBillboard(e) {
  const x = e.x - camX, y = e.y - camY;
  rectF(x - 2, y - 14, 3, 14, hex('#6d6d6d')); rectF(x - 26, y - 44, 52, 30, hex('#242424')); rectF(x - 25, y - 43, 50, 28, F2('shark') ? hex('#ff6d24') : hex('#ffdb24'));
  drawScaled(CS.human.d[0], x - 24, y - 42, CP.human, .8);
  text('HU-MAN', x - 6, y - 40, hex('#101010'), 0); text('HE\'S', x - 6, y - 31, hex('#101010'), 0); text('HUMAN', x - 6, y - 23, hex('#db2449'), 0);
}

// ---------------- the Mall of the Future ----------------
MAPS2.mall = { theme: 'mall', name: 'MALL OF THE FUTURE', music: () => F2('special') ? 'special' : 'mall',
  rows: rows(`
####################################
####################################
####################################
####DD####____##DDDD####DD###DD#####
#..................................#
#..................................#
#.T..t....,,,,,,,,,,,,,,,,....t..T.#
#..................................#
#..................................#
#..S......"""..........."""......S.#
#..S......"T"..........."T"......S.#
#..S......"""..........."""......S.#
#................xx................#
#................xx................#
#..................................#
#.T..t....,,,,,,,,,,,,,,,,....t..T.#
#..................................#
#..................................#
#..................................#
#..................................#
#..................................#
#..................................#
#..................................#
###############DDDDDD###############`),
  exits: [
    { x: 15, y: 23, w: 6, h: 1, to: 'lot', tx: 19, ty: 3, dir: 'd' },
    { x: 4, y: 3, w: 2, h: 1, to: 'emporium', tx: 6, ty: 8, dir: 'u' },
    { x: 24, y: 3, w: 2, h: 1, to: 'lostfound', tx: 6, ty: 8, dir: 'u' },
    { x: 16, y: 3, w: 4, h: 1, to: 'sequel', tx: 10, ty: 14, dir: 'u', if: () => F2('appointment') || C2.ep >= 2, no: () => sequelDoorNo() },
    { x: 29, y: 3, w: 2, h: 1, to: 'mall', tx: 29, ty: 5, dir: 'd', if: () => false, no: () => say('SUITORS. CLOSED FOR A PRIVATE EVENT. THE PRIVATE EVENT IS A LINDA. THERE ARE SEVERAL.') },
  ],
  ents: () => [
    { id: 'pretzel', tx: 11, ty: 4, spr: () => CS.people.waitress, anim: 30, label: 'PRETZELS', talk: () => pretzelStand() },
    { id: 'screen', tx: 22, ty: 5, draw: e => drawLindaScreen(e), hw: 12, hh: 4, talk: () => lindaScreenTalk(), label: 'LINDA', reach: 8 },
    { id: 'guard1', tx: 16, ty: 4, spr: () => CS.people.cop, anim: 40, label: 'MALL COP', talk: () => mallCopDoor(), if: () => !F2('appointment') && C2.ep <= 1 },
    { id: 'booth', tx: 33, ty: 18, draw: e => drawPhotoBooth(e), hw: 10, hh: 6, talk: () => photoBooth2() },
    { id: 'tFountain', tx: 18, ty: 15, haze: 1, spr: CS.tape, P: CP.item, solid: 0, talk: () => tapeAt(1, 'There\'s a tape in the fountain. Somebody made a wish with a tape. That\'s not how wishes work. It\'s how tapes work.'), if: () => !C2.tapes.includes(1) },
    { id: 'fountain', x: 18 * 16, y: 13 * 16 + 14, draw: e => drawFountain(e), solid: 0, noPrompt: 1, talk: () => say(WD.haze > 0 ? 'THE FOUNTAIN. SOMETHING IS SHINING AT THE BOTTOM.' : 'THE FOUNTAIN OF THE FUTURE. THE WATER GOES UP, THEN IT GOES DOWN. JUST LIKE THE PAST.'), reach: 10 },
    { id: 'copNPC', tx: 30, ty: 8, spr: () => CS.people.cop, anim: 44, label: 'MALL COP', talk: () => copNPCTalk(), if: () => C2.ep >= 3 },
    { id: 'shopper', tx: 8, ty: 13, spr: () => CS.people.exec, anim: 20, talk: () => shopperTalk(), wander: 1 },
  ],
  spawns: [{ k: 'cop', x: 6, y: 19, if: () => C2.ep >= 2 }, { k: 'focus', x: 28, y: 18, if: () => C2.ep >= 2 }, { k: 'figure', x: 18, y: 19, if: () => C2.ep >= 3 }, { k: 'figure', x: 25, y: 9, if: () => C2.ep >= 3 }],
  signs: { '10,3': () => pretzelStand(), '4,3': () => say('THE BONG EMPORIUM. "WE HAVE THE BIG ONE." (WE DO NOT HAVE THE BIG ONE.)'), '24,3': () => say('LOST+FOUND. "YOU LOSE IT, WE FIND IT. YOU FIND IT, WE LOSE IT."'), '17,3': () => say('THE SEQUEL CENTER. BY APPOINTMENT ONLY. A SMALLER SIGN: "NO GREEN."') },
};
function drawLindaScreen(e) { const x = e.x - camX, y = e.y - camY; rectF(x - 14, y - 30, 28, 22, hex('#242424')); rectF(x - 12, y - 28, 24, 18, F2('lindaMad') ? hex('#ff2449') : hex('#ff92c8')); const lp = PORT['CEO LINDA']; drawScaled(lp.s, x - 10, y - 28, lp.P, .38); rectF(x - 1, y - 8, 2, 8, hex('#6d6d6d')); }
function drawFountain(e) { const x = e.x - camX, y = e.y - camY - 6; circF(x, y, 22, hex('#b6b6b6')); circF(x, y, 18, hex('#24b6b6')); circF(x, y, 7, hex('#dbc8c8')); for (let i = 0; i < 6; i++) { const a = i * 1.05 + WD.t * .05, r = 4 + ((WD.t + i * 9) % 20) * .6; pset(x + Math.cos(a) * r, y - 8 - Math.sin((WD.t + i * 9) % 20 / 20 * 3.14) * 10, WHITE); } rectF(x - 1, y - 14, 3, 12, hex('#92ffff')); }
function drawPhotoBooth(e) { const x = e.x - camX, y = e.y - camY; rectF(x - 12, y - 30, 24, 30, hex('#6d49b6')); rectF(x - 10, y - 28, 20, 4, hex('#ffdb24')); text('PHOTO', x - 14, y - 36, hex('#ffdb24')); rectF(x - 8, y - 22, 16, 20, hex('#242424')); rectF(x - 8, y - 22, 8, 20, hex('#db2449')); }

MAPS2.emporium = { theme: 'mall', name: 'BONG EMPORIUM', music: 'shop',
  rows: rows(`
##############
##############
#..T..T..T..T#
#............#
#.____.......#
#............#
#.t........t.#
#............#
#............#
#####DDDD#####`),
  exits: [{ x: 5, y: 9, w: 4, h: 1, to: 'mall', tx: 4, ty: 4, dir: 'd' }],
  ents: () => [
    { id: 'clerk', tx: 3, ty: 3, spr: () => CS.people.clerk, anim: 50, label: 'BONG CLERK', reach: 18, talk: () => bongShop() },
    { id: 'omatic', tx: 10, ty: 3, draw: e => drawOMatic(e), hw: 10, hh: 5, label: 'BONG-O-MATIC', talk: () => wstoryInline(bongOMatic) },
    { id: 'case', tx: 7, ty: 6, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 8, y - 16, 16, 16, hex('#92dbff')); frameRect(x - 8, y - 16, 16, 16, WHITE); if (F2('bigone')) drawBong(bigOne(), x, y - 9); else text('?', x - 2, y - 12, hex('#246d92')); }, hw: 8, hh: 4, talk: () => bigOneCase() },
  ],
};
function drawOMatic(e) { const x = e.x - camX, y = e.y - camY; rectF(x - 12, y - 30, 24, 30, hex('#6d6d92')); rectF(x - 10, y - 28, 20, 8, hex('#242449')); text('OMATIC', x - 18, y - 38, hex('#ffdb24')); rectF(x - 8, y - 26, 6, 4, (WD.t >> 3) & 1 ? hex('#6dff24') : hex('#246d24')); rectF(x + 2, y - 26, 6, 4, (WD.t >> 3) & 1 ? hex('#246d24') : hex('#6dff24')); rectF(x - 6, y - 14, 12, 8, hex('#101018')); }
const wstoryInline = fn => fn(); // talk handlers already run inside a story

MAPS2.lostfound = { theme: 'lost', name: 'LOST+FOUND', music: () => F2('special') ? 'special' : 'lost',
  rows: rows(`
##############
##############
#TTT###D###TT#
#............#
#._________..#
#............#
#.o........o.#
#............#
#............#
#####DDDD#####`),
  exits: [{ x: 5, y: 9, w: 4, h: 1, to: 'mall', tx: 24, ty: 4, dir: 'd' }, { x: 7, y: 2, w: 1, h: 1, to: 'below', tx: 3, ty: 26, dir: 'u', if: () => F2('backroom'), no: () => say('EMPLOYEES ONLY. THE DOOR IS WARM. SOMETHING BEHIND IT IS HUMMING. IT\'S HUMMING YOUR SONG. YOU DON\'T HAVE A SONG.') }],
  ents: () => [
    { id: 'lfclerk', tx: 6, ty: 3, spr: () => CS.people.clerk, anim: 60, label: 'LOST+FOUND', reach: 18, talk: () => lostFoundTalk() },
    { id: 'gate', tx: 11, ty: 4, draw: e => { if (F2('backroom')) return; const x = e.x - camX, y = e.y - camY; rectF(x - 8, y - 10, 24, 6, hex('#926d49')); rectF(x - 8, y - 10, 24, 1, hex('#b6926d')); }, hw: 14, hh: 5, solid: 1, if: () => !F2('backroom'), talk: () => say('A COUNTER GATE. STAFF ONLY. THE LATCH IS ON THE OTHER SIDE, LIKE ALL LATCHES.') },
  ],
};

// ---------------- the Sequel Center (Committee HQ) ----------------
MAPS2.sequel = { theme: 'lab', name: 'SEQUEL CENTER', music: () => WD.arena || MAPS2.sequel.boss ? 'boss' : 'committee',
  rows: rows(`
######################
######################
#T..................T#
#....................#
#.......______.......#
#....................#
#....................#
#..t..............t..#
#....................#
#....................#
#....................#
#....................#
#..t..............t..#
#....................#
#....................#
##########DD##########`),
  exits: [{ x: 10, y: 15, w: 2, h: 1, to: 'mall', tx: 17, ty: 4, dir: 'd' }],
  arena: { x: 1, y: 2, w: 20, h: 13, flag: 'roboDown', if: () => F2('power'), start: () => roboMallCop(), waves: [], done: () => roboDown() },
  ents: () => [
    { id: 'hoc', tx: 10, ty: 3, spr: CS.hoc, P: CP.hoc, anim: 40, label: 'HEAD OF CONTENT', reach: 18, talk: () => committeeTalk(), if: () => C2.ep <= 1 && !F2('ep1done') },
    { id: 'focusgrp', tx: 7, ty: 3, spr: () => CS.people.focus, anim: 30, label: 'FOCUS GROUP', reach: 18, talk: () => committeeTalk(), if: () => C2.ep <= 1 && !F2('ep1done') },
    { id: 'legal', tx: 13, ty: 3, draw: e => drawLegal(e), label: 'LEGAL', reach: 18, talk: () => committeeTalk(), if: () => C2.ep <= 1 && !F2('ep1done') },
    { id: 'poster', tx: 1, ty: 7, draw: e => { const x = e.x - camX, y = e.y - camY; rectF(x - 6, y - 40, 20, 30, hex('#ffdb24')); drawScaled(CS.human.d[0], x - 5, y - 38, CP.human, .8); }, solid: 0, noPrompt: 1, talk: () => C('A poster of a guy. He\'s wearing my hat. And my tie. Why is he wearing my tie. Where did he get a neck for my tie.', 'a') },
  ],
};
function drawLegal(e) { const x = e.x - camX, y = e.y - camY; for (let i = 0; i < 8; i++) rectF(x - 7 + (i * 3) % 4, y - 4 - i * 3, 14, 3, i & 1 ? hex('#ffffff') : hex('#dbdbdb')); rectF(x - 5, y - 20, 4, 2, hex('#242424')); rectF(x + 1, y - 20, 4, 2, hex('#242424')); }
