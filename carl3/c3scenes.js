'use strict';
// ================= CARL 3: the places. each scene is geometry + lights + cameras + a walkable floor =================
// units are roughly meters. Carl is 1.16 tall; people are 1.9. the backdrop is rendered once per camera.
const SCENES = {};
const col = (h, k = 1) => { const c = hexRGB(h); return c.map(v => Math.min(255, v * k)); };
function SB(def) { // scene builder
  const b = { objs: [], lights: [], solids: [], walk: [], cams: [], def };
  b.add = (m, p, mat, o = {}) => { b.objs.push(Object.assign({ m, p, mat }, o)); return b; };
  b.ground = (w, d, mat, cx = 0, cz = 0, y = 0) => b.add('plane:' + w + ':' + d, [cx, y, cz], mat);
  b.box = (x, z, w, d, h, mat, o = {}) => { b.add('box:' + w + ':' + h + ':' + d, [x, o.y || 0, z], mat, { r: o.r || 0 }); if (o.solid !== false && !o.y) b.solids.push(solidRect(x, z, w, d, o.r || 0)); return b; };
  b.cyl = (x, z, r, h, mat, o = {}) => { b.add('cyl:' + r + ':' + h + ':' + (o.seg || 10) + (o.r2 !== undefined ? ':' + o.r2 : ''), [x, o.y || 0, z], mat); if (o.solid) b.solids.push([x - r, z - r, x + r, z + r]); return b; };
  b.light = (x, y, z, c, rad, int = 1, glow = 0, gi = .8) => { b.lights.push({ p: [x, y, z], col: c, rad, int, glow, gi }); return b; };
  b.lamp = (x, z, o = {}) => { const h = o.h || 6, c = o.col || [1, .78, .4]; b.cyl(x, z, .09, h, { col: '#58585e' }, { solid: true, seg: 6 }); b.box(x + (o.arm || 0), z, .5, .22, .12, { col: '#303036' }, { y: h, solid: false }); b.light(x + (o.arm || 0), h - .2, z, c, o.rad || 13, o.int || 1.4, o.glow === undefined ? 1.3 : o.glow); return b; };
  b.sign = (x, y, z, w, h, hexc, o = {}) => { b.add('box:' + w + ':' + h + ':.18', [x, y, z], { col: hexc, emis: .95 }, { r: o.r || 0 }); if (o.light !== false) b.light(x, y - .2, z + (o.lz || -1.2), hexRGB(hexc).map(v => v / 255), o.rad || 9, o.int || 1.1, o.glow === undefined ? 1.5 : o.glow); return b; };
  b.truck = (x, z, r, hexc, o = {}) => { const c = Math.cos(r), s = Math.sin(r), L = o.len || 9, off = 1.55 + L / 2;
    b.add('box:2.5:3:2.2', [x, 0.35, z], { col: hexc, shiny: .5 }, { r }); b.add('box:' + L + ':3.4:2.5', [x - off * c, 0.7, z + off * s], { col: o.trailer || '#d8d8d8', shiny: .15 }, { r });
    b.solids.push(solidRect(x, z, 2.6, 2.3, r), solidRect(x - off * c, z + off * s, L, 2.6, r)); return b; };
  b.car = (x, z, r, hexc) => { b.add('box:1.9:.8:4.2', [x, .3, z], { col: hexc, shiny: .7 }, { r }); b.add('box:1.6:.6:2.2', [x, 1.0, z - Math.sin(r) * .1], { col: '#202838', shiny: .9 }, { r }); b.solids.push(solidRect(x, z, 2, 4.2, r)); return b; };
  b.cactus = (x, z, h = 2.6) => { b.cyl(x, z, .28, h, { col: '#3c7a48' }, { solid: true, seg: 7 }); b.cyl(x - .5, z, .16, .9, { col: '#3c7a48' }, { y: h * .45, seg: 6 }); b.cyl(x - .35, z, .09, .5, { col: '#3c7a48' }, { y: h * .36, seg: 6 }); return b; };
  b.pump = (x, z, r = 0) => { b.box(x, z, .7, .5, 1.5, { col: '#c8c8d0', shiny: .4 }, { r }); b.box(x, z, .62, .1, .5, { col: '#ffd040', emis: .8 }, { y: 1.5, solid: false, r }); return b; };
  b.canopy = (x, z, w, d, h, hexc) => { b.box(x, z, w, d, .5, { col: '#e8e8e8' }, { y: h, solid: false }); b.box(x, z - d / 2 - .02, w, .2, .5, { col: hexc, emis: .9 }, { y: h, solid: false }); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([i, j]) => b.cyl(x + i * (w / 2 - .5), z + j * (d / 2 - .5), .22, h, { col: '#d0d0d8' }, { solid: true, seg: 6 })); b.light(x, h - .3, z, [1, 1, .95], w * .9, 1.7, 0); return b; };
  b.cam = (id, pos, look, fov, zone) => { b.cams.push({ id, pos, look, fov, zone }); return b; };
  b.walkRect = (x0, z0, x1, z1) => { b.walk.push([x0, z0, x1, z1]); return b; };
  // tile a big area with fixed cameras that all look north: classic camera cuts
  b.autoCams = (x0, z0, x1, z1, cw = 13, cd = 9, back = 6, ht = 3.5, fov = .95) => { let n = 0; for (let z = z0; z < z1; z += cd) for (let x = x0; x < x1; x += cw) { const cx = x + cw / 2, c1 = z + cd; b.cams.push({ id: 'g' + n++, pos: [cx, ht, z - back], look: [cx, .8, z + cd * .5], fov, zone: [x, z, x + cw, c1] }); } return b; };
  b.fin = () => { const sc = Object.assign({ objs: b.objs, lights: b.lights, solids: b.solids, walk: b.walk, cams: b.cams }, b.def); return sc; };
  return b;
}
function solidRect(x, z, w, d, r) { const c = Math.abs(Math.cos(r)), s = Math.abs(Math.sin(r)), hw = (w * c + d * s) / 2, hd = (w * s + d * c) / 2; return [x - hw, z - hd, x + hw, z + hd]; }
// the live-light for characters standing in a scene
function liveLight(sc, p) {
  const amb = sc.amb || [.3, .3, .4], sun = sc.sun || { dir: [-.3, .8, -.4], col: [.3, .3, .5] }, d = v3.norm(sun.dir);
  let tr = 0, tg = 0, tb = 0;
  for (const L of sc.lights) { const dx = L.p[0] - p[0], dy = L.p[1] - p[1], dz = L.p[2] - p[2], dist = Math.hypot(dx, dy, dz); if (dist < L.rad) { const k = Math.pow(1 - dist / L.rad, 2) * (L.int || 1) * 70; tr += L.col[0] * k; tg += L.col[1] * k; tb += L.col[2] * k; } }
  return { amb: [Math.min(1.35, amb[0] * 2.8 + .36), Math.min(1.35, amb[1] * 2.8 + .36), Math.min(1.35, amb[2] * 2.8 + .44)], dir: d, dcol: sun.col.map(v => v * 1.8), tint: [tr, tg, tb] };
}
// ---- BIG LEON'S TRAVEL PLAZA, overnight. an enormous empty lot ----
(() => {
  const b = SB({ amb: [.3, .27, .42], sun: { dir: [-.4, .8, -.3], col: [.34, .34, .6] }, sky: ['#000014', '#3a1a4c'], stars: 1, moon: { p: [-70, 46, 110], r: 9 }, fog: { col: '#2a1a40', dens: .011 }, music: 'plaza', title: 'BIG LEON\'S TRAVEL PLAZA' });
  b.ground(240, 240, { col: '#a0a0a8', tex: 'asphalt', ts: 5, shiny: .55 }, 0, 20);
  for (let i = -5; i <= 5; i++) b.add('plane:.2:7', [i * 5 + 2.5 - 12, .015, 5], { col: '#e8e8d0', emis: .1 });       // parking lines
  for (let i = -5; i <= 5; i++) b.add('plane:.2:7', [i * 5 + 2.5 - 12, .015, 17], { col: '#e8e8d0', emis: .1 });
  b.add('plane:3:36', [-26, .015, 12], { col: '#e0b838', tex: 'lines', ts: 3 });
  b.box(0, 40, 36, 12, 6, { col: '#c8b898', tex: 'stucco', ts: 4 });                                                         // the plaza building
  b.box(0, 33.8, 34, .4, 1.1, { col: '#7a2a2a' }, { y: 5.2, solid: false });
  b.sign(0, 7.6, 33.4, 12, 2.2, '#ff3068', { rad: 14 }); b.sign(-13, 4.4, 33.4, 3.2, 1.2, '#38e8ff', { rad: 8 }); b.sign(13, 4.4, 33.4, 3.2, 1.2, '#ffd838', { rad: 8 });
  b.box(0, 33.9, 3.4, .3, 3.6, { col: '#a8e8ff', emis: .55, shiny: .3 }, { solid: false });                                    // the glass door
  b.canopy(-16, 14, 18, 7, 4.8, '#ff3068'); [-20, -16, -12].forEach(x => b.pump(x, 14, 0));
  b.truck(10, 18, 0, '#c02828'); b.truck(22, 8, .1, '#2058b0', { trailer: '#e8d8a0' }); b.truck(-4, 22, -.05, '#e0a020', { trailer: '#9ad8a8' });
  b.car(30, 24, .4, '#30a860'); b.car(-26, 26, -.3, '#d8d8d8');
  b.lamp(-6, 8, { h: 7 }); b.lamp(14, 4, { h: 7, col: [.7, .85, 1] }); b.lamp(30, 18, { h: 7 }); b.lamp(-30, 4, { h: 7, col: [.7, .85, 1] }); b.lamp(2, 28, { h: 7 });
  b.cactus(-34, 22); b.cactus(38, 6, 3.4);
  b.walkRect(-40, -2, 44, 31);
  b.autoCams(-40, -2, 46, 20, 18, 11, 10, 9, .95);   // high and far back: the low default stared into truck sides and the plaza wall
  for (let i = 0; i < 5; i++) { const x = -40 + i * 18; b.cam('front' + i, [x + 9, 10, 14], [x + 9, 1, 29], .95, [x, 20, x + 18, 31]); }   // the plaza front, high enough to see over the trucks
  SCENES.plaza_lot = Object.assign(b.fin(), { start: [2, 0, 3], walkName: 'lot',
    drawOver: () => signWords([['BIG LEON\'S', [0, 7.6, 33.2], '#ffe0e8'], ['DINER', [0, 4.2, 33.6], '#e0ffff']]) });
})();
// ---- THE A.S.S., from inside. home between stops ----
(() => {
  const b = SB({ amb: [.34, .36, .46], sun: { dir: [.2, 1, -.4], col: [.3, .32, .4] }, sky: ['#000014', '#101030'], fog: { col: '#0a0a20', dens: .004 }, music: 'ship', title: 'THE A.S.S.' });
  const M = { col: '#8890a0', tex: 'metal', ts: 3, shiny: .35 }, MD = { col: '#505868', tex: 'metal', ts: 3 };
  b.ground(16, 12, { col: '#606878', tex: 'metal', ts: 2, shiny: .5 }, 0, 5);
  b.box(0, 11.2, 16, .6, 4, MD); b.box(-8.2, 5, .6, 12, 4, MD); b.box(8.2, 5, .6, 12, 4, MD);
  b.box(0, 11, 9, .3, 2.2, { col: '#0a1a3a', emis: .5, shiny: .6 }, { y: 1.4, solid: false });                         // the big window
  for (let i = -3; i <= 3; i++) b.add('box:.1:.1:.1', [i * 1.2, 2.2 + (i & 1) * .5, 10.8], { col: '#ffffff', emis: 1 });
  b.box(0, 9.4, 7, 1.4, 1, { col: '#383e50', tex: 'metal', ts: 2 }); b.box(-2.2, 9.1, 1.5, .5, .5, { col: '#101820', emis: .5 }, { y: 1, solid: false }); b.box(2.2, 9.1, 1.5, .5, .5, { col: '#40ff90', emis: .8 }, { y: 1, solid: false });
  b.box(0, 7.2, 1.3, 1.1, 1.2, { col: '#b04040', shiny: .4 }); b.box(0, 6.7, 1.1, .3, 1.8, { col: '#b04040' }, { solid: false });         // pilot seat
  b.box(-5.8, 8.6, 1.2, .7, .9, { col: '#2a4a2a' }, {}); b.box(-5.8, 8.6, .9, .1, .4, { col: '#60ff60', emis: 1 }, { y: .95, solid: false });  // the radio
  b.box(-6.6, 3.4, 2.4, 3.8, 1, { col: '#6a4a3a', tex: 'carpet', ts: 2 }); b.box(-6.6, 3.4, 2.1, 3.5, .4, { col: '#e8e8d8' }, { y: 1, solid: false });  // bunk
  b.box(6.4, 7.4, 2, 2.6, 2.6, { col: '#242a38', shiny: .3 }); b.box(6.4, 6.0, 1.7, .15, 1.2, { col: '#40d8ff', emis: .9 }, { y: 1.1, solid: false });       // chat monitor
  b.lights.push({ p: [0, 3.6, 3], col: [1, .95, .9], rad: 14, int: 1.3 }, { p: [-3, 3, 8], col: [.4, 1, .6], rad: 7, int: 1.2, glow: 1 }, { p: [6.4, 2.4, 6], col: [.3, .8, 1], rad: 6, int: 1.2, glow: 1.2 }, { p: [-6.6, 3, 3], col: [1, .8, .5], rad: 6, int: 1 });
  b.walkRect(-7, 0.6, 7.2, 10.4);
  b.cam('ship', [0, 7.4, -5.2], [0, .6, 5.6], 1.05, [-20, -20, 20, 20]);
  SCENES.ship = Object.assign(b.fin(), { start: [0, 0, 2.4] });
})();
