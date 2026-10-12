'use strict';
// ================= DARK MONDAY: items, equipment, the floor, and the inventory screen =================
// kinds: weapon (dmg, cd, ranged), armor (slot, ac), food (food), potion (heal), key, quest, junk
const ITEMS = {
  FISTS:        { name: 'FISTS', kind: 'weapon', dmg: [1, 2], cd: 36, col: '#c0c0d0', hidden: 1 },
  ENERGY_SWORD: { name: 'ENERGY SWORD', kind: 'weapon', dmg: [3, 8], cd: 48, col: '#ff40d0', desc: 'A blade of light. Standard issue for anyone who owes the temple money.' },
  PLASMA_AXE:   { name: 'PLASMA AXE', kind: 'weapon', dmg: [4, 10], cd: 62, col: '#ff7020', desc: 'Heavy and slow. Sings when swung.' },
  VOLT_BLADE:   { name: 'VOLT BLADE', kind: 'weapon', dmg: [2, 7], cd: 34, col: '#40e0ff', desc: 'Quick. Hums a little off key.' },
  BONG_HORN:    { name: 'PLASMA BONG-HORN', kind: 'weapon', dmg: [2, 6], cd: 58, col: '#70ff30', ranged: 1, desc: 'Throws a ball of light. Do not ask what was in it.' },
  STAPLER:      { name: 'STAPLER BLASTER', kind: 'weapon', dmg: [2, 5], cd: 54, col: '#ffe040', ranged: 1, desc: 'Fires staples. Industrial grade.' },
  CUE_CARDS:    { name: 'CUE CARDS', kind: 'weapon', dmg: [1, 4], cd: 34, col: '#e0e0ff', ranged: 1, desc: 'Thrown. They are all blank. That is the cut.' },
  LASER_PISTOL: { name: 'LASER PISTOL', kind: 'weapon', dmg: [2, 6], cd: 44, col: '#ff6020', ranged: 1, desc: 'A detective\'s friend. It has a wrapped grip and a bad past.' },
  REBOOT_ROD:   { name: 'REBOOT ROD', kind: 'weapon', dmg: [2, 5], cd: 50, col: '#70ff30', desc: 'Turns things off. Sometimes back on.' },
  GLYPH_STAFF:  { name: 'GLYPH STAFF', kind: 'weapon', dmg: [1, 4], cd: 50, col: '#80e8ff', ranged: 1, desc: 'Writes on the air. Mostly short words.' },
  CHALK:        { name: 'SIGIL CHALK', kind: 'weapon', dmg: [1, 3], cd: 40, col: '#f6d8c0', desc: 'Draws on walls. Also on people, in a pinch.' },
  HELM_RIM:     { name: 'RIM HELM', kind: 'armor', slot: 'head', ac: 1, col: '#80e8ff', desc: 'A chrome cap with a magenta stripe.' },
  VEST_CHROME:  { name: 'CHROME VEST', kind: 'armor', slot: 'body', ac: 2, col: '#a8b8d0', desc: 'Light, shiny, slightly warm.' },
  PLATE_GLASS:  { name: 'GLASS PLATE', kind: 'armor', slot: 'body', ac: 4, col: '#60c8ff', desc: 'Black glass armor. Hard to wear and harder to dent.' },
  BOOTS_HOVER:  { name: 'HOVER BOOTS', kind: 'armor', slot: 'feet', ac: 1, col: '#ff40d0', desc: 'They hover a finger above the floor. Not a long finger.' },
  AMULET_PHONE: { name: 'PHONE AMULET', kind: 'armor', slot: 'neck', ac: 1, col: '#ffe040', desc: 'Rings in a minor key when the temple is near.' },
  PROP_PILLS:   { name: 'PROP PILLS', kind: 'potion', heal: 14, col: '#ff70b0', desc: 'Heals a little. A product of Pretend Co. Delivered by Carl.' },
  BIG_PILLS:    { name: 'BIG PILLS', kind: 'potion', heal: 30, col: '#ff3070', desc: 'Heals a lot. They come in a bigger bottle.' },
  LASAGNA:      { name: 'LASAGNA', kind: 'food', food: 40, col: '#ff9040', desc: 'It is a food group. Eat it hot.' },
  RATION:       { name: 'RATION CUBE', kind: 'food', food: 25, col: '#c8a870', desc: 'A cube. Tastes like the cube.' },
  CHIP_BONG:    { name: 'BONG-FX CHIP', kind: 'junk', col: '#70ff30', desc: 'It is on the box. It does nothing.' },
  CHIP_ECTO:    { name: 'ECTO-FX CHIP', kind: 'junk', col: '#ff40d0', desc: 'It does something. Nobody will say what.' },
  TOWEL:        { name: 'TOWEL', kind: 'junk', col: '#c0c8ff', desc: 'A towel. Useful in ways that are hard to explain.' },
  KEY_RUST:     { name: 'RUST KEY', kind: 'key', col: '#d08030', desc: 'Opens a rusty door.' },
  KEY_CYAN:     { name: 'CYAN KEY', kind: 'key', col: '#40e0ff', desc: 'Opens a cyan-sealed door.' },
  KEY_ICE:      { name: 'ICE KEY', kind: 'key', col: '#a0d8ff', desc: 'Cold to the touch. It opens the door to the Collector\'s office.' },
  KEY_GOLD:     { name: 'GOLD KEY', kind: 'key', col: '#ffe040', desc: 'Opens a gold-sealed door.' },
  IOU_1:        { name: 'IOU: THE CELLAR', kind: 'quest', col: '#ffb040', desc: 'A debt, written on a receipt. Someone owes the temple.' },
  IOU_2:        { name: 'IOU: THE TUNNELS', kind: 'quest', col: '#40e0ff', desc: 'A debt, written on a call slip.' },
  IOU_3:        { name: 'IOU: THE CRYPT', kind: 'quest', col: '#80b8ff', desc: 'A debt, written on a server log.' },
};
const START_GEAR = { CARL: 'ENERGY_SWORD', LINDA: 'STAPLER', GHOST: 'CUE_CARDS', JB: 'LASER_PISTOL', FACE: 'REBOOT_ROD', YOKO: 'GLYPH_STAFF', PEEKID: 'CHALK', PILOTX: 'ENERGY_SWORD' };
const PACK_N = 18, EQ_SLOTS = ['head', 'neck', 'body', 'feet'];
const itemOf = id => id ? ITEMS[id] : null;
const acOf = c => (c.ac | 0) + EQ_SLOTS.reduce((n, s) => n + ((itemOf(c.eq[s]) || {}).ac | 0), 0) + (c.buffAc | 0);
let HELD = null; // the item on the cursor

// ---------- icons: 16x16, drawn by kind ----------
const ICONS = {};
function itemIcon(id) {
  if (ICONS[id]) return ICONS[id]; const it = ITEMS[id], c = hex(it.col), dk = mix(c, BLACK, .55), lt = mix(c, WHITE, .5);
  return ICONS[id] = outlineBuf(offscreen(16, 16, () => {
    if (it.kind === 'weapon') {
      if (it.ranged) { rectF(3, 7, 9, 4, dk); rectF(4, 8, 7, 2, c); rectF(10, 6, 4, 2, lt); rectF(4, 11, 3, 3, dk); }
      else { lineF(3, 13, 12, 3, c, 2); lineF(4, 12, 11, 4, lt, 1); rectF(2, 10, 5, 2, dk); }
    } else if (it.kind === 'armor') {
      if (it.slot === 'head') { ellF(8, 8, 6, 5, c); rectF(2, 8, 12, 3, dk); rectF(6, 4, 4, 2, lt); }
      else if (it.slot === 'body') { polyF([[3, 3], [13, 3], [14, 8], [11, 14], [5, 14], [2, 8]], c); polyF([[6, 3], [10, 3], [8, 7]], dk); lineF(8, 7, 8, 13, lt); }
      else if (it.slot === 'feet') { rectF(4, 3, 5, 8, c); rectF(4, 10, 9, 3, dk); rectF(5, 4, 2, 6, lt); }
      else { ellF(8, 9, 5, 5, c); ellF(8, 9, 3, 3, BLACK); rectF(7, 2, 2, 3, lt); }
    } else if (it.kind === 'potion') { rectF(6, 2, 4, 3, lt); rectF(4, 5, 8, 9, c); rectF(5, 6, 3, 7, lt); rectF(4, 11, 8, 3, dk); }
    else if (it.kind === 'food') { rectF(2, 4, 12, 3, mix(c, BLACK, .3)); rectF(2, 7, 12, 3, c); rectF(2, 10, 12, 3, hex('#ffe070')); for (let x = 3; x < 13; x += 3) pset(x, 5, lt); }
    else if (it.kind === 'key') { ellF(5, 5, 3, 3, c); ellF(5, 5, 1, 1, BLACK); rectF(7, 6, 7, 2, c); rectF(11, 8, 2, 3, c); rectF(14, 8, 1, 2, c); }
    else if (it.kind === 'quest') { polyF([[8, 1], [14, 8], [8, 15], [2, 8]], c); polyF([[8, 1], [14, 8], [8, 8]], lt); polyF([[8, 8], [14, 8], [8, 15]], dk); glow(8, 8, 9, c, .5); }
    else { rectF(3, 2, 10, 12, dk); rectF(4, 3, 8, 6, c); for (let x = 4; x < 12; x += 2) rectF(x, 11, 1, 3, lt); }
  }));
}
const _small = {}; const smallIcon = (id) => _small[id] || (_small[id] = shrink(itemIcon(id), 13, 10));

// ---------- the floor ----------
const floorItems = (lv, x, y) => (lv.items || []).filter(i => i.x === x && i.y === y);
function itemEnts(g) {
  const out = []; for (const lv of [g.lv]) { const seen = {};
    for (const it of lv.items || []) { const k = it.x + ',' + it.y, n = seen[k] = (seen[k] || 0) + 1; out.push({ x: it.x, y: it.y, spr: itemIcon(it.id), size: .2, dx: (n - 1) * .22 - (floorItems(lv, it.x, it.y).length - 1) * .11, dz: 0, lift: 0, noFog: 0 }); } }
  return out;
}
function pickFront() { // pick up from the cell ahead (or this cell) onto the cursor
  const g = GM; if (HELD) return false;
  for (const [x, y] of [[g.x + DX[g.dir], g.y + DY[g.dir]], [g.x, g.y]]) { const it = floorItems(g.lv, x, y)[0]; if (it) { g.lv.items.splice(g.lv.items.indexOf(it), 1); HELD = it.id; msg('YOU TAKE THE ' + ITEMS[it.id].name + '.', hex('#7affb0')); sfx('tick'); return true; } }
  return false;
}
function dropFront() { const g = GM; if (!HELD) return false; const x = g.x + DX[g.dir], y = g.y + DY[g.dir], ok = walkable(g.lv, x, y) || cellCh(g.lv, x, y) === 'D' ? [x, y] : [g.x, g.y]; (g.lv.items = g.lv.items || []).push({ x: ok[0], y: ok[1], id: HELD }); msg('YOU DROP THE ' + ITEMS[HELD].name + '.'); HELD = null; sfx('tick'); return true; }

// ---------- inventory slots ----------
function slotRef(c, ref) { // ref: ['hand',h] | ['eq',name] | ['pack',i]
  return ref[0] === 'hand' ? { get: () => c.hands[ref[1]], set: v => { c.hands[ref[1]] = v; } } : ref[0] === 'eq' ? { get: () => c.eq[ref[1]], set: v => { c.eq[ref[1]] = v; } } : { get: () => c.pack[ref[1]], set: v => { c.pack[ref[1]] = v; } };
}
function accepts(ref, id) { if (!id) return true; const it = ITEMS[id]; return ref[0] !== 'eq' || (it.kind === 'armor' && it.slot === ref[1]); }
function grab(c, ref) { // click a slot: pick up, place, or swap
  const s = slotRef(c, ref), cur = s.get();
  if (!accepts(ref, HELD)) { msg('THAT DOES NOT GO THERE.', hex('#ff6a7a')); sfx('bump'); return; }
  s.set(HELD); HELD = cur; sfx('tick');
}
function useItem(c, ref) { // right click / C: eat or drink
  const s = slotRef(c, ref), id = s.get(), it = itemOf(id); if (!it) return;
  if (it.kind === 'food') { c.food = Math.min(100, c.food + it.food); s.set(null); msg(c.name + ' EATS THE ' + it.name + '.', hex('#ffb040')); sfx('ok'); }
  else if (it.kind === 'potion') { if (c.dead) { msg('THEY ARE BEYOND PILLS.'); return; } c.hp = Math.min(c.max, c.hp + it.heal); s.set(null); msg(c.name + ' TAKES THE ' + it.name + '.', hex('#7affb0')); sfx('ok'); }
  else msg(it.name + ': ' + (it.desc || 'Nothing happens.'));
}
function giveItem(c, id) { const i = c.pack.indexOf(null); if (i < 0) return false; c.pack[i] = id; return true; }
function partyHas(id) { return PARTY.some(c => c.pack.includes(id) || c.hands.includes(id)); }
function takeFromParty(id) { for (const c of PARTY) { let i = c.pack.indexOf(id); if (i >= 0) { c.pack[i] = null; return true; } i = c.hands.indexOf(id); if (i >= 0) { c.hands[i] = null; return true; } } return false; }

// ---------- the inventory screen ----------
const INV = { open: 0, ci: 0, cur: 0, tab: 0 };
const invSlots = () => { // [{ref, x, y, label}]
  const out = [{ ref: ['eq', 'head'], x: 124, y: 22, l: 'HD' }, { ref: ['eq', 'neck'], x: 124, y: 52, l: 'NK' }, { ref: ['eq', 'body'], x: 124, y: 82, l: 'BD' }, { ref: ['eq', 'feet'], x: 124, y: 112, l: 'FT' },
    { ref: ['hand', 0], x: 158, y: 52, l: 'RH' }, { ref: ['hand', 1], x: 158, y: 82, l: 'LH' }];
  for (let i = 0; i < PACK_N; i++) out.push({ ref: ['pack', i], x: 204 + (i % 6) * 30, y: 22 + ((i / 6) | 0) * 30 });
  return out;
};
function openInv(ci) { INV.open = 1; INV.ci = ci; INV.cur = 6; sfx('ok'); }
function updateInv() {
  const c = PARTY[INV.ci], slots = invSlots();
  if (pressed.b) { if (HELD) { const i = c.pack.indexOf(null); if (i >= 0) { c.pack[i] = HELD; HELD = null; } else msg('NO ROOM IN THE PACK.'); } INV.open = 0; sfx('tick'); return; }
  if (pressed.sl) INV.ci = (INV.ci + PARTY.length - 1) % PARTY.length; if (pressed.sr) INV.ci = (INV.ci + 1) % PARTY.length;
  // keyboard cursor: jump to the slot most in that direction
  const dir = pressed.left ? [-1, 0] : pressed.right ? [1, 0] : pressed.up ? [0, -1] : pressed.down ? [0, 1] : null;
  if (dir) { const cu = slots[INV.cur]; let best = -1, bd = 1e9; slots.forEach((s, i) => { if (i === INV.cur) return; const dx = s.x - cu.x, dy = s.y - cu.y, along = dx * dir[0] + dy * dir[1]; if (along <= 0) return; const d = along + Math.abs(dir[0] ? dy : dx) * 2.2; if (d < bd) { bd = d; best = i; } }); if (best >= 0) { INV.cur = best; sfx('move'); } }
  const mi = MOUSE.on ? slots.findIndex(s => hit(s.x, s.y, 26, 26)) : -1; if (mi >= 0 && (MOUSE.x !== INV.mx || MOUSE.y !== INV.my)) INV.cur = mi; INV.mx = MOUSE.x; INV.my = MOUSE.y;
  if (MOUSE.click) { MOUSE.click = 0; if (mi >= 0) { INV.cur = mi; grab(c, slots[mi].ref); } else { const pi = PARTY.findIndex((p, i) => hit(128 + i * 44, 205, 40, 47)); if (pi >= 0) INV.ci = pi; } }
  if (pressed.a) grab(c, slots[INV.cur].ref);
  if (MOUSE.rclick) { MOUSE.rclick = 0; if (mi >= 0) useItem(c, slots[mi].ref); }
  if (pressed.c) useItem(c, slots[INV.cur].ref);
}
function drawInv() {
  const c = PARTY[INV.ci], slots = invSlots();
  cls(hex('#02010a')); panel(4, 4, W - 8, H - 8);
  text(c.name + '   ' + c.cls + '  LEVEL ' + c.lvl, 14, 12, c.col); text(c.tag, W - 14 - tw(c.tag), 12, hex('#6a7cc8'));
  blit(portrait(c.id), 14, 24); const sy = 138;
  [['HP', c.hp + '/' + c.max], ['AC', acOf(c)], ['XP', c.xp + '/' + 60 * c.lvl], ['SP', (c.sp | 0) + '/' + (c.spMax | 0)], ['FOOD', Math.round(c.food) + '%']].forEach(([k, v], i) => { text(k, 14, sy + i * 12, hex('#6a7cc8')); text(String(v), 54, sy + i * 12, WHITE); });
  slots.forEach((s, i) => {
    panel(s.x - 2, s.y - 2, 30, 30, i === INV.cur ? hex('#2a4aa0') : hex('#0a0820')); const id = slotRef(c, s.ref).get(); if (id) blit(itemIcon(id), s.x + 2, s.y + 2);
    if (s.l && !id) text(s.l, s.x + 7, s.y + 9, hex('#3a4a88'), null);
  });
  const cs = slots[INV.cur], cid = HELD || slotRef(c, cs.ref).get(); panel(124, 146, 372, 56);
  if (cid) { const it = ITEMS[cid]; text(it.name + (HELD ? '  (HELD)' : ''), 134, 152, hex(it.col)); text((it.kind === 'weapon' ? 'DMG ' + it.dmg[0] + '-' + it.dmg[1] + '  SPEED ' + it.cd + (it.ranged ? '  RANGED' : '  MELEE') : it.kind === 'armor' ? 'ARMOR +' + it.ac + '  (' + it.slot.toUpperCase() + ')' : it.kind === 'potion' ? 'HEALS ' + it.heal : it.kind === 'food' ? 'FOOD +' + it.food : it.kind.toUpperCase()), 134, 164, hex('#a8b8ff')); (it.desc ? wrapT(it.desc, 58) : []).forEach((l, i) => text(l, 134, 178 + i * 11, WHITE)); }
  else text('EMPTY', 134, 160, hex('#3a4a88'));
  PARTY.forEach((p, i) => { const x = 128 + i * 44; panel(x - 2, 204, 44, 49, i === INV.ci ? hex('#2a2a70') : null); blit(smallPort(p.id), x, 205); });
  wrapT('CLICK: GRAB OR PLACE. R-CLICK OR C: USE. A/D: PARTY. X: CLOSE.', 17).forEach((l, i) => text(l, 14, 204 + i * 11, hex('#6a7cc8')));
  if (HELD) { const x = MOUSE.on ? MOUSE.x - 11 : cs.x + 3, y = MOUSE.on ? MOUSE.y - 11 : cs.y + 3; blit(itemIcon(HELD), x | 0, y | 0); }
}
