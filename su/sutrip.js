'use strict';
// ================= STICK UP: the trip. Prop Pills bend the colors; the clock turns the city to night; under Vice Versa is THE BELOW =================
// every frame the world is pushed through one colour table: night darkens it, the trip spins its hue, the Below turns it inside out.
// the HUD is drawn after, so it stays readable.
const PREV = new Uint32Array(W * H), LUT = new Map(), LUTL = new Map(); let LUTK = '';
const WINLIT = hex('#ffdb6d'), BEAM = hex('#dcdcc0');
const EXEMPT = new Set(['#ffdb6d', '#dcdcc0', '#ffffdb', '#ff2424', '#2449ff', '#ff49db', '#ffdb49', '#6dff92', '#24ffdb', '#49ffdb', '#ffffff'].map(hex));
function nightAmt() { const m = SU.min % 1440; if (m < 300 || m >= 1260) return 1; if (m < 420) return 1 - (m - 300) / 120; if (m >= 1140) return (m - 1140) / 120; return 0; }
const tripAmt = () => Math.min(1.2, SU.trip + (SU.below ? .7 : 0));
function xform(c, n, tr, hue) {
  let [r, g, b] = chan(c);
  if (SU.below) { r = 255 - r; g = 255 - g; b = 255 - b; }
  if (tr > .02) { // rotate the hue, push the saturation
    const a = hue, ca = Math.cos(a), sa = Math.sin(a), k = Math.min(1, tr);
    const R = r * (.299 + .701 * ca + .168 * sa) + g * (.587 - .587 * ca + .330 * sa) + b * (.114 - .114 * ca - .497 * sa);
    const G = r * (.299 - .299 * ca - .328 * sa) + g * (.587 + .413 * ca + .035 * sa) + b * (.114 - .114 * ca + .292 * sa);
    const B = r * (.299 - .3 * ca + 1.25 * sa) + g * (.587 - .588 * ca - 1.05 * sa) + b * (.114 + .886 * ca - .203 * sa);
    const l = (R + G + B) / 3, s = 1 + .8 * k; r = r + ((l + (R - l) * s) - r) * k; g = g + ((l + (G - l) * s) - g) * k; b = b + ((l + (B - l) * s) - b) * k;
  }
  if (n > 0 && !EXEMPT.has(c)) { r *= 1 - n * .62; g *= 1 - n * .58; b *= 1 - n * .3; }
  return rgb(r, g, b);
}
function postFX() {
  const n = nightAmt(), tr = tripAmt(), hs = tr > .02 ? (frame >> 2) & 127 : 0, key = ((n * 20) | 0) + '/' + hs + '/' + ((tr * 10) | 0) + '/' + (SU.below ? 1 : 0);
  if (key !== '0/0/0/0') {
    if (key !== LUTK) { LUTK = key; LUT.clear(); LUTL.clear(); }
    const nn = ((n * 20) | 0) / 20, hue = hs / 128 * 6.2832 * (SU.below ? -1 : 1), L = nn > 0 ? litRect() : null;
    if (!L) for (let i = 0; i < FB.length; i++) { const c = FB[i]; let v = LUT.get(c); if (v === undefined) { v = xform(c, nn, tr, hue); LUT.set(c, v); } FB[i] = v; }
    else for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) { const c = FB[i], lit = x >= L[0] && x < L[2] && y >= L[1] && y < L[3], M = lit ? LUTL : LUT; let v = M.get(c); if (v === undefined) { v = xform(c, lit ? 0 : nn, tr, hue); M.set(c, v); } FB[i] = v; }
  }
  // the trip leaves trails: blend half of the last frame back in
  if (tr > .45) for (let i = 0; i < FB.length; i++) FB[i] = ((((FB[i] >>> 1) & 0x7f7f7f7f) + ((PREV[i] >>> 1) & 0x7f7f7f7f)) | 0xff000000) >>> 0;
  PREV.set(FB);
}
// what Carl thinks while it's happening
const THOUGHTS = ['THE STREET IS HUMMING IN B FLAT', 'THE STICK IS PROUD OF ME', 'EVERY CAR IS A LITTLE HOUSE', 'I CAN HEAR THE STARS ON MY HUD', 'THE BUILDINGS ARE BREATHING. GOOD FOR THEM.', 'WHAT IF NEVADA IS ABOVE AND BELOW ME', 'HELLO, PAVEMENT', 'I AM A NORMAL HUMAN (VIBRATING)', 'THE MASK IS MY FACE NOW. FASHION.', 'I REMEMBER BEING SMALL. I AM STILL SMALL.', 'COLORS ARE JUST LOUD LIGHT', 'IS CHAT IN MY HEAD OR AM I IN CHAT', 'MOM? (NO.)', 'THAT CLOUD IS A DOOR'];
function stepTrip() {
  SU.trip = Math.max(0, SU.trip - (SU.tripLock ? 0 : .0007));
  const tr = tripAmt(); post.wave = SU.cut > 1 ? 0 : tr > .3 ? Math.min(3, tr * 2.6) : 0;
  if (tr > .3 && frame % 260 === 0 && !SU.cut) pop(plPos().x, plPos().y - 16, pick(THOUGHTS), '#ffffff');
}
function eatPills(k = .35) { SU.trip = Math.min(1.2, SU.trip + k); if (!SU.stat.trips) SU.stat.trips = 0; SU.stat.trips++; }
// the Below: things float over the city
const DRIFT = []; for (let i = 0; i < 9; i++) DRIFT.push({ x: Math.random() * 1900, y: Math.random() * 1850, r: 18 + Math.random() * 30, v: .2 + Math.random() * .5, k: i % 3 });
function drawDrift() {
  if (!SU.below && SU.trip < .7) return;
  for (const d of DRIFT) {
    d.x += d.v; d.y += Math.sin(frame * .01 + d.r) * .4; if (d.x > GW + 60) d.x = -60;
    const x = projX(d.x, 200), y = projY(d.y, 200), r = d.r * CAM.s * 1.5; if (x < -r || y < -r || x > W + r || y > H + r) continue;
    if (d.k === 0) { circF(x, y, r, hex('#f0f0f0')); circF(x + Math.cos(frame * .02) * r * .3, y, r * .5, hex('#2449ff')); circF(x + Math.cos(frame * .02) * r * .35, y, r * .22, BLACK); }
    else if (d.k === 1) { ringF(x, y, r, hex('#ff49db')); ringF(x, y, r * .7, hex('#24ffdb')); ringF(x, y, r * .4, hex('#ffdb49')); }
    else { for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28 + frame * .01; circF(x + Math.cos(a) * r * .6, y + Math.sin(a) * r * .6, r * .35, hex('#ffdb49')); } circF(x, y, r * .35, hex('#ff6d24')); }
  }
}
