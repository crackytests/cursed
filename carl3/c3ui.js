'use strict';
// ================= CARL 3: the HYPER-32 interface. translucent chrome plates, and 3D portraits: every speaker is a little polygon bust =================
const UI3 = { edge: hex('#9fb8ff'), edge2: hex('#3a4a8a'), text: hex('#f4f4ff'), dim: hex('#9aa4d0'), name: hex('#ffd848'), hot: hex('#ff49db'), c0: '#0c1432', c1: '#243478' };
const mixh = (a, b, k) => mix(hex(a), hex(b), k);
// a chrome plate: dark glass gradient, cut corners, a bright top edge and a double border
function plate(x, y, w, h, o = {}) {
  const a = o.alpha === undefined ? .8 : o.alpha, cut = o.cut === undefined ? 3 : o.cut, edge = o.edge || UI3.edge, c0 = o.c0 || UI3.c0, c1 = o.c1 || UI3.c1;
  x |= 0; y |= 0;
  for (let j = 0; j < h; j++) { const ins = j < cut ? cut - j : j >= h - cut ? j - (h - cut - 1) : 0; rectA(x + ins, y + j, w - ins * 2, 1, mixh(c0, c1, j / h), a); }
  rectF(x + cut, y, w - cut * 2, 1, edge); rectF(x + cut, y + h - 1, w - cut * 2, 1, UI3.edge2);
  rectF(x, y + cut, 1, h - cut * 2, edge); rectF(x + w - 1, y + cut, 1, h - cut * 2, UI3.edge2);
  for (let i = 0; i < cut; i++) { pset(x + cut - 1 - i, y + i, edge); pset(x + w - cut + i, y + i, edge); pset(x + cut - 1 - i, y + h - 1 - i, UI3.edge2); pset(x + w - cut + i, y + h - 1 - i, UI3.edge2); }
  if (!o.flat) { rectA(x + 3, y + 2, w - 6, 1, WHITE, .22); rectF(x + cut + 1, y + 1, w - cut * 2 - 2, 1, mixh('#9fb8ff', '#3a4a8a', .6)); }
}
function panel(x, y, w, h) { plate(x, y, w, h); }   // the engine's own helpers and menus now draw the new plate
const shadowText = (s, x, y, c, sc) => { text(s, x + 1, y + 1, hex('#05081a'), 0, sc || 1); text(s, x, y, c, 0, sc || 1); };
// ---------------- 3D busts ----------------
const sk = h => rgbh(h);
function genBust(o) {
  const skin = sk(o.skin || '#d8a888'), dark = skin.map(v => v * .8), hair = sk(o.hair || '#503820'), top = sk(o.top || '#6080b0'), P = [];
  P.push({ m: 'sphere:.5:12:8', o: [0, 0, 0], col: skin });
  P.push({ m: 'cyl:.18:.3:8', o: [0, -.76, 0], col: dark });
  P.push({ m: 'box:1.7:.55:.7', o: [0, -1.18, 0], col: top });
  if (o.collar) P.push({ m: 'box:.5:.12:.62', o: [0, -.94, .03], col: sk(o.collar) });
  if (o.tie) P.push({ m: 'box:.12:.5:.06', o: [0, -1.1, .38], col: sk(o.tie) });
  if (o.badge) P.push({ m: 'box:.14:.14:.05', o: [.45, -1.0, .36], col: [255, 220, 60] });
  if (o.pads) P.push({ m: 'box:.5:.16:.7', o: [-.8, -.94, 0], col: top }, { m: 'box:.5:.16:.7', o: [.8, -.94, 0], col: top });
  // face
  if (!o.shades) P.push({ m: 'box:.17:.1:.05', o: [-.18, .08, .47], col: [250, 250, 250], tag: 'eye' }, { m: 'box:.17:.1:.05', o: [.18, .08, .47], col: [250, 250, 250], tag: 'eye' },
    { m: 'box:.07:.08:.04', o: [-.18, .08, .5], col: [20, 20, 30], tag: 'eye' }, { m: 'box:.07:.08:.04', o: [.18, .08, .5], col: [20, 20, 30], tag: 'eye' },
    { m: 'box:.22:.04:.04', o: [-.18, .2, .48], col: hair.map(v => v * .8) }, { m: 'box:.22:.04:.04', o: [.18, .2, .48], col: hair.map(v => v * .8) });
  P.push({ m: 'box:.1:.14:.14', o: [0, -.04, .5], col: dark }, { m: 'box:.22:.05:.05', o: [0, -.24, .47], col: [140, 50, 60], tag: 'mouth', s: [1, 1, 1] });
  if (o.shades) P.push({ m: 'box:.7:.12:.08', o: [0, .09, .48], col: [12, 12, 20] }, { m: 'box:.12:.04:.1', o: [-.2, .1, .5], col: [90, 120, 170] });
  if (o.glasses) P.push({ m: 'box:.26:.2:.04', o: [-.19, .08, .5], col: [70, 70, 90], s: [1, 1, .4] }, { m: 'box:.26:.2:.04', o: [.19, .08, .5], col: [70, 70, 90], s: [1, 1, .4] });
  if (o.beard) P.push({ m: 'sphere:.4:8:5', o: [0, -.3, .1], col: hair, s: [1, .8, .8] });
  // hair and hats
  const hs = o.hairStyle || 'short';
  if (hs === 'short') P.push({ m: 'sphere:.58:10:6', o: [0, .13, -.1], col: hair, s: [1.02, .8, 1] });
  if (hs === 'big') P.push({ m: 'sphere:.72:10:7', o: [0, .16, -.3], col: hair, s: [1, .9, .8] }, { m: 'sphere:.28:7:5', o: [-.56, -.1, -.12], col: hair }, { m: 'sphere:.28:7:5', o: [.56, -.1, -.12], col: hair });
  if (hs === 'long') P.push({ m: 'sphere:.55:10:6', o: [0, .1, -.06], col: hair, s: [1, .85, 1] }, { m: 'box:.18:.9:.3', o: [-.5, -.55, -.05], col: hair }, { m: 'box:.18:.9:.3', o: [.5, -.55, -.05], col: hair });
  if (o.hat) P.push({ m: 'cyl:.72:.07:12', o: [0, .42, 0], col: sk(o.hat) }, { m: 'cyl:.42:.3:12', o: [0, .46, 0], col: sk(o.hat) });
  if (o.cap) P.push({ m: 'sphere:.55:10:6', o: [0, .22, 0], col: sk(o.cap), s: [1, .6, 1] }, { m: 'box:.5:.05:.35', o: [0, .26, .46], col: sk(o.cap) });
  if (o.headset) P.push({ m: 'box:.07:.5:.12', o: [-.55, .02, 0], col: [20, 20, 28] }, { m: 'box:.07:.07:.3', o: [-.52, -.2, .22], col: [20, 20, 28] }, { m: 'box:.1:.1:.1', o: [-.46, -.26, .42], col: [30, 30, 40] });
  return { parts: P };
}
function carlBust() {
  const g = [92, 196, 164], P = [];
  P.push({ m: 'sphere:.62:14:9', o: [0, 0, 0], col: g }, { m: 'cyl:.14:.3:8', o: [0, -.78, 0], col: g.map(v => v * .8) }, { m: 'box:1.5:.5:.6', o: [0, -1.12, 0], col: [76, 76, 156] });
  P.push({ m: 'box:.28:.34:.05', o: [-.21, .02, .58], col: [168, 255, 88], tag: 'eye' }, { m: 'box:.28:.34:.05', o: [.21, .02, .58], col: [168, 255, 88], tag: 'eye' }, { m: 'box:.12:.2:.04', o: [-.21, .04, .62], col: [0, 0, 0], tag: 'eye' }, { m: 'box:.12:.2:.04', o: [.21, .04, .62], col: [0, 0, 0], tag: 'eye' });
  P.push({ m: 'box:.14:.04:.05', o: [0, -.3, .58], col: [40, 90, 80], tag: 'mouth' }, { m: 'sphere:.66:12:6', o: [0, .26, -.04], col: [26, 26, 48], s: [1, .62, 1] }, { m: 'box:.5:.05:.35', o: [0, .22, -.7], col: [26, 26, 48] });
  P.push({ m: 'box:.14:.12:.08', o: [-.1, -.98, .34], col: [255, 216, 32] }, { m: 'box:.14:.12:.08', o: [.1, -.98, .34], col: [255, 216, 32] }, { m: 'box:.08:.1:.1', o: [0, -.98, .34], col: [255, 184, 0] });
  return { parts: P };
}
function ghostBust() {
  const w = [238, 238, 255], P = [];
  P.push({ m: 'sphere:.62:14:9', o: [0, 0, 0], col: w, s: [1, 1.1, 1] }, { m: 'cyl:.64:1.2:12:.5', o: [0, -1.5, 0], col: [200, 200, 245] });
  P.push({ m: 'box:.82:.17:.1', o: [0, .1, .56], col: [12, 12, 20] }, { m: 'box:.2:.04:.12', o: [-.22, .13, .58], col: [80, 220, 255] }, { m: 'box:.2:.04:.12', o: [.18, .13, .58], col: [80, 220, 255] });
  P.push({ m: 'box:.2:.06:.05', o: [0, -.28, .56], col: [255, 90, 150], tag: 'mouth' });
  P.push({ m: 'box:.18:.12:.08', o: [-.14, -.62, .42], col: [30, 30, 40] }, { m: 'box:.18:.12:.08', o: [.14, -.62, .42], col: [30, 30, 40] }, { m: 'box:.1:.1:.1', o: [0, -.62, .42], col: [20, 20, 28] });
  return { parts: P };
}
function garfBust() {
  const o1 = [255, 150, 36], cream = [255, 232, 200], P = [];
  P.push({ m: 'sphere:.55:12:8', o: [0, 0, 0], col: o1, s: [1.1, 1, 1] }, { m: 'cyl:.16:.4:5:0', o: [-.38, .36, 0], col: o1 }, { m: 'cyl:.16:.4:5:0', o: [.38, .36, 0], col: o1 });
  P.push({ m: 'sphere:.3:8:5', o: [0, -.16, .38], col: cream, s: [1.3, .8, .7] }, { m: 'box:.12:.08:.06', o: [0, -.04, .6], col: [255, 100, 130] });
  P.push({ m: 'box:.17:.14:.05', o: [-.2, .12, .5], col: [200, 255, 80], tag: 'eye' }, { m: 'box:.17:.14:.05', o: [.2, .12, .5], col: [200, 255, 80], tag: 'eye' }, { m: 'box:.04:.16:.04', o: [-.2, .12, .54], col: [10, 10, 10], tag: 'eye' }, { m: 'box:.04:.16:.04', o: [.2, .12, .54], col: [10, 10, 10], tag: 'eye' });
  P.push({ m: 'box:.2:.04:.05', o: [0, -.3, .56], col: [90, 30, 30], tag: 'mouth' });
  P.push({ m: 'cyl:.85:.06:14', o: [0, .46, 0], col: [40, 34, 40] }, { m: 'cyl:.44:.32:14', o: [0, .5, 0], col: [40, 34, 40] }, { m: 'cyl:.46:.07:14', o: [0, .56, 0], col: [150, 40, 40] });
  P.push({ m: 'box:1.7:.55:.7', o: [0, -1.1, 0], col: [176, 144, 96] }, { m: 'box:.4:.3:.2', o: [-.45, -.86, .22], col: [200, 168, 120] }, { m: 'box:.4:.3:.2', o: [.45, -.86, .22], col: [200, 168, 120] });
  return { parts: P };
}
function faceBust(old) {
  const m = (r, g, b) => old ? [g * .3 | 0, (g * .45 + 40) | 0, (g * .2) | 0] : [r, g, b]; const P = [];
  const dark = m(20, 10, 40), neon = old ? [155, 188, 15] : [255, 36, 219], eye = old ? [155, 188, 15] : [109, 255, 36], P2 = P;
  P.push({ m: 'sphere:.58:12:9', o: [0, 0, 0], col: dark, s: [1, 1.1, 1] }, { m: 'cyl:.3:.5:8:0', o: [0, .55, -.02], col: dark }, { m: 'box:1.5:.5:.6', o: [0, -1.1, 0], col: m(36, 20, 80) });
  P.push({ m: 'box:.5:.05:.05', o: [0, .26, .52], col: neon }, { m: 'box:.06:.5:.05', o: [-.3, -.1, .5], col: neon }, { m: 'box:.06:.5:.05', o: [.3, -.1, .5], col: neon });
  P.push({ m: 'box:.18:.14:.05', o: [0, .42, .5], col: eye }, { m: 'box:.18:.1:.05', o: [-.2, .1, .52], col: [240, 240, 240], tag: 'eye' }, { m: 'box:.18:.1:.05', o: [.2, .1, .52], col: [240, 240, 240], tag: 'eye' });
  P.push({ m: 'box:.07:.05:.05', o: [-.14, -.28, .54], col: eye, tag: 'mouth' }, { m: 'box:.07:.05:.05', o: [0, -.28, .54], col: eye, tag: 'mouth' }, { m: 'box:.07:.05:.05', o: [.14, -.28, .54], col: eye, tag: 'mouth' });
  return { parts: P };
}
function userBust() {
  const P = [{ m: 'sphere:.56:10:7', o: [0, 0, 0], col: [6, 20, 6] }, { m: 'box:1.4:.5:.6', o: [0, -1.1, 0], col: [4, 40, 4] }, { m: 'box:.22:.1:.05', o: [-.2, .08, .52], col: [109, 255, 36], tag: 'eye' }, { m: 'box:.22:.1:.05', o: [.2, .08, .52], col: [109, 255, 36], tag: 'eye' }, { m: 'box:.3:.04:.05', o: [0, -.24, .5], col: [60, 200, 30], tag: 'mouth' }];
  return { parts: P };
}
const BUSTS = {}, BACC = {};
function regBust(names, model, acc) { for (const n of [].concat(names)) { BUSTS[n] = model; BACC[n] = acc || '#9fb8ff'; } }
regBust('CARL', carlBust(), '#6dff92'); regBust('SPOOKY GHOST', ghostBust(), '#ff7ae0'); regBust(['JB GARFIELD', 'GARFIELD'], garfBust(), '#ff9a3a');
regBust(['NEW FACE', 'FACE', 'DIRECTOR'], faceBust(0), '#ff49db'); regBust('OLD FACE', faceBust(1), '#9bbc0f'); regBust('USER_000', userBust(), '#6dff24');
regBust(['CEO LINDA', 'LINDA'], genBust({ skin: '#f0d0d0', hair: '#ff70b8', hairStyle: 'big', top: '#c0307a', pads: 1 }), '#ff5aa8');
regBust('DISPATCH', genBust({ skin: '#b6926d', hair: '#2a1a10', top: '#4a4a92', collar: '#e8e8e8', headset: 1 }), '#ffd848');
regBust('POSTMASTER HANK', genBust({ skin: '#dbb692', hair: '#a0a0a0', top: '#3a5a8a', hat: '#2a3a5a', badge: 1, collar: '#e8e8e8' }), '#6aa0ff');
regBust('DEPUTY BROOKS', genBust({ skin: '#c8a080', hair: '#202020', top: '#303848', cap: '#202838', shades: 1, badge: 1 }), '#8fa0c0');
regBust('DOLORES', genBust({ skin: '#dbb692', hair: '#4a2a24', hairStyle: 'big', top: '#a090c8', glasses: 1 }), '#c09aff');
regBust(['LEON', 'BIG LEON'], genBust({ skin: '#db9249', hair: '#3a2a1a', top: '#b64924', cap: '#c03020', beard: 1 }), '#ff7a40');
regBust('RADIO RAY', genBust({ skin: '#dbb692', hair: '#241010', top: '#4a7a2a', cap: '#4a7a2a', beard: 1, headset: 1 }), '#8fff60');
regBust('DENNIS', genBust({ skin: '#b6926d', hair: '#241010', top: '#303848', cap: '#202838', shades: 1, badge: 1 }), '#8fa0c0');
regBust(['INSPECTOR', 'INSPECTOR 9'], genBust({ skin: '#f0f0e8', hair: '#f0f0e8', hairStyle: 'bald', top: '#1a1a1a', shades: 1, tie: '#c02020', collar: '#f0f0f0' }), '#ff3a3a');
regBust('CLERK', genBust({ skin: '#dbdbd0', hair: '#6d6d6d', top: '#d8d8d0', glasses: 1, collar: '#ffffff' }), '#9ad8ff');
regBust('MARGO', genBust({ skin: '#db9249', hair: '#4a2a1a', hairStyle: 'big', top: '#d8d8e0', glasses: 1 }), '#ffd848');
regBust(['MARGE', 'DOT'], genBust({ skin: '#f0c8b0', hair: '#b04020', hairStyle: 'big', top: '#f0a0b0' }), '#ff9ab0');
regBust('NED', genBust({ skin: '#dbb692', hair: '#7a5a3a', top: '#587a40', hat: '#c8a850', beard: 1 }), '#c8a850');
regBust('SLIM', genBust({ skin: '#db9249', hair: '#3a2a1a', top: '#a85028', cap: '#c03020', beard: 1 }), '#ff7a40');
regBust('COLLECTOR', genBust({ skin: '#f0f0f0', hair: '#f0f0f0', hairStyle: 'bald', top: '#101010', shades: 1, tie: '#c02020' }), '#ff3a3a');
// ---------------- drawing a bust into a window ----------------
const BCAM = mkCam([0, .02, 10.2], [0, -.12, 0], .95), BLIGHT = { amb: [.62, .6, .7], dir: v3.norm([-.5, .55, -.7]), dcol: [.85, .8, .75], tint: [0, 0, 0] };
function drawBust(name, x, y, w, h, talk, t) {
  const B = BUSTS[name]; if (!B) return;
  const acc = BACC[name] || '#9fb8ff';
  // backdrop: accent glow over dark glass, with scanlines
  for (let j = 0; j < h; j++) rectF(x, y + j, w, 1, mix(hex('#080c20'), hex(acc), .08 + .22 * (1 - j / h) + ((j & 1) ? 0 : .03)));
  for (let j = 0; j < h; j += 2) for (let i = ((j >> 1) & 1); i < w; i += 2) pset(x + i, y + j, mix(hex('#080c20'), hex(acc), .16));
  for (let j = y; j < y + h; j++) ZD.fill(0, j * W + x, j * W + x + w);
  const sCam = LIVE.cam, sOx = LIVE.ox, sOy = LIVE.oy, sCl = LIVE.clip; LIVE.cam = BCAM; LIVE.ox = x + w / 2 - CX; LIVE.oy = y + h / 2 - CY + 2; LIVE.clip = [x + 1, y + 1, x + w - 1, y + h - 1];
  const yaw = Math.sin(t * .035) * .28 - .06, blink = (t % 150) < 5, mouth = talk ? .35 + (Math.sin(t * .9) * .5 + .5) * 1.5 : .6, bob = Math.sin(t * .05) * .02;
  for (const pt of B.parts) {
    let m = mesh(pt.m); const sc = pt.s || [1, 1, 1];
    let sy = sc[1]; if (pt.tag === 'mouth') sy *= mouth; if (pt.tag === 'eye' && blink) sy *= .12;
    if (sc[0] !== 1 || sy !== 1 || sc[2] !== 1) m = { v: m.v.map(v => [v[0] * sc[0], v[1] * sy, v[2] * sc[2]]), n: m.n, f: m.f };
    const c = Math.cos(yaw), s = Math.sin(yaw), o = pt.o, wp = [o[0] * c + o[2] * s, o[1] + bob, -o[0] * s + o[2] * c];
    drawMeshLive(m, { p: wp, yaw }, pt.col, BLIGHT);
  }
  LIVE.cam = sCam; LIVE.ox = sOx; LIVE.oy = sOy; LIVE.clip = sCl;
  rectA(x, y + h - 10, w, 10, BLACK, .0);
}
// ---------------- the dialog box (replaces the engine's) ----------------
async function say1(s, who, o) {
  const lines = wrapT(String(s).toUpperCase(), 44), hasP = !!(who && BUSTS[who]);
  const v = VOICE[who] || VOICE._ || [800, 60];
  for (let p = 0; p < lines.length; p += 4) {
    const pg = lines.slice(p, p + 4), all = pg.join(''), total = all.length;
    DLG = { who, lines: pg, n: 0, arrow: 0, hasP, total, port: o.port };
    await nextFrame();
    let last = -1;
    while (DLG.n < total) {
      if (pressed.a || pressed.b || pressed.c) { DLG.n = total; break; }
      DLG.n += o.slow ? .25 : .9;
      const i = DLG.n | 0; if (i !== last && i % 2 === 0 && all[i] && all[i] !== ' ') sfx('blip', v); last = i;
      await nextFrame();
    }
    if (o.auto) await wait(o.auto); else { DLG.arrow = 1; await waitBtn(); sfx('tick'); }
  }
  if (!o.keep) DLG = null;
}
function drawOverlay() {
  if (CARD) {
    cls(CARD.bg); const y0 = ((H - CARD.lines.length * 12 * CARD.sc) / 2) | 0;
    rectF(0, 8, W, 1, hex('#3a4a8a')); rectF(0, H - 9, W, 1, hex('#3a4a8a')); rectF(0, 11, W, 1, hex('#1c2450')); rectF(0, H - 12, W, 1, hex('#1c2450'));
    CARD.lines.forEach((l, i) => ctext(l, y0 + i * 12 * CARD.sc, CARD.fg, hex('#05081a'), CARD.sc));
  }
  if (BANNER && BANNER.t > 0) { BANNER.t--; const w = BANNER.s.length * 6 + 28; plate(((W - w) / 2) | 0, 14, w, 20); shadowText(BANNER.s, ((W - BANNER.s.length * 6) / 2) | 0, 20, UI3.name); }
  if (CHATBOX) {
    plate(W - 156, 8, 148, 122); rectF(W - 152, 12, 140, 11, hex('#b02050')); rectA(W - 152, 12, 140, 4, WHITE, .2); shadowText('LIVE CHAT', W - 148, 14, WHITE);
    const rows = []; for (const m of CHATBOX.msgs) { rows.push([m.u + ':', UI3.name]); for (const l of wrapT(m.m.toUpperCase(), 22)) rows.push([' ' + l, UI3.text]); }
    rows.slice(-9).forEach((r, i) => shadowText(r[0], W - 150, 27 + i * 11, r[1]));
  }
  if (DLG) {
    const y = H - 70, hasP = DLG.hasP;
    if (hasP) { const bx = 10, by = y - 54; drawBust(DLG.who, bx, by, 60, 60, DLG.n < DLG.total, frame); frameRect(bx - 1, by - 1, 62, 62, hex(BACC[DLG.who] || '#9fb8ff')); frameRect(bx, by, 60, 60, hex('#05081a')); }
    plate(6, y, W - 12, 64);
    if (DLG.who) { const nm = DLG.who, w = nm.length * 6 + 22, nx = hasP ? 76 : 14; plate(nx, y - 9, w, 17, { c0: '#241a52', c1: '#40308a', edge: hex(hasP ? (BACC[DLG.who] || '#ffd848') : '#ffd848') }); shadowText(nm, nx + 11, y - 5, UI3.name); }
    let n = DLG.n | 0;
    DLG.lines.forEach((l, i) => { shadowText(l.slice(0, Math.max(0, n)), 16, y + 10 + i * 12, UI3.text); n -= l.length; });
    if (DLG.arrow && (frame >> 4) & 1) { const ax = W - 24, ay = H - 18; triF(ax, ay, ax + 8, ay, ax + 4, ay + 5, UI3.name); }
  }
  for (const m of MENUS) {
    plate(m.x, m.y, m.w, m.h);
    m.opts.forEach((s, i) => { const yy = m.y + 7 + i * 12; if (i === m.i) { rectA(m.x + 5, yy - 2, m.w - 10, 11, hex('#ffd848'), .22); triF(m.x + 8, yy, m.x + 8, yy + 7, m.x + 13, yy + 3, UI3.name); } shadowText(s, m.x + 18, yy, i === m.i ? UI3.name : UI3.text); });
  }
}
