'use strict';
// ================= DEUS EX NEVADA: the player, the guards, combat, noise, interaction =================
// ---------- teams ----------
// REL[a][b]: -1 hostile, 0 neutral, 1 friendly. The story rewrites it (FATCO turns on Carl on disk 2).
const REL = {};
function rel(a, b, v) { (REL[a] || (REL[a] = {}))[b] = v; (REL[b] || (REL[b] = {}))[a] = v; }
function relOf(a, b) { if (a === b) return 1; return (REL[a] && REL[a][b] !== undefined) ? REL[a][b] : 0; }
function resetRel() { for (const k in REL) delete REL[k];
  rel('player', 'fatco', 1); rel('player', 'ppf', -1); rel('player', 'mj', -1); rel('player', 'miws', -1); rel('player', 'animal', -1); rel('player', 'bot', 0); rel('player', 'civ', 0); rel('player', 'thug', -1);
  rel('fatco', 'ppf', -1); rel('fatco', 'mj', 1); rel('ppf', 'mj', -1); rel('animal', 'civ', -1); rel('animal', 'fatco', -1); rel('animal', 'ppf', -1); rel('thug', 'civ', 0); rel('thug', 'ppf', -1);
  rel('redchat', 'lurker', -1); rel('player', 'redchat', 0); rel('player', 'lurker', 0); rel('player', 'cop', 0); rel('player', 'casino', 0); rel('player', 'tunnel', 0); rel('player', 'gatebox', 0); rel('mj', 'tunnel', -1); rel('mj', 'gatebox', 1); rel('mj', 'miws', 1); rel('fatco', 'miws', 1); }
resetRel();

// ---------- NPC archetypes ----------
const NPCT = {
  fatco: { name: 'FATCO TROOPER', sprite: 'fatco', hp: 60, wpn: 'npcrifle', team: 'fatco', ai: 'guard', speed: 3.4, view: 9, drops: [['a_762', .7], ['medkit', .15], ['a_10mm', .2]], bark: 'fatco' },
  fatcoagent: { name: 'FATCO AGENT', sprite: 'fatcoagent', hp: 70, wpn: 'npcpistol', team: 'fatco', ai: 'guard', speed: 3.4, view: 9, drops: [['a_10mm', .7], ['lockpick', .3]], bark: 'fatco' },
  ppf: { name: 'P.P.F. REBEL', sprite: 'ppf', hp: 45, wpn: 'npcpistol', team: 'ppf', ai: 'guard', speed: 3.4, view: 8, drops: [['a_10mm', .6], ['pills', .25], ['joint', .3], ['lockpick', .2]], bark: 'ppf' },
  ppfr: { name: 'P.P.F. REBEL', sprite: 'ppf2', hp: 50, wpn: 'npcrifle', team: 'ppf', ai: 'guard', speed: 3.4, view: 8, drops: [['a_762', .6], ['pills', .2], ['multitool', .2]], bark: 'ppf' },
  mj: { name: 'MALLJESTIC COMMANDO', sprite: 'mj', hp: 95, armor: .3, wpn: 'npcrifle', team: 'mj', ai: 'guard', speed: 3.6, view: 10, drops: [['a_762', .7], ['biocell', .3], ['medkit', .2]], bark: 'mj' },
  mjelite: { name: 'MALLJESTIC ELITE', sprite: 'mjelite', hp: 140, armor: .45, wpn: 'npcplasma', team: 'mj', ai: 'guard', speed: 3.6, view: 11, drops: [['a_plasma', .6], ['biocell', .5]], bark: 'mj' },
  miws: { name: 'MAN IN WHITE SUIT', sprite: 'miws', hp: 180, armor: .25, wpn: 'npcpistol', team: 'miws', ai: 'guard', speed: 3.8, view: 11, burst: 1, drops: [['a_10mm', .5], ['biocell', .4]], bark: 'miws', explode: 1 },
  cop: { name: 'COP', sprite: 'cop', hp: 55, wpn: 'npcpistol', team: 'cop', ai: 'guard', speed: 3.4, view: 9, drops: [['a_10mm', .6], ['soda', .3]], bark: 'cop' },
  thug: { name: 'LOT THUG', sprite: 'thug', hp: 40, wpn: 'npcknife', team: 'thug', ai: 'guard', speed: 3.6, view: 7, drops: [['credits', .5, 20], ['joint', .3], ['liquor', .3]], bark: 'thug' },
  thugg: { name: 'LOT THUG', sprite: 'thug2', hp: 45, wpn: 'npcpistol', team: 'thug', ai: 'guard', speed: 3.4, view: 7, drops: [['credits', .5, 30], ['a_10mm', .5]], bark: 'thug' },
  redchat: { name: 'RED CHAT', sprite: 'redchat', hp: 55, wpn: 'npcsmg', team: 'redchat', ai: 'guard', speed: 3.6, view: 9, drops: [['a_10mm', .5], ['credits', .4, 40]], bark: 'redchat' },
  lurker: { name: 'LURKER', sprite: 'lurker', hp: 50, wpn: 'npcknife', team: 'lurker', ai: 'guard', speed: 3.9, view: 9, drops: [['credits', .4, 40], ['biocell', .3]], bark: 'lurker' },
  gatebox: { name: 'GATEBOX SECURITY', sprite: 'gatebox', hp: 70, wpn: 'npcsmg', team: 'gatebox', ai: 'guard', speed: 3.5, view: 10, drops: [['a_762', .5], ['biocell', .3]], bark: 'gatebox' },
  casino: { name: 'CASINO SECURITY', sprite: 'casino', hp: 65, wpn: 'npcpistol', team: 'casino', ai: 'guard', speed: 3.4, view: 9, drops: [['a_10mm', .5], ['credits', .5, 60]], bark: 'casino' },
  tunnel: { name: 'TUNNEL DWELLER', sprite: 'tunnel', hp: 40, wpn: 'npcpistol', team: 'tunnel', ai: 'guard', speed: 3.4, view: 8, drops: [['joint', .3], ['soda', .3]], bark: 'tunnel' },
  civ: { name: 'CIVILIAN', sprite: 'civ1', hp: 30, wpn: null, team: 'civ', ai: 'civ', speed: 3, view: 7, drops: [['credits', .3, 10], ['soda', .2], ['candy', .2]], bark: 'civ' },
  buffered: { name: 'BUFFERED', sprite: 'civ3', hp: 25, wpn: null, team: 'civ', ai: 'civ', speed: 1.4, view: 4, buffered: 1, drops: [], bark: 'buffered' },
  hu: { name: 'HU-MAN UNIT', sprite: 'humanunit', hp: 85, armor: .2, wpn: 'npcrifle', team: 'mj', ai: 'guard', speed: 3.4, view: 10, drops: [['a_762', .6]], bark: 'hu' },
  secbot: { name: 'ROBO MALL COP', sprite: 'secbot', hp: 120, armor: .5, wpn: 'botgun', team: 'bot', ai: 'guard', speed: 2.6, view: 10, mech: 1, drops: [], bark: 'secbot', explode: 1 },
  milbot: { name: 'MALL WALKER', sprite: 'milbot', hp: 400, armor: .6, wpn: 'npcgep', wpn2: 'botgun', team: 'bot', ai: 'guard', speed: 2.4, view: 12, mech: 1, big: 1, drops: [], bark: 'secbot', explode: 2 },
  spider: { name: 'PROP SPIDER', sprite: 'spider', hp: 40, wpn: 'spiderzap', team: 'bot', ai: 'guard', speed: 4.2, view: 8, mech: 1, small: 1, drops: [], explode: 1 },
  medbot: { name: 'MEDICAL BOT', sprite: 'medbot', hp: 80, wpn: null, team: 'civ', ai: 'static', mech: 1, med: 1, drops: [] },
  repairbot: { name: 'REPAIR BOT', sprite: 'repairbot', hp: 80, wpn: null, team: 'civ', ai: 'static', mech: 1, repair: 1, drops: [] },
  rat: { name: 'MALL RAT', sprite: 'rat', hp: 14, wpn: 'npcbite', team: 'animal', ai: 'guard', speed: 4.6, view: 6, animal: 1, small: 1, drops: [] },
  specimen: { name: 'SPECIMEN', sprite: 'specimen', hp: 90, wpn: 'npcclaw', wpn2: 'spiderzap', team: 'animal', ai: 'guard', speed: 4, view: 9, animal: 1, drops: [] },
  bioroid: { name: 'LINDA BIOROID', sprite: 'bioroid', hp: 160, armor: .3, wpn: 'lindabeam', team: 'mj', ai: 'guard', speed: 3.8, view: 11, drops: [['biocell', .5]], bark: 'bioroid' },
};
function mkNPC(M, e) {
  const t = NPCT[e.t || 'civ'] || NPCT.civ;
  for (const k of ['name', 'sprite', 'team', 'ai', 'speed', 'view', 'armor', 'mech', 'small', 'big', 'animal', 'explode', 'buffered', 'med', 'repair', 'bark', 'burst']) if (e[k] === undefined && t[k] !== undefined) e[k] = t[k];
  if (e.wpn === undefined) e.wpn = t.wpn; if (e.hp === undefined) e.hp = t.hp; e.hpMax = e.hpMax || e.hp;
  e.r = e.big ? .55 : e.small ? .22 : .28; e.face = e.face !== undefined ? e.face : (e.dir !== undefined ? e.dir * Math.PI / 2 : Math.PI / 2);
  e.state = e.state || 'idle'; e.sus = 0; e.alert = 0; e.fireT = 30 + rnd(30); e.home = e.home || [e.x, e.y, e.face];
  if (e.x === Math.floor(e.x)) { e.x += .5; e.y += .5; e.home = [e.x, e.y, e.face]; }
  e.viewR = e.view || 8; e.path = null; e.walkPh = 0; e.lastSeen = null; e.reactT = 0; e.clip = (WPN[e.wpn] && WPN[e.wpn].burst) || 6;
  if (!e.items) { e.items = []; for (const [id, ch, n] of t.drops || []) if (Math.random() < ch) e.items.push([id, n || 1]); if (e.wpn && WPN[e.wpn] && !e.mech && !e.animal && Math.random() < .5) { const map = { npcrifle: 'w_rifle', npcpistol: 'w_pistol', npcshot: 'w_shotgun', npcbaton: 'w_baton', npcknife: 'w_knife', npcgep: 'w_gep', npcplasma: 'w_plasma', npcflame: 'w_flame', prodnpc: 'w_prod', npcsmg: 'w_rifle' }; if (map[e.wpn]) e.items.push([map[e.wpn], 1]); } }
  if (e.route && typeof e.route === 'string') e.routeName = e.route;
  e.routeI = e.routeI || 0; e.k = 'npc';
}
const hostileTo = (e, o) => { if (e.dead || e.down) return false; if (o === P) return e.hostile || relOf(e.team, 'player') < 0; if (o.k === 'npc') { if (e.scrambled || o.scrambled) return e.team !== o.team || e.scrambled !== o.scrambled; return relOf(e.team, o.team) < 0; } return false; };

// ---------- the player ----------
function newPlayer() {
  return { x: 0, y: 0, r: .26, face: Math.PI / 2, aim: Math.PI / 2, crouch: 0, moving: 0, walkPh: 0, parts: { head: 100, torso: 100, armL: 100, armR: 100, legL: 100, legR: 100 },
    bio: 100, sp: 0, skills: {}, augs: { light: 1, infolink: 1 }, augOn: {}, inv: [], belt: Array(10).fill(null), held: null, ammo: {}, cred: 0, keys: {}, codes: {}, logins: [],
    notes: [], goals: [], images: [], convlog: [], fireT: 0, reloadT: 0, stillT: 0, spreadAdd: 0, carry: null, breath: 100, sprite: 'carl', charged: {}, drunk: 0, high: 0, pillT: 0, kills: 0, kos: 0, alarms: 0, stealthLost: 0, timeT: 0, binoc: 0, hurtT: 0, xp: {} };
}
function hpTotal() { const p = P.parts; return (p.head + p.torso + p.armL + p.armR + p.legL + p.legR) / 6; }
function playerSpeed() {
  const p = P.parts; let s = 4.3;
  const legs = (p.legL > 0 ? .5 : 0) + (p.legR > 0 ? .5 : 0) || .25; s *= legs;
  if (P.crouch) s *= .45; else if (key('ShiftLeft') || key('ShiftRight')) s *= .5;
  if (P.augOn.speed) s *= [1, 1.25, 1.45, 1.65, 1.9][augLvl('speed')];
  const w = heldWeapon(); if (w && WPN[ITEMS[w.id].weapon].heavy) s *= [.6, .7, .8, .9][sk('heavy')];
  if (P.carry) s *= P.augOn.muscle ? 1 : .6;
  const t = tAt(P.map, P.x, P.y); if (t === T_WATER) s *= .7; if (t === T_DEEP) s *= .45 + .15 * sk('swimming');
  return s;
}
function playerVisibility() { // how easy Carl is to see right now (0..1+)
  const M = P.map; let v = clamp(lightAt(M, P.x, P.y) * 1.15, .12, 1.2);
  if (P.augOn.light) v = Math.max(v, .9) + .3;
  if (P.crouch) v *= .55; if (!P.moving) v *= .75;
  if (tAt(M, P.x, P.y) === T_BRUSH && P.crouch) v *= .2;
  if (P.augOn.cloak || (P.charged.camo && P.charged.camo.on)) v = 0;
  if (P.cloakBreak > 0) v = Math.max(v, .4);
  return v;
}

// ---------- noise ----------
function makeNoise(M, x, y, r, kind, src) { M.noise.push({ x, y, r, kind, src, t: 2 }); }

// ---------- player update ----------
let FROB = null;
function updatePlayer(M) {
  if (P.dead) return;
  P.timeT += DT; if (P.hurtT > 0) P.hurtT--; if (P.cloakBreak > 0) P.cloakBreak -= DT;
  if (P.drone) { updateDrone(M); return; }
  // movement
  let mx = 0, my = 0;
  if (key('KeyW') || key('ArrowUp')) my -= 1; if (key('KeyS') || key('ArrowDown')) my += 1; if (key('KeyA') || key('ArrowLeft')) mx -= 1; if (key('KeyD') || key('ArrowRight')) mx += 1;
  if (tap('KeyC') || tap('ControlLeft')) { if (P.crouch) { const was = P.crouch; P.crouch = 0; if (!circleFree(M, P.x, P.y, P.r, P)) P.crouch = was; } else P.crouch = 1; }
  const n = Math.hypot(mx, my); P.moving = n > 0;
  if (n) { const sp = playerSpeed() * DT; const ox = P.x, oy = P.y; P.vault = P.augOn.speed && augLvl('speed') >= 2; moveBody(M, P, mx / n * sp, my / n * sp); const d = Math.hypot(P.x - ox, P.y - oy); P.walkPh += d * 3.2; P.stepAcc = (P.stepAcc || 0) + d;
    if (P.stepAcc > .9) { P.stepAcc = 0; const quiet = P.crouch || key('ShiftLeft') || key('ShiftRight') || (P.augOn.silent && augLvl('silent') >= 1); const loud = tAt(M, P.x, P.y) === T_WATER ? 5 : 4.5; if (!quiet || (P.augOn.silent ? false : false)) { makeNoise(M, P.x, P.y, P.augOn.silent ? 0 : loud, 'step', P); } if (!quiet && !P.augOn.silent) sfx('step'); }
    P.stillT = 0; } else P.stillT += DT;
  // aim
  const sx = P.x * TW - G.cam.x, sy = P.y * TH - G.cam.y - 12;
  if (MOUSE.on) P.aim = Math.atan2((MOUSE.y - sy) / TH, (MOUSE.x - sx) / TW);
  else { if (n) P.aim = Math.atan2(my, mx); const tgt = OPT.autoaim && autoTarget(M); if (tgt) P.aim = angTo(P, tgt); }
  P.face = P.aim;
  // swimming / breath
  const t = tAt(M, P.x, P.y);
  if (t === T_DEEP && !(P.charged.rebreather && P.charged.rebreather.on)) { P.breath -= DT * (12 - sk('swimming') * 2.5) * (P.augOn.envres ? .5 : 1); if (P.breath <= 0) { P.breath = 0; if (frame % 30 === 0) hurtPlayer(5, 'drown'); } }
  else P.breath = Math.min(100, P.breath + DT * 30);
  // gas
  for (const f of M.fx) if (f.gas && Math.hypot(f.x - P.x, f.y - P.y) < f.r) { const prot = (P.charged.hazmat && P.charged.hazmat.on) || (P.charged.rebreather && P.charged.rebreather.on) ? 0 : P.augOn.envres ? 1 - augLvl('envres') * .22 : 1; if (prot > 0 && frame % 20 === 0) { hurtPlayer(2 * prot, 'gas'); if (f.smoke) P.cough = 40; } }
  // timers
  if (P.fireT > 0) P.fireT--; if (P.flashT > 0) P.flashT--; if (P.reachT > 0) P.reachT--; if (P.useT > 0) P.useT--; if (P.reloadT > 0) { P.reloadT--; if (P.reloadT === 0) finishReload(); }
  if (P.drunk > 0) P.drunk -= DT; if (P.high > 0) P.high -= DT; if (P.pillT > 0) P.pillT -= DT;
  for (const k in P.charged) { const c = P.charged[k]; if (!c.on) continue; const it = invFind(k); if (!it) { c.on = 0; continue; } it.charge -= DT * 2.2 / [1, 1.25, 1.6, 2.2][sk('environmental')]; if (it.charge <= 0) { msg(ITEMS[k].name + ' DEPLETED'); c.on = 0; removeItem(it); } }
  // spread: grows with movement and firing, shrinks standing still (DX reticle)
  const base = P.moving ? .06 : 0; P.spreadAdd = Math.max(base, P.spreadAdd - DT * (.1 + (P.stillT > .5 ? .15 : 0)));
  // belt
  for (let k = 0; k <= 9; k++) if (tap('Digit' + k) && !key('ShiftLeft')) selectBelt(k);
  if (MOUSE.wheel) cycleBelt(MOUSE.wheel);
  if (tap('KeyR')) reload();
  if (tap('KeyX')) { if (P.carry) dropBody(M); else { P.held = null; msg('HANDS'); } }
  // fire
  const firePressed = MOUSE.click || tap('Space') || tap('KeyJ'), fireHeld = MOUSE.down || key('Space') || key('KeyJ') || firePressed;
  if (P.carry) { if (firePressed) dropBody(M); }
  else if (fireHeld && P.held && ITEMS[P.held.id].tool && firePressed) { if (FROB) frob(M, FROB); }
  else if (fireHeld) { const it = heldWeapon(), wp = it ? WPN[ITEMS[it.id].weapon] : WPN.fists; if (firePressed || wp.auto) playerFire(M, it, wp); }
  else if (firePressed && P.held && ITEMS[P.held.id].use) useItem(P.held);
  // frob
  FROB = findFrob(M);
  if (tap('KeyE') || tap('Enter') || tap('KeyK') || MOUSE.rclick) { if (FROB) frob(M, FROB); }
  // binoculars / scope
  { const hw = heldWeapon(); P.zoom = (key('KeyZ') && hw && (WPN[ITEMS[hw.id].weapon].scope || (hw.mods || {}).sco)) || P.binoc ? 1 : 0; }
  // augs
  const hk = augHotkeys(); for (let k = 0; k < hk.length && k < 8; k++) if (tap('F' + (k + 1)) || (key('ShiftLeft') && tap('Digit' + (k + 1)))) toggleAug(hk[k]);
  augTick();
  if (P.augOn.light) makeNoise(M, P.x, P.y, 0, 'light', P);
  if (P.carry) { P.carry.x = P.x; P.carry.y = P.y; }
  if (P.cough > 0) { P.cough--; P.spreadAdd = Math.max(P.spreadAdd, .25); }
  if (P.bleed > 0) P.bleed--;
}
function autoTarget(M) { let best = null, bd = 1e9; for (const e of M.ents) if (e.k === 'npc' && !e.dead && !e.down && hostileTo(e, P) && M.vis[(e.y | 0) * M.w + (e.x | 0)]) { const d = dist(P, e); if (d < bd && d < 14) { bd = d; best = e; } } return best; }
function selectBelt(k) { const uid = P.belt[k]; if (k === 0 && !uid) { P.held = null; msg('HANDS'); return; } const it = uid && itemByUid(uid); if (!it) return; if (P.held === it) { P.held = null; msg('HANDS'); return; } P.held = it; P.reloadT = 0; sfx('move'); msg(ITEMS[it.id].name + (it.n > 1 ? ' (' + it.n + ')' : '')); }
function cycleBelt(d) { const slots = []; for (let k = 1; k <= 10; k++) { const s = k % 10; if (P.belt[s] && itemByUid(P.belt[s])) slots.push(s); } if (!slots.length) return; const cur = slots.findIndex(s => P.held && P.belt[s] === P.held.uid); selectBelt(slots[(cur + d + slots.length * 2) % slots.length] ?? slots[0]); }
function ammoType(it) { const w = WPN[ITEMS[it.id].weapon]; return w.ammo ? w.ammo[Math.max(0, it.at || 0)] : null; }
function clipSize(it) { const w = WPN[ITEMS[it.id].weapon]; return Math.round((w.clip || 0) * (1 + ((it.mods && it.mods.clip) || 0) * .25)); }
function reload() {
  const it = heldWeapon(); if (!it) return; const w = WPN[ITEMS[it.id].weapon]; if (!w.ammo || w.thrown || w.oneShot) return;
  if (P.reloadT > 0) return; const a = ammoType(it); if (it.clip >= clipSize(it)) { // switch ammo type when the clip is full
    if (w.ammo.length > 1) { for (let k = 1; k <= w.ammo.length; k++) { const n = (it.at + k) % w.ammo.length; if (P.ammo[w.ammo[n]] > 0) { if (n !== it.at) { P.ammo[a] = (P.ammo[a] || 0) + it.clip; it.clip = 0; it.at = n; msg('AMMO: ' + AMMO[w.ammo[n]].name); P.reloadT = Math.round(w.reload * [1, .85, .7, .55][sk(w.skill)] * (1 - ((it.mods && it.mods.rel) || 0) * .15)); sfx('tick'); } return; } } } return; }
  if (!(P.ammo[a] > 0)) { msg('OUT OF ' + AMMO[a].name); return; }
  P.reloadT = Math.round(w.reload * [1, .85, .7, .55][sk(w.skill)] * (1 - ((it.mods && it.mods.rel) || 0) * .15)); sfx('tick'); makeNoise(P.map, P.x, P.y, 2, 'reload', P);
}
function finishReload() { const it = heldWeapon(); if (!it) return; const a = ammoType(it); if (!a) return; const need = clipSize(it) - it.clip, got = Math.min(need, P.ammo[a] || 0); P.ammo[a] -= got; it.clip += got; sfx('move'); }
function playerSpread(wp, it) {
  const arms = (P.parts.armL + P.parts.armR) / 200; let s = (wp.spread || .1) * skMul(wp.skill) + P.spreadAdd + (1 - arms) * .2;
  if (it && it.mods) s *= 1 - (it.mods.acc || 0) * .12; if (it && it.mods && it.mods.las) s *= .5;
  if (P.augOn.target) s *= 1 - augLvl('target') * .12; if (P.pillT > 0) s *= .7; if (P.drunk > 0) s += .08; if (P.high > 0) s += .03;
  return Math.max(.005, s);
}
function playerFire(M, it, wp) {
  if (P.fireT > 0 || P.reloadT > 0 || P.swimming) return;
  if (wp.melee) { P.fireT = wp.rate; P.punchN = (P.punchN || 0) + 1; meleeAttack(M, P, wp, it); return; }
  if (wp.thrown) { const a = wp.ammo[0]; if (!(P.ammo[a] > 0)) { msg('NONE LEFT'); return; } P.ammo[a]--; P.fireT = wp.rate; throwNade(M, P, wp.nade, P.aim, 3 + sk('demo') * 1.5); if (!P.ammo[a]) { removeItem(it); } return; }
  if (it.clip <= 0) { if (wp.oneShot) { removeItem(it); return; } reload(); if (P.reloadT <= 0) sfx('tick'); return; }
  it.clip--; P.fireT = Math.round(wp.rate * (wp.auto ? 1 : 1));
  const at = ammoType(it), am = AMMO[at] || {}, spread = playerSpread(wp, it), dmgMul = 1 + sk(wp.skill) * .2 + (P.augOn.strength && wp.melee ? augLvl('strength') * .3 : 0);
  const sil = it.mods && it.mods.sil; makeNoise(M, P.x, P.y, sil ? 2 : wp.noise, 'gun', P); if (P.augOn.cloak) { P.cloakBreak = .8; }
  sfx(wp.proj === 'smoke' ? 'smoke' : sil || wp.noise <= 2 ? 'silshot' : wp.heavy ? 'boomshot' : wp.pellets ? 'shotgun' : 'shot'); P.flashT = 3; if (!sil && wp.noise > 2 && !wp.proj) M.fx.push({ flash: 1, x: P.x + Math.cos(P.aim) * .6, y: P.y + Math.sin(P.aim) * .6, t: 4, t0: 4, r: 18 });
  if (typeof OPT !== 'undefined' && OPT.visuals && OPT.particles && !wp.melee && !wp.thrown) {
    const side = Math.cos(P.aim) >= 0 ? 1 : -1, perp = P.aim + side * Math.PI * .45;
    M.fx.push({ casing: 1, x: P.x, y: P.y, vx: Math.cos(perp) * (1.3 + Math.random() * .7), vy: Math.sin(perp) * (1.3 + Math.random() * .7), vz: 2.2, z: .8, t: 150, t0: 150 });
  }
  P.spreadAdd = Math.min(.4, P.spreadAdd + (wp.auto ? .025 : .06) * (1 - ((it.mods && it.mods.rec) || 0) * .2));
  const range = (wp.range || 10) * (1 + ((it.mods && it.mods.rng) || 0) * .15);
  if (wp.proj === 'smoke') { for (let k = 0; k < 2; k++) M.fx.push({ gas: 1, smoke: 1, col: '#a0c8a0', x: P.x + Math.cos(P.aim) * (1 + Math.random() * 2.5), y: P.y + Math.sin(P.aim) * (1 + Math.random() * 2.5), r: 1.2, t: 120, t0: 120, s: rnd(999), stun: 1 }); return; }
  if (wp.proj === 'dart' || wp.proj === 'rocket' || wp.proj === 'flame' || wp.proj === 'plasma') {
    const a = P.aim + (Math.random() - .5) * spread * 2; fireProj(M, P, wp, a, { tranq: am.tranq, flare: am.flare, fire: am.fire, dmg: wp.dmg * dmgMul }); return; }
  if (at === '20mm') { const a = P.aim + (Math.random() - .5) * spread; fireProj(M, P, WPN.gep, a, { dmg: 45, small: 1 }); return; }
  for (let k = 0; k < (wp.pellets || 1); k++) { const a = P.aim + (Math.random() - .5) * spread * 2; hitscan(M, P, a, range, wp.dmg * dmgMul, { pierce: am.pierce, sniper: wp.scope }); }
}
// ---------- hitscan / projectiles ----------
function hitscan(M, src, ang, range, dmg, o = {}) {
  const c = Math.cos(ang), s = Math.sin(ang); let x = src.x, y = src.y, hitAt = range;
  for (let d = .3; d < range; d += .12) {
    x = src.x + c * d; y = src.y + s * d; const tx = x | 0, ty = y | 0, t = tAt(M, tx, ty);
    if (t === T_WALL || t === T_VOID) { hitAt = d; M.fx.push({ spark: 1, x, y, n: 8, t: 8, t0: 8, s: rnd(999) }); makeNoise(M, x, y, 2, 'ricochet', src); break; }
    if (t === T_WIN) { breakWindow(M, tx, ty); }
    if (t === T_DOOR) { const dd = M.doors[ty * M.w + tx]; if (dd && !dd.open && dd.o < .5) { hitAt = d; M.fx.push({ spark: 1, x, y, n: 8, t: 8, t0: 8, s: rnd(999) }); if (dd.breakable !== 0 && dd.hp) damageDoor(M, dd, dmg); break; } }
    // props
    const pr = propAt(M, x, y); if (pr && !PROPS[pr.p].low && PROPS[pr.p].solid !== 0 && !PROPS[pr.p].wall) { hitAt = d; damageProp(M, pr, dmg); M.fx.push({ spark: 1, x, y, n: 8, t: 8, t0: 8, s: rnd(999) }); break; }
    // actors
    let hit = null;
    for (const e of M.ents) if (e.k === 'npc' && !e.dead && e !== src && (!e.down || d < 1.2) && Math.hypot(e.x - x, e.y - y) < (e.r + .08)) { hit = e; break; }
    if (!hit && src !== P && P.map === M && !P.dead && Math.hypot(P.x - x, P.y - y) < P.r + .08) { hitAt = d; hurtPlayer(dmg, 'bullet', src); break; }
    if (hit) { hitAt = d; damageNPC(M, hit, dmg, src, { bullet: 1, pierce: o.pierce, sniper: o.sniper, ang }); if (typeof OPT !== 'undefined' && OPT.visuals && OPT.particles) M.fx.push({ blood: 1, x, y, ang, t: 14, t0: 14, mech: hit.mech, s: rnd(999) }); if (!o.pierce) break; }
    // lamps you can shoot out
    for (const e of M.ents) if (e.k === 'prop' && (e.p === 'lamp' || e.p === 'neonlamp') && !M.lightsOut[e.uid] && Math.abs(e.x + .5 - x) < .3 && Math.abs(e.y + .5 - y) < .3 && src === P) { M.lightsOut[e.uid] = 1; computeLight(M); sfx('glass'); msg('Shot out the light.'); }
  }
  M.fx.push({ tracer: 1, x: src.x + c * .4, y: src.y + s * .4, x2: src.x + c * hitAt, y2: src.y + s * hitAt, t: 2, t0: 2 });
}
function propAt(M, x, y) { for (const e of M.ents) { if (e.k !== 'prop' || e.gone) continue; const p = PROPS[e.p]; if (!p) continue; if (x >= e.x && x < e.x + p.fw && y >= e.y && y < e.y + p.fh) return e; } return null; }
function fireProj(M, src, wp, ang, o = {}) {
  const sp = wp.proj === 'rocket' ? 11 : wp.proj === 'dart' ? 16 : wp.proj === 'flame' ? 9 : wp.proj === 'zap' ? 12 : 13;
  const e = spawnEnt(M, { k: 'proj', x: src.x + Math.cos(ang) * .5, y: src.y + Math.sin(ang) * .5, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: (wp.range || 12) / sp, ptype: wp.proj, dmg: o.dmg || wp.dmg, src, tranq: o.tranq, flare: o.flare, fire: o.fire, splash: wp.splash, col: wp.proj === 'rocket' ? '#ffd060' : wp.proj === 'flame' ? '#ff8020' : wp.proj === 'plasma' ? '#60ffff' : wp.proj === 'zap' ? '#80c0ff' : '#c0c0c0', size: wp.proj === 'rocket' || wp.proj === 'plasma' ? 3 : 2, small: o.small, z: 0 });
  if (wp.proj === 'flame') e.life = .5;
  return e;
}
function throwNade(M, src, kind, ang, range) {
  spawnEnt(M, { k: 'proj', ptype: 'nade', nade: kind, x: src.x + Math.cos(ang) * .4, y: src.y + Math.sin(ang) * .4, vx: Math.cos(ang) * range * .9, vy: Math.sin(ang) * range * .9, vz: 6, z: 2, fuse: kind === 'lam' ? 2.5 : 1.8, src, col: kind === 'gas' ? '#90c060' : kind === 'emp' ? '#60a0ff' : kind === 'scram' ? '#c060ff' : '#d0d040', size: 3 });
  sfx('throw');
}
function updateProj(M, e) {
  if (e.ptype === 'nade') {
    e.fuse -= DT; e.vz -= 18 * DT; e.z = Math.max(0, e.z + e.vz * DT * 6); if (e.z === 0) { e.vx *= .9; e.vy *= .9; }
    const ox = e.x, oy = e.y; e.x += e.vx * DT; e.y += e.vy * DT; if (!passable(M, e.x, e.y, { small: 1 })) { e.x = ox; e.y = oy; e.vx *= -.4; e.vy *= -.4; sfx('bump'); }
    if (P.augOn.aggdef && e.src !== P && Math.hypot(e.x - P.x, e.y - P.y) < 2 + augLvl('aggdef') * 1.2) e.fuse = 0;
    if (e.fuse <= 0) { detonate(M, e); removeEnt(M, e); } return; }
  e.life -= DT; const steps = 3;
  for (let k = 0; k < steps; k++) {
    e.x += e.vx * DT / steps; e.y += e.vy * DT / steps;
    if (P.augOn.aggdef && e.ptype === 'rocket' && e.src !== P && Math.hypot(e.x - P.x, e.y - P.y) < 2 + augLvl('aggdef') * 1.2) { boom(M, e.x, e.y, 2, e.dmg * .5, e.src); removeEnt(M, e); return; }
    const t = tAt(M, e.x, e.y); let stop = t === T_WALL || t === T_VOID || (t === T_DOOR && M.block[(e.y | 0) * M.w + (e.x | 0)]);
    if (t === T_WIN) { breakWindow(M, e.x | 0, e.y | 0); }
    const pr = !stop && propAt(M, e.x, e.y); if (pr && !PROPS[pr.p].low && PROPS[pr.p].solid !== 0) stop = true;
    let hit = null; if (!stop) { for (const n of M.ents) if (n.k === 'npc' && !n.dead && !n.down && n !== e.src && Math.hypot(n.x - e.x, n.y - e.y) < n.r + .1) { hit = n; break; } if (!hit && e.src !== P && P.map === M && Math.hypot(P.x - e.x, P.y - e.y) < P.r + .1) hit = P; }
    if (stop || hit || e.life <= 0) {
      if (e.ptype === 'rocket' || e.ptype === 'plasma') { if (e.ptype === 'plasma') { if (hit && hit !== P) damageNPC(M, hit, e.dmg, e.src, { fire: 1 }); else if (hit === P) hurtPlayer(e.dmg, 'plasma', e.src); boom(M, e.x - e.vx * .02, e.y - e.vy * .02, e.splash || 1, e.dmg * .4, e.src, { plasma: 1 }); } else boom(M, e.x - e.vx * .02, e.y - e.vy * .02, e.small ? 1.6 : 2.6, e.dmg, e.src); if (stop && pr) damageProp(M, pr, e.dmg); }
      else if (e.ptype === 'flame') { if (hit && hit !== P) { damageNPC(M, hit, e.dmg, e.src, { fire: 1 }); hit.burn = 120; } else if (hit === P) { hurtPlayer(e.dmg, 'fire', e.src); P.burn = 60; } }
      else if (e.ptype === 'zap') { if (hit === P) hurtPlayer(e.dmg, 'zap', e.src); else if (hit) damageNPC(M, hit, e.dmg, e.src, {}); }
      else if (e.ptype === 'dart') { if (hit && hit !== P) { if (e.tranq) { if (!hit.mech) { hit.tranq = 3 + Math.random() * 2; hit.hostile = hit.hostile || relOf(hit.team, 'player') >= 0; damageNPC(M, hit, 4, e.src, { nonlethal: 1 }); } } else damageNPC(M, hit, e.dmg, e.src, { bullet: 1 }); } else if (hit === P) hurtPlayer(e.dmg, 'bullet', e.src);
        if (e.flare) { spawnEnt(M, { k: 'prop', p: 'cone', x: Math.floor(e.x - e.vx * .02), y: Math.floor(e.y - e.vy * .02), light: [5, 1], hidden: 1, flareT: 60 }); computeLight(M); } }
      removeEnt(M, e); return; }
  }
  if (e.ptype === 'flame' && frame % 3 === 0) M.fx.push({ flash: 1, x: e.x, y: e.y, t: 6, t0: 6, r: 8, col: '#ff6020' });
}
function detonate(M, e) {
  const k = e.nade;
  if (k === 'lam') boom(M, e.x, e.y, 2.6, 70 * (1 + sk('demo') * .15), e.src);
  else if (k === 'gas') { M.fx.push({ gas: 1, x: e.x, y: e.y, r: 2.6, t: 420, t0: 420, s: rnd(999), col: '#a0c060' }); sfx('gas'); makeNoise(M, e.x, e.y, 6, 'boom', e.src); }
  else if (k === 'emp') { empBlast(M, e.x, e.y, 3); }
  else if (k === 'scram') { for (const n of M.ents) if (n.k === 'npc' && n.mech && !n.dead && Math.hypot(n.x - e.x, n.y - e.y) < 3.5) { n.scrambled = 30; n.state = 'idle'; } M.fx.push({ flash: 1, x: e.x, y: e.y, t: 20, t0: 20, r: 40, col: '#c060ff' }); sfx('zap'); }
}
function empBlast(M, x, y, r) { M.fx.push({ flash: 1, x, y, t: 24, t0: 24, r: r * 18, col: '#60a0ff' }); sfx('emp');
  for (const n of M.ents) { if (Math.hypot(n.x - x, n.y - y) > r) continue; if (n.k === 'npc' && n.mech) damageNPC(M, n, 60, P, { emp: 1 }); if (n.k === 'cam' || n.k === 'turret') { n.off = 1; n.empT = 30 * 60; } if (n.k === 'laser') n.off = 1; }
  if (Math.hypot(P.x - x, P.y - y) < r) { P.bio = Math.max(0, P.bio - (augLvl('emp') ? 30 * (1 - augLvl('emp') * .24) : 50)); } }
function boom(M, x, y, r, dmg, src, o = {}) {
  M.fx.push({ boom: 1, x, y, t: 20, t0: 20, r }); M.fx.push({ flash: 1, x, y, t: 14, t0: 14, r: r * 16, col: o.plasma ? '#60ffff' : '#ffb040' }); post.shake = Math.max(post.shake, 3); setTimeout(() => post.shake = 0, 200);
  sfx('boom'); makeNoise(M, x, y, 16, 'boom', src); M.decals.push({ x, y, r: r * 1.2, n: 30, c: hex('#1a1410'), s: rnd(999) });
  for (const e of M.ents.slice()) { if (e.gone) continue; const d = Math.hypot(e.x + (e.k === 'prop' ? .5 : 0) - x, e.y + (e.k === 'prop' ? .5 : 0) - y); if (d > r) continue; const k = 1 - d / r;
    if (e.k === 'npc' && !e.dead) damageNPC(M, e, dmg * k, src, { blast: 1 }); if (e.k === 'prop') damageProp(M, e, dmg * k); if (e.k === 'cam' || e.k === 'turret') e.dead = 1; }
  for (const k in M.doors) { const dd = M.doors[k]; if (Math.hypot(dd.x + .5 - x, dd.y + .5 - y) < r && dd.breakable !== 0) damageDoor(M, dd, dmg); }
  for (let ty = Math.floor(y - r); ty <= y + r; ty++) for (let tx = Math.floor(x - r); tx <= x + r; tx++) if (tAt(M, tx, ty) === T_WIN) breakWindow(M, tx, ty);
  if (P.map === M) { const d = Math.hypot(P.x - x, P.y - y); if (d < r) hurtPlayer(dmg * (1 - d / r), o.plasma ? 'plasma' : 'blast', src); }
}
function breakWindow(M, tx, ty) { const i = ty * M.w + tx; if (M.t[i] !== T_WIN) return; M.t[i] = T_FLOOR; M.st[i] = (M.d.f || ['concrete'])[0]; (M.broken || (M.broken = {}))[i] = 1; M.decals.push({ x: tx + .5, y: ty + .5, r: 1, n: 14, c: hex('#a0c8e0'), s: rnd(999) }); sfx('glass'); makeNoise(M, tx + .5, ty + .5, 8, 'glass', P); rebuildBlock(M); }
function damageProp(M, e, dmg) {
  const p = PROPS[e.p]; if (!p.breakable && !p.explode && !p.hp) return; e.hp -= dmg; if (e.hp > 0) return;
  if (p.explode) { removeEnt(M, e); boom(M, e.x + .5, e.y + .5, 2.8, 80, P); rebuildBlock(M); return; }
  removeEnt(M, e); sfx('crash'); makeNoise(M, e.x, e.y, 6, 'crash', P); M.decals.push({ x: e.x + .5, y: e.y + .5, r: .8, n: 12, c: hex('#5a4030'), s: rnd(999) });
  if (p.drop || e.items) { for (const [id, n] of e.items || rollCrate(e)) spawnEnt(M, { k: 'item', item: id, n, x: e.x + .3 + Math.random() * .4, y: e.y + .4 + Math.random() * .3 }); }
  if (p.light) computeLight(M); rebuildBlock(M);
}
function rollCrate(e) { const r = srand(hash(e.x | 0, e.y | 0, 5) * 1e6 | 0), out = []; const pool = [['medkit', 1], ['biocell', 1], ['a_10mm', 1], ['a_762', 1], ['lockpick', 1], ['multitool', 1], ['soda', 1], ['candy', 1], ['a_shell', 1], ['credits', 25], ['joint', 1], ['a_tdart', 1]]; const n = r() < .5 ? 1 : r() < .5 ? 2 : 0; for (let k = 0; k < n; k++) out.push(pool[(r() * pool.length) | 0]); return out; }
function damageDoor(M, dd, dmg) { if (!dd.hp) return; dd.hp -= dmg; if (dd.hp <= 0) { dd.open = 1; dd.o = 1; dd.broken = 1; dd.lock = 0; sfx('crash'); makeNoise(M, dd.x, dd.y, 10, 'crash', P); rebuildBlock(M); M.visDirty = 1; } }

// ---------- melee ----------
function meleeAttack(M, a, wp, it) {
  const reach = wp.reach || 1, isP = a === P; let hitAny = false;
  sfx('swing'); makeNoise(M, a.x, a.y, wp.noise || 2, 'melee', a);
  const ang = a.aim !== undefined ? a.aim : a.face;
  if (isP) { // the strongest thing in the arc
    for (const e of M.ents) { if (e.k !== 'npc' || e.dead || (e.down && wp.nonlethal)) continue; const d = dist(a, e); if (d > reach + e.r) continue; if (Math.abs(angDiff(ang, angTo(a, e))) > .9) continue;
      let dmg = wp.dmg * (1 + sk('lowtech') * .25) * (P.augOn.strength ? 1 + augLvl('strength') * .4 : 1);
      const sneak = e.state !== 'combat' && Math.abs(angDiff(e.face, angTo(e, a))) > 1.8; // from behind
      if (sneak) dmg *= wp.stun ? 6 : 3;
      if (wp.stun && !e.mech) { damageNPC(M, e, dmg, a, { nonlethal: 1, stun: wp.prod || wp === WPN.prod ? 1 : 0 }); if (wp === WPN.prod || sneak) { if (!e.down) knockOut(M, e); } }
      else damageNPC(M, e, dmg, a, { melee: 1 });
      hitAny = true; break; }
    if (!hitAny) { const x = a.x + Math.cos(ang) * reach * .8, y = a.y + Math.sin(ang) * reach * .8; const pr = propAt(M, x, y); if (pr) { damageProp(M, pr, wp.dmg * (P.augOn.strength ? 2 : 1)); hitAny = true; } if (tAt(M, x, y) === T_WIN) { breakWindow(M, x | 0, y | 0); hitAny = true; } }
    if (hitAny) sfx('hit'); return;
  }
  // npc hitting the player
  if (P.map === M && dist(a, P) < reach + P.r + .1) { hurtPlayer(wp.dmg, wp.stun ? 'stun' : 'melee', a); sfx('hit'); }
  else for (const e of M.ents) if (e.k === 'npc' && e !== a && hostileTo(a, e) && !e.dead && dist(a, e) < reach + e.r) { damageNPC(M, e, wp.dmg, a, {}); break; }
}

// ---------- damage ----------
function damageNPC(M, e, dmg, src, o = {}) {
  if (e.dead || e.invuln) return;
  if (o.emp && !e.mech) return;
  if (e.mech && o.nonlethal && !o.emp) dmg *= .2;
  if (e.armor && (o.bullet || o.melee) && !o.pierce) dmg *= 1 - e.armor;
  if (o.sniper && !e.mech) dmg *= 1.6;
  if (e.state !== 'combat' && src === P && !e.mech && (o.bullet) && dmg > 0) dmg *= 1.8; // unaware: the DX headshot bonus, roughly
  e.hp -= dmg; e.hurtT = 8; if (o.melee || o.bullet) M.decals.push({ x: e.x, y: e.y, r: .4, n: 6, c: e.mech ? hex('#2a2a2a') : hex('#8a1010'), s: rnd(999) });
  if (src === P && !e.dead) { if (!hostileTo(e, P)) { provoke(M, e); } }
  if (e.state !== 'combat' && !e.down && e.ai !== 'static' && e.ai !== 'civ') { e.state = 'combat'; e.sus = 1; e.lastSeen = src ? [src.x, src.y] : [e.x, e.y]; e.reactT = 10; }
  if (e.ai === 'civ' && !e.down) { e.state = 'flee'; e.threat = src || P; }
  if (e.hp <= 0) { if (o.nonlethal && !e.mech) knockOut(M, e); else kill(M, e, src, o); }
  else if (e.hp < e.hpMax * .25 && !e.mech && !e.animal && e.ai === 'guard' && Math.random() < .3 && !e.noflee) { e.state = 'flee'; e.threat = src || P; }
}
function provoke(M, e) { // hurting a non-hostile person: they and their friends nearby turn
  if (e.ai === 'static' && !e.team) return; e.hostile = 1;
  for (const n of M.ents) if (n.k === 'npc' && !n.dead && !n.down && n.team === e.team && dist(n, e) < 10 && n !== e && !(n.invuln && n.conv)) { n.hostile = 1; if (n.ai !== 'civ') { n.state = 'combat'; n.lastSeen = [P.x, P.y]; } }
  if (e.team !== 'civ' && e.team !== 'animal' && relOf(e.team, 'player') > 0) { (M.angry || (M.angry = {}))[e.team] = 1; if (typeof onProvoke === 'function') onProvoke(M, e); }
}
function knockOut(M, e) { if (e.dead) return; e.down = 1; e.state = 'down'; e.flipDown = Math.random() < .5; e.hp = Math.max(e.hp, 1); e.ko = 1; makeNoise(M, e.x, e.y, 3, 'body', e); sfx('thud'); if (e.onDown) e.onDown(M, e); if (typeof onNPCDown === 'function') onNPCDown(M, e, false); P.kos++; if (e.team !== 'civ') chatReact('ko', e); }
function kill(M, e, src, o = {}) {
  if (e.dead) return; e.dead = 1; e.down = 1; e.state = 'dead'; e.flipDown = Math.random() < .5; e.hp = 0; sfx(e.mech ? 'crash' : 'die'); makeNoise(M, e.x, e.y, 4, 'body', e);
  if (!e.mech) M.decals.push({ x: e.x, y: e.y + .1, r: .9, n: 24, c: hex('#6a0808'), s: rnd(999) });
  if (e.explode) { const r = e.explode === 2 ? 3.5 : 2.2; setTimeout(() => { if (P.map === M) boom(M, e.x, e.y, r, e.explode === 2 ? 90 : 50, e); removeEnt(M, e); }, e.mech ? 10 : 600); if (!e.mech) { M.fx.push({ txt: 'HE WAS NEVER HERE', x: e.x, y: e.y, t: 90, t0: 90, c: hex('#e0e0f0') }); } }
  if (src === P) { P.kills++; if (typeof onNPCDown === 'function') onNPCDown(M, e, true); if (e.team !== 'civ' || !e.mech) chatReact(e.team === 'civ' ? 'civkill' : 'kill', e); }
  else if (typeof onNPCDown === 'function') onNPCDown(M, e, true);
  if (e.onDie) e.onDie(M, e);
}
const PART_W = [['torso', 32], ['head', 10], ['armL', 13], ['armR', 13], ['legL', 16], ['legR', 16]];
function hurtPlayer(dmg, type, src) {
  if (P.dead || G.godmode) return; dmg *= [.6, 1, 1.4][OPT.diff] || 1;
  if (type === 'bullet' && P.augOn.ballistic) dmg *= 1 - [0, .2, .35, .5, .65][augLvl('ballistic')];
  if (type === 'bullet' && P.charged.armor && P.charged.armor.on) dmg *= .5;
  if ((type === 'blast' || type === 'fire' || type === 'plasma') && P.augOn.shield) dmg *= 1 - [0, .2, .35, .5, .65][augLvl('shield')];
  if ((type === 'fire' || type === 'gas') && P.charged.hazmat && P.charged.hazmat.on) dmg *= .25;
  if (type === 'gas' && P.augOn.envres) dmg *= 1 - augLvl('envres') * .24;
  if (type === 'zap' && augLvl('emp')) dmg *= 1 - augLvl('emp') * .2;
  let part; if (type === 'blast' || type === 'fire' || type === 'gas' || type === 'drown' || type === 'plasma') { for (const k in P.parts) P.parts[k] = Math.max(0, P.parts[k] - dmg * (k === 'head' || k === 'torso' ? .7 : 1)); part = 'torso'; }
  else { let r = Math.random() * 100; for (const [k, w] of PART_W) { r -= w; if (r <= 0) { part = k; break; } } part = part || 'torso'; P.parts[part] = Math.max(0, P.parts[part] - dmg * (part === 'head' ? 1.3 : 1)); }
  P.hurtT = 10; P.lastHurt = { part, t: 30, from: src ? angTo(P, src) : null }; post.flash = Math.max(post.flash, .15); sfx('hurt');
  if (type === 'stun') P.spreadAdd = .4;
  if (src && src !== P && src.k === 'npc' && P.map) for (const n of P.map.ents) if (n.k === 'npc' && n.team === src.team && n.state !== 'combat' && dist(n, P) < 10) { n.state = 'combat'; n.lastSeen = [P.x, P.y]; }
  if (P.parts.head <= 0 || P.parts.torso <= 0) playerDie(type, src);
  else if (Math.random() < .25) chatReact('hurt');
}
function playerDie(type, src) { if (P.dead) return; P.dead = 1; sfx('die'); chatReact('death'); if (typeof onPlayerDeath === 'function') onPlayerDeath(type, src); }
function useMed(n) { const h = n * [1, 1.5, 2, 2.5][sk('medicine')]; let need = 0; for (const k in P.parts) need += 100 - P.parts[k]; if (need < 1) { msg('Already healthy.'); return false; } for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + h); sfx('heal'); msg('HEALED ' + Math.round(h) + ' (every part)'); return true; }
function useBio(n) { if (P.bio >= 100) { msg('Energy full.'); return false; } P.bio = Math.min(100, P.bio + n); sfx('power'); return true; }
function useFood(n, kind) { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + n); sfx('eat'); if (kind === 'tp') msg('Carl looks at the roll. The roll looks at Carl. Nothing happens.'); return true; }
function useJoint() { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 5); P.bio = Math.min(100, P.bio + 20); P.high = 40; sfx('smoke'); makeNoise(P.map, P.x, P.y, 0, 'smoke', P); P.map.fx.push({ gas: 1, smoke: 1, col: '#c0d0c0', x: P.x, y: P.y, r: .9, t: 90, t0: 90, s: rnd(999) }); chatReact('smoke'); return true; }
function useLiquor() { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 4); P.drunk = 25; sfx('eat'); return true; }
function usePills() { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 12); P.pillT = 60; sfx('heal'); msg('Prop Pills. Steady hands for a minute.'); return true; }
function toggleBinoc() { P.binoc = !P.binoc; return false; }
function toggleCharged(id) { const it = invFind(id); if (!it) return false; const c = P.charged[id] || (P.charged[id] = {}); c.on = !c.on; msg(ITEMS[id].name + (c.on ? ' ON' : ' OFF')); sfx(c.on ? 'power' : 'powerdown'); return false; }
function throwFlare() { const M = P.map; spawnEnt(M, { k: 'prop', p: 'cone', x: Math.floor(P.x + Math.cos(P.aim) * 2), y: Math.floor(P.y + Math.sin(P.aim) * 2), light: [5, 1.1], hidden: 1, flareT: 60 * 60 }); computeLight(M); sfx('throw'); return true; }
function useItem(it) { const d = ITEMS[it.id]; if (!d.use) return; P.useT = 30; P.useCol = it.id === 'medkit' ? '#f0f0f0' : it.id === 'soda' ? '#e03030' : '#c0a060'; if (d.use() !== false && d.stack) removeItem(it); else if (d.use && !d.stack && d.consume) removeItem(it); }

// ---------- the drone (LITTLE CARL) ----------
function launchDrone() { const M = P.map; const e = spawnEnt(M, { k: 'drone', x: P.x + Math.cos(P.aim) * .6, y: P.y + Math.sin(P.aim) * .6, r: .18, small: 1, fly: 1 }); P.drone = e; msg('LITTLE CARL: move with WASD. FIRE to detonate (EMP). E to recall.'); chatSay('little carl!!!', 1); }
function updateDrone(M) {
  const d = P.drone; let mx = 0, my = 0; if (key('KeyW') || key('ArrowUp')) my--; if (key('KeyS') || key('ArrowDown')) my++; if (key('KeyA') || key('ArrowLeft')) mx--; if (key('KeyD') || key('ArrowRight')) mx++;
  const n = Math.hypot(mx, my); if (n) moveBody(M, d, mx / n * DT * (4 + augLvl('drone')), my / n * DT * (4 + augLvl('drone')));
  augTick();
  const end = () => { removeEnt(M, d); P.drone = null; delete P.augOn.drone; };
  if (!P.augOn.drone || P.bio <= 0) { end(); return; }
  if (MOUSE.click || tap('Space') || tap('KeyJ')) { empBlast(M, d.x, d.y, 1.5 + augLvl('drone') * .6); end(); return; }
  if (tap('KeyE') || tap('Escape') || MOUSE.rclick) { end(); msg('LITTLE CARL recalled.'); }
}

// ---------- bodies ----------
function pickBody(M, e) { if (P.carry) return; if (e.big || e.mech) { msg('Too heavy.'); return; } P.carry = e; e.carried = 1; e.hidden = 1; P.held = null; msg('Carrying ' + (e.name || 'body') + '. FIRE or X to drop.'); sfx('thud'); }
function dropBody(M) { const e = P.carry; if (!e) return; e.x = P.x + Math.cos(P.aim) * .5; e.y = P.y + Math.sin(P.aim) * .5; if (!passable(M, e.x, e.y, {})) { e.x = P.x; e.y = P.y; } e.hidden = 0; e.carried = 0; e.bodyFound = 0; P.carry = null; sfx('thud'); makeNoise(M, e.x, e.y, 2, 'body', P); }
