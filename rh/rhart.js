'use strict';
// ================= CARL: RESIDENT HUMAN. the neighbors, the furniture, and their busts =================
const RH = { name: 'RESIDENT HUMAN' };
// ---------------- people (full-body models, same parts the CARL 3 engine draws) ----------------
function orrinModel() { // the model tenant: visibly inhuman, immaculate paperwork
  const sk = [150, 178, 186], cardi = [168, 148, 208], dark = [20, 20, 30], P = [];
  P.push({ m: 'box:.46:.9:.3', o: [0, .95, 0], col: cardi }, { m: 'box:.5:.18:.32', o: [0, 1.28, 0], col: [236, 236, 244] });
  P.push({ m: 'sphere:.2:10:7', o: [0, 1.82, 0], col: sk, s: [1, 1.35, 1], j: 'head', head: 1 }, { m: 'sphere:.075:6:4', o: [-.1, 1.88, .15], col: dark, s: [1, 1.5, .5], j: 'head', head: 1 }, { m: 'sphere:.075:6:4', o: [.1, 1.88, .15], col: dark, s: [1, 1.5, .5], j: 'head', head: 1 });
  P.push({ m: 'cyl:.012:.5:4', o: [-.07, 2.0, 0], col: sk, j: 'head', head: 1 }, { m: 'cyl:.012:.5:4', o: [.07, 2.0, 0], col: sk, j: 'head', head: 1 }, { m: 'sphere:.03:5:4', o: [-.07, 2.5, 0], col: [255, 216, 72], j: 'head', head: 1 }, { m: 'sphere:.03:5:4', o: [.07, 2.5, 0], col: [255, 216, 72], j: 'head', head: 1 });
  P.push({ m: shift('box:.1:.55:.1', 0, -.5, 0), o: [-.3, 1.4, 0], col: cardi, j: 'armL' }, { m: shift('box:.1:.55:.1', 0, -.5, 0), o: [.3, 1.4, 0], col: cardi, j: 'armR' }, { m: shift('box:.08:.4:.08', 0, -.36, 0), o: [-.26, 1.18, .08], col: cardi }, { m: shift('box:.08:.4:.08', 0, -.36, 0), o: [.26, 1.18, .08], col: cardi });
  P.push({ m: shift('box:.13:.9:.13', 0, -.9, 0), o: [-.11, .95, 0], col: [60, 60, 80], j: 'legL' }, { m: shift('box:.13:.9:.13', 0, -.9, 0), o: [.11, .95, 0], col: [60, 60, 80], j: 'legR' }, { m: shift('box:.15:.07:.26', 0, -.9, .04), o: [-.11, .95, 0], col: [30, 30, 40], j: 'legL' }, { m: shift('box:.15:.07:.26', 0, -.9, .04), o: [.11, .95, 0], col: [30, 30, 40], j: 'legR' });
  return { h: 2.5, parts: P };
}
function droneModel() { return { h: 1.4, parts: [{ m: 'sphere:.4:10:7', o: [0, 1.2, 0], col: [236, 236, 240] }, { m: 'sphere:.16:8:6', o: [0, 1.2, .36], col: [255, 36, 73] }, { m: 'cyl:.3:.08:10', o: [0, .86, 0], col: [90, 90, 100] }, { m: 'box:.5:.04:.04', o: [0, 1.62, 0], col: [255, 216, 72] }] }; }
function faceModel() { // New Face, in a hoodie, carrying one end of a sofa
  const dark = [24, 14, 44], neon = [255, 36, 219], P = [];
  P.push({ m: 'box:.5:.7:.3', o: [0, .9, 0], col: [40, 24, 80] }, { m: 'sphere:.21:10:7', o: [0, 1.7, 0], col: dark, s: [1, 1.1, 1], j: 'head', head: 1 }, { m: 'cyl:.13:.3:6:0', o: [0, 1.88, 0], col: dark, j: 'head', head: 1 });
  P.push({ m: 'box:.16:.02:.03', o: [0, 1.76, .2], col: neon, j: 'head', head: 1 }, { m: 'box:.05:.05:.03', o: [0, 1.84, .2], col: [109, 255, 36], j: 'head', head: 1 }, { m: 'box:.05:.03:.03', o: [-.07, 1.72, .2], col: [240, 240, 240], j: 'head', head: 1 }, { m: 'box:.05:.03:.03', o: [.07, 1.72, .2], col: [240, 240, 240], j: 'head', head: 1 });
  P.push({ m: shift('box:.13:.5:.13', 0, -.46, 0), o: [-.34, 1.46, 0], col: [40, 24, 80], j: 'armL' }, { m: shift('box:.13:.5:.13', 0, -.46, 0), o: [.34, 1.46, 0], col: [40, 24, 80], j: 'armR' });
  P.push({ m: shift('box:.17:.88:.17', 0, -.88, 0), o: [-.13, .88, 0], col: [30, 30, 50], j: 'legL' }, { m: shift('box:.17:.88:.17', 0, -.88, 0), o: [.13, .88, 0], col: [30, 30, 50], j: 'legR' }, { m: shift('box:.18:.08:.28', 0, -.88, .04), o: [-.13, .88, 0], col: [20, 20, 30], j: 'legL' }, { m: shift('box:.18:.08:.28', 0, -.88, .04), o: [.13, .88, 0], col: [20, 20, 30], j: 'legR' });
  return { h: 2, parts: P };
}
function garfModel() { // the detective, in a trench coat
  const P = [{ m: 'box:.6:.8:.4', o: [0, .8, 0], col: [176, 144, 96] }, { m: 'box:.66:.12:.44', o: [0, .5, 0], col: [150, 120, 76] }, { m: 'sphere:.22:10:7', o: [0, 1.46, 0], col: [255, 150, 36], s: [1.1, 1, 1], j: 'head', head: 1 }, { m: 'cyl:.07:.2:5:0', o: [-.15, 1.64, 0], col: [255, 150, 36], j: 'head', head: 1 }, { m: 'cyl:.07:.2:5:0', o: [.15, 1.64, 0], col: [255, 150, 36], j: 'head', head: 1 },
    { m: 'cyl:.34:.04:12', o: [0, 1.7, 0], col: [40, 34, 40], j: 'head', head: 1 }, { m: 'cyl:.18:.16:12', o: [0, 1.72, 0], col: [40, 34, 40], j: 'head', head: 1 }, { m: 'box:.07:.06:.03', o: [-.08, 1.5, .21], col: [200, 255, 80], j: 'head', head: 1 }, { m: 'box:.07:.06:.03', o: [.08, 1.5, .21], col: [200, 255, 80], j: 'head', head: 1 },
    { m: shift('box:.12:.5:.12', 0, -.46, 0), o: [-.36, 1.18, 0], col: [176, 144, 96], j: 'armL' }, { m: shift('box:.12:.5:.12', 0, -.46, 0), o: [.36, 1.18, 0], col: [176, 144, 96], j: 'armR' },
    { m: shift('box:.16:.5:.16', 0, -.5, 0), o: [-.14, .5, 0], col: [60, 50, 40], j: 'legL' }, { m: shift('box:.16:.5:.16', 0, -.5, 0), o: [.14, .5, 0], col: [60, 50, 40], j: 'legR' }];
  return { h: 1.9, parts: P };
}
function ghostModel() { return { h: 2, parts: [{ m: 'sphere:.42:12:8', o: [0, 1.4, 0], col: [238, 238, 255], s: [1, 1.2, 1] }, { m: 'cyl:.46:.9:12:.3', o: [0, .4, 0], col: [210, 210, 250] }, { m: 'box:.5:.1:.06', o: [0, 1.5, .38], col: [12, 12, 20] }, { m: 'box:.12:.08:.06', o: [-.1, .96, .34], col: [30, 30, 40] }, { m: 'box:.12:.08:.06', o: [.1, .96, .34], col: [30, 30, 40] }, { m: 'sphere:.05:5:4', o: [0, .96, .36], col: [20, 20, 28] }] }; }
Object.assign(PEOPLE, {
  bea: { top: '#e8e8f0', bottom: '#404858', skin: '#c8906a', hair: '#201010', apron: '#ffffff', cap: '#f0f0f0', shoe: '#e8e8e8' },
  roz: { top: '#b08aa0', bottom: '#605060', skin: '#e0b898', hair: '#d8d8d8', glasses: 1, hairStyle: 'big', k: .88, shoe: '#503830' },
  marisol: { top: '#2a7a6a', bottom: '#404858', skin: '#c89070', hair: '#201010', vest: '#f0c040', badge: 1, glasses: 1 },
  nell: { top: '#d8b8a0', bottom: '#586a8a', skin: '#e0b898', hair: '#5a3a2a', apron: '#f0e8d0', hairStyle: 'big', k: .92 },
  okafor: { top: '#6a4a9a', bottom: '#303848', skin: '#8a5a3a', hair: '#101010' },
  quill: { top: '#9a8a60', bottom: '#4a4a52', skin: '#e0b898', hair: '#b0a090', hat: '#6a5a40', beard: 1 },
  kid2: { top: '#e06a40', bottom: '#3a5a9a', skin: '#8a5a3a', hair: '#101010', k: .6 },
  mgr: { top: '#303a50', bottom: '#202838', skin: '#d8a888', hair: '#202020', tie: '#c02020', badge: 1 },
});
for (const k of ['bea', 'roz', 'marisol', 'nell', 'okafor', 'quill', 'kid2', 'mgr']) MODELS_P[k] = personModel(PEOPLE[k]);
Object.assign(MODELS_P, { orrin: orrinModel(), drone: droneModel(), face: faceModel(), garf: garfModel(), ghost: ghostModel() });
// ---------------- furniture and keepsakes (live models; the apartment shows only what you own) ----------------
const box3 = (w, h, d, c, o = [0, 0, 0], extra = {}) => Object.assign({ m: 'box:' + w + ':' + h + ':' + d, o, col: c }, extra);
const FURN = {
  mattress: { h: .3, parts: [box3(1.6, .28, 2.2, [220, 220, 210]), box3(1.64, .1, 2.24, [90, 70, 120], [0, 0, 0])] },
  crate: MODEL.crate,
  bowtie: { h: .3, parts: [box3(.16, .1, .04, [255, 216, 32], [-.1, .1, 0]), box3(.16, .1, .04, [255, 216, 32], [.1, .1, 0]), box3(.07, .09, .06, [224, 138, 0], [0, .1, 0.01]), box3(.04, .04, .06, [90, 70, 40], [0, .22, -.02])] },
  sofa: { h: .9, parts: [box3(2.2, .5, .9, [160, 70, 70]), box3(2.2, .55, .22, [140, 56, 56], [0, .5, -.34]), box3(.24, .7, .9, [140, 56, 56], [-1.0, 0, 0]), box3(.24, .7, .9, [140, 56, 56], [1.0, 0, 0])] },
  radio: { h: .5, parts: [box3(.7, .4, .3, [110, 80, 50]), box3(.46, .18, .04, [40, 255, 120], [0, .12, .16], { }), box3(.1, .1, .05, [230, 220, 200], [.26, .12, .17])] },
  lamp: { h: 1.5, parts: [{ m: 'cyl:.14:.06:8', o: [0, 0, 0], col: [90, 70, 50] }, { m: 'cyl:.03:1.1:6', o: [0, .06, 0], col: [90, 70, 50] }, { m: 'cyl:.3:.34:8:.2', o: [0, 1.1, 0], col: [255, 232, 160] }] },
  bong: { h: 1.6, parts: [{ m: 'cyl:.16:1.5:8', o: [0, 0, 0], col: [120, 210, 190] }, { m: 'sphere:.2:7:5', o: [0, .15, 0], col: [90, 170, 160] }, { m: 'cyl:.2:.1:8', o: [.12, 1.4, 0], col: [200, 200, 210] }] },
  plant: { h: 1, parts: [{ m: 'cyl:.22:.28:8:.18', o: [0, 0, 0], col: [176, 100, 70] }, { m: 'sphere:.26:7:5', o: [0, .5, 0], col: [60, 150, 70], s: [1, 1, 1] }, { m: 'sphere:.16:6:4', o: [.18, .7, .05], col: [80, 180, 90] }, { m: 'sphere:.14:6:4', o: [-.16, .66, -.04], col: [70, 160, 80] }] },
  curtains: { h: 2, parts: [box3(.5, 1.7, .1, [150, 60, 90], [-.55, 0, 0]), box3(.5, 1.7, .1, [150, 60, 90], [.55, 0, 0]), box3(1.7, .06, .1, [90, 70, 50], [0, 1.7, 0])] },
  rug: { h: .03, parts: [box3(1.8, .03, 1.2, [200, 150, 60])] },
  gift: { h: .4, parts: [box3(.32, .26, .3, [216, 90, 120]), box3(.1, .27, .31, [255, 230, 120])] },
  tele: { h: 1.6, parts: [{ m: 'cyl:.16:1.5:8', o: [0, 0, 0], col: [120, 210, 190] }, { m: 'cyl:.2:.18:8', o: [0, 1.5, 0], col: [40, 40, 60] }, box3(.7, .06, .06, [90, 70, 50], [0, .5, 0])] },
  saucepan: { h: .3, parts: [{ m: 'cyl:.2:.2:9', o: [0, 0, 0], col: [200, 200, 210] }, box3(.34, .04, .06, [150, 110, 60], [.26, .16, 0]), box3(.08, .045, .08, [80, 145, 177], [.34, .16, 0])] },
  cake: { h: .5, parts: [{ m: 'cyl:.3:.2:10', o: [0, 0, 0], col: [250, 220, 230] }, { m: 'cyl:.2:.16:10', o: [0, .2, 0], col: [216, 90, 120] }, box3(.03, .14, .03, [255, 230, 80], [0, .36, 0])] },
  sofa2: { h: .9, parts: [box3(2.2, .5, .9, [160, 70, 70]), box3(2.2, .55, .22, [140, 56, 56], [0, .5, -.34])] },
};
// ---------------- busts for the cast ----------------
regBust('ORRIN', { parts: [
  { m: 'sphere:.5:12:9', o: [0, 0, 0], col: [150, 178, 186], s: [.88, 1.22, .9] }, { m: 'cyl:.15:.3:8', o: [0, -.8, 0], col: [130, 156, 166] }, { m: 'box:1.4:.5:.6', o: [0, -1.2, 0], col: [168, 148, 208] }, { m: 'box:.5:.12:.5', o: [0, -.96, .05], col: [236, 236, 244] },
  { m: 'sphere:.15:8:6', o: [-.2, .08, .38], col: [14, 14, 22], s: [1, 1.5, .5], tag: 'eye' }, { m: 'sphere:.15:8:6', o: [.2, .08, .38], col: [14, 14, 22], s: [1, 1.5, .5], tag: 'eye' }, { m: 'box:.14:.04:.04', o: [0, -.26, .42], col: [90, 100, 110], tag: 'mouth' },
  { m: 'cyl:.015:.7:4', o: [-.14, .55, 0], col: [150, 178, 186] }, { m: 'cyl:.015:.7:4', o: [.14, .55, 0], col: [150, 178, 186] }, { m: 'sphere:.05:5:4', o: [-.14, 1.25, 0], col: [255, 216, 72] }, { m: 'sphere:.05:5:4', o: [.14, 1.25, 0], col: [255, 216, 72] }] }, '#b89aff');
regBust('BEA', genBust({ skin: '#c8906a', hair: '#201010', top: '#e8e8f0', cap: '#f0f0f0', collar: '#ffffff' }), '#ffb0c0');
regBust('ROZ', genBust({ skin: '#e0b898', hair: '#d8d8d8', hairStyle: 'big', top: '#b08aa0', glasses: 1 }), '#e0a8d0');
regBust('MARISOL', genBust({ skin: '#c89070', hair: '#201010', top: '#2a7a6a', glasses: 1, badge: 1 }), '#f0c040');
regBust('NELL', genBust({ skin: '#e0b898', hair: '#5a3a2a', hairStyle: 'big', top: '#d8b8a0', collar: '#f0e8d0' }), '#d8a070');
regBust('OKAFOR', genBust({ skin: '#8a5a3a', hair: '#101010', top: '#6a4a9a' }), '#a080e0');
regBust('QUILL', genBust({ skin: '#e0b898', hair: '#b0a090', top: '#9a8a60', hat: '#6a5a40', beard: 1 }), '#c8b880');
regBust('MANAGER', genBust({ skin: '#d8a888', hair: '#202020', top: '#303a50', tie: '#c02020', badge: 1 }), '#8fa0c0');
regBust(['DRONE', 'COMPLIANCE'], { parts: [{ m: 'sphere:.6:12:9', o: [0, 0, 0], col: [236, 236, 240] }, { m: 'sphere:.22:8:6', o: [0, 0, .5], col: [255, 36, 73], tag: 'eye' }, { m: 'cyl:.4:.1:10', o: [0, -.6, 0], col: [90, 90, 100] }, { m: 'box:.6:.05:.05', o: [0, .65, 0], col: [255, 216, 72] }, { m: 'box:.3:.03:.04', o: [0, -.3, .55], col: [60, 60, 70], tag: 'mouth' }] }, '#ff3a5a');
regBust(['KIOSK', 'NORMAL LIVING'], { parts: [{ m: 'box:1.2:1.4:.5', o: [0, 0, 0], col: [236, 236, 244] }, { m: 'box:.9:.7:.08', o: [0, .1, .28], col: [30, 60, 120] }, { m: 'box:.14:.14:.06', o: [-.2, .2, .34], col: [170, 230, 255], tag: 'eye' }, { m: 'box:.14:.14:.06', o: [.2, .2, .34], col: [170, 230, 255], tag: 'eye' }, { m: 'box:.5:.07:.06', o: [0, -.06, .34], col: [170, 230, 255], tag: 'mouth' }] }, '#7ad8ff');
regBust('VOICE', { parts: [{ m: 'sphere:.5:10:7', o: [0, 0, 0], col: [20, 20, 30] }, { m: 'box:.7:.06:.06', o: [0, .2, .46], col: [255, 216, 72], tag: 'mouth' }, { m: 'box:.5:.05:.05', o: [0, 0, .5], col: [255, 216, 72], tag: 'mouth' }, { m: 'box:.7:.06:.06', o: [0, -.2, .46], col: [255, 216, 72], tag: 'mouth' }] }, '#ffd848');
