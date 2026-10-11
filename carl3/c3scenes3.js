'use strict';
// ================= CARL 3: scenes for stops 3-6 (the truck stop inside, the dead mall, the sorting center, the dead letter office) =================
// ---- BIG LEON'S, inside the diner ----
(() => {
  const b = SB({ amb: [.46, .4, .44], sun: { dir: [.1, 1, -.3], col: [.26, .24, .24] }, sky: ['#100808', '#201010'], fog: { col: '#181010', dens: .002 }, music: 'plaza', title: 'BIG LEON\'S DINER' });
  b.ground(24, 16, { col: '#b8a888', tex: 'tile', ts: 2, shiny: .4 }, 0, 6);
  b.box(0, 14.2, 24, .6, 4, { col: '#a85838', tex: 'brick', ts: 3 }); b.box(-12.2, 6, .6, 16, 4, { col: '#a85838', tex: 'brick', ts: 3 }); b.box(12.2, 6, .6, 16, 4, { col: '#a85838', tex: 'brick', ts: 3 });
  b.box(2, 11, 10, 1.4, 1.1, { col: '#c8c8d0', shiny: .6 }); for (let i = 0; i < 5; i++) b.cyl(-2 + i * 2, 9.4, .3, .8, { col: '#c03030', shiny: .5 }, { seg: 8, solid: false });      // the counter and its stools
  for (const x of [-8, -4, 8]) b.box(x, 3.6, 3.4, 2, 1.0, { col: '#a03030', shiny: .4 }); for (const x of [6, 9.4]) b.box(x, 6.6, 3, 1.6, 1.0, { col: '#2050a0', shiny: .4 });          // booths
  b.add('box:7:2.6:.3', [-7, 1.2, 14.2], { col: '#101830', emis: .3 }); b.sign(2, 3.2, 13.8, 6, .9, '#ff9a30', { rad: 8 });
  b.box(-10.2, 10.6, 3.4, .6, 3.2, { col: '#2a2a3a' }, { solid: true }); b.box(-9.5, 10, .1, 3, 2.4, { col: '#101018' }, { y: .4, solid: false });                      // the arch to the lounge, with a sign
  b.add('box:3:.7:.15', [-10.2, 3, 9.8], { col: '#ffd030', emis: .9 });
  b.lights.push({ p: [0, 3.6, 5], col: [1, .9, .7], rad: 16, int: 1.6 }, { p: [2, 3, 12.4], col: [1, .6, .2], rad: 8, int: 1.2, glow: 1 }, { p: [-10.2, 2.8, 9.2], col: [1, .85, .2], rad: 5, int: 1, glow: 1 });
  b.walkRect(-11.4, 1, 11.4, 8.4); b.walkRect(-4.6, 7.6, 9, 9.6);   // up to the stools (was thinner than Carl, so unreachable)
  b.cam('d', [0, 10, -7], [0, 1.6, 9], 1.02, [-30, -30, 30, 30]);
  SCENES.plaza_diner = Object.assign(b.fin(), { start: [0, 0, 1.8] });
})();
// ---- the drivers' lounge: six tvs, four vcrs ----
(() => {
  const b = SB({ amb: [.2, .22, .3], sun: { dir: [.1, 1, -.3], col: [.16, .18, .24] }, sky: ['#000008', '#080818'], fog: { col: '#080810', dens: .004 }, music: 'plaza', title: 'DRIVERS ONLY' });
  b.ground(14, 12, { col: '#503a58', tex: 'carpet', ts: 2 }, 0, 5);
  b.box(0, 10.2, 14, .5, 3.8, { col: '#403848', tex: 'stucco', ts: 3 }); b.box(-7.2, 5, .5, 11, 3.8, { col: '#403848', tex: 'stucco', ts: 3 }); b.box(7.2, 5, .5, 11, 3.8, { col: '#403848', tex: 'stucco', ts: 3 });
  for (let i = 0; i < 6; i++) { const x = -4.6 + (i % 3) * 4.6, y = i < 3 ? 2.1 : 0.8; b.add('box:1.7:1.2:.7', [x, y, 9.7], { col: '#1a1a22', shiny: .3 }); b.add('box:1.4:.95:.1', [x, y + .12, 9.32], { col: ['#6dff92', '#ff6d92', '#6db6ff', '#ffdb6d', '#a06dff', '#92ffee'][i], emis: .85 }); b.lights.push({ p: [x, y + .6, 8.2], col: [.5, .8, .6], rad: 5, int: .8, glow: .4 }); }
  for (let i = 0; i < 4; i++) b.add('box:1.1:.22:.8', [-4.5 + i * 3, .9, 5.2], { col: '#303038', shiny: .3 }), b.add('box:.9:.04:.04', [-4.5 + i * 3, 1.14, 4.78], { col: i === 2 ? '#40ff60' : '#ff4040', emis: .9 });
  b.box(-4.5, 5.2, 1.2, .9, .9, { col: '#6a5a4a', tex: 'wood', ts: 1 }, {}); b.box(-1.5, 5.2, 1.2, .9, .9, { col: '#6a5a4a', tex: 'wood', ts: 1 }, {}); b.box(1.5, 5.2, 1.2, .9, .9, { col: '#6a5a4a', tex: 'wood', ts: 1 }, {}); b.box(4.5, 5.2, 1.2, .9, .9, { col: '#6a5a4a', tex: 'wood', ts: 1 }, {});
  b.box(-4, 2.4, 3, 1.2, .9, { col: '#8a3a30', shiny: .3 }); b.box(4, 2.6, 3, 1.2, .9, { col: '#8a3a30', shiny: .3 });
  b.lights.push({ p: [0, 3.2, 2.4], col: [.9, .7, 1], rad: 10, int: .9 });
  b.walkRect(-6.4, 0.9, 6.4, 3.6);
  b.cam('l', [0, 5, -2.4], [0, 1.2, 6], 1.0, [-30, -30, 30, 30]);
  SCENES.plaza_lounge = Object.assign(b.fin(), { start: [0, 0, 1.4] });
})();
// ---- DESERT PALMS MALL, outside: a parking lot for eleven thousand cars, and four of them ----
(() => {
  const b = SB({ amb: [.38, .3, .44], sun: { dir: [.7, .3, -.5], col: [.8, .5, .44] }, sky: ['#14183a', '#c06a6a'], fog: { col: '#7a4a60', dens: .006 }, music: 'mall', title: 'DESERT PALMS MALL' });
  b.ground(260, 260, { col: '#8a8a94', tex: 'asphalt', ts: 5, shiny: .25 }, 0, 20);
  for (let i = -5; i <= 6; i++) for (const z of [4, 12]) b.add('plane:.2:6', [i * 4.8, .02, z], { col: '#e8e8d0' });
  b.box(0, 52, 70, 24, 9, { col: '#b8a090', tex: 'stucco', ts: 4 }); b.box(0, 39.6, 70, .5, 1.6, { col: '#503028' }, { y: 7.6, solid: false });
  b.box(0, 39.8, 12, .6, 5, { col: '#40386a', shiny: .5 }, { y: 0, solid: true }); b.add('box:5:3.4:.2', [-3, 0, 39.5], { col: '#1a1a30', shiny: .5 }); b.add('box:5:3.4:.2', [3, 0, 39.5], { col: '#1a1a30', shiny: .5 });
  b.add('box:16:2.2:.3', [0, 7, 39.3], { col: '#6a3a50', emis: .15 });
  b.cyl(-18, 20, .5, 12, { col: '#8a7a70' }, { solid: true, seg: 8 }); b.add('box:8:3:.4', [-18, 11.5, 20], { col: '#c8c0b8', emis: .1 });   // the dead pylon sign
  b.cactus(-30, 10); b.cactus(34, 24, 3.4); b.car(-8, 14, .2, '#506890'); b.car(14, 22, -.4, '#a86a40'); b.car(26, 8, .1, '#6a8a60');
  b.lamp(-12, 6, { h: 8, col: [1, .7, .6], rad: 14 }); b.lamp(12, 6, { h: 8, col: [1, .7, .6], rad: 14 }); b.lamp(0, 30, { h: 8, col: [.7, .8, 1], rad: 16 });
  b.walkRect(-38, 1, 40, 37);
  b.autoCams(-38, 1, 40, 38, 20, 12, 6, 3.8, .95);
  SCENES.mall_out = Object.assign(b.fin(), { start: [-30, 0, 4], arrive: [-30, 4, 1.5], shipExit: [-30, 4, 1.5] });
})();
// ---- inside: the concourse, dead and dim, with a dry fountain and a stopped escalator ----
(() => {
  const b = SB({ amb: [.14, .14, .24], sun: { dir: [.1, 1, -.2], col: [.1, .12, .2] }, sky: ['#000008', '#080818'], fog: { col: '#0a0a1a', dens: .007 }, music: 'mall', title: 'DESERT PALMS CONCOURSE', lasers: false });
  b.ground(52, 22, { col: '#c8c0c8', tex: 'tile', ts: 2, shiny: .5 }, 0, 10);
  b.box(0, 22, 52, .6, 6, { col: '#a8a0b0', tex: 'stucco', ts: 3 }); b.box(-26, 10, .6, 22, 6, { col: '#a8a0b0', tex: 'stucco', ts: 3 }); b.box(26, 10, .6, 22, 6, { col: '#a8a0b0', tex: 'stucco', ts: 3 });
  b.cyl(0, 10, 3.2, .9, { col: '#8a8a98', tex: 'concrete', ts: 2, shiny: .3 }, { solid: true, seg: 14 }); b.cyl(0, 10, 2.6, .95, { col: '#2a1a1a' }, { seg: 14, solid: false });       // dry fountain
  for (let i = 0; i < 6; i++) { const x = -22 + i * 8.8; b.add('box:6:3.4:.3', [x, 0, 21.4], { col: '#3a3a48', shiny: .4 }); b.add('box:5:.5:.1', [x, 4.2, 21.2], { col: i === 3 ? '#ffd030' : '#6a5a7a', emis: i === 3 ? .8 : .1 }); }      // shuttered stores on the north side
  b.box(-12, 0.2, 10, 2.4, 1.2, { col: '#8a8a98', shiny: .3 }); b.add('box:10:.3:3', [-12, 1.0, 0.2], { col: '#505058', shiny: .5 }, { pitch: -.5 });                 // the stopped escalator
  b.box(20, 3, 3, 3, 2.4, { col: '#782038', shiny: .3 }); b.add('box:2.2:1.6:.1', [20, 0.3, 1.4], { col: '#101018', shiny: .6 }); b.add('box:1.8:.5:.1', [20, 2.2, 1.4], { col: '#ff9ac0', emis: .9 });   // the photo booth
  b.lights.push({ p: [0, 5.6, 10], col: [.5, .6, 1], rad: 22, int: 1.1, glow: 1 }, { p: [-22, 4, 4], col: [1, .7, .5], rad: 8, int: .9 }, { p: [20, 3.2, 1.6], col: [1, .5, .8], rad: 7, int: 1.2, glow: 1.2 }, { p: [10, 3.5, 20], col: [1, .85, .3], rad: 8, int: 1, glow: 1 });
  b.walkRect(-24.4, 1.4, 24.4, 20);
  b.autoCams(-26, 1, 26, 21, 17, 10, 6.5, 7, .95);   // high: the low cameras stared into the escalator's side
  SCENES.mall_hall = Object.assign(b.fin(), { start: [-22, 0, 3] });
})();
// ---- unit 14: the first store ----
(() => {
  const b = SB({ amb: [.16, .14, .24], sun: { dir: [.1, 1, -.2], col: [.12, .1, .2] }, sky: ['#000008', '#080818'], fog: { col: '#0a0810', dens: .005 }, music: 'found', title: 'UNIT 14' });
  b.ground(12, 10, { col: '#98a0a8', tex: 'tile', ts: 2, shiny: .4 }, 0, 4);
  b.box(0, 9.2, 12, .5, 3.8, { col: '#403858', tex: 'stucco', ts: 3 }); b.box(-6.2, 4, .5, 10, 3.8, { col: '#403858', tex: 'stucco', ts: 3 }); b.box(6.2, 4, .5, 10, 3.8, { col: '#403858', tex: 'stucco', ts: 3 });
  b.box(0, 6.8, 6, 1, 1.0, { col: '#6a4a30', tex: 'wood', ts: 2 }); b.box(-4, 8.2, 2, .8, 2.6, { col: '#5a4a3a', tex: 'wood', ts: 2 }); b.box(4, 8.2, 2, .8, 2.6, { col: '#5a4a3a', tex: 'wood', ts: 2 });
  b.add('box:6:1:.2', [0, 3.2, 9.0], { col: '#ff3a90', emis: .3 }); b.box(-3, 3, 1.4, 1.4, .9, { col: '#2a2a30' }); b.add('box:.2:.2:.2', [-3, 1.0, 3], { col: '#ffd040', emis: .9 });
  b.lights.push({ p: [0, 3.2, 4], col: [1, .7, .8], rad: 11, int: 1.2 }, { p: [0, 3.2, 8.6], col: [1, .3, .6], rad: 6, int: 1, glow: .8 });
  b.walkRect(-5.4, 1, 5.4, 6);
  b.cam('u', [0, 5, -2.4], [0, 1, 5.5], 1.0, [-30, -30, 30, 30]);
  SCENES.mall_unit14 = Object.assign(b.fin(), { start: [0, 0, 1.6] });
})();
// ---- the sorting center: a loading dock, then the hall ----
(() => {
  const b = SB({ amb: [.2, .22, .3], sun: { dir: [.3, 1, -.3], col: [.18, .2, .3] }, sky: ['#000010', '#101030'], stars: 1, fog: { col: '#0c0c1c', dens: .01 }, music: 'sorting', title: 'SORTING CENTER: LOADING DOCK' });
  b.ground(120, 80, { col: '#606068', tex: 'concrete', ts: 3, shiny: .3 }, 0, 12);
  b.box(0, 24, 40, 12, 7, { col: '#707078', tex: 'metal', ts: 4 }); for (let i = 0; i < 4; i++) { b.add('box:3.6:3.8:.3', [-13.5 + i * 9, 0, 17.8], { col: '#202028', shiny: .4 }); b.add('box:3.2:.3:.2', [-13.5 + i * 9, 4.2, 17.7], { col: i === 2 ? '#40ff60' : '#ff4040', emis: .9 }); b.box(-13.5 + i * 9, 15.6, 3.8, 3, .9, { col: '#808088', tex: 'metal', ts: 2 }); }
  b.sign(0, 8.4, 17.6, 16, 1.6, '#ffd030', { rad: 14 });
  b.truck(-16, 5, 3.1, '#e8e8e8', { trailer: '#f0f0f0', len: 7 }); b.box(-24, 8, 2, 2, 1.4, { col: '#a07840', tex: 'wood', ts: 1 }); b.box(20, 12, 3, 2, 1.6, { col: '#a07840', tex: 'wood', ts: 1 });
  b.lamp(-4, 8, { h: 7, col: [.8, .9, 1], rad: 14 }); b.lamp(16, 10, { h: 7, col: [.8, .9, 1], rad: 14 });
  b.walkRect(-30, 2, 28, 15.6);
  b.autoCams(-30, 2, 28, 16, 14.5, 14, 11, 9, .95);
  b.cam('truckside', [3, 9, 10], [-14, .8, 10], 1.0, [-15.5, 6, -8, 16]);   // beside the trailer, which hid this strip from the front
  SCENES.sort_dock = Object.assign(b.fin(), { start: [-24, 0, 4], arrive: [-24, 4, 1.5], shipExit: [-24, 4, 1.5] });
})();
(() => {
  const b = SB({ amb: [.46, .46, .56], sun: { dir: [.1, 1, -.2], col: [.3, .3, .38] }, sky: ['#000008', '#080818'], fog: { col: '#101018', dens: .005 }, music: 'sorting', title: 'SORTING HALL' });
  b.ground(60, 34, { col: '#707078', tex: 'concrete', ts: 3, shiny: .4 }, 0, 14);
  b.box(0, 31, 60, .6, 7, { col: '#585860', tex: 'metal', ts: 3 }); b.box(-30, 14, .6, 34, 7, { col: '#585860', tex: 'metal', ts: 3 }); b.box(30, 14, .6, 34, 7, { col: '#585860', tex: 'metal', ts: 3 });
  for (const z of [6, 14, 22]) { b.add('box:44:.5:2.2', [0, .35, z], { col: '#303038', shiny: .3 }, {}); for (let i = 0; i < 11; i++) b.add('box:.5:.06:2.1', [-20 + i * 4 + 1, .62, z], { col: '#ffd030', emis: .5 }); b.solids.push([-22, z - 1.1, 22, z + 1.1]); }
  for (let i = 0; i < 12; i++) b.add('box:.9:.7:.8', [-18 + i * 3.2, .95, [6, 14, 22][i % 3]], { col: ['#c8a070', '#d8d8d0', '#b09060'][i % 3] });
  b.box(24, 28, 6, 3, 3, { col: '#a02020', shiny: .3 }); b.add('box:4:.6:.2', [24, 3.4, 26.4], { col: '#ff3030', emis: .9 });                                       // the RETURN chute
  b.box(-24, 28, 6, 3, 3, { col: '#202020', shiny: .3 }); b.add('box:4:.6:.2', [-24, 3.4, 26.4], { col: '#c0c0c0', emis: .9 });                                      // the DEAD LETTER chute
  b.box(0, 29, 8, 2, 3, { col: '#40404a', tex: 'metal', ts: 2 }); b.add('box:6:2:.2', [0, 3.2, 27.9], { col: '#101830', emis: .3 });                                // the inspector's office window
  b.lights.push({ p: [0, 6, 10], col: [.7, .8, 1], rad: 28, int: 1.2 }, { p: [24, 3.4, 26], col: [1, .3, .3], rad: 8, int: 1.2, glow: 1 }, { p: [-24, 3.4, 26], col: [.9, .9, 1], rad: 8, int: 1.2, glow: 1 }, { p: [0, 3.4, 27], col: [.4, .6, 1], rad: 8, int: 1 });
  b.walkRect(-28, 0.4, 28, 4.6); b.walkRect(-28, 7.4, 28, 12.6); b.walkRect(-28, 15.4, 28, 20.6); b.walkRect(-28, 23.4, 28, 28.4); b.walkRect(-24, 0, -22.6, 30); b.walkRect(22.6, 0, 24, 30); b.walkRect(-4, 4, 4, 30);
  b.autoCams(-28, 0, 28, 30, 14, 10, 10, 9, 1.0);
  SCENES.sort_hall = Object.assign(b.fin(), { start: [-26, 0, 2] });
})();
// ---- the dead letter office ----
(() => {
  const b = SB({ amb: [.16, .16, .3], sun: { dir: [.1, 1, -.2], col: [.14, .14, .3] }, sky: ['#000008', '#080818'], fog: { col: '#080814', dens: .006 }, music: 'dlo', title: 'THE DEAD LETTER OFFICE' });
  b.ground(46, 40, { col: '#4a4858', tex: 'tile', ts: 2, shiny: .5 }, 0, 14);
  for (let i = -2; i <= 2; i++) { b.box(i * 8, 24, 3, 18, 7, { col: '#5a4a3a', tex: 'wood', ts: 2 }); for (let j = 0; j < 5; j++) for (let k = 0; k < 9; k++) if ((i * 7 + j * 3 + k) % 4) b.add('box:.5:.35:.4', [i * 8 - 1.2 + (k % 3) * .6, 1 + j * 1.2, 24 - 8 + k * 1.8], { col: ['#c8a070', '#d8d0c0', '#a08860'][(k + j) % 3] }); }
  b.box(0, 5, 10, 1.6, 1.2, { col: '#6a4a30', tex: 'wood', ts: 2 }); b.box(0, 6.9, 4, .6, 3, { col: '#40404a' }, {}); b.add('box:1.4:.9:.1', [0, 2.4, 6.4], { col: '#40ff90', emis: .8 });
  b.add('box:3:.3:3', [0, 8.2, 0], { col: '#b8d8ff', emis: .6 });
  b.box(0, 33, 40, .6, 8, { col: '#403848', tex: 'stucco', ts: 3 }); b.add('box:6:5:.3', [0, 0, 32.6], { col: '#e8e8ff', emis: .5 }); b.add('box:2:3.6:.3', [0, 0.2, 32.4], { col: '#101020', shiny: .6 });
  b.lights.push({ p: [0, 7.8, 6], col: [.7, .8, 1], rad: 20, int: 1.4, glow: 1 }, { p: [0, 3, 6.4], col: [.4, 1, .6], rad: 6, int: 1.2, glow: 1 }, { p: [0, 5, 31], col: [.9, .9, 1], rad: 12, int: 1.4, glow: 1.2 });
  b.walkRect(-14, 1, 14, 12); b.walkRect(-2, 12, 2, 31); b.walkRect(-17, 13, 17, 17);
  b.autoCams(-17, 0, 17, 33, 11.4, 11, 10, 9, .95);
  b.cam('behind', [0, 8, 14.5], [0, .8, 8.5], 1.0, [-3, 7.3, 3, 12]);   // behind the clerk's panel, looking back from the aisle
  SCENES.dlo = Object.assign(b.fin(), { start: [0, 0, 2], arrive: [0, 2, 0], shipExit: [0, 2, 0] });
})();
