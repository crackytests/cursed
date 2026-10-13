'use strict';
// ================= ROMANCING STREAM: the cast, as rigs =================
// a person builder for humans (and cats, and masks), special rigs for the alien, the ghost, and the monsters.
const SK = { fair: [246, 214, 190], tan: [228, 176, 136], warm: [214, 160, 118], dark: [150, 102, 76], pale: [236, 232, 226] };
function hairShapes(style, col) {
  const dk = col.map(v => v * .82);
  switch (style) {
    case 'long': return { back: [RP([[-5, -11], [4, -12], [7, -6], [5, 4], [3, 12], [-3, 14], [-7, 8], [-7, -4]], col)], bang: [RP([[-3.6, -11.6], [2, -13], [6.6, -10.6], [7.2, -7.4], [4.6, -9.6], [1.8, -8.8], [-1, -9.2], [-3.8, -7.6]], col)] };
    case 'wavy': return { back: [RP([[-4, -11], [3, -12], [6, -7], [5, -1], [3, 4], [-2, 4], [-6, 6], [-7, 0], [-6, -6]], col)], bang: [RP([[-3.4, -11.8], [2, -13.2], [6.8, -10.8], [7.4, -7.4], [4.8, -9.8], [2.2, -8.4], [-.5, -9], [-3.6, -7.6]], col)] };
    case 'short': return { back: [RP([[-5, -10], [3, -12.6], [7, -9], [6, -6], [-1, -8], [-5, -4]], col)], bang: [RP([[-3, -11.6], [3, -12.8], [7, -9.6], [5.8, -8.4], [2, -9.6], [-2.4, -9.2]], col)] };
    case 'spiky': return { back: [RP([[-6, -6], [-10, -10], [-5, -12], [-7, -17], [-1, -14], [1, -19], [4, -13.6], [9, -15], [7, -9], [10, -6], [5, -7], [0, -6]], col), RP([[-6, -6], [-9, -2], [-5, -1], [-3, -5]], dk)], bang: [RP([[-1, -12], [7, -10], [6.6, -7], [4, -9], [1, -8]], col)] };
    case 'bowl': return { back: [RP([[-6, -7], [-5, -11], [0, -13.4], [5, -12.6], [7.4, -9], [7.4, -7], [-1, -8], [-6, -4]], col)], bang: [RP([[-4, -11], [6.6, -11], [7.4, -7.6], [-4, -7.4]], col)] };
    case 'bun': return { back: [RP([[-5, -10], [3, -12.6], [7, -9], [5, -7], [-1, -8], [-5, -5]], col), RE(-4.6, -11.6, 3, 3, col)], bang: [RP([[-3, -11.6], [3, -12.8], [7, -9.6], [5.8, -8.4], [2, -9.6], [-2.4, -9.2]], col)] };
    case 'pomp': return { back: [RP([[-5, -9], [-2, -15], [6, -16], [9, -12], [7, -9], [-1, -8], [-5, -5]], col)], bang: [] };
    default: return { back: [], bang: [] };
  }
}
function hatShapes(kind) {
  switch (kind) {
    case 'crown': return [RP([[-2.6, -12.6], [-2.2, -18.6], [-.2, -14.6], [2.2, -19.8], [4.4, -14.4], [6.4, -18.4], [6.8, -12.6]], [255, 214, 90], RFLAT), RC(-2.4, -12.4, 6.6, -12.4, 1.4, [240, 190, 70], RFLAT)];
    case 'fedora': return [RE(1.5, -11.2, 9, 2, [92, 74, 60]), RP([[-3.4, -11.4], [-2.6, -16.4], [5.6, -17], [6.6, -11.4]], [104, 84, 66]), RC(-3.2, -12.6, 6.4, -12.6, 1.6, [40, 30, 26], RFLAT)];
    case 'cap': return [RP([[-4.6, -9.8], [-4, -14], [5, -14.4], [7, -10.4]], [40, 64, 140]), RP([[5, -10.8], [11, -10.4], [10, -9.2], [5, -9.4]], [30, 48, 110]), RE(1, -12.6, 1.4, 1.2, [255, 214, 90], RFLAT)];
    case 'visor': return [RC(-3, -7.4, 7.6, -7.2, 3, [230, 40, 50], { sh: 0 }), RC(-4, -10.6, 6, -10.6, 1.6, [200, 30, 40], RFLAT)];
    case 'helm': return [RP([[-5.6, -6], [-5, -12.6], [1, -14.8], [7, -12], [7.6, -6], [5, -6], [5, -9], [-2, -9]], [190, 40, 50]), RC(1, -15, 1, -19, 2, [255, 214, 90], RFLAT)];
    case 'police': return [RP([[-4.6, -10.6], [-4, -14.4], [6, -14.4], [7, -10.6]], [40, 52, 104]), RC(-4.6, -10.8, 9.6, -10.6, 1.8, [24, 28, 50], RFLAT), RE(1.4, -12.6, 1.4, 1.4, [255, 214, 90], RFLAT)];
    case 'hood': return [RP([[-6, -4], [-6, -12], [0, -15], [6, -13], [8, -8], [7, -4], [3, -10], [-2, -9]], [92, 60, 120])];
    default: return [];
  }
}
function weaponShapes(kind) {
  switch (kind) {
    case 'sword': return [RC(0, 6, 0, 22, 2.2, [214, 222, 236]), RC(-3.2, 6.8, 3.2, 6.8, 1.6, [240, 190, 70], RFLAT), RE(0, 5, 1.2, 1.2, [240, 190, 70], RFLAT)];
    case 'rapier': return [RC(0, 6, 0, 24, 1.4, [226, 232, 244]), RE(0, 6.6, 2.4, 1.4, [240, 190, 70])];
    case 'club': return [RC(0, 5, 0, 15, 3.6, [70, 50, 44])];
    case 'mic': return [RC(0, 5, 0, 12, 1.8, [60, 60, 70]), RE(0, 13.4, 2.4, 2.6, [190, 190, 210])];
    case 'gun': return [RP([[-1, 5], [7, 5], [7, 7.6], [1, 7.6], [1, 10], [-1, 10]], [60, 58, 70])];
    case 'raygun': return [RP([[-1, 5], [6, 4.4], [8, 6], [6, 7.6], [1, 7.6], [1, 10], [-1, 10]], [80, 220, 240]), RE(8.6, 6, 1.2, 1.2, [255, 120, 220], RFLAT)];
    case 'staff': return [RC(0, -6, 0, 20, 1.8, [150, 110, 70]), RE(0, -7, 2.6, 2.6, [140, 230, 255])];
    case 'sling': return [RC(0, 5, 0, 10, 1.8, [130, 90, 50]), RC(0, 10, -3, 14, 1.4, [130, 90, 50]), RC(0, 10, 3, 14, 1.4, [130, 90, 50])];
    case 'axe': return [RC(0, 4, 0, 16, 2, [110, 80, 60]), RP([[-1, 16], [7, 16], [8, 22], [-1, 22]], [200, 206, 216]), RP([[-1, 16], [-6, 19], [-1, 21]], [190, 196, 206], RFLAT)];
    case 'bow': return [RC(-1, 4, -1, 18, 1.6, [140, 100, 60]), RC(-4, 6, 2, 16, .8, [230, 226, 214], RFLAT), RC(-1, 4, -1, 4, 1, [110, 80, 60], RFLAT)];
    case 'wraps': return [RE(0, 7, 2.4, 2.4, [236, 232, 224])];
    default: return [];
  }
}
// the person builder
function person(o) {
  const k = o.kid ? .76 : (o.k || 1), lu = 8 * k, ll = 7.6 * k, hipY = -(lu + ll + 1.4), th = 12.4 * k, top = o.top, trim = o.trim || top.map(v => v * .8), bot = o.bot, skin = o.skin || SK.fair;
  const legC = o.legs || bot, boot = o.boots || [70, 54, 46], hair = hairShapes(o.hair || 'short', o.hairC || [80, 50, 36]);
  const faceSh = o.face || [RE(1.5, -6, 5.6, 6.1, skin), RE(4.2, -6.4, 1.2, 1.6, o.eye || [56, 40, 40], RFLAT), RC(2.6, -9.2, 6.2, -8.6, 1, o.brow || [90, 56, 46], RFLAT), RC(4.6, -2.6, 6.2, -2.8, 1, [170, 70, 70], RFLAT), RE(6.6, -5, .7, 1, skin.map(v => v * .86), RFLAT)];
  const P = [
    { n: 'hip', p: null, o: [0, hipY], z: 3, sh: o.skirt ? [RP([[-5.6, -2], [6.4, -2], [9.6, 6.6], [-8.6, 6.6]], bot)] : o.robe ? [RP([[-5.6, -2], [6.4, -2], [9, lu + ll + 1], [-8.4, lu + ll + 1]], bot)] : [RP([[-5, -1.6], [5.6, -1.6], [5, 2.4], [-4.6, 2.4]], bot)] },
    { n: 'legB', p: 'hip', o: [-1, 1.6], z: 1, dim: .8, sh: [RC(0, 0, 0, lu, 4.2 * Math.max(.85, k), legC)] }, { n: 'shinB', p: 'legB', o: [0, lu], z: 1, dim: .8, sh: [RC(0, 0, 0, ll, 3.6 * Math.max(.85, k), legC), RE(1.6, ll, 3.4, 1.8, boot)] },
    { n: 'legF', p: 'hip', o: [1, 1.6], z: 4, sh: [RC(0, 0, 0, lu, 4.2 * Math.max(.85, k), legC)] }, { n: 'shinF', p: 'legF', o: [0, lu], z: 4, sh: [RC(0, 0, 0, ll, 3.6 * Math.max(.85, k), legC), RE(1.6, ll, 3.6, 1.9, boot)] },
    { n: 'torso', p: 'hip', o: [0, 0], z: 5, sh: [RP([[-4.6, 0], [4.6, 0], [5.6, -th / 2], [4.6, -th], [-4.6, -th], [-5.6, -th / 2]], top)].concat(o.torsoX || []) },
    { n: 'head', p: 'torso', o: [0, -th], z: 7, sh: faceSh.concat(hair.bang, hatShapes(o.hat), o.headX || []) },
    { n: 'hairB', p: 'head', o: [0, 0], z: 6, sh: hair.back },
    { n: 'armB', p: 'torso', o: [-.5, -th + 1.4], z: 2, dim: .8, sh: [RC(0, 0, 0, 6.2 * k, 3.4, o.sleeve || top)] },
    { n: 'foreB', p: 'armB', o: [0, 6.2 * k], z: 2, dim: .8, sh: [RC(0, 0, 0, 5.6 * k, 3, o.fore || o.sleeve || top), RE(0, 6.4 * k, 2, 2, o.hand || skin)] },
    { n: 'armF', p: 'torso', o: [.5, -th + 1.4], z: 8, sh: [RC(0, 0, 0, 6.2 * k, 3.6, o.sleeve || top)] },
    { n: 'foreF', p: 'armF', o: [0, 6.2 * k], z: 8, sh: [RC(0, 0, 0, 5.6 * k, 3.2, o.fore || o.sleeve || top), RE(0, 6.4 * k, 2.2, 2.2, o.hand || skin)] },
    { n: 'wpn', p: 'foreF', o: [0, 0], z: 9, vis: 'wpn', sh: weaponShapes(o.weapon) },
  ];
  if (o.pad) P.push({ n: 'pad', p: 'torso', o: [0, -th + 1], z: 9, sh: [RE(.5, 0, 4.4, 3.2, o.pad)] });
  if (o.cape) P.push({ n: 'capeA', p: 'torso', o: [-2, -th + 1], z: 0, sh: [RP([[2, 0], [-3, 0], [-7, 11], [-2, 15], [3, 3]], o.cape)] }, { n: 'capeB', p: 'capeA', o: [-4.5, 13], z: 0, sh: [RP([[2.5, 0], [-3, -1], [-6, 10], [-.5, 12]], o.cape.map(v => v * .8))] });
  if (o.coat) P.push({ n: 'coatA', p: 'hip', o: [0, 0], z: 4.5, sh: [RP([[-5.6, -2], [5.6, -2], [7, lu + 3], [1, lu + 4], [-7, lu + 3]], o.coat)] });
  if (o.tail) P.push({ n: 'tail', p: 'hip', o: [-4, 0], z: 0, sh: [RC(0, 0, -6, -4, 3, o.tail), RC(-6, -4, -8, -11, 2.6, o.tail)] });
  return { parts: P, h: -hipY + th + 14, kid: o.kid };
}
// ---------------- pose sets ----------------
const rpose = (o = {}) => Object.assign({ a: {}, o: {}, show: { wpn: 1 } }, o);
const PERSON_POSES = {
  idle: [0, 1].map(i => rpose({ a: { torso: .02 * i, armF: -.25, foreF: -.5, armB: .12, foreB: -.1, capeA: .2 + .06 * i, capeB: .3 + .1 * i, hairB: .04 - .04 * i, head: -.02, coatA: .05 * i, tail: .1 * i }, o: { torso: [0, i ? 0 : .8] } })),
  walk: [0, 1, 2, 3].map(i => { const p = i / 4 * 6.2832, s = Math.sin(p); return rpose({ dy: -Math.abs(Math.sin(p)) * 1.2, a: { torso: -.04, legF: -s * .7, shinF: Math.max(0, Math.sin(p + 1.1)) * .9, legB: s * .7, shinB: Math.max(0, Math.sin(p + 4.2)) * .9, armF: s * .5 - .1, foreF: -.4, armB: -s * .5, foreB: -.3, capeA: .4 + .12 * Math.sin(2 * p), capeB: .55 + .2 * Math.sin(2 * p - 1), hairB: .1 + .1 * Math.sin(2 * p), coatA: .1 + .1 * s, tail: .2 * s } }); }),
  attack: [
    rpose({ a: { torso: .14, legF: .3, shinF: .2, legB: -.4, shinB: .3, armF: 2.7, foreF: .4, armB: .5, capeA: .6, capeB: .8, hairB: .25, coatA: -.1 } }),
    rpose({ dx: 3, a: { torso: -.24, legF: -.55, shinF: .4, legB: .6, shinB: .5, armF: -1.2, foreF: -.1, armB: .8, capeA: .9, capeB: 1.1, hairB: .4, coatA: .2 } }),
    rpose({ dx: 3, a: { torso: -.14, legF: -.45, shinF: .3, legB: .5, shinB: .4, armF: -1.9, foreF: -.15, armB: .6, capeA: .8, capeB: 1.0, coatA: .2 } })],
  shoot: [rpose({ a: { torso: -.05, legF: -.3, legB: .3, armF: -1.57, foreF: 0, armB: .3 } }), rpose({ dx: -1, a: { torso: .02, legF: -.3, legB: .3, armF: -1.75, foreF: 0, armB: .3 } })],
  cast: [rpose({ show: {}, a: { armF: -2.7, foreF: -.3, armB: -2.4, foreB: -.2, capeA: .9, capeB: 1.1, hairB: .4, head: -.12 } }), rpose({ show: {}, dy: -1, a: { armF: -2.9, foreF: -.1, armB: -2.6, foreB: -.1, capeA: 1.2, capeB: 1.3, hairB: .6, head: -.16 } })],
  hurt: [rpose({ dx: 3, a: { torso: .38, legF: .4, shinF: .2, legB: -.5, shinB: .3, armF: 1.1, foreF: .5, armB: .8, foreB: .3, capeA: 1.1, capeB: 1.3, hairB: .9, head: .3 } })],
  down: [rpose({ show: {}, dy: 14, a: { hip: 1.45, torso: .1, legF: -.1, legB: .1, armF: .2, armB: -.2, head: .2, hairB: .5, capeA: -.2 } })],
  win: [rpose({ a: { armF: -2.9, foreF: -.2, armB: .3, head: -.1, capeA: .5, capeB: .7 } })],
};
// ---------------- special rigs ----------------
const CARL_RIG = { parts: [
  { n: 'hip', p: null, o: [0, -9.5], z: 3, sh: [RP([[-5, -1], [5, -1], [5, 3], [-5, 3]], [42, 42, 74])] },
  { n: 'legB', p: 'hip', o: [-2, 3], z: 1, dim: .8, sh: [RC(0, 0, 0, 6, 3.4, [42, 42, 74]), RE(1, 6.4, 3, 1.5, [240, 240, 248])] }, { n: 'legF', p: 'hip', o: [2, 3], z: 4, sh: [RC(0, 0, 0, 6, 3.4, [42, 42, 74]), RE(1, 6.4, 3.2, 1.6, [240, 240, 248])] },
  { n: 'torso', p: 'hip', o: [0, 0], z: 5, sh: [RP([[-5.5, 0], [5.5, 0], [5.5, -9], [-5.5, -9]], [76, 76, 156]), RP([[-3, -9], [0, -7], [3, -9], [3, -11], [-3, -11]], [255, 216, 32], { sh: 0 })] },
  { n: 'head', p: 'torso', o: [0, -9], z: 7, sh: [RE(1, -9, 9.5, 8.5, [92, 196, 164]), RE(-2.6, -9, 3.2, 4.2, [168, 255, 88], { sh: 0 }), RE(5.4, -9, 3.2, 4.2, [168, 255, 88], { sh: 0 }), RE(-2, -9, 1.4, 2.2, [10, 10, 10], RFLAT), RE(6, -9, 1.4, 2.2, [10, 10, 10], RFLAT), RC(0, -3.2, 3.6, -3.2, 1, [40, 90, 80], RFLAT), RP([[-8, -13], [10, -13], [9, -17.6], [-7, -17.6]], [26, 26, 48]), RC(-8, -13.4, -13, -12.4, 2.4, [26, 26, 48])] },
  { n: 'armB', p: 'torso', o: [-5, -8], z: 2, dim: .8, sh: [RC(0, 0, 0, 7.6, 3, [76, 76, 156])] }, { n: 'foreB', p: 'armB', o: [0, 7.6], z: 2, sh: [RE(0, 0, 2, 2, [92, 196, 164])] },
  { n: 'armF', p: 'torso', o: [5, -8], z: 8, sh: [RC(0, 0, 0, 7.6, 3.2, [76, 76, 156])] }, { n: 'foreF', p: 'armF', o: [0, 7.6], z: 8, sh: [RE(0, 0, 2.2, 2.2, [92, 196, 164])] },
  { n: 'wpn', p: 'foreF', o: [0, -5], z: 9, vis: 'wpn', sh: weaponShapes('club') }] };
const GHOST_RIG = { parts: [
  { n: 'hip', p: null, o: [0, -16], z: 3, sh: [RE(0, -6, 10, 13, [240, 238, 255]), RP([[-10, 0], [-8, 13], [-4, 8], [0, 14], [4, 8], [8, 13], [10, 0]], [232, 230, 252]), RE(-3, -10, 2.2, 3.2, [26, 18, 40], RFLAT), RE(5, -10, 2.2, 3.2, [26, 18, 40], RFLAT), RP([[-3, -3], [6, -3], [4, 1], [-1, 1]], [26, 18, 40], { sh: 0 })] },
  { n: 'armB', p: 'hip', o: [-8, -2], z: 2, dim: .85, sh: [RC(0, 0, -2, 6, 3.6, [236, 234, 255])] },
  { n: 'armF', p: 'hip', o: [8, -2], z: 6, sh: [RC(0, 0, 2, 6, 3.8, [240, 238, 255])] }, { n: 'foreF', p: 'armF', o: [2, 6], z: 6, sh: [] },
  { n: 'wpn', p: 'foreF', o: [0, -6], z: 7, vis: 'wpn', sh: weaponShapes('mic') }] };
const GHOST_POSES = {
  idle: [0, 1].map(i => rpose({ dy: i ? -2 : 0, a: { armF: -.3 + .1 * i, armB: .2 } })), walk: [0, 1, 2, 3].map(i => rpose({ dy: -Math.abs(Math.sin(i * 1.57)) * 2 - 1, a: { hip: -.08, armF: -.4, armB: .3 } })),
  attack: [rpose({ a: { armF: 2.2, hip: .1 } }), rpose({ dx: 4, a: { armF: -1.4, hip: -.18 } }), rpose({ dx: 4, a: { armF: -1.9, hip: -.1 } })], shoot: [rpose({ a: { armF: -1.57 } }), rpose({ a: { armF: -1.7 } })],
  cast: [rpose({ show: {}, dy: -2, a: { armF: -2.6, armB: -2.4 } }), rpose({ show: {}, dy: -4, a: { armF: -2.9, armB: -2.6 } })], hurt: [rpose({ dx: 4, a: { hip: .3, armF: 1, armB: .6 } })], down: [rpose({ show: {}, dy: 10, a: { hip: 1.4 } })], win: [rpose({ dy: -4, a: { armF: -2.8, armB: -2.6 } })] };
// ---------------- the eight ----------------
const HEROES = {
  carl:  { name: 'CARL', rig: CARL_RIG, poses: 'person', small: 1 },
  linda: { name: 'CEO LINDA', rig: person({ skin: SK.tan, hair: 'wavy', hairC: [240, 152, 194], hat: 'crown', top: [34, 42, 82], torsoX: [RP([[-3.6, -6], [3.6, -6], [4.4, -11.6], [-4.4, -11.6]], [226, 228, 242])], bot: [34, 42, 82], legs: [24, 28, 58], boots: [200, 206, 226], cape: [108, 68, 160], pad: [98, 130, 202], sleeve: [34, 42, 82], fore: [24, 28, 58], hand: [24, 28, 58], weapon: 'rapier', eye: [70, 104, 180] }) },
  ghost: { name: 'SPOOKY GHOST', rig: GHOST_RIG, poses: 'ghost' },
  face:  { name: 'NEW FACE', rig: person({ skin: [40, 30, 66], face: [RE(1.5, -6, 5.6, 6.1, [232, 230, 244]), RC(2.4, -6.6, 6.4, -6.6, 1.4, [255, 60, 200], RFLAT), RE(4.8, -11, 1.1, 1.4, [80, 240, 255], RFLAT), RC(0, -2.6, 5.6, -3, 1, [255, 60, 200], RFLAT), RC(-3, -4, -3, -10, 1, [80, 240, 255], RFLAT)], hair: 'spiky', hairC: [30, 22, 52], top: [36, 30, 60], torsoX: [RC(0, -1, 0, -11, 1, [255, 60, 200], RFLAT), RC(-3, -6, 3, -6, 1, [80, 240, 255], RFLAT)], bot: [30, 26, 50], legs: [30, 26, 50], boots: [20, 18, 34], sleeve: [36, 30, 60], hand: [40, 30, 66], weapon: 'raygun', coat: [24, 20, 44] }) },
  yoko:  { name: 'YOKO', rig: person({ skin: SK.fair, hair: 'long', hairC: [120, 70, 44], top: [184, 172, 226], bot: [70, 70, 110], skirt: 1, legs: SK.fair, boots: [90, 70, 80], sleeve: SK.fair, weapon: 'staff', eye: [90, 60, 50] }) },
  garf:  { name: 'JB GARFIELD', rig: person({ skin: [244, 152, 50], face: [RE(1.4, -6, 6.4, 5.8, [244, 152, 50]), RP([[-4, -9], [-2.4, -15], [0, -10]], [244, 152, 50]), RP([[3, -10], [5.4, -15], [6.4, -9]], [244, 152, 50]), RE(5.6, -3.6, 3, 2.2, [252, 236, 210]), RC(2.6, -7.6, 6.4, -7.4, 1.6, [20, 20, 20], RFLAT), RE(8, -4.2, 1, 1, [80, 40, 30], RFLAT), RC(-2, -8, 0, -6, 1, [180, 90, 20], RFLAT), RC(-3, -5, -1, -4, 1, [180, 90, 20], RFLAT)], hat: 'fedora', top: [196, 170, 120], bot: [70, 60, 56], legs: [70, 60, 56], boots: [244, 152, 50], sleeve: [196, 170, 120], hand: [244, 152, 50], coat: [186, 160, 110], tail: [244, 152, 50], weapon: 'gun' }) },
  peekid:{ name: 'PEE KID', rig: person({ kid: 1, skin: SK.fair, hair: 'bowl', hairC: [60, 40, 30], top: [244, 244, 248], torsoX: [RP([[-4.6, -9.4], [4.6, -9.4], [5, -6], [0, -3], [-5, -6]], [52, 74, 140]), RP([[-1, -6], [1, -6], [1.6, -1.6], [-1.6, -1.6]], [160, 104, 60], RFLAT)], bot: [44, 54, 100], legs: SK.fair, boots: [240, 240, 244], sleeve: [244, 244, 248], weapon: 'sling' }) },
  pilotx:{ name: 'PILOT X', rig: person({ skin: SK.tan, hair: 'spiky', hairC: [20, 18, 24], hat: 'visor', top: [40, 40, 52], bot: [40, 40, 52], legs: [36, 36, 48], boots: [30, 30, 36], sleeve: [236, 240, 236], coat: [236, 240, 236], weapon: 'sword' }) },
};
// recruits and townsfolk: builders with variety
const EXTRA = {
  mallcop: { name: 'MALL COP', rig: person({ skin: SK.warm, hair: 'short', hairC: [40, 30, 24], hat: 'police', top: [60, 80, 150], bot: [40, 46, 80], sleeve: [60, 80, 150], weapon: 'club' }) },
  driver:  { name: 'PROP PILLS DRIVER', rig: person({ skin: SK.tan, hair: 'short', hairC: [140, 80, 40], hat: 'cap', top: [140, 90, 60], bot: [70, 64, 60], sleeve: [140, 90, 60], weapon: 'sling' }) },
  stoolie: { name: 'THE STOOLIE', rig: person({ skin: SK.fair, hair: 'pomp', hairC: [50, 40, 30], top: [90, 90, 96], bot: [60, 60, 66], coat: [120, 110, 100], sleeve: [90, 90, 96], weapon: 'gun' }) },
  medium:  { name: 'THE MEDIUM', rig: person({ skin: SK.dark, hair: 'bun', hairC: [30, 20, 20], hat: 'hood', top: [110, 70, 140], bot: [96, 60, 126], robe: 1, sleeve: [110, 70, 140], weapon: 'staff' }) },
  // the new country's people
  tapehead: { name: 'TAPEHEAD', rig: person({ skin: SK.pale, hair: 'bowl', hairC: [70, 50, 110], top: [70, 60, 110], torsoX: [RC(-3, -8, 3, -8, 1.6, [255, 214, 90], RFLAT)], bot: [50, 44, 80], skirt: 1, legs: SK.pale, boots: [40, 36, 70], sleeve: [70, 60, 110], weapon: 'staff', eye: [110, 90, 190] }) },
  deckhand:{ name: 'THE DECKHAND', rig: person({ skin: SK.warm, hair: 'short', hairC: [20, 16, 14], hat: 'visor', top: [50, 110, 120], torsoX: [RP([[-4.4, -1], [4.4, -1], [5, -10], [-5, -10]], [240, 240, 236])], bot: [40, 60, 80], boots: [30, 40, 60], sleeve: [50, 110, 120], hand: SK.warm, weapon: 'axe' }) },
  busker:  { name: 'THE BUSKER', rig: person({ skin: SK.fair, hair: 'wavy', hairC: [190, 90, 40], top: [190, 60, 60], torsoX: [RP([[-4, -2], [4, -2], [5, -10], [-5, -10]], [240, 230, 210])], bot: [60, 50, 90], boots: [180, 120, 60], sleeve: [190, 60, 60], weapon: 'bow' }) },
  finder:  { name: 'THE FINDER', rig: person({ skin: SK.dark, hair: 'bun', hairC: [24, 18, 16], top: [170, 150, 110], torsoX: [RP([[-4, -3], [4, -3], [4.6, -10.4], [-4.6, -10.4]], [140, 110, 70])], bot: [110, 90, 60], legs: [110, 90, 60], boots: [70, 56, 40], sleeve: [170, 150, 110], weapon: 'sling' }) },
  centurion:{ name: 'GATE CENTURION', rig: person({ skin: SK.tan, hair: 'short', hairC: [26, 20, 18], hat: 'helm', top: [170, 40, 40], torsoX: [RP([[-4.4, -1], [4.4, -1], [5, -10], [-5, -10]], [220, 180, 60])], bot: [110, 30, 30], legs: [80, 24, 24], boots: [46, 30, 28], pad: [200, 160, 60], sleeve: [170, 40, 40], weapon: 'axe' }) },
  intern:  { name: 'THE INTERN', rig: person({ kid: 1, skin: SK.tan, hair: 'spiky', hairC: [40, 30, 40], top: [50, 50, 60], torsoX: [RP([[-1, -8], [1, -8], [1.4, -3], [-1.4, -3]], [160, 104, 60], RFLAT)], bot: [44, 44, 52], boots: [30, 30, 36], sleeve: [50, 50, 60], weapon: 'wraps' }) },
};
function townsfolk(i) { const tops = [[180, 90, 80], [90, 140, 110], [200, 170, 90], [110, 110, 170], [170, 120, 160], [150, 150, 150]], hairs = ['short', 'long', 'bun', 'pomp', 'wavy', 'short'], skins = [SK.fair, SK.tan, SK.warm, SK.dark]; return person({ skin: skins[i % 4], hair: hairs[i % 6], hairC: [[60, 40, 30], [120, 80, 50], [200, 180, 140], [30, 24, 24]][(i >> 1) % 4], top: tops[i % 6], bot: [[60, 60, 80], [90, 70, 60], [70, 90, 110]][i % 3], skirt: i % 3 === 1, legs: i % 3 === 1 ? skins[i % 4] : undefined, sleeve: tops[i % 6], weapon: 'none' }); }
