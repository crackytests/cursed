'use strict';
// ================= ROMANCING STREAM: the field. state, parchment UI, the world map, towns, shops, dungeons, the menu =================
let GS = null, HOOK = 0, MAPSEL = null;               // the save: hero, party, chars, gold, bag, battle rank, event rank, flags, map
const RSSAVE = 'rso_save', RSMETA = 'rso_meta', SAVEV = 2;
const HSPR = {};             // baked hero frames
const TOWNIES = [];          // baked townsfolk
function bakeHero(id) { if (HSPR[id]) return HSPR[id]; const h = CAST(id), P = h.poses === 'ghost' ? GHOST_POSES : PERSON_POSES, o = { w: 52, h: 56, ay: 50 }, r = {}; for (const a of ['idle', 'walk', 'attack', 'shoot', 'cast', 'hurt', 'down', 'win']) r[a] = rsBake(h.rig, P[a], o); return HSPR[id] = r; }
const EQSLOTS = ['wpn', 'head', 'body', 'hands', 'feet', 'shield', 'acc'];
const EQNAME = { wpn: 'WEAPON', head: 'HEAD', body: 'BODY', hands: 'HANDS', feet: 'FEET', shield: 'SHIELD', acc: 'EXTRA' };
function newChar(id) { const D = CHARS[id], c = { id, hp: D.hp, mhp: D.hp, wp: D.wp, mwp: D.wp, jp: D.jp, mjp: D.jp, str: D.str, agi: D.agi, int: D.int, wpn: D.wpn, eq: Object.assign({ head: null, body: null, hands: null, feet: null, shield: null, acc: null }, D.eq || {}), st: {}, sk: {}, techs: [], spells: D.spells.slice(), sch: {} }; c.eq.wpn = null; c.sk[D.t] = { lv: 1, xp: 0 }; for (const s of D.spells) c.sch[SPELLS[s][0]] = c.sch[SPELLS[s][0]] || { lv: 1, xp: 0 }; return c; }
function newGameState(hero) { const O = ORIGINS[hero], g = { v: SAVEV, hero, party: [hero], C: {}, gold: 200, bag: { TONIC: 4, 'HOT POCKET': 1 }, br: 0, er: 0, form: 'STANDARD', forms: ['STANDARD'], ship: { un: 0 }, stash: {}, quests: {}, titles: [], flags: {}, open: {}, carts: [], loc: O.place, rumor: {}, battles: 0, steps: 0 }; for (const id in CHARS) g.C[id] = newChar(id); for (const p of O.open) g.open[p] = 1; return g; }
// old saves (v1: one armor slot, no event rank) become v2 in place
function migrateGS(g) {
  if (!g || g.v === SAVEV) return g;
  g.v = SAVEV; g.er = g.er || 0; g.form = g.form || 'STANDARD'; g.forms = g.forms || ['STANDARD']; g.ship = g.ship || { un: 0 }; g.stash = g.stash || {}; g.quests = g.quests || {}; g.titles = g.titles || [];
  for (const id in g.C) { const c = g.C[id]; if (!c.eq) { c.eq = { wpn: null, head: null, body: c.arm || null, hands: null, feet: null, shield: null, acc: c.acc || null }; delete c.arm; delete c.acc; } if (!c.st) c.st = {}; }
  return g;
}
const cName = id => CAST(id).name;
const PC = id => GS.C[id];
const wType = c => ITEMS[c.wpn].t;
const eqOf = (c, s) => (c.eq[s] && ITEMS[c.eq[s]]) || {};
const accOf = c => eqOf(c, 'acc');
const cStr = c => c.str + (eqOf(c, 'hands').str || 0) + (accOf(c).str || 0), cAgi = c => c.agi + (eqOf(c, 'feet').agi || 0) + (accOf(c).agi || 0) + (FORMS[GS.form].agi || 0), cInt = c => c.int + (accOf(c).int || 0);
function cDef(c) { let d = 0; for (const s of EQSLOTS) d += eqOf(c, s).def || 0; d += FORMS[GS.form].def || 0; if (GS.carts.includes('STILL HERE')) d += 2; return d; }
const skLv = c => (c.sk[wType(c)] || { lv: 0 }).lv;
function techList(c) { const t = wType(c); return TECHS[t].filter(T => T[1] === 0 || c.techs.includes(T[0])).concat(GS.flags.genmanual ? [PANEL_WHACK] : []); }
function bagAdd(n, k = 1) { if (!ITEMS[n] || ITEMS[n].k !== 'use') { GS.bag[n] = (GS.bag[n] || 0) + k; if (GS.bag[n] <= 0) delete GS.bag[n]; return true; } if (k > 0 && (GS.bag[n] || 0) + k > BAGMAX) { const room = Math.max(0, BAGMAX - (GS.bag[n] || 0)); if (!room) return false; GS.bag[n] = BAGMAX; if (GS.stash) GS.stash[n] = (GS.stash[n] || 0) + (k - room); banner('BAG FULL: ' + (k - room) + ' ' + n + ' TO STASH'); return true; } GS.bag[n] = (GS.bag[n] || 0) + k; if (GS.bag[n] <= 0) delete GS.bag[n]; return true; }
const bagRoom = n => !ITEMS[n] || ITEMS[n].k !== 'use' ? 99 : BAGMAX - (GS.bag[n] || 0);
function saveGame() { store(RSSAVE, GS); }
// event rank: the world also moves when you DO things, not only when you fight
function erUp(n = 1) { GS.er += n; }
// cartridge passives, resolved on the spot
const cartHas = n => GS.carts.includes(n);
const shopPrice = n => Math.max(1, Math.round(ITEMS[n].p * (cartHas('NIGHT OF THE MALL') ? .9 : 1) * (GS.titles.includes('FIXER') || GS.titles.includes('CLOSER') ? .9 : 1)));
// ---------------- parchment UI (replaces the engine's blue windows) ----------------
const PAPER = rgb(255, 255, 219), PAPER2 = rgb(219, 182, 146), SEPIA = rgb(66, 40, 28), RUST = rgb(150, 56, 36), FADED = rgb(140, 112, 84), GOLDC = rgb(182, 128, 36);
// the 9-bit palette has no cream, so paper is dithered between two neighbors (like everything the HYPER-32 prerenders)
function paperFill(x, y, w, h, r, g, b) { for (let j = Math.max(0, y); j < Math.min(H, y + h); j++) { const row = j * W; for (let i = Math.max(0, x); i < Math.min(W, x + w); i++) { const q = RSQ[((j & 3) << 2) | (i & 3)]; FB[row + i] = ((255 << 24) | (q[(b + 128) | 0] << 16) | (q[(g + 128) | 0] << 8) | q[(r + 128) | 0]) >>> 0; } } }
function panel(x, y, w, h) {
  for (let j = 0; j < h; j += 4) { const k = j / h; paperFill(x, y + j, w, Math.min(4, h - j), 244 - k * 14, 232 - k * 20, 204 - k * 30); }
  frameRect(x, y, w, h, SEPIA); frameRect(x + 2, y + 2, w - 4, h - 4, mix(SEPIA, PAPER, .55)); pset(x, y, 0); pset(x + w - 1, y, 0); pset(x, y + h - 1, 0); pset(x + w - 1, y + h - 1, 0);
}
const ink = (s, x, y, c = SEPIA) => text(s, x, y, c, 0);
function drawPortrait(p, x, y) { if (p.img) { for (let j = 0; j < 48; j++) for (let i = 0; i < 48; i++) { const c = p.img.px[(j + 6) * p.img.w + i + 6]; if (c) FB[(y + j) * W + x + i] = c; } } }
function drawOverlay() {
  if (CARD) { if (CARD.bg === PAPER) paperFill(0, 0, W, H, 244, 232, 204); else cls(CARD.bg); const y0 = ((H - CARD.lines.length * 12 * CARD.sc) / 2) | 0; CARD.lines.forEach((l, i) => ctext(l, y0 + i * 12 * CARD.sc, CARD.fg, CARD.bg === BLACK ? BLACK : 0, CARD.sc)); }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = BANNER.s.length * 6 + 20; panel(((W - w) / 2) | 0, 10, w, 18); text(BANNER.s, ((W - BANNER.s.length * 6) / 2) | 0, 16, RUST, 0); }
  if (DLG) {
    const y = H - 68; panel(4, y, W - 8, 64); let tx = 14;
    if (DLG.hasP) { const p = DLG.port || PORT[DLG.who]; rectF(9, y + 7, 50, 50, PAPER2); drawPortrait(p, 10, y + 8); frameRect(9, y + 7, 50, 50, SEPIA); tx = 68; }
    if (DLG.who) { const w = DLG.who.length * 6 + 12; panel(tx - 6, y - 12, w, 15); ink(DLG.who, tx, y - 8, RUST); }
    let n = DLG.n | 0; DLG.lines.forEach((l, i) => { ink(l.slice(0, Math.max(0, n)), tx, y + 10 + i * 12); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) ink('v', W - 20, H - 16, RUST);
  }
  for (const m of MENUS) {
    panel(m.x, m.y, m.w, m.h); const rows = Math.min(m.opts.length, m.rows);
    for (let r = 0; r < rows; r++) { const i = m.top + r, s = m.opts[i], on = i === m.i, dis = m.dis && m.dis(i); ink(s, m.x + 14, m.y + 7 + r * 12, dis ? FADED : on ? RUST : SEPIA); if (on) ink('>', m.x + 6, m.y + 7 + r * 12, RUST); }
    if (m.top > 0) ink('^', m.x + m.w - 10, m.y + 4, RUST); if (m.top + rows < m.opts.length) ink('v', m.x + m.w - 10, m.y + m.h - 11, RUST);
    if (m.info) { const s = m.info(m.i); if (s) { const L = wrapT(s, 48), w = Math.max(m.w, Math.max(...L.map(l => l.length)) * 6 + 14), h = L.length * 10 + 8, x = clamp(m.x, 4, W - w - 4), y = m.y + m.h + h + 2 > 170 ? m.y - h - 2 : m.y + m.h + 2; panel(x, y, w, h); L.forEach((l, k) => ink(l, x + 7, y + 5 + k * 10)); } }
  }
}
// choose with scrolling, disabled rows and a help line. returns index or -1 (C cancels when o.cancel)
async function choose(opts, o = {}) {
  const rows = Math.min(opts.length, o.rows || 12), w = o.w || Math.max(...opts.map(s => s.length)) * 6 + 28, h = rows * 12 + 10;
  const m = { opts, i: o.i || 0, top: 0, rows, x: o.x !== undefined ? o.x : W - w - 8, y: o.y !== undefined ? o.y : (DLG ? H - 72 - h : H - h - 8), w, h, info: o.info, dis: o.dis };
  MENUS.push(m); await nextFrame();
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (m.i < m.top) m.top = m.i; if (m.i >= m.top + rows) m.top = m.i - rows + 1;
    if (o.onMove) o.onMove(m.i);
    // the engine's rule: Z and X both confirm, C goes back
    if (pressed.a || pressed.b) { if (m.dis && m.dis(m.i)) sfx('hurt'); else { sfx('ok'); break; } }
    if (pressed.c && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame();
  }
  MENUS.splice(MENUS.indexOf(m), 1); return m.i;
}
// a card covers the whole screen, so it is shown even when the scene behind it is faded out (the engine's version
// drew cards under the fade: black screens you had to press through). the fade comes back when the card goes.
async function showCard(lines, t, o = {}) {
  const fade = post.fade; post.fade = 0; CARD = { lines, bg: o.bg || BLACK, fg: o.fg || WHITE, sc: o.sc || 1 };
  if (t) await readWait(t, cardChars(lines)); else await waitBtn();
  if (!o.keep) { CARD = null; post.fade = fade; }
}
// faces for people who are not in the cast: the townsfolk you can see on screen, or (for anyone named only in a line
// of dialogue) a townsperson picked from their name, so the same name always has the same face
let SHOPKEEP = 1;
const TFPORT = {};
function townPort(i) { return TFPORT[i] || (TFPORT[i] = { img: paintPortrait('tf' + i, townsfolk(i), PERSON_POSES.idle[0]) }); }
const NOFACE = new Set(['A VOICE', 'LOOKOUT', '']);
function say(s, who, o = {}) {
  if (who && !(who in PORT) && !NOFACE.has(who)) { let h = 0; for (const ch of who) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const i = 6 + h % 12; Object.defineProperty(PORT, who, { configurable: true, get: () => townPort(i) }); }
  const p = SAYQ.then(() => say1(s, who, o)); SAYQ = p.catch(() => {}); return p;
}
async function sayAll(lines) { for (const [who, s] of lines) await say(s, who); }
// ---------------- the world map ----------------
const MAPICON = { town: [rgb(170, 60, 40), 4], dungeon: [rgb(60, 40, 30), 3] };
async function toMap(at) {
  if (at) GS.loc = at; FIELD = null; await worldTick(); music('rsmap'); const img = paintWorldMap(); let t = 0, sel = GS.loc, done = false;
  const opens = () => Object.keys(PLACES).filter(k => GS.open[k]);
  scene = {
    update() { t++; },
    draw() {
      blitPaint(img);
      const P = PLACES[sel], f = bakeHero(GS.party[0]).idle[(t >> 5) & 1]; rsDraw(f, P.at[0], P.at[1] - 3 + ((t >> 4) & 1), false, 0, .7);
      ringF(P.at[0], P.at[1], 6 + ((t >> 3) & 3), RUST);
      // places are drawn over the leader so nearby ones stay visible
      for (const k of opens()) { const P = PLACES[k], [x, y] = P.at, [c, r] = MAPICON[P.kind], dn = P.cart && GS.carts.includes(P.cart), job = QUESTS.some(q => q.at === k && qGet(q.id).s === 1);
        if (P.kind === 'town') { rectF(x - 3, y - 2, 7, 5, c); triF(x - 4, y - 2, x + 4, y - 2, x, y - 6, c); if (P.port) { lineF(x - 5, y + 6, x + 5, y + 6, rgb(60, 110, 130)); ink('~', x - 6, y + 3, FADED); } }
        else if (dn) { lineF(x - 3, y, x + 3, y, GOLDC); lineF(x, y - 3, x, y + 3, GOLDC); }
        else { lineF(x - 3, y - 3, x + 3, y + 3, c); lineF(x - 3, y + 3, x + 3, y - 3, c); } if (job) { ringF(x, y, 8, GOLDC); ink('!', x + 4, y - 8, GOLDC); } }
      panel(4, 4, W - 8, 15); ink('RANK ' + GS.br + '  ER ' + GS.er + '  ' + GS.gold + 'G', 10, 8); ink(P.name, W - 10 - P.name.length * 6, 8, RUST);
      ink('ARROWS: MOVE   Z: GO   C: BACK   ! JOB' + (P.port ? '   X: SAIL' : '') + '   ENTER: MENU', 8, 214, FADED);
    } };
  run(() => fadeIn(.08)); // we arrive here faded out from a town or dungeon
  await nextFrame();
  while (!done) {
    const P = PLACES[sel]; MAPSEL = sel;
    for (const d of ['left', 'right', 'up', 'down']) if (pressed[d]) {
      const dx = d === 'left' ? -1 : d === 'right' ? 1 : 0, dy = d === 'up' ? -1 : d === 'down' ? 1 : 0; let best = null, bs = 1e9;
      for (const k of opens()) { if (k === sel) continue; const Q = PLACES[k], vx = Q.at[0] - P.at[0], vy = Q.at[1] - P.at[1], along = vx * dx + vy * dy; if (along <= 0) continue; const s = Math.hypot(vx, vy) + Math.abs(vx * dy - vy * dx) * 1.5; if (s < bs) { bs = s; best = k; } }
      if (best) { sel = best; sfx('move'); }
    }
    if (pressed.b && P.port) { sfx('ok'); if (await sailMenu(sel)) return; } // sailing leaves the map: stop reading its input
    if (pressed.a) { sfx('ok'); done = true; GS.loc = sel; await fadeOut(.08); return enterPlace(sel); }
    if (pressed.c) { sfx('tick'); done = true; await fadeOut(.08); return enterPlace(GS.loc); }
    if (pressed.start) { await fieldMenu(true); }
    await nextFrame();
  }
}
async function enterPlace(id, from) { const P = PLACES[id]; if (P.kind === 'town') return enterTown(id, from); return enterDungeon(id, 0, 'left'); }
// ---------------- ships ----------------
const routesFrom = id => SHIPS.filter(s => s[0] === id || s[1] === id).map(s => ({ to: s[0] === id ? s[1] : s[0], cost: s[2] }));
async function sailMenu(id) {
  const R = routesFrom(id).filter(r => GS.open[r.to]);
  if (!R.length) { await say('NO BOATS TODAY. THE WATER IS THINKING.', 'DOCKER'); return; }
  const free = GS.ship.un === 1, opts = R.map(r => pad(PLACES[r.to].name, 20) + (free ? 'FREE' : r.cost + 'G'));
  const i = await choose(['SAIL:'].concat(opts), { x: 150, y: 30, cancel: 1, dis: k => k > 0 && !free && R[k - 1].cost > GS.gold, info: k => k > 0 ? (free ? 'THE A.S.S. SAILS FREE.' : 'FARE ' + R[k - 1].cost + 'G. GOLD: ' + GS.gold) : 'WHERE TO?' });
  if (i <= 0) return false;
  const r = R[i - 1]; if (!free) GS.gold -= r.cost;
  await sailTo(r.to); return true;
}
async function sailTo(to) {
  GS.busy = 1;
  try {
    await fadeOut(.06); music('rssail'); const img = paintSea(); let t = 0;
    // the party stands on the painted deck
    const sea = scene = { update() { t++; }, draw() { blitPaint(img); const f = bakeHero(GS.party[0]).idle[(t >> 5) & 1]; const bob = Math.sin(t * .05) * 1.5; rsDraw(f, 90, 151 + bob, false); if (GS.party[1]) rsDraw(bakeHero(GS.party[1]).idle[((t >> 5) + 1) & 1], 116, 151 + bob, false); panel(60, 16, 200, 26); ink(GS.ship.un ? 'THE A.S.S. MAKES GOOD TIME.' : 'THE BOAT MAKES GOOD TIME.', 72, 24); ink('BOUND FOR ' + PLACES[to].name, 92, 32, RUST); } };
    await fadeIn(.04); await wait(80);
    if (Math.random() < .3) { // something follows the wake
      await say('SOMETHING SURFACES IN THE WAKE.', 'LOOKOUT');
      const foes = [monFrom(pick(['crab', 'gull', 'pickle']), GS.br)]; if (rnd(2)) foes.push(monFrom('crab', GS.br));
      const r = await battle(foes, { theme: 'brine', music: 'rsbattleS' });
      if (r === 'lose') return gameOver();
      music('rssail'); scene = sea; await fadeIn(.04);
    }
    await fadeOut(.06); GS.loc = to; return enterTown(to);
  } finally { GS.busy = 0; }
}
// ---------------- towns ----------------
const ROOF = { desert: 'flat', mall: 'flat', haunt: 'tri', studio: 'flat', mandolin: 'dome', noir: 'flat', field: 'tri', hangar: 'dome', rewind: 'flat', live: 'tri', brine: 'flat', found: 'flat', city: 'spire', court: 'tri', bus: 'flat' };
const SHOPNAME = { pub: 'PUB', shop: 'SHOP', inn: 'INN', magic: 'MAGIC', guild: 'GUILD' };
function townLayout(id) {
  const P = PLACES[id]; if (P.layout) return P.layout; const n = P.shops.length + 2, step = (P.w - 40) / n, B = [];
  for (let i = 0; i < n; i++) { const shop = i === 0 || i === n - 1 ? null : P.shops[i - 1], h = shop ? 74 + ((i * 37) % 3) * 8 : 100 + (i % 2) * 20; B.push({ x: 20 + i * step + 8, w: step - 16, h, roof: ROOF[P.theme], door: !!shop, sign: shop ? SHOPNAME[shop].length : 0, shop }); }
  return P.layout = { theme: P.theme, w: P.w, buildings: B, props: 6, port: P.port };
}
let FIELD = null;
function townies(n) { while (TOWNIES.length < 6) TOWNIES.push(rsBake(townsfolk(TOWNIES.length), PERSON_POSES.walk, { w: 52, h: 56, ay: 50 })); return TOWNIES[n % 6]; }
async function enterTown(id, from) {
  const P = PLACES[id], L = townLayout(id), img = paintTown(id, L);
  const talk = (TOWNTALK[id] || []).slice(0, 3);
  FIELD = { kind: 'town', id, img, w: P.w, mons: [], chest: null, boss: null, x: from === 'right' ? P.w - 30 : 30, y: 200, face: from === 'right' ? -1 : 1, t: 0, walk: 0,
    npcs: talk.map((lines, i) => ({ x: 80 + i * (P.w - 160) / Math.max(1, talk.length - 1), y: 194 + (i % 2) * 14, dir: i % 2 ? -1 : 1, spr: townies(i + id.length), tf: (i + id.length) % 6, lines, pause: 0 })) };
  if (id === 'depot' && GS.hero === 'carl' && GS.quests.carlparcel && GS.quests.carlparcel.s === 1) FIELD.npcs.push({ x: 390, y: 194, dir: 0, spr: townies(id.length + 4), tf: 4, lines: [], pause: 0, parcel: 1 });
  GS.loc = id; music(P.music); scene = fieldScene; await fadeIn(.08);
  await storyHook('town', id);
}
async function enterShop(b) {
  const P = PLACES[FIELD.id], kind = b.shop, img = paintRoom(FIELD.id + kind, P.theme, kind), back = scene;
  let clerk = null; const t0 = frame;
  scene = { draw() { blitPaint(img); if (clerk) { rsDraw(clerk[((frame - t0) >> 5) & 1], 160, 160, true); const cy = { pub: 146, shop: 154, magic: 152 }[kind]; if (cy) blitPaint(img, 0, cy, 0, cy, W, H - cy); } ink(P.name + ' - ' + SHOPNAME[kind], 8, 8, SEPIA); } };
  SHOPKEEP = FIELD.id.length + kind.length; clerk = rsBake(townsfolk(SHOPKEEP), PERSON_POSES.idle, { w: 52, h: 56, ay: 50 });
  sfx('door'); await fadeIn(.1);
  if (kind === 'pub') await pubMenu(FIELD.id); else if (kind === 'shop') await shopMenu(P); else if (kind === 'inn') await innMenu(); else if (kind === 'magic') await magicMenu(P); else if (kind === 'guild') await guildMenu(FIELD.id);
  await fadeOut(.1); scene = back; await fadeIn(.1);
}
async function pubMenu(id) {
  for (;;) {
    const here = (RECRUITS[id] || []).filter(r => !GS.party.includes(r) && !GS.flags['away_' + r]);
    const i = await choose(['LISTEN', 'WORK', 'RECRUIT', 'PART WAYS', 'LEAVE'], { x: 200, y: 20, cancel: 1, dis: k => (k === 2 && (!here.length || GS.party.length >= 6)) || (k === 3 && GS.party.length < 2) });
    if (i < 0 || i === 4) return;
    if (i === 0) { const R = (RUMORS[id] || []).filter(r => !r[2] || r[2](GS)), n = (GS.rumor[id] || 0) % R.length, [s, open] = R[n]; GS.rumor[id] = n + 1; await say(s, 'BARKEEP'); if (open && !GS.open[open]) { GS.open[open] = 1; sfx('get'); await say(PLACES[open].name + ' WAS ADDED TO THE MAP.'); } }
    if (i === 1) await askAround(id);
    if (i === 2) { const k = await choose(here.map(cName), { x: 160, y: 20, cancel: 1 }); if (k >= 0) await recruit(here[k]); }
    if (i === 3) { const others = GS.party.slice(1), k = await choose(others.map(cName), { x: 160, y: 20, cancel: 1 }); if (k >= 0) { const id2 = others[k]; await say(RECRUIT_LINES[id2] ? RECRUIT_LINES[id2][1] : 'SEE YOU AROUND.', cName(id2)); GS.party.splice(GS.party.indexOf(id2), 1); } }
  }
}
async function recruit(id) { const L = RECRUIT_LINES[id] || ['LET US GO.', 'SEE YOU.']; await say(L[0], cName(id)); const c = await choose(['TAKE ALONG', 'NOT NOW'], { x: 200, y: 20 }); if (c === 0) { GS.party.push(id); sfx('get'); banner(cName(id) + ' JOINED'); } }
function townSell(P) { const L = P.sell.slice(); if (GS.er >= 8) for (const n of TIER2) if (!L.includes(n)) L.push(n); return L; }
async function shopMenu(P) {
  for (;;) {
    const i = await choose(['BUY', 'SELL', 'STASH', 'LEAVE'], { x: 220, y: 20, cancel: 1 }); if (i < 0 || i === 3) return;
    if (i === 0) for (;;) { const L = townSell(P), k = await choose(L.map(n => pad(n, 16) + pad(String(shopPrice(n)), 5, 1)), { x: 110, y: 20, cancel: 1, info: j => !bagRoom(L[j]) ? 'NO ROOM IN THE BAG  (HAVE ' + (GS.bag[L[j]] || 0) + ')' : itemInfo(L[j]) + '  HAVE ' + (GS.bag[L[j]] || 0) + '  GOLD ' + GS.gold, dis: j => shopPrice(L[j]) > GS.gold || !bagRoom(L[j]) }); if (k < 0) break; GS.gold -= shopPrice(L[k]); bagAdd(L[k]); sfx('get'); }
    if (i === 1) for (;;) { const L = Object.keys(GS.bag).filter(n => ITEMS[n].p > 0); if (!L.length) { await say('NOTHING WORTH ANYTHING.', 'CLERK'); break; } const k = await choose(L.map(n => pad(n + ' x' + GS.bag[n], 18) + pad(String((ITEMS[n].p >> 1)), 5, 1)), { x: 100, y: 20, cancel: 1 }); if (k < 0) break; GS.gold += ITEMS[L[k]].p >> 1; bagAdd(L[k], -1); sfx('get'); }
    if (i === 2) await stashMenu();
  }
}
const pad = (s, n, right) => right ? String(s).padStart(n) : String(s).padEnd(n);
function itemInfo(n) { const I = ITEMS[n]; if (!I) return ''; if (I.k === 'use') return I.d; if (I.k === 'wpn') return SKILLS[I.t] + ' POWER ' + I.pow; if (I.k === 'acc') return ['str', 'agi', 'int', 'def'].filter(s => I[s]).map(s => s.toUpperCase() + '+' + I[s]).join(' ') + (I.imm ? ' NO ' + I.imm.toUpperCase() : ''); return 'DEF ' + I.def + ['str', 'agi'].filter(s => I[s]).map(s => ' ' + s.toUpperCase() + '+' + I[s]).join(''); }
async function stashMenu() {
  for (;;) {
    const opts = ['BAG', 'STASH', 'CLOSE']; const i = await choose(opts, { x: 220, y: 20, cancel: 1 }); if (i < 0 || i === 2) return;
    const src = i === 0 ? GS.bag : GS.stash, dst = i === 0 ? GS.stash : GS.bag, L = Object.keys(src);
    if (!L.length) { await say(i === 0 ? 'THE BAG IS EMPTY.' : 'THE STASH IS EMPTY.', 'CLERK'); continue; }
    const k = await choose(L.map(n => pad(n, 16) + 'x' + src[n]), { x: 120, y: 20, cancel: 1, rows: 8, info: j => itemInfo(L[j]) }); if (k < 0) continue;
    const n = L[k]; src[n]--; if (src[n] <= 0) delete src[n]; if (dst === GS.bag && (dst[n] || 0) >= BAGMAX) { await say('THE BAG IS FULL. THE CLERK HOLDS IT.'); GS.stash[n] = (GS.stash[n] || 0) + 1; continue; } dst[n] = (dst[n] || 0) + 1; sfx('ok');
  }
}
async function innMenu() {
  const cost = 10 * GS.party.length; await say('A ROOM IS ' + cost + ' GOLD FOR ALL OF YOU.', 'INNKEEPER');
  for (;;) {
    const i = await choose(['REST', 'STASH', 'LEAVE'], { x: 220, y: 20, cancel: 1 }); if (i < 0 || i === 2) return;
    if (i === 1) { await stashMenu(); continue; }
    if (i === 0) {
      if (GS.gold < cost) { await say('COME BACK WITH MONEY.', 'INNKEEPER'); return; }
      GS.gold -= cost; await fadeOut(.04); music(null); sfx('power'); for (const id of GS.party) { const c = PC(id); c.hp = c.mhp; c.wp = c.mwp; c.jp = c.mjp; c.st = {}; } await wait(50); music(PLACES[GS.loc].music); await fadeIn(.04);
      if (await choose(['SAVE', 'DO NOT SAVE'], { x: 200, y: 20 }) === 0) { saveGame(); sfx('get'); banner('SAVED'); }
      return;
    }
  }
}
async function magicMenu(P) {
  const L = Object.keys(SPELLS).filter(s => SPELLS[s][0] === P.school).sort((a, b) => SPELLS[a][1] - SPELLS[b][1]);
  await say('THE SCHOOL OF ' + P.school + '. EVERYTHING HERE IS FOR SALE, EVEN THE TRUTH.', 'TEACHER');
  for (;;) {
    const mem = n => { const sc = SPELLS[n][0]; return GS.party.some(id => { const c = PC(id); return c.spells.filter(s => SPELLS[s][0] === sc).length >= MEMBER_AT; }); };
    const price = n => Math.round(SPELL_PRICE[SPELLS[n][1]] * (mem(n) ? .75 : 1));
    const k = await choose(L.map(n => pad(n, 14) + pad(String(price(n)), 6, 1) + (SPELLS[n][1] >= 12 && !mem(n) ? '*' : '')), { x: 120, y: 20, cancel: 1, info: j => spellInfo(L[j]) + '  GOLD ' + price(L[j]), dis: j => price(L[j]) > GS.gold }); if (k < 0) return;
    const s = L[k], sc = SPELLS[s][0], opp = OPPOSED[sc];
    if (SPELLS[s][1] >= 12 && !mem(s)) { await say('THE LAST SPELL IS FOR MEMBERS. BUY ' + MEMBER_AT + ' SPELLS OF ' + sc + ' FIRST.', 'TEACHER'); continue; }
    const who = GS.party.filter(id => !PC(id).spells.includes(s));
    if (!who.length) { await say('YOU ALL KNOW IT ALREADY.', 'TEACHER'); continue; }
    const w = await choose(who.map(id => cName(id) + (PC(id).spells.length >= 10 ? ' (FULL)' : PC(id).sch[opp] ? ' (' + opp + ')' : '')), { x: 150, y: 60, cancel: 1, dis: j => PC(who[j]).spells.length >= 10 || !!PC(who[j]).sch[opp] }); if (w < 0) continue;
    const c = PC(who[w]);
    if (c.sch[opp]) { await say(cName(c.id) + ' ALREADY CARRIES ' + opp + '. ' + sc + ' AND ' + opp + ' DO NOT SHARE A HEAD.', 'TEACHER'); continue; }
    GS.gold -= price(s); c.spells.push(s); c.sch[sc] = c.sch[sc] || { lv: 1, xp: 0 }; if (c.mjp < 4) { c.mjp = 4; c.jp = Math.max(c.jp, 4); } sfx('power'); banner(cName(c.id) + ' LEARNED ' + s);
    const cnt = c.spells.filter(x => SPELLS[x][0] === sc).length;
    if (cnt === MEMBER_AT) { await say(cName(c.id) + ' IS NOW A MEMBER OF ' + sc + '. THE GOOD INK, THE DISCOUNTS.', 'TEACHER'); if (!GS.titles.includes('MAGE')) GS.titles.push('MAGE'); }
  }
}
function spellInfo(s) { const [sc, jp, k, p, el] = SPELLS[s]; return 'JP ' + jp + '  ' + ({ mag: 'ONE ENEMY', all: 'ALL ENEMIES', heal: 'HEAL ONE', healall: 'HEAL ALL', revive: 'REVIVE', stun: 'STOP A TURN', buff: s === 'PHASE' ? 'DODGE MORE' : s === 'PASSKEY' ? 'SPEED UP' : s === 'SPOTLIGHT' ? 'HIT HARDER' : s === 'WARD' ? 'GUARD UP' : 'STRONGER', charm: 'CHARM A FOE', poison: 'POISON A FOE', cure: 'CURE + HEAL', drain: 'DRAIN LIFE' }[k] || k.toUpperCase()) + (el ? ' ' + el.toUpperCase() : ''); }
// ---------------- dungeons ----------------
async function enterDungeon(id, room, from) {
  const P = PLACES[id], last = P.rooms - 1, w = 400, img = paintRoom(id + ':' + room, P.theme, room === last && P.boss ? 'boss' : 'dun', w);
  const key = id + ':' + room, gone = GS.flags['k_' + key] || [];
  const mons = []; if (!(room === last && P.boss)) { const n = room === 0 ? 1 : 2 + (room % 2); for (let i = 0; i < n; i++) if (!gone.includes(i)) { const fam = P.fam[(i + room) % P.fam.length]; mons.push({ i, fam, x: 120 + i * 220 / n + ((room * 31 + i * 17) % 40), y: 186 + ((i * 13 + room * 7) % 26), vx: 0, vy: 0, stun: 0, spr: bakeMon(fam, Math.min(3, Math.floor(GS.br / 14))) }); } }
  const chest = room % 2 === 1 || room === last - 1 ? { x: 200 + (room * 41) % 120, y: 184, open: !!GS.flags['c_' + key] } : null;
  const boss = room === last && P.boss && !GS.flags[id + 'done'] ? { id: P.boss, x: w - 90, y: 200, spr: bakeBoss(P.boss) } : null;
  // the guardian: one door before the cartridge, a true-form monster blocks the way
  const gRoom = P.guard && !GS.flags[id + 'guard'] ? last - 1 : -1;
  const guard = room === gRoom ? { fam: P.guard, x: w - 46, y: 200, spr: bakeMon(P.guard, 3) } : null;
  FIELD = { kind: 'dun', id, room, last, img, w, x: from === 'right' ? w - 30 : 30, y: 200, face: from === 'right' ? -1 : 1, t: 0, walk: 0, mons, chest, boss, guard, npcs: [] };
  if (id === 'generator') generatorRoom(FIELD);
  GS.loc = id; music(boss || (id === 'generator' && GS.flags.generatordone) ? null : P.music); scene = fieldScene; await fadeIn(.08);
  if (room === 0) banner(P.name);
  await storyHook('room', id, room);
}
// ---------------- the field scene (towns and dungeons share it) ----------------
const fieldScene = {
  update() {
    const F = FIELD; if (!F) return; F.t++;
    if (GS.busy || HOOK || DLG || MENUS.length || CARD) return;
    let mx = (held.right ? 1 : 0) - (held.left ? 1 : 0), my = (held.down ? 1 : 0) - (held.up ? 1 : 0);
    const yMin = F.kind === 'town' ? 190 : 180, yMax = 216;
    if (F.kind === 'town') { const d = townDoorAt(F.x); F.upT = d && held.up && F.y <= yMin ? (F.upT || 0) + 1 : Math.min(0, F.upT || 0); if (d && ((pressed.up && F.y <= yMin + 4) || F.upT === 10)) { F.upT = -45; run(() => doorIn(d)); return; } } // walking up into a door also opens it
    F.x += mx * 1.5; F.y = clamp(F.y + my * 1, yMin, yMax); if (mx) F.face = mx; F.walk = mx || my ? F.walk + 1 : 0;
    if (mx || my) GS.steps++;
    if (F.x < 6) { run(() => leaveEdge('left')); F.x = 6; return; }
    if (F.x > F.w - 6) { if (F.guard) { F.x = F.w - 6; run(guardTalk); return; } run(() => leaveEdge('right')); F.x = F.w - 6; return; }
    for (const n of F.npcs) { if (n.pause > 0) { n.pause--; continue; } n.x += n.dir * .4; if (n.x < 40 || n.x > F.w - 40 || ((F.t + n.x | 0) % 300) === 0) n.dir *= -1; if (((F.t * 7 + n.y | 0) % 240) === 0) n.pause = 60; }
    if (F.id === 'generator' && F.room === 1 && (pressed.a || pressed.b) && Math.abs(F.x - 145) < 28) { run(async () => { GS.busy = 1; try { await generatorSwitch(); } finally { GS.busy = 0; } }); return; }
    if (pressed.a || pressed.b) { const n = F.npcs.find(n => Math.abs(n.x - F.x) < 22 && Math.abs(n.y - F.y) < 14); if (n) { run(() => talkNpc(n)); return; }
      if (F.chest && !F.chest.open && Math.abs(F.chest.x - F.x) < 20 && Math.abs(F.chest.y - F.y) < 16) { run(openChest); return; } }
    if (pressed.start) { run(() => fieldMenu(false)); return; }
    if (F.boss && Math.abs(F.boss.x - F.x) < 50) { run(bossEncounter); return; }
    if (F.guard && Math.abs(F.guard.x - F.x) < 46) { run(guardTalk); return; }
    for (const m of F.mons) {
      if (m.stun > 0) { m.stun--; continue; }
      const dx = F.x - m.x, dy = F.y - m.y, d = Math.hypot(dx, dy);
      if (d < 110) { m.x += dx / d * .75; m.y += dy / d * .5; } else { m.x += Math.sin((F.t + m.i * 70) * .02) * .4; }
      m.y = clamp(m.y, 180, 216);
      if (d < 14) { run(() => symbolFight(m)); return; }
    }
  },
  draw() {
    const F = FIELD; if (!F) { cls(BLACK); return; } camX = clamp(F.x - W / 2, 0, F.w - W) | 0;
    blitPaint(F.img, camX, 0, 0, 0, W, H);
    if (F.kind === 'town' && !DLG) for (const b of townLayout(F.id).buildings) if (b.shop) { const s = SHOPNAME[b.shop], x = (b.x + b.w / 2 - s.length * 3 - camX) | 0; panel(x - 4, 148, s.length * 6 + 8, 13); ink(s, x, 151, RUST); }
    if (F.kind === 'dun' && F.id !== 'generator') {
      const P = PLACES[F.id], room = 'ROOM ' + (F.room + 1) + '/' + (F.last + 1);
      let cue = F.guard ? 'GUARDIAN BLOCKS THE WAY' : F.boss ? 'CARTRIDGE AHEAD' : F.mons.length ? 'HOSTILES IN THIS ROOM' : F.room === F.last ? (GS.flags[F.id + 'done'] ? 'CARTRIDGE RECLAIMED / RIGHT TO MAP' : 'RIGHT: MAP') : 'RIGHT: CONTINUE';
      if (F.chest && !F.chest.open) cue += F.mons.length || F.guard || F.boss ? ' / SUPPLIES' : ' / OPEN SUPPLIES';
      panel(6, 6, W - 12, 31);
      ink(P.name, 12, 9, RUST); ink(room, W - 12 - room.length * 6, 9, SEPIA); ink(cue, 12, 19, FADED);
      const x = 12, y = 30, w = W - 24, progress = F.last ? Math.round(w * F.room / F.last) : 0;
      rectF(x, y, w, 2, PAPER2); if (progress) rectF(x, y, progress, 2, GOLDC);
      for (let i = 0; i <= F.last; i++) rectF(x + Math.round(w * i / Math.max(1, F.last)), y - 1, 2, 4, i <= F.room ? SEPIA : PAPER);
    }
    if (F.id === 'generator') drawGeneratorField(F);
    const S = [];
    if (F.chest) S.push([F.chest.y, () => drawChest(F.chest.x - camX, F.chest.y, F.chest.open)]);
    for (const n of F.npcs) S.push([n.y, () => { rsDraw(n.spr[n.pause ? 0 : (F.t >> 3) & 3], n.x - camX, n.y, n.dir < 0); if (n.parcel && !DLG && !MENUS.length) { panel(n.x - camX - 40, 163, 80, 16); ink('FREIGHT', n.x - camX - 24, 167, RUST); } }]);
    for (const m of F.mons) S.push([m.y, () => { if (m.stun && (F.t >> 2) & 1) return; const f = m.spr.idle[(F.t >> 4) & 1]; shadow(m.x - camX, m.y); rsDraw(f, m.x - camX, m.y - (FAMILY[m.fam].fly ? 8 + Math.sin(F.t * .08 + m.i) * 3 : 0), F.x < m.x); }]);
    if (F.guard) S.push([F.guard.y, () => { shadow(F.guard.x - camX, F.guard.y, 16); const f = F.guard.spr.idle[(F.t >> 4) & 1]; rsDraw(f, F.guard.x - camX, F.guard.y - 6, true); if (!DLG && !MENUS.length) { panel(W / 2 - 60, 24, 120, 15); ink('THE WAY IS HELD', W / 2 - 48, 28, RUST); } }]);
    if (F.boss) S.push([F.boss.y, () => { shadow(F.boss.x - camX, F.boss.y, 20); rsDraw(F.boss.spr.idle[(F.t >> 5) & 1], F.boss.x - camX, F.boss.y, true); }]);
    if (F.kind === 'town' && F.id === 'lot' && GS.flags.generatordone) S.push([201, () => { rsDraw(bakeHero('driver').down[0], 90 - camX, 201); ink('Z Z Z', 80 - camX, 160, FADED); }]);
    const hs = bakeHero(GS.party[0]); S.push([F.y, () => { shadow(F.x - camX, F.y); rsDraw(F.walk ? hs.walk[(F.walk >> 3) & 3] : hs.idle[(F.t >> 5) & 1], F.x - camX, F.y, F.face < 0); }]);
    S.sort((a, b) => a[0] - b[0]).forEach(s => s[1]());
    if (F.kind === 'town') { const d = townDoorAt(F.x); if (d && !DLG && !MENUS.length) { panel(W / 2 - 40, 24, 80, 15); ink('UP: ' + SHOPNAME[d.shop], W / 2 - 30, 28, RUST); } }
    ink('MOVE: ARROWS   USE: Z   MENU: ENTER', 8, 216, FADED);
  },
};
function shadow(x, y, r = 9) { for (let j = -2; j <= 2; j++) for (let i = -r; i <= r; i++) if ((i * i) / (r * r) + (j * j) / 6 <= 1) { const xx = (x + i) | 0, yy = (y + j) | 0; if (xx >= 0 && xx < W && yy >= 0 && yy < H) FB[yy * W + xx] = mix(FB[yy * W + xx], SEPIA, .3); } }
function drawChest(x, y, open) { rectF(x - 8, y - 10, 16, 10, rgb(140, 84, 40)); frameRect(x - 8, y - 10, 16, 10, SEPIA); if (open) rectF(x - 7, y - 14, 14, 4, rgb(80, 48, 24)); else { rectF(x - 8, y - 14, 16, 5, rgb(170, 104, 50)); frameRect(x - 8, y - 14, 16, 5, SEPIA); rectF(x - 1, y - 11, 3, 3, GOLDC); } }
function townDoorAt(x) { return townLayout(FIELD.id).buildings.find(b => b.shop && Math.abs(b.x + b.w / 2 - x) < 12); }
async function doorIn(b) { GS.busy = 1; try { await fadeOut(.12); await enterShop(b); } finally { GS.busy = 0; } }
async function talkNpc(n) { GS.busy = 1; try { n.pause = 120; for (const s of [].concat(n.lines)) await say(typeof s === 'function' ? s() : s, 'LOCAL', { port: townPort(n.tf) }); } finally { GS.busy = 0; } }
async function leaveEdge(side) {
  const F = FIELD; GS.busy = 1;
  try {
    await fadeOut(.1);
    if (F.kind === 'town') return toMap(F.id);
    if (side === 'left') { if (F.room === 0) return toMap(F.id); return enterDungeon(F.id, F.room - 1, 'right'); }
    if (F.room < F.last) return enterDungeon(F.id, F.room + 1, 'left');
    return toMap(F.id);
  } finally { GS.busy = 0; }
}
const CHESTLOOT = [['TONIC', 'SODA', 'GUM', 'ENERGY DRINK', 'HOT POCKET', 'PICKLE JUICE', 'COFFEE'], ['LANYARD', 'CLASS RING', 'MOOD RING', 'SODA', 'HOT POCKET', 'TRAY', 'GRIP TAPE'], ['PAPER HAT', 'FLIP FLOPS', 'KNUCKLES', 'LONG BOW', 'SNEAKERS', 'JUICE BOX', 'SOLVENT']];
async function openChest() {
  const F = FIELD, key = F.id + ':' + F.room; GS.busy = 1;
  try { if (F.id === 'generator') { F.chest.open = true; GS.flags.gensupplies = 1; bagAdd('TONIC', 2); bagAdd('ENERGY DRINK'); sfx('get'); await say('FOUND TWO TONICS AND AN ENERGY DRINK. BREAK ROOM BENEFITS.'); return; }
    F.chest.open = true; GS.flags['c_' + key] = 1; sfx('get'); const P = PLACES[F.id], tier = P.boss ? (GS.br >= 20 ? 2 : 1) : (GS.br >= 12 ? 1 : 0), L = CHESTLOOT[tier], n = L[(F.room * 3 + F.id.length) % L.length], g = 40 + GS.br * 6; bagAdd(n); GS.gold += g; await say('FOUND ' + n + ' AND ' + g + ' GOLD.'); }
  finally { GS.busy = 0; }
}
async function symbolFight(m) {
  GS.busy = 1;
  try {
    const P = PLACES[FIELD.id], n = 1 + Math.min(4, rnd(1 + Math.floor(GS.br / 8)) + (GS.br >= 4 && rnd(4) === 0 ? 1 : 0)), foes = [monFrom(m.fam, GS.br)];
    if (FIELD.id === 'generator') { if (FIELD.room === 0) generatorFoe(foes[0]); else { foes[0].hp = foes[0].mhp = 28; foes[0].skill = ['attack']; } }
    for (let i = 1; i < (FIELD.id === 'generator' ? 1 : n); i++) foes.push(monFrom(P.fam[rnd(P.fam.length)], GS.br));
    const r = await battle(foes, { theme: P.theme, music: REGION_BATTLE[REGION[FIELD.id]] || 'rsbattle' });
    if (r === 'win') { const key = FIELD.id + ':' + FIELD.room; (GS.flags['k_' + key] = GS.flags['k_' + key] || []).push(m.i); FIELD.mons.splice(FIELD.mons.indexOf(m), 1); }
    else if (r === 'flee') { m.stun = 120; m.x += m.x < FIELD.x ? -40 : 40; }
    else return gameOver();
    music(P.music); scene = fieldScene; await fadeIn(.1);
  } finally { GS.busy = 0; }
}
// the guardian: a real fight, but the door opens for good once it is done
async function guardTalk() {
  const F = FIELD; if (F.guardT || GS.busy) return; GS.busy = 1;
  try {
    const P = PLACES[F.id];
    await say('A TRUE-FORM ' + FAMILY[F.guard.fam].names[3] + ' STANDS IN THE DOOR. IT IS NOT MOVING.', '');
    const back = () => { F.x = Math.min(F.x, F.guard.x - 80); F.face = -1; }; // stepping back has to leave its reach, or it asks again next frame
    const c = await choose(['FIGHT IT', 'STEP BACK'], { x: 160, y: 40 }); if (c !== 0) { back(); return; }
    const g = guardFrom(F.guard.fam, GS.br, P.name);
    const r = await battle([g], { theme: P.theme, music: 'rsboss', boss: 1 });
    if (r === 'flee') { back(); scene = fieldScene; music(P.music); await fadeIn(.1); return; }
    if (r !== 'win') return gameOver();
    GS.flags[F.id + 'guard'] = 1; F.guard = null; scene = fieldScene; music(null); await fadeIn(.1);
    await say('THE DOOR IS CLEAR NOW. IT STAYS CLEAR.', ''); music(P.music);
  } finally { GS.busy = 0; }
}
async function bossEncounter() {
  GS.busy = 1;
  try {
    const F = FIELD, P = PLACES[F.id], id = F.boss.id; await storyHook('preboss', F.id);
    const r = await battle(bossFoes(id), { theme: P.theme, music: BOSSDEF[id].minion || id.startsWith('curse') ? 'rsfinalboss' : 'rsboss', boss: 1, noflee: 1 });
    if (r !== 'win') return gameOver();
    GS.flags[F.id + 'done'] = 1; F.boss = null; scene = fieldScene; music(null); await fadeIn(.1);
    await storyHook('postboss', F.id);
    if (P.cart && !GS.carts.includes(P.cart)) { GS.carts.push(P.cart); sfx('power'); await showCard(['YOU FOUND A CARTRIDGE:', '', P.cart, '', GS.carts.length + ' OF 10', CARTPASS[P.cart].d], 0, { bg: PAPER, fg: SEPIA }); erUp(2); }
    await storyHook('cart', F.id); music(F.id === 'generator' ? null : P.music);
  } finally { GS.busy = 0; }
}
// boss fights can bring company
// boss fights can bring company (the generator fights alone: it is somebody's first boss)
function bossFoes(id) { const b = [bossFrom(id, GS.br)]; if (id === 'generator') generatorFoe(b[0], true); const company = { alimony: ['wisp', 'wisp'], director: ['manq', 'manq'], red: ['drone', 'drone'], dyslexio: ['bot'], lasagna: ['rat'], curse1: ['wisp', 'troll'], mpickle: ['pickle', 'pickle'], latefee: ['tapebug'], dryerlord: ['sock'], walkin: ['fridge'], ppigeon: ['pigeon', 'pigeon'], pyre: ['folder'], gatekeeper: ['drone', 'drone'], thefinder: ['folder', 'folder'], chorusb: ['echo', 'echo'], sargasso: ['crab'], bus: ['troll'] }[id] || []; for (const f of company) b.push(monFrom(f, GS.br)); if (id.startsWith('curse')) curseWeaken(b[0]); return b; }
function curseWeaken(b) { const k = 1 - GS.carts.length * .045; b.hp = b.mhp = Math.round(b.mhp * k); b.str = Math.round(b.str * k); b.int = Math.round(b.int * k); b.def = Math.round(b.def * k); }
async function gameOver() { music(null); await fadeOut(.04); await showCard(['THE STREAM ENDED.', '', 'NOBODY WAS WATCHING.'], 200, { fg: RUST }); run(titleRS); return new Promise(() => {}); } // the old chain is abandoned on purpose
// ---------------- the menu ----------------
async function fieldMenu(onMap) {
  GS.busy = 1;
  try {
    for (;;) {
      const opts = ['STATUS', 'EQUIP', 'ITEMS', 'ORDER', 'FORMATION', 'QUESTS', 'CARTRIDGES', 'SAVE', 'CLOSE'];
      const i = await choose(opts, { x: 200, y: 20, cancel: 1, rows: 9, dis: k => k === 7 && !onMap && FIELD && FIELD.kind === 'dun' });
      if (i < 0 || i === 8) return;
      if (i === 0) await statusView();
      if (i === 1) await equipMenu();
      if (i === 2) await itemMenu();
      if (i === 3) { const k = await choose(GS.party.map(cName), { x: 150, y: 20, cancel: 1 }); if (k > 0) { const [id] = GS.party.splice(k, 1); GS.party.unshift(id); sfx('ok'); banner(cName(id) + ' LEADS'); } }
      if (i === 4) await formMenu();
      if (i === 5) await questJournal();
      if (i === 6) await showCard(['THE TEN CARTRIDGES', ''].concat(CARTS.map(c => (GS.carts.includes(c) ? '* ' : '- ') + (GS.carts.includes(c) ? c : '??????')).concat(GS.carts.length ? ['', CARTPASS[GS.carts[GS.carts.length - 1]].d] : [])), 0, { bg: PAPER, fg: SEPIA });
      if (i === 7) { saveGame(); sfx('get'); banner('SAVED'); }
    }
  } finally { GS.busy = 0; }
}
async function formMenu() {
  for (;;) {
    const keys = Object.keys(FORMS).filter(f => f === 'STANDARD' || GS.forms.includes(f));
    const i = await choose(keys.map(f => (GS.form === f ? '> ' : '  ') + f), { x: 150, y: 20, cancel: 1, rows: 6, info: j => FORMS[keys[j]].d }); if (i < 0) return;
    GS.form = keys[i]; sfx('ok'); banner('FORMATION: ' + GS.form);
  }
}
async function statusView() {
  let k = 0; const back = scene, ids = GS.party;
  scene = { draw() {
    panel(0, 0, W, H); const c = PC(ids[k]), h = bakeHero(c.id);
    rectF(10, 10, 60, 60, PAPER2); frameRect(10, 10, 60, 60, SEPIA); if (PORT[cName(c.id)]) drawPortrait(PORT[cName(c.id)], 16, 16); else rsDraw(h.idle[0], 40, 64, false);
    ink(cName(c.id), 80, 12, RUST); ink('HP ' + c.hp + '/' + c.mhp + '   WP ' + c.wp + '/' + c.mwp + '   JP ' + c.jp + '/' + c.mjp, 80, 26);
    ink('STR ' + cStr(c) + '  AGI ' + cAgi(c) + '  INT ' + cInt(c) + '  DEF ' + cDef(c), 80, 38);
    const st = Object.keys(c.st || {}).join(' ').toUpperCase(); ink(st ? 'AFFLICTED: ' + st : '', 80, 50, RUST);
    ink('FORM ' + GS.form, 80, 62, FADED);
    let y = 80; ink('EQUIPPED', 12, y, RUST); y += 11; for (const s of EQSLOTS) { if (c.wpn && s === 'wpn') { ink(pad(EQNAME.wpn, 8) + c.wpn, 18, y); y += 10; } else if (c.eq[s]) { ink(pad(EQNAME[s], 8) + c.eq[s], 18, y); y += 10; } }
    ink('WEAPON SKILL', 12, y + 4, RUST); y += 15; for (const t in c.sk) { ink(pad(SKILLS[t], 9) + 'LV ' + c.sk[t].lv, 18, y); y += 10; }
    ink('TECHNIQUES', 12, y + 4, RUST); y += 15; for (const T of techList(c)) { if (T[1] === 0 || c.techs.includes(T[0])) { ink(pad(T[0], 18) + (T[2] ? 'WP ' + T[2] : ''), 18, y); y += 10; } }
    let y2 = 80; ink('SPELLS', 170, y2, RUST); y2 += 11; for (const s in c.sch) { ink(pad(s, 9) + 'LV ' + c.sch[s].lv, 176, y2); y2 += 10; } for (const s of c.spells) { ink(pad(s, 13) + 'JP ' + SPELLS[s][1], 176, y2); y2 += 10; }
    if (GS.titles.length) { ink('TITLES: ' + GS.titles.join(', '), 170, y2 + 4); }
    ink('LEFT/RIGHT: NEXT   C: BACK', 12, 210, FADED);
  } };
  await nextFrame();
  for (;;) { if (pressed.left) { k = (k + ids.length - 1) % ids.length; sfx('move'); } if (pressed.right) { k = (k + 1) % ids.length; sfx('move'); } if (pressed.c || pressed.b) break; await nextFrame(); }
  scene = back;
}
async function equipMenu() {
  const w = await choose(GS.party.map(id => pad(cName(id), 14) + PC(id).wpn), { x: 60, y: 20, cancel: 1 }); if (w < 0) return; const c = PC(GS.party[w]);
  for (;;) {
    const s = await choose(EQSLOTS.map(k => pad(EQNAME[k], 8) + (k === 'wpn' ? c.wpn : c.eq[k] || '-')), { x: 60, y: 30, cancel: 1, rows: 7 }); if (s < 0) return;
    const kind = EQSLOTS[s], L = kind === 'wpn' ? Object.keys(GS.bag).filter(n => ITEMS[n].k === 'wpn') : Object.keys(GS.bag).filter(n => ITEMS[n].k === kind);
    if (kind !== 'wpn' && c.eq[kind]) L.push('(REMOVE)');
    if (!L.length) { await say('NOTHING TO SWAP IN.'); continue; }
    const k = await choose(L, { x: 120, y: 60, cancel: 1, info: j => L[j] === '(REMOVE)' ? '' : itemInfo(L[j]) + (kind === 'wpn' && ITEMS[L[j]].t !== wType(c) ? '  (NEW SKILL)' : '') }); if (k < 0) continue;
    if (L[k] === '(REMOVE)') { bagAdd(c.eq[kind]); c.eq[kind] = null; sfx('ok'); continue; }
    const old = kind === 'wpn' ? c.wpn : c.eq[kind];
    if (kind === 'wpn') c.wpn = L[k]; else c.eq[kind] = L[k];
    bagAdd(L[k], -1); if (old) bagAdd(old); if (kind === 'wpn' && !c.sk[ITEMS[c.wpn].t]) c.sk[ITEMS[c.wpn].t] = { lv: 1, xp: 0 }; sfx('ok');
  }
}
async function itemMenu() {
  for (;;) {
    const L = Object.keys(GS.bag); if (!L.length) { await say('THE BAG IS EMPTY.'); return; }
    const k = await choose(L.map(n => pad(n, 16) + 'x' + GS.bag[n]), { x: 120, y: 20, cancel: 1, rows: 10, info: j => itemInfo(L[j]) }); if (k < 0) return;
    const I = ITEMS[L[k]]; if (I.k !== 'use' || I.flee) { await say('NOT NOW.'); continue; }
    const t = await choose(GS.party.map(id => pad(cName(id), 14) + PC(id).hp + '/' + PC(id).mhp + (Object.keys(PC(id).st).length ? ' ' + Object.keys(PC(id).st).join(',').toUpperCase() : '')), { x: 60, y: 40, cancel: 1 }); if (t < 0) continue;
    useItem(L[k], PC(GS.party[t])); sfx('power');
  }
}
function useItem(n, c) { const I = ITEMS[n]; if (I.cure) { delete c.st[I.cure]; if (I.heal && c.hp > 0) c.hp = Math.min(c.mhp, c.hp + I.heal); bagAdd(n, -1); return; } bagAdd(n, -1); if (I.revive) { if (c.hp <= 0) c.hp = Math.ceil(c.mhp * (cartHas('LIVE FROM BEYOND') ? .5 : .25)); } else if (c.hp > 0) { if (I.heal) c.hp = Math.min(c.mhp, c.hp + I.heal); if (I.healall) c.hp = Math.min(c.mhp, c.hp + I.healall); if (I.wp) c.wp = Math.min(c.mwp, c.wp + I.wp); if (I.jp) c.jp = Math.min(c.mjp, c.jp + I.jp); } }
