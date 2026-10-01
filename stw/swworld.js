'use strict';
// ================= SAVE THE WORLD: the world map — walking, the ship, the airship (WORLD-FX scaled view) =================
const WW = 128, WH = 112;
const WORLD = { g: null, places: {}, made: 0 };
// ---------- building the world from shapes (deterministic) ----------
function buildWorld(n) {
  if (n === 3) return buildPlanet();
  const g = Array.from({ length: WH }, () => Array(WW).fill('~'));
  const nz = (x, y, s) => swh(x >> 2, y >> 2, s) * .5 + swh(x, y, s + 1) * .25;
  const land = (cx, cy, rx, ry, t, s = 1, keep) => { for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) { const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2; if (d < 1 - .35 + nz(x, y, s) * .7) { if (!keep || g[y][x] !== '~') g[y][x] = t; } } };
  const blob = (cx, cy, rx, ry, t, s = 7) => land(cx, cy, rx, ry, t, s, 1);
  const line = (pts, w, t, s = 3) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2; for (let k = 0; k <= n; k++) { const x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n, ww = w + (swh(k, i, s) > .6 ? 1 : 0); for (let dy = -ww; dy <= ww; dy++) for (let dx = -ww; dx <= ww; dx++) { const xx = Math.round(x + dx), yy = Math.round(y + dy); if (xx >= 0 && yy >= 0 && xx < WW && yy < WH && dx * dx + dy * dy <= ww * ww + 1) g[yy][xx] = t; } } } };
  const rect = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y][x] = t; };
  // the north continent: snow over desert, split by a mountain range with one pass
  land(40, 22, 34, 18, '.', 11); blob(30, 13, 24, 9, '*', 12); blob(46, 33, 22, 7, 's', 13);
  line([[8, 25], [22, 26], [33, 26]], 1, '^'); line([[39, 26], [52, 25], [68, 21]], 1, '^');
  line([[10, 39], [26, 41], [38, 42], [44, 42], [58, 41], [72, 37]], 1, '^');
  blob(16, 33, 6, 4, '"', 14); blob(62, 30, 5, 4, 'n', 15);
  // the middle continent: the river splits it; the east side is GARFEILD and the RERUN forest
  land(64, 60, 52, 13, '.', 21); blob(26, 57, 11, 6, '"', 22); line([[16, 52], [20, 60], [30, 64]], 1, '^'); blob(36, 66, 6, 3, 'n', 23);
  line([[52, 45], [54, 52], [51, 58], [56, 65], [60, 74]], 1, '~'); blob(84, 64, 13, 6, '"', 24); blob(104, 52, 7, 4, 'n', 25); blob(72, 52, 6, 3, '%', 26);
  line([[60, 72], [80, 71], [110, 70]], 1, '^'); // the plains are sealed off from here: the train goes through
  // the plains of waiting (and the port)
  land(70, 82, 34, 8, ',', 31); blob(88, 80, 8, 3, '.', 32); blob(54, 84, 6, 3, '"', 33);
  line([[34, 76], [104, 76]], 0, '^'); rect(36, 75, 102, 75, '^');
  // the south continent: PRESTIGE and the opera on the west, FRANCHISE CITY on the east, mountains between
  land(62, 102, 48, 8, '.', 41); blob(30, 104, 9, 4, '"', 42); blob(80, 103, 10, 4, 's', 43);
  line([[64, 94], [66, 102], [62, 110]], 1, '^'); line([[96, 95], [98, 103], [96, 110]], 1, '^'); blob(106, 104, 5, 4, '^', 44); blob(106, 104, 2, 1, 'n', 45);
  // islands
  land(112, 20, 7, 5, '.', 51); blob(112, 20, 3, 2, '"', 52); land(10, 72, 5, 4, '.', 53); land(118, 92, 5, 4, ',', 54);
  if (n === 1) blob(56, 36, 5, 3, 'q', 71); // quicksand around the buried station (only the bus crosses it)
  if (n === 2) {
    // the corrupted save: whole regions are simply gone; the middle collapses into a crater with a tower on it
    blob(64, 61, 16, 9, '?', 61); blob(64, 61, 8, 5, 'n', 62); blob(10, 18, 6, 3, '?', 63); blob(84, 82, 10, 3, '?', 64); blob(86, 102, 8, 3, '?', 65);
    for (let y = 0; y < WH; y++) for (let x = 0; x < WW; x++) { if (g[y][x] === '"' && swh(x, y, 66) > .5) g[y][x] = 'n'; if (g[y][x] === '.' && swh(x, y, 67) > .8) g[y][x] = ','; }
  }
  // carve a way in to places that sit in the mountains (as hills, so it still looks rough)
  for (const k of ['return', 'cave', 'cave2', 'mtrerun', 'mines', 'memory', 'tower', 'grave', 'focusgroup']) {
    if (!PLACES[k]) continue;
    const p = PLACES[k]; const prev = { [p.x + ',' + p.y]: null }, Q = [[p.x, p.y]]; let end = null;
    while (Q.length && !end) { const [x, y] = Q.shift(); for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) { const nx = x + dx, ny = y + dy, kk = nx + ',' + ny; if (kk in prev || nx < 0 || ny < 0 || nx >= WW || ny >= WH || g[ny][nx] === '~') continue; prev[kk] = [x, y]; if ('.,"ns*%'.includes(g[ny][nx])) { end = [nx, ny]; break; } Q.push([nx, ny]); } }
    if (end) { let c = prev[end[0] + ',' + end[1]]; while (c && !(c[0] === p.x && c[1] === p.y)) { if (g[c[1]][c[0]] === '^') g[c[1]][c[0]] = 'n'; c = prev[c[0] + ',' + c[1]]; } }
  }
  // shallows along every coast
  for (let y = 1; y < WH - 1; y++) for (let x = 1; x < WW - 1; x++) if (g[y][x] === '~' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !'~-'.includes(g[y + dy][x + dx]))) g[y][x] = '-';
  return g;
}
// places on the world: icon, entry map, and when they exist
const PLACES = {
  coldboot: { x: 22, y: 12, icon: 'town', name: 'COLDBOOT', to: ['coldboot', 9, 17, 'u'] },
  mines: { x: 34, y: 9, icon: 'cave', name: 'THE MINES', to: ['mines2', 32, 9, 'l'] },
  mtrerun: { x: 36, y: 55, icon: 'cave', name: 'MT. RERUN', to: ['mtrerun', 9, 22, 'u'] },
  facecastle: { x: 46, y: 33, icon: 'castle', name: 'FACE CASTLE', to: ['castle', 9, 14, 'u'] },
  cave: { x: 41, y: 40, icon: 'cave', name: 'THE CAVE', to: ['cave1', 1, 5, 'r'] },
  cave2: { x: 41, y: 49, icon: 'cave', name: 'THE CAVE', to: ['cave1', 28, 4, 'l'] },
  return: { x: 24, y: 60, icon: 'cave', name: 'THE RETURN', to: ['returnhq', 9, 13, 'u'] },
  raft: { x: 48, y: 50, icon: 'save', name: 'THE RIVER', to: null, run: () => riverRaft(), if: () => flag('returnDone') && !flag('raftDone') },
  garfeild: { x: 98, y: 55, icon: 'castle', name: 'GARFEILD', to: ['garfeild', 12, 20, 'u'] },
  station: { x: 82, y: 64, icon: 'station', name: 'THE STATION', to: ['station', 9, 13, 'u'] },
  plains: { x: 86, y: 79, icon: 'town', name: 'THE BUS STOP', to: ['busstop', 9, 7, 'u'] },
  port: { x: 50, y: 87, icon: 'town', name: 'THE PORT', to: ['port', 10, 15, 'u'] },
  prestige: { x: 24, y: 100, icon: 'town', name: 'PRESTIGE', to: ['prestige', 10, 16, 'u'] },
  opera: { x: 34, y: 104, icon: 'opera', name: 'THE OPERA', to: ['opera1', 9, 14, 'u'] },
  franchise: { x: 84, y: 100, icon: 'factory', name: 'FRANCHISE CITY', to: ['fcity', 10, 16, 'u'] },
  memory: { x: 106, y: 104, icon: 'crater', name: 'THE MEMORY CARD', to: ['gate', 9, 13, 'u'], if: () => flag('gateKnown') },
  island: { x: 112, y: 21, icon: 'town', name: 'LOST & FOUND', to: ['island', 9, 9, 'd'], if: () => G.world === 2 },
  newfile: { x: 22, y: 12, icon: 'town', name: 'NEW FILE', to: ['newfile', 9, 17, 'u'], if: () => G.world === 2 },
  tower: { x: 64, y: 61, icon: 'tower', name: 'THE TITLE SCREEN', to: ['tower1', 10, 18, 'u'], if: () => G.world === 2 && flag('towerOpen') },
};
const placeAt = (x, y) => Object.entries(PLACES).find(([k, p]) => p.x === x && p.y === y && (!p.if || p.if()) && !(G.world === 2 && p.w1) && !(G.world === 1 && p.w2));
function worldGrid() { if (WORLD.made !== G.world) { WORLD.g = buildWorld(G.world); WORLD.made = G.world; } return WORLD.g; }
const wtile = (x, y) => (x < 0 || y < 0 || x >= WW || y >= WH) ? '~' : worldGrid()[y][x];
const WALKABLE = new Set(['.', ',', '"', 'n', 's', '*', '%', ':', '=']);
// where the airship may set down
const LANDABLE = new Set(['.', ',', 's', '*', 'n']);

// ---------- the world scene ----------
const WP = { x: 0, y: 0, px: 0, py: 0, dir: 'd', mv: 0, f: 0 };
async function toWorld(x, y) {
  FIELD_LOCK++; sfx('door'); await fadeOut(.1);
  G.inWorld = 1; G.map = null; M = null; worldGrid();
  if (x !== undefined) { G.wx = x; G.wy = y; }
  WP.x = G.wx; WP.y = G.wy; WP.px = WP.x * TS; WP.py = WP.y * TS; WP.mv = 0;
  G.encN = encSteps(); scene = worldScene; owPalette(); music(G.vehicle === 'air' ? 'airship' : G.vehicle === 'bus' ? 'bus' : G.world === 3 ? 'planet' : G.world === 2 ? 'world2' : 'world');
  await fadeIn(.1); FIELD_LOCK--;
}
async function leaveWorld(id, x, y, dir) { G.inWorld = 0; await goMap(id, x, y, dir); }
const worldScene = { update: worldUpdate, draw: worldDraw };
function worldUpdate() {
  G.frames++;
  if (G.vehicle === 'air') { airUpdate(); return; }
  if (WP.mv) {
    const sp = G.vehicle === 'bus' ? 4 : 2; WP.px += Math.sign(WP.tx * TS - WP.px) * sp; WP.py += Math.sign(WP.ty * TS - WP.py) * sp; WP.f++;
    if (WP.px === WP.tx * TS && WP.py === WP.ty * TS) { WP.x = WP.tx; WP.y = WP.ty; G.wx = WP.x; G.wy = WP.y; WP.mv = 0; G.steps++; run(worldStep); }
    return;
  }
  if (FIELD_LOCK || busy || DLG || MENUS.length || CARD) return;
  if (pressed.start) { run(fieldMenu); return; }
  if (pressed.c) { run(talkHint); return; }
  if (pressed.a) { run(worldAct); return; }
  if (pressed.b && G.vehicle === 'bus') { if (wtile(WP.x, WP.y) !== 'q' && !placeAt(WP.x, WP.y)) { G.bus = { x: WP.x, y: WP.y, w: G.world }; G.vehicle = null; sfx('door'); music(G.world === 3 ? 'planet' : G.world === 2 ? 'world2' : 'world'); } else sfx('tick'); return; }
  const d = held.up ? 'u' : held.down ? 'd' : held.left ? 'l' : held.right ? 'r' : null;
  if (d) { WP.dir = d; const [dx, dy] = DIRV[d], nx = WP.x + dx, ny = WP.y + dy; if (worldPass(nx, ny)) { WP.mv = 1; WP.tx = nx; WP.ty = ny; } }
}
function worldPass(x, y) {
  if (G.ship && G.ship.x === x && G.ship.y === y) return true;
  if (G.bus && G.bus.w === G.world && G.bus.x === x && G.bus.y === y) return true;
  const t = wtile(x, y); if (t === 'q') return G.vehicle === 'bus'; if (!WALKABLE.has(t) && !placeAt(x, y)) return false;
  return !(WORLD.blocks || []).some(b => b.x === x && b.y === y && b.on());
}
async function worldStep() {
  const p = placeAt(WP.x, WP.y);
  if (p) { const [k, pl] = p; if (pl.run) { await pl.run(); return; } if (pl.to) { await leaveWorld(...pl.to); return; } }
  if (G.ship && G.ship.x === WP.x && G.ship.y === WP.y) { await boardAirship(); return; }
  if (G.bus && !G.vehicle && G.bus.w === G.world && G.bus.x === WP.x && G.bus.y === WP.y) { G.vehicle = 'bus'; G.bus = null; sfx('power'); music('bus'); return; }
  if (WORLD.onStep) { const r = await WORLD.onStep(WP.x, WP.y); if (r) return; }
  if (flag('noenc')) return;
  G.encN -= G.vehicle === 'bus' ? .5 : 1; if (G.encN <= 0) { G.encN = encSteps(); const z = G.vehicle === 'bus' && wtile(WP.x, WP.y) === 'q' ? { forms: forms('BUS'), bg: 'desert' } : worldZone(WP.x, WP.y); if (z) { FIELD_LOCK++; const r = await battle(FORMS[pickOne(z.forms)] || pickOne(z.forms), { bg: z.bg, bus: G.vehicle === 'bus' }); FIELD_LOCK--; if (r === 'lose') await gameOver(); else await fadeIn(.1); } }
}
async function worldAct() { const p = placeAt(WP.x, WP.y); if (p) await worldStep(); }
// encounter zones on the world (first match wins)
function worldZone(x, y) {
  const t = wtile(x, y), Z = G.world === 3 ? WZONES3 : G.world === 2 ? WZONES2 : WZONES;
  return Z.find(z => x >= z.r[0] && y >= z.r[1] && x <= z.r[2] && y <= z.r[3] && (!z.t || z.t.includes(t)));
}
// ---------- drawing the walking view ----------
function worldDraw() {
  if (G.vehicle === 'air') { airDraw(); return; }
  const cx = Math.round(clamp(WP.px + 8 - W / 2, -W, WW * TS)), cy = Math.round(WP.py + 8 - H / 2);
  const x0 = Math.floor(cx / TS), y0 = Math.floor(cy / TS), af = frame >> 4;
  for (let ty = y0; ty <= y0 + 15; ty++) for (let tx = x0; tx <= x0 + 20; tx++) { const c = wtile(tx, ty), fr = OW_TILES[c] || OW_TILES['~']; draw(fr[af % fr.length], tx * TS - cx, ty * TS - cy, OW_P); }
  for (const [k, p] of Object.entries(PLACES)) { if (p.if && !p.if()) continue; if (p.icon === 'save' && !p.run) continue; draw(OW_ICON[p.icon], p.x * TS - cx, p.y * TS - cy, OW_ICON_P); }
  if (G.ship) drawAirshipSprite(G.ship.x * TS - cx - 8, G.ship.y * TS - cy - 6, 0, 1);
  if (G.bus && G.bus.w === G.world) drawBus(G.bus.x * TS - cx - 4, G.bus.y * TS - cy - 4, 'r');
  const id = G.party[0], who = id === 'kid' ? (hero('kid').aspect || 'kid') : id;
  if (G.vehicle === 'bus') { drawBus(WP.px - cx - 4, WP.py - cy - 4, WP.dir); text('B: GET OFF', 6, H - 10, WHITE); }
  else draw(ART.field(who, WP.dir, WP.mv ? (WP.f >> 3) & 3 : 0), WP.px - cx, WP.py - cy - 8, ART.pal(who), WP.dir === 'r');
  if (G.world === 2) crushRect(0, 0, W, H, false), G.vehicle !== 'bus' && draw(ART.field(who, WP.dir, WP.mv ? (WP.f >> 3) & 3 : 0), WP.px - cx, WP.py - cy - 8, ART.pal(who), WP.dir === 'r');
  const p = placeAt(WP.x, WP.y); if (p) { const w = p[1].name.length * 6 + 16; panel(((W - w) / 2) | 0, 8, w, 18); ctext(p[1].name, 13, WHITE); }
  drawMinimap(W - 52, H - 44, 48, 40);
}
const BUS_P = pal('#101010', '#ffdb49', '#dbb624', '#242424', '#92dbff', '#ffffff', '#db2424');
const BUS_S = outline(spr(24, 18, g => { g.r(1, 2, 22, 12, 2); g.r(1, 2, 22, 2, 3); for (let x = 3; x < 20; x += 5) g.r(x, 5, 4, 4, 5); g.r(1, 11, 22, 1, 7); g.e(6, 15, 3, 3, 4); g.e(18, 15, 3, 3, 4); }), 1);
function drawBus(x, y, d) { draw(BUS_S, x, y, BUS_P, d === 'l'); }
function drawMinimap(x, y, w, h) {
  if (!WORLD.mini || WORLD.miniW !== G.world) { WORLD.mini = new Uint32Array(w * h); WORLD.miniW = G.world; for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const t = wtile(Math.floor(i * WW / w), Math.floor(j * WH / h)); WORLD.mini[j * w + i] = hex(OW_COL[t] || '#000000'); } }
  frameRect(x - 1, y - 1, w + 2, h + 2, WHITE);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) FB[(y + j) * W + x + i] = G.world === 2 ? mix(WORLD.mini[j * w + i], hex('#306230'), .7) : WORLD.mini[j * w + i];
  const px = G.vehicle === 'air' ? AIR.x / TS : WP.x, py = G.vehicle === 'air' ? AIR.y / TS : WP.y;
  if ((frame >> 3) & 1) rectF(x + Math.floor(px * w / WW) - 1, y + Math.floor(py * h / WH) - 1, 3, 3, hex('#ff2424'));
}

// ---------- the airship: the WORLD-FX chip (a scaled, rotating plane) ----------
const AIR = { x: 0, y: 0, a: 0, h: 90, sp: 0, land: 0 };
async function boardAirship() {
  FIELD_LOCK++; sfx('power'); G.vehicle = 'air'; AIR.x = G.ship.x * TS + 8; AIR.y = G.ship.y * TS + 8; AIR.a = -Math.PI / 2; AIR.h = 20; G.ship = null; music('airship');
  for (let i = 0; i < 40; i++) { AIR.h += 1.8; await nextFrame(); }
  FIELD_LOCK--;
}
function airUpdate() {
  if (FIELD_LOCK || busy || DLG || MENUS.length || CARD) return;
  if (held.left) AIR.a -= .035; if (held.right) AIR.a += .035;
  const tgt = held.a || held.up ? 3.2 : held.down ? -1.2 : 0; AIR.sp += (tgt - AIR.sp) * .06;
  AIR.x = clamp(AIR.x + Math.cos(AIR.a) * AIR.sp, 0, WW * TS - 1); AIR.y = clamp(AIR.y + Math.sin(AIR.a) * AIR.sp, 0, WH * TS - 1);
  if (pressed.b) run(airLand);
  if (pressed.start) run(fieldMenu);
  if (pressed.c) run(talkHint);
  if (WORLD.airCheck) run(() => WORLD.airCheck(AIR.x / TS | 0, AIR.y / TS | 0));
}
async function airLand() {
  const x = AIR.x / TS | 0, y = AIR.y / TS | 0, t = wtile(x, y);
  if (!LANDABLE.has(t) || placeAt(x, y)) { sfx('tick'); return; }
  FIELD_LOCK++; sfx('land'); for (let i = 0; i < 40; i++) { AIR.h -= 1.8; AIR.sp *= .9; await nextFrame(); }
  G.vehicle = null; G.ship = { x, y }; WP.x = x; WP.y = y; WP.px = x * TS; WP.py = y * TS; G.wx = x; G.wy = y;
  // step off next to the ship
  for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) if (WALKABLE.has(wtile(x + dx, y + dy))) { WP.x = x + dx; WP.y = y + dy; WP.px = WP.x * TS; WP.py = WP.y * TS; G.wx = WP.x; G.wy = WP.y; break; }
  music(G.world === 2 ? 'world2' : 'world'); FIELD_LOCK--;
}
const AIR_Y0 = 46, FOC = 150;
function airDraw() {
  if (G.world === 2) skyD(0, AIR_Y0 + 2, '#0f380f', '#306230'); else skyD(0, AIR_Y0 + 2, '#2449b6', '#b6dbff');
  const ca = Math.cos(AIR.a), sa = Math.sin(AIR.a), crushed = G.world === 2, T = TONES.dmg.map(hex);
  for (let y = AIR_Y0; y < H; y++) {
    const z = AIR.h * FOC / (y - AIR_Y0 + 1), fog = Math.min(1, z / 1400);
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const lat = (x - W / 2) * z / FOC, wx = AIR.x + ca * z - sa * lat, wy = AIR.y + sa * z + ca * lat;
      const tx = Math.floor(wx / TS), ty = Math.floor(wy / TS); let c;
      const t = wtile(tx, ty), fr = OW_TILES[t] || OW_TILES['~'], s = fr[(frame >> 4) % fr.length], v = s.d[((wy | 0) & 15) * 16 + ((wx | 0) & 15)];
      c = OW_P[v] || OW_P[1];
      const pl = OW_ICON_PLACE(tx, ty); if (pl && z < 700) c = hex('#ff4949');
      if (fog > .35) c = mix(c, crushed ? T[1] : hex('#b6dbff'), (fog - .35) * 1.2);
      if (crushed) { const l = lum(c); c = T[l > 170 ? 0 : l > 110 ? 1 : l > 55 ? 2 : 3]; }
      FB[row + x] = c;
    }
  }
  drawAirshipSprite(W / 2 - 16, H - 70 + Math.sin(frame * .08) * 2, AIR.sp, 0);
  const x = AIR.x / TS | 0, y = AIR.y / TS | 0, p = placeAt(x, y); if (p) { const w = p[1].name.length * 6 + 16; panel(((W - w) / 2) | 0, 8, w, 18); ctext(p[1].name, 13, WHITE); }
  text('A: FLY  B: LAND', 6, H - 10, WHITE);
  drawMinimap(W - 52, H - 44, 48, 40);
}
const OW_ICON_PLACE = (x, y) => { for (const k in PLACES) { const p = PLACES[k]; if (p.x === x && p.y === y && (!p.if || p.if()) && p.icon !== 'save') return p; } return null; };
// THE BROADCAST: Spooky Ghost's flying TV studio (a blimp with a satellite dish), later THE RERUN
const SHIP_P = pal('#101010', '#dbdbff', '#9292db', '#db2424', '#922424', '#6d4924', '#ffdb49', '#24dbff', '#ffffff', '#4949b6');
const SHIP_S = outline(spr(32, 26, g => { g.e(16, 8, 15, 7, 2); g.e(16, 6, 13, 4, 9); g.r(4, 7, 24, 1, 3); g.e(16, 8, 5, 4, 4); g.r(12, 15, 10, 6, 6); g.r(13, 16, 8, 3, 8); g.line(16, 0, 18, -2, 7); g.e(25, 2, 3, 2, 8); g.r(1, 6, 3, 5, 5); g.r(28, 6, 3, 5, 5); g.r(10, 21, 14, 2, 6); }), 1);
function drawAirshipSprite(x, y, sp, ground) {
  draw(SHIP_S, x, y, G.world === 2 ? ART.P.shipCrushed || (ART.P.shipCrushed = SHIP_P) : SHIP_P);
  if (!ground) { rectA(x + 6, y + 40, 20, 4, BLACK, .4); for (let i = 0; i < 2; i++) pset(x + 2 + ((frame + i * 3) % 8), y + 8 + i * 4, WHITE); }
}
