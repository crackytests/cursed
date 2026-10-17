'use strict';
// ================= VISITOR: THE NORMALCY: interaction ("frobbing", as the developers of a certain other game called it) =================
// FROB target: { kind, e (entity) | d (door), x, y, label, name }
function findFrob(M) {
  if (P.drone || P.busy) return null;
  const cands = [], reach = 1.7, fx = P.x + Math.cos(P.aim) * .7, fy = P.y + Math.sin(P.aim) * .7;
  let mwx = null, mwy = null; if (MOUSE.on) { mwx = (MOUSE.x + G.cam.x) / TW; mwy = (MOUSE.y + G.cam.y + 8) / TH; }
  const score = (x, y) => { const d = Math.hypot(x - P.x, y - P.y); if (d > reach) return -1; let s = 3 - d - Math.hypot(x - fx, y - fy) * .7; if (mwx !== null && Math.hypot(x - mwx, y - mwy) < .9) s += 4; return s; };
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const tx = (P.x | 0) + dx, ty = (P.y | 0) + dy, i = ty * M.w + tx; const d = M.doors[i]; if (d && inMap(M, tx, ty)) { const s = score(tx + .5, ty + .5); if (s > -1) cands.push({ s, kind: 'door', d, x: tx + .5, y: ty + .5 }); } }
  for (const e of M.ents) {
    if (e.gone || e.carried || (e.hidden && !e.frob)) continue; let x = e.x, y = e.y, kind = null;
    if (e.k === 'prop') { const p = PROPS[e.p]; if (!(p.search || p.comp || p.read || p.vend || e.frob || e.text || e.comp || e.items || p.push || e.shop)) continue; x = e.x + p.fw / 2; y = e.y + p.fh - .4; kind = 'prop';
      // big props: reach from any edge
      const cx = clamp(P.x, e.x, e.x + p.fw), cy = clamp(P.y, e.y, e.y + p.fh); if (Math.hypot(cx - P.x, cy - P.y) < 1.1) { x = cx; y = cy; } }
    else if (e.k === 'item') kind = 'item';
    else if (e.k === 'npc') kind = 'npc';
    else if (e.k === 'cam' || e.k === 'turret' || e.k === 'laser') { if (e.dead || e.off) continue; kind = 'device'; }
    else if (e.k === 'exit' && e.frobbable) kind = 'exit';
    else if (e.k === 'use') kind = 'use';
    if (!kind) continue; if (e.k === 'npc' && !(e.conv || e.down || e.dead || e.med || e.repair || e.shop || e.frob || e.talk)) continue; if (e.k === 'npc' && (e.down || e.dead) && e.hidden) continue;
    const s = score(x, y); if (s > -1) cands.push({ s, kind, e, x, y });
  }
  if (!cands.length) return null; cands.sort((a, b) => b.s - a.s); const f = cands[0]; f.label = frobLabel(M, f); return f;
}
function frobLabel(M, f) {
  const held = P.held && ITEMS[P.held.id].tool;
  if (f.kind === 'door') { const d = f.d; if (d.broken) return null; if (d.open) return ['CLOSE', d.name];
    if (d.lock && !d.unlocked) { if (P.keys[d.key]) return ['UNLOCK', d.name + ' (KEY)']; if (d.code) return ['USE KEYPAD', d.name]; if (held === 'pick' && d.pick !== 0) return ['PICK LOCK', d.name + ' ' + Math.round(d.str * 100) + '%']; return ['LOCKED', d.name + (d.pick === 0 ? ' (CAN\'T PICK)' : ' ' + Math.round(d.str * 100) + '%')]; }
    return ['OPEN', d.name]; }
  const e = f.e;
  if (f.kind === 'item') return ['PICK UP', ITEMS[e.item] ? ITEMS[e.item].name + (e.n > 1 ? ' x' + e.n : '') : e.item];
  if (f.kind === 'npc') { if (e.dead || e.down) { if (e.items && e.items.length) return ['SEARCH', (e.dead ? 'BODY: ' : 'UNCONSCIOUS: ') + (e.name || '')]; return ['CARRY', e.name || 'BODY']; }
    if (e.med) return ['USE', 'MEDICAL BOT']; if (e.repair) return ['USE', 'REPAIR BOT']; return ['TALK', e.name || '']; }
  if (f.kind === 'device') { const nm = e.k === 'cam' ? 'CAMERA' : e.k === 'turret' ? 'TURRET' : 'LASER TRIPWIRE'; return [held === 'multi' ? 'BYPASS' : 'INSPECT', nm + ' ' + Math.round((e.str || .4) * 100) + '%']; }
  if (f.kind === 'exit') return [e.verb || 'GO', e.label || 'EXIT'];
  if (f.kind === 'use') return [e.verb || 'USE', e.label || ''];
  const p = PROPS[e.p];
  if (e.frob && e.label) return [e.verb || 'USE', e.label];
  if (e.comp || p.comp) return ['USE', e.label || (e.p === 'atm' ? 'ATM' : e.p === 'seccomp' ? 'SECURITY TERMINAL' : 'COMPUTER')];
  if (e.shop) return ['SHOP', e.label || 'VENDOR'];
  if (p.vend && !e.items) return ['BUY', 'PROP COLA (P$3)'];
  if (e.text || p.read) return ['READ', e.label || (e.p === 'bookshelf' ? 'BOOKS' : 'SIGN')];
  if (p.search || (e.items && e.items.length && !e.searched && !p.breakable)) { if (e.locked && !e.unlocked) return [held === 'pick' ? 'PICK LOCK' : 'LOCKED', e.label || e.p.toUpperCase()]; return [e.searched ? 'SEARCHED' : 'SEARCH', e.label || e.p.toUpperCase()]; }
  if (p.push) return ['PUSH', e.p === 'mcrate' ? 'METAL CRATE' : 'CRATE'];
  return ['USE', e.label || e.p];
}
async function frob(M, f) {
  if (!f || !f.label) return; P.reachT = 12; P.reachA = Math.atan2(f.y - P.y, f.x - P.x);
  const held = P.held && ITEMS[P.held.id].tool;
  if (f.kind === 'door') { const d = f.d;
    if (d.open) { closeDoor(M, d); return; }
    if (d.lock && !d.unlocked) {
      if (P.keys[d.key]) { d.unlocked = 1; msg('Unlocked with ' + (KEYNAMES[d.key] || 'the key') + '.'); sfx('unlock'); openDoor(M, d, P); return; }
      if (d.code) { keypadUI({ code: d.code, door: d.id }); return; }   // a door with a code has its own keypad
      if (held === 'pick' && d.pick !== 0) { useTools(M, d, 'pick', () => { d.unlocked = 1; openDoor(M, d, P); msg('Lock picked.'); }); return; }
      sfx('locked'); msg(d.code ? 'Locked. There must be a keypad.' : d.pick === 0 ? (d.hp ? 'Locked. No keyhole. Too heavy to pick. Explosives might do it.' : 'Locked tight. There has to be another way in.') : 'Locked. Equip lockpicks (belt) to pick it, or blow it open.'); if (!F['hint_lock']) { F.hint_lock = 1; chatSay('lockpicks are on your belt carl', 1); } return; }
    if (d.onOpen && d.onOpen(M, d) === false) return;
    openDoor(M, d, P); return; }
  const e = f.e;
  if (f.kind === 'item') { if (giveItem(e.item, e.n || 1)) { removeEnt(M, e); sfx('pickup'); if (e.onTake) e.onTake(M, e); } return; }
  if (f.kind === 'npc') {
    if (e.dead || e.down) { if ((e.items && e.items.length) || e.keyOnBody) { lootBody(e); return; } pickBody(M, e); return; }
    if (e.med) { await medbotUI(e); return; } if (e.repair) { await repairUI(e); return; }
    if (e.frob) { await e.frob(M, e); return; }
    if (hostileTo(e, P) && !(e.invuln && e.conv)) { bark(M, e, 'spot', 1); return; }   // story characters always talk, whatever the guards think
    if (e.shop && !e.conv) { await shopUI(e.shop, e); return; }
    if (e.conv) { await startConv(e.conv, e); return; }
    if (e.talk) { const lines = typeof e.talk === 'function' ? e.talk(M, e) : e.talk; e.talkI = ((e.talkI || 0) + 1) % [].concat(lines).length; M.fx.push({ txt: [].concat(lines)[e.talkI], x: e.x, y: e.y, t: 160, t0: 160, c: WHITE, wrap: 1 }); logConv((e.name || '') + ': ' + [].concat(lines)[e.talkI]); e.face = angTo(e, P); return; }
    return; }
  if (f.kind === 'device') { if (held !== 'multi') { msg('Equip a multitool to bypass it.'); return; } useTools(M, e, 'multi', () => { e.off = 1; e.bypassed = 1; msg((e.k === 'cam' ? 'Camera' : e.k === 'turret' ? 'Turret' : 'Laser') + ' disabled.'); sfx('powerdown'); }); return; }
  if (f.kind === 'exit') { if (e.when && !e.when()) { msg(e.no || 'Not now.'); return; } if (e.to === M.id) { const sp = M.ents.find(s => s.k === 'spawn' && s.id === e.at); if (sp) { P.x = sp.x + .5; P.y = sp.y + .5; M.visDirty = 1; } return; } gotoMap(e.to, e.at); return; }
  if (f.kind === 'use') { await e.fn(M, e); return; }
  const p = PROPS[e.p];
  if (e.frob) { await e.frob(M, e); return; }
  if (e.comp || p.comp) { await computerUI(e); return; }
  if (e.shop) { await shopUI(e.shop, e); return; }
  if (p.vend && !e.items) { if (P.cred < 3) { msg('Not enough credits.'); sfx('locked'); return; } P.cred -= 3; giveItem('soda'); sfx('vend'); return; }
  if (e.text || p.read) { await readText(e.text || (e.p === 'bookshelf' ? 'books' : 'nothing'), e); return; }
  if (p.search || (e.items && e.items.length && !e.searched && !p.breakable)) {
    if (e.locked && !e.unlocked) { if (held === 'pick') useTools(M, e, 'pick', () => { e.unlocked = 1; msg('Opened.'); }); else { msg('Locked.'); sfx('locked'); } return; }
    if (e.searched) { msg('Nothing else.'); return; }
    e.searched = 1; const items = e.items || rollCrate(e); let got = 0;
    for (const [id, n] of items) { if (giveItem(id, n || 1)) got++; else spawnEnt(M, { k: 'item', item: id, n, x: P.x, y: P.y }); }
    if (!got) msg(pick(['Nothing useful.', 'Empty.', 'Receipts. Old ones.', 'A bent paperclip and a bad feeling.'])); else sfx('pickup');
    if (e.onSearch) e.onSearch(M, e); return; }
  if (p.push) { const heavy = p.heavy && !(P.augOn.muscle || P.augOn.strength); if (heavy) { msg('Too heavy. (Microfibral Muscle could move it.)'); return; }
    const dx = Math.round(Math.cos(P.aim)), dy = dx ? 0 : Math.sign(Math.sin(P.aim)), nx = e.x + dx, ny = e.y + dy;
    if (canWalk(M, nx, ny, {}) && !(Math.floor(P.x) === nx && Math.floor(P.y) === ny)) { e.x = nx; e.y = ny; rebuildBlock(M); sfx('push'); } else msg('It won\'t move that way.'); return; }
}
function lootBody(e) {
  let names = []; if (e.keyOnBody) { giveKey(e.keyOnBody[0], e.keyOnBody[1]); e.keyOnBody = null; } for (const [id, n] of e.items) { if (giveItem(id, n || 1, true)) names.push(ITEMS[id].name + (n > 1 ? ' x' + n : '')); }
  e.items = []; sfx('pickup'); msg(names.length ? 'Found: ' + names.join(', ') : 'Nothing.');
}
// lockpicks and multitools: each tool lowers the strength by a skill-dependent amount, about a second a tool
function useTools(M, target, kind, done) {
  const id = kind === 'pick' ? 'lockpick' : 'multitool', skill = kind === 'pick' ? 'lockpicking' : 'electronics';
  const per = [.1, .25, .4, .75][sk(skill)];
  if (target.str === undefined) target.str = .4;
  P.busy = { t: 0, kind, target, onTick: () => { const it = invFind(id); if (!it) { msg('Out of ' + ITEMS[id].name + 's.'); P.busy = null; return; } removeItem(it); target.str = Math.max(0, target.str - per); sfx('pick'); makeNoise(M, P.x, P.y, 2, 'tool', P); if (target.str <= 0) { P.busy = null; done(); sfx('unlock'); if (!F.xp_tool) { F.xp_tool = 1; } } }, x: P.x, y: P.y };
}
function updateBusy(M) {
  const b = P.busy; if (!b) return;
  if (Math.hypot(P.x - b.x, P.y - b.y) > .3 || P.hurtT > 6) { P.busy = null; msg('Interrupted.'); return; }
  b.t += DT; if (b.t >= 1) { b.t = 0; b.onTick(); }
}
const KEYNAMES = {};
function giveKey(id, name) { P.keys[id] = 1; KEYNAMES[id] = name; msg('KEY: ' + name); sfx('get'); }
