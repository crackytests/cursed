'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. the wings: 2F (the Wednesday ward, the roof) and the rest of B1 (the boiler, cold storage) =================
// new lore, labeled as such: the Recall Theater, the director's journal, Dale the projectionist, Margaret "Maggie" Keel. none of it settles who 41's master was.
// a room with a second look (the boiler, lit): build(b, variant) runs twice
function defRoomV(id, def, build, extra, vk) {
  defRoom(id, def, b => build(b, 0), extra);
  if (vk) Object.assign(SCENES[id], { variantKey: vk, variantScene: () => { const b = SB(Object.assign({ fog: { col: '#08080a', dens: .012 }, sky: ['#000000', '#08080a'] }, def)); build(b, 1); return Object.assign(b.fin(), extra); } });
}
// ================= ROOMS =================
// ---------------- STAIRWELL: lobby to 2F ----------------
defRoom('stairs', { amb: [.17, .17, .18], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_hall', title: 'STAIRWELL', flicker: 1 }, b => {
  room4(b, 0, 0, 4.4, 8, 6, MAT.wallD, MAT.conc);
  doorG(b, 0, 2, 'w', 'wood');
  for (let i = 0; i < 9; i++) b.box(2.6, 4.45 + i * .42, 3.2, .42, .22 * (i + 1), MAT.conc);
  b.add('box:1.4:2.4:.1', [2.6, 2.0, 7.94], { col: '#0a0a0a' }); b.add('box:.06:.06:3.8', [.95, 1.4, 6.1], { col: '#5a5a5a', shiny: .5 }, { pitch: -.46 });
  b.add('box:.4:.3:.06', [3.4, 2.4, .04], { col: '#c81818', emis: .8 }); b.light(3.4, 2.2, .6, [1, .12, .08], 3, 1); lightKeep(b);
  tube(b, 2.2, 2, 6, 1.4, [.8, .85, .95], 8, 1.2); b.light(2.6, 4.5, 7, [.8, .84, .9], 6, .9);
}, { start: [1, 0, 2], map: [[191, 136, 12, 12]], floor: 1 });
SCENES.stairs.cams.push({ id: 's', pos: [4.1, 3.8, 6], look: [2.175, 0, 1.8], fov: 1.3, zone: [-5, -5, 20, 3.5] }, { id: 'up', pos: [0.3, 3.4, 0.3], look: [2.175, 0.4, 5.55], fov: 1.3, zone: [-5, 3.5, 20, 20] });
// ---------------- 2F: WEDNESDAY WARD - RECALL. where families came to watch the people they'd kept ----------------
defRoom('wed_hall', { amb: [.09, .09, .1], sun: { dir: [0, 1, 0], col: [.06, .06, .07] }, music: 'mo_upper', title: 'WEDNESDAY WARD - RECALL', flicker: 1 }, b => {
  room4(b, 0, 0, 24, 3.6, 3.2, MAT.wall, MAT.lino);
  b.add('plane:22:1.2', [12, .012, 1.8], { col: '#8a2020', tex: 'carpet', ts: 1 });
  doorG(b, 0, 1.8, 'w', 'wood'); doorG(b, 5, 3.6, 'n', 'wood'); doorG(b, 8, 0, 's', 'wood'); doorG(b, 12, 3.6, 'n', 'double'); doorG(b, 16, 0, 's', 'metal'); doorG(b, 19.5, 3.6, 'n', 'wood'); doorG(b, 24, 1.8, 'e', 'metal');
  b.add('box:3.2:.5:.12', [12, 2.75, 3.48], { col: '#c81818', emis: .9 }); b.light(12, 2.4, 2.6, [1, .12, .08], 5, 1); lightKeep(b);
  b.box(2.6, 3.25, 1.6, .45, .45, MAT.wood); b.box(21.6, .35, 1.6, .45, .45, MAT.wood);
  for (const x of [9.6, 14.4]) b.add('box:.9:1.1:.05', [x, 1.3, 3.56], { col: '#2a2a2a' }); for (const x of [3, 21]) b.add('box:.9:1.1:.05', [x, 1.3, .04], { col: '#3a3a3a' });
  b.cyl(23.3, 3.1, .3, .6, { col: '#4a4a44' }, { solid: true }); b.add('sphere:.5:7:5', [23.3, 1, 3.1], { col: '#3a4a34' });
  for (const x of [3, 9, 15, 21]) tube(b, x, 1.8, 3.2, 1.4, [.8, .84, .92], 6, .8);
}, { start: [1, 0, 1.8], map: [[40, 100, 200, 12]], floor: 2 });
SCENES.wed_hall.cams.push({ id: 'w', pos: [11, 2.8, 0.35], look: [5.05, -0.2, 2.8], fov: 1.32, zone: [-5, -5, 8, 9] }, { id: 'm', pos: [3.5, 2.9, 0.35], look: [12, 0, 3], fov: 1.25, zone: [8, -5, 16, 9] }, { id: 'e', pos: [13, 2.8, 0.35], look: [18.8, 0, 1.8], fov: 1.32, zone: [16, -5, 30, 9] });
// ---------------- 2F: RECORDS ----------------
defRoom('records', { amb: [.1, .1, .11], sun: { dir: [0, 1, 0], col: [.06, .06, .06] }, music: 'mo_upper', title: 'RECORDS' }, b => {
  room4(b, -4.5, 0, 4.5, 7, 3, MAT.wallD, MAT.lino);
  doorG(b, 0, 0, 's', 'wood');
  for (const x of [-3.7, 3.7]) for (const z of [2.2, 3.6, 5]) b.box(x, z, .8, 1.2, 1.4, { col: '#7a7a7a', tex: 'metal' });
  b.box(0, 5.9, 2.6, .9, .78, MAT.wood); b.add('box:.6:.45:.4', [0, .78, 6.0], { col: '#2a2a2a' }); b.add('box:.5:.34:.03', [0, .86, 5.78], { col: '#c8d0c8', emis: .5 }); b.light(0, 1.4, 5.4, [.8, .85, .8], 4, 1, .4); lightKeep(b);
  b.box(2, 1.4, 1.1, .7, .75, MAT.wood); b.add('box:.5:.02:.4', [1.8, .75, 1.4], MAT.paper);
  tube(b, 0, 3, 3, 1.4, [.8, .85, .95], 7, .8);
}, { start: [0, 0, .9], map: [[60, 62, 40, 36]], floor: 2 });
SCENES.records.cams.push({ id: 'r', pos: [4.1, 2.7, 0.35], look: [-1.2, 0, 3.425], fov: 1.32, zone: [-14.5, -10, 0, 17] }, { id: 'reverse', pos: [-4.1, 2.7, 6.6], look: [2.1, 0, 2.5], fov: 1.4, zone: [0, -10, 14.5, 17] });
// ---------------- 2F: NURSES' STATION. the third safe room ----------------
defRoom('nurse', { amb: [.15, .14, .12], sun: { dir: [0, 1, 0], col: [.09, .08, .07] }, music: 'mo_safe', title: 'NURSES\' STATION', safe: 1 }, b => {
  room4(b, -3.5, 0, 3.5, 6, 2.8, MAT.wall, { col: '#a8a8a4', tex: 'tile', ts: 1.5, shiny: .3 });
  doorG(b, 0, 6, 'n', 'wood');
  b.box(-2.9, 1.5, .9, 1.4, .8, MAT.wood); b.add('box:.5:.45:.45', [-2.9, .8, 1.5], { col: '#2a2a2a' }); b.add('box:.04:.34:.4', [-2.64, .86, 1.5], { col: '#e07820', emis: .8 }); b.light(-2.4, 1.2, 1.5, [1, .5, .15], 3, 1, .5); lightKeep(b);
  b.box(3.05, 1.3, .8, 1.3, 2.1, { col: '#6a6a70', tex: 'metal', ts: 2, shiny: .4 });
  b.box(-2.7, 4.3, .9, 2, .45, { col: '#d8d8d0' }); b.box(3.05, 4.3, .7, 1.4, 1.8, { col: '#c8c8c4', shiny: .5 }); b.add('box:.04:1.2:1.2', [2.68, .4, 4.3], { col: '#5a646e', emis: .2, shiny: .9 });
  b.box(0, 3, 1.2, .7, .75, MAT.wood); b.add('box:.4:.02:.3', [.2, .75, 3], MAT.paper);
  b.light(0, 2.3, 3, [1, .7, .42], 7, 1.1, .7); lightKeep(b);
}, { start: [0, 0, 5.2], map: [[76, 114, 34, 26]], floor: 2 });
SCENES.nurse.cams.push({ id: 'n', pos: [-3.1, 2.5, 5.6], look: [1.6, 0, 3], fov: 1.32, zone: [0, -10, 13.5, 16] }, { id: 'reverse', pos: [3.1, 2.5, 0.4], look: [-1.7, 0, 2.925], fov: 1.4, zone: [-13.5, -10, 0, 16] });
// ---------------- 2F: SECURITY ----------------
defRoom('security', { amb: [.09, .09, .1], sun: { dir: [0, 1, 0], col: [.05, .05, .06] }, music: 'mo_upper', title: 'SECURITY OFFICE' }, b => {
  room4(b, -3.5, 0, 3.5, 6, 2.8, MAT.wallD, MAT.lino);
  doorG(b, 0, 6, 'n', 'metal');
  b.box(0, .55, 4.2, .9, .8, { col: '#4a4a50', tex: 'metal' }); for (let i = 0; i < 4; i++) { b.add('box:.9:.65:.1', [-1.5 + i, 1.25, .12], { col: '#1a1a1a' }); b.add('box:.78:.52:.04', [-1.5 + i, 1.31, .18], { col: i === 1 ? '#c84020' : '#4a5a5a', emis: .6 }); }
  b.light(0, 1.6, 1, [.6, .7, .7], 5, 1, .4); lightKeep(b);
  b.box(-3.35, 3, .3, 2, 1.6, { col: '#3a3026', tex: 'wood' }, { y: .7, solid: false }); for (let i = 0; i < 3; i++) b.add('box:.06:.06:.3', [-3.2, 1.3 + i * .4, 3], { col: '#1a1a1a' });
  for (const z of [2, 3, 4]) b.box(3.1, z, .7, .9, 2, { col: '#6a6a70', tex: 'metal' });
  b.box(-1.6, 3.6, 1.2, .8, .75, MAT.wood);
  tube(b, 0, 3, 2.8, 1.4, [.8, .85, .95], 6, .7);
}, { start: [0, 0, 5.2], map: [[140, 114, 34, 26]], floor: 2 });
SCENES.security.cams.push({ id: 's', pos: [3.1, 2.6, 5.6], look: [-0.7, 0.4, 3.625], fov: 1.25, zone: [-13.5, -10, 0, 16] }, { id: 'reverse', pos: [-3.1, 2.6, 0.4], look: [1.55, 0, 2.925], fov: 1.4, zone: [0, -10, 13.5, 16] });
// ---------------- 2F: THE RECALL THEATER. families sat here and watched their kept ones played back ----------------
defRoom('theater', { amb: [.13, .11, .11], sun: { dir: [0, 1, 0], col: [.05, .04, .04] }, music: 'mo_theater', title: 'RECALL THEATER' }, b => {
  room4(b, -6, 0, 6, 10, 4.5, { col: '#4a4440', tex: 'stucco', ts: 3 }, { col: '#3a3434', tex: 'carpet', ts: 2 });
  doorG(b, 0, 0, 's', 'double');
  b.add('box:8:3.4:.08', [0, 1.1, 9.9], { col: '#d8d8d8', emis: .3 }); b.add('box:8.6:.3:.12', [0, 4.5, 9.85], { col: '#5a1414' });
  for (const z of [3.2, 4.6, 6, 7.4]) for (const x of [-3.1, 3.1]) { b.box(x, z, 3.6, .6, .45, { col: '#c02020', tex: 'carpet', ts: 1 }); b.box(x, z - .28, 3.6, .1, .95, { col: '#a81a1a' }, { solid: false }); }
  b.box(4.6, .8, .7, .7, .9, { col: '#3a3a3a' }); b.add('box:.5:.4:.7', [4.6, .9, .8], { col: '#2a2a2a', tex: 'metal' }); b.add('cyl:.12:.2:8', [4.6, 1.15, 1.2], { col: '#e8e8d8', emis: .6 }, { pitch: Math.PI / 2 });
  b.add('box:.08:.4:.3', [-5.92, 1.2, 8.8], { col: '#a02020', tex: 'metal' });
  b.add('box:.12:.1:.12', [-5.8, 1.4, 8.8], { col: '#e83020', emis: .5 });
  b.add('box:.06:.45:.35', [5.92, 1.35, 2.1], MAT.paper);
  for (const x of [-5.9, 5.9]) for (const z of [3, 7]) { b.add('box:.1:.3:.2', [x, 2.6, z], { col: '#c81818', emis: .8 }); }
  b.light(-5.4, 2.6, 5, [1, .14, .1], 6, .9); lightKeep(b); b.light(5.4, 2.6, 5, [1, .14, .1], 6, .9); lightKeep(b);
  b.light(0, 2.4, 9, [.8, .8, .85], 7, .8, .3); lightKeep(b); b.light(0, 4, 4, [.75, .72, .7], 10, .8);
}, { start: [0, 0, .9], map: [[104, 40, 64, 58]], floor: 2, noStalk: 1 });
SCENES.theater.cams.push({ id: 'entry', pos: [5.6, 3.6, 7.2], look: [0.925, 0, 0.925], fov: 1.6, zone: [-20, -5, 20, 3.6] }, { id: 'back', pos: [5.6, 4, 0.4], look: [2.1, 0, 5.8], fov: 1.6, zone: [-20, 3.6, 20, 7.9] }, { id: 'front', pos: [0, 4, 0.4], look: [0, 0.6, 8.8], fov: 1.4, zone: [-20, 7.9, 20, 20] });
// ---------------- 2F: THE DIRECTOR'S OFFICE ----------------
defRoom('dir_office', { amb: [.1, .1, .1], sun: { dir: [.3, 1, -.2], col: [.07, .07, .07] }, music: 'mo_upper', title: 'DIRECTOR\'S OFFICE' }, b => {
  room4(b, -4, 0, 4, 7, 3.2, { col: '#6a6458', tex: 'stucco', ts: 3 }, MAT.carpet);
  doorG(b, 0, 0, 's', 'wood'); blinds(b, 0, 6.98, 3, .9, 1.6);
  b.box(0, 4.4, 2.6, 1.1, .8, MAT.wood); b.box(0, 5.3, .6, .6, 1, { col: '#2a2020' }); b.cyl(.9, 4.6, .1, .4, { col: '#2a2a2a' }, { y: .8 });
  b.light(.9, 1.4, 4.4, [1, .58, .25], 5, 1.3, .6); lightKeep(b);
  b.box(3.85, 3.5, .3, .9, .8, { col: '#3a3a40', tex: 'metal', shiny: .6 }, { y: .5, solid: false }); b.add('cyl:.16:.06:12', [3.68, .95, 3.5], { col: '#b8b8b8', shiny: .8 }, { r: Math.PI / 2, pitch: Math.PI / 2 });
  b.box(-3.7, 3.5, .6, 3, 2.4, MAT.wood); for (let j = 0; j < 4; j++) b.add('box:.5:.06:2.9', [-3.65, .5 + j * .55, 3.5], { col: '#2a2420' });
  b.add('box:1:1.3:.05', [-2, 1.4, 6.95], { col: '#2a2a2a' }); b.add('box:.8:1.1:.03', [-2, 1.5, 6.92], { col: '#d8d8d8', emis: .2 });
  b.cyl(2.8, 6, .3, .9, { col: '#5a4a3a' }, { solid: true }); b.add('sphere:.32:9:6', [2.8, 1.2, 6], { col: '#8a7a5a' });
  b.light(0, 2.9, 3.5, [.7, .7, .75], 8, .7);
}, { start: [0, 0, .9], map: [[172, 62, 40, 36]], floor: 2 });
SCENES.dir_office.cams.push({ id: 'd', pos: [-3.7, 2.9, 0.3], look: [0.8, 0, 3.425], fov: 1.4, zone: [0, -10, 14, 17] }, { id: 'reverse', pos: [3.6, 2.9, 6.6], look: [-0.95, 0, 3.725], fov: 1.4, zone: [-14, -10, 0, 17] });
// ---------------- 2F: THE ROOF. rain, the antenna, a red light on a hill to the west ----------------
defRoom('roof', { amb: [.16, .16, .19], sun: { dir: [-.3, .8, -.5], col: [.12, .12, .16] }, sky: ['#030306', '#14141c'], fog: { col: '#0c0c10', dens: .012 }, music: 'mo_rain', title: 'ROOF' }, b => {
  b.ground(14, 10, { col: '#4a4a4e', tex: 'concrete', ts: 3, shiny: .65 }, 7, 5);
  for (const [x, z, w, d] of [[7, -.15, 14.6, .3], [7, 10.15, 14.6, .3], [14.15, 5, .3, 10]]) b.box(x, z, w, d, 1, MAT.conc);
  b.box(-.15, 1.5, .3, 3, 1, MAT.conc); b.box(-.15, 8.5, .3, 3, 1, MAT.conc); b.box(-.6, 5, 1, 4, 3, { col: '#7a7a76', tex: 'stucco', ts: 3 });
  doorG(b, 0, 5, 'w', 'metal');
  b.cyl(10.5, 7.5, .12, 6, { col: '#7a7a80', tex: 'metal', shiny: .5 }, { solid: true, seg: 6 }); for (const y of [3, 4.5, 5.8]) b.add('box:1.6:.06:.06', [10.5, y, 7.5], { col: '#6a6a70' });
  b.box(10.5, 6.8, .7, .5, 1, { col: '#5a5a5a', tex: 'metal' }); b.add('box:.1:.1:.04', [10.5, .9, 6.53], { col: '#c81818', emis: 1 });
  b.box(4, 7.6, 2, 1.4, 1.2, { col: '#8a8a88', tex: 'metal' }); b.box(7.2, 2.4, 1.6, 1.2, 1, { col: '#8a8a88', tex: 'metal' }); b.box(4, 3.2, 2, 1.6, .4, MAT.glass);
  b.cyl(1.9, 1.1, .16, .3, { col: '#5a5a5a' }, { solid: true });
  b.cyl(-48, 6, .5, 8, { col: '#1a1a1c' }); b.add('box:30:4:30', [-60, 0, 6], { col: '#0e0e10' });
  b.lamp(13, 1, { h: 3, col: [.7, .72, .8], rad: 8, int: .8 }); b.walkRect(0, 0, 14, 10);
}, { start: [1, 0, 5], map: [[244, 70, 50, 70]], floor: 2, rain: 1 });
SCENES.roof.cams.push({ id: 'r', pos: [13.6, 4.2, 9.6], look: [4.55, 0.8, 4.925], fov: 1.32, zone: [-10, -10, 7, 20] }, { id: 'w', pos: [0.8, 3.6, 0.6], look: [9.3, 0.8, 3.925], fov: 1.32, zone: [7, -10, 24, 20] });
// ---------------- B1: BOILER ROOM ----------------
defRoomV('boiler', { amb: [.14, .12, .11], sun: { dir: [0, 1, 0], col: [.04, .03, .03] }, music: 'mo_boiler', title: 'BOILER ROOM' }, (b, lit) => {
  room4(b, -4.5, 0, 4.5, 8, 3.6, MAT.wallD, MAT.conc);
  doorG(b, 0, 8, 'n', 'metal');
  b.add('cyl:1.5:5:14', [-1.8, 1.6, 1.1], { col: '#5a5a58', tex: 'metal', ts: 2, shiny: .4 }, { pitch: Math.PI / 2 }); b.solids.push([-3.4, 1.1, -.2, 6.1]);
  b.add('box:1.2:.9:.1', [-.25, .5, 3.6], { col: lit ? '#ff7a1a' : '#1a1a1a', emis: lit ? 1 : 0 }, { r: Math.PI / 2 });
  for (const z of [1.4, 5.8]) b.add('cyl:.2:2.2:8', [-1.8, 3.2, z], { col: '#6a6a6a' });
  b.solids.push([4.15, 2.9, 4.45, 5.9]);
  b.box(4.3, 4.4, .3, 3, 1.8, { col: '#4a4a50', tex: 'metal' }, { y: .5 });
  for (let i = 0; i < 3; i++) { b.add('cyl:.2:.08:10', [4.08, 1.2, 3.4 + i * .8], { col: '#c81818', shiny: .4 }, { r: Math.PI / 2, pitch: Math.PI / 2 }); b.add('cyl:.17:.05:12', [4.12, 1.9, 3.4 + i * .8], { col: '#e8e4d8' }, { r: Math.PI / 2, pitch: Math.PI / 2 }); }
  b.add('box:.03:.5:.4', [4.42, 1.4, 6.3], MAT.paper);
  b.add('box:.5:.2:.12', [3, 3.2, 7.9], { col: '#c81818', emis: .9 }); b.light(3, 2.8, 7.2, [1, .12, .08], 6, 1.1); lightKeep(b);
  if (lit) { b.light(.3, 1, 3.6, [1, .5, .15], 7, 1.6, .9); lightKeep(b); }
  tube(b, 1.6, 2, 3.6, 1.4, [.8, .85, .95], 8, 1.1); tube(b, 1.6, 6, 3.6, 1.4, [.8, .85, .95], 6, .8);
}, { start: [0, 0, 7.2], map: [[184, 114, 32, 26]], floor: 0 }, () => F3('boiler') ? '/lit' : '');
SCENES.boiler.cams.push(
  { id: 'b', pos: [4.1, 3.2, 7.6], look: [0.6, 0.3, 4.1], fov: 1.8 },
  { id: 'reverse', pos: [4.1, 3.2, 0.4], look: [0.6, 0.3, 3.9], fov: 1.8 },
  { id: 'leftN', pos: [-4.1, 3.2, 7.6], look: [-4, 0, 3], fov: 1.6 },
  { id: 'leftS', pos: [-4.1, 3.2, 0.4], look: [-4, 0, 5], fov: 1.6 }
);
SCENES.boiler.camOverride = () => CARL.p[0] >= 0 ? (CARL.p[2] < 4 ? 'b' : 'reverse') : CARL.p[2] < .9 ? 'reverse' : CARL.p[2] > 6.3 ? 'b' : CARL.p[2] < 4 ? 'leftN' : 'leftS';
// ---------------- B1: COLD STORAGE. the Monday stacks, frozen. no line runs here ----------------
defRoom('cold', { amb: [.15, .16, .18], sun: { dir: [0, 1, 0], col: [.05, .05, .06] }, music: 'mo_dark', title: 'COLD STORAGE - MONDAY STACKS' }, b => {
  room4(b, 0, 0, 14, 10, 3.4, { col: '#8a9098', tex: 'stucco', ts: 3 }, { col: '#9aa0a8', tex: 'concrete', ts: 3, shiny: .6 });
  doorG(b, 7, 0, 's', 'metal');
  const shelf = (x0, x1, z) => { const w = x1 - x0; b.box((x0 + x1) / 2, z, w, .8, 2.6, { col: '#6a6e74', tex: 'metal', ts: 2 }); for (let j = 0; j < 4; j++) b.add('box:' + (w + .02) + ':.05:.82', [(x0 + x1) / 2, .5 + j * .6, z], { col: '#d8e0e8', emis: .08 }); };
  shelf(0, 5.5, 2.6); shelf(7.8, 14, 2.6); shelf(0, 2, 5.2); shelf(4, 11.5, 5.2); shelf(0, 9, 7.8); shelf(11, 14, 7.8);
  b.add('box:.6:.2:.05', [1.2, 2.3, 7.38], { col: '#c81818', emis: .5 });
  for (const x of [3, 11]) for (const z of [1.5, 6.5]) tube(b, x, z, 3.4, 1.4, [.8, .88, 1], 7, 1);
  b.light(7, 3, .4, [1, .12, .08], 4, 1); lightKeep(b);
}, { start: [7, 0, .9], map: [[118, 58, 60, 40]], floor: 0 });
SCENES.cold.isDark = () => true;
SCENES.cold.cams.push(
  { id: 'door', pos: [13.6, 3.2, 1.1], look: [3, 0, 1.1], fov: 1.4, zone: [-5, -5, 7, 2] },
  { id: 'row0E', pos: [0.4, 3.2, 1.1], look: [11, 0, 1.1], fov: 1.4, zone: [7, -5, 20, 2] },
  { id: 'row1W', pos: [13.6, 3.2, 3.9], look: [3, 0, 3.9], fov: 1.4, zone: [-5, 3.2, 7, 4.6] },
  { id: 'row1E', pos: [0.4, 3.2, 3.9], look: [11, 0, 3.9], fov: 1.4, zone: [7, 3.2, 20, 4.6] },
  { id: 'row2W', pos: [13.6, 3.2, 6.5], look: [3, 0, 6.5], fov: 1.4, zone: [-5, 5.8, 7, 7.2] },
  { id: 'row2E', pos: [0.4, 3.2, 6.5], look: [11, 0, 6.5], fov: 1.4, zone: [7, 5.8, 20, 7.2] },
  { id: 'row3W', pos: [13.6, 3.2, 9.1], look: [3, 0, 9.1], fov: 1.4, zone: [-5, 8.4, 7, 20] },
  { id: 'back', pos: [0.4, 3.2, 9.1], look: [11, 0, 9.1], fov: 1.4, zone: [7, 8.4, 20, 20] },
  { id: 'gap1', pos: [6.65, 3.2, 0.4], look: [6.65, 0, 4.5], fov: 1.6, zone: [-5, 2, 20, 3.2] },
  { id: 'gap2W', pos: [3, 3.2, 3.3], look: [3, 0, 6], fov: 1.8, zone: [-5, 4.6, 7, 5.8] },
  { id: 'gap2E', pos: [12.75, 3.2, 3.3], look: [12.75, 0, 6], fov: 1.8, zone: [7, 4.6, 20, 5.8] },
  { id: 'gap3', pos: [10, 3.2, 5.9], look: [10, 0, 8.6], fov: 1.8, zone: [-5, 7.2, 20, 8.4] }
);
for (const id of ['stairs', 'wed_hall', 'records', 'nurse', 'security', 'theater', 'dir_office', 'roof', 'boiler', 'cold']) SCENES[id].cams.sort((a, b) => (a.zone ? 1 : 0) - (b.zone ? 1 : 0));

// ================= DOCUMENTS =================
Object.assign(DOCS, {
  roster: { title: 'Duty roster, nurses\' station', body: 'WEDNESDAY - RECALL\nVISITING 2:00 - 6:00\nRECALL THEATER 7:30 PM (DALE ON PROJECTOR)\n\nReminder: Security changed their door code to the theater showtime, because the only thing Dale can remember is the showtime. Please knock anyway.\n\nThe kept do not know they are being watched. Families are asked not to wave.',
    after: async () => { setF('roster'); await narr(['Security\'s code was the showtime. 7:30. People who set codes like that want to be found out, a little.', 'Security code: the showtime. 7:30.', 'Showtime. 7:30.']); } },
  guardlog: { title: 'Security log, 2F', body: 'WED 7:52 PM. Projectionist (DALE) left the booth mid-show. Audience reported to be "standing up" during the orientation reel. Lights restored. Nobody hurt. Most of the audience were not people, per the Director, so "hurt" is a term of art.\n\nWED 8:10 PM. Orientation film pulled. Dale cut it into three cans so nobody could run it again. One went to Records. One is in our locker. One he took up to the roof with his cigarettes and did not bring back.\n\nClipped to this page, in the Director\'s hand: "Splice it back together when you need my numbers. I keep my numbers in my films. That is what films are for."',
    after: async () => { setF('guardlog'); await narr(['Three film cans: Records, this locker, the roof. And the director kept his numbers in his films, like a man who\'d never met a safecracker. Or a detective.', 'Three cans. Records, locker, roof. His numbers are in the film.', 'Three cans. Numbers in the film.']); } },
  canA: { title: 'Film can (A), leader', body: 'Scratched into the leader with a pin, both ends:\n\nHEAD: "...EVERYTHING YOU WOULD WANT BACK. ON WEDNESDAYS, FAMILY MAY VISIT."\n\nTAIL: "AND NOW, A FEW WORDS FROM THE DIRECTOR."' },
  canB: { title: 'Film can (B), leader', body: 'Scratched into the leader with a pin, both ends:\n\nHEAD: a countdown. 8, 7, 6, 5, 4, 3, 2. Then a title: "WELCOME TO MERIDIAN."\n\nTAIL: "...WE KEEP EVERYTHING YOU WOULD WANT BACK."' },
  canC: { title: 'Film can (C), leader', body: 'Scratched into the leader with a pin, both ends:\n\nHEAD: "A FEW WORDS FROM THE DIRECTOR."\n\nTAIL: a white slate. Then: THE END.\n\nThe can smells like a cigarette in the rain.' },
  rec41: { title: 'Client record: GARFIELD, J.B.', body: 'GARFIELD, J.B.  -  SUBJECT 41\nWARD: FRIDAY (FIDELITY)\nMASTER: DONATED RECORDING. SOURCE REDACTED BY ORDER OF THE DIRECTOR.\nINTAKE: SEE TAPE.\n\nNOTE: Subject insists it is a person. Fidelity suites confirm it behaves like one. Recommend we stop asking it which.',
    after: async () => { nerveDrop(6); await narr(['Donated. Source redacted. Somebody gave them a recording of me, or of someone who sounded like me, and they kept it like a person. Recommend we stop asking it which. I wished somebody had sent me that memo.', 'Donated. Redacted. Recommend we stop asking which.', 'Donated. Redacted.']); } },
  recMag: { title: 'Client record: KEEL, MARGARET', body: 'KEEL, MARGARET  ("MAGGIE")\nKEPT: SPRING 1986\nWARD: MONDAY (LONG-TERM)\nSTACK: COLD STORAGE, B1, ROW 3\nVISITOR OF RECORD: O. KEEL (SPOUSE). MONDAYS.\n\nNOTE: Client deceased 1987. Kept in good standing. Mr. Keel has asked to stay on as caretaker after closing. Approved.',
    after: async () => { setF('maggieRec'); await narr([F('mondayNote') ? "The card in the lounge had a client file. Kept in 1986, gone in 1987. Otis took the caretaker post after closing so the Monday appointment could stay in the book. Maggie had wanted news of the week." : "Margaret Keel. Kept in 1986, gone in 1987, and her husband asked to stay on as caretaker after they closed. That was why Otis didn't leave. He was visiting.", 'Otis\'s wife. Kept. He stayed to visit her. Mondays.', 'His wife. Mondays.']); } },
  recOtis: { title: 'Staff record: KEEL, OTIS', body: 'KEEL, OTIS  -  TECHNICIAN, THEN CARETAKER\nCLIENT: NO.\n\nIn pencil, under it, in a different hand: "not yet."' },
  recDir: { title: 'Record: THE DIRECTOR', body: 'THIS FILE IS SEALED.\n\nSomeone has written on the sealed sleeve: "He took his own file home. Of course he did."' },
  dirJournal: { title: 'The Director\'s journal, last page', body: 'The board calls it the Monday incident, as if Mondays were to blame.\n\nSubject 41 did not come to us as a client. It came as a donation: a recording of a voice, a character, sent from a source I have redacted on my own order. I ran it once, on a Friday, to test the fidelity suites. It walked the office set and moved the hat. It asked for lasagna. It wanted to know whose memories they were.\n\nSo did I. I still do.\n\nI have sealed this floor and the Monday ward, and I keep my card in this safe. Whatever 41 is, it is good at finding things. I would rather it did not find the vault.',
    after: async () => { setF('dirJournal'); nerveDrop(8); await narr(['A donation. A recording of a voice and a character, run once on a Friday, and it went looking for lasagna. The director wanted to know whose memories they were. That made two of us. Three, if you count the one in the vault.', 'Run once, on a Friday. It moved the hat. It asked for lasagna. He wanted to know whose memories. So do I.', 'It moved the hat. It asked for lasagna. Me.']); } },
  otisCold: { title: 'Note taped to row 3 (Otis)', body: 'MAGGIE - ROW 3, WEST END.\n\nKept spring of \'86, the spring before. I come down Mondays and read her the paper.\n\nIf you\'re reading this and you\'re not me: leave her be.\nIf you\'re reading this and you\'re me: you\'re doing fine. -O.' },
  chart: { title: 'Pressure chart, boiler room', body: 'EACH VALVE FEEDS TWO GAUGES.\n\nVALVE 1 ..... GAUGES A AND B\nVALVE 2 ..... GAUGES B AND C\nVALVE 3 ..... GAUGES C AND A\n\nA quarter turn moves a needle one mark: LOW, LOW, GREEN, RED. Past red it vents back to low.\n\nLight the burner with all three in the GREEN. Not before. -O.' },
});
// the film cans: picking one up shows its leader, and USE reads it again
Object.assign(ITEM.film1, { doc: 'canA', desc: ['Film can (A). USE it to read the leader.', 'Can A. USE to read.', 'Can A.'] });
Object.assign(ITEM.film2, { doc: 'canB', desc: ['Film can (B), dented. USE it to read the leader.', 'Can B. USE to read.', 'Can B.'] });
Object.assign(ITEM.film3, { doc: 'canC', desc: ['Film can (C), smells like a cigarette in the rain. USE it to read the leader.', 'Can C. USE to read.', 'Can C.'] });
const filmCan = (id, item, x, z, o = {}) => itemE(id, item, 1, x, z, Object.assign({ cond: () => !MO.taken[id] && !F('spliced'), after: () => showDoc(ITEM[item].doc) }, o));

// ================= THE GROUND FLOOR AND B1 GROW DOORS =================
{ const base = SCENES.lobby.ents; SCENES.lobby.ents = () => base().concat([
  doorE('stairDoor', 8.4, 11.2, 'STAIRWELL', 'stairs', 1, 2, PI2, { lock: async () => {
    if (F('stairsOpen')) return true;
    if (invHas('stairKey')) { invTake('stairKey'); setF('stairsOpen'); sfx('switch'); await narr(['The stairwell key turned. Upstairs had been sealed for a reason, and I was about to find out if it was a good one.', 'The key worked. Upstairs.', 'Open.']); return true; }
    sfx('empty'); await narr(['A door at the east end: STAIRS - 2F. Locked, with a paper seal across the frame. SEALED BY ORDER OF THE DIRECTOR. The director, it seemed, liked ordering doors around.', 'STAIRS - 2F. Sealed. Locked.', 'Locked. 2F.']); return false; } }),
]); }
{ const base = SCENES.b_hall.ents; SCENES.b_hall.ents = () => base().concat([
  doorE('boilerDoor', 19.5, .5, 'BOILER ROOM', 'boiler', 0, 7.2, Math.PI, { kind: 'metal' }),
  doorE('coldDoor', 11.5, 3.2, 'COLD STORAGE', 'cold', 7, .9, 0, { kind: 'metal', lock: async () => { if (F('boiler')) return true; setF('coldSeen'); sfx('empty'); await narr(['', 'COLD STORAGE. The door was frozen into its frame, a quarter inch of ice holding it shut like a grudge. Somebody would have to warm this whole floor up.', 'Frozen shut. Needs heat. The boiler.']); return false; } }),
]); }
// Act III: the backups find the ground floor again
{ const base = SCENES.thu_hall.ents; SCENES.thu_hall.ents = () => base().concat([foe('thu_c1', 'crawler', 6, 2.6, { cond: () => !MO.dead.thu_c1 && F('dblBoss') }), foe('thu_c2', 'crawler', 14, .9, { cond: () => !MO.dead.thu_c2 && F('dblBoss') })]); }
{ const base = SCENES.generator.ents; SCENES.generator.ents = () => base().concat([foe('gen_d3', 'drifter', 2.6, 6.4, { model: MOM.drifterRed, cond: () => !MO.dead.gen_d3 && F('dblBoss') }), itemE('gen_shells', 'shells', 4, -3.7, 6.2, { if: () => F('dblBoss') })]); }

// ================= 2F =================
SCENES.stairs.ents = () => [
  doorE('lobbyDoor', .5, 2, 'LOBBY', 'lobby', 8.1, 11.2, -PI2),
  doorE('up', 2.6, 4.0, 'STAIRS UP', 'wed_hall', 1, 1.8, PI2),
  lookE('sign', 3.4, .6, 'EXIT SIGN', ['An EXIT sign, red, still lit on its own battery. The only thing in the building with a plan for leaving.', 'EXIT. Still lit.', 'Exit.']),
  itemE('st_ammo', 'ammo', 6, 3.9, 1.2),
];
SCENES.wed_hall.ents = () => [
  doorE('downDoor', .5, 1.8, 'STAIRWELL', 'stairs', 2.6, 3.3, Math.PI),
  doorE('recordsDoor', 5, 3.2, 'RECORDS', 'records', 0, .9, 0),
  doorE('nurseDoor', 8, .4, 'NURSES\' STATION', 'nurse', 0, 5.2, Math.PI),
  doorE('theaterDoor', 12, 3.2, 'RECALL THEATER', 'theater', 0, .9, 0, { kind: 'double' }),
  doorE('securityDoor', 16, .4, 'SECURITY', 'security', 0, 5.2, Math.PI, { kind: 'metal', lock: secLock }),
  doorE('dirDoor', 19.5, 3.2, 'DIRECTOR', 'dir_office', 0, .9, 0),
  doorE('roofDoor', 23.5, 1.8, 'ROOF', 'roof', 1, 5, PI2, { kind: 'metal' }),
  lookE('marquee', 12, 2.2, 'MARQUEE', ['A marquee over the theater doors: TONIGHT - ORIENTATION - 7:30. The letters were red and patient. They had been announcing the same show for years.', 'TONIGHT. ORIENTATION. 7:30.', '7:30.'], { range: 1.2 }),
  lookE('portraits', 9.6, 3.1, 'PORTRAITS', ['Framed photographs of families in their good clothes, smiling at the camera in this hallway. Every photo had one person in it looking slightly to the left, like someone had called their name.', 'Families. One in each looking left.', 'Families.']),
  itemE('wed_las', 'lasagnaC', 1, 2.6, 2.7),
  foe('wed_d1', 'drifter', 10, 1.2, { model: MOM.drifterCoat }),
  foe('wed_c1', 'crawler', 17.5, 2.8),
  foe('wed_d2', 'drifter', 21, 2.4, { model: MOM.drifterRed, cond: () => !MO.dead.wed_d2 && F('audience') }),
];
SCENES.wed_hall.onEnter = async () => { if (F('wedSeen')) return; setF('wedSeen'); nerveDrop(4); await narr(['2F. The Wednesday ward: RECALL. A red runner down a long hall, family photographs, a marquee over a pair of theater doors. This was where people came to visit the ones they\'d kept. My radio hissed and gave up.', 'The Wednesday ward. Families came here to visit. My radio went to static.', '2F. Static on the radio.']); };
async function secLock() {
  if (F('secOpen')) return true;
  const code = await keypad();
  if (code === '1930') { setF('secOpen'); sfx('switch'); await narr(['7:30. Showtime. The door gave like it had been waiting for an usher.', '1930. Open.', 'Open.']); return true; }
  if (code !== null) { sfx('hurt'); await narr(['Wrong. Somebody up here would have written the code down, or something that rhymed with it. Nurses write everything down.', 'Wrong. The nurses\' station might know.', 'Wrong.']); }
  return false;
}
SCENES.records.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'wed_hall', 5, 2.9, Math.PI),
  lookE('lookup', 0, 5.1, 'RECORDS TERMINAL', recordsLookup),
  lookE('cabinets', -3.2, 3.6, 'CABINETS', ['Client files, A to Z, the drawers labeled by the day you were kept. Most of them said MONDAY. Long-term. People who weren\'t coming back to pick themselves up.', 'Files. Mostly MONDAY.', 'Files.']),
  filmCan('film1', 'film1', 1.8, 1.6, { y: .76 }),
  itemE('rec_ammo', 'ammo', 6, 3.2, 1),
  foe('rec_c1', 'crawler', -2.6, 5.4, { yaw: Math.PI }),
];
async function recordsLookup() {
  const names = ['GARFIELD, J.B.', 'KEEL, MARGARET', 'KEEL, OTIS', 'THE DIRECTOR'], docs = ['rec41', 'recMag', 'recOtis', 'recDir'];
  if (!F('lookupSeen')) { setF('lookupSeen'); await narr(['A green terminal with a cursor that had been blinking for years. It wanted a name. I had a short list.', 'It wants a name.', 'A name.']); }
  for (;;) { const i = await ask('RECORDS LOOKUP. WHOSE FILE?', null, names.concat(['DONE'])); if (i < 0 || i >= 4) return; sfx('tick'); await showDoc(docs[i], F('rec_' + i)); setF('rec_' + i); }
}
SCENES.nurse.ents = () => [
  doorE('door', 0, 5.5, 'CORRIDOR', 'wed_hall', 8, .8, 0),
  lookE('terminal', -2.4, 1.5, 'BACKUP TERMINAL', terminal),
  lookE('locker', 2.6, 1.3, 'LOCKER', locker),
  lookE('roster', .2, 3.4, 'DUTY ROSTER', () => showDoc('roster', F('roster'))),
  lookE('cot', -2.7, 3.4, 'COT', async () => { if (WX.rested) return narr(['I\'d already sat. The cot had nothing else to tell me.', 'Already sat.', 'Sat.']); WX.rested = 1; nerveGain(15); await narr(['I sat on the edge of the cot where the night nurse used to sit. The lamp was warm. Nobody up here needed anything from me for a full minute.', 'Sat a minute. The lamp was warm.', 'Sat.']); }),
  itemE('nur_tape', 'tape', 1, 2.6, 3.4, { y: .9 }),
  itemE('nur_coffee', 'coffee', 1, -.3, 3, { y: .76 }),
  itemE('nur_las', 'lasagnaC', 1, 2.7, 4.9),
];
SCENES.nurse.onEnter = async () => { if (F('nurseSeen')) return; setF('nurseSeen'); await narr(['A nurses\' station with a lamp left on, a cot, a terminal and a locker. Somebody had made this room for sitting up with people. (Safe room.)', 'A lamp left on. Safe. (Terminal, locker.)', 'Safe room.']); };
SCENES.security.ents = () => [
  doorE('door', 0, 5.5, 'CORRIDOR', 'wed_hall', 16, .8, 0, { kind: 'metal' }),
  lookE('log', -1.6, 3.2, 'SECURITY LOG', () => showDoc('guardlog', F('guardlog'))),
  lookE('monitors', 0, 1.3, 'MONITORS', async () => { sfx('static'); await narr(['Four monitors, three of them snow. The fourth showed the Friday gallery from above, empty. Then not empty. A hat at the edge of the frame, standing still the way I stand still. Then gone.', 'Snow. Then the Friday gallery. A hat. Then gone.', 'A hat on the monitor. Gone.']); nerveDrop(4); }),
  itemE('sec_shotgun', 'shotgun', 1, -3.0, 3, { y: 1.1, after: async () => { await narr(['A pump shotgun, four in the tube, off a rack that had been waiting for an emergency with more patience than the emergency. (Items: USE the shotgun to carry it. Hold C to aim, Z to fire. It doesn\'t miss up close.)', 'A shotgun. (USE it in ITEMS to switch.)', 'Shotgun. (USE to switch.)']); MO.shot = 4; } }),
  itemE('sec_shells', 'shells', 8, 2.6, 4.6),
  filmCan('film2', 'film2', 2.6, 2.4, { y: 1 }),
];
// the Recall Theater: before the show they're in the seats, facing an empty screen
const SEATED = [[-2.2, 4.6], [-4.1, 6.0], [2.6, 3.2], [4.4, 6.0], [1.4, 7.4], [-1.4, 3.2]];
const AUDPOS = [[0, 8.6], [-4.8, 8.6], [4.8, 8.6], [-5.2, 2.2], [0, 2.2], [5.2, 2.4], [-.2, 5.2]];
DOCS.showcue = {
  title: 'Dale\'s screening cue sheet',
  body: 'RECALL THEATER - IF THE TRANSPORT STALLS\n\nThe audience remembers a show with an ending. A missing last card brings them into the aisles.\n\nAt the projector, hold Z without aiming for two seconds to restart the transport. Keep moving while the last twelve seconds run. At the credits, hold Z for two seconds at the HOUSE LIGHTS switch on the far left wall.\n\nLetting go or being struck interrupts the work. Aisles connect around the front and back of the rows. Leave yourself room.\n\nA complete show has returned them to their seats before. Clearing the room by force also ends the incident. -DALE',
  after: async () => { setF('showcueRead'); await narr(['An unfinished show. A transport, twelve seconds, and the house lights. Dale had written down another way to end an evening.', 'Restart the film. Keep moving. House lights at the credits.', 'Film. Credits. Lights.']); }
};
SCENES.theater.isDark = () => !!F('showOn');
// the rows are walls to anything walking: across them, head for the nearest aisle first
SCENES.theater.steer = e => {
  const band = z => z > 2.6 && z < 8.0, ez = e.p[2], jz = CARL.p[2], ax = Math.abs(e.p[0]);
  if (!band(ez) && !band(jz) && (ez - 5.3) * (jz - 5.3) > 0) return null;
  const lane = ax < 3.1 ? 0 : Math.sign(e.p[0]) * 5.5;
  if (Math.abs(e.p[0] - lane) > .25) return [lane, ez];                     // into the aisle first
  if (band(jz) && Math.abs(CARL.p[0] - lane) < .8) return null;              // he's in this aisle: straight at him
  return [lane, jz < 5.3 ? Math.min(jz, 2.3) : Math.max(jz, 8.3)];           // walk the aisle out past the rows
};
SCENES.theater.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'wed_hall', 12, 2.9, Math.PI, { kind: 'double', lock: async () => { if (!F('showOn')) return true; sfx('empty'); await narr(['The doors wouldn\'t move. The show wasn\'t over.', 'Locked. The show isn\'t over.', 'Locked.']); return false; } }),
  lookE('projector', 4.6, 1.5, 'PROJECTOR', projectorTalk, { liveUse: () => !!F('showOn') }),
  lookE('cue', 5.4, 2.1, 'DALE\'S CUE SHEET', () => showDoc('showcue', F('showcueRead')), { range: 1.1 }),
  lookE('house', -5.35, 8.8, 'HOUSE LIGHTS', () => narr(['House lights. The cue sheet by the projector describes the last cue.', 'House lights. Check the cue sheet.', 'Lights. Cue sheet.']), { range: 1.3, liveUse: () => !!F('showOn') }),
  lookE('screen', 0, 8.9, 'SCREEN', () => narr(F('audiencePreserved') ? ['THE END. The card was still on the screen. An ordinary ending had been the missing part of an extraordinary problem.', 'THE END. The last card.', 'THE END.'] : ['A screen as big as a wall and as blank as a promise. People sat in front of it on Wednesdays to watch somebody they\'d lost walk around a room.', 'The screen. Blank.', 'Screen.']), { cond: () => !F('showOn') }),
  lookE('seats', -.9, 4.6, 'AUDIENCE', () => narr(F('audiencePreserved') ? ['The remaining audience sat down at the credits. I could record that much without deciding what to call them.', 'They sat down. That is what I saw.', 'Seated again.'] : ['They sat in the seats facing the blank screen, dressed for an evening out, very still. Not people. Not anymore. Waiting for the show like it was the only thing they had left to remember.', 'They\'re sitting there. Waiting for the show.', 'They\'re waiting.']), { cond: () => !F('film') || !!F('audiencePreserved') }),
  itemE('th_shells', 'shells', 4, -5.2, 1.2, { if: () => F('audience') }),
  itemE('th_las', 'lasagnaC', 1, 5.4, 8.8),
  itemE('th_tape', 'tape', 1, 4.4, 8.8),
];
SCENES.theater.onEnter = async () => { if (F('theaterSeen')) return; setF('theaterSeen'); nerveDrop(6); await narr(['The Recall Theater. Red seats in rows, a screen like a held breath, and an audience. Six of them, in their good clothes, watching nothing. None of them turned around. I would have preferred it if one of them had.', 'An audience. Watching a blank screen. None of them turned around.', 'They\'re watching nothing.']); };
SCENES.theater.drawOver = () => {
  if (F('reelRunning') || F('audiencePreserved')) {
    const p = project(LIVE.cam, [0, 2.4, 9.75]), label = F('audiencePreserved') || (MO.recallFrames || 0) >= 720 ? 'THE END' : 'ORIENTATION';
    if (p) text(label, p[0] - label.length * 3, p[1], UI3.hot, 0);
  }
  if (F('film') && !F('showOn') && !F('audiencePreserved')) return;
  for (let k = 0; k < SEATED.length; k++) {
    if (MO.dead['aud' + (k + 1)] || (F('showOn') && k < (MO.aud || 0))) continue;
    const [x, z] = SEATED[k], p = [x, -.38, z];
    drawGlitch(MOM.audience[k % MOM.audience.length], { p, yaw: 0, pose: { legL: -1.4, legR: -1.4, armL: -.5, armR: -.5, headYaw: k === 3 && (WX.t % 400) < 60 ? .9 : 0 }, seed: k * 7 }, liveLight(WX.sc, p), .12);
  }
};
SCENES.theater.tick = () => {
  if (!F('showOn') || F('audience') || frozen3()) return;
  const projector = ent3('projector'), house = ent3('house');
  // A restored visit rebuilds the standing audience; deleted seats stay empty.
  if (!projector.recallInit) { projector.recallInit = 1; MO.aud = 0; WX.audT = WX.t + 60; WX.audDone = 0; WX.recallWork = 0; }
  while (MO.aud < 6 && MO.dead['aud' + (MO.aud + 1)]) MO.aud++;
  const live = foes().length;
  if (MO.aud < 6 && live < 2 && WX.t >= WX.audT) {
    let best = AUDPOS[0], bd = -1; for (const q of AUDPOS) { const d = Math.hypot(q[0] - CARL.p[0], q[1] - CARL.p[2]) + Math.random() * 2; if (d > bd && walkable(q[0], q[1])) { bd = d; best = q; } }
    MO.aud++; WX.audT = WX.t + 150; sfx('groan');
    const hp = Math.max(1, Math.round(4 * hpK())); addEnt3(foe('aud' + MO.aud, 'drifter', best[0], best[1], { cond: null, aggro: 1, hp, hp0: hp, model: MOM.audience[MO.aud % MOM.audience.length] }));
  }
  if (MO.aud >= 6 && !foes().length && !WX.audDone) { WX.audDone = 1; wstory(() => audienceDone('combat')); return; }
  if (F('reelRunning')) {
    MO.recallFrames = Math.min(720, (MO.recallFrames || 0) + 1);
    if (MO.recallFrames % 60 === 0 && MO.recallFrames < 720) sfx('projector');
  }
  const credits = F('reelRunning') && MO.recallFrames >= 720, station = F('reelRunning') ? house : projector;
  projector.label = F('reelRunning') ? 'PROJECTOR RUNNING' : 'PROJECTOR / HOLD Z';
  house.label = credits ? 'HOUSE LIGHTS / HOLD Z' : 'HOUSE LIGHTS';
  const working = (!F('reelRunning') || credits) && held.a && !CARL.aim && !CARL.inv && nearest3() === station;
  WX.recallWork = working ? (WX.recallWork || 0) + 1 : 0;
  if (WX.recallWork >= 120) {
    WX.recallWork = 0; sfx('switch');
    if (!F('reelRunning')) { setF('reelRunning'); MO.recallFrames = 0; }
    else { WX.audDone = 1; wstory(() => audienceDone('screening')); return; }
  }
  WX.banner = { s: working ? (credits ? 'HOUSE LIGHTS ' : 'PROJECTOR ') + Math.floor(WX.recallWork / 120 * 100) + '%' :
    !F('reelRunning') ? 'TRANSPORT STALLED / HOLD Z AT PROJECTOR' :
    !credits ? 'REEL TURNING / ' + Math.ceil((720 - MO.recallFrames) / 60) + ' SECONDS' : 'CREDITS / HOLD Z AT HOUSE LIGHTS', t: 2 };
};
async function projectorTalk() {
  if (F('audience')) return narr(['The projector, cold. The film had said its piece.', 'Cold.', 'Cold.']);
  if (F('showOn')) return;
  if (!F('spliced')) {
    const n = ['film1', 'film2', 'film3'].filter(invHas).length;
    if (n < 3) return narr(['A projector in a booth stand, threaded with nothing. ' + (n ? 'I had ' + n + ' of the three cans.' : 'The film was cut into three cans, the security log said.') + ' I needed all of it.', n + ' of 3 cans. I need all three.', n + ' of 3.']);
    const left = ['CAN A', 'CAN B', 'CAN C'], order = [];
    for (let k = 0; k < 2; k++) { const i = await ask(['SPLICE THE FILM. WHICH CAN GOES FIRST?', 'WHICH CAN GOES SECOND?'][k], null, left); if (i < 0) return; order.push(left.splice(i, 1)[0]); }
    order.push(left[0]);
    if (order.join(',') !== 'CAN B,CAN A,CAN C') {
      sfx('projector'); await wait(30); sfx('glitch'); post.flash = .3; nerveDrop(6);
      await say('(THE TITLE CARDS COME UP OUT OF ORDER AND ARGUE WITH EACH OTHER. THEN THE FILM TEARS.)', null);
      await narr(['In the dark, one of the audience stood up, the way you stand up when the movie\'s wrong and you\'ve paid. The leaders on the cans would tell me what came after what. Ends match beginnings.', 'Wrong order. One of them stood up. Ends match beginnings.', 'Wrong. Ends match beginnings.']);
      MO.tears = (MO.tears || 0) + 1; addEnt3(foe('tear' + MO.tears, 'drifter', -.2, 5.2, { persist: false, cond: null, aggro: 1, model: MOM.audience[MO.tears % 5] }));
      return;
    }
    setF('spliced'); for (const f of ['film1', 'film2', 'film3']) invTake(f); sfx('tick');
  }
  return filmShow();
}
const FILMCARDS = [['MERIDIAN CONTINUITY CENTER', 'PRESENTS'], ['WELCOME TO MERIDIAN.'], ['WE KEEP EVERYTHING', 'YOU WOULD WANT BACK.'], ['ON WEDNESDAYS,', 'FAMILY MAY VISIT.'], ['A FEW WORDS', 'FROM THE DIRECTOR.'], ['"WE OPENED IN"', '19'], ['79.'], ['"FORTY-ONE FAMILIES TRUSTED US', 'THE FIRST YEAR."', '41'], ['THE END']];
async function filmShow() {
  WX.hold++;
  try {
    music(null); sfx('projector'); await fadeOut(.05);
    const prev = scene; let t = 0, card = 0;
    scene = { update() { t++; }, draw() { cls(hex('#000000')); const fl = 200 + ((hash2(t >> 1, 7) * 40) | 0); rectF(20, 16, 280, 180, rgb(fl * .85, fl * .85, fl * .82));
      for (let i = 0; i < 6; i++) { const x = (hash2(i, t >> 2) * 280) | 0; rectF(20 + x, 16, 1, 180, rgb(fl * .6, fl * .6, fl * .6)); }
      const L = FILMCARDS[Math.min(card, FILMCARDS.length - 1)]; L.forEach((s, i) => { const big = /^\d+\.?$/.test(s); ctext(s, 80 + i * 16 + (big ? 6 : 0), hex('#1a1a1a'), 0, big ? 3 : 1); });
      if (card === 5 || card === 6) { rectF(130, 150, 60, 30, hex('#3a3a3a')); circF(160, 140, 10, hex('#e8e8e8')); }
      if ((t >> 3) & 1) pset(30 + (hash2(t, 3) * 260 | 0), 30 + (hash2(t, 5) * 150 | 0), hex('#000000')); } };
    await fadeIn(.05);
    for (card = 0; card < FILMCARDS.length - 1; card++) { sfx('projector'); await wait(card >= 5 && card <= 7 ? 130 : 90); }
    await fadeOut(.05); scene = prev; setF('film');
    await fadeIn(.05);
    await narr(['Three numbers, each on its own card, each held a beat too long. Nineteen. Seventy-nine. Forty-one. He kept his numbers in his films, the guard had said. Then the transport stopped before THE END, the lights died, and I could hear them standing up.', '19. 79. 41. Then the lights went, and they stood up.', '19, 79, 41. They stood up.']);
    setF('showOn'); setF('reelRunning', 0); MO.recallFrames = 0; MO.aud = 0; WX.audT = WX.t + 60; WX.audDone = 0; WX.recallWork = 0; ent3('projector').recallInit = 1; WX.bgCache = {}; relight(); music('mo_audience'); sfx('shriek');
    await say(F('showcueRead') ? 'Dale\'s last cue: restore the projector, keep moving through the credits, then bring up the far house lights. Hold Z at the controls. I can also clear the room by force.' : 'The last card never ran. There is a cue sheet beside the projector. I can try its procedure or fight the ones standing up.', NARR);
  } finally { WX.hold--; }
}
async function audienceDone(method = 'combat') {
  if (method === 'screening') {
    setF('audiencePreserved', 6 - Array.from({ length: 6 }, (_, k) => MO.dead['aud' + (k + 1)] ? 1 : 0).reduce((a, b) => a + b, 0));
    for (const e of foes()) e.gone = 1;
  }
  await wait(40); setF('audience'); setF('showOn', 0); setF('reelRunning', 0); WX.banner = null; WX.bgCache = {}; relight(); music('mo_theater'); post.flash = .4; sfx('power');
  ent3('projector').label = 'PROJECTOR'; ent3('house').label = 'HOUSE LIGHTS';
  if (method === 'screening') await narr(['The last card ran. The house lights came up. ' + F('audiencePreserved') + ' of them were back in their seats, facing the screen. Show\'s over. I had let it end.', 'The credits. Lights. They sat down again.', 'They sat down. Over.']);
  else await narr(['The house lights came back up on an empty theater. Show\'s over. Nobody clapped. The director\'s numbers were still in my head: 19, 79, 41.', 'Lights up. Empty. 19, 79, 41.', 'Over. 19, 79, 41.']);
}
SCENES.dir_office.ents = () => [
  doorE('door', 0, .5, 'CORRIDOR', 'wed_hall', 19.5, 2.9, Math.PI),
  lookE('safe', 3.4, 3.5, 'WALL SAFE', safeTalk),
  lookE('desk', -.2, 3.6, 'DESK', ['The director\'s desk, cleared off like a man who meant to come back and didn\'t. A nameplate turned face down. I didn\'t turn it over. Some people earn the right to stay anonymous by being bad at their job.', 'Cleared off. Nameplate face down.', 'Desk.']),
  lookE('portrait', -2, 6.4, 'PORTRAIT', ['A portrait of the director, I assumed. The flash had caught his glasses and turned his face into two white coins. Whoever took it either hated him or knew him well.', 'A portrait. The glare ate his face.', 'His face. Glare.']),
  lookE('shelf', -3.1, 3.5, 'BOOKSHELF', ['Binders: FIDELITY STANDARDS, 1979 - 1991. And one paperback mystery, spine cracked at the last chapter. Even directors want to know how it ends.', 'Binders. One mystery novel.', 'Books.']),
  itemE('dir_shells', 'shells', 4, 3.0, 3.5, { n: F('safeShells') || 4, if: () => F('safeShells') }),
  itemE('dir_las', 'lasagnaC', 1, 2.6, 5.2),
  foe('dir_d1', 'drifter', -1.6, 5.4, { model: MOM.drifterCoat, yaw: Math.PI }),
];
async function safeTalk() {
  if (F('dirCard')) return narr(['The safe stood open and empty, the way safes look after they\'ve told you everything.', 'Open. Empty.', 'Empty.']);
  if (!F('safeSeen')) { setF('safeSeen'); await narr(['A wall safe with a dial, three numbers. The director\'s card was in there, if his memo told the truth. Memos usually do. It\'s the people who don\'t.', 'A safe. Three numbers.', 'Safe. Three numbers.']); }
  const d = await safeDial(); if (!d) return;
  if (d.join('-') !== '19-79-41') { sfx('empty'); return narr(F('film') ? ['The handle didn\'t move. Not those. The film had shown me three numbers, one card at a time.', 'Not those. The film\'s numbers.', 'Wrong.'] : ['The handle didn\'t move. The director kept his numbers in his films, the guard had said. I hadn\'t seen his films.', 'Wrong. The numbers are in his film.', 'Wrong.']); }
  sfx('switch'); await wait(20); setF('dirCard'); invAdd('dirCard'); const left = invAdd('shells', 4); if (left) { setF('safeShells', left); ent3('dir_shells').n = left; } sfx('get');
  await say('PICKED UP DIRECTOR\'S CARD.' + (4 - left ? ' PICKED UP ' + (4 - left) + ' 12-GA SHELLS.' : '') + (left ? ' ' + left + ' 12-GA SHELLS LEFT BY THE SAFE.' : ''), null);
  await showDoc('dirJournal');
}
async function safeDial() {
  const prev = scene, d = [0, 0, 0]; let i = 0, out, hold = 0;
  scene = { draw() { prev.draw(); plate(80, 56, 160, 96, { alpha: .95 }); shadowText('WALL SAFE', 128, 62, UI3.name);
    d.forEach((v, k) => { const x = 104 + k * 40; rectF(x, 84, 32, 24, hex('#0a0a0a')); frameRect(x, 84, 32, 24, k === i ? UI3.name : hex('#5a5a5a')); text(String(v).padStart(2, '0'), x + 4, 88, hex('#ff9a3a'), 0, 2); if (k === i) { triF(x + 16, 78, x + 12, 82, x + 20, 82, UI3.name); triF(x + 16, 114, x + 12, 110, x + 20, 110, UI3.name); } });
    text('UP/DOWN TURN  Z TRY  C BACK', 92, 130, UI3.dim, 0); } };
  for (;;) {
    DBG.ui = { k: 'safe', d, i }; await nextFrame();
    const dir = (held.up ? 1 : 0) - (held.down ? 1 : 0);
    if (pressed.up || pressed.down) { d[i] = (d[i] + dir + 100) % 100; hold = 0; sfx('dial'); } else if (dir) { if (++hold > 14 && hold % 3 === 0) { d[i] = (d[i] + dir + 100) % 100; sfx('dial'); } } else hold = 0;
    if (pressed.left) { i = (i + 2) % 3; sfx('move'); } if (pressed.right) { i = (i + 1) % 3; sfx('move'); }
    if (pressed.a) { out = d.slice(); break; } if (pressed.c || pressed.b) { out = null; break; }
  }
  DBG.ui = null; scene = prev; return out;
}
// the roof: the projectionist's last can, and the antenna that lets Yoko hear you up here
SCENES.roof.ents = () => [
  doorE('door', .6, 5, 'CORRIDOR', 'wed_hall', 23.1, 1.8, -PI2, { kind: 'metal' }),
  lookE('rotor', 10.5, 6.2, 'ANTENNA ROTOR', antennaTalk),
  lookE('tower', 1, 8.6, 'RED LIGHT', async () => { setF('towerSeen'); await narr(['Out past the parapet, west, a red light blinked on a hill: the Channel 8 tower on Kettle Hill. The station that had me on the air at 11:14 that Friday. Due west, near enough.', 'The CH 8 tower. Due west.', 'Tower. West.']); }),
  lookE('butts', 1.9, 1.7, 'COFFEE CAN', ['A coffee can full of cigarette butts and rainwater. Dale the projectionist had stood here a lot, looking at the same red light, thinking about the same show.', 'Cigarette butts. Dale stood here a lot.', 'Butts.']),
  filmCan('film3', 'film3', 2.7, 1.4),
  itemE('roof_ammo', 'ammo', 6, 13, 9.2),
  foe('roof_d1', 'drifter', 7.5, 8.6, { model: MOM.drifterRed }),
];
SCENES.roof.drawOver = () => { if ((WX.t >> 5) & 1) { const p = project(LIVE.cam, [-48, 8.3, 6]); if (p) { circF(p[0], p[1], 2, hex('#ff2a1a')); pset(p[0], p[1], WHITE); } } };
SCENES.roof.onEnter = async () => { if (F('roofSeen')) return; setF('roofSeen'); await narr(['The roof. Rain like it had been saving up. An antenna mast on the east side, a red light blinking on a hill out west, and the whole valley dark around this one building that wouldn\'t be.', 'The roof. Rain. An antenna. A red light out west.', 'Roof. Rain.']); };
async function antennaTalk() {
  if (F('antenna')) return narr(['The rotor hummed, aimed west at Kettle Hill. Yoko was on the other end of it, somewhere dry.', 'Aimed west. Yoko\'s there.', 'West.']);
  if (!F('rotorSeen')) { setF('rotorSeen'); await narr(['A rotor box at the foot of the mast. A plate: RELAY - AIM AT CH 8, KETTLE HILL. Somebody had scratched a compass rose into the paint with a key.', 'RELAY. AIM AT CH 8, KETTLE HILL.', 'Aim at CH 8.']); }
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], i = await ask('AIM THE RELAY ANTENNA:', null, dirs.concat(['LEAVE IT'])); if (i < 0 || i === 8) return;
  sfx('switch'); await wait(30);
  if (dirs[i] !== 'W') { sfx('static'); return narr(['Static, then more static. Kettle Hill wasn\'t ' + dirs[i] + '. The red light out past the parapet would know which way it was.', 'Static. Wrong way. Find the red light.', 'Static.']); }
  setF('antenna'); sfx('ok');
  await yokoSay([[YO, '-JB? JB! There you are. You dropped off the second you went upstairs.'], ['JB', 'I fixed an antenna in the rain. I want that on the record.'], [YO, 'It\'s on the record. Listen. I got the county\'s copy of the Meridian client list. There\'s a Keel on it. Margaret Keel, kept in 1986. Otis\'s wife. She died the next spring.'], ['JB', 'So that\'s why he stayed on.'], [YO, 'I think he stayed to visit her. Find him, JB.'], ['JB', 'Working on it. Hey. Film reels. You know anything about film reels?'], [YO, 'The first reel has the countdown on it. Everybody knows that.'], ['JB', 'Everybody does now.']]);
  setF('maggieRec');
}
// ================= B1 =================
SCENES.boiler.ents = () => [
  doorE('door', 0, 7.5, 'CORRIDOR', 'b_hall', 19.5, .8, 0, { kind: 'metal' }),
  lookE('valves', 3.8, 4.2, 'VALVE PANEL', valvePanel),
  lookE('chart', 4.0, 6.3, 'PRESSURE CHART', () => showDoc('chart', F('chartRead')).then(() => setF('chartRead'))),
  lookE('boilerLook', .1, 3.6, 'BOILER', () => F('boiler') ? narr(['', 'The boiler roared like a furnace that had something to prove. Somewhere down the hall, ice was letting go.', 'Lit. The ice is going.']) : narr(['', 'A boiler the size of a parked car, cold to the touch. The firebox door was black. Whatever it heated had been freezing for nine days.', 'Cold. Nine days.'])),
  itemE('boil_shells', 'shells', 4, -3.6, 7.2),
  itemE('boil_tape', 'tape', 1, -3.6, 6.2),
  foe('boil_c1', 'crawler', 2.6, 1.2),
];
SCENES.boiler.onEnter = async () => { if (F('boilerSeen')) return; setF('boilerSeen'); await narr(['', 'The boiler room. Red light, pipes, a boiler that hadn\'t been lit since Otis wrote BOILER OFF on his note. A valve panel with three red handles and three gauges.', 'Boiler room. Three valves. Three gauges.']); };
const VALVE = [[0, 1], [1, 2], [2, 0]];
async function valvePanel() {
  if (F('boiler')) return narr(['', 'All three needles in the green, holding. Otis would have approved.', 'Green. Holding.']);
  if (!line(1)) { setF('boilerDead'); sfx('empty'); return narr(['', 'The panel was dead. A tag on the conduit: BOILER LINE - GENERATOR PANEL. Otis\'s note had said BOILER OFF, and the generator only carries two lines. Something would have to give upstairs.', 'Dead. The BOILER line is off at the generator. Two lines at most.', 'No power. Generator: BOILER line.']); }
  if (!MO.gauge) MO.gauge = [3, 0, 1];
  const prev = scene; let i = 0, act = null;
  scene = { draw() { prev.draw(); plate(60, 34, 200, 156, { alpha: .96 }); shadowText('BOILER PRESSURE', 76, 40, UI3.name); text('Z TURN  C BACK', 180, 40, UI3.dim, 0);
    ['A', 'B', 'C'].forEach((g, k) => { const cx = 100 + k * 60, cy = 80, v = MO.gauge[k]; circF(cx, cy, 19, hex('#d8d4c4')); for (let m = 0; m < 4; m++) { const a = -2.6 + m * 1.2, c = m === 2 ? hex('#4aa84a') : m === 3 ? hex('#d82020') : hex('#6a6a6a'); for (let r = 13; r < 18; r++) pset(cx + Math.cos(a) * r | 0, cy + Math.sin(a) * r | 0, c); } const a = -2.6 + v * 1.2; lineF(cx, cy, cx + Math.cos(a) * 14, cy + Math.sin(a) * 14, hex('#1a1a1a')); circF(cx, cy, 2, hex('#1a1a1a')); text(g, cx - 3, cy + 23, UI3.text, 0); });
    ['VALVE 1   (A, B)', 'VALVE 2   (B, C)', 'VALVE 3   (C, A)', 'LIGHT THE BURNER'].forEach((nm, k) => { const y = 122 + k * 14; if (k === i) rectA(76, y - 3, 170, 13, hex(k === 3 ? '#c81818' : '#ff9a3a'), k === 3 ? .3 : .2); text(nm, 92, y, k === 3 ? hex('#ff5a4a') : UI3.text, 0); }); } };
  for (;;) { DBG.ui = { k: 'valves', i, g: MO.gauge }; await nextFrame(); if (pressed.up) { i = (i + 3) % 4; sfx('move'); } if (pressed.down) { i = (i + 1) % 4; sfx('move'); } if (pressed.c || pressed.b) break; if (pressed.a) { if (i < 3) { for (const g of VALVE[i]) MO.gauge[g] = (MO.gauge[g] + 1) % 4; sfx('valve'); } else { act = 'light'; break; } } }
  DBG.ui = null; scene = prev; if (!act) return;
  if (!MO.gauge.every(v => v === 2)) { sfx('hiss'); WX.shake = 8; nerveDrop(4); return narr(['', 'The burner caught, coughed and went out in a sigh of steam. Not all three needles had been in the green. The chart on the wall had opinions about that.', 'It went out. All three in the green first.', 'Out. All green first.']); }
  setF('boiler'); sfx('power'); WX.shake = 14; post.flash = .4; WX.bgCache = {}; relight();
  await narr(['', 'The burner caught and held, and the boiler started to roar like it had been waiting nine days to say something. The pipes knocked all the way down the hall. Somewhere, ice let go of a door.', 'Lit. The pipes knocked. Ice let go somewhere.', 'Lit. The ice is going.']);
}
SCENES.cold.ents = () => [
  doorE('door', 7, .5, 'CORRIDOR', 'b_hall', 11.5, 2.9, Math.PI, { kind: 'metal' }),
  itemE('windKey', 'windKey', 1, 13.1, 9.3, { y: .9, after: async () => narr(['', 'The winding key, hung on the last shelf of the coldest row, where Otis had said. Frost in the teeth. It was going to make it Monday.', 'The winding key.', 'Key.']) }),
  itemE('cold_maggie', 'maggie', 1, .8, 6.6, { y: 1.1, if: () => !F('maggieGiven'), after: async () => { nerveGain(10); await narr(['', 'A small reel in a paper sleeve, set apart from the others: KEEL, MARGARET. Somebody had written "Maggie" on it, and "Mondays." I put it inside my coat where it wouldn\'t freeze. It already had, for years. Habit.', 'Maggie. I put it in my coat.', 'Maggie.']); } }),
  lookE('note', 2.6, 6.5, 'NOTE', () => showDoc('otisCold', F('otisColdRead')).then(() => setF('otisColdRead'))),
  lookE('rows', 7, 1.8, 'STACKS', ['Rows of reels behind frost, every one of them somebody kept on a Monday and never picked up. The cold was for the tape. It felt like it was for something else.', 'Reels under frost. Mondays.', 'Reels.']),
  itemE('cold_shells', 'shells', 4, 13.3, 1.2),
  itemE('cold_las', 'lasagnaC', 1, .8, 1.2),
  itemE('cold_tape', 'tape', 1, 1.8, 1.2),
  foe('cold_loop', 'loop', 1.2, 3.9, { path: [[1.2, 3.9], [13, 3.9]] }),
  foe('cold_c1', 'crawler', 3.2, 6.5),
  foe('cold_c2', 'crawler', 12.6, 6.5),
  foe('cold_d1', 'drifter', 6, 9, { model: MOM.drifterCoat }),
];
SCENES.cold.onEnter = async () => { if (F('coldIn')) return; setF('coldIn'); nerveDrop(5); await narr(['', 'Cold storage. The Monday stacks. Water ran off the shelves where the ice was letting go, and the flashlight found reels, rows of them, and things between the rows that had been waiting in the cold a long time.', 'Cold storage. Reels. Things between the rows.', 'Cold. Things moving.']); };

// ================= THE OBJECTIVE, all of it =================
// A collected item may be in storage; never send the player to its empty pickup.
function lockerLead(id) {
  if (!MO.box.some(s => s.id === id && s.n > 0)) return null;
  const floor = SCENES[WX.id] ? SCENES[WX.id].floor : 1, room = floor === 2 ? 'nurse' : floor === 0 ? 'b_safe' : 'lounge';
  return [ITEM[id].name + ' is in the shared locker. Take it out at ' + MAPNAME[room] + '.', room, 'locker'];
}
function objective() {
  if (!F('inside')) return ['Otis Keel is somewhere inside. Front doors.', 'steps', 'frontDoor'];
  if (!F('log1')) return ['Otis lived in the job. Check the intake office, end of the Tuesday ward.', 'intake', 'desk'];
  if (!F('keypad')) return ['The consultation room keypad. Otis said the code is the year on the lobby plaque.', 'tue_hall', 'consultDoor'];
  if (!F('thuOpen') && !invHas('thuKey')) return lockerLead('thuKey') || ['There was a key on the hook in the consultation room.', 'consult', 'thuKey'];
  if (!F('thuOpen')) return ['The Thursday key opens the east door of the lobby.', 'lobby', 'eDoor'];
  if (!F('fuseIn') && !invHas('fuse')) return lockerLead('fuse') || ['The generator needs a main fuse. Try the tape archive.', 'archive', 'fuse'];
  if (!F('note')) return ['Otis left a note about the breakers somewhere in the archive.', 'archive', 'note'];
  if (!F('power')) return ['Get the power on. Generator room, east end of the Thursday ward.', 'generator', 'panel'];
  if (!F('dblBoss') && !line(0)) return ['Friday is off. Return to the generator: FRIDAY + LIFT on, BOILER and STACKS off.', 'generator', 'panel'];
  if (!F('footage')) return ['The Friday ward is open. Fidelity control is at its west end.', 'control', 'secmon'];
  if (!F('suiteA')) return ['Walk Suite A and make it match the record.', 'suite_a', ['polaroid', 'hat', 'clock', 'switch'].find(k => !({ polaroid: F('polaroid'), hat: F('aHat'), clock: F('aClock'), switch: F('aRain') })[k]) || 'fid'];
  if (!F('suiteB')) return ['Suite B. Establish the missing action, then rebuild the tea round.', 'suite_b', !F('ktape') ? 'recorder' : !F('cupTrace') ? 'cupboard' : !F('kitchenGap') ? 'recorder' : KSEQ[MO.kseq || 0]];
  if (!F('deskOpen')) return lockerLead('deskKey') || ['That key opens the director\'s desk in fidelity control.', 'control', 'desk'];
  if (!F('stairsOpen')) return lockerLead('stairKey') || ['The stairwell key. The sealed door at the east end of the lobby.', 'lobby', 'stairDoor'];
  if (!F('wedSeen')) return ['Upstairs. 2F.', 'stairs', 'up'];
  if (!F('roster')) return ['There\'s a nurses\' station on 2F. Nurses write things down.', 'nurse', 'roster'];
  if (!F('secOpen')) return ['Security\'s door code is the theater\'s showtime.', 'wed_hall', 'securityDoor'];
  if (!F('guardlog')) return ['The security log on the desk.', 'security', 'log'];
  if (!F('spliced') && !invHas('film2')) return lockerLead('film2') || ['A film can in the security locker.', 'security', 'film2'];
  if (!F('spliced') && !invHas('film1')) return lockerLead('film1') || ['A film can in Records.', 'records', 'film1'];
  if (!F('spliced') && !invHas('film3')) return lockerLead('film3') || ['The projectionist took the last can up to the roof.', 'roof', 'film3'];
  if (!F('antenna') && !F('towerSeen')) return ['The relay antenna on the roof needs a heading. Something on the horizon.', 'roof', 'tower'];
  if (!F('antenna')) return ['Aim the relay at the CH 8 tower. Get Yoko back.', 'roof', 'rotor'];
  if (!F('audience')) return [F('showOn') ? F('reelRunning') ? 'Keep moving through the credits; the far house lights finish the show. Clearing the room also works.' : 'The show stalled. The cue sheet describes the projector and house lights. Survive or finish the screening.' : 'Three cans. The projector in the Recall Theater. Ends match beginnings.', 'theater', F('showOn') && F('reelRunning') ? 'house' : 'projector'];
  if (!F('dirCard')) return ['The director\'s numbers: 19, 79, 41. His safe.', 'dir_office', 'safe'];
  if (!F('suiteC')) return ['Suite C is open. The diner.', 'suite_c', 'otisRe'];
  if (!F('card41')) return ['Fidelity control says your card is ready.', 'control', 'console'];
  if (!F('dblBoss')) return ['Get out of the Friday ward.', 'fri_hall', 'lobbyDoor'];
  if (!F('slot_otisCard') && !invHas('otisCard')) return lockerLead('otisCard') || ['He dropped something. Otis\'s card.', 'fri_hall', 'otisCard'];
  if (!line(2) && SCENES[WX.id].floor !== 0) return ['The lift line is off. Restore LIFT at the generator before returning to B1. Keep only one other line on; STACKS stays off.', 'generator', 'panel'];
  if (!F('liftOn')) {
    for (const id of ['dirCard', 'card41', 'otisCard']) if (!F('slot_' + id) && !invHas(id)) { const stored = lockerLead(id); if (stored) return stored; }
    return ['Three cards. The lift in the lobby.', 'lobby', 'lift'];
  }
  if (!F('log4')) return ['Otis has to be down there. Search the Monday ward.', 'b_safe', 'cot'];
  if (!F('wound') && !invHas('windKey')) {
    const stored = lockerLead('windKey'); if (stored) return stored;
    if (!F('clockSeen')) return ['The master clock in Otis\'s camp.', 'b_safe', 'clock'];
    if (!F('boiler')) return line(1) ? ['Light the boiler. All three gauges in the green.', 'boiler', 'valves'] : ['The boiler line is off. At the generator: BOILER on, keep the LIFT, two lines at most.', 'generator', 'panel'];
    return ['Cold storage is thawed. The winding key.', 'cold', 'windKey'];
  }
  if (!F('monday')) return ['Wind the master clock. Make it Monday.', 'b_safe', 'clock'];
  if (!F('otisOut')) return ['Otis is in the quiet room by the vault.', 'vault_ante', 'otis'];
  if (!F('composite')) return ['The vault. The original is in there.', 'vault', 'door'];
  return ['Decide what happens to the original.', 'vault', 'reel'];
}

// Help is requested one layer at a time and never changes evidence or puzzle state.
function leadHints(o = objective()) {
  const [, room, id] = o;
  if (room === 'tue_hall' && id === 'consultDoor') return ['What would Otis use for a number he had to remember?', 'Read his intake log and the founding plaque in the lobby. The opening year is the code.', 'Enter 1979 at the consultation keypad.'];
  if (room === 'generator' && id === 'panel') return ['Which two services do I need next?', "Otis's breaker note is in the archive. The panel carries two lines; STACKS trips it. Check the map for the current feeds.", !F('power') ? 'Insert the fuse. Turn FRIDAY and LIFT on, BOILER and STACKS off, then engage MAIN.' : o[0]];
  if (room === 'suite_a') return ['What changed between the office and its record?', 'Compare the polaroid with the hat, clock and window. Check the fidelity readout.', 'Read the polaroid, hang the hat on the rack, set Friday at eleven, then turn on the rain machine.'];
  if (room === 'suite_b') return !F('kitchenGap') ? ['Which ordinary action is missing from the tea round?', 'Read the damaged tape at the recorder and examine the cupboard. Use those two records to TEST THE GAP.', 'Choose taking two cups, supported by "Suite B tape, damaged section" and "Cupboard trace, Suite B". Then reconstruct the round.'] : ['How does the rest of the tea round fit around the recovered action?', 'The tape preserves the order. The cupboard trace supplies the missing action.', 'Use TAP, CUPBOARD, KETTLE, then DRAWER. Replaying the recorder resets the round.'];
  if (room === 'wed_hall' && id === 'securityDoor') return ['What time would a projectionist remember?', "The duty roster in the nurses' station ties the security code to the theater's showtime.", '7:30 PM is 1930. Enter it at security.'];
  if (room === 'roof' && (id === 'tower' || id === 'rotor')) return ['Where is the station that should hear my radio?', 'Read the mast plate, then look at the red light on the horizon. The roof has a compass rose.', 'Aim the relay WEST toward the Channel 8 tower.'];
  if (room === 'theater') return !F('showOn') ? ['Which can starts the film, and which ending joins the next beginning?', 'Read the three film leaders in FILES or the key pouch. Only one has the countdown.', 'Splice B, A, C at the projector. Read the cue sheet before the screening.'] : ['Can I give the audience the end of their show?', "Dale's cue sheet is beside the projector. The last cue is at the far house-light switch; clearing the room also works.", 'Hold Z at the projector for two seconds without aiming. Keep moving for twelve seconds, then hold Z at the far house lights for two seconds. Release or damage interrupts the work.'];
  if (room === 'dir_office' && id === 'safe') return ["Where did the director keep his numbers?", 'The security log points to the orientation film. Each number appeared on its own card.', 'Dial 19, 79, 41 at the office safe.'];
  if (room === 'suite_c') return ['Does a request for the original tell me where I began?', "Hear the diner recording and compare it with the director's memo. Test what those records actually support.", 'Test that the visitor requested the master recording, using "Diner reconstruction, Suite C" and "Memo from the Director". That claim does not establish my origin.'];
  if (room === 'boiler' && id === 'valves') {
    const g = MO.gauge || [3, 0, 1]; let turns = null;
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 4; c++) {
      if ((g[0] + a + c) % 4 === 2 && (g[1] + a + b) % 4 === 2 && (g[2] + b + c) % 4 === 2 && (!turns || a + b + c < turns.reduce((n, v) => n + v, 0))) turns = [a, b, c];
    }
    return ['How do I bring all three gauges into the green?', 'Read the pressure chart by the boiler. Each valve moves two gauges, wrapping after red.', turns ? 'From the current gauges: turn valve 1 ' + turns[0] + ' times, valve 2 ' + turns[1] + ', valve 3 ' + turns[2] + '. Then LIGHT THE BURNER.' : 'All three gauges must show green before lighting the burner. Check the pressure chart.'];
  }
  if (room === 'b_safe' && id === 'clock') return ['What has to change before the Monday time lock will open?', "Otis's camp log describes the master clock and where he left its winding key.", invHas('windKey') || F('wound') ? 'Use the winding key at the camp clock, then SET IT TO MONDAY.' : 'Read the camp clock. Heat cold storage with the boiler, collect the winding key there, then return to set Monday.'];
  return [o[0]];
}
async function leadHelp(who) {
  const hints = leadHints();
  for (let i = 0; i < hints.length; i++) {
    const more = i < hints.length - 1;
    await say(hints[i], who, { keep: more });
    if (!more) return;
    const choice = await choose(['KEEP INVESTIGATING', i === 0 ? 'POINT TO THE SOURCE' : 'SHOW THE ANSWER'], { y: 116, cancel: 1 });
    DLG = null;
    if (choice !== 1) return;
  }
}
