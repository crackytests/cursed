'use strict';
// ================= SAVE THE WORLD: the bestiary, formations, encounter zones =================
const FOES = {};
// stats from a level: hp, attack power, magic, defense, rewards (tuned so a fight takes 2-4 hits early, 2-3 late)
function estats(lv, o = {}) {
  const hp = Math.round(28 * (1 + .6 * lv + .06 * lv * lv) * (o.hp || 1));
  const tgt = .085 * 50 * (1 + .5 * (lv - 1) + .025 * (lv - 1) * (lv - 1)) * (o.atk || 1);
  const atk = Math.max(4, Math.round(tgt / ((1 + lv * lv / 160) * .86)));
  const xp = Math.round((10 * Math.pow(lv, 2.2) + 20 * lv) * .12 * (o.xp || 1));
  return { lv, hp, atk, mag: Math.round((6 + lv * 1.6) * (o.mag || 1)), def: Math.round(Math.min(200, lv * 2.4 * (o.def || 1))), mdef: Math.round(Math.min(200, lv * 2.2 * (o.mdef || 1))), spd: Math.round((8 + lv * .35) * (o.spd || 1)), xp, gp: Math.round(xp * .9 * (o.gp || 1)), ap: o.ap || (lv < 10 ? 1 : lv < 22 ? 2 : 3) };
}
// a weighted move picker for ordinary foes
function aiMoves(list) { return u => { const tot = list.reduce((a, [w]) => a + w, 0); let r = Math.random() * tot; for (const [w, m] of list) { if ((r -= w) <= 0) return m === 'fight' ? { kind: 'fight' } : Object.assign({}, m); } return { kind: 'fight' }; }; }
function foe(id, name, lv, look, o = {}) {
  FOES[id] = Object.assign(estats(lv, o), { name, look }, o.extra || {}, { weak: o.weak || [], resist: o.resist || [], absorb: o.absorb || [], immune: o.immune || [], immuneSt: o.immuneSt || [], undead: o.undead, steal: o.steal, drop: o.drop, dropRate: o.dropRate, ai: o.ai || (o.moves ? aiMoves(o.moves) : null) });
  if (o.boss) FOES[id].boss = 1;
  return FOES[id];
}
const LK = (kit, o, c) => ({ kit, o, c });
const MV = (name, o) => Object.assign({ name }, o);
// ---------------- THE SAVE (first half) ----------------
// A: COLDBOOT and the mines
foe('licensee', 'LICENSEE', 2, LK('trooper', { weap: 'baton', badge: 1 }, ['#ff6db6', '#ffffff', '#242449', '#24dbff']), { steal: 'snack', drop: 'snack' });
foe('hound', 'FRANCHISE HOUND', 3, LK('beast', { collar: 1, mean: 1 }, ['#926d49', '#ff6db6', '#dbdbdb', '#ffdb24']), { spd: 1.4, steal: 'antivirus', moves: [[3, 'fight'], [1, MV('BITE', { pow: 1.4 })]] });
foe('cablerat', 'CABLE RAT', 2, LK('beast', { ears: 'round', cable: 1 }, ['#929292', '#ff92b6', '#242424', '#db2424']), { hp: .8, weak: ['zap'], steal: 'battery', moves: [[3, 'fight'], [1, MV('CHEW CABLE', { sp: 14, elem: 'zap' })]] });
foe('dustbunny', 'DUST BUNNY', 3, LK('blob', { ears: 1, fuzz: 1, smile: 1 }, ['#b6b6b6', '#ff92b6', '#ffffff', '#242424']), { weak: ['hot'], steal: 'snack', moves: [[2, 'fight'], [1, MV('SNEEZE', { status: 'sleep', hit: 45 })]] });
foe('static', 'STATIC', 4, LK('floater', {}, ['#2449b6', '#92dbff', '#ffffff', '#ffffff']), { hp: .8, absorb: ['zap'], weak: ['cold'], drop: 'battery', moves: [[2, 'fight'], [2, MV('SHOCK', { sp: 16, elem: 'zap' })]] });
// B: the north continent, the desert, FACE CASTLE
foe('landshark', 'LAND SHARK', 6, LK('fin', {}, ['#6d92b6', '#ffffff', '#dbc892', '#242424']), { weak: ['zap'], steal: 'meal', moves: [[3, 'fight'], [1, MV('CIRCLE', { pow: 1.6 })]] });
foe('tumble', 'TUMBLEWEED', 5, LK('plant', { tumble: 1 }, ['#b6926d', '#926d49', '#000000', '#242424']), { hp: .9, weak: ['hot'], spd: 1.5, moves: [[3, 'fight'], [1, MV('BLOW AWAY', { run: async (u) => { bmsg('THE TUMBLEWEED BLEW AWAY.'); u.hp = 0; u.gone = 1; u.d.xp && 0; } })]] });
foe('propill', 'PROP PILL', 6, LK('pill', {}, ['#ffffff', '#db2424', '#ffffff', '#242424']), { steal: 'antivirus', drop: 'antivirus', moves: [[2, 'fight'], [2, MV('SIDE EFFECT', { status: 'lag', hit: 70 })]] });
foe('cactus', 'CACTUS GUY', 7, LK('plant', { flower: 1 }, ['#49b649', '#ffdb49', '#b66d24', '#242424']), { hp: 1.2, weak: ['hot'], steal: 'meal', moves: [[3, 'fight'], [1, MV('NEEDLES', { pow: 1.2, tgt: 'all', split: 1 })]] });
foe('upsell', 'UPSELL UNIT', 7, LK('machine', { arm: 1, mean: 1 }, ['#ff6db6', '#ffdb24', '#6d6d6d', '#24dbff']), { hp: 1.3, def: 1.6, weak: ['zap'], steal: 'battery', drop: 'coffee', moves: [[2, 'fight'], [1, MV('UPSELL BEAM', { sp: 22, elem: 'hot' })], [1, MV('TERMS AND CONDITIONS', { status: 'buffer', hit: 60, tgt: 'all' })]] });
// C: the cave, MT. RERUN, the middle continent (west)
foe('spam', 'SPAM', 9, LK('bird', {}, ['#db6d92', '#2449b6', '#ffdb24', '#ffffff']), { spd: 1.3, weak: ['hot'], steal: 'snack', moves: [[2, 'fight'], [2, MV('UNSOLICITED', { pow: .7, tgt: 'all', split: 1 })]] });
foe('popup', 'POP-UP', 8, LK('floater', { window: 1 }, ['#b6b6b6', '#2449b6', '#db2424', '#242424']), { hp: .9, weak: ['zap'], steal: 'earplugs', moves: [[2, 'fight'], [2, MV('CLICK HERE', { status: 'scram', hit: 40 })]] });
foe('troll', 'TROLL', 10, LK('troll', { keyboard: 1 }, ['#6db66d', '#926d49', '#242424', '#db2424']), { hp: 1.6, atk: 1.3, spd: .7, weak: ['hot'], steal: 'meal', drop: 'meal', moves: [[3, 'fight'], [1, MV('ALL CAPS', { pow: 2 })]] });
foe('comment', 'COMMENT', 9, LK('snake', {}, ['#dbdbdb', '#2449b6', '#db2424', '#ffdb24']), { weak: ['cold'], steal: 'antivirus', moves: [[2, 'fight'], [2, MV('REPLY', { sp: 20, status: 'lag', hit: 40 })]] });
// D: GARFEILD and the east
foe('licensee2', 'LICENSEE MK II', 11, LK('trooper', { weap: 'scanner', badge: 1 }, ['#b62470', '#ffffff', '#242449', '#ffdb24']), { steal: 'meal', drop: 'snack', moves: [[2, 'fight'], [1, MV('SCAN AND CHARGE', { sp: 26, elem: 'zap' })]] });
foe('mascot', 'MASCOT', 12, LK('blob', { ears: 1, smile: 1 }, ['#ffdb49', '#db2424', '#ffffff', '#242424']), { hp: 1.5, weak: ['hot'], steal: 'coffee', moves: [[2, 'fight'], [1, MV('HUG', { pow: 1.8 })], [1, MV('DANCE', { status: 'sleep', hit: 40, tgt: 'all' })]] });
foe('liquidator', 'LIQUIDATOR', 13, LK('trooper', { weap: 'spear', badge: 1 }, ['#242449', '#ff6db6', '#929292', '#ff2424']), { hp: 1.2, def: 1.3, steal: 'extralife', moves: [[3, 'fight'], [1, MV('LIQUIDATE', { pow: 2.2 })]] });
// E: the RERUN forest and the train
foe('pilotghost', 'CANCELED PILOT', 13, LK('spook', {}, ['#dbdbff', '#b649ff', '#ffffff', '#242424']), { undead: 1, weak: ['hot'], steal: 'coffee', moves: [[2, 'fight'], [1, MV('NOT PICKED UP', { status: 'mute', hit: 60 })]] });
foe('laughtrack', 'LAUGH TRACK', 14, LK('spook', { prop: 'laugh' }, ['#ffdbb6', '#ff6db6', '#ffffff', '#242424']), { undead: 1, weak: ['hot'], steal: 'earplugs', moves: [[1, 'fight'], [2, MV('HA HA HA', { sp: 18, tgt: 'all', split: 1 })]] });
foe('boomop', 'BOOM OPERATOR', 14, LK('spook', { prop: 'boom' }, ['#b6b6db', '#6d6d92', '#ffffff', '#242424']), { undead: 1, hp: 1.2, weak: ['hot'], steal: 'meal', moves: [[2, 'fight'], [1, MV('IN THE SHOT', { pow: 1.8 })]] });
foe('spoiler', 'SPOILER', 15, LK('bug', { mark: 1, mean: 1 }, ['#492449', '#db2424', '#242424', '#ffdb24']), { spd: 1.4, weak: ['cold'], steal: 'antivirus', moves: [[2, 'fight'], [1, MV('THE ENDING IS', { status: 'scram', hit: 50 })]] });
// F: the plains of waiting
foe('queue', 'THE QUEUE', 15, LK('queue', {}, ['#b6926d', '#6d6db6', '#242424', '#242424']), { hp: 1.6, spd: .6, steal: 'snack', moves: [[2, 'fight'], [1, MV('PUSH', { pow: 1.2, tgt: 'all', split: 1 })]] });
foe('loadbar', 'LOADING BAR', 16, LK('bar', {}, ['#24db92', '#24db92', '#242424', '#db2424']), { def: 1.5, weak: ['zap'], steal: 'battery', moves: [[1, 'fight'], [2, MV('ALMOST THERE', { status: 'buffer', hit: 70 })]] });
foe('chair', 'WAITING ROOM', 16, LK('chair', {}, ['#2492b6', '#db2424', '#242424', '#242424']), { hp: 1.3, steal: 'meal', moves: [[2, 'fight'], [1, MV('HAVE A SEAT', { status: 'sleep', hit: 55 })]] });
foe('takenum', 'TAKE A NUMBER', 17, LK('floater', { window: 1 }, ['#ffffff', '#db2424', '#242424', '#242424']), { weak: ['cold'], steal: 'coffee', moves: [[1, 'fight'], [2, MV('NOW SERVING', { sp: 30, tgt: 'one' })]] });
// G: the south continent, PRESTIGE, the opera
foe('stagerat', 'STAGE RAT', 17, LK('beast', { ears: 'round', mean: 1 }, ['#6d6d6d', '#db2424', '#242424', '#ff2424']), { spd: 1.5, hp: .9, steal: 'snack', moves: [[3, 'fight'], [1, MV('NIBBLE', { pow: 1, drain: 1 })]] });
foe('critic', 'CRITIC', 18, LK('bird', {}, ['#242424', '#db2424', '#ffffff', '#ffdb24']), { weak: ['zap'], steal: 'earplugs', moves: [[1, 'fight'], [2, MV('TWO STARS', { sp: 32, status: 'mute', hit: 40 })]] });
foe('understudy', 'UNDERSTUDY', 18, LK('spook', { prop: 'mic' }, ['#ffdbdb', '#b6926d', '#ffffff', '#242424']), { undead: 1, weak: ['hot'], steal: 'coffee', moves: [[2, 'fight'], [1, MV('LEARNED YOUR LINES', { pow: 1.6 })]] });
foe('paparazzo', 'PAPARAZZO', 19, LK('floater', { mean: 1 }, ['#242424', '#ffdb49', '#ffffff', '#ffffff']), { spd: 1.4, steal: 'shades', dropRate: 8, drop: 'shades', moves: [[1, 'fight'], [2, MV('FLASH', { status: 'blind', hit: 60, tgt: 'all' })]] });
// H: FRANCHISE CITY and the factory
foe('intern', 'INTERN', 20, LK('trooper', { weap: 'baton' }, ['#dbdbdb', '#ff6db6', '#929292', '#242424']), { hp: .7, atk: .7, xp: .8, steal: 'coffee', moves: [[2, 'fight'], [1, MV('FETCH COFFEE', { run: async (u) => { u.hp = Math.min(u.mhp, u.hp + 200); pop(u, 'COFFEE', BCOL.heal); } })]] });
foe('licensee3', 'LICENSEE MK III', 21, LK('trooper', { weap: 'scanner', badge: 1 }, ['#ffffff', '#ff24db', '#242449', '#24dbff']), { def: 1.3, steal: 'meal', moves: [[2, 'fight'], [1, MV('MARKUP', { sp: 34, elem: 'hot' })]] });
foe('copier', 'COPY MACHINE', 22, LK('machine', { copier: 1, smile: 1 }, ['#dbdbdb', '#2449b6', '#929292', '#6dff92']), { hp: 1.3, weak: ['zap'], steal: 'battery', moves: [[1, 'fight'], [1, MV('COPY', { run: async (u) => { const free = [[20, 30], [70, 80], [20, 90], [110, 40]].find(([x, y]) => !B.foes.some(f => f.hp > 0 && Math.abs(f.x - x) < 30 && Math.abs(f.y - y) < 30)); const kinds = alive(B.foes).filter(f => f !== u && !f.d.boss); if (!free || !kinds.length || B.foes.length > 6) { bmsg('PAPER JAM.'); return; } const k = pickOne(kinds); B.foes.push(mkFoeUnit(k.id, free[0], free[1])); bmsg('COPIED ' + k.name + '.'); } })], [1, MV('TONER', { status: 'blind', hit: 50 })]] });
foe('shredder', 'SHREDDER', 22, LK('machine', { mean: 1, arm: 1 }, ['#6d6d6d', '#db2424', '#242424', '#ff2424']), { hp: 1.4, atk: 1.2, weak: ['zap'], steal: 'battery', moves: [[3, 'fight'], [1, MV('SHRED', { pow: 2.2 })]] });
foe('manager', 'MIDDLE MANAGER', 23, LK('troll', {}, ['#dbb692', '#242449', '#242424', '#242424']), { hp: 1.7, spd: .8, steal: 'espresso', dropRate: 6, drop: 'espresso', moves: [[2, 'fight'], [1, MV('LET\'S CIRCLE BACK', { status: 'buffer', hit: 60, tgt: 'all' })], [1, MV('ACTION ITEMS', { pow: 1.4, tgt: 'all', split: 1 })]] });
// I: the memory card, THE CLOUD
foe('corrupt', 'CORRUPT FILE', 24, LK('glitch', {}, ['#ff24db', '#24dbff', '#6dff24', '#ffffff']), { weak: ['legacy'], steal: 'patch', moves: [[1, 'fight'], [1, MV('CORRUPT', { status: 'scram', hit: 50 })], [1, MV('CRC ERROR', { sp: 38, tgt: 'all', split: 1 })]] });
foe('phish', 'PHISH', 24, LK('fin', {}, ['#2470db', '#ffdb49', '#92dbff', '#242424']), { weak: ['zap'], steal: 'meal', moves: [[2, 'fight'], [1, MV('VERIFY YOUR ACCOUNT', { run: async (u, T) => { const t = T[0]; const n = Math.min(G.gp, 80 + rnd(80)); G.gp -= n; bmsg('PHISHED ' + n + ' GP.'); } })]] });
foe('server', 'CLOUD SERVER', 25, LK('machine', { mean: 1 }, ['#dbdbff', '#24dbff', '#49496d', '#6dff92']), { hp: 1.5, def: 1.4, weak: ['cold'], steal: 'espresso', moves: [[1, 'fight'], [2, MV('BANDWIDTH', { sp: 40, elem: 'zap', tgt: 'all', split: 1 })]] });
foe('spambot', 'SPAM BOT', 25, LK('bird', {}, ['#929292', '#24dbff', '#ff2424', '#ff2424']), { spd: 1.5, steal: 'battery', moves: [[2, 'fight'], [2, MV('BULK MAIL', { pow: .8, tgt: 'all', split: 1 })]] });
// ---------------- THE CORRUPTED SAVE (second half): everything is a little bit broken ----------------
foe('sock', 'LOST SOCK', 26, LK('blob', { smile: 1 }, ['#dbdbdb', '#2449b6', '#ffffff', '#242424']), { hp: .8, xp: .8, steal: 'snack', moves: [[1, 'fight']] });
foe('newfile', 'NEW FILE', 27, LK('trooper', { weap: 'baton' }, ['#b6b6b6', '#dbdbdb', '#6d6d6d', '#ffffff']), { steal: 'patch', moves: [[2, 'fight'], [1, MV('FORGET', { status: 'mute', hit: 50 })]] });
foe('badsector', 'BAD SECTOR', 28, LK('glitch', {}, ['#6d2449', '#24dbff', '#242424', '#ffffff']), { weak: ['legacy'], hp: 1.2, steal: 'patch', moves: [[1, 'fight'], [1, MV('READ ERROR', { sp: 44, tgt: 'all', split: 1 })]] });
foe('deadpixel', 'DEAD PIXEL', 29, LK('floater', { mean: 1 }, ['#242424', '#ff2424', '#ffffff', '#ff2424']), { spd: 1.4, steal: 'shades', moves: [[1, 'fight'], [2, MV('STUCK', { status: 'pause', hit: 30 })]] });
foe('texture', 'MISSING TEXTURE', 30, LK('glitch', {}, ['#ff24db', '#000000', '#ff24db', '#ffffff']), { hp: 1.3, weak: ['legacy'], steal: 'espresso', moves: [[1, 'fight'], [1, MV('PURPLE AND BLACK', { sp: 48, tgt: 'all', split: 1 })]] });
foe('focus', 'FOCUS TESTER', 30, LK('trooper', { weap: 'scanner' }, ['#dbc8a0', '#b6a07a', '#6d5a49', '#dbc8a0']), { steal: 'coffee', moves: [[2, 'fight'], [1, MV('WE TESTED IT', { status: 'scram', hit: 45 })]] });
foe('trollking', 'TROLL KING', 31, LK('troll', { keyboard: 1 }, ['#6d2449', '#ffdb49', '#242424', '#ff2424']), { hp: 1.8, atk: 1.3, spd: .7, steal: 'feast', dropRate: 8, drop: 'feast', moves: [[3, 'fight'], [1, MV('FIRST!', { pow: 2.4 })]] });
foe('unsub', 'UNSUBSCRIBE', 32, LK('floater', { window: 1 }, ['#ffffff', '#242424', '#db2424', '#242424']), { steal: 'earplugs', moves: [[1, 'fight'], [2, MV('ARE YOU SURE?', { erase: 25 })]] });
foe('reviewbomb', 'REVIEW BOMB', 33, LK('bird', {}, ['#ffdb49', '#db2424', '#242424', '#ff2424']), { spd: 1.3, steal: 'meal', moves: [[1, 'fight'], [2, MV('ONE STAR', { sp: 52, elem: 'hot', tgt: 'all', split: 1 })]] });
// THE TITLE SCREEN (the final dungeon)
foe('pressstart', 'PRESS START', 36, LK('floater', { window: 1 }, ['#2449b6', '#ffdb49', '#ffffff', '#ffffff']), { steal: 'espresso', moves: [[1, 'fight'], [2, MV('PRESS START', { sp: 56, tgt: 'all', split: 1 })]] });
foe('demomode', 'DEMO MODE', 36, LK('trooper', { weap: 'spear' }, ['#2449b6', '#ffffff', '#242424', '#24dbff']), { hp: 1.3, steal: 'feast', moves: [[2, 'fight'], [1, MV('PLAYS ITSELF', { pow: 1.6, tgt: 'all', split: 1 })]] });
foe('copyright', 'COPYRIGHT', 37, LK('floater', { mean: 1 }, ['#ffffff', '#242424', '#242424', '#242424']), { mdef: 1.5, steal: 'patch', moves: [[1, 'fight'], [2, MV('ALL RIGHTS RESERVED', { status: 'mute', hit: 70, tgt: 'all' })]] });
foe('cheatcode', 'CHEAT CODE', 38, LK('snake', {}, ['#ffdb49', '#24db92', '#242424', '#ff2424']), { spd: 1.5, steal: 'espresso', moves: [[1, 'fight'], [1, MV('UP UP DOWN DOWN', { sp: 60, tgt: 'one' })], [1, MV('INFINITE LIVES', { run: async (u) => { u.hp = u.mhp; pop(u, 'FULL', BCOL.heal); } })]] });
foe('attract', 'ATTRACT LOOP', 38, LK('spook', {}, ['#6dffb6', '#2449b6', '#ffffff', '#242424']), { undead: 1, weak: ['hot'], steal: 'feast', moves: [[1, 'fight'], [2, MV('AGAIN', { sp: 58, tgt: 'all', split: 1 })]] });
foe('loading', 'LOADING...', 39, LK('bar', {}, ['#ffdb49', '#ff24db', '#242424', '#ff2424']), { def: 1.5, hp: 1.4, steal: 'espresso', moves: [[1, 'fight'], [2, MV('NOW LOADING', { status: 'pause', hit: 35, tgt: 'all' })]] });

// ---------------- formations ----------------
const FORMS = {};
// lay out a group on the left side: biggest at the back
function layout(ids) {
  const out = []; let x = 16, col = [], colW = 0, y = 14;
  const sizes = ids.map(id => FOEART.get(FOES[id].look));
  ids.forEach((id, i) => { const s = sizes[i]; if (y + s.h > BWIN - 6 && col.length) { x += colW + 8; y = 14; col = []; colW = 0; } out.push([id, x + (col.length & 1) * 10, y]); col.push(id); colW = Math.max(colW, s.w); y += s.h + 4; });
  const maxX = Math.max(...out.map(([id, x]) => x + FOEART.get(FOES[id].look).w)); if (maxX < 190) for (const o of out) o[1] += Math.floor((190 - maxX) / 2);
  return out;
}
function form(id, ids, o = {}) { FORMS[id] = Object.assign({ foes: o.at || layout(ids) }, o); return FORMS[id]; }
// random encounter groups by area
const AREA = {
  A: [['licensee', 'licensee'], ['hound', 'hound'], ['cablerat', 'cablerat', 'cablerat'], ['dustbunny', 'licensee'], ['static', 'cablerat']],
  Asnow: [['licensee', 'hound'], ['hound', 'hound'], ['licensee', 'licensee', 'licensee'], ['dustbunny', 'dustbunny']],
  B: [['landshark'], ['tumble', 'tumble', 'tumble'], ['propill', 'propill'], ['cactus', 'tumble'], ['landshark', 'propill'], ['upsell']],
  C: [['spam', 'spam'], ['popup', 'popup'], ['troll'], ['comment', 'spam'], ['popup', 'comment', 'popup']],
  D: [['licensee2', 'licensee2'], ['mascot'], ['liquidator', 'licensee2'], ['mascot', 'licensee2']],
  E: [['pilotghost', 'pilotghost'], ['laughtrack', 'boomop'], ['spoiler', 'spoiler'], ['pilotghost', 'laughtrack', 'pilotghost']],
  F: [['queue'], ['loadbar', 'chair'], ['takenum', 'takenum'], ['chair', 'chair'], ['queue', 'takenum']],
  G: [['stagerat', 'stagerat', 'stagerat'], ['critic', 'critic'], ['understudy', 'paparazzo'], ['critic', 'stagerat']],
  H: [['intern', 'intern', 'licensee3'], ['copier', 'licensee3'], ['shredder'], ['manager', 'intern'], ['licensee3', 'licensee3']],
  I: [['corrupt', 'corrupt'], ['phish', 'phish'], ['server'], ['spambot', 'spambot', 'spambot'], ['corrupt', 'spambot']],
  K: [['sock', 'sock', 'sock'], ['sock', 'newfile']],
  L: [['newfile', 'newfile'], ['badsector'], ['deadpixel', 'deadpixel'], ['newfile', 'badsector'], ['focus', 'focus']],
  N: [['texture'], ['trollking'], ['unsub', 'unsub'], ['reviewbomb', 'reviewbomb'], ['texture', 'deadpixel']],
  T: [['pressstart', 'demomode'], ['copyright', 'cheatcode'], ['attract', 'attract'], ['loading'], ['demomode', 'demomode', 'copyright']],
};
for (const a in AREA) AREA[a].forEach((ids, i) => form(a + i, ids));
const forms = a => AREA[a].map((x, i) => a + i);
// world encounter zones: [x0,y0,x1,y1], terrain filter, groups, background
const WZONES = [
  { r: [0, 0, 127, 25], t: '*', forms: forms('Asnow'), bg: 'snow' },
  { r: [0, 0, 127, 44], t: 's', forms: forms('B'), bg: 'desert' },
  { r: [0, 0, 127, 44], forms: forms('B'), bg: 'grass' },
  { r: [0, 45, 52, 74], forms: forms('C'), bg: 'grass' },
  { r: [53, 45, 127, 74], t: '"', forms: forms('E'), bg: 'forest' },
  { r: [53, 45, 127, 74], forms: forms('D'), bg: 'grass' },
  { r: [0, 75, 127, 92], forms: forms('F'), bg: 'plains' },
  { r: [0, 93, 63, 111], forms: forms('G'), bg: 'grass' },
  { r: [64, 93, 127, 111], forms: forms('H'), bg: 'desert' },
];
const WZONES2 = [
  { r: [0, 0, 127, 111], t: '?', forms: forms('N'), bg: 'void' },
  { r: [44, 48, 84, 74], forms: forms('N'), bg: 'void' },
  { r: [0, 0, 127, 44], forms: forms('L'), bg: 'grass' },
  { r: [0, 0, 127, 111], forms: forms('L').concat(forms('N')), bg: 'grass' },
];
