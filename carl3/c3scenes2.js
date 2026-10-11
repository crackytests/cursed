'use strict';
// ================= CARL 3: scenes for stops 1 and 2 (Box Canyon, the Starlite) =================
const _SB = SB;
SB = function (def) { // add building helpers to the builder
  const b = _SB(def);
  b.building = (x, z, w, d, h, mat, o = {}) => {
    b.box(x, z, w, d, h, mat); if (o.roof !== false) b.box(x, z, w + .6, d + .6, .4, { col: o.roofCol || '#403838' }, { y: h, solid: false });
    const n = o.win === undefined ? Math.max(2, Math.floor(w / 3)) : o.win, ww = Math.min(1.8, w / n * .6);
    for (let i = 0; i < n; i++) b.add('box:' + ww + ':1.1:.1', [x - w / 2 + (i + .5) * w / n, o.wy || 1.7, z - d / 2 - .05], { col: o.wcol || '#ffd070', emis: o.wem === undefined ? .9 : o.wem });
    if (o.door) b.add('box:' + (o.door.w || 1.4) + ':' + (o.door.h || 2.4) + ':.12', [o.door.x === undefined ? x : o.door.x, 0, z - d / 2 - .05], { col: o.door.col || '#2a1a10', emis: o.door.emis || 0 });
    if (o.sign) b.sign(x + (o.sign.dx || 0), o.sign.y || h + 1.1, z - d / 2 - .1, o.sign.w || w * .6, o.sign.h || 1.1, o.sign.col, { rad: 8, lz: -1.5 });
    return b;
  };
  return b;
};
const NOSOL = { solid: false };
// floating words over storefronts: the signs are lit blocks, this is what they say
const signWords = L => { for (const [t, p, c] of L) { const sp = project(LIVE.cam, p); if (sp) text(t, sp[0] - t.length * 3, sp[1] - 3, hex(c), BLACK, 1); } };
// ---- BOX CANYON, main street, at dusk ----
(() => {
  const b = SB({ amb: [.42, .34, .46], sun: { dir: [-.8, .34, -.45], col: [.95, .58, .34] }, sky: ['#2a1060', '#ff8a4a'], fog: { col: '#a05a60', dens: .009 }, music: 'canyon', title: 'BOX CANYON, NEVADA' });
  b.ground(220, 120, { col: '#b09068', tex: 'sand', ts: 4 }, 0, 20);
  b.add('plane:130:7', [0, .02, 7.5], { col: '#7a7a82', tex: 'asphalt', ts: 3, shiny: .2 }); b.add('plane:130:.25', [0, .03, 7.5], { col: '#e8c850', emis: .1 });
  b.building(-18, 22, 14, 8, 4.4, { col: '#d8b8a0', tex: 'stucco', ts: 3 }, { win: 3, door: { x: -18, w: 1.6, h: 2.5 }, sign: { col: '#ff4068', w: 8, h: 1.3 } });
  b.building(2, 22, 16, 9, 4.8, { col: '#d0c8b0', tex: 'brick', ts: 3 }, { win: 3, door: { x: 2, w: 2, h: 2.6, col: '#40302a' }, roofCol: '#503030' });
  b.building(21, 22, 12, 8, 4.2, { col: '#c0a890', tex: 'stucco', ts: 3 }, { win: 2, door: { x: 21, w: 1.6, h: 2.4 }, sign: { col: '#ffd040', w: 6, h: 1.1 } });
  b.cyl(-6, -5, .25, 8, { col: '#605850' }, { solid: true, seg: 6 }); b.cyl(-6, -5, 2, 2.2, { col: '#8a5a40', tex: 'wood', ts: 2 }, { y: 8, seg: 10, solid: false });  // the water tower
  b.add('box:3:.5:1', [2, 5.6, 17.4], { col: '#e8e8e8', emis: .1 }); b.add('box:.15:6:.15', [-4.3, 0, 17.4], { col: '#e0e0e0' }); b.add('box:1.8:1.1:.05', [-3.4, 5.1, 17.4], { col: '#d03030' }, {});   // flag
  b.lamp(-10, 12, { h: 6, col: [1, .8, .5], rad: 11, int: 1.3 }); b.lamp(12, 12, { h: 6, col: [1, .8, .5], rad: 11, int: 1.3 }); b.lamp(30, 12, { h: 6, col: [1, .8, .5] });
  b.cactus(-30, 16); b.cactus(34, 14, 3.2); b.cactus(8, -4, 2.4); b.box(26, -3, 3, 1.4, 1.4, { col: '#8a6a40', tex: 'wood', ts: 2 }); b.box(-22, 4, .8, .8, .8, { col: '#5a6a7a', tex: 'metal', ts: 1 });
  b.walkRect(-34, 1.4, 36, 14.2);
  b.autoCams(-34, 1, 36, 14.5, 18, 13, 6.5, 3.6, .95);
  SCENES.canyon_main = Object.assign(b.fin(), { start: [-26, 0, 8], arrive: [-26, 8, 1.6], shipExit: [-26, 8, 1.6], drawOver: () => {
    signWords([['DINER', [-18, 5.5, 17.7], '#ffe0e8'], ['PAWN', [21, 5.3, 17.7], '#fff0c0'], ['POST OFFICE', [2, 6.4, 17.3], '#ffffff']]);
    if (F3('panelFixed')) { const sp = project(LIVE.cam, [2, 5.9, 17.2]); if (sp && (WX.t >> 4) & 1) text('OPEN', sp[0] - 12, sp[1] - 3, hex('#ff4068'), BLACK, 1); }
  } });
})();
// ---- the post office, inside ----
(() => {
  const b = SB({ amb: [.5, .42, .38], sun: { dir: [.1, 1, -.2], col: [.3, .26, .22] }, sky: ['#201010', '#301818'], fog: { col: '#201818', dens: .003 }, music: 'canyon', title: 'POST OFFICE' });
  b.ground(18, 14, { col: '#9a7a50', tex: 'wood', ts: 2, shiny: .3 }, 0, 6);
  b.box(0, 12.4, 18, .6, 4.4, { col: '#a89070', tex: 'stucco', ts: 3 }); b.box(-9, 6, .6, 14, 4.4, { col: '#a89070', tex: 'stucco', ts: 3 }); b.box(9, 6, .6, 14, 4.4, { col: '#a89070', tex: 'stucco', ts: 3 });
  for (let i = -3; i <= 3; i++) for (let j = 0; j < 3; j++) b.add('box:.9:.7:.15', [i * 1.15, 1.2 + j * .85, 11.95], { col: j === 1 && i === 1 ? '#ffd040' : '#c8c8c0', emis: j === 1 && i === 1 ? .8 : 0, shiny: .5 });   // the P.O. boxes
  b.box(0, 7.4, 7, 1.0, 1.1, { col: '#6a4a30', tex: 'wood', ts: 2 }); b.box(0, 7.4, 7.2, .2, .08, { col: '#d8d0c0' }, { y: 1.1, solid: false });
  b.box(-5.5, 3.6, 2.2, 1.2, .9, { col: '#6a4a30', tex: 'wood', ts: 2 }); b.box(5.5, 3.4, 1.6, 1.6, 1.4, { col: '#808890', tex: 'metal', ts: 2 }); b.box(5.5, 3.4, 1.2, 1.2, .1, { col: '#ff4040', emis: .7 }, { y: 1.45, solid: false });
  b.box(-8.6, 9, .3, 3, 2.2, { col: '#d8d8d8' }, { y: 1, solid: false });
  b.lights.push({ p: [0, 3.8, 6], col: [1, .85, .6], rad: 14, int: 1.6, glow: .6 }, { p: [-6, 3, 3], col: [1, .8, .5], rad: 7, int: 1.2 }, { p: [5.5, 2.6, 3.4], col: [1, .3, .3], rad: 4, int: 1, glow: .8 });
  b.walkRect(-8, 1, 8, 11.6);
  b.cam('po', [0, 5.6, -3.6], [0, 1, 6.5], 1.0, [-20, -20, 20, 20]);
  SCENES.canyon_post = Object.assign(b.fin(), { start: [0, 0, 1.8] });
})();
// ---- THE STARLITE MOTOR COURT. a u-shaped motel with a pool nobody has filled ----
(() => {
  const b = SB({ amb: [.4, .34, .5], sun: { dir: [-.3, .8, -.5], col: [.3, .3, .6] }, sky: ['#000012', '#2a1450'], stars: 1, moon: { p: [40, 50, 120], r: 8 }, fog: { col: '#201038', dens: .01 }, music: 'motel', title: 'THE STARLITE MOTOR COURT' });
  b.ground(160, 130, { col: '#8a8a94', tex: 'asphalt', ts: 4, shiny: .45 }, 0, 20);
  b.ground(30, 20, { col: '#c8c0b8', tex: 'concrete', ts: 2 }, 0, 15);
  for (let i = 0; i < 4; i++) b.add('plane:.2:4', [-11 + i * 7, .02, 5], { col: '#e8e8d0' });
  // the u: office in the middle of the back, wings left and right
  b.building(0, 28, 10, 6, 3.8, { col: '#e8c8b8', tex: 'stucco', ts: 3 }, { win: 2, door: { x: 0, w: 1.6, h: 2.4, col: '#60e8ff', emis: .6 } });
  b.building(-17, 20, 20, 5, 3.4, { col: '#c8a8a8', tex: 'stucco', ts: 3 }, { win: 5, wcol: '#ff9ac0', wem: .45 });
  b.building(17, 20, 20, 5, 3.4, { col: '#a8b8c8', tex: 'stucco', ts: 3 }, { win: 5, wcol: '#70e0ff', wem: .45 });
  for (let i = 0; i < 5; i++) { b.add('box:1.1:2.2:.1', [-24 + i * 4, 0, 17.4], { col: '#503030' }); b.add('box:1.1:2.2:.1', [10 + i * 4, 0, 17.4], { col: i === 1 ? '#ff4040' : '#304050', emis: i === 1 ? .55 : 0 }); }   // room 6 glows, where its trigger is
  b.sign(-14, 6.2, 27.6, 7.5, 2.2, '#ff3a90', { rad: 15, lz: -2 }); b.sign(-14, 3.9, 27.6, 6, .9, '#38e8ff', { rad: 6 }); b.cyl(-14, 28.2, .18, 6, { col: '#50505a' }, { seg: 6, solid: true });
  b.box(0, 13, 8, 4.4, .5, { col: '#2a5aa0', shiny: .6 }, { y: 0 }); b.box(0, 13, 7.4, 3.8, .3, { col: '#3a1a50' }, { y: .5, solid: false });   // empty pool: dark
  b.cyl(2, 13, .2, 1, { col: '#ff68a8' }, { solid: true, seg: 6 });                                                                                       // a flamingo, in spirit
  b.box(-4.5, 22, 1.3, 1, 2, { col: '#c03030', shiny: .5 }); b.box(-2.7, 22, 1.3, 1, 2, { col: '#2050c0', shiny: .5 }); b.box(4.5, 22, 1.2, .8, 1.3, { col: '#a0c0d0', shiny: .6 }); // vending, vending, ice machine
  b.lamp(-8, 9, { h: 5, col: [1, .55, .4], rad: 12, glow: 1 }); b.lamp(8, 9, { h: 5, col: [.5, .8, 1], rad: 12, glow: 1 }); b.lamp(0, 24, { h: 5, col: [1, .9, .7], rad: 10 });
  b.car(-6, 6, .3, '#a03030'); b.car(24, 8, -.2, '#3a6a9a');
  b.cactus(-26, 8); b.cactus(28, 24, 3);
  b.walkRect(-26, 1, 28, 21.4); b.walkRect(-6, 17, 6, 24.6);
  b.autoCams(-26, 1, 28, 22, 16, 11, 6, 3.4, .95);
  SCENES.motel_lot = Object.assign(b.fin(), { start: [-22, 0, 4], arrive: [-22, 4, 1.6], shipExit: [-22, 4, 1.6],
    drawOver: () => signWords([['ST RL TE', [-14, 6.2, 27.4], '#ffe0f0'], ['OFFICE', [0, 3.2, 24.8], '#e0ffff'], ['ROOM 6', [14, 2.8, 17.2], '#ffd0d0'], ['ICE', [4.5, 1.9, 21.4], '#e0f0ff'], ['VENDING', [-3.6, 2.5, 21.4], '#ffffff']]) });
})();
// ---- ROOM 6 ----
(() => {
  const b = SB({ amb: [.4, .32, .34], sun: { dir: [.2, 1, -.3], col: [.3, .24, .22] }, sky: ['#100810', '#201020'], fog: { col: '#1a1018', dens: .002 }, music: 'motel', title: 'ROOM 6' });
  b.ground(10, 8, { col: '#7a4a4a', tex: 'carpet', ts: 2 }, 0, 4);
  b.box(0, 8.3, 10, .5, 3.2, { col: '#d8c8b0', tex: 'stucco', ts: 2 }); b.box(-5.2, 4, .5, 8, 3.2, { col: '#d8c8b0', tex: 'stucco', ts: 2 }); b.box(5.2, 4, .5, 8, 3.2, { col: '#d8c8b0', tex: 'stucco', ts: 2 });
  b.box(-2.4, 6.2, 3, 3.4, .7, { col: '#e8e0d0' }); b.box(-2.4, 7.8, 3, .3, 1.4, { col: '#6a3a2a', tex: 'wood', ts: 1 });        // the bed
  b.box(2.4, 7.8, 1.6, .8, .8, { col: '#6a4a30', tex: 'wood', ts: 2 }); b.box(2.4, 7.8, .5, .5, .15, { col: '#ffe0a0', emis: .8 }, { y: .8, solid: false });
  b.add('box:3.4:2.2:.1', [0, 1.1, 8.0], { col: '#d8c898' }); for (let i = 0; i < 7; i++) b.add('box:.18:.18:.14', [-1.4 + i * .45, 1.5 + Math.sin(i * 2) * .6, 7.93], { col: '#c02828', emis: .4 });  // the route map, with pins
  b.box(-4.6, 2.2, .6, 1.6, 1.5, { col: '#5a6a7a' });
  b.lights.push({ p: [0, 2.8, 4], col: [1, .75, .5], rad: 11, int: 1.4 }, { p: [2.4, 1.8, 7.4], col: [1, .85, .55], rad: 5, int: 1.2, glow: .6 }, { p: [0, 2, 7.5], col: [1, .5, .4], rad: 5, int: .8 });
  b.walkRect(-4.4, 1, 4.4, 7.4);
  b.cam('r6', [0, 5, -1.6], [0, 1, 5.2], 1.0, [-20, -20, 20, 20]);
  SCENES.motel_room6 = Object.assign(b.fin(), { start: [0, 0, 1.8] });
})();
