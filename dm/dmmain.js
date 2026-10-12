'use strict';
// ================= DARK MONDAY: the world scene, movement, interaction, triggers, menus, saves =================
BTNS.push('sl', 'sr'); Object.assign(KEYMAP, { KeyA: 'sl', KeyD: 'sr', KeyQ: 'left', KeyE: 'right' }); for (let i = 1; i <= 6; i++) { BTNS.push('c' + i); KEYMAP['Digit' + i] = 'c' + i; } BTNS.push('cast'); KEYMAP.KeyF = 'cast'; BTNS.push('map'); KEYMAP.KeyM = 'map';
Object.assign(UI, { frame: hex('#20e0ff'), frame2: hex('#d020b0'), panel: hex('#06040e'), panel2: hex('#14123a'), hi: hex('#ff9a20') });

let GM = null; // the running game: level, position, animation, story flags
const DEFAULT_PARTY = ['CARL', 'LINDA', 'JB', 'YOKO', 'GHOST', 'FACE'];
function newGame(n = 0, ids = DEFAULT_PARTY, fresh = false) {
  if (fresh) resetLevels(); const lv = LEVELS[n]; setParty(ids); lv.visited = 1;
  GM = { lv, n, x: lv.start[0], y: lv.start[1], dir: lv.start[2], cx: 0, cz: 0, anim: null, snap: null, rep: {}, dn: {}, edge: {}, sel: 0, flags: {}, ft: 0, steps: 0, disk: lv.disk || 1, hold: 0, talks: [] };
  LOG.length = 0; FX.length = 0; INV.open = 0; msg(lv.name + '.'); music(lv.music || 'cellar'); markSeen(GM);
}
const canEnter = (lv, x, y) => { if (mobAt(lv, x, y) || (lv.npcs || []).some(n => n.x === x && n.y === y)) return false; const ch = cellCh(lv, x, y); if (BLOCKS.indexOf(ch) >= 0) return false; if (ch === 'D') return lv.st.door[x + ',' + y].open > .5; return true; };
// rel: 0 forward, 1 right, 2 back, 3 left (relative to facing)
function startMove(rel) {
  const g = GM, d = (g.dir + rel) & 3, nx = g.x + DX[d], ny = g.y + DY[d];
  if (!canEnter(g.lv, nx, ny)) { sfx('bump'); return; }
  g.anim = { t: 0, n: 6, mv: rel, nx, ny, d };
}
function startTurn(s) { const g = GM; g.snap = VBUF.d.slice(); g.anim = { t: 0, n: 8, turn: s, ndir: (g.dir + s + 4) & 3 }; }

// ---------- triggers: declarative actions fired by levers, plates, steps and touches ----------
function setDoor(lv, key, state) { const d = lv.st.door[key]; if (!d) return; d.locked = 0; d.to = state === -1 ? (d.open > .5 ? 0 : 1) : state; }
function revealWall(lv, key) { const [x, y] = key.split(',').map(Number); if (cellCh(lv, x, y) !== 'S') return; setCell(lv, x, y, 'D'); lv.st.door[key] = { open: 0, locked: 0, to: 1 }; }
function giveOrDrop(g, id) { for (const c of PARTY) if (!c.dead && giveItem(c, id)) { msg('YOU GET THE ' + ITEMS[id].name + '.', hex('#ffe040')); sfx('get'); return; } (g.lv.items = g.lv.items || []).push({ id, x: g.x, y: g.y }); }
function fireTrig(g, t, key) {
  if (!t) return; const fk = 't_' + g.n + '_' + key; if (t.once && g.flags[fk]) return; if (t.once) g.flags[fk] = 1;
  if (t.sfx) sfx(t.sfx); if (t.msg) msg(t.msg);
  if (t.door) for (const k in t.door) setDoor(g.lv, k, t.door[k]);
  if (t.reveal) for (const k of t.reveal) revealWall(g.lv, k);
  if (t.flag) g.flags[t.flag] = 1;
  if (t.give) giveOrDrop(g, t.give);
  if (t.floor) for (const [id, x, y] of t.floor) g.lv.items.push({ id, x, y });
  if (t.spawn) for (const [ty, x, y] of t.spawn) { const m = mkMob(ty, x, y); m.awake = 1; g.lv.mobs.push(m); }
  if (t.hurt) for (const c of PARTY) if (!c.dead) { c.hp = Math.max(1, c.hp - t.hurt); c.hurt = 8; }
  if (t.wake) for (const m of g.lv.mobs) if (m.t === t.wake) m.awake = 1;
  if (t.banter) run(() => banter(t.banter));
  if (t.scene && SCENES[t.scene]) run(() => SCENES[t.scene](g));
  if (t.say) run(() => playLines(t.say));
}
function arrive(g) { // after a step lands
  const lv = g.lv, k = g.x + ',' + g.y, ch = cellCh(lv, g.x, g.y); g.steps++; sfx('step'); markSeen(g);
  if (ch === 'p') { lv.st.mark[k] = 1; sfx('switch'); fireTrig(g, lv.trig.plate[k], 'plate' + k); }
  if (ch === 'O') { g.dir = (g.dir + cint(1, 3)) & 3; g.snap = null; msg('THE FLOOR SPINS!', hex('#ff40d0')); sfx('phase'); post.flash = .35; }
  if (ch === 'T' && lv.tele && lv.tele[k]) { const [tx, ty, td] = lv.tele[k]; g.x = tx; g.y = ty; if (td !== undefined) g.dir = td; msg('THE WORLD FOLDS.', hex('#80e8ff')); sfx('phase'); post.flash = .5; }
  const f = lv.ev && lv.ev.step && lv.ev.step[k]; if (f) f(g);
  fireTrig(g, lv.trig.step[g.x + ',' + g.y], 'step' + g.x + ',' + g.y);
  const st = lv.stairs && lv.stairs[g.x + ',' + g.y]; if (st) { g.hold = 1; run(() => goLevel(st)); }
}
async function goLevel(st) {
  const g = GM; g.hold = 1; sfx('door'); await fadeOut(.07);
  if (st.disk && st.disk !== g.disk) { await diskSwap(st.disk); g.disk = st.disk; }
  const lv = LEVELS[st.to];
  if (!lv) { await endOfDemo(); return; }
  g.lv = lv; g.n = st.to; g.x = st.x; g.y = st.y; g.dir = st.dir; g.anim = null; g.cx = g.cz = 0; lv.visited = 1; lv._dk = null; FX.length = 0; markSeen(g);
  music(lv.music || 'cellar'); await wait(10); await fadeIn(.07); banner(lv.name, 160); msg(lv.name + '.'); g.hold = 0;
  const f = lv.trig.step[g.x + ',' + g.y]; if (f) fireTrig(g, f, 'step' + g.x + ',' + g.y);
}
function faceKey(g) { const nx = g.x + DX[g.dir], ny = g.y + DY[g.dir]; return nx + ',' + ny + ',' + DIRN[(g.dir + 2) & 3]; }
// use what is in front of you: doors, levers, signs. returns true if something happened
function useFront() {
  const g = GM, lv = g.lv, nx = g.x + DX[g.dir], ny = g.y + DY[g.dir], k = nx + ',' + ny, door = lv.st.door[k];
  if (door) {
    if (door.locked === 'TRIG') { msg('IT WILL NOT BUDGE.', hex('#ff6a7a')); sfx('bump'); return true; }
    if (door.locked) { if (partyHas(door.locked)) { takeFromParty(door.locked); msg('THE ' + ITEMS[door.locked].name + ' TURNS. IT CRUMBLES.', hex('#ffe040')); door.locked = 0; sfx('get'); } else { msg('LOCKED. IT WANTS A ' + ITEMS[door.locked].name + '.', hex('#ff6a7a')); sfx('bump'); return true; } }
    door.to = door.open > .5 ? 0 : 1; sfx('door'); return true;
  }
  const dk = faceKey(g), dc = lv.decor && lv.decor[dk];
  if (dc && (dc.k === 'lever' || dc.k === 'button')) { const on = lv.st.dec[dk] = !lv.st.dec[dk]; sfx('switch'); const f = lv.ev && lv.ev.lever && lv.ev.lever[dk]; if (f) f(g, on); fireTrig(g, dc.k === 'lever' ? lv.trig.lever[dk] : lv.trig.touch[dk], dc.k + dk); return true; }
  if (dc && dc.k === 'sign' && lv.text && lv.text[dk]) { run(async () => { await say(lv.text[dk], dc.who || null); }); return true; }
  if (dc && (dc.k === 'rune' || dc.k === 'eye' || dc.k === 'niche' || dc.k === 'socket' || dc.k === 'console')) { const f = lv.ev && lv.ev.touch && lv.ev.touch[dk], t = lv.trig.touch[dk]; if (f) f(g); if (t) fireTrig(g, t, 'touch' + dk); if (f || t) return true; }
  return false;
}
function interact() { if (HELD) return dropFront(); if (useFront()) return true; return pickFront(); }

// ---------- the party menu (Tab) ----------
async function partyMenu() {
  const i = await choose(['INVENTORY', 'REST', 'PARTY TALK', 'MAP', 'MANUAL', 'OPTIONS', 'SAVE', 'LOAD', 'CLOSE'], { x: 270, y: 20, cancel: 1, title: 'PARTY' });
  if (i === 0) { const c = await choose(PARTY.map(p => p.name), { x: 270, y: 20, cancel: 1, title: 'WHO' }); if (c >= 0) openInv(c); }
  else if (i === 1) await rest();
  else if (i === 2) await replayTalk();
  else if (i === 3) await showMap();
  else if (i === 4) await manual(0);
  else if (i === 5) await optionsMenu();
  else if (i === 6) { const s = await choose(['SLOT 1', 'SLOT 2', 'SLOT 3'], { x: 270, y: 20, cancel: 1, title: 'SAVE' }); if (s >= 0) { saveGame(s); msg('SAVED TO SLOT ' + (s + 1) + '.', hex('#7affb0')); sfx('ok'); } }
  else if (i === 7) { const s = await choose(['SLOT 1', 'SLOT 2', 'SLOT 3'], { x: 270, y: 20, cancel: 1, title: 'LOAD' }); if (s >= 0) { if (!loadGame(s)) msg('NOTHING IN THAT SLOT.', hex('#ff6a7a')); } }
}
async function rest() {
  const g = GM, dm = distMap(g.lv, g.x, g.y);
  if (liveMobs(g.lv).some(m => m.awake && dm[m.y * g.lv.w + m.x] >= 0 && dm[m.y * g.lv.w + m.x] <= 7)) { msg('YOU CANNOT REST WITH THAT NEAR.', hex('#ff6a7a')); return; }
  msg('THE PARTY RESTS.'); await fadeOut(.06);
  for (let h = 0; h < 8; h++) {
    for (const c of PARTY) if (!c.dead) { c.hp = Math.min(c.max, c.hp + Math.max(1, Math.round(c.max * .08))); c.sp = Math.min(c.spMax, c.sp + Math.max(1, Math.ceil(c.spMax / 6))); c.food = Math.max(0, c.food - 3); }
    if (crand() < .06) { await fadeIn(.1); msg('SOMETHING FOUND THE CAMP!', hex('#ff6a7a')); const ok = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [g.x + a * 2, g.y + b * 2]).filter(([x, y]) => walkable(g.lv, x, y)); const [mx, my] = ok.length ? ok[0] : [g.x, g.y]; const m = mkMob(crand() < .5 ? 'INTERN' : 'SPIDER', mx, my); m.awake = 1; (g.lv.mobs = g.lv.mobs || []).push(m); return; }
  }
  msg('MORNING. IT IS STILL MONDAY.', hex('#7affb0')); await fadeIn(.06);
}
// food: every half minute the party gets hungrier; starving costs HP
function tickFood(g) {
  if (++g.ft % 1800) return;
  for (const c of PARTY) { if (c.dead) continue; c.food = Math.max(0, c.food - 1);
    if (c.food === 25 || c.food === 10) msg(c.name + ' IS HUNGRY.', hex('#ffb040'));
    if (c.food <= 0) { c.hp -= 1; c.hurt = 6; msg(c.name + ' IS STARVING.', hex('#ff6a7a')); if (c.hp <= 0) { c.hp = 0; c.dead = 1; checkWipe(); } } }
}

// ---------- saves (every visited level is stored) ----------
function lvSnap(lv) {
  return { seen: lv.seen ? Array.from(lv.seen) : null, rows: lv.rows.slice(), doors: Object.fromEntries(Object.entries(lv.st.door).map(([k, d]) => [k, [d.open > .5 ? 1 : 0, d.locked || 0]])), dec: lv.st.dec, mark: lv.st.mark, items: lv.items || [],
    mobs: (lv.mobs || []).filter(m => m.hp > 0).map(m => Object.assign({}, m, { sx: 0, sy: 0 })) };
}
function lvRestore(lv, s) {
  lv.rows = s.rows.slice(); if (s.seen) lv.seen = Uint8Array.from(s.seen); lv.st.dec = s.dec || {}; lv.st.mark = s.mark || {}; lv.items = s.items || [];
  for (const k in s.doors) { if (!lv.st.door[k]) lv.st.door[k] = { open: 0, locked: 0 }; lv.st.door[k].open = s.doors[k][0]; lv.st.door[k].locked = s.doors[k][1]; delete lv.st.door[k].to; }
  lv.mobs = (s.mobs || []).map(m => Object.assign(mkMob(m.t, m.x, m.y, m.path), m)); lv._dk = null; lv.visited = 1;
}
function snapshot() {
  const g = GM, levels = {}; for (const k in LEVELS) if (LEVELS[k].visited) levels[k] = lvSnap(LEVELS[k]);
  return { n: g.n, x: g.x, y: g.y, dir: g.dir, flags: g.flags, steps: g.steps, disk: g.disk, talks: g.talks, party: PARTY.map(c => Object.assign({}, c, { col: undefined, cool: [0, 0] })), levels };
}
function saveGame(slot) { store('dm_save' + slot, snapshot()); }
function loadGame(slot) {
  const s = fetchStore('dm_save' + slot); if (!s) return false;
  resetLevels(); for (const k in s.levels) if (LEVELS[k]) lvRestore(LEVELS[k], s.levels[k]);
  const lv = LEVELS[s.n]; setParty(s.party.map(c => c.id)); s.party.forEach((c, i) => Object.assign(PARTY[i], c, { col: hex(ROSTER[c.id].col), cool: [0, 0] }));
  GM = { lv, n: s.n, x: s.x, y: s.y, dir: s.dir, cx: 0, cz: 0, anim: null, snap: null, rep: {}, dn: {}, edge: {}, sel: 0, flags: s.flags || {}, ft: 0, steps: s.steps || 0, disk: s.disk || lv.disk || 1, hold: 0, talks: s.talks || [] };
  HELD = null; INV.open = 0; FX.length = 0; LOG.length = 0; msg('GAME LOADED.', hex('#7affb0')); music(lv.music || 'cellar'); return true;
}
const hasSave = () => [0, 1, 2].some(i => fetchStore('dm_save' + i));

// ---------- the frame ----------
function portraitAt() { for (let i = 0; i < PARTY.length; i++) { const r = cellRect(i); if (hit(r.x, r.y, 48, 52)) return i; } return -1; }
function updateDoors(lv) { for (const k in lv.st.door) { const d = lv.st.door[k]; if (d.to === undefined) continue; d.open = d.to ? Math.min(1, d.open + .1) : Math.max(0, d.open - .1); if (Math.abs(d.open - d.to) < .001) { d.open = d.to; delete d.to; } } }
function updateWorld() {
  const g = GM; tickShake();
  if (CHATQ) { updateChat(); return; }
  if (INV.open) { updateInv(); return; }
  updateDoors(g.lv);
  const busy0 = DLG || MENUS.length || CARD || g.hold;
  MOUSE.pad = null; if (MOUSE.down) PAD_KEYS.forEach(([k], i) => { const r = padRect(i); if (hit(r.x, r.y, r.w, r.h)) MOUSE.pad = k; });
  const rc = busy0 ? 0 : MOUSE.rclick; if (!busy0) MOUSE.rclick = 0;
  let hh = null, pi = -1, click = false;
  if (MOUSE.click && !busy0) { hh = handAt(); if (!hh) { pi = portraitAt(); click = pi < 0 && hit(DV.x, DV.y, DV.w, DV.h); } MOUSE.click = 0; }
  for (const k of ['up', 'down', 'left', 'right', 'sl', 'sr', 'a']) { const d = !!(held[k] || MOUSE.pad === k); g.edge[k] = d && !g.dn[k]; g.dn[k] = d; g.rep[k] = d ? (g.rep[k] || 0) + 1 : 0; }
  const hitK = k => g.edge[k] || (g.rep[k] > 14 && g.rep[k] % 6 === 0);
  const busy = DLG || MENUS.length || CARD || g.hold;
  if (busy) return;
  if (pressed.start) { run(partyMenu); return; }
  if (pressed.map) { run(showMap); return; }
  if (rc) { const ri = portraitAt(); if (ri >= 0) { run(() => castMenu(ri)); return; } }
  if (pressed.cast) { run(castWho); return; }
  if (pi >= 0) { openInv(pi); return; }
  updateCombat(g); tickFood(g);
  for (let i = 0; i < 6; i++) if (pressed['c' + (i + 1)]) attack(i, 0);
  if (hh) { if (HELD) grab(PARTY[hh[0]], ['hand', hh[1]]); else attack(hh[0], hh[1]); }
  if (pressed.b && HELD) dropFront();
  const a = g.anim;
  if (a) {
    a.t++;
    if (a.mv !== undefined) { const p = a.t / a.n, vx = DX[a.d], vy = DY[a.d], fx = DX[g.dir], fy = DY[g.dir], rx = DX[(g.dir + 1) & 3], ry = DY[(g.dir + 1) & 3];
      g.cz = (vx * fx + vy * fy) * p; g.cx = (vx * rx + vy * ry) * p;
      if (a.t >= a.n) { g.x = a.nx; g.y = a.ny; g.cx = g.cz = 0; g.anim = null; arrive(g); } }
    else if (a.phase) { g.cz = 2 * a.t / a.n; if (a.t >= a.n) { g.x = a.nx; g.y = a.ny; g.cz = 0; g.anim = null; arrive(g); } }
    else if (a.turn) { if (a.t >= a.n) { g.dir = a.ndir; g.anim = null; g.snap = null; markSeen(g); } }
    return;
  }
  if (hitK('up')) startMove(0); else if (hitK('down')) startMove(2); else if (hitK('sl')) startMove(3); else if (hitK('sr')) startMove(1);
  else if (hitK('left')) startTurn(-1); else if (hitK('right')) startTurn(1); else if (g.edge.a || click) interact();
}
function worldEnts(g) { return itemEnts(g).concat(npcEnts(g), mobEnts(g)); }
function drawWorld() {
  if (INV.open) { drawInv(); drawCursor(); return; }
  const g = GM; cls(hex('#02010a'));
  panel(DV.x - 4, DV.y - 4, DV.w + 8, DV.h + 8);
  const cam = { x: g.x, y: g.y, dir: g.dir, cx: g.cx, cz: g.cz, dark: inDark(g) }, a = g.anim;
  if (a && a.turn && g.snap) { // wipe: the old view slides out, the new one slides in
    const old = g.snap, nb = renderView(g.lv, Object.assign(cam, { dir: a.ndir }), worldEnts(g)), s = Math.round(DV.w * (a.t / a.n)) * a.turn, out = newBuf(DV.w, DV.h);
    for (let y = 0; y < DV.h; y++) for (let x = 0; x < DV.w; x++) { const ox = x + s, nx = ox - DV.w * a.turn; out.d[y * DV.w + x] = (ox >= 0 && ox < DV.w) ? old[y * DV.w + ox] : (nx >= 0 && nx < DV.w ? nb.d[y * DV.w + nx] : 0); }
    copyBuf(out, DV.x, DV.y);
  } else copyBuf(renderView(g.lv, cam, worldEnts(g)), DV.x, DV.y);
  drawFX(); drawHUD(g); drawTalkPortrait(); if (CHATQ) drawChat();
  if (HELD) blit(itemIcon(HELD), (MOUSE.on ? MOUSE.x - 11 : DV.x + DV.w / 2 - 11) | 0, (MOUSE.on ? MOUSE.y - 11 : DV.y + DV.h - 28) | 0);
  drawCursor();
}
function drawFX() {
  for (const f of FX) { if (f.k === 'beam') { lineF(f.x1, f.y1, f.x2, f.y2, f.c, 2); lineF(f.x1, f.y1, f.x2, f.y2, WHITE, 1); } else text(f.s, f.x - tw(f.s) / 2, f.y, f.c); }
}
const worldScene = { update: updateWorld, draw: drawWorld };
