'use strict';
// ================= DEUS EX NEVADA: boot, title, new game, travel, saves, the game scene =================
G.viewers = 1;
function viewersTick() { if (frame % 300 === 0) { const base = 40 + (G.hubIdx || 0) * 30 + P.kills * 2 + P.alarms * 5; G.viewers = Math.max(1, Math.round(base + Math.sin(frame / 3000) * 12 + rnd(8))); } }

// ---------- travel ----------
let LASTSAVE = null;
function gotoMap(id, at, o = {}) {
  const prev = P.map; if (prev) { MAPSTATE[prev.id] = snapMap(prev); if (P.carry) { const b = P.carry; P.carry = null; b.hidden = 0; b.carried = 0; b.x = P.x; b.y = P.y; } }
  const M = buildMap(id); restoreMap(M, MAPSTATE[id]); P.map = M; G.mapId = id;
  const sp = (at && (M.ents.find(e => (e.k === 'spawn' || e.k === 'exit') && e.id === at))) || M.ents.find(e => e.k === 'spawn' && e.id === 'start') || M.ents.find(e => e.k === 'spawn');
  if (sp) { P.x = (sp.px !== undefined ? sp.px : sp.x + .5); P.y = (sp.py !== undefined ? sp.py : sp.y + .5); if (sp.face !== undefined) P.aim = P.face = sp.face; if (sp.k === 'exit' && sp.out) { P.x += sp.out[0]; P.y += sp.out[1]; } }
  if (o.x !== undefined) { P.x = o.x; P.y = o.y; }
  P.crouch = 0; P.busy = null; P.drone = null; delete P.augOn.drone; M.visDirty = 1; buildLUT(M.d.shadow || '#000010', M.d.mem || '#0c1630');
  G.hub = M.d.hub || G.hub; if (M.d.music && OPT.music) music(M.d.music);
  if (M.d.title && M.d.title !== G.lastTitle) { G.lastTitle = M.d.title; G.hubName = M.d.title; G.hubSub = M.d.sub || ''; G.hubT = 240; }
  const first = !F['visited_' + id]; F['visited_' + id] = 1;
  if (first && rnd(2) === 0) chatReact('enter');
  if (M.d.enter) run(() => M.d.enter(M, first));
  if (first && M.d.first) run(() => M.d.first(M));
  camTo(M, P.x, P.y); computeVis(M, P.x, P.y);
  return M;
}
// auto exits: walking onto an exit tile
function checkExits(M) {
  for (const e of M.ents) if (e.k === 'exit' && !e.frobbable && !e.off && !(e.crouch && !P.crouch)) { const w = e.w || 1, h = e.h || 1; if (P.x >= e.x && P.x < e.x + w && P.y >= e.y && P.y < e.y + h) { if (e.when && !e.when()) { if (!e.warned) { e.warned = 1; msg(e.no || "Can't go that way yet."); } continue; } e.warned = 0; if (e.fn) { run(() => e.fn(M, e)); return; } if (e.to === M.id) { const sp = M.ents.find(s => s.k === 'spawn' && s.id === e.at); if (sp) { P.x = sp.x + .5; P.y = sp.y + .5; if (sp.face !== undefined) P.aim = sp.face; M.visDirty = 1; sfx('door'); } return; } gotoMap(e.to, e.at); return; } else e.warned = 0; }
}

// ---------- the game scene ----------
const gameScene = {
  update() {
    const M = P.map; if (!M) return;
    if (P.dead) { if (!G.deathShown) { G.deathShown = 1; run(deathScreen); } return; }
    infolinkTick(); chatTick(); viewersTick();
    if (G.ui || G.cut) { if (G.cut) worldTick(M, true); return; }
    // hotkeys
    if (tap('Escape')) { run(pauseMenu); return; }
    if (tap('Tab') || tap('KeyI')) { run(() => openScreen('inventory')); return; }
    if (tap('KeyG')) { run(() => openScreen('goals')); return; }
    if (tap('KeyM')) { run(() => openScreen('map')); return; }
    if (tap('KeyL')) { run(() => openScreen('log')); return; }
    if (tap('KeyH')) { OPT.chat = (OPT.chat + 1) % 3; saveOpt(); }
    if (tap('KeyV')) { OPT.visuals = (OPT.visuals + 1) % 2; saveOpt(); if (typeof fit === 'function') fit(); banner(OPT.visuals ? 'VISUALS: REMASTERED' : 'VISUALS: CLASSIC (1994)', 90); }
    if (tap('F9')) { quickSave(); }
    if (tap('F10')) { quickLoad(); return; }
    updatePlayer(M); updateBusy(M);
    worldTick(M, false);
    if (P.map === M) checkExits(M);
  },
  draw() {
    const M = P.map; if (!M) { cls(); return; }
    const lead = P.zoom ? [clamp(MOUSE.x - W / 2, -200, 200) * 1.3, clamp(MOUSE.y - H / 2, -100, 100) * 1.3] : MOUSE.on && !G.ui && !G.cut ? [clamp(MOUSE.x - W / 2, -W / 2, W / 2) * .18, clamp(MOUSE.y - H / 2, -H / 2, H / 2) * .18] : null;
    const fx = P.drone ? P.drone.x : (G.camFocus ? G.camFocus.x : P.x), fy = P.drone ? P.drone.y : (G.camFocus ? G.camFocus.y : P.y);
    camTo(M, fx, fy, lead);
    // vision: recompute when the eye moves to a new tile or the map changed
    const vx = P.drone ? P.drone.x : P.x, vy = P.drone ? P.drone.y : P.y, key = ((vx * 2) | 0) + ',' + ((vy * 2) | 0) + ',' + M.ver;
    if (M.visKey !== key || M.visDirty) { M.visKey = key; M.visDirty = 0; computeVis(M, vx, vy, P.augOn.vision >= 4 ? 30 : 24); }
    renderWorld(M);
    if (P.drunk > 0 || P.high > 0) { const k = P.drunk > 0 ? 2 : 1; for (let y = 0; y < H; y += 2) { const off = Math.round(Math.sin(y / 14 + frame / 20) * k); if (off) SCREEN.copyWithin(y * W + Math.max(0, off), y * W + Math.max(0, -off), y * W + W - Math.abs(off)); } }
    if (P.augOn.vision) { for (let i = 0; i < W * H; i += 1) if (VB[i] === 2 && LB[i] < 140) { const c = SCREEN[i]; SCREEN[i] = rgb((c & 255) * .5, Math.min(255, ((c >> 8) & 255) * 1.6 + 30), ((c >> 16) & 255) * .5); } }
    drawHUD(); drawConv(); drawModals();
    if (G.cutBars) { rectF(0, 0, W, 18, BLACK); rectF(0, H - 18, W, 18, BLACK); }
  },
};
function worldTick(M, cutscene) {
  G.t += DT; M.time += DT; pathBudget = 3;
  for (const e of M.ents.slice()) { if (e.gone) continue; if (e.k === 'npc') updateNPC(M, e); else if (e.k === 'proj') updateProj(M, e); }
  updateSecurity(M);
  for (const f of M.fx) f.t--; M.fx = M.fx.filter(f => f.t > 0);
  for (const n of M.noise) n.t--; M.noise = M.noise.filter(n => n.t > 0);
  if (M.d.tick) M.d.tick(M); if (!cutscene) musicTick(M);
  if (HUBS[G.hub] && HUBS[G.hub].tick) HUBS[G.hub].tick(M);
}

// ---------- death ----------
async function deathScreen() {
  await wait(60); let r = null;
  await modal(() => { rectA(0, 0, W, H, hex('#200000'), .6); box(156, 70, 200, 110, 'YOU ARE DEAD'); ctext('CARL DENTON', 92, UIC.red, 0); ctext('SIGNAL LOST', 104, UIC.dim, 0); if (btn(176, 122, 160, 'LOAD QUICKSAVE', { dis: !fetchStore('dx_save_q'), key: 'F10' })) r = 'q'; if (btn(176, 138, 160, 'LOAD GAME')) r = 'l'; if (btn(176, 154, 160, 'QUIT TO TITLE')) r = 't'; }, () => r || undefined);
  G.deathShown = 0;
  if (r === 'q') quickLoad(); else if (r === 'l') { const ok = await saveUI(false); if (!ok) { G.deathShown = 0; } } else toTitle();
}

// ---------- saves ----------
const rle = a => { let s = '', c = a[0], n = 0; for (let i = 0; i <= a.length; i++) { if (i < a.length && a[i] === c && n < 9999) n++; else { s += c + ':' + n + ','; c = a[i]; n = 1; } } return s; };
const unrle = (s, len) => { const a = new Uint8Array(len); let i = 0; for (const part of s.split(',')) { if (!part) continue; const [c, n] = part.split(':').map(Number); a.fill(c, i, i + n); i += n; } return a; };
function serialize(label) {
  const M = P.map; MAPSTATE[M.id] = snapMap(M);
  const p = {}; for (const k in P) if (k !== 'map' && k !== 'carry' && k !== 'drone' && k !== 'busy' && k !== 'held') p[k] = P[k]; p.heldUid = P.held ? P.held.uid : null;
  const seen = {}; for (const k in SEEN) seen[k] = rle(SEEN[k]);
  return { v: 1, label: label || (G.hubName || M.d.name || M.id), date: new Date().toISOString().slice(0, 16).replace('T', ' '), F, p, map: M.id, ms: MAPSTATE, seen, rel: REL, kn: KEYNAMES, hub: G.hub, hubIdx: G.hubIdx, chat: CHATLOG.slice(-40), conv: CONVLOG.slice(-150), uid: UID, lastTitle: G.lastTitle, opt: { diff: OPT.diff } };
}
function deserialize(s) {
  F = s.F; for (const k in MAPSTATE) delete MAPSTATE[k]; Object.assign(MAPSTATE, s.ms); for (const k in SEEN) delete SEEN[k];
  for (const k in REL) delete REL[k]; for (const a in s.rel) REL[a] = Object.assign({}, s.rel[a]); Object.assign(KEYNAMES, s.kn || {});
  P = Object.assign(newPlayer(), s.p); P.map = null; P.held = s.p.heldUid ? P.inv.find(it => it.uid === s.p.heldUid) || null : null; P.dead = 0;
  UID = Math.max(UID, s.uid || 1); G.hub = s.hub; G.hubIdx = s.hubIdx; CHATLOG.length = 0; CHATLOG.push(...(s.chat || [])); CONVLOG.length = 0; CONVLOG.push(...(s.conv || [])); G.lastTitle = s.lastTitle;
  for (const k in s.seen) { const d = MAPS[k]; if (!d) continue; const rows = d.grid.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n'); SEEN[k] = unrle(s.seen[k], Math.max(...rows.map(r => r.length)) * rows.length); }
  G.msg = []; IL.q.length = 0; IL.cur = null; UIDRAW.length = 0; G.ui = 0; G.cut = 0; G.cutBars = 0; CV.active = 0; G.camFocus = null; G.deathShown = 0;
  delete MAPSTATE[s.map + '__none'];
  const ms = MAPSTATE[s.map]; const M = buildMap(s.map); restoreMap(M, ms); P.map = M; G.mapId = s.map; buildLUT(M.d.shadow || '#000010', M.d.mem || '#0c1630'); if (M.d.music && OPT.music) music(M.d.music); M.visDirty = 1;
  G.hubName = M.d.title; scene = gameScene; post.fade = 0;
  if (M.d.enter) run(() => M.d.enter(M, false, true));
}
function saveTo(slot, label) { try { store('dx_save_' + slot, serialize(label)); return true; } catch (e) { console.error(e); msg('SAVE FAILED'); return false; } }
function quickSave() { if (G.ui || G.cut || G.noSave) { msg("Can't save right now."); return; } if (saveTo('q', 'QUICKSAVE')) { msg('QUICKSAVED'); sfx('save'); } }
function quickLoad() { const s = fetchStore('dx_save_q'); if (!s) { msg('No quicksave.'); return; } deserialize(s); msg('QUICKLOADED'); }
async function saveUI(saving) {
  let r = null; const slots = []; for (let k = 1; k <= 8; k++) slots.push(fetchStore('dx_save_' + k)); const q = fetchStore('dx_save_q'), a = fetchStore('dx_save_auto');
  await modal(() => { box(96, 20, 320, 216, saving ? 'SAVE GAME' : 'LOAD GAME');
    const rows = saving ? slots.map((s, k) => [k + 1, s]) : [['q', q], ['auto', a]].concat(slots.map((s, k) => [k + 1, s]));
    rows.forEach(([k, s], i) => { const y = 36 + i * 17; if (btn(106, y, 300, (typeof k === 'number' ? 'SLOT ' + k : k.toUpperCase()) + ': ' + (s ? (s.label || '').slice(0, 24) + '  ' + s.date.slice(5) : '- EMPTY -'), { dis: !saving && !s })) r = k; });
    if (btn(340, 220, 66, 'CANCEL', { key: 'Escape' })) r = 'x'; }, () => r !== null ? r : MOUSE.rclick ? 'x' : undefined);
  if (r === 'x' || r === null) return false;
  if (saving) { if (G.noSave) { msg("Can't save right now."); return false; } saveTo(r); msg('GAME SAVED'); sfx('save'); return true; }
  const s = fetchStore('dx_save_' + r); if (s) { deserialize(s); msg('GAME LOADED'); return true; } return false;
}
function autoSave() { if (P && P.map && !P.dead) saveTo('auto', 'AUTOSAVE: ' + (G.hubName || '')); }

// ---------- title ----------
function toTitle() { P = null; UIDRAW.length = 0; G.ui = 0; G.cut = 0; CV.active = 0; IL.q.length = 0; IL.cur = null; post.fade = 0; scene = titleScene; titleScene.t = 0; music('title'); }
const titleScene = {
  t: 0, sel: 0,
  update() { this.t++; },
  draw() {
    cls(hex('#02030a')); const t = this.t;
    const rem = typeof OPT !== 'undefined' && OPT.visuals;
    // Starfield over the Nevada night
    for (let i = 0; i < 120; i++) {
      const x = (hash(i, 1) * W + t * (.04 + hash(i, 2) * .08)) % W, y = hash(i, 3) * 118;
      const twk = rem && ((t + i * 7) % 60 < 8);
      pset(x, y, twk || hash(i, 4) > .88 ? WHITE : hash(i, 4) > .5 ? hex('#7a8ec0') : hex('#424e78'));
    }
    // Dusk-to-night horizon gradient
    gradV(0, 110, W, 46, hex('#06081c'), hex('#38142e'), 12);
    if (rem && (t % 340 < 3)) { rectF(0, 110, W, 46, hex('#242850')); }
    // Distant desert mesa silhouettes
    for (let x = 0; x < W; x += 2) {
      const h = 7 + Math.floor(Math.abs(Math.sin(x * .022)) * 9 + Math.cos(x * .055) * 4);
      rectF(x, 154 - h, 2, h, hex('#120818'));
    }
    // Liberty Mall Island skyline & Statue silhouette (positioned at x=60..270 so it's in full view, not hidden behind menu buttons!)
    rectF(86, 134, 156, 20, hex('#180c1e'));
    rectF(86, 134, 156, 1, hex('#ff50a0'));
    rectF(112, 128, 74, 6, hex('#22102a')); rectF(112, 128, 74, 1, hex('#40e0ff'));
    for (let x = 92; x < 236; x += 6) {
      rectF(x, 138, 3, 2, (x % 12 === 0) ? hex('#ff70b8') : hex('#60e8ff'));
      rectF(x, 143, 3, 4, hex('#ffd870'));
    }
    // Mini Statue of Liberty silhouette & glowing torch on the island
    rectF(64, 142, 12, 12, hex('#241828'));
    polyF([[66, 142], [74, 142], [72, 128], [68, 128]], hex('#2e584e'));
    rectF(72, 122, 2, 7, hex('#2e584e'));
    pset(73, 120, hex('#ffe060')); pset(73, 121, WHITE);
    if (rem) glow(73, 121, 9, hex('#ffaa30'), 0.45);
    // Lake Mead dark water & animated neon reflections (y=154..174)
    gradV(0, 154, W, 20, hex('#0a1428'), hex('#080814'), 6);
    for (let y = 155; y < 173; y += 2) {
      const drift = Math.sin(t * .08 + y * .7) * 3;
      for (let x = 88; x < 240; x += 8) {
        const col = (x % 16 === 0) ? hex('#ff50a0') : (x % 24 === 0) ? hex('#40e0ff') : hex('#ffd060');
        rectF(x + drift, y, 4 - ((y - 155) >> 3), 1, shadeOf(col, 0.55));
      }
      rectF(71 + drift * .5, y, 3, 1, hex('#d89830'));
    }
    // Subterranean Nevada strata & Deep Undercroft Vault below (y=174..256)
    rectF(0, 174, W, 82, hex('#120810'));
    rectF(0, 174, W, 2, hex('#2a1422'));
    for (let y = 182; y < 252; y += 10) for (let x = (y / 10 | 0) % 2 * 18; x < W; x += 36) rectF(x, y, 18, 1, hex('#22101a'));
    // Elevator shaft & subterranean pyramid vault directly below the Mall
    rectF(162, 154, 4, 40, hex('#1e1424')); pset(163, 160 + ((t >> 2) % 30), hex('#ff4040'));
    for (let k = 0; k < 6; k++) {
      const y = 194 + k * 8, w2 = 120 - k * 14, x0 = 164 - (w2 >> 1);
      rectF(x0, y, w2, 2, hex('#24182c'));
      if (rem && k === 2) { rectF(x0 + 8, y, w2 - 16, 1, hex('#306858')); }
    }
    if ((t >> 4) & 1) {
      pset(164, 230, hex('#50ff90')); pset(163, 230, hex('#209050'));
      if (rem) glow(164, 230, 10, hex('#30ff80'), 0.35);
    }
    // The A.S.S. saucer cruising silently across the night sky
    { const ax = (t * .6) % (W + 120) - 100, ay = 68 + Math.sin(t / 40) * 6; if (SPRITES.ass) blit(SPRITES.ass, ax, ay); }
    // Beveled Title Logo
    const lx = 46; text('PRETEND SOFT PRESENTS', lx, 20, hex('#9a8ab4'), INK);
    for (const [s, y, c, hi, sc] of [['DEUS EX', 32, '#d8d0f8', '#ffffff', 3], ['NEVADA', 60, '#ff68b0', '#ffc0e0', 3]]) bigText(s, lx, y, hex(c), sc, rem ? hex(hi) : 0);
    text('CARL DENTON', lx + 2, 90, hex('#60e8b8'), INK);
    if (rem) {
      rectF(lx + 2, 101, 116, 9, hex('#0e1c2a')); frameR(lx + 2, 101, 116, 9, hex('#40e0b0'));
      text('REMASTERED EDITION', lx + 5, 102, hex('#40e0b0'), 0);
    } else {
      text('A LOST X68030 RELEASE  1994', lx + 2, 102, hex('#4a5a7a'), 0);
    }
    const items = ['NEW GAME', 'CONTINUE', 'LOAD GAME', 'OPTIONS', 'MANUAL', 'CREDITS'];
    const hasSave = fetchStore('dx_save_auto') || fetchStore('dx_save_q') || [1, 2, 3, 4, 5, 6, 7, 8].some(k => fetchStore('dx_save_' + k));
    items.forEach((s, i) => { const dis = (i === 1 || i === 2) && !hasSave; if (btn(330, 120 + i * 16, 140, s, { sel: this.sel === i, dis })) this.go(i); });
    if (tap('ArrowDown')) this.sel = (this.sel + 1) % items.length; if (tap('ArrowUp')) this.sel = (this.sel + items.length - 1) % items.length; if (tapAny('Enter', 'Space') && !((this.sel === 1 || this.sel === 2) && !hasSave)) this.go(this.sel);
    text('(C)1994 PRETEND SOFT / PRETEND CO.  ALL RIGHTS PRETEND', 4, 246, hex('#4a4a6a'), 0);
    drawModals();
  },
  go(i) { if (G.ui) return; sfx('ok');
    if (i === 0) run(newGameFlow); else if (i === 1) { const best = ['auto', 'q', 1, 2, 3, 4, 5, 6, 7, 8].map(k => fetchStore('dx_save_' + k)).filter(Boolean).sort((a, b) => a.date < b.date ? 1 : -1)[0]; if (best) deserialize(best); }
    else if (i === 2) run(async () => { P = P || newPlayer(); await saveUI(false); }); else if (i === 3) run(optionsUI); else if (i === 4) run(manualUI); else run(creditsUI); },
};
function bigText(s, x, y, c, sc, hi = 0) {
  let xx = x;
  const sh = shadeOf(c, 0.55);
  for (const ch of s) {
    const g = FONT[ch];
    if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) {
      const px = xx + i * sc * 2, py = y + j * sc, pw = sc * 2 - 1;
      rectF(px + 1, py + sc, pw, 1, INK);
      rectF(px + pw, py + 1, 1, sc, INK);
      rectF(px, py, pw, sc, j < 2 ? (hi || c) : j > 4 ? sh : c);
      if (hi && j === 0) rectF(px, py, pw, 1, hi);
    }
    xx += 6 * sc * 2;
  }
}

// ---------- boot (the X68030 coming up) ----------
const BIOS = ['X68030 ROM IPL Version 1.3', '(C) 1993 SHARP / Hudson', '', 'Memory check 4096KB OK', 'SCSI ID 0 HD', 'FDD 0: PRETEND SOFT DXNEVADA DISK A', '', 'Human68k version 3.02', 'A>DXNEVADA.X', '', 'DEUS EX NEVADA  VER 1.00', 'FM SOUND OPM YM2151 .. OK', 'ADPCM MSM6258 .. OK', 'CHAT DEVICE .. OK', '', 'there is no chat device', ''];
const bootScene = { t: 0, update() { this.t++; if (this.t > 30 && (tapAny('Enter', 'Space', 'Escape') || MOUSE.click)) this.t = 9999; if (this.t > BIOS.length * 12 + 80) { scene = titleScene; music('title'); } },
  draw() { cls(); const n = Math.min(BIOS.length, (this.t / 12) | 0); for (let i = 0; i < n; i++) text(BIOS[i], 8, 8 + i * 10, i === 13 ? hex('#ff4040') : hex('#c8c8c8'), 0); if ((this.t >> 4) & 1) rectF(8, 8 + n * 10, 6, 8, hex('#c8c8c8')); } };

// ---------- new game ----------
async function newGameFlow() {
  P = newPlayer(); F = {}; resetRel(); for (const k in MAPSTATE) delete MAPSTATE[k]; for (const k in SEEN) delete SEEN[k]; CHATLOG.length = 0; CONVLOG.length = 0; for (const k in KEYNAMES) delete KEYNAMES[k];
  G.hub = ''; G.hubIdx = 0; G.lastTitle = '';
  // the FATCO personnel form
  let step = 0, done = false; P.sp = 5000; const startSkills = { pistol: 1, lowtech: 0 };
  P.skills = Object.assign({}, startSkills);
  await modal(() => {
    rectF(0, 0, W, H, hex('#0a0e18')); box(8, 6, 496, 244, 'FATCO PERSONNEL FILE - NEW AGENT');
    text('AGENT:', 20, 24, UIC.dim, 0); text('DENTON, CARL', 70, 24, WHITE, 0); text('REAL NAME:', 200, 24, UIC.dim, 0); text('[CLASSIFIED]', 266, 24, UIC.red, 0);
    text('SPECIES:', 20, 34, UIC.dim, 0); text('HUMAN', 70, 34, UIC.grn, 0); text('(STAMPED, LAMINATED)', 104, 34, UIC.dim, 0);
    text('ORIGIN:', 20, 44, UIC.dim, 0); text('NEVADA (ABOVE AND BELOW)', 70, 44, WHITE, 0);
    text('DIFFICULTY:', 300, 34, UIC.dim, 0); if (btn(370, 32, 70, ['EASY', 'NORMAL', 'HARD'][OPT.diff])) { OPT.diff = (OPT.diff + 1) % 3; saveOpt(); }
    text('SKILL POINTS: ' + P.sp, 20, 58, UIC.hi, 0);
    Object.keys(SKILLS).forEach((id, i) => { const y = 70 + i * 13, l = sk(id), s = SKILLS[id], base = startSkills[id] || 0; text(s.name, 24, y + 2, WHITE, 0); for (let k = 0; k < 3; k++) rectF(170 + k * 12, y + 3, 10, 5, k < l ? UIC.hi : hex('#2a3448')); text(SKILL_LV[l], 210, y + 2, UIC.dim, 0);
      if (btn(270, y, 14, '+', { dis: l >= 3 || P.sp < s.cost[l] })) buySkill(id); if (btn(288, y, 14, '-', { dis: l <= base })) { P.skills[id] = l - 1; P.sp += s.cost[l - 1]; }
      if (inRect(20, y, 260, 12)) wrapText(s.desc, 312, 70, 30, UIC.txt, 9, 10); });
    wrapText('FATCO notes: Agent Denton tested well on reflexes and poorly on everything involving being told what to do. Unspent points carry over.', 312, 170, 30, UIC.dim, 9, 6);
    if (btn(400, 230, 96, 'BEGIN', { key: 'Enter' })) done = true; if (btn(300, 230, 90, 'BACK', { key: 'Escape' })) done = 'back';
  }, () => done || undefined);
  if (done === 'back') { P = null; return; }
  giveItem('idcard', 1, true); giveItem('w_pistol', 1, true); P.ammo['10mm'] = 18; giveItem('medkit', 2, true); giveItem('lockpick', 2, true); giveItem('multitool', 2, true); giveItem('w_baton', 1, true); P.cred = 50;
  P.held = P.inv.find(it => it.id === 'w_pistol');
  scene = gameScene; if (typeof startGame === 'function') await startGame(); else gotoMap(Object.keys(MAPS)[0]);
}

// ---------- manual and credits ----------
async function manualUI() {
  const pages = MANUAL; let p = 0;
  await modal(() => { box(30, 14, 452, 228, 'DEUS EX NEVADA - INSTRUCTION MANUAL  ' + (p + 1) + '/' + pages.length); const pg = pages[p]; text(pg[0], 40, 28, UIC.hi, 0); let y = 40; for (const para of pg[1].split('\n')) { y += wrapText(para, 40, y, 72, UIC.txt, 9, 30) * 9 + 3; }
    if (btn(40, 226, 60, '< PREV', { dis: p === 0, key: 'ArrowLeft' })) p--; if (btn(108, 226, 60, 'NEXT >', { dis: p === pages.length - 1, key: 'ArrowRight' })) p++; if (btn(410, 226, 64, 'CLOSE', { key: 'Escape' })) p = -1; }, () => p < 0 ? 1 : MOUSE.rclick ? 1 : undefined);
}
const MANUAL = [
  ['WELCOME, AGENT', 'You are Carl Denton, the newest agent of FATCO, the Fascism Inc. Anti-Terrorist Coalition. Your ID card says SPECIES: HUMAN. Please do not make that weird.\nNevada is dying of the Buffering. The only cure is a recalled product. Somebody is hoarding it. Somebody is stealing it back. Your job is to decide which of those people is a terrorist.\nThere is always another way in.'],
  ['CONTROLS', 'MOVE: W A S D or arrow keys.   AIM: mouse.   FIRE: left button, SPACE or J.\nUSE / TALK / OPEN / PICK UP: E, ENTER, K or right button. The thing you will use is bracketed in yellow.\nCROUCH: C or CTRL (quieter, harder to see, fits in vents).   WALK QUIETLY: hold SHIFT.\nBELT: 1-9 and 0, or the mouse wheel.   RELOAD / SWITCH AMMO: R.   PUT AWAY / DROP BODY: X.\nZOOM (scopes, binoculars): hold Z.   AUGMENTATIONS: F1-F8 (or SHIFT+1-8).\nINVENTORY: TAB or I.   GOALS: G.   MAP: M.   LOG: L.   CHAT WINDOW SIZE: H.\nQUICKSAVE: F9.   QUICKLOAD: F10.   MENU: ESC.   FULLSCREEN: F.'],
  ['LIGHT AND SHADOW', 'The eye at the top left shows how visible you are. Blue: hidden. Yellow: careful. Red: they will see you.\nDarkness, crouching and standing still all make you harder to see. Brush hides a crouching Carl almost completely. Lamps can be shot out.\nYour EYE GLOW (F1) lights the way, and lights you up.\nA ? over a guard means he is suspicious. A ! means he has found you. Guards hear running, gunfire, breaking glass and bodies hitting the floor. They find bodies you leave in the light.'],
  ['BODY AND HEALTH', 'Damage lands on your head, torso, arms or legs, shown on the little figure at the top left. Hurt arms ruin your aim. Hurt legs slow you down. If your head or torso reaches zero, you are dead.\nMedkits heal every part at once; the Medicine skill makes them stronger. Medical bots heal you completely and install augmentations.'],
  ['SKILLS', 'Skill points come from finishing goals, finding secrets, reading, and doing things the clever way. Spend them on the Skills screen.\nCOMPUTER lets you hack terminals without a login. ELECTRONICS and LOCKPICKING make your multitools and lockpicks go further. The weapon skills tighten your aim. DENIAL opens conversation choices where Carl simply insists.'],
  ['AUGMENTATIONS', 'Augmentation canisters each hold two augmentations for one part of the body. You may install only one; the other is lost. Upgrade canisters raise an augmentation up to level 4.\nActive augmentations drain bioelectric energy. Bioelectric cells, repair bots and some other things restore it.'],
  ['LOCKS AND MACHINES', 'Locked doors and containers have a strength. Put lockpicks on your belt, hold them, and use the lock. Each pick lowers the strength.\nMultitools bypass keypads, cameras, laser tripwires and turrets the same way. Keypad codes and computer logins are written down somewhere. They usually are. Read everything.\nSecurity terminals can switch off cameras, turn turrets around, and open doors.'],
  ['THE CHAT', 'The panel at the bottom right is your infolink feed. FATCO says it is encrypted. FATCO cannot explain who the other users are. They will comment on everything you do. Some of them are helpful. Press H to resize it or turn it off.\nPretend Soft is not responsible for anything the chat says.'],
  ['ONE MORE THING', 'Every problem has more than one answer. The vent is usually one of them.\nPeople remember what you did to them. So does the game.\nIf the game tells you it is 1994, believe it.'],
];
async function creditsUI() {
  const lines = ['DEUS EX NEVADA', '', 'A PRETEND SOFT PRODUCTION', '', 'DIRECTOR: [ILLEGIBLE]', 'SYSTEM DESIGN: THE COMMITTEE', 'CARL: CARL', 'LIGHTING: A VERY PATIENT MAN', 'FM SOUND: OPM TEAM', 'CHAT: (NO CREDIT REQUESTED)', '', 'SPECIAL THANKS', 'THE TOWN OF ST. THOMAS, NEVADA', 'EVERYONE STILL IN TRANSIT', '', 'NO AUGMENTATIONS WERE HARMED', 'SOME WERE INSTALLED'];
  let t = 0; await modal(() => { rectF(0, 0, W, H, BLACK); lines.forEach((l, i) => { const y = 260 - t * .5 + i * 14; if (y > -10 && y < H) ctext(l, y, i === 0 ? UIC.hi : WHITE, 0); }); }, () => { t++; if (t > 900 || backTap() || MOUSE.click || tap('Enter')) return 1; });
}

// ---------- disk swap card ----------
async function diskSwap(n, label) {
  G.noSave = 1; await fadeOut(.05); scene = { update() {}, draw() { cls(hex('#06060c')); } }; post.fade = 0; sfx('disk');
  await showCard(['PLEASE INSERT DISK ' + n, '', label || '', '', '(PRESS ANY KEY)'], 0, { col: hex('#ffd24a') });
  G.noSave = 0; scene = gameScene;
}
function boot() {
  fit(); buildArt(); loadPortraits(); scene = bootScene; requestAnimationFrame(loop);
}
let ARTBUILT = 0;
// painted portraits (dx/dximg.js, made by tools/dxgen.js + dxpack.py) replace the procedural ones as they decode
function loadPortraits() {
  if (typeof PORTIMG === 'undefined' || typeof Image === 'undefined' || !document.createElement) return;
  for (const k in PORTIMG) { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, im.width, im.height).data, b = newBuf(im.width, im.height); for (let i = 0; i < b.d.length; i++) b.d[i] = d[i * 4 + 3] < 128 ? 0 : rgb(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]); b.painted = 1; PORT[k] = b; }; im.src = PORTIMG[k]; }
}
function buildArt() { if (ARTBUILT) return; ARTBUILT = 1; buildMachines(); buildProps(); buildIcons(); if (typeof buildPeople === 'function') buildPeople(); if (typeof buildPortraits === 'function') buildPortraits(); }
