// static checks for SAVE THE WORLD: every referenced map, form, foe, item, track exists
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const ctx = G2.load(files, {}); const R = s => G2.R(ctx, s);
const src = files.filter(f => f.startsWith('stw/')).map(f => fs.readFileSync(path.join(G2.ROOT, f + '.js'), 'utf8')).join('\n');
const bad = [];
const has = (expr) => R(expr);
for (const m of src.matchAll(/music\('([a-z0-9]+)'\)/g)) if (!has(`!!TRACKS['${m[1]}']`)) bad.push('track ' + m[1]);
for (const m of src.matchAll(/music: '([a-z0-9]+)'/g)) if (!has(`!!TRACKS['${m[1]}']`)) bad.push('track ' + m[1]);
for (const m of src.matchAll(/battle\('([a-z0-9]+)'/g)) if (!has(`!!FORMS['${m[1]}']`)) bad.push('form ' + m[1]);
for (const m of src.matchAll(/goMap\('([a-z0-9]+)'/g)) if (!has(`!!MAPS['${m[1]}']`)) bad.push('map ' + m[1]);
console.log(R(`G = newGame(); (() => { const out = [];
  for (const id in MAPS) { const d = MAPS[id];
    for (const e of d.exits || []) if (e.to && e.to !== 'world' && !MAPS[e.to]) out.push('exit ' + id + ' -> ' + e.to);
    for (const c of d.chests || []) { const k = c[2]; if (k !== 'gp' && !ITEMS[k] && !EQUIP[k] && !GADGETS[k]) out.push('chest item ' + id + ' ' + k); }
    if (!SWTHEMES[d.theme]) out.push('theme ' + id + ' ' + d.theme);
    const w = Math.max(...d.rows.map(r => r.length)); d.rows.forEach((r, y) => { if (r.length !== w) out.push('row width ' + id + ' y' + y + ' ' + r.length + '/' + w); });
    if (d.npcs) { try { for (const n of d.npcs()) if (n.who && !ART.hero[n.who] && !ART.npc[n.who]) out.push('npc sprite ' + id + ' ' + n.who); } catch (e) { out.push('npcs() threw ' + id + ' ' + e.message); } }
  }
  for (const id in FORMS) for (const [f] of FORMS[id].foes) if (!FOES[f]) out.push('form ' + id + ' foe ' + f);
  for (const id in AREA) for (const g of AREA[id]) for (const f of g) if (!FOES[f]) out.push('area foe ' + f);
  for (const k in PLACES) { const p = PLACES[k]; if (p.to && !MAPS[p.to[0]]) out.push('place ' + k + ' -> ' + p.to[0]); }
  for (const k in CRYSTALS) for (const [s] of CRYSTALS[k].spells) if (!SPELLS[s]) out.push('crystal spell ' + s);
  for (const id in FOES) { try { FOEART.get(FOES[id].look); } catch (e) { out.push('foe art ' + id + ' ' + e.message); } }
  return out.join(String.fromCharCode(10)); })()`));
for (const m of src.matchAll(/shop\('[^']*', \[([^\]]+)\]/g)) for (const k of m[1].split(',').map(s => s.trim().replace(/'/g, ''))) if (!has(`!!(ITEMS['${k}'] || EQUIP['${k}'])`)) bad.push('shop item ' + k);
console.log(bad.length ? [...new Set(bad)].join('\n') : 'refs ok');
