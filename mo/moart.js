'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. art: models, the corrupted-backup glitch, the Sin City filter, the flashlight, the noir skin, sound =================
// ---------------- models ----------------
const MOM = {};
// JB: the noir cat (same build as NO FURTHER QUESTIONS). a gray copy for when his composure runs out, and the double's version with nothing behind the eyes
function jbModel(o = {}) {
  const g = c => o.gray ? (v => [v, v, v])(Math.round(c[0] * .3 + c[1] * .59 + c[2] * .11)) : c;
  const fur = g([238, 139, 43]), fur2 = g([216, 125, 30]), coat = o.coat || g([112, 108, 99]), sleeve = o.coat ? o.coat.map(v => v * 1.1) : g([126, 121, 111]);
  const eye = o.eye || [230, 230, 214], pupil = o.pupil || [12, 12, 12];
  return { h: 1.65, parts: [
    { m: 'cyl:.39:.83:8:.3', o: [0, .28, 0], col: coat },
    { m: 'sphere:.35:10:7', o: [0, 1.22, 0], s: [1.3, 1, 1], col: fur, j: 'head', head: 1 },
    { m: 'prism:.25:.31:.2', o: [-.28, 1.42, 0], col: fur2, j: 'head', head: 1 }, { m: 'prism:.25:.31:.2', o: [.28, 1.42, 0], col: fur2, j: 'head', head: 1 },
    { m: 'sphere:.17:8:5', o: [-.12, 1.13, .28], s: [1.2, .7, .7], col: g([239, 212, 158]), j: 'head', head: 1 }, { m: 'sphere:.17:8:5', o: [.12, 1.13, .28], s: [1.2, .7, .7], col: g([239, 212, 158]), j: 'head', head: 1 },
    { m: 'box:.16:.1:.04', o: [-.16, 1.29, .31], col: eye, j: 'head', head: 1 }, { m: 'box:.16:.1:.04', o: [.16, 1.29, .31], col: eye, j: 'head', head: 1 },
    { m: 'box:.05:.07:.05', o: [-.13, 1.29, .34], col: pupil, j: 'head', head: 1 }, { m: 'box:.05:.07:.05', o: [.13, 1.29, .34], col: pupil, j: 'head', head: 1 },
    { m: 'box:.1:.07:.06', o: [0, 1.18, .39], col: [50, 32, 32], j: 'head', head: 1 },
    { m: 'cyl:.46:.055:10', o: [0, 1.49, -.03], col: o.hat || [71, 69, 65], j: 'head', head: 1 }, { m: 'cyl:.29:.21:8:.24', o: [0, 1.53, -.03], col: o.hat ? o.hat.map(v => v * 1.3) : [99, 96, 87], j: 'head', head: 1 }, { m: 'cyl:.295:.05:8', o: [0, 1.55, -.03], col: o.band || [31, 30, 29], j: 'head', head: 1 },
    { m: shift('box:.15:.55:.18', 0, -.48, 0), o: [-.4, 1.02, 0], col: sleeve, j: 'armL' }, { m: shift('box:.15:.55:.18', 0, -.48, 0), o: [.4, 1.02, 0], col: sleeve, j: 'armR' },
    { m: shift('box:.22:.28:.31', 0, -.24, .06), o: [-.18, .27, 0], col: fur2, j: 'legL' }, { m: shift('box:.22:.28:.31', 0, -.24, .06), o: [.18, .27, 0], col: fur2, j: 'legR' },
    { m: 'box:.68:.065:.52', o: [0, .66, 0], col: [55, 54, 51] }, { m: 'box:.08:.08:.04', o: [0, .67, .28], col: [205, 194, 165] },
    { m: 'cyl:.07:.55:7', o: [.25, .3, -.3], col: fur },
  ] };
}
MOM.jb = jbModel(); MOM.jbGray = jbModel({ gray: 1 });
MOM.double = jbModel({ gray: 1, coat: [40, 40, 44], hat: [20, 20, 22], band: [150, 20, 20], eye: [12, 12, 12], pupil: [200, 24, 24] });
// the revolver lives in JB's right hand while he aims
MOM.gun = { h: .2, parts: [{ m: 'box:.06:.09:.26', o: [0, 0, 0], col: [30, 30, 34] }, { m: 'cyl:.025:.18:6', o: [0, .03, .1], col: [50, 50, 56], pitch: 1 }] };
// corrupted backups: people the stacks are still trying to play back
MOM.drifter = personModel({ top: '#6d6d6d', bottom: '#3a3a3a', skin: '#a8a8a8', hair: '#242424', shoe: '#181818' });
MOM.drifterCoat = personModel({ top: '#c8c8c8', bottom: '#5a5a5a', skin: '#9a9a9a', hair: '#3a3a3a', glasses: 1, hairStyle: 'bald' });
MOM.drifterRed = personModel({ top: '#922424', bottom: '#2a2a2a', skin: '#b0b0b0', hair: '#121212', hairStyle: 'big' });
MOM.loop = personModel({ top: '#e8e8e8', bottom: '#d0d0d0', skin: '#f0f0f0', hairStyle: 'bald', shoe: '#c0c0c0' });
MOM.otis = personModel({ top: '#6d6a5a', bottom: '#3a3a3a', skin: '#c8b8a8', hair: '#b0b0b0', beard: 1, glasses: 1 });
MOM.ruby = personModel({ top: '#c02424', bottom: '#2a2a2a', skin: '#d8c8b8', hair: '#181818', hairStyle: 'big', shoe: '#c02424' });
// the Composite: the machine's best guess at the original, averaged from everything it ever recorded
MOM.composite = { h: 3.4, parts: [
  { m: 'cyl:.7:1.6:9:.45', o: [0, 0, 0], col: [70, 70, 74] },
  { m: 'box:1.5:.9:.8', o: [0, 1.5, 0], col: [90, 88, 84] },
  { m: 'sphere:.36:10:7', o: [-.62, 2.7, 0], s: [1.3, 1, 1], col: [200, 120, 40], j: 'h0' },             // a cat's head, hatted
  { m: 'cyl:.44:.05:10', o: [-.62, 2.98, 0], col: [40, 40, 40], j: 'h0' }, { m: 'cyl:.27:.2:8:.22', o: [-.62, 3.02, 0], col: [60, 60, 60], j: 'h0' },
  { m: 'sphere:.38:10:7', o: [0, 2.85, .05], s: [1, 1.1, 1], col: [24, 16, 34], j: 'h1' },             // a dark screen of a face with neon lines
  { m: 'box:.36:.04:.04', o: [0, 3.0, .42], col: [255, 60, 120], j: 'h1' }, { m: 'box:.05:.34:.04', o: [-.2, 2.8, .4], col: [255, 60, 120], j: 'h1' }, { m: 'box:.05:.34:.04', o: [.2, 2.8, .4], col: [255, 60, 120], j: 'h1' },
  { m: 'sphere:.32:9:6', o: [.62, 2.65, 0], col: [190, 180, 170], j: 'h2' },                            // an old man's head, glasses
  { m: 'box:.42:.06:.04', o: [.62, 2.7, .3], col: [40, 40, 50], j: 'h2' }, { m: 'sphere:.26:7:4', o: [.62, 2.5, .1], s: [1, .8, .8], col: [170, 170, 170], j: 'h2' },
  { m: shift('box:.26:1.6:.26', 0, -1.5, 0), o: [-1.0, 2.0, 0], col: [110, 106, 98], j: 'armL' }, { m: shift('box:.26:1.6:.26', 0, -1.5, 0), o: [1.0, 2.0, 0], col: [110, 106, 98], j: 'armR' },
  { m: 'box:.3:.1:1.4', o: [0, .02, .9], col: [40, 40, 40] }, { m: 'box:1.4:.1:.3', o: [.9, .02, 0], col: [40, 40, 40] },
] };
// pickups: a small glint you can see from across a room
MOM.ammo = { h: .2, parts: [{ m: 'box:.3:.14:.2', o: [0, 0, 0], col: [150, 130, 70] }, { m: 'box:.31:.04:.21', o: [0, .1, 0], col: [200, 40, 30] }] };
MOM.lasagna = { h: .2, parts: [{ m: 'box:.36:.1:.26', o: [0, 0, 0], col: [200, 200, 200] }, { m: 'box:.3:.05:.2', o: [0, .1, 0], col: [210, 90, 40] }] };
MOM.coffee = { h: .3, parts: [{ m: 'cyl:.08:.2:8', o: [0, 0, 0], col: [230, 230, 230] }, { m: 'cyl:.075:.01:8', o: [0, .2, 0], col: [60, 30, 20] }] };
MOM.tape = { h: .2, parts: [{ m: 'box:.3:.04:.2', o: [0, 0, 0], col: [30, 30, 30] }, { m: 'box:.2:.045:.08', o: [0, .001, 0], col: [210, 210, 200] }] };
MOM.card = { h: .1, parts: [{ m: 'box:.2:.02:.13', o: [0, 0, 0], col: [220, 220, 220] }, { m: 'box:.2:.021:.03', o: [0, 0, -.04], col: [200, 40, 30] }] };
MOM.key = { h: .1, parts: [{ m: 'box:.18:.03:.05', o: [0, 0, 0], col: [200, 170, 80] }, { m: 'cyl:.06:.03:8', o: [-.1, 0, 0], col: [200, 170, 80] }] };
MOM.paper = { h: .1, parts: [{ m: 'box:.24:.01:.32', o: [0, 0, 0], col: [235, 232, 220] }] };
MOM.fuse = { h: .2, parts: [{ m: 'cyl:.06:.3:8', o: [0, 0, 0], col: [200, 190, 160], pitch: 1.57 }, { m: 'box:.14:.14:.08', o: [0, 0, -.16], col: [120, 110, 90] }, { m: 'box:.14:.14:.08', o: [0, 0, .16], col: [120, 110, 90] }] };
MOM.reel = { h: .3, parts: [{ m: 'cyl:.3:.06:14', o: [0, 0, 0], col: [200, 200, 205] }, { m: 'cyl:.22:.065:14', o: [0, .001, 0], col: [40, 30, 24] }, { m: 'cyl:.05:.07:8', o: [0, .002, 0], col: [210, 40, 30] }] };
// ---------------- the glitch: a backup that doesn't quite hold together ----------------
function drawGlitch(M, st, light, amt) {
  const c = Math.cos(st.yaw || 0), s = Math.sin(st.yaw || 0), k = st.s || M.k || 1, pose = st.pose || {}, seed = (frame >> 2) + (st.seed || 0);
  M.parts.forEach((pt, i) => {
    const h = hash2(i * 7 + seed, seed * 3 + (st.seed || 0));
    if (amt > 0 && h < amt * .18) return;                                             // a limb that isn't there this frame
    const j = amt > 0 && h > 1 - amt * .4 ? (hash2(i, seed) - .5) * amt * .5 : 0;     // a limb that's a little to the left of where it should be
    const ang = pt.j ? (pose[pt.j] || 0) : 0, o = pt.o, ox = o[0] * k + j, oy = o[1] * k + (st.bob || 0), oz = o[2] * k;
    const wp = [st.p[0] + ox * c + oz * s, st.p[1] + oy, st.p[2] - ox * s + oz * c];
    let m = mesh(pt.m); if (pt.s) m = { v: m.v.map(v => [v[0] * pt.s[0], v[1] * pt.s[1], v[2] * pt.s[2]]), n: m.n, f: m.f };
    const col = st.flash ? [255, 255, 255] : st.tint ? pt.col.map((v, q) => v * .5 + st.tint[q] * .5) : pt.col;
    drawMeshLive(m, { p: wp, yaw: (st.yaw || 0) + (pt.head ? pose.headYaw || 0 : 0), s: k, rx: ang + (pt.pitch || 0) }, col, light);
  });
}
// ---------------- the Sin City filter: gray, except what's red or orange ----------------
function noirize(color) {
  for (let i = 0; i < color.length; i++) {
    const v = color[i], r = v & 255, g = (v >> 8) & 255, b = (v >> 16) & 255, x = i % W, y = (i / W) | 0, mx = g > b ? g : b, l = r * .3 + g * .59 + b * .11;
    // how red/orange is it? 0 = gray, 1 = keep the color. blended, so the edge doesn't sparkle under the dither
    const k = r < 70 || r < g * 1.25 || r < b * 1.7 ? 0 : Math.min(1, Math.max(0, (r - mx - 35) / 45));
    color[i] = k ? packD(l + (r * 1.06 - l) * k, l + (g * .94 - l) * k, l + (b * .88 - l) * k, x, y) : packD(l, l, l, x, y);   // one value per channel for grays, or the dither makes rainbows
  }
  return color;
}
// light for the live models: neutral gray, unless the room's light is strongly red (the basement), which stays red
function liveLight(sc, p) {
  const amb = sc.amb || [.3, .3, .4], sun = sc.sun || { dir: [-.3, .8, -.4], col: [.3, .3, .5] }, d = v3.norm(sun.dir);
  let tr = 0, tg = 0, tb = 0;
  for (const L of sc.lights) { const dx = L.p[0] - p[0], dy = L.p[1] - p[1], dz = L.p[2] - p[2], dist = Math.hypot(dx, dy, dz); if (dist < L.rad) { const k = Math.pow(1 - dist / L.rad, 2) * (L.int || 1) * 70, red = L.col[0] > 2 * Math.max(L.col[1], L.col[2]), m = (L.col[0] + L.col[1] + L.col[2]) / 3; tr += (red ? L.col[0] : m) * k; tg += (red ? L.col[1] : m) * k; tb += (red ? L.col[2] : m) * k; } }
  const a = Math.min(1.3, (amb[0] + amb[1] + amb[2]) / 3 * 2.8 + .38), sc2 = (sun.col[0] + sun.col[1] + sun.col[2]) / 3 * 1.8;
  return { amb: [a, a, a], dir: d, dcol: [sc2, sc2, sc2], tint: [tr, tg, tb] };
}
// a dark copy: the room with the power off. only the emissive things and whatever gets in from outside
function darkScene(sc) { return Object.assign({}, sc, { objs: sc.objs.map(o => o.mat && o.mat.tube ? Object.assign({}, o, { mat: Object.assign({}, o.mat, { emis: 0, col: '#3a3a3a' }) }) : o), lights: (sc.lights || []).filter(L => L.keep), amb: [.06, .06, .065], sun: { dir: [0, 1, 0], col: [.03, .03, .03] } }); }
// the flashlight: the lit render shows through a soft cone ahead of him
function flashlight(bg, p, yaw, on) {
  const cam = LIVE.cam, ahead = [p[0] + Math.sin(yaw) * 2.6, 0, p[2] + Math.cos(yaw) * 2.6], a = project(cam, ahead), me = project(cam, [p[0], .6, p[2]]);
  const spots = [];
  if (on && a) spots.push([a[0], a[1], Math.min(120, 2.3 * cam.foc / a[2]), 1]);
  if (on) { const mid = project(cam, [p[0] + Math.sin(yaw) * 1.2, .3, p[2] + Math.cos(yaw) * 1.2]); if (mid) spots.push([mid[0], mid[1], Math.min(90, 1.4 * cam.foc / mid[2]), .9]); }
  if (me) spots.push([me[0], me[1], Math.min(60, 1.0 * cam.foc / me[2]), .45]);
  for (const [cx, cy, R, k0] of spots) {
    const x0 = Math.max(0, cx - R | 0), x1 = Math.min(W - 1, cx + R | 0), y0 = Math.max(0, cy - R * .8 | 0), y1 = Math.min(H - 1, cy + R * .8 | 0);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const d = Math.hypot((x - cx) / R, (y - cy) / (R * .8)); if (d >= 1) continue; const k = Math.min(1, (1 - d) * 1.8) * k0, i = y * W + x;
      const [lr, lg, lb] = unpack(bg.color[i]), [dr, dg, db] = unpack(FB[i]); if (lr + lg + lb <= dr + dg + db) continue;
      FB[i] = packD(dr + (lr - dr) * k, dg + (lg - dg) * k, db + (lb - db) * k, x, y);
    }
  }
}
// rain falling past a camera, in front of everything
function rainFX(n = 40, k = 1) { for (let i = 0; i < n; i++) { const x = (i * 47 + frame * 3) % W, y = (i * 29 + frame * 9 * k) % H; lineF(x, y, x - 2, y + 6, hex('#8a8a92')); } }
// ---------------- the noir skin over the CARL 3 chrome ----------------
Object.assign(UI3, { edge: hex('#b0b0b0'), edge2: hex('#2a2a2a'), text: hex('#e8e8e4'), dim: hex('#8a8a86'), name: hex('#ff9a3a'), hot: hex('#ff3a2a'), c0: '#050505', c1: '#1c1c1c' });
function plate(x, y, w, h, o = {}) {
  const a = o.alpha === undefined ? .86 : o.alpha, cut = o.cut === undefined ? 2 : o.cut, edge = o.edge || UI3.edge, c0 = o.c0 || UI3.c0, c1 = o.c1 || UI3.c1;
  x |= 0; y |= 0;
  for (let j = 0; j < h; j++) { const ins = j < cut ? cut - j : j >= h - cut ? j - (h - cut - 1) : 0; rectA(x + ins, y + j, w - ins * 2, 1, mixh(c0, c1, j / h), a); }
  rectF(x + cut, y, w - cut * 2, 1, edge); rectF(x + cut, y + h - 1, w - cut * 2, 1, UI3.edge2); rectF(x, y + cut, 1, h - cut * 2, edge); rectF(x + w - 1, y + cut, 1, h - cut * 2, UI3.edge2);
}
const NARR = 'NARRATION';
// dialog: narration is a caption in his voice (no bust, orange rule); spoken lines get the bust
function drawOverlay() {
  if (CARD) { cls(CARD.bg); const y0 = ((H - CARD.lines.length * 12 * CARD.sc) / 2) | 0; CARD.lines.forEach((l, i) => ctext(l, y0 + i * 12 * CARD.sc, CARD.fg, hex('#000000'), CARD.sc)); }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = BANNER.s.length * 6 + 28; plate(((W - w) / 2) | 0, 14, w, 20); shadowText(BANNER.s, ((W - BANNER.s.length * 6) / 2) | 0, 20, UI3.name); }
  if (CHATBOX) { plate(W - 156, 8, 148, 122); rectF(W - 152, 12, 140, 11, hex('#8a1a14')); shadowText('RADIO', W - 148, 14, WHITE); const rows = []; for (const m of CHATBOX.msgs) { rows.push([m.u + ':', UI3.name]); for (const l of wrapT(m.m.toUpperCase(), 22)) rows.push([' ' + l, UI3.text]); } rows.slice(-9).forEach((r, i) => shadowText(r[0], W - 150, 27 + i * 11, r[1])); }
  if (DLG) {
    const y = H - 70, nar = DLG.who === NARR, hasP = DLG.hasP && !nar;
    if (hasP) { const bx = 10, by = y - 54; drawBust(DLG.who, bx, by, 60, 60, DLG.n < DLG.total, frame); frameRect(bx - 1, by - 1, 62, 62, hex(BACC[DLG.who] || '#b0b0b0')); frameRect(bx, by, 60, 60, hex('#000000')); }
    plate(6, y, W - 12, 64, nar ? { c0: '#000000', c1: '#0c0a08', edge: hex('#ff9a3a') } : {});
    if (nar) { rectF(12, y + 6, 2, 52, hex('#ff9a3a')); }
    else if (DLG.who) { const nm = DLG.who, w = nm.length * 6 + 22, nx = hasP ? 76 : 14; plate(nx, y - 9, w, 17, { c0: '#140a04', c1: '#2a1608', edge: hex(BACC[DLG.who] || '#ff9a3a') }); shadowText(nm, nx + 11, y - 5, UI3.name); }
    let n = DLG.n | 0; const tc = nar ? hex('#f0e6d8') : UI3.text;
    DLG.lines.forEach((l, i) => { shadowText(l.slice(0, Math.max(0, n)), nar ? 20 : 16, y + 10 + i * 12, tc); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) { const ax = W - 24, ay = H - 18; triF(ax, ay, ax + 8, ay, ax + 4, ay + 5, UI3.name); }
  }
  for (const m of MENUS) {
    plate(m.x, m.y, m.w, m.h);
    m.opts.forEach((s, i) => { const yy = m.y + 7 + i * 12; if (i === m.i) { rectA(m.x + 5, yy - 2, m.w - 10, 11, hex('#ff9a3a'), .2); triF(m.x + 8, yy, m.x + 8, yy + 7, m.x + 13, yy + 3, UI3.name); } shadowText(s, m.x + 18, yy, i === m.i ? UI3.name : UI3.text); });
  }
}
regBust(['JB', 'JB GARFIELD'], garfBust(), '#ff9a3a');
regBust('YOKO', genBust({ skin: '#f0dcd0', hair: '#5a3a2a', hairStyle: 'long', top: '#7a7a9a', collar: '#f0f0f0' }), '#b0b0d0');
regBust(['OTIS', 'OTIS KEEL'], genBust({ skin: '#c8b8a8', hair: '#b0b0b0', top: '#6d6a5a', glasses: 1, beard: 1, collar: '#d8d8d0' }), '#c8c8b0');
regBust(['RUBY', 'RUBY KEEL'], genBust({ skin: '#d8c8b8', hair: '#181818', hairStyle: 'big', top: '#c02424' }), '#ff3a2a');
regBust('MERIDIAN', userBust(), '#ff3a2a');
Object.assign(VOICE, { JB: [260, 30], 'JB GARFIELD': [260, 30], NARRATION: [240, 20], YOKO: [820, 40], OTIS: [380, 50], 'OTIS KEEL': [380, 50], RUBY: [640, 40], 'RUBY KEEL': [640, 40], MERIDIAN: [700, 0], 'THE DOUBLE': [200, 160] });
// ---------------- sound ----------------
Object.assign(SFX, {
  gun: () => { noise(.35, { lp: 2600, vol: .75, rate: .9 }); tone(90, .25, { slide: .4, vol: .5, type: 'square' }); noise(.9, { lp: 700, vol: .18, at: AC.currentTime + .08 }); },
  empty: () => note(2200, .02, 'pluck', AC.currentTime, sfxBus),
  reload: () => [0, .12, .24, .5].forEach(d => noise(.03, { hp: 2500, vol: .35, at: AC.currentTime + d })),
  sap: () => noise(.12, { lp: 400, vol: .55, rate: .7 }),
  thud: () => { noise(.18, { lp: 300, vol: .6 }); tone(70, .2, { slide: .5, vol: .4, type: 'sine' }); },
  groan: () => { tone(110 + Math.random() * 40, .9, { slide: .6, vol: .22, type: 'sawtooth' }); noise(.7, { bp: 500, vol: .12 }); },
  shriek: () => { tone(900, .5, { slide: 2.2, vol: .25, type: 'sawtooth' }); tone(1300, .4, { slide: .4, vol: .15, type: 'square', delay: .05 }); },
  heart: () => { kick(AC.currentTime, sfxBus, .9); kick(AC.currentTime + .18, sfxBus, .6); },
  creak: () => { tone(160, .7, { slide: 1.6, vol: .14, type: 'sawtooth' }); noise(.5, { bp: 300, vol: .2, rate: .5 }); },
  tape: () => { noise(.8, { bp: 3000, vol: .1, rate: 1.6 }); tone(400, .6, { slide: 1.5, vol: .1, type: 'square' }); },
  glass: () => { for (let i = 0; i < 7; i++) note(2000 + Math.random() * 3000, .15, 'bell', AC.currentTime + i * .03, sfxBus); noise(.4, { hp: 3000, vol: .4 }); },
  lift: () => { tone(60, 1.6, { slide: 1.1, vol: .3, type: 'sawtooth' }); note(1320, .5, 'bell', AC.currentTime + 1.4, sfxBus); },
  breaker: () => { noise(.06, { lp: 900, vol: .7 }); tone(180, .06, { vol: .3, type: 'square' }); },
  static: () => { noise(.5, { bp: 2200, vol: .28, rate: 1.4 }); noise(.35, { hp: 4000, vol: .12, at: AC.currentTime + .1 }); },
  stamp: () => { noise(.12, { lp: 500, vol: .6, rate: .5 }); tone(120, .1, { vol: .4, type: 'square', slide: .5 }); },
});
// ---------------- music: every track built from chords ----------------
Object.assign(TRACKS, {
  mo_title: cgen({ bpm: 62, prog: [cAm, cF, cDm, cE], lead: [CT.long, CT.sparse, CT.low, CT.sparse], leadIns: 'sax', leadVol: .32, arp: CA.gap, arpIns: 'epiano', arpVol: .22, bass: CB.slow, bassVol: .5, drums: CD.soft, drumVol: .16 }),
  mo_rain: cgen({ bpm: 70, prog: [cDm, cBb, cAm, cA], lead: [CT.sparse, CT.long, CT.sparse, CT.answer], leadIns: 'sax', leadVol: .28, arp: false, bass: CB.walk, bassVol: .45, drums: CD.soft, drumVol: .14 }),
  mo_hall: cgen({ bpm: 54, prog: [cAm, cAm, cF, cE], lead: [CT.sparse, CT.sparse, CT.sparse, CT.low], leadIns: 'bell', leadVol: .16, arp: false, bass: CB.slow, bassVol: .38, drums: false }),
  mo_dark: cgen({ bpm: 48, prog: [cDm, cDm, cBb, cA], lead: [CT.sparse, CT.sparse, CT.sparse, CT.sparse], leadIns: 'bell', leadVol: .1, arp: false, bass: CB.slow, bassVol: .32, drums: false }),
  mo_safe: cgen({ bpm: 66, prog: [cF, cC, cDm, cAm], lead: [CT.long, CT.turn, CT.long, CT.low], leadIns: 'epiano', leadVol: .3, arp: CA.roll, arpIns: 'vibes', arpVol: .16, bass: CB.slow, bassVol: .4, drums: false }),
  mo_suite: cgen({ bpm: 76, prog: [cDm, cG, cC, cA], lead: [CT.answer, CT.sparse, CT.turn, CT.sparse], leadIns: 'sax', leadVol: .3, arp: CA.strum, arpIns: 'epiano', arpVol: .18, bass: CB.walk, bassVol: .45, drums: CD.soft, drumVol: .12 }),
  mo_double: cgen({ bpm: 128, prog: [cEm, cC, cAm, cBm], lead: [CT.sync, CT.answer, CT.sync, CT.long], leadIns: 'brass', leadVol: .32, arp: CA.up, arpIns: 'synth', arpVol: .22, bass: CB.pump, bassVol: .6, drums: CD.ind, drumVol: .38 }),
  mo_monday: cgen({ bpm: 52, prog: [cAm, cF, cDm, cE], lead: [CT.low, CT.sparse, CT.long, CT.sparse], leadIns: 'bell', leadVol: .14, arp: false, bass: CB.slow, bassVol: .4, drums: false }),
  mo_boss: cgen({ bpm: 140, prog: [cDm, cBb, cC, cA], lead: [CT.hook, CT.sync, CT.rise, CT.long], leadIns: 'brass', leadVol: .34, arp: CA.up, arpIns: 'synth', arpVol: .24, bass: CB.pump, bassVol: .65, drums: CD.ind, drumVol: .42 }),
  mo_end: cgen({ bpm: 72, prog: [cC, cAm, cF, cG], lead: [CT.long, CT.turn, CT.long, CT.hook], leadIns: 'sax', leadVol: .32, arp: CA.roll, arpIns: 'epiano', arpVol: .2, bass: CB.walk, bassVol: .45, drums: CD.soft, drumVol: .16 }),
});
// ---------------- the wings: more models, sounds, music ----------------
// a crawler: a backup that came out without the legs. low, quick, reaching
MOM.crawler = { h: .7, parts: [
  { m: 'box:.46:.3:.86', o: [0, .3, -.05], col: [118, 118, 118] },
  { m: 'sphere:.19:9:6', o: [0, .42, .5], col: [168, 168, 168], j: 'head', head: 1 }, { m: 'sphere:.2:9:5', o: [0, .5, .46], s: [1, .6, 1], col: [40, 40, 40], j: 'head', head: 1 },
  { m: 'box:.05:.05:.03', o: [-.07, .44, .68], col: [10, 10, 10], j: 'head', head: 1 }, { m: 'box:.05:.05:.03', o: [.07, .44, .68], col: [10, 10, 10], j: 'head', head: 1 },
  { m: shift('box:.13:.56:.13', 0, -.5, 0), o: [-.3, .42, .32], col: [118, 118, 118], j: 'armL' }, { m: shift('box:.13:.56:.13', 0, -.5, 0), o: [.3, .42, .32], col: [118, 118, 118], j: 'armR' },
  { m: 'box:.3:.12:.3', o: [0, .14, -.52], col: [60, 60, 60] },
] };
MOM.shotgun = { h: .2, parts: [{ m: 'box:.07:.1:.5', o: [0, 0, 0], col: [40, 34, 30] }, { m: 'cyl:.03:.5:6', o: [0, .05, .3], col: [60, 60, 66], pitch: 1.57 }, { m: 'box:.08:.12:.22', o: [0, -.02, -.3], col: [90, 60, 40] }] };
MOM.shells = { h: .2, parts: [{ m: 'box:.28:.14:.18', o: [0, 0, 0], col: [70, 70, 70] }, { m: 'box:.29:.04:.19', o: [0, .1, 0], col: [200, 40, 30] }] };
MOM.film = { h: .2, parts: [{ m: 'cyl:.26:.06:14', o: [0, 0, 0], col: [150, 150, 156] }, { m: 'cyl:.08:.065:8', o: [0, .001, 0], col: [30, 30, 30] }] };
MOM.audience = [MOM.drifter, MOM.drifterCoat, MOM.drifterRed, personModel({ top: '#4a4a4a', bottom: '#2a2a2a', skin: '#9a9a9a', hair: '#5a5a5a', hairStyle: 'big' }), personModel({ top: '#8a8a8a', bottom: '#3a3a3a', skin: '#b8b8b8', hair: '#1a1a1a', glasses: 1 })];
Object.assign(SFX, {
  shotgun: () => { noise(.5, { lp: 1800, vol: .9, rate: .75 }); tone(60, .35, { slide: .35, vol: .6, type: 'square' }); noise(1.2, { lp: 500, vol: .22, at: AC.currentTime + .1 }); },
  projector: () => { for (let i = 0; i < 12; i++) noise(.02, { hp: 1500, vol: .18, at: AC.currentTime + i * .07 }); tone(120, .9, { vol: .05, type: 'sawtooth' }); },
  valve: () => { tone(90, .5, { slide: 1.4, vol: .2, type: 'sawtooth' }); noise(.6, { hp: 2400, vol: .16 }); },
  hiss: () => noise(1.4, { hp: 3000, vol: .22, rate: .8 }),
  dial: () => note(3200, .015, 'pluck', AC.currentTime, sfxBus),
});
Object.assign(TRACKS, {
  mo_upper: cgen({ bpm: 58, prog: [cEm, cC, cAm, ['B', 'M']], lead: [CT.sparse, CT.long, CT.sparse, CT.low], leadIns: 'vibes', leadVol: .14, arp: false, bass: CB.slow, bassVol: .34, drums: false }),
  mo_theater: cgen({ bpm: 96, prog: [cAm, cF, cC, cE], lead: [CT.long, CT.turn, CT.long, CT.answer], leadIns: 'epiano', leadVol: .26, arp: CA.roll, arpIns: 'bell', arpVol: .16, bass: CB.walk, bassVol: .4, drums: CD.soft, drumVol: .12 }),
  mo_audience: cgen({ bpm: 120, prog: [cAm, cAm, cF, cE], lead: [CT.sync, CT.answer, CT.rise, CT.long], leadIns: 'brass', leadVol: .3, arp: CA.up, arpIns: 'synth', arpVol: .2, bass: CB.pump, bassVol: .55, drums: CD.ind, drumVol: .36 }),
  mo_boiler: cgen({ bpm: 50, prog: [cDm, cA, cDm, cBb], lead: [CT.low, CT.sparse, CT.low, CT.sparse], leadIns: 'bell', leadVol: .1, arp: false, bass: CB.pump, bassVol: .3, drums: false }),
});
