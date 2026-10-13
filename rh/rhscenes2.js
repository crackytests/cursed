'use strict';
// ================= CARL: RESIDENT HUMAN. four more rooms: the leasing office, the diner, the model unit, and Dee's =================
(() => { // the leasing office: filing cabinets, a copier, a corkboard of verified faces
  const b = SB({ amb: [.4, .36, .46], sun: SUNN, sky: ['#201838', '#403068'], fog: { col: '#2a2048', dens: .002 }, music: 'tomorrow', title: 'LEASING OFFICE', smart: true });
  shell(b, -7, 7, 10, { col: '#d8c8e0', tex: 'stucco', ts: 3 }, { col: '#7a6a88', tex: 'carpet', ts: 2 });
  for (let i = 0; i < 4; i++) b.box(-5.4 + i * 1.1, 9.2, 1, .8, 1.8, { col: '#8a98b0', shiny: .4 });                       // filing cabinets
  b.box(0, 5.8, 3.2, 1.4, .9, { col: '#6a4a5a', tex: 'wood', ts: 1 }); b.box(5.4, 7.4, 1.4, 1.0, 1.0, { col: '#c8c8d8', shiny: .4 });  // desk, copier
  b.add('box:3.6:1.6:.1', [-4.8, 1.9, 6.9], { col: '#c8a878', tex: 'wood', ts: 1 }, { r: 1.5708 });                                    // corkboard (west wall)
  b.lights.push({ p: [0, 3.2, 4], col: [1, .94, .9], rad: 14, int: .9 }, { p: [5.4, 2.2, 7.4], col: [.6, 1, .8], rad: 4, int: .8, glow: .5 });
  b.walkRect(-6.4, 1, 6.4, 8);
  b.cam('o', [0, 6.2, -3.6], [0, 1.4, 6.6], 1.12, [-30, -30, 30, 30]);
  SCENES.office = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0] });
})();
(() => { // the diner: open all night, off the lobby
  const b = SB({ amb: [.4, .36, .34], sun: { dir: [.1, 1, -.25], col: [.2, .16, .14] }, sky: ['#201010', '#302018'], fog: { col: '#241810', dens: .002 }, music: 'home', title: 'THE LOBBY DINER (OPEN ALL NIGHT)', smart: true });
  shell(b, -8, 8, 11, { col: '#e8b8a8', tex: 'stucco', ts: 3 }, { col: '#7a8a8a', tex: 'tile', ts: 2, shiny: .15 });
  b.box(0, 8.6, 9, .9, 1.0, { col: '#c8c8d0', shiny: .4 }); for (let i = 0; i < 5; i++) b.cyl(-3.2 + i * 1.6, 7.4, .3, .7, { col: '#c0302a' }, { seg: 8, solid: true });  // counter, stools
  for (const [x, z] of [[-5.6, 4], [5.6, 4]]) { b.box(x, z, 1.8, 2.2, .9, { col: '#a0302a' }); b.box(x + (x < 0 ? -.8 : .8), z, .3, 2.2, 1.5, { col: '#a0302a' }); }  // booths
  b.box(-5.6, 9.6, 1.2, 1.0, 1.8, { col: '#3a3a6a', shiny: .5 }); b.add('box:.9:.3:.06', [-5.6, 1.6, 9.0], { col: '#ff7ae0', emis: .9 });            // jukebox
  b.add('box:5:1.0:.1', [0, 2.6, 10.9], { col: '#ff6a5a', emis: .6 });
  b.lights.push({ p: [0, 3.2, 5], col: [1, .85, .7], rad: 14, int: 1.0 }, { p: [-5.6, 1.8, 8.6], col: [1, .4, .9], rad: 5, int: 1, glow: .8 });
  b.walkRect(-7.4, 1, 7.4, 8);
  b.cam('d', [0, 6.4, -3.6], [0, .8, 5.6], 1.06, [-30, -30, 30, 30]);
  SCENES.diner = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0] });
})();
(() => { // MODEL UNIT 0: the showroom. nobody lives here. it's been furnished for them
  const b = SB({ amb: [.5, .5, .56], sun: SUNN, sky: ['#000008', '#080818'], fog: { col: '#10101c', dens: .004 }, music: 'below', title: 'MODEL UNIT 0' });
  shell(b, -6, 6, 9, { col: '#f0f0f4', tex: 'stucco', ts: 3 }, { col: '#c8c0b0', tex: 'wood', ts: 2, shiny: .3 });
  b.box(-3.4, 6.8, 2.2, 1.6, .6, { col: '#e8e0f0' }); b.box(3.2, 7.4, 3, 1.4, .8, { col: '#c8d8e8' }); b.box(-1.6, 3.6, 1.6, 1.0, .5, { col: '#d8c8a8', tex: 'wood', ts: 1 });
  b.add('box:1.4:.9:.06', [0, 1.8, 8.95], { col: '#201830' }); b.add('box:1.2:.7:.04', [0, 1.8, 8.9], { col: '#e8f0ff', emis: .4 });  // the framed clause
  b.lights.push({ p: [0, 3.2, 4], col: [1, 1, 1], rad: 14, int: .9 }, { p: [0, 2.4, 7], col: [.8, .9, 1], rad: 5, int: .8 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('m', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.model = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0] });
})();
(() => { // B2 door 10: the other side of Roz's wall
  const b = SB({ amb: [.42, .32, .26], sun: { dir: [.1, 1, -.2], col: [.2, .14, .1] }, sky: ['#000008', '#080818'], fog: { col: '#1a1008', dens: .004 }, music: 'home', title: 'B2 UNIT 10' });
  shell(b, -6, 6, 9, { col: '#d8a860', tex: 'stucco', ts: 3 }, { col: '#8a5a30', tex: 'wood', ts: 2, shiny: .2 });
  b.box(0, 8.7, 12, .15, 3, { col: '#e0cc98' }, { solid: false });
  for (let i = 0; i < 22; i++) b.add('box:' + (i % 3 === 0 ? .55 : .3) + ':.03:.04', [3.5, .4 + i * .075, 8.95], { col: ['#7a3a2a', '#2a5a7a', '#6a4a8a', '#3a7a4a'][i % 4] });  // the same marks
  b.box(-3.6, 6.8, 2, 1.2, .5, { col: '#a06040' }); b.box(2, 3.4, 1.4, 1.0, .8, { col: '#c8a878', tex: 'wood', ts: 1 });
  b.lights.push({ p: [0, 3, 4], col: [1, .8, .55], rad: 12, int: 1.2 }, { p: [3.5, 1.5, 8], col: [1, .9, .7], rad: 5, int: 1 });
  b.walkRect(-5.4, 1, 5.4, 7.8);
  b.cam('t', [0, 6.2, -3.6], [0, .8, 5.2], 1.02, [-30, -30, 30, 30]);
  SCENES.apt10 = Object.assign(b.fin(), { start: [0, 0, 1.6], arrive: [0, 1.8, 0] });
})();
