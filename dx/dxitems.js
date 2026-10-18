'use strict';
// ================= DEUS EX NEVADA: items, weapons, the inventory grid =================
// skills: pistol rifle heavy lowtech demo
const WPN = {
  pistol: { name: '10MM PISTOL', skill: 'pistol', dmg: 14, rate: 22, clip: 6, ammo: ['10mm'], spread: .09, range: 14, noise: 9, reload: 70, len: 5, w: 2, h: 1, mods: 1, desc: 'Standard FATCO sidearm. The grip has a sticker that says THIS IS A PROP. It is not a prop.' },
  spistol: { name: 'STEALTH PISTOL', skill: 'pistol', dmg: 9, rate: 14, clip: 10, ammo: ['10mm'], spread: .1, range: 12, noise: 2, reload: 60, len: 5, w: 2, h: 1, mods: 1, desc: 'Integrated silencer. Quiet enough that Carl keeps asking if it fired.' },
  xbow: { name: 'MINI-CROSSBOW', skill: 'pistol', dmg: 20, rate: 40, clip: 4, ammo: ['tdart', 'dart', 'fdart'], spread: .05, range: 12, noise: 1, reload: 70, proj: 'dart', len: 5, w: 2, h: 1, mods: 1, desc: 'Wrist crossbow. Tranquilizer darts drop people after a few seconds. Flare darts light dark rooms.' },
  rifle: { name: 'ASSAULT RIFLE', skill: 'rifle', dmg: 6, rate: 6, clip: 30, ammo: ['762', '20mm'], spread: .13, range: 16, noise: 14, reload: 90, auto: 1, len: 8, thick: 1, w: 3, h: 1, mods: 1, desc: 'FATCO-issue automatic. The second ammo type is a 20mm grenade launched from under the barrel.' },
  shotgun: { name: 'SAWED-OFF SHOTGUN', skill: 'rifle', dmg: 5, pellets: 6, rate: 34, clip: 4, ammo: ['shell', 'sabot'], spread: .2, range: 8, noise: 13, reload: 100, len: 6, thick: 1, w: 3, h: 1, mods: 1, desc: 'Close-range crowd control. Sabot rounds go through armor and bots.' },
  sniper: { name: 'SNIPER RIFLE', skill: 'rifle', dmg: 32, rate: 70, clip: 6, ammo: ['3006'], spread: .02, range: 30, noise: 16, reload: 120, scope: 1, len: 10, thick: 1, w: 4, h: 1, mods: 1, desc: 'Long rifle with a 4x scope. Hold still and the reticle closes.' },
  gep: { name: 'G.E.P. GUN', skill: 'heavy', dmg: 60, rate: 60, clip: 1, ammo: ['rocket', 'wprocket'], spread: .04, range: 22, noise: 18, reload: 90, proj: 'rocket', len: 10, thick: 1, heavy: 1, w: 4, h: 2, mods: 1, desc: 'Guided Explosive Projectile. Doors, bots, problems.' },
  law: { name: 'L.A.W.', skill: 'heavy', dmg: 90, rate: 60, clip: 1, ammo: ['law'], spread: .04, range: 22, noise: 18, reload: 1, proj: 'rocket', len: 10, thick: 1, heavy: 1, oneShot: 1, w: 4, h: 1, desc: 'Single-use rocket launcher. Throw it away after.' },
  flame: { name: 'FLAMETHROWER', skill: 'heavy', dmg: 3, rate: 3, clip: 100, ammo: ['fuel'], spread: .2, range: 5, noise: 8, reload: 120, proj: 'flame', auto: 1, len: 8, thick: 1, heavy: 1, w: 3, h: 2, desc: 'Napalm. Sets people and furniture on fire.' },
  plasma: { name: 'PLASMA RIFLE', skill: 'heavy', dmg: 30, rate: 30, clip: 12, ammo: ['plasma'], spread: .07, range: 18, noise: 14, reload: 110, proj: 'plasma', splash: 1.4, len: 9, thick: 1, heavy: 1, w: 3, h: 2, mods: 1, desc: 'Experimental. Every shot is a small sun.' },
  knife: { name: 'COMBAT KNIFE', skill: 'lowtech', dmg: 12, rate: 16, melee: 1, reach: 1.1, noise: 1, len: 3, w: 1, h: 1, desc: 'Quiet. Carl holds it like it might bite him.' },
  baton: { name: 'BATON', skill: 'lowtech', dmg: 9, rate: 24, melee: 1, reach: 1.2, noise: 2, stun: 1, nonlethal: 1, len: 5, w: 2, h: 1, desc: 'Nonlethal. Knocks people out, eventually.' },
  crowbar: { name: 'CROWBAR', skill: 'lowtech', dmg: 13, rate: 26, melee: 1, reach: 1.3, noise: 3, len: 6, w: 2, h: 1, desc: 'Opens crates. Breaks glass. Starts arguments.' },
  prod: { name: 'RIOT PROD', skill: 'lowtech', dmg: 16, rate: 30, melee: 1, reach: 1.2, noise: 3, stun: 1, nonlethal: 1, clip: 4, ammo: ['prodcell'], reload: 70, len: 6, col: '#40a0ff', w: 2, h: 1, desc: 'Electric. Instant knockout at close range. Uses prod charger cells.' },
  bong: { name: "THE DRAGON'S BONG", skill: 'lowtech', dmg: 40, rate: 22, melee: 1, reach: 1.6, noise: 4, len: 8, col: '#60ffa0', glowW: 1, w: 1, h: 2, desc: 'A glass blade forged in Akihabara to look like a bong, or a bong forged to cut like a blade. Nobody agrees. It hums.' },
  smoke: { name: 'SMOKE CANNON', skill: 'lowtech', dmg: 0, rate: 12, clip: 50, ammo: ['weed'], range: 4, noise: 1, proj: 'smoke', auto: 1, nonlethal: 1, reload: 60, len: 5, col: '#70c070', w: 2, h: 1, desc: "Carl's own invention: a bong with a leaf blower. Humans cough, tear up and lose track of him. Bots don't care." },
  lam: { name: 'L.A.M.', skill: 'demo', nade: 'lam', dmg: 70, rate: 40, clip: 1, ammo: ['lam'], noise: 1, thrown: 1, w: 1, h: 1, desc: 'Lightweight Attack Munition. Throw it, or press it to a wall as a proximity mine.' },
  gasnade: { name: 'GAS GRENADE', skill: 'demo', nade: 'gas', dmg: 0, rate: 40, clip: 1, ammo: ['gasnade'], noise: 3, thrown: 1, nonlethal: 1, w: 1, h: 1, desc: 'Tear gas. Humans cough until they drop.' },
  empnade: { name: 'EMP GRENADE', skill: 'demo', nade: 'emp', dmg: 0, rate: 40, clip: 1, ammo: ['empnade'], noise: 3, thrown: 1, w: 1, h: 1, desc: 'Disables bots, cameras, turrets and bioelectric energy.' },
  scramnade: { name: 'SCRAMBLER GRENADE', skill: 'demo', nade: 'scram', dmg: 0, rate: 40, clip: 1, ammo: ['scramnade'], noise: 3, thrown: 1, w: 1, h: 1, desc: 'Scrambles bot IFF. Bots attack their owners for a while.' },
  fists: { name: 'HANDS', skill: 'lowtech', dmg: 4, rate: 22, melee: 1, reach: 1, noise: 1, stun: 1, nonlethal: 1, hide: 1, w: 1, h: 1, desc: 'Small hands.' },
  // npc-only
  npcrifle: { name: 'RIFLE', skill: 'rifle', dmg: 4, rate: 7, clip: 30, spread: .16, range: 14, noise: 14, auto: 1, len: 8, thick: 1, burst: 5 },
  npcpistol: { name: 'PISTOL', skill: 'pistol', dmg: 7, rate: 32, clip: 6, spread: .12, range: 12, noise: 9, len: 5 },
  npcshot: { name: 'SHOTGUN', skill: 'rifle', dmg: 4, pellets: 5, rate: 50, spread: .2, range: 7, noise: 13, len: 6, thick: 1 },
  npcsmg: { name: 'SMG', skill: 'rifle', dmg: 3, rate: 5, spread: .18, range: 11, noise: 12, auto: 1, len: 6, burst: 6 },
  npcbaton: { name: 'BATON', skill: 'lowtech', dmg: 8, rate: 36, melee: 1, reach: 1.1, noise: 2, len: 5 },
  npcknife: { name: 'KNIFE', skill: 'lowtech', dmg: 10, rate: 30, melee: 1, reach: 1, noise: 1, len: 3 },
  npcclaw: { name: 'CLAW', skill: 'lowtech', dmg: 7, rate: 30, melee: 1, reach: 1, noise: 2, hide: 1 },
  npcbite: { name: 'BITE', skill: 'lowtech', dmg: 5, rate: 26, melee: 1, reach: .9, noise: 2, hide: 1 },
  npcgep: { name: 'ROCKETS', skill: 'heavy', dmg: 40, rate: 120, spread: .06, range: 18, noise: 18, proj: 'rocket', len: 10, thick: 1 },
  npcflame: { name: 'FLAMER', skill: 'heavy', dmg: 2, rate: 4, spread: .22, range: 5, noise: 8, proj: 'flame', auto: 1, len: 8, thick: 1, burst: 20 },
  npcplasma: { name: 'PLASMA', skill: 'heavy', dmg: 18, rate: 50, spread: .08, range: 16, noise: 14, proj: 'plasma', splash: 1.2, len: 9, thick: 1 },
  botgun: { name: 'BOT GUN', skill: 'rifle', dmg: 4, rate: 6, spread: .12, range: 14, noise: 14, auto: 1, len: 4, hide: 1, burst: 8 },
  turretgun: { name: 'TURRET', skill: 'rifle', dmg: 4, rate: 5, spread: .1, range: 16, noise: 15, auto: 1, hide: 1 },
  prodnpc: { name: 'PROD', skill: 'lowtech', dmg: 10, rate: 40, melee: 1, reach: 1.1, noise: 3, stun: 1, len: 6, col: '#40a0ff' },
  spiderzap: { name: 'ZAP', skill: 'heavy', dmg: 6, rate: 50, spread: .1, range: 6, noise: 5, proj: 'zap', hide: 1 },
  lindabeam: { name: 'BEAM', skill: 'heavy', dmg: 8, rate: 40, spread: .05, range: 14, noise: 6, proj: 'plasma', hide: 1, splash: .6 },
};
const AMMO = {
  '10mm': { name: '10MM AMMO', box: 6 }, '762': { name: '7.62MM AMMO', box: 20 }, '20mm': { name: '20MM HE', box: 2, he: 1 }, shell: { name: 'BUCKSHOT', box: 8 }, sabot: { name: 'SABOT SHELLS', box: 6, pierce: 1 },
  '3006': { name: '30.06 AMMO', box: 6 }, tdart: { name: 'TRANQ DARTS', box: 4, tranq: 1 }, dart: { name: 'DARTS', box: 4 }, fdart: { name: 'FLARE DARTS', box: 4, flare: 1 },
  rocket: { name: 'ROCKETS', box: 2 }, wprocket: { name: 'WP ROCKETS', box: 2, fire: 1 }, law: { name: 'L.A.W.', box: 1 }, fuel: { name: 'NAPALM CAN', box: 50 }, plasma: { name: 'PLASMA CLIP', box: 12 },
  prodcell: { name: 'PROD CHARGER', box: 4 }, weed: { name: 'WEED (BAG)', box: 25 }, lam: { name: 'L.A.M.', box: 1 }, gasnade: { name: 'GAS GRENADE', box: 1 }, empnade: { name: 'EMP GRENADE', box: 1 }, scramnade: { name: 'SCRAMBLER GRENADE', box: 1 },
};
const ITEMS = {
  medkit: { name: 'MEDKIT', w: 1, h: 1, stack: 15, use: () => useMed(30), desc: 'Heals every body part. Medicine skill makes it heal more.' },
  biocell: { name: 'BIOELECTRIC CELL', w: 1, h: 1, stack: 30, use: () => useBio(25), desc: 'Recharges augmentation energy.' },
  lockpick: { name: 'LOCKPICK', w: 1, h: 1, stack: 20, tool: 'pick', desc: 'Picks mechanical locks. Equip and use on a door.' },
  multitool: { name: 'MULTITOOL', w: 1, h: 1, stack: 20, tool: 'multi', desc: 'Bypasses keypads, cameras, turrets, laser tripwires and alarm panels.' },
  soda: { name: 'PROP COLA', w: 1, h: 1, stack: 10, use: () => useFood(2, 'soda'), desc: 'Tastes like a commercial for itself.' },
  candy: { name: 'CANDY BAR', w: 1, h: 1, stack: 10, use: () => useFood(2, 'candy'), desc: 'Two percent chocolate.' },
  chips: { name: 'SOY CHIPS', w: 1, h: 1, stack: 10, use: () => useFood(3, 'chips'), desc: 'The bag is mostly air. The air is mostly soy.' },
  joint: { name: 'JOINT', w: 1, h: 1, stack: 10, use: () => useJoint(), desc: 'Restores a little health and a lot of bioelectric energy. Carl swears it is medicinal. It is, in this game.' },
  liquor: { name: 'MALT LIQUOR', w: 1, h: 1, stack: 10, use: () => useLiquor(), desc: 'Heals a little. The screen will tilt.' },
  pills: { name: 'PROP PILLS', w: 1, h: 1, stack: 20, use: () => usePills(), desc: 'Recalled for being more effective than placebo. Cures the Buffering. Heals and steadies your aim for a minute.' },
  binoc: { name: 'BINOCULARS', w: 1, h: 1, use: () => toggleBinoc(), desc: 'Look further. Hold still.' },
  rebreather: { name: 'REBREATHER', w: 1, h: 1, charge: 100, use: () => toggleCharged('rebreather'), desc: 'Breathe underwater and in gas.' },
  hazmat: { name: 'HAZMAT SUIT', w: 2, h: 2, charge: 100, use: () => toggleCharged('hazmat'), desc: 'Protects from gas, fire and radiation while it lasts.' },
  armor: { name: 'BALLISTIC ARMOR', w: 2, h: 2, charge: 100, use: () => toggleCharged('armor'), desc: 'Halves bullet damage while it lasts.' },
  camo: { name: 'THERMOPTIC CAMO', w: 1, h: 1, charge: 100, use: () => toggleCharged('camo'), desc: 'Invisible to people and machines. Burns out fast.' },
  goggles: { name: 'TECH GOGGLES', w: 1, h: 1, charge: 100, use: () => toggleCharged('goggles'), desc: 'See in the dark.' },
  flare: { name: 'FLARE', w: 1, h: 1, stack: 10, use: () => throwFlare(), desc: 'Light a room for a minute.' },
  aug: { name: 'AUGMENTATION CANISTER', w: 1, h: 1, stack: 1, desc: 'Contains one of two augmentations. Install at a medical bot.' },
  upg: { name: 'AUG UPGRADE CANISTER', w: 1, h: 1, stack: 10, use: () => openScreen('augs'), desc: 'Raises an installed augmentation one level.' },
  mod_acc: { name: 'MOD: ACCURACY', w: 1, h: 1, mod: 'acc', desc: 'Weapon modification. Drag onto a weapon.' }, mod_clip: { name: 'MOD: CLIP', w: 1, h: 1, mod: 'clip', desc: 'Weapon modification: bigger magazine.' },
  mod_rng: { name: 'MOD: RANGE', w: 1, h: 1, mod: 'rng', desc: 'Weapon modification: longer range.' }, mod_rel: { name: 'MOD: RELOAD', w: 1, h: 1, mod: 'rel', desc: 'Weapon modification: faster reload.' },
  mod_rec: { name: 'MOD: RECOIL', w: 1, h: 1, mod: 'rec', desc: 'Weapon modification: less spread while firing.' }, mod_las: { name: 'MOD: LASER', w: 1, h: 1, mod: 'las', desc: 'Weapon modification: laser sight, accurate on the move.' },
  mod_sil: { name: 'MOD: SILENCER', w: 1, h: 1, mod: 'sil', desc: 'Weapon modification: much quieter.' }, mod_sco: { name: 'MOD: SCOPE', w: 1, h: 1, mod: 'sco', desc: 'Weapon modification: zoom.' },
  warp: { name: 'A.S.S. PART', w: 1, h: 1, stack: 9, desc: "A piece of the A.S.S.'s warp assembly. Carl recognizes it the way you recognize your own handwriting." },
  idcard: { name: 'FATCO ID CARD', w: 1, h: 1, use: () => readText('idcard'), desc: 'SPECIES: HUMAN. Stamped. Laminated. Carl looks at it more than he should.' },
  tp: { name: 'TP ROLL', w: 1, h: 1, stack: 10, use: () => useFood(1, 'tp'), desc: 'Two-ply. Doesn\'t do anything. Pretend Co. will not confirm who he is.' },
  slip: { name: 'TRANSIT SLIP', w: 1, h: 1, use: () => readText('slip'), desc: 'A facility slip with a stamp: STILL IN TRANSIT.' },
  cure: { name: 'BUFFERING CURE (SCHEMATIC)', w: 1, h: 1, desc: 'The Prop Press pattern. Unhoardable once it leaves this room.' },
};
for (const k in WPN) if (!k.startsWith('npc') && !['botgun', 'turretgun', 'prodnpc', 'spiderzap', 'lindabeam', 'fists'].includes(k)) ITEMS['w_' + k] = { name: WPN[k].name, w: WPN[k].w, h: WPN[k].h, weapon: k, desc: WPN[k].desc };
for (const k in AMMO) ITEMS['a_' + k] = { name: AMMO[k].name, w: 1, h: 1, ammo: k, desc: 'Ammunition.' };
ITEMS.credits = { name: 'CREDIT CHIT', w: 1, h: 1, credits: 1, desc: 'Pretend Dollars.' };

// ---------- the grid ----------
const GRID_W = 8, GRID_H = 5;
function invFits(x, y, w, h, ignore) {
  if (x < 0 || y < 0 || x + w > GRID_W || y + h > GRID_H) return false;
  for (const it of P.inv) { if (it === ignore) continue; const d = ITEMS[it.id]; if (x < it.x + d.w && x + w > it.x && y < it.y + d.h && y + h > it.y) return false; }
  return true;
}
function invFind(id) { return P.inv.find(it => it.id === id); }
function invCount(id) { const it = invFind(id); return it ? (it.n || 1) : 0; }
// add an item; returns true if it fit. Weapons go to the belt; ammo and credits go to their pools.
function giveItem(id, n = 1, quiet) {
  const d = ITEMS[id]; if (!d) { console.warn('no item', id); return false; }
  if (d.credits) { P.cred += n; if (!quiet) msg(fmtc(n) + ' credits'); return true; }
  if (d.ammo) { P.ammo[d.ammo] = (P.ammo[d.ammo] || 0) + n * (AMMO[d.ammo].box || 1); if (!quiet) msg(AMMO[d.ammo].name + ' x' + n * AMMO[d.ammo].box); return true; }
  if (d.weapon) { const have = P.inv.find(it => it.id === id); const w = WPN[d.weapon];
    if (have) { if (w.ammo) { const a = w.ammo[0]; P.ammo[a] = (P.ammo[a] || 0) + Math.max(2, (w.clip || 1)); if (!quiet) msg('Took the ammo: ' + AMMO[a].name); } return true; }
    if (w.thrown) { const a = w.ammo[0]; P.ammo[a] = (P.ammo[a] || 0) + n; } }
  if (d.stack) { const it = invFind(id); if (it) { const add = Math.min(n, d.stack - (it.n || 1)); it.n = (it.n || 1) + add; if (!quiet) msg(d.name + (it.n > 1 ? ' (' + it.n + ')' : '')); return add > 0 || true; } }
  for (let y = 0; y < GRID_H; y++) for (let x = 0; x < GRID_W; x++) if (invFits(x, y, d.w, d.h)) {
    const it = { id, x, y, n: d.stack ? Math.min(n, d.stack) : 1, uid: UID++ };
    if (d.weapon) { const w = WPN[d.weapon]; it.clip = w.clip || 0; it.mods = {}; it.at = w.ammo ? 0 : -1; if (w.thrown) it.n = 1; }
    if (d.charge) it.charge = d.charge;
    P.inv.push(it); autoBelt(it); if (!quiet) msg(d.name + (it.n > 1 ? ' (' + it.n + ')' : '')); return true; }
  if (!quiet) { msg('NO ROOM: ' + d.name); chatSay(pick(['inventory tetris time', 'carl drop the crowbar lol', 'NO ROOM', 'you have 4 sodas carl']), 1); }
  return false;
}
function removeItem(it, n = 1) { if (it.n > n) { it.n -= n; return; } P.inv.splice(P.inv.indexOf(it), 1); for (let k = 0; k < 10; k++) if (P.belt[k] === it.uid) P.belt[k] = null; if (P.held === it) P.held = null; }
function autoBelt(it) { const d = ITEMS[it.id]; if (!(d.weapon || d.tool || it.id === 'medkit' || it.id === 'biocell')) return; if (P.belt.includes(it.uid)) return; for (let k = 1; k <= 10; k++) { const s = k % 10; if (!P.belt[s]) { P.belt[s] = it.uid; return; } } }
const itemByUid = uid => P.inv.find(it => it.uid === uid);
function heldWeapon() { const it = P.held; return it && ITEMS[it.id].weapon ? it : null; }

// ---------- icons ----------
function buildIcons() {
  const C = (id, w, h, fn) => { ICON[id] = outline(offscreen(w * 26, h * 16, fn)); };
  const gun = (w, h, body, len, grip, extra) => () => { const y = h * 8 - 2; rectF(3, y - 2, len, 4, hex(body)); rectF(3, y - 2, len, 1, shadeOf(hex(body), 1.4)); rectF(5, y + 2, 4, grip, hex('#2a2018')); if (extra) extra(y); };
  C('_', 1, 1, () => { rectF(6, 4, 14, 8, hex('#5a5c64')); text('?', 10, 5, WHITE, 0); });
  C('w_pistol', 2, 1, gun(2, 1, '#3a3c44', 22, 6, y => rectF(20, y - 3, 3, 2, hex('#c8c8c8'))));
  C('w_spistol', 2, 1, gun(2, 1, '#2a2c34', 18, 6, y => rectF(20, y - 2, 20, 4, hex('#1a1a20'))));
  C('w_xbow', 2, 1, () => { rectF(10, 6, 26, 3, hex('#4a3a2a')); lineF(30, 2, 34, 8, hex('#8a8a92')); lineF(30, 13, 34, 8, hex('#8a8a92')); lineF(30, 2, 30, 13, hex('#c8c8d0')); rectF(12, 9, 4, 5, hex('#2a2018')); });
  C('w_rifle', 3, 1, gun(3, 1, '#3a4234', 60, 6, y => { rectF(34, y + 2, 6, 6, hex('#2a2c24')); rectF(55, y - 4, 8, 2, hex('#1a1a1a')); }));
  C('w_shotgun', 3, 1, gun(3, 1, '#4a3a2a', 50, 6, y => rectF(25, y - 2, 30, 2, hex('#3a3c44'))));
  C('w_sniper', 4, 1, gun(4, 1, '#3a3428', 90, 6, y => rectF(30, y - 6, 20, 3, hex('#1a1a20'))));
  C('w_gep', 4, 2, () => { rectF(4, 10, 92, 10, hex('#4a5a3a')); rectF(4, 10, 92, 2, hex('#7a8a6a')); rectF(30, 20, 6, 8, hex('#2a2a22')); rectF(50, 4, 16, 6, hex('#2a2a22')); ellF(96, 15, 4, 6, hex('#1a1a14')); });
  C('w_law', 4, 1, () => { rectF(4, 4, 92, 7, hex('#6a7a3a')); rectF(4, 4, 92, 1, hex('#9aaa6a')); rectF(40, 11, 4, 4, hex('#2a2a22')); });
  C('w_flame', 3, 2, () => { rectF(4, 8, 66, 8, hex('#5a4a3a')); ellF(14, 22, 10, 8, hex('#a03020')); rectF(66, 6, 8, 12, hex('#3a3a3a')); });
  C('w_plasma', 3, 2, () => { rectF(4, 10, 66, 10, hex('#4a4a6a')); rectF(14, 6, 30, 4, hex('#30e0ff')); rectF(40, 20, 6, 8, hex('#2a2a3a')); });
  C('w_knife', 1, 1, () => { rectF(4, 7, 8, 3, hex('#2a2018')); polyF([[12, 6], [24, 8], [12, 10]], hex('#c8ccd4')); });
  C('w_baton', 2, 1, () => { rectF(4, 6, 44, 4, hex('#1a1a20')); rectF(4, 6, 10, 4, hex('#3a3a40')); });
  C('w_crowbar', 2, 1, () => { rectF(6, 7, 38, 3, hex('#c02020')); lineF(44, 8, 48, 4, hex('#c02020')); lineF(6, 8, 3, 12, hex('#c02020')); });
  C('w_prod', 2, 1, () => { rectF(4, 6, 36, 5, hex('#3a3a50')); lineF(40, 6, 48, 4, hex('#40a0ff')); lineF(40, 10, 48, 12, hex('#40a0ff')); });
  C('w_bong', 1, 2, () => { rectF(10, 4, 6, 22, hex('#40c080')); rectF(11, 4, 2, 22, hex('#a0ffc0')); ellF(13, 25, 7, 4, hex('#30a070')); rectF(16, 18, 6, 2, hex('#30a070')); rectF(9, 2, 8, 2, hex('#e0ffe0')); });
  C('w_smoke', 2, 1, () => { rectF(4, 6, 30, 6, hex('#3a6a3a')); ellF(38, 9, 8, 6, hex('#2a5a2a')); for (let i = 0; i < 4; i++) blob(44 + i * 2, 4 + i, 2, 2, shadeTones('#a0c0a0')); });
  C('w_lam', 1, 1, () => { rectF(6, 3, 14, 10, hex('#4a5040')); rectF(8, 5, 4, 2, hex('#ff3030')); rectF(14, 9, 4, 2, hex('#30ff30')); });
  C('w_gasnade', 1, 1, () => { ellF(13, 9, 6, 6, hex('#5a7a3a')); rectF(11, 2, 4, 3, hex('#8a8a8a')); });
  C('w_empnade', 1, 1, () => { ellF(13, 9, 6, 6, hex('#3a5aaa')); rectF(11, 2, 4, 3, hex('#8a8a8a')); lineF(9, 9, 17, 9, hex('#80e0ff')); });
  C('w_scramnade', 1, 1, () => { ellF(13, 9, 6, 6, hex('#8a3aaa')); rectF(11, 2, 4, 3, hex('#8a8a8a')); });
  C('medkit', 1, 1, () => { rectF(4, 3, 18, 11, hex('#e8e8f0')); rectF(11, 5, 4, 7, hex('#e02020')); rectF(8, 7, 10, 3, hex('#e02020')); });
  C('biocell', 1, 1, () => { rectF(8, 2, 10, 12, hex('#2a3a5a')); rectF(9, 4, 8, 8, hex('#40e0ff')); rectF(11, 1, 4, 2, hex('#a0a0a0')); });
  C('lockpick', 1, 1, () => { rectF(4, 7, 10, 3, hex('#5a4a3a')); lineF(14, 8, 22, 8, hex('#c8c8d0')); lineF(22, 8, 23, 6, hex('#c8c8d0')); });
  C('multitool', 1, 1, () => { rectF(5, 5, 16, 7, hex('#c83020')); rectF(6, 6, 6, 2, hex('#ffe060')); lineF(21, 8, 24, 8, hex('#c8c8d0')); });
  C('soda', 1, 1, () => { rectF(9, 2, 8, 12, hex('#c02020')); rectF(9, 6, 8, 3, WHITE); });
  C('candy', 1, 1, () => { rectF(4, 5, 18, 6, hex('#5a3a20')); rectF(8, 5, 10, 6, hex('#e0c040')); });
  C('chips', 1, 1, () => { rectF(6, 2, 14, 12, hex('#e0a020')); rectF(6, 6, 14, 3, hex('#3060c0')); });
  C('joint', 1, 1, () => { lineF(4, 10, 20, 6, hex('#f0f0e8')); lineF(4, 11, 20, 7, hex('#d8d8c8')); pset(21, 6, hex('#ff6020')); blob(23, 3, 2, 2, shadeTones('#a0a0a0')); });
  C('liquor', 1, 1, () => { rectF(9, 5, 8, 9, hex('#6a4a1a')); rectF(11, 1, 4, 4, hex('#6a4a1a')); rectF(9, 8, 8, 3, hex('#e0d0a0')); });
  C('pills', 1, 1, () => { rectF(8, 3, 10, 11, hex('#f0f0f0')); rectF(8, 3, 10, 3, hex('#ff70b0')); text('P', 10, 7, hex('#ff3090'), 0); });
  C('binoc', 1, 1, () => { ellF(8, 9, 5, 4, hex('#2a2a30')); ellF(18, 9, 5, 4, hex('#2a2a30')); rectF(8, 7, 10, 3, hex('#3a3a40')); });
  C('rebreather', 1, 1, () => { ellF(13, 9, 8, 5, hex('#3a4a5a')); rectF(9, 7, 8, 3, hex('#80c0e0')); });
  C('hazmat', 2, 2, () => { rectF(14, 6, 24, 20, hex('#e0c020')); ellF(26, 6, 8, 6, hex('#e0c020')); rectF(20, 4, 12, 4, hex('#406080')); });
  C('armor', 2, 2, () => { rectF(14, 4, 24, 24, hex('#3a4a3a')); rectF(14, 4, 24, 3, hex('#5a6a5a')); rectF(22, 4, 8, 6, hex('#1a1a1a')); });
  C('camo', 1, 1, () => { for (let i = 0; i < 40; i++) pset(5 + hash(i, 1) * 16, 3 + hash(i, 2) * 10, i & 1 ? hex('#60c0ff') : hex('#a0e0ff')); });
  C('goggles', 1, 1, () => { ellF(8, 8, 4, 3, hex('#30ff60')); ellF(18, 8, 4, 3, hex('#30ff60')); rectF(3, 7, 20, 1, INK); });
  C('flare', 1, 1, () => { rectF(4, 7, 16, 3, hex('#e02020')); pset(20, 8, hex('#ffe060')); });
  C('aug', 1, 1, () => { rectF(8, 1, 10, 14, hex('#c8d0d8')); rectF(9, 3, 8, 10, hex('#40c0ff')); rectF(10, 6, 6, 4, WHITE); });
  C('upg', 1, 1, () => { rectF(8, 1, 10, 14, hex('#d0c040')); rectF(9, 3, 8, 10, hex('#ffe080')); text('+', 10, 5, hex('#806000'), 0); });
  for (const m of ['acc', 'clip', 'rng', 'rel', 'rec', 'las', 'sil', 'sco']) C('mod_' + m, 1, 1, () => { rectF(4, 3, 18, 10, hex('#3a3c44')); rectF(4, 3, 18, 2, hex('#6a6c74')); text(m.slice(0, 3).toUpperCase(), 4, 6, hex('#ffd040'), 0); });
  C('warp', 1, 1, () => { blob(13, 8, 7, 6, [hex('#205040'), hex('#30a070'), hex('#60ffa0'), WHITE]); rectF(5, 7, 16, 2, hex('#e0ffe8')); });
  C('idcard', 1, 1, () => { rectF(3, 3, 20, 11, hex('#e8e8e0')); rectF(5, 5, 6, 6, hex('#5ac8a8')); rectF(13, 6, 8, 1, INK); rectF(13, 9, 6, 1, INK); rectF(3, 3, 20, 2, hex('#2050c0')); });
  C('tp', 1, 1, () => { ellF(13, 8, 7, 6, hex('#e8e8ec')); ellF(13, 8, 2, 2, hex('#a8a8b0')); });
  C('slip', 1, 1, () => { rectF(5, 2, 16, 12, hex('#e8e0c8')); rectF(7, 5, 10, 1, INK); rectF(7, 8, 12, 1, INK); rectF(12, 10, 8, 3, hex('#c02020')); });
  C('cure', 1, 1, () => { rectF(4, 2, 18, 12, hex('#103040')); for (let i = 0; i < 5; i++) rectF(6, 4 + i * 2, 4 + hash(i, 9) * 12, 1, hex('#40ffff')); });
  C('seed', 1, 1, () => { rectF(8, 3, 10, 10, hex('#2a1a3a')); rectF(10, 5, 6, 6, hex('#ff70ff')); rectF(9, 13, 2, 2, hex('#d0c040')); rectF(15, 13, 2, 2, hex('#d0c040')); });
  C('credits', 1, 1, () => { rectF(4, 4, 18, 9, hex('#30a060')); text('P$', 7, 5, hex('#e0ffe0'), 0); });
  for (const k in AMMO) if (!ICON['a_' + k]) C('a_' + k, 1, 1, () => { rectF(5, 4, 16, 9, hex(k === 'weed' ? '#3a7a3a' : k === 'plasma' ? '#3a3a7a' : '#6a5a3a')); rectF(5, 4, 16, 2, hex('#a89a7a')); for (let i = 0; i < 4; i++) rectF(7 + i * 3, 7, 2, 4, hex('#e0c060')); });
}
