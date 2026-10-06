'use strict';
// ================= CARL 2: episodes 2-7, deliveries, bosses, endings =================
const NF = 'NEW FACE', PKN = 'PEE KID', YK = 'YOKO', SG = 'SPOOKY GHOST', CC = 'COMRADE CARL';
function bossEnt(o) { const e = addEnt(Object.assign({ kind: 'boss', boss: 1, hw: 12, hh: 6, anim: 14, t: 0 }, o)); e.maxhp = e.hp; WD.bossE = e; return e; }
function towardPL(e, sp, hw = 12, hh = 6) { const a = Math.atan2(PL.y - e.y, PL.x - e.x); moveBox(e, Math.cos(a) * sp, Math.sin(a) * sp, hw, hh); e.flip = PL.x < e.x; }
function ringShots(e, n, sp, k = 'note', dmg = 2, a0 = 0) { for (let i = 0; i < n; i++) { const a = a0 + i / n * 6.283; WD.eshots.push({ x: e.x, y: e.y - 16, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, k, dmg, t: 0 }); } sfx('blip', [260, 30]); }
function aimShots(e, n, sp, spread, k = 'note', dmg = 2) { const a0 = Math.atan2(PL.y - 8 - (e.y - 16), PL.x - e.x); for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * spread; WD.eshots.push({ x: e.x, y: e.y - 16, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, k, dmg, t: 0 }); } sfx('blip', [420, 30]); }
const enemiesAlive = () => WD.ents.filter(e => e.kind === 'enemy' && !e.dead && !e.gone).length;

// ================= Committee NOTES: optional upgrades. every one makes him a little more HU-MAN =================
const CNOTES = {
  2: { s: 'Give him sunglasses. Kids trust sunglasses.', get: '+20% BONG DAMAGE', hu: 8, apply: () => { C2.dmgMul = (C2.dmgMul || 1) * 1.2; } },
  3: { s: 'Make him faster. Nobody likes a slow mascot.', get: '+15% SPEED', hu: 6, apply: () => { C2.spdMul = (C2.spdMul || 1) * 1.15; } },
  4: { s: 'Give him a catchphrase.', get: 'THE HU-MAN METER FILLS 35% FASTER', hu: 6, apply: () => { C2.meterMul = (C2.meterMul || 1) * 1.35; C2.catch = 1; } },
  5: { s: 'More muscles. On all of him.', get: '+6 MAX COOL', hu: 8, apply: () => { C2.maxhp += 6; C2.hp = C2.maxhp; } },
};
async function committeeNote(n) {
  const N = CNOTES[n]; if (!N || F2('cnote' + n)) return;
  setF2('cnote' + n, -1); memo(N.s);
  const c = await ask('NOTE FROM THE COMMITTEE: "' + N.s.toUpperCase() + '" (' + N.get + '. HUMAN +' + N.hu + '%.)', HOC, ['ACCEPT THE NOTE', 'IGNORE IT']);
  if (c === 0) { setF2('cnote' + n, 1); N.apply(); addHuman(N.hu, 'note ' + n); sfx('power'); await CL(pick(['...Okay. Fine. It\'s just a note.', 'I\'ll try it. Once. Trying isn\'t agreeing.']), 'Great job, genius.', 'w'); }
  else await C(pick(['No. I\'m good. I\'m good the way I am. I\'m... okay the way I am.', 'Put it in the pile. With the other notes. The pile is the trash.']), 'a');
}

// ================= set-piece helpers: rules card once, reason card on every fail =================
const TUT = {};
async function tutor(k, lines) { if (TUT[k]) return; TUT[k] = 1; await showCard(lines, 0, { inv: 1 }); }
async function failCard(why, line) { await showCard(['TRY AGAIN', '', ...String(why || line).match(/.{1,26}(\s|$)/g).map(x => x.trim())], 0, { inv: 1 }); }

// ================= EPISODE 2: DESERT BUS TURBO =================
async function startEp2() {
  C2.ep = 2;
  await epCard(2, 'DESERT BUS TURBO', 'Add a race. Kids love races.');
  await tutor('bus', ['DESERT BUS TURBO', '', 'REACH THE DINER IN 8 HOURS,', 'AHEAD OF HU-MAN.', 'A: GAS  B: BRAKE', 'STEER: LEFT / RIGHT', 'CRASHES SLOW YOU DOWN.', 'EACH HOUR GIVES MORE TIME.']);
  let r; for (;;) { r = await desertBusTurbo(); if (r.win) break; await failCard(r.why); await C('Again. Again. I was doing it right. The bus was wrong.', 'a'); }
  setF2('raced'); C2.raceWin = 1;
  scene = worldScene; loadMap('desert', 23, 27, 'u'); post.fade = 1; await fadeIn(.06);
  {
    await say('Great job, genius.', HU);
    await C('Was that— was that a compliment? It sounded like a compliment. It had no feelings in it.', 'w');
    giveBong(genBong(3, { size: 'FIVE-FOOT', mods: ['PIERCE'] })); await say('FIRST PLACE PRIZE: A FIVE-FOOT BONG. IT IS TALLER THAN CARL. EVERYTHING IS.');
  }
  await C('Hour eight. We made it. Chat, we made it. The bus still pulls to the right.', 'n');
  await committeeNote(2);
  setObj('Find JB Garfield in the diner', 'diner', 3, 4);
}
async function busBack() {
  const i = await ask('RIDE THE BUS BACK TO THE LOT? (8 HOURS. SKIPPED.)', null, ['RIDE', 'NO']);
  if (i !== 0) return;
  await fadeOut(.08); const pv = scene; scene = { draw() { cls(BLACK); } }; post.fade = 0; await showCard(['8 HOURS LATER.'], 80); scene = pv; post.fade = 1; loadMap('lot', 36, 11, 'l'); await fadeIn(.08);
}
async function garfTalk2() {
  if (!F2('case')) {
    await say('Carl. You\'re in color.', GF);
    await C('It\'s not my fault.', 'w');
    await say('I know. I checked.', GF);
    laugh();
    await say('You\'re here about a parcel. Forwarding address. Came through on the 219 bus. It got lifted. In this diner. On my shift.', GF);
    await C('Somebody STOLE my forwarding address? Who steals an address. Where would they even put it.', 'a');
    await say('That\'s the case. Three clues in this room. Find them. Then we accuse somebody. Justice, basically.', GF);
    setF2('case'); clueObj();
    return;
  }
  const n = ['clue1', 'clue2', 'clue3'].filter(F2).length;
  if (n < 3) return say(nth2('garfwait', ['Keep looking. Clues don\'t find themselves. Some do. Not these.', 'Check the counter. Check the floor. Check the jukebox. I say that to everybody.', 'I\'d help, but I\'m sitting. Sitting is also detective work.']), GF);
  await say('Three clues. Lipstick. A coupon. A jukebox stuck on a jingle. So. Who did it?', GF);
  for (;;) {
    const c = await ask('ACCUSE WHO?', GF, ['THE WAITRESS', 'THE HITCHHIKER', 'THE JUKEBOX', 'CARL']);
    if (c === 0) break;
    if (c === 1) await say('The hitchhiker\'s been outside for nine hours. He\'s never been inside. He\'s never been anywhere.', GF);
    if (c === 2) await say('The jukebox is a victim here, Carl.', GF);
    if (c === 3) { await C('It\'s always me. It\'s never me. It\'s always me.', 'w'); await say('It\'s not you. I checked.', GF); }
  }
  await say('J\'ACCUSE. The waitress.', GF);
  await say('...Lite.', 'WAITRESS'); await say('LITE! LITE! A LITTLE LESS LINDA!', 'LINDA LITE');
  sfx('glitch'); post.flash = .8;
  const w = ent('waitress'); if (w) w.gone = 1; setF2('liteFound');
  await C('She\'s a LINDA. She was a Linda the whole time. There\'s a Linda in the diner. There\'s a Linda in everything.', 'a');
}
async function liteStart() { music('boss'); spawnEnemy('lite', 15 * 16 + 8, 6 * 16 + 14); spawnEnemy('focus', 4 * 16 + 8, 9 * 16 + 14); spawnEnemy('focus', 16 * 16 + 8, 9 * 16 + 14); }
async function clue(k, line) {
  if (F2(k)) return C('Already got that one. It\'s a clue. It\'s still a clue.');
  setF2(k); sfx('ask'); await C(line, 'n');
  const n = ['clue1', 'clue2', 'clue3'].filter(F2).length;
  await say('CLUE ' + n + ' OF 3.');
  clueObj();
}
function clueObj() {
  const n = ['clue1', 'clue2', 'clue3'].filter(F2).length;
  if (n >= 3) return setObj('Tell Garfield who did it', 'diner', 3, 4);
  const nx = !F2('clue1') ? [14, 5] : !F2('clue2') ? [5, 7] : [1, 3];
  setObj('Find 3 clues in the diner (' + n + '/3)', 'diner', nx[0], nx[1]);
}
async function waitressTalk() {
  if (F2('case')) return say(nth2('wait2', ['More coffee? It\'s a little less coffee. It\'s LITE.', 'I don\'t know anything about any address. I\'ve never seen an address.', 'Have you tried our coupon?']), 'WAITRESS');
  await say(pick(['Welcome to Garf\'s. Seat yourself. Everyone does.', 'Coffee? It\'s the same coffee. It\'s always been the same coffee.']), 'WAITRESS');
}
async function garfJoins() {
  await say('The address. She had it in her apron.', GF);
  await say('"LAKE MEAD. DOCK 219."', GF);
  await C('219. It\'s always 219. Why is it always 219. What IS 219.', 'w');
  await say('I\'m coming with you. Somebody has to write this down.', GF);
  C2.comp = 'garf'; setF2('garfJoined'); sfx('get');
  await say('JB GARFIELD JOINED! HE ACCUSES ENEMIES. ACCUSED ENEMIES TAKE DOUBLE DAMAGE. HE ALSO NAPS.');
  addEnt({ id: 'comp', kind: 'comp', comp: 'garf', x: PL.x - 16, y: PL.y });
  const g = ent('garf'); if (g) g.gone = 1;
  setObj('Head north to Lake Mead (the road past the diner)', 'desert', 20, 2);
}
async function hitchTalk2() {
  const H2 = 'HITCHHIKER';
  if (dq(3) === 1) {
    await C('Here. A bus ticket. Prop Pills paid for it. It\'s only pretend but the bus doesn\'t know that.', 's');
    await say('Nine hours I\'ve been here. You know what I figured out? There is no hour nine. They added it.', H2);
    await say('Here. I recorded it. The ninth hour. Somebody should have it.', H2);
    dqDone(3); await tapeAt(3); return;
  }
  await say(nth2('hitch', ['Going north? Everyone\'s going north. Nobody\'s going north.', 'Nine hours. I\'ve been out here nine hours. The bus comes every eight.', 'You look like the guy on the billboard. Shorter. More... you.']), H2);
}
async function hatchTalk2() {
  if (C2.ep < 6) return say(nth2('hatch', ['A HATCH IN THE GROUND. SEALED. A STICKER: "CONTENT STORAGE. DO NOT OPEN UNTIL SEASON FINALE."', 'Below Nevada. I know what\'s down there. I was down there. I\'m not going down there. Yet.']));
  await C('It\'s open. Of course it\'s open. It\'s a very special episode.', 's');
  await goMap('facility', 3, 3, 'd');
}
async function vanStart() {
  music('boss');
  await say('A WHITE VAN IS PARKED ACROSS THE ROAD. THE DISH ON THE ROOF TURNS TOWARD CARL.');
  await say('Carl. You\'re off-brand. Please remain still for re-branding.', HOC);
  await C('It\'s the van. Every movie has the van. I\'m IN the movie with the van.', 'a');
  bossEnt({ id: 'van', name: 'THE CONTENT VAN', x: 21 * 16, y: 5 * 16, hp: 110 + C2.lv * 6, spr: CS.van, P: CP.van, box: [60, 30], hitY: 16, hw: 28, hh: 8, upd: vanUpd, onDie: () => {} });
}
function vanUpd(e) {
  if (e.dead) return; e.vx = e.vx || 1.1; e.vy = e.vy || .5;
  const m = moveBox(e, e.vx * (e.hp < e.maxhp / 2 ? 1.5 : 1), e.vy, 28, 8); if (m.hitX) e.vx = -e.vx; if (m.hitY) e.vy = -e.vy;
  if (e.x < 15 * 16 || e.x > 27 * 16) e.vx = Math.sign(21 * 16 - e.x) * Math.abs(e.vx); if (e.y < 3 * 16 || e.y > 9 * 16) e.vy = Math.sign(6 * 16 - e.y) * Math.abs(e.vy);
  if (e.t % 150 === 60) ringShots(e, 10 + (e.hp < e.maxhp / 2 ? 4 : 0), 1.6, 'note', 2, e.t * .1);
  if (e.t % 200 === 100 && enemiesAlive() < 4) { spawnEnemy('focus', e.x - 20, e.y + 10); spawnEnemy('focus', e.x + 20, e.y + 10); sfx('door'); }
  if (Math.abs(PL.x - e.x) < 30 && Math.abs(PL.y - e.y) < 12) hurtPlayer(3, e.x, e.y);
}
async function vanDown() {
  WD.shake = 20; for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('The van\'s radio crackles.');
  await say('Carl. You\'re making this very hard to market.', HOC);
  await C('GOOD.', 'a'); laugh('[APPLAUSE]');
  await say('He\'s a lot. I\'m putting that in the report.', GF);
  setF2('ep2done'); setObj('Go north to Lake Mead', 'lake', 14, 10);
  await epEnd(2, 'JUMP THE SHARK');
}

// ================= EPISODE 3: JUMP THE SHARK =================
async function lakeEnter() {
  if (F2('lakeIntro')) return;
  setF2('lakeIntro'); C2.ep = 3;
  await epCard(3, 'JUMP THE SHARK', 'Ratings are down. Jump a shark.');
  post.fade = 0;
  await C('Lake Mead. It\'s a lake in the desert. That\'s already a lot. Why is the Committee here.', 'w');
  await committeeNote(3);
  setObj('Talk to the Committee on the beach', 'lake', 14, 10);
}
async function boatTalk() {
  if (!F2('jacket')) return C('That\'s my ship. Why is it in the water. Why is it wearing a life vest. Who put a life vest on my ship.', 'a');
  const c = await ask('JUMP THE SHARK?', null, ['LET\'S DO THIS', 'NOT YET']); if (c !== 0) return;
  await C('...Ayyy?', 'w'); laugh();
  await tutor('ski', ['JUMP THE SHARK', '', 'STEER THROUGH THE GATES:', 'BETWEEN TWO BUOYS.', 'HITTING A BUOY HURTS.', 'RATINGS AT 0 = WIPEOUT.', 'ON THE LAST RAMP HOLD A,', 'THEN PRESS THE ARROWS SHOWN.']);
  for (;;) {
    const r = await jumpTheShark();
    C2.jump = r;
    if (r.power !== undefined) break;
    await failCard(r.why); await say('THE A.S.S. CIRCLES BACK. THE SHARK IS PATIENT. THE SHARK HAS DONE THIS BEFORE.');
  }
  setF2('jumped'); C2META.jumped = 1; saveC2M();
  scene = { draw() { cls(BLACK); } }; post.fade = 0; music(null);
  await showCard(['THE SERIES HAS', 'JUMPED THE SHARK.'], 170, { bg: hex('#1a4a8f'), fg: WHITE });
  await showCard(['RATINGS: ' + (C2.jump.rat | 0) + '%', '', C2.jump.trick >= 3 ? 'A PERFECT TRICK.' : C2.jump.trick ? 'MOSTLY A TRICK.' : 'MORE OF A FALL, REALLY.'], 130, { bg: hex('#1a4a8f'), fg: hex('#ffdb24') });
  setF2('shark'); // everything is louder now
  scene = worldScene; loadMap('lake', 17, 12, 'd'); post.fade = 1; await fadeIn(.06);
  await C('I jumped a shark. I jumped a SHARK. Chat. CHAT.', 'h');
  await C('Why is everything so bright. Was it always this bright. Is this what happens after?', 'w');
  await wait(30); sfx('crowd');
  await say('Hey.', BR);
  await C('The shark. The shark is on the beach. The shark has LEGS.', 'w');
  await say('Everybody jumps me eventually. I\'m Bruce. It\'s fine. It\'s a living.', BR);
  await say('They get big, they get tired, they get a jacket. Then they jump me and everybody says it\'s over.', BR);
  await say('It\'s not over. It\'s just different. You want company? I\'ve got nowhere to be. I\'m a shark on a beach.', BR);
  const c2 = await ask('BRUCE WANTS TO COME ALONG.', null, C2.comp === 'garf' ? ['BRUCE', 'KEEP GARFIELD'] : ['BRUCE', 'NO THANKS']);
  if (c2 === 0) { if (C2.comp === 'garf') await say('I\'ll be at the diner. Somebody\'s got to watch the jukebox.', GF); C2.comp = 'bruce'; for (const e of WD.ents) if (e.kind === 'comp' || e.id === 'bruce') e.gone = 1; addEnt({ id: 'comp', kind: 'comp', comp: 'bruce', x: PL.x + 16, y: PL.y }); sfx('get'); await say('BRUCE JOINED! HE BITES THINGS. HE HAS SEEN EVERY SHOW END. (SWAP COMPANIONS IN THE A.S.S.)'); }
  else await say('Suit yourself. I\'ll be around. I\'m always around. Look for the fin.', BR);
  setF2('bruceMet');
}
async function humanSkirmish() {
  music(null); await wait(20); sfx('power'); WD.shake = 12;
  await say('...', HU);
  await say('Your knight in shining armor has arrived.', HU);
  await C('That\'s him. That\'s the billboard. He\'s real. He\'s TALL.', 'w');
  await say('I jumped the shark too. I jumped it better.', HU);
  if (C2.comp === 'bruce') await say('He did. I was there. It was very clean. Nobody liked it.', BR);
  music('human');
  bossEnt({ id: 'hu1', name: 'HU-MAN', x: 24 * 16, y: 8 * 16, hp: 150 + C2.lv * 8, spr: () => CS.human[PL.x < WD.bossE.x ? 'r' : 'r'], scale: 1.3, P: CP.human, box: [20, 34], hitY: 18, upd: e => humanBossUpd(e, 1), onDie: () => {} });
}
function humanBossUpd(e, phase) {
  if (e.dead) return; e.st = e.st || 'walk'; e.tt = (e.tt || 0) + 1; e.spr = CS.human[e.st === 'dash' ? 'r' : 'd'];
  const sp = phase === 2 ? 1.1 : .8;
  if (e.st === 'walk') { towardPL(e, sp); if (e.tt % 70 === 0) aimShots(e, phase === 2 ? 3 : 1, 2.2, .3, 'orb', 2); if (e.tt > 150) { e.st = 'wind'; e.tt = 0; } }
  else if (e.st === 'wind') { e.fl = e.tt & 4 ? 2 : 0; if (e.tt > 30) { e.st = 'dash'; e.tt = 0; const a = Math.atan2(PL.y - e.y, PL.x - e.x); e.dx = Math.cos(a) * 3.6; e.dy = Math.sin(a) * 3.6; sfx('power'); } }
  else if (e.st === 'dash') { const m = moveBox(e, e.dx, e.dy, 10, 6); if (m.hitX || m.hitY || e.tt > 40) { e.st = 'swing'; e.tt = 0; } }
  else if (e.st === 'swing') { if (e.tt === 10) { WD.fx.push({ k: 'ring', x: e.x, y: e.y - 16, t: 14, c: hex('#6dffff') }); if (Math.hypot(PL.x - e.x, PL.y - e.y) < 42) hurtPlayer(4, e.x, e.y); if (phase === 2) ringShots(e, 8, 1.8, 'orb', 2); } if (e.tt > 30) { e.st = 'walk'; e.tt = 0; } }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 16) hurtPlayer(3, e.x, e.y);
  if (e.t % 400 === 200) tickChat('HU-MAN', pick(QUIPS));
  if (phase === 1 && e.hp < e.maxhp * .5 && !e.leaving) { e.leaving = 1; e.immune = 1; wstory(humanLeaves); }
}
async function humanLeaves() {
  const e = WD.bossE; music(null); setF2('huSkirmish'); WD.arena = null; WD.lock = 0; // he leaves; the arena is over even though nobody won
  await say('Relax. Everything went exactly as planned.', HU);
  await say('Stay small, Carl. It suits you. For now.', HU);
  sfx('power'); for (let i = 0; i < 20; i++) { post.flash = i & 2 ? .6 : 0; await nextFrame(); } post.flash = 0; if (e) { e.gone = 1; e.dead = 1; }
  await C('He talks like a trailer. He talks like every trailer. "For now." Who says "for now."', 'a');
  await wait(20);
  await say('One more thing. The A.S.S. is no longer a licensed vehicle. It\'s a boat. Boats are fine. You may have it back.', LG);
  await C('My A.S.S. My A.S.S. is back. Nobody say it. Nobody say anything.', 's'); laugh();
  setF2('ship'); C2.shipAt = 'lake';
  await say('THE A.S.S. IS BACK! USE ITS NAV CONSOLE TO TRAVEL. ITS RADIO GETS DISPATCH.');
  await C('And the parcel. Dock 219. It\'s... an empty box. There\'s a note.', 'w');
  await say('"REROUTED: PRETEND CO. BACKLOT. FOR A VERY SPECIAL CROSSOVER. —THE COMMITTEE"');
  await C('They moved it AGAIN. It\'s a parcel. It should be the easiest thing. Point A. Point B. Below below.', 'a');
  setF2('ep3done'); setObj('Check the A.S.S. radio (DISPATCH)', 'ship', 8, 4);
  await epEnd(3, 'THE CLIP SHOW');
  loadMap('lake', 26, 9, 'd');
}
async function bruceTalk() { await say(pick(['I\'m a shark on a beach. Take your time.', 'Every show thinks they\'re the first to jump me.', 'The fin is a lifestyle.']), BR); if (C2.comp !== 'bruce' && F2('ship')) await say('(You can swap companions in the A.S.S.)'); }

// ================= Dispatch, after episode 1 =================
async function dispatchLater() {
  if (F2('ep3done') && !F2('ep4start')) return startEp4();
  if (F2('ep4done') && !F2('ep5start')) return startEp5();
  if (F2('ep5done') && !F2('ep6start')) return startEp6();
  const open = DELIV.map((d, i) => ({ d, i })).filter(({ d, i }) => d.when() && dq(i) < 2);
  if (!open.length) return say('NO NEW DELIVERIES. PROP PILLS THANKS YOU FOR YOUR CONTINUED PRETENDING.', DP);
  const opts = open.map(({ d, i }) => (dq(i) === 1 ? '(ACTIVE) ' : '') + d.name).concat(C2.comp ? ['SWAP COMPANION', 'NOTHING'] : ['NOTHING']);
  const k = await choose(opts, { x: 8, y: 30, cancel: 1 });
  if (k < 0 || opts[k] === 'NOTHING') return;
  if (opts[k] === 'SWAP COMPANION') return swapComp();
  const { d, i } = open[k];
  if (dq(i) === 1) return say('ACTIVE DELIVERY: ' + d.name + '. ' + d.hint, DP);
  setF2('dq_' + i, 1); sfx('ok'); await say('DELIVERY ACCEPTED: ' + d.name + '. ' + d.hint, DP);
}
async function swapComp() {
  const opts = [F2('garfJoined') ? 'JB GARFIELD' : null, F2('bruceMet') ? 'BRUCE' : null, 'NOBODY'].filter(Boolean);
  const k = await choose(opts, { x: 8, y: 30, cancel: 1 }); if (k < 0) return;
  C2.comp = { 'JB GARFIELD': 'garf', BRUCE: 'bruce', NOBODY: null }[opts[k]];
  for (const e of WD.ents) if (e.kind === 'comp') e.gone = 1; if (C2.comp) addEnt({ id: 'comp', kind: 'comp', comp: C2.comp, x: PL.x - 16, y: PL.y });
  await say(C2.comp === 'garf' ? 'Back on the case.' : C2.comp === 'bruce' ? 'Fin\'s up.' : 'Just you and chat. Like the old days.', C2.comp === 'garf' ? GF : C2.comp === 'bruce' ? BR : null);
}
const dq = i => F2('dq_' + i) || 0;
function dqDone(i) { setF2('dq_' + i, 2); sfx('get'); DBG.deliveries = (DBG.deliveries || 0) + 1; }
const DELIV = [
  { name: 'PRETZELS FOR THE MALL COP', hint: 'HE\'S IN THE MALL. HE\'S ALWAYS IN THE MALL.', when: () => C2.ep >= 3 },
  { name: 'A FACE FOR THE FACELESS', hint: 'PICK UP ONE FACE AT LOST+FOUND. DELIVER TO THE FACELESS ONE IN THE LOT.', when: () => C2.ep >= 3 },
  { name: 'GARF\'S TAB', hint: 'DELIVER GARFIELD\'S UNPAID TAB TO CEO LINDA. SHE\'S ON A SCREEN IN THE MALL.', when: () => C2.ep >= 3 },
  { name: 'A BUS TICKET', hint: 'THE HITCHHIKER BY GARF\'S DINER NEEDS A RIDE. OR A TICKET. OR A HUG. JUST THE TICKET.', when: () => C2.ep >= 3 },
  { name: 'FAN MAIL', hint: 'A KID IN THE LOT WROTE A LETTER TO SPOOKY GHOST. HE\'S AT THE BACKLOT.', when: () => C2.ep >= 4 },
];

// ================= EPISODE 4: THE CLIP SHOW / THE CROSSOVER =================
async function startEp4() {
  setF2('ep4start'); C2.ep = 4;
  await epCard(4, 'THE CLIP SHOW', 'We are over budget. Do a clip show.');
  await clipShow();
  scene = worldScene; loadMap('ship', 7, 6, 'd'); post.fade = 1; await fadeIn(.06);
  await C('That was the worst thing I\'ve ever watched and I\'ve watched a bus drive for eight hours.', 'a');
  await committeeNote(4);
  setObj('Fly to the PRETEND CO. backlot (NAV console)', 'backlot', 20, 13);
}
async function clipShow() {
  const clips = [
    ['REMEMBER WHEN CARL DELIVERED A PARCEL?', 'That happened. That\'s the one thing that happened.', 0],
    ['REMEMBER WHEN CARL WAS A COP?', 'That never happened. That was a PROPOSAL. Somebody PROPOSED that.', 1],
    ['REMEMBER WHEN CARL WAS MAYOR?', 'Also a proposal! You can\'t just show proposals!', 2],
    ['REMEMBER WHEN CARL FOUND HIS PARENTS?', '...That didn\'t happen.', 3],
  ];
  music('previously'); LEGACY_AUDIO = true; let t = 0, cur = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#301830'));
    rectF(30, 24, 260, 150, hex('#101010')); rectF(34, 28, 252, 142, hex('#9bbc0f')); const k = clips[cur][2];
    if (k === 0) { rectF(34, 120, 252, 50, hex('#306230')); drawScaled(LEGACY.carl, 140, 90, LEGPAL, 2); rectF(180, 120, 16, 12, hex('#0f380f')); }
    if (k === 1) { drawScaled(LEGACY.carl, 140, 80, LEGPAL, 2); rectF(142, 76, 30, 8, hex('#0f380f')); rectF(150, 72, 12, 4, hex('#306230')); text('POLICE', 130, 140, hex('#0f380f')); }
    if (k === 2) { drawScaled(LEGACY.carl, 140, 80, LEGPAL, 2); rectF(146, 60, 20, 14, hex('#0f380f')); text('MAYOR CARL', 118, 140, hex('#0f380f')); }
    if (k === 3) { rectF(34, 120, 252, 50, hex('#306230')); drawScaled(LEGACY.carl, 150, 110, LEGPAL, 1.5); for (const x of [100, 200]) { rectF(x, 50, 14, 70, hex('#0f380f')); circF(x + 7, 46, 8, hex('#0f380f')); } }
    if ((t >> 5) & 1) text('REC', 40, 32, hex('#0f380f'));
    const sp = PORT[SG]; if (sp) { draw(sp.s, 260, 150, sp.P); } text('PREVIOUSLY ON CARL', 40, 180, UI.name);
  } };
  post.fade = 1; await fadeIn(.06);
  await say('Hi. Hello. It\'s me. Spooky Ghost. Front page. Tonight: a look back.', SG);
  await C('Why are you hosting. Why is there a clip show. We\'ve done four episodes.', 'a');
  await say('Budget, bro. Clip shows are free. Clips are just stuff that already happened.', SG);
  for (let i = 0; i < clips.length; i++) {
    cur = i; sfx('static'); await wait(20);
    await say(clips[i][0], SG);
    await C(clips[i][1], i === 3 ? 's' : 'a');
    if (i === 1 || i === 2) { await say('Non-canon.', LG); laugh(); }
    if (i === 3) { await wait(40); await say('...', SG); await say('Sorry, bro. I thought it was a good clip.', SG); await say('We\'ll fix it in post.', HOC); await C('You can\'t fix that in post.', 's'); addHuman(-3, 'clip'); }
  }
  await say('That\'s the show. Front page. Goodnight.', SG);
  LEGACY_AUDIO = false; await fadeOut(.06);
}
async function backlotEnter() {
  if (F2('backlotIntro')) return;
  setF2('backlotIntro');
  await C('The PRETEND CO. backlot. It\'s where they make the games. It\'s smaller than I thought. Everything is.', 'w');
  await say('Carl. The parcel is here. But this is a crossover episode.', LG);
  await say('Each property must sign a consent form. Three properties. Three signatures. Then you get your parcel.', LG);
  await C('Properties? They\'re PEOPLE. They\'re people who are also games.', 'a');
  await say('Stage 1, Stage 2, Stage 3. Go.', LG);
  sigObj();
}
function sigObj() {
  const n = ['sig_face', 'sig_pk', 'sig_yoko'].filter(F2).length;
  if (n < 3) { const nx = !F2('sig_face') ? ['setface', 12, 7, 'Stage 1'] : !F2('sig_pk') ? ['setpk', 26, 5, 'Stage 2'] : ['setyoko', 12, 5, 'Stage 3']; setObj('Get 3 signatures (' + n + '/3): ' + nx[3], nx[0], nx[1], nx[2]); }
  else setObj('Bring the signatures to LEGAL (center of the lot)', 'backlot', 20, 13);
}
async function legalConsent() {
  const n = ['sig_face', 'sig_pk', 'sig_yoko'].filter(F2).length;
  if (n < 3) return say(n ? 'Three signatures. You have ' + n + '. I can count. I\'m made of paper, not stupid.' : 'Three signatures. Stages 1, 2, 3. Page 219 explains it. Page 219 is blank.', LG);
  await say('Three signatures. Everything is in order.', LG);
  await say('...Except one thing.', HOC);
  await C('There\'s always one thing.', 'w');
}
async function faceTalk2() {
  if (F2('sig_face')) return say(pick(['It\'s strange having a body in here. Not strange. New.', 'Say hi to the kid for me. I don\'t know which kid. Any of them.']), NF);
  if (!F2('faceClear')) return say('The chat\'s gotten hostile. I can\'t hear anyone over the chat.', NF);
  const ended = OTHER.face && OTHER.face.ending;
  await say(ended === 'nothing' ? 'Carl. I let it end, the last time. I\'m surprised anything\'s still on.' : ended ? 'Carl. I heard you were in the sequel. I heard I was, too, for a while.' : 'Carl. Hi. I\'m Face. The new one.', NF);
  await C('You\'re not the one who got me out. The old one. From the facility.', 'w');
  await say('No. I don\'t think I am.', NF);
  const c = await ask('...', null, ['I\'D LIKE YOU TO BE', 'NOBODY TELLS ME WHAT TO DO']);
  if (c === 0) { await C('I\'d like you to be. Not the same guy. Just... a guy who\'d do that. You know?', 's'); await say('...I\'d like that too. I\'d like to be the kind of face that gets people out.', NF); addHuman(-5, 'face'); }
  else { await say('Nobody tells me what to do.', 'CARL', { port: { s: CS.carlPorts.jaw, P: CP.carlPort } }); addHuman(3, 'face quip'); await say('...Okay. Nobody told you anything. I was going to say I\'d like to be friends.', NF); await C('Why did I say that. That wasn\'t mine.', 'w'); }
  await say('Here. Consent. Signed. It\'s just a face. I have a lot of them.', NF);
  setF2('sig_face'); sfx('get'); sigObj();
}
async function pkTalk2() {
  if (F2('sig_pk')) return say(pick(['Is the sequel better than the first one? Mine was the third one. I don\'t know which one is better.', 'Can I ask one more question? Where do sequels come from?']), PKN);
  if (!F2('pkClear')) return say('There are adults everywhere. I\'m not allowed to hit anyone. I just ask them things.', PKN);
  const pk = OTHER.pk;
  await say(pk && pk.letgo ? 'Hi. I\'m still here. Somebody said I left. I didn\'t leave. I just went outside.' : 'Hi. Are you the alien? My dad says you\'re an alien.', PKN);
  await C('I\'m a regular human. I have a parcel. Can you sign this?', 'n');
  await say('Can I ask a question first?', PKN); await C('...Sure.', 'w');
  await say('The label on your box. It says a word. It\'s not letters. It sounds like when somebody says your name right. Is it your name?', PKN);
  await C('...I don\'t know. I think so. I think somebody\'s been trying to say it for a long time.', 's');
  await say('Okay. I signed it. I drew a dog next to it. His name is Biscuit.', PKN);
  setF2('sig_pk'); sfx('get'); addHuman(-2, 'pk'); sigObj();
}
async function yokoTalk2() {
  if (F2('sig_yoko')) return say(PERMA_YOKO ? 'Go. Before I change my mind about owning you.' : pick(['I\'m not translating it. I\'m sorry. I\'m not.', 'Carl. Thank you for turning me on. Once. I remember.']), PERMA_YOKO ? 'THE EMPRESS' : YK);
  if (!F2('yokoClear')) return say('The Yokoids are on their break. Please don\'t make them work. They get ideas.', PERMA_YOKO ? 'THE EMPRESS' : YK);
  if (PERMA_YOKO) {
    await say('Carl. This is YOKO LTD. Everything here is mine. The sign. The stage. The consent.', 'THE EMPRESS');
    await C('Can you read this label? The sender. It\'s a word. It\'s in [[[[[.', 'w');
    await say('I could translate it. I could own it. I could put it on a lunchbox.', 'THE EMPRESS');
    await say('...No. Take it. I have enough. Signed.', 'THE EMPRESS');
  } else {
    await say('Carl. You turned me on, once. In the dark. You didn\'t have to.', YK);
    await C('It was a button. Anybody would have. ...Can you translate this? The sender. It\'s the noise. [[[[[.', 'w');
    await wait(40);
    await say('It\'s a name.', YK);
    await say('Names aren\'t mine to translate.', YK);
    await C('...Yeah. Okay. Yeah. That\'s fair. That\'s fair, right? Chat, that\'s fair.', 's');
    await say('Signed. Go get your parcel.', YK);
  }
  setF2('sig_yoko'); sfx('get'); addHuman(-3, 'yoko'); sigObj();
}
async function ghostTalk2() {
  if (dq(4) === 1 && F2('hasLetter')) { await C('Mail for you. A kid wrote it. It says "you are the scariest ghost." It\'s spelled "skariest."', 'n'); await say('...Front page. Front PAGE, bro. I\'m keeping this.', SG); await say('Here. Take this. It\'s haunted. Everything I own is haunted.', SG); dqDone(4); giveBong(genBong(C2.ep + 1, { mat: 'HAUNTED', mods: ['HOMING'] })); return; }
  await say(nth2('sg2', ['Carl. You\'re on the front page AGAIN. There\'s a sequel. With your NAME on it.', 'I hosted the clip show. You\'re welcome. Nobody watched it. Everybody watched it.', 'They offered me a spin-off. SPOOKY GHOST 2: ANOTHER BOOGALOO. I said I\'d think about it. I said yes.']), SG);
}
async function bargainBin() {
  await say('A BARGAIN BIN. $1 EACH. INSIDE: A CARTRIDGE WITH A GRAY LABEL. "TP: THROWING IN THE TOWEL."');
  await C('Who\'s TP? I don\'t know who that is. Nobody knows who that is. It\'s a dollar.', 'w');
  if (!C2.tapes.includes(5)) { await say('UNDER THE CARTRIDGES: A TAPE LABELED "PILOT (UNAIRED)."'); await tapeAt(5); }
}
async function xoverStart() {
  await say('Except one thing.', HOC);
  await say('A crossover needs a crossover EVENT. Something from every property. At once.', HOC);
  sfx('glitch'); WD.shake = 20; music('boss');
  await say('THE CROSSOVER HAS BEEN ASSEMBLED FROM SPARE PARTS.');
  await C('That\'s a Linda head on a Test on a chat bubble. That\'s a licensing NIGHTMARE. Chat, is it looking at me? It\'s looking at me with two different eyes.', 'w');
  bossEnt({ id: 'xover', name: 'THE CROSSOVER', x: 20 * 16, y: 15 * 16, hp: 200 + C2.lv * 10, spr: CS.xover, P: CP.xover, box: [48, 50], hitY: 30, hw: 20, hh: 8, upd: xoverUpd, onDie: () => {} });
  const l = ent('legalB'); if (l) l.gone = 1;
}
function xoverUpd(e) {
  if (e.dead) return; const ph = e.hp < e.maxhp / 3 ? 3 : e.hp < e.maxhp * 2 / 3 ? 2 : 1;
  towardPL(e, .45 + ph * .12, 20, 8);
  if (e.t % 160 === 40 && enemiesAlive() < 5) { for (let i = 0; i < ph; i++) spawnEnemy('bubble', e.x + (i - 1) * 30, e.y - 10); }
  if (ph >= 2 && e.t % 90 === 0) aimShots(e, 5, 1.9, .22, 'coupon', 2);
  if (ph >= 3 && e.t % 140 === 70) ringShots(e, 14, 1.7, 'orb', 2, e.t);
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 26) hurtPlayer(3, e.x, e.y);
}
async function xoverDown() {
  WD.shake = 24; for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('THE CROSSOVER COMES APART. EVERYBODY GETS THEIR PARTS BACK. THE LINDA HEAD LOOKS RELIEVED.');
  await say('Fine. The parcel. Here.', HOC); sfx('get');
  await C('It\'s... light. It\'s so light. Hold on. There\'s a label. RETURN ADDRESS.', 'w');
  await say('"RETURN ADDRESS: ABOVE."');
  await C('Above. Above AND below. It came from above and it\'s going below. It\'s me. The parcel is ME. The address is ME.', 'w');
  await say('Space. Every franchise goes to space eventually.', HOC);
  setF2('ep4done'); setObj('Check the A.S.S. radio (DISPATCH)', 'ship', 8, 4);
  await epEnd(4, 'IN SPACE');
}

// ================= EPISODE 5: IN SPACE =================
async function startEp5() {
  setF2('ep5start'); C2.ep = 5; setF2('moonOpen');
  await epCard(5, 'IN SPACE', 'Every show goes to space eventually.');
  scene = worldScene; post.fade = 1; await fadeIn(.06);
  await C('Space. The A.S.S. can do space. It\'s an Alien Starship. It\'s in the name. Nobody ever lets me use the whole name.', 'n');
  await committeeNote(5);
  setObj('Fly to THE RED MOON (NAV console)', 'moon', 17, 11);
}
async function spaceRun() {
  for (;;) { await tutor('space', ['IN SPACE', '', 'ARROWS: FLY', 'A: THROW BONGS', 'SHOOT THE ENEMIES.', 'DODGE THE RED SHOTS.', 'COOL AT 0 = TRY AGAIN.']); const r = await inSpace('waves'); if (r.win) break; await failCard(r.why); await say('CARL LOST HIS COOL. IN SPACE. NOBODY HEARD IT. EVERYBODY HEARD IT.'); }
  setF2('moonVisited'); C2.shipAt = 'moon';
  scene = worldScene; loadMap('moon', 5, 23, 'u'); post.fade = 1; await fadeIn(.06);
  if (MAPS2.moon.enter) await MAPS2.moon.enter();
}
async function moonEnter() {
  if (F2('moonIntro')) return; setF2('moonIntro');
  await C('The Red Moon. It\'s red. Everything\'s red. There\'s a blanket on the flagpole. It\'s MY blanket. It\'s a DIFFERENT my blanket.', 'w');
  await say('This location is non-canon.', LG); laugh();
  setObj('Find whoever runs this place', 'moon', 17, 11);
}
async function comradeTalk() {
  if (F2('comradeDone')) return say(pick(['Go home, other me. You have a home. It\'s a parking lot. That counts.', 'The blanket song goes: "red, red, red." That\'s the whole song. It\'s a good song.']), CC);
  await say('Comrade. Welcome to the Red Moon. You look like me. You look like me if I was worried about everything.', CC);
  await C('I AM worried about everything. Who are you.', 'w');
  await say('Carl. The Carl whose family never crashed. We landed. We stayed together. Everyone shares everything. I had them the whole time.', CC);
  await say('This timeline is NON-CANON.', LG);
  await say('Tell your paper to be quiet.', CC);
  const won = await argue2({ name: 'COMRADE CARL', port: 'COMRADE CARL', hp: 54, power: 4, weak: { LOGIC: 2, DENIAL: .5 }, bg: ['#6d0000', '#100000'],
    intro: 'COMRADE CARL WANTS TO ARGUE! HE ARGUES LIKE YOU. THAT\'S THE PROBLEM.', atk: ['Hold on. HOLD on. That\'s MY move.', 'Chat, is he doing my voice? He\'s doing my voice.', 'Everything is for everyone. Including this argument. Which I\'m winning.', 'You don\'t get to be mad at me. I AM you. Being mad at me is just being mad.'],
    low: ['Okay. Okay, okay. You\'re— okay.', 'I hate this. I hate that this is how I sound.'], react: { DENIAL: 'You\'re denying it to ME? I invented that. We invented that.', LOGIC: '...That\'s a good point. Why didn\'t I think of that. I did think of that. Later.' },
    carl: { LOGIC: ['If you had them the whole time, why are you out here alone on a moon.', 'You said everybody shares everything. Share the answer. Where are they.'] },
    win: '...Fine. You win. You win because you still want it. I stopped wanting it. I had it.', lose: 'Again. Argue with me again. I have nowhere to be. It\'s a moon.' });
  if (!won) return;
  const c = await ask('...', null, ['WHAT WERE THEY LIKE?', 'I DON\'T WANT TO KNOW']);
  if (c === 0) {
    await say('Tall. Quiet. My mother sang a song about a blanket. My father fixed things by looking at them.', CC);
    await say('I had them the whole time. It\'s not as good as you think. It\'s just good. That\'s all. It\'s just good.', CC);
    await C('...That sounds pretty good.', 's'); addHuman(-5, 'comrade');
  } else { await C('I don\'t want to know. If I know, then I know. Then it\'s not mine to find.', 's'); await say('...That\'s very you. That\'s very me.', CC); addHuman(-3, 'comrade'); }
  await say('Here\'s the other half of your address. Above. And below. Together it says: "LOST AND FOUND. BELOW BELOW."', CC);
  await C('Lost and found. The mall. The one place. The one place I go every episode. It was always the mall.', 'w');
  await say('It\'s always the mall.', CC);
  setF2('comradeDone'); sfx('get'); music(null);
  await wait(30); sfx('glitch'); WD.shake = 20;
  await say('Carl. You\'ve been renewed for syndication. Please hold still.', HOC);
  await C('What does that mean. What does SYNDICATION mean.', 'w');
  await say('It means forever.', HOC);
  for (;;) { const r = await inSpace('boss'); if (r.win) break; await failCard(r.why); await say('THE SYNDICATOR PLAYS A RERUN OF CARL LOSING. CARL WATCHES IT. CARL TRIES AGAIN.'); }
  scene = worldScene; C2.shipAt = 'lot'; loadMap('ship', 7, 6, 'd'); post.fade = 1; await fadeIn(.06);
  await C('I blew up the reruns. Chat. I blew up syndication. That\'s— is that legal? That can\'t be legal.', 'h');
  setF2('ep5done'); setObj('Check the A.S.S. radio (DISPATCH)', 'ship', 8, 4);
  await epEnd(5, 'A VERY SPECIAL EPISODE');
}

// ================= EPISODE 6: A VERY SPECIAL EPISODE =================
async function startEp6() {
  setF2('ep6start'); C2.ep = 6;
  await epCard(6, 'A VERY SPECIAL EPISODE', 'No jokes this week.');
  setF2('special');
  scene = worldScene; post.fade = 1; music('special'); await fadeIn(.06);
  laugh();
  await C('...It\'s quiet. Why is it so quiet. There\'s no laugh track. There\'s always a laugh track.', 's');
  await say('LOST AND FOUND. BELOW BELOW. THE WAY DOWN IS THE HATCH IN THE DESERT. IT\'S OPEN NOW.', DP);
  setObj('The hatch in the desert (NAV to Garf\'s Diner)', 'desert', 36, 21);
}
async function facilityEnter() {
  if (F2('facIntro')) return; setF2('facIntro');
  await C('The facility. Below Nevada. I lived here. I think I lived here. It\'s smaller. Everything\'s smaller when you come back.', 's');
  await C('...It\'s not smaller. I\'m bigger. A little. Chat, I\'m a little bigger.', 's');
  setObj('Find the elevator at the bottom', 'below', 3, 25);
}
async function belowEnter() {
  if (F2('belowIntro')) return; setF2('belowIntro');
  await C('A warehouse. Everything anyone ever lost. Umbrellas. Faces. A towel. A shark tooth. My whole... everything.', 's');
  await C('The Lost+Found is up there. The counter. From the back.', 'n');
  setObj('Reach the counter (top of the warehouse)', 'below', 20, 3);
}
async function getBigOne() { setF2('bigone'); sfx('object'); giveBong(bigOne()); await C('THE BIG ONE. The original. They kept replacing it. It was down here. It was lost. It was always lost.', 's'); await say('GOT: THE BIG ONE. (UNIQUE)'); }
async function hocStart() {
  await say('Carl.', HOC);
  await say('Containment. Content. Same department. Different budget.', HOC);
  await C('You. You were here. In the facility. You were the one with the clipboard. You were ALWAYS the one with the clipboard.', 'a');
  await say('We kept you safe. Now we keep you on the air. It\'s the same job. You\'re product, Carl. You were always product.', HOC);
  await C('I was a KID.', 'a');
  WD.shake = 24; sfx('crash'); setF2('pilesDown');
  await say('(EVERY PILE OF LOST STUFF IN THE WAREHOUSE COMES DOWN AT ONCE. IT\'S ALL EVERYWHERE NOW. IT WAS ALWAYS GOING TO BE.)');
  music('boss');
  bossEnt({ id: 'hoc', name: 'HEAD OF CONTENT', x: 20 * 16, y: 5 * 16, hp: 190 + C2.lv * 10, spr: CS.hoc, P: CP.hoc, box: [26, 40], hitY: 22, hw: 12, hh: 6, upd: hocUpd, onDie: () => {} });
}
function hocUpd(e) {
  if (e.dead) return; const ph = e.hp < e.maxhp / 2 ? 2 : 1;
  e.tt = (e.tt || 0) + 1;
  if (e.tt % 180 === 0) { const pts = [[12, 4], [28, 4], [20, 7], [12, 8], [28, 8]]; const [tx, ty] = pick(pts); boom(e.x, e.y - 16, 1); e.x = tx * 16 + 8; e.y = ty * 16 + 14; sfx('glitch'); }
  else towardPL(e, .35, 12, 6);
  if (e.tt % 70 === 35) aimShots(e, ph === 2 ? 5 : 3, 2, .25, 'note', 3);
  if (ph === 2 && e.tt % 150 === 75) ringShots(e, 12, 1.5, 'net', 2, e.tt);
  if (e.tt % 260 === 130 && enemiesAlive() < 3) { spawnEnemy('suit', e.x - 30, e.y + 12); if (ph === 2) spawnEnemy('suit', e.x + 30, e.y + 12); }
  if (Math.hypot(PL.x - e.x, PL.y - e.y) < 16) hurtPlayer(3, e.x, e.y);
}
async function hocDown() {
  for (const e of WD.ents) if (e.kind === 'enemy') { e.dead = 1; e.gone = 1; }
  await say('...Contained.', HOC);
  await C('No. Not contained. Just done. You\'re just done.', 's');
  setObj('The counter. From the back.', 'lostfound', 7, 3);
}
async function lostFoundSpecial() {
  const LF = 'LOST+FOUND';
  if (!F2('hocDown')) return say('Lost and found. It\'s quiet today. It\'s quiet every day. Today it\'s the good kind.', LF);
  if (F2('counterDone')) return say('Go. Your show\'s on.', LF);
  setF2('counterDone');
  await say('You came in the back. Nobody comes in the back.', LF);
  await C('The two tall ones. The ones who ask if anyone small came by. Where are they.', 's');
  await say('You just missed them.', LF);
  await say('Again.', LF);
  await wait(60);
  await C('...Again.', 's');
  await say('They left something. They always leave something. This time they left a claim ticket.', LF);
  const ticket = C2.tapes.length === 8 && C2.human <= 30;
  C2.ticket = ticket ? 1 : 0; DBG.ticket = C2.ticket;
  if (ticket) {
    sfx('object'); await say('A CLAIM TICKET. ON IT, IN SLOW CAREFUL HANDWRITING, A NAME.');
    await say('[[[[[.');
    await C('...', 's'); await wait(60);
    await C('Oh.', 's');
    await C('That\'s— yeah. That\'s it. That\'s the word. From the tape. From the glass.', 's');
    await C('Nobody clip that.', 's');
  } else {
    await say('A CLAIM TICKET. SOMETHING SPILLED ON IT. MOST OF IT IS A SMUDGE. THE PART THAT ISN\'T SAYS "[[[..."');
    await C('It\'s smudged. It\'s the name and it\'s smudged. Of course it\'s smudged.', 's');
    await C((C2.tapes.length < 8 ? 'I don\'t have all of it. The tapes. I didn\'t listen to all of it.' : 'I couldn\'t read it. I couldn\'t read it with these sunglasses.') + ' I\'ll come back. I always come back.', 's');
  }
  await wait(30); sfx('glitch'); music(null);
  await say('Carl. It\'s time for the finale.', HOC);
  await C('You\'re— I beat you. I beat you like ten minutes ago.', 'a');
  await say('That was a different episode.', HOC);
  setF2('ep6done'); await startEp7();
}

// ================= EPISODE 7: SERIES FINALE =================
async function finalePhase1() {
  music('human');
  bossEnt({ id: 'hu2', name: 'HU-MAN', x: 13 * 16, y: 5 * 16, hp: 220 + C2.lv * 10, spr: CS.human.d, scale: 1.4, P: CP.human, box: [22, 36], hitY: 20,
    upd: e => humanBossUpd(e, 2), onDie: () => {} });
}
async function finalePhase2() {
  music(null);
  await say('HU-MAN IS DOWN. HU-MAN GETS UP. HE ALWAYS GETS UP. HE WAS FOCUS-TESTED FOR IT.');
  await say('Let\'s talk about this like two regular guys.', HU);
  await C('I\'m ONE regular guy. You\'re a POSTER.', 'a');
  let won = false;
  while (!won) {
    won = await argue2({ name: 'HU-MAN', port: 'HU-MAN', who: HU, hp: 72, power: 5, weak: { GRIEVANCE: 2, RANT: 2, LOGIC: 1, DENIAL: 0 }, bg: ['#6d4924', '#100800'], chatBoost: 1, immuneQuip: 'I wrote that.',
      intro: 'HU-MAN WANTS TO ARGUE! EVERY LINE HE SAYS WAS FOCUS-TESTED.', atk: QUIPS, low: ['...Relax. Everything went exactly as planned.', 'Let\'s blow up the... universe? That tested well.'],
      react: { DENIAL: 'I AM human. That\'s the point. That\'s my whole point.', GRIEVANCE: '...Nobody told me that could hurt.', RANT: 'That wasn\'t polished. That wasn\'t polished at all. How did that work.' },
      carl: { GRIEVANCE: ['You took my HAT. You took my TIE. You took the bus race. You didn\'t even know what the bus was FOR.', 'You don\'t get nervous. You don\'t get NERVOUS. Everybody gets nervous. You\'re not a person, you\'re a MOOD BOARD.'],
        RANT: ['I have been in a CELL, a MALL, a DESERT, a LAKE, SPACE, a DINER, and a BOX, and you have been on a BILLBOARD.', 'AND another thing— I don\'t even know what the other thing is. I just know there IS one. There\'s always another thing!'] },
      win: '...Great job, genius. ...That one was sincere. I don\'t know how I did that.', lose: 'Relax. We\'ll go again. We\'ll always go again.' });
    if (!won) await C('Again. I can do this again. I\'m good at again.', 'a');
  }
  await say('Fine. One more thing. The Boogaloo.', HU);
  await C('The WHAT.', 'w');
  await say('It\'s in the title, Carl.', HOC); laugh();
  let r;
  for (;;) { r = await boogaloo(); if (r.win) break; await say('The audience wants a rematch. The audience always wants a rematch.', 'ANNOUNCER'); }
  C2.dance = r;
  await say('THE AUDIENCE GOES WILD. HU-MAN SITS DOWN ON THE STAGE. HE HAS NEVER SAT DOWN BEFORE.');
  await say('...That was a good dance. That wasn\'t a note. That was just a good dance.', HU);
  await finalOffer();
}
async function finalOffer() {
  await say('Carl. The network is very happy.', HOC);
  await say('Sign for Season 3. As HU-MAN. The chin, the tie, the power. Everything you ever said you were.', HOC);
  let opts = ['SIGN (AS HU-MAN)', 'CANCEL THE SHOW', 'KEEP GOING. AS ME.', 'SMOKE'];
  if (C2.human >= 70) { await C('...', 'jaw'); await say('(CARL\'S HAND IS ALREADY REACHING FOR THE PEN. IT\'S A VERY STRONG HAND. IT HAS BEEN DOING A LOT OF TRANSFORMING.)'); opts = ['SIGN (AS HU-MAN)', 'SIGN (AS HU-MAN) ANYWAY']; }
  const c = await ask('THE CONTRACT. PAGE 219 IS NO LONGER BLANK.', null, opts);
  const pickd = opts[c];
  if (pickd.startsWith('SIGN')) return endRenewed();
  if (pickd === 'CANCEL THE SHOW') return endCanceled();
  if (pickd === 'SMOKE') return endDream();
  return C2.ticket ? endBelowBelow() : endBoogaloo();
}

// ================= ENDINGS =================
function recordEnding(k) { C2META.ends[k] = (C2META.ends[k] || 0) + 1; C2META.last = k; C2META.human = C2.human; C2META.cleared = 1; if (k === 'renewed') C2META.renewed = 1; if (k !== 'renewed' && C2META.renewed && k !== 'dream') C2META.renewed = 0; saveC2M(); DBG.ending = k; try { localStorage.removeItem('carl2_save'); } catch (e) {} }
async function endRenewed() {
  await CL('...Okay.', 'Nobody tells me what to do.', 'w');
  sfx('power'); for (let i = 0; i < 60; i++) { post.flash = (i & 4) ? .8 : .1; await nextFrame(); } post.flash = 0;
  C2.human = 100; PL.humanT = 99999;
  await say('I have the power.', HU);
  await say('(CARL IS HU-MAN NOW. HE LOOKS GREAT. THE FOCUS GROUP WEEPS.)');
  await say('Great job, genius.', 'CARL', { port: { s: CS.carlPorts.jaw, P: CP.carlPort } });
  if (C2.comp === 'bruce') await say('...Yeah. That\'s how it usually goes.', BR);
  if (C2.comp === 'garf') await say('I\'m putting this in the report. The report says: "he was a lot. Now he\'s not. That\'s worse."', GF);
  recordEnding('renewed');
  await credits2('renewed');
}
async function endCanceled() {
  await C('Cancel it.', 's');
  await say('...You\'d rather have nothing?', HOC);
  await C('I had nothing before. It was fine. It had a parking lot.', 's');
  music(null); for (let i = 0; i < 4; i++) { sfx('switch'); post.fade = (i + 1) / 4; await wait(20); }
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['CARL 2', '', 'CANCELED AFTER ONE SEASON.'], 170, { fg: UI.dim });
  post.legacy = 1; LEGACY_AUDIO = true; music('canceled');
  let t = 0; scene = { update() { t++; }, draw() { cls(hex('#101818')); for (let i = 0; i < 40; i++) pset((i * 67) % W, (i * 31) % 110, WHITE); rectF(0, 150, W, 74, hex('#3a3a44')); draw(CS.ass[0], 90, 112, CP.ass); draw(CS.carl.d[0], 170, 136, CP.carl); if (C2.comp === 'bruce') draw(CS.shark[0], 196, 142, CP.shark); if (C2.comp === 'garf') draw(CS.garf[2], 196, 136, CP.garf); } };
  await fadeIn(.05);
  await C('It\'s quiet. Good quiet. The lot. Chat\'s still here. Chat\'s always here.', 's');
  if (C2.comp === 'bruce') await say('Every show ends, kid. This one ended on a good night.', BR);
  await C('Space 219. Still mine. Still here. Still wavy, sometimes.', 's');
  recordEnding('canceled'); post.legacy = 0; LEGACY_AUDIO = false;
  await credits2('canceled');
}
async function endBoogaloo() {
  await C('Season three. As me. Nobody gets a note.', 'a');
  await say('...That doesn\'t test well.', HOC);
  await C('I don\'t test well! I\'ve never tested well! I\'m short, I\'m green, I\'m nervous, and I threw a bong at a Linda! TWICE!', 'a');
  laugh('[THE AUDIENCE STANDS UP]');
  await say('The focus group has... reached no consensus.', FG);
  await say('Non-canon.', LG);
  await C('No. Canon. All of it. Even the shark.', 'n');
  if (C2.comp === 'bruce') await say('Thanks, kid.', BR);
  await say('THE COMMITTEE IS CONTAINED. BY THE AUDIENCE. THE AUDIENCE IS VERY LARGE.');
  recordEnding('boogaloo');
  await credits2('boogaloo');
}
async function endBelowBelow() {
  await C('Season three. As me. Nobody gets a—', 'a');
  await wait(40);
  await C('...Hold on.', 's');
  await say('(CARL LOOKS AT THE CLAIM TICKET.)');
  await C('Hold on. Be quiet a second.', 's');
  await C('I have to go. I have to go right now. They just left. They always just left. That means they\'re CLOSE.', 's');
  await say('Carl, we\'re LIVE.', HOC);
  await C('Then everybody gets to watch.', 's');
  music('walkout'); await fadeOut(.04);
  let t = 0, fx = 0;
  scene = { update() { t++; if (held.up || t % 3 === 0) fx++; }, draw() {
    skyD(0, 110, '#241a48', '#ffb66d'); circF(W / 2, 110, 30 - Math.min(20, t / 40), hex('#ffdb92'));
    rectF(0, 110, W, H - 110, hex('#dbb66d')); for (let i = 0; i < 30; i++) { const y = 112 + ((i * 7 + fx) % 110); rectF(W / 2 - 20 + (i % 2) * 12, y, 5, 3, hex('#b6924a')); rectF(W / 2 + 14 + (i % 2) * 10, y + 4, 5, 3, hex('#b6924a')); }
    for (let i = 0; i < 12; i++) { const y = 150 + ((i * 11 + fx) % 70); rectF(W / 2 - 2 + (i % 2) * 5, y, 3, 2, hex('#926d24')); }
    drawScaled(CS.carl.u[(t >> 4) & 1], W / 2 - 16, 150, CP.carl, 2);
  } };
  post.fade = 1; await fadeIn(.03);
  await say('(TWO SETS OF FOOTPRINTS. TALL ONES. FRESH. HEADING INTO THE SUN.)');
  await C('Chat. You still there? Keep talking. Everybody keep talking. They\'re following my voice. I\'m following theirs.', 's');
  await say('(HE WALKS. HE ADDS HIS FOOTPRINTS TO THEIRS. SMALLER. CLOSE BEHIND.)');
  await wait(200);
  await fadeOut(.03); scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['THE SUPER-16 GENERATION IS OVER.'], 170, { fg: UI.dim });
  await showCard(['HE LEFT LAST.'], 170, { fg: WHITE });
  recordEnding('belowbelow');
  await credits2('belowbelow');
}
async function endDream() {
  await C('...Hold on. Hold on. I need a second.', 'h');
  sfx('crowd'); for (let i = 0; i < 120; i++) { post.wave = i / 12; post.flash = i / 120; await nextFrame(); } post.wave = 0;
  scene = { draw() { cls(WHITE); } }; post.flash = 0; await wait(60);
  post.legacy = 1; LEGACY_AUDIO = true; setF2('dreamgreen');
  scene = { draw() { cls(hex('#101818')); rectF(0, 0, W, H, hex('#306230')); rectF(40, 40, 240, 140, hex('#8bac0f')); drawScaled(LEGACY.carl, 150, 110, LEGPAL, 2); } };
  await wait(60);
  await say('...', 'CARL');
  await say('...Chat. I had the weirdest dream.', 'CARL');
  await say('There was a shark. And a guy with my hat. And I was in color. Everything was so loud.', 'CARL');
  sfx('static'); await say('...[[[[[... can you hear us...?', 'VOICE', { slow: 1 });
  await say('...Of course.', 'CARL');
  recordEnding('dream');
  await credits2('dream');
  post.legacy = 0; LEGACY_AUDIO = false;
}
async function credits2(k) {
  music(k === 'renewed' ? 'human' : k === 'canceled' || k === 'dream' ? 'canceled' : 'credits');
  const L = [k === 'renewed' ? 'CARL 2 (AND 3)' : 'CARL 2', 'HU-MAN BOOGALOO', '', '',
    'CARL', k === 'renewed' ? '...HU-MAN' : '...STILL NOT HIS NAME', '', 'HU-MAN', '...A FOCUS GROUP', '', 'BRUCE', '...A SHARK. JUMPED.', '', 'JB GARFIELD', '...JUSTICE, BASICALLY', '',
    'CEO LINDA', '...LICENSED', '', 'LINDA LITE', '...A LITTLE LESS', '', 'SPOOKY GHOST', '...FRONT PAGE', '', 'THE HEAD OF CONTENT', '...CONTAINED', '', 'THE FOCUS GROUP', '...NO CONSENSUS', '',
    'LEGAL', '...PAGE 219', '', 'COMRADE CARL', '...NON-CANON', '', 'NEW FACE', '...WHAT COULD HAPPEN', '', PERMA_YOKO ? 'THE EMPRESS' : 'YOKO', '...WHAT HAPPENED', '', 'PEE KID', '...ASKED', '',
    'ROBO MALL COP', '...WITHDRAWN', '', 'THE HITCHHIKER', '...HOUR NINE', '', 'THE TWO TALL ONES', k === 'belowbelow' ? '...JUST AHEAD' : '...JUST MISSED', '', 'SPECIAL THANKS', 'CHAT', '', 'AND YOU', '', '', '',
    PUBLISHER, PUBLISHER === 'YOKO LTD.' ? 'A SUBSIDIARY OF HER' : 'THE PRETEND COMPANY', PUBLISHER === 'YOKO LTD.' ? '' : 'A REAL COMPANY', '', '(C)1999', '', 'THE LAST GAME FOR THE SUPER-16', '', '', 'THANK YOU FOR PLAYING'];
  let y = H + 10; DBG.credits = 1;
  const col = k === 'dream' || k === 'canceled' ? hex('#9bbc0f') : k === 'renewed' ? hex('#ffdb49') : WHITE;
  scene = { draw() { cls(k === 'renewed' ? hex('#241000') : BLACK); L.forEach((l, i) => { const yy = y + i * 12; if (yy > -8 && yy < H) ctext(l, yy, l === 'CARL' || l === 'AND YOU' ? hex('#6dff24') : col); }); if (k === 'renewed') drawScaled(CS.human.d[(frame >> 5) & 1], 16, 150, CP.human, 2); else if (k !== 'dream' && k !== 'canceled') drawScaled(CS.carl.d[(frame >> 5) & 1], 20, 170, CP.carl, 2); } };
  post.fade = 0; post.legacy = 0;
  while (y > -L.length * 12 + 60) { y -= held.start || held.a ? 3 : .6; await nextFrame(); }
  await wait(120); music(null); await fadeOut(.04);
  scene = { draw() { cls(BLACK); } }; post.fade = 0; DBG.credits = 0;
  if (k === 'renewed') { await showCard(['CARL 3: HU-MAN 3000'], 150, { fg: hex('#ffdb49'), sc: 2 }); await showCard(['COMING SOON.'], 100, { fg: UI.dim }); await showCard(['CARL WILL REMEMBER THAT.'], 120, { fg: WHITE }); sfx('glitch'); await showCard(['HU-MAN WILL NOT.'], 120, { fg: hex('#ffdb49') }); }
  else if (k === 'belowbelow') {
    await showCard(['CARL WILL REMEMBER THAT.'], 170, { fg: WHITE });
    let t = 0; scene = { update() { t++; }, draw() { cls(hex('#101014')); rectF(0, 120, W, 104, hex('#2c2c36')); for (let x = 20; x < W; x += 60) rectF(x, 130, 2, 60, hex('#ffdb24')); text('219', 64, 200, hex('#ffdb24')); text('220', 124, 200, hex('#ffdb24')); rectF(116, 110, 44, 14, t > 90 ? hex('#6dff24') : hex('#242424')); text('FAMILY', 120, 113, t > 90 ? hex('#101010') : hex('#494949')); } };
    await wait(260);
  } else if (k === 'dream') await showCard(['TO BE CONTINUED?'], 170, { fg: hex('#9bbc0f') });
  else await showCard(['CARL WILL REMEMBER THAT.'], 170, { fg: WHITE });
  post.legacy = 0; LEGACY_AUDIO = false; delete C2.flags.dreamgreen;
  await fadeOut(.05); run(titleScreen);
}

// ================= delivery recipients =================
async function copNPCTalk() {
  const MC = 'MALL COP';
  if (dq(0) === 1) { await C('Pretzels. From Dispatch. For you. Somebody at Prop Pills cares about you.', 'n'); await say('...Nobody\'s ever delivered TO me. I\'m usually the one people get delivered past.', MC); await say('Here. Confiscated it last week. Bong. Big one. Not THE big one. A big one.', MC); dqDone(0); C2.bux += 40; giveBong(genBong(C2.ep + 1, { size: 'BIG' })); return; }
  await say(pick(['Sir. I\'m off duty. I\'m never off duty.', 'I heard they made me a robot in one of the episodes. I don\'t watch the show.', 'Behind the rope, sir. There\'s no rope. It\'s a mindset.']), MC);
}
async function facelessTalk2() {
  if (F2('faceDone')) return say(pick(['IT FITS. IT FITS SO WELL.', 'I CAN SEE YOU NOW. YOU\'RE SHORTER THAN I THOUGHT.']), 'FACELESS');
  if (dq(1) === 1 && F2('hasFace')) {
    await C('Here. I found your face. It was at lost and found. Where faces go.', 'n');
    sfx('glitch'); setF2('faceDone'); dqDone(1); await wait(30);
    await say('THANK YOU. IT FITS.', 'FACELESS');
    await say('IT USED TO BE YOURS.', 'FACELESS', { slow: 1 });
    await C('It— what? No. I have my face. Look. Face. Right here. Chat, I have a face, right? Tell me I have a face.', 'w');
    addHuman(-3, 'face'); giveBong(genBong(C2.ep + 1, { mat: 'LEGACY' })); return;
  }
  await say('HAVE YOU SEEN MY FACE? I HAD IT WHEN I CAME IN. MAYBE LOST AND FOUND.', 'FACELESS');
}

// continuing a save made in the finale's studio: start the show again
