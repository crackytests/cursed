'use strict';
// ================= STICK UP: Vice Versa, Nevada. tile map, baked ground, buildings extruded toward a camera over the street =================
const T = 32, MW = 60, MH = 58, GW = MW * T, GH = MH * T;
const HR = [1, 10, 19, 28, 37, 46, 55], VR = [1, 10, 19, 28, 37, 46]; // 2-wide roads start here
const TL = { grass: 0, road: 1, walk: 2, bldg: 3, water: 4, sand: 5, lot: 6, pool: 7, dock: 8, path: 9, wall: 10, floor: 11, room: 12 };
const MAP = new Uint8Array(MW * MH), BLD = [], TREES = [], PLACES = {}, DIST = new Uint8Array(MW * MH);
const DNAMES = ['MIDTOWN', 'GHOST HILLS', 'THE STRIP', 'DOWNTOWN', 'SOUTH SIDE', 'THE YARDS', 'LAKE MEED'];
const tAt = (tx, ty) => tx < 0 || ty < 0 || tx >= MW || ty >= MH ? TL.wall : MAP[ty * MW + tx];
const tileOf = (x, y) => tAt(Math.floor(x / T), Math.floor(y / T));
const solidCar = t => t === TL.bldg || t === TL.water || t === TL.pool || t === TL.wall || t === TL.room;
const solidPed = t => t === TL.bldg || t === TL.water || t === TL.pool || t === TL.wall;
const isRoadT = t => t === TL.road;
const inH = ty => HR.some(r => ty === r || ty === r + 1), inV = tx => VR.some(c => tx === c || tx === c + 1);
let rngS = 1999; const srnd = () => { rngS = (rngS * 1103515245 + 12345) & 0x7fffffff; return rngS / 0x7fffffff; }, sri = n => (srnd() * n) | 0;
const hsh = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function setT(tx, ty, t) { if (tx >= 0 && ty >= 0 && tx < MW && ty < MH) MAP[ty * MW + tx] = t; }
function fillT(x, y, w, h, t) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) setT(x + i, y + j, t); }
// a building: tile rect, height in world px, colors; o: {sign, roof, neon, glass, kind}
function bld(x, y, w, h, z, wall, roof, o = {}) { fillT(x, y, w, h, TL.bldg); const b = Object.assign({ x: x * T, y: y * T, w: w * T, h: h * T, z, wall: hex(wall), roof: hex(roof) }, o); BLD.push(b); return b; }
const place = (name, tx, ty, o = {}) => PLACES[name] = Object.assign({ x: tx * T + T / 2, y: ty * T + T / 2 }, o);
function district(i, j) { if (i <= 1 && j <= 1) return 1; if (i >= 3 && j <= 1) return 2; if (i >= 1 && i <= 3 && j >= 2 && j <= 3) return 3; if (i <= 1 && j >= 4) return 4; if (i >= 3 && j >= 4) return 5; return 0; }
const GLASS = ['#4a6d92', '#6d92b6', '#49496d', '#92b6db', '#246d92', '#6d6d92'], CONC = ['#b6b6a0', '#a09280', '#c8b692', '#928e8a', '#b6a080'], HOUSE = ['#dbb692', '#f0dbb6', '#b6926d', '#dbdbb6', '#c8a0a0'];
function genCity() {
  MAP.fill(TL.grass); BLD.length = 0; TREES.length = 0; rngS = 1999; intReset();
  fillT(0, 0, MW, 1, TL.wall); fillT(0, MH - 1, MW, 1, TL.wall); fillT(0, 0, 1, MH, TL.wall);
  // the lake: everything east of the last avenue, with a sand shore and two docks
  fillT(48, 1, 1, MH - 2, TL.walk); fillT(49, 1, 2, MH - 2, TL.sand); fillT(51, 0, MW - 51, MH, TL.water);
  for (const dy of [12, 22, 31, 41]) { fillT(49, dy, 5, 2, TL.dock); }
  for (const r of HR) fillT(1, r, 47, 2, TL.road);
  for (const c of VR) fillT(c, 1, 2, 56, TL.road);
  fillT(48, 46, 3, 2, TL.road); fillT(48, 55, 3, 2, TL.road); // a stub to the beach lots
  for (let j = 0; j < HR.length - 1; j++) for (let i = 0; i < VR.length - 1; i++) {
    const x0 = VR[i] + 2, y0 = HR[j] + 2; fillT(x0, y0, 7, 7, TL.walk); const ix = x0 + 1, iy = y0 + 1, d = district(i, j);
    for (let v = 0; v < 7; v++) for (let u = 0; u < 7; u++) DIST[(y0 + v) * MW + x0 + u] = d;
    const k = i + ',' + j;
    if (SPECIAL[k]) { SPECIAL[k](ix, iy, x0, y0); continue; }
    genBlock(d, ix, iy);
  }
  for (let ty = 0; ty < MH; ty++) for (let tx = 48; tx < MW; tx++) DIST[ty * MW + tx] = 6;
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) if (tx < 48 && !DIST[ty * MW + tx] && MAP[ty * MW + tx] === TL.road) { /* roads take the district of their neighbor block */
    DIST[ty * MW + tx] = district(clamp(VR.filter(c => c <= tx).length - 1, 0, 4), clamp(HR.filter(r => r <= ty).length - 1, 0, 5)); }
  bakeGround(); bakeMini();
}
function genBlock(d, ix, iy) {
  if (d === 3) { // downtown: towers
    const lay = pick2([[[0, 0, 2, 2], [3, 0, 2, 2], [0, 3, 2, 2], [3, 3, 2, 2]], [[0, 0, 5, 2], [0, 3, 2, 2], [3, 3, 2, 2]], [[0, 0, 2, 5], [3, 0, 2, 3]], [[1, 1, 3, 3]]]);
    for (const [u, v, w, h] of lay) bld(ix + u, iy + v, w, h, 110 + sri(110), GLASS[sri(6)], pick2(['#6d6d6d', '#929292', '#4a4a4a']), { kind: 'tower' });
  } else if (d === 2) { // the strip: casinos
    fillT(ix, iy, 5, 5, TL.lot); const big = srnd() < .5; const nm = pick2(['LUCKY', 'GOLDEN', 'KASINO', 'JACKPOT', 'MIRAGE-ISH', 'PHARAOH']);
    iCasino(ix, iy, big ? 3 : 2, 60 + sri(40), pick2(['#924992', '#b62449', '#db9224', '#2449b6']), pick2(['#ffdb49', '#ff49b6', '#49ffdb']), nm);
  } else if (d === 1) { // ghost hills: one mansion and a pool on a lawn
    fillT(ix, iy, 5, 5, TL.grass); fillT(ix + 1, iy + 4, 3, 1, TL.pool); iHouse(ix + 1, iy + 1, 3, 2, 26, pick2(HOUSE), pick2(['#b64924', '#924924', '#6d6d6d']), 'mansion'); fillT(ix + 4, iy, 1, 5, TL.lot);
    TREES.push([ix * T + 10, (iy + 4) * T + 20, 14], [(ix + 0) * T + 16, iy * T + 12, 12]);
  } else if (d === 4) { // south side: little houses
    fillT(ix, iy, 5, 5, TL.grass);
    for (const [u, v] of [[0, 0], [3, 0], [0, 3], [3, 3]]) if (srnd() < .8) iHouse(ix + u, iy + v, 2, 2, 18 + sri(10), pick2(HOUSE), pick2(['#924924', '#6d4924', '#49496d', '#6d6d6d']), 'house');
    fillT(ix + 2, iy, 1, 5, TL.lot); if (srnd() < .7) TREES.push([(ix + 2) * T + 16, (iy + 2) * T + 16, 11]);
  } else if (d === 5) { // the yards: warehouses and lots
    fillT(ix, iy, 5, 5, TL.lot); iWarehouse(ix, iy, 2 + sri(2), 34 + sri(14), pick2(CONC), pick2(['#6d6d6d', '#929292', '#6d4924']));
  } else { // midtown: offices or a park
    if (srnd() < .25) { fillT(ix, iy, 5, 5, TL.grass); fillT(ix + 2, iy, 1, 5, TL.path); fillT(ix, iy + 2, 5, 1, TL.path); for (let n = 0; n < 4; n++) TREES.push([(ix + [0, 3][n & 1]) * T + 24 + sri(16), (iy + [0, 3][n >> 1]) * T + 24 + sri(16), 12 + sri(5)]); }
    else { const lay = pick2([[[0, 0, 5, 2], [0, 3, 5, 2]], [[0, 0, 2, 5], [3, 0, 2, 5]], [[0, 0, 5, 5]]]); for (const [u, v, w, h] of lay) bld(ix + u, iy + v, w, h, 46 + sri(50), pick2(CONC.concat(GLASS)), pick2(['#6d6d6d', '#929292', '#a09280'])); }
  }
}
function pick2(a) { return a[sri(a.length)]; }
// the blocks the story needs, keyed by block column,row. ix,iy = interior 5x5 origin; x0,y0 = the sidewalk ring
const SPECIAL = {
  '0,2': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iStickNation(ix, iy); TREES.push([ix * T + 20, (iy + 4) * T + 10, 11]); },
  '1,5': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iDonuts(ix, iy); },
  '3,5': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iGas(ix, iy); bld(ix + 4, iy + 1, 1, 1, 12, '#db2424', '#f0f0f0'); bld(ix + 4, iy + 3, 1, 1, 12, '#db2424', '#f0f0f0'); },
  '1,0': (ix, iy) => { fillT(ix, iy, 5, 5, TL.grass); fillT(ix, iy + 3, 5, 2, TL.lot); iPlum(ix, iy); TREES.push([ix * T + 12, iy * T + 12, 12], [(ix + 4) * T + 20, iy * T + 14, 12]); },
  '4,3': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iJB(ix, iy); },
  '0,0': (ix, iy) => { fillT(ix, iy, 5, 5, TL.grass); fillT(ix, iy + 4, 3, 1, TL.pool); fillT(ix + 4, iy, 1, 5, TL.lot); iGhost(ix, iy); TREES.push([ix * T + 140, iy * T + 140, 13]); },
  '2,1': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iFace(ix, iy); },
  '3,0': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iStore(ix, iy); },
  '4,1': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); bld(ix, iy, 5, 2, 30, '#2492db', '#24dbdb', { sign: "PROP'N'SPRAY" }); place('spray', ix + 2, iy + 3); },
  '3,1': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iCasino(ix, iy, 3, 84, '#b69224', '#ffdb49', 'LUXOR'); place('valet', ix + 2, iy + 4); },
  '2,2': (ix, iy, x0, y0) => { // the jewel store: walls with a glass skylight, a floor you can walk on
    fillT(ix, iy, 5, 5, TL.floor);
    bld(ix, iy, 5, 1, 30, '#6d6d92', '#9292b6'); bld(ix, iy + 1, 1, 4, 30, '#6d6d92', '#9292b6'); bld(ix + 4, iy + 1, 1, 4, 30, '#6d6d92', '#9292b6'); bld(ix + 1, iy + 4, 1, 1, 30, '#6d6d92', '#9292b6'); bld(ix + 3, iy + 4, 1, 1, 30, '#6d6d92', '#9292b6');
    place('jewel', ix + 2, iy + 4, { door: 1 }); place('jewelIn', ix + 2, iy + 2); PLACES.jewelIn.cases = [[1, 1], [2, 1], [3, 1], [1, 3], [3, 3], [1, 2]].map(([u, v]) => [(ix + u) * T + 16, (iy + v) * T + (v === 1 ? 10 : v === 3 ? 18 : 16)]);
  },
  '2,3': (ix, iy) => { bld(ix, iy, 5, 4, 96, '#6d6d49', '#ffdb24', { sign: 'FASCISM INC', kind: 'vault' }); fillT(ix, iy + 4, 5, 1, TL.lot); place('depot', ix + 2, iy + 4); },
  '4,5': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); bld(ix + 1, iy + 1, 3, 2, 34, '#928e8a', '#6d6d49', { sign: 'PROP PILLZ', kind: 'lab' }); place('lab', ix + 2, iy + 4); PLACES.lab.cans = [[ix, iy], [ix + 4, iy], [ix, iy + 3], [ix + 4, iy + 3]].map(([u, v]) => [u * T + 16, v * T + 16]); },
  '0,5': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iCrib(ix, iy); place('ass', ix + 4, iy + 2); },
  '1,4': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iHospital(ix, iy); },
  '3,3': (ix, iy) => { fillT(ix, iy, 5, 5, TL.lot); iPolice(ix, iy); },
};
// ---------------- the baked ground: one big image, sampled with zoom each frame ----------------
const GROUND = new Uint32Array(GW * GH);
const GC = {};
function bakeGround() {
  const c = (h) => hex(h);
  Object.assign(GC, { asph: c('#3a3a42'), asph2: c('#44444c'), line: c('#ffdb49'), white: c('#e8e8e8'), walk: c('#a8a8a0'), walk2: c('#929288'), curb: c('#6d6d6d'), grass: c('#49924a'), grass2: c('#3a7a3a'), water: c('#2449b6'), water2: c('#246db6'), sand: c('#dbc892'), sand2: c('#c8b680'), lot: c('#4a4a4a'), pool: c('#49dbff'), dock: c('#926d49'), dock2: c('#6d4924'), path: c('#c8b692'), wall: c('#242424'), floor: c('#5a5a7a'), floor2: c('#4a4a66') });
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const t = MAP[ty * MW + tx];
    for (let py = 0; py < T; py++) for (let px = 0; px < T; px++) {
      const x = tx * T + px, y = ty * T + py, n = hsh(x, y); let col;
      if (t === TL.road || t === TL.lot) {
        col = n < .2 ? GC.asph2 : GC.asph;
        if (t === TL.road) {
          const h = inH(ty), v = inV(tx), cross = h && v;
          if (!cross && h && HR.includes(ty) && py === T - 1 && (x & 31) < 16) col = GC.line; // centre line: the seam between the two rows
          if (!cross && h && HR.includes(ty - 1) && py === 0 && (x & 31) < 16) col = GC.line;
          if (!cross && v && VR.includes(tx) && px === T - 1 && (y & 31) < 16) col = GC.line;
          if (!cross && v && VR.includes(tx - 1) && px === 0 && (y & 31) < 16) col = GC.line;
          if (cross && ((h && (px % 8 < 4) && (py < 3 && !inH(ty - 1) || py > T - 4 && !inH(ty + 1))) || ((py % 8 < 4) && (px < 3 && !inV(tx - 1) || px > T - 4 && !inV(tx + 1))))) col = GC.white;
        } else if ((px === 0 && py % 32 < 22) || (py === 0 && px < 3)) col = GC.white;
      } else if (t === TL.walk) col = (px % 16 === 0 || py % 16 === 0) ? GC.walk2 : n < .1 ? GC.walk2 : GC.walk;
      else if (t === TL.grass) col = (n < .35) ? GC.grass2 : GC.grass;
      else if (t === TL.water) col = n < .3 ? GC.water2 : GC.water;
      else if (t === TL.sand) col = n < .3 ? GC.sand2 : GC.sand;
      else if (t === TL.pool) col = (px < 2 || py < 2 || px > T - 3 || py > T - 3) ? GC.white : (n < .1 ? GC.white : GC.pool);
      else if (t === TL.dock) col = py % 6 === 0 ? GC.dock2 : GC.dock;
      else if (t === TL.path) col = n < .2 ? GC.sand2 : GC.path;
      else if (t === TL.floor) col = ((px >> 3) + (py >> 3)) & 1 ? GC.floor : GC.floor2;
      else if (t === TL.bldg) col = GC.wall;
      else col = GC.wall;
      // curbs where walk meets road
      if (t === TL.walk) { if ((px === 0 && tAt(tx - 1, ty) === TL.road) || (px === T - 1 && tAt(tx + 1, ty) === TL.road) || (py === 0 && tAt(tx, ty - 1) === TL.road) || (py === T - 1 && tAt(tx, ty + 1) === TL.road)) col = GC.curb; }
      GROUND[y * GW + x] = col;
    }
  }
  bakeInteriors();
  // shadows: every building throws one to the south-east
  for (const b of BLD) if (!b.noShadow) for (let y = b.y + 4; y < b.y + b.h + 10; y++) for (let x = b.x + 4; x < b.x + b.w + 10; x++) { if (x >= GW || y >= GH) continue; const t = tileOf(x, y); if (t === TL.bldg) continue; GROUND[y * GW + x] = mix(GROUND[y * GW + x], BLACK, t === TL.room ? .2 : .35); }
}
const MINI = new Uint32Array(MW * MH);
function bakeMini() {
  for (let i = 0; i < MW * MH; i++) { const t = MAP[i]; MINI[i] = hex(t === TL.road ? '#dbdbdb' : t === TL.water ? '#24499b' : t === TL.bldg || t === TL.room ? '#49496d' : t === TL.grass ? '#246d24' : t === TL.pool ? '#49b6ff' : t === TL.sand ? '#928e49' : '#6d6d6d'); }
}
// ---------------- camera + projection ----------------
const CAM = { x: 0, y: 0, s: 1, ZC: 560 };
const CXs = W / 2, CYs = H / 2;
const projX = (x, z) => CXs + (x - CAM.x) * CAM.s * CAM.ZC / (CAM.ZC - z), projY = (y, z) => CYs + (y - CAM.y) * CAM.s * CAM.ZC / (CAM.ZC - z);
const colX = new Int32Array(W);
function drawGround() {
  const s = CAM.s, inv = 1 / s, x0 = CAM.x - CXs * inv, y0 = CAM.y - CYs * inv, wcol = GC.water, wav = (frame >> 4) & 7;
  for (let sx = 0; sx < W; sx++) colX[sx] = Math.floor(x0 + sx * inv);
  let o = 0;
  for (let sy = 0; sy < H; sy++) {
    const wy = Math.floor(y0 + sy * inv);
    if (wy < 0 || wy >= GH) { FB.fill(wcol, o, o + W); o += W; continue; }
    const row = wy * GW, ty = (wy / T) | 0;
    for (let sx = 0; sx < W; sx++) {
      const wx = colX[sx];
      if (wx < 0 || wx >= GW) { FB[o++] = wcol; continue; }
      let c = GROUND[row + wx];
      if (c === GC.water && ((wx + wy * 3 + wav * 9) % 97) === 0) c = GC.white; // the lake glints
      FB[o++] = c;
    }
  }
}
function quadF(a, b, c, d, col) { triF(a[0], a[1], b[0], b[1], c[0], c[1], col); triF(a[0], a[1], c[0], c[1], d[0], d[1], col); }
// buildings: draw the walls that face the camera, floor lines, window columns, then the roof
function drawBuildings(list) {
  const vis = [], sw = W / CAM.s / 2 + 120, sh = H / CAM.s / 2 + 120;
  for (const b of (list || BLD)) { if (b.gone) continue; const cx = b.x + b.w / 2, cy = b.y + b.h / 2; if (Math.abs(cx - CAM.x) - b.w / 2 > sw || Math.abs(cy - CAM.y) - b.h / 2 > sh) continue; vis.push([b, (cx - CAM.x) ** 2 + (cy - CAM.y) ** 2]); }
  fixRoofKeys(vis); vis.sort((p, q) => q[1] - p[1]);
  for (const [b] of vis) drawBuilding(b);
}
function drawBuilding(b) {
  if (b.ft) return drawShellWall(b); if (b.pk) return drawProp(b); if (b.roofOf) return drawIntRoof(b);
  const tr = typeof tripAmt === 'function' ? tripAmt() : 0, x0 = b.x, y0 = b.y, x1 = b.x + b.w, y1 = b.y + b.h, z = (b.z + (b.sink ? -b.sink : 0)) * (tr > .1 ? 1 + tr * .22 * Math.sin(frame * .05 + b.x * .013 + b.y * .007) : 1), night = typeof nightAmt === 'function' ? nightAmt() : 0;
  if (z <= 1) return;
  const P = (x, y, zz) => [projX(x, zz), projY(y, zz)];
  const sides = [[[x0, y0], [x1, y0], CAM.y < y0, .72], [[x1, y0], [x1, y1], CAM.x > x1, .86], [[x1, y1], [x0, y1], CAM.y > y1, .6], [[x0, y1], [x0, y0], CAM.x < x0, .95]];
  for (const [a, c, vis, sh] of sides) {
    if (!vis) continue;
    const wc = mix(b.wall, BLACK, 1 - sh), dark = mix(wc, BLACK, .3), lit = mix(wc, WHITE, .18);
    quadF(P(a[0], a[1], 0), P(c[0], c[1], 0), P(c[0], c[1], z), P(a[0], a[1], z), wc);
    const len = Math.hypot(c[0] - a[0], c[1] - a[1]), nw = Math.floor(len / 12);
    for (let k = 1; k < nw; k++) { const t = k / nw, wx = a[0] + (c[0] - a[0]) * t, wy = a[1] + (c[1] - a[1]) * t, p0 = P(wx, wy, 4), p1 = P(wx, wy, z - 3); lineF(p0[0], p0[1], p1[0], p1[1], b.kind === 'tower' ? lit : dark); }
    for (let zz = 14; zz < z - 4; zz += 14) { const p0 = P(a[0], a[1], zz), p1 = P(c[0], c[1], zz); lineF(p0[0], p0[1], p1[0], p1[1], dark); }
    if (night > .3) for (let k = 0; k < nw; k++) for (let zz = 7; zz < z - 6; zz += 14) { if (hsh(b.x + k * 7 + a[0], zz + a[1]) > .38) continue; const t = (k + .5) / nw, q = P(a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, zz); pset(q[0], q[1], WINLIT); pset(q[0] + 1, q[1], WINLIT); }
  }
  const r = [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
  if (b.skylight) { for (let i = 0; i < 4; i++) lineF(r[i][0], r[i][1], r[(i + 1) % 4][0], r[(i + 1) % 4][1], b.roof); return; }
  quadF(r[0], r[1], r[2], r[3], b.roof);
  const rim = mix(b.roof, WHITE, .3); for (let i = 0; i < 4; i++) lineF(r[i][0], r[i][1], r[(i + 1) % 4][0], r[(i + 1) % 4][1], i < 2 ? rim : mix(b.roof, BLACK, .3));
  // roof furniture: a vent box, a sign
  if (b.w >= 64 && b.h >= 64 && !b.sign) { const q = P(x0 + b.w * .3, y0 + b.h * .3, z), q2 = P(x0 + b.w * .3 + 20, y0 + b.h * .3 + 14, z); rectF(q[0], q[1], q2[0] - q[0], q2[1] - q[1], mix(b.roof, BLACK, .25)); }
  if (b.sign) {
    const c = P(x0 + b.w / 2, y0 + b.h / 2, z), sc = CAM.s > .85 && b.sign.length * 6 * 2 < b.w * CAM.s ? 2 : 1, col = b.neon && (frame >> 5) & 1 ? hex('#ffffff') : b.neon ? hex('#ff49db') : mix(b.roof, BLACK, .6);
    if (b.sign === '+') { rectF(c[0] - 12, c[1] - 4, 24, 8, hex('#db2424')); rectF(c[0] - 4, c[1] - 12, 8, 24, hex('#db2424')); }
    else text(b.sign, (c[0] - b.sign.length * 3 * sc) | 0, (c[1] - 3 * sc) | 0, col, b.neon ? BLACK : 0, sc);
  }
}
function drawTrees() {
  for (const [x, y, r] of TREES) { if (Math.abs(x - CAM.x) > 300 || Math.abs(y - CAM.y) > 220) continue; const z = 26, cx = projX(x, z), cy = projY(y, z), rr = r * CAM.s * CAM.ZC / (CAM.ZC - z);
    circF(cx + 2, cy + 2, rr, hex('#1a4a1a')); circF(cx, cy, rr, hex('#3a7a2a')); circF(cx - rr * .3, cy - rr * .3, rr * .5, hex('#5a9a3a')); }
}
// ---------------- radar: the whole city at one pixel per tile ----------------
function drawRadar(x, y, blips) {
  rectF(x - 2, y - 2, MW + 4, MH + 4, hex('#05081a'));
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) FB[(y + ty) * W + x + tx] = MINI[ty * MW + tx];
  frameRect(x - 2, y - 2, MW + 4, MH + 4, hex('#9fb8ff'));
  for (const b of blips) { const bx = x + Math.floor(b.x / T), by = y + Math.floor(b.y / T); if (b.flash && (frame >> 3) & 1) continue; rectF(bx - (b.big ? 1 : 0), by - (b.big ? 1 : 0), b.big ? 3 : 2, b.big ? 3 : 2, b.c); if (b.ch) text(b.ch, bx - 2, by - 9, b.c, BLACK); }
}
const areaAt = (x, y) => DNAMES[DIST[Math.floor(y / T) * MW + Math.floor(x / T)] || 0];
