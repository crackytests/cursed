'use strict';
// ================= DEUS EX NEVADA: world (maps, light, line of sight, the 3/4 renderer) =================
// A map is an ASCII grid plus a legend. Global tile chars:
//   ' ' void   . , : ; `  floors 0-4 (map.f)   # % $  walls 0-2 (map.w)   W window (glass, see-through)   = rail/fence (see-through, vaultable)
//   ~ shallow water   " deep water (swim)   + door   v vent (crouch only)   b brush (hides a crouching Carl)   0-9 waypoints
// Global prop chars: K crate  M metal crate  O barrel  X explosive barrel  F fire barrel  D desk  T tree  P plant  L lamp  C computer
//   S shelf  B bookshelf  H table  h chair  Q sofa  Z bed  Y vending  A atm  U dumpster  u trash  I pillar  V counter  R rack  N locker  E sign
// Lowercase letters (and anything else) come from map.key: an entity def, or an array of defs.
const T_VOID = 0, T_FLOOR = 1, T_WALL = 2, T_WIN = 3, T_FENCE = 4, T_WATER = 5, T_DEEP = 6, T_DOOR = 7, T_VENT = 8, T_BRUSH = 9;
const GPROP = { K: 'crate', M: 'mcrate', O: 'barrel', X: 'xbarrel', F: 'firebarrel', D: 'desk', T: 'tree', P: 'plant', L: 'lamp', C: 'computer', S: 'shelf', B: 'bookshelf', H: 'table', h: 'chair', Q: 'sofa', Z: 'bed', Y: 'vend', A: 'atm', U: 'dumpster', u: 'trash', I: 'pillar', V: 'counter', R: 'rack', N: 'locker', E: 'sign' };
const FLOORCH = '.,:;`';
function defMap(id, d) { d.id = id; MAPS[id] = d; return d; }

let UID = 1;
function buildMap(id) {
  const d = MAPS[id]; if (!d) throw new Error('no map ' + id);
  const rows = d.grid.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n');
  const w = Math.max(...rows.map(r => r.length)), h = rows.length;
  const M = { id, d, w, h, t: new Uint8Array(w * h), st: [], fl: new Uint8Array(w * h), var: new Uint8Array(w * h), light: new Float32Array(w * h), vis: new Uint8Array(w * h),
    ents: [], doors: {}, wps: {}, removed: {}, block: new Uint8Array(w * h), opaque: new Uint8Array(w * h), decals: [], fx: [], noise: [], time: 0, alarm: 0, lightsOut: {} };
  M.seen = SEEN[id] || (SEEN[id] = new Uint8Array(w * h));
  if (M.seen.length !== w * h) M.seen = SEEN[id] = new Uint8Array(w * h);
  const fs = d.f || ['concrete'], ws = d.w || ['concrete'];
  const put = (i, t, style) => { M.t[i] = t; M.st[i] = style; };
  const floorNear = (x, y) => { // the floor a prop stands on: look left, up, right, down
    for (const [dx, dy] of [[-1, 0], [0, -1], [1, 0], [0, 1], [-2, 0], [0, -2]]) { const c = (rows[y + dy] || '')[x + dx]; if (c && FLOORCH.includes(c)) return c; }
    return '.'; };
  let uidBase = 0;
  const addEnt = (e, x, y) => { const uid = id + ':' + (uidBase++); if (e.cond && !e.cond()) return null; e = Object.assign({}, e); e.uid = uid; if (e.x === undefined) e.x = x; if (e.y === undefined) e.y = y; return spawnEnt(M, e); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = rows[y][x] || ' ', i = y * w + x; M.var[i] = (hash(x, y, 77) * 16) | 0;
    let fi = FLOORCH.indexOf(c);
    if (fi >= 0) { put(i, T_FLOOR, fs[fi] || fs[0]); continue; }
    if (c === ' ') { put(i, T_VOID, ''); continue; }
    const kk = d.key && d.key[c];
    if (kk && !'#%$'.includes(c)) { // map legend first: lowercase letters, and any global char the map redefines
      put(i, T_FLOOR, fs[FLOORCH.indexOf(floorNear(x, y))] || fs[0]);
      for (const e of [].concat(kk)) {
        if (e.wp) { M.wps[e.wp] = [x + .5, y + .5]; continue; }
        if (e.k === 'door') { M.t[i] = T_DOOR; if (e.style) M.st[i] = e.style; M.doors[i] = mkDoor(M, x, y, e); continue; }
        if (e.tile !== undefined) put(i, e.tile, e.style || M.st[i]);
        if (e.k) addEnt(e, x, y);
      }
      // walk-on exits inside a map get visible stairs (edges, doors, vents and manholes already read as ways out)
      const g = [].concat(kk), nearDoor = [[-1, 0], [1, 0], [0, -1], [0, 1]].some(([dx, dy]) => '+'.includes((rows[y + dy] || '')[x + dx] || '?') || [].concat(d.key[(rows[y + dy] || '')[x + dx]] || []).some(e => e.k === 'door')), run = [-2, -1, 1, 2].filter(dx => rows[y][x + dx] === c).length + [-1, 1].filter(dy => (rows[y + dy] || '')[x] === c).length;
      const side = dx => { let xx = x + dx; while (rows[y][xx] === c) xx += dx; return '#%$W'.includes(rows[y][xx] || '#'); }, doorway = side(-1) && side(1);
      if (!nearDoor && !doorway && run <= 1 && !g.some(e => e.k === 'exit' && (e.w > 1 || e.h > 1 || !e.to)) && M.t[i] === T_FLOOR && x > 0 && y > 0 && x < w - 1 && y < h - 1 && g.some(e => e.k === 'exit') && !g.some(e => e.k === 'prop' || e.tile !== undefined)) spawnEnt(M, { k: 'prop', p: 'stairs', x, y, uid: id + ':st' + i }); // own uid so older saves keep theirs
      continue; }
    if (c === '#' || c === '%' || c === '$') { put(i, T_WALL, ws['#%$'.indexOf(c)] || ws[0]); continue; }
    if (c === 'W') { put(i, T_WIN, d.win || 'glass'); continue; }
    if (c === '=') { put(i, T_FENCE, d.fence || 'rail'); continue; }
    if (c === '~') { put(i, T_WATER, d.water || 'water'); continue; }
    if (c === '"') { put(i, T_DEEP, d.deep || 'deep'); continue; }
    if (c === 'v') { put(i, T_VENT, 'metal'); continue; }
    if (c === 'b') { put(i, T_BRUSH, fs[1] || 'grass'); continue; }
    const under = floorNear(x, y); put(i, T_FLOOR, fs[FLOORCH.indexOf(under)] || fs[0]);
    if (c >= '0' && c <= '9') { M.wps[c] = [x + .5, y + .5]; continue; }
    if (c === '+') { M.t[i] = T_DOOR; M.doors[i] = mkDoor(M, x, y, {}); continue; }
    const k = d.key && d.key[c];
    if (!k && GPROP[c]) { addEnt({ k: 'prop', p: GPROP[c] }, x, y); continue; }
    if (!k) { console.warn('map', id, 'unknown char', c, x, y); continue; }
    for (const e of [].concat(k)) {
      if (e.wp) { M.wps[e.wp] = [x + .5, y + .5]; continue; }
      if (e.k === 'door') { M.t[i] = T_DOOR; if (e.style) M.st[i] = e.style; M.doors[i] = mkDoor(M, x, y, e); continue; }
      if (e.tile !== undefined) put(i, e.tile, e.style || M.st[i]);
      if (e.k) addEnt(e, x, y);
    }
  }
  for (const e of d.ents || []) addEnt(e);
  rebuildBlock(M); computeLight(M);
  return M;
}
function mkDoor(M, x, y, e) {
  const w = M.w, i = y * w + x, wallAt = (xx, yy) => { const t = M.t[yy * w + xx]; return t === T_WALL || t === T_WIN; };
  // orientation: walls left/right = horizontal door (in a wall running east-west)
  const horiz = wallAt(x - 1, y) || wallAt(x + 1, y) || !(wallAt(x, y - 1) || wallAt(x, y + 1));
  const d = Object.assign({ x, y, i, open: 0, o: 0, horiz, lock: 0, str: 0, key: null, code: null, hp: 0, name: 'DOOR', style: M.st[i] || (M.d.w || ['concrete'])[0] }, e, { k: 'door' });
  // locked doors you could pick can also be blown; can't-pick doors are story seals unless they set hp themselves
  if (d.lock && d.pick !== 0 && !d.hp) d.hp = 60 + d.str * 80;
  return d;
}
function rebuildBlock(M) {
  const { w, h } = M;
  for (let i = 0; i < w * h; i++) { const t = M.t[i]; M.block[i] = t === T_WALL || t === T_VOID || t === T_WIN || t === T_FENCE ? 1 : 0; M.opaque[i] = t === T_WALL || t === T_VOID ? 1 : 0; }
  for (const k in M.doors) { const dd = M.doors[k]; if (!dd.open) { M.block[dd.i] = 1; M.opaque[dd.i] = 1; } }
  for (const e of M.ents) if (e.k === 'prop' && !e.gone) { const p = PROPS[e.p]; if (!p) continue;
    for (let yy = 0; yy < p.fh; yy++) for (let xx = 0; xx < p.fw; xx++) { const ii = (Math.floor(e.y) + yy) * w + Math.floor(e.x) + xx; if (ii < 0 || ii >= w * h) continue; if (p.solid !== 0 && !p.wall) M.block[ii] = Math.max(M.block[ii], 2); if (p.opaque) M.opaque[ii] = 1; } }
  M.ver = (M.ver || 0) + 1;
}
const inMap = (M, x, y) => x >= 0 && y >= 0 && x < M.w && y < M.h;
const tAt = (M, x, y) => inMap(M, x, y) ? M.t[(y | 0) * M.w + (x | 0)] : T_VOID;

// ---------- entities ----------
function spawnEnt(M, e) {
  if (!e.uid) e.uid = M.id + ':s' + (UID++);
  if (e.k === 'prop') { const p = PROPS[e.p]; if (!p) { console.warn('no prop', e.p); return e; } e.hp = e.hp || p.hp || 0; if (p.search && !e.items) e.items = e.items || null; }
  if (e.k === 'npc' && typeof mkNPC === 'function') mkNPC(M, e);
  M.ents.push(e); return e;
}
function entById(M, id) { return M.ents.find(e => e.id === id); }
function removeEnt(M, e) { e.gone = 1; if (M.removed && e.uid && !/:s\d+$/.test(e.uid)) M.removed[e.uid] = e.k + ':' + (e.p || e.to || e.item || ''); const i = M.ents.indexOf(e); if (i >= 0) M.ents.splice(i, 1); }

// ---------- light: ambient + lamps, each lamp blocked by walls ----------
function lightsOf(M) {
  const out = [];
  for (const e of M.ents) { if (e.gone) continue; const p = e.k === 'prop' && PROPS[e.p]; const L = e.light || (p && p.light);
    if (L && !e.off && !M.lightsOut[e.uid]) out.push({ x: e.x + (p ? p.fw / 2 : .5), y: e.y + (p ? p.fh - .5 : .5), r: L[0], k: L[1], e }); }
  for (const l of M.d.lights || []) out.push({ x: l[0] + .5, y: l[1] + .5, r: l[2], k: l[3] });
  return out;
}
function computeLight(M) {
  const { w, h } = M, amb = M.d.amb === undefined ? .5 : M.d.amb, L = M.light;
  for (let i = 0; i < w * h; i++) L[i] = amb;
  if (M.d.lit) for (const [x0, y0, x1, y1, v] of M.d.lit) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inMap(M, x, y)) L[y * w + x] = Math.max(L[y * w + x], v);
  for (const l of lightsOf(M)) {
    const r = l.r; for (let y = Math.floor(l.y - r); y <= l.y + r; y++) for (let x = Math.floor(l.x - r); x <= l.x + r; x++) {
      if (!inMap(M, x, y)) continue; const dd = Math.hypot(x + .5 - l.x, y + .5 - l.y); if (dd > r) continue;
      if (dd > 1.2 && !clearLine(M, l.x, l.y, x + .5, y + .5, 1)) continue;
      const i = y * w + x; L[i] = Math.min(1.25, L[i] + l.k * Math.pow(1 - dd / r, 1.3)); }
  }
  cornerLight(M);
}
function lightAt(M, x, y) { if (!inMap(M, x, y)) return 0; let l = M.light[(y | 0) * M.w + (x | 0)]; for (const f of M.fx) if (f.flash && Math.hypot(f.x - x, f.y - y) < 4) l += .6; if (typeof P !== 'undefined' && P && P.augOn && P.augOn.light && Math.hypot(P.x - x, P.y - y) < 5) l += .5; return l; }

// ---------- sight lines ----------
// clearLine: walk the grid from (x0,y0) to (x1,y1); blocked by opaque tiles (and closed doors). mode 1 = light (ignores the end tile)
function clearLine(M, x0, y0, x1, y1, mode = 0) {
  const dx = x1 - x0, dy = y1 - y0, n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 3);
  let lx = -1, ly = -1;
  for (let s = 1; s < n; s++) { const x = (x0 + dx * s / n) | 0, y = (y0 + dy * s / n) | 0; if (x === lx && y === ly) continue; lx = x; ly = y;
    if (mode === 1 && x === (x1 | 0) && y === (y1 | 0)) return true;
    if (!inMap(M, x, y)) return false; if (M.opaque[y * M.w + x]) return false; }
  return true;
}
// LOS from the player: recursive shadowcasting (8 octants)
function computeVis(M, ox, oy, R = 22) {
  const { w, h, vis } = M; vis.fill(0); const sx = ox | 0, sy = oy | 0; if (!inMap(M, sx, sy)) return;
  const mark = (x, y) => { if (inMap(M, x, y)) { const i = y * w + x; vis[i] = 1; M.seen[i] = 1; } };
  mark(sx, sy);
  const op = (x, y) => !inMap(M, x, y) || M.opaque[y * w + x];
  const oct = [[1, 0, 0, 1], [0, 1, 1, 0], [0, -1, 1, 0], [-1, 0, 0, 1], [-1, 0, 0, -1], [0, -1, -1, 0], [0, 1, -1, 0], [1, 0, 0, -1]];
  function cast(row, start, end, xx, xy, yx, yy) {
    if (start < end) return; let newStart = 0;
    for (let j = row; j <= R; j++) { let dx = -j - 1, dy = -j, blocked = false;
      while (dx <= 0) { dx++; const X = sx + dx * xx + dy * xy, Y = sy + dx * yx + dy * yy, l = (dx - .5) / (dy + .5), r = (dx + .5) / (dy - .5);
        if (start < r) continue; else if (end > l) break;
        if (dx * dx + dy * dy < R * R) mark(X, Y);
        if (blocked) { if (op(X, Y)) { newStart = r; continue; } else { blocked = false; start = newStart; } }
        else if (op(X, Y) && j < R) { blocked = true; cast(j + 1, start, l, xx, xy, yx, yy); newStart = r; } }
      if (blocked) break; }
  }
  for (const o of oct) cast(1, 1, 0, o[0], o[1], o[2], o[3]);
  // walls: a wall face is seen if the tile south of it is seen
  M.visVer = M.ver;
}

// ---------- collision ----------
// tile passability for an actor: crouching Carl fits in vents; deep water is swimmable
function passable(M, x, y, a) {
  if (!inMap(M, x, y)) return false; const i = (y | 0) * M.w + (x | 0), t = M.t[i];
  if (t === T_VENT) return !!(a && (a.crouch || a.small));
  if (M.block[i]) { if (M.block[i] === 1 && t === T_FENCE && a && a.vault) return true; return false; }
  if (t === T_DEEP && a && a.noSwim) return false;
  return true;
}
function circleFree(M, x, y, r, a) {
  for (let ty = Math.floor(y - r); ty <= Math.floor(y + r); ty++) for (let tx = Math.floor(x - r); tx <= Math.floor(x + r); tx++) {
    if (passable(M, tx, ty, a)) continue;
    const cx = clamp(x, tx, tx + 1), cy = clamp(y, ty, ty + 1); if ((x - cx) ** 2 + (y - cy) ** 2 < r * r) return false; }
  return true;
}
function moveBody(M, a, dx, dy) {
  const r = a.r || .3; let moved = 0;
  // sub-step so fast movers don't tunnel
  const n = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / .2) || 1;
  for (let s = 0; s < n; s++) {
    const sx = dx / n, sy = dy / n;
    if (circleFree(M, a.x + sx, a.y, r, a)) { a.x += sx; moved = 1; } else if (sy === 0 && circleFree(M, a.x + sx, a.y + .08, r, a)) a.y += .04; else if (sy === 0 && circleFree(M, a.x + sx, a.y - .08, r, a)) a.y -= .04;
    if (circleFree(M, a.x, a.y + sy, r, a)) { a.y += sy; moved = 1; } else if (sx === 0 && circleFree(M, a.x + .08, a.y + sy, r, a)) a.x += .04; else if (sx === 0 && circleFree(M, a.x - .08, a.y + sy, r, a)) a.x -= .04;
  }
  return moved;
}

// ---------- the renderer ----------
const SHOWN = { actors: [] };
function camTo(M, x, y, lead) {
  const cx = x * TW - W / 2 + (lead ? lead[0] : 0), cy = y * TH - H / 2 + 8 + (lead ? lead[1] : 0);
  const mx = Math.max(0, M.w * TW - W), my = Math.max(-WALLH, M.h * TH - H + 24);
  G.cam.x = M.w * TW < W ? (M.w * TW - W) / 2 : clamp(cx, 0, mx); G.cam.y = M.h * TH < H ? (M.h * TH - H) / 2 : clamp(cy, -WALLH, my);
}
function tileVis(M, i) { return M.vis[i] ? 2 : M.seen[i] ? 1 : 0; }
function cornerLight(M) { // light at tile corners (average of the open tiles touching it), for smooth floors
  const { w, h } = M, cl = M.cl && M.cl.length === (w + 1) * (h + 1) ? M.cl : (M.cl = new Float32Array((w + 1) * (h + 1))), L = M.light;
  for (let y = 0; y <= h; y++) for (let x = 0; x <= w; x++) { let s2 = 0, n = 0;
    for (let dy = -1; dy <= 0; dy++) for (let dx = -1; dx <= 0; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; const t = M.t[yy * w + xx]; if (t === T_WALL || t === T_VOID) continue; s2 += L[yy * w + xx]; n++; }
    cl[y * (w + 1) + x] = n ? s2 / n : 0; }
}
function drawFloorTile(M, x, y, sx, sy, i) {
  const t = M.t[i]; let st = M.st[i], v = M.var[i];
  if (t === T_WATER || t === T_DEEP) v = (v + (G.t * 4 | 0)) & 3;
  const b = tileBuf('f', st || 'concrete', t === T_WATER || t === T_DEEP ? v : v & 7), d = b.d;
  curV = tileVis(M, i); if (!curV) return;
  const cw = M.w + 1, cl = M.cl, fl = (M.flashK || 0) * 255;
  const tl = cl[y * cw + x] * 255 + fl, tr = cl[y * cw + x + 1] * 255 + fl, bl = cl[(y + 1) * cw + x] * 255 + fl, br = cl[(y + 1) * cw + x + 1] * 255 + fl;
  const vv = curV;
  for (let j = 0; j < TH; j++) { const yy = sy + j; if (yy < 0 || yy >= H) continue; const fy = j / TH, lL = tl + (bl - tl) * fy, lR = tr + (br - tr) * fy, st2 = (lR - lL) / TW, o = yy * W, r = j * TW;
    let li = lL; for (let k = 0; k < TW; k++, li += st2) { const xx = sx + k; if (xx < 0 || xx >= W) continue; FB[o + xx] = d[r + k]; LB[o + xx] = li > 255 ? 255 : li; VB[o + xx] = vv; } }
  const l0 = M.light[i];
  if (t === T_BRUSH) { curL = Math.min(255, l0 * 255) | 0; for (let k = 0; k < 7; k++) { const bx = sx + 2 + ((hash(x, y, k) * 20) | 0), by = sy + 2 + ((hash(y, x, k) * 8) | 0); wrect(bx, by, 1, 3, hex('#3a7a2a')); wset(bx + 1, by - 1, hex('#5aa04a')); } }
  if (t === T_VENT) { curL = Math.min(255, l0 * 255) | 0; wrect(sx + 1, sy + 1, TW - 2, TH - 2, hex('#2a3038')); for (let k = 3; k < TW - 2; k += 3) wrect(sx + k, sy + 2, 1, TH - 4, hex('#5a6470')); }
}
function lightByte(M, i) { return Math.min(255, (M.light[i] + (M.flashK || 0)) * 255) | 0; }
function renderWorld(M) {
  cls(0xff000000); LB.fill(0); VB.fill(0);
  const cx = G.cam.x | 0, cy = G.cam.y | 0, w = M.w;
  const tx0 = Math.max(0, Math.floor(cx / TW)), tx1 = Math.min(M.w - 1, Math.floor((cx + W) / TW));
  const ty0 = Math.max(0, Math.floor(cy / TH)), ty1 = Math.min(M.h - 1, Math.floor((cy + H + WALLH) / TH) + 1);
  // floors
  for (let y = ty0; y <= ty1; y++) for (let x = tx0; x <= tx1; x++) { const i = y * w + x, t = M.t[i]; if (t === T_WALL || t === T_VOID || t === T_WIN) continue; drawFloorTile(M, x, y, x * TW - cx, y * TH - cy, i); }
  // decals (blood, scorch) on the floor
  for (const dc of M.decals) { const i = (dc.y | 0) * w + (dc.x | 0); curV = tileVis(M, i); if (!curV) continue; curL = lightByte(M, i); const sx = dc.x * TW - cx, sy = dc.y * TH - cy;
    for (let k = 0; k < dc.n; k++) { const a = hash(k, dc.s, 1) * 6.28, r = hash(k, dc.s, 2) * dc.r; wrect(sx + Math.cos(a) * r * 1.6, sy + Math.sin(a) * r * .8, 2, 1, dc.c); } }
  // drawables
  const L = [];
  for (let y = ty0; y <= ty1; y++) for (let x = tx0; x <= tx1; x++) { const i = y * w + x, t = M.t[i];
    if (t === T_WALL || t === T_WIN || t === T_FENCE) L.push({ z: (y + 1) * TH, f: 0, x, y, i });
    else if (t === T_DOOR) L.push({ z: (y + 1) * TH - .5, f: 1, x, y, i }); }
  for (const e of M.ents) { if (e.gone || e.hidden) continue;
    if (e.k === 'prop') { const p = PROPS[e.p]; if (!p) continue; if (e.x + p.fw < tx0 - 2 || e.x > tx1 + 2 || e.y > ty1 + 6 || e.y + p.fh < ty0 - 3) continue; L.push({ z: (e.y + p.fh) * TH - (p.wall ? 0 : .2) + (p.solid === 0 && !p.wall ? -TH : 0) + (e.zb || 0), f: 2, e }); }
    else if (e.k === 'npc' || e.k === 'item' || e.k === 'cam' || e.k === 'turret' || e.k === 'drone' || e.k === 'proj' || e.k === 'corpse') { if (e.x < tx0 - 2 || e.x > tx1 + 2 || e.y < ty0 - 2 || e.y > ty1 + 3) continue; L.push({ z: e.y * TH + (e.k === 'item' || e.k === 'corpse' || (e.k === 'npc' && (e.dead || e.down)) ? -6 : 0) + (e.k === 'cam' ? 40 : 0), f: 3, e }); }
  }
  if (P && P.map === M) L.push({ z: P.y * TH + .1, f: 4, e: P });
  L.sort((a, b) => a.z - b.z);
  SHOWN.actors.length = 0;
  for (const d of L) {
    if (d.f === 0) drawWallTile(M, d.x, d.y, d.i, cx, cy);
    else if (d.f === 1) drawDoor(M, M.doors[d.i], cx, cy);
    else if (d.f === 2) drawProp(M, d.e, cx, cy);
    else if (d.f === 3) drawEnt(M, d.e, cx, cy);
    else drawPlayerSprite(M, cx, cy);
  }
  checkOcclusion();
  shade();
  drawOverlays(M, cx, cy);
}
function drawWallTile(M, x, y, i, cx, cy) {
  const t = M.t[i], st = M.st[i], below = y + 1 < M.h ? M.t[i + M.w] : T_VOID, sx = x * TW - cx, sy = y * TH - cy;
  const bi = i + M.w, vb = below !== T_WALL && below !== T_VOID && y + 1 < M.h ? tileVis(M, bi) : 0, va = tileVis(M, i);
  const v = Math.max(va, vb); if (!v) return; curV = v;
  const faceL = vb ? lightByte(M, bi) : lightByte(M, i);
  const isRail = t === T_FENCE;
  const wh = isRail ? 12 : WALLH;
  if (below !== T_WALL && below !== T_WIN && below !== T_VOID) { curL = faceL; const fb = tileBuf('w', st, M.var[i] & 7); wblit(fb, sx, sy + TH - wh + (isRail ? -6 : 0) + (isRail ? 0 : 0)); if (t === T_WIN && M.broken && M.broken[i]) { curL = faceL; wrect(sx + 2, sy + TH - wh + 2, TW - 4, wh - 6, 0xff101418); } }
  if (!isRail) { curL = Math.max(40, lightByte(M, i) * .7) | 0; curV = va || vb; const tb = tileBuf('t', st, 0); if (tb.d[0]) wblit(tb, sx, sy - wh); }
}
function drawDoor(M, dd, cx, cy) {
  const sx = dd.x * TW - cx, sy = dd.y * TH - cy, i = dd.i; curV = Math.max(tileVis(M, i), tileVis(M, i + M.w)); if (!curV) return; curL = lightByte(M, i + (dd.horiz ? M.w : 0));
  const st = WALLS[dd.style] || WALLS.concrete, frameC = hex(st[2]), doorC = dd.metal || dd.lock > 2 ? hex('#5a6270') : hex(dd.color || '#6a4a2e');
  if (dd.horiz) {
    const o = dd.o; // slide open to the right
    wrect(sx, sy + TH - WALLH, 2, WALLH, frameC); wrect(sx + TW - 2, sy + TH - WALLH, 2, WALLH, frameC); wrect(sx, sy + TH - WALLH - TH, TW, TH, mix(frameC, hex(st[0]), .4));
    if (o < 1) { const dw = Math.round((TW - 4) * (1 - o)); wrect(sx + 2, sy + TH - WALLH, dw, WALLH, doorC); wrect(sx + 2, sy + TH - WALLH, dw, 1, shadeOf(doorC, 1.3)); if (dw > 6) { wset(sx + dw - 2, sy + TH - 9, dd.lock && !dd.unlocked ? hex('#ff3030') : hex('#d8c040')); if (dd.lock) wset(sx + dw - 2, sy + TH - 11, hex('#30ff60')); } }
    else wrect(sx + 2, sy + TH - WALLH, TW - 4, 2, frameC);
  } else {
    const o = dd.o; wrect(sx + 9, sy - WALLH + TH, 6, 3, frameC);
    if (o < 1) { const dh = Math.round(TH * (1 - o)); wrect(sx + 10, sy + TH - dh - 8, 4, dh + 8, doorC); wrect(sx + 10, sy + TH - dh - 8, 1, dh + 8, shadeOf(doorC, 1.3)); if (dd.lock) wset(sx + 12, sy + 4, dd.unlocked ? hex('#30ff60') : hex('#ff3030')); }
  }
}
function drawProp(M, e, cx, cy) {
  const p = PROPS[e.p], img = e.img || p.img, fx = Math.floor(e.x), fy = Math.floor(e.y);
  let v = 0, l = 0, n = 0; for (let yy = 0; yy < p.fh; yy++) for (let xx = 0; xx < p.fw; xx++) { const i = (fy + yy) * M.w + fx + xx; if (!inMap(M, fx + xx, fy + yy)) continue; v = Math.max(v, tileVis(M, i)); l += lightByte(M, i); n++; }
  if (!v) return; curV = v; curL = p.emissive ? 255 : (l / Math.max(1, n)) | 0;
  if (p.wall) { const sx = (e.x + .5) * TW - cx - img.w / 2, sy = fy * TH - cy - WALLH + 4; wblit(img, sx, sy); return; }
  const sx = (e.x + p.fw / 2) * TW - cx - img.w / 2, sy = (e.y + p.fh) * TH - cy - img.h + 1 + (e.off2 || 0);
  wblit(img, sx, sy, e.flip);
  if (e.paint) { const L = curL; curL = 255; e.paint(sx, sy, e); curL = L; } else if (PAINTERS[e.p]) { const L = curL; curL = 255; PAINTERS[e.p](sx, sy, e); curL = L; }
  if (e.hl) { curL = 255; frameR(sx - 1, sy - 1, img.w + 2, img.h + 2, hex('#ffd24a')); }
}
// live screens on props (faces on monitors, the jukebox)
const PAINTERS = {
  facescreen(sx, sy, e) { if (e.dead) return; const talking = CV.active && (CV.who === 'FACE' || CV.who === 'OLDFACE'), old = e.old, t = G.t;
    wrect(sx + 2, sy + 2, 42, 28, 0xff05040a); const ec = hex('#ff40ff'), gc = hex('#40ff60');
    for (const ex of [14, 32]) { for (let a = 0; a < 6.28; a += .2) wset(sx + ex + Math.cos(a) * 6, sy + 12 + Math.sin(a) * 3, ec); for (let k = -4; k <= 4; k++) wset(sx + ex + k, sy + 12 + Math.sin(k * 1.7 + t * 9) * (talking ? 2 : 1), gc); }
    wset(sx + 23, sy + 17, ec); wset(sx + 22, sy + 18, ec); wset(sx + 24, sy + 19, ec); const mw = talking ? 6 + Math.abs(Math.sin(t * 14)) * 6 : 6; wrect(sx + 23 - mw / 2, sy + 23, mw, 2, gc);
    if ((frame & 63) < 3) for (let k = 0; k < 30; k++) wset(sx + 2 + rnd(42), sy + 2 + rnd(28), 0xffffffff); },
  jukebox(sx, sy, e) { for (let i = 0; i < 4; i++) { const h = 2 + Math.abs(Math.sin(G.t * 6 + i * 1.3)) * 5; wrect(sx + 5 + i * 3.5, sy + 20 - h, 2, h, [hex('#ff40a0'), hex('#40ffa0'), hex('#a040ff'), hex('#ffd040')][i]); } },
  dyslexio(sx, sy, e) { const t = G.t, talking = CV.active && CV.who === 'DYSLEXIO'; for (const ex of [7, 15]) for (let k = -2; k <= 2; k++) wset(sx + ex + k, sy + 15 + Math.sin(k * 1.7 + t * 9), hex('#40ff60')); const mw = talking ? 4 + Math.abs(Math.sin(t * 14)) * 4 : 6; wrect(sx + 11 - mw / 2, sy + 20, mw, 1, hex('#ff40ff')); },
  tv(sx, sy, e) { const t = (G.t * 4) | 0; for (let k = 0; k < 6; k++) wrect(sx + 3 + ((k * 7 + t) % 12), sy + 6 + (k % 3) * 3, 2, 2, [hex('#ff70b0'), hex('#80c0ff'), hex('#ffffff')][k % 3]); },
};
// ---------- actors ----------
function dirKey(a) { const c = Math.cos(a), s = Math.sin(a) * 1.15; if (Math.abs(c) > Math.abs(s)) return ['r', c < 0]; return [s > 0 ? 'd' : 'u', false]; }
function spriteFrame(sp, ang, moving, phase, suf = '') { const [d, flip] = dirKey(ang), k = d + (moving ? 1 + ((phase | 0) % 3) : 0); return [sp[k + suf] || sp[k] || sp.d0, flip, d]; }
const OCC = { list: [], col: [] };
function drawActorAt(M, a, sp, cx, cy, isPlayer) {
  const sx0 = a.x * TW - cx, sy0 = a.y * TH - cy, i = (a.y | 0) * M.w + (a.x | 0);
  curL = isPlayer ? Math.max(165, lightByte(M, i)) : lightByte(M, i); curV = 2;
  if (a.dead || a.down) { const b = sp.down; if (!b) return; wblit(b, sx0 - b.w / 2, sy0 - b.h + 3, a.flipDown); return; }
  if (a.cloak && !isPlayer) return;
  // Carl: crouch frames, and armless frames when his arms are posed live (aiming, reloading, swinging, picking a lock...)
  const posed = isPlayer && sp.d0n, kind = posed ? carlPose() : null; let mv = a.moving, ph = a.walkPh;
  if (posed && !mv && !kind && P.stillT > 3) { const t = ((P.stillT * 60) | 0) % 150; if (t < 24 && (t >> 3) & 1) { mv = 1; ph = 0; } } // nervous foot tap
  const [b, flip, d] = spriteFrame(sp, a.face, mv, ph, posed ? (a.crouch ? 'c' : '') + (kind ? 'n' : '') : '');
  const bx = sx0 - b.w / 2, by = sy0 - b.h + 2 + (a.crouch && !posed ? 3 : 0);
  // shadow
  if (!a.fly) for (let k = -4; k <= 4; k++) { const xx = (sx0 + k) | 0, yy = (sy0 + 1) | 0; if (xx >= 0 && xx < W && yy >= 0 && yy < H) { const q = yy * W + xx; FB[q] = shadeOf(FB[q], .55); } }
  const gun = a.wpn && WPN[a.wpn] && !WPN[a.wpn].hide;
  if (gun && d === 'u' && !isPlayer) drawGun(a, sx0, by + b.h * .5, cx, cy);
  if (kind && d === 'u' && kind !== 'carry') drawCarlArms(kind, b, bx, by, flip, sp);
  if (a.cloak && isPlayer) { for (let j = 0; j < b.h; j++) for (let k = 0; k < b.w; k++) { const c = b.d[j * b.w + (flip ? b.w - 1 - k : k)]; if (c && ((k + j + (frame >> 2)) & 3) === 0) wset(bx + k, by + j, hex('#60c0ff')); } }
  else if (a.crouch && isPlayer && !posed) { const cb = { w: b.w, h: b.h - 3, d: b.d }; wblit(cb, bx, by, flip); }
  else wblit(b, bx, by, flip, a.hurtT > 0 && (a.hurtT & 2) ? WHITE : 0);
  if (gun && d !== 'u' && !isPlayer) drawGun(a, sx0, by + b.h * (a.big ? .4 : .55), cx, cy);
  if (kind && (d !== 'u' || kind === 'carry')) drawCarlArms(kind, b, bx, by, flip, sp);
  if (posed && M.alarm > 0 && frame % 50 < 14) { const A = sp[d + '0n'].arm; curL = 255; wset(bx + (flip ? 4 : b.w - 5), by + A.hy - 3 + ((frame % 50) >> 1), hex('#80d0ff')); } // he sweats
  if (isPlayer) { OCC.list.length = 0; OCC.col.length = 0; for (let j = 0; j < b.h; j++) for (let k = 0; k < b.w; k++) { const c = b.d[j * b.w + (flip ? b.w - 1 - k : k)]; if (!c) continue; const xx = (bx + k) | 0, yy = (by + j) | 0; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; OCC.list.push(yy * W + xx); OCC.col.push(FB[yy * W + xx]); } }
  SHOWN.actors.push({ a, x: sx0, y: by, w: b.w, h: b.h });
}
function drawGun(a, x, y, cx, cy) {
  const wp = WPN[a.wpn], len = wp.len || 6, c = Math.cos(a.aim !== undefined ? a.aim : a.face), s = Math.sin(a.aim !== undefined ? a.aim : a.face);
  const col = hex(wp.col || '#2a2a30'), x1 = x + c * len, y1 = y + s * len * .6;
  for (let k = 0; k <= len; k++) { const xx = x + (x1 - x) * k / len, yy = y + (y1 - y) * k / len; wset(xx, yy, col); if (wp.thick) wset(xx, yy + 1, shadeOf(col, .7)); }
  if (a.flashT > 0) { a.muzzle = [x1, y1]; }
}
// ---------- Carl's live arms ----------
function carlPose() {
  const it = P.held, def = it && ITEMS[it.id], wp = def && def.weapon ? WPN[def.weapon] : null;
  if (P.feeding) return 'feed'; if (P.mending) return 'mend'; if (P.carry) return 'carry'; if (P.busy) return 'tool'; if (P.useT > 0) return 'use'; if (P.reachT > 0) return 'reach';
  if (!wp || wp.hide) return P.fireT > 0 ? 'punch' : null; // bare hands
  return wp.melee ? 'melee' : wp.thrown ? 'throw' : 'gun';
}
function limb(S, H, c, hi) { // a 1px limb with an ink outline
  const n = Math.max(1, Math.ceil(Math.hypot(H[0] - S[0], H[1] - S[1])));
  for (let pass = 0; pass < 2; pass++) for (let k = 0; k <= n; k++) { const x = S[0] + (H[0] - S[0]) * k / n, y = S[1] + (H[1] - S[1]) * k / n;
    if (pass) wset(x, y, k === 0 && hi ? hi : c); else { wset(x - 1, y, INK); wset(x + 1, y, INK); wset(x, y - 1, INK); wset(x, y + 1, INK); } }
}
function drawCarlArms(kind, b, bx, by, flip, sp) {
  const A = b.arm; if (!A) return; const mir = x => flip ? b.w - 1 - x : x;
  const L = [bx + mir(A.lx) + .5, by + A.sy], R = [bx + mir(A.rx) + .5, by + A.sy], M0 = [(L[0] + R[0]) / 2, L[1]];
  const s = sp.s, armC = shadeOf(hex(s.coat || s.top || '#3a4a6a'), 1.7), armH = shadeOf(armC, 1.5), skin = hex(s.skin || PAL.skinA);
  const dirOf = ang => [Math.cos(ang), Math.sin(ang) * .6], u = dirOf(P.aim), side = u[0] >= 0 ? 1 : -1;
  const add = (p, v, d) => [p[0] + v[0] * d, p[1] + v[1] * d], at = (d, v = u) => add([M0[0], M0[1] + 1], v, d);
  const arm = (S, H) => { limb(S, H, armC, armH); wset(H[0], H[1], skin); };
  const rest = S => [S[0], S[1] + 5], near = side > 0 ? R : L, far = side > 0 ? L : R;
  const item = (H, v, len, col, thick) => { const t = add(H, v, -1), e = add(H, v, len); limb(t, e, col, shadeOf(col, 1.5)); if (thick) limb([t[0], t[1] + 1], [e[0], e[1] + 1], shadeOf(col, .7)); };
  if (kind === 'gun') {
    const it = heldWeapon(), wp = WPN[ITEMS[it.id].weapon], col = hex(wp.col || '#8a8e9a'), len = wp.len || 6, long = len >= 8 || wp.thick;
    if (P.reloadT > 0) { // gun tipped down, off hand working the magazine
      const v = [side * .5, .85], G = [M0[0] + side * 3, M0[1] + 3], H2 = [G[0] + side, G[1] + 3 + Math.round(Math.abs(Math.sin(frame * .3)) * 2)];
      arm(far, H2); item(G, v, len - 1, col, wp.thick); arm(near, G); return; }
    const G = at(6 - (P.flashT > 0 ? 2 : 0)); // recoil kicks the hands back
    arm(far, long ? add(G, u, 3) : G); item(G, u, len, col, wp.thick); arm(near, G);
    if (P.flashT > 0 && !(it.mods && it.mods.sil) && wp.noise > 2) { const m = add(G, u, len + 1), y = hex('#ffd060'); P.muzzle = m; curL = 255; wset(m[0], m[1], WHITE); wset(m[0] + 1, m[1], y); wset(m[0] - 1, m[1], y); wset(m[0], m[1] - 1, y); wset(m[0], m[1] + 1, y); }
    return; }
  if (kind === 'melee') {
    const wp = WPN[ITEMS[P.held.id].weapon], col = hex(wp.col || '#9aa0a8'), len = wp.len || 5, sa = Math.atan2(u[1], u[0]);
    let ang = sa - side * 1.3; // ready: raised over the shoulder
    if (P.fireT > 0) { const p = 1 - P.fireT / wp.rate, q = Math.min(1, p / .35); ang = sa - side * 1.6 + side * 2.6 * q * (2 - q);
      if (p < .6) { curL = 255; for (let a2 = sa - side * 1.6; side * (ang - a2) > 0; a2 += side * .18) wset(M0[0] + Math.cos(a2) * (6 + len), M0[1] + Math.sin(a2) * (6 + len) * .6, wp.glowW ? hex('#a0ffc8') : hex('#e0e8f0')); } }
    const v = [Math.cos(ang), Math.sin(ang)], H = add(M0, v, 5);
    arm(far, at(2)); item(H, v, len, col, 0); arm(near, H); return; }
  if (kind === 'punch') { const p = 1 - P.fireT / WPN.fists.rate, ext = Math.sin(Math.min(1, p * 2.2) * Math.PI), jab = (P.punchN || 0) & 1 ? far : near;
    arm(jab === near ? far : near, at(2)); arm(jab, at(2 + 7 * ext)); return; }
  if (kind === 'throw') { const wp = WPN[ITEMS[P.held.id].weapon]; let H = [near[0] + side, near[1] + 4], show = 1;
    if (P.fireT > 0) { const p = 1 - P.fireT / wp.rate; if (p < .3) H = [M0[0] - side * 4, M0[1] - 5]; else { H = at(7); show = 0; } }
    arm(far, at(3)); arm(near, H); if (show) { wset(H[0], H[1] - 1, hex('#4a6a3a')); wset(H[0] + side, H[1] - 1, hex('#3a5a2a')); } return; }
  if (kind === 'tool') { const t = P.busy.target || {}, tx = (t.x || 0) + (t.k ? 0 : .5), ty = (t.y || 0) + (t.k ? 0 : .5), v = dirOf(Math.atan2(ty - P.y, tx - P.x)), j = (frame >> 2) & 1;
    const H = add(at(5, v), [j, 0], 1); arm(far, [H[0], H[1] + 1]); arm(near, H); wset(H[0] + v[0] * 2, H[1] + v[1] * 2, hex('#c0c8d0'));
    if ((frame & 15) === 0) { curL = 255; wset(H[0] + v[0] * 3, H[1] - 1, hex('#ffe080')); } return; }
  if (kind === 'reach') { const p = 1 - P.reachT / 12, v = dirOf(P.reachA); arm(far, rest(far)); arm(near, at(2 + 7 * Math.sin(p * Math.PI), v)); return; }
  if (kind === 'use') { const p = 1 - P.useT / 30, mouth = [M0[0] + side, by + A.hy + 3], r = rest(near), k = Math.min(1, p * 3) * (p > .85 ? (1 - p) / .15 : 1), H = [r[0] + (mouth[0] - r[0]) * k, r[1] + (mouth[1] - r[1]) * k];
    arm(far, rest(far)); arm(near, H); wset(H[0], H[1] - 1, hex(P.useCol || '#e04040')); return; }
  if (kind === 'feed') { const t = P.feeding.e, v = dirOf(angTo(P, t)), j = (frame >> 3) & 1; arm(far, at(5 + j, v)); arm(near, at(6, v)); curL = 255; if ((frame & 7) < 4) wset(M0[0] + v[0] * 7, M0[1] + v[1] * 7, hex(SP().fx)); return; }
  if (kind === 'mend') { const c = [M0[0], M0[1] + 3]; arm(L, c); arm(R, c); curL = 255; for (let k = 0; k < 3; k++) wset(c[0] + Math.cos(G.t * 6 + k * 2.1) * 4, c[1] + Math.sin(G.t * 6 + k * 2.1) * 2, hex(SP().fx)); return; }
  if (kind === 'carry') { const e = P.carry, bs = SPRITES[e.sprite]; arm(L, [L[0] - 1, L[1] - 4]); arm(R, [R[0] + 1, R[1] - 4]); if (bs && bs.down) wblit(bs.down, M0[0] - bs.down.w / 2, M0[1] - bs.down.h - 1, side < 0); }
}
function checkOcclusion() { // anything drawn over Carl after he was drawn: show him as a silhouette there
  OCC.hidden = []; for (let k = 0; k < OCC.list.length; k++) { const q = OCC.list[k]; if (FB[q] !== OCC.col[k]) OCC.hidden.push(q); }
}
function drawPlayerSprite(M, cx, cy) { if (!P) return; drawActorAt(M, P, SPRITES[P.sprite || 'carl'], cx, cy, true); }
function drawEnt(M, e, cx, cy) {
  const i = (e.y | 0) * M.w + (e.x | 0);
  if (!M.vis[i] && !(P && P.augOn && P.augOn.vision >= 3 && dist(P, e) < 8 && e.k === 'npc')) return;
  if (e.k === 'npc') { const sp = SPRITES[e.vis && (e.trueAlways || M.d.trueForms || (P && P.augOn.vision)) && SPRITES['v_' + e.vis] ? 'v_' + e.vis : e.sprite]; if (!sp) return; drawActorAt(M, e, sp, cx, cy, false); if (!M.vis[i]) { /* seen through walls */ } return; }
  if (e.k === 'corpse') return;
  if (e.k === 'item') { curL = lightByte(M, i); curV = 2; const ic = iconOf(e.item), sx = e.x * TW - cx - 7, sy = e.y * TH - cy - 6;
    // a small pickup: the icon squashed into a 14x8 chip with a glint
    for (let j = 0; j < 8; j++) for (let k = 0; k < 14; k++) { const c = ic.d[((j * ic.h / 8) | 0) * ic.w + ((k * ic.w / 14) | 0)]; if (c) wset(sx + k, sy + j, c); }
    if ((frame + e.uid.length * 7) % 90 < 6) { curL = 255; wset(sx + 2 + ((frame % 90)), sy, WHITE); } return; }
  if (e.k === 'cam') { curL = lightByte(M, i); curV = 2; const sx = e.x * TW - cx, sy = e.y * TH - cy - WALLH - 2, c = Math.cos(e.ang), s = Math.sin(e.ang);
    wrect(sx - 3, sy - 2, 6, 4, e.dead ? hex('#3a3a3a') : hex('#c8ccd4')); wrect(sx + c * 4 - 1, sy + s * 2 - 1, 3, 2, hex('#2a2a32')); if (!e.dead && !e.off) wset(sx, sy - 3, e.alertT > 0 ? hex('#ff2020') : (frame >> 4) & 1 ? hex('#30ff30') : hex('#106010')); return; }
  if (e.k === 'turret') { curL = lightByte(M, i); curV = 2; const sx = e.x * TW - cx, sy = e.y * TH - cy, c = Math.cos(e.ang), s = Math.sin(e.ang);
    wrect(sx - 6, sy - 6, 12, 7, e.dead ? hex('#2a2a2a') : hex('#4a5060')); wrect(sx - 4, sy - 11, 8, 6, e.dead ? hex('#3a3a3a') : hex('#6a7080')); for (let k = 0; k < 9; k++) wset(sx + c * k, sy - 8 + s * k * .6, hex('#202028')); return; }
  if (e.k === 'drone') { curL = 255; curV = 2; const sx = e.x * TW - cx, sy = e.y * TH - cy - 14; blob(sx, sy, 4, 3, shadeTones('#5ac8a8')); wset(sx - 1, sy, hex('#c0ffd0')); wset(sx + 1, sy, hex('#c0ffd0')); return; }
  if (e.k === 'proj') { curL = 255; curV = 2; const sx = e.x * TW - cx, sy = e.y * TH - cy - 10 - (e.z || 0); wrect(sx - 1, sy - 1, e.size || 2, e.size || 2, hex(e.col || '#ffe080')); }
}
// ---------- overlays drawn after the light pass: lasers, beams, cones, flashes, tracers, text ----------
function drawOverlays(M, cx, cy) {
  if (OCC.hidden && OCC.hidden.length) { const c = hex('#40e0b0'); for (const q of OCC.hidden) if (((q % W) + (q / W | 0)) & 1) FB[q] = c; }
  for (const e of M.ents) {
    if (e.k === 'laser' && !e.off && !e.gone) { const i = (e.y | 0) * M.w + (e.x | 0); if (!M.seen[i]) continue; const x0 = e.x * TW - cx, y0 = e.y * TH - cy - 6, x1 = e.x2 * TW - cx, y1 = e.y2 * TH - cy - 6; lineF(x0, y0, x1, y1, (frame >> 1) & 1 ? hex('#ff2020') : hex('#ff6060')); }
    if (e.k === 'cam' && !e.dead && !e.off && M.vis[(e.y | 0) * M.w + (e.x | 0)]) coneFx(e.x, e.y, e.ang, e.fov || .5, e.range || 7, e.alertT > 0 ? hex('#ff3030') : hex('#ffe060'), cx, cy, M);
    if (e.k === 'npc' && e.alert !== undefined && !e.dead && !e.down && M.vis[(e.y | 0) * M.w + (e.x | 0)]) {
      const sx = e.x * TW - cx, sy = e.y * TH - cy - (SPRITES[e.sprite] && SPRITES[e.sprite].d0 ? SPRITES[e.sprite].d0.h : 30) - 4;
      if (e.state === 'combat' || e.sus >= 1) text('!', sx - 2, sy - 6, hex('#ff3030'), INK); else if (e.sus > .05) { text('?', sx - 2, sy - 6, hex('#ffd040'), INK); rectF(sx - 5, sy + 2, 10, 2, INK); rectF(sx - 5, sy + 2, Math.min(10, e.sus * 10), 2, hex('#ffd040')); }
      if (OPT.cones && e.state !== 'combat' && e.ai !== 'civ') coneFx(e.x, e.y, e.face, .7, 1, hex('#80a0ff'), cx, cy, M, e.viewR || 8);
    }
  }
  for (const f of M.fx) {
    if (f.tracer) { const tc = f.c || (f.col ? hex(f.col) : hex('#ffe890')); lineF(f.x * TW - cx, f.y * TH - cy - 12, f.x2 * TW - cx, f.y2 * TH - cy - 12, tc); if (f.thick) lineF(f.x * TW - cx, f.y * TH - cy - 11, f.x2 * TW - cx, f.y2 * TH - cy - 11, tc); }
    if (f.moth) for (let k = 0; k < 26; k++) { const a = hash(k, f.s, 5) * 6.28 + G.t * (1 + hash(k, f.s, 6) * 3), r = hash(k, f.s, 7) * f.r; const mx = f.x * TW - cx + Math.cos(a) * r * TW, my = f.y * TH - cy - 10 + Math.sin(a * 1.3) * r * TH; pset(mx, my, hex('#e0d0b0')); if ((frame + k) & 2) pset(mx + 1, my, hex('#a09070')); }
    if (f.flash) glow(f.x * TW - cx, f.y * TH - cy - 12, f.r || 10, hex(f.col || '#ffd060'), f.t / f.t0);
    if (f.boom) { const r = (1 - f.t / f.t0) * f.r * TW; for (let k = 0; k < 30; k++) { const a = k / 30 * 6.28; pset(f.x * TW - cx + Math.cos(a) * r, f.y * TH - cy - 8 + Math.sin(a) * r * .5, k & 1 ? hex('#ffd040') : hex('#ff6020')); } glow(f.x * TW - cx, f.y * TH - cy - 8, r * .8 + 4, hex('#ff8020'), f.t / f.t0); }
    if (f.gas) for (let k = 0; k < 18; k++) { const a = hash(k, f.s, 1) * 6.28, r = hash(k, f.s, 2) * f.r * (1.2 - f.t / f.t0 * .2); ditherRect(f.x * TW - cx + Math.cos(a) * r * TW - 6, f.y * TH - cy + Math.sin(a) * r * TH - 10, 12, 6, hex(f.col || '#90c060'), .35 * Math.min(1, f.t / 60)); }
    if (f.txt && f.t > 0) { const sx = f.x * TW - cx, sy = f.y * TH - cy - 40 - (f.wrap ? 0 : (f.t0 - f.t) * .15), ls = f.wrap ? wrapT(f.txt, 34) : [f.txt]; ls.forEach((l, k) => ctext(l, sy - (ls.length - 1 - k) * 8, f.c || WHITE, INK, clamp(sx, tw(l) / 2 + 2, W - tw(l) / 2 - 2))); }
    if (f.spark) for (let k = 0; k < 5; k++) pset(f.x * TW - cx + (hash(k, f.s, 3) - .5) * 10 * (1 - f.t / f.t0) * 2, f.y * TH - cy - 12 + (hash(k, f.s, 4) - .5) * 8 * (1 - f.t / f.t0) * 2, hex(f.col || '#ffe080'));
  }
  if (M.d.rain) { const rc = hex('#8098c0'), rc2 = hex('#c0d0f0'); for (let k = 0; k < 90; k++) { const x = (hash(k, 1, 9) * W + frame * 3 + k * 7) % W, y = (hash(k, 2, 9) * H + frame * 9) % H; if (VB[(y | 0) * W + (x | 0)] !== 2) continue; lineF(x, y, x - 2, y + 6, k & 3 ? rc : rc2); } if (frame % 400 < 3 && M.d.rain > 1) { post.flash = Math.max(post.flash, .25); } }
  if (P && P.muzzle) { glow(P.muzzle[0], P.muzzle[1], 8, hex('#ffd060'), 1); P.muzzle = null; }
  for (const e of M.ents) if (e.k === 'npc' && e.muzzle) { glow(e.muzzle[0], e.muzzle[1], 7, hex('#ffd060'), 1); e.muzzle = null; }
  if (P && P.augOn && P.augOn.light && P.map === M) { const sx = P.x * TW - cx, sy = P.y * TH - cy - 16; pset(sx - 2, sy, hex('#c0ffd0')); pset(sx + 2, sy, hex('#c0ffd0')); }
}
function coneFx(x, y, ang, fov, alpha, col, cx, cy, M, R) {
  R = R || 7; const steps = 14;
  for (let k = 0; k <= steps; k++) { const a = ang - fov + 2 * fov * k / steps; let r = 0;
    for (; r < R; r += .25) { const xx = x + Math.cos(a) * r, yy = y + Math.sin(a) * r; if (!inMap(M, xx, yy) || M.opaque[(yy | 0) * M.w + (xx | 0)]) break; }
    const sx = x * TW - cx, sy = y * TH - cy - 4, ex = sx + Math.cos(a) * r * TW, ey = sy + Math.sin(a) * r * TH;
    if (k === 0 || k === steps) lineF(sx, sy, ex, ey, col); else pset(ex, ey, col); }
}

// ---------- snapshots (leaving a map / saving) ----------
const SAVE_KEYS = ['x', 'y', 'hp', 'dead', 'down', 'state', 'items', 'searched', 'gone', 'off', 'team', 'face', 'unlocked', 'used', 'hacked', 'n', 'credits', 'alertT', 'sus', 'conv', 'met', 'hostile', 'carried', 'flipDown', 'ang', 'locked', 'opened', 'boughtOut', 'ko', 'lit', 'routeI', 'home', 'follow', 'bodyFound', 'awake', 'charm', 'denial', 'tag', 'hidden', 'wpn', 'img2'];
function snapMap(M) {
  const ents = {}, spawned = [];
  for (const e of M.ents) { const o = { _k: e.k, _to: e.to }; for (const k of SAVE_KEYS) if (e[k] !== undefined && typeof e[k] !== 'function') o[k] = e[k]; if (e.k === 'npc' && e.parts) o.parts = e.parts;
    if (/:s\d+$/.test(e.uid)) { const c = {}; for (const k in e) if (typeof e[k] !== 'function' && typeof e[k] !== 'object' || k === 'items' || k === 'route' || k === 'light') c[k] = e[k]; spawned.push(c); } else ents[e.uid] = o; }
  const doors = {}; for (const k in M.doors) { const d = M.doors[k]; doors[k] = { open: d.open, unlocked: d.unlocked, hp: d.hp, broken: d.broken, lock: d.lock }; }
  return { ents, spawned, doors, removed: Object.assign({}, M.removed), decals: M.decals.slice(-80), lightsOut: M.lightsOut, broken: M.broken, alarm: 0, flags: M.flags || {} };
}
function restoreMap(M, s) {
  if (!s) return;
  // legacy snapshots (no _k) were keyed by indices that later map edits shifted: they'd delete the cab and move props. Keep doors/decals/spawned, drop per-entity state.
  if (!Object.values(s.ents || {}).some(o => o._k !== undefined)) s = Object.assign({}, s, { ents: {}, removed: {} });
  for (const e of M.ents.slice()) { const rm = s.removed && s.removed[e.uid]; if (rm && !(rm === 1 && e.k === 'prop') && (rm === 1 || rm === e.k + ':' + (e.p || e.to || e.item || ''))) { removeEnt(M, e); continue; } const o = s.ents[e.uid]; if (!o) continue;
    // uids are positional: if the map was edited since the save, an index may now be another entity. Skip a mismatch, and never move exits, doors, spawns or triggers (old saves carry no _k).
    if (o._k !== undefined && (o._k !== e.k || o._to !== e.to)) continue; const c = Object.assign({}, o); delete c._k; delete c._to; if (e.k !== 'npc') { delete c.x; delete c.y; } Object.assign(e, c); }
  for (const c of s.spawned || []) { if (c.k === 'npc') { const e = Object.assign({}, c); spawnEnt(M, e); Object.assign(e, c); } else spawnEnt(M, Object.assign({}, c)); }
  for (const k in s.doors || {}) if (M.doors[k]) { Object.assign(M.doors[k], s.doors[k]); M.doors[k].o = M.doors[k].open ? 1 : 0; }
  M.decals = s.decals || []; M.lightsOut = s.lightsOut || {}; M.broken = s.broken; M.flags = s.flags || {};
  if (M.broken) for (const k in M.broken) { M.t[k] = T_FLOOR; }
  rebuildBlock(M); computeLight(M);
}

// ---------- map builder: big maps from fills, rooms and ASCII stamps (spaces in a stamp are transparent) ----------
function mk(w, h, fillCh = ' ') {
  const g = []; for (let y = 0; y < h; y++) g.push(Array(w).fill(fillCh));
  const B = {
    w, h, g,
    put(x, y, c) { if (y >= 0 && y < h && x >= 0 && x < w) g[y][x] = c; return B; },
    get(x, y) { return y >= 0 && y < h && x >= 0 && x < w ? g[y][x] : ' '; },
    fill(x, y, ww, hh, c) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) B.put(i, j, c); return B; },
    rect(x, y, ww, hh, wall, floor) { B.fill(x, y, ww, hh, wall); if (floor) B.fill(x + 1, y + 1, ww - 2, hh - 2, floor); return B; },
    hline(x, y, n, c) { return B.fill(x, y, n, 1, c); }, vline(x, y, n, c) { return B.fill(x, y, 1, n, c); },
    stamp(x, y, s) { const rows = s.replace(/^\n/, '').replace(/\n\s*$/, '').split('\n'); rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== ' ') B.put(x + i, y + j, r[i]); }); return B; },
    scatter(x, y, ww, hh, c, n, seed = 1, on) { const r = srand(seed); for (let k = 0; k < n; k++) { const xx = x + ((r() * ww) | 0), yy = y + ((r() * hh) | 0); if (!on || on.includes(B.get(xx, yy))) B.put(xx, yy, c); } return B; },
    replace(x, y, ww, hh, from, to) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) if (from.includes(B.get(i, j))) B.put(i, j, to); return B; },
    str() { return g.map(r => r.join('')).join('\n'); },
  };
  return B;
}
