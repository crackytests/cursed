'use strict';
// ================= SAVE THE WORLD: the game state — party, inventory, levels, crystals, saves =================
let G = null; // the whole save
function newGame() {
  G = { roster: {}, party: [], inv: {}, gp: 0, flags: {}, map: null, x: 0, y: 0, dir: 'd', steps: 0, frames: 0, world: 1,
    crystals: [], gadgets: [], combos: {}, seen: {}, config: { wait: 1, speed: 3, auto: 0, msg: 2 }, chests: {}, obj: null, vehicle: null, ship: null, saves: 0, kills: 0 };
  return G;
}
// a hero joins: level, default kit
function addHero(id, lv = 1, eq) {
  const h = HEROES[id], r = { id, lv, xp: 0, eq: Object.assign({ w: null, a: null, h: null, r1: null, r2: null }, eq || {}), crystal: null, spells: {}, row: 'front', status: {}, aspect: 'kid' };
  r.xp = totalXP(lv);
  r.mhp = heroHP(h, lv); r.mmp = heroMP(h, lv); r.hp = r.mhp; r.mp = r.mmp; r.bonus = { str: 0, mag: 0, spd: 0, vit: 0, mdef: 0, hp: 0 };
  for (const [l, s] of NATURAL[id] || []) if (l <= lv) r.spells[s] = 100;
  G.roster[id] = r; if (G.party.length < 4 && !G.party.includes(id)) G.party.push(id);
  return r;
}
const totalXP = lv => { let t = 0; for (let l = 1; l < lv; l++) t += XPNEED(l); return t; };
const hero = id => G.roster[id];
const inParty = id => G.party.includes(id);
const partyHeroes = () => G.party.map(hero).filter(Boolean);
// effective stats with equipment, level, crystal bonuses
function stats(r) {
  const h = HEROES[r.id], s = { str: heroStat(h.str, r.lv) + r.bonus.str, mag: heroStat(h.mag, r.lv) + r.bonus.mag, spd: heroStat(h.spd, r.lv) + r.bonus.spd,
    vit: heroStat(h.vit, r.lv) + r.bonus.vit, mdef: h.mdef + Math.floor(r.lv / 2) + r.bonus.mdef, def: Math.floor(r.lv / 2), atk: 0, elem: null, block: [], flags: {} };
  if (r.id === 'kid') s.str = 0;
  for (const k of ['w', 'a', 'h', 'r1', 'r2']) {
    const e = EQUIP[r.eq[k]]; if (!e) continue;
    s.atk += e.atk || 0; s.def += e.def || 0; s.mdef += e.mdef || 0; s.str += e.str || 0; s.mag += e.mag || 0; s.spd += e.spd || 0;
    if (e.elem) s.elem = e.elem; if (e.block) s.block.push(...e.block);
    for (const f of ['auto', 'cover', 'gp', 'fewer', 'twice', 'dual', 'reraise', 'escape']) if (e[f]) s.flags[f] = e[f];
  }
  if (!r.eq.w && r.id !== 'kid') s.atk = 4; // bare hands
  return s;
}
// ---------- inventory ----------
const invAdd = (k, n = 1) => { G.inv[k] = (G.inv[k] || 0) + n; if (G.inv[k] <= 0) delete G.inv[k]; };
const invHas = (k, n = 1) => (G.inv[k] || 0) >= n;
const itemName = k => (ITEMS[k] || EQUIP[k] || { name: k.toUpperCase() }).name;
const flag = k => !!G.flags[k];
const setFlag = (k, v = 1) => { G.flags[k] = v; };
// ---------- levels ----------
function giveXP(r, n) {
  const ups = []; r.xp += n;
  while (r.lv < 60 && r.xp >= totalXP(r.lv + 1)) {
    r.lv++; const h = HEROES[r.id], hp0 = r.mhp, mp0 = r.mmp;
    r.mhp = heroHP(h, r.lv) + r.bonus.hp; r.mmp = heroMP(h, r.lv);
    // the equipped crystal gives a little extra on level-up
    const c = CRYSTALS[r.crystal]; if (c) { const b = c.bonus; if (b === 'hp') { r.bonus.hp += Math.round(r.mhp * .04); r.mhp += Math.round(r.mhp * .04); } else if (b === 'all') { for (const k of ['str', 'mag', 'spd', 'vit']) r.bonus[k]++; } else r.bonus[b] = (r.bonus[b] || 0) + 1; }
    r.hp += r.mhp - hp0; r.mp += r.mmp - mp0;
    const learned = []; for (const [l, s] of NATURAL[r.id] || []) if (l === r.lv && !(r.spells[s] >= 100)) { r.spells[s] = 100; learned.push(s); }
    ups.push({ lv: r.lv, learned });
  }
  return ups;
}
// crystal learning after a battle: ap * rate percent per spell
function giveAP(r, ap) {
  const c = CRYSTALS[r.crystal]; if (!c || !ap) return [];
  const got = [];
  for (const [s, rate] of c.spells) { if (!SPELLS[s] || r.spells[s] >= 100) continue; r.spells[s] = Math.min(100, (r.spells[s] || 0) + ap * rate); if (r.spells[s] >= 100) got.push(s); }
  return got;
}
const knownSpells = r => Object.keys(SPELLS).filter(s => r.spells[s] >= 100);
// ---------- saves: three slots (SLOT 1, SLOT 2, SLOT 3) ----------
const SAVEKEY = 'stw_save';
function saveSlots() { return fetchStore(SAVEKEY) || [null, null, null]; }
function saveGame(i) {
  const all = saveSlots(); G.saves++;
  all[i] = { g: JSON.parse(JSON.stringify(G)), when: Date.now(), where: (MAPS[G.map] && MAPS[G.map].name) || 'THE WORLD', lead: G.party[0], lv: hero(G.party[0]) ? hero(G.party[0]).lv : 1, time: G.frames };
  store(SAVEKEY, all); META.saves = (META.saves || 0) + 1; saveMeta();
}
function loadGame(i) { const s = saveSlots()[i]; if (!s) return false; G = JSON.parse(JSON.stringify(s.g)); return true; }
const fmtTime = f => { const s = Math.floor(f / 60), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return h + ':' + String(m).padStart(2, '0'); };
// the meta: endings seen, other games noticed
const META = fetchStore('stw_meta') || { boots: 0, ends: {} };
function saveMeta() { store('stw_meta', META); }
