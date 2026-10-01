'use strict';
// ================= SAVE THE WORLD: maps, part 2 — GARFEILD, the station, THE RERUN EXPRESS, the plains, THE PORT =================
// ---------------- GARFEILD: the diner town ----------------
MAPS.garfeild = { name: 'GARFEILD', theme: 'town', music: 'garfeild',
  rows: (() => { const b = MB(26, 22, '.');
    b.frame(0, 0, 26, 22, 'T'); b.rect(1, 1, 24, 1, '='); b.rect(12, 7, 2, 15, ':'); b.rect(3, 7, 20, 1, ':');
    b.house(7, 2, 12, 5, 12).put(13, 6, 'D');
    b.house(2, 9, 6, 3, 4).house(18, 9, 6, 3, 20).house(2, 15, 6, 3, 4).house(18, 15, 6, 3, 20);
    for (const [x, y] of [[10, 9], [15, 9], [10, 14], [15, 14], [10, 19], [15, 19]]) b.put(x, y, '*');
    b.scatter(',', 30, 61, '.'); b.scatter('t', 6, 62, '.', [2, 12, 22, 8]); b.put(12, 21, ':').put(13, 21, ':'); for (const [x, y] of [[4, 12], [20, 12], [4, 18], [20, 18]]) b.put(x, y, '.');
    return b.rows(); })(),
  exits: [{ x: 12, y: 21, w: 2, to: 'world', wx: 98, wy: 55 }, { x: 12, y: 6, w: 2, to: 'diner', tx: 7, ty: 8, dir: 'u' },
    { x: 4, y: 11, to: 'gfhouse', tx: 6, ty: 8, dir: 'u' }, { x: 20, y: 11, to: 'gfhouse2', tx: 6, ty: 8, dir: 'u' },
    { x: 4, y: 17, to: 'gfinn', tx: 4, ty: 7, dir: 'u' }, { x: 20, y: 17, to: 'gfshop', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T('licensee2', 12, 19, { who: 'trooper', dir: 'u', if: () => flag('gfArrive') && !flag('gfCleared'), talk: talkS('LICENSEE', 'THE TOWN IS BEING LICENSED. PLEASE STAND BEHIND THE YELLOW LINE. THERE IS NO YELLOW LINE. STAND BEHIND IT ANYWAY.') }),
    T('waitress', 8, 13, { wander: 2, if: () => flag('gfCleared'), talk: async () => { if (flag('cacheCleared')) await say('HAVE WE MET? YOU LOOK LIKE SOMEONE WHO\'S EATEN HERE. EVERYONE DOES. NOBODY REMEMBERS.', 'WAITRESS'); else await say('GARF\'S BEEN RUNNING THE DINER FOR THIRTY YEARS. HE SAYS HE\'S A DETECTIVE. HE\'S NEVER SOLVED A CASE. HE\'S NEVER LOST ONE EITHER.', 'WAITRESS'); } }),
    T('man', 17, 13, { wander: 2, if: () => flag('gfCleared'), talk: talkS('REBEL', 'THE SIGN SAYS GARFEILD. IT\'S SPELLED WRONG. GARF SAYS IT WAS LIKE THAT WHEN HE GOT HERE. IT WASN\'T.') }),
  ],
  enter: async () => { if (!flag('gfArrive')) await garfeildArrive(); },
};
MAPS.diner = INT(['################', '#B..t..t..t..B.#', '#..............#', '#.t..t..t..t...#', '#..............#', '#.____________.#', '#..............#', '#.o.........o..#', '#######D########'], { name: 'THE DINER', theme: 'inside', music: 'diner',
  exits: [{ x: 7, y: 8, to: 'garfeild', tx: 12, ty: 7, dir: 'd' }],
  npcs: () => [
    T('garfield', 7, 4, { id: 'jb', if: () => !flag('garfieldJoined'), talk: async () => { if (flag('cacheCleared')) return; await say('I\'M BUSY. I\'M WATCHING THE DOOR. A DETECTIVE WATCHES THE DOOR.', 'JB GARFIELD'); } }),
    T('waitress', 4, 6, { if: () => true, talk: async () => { if (flag('cacheCleared')) await say('...SORRY, WHO\'S THAT CAT? HE KEEPS SITTING IN THE BOOTH LIKE HE OWNS IT.', 'WAITRESS'); else await say('COFFEE? WE ONLY HAVE COFFEE. GARF SAYS A DINER IS A PLACE THAT HAS COFFEE AND A DOOR.', 'WAITRESS'); } }),
    T('cook', 11, 6, { talk: () => shop('THE DINER', ['snack', 'meal', 'coffee', 'antivirus', 'extralife', 'tent'], 'COOK') }),
  ], saves: [[13, 2]] });
MAPS.gfhouse = INT(['##########', '#b..B..b.#', '#........#', '#..t..o..#', '#........#', '#........#', '#........#', '#........#', '######D###'], { name: 'A HOUSE', music: 'garfeild',
  exits: [{ x: 6, y: 8, to: 'garfeild', tx: 4, ty: 12, dir: 'd' }], chests: [[2, 3, 'coffee', 2]],
  npcs: () => [T('elder', 5, 5, { wander: 1, talk: talkS('THE ARCHIVIST', 'I DON\'T KNOW WHO THAT CAT IS, BUT HE BRINGS ME SOUP. HE SAYS HE\'S DONE IT FOR YEARS. HE SEEMS NICE. HE SEEMS SAD.') })] });
MAPS.gfhouse2 = INT(['##########', '#b..B....#', '#........#', '#..t.....#', '#........#', '#....o...#', '#........#', '#........#', '######D###'], { name: 'A HOUSE', music: 'garfeild',
  exits: [{ x: 6, y: 8, to: 'garfeild', tx: 20, ty: 12, dir: 'd' }], chests: [[7, 3, 'cane3', 1]] });
MAPS.gfinn = INT(['########', '#b.b.b.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'GARFEILD INN', music: 'garfeild', saves: [[1, 5]],
  exits: [{ x: 4, y: 7, to: 'garfeild', tx: 4, ty: 18, dir: 'd' }], npcs: () => [T('man', 3, 2, { dir: 'd', talk: () => inn(80, 'INNKEEPER') })] });
MAPS.gfshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'GARFEILD OUTFITTERS', music: 'garfeild',
  exits: [{ x: 4, y: 7, to: 'garfeild', tx: 20, ty: 18, dir: 'd' }], npcs: () => [T('clerk', 3, 2, { dir: 'd', talk: () => shop('OUTFITTERS', ['rod3', 'bong3', 'lance3', 'torch3', 'mic3', 'cane3', 'toy3', 'dart3', 'vest', 'robe', 'helm3', 'coffeemug', 'firewall'], 'SHOPKEEPER') })] });
// ---------------- THE STATION and THE RERUN EXPRESS ----------------
MAPS.station = { name: 'THE STATION', theme: 'forest', music: 'station',
  rows: (() => { const b = MB(20, 14, '.'); b.frame(0, 0, 20, 14, 'T'); b.rect(1, 1, 18, 3, '#').put(9, 3, 'D').put(10, 3, 'D'); b.rect(1, 4, 18, 2, ':'); b.rect(9, 6, 2, 8, ':'); b.scatter('"', 20, 71, '.'); b.scatter('T', 8, 72, '.', [1, 7, 18, 6]); b.put(4, 5, '*').put(15, 5, '*'); return b.rows(); })(),
  exits: [{ x: 9, y: 13, w: 2, to: 'world', wx: 82, wy: 64 }, { x: 9, y: 3, w: 2, to: 'train1', tx: 1, ty: 4, dir: 'r', no: () => !flag('pilotHired') && !!say('THE TRAIN DOOR WON\'T OPEN. THE SIGN SAYS "BOARDING BY INVITATION."') }],
  npcs: () => [T('pilotx', 13, 6, { if: () => !flag('pilotHired'), talk: () => hirePilot() })],
  enter: async () => { if (!flag('pilotHired')) obj('A MAN IN A HEADBAND IS WAITING ON THE PLATFORM.', 'station', 13, 6); },
};
const CAR = (rows, o) => Object.assign({ theme: 'train', music: 'train', dungeon: 1, rows }, o);
MAPS.train1 = CAR(['####################', '#.t..t..t..t..t..t.#', '#..................#', '#,,,,,,,,,,,,,,,,,,#', 'D..................D', '#,,,,,,,,,,,,,,,,,,#', '#..................#', '#.t..t..t..t..t..t.#', '####################'], { name: 'THE RERUN EXPRESS: COACH',
  exits: [{ x: 19, y: 4, to: 'train2', tx: 1, ty: 4, dir: 'r' }, { x: 0, y: 4, to: 'station', tx: 9, ty: 4, dir: 'd', no: () => !!say('THE PLATFORM IS GONE. THE TRAIN IS ALREADY MOVING. IT WAS ALWAYS MOVING.') }],
  npcs: () => [
    T('newfile', 4, 2, { draw: (n, x, y) => drawGhostNpc(x, y, 0), talk: talkS('A PASSENGER', 'I WAS A SITCOM. THIRTEEN EPISODES. THEY AIRED SIX. THE OTHER SEVEN ARE ON THIS TRAIN WITH ME. WE DON\'T TALK.') }),
    T('newfile', 12, 6, { draw: (n, x, y) => drawGhostNpc(x, y, 1), talk: talkS('A PASSENGER', 'THE TRAIN TAKES CANCELED THINGS TO THE OTHER SIDE. THE OTHER SIDE OF WHAT, NOBODY SAYS.') }),
    T('newfile', 16, 2, { draw: (n, x, y) => drawGhostNpc(x, y, 2), talk: talkS('A PASSENGER', 'IF THE TRAIN GIVES YOU TROUBLE, TELL IT TO CONTINUE. IT HATES THAT. IT HATES BEING TOLD IT CAN KEEP GOING.') }),
  ], enc: { forms: forms('E'), bg: 'train' }, chests: [[1, 6, 'extralife', 2]] });
MAPS.train2 = CAR(['####################', '#._._._._._._._._..#', '#..................#', '#..t...t...t...t...#', 'D..................D', '#..t...t...t...t...#', '#..................#', '#..____............#', '####################'], { name: 'THE RERUN EXPRESS: DINING CAR', saves: [[17, 6]],
  exits: [{ x: 0, y: 4, to: 'train1', tx: 18, ty: 4, dir: 'l' }, { x: 19, y: 4, to: 'train3', tx: 1, ty: 4, dir: 'r' }],
  npcs: () => [T('cook', 5, 6, { draw: (n, x, y) => drawGhostNpc(x, y, 3), talk: () => shop('DINING CAR', ['snack', 'meal', 'coffee', 'extralife', 'antivirus', 'earplugs', 'tent'], 'COOK') })] });
MAPS.train3 = CAR(['####################', '#oo.....B......B.oo#', '#..................#', '#.:::::::::::::::::#', 'D.:...............:#', '#.:::::::::::::::::#', '#..................#', '#oo..............oo#', '####################'], { name: 'THE RERUN EXPRESS: ENGINE',
  exits: [{ x: 0, y: 4, to: 'train2', tx: 18, ty: 4, dir: 'l' }],
  steps: { '17,4': async () => { if (!flag('trainDone')) await trainBoss(); } },
  enter: async () => { if (!flag('trainDone')) obj('THE FRONT OF THE ENGINE.', 'train3', 17, 4); }, enc: { forms: forms('E'), bg: 'train' } });
function drawGhostNpc(x, y, k) { const P = ART.hero.ghost.P.map((c, i) => i ? mix(c, [hex('#b6dbff'), hex('#ffb6db'), hex('#dbffb6'), hex('#ffdb92')][k], .45) : 0); draw(ART.hero.ghost.d[(frame >> 4) & 1 ? 1 : 2], x, y + Math.sin(frame * .1 + k) * 1.5, P); }
// ---------------- the plains: a bus stop where a kid has been waiting ----------------
MAPS.busstop = { name: 'THE PLAINS OF WAITING', theme: 'forest', music: 'plains',
  rows: (() => { const b = MB(18, 14, '"'); b.rect(0, 6, 18, 2, ':'); b.rect(8, 8, 2, 6, ':'); b.put(6, 5, 't').put(11, 5, '*'); b.scatter('.', 30, 81, '"'); return b.rows(); })(),
  exits: [{ x: 0, y: 6, h: 2, to: 'world', wx: 84, wy: 81 }, { x: 17, y: 6, h: 2, to: 'world', wx: 88, wy: 81 }, { x: 8, y: 13, w: 2, to: 'world', wx: 86, wy: 82 }],
  npcs: () => [T('kid', 9, 5, { if: () => !flag('kidJoined'), talk: () => kidWaiting() })],
  enter: async () => { if (!flag('kidJoined')) obj('A KID IS SITTING AT THE BUS STOP.', 'busstop', 9, 5); },
};
// ---------------- THE PORT ----------------
MAPS.port = { name: 'THE PORT', theme: 'town', music: 'port',
  rows: (() => { const b = MB(22, 18, '.'); b.rect(0, 0, 22, 4, '~'); b.rect(8, 0, 6, 6, ';'); b.rect(0, 4, 22, 1, '='); b.put(9, 4, ';').put(10, 4, ';').put(11, 4, ';').put(12, 4, ';');
    b.house(1, 7, 6, 3, 3).house(15, 7, 6, 3, 17).house(1, 12, 6, 3, 3); b.rect(10, 6, 2, 12, ':'); b.scatter('o', 6, 91, '.', [1, 5, 20, 2]); b.put(10, 17, ':').put(11, 17, ':'); return b.rows(); })(),
  exits: [{ x: 10, y: 17, w: 2, to: 'world', wx: 50, wy: 87 }, { x: 3, y: 9, to: 'portinn', tx: 4, ty: 7, dir: 'u' }, { x: 17, y: 9, to: 'portshop', tx: 4, ty: 7, dir: 'u' }, { x: 3, y: 14, to: 'portbar', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    T('sailor', 10, 5, { if: () => flag('lindaJoined'), talk: async () => { const c = await ask('THE FERRY GOES SOUTH TO PRESTIGE. ALL ABOARD?', 'SAILOR', ['ALL ABOARD', 'NOT YET']); if (c === 0) await ferrySouth(); } }),
    T('sailor', 4, 15, { wander: 2, talk: talkS('SAILOR', 'THE SOUTH CONTINENT? PRESTIGE AND THE OPERA ON THE WEST SIDE. FRANCHISE CITY ON THE EAST. MOUNTAINS IN BETWEEN. YOU\'D NEED SOMETHING THAT FLIES.') }),
  ],
  enter: async () => { if (!flag('lindaJoined')) await portReunion(); },
};
MAPS.portinn = INT(['########', '#b.b.b.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'THE PORT INN', music: 'port', saves: [[1, 5]], exits: [{ x: 4, y: 7, to: 'port', tx: 3, ty: 10, dir: 'd' }], npcs: () => [T('man', 3, 2, { dir: 'd', talk: () => inn(120, 'INNKEEPER') })] });
MAPS.portshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'SHIP CHANDLER', music: 'port', exits: [{ x: 4, y: 7, to: 'port', tx: 17, ty: 10, dir: 'd' }],
  npcs: () => [T('sailor', 3, 2, { dir: 'd', talk: () => shop('SHIP CHANDLER', ['snack', 'meal', 'coffee', 'extralife', 'patch', 'tent', 'warp', 'rod3', 'bong3', 'lance3', 'mic3', 'toy3', 'dart3', 'vest', 'helm3', 'sneakers'], 'SAILOR') })] });
MAPS.portbar = INT(['########', '#B._._B#', '#......#', '#.t..t.#', '#......#', '#.t..t.#', '#......#', '####D###'], { name: 'THE GALLEY', music: 'port', exits: [{ x: 4, y: 7, to: 'port', tx: 3, ty: 15, dir: 'd' }], chests: [[1, 5, 'strap', 1]],
  npcs: () => [T('man', 5, 4, { talk: talkS('SAILOR', 'THERE\'S A SHARK IN THE HARBOR. NOT A BIG ONE. A MEDIUM ONE. HE SAYS HELLO TO EVERYONE. HE SAYS HE\'S NOT SUPPOSED TO BE HERE.') })] });
