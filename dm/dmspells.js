'use strict';
// ================= DARK MONDAY: spells (programs), spell points, statuses =================
// Spell points come back on rest. A cast takes the caster's hands for a moment. Casters: Linda, Yoko, Face, Ghost, JB.
const CASTERS = { LINDA: { base: 4, per: 2, spells: ['MEMO', 'SYNERGY', 'LAYOFFS'] }, YOKO: { base: 3, per: 2, spells: ['TRANSLATE', 'SECOND CHANCE', 'ASSIST', 'LUMEN'] },
  FACE: { base: 3, per: 2, spells: ['BACKUP', 'PATCH', 'REBOOT', 'LUMEN'] }, GHOST: { base: 3, per: 2, spells: ['SCARE', 'PHASE', 'ENTRANCE'] }, JB: { base: 2, per: 1, spells: ['DEDUCE'] } };
const SPELLS = {
  'MEMO':          { cost: 2, lvl: 1, kind: 'bolt', dmg: [5, 10], col: '#ffe040', desc: 'A sharp memo. Hits the first thing ahead.' },
  'SYNERGY':       { cost: 3, lvl: 1, kind: 'ward', ac: 2, dur: 3600, col: '#ff78b4', desc: 'A shield of buzzwords. +2 armor for the party for a minute.' },
  'LAYOFFS':       { cost: 5, lvl: 3, kind: 'blast', dmg: [4, 9], col: '#ff3050', desc: 'Hits everything in the three cells ahead.' },
  'BACKUP':        { cost: 2, lvl: 1, kind: 'heal', amt: [8, 14], col: '#70ff30', desc: 'Restores one party member from backup.' },
  'PATCH':         { cost: 2, lvl: 1, kind: 'cure', col: '#70ff30', desc: 'Cures poison and hold on one member.' },
  'REBOOT':        { cost: 5, lvl: 2, kind: 'revive', col: '#70ff30', desc: 'Brings a fallen member back with a third of their health.' },
  'SECOND CHANCE': { cost: 3, lvl: 1, kind: 'heal', amt: [10, 18], cure: 1, col: '#80e8ff', desc: 'Heals one member and clears poison and hold.' },
  'TRANSLATE':     { cost: 1, lvl: 1, kind: 'translate', col: '#80e8ff', desc: 'Reads the glyph on the wall ahead.' },
  'ASSIST':        { cost: 3, lvl: 2, kind: 'haste', dur: 2400, col: '#80e8ff', desc: 'Everybody acts faster for forty seconds.' },
  'LUMEN':         { cost: 2, lvl: 1, kind: 'light', dur: 5400, col: '#fff090', desc: 'Light in the dark places, for a minute and a half.' },
  'SCARE':         { cost: 2, lvl: 1, kind: 'scare', dur: 360, col: '#e0e0ff', desc: 'Everything within three cells ahead forgets to attack for six seconds.' },
  'PHASE':         { cost: 4, lvl: 1, kind: 'phase', col: '#e0e0ff', desc: 'Walk through one thin wall. Thick walls stop you.' },
  'ENTRANCE':      { cost: 3, lvl: 2, kind: 'stun', dur: 300, col: '#ff40d0', desc: 'A good entrance. The next cell cannot look away for five seconds.' },
  'DEDUCE':        { cost: 2, lvl: 1, kind: 'deduce', col: '#ffb258', desc: 'Reveals hidden doors within three cells.' },
};
const spMaxOf = c => { const k = CASTERS[c.id]; return k ? k.base + k.per * (c.lvl - 1) : 0; };
const spellsOf = c => { const k = CASTERS[c.id]; return k ? k.spells.filter(n => SPELLS[n].lvl <= c.lvl) : []; };
function initCaster(c) { c.spMax = spMaxOf(c); c.sp = c.spMax; }
function setCell(lv, x, y, ch) { lv.rows[y] = lv.rows[y].slice(0, x) + ch + lv.rows[y].slice(x + 1); lv._dk = null; }

function castSpell(ci, name, ti) {
  const g = GM, c = PARTY[ci], sp = SPELLS[name];
  if (!g || !c || !sp) return false; if (c.dead) { msg(c.name + ' IS DOWN.'); return false; } if (c.hold > 0) { msg(c.name + ' IS HELD.', hex('#ff6a7a')); return false; }
  if (c.sp < sp.cost) { msg('NOT ENOUGH SP FOR ' + name + '.', hex('#ff6a7a')); sfx('bump'); return false; }
  if (c.cool[0] > 0 || c.cool[1] > 0) { msg(c.name + ' IS BUSY.'); return false; }
  const lv = g.lv, col = hex(sp.col), tgt = PARTY[ti == null ? ci : ti];
  const say1 = t => msg(c.name + ' CASTS ' + name + (t ? ': ' + t : '.'), col);
  const fire = () => { c.sp -= sp.cost; c.cool = [50, 50]; c.cmax = [50, 50]; sfx('zap'); };
  if (sp.kind === 'bolt' || sp.kind === 'blast') {
    const ms = []; for (let d = 1; d <= (sp.kind === 'bolt' ? RANGE : 3); d++) { const x = g.x + DX[g.dir] * d, y = g.y + DY[g.dir] * d; if (isBlock(lv, x, y) || (cellCh(lv, x, y) === 'D' && lv.st.door[x + ',' + y].open < .5)) break; const m = mobAt(lv, x, y); if (m) { ms.push(m); if (sp.kind === 'bolt') break; } }
    if (!ms.length) { msg(c.name + ': NOTHING TO TARGET.'); return false; }
    fire(); say1(); for (const m of ms) { const d = cint(sp.dmg[0], sp.dmg[1]) + (c.lvl >> 1); m.hp -= d; m.flash = 5; fxNum(m.sx || 130, (m.sy || 80) - 6, d, col); if (sp.kind === 'bolt') fxBeam(DV.x + DV.w / 2, DV.y + DV.h, m.sx || 130, m.sy || 80, col); if (m.hp <= 0) killMob(m); }
    if (sp.kind === 'blast') post.flash = .3; return true;
  }
  if (sp.kind === 'ward') { fire(); say1('+' + sp.ac + ' ARMOR.'); for (const p of PARTY) p.buffAc = sp.ac; g.buffT = sp.dur; return true; }
  if (sp.kind === 'heal') { if (tgt.dead) { msg('THEY NEED A REBOOT.'); return false; } fire(); const n = cint(sp.amt[0], sp.amt[1]) + (c.lvl >> 1); tgt.hp = Math.min(tgt.max, tgt.hp + n); if (sp.cure) { tgt.poison = 0; tgt.hold = 0; } say1(tgt.name + ' +' + n); post.flash = .12; return true; }
  if (sp.kind === 'cure') { fire(); tgt.poison = 0; tgt.hold = 0; say1(tgt.name + ' IS CLEAR.'); return true; }
  if (sp.kind === 'revive') { if (!tgt.dead) { msg(tgt.name + ' IS NOT DOWN.'); return false; } fire(); tgt.dead = 0; tgt.hp = Math.max(1, Math.round(tgt.max / 3)); tgt.food = Math.max(tgt.food, 20); say1(tgt.name + ' IS BACK.'); post.flash = .4; sfx('get'); return true; }
  if (sp.kind === 'haste') { fire(); g.haste = sp.dur; say1('EVERYONE SPEEDS UP.'); return true; }
  if (sp.kind === 'light') { fire(); g.light = sp.dur; say1('THE DARK PULLS BACK.'); return true; }
  if (sp.kind === 'scare' || sp.kind === 'stun') {
    const ms = []; for (let d = 1; d <= (sp.kind === 'scare' ? 3 : 1); d++) { const x = g.x + DX[g.dir] * d, y = g.y + DY[g.dir] * d; if (isBlock(lv, x, y)) break; const m = mobAt(lv, x, y); if (m) ms.push(m); }
    if (!ms.length) { msg(c.name + ': NOBODY THERE.'); return false; } fire(); say1(); for (const m of ms) { if (sp.kind === 'scare') m.fear = sp.dur; else m.stun = sp.dur; fxNum(m.sx || 130, (m.sy || 80) - 6, sp.kind === 'scare' ? 'BOO' : 'OH', col); } return true;
  }
  if (sp.kind === 'phase') {
    const x1 = g.x + DX[g.dir], y1 = g.y + DY[g.dir], x2 = x1 + DX[g.dir], y2 = y1 + DY[g.dir];
    if (!'#S'.includes(cellCh(lv, x1, y1)) || isBlock(lv, x2, y2) || mobAt(lv, x2, y2) || !walkable(lv, x2, y2)) { msg('THERE IS NO THIN WALL TO PHASE.', hex('#ff6a7a')); return false; }
    fire(); say1(); sfx('phase'); g.anim = { t: 0, n: 14, phase: 1, nx: x2, ny: y2 }; return true;
  }
  if (sp.kind === 'deduce') { let n = 0; for (let y = g.y - 3; y <= g.y + 3; y++) for (let x = g.x - 3; x <= g.x + 3; x++) if (cellCh(lv, x, y) === 'S') { setCell(lv, x, y, 'D'); lv.st.door[x + ',' + y] = { open: 0, locked: 0 }; n++; } if (!n) { msg(c.name + ': NOTHING HIDDEN NEARBY.'); return false; } fire(); say1(n + ' HIDDEN DOOR' + (n > 1 ? 'S' : '') + '.'); sfx('get'); return true; }
  if (sp.kind === 'translate') {
    const dk = faceKey(g), f = lv.ev && lv.ev.translate && lv.ev.translate[dk], t = lv.trig && lv.trig.translate && lv.trig.translate[dk];
    if (!f && !t) { msg(c.name + ': NOTHING HERE TO READ.'); return false; } fire(); say1(); if (f) f(g); if (t) fireTrig(g, t, 'translate' + dk); return true;
  }
  return false;
}
// menus (keyboard or mouse): who casts, which spell, on whom
async function castMenu(ci) {
  const c = PARTY[ci]; const list = spellsOf(c); if (!list.length) { msg(c.name + ' HAS NO PROGRAMS.'); return; }
  const i = await choose(list.map(n => n + '  ' + SPELLS[n].cost + 'SP'), { x: 270, y: 20, cancel: 1, title: c.name + '  SP ' + c.sp + '/' + c.spMax }); if (i < 0) return;
  const name = list[i], sp = SPELLS[name]; let ti = ci;
  if (sp.kind === 'heal' || sp.kind === 'cure' || sp.kind === 'revive') { ti = await choose(PARTY.map(p => p.name + (p.dead ? ' (DOWN)' : ' ' + p.hp + '/' + p.max)), { x: 270, y: 20, cancel: 1, title: 'ON WHOM' }); if (ti < 0) return; }
  castSpell(ci, name, ti);
}
async function castWho() { const c = PARTY.map((p, i) => i).filter(i => spellsOf(PARTY[i]).length); if (!c.length) return; const i = c.length === 1 ? 0 : await choose(c.map(k => PARTY[k].name), { x: 270, y: 20, cancel: 1, title: 'WHO CASTS' }); if (i >= 0) await castMenu(c[i]); }

// statuses and timers (called every frame while the world runs)
function tickStatus(g) {
  for (const c of PARTY) { if (c.dead) { c.poison = c.hold = 0; continue; }
    if (c.hold > 0) c.hold--;
    if (c.poison > 0) { c.poison--; if (c.poison % 90 === 0) { c.hp -= 1; c.hurt = 4; if (c.hp <= 0) { c.hp = 0; c.dead = 1; msg(c.name + ' SUCCUMBS TO THE POISON.', hex('#ff3050')); checkWipe(); } } } }
  if (g.buffT > 0 && --g.buffT === 0) { for (const c of PARTY) c.buffAc = 0; msg('SYNERGY FADES.'); }
  if (g.haste > 0) g.haste--; if (g.light > 0 && --g.light === 0) msg('THE LIGHT FADES.');
}
const inDark = g => (g.lv.darkZones || []).some(([x0, y0, x1, y1]) => g.x >= x0 && g.x <= x1 && g.y >= y0 && g.y <= y1) && !(g.light > 0);
