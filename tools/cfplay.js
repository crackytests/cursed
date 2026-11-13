// CHROME FORCE playtest bot: validates maps/towns, then plays the whole campaign headless (AI drives both sides).
// node tools/cfplay.js            env: SEED=n  MAXTRY=n (retries per battle)  ONLY=b11 (one battle)  LOG=1
const G = require('./g2vm');
const FILES = ['g2/engine2', 'g2/fm', 'cf/cfsynth', 'cf/cfscore', 'cf/cfart', 'cf/cfports', 'cf/cfdata', 'cf/cfrules', 'cf/cfmaps', 'cf/cfstory', 'cf/cfbanter', 'cf/cfui', 'cf/cfbattle', 'cf/cftown', 'cf/cfmain'];
const ctx = G.load(FILES);
const R = s => G.R(ctx, s);
let fails = 0; const bad = m => { fails++; console.log('FAIL', m); };

// ---------- static checks ----------
R(`
var __errs = [];
for (const id in BATTLES) {
  const D = BATTLES[id], map = normMap(D.map), w = map[0].length, h = map.length, Bx = { map, w, h, units: [] };
  if (D.start.length < 12) __errs.push(id + ' has only ' + D.start.length + ' start tiles');
  const seen = {};
  for (const [x, y] of D.start) { const c = tileAt(Bx, x, y); if (moveCost('cent', c) >= X) __errs.push(id + ' start ' + x + ',' + y + ' blocked (' + c + ')'); if (seen[x + ',' + y]) __errs.push(id + ' dup start ' + x + ',' + y); seen[x + ',' + y] = 1; }
  for (const f of D.foes) { const [t, x, y] = f; if (!FOES[t]) { __errs.push(id + ' unknown foe ' + t); continue; } const c = tileAt(Bx, x, y); if (moveCost(FOES[t].mt, c) >= X) __errs.push(id + ' foe ' + t + ' at ' + x + ',' + y + ' on ' + c); if (seen[x + ',' + y]) __errs.push(id + ' overlap at ' + x + ',' + y); seen[x + ',' + y] = 1; }
  for (const [x, y, it] of D.chests) { const c = tileAt(Bx, x, y); if (moveCost('foot', c) >= X) __errs.push(id + ' chest on ' + c + ' at ' + x + ',' + y); if (!it.startsWith('arch:') && !ITEMS[it]) __errs.push(id + ' bad chest item ' + it); if (it.startsWith('arch:') && !ARCHIVE.find(a => a.id === it.slice(5))) __errs.push(id + ' bad archive ' + it); }
  // every foe reachable on foot (or by air) from the first start tile
  const u = { x: D.start[0][0], y: D.start[0][1], mt: 'foot', side: 'ally' }, Dm = distField(Bx, u, [u]);
  for (const f of D.foes) if (Dm[f[2] * w + f[1]] >= 1e9 && FOES[f[0]].mt !== 'fly') { const near = [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy]) => Dm[(f[2]+dy) * w + f[1]+dx] < 1e9); if (!near) __errs.push(id + ' foe ' + f[0] + ' unreachable'); }
}
for (const t in TOWNS) {
  const T = TOWNS[t]; TV.map = normMap(T.map); TV.w = TV.map[0].length; TV.h = TV.map.length;
  if (TV.map[T.gate[1]][T.gate[0]] !== '^') __errs.push(t + ' gate not on ^');
  if (!walkable(...T.spawn)) __errs.push(t + ' spawn blocked');
  for (const n of TOWN_NPCS[t] || []) if (n.kind === 'recruit' && !Object.keys(HEROES).some(k => HEROES[k].n === n.name)) __errs.push(t + ' recruit ' + n.name + ' unknown');
}
for (const ch of CHAPTERS) for (const b of ch.battles) if (!BATTLES[b]) __errs.push('missing battle ' + b);
for (const id in BATTLES) if (!CHAPTERS.some(c => c.battles.includes(id))) __errs.push('battle not in any chapter ' + id);
for (const id in BATTLES) for (const [r, list] of BATTLES[id].waves || []) for (const f of list) { const map = normMap(BATTLES[id].map); if (!FOES[f[0]]) __errs.push(id + ' wave foe ' + f[0]); else if (moveCost(FOES[f[0]].mt, (map[f[2]] || '')[f[1]] || '#') >= X) __errs.push(id + ' wave foe on blocked ' + f[1] + ',' + f[2]); }
// every door opens into a room, and every room hangs off a real door
for (const t in TOWNS) {
  const m = normMap(TOWNS[t].map), keys = []; m.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'd' && r[x - 1] !== 'd') keys.push(x + ',' + y); }));
  for (const k of keys) if (!(TOWN_ROOMS[t] || {})[k]) __errs.push(t + ' door ' + k + ' has no room');
  for (const k in TOWN_ROOMS[t] || {}) {
    if (!keys.includes(k)) __errs.push(t + ' room ' + k + ' has no door');
    const R = TOWN_ROOMS[t][k], rm = roomMap(R), seen = {};
    for (const n of R.npcs) {
      if (n.x < 1 || n.y < 1 || n.x >= rm[0].length - 1 || n.y >= rm.length - 1) __errs.push(t + ' ' + k + ' npc off the floor ' + n.x + ',' + n.y);
      if (n.y === rm.length - 2 && (n.x === (rm[0].length >> 1) - 1 || n.x === rm[0].length >> 1)) __errs.push(t + ' ' + k + ' npc blocks the door');
      if (seen[n.x + ',' + n.y]) __errs.push(t + ' ' + k + ' two things at ' + n.x + ',' + n.y); seen[n.x + ',' + n.y] = 1;
      if (n.kind === 'stash' && !ITEMS[n.a]) __errs.push(t + ' stash item ' + n.a);
      if (n.kind === 'recruit' && !recruitId(n.name)) __errs.push(t + ' recruit ' + n.name + ' unknown');
      if (n.kind === 'relic' && !ARCHIVE.some(a => a.id === n.a)) __errs.push(t + ' relic ' + n.a);
    }
  }
}
for (const id in HEROES) if (!FORCE_ORDER.includes(id)) __errs.push('hero not in FORCE_ORDER ' + id);
// every archive entry can be found: a relic, a chest, or a story beat
{ const where = new Set(); for (const t in TOWN_NPCS) for (const n of TOWN_NPCS[t]) if (n.kind === 'relic') where.add(n.a); for (const t in TOWN_ROOMS) for (const k in TOWN_ROOMS[t]) for (const n of TOWN_ROOMS[t][k].npcs) if (n.kind === 'relic') where.add(n.a);
  for (const id in BATTLES) for (const c of BATTLES[id].chests) if (c[2].startsWith('arch:')) { if (where.has(c[2].slice(5))) __errs.push('archive placed twice ' + c[2]); where.add(c[2].slice(5)); }
  for (const a of ARCHIVE) if (!where.has(a.id) && !['a14', 'a15', 'a16'].includes(a.id)) __errs.push('archive never placed ' + a.id); }
for (const id in HEROES) { const h = HEROES[id]; if (!CLS[h.cls]) __errs.push('hero class ' + id); for (const it of h.items) if (!ITEMS[it]) __errs.push('hero item ' + it); }
for (const k in SHOPS) for (const it of SHOPS[k].w.concat(SHOPS[k].i)) if (!ITEMS[it]) __errs.push('shop item ' + it);
// the talking world: every speaker, NPC name and battle id in cfbanter's tables must exist
{ const spk = l => [].concat(l).forEach(x => { const m = /^([a-z0-9]+)>/.exec(x); if (m && !HEROES[m[1]]) __errs.push('unknown speaker ' + m[1]); else if (!m && /^[a-z]/.test(x)) __errs.push('bad line ' + x.slice(0, 30)); });
  for (const t in TALK) { if (!TOWNS[t]) { __errs.push('TALK town ' + t); continue; }
    const N = new Set([...TOWN_NPCS[t].map(n => n.name), ...Object.values(TOWN_ROOMS[t] || {}).flatMap(R => R.npcs.map(n => '@' + n.name))]);
    for (const k in TALK[t]) { if (!N.has(k)) __errs.push('TALK ' + t + ' has no ' + k); for (const st in TALK[t][k]) TALK[t][k][st].forEach(spk); } }
  for (const b in REACT) { if (!BATTLES[b]) __errs.push('REACT battle ' + b); for (const id in REACT[b]) { if (!HEROES[id]) __errs.push('REACT hero ' + id); spk(REACT[b][id]); } }
  for (const t in BARKS) { const N = new Set(TOWN_NPCS[t].map(n => n.name)); for (const st in BARKS[t]) for (const s of BARKS[t][st]) if (!N.has(s.split(':')[0])) __errs.push('BARK ' + t + ' has no ' + s); }
  for (const id in MEMBER_BARK) if (!HEROES[id]) __errs.push('MEMBER_BARK ' + id); }
`);
for (const e of R('__errs')) bad(e);

// ---------- campaign run ----------
const LOG = !!process.env.LOG, MAXTRY = +(process.env.MAXTRY || 6);
R(`
var __log = [], __tries = {}, __res = [], __said = {};
var __tr = []; const __T = s => { if (${!!process.env.TRANSCRIPT}) __tr.push(s); };
say = async (s, w) => __T((w ? w + ': ' : '') + s); ask = async (q, w, o) => { __T((w ? w + ': ' : '') + q + '  [' + (o || []).join(' / ') + '] -> 0'); return 0; }; showCard = async l => __T('[CARD] ' + [].concat(l).join(' | ')); note2 = async s => __T('[NOTE] ' + s); confirm = async () => true;
fadeTo = async () => {}; music = () => {}; banner = () => {}; readWait = async () => {};
CF_FAST = true; CF_AUTO = true; Math.random = mulberry(${+(process.env.SEED || 7)});
chapterCard = async () => {}; credits = async () => {};
let __back = 0; routeMenu = async () => { if (!__back && allRecs().some(r => r.dead) && SAVE.gold >= 60) { __back = 1; return 'town'; } __back = 0; return 'battle'; };
runTown = async (id) => {
  setupTown(id);
  __T('=== TOWN ' + id); await STORY.townIntro(id);
  const best = (r, list) => { const c = CLS[r.cls]; let pick = null; for (const it of list) { const d = ITEMS[it]; if (d.k !== c.wk) continue; const cur = weaponOf(r); if ((!cur || d.p > cur.p) && d.$ <= SAVE.gold && (!pick || d.p > ITEMS[pick].p)) pick = it; } return pick; };
  const visit = async list => { for (const n of list) { if (n.kind === 'recruit' && typeof n.a === 'function' && (!n.when || n.when()) && !SAVE.force[recruitId(n.name)]) { await n.a(); if (!SAVE.force[recruitId(n.name)]) await n.a(); } if (n.kind === 'relic') await archiveFind(n.a, 1); if (n.kind === 'talk' && typeof n.a === 'function') await n.a(); if (n.kind === 'talk' && Array.isArray(n.a) && (!n.when || n.when())) for (const c of townPool(id, n.name, n.a, n.room)) { const k = JSON.stringify(c); if (__said[k]) continue; __said[k] = 1; for (const [w, s] of lineParts(c, n.name)) __T((n.room ? '  @' : '') + w + ': ' + s); } if (n.kind === 'stash') { const k = 'st_' + id + '_' + n.room + '_' + n.x + '_' + n.y; if (!SAVE.flags[k]) { SAVE.flags[k] = 1; stowItem(n.a); } } } };
  await visit(TOWN_NPCS[id]);
  for (const r of allRecs()) for (const c of memberPool(r.id)) { const k = JSON.stringify(c); if (__said[k]) continue; __said[k] = 1; for (const [w, s] of lineParts(c, HEROES[r.id].n)) __T('  [HQ] ' + w + ': ' + s); }
  for (const n of townMembers(TOWNS[id])) __T('  [STREET] ' + n.name + ' at ' + n.x + ',' + n.y);
  for (const k in TOWN_ROOMS[id] || {}) await visit(TOWN_ROOMS[id][k].npcs.map(n => Object.assign({ room: k }, n)));
  for (const r of allRecs()) if (r.dead && SAVE.gold >= raiseCost(r)) { SAVE.gold -= raiseCost(r); r.dead = 0; }
  for (const r of allRecs()) if (canPromote(r)) promote(r);
  const S = SHOPS[SAVE.ch];
  for (const r of activeRecs().sort((a, b) => (a.id === 'dax' ? -1 : 0))) { const it = best(r, S.w); if (it) { const old = r.items.findIndex(i => i.eq && ITEMS[i.id].k !== 'ring'); if (old >= 0) { SAVE.gold += ITEMS[r.items[old].id].$ >> 1; r.items.splice(old, 1); } SAVE.gold -= ITEMS[it].$; r.items.push({ id: it, eq: 1 }); } }
  // equip any found rings/better weapons
  for (const r of allRecs()) { r.items.forEach((it, k) => { const d = ITEMS[it.id]; if (d.k === 'ring' && !r.items.some(o => o.eq && ITEMS[o.id].k === 'ring')) it.eq = 1; if (d.k === 'use' && d.fx === 'stat') { r[d.s] += d.p; it.used = 1; } }); r.items = r.items.filter(i => !i.used); }
  const alive = allRecs().filter(r => !r.dead).sort((a, b) => (b.id === 'dax') - (a.id === 'dax') || lvEq(b) - lvEq(a));
  SAVE.active = alive.slice(0, 12).map(r => r.id);
  return 'gate';
};
const __rb = runBattle;
runBattle = async (id, res) => {
  __tries[id] = (__tries[id] || 0) + 1;
  if (__tries[id] > ${MAXTRY}) throw new Error('STUCK at ' + id);
  __T('=== BATTLE ' + id + ' (try ' + __tries[id] + ')');
  const r = await __rb(id, res);
  const al = B.units.filter(u => u.side === 'ally'), L = al.map(u => lvEq(u)), avg = L.reduce((a, b) => a + b, 0) / L.length;
  const T = Math.max(...B.D.foes.map(f => f[3]));
  __res.push({ id, r, round: B.round, avgL: +avg.toFixed(1), T, n: al.length, down: al.filter(u => u.hp <= 0).map(u => u.id).join(','), gold: SAVE.gold });
  return r;
};
`);
(async () => {
  const t0 = Date.now();
  let err = null;
  try { await R('(async () => { SAVE = newSave(); await newGame(); })()'); } catch (e) { err = e; }
  const res = R('__res');
  for (const x of res) console.log(`${x.id.padEnd(4)} ${x.r.padEnd(6)} rounds ${String(x.round).padStart(2)}  force L${String(x.avgL).padStart(4)} x${x.n}  foe T${x.T}  gold ${x.gold}${x.down ? '  down: ' + x.down : ''}`);
  if (err) bad(err.message.split('\n')[0]);
  const sv = R('SAVE');
  console.log('missing archive', R('JSON.stringify(ARCHIVE.filter(a => !SAVE.archive[a.id]).map(a => a.id))'));
  console.log('archive', Object.keys(sv.archive).length + '/' + R('ARCHIVE.length'), 'force', Object.keys(sv.force).length, 'cleared', !!sv.flags.cleared, 'losses', res.filter(x => x.r !== 'win').length, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  if (!sv.flags.cleared) bad('campaign not cleared');
  // promoted members talk with their 'NAME+' painting, everyone else with the base one
  const port = JSON.parse(R(`JSON.stringify(allRecs().map(r => { const n = HEROES[r.id].n, up = CLS[r.cls].promoted && !CLS[HEROES[r.id].cls].promoted; return [n, up, portName(n), !!(PROMO_SAY[r.id] || !CLS[HEROES[r.id].cls].pro), !!CF_PORTS[n + '+'] || !CLS[HEROES[r.id].cls].pro]; }))`));
  for (const [n, up, pn, said, has] of port) { if (pn !== (up ? n + '+' : n)) bad('portrait ' + n + ' -> ' + pn); if (!said) bad('no PROMO_SAY for ' + n); if (!has) bad('no promoted portrait for ' + n); }
  console.log('promoted portraits', port.filter(p => p[1]).length + '/' + port.length, 'in use');
  if (process.env.TRANSCRIPT) require('fs').writeFileSync(process.env.TRANSCRIPT, R('__tr').join(String.fromCharCode(10)));
  console.log(fails ? fails + ' FAILURES' : 'OK');
  process.exit(fails ? 1 : 0);
})();
