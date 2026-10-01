'use strict';
// ================= SAVE THE WORLD: data — heroes, growth, items, equipment, spells, save crystals, combos =================

// ---------- heroes ----------
// base stats at level 1; hp/mp grow on a curve (see heroHP). cmd = the unique command. weap = which weapon class they can hold.
const HEROES = {
  yoko: { name: 'YOKO', port: 'YOKO', cmd: 'MAGIC', str: 8, mag: 15, spd: 10, vit: 8, mdef: 12, hp: 44, mp: 22, weap: 'rod', title: 'THE ASSISTANT' },
  carl: { name: 'CARL', port: 'CARL', cmd: 'FIND', str: 11, mag: 7, spd: 12, vit: 9, mdef: 6, hp: 48, mp: 8, weap: 'bong', title: 'A NORMAL GUY' },
  face: { name: 'FACE', port: 'FACE', cmd: 'INVENT', str: 12, mag: 10, spd: 8, vit: 10, mdef: 9, hp: 52, mp: 12, weap: 'lance', title: 'THE KING' },
  oldface: { name: 'OLD FACE', port: 'OLD FACE', cmd: 'WELD', str: 15, mag: 4, spd: 9, vit: 13, mdef: 5, hp: 62, mp: 6, weap: 'torch', title: 'THE BROTHER' },
  linda: { name: 'LINDA', port: 'CEO LINDA', cmd: 'INVOICE', str: 11, mag: 13, spd: 10, vit: 9, mdef: 12, hp: 50, mp: 18, weap: 'rod', title: 'THE GENERAL' },
  ghost: { name: 'GHOST', port: 'SPOOKY GHOST', cmd: 'SEGMENT', str: 9, mag: 11, spd: 11, vit: 8, mdef: 10, hp: 46, mp: 14, weap: 'mic', title: 'THE HOST' },
  garfield: { name: 'GARFIELD', port: 'JB GARFIELD', cmd: 'ACCUSE', str: 14, mag: 3, spd: 6, vit: 12, mdef: 4, hp: 58, mp: 4, weap: 'cane', title: 'THE DETECTIVE' },
  kid: { name: 'PEE KID', port: 'PEE KID', cmd: 'ASK', str: 0, mag: 13, spd: 14, vit: 7, mdef: 12, hp: 40, mp: 20, weap: 'toy', title: 'THE KID' },
  pilotx: { name: 'PILOT X', port: 'PILOT X', cmd: 'INCOGNITO', str: 13, mag: 5, spd: 16, vit: 9, mdef: 6, hp: 50, mp: 6, weap: 'dart', title: 'FOR HIRE' },
  terms: { name: 'TERMS', port: 'LICENSEE', cmd: 'ARMOR', str: 10, mag: 8, spd: 9, vit: 10, mdef: 8, hp: 160, mp: 0, weap: 'none', title: 'A LICENSEE', temp: 1 },
  conds: { name: 'CONDITIONS', port: 'LICENSEE', cmd: 'ARMOR', str: 10, mag: 8, spd: 9, vit: 10, mdef: 8, hp: 160, mp: 0, weap: 'none', title: 'ANOTHER LICENSEE', temp: 1 },
  human: { name: 'HU-MAN', port: 'HU-MAN', cmd: 'MIMIC', str: 11, mag: 11, spd: 11, vit: 11, mdef: 11, hp: 54, mp: 14, weap: 'any', title: 'GENERIC' },
};
const heroHP = (h, lv) => Math.round(h.hp + h.hp * .5 * (lv - 1) + h.hp * .025 * (lv - 1) * (lv - 1));
const heroMP = (h, lv) => Math.round(h.mp + h.mp * .4 * (lv - 1) + h.mp * .011 * (lv - 1) * (lv - 1));
const heroStat = (base, lv) => base + Math.floor((lv - 1) * (base + 6) / 14);
const XPNEED = lv => Math.round(10 * Math.pow(lv, 2.2) + 20 * lv); // to go from lv to lv+1

// ---------- elements and statuses ----------
const ELEM = { hot: 'HOT', cold: 'COLD', zap: 'ZAP', rumble: 'RUMBLE', legacy: 'LEGACY', wet: 'WET' };
const STATUS = { lag: 'LAG', mute: 'MUTE', sleep: 'SCREENSAVER', scram: 'SCRAMBLED', pause: 'PAUSED', turbo: 'TURBO', buffer: 'BUFFER', armor: 'ARMOR UP', mirror: 'MIRROR', float: 'LEVITATE', stun: 'STUNNED', regen: 'REGEN', blind: 'NO SIGNAL' };

// ---------- consumables ----------
// use(t): t is a battle-or-field target object with hp/mhp/mp/mmp/ko/status
const ITEMS = {
  snack: { name: 'SNACK', price: 30, desc: 'RESTORES 60 HP.', heal: 60 },
  meal: { name: 'MEAL', price: 220, desc: 'RESTORES 400 HP.', heal: 400 },
  feast: { name: 'FEAST', price: 1100, desc: 'RESTORES ALL HP.', heal: 99999 },
  coffee: { name: 'COFFEE', price: 150, desc: 'RESTORES 30 MP.', mana: 30 },
  espresso: { name: 'ESPRESSO', price: 1400, desc: 'RESTORES 150 MP.', mana: 150 },
  extralife: { name: 'EXTRA LIFE', price: 400, desc: 'REVIVES A FALLEN ALLY.', revive: .25 },
  antivirus: { name: 'ANTIVIRUS', price: 50, desc: 'CURES LAG.', cure: ['lag'] },
  patch: { name: 'PATCH', price: 300, desc: 'CURES MOST STATUS.', cure: ['lag', 'mute', 'sleep', 'scram', 'pause', 'buffer', 'blind'] },
  earplugs: { name: 'EARPLUGS', price: 80, desc: 'CURES MUTE.', cure: ['mute'] },
  tent: { name: 'SLEEPING BAG', price: 250, desc: 'FIELD/SAVE POINT: RESTORES THE PARTY.', field: 'tent' },
  warp: { name: 'BACK BUTTON', price: 600, desc: 'LEAVES A DUNGEON.', field: 'warp' },
  bomb: { name: 'HOT POCKET', price: 120, desc: 'DEALS HOT DAMAGE TO ALL FOES.', bomb: { elem: 'hot', pow: 60, all: 1 } },
  ice: { name: 'COLD BREW', price: 120, desc: 'DEALS COLD DAMAGE TO ALL FOES.', bomb: { elem: 'cold', pow: 60, all: 1 } },
  battery: { name: 'BATTERY', price: 120, desc: 'DEALS ZAP DAMAGE TO ALL FOES.', bomb: { elem: 'zap', pow: 60, all: 1 } },
  megalife: { name: 'CONTINUE+', price: 0, desc: 'REVIVES AND HEALS THE WHOLE PARTY.', revive: 1, all: 1 },
  cartridge: { name: 'OLD CARTRIDGE', price: 0, desc: 'BLOW ON IT. HITS ALL FOES WITH LEGACY.', bomb: { elem: 'legacy', pow: 140, all: 1 } },
};

// ---------- equipment ----------
// slot: w weapon, a armor, h helm, r relic. who: hero ids, or a weapon class (rod, bong...). atk/def/mdef/stats. elem on weapons.
const EQUIP = {
  // weapons (by class)
  mop: { name: 'WET MOP', slot: 'w', cls: 'rod', atk: 9, mag: 2, price: 0 },
  wand: { name: 'TV REMOTE', slot: 'w', cls: 'rod', atk: 18, mag: 4, price: 300 },
  rod3: { name: 'HOT ROD', slot: 'w', cls: 'rod', atk: 34, mag: 6, elem: 'hot', price: 1500 },
  rod4: { name: 'MIC STAND', slot: 'w', cls: 'rod', atk: 60, mag: 9, price: 5200 },
  rod5: { name: 'SCEPTER OF MANAGEMENT', slot: 'w', cls: 'rod', atk: 95, mag: 12, price: 13000 },
  rod6: { name: 'THE CURSOR', slot: 'w', cls: 'rod', atk: 140, mag: 20, price: 0 },
  bong1: { name: 'MINI BONG', slot: 'w', cls: 'bong', atk: 10, price: 0 },
  bong2: { name: 'GLASS BONG', slot: 'w', cls: 'bong', atk: 20, price: 340 },
  bong3: { name: 'NEON BONG', slot: 'w', cls: 'bong', atk: 38, spd: 2, price: 1600 },
  bong4: { name: 'HAUNTED BONG', slot: 'w', cls: 'bong', atk: 64, price: 5600 },
  bong5: { name: 'FIVE-FOOT BONG', slot: 'w', cls: 'bong', atk: 100, price: 14000 },
  bong6: { name: 'THE BIG ONE', slot: 'w', cls: 'bong', atk: 150, str: 6, price: 0 },
  lance1: { name: 'ANTENNA', slot: 'w', cls: 'lance', atk: 12, price: 0 },
  lance2: { name: 'SATELLITE DISH', slot: 'w', cls: 'lance', atk: 22, price: 360 },
  lance3: { name: 'BOOM MIC', slot: 'w', cls: 'lance', atk: 40, price: 1700 },
  lance4: { name: 'RADIO TOWER', slot: 'w', cls: 'lance', atk: 66, price: 5800 },
  lance5: { name: 'BROADCAST SPIRE', slot: 'w', cls: 'lance', atk: 104, elem: 'zap', price: 14500 },
  lance6: { name: 'THE THIRD EYE', slot: 'w', cls: 'lance', atk: 152, mag: 8, price: 0 },
  torch1: { name: 'SPARKER', slot: 'w', cls: 'torch', atk: 13, elem: 'hot', price: 0 },
  torch2: { name: 'BLOWTORCH', slot: 'w', cls: 'torch', atk: 24, elem: 'hot', price: 380 },
  torch3: { name: 'ARC WELDER', slot: 'w', cls: 'torch', atk: 42, elem: 'zap', price: 1800 },
  torch4: { name: 'PLASMA CUTTER', slot: 'w', cls: 'torch', atk: 70, price: 6000 },
  torch5: { name: 'THE HERMIT\'S TORCH', slot: 'w', cls: 'torch', atk: 108, price: 15000 },
  torch6: { name: 'FOUR-SHADE FLAME', slot: 'w', cls: 'torch', atk: 156, elem: 'legacy', price: 0 },
  mic1: { name: 'CUE CARDS', slot: 'w', cls: 'mic', atk: 10, price: 0 },
  mic2: { name: 'WIRELESS MIC', slot: 'w', cls: 'mic', atk: 20, price: 330 },
  mic3: { name: 'APPLAUSE SIGN', slot: 'w', cls: 'mic', atk: 37, price: 1550 },
  mic4: { name: 'LAUGH TRACK', slot: 'w', cls: 'mic', atk: 62, price: 5400 },
  mic5: { name: 'PRIME TIME', slot: 'w', cls: 'mic', atk: 98, price: 13500 },
  mic6: { name: 'THE LAST BROADCAST', slot: 'w', cls: 'mic', atk: 146, mag: 10, price: 0 },
  cane1: { name: 'WALKING CANE', slot: 'w', cls: 'cane', atk: 14, price: 0 },
  cane2: { name: 'UMBRELLA', slot: 'w', cls: 'cane', atk: 26, price: 400 },
  cane3: { name: 'SWORD CANE', slot: 'w', cls: 'cane', atk: 45, price: 1900 },
  cane4: { name: 'NIGHTSTICK', slot: 'w', cls: 'cane', atk: 74, price: 6200 },
  cane5: { name: 'THE CASE FILE', slot: 'w', cls: 'cane', atk: 112, price: 15500 },
  cane6: { name: 'LASAGNA', slot: 'w', cls: 'cane', atk: 160, str: 8, price: 0 },
  toy1: { name: 'YO-YO', slot: 'w', cls: 'toy', atk: 0, mag: 2, price: 0 },
  toy2: { name: 'KAZOO', slot: 'w', cls: 'toy', atk: 0, mag: 5, price: 300 },
  toy3: { name: 'MAGNIFYING GLASS', slot: 'w', cls: 'toy', atk: 0, mag: 9, price: 1500 },
  toy4: { name: 'BIG CRAYONS', slot: 'w', cls: 'toy', atk: 0, mag: 14, price: 5200 },
  toy5: { name: 'HALL PASS', slot: 'w', cls: 'toy', atk: 0, mag: 20, price: 13000 },
  toy6: { name: 'THE POTTY TRAINER', slot: 'w', cls: 'toy', atk: 0, mag: 30, price: 0 },
  dart1: { name: 'PAPER PLANES', slot: 'w', cls: 'dart', atk: 13, price: 0 },
  dart2: { name: 'DARTS', slot: 'w', cls: 'dart', atk: 25, price: 390 },
  dart3: { name: 'THROWING STARS', slot: 'w', cls: 'dart', atk: 44, price: 1850 },
  dart4: { name: 'JET ENGINE', slot: 'w', cls: 'dart', atk: 72, spd: 3, price: 6100 },
  dart5: { name: 'AFTERBURNER', slot: 'w', cls: 'dart', atk: 110, price: 15200 },
  dart6: { name: 'X MARKS', slot: 'w', cls: 'dart', atk: 158, price: 0 },
  // armor (most heroes can wear most armor)
  hoodie: { name: 'HOODIE', slot: 'a', def: 8, mdef: 4, price: 50 },
  suit: { name: 'BUSINESS CASUAL', slot: 'a', def: 16, mdef: 8, price: 380 },
  vest: { name: 'SAFETY VEST', slot: 'a', def: 28, mdef: 14, price: 1400 },
  armor4: { name: 'PADDED SUIT', slot: 'a', def: 44, mdef: 26, price: 4600 },
  armor5: { name: 'POWER SUIT', slot: 'a', def: 64, mdef: 40, price: 11000 },
  armor6: { name: 'THE SAVE SUIT', slot: 'a', def: 90, mdef: 70, price: 0 },
  robe: { name: 'BATHROBE', slot: 'a', def: 10, mdef: 12, mag: 2, price: 360, who: ['yoko', 'linda', 'ghost', 'kid', 'face'] },
  robe2: { name: 'WIZARD ROBE', slot: 'a', def: 30, mdef: 40, mag: 5, price: 5000, who: ['yoko', 'linda', 'ghost', 'kid', 'face'] },
  cap: { name: 'BASEBALL CAP', slot: 'h', def: 4, mdef: 2, price: 40 },
  hardhat: { name: 'HARD HAT', slot: 'h', def: 10, mdef: 5, price: 320 },
  helm3: { name: 'HEADSET', slot: 'h', def: 18, mdef: 14, price: 1300 },
  helm4: { name: 'VR GOGGLES', slot: 'h', def: 28, mdef: 22, price: 4200 },
  helm5: { name: 'THINKING CAP', slot: 'h', def: 40, mdef: 36, mag: 4, price: 10500 },
  helm6: { name: 'THE CROWN', slot: 'h', def: 58, mdef: 58, price: 0 },
  // relics
  shades: { name: 'SUNGLASSES', slot: 'r', desc: 'BLOCKS NO SIGNAL.', block: ['blind'], price: 400 },
  earbuds: { name: 'EARBUDS', slot: 'r', desc: 'BLOCKS MUTE.', block: ['mute'], price: 600 },
  coffeemug: { name: 'COFFEE MUG', slot: 'r', desc: 'BLOCKS SCREENSAVER.', block: ['sleep'], price: 600 },
  firewall: { name: 'FIREWALL', slot: 'r', desc: 'BLOCKS LAG.', block: ['lag'], price: 500 },
  sneakers: { name: 'SNEAKERS', slot: 'r', desc: 'STARTS BATTLE WITH TURBO.', auto: 'turbo', price: 3000 },
  bodyguard: { name: 'BODYGUARD', slot: 'r', desc: 'PROTECTS WEAK ALLIES.', cover: 1, price: 0 },
  luckycoin: { name: 'LUCKY COIN', slot: 'r', desc: 'MORE GP AFTER BATTLE.', gp: 1, price: 0 },
  pager: { name: 'PAGER', slot: 'r', desc: 'FEWER RANDOM ENCOUNTERS.', fewer: 1, price: 0 },
  strap: { name: 'GUITAR STRAP', slot: 'r', desc: 'STR +6.', str: 6, price: 2500 },
  focuslens: { name: 'FOCUS LENS', slot: 'r', desc: 'MAG +6.', mag: 6, price: 2500 },
  turbobutton: { name: 'TURBO BUTTON', slot: 'r', desc: 'FIGHT HITS TWICE.', twice: 1, price: 0 },
  blinker: { name: 'CURSOR BLINK', slot: 'r', desc: 'MAGIC CASTS TWICE.', dual: 1, price: 0 },
  backup: { name: 'BACKUP COPY', slot: 'r', desc: 'AUTO-CONTINUE ONCE PER BATTLE.', reraise: 1, price: 0 },
  hallpass: { name: 'HALL PASS', slot: 'r', desc: 'ALWAYS RUN AWAY.', escape: 1, price: 0 },
};
const canEquip = (heroId, e) => { const h = HEROES[heroId]; if (e.who) return e.who.includes(heroId); if (e.slot === 'w') return h.weap === 'any' || e.cls === h.weap; return true; };

// ---------- spells ----------
// pow: spell power. tgt: 'one' 'all' 'ally' 'allies' 'self'. mp cost. heal / revive / status / elem.
const SPELLS = {
  better: { name: 'BETTER', mp: 5, pow: 12, heal: 1, tgt: 'ally', canAll: 1 },
  betterer: { name: 'BETTERER', mp: 18, pow: 32, heal: 1, tgt: 'ally', canAll: 1 },
  best: { name: 'BEST', mp: 48, pow: 70, heal: 1, tgt: 'ally', canAll: 1 },
  cont: { name: 'CONTINUE', mp: 30, revive: .25, tgt: 'ally' },
  restart: { name: 'RESTART', mp: 70, revive: 1, tgt: 'ally' },
  antivirus: { name: 'ANTIVIRUS', mp: 3, cure: ['lag'], tgt: 'ally' },
  patch: { name: 'PATCH', mp: 15, cure: ['lag', 'mute', 'sleep', 'scram', 'pause', 'buffer', 'blind'], tgt: 'ally' },
  hot: { name: 'HOT', mp: 4, pow: 20, elem: 'hot', tgt: 'one', canAll: 1 },
  hotter: { name: 'HOTTER', mp: 20, pow: 50, elem: 'hot', tgt: 'one', canAll: 1 },
  hottest: { name: 'HOTTEST', mp: 50, pow: 110, elem: 'hot', tgt: 'one', canAll: 1 },
  cold: { name: 'COLD', mp: 5, pow: 21, elem: 'cold', tgt: 'one', canAll: 1 },
  colder: { name: 'COLDER', mp: 21, pow: 52, elem: 'cold', tgt: 'one', canAll: 1 },
  coldest: { name: 'COLDEST', mp: 52, pow: 112, elem: 'cold', tgt: 'one', canAll: 1 },
  zap: { name: 'ZAP', mp: 6, pow: 22, elem: 'zap', tgt: 'one', canAll: 1 },
  zapper: { name: 'ZAPPER', mp: 22, pow: 54, elem: 'zap', tgt: 'one', canAll: 1 },
  zappiest: { name: 'ZAPPIEST', mp: 54, pow: 115, elem: 'zap', tgt: 'one', canAll: 1 },
  rumble: { name: 'RUMBLE', mp: 40, pow: 80, elem: 'rumble', tgt: 'all' },
  drain: { name: 'DRAIN', mp: 14, pow: 34, drain: 1, tgt: 'one' },
  lag: { name: 'LAG', mp: 3, pow: 10, status: 'lag', tgt: 'one' },
  mute: { name: 'MUTE', mp: 8, status: 'mute', hit: 80, tgt: 'one' },
  sleep: { name: 'SCREENSAVER', mp: 6, status: 'sleep', hit: 75, tgt: 'one' },
  scram: { name: 'SCRAMBLE', mp: 10, status: 'scram', hit: 70, tgt: 'one' },
  pause: { name: 'PAUSE', mp: 18, status: 'pause', hit: 60, tgt: 'one' },
  buffer: { name: 'BUFFER', mp: 6, status: 'buffer', hit: 85, tgt: 'one' },
  turbo: { name: 'TURBO', mp: 10, status: 'turbo', tgt: 'ally', good: 1 },
  armor: { name: 'ARMOR UP', mp: 8, status: 'armor', tgt: 'ally', good: 1 },
  mirror: { name: 'MIRROR MODE', mp: 20, status: 'mirror', tgt: 'ally', good: 1 },
  float: { name: 'LEVITATE', mp: 8, status: 'float', tgt: 'allies', good: 1 },
  scan: { name: 'SCAN', mp: 1, scan: 1, tgt: 'one' },
  credits: { name: 'CREDITS', mp: 72, pow: 130, tgt: 'all', pierce: 1 },
  theend: { name: 'THE END', mp: 90, pow: 160, tgt: 'all', pierce: 1 },
  erase: { name: 'ERASE', mp: 30, erase: 1, hit: 50, tgt: 'one' },
};
// what each hero knows from the start (or learns by level, the natural casters)
const NATURAL = {
  yoko: [[1, 'hot'], [1, 'better'], [4, 'antivirus'], [8, 'drain'], [12, 'hotter'], [18, 'scan'], [22, 'betterer'], [28, 'turbo'], [34, 'hottest'], [40, 'theend']],
  linda: [[1, 'cold'], [3, 'better'], [8, 'scan'], [12, 'colder'], [16, 'armor'], [24, 'mirror'], [30, 'coldest'], [36, 'best']],
};

// ---------- save crystals (the espers) ----------
// spells: [spell, learn rate x]. bonus on level-up. summon: a once-per-battle effect.
const CRYSTALS = {
  clerk: { name: 'THE CLERK', desc: 'KEEPS WHAT IS LOST.', spells: [['better', 10], ['antivirus', 10], ['cont', 2]], bonus: 'hp', summon: { name: 'LOST & FOUND', heal: 40 } },
  biscuit: { name: 'BISCUIT', desc: 'A GOOD DOG.', spells: [['turbo', 4], ['scan', 10]], bonus: 'spd', summon: { name: 'GOOD BOY', regen: 1 } },
  pill: { name: 'PROP PILL', desc: 'SIDE EFFECTS MAY INCLUDE.', spells: [['lag', 10], ['sleep', 6], ['antivirus', 8]], bonus: 'vit', summon: { name: 'SIDE EFFECTS', status: ['lag', 'sleep'] } },
  bus: { name: 'DESERT BUS', desc: 'IT TAKES EIGHT HOURS.', spells: [['buffer', 6], ['hot', 8]], bonus: 'hp', summon: { name: 'EIGHT HOURS', status: ['buffer'] } },
  star: { name: 'THE MOVIE STAR', desc: 'READY FOR THE CLOSE-UP.', spells: [['hotter', 4], ['mirror', 2]], bonus: 'mag', summon: { name: 'CLOSE-UP', pow: 70, elem: 'hot' } },
  prof: { name: 'THE PROFESSOR', desc: 'TENURED.', spells: [['cold', 8], ['colder', 4], ['scan', 8]], bonus: 'mag', summon: { name: 'LECTURE', status: ['sleep'] } },
  yokoid: { name: 'YOKOID', desc: 'MAY I HELP YOU?', spells: [['betterer', 4], ['cont', 4], ['patch', 3]], bonus: 'mdef', summon: { name: 'MAY I HELP YOU', heal: 90 } },
  taka: { name: 'TAKAHASHI', desc: 'TEXT-TO-SPEECH.', spells: [['zap', 8], ['zapper', 4], ['mute', 5]], bonus: 'mag', summon: { name: 'TEXT-TO-SPEECH', pow: 60, elem: 'zap' } },
  nose: { name: 'MISS NOSE', desc: 'SHE HAS A WHISTLE.', spells: [['mute', 6], ['armor', 5]], bonus: 'vit', summon: { name: 'RE-EDUCATION', status: ['mute', 'buffer'] } },
  gen: { name: 'THE GENERATOR', desc: 'IT RUNS ON POTENTIAL.', spells: [['zappiest', 2], ['drain', 5]], bonus: 'str', summon: { name: 'POTENTIAL', pow: 120 } },
  bouncer: { name: 'THE BOUNCER', desc: 'NOT ON THE LIST.', spells: [['rumble', 3], ['pause', 3]], bonus: 'str', summon: { name: 'VELVET ROPE', shield: 1 } },
  auditor: { name: 'THE AUDITOR', desc: 'EVERYTHING IS ACCOUNTED FOR.', spells: [['erase', 2], ['scram', 5]], bonus: 'spd', summon: { name: 'AUDIT', pow: 140 } },
  faceless: { name: 'THE FACELESS', desc: 'NOBODY IN PARTICULAR.', spells: [['hottest', 2], ['coldest', 2], ['restart', 1]], bonus: 'mag', summon: { name: 'NO FACE', pow: 160 } },
  first: { name: 'THE FIRST SAVE', desc: 'SLOT 0. IT WAS HERE FIRST.', spells: [['credits', 1], ['best', 2], ['theend', 1]], bonus: 'all', summon: { name: 'CONTINUE?', heal: 999, revive: 1 } },
};

// ---------- LICENSED ARMOR (the opening): every pilot's command is ARMOR ----------
const BEAMS = [
  { name: 'UPSELL BEAM', desc: 'HOT DAMAGE TO ONE.', sp: 26, elem: 'hot', tgt: 'one' },
  { name: 'PRICE FREEZE', desc: 'COLD DAMAGE TO ONE.', sp: 26, elem: 'cold', tgt: 'one' },
  { name: 'FINE PRINT', desc: 'ZAP DAMAGE TO ONE.', sp: 26, elem: 'zap', tgt: 'one' },
  { name: 'REFUND', desc: 'RESTORES AN ALLY.', sp: 30, heal: 1, tgt: 'ally' },
  { name: 'TERMS ACCEPTED', desc: 'HITS EVERYTHING. ONLY THE ASSISTANT CAN USE IT.', sp: 40, tgt: 'all', only: 'yoko' },
];
// ---------- the inventor's gadgets (FACE: INVENT) ----------
const GADGETS = {
  drill: { name: 'DRILL', desc: 'BIG DAMAGE TO ONE. IGNORES ARMOR.', pow: 2.2, tgt: 'one', pierce: 1 },
  pitch: { name: 'AUTO-PITCHER', desc: 'HITS ALL FOES WITH BASEBALLS.', pow: 1.1, tgt: 'all' },
  noise: { name: 'NOISE BLASTER', desc: 'SCRAMBLES ALL FOES.', status: 'scram', hit: 60, tgt: 'all' },
  bio: { name: 'IDEA BOMB', desc: 'HOT DAMAGE TO ALL FOES.', pow: 1.6, elem: 'hot', tgt: 'all', magic: 1 },
  flash: { name: 'FLASHBULB', desc: 'NO SIGNAL TO ALL FOES.', status: 'blind', hit: 70, tgt: 'all' },
  chain: { name: 'CHAINSAW', desc: 'HEAVY DAMAGE. SOMETIMES ERASES.', pow: 3, tgt: 'one', erase: 15 },
  air: { name: 'AIR HORN', desc: 'HITS ALL FOES. LOUD.', pow: 2.4, tgt: 'all' },
};
// ---------- OLD FACE: WELD techniques (enter the inputs) ----------
const WELDS = [
  { id: 'pummel', name: 'TACK WELD', input: ['left', 'right', 'left'], lv: 1, pow: 1.8, tgt: 'one' },
  { id: 'aura', name: 'SPARK SHOWER', input: ['down', 'left', 'up'], lv: 4, pow: 1.4, tgt: 'all', elem: 'hot' },
  { id: 'suplex', name: 'SEAM', input: ['down', 'down', 'up', 'a'], lv: 9, pow: 3.2, tgt: 'one' },
  { id: 'chakra', name: 'COOL DOWN', input: ['up', 'down', 'up', 'down'], lv: 14, heal: 1, tgt: 'allies' },
  { id: 'phoenix', name: 'RE-FUSE', input: ['left', 'left', 'right', 'right', 'a'], lv: 20, revive: .5, tgt: 'allies' },
  { id: 'bum', name: 'BEAD OF FIRE', input: ['right', 'down', 'left', 'up', 'right'], lv: 27, pow: 3.4, tgt: 'all', elem: 'hot' },
  { id: 'cyclone', name: 'FOUR-SHADE WELD', input: ['up', 'right', 'down', 'left', 'up', 'a'], lv: 34, pow: 4.6, tgt: 'all', elem: 'legacy' },
];
// ---------- JB GARFIELD: ACCUSE levels (the longer he thinks, the bigger the case) ----------
const ACCUSE = [
  { name: 'SUSPECT', pow: 1.6, tgt: 'one', desc: 'A HUNCH.' },
  { name: 'MOTIVE', pow: 1.4, tgt: 'all', desc: 'EVERYONE HAD A REASON.' },
  { name: 'ALIBI', pow: 0, tgt: 'one', status: 'pause', hit: 100, desc: 'THEIR STORY FALLS APART.' },
  { name: 'CASE CLOSED', pow: 3.8, tgt: 'all', desc: 'IT WAS ALL OF YOU.' },
];
// ---------- SPOOKY GHOST: SEGMENT reels ----------
const REELS = ['GUEST', 'BIT', 'BREAK', 'GHOST', 'BOO'];
// ---------- PEE KID: the three verbs ----------
const KIDVERB = { kid: 'ASK', wee: 'PERFORM', boy: 'INSPECT' };

// ---------- combos (PS4-style combination techniques) ----------
// when two heroes' commands land within the window, the combo fires as a bonus action
const COMBOS = [
  { a: ['face', 'INVENT'], b: ['oldface', 'WELD'], name: 'PROTOTYPE', pow: 3.2, tgt: 'all', desc: 'THE BROTHERS BUILD SOMETHING.' },
  { a: ['carl', 'FIND'], b: ['pilotx', 'INCOGNITO'], name: 'FIVE-FINGER DISCOUNT', steal: 1, tgt: 'all', desc: 'NOBODY SAW ANYTHING.' },
  { a: ['linda', 'INVOICE'], b: ['garfield', 'ACCUSE'], name: 'LITIGATION', pow: 2.4, status: 'mute', tgt: 'all', desc: 'SEE YOU IN COURT.' },
  { a: ['ghost', 'SEGMENT'], b: ['kid', 'ASK'], name: 'SPECIAL GUEST', heal: 50, tgt: 'allies', desc: 'THE KID GETS A SEGMENT.' },
  { a: ['yoko', 'MAGIC'], b: ['face', 'INVENT'], name: 'IDEA FIRE', pow: 2.6, elem: 'hot', tgt: 'all', desc: 'HER IDEA. HIS DESIGN.' },
  { a: ['carl', 'FIGHT'], b: ['garfield', 'FIGHT'], name: 'FIASCO', pow: 2.8, tgt: 'one', desc: 'GARFIELD CALLS IT A FIASCO.' },
  { a: ['yoko', 'MAGIC'], b: ['linda', 'MAGIC'], name: 'MERGER', pow: 2.2, tgt: 'all', desc: 'A HOSTILE ONE.' },
  { a: ['ghost', 'SEGMENT'], b: ['face', 'INVENT'], name: 'REUNION SPECIAL', pow: 3, tgt: 'all', desc: 'THEY USED TO DO A SHOW.' },
];
