'use strict';
// ================= CARL 3: models. little low-poly people, parcels, the A.S.S. =================
// a part's mesh has its origin at its joint (shoulder, hip, neck) so the pose can swing it.
const shiftCache = {};
function shift(spec, dx, dy, dz) { const key = spec + '@' + dx + ',' + dy + ',' + dz; if (shiftCache[key]) return shiftCache[key]; const m = mesh(spec); return shiftCache[key] = { v: m.v.map(v => [v[0] + dx, v[1] + dy, v[2] + dz]), n: m.n, f: m.f }; }
const rgbh = h => { const c = hexRGB(h); return c; };
const MODEL = {};
// Carl: small, a big head, big green eyes, a dark backward cap, a yellow bow tie
MODEL.carl = {
  h: 1.16, parts: [
    { m: shift('box:.42:.34:.28', 0, 0, 0), o: [0, .26, 0], col: rgbh('#4c4c9c') },
    { m: shift('box:.44:.06:.3', 0, 0, 0), o: [0, .26, 0], col: rgbh('#2a2a52') },
    { m: 'sphere:.3:10:7', o: [0, .88, 0], col: rgbh('#5cc4a4'), j: 'head', head: 1 },
    { m: 'box:.15:.2:.05', o: [-.115, .84, .25], col: rgbh('#a8ff58'), j: 'head', head: 1 }, { m: 'box:.15:.2:.05', o: [.115, .84, .25], col: rgbh('#a8ff58'), j: 'head', head: 1 },
    { m: 'box:.07:.13:.03', o: [-.115, .87, .28], col: rgbh('#000000'), j: 'head', head: 1 }, { m: 'box:.07:.13:.03', o: [.115, .87, .28], col: rgbh('#000000'), j: 'head', head: 1 },
    { m: 'sphere:.32:10:6', o: [0, 1.0, -.02], s: [1, .62, 1], col: rgbh('#1a1a30'), j: 'head', head: 1 },
    { m: 'box:.34:.03:.2', o: [0, .98, -.36], col: rgbh('#1a1a30'), j: 'head', head: 1 },
    { m: 'box:.12:.07:.05', o: [-.06, .47, .155], col: rgbh('#ffd820') }, { m: 'box:.12:.07:.05', o: [.06, .47, .155], col: rgbh('#ffd820') }, { m: 'box:.05:.06:.07', o: [0, .47, .17], col: rgbh('#e08a00') },
    { m: shift('box:.1:.3:.1', 0, -.28, 0), o: [-.26, .58, 0], col: rgbh('#4c4c9c'), j: 'armL' }, { m: shift('box:.1:.3:.1', 0, -.28, 0), o: [.26, .58, 0], col: rgbh('#4c4c9c'), j: 'armR' },
    { m: shift('box:.11:.26:.12', 0, -.26, 0), o: [-.1, .26, 0], col: rgbh('#2a2a4a'), j: 'legL' }, { m: shift('box:.11:.26:.12', 0, -.26, 0), o: [.1, .26, 0], col: rgbh('#2a2a4a'), j: 'legR' },
    { m: shift('box:.13:.06:.2', 0, -.26, .03), o: [-.1, .26, 0], col: rgbh('#f0f0f0'), j: 'legL' }, { m: shift('box:.13:.06:.2', 0, -.26, .03), o: [.1, .26, 0], col: rgbh('#f0f0f0'), j: 'legR' },
  ],
};
// people: tall (1.8), a few options. everything is a primitive.
function personModel(o = {}) {
  const sk = rgbh(o.skin || '#d8a888'), hr = rgbh(o.hair || '#503820'), top = rgbh(o.top || '#6080b0'), bot = rgbh(o.bottom || '#383848'), sh = rgbh(o.shoe || '#202020'), k = o.k || 1;
  const parts = [
    { m: shift('box:.5:.62:.3', 0, 0, 0), o: [0, .88, 0], col: top },
    { m: 'sphere:.2:9:6', o: [0, 1.7, 0], col: sk, j: 'head', head: 1 },
    { m: shift('box:.14:.5:.14', 0, -.46, 0), o: [-.34, 1.46, 0], col: o.sleeve ? rgbh(o.sleeve) : top, j: 'armL' }, { m: shift('box:.14:.5:.14', 0, -.46, 0), o: [.34, 1.46, 0], col: o.sleeve ? rgbh(o.sleeve) : top, j: 'armR' },
    { m: shift('box:.17:.88:.17', 0, -.88, 0), o: [-.13, .88, 0], col: bot, j: 'legL' }, { m: shift('box:.17:.88:.17', 0, -.88, 0), o: [.13, .88, 0], col: bot, j: 'legR' },
    { m: shift('box:.18:.08:.28', 0, -.88, .04), o: [-.13, .88, 0], col: sh, j: 'legL' }, { m: shift('box:.18:.08:.28', 0, -.88, .04), o: [.13, .88, 0], col: sh, j: 'legR' },
    { m: 'box:.05:.05:.03', o: [-.07, 1.72, .19], col: [10, 10, 10], j: 'head', head: 1 }, { m: 'box:.05:.05:.03', o: [.07, 1.72, .19], col: [10, 10, 10], j: 'head', head: 1 },
  ];
  if (o.hairStyle !== 'bald') parts.push({ m: 'sphere:.215:9:5', o: [0, 1.78, -.02], s: [1, o.hairStyle === 'big' ? .9 : .6, 1], col: hr, j: 'head', head: 1 });
  if (o.hat) parts.push({ m: 'cyl:.24:.08:10', o: [0, 1.86, 0], col: rgbh(o.hat), j: 'head', head: 1 }, { m: 'cyl:.15:.12:10', o: [0, 1.92, 0], col: rgbh(o.hat), j: 'head', head: 1 });
  if (o.shades) parts.push({ m: 'box:.34:.06:.04', o: [0, 1.73, .19], col: [10, 10, 14], j: 'head', head: 1 });
  if (o.apron) parts.push({ m: 'box:.46:.5:.04', o: [0, .62, .16], col: rgbh(o.apron) });
  if (o.vest) parts.push({ m: 'box:.52:.4:.32', o: [0, 1.0, 0], col: rgbh(o.vest) });
  if (o.tie) parts.push({ m: 'box:.07:.3:.03', o: [0, 1.15, .16], col: rgbh(o.tie) });
  if (o.badge) parts.push({ m: 'box:.08:.08:.03', o: [.14, 1.3, .16], col: [255, 220, 60] });
  if (o.cap) parts.push({ m: 'sphere:.22:9:5', o: [0, 1.82, -.01], s: [1, .55, 1], col: rgbh(o.cap), j: 'head', head: 1 }, { m: 'box:.26:.03:.2', o: [0, 1.8, .22], col: rgbh(o.cap), j: 'head', head: 1 });
  if (o.glasses) parts.push({ m: 'box:.3:.05:.03', o: [0, 1.73, .2], col: [60, 60, 80], j: 'head', head: 1 });
  if (o.beard) parts.push({ m: 'sphere:.17:7:4', o: [0, 1.6, .06], s: [1, .8, .8], col: hr, j: 'head', head: 1 });
  if (o.wide) parts[0].s = [1.5, 1, 1.4];
  return { h: 1.9 * k, tall: 1, k, parts };
}
const PEOPLE = {
  clerk: { top: '#d8d8d0', bottom: '#404858', badge: 1, glasses: 1, hair: '#6a6a70' },
  postmaster: { top: '#3a5a8a', bottom: '#2a2a3a', hat: '#2a3a5a', badge: 1, hair: '#808080' },
  trucker: { top: '#a85028', bottom: '#2a4a8a', cap: '#c03020', beard: 1, hair: '#3a2a1a', wide: 1 },
  waitress: { top: '#f0a0b0', bottom: '#50405a', apron: '#ffffff', hair: '#b04020', hairStyle: 'big' },
  manager: { top: '#a090c8', bottom: '#504868', hair: '#4a3a30', glasses: 1, hairStyle: 'big' },
  guard: { top: '#303848', bottom: '#202838', cap: '#202838', badge: 1, shades: 1 },
  inspector: { top: '#1a1a1a', bottom: '#1a1a1a', tie: '#a02020', shades: 1, skin: '#e8e8e0', hair: '#e8e8e0', hairStyle: 'bald' },
  suit: { top: '#e8e8e8', bottom: '#d0d0d0', shoe: '#a0a0a0', shades: 1, skin: '#f0f0f0', hairStyle: 'bald' },
  linda: { top: '#c0307a', bottom: '#802058', skin: '#f0d0d0', hair: '#ff70b8', hairStyle: 'big', shoe: '#ffffff' },
  farmer: { top: '#587a40', bottom: '#4a4a5a', hat: '#c8a850', hair: '#7a5a3a', beard: 1 },
  kid: { top: '#f08030', bottom: '#3050b0', k: .6, hair: '#8a5a3a' },
  tourist: { top: '#40b0d0', bottom: '#e0d0a0', hat: '#f0e0a0', shades: 1, hair: '#503820' },
  mechanic: { top: '#3a5a9a', bottom: '#3a5a9a', cap: '#3a3a3a', hair: '#2a2a2a', badge: 1 },
};
const MODELS_P = {}; for (const k in PEOPLE) MODELS_P[k] = personModel(PEOPLE[k]);
// parcels and the ship
function parcelModel(col = '#c8a070', label = '#f8f8e8') { return { h: .4, parts: [{ m: 'box:.5:.36:.4', o: [0, 0, 0], col: rgbh(col) }, { m: 'box:.12:.37:.41', o: [0, 0, 0], col: rgbh('#e8dcb0') }, { m: 'box:.2:.01:.14', o: [.1, .365, .06], col: rgbh(label) }] }; }
MODEL.parcel = parcelModel();
MODEL.parcelHer = parcelModel('#d8d8d8', '#ff5090');
MODEL.crate = { h: .5, parts: [{ m: 'box:.55:.5:.45', o: [0, 0, 0], col: rgbh('#b08848') }, { m: 'box:.58:.06:.48', o: [0, .22, 0], col: rgbh('#8a6a38') }, { m: 'box:.58:.06:.48', o: [0, .0, 0], col: rgbh('#8a6a38') }] };
MODEL.tumbleweed = { h: .6, parts: [{ m: 'sphere:.3:7:5', o: [0, .3, 0], col: rgbh('#b09060') }] };
// run a pose through a model and draw it
function drawModel(M, st, light) {
  const c = Math.cos(st.yaw || 0), s = Math.sin(st.yaw || 0), k = st.s || M.k || 1, pose = st.pose || {};
  for (const pt of M.parts) {
    const ang = pt.j ? (pose[pt.j] || 0) : 0, o = pt.o, ox = o[0] * k, oy = o[1] * k + (st.bob || 0), oz = o[2] * k, headYaw = pt.head ? (pose.headYaw || 0) : 0;
    const wp = [st.p[0] + ox * c + oz * s, st.p[1] + oy, st.p[2] - ox * s + oz * c];
    if (pt.s) { const mm = mesh(pt.m); drawMeshLive({ v: mm.v.map(v => [v[0] * pt.s[0], v[1] * pt.s[1], v[2] * pt.s[2]]), n: mm.n, f: mm.f }, { p: wp, yaw: (st.yaw || 0) + headYaw, s: k, rx: ang }, pt.col, light); }
    else drawMeshLive(mesh(pt.m), { p: wp, yaw: (st.yaw || 0) + headYaw, s: k, rx: ang }, pt.col, light);
  }
}
