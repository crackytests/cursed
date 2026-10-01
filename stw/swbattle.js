'use strict';
// ================= SAVE THE WORLD: battle — active time, side view, every hero's own command =================
let B = null;
const PARTYX = [244, 250, 256, 262], PARTYY = [30, 54, 78, 102], BWIN = 150;
const BCOL = { dmg: WHITE, heal: hex('#6dff92'), mp: hex('#6dd8ff'), miss: hex('#dbdbdb'), st: hex('#ffb6ff') };

function mkHeroUnit(r, i) {
  const st = stats(r);
  const u = { side: 'p', r, id: r.id, name: HEROES[r.id].name, lv: r.lv, hp: r.hp, mhp: r.mhp, mp: r.mp, mmp: r.mmp, st, str: st.str, mag: st.mag, spd: st.spd, def: st.def, mdef: st.mdef,
    status: {}, atb: 200 + rnd(500), i, x: PARTYX[i] + (r.row === 'back' ? 14 : 0), y: PARTYY[i], pose: 'ready', poseT: 0, dx: 0, row: r.row, aspect: r.aspect || 'kid', last: null, summoned: 0 };
  if (r.status.lag) u.status.lag = Infinity;
  if (st.flags.auto) u.status[st.flags.auto] = 1800;
  if (st.flags.reraise) u.reraise = 1;
  return u;
}
function mkFoeUnit(id, x, y) {
  const d = FOES[id], s = FOEART.get(d.look);
  return { side: 'e', id, d, name: d.name, lv: d.lv, hp: d.hp, mhp: d.hp, mp: d.mp || 0, mmp: d.mp || 0, P: d.atk, mag: d.mag || d.lv + 4, spd: d.spd || 10, def: d.def || 0, mdef: d.mdef || 0,
    status: {}, atb: rnd(700), x, y, spr: s, pal: G.world === 2 && !d.color ? legacyPal(s.P, 'dmg') : s.P, w: s.w, h: s.h, alpha: 1, flash: 0, steal: d.steal, drop: d.drop, v: {}, shake: 0 };
}
const alive = arr => arr.filter(u => u.hp > 0 && !u.gone);
const foesAlive = () => alive(B.foes).filter(u => !u.hiddenFoe);
const partyAlive = () => alive(B.party);
const canAct = u => u.hp > 0 && !u.status.sleep && !u.status.pause && !u.status.stun && !u.gone;
const pickOne = a => a.length ? a[rnd(a.length)] : null;
// who an enemy may target (Pilot X INCOGNITO can't be seen)
const targetsP = () => { const t = partyAlive().filter(u => !u.status.hidden); return t.length ? t : partyAlive(); };

// ---------- the encounter ----------
async function battle(form, opt = {}) {
  if (typeof form === 'string') form = FORMS[form];
  const prevScene = scene, prevMusic = curName;
  B = { form, foes: form.foes.map(([id, x, y]) => mkFoeUnit(id, x, y)), party: partyHeroes().map(mkHeroUnit), actQ: [], readyQ: [], pops: [], fx: [], msg: null,
    menu: null, cursor: null, bg: form.bg || opt.bg || 'grass', acting: 0, intro: 1, runHold: 0, lastCmd: null, t: 0, results: null, banner: null, combo: null };
  for (const f of B.foes) { G.seen[f.id] = 1; }
  scene = { update: battleUpdate, draw: battleDraw };
  if (!opt.keepMusic) music(form.music || (form.boss ? 'boss' : 'battle'));
  post.fade = 1; sfx('glitch'); await fadeIn(.12);
  if (form.boss && form.intro !== false) await wait(20);
  B.intro = 0;
  if (form.onStart) { B.acting++; await form.onStart(B); B.acting--; }
  const res = await battleLoop();
  for (const u of B.party) { u.r.hp = Math.max(0, u.hp); u.r.mp = u.mp; u.r.aspect = u.aspect; u.r.status = u.status.lag && u.hp > 0 ? { lag: 1 } : {}; }
  if (res === 'win' && !form.noReward) await victory();
  if (res === 'lose' && form.loseOk) { for (const u of B.party) if (u.r.hp <= 0) u.r.hp = 1; }
  if (!opt.noFade) await fadeOut(.08);
  scene = prevScene; B.done = 1; const b = B; B = null;
  if (!opt.keepMusic && res !== 'lose') music(prevMusic);
  b.result = res; return res;
}
function checkEnd() {
  if (B.forceEnd) return B.forceEnd;
  if (!partyAlive().length) return 'lose';
  if (!alive(B.foes).filter(u => !u.d.ignore).length) return 'win';
  return null;
}
async function battleLoop() {
  for (;;) {
    await nextFrame();
    const end = checkEnd(); if (end) { await wait(30); return end; }
    if (B.escaped) { await wait(20); return 'run'; }
    if (B.actQ.length) {
      const a = B.actQ.shift(); if ((a.actor.hp <= 0 || a.actor.gone) && !a.force) continue;
      B.acting++; await perform(a); B.acting--;
      if (a.actor.side === 'p') { a.actor.atb = 0; a.actor.queued = 0; a.actor.pose = 'ready'; }
      continue;
    }
    const u = B.readyQ.find(u => canAct(u));
    if (u) {
      B.readyQ.splice(B.readyQ.indexOf(u), 1);
      if (u.status.scram) { B.actQ.push(scrambledAction(u)); u.queued = 1; continue; }
      const a = await partyCommand(u);
      if (a === 'next') { B.readyQ.push(u); continue; }
      if (a) { u.queued = 1; u.last = a; B.actQ.push(a); } else B.readyQ.push(u);
    }
  }
}
// ---------- per-frame: gauges, timers ----------
const atbPaused = () => B.acting || B.intro || B.results || B.over || DLG || CARD || (G.config.wait && B.menu);
function battleUpdate() {
  B.t++;
  for (const p of B.pops) p.t++; B.pops = B.pops.filter(p => p.t < 50);
  for (const f of B.fx) f.t++; B.fx = B.fx.filter(f => f.t < f.n);
  for (const u of B.party.concat(B.foes)) { if (u.flash > 0) u.flash--; if (u.shake > 0) u.shake--; if (u.poseT > 0 && --u.poseT === 0) u.pose = 'ready'; if (u.hp <= 0 && u.side === 'e' && u.alpha > 0) u.alpha = Math.max(0, u.alpha - .04); }
  // run away: hold B + C
  if (!B.form.noRun && held.b && held.c && !B.acting) { if (++B.runHold > 50) { const esc = B.party.some(u => u.st.flags.escape) || rnd(100) < 55 + B.party.reduce((a, u) => a + u.spd, 0) / 3 - B.foes.reduce((a, u) => a + u.lv, 0) / 2; if (esc) { B.escaped = 1; sfx('door'); } else { B.runHold = 0; bmsg('CAN\'T RUN!'); } } } else B.runHold = Math.max(0, B.runHold - 2);
  if (pressed.start && !B.menu && !B.acting) { B.auto = !B.auto; bmsg(B.auto ? 'AUTO: ON' : 'AUTO: OFF'); }
  if (atbPaused()) return;
  for (const u of B.party) if (u.empress && B.t - u.empressT > 1600) { u.empress = 0; pop(u, 'COOLDOWN', BCOL.st); }
  const k = .19 * (.6 + G.config.speed * .2);
  for (const u of B.party.concat(B.foes)) {
    if (u.hp <= 0 || u.gone) continue;
    for (const s in u.status) { if (u.status[s] !== Infinity && --u.status[s] <= 0) { delete u.status[s]; if (s === 'pause') pop(u, 'UNPAUSED', BCOL.st); } }
    if (u.status.pause || u.queued) continue;
    if (u.side === 'p' && B.readyQ.includes(u)) continue;
    const m = (u.status.turbo ? 1.5 : 1) * (u.status.buffer ? .5 : 1);
    u.atb += (u.spd + 20) * k * m;
    if (u.atb >= 1000) { u.atb = 1000; turnStart(u); }
  }
}
function turnStart(u) {
  if (u.status.lag) dmgPop(u, Math.max(1, Math.floor(u.mhp / 20)), 'lag');
  if (u.status.regen) { const h = Math.max(1, Math.floor(u.mhp / 16)); u.hp = Math.min(u.mhp, u.hp + h); pop(u, h, BCOL.heal); }
  if (u.hp <= 0) return;
  if (u.status.stun || u.status.sleep) { if (u.status.stun) delete u.status.stun; u.atb = 0; return; }
  if (u.side === 'p') { if (u.invoice) u.invoice = 0; if (u.status.hidden && u.hiddenT && B.t - u.hiddenT > 900) delete u.status.hidden; B.readyQ.push(u); u.atb = 1000; return; }
  // enemies: pick a move now
  u.atb = 0; const mv = foeMove(u); if (mv) { u.queued = 1; B.actQ.push(Object.assign(mv, { actor: u, kind: 'enemy', done: () => { u.queued = 0; } })); }
}
function foeMove(u) {
  if (u.status.scram) return { move: { name: null, kind: 'fight' }, targets: [pickOne(alive(B.foes).filter(f => f !== u)) || u] };
  const d = u.d; let mv = d.ai ? d.ai(u, B) : null;
  if (!mv) mv = { move: { kind: 'fight' } };
  if (!mv.move) mv = { move: mv };
  if (!mv.targets) { const m = mv.move; mv.targets = m.tgt === 'all' ? targetsP() : m.tgt === 'self' ? [u] : m.tgt === 'foes' ? alive(B.foes) : m.tgt === 'ally' ? [pickOne(alive(B.foes))] : [pickOne(targetsP())]; }
  return mv;
}
function scrambledAction(u) {
  const side = rnd(2) ? partyAlive() : foesAlive(); return { actor: u, kind: 'fight', cmd: 'FIGHT', targets: [pickOne(side.length ? side : foesAlive())] };
}

// ---------- the command menu ----------
function cmdList(u) {
  const muted = u.status.mute;
  if (flag('armor') && ['yoko', 'terms', 'conds'].includes(u.id)) return [['ARMOR'], ['ITEM']];
  if (u.id === 'kid') return [['ASK'], ['PERFORM'], ['INSPECT'], ['MAGIC', muted], ['ITEM']];
  const L = [['FIGHT']]; const c = HEROES[u.id].cmd;
  if (c !== 'MAGIC') L.push([c]);
  if (u.id === 'yoko' && flag('empress')) L.push(['EMPRESS', u.empress]);
  L.push(['MAGIC', muted || !(knownSpells(u.r).length || u.r.crystal)]); L.push(['ITEM']);
  return L;
}
async function partyCommand(u) {
  if (B.auto && u.last && u.last.cmd !== 'ITEM') { const a = Object.assign({}, u.last); a.targets = null; if (a.spell && u.mp < SPELLS[a.spell].mp) a.spell = null; else { await wait(6); return a; } }
  for (;;) {
    u.pose = 'ready';
    const L = cmdList(u);
    const i = await bList(L.map(([t, dim]) => ({ t, dim })), { x: 4, y: BWIN + 2, w: 84, rows: 5, who: u, title: u.name, allowNext: 1 });
    if (i === 'next') return 'next';
    if (i < 0) return 'next';
    const cmd = L[i][0], a = await cmdDetail(u, cmd);
    if (a) { a.actor = u; a.cmd = a.cmd || cmd; return a; }
  }
}
const allFoes = () => foesAlive(), allP = () => partyAlive();
async function cmdDetail(u, cmd) {
  if (cmd === 'FIGHT') { const t = await pickTarget(u, 'foe'); return t && { kind: 'fight', targets: t }; }
  if (cmd === 'ASK' || cmd === 'INSPECT') { const t = await pickTarget(u, 'foe'); return t && { kind: 'kid', verb: cmd, targets: t }; }
  if (cmd === 'PERFORM') return { kind: 'kid', verb: 'PERFORM', targets: allFoes() };
  if (cmd === 'FIND') { const t = await pickTarget(u, 'foe'); return t && { kind: 'find', targets: t }; }
  if (cmd === 'INVOICE') return { kind: 'invoice', targets: [u] };
  if (cmd === 'INCOGNITO') return { kind: 'incognito', targets: [u] };
  if (cmd === 'EMPRESS') return { kind: 'empress', targets: [u] };
  if (cmd === 'MIMIC') { const l = B.lastParty; if (!l) { bmsg('NOTHING TO MIMIC.'); return null; } return Object.assign({}, l, { kind: 'mimic', targets: null }); }
  if (cmd === 'ARMOR') {
    const L = BEAMS.filter(b => !b.only || b.only === u.id); const i = await bList(L.map(b => ({ t: b.name })), { x: 4, y: BWIN + 2, w: 150, rows: 5, help: k => L[k].desc }); if (i < 0) return null;
    const bm = L[i], t = bm.tgt === 'all' ? allFoes() : await pickTarget(u, bm.heal ? 'ally' : 'foe'); return t && { kind: 'beam', beam: BEAMS.indexOf(bm), targets: t };
  }
  if (cmd === 'MAGIC') return magicMenu(u);
  if (cmd === 'ITEM') return itemMenu(u);
  if (cmd === 'INVENT') {
    const L = G.gadgets.map(k => GADGETS[k]); if (!L.length) { bmsg('NO INVENTIONS YET.'); return null; }
    const i = await bList(L.map(g => ({ t: g.name })), { x: 4, y: BWIN + 2, w: 150, rows: 5, help: k => L[k].desc }); if (i < 0) return null;
    const gd = L[i], t = gd.tgt === 'all' ? allFoes() : await pickTarget(u, 'foe'); return t && { kind: 'invent', gadget: G.gadgets[i], targets: t };
  }
  if (cmd === 'WELD') {
    const L = WELDS.filter(w => w.lv <= u.lv); const i = await bList(L.map(w => ({ t: w.name, r: w.input.map(k => ({ up: '^', down: 'v', left: '<', right: '>', a: 'A' })[k]).join('') })), { x: 4, y: BWIN + 2, w: 190, rows: 5 }); if (i < 0) return null;
    const w = L[i], t = w.tgt === 'one' ? await pickTarget(u, 'foe') : w.tgt === 'all' ? allFoes() : allP(); if (!t) return null;
    const ok = await weldInput(w); return { kind: 'weld', weld: w.id, ok, targets: t };
  }
  if (cmd === 'ACCUSE') { const lv = await accuseCharge(u); if (lv < 0) return null; const ac = ACCUSE[lv]; const t = ac.tgt === 'all' ? allFoes() : await pickTarget(u, 'foe'); return t && { kind: 'accuse', lv, targets: t }; }
  if (cmd === 'SEGMENT') { const r = await segmentReels(); return { kind: 'segment', reels: r, targets: allFoes() }; }
  return null;
}
async function magicMenu(u) {
  const known = knownSpells(u.r), L = [];
  const cr = CRYSTALS[u.r.crystal];
  if (cr && !u.summoned) L.push({ t: 'SUMMON ' + cr.summon.name, r: '20', s: '#summon', dim: u.mp < 20 });
  for (const s of known) L.push({ t: SPELLS[s].name, r: String(SPELLS[s].mp), s, dim: u.mp < SPELLS[s].mp });
  if (!L.length) { bmsg('NO MAGIC.'); return null; }
  const i = await bList(L, { x: 4, y: BWIN + 2, w: 200, rows: 5, cols: 1 }); if (i < 0) return null;
  const e = L[i]; if (e.dim) { bmsg('NOT ENOUGH MP.'); return null; }
  if (e.s === '#summon') return { kind: 'summon', targets: [] };
  const sp = SPELLS[e.s];
  const t = await pickTarget(u, sp.tgt === 'ally' || sp.tgt === 'allies' || sp.tgt === 'self' ? 'ally' : 'foe', { all: sp.tgt === 'all' || sp.tgt === 'allies', canAll: sp.canAll, dead: !!sp.revive });
  return t && { kind: 'magic', spell: e.s, targets: t };
}
async function itemMenu(u) {
  const keys = Object.keys(G.inv).filter(k => ITEMS[k] && !ITEMS[k].field);
  if (!keys.length) { bmsg('NO ITEMS.'); return null; }
  const i = await bList(keys.map(k => ({ t: ITEMS[k].name, r: String(G.inv[k]) })), { x: 4, y: BWIN + 2, w: 200, rows: 5, help: k => ITEMS[keys[k]].desc }); if (i < 0) return null;
  const it = ITEMS[keys[i]];
  const t = it.bomb ? allFoes() : it.all ? B.party.slice() : await pickTarget(u, 'ally', { dead: !!it.revive });
  return t && { kind: 'item', item: keys[i], targets: t };
}
// ---------- menus inside the battle window ----------
async function bList(items, o = {}) {
  const m = { items, i: 0, top: 0, x: o.x, y: o.y, w: o.w, rows: o.rows || 5, title: o.title, help: o.help };
  B.menu = m; await nextFrame();
  for (;;) {
    if (pressed.up) { m.i = (m.i + items.length - 1) % items.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % items.length; sfx('move'); }
    if (m.i < m.top) m.top = m.i; if (m.i >= m.top + m.rows) m.top = m.i - m.rows + 1;
    if (pressed.a) { if (items[m.i].dim && !o.dimOk) { sfx('tick'); bmsg(o.dimMsg || 'CAN\'T DO THAT.'); } else { sfx('ok'); B.menu = null; return m.i; } }
    if (pressed.b) { sfx('tick'); B.menu = null; return o.allowNext ? 'next' : -1; }
    await nextFrame();
  }
}
// target picking: left/right switches sides, up/down moves, C toggles "all" where allowed
async function pickTarget(u, side, o = {}) {
  let onFoes = side === 'foe', all = !!o.all, i = 0;
  const list = () => (onFoes ? alive(B.foes).filter(f => !f.hiddenFoe) : (o.dead ? B.party.filter(p => !p.gone) : partyAlive())).sort((a, b) => a.y - b.y || a.x - b.x);
  if (!onFoes) i = Math.max(0, list().indexOf(u));
  await nextFrame();
  for (;;) {
    let L = list(); if (!L.length) { onFoes = !onFoes; L = list(); if (!L.length) return null; }
    i = clamp(i, 0, L.length - 1);
    B.cursor = { units: all ? L : [L[i]] };
    if (pressed.up) { i = (i + L.length - 1) % L.length; sfx('move'); }
    if (pressed.down) { i = (i + 1) % L.length; sfx('move'); }
    if (pressed.left && !onFoes && !o.all) { onFoes = true; i = 0; sfx('move'); }
    if (pressed.right && onFoes && !o.all) { onFoes = false; i = 0; sfx('move'); }
    if (pressed.c && (o.canAll || o.all)) { all = !all || o.all; sfx('move'); }
    if (pressed.a) { sfx('ok'); B.cursor = null; return all ? L : [L[i]]; }
    if (pressed.b) { sfx('tick'); B.cursor = null; return null; }
    await nextFrame();
  }
}
// OLD FACE: enter the welding inputs in time
async function weldInput(w) {
  B.weld = { w, n: 0, t: 0, ok: null };
  if (DBG.botWeld) { B.weld.n = w.input.length; B.weld.ok = 1; await wait(10); B.weld = null; return 1; }
  await nextFrame();
  while (B.weld.t < 200) {
    B.weld.t++;
    const want = w.input[B.weld.n], hit = ['up', 'down', 'left', 'right', 'a'].find(k => pressed[k]);
    if (hit) { if (hit === want) { B.weld.n++; sfx('move'); if (B.weld.n >= w.input.length) { B.weld.ok = 1; break; } } else { B.weld.ok = 0; sfx('tick'); break; } }
    await nextFrame();
  }
  const ok = B.weld.ok === 1; await wait(12); B.weld = null; return ok;
}
// JB GARFIELD: the case builds while you wait; press A to accuse
async function accuseCharge(u) {
  B.accuse = { t: 0, lv: 0 }; await nextFrame();
  for (;;) {
    B.accuse.t++; B.accuse.lv = Math.min(3, Math.floor(B.accuse.t / 70));
    if (DBG.botAccuse !== undefined && B.accuse.lv >= DBG.botAccuse) break;
    if (pressed.a) break;
    if (pressed.b) { B.accuse = null; return -1; }
    await nextFrame();
  }
  const lv = B.accuse.lv; sfx('object'); B.accuse = null; return lv;
}
// SPOOKY GHOST: three reels; A stops each one
async function segmentReels() {
  const R = { pos: [0, 0, 0], stop: [0, 0, 0], k: 0 }; B.reels = R; await nextFrame();
  while (R.k < 3) {
    for (let j = R.k; j < 3; j++) R.pos[j] = (R.pos[j] + .18 + j * .04) % REELS.length;
    if (pressed.a || DBG.botReel) { R.stop[R.k] = Math.round(R.pos[R.k]) % REELS.length; R.pos[R.k] = R.stop[R.k]; R.k++; sfx('tick'); if (DBG.botReel) await wait(4); }
    await nextFrame();
  }
  await wait(20); B.reels = null; return R.stop.map(i => REELS[i]);
}
function bmsg(s, t = 70) { B.msg = { s, t }; }

// ---------- doing things ----------
const variance = () => .88 + Math.random() * .24;
function physBase(u) { const P = u.side === 'p' ? u.st.atk + u.str * 2 : u.P; return P + u.lv * u.lv * P / 160; }
function magBase(u, sp) { return sp * 3 + u.lv * u.mag * sp / 48; }
function elemMult(t, el) {
  if (!el || t.side === 'p') return t.side === 'p' && el && t.st.block.includes(el) ? 0 : 1;
  const d = t.d; if ((d.absorb || []).includes(el)) return -1; if ((d.immune || []).includes(el)) return 0; if ((d.weak || []).includes(el)) return 2; if ((d.resist || []).includes(el)) return .5; return 1;
}
// one effect on one target. eff: { pow, magic, sp, elem, heal, revive, status, hit, drain, pierce, erase, cure, split, mpCost }
function applyEffect(u, t, eff) {
  if (eff.revive) {
    if (t.side === 'e' && t.d.undead) { dmgPop(t, t.hp, 'erase'); return; }
    if (t.hp <= 0) { t.hp = Math.max(1, Math.floor(t.mhp * eff.revive)); t.atb = 0; t.status = {}; pop(t, 'BACK!', BCOL.heal); t.pose = 'ready'; return; }
    if (!eff.heal && !eff.pow) return;
  }
  if (t.hp <= 0) return;
  if (t.d && t.d.guard && (eff.pow || eff.sp) && !eff.heal && t.d.guard(t, eff, u) === 0) { pop(t, 'NO EFFECT', BCOL.miss); return; }
  if (eff.cure) { for (const s of eff.cure) delete t.status[s]; pop(t, 'CURED', BCOL.heal); }
  if (eff.scan) { const d = t.d; if (d) { const w = (d.weak || []).map(e => ELEM[e]).join(' '); bmsg(t.name + ' LV' + t.lv + ' HP ' + t.hp + '/' + t.mhp + (w ? '  WEAK: ' + w : ''), 140); } return; }
  if (eff.erase) { if (t.d && (t.d.boss || t.d.noErase) || rnd(100) >= eff.erase) { pop(t, 'MISS', BCOL.miss); return; } pop(t, 'ERASED', BCOL.st); t.hp = 0; t.erased = 1; return; }
  let n = 0;
  if (eff.pow || eff.sp) {
    if (eff.magic || eff.sp) n = magBase(u, eff.sp || eff.pow * 20) * variance();
    else n = physBase(u) * (eff.pow || 1) * variance();
    if (eff.heal) { if (t.side === 'e' && t.d.undead) { dmgPop(t, Math.round(n), 'heal'); return; } t.hp = Math.min(t.mhp, t.hp + Math.round(n)); pop(t, Math.round(n), BCOL.heal); return; }
    const df = eff.magic || eff.sp ? t.mdef : t.def;
    if (!eff.pierce) n *= (255 - Math.min(230, df)) / 256;
    if (!eff.magic && !eff.sp) { if (u.side === 'p' && u.row === 'back' && !['mic', 'dart', 'rod'].includes(HEROES[u.id].weap)) n *= .5; if (t.side === 'p' && t.row === 'back') n *= .5; }
    if (t.status.armor && !(eff.magic || eff.sp)) n *= .6;
    if (t.status.exposed) { n *= 1.5; delete t.status.exposed; }
    if (eff.split) n *= .55;
    if (t.side === 'p' && t.empress) n *= .5;
    const em = elemMult(t, eff.elem); n *= em;
    n = Math.round(Math.min(9999, Math.abs(n))) * (em < 0 ? -1 : 1);
    if (em === 0) { pop(t, 'NULL', BCOL.miss); return; }
    if (n < 0) { t.hp = Math.min(t.mhp, t.hp - n); pop(t, -n, BCOL.heal); return; }
    dmgPop(t, Math.max(1, n), eff.elem || 'hit');
    if (eff.drain) { u.hp = Math.min(u.mhp, u.hp + n); pop(u, n, BCOL.heal); }
    if (t.status.sleep && !(eff.magic || eff.sp)) delete t.status.sleep;
    if (t.status.scram && !(eff.magic || eff.sp)) delete t.status.scram;
  }
  if (eff.status && t.hp > 0) inflict(t, eff.status, eff.hit === undefined ? 100 : eff.hit, eff.good);
}
const STDUR = { sleep: 700, pause: 500, buffer: 1100, turbo: 1300, armor: 1500, mirror: 1500, float: 2000, regen: 1500, scram: Infinity, mute: Infinity, lag: Infinity, blind: Infinity, stun: Infinity, exposed: Infinity };
function inflict(t, s, hit = 100, good) {
  if (!good) { if (t.side === 'p' && t.st.block.includes(s)) { pop(t, 'BLOCKED', BCOL.miss); return false; } if (t.side === 'e' && (t.d.immuneSt || []).includes(s)) { pop(t, 'IMMUNE', BCOL.miss); return false; } if (t.d && t.d.boss && ['pause', 'scram', 'sleep'].includes(s) && rnd(100) > 25) { pop(t, 'MISS', BCOL.miss); return false; } if (rnd(100) >= hit) { pop(t, 'MISS', BCOL.miss); return false; } }
  t.status[s] = STDUR[s] || 900; pop(t, STATUS[s] || s.toUpperCase(), BCOL.st); return true;
}
function dmgPop(t, n, kind) {
  t.hp = Math.max(0, t.hp - n); pop(t, n, BCOL.dmg); t.flash = 10; t.shake = 8;
  if (t.side === 'p') { t.pose = 'hurt'; t.poseT = 20; sfx('hurt'); } else sfx('land');
  if (t.hp <= 0) unitDown(t);
  else if (t.d && t.d.onHurt) t.d.onHurt(t, n, kind);
}
function unitDown(t) {
  if (t.side === 'p') {
    if (t.reraise) { t.reraise = 0; t.hp = Math.floor(t.mhp / 4); pop(t, 'BACKUP RESTORED', BCOL.heal); return; }
    t.status = {}; t.atb = 0; t.queued = 0; const qi = B.readyQ.indexOf(t); if (qi >= 0) B.readyQ.splice(qi, 1); sfx('powerdown');
  } else { sfx('crowd'); if (t.d.onDeath) t.d.onDeath(t); G.kills++; }
}
function pop(t, n, c) { B.pops.push({ x: t.side === 'p' ? t.x + 4 : t.x + t.w / 2 - 6, y: t.side === 'p' ? t.y + 4 : t.y + t.h / 3, n: String(n), c, t: 0, dy: B.pops.filter(p => p.t < 20).length * 3 }); }
function fx(kind, t, n = 30, extra) { B.fx.push(Object.assign({ kind, x: t ? (t.side === 'p' ? t.x + 8 : t.x + t.w / 2) : 160, y: t ? (t.side === 'p' ? t.y + 12 : t.y + t.h / 2) : 70, t: 0, n }, extra || {})); }
const aliveOf = arr => (arr || []).filter(t => t && (t.hp > 0 || t._reviveOk) && !t.gone);
function retarget(a) {
  let t = (a.targets || []).filter(Boolean);
  if (a.kind === 'magic' && SPELLS[a.spell].revive) return t;
  if (a.kind === 'item' && ITEMS[a.item].revive) return t;
  const live = t.filter(x => x.hp > 0 && !x.gone);
  if (live.length || !t.length) return live.length ? live : retargetSide(a, t);
  return retargetSide(a, t);
}
function retargetSide(a, t) { const side = t.length ? t[0].side : 'e'; const pool = side === 'e' ? foesAlive() : partyAlive(); return pool.length ? [pickOne(pool)] : []; }
async function stepIn(u) { if (u.side !== 'p') { u.flash = 6; await wait(8); return; } for (let i = 0; i < 6; i++) { u.dx -= 3; await nextFrame(); } }
async function stepOut(u) { if (u.side !== 'p') return; while (u.dx < 0) { u.dx = Math.min(0, u.dx + 4); await nextFrame(); } }

async function perform(a) {
  const u = a.actor; a.targets = a.targets ? retarget(a) : null;
  if (a.kind === 'mimic') { const src = Object.assign({}, a, { kind: B.lastParty.kind, actor: u }); a = src; a.targets = null; }
  if (!a.targets || !a.targets.length) { a.targets = defaultTargets(a); if (!a.targets.length) { if (a.done) a.done(); return; } }
  B.curKind = a.kind === 'enemy' ? 'enemy' : a.kind;
  try {
    if (a.kind === 'enemy') await foeAct(a);
    else await heroAct(a);
  } finally { if (a.done) a.done(); }
  if (u.side === 'p' && a.kind !== 'mimic' && a.kind !== 'combo') { B.lastParty = a; await checkCombo(u, a); }
  await settleDeaths();
}
function defaultTargets(a) {
  const k = a.kind;
  if (k === 'fight' || k === 'find' || k === 'kid') return [pickOne(foesAlive())].filter(Boolean);
  if (k === 'magic') { const sp = SPELLS[a.spell]; return sp.tgt === 'ally' || sp.tgt === 'allies' ? [a.actor] : [pickOne(foesAlive())].filter(Boolean); }
  if (k === 'invent' || k === 'weld' || k === 'accuse') return [pickOne(foesAlive())].filter(Boolean);
  return [a.actor];
}
async function settleDeaths() { for (const f of B.foes) if (f.hp <= 0 && !f.gone && f.alpha <= .05) f.gone = 1; await wait(4); }

// ---------- hero actions ----------
async function heroAct(a) {
  const u = a.actor, T = a.targets;
  const label = s => bmsg(s);
  switch (a.kind) {
    case 'fight': {
      await stepIn(u); u.pose = 'atk'; u.poseT = 16;
      const hits = u.st.flags.twice ? 2 : 1, desperate = u.hp < u.mhp / 8 && rnd(12) === 0 && DESPERATION[u.id];
      if (desperate) { label(DESPERATION[u.id].name); fx('boom', null, 30); sfx('object'); await wait(24); for (const t of foesAlive()) applyEffect(u, t, Object.assign({ pierce: 1 }, DESPERATION[u.id])); break; }
      for (let h = 0; h < hits; h++) for (const t of T) {
        if (t.hp <= 0) continue;
        if (u.status.blind && rnd(2)) { pop(t, 'MISS', BCOL.miss); continue; }
        sfx('jump'); fx(u.st.elem || 'slash', t, 16); await wait(10);
        const crit = rnd(32) === 0, pierce = !!u.status.hidden;
        applyEffect(u, t, { pow: (crit ? 2 : 1) * (pierce ? 2 : 1), elem: u.st.elem, pierce });
        if (crit) pop(t, 'CRITICAL', BCOL.st);
      }
      if (u.status.hidden) { delete u.status.hidden; label('OUT OF NOWHERE.'); }
      await wait(14); await stepOut(u); break;
    }
    case 'magic': {
      const sp = SPELLS[a.spell]; if (u.mp < sp.mp) { label('NOT ENOUGH MP.'); return; }
      u.mp -= sp.mp; label(sp.name); u.pose = 'cast'; u.poseT = 40; sfx('switch'); await wait(16);
      const casts = u.st.flags.dual ? 2 : 1;
      for (let c = 0; c < casts; c++) await castSpell(u, a.spell, T, { mult: u.empress ? 2 : 1 });
      break;
    }
    case 'summon': {
      const cr = CRYSTALS[u.r.crystal]; if (!cr || u.mp < 20) return; u.mp -= 20; u.summoned = 1;
      await summonShow(cr); const s = cr.summon;
      if (s.pow) for (const t of foesAlive()) applyEffect(u, t, { sp: s.pow, magic: 1, elem: s.elem, split: 0 });
      if (s.heal) for (const t of B.party) { if (s.revive && t.hp <= 0) t.hp = 1; applyEffect(u, t, { sp: s.heal, magic: 1, heal: 1 }); }
      if (s.status) for (const t of foesAlive()) for (const st of s.status) inflict(t, st, 70);
      if (s.regen) for (const t of partyAlive()) inflict(t, 'regen', 100, 1);
      if (s.shield) for (const t of partyAlive()) { inflict(t, 'armor', 100, 1); inflict(t, 'mirror', 100, 1); }
      await wait(30); break;
    }
    case 'item': {
      const it = ITEMS[a.item]; if (!invHas(a.item)) { label('ALL GONE.'); return; } invAdd(a.item, -1);
      label(it.name); await stepIn(u); u.pose = 'cast'; u.poseT = 20; sfx('ok'); await wait(14);
      for (const t of T) {
        if (it.revive && t.hp <= 0) { applyEffect(u, t, { revive: it.revive }); if (it.all) t.hp = t.mhp; }
        if (t.hp <= 0) continue;
        if (it.heal) { const n = Math.min(t.mhp - t.hp, it.heal); t.hp += n; pop(t, n, BCOL.heal); fx('heal', t, 30); }
        if (it.mana) { const n = Math.min(t.mmp - t.mp, it.mana); t.mp += n; pop(t, n, BCOL.mp); fx('heal', t, 30); }
        if (it.cure) applyEffect(u, t, { cure: it.cure });
        if (it.bomb) { fx(it.bomb.elem, t, 30); applyEffect(u, t, { sp: it.bomb.pow, magic: 1, elem: it.bomb.elem, pierce: 1, flat: 1 }); }
      }
      await wait(16); await stepOut(u); break;
    }
    case 'find': {
      await stepIn(u); u.pose = 'atk'; u.poseT = 14; await wait(12); const t = T[0];
      if (!t.steal || t.stolen) label('NOTHING THERE. HE WAS SURE THERE WAS SOMETHING.');
      else if (rnd(100) < 45 + (u.lv - t.lv) * 3 + (t.status.exposed ? 25 : 0)) { t.stolen = 1; invAdd(t.steal); label('FOUND ' + itemName(t.steal) + '! IT WAS JUST THERE.'); sfx('get'); fx('steal', t, 30); }
      else label('COULDN\'T FIND IT.');
      await wait(30); await stepOut(u); break;
    }
    case 'invent': {
      const gd = GADGETS[a.gadget]; label(gd.name); await stepIn(u); u.pose = 'cast'; u.poseT = 24; sfx('power'); await wait(16);
      for (const t of T) { fx(gd.elem || (gd.status ? 'status' : 'boom'), t, 26); applyEffect(u, t, { pow: gd.pow, magic: gd.magic, sp: gd.magic ? gd.pow * 30 : 0, elem: gd.elem, pierce: gd.pierce, status: gd.status, hit: gd.hit, erase: gd.erase && rnd(100) < gd.erase ? 100 : 0 }); await wait(4); }
      await wait(16); await stepOut(u); break;
    }
    case 'weld': {
      const w = WELDS.find(x => x.id === a.weld);
      if (!a.ok) { label('THE WELD DIDN\'T TAKE.'); await wait(30); return; }
      label(w.name); await stepIn(u); u.pose = 'atk'; u.poseT = 30; sfx('power');
      for (const t of T) { fx(w.elem || (w.heal || w.revive ? 'heal' : 'spark'), t, 30); await wait(6);
        if (w.revive) { applyEffect(u, t, { revive: w.revive }); continue; }
        if (w.heal) { applyEffect(u, t, { sp: 30, magic: 1, heal: 1 }); continue; }
        applyEffect(u, t, { pow: w.pow, elem: w.elem, split: T.length > 1 && w.tgt === 'all' ? 0 : 0 }); }
      await wait(20); await stepOut(u); break;
    }
    case 'beam': {
      const bm = BEAMS[a.beam]; label(bm.name); u.pose = 'cast'; u.poseT = 24; sfx('power'); await wait(14);
      for (const t of T) { fx(bm.elem || (bm.heal ? 'heal' : 'boom'), t, 26); applyEffect(u, t, { sp: bm.sp, magic: 1, elem: bm.elem, heal: bm.heal }); await wait(4); }
      await wait(16); break;
    }
    case 'invoice': u.invoice = 1; u.pose = 'cast'; u.poseT = 30; label('INVOICE: THE NEXT SPELL IS BILLED TO LINDA.'); sfx('ok'); await wait(30); break;
    case 'incognito': u.status.hidden = Infinity; u.hiddenT = B.t; label('PILOT X IS INCOGNITO.'); sfx('switch'); await wait(24); break;
    case 'empress': {
      if (u.empress) return; u.empress = 1; u.empressT = B.t; label('EMPRESS'); post.flash = .7; sfx('power'); fx('heal', u, 50); await wait(30); post.flash = 0;
      B.empressT = B.t; break;
    }
    case 'accuse': {
      const ac = ACCUSE[a.lv]; label(ac.name + '!'); await stepIn(u); u.pose = 'atk'; u.poseT = 30; sfx('object'); await wait(10);
      for (const t of T) { fx('slash', t, 20); applyEffect(u, t, { pow: ac.pow, status: ac.status, hit: ac.hit }); await wait(5); }
      await wait(20); await stepOut(u); break;
    }
    case 'segment': {
      const r = a.reels, same = r[0] === r[1] && r[1] === r[2], two = r[0] === r[1] || r[1] === r[2] || r[0] === r[2];
      u.pose = 'cast'; u.poseT = 30;
      if (same && r[0] === 'GHOST') { label('SPOOKY SPECIAL!'); post.flash = .6; sfx('object'); await wait(20); post.flash = 0; for (const t of foesAlive()) { fx('boom', t, 30); applyEffect(u, t, { sp: 100, magic: 1, pierce: 1 }); } }
      else if (same && r[0] === 'GUEST') { const ks = Object.keys(CRYSTALS), cr = CRYSTALS[G.crystals.length ? pickOne(G.crystals) : 'clerk']; label('SPECIAL GUEST: ' + cr.name); await summonShow(cr); for (const t of foesAlive()) applyEffect(u, t, { sp: (cr.summon.pow || 60), magic: 1, elem: cr.summon.elem }); }
      else if (same && r[0] === 'BIT') { label('THE BIT KILLS. EVERYONE FEELS GREAT.'); for (const t of partyAlive()) { t.hp = t.mhp; pop(t, 'FULL', BCOL.heal); fx('heal', t, 30); } }
      else if (same && r[0] === 'BREAK') { label('COMMERCIAL BREAK.'); for (const t of foesAlive()) inflict(t, 'buffer', 100); }
      else if (same) { label('BOO!'); for (const t of foesAlive()) inflict(t, 'scram', 80); }
      else if (two) { label('A DECENT SEGMENT.'); for (const t of foesAlive()) { fx('spark', t, 20); applyEffect(u, t, { pow: 1.2 }); } }
      else { label('DEAD AIR.'); fx('status', foesAlive()[0], 20); for (const t of foesAlive()) applyEffect(u, t, { pow: .4 }); }
      await wait(30); break;
    }
    case 'kid': {
      const v = a.verb; u.aspect = v === 'ASK' ? 'kid' : v === 'PERFORM' ? 'wee' : 'boy';
      u.pose = 'cast'; u.poseT = 30; sfx('ask'); await wait(12);
      if (v === 'ASK') { const t = T[0]; label(pickOne(['WHY ARE YOU DOING THIS?', 'DO YOU HAVE TO?', 'WHAT IS YOUR NAME?', 'ARE YOU OKAY?', 'WHO TOLD YOU TO?'])); await wait(20);
        if (rnd(100) < 55 + (u.mag - t.lv) * 2) { inflict(t, 'stun', 100); fx('status', t, 30); const w = (t.d.weak || []).map(e => ELEM[e]); if (w.length) bmsg(t.name + ' ADMITS IT: WEAK TO ' + w.join(', ') + '.', 120); } else pop(t, 'IGNORED', BCOL.miss); }
      if (v === 'PERFORM') { label('PEE-WEE KID PERFORMS.'); await wait(20); for (const t of T) { if (rnd(100) < 40 + u.mag / 2) inflict(t, 'sleep', 100); else pop(t, 'UNMOVED', BCOL.miss); } for (const p of partyAlive()) { const n = Math.round(p.mhp * .06); p.hp = Math.min(p.mhp, p.hp + n); pop(p, n, BCOL.heal); } }
      if (v === 'INSPECT') { const t = T[0]; label('PEE BOY INSPECTS ' + t.name + '.'); await wait(16); applyEffect(u, t, { scan: 1 }); inflict(t, 'exposed', 100); }
      await wait(24); break;
    }
    case 'combo': {
      const c = a.combo; B.banner = { s: c.name, t: 100 }; post.flash = .5; sfx('object'); await wait(24); post.flash = 0;
      const tg = c.tgt === 'allies' ? partyAlive() : foesAlive();
      for (const t of tg) { fx(c.elem || (c.heal ? 'heal' : 'boom'), t, 30);
        if (c.heal) { applyEffect(u, t, { sp: c.heal, magic: 1, heal: 1 }); continue; }
        if (c.steal) { if (t.steal && !t.stolen) { t.stolen = 1; invAdd(t.steal); pop(t, 'GOT ' + itemName(t.steal), BCOL.heal); } continue; }
        applyEffect(u, t, { pow: c.pow, elem: c.elem, status: c.status, hit: 70, pierce: 1 }); }
      await wait(30); break;
    }
  }
}
// cast a spell: mirror, invoice, multi-target split, undead
async function castSpell(u, id, T, o = {}) {
  const sp = SPELLS[id];
  // LINDA's invoice: a single-target spell aimed anywhere gets billed to her instead
  const inv = T.length === 1 && !sp.good && !sp.heal ? B.party.find(p => p.invoice && p.hp > 0 && p !== u) : null;
  if (inv) { inv.invoice = 0; const g = Math.min(inv.mmp - inv.mp, sp.mp); inv.mp += g; pop(inv, 'BILLED ' + g + ' MP', BCOL.mp); fx('heal', inv, 30); sfx('get'); await wait(30); return; }
  const split = T.length > 1 && sp.tgt !== 'all' && sp.tgt !== 'allies';
  for (let t of T) {
    if (t.status.mirror && !sp.good && sp.tgt !== 'all') { pop(t, 'BOUNCE', BCOL.st); const pool = t.side === 'p' ? foesAlive() : partyAlive(); t = pickOne(pool) || t; }
    fx(sp.elem || (sp.heal || sp.revive || sp.cure ? 'heal' : sp.status ? 'status' : 'boom'), t, 30); await wait(6);
    applyEffect(u, t, { sp: sp.pow ? sp.pow * (o.mult || 1) : 0, magic: 1, elem: sp.elem, heal: sp.heal, revive: sp.revive, cure: sp.cure, status: sp.status, hit: sp.hit, good: sp.good, drain: sp.drain, scan: sp.scan, pierce: sp.pierce, erase: sp.erase ? sp.hit : 0, split });
  }
  await wait(24);
}
async function summonShow(cr) {
  B.summon = { cr, t: 0 }; sfx('object'); post.flash = .4;
  for (let i = 0; i < 70; i++) { B.summon.t = i; if (i === 6) post.flash = 0; await nextFrame(); }
  B.summon = null;
}
// PS4-style: two heroes' commands close together fuse
async function checkCombo(u, a) {
  const prev = B.lastCmd; B.lastCmd = { id: u.id, cmd: a.cmd, kind: a.kind, t: B.t };
  if (!prev || prev.id === u.id || B.t - prev.t > 300 || a.kind === 'combo') return;
  const c = COMBOS.find(c => (c.a[0] === prev.id && c.a[1] === prev.cmd && c.b[0] === u.id && c.b[1] === a.cmd) || (c.b[0] === prev.id && c.b[1] === prev.cmd && c.a[0] === u.id && c.a[1] === a.cmd));
  if (!c || !foesAlive().length) return;
  B.lastCmd = null; G.combos[c.name] = (G.combos[c.name] || 0) + 1;
  B.acting++; await heroAct({ actor: u, kind: 'combo', combo: c, targets: [] }); B.acting--;
}
const DESPERATION = {
  yoko: { name: 'ASSISTANCE', pow: 4, elem: 'zap' }, carl: { name: 'I\'M A NORMAL GUY!', pow: 5 }, face: { name: 'GRAND DESIGN', pow: 5, elem: 'hot' }, oldface: { name: 'FOUR-SHADE FURY', pow: 6, elem: 'legacy' },
  linda: { name: 'HOSTILE TAKEOVER', pow: 5 }, ghost: { name: 'LIVE FROM BEYOND', pow: 5 }, garfield: { name: 'FIASCO', pow: 6 }, pilotx: { name: 'X MARKS THE SPOT', pow: 6 }, human: { name: 'GENERIC FINISHER', pow: 5 },
};

// ---------- enemy actions ----------
async function foeAct(a) {
  const u = a.actor, m = a.move, T = a.targets.filter(t => t && t.hp > 0); if (!T.length) return;
  if (m.say) await say(m.say, m.who || u.name, m.sayO || {});
  if (m.name) bmsg(m.name);
  if (m.run) { await m.run(u, T); return; }
  await stepIn(u);
  if (m.kind === 'spell' || m.spell) {
    const id = m.spell || m.id; const sp = SPELLS[id]; if (u.status.mute) { bmsg(u.name + ' IS MUTED.'); return; }
    if (!m.name) bmsg(sp.name); await wait(10); await castSpell(u, id, m.tgt === 'all' ? targetsP() : T, {}); return;
  }
  if (m.kind === 'fight' || !m.kind) {
    for (const t of T) { if (u.status.blind && rnd(2)) { pop(t, 'MISS', BCOL.miss); continue; } fx('claw', t, 14); await wait(8); applyEffect(u, t, { pow: 1 }); }
    await wait(14); return;
  }
  // special: { pow (x physical) | sp (magic power), elem, status, hit, tgt, drain, heal }
  await wait(8);
  for (const t of T) { fx(m.fx || m.elem || (m.status ? 'status' : 'boom'), t, 28); await wait(4); applyEffect(u, t, { pow: m.pow, sp: m.sp, magic: !!m.sp, elem: m.elem, status: m.status, hit: m.hit, drain: m.drain, heal: m.heal, pierce: m.pierce, split: T.length > 1 && m.split }); }
  await wait(20);
}

// ---------- after the fight ----------
async function victory() {
  const dead = B.foes;
  let xp = 0, gp = 0, ap = 0; const items = [];
  for (const f of dead) { if (f.erased && f.d.boss) continue; xp += f.d.xp || 0; gp += f.d.gp || 0; ap += f.d.ap || 0; if (f.drop && rnd(100) < (f.d.dropRate || 25)) items.push(f.drop); }
  if (B.party.some(u => u.st.flags.gp)) gp *= 2;
  G.gp += gp; for (const it of items) invAdd(it);
  music('victory');
  for (const u of B.party) if (u.hp > 0) { u.pose = 'win'; }
  const lines = ['VICTORY!', '', 'EXP: ' + xp, 'GP: ' + gp];
  if (ap) lines.push('AP: ' + ap);
  for (const it of items) lines.push('GOT ' + itemName(it) + '!');
  B.results = { lines }; await wait(20); await waitBtn();
  // everyone in the party who is still standing gets the full amount (benched heroes get half)
  const ups = [];
  for (const id of Object.keys(G.roster)) {
    const r = G.roster[id], u = B.party.find(p => p.r === r);
    if (u && u.hp <= 0) continue;
    const got = giveXP(r, u ? xp : Math.floor(xp / 2));
    for (const g of got) { ups.push(HEROES[id].name + ' IS NOW LEVEL ' + g.lv + '!'); for (const s of g.learned) ups.push(HEROES[id].name + ' LEARNED ' + SPELLS[s].name + '!'); }
    if (u) for (const s of giveAP(r, ap)) ups.push(HEROES[id].name + ' LEARNED ' + SPELLS[s].name + '!');
  }
  for (let i = 0; i < ups.length; i += 6) { B.results = { lines: ups.slice(i, i + 6) }; sfx('get'); await waitBtn(); }
  B.results = null;
}

// ---------- drawing ----------
function battleDraw() {
  drawBattleBG(B.bg);
  // foes
  for (const f of B.foes) {
    if (f.gone || f.alpha <= 0 || f.hiddenFoe) continue;
    const sx = f.x + (f.shake ? (f.shake & 2 ? 2 : -2) : 0) + (f.dx || 0);
    if (f.alpha < 1) { // death: dissolve into the palette's darkest colour, row by row
      const cut = Math.floor(f.h * (1 - f.alpha)); drawClip(f.spr, sx, f.y, f.pal, cut, hex('#6d2449')); continue;
    }
    if (f.d.draw) f.d.draw(f, sx);
    else draw(f.spr, sx, f.y, f.pal, false, f.flash & 2 ? WHITE : (f.status.pause ? hex('#929292') : 0));
    if (f.status.sleep && (frame >> 4) & 1) text('Z', sx + f.w - 6, f.y - 6, WHITE);
  }
  // party
  for (const u of B.party) {
    const H = heroArt(u); let s = H.ready, px = u.x + u.dx, py = u.y;
    if (u.hp <= 0) { s = H.ko; py += 10; }
    else if (B.results && u.pose === 'win') s = (frame >> 4) & 1 ? H.win : H.ready;
    else if (u.pose === 'atk') s = H.atk; else if (u.pose === 'cast') s = H.cast; else if (u.pose === 'hurt') s = H.hurt;
    else if (u.hp < u.mhp / 8 || u.status.sleep) s = H.low;
    else if (B.menu && B.menu.who === u || (B.readyQ[0] === u && !B.acting)) { s = H.walkB[(frame >> 3) & 1]; px -= 2; }
    if (u.status.hidden) { if ((frame & 3) === 0) draw(s, px, py, H.P); }
    else draw(s, px, py, u.empress ? empressPal(H.P) : H.P, false, u.flash & 2 ? WHITE : (u.status.pause ? hex('#929292') : 0));
    if (u.status.sleep && (frame >> 4) & 1) text('Z', px + 12, py - 4, WHITE);
    if (u.invoice) text('$', px - 6, py + 2, hex('#ff92db'));
  }
  // effects and numbers
  for (const f of B.fx) drawFx(f);
  for (const p of B.pops) { const k = p.t < 10 ? -Math.sin(p.t / 10 * Math.PI) * 8 : 0; text(p.n, p.x - p.n.length * 3 + 6, p.y + k - p.dy, p.c, BLACK); }
  if (B.summon) drawSummon(B.summon);
  drawBattleUI();
}
function heroArt(u) { if (u.id === 'kid') return ART.hero[u.aspect || 'kid']; if (flag('armor') && ART.hero['armor_' + u.id]) return ART.hero['armor_' + u.id]; return ART.hero[u.id]; }
const EMP = {}; function empressPal(P) { return EMP[P.length + '' + P[6]] || (EMP[P.length + '' + P[6]] = P.map((c, i) => i ? mix(c, hex('#ff92ff'), .35) : 0)); }
function drawClip(s, x, y, P, cut, c) { for (let j = 0; j < s.h; j++) { if (j < cut) continue; for (let i = 0; i < s.w; i++) { const v = s.d[j * s.w + i]; if (v) pset(x + i + ((j < cut + 3) ? rnd(3) - 1 : 0), y + j, j < cut + 4 ? c : P[v]); } } }
function drawFx(f) {
  const k = f.t / f.n, x = f.x, y = f.y;
  switch (f.kind) {
    case 'slash': case 'claw': { const c = f.kind === 'claw' ? hex('#ff4949') : WHITE; for (let i = 0; i < 3; i++) lineF(x - 10 + i * 5, y - 12 + k * 6, x + 2 + i * 5, y + 10 + k * 6, c); break; }
    case 'hot': for (let i = 0; i < 10; i++) { const a = i * 1.7 + f.t * .2, r = 4 + (i % 4) * 3; circF(x + Math.cos(a) * r, y - k * 20 + Math.sin(a) * 4 - i, 3 - k * 2, i & 1 ? hex('#ffdb24') : hex('#ff6d24')); } break;
    case 'cold': for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28, r = 16 * (1 - k); lineF(x, y, x + Math.cos(a) * r, y + Math.sin(a) * r, i & 1 ? hex('#92dbff') : WHITE); } circF(x, y, 6 * (1 - k), hex('#dbffff')); break;
    case 'zap': { let px = x + rnd(9) - 4, py = y - 40; for (let i = 0; i < 6; i++) { const nx = x + rnd(17) - 8, ny = py + 8; lineF(px, py, nx, ny, (f.t >> 1) & 1 ? hex('#ffff49') : WHITE); px = nx; py = ny; } break; }
    case 'heal': for (let i = 0; i < 8; i++) { const yy = y + 10 - ((f.t * 1.2 + i * 6) % 30); pset(x - 8 + (i * 5) % 18, yy, hex('#92ffb6')); pset(x - 8 + (i * 5) % 18, yy - 1, WHITE); } break;
    case 'status': ringF(x, y, 4 + k * 16, hex('#db92ff')); ringF(x, y, 2 + k * 10, hex('#ff92db')); break;
    case 'boom': circF(x, y, 4 + k * 18, k < .5 ? WHITE : hex('#ffdb92')); ringF(x, y, 6 + k * 24, hex('#ff9224')); break;
    case 'spark': for (let i = 0; i < 12; i++) { const a = i * .52 + f.t * .1, r = k * 22; pset(x + Math.cos(a) * r, y + Math.sin(a) * r, i & 1 ? hex('#ffdb24') : WHITE); } break;
    case 'rumble': post.shake = f.t < f.n - 2 ? 3 : 0; for (let i = 0; i < 6; i++) rectF(x - 20 + i * 7, y + 10 - (f.t * (i + 2)) % 30, 4, 4, hex('#926d49')); break;
    case 'legacy': for (let i = 0; i < 10; i++) rectF(x - 16 + (i * 7) % 32, y - 16 + ((i * 11 + f.t * 2) % 32), 4, 4, [hex('#9bbc0f'), hex('#306230'), hex('#0f380f')][i % 3]); break;
    case 'steal': text('*', x - 3, y - 10 - f.t / 2, hex('#ffdb24')); break;
    case 'lag': for (let i = 0; i < 5; i++) pset(x - 6 + i * 3, y - (f.t + i * 4) % 16, hex('#b649ff')); break;
    case 'wet': for (let i = 0; i < 10; i++) circF(x - 12 + (i * 5) % 24, y - 14 + ((i * 7 + f.t * 2) % 28), 2, hex('#49b6ff')); break;
    default: circF(x, y, 3 + k * 10, hex('#ffffff'));
  }
}
function drawSummon(sm) {
  const t = sm.t, k = Math.min(1, t / 20);
  rectA(0, 0, W, BWIN, hex('#100020'), .55 * k);
  const s = sm.cr.summon, cy = 60;
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28 + t * .03, r = 30 + Math.sin(t * .1 + i) * 6; pset(160 + Math.cos(a) * r * 2, cy + Math.sin(a) * r, i & 1 ? hex('#ffdb49') : hex('#92dbff')); }
  ctext(sm.cr.name, cy - 12, hex('#ffdb49'), BLACK, 2); ctext(s.name, cy + 14, WHITE, BLACK);
}
function drawBattleUI() {
  // the two windows: foes (left) and the party (right)
  panel(2, BWIN, 108, H - BWIN - 2); panel(108, BWIN, W - 110, H - BWIN - 2);
  const names = {}; for (const f of alive(B.foes)) if (!f.hiddenFoe) names[f.name] = (names[f.name] || 0) + 1;
  Object.keys(names).slice(0, 5).forEach((n, i) => text(n.slice(0, names[n] > 1 ? 13 : 15) + (names[n] > 1 ? ' ' + names[n] : ''), 10, BWIN + 8 + i * 13, WHITE));
  B.party.forEach((u, i) => {
    const y = BWIN + 8 + i * 15, ready = B.readyQ.includes(u) || (B.menu && B.menu.who === u);
    text(u.name.slice(0, 8), 116, y, u.hp <= 0 ? hex('#929292') : ready ? UI.name : u.hp < u.mhp / 4 ? hex('#ffdb49') : WHITE);
    text(String(u.hp).padStart(4) + '/' + String(u.mhp).padStart(4), 168, y, u.hp <= 0 ? hex('#929292') : u.hp < u.mhp / 4 ? hex('#ffdb49') : WHITE);
    text(String(u.mp).padStart(3), 236, y, hex('#92dbff'));
    rectF(262, y + 1, 48, 5, hex('#101830')); rectF(262, y + 1, Math.round(48 * Math.min(1, u.atb / 1000)), 5, u.atb >= 1000 ? hex('#ffdb49') : hex('#6db6ff'));
    if (u.status.lag) text('L', 312 - 8, y - 6, hex('#b649ff'), 0);
  });
  // the open menu
  const m = B.menu;
  if (m) {
    const h = Math.min(m.items.length, m.rows) * 12 + 10, y = Math.min(m.y, H - h - 2); panel(m.x, y, m.w, h);
    if (m.title) { panel(m.x, y - 13, m.title.length * 6 + 10, 14); text(m.title, m.x + 5, y - 10, UI.name); }
    for (let j = 0; j < Math.min(m.rows, m.items.length); j++) {
      const it = m.items[m.top + j], yy = y + 6 + j * 12, sel = m.top + j === m.i; if (!it) continue;
      text(it.t.slice(0, Math.floor((m.w - 40) / 6)), m.x + 14, yy, it.dim ? hex('#6d6d92') : sel ? UI.name : WHITE);
      if (it.r) text(it.r, m.x + m.w - 8 - it.r.length * 6, yy, it.dim ? hex('#6d6d92') : UI.dim);
      if (sel) text('>', m.x + 5, yy, UI.name);
    }
    if (m.top > 0) text('^', m.x + m.w - 10, y + 2, UI.dim); if (m.top + m.rows < m.items.length) text('v', m.x + m.w - 10, y + h - 9, UI.dim);
    if (m.help) { const s = m.help(m.i); if (s) { panel(4, 4, W - 8, 16); text(s, 10, 8, WHITE); } }
  }
  if (B.cursor) for (const t of B.cursor.units) { const cx = t.side === 'p' ? t.x - 12 : t.x + t.w - 2, cy = t.side === 'p' ? t.y + 6 : t.y + t.h / 2 - 4; text('>', cx + ((frame >> 3) & 1) * 2, cy, UI.name, BLACK); if (t.side === 'e' && B.cursor.units.length === 1) { panel(4, 4, t.name.length * 6 + 12, 16); text(t.name, 10, 8, WHITE); } }
  if (B.msg && B.msg.t > 0) { B.msg.t--; const L = wrapT(B.msg.s, 50), w = Math.min(W - 8, Math.max(...L.map(l => l.length)) * 6 + 14), x = ((W - w) / 2) | 0; panel(x, 4, w, 8 + L.length * 10); L.forEach((l, i) => text(l, x + 7, 9 + i * 10, WHITE)); }
  if (B.banner && B.banner.t > 0) { B.banner.t--; ctext(B.banner.s, 40, hex('#ffdb49'), BLACK, 2); ctext('COMBO!', 60, WHITE); }
  if (B.weld) { const w = B.weld; panel(60, 60, 200, 46); text(w.w.name, 70, 66, UI.name); w.w.input.forEach((k, i) => text(({ up: '^', down: 'v', left: '<', right: '>', a: 'A' })[k], 74 + i * 18, 82, i < w.n ? hex('#6dff92') : WHITE, BLACK, 2)); rectF(70, 100, Math.max(0, 180 - w.t * .9), 3, hex('#ff6d24')); }
  if (B.accuse) { const a = B.accuse; panel(60, 54, 200, 56); text('BUILDING THE CASE... (A: ACCUSE)', 66, 60, UI.name); ACCUSE.forEach((c, i) => text((i <= a.lv ? '> ' : '  ') + c.name, 72, 72 + i * 9, i <= a.lv ? WHITE : hex('#6d6d92'))); rectF(170, 76, Math.min(80, (a.t % 70) / 70 * 80), 4, hex('#ffdb49')); }
  if (B.reels) { const R = B.reels; panel(70, 50, 180, 50); text('SEGMENT! (A: STOP)', 80, 56, UI.name); for (let j = 0; j < 3; j++) { panel(78 + j * 56, 68, 52, 24); text(REELS[Math.floor(R.pos[j]) % REELS.length], 84 + j * 56, 76, j < R.k ? UI.name : WHITE); } }
  if (B.results) { panel(40, 30, 240, B.results.lines.length * 12 + 14); B.results.lines.forEach((l, i) => text(l, 52, 38 + i * 12, i === 0 && l === 'VICTORY!' ? UI.name : WHITE)); }
  if (B.runHold > 6) text('RUNNING...', 8, BWIN - 10, WHITE);
  if (B.auto) text('AUTO', W - 34, BWIN - 10, UI.name);
}
// ---------- battle backgrounds (one painting per terrain) ----------
function drawBattleBG(kind) {
  const BG = BATTLEBG[kind] || BATTLEBG.grass; BG();
  if (G && G.world === 2) crushRect(0, 0, W, BWIN); // the corrupted save: everything but the party is four shades
}
const bgHills = (y, c1, c2, amp, ph) => { for (let x = 0; x < W; x++) { const h = y + Math.sin(x * .02 + ph) * amp + Math.sin(x * .07 + ph * 2) * amp * .3; rectF(x, h, 1, BWIN - h, x & 1 ? c1 : c2); } };
const BATTLEBG = {
  grass: () => { skyD(0, 70, '#4992db', '#b6dbff'); bgHills(52, hex('#36924a'), hex('#36924a'), 8, 1); rectF(0, 70, W, BWIN - 70, hex('#49b649')); for (let i = 0; i < 40; i++) pset((i * 53) % W, 72 + (i * 37) % 78, hex('#92db6d')); },
  snow: () => { skyD(0, 70, '#6d6d92', '#dbdbff'); bgHills(40, hex('#b6b6db'), hex('#dbdbff'), 12, 2); for (let x = 0; x < W; x += 24) { const y = 52 + (x * 7) % 12; for (let j = 0; j < 14; j++) rectF(x + 8 - j / 2, y + j, j + 1, 1, hex('#24493a')); } rectF(0, 70, W, BWIN - 70, hex('#ffffff')); for (let i = 0; i < 30; i++) pset((i * 71 + frame / 2) % W, (i * 29 + frame) % 70, WHITE); },
  mine: () => { skyD(0, BWIN, '#1a1008', '#3a2410'); for (let x = 0; x < W; x += 40) { rectF(x + 6, 0, 8, 90, hex('#6d4924')); rectF(x, 20, 40, 6, hex('#6d4924')); } rectF(0, 90, W, BWIN - 90, hex('#5a3a1a')); for (let x = 0; x < W; x += 12) rectF(x, 100, 8, 3, hex('#929292')); for (let i = 0; i < 4; i++) circF(30 + i * 80, 30, 3, (frame >> 3) & 1 ? hex('#ffdb49') : hex('#ff9224')); },
  desert: () => { skyD(0, 70, '#ff9249', '#ffdb92'); circF(250, 26, 14, hex('#ffffdb')); bgHills(56, hex('#c8a05a'), hex('#b6926d'), 10, 3); rectF(0, 70, W, BWIN - 70, hex('#dbb66d')); for (let i = 0; i < 30; i++) pset((i * 61) % W, 74 + (i * 31) % 74, hex('#ffdb92')); },
  castle: () => { rectF(0, 0, W, BWIN, hex('#c8b07a')); for (let y = 0; y < 90; y += 8) for (let x = (y / 8) & 1 ? 8 : 0; x < W; x += 16) frameRect(x, y, 16, 8, hex('#b6926d')); for (const x of [40, 140, 240]) { rectF(x, 10, 24, 50, hex('#db2424')); rectF(x + 2, 12, 20, 46, hex('#922424')); circF(x + 12, 30, 5, WHITE); circF(x + 12, 30, 2, hex('#6dff24')); } rectF(0, 90, W, BWIN - 90, hex('#922424')); rectF(0, 90, W, 2, hex('#ffdb49')); },
  forest: () => { skyD(0, 60, '#246d36', '#92db6d'); for (let x = -10; x < W; x += 28) { rectF(x + 10, 20, 6, 70, hex('#6d4924')); circF(x + 13, 22, 18, hex('#246d36')); circF(x + 8, 18, 9, hex('#36924a')); } rectF(0, 80, W, BWIN - 80, hex('#36924a')); for (let i = 0; i < 30; i++) pset((i * 47) % W, 84 + (i * 23) % 64, hex('#49b649')); },
  town: () => { skyD(0, 60, '#4992db', '#dbdbff'); for (let x = 0; x < W; x += 60) { rectF(x + 6, 30, 46, 40, hex('#dbc892')); rectF(x + 2, 22, 54, 10, hex('#db4949')); rectF(x + 20, 50, 12, 20, hex('#6d4924')); } rectF(0, 70, W, BWIN - 70, hex('#b6a07a')); },
  opera: () => { rectF(0, 0, W, BWIN, hex('#100408')); for (let x = 0; x < W; x += 6) rectF(x, 0, 4, 50 + Math.sin(x * .1) * 6, hex('#922436')); rectF(0, 0, W, 6, hex('#dbb624')); for (const x of [60, 160, 260]) { circF(x, 20, 4, hex('#ffffdb')); } rectF(0, 96, W, BWIN - 96, hex('#926d24')); for (let x = 0; x < W; x += 16) rectF(x, 96, 1, 54, hex('#6d4924')); },
  train: () => { skyD(0, BWIN, '#101024', '#36183a'); for (let i = 0; i < 30; i++) pset((i * 67 - frame * 3) % W + W % W, (i * 13) % 60, hex('#dbdbff')); rectF(0, 70, W, 50, hex('#492449')); for (let x = 0; x < W; x += 50) { rectF(x + 8, 78, 30, 18, hex('#24dbff')); rectF(x + 10, 80, 26, 14, hex('#36183a')); } rectF(0, 120, W, BWIN - 120, hex('#242424')); for (let x = -(frame * 4) % 20; x < W; x += 20) rectF(x, 130, 10, 3, hex('#6d6d6d')); },
  factory: () => { rectF(0, 0, W, BWIN, hex('#dbdbdb')); for (let x = 0; x < W; x += 32) { rectF(x, 0, 4, 100, hex('#929292')); rectF(x, 40, 32, 4, hex('#ff6db6')); } for (let x = -(frame % 16); x < W; x += 16) rectF(x, 104, 10, 6, hex('#6d6d6d')); rectF(0, 110, W, BWIN - 110, hex('#b6b6b6')); },
  spirit: () => { rectF(0, 0, W, BWIN, hex('#000010')); for (let i = 0; i < 50; i++) pset((i * 97) % W, (i * 41) % BWIN, (frame + i * 7) % 40 < 20 ? hex('#92dbff') : hex('#4949b6')); for (let y = 90; y < BWIN; y += 8) rectF(0, y, W, 1, hex('#24246d')); for (let x = 0; x < W; x += 20) lineF(160, 90, x * 2 - 160, BWIN, hex('#24246d')); },
  cloud: () => { skyD(0, BWIN, '#24dbff', '#dbffff'); for (let i = 0; i < 6; i++) { const x = (i * 70 + frame * .2) % 380 - 40; circF(x, 30 + i * 12, 14, WHITE); circF(x + 14, 26 + i * 12, 10, WHITE); } rectF(0, 104, W, BWIN - 104, hex('#9292b6')); for (let x = 0; x < W; x += 20) rectF(x, 104, 16, 2, hex('#dbdbff')); },
  tower: () => { rectF(0, 0, W, BWIN, hex('#000000')); for (let y = 6; y < 96; y += 14) { rectF(40, y, 240, 10, hex('#2449b6')); text(['NEW GAME', 'CONTINUE', 'OPTIONS', 'NEW GAME', 'NEW GAME', 'NEW GAME', 'NEW GAME'][(y / 14) | 0], 60, y + 2, WHITE, 0); if (((frame >> 4) + y) % 5 === 0) text('>', 48, y + 2, hex('#ffdb49'), 0); } rectF(0, 104, W, BWIN - 104, hex('#101024')); },
  void: () => { rectF(0, 0, W, BWIN, hex('#000000')); for (let i = 0; i < 40; i++) rectF((i * 83) % W, (i * 37 + frame) % BWIN, 2, 2, hex('#306230')); },
  sea: () => { skyD(0, 60, '#4992db', '#dbdbff'); rectF(0, 60, W, BWIN - 60, hex('#2470db')); for (let y = 64; y < BWIN; y += 6) for (let x = (frame + y * 3) % 24; x < W; x += 24) rectF(x, y, 8, 1, hex('#92dbff')); },
  plains: () => { skyD(0, 60, '#db9249', '#ffdb92'); bgHills(56, hex('#b6926d'), hex('#c8a05a'), 4, 5); rectF(0, 64, W, BWIN - 64, hex('#92b649')); for (let i = 0; i < 50; i++) lineF((i * 37) % W, 70 + (i * 19) % 78, (i * 37) % W + 1, 66 + (i * 19) % 78, hex('#b6db6d')); },
  ship: () => { skyD(0, BWIN, '#2449b6', '#b6dbff'); for (let i = 0; i < 5; i++) { const x = (i * 80 - frame * 2) % 400 + 400 % 400 - 40; circF(x, 40 + i * 14, 12, WHITE); } rectF(0, 104, W, BWIN - 104, hex('#6d4924')); for (let x = 0; x < W; x += 12) rectF(x, 104, 1, BWIN - 104, hex('#492424')); rectF(0, 100, W, 4, hex('#926d49')); },
};
