'use strict';
// ================= STICK UP: the POLY-FX chip, flexed. bloom, weather, skid marks, bigger blasts, speed lines, lens flare =================
// ---------------- bloom: downsample bright pixels, blur twice, add back at full res ----------------
const BLM_W = 80, BLM_H = 56, BLM_S = W / BLM_W | 0;
let BLM_A = new Uint32Array(BLM_W * BLM_H), BLM_B = new Uint32Array(BLM_W * BLM_H);
function bloomPass() {
  // scan every pixel in each block for its brightest, not just the block's center pixel: a thin moving
  // feature (a road line, a headlight edge) only lands on one fixed sample point some frames and not
  // others, which read as flicker. this costs more but stays consistent regardless of sub-pixel camera drift.
  for (let by = 0; by < BLM_H; by++) for (let bx = 0; bx < BLM_W; bx++) {
    let bestL = -1, bestC = 0;
    for (let sy = 0; sy < BLM_S; sy++) for (let sx = 0; sx < BLM_S; sx++) {
      const px = bx * BLM_S + sx, py = by * BLM_S + sy; if (px >= W || py >= H) continue;
      const c = FB[py * W + px], [r, g, b] = chan(c), l = r * .3 + g * .59 + b * .11;
      if (l > bestL) { bestL = l; bestC = c; }
    }
    BLM_A[by * BLM_W + bx] = bestL > 205 ? bestC : 0;
  }
  for (let by = 0; by < BLM_H; by++) for (let bx = 0; bx < BLM_W; bx++) {
    let rr = 0, gg = 0, bb = 0;
    for (let k = -1; k <= 1; k++) { const x = bx + k; if (x < 0 || x >= BLM_W) continue; const c = BLM_A[by * BLM_W + x]; if (!c) continue; const [r, g, b] = chan(c); rr += r; gg += g; bb += b; }
    BLM_B[by * BLM_W + bx] = (rr || gg || bb) ? rgb(rr / 3, gg / 3, bb / 3) : 0;
  }
  for (let bx = 0; bx < BLM_W; bx++) for (let by = 0; by < BLM_H; by++) {
    let rr = 0, gg = 0, bb = 0;
    for (let k = -1; k <= 1; k++) { const y = by + k; if (y < 0 || y >= BLM_H) continue; const c = BLM_B[y * BLM_W + bx]; if (!c) continue; const [r, g, b] = chan(c); rr += r; gg += g; bb += b; }
    BLM_A[by * BLM_W + bx] = (rr || gg || bb) ? rgb(rr / 3, gg / 3, bb / 3) : 0;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const bc = BLM_A[((y / BLM_S) | 0) * BLM_W + ((x / BLM_S) | 0)]; if (!bc) continue;
    const [br, bg, bb] = chan(bc), o = y * W + x, [r, g, b] = chan(FB[o]);
    FB[o] = rgb(r + br * .42 > 255 ? 255 : r + br * .42, g + bg * .42 > 255 ? 255 : g + bg * .42, b + bb * .42 > 255 ? 255 : b + bb * .42);
  }
}
// ---------------- weather: mostly clear, sometimes rain, rarely lightning ----------------
function stepWeather() {
  if (SU.weather === undefined) { SU.weather = 0; SU.weatherT = 0; }
  if (SU.weather === 1) { if (--SU.weatherT <= 0) SU.weather = 0; else if (Math.random() < .0018) { post.flash = Math.max(post.flash, .55); sfx('hurt'); } }
  else if (frame % 1800 === 0 && Math.random() < .22) { SU.weather = 1; SU.weatherT = 300 + rnd(500); }
}
const RAIN = []; for (let i = 0; i < 70; i++) RAIN.push({ x: Math.random() * W, y: Math.random() * H, l: 6 + Math.random() * 8, s: 7 + Math.random() * 5 });
function drawRain() {
  if (SU.weather !== 1) return;
  rectA(0, 0, W, H, hex('#0a0c18'), .22);
  for (const d of RAIN) { d.y += d.s; d.x -= d.s * .3; if (d.y > H) { d.y -= H + d.l; d.x = Math.random() * W; } rectA(d.x | 0, d.y | 0, 2, d.l, hex('#dce8ff'), .55); }
}
// ---------------- skid marks: a bounded trail of dots dropped where a car is sliding ----------------
let SKIDS = [];
function stepSkids() {
  for (const c of [PL.car, ...CARS].filter(c => c && !c.wreck && c.z < 15 && !CARM[c.m].water && !CARM[c.m].ship)) {
    const sp = Math.hypot(c.vx, c.vy); if (sp < 2.2) continue;
    const [fx2, fy2] = [Math.cos(c.a), Math.sin(c.a)], lat = Math.abs(-c.vx * fy2 + c.vy * fx2);
    if (lat < 1.15) continue;
    const L = CARM[c.m].L / 2, w = CARM[c.m].Wd / 2 - 1;
    for (const s of [-1, 1]) SKIDS.push({ x: c.x - fx2 * L * .75 - fy2 * w * s, y: c.y - fy2 * L * .75 + fx2 * w * s, t: 900 });
  }
  if (SKIDS.length > 420) SKIDS.splice(0, SKIDS.length - 420);
  for (const s of SKIDS) s.t--; SKIDS = SKIDS.filter(s => s.t > 0);
}
function drawSkids() {
  for (const s of SKIDS) { if (Math.abs(s.x - CAM.x) > 300 || Math.abs(s.y - CAM.y) > 220) continue; const x = projX(s.x, 1), y = projY(s.y, 1); rectA(x - 1, y - 1, 2 + CAM.s, 2 + CAM.s, BLACK, s.t > 300 ? .35 : .16); }
}
// ---------------- bigger blasts: a shockwave ring plus flying debris, layered on top of the existing fire/smoke ----------------
function blastFX(x, y) {
  FX.push({ x, y, z: 6, k: 'ring', r0: 4, vx: 0, vy: 0, vz: 0, t: 22, t0: 22 });
  FX.push({ x, y, z: 10, k: 'ring', r0: 2, vx: 0, vy: 0, vz: 0, t: 14, t0: 14 });
  for (let i = 0; i < 10; i++) { const a = Math.random() * 6.2832, sp = 2 + Math.random() * 3.5; FX.push({ x, y, z: 4, k: 'debris', vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: -(2.5 + Math.random() * 2.5), t: 36 + rnd(20), t0: 56, rot: Math.random() * 6.28, spin: (Math.random() - .5) * .6 }); }
}
// ---------------- speed lines + lens flare + a quiet vignette ----------------
function drawSpeedLines() {
  const c = plPos(), sp = (PL.car && Math.hypot(PL.car.vx, PL.car.vy)) || 0; if (sp < 3.4) return;
  const k = Math.min(1, (sp - 3.4) / 2.6), a = PL.car.a;
  for (let i = 0; i < 10; i++) {
    const side = (i % 2) * 2 - 1, spread = .25 + (i / 10) * 1.3, ang = a + Math.PI + side * spread, r0 = 60 + i * 6, len = 18 + k * 30;
    const x0 = CXs + Math.cos(ang) * r0, y0 = CYs * .75 + Math.sin(ang) * r0 * .7, x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len * .7;
    const n = Math.max(1, Math.round(len / 2));
    for (let j = 0; j <= n; j++) rectA((x0 + (x1 - x0) * j / n) | 0, (y0 + (y1 - y0) * j / n) | 0, 1, 1, WHITE, k * .22 * (1 - j / n));
  }
}
function drawLensFlare() {
  const m = SU.min % 1440, dawn = m > 270 && m < 420 ? 1 - Math.abs(m - 345) / 75 : 0, dusk = m > 1140 && m < 1290 ? 1 - Math.abs(m - 1215) / 75 : 0, k = Math.max(dawn, dusk);
  if (k < .03) return;
  const fx2 = 46, fy2 = 30, col = dusk > dawn ? hex('#ff9a4a') : hex('#ffd89a');
  for (let i = 5; i >= 1; i--) rectA(fx2 - i * 7, fy2 - i * 4, i * 13, i * 9, col, k * .05);
  for (const t of [.4, .65, .85]) rectA(fx2 + (CXs - fx2) * t - 2, fy2 + (CYs * .6 - fy2) * t - 2, 4, 4, col, k * .18 * (1 - t));
}
function drawVignette() {
  const k = .18 + nightAmt() * .14;
  for (let i = 0; i < 20; i++) { const a = i / 20 * k; rectA(0, i, W, 1, BLACK, a * .06); rectA(0, H - 1 - i, W, 1, BLACK, a * .06); rectA(i, 0, 1, H, BLACK, a * .05); rectA(W - 1 - i, 0, 1, H, BLACK, a * .05); }
}
function drawScreenFX() { drawRain(); drawSpeedLines(); drawLensFlare(); drawVignette(); }
