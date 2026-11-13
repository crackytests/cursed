'use strict';
// ================= CHROME FORCE -- battle: the map, the turns, the diamond menu, the cut-in =================
let B = null;
const BV = { camx: 0, camy: 0, tx: 0, ty: 0, cx: 0, cy: 0, showCur: 0, hl: null, hlc: 0, area: null, info: null, msg: null, cur: null, diamond: null };
const OPT = Object.assign({ msg: 1, cut: true, mus: true }, fetchStore('cf_opt') || {});
let CF_AUTO = false, CF_FAST = false; // the playtest bot flips these

function normMap(rows) { const w = Math.max(...rows.map(r => r.length)); return rows.map(r => (r + r[r.length - 1].repeat(w)).slice(0, w).replace(/ /g, '_')); }
const uById = id => B.units.find(u => u.id === id);
const foeGold = u => Math.round(((u.T || 1) * 7 + 8) * (u.boss ? 5 : 1));

function setupBattle(id) {
  const D = BATTLES[id], map = normMap(D.map);
  B = { id, D, map, w: map[0].length, h: map.length, theme: D.theme, units: [], round: 0, order: [], ti: 0, opened: {}, chests: {}, bossWin: !!D.bossWin, gold: 0, kills: 0, seed: (Math.random() * 1e9) | 0 };
  B.rng = mulberry(B.seed);
  D.chests.forEach(([x, y, it]) => B.chests[x + ',' + y] = it);
  activeRecs().filter(r => !r.dead).slice(0, D.start.length).forEach((r, i) => { const [x, y] = D.start[i]; B.units.push(allyUnit(r, x, y)); });
  D.foes.forEach((f, i) => B.units.push(foeUnit(f, i)));
  B.units.forEach(u => artOf(u.art));
}
function snapshot() { // for SUSPEND
  return { id: B.id, w: B.w, h: B.h, round: B.round, order: B.order, ti: B.ti, opened: B.opened, gold: B.gold, kills: B.kills, seed: B.seed,
    units: B.units.map(u => { const o = Object.assign({}, u); delete o.rec; delete o.art; return o; }) };
}
function restoreBattle(s) {
  setupBattle(s.id);
  if (s.w !== B.w || s.h !== B.h) return; // suspended on an older, smaller map: start the battle fresh
  Object.assign(B, { round: s.round, order: s.order, ti: Math.max(0, s.ti - 1), opened: s.opened, gold: s.gold, kills: s.kills });
  B.rng = mulberry(s.seed + s.round * 977 + s.ti);
  B.units = s.units.map(o => { const u = Object.assign({}, o); if (u.side === 'ally') { u.rec = SAVE.force[u.id]; u.art = HEROES[u.id].art; } else u.art = FOES[u.ft].art; artOf(u.art); return u; });
}

// ---------- camera ----------
function focus(x, y, snap) { BV.tx = clamp(x * 16 - 152, 0, Math.max(0, B.w * 16 - W)); BV.ty = clamp(y * 16 - 104, 0, Math.max(0, B.h * 16 - H)); if (snap || CF_FAST) { BV.camx = BV.tx; BV.camy = BV.ty; } }
async function settleCam() { for (let i = 0; i < 40 && (Math.abs(BV.camx - BV.tx) > 1 || Math.abs(BV.camy - BV.ty) > 1); i++) await nextFrame(); BV.camx = BV.tx; BV.camy = BV.ty; }

// ---------- input repeat ----------
const REP = {};
function dirPressed() {
  for (const [k, dx, dy] of [['up', 0, -1], ['down', 0, 1], ['left', -1, 0], ['right', 1, 0]]) {
    if (pressed[k]) { REP[k] = 0; return [dx, dy]; }
    if (held[k]) { REP[k] = (REP[k] || 0) + 1; if (REP[k] > 12 && REP[k] % 4 === 0) return [dx, dy]; } else REP[k] = 0;
  }
  return null;
}

// ---------- messages on the map ----------
async function bmsg(s, t) {
  if (CF_FAST) return;
  const lines = wrapT(String(s).toUpperCase(), 48); BV.msg = { lines, n: 0 };
  const total = lines.join('').length, sp = [3, 1.2, .6][OPT.msg];
  while (BV.msg.n < total) { if (OKB() || BACKB()) { BV.msg.n = total; break; } BV.msg.n += sp; await nextFrame(); }
  const hold = t !== undefined ? t : [14, 40, 70][OPT.msg];
  for (let i = 0; i < hold; i++) { if (i > 4 && (OKB() || BACKB())) break; await nextFrame(); }
  BV.msg = null;
}

// ---------- the battle loop ----------
async function runBattle(id, resume) {
  if (resume) restoreBattle(resume); else setupBattle(id);
  const D = B.D;
  scene = battleScene; WINS = [];
  const dax = uById('dax'); focus(dax.x, dax.y, 1);
  music(D.music || 'battle');
  await fadeIn(.08);
  if (!resume) {
    // look at the enemy first, like the old carts did
    const boss = B.units.find(u => u.boss) || B.units.find(u => u.side === 'foe');
    if (!CF_FAST && boss) { focus(boss.x, boss.y); await settleCam(); }
    banner(D.n, 120);
    await STORY.pre(id);
    focus(dax.x, dax.y); await settleCam();
  }
  for (;;) {
    if (CF_AUTO && B.round > 80) return endBattle('recall'); // the bot never stalls forever
    if (B.ti >= B.order.length) { B.round++; await reinforce(); B.order = roundOrder(B, B.rng); B.ti = 0; }
    const u = uById(B.order[B.ti]); B.ti++;
    if (!u || u.hp <= 0) continue;
    B.turnUnit = u.id;
    const ev = startTurn(B, u);
    if (u.hp > 0 && ev.length && !CF_FAST) {
      focus(u.x, u.y); await settleCam();
      for (const e of ev) { if (e.regen) await bmsg(u.name + ' SELF-REPAIRS ' + e.regen + ' HP.', 10); if (e.poison) await bmsg(u.name + ' TAKES ' + e.poison + ' POISON DAMAGE.', 10); if (e.asleep) await bmsg(u.name + ' IS ASLEEP.', 10); if (e.woke) await bmsg(u.name + ' WOKE UP.', 10); }
    }
    if (u.st.sleep) continue;
    if (u.side === 'ally' && !CF_AUTO) await playerTurn(u); else await aiTurn(u);
    BV.hl = null; BV.area = null; BV.showCur = 0; BV.info = null;
    if (B.exit) return endBattle(B.exit);
    const r = battleOver(B); if (r) return endBattle(r);
  }
}

// D.waves: [[round, [foe tuples], line?], ...] -- they march in at the start of that round, on the nearest free tile
async function reinforce() {
  const W = (B.D.waves || []).filter(w => w[0] === B.round);
  for (const [, list, line] of W) {
    const fresh = [];
    for (const f of list) {
      let [x, y] = [f[1], f[2]];
      for (let r = 0; r < 5 && (unitAt(B, x, y) || moveCost(FOES[f[0]].mt, tileAt(B, x, y)) >= X); r++) { // nudge off taken tiles
        const c = [[r, 0], [-r, 0], [0, r], [0, -r], [r, r], [-r, -r]].map(([dx, dy]) => [f[1] + dx, f[2] + dy]).find(([a, b]) => !unitAt(B, a, b) && moveCost(FOES[f[0]].mt, tileAt(B, a, b)) < X);
        if (c) [x, y] = c;
      }
      if (unitAt(B, x, y)) continue;
      const u = foeUnit([f[0], x, y, f[3], f[4], f[5]], 'w' + B.round + '_' + B.units.length); artOf(u.art); B.units.push(u); fresh.push(u);
    }
    if (!fresh.length || CF_FAST) continue;
    focus(fresh[0].x, fresh[0].y); await settleCam(); sfx('stun');
    await bmsg(line || 'ENEMY REINFORCEMENTS!', 50);
  }
}

async function endBattle(r) {
  const D = B.D, id = B.id;
  B.units.filter(u => u.side === 'ally').forEach(u => { u.rec.dead = u.hp <= 0 && u.id !== 'dax' ? 1 : u.rec.dead; });
  if (r === 'suspend') { saveGame(); return 'suspend'; }
  SAVE.suspend = null;
  if (r === 'win') {
    music('victory');
    await bmsg('VICTORY!', 50);
    SAVE.gold += B.gold; SAVE.stats.battles++; SAVE.stats.kills += B.kills;
    if (B.gold) await bmsg('THE FORCE COLLECTS ' + B.gold + ' GOLD.', 30);
    SAVE.flags['won_' + id] = 1;
    await STORY.post(id, B);
    await fadeOut(.08);
    return 'win';
  }
  if (r === 'recall') { await bmsg('THE FORCE RECALLS TO SAFETY.', 30); await fadeOut(.08); return 'recall'; }
  music('defeat');
  await bmsg('DAX HAS FALLEN...', 60);
  SAVE.gold = Math.floor(SAVE.gold / 2); SAVE.stats.defeats++;
  await fadeOut(.04);
  return 'lose';
}

// ---------- animation helpers ----------
async function walk(u, path) {
  for (let i = 1; i < path.length; i++) {
    const [x, y] = path[i], dx = x - u.x, dy = y - u.y; u.x = x; u.y = y; u.face = dx < 0 ? -1 : dx > 0 ? 1 : u.face;
    if (CF_FAST) continue;
    focus(u.x, u.y);
    for (let f = 3; f >= 0; f--) { u.ox = -dx * 4 * f; u.oy = -dy * 4 * f; await nextFrame(); }
    if (i % 2) sfx('step');
  }
  u.ox = u.oy = 0;
}

// ---------- player turn ----------
async function playerTurn(u) {
  const ox = u.x, oy = u.y;
  focus(u.x, u.y); await settleCam();
  for (;;) {
    const px = u.x, py = u.y; u.x = ox; u.y = oy; const R = reach(B, u); u.x = px; u.y = py; // range always counts from where the turn began
    BV.hl = new Set(R.all); BV.hlc = 0; BV.showCur = 1; BV.cx = u.x; BV.cy = u.y; BV.info = u;
    sfx('ask');
    for (;;) { // move phase: the cursor roams the lit tiles (over friends too); the unit follows onto free ones
      await nextFrame();
      const d = dirPressed();
      if (d) { const nx = BV.cx + d[0], ny = BV.cy + d[1];
        if (BV.hl.has(nx + ',' + ny)) { BV.cx = nx; BV.cy = ny; if (d[0]) u.face = d[0]; if (!unitAtExcept(nx, ny, u)) { u.x = nx; u.y = ny; } focus(nx, ny); sfx('step'); } }
      if (BACKB()) { if (BV.cx !== ox || BV.cy !== oy) { u.x = ox; u.y = oy; BV.cx = ox; BV.cy = oy; focus(ox, oy); sfx('tick'); } }
      if (pressed.start && BV.cx === ox && BV.cy === oy) { BV.hl = null; await battleMenu(); if (B.exit) return; break; }
      if (OKB()) { if (unitAtExcept(BV.cx, BV.cy, u)) sfx('tick'); else { u.x = BV.cx; u.y = BV.cy; break; } }
    }
    if (!BV.hl) continue; // came back from battle menu: rebuild
    BV.hl = null;
    const done = await actionMenu(u);
    if (done) return;
    if (B.exit) return;
  }
}
const unitAtExcept = (x, y, u) => { const o = unitAt(B, x, y); return o && o !== u ? o : null; };

const DIAMOND = [['attack', 0, -1], ['magic', -1, 0], ['item', 1, 0], ['stay', 0, 1]];
async function actionMenu(u) {
  const chest = B.chests[u.x + ',' + u.y] && !B.opened[u.x + ',' + u.y];
  const items = DIAMOND.map(d => d[0] === 'stay' && chest ? ['search', 0, 1] : d);
  let sel = 0; BV.diamond = { items, sel: 0 };
  await nextFrame();
  for (;;) {
    const d = dirPressed();
    if (d) { const k = items.findIndex(it => it[1] === d[0] && it[2] === d[1]); if (k >= 0) { sel = k; BV.diamond.sel = k; sfx('move'); } }
    if (BACKB()) { BV.diamond = null; sfx('tick'); return false; }
    if (OKB()) {
      const what = items[sel][0]; BV.diamond = null; sfx('ok');
      let r = false;
      if (what === 'attack') r = await chooseAttack(u);
      if (what === 'magic') r = await chooseMagic(u);
      if (what === 'item') r = await chooseItem(u);
      if (what === 'stay') r = true;
      if (what === 'search') { await searchChest(u); r = true; }
      if (r) return true;
      BV.diamond = { items, sel };
    }
    await nextFrame();
  }
}

async function pickTarget(u, cands, o = {}) { // cycle through candidate units/tiles; returns one or null
  if (!cands.length) { await bmsg(o.none || 'NO TARGET IN RANGE.', 20); return null; }
  let i = 0; BV.showCur = 1;
  const set = () => { const c = cands[i]; BV.cx = c.x; BV.cy = c.y; BV.info = unitAt(B, c.x, c.y) || null; BV.area = o.area ? areaTiles(c.x, c.y, o.area) : null; focus(c.x, c.y); };
  set(); await nextFrame();
  for (;;) {
    const d = dirPressed();
    if (d) { i = (i + (d[0] + d[1] > 0 ? 1 : cands.length - 1)) % cands.length; set(); sfx('move'); }
    if (BACKB()) { BV.area = null; sfx('tick'); BV.cx = u.x; BV.cy = u.y; BV.info = u; focus(u.x, u.y); return null; }
    if (OKB()) { BV.area = null; return cands[i]; }
    await nextFrame();
  }
}
async function chooseAttack(u) {
  const t = await pickTarget(u, foesOf(B, u).filter(f => inRange(u, f, u.wr)));
  if (!t) return false;
  const R = doAttack(B, u, t, B.rng); await playRecord(R); return true;
}
async function chooseMagic(u) {
  const ids = Object.keys(u.spells || {});
  if (!ids.length) { await bmsg(u.name + ' KNOWS NO SPELLS.', 20); return false; }
  // start each spell at the strongest level you can pay for; LEFT/RIGHT picks any lower level
  const lv = {}; ids.forEach(k => { let l = u.spells[k]; while (l > 1 && spellInfo(k, l).mp > u.mp) l--; lv[k] = l; });
  const opts = () => ids.map(k => { const s = spellInfo(k, lv[k]), max = u.spells[k]; return { t: k + ' ' + (max > 1 ? (lv[k] > 1 ? '<' : ' ') + 'LV' + lv[k] + (lv[k] < max ? '>' : '') : 'LV1'), r: s.mp + 'MP', dis: s.mp > u.mp }; });
  const multi = ids.some(k => u.spells[k] > 1), hint = () => { panel(8, 104, 160, 16); text('LEFT/RIGHT: SPELL LEVEL', 16, 108, UI.dim); };
  let o = opts(), k;
  for (;;) {
    if (multi) WINS.push(hint);
    k = await menu(o, { title: 'MAGIC  MP ' + u.mp + '/' + u.mmp, x: 8, y: 120, w: 160, lr: (i, d) => { lv[ids[i]] = clamp(lv[ids[i]] + d, 1, u.spells[ids[i]]); opts().forEach((n, j) => Object.assign(o[j], n)); } }); // menu() keeps these row objects, so update them in place
    if (multi) WINS.splice(WINS.indexOf(hint), 1);
    if (k < 0) return false;
    const sp = spellInfo(ids[k], lv[ids[k]]);
    if (sp.kind === 'recall') { if (await confirm('RECALL THE FORCE?')) { u.mp -= sp.mp; B.exit = 'recall'; return true; } continue; }
    const tiles = []; for (let y = u.y - sp.r; y <= u.y + sp.r; y++) for (let x = u.x - sp.r; x <= u.x + sp.r; x++) if (Math.abs(x - u.x) + Math.abs(y - u.y) <= sp.r && spellTargets(B, u, sp, x, y).length) tiles.push({ x, y });
    const hostile = sp.kind === 'dmg' || sp.kind === 'debuff' || sp.kind === 'kill';
    tiles.sort((a, b) => (unitAt(B, b.x, b.y) ? 1 : 0) - (unitAt(B, a.x, a.y) ? 1 : 0));
    const t = await pickTarget(u, tiles.filter(p => unitAt(B, p.x, p.y)), { area: sp.area, none: hostile ? 'NO TARGET IN RANGE.' : 'NO ONE TO HELP IN RANGE.' });
    if (!t) continue;
    const R = doSpell(B, u, sp, t.x, t.y, B.rng); await playRecord(R); return true;
  }
}
async function chooseItem(u) {
  const r = u.rec;
  for (;;) {
    if (!r.items.length) { await bmsg(u.name + ' HAS NO ITEMS.', 20); return false; }
    const k = await itemMenu(r.items.map(itemLabel), r.items.map(it => it.id), { title: 'ITEM', x: 8, y: 120, w: 150 }); if (k < 0) return false;
    const it = r.items[k], d = ITEMS[it.id];
    const a = await menu([{ t: 'USE', dis: d.k !== 'use' }, 'GIVE', { t: 'EQUIP', dis: d.k === 'use' || !canEquip(r, it.id) }, { t: 'DROP', dis: !!d.rare }], { x: 164, y: 120 });
    if (a < 0) continue;
    if (a === 0) {
      if (d.fx === 'recall') { if (await confirm('RECALL THE FORCE?')) { r.items.splice(k, 1); B.exit = 'recall'; return true; } continue; }
      const near = friendsOf(B, u).filter(v => dist(v, u) <= 1);
      const t = await pickTarget(u, near); if (!t) continue;
      r.items.splice(k, 1);
      let line = '';
      if (d.fx === 'heal') { const h = Math.min(t.mhp - t.hp, d.p); t.hp += h; line = t.name + ' RECOVERS ' + h + ' HP.'; }
      if (d.fx === 'mp') { const h = Math.min(t.mmp - t.mp, d.p); t.mp += h; line = t.name + ' RECOVERS ' + h + ' MP.'; }
      if (d.fx === 'cure') { delete t.st.poison; delete t.st.slow; delete t.st.sleep; line = t.name + ' IS CURED.'; }
      if (d.fx === 'stat') { t.rec[d.s] += d.p; if (d.s === 'mhp') { t.mhp += d.p; t.hp += d.p; } else t[d.s] += d.p; line = t.name + "'S " + d.s.replace('mhp', 'HP').toUpperCase() + ' RISES BY ' + d.p + '!'; }
      sfx('get'); await bmsg(u.name + ' USES THE ' + d.n + '. ' + line, 30); return true;
    }
    if (a === 1) {
      const near = friendsOf(B, u).filter(v => v !== u && dist(v, u) <= 1);
      const t = await pickTarget(u, near, { none: 'NO ONE ADJACENT.' }); if (!t) continue;
      if (t.rec.items.length >= 4) { await bmsg(t.name + "'S HANDS ARE FULL.", 20); continue; }
      r.items.splice(k, 1); it.eq = 0; t.rec.items.push(it); syncUnit(u); await bmsg(u.name + ' GIVES THE ' + d.n + ' TO ' + t.name + '.', 20); return true;
    }
    if (a === 2) { equip(r, k); syncUnit(u); await bmsg(u.name + (it.eq ? ' EQUIPS THE ' : ' UNEQUIPS THE ') + d.n + '.', 20); continue; }
    if (a === 3 && await confirm('DROP ' + d.n + '?')) { r.items.splice(k, 1); syncUnit(u); return true; }
  }
}
function syncUnit(u) { const e = effStats(u.rec); u.atk = e.atk; u.def = e.def; u.agi = e.agi; u.mov = e.mov; u.wr = e.wr; }
async function searchChest(u) {
  const k = u.x + ',' + u.y, it = B.chests[k]; B.opened[k] = 1; sfx('door');
  if (it.startsWith('arch:')) { await bmsg(u.name + ' SEARCHES THE CACHE...', 20); await archiveFind(it.slice(5)); return; }
  if (giveItem(u.rec, it)) await bmsg(u.name + ' FOUND THE ' + ITEMS[it].n + '!', 40);
  else { SAVE.depot.push(it); await bmsg(u.name + ' FOUND THE ' + ITEMS[it].n + '. HANDS FULL: SENT TO THE DEPOT.', 40); }
  sfx('get');
}
async function battleMenu() {
  for (;;) {
    const a = await menu(['MEMBERS', 'MAP', 'OPTIONS', 'SUSPEND', 'BACK'], { x: 220, y: 8 });
    if (a < 0 || a === 4) return;
    if (a === 0) {
      const us = B.units.filter(v => v.side === 'ally');
      const i = await menu(us.map(v => ({ t: v.name, r: v.hp > 0 ? v.hp + '/' + v.mhp : 'DOWN', c: v.hp > 0 ? undefined : COL.red })), { title: 'MEMBERS', x: 8, y: 8, w: 180, rows: 12 });
      if (i >= 0) await showStatus(us[i].rec);
    }
    if (a === 1) await freeLook();
    if (a === 2) await options();
    if (a === 3 && await confirm('SAVE AND QUIT TO TITLE?')) { SAVE.suspend = snapshot(); B.exit = 'suspend'; return; }
  }
}
async function freeLook() {
  const t = uById(B.turnUnit); BV.showCur = 1; BV.cx = t.x; BV.cy = t.y;
  await nextFrame();
  for (;;) {
    const d = dirPressed(); if (d) { BV.cx = clamp(BV.cx + d[0], 0, B.w - 1); BV.cy = clamp(BV.cy + d[1], 0, B.h - 1); focus(BV.cx, BV.cy); }
    BV.info = unitAt(B, BV.cx, BV.cy) || null;
    if (OKB() && BV.info && BV.info.side === 'ally') await showStatus(BV.info.rec);
    if (BACKB() || pressed.start) break;
    await nextFrame();
  }
  BV.info = t; BV.cx = t.x; BV.cy = t.y; focus(t.x, t.y);
}

// ---------- AI turn (enemies, and allies when the bot drives) ----------
async function aiTurn(u) {
  const plan = planAI(B, u, { cautious: u.side === 'ally' });
  if (!plan) return;
  if (!CF_FAST) { focus(u.x, u.y); await settleCam(); BV.info = u; await wait(6); }
  if (plan.x !== u.x || plan.y !== u.y) { const R = reach(B, u); await walk(u, R.has(plan.x, plan.y) ? R.path(plan.x, plan.y) : [[u.x, u.y], [plan.x, plan.y]]); }
  if (!CF_FAST) await wait(4);
  if (!plan.act) {
    if (u.side === 'ally') { const k = u.x + ',' + u.y; if (B.chests[k] && !B.opened[k]) await searchChest(u); }
    return;
  }
  if (plan.act.type === 'attack') { const t = uById(plan.act.target); if (t && t.hp > 0) await playRecord(doAttack(B, u, t, B.rng)); }
  else { const sp = spellInfo(plan.act.id, plan.act.lv); if (sp.mp <= u.mp) await playRecord(doSpell(B, u, sp, plan.act.tx, plan.act.ty, B.rng)); }
}

// ---------- resolving a record: the cut-in, then exp ----------
async function playRecord(R) {
  const a = uById(R.a);
  if (!CF_FAST && OPT.cut) await cutin(R); else if (!CF_FAST) await quickRecord(R);
  // deaths and loot
  for (const s of R.seq) { const t = uById(s.to); if (t && t.hp <= 0 && !t.counted) { t.counted = 1; if (t.side === 'foe') { B.gold += foeGold(t); B.kills++; } } }
  // experience
  for (const id in R.exp) {
    const v = uById(id); if (!v || v.side !== 'ally' || v.hp <= 0 && id !== 'dax') continue;
    const ups = gainExp(v.rec, R.exp[id], B.rng);
    if (!CF_FAST) await bmsg(v.name + ' GAINS ' + R.exp[id] + ' EXP.', 12);
    for (const up of ups) {
      const g = up.gain; if (g.mhp) { v.mhp += g.mhp; v.hp += g.mhp; } if (g.mmp) { v.mmp += g.mmp; v.mp += g.mmp; }
      syncUnit(v); v.lv = up.lv; v.spells = Object.assign({}, v.rec.spells);
      if (!CF_FAST) { sfx('get'); music_sting('level'); await bmsg(v.name + ' REACHES LEVEL ' + up.lv + '! ' + Object.keys(g).map(k => k.replace('mhp', 'HP').replace('mmp', 'MP').toUpperCase() + '+' + g[k]).join(' '), 40); for (const l of up.learned) await bmsg(v.name + ' LEARNED ' + l + '!', 30); }
    }
  }
}
const nameOf = id => (uById(id) || {}).name || '?';
async function quickRecord(R) {
  for (const s of R.seq) {
    const t = uById(s.to);
    if (s.miss) await bmsg(nameOf(s.by || R.a) + ' MISSES ' + t.name + '.', 8);
    else if (s.heal !== undefined) { if (s.heal) await bmsg(t.name + ' RECOVERS ' + s.heal + ' HP.', 8); }
    else if (s.st) await bmsg(t.name + (s.miss ? ' RESISTS.' : ' IS AFFECTED: ' + s.st.toUpperCase() + '.'), 8);
    else if (s.dmg !== undefined) await bmsg((s.crit ? 'CRITICAL! ' : '') + t.name + ' TAKES ' + s.dmg + ' DAMAGE.' + (s.kill ? ' DESTROYED!' : ''), 8);
  }
}

// ---------- map drawing ----------
const battleScene = {
  update() {
    BV.camx += (BV.tx - BV.camx) * .25; BV.camy += (BV.ty - BV.camy) * .25;
    if (Math.abs(BV.tx - BV.camx) < .5) BV.camx = BV.tx; if (Math.abs(BV.ty - BV.camy) < .5) BV.camy = BV.ty;
  },
  draw() { drawBattleMap(); drawWins(); drawBattleHud(); },
};
function drawBattleMap() {
  const cx = Math.round(BV.camx), cy = Math.round(BV.camy), x0 = (cx / 16) | 0, y0 = (cy / 16) | 0;
  cls(BLACK);
  for (let ty = y0; ty <= y0 + 14 && ty < B.h; ty++) for (let tx = x0; tx <= x0 + 20 && tx < B.w; tx++) { const t = tileAtMap(B.map, tx, ty, B.theme); draw(t.s, tx * 16 - cx, ty * 16 - cy, t.P); }
  const tp = TILEPAL[B.theme] || TILEPAL.waste;
  for (const k in B.chests) { if (B.opened[k]) continue; const [x, y] = k.split(',').map(Number); draw(CHEST, x * 16 - cx, y * 16 - cy, tp); }
  if (BV.hl) { const a = .28 + Math.sin(frame * .15) * .12, c = hex('#ffffff'); for (const k of BV.hl) { const [x, y] = k.split(',').map(Number); rectA(x * 16 - cx, y * 16 - cy, 16, 16, c, a); } }
  if (BV.area) { const c = hex('#ff2449'); for (const [x, y] of BV.area) rectA(x * 16 - cx, y * 16 - cy, 16, 16, c, .35 + Math.sin(frame * .2) * .1); }
  const us = B.units.filter(u => u.hp > 0).sort((a, b) => a.y - b.y);
  for (const u of us) {
    const a = u.art, f = ((frame + u.x * 7) >> 4) & 1, s = mSprite(a, B.turnUnit === u.id ? (frame >> 3) & 1 : f);
    const px = u.x * 16 - cx + (u.ox || 0), py = u.y * 16 - cy + (u.oy || 0);
    if (px < -16 || py < -16 || px > W || py > H) continue;
    const sc = u.side === 'foe' ? hex('#6d0024') : hex('#002492'); rectA(px + 2, py + 13, 12, 3, sc, .75); rectA(px + 4, py + 12, 8, 1, sc, .5);
    drawUnit(s, px, py, a.P, u.side === 'foe' ? u.face !== 1 : u.face === -1);
    if (u.st.sleep && (frame >> 4) & 1) text('Z', px + 12, py - 12, WHITE);
    if (u.st.poison && (frame >> 4) & 1) rectF(px + 1, py + 1, 2, 2, hex('#b624ff'));
  }
  if (BV.showCur) { const x = BV.cx * 16 - cx, y = BV.cy * 16 - cy, o = (frame >> 3) & 1, c = UI.name;
    for (const [ax, ay, sx, sy] of [[x - o, y - o, 1, 1], [x + 15 + o, y - o, -1, 1], [x - o, y + 15 + o, 1, -1], [x + 15 + o, y + 15 + o, -1, -1]]) { rectF(sx > 0 ? ax : ax - 3, ay, 4, 1, c); rectF(ax, sy > 0 ? ay : ay - 3, 1, 4, c); } }
}
function unitBox(u, x, y) {
  panel(x, y, 112, u.mmp && u.mmp < 99 ? 44 : 34);
  text(u.name.slice(0, 16), x + 6, y + 6, u.side === 'ally' ? UI.name : COL.red);
  text((u.side === 'ally' ? CLS[u.cls].ab : 'LV') + ' ' + (u.side === 'ally' ? u.lv : Math.round(u.T)), x + 6, y + 16, UI.dim);
  text('HP', x + 6, y + 25, COL.hp); bar(x + 22, y + 27, 50, u.hp, u.mhp, COL.hp); text(u.hp + '/' + u.mhp, x + 76, y + 25, UI.text);
  if (u.mmp && u.mmp < 99) { text('MP', x + 6, y + 35, COL.mp); bar(x + 22, y + 37, 50, u.mp, u.mmp, COL.mp); text(u.mp + '/' + u.mmp, x + 76, y + 35, UI.text); }
}
function drawBattleHud() {
  if (BV.info && BV.info.hp > 0) { const u = BV.info, sx = u.x * 16 - BV.camx; unitBox(u, sx > 160 ? 6 : W - 118, 6); }
  if (BV.showCur && !BV.diamond && B) { const c = B.map[BV.cy] && B.map[BV.cy][BV.cx]; if (c) { const u = unitAt(B, BV.cx, BV.cy), le = u && u.mt === 'fly' ? 0 : LAND[c] || 0; panel(6, H - 30, 98, 24); text(TNAME[c] || '', 12, H - 25, UI.text); text('LAND ' + le + '%', 12, H - 16, UI.dim); } }
  if (BV.diamond) {
    const cxm = 160, cym = 172, D = BV.diamond;
    panel(cxm - 52, cym - 40, 104, 82);
    D.items.forEach(([k, dx, dy], i) => { const x = cxm - 12 + dx * 30, y = cym - 12 + dy * 26, sel = i === D.sel; if (sel) { rectF(x - 2, y - 2, 28, 28, hex('#ffdb49')); rectF(x - 1, y - 1, 26, 26, hex('#000024')); } draw(ICON[k], x, y - (sel && (frame >> 3) & 1 ? 1 : 0), ICONPAL); });
    const lab = D.items[D.sel][0].toUpperCase(), lw = lab.length * 6 + 16; panel(cxm - (lw >> 1), cym - 58, lw, 16); ctext(lab, cym - 54, UI.name);
  }
  if (BV.msg) { const m = BV.msg; panel(4, H - 46, W - 8, 42); let n = m.n | 0; m.lines.slice(0, 3).forEach((l, i) => { text(l.slice(0, Math.max(0, n)), 12, H - 40 + i * 11, UI.text); n -= l.length; }); }
}

// ======================= THE CUT-IN =======================
const CUTBG = {
  waste: { sky: ['#240000', '#db6d24'], sun: '#ffdb49', grid: '#ff6d24', gnd: '#240000', sil: '#000000', far: '#490000' },
  glass: { sky: ['#000024', '#249292'], sun: '#dbffff', grid: '#49ffb6', gnd: '#002424', sil: '#002424', far: '#004949' },
  ash: { sky: ['#000000', '#6d6d92'], sun: '#ffb6b6', grid: '#b6b6db', gnd: '#242424', sil: '#000000', far: '#24244d' },
  iron: { sky: ['#000000', '#b60000'], sun: '#ffdb24', grid: '#ff2400', gnd: '#240000', sil: '#000000', far: '#490000' },
  grid: { sky: ['#002449', '#b6ffff'], sun: '#ffffff', grid: '#24dbff', gnd: '#002424', sil: '#24496d', far: '#49b6db' },
  flesh: { sky: ['#240024', '#db4992'], sun: '#ffdbff', grid: '#ff49b6', gnd: '#240024', sil: '#000000', far: '#490049' },
  void: { sky: ['#000000', '#6d24b6'], sun: '#ff92ff', grid: '#b624ff', gnd: '#000024', sil: '#000000', far: '#240049' },
};
const CUT = { on: 0, L: null, R: null, lp: 'idle', rp: 'idle', lx: 0, rx: 0, lfx: null, rfx: null, fx: [], parts: [], msg: null, nums: [], shake: 0, flash: 0, diss: {} };
function cutDraw() {
  const T = CUTBG[B.theme] || CUTBG.waste, sh = CUT.shake ? (rnd(CUT.shake * 2 + 1) - CUT.shake) : 0;
  skyD(0, 120, T.sky[0], T.sky[1]);
  // the sun, cut by horizontal lines (every album cover in 1986)
  const sc = hex(T.sun); for (let y = -30; y <= 30; y++) { if (y > 4 && ((y >> 1) % 3 === 0)) continue; const w = Math.sqrt(900 - y * y) | 0; rectF(160 - w, 92 + y, w * 2, 1, sc); }
  // far silhouette ridge + theme pillars
  const far = hex(T.far), sil = hex(T.sil);
  for (let x = 0; x < W; x++) { const h = 14 + Math.sin(x * .03 + B.theme.length) * 8 + Math.sin(x * .11) * 4; rectF(x, 120 - h, 1, h, far); }
  for (let i = 0; i < 7; i++) { const x = (i * 53 + 17) % W, h = 20 + (i * 37) % 30; if (B.theme === 'waste' || B.theme === 'iron') { for (let a = 0; a < 3.14; a += .04) pset(x + Math.cos(a) * 18, 120 - Math.sin(a) * h, sil); } else if (B.theme === 'ash') { rectF(x, 120 - h - 20, 2, h + 20, sil); lineF(x - 8, 120, x, 120 - h - 20, sil); lineF(x + 9, 120, x + 1, 120 - h - 20, sil); } else if (B.theme === 'grid' || B.theme === 'void') { rectF(x - 3, 120 - h - 10, 6, h + 10, sil); } else rectF(x - 2, 120 - h, 4, h, sil); }
  // ground: synthwave perspective grid
  rectF(0, 120, W, H - 120, hex(T.gnd)); const gc = hex(T.grid);
  for (let k = 0; k < 9; k++) { const y = 120 + Math.pow(k / 8, 2) * 104 + ((frame % 20) / 20) * 0; rectF(0, y | 0, W, 1, gc); }
  for (let k = -12; k <= 12; k++) lineF(160 + k * 6, 120, 160 + k * 60, H, gc);
  // fighters
  const drawF = (u, pose, x, flip, side) => {
    if (!u) return; const s = bSprite(u.art, pose), y = 176 - s.h + 4, dk = CUT.diss[side];
    if (dk) { drawDiss(s, x + sh, y, u.art.P, flip, dk); return; }
    draw(s, x + (side === 'L' ? sh : -sh), y, u.art.P, flip, CUT.flash && CUT.flashSide === side && (frame & 2) ? WHITE : 0);
  };
  const ls = CUT.L && bSprite(CUT.L.art, CUT.lp), rs = CUT.R && bSprite(CUT.R.art, CUT.rp);
  drawF(CUT.L, CUT.lp, 6 + CUT.lx, false, 'L');
  drawF(CUT.R, CUT.rp, W - 6 - (rs ? rs.w : 0) + CUT.rx, true, 'R');
  for (const f of CUT.fx) f.d(f);
  for (const p of CUT.parts) rectF(p.x, p.y, p.s || 2, p.s || 2, p.c);
  for (const n of CUT.nums) text(n.s, n.x, n.y, n.c, BLACK, 2);
  // top boxes
  if (CUT.L) cutBox(CUT.L, 4, 4); if (CUT.R) cutBox(CUT.R, W - 124, 4);
  if (CUT.msg) { panel(4, H - 44, W - 8, 40); let n = CUT.msg.n | 0; CUT.msg.lines.slice(0, 2).forEach((l, i) => { text(l.slice(0, Math.max(0, n)), 14, H - 36 + i * 12, UI.text); n -= l.length; }); }
}
function cutBox(u, x, y) {
  const hp = CUT.hp && CUT.hp[u.id] !== undefined ? CUT.hp[u.id] : u.hp;
  panel(x, y, 120, 34); text(u.name.slice(0, 17), x + 6, y + 6, u.side === 'ally' ? UI.name : COL.red);
  text('HP', x + 6, y + 18, COL.hp); bar(x + 22, y + 20, 56, hp, u.mhp, COL.hp); text(String(hp), x + 84, y + 18, UI.text);
  if (u.mmp && u.mmp < 99) { bar(x + 22, y + 26, 56, u.mp, u.mmp, COL.mp); }
}
function drawDiss(s, x, y, P, flip, k) { // death: the chrome comes apart pixel by pixel, sliding up
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const c = s.d[j * s.w + (flip ? s.w - 1 - i : i)]; if (!c) continue; const h = hsh(i, j, 3); if (h < k) continue; const yy = y + j - Math.round((k - h + 1) * 0); pset(x + i + (h < k + .1 ? rnd(3) - 1 : 0), yy - (h < k + .15 ? rnd(4) : 0), P[c]); }
}
const cutScene = { update() { cutTick(); }, draw() { cutDraw(); } };
function cutTick() {
  CUT.parts = CUT.parts.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += p.g || .15; return --p.life > 0; });
  CUT.nums.forEach(n => { n.y -= .5; n.t--; }); CUT.nums = CUT.nums.filter(n => n.t > 0);
  CUT.fx = CUT.fx.filter(f => { f.t++; return f.t < f.life; });
  if (CUT.shake) CUT.shake = Math.max(0, CUT.shake - .25);
}
async function cmsg(s, hold) {
  const lines = wrapT(String(s).toUpperCase(), 48); CUT.msg = { lines, n: 0 }; const total = lines.join('').length, sp = [3, 1.4, .7][OPT.msg];
  while (CUT.msg.n < total) { if (OKB() || BACKB()) { CUT.msg.n = total; break; } CUT.msg.n += sp; await nextFrame(); }
  const h = hold !== undefined ? hold : [10, 26, 50][OPT.msg]; for (let i = 0; i < h; i++) { if (i > 3 && (OKB() || BACKB())) break; await nextFrame(); }
}
function sparks(x, y, c1, c2, n = 14) { for (let i = 0; i < n; i++) { const a = rnd(628) / 100, v = 1 + rnd(30) / 10; CUT.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 14 + rnd(12), c: i & 1 ? c1 : c2, s: 1 + (i % 3 === 0) }); } }
function slashFx(side, glow) { // a laser arc drawn across the defender
  const g = hex(glow[1]), core = hex(glow[0]);
  CUT.fx.push({ t: 0, life: 9, d(f) { const cx = side === 'R' ? 210 : 110, cy = 120, r = 46, k = f.t / 9; for (let a = -2.3; a < -2.3 + 2.6 * Math.min(1, k * 2); a += .02) { const dir = side === 'R' ? -1 : 1, x = cx + Math.cos(a) * r * dir, y = cy + Math.sin(a) * r + 20; if (f.t > 6 && ((a * 50) | 0) % 3) continue; rectF(x - 1, y - 1, 3, 3, g); pset(x, y, core); } } });
}
function beamFx(fromSide, glow) {
  const g = hex(glow[1]), core = hex(glow[0]);
  CUT.fx.push({ t: 0, life: 10, d(f) { const x0 = fromSide === 'R' ? 220 : 100, x1 = fromSide === 'R' ? 70 : 250, y = 116 + Math.sin(f.t) * 1; const k = Math.min(1, f.t / 4); const xe = x0 + (x1 - x0) * k; rectF(Math.min(x0, xe), y - 1, Math.abs(xe - x0), 3, g); rectF(Math.min(x0, xe), y, Math.abs(xe - x0), 1, core); } });
}
const GLOWC = a => GLOW[a.pc[3]] || GLOW.cyan;
function spellFx(sp, side) { // side = where the target stands
  const tx = side === 'R' ? 250 : 70, ty = 120;
  if (sp.el === 'fire') for (let i = 0; i < 6; i++) CUT.fx.push({ t: -i * 3, life: 26, d(f) { if (f.t < 0) return; const r = Math.min(18, f.t * 1.4), x = tx + Math.sin(i * 2.1) * 20, y = ty + Math.cos(i * 1.7) * 18 - f.t * .6; circF(x, y, r, hex('#ff9200')); circF(x, y, r * .6, hex('#ffdb24')); circF(x, y, r * .25, WHITE); } });
  else if (sp.el === 'ice') for (let i = 0; i < 8; i++) CUT.fx.push({ t: -i * 2, life: 24, d(f) { if (f.t < 0) return; const x = tx - 30 + i * 9, y = Math.min(ty + 20, -10 + f.t * 12); triF(x, y - 14, x - 4, y, x + 4, y, hex('#b6ffff')); lineF(x, y - 12, x, y, WHITE); } });
  else if (sp.el === 'bolt') CUT.fx.push({ t: 0, life: 18, d(f) { if (f.t % 4 > 1) return; let x = tx, y = 0; while (y < ty + 20) { const nx = x + rnd(21) - 10, ny = y + 10 + rnd(10); lineF(x, y, nx, ny, WHITE); lineF(x + 1, y, nx + 1, ny, hex('#ffff49')); x = nx; y = ny; } } });
  else if (sp.kind === 'heal') CUT.fx.push({ t: 0, life: 36, d(f) { for (let i = 0; i < 12; i++) { const x = tx + Math.sin(i * 1.9 + f.t * .1) * 26, y = ty + 40 - ((f.t * 2 + i * 9) % 70); rectF(x, y, 3, 1, hex('#49ff92')); rectF(x + 1, y - 1, 1, 3, hex('#dbffdb')); } } });
  else CUT.fx.push({ t: 0, life: 30, d(f) { for (let r = 6; r < 50; r += 8) ringF(tx, ty, (r + f.t * 2) % 50, sp.kind === 'buff' ? hex('#ffdb49') : hex('#b649ff')); } });
}

async function cutin(R) {
  const a = uById(R.a), lead = R.seq.find(s => s.heal !== 0) || R.seq[0], first = uById(lead && lead.to) || a;
  const prev = scene; scene = cutScene;
  CUT.L = a.side === 'foe' ? a : first; CUT.R = a.side === 'foe' ? first : a;
  if (CUT.L === CUT.R) CUT.L = null; // self-target: the caster stands alone
  CUT.hp = Object.assign({}, R.pre || {});
  CUT.lp = CUT.rp = 'idle'; CUT.lx = CUT.rx = 0; CUT.diss = {}; CUT.fx = []; CUT.parts = []; CUT.nums = []; CUT.msg = null; CUT.flash = 0;
  const sideOf = u => u === CUT.L ? 'L' : u === CUT.R ? 'R' : (u.side === 'foe' ? 'L' : 'R');
  if (B.D.boss || a.boss) {} // (reserved)
  await fadeIn(.2);
  const pose = (u, p) => { if (u === CUT.L) CUT.lp = p; if (u === CUT.R) CUT.rp = p; };
  const nudge = (u, dx) => { if (u === CUT.L) CUT.lx = dx; if (u === CUT.R) CUT.rx = -dx; };
  if (R.kind === 'attack') {
    for (const s of R.seq) {
      const by = uById(s.by), to = uById(s.to), bs = sideOf(by), ts = sideOf(to);
      await cmsg(s.tag === 'counter' ? to.name + ' IS COUNTERATTACKED!' : s.tag === 'double' ? 'A SECOND ATTACK!' : by.name + ' ATTACKS!', 2);
      pose(by, 'wind'); sfx('power'); await wait(8);
      const ranged = by.wk === 'rail' || by.wk === 'gun';
      if (!ranged) for (let i = 1; i <= 6; i++) { nudge(by, i * 6); await nextFrame(); }
      pose(by, 'strike');
      if (ranged) { beamFx(bs, GLOWC(by.art)); sfx('glitch'); } else if (by.wk === 'none') spellFx({ el: 'fire' }, ts); else slashFx(ts, GLOWC(by.art));
      sfx('hurt');
      await wait(4);
      const cx = ts === 'R' ? 250 : 70;
      if (s.miss) { nudge(to, -10); pose(to, 'hurt'); await cmsg(to.name + ' DODGES!', 6); nudge(to, 0); }
      else {
        if (s.crit) { post.flash = .7; CUT.shake = 5; await cmsg('A CRITICAL HIT!', 2); }
        CUT.flash = 1; CUT.flashSide = ts; pose(to, 'hurt'); CUT.shake = Math.max(CUT.shake, 3); sparks(cx, 110, hex(GLOWC(by.art)[1]), WHITE, s.crit ? 30 : 16);
        CUT.nums.push({ s: String(s.dmg), x: cx - 8, y: 80, c: s.crit ? hex('#ffdb24') : WHITE, t: 40 });
        CUT.hp[to.id] = s.hp;
        for (let i = 0; i < 10; i++) { post.flash = Math.max(0, post.flash - .1); await nextFrame(); } CUT.flash = 0; post.flash = 0;
        await cmsg(to.name + ' TAKES ' + s.dmg + ' DAMAGE.', 4);
        if (s.kill) { sfx('powerdown'); for (let k = 0; k <= 1.01; k += .04) { CUT.diss[ts] = Math.max(.001, k); await nextFrame(); } CUT.diss[ts] = 1.1; await cmsg(to.name + (to.side === 'foe' ? (to.flee ? ' RETREATS!' : ' IS DESTROYED!') : ' IS DOWN!')); }
      }
      for (let i = 6; i >= 0; i--) { nudge(by, i * 6); await nextFrame(); }
      pose(by, 'idle'); if (to.hp > 0) pose(to, 'idle');
    }
  } else {
    const sp = R.sp, cs = sideOf(a);
    await cmsg(a.name + ' CASTS ' + sp.n + ' LEVEL ' + sp.lv + '!', 2);
    pose(a, 'cast'); sfx('switch'); await wait(12);
    const ts = CUT.L === null ? 'R' : (cs === 'L' ? 'R' : 'L');
    spellFx(sp, ts); sfx(sp.kind === 'heal' ? 'get' : sp.el === 'bolt' ? 'glitch' : 'hurt'); if (sp.el) CUT.shake = 4;
    await wait(22);
    for (const s of R.seq) {
      const t = uById(s.to); if (t === first && s.dmg) { CUT.flash = 1; CUT.flashSide = ts; pose(t, 'hurt'); }
      if (s.hp !== undefined) CUT.hp[t.id] = s.hp; else if (s.heal !== undefined) CUT.hp[t.id] = (CUT.hp[t.id] || 0) + s.heal;
      if (s.heal !== undefined) { if (s.heal || R.seq.length === 1) await cmsg(t.name + ' RECOVERS ' + s.heal + ' HP.', 6); }
      else if (s.cure) await cmsg(t.name + ' IS CURED.', 6);
      else if (s.st && !s.dmg) await cmsg(s.miss ? t.name + ' RESISTS!' : t.name + ({ sleep: ' FALLS ASLEEP.', slow: ' IS SLOWED.', haste: ' SPEEDS UP!', boost: "'S ARMOUR GLOWS!" }[s.st] || '.'), 6);
      else if (s.dmg !== undefined) { await cmsg((s.miss ? t.name + ' RESISTS!' : t.name + ' TAKES ' + s.dmg + ' DAMAGE.'), 4); if (s.kill) { if (t === first) { sfx('powerdown'); for (let k = 0; k <= 1.01; k += .05) { CUT.diss[ts] = Math.max(.001, k); await nextFrame(); } CUT.diss[ts] = 1.1; } await cmsg(t.name + (t.side === 'foe' ? ' IS DESTROYED!' : ' IS DOWN!')); } }
      CUT.flash = 0;
    }
    pose(a, 'idle');
  }
  await wait(10);
  await fadeOut(.2);
  scene = prev; await fadeIn(.25);
}
