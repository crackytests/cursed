'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. the Meridian Continuity Center, room by room =================
// units are meters. every room is closed on four sides; cameras sit inside, high in a corner. JB is 1.65 tall.
const MAT = {
  wall: { col: '#a8a8a2', tex: 'stucco', ts: 3 }, wallD: { col: '#7a7a76', tex: 'stucco', ts: 3 }, tile: { col: '#b8b8b8', tex: 'tile', ts: 2, shiny: .35 }, lino: { col: '#8a8a86', tex: 'concrete', ts: 3, shiny: .25 },
  carpet: { col: '#7a6a6a', tex: 'carpet', ts: 2 }, wood: { col: '#9a7a5a', tex: 'wood', ts: 2, shiny: .15 }, metal: { col: '#9a9aa0', tex: 'metal', ts: 2, shiny: .45 }, dark: { col: '#3a3a3c' },
  ceil: { col: '#6a6a68', tex: 'concrete', ts: 4 }, conc: { col: '#8a8a88', tex: 'concrete', ts: 3 }, glass: { col: '#3a4450', shiny: .9, emis: .12 }, paper: { col: '#e8e4d8' },
};
// floor, four walls, a ceiling, and the floor is walkable
function room4(b, x0, z0, x1, z1, h, wall, floor, ceil = MAT.ceil) {
  const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  b.ground(w, d, floor, cx, cz);
  b.box(cx, z1 + .15, w + .6, .3, h, wall); b.box(cx, z0 - .15, w + .6, .3, h, wall); b.box(x0 - .15, cz, .3, d, h, wall); b.box(x1 + .15, cz, .3, d, h, wall);
  b.add('plane:' + w + ':' + d, [cx, h, cz], ceil);
  b.box(cx, z1 - .03, w, .06, .14, { col: '#3a3a38' }, { solid: false }); // baseboard
  b.walkRect(x0, z0, x1, z1); return b;
}
// a door in a wall. face: which wall it's on (n, s, e, w). kind: wood, metal, glass, double, lift
function doorG(b, x, z, face, kind = 'wood') {
  const ew = face === 'e' || face === 'w', r = ew ? Math.PI / 2 : 0, wd = kind === 'double' || kind === 'glass' ? 2.2 : kind === 'lift' ? 1.9 : 1.1;
  const m = kind === 'metal' || kind === 'lift' ? { col: '#7a7a80', tex: 'metal', ts: 2, shiny: .5 } : kind === 'glass' ? MAT.glass : { col: '#5a4434', tex: 'wood', ts: 2, shiny: .2 };
  b.add('box:' + (wd + .3) + ':2.55:.14', [x, 0, z], { col: '#2a2826' }, { r });
  b.add('box:' + wd + ':2.4:.18', [x, 0, z], m, { r });
  if (kind === 'double' || kind === 'lift') b.add('box:.04:2.4:.2', [x, 0, z], { col: '#1a1a1a' }, { r });
  else if (kind !== 'glass') { const k = ew ? [0, 1, wd * .36] : [wd * .36, 1, 0]; b.add('box:.08:.08:.24', [x + (ew ? 0 : k[0]), 1.05, z + (ew ? k[2] : 0)], { col: '#c8b070', shiny: .8 }, { r }); }
  return b;
}
// a fluorescent tube in the ceiling, and its light
function tube(b, x, z, h, len = 1.4, c = [.85, .9, 1], rad = 7, int = 1) { b.add('box:' + len + ':.06:.2', [x, h - .06, z], { col: '#f0f0f0', emis: 1, tube: 1 }); b.light(x, h - .4, z, c, rad, int); return b; }
const lightKeep = (b) => { b.lights[b.lights.length - 1].keep = 1; return b; };
function blinds(b, x, z, w, y0, hgt, face = 'n') { const r = face === 'e' || face === 'w' ? Math.PI / 2 : 0; b.add('box:' + w + ':' + hgt + ':.06', [x, y0, z], { col: '#9aa4b0', emis: .35 }, { r }); for (let j = 0; j < hgt / .22; j++) b.add('box:' + (w + .1) + ':.05:.1', [x, y0 + .1 + j * .22, z], { col: '#2a2a2a' }, { r }); return b; }
const MOROOM = {};
function defRoom(id, def, build, extra) { const b = SB(Object.assign({ fog: { col: '#08080a', dens: .012 }, sky: ['#000000', '#08080a'] }, def)); build(b); SCENES[id] = Object.assign(b.fin(), extra); MOROOM[id] = SCENES[id]; }
// ---------------- FRONT STEPS: rain, the car, the building ----------------
defRoom('steps', { amb: [.16, .16, .19], sun: { dir: [-.3, .8, -.5], col: [.12, .12, .16] }, sky: ['#030306', '#14141c'], fog: { col: '#0c0c10', dens: .035 }, music: 'mo_rain', title: 'FRONT STEPS' }, b => {
  b.ground(30, 26, { col: '#5a5a60', tex: 'asphalt', ts: 4, shiny: .7 }, 0, 6);
  b.box(0, 13.2, 26, 2.4, 8.5, { col: '#8a8a86', tex: 'concrete', ts: 4 });
  for (const x of [-9, -5, 5, 9]) for (const y of [3.2, 5.6]) b.add('box:1.6:1.4:.1', [x, y, 11.95], { col: '#1a1c20', shiny: .8 });
  doorG(b, 0, 11.95, 's', 'glass'); b.add('box:6:.18:2.2', [0, 3.0, 11], { col: '#5a5a58' });
  b.add('box:6:.14:1.6', [0, 0, 11.2], MAT.conc); b.add('box:5:.14:1', [0, .14, 11.45], MAT.conc);
  b.sign(0, 5.0, 11.95, 7.4, .9, '#c81c1c', { rad: 11, int: 1.1, lz: -1.4 }); lightKeep(b);
  b.lamp(-4.5, 10.4, { h: 4.2, col: [1, .62, .3], rad: 9, int: 1.4 }); b.lamp(6.5, 3, { h: 5, col: [.6, .62, .7], rad: 10, int: 1 });
  b.car(-5.2, 4.2, .25, '#30302e');
  b.cyl(5.2, 9.2, .22, 1.1, { col: '#3a3a3c' }, { solid: true, seg: 8 }); b.box(5.2, 9.2, .5, .35, .3, { col: '#4a4a4c' }, { y: 1.1, solid: false });
  for (const x of [-10.5, 10.5]) b.box(x, 6, 1.2, 12, 1.4, { col: '#3a4038', tex: 'carpet', ts: 2 });
  b.walkRect(-9.4, .4, 9.4, 10.6);
  b.cam('street', [12, 3.4, -5], [3.5, 0.5, 2.25], 1.4, [-20, -20, 20, 7]);
  b.cam('door', [7.8, 2.8, 0], [2.3, 0.5, 9.25], 1.6, [-20, 7, 20, 30]);
}, { start: [-3.4, 0, 6.2], map: [[140, 152, 40, 12]], floor: 1, rain: 1 });
// ---------------- MAIN LOBBY ----------------
defRoom('lobby', { amb: [.12, .12, .14], sun: { dir: [.2, 1, -.3], col: [.1, .1, .12] }, music: 'mo_hall', title: 'MAIN LOBBY' }, b => {
  room4(b, -9, 0, 9, 14, 5, MAT.wall, { col: '#a0a0a0', tex: 'tile', ts: 3, shiny: .5 });
  b.box(0, 8.6, 5, 1.2, 1.1, MAT.wood); b.box(0, 8.6, 5.2, 1.4, .08, { col: '#4a3a2a', shiny: .6 }, { y: 1.1, solid: false });
  b.box(-1, 8.5, .55, .4, .05, MAT.paper, { y: 1.18, solid: false }); b.cyl(1.6, 8.6, .12, .45, { col: '#2a3a2a' }, { y: 1.18 }); b.light(1.6, 1.9, 8.4, [1, .6, .28], 4.5, 1.2, .5); lightKeep(b);
  b.box(-5.5, 13.95, 1.3, .1, .9, { col: '#b08a40', shiny: .7 }, { y: 1.3, solid: false });
  b.sign(0, 3.9, 13.85, 5.6, .6, '#d01818', { rad: 9, int: 1, lz: -1.8 }); lightKeep(b);
  doorG(b, 0, 14, 'n', 'double'); doorG(b, 5.6, 14, 'n', 'lift'); b.add('box:.5:.7:.1', [7.3, 1.1, 13.92], { col: '#202020' }); for (let i = 0; i < 3; i++) b.add('box:.3:.05:.04', [7.3, 1.25 + i * .18, 13.86], { col: '#c01818', emis: .9 });
  b.add('box:.5:.2:.1', [5.6, 2.8, 13.9], { col: '#c01818', emis: .9 });
  doorG(b, -9, 5, 'w', 'metal'); doorG(b, 9, 5, 'e', 'metal'); doorG(b, 9, 11.2, 'e', 'wood'); b.add('box:.06:.3:.9', [8.92, 2.75, 11.2], { col: '#1a1a1a', emis: .2 }); doorG(b, 0, 0, 's', 'glass'); doorG(b, -5.5, 0, 's', 'wood');
  b.box(-8.95, 10, .1, 2, 1.3, { col: '#1e1e20' }, { y: 1.2, solid: false }); b.add('box:.12:1.1:1.8', [-8.92, 1.3, 10], { col: '#d8d8d8', emis: .15 });
  for (const [x, z] of [[-6.4, 11], [6.4, 11]]) b.cyl(x, z, .42, 5, { col: '#b8b8b4', tex: 'stucco', ts: 2 }, { solid: true, seg: 12 });
  b.box(-7.6, 2.2, .8, 2.4, .5, MAT.wood); b.box(7.6, 2.2, .8, 2.4, .5, MAT.wood);
  b.cyl(-8, 12.8, .45, .7, { col: '#4a4a44' }, { solid: true }); b.add('sphere:.6:7:5', [-8, 1.1, 12.8], { col: '#3a4a34' });
  b.light(0, 4.4, 6, [.75, .8, .9], 13, .9, 1.0); b.light(-6, 4, 3, [.6, .64, .7], 7, .6);
}, { start: [0, 0, 1.2], map: [[130, 108, 60, 40]], floor: 1 });
SCENES.lobby.cams.push({ id: 'se', pos: [7.8, 4.5, 0.5], look: [-9.5, -0.5, 10], fov: 1.32, zone: [-20, -20, 0, 30] }, { id: 'sw', pos: [-7.8, 4.5, 0.5], look: [-1.5, 1, 4], fov: 1.32, zone: [0, -20, 20, 30] });
// ---------------- STAFF LOUNGE: a safe room ----------------
defRoom('lounge', { amb: [.16, .14, .12], sun: { dir: [.2, 1, .3], col: [.1, .09, .08] }, music: 'mo_safe', title: 'STAFF LOUNGE', safe: 1 }, b => {
  room4(b, -4, 0, 4, 7, 3, MAT.wallD, MAT.carpet);
  doorG(b, 0, 7, 'n', 'wood'); doorG(b, -4, 3, 'w', 'metal');
  b.add('box:.04:.7:.6', [-3.96, 1.25, 4], MAT.paper);
  b.add('box:.05:.08:.6', [-3.93, 1.86, 4], { col: '#8a1a14' });
  b.box(-3.4, 5, 1.1, 1.6, .8, MAT.wood); b.add('box:.6:.5:.5', [-3.4, .8, 5], { col: '#2a2a2a' }); b.add('box:.05:.36:.44', [-3.1, .88, 5], { col: '#e07820', emis: .8 }, {}); b.light(-2.8, 1.3, 5, [1, .5, .15], 3, 1, .6); lightKeep(b);
  b.box(3.55, 5.2, .8, 1.4, 2.2, { col: '#6a6a70', tex: 'metal', ts: 2, shiny: .4 }); for (let i = 0; i < 3; i++) b.add('box:.04:.08:.3', [3.12, 1.6 - i * .5, 5.2], { col: '#1a1a1a' });
  b.box(3.4, 2, .9, 3, 1, MAT.wood); b.add('box:.5:.3:.4', [3.4, 1, 1.3], { col: '#d0d0d0', shiny: .4 }); b.add('box:.06:.2:.25', [3.12, 1.05, 1.3], { col: '#1a1a1a', emis: .05 });
  b.add('box:.35:.5:.35', [3.4, 1, 2.7], { col: '#2a2a2a', shiny: .4 }); b.add('box:.1:.1:.04', [3.21, 1.3, 2.7], { col: '#c01818', emis: .9 });
  b.box(-3.2, 1.3, 1, .7, .7, MAT.wood); b.add('box:.9:.65:.6', [-3.2, .7, 1.3], { col: '#202020' }); b.add('box:.04:.5:.7', [-2.88, .78, 1.3], { col: '#2a3036', emis: .12 }); b.add('box:.7:.1:.4', [-3.2, .55, 1.3], { col: '#3a3a3a' });
  b.box(0, .7, 3, .9, .45, { col: '#5a3a30', tex: 'carpet', ts: 1 }); b.box(0, .3, 3, .3, 1, { col: '#5a3a30', tex: 'carpet', ts: 1 }, { solid: false });
  b.cyl(.4, 3.6, .7, .72, MAT.wood, { solid: true, seg: 12 });
  b.light(0, 2.6, 3.6, [1, .66, .36], 8, 1.2, .8); lightKeep(b);
}, { start: [0, 0, 6.2], map: [[100, 134, 28, 20]], floor: 1 });
SCENES.lounge.cams.push({ id: 'se', pos: [3.5, 2.6, 0.45], look: [-1.85, 0.8, 3.5], fov: 1.25, zone: [-14, -10, 0, 17] }, { id: 'nw', pos: [-3.5, 2.6, 6.6], look: [1.8, 0.4, 3.725], fov: 1.32, zone: [0, -10, 14, 17] });
// ---------------- TUESDAY WARD: intake. an L of a corridor ----------------
defRoom('tue_hall', { amb: [.08, .08, .1], sun: { dir: [0, 1, 0], col: [.06, .06, .07] }, music: 'mo_hall', title: 'TUESDAY WARD - INTAKE', flicker: 1 }, b => {
  const h = 3.2;
  b.ground(16, 3, MAT.lino, -8, 1.5); b.ground(3.5, 12, MAT.lino, -14.25, 9);
  b.box(-8, -.15, 16.6, .3, h, MAT.wall); b.box(-6.25, 3.15, 12.5, .3, h, MAT.wall); b.box(.15, 1.5, .3, 3, h, MAT.wall);
  b.box(-16.15, 7.5, .3, 15.6, h, MAT.wall); b.box(-12.35, 9.15, .3, 12.3, h, MAT.wall); b.box(-14.25, 15.15, 4.1, .3, h, MAT.wall);
  b.add('plane:16:3', [-8, h, 1.5], MAT.ceil); b.add('plane:3.5:12', [-14.25, h, 9], MAT.ceil);
  doorG(b, 0, 1.5, 'e', 'metal'); doorG(b, -7, 3, 'n', 'wood'); doorG(b, -14.25, 15, 'n', 'wood');
  for (const x of [-3.5, -10.5]) blinds(b, x, .02, 2.2, .9, 1.4);
  b.box(-4, 2.6, 1.8, .5, .45, MAT.wood); b.box(-15.5, 7.5, .6, 2, .9, { col: '#c8c8c8', shiny: .5 }); b.box(-13, 11, .5, .5, 1.6, { col: '#5a5a5a', tex: 'metal' });
  tube(b, -3, 1.5, h, 1.4, [.8, .85, .95], 6, .9); tube(b, -11, 1.5, h, 1.4, [.8, .85, .95], 6, .7); tube(b, -14.25, 8, h, 1.4, [.8, .85, .95], 6, .8); tube(b, -14.25, 13, h);
  b.walkRect(-16, 0, 0, 3); b.walkRect(-16, 0, -12.5, 15);
}, { start: [-1, 0, 1.5], map: [[44, 112, 86, 10], [44, 70, 14, 52]], floor: 1 });
SCENES.tue_hall.cams.push({ id: 'a1', pos: [-12, 2.7, 0.4], look: [-4.5, 0, 2.5], fov: 1.05, zone: [-8, -5, 5, 5] }, { id: 'corner', pos: [-4, 2.8, 0.4], look: [-13, 0, 2], fov: 1.15, zone: [-20, -5, -8, 3] }, { id: 'north', pos: [-12.8, 2.8, 14.6], look: [-15.2, 0, 6.425], fov: 1.32, zone: [-20, 3, -5, 8] }, { id: 'far', pos: [-15.7, 2.8, 0.4], look: [-14, 0, 11], fov: 1.32, zone: [-20, 8, -5, 20] });
// ---------------- INTAKE OFFICE: Otis lived here ----------------
defRoom('intake', { amb: [.12, .11, .1], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_hall', title: 'INTAKE OFFICE' }, b => {
  room4(b, -4.5, 0, 4.5, 7, 3, MAT.wallD, MAT.carpet);
  doorG(b, 0, 0, 's', 'wood'); blinds(b, 0, 6.98, 2.4, 1, 1.3);
  b.box(0, 5, 2.4, 1, .78, MAT.wood); b.add('box:.5:.2:.4', [-.5, .78, 4.9], { col: '#2a2a2a' }); b.add('box:.4:.02:.3', [.6, .78, 5], MAT.paper); b.cyl(1, 5.2, .1, .4, { col: '#3a3a3a' }, { y: .78 });
  b.light(1, 1.4, 5.1, [1, .6, .28], 5, 1.3, .5); lightKeep(b);
  b.box(-3.6, 3.4, .9, 2.2, .45, { col: '#6a6a60', tex: 'carpet', ts: 1 }); b.add('box:.6:.12:.4', [-3.6, .45, 2.6], { col: '#d8d8d0' });
  for (const z of [4.6, 5.5, 6.4]) b.box(3.95, z, .8, .8, 1.3, { col: '#7a7a7a', tex: 'metal' });
  b.box(3.9, 1.4, .7, .7, .9, { col: '#d8d8d4', shiny: .4 });
  b.box(-2, 6.6, 1.2, .5, .9, MAT.wood); b.add('box:.4:.5:.06', [-2.3, .9, 6.6], { col: '#1a1a1a' });
  tube(b, 0, 3, 3, 1.4, [.8, .85, .9], 6, .5);
}, { start: [0, 0, .9], map: [[30, 52, 34, 22]], floor: 1 });
SCENES.intake.cams.push({ id: 'office', pos: [3.9, 2.6, 0.4], look: [-2.2, 0.2, 4.425], fov: 1.4, zone: [-14.5, -10, 0, 17] }, { id: 'nw', pos: [-4, 2.6, 6.6], look: [3.05, 0.2, 2.425], fov: 1.32, zone: [0, -10, 14.5, 17] });
// ---------------- CONSULTATION ROOM ----------------
defRoom('consult', { amb: [.12, .12, .13], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_hall', title: 'CONSULTATION ROOM' }, b => {
  room4(b, -3.5, 0, 3.5, 6, 3, MAT.wall, MAT.carpet);
  doorG(b, 0, 0, 's', 'wood'); b.add('box:.3:.4:.08', [.9, 1, -.05], { col: '#1a1a1a' });
  b.add('box:3.2:1.4:.08', [0, 1, 5.97], { col: '#2a3440', shiny: .9, emis: .18 }); b.add('box:.6:1.2:.5', [.8, 0, 6.6], { col: '#2a2a2a' });
  b.box(-1.3, 3.2, .9, .9, .5, { col: '#4a4a4a', tex: 'carpet', ts: 1 }); b.box(-1.3, 3.6, .9, .2, 1, { col: '#4a4a4a', tex: 'carpet', ts: 1 }, { solid: false });
  b.box(1.3, 3.2, .9, .9, .5, { col: '#4a4a4a', tex: 'carpet', ts: 1 }); b.box(1.3, 2.8, .9, .2, 1, { col: '#4a4a4a', tex: 'carpet', ts: 1 }, { solid: false });
  b.box(0, 3.2, .8, .6, .5, MAT.wood); b.add('box:.45:.14:.3', [0, .5, 3.2], { col: '#2a2a2a' }); b.add('cyl:.09:.02:10', [-.1, .64, 3.2], { col: '#9a9a9a' }); b.add('cyl:.09:.02:10', [.12, .64, 3.2], { col: '#9a9a9a' });
  b.add('box:.06:.06:.3', [3.45, 1.6, 4.4], { col: '#3a3a3a' }, { r: Math.PI / 2 });
  b.light(0, 2.7, 3, [.9, .9, .95], 7, .9, .4); b.light(0, 1.6, 6.3, [.5, .55, .6], 3, .6);
}, { start: [0, 0, .9], map: [[70, 84, 28, 18]], floor: 1 });
SCENES.consult.cams.push({ id: 'c', pos: [-3.1, 2.5, 0.4], look: [1.55, 0, 2.925], fov: 1.4, zone: [0, -10, 13.5, 16] }, { id: 'reverse', pos: [3.1, 2.5, 5.6], look: [-2.7, -0.2, 2.225], fov: 1.4, zone: [-13.5, -10, 0, 16] });
// ---------------- THURSDAY WARD: the stacks. dark until the generator runs ----------------
defRoom('thu_hall', { amb: [.08, .08, .09], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_dark', title: 'THURSDAY WARD - STACKS', flicker: 1 }, b => {
  room4(b, 0, 0, 20, 3.6, 3.2, MAT.wallD, MAT.lino);
  doorG(b, 0, 1.8, 'w', 'metal'); doorG(b, 8, 3.6, 'n', 'metal'); doorG(b, 20, 1.8, 'e', 'metal');
  b.add('cyl:.14:20:8', [0, 2.8, 3.3], { col: '#6a6a6a', shiny: .4 }, { r: Math.PI / 2, pitch: Math.PI / 2 }); b.add('cyl:.09:20:8', [0, 2.5, 3.35], { col: '#7a5a3a' }, { r: Math.PI / 2, pitch: Math.PI / 2 });
  for (const x of [3.5, 13, 16.5]) b.box(x, 3.1, 1.2, .6, 1, { col: '#5a4a3a', tex: 'wood' });
  b.box(11, .4, 1, .6, .8, { col: '#6a6a6a', tex: 'metal' });
  b.add('box:.8:.3:.06', [19.9, 2.6, 1.8], { col: '#c81818', emis: 1 }, { r: Math.PI / 2 }); b.light(19.5, 2.4, 1.8, [1, .12, .08], 4, 1.2, .6); lightKeep(b);
  for (const x of [3, 8, 13, 18]) tube(b, x, 1.8, 3.2, 1.4, [.8, .85, .95], 6, .9);
}, { start: [1, 0, 1.8], map: [[192, 122, 62, 10]], floor: 1 });
SCENES.thu_hall.cams.push({ id: 'w', pos: [0.45, 2.8, 0.35], look: [13.55, 0, 2.8], fov: 1.15, zone: [9.5, -5, 30, 9] }, { id: 'e', pos: [19.55, 2.8, 0.35], look: [5.8, 0, 2.8], fov: 1.15, zone: [-5, -5, 9.5, 9] });
// ---------------- TAPE ARCHIVE ----------------
defRoom('archive', { amb: [.08, .08, .09], sun: { dir: [0, 1, 0], col: [.05, .05, .06] }, music: 'mo_dark', title: 'TAPE ARCHIVE' }, b => {
  room4(b, -6, 0, 6, 10, 3.6, MAT.wallD, MAT.lino);
  doorG(b, 0, 0, 's', 'metal');
  for (const x of [-4.2, -1.4, 1.4, 4.2]) { b.box(x, 6, .9, 6, 2.6, { col: '#6a6a6e', tex: 'metal', ts: 2 }); for (let j = 0; j < 5; j++) for (let k = 0; k < 2; k++) b.add('box:.95:.04:6.02', [x, .3 + j * .55, 6], { col: k ? '#1a1a1a' : '#4a4a4c' }); }
  for (let j = 0; j < 4; j++) b.add('box:.92:.3:5.6', [-4.2, .4 + j * .55, 6], { col: '#2a2a2a', tex: 'grid', ts: .5 }); for (let j = 0; j < 4; j++) b.add('box:.92:.3:5.6', [1.4, .4 + j * .55, 6], { col: '#3a3a3a', tex: 'grid', ts: .5 });
  b.add('box:.12:.3:.4', [-1.4, 1.45, 8.4], { col: '#c81818', emis: .7 });
  b.box(-4.6, 1.2, 1.4, .7, 1.2, MAT.wood); for (let i = 0; i < 6; i++) b.add('box:.18:.12:.04', [-5.1 + (i % 3) * .5, .35 + (i >> 1 & 1) * .4 + (i > 2 ? .2 : 0), .83], { col: '#c8b070', shiny: .6 });
  b.box(5.3, 8.2, .8, 1.2, .9, { col: '#5a5a5a', tex: 'metal' });
  b.add('box:.4:.5:.03', [1.4, 1.2, 2.97], MAT.paper);
  tube(b, -2.8, 3, 3.6, 1.4, [.8, .85, .95], 7, .9); tube(b, 2.8, 6, 3.6, 1.4, [.8, .85, .95], 7, .9); tube(b, -2.8, 8.5, 3.6);
}, { start: [0, 0, .9], map: [[198, 88, 38, 30]], floor: 1 });
SCENES.archive.cams.push(
  { id: 'door', pos: [5.6, 3.3, 2.5], look: [-3, 0, 1], fov: 1.4, zone: [-20, -5, 0, 2.8] },
  { id: 'back', pos: [-5.6, 3.3, 2.5], look: [3, 0, 1], fov: 1.4, zone: [0, -5, 20, 2.8] },
  { id: 'aisle0', pos: [-5.35, 3.3, 0.4], look: [-5.35, 0, 5.5], fov: 1.6, zone: [-20, 2.8, -4.2, 9.2] },
  { id: 'aisle1', pos: [-2.8, 3.3, 0.4], look: [-2.8, 0, 5.5], fov: 1.6, zone: [-4.2, 2.8, -1.4, 9.2] },
  { id: 'aisle2', pos: [0, 3.3, 0.4], look: [0, 0, 5.5], fov: 1.6, zone: [-1.4, 2.8, 1.4, 9.2] },
  { id: 'aisle3', pos: [2.8, 3.3, 0.4], look: [2.8, 0, 5.5], fov: 1.6, zone: [1.4, 2.8, 4.2, 9.2] },
  { id: 'aisle4', pos: [5.35, 3.3, 0.4], look: [5.35, 0, 5.5], fov: 1.6, zone: [4.2, 2.8, 20, 9.2] },
  { id: 'rearW', pos: [5.6, 3.3, 9.6], look: [-3, 0, 9.45], fov: 1.4, zone: [-20, 9.2, 0, 20] },
  { id: 'rearE', pos: [-5.6, 3.3, 9.6], look: [3, 0, 9.45], fov: 1.4, zone: [0, 9.2, 20, 20] }
);
// ---------------- GENERATOR ROOM ----------------
defRoom('generator', { amb: [.09, .09, .1], sun: { dir: [0, 1, 0], col: [.05, .05, .05] }, music: 'mo_dark', title: 'GENERATOR ROOM' }, b => {
  room4(b, -4.5, 0, 4.5, 8, 4, MAT.wallD, MAT.conc);
  doorG(b, -4.5, 2, 'w', 'metal');
  b.add('cyl:1.3:4:14', [-1.8, 1.4, 5.6], { col: '#6a6a60', tex: 'metal', ts: 2, shiny: .4 }, { r: Math.PI / 2, pitch: Math.PI / 2 }); b.solids.push([-2, 4.2, 2.2, 7]);
  b.add('box:4.4:.3:3', [0, 0, 5.6], { col: '#3a3a3a' }); b.add('cyl:.3:2.4:8', [2.6, 1.6, 6.6], { col: '#5a5a5a' });
  b.solids.push([4.25, 3.1, 4.45, 4.9]);
  b.box(4.35, 4, .2, 1.8, 1.6, { col: '#4a4a50', tex: 'metal' }, { y: .8 }); b.add('box:.06:.7:.4', [4.24, 1.1, 2.6], { col: '#2a2a2a' });
  b.add('box:.1:.3:.4', [4.3, 2.6, 4], { col: '#d0c060', emis: .4 });
  b.add('box:.6:.1:.6', [-3, 3.9, 1], { col: '#c81818', emis: .3 }); b.light(-3, 3.5, 1, [1, .1, .05], 4, 1); lightKeep(b);
  tube(b, 0, 2, 4, 1.4, [.8, .85, .95], 8, 1); tube(b, 0, 6.5, 4);
}, { start: [-3.6, 0, 2], map: [[256, 112, 28, 26]], floor: 1 });
SCENES.generator.cams.push(
  { id: 'g', pos: [-4, 3.5, 3.7], look: [2, 0, 1.5], fov: 1.4, zone: [0, -10, 15, 4] },
  { id: 'reverse', pos: [4.1, 3.5, 3.7], look: [-2, 0, 1.5], fov: 1.4, zone: [-15, -10, 0, 4] },
  { id: 'left', pos: [-4, 3.5, 0.4], look: [-3.3, 0, 5.5], fov: 1.6, zone: [-15, 4, 0, 7.2] },
  { id: 'right', pos: [4.1, 3.5, 0.4], look: [3.3, 0, 5.5], fov: 1.6, zone: [0, 4, 15, 7.2] },
  { id: 'rearW', pos: [4.1, 3.5, 7.6], look: [-2, 0, 7.4], fov: 1.4, zone: [-15, 7.2, 0, 20] },
  { id: 'rearE', pos: [-4, 3.5, 7.6], look: [2, 0, 7.4], fov: 1.4, zone: [0, 7.2, 15, 20] }
);
// ---------------- FRIDAY WARD: the gallery over the fidelity suites ----------------
defRoom('fri_hall', { amb: [.1, .1, .12], sun: { dir: [0, 1, 0], col: [.07, .07, .08] }, music: 'mo_hall', title: 'FRIDAY WARD - FIDELITY' }, b => {
  room4(b, -12, 0, 12, 5, 3.4, MAT.wall, { col: '#8a8a8a', tex: 'tile', ts: 2, shiny: .4 });
  doorG(b, -8, 5, 'n', 'wood'); doorG(b, 0, 5, 'n', 'wood'); doorG(b, 8, 5, 'n', 'wood'); doorG(b, -12, 2.5, 'w', 'metal'); doorG(b, 0, 0, 's', 'double');
  for (const x of [-4, 4]) { b.add('box:3:1.4:.08', [x, 1, 4.98], { col: '#262c34', shiny: .9, emis: .2 }); b.light(x, 1.6, 5.8, [.7, .7, .8], 3, .7); }
  b.add('box:.7:.5:.14', [2, 1, 4.87], { col: '#5a5a60', tex: 'metal' }); b.add('box:.48:.24:.04', [2, 1, 4.78], { col: '#1a1a1a' }); b.add('box:.08:.08:.04', [2, 1.08, 4.74], { col: '#c81818', emis: .6 });
  for (const x of [-8, 0, 8]) b.add('box:.9:.3:.06', [x, 2.75, 4.95], { col: '#1a1a1a', emis: .2 });
  b.box(-4, .5, 2, .5, .45, MAT.wood); b.box(6, .5, 2, .5, .45, MAT.wood);
  b.cyl(-11.2, 4.4, .35, .6, { col: '#4a4a44' }, { solid: true }); b.add('cyl:.05:1:5', [-11.2, .6, 4.4], { col: '#3a3a30' });
  for (const x of [-9, -3, 3, 9]) tube(b, x, 2.5, 3.4, 1.4, [.8, .82, .9], 7, .8);
}, { start: [0, 0, .9], map: [[106, 72, 104, 14]], floor: 1 });
SCENES.fri_hall.cams.push({ id: 'w', pos: [-0.5, 3, 0.4], look: [-6.5, 0.8, 2.5], fov: 1.32, zone: [-20, -5, -4, 9] }, { id: 'm', pos: [-7, 2.8, 0.4], look: [-1.075, 0, 3.425], fov: 1.32, zone: [-4, -5, 4, 9] }, { id: 'e', pos: [0.5, 3, 0.4], look: [7.5, 0, 3.5], fov: 1.4, zone: [4, -5, 20, 9] });
// ---------------- FIDELITY CONTROL ----------------
defRoom('control', { amb: [.1, .1, .12], sun: { dir: [0, 1, 0], col: [.06, .06, .07] }, music: 'mo_hall', title: 'FIDELITY CONTROL' }, b => {
  room4(b, -5, 0, 5, 7, 3.2, MAT.wall, MAT.lino);
  doorG(b, 5, 3.5, 'e', 'metal'); doorG(b, -5, 1.2, 'w', 'metal');
  b.add('box:.7:.55:.1', [-4.95, 1.2, 2.5], { col: '#c81818', emis: .3 }, { r: Math.PI / 2 });
  b.box(0, 6.3, 7, 1, .9, { col: '#5a5a60', tex: 'metal' }); for (let i = 0; i < 5; i++) { b.add('box:1:.7:.1', [-2.8 + i * 1.4, 1.3, 6.6], { col: '#1a1a1a' }); b.add('box:.86:.56:.04', [-2.8 + i * 1.4, 1.37, 6.54], { col: i === 2 ? '#c84020' : '#4a5a5a', emis: .6 }); }
  b.light(0, 1.6, 5.6, [.6, .7, .7], 6, 1, .5); lightKeep(b);
  b.box(-3, 2.4, 2, 1, .78, MAT.wood); b.box(-3, 1.6, .7, .7, .5, { col: '#2a2a2a' });
  b.box(2.6, 1.1, 1, .7, .8, { col: '#c8c8c4', shiny: .3 }); b.add('box:.6:.05:.4', [2.6, .8, 1.1], MAT.paper);
  b.box(-4.4, 5.2, .9, 1.4, 1.4, { col: '#2a2a2a' }); b.add('box:.05:.5:.6', [-3.94, 1.6, 5.2], { col: '#5a6060', emis: .4 }); b.add('box:.05:.5:.6', [-3.94, 1, 5.2], { col: '#4a5050', emis: .3 });
  tube(b, -2, 3.5, 3.2); tube(b, 2.5, 3.5, 3.2);
}, { start: [4.2, 0, 3.5], map: [[78, 58, 28, 22]], floor: 1 });
SCENES.control.cams.push({ id: 'c', pos: [4.6, 2.8, 0.4], look: [-1.45, 0, 4.425], fov: 1.4, zone: [-15, -10, 0, 17] }, { id: 'nw', pos: [-4.6, 2.8, 6.6], look: [3.35, 0.4, 2.5], fov: 1.1, zone: [0, -10, 15, 17] });
// ---------------- SUITE A: THE OFFICE. a set ----------------
function officeScene(set) {
  const b = SB({ amb: [.1, .1, .1], sun: { dir: [.3, 1, -.2], col: [.08, .08, .08] }, fog: { col: '#08080a', dens: .01 }, sky: ['#000000', '#08080a'], music: 'mo_suite', title: 'SUITE A - THE OFFICE' });
  room4(b, -4, 0, 4, 7, 3.2, { col: '#6a6458', tex: 'stucco', ts: 3 }, MAT.wood);
  doorG(b, 0, 0, 's', 'wood'); blinds(b, 0, 6.98, 3, .9, 1.6);
  b.box(0, 4.4, 2.6, 1.1, .8, MAT.wood); b.add('box:.3:.12:.22', [-.8, .8, 4.3], { col: '#1a1a1a' }); b.cyl(.9, 4.6, .1, .4, { col: '#2a2a2a' }, { y: .8 });
  b.light(.9, 1.4, 4.4, [1, .58, .25], 5, 1.4, .6); lightKeep(b);
  b.box(0, 5.4, .6, .6, .9, { col: '#3a2a20' }); b.cyl(-3.2, 5.8, .05, 1.8, { col: '#3a2a20' }, { solid: true, seg: 6 }); b.add('box:.5:.04:.04', [-3.2, 1.75, 5.8], { col: '#3a2a20' }); b.add('box:.04:.04:.5', [-3.2, 1.75, 5.8], { col: '#3a2a20' });
  b.add('cyl:.32:.05:16', [3.95, 2, 4], { col: '#e8e4d8' }, { r: Math.PI / 2, pitch: Math.PI / 2 });
  b.box(3.4, 6.2, .9, .8, 1.3, { col: '#5a5a54', tex: 'metal' });
  if (set) {   // the fourth wall: it was a set, and someone was streaming from it
    b.add('cyl:.5:.06:16', [-2.4, 1.6, 1.2], { col: '#f8f8f8', emis: 1 }, { pitch: Math.PI / 2 }); b.cyl(-2.4, 1.2, .04, 1.6, { col: '#2a2a2a' }, { seg: 5, solid: true }); b.light(-2.4, 1.6, 1.5, [1, 1, 1], 6, 1.2, 1); lightKeep(b);
    b.add('box:.3:.25:.45', [2.2, 1.3, 1.3], { col: '#1a1a1a' }); b.add('cyl:.08:.2:8', [2.2, 1.42, 1.6], { col: '#3a3a3a' }, { pitch: Math.PI / 2 }); b.cyl(2.2, 1.3, .03, 1.3, { col: '#2a2a2a' }, { seg: 5, solid: true });
    b.add('box:.7:.5:.08', [-3.3, .8, .4], { col: '#1a1a1a' }); b.add('box:.6:.4:.04', [-3.3, .85, .45], { col: '#c81818', emis: .9 }); b.light(-3.3, 1.1, 1, [1, .1, .05], 3, 1); lightKeep(b);
    b.add('box:6:.04:.04', [0, .02, .7], { col: '#1a1a1a' });
  }
  b.light(0, 2.9, 3.5, [.7, .7, .75], 8, .7);
  b.cam('stage', [-3.7, 2.9, 0.3], [0.8, 0, 3.425], 1.4, [0, -5, 20, 20]); b.cam('reverse', [3.6, 2.9, 6.6], [-2, 0.4, 3.5], 1.4, [-20, -5, 0, 20]); b.cam('rev', [0, 3, 6.8], [0, 0.4, 3.3], 1.8, [-2, 4.6, 2, 5]);
  return Object.assign(b.fin(), { start: [0, 0, .9], map: [[114, 38, 28, 28]], floor: 1 });
}
SCENES.suite_a = officeScene(0); MOROOM.suite_a = SCENES.suite_a; SCENES.suite_a.variantKey = () => F3('suiteA') ? '/set' : ''; SCENES.suite_a.variantScene = () => officeScene(1);
SCENES.suite_a.camOverride = () => F3('suiteA') && Math.abs(CARL.p[0]) < 2 && CARL.p[2] > 4.6 && CARL.p[2] < 5 ? 'rev' : CARL.p[0] < 0 ? 'reverse' : 'stage';
// ---------------- SUITE B: THE KITCHEN ----------------
defRoom('suite_b', { amb: [.11, .11, .11], sun: { dir: [0, 1, 0], col: [.07, .07, .07] }, music: 'mo_suite', title: 'SUITE B - THE KITCHEN' }, b => {
  room4(b, -4, 0, 4, 7, 3, { col: '#9a9a90', tex: 'tile', ts: 1.5 }, { col: '#7a7a76', tex: 'tile', ts: 1, shiny: .3 });
  doorG(b, 0, 0, 's', 'wood');
  b.box(-.5, 6.55, 6.6, .9, .92, { col: '#d0d0c8', shiny: .3 }); b.box(-.5, 6.55, 6.7, 1, .06, { col: '#3a3a3a', shiny: .6 }, { y: .92, solid: false });
  b.add('box:.9:.1:.6', [-2.4, .9, 6.5], { col: '#5a5a5a', shiny: .8 }); b.add('box:.06:.36:.06', [-2.4, .98, 6.85], { col: '#b0b0b0', shiny: .9 }); b.add('box:.06:.06:.26', [-2.4, 1.32, 6.75], { col: '#b0b0b0', shiny: .9 });
  b.add('box:1.4:.8:.5', [-.5, 1.8, 6.75], { col: '#bab4a4', tex: 'wood', ts: 2 });
  b.add('box:.8:.06:.6', [1.4, .98, 6.5], { col: '#1a1a1a' }); b.add('cyl:.17:.24:10:.12', [1.4, 1.02, 6.5], { col: '#c8c8c8', shiny: .8 }); b.add('box:.06:.12:.2', [1.58, 1.14, 6.5], { col: '#1a1a1a' });
  b.add('box:.6:.16:.04', [2.4, .62, 6.08], { col: '#a8a49a' });
  b.box(3.5, 5.6, .9, .9, 2, { col: '#e0e0dc', shiny: .4 }); b.add('box:.04:.5:.06', [3.08, 1.2, 5.3], { col: '#8a8a8a' });
  b.add('box:1.4:1:.06', [-2.4, 1.5, 6.98], { col: '#5a646e', emis: .3 });
  b.cyl(-1, 2.8, .7, .74, MAT.wood, { solid: true, seg: 12 }); b.box(-2, 2.8, .45, .45, .45, MAT.wood); b.box(0, 2.8, .45, .45, .45, MAT.wood);
  b.add('box:.4:.14:.28', [-1, .74, 2.8], { col: '#2a2a2a' });
  b.light(0, 2.6, 4, [.9, .88, .82], 8, 1, .5);
}, { start: [0, 0, .9], map: [[146, 38, 28, 28]], floor: 1 });
SCENES.suite_b.cams.push({ id: 'k', pos: [3.6, 2.7, 0.4], look: [-0.95, 0, 3.05], fov: 1.32, zone: [-14, -10, 0, 17] }, { id: 'counter', pos: [-3.6, 2.7, 6.6], look: [0.8, 0, 4.425], fov: 1.4, zone: [0, -10, 14, 17] });
// ---------------- SUITE C: THE DINER, 3 AM ----------------
defRoom('suite_c', { amb: [.1, .1, .1], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_suite', title: 'SUITE C - THE DINER' }, b => {
  room4(b, -4.5, 0, 4.5, 7, 3, { col: '#8a8478', tex: 'stucco', ts: 3 }, { col: '#9a9a9a', tex: 'tile', ts: .8, shiny: .4 });
  doorG(b, 2, 0, 's', 'glass');
  b.add('box:.08:1.4:4.6', [-4.48, 1, 3.6], { col: '#2a3038', emis: .2, shiny: .9 });
  for (const z of [2.6, 5.4]) { b.box(-3.6, z, 1.4, .5, .45, { col: '#922020', shiny: .3 }); b.box(-3.6, z + (z < 4 ? -.2 : .2), 1.4, .15, 1.1, { col: '#922020' }, { solid: false }); }
  b.box(-3.6, 4, 1.3, .9, .75, { col: '#d8d8d8', shiny: .5 }); b.add('box:.3:.02:.3', [-3.4, .75, 3.9], { col: '#e8e8e8' }); b.add('cyl:.05:.12:8', [-3.8, .75, 4.2], { col: '#e8e8e8' });
  b.box(1.8, 6.2, 5, .8, 1, { col: '#c8c8c8', shiny: .5 }); b.box(1.8, 6.2, 5.1, .9, .06, { col: '#3a3a3a', shiny: .7 }, { y: 1, solid: false });
  for (const x of [0, 1.3, 2.6, 3.9]) b.cyl(x, 5.3, .22, .7, { col: '#922020', shiny: .4 }, { seg: 8, solid: true });
  b.add('box:1:.5:.6', [3.4, 1, 6.3], { col: '#3a4048', shiny: .8, emis: .1 });
  b.sign(.6, 2.2, 6.95, 1.5, .4, '#e01818', { rad: 6, int: 1, lz: -1 }); lightKeep(b);
  b.light(-3.6, 2.4, 4, [1, .82, .6], 5, 1, .4); b.light(2, 2.6, 4.5, [.8, .82, .86], 8, .8);
}, { start: [2, 0, .9], map: [[178, 38, 28, 28]], floor: 1 });
SCENES.suite_c.cams.push({ id: 'd', pos: [3.9, 2.4, 0.4], look: [-1.2, 0, 3.425], fov: 1.4, zone: [-14.5, -10, 0, 17] }, { id: 'booth', pos: [-3.9, 2.4, 6.6], look: [1.05, 0, 2.8], fov: 1.15, zone: [0, -10, 14.5, 17] });
// ---------------- B1: MONDAY CORRIDOR. red emergency light ----------------
defRoom('b_hall', { amb: [.07, .06, .06], sun: { dir: [0, 1, 0], col: [.04, .03, .03] }, music: 'mo_monday', title: 'B1 - MONDAY WARD', flicker: 1 }, b => {
  room4(b, 0, 0, 26, 3.6, 3, MAT.wallD, { col: '#6a6a6a', tex: 'concrete', ts: 3, shiny: .55 });
  doorG(b, 0, 1.8, 'w', 'lift'); doorG(b, 7, 0, 's', 'wood'); doorG(b, 26, 1.8, 'e', 'metal'); doorG(b, 19.5, 0, 's', 'metal'); doorG(b, 11.5, 3.6, 'n', 'metal'); b.add('box:1.3:.06:.3', [11.5, 2.5, 3.5], { col: '#d8e0e8', emis: .25 });
  b.add('cyl:.16:26:8', [0, 2.7, 3.3], { col: '#8a8a8a', shiny: .4 }, { r: Math.PI / 2, pitch: Math.PI / 2 }); b.add('cyl:.1:26:8', [0, 2.35, 3.38], { col: '#b8b8c0', shiny: .6 }, { r: Math.PI / 2, pitch: Math.PI / 2 });
  for (const x of [4, 11, 15, 21]) b.add('plane:1.6:1', [x, .012, 2.6], { col: '#e8e8f0', emis: .15 });
  for (const x of [5, 13, 21]) { b.add('box:.4:.18:.18', [x, 2.7, .1], { col: '#c81818', emis: 1 }); b.light(x, 2.4, .6, [1, .12, .08], 9, 1.2, .5); lightKeep(b); }
  b.box(17.5, 3.1, 1.2, .6, 1.1, { col: '#5a5a5a', tex: 'metal' }); b.box(9.6, .4, .8, .6, .7, { col: '#5a4a3a', tex: 'wood' });
}, { start: [1, 0, 1.8], map: [[60, 100, 186, 12]], floor: 0 });
SCENES.b_hall.cams.push({ id: 'w', pos: [0.45, 2.6, 0.4], look: [12.425, 0.4, 1.8], fov: 1.05, zone: [9, -5, 18, 9] }, { id: 'm', pos: [17.6, 2.6, 0.4], look: [5.55, 0, 2.8], fov: 1.05, zone: [-5, -5, 9, 9] }, { id: 'e', pos: [14, 2.6, 0.4], look: [20.5, 1, 2], fov: 1.32, zone: [18, -5, 40, 9] });
// ---------------- B1: OTIS'S CAMP. the second safe room ----------------
defRoom('b_safe', { amb: [.14, .12, .1], sun: { dir: [0, 1, 0], col: [.08, .07, .06] }, music: 'mo_safe', title: 'OTIS\'S CAMP', safe: 1 }, b => {
  room4(b, -4, 0, 4, 6, 2.8, MAT.wallD, MAT.conc);
  doorG(b, 0, 6, 'n', 'wood');
  b.box(-3.1, 2.8, .9, 2, .4, { col: '#5a5a4a', tex: 'carpet', ts: 1 }); b.add('box:.7:.1:.5', [-3.1, .4, 2], { col: '#c8c8b8' });
  b.box(-1, 1, 1, .7, .5, { col: '#6a5a40', tex: 'wood' }); for (let i = 0; i < 4; i++) b.add('cyl:.06:.12:7', [-1.3 + i * .2, .5, 1 + (i & 1) * .15], { col: '#a8a8a8', shiny: .6 }); b.add('cyl:.14:.1:8', [-.7, .5, .8], { col: '#3a3a3a' });
  b.box(3.5, 2, .8, 1, .8, MAT.wood); b.add('box:.5:.45:.45', [3.5, .8, 2], { col: '#2a2a2a' }); b.add('box:.04:.34:.4', [3.24, .86, 2], { col: '#e07820', emis: .8 }); b.light(3.1, 1.2, 2, [1, .5, .15], 3, 1, .5); lightKeep(b);
  b.box(3.55, 4.4, .8, 1.3, 2.1, { col: '#6a6a70', tex: 'metal', ts: 2, shiny: .4 });
  b.solids.push([-1.2, 0, 1.2, .24]);
  b.add('box:2.4:1.5:.25', [0, .9, .12], { col: '#3a3a3a', tex: 'metal' }); b.add('cyl:.55:.06:20', [-.5, 1.65, .3], { col: '#e8e4d8', emis: .3 }, { pitch: Math.PI / 2 }); b.add('box:.6:.3:.06', [.7, 1.5, .27], { col: '#1a1a1a', emis: .1 });
  b.light(0, 2.4, 3, [1, .66, .36], 7, 1.2, .7); lightKeep(b);
}, { start: [0, 0, 5.2], map: [[128, 114, 40, 24]], floor: 0 });
SCENES.b_safe.cams.push({ id: 'camp', pos: [3.6, 2.5, 5.6], look: [-0.95, 0.8, 3.225], fov: 1.32, zone: [-14, -10, 0, 16] }, { id: 'reverse', pos: [-3.6, 2.5, 0.4], look: [0.8, 0, 2.925], fov: 1.4, zone: [0, -10, 14, 16] });
// ---------------- B1: VAULT ANTECHAMBER ----------------
defRoom('vault_ante', { amb: [.08, .08, .09], sun: { dir: [0, 1, 0], col: [.05, .05, .06] }, music: 'mo_monday', title: 'VAULT ANTECHAMBER' }, b => {
  b.ground(10, 8, { col: '#5a5a5a', tex: 'concrete', ts: 3, shiny: .4 }, 5, 0);
  b.box(5, -4.15, 10.6, .3, 4, MAT.wallD); b.box(-.15, 0, .3, 8, 4, MAT.wallD); b.box(10.15, 0, .3, 8, 4, MAT.wallD);
  b.box(1.6, 4.15, 3.2, .3, 4, MAT.wallD); b.box(8.6, 4.15, 2.8, .3, 4, MAT.wallD); b.box(5.1, 4.15, 4.2, .3, 1, MAT.wallD); b.add('box:4.2:.6:.3', [5.1, 3.4, 4.15], MAT.wallD);
  b.add('box:4.2:.08:.08', [5.1, 1, 4.05], { col: '#3a3a3a' }); b.add('box:4.2:.08:.08', [5.1, 3.4, 4.05], { col: '#3a3a3a' });
  b.ground(4.2, 3, MAT.conc, 5.1, 5.6); b.box(5.1, 7.15, 4.8, .3, 4, MAT.wallD); b.box(2.85, 5.6, .3, 3, 4, MAT.wallD); b.box(7.35, 5.6, .3, 3, 4, MAT.wallD);
  b.add('box:1.6:.4:.8', [4.2, 0, 6.4], { col: '#c8c8b8' }); b.light(5.1, 2.6, 5.6, [.9, .9, 1], 4, .9);
  b.add('plane:10:8', [5, 4, 0], MAT.ceil);
  doorG(b, 0, 0, 'w', 'metal');
  b.add('cyl:2.2:.6:24', [9.75, 2.3, 0], { col: '#8a8a90', tex: 'metal', ts: 2, shiny: .6 }, { r: Math.PI / 2, pitch: Math.PI / 2 }); b.add('cyl:.5:.7:12', [9.6, 2.3, 0], { col: '#5a5a60', shiny: .6 }, { r: Math.PI / 2, pitch: Math.PI / 2 });
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; b.add('box:.12:.12:.9', [9.4, 2.3 + Math.sin(a) * 1.4, Math.cos(a) * 1.4], { col: '#4a4a4c' }, { r: a }); }
  b.add('box:.1:.5:1', [9.95, 2.1, -3], { col: '#1a1a1a' }); b.add('box:.06:.3:.8', [9.9, 2.2, -3], { col: '#c81818', emis: .9 });
  b.light(5, 3.6, 0, [.7, .72, .8], 11, .9, .4); b.light(9, 2.6, -3, [1, .1, .05], 3, 1); lightKeep(b);
  b.solids.push([9.2, -2.5, 10.4, 2.5]); b.walkRect(0, -4, 10, 4);
}, { start: [.9, 0, 0], map: [[246, 88, 34, 36]], floor: 0 });
SCENES.vault_ante.cams.push({ id: 'sw', pos: [0.5, 3.4, -3.6], look: [6.3, 0.4, -0.075], fov: 1.4, zone: [5, -14, 20, 14] }, { id: 'se', pos: [9, 3.3, -3.6], look: [3.55, 0.4, -0.075], fov: 1.32, zone: [-10, -14, 5, 14] });
// ---------------- B1: THE VAULT ----------------
defRoom('vault', { amb: [.07, .07, .08], sun: { dir: [0, 1, 0], col: [.05, .05, .06] }, music: 'mo_monday', title: 'THE VAULT' }, b => {
  room4(b, 0, -6, 12, 6, 6, { col: '#6a6a6e', tex: 'metal', ts: 3 }, { col: '#4a4a4c', tex: 'metal', ts: 2, shiny: .5 });
  doorG(b, 0, 0, 'w', 'metal');
  b.add('cyl:1.6:.6:20', [7, 0, 0], { col: '#3a3a3c', shiny: .5 }); b.add('cyl:1.1:1.2:16', [7, .6, 0], { col: '#5a5a5e', tex: 'metal' }); b.solids.push([5.6, -1.4, 8.4, 1.4]);
  for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28; b.add('box:.2:.1:4', [7 + Math.cos(a) * 3.4, .02, Math.sin(a) * 3.4], { col: '#1a1a1a' }, { r: Math.PI / 2 - a }); }
  for (const z of [-5.4, 5.4]) for (let i = 0; i < 4; i++) b.add('box:1.6:.06:.6', [3.6 + i * 1.8, 1 + (i & 1) * .7, z], { col: '#2a2a2a' });
  b.light(7, 5.2, 0, [.85, .88, 1], 12, 1.2, 1.2); b.light(7, 1, 0, [1, .12, .08], 5, 1.2); lightKeep(b);
  b.walkRect(0, -6, 12, 6);
}, { start: [.9, 0, 0], map: [[282, 82, 32, 48]], floor: 0 });
SCENES.vault.cams.push({ id: 'w', pos: [0.6, 4.6, -5.4], look: [7.8, 0.4, -0.075], fov: 1.4, zone: [6, -16, 22, 16] }, { id: 'e', pos: [11.4, 4.6, 5.4], look: [4.05, 0.4, 0.925], fov: 1.32, zone: [-10, -16, 6, 16] });
// the camera list must name a default that has no zone: put zoneless ones first
for (const id in MOROOM) { const c = SCENES[id].cams; c.sort((a, b) => (a.zone ? 1 : 0) - (b.zone ? 1 : 0)); }

// ---------------- SERVICE PASSAGE: the night porter's unfinished round ----------------
defRoom('service', { amb: [.09, .09, .1], sun: { dir: [0, 1, 0], col: [.06, .06, .07] }, music: 'mo_dark', title: 'FRIDAY SERVICE PASSAGE', noStalk: 1 }, b => {
  room4(b, 0, 0, 14, 5.8, 3, MAT.wallD, MAT.conc);
  b.box(3, 4.7, 6, 2.2, 3, MAT.wallD);
  b.box(11, 4.7, 6, 2.2, 3, MAT.wallD);
  doorG(b, 0, 1.8, 'w', 'metal'); doorG(b, 14, 1.8, 'e', 'metal');
  b.box(7, 5.5, 1.5, .5, .8, MAT.wood);
  b.add('cyl:.1:.16:8', [7, .8, 5.3], MAT.paper);
  b.add('box:.5:.35:.08', [1.3, 1.3, .06], MAT.paper);
  b.add('cyl:.12:.05:10', [1.3, 1, 3.52], { col: '#c8b070' });
  for (const x of [2, 7, 12]) tube(b, x, 1.8, 3, 1, [.6, .65, .7], 5, .55);
  b.light(7, 2, 5, [1, .15, .08], 3, .8); lightKeep(b);
}, { start: [.9, 0, 1.8], map: [[46, 84, 60, 12]], floor: 1 });
SCENES.service.cams.push({ id: 'w', pos: [10, 2.8, 0.4], look: [2.55, 0.4, 2.55], fov: 1.6, zone: [-2, -2, 6.9, 8] }, { id: 'e', pos: [4, 2.8, 0.4], look: [11.3, 0.2, 2.55], fov: 1.6, zone: [6.9, -2, 16, 8] });
