'use strict';
// ================= SAVE THE WORLD: menus — the field menu, equipment, crystals, shops, inns, saving =================
// A = confirm, B = cancel (the RPG convention). Windows stack on top of a frozen copy of the field.
const WINS = [];
let MENU_BG = null;
const menuScene = { update() {}, draw() { if (MENU_BG) FB.set(MENU_BG); else cls(BLACK); for (const w of WINS) w.draw(); } };
function pushWin(w) { WINS.push(w); return w; }
function popWin(w) { const i = WINS.indexOf(w); if (i >= 0) WINS.splice(i, 1); }
// a scrolling list window; items: [{ t, r (right text), dim, c (color) }]
async function mlist(items, o = {}) {
  const rows = o.rows || Math.min(items.length, 12), w = o.w || Math.max(...items.map(i => (i.t.length + (i.r ? i.r.length + 2 : 0)))) * 6 + 30;
  const m = pushWin({ items, i: o.i || 0, top: 0, x: o.x === undefined ? W - w - 6 : o.x, y: o.y === undefined ? 6 : o.y, w, h: rows * 12 + 10, rows,
    draw() {
      panel(this.x, this.y, this.w, this.h);
      if (o.title) { panel(this.x, this.y - 14, o.title.length * 6 + 12, 15); text(o.title, this.x + 6, this.y - 10, UI.name); }
      for (let j = 0; j < rows; j++) { const it = items[this.top + j]; if (!it) continue; const yy = this.y + 6 + j * 12, sel = this.top + j === this.i && !this.idle;
        text(it.t, this.x + 14, yy, it.dim ? hex('#6d6d92') : sel ? UI.name : (it.c || WHITE)); if (it.r) text(it.r, this.x + this.w - 8 - it.r.length * 6, yy, it.dim ? hex('#6d6d92') : UI.dim); if (sel) text('>', this.x + 5, yy, UI.name); }
      if (this.top > 0) text('^', this.x + this.w - 10, this.y + 1, UI.dim); if (this.top + rows < items.length) text('v', this.x + this.w - 10, this.y + this.h - 8, UI.dim);
      if (o.help && !this.idle) { const s = o.help(this.i); if (s) { const L = wrapT(s, 50); panel(6, H - 14 - L.length * 10, W - 12, L.length * 10 + 8); L.forEach((l, k) => text(l, 12, H - 10 - L.length * 10 + k * 10, WHITE)); } }
    } });
  await nextFrame();
  for (;;) {
    if (!items.length) { await waitBtn(); popWin(m); return -1; }
    if (pressed.up) { m.i = (m.i + items.length - 1) % items.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % items.length; sfx('move'); }
    if (o.lr && (pressed.left || pressed.right)) { const r = o.lr(m.i, pressed.left ? -1 : 1); if (r) { sfx('move'); } }
    if (m.i < m.top) m.top = m.i; if (m.i >= m.top + rows) m.top = m.i - rows + 1;
    if (o.onMove) o.onMove(m.i);
    if (pressed.a) { if (items[m.i].dim && !o.dimOk) sfx('tick'); else { sfx('ok'); if (!o.keep) popWin(m); else m.idle = 1; return m.i; } }
    if (pressed.b) { sfx('tick'); popWin(m); return -1; }
    await nextFrame();
  }
}
function infoWin(x, y, w, h, f) { return pushWin({ draw() { panel(x, y, w, h); f(x, y); } }); }

// ---------- the main field menu ----------
async function fieldMenu() {
  FIELD_LOCK++; sfx('ok');
  MENU_BG = FB.slice(); const prev = scene; scene = menuScene;
  const party = pushWin({ draw: () => drawPartyPanel() });
  try {
    for (;;) {
      const canSave = G.inWorld || (M && (M.def.saves || []).some(([x, y]) => Math.abs(x - PL.x) + Math.abs(y - PL.y) <= 1));
      const opts = ['ITEM', 'MAGIC', 'CRYSTAL', 'EQUIP', 'STATUS', 'ORDER', 'COMBOS', 'CONFIG', 'SAVE'];
      const i = await mlist(opts.map(t => ({ t, dim: t === 'SAVE' && !canSave || t === 'CRYSTAL' && !G.crystals.length })), { x: 238, y: 6, w: 76, rows: 9 });
      if (i < 0) break;
      const o = opts[i];
      if (o === 'ITEM') await itemsMenu();
      if (o === 'MAGIC') { const r = await pickHero('MAGIC'); if (r) await spellsMenu(r); }
      if (o === 'CRYSTAL') { const r = await pickHero('CRYSTAL'); if (r) await crystalMenu(r); }
      if (o === 'EQUIP') { const r = await pickHero('EQUIP'); if (r) await equipMenu(r); }
      if (o === 'STATUS') { const r = await pickHero('STATUS'); if (r) await statusScreen(r); }
      if (o === 'ORDER') await orderMenu();
      if (o === 'COMBOS') await comboBook();
      if (o === 'CONFIG') await configMenu();
      if (o === 'SAVE') { await saveMenu(); }
    }
  } finally { popWin(party); WINS.length = 0; scene = prev; MENU_BG = null; FIELD_LOCK--; }
}
function drawPartyPanel(sel) {
  panel(4, 4, 230, H - 8);
  G.party.forEach((id, i) => {
    const r = hero(id), y = 10 + i * 52, h = HEROES[id], p = PORT[h.port];
    if (p) { rectF(10, y, 48, 48, BLACK); draw(p.s, 10, y, p.P); frameRect(9, y - 1, 50, 50, UI.edge); }
    text(h.name, 66, y + 2, sel === i ? UI.name : WHITE); text('LV ' + r.lv, 170, y + 2, UI.dim);
    text('HP ' + String(r.hp).padStart(4) + '/' + String(r.mhp).padStart(4), 66, y + 16, r.hp <= 0 ? hex('#ff4949') : WHITE);
    text('MP ' + String(r.mp).padStart(4) + '/' + String(r.mmp).padStart(4), 66, y + 28, hex('#92dbff'));
    text(r.row === 'back' ? 'BACK' : '', 186, y + 28, UI.dim);
    if (r.hp <= 0) text('KO', 186, y + 16, hex('#ff4949'));
  });
  panel(238, H - 44, 76, 40); text(G.gp + ' GP', 244, H - 38, WHITE); text(fmtTime(G.frames), 244, H - 26, UI.dim);
}
async function pickHero(title, list) {
  list = list || G.party; const sel = { i: 0 };
  const w = pushWin({ draw() { const y = 10 + sel.i * 52; text('>', 2 + ((frame >> 3) & 1), y + 18, UI.name); panel(238, 120, 76, 16); text(title, 244, 124, UI.name); } });
  await nextFrame();
  for (;;) {
    if (pressed.up) { sel.i = (sel.i + list.length - 1) % list.length; sfx('move'); }
    if (pressed.down) { sel.i = (sel.i + 1) % list.length; sfx('move'); }
    if (pressed.a) { sfx('ok'); popWin(w); return hero(list[sel.i]); }
    if (pressed.b) { sfx('tick'); popWin(w); return null; }
    await nextFrame();
  }
}
// ---------- items ----------
async function itemsMenu() {
  for (;;) {
    const keys = Object.keys(G.inv).filter(k => ITEMS[k] || EQUIP[k]).sort((a, b) => (ITEMS[a] ? 0 : 1) - (ITEMS[b] ? 0 : 1));
    const i = await mlist(keys.map(k => ({ t: itemName(k), r: String(G.inv[k]), dim: !ITEMS[k] })), { x: 60, y: 20, w: 200, rows: 13, title: 'ITEMS', dimOk: 0, help: j => keys[j] && (ITEMS[keys[j]] ? ITEMS[keys[j]].desc : equipDesc(EQUIP[keys[j]])) });
    if (i < 0) return;
    const k = keys[i], it = ITEMS[k];
    if (it.field === 'tent') { if (!G.inWorld && !(M.def.saves || []).length) { await mmsg('USE IT AT A SAVE POINT OR ON THE WORLD MAP.'); continue; } invAdd(k, -1); for (const r of Object.values(G.roster)) { r.hp = r.mhp; r.mp = r.mmp; } sfx('get'); await mmsg('EVERYONE RESTED.'); continue; }
    if (it.field === 'warp') { if (!M || !M.def.dungeon) { await mmsg('NOTHING TO LEAVE.'); continue; } invAdd(k, -1); WINS.length = 0; G.warpOut = 1; return; }
    if (it.bomb) { await mmsg('THAT\'S FOR BATTLES.'); continue; }
    const r = await pickHero('USE ON'); if (!r) continue;
    if (it.revive && r.hp <= 0) { r.hp = Math.max(1, Math.floor(r.mhp * it.revive)); invAdd(k, -1); sfx('get'); continue; }
    if (r.hp <= 0) { await mmsg('THEY NEED AN EXTRA LIFE FIRST.'); continue; }
    if (it.heal) { r.hp = Math.min(r.mhp, r.hp + it.heal); invAdd(k, -1); sfx('get'); }
    else if (it.mana) { r.mp = Math.min(r.mmp, r.mp + it.mana); invAdd(k, -1); sfx('get'); }
    else if (it.cure) { r.status = {}; invAdd(k, -1); sfx('get'); }
  }
}
async function mmsg(s) { const L = wrapT(s, 44); const w = infoWin(30, 90, 260, L.length * 11 + 12, (x, y) => L.forEach((l, k) => text(l, x + 8, y + 6 + k * 11, WHITE))); await wait(4); await waitBtn(); popWin(w); }
// ---------- magic in the field (healing) ----------
async function spellsMenu(r) {
  for (;;) {
    const ks = Object.keys(SPELLS).filter(s => r.spells[s] > 0);
    if (!ks.length) { await mmsg(HEROES[r.id].name + ' DOESN\'T KNOW ANY MAGIC YET.'); return; }
    const i = await mlist(ks.map(s => ({ t: SPELLS[s].name, r: r.spells[s] >= 100 ? SPELLS[s].mp + ' MP' : Math.floor(r.spells[s]) + '%', dim: r.spells[s] < 100 || !(SPELLS[s].heal || SPELLS[s].revive || SPELLS[s].cure) })), { x: 60, y: 20, w: 200, rows: 13, title: HEROES[r.id].name + ': MAGIC (MP ' + r.mp + ')' });
    if (i < 0) return;
    const sp = SPELLS[ks[i]]; if (r.mp < sp.mp) { await mmsg('NOT ENOUGH MP.'); continue; }
    const t = await pickHero('CAST ON'); if (!t) continue;
    if (sp.revive) { if (t.hp > 0) continue; t.hp = Math.max(1, Math.floor(t.mhp * sp.revive)); }
    else if (t.hp <= 0) continue;
    else if (sp.heal) { const st = stats(r), n = Math.round(sp.pow * 3 + r.lv * st.mag * sp.pow / 48); t.hp = Math.min(t.mhp, t.hp + n); }
    else if (sp.cure) t.status = {};
    r.mp -= sp.mp; sfx('get');
  }
}
// ---------- save crystals ----------
async function crystalMenu(r) {
  const L = [null].concat(G.crystals);
  const i = await mlist(L.map(k => { if (!k) return { t: '(NONE)' }; const who = Object.values(G.roster).find(o => o.crystal === k && o !== r); return { t: CRYSTALS[k].name, r: who ? HEROES[who.id].name.slice(0, 6) : '', dim: !!who }; }),
    { x: 60, y: 20, w: 220, rows: 12, title: HEROES[r.id].name + ': CRYSTAL', i: Math.max(0, L.indexOf(r.crystal)), help: j => { const k = L[j]; if (!k) return 'NO CRYSTAL.'; const c = CRYSTALS[k]; return c.desc + ' TEACHES ' + c.spells.map(([s, rt]) => SPELLS[s].name + ' x' + rt).join(', ') + '. SUMMON: ' + c.summon.name + '.'; } });
  if (i < 0) return; r.crystal = L[i]; sfx('switch');
}
// ---------- equipment ----------
const SLOTN = { w: 'WEAPON', a: 'ARMOR', h: 'HELM', r1: 'RELIC', r2: 'RELIC' };
function equipDesc(e) { if (!e) return ''; const p = []; if (e.atk) p.push('ATK ' + e.atk); if (e.def) p.push('DEF ' + e.def); if (e.mdef) p.push('MDEF ' + e.mdef); for (const k of ['str', 'mag', 'spd']) if (e[k]) p.push(k.toUpperCase() + ' +' + e[k]); if (e.elem) p.push(ELEM[e.elem]); if (e.desc) p.push(e.desc); return p.join('  '); }
async function equipMenu(r) {
  const sw = pushWin({ draw() { const s = stats(r); panel(6, 150, 228, 68); text(HEROES[r.id].name, 12, 156, UI.name); text('ATK ' + s.atk + '  DEF ' + s.def + '  MDEF ' + s.mdef, 12, 170, WHITE); text('STR ' + s.str + '  MAG ' + s.mag + '  SPD ' + s.spd, 12, 182, WHITE); if (sw.cmp) text(sw.cmp, 12, 196, hex('#6dff92')); } });
  try {
    for (;;) {
      const slots = ['w', 'a', 'h', 'r1', 'r2'];
      const i = await mlist(slots.map(k => ({ t: SLOTN[k] + ': ' + (r.eq[k] ? EQUIP[r.eq[k]].name : '-') })).concat([{ t: 'OPTIMUM' }, { t: 'REMOVE ALL' }]), { x: 6, y: 6, w: 228, rows: 7, title: 'EQUIP' });
      if (i < 0) return;
      if (i === 5) { optimum(r); sfx('switch'); continue; }
      if (i === 6) { for (const k of slots) if (r.eq[k]) { invAdd(r.eq[k]); r.eq[k] = null; } continue; }
      const slot = slots[i], sk = slot[0];
      const opts = Object.keys(G.inv).filter(k => EQUIP[k] && EQUIP[k].slot === sk && canEquip(r.id, EQUIP[k]));
      const L = [null].concat(opts);
      const j = await mlist(L.map(k => k ? { t: EQUIP[k].name, r: String(G.inv[k]) } : { t: '(REMOVE)' }), { x: 6, y: 92, w: 228, rows: 4, onMove: j => { sw.cmp = L[j] ? equipDesc(EQUIP[L[j]]) : ''; } });
      sw.cmp = '';
      if (j < 0) continue;
      if (r.eq[slot]) invAdd(r.eq[slot]); r.eq[slot] = L[j]; if (L[j]) invAdd(L[j], -1); sfx('switch');
    }
  } finally { popWin(sw); }
}
// pick the best thing in each slot (also what the test bot uses)
function optimum(r) {
  const score = e => (e.atk || 0) * 2 + (e.def || 0) * 2 + (e.mdef || 0) + (e.mag || 0) * (['yoko', 'linda', 'kid', 'ghost'].includes(r.id) ? 4 : 1) + (e.str || 0) * 3 + (e.spd || 0) * 2;
  for (const slot of ['w', 'a', 'h']) {
    const cur = r.eq[slot] && EQUIP[r.eq[slot]];
    const best = Object.keys(G.inv).filter(k => EQUIP[k] && EQUIP[k].slot === slot && canEquip(r.id, EQUIP[k])).sort((a, b) => score(EQUIP[b]) - score(EQUIP[a]))[0];
    if (best && (!cur || score(EQUIP[best]) > score(cur))) { if (r.eq[slot]) invAdd(r.eq[slot]); r.eq[slot] = best; invAdd(best, -1); }
  }
  for (const slot of ['r1', 'r2']) if (!r.eq[slot]) { const best = Object.keys(G.inv).find(k => EQUIP[k] && EQUIP[k].slot === 'r' && canEquip(r.id, EQUIP[k]) && !['pager', 'hallpass'].includes(k)); if (best) { r.eq[slot] = best; invAdd(best, -1); } }
}
// ---------- status ----------
async function statusScreen(r) {
  const h = HEROES[r.id], s = stats(r), next = totalXP(r.lv + 1) - r.xp;
  const w = pushWin({ draw() {
    panel(6, 6, W - 12, H - 12); const p = PORT[h.port]; if (p) { draw(p.s, 14, 14, p.P); frameRect(13, 13, 50, 50, UI.edge); }
    text(h.name, 72, 16, UI.name); text(h.title, 72, 28, UI.dim); text('LV ' + r.lv, 72, 42, WHITE); text('NEXT ' + next, 130, 42, UI.dim);
    text('HP ' + r.hp + '/' + r.mhp + '   MP ' + r.mp + '/' + r.mmp, 72, 54, WHITE);
    const rows = [['STRENGTH', s.str], ['MAGIC', s.mag], ['SPEED', s.spd], ['STAMINA', s.vit], ['ATTACK', s.atk], ['DEFENSE', s.def], ['MAGIC DEF', s.mdef]];
    rows.forEach(([k, v], i) => { text(k, 20, 80 + i * 12, UI.dim); text(String(v), 110, 80 + i * 12, WHITE); });
    text('COMMAND: ' + (r.id === 'kid' ? 'ASK / PERFORM / INSPECT' : h.cmd), 150, 80, WHITE);
    text('CRYSTAL: ' + (r.crystal ? CRYSTALS[r.crystal].name : '-'), 150, 92, WHITE);
    text('ROW: ' + r.row.toUpperCase(), 150, 104, WHITE);
    text('EQUIPPED:', 150, 122, UI.dim); ['w', 'a', 'h', 'r1', 'r2'].forEach((k, i) => text(r.eq[k] ? EQUIP[r.eq[k]].name.slice(0, 22) : '-', 150, 134 + i * 11, WHITE));
  } });
  await wait(4); await waitBtn(); popWin(w);
}
// ---------- order and rows ----------
async function orderMenu() {
  for (;;) {
    const all = Object.keys(G.roster), locked = flag('partyLock');
    const items = G.party.map(id => ({ t: HEROES[id].name, r: hero(id).row === 'back' ? 'BACK' : 'FRONT' }));
    items.push({ t: 'CHANGE PARTY', dim: locked || all.length <= G.party.length && G.party.length >= all.length });
    const i = await mlist(items, { x: 238, y: 6, w: 76, rows: items.length, title: 'ORDER', help: () => 'A: SWAP ROW. LEFT/RIGHT: MOVE.', lr: (j, d) => { if (j >= G.party.length) return 0; const k = clamp(j + d, 0, G.party.length - 1); [G.party[j], G.party[k]] = [G.party[k], G.party[j]]; return 1; } });
    if (i < 0) return;
    if (i < G.party.length) { const r = hero(G.party[i]); r.row = r.row === 'back' ? 'front' : 'back'; continue; }
    // change party: pick up to four from everyone
    const pick = [];
    for (;;) {
      const L = all.filter(k => !G.flags['away_' + k]);
      const j = await mlist(L.map(k => ({ t: HEROES[k].name, r: pick.includes(k) ? '#' + (pick.indexOf(k) + 1) : 'LV ' + hero(k).lv })).concat([{ t: 'DONE', dim: !pick.length }]), { x: 120, y: 6, w: 150, rows: L.length + 1, title: 'CHOOSE UP TO 4' });
      if (j < 0) break; if (j === L.length) { G.party = pick; break; }
      const k = L[j]; if (pick.includes(k)) pick.splice(pick.indexOf(k), 1); else if (pick.length < 4) pick.push(k);
    }
  }
}
async function comboBook() {
  const items = COMBOS.map(c => G.combos[c.name] ? { t: c.name, r: 'x' + G.combos[c.name] } : { t: '? ? ?', dim: 1 });
  await mlist(items, { x: 40, y: 20, w: 240, rows: items.length, title: 'COMBO BOOK', dimOk: 1, help: j => { const c = COMBOS[j]; return G.combos[c.name] ? HEROES[c.a[0]].name + ' ' + c.a[1] + ' + ' + HEROES[c.b[0]].name + ' ' + c.b[1] + ': ' + c.desc : 'TRY TWO COMMANDS BACK TO BACK.'; } });
}
async function configMenu() {
  for (;;) {
    const c = G.config;
    const i = await mlist([{ t: 'BATTLE MODE', r: c.wait ? 'WAIT' : 'ACTIVE' }, { t: 'BATTLE SPEED', r: String(c.speed) }, { t: 'DONE' }], { x: 80, y: 40, w: 180, rows: 3, title: 'CONFIG', lr: (j, d) => { if (j === 1) { c.speed = clamp(c.speed + d, 1, 6); return 1; } if (j === 0) { c.wait = c.wait ? 0 : 1; return 1; } } });
    if (i < 0 || i === 2) return;
    if (i === 0) c.wait = c.wait ? 0 : 1; if (i === 1) c.speed = c.speed % 6 + 1;
  }
}
// ---------- saving: the three slots ----------
async function saveMenu() {
  const slots = saveSlots();
  const L = slots.map((s, i) => ({ t: 'SLOT ' + (i + 1) + ': ' + (s ? HEROES[s.lead].name + ' LV' + s.lv + ' ' + fmtTime(s.time) : 'EMPTY') }));
  const prev = scene; if (scene !== menuScene) { MENU_BG = FB.slice(); scene = menuScene; }
  const i = await mlist(L, { x: 40, y: 60, w: 240, rows: 3, title: 'SAVE TO WHICH SLOT?', help: j => slots[j] ? 'SAVED AT ' + slots[j].where + '.' : '' });
  if (i >= 0) { saveGame(i); sfx('get'); await mmsg('SAVED TO SLOT ' + (i + 1) + '.'); }
  if (prev !== menuScene) { scene = prev; MENU_BG = null; WINS.length = 0; }
}

// ---------- shops and inns ----------
async function shop(name, stock, who = 'CLERK') {
  FIELD_LOCK++; MENU_BG = FB.slice(); const prev = scene; scene = menuScene;
  const gpw = pushWin({ draw() { panel(W - 96, H - 22, 90, 18); text(G.gp + ' GP', W - 88, H - 17, WHITE); panel(6, 6, name.length * 6 + 14, 16); text(name, 12, 10, UI.name); } });
  try {
    for (;;) {
      const c = await mlist([{ t: 'BUY' }, { t: 'SELL' }, { t: 'LEAVE' }], { x: 6, y: 28, w: 70, rows: 3 });
      if (c < 0 || c === 2) break;
      if (c === 0) for (;;) {
        const price = k => (ITEMS[k] || EQUIP[k]).price;
        const j = await mlist(stock.map(k => ({ t: itemName(k), r: String(price(k)), dim: price(k) > G.gp })), { x: 80, y: 28, w: 230, rows: 10, help: j => { const k = stock[j]; if (ITEMS[k]) return ITEMS[k].desc + '  (HAVE ' + (G.inv[k] || 0) + ')'; const e = EQUIP[k]; const who = Object.keys(G.roster).filter(id => canEquip(id, e)).map(id => HEROES[id].name).join(' '); return equipDesc(e) + (who ? '  FOR: ' + who : '  NOBODY CAN USE IT YET.'); } });
        if (j < 0) break;
        const k = stock[j], p = price(k);
        const n = ITEMS[k] ? await howMany(Math.min(99, Math.floor(G.gp / p))) : 1;
        if (n > 0 && G.gp >= p * n) { G.gp -= p * n; invAdd(k, n); sfx('get'); }
      }
      if (c === 1) for (;;) {
        const keys = Object.keys(G.inv).filter(k => (ITEMS[k] || EQUIP[k]) && (ITEMS[k] || EQUIP[k]).price > 0);
        const j = await mlist(keys.map(k => ({ t: itemName(k), r: G.inv[k] + '  ' + Math.floor((ITEMS[k] || EQUIP[k]).price / 2) })), { x: 80, y: 28, w: 230, rows: 10 });
        if (j < 0) break; const k = keys[j]; G.gp += Math.floor((ITEMS[k] || EQUIP[k]).price / 2); invAdd(k, -1); sfx('ok');
      }
    }
  } finally { popWin(gpw); WINS.length = 0; scene = prev; MENU_BG = null; FIELD_LOCK--; }
}
async function howMany(max) {
  if (max <= 0) { sfx('tick'); return 0; }
  const st = { n: 1 }; const w = infoWin(120, 100, 100, 30, (x, y) => text('HOW MANY? ' + st.n, x + 8, y + 10, WHITE));
  await nextFrame();
  for (;;) {
    if (pressed.up || pressed.right) st.n = Math.min(max, st.n + (pressed.right ? 10 : 1)); if (pressed.down || pressed.left) st.n = Math.max(1, st.n - (pressed.left ? 10 : 1));
    if (pressed.a) { popWin(w); return st.n; } if (pressed.b) { popWin(w); return 0; }
    await nextFrame();
  }
}
async function inn(price, who) {
  const c = await ask('A ROOM FOR THE NIGHT IS ' + price + ' GP. STAY?', who, ['STAY', 'NO THANKS']);
  if (c !== 0) return;
  if (G.gp < price) { await say('YOU CAN\'T AFFORD IT. THAT\'S NOT A JUDGMENT. IT\'S A PRICE.', who); return; }
  G.gp -= price; await restParty(); await say('YOU LOOK RESTED. YOU LOOK SAVED, ALMOST.', who);
}
