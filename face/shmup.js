'use strict';
// ================= FACE: WHAT COULD HAPPEN — the shoot-'em-up engine =================
// A floating head, four ways. POTENTIAL is fuel. BACKUPS are lives, and every restore costs a little of who he was.
const PY = 13; // playfield top; the HUD lives above it
const SH = { t: 0, sx: 0, stage: null, ents: [], pb: [], eb: [], items: [], fx: [], boss: null, ev: 0, hold: 0, view: null, comm: [], cm: null, speed: 1, over: false, paused: false, viewers: 0, alert: 0, adCover: [], noFire: 0, assisted: 0 };
const PLR = { x: 60, y: 118, form: 'new', forms: ['new'], lvl: 1, pot: 30, backups: 3, inv: 0, dead: 0, cd: 0, still: 0, stealth: 0, hands: [{ x: 0, y: 0 }, { x: 0, y: 0 }], integrity: 100, restores: 0, letters: [], locked: 0, drift: null };
const frozen = () => SH.hold > 0 || !!DLG || MENUS.length > 0 || !!CARD || SH.paused;
// a blocking story beat: the whole playfield stops while it runs
function story(fn) { SH.hold++; return run(async () => { try { await fn(); } finally { SH.hold = Math.max(0, SH.hold - 1); } }); }
const dist2 = (ax, ay, bx, by) => (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
const eyeX = () => PLR.x, eyeY = () => PLR.y; // PLR.x/y IS the third eye; the head is drawn around it

// ---------- forms ----------
const FORMS = {
  new: { name: 'NEW FACE', spd: 2.3, cd: 7 },
  old: { name: 'OLD FACE', spd: 1.7, cd: 9 },
  pilot: { name: 'PILOT X', spd: 3.1, cd: 3 },
  dys: { name: 'DYSLEXIO', spd: 2.1, cd: 12 },
};
function pshot(x, y, vx, vy, o = {}) { SH.pb.push(Object.assign({ x, y, vx, vy, dmg: 1, r: 3, k: 'dot', life: 120, t: 0 }, o)); }
function fireForm() {
  const f = PLR.form, x = PLR.x + 8, y = PLR.y + 7, L = PLR.lvl;
  if (f === 'new') {
    for (const ph of [0, Math.PI]) pshot(x, y, 6, 0, { k: 'wave', y0: y, ph, amp: 5 + L * 1.5, dmg: 1 });
    if (L >= 3) pshot(x + 2, y, 7, 0, { k: 'beam', dmg: .8 });
    if (L >= 2) for (const s of [-1, 1]) pshot(x, y, 5.5, s * (L >= 4 ? 1.6 : 1), { k: 'wave', y0: y, ph: 0, amp: 2, dmg: .7, slope: 1 });
    sfx('blip', [1400 + rnd(200), 0]);
  } else if (f === 'old') {
    for (const h of PLR.hands) { pshot(h.x + 6, h.y + 4, 7, 0, { k: 'spark', dmg: 1.4 }); if (L >= 3) pshot(h.x + 6, h.y + 4, 6.5, h.y < PLR.y ? -1 : 1, { k: 'spark', dmg: 1 }); }
    pshot(x, y, 6, 0, { k: 'dot', dmg: 1 }); if (L >= 2) pshot(x, y, 6, 0, { k: 'dot', dmg: 1, y: y - 3 });
    if (L >= 4) for (const s of [-.8, .8]) pshot(x, y, 6, s, { k: 'dot', dmg: .8 });
    sfx('blip', [700 + rnd(100), 0]);
  } else if (f === 'pilot') {
    pshot(x + 4, y - 1, 12, 0, { k: 'laser', dmg: .7, pierce: 1, hit: new Set() });
    if (L >= 2 && SH.t % 2 === 0) pshot(x + 4, y + 4, 12, 0, { k: 'laser', dmg: .5, pierce: 1, hit: new Set() });
    if (L >= 3 && SH.t % 3 === 0) for (const s of [-1.4, 1.4]) pshot(x, y, 11, s, { k: 'laser', dmg: .5, pierce: 1, hit: new Set() });
    if (SH.t % 6 === 0) sfx('blip', [2200, 0]);
  } else if (f === 'dys') {
    pshot(x + 4, y, 4, 0, { k: 'mag', dmg: 2.2 + L * .3, r: 5, home: .35, life: 110 });
    if (L >= 3) for (const s of [-2, 2]) pshot(x, y, 3.5, s, { k: 'mag', dmg: 1.5, r: 4, home: .3, life: 110 });
    sfx('blip', [330, 0]);
  }
}
function swapForm() {
  const F = PLR.forms; if (F.length < 2) return;
  let i = F.indexOf(PLR.form);
  for (let k = 0; k < F.length; k++) { i = (i + 1) % F.length; if (F[i] !== 'dys' || PLR.pot >= 10) break; }
  if (F[i] === PLR.form) return;
  PLR.form = F[i]; sfx('switch'); post.flash = .35; PLR.stealth = 0;
  SH.fx.push({ k: 'txt', x: PLR.x - 20, y: PLR.y - 24, s: FORMS[PLR.form].name, t: 50, c: UI.name });
}
function ideaBomb() {
  if (PLR.pot < 50) { sfx('tick'); SH.fx.push({ k: 'txt', x: PLR.x - 30, y: PLR.y - 22, s: 'NEED 50% POTENTIAL', t: 40, c: UI.dim }); return; }
  PLR.pot -= 50; sfx('get'); sfx('power'); post.flash = .9; SH.shake = 8;
  for (const b of SH.eb) { if (!b.solid) SH.items.push({ k: 'orb', x: b.x, y: b.y, vx: -.5, vy: 0, t: 0 }); }
  SH.eb = SH.eb.filter(b => b.solid);
  for (const e of SH.ents) if (onScreen(e) && !e.benign) hurt(e, e.boss ? 8 : 14, true);
  SH.fx.push({ k: 'bulb', x: PLR.x, y: PLR.y, t: 40 });
  if (SH.stage && SH.stage.ideaLine) comm('FACE', pick(SH.stage.ideaLine), 90);
  else comm('FACE', pick(['What if they were all potential?', 'Everything is potential if you squint.', 'Every bullet is a thing that could have happened.', 'That was an idea. I had it on purpose.']), 90);
}

// ---------- player ----------
function playerUpdate() {
  const F = FORMS[PLR.form];
  if (PLR.dead) { if (--PLR.dead === 0) respawn(); return; }
  if (PLR.inv > 0) PLR.inv--;
  if (PLR.drift) { PLR.x += (PLR.drift[0] - PLR.x) * .03; PLR.y += (PLR.drift[1] - PLR.y) * .03; handsUpdate(false); return; }
  const locked = PLR.locked > 0;
  let dx = locked ? 0 : (held.right ? 1 : 0) - (held.left ? 1 : 0), dy = locked ? 0 : (held.down ? 1 : 0) - (held.up ? 1 : 0);
  if (dx && dy) { dx *= .72; dy *= .72; }
  const v = SH.view;
  PLR.x = clamp(PLR.x + dx * F.spd, v.x0 + 12, v.x1 - 14); PLR.y = clamp(PLR.y + dy * F.spd, v.y0 + 8, v.y1 - 18);
  const firing = !locked && held.a && !SH.noFire;
  if (PLR.cd > 0) PLR.cd--;
  if (firing && PLR.cd <= 0) { fireForm(); PLR.cd = F.cd; }
  PLR.still = firing ? 0 : PLR.still + 1;
  PLR.stealth = PLR.form === 'pilot' && PLR.still > 30 ? 1 : 0;
  if (!locked && pressed.b) ideaBomb();
  if (!locked && pressed.c) swapForm();
  if (PLR.form === 'dys') { PLR.pot = Math.max(0, PLR.pot - .055); if (PLR.pot <= 0) { PLR.form = 'new'; sfx('powerdown'); comm('DYSLEXIO', 'The helmet needs more than this. HOMO BASIC wins by default. It always wins by default.', 120); } }
  handsUpdate(firing);
  if (PLR.form === 'dys') for (const b of SH.eb) { const d = dist2(b.x, b.y, PLR.x, PLR.y); if (d < 34 * 34 && !b.solid) { const k = 1.6 / Math.max(6, Math.sqrt(d)); b.vx += (b.x - PLR.x) * k * .15; b.vy += (b.y - PLR.y) * k * .15; b.bent = 1; } }
}
function handsUpdate(firing) {
  if (PLR.form !== 'old') return;
  const spread = firing ? 16 : 24, fx = firing ? 12 : 4;
  PLR.hands.forEach((h, i) => { const tx = PLR.x + fx, ty = PLR.y + 6 + (i ? spread : -spread) + Math.sin(SH.t * .08 + i * 3) * 2; h.x += (tx - h.x - 6) * .25; h.y += (ty - h.y - 5) * .25; });
  if (!firing) for (const b of SH.eb) for (const h of PLR.hands) if (!b.solid && !b.dead && dist2(b.x, b.y, h.x + 6, h.y + 5) < 64) { b.dead = 1; PLR.pot = Math.min(100, PLR.pot + 1.2); SH.viewers += 2; SH.fx.push({ k: 'spark', x: b.x, y: b.y, t: 10 }); }
}
function killPlayer() {
  if (PLR.inv > 0 || PLR.dead || DBG.god) return;
  sfx('hurt'); boom(PLR.x, PLR.y, 3); SH.shake = 10; post.flash = .6;
  PLR.dead = 80; PLR.backups--; PLR.lvl = Math.max(1, PLR.lvl - 1); PLR.stealth = 0; DBG.deaths = (DBG.deaths || 0) + 1;
  if (PLR.form === 'dys') PLR.form = 'new';
}
function respawn() {
  if (PLR.backups < 0) { story(continueScreen); return; }
  PLR.restores++;
  const loss = Math.min(6, 1 + (PLR.restores >> 2));
  PLR.integrity = Math.max(1, PLR.integrity - loss);
  PLR.x = SH.view.x0 + 40; PLR.y = (SH.view.y0 + SH.view.y1) / 2; PLR.inv = 150; PLR.pot = Math.max(PLR.pot, 20);
  SH.eb = SH.eb.filter(b => dist2(b.x, b.y, PLR.x, PLR.y) > 60 * 60);
  banner('RESTORED FROM BACKUP FACE  ' + PLR.integrity + '%', 120);
  if (PLR.restores % 3 === 1) comm('FACE', restoreLine(), 110);
}
function restoreLine() {
  const I = PLR.integrity;
  if (I > 90) return pick(['Was I just somewhere? I feel like I was just somewhere.', 'Backup. Okay. Still me. Mostly me.', 'Right. Where was I. Literally.']);
  if (I > 70) return pick(['Something is missing. Small. Like a word you know you know.', 'I remember everything except the part I just lost. That\'s how it works.', 'Yoko. What was I doing? ...Right. The machine.']);
  if (I > 45) return pick(['Who was the man with the ship? Green. Nice. I owed him something.', 'I keep restoring. Each one of me is a little less me. The math is fine. The feeling isn\'t.', 'My assistant says I asked that already.']);
  return pick(['I don\'t remember why I started. I remember that I was sure.', 'Hello. I\'m the host. Of... this. Whatever this is.', 'There was a kid. I think I owed him an apology. Or a bathroom.']);
}
async function continueScreen() {
  music('lab'); SH.paused = false;
  const c = await ask('NO BACKUPS LEFT. RESTORE FROM BACKUP FACE? (INTEGRITY ' + PLR.integrity + '% -> ' + Math.max(1, PLR.integrity - 5) + '%)', 'BACKUP FACE', ['RESTORE', 'LET HIM GO']);
  if (c === 0) {
    PLR.integrity = Math.max(1, PLR.integrity - 5); PLR.restores++; PLR.backups = 2; FMETA.continues = (FMETA.continues || 0) + 1; saveFM();
    await say(pick(['Restoration approved. I\'ve noted it in your file.', 'Approved. This is your ' + PLR.restores + 'th restoration. HR likes a round number. This isn\'t one.', 'Restored. Please stop dying on company time.']), 'BACKUP FACE');
    PLR.x = SH.view.x0 + 40; PLR.y = (SH.view.y0 + SH.view.y1) / 2; PLR.inv = 180; PLR.pot = Math.max(PLR.pot, 30);
    SH.eb = []; music(SH.stage.music);
  } else { await say('Understood. I\'ll archive him.', 'BACKUP FACE'); await fadeOut(); run(titleScreen); }
}

// ---------- entities ----------
const onScreen = e => e.x > -40 && e.x < W + 40 && e.y > -40 && e.y < H + 40;
function spawn(k, x, y, o = {}) {
  const T = FOES[k]; if (!T) { console.error('no foe', k); return null; }
  const e = Object.assign({ k, x, y, vx: 0, vy: 0, hp: 1, r: 8, t: 0, pts: 10, inv: 0, fl: 0 }, T.base || {}, o);
  e.maxhp = e.hp; if (T.init) T.init(e); SH.ents.push(e); return e;
}
function entUpdate(e) {
  e.t++; if (e.fl > 0) e.fl--;
  const T = FOES[e.k];
  if (T.upd) T.upd(e); else { e.x += e.vx; e.y += e.vy; }
  if (!e.boss && !e.keep && (e.x < -60 || e.x > W + 90 || e.y < -70 || e.y > H + 70)) e.gone = true;
}
// does a circle at (x,y,r) touch entity e? (circle list, box, or single radius; k shrinks the body for contact)
function hitE(e, x, y, r, k = 1) {
  if (e.box) { const hw = e.box[0] / 2 * k, hh = e.box[1] / 2 * k; return x > e.x - hw - r && x < e.x + hw + r && y > e.y - hh - r && y < e.y + hh + r; }
  if (e.hit) { for (const [ox, oy, hr] of e.hit) if (dist2(x, y, e.x + ox, e.y + oy) < (hr * k + r) * (hr * k + r)) return true; return false; }
  return dist2(x, y, e.x, e.y) < (e.r * k + r) * (e.r * k + r);
}
function hurt(e, d, splash) {
  if (e.gone || e.dying || e.benign || e.inv > 0 || e.immune) return;
  if (e.shield && !splash) { e.fl = 3; sfx('tick'); return; }
  e.hp -= d; e.fl = 4;
  if (e.boss && SH.assisted) { SH.fx.push({ k: 'txt', x: e.x - 20 + rnd(40), y: e.y - 10 + rnd(20), s: 'ASSISTED', t: 30, c: hex('#92ffff') }); e.hp = e.maxhp; return; }
  if (e.hp <= 0) killEnt(e);
}
function killEnt(e) {
  const T = FOES[e.k];
  if (e.boss) { e.dying = 1; e.hp = 0; SH.eb = []; if (T.die) T.die(e); return; }
  e.gone = true; SH.viewers += e.pts; boom(e.x, e.y, e.big ? 2 : 1);
  if (T.die) T.die(e);
  const n = e.drop !== undefined ? e.drop : 1; for (let i = 0; i < n; i++) SH.items.push({ k: 'orb', x: e.x + rnd(9) - 4, y: e.y + rnd(9) - 4, vx: -.3 - Math.random(), vy: Math.random() - .5, t: 0 });
  if (e.item) SH.items.push({ k: e.item, x: e.x, y: e.y, vx: -.6, vy: 0, t: 0, ch: e.ch });
}
function boom(x, y, sz) {
  sfx(sz > 1 ? 'powerdown' : 'land'); if (sz > 1) noiseBoom();
  for (let i = 0; i < 6 + sz * 6; i++) { const a = Math.random() * 6.28, s = .5 + Math.random() * (1.5 + sz); SH.fx.push({ k: 'p', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: 20 + rnd(20), c: pick([hex('#ff24db'), hex('#6dff24'), hex('#ffdb24'), WHITE]) }); }
  SH.fx.push({ k: 'ring', x, y, t: 0, max: 10 + sz * 8 });
}
function noiseBoom() { if (AC) noise(.5, { lp: 900, vol: .6, rate: .5 }); }

// ---------- enemy bullets ----------
function eshot(x, y, vx, vy, o = {}) { if (SH.eb.length > 260) return null; const b = Object.assign({ x, y, vx, vy, r: 2.5, k: 'dot', c: hex('#ff4949'), t: 0 }, o); SH.eb.push(b); return b; }
function aimAt(x, y, spd, off = 0) { const tx = PLR.stealth ? x - 100 : PLR.x, ty = PLR.stealth ? y + (rnd(60) - 30) : PLR.y; const a = Math.atan2(ty - y, tx - x) + off; return [Math.cos(a) * spd, Math.sin(a) * spd]; }
function aim(e, spd, o = {}, off = 0) { const [vx, vy] = aimAt(e.x, e.y, spd, off); return eshot(e.x, e.y, vx, vy, o); }
function ring(e, n, spd, o = {}, off = 0) { for (let i = 0; i < n; i++) { const a = off + i / n * 6.2832; eshot(e.x, e.y, Math.cos(a) * spd, Math.sin(a) * spd, Object.assign({}, o)); } }
function fan(e, n, spd, spread, o = {}) { for (let i = 0; i < n; i++) aim(e, spd, Object.assign({}, o), (i - (n - 1) / 2) * spread); }

// ---------- per-frame ----------
function shUpdate() {
  shakeTick(); // before the freeze check: a shake that starts right before a story scene must still wear off
  if (frozen()) return;
  if (post.flash > 0) post.flash = Math.max(0, post.flash - .06);
  SH.t++; SH.sx += SH.speed;
  const evs = SH.stage.events;
  while (SH.ev < evs.length && evs[SH.ev][0] <= SH.t) { const ev = evs[SH.ev++]; ev[1](); if (frozen()) return; }
  playerUpdate();
  for (let i = 0; i < SH.ents.length; i++) entUpdate(SH.ents[i]);
  // player bullets
  for (const b of SH.pb) {
    b.t++;
    if (b.k === 'wave') { b.x += b.vx; b.y = b.y0 + Math.sin(b.t * .35 + b.ph) * b.amp + (b.slope ? b.vy * b.t : 0); }
    else if (b.home) { let best = null, bd = 1e9; for (const e of SH.ents) { if (e.benign || e.dying || !onScreen(e)) continue; const d = dist2(e.x, e.y, b.x, b.y); if (d < bd && e.x > b.x - 10) { bd = d; best = e; } } if (best) { const a = Math.atan2(best.y - b.y, best.x - b.x); b.vx += Math.cos(a) * b.home; b.vy += Math.sin(a) * b.home; const s = Math.hypot(b.vx, b.vy); if (s > 5) { b.vx *= 5 / s; b.vy *= 5 / s; } } b.x += b.vx; b.y += b.vy; }
    else { b.x += b.vx; b.y += b.vy; }
    if (--b.life <= 0 || b.x > SH.view.x1 + 8 || b.x < -10 || b.y < PY - 8 || b.y > H + 8) b.dead = 1;
  }
  // collisions: player bullets -> enemies
  for (const e of SH.ents) {
    if (e.gone || e.dying || e.benign || e.ghost || !onScreen(e)) continue;
    for (const b of SH.pb) {
      if (b.dead) continue;
      if (b.pierce && b.hit.has(e)) continue;
      if (!hitE(e, b.x, b.y, b.r)) continue;
      if (b.k === 'mag' && e.word && FOES[e.k].scramble) { FOES[e.k].scramble(e); b.dead = 1; continue; }
      const W8 = FOES[e.k].weak; if (W8 && !W8(b, e)) { b.dead = 1; e.fl = 2; sfx('tick'); continue; }
      hurt(e, b.dmg); SH.viewers++;
      if (b.pierce) b.hit.add(e); else b.dead = 1;
      SH.fx.push({ k: 'spark', x: b.x, y: b.y, t: 6 });
    }
  }
  SH.pb = SH.pb.filter(b => !b.dead);
  // enemy bullets
  const hx = eyeX(), hy = eyeY();
  for (const b of SH.eb) {
    b.t++;
    if (b.upd) b.upd(b); else { b.x += b.vx; b.y += b.vy; }
    if (b.x < -20 || b.x > W + 30 || b.y < PY - 20 || b.y > H + 20 || (b.life && b.t > b.life)) b.dead = 1;
    if (!b.dead && !PLR.dead && dist2(b.x, b.y, hx, hy) < (b.r + 1.5) * (b.r + 1.5)) { b.dead = 1; killPlayer(); }
  }
  SH.eb = SH.eb.filter(b => !b.dead);
  // enemy bodies
  if (!PLR.dead) for (const e of SH.ents) if (!e.gone && !e.dying && !e.benign && !e.ghost && !e.harmless && hitE(e, hx, hy, 1, .75)) { killPlayer(); break; }
  // items
  for (const it of SH.items) {
    it.t++;
    const d = dist2(it.x, it.y, PLR.x, PLR.y + 4), mag = PLR.form === 'old' ? 70 : 42;
    if (!PLR.dead && d < mag * mag && it.k !== 'letter') { const a = Math.atan2(PLR.y + 4 - it.y, PLR.x - it.x); it.vx += Math.cos(a) * .6; it.vy += Math.sin(a) * .6; }
    else { it.vx = it.vx * .96 - .04; it.vy *= .96; }
    it.x += it.vx; it.y += it.vy;
    if (!PLR.dead && d < 14 * 14) { collect(it); it.dead = 1; }
    if (it.x < -12 || it.t > 900) it.dead = 1;
  }
  SH.items = SH.items.filter(i => !i.dead);
  SH.ents = SH.ents.filter(e => !e.gone);
  for (const f of SH.fx) { f.t--; if (f.vx !== undefined) { f.x += f.vx; f.y += f.vy; f.vx *= .95; f.vy *= .95; } if (f.k === 'ring') f.t2 = (f.t2 || 0) + 1; }
  SH.fx = SH.fx.filter(f => f.k === 'ring' ? (f.t2 || 0) < 16 : f.t > 0);
  if (SH.stage.tick) SH.stage.tick();
  commUpdate();
}
function shakeTick() { if (SH.shake > 0) SH.shake--; post.shake = SH.shake > 0 ? Math.min(4, SH.shake >> 1) : 0; }
function calm() { SH.shake = 0; post.shake = 0; }
function collect(it) {
  if (it.k === 'orb') { PLR.pot = Math.min(100, PLR.pot + 2); SH.viewers += 1; if (SH.t % 3 === 0) sfx('blip', [1800, 300]); }
  else if (it.k === 'bulb') { PLR.lvl = Math.min(4, PLR.lvl + 1); sfx('get'); SH.fx.push({ k: 'txt', x: PLR.x - 20, y: PLR.y - 24, s: PLR.lvl >= 4 ? 'IDEA: MAX' : 'IDEA LV' + PLR.lvl, t: 50, c: hex('#ffdb24') }); if (PLR.lvl === 2 && !FMETA.bulbTip) { FMETA.bulbTip = 1; saveFM(); comm('FACE', 'An idea. A lightbulb. That\'s not how ideas work. I\'m keeping it.', 100); } }
  else if (it.k === 'backup') { PLR.backups++; sfx('get'); banner('+1 BACKUP', 60); }
  else if (it.k === 'letter') { if (!PLR.letters.includes(it.ch)) PLR.letters.push(it.ch); sfx('object'); banner('A LETTER: "' + it.ch + '"  (' + PLR.letters.length + '/8)', 120); SH.viewers += 500; }
}

// ---------- comms: non-blocking transmissions (the stage keeps going) ----------
function comm(who, text, dur) { SH.comm.push({ who, text: String(text).toUpperCase(), dur: dur || Math.max(110, text.length * 3.2) }); }
function commUpdate() {
  if (!SH.cm && SH.comm.length) { SH.cm = SH.comm.shift(); SH.cm.t = 0; }
  if (!SH.cm) return;
  const c = SH.cm; c.t++;
  const n = Math.min(c.text.length, c.t * 1.2 | 0), v = VOICE[c.who] || VOICE._;
  if (n > (c.last || 0) && n % 3 === 0 && c.text[n] !== ' ') sfx('blip', v); c.last = n;
  if (c.t > c.dur + c.text.length / 1.2) SH.cm = null;
}
function drawComm() {
  const c = SH.cm; if (!c) return;
  const y = H - 54, p = PORT[c.who];
  rectA(2, y, W - 4, 52, hex('#000018'), .72); frameRect(2, y, W - 4, 52, hex('#ff24db')); frameRect(3, y + 1, W - 6, 50, hex('#240049'));
  if (p) { draw(p.s, 4, y + 2, p.P); frameRect(4, y + 2, 48, 48, hex('#ff24db')); }
  const n = Math.min(c.text.length, c.t * 1.2 | 0), lines = wrapT(c.text.slice(0, n), 42);
  text(c.who, 58, y + 4, hex('#6dff24'), 0);
  lines.slice(0, 3).forEach((l, i) => text(l, 58, y + 15 + i * 11, WHITE, BLACK));
  if ((frame >> 3) & 1) { rectF(W - 12, y + 4, 5, 5, hex('#ff2424')); }
}

// ---------- drawing ----------
const BPAL = { wave: [hex('#6dff24'), hex('#ffffff')], beam: [hex('#ff24db'), hex('#ffb6ff')], spark: [hex('#6dff24'), hex('#ffdb24')], dot: [hex('#24dbff'), WHITE], laser: [hex('#dbff24'), WHITE], mag: [hex('#ff4992'), hex('#ffdb24')] };
function drawPlayerBullets() {
  for (const b of SH.pb) {
    const [c1, c2] = BPAL[b.k] || BPAL.dot, x = b.x | 0, y = b.y | 0;
    if (b.k === 'wave') { rectF(x - 3, y - 1, 6, 3, c1); rectF(x - 1, y, 3, 1, c2); }
    else if (b.k === 'beam') { rectF(x - 6, y - 1, 12, 2, c1); rectF(x - 4, y, 8, 1, c2); }
    else if (b.k === 'laser') { rectF(x - 10, y, 14, 1, c1); rectF(x - 3, y, 5, 1, c2); }
    else if (b.k === 'mag') { ringF(x, y, 4 + ((SH.t >> 1) & 1), c1); ringF(x, y, 2, c2); }
    else if (b.k === 'spark') { rectF(x - 2, y - 1, 5, 3, c1); pset(x, y, c2); }
    else { circF(x, y, 2, c1); pset(x, y, c2); }
  }
}
function drawEnemyBullets() {
  for (const b of SH.eb) {
    const x = b.x | 0, y = b.y | 0;
    if (b.draw) { b.draw(b, x, y); continue; }
    if (b.k === 'pill') { rectF(x - 3, y - 1, 3, 3, hex('#ff2424')); rectF(x, y - 1, 3, 3, WHITE); frameRect(x - 4, y - 2, 8, 5, BLACK); }
    else if (b.k === 'coupon') { rectF(x - 4, y - 3, 9, 6, hex('#ffdb24')); rectF(x - 3, y - 2, 7, 4, hex('#fff0a0')); text('%', x - 2, y - 3, hex('#b60000'), 0); }
    else if (b.k === 'squig') { for (let i = -4; i <= 4; i++) pset(x + i, y + ((i + (b.t >> 2)) & 1 ? 1 : -1), hex('#ff2424')); pset(x, y, WHITE); }
    else if (b.k === 'letter') { rectF(x - 4, y - 5, 9, 10, hex('#240024')); frameRect(x - 4, y - 5, 9, 10, hex('#ffdb24')); text(b.ch, x - 2, y - 3, hex('#ffdb24'), 0); }
    else if (b.k === 'sigil') { ringF(x, y, 4, b.c); lineF(x - 3, y, x + 3, y, b.c); lineF(x, y - 3, x, y + 3, b.c); pset(x, y, WHITE); }
    else if (b.k === 'note') { circF(x, y + 2, 2, b.c); rectF(x + 2, y - 4, 1, 6, b.c); rectF(x + 2, y - 4, 3, 1, b.c); }
    else if (b.k === 'big') { circF(x, y, b.r, b.c); circF(x, y, b.r - 2, WHITE); circF(x, y, b.r - 3, b.c); }
    else { circF(x, y, b.r, b.bent ? hex('#ff4992') : b.c); circF(x, y, Math.max(0, b.r - 1.5), WHITE); }
  }
}
function drawPlayer() {
  if (PLR.dead) return;
  if (PLR.inv > 0 && (PLR.inv >> 2) & 1) return;
  const A = FORMART[PLR.form], sx = Math.round(PLR.x - A.eye[0]), sy = Math.round(PLR.y - A.eye[1]);
  // afterimages: the other faces trailing behind
  if (PLR.form === 'new' || PLR.form === 'dys') for (let k = 3; k >= 1; k--) { const s = A.s(frame); for (let j = 0; j < s.h; j += 2) for (let i = 0; i < s.w; i += 2) if (s.d[j * s.w + i]) pset(sx - k * 6 + i, sy + j, k === 1 ? hex('#920092') : hex('#490049')); }
  if (PLR.form === 'old') for (const h of PLR.hands) draw(FS.hand[(SH.t >> 3) & 1], h.x, h.y, FP.oldHand);
  if (PLR.stealth) { const s = A.s(frame); for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const c = s.d[j * s.w + i]; if (c && (i + j + (frame >> 1)) & 1) pset(sx + i, sy + j, A.P[c]); } if ((frame >> 4) & 1) text('INCOGNITO', sx - 14, sy - 10, hex('#dbff24'), 0); }
  else draw(A.s(frame), sx, sy, A.P);
  if (PLR.form === 'pilot') { rectF(sx - 6 - rnd(4), sy + 14, 6, 2, hex('#dbff24')); }
  const pulse = (frame >> 3) & 1; rectF(PLR.x - 1, PLR.y - 1, 3, 3, pulse ? hex('#6dff24') : WHITE);
}
function drawItems() {
  for (const it of SH.items) {
    const x = it.x | 0, y = it.y | 0;
    if (it.k === 'orb') draw(FS.orb[((it.t >> 3) + (x & 1)) & 3], x - 3, y - 3, FP.item);
    else if (it.k === 'bulb') draw(FS.bulb[(it.t >> 4) & 1], x - 6, y - 7, FP.item);
    else if (it.k === 'backup') draw(FS.backup, x - 6, y - 6, FP.item);
    else if (it.k === 'letter') { rectF(x - 6, y - 7, 13, 14, (it.t >> 3) & 1 ? hex('#ffdb24') : hex('#ff24db')); rectF(x - 5, y - 6, 11, 12, hex('#240024')); text(it.ch, x - 2, y - 3, hex('#ffdb24'), 0); }
  }
}
function drawFx() {
  for (const f of SH.fx) {
    if (f.k === 'p') pset(f.x, f.y, f.c);
    else if (f.k === 'spark') { pset(f.x, f.y, WHITE); pset(f.x + 1, f.y, hex('#ffdb24')); }
    else if (f.k === 'ring') ringF(f.x, f.y, (f.t2 / 16) * f.max, (f.t2 >> 1) & 1 ? WHITE : hex('#ff24db'));
    else if (f.k === 'txt') text(f.s, f.x, f.y - (50 - f.t) * .3, f.c, BLACK);
    else if (f.k === 'bulb') { const r = (40 - f.t) * 6; ringF(f.x, f.y, r, hex('#ffdb24')); ringF(f.x, f.y, r * .7, WHITE); }
  }
}
function drawHUD() {
  rectF(0, 0, W, PY, hex('#000012')); rectF(0, PY - 1, W, 1, hex('#ff24db'));
  text('VIEWERS ' + String(SH.viewers).padStart(7, '0'), 3, 3, WHITE, 0);
  const px = 118; text('POT', px, 3, hex('#6dff24'), 0); frameRect(px + 20, 3, 62, 7, hex('#6dff24'));
  rectF(px + 21, 4, Math.round(PLR.pot * .6), 5, PLR.pot >= 50 ? ((frame >> 3) & 1 ? hex('#6dff24') : hex('#dbff24')) : hex('#24b600'));
  if (PLR.pot >= 50) text('B', px + 85, 3, hex('#ffdb24'), 0);
  const fx = 214; text(FORMS[PLR.form].name, fx, 3, PLR.form === 'old' ? hex('#9bbc0f') : PLR.form === 'pilot' ? hex('#dbff24') : PLR.form === 'dys' ? hex('#ff4992') : hex('#ff24db'), 0);
  for (let i = 0; i < Math.min(6, Math.max(0, PLR.backups)); i++) { const x = W - 8 - i * 7; rectF(x, 3, 5, 6, hex('#ff24db')); rectF(x + 1, 4, 3, 4, hex('#000024')); pset(x + 2, 5, hex('#6dff24')); }
  if (PLR.backups > 6) text('+', W - 52, 3, WHITE, 0);
}
function drawBossBar() {
  const b = SH.boss; if (!b || b.gone) return;
  const w = 200, x = (W - w) / 2, y = PY + 3;
  rectA(x - 2, y - 1, w + 4, 11, BLACK, .6); text(b.name, x, y, hex('#ffdb24'), BLACK);
  const bw = w - b.name.length * 6 - 8, bx = x + b.name.length * 6 + 6; frameRect(bx, y + 1, bw, 6, WHITE);
  const k = SH.assisted ? 1 : Math.max(0, b.hp / b.maxhp); rectF(bx + 1, y + 2, Math.round((bw - 2) * k), 4, SH.assisted ? hex('#92ffff') : (b.fl ? WHITE : hex('#ff2449')));
  if (SH.assisted) text('∞', bx + bw + 3, y, WHITE, 0);
}
function drawMask() {
  const v = SH.view; if (v.x0 <= 0 && v.x1 >= W && v.y0 <= PY && v.y1 >= H) return;
  rectF(0, PY, W, v.y0 - PY, BLACK); rectF(0, v.y1, W, H - v.y1, BLACK); rectF(0, v.y0, v.x0, v.y1 - v.y0, BLACK); rectF(v.x1, v.y0, W - v.x1, v.y1 - v.y0, BLACK);
  frameRect(v.x0 - 1, v.y0 - 1, v.x1 - v.x0 + 2, v.y1 - v.y0 + 2, hex('#ff24db')); frameRect(v.x0 - 3, v.y0 - 3, v.x1 - v.x0 + 6, v.y1 - v.y0 + 6, hex('#920092'));
}
function shDraw() {
  SH.stage.bg(SH);
  drawItems();
  for (const e of SH.ents) { if (e.under) FOES[e.k].draw(e); }
  for (const e of SH.ents) { if (!e.under && onScreen(e)) FOES[e.k].draw(e); }
  drawPlayerBullets(); drawPlayer(); drawEnemyBullets(); drawFx();
  if (SH.stage.over) SH.stage.over(SH);
  drawMask(); drawHUD(); drawBossBar(); drawComm();
}
// sprite drawn white when hit
function drawE(e, s, x, y, P, flip) { draw(s, Math.round(x), Math.round(y), P, flip, e && e.fl > 0 && (e.fl & 1) ? WHITE : 0); }
const shScene = { update: shUpdate, draw: shDraw };
