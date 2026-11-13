'use strict';
// ================= CHROME FORCE -- UI: windows, menus, status, items, shop, church, headquarters =================
// Buttons in this cartridge: A = confirm, B or C = back. Dialogue advances on any button (engine say()).

const OKB = () => pressed.a || pressed.start, BACKB = () => pressed.b || pressed.c;
let WINS = [];
function drawWins() { for (const w of WINS) w(); }
const COL = { gold: hex('#ffdb49'), dim: hex('#9292b6'), red: hex('#ff4949'), green: hex('#6dff6d'), cyan: hex('#6ddbff'), pink: hex('#ff92db'), hp: hex('#49db49'), mp: hex('#49b6ff'), bar: hex('#24244d') };
function bar(x, y, w, v, m, c) { rectF(x, y, w, 3, COL.bar); rectF(x, y, Math.round(w * Math.max(0, Math.min(1, v / Math.max(1, m)))), 3, c); }

function artOf(a) { if (!a.P) { a.P = makePal(...a.pc); a.key = [a.body, a.head, a.weap, a.pc.join(','), a.hs || ''].join('/'); } return a; }
function portraitFor(a, mood) {
  artOf(a); const k = a.key + '|pf' + (mood || 0); if (SPRC[k]) return SPRC[k];
  const s = portraitOf(a, mood), d = s.d;
  for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const o = y * 48 + x; if (!d[o]) d[o] = y < 30 ? (((x * 7 + y * 13) % 41) === 0 ? 3 : 15) : y === 30 ? 6 : y < 34 ? 5 : 7; }
  return (SPRC[k] = s);
}
function regPortrait(name, a, voice) { if (voice) VOICE[name] = voice; if (CF_PORTS[name]) return; artOf(a); PORT[name] = { s: portraitFor(a), P: a.P }; }

// ---------- painted portraits (cf/cfports.js): a 64x64 talk window above the dialogue box, as the old carts did; 48x48 on status screens ----------
// speakers without one keep the small painted-by-code face inside the box
const BIGPORT = {};
function decodePort(o) { const n = Math.sqrt(o.d.length) | 0; return { s: spr(n, n, g => { for (let i = 0; i < o.d.length; i++) g.p(i % n, (i / n) | 0, parseInt(o.d[i], 16)); }), P: pal(...o.p) }; }
// promoted members switch to their 'NAME+' painting (same person, more distinguished)
function portName(name) {
  for (const id in HEROES) if (HEROES[id].n === name) { const r = SAVE && SAVE.force[id]; return r && CLS[r.cls].promoted && !CLS[HEROES[id].cls].promoted && CF_PORTS[name + '+'] ? name + '+' : name; }
  return name;
}
function bigPort(name) { name = portName(name); const o = CF_PORTS[name]; return o ? BIGPORT[name] || (BIGPORT[name] = { b: decodePort(o.b), s: decodePort(o.s) }) : null; }
const engineOverlay = drawOverlay;
drawOverlay = function () {
  const p = DLG && DLG.who && !CARD && bigPort(DLG.who);
  if (p) { const x = 6, y = H - 68 - 14 - 72; panel(x, y, 72, 72); draw(p.b.s, x + 4, y + 4, p.b.P); }
  engineOverlay();
};
function drawRecPort(r, x, y) { const p = bigPort(HEROES[r.id].n), a = artOf(HEROES[r.id].art); rectF(x, y, 48, 48, BLACK); if (p) draw(p.s.s, x, y, p.s.P); else draw(portraitFor(a), x, y, a.P); }

// ---------- menu ----------
// opts: strings or {t, r (right text), dis, c (color)}; o: {x, y, w, title, rows, cancel (default true), i0, onMove(i), lr(i, dir)}
async function menu(opts, o = {}) {
  const items = opts.map(s => typeof s === 'string' ? { t: s } : s);
  const rows = Math.min(items.length, o.rows || 9);
  const w = o.w || Math.max(o.title ? o.title.length * 6 + 16 : 0, ...items.map(i => (i.t.length + (i.r ? String(i.r).length + 2 : 0)) * 6 + 26));
  const h = rows * 12 + 12 + (o.title ? 12 : 0);
  const x = o.x !== undefined ? o.x : W - w - 8, y = o.y !== undefined ? o.y : 8;
  const m = { i: Math.max(0, Math.min(items.length - 1, o.i0 || 0)), top: 0 };
  const fn = () => {
    panel(x, y, w, h); let yy = y + 7;
    if (o.title) { text(o.title, x + 8, yy, UI.name); yy += 12; }
    if (m.i < m.top) m.top = m.i; if (m.i >= m.top + rows) m.top = m.i - rows + 1;
    for (let r = 0; r < rows; r++) {
      const k = m.top + r, it = items[k]; if (!it) break;
      const c = it.dis ? COL.dim : it.c || (k === m.i ? UI.name : UI.text);
      const room = ((w - 24 - (it.r !== undefined ? String(it.r).length * 6 + 6 : 0)) / 6) | 0; // never run into the right column
      text(it.t.length > room ? it.t.slice(0, room) : it.t, x + 16, yy + r * 12, c); if (it.r !== undefined) text(String(it.r), x + w - 8 - String(it.r).length * 6, yy + r * 12, it.dis ? COL.dim : UI.text);
      if (k === m.i && (frame >> 3) & 1) text('>', x + 6, yy + r * 12, UI.name);
    }
    if (m.top > 0) text('^', x + w - 12, y + 3, UI.dim); if (m.top + rows < items.length) text('v', x + w - 12, y + h - 9, UI.dim);
  };
  WINS.push(fn); if (o.onMove) o.onMove(m.i);
  await nextFrame();
  let res;
  for (;;) {
    if (pressed.up) { m.i = (m.i + items.length - 1) % items.length; sfx('move'); if (o.onMove) o.onMove(m.i); }
    if (pressed.down) { m.i = (m.i + 1) % items.length; sfx('move'); if (o.onMove) o.onMove(m.i); }
    if (o.lr && (pressed.left || pressed.right)) { o.lr(m.i, pressed.left ? -1 : 1); sfx('move'); }
    if (OKB()) { if (items[m.i].dis) sfx('tick'); else { sfx('ok'); res = m.i; break; } }
    if (BACKB() && o.cancel !== false) { sfx('tick'); res = -1; break; }
    await nextFrame();
  }
  WINS.splice(WINS.indexOf(fn), 1);
  return res;
}
async function note2(s, t = 70) { // small centred notice
  const ls = wrapT(String(s).toUpperCase(), 40), w = Math.max(...ls.map(l => l.length)) * 6 + 20, h = ls.length * 12 + 12;
  const fn = () => { panel(((W - w) / 2) | 0, 80, w, h); ls.forEach((l, i) => ctext(l, 87 + i * 12, UI.text)); };
  WINS.push(fn); await nextFrame();
  for (let i = 0; i < t; i++) { if (i > 8 && (OKB() || BACKB())) break; await nextFrame(); }
  WINS.splice(WINS.indexOf(fn), 1);
}
async function confirm(q) { WINS.push(qfn); function qfn() { const w = q.length * 6 + 20; panel(((W - w) / 2) | 0, 70, w, 20); ctext(q, 76, UI.text); } const r = await menu(['YES', 'NO'], { x: 136, y: 94 }); WINS.splice(WINS.indexOf(qfn), 1); return r === 0; }

// ---------- force helpers ----------
const recOf = id => SAVE.force[id];
const activeRecs = () => SAVE.active.map(recOf).filter(Boolean);
const allRecs = () => FORCE_ORDER.filter(id => SAVE.force[id]).map(recOf);
function itemLabel(it) { const d = ITEMS[it.id]; return (it.eq ? 'E ' : '  ') + d.n; }
// what an item does and who can hold it, built from the item table so it never drifts
const STATN = { atk: 'ATTACK', def: 'DEFENSE', agi: 'AGILITY', mhp: 'MAX HP' };
function itemDesc(id) {
  const d = ITEMS[id];
  if (d.k === 'use') return {
    heal: 'RESTORES ' + d.p + ' HP. BATTLE ONLY: USE ON YOURSELF OR AN ADJACENT ALLY.',
    mp: 'RESTORES ' + d.p + ' MP. BATTLE ONLY: USE ON YOURSELF OR AN ADJACENT ALLY.',
    cure: 'CURES POISON, SLOW AND SLEEP. BATTLE ONLY: YOURSELF OR AN ADJACENT ALLY.',
    recall: 'BATTLE ONLY: ABANDONS THE FIGHT AND PULLS THE WHOLE FORCE BACK TO SAFETY.',
    stat: 'PERMANENTLY RAISES ' + STATN[d.s] + ' BY ' + d.p + '. ONE USE, ANYONE, ANYWHERE.',
  }[d.fx];
  if (d.k === 'ring') return 'RING: +' + d.p + ' ' + STATN[d.s] + ' WHILE WORN. ANY CLASS CAN WEAR ONE ALONGSIDE A WEAPON.';
  const g = d.r || WRANGE[d.k], pros = Object.values(CLS).map(c => c.pro);
  const who = [...new Set(Object.keys(CLS).filter(k => CLS[k].wk === d.k && !pros.includes(k) && k !== 'NULL').map(k => CLS[k].n))];
  return d.k.toUpperCase() + ': ATK +' + d.p + ', RANGE ' + (g[0] === g[1] ? g[0] : g[0] + '-' + g[1]) + '. EQUIPS: ' + who.join(', ') + ' (AND PROMOTIONS).';
}
function descBox(id, y) {
  if (!id || !ITEMS[id]) return;
  panel(8, y, 304, 46); text(ITEMS[id].n, 16, y + 6, UI.name);
  wrapT(itemDesc(id), 48).slice(0, 3).forEach((l, i) => text(l, 16, y + 18 + i * 10, UI.text));
}
// a menu over items that shows the highlighted item's description at height dy
async function itemMenu(opts, ids, o, dy = 8) {
  let cur = ids[o.i0 || 0]; const box = () => descBox(cur, dy); WINS.push(box);
  const k = await menu(opts, Object.assign({}, o, { onMove: i => { cur = ids[i]; } }));
  WINS.splice(WINS.indexOf(box), 1); return k;
}
// buy-for-whom column: ATK change for a weapon, NO if the class can't hold it
function equipTag(r, id) {
  const d = ITEMS[id];
  if (d.k === 'use') return CLS[r.cls].ab + ' ' + r.lv;
  if (!canEquip(r, id)) return 'NO';
  if (d.k === 'ring') return '+' + d.p;
  const w = weaponOf(r), dd = d.p - (w ? w.p : 0);
  return dd > 0 ? '+' + dd : dd < 0 ? String(dd) : '=';
}
async function recruit(id, auto) {
  if (SAVE.force[id]) return;
  const r = newRecord(id); SAVE.force[id] = r;
  if (SAVE.active.length < 12) SAVE.active.push(id);
  sfx('get'); music_sting('join');
  await note2(HEROES[id].n + ' JOINED THE CHROME FORCE!', 110);
}
async function archiveFind(id, auto) {
  if (SAVE.archive[id]) { if (!auto) await note2('NOTHING ELSE HERE.'); return; }
  SAVE.archive[id] = 1; const a = ARCHIVE.find(e => e.id === id);
  sfx('object');
  await showCard(['- ARCHIVE OF BEFORE -', '', a.t, '', ...wrapT(a.s, 44), '', '(' + Object.keys(SAVE.archive).length + ' / ' + ARCHIVE.length + ' RECOVERED)'], 0, { bg: hex('#000024'), fg: hex('#dbdbff') });
}
function giveItem(rec, id) { if (rec.items.length >= 4) return false; rec.items.push({ id, eq: 0 }); return true; }
function stowItem(id) { // to the first member with room, else the depot
  for (const r of activeRecs()) if (giveItem(r, id)) return r.id;
  SAVE.depot.push(id); return 'depot';
}

// ---------- member picker (with live info) ----------
async function pickMember(title, list = activeRecs(), o = {}) {
  const opts = list.map(r => ({ t: (r.dead ? '+' : '') + HEROES[r.id].n, r: o.tag ? o.tag(r) : CLS[r.cls].ab + ' ' + r.lv, dis: o.dis ? o.dis(r) : false, c: r.dead ? COL.red : o.col ? o.col(r) : undefined }));
  let cur = 0; const side = () => { const r = list[cur]; if (r) statusMini(r, 4, 8); };
  WINS.push(side);
  const i = await menu(opts, { title, x: W - 156, y: 8, w: 152, rows: 12, onMove: k => { cur = k; } });
  WINS.splice(WINS.indexOf(side), 1);
  return i < 0 ? null : list[i];
}
function statusMini(r, x, y) {
  const e = effStats(r), a = artOf(HEROES[r.id].art);
  panel(x, y, 158, 126);
  drawRecPort(r, x + 6, y + 6);
  text(HEROES[r.id].n, x + 60, y + 8, UI.name); text(CLS[r.cls].n, x + 60, y + 19, UI.text); text('LV ' + r.lv + '  EXP ' + r.exp, x + 60, y + 30, UI.text);
  text('HP ' + r.mhp, x + 60, y + 41, COL.hp); if (r.mmp) text('MP ' + r.mmp, x + 112, y + 41, COL.mp);
  text('ATK ' + e.atk, x + 8, y + 60, UI.text); text('DEF ' + e.def, x + 62, y + 60, UI.text); text('AGI ' + e.agi, x + 112, y + 60, UI.text);
  r.items.slice(0, 4).forEach((it, i) => text(itemLabel(it), x + 4, y + 74 + i * 11, it.eq ? COL.gold : UI.text));
  if (r.dead) text('-- DOWN --', x + 60, y + 52 - 1, COL.red);
}
async function showStatus(r) {
  const fn = () => {
    const e = effStats(r), a = artOf(HEROES[r.id].art), w = weaponOf(r);
    panel(8, 8, 304, 208); drawRecPort(r, 16, 16);
    text(HEROES[r.id].n, 72, 18, UI.name); text(CLS[r.cls].n + (CLS[r.cls].promoted ? ' *' : ''), 72, 30, UI.text); text('LV ' + r.lv + '   EXP ' + r.exp + '/100', 72, 42, UI.text);
    text(r.dead ? 'STATUS: DOWN' : 'STATUS: READY', 72, 54, r.dead ? COL.red : COL.green);
    const S = [['HP', r.mhp], ['MP', r.mmp], ['ATK', e.atk], ['DEF', e.def], ['AGI', e.agi], ['MOV', e.mov]];
    S.forEach(([k, v], i) => text(k + ' ' + v, 16 + (i % 3) * 66, 74 + ((i / 3) | 0) * 12, UI.text));
    text('ITEMS', 16, 104, UI.name); r.items.forEach((it, i) => text(itemLabel(it), 16, 116 + i * 11, it.eq ? COL.gold : UI.text));
    text('SPELLS', 170, 104, UI.name); const sp = Object.keys(r.spells || {}); if (!sp.length) text('NONE', 170, 116, COL.dim);
    sp.forEach((k, i) => text(k + ' ' + r.spells[k], 170, 116 + i * 11, COL.cyan));
    text('WEAPON RANGE ' + (e.wr[0] === e.wr[1] ? e.wr[0] : e.wr[0] + '-' + e.wr[1]) + (CLS[r.cls].regen ? '  SELF-REPAIR' : ''), 16, 166, COL.dim);
    wrapT(HEROES[r.id].bio, 48).forEach((l, i) => text(l, 16, 182 + i * 11, COL.dim));
  };
  WINS.push(fn); await nextFrame(); while (!(OKB() || BACKB())) await nextFrame(); sfx('tick'); WINS.splice(WINS.indexOf(fn), 1);
}

// ---------- items (field) ----------
async function fieldItems() {
  for (;;) {
    const r = await pickMember('ITEMS'); if (!r) return;
    if (!r.items.length) { await note2(HEROES[r.id].n + ' HAS NOTHING.'); continue; }
    const k = await itemMenu(r.items.map(it => itemLabel(it)), r.items.map(it => it.id), { title: HEROES[r.id].n, x: 8, y: 140, w: 150 }); if (k < 0) continue;
    const it = r.items[k], d = ITEMS[it.id];
    const acts = ['USE', 'GIVE', 'EQUIP', 'DROP'];
    const a = await menu(acts.map(s => ({ t: s, dis: (s === 'USE' && d.k !== 'use') || (s === 'EQUIP' && (d.k === 'use' || !canEquip(r, it.id))) })), { x: 164, y: 140 });
    if (a === 0) await useItemField(r, k);
    if (a === 1) { const to = await pickMember('GIVE TO', activeRecs().filter(x => x !== r)); if (to) { if (to.items.length >= 4) await note2(HEROES[to.id].n + "'S HANDS ARE FULL."); else { r.items.splice(k, 1); to.items.push({ id: it.id, eq: 0 }); sfx('ok'); } } }
    if (a === 2) { equip(r, k); await note2(HEROES[r.id].n + ' EQUIPPED ' + d.n + '.', 50); }
    if (a === 3 && !d.rare && await confirm('DROP ' + d.n + '?')) r.items.splice(k, 1);
  }
}
function equip(r, k) {
  const it = r.items[k], ring = ITEMS[it.id].k === 'ring';
  if (it.eq) { it.eq = 0; return; }
  r.items.forEach(o => { if (o.eq && (ITEMS[o.id].k === 'ring') === ring) o.eq = 0; }); it.eq = 1;
}
async function useItemField(r, k) {
  const d = ITEMS[r.items[k].id];
  if (d.fx === 'heal' || d.fx === 'mp' || d.fx === 'cure') { await note2('OUTSIDE OF BATTLE THE FORCE IS ALREADY RESTED.'); return; }
  if (d.fx === 'stat') { const t = await pickMember('USE ON'); if (!t) return; t[d.s] += d.p; r.items.splice(k, 1); sfx('get'); await note2(HEROES[t.id].n + "'S " + d.s.replace('mhp', 'HP').toUpperCase() + ' ROSE BY ' + d.p + '!'); return; }
  if (d.fx === 'recall') await note2('THERE IS NOWHERE TO RECALL TO.');
}

// ---------- shop ----------
async function shop(npcName) {
  const S = SHOPS[SAVE.ch] || SHOPS[1];
  await say('WELCOME. EVERYTHING HERE WAS SOMEBODY ELSE\'S ONCE.', npcName);
  for (;;) {
    const goldW = () => { panel(8, 8, 96, 20); text('$ ' + SAVE.gold, 16, 14, COL.gold); };
    WINS.push(goldW);
    const a = await menu(['BUY WEAPONS', 'BUY ITEMS', 'SELL', 'LEAVE'], { x: 200, y: 8 });
    if (a < 0 || a === 3) { WINS.splice(WINS.indexOf(goldW), 1); return; }
    if (a === 0 || a === 1) {
      const list = a === 0 ? S.w : S.i;
      let cur = list[0]; const box = () => descBox(cur, 177); WINS.push(box);
      for (;;) {
        const i = await menu(list.map(id => ({ t: ITEMS[id].n, r: ITEMS[id].$, dis: ITEMS[id].$ > SAVE.gold })), { title: 'BUY', x: 120, y: 34, w: 190, i0: list.indexOf(cur), onMove: k => { cur = list[k]; } });
        if (i < 0) break; const id = list[i], d = ITEMS[id];
        const r = await pickMember('FOR WHOM?', activeRecs(), { tag: x => equipTag(x, id), col: x => d.k !== 'use' && !canEquip(x, id) ? COL.dim : undefined });
        if (!r) continue;
        if (r.items.length >= 4) { if (await confirm('HANDS FULL. SEND TO DEPOT?')) { SAVE.gold -= d.$; SAVE.depot.push(id); sfx('get'); } continue; }
        SAVE.gold -= d.$; r.items.push({ id, eq: 0 }); sfx('get');
        if (d.k !== 'use' && canEquip(r, id)) { const cur = weaponOf(r), better = d.k === 'ring' || !cur || d.p > cur.p; if (better && await confirm('EQUIP IT NOW?')) equip(r, r.items.length - 1); }
        else if (d.k !== 'use') await note2(HEROES[r.id].n + " CAN'T USE THAT. STILL, IT'S YOURS.");
      }
      WINS.splice(WINS.indexOf(box), 1);
    }
    if (a === 2) {
      for (;;) {
        const r = await pickMember('SELL FROM'); if (!r) break;
        if (!r.items.length) continue;
        const k = await itemMenu(r.items.map(it => ({ t: itemLabel(it), r: ITEMS[it.id].rare ? '--' : (ITEMS[it.id].$ >> 1), dis: !!ITEMS[it.id].rare })), r.items.map(it => it.id), { title: 'SELL', x: 8, y: 140, w: 190 }, 32); if (k < 0) continue;
        const d = ITEMS[r.items[k].id]; if (await confirm('SELL FOR ' + (d.$ >> 1) + '?')) { SAVE.gold += d.$ >> 1; r.items.splice(k, 1); sfx('ok'); }
      }
    }
    WINS.splice(WINS.indexOf(goldW), 1);
  }
}

// ---------- church: save, raise, cure, promote ----------
async function church(npcName) {
  await say('THE SIGNAL STILL BURNS. WHAT DO YOU NEED, CHILD OF CHROME?', npcName);
  for (;;) {
    const a = await menu(['SAVE', 'RAISE', 'PROMOTE', 'LEAVE'], { x: 220, y: 8 });
    if (a < 0 || a === 3) { await say('MAY YOUR HORIZON STAY BRIGHT.', npcName); return; }
    if (a === 0) { saveGame(); sfx('get'); await say('YOUR DEEDS ARE RECORDED IN THE SIGNAL.', npcName); }
    if (a === 1) {
      const dead = allRecs().filter(r => r.dead);
      if (!dead.length) { await say('EVERYONE IS STANDING. GOOD.', npcName); continue; }
      const r = await pickMember('RAISE', dead); if (!r) continue;
      const cost = raiseCost(r);
      if (SAVE.gold < cost) { await say('THAT WILL TAKE ' + cost + ' GOLD. YOU DO NOT HAVE IT.', npcName); continue; }
      if (await confirm('RAISE FOR ' + cost + ' GOLD?')) { SAVE.gold -= cost; r.dead = 0; sfx('get'); await say(HEROES[r.id].n + ' RETURNS TO THE BODY. IT FITS BETTER THAN BEFORE.', npcName); }
    }
    if (a === 2) {
      const ok = allRecs().filter(r => canPromote(r) && !r.dead);
      if (!ok.length) { await say('NO ONE IS READY. THE SIGNAL PROMOTES THOSE WHO HAVE REACHED LEVEL 10.', npcName); continue; }
      const r = await pickMember('PROMOTE', ok); if (!r) continue;
      const to = CLS[CLS[r.cls].pro];
      if (await confirm('PROMOTE TO ' + to.n + '?')) { promote(r); sfx('object'); music_sting('join'); await say(HEROES[r.id].n + ' IS NOW A ' + to.n + '! LEVEL RESETS TO 1. THE BODY REMEMBERS EVERYTHING.', npcName); if (PROMO_SAY[r.id]) await say(PROMO_SAY[r.id], HEROES[r.id].n); }
    }
  }
}
const raiseCost = r => (r.lv + (CLS[r.cls].promoted ? 10 : 0)) * 10;

// ---------- headquarters: who rides, the depot ----------
async function hq(npcName) {
  await say('THE FORCE CAN FIELD TWELVE. CHOOSE WHO RIDES.', npcName);
  for (;;) {
    const a = await menu(['ROSTER', 'DEPOT', 'STATUS', 'TALK', 'LEAVE'], { x: 220, y: 8 });
    if (a < 0 || a === 4) return;
    if (a === 3) await forceTalk(npcName);
    if (a === 0) {
      for (;;) {
        const all = allRecs(), opts = all.map(r => ({ t: (SAVE.active.includes(r.id) ? '* ' : '  ') + HEROES[r.id].n, r: 'LV' + r.lv, c: r.dead ? COL.red : SAVE.active.includes(r.id) ? COL.gold : undefined }));
        const i = await menu(opts, { title: 'RIDING ' + SAVE.active.length + '/12', x: 160, y: 8, w: 150, rows: 12 }); if (i < 0) break;
        const r = all[i];
        if (r.id === 'dax') { await note2('DAX ALWAYS RIDES.'); continue; }
        if (SAVE.active.includes(r.id)) SAVE.active.splice(SAVE.active.indexOf(r.id), 1);
        else if (SAVE.active.length >= 12) await note2('TWELVE ARE ALREADY RIDING.');
        else SAVE.active.push(r.id);
      }
    }
    if (a === 1) {
      for (;;) {
        const b = await menu(['TAKE OUT', 'STORE', 'BACK'], { x: 220, y: 60 }); if (b < 0 || b === 2) break;
        if (b === 0) {
          if (!SAVE.depot.length) { await note2('THE DEPOT IS EMPTY.'); continue; }
          const k = await itemMenu(SAVE.depot.map(id => ITEMS[id].n), SAVE.depot, { title: 'DEPOT', x: 8, y: 8, w: 150, rows: 12 }, 177); if (k < 0) continue;
          const r = await pickMember('GIVE TO'); if (!r) continue;
          if (!giveItem(r, SAVE.depot[k])) await note2('HANDS FULL.'); else SAVE.depot.splice(k, 1);
        } else {
          const r = await pickMember('STORE FROM'); if (!r || !r.items.length) continue;
          const k = await itemMenu(r.items.map(itemLabel), r.items.map(it => it.id), { x: 8, y: 140, w: 150 }); if (k < 0) continue;
          SAVE.depot.push(r.items[k].id); r.items.splice(k, 1);
        }
      }
    }
    if (a === 2) { const r = await pickMember('STATUS', allRecs()); if (r) await showStatus(r); }
  }
}

// ---------- field menu (START) ----------
async function fieldMenu(where) {
  for (;;) {
    const a = await menu(['FORCE', 'ITEMS', 'ARCHIVE', 'OPTIONS', 'CLOSE'], { x: 220, y: 8 });
    if (a < 0 || a === 4) return;
    if (a === 0) { const r = await pickMember('FORCE', allRecs()); if (r) await showStatus(r); }
    if (a === 1) await fieldItems();
    if (a === 2) await archiveView();
    if (a === 3) await options();
  }
}
async function archiveView() {
  const opts = ARCHIVE.map(e => SAVE.archive[e.id] ? e.t : '? ? ? ? ?');
  for (;;) {
    const i = await menu(opts.map((t, k) => ({ t, dis: !SAVE.archive[ARCHIVE[k].id] })), { title: 'ARCHIVE OF BEFORE  ' + Object.keys(SAVE.archive).length + '/' + ARCHIVE.length, x: 8, y: 8, w: 304, rows: 14 });
    if (i < 0) return; const a = ARCHIVE[i];
    await showCard(['- ARCHIVE OF BEFORE -', '', a.t, '', ...wrapT(a.s, 44)], 0, { bg: hex('#000024'), fg: hex('#dbdbff') });
  }
}
async function options() {
  for (;;) {
    const sp = ['FAST', 'NORMAL', 'SLOW'][OPT.msg];
    const a = await menu([{ t: 'MESSAGES', r: sp }, { t: 'BATTLE SCENES', r: OPT.cut ? 'ON' : 'OFF' }, { t: 'MUSIC', r: OPT.mus ? 'ON' : 'OFF' }, 'BACK'], { x: 150, y: 40, w: 160 });
    if (a < 0 || a === 3) { store('cf_opt', OPT); return; }
    if (a === 0) OPT.msg = (OPT.msg + 1) % 3; if (a === 1) OPT.cut = !OPT.cut;
    if (a === 2) { OPT.mus = !OPT.mus; if (musBus) musBus.gain.value = OPT.mus ? .32 : 0; }
  }
}
