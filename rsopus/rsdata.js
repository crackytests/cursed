'use strict';
// ================= ROMANCING STREAM: data. weapons, techniques, spells, items, the cast's numbers, the world =================
// SaGa rules: no experience levels. weapons level up by being used, techniques are learned at weapon levels,
// hit points grow after hard fights, spells are bought. every battle raises the BATTLE RANK, every deed raises the
// EVENT RANK, and the world keeps up with both.
const SKILLS = { SWORD: 'SWORD', FENCE: 'FENCING', CLUB: 'CLUB', AXE: 'AXE', GUN: 'GUN', STAFF: 'STAFF', SLING: 'SLING', BOW: 'BOW', MIC: 'MIC', FIST: 'MARTIAL' };
// melee weapons lose reach from the back row; GUN/SLING/BOW/MIC do not
const RANGED = ['GUN', 'SLING', 'BOW', 'MIC'];
// techniques: [name, weapon level, WP, power, kind, element?]  kind: one | all | first (goes first) | two (hits twice) | crit (crits more)
const TECHS = {
  SWORD: [['SLASH', 0, 0, 1, 'one'], ['DOUBLE CUT', 2, 2, .85, 'two'], ['CROSSROAD', 5, 4, 2.2, 'one'], ['GATE BREAKER', 9, 8, 3.1, 'one'], ['LIVE CUT', 14, 12, 2.1, 'all'], ['THOUSAND', 19, 16, 4.4, 'one', 'light']],
  FENCE: [['THRUST', 0, 0, 1, 'one'], ['QUICK STAB', 2, 2, 1.4, 'first'], ['MERGER', 5, 4, 2.3, 'one'], ['HOSTILE TAKEOVER', 9, 8, 3.2, 'one'], ['GOLDEN PARACHUTE', 14, 12, 2, 'all'], ['CLOSING ARGUMENT', 19, 16, 4.2, 'one', 'light']],
  CLUB: [['BONK', 0, 0, 1, 'one'], ['BONG TOSS', 2, 2, 1.6, 'one'], ['DELIVERY', 5, 4, 2.3, 'one'], ['DESERT BUS', 9, 8, 1.7, 'all'], ['ABOVE AND BELOW', 14, 12, 3.6, 'one'], ['FINAL STOP', 19, 16, 4.6, 'one']],
  AXE: [['CHOP', 0, 0, 1, 'one'], ['KINDLING', 2, 2, 1.5, 'one'], ['SPLIT', 5, 4, 2.4, 'one'], ['BUZZCUT', 9, 8, 1.8, 'all'], ['JUDGEMENT CUT', 14, 12, 3.7, 'one'], ['WOODCHIPPER', 19, 16, 4.5, 'one']],
  GUN: [['SHOOT', 0, 0, 1, 'one'], ['DOUBLE TAP', 2, 2, .8, 'two'], ['STAKEOUT', 5, 4, 2.2, 'one'], ['RICOCHET', 9, 6, 1.5, 'all'], ['CASE CLOSED', 14, 12, 3.6, 'one'], ['LAST BULLET', 19, 16, 4.2, 'crit']],
  STAFF: [['STRIKE', 0, 0, 1, 'one'], ['SWEEP', 2, 2, 1, 'all'], ['STAFF SONG', 5, 4, 2.2, 'one'], ['MANDOLIN BASH', 9, 8, 3, 'one'], ['PROTOTYPE', 14, 12, 2.2, 'all'], ['EMPRESS WAVE', 19, 16, 4.1, 'one', 'sound']],
  SLING: [['SLING', 0, 0, 1, 'one'], ['PEBBLE RAIN', 2, 2, .9, 'all'], ['PEE SHOT', 5, 4, 2.2, 'first'], ['POTENTIAL', 9, 8, 3, 'one'], ['KID GLORY', 14, 12, 2.2, 'all'], ['BIG SPLASH', 19, 16, 4, 'one', 'water']],
  BOW: [['SNAP SHOT', 0, 0, 1, 'one'], ['TWO BIRDS', 2, 2, .85, 'two'], ['ARC SHOT', 5, 4, 2.2, 'all'], ['PIERCE', 9, 8, 3.1, 'one'], ['STILL AIR', 14, 12, 2.3, 'all'], ['FINAL BOW', 19, 16, 4.3, 'one', 'sound']],
  MIC: [['BOOM', 0, 0, 1, 'one'], ['FEEDBACK', 2, 2, 1, 'all'], ['CROON', 5, 4, 2.2, 'one'], ['ENCORE', 9, 8, 1.6, 'two'], ['LIVE FROM BEYOND', 14, 12, 2.3, 'all'], ['THE BIG NUMBER', 19, 16, 4.4, 'all', 'sound']],
  FIST: [['JAB', 0, 0, 1, 'one'], ['ONE-TWO', 2, 2, .9, 'two'], ['HAYMAKER', 5, 4, 2.3, 'crit'], ['SUPLEX', 9, 8, 3.1, 'one'], ['HUNDRED HANDS', 14, 12, 1.1, 'all'], ['FIRM HANDSHAKE', 19, 16, 4.8, 'one']],
};
// spells: bought at a school. [school, JP, kind, power, element?]
// kinds: mag | all | heal | healall | revive | stun | buff | charm | poison | cure | drain
const SCHOOLS = ['STATIC', 'CHAT', 'SIGIL', 'MANDOLIN', 'GATE', 'DEEP', 'LIVE', 'TAPE'];
// opposed pairs: learning one school locks its opposite for that character (the school feuds are ancient and stupid)
const OPPOSED = { LIVE: 'TAPE', TAPE: 'LIVE', STATIC: 'DEEP', DEEP: 'STATIC' };
const SPELLS = {
  'ZAP': ['STATIC', 2, 'mag', 18, 'static'], 'STATIC FIELD': ['STATIC', 5, 'all', 14, 'static'], 'LAG': ['STATIC', 4, 'stun', 0, 'static'], 'BLUE SCREEN': ['STATIC', 12, 'mag', 48, 'static'], 'BROWNOUT': ['STATIC', 8, 'all', 20, 'static'],
  'HEART': ['CHAT', 2, 'heal', 45], 'RAID': ['CHAT', 6, 'healall', 36], 'GG': ['CHAT', 8, 'revive', 0], 'POG': ['CHAT', 5, 'buff', 0], 'HEART EYES': ['CHAT', 7, 'charm', 0],
  'SIGIL BOLT': ['SIGIL', 3, 'mag', 22, 'curse'], 'PHASE': ['SIGIL', 4, 'buff', 0], 'EX-WIVES': ['SIGIL', 8, 'all', 24, 'curse'], 'HERMETIC': ['SIGIL', 14, 'mag', 54, 'curse'], 'WARD': ['SIGIL', 6, 'buff', 0],
  'TUNE': ['MANDOLIN', 2, 'heal', 32], 'DISCORD': ['MANDOLIN', 5, 'all', 17, 'sound'], 'LULLABY': ['MANDOLIN', 6, 'stun', 0, 'sound'], 'MANDELA': ['MANDOLIN', 10, 'all', 34, 'sound'], 'ECHO': ['MANDOLIN', 4, 'mag', 26, 'sound'],
  'BLINK': ['GATE', 2, 'mag', 20, 'gate'], 'TEAR': ['GATE', 5, 'all', 18, 'gate'], 'PASSKEY': ['GATE', 4, 'buff', 0], 'EVENT HORIZON': ['GATE', 12, 'mag', 50, 'gate'], 'PULL': ['GATE', 8, 'drain', 26, 'gate'],
  'SPLASH': ['DEEP', 2, 'mag', 16, 'water'], 'BRINE': ['DEEP', 3, 'poison', 0, 'water'], 'UNDERSTREAM': ['DEEP', 6, 'all', 20, 'water'], 'CLEANSE': ['DEEP', 5, 'cure', 30, 'water'], 'DEADWATER': ['DEEP', 12, 'mag', 46, 'water'],
  'HOT MIC': ['LIVE', 2, 'mag', 20, 'fire'], 'SPOTLIGHT': ['LIVE', 4, 'buff', 0, 'light'], 'CROWD WORK': ['LIVE', 6, 'all', 22, 'fire'], 'BROADCAST': ['LIVE', 12, 'mag', 52, 'light'],
  'REWIND': ['TAPE', 2, 'heal', 40], 'PAUSE': ['TAPE', 3, 'stun', 0, 'dark'], 'LOOP': ['TAPE', 6, 'all', 18, 'dark'], 'LATE FEE': ['TAPE', 8, 'drain', 30, 'dark'], 'ERASE': ['TAPE', 12, 'mag', 50, 'dark'],
};
const SPELL_PRICE = { 2: 100, 3: 140, 4: 200, 5: 260, 6: 320, 7: 380, 8: 600, 10: 900, 12: 1200, 14: 1500 };
// the school masters' rules of admission: buy this many spells and you are a MEMBER (discount + the good ink)
const MEMBER_AT = 3;
// items. kind: use | wpn | head | body | hands | feet | shield | acc
const ITEMS = {
  'TONIC': { k: 'use', p: 20, heal: 60, d: 'RESTORES 60 HP' }, 'SODA': { k: 'use', p: 60, heal: 160, d: 'RESTORES 160 HP' }, 'HOT POCKET': { k: 'use', p: 90, revive: 1, d: 'WAKES A FALLEN FRIEND' },
  'ENERGY DRINK': { k: 'use', p: 70, wp: 8, d: '+8 WP' }, 'GUM': { k: 'use', p: 70, jp: 8, d: '+8 JP' }, 'SMOKE BOMB': { k: 'use', p: 40, flee: 1, d: 'ESCAPE A FIGHT' },
  'PICKLE JUICE': { k: 'use', p: 30, cure: 'poison', d: 'CURES POISON' }, 'COFFEE': { k: 'use', p: 30, cure: 'sleep', d: 'WAKES THE SLEEPING' }, 'HAND MIRROR': { k: 'use', p: 50, cure: 'charm', d: 'CURES CHARM' },
  'SOLVENT': { k: 'use', p: 120, cure: 'stone', d: 'SOFTENS STONE' }, 'JUICE BOX': { k: 'use', p: 130, healall: 80, d: 'HEALS EVERYONE 80' },
  'X-BLADE': { k: 'wpn', t: 'SWORD', pow: 10, p: 0 }, 'LONGSWORD': { k: 'wpn', t: 'SWORD', pow: 16, p: 140 }, 'GATE SABER': { k: 'wpn', t: 'SWORD', pow: 24, p: 480 }, 'RED EDGE': { k: 'wpn', t: 'SWORD', pow: 34, p: 0 },
  'LETTER OPENER': { k: 'wpn', t: 'FENCE', pow: 9, p: 0 }, 'PARASOL': { k: 'wpn', t: 'FENCE', pow: 15, p: 130 }, 'PROXY RAPIER': { k: 'wpn', t: 'FENCE', pow: 23, p: 460 }, 'CROWN RAPIER': { k: 'wpn', t: 'FENCE', pow: 33, p: 0 },
  'BONG': { k: 'wpn', t: 'CLUB', pow: 10, p: 0 }, 'BAT': { k: 'wpn', t: 'CLUB', pow: 16, p: 140 }, 'BUS CLUB': { k: 'wpn', t: 'CLUB', pow: 24, p: 480 }, 'PROP PILLAR': { k: 'wpn', t: 'CLUB', pow: 34, p: 0 },
  'KITCHEN AXE': { k: 'wpn', t: 'AXE', pow: 10, p: 0 }, 'PICKAXE': { k: 'wpn', t: 'AXE', pow: 16, p: 150 }, 'FIRE AXE': { k: 'wpn', t: 'AXE', pow: 24, p: 500 }, 'JUDGEMENT': { k: 'wpn', t: 'AXE', pow: 34, p: 0 },
  'SNUB': { k: 'wpn', t: 'GUN', pow: 9, p: 0 }, 'RAYGUN': { k: 'wpn', t: 'GUN', pow: 10, p: 0 }, 'REVOLVER': { k: 'wpn', t: 'GUN', pow: 15, p: 130 }, 'PHASER': { k: 'wpn', t: 'GUN', pow: 23, p: 460 }, 'NOIR SPECIAL': { k: 'wpn', t: 'GUN', pow: 33, p: 0 },
  'BROOM': { k: 'wpn', t: 'STAFF', pow: 8, p: 0 }, 'MANDOLIN NECK': { k: 'wpn', t: 'STAFF', pow: 14, p: 120 }, 'EMPRESS ROD': { k: 'wpn', t: 'STAFF', pow: 22, p: 440 }, 'PROTO STAFF': { k: 'wpn', t: 'STAFF', pow: 32, p: 0 },
  'SLINGSHOT': { k: 'wpn', t: 'SLING', pow: 8, p: 0 }, 'WRIST ROCKET': { k: 'wpn', t: 'SLING', pow: 14, p: 120 }, 'SUPER SOAKER': { k: 'wpn', t: 'SLING', pow: 22, p: 440 }, 'POTENTIAL SLING': { k: 'wpn', t: 'SLING', pow: 32, p: 0 },
  'TOY BOW': { k: 'wpn', t: 'BOW', pow: 8, p: 0 }, 'LONG BOW': { k: 'wpn', t: 'BOW', pow: 14, p: 140 }, 'COMPOUND BOW': { k: 'wpn', t: 'BOW', pow: 22, p: 460 }, 'WINDFALL': { k: 'wpn', t: 'BOW', pow: 32, p: 0 },
  'OLD MIC': { k: 'wpn', t: 'MIC', pow: 8, p: 0 }, 'SHURE': { k: 'wpn', t: 'MIC', pow: 14, p: 120 }, 'CONDENSER': { k: 'wpn', t: 'MIC', pow: 22, p: 440 }, 'GOLD MIC': { k: 'wpn', t: 'MIC', pow: 32, p: 0 },
  'HAND WRAPS': { k: 'wpn', t: 'FIST', pow: 8, p: 0 }, 'KNUCKLES': { k: 'wpn', t: 'FIST', pow: 14, p: 130 }, 'GAUNTLET': { k: 'wpn', t: 'FIST', pow: 22, p: 450 }, 'GLITTER GLOVES': { k: 'wpn', t: 'FIST', pow: 32, p: 0 },
  'T-SHIRT': { k: 'body', def: 2, p: 0 }, 'HOODIE': { k: 'body', def: 5, p: 90 }, 'TRENCH': { k: 'body', def: 8, p: 260 }, 'WHITE SUIT': { k: 'body', def: 12, p: 700 }, 'CROWN COAT': { k: 'body', def: 16, p: 1500 }, 'STAGE ARMOR': { k: 'body', def: 20, p: 0 },
  'PAPER HAT': { k: 'head', def: 2, p: 60 }, 'HARD HAT': { k: 'head', def: 5, p: 240 }, 'PROP HELMET': { k: 'head', def: 9, p: 700 }, 'THE CROWN': { k: 'head', def: 14, p: 0 },
  'GRIP TAPE': { k: 'hands', def: 1, str: 1, p: 60 }, 'FINGERLESS GLOVES': { k: 'hands', def: 1, str: 2, p: 220 }, 'BOXING WRAPS': { k: 'hands', def: 2, str: 3, p: 700 }, 'WHITE GLOVES': { k: 'hands', def: 6, p: 0 },
  'FLIP FLOPS': { k: 'feet', def: 1, agi: 1, p: 50 }, 'SNEAKERS': { k: 'feet', def: 1, agi: 2, p: 200 }, 'WORK BOOTS': { k: 'feet', def: 3, agi: 1, p: 620 }, 'MOON BOOTS': { k: 'feet', def: 3, agi: 4, p: 0 },
  'TRAY': { k: 'shield', def: 2, p: 90 }, 'POT LID': { k: 'shield', def: 4, p: 240 }, 'SKATEBOARD': { k: 'shield', def: 4, agi: 1, p: 680 }, 'COOKIE SHEET': { k: 'shield', def: 9, p: 0 },
  'LANYARD': { k: 'acc', agi: 3, p: 120 }, 'CLASS RING': { k: 'acc', str: 3, p: 160 }, 'MOOD RING': { k: 'acc', int: 4, p: 160 }, 'SPEED LACES': { k: 'acc', agi: 4, p: 420 }, 'CHAMPION BELT': { k: 'acc', str: 4, def: 2, p: 520 },
  'SUBSCRIBER PIN': { k: 'acc', def: 3, str: 2, agi: 2, int: 2, p: 0 }, 'BUS PASS': { k: 'acc', agi: 2, int: 2, p: 0 }, 'MIRROR SHARD': { k: 'acc', int: 3, imm: 'charm', p: 0 }, 'LEFT SOCK': { k: 'acc', str: 2, def: 2, p: 0 }, 'SAILOR KNOT': { k: 'acc', def: 4, agi: 2, p: 0 }, 'FOUND RECEIPT': { k: 'acc', int: 5, p: 0 }, 'THE OTHER CROWN': { k: 'acc', str: 3, def: 3, int: 3, p: 0 },
};
// the bag holds 9 of any one thing. the rest goes to the STASH (kept at inns)
const BAGMAX = 9;
// the cast. hp/str/agi/int, weapon skill, starting gear, spells known. eq: head/body/hands/feet/shield/acc
const CHARS = {
  carl:    { home: 'lot', wpn: 'BONG', t: 'CLUB', hp: 120, str: 14, agi: 10, int: 7, wp: 8, jp: 2, spells: [], eq: { body: 'HOODIE', feet: 'FLIP FLOPS' } },
  linda:   { home: 'mall', wpn: 'LETTER OPENER', t: 'FENCE', hp: 112, str: 12, agi: 14, int: 12, wp: 8, jp: 6, spells: ['HEART'], eq: { body: 'T-SHIRT', head: 'PAPER HAT' } },
  ghost:   { home: 'lounge', wpn: 'OLD MIC', t: 'MIC', hp: 100, str: 8, agi: 12, int: 17, wp: 6, jp: 10, spells: ['SIGIL BOLT', 'PHASE'], eq: { body: 'T-SHIRT' } },
  face:    { home: 'studio', wpn: 'RAYGUN', t: 'GUN', hp: 104, str: 10, agi: 12, int: 16, wp: 6, jp: 10, spells: ['ZAP', 'LAG'], eq: { body: 'T-SHIRT', acc: 'LANYARD' } },
  yoko:    { home: 'mandolin', wpn: 'BROOM', t: 'STAFF', hp: 94, str: 8, agi: 11, int: 19, wp: 4, jp: 12, spells: ['TUNE', 'DISCORD'], eq: { body: 'T-SHIRT', acc: 'MOOD RING' } },
  garf:    { home: 'lasagna', wpn: 'SNUB', t: 'GUN', hp: 124, str: 13, agi: 10, int: 9, wp: 8, jp: 2, spells: [], eq: { body: 'TRENCH', head: 'PAPER HAT' } },
  peekid:  { home: 'puddle', wpn: 'SLINGSHOT', t: 'SLING', hp: 92, str: 9, agi: 16, int: 12, wp: 8, jp: 6, spells: ['HEART'], eq: { body: 'T-SHIRT', feet: 'SNEAKERS' } },
  pilotx:  { home: 'gate', wpn: 'X-BLADE', t: 'SWORD', hp: 132, str: 16, agi: 13, int: 7, wp: 10, jp: 2, spells: [], eq: { body: 'HOODIE', shield: 'TRAY' } },
  mallcop: { home: 'mall', wpn: 'BAT', t: 'CLUB', hp: 130, str: 13, agi: 8, int: 5, wp: 6, jp: 0, spells: [], eq: { body: 'HOODIE', head: 'HARD HAT' } },
  driver:  { home: 'lot', wpn: 'WRIST ROCKET', t: 'SLING', hp: 110, str: 11, agi: 13, int: 8, wp: 6, jp: 2, spells: [], eq: { body: 'HOODIE', acc: 'CLASS RING' } },
  stoolie: { home: 'lasagna', wpn: 'REVOLVER', t: 'GUN', hp: 100, str: 11, agi: 15, int: 9, wp: 6, jp: 2, spells: [], eq: { body: 'TRENCH' } },
  medium:  { home: 'lounge', wpn: 'MANDOLIN NECK', t: 'STAFF', hp: 96, str: 7, agi: 10, int: 20, wp: 4, jp: 14, spells: ['SIGIL BOLT', 'HEART', 'EX-WIVES'], eq: { body: 'T-SHIRT', acc: 'MOOD RING' } },
  tapehead:{ home: 'rewind', wpn: 'MANDOLIN NECK', t: 'STAFF', hp: 98, str: 8, agi: 11, int: 18, wp: 4, jp: 12, spells: ['REWIND', 'PAUSE'], eq: { body: 'T-SHIRT', acc: 'SPEED LACES' } },
  deckhand:{ home: 'brineport', wpn: 'KITCHEN AXE', t: 'AXE', hp: 134, str: 15, agi: 9, int: 6, wp: 9, jp: 2, spells: [], eq: { body: 'TRENCH', hands: 'FINGERLESS GLOVES' } },
  busker:  { home: 'livehouse', wpn: 'TOY BOW', t: 'BOW', hp: 102, str: 10, agi: 14, int: 13, wp: 6, jp: 8, spells: ['HOT MIC'], eq: { body: 'T-SHIRT', feet: 'SNEAKERS' } },
  finder:  { home: 'found', wpn: 'WRIST ROCKET', t: 'SLING', hp: 106, str: 11, agi: 14, int: 11, wp: 7, jp: 5, spells: [], eq: { body: 'HOODIE', acc: 'LANYARD' } },
  centurion:{ home: 'gatecity', wpn: 'PICKAXE', t: 'AXE', hp: 138, str: 16, agi: 10, int: 5, wp: 10, jp: 0, spells: [], eq: { body: 'HOODIE', shield: 'POT LID', head: 'PROP HELMET' } },
  intern:  { home: 'studio', wpn: 'HAND WRAPS', t: 'FIST', hp: 108, str: 12, agi: 13, int: 9, wp: 7, jp: 3, spells: [], eq: { body: 'T-SHIRT', hands: 'GRIP TAPE' } },
};
const CAST = id => HEROES[id] || EXTRA[id];
// ---------------- the world ----------------
// six lands on one sheet of paper. places sit on them; the strait in the middle belongs to the Old Stream.
const WORLD = {
  lands: [
    { col: '#d8b080', pts: [[14, 64], [60, 40], [112, 46], [150, 80], [168, 128], [150, 176], [176, 206], [96, 214], [40, 196], [20, 150], [30, 110]], name: 'THE WEST SHORES' },
    { col: '#b8c890', pts: [[186, 26], [252, 18], [306, 40], [300, 96], [270, 124], [214, 110], [190, 70]], name: 'THE EAST SHORES' },
    { col: '#c0b0c8', pts: [[208, 128], [262, 132], [292, 160], [278, 206], [226, 214], [200, 176]], name: 'THE SOUTH ISLES' },
    { col: '#c8d8e0', pts: [[56, 34], [96, 10], [148, 4], [178, 16], [168, 34], [112, 38], [70, 40]], name: 'THE NORTH REACHES' },
    { col: '#98b8b0', pts: [[178, 168], [206, 158], [222, 178], [214, 200], [184, 202]], name: 'THE BRINE' },
    { col: '#d8b0a0', pts: [[290, 140], [316, 128], [318, 180], [296, 192], [286, 164]], name: 'THE GATE HINTERLAND' },
  ],
};
// which land a place belongs to (for field music and the ship fare tables)
const REGION = { lot: 0, mall: 0, puddle: 0, gate: 0, lasagna: 0, depot: 0, badlands: 0, foodcourt: 0, generator: 0, gnerator: 0, redgate: 0, works: 0, freezer: 0, serverpyre: 0, endlessroad: 0, lounge: 1, mandolin: 1, courts: 1, wideweb: 1, court88: 1, mirror: 1, rookery: 1, studio: 2, found: 2, archive: 2, white: 2, dryer: 2, foundry: 2, rewind: 3, livehouse: 3, longstatic: 3, apt4: 3, vaults: 3, chorus: 3, brineport: 4, pickle: 4, shallows: 4, trench: 4, gatecity: 5, gatespire: 5, oldstream: 0 };
const PLACES = {
  // ---- towns (fifteen). every town: PUB / SHOP / INN; seven have a school; four have a guild desk
  lot:      { name: 'LOT 9', kind: 'town', theme: 'desert', at: [60, 168], w: 560, music: 'rstown', port: 1, shops: ['pub', 'shop', 'inn'], sell: ['TONIC', 'SMOKE BOMB', 'PICKLE JUICE', 'BAT', 'WRIST ROCKET', 'PICKAXE', 'HOODIE', 'FLIP FLOPS'] },
  mall:     { name: 'MALL OF THE FUTURE', kind: 'town', theme: 'mall', at: [128, 120], w: 640, music: 'rsmall', shops: ['pub', 'shop', 'inn', 'magic'], school: 'CHAT', sell: ['TONIC', 'SODA', 'ENERGY DRINK', 'PARASOL', 'PROXY RAPIER', 'REVOLVER', 'TRENCH', 'WHITE SUIT', 'CROWN COAT', 'PAPER HAT', 'HARD HAT', 'TRAY', 'POT LID', 'LANYARD'] },
  lounge:   { name: 'THE STARLITE LOUNGE', kind: 'town', theme: 'haunt', at: [214, 54], w: 520, music: 'rslounge', shops: ['pub', 'shop', 'inn', 'magic'], school: 'SIGIL', sell: ['TONIC', 'GUM', 'HOT POCKET', 'SHURE', 'CONDENSER', 'MOOD RING', 'HOODIE', 'HAND MIRROR'] },
  studio:   { name: 'THE STUDIO', kind: 'town', theme: 'studio', at: [252, 150], w: 560, music: 'rsstudio', shops: ['pub', 'shop', 'inn', 'magic'], school: 'STATIC', sell: ['TONIC', 'SODA', 'ENERGY DRINK', 'GUM', 'PHASER', 'GATE SABER', 'WHITE SUIT', 'CLASS RING', 'COMPOUND BOW'] },
  mandolin: { name: 'MANDOLIN', kind: 'town', theme: 'mandolin', at: [282, 64], w: 560, music: 'rsmandolin', port: 1, shops: ['pub', 'shop', 'inn', 'magic'], school: 'MANDOLIN', sell: ['TONIC', 'SODA', 'HOT POCKET', 'MANDOLIN NECK', 'EMPRESS ROD', 'SUPER SOAKER', 'CROWN COAT', 'MOOD RING', 'LONG BOW'] },
  lasagna:  { name: 'LASAGNA CITY', kind: 'town', theme: 'noir', at: [118, 196], w: 600, music: 'rsnoir', port: 1, shops: ['pub', 'shop', 'inn'], sell: ['TONIC', 'SODA', 'SMOKE BOMB', 'COFFEE', 'REVOLVER', 'PHASER', 'BUS CLUB', 'TRENCH', 'CLASS RING', 'HARD HAT'] },
  puddle:   { name: 'PUDDLE PARK', kind: 'town', theme: 'field', at: [92, 70], w: 520, music: 'rsfield', shops: ['pub', 'shop', 'inn', 'magic'], school: 'CHAT', sell: ['TONIC', 'HOT POCKET', 'GUM', 'PICKLE JUICE', 'WRIST ROCKET', 'SUPER SOAKER', 'MANDOLIN NECK', 'HOODIE', 'LANYARD', 'SNEAKERS'] },
  gate:     { name: 'GATE FRONT', kind: 'town', theme: 'hangar', at: [36, 92], w: 520, music: 'rsgate', shops: ['pub', 'shop', 'inn'], sell: ['TONIC', 'SODA', 'ENERGY DRINK', 'LONGSWORD', 'GATE SABER', 'BUS CLUB', 'PICKAXE', 'WHITE SUIT', 'WORK BOOTS'] },
  rewind:   { name: 'REWIND CITY', kind: 'town', theme: 'rewind', at: [146, 16], w: 560, music: 'rsrewind', port: 1, shops: ['pub', 'shop', 'inn', 'magic'], school: 'TAPE', sell: ['TONIC', 'SODA', 'HOT POCKET', 'COFFEE', 'MANDOLIN NECK', 'EMPRESS ROD', 'CROWN COAT', 'SPEED LACES', 'MOOD RING'] },
  livehouse:{ name: 'LIVEHOUSE GULCH', kind: 'town', theme: 'live', at: [98, 12], w: 520, music: 'rslive', shops: ['pub', 'shop', 'inn', 'magic'], school: 'LIVE', sell: ['TONIC', 'SODA', 'ENERGY DRINK', 'SHURE', 'CONDENSER', 'LONG BOW', 'COMPOUND BOW', 'CHAMPION BELT', 'SNEAKERS'] },
  brineport:{ name: 'BRINEPORT', kind: 'town', theme: 'brine', at: [196, 184], w: 560, music: 'rsbrine', port: 1, shops: ['pub', 'shop', 'inn', 'magic'], school: 'DEEP', sell: ['TONIC', 'SODA', 'PICKLE JUICE', 'SOLVENT', 'KITCHEN AXE', 'FIRE AXE', 'POT LID', 'WORK BOOTS', 'SKATEBOARD'] },
  found:    { name: 'LOST & FOUND', kind: 'town', theme: 'found', at: [244, 134], w: 600, music: 'rsfound', port: 1, shops: ['pub', 'shop', 'inn', 'guild'], sell: ['TONIC', 'SODA', 'SMOKE BOMB', 'HAND MIRROR', 'PARASOL', 'KNUCKLES', 'FINGERLESS GLOVES', 'GRIP TAPE', 'SKATEBOARD', 'LANYARD'] },
  gatecity: { name: 'GATE CITY', kind: 'town', theme: 'city', at: [306, 148], w: 640, music: 'rscity', shops: ['pub', 'shop', 'inn', 'magic'], school: 'GATE', sell: ['TONIC', 'SODA', 'ENERGY DRINK', 'GUM', 'GATE SABER', 'RED EDGE', 'PROP HELMET', 'BOXING WRAPS', 'CHAMPION BELT'] },
  courts:   { name: 'THE ALIMONY COURTS', kind: 'town', theme: 'court', at: [240, 106], w: 520, music: 'rscourt', shops: ['pub', 'shop', 'inn'], sell: ['TONIC', 'GUM', 'HAND MIRROR', 'SOLVENT', 'COFFEE', 'PARASOL', 'LETTER OPENER', 'TRENCH', 'TRAY'] },
  depot:    { name: 'DESERT BUS DEPOT', kind: 'town', theme: 'bus', at: [48, 116], w: 520, music: 'rsbus', shops: ['pub', 'shop', 'inn'], sell: ['TONIC', 'ENERGY DRINK', 'COFFEE', 'BAT', 'LONGSWORD', 'HOODIE', 'WORK BOOTS', 'GRIP TAPE'] },
  // ---- fields (free fights)
  badlands: { name: 'THE BADLANDS', kind: 'dungeon', theme: 'desert', at: [86, 136], fam: ['blob', 'gull', 'rat', 'cactus'], rooms: 3, music: 'rsfield' },
  wideweb:  { name: 'THE WIDE WEB', kind: 'dungeon', theme: 'field', at: [236, 92], fam: ['bot', 'troll', 'gull'], rooms: 3, music: 'rsfieldE' },
  longstatic: { name: 'THE LONG STATIC', kind: 'dungeon', theme: 'freezer', at: [84, 22], fam: ['staticsheep', 'echo', 'bot'], rooms: 3, music: 'rsfieldN' },
  shallows: { name: 'WRECK SHALLOWS', kind: 'dungeon', theme: 'brine', at: [188, 172], fam: ['crab', 'gull', 'pickle'], rooms: 3, music: 'rsfieldS' },
  // ---- dungeons. cart: the cartridge inside. guard: a guardian holds the last door. bmusic: the region's battle theme
  foodcourt:{ name: 'FOOD COURT DEPTHS', kind: 'dungeon', theme: 'mall', at: [150, 100], fam: ['rat', 'manq', 'blob'], rooms: 4, boss: 'pretzel', cart: 'NIGHT OF THE MALL', guard: 'rat', music: 'rsdungeon' },
  court88:  { name: 'COURTROOM 88', kind: 'dungeon', theme: 'haunt', at: [196, 40], fam: ['wisp', 'manq'], rooms: 4, boss: 'alimony', cart: 'LIVE FROM BEYOND', guard: 'wisp', music: 'rshaunt' },
  archive:  { name: 'THE ARCHIVE', kind: 'dungeon', theme: 'studio', at: [276, 176], fam: ['bot', 'wisp', 'drone'], rooms: 5, boss: 'backup', cart: 'STILL HERE', guard: 'bot', music: 'rsdungeon' },
  mirror:   { name: 'MIRROR GARDEN', kind: 'dungeon', theme: 'spire', at: [298, 82], fam: ['manq', 'gull', 'wisp'], rooms: 5, boss: 'evilyoko', cart: 'ANOTHER BOOGALOO', guard: 'manq', music: 'rshaunt' },
  works:    { name: 'LASAGNA WORKS', kind: 'dungeon', theme: 'noir', at: [150, 168], fam: ['rat', 'troll', 'bot'], rooms: 5, boss: 'lasagna', cart: 'SAVE THE WORLD', guard: 'troll', music: 'rsdungeon' },
  generator:{ name: 'THE GENERATOR', kind: 'dungeon', theme: 'generator', at: [28, 140], fam: ['drone', 'bot', 'blob'], rooms: 3, boss: 'generator', cart: 'ABOVE AND BELOW NEVADA', music: 'rsdungeon' },
  apt4:     { name: 'APARTMENT 4', kind: 'dungeon', theme: 'apt', at: [114, 32], fam: ['wisp', 'bot', 'troll'], rooms: 4, boss: 'mimi', cart: 'PEE KID 3', guard: 'bot', music: 'rshaunt' },
  white:    { name: 'THE WHITE ROOM', kind: 'dungeon', theme: 'lab', at: [228, 198], fam: ['manq', 'drone', 'bot', 'troll'], rooms: 6, boss: 'director', cart: 'RETURN TO SENDER', guard: 'manq', music: 'rsminion' },
  redgate:  { name: 'THE RED GATE', kind: 'dungeon', theme: 'redgate', at: [16, 70], fam: ['drone', 'troll', 'gull'], rooms: 6, boss: 'red', cart: 'RESIDENT HUMAN', guard: 'drone', music: 'rsminion' },
  gnerator: { name: 'THE GNERATOR', kind: 'dungeon', theme: 'letters', at: [52, 120], fam: ['bot', 'blob', 'wisp', 'troll'], rooms: 6, boss: 'dyslexio', cart: 'THE END', guard: 'bot', music: 'rsminion' },
  oldstream:{ name: 'THE OLD STREAM', kind: 'dungeon', theme: 'curse', at: [180, 154], fam: ['troll', 'wisp', 'drone', 'manq'], rooms: 7, boss: 'curse1', music: 'rsfinal' },
  // the new country
  endlessroad: { name: 'THE ENDLESS ROAD', kind: 'dungeon', theme: 'road', at: [26, 132], fam: ['gull', 'drone', 'troll'], rooms: 5, boss: 'bus', music: 'rsroad' },
  vaults:   { name: 'THE REWIND VAULTS', kind: 'dungeon', theme: 'rewind', at: [168, 28], fam: ['tapebug', 'folder', 'wisp'], rooms: 5, boss: 'latefee', music: 'rshaunt' },
  pickle:   { name: 'THE PICKLE CELLARS', kind: 'dungeon', theme: 'pickle', at: [210, 190], fam: ['pickle', 'sock', 'crab'], rooms: 4, boss: 'mpickle', music: 'rsdungeon' },
  dryer:    { name: 'THE DRYER DEPTHS', kind: 'dungeon', theme: 'dryer', at: [214, 162], fam: ['sock', 'gull', 'blob'], rooms: 4, boss: 'dryerlord', music: 'rsdungeon' },
  freezer:  { name: 'THE FOOD COURT FREEZER', kind: 'dungeon', theme: 'freezer', at: [144, 132], fam: ['fridge', 'rat', 'manq'], rooms: 4, boss: 'walkin', music: 'rsdungeon' },
  rookery:  { name: 'THE ROOKERY', kind: 'dungeon', theme: 'rookery', at: [260, 102], fam: ['pigeon', 'gull', 'rat'], rooms: 4, boss: 'ppigeon', music: 'rsdungeon' },
  serverpyre: { name: 'THE SERVER PYRE', kind: 'dungeon', theme: 'pyre', at: [148, 184], fam: ['folder', 'bot', 'tapebug'], rooms: 5, boss: 'pyre', music: 'rsdungeon' },
  gatespire:{ name: 'THE GATE SPIRE', kind: 'dungeon', theme: 'city', at: [300, 176], fam: ['drone', 'manq', 'echo'], rooms: 5, boss: 'gatekeeper', music: 'rsminion' },
  foundry:  { name: 'THE LOST & FOUNDRY', kind: 'dungeon', theme: 'foundry', at: [232, 178], fam: ['folder', 'rat', 'troll'], rooms: 5, boss: 'thefinder', music: 'rsdungeon' },
  chorus:   { name: 'THE CHORUS HALLS', kind: 'dungeon', theme: 'chorus', at: [128, 12], fam: ['echo', 'wisp', 'pigeon'], rooms: 4, boss: 'chorusb', music: 'rsdungeon' },
  trench:   { name: 'THE BRINE TRENCH', kind: 'dungeon', theme: 'trench', at: [204, 170], fam: ['crab', 'pickle', 'wisp'], rooms: 5, boss: 'sargasso', music: 'rshaunt' },
};
// battle music per land (fields and dungeons inherit their land's theme)
const REGION_BATTLE = ['rsbattle', 'rsbattleE', 'rsbattleE', 'rsbattleN', 'rsbattleS', 'rsbattleN'];
// what each town's pub knows. [text, place it puts on the map, condition]
const RUMORS = {
  lot: [['THE GENERATOR OUT PAST THE LOT HUMS AT NIGHT. NOBODY PLUGGED IT IN.', 'generator'], ['A MALL GOT BUILT NORTH OF HERE. IT WAS NOT THERE YESTERDAY.', 'mall'], ['THE BADLANDS ARE FULL OF SPAM. GOOD PLACE TO GET STRONGER.', 'badlands'], ['A CITY THAT SMELLS LIKE LASAGNA, DOWN SOUTH. DETECTIVES. RAIN.', 'lasagna'], ['THE BUS DEPOT WEST OF HERE. THE BUS LEAVES ON THE HOUR. THE HOUR IS LONG.', 'depot'], ['SOME SAY THE GENERATOR HAS A COUSIN. SPELLED WRONG.', 'gnerator', g => g.br >= 24]],
  mall: [['THE FOOD COURT GOES DOWN FARTHER THAN THE MALL DOES.', 'foodcourt'], ['THE FREEZER DOWN THERE FROZE A WALK-IN. THE WALK-IN WALKED.', 'freezer'], ['A LOUNGE ACROSS THE WATER WHERE A GHOST SINGS. HE OWES EVERYONE.', 'lounge'], ['THE BADLANDS SOUTH OF HERE HAVE GOOD FIGHTING.', 'badlands'], ['A KID IN PUDDLE PARK KEEPS HEARING A SPEAKER TALK BACK.', 'puddle'], ['MEN IN WHITE SUITS ASKED ABOUT A ROOM WITH NO CORNERS.', 'white', g => g.br >= 16], ['THE OLD SERVERS BEHIND THE MALL CAUGHT FIRE AND KEPT WORKING.', 'serverpyre', g => g.er >= 6]],
  lounge: [['COURTROOM 88 IS IN SESSION. IT IS ALWAYS IN SESSION. IT IS ABOUT ALIMONY.', 'court88'], ['THE ALIMONY COURTS ACROSS THE WATER HAVE A WHOLE TOWN NOW. PAPERWORK TOWN.', 'courts'], ['MANDOLIN IS EAST. EVERYTHING THERE IS SPELLED A LITTLE DIFFERENT.', 'mandolin'], ['THE WIDE WEB IS FULL OF BOTS. GOOD PRACTICE.', 'wideweb'], ['A STUDIO DOWN SOUTH WHERE A MASK MAKES SHOWS.', 'studio'], ['PIGEONS TOOK THE ROOKERY BY THE OLD RADIO MAST. THEY ANSWER THE PHONE NOW.', 'rookery', g => g.er >= 4], ['THE COURT ADJOURNS FOR GOOD SOON. IF YOU OWE, GO NOW.', null, g => g.br >= 30 && !g.flags.court88done]],
  studio: [['THE ARCHIVE UNDER THE STUDIO IS RESTORING SOMETHING. NOBODY ASKED IT TO.', 'archive'], ['THE WHITE ROOM IS SOUTH. YOU DO NOT WALK OUT OF THE WHITE ROOM.', 'white', g => g.br >= 16], ['A RED GATE OPENED ON THE WEST COAST. AN EMPIRE CAME OUT.', 'gate'], ['MALL OF THE FUTURE. THE CEO RUNS IT. SHE IS ALSO A LINDA.', 'mall'], ['LOST & FOUND, SOUTH ISLES. THEY HAVE EVERYTHING THERE. THE EVERYTHING IS THE PROBLEM.', 'found', g => g.er >= 3]],
  mandolin: [['THE MIRROR GARDEN SHOWS YOU ANOTHER YOU. THE OTHER ONE IS MEAN.', 'mirror'], ['THE GARDEN CLOSES WHEN THE EMPRESS STOPS LOOKING. SOON, THEY SAY.', null, g => g.br >= 34 && !g.flags.mirrordone], ['A GHOST SINGS AT THE STARLITE. THE EMPRESS HAS OPINIONS ABOUT HIM.', 'lounge'], ['IN THE OLD DAYS THE TEN CARTRIDGES SEALED THE CURSE. NOW THEY ARE SCATTERED.', null], ['A CITY OF GATES ON THE FAR EAST EDGE. THE EMPIRE MOVED THE CAPITAL THERE.', 'gatecity', g => g.er >= 8]],
  lasagna: [['THE LASAGNA WORKS NEVER CLOSE. PEOPLE GO IN TO WORK AND COME OUT AS LAYERS.', 'works'], ['A GENERATOR WEST OF LOT 9. BIG ONE. CARL STORY.', 'lot'], ['THE STUDIO ON THE SOUTH ISLAND. DETECTIVE WORK IF YOU WANT IT.', 'studio'], ['THE GNERATOR. I AM NOT SPELLING IT WRONG. IT IS.', 'gnerator', g => g.br >= 24], ['THE DRYER DEPTHS UNDER THE SOUTH ISLES ATE MY LEFT SOCK. AND MY BROTHER.', 'dryer', g => g.er >= 5]],
  puddle: [['THERE IS AN APARTMENT UP NORTH WHERE THE SPEAKER ANSWERS. APARTMENT 4.', 'apt4'], ['GATE FRONT IS WEST, WHERE THE PILOTS LIVE.', 'gate'], ['THE MALL. GREAT FOR SNACKS.', 'mall'], ['THE WIDE WEB OUT EAST. BOTS. NICE ONES, MOSTLY.', 'wideweb'], ['UP NORTH THEY HAVE TWO TOWNS THAT HATE EACH OTHER. REWIND AND LIVEHOUSE. OLD STORY.', 'rewind', g => g.er >= 2]],
  gate: [['THE RED GATE IS OPEN. GENERAL RED IS IN IT. HE IS STRONGER THAN ANYONE HERE.', 'redgate'], ['PUDDLE PARK, NORTHEAST. KIDS. NOISE.', 'puddle'], ['THE GENERATOR, SOUTH. THE GATE IS DRINKING FROM IT.', 'generator'], ['THE EMPIRE BUILT A REAL CITY OUT EAST. GATE CITY. THEY SELL SPELLS THERE NOW.', 'gatecity', g => g.er >= 8], ['THREE SERVANTS OF THE CURSE: THE DIRECTOR, THE GENERAL, AND THE ONE WHO CANNOT SPELL.', null], ['A SPIRE ABOVE GATE CITY. THE GATE MEN SAY IT WHISPERS COORDINATES.', 'gatespire', g => g.er >= 12]],
  rewind: [['THE VAULTS UNDER THE CITY KEEP EVERY EPISODE. THE LATE FEE KEEPS THEM.', 'vaults'], ['ACROSS THE PAPER HILLS: LIVEHOUSE GULCH. THEY PLAY IT LIVE THERE. LIVE! IT IS A CULT.', 'livehouse'], ['THE LONG STATIC. WHITE NOISE COUNTRY. SHEEP MADE OF IT.', 'longstatic'], ['APARTMENT 4 IS SOUTH OF HERE. THE SPEAKER KNOWS YOUR NAME ALREADY.', 'apt4'], ['THE CHORUS HALLS SING EVERYTHING BACK ONE BEAT LATE. EVEN THE SAD SONGS.', 'chorus', g => g.er >= 6]],
  livehouse: [['REWIND CITY. THEY TAPE EVERYTHING AND THROW NOTHING AWAY. NOT EVEN THE BAD SHOWS.', 'rewind'], ['THE CHORUS HALLS UNDER THE HILL. DO NOT SING ALONG. IT JOINS.', 'chorus'], ['THE LONG STATIC BETWEEN THE TOWNS. GOOD FOR CLEARING YOUR HEAD. AND FILLING IT.', 'longstatic'], ['THE EMPRESS IN MANDOLIN ONCE BANNED LIVE MUSIC. SHE WAS RIGHT AND WE NEVER FORGAVE HER.', 'mandolin']],
  brineport: [['THE CELLARS UNDER THE PORT ARE FULL OF PICKLES. SOME OF THEM ARE PEOPLE. MOSTLY PICKLES.', 'pickle'], ['THE SHALLOWS ARE SAFE. THE TRENCH IS NOT. KNOW THE DIFFERENCE.', 'shallows'], ['THE TRENCH HAS A GARDEN OF WRECKS IN IT. SARGASSO KEEPS THE GARDEN.', 'trench', g => g.er >= 7], ['THE LOST & FOUND NORTH OF HERE. THEY EVEN FOUND A TOWN THERE.', 'found'], ['THE SHIP CALLED A.S.S. DOCKS AT LOT 9 WHEN IT DOCKS AT ALL.', 'lot']],
  found: [['THE FOUNDRY UNDER THE OFFICE. EVERYTHING LOST GOES THERE TO BE FILED. EVERYTHING.', 'foundry'], ['THE DRYER DEPTHS. SOCKS GO IN. WRATH COMES OUT.', 'dryer'], ['A MEDIUM AT THE STARLITE LOUNGE SAYS THE CARTRIDGES CALL EACH OTHER. WE SAY: SURE.', 'lounge'], ['THE ARCHIVE ON THE SOUTH ISLES KEEPS TAPE. WE KEEP OBJECTS. THEY ARE THE WORST NEIGHBORS.', 'archive'], ['BRINEPORT, SOUTH. GOOD PICKLES. BAD SECRETS.', 'brineport']],
  gatecity: [['THE SPIRE WHISPERS AT NIGHT. THE GATE MEN WRITE DOWN WHAT IT SAYS.', 'gatespire'], ['GATE FRONT, FAR WEST, HELD THE LINE WHEN THE GATE OPENED. THEY HELD IT FOR YEARS.', 'gate'], ['THE WHITE ROOMS TAKE THE EMPIRE FAILURES. THE SUITS COME FROM HERE.', 'white', g => g.br >= 16], ['DEEP SPELLS AT THE PORT IN THE SOUTH ISLES. WATER THAT REMEMBERS.', 'brineport', g => g.er >= 4]],
  courts: [['COURTROOM 88 IS THE APPEALS BRANCH. THE APPEAL IS ALWAYS DENIED.', 'court88'], ['THE GHOST SINGS THURSDAYS AT THE STARLITE. WE HAVE A FILE ON HIM. SEVERAL FILES.', 'lounge'], ['REVENUE IS DOWN SINCE THE WISP STRIKE. DO NOT MENTION THE WISP STRIKE.', null], ['MANDOLIN SPELLS IT DIFFERENT IN EVERY DOCUMENT. THIS IS CONTEMPT OF COURT.', 'mandolin']],
  depot: [['THE ROAD EAST OF HERE DOES NOT END. PEOPLE DRIVE IT FOR CHARITY. THE CHARITY KEEPS THE ROAD.', 'endlessroad'], ['THE BUS LEAVES WHEN IT LEAVES. IT ARRIVES WHEN IT ARRIVES. THIS IS THE SCHEDULE.', null], ['LOT 9, EAST. A SHIP PARKED IN A PARKING LOT. IT HAS NOT MOVED IN A WHILE.', 'lot'], ['GENERATOR COUNTRY, SOUTH. MIND THE HUM.', 'generator']],
};
// pub regulars: who will join, and where
const RECRUITS = { lot: ['carl', 'driver'], mall: ['linda', 'mallcop'], lounge: ['ghost', 'medium'], studio: ['face', 'intern'], mandolin: ['yoko'], lasagna: ['garf', 'stoolie'], puddle: ['peekid'], gate: ['pilotx'], rewind: ['tapehead'], livehouse: ['busker'], brineport: ['deckhand'], found: ['finder'], gatecity: ['centurion'], courts: [], depot: [] };
const CARTS = ['ABOVE AND BELOW NEVADA', 'NIGHT OF THE MALL', 'LIVE FROM BEYOND', 'STILL HERE', 'ANOTHER BOOGALOO', 'SAVE THE WORLD', 'PEE KID 3', 'RETURN TO SENDER', 'RESIDENT HUMAN', 'THE END'];
// each cartridge hums while carried. the curse hates that (this is the mechanical truth of the ending bonus)
const CARTPASS = {
  'ABOVE AND BELOW NEVADA': { d: 'THE ROAD WAS LONG. +10% WP.' },
  'NIGHT OF THE MALL': { d: 'THE MALL REMEMBERS. SHOPS CHARGE 10% LESS.' },
  'LIVE FROM BEYOND': { d: 'SOMEBODY IS WATCHING. REVIVED FRIENDS RETURN STRONGER.' },
  'STILL HERE': { d: 'IT NEVER LEFT. +2 DEFENSE EVERYONE.' },
  'ANOTHER BOOGALOO': { d: 'THE SEQUEL DODGES. +8% EVADE.' },
  'SAVE THE WORLD': { d: 'THEY MEANT IT. +8% STRENGTH.' },
  'PEE KID 3': { d: 'TRILOGIES FINISH FAST. +2 AGILITY EVERYONE.' },
  'RETURN TO SENDER': { d: 'REFUSED DELIVERIES. ATTACKERS TAKE A LITTLE BACK.' },
  'RESIDENT HUMAN': { d: 'HUMAN, MOSTLY. +10% MAX HP.' },
  'THE END': { d: 'EVERY STORY HAS ONE. +10% SPELL POWER.' },
};
// formations: front[i]=1 means party slot i stands front. back row takes less melee, deals less melee
const FORMS = {
  'STANDARD': { front: [1, 1, 1, 0, 0, 0], d: 'THREE UP FRONT. THE CLASSIC.' },
  'BUS QUEUE': { front: [1, 1, 1, 1, 1, 1], agi: 2, d: 'EVERYONE IN A LINE. +2 AGI, NO COVER.' },
  'PYRAMID SCHEME': { front: [1, 0, 0, 0, 0, 0], d: 'ONE UP FRONT (+4 DEF), THE REST CAST (+15% SPELLS).' },
  'COUCH': { front: [0, 0, 0, 0, 0, 0], def: 3, d: 'EVERYONE IN BACK. +3 DEF, -30% MELEE.' },
  'FREE FORM': { front: [1, 0, 1, 0, 1, 0], crit: 1, d: 'ALTERNATING. CRIT A LITTLE MORE OFTEN.' },
};
// ships: pay at a port, sleep through the crossing. the A.S.S. (carl's) sails free once fixed
const SHIPS = [
  ['lot', 'brineport', 60], ['lasagna', 'brineport', 60], ['brineport', 'found', 80], ['found', 'rewind', 100], ['brineport', 'mandolin', 120], ['found', 'courts', 90], ['found', 'gatecity', 140], ['lot', 'depot', 40],
];
// combined attacks. both alive, both in the party: the option appears (once a fight)
const COMBOS = [
  { ids: ['carl', 'driver'], n: 'SPECIAL DELIVERY', p: 2.6, line: 'SIGN HERE.' },
  { ids: ['linda', 'mallcop'], n: 'ASSET PROTECTION', p: 2.7, line: 'PER MY LAST EMAIL.' },
  { ids: ['ghost', 'medium'], n: 'SEANCE', p: 2.4, el: 'curse', line: 'IS ANYBODY THERE? YES.' },
  { ids: ['face', 'stoolie'], n: 'STAKEOUT', p: 2.5, line: 'WE BEEN SITTING ON YOU FOR DAYS.' },
  { ids: ['yoko', 'tapehead'], n: 'DUET', p: 2.5, el: 'sound', line: 'ONE MORE TIME, FROM THE TOP.' },
  { ids: ['garf', 'stoolie'], n: 'BAD COP', p: 2.8, line: 'HE IS THE BAD ONE.' },
  { ids: ['peekid', 'driver'], n: 'POTENTIAL ENERGY', p: 2.3, line: 'SIGNIFICANT DAMAGE!' },
  { ids: ['pilotx', 'deckhand'], n: 'ALL ABOARD', p: 2.9, line: 'TICKETS, EVERYBODY.' },
  { ids: ['face', 'intern'], n: 'UNPAID OVERTIME', p: 2.4, line: 'IT IS A GREAT RESUME BUILDER.' },
  { ids: ['busker', 'yoko'], n: 'HARMONY', p: 2.4, el: 'sound', line: 'THE KEY CHANGE.' },
];
// ---------------- the eight origins ----------------
const ORIGINS = {
  carl: { place: 'lot', blurb: 'PROP PILLS DELIVERY DRIVER. HE PARKED HIS SHIP IN LOT 9 AND THE GENERATOR STARTED HUMMING.', open: ['lot', 'badlands', 'generator', 'gate'] },
  linda: { place: 'mall', blurb: 'CEO OF THE MALL OF THE FUTURE. THE FOOD COURT HAS STOPPED REPORTING TO HER.', open: ['mall', 'badlands', 'foodcourt', 'lot'] },
  ghost: { place: 'lounge', blurb: 'LOUNGE SINGER. SPIRIT. OWES ALIMONY IN SEVERAL REALITIES. THE COURT HAS FOUND HIM.', open: ['lounge', 'wideweb', 'court88', 'mandolin'] },
  face: { place: 'studio', blurb: 'NEW FACE. MAKES SHOWS. THE ARCHIVE UNDER THE STUDIO IS RESTORING AN OLDER HIM.', open: ['studio', 'wideweb', 'archive', 'found'] },
  yoko: { place: 'mandolin', blurb: 'YOKO OF MANDOLIN. THE MIRROR GARDEN IS SHOWING HER A YOKO SHE DOES NOT REMEMBER BEING.', open: ['mandolin', 'wideweb', 'mirror', 'lounge'] },
  garf: { place: 'lasagna', blurb: 'JB GARFIELD, PRIVATE EYE. PEOPLE GO INTO THE LASAGNA WORKS AND DO NOT COME OUT.', open: ['lasagna', 'badlands', 'works', 'depot'] },
  peekid: { place: 'puddle', blurb: 'PEE KID. THE SPEAKER IN APARTMENT 4 KNOWS HIS NAME AND WANTS HIM TO COME UP.', open: ['puddle', 'badlands', 'apt4', 'gate'] },
  pilotx: { place: 'gate', blurb: 'PILOT X. A RED GATE OPENED ON THE COAST. HE IS THE OTHER RED. HE IS NOT READY.', open: ['gate', 'badlands', 'redgate', 'lot'] },
};
// shops restock as the event rank rises (appended to every town's sell list)
const TIER2 = ['JUICE BOX', 'SOLVENT', 'WORK BOOTS', 'POT LID', 'SPEED LACES', 'CHAMPION BELT', 'PROP HELMET', 'BOXING WRAPS'];
