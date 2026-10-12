// audit every SPOOKY GHOST 2 map: everything an episode needs must be reachable from the start (cracks and sigil doors count as open)
const { load, G } = require('./sgvm');
const ctx = load({});
G.R(ctx, 'S = newS()');
const out = G.R(ctx, `(() => {
  const res = [];
  for (const id of Object.keys(MAPS)) {
    const M = MAPS[id], rows = M.rows, h = rows.length, w = Math.max(...rows.map(r => r.length));
    const at = (x, y) => (y < 0 || y >= h || x < 0 || x >= w) ? '#' : (rows[y][x] || '#');
    const pass = c => !SOLID.has(c) || c === 'W' || c === 'L' || c === 'M' || c === 'S';
    const seen = new Set(), q = [[M.start[0], M.start[1]]]; seen.add(M.start[1] * w + M.start[0]);
    for (let i = 0; i < q.length; i++) { const [x, y] = q[i]; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy; if (seen.has(ny * w + nx) || !pass(at(nx, ny))) continue; seen.add(ny * w + nx); q.push([nx, ny]); } }
    const ok = (tx, ty) => seen.has(ty * w + tx) || [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => seen.has((ty + dy) * w + tx + dx));
    const bad = [];
    if (!pass(at(M.start[0], M.start[1]))) bad.push('start is solid');
    for (const e of M.ents()) {
      const tx = e.tx !== undefined ? e.tx : Math.floor(e.x / 16), ty = e.ty !== undefined ? e.ty : Math.floor((e.y - 2) / 16);
      const pts = e.path ? e.path : [[tx, ty]];
      if (e.kind === 'collector') { for (const [px, py] of pts) if (!pass(at(px, py)) || !ok(px, py)) bad.push('collector ' + e.id + ' waypoint ' + px + ',' + py + ' ' + at(px, py)); }
      else if (e.kind === 'mark' || e.kind === 'card' || e.kind === 'prop' || e.kind === 'door') { if (!ok(tx, ty)) bad.push(e.kind + ' ' + e.id + ' unreachable at ' + tx + ',' + ty); else if (e.kind === 'mark' && SOLID.has(at(tx, ty)) && at(tx, ty) !== 'c') bad.push('mark ' + e.id + ' in a wall ' + at(tx, ty)); }
    }
    const marks = M.ents().filter(e => e.kind === 'mark').length;
    res.push(id + ': ' + w + 'x' + h + ' marks=' + marks + ' quota=' + M.quota + ' (max ' + (marks * 3 + 5) + ')' + (bad.length ? '\\n   BAD ' + bad.join('\\n   BAD ') : ' ok'));
  }
  return res.join('\\n');
})()`);
console.log(out);
