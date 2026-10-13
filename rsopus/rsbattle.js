'use strict';
// ================= ROMANCING STREAM: battle. foes on the left, the party on the right, a painted field behind =================
// everyone picks a command, then the round plays out fastest first. weapons and schools grow from use, hp grows after hard fights,
// and every fight (won or fled) adds one to the battle rank. status: poison, sleep, charm, stone, stun.
// formations put some of you in back: less melee taken, less melee dealt.
let BT = null;
const EL_COL = { static: [120, 220, 255], curse: [200, 60, 120], sound: [200, 140, 255], fire: [255, 140, 60], light: [255, 250, 210], dark: [110, 90, 160], water: [90, 180, 230], gate: [180, 120, 255], heal: [120, 240, 160] };
const EL_NAME = { static: 'STATIC', curse: 'CURSE', sound: 'SOUND', fire: 'FIRE', light: 'LIGHT', dark: 'DARK', water: 'WATER', gate: 'GATE' };
// is the party member standing in the back row this fight?
function backRow(i) { const F = FORMS[GS.form] || FORMS.STANDARD; return !F.front[i]; }
function partySlot(i) { const bx = backRow(i) ? 28 : 0, by = backRow(i) ? -7 : 0; return [228 + (i % 2) * 44 + (i >> 1) * 5 + bx, 118 + (i >> 1) * 24 + by]; }
function foeSlot(i, n, f, withBoss) { if (f.boss) return [80, 164]; const rows = withBoss ? [[0, 0], [160, 130], [164, 160], [24, 124], [26, 162]] : [[72, 124], [118, 142], [52, 160], [138, 116], [96, 166]]; return rows[i % 5]; }
async function battle(foes, o = {}) {
  const img = o.theme === 'generator' ? paintGeneratorRoom(foes.some(f => f.boss) ? 2 : FIELD && FIELD.room || 0, GS.flags.genpower || 'on') : paintBattle(o.theme || 'field'), back = scene;
  BT = { foes, img, t: 0, fx: [], nums: [], cur: -1, tgt: null, msg: '', o, last: null, flee: false, combo: {} };
  foes.forEach((f, i) => { const [x, y] = foeSlot(i, foes.length, f, foes[0].boss); f.x = x; f.y = y; f.dx = 0; f.fl = 0; f.stun = 0; f.st = {}; });
  for (const id of GS.party) { const c = PC(id); c.b = { dx: 0, pose: c.hp > 0 ? 'idle' : 'down', fl: 0, def: 0, buff: 0, phase: 0, stun: 0, st: Object.assign({}, c.st), used: {} }; if (cartHas('ABOVE AND BELOW NEVADA')) { c.b.mwp = Math.round(c.mwp * 1.1); c.wp = Math.min(c.b.mwp, Math.round(c.wp * 1.1)); } else c.b.mwp = c.mwp; }
  sfx('glitch'); post.flash = .8; music(o.music || 'rsbattle'); scene = battleScene;
  for (let i = 0; i < 16; i++) { post.flash *= .85; await nextFrame(); }
  if (o.intro) await o.intro();
  let result = null;
  while (!result) {
    const plan = await commandPhase(); if (plan === 'flee') { result = 'flee'; break; }
    result = await roundPhase(plan);
  }
  if (result === 'win') await victory(); else if (result === 'flee') { GS.br++; GS.battles++; }
  for (const id of GS.party) { const c = PC(id); if (result !== 'lose') { if (c.hp <= 0) c.hp = 1; // poison walks out with you; stone does too
      c.st = c.b && (c.b.st.poison || c.b.st.stone) ? { poison: c.b.st.poison ? 1 : undefined, stone: c.b.st.stone ? 1 : undefined } : {}; } delete c.b; }
  await fadeOut(.08); post.shake = 0; post.flash = 0; BT = null; scene = back; return result;
}
const alive = () => GS.party.filter(id => PC(id).hp > 0);
const liveFoes = () => BT.foes.filter(f => f.hp > 0);
const stName = { poison: 'PSN', sleep: 'SLP', charm: 'CHM', stone: 'STONE', stun: 'STOP' };
const battleScene = {
  update() { BT.t++; if (post.shake > 0) post.shake = Math.max(0, post.shake - .25); if (post.flash > 0) post.flash = post.flash < .03 ? 0 : post.flash * .9; for (const n of BT.nums) n.t++; BT.nums = BT.nums.filter(n => n.t < 50); for (const f of BT.fx) f.t++; BT.fx = BT.fx.filter(f => f.t < f.d); },
  draw() {
    blitPaint(BT.img); const t = BT.t;
    for (const f of BT.foes) { if (f.hp <= 0 && !f.dying) continue; const fr = f.spr[f.pose === 'attack' ? 'attack' : f.fl > 0 ? 'hurt' : 'idle'] || f.spr.idle, a = f.dying ? Math.max(0, 1 - f.dying / 30) : undefined, fly = f.fly ? 10 + Math.sin(t * .07 + f.x) * 3 : 0;
      shadow(f.x + f.dx, f.y, f.boss ? 22 : 10); rsDraw(fr[(t >> 5) % fr.length], f.x + f.dx, f.y - fly, false, f.fl > 0 ? Math.min(1, f.fl / 8) : 0, a); if (f.fl > 0) f.fl--; if (f.dying) f.dying++;
      if (f.st && Object.keys(f.st).length) ink(Object.keys(f.st).map(k => stName[k]).join(' '), f.x + f.dx - 8, f.y - (f.boss ? f.spr.idle[0].ay : 50) - fly - 8, RUST);
      if (BT.tgt && BT.tgt.includes(f) && (t >> 3) & 1) ink('v', f.x + f.dx - 2, f.y - (f.boss ? f.spr.idle[0].ay : 50) - fly, RUST); }
    GS.party.forEach((id, i) => { const c = PC(id), [x, y] = partySlot(i), h = bakeHero(id), b = c.b; if (!b) return; const pose = c.hp <= 0 ? 'down' : b.pose, fr = h[pose] || h.idle;
      shadow(x + b.dx, y); rsDraw(fr[pose === 'walk' ? (t >> 3) & 3 : (t >> 5) % fr.length], x + b.dx, y, true, b.fl > 0 ? b.fl / 8 : 0); if (b.fl > 0) b.fl--;
      if (b.st && Object.keys(b.st).length) ink(Object.keys(b.st).map(k => stName[k]).join(' '), x - 12, y - 62, RUST);
      if (BT.cur === i && (t >> 3) & 1) ink('v', x - 2, y - 54, RUST); if (BT.tgt && BT.tgt.includes(id) && (t >> 3) & 1) ink('v', x - 2, y - 54, GOLDC); });
    if (BT.foes.some(f => f.machinePhase)) drawGeneratorBattle();
    for (const f of BT.fx) drawFx(f);
    for (const n of BT.nums) { const s = String(n.v), y = n.y - Math.min(16, n.t * .8); text(s, n.x - s.length * 3, y, n.c, SEPIA); }
    // status
    panel(0, 172, W, 52);
    GS.party.forEach((id, i) => { const c = PC(id), x = 6 + (i % 2) * 158, y = 177 + (i >> 1) * 15, on = BT.cur === i, dead = c.hp <= 0, b = c.b || {};
      ink(pad(cName(id).replace('CEO ', '').replace('SPOOKY ', '').replace('JB ', ''), 9), x, y, dead ? FADED : on ? RUST : SEPIA); ink(pad(c.hp, 4, 1) + '/' + c.mhp, x + 54, y, c.hp < c.mhp / 4 ? RUST : SEPIA);
      ink('W' + c.wp + ' J' + c.jp, x + 108, y, FADED); const bw = 46; rectF(x + 54, y + 9, bw, 2, PAPER2); rectF(x + 54, y + 9, Math.round(bw * Math.max(0, c.hp) / c.mhp), 2, dead ? FADED : rgb(110, 150, 70)); });
    if (BT.msg) { const w = BT.msg.length * 6 + 16; panel(((W - w) / 2) | 0, 6, w, 17); ink(BT.msg, ((W - BT.msg.length * 6) / 2) | 0, 11, RUST); }
  },
};
function drawFx(f) {
  const k = f.t / f.d, c = f.col ? rgb(...f.col) : SEPIA;
  if (f.k === 'hit') { for (let i = 0; i < 6; i++) { const a = i * 1.05 + f.x, r = 4 + k * 14; lineF(f.x + Math.cos(a) * r * .4, f.y + Math.sin(a) * r * .4, f.x + Math.cos(a) * r, f.y + Math.sin(a) * r, SEPIA); } circF(f.x, f.y, Math.max(0, 5 - k * 6) | 0, rgb(255, 250, 230)); }
  if (f.k === 'ring') { ringF(f.x, f.y, 4 + k * 26, c); ringF(f.x, f.y, 2 + k * 18, c); for (let i = 0; i < 8; i++) { const a = i * .785 + k * 3; pset(f.x + Math.cos(a) * k * 30, f.y + Math.sin(a) * k * 22, rgb(255, 255, 240)); } }
  if (f.k === 'rise') for (let i = 0; i < 7; i++) { const x = f.x - 12 + i * 4, y = f.y - k * 30 - (i % 3) * 5; circF(x, y, 1, c); }
  if (f.k === 'shot') { const x = f.x0 + (f.x - f.x0) * Math.min(1, k * 2.5), y = f.y0 + (f.y - f.y0) * Math.min(1, k * 2.5); if (k < .4) { circF(x, y, 2, c); lineF(x, y, x + (f.x0 - f.x) * .08, y + (f.y0 - f.y) * .08, c); } }
  if (f.k === 'link') { const x0 = f.x0 + (f.x - f.x0) * k, y0 = f.y0 + (f.y - f.y0) * k; lineF(f.x, f.y, x0, y0, c); circF(x0, y0, 2, rgb(255, 250, 220)); }
}
const fx = (k, x, y, col, d = 24, more = {}) => BT.fx.push(Object.assign({ k, x, y, col, d, t: 0 }, more));
const num = (v, x, y, c = SEPIA) => BT.nums.push({ v, x, y, c, t: 0 });
async function msg(s, n = 40) { BT.msg = s; await wait(n); BT.msg = ''; }
// ---------------- commands ----------------
async function commandPhase() {
  const plan = [], ids = GS.party;
  for (let i = 0; i < ids.length; i++) {
    const c = PC(ids[i]); if (c.hp <= 0) { plan[i] = null; continue; }
    if (c.b.stun || c.b.st.stone || c.b.st.sleep || c.b.st.charm) { plan[i] = null; continue; } // not steering this one
    BT.cur = i; const T = techList(c), opts = T.map(t => pad(t[0], 17) + (t[2] ? 'WP' + t[2] : ''));
    const comb = comboFor(ids[i]);
    if (comb) opts.push('* ' + comb.n);
    const extra = []; if (c.spells.length) extra.push('SPELL'); extra.push('ITEM', 'DEFEND'); if (!BT.o.noflee) extra.push('RUN');
    const all = opts.concat(extra), k = await choose(all, { x: 4, y: 4, cancel: 1, rows: 9, w: 170, dis: j => j < T.length && T[j][2] > c.wp, info: j => j < T.length ? (T[j][4] === 'interrupt' ? 'CANCELS CHARGE' : T[j][4] === 'all' ? 'ALL ENEMIES' : T[j][4] === 'two' ? 'HITS TWICE' : T[j][4] === 'first' ? 'STRIKES FIRST' : T[j][4] === 'crit' ? 'OFTEN CRITICAL' : 'ONE ENEMY') + (T[j][3] !== 1 ? '  POWER X' + T[j][3] : '') + (T[j][5] ? ' ' + EL_NAME[T[j][5]] : '') : j < opts.length ? 'WITH ' + cName(comb.ids.find(x => x !== ids[i])).toUpperCase() + '. ONCE A FIGHT.' : '' });
    if (k < 0) { if (i > 0) { let j = i - 1; while (j >= 0 && !plan[j]) j--; if (j >= 0) { i = j - 1; continue; } } i--; continue; }
    const pick = all[k];
    if (k < T.length) { const tc = T[k]; const tg = tc[4] === 'all' ? liveFoes() : await pickFoe(); if (!tg) { i--; continue; } plan[i] = { who: ids[i], k: 'tech', tech: tc, tg }; }
    else if (pick.startsWith('* ')) { const tg = await pickFoe(); if (!tg) { i--; continue; } plan[i] = { who: ids[i], k: 'combo', combo: comb, tg }; BT.combo[comb.n] = 1; }
    else if (pick === 'SPELL') { const L = c.spells, s = await choose(L.map(n => pad(n, 13) + 'JP' + SPELLS[n][1]), { x: 4, y: 4, cancel: 1, w: 150, dis: j => SPELLS[L[j]][1] > c.jp, info: j => spellInfo(L[j]) }); if (s < 0) { i--; continue; } const S = SPELLS[L[s]], kd = S[2];
      let tg = kd === 'all' || (kd === 'stun' && S[4] === 'all') || kd === 'poison' ? liveFoes() : kd === 'healall' ? alive() : kd === 'cure' ? alive().filter(id => Object.keys(PC(id).b.st).length) : kd === 'mag' || kd === 'stun' || kd === 'charm' || kd === 'drain' ? await pickFoe() : await pickAlly(kd === 'revive'); if (!tg && kd !== 'cure') { i--; continue; } if (!tg && kd === 'cure') tg = alive(); if (!tg) { i--; continue; } plan[i] = { who: ids[i], k: 'spell', spell: L[s], tg }; }
    else if (pick === 'ITEM') { const L = Object.keys(GS.bag).filter(n => ITEMS[n].k === 'use'); if (!L.length) { await msg('NOTHING TO USE', 30); i--; continue; } const s = await choose(L.map(n => pad(n, 14) + 'x' + GS.bag[n]), { x: 4, y: 4, cancel: 1, w: 150, info: j => itemInfo(L[j]) }); if (s < 0) { i--; continue; }
      if (ITEMS[L[s]].flee) { plan[i] = { who: ids[i], k: 'item', item: L[s], tg: [] }; } else { const tg = await pickAlly(!!ITEMS[L[s]].revive, ITEMS[L[s]].cure); if (!tg) { i--; continue; } plan[i] = { who: ids[i], k: 'item', item: L[s], tg }; } }
    else if (pick === 'DEFEND') plan[i] = { who: ids[i], k: 'defend' };
    else if (pick === 'RUN') { BT.cur = -1; if (Math.random() < .7 || BT.o.easyflee) { sfx('step'); await msg('GOT AWAY', 30); return 'flee'; } await msg('COULD NOT GET AWAY', 40); return plan.map(() => null); }
  }
  BT.cur = -1; return plan;
}
function comboFor(id) { const c = COMBOS.find(cb2 => cb2.ids.includes(id) && !BT.combo[cb2.n] && cb2.ids.every(x => GS.party.includes(x) && PC(x).hp > 0 && PC(x).b && !PC(x).b.stun && !PC(x).b.st.stone && !PC(x).b.st.sleep && !PC(x).b.st.charm)); return c || null; }
async function pickFoe() { const L = liveFoes().sort((a, b) => a.x - b.x || a.y - b.y); let i = 0; await nextFrame(); for (;;) { BT.tgt = [L[i]]; if (pressed.left || pressed.up) { i = (i + L.length - 1) % L.length; sfx('move'); } if (pressed.right || pressed.down) { i = (i + 1) % L.length; sfx('move'); } if (pressed.a || pressed.b) { sfx('ok'); BT.tgt = null; return [L[i]]; } if (pressed.c) { BT.tgt = null; return null; } await nextFrame(); } }
async function pickAlly(dead, wantSt) { const L = GS.party.filter(id => wantSt ? (PC(id).b.st[wantSt] || (dead ? PC(id).hp <= 0 : false)) : dead ? PC(id).hp <= 0 : PC(id).hp > 0); if (!L.length) return null; let i = 0; await nextFrame(); for (;;) { BT.tgt = [L[i]]; if (pressed.left || pressed.up) { i = (i + L.length - 1) % L.length; sfx('move'); } if (pressed.right || pressed.down) { i = (i + 1) % L.length; sfx('move'); } if (pressed.a || pressed.b) { sfx('ok'); BT.tgt = null; return [L[i]]; } if (pressed.c) { BT.tgt = null; return null; } await nextFrame(); } }
// ---------------- the round ----------------
async function roundPhase(plan) {
  const acts = [];
  plan.forEach(p => { if (p) { const c = PC(p.who); acts.push({ p, sp: cAgi(c) + rnd(8) + (p.k === 'tech' && (p.tech[4] === 'first' || p.tech[4] === 'interrupt') ? 100 : 0) + (p.k === 'defend' ? 200 : 0) }); } });
  for (const f of liveFoes()) acts.push({ f, sp: f.machinePhase ? -100 : f.agi + rnd(8) });
  acts.sort((a, b) => b.sp - a.sp);
  for (const id of GS.party) { const c = PC(id); if (c.b) c.b.def = 0; }
  for (const a of acts) {
    if (!liveFoes().length) return 'win'; if (!alive().length) return 'lose';
    if (a.p) { const c = PC(a.p.who); if (c.hp <= 0) continue;
      if (c.b.st.stone) continue;
      if (c.b.stun) { c.b.stun = 0; continue; }
      if (c.b.st.sleep) { if (Math.random() < .45) { delete c.b.st.sleep; num('AWAKE', posOf(a.p.who)[0], posOf(a.p.who)[1] - 50, rgb(60, 140, 70)); } else { await msg(cName(a.p.who).split(' ').pop() + ' IS ASLEEP', 26); continue; } }
      if (c.b.st.charm) { const others = alive().filter(id => id !== a.p.who); if (others.length && Math.random() < .8) { await msg(cName(a.p.who).split(' ').pop() + ' IS CHARMED', 26); const [x, y] = posOf(a.p.who), t = others[rnd(others.length)]; c.b.pose = 'attack'; await wait(10); hurtPC(t, Math.max(1, Math.round(cStr(c) * 1.2))); c.b.pose = 'idle'; } else { delete c.b.st.charm; num('FREE', posOf(a.p.who)[0], posOf(a.p.who)[1] - 50, rgb(60, 140, 70)); } continue; }
      if (await partyAct(a.p) === 'flee') return 'flee'; }
    else { if (a.f.hp <= 0) continue;
      if (a.f.st.stone) continue;
      if (a.f.stun) { a.f.stun = 0; await msg(a.f.name + ' CANNOT MOVE', 26); continue; }
      if (a.f.st.sleep) { if (Math.random() < .45) delete a.f.st.sleep; else { await msg(a.f.name + ' IS ASLEEP', 22); continue; } }
      if (a.f.st.charm) { const others = liveFoes().filter(f => f !== a.f); if (others.length) { await msg(a.f.name + ' TURNS ON ITS OWN', 24); hurtFoe(others[rnd(others.length)], Math.max(1, Math.round(a.f.str * 1.6))); continue; } delete a.f.st.charm; continue; }
      await foeAct(a.f); }
  }
  for (const id of GS.party) { const c = PC(id); if (c.b && c.b.stun === 2) c.b.stun = 1; if (c.b && c.b.st.poison) { const d = Math.max(1, Math.round(c.mhp * .06)); c.hp = Math.max(0, c.hp - d); const [x, y] = posOf(id); num(d, x, y - 50, rgb(110, 160, 60)); sfx('hurt'); if (c.hp <= 0 && c.b) c.b.pose = 'down'; } }
  for (const f of liveFoes()) if (f.st.poison) { const d = Math.max(1, Math.round(f.mhp * .07)); hurtFoe(f, d); }
  if (!liveFoes().length) return 'win'; if (!alive().length) return 'lose'; return null;
}
const posOf = id => partySlot(GS.party.indexOf(id));
// elemental weakness: x1.5 into the weak spot, x.7 if it is their own element
function elMul(f, el) { if (!el) return 1; if (f.weak === el) return 1.5; if (f.el === el && !f.boss) return .7; return 1; }
const cartStr = c => cStr(c) * (cartHas('SAVE THE WORLD') ? 1.08 : 1);
function meleeMod(c) { return backRow(GS.party.indexOf(c.id)) ? (GS.form === 'COUCH' ? .5 : .7) : 1; }
async function partyAct(p) {
  const c = PC(p.who), b = c.b, [x, y] = posOf(p.who);
  if (p.k === 'defend') { b.def = 1; return; }
  if (p.k === 'item') { const I = ITEMS[p.item]; if (!GS.bag[p.item]) return; if (I.flee) { bagAdd(p.item, -1); if (BT.o.noflee) { await msg('NO ESCAPE', 30); return; } await msg('SMOKE!', 30); return 'flee'; }
    const t = p.tg[0], tc = PC(t); if (I.revive ? tc.hp > 0 : tc.hp <= 0 && !I.cure) return; await msg(cName(p.who).split(' ').pop() + ': ' + p.item, 20); useItem(p.item, tc); const [tx, ty] = posOf(t); fx('rise', tx, ty - 20, EL_COL.heal, 30); sfx('power'); if (tc.b) { tc.b.pose = 'idle'; if (I.cure) delete tc.b.st[I.cure]; } num(I.heal || I.healall || (I.cure ? 'CURED' : 'UP'), tx, ty - 46, rgb(60, 140, 70)); await wait(24); return; }
  if (p.k === 'combo') {
    const C = p.combo, partner = C.ids.find(x => x !== p.who); await msg(C.n + ': ' + C.line, 40); sfx('power');
    const [px, py] = posOf(partner); fx('link', x - 10, y - 30, [255, 220, 140], 26, { x0: px - 10, y0: py - 30 });
    for (const f of p.tg) { if (f.hp <= 0) continue;
      b.pose = 'walk'; const ranged = RANGED.includes(wType(c)); if (!ranged) for (let i = 0; i < 10; i++) { b.dx -= 4; await nextFrame(); } b.pose = 'attack';
      const base = (ITEMS[c.wpn].pow + skLv(c) * 1.6) * C.p * (1 + cStr(c) / 14);
      hurtFoe(f, Math.max(1, Math.round(base * elMul(f, C.el) * (.9 + Math.random() * .2)))); await wait(10);
      const pc = PC(partner), pb = pc.b; if (pb) { pb.pose = 'attack'; hurtFoe(f, Math.max(1, Math.round(base * .6 * elMul(f, C.el)))); pb.pose = 'idle'; }
      await wait(10); b.dx = 0; b.pose = 'idle'; }
    b.used.w = (b.used.w || 0) + 2; await wait(16); return;
  }
  if (p.k === 'tech') {
    const T = p.tech, tg = p.tg.filter(f => f.hp > 0); let tgs = tg.length ? tg : liveFoes().slice(0, 1); if (!tgs.length) return;
    if (c.wp < T[2]) { await msg('NOT ENOUGH WP', 26); return; } c.wp -= T[2]; BT.last = { k: 'tech', pow: T[3], kind: T[4], name: T[0] };
    if (T[2]) await msg(T[0], 22);
    const ranged = RANGED.includes(wType(c)) || p.who === 'ghost';
    b.pose = ranged ? 'shoot' : 'walk'; if (!ranged) for (let i = 0; i < 12; i++) { b.dx -= 4; await nextFrame(); }
    b.pose = ranged ? 'shoot' : 'attack'; sfx(ranged ? 'blip' : 'jump', [520, 80]);
    const hits = T[4] === 'two' ? 2 : 1;
    for (let h = 0; h < hits; h++) for (const f of tgs) { if (f.hp <= 0) continue; if (ranged) { fx('shot', f.x, f.y - 20, [70, 40, 30], 18, { x0: x - 14, y0: y - 26 }); await wait(6); }
      const crit = rnd(T[4] === 'crit' ? 8 : 16) === 0, base = (ITEMS[c.wpn].pow + skLv(c) * 1.6) * (1 + cartStr(c) / 15) * T[3] * (crit ? 1.5 : 1) * (.9 + Math.random() * .2) * (ranged ? 1 : meleeMod(c)) * elMul(f, T[5]), d = Math.max(1, Math.round(Math.max(base * .5, base - f.def * 1.3))); // armor stops at most half a hit: starter weapons still scratch a boss
      if (T[4] === 'interrupt' && f.machinePhase === 'charge') { f.interrupted = true; num('INTERRUPTED', f.x, f.y - 60, RUST); }
      hurtFoe(f, d, crit); if (crit) num('CRIT', f.x - 6, f.y - (f.boss ? 84 : 58), RUST); await wait(8); }
    b.used.w = (b.used.w || 0) + 1 + (T[2] ? 1 : 0);
    await wait(14); if (!ranged) { b.pose = 'walk'; for (let i = 0; i < 12; i++) { b.dx += 4; await nextFrame(); } } b.dx = 0; b.pose = 'idle'; await wait(6); return;
  }
  if (p.k === 'spell') {
    const S = SPELLS[p.spell], [sc, jp, kd, pw, el] = S; if (c.jp < jp) { await msg('NOT ENOUGH JP', 26); return; } c.jp -= jp; BT.last = { k: 'spell', spell: p.spell };
    await msg(p.spell, 20); b.pose = 'cast'; sfx('power'); await wait(14); const lv = (c.sch[sc] || { lv: 1 }).lv; b.used[sc] = (b.used[sc] || 0) + 1;
    const pow = v => v * (1 + cInt(c) / 13) * (cartHas('THE END') ? 1.1 : 1) * (backRow(GS.party.indexOf(p.who)) && GS.form === 'PYRAMID SCHEME' ? 1.15 : 1);
    if (kd === 'mag' || kd === 'all' || kd === 'drain') for (const f of (kd === 'all' || kd === 'drain' ? liveFoes() : p.tg.filter(f => f.hp > 0).concat(liveFoes()).slice(0, 1))) { fx('ring', f.x, f.y - 20, EL_COL[el] || EL_COL.curse, 26); await wait(8); const d = Math.max(1, Math.round(pow(pw + lv * 3) * elMul(f, el) * (.9 + Math.random() * .2) - f.int * .4)); hurtFoe(f, d); if (kd === 'drain') { const v = Math.round(d * .5); c.hp = Math.min(c.mhp, c.hp + v); num('+' + v, x, y - 56, rgb(60, 140, 70)); } }
    if (kd === 'heal' || kd === 'healall') for (const t of p.tg) { const tc = PC(t); if (tc.hp <= 0) continue; const [tx, ty] = posOf(t), v = Math.round((pw + lv * 4) * (1 + cInt(c) / 22)); tc.hp = Math.min(tc.mhp, tc.hp + v); fx('rise', tx, ty - 20, EL_COL.heal, 30); num(v, tx, ty - 46, rgb(60, 140, 70)); }
    if (kd === 'revive') for (const t of p.tg) { const tc = PC(t); if (tc.hp > 0) continue; tc.hp = Math.ceil(tc.mhp * (cartHas('LIVE FROM BEYOND') ? .5 : .33)); tc.b.pose = 'idle'; const [tx, ty] = posOf(t); fx('rise', tx, ty - 20, EL_COL.light, 34); }
    if (kd === 'cure') for (const t of p.tg) { const tc = PC(t); if (tc.hp <= 0) continue; tc.b.st = {}; const [tx, ty] = posOf(t), v = Math.round((pw + lv * 4) * (1 + cInt(c) / 22)); tc.hp = Math.min(tc.mhp, tc.hp + v); fx('rise', tx, ty - 20, EL_COL.water, 30); num(v, tx, ty - 46, rgb(60, 140, 70)); }
    if (kd === 'stun') for (const f of p.tg) { if (f.hp <= 0) continue; fx('ring', f.x, f.y - 20, EL_COL[el] || EL_COL.static, 22); if (Math.random() < (f.boss ? .3 : .75)) { f.stun = 1; num('STOP', f.x, f.y - 50, RUST); } else num('MISS', f.x, f.y - 50, FADED); }
    if (kd === 'sleep') for (const f of p.tg) { if (f.hp <= 0) continue; fx('rise', f.x, f.y - 24, [200, 180, 255], 26); if (Math.random() < (f.boss ? .25 : .65)) { f.st.sleep = 1; num('ASLEEP', f.x, f.y - 50, rgb(140, 110, 220)); } else num('MISS', f.x, f.y - 50, FADED); }
    if (kd === 'charm') for (const f of p.tg) { if (f.hp <= 0) continue; fx('ring', f.x, f.y - 20, [255, 150, 190], 24); if (!f.boss && Math.random() < .6) { f.st.charm = 2; num('CHARMED', f.x, f.y - 50, rgb(220, 100, 160)); } else num('MISS', f.x, f.y - 50, FADED); }
    if (kd === 'poison') for (const f of p.tg) { if (f.hp <= 0) continue; fx('rise', f.x, f.y - 24, EL_COL.water, 26); if (Math.random() < (f.boss ? .4 : .8)) { f.st.poison = 1; num('POISON', f.x, f.y - 50, rgb(110, 160, 60)); } else num('MISS', f.x, f.y - 50, FADED); }
    if (kd === 'buff') for (const id of alive()) { const tc = PC(id), [tx, ty] = posOf(id); if (p.spell === 'PHASE') tc.b.phase = 3; else if (p.spell === 'PASSKEY') tc.b.agi = (tc.b.agi || 0) + 3; else if (p.spell === 'WARD') tc.b.defward = 3; else tc.b.buff = 3; fx('rise', tx, ty - 20, EL_COL.light, 26); }
    await wait(20); b.pose = 'idle'; return;
  }
}
function hurtFoe(f, d, crit) { if (f.machinePhase === 'vent') d *= 2; if (f.st && f.st.stone) d = Math.round(d * 1.3); f.hp = Math.max(0, f.hp - d); f.fl = 10; fx('hit', f.x + rnd(9) - 4, f.y - 22 - rnd(10), null, 14); num(d, f.x, f.y - (f.boss ? 70 : 44), crit ? RUST : SEPIA); sfx('hurt'); post.shake = crit ? 4 : 2; if (f.st && f.st.sleep) delete f.st.sleep; if (f.hp <= 0) { f.dying = 1; sfx('powerdown'); } }
function hurtPC(id, d) {
  const c = PC(id), [x, y] = posOf(id); if (c.hp <= 0 || !c.b) return;
  const imm = eqOf(c, 'acc').imm;
  if (c.b.st && c.b.st.stone) d = Math.round(d * .5);
  if (imm === 'charm') c.b.st.charm = 0;
  if (c.b.phase && Math.random() < (cartHas('ANOTHER BOOGALOO') ? .48 : .4)) { num('PHASED', x, y - 50, FADED); return; }
  if (Math.random() < (cartHas('ANOTHER BOOGALOO') ? .08 : 0) && !BT.o.boss) { num('QUICK', x, y - 50, FADED); return; }
  if (c.b.def) d = Math.round(d / 2); if (c.b.defward) d = Math.round(d * .7);
  c.hp = Math.max(0, c.hp - d); c.b.fl = 10; fx('hit', x, y - 24, null, 14); num(d, x, y - 50, RUST); sfx('hurt'); post.shake = 3;
  if (c.b.st && c.b.st.sleep) delete c.b.st.sleep;
  if (cartHas('RETURN TO SENDER')) for (const f of liveFoes()) if (Math.abs(f.x - 260) < 200) { const r = Math.max(1, Math.round(d * .1)); f.hp = Math.max(0, f.hp - r); num(r, f.x, f.y - 40, GOLDC); }
  if (c.hp <= 0) { c.b.pose = 'down'; num('DOWN', x, y - 60, RUST); }
}
async function foeAct(f) {
  if (f.machinePhase) return generatorAct(f);
  const targets = alive(); if (!targets.length) return; const tg = targets[rnd(targets.length)];
  let mv; if (f.boss && f.moves) { const M = f.moves[rnd(f.moves.length)]; mv = M[0] === 'attack' ? { n: null, k: 'phys', p: 1 } : { n: M[0], k: M[1], p: M[2], el: M[3] }; }
  else { const s = f.skill[rnd(f.skill.length)]; mv = s === 'spec' || (s === 'SPAM' && rnd(2)) ? f.spec : { n: null, k: 'phys', p: 1 }; }
  if (mv.k === 'mimic') { const L = BT.last; if (!L) mv = { n: 'HU-MAN?', k: 'mag', p: 14, el: 'sound' }; else if (L.k === 'tech') mv = { n: 'MIMIC: ' + L.name, k: L.kind === 'all' ? 'all' : 'phys', p: L.kind === 'all' ? 18 : L.pow }; else { const S = SPELLS[L.spell]; mv = { n: 'MIMIC: ' + L.spell, k: S[2] === 'all' ? 'all' : S[2] === 'mag' ? 'mag' : 'heal', p: S[3] + 6, el: S[4] }; } }
  if (mv.n) await msg(mv.n, 24);
  f.dx = 0; for (let i = 0; i < 8; i++) { f.dx += 3; await nextFrame(); } f.pose = 'attack';
  const buffDef = c => (c.b.buff ? 1.25 : 1) * (c.b.defward ? 1.25 : 1);
  const melee = k => k === 'phys' || k === 'drain';
  const rowMod = id => melee(mv.k) && backRow(GS.party.indexOf(id)) ? .65 : 1;
  if (mv.k === 'phys' || mv.k === 'drain') { const c = PC(tg), d = Math.max(1, Math.round(f.str * (mv.k === 'drain' ? 1.8 : f.boss ? 2.1 : 1.6) * (mv.p > 1.5 && mv.k === 'phys' ? mv.p : 1) * (.85 + Math.random() * .3) * rowMod(tg) - cDef(c) * 1.7 * buffDef(c))); hurtPC(tg, d); if (mv.k === 'drain') { f.hp = Math.min(f.mhp, f.hp + d); num('+' + d, f.x, f.y - 60, rgb(60, 140, 70)); } }
  else if (mv.k === 'mag') { const c = PC(tg), [x, y] = posOf(tg); fx('ring', x, y - 20, EL_COL[mv.el] || EL_COL.curse, 24); await wait(8); hurtPC(tg, Math.max(1, Math.round((mv.p + f.int * .9) * (.85 + Math.random() * .3) - cInt(c) * .4))); }
  else if (mv.k === 'all') { for (const id of alive()) { const c = PC(id), [x, y] = posOf(id); fx('ring', x, y - 20, EL_COL[mv.el] || [140, 90, 60], 22); hurtPC(id, Math.max(1, Math.round((mv.p + f.int * .5 + f.str * .4) * (.85 + Math.random() * .3) * rowMod(id) - cDef(c) * .9 * buffDef(c)))); } }
  else if (mv.k === 'stun') { const c = PC(tg), [x, y] = posOf(tg); fx('ring', x, y - 20, [140, 140, 160], 22); if (Math.random() < .6 && !c.b.def) { c.b.stun = 2; num('FROZEN', x, y - 52, RUST); } else num('RESIST', x, y - 52, FADED); }
  else if (mv.k === 'sleep') { const c = PC(tg), [x, y] = posOf(tg); fx('rise', x, y - 24, [200, 180, 255], 26); if (Math.random() < .5 && !c.b.st.stone) { c.b.st.sleep = 1; num('ASLEEP', x, y - 52, rgb(140, 110, 220)); } else num('RESIST', x, y - 52, FADED); }
  else if (mv.k === 'poison') { const c = PC(tg), [x, y] = posOf(tg); fx('rise', x, y - 24, EL_COL.water, 26); if (Math.random() < .55) { c.b.st.poison = 1; num('POISON', x, y - 52, rgb(110, 160, 60)); } else num('RESIST', x, y - 52, FADED); }
  else if (mv.k === 'charm') { const c = PC(tg), [x, y] = posOf(tg); fx('ring', x, y - 20, [255, 150, 190], 24); if (Math.random() < .45 && !eqOf(c, 'acc').imm) { c.b.st.charm = 2; num('CHARMED', x, y - 52, rgb(220, 100, 160)); } else num('RESIST', x, y - 52, FADED); }
  else if (mv.k === 'heal') { const v = Math.round(mv.p); f.hp = Math.min(f.mhp, f.hp + v); fx('rise', f.x, f.y - 24, EL_COL.heal, 30); num('+' + v, f.x, f.y - 60, rgb(60, 140, 70)); }
  await wait(16); f.pose = 'idle'; for (let i = 0; i < 8; i++) { f.dx -= 3; await nextFrame(); } f.dx = 0;
  for (const id of GS.party) { const c = PC(id); if (c.b.buff) c.b.buff -= .34; if (c.b.phase) c.b.phase -= .34; if (c.b.defward) c.b.defward -= .34; if (c.b.buff < 0) c.b.buff = 0; if (c.b.phase < 0) c.b.phase = 0; if (c.b.defward < 0) c.b.defward = 0; if (c.b.st.charm) { c.b.st.charm--; if (c.b.st.charm <= 0) delete c.b.st.charm; } }
}
// ---------------- after ----------------
async function victory() {
  GS.br++; GS.battles++; const xp = BT.foes.reduce((s, f) => s + (f.xp || 4), 0), gold = xp * 7 + GS.br * 2; GS.gold += gold;
  for (const id of alive()) PC(id).b.pose = 'win'; music('rswin'); await msg('VICTORY  +' + gold + 'G', 50);
  const notes = [], hard = BT.foes.reduce((s, f) => s + f.mhp, 0);
  for (const f of BT.foes) if (f.hp <= 0 && f.drop && Math.random() < .22 + (f.rank || 2) * .08) { const n = f.drop[Math.min(f.drop.length - 1, (f.rank || 2) + (rnd(3) === 0 ? 1 : 0))]; if (n && bagRoom(n) > 0) { bagAdd(n); notes.push('DROPPED ' + n); } }
  for (const id of GS.party) { const c = PC(id), u = c.b.used; if (!u) continue; if (c.hp <= 0) continue;
    // hit points grow when the fight was big compared to you
    if (Math.random() < Math.min(.85, .2 + hard / c.mhp * .6)) { const g = 3 + rnd(4) + (BT.o.boss ? 8 : 0) + (cartHas('RESIDENT HUMAN') ? 1 : 0); c.mhp += g; c.hp += g; notes.push(cName(id) + ' MAX HP +' + g); }
    if (u.w) { const t = wType(c), s = c.sk[t] = c.sk[t] || { lv: 1, xp: 0 }; s.xp += u.w * (6 + rnd(6)) * (1 + BT.foes.length * .15); while (s.xp >= 30 + s.lv * 14) { s.xp -= 30 + s.lv * 14; s.lv++; notes.push(cName(id) + ' ' + SKILLS[t] + ' LV ' + s.lv); if (rnd(2)) { c.mwp++; c.wp++; }
      const nt = TECHS[t].find(T => T[1] && T[1] <= s.lv && !c.techs.includes(T[0])); if (nt && (rnd(3) || s.lv >= nt[1] + 2)) { c.techs.push(nt[0]); notes.push('* ' + cName(id) + ' LEARNED ' + nt[0]); } } }
    for (const sc of SCHOOLS) if (u[sc]) { const s = c.sch[sc] = c.sch[sc] || { lv: 1, xp: 0 }; s.xp += u[sc] * 20; while (s.xp >= 40 + s.lv * 16) { s.xp -= 40 + s.lv * 16; s.lv++; c.mjp += 1 + rnd(2); notes.push(cName(id) + ' ' + sc + ' LV ' + s.lv); } } }
  if (rnd(5) === 0) { const n = pick(['TONIC', 'TONIC', 'SODA', 'GUM', 'ENERGY DRINK']); if (bagRoom(n) > 0) { bagAdd(n); notes.push('FOUND ' + n); } }
  for (const n of notes) { sfx(n[0] === '*' ? 'power' : 'get'); await msg(n, n[0] === '*' ? 60 : 36); }
  await wait(10);
}
