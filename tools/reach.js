// flags interactables that no walkable tile touches (with NPCs as obstacles), per game / map / day
const fs = require('fs'), vm = require('vm');
process.chdir('J:/games/gameboycarl');
const FILES = {
  carl: ['js/engine', 'js/audio', 'js/art', 'js/story', 'js/world', 'js/world2', 'js/battle', 'js/mini', 'js/extra'],
  linda: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'linda/lbattle', 'linda/lworld', 'linda/ldays'],
  ghost: ['js/engine', 'js/audio', 'js/art', 'linda/lcore', 'ghost/gcore', 'ghost/gworld', 'ghost/gshow'],
};
const el = () => ({ style: {}, getContext: () => ({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData() {} }) });
let bad = 0;
for (const game in FILES) {
  const ctx = { document: { getElementById: el, documentElement: {} }, addEventListener() {}, innerWidth: 800, innerHeight: 720, performance: { now: () => 0 },
    requestAnimationFrame() {}, navigator: {}, console, Math, setInterval() {}, Date, Promise, JSON, Object, localStorage: { getItem: () => null, setItem() {}, removeItem() {} } };
  ctx.window = ctx; vm.createContext(ctx);
  for (const f of FILES[game]) vm.runInContext(fs.readFileSync(f + '.js', 'utf8').replace(/\nboot\(\);\s*$/, '\n'), ctx);
  const out = vm.runInContext(`(() => {
    const res = [];
    const mk = ${game === 'carl' ? 'newState' : game === 'linda' ? 'lState' : 'gState'};
    for (const id in MAPS) for (const v of [1, 2, 3, 4, 5]) {
      S = mk(); S.day = v; S.ep = v; S.flags.act = v; S.flags.ending = 0;
      try { loadMap(id, 0, 0, 'down'); } catch (e) { continue; }
      P.x = -9; P.y = -9;
      const walk = (x, y) => { const T = tdef(x, y); if (!T || (T.solid && !T.thin)) return false; return !M.ents.some(e => e.solid && visible(e) && covers(e, x, y)); };
      // flood from every walkable tile, find components; the biggest one is "the level"
      const comp = {}; let cid = 0, sizes = [];
      for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) {
        if (!walk(x, y) || comp[x + ',' + y] !== undefined) continue;
        const q = [[x, y]]; comp[x + ',' + y] = cid; let n = 0;
        while (q.length) { const [a, b] = q.pop(); n++; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const k = (a+dx) + ',' + (b+dy); if (comp[k] === undefined && walk(a+dx, b+dy)) { comp[k] = cid; q.push([a+dx, b+dy]); } } }
        sizes.push(n); cid++;
      }
      const main = sizes.indexOf(Math.max(...sizes));
      const reach = (x, y) => [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => comp[(x+dx) + ',' + (y+dy)] === main);
      const targets = Object.keys(M.def.signs || {}).map(k => ['sign', ...k.split(',').map(Number)])
        .concat(M.ents.filter(e => e.talk && visible(e)).map(e => ['ent:' + e.id, e.x, e.y, e]));
      for (const [what, x, y, e] of targets) {
        const cells = e ? [] : [[x, y]];
        if (e) for (let i = 0; i < (e.w || 1); i++) for (let j = 0; j < (e.h || 1); j++) cells.push([x + i, y + j]);
        if (!cells.some(([a, b]) => reach(a, b))) res.push(id + ' v' + v + ' ' + what + ' @' + x + ',' + y);
      }
    }
    return [...new Set(res)];
  })()`, ctx);
  console.log(game + ': ' + (out.length ? out.join(' | ') : 'all interactables reachable'));
  bad += out.length;
}
