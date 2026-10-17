'use strict';
// ================= VISITOR: THE NORMALCY: boot, title, intake, travel, saves, the game scene =================
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
    if (P.freak) { const k = .55 + Math.sin(G.t * 12) * .1; for (let y = 0; y < H; y += 2) { const e = Math.abs(y - H / 2) / (H / 2); const w = Math.round(W * .5 * Math.max(0, 1 - (1 - e * e) * 1.4) + 40); rectA(0, y, w, 2, hex('#400008'), k); rectA(W - w, y, w, 2, hex('#400008'), k); } }
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
  await modal(() => { rectA(0, 0, W, H, hex('#200000'), .6); box(156, 70, 200, 110, 'YOU ARE DEAD'); ctext('CARL', 92, UIC.red, 0); ctext('STREAM OFFLINE', 104, UIC.dim, 0); if (btn(176, 122, 160, 'LOAD QUICKSAVE', { dis: !fetchStore('vn_save_q'), key: 'F10' })) r = 'q'; if (btn(176, 138, 160, 'LOAD GAME')) r = 'l'; if (btn(176, 154, 160, 'QUIT TO TITLE')) r = 't'; }, () => r || undefined);
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
function saveTo(slot, label) { try { store('vn_save_' + slot, serialize(label)); return true; } catch (e) { console.error(e); msg('SAVE FAILED'); return false; } }
function quickSave() { if (G.ui || G.cut || G.noSave) { msg("Can't save right now."); return; } if (saveTo('q', 'QUICKSAVE')) { msg('QUICKSAVED'); sfx('save'); } }
function quickLoad() { const s = fetchStore('vn_save_q'); if (!s) { msg('No quicksave.'); return; } deserialize(s); msg('QUICKLOADED'); }
async function saveUI(saving) {
  let r = null; const slots = []; for (let k = 1; k <= 8; k++) slots.push(fetchStore('vn_save_' + k)); const q = fetchStore('vn_save_q'), a = fetchStore('vn_save_auto');
  await modal(() => { box(96, 20, 320, 216, saving ? 'SAVE GAME' : 'LOAD GAME');
    const rows = saving ? slots.map((s, k) => [k + 1, s]) : [['q', q], ['auto', a]].concat(slots.map((s, k) => [k + 1, s]));
    rows.forEach(([k, s], i) => { const y = 36 + i * 17; if (btn(106, y, 300, (typeof k === 'number' ? 'SLOT ' + k : k.toUpperCase()) + ': ' + (s ? (s.label || '').slice(0, 24) + '  ' + s.date.slice(5) : '- EMPTY -'), { dis: !saving && !s })) r = k; });
    if (btn(340, 220, 66, 'CANCEL', { key: 'Escape' })) r = 'x'; }, () => r !== null ? r : MOUSE.rclick ? 'x' : undefined);
  if (r === 'x' || r === null) return false;
  if (saving) { if (G.noSave) { msg("Can't save right now."); return false; } saveTo(r); msg('GAME SAVED'); sfx('save'); return true; }
  const s = fetchStore('vn_save_' + r); if (s) { deserialize(s); msg('GAME LOADED'); return true; } return false;
}
function autoSave() { if (P && P.map && !P.dead) saveTo('auto', 'AUTOSAVE: ' + (G.hubName || '')); }

// ---------- title ----------
function toTitle() { P = null; UIDRAW.length = 0; G.ui = 0; G.cut = 0; CV.active = 0; IL.q.length = 0; IL.cur = null; post.fade = 0; scene = titleScene; titleScene.t = 0; music('vntitle'); }
const titleScene = {
  t: 0, sel: 0,
  update() { this.t++; },
  draw() {
    cls(hex('#06020c')); const t = this.t;
    // Los Angeles at night: stars you can't see, a skyline, the Hollywood hills, a searchlight, something in the sky that isn't a plane
    gradV(0, 0, W, 150, hex('#06020c'), hex('#3a0a2a'), 8);
    for (let i = 0; i < 40; i++) pset(hash(i, 1) * W, hash(i, 3) * 90, hex('#3a3a5a'));
    for (let k = 0; k < 2; k++) { const a = -1.9 + Math.sin(t / 90 + k * 2) * .5; for (let r = 0; r < 160; r += 2) pset(140 + k * 220 + Math.cos(a) * r, 150 + Math.sin(a) * r, hex('#2a2040')); }
    for (let x = 0; x < W; x += 2) { const h = 10 + Math.abs(Math.sin(x * .012)) * 22; rectF(x, 150 - h, 2, h, hex('#12060e')); } // hills
    for (let i = 0; i < 26; i++) { const bx = 20 + i * 19, bh = 20 + hash(i, 9) * 70 + (i === 13 ? 40 : 0), bw = 14 + (hash(i, 8) * 8 | 0); rectF(bx, 160 - bh, bw, bh, hex('#0a0410')); for (let y = 160 - bh + 4; y < 158; y += 5) for (let x = bx + 2; x < bx + bw - 2; x += 4) if (hash(x, y) > .62) pset(x, y, hash(x, y, 2) > .5 ? hex('#ffb050') : hex('#ff70b0')); }
    rectF(0, 160, W, 96, hex('#08030a')); for (let x = 0; x < W; x += 24) rectF(x + (t % 24), 196, 12, 1, hex('#ffb040'));
    { const ux = 380 + Math.sin(t / 50) * 30, uy = 36 + Math.sin(t / 23) * 4; ellF(ux, uy, 9, 2.5, hex('#c0c8d0')); ellF(ux, uy - 2, 4, 2, hex('#60ff90')); if ((t >> 3) & 1) for (let k = -6; k <= 6; k += 4) pset(ux + k, uy + 1, hex('#ffd060')); }
    // logo
    const lx = 40; text('PRETEND SOFT PRESENTS', lx, 20, hex('#a07ab0'), 0);
    bigText('VISITOR', lx, 32, hex('#ffe0f0'), 3); text('THE NORMALCY', lx + 2, 58, hex('#ff70b0'), INK); bigText('FEEDLINES', lx, 70, hex('#c03060'), 2);
    text('A LOST X68030 RELEASE  1995', lx + 2, 92, hex('#6a4a7a'), 0);
    const items = ['NEW GAME', 'CONTINUE', 'LOAD GAME', 'OPTIONS', 'MANUAL', 'CREDITS'];
    const hasSave = fetchStore('vn_save_auto') || fetchStore('vn_save_q') || [1, 2, 3, 4, 5, 6, 7, 8].some(k => fetchStore('vn_save_' + k));
    items.forEach((s, i) => { const dis = (i === 1 || i === 2) && !hasSave; if (btn(340, 116 + i * 16, 140, s, { sel: this.sel === i, dis })) this.go(i); });
    if (tap('ArrowDown')) this.sel = (this.sel + 1) % items.length; if (tap('ArrowUp')) this.sel = (this.sel + items.length - 1) % items.length; if (tapAny('Enter', 'Space') && !((this.sel === 1 || this.sel === 2) && !hasSave)) this.go(this.sel);
    text('(C)1995 PRETEND SOFT / PRETEND CO.  BE NORMAL.', 4, 246, hex('#4a2a4a'), 0);
    drawModals();
  },
  go(i) { if (G.ui) return; sfx('ok');
    if (i === 0) run(newGameFlow); else if (i === 1) { const best = ['auto', 'q', 1, 2, 3, 4, 5, 6, 7, 8].map(k => fetchStore('vn_save_' + k)).filter(Boolean).sort((a, b) => a.date < b.date ? 1 : -1)[0]; if (best) deserialize(best); }
    else if (i === 2) run(async () => { P = P || newPlayer(); await saveUI(false); }); else if (i === 3) run(optionsUI); else if (i === 4) run(manualUI); else run(creditsUI); },
};
function bigText(s, x, y, c, sc) { let xx = x; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) { rectF(xx + i * sc * 2, y + j * sc, sc * 2 - 1, sc, c); rectF(xx + i * sc * 2 + 1, y + j * sc + sc, sc * 2 - 1, 1, INK); } xx += 6 * sc * 2; } }

// ---------- boot (the X68030 coming up) ----------
const BIOS = ['X68030 ROM IPL Version 1.3', '(C) 1993 SHARP / Hudson', '', 'Memory check 4096KB OK', 'SCSI ID 0 HD', 'FDD 0: PRETEND SOFT VISITOR DISK A', '', 'Human68k version 3.02', 'A>VISITOR.X', '', 'VISITOR: THE NORMALCY  VER 1.00', 'FM SOUND OPM YM2151 .. OK', 'ADPCM MSM6258 .. OK', 'CHAT DEVICE .. OK', '', 'species check .. PROVISIONAL', ''];
const bootScene = { t: 0, update() { this.t++; if (this.t > 30 && (tapAny('Enter', 'Space', 'Escape') || MOUSE.click)) this.t = 9999; if (this.t > BIOS.length * 12 + 80) { scene = titleScene; music('vntitle'); } },
  draw() { cls(); const n = Math.min(BIOS.length, (this.t / 12) | 0); for (let i = 0; i < n; i++) text(BIOS[i], 8, 8 + i * 10, i === 13 ? hex('#ff4040') : hex('#c8c8c8'), 0); if ((this.t >> 4) & 1) rectF(8, 8 + n * 10, 6, 8, hex('#c8c8c8')); } };

// ---------- new game ----------
// the Consulate intake: a questionnaire that guesses a species (Bloodlines' clan quiz), then the choice, then skills
const INTAKE = [
  ['A stranger at a party asks what you do for a living. You:', [['Tell them about your company. You own it.', 'reptilian'], ['Let them guess. They always guess "model."', 'nordic'], ['Write their answer down on a clipboard.', 'grey'], ['Ask why they want to know. Loudly.', 'martian']]],
  ['Someone takes a photo of you. You:', [['Blur. Out of focus. Gone.', 'cryptid'], ['Hear the photo before it is taken.', 'broadcast'], ['Wait by their bed until they delete it.', 'pod'], ['Strike a pose. It is a good photo.', 'nordic']]],
  ['The Normalcy says BE NORMAL. You think:', [['Normal is a product. I sell it.', 'reptilian'], ['Normal is a lie told by people who landed first.', 'martian'], ['Normal is a frequency. I am between stations.', 'broadcast'], ['Normal is a sample size problem.', 'grey']]],
  ['Where do you sleep?', [['A penthouse.', 'reptilian'], ['A storm drain. It is nicer than it sounds.', 'cryptid'], ['In the desert, under a tarp, near a pod.', 'pod'], ['I don\'t. I listen.', 'broadcast']]],
  ['Your ship crashed. You:', [['Filed an insurance claim.', 'grey'], ['Started a fight with the ground.', 'martian'], ['Left it where it was and walked into the dark.', 'pod'], ['Became a local legend.', 'cryptid']]],
  ['Last one. Are you a normal human?', [['YES.', 'any'], ['Yes! Obviously! Look at me!', 'any'], ['Define "normal." Define "human." Define "are."', 'broadcast'], ['I\'m a normal human and I have the papers to prove it.', 'any']]],
];
async function newGameFlow() {
  P = newPlayer(); F = {}; resetRel(); for (const k in MAPSTATE) delete MAPSTATE[k]; for (const k in SEEN) delete SEEN[k]; CHATLOG.length = 0; CONVLOG.length = 0; for (const k in KEYNAMES) delete KEYNAMES[k];
  G.hub = ''; G.hubIdx = 0; G.lastTitle = '';
  // 1. the questionnaire
  const score = {}; for (const k in SPECIES) score[k] = 0; let q = 0, back = false;
  await modal(() => {
    rectF(0, 0, W, H, hex('#0c0a14')); box(20, 10, 472, 236, 'CONSULATE OF THE NORMALCY - VISITOR INTAKE FORM 7-B');
    text('QUESTION ' + (q + 1) + ' OF ' + INTAKE.length, 34, 28, UIC.dim, 0); wrapText(INTAKE[q][0], 34, 44, 72, WHITE, 10, 3);
    INTAKE[q][1].forEach(([s, sp], i) => { if (btn(40, 80 + i * 20, 420, (i + 1) + '. ' + s, { key: 'Digit' + (i + 1) })) { if (sp === 'any') { for (const k in score) score[k] += .25; } else score[sp] += 1; q++; } });
    text('The clerk does not look up. "Answer honestly. Or don\'t. We can tell."', 34, 180, UIC.dim, 0);
    if (btn(400, 226, 80, 'BACK', { key: 'Escape' })) back = true;
  }, () => back || q >= INTAKE.length ? 1 : undefined);
  if (back) { P = null; return; }
  const ranked = Object.keys(score).sort((a, b) => score[b] - score[a]); let pickS = ranked[0], i_s = Object.keys(SPECIES).indexOf(pickS); back = false; let done = false;
  // 2. the species
  await modal(() => {
    rectF(0, 0, W, H, hex('#0c0a14')); box(8, 6, 496, 244, 'INTAKE FORM 7-B: SPECIES DETERMINATION');
    text('The clerk squints at Carl for a long time. "Provisional. I\'m writing down ' + SPECIES[ranked[0]].name + '. Change it if you want. Nobody will confirm it either way."', 18, 22, UIC.txt, 0);
    Object.keys(SPECIES).forEach((k, i) => { const S = SPECIES[k]; if (btn(18, 40 + i * 16, 140, S.plural + (k === ranked[0] ? ' *' : ''), { sel: i_s === i })) i_s = i; });
    const k = Object.keys(SPECIES)[i_s], S = SPECIES[k]; pickS = k; box(170, 40, 326, 182, S.plural, { tc: hex(S.col) });
    let y = 54 + wrapText(S.desc, 176, 54, 52, UIC.txt, 9, 7) * 9 + 4; text('FEEDS ON: ' + S.feed, 176, y, hex(S.col), 0); y += 10; y += wrapText(S.feedVerb, 176, y, 52, UIC.dim, 9, 2) * 9 + 4;
    text('GIFTS:', 176, y, UIC.hi, 0); y += 10; for (const g of S.gifts) { text('- ' + AUGS[g].name + (AUGS[g].visible ? ' (visible)' : ''), 180, y, WHITE, 0); y += 9; }
    if (tap('ArrowDown')) i_s = (i_s + 1) % 7; if (tap('ArrowUp')) i_s = (i_s + 6) % 7;
    if (btn(400, 230, 96, 'STAMP IT', { key: 'Enter' })) done = true; if (btn(300, 230, 90, 'BACK', { key: 'Escape' })) back = true;
  }, () => done || back ? 1 : undefined);
  if (back) { P = null; return; }
  P.species = pickS; const g = SPECIES[pickS].gifts; P.augs[g[0]] = 1; P.augs[g[1]] = 1;
  // 3. skills
  done = false; P.sp = 4000; const startSkills = { pistol: 1, denial: 1 }; P.skills = Object.assign({}, startSkills);
  await modal(() => {
    rectF(0, 0, W, H, hex('#0c0a14')); box(8, 6, 496, 244, 'INTAKE FORM 7-B: APTITUDES');
    text('NAME:', 20, 22, UIC.dim, 0); text('CARL', 70, 22, WHITE, 0); text('(SAYS IT ISN\'T)', 100, 22, UIC.dim, 0); text('SPECIES:', 200, 22, UIC.dim, 0); text('PROVISIONAL (' + SPECIES[pickS].name + ')', 254, 22, hex(SPECIES[pickS].col), 0);
    text('DIFFICULTY:', 20, 34, UIC.dim, 0); if (btn(90, 32, 70, ['EASY', 'NORMAL', 'HARD'][OPT.diff])) { OPT.diff = (OPT.diff + 1) % 3; saveOpt(); } text('XP: ' + P.sp, 200, 34, UIC.hi, 0);
    Object.keys(SKILLS).forEach((id, i) => { const y = 48 + i * 14, l = sk(id), s = SKILLS[id], base = startSkills[id] || 0; text(s.name, 24, y + 2, WHITE, 0); for (let k = 0; k < 3; k++) rectF(170 + k * 12, y + 3, 10, 5, k < l ? UIC.hi : hex('#2a3448')); text(l < 3 ? String(s.cost[l]) : '', 212, y + 2, UIC.dim, 0);
      if (btn(250, y, 14, '+', { dis: l >= 3 || P.sp < s.cost[l] })) buySkill(id); if (btn(268, y, 14, '-', { dis: l <= base })) { P.skills[id] = l - 1; P.sp += s.cost[l - 1]; }
      if (inRect(20, y, 260, 13)) wrapText(s.desc, 300, 60, 32, UIC.txt, 9, 10); });
    wrapText('Unspent XP carries over. Gifts are raised with XP on the GIFTS screen. In this city, XP comes from finishing what you start.', 300, 170, 32, UIC.dim, 9, 6);
    if (btn(400, 230, 96, 'BEGIN', { key: 'Enter' })) done = true; if (btn(300, 230, 90, 'BACK', { key: 'Escape' })) done = 'back';
  }, () => done || undefined);
  if (done === 'back') { P = null; return; }
  giveItem('idcard', 1, true); giveItem('medkit', 1, true); giveItem('biocell', 2, true); P.cred = 40;
  scene = gameScene; if (typeof startGame === 'function') await startGame(); else gotoMap(Object.keys(MAPS)[0]);
}

// ---------- manual and credits ----------
async function manualUI() {
  const pages = MANUAL; let p = 0;
  await modal(() => { box(30, 14, 452, 228, 'VISITOR: THE NORMALCY - INSTRUCTION MANUAL  ' + (p + 1) + '/' + pages.length); const pg = pages[p]; text(pg[0], 40, 28, UIC.hi, 0); let y = 40; for (const para of pg[1].split('\n')) { y += wrapText(para, 40, y, 72, UIC.txt, 9, 30) * 9 + 3; }
    if (btn(40, 226, 60, '< PREV', { dis: p === 0, key: 'ArrowLeft' })) p--; if (btn(108, 226, 60, 'NEXT >', { dis: p === pages.length - 1, key: 'ArrowRight' })) p++; if (btn(410, 226, 64, 'CLOSE', { key: 'Escape' })) p = -1; }, () => p < 0 ? 1 : MOUSE.rclick ? 1 : undefined);
}
const MANUAL = [
  ['WELCOME, VISITOR', 'You are Carl. You are, you will insist, a normal human. Los Angeles is full of people who are not, and who are better at hiding it than you.\nThey call the rule that keeps them hidden THE NORMALCY. Its first rule is BE NORMAL. You were arrested for streaming your face to forty people a night. You were released because nobody believes anything on a stream.\nNow the Consulate owns you.'],
  ['CONTROLS', 'MOVE: W A S D or arrows.   AIM: mouse.   FIRE / ATTACK: left button, SPACE or J.\nUSE / TALK / OPEN: E, ENTER, K or right button.   FEED: hold F.   MEND: hold Q.\nCROUCH: C or CTRL.   WALK QUIETLY: hold SHIFT.   GIFTS: F1-F4 (or SHIFT+1-4).\nBELT: 1-9, 0, mouse wheel.   RELOAD: R.   PUT AWAY / DROP BODY: X.   ZOOM: hold Z.\nINVENTORY: TAB / I.   GOALS: G.   MAP: M.   LOG: L.   CHAT SIZE: H.\nQUICKSAVE F9.   QUICKLOAD F10.   MENU ESC.   FULLSCREEN F11.'],
  ['VITALITY AND FEEDING', 'Visitors run on VITALITY, the red bar at the top left. Gifts burn it. MEND turns it into health.\nYou get it from humans. Hold F next to someone who is not on guard, or asleep, or knocked out, or who likes you enough. Each species feeds differently. Let go when the bar is full. If you hold on, they die, and you lose HUMANITY.\nVitality bags from the free clinic work too, and nobody has to watch.'],
  ['THE NORMALCY', 'The five pips under the bar are NORMALCY BREACHES. Feeding where a human can see you, or using a visible gift in front of one, is a breach. At five, the Men in White Suits come for you.\nDark rooms, closed doors and crouching help. So does MISSING TIME, if you are a Grey. Some favors make breaches go away.'],
  ['HUMANITY', 'HUM is how much of the normal human you still are. Killing people who did nothing to you, draining people dry and cruel choices lower it. Low humanity means more FREAKOUTS.\nA FREAKOUT happens when you are starving or terrified: Carl goes for the nearest human and you cannot stop him until he has fed. At zero humanity there is no Carl left. Feed before it gets bad.'],
  ['SPECIES AND GIFTS', 'The clerk guessed your species. You picked it. Nobody confirms it.\nEach species has three GIFTS. Raise them with XP on the GIFTS screen, then use them with F1-F3. Some are toggles that drain vitality while they run; some cost vitality once. Gifts marked VISIBLE are breaches if a human sees them.\nREPTILIANS command. NORDICS dazzle. GREYS probe and erase. MARTIANS smash. CRYPTIDS hide and haunt. THE BROADCAST confuses. POD PEOPLE grow things.'],
  ['TALKING', 'Conversation choices marked [DENIAL], [RANT] or [CHARM] need that skill. Choices marked with a gift need the gift. Your species changes what some people say to you.\nIf you are of THE BROADCAST, you may hear things nobody said. Some of them are true.'],
  ['LOCKS, MACHINES, STEALTH', 'Everything you would expect still works: lockpicks, multitools, keypads, computers, cameras, vents, carrying bodies, light and shadow. The eye at the top left shows how visible you are.'],
  ['THE CHAT', 'Your chat is still on. The Consulate ruled it the safest place in the world for an alien to show his face. They are watching everything. Some of them think it is a VTuber. Let them.'],
];

async function creditsUI() {
  const lines = ['VISITOR: THE NORMALCY', 'FEEDLINES', '', 'A PRETEND SOFT PRODUCTION', '', 'DIRECTOR: [ILLEGIBLE]', 'NIGHT DESIGN: THE COMMITTEE', 'CARL: CARL (HUMAN)', 'LOS ANGELES: ITSELF', 'FM SOUND: OPM TEAM', 'DEEP NIGHT WITH DEB: DEB', 'CHAT: (NO CREDIT REQUESTED)', '', 'SPECIAL THANKS', 'EVERYONE WHO LOOKED UP', 'THE CREW OF THE LADY NEVADA', 'EVERYONE STILL IN TRANSIT', '', 'NO VISITORS WERE HARMED', 'SOME WERE EXPOSED'];
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
