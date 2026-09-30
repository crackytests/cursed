'use strict';
// ================= CARL 2: bongs. every one generated; there's only ONE big one and they keep replacing it =================
const B_SIZE = {
  MINI: { dmg: .7, spd: 1.3, rate: .65, r: 3 }, REGULAR: { dmg: 1, spd: 1, rate: 1, r: 4 }, BIG: { dmg: 1.55, spd: .82, rate: 1.3, r: 6 },
  'FIVE-FOOT': { dmg: 2.1, spd: .7, rate: 1.6, r: 7, pierce: 1 }, 'THE BIG ONE': { dmg: 3, spd: .95, rate: 1.25, r: 8, pierce: 1 },
};
const B_MAT = {
  GLASS: { c: ['#92dbff', '#49a0db', '#dbffff'], dmg: 1, w: 30 }, CERAMIC: { c: ['#db9249', '#a0602a', '#ffdb92'], dmg: 1.25, spd: .88, w: 18 },
  NEON: { c: ['#ff49db', '#b624b6', '#ffb6ff'], spd: 1.25, rate: .8, w: 14 }, PRETZEL: { c: ['#dbb66d', '#a0804a', '#fff0b6'], heal: 1, w: 12 },
  HAUNTED: { c: ['#ffe8e8', '#db9292', '#ffffff'], ghost: 1, w: 8 }, LICENSED: { c: ['#ff92c8', '#db4992', '#ffdbff'], lic: 1, w: 8 },
  LEGACY: { c: ['#8bac0f', '#306230', '#9bbc0f'], legacy: 1, w: 5 }, GOLD: { c: ['#ffdb24', '#c89200', '#ffffb6'], dmg: 1.6, w: 3 },
};
const B_MODS = ['BOOMERANG', 'SPLIT', 'BOUNCY', 'HOMING', 'PIERCE', 'SMOKY', 'SHATTER', 'ARGUMENTATIVE', 'EXTREME'];
const MOD_NAME = { BOOMERANG: 'COMING BACK', SPLIT: 'THREE OPINIONS', BOUNCY: 'BOUNCING BACK', HOMING: 'SEEKING CLOSURE', PIERCE: 'NO BOUNDARIES',
  SMOKY: 'THE HAZE', SHATTER: 'COLLATERAL DAMAGE', ARGUMENTATIVE: 'MILD GRIEVANCE', EXTREME: 'EXTREME ATTITUDE' };
const MOD_INFO = { BOOMERANG: 'Comes back. Like everything.', SPLIT: 'Three at once.', BOUNCY: 'Bounces off walls.', HOMING: 'Finds a target.', PIERCE: 'Goes through people.',
  SMOKY: 'Leaves haze where it breaks.', SHATTER: 'Breaks on everyone nearby.', ARGUMENTATIVE: 'Whoever it hits starts arguing with their friends.', EXTREME: 'x1.5 damage. Committee approved. HUMAN% +2 when equipped.' };
const B_PREFIX = ['LICENSED', 'DISCONTINUED', 'LIMITED EDITION', 'SLIGHTLY USED', 'NON-CANON', 'COLLECTOR\'S', 'BOOTLEG', 'REGIONAL', 'FOCUS-TESTED', 'PRE-OWNED', 'CURSED-ISH', 'EMPLOYEE OF THE MONTH', 'SEQUEL-READY', 'MALL EXCLUSIVE', 'DESERT-WORN', 'UNOPENED'];
const RARITY = { COMMON: '#ffffff', UNCOMMON: '#6dff49', RARE: '#49b6ff', EXTREME: '#ff9224', LEGACY: '#9bbc0f', UNIQUE: '#ff49db' };
let BONGID = 1;
function wpick(o) { let t = 0; for (const k in o) t += o[k].w; let r = Math.random() * t; for (const k in o) { r -= o[k].w; if (r <= 0) return k; } return Object.keys(o)[0]; }
function makeBong(size, mat, mods, lvl, name) {
  const S = B_SIZE[size], M = B_MAT[mat], b = { id: BONGID++, size, mat, mods: mods.slice(), lvl };
  let dmg = (2 + lvl * .7) * S.dmg * (M.dmg || 1); if (mods.includes('EXTREME')) dmg *= 1.5; if (mods.includes('SPLIT')) dmg *= .7;
  b.dmg = Math.max(1, Math.round(dmg * 10) / 10);
  b.spd = 3.3 * S.spd * (M.spd || 1); b.rate = Math.round(22 * S.rate * (M.rate || 1)); b.r = S.r;
  b.pierce = !!(S.pierce || mods.includes('PIERCE'));
  b.rar = size === 'THE BIG ONE' ? 'UNIQUE' : mat === 'LEGACY' ? 'LEGACY' : mods.includes('EXTREME') || mat === 'GOLD' ? 'EXTREME' : mods.length >= 2 ? 'RARE' : mods.length === 1 ? 'UNCOMMON' : 'COMMON';
  b.name = name || ((Math.random() < .45 ? pick(B_PREFIX) + ' ' : '') + (size === 'REGULAR' ? '' : size + ' ') + mat + ' BONG' + (mods.length ? ' OF ' + MOD_NAME[mods[mods.length - 1]] : ''));
  return b;
}
function genBong(lvl = 1, o = {}) {
  const sizes = { MINI: { w: 24 }, REGULAR: { w: 34 }, BIG: { w: 22 }, 'FIVE-FOOT': { w: 6 + lvl } };
  const size = o.size || wpick(sizes), mat = o.mat || wpick(B_MAT);
  const nm = o.mods !== undefined ? o.mods : Math.random() < .12 + lvl * .03 ? 2 : Math.random() < .45 + lvl * .04 ? 1 : 0;
  const mods = Array.isArray(nm) ? nm : []; if (!Array.isArray(nm)) while (mods.length < nm) { const m = pick(B_MODS); if (!mods.includes(m)) mods.push(m); }
  return makeBong(size, mat, mods, lvl);
}
const starterBong = () => makeBong('REGULAR', 'GLASS', [], 1, 'OLD RELIABLE (REPLACEMENT #219)');
const bigOne = () => makeBong('THE BIG ONE', 'GLASS', ['SHATTER', 'BOOMERANG'], 7, 'THE BIG ONE');
// icon sprite per size + material (cached)
const BICON = {};
function bongIcon(b) {
  const k = b.size + '|' + b.mat;
  if (!BICON[k]) { const M = B_MAT[b.mat].c; BICON[k] = { s: bongShape(b.size), P: [0, hex('#101018'), hex(M[0]), hex(M[1]), hex(b.mat === 'LEGACY' ? '#306230' : '#4992db'), hex('#8f8f8f'), hex(M[2])] }; }
  return BICON[k];
}
function drawBong(b, x, y, flipRot) { const ic = bongIcon(b); draw(ic.s, x - ic.s.w / 2, y - ic.s.h / 2, ic.P, flipRot); }
function bongStats(b) { return ['DMG ' + b.dmg, 'SPD ' + b.spd.toFixed(1), 'RATE ' + (60 / b.rate).toFixed(1) + '/S', b.rar]; }
function bongInfo(b) { const M = B_MAT[b.mat]; const bits = []; if (M.heal) bits.push('Heals you a little on hit.'); if (M.ghost) bits.push('Goes through walls.'); if (M.lic) bits.push('Homes in on corporate people.'); if (M.legacy) bits.push('Old cartridge. Extra damage to sequel stuff.'); for (const m of b.mods) bits.push(MOD_INFO[m]); if (b.pierce && !b.mods.includes('PIERCE')) bits.push('Tall enough to go through people.'); return bits.join(' ') || 'A bong. It does what bongs do in this game, which is get thrown.'; }
// the menu: equip / smash (sell) / info
async function bongMenu(shop) {
  for (;;) {
    const L = C2.bongs.map((b, i) => (i === C2.eq ? '*' : ' ') + b.name.slice(0, 34));
    if (!L.length) return;
    const pv = scene; let sel = 0;
    const view = { draw() { pv.draw && pv.draw(); rectA(0, 0, W, H, BLACK, .55); const m = MENUS[MENUS.length - 1]; if (m && m.i >= 0) sel = m.i; const b = C2.bongs[sel]; if (!b) return; panel(8, 150, W - 16, 66); drawBong(b, 30, 182); text(b.name.slice(0, 44), 50, 158, hex(RARITY[b.rar])); text(bongStats(b).join('   '), 50, 170, UI.dim); wrapT(bongInfo(b).toUpperCase(), 44).slice(0, 3).forEach((l, i) => text(l, 50, 182 + i * 10, UI.text)); } };
    scene = view;
    const i = await choose(L, { x: 8, y: 8, cancel: 1 });
    scene = pv;
    if (i < 0) return;
    const b = C2.bongs[i];
    const acts = shop ? ['EQUIP', 'SELL $' + sellPrice(b), 'BACK'] : ['EQUIP', 'SMASH IT', 'BACK'];
    const a = await choose(acts, { x: 200, y: 20 + Math.min(i, 8) * 12, cancel: 1 });
    if (a === 0) { equipBong(i); sfx('ok'); }
    if (a === 1) {
      if (C2.bongs.length <= 1) { await say('That\'s my only one. I need at least one. That\'s the rule. I made it just now.', 'CARL'); continue; }
      if (shop) { C2.bux += sellPrice(b); sfx('get'); } else { sfx('hurt'); banner('SMASHED. IT WAS THE RIGHT CALL.', 70); }
      C2.bongs.splice(i, 1); if (C2.eq >= C2.bongs.length || C2.eq === i) C2.eq = 0; else if (C2.eq > i) C2.eq--;
    }
  }
}
const sellPrice = b => Math.round(3 + b.dmg * 2 + b.mods.length * 6 + (b.rar === 'EXTREME' ? 20 : 0) + (b.rar === 'LEGACY' ? 15 : 0));
function equipBong(i) { C2.eq = i; const b = C2.bongs[i]; if (b.mods.includes('EXTREME') && !b.extremeSeen) { b.extremeSeen = 1; addHuman(2, 'EXTREME BONG'); } }
function giveBong(b, quiet) {
  if (C2.bongs.length >= 8) { const v = sellPrice(b); C2.bux += v; banner('NO ROOM. SOLD "' + b.name.slice(0, 20) + '" FOR $' + v, 120); return false; }
  C2.bongs.push(b); if (!quiet) { banner('GOT: ' + b.name.slice(0, 40), 140); } DBG.bongs = (DBG.bongs || 0) + 1; return true;
}
// BONG-O-MATIC: two go in, one comes out. nobody knows how it decides.
async function bongOMatic() {
  if (C2.bongs.length < 2) return say('BONG-O-MATIC REQUIRES TWO BONGS. IT DOES NOT MAKE EXCEPTIONS. IT HAS BEEN ASKED.', 'BONG CLERK');
  const cost = 25;
  if (C2.bux < cost) return say('Twenty-five bux. The machine doesn\'t take IOUs. It took one once. We don\'t talk about what came out.', 'BONG CLERK');
  await say('PICK THE FIRST BONG.');
  const a = await choose(C2.bongs.map(b => b.name.slice(0, 34)), { x: 8, y: 8, cancel: 1 }); if (a < 0) return;
  await say('PICK THE SECOND BONG.');
  const rest = C2.bongs.map((b, i) => i).filter(i => i !== a);
  const k = await choose(rest.map(i => C2.bongs[i].name.slice(0, 34)), { x: 8, y: 8, cancel: 1 }); if (k < 0) return;
  const A = C2.bongs[a], B = C2.bongs[rest[k]];
  C2.bux -= cost; sfx('power'); post.shake = 2; for (let i = 0; i < 50; i++) { post.flash = (i & 4) ? .3 : 0; await nextFrame(); } post.flash = 0; post.shake = 0;
  const sizes = Object.keys(B_SIZE); const size = sizes[Math.min(3, Math.max(sizes.indexOf(A.size), sizes.indexOf(B.size)) + (Math.random() < .25 ? 1 : 0))];
  const mods = [...new Set([...A.mods, ...B.mods])].sort(() => Math.random() - .5).slice(0, 2); if (mods.length < 2 && Math.random() < .5) { const m = pick(B_MODS); if (!mods.includes(m)) mods.push(m); }
  const lvl = Math.max(A.lvl, B.lvl) + 1, out = makeBong(size, Math.random() < .5 ? A.mat : B.mat, mods, lvl);
  for (const x of [A, B]) C2.bongs.splice(C2.bongs.indexOf(x), 1);
  C2.bongs.push(out); C2.eq = C2.bongs.length - 1; DBG.combined = (DBG.combined || 0) + 1;
  await say('IT CAME OUT: ' + out.name + '. ' + bongStats(out).join(', ') + '.');
  await say(pick(['Oh, that\'s nice. That\'s actually nice. Don\'t tell the machine.', 'It\'s warm. Why is it warm. Machines shouldn\'t make things warm.', 'I don\'t know what it did but I respect it.']), 'CARL');
}
