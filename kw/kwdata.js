'use strict';
// ================= KONBINI WARS: data (products, customers, fixtures, staff, the mall) =================
// Prototype slice: Carl vs Ghost on one map. Numbers are tuning values (see MALL_OF_THE_FUTURE_KONBINI_DESIGN.md).

// ---------- categories: one shelf kind each ----------
// life: days a unit lasts (0 = never spoils). heat/rain: demand multipliers by weather.
const CATS = {
  bento: { n: 'BENTO', life: 1, col: '#f0a040', rain: 1.25, hot: .85 },
  drink: { n: 'DRINKS', life: 0, col: '#40a8f0', rain: .8, hot: 1.5 },
  snack: { n: 'SNACKS', life: 0, col: '#f05878', rain: 1, hot: 1 },
  daily: { n: 'DAILY', life: 0, col: '#a0d070', rain: 1.1, hot: 1 },
  mag: { n: 'PRINT', life: 0, col: '#e8e0c0', rain: 1, hot: 1 },
  med: { n: 'MEDICINE', life: 0, col: '#f0f0f0', rain: 1.2, hot: 1, permit: 'med' },
  spec: { n: 'SPECIALTY', life: 0, col: '#c080ff', rain: 1, hot: 1 },
};
const CAT_IDS = Object.keys(CATS);

// ---------- products ----------
// [id, name, category, cost MC, popularity 1-10 (hidden), tags, month it launches (0 = on sale from the start)]
// Tags shape who wants it and when: portable cheap hearty premium fun night occult rain S(ummer) W(inter) fade.
// Catalogue order is the order a new store's shelves are filled in: the defaults are NOT the best sellers.
const PRODUCTS = {};
[
  ['bento', 'BENTO BOX', 'bento', 320, 6, 'hearty'], ['eggsando', 'EGG SANDWICH', 'bento', 170, 5, 'portable'], ['curry', 'CURRY RICE', 'bento', 360, 4, 'hearty'],
  ['soba', 'COLD SOBA', 'bento', 280, 4, 'S'], ['salmonigi', 'SALMON ONIGIRI', 'bento', 90, 8, 'portable cheap'], ['tunaonigi', 'TUNA ONIGIRI', 'bento', 90, 9, 'portable cheap'],
  ['noodle', 'NOODLE CUP', 'bento', 110, 7, 'cheap night'], ['katsu', 'KATSU SANDO', 'bento', 260, 6, 'hearty portable'], ['salad', 'SALAD BOWL', 'bento', 280, 3, 'premium S'],
  ['ekiben', 'STARPORT EKIBEN', 'bento', 420, 5, 'portable premium'], ['oden', 'ODEN SET', 'bento', 240, 6, 'W hearty night'], ['nikuman', 'STEAMED BUN', 'bento', 110, 7, 'W cheap portable'],
  ['galaxybowl', 'GALAXY RICE BOWL', 'bento', 340, 6, 'hearty fun', 2], ['karaage', 'KARAAGE CUP', 'bento', 200, 7, 'hearty night fun', 7],
  ['water', 'WATER', 'drink', 60, 6, 'portable'], ['milktea', 'MILK TEA', 'drink', 110, 5, 'fun cheap'], ['blackcoffee', 'BLACK COFFEE', 'drink', 130, 4, 'premium night'],
  ['cola', 'COLA', 'drink', 100, 7, 'fun'], ['cancoffee', 'CAN COFFEE', 'drink', 80, 8, 'night cheap'], ['greentea', 'GREEN TEA', 'drink', 85, 7, ''],
  ['energy', 'ENERGY DRINK', 'drink', 150, 6, 'night hearty'], ['sports', 'SPORTS DRINK', 'drink', 120, 5, 'S portable'], ['cocoa', 'HOT COCOA', 'drink', 120, 4, 'W fun'],
  ['lemon', 'LEMON SODA', 'drink', 100, 5, 'S fun'], ['potion', 'HERBAL POTION', 'drink', 180, 3, 'occult'], ['nebula', 'NEBULA SODA', 'drink', 130, 7, 'fun fade', 3], ['matcha', 'ICED MATCHA', 'drink', 160, 6, 'S premium', 4],
  ['cookies', 'COOKIES', 'snack', 100, 5, ''], ['nuts', 'MIXED NUTS', 'snack', 160, 3, 'premium'], ['chips', 'CHIPS', 'snack', 90, 8, 'fun cheap'],
  ['choco', 'CHOCOLATE', 'snack', 80, 8, 'cheap'], ['senbei', 'RICE CRACKERS', 'snack', 100, 5, ''], ['gummies', 'GUMMIES', 'snack', 70, 6, 'fun cheap'],
  ['jerky', 'BEEF JERKY', 'snack', 220, 5, 'hearty portable night'], ['icecream', 'ICE CREAM', 'snack', 120, 7, 'S fun'], ['pocky', 'STICK BISCUITS', 'snack', 90, 7, 'fun'],
  ['batbites', 'BAT WING BITES', 'snack', 130, 4, 'occult fun'], ['moonchips', 'MOON CHIPS', 'snack', 110, 7, 'fun fade', 1], ['glowgum', 'GLOW GUMMIES', 'snack', 90, 6, 'fun night', 6],
  ['soap', 'SOAP', 'daily', 120, 4, ''], ['socks', 'SOCKS', 'daily', 300, 3, 'portable'], ['tissue', 'TISSUES', 'daily', 140, 6, 'cheap'],
  ['battery', 'BATTERIES', 'daily', 260, 6, 'portable'], ['cable', 'CHARGE CABLE', 'daily', 480, 7, 'portable premium'], ['umbrella', 'UMBRELLA', 'daily', 400, 2, 'rain'],
  ['toothkit', 'TOOTHBRUSH KIT', 'daily', 180, 5, 'portable night'], ['handwarm', 'HAND WARMER', 'daily', 90, 4, 'W portable'], ['sunscreen', 'SUNSCREEN', 'daily', 420, 3, 'S'],
  ['razor', 'RAZOR', 'daily', 220, 4, 'portable'], ['candles', 'BLACK CANDLES', 'daily', 200, 3, 'occult night'], ['adapter', 'TRAVEL ADAPTER', 'daily', 900, 6, 'portable premium', 2],
  ['newspaper', 'NEWSPAPER', 'mag', 90, 5, 'cheap'], ['puzzle', 'PUZZLE BOOK', 'mag', 200, 3, ''], ['fashion', 'FASHION MAG', 'mag', 320, 3, 'premium'],
  ['weekly', 'WEEKLY MAG', 'mag', 220, 6, ''], ['comic', 'COMIC ANTHOLOGY', 'mag', 170, 8, 'fun cheap'], ['gamemag', 'GAME MAG', 'mag', 260, 6, 'fun'],
  ['occultmo', 'OCCULT MONTHLY', 'mag', 280, 4, 'occult night'], ['travelguide', 'TRAVEL GUIDE', 'mag', 450, 5, 'portable'], ['streamdig', 'STREAM DIGEST', 'mag', 240, 7, 'fun fade', 4],
  ['coldmed', 'COLD MEDICINE', 'med', 600, 6, 'W'], ['headache', 'HEADACHE PILLS', 'med', 450, 6, 'night'], ['stomach', 'STOMACH MEDS', 'med', 500, 4, 'hearty'],
  ['bandage', 'BANDAGES', 'med', 300, 4, 'occult portable'], ['eyedrops', 'EYE DROPS', 'med', 400, 5, 'night portable'], ['tonic', 'ENERGY TONIC', 'med', 380, 5, 'night hearty'],
  // Carl: Very Normal Convenience
  ['humancup', 'HUMAN CUP', 'spec', 300, 3, 'fun', 0, 'carl'], ['proppill', 'PROP PILLS', 'spec', 380, 7, 'portable', 0, 'carl', 'med'],
  ['roadmeal', 'ROAD MEAL', 'spec', 260, 6, 'hearty portable', 0, 'carl'], ['shipcable', 'SHIP CABLE', 'spec', 520, 6, 'portable premium', 0, 'carl'],
  // Ghost: Spooky Mart
  ['herbs', 'SPOOKY HERBS', 'spec', 240, 4, 'occult', 0, 'ghost'], ['wand', 'APPRENTICE WAND', 'spec', 900, 4, 'occult premium', 0, 'ghost'],
  ['chalk', 'RITUAL CHALK', 'spec', 180, 6, 'occult cheap', 0, 'ghost'], ['ward', 'POCKET WARD', 'spec', 420, 7, 'occult portable', 0, 'ghost'],
  // CEO Linda: Linda Select
  ['accset', 'COMPANION SET', 'spec', 700, 4, 'premium fun', 0, 'linda'], ['compact', 'LINDA COMPACT', 'spec', 600, 5, 'premium', 0, 'linda'],
  ['giftbox', 'PREMIUM GIFT BOX', 'spec', 1200, 5, 'premium', 0, 'linda'], ['carekit', 'ANDROID CARE KIT', 'spec', 800, 7, 'premium portable', 0, 'linda'],
  // The Face: The Potential Store
  ['brkfst', 'EXPERIMENT BRKFST', 'spec', 180, 3, 'cheap hearty', 0, 'face'], ['projector', 'CURIO PROJECTOR', 'spec', 900, 4, 'fun premium', 0, 'face'],
  ['potmeter', 'POTENTIAL METER', 'spec', 650, 6, 'fun', 0, 'face'], ['sortbox', 'SELF-SORT SNACKS', 'spec', 220, 7, 'fun cheap', 0, 'face'],
  // Yoko: Yoko Everyday
  ['assist', 'ASSIST TERMINAL', 'spec', 1500, 3, 'premium portable', 0, 'yoko'], ['planner', 'ADAPTIVE PLANNER', 'spec', 380, 4, 'premium', 0, 'yoko'],
  ['phrase', 'PHRASE CARDS', 'spec', 200, 6, 'portable cheap', 0, 'yoko'], ['travelkit', 'TRAVEL-NEEDS KIT', 'spec', 450, 7, 'portable', 0, 'yoko'],
  // JB Garfield: Midnight Convenience
  ['detcap', 'DETECTIVE CAP', 'spec', 600, 3, 'rain portable', 0, 'jb'], ['noirpulp', 'NOIR PULP', 'spec', 240, 5, 'night fun', 0, 'jb'],
  ['detcoffee', 'DETECTIVE BLEND', 'spec', 160, 7, 'night', 0, 'jb'], ['lasagna', 'LASAGNA PORTION', 'spec', 330, 8, 'hearty night', 0, 'jb'],
].forEach(([id, n, cat, cost, pop, tags, launch, mgr, permit]) => { PRODUCTS[id] = { id, n, cat, cost, pop, tags: tags ? tags.split(' ') : [], launch: launch || 0, mgr: mgr || null, permit: permit || (cat === 'med' ? 'med' : null) }; });
// the supplier's starter order (what a new store's shelves get): middling items first, then the duds, the hits last. A guess, not a plan.
{ const rank = p => p.pop >= 7 ? 2 : p.pop >= 5 ? 0 : 1, all = Object.values(PRODUCTS).sort((a, b) => a.cat === b.cat ? rank(a) - rank(b) : 0);
  for (const k in PRODUCTS) delete PRODUCTS[k]; for (const p of all) PRODUCTS[p.id] = p; }
// how much each kind of customer cares about a tag
const TAGFIT = {
  portable: { traveler: 1.9, routine: 1, student: .8, adventurer: 1.1, thief: 1 },
  cheap: { student: 1.9, routine: 1.2, traveler: .9, adventurer: .8, thief: 1 },
  hearty: { adventurer: 1.8, traveler: 1.3, routine: 1, student: .9, thief: 1 },
  premium: { routine: 1.3, traveler: 1.2, adventurer: .9, student: .35, thief: 1.5 },
  fun: { student: 2.1, routine: .8, traveler: .9, adventurer: 1, thief: 1 },
  occult: { adventurer: 2.8, student: 1, routine: .3, traveler: .35, thief: 1 },
};
// products a chain can stock this month: everything launched, plus its own manager's signature lines
const prodsIn = (cat, mgr, months = 0) => Object.values(PRODUCTS).filter(p => p.cat === cat && (!p.mgr || p.mgr === mgr) && p.launch <= months);

// ---------- customer segments ----------
// want: category weights. budget: how far over a 30% markup they still buy. pat: patience (sim minutes in queue).
// night: share of their trips after 22:00 relative to day. look: sprite palette.
const SEGS = {
  routine: { n: 'ROUTINE SHOPPER', want: { bento: 4, drink: 3, snack: 2, daily: 3, mag: 1, med: .4, spec: .3 }, budget: .25, pat: 9, night: .3, impulse: .35 },
  traveler: { n: 'TRAVELER', want: { bento: 4, drink: 4, snack: 2, daily: 2.5, mag: .8, med: .5, spec: 1 }, budget: .35, pat: 5, night: .7, impulse: .3 },
  adventurer: { n: 'ADVENTURER', want: { bento: 2, drink: 2, snack: 1, daily: .6, mag: .4, med: .8, spec: 4 }, budget: .45, pat: 8, night: 1.6, impulse: .25 },
  student: { n: 'STUDENT', want: { bento: 1.5, drink: 3, snack: 4, daily: .2, mag: 3, med: 0, spec: .4 }, budget: .1, pat: 7, night: .15, impulse: .5 },
  thief: { n: 'SHOPLIFTER', want: { snack: 2, daily: 2, mag: 1, spec: 2, med: 1 }, budget: 0, pat: 3, night: 1.2, impulse: 0 },
};
// which signature products a segment actually wants (a wand needs adventurers)
const SPEC_FIT = { carl: { traveler: 1, routine: .5, adventurer: .4, student: .3 }, ghost: { adventurer: 1, student: .4, routine: .15, traveler: .2 },
  linda: { routine: 1, traveler: .7, adventurer: .3, student: .2 }, face: { student: 1, routine: .5, traveler: .4, adventurer: .5 },
  yoko: { traveler: 1, routine: .8, student: .4, adventurer: .3 }, jb: { routine: .8, student: .5, traveler: .5, adventurer: .6 } };

// hourly traffic shape (0..23), konbini peaks at breakfast, lunch, and after work
const HOURLY = [.25, .18, .12, .1, .12, .3, .7, 1.2, 1.3, .8, .7, 1, 1.6, 1.3, .8, .7, .8, 1.1, 1.4, 1.2, 1, .9, .7, .45];

// ---------- fixtures ----------
// cat: which category the shelf holds. cost: MC. walk: false = blocks the tile.
const FIX = {
  bento: { n: 'BENTO CASE', cat: 'bento', cost: 900000, power: 700 },
  drink: { n: 'DRINK COOLER', cat: 'drink', cost: 800000, power: 600 },
  snack: { n: 'SNACK SHELF', cat: 'snack', cost: 300000, power: 0 },
  daily: { n: 'DAILY SHELF', cat: 'daily', cost: 300000, power: 0 },
  mag: { n: 'MAGAZINE RACK', cat: 'mag', cost: 250000, power: 0 },
  med: { n: 'MEDICINE CASE', cat: 'med', cost: 600000, power: 0 },
  spec: { n: 'SPECIALTY', cat: 'spec', cost: 700000, power: 100 },
  reg: { n: 'REGISTER', cost: 1200000, power: 200 },
};
const FIX_KINDS = Object.keys(FIX);
const FACINGS = 2, FACE_CAP = 32, FACE_ICON = 4; // a shelf has 2 facings of 32 units each (drawn as 8 icons of 4): never room for the whole catalogue

// ---------- stores ----------
// fw x fh = sales floor in tiles; the backroom is a strip above it. util: MC per open hour.
const SIZES = [null,
  { fw: 10, fh: 7, cost: 8000000, staff: 2, util: 250, unlock: 0 },
  { fw: 12, fh: 8, cost: 12000000, staff: 3, util: 350, unlock: 20000000 },
];
const HOURS = [{ n: '24 HOURS', o: 0, c: 24 }, { n: '7-23', o: 7, c: 23 }, { n: '7-22', o: 7, c: 22 }, { n: '10-22', o: 10, c: 22 }, { n: '6-24', o: 6, c: 24 }, { n: '16-6 NIGHT', o: 16, c: 30 }];
const isOpen = (h, hr) => { const H = HOURS[h]; return hr >= H.o && hr < H.c || hr + 24 < H.c; };
const openHours = h => HOURS[h].c - HOURS[h].o;

// [kind, x, y, dir] dir: side a customer shops from: 0 down, 1 left, 2 up, 3 right
const LAYOUTS = {
  1: [['drink', 0, 0, 0], ['drink', 1, 0, 0], ['drink', 2, 0, 0], ['bento', 6, 0, 0], ['bento', 7, 0, 0], ['bento', 8, 0, 0], ['daily', 9, 1, 1], ['daily', 9, 2, 1], ['med', 9, 3, 1],
    ['snack', 3, 3, 2], ['snack', 4, 3, 2], ['spec', 5, 3, 2], ['daily', 6, 3, 2], ['mag', 7, 6, 2], ['mag', 8, 6, 2], ['mag', 9, 6, 2], ['reg', 1, 4, 3], ['reg', 1, 2, 3]],
  2: [['drink', 0, 0, 0], ['drink', 1, 0, 0], ['drink', 2, 0, 0], ['drink', 3, 0, 0], ['bento', 7, 0, 0], ['bento', 8, 0, 0], ['bento', 9, 0, 0], ['bento', 10, 0, 0],
    ['daily', 11, 1, 1], ['daily', 11, 2, 1], ['med', 11, 3, 1], ['spec', 11, 4, 1], ['snack', 4, 3, 2], ['snack', 5, 3, 2], ['spec', 6, 3, 2], ['daily', 7, 3, 2],
    ['snack', 4, 4, 0], ['snack', 5, 4, 0], ['mag', 8, 7, 2], ['mag', 9, 7, 2], ['mag', 10, 7, 2], ['reg', 1, 4, 3], ['reg', 1, 6, 3]],
};
const DIRS = [[0, 1], [-1, 0], [0, -1], [1, 0]];

// ---------- staff pool ----------
// [name, look, stamina, education, agility, sociability, hourly wage]
// The hiring screen shows the caps (edu/agi/soc). Real starting abilities are rolled from them and stay hidden until they work.
const STAFF_POOL = [
  ['MOSS PELLECK', 'human', 70, 62, 55, 48, 320], ['RITSU ABE', 'human', 55, 88, 40, 70, 420], ['DOT OKAFOR', 'human', 80, 45, 82, 60, 300],
  ['BEV-9000', 'android', 99, 70, 60, 20, 380], ['HOLLOW TOM', 'spirit', 60, 50, 35, 90, 260], ['MINA KURODA', 'human', 65, 75, 70, 75, 480],
  ['GUS GRUBB', 'human', 85, 30, 60, 35, 250], ['ODETTE VANE', 'spirit', 45, 95, 50, 85, 520], ['KEV PLUNK', 'human', 75, 40, 45, 80, 290],
  ['UNIT 77', 'android', 95, 55, 90, 25, 350], ['TOMOKO ISE', 'human', 60, 80, 65, 55, 440], ['BIG MARGE', 'human', 90, 35, 75, 65, 310],
  ['PIP SORREL', 'cat', 50, 60, 95, 70, 330], ['DEXTER LUM', 'human', 70, 70, 30, 40, 300], ['SISTER NOX', 'spirit', 55, 65, 55, 60, 360],
  ['HAL CROWLEY', 'human', 65, 50, 50, 50, 280], ['JUNE PAK', 'human', 75, 85, 80, 90, 600], ['WHISKERS', 'cat', 40, 25, 99, 99, 240],
];

// ---------- managers (prototype: Carl and Ghost) ----------
const MGRS = {
  carl: { n: 'CARL', store: 'VERY NORMAL CONVENIENCE', short: 'VERY NORMAL', col: '#38c8a0', col2: '#f0d040', floor: '#3a8a58', wall: '#9a5a2a', paper: '#5a3a1e',
    power: 'BACKDOOR DELIVERY', margin: .38, mix: 'traveler' },
  ghost: { n: 'SPOOKY GHOST', store: 'SPOOKY MART', short: 'SPOOKY MART', col: '#a070ff', col2: '#ffb050', floor: '#3a2a6a', wall: '#4a2a5a', paper: '#1a1030',
    power: 'GRAND DEMONSTRATION', margin: .42, mix: 'adventurer' },
  linda: { n: 'CEO LINDA', store: 'LINDA SELECT', short: 'LINDA SELECT', col: '#ff5aa8', col2: '#f0c040', floor: '#24402e', wall: '#a8802a', paper: '#16261c',
    power: 'BRAND CONTRACT', margin: .45, mix: 'routine' },
  face: { n: 'THE FACE', store: 'THE POTENTIAL STORE', short: 'POTENTIAL', col: '#40a8ff', col2: '#e0f4ff', floor: '#284866', wall: '#5a6a84', paper: '#0e1a2e',
    power: 'PILOT BATCH', margin: .40, mix: 'student' },
  yoko: { n: 'YOKO', store: 'YOKO EVERYDAY', short: 'YOKO EVERYDAY', col: '#30a898', col2: '#fff4e0', floor: '#a8b8a0', wall: '#8a7a68', paper: '#c8c0b0',
    power: 'NEED KITS', margin: .36, mix: 'traveler' },
  jb: { n: 'JB GARFIELD', store: 'MIDNIGHT CONVENIENCE', short: 'MIDNIGHT', col: '#f08a30', col2: '#5a6aa8', floor: '#3a3242', wall: '#5a3a28', paper: '#141020',
    power: 'CUSTOMER CASE', margin: .38, mix: 'routine' },
};
const MGR_IDS = Object.keys(MGRS);
// the manager each one is most naturally up against (the default rival)
const NATURAL_RIVAL = { carl: 'ghost', ghost: 'carl', linda: 'yoko', yoko: 'linda', face: 'jb', jb: 'face' };

// ---------- the managers' special mechanics ----------
const CONTRACT = { months: 3, fee: 250000, cut: .2 }; // Linda: per store per month; cuts the cost of her lines and every premium item
const PILOT = { cost: 1500000, good: .55, meh: .25, refund: 600000 }; // Face: a test batch of one signature line, result after a day
const KIT_SETUP = 200000, KIT_DISC = .1, KIT_MAX = 2; // Yoko
const KITS = [
  { id: 'lunch', n: 'LUNCH SET', a: 'tunaonigi', b: 'greentea' }, { id: 'latemeal', n: 'LATE MEAL', a: 'noodle', b: 'cancoffee' },
  { id: 'travel', n: 'TRAVEL PACK', a: 'cable', b: 'water' }, { id: 'rainy', n: 'RAINY DAY', a: 'umbrella', b: 'cocoa' },
  { id: 'cold', n: 'COLD CARE', a: 'coldmed', b: 'tissue' }, { id: 'snack', n: 'STUDY BREAK', a: 'chips', b: 'cola' },
  { id: 'trip', n: 'NEXT FLIGHT', a: 'travelkit', b: 'water' }, { id: 'phrase', n: 'NEW IN TOWN', a: 'phrase', b: 'travelguide' },
];
const CASE_COST = 150000, CASE_HOURS = 3; // JB

// ---------- the mall map ----------
// 30 x 18 squares. '.' corridor, '=' main concourse, '#' back of house. Lots and facilities are 2x2 and listed below.
const MW = 30, MH = 18;
const MALL_ROWS = [
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '..............................',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '==============================',
  '==============================',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '..............................',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
  '######.#######..#######.######',
];
// lots: [x, y] top-left of a 2x2 block that touches a corridor
const LOTS = [[2, 2], [4, 2], [9, 2], [11, 2], [18, 2], [20, 2], [25, 2], [27, 2],
  [2, 6], [4, 6], [9, 6], [17, 6], [25, 6], [27, 6],
  [2, 10], [9, 10], [11, 10], [18, 10], [20, 10], [25, 10],
  [4, 14], [9, 14], [11, 14], [18, 14], [25, 14], [27, 14]];
// facilities: where they can be attracted, what they cost, how much footfall they bring, and to whom
const FACILITIES = {
  vending: { n: 'VENDING ROW', at: [11, 6], cost: 15000000, pop: 0, add: 900, r: 5, mix: { routine: 1, student: 1 } },
  lounge: { n: 'SPIRIT LOUNGE', at: [27, 10], cost: 40000000, pop: 9000, add: 2200, r: 7, mix: { adventurer: 2 } },
  starport: { n: 'STARPORT GATE', at: [2, 14], cost: 90000000, pop: 12000, add: 5200, r: 10, mix: { traveler: 2 } },
  tower: { n: 'ADMIN TOWER', at: [20, 14], cost: 150000000, pop: 20000, add: 4000, r: 12, mix: { routine: 1 }, goal: 1 },
};
const DISTRICTS = [{ n: 'ARRIVAL CONCOURSE', x0: 0, x1: 14, mix: { traveler: 3, routine: 2, student: 1, adventurer: .4, thief: .15 } },
  { n: 'OCCULT PASSAGE', x0: 15, x1: 29, mix: { adventurer: 3, routine: 1.5, student: 1, traveler: .5, thief: .2 } }];
const districtOf = x => DISTRICTS[x < 15 ? 0 : 1];

// ---------- promotion (The Conveni's 販促 -> 宣伝, re-dressed for the mall) ----------
// cost MC, popularity gain (stores max out at 100), when it airs: days ahead (0 = today, or tomorrow if the hour has passed) and hour.
// Every one of the chain's stores gets the gain. Popularity fades back toward what customers actually think of the store.
const ADS = {
  flyers: { n: 'FLYERS', cost: 100000, gain: 12, day: 1, hr: 10, d: 'Paper flyers in every corridor.' },
  bulletin: { n: 'MALL BULLETIN AD', cost: 500000, gain: 20, day: 1, hr: 7, d: 'A spot in the morning bulletin.' },
  blimp: { n: 'MALL BLIMP', cost: 1000000, gain: 30, day: 2, hr: 15, d: 'Your name on the blimp over the atrium.' },
  radio: { n: 'MALL RADIO', cost: 3000000, gain: 50, day: 0, hr: 17, d: 'A jingle on the mall radio.' },
  tv: { n: 'MALL TV', cost: 5000000, gain: 100, day: 0, hr: 19, d: 'A commercial on every screen in the mall.' },
};
const IDOL_AT = 10000; // the chain's 10,000th customer brings a free idol appearance (+100), as in the original
const SLOGANS = { carl: ['VERY NORMAL CONVENIENCE', 'WE ARE HUMANS TOO!'], ghost: ['SPOOKY MART', 'SNACKS TO DIE FOR.'], linda: ['LINDA SELECT', 'YOU DESERVE ME.'],
  face: ['THE POTENTIAL STORE', 'TOMORROW, IN STOCK.'], yoko: ['YOKO EVERYDAY', 'EVERYTHING YOU CAME FOR.'], jb: ['MIDNIGHT CONVENIENCE', 'OPEN ALL NIGHT. NO QUESTIONS.'] };

// ---------- goals ----------
const GOALS = [
  { n: 'ADMIN TOWER', d: 'Reach 20,000 footfall and attract the Mall Administration Tower.' },
  { n: 'MONOPOLY', d: 'The map allows 10 stores in all. Own all 10.' },
  { n: '5 STARS', d: 'Reach a 5-star owner rating with at least 3 stores.' },
];
const STORE_CAP = 10;
