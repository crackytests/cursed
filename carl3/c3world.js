'use strict';
// ================= CARL 3: the world. walk around fixed camera angles, talk to people, make things worse =================
let C3 = null;   // the save
function newC3() { return { stop: 0, scene: 'ship', x: 0, z: 0, yaw: 0, flags: {}, parcels: [], alibis: [], suspicion: 0, bux: 20, route: [], notes: [], time: 0, deliveries: 0, lies: 0 }; }
const F3 = k => C3 && C3.flags[k];
const setF3 = (k, v = 1) => { C3.flags[k] = v; };
const WX = { sc: null, id: '', ents: [], camId: '', bg: null, hold: 0, t: 0, tick: [], fx: [], bgCache: {}, fade: 0, banner: null, haze: 0, shake: 0 };
const CARL = { p: [0, 0, 0], yaw: 0, vx: 0, vz: 0, walk: 0, moving: 0, pose: {}, bob: 0, inv: 0 };
const GCH = ['xX_gamer_Xx', 'propPillsFan', 'nevada_local', 'user_000', 'mallwalker', 'bongwater', 'alienFACTS', 'desertbus8h', 'lurker', 'garf_ield', 'sequel_hater', 'ghost_stan', 'postal_andy', 'zip_code_kid'];
function tickC(m, u) { WX.tick.push({ u: u || pick(GCH), m, t: 300 }); if (WX.tick.length > 3) WX.tick.shift(); }
const frozen3 = () => WX.hold > 0 || !!DLG || MENUS.length > 0 || !!CARD || !!CHATBOX;
function wstory(fn) { WX.hold++; return run(async () => { try { await fn(); } finally { WX.hold = Math.max(0, WX.hold - 1); } }); }
const dist2 = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2]);

// ---------------- scenes ----------------
function sceneBG(sc, camId) {
  const vk = sc.variantKey ? sc.variantKey() : '', key = WX.id + '/' + camId + vk; if (WX.bgCache[key]) return WX.bgCache[key];
  const c = sc.cams.find(c => c.id === camId), cam = mkCam(c.pos, c.look, c.fov || 1);
  return WX.bgCache[key] = prerender(vk && sc.variantScene ? sc.variantScene() : sc, cam);
}
function loadScene(id, x, z, yaw) {
  const sc = SCENES[id]; if (!sc) { console.error('no scene', id); return; }
  WX.sc = sc; WX.id = id; WX.bgCache = {}; WX.ents = []; WX.fx = []; WX.tick = []; C3.scene = id;
  CARL.p = [x === undefined ? sc.start[0] : x, 0, z === undefined ? sc.start[2] : z]; CARL.yaw = yaw === undefined ? 0 : yaw; CARL.vx = CARL.vz = 0;
  if (sc.ents) for (const d of sc.ents()) addEnt3(d);
  if (sc.init) sc.init();
  if (sc.music) music(sc.music);
  WX.camId = ''; pickCam(true);
  WX.banner = { s: sc.title || '', t: 130 };
}
async function goScene(id, x, z, yaw) { WX.hold++; try { sfx('door'); await fadeOut(.14); loadScene(id, x, z, yaw); await fadeIn(.14); } finally { WX.hold--; } }
function relight() { WX.camId = ''; pickCam(true); }
function pickCam(force) {
  const sc = WX.sc; let best = sc.cams[0];
  for (const c of sc.cams) if (c.zone && CARL.p[0] >= c.zone[0] && CARL.p[2] >= c.zone[1] && CARL.p[0] <= c.zone[2] && CARL.p[2] <= c.zone[3]) { if (c.id === WX.camId) { best = c; break; } best = c; }
  if (sc.camOverride) { const o = sc.cams.find(c => c.id === sc.camOverride()); if (o) best = o; }
  if (force || best.id !== WX.camId) { WX.camId = best.id; WX.bg = sceneBG(sc, best.id); if (!force) WX.cut = 3; }
}
// ---------------- entities ----------------
function addEnt3(d) {
  const e = Object.assign({ kind: 'npc', p: [0, 0, 0], yaw: 0, t: 0, range: 2.3, pose: {} }, d);
  if (d.at) e.p = [d.at[0], d.at[1] || 0, d.at[2]]; e.home = e.p.slice(); WX.ents.push(e); return e;
}
const ent3 = id => WX.ents.find(e => e.id === id);
const live3 = e => !e.gone && (!e.cond || e.cond(e));
function entModel(e) { return typeof e.model === 'string' ? (MODELS_P[e.model] || MODEL[e.model]) : e.model; }
function walkable(x, z, r = .3) {
  const sc = WX.sc; let inside = false;
  for (const w of sc.walk) if (x >= w[0] + r && x <= w[2] - r && z >= w[1] + r && z <= w[3] - r) { inside = true; break; }
  if (!inside) return false;
  for (const s of sc.solids) if (x > s[0] - r && x < s[2] + r && z > s[1] - r && z < s[3] + r) return false;
  for (const e of WX.ents) if (e.block && live3(e) && Math.hypot(x - e.p[0], z - e.p[2]) < e.block + r) return false;
  return true;
}
// ---------------- Carl ----------------
function carlUpdate() {
  const cam = WX.bg.cam, fx = Math.hypot(cam.f[0], cam.f[2]) || 1, fwd = [cam.f[0] / fx, cam.f[2] / fx], rt = [cam.r[0], cam.r[2]];
  const ix = (held.right ? 1 : 0) - (held.left ? 1 : 0), iy = (held.up ? 1 : 0) - (held.down ? 1 : 0);
  let mx = fwd[0] * iy + rt[0] * ix, mz = fwd[1] * iy + rt[1] * ix; const ml = Math.hypot(mx, mz);
  const run = held.b ? 1.7 : 1, sp = .052 * run;
  CARL.moving = ml > 0;
  let belt = [0, 0]; for (const b of (WX.sc.belts || [])) if (CARL.p[0] > b.r[0] && CARL.p[0] < b.r[2] && CARL.p[2] > b.r[1] && CARL.p[2] < b.r[3] && (!b.if || b.if())) belt = [b.v[0], b.v[1]];
  if (ml === 0 && (belt[0] || belt[1])) { const bx = CARL.p[0] + belt[0], bz = CARL.p[2] + belt[1]; if (walkable(bx, CARL.p[2])) CARL.p[0] = bx; if (walkable(CARL.p[0], bz)) CARL.p[2] = bz; }
  if (ml > 0) {
    mx /= ml; mz /= ml; const ty = Math.atan2(mx, mz); let dy = ty - CARL.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; CARL.yaw += dy * .3;
    const nx = CARL.p[0] + mx * sp + belt[0], nz = CARL.p[2] + mz * sp + belt[1];
    const stk = !walkable(CARL.p[0], CARL.p[2]); // squeezed into a corner by a rounding error: let him walk out
    if (stk || walkable(nx, CARL.p[2])) CARL.p[0] = nx; if (stk || walkable(CARL.p[0], nz)) CARL.p[2] = nz;
    CARL.walk += .2 * run;
  } else CARL.walk *= .8;
  const sw = Math.sin(CARL.walk) * .9 * Math.min(1, Math.abs(CARL.walk) + (ml > 0 ? 1 : 0));
  CARL.pose = { armL: -sw, armR: sw, legL: sw, legR: -sw }; CARL.bob = ml > 0 ? Math.abs(Math.sin(CARL.walk)) * .04 : Math.sin(WX.t * .05) * .008;
  if (CARL.inv > 0) CARL.inv--;
}
function nearest3() {
  let best = null, bd = 1e9;
  for (const e of WX.ents) { if (!live3(e) || !(e.talk || e.look)) continue; const d = dist2(e.p, CARL.p); if (d < e.range && d < bd) { best = e; bd = d; } }
  return best;
}
const worldScene3 = {
  update() {
    WX.t++; C3.time++;
    if (WX.shake > 0) { WX.shake--; post.shake = WX.shake > 0 ? Math.min(3, WX.shake >> 1) : 0; } else post.shake = 0;
    for (const k of WX.tick) k.t--; WX.tick = WX.tick.filter(k => k.t > 0);
    for (const f of WX.fx) { f.t--; if (f.vy !== undefined) f.p[1] += f.vy; } WX.fx = WX.fx.filter(f => f.t > 0);
    if (WX.banner && WX.banner.t > 0) WX.banner.t--;
    if (WX.haze > 0) WX.haze--;
    if (WX.cut > 0) WX.cut--;
    if (frozen3()) return;
    if (pressed.start) { wstory(pauseMenu3); return; }
    carlUpdate();
    for (const e of WX.ents) { if (!live3(e)) continue; e.t++; if (e.upd) e.upd(e); if (e.faceCarl && dist2(e.p, CARL.p) < 6) { const ty = Math.atan2(CARL.p[0] - e.p[0], CARL.p[2] - e.p[2]); let dy = ty - e.yaw; while (dy > Math.PI) dy -= 6.2832; while (dy < -Math.PI) dy += 6.2832; e.yaw += dy * .08; } }
    WX.ents = WX.ents.filter(e => !e.gone);
    if (pressed.a) { const e = nearest3(); if (e) wstory(() => e.talk ? e.talk(e) : say(e.look, 'CARL', { port: carlPortrait() })); }
    if (pressed.c) { WX.haze = 240; sfx('power'); tickC(pick(['smoke time', 'what do you see carl', 'the haze shows the stamps', 'he is smoking near the gas pumps']), 'user_000'); if (WX.sc.onSmoke) wstory(WX.sc.onSmoke); }
    exitCheck3(); pickCam();
    if (WX.sc.tick) WX.sc.tick();
    if (WX.t % 700 === 350) tickC(pick(CHATLINES));
  },
  draw() { drawWorld3(); },
};
const CHATLINES = ['first', 'W', 'is that a package', 'that parcel is looking at you', 'carl be normal', 'be normal carl', 'ask for the manager', 'the lot is HUGE', 'who is the sender', 'it is just a box carl', 'return to sender', 'zip code?', 'nobody is here', 'it is so quiet. do something', 'push the button', 'dont push the button'];
function exitCheck3() {
  if (WX.hold) return;
  for (const x of (WX.sc.exits || [])) if (CARL.p[0] >= x.r[0] && CARL.p[2] >= x.r[1] && CARL.p[0] <= x.r[2] && CARL.p[2] <= x.r[3]) {
    if (x.if && !x.if()) { if (!WX.noT) { WX.noT = 120; wstory(async () => { await x.no(); CARL.p[0] -= Math.sin(CARL.yaw) * 1.4; CARL.p[2] -= Math.cos(CARL.yaw) * 1.4; }); } continue; }
    wstory(() => x.go ? x.go() : goScene(x.to, x.x, x.z, x.yaw)); return;
  }
  if (WX.noT > 0) WX.noT--;
}
// ---------------- drawing ----------------
let CHATSCALE = 1;
function drawWorld3() {
  if (WX.cut > 0 && WX.cut > 1) { cls(BLACK); return; }
  showBackdrop(WX.bg);
  const sc = WX.sc, list = WX.ents.filter(live3);
  for (const e of list) if (e.kind !== 'prop3' && !e.noShadow) liveShadow(e.p, (e.shadow || .5), .5);
  liveShadow(CARL.p, .45, .55);
  for (const e of list) {
    if (e.draw3) { e.draw3(e); continue; }
    const m = entModel(e); if (!m) continue; const light = liveLight(sc, e.p);
    drawModel(m, { p: e.p, yaw: e.yaw, pose: e.pose, bob: e.bob || 0, s: e.s }, light);
  }
  drawModel(MODEL.carl, { p: CARL.p, yaw: CARL.yaw, pose: CARL.pose, bob: CARL.bob }, liveLight(sc, CARL.p));
  for (const f of WX.fx) { const sp = project(LIVE.cam, f.p); if (sp) { if (f.k === 'txt') text(f.s, sp[0] - f.s.length * 3, sp[1], f.c || WHITE); else if (f.k === 'spark') pset(sp[0], sp[1], f.c); } }
  if (sc.drawOver) sc.drawOver();
  if (WX.haze > 0) { const a = Math.min(.12, WX.haze / 900); rectA(0, 0, W, H, hex('#6dff92'), a); for (const e of list) if (e.haze) { const sp = project(LIVE.cam, [e.p[0], e.p[1] + (e.hazeY || 1), e.p[2]]); if (sp) { text(e.haze, sp[0] - e.haze.length * 3, sp[1] - 10, hex('#6dff92')); } } }
  // prompts
  if (!frozen3()) { const e = nearest3(); if (e) { const sp = project(LIVE.cam, [e.p[0], (entModel(e) ? entModel(e).h || 1.2 : 1.2) + (e.promptY || .3), e.p[2]]); if (sp) { circF(sp[0], sp[1] - 8, 6, hex('#ffd848')); ringF(sp[0], sp[1] - 8, 6, hex('#7a5a10')); text('A', sp[0] - 2, sp[1] - 11, hex('#241a00'), 0); if (e.label) { const lw = e.label.length * 6 + 8; plate(sp[0] - lw / 2, sp[1] - 29, lw, 13, { alpha: .75, cut: 2, flat: 1 }); text(e.label, sp[0] - e.label.length * 3, sp[1] - 26, UI3.text, 0); } } } }
  drawHUD3();
}
function drawHUD3() {
  // objective: top left
  let oy = 4;
  if (typeof OBJ3 !== 'undefined' && OBJ3 && !frozen3()) { const ol = wrapT(OBJ3.text.toUpperCase(), 31).slice(0, 2), w = Math.max(...ol.map(l => l.length)) * 6 + 26, h = 8 + ol.length * 10; plate(4, 4, w, h, { alpha: .72 }); triF(10, 9, 10, 17, 16, 13, UI3.name); ol.forEach((l, i) => shadowText(l, 21, 8 + i * 10, UI3.text)); oy = 4 + h + 4; }
  if (WX.banner && WX.banner.t > 0) { const b = WX.banner.s.slice(0, 31), w = b.length * 6 + 28; plate(4, oy, w, 18, { c0: '#241a52', c1: '#40308a' }); shadowText(b, 18, oy + 5, UI3.name); }
  // parcels and suspicion: top right
  const pn = C3.parcels.filter(p => p.status === 'carry').length;
  plate(W - 104, 4, 100, 28, { alpha: .72 });
  rectF(W - 98, 9, 9, 8, hex('#c8a070')); rectF(W - 95, 9, 3, 8, hex('#e8dcb0')); shadowText('PARCELS ' + pn, W - 85, 9, hex('#ffd848'));
  text('SUS', W - 98, 21, UI3.dim); for (let i = 0; i < 5; i++) rectF(W - 76 + i * 12, 21, 10, 6, i < C3.suspicion ? (C3.suspicion >= 3 ? hex('#ff4949') : hex('#ffb040')) : hex('#44568c'));
  // chat ticker: bottom left
  if (!DLG) WX.tick.slice(-3).forEach((k, i) => { const s = (k.u + ': ' + k.m).toUpperCase().slice(0, 44); plate(4, H - 16 - i * 14, s.length * 6 + 14, 13, { alpha: .6, cut: 2, flat: 1 }); shadowText(s, 11, H - 13 - i * 14, UI3.dim); });
}
const carlPortrait = () => PORT.CARL;
// ---------------- the pause menu ----------------
async function pauseMenu3() {
  sfx('tick');
  for (;;) {
    const i = await choose(['PARCELS', 'ALIBIS', 'ROUTE CARD', 'ASK CHAT', 'SAVE', 'CLOSE'], { x: W - 116, y: 22, cancel: 1 });
    if (i === 0) { await parcelsScreen(); continue; }
    if (i === 1) { await alibiScreen(); continue; }
    if (i === 2) { await routeScreen(); continue; }
    if (i === 3) { await askChat3(); continue; }
    if (i === 4) { saveC3(); sfx('ok'); await say('SAVED. THE POST OFFICE KEEPS A COPY.'); continue; }
    return;
  }
}
function saveC3() { if (!C3) return; C3.x = CARL.p[0]; C3.z = CARL.p[2]; C3.yaw = CARL.yaw; store('carl3_save', C3); }
async function askChat3() {
  const hint = typeof stopHint === 'function' ? stopHint() : 'Go somewhere.';
  await chat([{ u: pick(GCH), m: 'carl ask us something' }, { u: 'user_000', m: hint }, { u: pick(GCH), m: pick(['listen to user_000', 'be normal', 'W chat']) }]);
}
