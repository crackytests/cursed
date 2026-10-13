'use strict';
// ================= CARL: RESIDENT HUMAN. THE RESIDENCES AT TOMORROW, floor by floor =================
// every interior leaves the camera side open (no south wall) and cuts to a single camera. units are meters.
const TOM = { wall: { col: '#e8dcf0', tex: 'stucco', ts: 3 }, wallB: { col: '#b8d8f0', tex: 'stucco', ts: 3 }, carpet: { col: '#8a9ac8', tex: 'carpet', ts: 2 }, tile: { col: '#d8e0e8', tex: 'tile', ts: 2, shiny: .4 }, wood: { col: '#b08a60', tex: 'wood', ts: 2, shiny: .2 } };
function shell(b, x0, x1, d, wallM, floorM, h = 3.6) { // floor and the three far walls
  const w = x1 - x0, cx = (x0 + x1) / 2;
  b.ground(w, d, floorM, cx, d / 2);
  b.box(cx, d + .3, w + .6, .6, h, wallM); b.box(x0 - .3, d / 2, .6, d, h, wallM); b.box(x1 + .3, d / 2, .6, d, h, wallM);
  b.box(cx, d - .05, w, .12, .2, { col: '#f8f4ff' }, { y: 0, solid: false });     // baseboard
  return b;
}
const AMBN = [.5, .46, .56], SUNN = { dir: [.1, 1, -.25], col: [.3, .28, .34] };
// ---------------- LOBBY ----------------
(() => {
  const b = SB({ amb: [.36, .34, .46], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'tomorrow', title: 'THE RESIDENCES AT TOMORROW', smart: true });
  shell(b, -14, 14, 16, TOM.wall, { col: '#6a7298', tex: 'tile', ts: 2, shiny: .12 }, 4);
  b.add('box:9:2.4:.2', [0, 1.4, 16.1], { col: '#f0e8ff', emis: .5 }); b.sign(0, 3.4, 15.8, 8, .8, '#7ad8ff', { rad: 9, lz: -1.6 });                         // TOMORROW sign
  b.box(0, 12.6, 8, 1.6, 1.1, { col: '#f4f4ff', shiny: .5 }); b.box(0, 12.6, 2.2, .5, 1.9, { col: '#2a4a8a', shiny: .6 }, { y: 1.1 }); b.add('box:1.7:.9:.06', [0, 1.6, 12.3], { col: '#9ad8ff', emis: .7 }); // desk + kiosk
  b.box(-8, 15.3, 3.6, .3, 3, { col: '#8a98b8', tex: 'metal', ts: 2, shiny: .7 }); b.add('box:1.4:2.4:.1', [-9.2, 0, 15.1], { col: '#aab8d8', shiny: .8 }); b.add('box:1.4:2.4:.1', [-6.8, 0, 15.1], { col: '#aab8d8', shiny: .8 });   // elevator
  b.add('box:.5:.9:.06', [-5.4, 1.1, 15.1], { col: '#101830', emis: .2 }); for (let i = 0; i < 3; i++) b.add('box:.12:.12:.05', [-5.4, .8 + i * .22, 15.05], { col: i === 2 ? '#ff6a5a' : '#ffd848', emis: .9 });  // B, B2, B2
  for (let i = 0; i < 12; i++) b.add('box:.55:.5:.1', [12.6, .5 + (i % 4) * .6, 6.4 + Math.floor(i / 4) * .7], { col: i === 5 ? '#ffd848' : '#c8c8d8', shiny: .5 }, { r: 1.5708 });   // mail lockers on the east wall
  b.box(11.8, 6.4, .2, 2.4, 2.4, { col: '#6a6a82', shiny: .4 }, {});
  b.box(13.4, 13.5, .5, 3.4, 3, { col: '#303048' }); b.add('box:.1:1.6:3', [13.1, 0.6, 13.5], { col: '#8a8aa8', emis: .1 }, {});                                               // the sealed mall gate
  b.box(-12, 4, 2.4, 1.4, .5, { col: '#8a5a7a' }); b.box(-12, 4, 2.4, .5, 1.2, { col: '#8a5a7a' }, { y: .5, solid: false }); b.cyl(10.4, 2.4, .5, .9, { col: '#6a8a6a' }, { seg: 8, solid: true });      // bench, planter
  b.lights.push({ p: [0, 3.4, 8], col: [1, .95, 1], rad: 22, int: .85 }, { p: [0, 2.6, 12], col: [.5, .85, 1], rad: 7, int: 1.2, glow: 1 }, { p: [-8, 3, 14], col: [1, .85, .6], rad: 6, int: 1, glow: .8 }, { p: [12, 2.4, 7], col: [1, .9, .7], rad: 5, int: .9 });
  b.walkRect(-13.2, 1, 12, 15);
  b.cam('lobby', [0, 7.2, -4.4], [0, .8, 8.2], 1.05, [-40, -40, 40, 40]);
  b.cam('east', [7, 6.4, -2], [11.5, .8, 9], 1.05, [6.5, -40, 40, 40]);
  SCENES.lobby = Object.assign(b.fin(), { start: [0, 0, 3], elev: [-8, 13.6, 0], arrive: [0, 3, 0], tick: () => normalLivingTick() });
})();
// ---------------- FLOOR 3: the corridor ----------------
(() => {
  const b = SB({ amb: [.5, .46, .58], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'tomorrow', title: 'FLOOR 3', smart: true });
  b.ground(46, 12, { col: '#8a9ac8', tex: 'carpet', ts: 2 }, 0, 3.5);
  b.box(0, 9.5, 46, .6, 3.6, TOM.wall); b.box(-23.3, 7, .6, 5, 3.6, TOM.wall); b.box(23.3, 7, .6, 5, 3.6, TOM.wall);
  b.box(0, 9.15, 46, .2, .9, { col: '#c8b8e8', tex: 'wood', ts: 2 }, { solid: false });
  const slots = [[-19, 'ELEVATOR', '#aab8d8', 0], [-14, '3A', '#e8a0c0', 1], [-9, '3B', '#a0e0d8', 1], [-4, '3C', '#e8d098', 1], [1, '3D', '#a8c0f0', 1], [6, 'COMMUNITY', '#f0b8f0', 0], [11, '3F', '#e8e8f0', 2], [16, 'LAUNDRY', '#98d8f0', 0], [21, 'STAFF ONLY', '#505860', 0]];
  for (const [x, nm, c, k] of slots) { b.add('box:1.5:2.5:.14', [x, 0, 9.18], { col: k === 2 ? '#e8e8f0' : c, shiny: .5, emis: k === 2 ? .1 : 0 }); b.add('box:.7:.3:.06', [x, 2.7, 9.12], { col: '#101830', emis: .3 }); if (k === 1) b.add('box:.5:.2:.05', [x, 2.7, 9.08], { col: '#ffd848', emis: .9 }); }
  b.cyl(-22, 5.4, .3, 1.2, { col: '#6a8a6a' }, { seg: 8, solid: true }); b.box(21.8, 5.4, 1.0, 1.0, 1.0, { col: '#c8a888' });
  for (let i = -4; i <= 4; i++) b.lights.push({ p: [i * 5, 3.2, 7], col: [1, .94, .98], rad: 9, int: .9 });
  b.walkRect(-22.5, 5, 22.5, 8.8);
  b.autoCams(-22.5, 4.6, 22.5, 9, 12, 4.6, 6, 2.8, 1.5);
  SCENES.floor3 = Object.assign(b.fin(), { start: [-17, 0, 6.8], elev: [-18, 7, 0], tick: () => normalLivingTick() });
})();
// ---------------- the apartments ----------------
(() => { // 3A: Carl's. a mattress, a crate, a bow tie on a nail
  const b = SB({ amb: [.46, .42, .54], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'home', title: 'UNIT 3A', smart: true });
  shell(b, -6, 6, 9, { col: '#e8c8d8', tex: 'stucco', ts: 3 }, { col: '#a08a78', tex: 'wood', ts: 2, shiny: .15 });
  b.add('box:2.6:1.6:.1', [2, 1.1, 9.0], { col: '#6a8ac8', emis: .35, shiny: .5 }); b.add('box:2.8:.12:.12', [2, 2.8, 8.95], { col: '#7a5a3a' }); b.add('box:.12:.2:.06', [-4.2, 1.9, 9.02], { col: '#201010' });          // window, a nail
  b.box(-4.6, 6.4, 1.4, 2.4, 1.1, { col: '#7a6a8a', tex: 'wood', ts: 1 }, { solid: false }); b.box(-4.3, 8.5, 2.2, 1.0, 2.4, { col: '#d8c8b8' }, {});                                     // the closet (where the wall knocks)
  b.box(4.6, 7.8, 2.4, 1.4, 1.0, { col: '#c8c8d0', shiny: .4 }); b.box(4.6, 7.8, 2.4, .12, .12, { col: '#303038' }, { y: 1.0, solid: false });                                             // kitchenette
  b.box(5.4, 1.6, .2, 2.0, 2.4, { col: '#c8a8c8' }, {});
  b.lights.push({ p: [0, 3.2, 4], col: [1, .92, .86], rad: 14, int: 1.4 }, { p: [2, 2.6, 8], col: [.7, .8, 1], rad: 6, int: 1.1, glow: .6 });
  b.walkRect(-5.4, 1, 5.4, 8);
  b.cam('a', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt3A = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0], tick: () => normalLivingTick() });
})();
(() => { // 3B: Orrin. immaculate
  const b = SB({ amb: [.34, .33, .4], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'home', title: 'UNIT 3B', smart: true });
  shell(b, -6, 6, 9, { col: '#c8c8da', tex: 'stucco', ts: 3 }, { col: '#7a82a0', tex: 'tile', ts: 2, shiny: .1 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) b.add('box:.5:.34:.4', [-4.2 + c * .6, .3 + r * .5, 8.7], { col: ['#6a8ac8', '#c88ab8', '#8ac8a8'][(c + r) % 3] }); b.box(-1.2, 8.7, 5.4, .8, 1.8, { col: '#e8e8f0' }, { });
  b.box(3.6, 6.4, 2.2, 1.2, .8, { col: '#f0f0f8', shiny: .5 }); b.box(3.6, 6.4, .8, .5, .1, { col: '#ffd848', emis: .5 }, { y: .8, solid: false }); b.box(-3.6, 4.2, 1.6, 1.6, .4, { col: '#e8e0f8' });
  b.lights.push({ p: [0, 3.2, 4], col: [1, 1, 1], rad: 15, int: .8 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('b', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt3B = Object.assign(b.fin(), { start: [0, 0, 1.6], tick: () => normalLivingTick() });
})();
(() => { // 3C: Bea. blackout curtains, crates, a sleeping woman
  const b = SB({ amb: [.3, .26, .36], sun: { dir: [.1, 1, -.25], col: [.16, .14, .24] }, sky: ['#100820', '#201030'], fog: { col: '#140c20', dens: .004 }, music: 'home', title: 'UNIT 3C', smart: true });
  shell(b, -6, 6, 9, { col: '#6a5a78', tex: 'stucco', ts: 3 }, { col: '#5a4a50', tex: 'wood', ts: 2 });
  b.add('box:3.2:2.4:.14', [-2, 1.1, 9.0], { col: '#201428' }); b.box(3.4, 6.4, 2.2, 1.8, .6, { col: '#7a5a8a' }); b.box(3.4, 6.4, 2.1, .5, .3, { col: '#e8e0e8' }, { y: .6, solid: false });
  for (const [x, z] of [[-4.6, 5], [-4.2, 6.2], [-3.2, 7.2], [-4.8, 3.2]]) b.box(x, z, .9, .9, .8 + ((x * z) | 0) % 2 * .3, { col: '#a08858', tex: 'wood', ts: 1 });
  b.box(-3, 3.2, 1.2, 1.2, 1.0, { col: '#e8dcc0' }); b.cyl(1.6, 3.6, .5, 1.1, { col: '#c8c8d0', shiny: .4 }, { seg: 8, solid: true });
  b.lights.push({ p: [0, 3, 4], col: [.7, .6, 1], rad: 9, int: .5 }, { p: [3.4, 1.8, 6.4], col: [1, .6, .4], rad: 4, int: .6, glow: .4 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('c', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt3C = Object.assign(b.fin(), { start: [0, 0, 1.6], tick: () => { normalLivingTick(); beaNoise(); } });
})();
(() => { // 3D: Roz's kitchen. the wall with the height marks
  const b = SB({ amb: [.48, .42, .4], sun: { dir: [.1, 1, -.25], col: [.3, .26, .22] }, sky: ['#201010', '#302018'], fog: { col: '#2a1c14', dens: .002 }, music: 'home', title: 'UNIT 3D', smart: true });
  shell(b, -6, 6, 9, { col: '#e8d8a8', tex: 'stucco', ts: 3 }, { col: '#a88858', tex: 'wood', ts: 2, shiny: .2 });
  b.box(0, 8.7, 12, .15, 3, { col: '#e0cc98' }, { solid: false });
  for (let i = 0; i < 22; i++) { const yy = .4 + i * .075, long = i % 3 === 0; b.add('box:' + (long ? .55 : .3) + ':.03:.04', [-3.5, yy, 8.95], { col: ['#7a3a2a', '#2a5a7a', '#6a4a8a', '#3a7a4a'][i % 4] }); }    // the height marks
  b.box(2.6, 7.6, 3.4, 1.0, 1.0, { col: '#d8c8b8', shiny: .3 }); b.box(0, 3.4, 1.6, 1.0, .8, { col: '#c8a878', tex: 'wood', ts: 1 }); b.cyl(-1.4, 3.4, .35, .7, { col: '#c8a878', tex: 'wood', ts: 1 }, { seg: 8, solid: true });
  b.add('box:.6:.8:.1', [-5.6, 1.2, 4], { col: '#6a5a40' }, { r: 1.5708 }); b.box(5.4, 5, .8, 1.4, 1.7, { col: '#8a6a4a', tex: 'wood', ts: 2 });    // photos, a dumbwaiter hatch
  b.lights.push({ p: [0, 3, 4], col: [1, .88, .66], rad: 14, int: 1.4 }, { p: [-3.5, 1.5, 8], col: [1, .9, .7], rad: 5, int: 1 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('d', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt3D = Object.assign(b.fin(), { start: [0, 0, 1.6], tick: () => normalLivingTick() });
})();
// ---------------- the shared rooms ----------------
(() => { // laundry
  const b = SB({ amb: [.3, .32, .4], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'tomorrow', title: 'LAUNDRY ROOM', smart: true });
  shell(b, -7, 7, 10, { col: '#88a0b8', tex: 'tile', ts: 2 }, { col: '#68788c', tex: 'tile', ts: 2, shiny: .1 });
  for (let i = 0; i < 5; i++) { b.box(-5.6 + i * 1.6, 9.2, 1.3, 1.0, 1.5, { col: '#f0f0f8', shiny: .6 }); b.add('box:.7:.7:.06', [-5.6 + i * 1.6, 1.0, 8.65], { col: i === 2 ? '#40ff90' : '#203858', emis: i === 2 ? .7 : .1 }); }
  b.box(4, 5.6, 3, 1.2, .9, { col: '#e8e8f0' }); b.cyl(-4, 4, .5, .5, { col: '#8aa8c8' }, { seg: 8, solid: true }); b.box(-5.8, 5, .8, 2.4, .5, { col: '#c8b898' });
  b.lights.push({ p: [0, 3.2, 5], col: [.9, 1, 1], rad: 14, int: .9 }, { p: [0, 1.4, 8], col: [.4, 1, .6], rad: 4, int: .8, glow: .5 });
  b.walkRect(-6.4, 1, 6.4, 8);
  b.cam('l', [0, 6.6, -3.8], [0, .8, 5.4], 1.05, [-30, -30, 30, 30]);
  SCENES.laundry = Object.assign(b.fin(), { start: [0, 0, 1.6], tick: () => normalLivingTick() });
})();
(() => { // community room
  const b = SB({ amb: [.5, .46, .54], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'tomorrow', title: 'COMMUNITY ROOM', smart: true });
  shell(b, -9, 9, 11, { col: '#f0d8e8', tex: 'stucco', ts: 3 }, { col: '#b0a090', tex: 'wood', ts: 2, shiny: .3 });
  b.box(0, 10, 6, 1.2, .3, { col: '#8a5a7a' }); b.box(0, 9.2, .8, .6, 1.1, { col: '#6a4a3a', tex: 'wood', ts: 1 }, {}); b.add('box:7:1.4:.1', [0, 2.2, 10.9], { col: '#ffd848', emis: .5 });     // stage, podium, banner
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) b.box(-5 + c * 2, 3 + r * 1.8, .8, .7, .5, { col: '#c8b8d8' }, {});
  b.box(7, 6, 2.2, 1.2, .9, { col: '#e8e0d8' }); b.cyl(-7.4, 9, .4, 1.4, { col: '#6a8a6a' }, { seg: 8, solid: true });
  b.lights.push({ p: [0, 3.4, 5], col: [1, .94, 1], rad: 18, int: 1.5 }, { p: [0, 3, 10], col: [1, .85, .5], rad: 8, int: 1.1, glow: .6 });
  b.walkRect(-8.4, 1, 8.4, 9);
  b.cam('c', [0, 7, -3.6], [0, .8, 6], 1.08, [-30, -30, 30, 30]);
  SCENES.community = Object.assign(b.fin(), { start: [0, 0, 1.6], tick: () => normalLivingTick() });
})();
(() => { // roof: a night sky and a water tank
  const b = SB({ amb: [.3, .3, .5], sun: { dir: [-.3, .6, -.4], col: [.2, .22, .5] }, sky: ['#000014', '#2a1a4a'], stars: 1, moon: { p: [-30, 40, 90], r: 8 }, fog: { col: '#1a1038', dens: .008 }, music: 'roof', title: 'THE ROOF' });
  b.ground(60, 30, { col: '#68687a', tex: 'concrete', ts: 3, shiny: .2 }, 0, 12);
  b.cyl(-10, 12, 3, 5, { col: '#7a6a5a', tex: 'wood', ts: 2 }, { seg: 12, solid: true }); b.cyl(-10, 12, 3.2, .6, { col: '#8a7a6a' }, { y: 5, seg: 12, solid: false });
  b.box(0, 22, 40, 1.0, 1.2, { col: '#8888a0' }); b.box(-20, 12, 1, 22, 1.2, { col: '#8888a0' }); b.box(20, 12, 1, 22, 1.2, { col: '#8888a0' });
  b.cyl(8, 14, .1, 6, { col: '#9a9aa8' }, { seg: 5, solid: true }); b.add('box:3:.1:.1', [8, 6, 14], { col: '#9a9aa8' }); b.box(12, 6, 1.4, .8, .5, { col: '#c8c8d8' }); b.box(14, 6, 1.4, .8, .5, { col: '#c8c8d8' });
  b.sign(0, 7, 21.4, 14, 1.4, '#7ad8ff', { rad: 12, lz: -2 }); b.lamp(-14, 3, { h: 4, col: [1, .9, .7], rad: 10 }); b.lamp(14, 3, { h: 4, col: [1, .9, .7], rad: 10 });
  b.walkRect(-18.5, 1.5, 18.5, 20.5);
  b.autoCams(-19, 1, 19, 21, 19, 10, 6, 3.4, .98);
  SCENES.roof = Object.assign(b.fin(), { start: [0, 0, 4], elev: [0, 3, 0], arrive: [0, 3, 0] });
})();
// ---------------- the maintenance corridors ----------------
(() => {
  const b = SB({ amb: [.22, .2, .26], sun: { dir: [.1, 1, -.2], col: [.12, .1, .16] }, sky: ['#000008', '#080818'], fog: { col: '#100c10', dens: .01 }, music: 'maint', title: 'MAINTENANCE CORRIDOR' });
  b.ground(40, 10, { col: '#585860', tex: 'metal', ts: 2, shiny: .3 }, 0, 2);
  b.box(0, 7, 40, .6, 3.2, { col: '#484850', tex: 'metal', ts: 3 }); b.box(-20.3, 4, .6, 5, 3.2, { col: '#484850', tex: 'metal', ts: 3 }); b.box(20.3, 4, .6, 5, 3.2, { col: '#484850', tex: 'metal', ts: 3 });
  for (let i = 0; i < 9; i++) b.cyl(-18 + i * 4.5, 6.2, .22, 3, { col: i % 2 ? '#8a6a4a' : '#6a7a8a', shiny: .4 }, { seg: 6, solid: false });
  b.add('box:36:.3:.3', [0, 2.8, 6.6], { col: '#8a6a4a', shiny: .4 }); b.add('box:36:.2:.2', [0, 2.2, 6.7], { col: '#6a7a8a', shiny: .4 });
  for (const [x, nm] of [[-14, 'A'], [-6, 'C'], [2, 'D'], [11, 'F']]) { b.add('box:1.2:1.4:.1', [x, 0.2, 6.65], { col: '#7a7a82', shiny: .5 }); b.add('box:.4:.2:.05', [x, 1.9, 6.6], { col: '#ffb040', emis: .8 }); }
  b.lights.push({ p: [-10, 2.8, 3], col: [1, .7, .35], rad: 10, int: 1.3, glow: .8 }, { p: [4, 2.8, 3], col: [1, .7, .35], rad: 10, int: 1.3, glow: .8 }, { p: [16, 2.8, 3], col: [1, .7, .35], rad: 10, int: 1.3, glow: .8 });
  b.walkRect(-19.4, 2, 19.4, 6);
  b.autoCams(-19.4, 1.6, 19.4, 6.4, 12, 4.4, 6, 2.8, 1.5);
  SCENES.maint = Object.assign(b.fin(), { start: [-18, 0, 4], arrive: [-18, 4, 0] });
})();
// ---------------- below: the closed mall, then the older floors ----------------
(() => {
  const b = SB({ amb: [.2, .18, .3], sun: { dir: [.1, 1, -.2], col: [.1, .1, .22] }, sky: ['#000008', '#080818'], fog: { col: '#0c0a18', dens: .008 }, music: 'below', title: 'B: THE MALL OF THE FUTURE (CLOSED WING)' });
  b.ground(48, 20, { col: '#9898a8', tex: 'tile', ts: 2, shiny: .5 }, 0, 10);
  b.box(0, 20.3, 48, .6, 6, { col: '#8a8498', tex: 'stucco', ts: 3 }); b.box(-24.3, 10, .6, 20, 6, { col: '#8a8498', tex: 'stucco', ts: 3 }); b.box(24.3, 10, .6, 20, 6, { col: '#8a8498', tex: 'stucco', ts: 3 });
  for (let i = 0; i < 6; i++) { const x = -20 + i * 8; b.add('box:6.4:3.4:.3', [x, 0, 19.8], { col: '#383848', shiny: .3 }); b.add('box:5:.6:.1', [x, 3.9, 19.6], { col: ['#6a5a7a', '#7a6a4a', '#4a6a7a', '#7a4a5a', '#5a7a5a', '#6a6a8a'][i], emis: .15 }); }
  b.cyl(0, 9, 3, .7, { col: '#7a7a88' }, { seg: 14, solid: true }); b.box(-14, 3, 4, 1, 1, { col: '#5a4a6a' }); b.box(15, 4, 2, 2, 2.4, { col: '#303048' });
  b.add('box:1.8:2.4:.14', [20.8, 0, 3.4], { col: '#aab8d8', shiny: .8 }, {});
  b.lights.push({ p: [0, 5, 9], col: [.5, .6, 1], rad: 20, int: 1, glow: .8 }, { p: [-12, 4, 18], col: [1, .8, .5], rad: 8, int: .8 }, { p: [12, 4, 18], col: [1, .8, .5], rad: 8, int: .8 }, { p: [20.8, 3, 3], col: [.6, 1, .8], rad: 6, int: 1, glow: .8 });
  b.walkRect(-23, 1, 23, 18);
  b.autoCams(-23.5, 0.6, 23.5, 19, 16, 9, 5.4, 3.4, .98);
  SCENES.mallB1 = Object.assign(b.fin(), { start: [20, 0, 5], elev: [18.6, 4.4, 0], arrive: [18.6, 4.4, 0] });
})();
(() => { // B2: the seventies
  const b = SB({ amb: [.5, .38, .3], sun: { dir: [.1, 1, -.2], col: [.2, .14, .1] }, sky: ['#000008', '#080818'], fog: { col: '#1a1008', dens: .008 }, music: 'below', title: 'B2' });
  b.ground(46, 12, { col: '#c0701a', tex: 'carpet', ts: 2 }, 0, 3.5);
  b.box(0, 9.5, 46, .6, 3.2, { col: '#8a5a30', tex: 'wood', ts: 2 }); b.box(-23.3, 7, .6, 5, 3.2, { col: '#8a5a30', tex: 'wood', ts: 2 }); b.box(23.3, 7, .6, 5, 3.2, { col: '#8a5a30', tex: 'wood', ts: 2 });
  const doors = [[-17, '2'], [-11, '4'], [-5, '6'], [1, '8'], [7, '10'], [13, '12'], [19, '14']];
  for (const [x, n] of doors) { b.add('box:1.5:2.5:.14', [x, 0, 9.18], { col: '#d8a050', shiny: .3 }); b.add('box:.5:.3:.05', [x, 2.7, 9.1], { col: '#201010', emis: .2 }); }
  b.add('box:1.4:2.6:.1', [21.6, 0, 9.12], { col: '#aab8d8', shiny: .8 });
  b.lights.push({ p: [-14, 2.8, 7], col: [1, .7, .4], rad: 11, int: 1.1 }, { p: [0, 2.8, 7], col: [1, .7, .4], rad: 11, int: 1.1 }, { p: [14, 2.8, 7], col: [1, .7, .4], rad: 11, int: 1.1 });
  b.walkRect(-22.5, 5, 22.5, 8.8);
  b.autoCams(-22.5, 4.6, 22.5, 9, 12, 4.6, 6, 2.8, 1.5);
  SCENES.b2 = Object.assign(b.fin(), { start: [20, 0, 6.8], elev: [20, 7, 0], arrive: [20, 7, 0] });
})();
(() => { // B2 (again): the fifties
  const b = SB({ amb: [.28, .34, .3], sun: { dir: [.1, 1, -.2], col: [.12, .16, .14] }, sky: ['#000008', '#080818'], fog: { col: '#0a1410', dens: .01 }, music: 'below', title: 'B2 (AGAIN)' });
  b.ground(36, 12, { col: '#78a890', tex: 'tile', ts: 2, shiny: .4 }, 0, 3.5);
  b.box(0, 9.5, 36, .6, 3.4, { col: '#98c8a8', tex: 'stucco', ts: 3 }); b.box(-18.3, 7, .6, 5, 3.4, { col: '#98c8a8', tex: 'stucco', ts: 3 }); b.box(18.3, 7, .6, 5, 3.4, { col: '#98c8a8', tex: 'stucco', ts: 3 });
  for (const [x, n] of [[-12, 'N'], [-5, 'O'], [2, 'P'], [9, 'Q']]) { b.add('box:1.5:2.5:.14', [x, 0, 9.18], { col: '#c8d8c0', shiny: .3 }); b.add('box:.5:.3:.05', [x, 2.7, 9.1], { col: '#101810', emis: .2 }); }
  b.add('box:2:2.8:.1', [15.4, 0, 9.12], { col: '#303838', shiny: .6 }); b.add('box:.8:.4:.05', [15.4, 3.1, 9.05], { col: '#ff3a3a', emis: .9 });
  b.lights.push({ p: [-8, 2.8, 7], col: [.6, 1, .8], rad: 11, int: 1 }, { p: [6, 2.8, 7], col: [.6, 1, .8], rad: 11, int: 1 }, { p: [15, 3, 7], col: [1, .3, .3], rad: 6, int: 1, glow: .8 });
  b.walkRect(-17.5, 5, 17.5, 8.8);
  b.autoCams(-17.5, 4.6, 17.5, 9, 12, 4.6, 6, 2.8, 1.5);
  SCENES.b2b = Object.assign(b.fin(), { start: [-15, 0, 6.8], elev: [-15, 7, 0], arrive: [-15, 7, 0] });
})();
(() => { // the control room
  const b = SB({ amb: [.3, .34, .46], sun: { dir: [.1, 1, -.2], col: [.16, .2, .3] }, sky: ['#000008', '#080818'], fog: { col: '#080c18', dens: .006 }, music: 'control3', title: 'BUILDING CONTROL' });
  shell(b, -10, 10, 14, { col: '#38485a', tex: 'metal', ts: 3 }, { col: '#48586a', tex: 'metal', ts: 2, shiny: .5 }, 5);
  b.cyl(0, 10, 2.2, 5, { col: '#c8d8e8', shiny: .7 }, { seg: 14, solid: true }); b.add('box:1.6:1.2:.1', [0, 2.2, 7.7], { col: '#7ad8ff', emis: .9 });
  for (let i = -3; i <= 3; i++) if (i) b.box(i * 2.6, 12.4, 2, .8, 1.4, { col: '#2a3a52', shiny: .4 }), b.add('box:1.7:.8:.06', [i * 2.6, 1.9, 12.0], { col: ['#40ff90', '#ff6a5a', '#7ad8ff'][Math.abs(i) % 3], emis: .7 });
  b.box(-7, 5, 1.4, 1.0, .9, { col: '#6a7a8a' }); b.box(0, 3.2, 3, 1.1, 1.0, { col: '#aab8d8', shiny: .5 }); b.add('box:.1:.5:.1', [0, 2.0, 3.2], { col: '#303038' });  // the intercom desk
  b.lights.push({ p: [0, 4, 6], col: [.6, .8, 1], rad: 16, int: 1.4, glow: 1 }, { p: [0, 2.4, 8.2], col: [.5, .9, 1], rad: 9, int: 1.4, glow: 1.2 });
  b.walkRect(-9.4, 1, 9.4, 12.4);
  b.cam('ctl', [0, 7.4, -3.4], [0, 1, 7], 1.08, [-30, -30, 30, 30]);
  SCENES.control = Object.assign(b.fin(), { start: [0, 0, 1.8], arrive: [0, 1.8, 0], elev: [0, 1.8, 0] });
})();
(() => { // 3F: Nell's. every pot in the building
  const b = SB({ amb: [.34, .3, .26], sun: { dir: [.1, 1, -.25], col: [.2, .17, .13] }, sky: ['#201010', '#302018'], fog: { col: '#2a1c14', dens: .002 }, music: 'home', title: 'UNIT 3F' });
  shell(b, -6, 6, 9, { col: '#b8d8b0', tex: 'stucco', ts: 3 }, { col: '#7a6c54', tex: 'tile', ts: 2, shiny: .1 });
  for (let i = 0; i < 9; i++) b.add('cyl:.22:.3:8', [-5 + i * .62, 1.6 + (i % 2) * .5, 8.7], { col: ['#c8c8d0', '#c06a4a', '#6a8aa8'][i % 3], shiny: .5 });
  b.box(-4.6, 7.2, 2.4, 1.2, 1.0, { col: '#e8e0d0' }); b.box(2.6, 6.4, 2.2, 1.4, .8, { col: '#8a6a4a', tex: 'wood', ts: 1 }); b.add('box:2.4:1.6:.1', [3, 1.1, 9.0], { col: '#6a8ac8', emis: .35 });
  b.lights.push({ p: [0, 3.2, 4], col: [1, .9, .7], rad: 14, int: .9 }, { p: [-4.6, 2, 7.2], col: [1, .8, .5], rad: 5, int: 1 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('f', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt3F = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0] });
})();
