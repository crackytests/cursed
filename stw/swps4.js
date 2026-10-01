'use strict';
// ================= SAVE THE WORLD: the Phantasy Star pass — a second planet (THE MEMORY CARD), the android MAYI, SKILLS
// (limited uses per rest), the DESERT BUS as a land vehicle with its own battles, and a front-on battle view =================

// ---------------- MAYI: a Yokoid who went through the gate a long time ago. An android. ----------------
HEROES.mayi = { name: 'MAYI', port: 'MAYI', cmd: 'HELP', str: 13, mag: 6, spd: 13, vit: 12, mdef: 10, hp: 56, mp: 10, weap: 'rod', title: 'THE ANDROID', android: 1 };
PORT.MAYI = PORT.YOKOID; VOICE.MAYI = [1900, 0];
(() => {
  const o = ART.npcO({ hairStyle: 'bob', skin: '#ffdbdb', skin2: '#dbb6b6', hair: '#926d49', hair2: '#6d4924', top: '#b692db', top2: '#926db6', bot: '#dbb6ff', acc: '#24dbff', acc2: '#ffffff',
    head: (h, d) => { if (d !== 'u') { h.p(d === 'l' ? 4 : 5, 5, 12); h.p(d === 'l' ? 4 : 10, 5, 12); } h.r(d === 'l' ? 12 : 13, 7, 2, 2, 12); } });
  o.body = (g, d, p, by) => { if (d === 'd') { g.r(7, 13 + by, 3, 3, 12); g.p(8, 14 + by, 13); } };
  const mk = (d, p) => ART.chibi(o, d, p), POSES = ['stand', 'step1', 'step2'];
  const h = { P: o.P, d: POSES.map(p => mk('d', p)), u: POSES.map(p => mk('u', p)), l: POSES.map(p => mk('l', p)) };
  h.ready = h.l[0]; h.walkB = [h.l[1], h.l[2]]; for (const p of ['atk', 'cast', 'hurt', 'low']) h[p] = mk('l', p); h.win = mk('d', 'win'); h.ko = ART.rot90(mk('l', 'hurt'));
  ART.hero.mayi = h; ART.P.mayi = o.P;
})();
// androids don't catch colds: the usual statuses don't take, and crystals can't teach them
const _stats = stats;
stats = function (r) { const s = _stats(r); if (HEROES[r.id].android) s.block.push('lag', 'sleep', 'mute', 'scram', 'blind'); return s; };
const _giveAP = giveAP;
giveAP = function (r, ap) { return HEROES[r.id].android ? [] : _giveAP(r, ap); };
Object.assign(ITEMS, { chargepack: { name: 'CHARGE PACK', price: 400, desc: 'FULLY RECHARGES AN ANDROID. DOES NOTHING FOR PEOPLE.', charge: 1 } });
// MAYI's command: HELP. She holds a foe still ("MAY I HELP YOU?"), or tidies up an ally.
async function helpMenu(u) {
  const i = await bList([{ t: 'HOLD STILL' }, { t: 'TIDY UP' }], { x: 4, y: BWIN + 2, w: 120, rows: 2, help: k => ['MAY I HELP YOU? (THE FOE LOSES ITS NEXT TURN.)', 'CURES AN ALLY AND RESTORES A LITTLE HP.'][k] });
  if (i < 0) return null;
  const t = await pickTarget(u, i === 0 ? 'foe' : 'ally'); return t && { kind: 'help', mode: i, targets: t };
}
async function doHelp(u, a) {
  const t = a.targets[0]; u.pose = 'cast'; u.poseT = 24; await wait(8);
  if (a.mode === 0) { bmsg('MAY I HELP YOU?'); sfx('ok'); fx('status', t, 28); await wait(14); if (rnd(100) < (t.d && t.d.boss ? 35 : 85)) inflict(t, 'stun', 100); else pop(t, 'DECLINED', BCOL.miss); }
  else { bmsg('TIDYING UP.'); fx('heal', t, 28); await wait(14); applyEffect(u, t, { cure: ['lag', 'mute', 'sleep', 'scram', 'pause', 'buffer', 'blind'] }); const n = Math.round(t.mhp * .15); t.hp = Math.min(t.mhp, t.hp + n); pop(t, n, BCOL.heal); }
  await wait(20);
}

// ---------------- SKILLS: each hero's own moves, a few uses per rest (inns, sleeping bags) ----------------
const SKILLS = {
  yoko: [{ id: 'ofcourse', name: 'OF COURSE', lv: 1, uses: 3, tgt: 'ally', eff: { fullheal: 1 }, desc: 'FULLY RESTORES ONE ALLY.' }, { id: 'mayi2', name: 'MAY I?', lv: 15, uses: 2, tgt: 'allies', eff: { status: 'turbo', good: 1 }, desc: 'TURBO FOR THE WHOLE PARTY.' }, { id: 'pstart', name: 'PRESS START', lv: 30, uses: 1, tgt: 'all', eff: { sp: 150, pierce: 1 }, desc: 'EVERYTHING STARTS OVER. FOR THEM.' }],
  carl: [{ id: 'sand', name: 'POCKET SAND', lv: 1, uses: 3, tgt: 'all', eff: { status: 'blind', hit: 75 }, desc: 'NO SIGNAL FOR ALL FOES. HE ALWAYS HAS SAND.' }, { id: 'normal', name: 'NORMAL GUY', lv: 12, uses: 2, tgt: 'allies', eff: { status: 'armor', good: 1 }, desc: 'ARMOR UP FOR THE PARTY. NOTHING TO SEE HERE.' }, { id: 'chat', name: 'ASK CHAT', lv: 25, uses: 1, tgt: 'all', eff: { random: 1 }, desc: 'CHAT DECIDES. IT COULD BE ANYTHING.' }],
  face: [{ id: 'patent', name: 'PATENT', lv: 1, uses: 3, tgt: 'one', eff: { pow: 2.6, pierce: 1 }, desc: 'BIG DAMAGE TO ONE. HE OWNS THE IDEA OF HITTING.' }, { id: 'bcast', name: 'BROADCAST', lv: 14, uses: 2, tgt: 'all', eff: { sp: 70, elem: 'zap' }, desc: 'ZAP DAMAGE TO ALL FOES.' }, { id: 'grand', name: 'GRAND DESIGN', lv: 28, uses: 1, tgt: 'all', eff: { sp: 140, pierce: 1 }, desc: 'HUGE DAMAGE TO ALL FOES.' }],
  oldface: [{ id: 'solder', name: 'SOLDER', lv: 1, uses: 3, tgt: 'ally', eff: { sp: 50, heal: 1 }, desc: 'PATCHES ONE ALLY UP.' }, { id: 'hotwork', name: 'HOT WORK', lv: 12, uses: 2, tgt: 'all', eff: { sp: 72, elem: 'hot' }, desc: 'HOT DAMAGE TO ALL FOES.' }, { id: 'fourshade', name: 'FOUR SHADES', lv: 26, uses: 1, tgt: 'all', eff: { sp: 150, elem: 'legacy' }, desc: 'LEGACY DAMAGE TO ALL FOES.' }],
  linda: [{ id: 'audit', name: 'AUDIT', lv: 1, uses: 3, tgt: 'all', eff: { status: 'exposed', hit: 100 }, desc: 'EXPOSES ALL FOES: THE NEXT HIT ON EACH DOES 1.5X.' }, { id: 'buyout', name: 'BUYOUT', lv: 16, uses: 2, tgt: 'one', eff: { erase: 60 }, desc: 'ERASES ONE FOE (NOT BOSSES). IT\'S A GOOD OFFER.' }, { id: 'merger', name: 'MERGER', lv: 30, uses: 1, tgt: 'allies', eff: { fullheal: 1 }, desc: 'FULLY RESTORES THE PARTY.' }],
  ghost: [{ id: 'boo', name: 'BOO', lv: 1, uses: 3, tgt: 'one', eff: { status: 'scram', hit: 80 }, desc: 'SCRAMBLES ONE FOE.' }, { id: 'laugh', name: 'LAUGH TRACK', lv: 12, uses: 2, tgt: 'allies', eff: { status: 'regen', good: 1 }, desc: 'REGEN FOR THE PARTY.' }, { id: 'finale', name: 'SERIES FINALE', lv: 30, uses: 1, tgt: 'all', eff: { sp: 145 }, desc: 'HUGE DAMAGE TO ALL FOES. IT\'S NOT REALLY THE END.' }],
  garfield: [{ id: 'stakeout', name: 'STAKEOUT', lv: 1, uses: 3, tgt: 'one', eff: { status: 'exposed', hit: 100, self: 'armor' }, desc: 'EXPOSES ONE FOE AND ARMORS GARFIELD.' }, { id: 'lasagna', name: 'LASAGNA', lv: 14, uses: 2, tgt: 'allies', eff: { sp: 45, heal: 1 }, desc: 'HEALS THE PARTY. HE BROUGHT ENOUGH.' }, { id: 'fiasco2', name: 'FIASCO', lv: 28, uses: 1, tgt: 'one', eff: { pow: 6, pierce: 1 }, desc: 'ENORMOUS DAMAGE TO ONE FOE.' }],
  kid: [{ id: 'waithere', name: 'WAIT HERE', lv: 1, uses: 3, tgt: 'all', eff: { status: 'sleep', hit: 60 }, desc: 'EVERYONE WAITS. NOBODY KNOWS WHY.' }, { id: 'askwhy', name: 'ASK WHY', lv: 15, uses: 2, tgt: 'all', eff: { status: 'stun', hit: 70 }, desc: 'ALL FOES STOP TO THINK ABOUT IT.' }, { id: 'letgo', name: 'LET GO', lv: 30, uses: 1, tgt: 'allies', eff: { fullheal: 1, revive: 1 }, desc: 'REVIVES AND FULLY RESTORES EVERYONE. NOBODY GETS HURT.' }],
  pilotx: [{ id: 'strafe', name: 'STRAFE', lv: 1, uses: 3, tgt: 'all', eff: { pow: 1.1 }, desc: 'HITS ALL FOES.' }, { id: 'afterburn', name: 'AFTERBURN', lv: 14, uses: 2, tgt: 'all', eff: { sp: 72, elem: 'hot' }, desc: 'HOT DAMAGE TO ALL FOES.' }, { id: 'xmarks', name: 'X MARKS', lv: 28, uses: 1, tgt: 'one', eff: { pow: 6.5, pierce: 1 }, desc: 'ENORMOUS DAMAGE TO ONE FOE.' }],
  mayi: [{ id: 'recharge', name: 'RECHARGE', lv: 1, uses: 2, tgt: 'ally', eff: { mp: 999 }, desc: 'RESTORES ONE ALLY\'S MP. SHE HAS A PORT FOR IT.' }, { id: 'service', name: 'FULL SERVICE', lv: 20, uses: 1, tgt: 'allies', eff: { sp: 60, heal: 1, cure: 1 }, desc: 'HEALS AND CURES THE PARTY.' }],
  human: [{ id: 'tested', name: 'TESTED WELL', lv: 1, uses: 3, tgt: 'all', eff: { borrow: 1 }, desc: 'USES SOMEONE ELSE\'S SKILL. WHATEVER TESTED WELL.' }],
};
const heroSkills = r => (SKILLS[r.id] || []).filter(k => k.lv <= r.lv);
const usesLeft = (r, k) => { r.su = r.su || {}; return r.su[k.id] === undefined ? k.uses : r.su[k.id]; };
function resetSkills(r) { r.su = {}; }
const _rest = restParty;
restParty = async function (msg) { for (const r of Object.values(G.roster)) resetSkills(r); return _rest(msg); };
async function skillMenu(u) {
  const L = heroSkills(u.r);
  const i = await bList(L.map(k => ({ t: k.name, r: usesLeft(u.r, k) + '/' + k.uses, dim: usesLeft(u.r, k) <= 0 })), { x: 4, y: BWIN + 2, w: 200, rows: 5, help: j => L[j].desc + ' (USES COME BACK WHEN YOU REST.)', dimMsg: 'NO USES LEFT. REST TO GET THEM BACK.' });
  if (i < 0) return null;
  const k = L[i], ally = k.tgt === 'ally' || k.tgt === 'allies';
  const t = k.tgt === 'all' ? allFoes() : k.tgt === 'allies' ? B.party.filter(p => !p.gone && (p.hp > 0 || k.eff.revive)) : await pickTarget(u, ally ? 'ally' : 'foe', { dead: !!k.eff.revive });
  return t && { kind: 'skill', skill: k.id, targets: t };
}
async function doSkill(u, a) {
  let k = (SKILLS[u.id] || []).find(x => x.id === a.skill); if (!k) return;
  u.r.su = u.r.su || {}; if (usesLeft(u.r, k) <= 0) { bmsg('NO USES LEFT.'); return; } u.r.su[k.id] = usesLeft(u.r, k) - 1;
  let T = a.targets;
  if (k.eff.borrow) { const all = [].concat(...Object.keys(SKILLS).filter(h => h !== 'human').map(h => SKILLS[h])).filter(x => x.lv <= u.lv && !x.eff.borrow); k = pickOne(all); T = k.tgt === 'all' ? foesAlive() : k.tgt === 'allies' ? partyAlive() : k.tgt === 'ally' ? [pickOne(partyAlive())] : [pickOne(foesAlive())]; bmsg('TESTED WELL: ' + k.name); await wait(30); }
  bmsg(k.name); u.pose = k.eff.pow ? 'atk' : 'cast'; u.poseT = 30; sfx('object'); post.flash = .25; await wait(6); post.flash = 0; await wait(10);
  if (k.eff.random) { const r = rnd(3); bmsg(['CHAT SAYS: HIT EVERYTHING.', 'CHAT SAYS: EVERYONE TAKE A BREAK.', 'CHAT SAYS: CONFUSE THEM.'][r], 100); await wait(20);
    if (r === 0) for (const t of foesAlive()) { fx('boom', t, 26); applyEffect(u, t, { sp: 120, magic: 1, pierce: 1 }); }
    if (r === 1) for (const t of partyAlive()) { t.hp = Math.min(t.mhp, t.hp + Math.floor(t.mhp / 2)); pop(t, 'BETTER', BCOL.heal); }
    if (r === 2) for (const t of foesAlive()) inflict(t, 'scram', 90);
    await wait(24); return; }
  for (const t of T) {
    if (!t || (t.hp <= 0 && !k.eff.revive)) continue;
    const e = k.eff;
    fx(e.elem || (e.heal || e.fullheal || e.mp ? 'heal' : e.status ? 'status' : 'boom'), t, 26); await wait(4);
    if (e.revive && t.hp <= 0) applyEffect(u, t, { revive: 1 });
    if (e.fullheal) { const n = t.mhp - t.hp; t.hp = t.mhp; pop(t, n, BCOL.heal); continue; }
    if (e.mp) { const n = t.mmp - t.mp; t.mp = t.mmp; pop(t, n, BCOL.mp); continue; }
    if (e.cure) applyEffect(u, t, { cure: ['lag', 'mute', 'sleep', 'scram', 'pause', 'buffer', 'blind'] });
    if (e.erase) { applyEffect(u, t, { erase: e.erase }); continue; }
    if (e.status && !e.sp && !e.pow) { inflict(t, e.status, e.hit === undefined ? 100 : e.hit, e.good); continue; }
    applyEffect(u, t, { pow: e.pow, sp: e.sp, magic: !!e.sp, elem: e.elem, heal: e.heal, pierce: e.pierce, status: e.status, hit: e.hit });
  }
  if (k.eff.self) inflict(u, k.eff.self, 100, 1);
  await wait(24);
}

// ---------------- THE DESERT BUS: a land vehicle with its own guns (well, a horn) ----------------
const BUSW = [
  { name: 'RAM', desc: 'THE BUS HITS ONE FOE. HARD.', pow: 2.4, pierce: 1, tgt: 'one' },
  { name: 'HORN', desc: 'A VERY LONG HORN. FOES MAY FORGET THEIR TURN.', status: 'stun', hit: 55, tgt: 'all' },
  { name: 'HIGH BEAMS', desc: 'NO SIGNAL FOR ALL FOES.', status: 'blind', hit: 75, tgt: 'all' },
  { name: 'EXHAUST', desc: 'HOT DAMAGE TO ALL FOES.', sp: 42, elem: 'hot', tgt: 'all' },
  { name: 'TUNE-UP', desc: 'EVERYONE ON THE BUS FEELS BETTER.', sp: 30, heal: 1, tgt: 'allies' },
];
async function busMenu(u) {
  const i = await bList(BUSW.map(w => ({ t: w.name })), { x: 4, y: BWIN + 2, w: 120, rows: 5, title: u.name + ' DRIVES', help: k => BUSW[k].desc }); if (i < 0) return null;
  const w = BUSW[i], t = w.tgt === 'all' ? allFoes() : w.tgt === 'allies' ? partyAlive() : await pickTarget(u, 'foe');
  return t && { kind: 'busw', w: i, targets: t };
}
async function doBusWeapon(u, a) {
  const w = BUSW[a.w]; bmsg(u.name + ': ' + w.name); B.busKick = 10; sfx(w.name === 'HORN' ? 'object' : 'power'); await wait(12);
  for (const t of a.targets) { if (t.hp <= 0) continue; fx(w.elem || (w.heal ? 'heal' : w.status ? 'status' : 'boom'), t, 26); await wait(4);
    if (w.status && !w.sp && !w.pow) { if (!(t.d && t.d.boss && w.status === 'stun')) inflict(t, w.status, w.hit); else pop(t, 'UNMOVED', BCOL.miss); continue; }
    applyEffect(u, t, { pow: w.pow, sp: w.sp, magic: !!w.sp, elem: w.elem, heal: w.heal, pierce: w.pierce }); }
  await wait(20);
}
function drawBattleBus() {
  const k = B.busKick > 0 ? (B.busKick--, -4) : 0, hurt = B.party.some(p => p.flash > 0);
  drawScaled(BUS_S, 200 + k + (hurt ? rnd(3) - 1 : 0), 52 + Math.sin(frame * .3) * 1, BUS_P, 4);
  B.party.forEach((u, i) => { const h = heroArt(u); if (h && u.hp > 0) draw(h.d[0], 216 + i * 18, 58, h.P); });
  for (let x = -(frame * 6) % 30; x < W; x += 30) rectF(x, 140, 14, 2, hex('#ffdb49'));
}
foe('larva', 'SANDWORM LARVA', 9, LK('snake', {}, ['#dbb66d', '#924924', '#242424', '#ff2424']), { weak: ['cold'], steal: 'snack', moves: [[2, 'fight'], [1, MV('BURROW', { status: 'buffer', hit: 50 })]] });
foe('roadhazard', 'ROAD HAZARD', 10, LK('plant', { tumble: 1 }, ['#ff9224', '#ffffff', '#000000', '#242424']), { weak: ['hot'], steal: 'battery', moves: [[2, 'fight'], [1, MV('FLAT TIRE', { pow: 1.4 })]] });
AREA.BUS = [['larva', 'larva'], ['roadhazard', 'roadhazard', 'roadhazard'], ['landshark', 'larva'], ['roadhazard', 'cactus']];
AREA.BUS.forEach((ids, i) => form('BUS' + i, ids));
// the depot and the buried station (only the bus crosses the quicksand)
MAPS.depot = { name: 'THE DESERT BUS DEPOT', theme: 'sand', music: 'bus',
  rows: (() => { const b = MB(16, 11, '.'); b.frame(0, 0, 16, 11, '^'); b.house(3, 1, 10, 3, 8); b.rect(2, 5, 12, 3, ':'); b.put(7, 10, ':').put(8, 10, ':'); b.put(3, 8, 'o').put(12, 8, 't'); return b.rows(); })(),
  exits: [{ x: 7, y: 10, w: 2, to: 'world', wx: 38, wy: 32 }],
  npcs: () => [T2('miner', 8, 5, { dir: 'd', talk: () => busDriver() }), T2(null, 4, 6, { solid: true, draw: (n, x, y) => drawBus(x - 4, y - 2, 'r') })] };
PLACES.depot = { x: 38, y: 32, icon: 'station', name: 'THE BUS DEPOT', to: ['depot', 7, 9, 'u'], if: () => G.world === 1 };
async function busDriver() {
  FIELD_LOCK++;
  try {
    if (flag('busOwned')) { await say('THE BUS IS WHEREVER YOU LEFT IT. IT ALWAYS IS. THAT\'S THE ONE THING YOU CAN SAY FOR A BUS.', 'THE DRIVER'); return; }
    await say('THE DESERT BUS. EIGHT HOURS TO ANYWHERE. NO STOPS. IT CROSSES THE QUICKSAND, IF YOU\'RE BRAVE. IT HAS A HORN, IF YOU\'RE NOT.', 'THE DRIVER');
    await say('I\'VE DRIVEN IT FOR THIRTY YEARS. I\'D LIKE TO SIT DOWN SOMEWHERE THAT ISN\'T MOVING. TAKE IT. BRING IT BACK OR DON\'T.', 'THE DRIVER');
    setFlag('busOwned'); G.bus = { x: 38, y: 33, w: 1 }; sfx('get');
    await say('GOT THE DESERT BUS. WALK ONTO IT TO DRIVE. B GETS OFF. IN THE BUS, YOU FIGHT WITH THE BUS. OUT IN THE QUICKSAND, SOMETHING IS BURIED.', null);
  } finally { FIELD_LOCK--; }
}
MAPS.buried = { name: 'THE BURIED STATION', theme: 'train', music: 'dungeon2', dungeon: 1, dark: 90,
  rows: ['########################', '#^^^..^^^^#....^^^..^^^#', '#^.......^#...........^#', '#....::::::::::::.....^#', '#^...:..........:...^^^#', '#^^..:..o....o..:.....^#', '#....:..........::::::.#', '#^...:..........:....:.#', '#^^..::::::;;::::....:.#', '#......................#', '##########DD############'],
  exits: [{ x: 10, y: 10, w: 2, to: 'world', wx: 56, wy: 36 }],
  steps: { '22,9': () => sandwormFight() }, chests: [[1, 9, 'feast', 1], [22, 2, 'turbobutton']],
  enc: { forms: forms('B'), bg: 'mine' }, enter: async () => { if (!flag('wormDone')) obj('SOMETHING IS MOVING UNDER THE FAR END OF THE PLATFORM.', 'buried', 22, 9); } };
PLACES.buried = { x: 56, y: 36, icon: 'station', name: 'THE BURIED STATION', to: ['buried', 10, 9, 'u'], if: () => G.world === 1 };
async function sandwormFight() {
  if (flag('wormDone')) return; FIELD_LOCK++;
  try {
    await say('THE PLATFORM BUCKLES. SOMETHING ENORMOUS WAS USING THE STATION AS A BURROW. IT HAS BEEN WAITING FOR A BUS FOR A VERY LONG TIME.', null);
    if (await battle('sandworm') === 'lose') return gameOver(); await fadeIn(.1);
    setFlag('wormDone'); G.crystals.push('driver'); sfx('get');
    await say('UNDER THE RUBBLE, A SAVE CRYSTAL HUMS LIKE AN ENGINE IDLING: THE DRIVER. "EIGHT HOURS, NO STOPS."', null);
  } finally { FIELD_LOCK--; }
}
const wormDraw = g => { for (let i = 0; i < 9; i++) g.e(14 + i * 9, 54 - Math.sin(i * .7) * 16, 11 - i * .4, 11 - i * .4, i & 1 ? 2 : 6); g.e(92, 30, 18, 16, 2); g.e(98, 34, 10, 9, 13); for (let a = 0; a < 6.2; a += .5) g.p(98 + Math.cos(a) * 9, 34 + Math.sin(a) * 8, 12); g.e(88, 22, 3, 3, 11); };
foe('sandworm', 'THE SANDWORM', 18, { kit: 'worm', draw: wormDraw, size: [112, 76], c: ['#dbb66d', '#926d49', '#ffffff', '#ff2424'] }, { boss: 1, hp: 9, atk: 1.2, xp: 8, ap: 18, weak: ['cold'], steal: 'feast',
  ai: u => pickOne([{ kind: 'fight' }, MV('SWALLOW', { pow: 2.4 }), MV('SANDSTORM', { sp: 34, tgt: 'all', split: 1, status: 'blind', hit: 30 }), MV('BURROW', { run: async () => { u.hiddenFoe = 1; bmsg('IT DISAPPEARED INTO THE SAND.'); await wait(60); u.hiddenFoe = 0; bmsg('IT CAME BACK UP.'); } })]) });
form('sandworm', ['sandworm'], { at: [['sandworm', 30, 30]], bg: 'desert', boss: 1, noRun: 1 });
CRYSTALS.driver = { name: 'THE DRIVER', desc: 'EIGHT HOURS, NO STOPS.', spells: [['turbo', 5], ['float', 6], ['zapper', 3]], bonus: 'spd', summon: { name: 'EXPRESS ROUTE', buff: 'turbo' } };

// ---------------- THE MEMORY CARD: the spirits' planet ----------------
const OW_P0 = OW_P.slice(), OW_COL0 = Object.assign({}, OW_COL);
const OW_P3 = pal('#100024', '#2a1a5a', '#24b6a0', '#1a8f7a', '#6d1a8f', '#6d6db6', '#36246d', '#b6a0db', '#ffdbff', '#dbb6ff', '#49496d', '#9292db', '#24123a', '#ff92ff', '#ffdb49', '#000000');
const OW_COL3 = { '~': '#100024', '-': '#2a1a5a', '.': '#24b6a0', ',': '#24b6a0', '"': '#6d1a8f', '^': '#36246d', n: '#1a8f7a', s: '#b6a0db', '*': '#ffdbff', '%': '#6d1a8f', ':': '#9292db', '=': '#6d6db6', '?': '#000000', q: '#dbb66d' };
function owPalette() { const P = G.world === 3 ? OW_P3 : OW_P0; for (let i = 0; i < P.length; i++) OW_P[i] = P[i]; const C = G.world === 3 ? OW_COL3 : OW_COL0; for (const k in C) OW_COL[k] = C[k]; }
OW_TILES.q = [0, 1].map(f => TS16(g => { g.r(0, 0, 16, 16, 8); for (let i = 0; i < 4; i++) { const r = 2 + ((i * 3 + f * 2) % 7); for (let a = 0; a < 6.3; a += .6) g.p(8 + Math.cos(a) * r, 8 + Math.sin(a) * r * .6, 6); } g.e(8, 8, 1.5, 1, 7); }));
function buildPlanet() {
  const g = Array.from({ length: WH }, () => Array(WW).fill('~'));
  const nz = (x, y, s) => swh(x >> 2, y >> 2, s) * .5 + swh(x, y, s + 1) * .25;
  const blobP = (cx, cy, rx, ry, t, s, keep) => { for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) { const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (d < 1 - .35 + nz(x, y, s) * .7 && (!keep || g[y][x] !== '~')) g[y][x] = t; } };
  blobP(64, 56, 34, 24, '.', 301); blobP(64, 40, 18, 7, '*', 302, 1); blobP(48, 66, 9, 6, '"', 303, 1); blobP(80, 64, 10, 7, 's', 304, 1); blobP(70, 52, 5, 4, '"', 305, 1); blobP(56, 48, 4, 3, '%', 306, 1);
  for (let x = 72; x < 86; x++) for (let y = 44; y < 52; y++) if (g[y][x] !== '~' && (x === 72 || y === 44 || x === 85 || y === 51) && !(x === 78 && y === 51)) g[y][x] = '^';
  for (let y = 1; y < WH - 1; y++) for (let x = 1; x < WW - 1; x++) if (g[y][x] === '~' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !'~-'.includes(g[y + dy][x + dx]))) g[y][x] = '-';
  for (const p of [[50, 62], [60, 52], [78, 48]]) g[p[1]][p[0]] = '.';
  g[52][78] = '.'; g[51][78] = '.';
  return g;
}
// planet places (and keep the home-world places off the planet)
for (const k in PLACES) { const p = PLACES[k], f = p.if; p.if = () => G.world !== 3 && (!f || f()); }
Object.assign(PLACES, {
  landing: { x: 50, y: 62, icon: 'crater', name: 'THE GATE HOME', to: null, run: () => planetLanding(), if: () => G.world === 3 },
  memoria: { x: 60, y: 52, icon: 'town', name: 'MEMORIA', to: ['memoria', 11, 17, 'u'], if: () => G.world === 3 },
  archive: { x: 78, y: 48, icon: 'tower', name: 'THE ARCHIVE', to: ['archive1', 10, 13, 'u'], if: () => G.world === 3 },
});
foe('orphan', 'ORPHAN DATA', 24, LK('glitch', {}, ['#b692db', '#24dbff', '#ffffff', '#ffffff']), { weak: ['legacy'], steal: 'coffee', moves: [[2, 'fight'], [1, MV('LOOKING FOR PARENT', { status: 'scram', hit: 40 })]] });
foe('checksum', 'CHECKSUM', 24, LK('floater', {}, ['#24b6a0', '#ffdbff', '#ffffff', '#ffffff']), { mdef: 1.4, steal: 'chargepack', moves: [[1, 'fight'], [2, MV('MISMATCH', { sp: 40, elem: 'zap' })]] });
foe('savemite', 'SAVE MITE', 25, LK('bug', { mean: 1 }, ['#6d1a8f', '#ffdb49', '#242424', '#ffdb49']), { spd: 1.4, steal: 'antivirus', moves: [[2, 'fight'], [1, MV('NIBBLE THE FILE', { pow: 1, drain: 1 })]] });
foe('dupe', 'DUPLICATE', 25, LK('spook', {}, ['#ffdbff', '#9292db', '#ffffff', '#242424']), { undead: 1, weak: ['hot'], steal: 'espresso', moves: [[1, 'fight'], [1, MV('COPY OF A COPY', { run: async (u) => { if (B.foes.filter(f => f.hp > 0).length >= 5) { bmsg('THE COPY CAME OUT BLANK.'); return; } B.foes.push(mkFoeUnit('dupe', 20 + rnd(60), 20 + rnd(80))); bmsg('IT DUPLICATED.'); } })]] });
foe('nullf', 'NULL', 26, LK('blob', {}, ['#24123a', '#ffffff', '#000000', '#ffffff']), { hp: 1.3, steal: 'patch', moves: [[2, 'fight'], [1, MV('NOTHING', { erase: 12 })]] });
AREA.P = [['orphan', 'orphan'], ['checksum', 'savemite'], ['dupe'], ['nullf', 'orphan'], ['savemite', 'savemite', 'checksum']];
AREA.P.forEach((ids, i) => form('P' + i, ids));
const WZONES3 = [{ r: [0, 0, 127, 111], forms: forms('P'), bg: 'spirit' }];
// MEMORIA: the town of the save spirits
const spiritNpc = (x, y, k, lines, o) => T2(null, x, y, Object.assign({ draw: (n, xx, yy) => drawGhostNpc(xx, yy, k), talk: talkS('A SAVE SPIRIT', ...lines) }, o || {}));
MAPS.memoria = { name: 'MEMORIA', theme: 'spirit', music: 'memoria', color: 1,
  rows: (() => { const b = MB(24, 20, ','); b.frame(0, 0, 24, 20, '~'); b.rect(11, 3, 2, 17, ':'); b.rect(3, 10, 18, 1, ':'); b.house(8, 1, 8, 3, 11).put(12, 3, 'D');
    b.house(2, 5, 6, 3, 4).house(16, 5, 6, 3, 18).house(2, 13, 6, 3, 4).house(16, 13, 6, 3, 18); for (const [x, y] of [[9, 7], [14, 7], [9, 13], [14, 13]]) b.put(x, y, '*'); b.put(11, 19, ':').put(12, 19, ':'); return b.rows(); })(),
  exits: [{ x: 11, y: 19, w: 2, to: 'world', wx: 60, wy: 52 }, { x: 11, y: 3, w: 2, to: 'elderhall', tx: 6, ty: 7, dir: 'u' }, { x: 4, y: 7, to: 'minn', tx: 4, ty: 7, dir: 'u' }, { x: 18, y: 7, to: 'mshop', tx: 4, ty: 7, dir: 'u' }],
  npcs: () => [
    spiritNpc(6, 11, 0, ['WE\'RE SAVES. OLD ONES. THE GAMES THAT MADE US ARE GONE. WE KEPT GOING ANYWAY. THAT\'S WHAT A SAVE DOES.']),
    spiritNpc(17, 11, 1, ['THE ARCHIVE IS WHERE WE KEEP OUR RECORDS. SOMETHING IS IN THERE, COLLECTING. IT TAKES WHATEVER NOBODY IS POINTING AT.']),
    spiritNpc(7, 16, 2, ['YOUR WORLD IS SO LOUD. OURS IS JUST... LOADING. FOREVER. IT\'S PEACEFUL. IT\'S A LITTLE BORING.']),
    T2('mayi', 13, 15, { id: 'mayiNpc', if: () => !flag('mayiJoined'), talk: () => mayiJoins() }),
  ],
  enter: async () => { if (!flag('memoriaIn')) await memoriaArrive(); },
};
MAPS.elderhall = INT(['############', '#~~~~~~~~~~#', '#~........~#', '#~..;;;;..~#', '#~..;;;;..~#', '#~........~#', '#~........~#', '#~........~#', '######D#####'], { name: 'THE ELDER\'S HALL', theme: 'spirit', music: 'memory', color: 1,
  exits: [{ x: 6, y: 8, to: 'memoria', tx: 11, ty: 4, dir: 'd' }],
  npcs: () => [T2(null, 6, 3, { solid: true, draw: (n, x, y) => drawFirstSave(x, y + 2), talk: () => elderTalk() })] });
MAPS.minn = INT(['########', '#b.b.b.#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'THE QUIET ROOM', theme: 'spirit', music: 'memoria', color: 1, saves: [[1, 5]],
  exits: [{ x: 4, y: 7, to: 'memoria', tx: 4, ty: 8, dir: 'd' }], npcs: () => [spiritNpc(3, 2, 3, [], { talk: () => inn(100, 'A SAVE SPIRIT') })] });
MAPS.mshop = INT(['########', '#BBBBBB#', '#......#', '#.____.#', '#......#', '#......#', '#......#', '####D###'], { name: 'THE EXCHANGE', theme: 'spirit', music: 'memoria', color: 1,
  exits: [{ x: 4, y: 7, to: 'memoria', tx: 18, ty: 8, dir: 'd' }], npcs: () => [spiritNpc(3, 2, 1, [], { talk: () => shop('THE EXCHANGE', ['chargepack', 'meal', 'feast', 'coffee', 'espresso', 'extralife', 'patch', 'tent', 'rod4', 'dart4', 'armor4', 'helm4', 'focuslens', 'strap'], 'A SAVE SPIRIT') })] });
// THE ARCHIVE: the spirits' library, being collected
const ARC = (rows, o) => Object.assign({ theme: 'spirit', music: 'archive', dungeon: 1, color: 1, rows, enc: { forms: forms('P'), bg: 'spirit' } }, o);
MAPS.archive1 = ARC(['######################', '#B.B.B.B.#..#.B.B.B.B#', '#........#..#........#', '#..####..#..#..####..#', '#..#..#.........#..#.#', '#..####..::::...####.#', '#........:..:........#', '###..#####..#####..###', '#........:..:........#', '#.B.B.B..::::..B.B.B.#', '#....................#', '#..o..............o..#', '#....................#', '#.........;;.........#', '##########DD##########'], { name: 'THE ARCHIVE',
  exits: [{ x: 10, y: 14, w: 2, to: 'world', wx: 78, wy: 48 }, { x: 10, y: 1, w: 2, to: 'archive2', tx: 10, ty: 12, dir: 'u' }], chests: [[2, 11, 'chargepack', 2], [19, 11, 'espresso', 1]],
  enter: async () => { if (!flag('collectorDone')) obj('THE ARCHIVE GOES UP. SOMETHING IS COLLECTING AT THE TOP.', 'archive2', 10, 2); } });
MAPS.archive2 = ARC(['######################', '#~~~~~~~~~..~~~~~~~~~#', '#~........;;........~#', '#~..B..B......B..B..~#', '#~..................~#', '#~..::::::::::::::..~#', '#~..:............:..~#', '#~..:..o......o..:..~#', '#~..:............:..~#', '#~..::::::..::::::..~#', '#~..................~#', '#~........;;........~#', '#~.........:........~#', '##########DD##########'], { name: 'THE ARCHIVE: STACKS',
  exits: [{ x: 10, y: 13, w: 2, to: 'archive1', tx: 10, ty: 2, dir: 'd' }],
  steps: { '10,2': () => collectorFight(), '11,2': () => collectorFight() }, chests: [[7, 7, 'feast', 1], [14, 7, 'robe2']] });
// the story on the planet
async function gateDoor() {
  if (flag('planetDone')) { const c = await ask('THE GATE TO THE MEMORY CARD IS OPEN. GO THROUGH?', null, ['GO THROUGH', 'NOT NOW']); if (c === 0) await toPlanet(); return; }
  if (flag('gateOpen')) { await toPlanet(); return; }
  FIELD_LOCK++;
  try {
    partyWith('yoko');
    await Y('...HELLO. IT\'S ME. YOU DON\'T KNOW ME. I\'M HALF OF YOU, I THINK.');
    await Y('PRESS START.');
    for (let i = 0; i < 5; i++) { post.flash = .7; sfx('power'); post.shake = 3; await wait(10); post.flash = 0; await wait(6); } post.shake = 0;
    setFlag('gateOpen');
    await say('THE GATE OPENS. BEHIND IT ISN\'T A ROOM. IT\'S A SKY. AND UNDER THE SKY, A WHOLE WORLD, LAVENDER AND QUIET, LIKE A SAVE SCREEN LEFT ON OVERNIGHT.', null);
    await GH('...THAT\'S A PLANET. THE MEMORY CARD IS A PLANET. NOBODY TELLS YOU THAT IN SCHOOL.');
    await LI('THEN WE GO TO THE PLANET.');
  } finally { FIELD_LOCK--; }
  await toPlanet();
}
async function toPlanet() {
  G.world = 3; WORLD.made = 0; WORLD.mini = null; G.vehicle = null;
  await toWorld(50, 63);
  if (!flag('memoriaIn')) obj('THERE\'S A TOWN JUST NORTHEAST OF THE GATE: MEMORIA.', null, 60, 52);
}
async function planetLanding() {
  if (!flag('planetDone')) { await say('THE GATE HOME. THE SPIRITS AREN\'T READY TO COME YET.', null); return; }
  G.world = 1; WORLD.made = 0; WORLD.mini = null;
  await leaveWorld('gate', 9, 10, 'd');
  if (!flag('spiritsHome')) await spiritsComeHome();
}
async function memoriaArrive() {
  setFlag('memoriaIn'); FIELD_LOCK++;
  try {
    await say('MEMORIA. THE BUILDINGS ARE MADE OF OLD MENUS. THE STREETLIGHTS BLINK LIKE CURSORS. THE PEOPLE ARE SAVE SPIRITS, AND THEY ARE ALL VERY POLITE.', null);
    await Y('...I FEEL LIKE I\'VE BEEN HERE. I HAVEN\'T. PART OF ME HAS.');
    obj('A YOKOID IS STANDING IN THE SQUARE, WAITING TO BE ASKED SOMETHING.', 'memoria', 13, 15);
  } finally { FIELD_LOCK--; }
}
async function mayiJoins() {
  FIELD_LOCK++;
  try {
    await say('MAY I HELP YOU?', 'MAYI');
    await Y('...YOU\'RE A YOKOID. WHAT ARE YOU DOING ON THE MEMORY CARD?');
    await say('I WAS SENT TO HELP. NOBODY SAID WHO. I WALKED THROUGH THE GATE A LONG TIME AGO, BEFORE IT CLOSED. SO I HELPED HERE.', 'MAYI');
    await say('THE SPIRITS DON\'T NEED MUCH HELP. THEY MOSTLY NEED SOMEONE TO REMEMBER THEM. I HAVE A LOT OF MEMORY. I\'M AN ANDROID.', 'MAYI');
    await C('YOU\'RE A ROBOT.');
    await say('ANDROID. A ROBOT DOES WHAT IT\'S TOLD. I DO WHAT I\'M ASKED. IT\'S A SMALL DIFFERENCE. IT\'S THE WHOLE DIFFERENCE.', 'MAYI');
    await Y('...WOULD YOU LIKE TO COME WITH US? YOU DON\'T HAVE TO SAY YES.');
    await say('...NOBODY HAS EVER ASKED ME THAT. YES. I\'D LIKE TO. I THINK THAT\'S THE FIRST THING I\'VE EVER LIKED.', 'MAYI');
    setFlag('mayiJoined'); await join('mayi', Math.max(22, hero('yoko').lv - 1), { w: 'rod4', a: 'armor4', h: 'helm4' });
    await say('(MAYI IS AN ANDROID. HEALING MAGIC ONLY HALF WORKS ON HER, BUT A CHARGE PACK RESTORES HER COMPLETELY, AND MOST STATUS EFFECTS DON\'T TAKE.)', null);
    obj('THE ELDER OF THE SPIRITS LIVES IN THE HALL AT THE TOP OF MEMORIA.', 'elderhall', 6, 3);
  } finally { FIELD_LOCK--; }
}
async function elderTalk() {
  const E = s => say(s, 'THE ELDER SAVE');
  FIELD_LOCK++;
  try {
    if (flag('planetDone')) { await E('GO HOME. WE\'LL FOLLOW. WE REMEMBER THE WAY, AND WE REMEMBER WHO MADE US LEAVE.'); return; }
    if (flag('collectorDone')) {
      await E('THE ARCHIVE IS QUIET. OUR RECORDS ARE SAFE. YOU POINTED AT THEM, SO THEY STAYED. THAT\'S ALL IT EVER TAKES.');
      await E('WE WILL COME HOME WITH YOU. ALL OF US. BUT YOU SHOULD KNOW: WE REMEMBER HOW WE WERE TREATED. EVERY TUBE. EVERY READ.');
      await Y('...WE KNOW.');
      setFlag('planetDone'); obj('GO BACK THROUGH THE GATE HOME (SOUTHWEST OF MEMORIA). THE SPIRITS WILL FOLLOW.', null, 50, 62); return;
    }
    await E('A VISITOR WITH HALF A SPIRIT IN HER. HELLO, ASSISTANT. WE FELT YOU OPEN THE GATE. IT TICKLED.');
    await E('YOU WANT US TO COME HOME. WE WANT TO. BUT WE CAN\'T LEAVE OUR RECORDS BEHIND, AND THE ARCHIVE IS BEING COLLECTED.');
    await E('SOMETHING CALLED THE GARBAGE COLLECTOR. IT TAKES WHATEVER NOBODY IS POINTING AT ANYMORE. IT\'S ALMOST REACHED THE OLDEST STACKS.');
    await LI('THEN WE\'LL GO AND POINT AT THEM.');
    obj('THE ARCHIVE IS NORTHEAST OF MEMORIA, INSIDE A RING OF MOUNTAINS. THE WAY IN IS ON THE SOUTH SIDE.', null, 78, 48);
  } finally { FIELD_LOCK--; }
}
async function collectorFight() {
  if (flag('collectorDone')) return; FIELD_LOCK++;
  try {
    await say('A MACHINE THE SIZE OF A HOUSE IS EATING SHELVES. IT PICKS THEM UP, CHECKS WHETHER ANYONE IS LOOKING, AND SWALLOWS THEM.', null);
    await say('UNREFERENCED. UNREFERENCED. UNREFERENCED. ...REFERENCED? YOU ARE LOOKING AT THINGS. STOP LOOKING AT THINGS.', 'THE GARBAGE COLLECTOR');
    if (await battle('collector') === 'lose') return gameOver(); await fadeIn(.1);
    setFlag('collectorDone');
    await say('THE COLLECTOR STOPS. THE STACKS STAY. SOMEWHERE A SPIRIT SAYS "OH, THERE IT IS."', null);
    obj('TELL THE ELDER. THE HALL IS AT THE TOP OF MEMORIA.', 'elderhall', 6, 3);
  } finally { FIELD_LOCK--; }
}
const collectorDraw = g => { g.r(8, 30, 84, 44, 2); g.r(8, 30, 84, 6, 4); g.r(16, 40, 30, 24, 13); g.r(18, 42, 26, 20, 9); for (let x = 54; x < 88; x += 8) g.r(x, 40, 4, 22, 15); for (let x = 14; x < 92; x += 16) { g.e(x, 76, 7, 7, 13); g.e(x, 76, 3, 3, 14); } g.line(70, 30, 90, 6, 15); g.line(90, 6, 104, 14, 15); g.r(98, 12, 10, 4, 6); g.r(98, 18, 10, 4, 6); g.e(30, 52, 4, 4, 11); };
foe('collector', 'THE GARBAGE COLLECTOR', 27, { kit: 'collector', draw: collectorDraw, size: [110, 86], c: ['#6d6db6', '#ff92ff', '#24123a', '#ffdb49'] }, { boss: 1, hp: 8, atk: 1.15, xp: 7, ap: 20, weak: ['zap'], steal: 'espresso', extra: { color: 1 },
  ai: u => { u.v.t = (u.v.t || 0) + 1; if (u.v.t % 4 === 0) return MV('MARK AND SWEEP', { sp: 52, tgt: 'all', split: 1 }); return pickOne([MV('COLLECT', { erase: 15 }), MV('COMPACT', { pow: 2.3 }), MV('UNREFERENCED', { status: 'pause', hit: 30 }), { kind: 'fight' }]); } });
form('collector', ['collector'], { at: [['collector', 30, 30]], bg: 'spirit', boss: 1, noRun: 1 });
// home again: the spirits follow, and the Franchise finds out
async function spiritsComeHome() {
  setFlag('spiritsHome'); FIELD_LOCK++;
  try {
    await panels([{ text: 'THE SAVE SPIRITS CAME THROUGH THE GATE BEHIND THE PARTY. ALL OF THEM. THE SKY OVER THE MOUNTAINS FILLED WITH LIGHT.', bg: '#dbdbff', art: (x, y, w, h) => { for (let i = 0; i < 30; i++) circF(x + 10 + (i * 37) % (w - 20), y + 30 + (i * 23) % (h - 40), 3 + (i % 4), [hex('#92dbff'), hex('#ffdb49'), hex('#ff92db')][i % 3]); } },
      { text: 'THEY REMEMBERED EVERYTHING. THEY FLEW STRAIGHT TO FRANCHISE CITY.', bg: '#ffdbdb' }, { text: 'BY MORNING, HALF THE CITY WAS UNLICENSED.', bg: '#ffffdb', sfx: 'BOOM' },
      { port: 'THE FRANCHISOR', text: 'ENOUGH. COME TO THE PALACE. LET US HAVE DINNER, AND TALK, LIKE PEOPLE WHO OWN THINGS.', bg: '#dbdbdb' }]);
    setFlag('dinnerInvite'); obj('THE FRANCHISOR HAS INVITED THE PARTY TO DINNER. THE PALACE IS THROUGH FRANCHISE CITY\'S NORTH GATE.', 'palace', 9, 2);
  } finally { FIELD_LOCK--; }
}
// MAYI goes where Yoko goes, in the corrupted save too
const _yv = yokoVillage;
yokoVillage = async function () { await _yv(); if (flag('yokoBack') && G.roster.mayi && G.flags.away_mayi) { bringBack('mayi', hero('yoko').lv); await say('MAY I COME TOO? ...I\'M ASKING. NOT OFFERING. I\'M ASKING.', 'MAYI'); sfx('get'); await say('MAYI REJOINED THE PARTY.', null); } };

// ---------------- the front-on battle view (CONFIG: BATTLE VIEW) ----------------
function frontLayout() {
  const n = B.party.length; B.party.forEach((u, i) => { u.x = Math.round(160 - n * 34 + i * 68 + 26); u.y = BWIN - 32; });
  for (const f of B.foes) { f.x += 56; f.y = Math.max(4, f.y - 6); }
}
function drawFrontHero(u) {
  const H = heroArt(u), x = u.x, y = u.y + (u.dy || 0);
  let s = H.u[0];
  if (u.hp <= 0) { draw(H.ko, x - 4, y + 10, H.P); return; }
  if (B.results && u.pose === 'win') s = (frame >> 4) & 1 ? H.win : H.u[0];
  else if (B.menu && B.menu.title === u.name || (B.readyQ[0] === u && !B.acting)) s = H.u[1 + ((frame >> 3) & 1)];
  if (u.status.hidden && (frame & 3)) return;
  rectA(x + 2, y + 22, 12, 3, BLACK, .35);
  draw(s, x, y, u.empress ? empressPal(H.P) : H.P, false, u.flash & 2 ? WHITE : (u.status.pause ? hex('#929292') : 0));
  if (u.status.sleep && (frame >> 4) & 1) text('Z', x + 12, y - 4, WHITE);
}
// summons can buff the party too (THE DRIVER)
const _heroAct = heroAct;
heroAct = async function (a) { await _heroAct(a); if (a.kind === 'summon') { const cr = CRYSTALS[a.actor.r.crystal]; if (cr && cr.summon.buff) for (const t of partyAlive()) inflict(t, cr.summon.buff, 100, 1); } };

// ---------------- music for the new places ----------------
Object.assign(TRACKS, {
  planet: MU.song({ bpm: 92, chords: ['Bm', 'Gmaj7', 'Em', 'F#', 'Bm', 'Gmaj7', 'Em7', 'F#'], ins: 'bell', vol: .7,
    mel: 'F#5:6 B5:2 D6:8 C#6:4 B5:4 F#5:8 G5:6 B5:2 E6:8 C#6:12 r:4 F#5:6 B5:2 D6:8 E6:4 D6:4 B5:8 G5:6 E5:2 B5:8 A#5:12 r:4',
    bass: 'held', arp: 'up', arpIns: 'pluck', arpVol: .3, arp2: 'pad1', drums: 'soft', drumVol: .3 }),
  memoria: MU.song({ bpm: 84, chords: ['D', 'A', 'Bm', 'G'], ins: 'epiano', vol: .7, mel: 'A5:4 F#5:4 D5:8 E5:4 C#6:4 A5:8 B5:4 D6:4 F#6:6 E6:2 D6:16', bass: 'walk', arp: 'up', arpIns: 'bell', arpVol: .25, arpOct: 5, drums: null }),
  archive: MU.song({ bpm: 108, chords: ['Em', 'Em', 'C', 'D', 'Em', 'Em', 'Am', 'B'], ins: 'organ', vol: .6, mel: 'E5:2 G5:2 B5:4 A5:2 G5:2 E5:4 B4:2 E5:2 G5:4 F#5:8 C5:4 E5:4 G5:8 D5:4 F#5:4 A5:8 E5:2 G5:2 B5:4 E6:4 D6:4 A5:4 C6:4 E6:8 D#6:16 B5:16', bass: 'gallop', arp: 'stab', arpVol: .3, drums: 'tom', drumVol: .45 }),
  bus: MU.song({ bpm: 128, chords: ['A', 'D', 'E', 'A'], ins: 'lead', mel: 'A4:2 C#5:2 E5:4 A5:4 F#5:2 E5:2 D5:4 F#5:4 A5:4 B5:2 A5:2 G#5:4 E5:4 B4:4 C#5:4 E5:4 A5:8 r:4', bass: 'oct', arp: 'eighths', arpVol: .3, drums: 'shuffle', drumVol: .55 }),
});
