'use strict';
// ================= CHROME FORCE -- towns (walk, talk, search) and the route map between battles =================
const TV = { id: null, map: null, w: 0, h: 0, px: 0, py: 0, dir: 'down', ox: 0, oy: 0, camx: 0, camy: 0, npcs: [], theme: 'waste', moving: 0 };
const walkable = (x, y) => x >= 0 && y >= 0 && x < TV.w && y < TV.h && moveCost('foot', TV.map[y][x]) < X && !TV.map[y][x].match(/[#wM]/); // doors are walkable: they lead inside
const standable = (x, y) => walkable(x, y) && TV.map[y][x] !== 'd' && TV.map[y][x] !== '^';
const SOLID = { relic: 0, sign: 0 }; // relics and signs are searched in place; everything else blocks
const npcAt = (x, y) => TV.npcs.find(n => SOLID[n.kind] !== 0 && n.x === x && n.y === y && n.vis());
const stashKey = n => 'st_' + TV.id + '_' + (TV.room || 'out') + '_' + n.x + '_' + n.y;

function setupTown(id) {
  const T = TOWNS[id]; TV.id = id; TV.map = normMap(T.map); while (TV.map.length < 14) TV.map.push(TV.map[TV.map.length - 1][0].repeat(TV.map[0].length)); /* short towns: fill the screen with their own ground */ TV.w = TV.map[0].length; TV.h = TV.map.length; TV.theme = T.theme;
  [TV.px, TV.py] = T.spawn; TV.dir = 'up'; TV.ox = TV.oy = 0;
  TV.room = null; TV.out = null; TV.npcs = mkNpcs(TOWN_NPCS[id] || [], T);
  TV.npcs.push(...townMembers(T)); TV.bark = null; TV.barkWait = 90; // force members hang around between battles
}
function mkNpcs(list, T) {
  const out = []; TV.npcs = out;
  for (const n of list) {
    const o = Object.assign({}, n);
    o.art = o.kind === 'recruit' ? HEROES[recruitId(o.name)].art : SOLID[o.kind] === 0 || o.kind === 'stash' ? null : TA[o.art] || TA.screen;
    if (o.art) artOf(o.art);
    o.vis = () => (!o.when || o.when()) && (o.kind !== 'recruit' || !SAVE.force[recruitId(o.name)]);
    if (SOLID[o.kind] !== 0 && !standable(o.x, o.y)) snapNpc(o, T);
    out.push(o);
  }
  return out;
}
// ---------- houses: every door leads into a room (TOWN_ROOMS in cfstory, keyed by the building's leftmost door) ----------
function doorKey(x, y) { while (x > 0 && TV.map[y][x - 1] === 'd') x--; return x + ',' + y; }
function roomMap(R) {
  const w = R.w || 12, h = R.h || 8, d0 = (w >> 1) - 1, rows = [];
  for (let y = 0; y < h; y++) {
    const r = [];
    for (let x = 0; x < w; x++) r.push(y === 0 ? ((x % 5 === 2 || x % 5 === 3) && x < w - 1 ? 'w' : '#') : y === h - 1 ? (x === d0 || x === d0 + 1 ? 'd' : '#') : x === 0 || x === w - 1 ? '#' : '_');
    rows.push(r);
  }
  for (const [x, y, c] of R.deco || []) rows[y][x] = c;
  return rows.map(r => r.join(''));
}
function enterRoom(key) {
  const R = TOWN_ROOMS[TV.id] && TOWN_ROOMS[TV.id][key];
  if (!R) return false;
  TV.out = { map: TV.map, w: TV.w, h: TV.h, npcs: TV.npcs, px: TV.px, py: TV.py };
  TV.map = roomMap(R); TV.w = TV.map[0].length; TV.h = TV.map.length; TV.room = key;
  TV.px = (TV.w >> 1) - 1; TV.py = TV.h - 2; TV.dir = 'up';
  TV.npcs = mkNpcs(R.npcs || [], { spawn: [TV.px, TV.py] });
  return true;
}
function leaveRoom() { const o = TV.out; Object.assign(TV, { map: o.map, w: o.w, h: o.h, npcs: o.npcs, px: o.px, py: o.py + 1, dir: 'down', room: null, out: null }); }
const recruitId = name => Object.keys(HEROES).find(k => HEROES[k].n === name);
function snapNpc(o, T) { // keep authored spots honest: nearest open tile that isn't the gate road or a door
  for (let r = 1; r < 6; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const x = o.x + dx, y = o.y + dy; if (standable(x, y) && !(x === T.spawn[0]) && !TV.npcs.some(n => n !== o && n.x === x && n.y === y)) { o.x = x; o.y = y; return; } }
}
function townCam() { // small rooms sit centred in the dark
  TV.camx = TV.w * 16 < W ? (TV.w * 16 - W) >> 1 : clamp(TV.px * 16 + TV.ox - 152, 0, TV.w * 16 - W);
  TV.camy = TV.h * 16 < H ? (TV.h * 16 - H) >> 1 : clamp(TV.py * 16 + TV.oy - 104, 0, TV.h * 16 - H);
}

const townScene = {
  update() {},
  draw() {
    townCam();
    const cx = Math.round(TV.camx), cy = Math.round(TV.camy), x0 = Math.max(0, (cx / 16) | 0), y0 = Math.max(0, (cy / 16) | 0);
    cls(BLACK);
    for (let ty = y0; ty <= y0 + 14 && ty < TV.h; ty++) for (let tx = x0; tx <= x0 + 20 && tx < TV.w; tx++) { const t = tileAtMap(TV.map, tx, ty, TV.theme); draw(t.s, tx * 16 - cx, ty * 16 - cy, t.P); }
    // lamplight on doors and windows: the town is alive
    for (let ty = y0; ty <= y0 + 14 && ty < TV.h; ty++) for (let tx = x0; tx <= x0 + 20 && tx < TV.w; tx++) if (TV.map[ty][tx] === 'w' && ((tx + ty + (frame >> 5)) % 7)) rectA(tx * 16 - cx + 5, ty * 16 - cy + 10, 6, 3, hex('#ffdb49'), .5);
    for (const n of TV.npcs) { const x = n.x * 16 - cx, y = n.y * 16 - cy;
      if (n.kind === 'stash') draw(SAVE.flags[stashKey(n)] ? CHEST_OPEN : CHEST, x, y, TILEPAL.waste);
      if (SOLID[n.kind] === 0 && !(n.kind === 'relic' && SAVE.archive[n.a]) && ((frame + n.x * 7) & 63) < 20) { rectF(x + 7, y + 5, 2, 6, WHITE); rectF(x + 5, y + 7, 6, 2, WHITE); } } // a glint marks something to search
    const ents = TV.npcs.filter(n => n.art && n.vis()).map(n => ({ y: n.y, f: () => { const s = mSprite(n.art, ((frame + n.x * 9) >> 5) & 1); rectA(n.x * 16 - cx + 3, n.y * 16 - cy + 13, 10, 3, BLACK, .35); drawUnit(s, n.x * 16 - cx, n.y * 16 - cy, n.art.P, n.face === -1); } }));
    const dax = artOf(HEROES.dax.art);
    ents.push({ y: TV.py + .5, f: () => { const x = TV.px * 16 + TV.ox - cx, y = TV.py * 16 + TV.oy - cy; rectA(x + 3, y + 13, 10, 3, BLACK, .35); drawUnit(mSprite(dax, TV.moving ? (frame >> 3) & 1 : 0), x, y, dax.P, TV.dir === 'left'); } });
    ents.sort((a, b) => a.y - b.y).forEach(e => e.f());
    const label = TV.room ? TOWN_ROOMS[TV.id][TV.room].n : TOWNS[TV.id].n;
    barkTick(cx, cy);
    if (!WINS.length) { panel(4, 4, label.length * 6 + 14, 16); text(label, 11, 8, UI.name); }
    drawWins();
  },
};

async function runTown(id) {
  setupTown(id); scene = townScene; WINS = [];
  music(TOWNS[id].music); await fadeIn(.08);
  await STORY.townIntro(id);
  if (SAVE.wake) { SAVE.wake = 0; await say(SAVE.wakeMsg || 'THE SIGNAL CARRIED YOU HOME. YOUR WOUNDED HAVE BEEN TENDED. THE FALLEN WAIT AT THE CHURCH.', 'PRIEST'); }
  for (;;) {
    await nextFrame();
    if (pressed.start) { await fieldMenu('town'); continue; }
    const d = dirPressed() || (held.up ? [0, -1] : held.down ? [0, 1] : held.left ? [-1, 0] : held.right ? [1, 0] : null);
    if (d) {
      TV.dir = d[0] < 0 ? 'left' : d[0] > 0 ? 'right' : d[1] < 0 ? 'up' : 'down';
      const nx = TV.px + d[0], ny = TV.py + d[1];
      if (walkable(nx, ny) && !npcAt(nx, ny)) {
        TV.moving = 1;
        for (let f = 1; f <= 4; f++) { TV.ox = d[0] * 4 * f; TV.oy = d[1] * 4 * f; await nextFrame(); }
        TV.px = nx; TV.py = ny; TV.ox = TV.oy = 0; TV.moving = 0;
        const c = TV.map[ny][nx];
        if (c === 'd') { sfx('door'); await fadeOut(.06); if (TV.room) leaveRoom(); else if (!enterRoom(doorKey(nx, ny))) TV.py += 1; await fadeIn(.06); }
        else if (c === '^' && !TV.room) { const r = await gatePrompt(); if (r) { await fadeOut(.08); return 'gate'; } TV.py -= 1; }
      }
      continue;
    }
    if (OKB()) await interact();
  }
}
async function gatePrompt() {
  const ch = CHAPTERS[SAVE.ch - 1], next = BATTLES[ch.battles[SAVE.bi]];
  return confirm('SET OUT FOR ' + next.n + '?');
}
async function interact() {
  const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[TV.dir], tx = TV.px + dx, ty = TV.py + dy;
  const n = npcAt(tx, ty);
  if (n) {
    n.face = TV.px < n.x ? -1 : 1;
    if (n.kind === 'talk' || n.kind === 'recruit') { if (typeof n.a === 'function') await n.a(); else await townTalk(n); }
    if (n.kind === 'member') await memberTalk(n.id);
    if (n.kind === 'shop') await shop(n.name);
    if (n.kind === 'church') await church(n.name);
    if (n.kind === 'hq') await hq(n.name);
    if (n.kind === 'stash') await openStash(n);
    return;
  }
  const spot = TV.npcs.find(r => SOLID[r.kind] === 0 && ((r.x === tx && r.y === ty) || (r.x === TV.px && r.y === TV.py)));
  if (spot && spot.kind === 'relic') { await archiveFind(spot.a); return; }
  if (spot && spot.kind === 'sign') { for (const l of spot.a) await say(l, null); return; }
  sfx('tick'); await note2('NOTHING HERE.', 25);
}

async function openStash(n) {
  const k = stashKey(n);
  if (SAVE.flags[k]) { await note2('IT IS EMPTY.', 25); return; }
  SAVE.flags[k] = 1; sfx('get');
  const who = stowItem(n.a);
  await note2('FOUND ' + ITEMS[n.a].n + '! ' + (who === 'depot' ? 'SENT TO THE DEPOT.' : HEROES[who].n + ' TAKES IT.'), 90);
}

// ---------- the route between battles ----------
function routeScene(ch, sel) {
  return { update() {}, draw() {
    const T = CUTBG[TOWNS[ch.town].theme] || CUTBG.waste;
    skyD(0, H, T.sky[0], T.gnd);
    for (let k = 0; k < 9; k++) rectF(0, 130 + Math.pow(k / 8, 2) * 94, W, 1, hex(T.grid));
    ctext('CHAPTER ' + ch.n, 14, UI.dim); ctext(ch.title, 26, UI.name, BLACK);
    const nodes = [TOWNS[ch.town].n, ...ch.battles.map(b => BATTLES[b].n)], n = nodes.length;
    const pos = i => [30 + i * (260 / (n - 1)), 92 + Math.sin(i * 1.7) * 18];
    for (let i = 0; i < n - 1; i++) { const [x0, y0] = pos(i), [x1, y1] = pos(i + 1); for (let k = 0; k < 1; k += .04) if (((k * 25) | 0) % 2 === 0) rectF(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, 2, 2, i < SAVE.bi ? hex('#ffdb49') : hex('#6d6d92')); }
    nodes.forEach((s, i) => { const [x, y] = pos(i), done = i > 0 && i <= SAVE.bi, next = i === SAVE.bi + 1, c = next ? ((frame >> 3) & 1 ? hex('#ff2449') : WHITE) : done ? hex('#ffdb49') : hex('#b6b6db');
      circF(x, y, next ? 6 : 4, c); ringF(x, y, 8, hex('#000024')); const lab = s.length > 14 ? s.slice(0, 14) : s; text(lab, clamp(x - lab.length * 3, 2, W - lab.length * 6 - 2), y + (i % 2 ? -20 : 12), next ? UI.name : UI.text); if (done) text('*', x - 2, y - 3, BLACK, 0); });
    text('$ ' + SAVE.gold, 8, 8, COL.gold);
    drawWins();
  } };
}
async function routeMenu(ch) {
  scene = routeScene(ch); WINS = []; music('route'); await fadeIn(.08);
  for (;;) {
    const next = BATTLES[ch.battles[SAVE.bi]];
    const a = await menu(['MARCH: ' + next.n, 'FORCE', 'ITEMS', 'ARCHIVE', 'BACK TO ' + TOWNS[ch.town].n, 'OPTIONS'], { x: 60, y: 140, w: 200, cancel: false });
    if (a === 0) { await fadeOut(.08); return 'battle'; }
    if (a === 1) { const r = await pickMember('FORCE', allRecs()); if (r) await showStatus(r); }
    if (a === 2) await fieldItems();
    if (a === 3) await archiveView();
    if (a === 4) { await fadeOut(.08); return 'town'; }
    if (a === 5) await options();
  }
}
