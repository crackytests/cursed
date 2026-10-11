'use strict';
// ================= CARL 3: the HYPER-32 POLY-FX engine. prerendered backdrops with a depth map, chunky polygon people drawn over them =================
// A backdrop is rendered ONCE from real 3D geometry (per-pixel lights, textures, fog, dither, grain) and keeps its depth buffer.
// Characters are drawn live as low-poly meshes: flat/gouraud, vertex-snapped, depth-tested against the backdrop's depth map.
const hash2 = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const CX = W / 2, CY = H / 2 - 4;
const ZD = new Float32Array(W * H);         // live depth (1/z). 0 = infinitely far
const NAT = 9;                              // attributes per vertex in the prerender rasterizer: iz, wx, wy, wz, u, v, nx, ny, nz (all pre-divided by z except iz)
// ---------- dither + quantize to the 9-bit palette ----------
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16 - .5);
const QL = []; for (let b = 0; b < 16; b++) { const t = new Uint8Array(512); for (let v = 0; v < 512; v++) t[v] = Math.round(Math.max(0, Math.min(255, (v - 128) + BAY[b] * 36.4)) / 255 * 7) * 255 / 7; QL.push(t); }
function packD(r, g, b, x, y) { const q = QL[((y & 3) << 2) | (x & 3)]; r = r < -127 ? -127 : r > 382 ? 382 : r; g = g < -127 ? -127 : g > 382 ? 382 : g; b = b < -127 ? -127 : b > 382 ? 382 : b; return ((255 << 24) | (q[(b | 0) + 128] << 16) | (q[(g | 0) + 128] << 8) | q[(r | 0) + 128]) >>> 0; }
const unpack = c => [c & 255, (c >> 8) & 255, (c >> 16) & 255];
// ---------- vector bits ----------
const v3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
// ---------- camera: left-handed, y up, looks down +f ----------
function mkCam(pos, target, fov = 1.0) {
  const f = v3.norm(v3.sub(target, pos)), r = v3.norm([f[2], 0, -f[0]]), u = v3.cross(f, r);
  return { pos, f, r, u, foc: (W / 2) / Math.tan(fov / 2), fov };
}
function toCam(c, p) { const d = [p[0] - c.pos[0], p[1] - c.pos[1], p[2] - c.pos[2]]; return [v3.dot(d, c.r), v3.dot(d, c.u), v3.dot(d, c.f)]; }
function project(c, p) { const q = toCam(c, p); if (q[2] < .05) return null; return [CX + c.foc * q[0] / q[2], CY - c.foc * q[1] / q[2], q[2]]; }
// ---------- meshes (object space; per-vertex normals; box-style bases sit on y=0) ----------
function newMesh() { return { v: [], n: [], f: [] }; }
function addQuad(m, a, b, c, d, n) { const i = m.v.length; m.v.push(a, b, c, d); m.n.push(n, n, n, n); m.f.push([i, i + 1, i + 2], [i, i + 2, i + 3]); }
const MESH = {
  box(w, h, d) { const m = newMesh(), x = w / 2, z = d / 2;
    addQuad(m, [-x, 0, -z], [x, 0, -z], [x, h, -z], [-x, h, -z], [0, 0, -1]); addQuad(m, [x, 0, z], [-x, 0, z], [-x, h, z], [x, h, z], [0, 0, 1]);
    addQuad(m, [-x, 0, z], [-x, 0, -z], [-x, h, -z], [-x, h, z], [-1, 0, 0]); addQuad(m, [x, 0, -z], [x, 0, z], [x, h, z], [x, h, -z], [1, 0, 0]);
    addQuad(m, [-x, h, -z], [x, h, -z], [x, h, z], [-x, h, z], [0, 1, 0]); addQuad(m, [-x, 0, z], [x, 0, z], [x, 0, -z], [-x, 0, -z], [0, -1, 0]); return m; },
  plane(w, d) { const m = newMesh(), x = w / 2, z = d / 2; addQuad(m, [-x, 0, -z], [-x, 0, z], [x, 0, z], [x, 0, -z], [0, 1, 0]); return m; },
  cyl(r, h, seg = 10, r2) { const m = newMesh(); r2 = r2 === undefined ? r : r2; const sl = (r - r2) / h;
    for (let i = 0; i < seg; i++) { const a0 = i / seg * 6.2832, a1 = (i + 1) / seg * 6.2832, c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1), k = v3.norm([1, sl, 0]);
      const n0 = v3.norm([c0, sl, s0]), n1 = v3.norm([c1, sl, s1]), j = m.v.length;
      m.v.push([c0 * r, 0, s0 * r], [c1 * r, 0, s1 * r], [c1 * r2, h, s1 * r2], [c0 * r2, h, s0 * r2]); m.n.push(n0, n1, n1, n0); m.f.push([j, j + 1, j + 2], [j, j + 2, j + 3]);
      const t = m.v.length; m.v.push([0, h, 0], [c0 * r2, h, s0 * r2], [c1 * r2, h, s1 * r2]); m.n.push([0, 1, 0], [0, 1, 0], [0, 1, 0]); m.f.push([t, t + 2, t + 1]); if (r2 > 0) { const u = m.v.length; m.v.push([0, 0, 0], [c0 * r, 0, s0 * r], [c1 * r, 0, s1 * r]); m.n.push([0, -1, 0], [0, -1, 0], [0, -1, 0]); m.f.push([u, u + 1, u + 2]); } }
    return m; },
  sphere(r, seg = 10, rings = 7) { const m = newMesh();
    for (let j = 0; j <= rings; j++) for (let i = 0; i <= seg; i++) { const th = j / rings * Math.PI, ph = i / seg * 6.2832, n = [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)]; m.v.push([n[0] * r, n[1] * r, n[2] * r]); m.n.push(n); }
    for (let j = 0; j < rings; j++) for (let i = 0; i < seg; i++) { const a = j * (seg + 1) + i, b = a + seg + 1; m.f.push([a, b, a + 1], [a + 1, b, b + 1]); } return m; },
  prism(w, h, d) { const m = newMesh(), x = w / 2, z = d / 2, nl = v3.norm([h, x, 0]); // a gabled roof: ridge along z
    addQuad(m, [-x, 0, z], [x, 0, z], [0, h, z], [0, h, z], [0, 0, 1]); addQuad(m, [x, 0, -z], [-x, 0, -z], [0, h, -z], [0, h, -z], [0, 0, -1]);
    addQuad(m, [-x, 0, -z], [-x, 0, z], [0, h, z], [0, h, -z], v3.norm([-h, x, 0])); addQuad(m, [x, 0, z], [x, 0, -z], [0, h, -z], [0, h, z], v3.norm([h, x, 0])); return m; },
};
// ---------- procedural textures: 32x32 rgb, sampled with wrap ----------
const TEXS = {}, TEXGEN = {
  asphalt: (x, y, h) => { const v = 40 + h * 30; return [v, v, v + 6]; },
  concrete: (x, y, h) => { const v = 120 + h * 36 - ((x % 16 === 0 || y % 16 === 0) ? 26 : 0); return [v, v, v - 4]; },
  brick: (x, y, h) => { const r = y >> 2, off = (r & 1) * 4, mortar = (y & 3) === 0 || ((x + off) & 7) === 0; return mortar ? [150, 140, 128] : [150 + h * 26, 62 + h * 14, 44 + h * 10]; },
  wood: (x, y, h) => { const v = 120 + h * 24 - (y % 8 === 0 ? 40 : 0); return [v, v * .66, v * .38]; },
  stucco: (x, y, h) => { const v = 190 + h * 40; return [v, v * .94, v * .84]; },
  metal: (x, y, h) => { const v = 150 + h * 24 - (x % 16 === 0 ? 30 : 0); return [v, v, v + 8]; },
  carpet: (x, y, h) => { const v = 100 + h * 30; return [v * 1.0, v * .5, v * .6]; },
  tile: (x, y, h) => { const ed = (x & 15) === 0 || (y & 15) === 0; return ed ? [90, 90, 96] : [196 + h * 20, 196 + h * 20, 200 + h * 20]; },
  sand: (x, y, h) => { const v = 190 + h * 40; return [v, v * .8, v * .52]; },
  lines: (x, y, h) => (x & 31) > 13 && (x & 31) < 19 ? [230, 200, 60] : [44 + h * 20, 44 + h * 20, 50 + h * 20],
  paint: (x, y, h) => [235 + h * 12, 235 + h * 12, 235 + h * 12],
  windows: (x, y, h) => { const w = (x & 15) > 3 && (x & 15) < 12 && (y & 15) > 3 && (y & 15) < 12; return w ? [(hash2(x >> 4, y >> 4) > .45 ? [255, 220, 120] : [30, 40, 70])[0], (hash2(x >> 4, y >> 4) > .45 ? 210 : 44), (hash2(x >> 4, y >> 4) > .45 ? 110 : 80)] : [110 + h * 20, 100 + h * 20, 96 + h * 20]; },
  grid: (x, y, h) => ((x & 7) === 0 || (y & 7) === 0) ? [40, 60, 90] : [20 + h * 8, 28 + h * 8, 44 + h * 8],
  stripes: (x, y, h) => ((x + y) & 15) < 8 ? [220, 60, 60] : [235, 235, 235],
  blob: (x, y) => { const d = Math.hypot((x - 15.5) / 15.5, (y - 15.5) / 15.5); const v = Math.max(0, 1 - d) * 255; return [v, v, v]; },
};
function getTex(name) {
  if (TEXS[name]) return TEXS[name];
  const t = new Uint8Array(32 * 32 * 3), g = TEXGEN[name];
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const h = (hash2(x, y + name.length * 7) - .5) * .55, c = g(x, y, h); const o = (y * 32 + x) * 3; t[o] = Math.max(0, Math.min(255, c[0])); t[o + 1] = Math.max(0, Math.min(255, c[1])); t[o + 2] = Math.max(0, Math.min(255, c[2])); }
  return TEXS[name] = t;
}
// ---------- the rasterizer ----------
const LA = new Float64Array(16), RA = new Float64Array(16), CUR = new Float64Array(16);
// tri: three {x, y, a: Float64Array(na)}; a[0] is always 1/z. px(x, y, cur) shades one pixel; return false to skip it.
function rasterTri(P, na, px) {
  let y0 = Math.min(P[0].y, P[1].y, P[2].y), y1 = Math.max(P[0].y, P[1].y, P[2].y);
  const ys = Math.max(0, Math.ceil(y0 - .5)), ye = Math.min(H - 1, Math.floor(y1 - .5));
  for (let y = ys; y <= ye; y++) {
    const yc = y + .5; let n = 0, xl = 0, xr = 0;
    for (let e = 0; e < 3; e++) {
      const A = P[e], B = P[(e + 1) % 3];
      if ((A.y <= yc && B.y > yc) || (B.y <= yc && A.y > yc)) {
        const t = (yc - A.y) / (B.y - A.y), x = A.x + (B.x - A.x) * t;
        if (n === 0) { xl = x; for (let k = 0; k < na; k++) LA[k] = A.a[k] + (B.a[k] - A.a[k]) * t; n = 1; }
        else { xr = x; for (let k = 0; k < na; k++) RA[k] = A.a[k] + (B.a[k] - A.a[k]) * t; n = 2; break; }
      }
    }
    if (n < 2) continue;
    if (xl > xr) { const tx = xl; xl = xr; xr = tx; for (let k = 0; k < na; k++) { const tk = LA[k]; LA[k] = RA[k]; RA[k] = tk; } }
    const xs = Math.max(0, Math.ceil(xl - .5)), xe = Math.min(W - 1, Math.floor(xr - .5)), span = xr - xl || 1;
    for (let x = xs; x <= xe; x++) {
      const t = (x + .5 - xl) / span; for (let k = 0; k < na; k++) CUR[k] = LA[k] + (RA[k] - LA[k]) * t;
      px(x, y, CUR);
    }
  }
}
// clip a camera-space polygon (verts with attribute arrays) against the near plane; returns a convex polygon
function clipNear(poly, na, near = .08) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const A = poly[i], B = poly[(i + 1) % poly.length], ina = A.z >= near, inb = B.z >= near;
    if (ina) out.push(A);
    if (ina !== inb) { const t = (near - A.z) / (B.z - A.z); const o = { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, z: near, raw: new Float64Array(na) }; for (let k = 0; k < na; k++) o.raw[k] = A.raw[k] + (B.raw[k] - A.raw[k]) * t; out.push(o); }
  }
  return out;
}
// ---------- scene objects ----------
function xform(m, o) { // object space -> world space (yaw about y, then scale, then translate)
  const c = Math.cos(o.r || 0), s = Math.sin(o.r || 0), sc = o.s || [1, 1, 1], p = o.p, pt = o.pitch || 0, cp = Math.cos(pt), sp = Math.sin(pt);
  const W3 = m.v.map(v => { let x = v[0] * sc[0], y = v[1] * sc[1], z = v[2] * sc[2]; if (pt) { const yy = y * cp - z * sp; z = y * sp + z * cp; y = yy; } return [x * c + z * s + p[0], y + p[1], -x * s + z * c + p[2]]; });
  const N3 = m.n.map(n => { let x = n[0], y = n[1], z = n[2]; if (pt) { const yy = y * cp - z * sp; z = y * sp + z * cp; y = yy; } return [x * c + z * s, y, -x * s + z * c]; });
  return { v: W3, n: N3, f: m.f };
}
const mesh = (spec) => typeof spec === 'string' ? (MESH_CACHE[spec] || (MESH_CACHE[spec] = buildMesh(spec))) : spec;
const MESH_CACHE = {};
function buildMesh(spec) { const [k, ...a] = spec.split(':'); return MESH[k](...a.map(Number)); }
const hexRGB = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
// ---------- the prerender ----------
// scene: { objs: [{ m: 'box:w:h:d', p, r, s, mat: { col:'#hex', tex, ts, emis, shiny, blend, alpha } }], lights: [{ p, col, rad, int, glow }], amb: [r,g,b] 0..1, sun: { dir, col }, sky: [top, bottom, ...], fog: { col, dens } }
function prerender(sc, cam) {
  const color = new Uint32Array(W * H), depth = new Float32Array(W * H), lights = sc.lights || [], amb = sc.amb || [.2, .2, .3], fog = sc.fog || { col: '#101028', dens: .02 }, fc = hexRGB(fog.col);
  // sky
  const sk = sc.sky || ['#000018', '#301848'], s0 = hexRGB(sk[0]), s1 = hexRGB(sk[1]);
  for (let y = 0; y < H; y++) { const k = Math.min(1, Math.max(0, (y - 0) / (CY + 20))); for (let x = 0; x < W; x++) { let r = s0[0] + (s1[0] - s0[0]) * k, g = s0[1] + (s1[1] - s0[1]) * k, b = s0[2] + (s1[2] - s0[2]) * k; if (sc.stars && hash2(x * 7, y * 13) > .9965 && k < .8) { r = g = b = 235; } color[y * W + x] = packD(r, g, b, x, y); } }
  if (sc.moon) { const mp = project(cam, sc.moon.p); if (mp) for (let y = -20; y <= 20; y++) for (let x = -20; x <= 20; x++) { const d = Math.hypot(x, y); if (d <= sc.moon.r && mp[0] + x >= 0 && mp[0] + x < W && mp[1] + y >= 0 && mp[1] + y < H) { const sh = d > sc.moon.r - 1.5 ? .85 : 1, n = hash2(x, y) * .06; color[((mp[1] + y) | 0) * W + ((mp[0] + x) | 0)] = packD(235 * sh - n * 255, 232 * sh - n * 255, 205 * sh - n * 255, x, y); } } }
  const sun = sc.sun && { d: v3.norm(sc.sun.dir), c: sc.sun.col };
  const objs = sc.objs || [];
  for (const o of objs) {
    const mat = o.mat || {}, base = hexRGB(mat.col || '#808080'), tex = mat.tex ? getTex(mat.tex) : null, ts = mat.ts || 2, em = mat.emis || 0, shiny = mat.shiny || 0, mul = mat.blend === 'mul';
    const wm = xform(mesh(o.m), o);
    for (const f of wm.f) {
      const raw = f.map(i => { const w = wm.v[i], q = toCam(cam, w), n = wm.n[i]; return { x: q[0], y: q[1], z: q[2], w, n, raw: null }; });
      // face normal (for texture mapping axis) and view-facing flip
      const fn = v3.norm(v3.cross(v3.sub(raw[1].w, raw[0].w), v3.sub(raw[2].w, raw[0].w))), vd = v3.sub(raw[0].w, cam.pos), flip = v3.dot(fn, vd) > 0 ? -1 : 1;
      const ax = Math.abs(fn[0]), ay = Math.abs(fn[1]), az = Math.abs(fn[2]), axis = ay >= ax && ay >= az ? 1 : ax >= az ? 0 : 2;
      const poly = raw.map(r => { const o2 = { x: r.x, y: r.y, z: r.z, raw: new Float64Array(NAT) }; const uu = axis === 1 ? r.w[0] : axis === 0 ? r.w[2] : r.w[0], vv = axis === 1 ? r.w[2] : r.w[1];
        const nn = (mat.flat ? fn : r.n); o2.raw[0] = 1; o2.raw[1] = r.w[0]; o2.raw[2] = r.w[1]; o2.raw[3] = r.w[2]; o2.raw[4] = uu; o2.raw[5] = vv; o2.raw[6] = nn[0] * flip; o2.raw[7] = nn[1] * flip; o2.raw[8] = nn[2] * flip; return o2; });
      const cl = clipNear(poly, NAT); if (cl.length < 3) continue;
      const sp = cl.map(c => { const iz = 1 / c.z, a = new Float64Array(NAT); a[0] = iz; for (let k = 1; k < NAT; k++) a[k] = c.raw[k] * iz; return { x: CX + cam.foc * c.x * iz, y: CY - cam.foc * c.y * iz, a }; });
      for (let t = 1; t < sp.length - 1; t++) rasterTri([sp[0], sp[t], sp[t + 1]], NAT, (x, y, a) => {
        const iz = a[0], idx = y * W + x; if (!mul && iz <= depth[idx]) return; if (mul && iz < depth[idx] * .999) return;
        const z = 1 / iz, wx = a[1] * z, wy = a[2] * z, wz = a[3] * z; let u = a[4] * z, v = a[5] * z;
        let nx = a[6] * z, ny = a[7] * z, nz = a[8] * z; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        let r = base[0], g = base[1], b = base[2];
        if (tex) { const ix = Math.floor(u / ts * 32) & 31, iy = Math.floor(v / ts * 32) & 31, o3 = (iy * 32 + ix) * 3; r = r * tex[o3] / 128; g = g * tex[o3 + 1] / 128; b = b * tex[o3 + 2] / 128; }
        if (mul) { const k = (tex ? tex[((Math.floor(v / ts * 32) & 31) * 32 + (Math.floor(u / ts * 32) & 31)) * 3] : 255) / 255 * (mat.alpha || .5), cc = color[idx]; const [pr, pg, pb] = unpack(cc); color[idx] = packD(pr * (1 - k), pg * (1 - k), pb * (1 - k), x, y); return; }
        // light
        let lr = amb[0], lg = amb[1], lb = amb[2], sr = 0, sg = 0, sb = 0;
        if (sun) { const d = Math.max(0, nx * sun.d[0] + ny * sun.d[1] + nz * sun.d[2]); lr += sun.c[0] * d; lg += sun.c[1] * d; lb += sun.c[2] * d; }
        const vx = cam.pos[0] - wx, vy = cam.pos[1] - wy, vz = cam.pos[2] - wz, vl = Math.hypot(vx, vy, vz) || 1;
        for (let li = 0; li < lights.length; li++) {
          const L = lights[li], dx = L.p[0] - wx, dy = L.p[1] - wy, dz = L.p[2] - wz, d2 = dx * dx + dy * dy + dz * dz, rad = L.rad; if (d2 > rad * rad) continue;
          const d = Math.sqrt(d2) || 1, att = (1 - d / rad); let dd = (nx * dx + ny * dy + nz * dz) / d; dd = dd > 0 ? dd : dd * -.0; const k = att * att * (L.int || 1) * (dd * .85 + .15);
          lr += L.col[0] * k; lg += L.col[1] * k; lb += L.col[2] * k;
          if (shiny) { const hx = dx / d + vx / vl, hy = dy / d + vy / vl, hz = dz / d + vz / vl, hl = Math.hypot(hx, hy, hz) || 1, sd = Math.max(0, (nx * hx + ny * hy + nz * hz) / hl), s = Math.pow(sd, 24) * shiny * att; sr += L.col[0] * s; sg += L.col[1] * s; sb += L.col[2] * s; }
        }
        r = r * lr + sr * 255 + em * base[0]; g = g * lg + sg * 255 + em * base[1]; b = b * lb + sb * 255 + em * base[2];
        // fog
        const fk = 1 - Math.exp(-(fog.dens || .02) * z * (fog.fall === undefined ? 1 : 1)); r += (fc[0] - r) * fk; g += (fc[1] - g) * fk; b += (fc[2] - b) * fk;
        if (mat.alpha && !mul) { const [pr, pg, pb] = unpack(color[idx]); r = pr + (r - pr) * mat.alpha; g = pg + (g - pg) * mat.alpha; b = pb + (b - pb) * mat.alpha; }
        const gr = (hash2(x, y) - .5) * 3; r += gr; g += gr; b += gr; // film grain
        color[idx] = packD(r, g, b, x, y); depth[idx] = iz;
      });
    }
  }
  // glows: additive halos around lights that are actually visible
  for (const L of lights) if (L.glow) {
    const sp = project(cam, L.p); if (!sp) continue; const gx = sp[0] | 0, gy = sp[1] | 0, R = Math.min(60, L.glow * cam.foc / sp[2]);
    if (gx < 0 || gx >= W || gy < 0 || gy >= H || 1 / sp[2] < depth[gy * W + gx] * .98) continue;
    for (let y = Math.max(0, gy - R | 0); y < Math.min(H, gy + R); y++) for (let x = Math.max(0, gx - R | 0); x < Math.min(W, gx + R); x++) {
      const d = Math.hypot(x - gx, y - gy) / R; if (d >= 1) continue; const k = Math.pow(1 - d, 2.4) * (L.gi || .8), [pr, pg, pb] = unpack(color[y * W + x]);
      color[y * W + x] = packD(pr + L.col[0] * 255 * k, pg + L.col[1] * 255 * k, pb + L.col[2] * 255 * k, x, y);
    }
  }
  return { color, depth, cam };
}
// ---------- live drawing: models are lists of parts. a part: { m, p, r (pitch/roll via rot), col, rotx, roty, rotz, pivot } ----------
function drawMeshLive(m, xf, col, light, o = {}) {
  // xf: { p, yaw, s, rx, rz }; light: { amb:[r,g,b], dir:[x,y,z], dcol:[r,g,b], tint:[r,g,b] }
  const cam = LIVE.cam, c = Math.cos(xf.yaw || 0), s = Math.sin(xf.yaw || 0), sc = xf.s || 1, cr = Math.cos(xf.rx || 0), sr = Math.sin(xf.rx || 0), cz = Math.cos(xf.rz || 0), sz = Math.sin(xf.rz || 0);
  const tv = m.v.map(v => { let x = v[0] * sc, y = v[1] * sc, z = v[2] * sc; if (xf.rx) { const yy = y * cr - z * sr; z = y * sr + z * cr; y = yy; } if (xf.rz) { const xx = x * cz - y * sz; y = x * sz + y * cz; x = xx; } const w = [x * c + z * s + xf.p[0], y + xf.p[1], -x * s + z * c + xf.p[2]]; const q = toCam(cam, w); return { w, q }; });
  const base = col, amb = light.amb, dl = light.dir, dc = light.dcol, tint = light.tint || [0, 0, 0];
  for (const f of m.f) {
    const A = tv[f[0]], B = tv[f[1]], C = tv[f[2]];
    if (A.q[2] < .1 || B.q[2] < .1 || C.q[2] < .1) continue;
    const fn = v3.norm(v3.cross(v3.sub(B.w, A.w), v3.sub(C.w, A.w))); let nd = fn; if (v3.dot(fn, v3.sub(A.w, cam.pos)) > 0) nd = [-fn[0], -fn[1], -fn[2]];
    const k = Math.max(0, v3.dot(nd, dl)), r = base[0] * (amb[0] + dc[0] * k) + tint[0], g = base[1] * (amb[1] + dc[1] * k) + tint[1], b = base[2] * (amb[2] + dc[2] * k) + tint[2];
    const pc = rgb(r, g, b), ox = LIVE.ox || 0, oy = LIVE.oy || 0, cl = LIVE.clip;
    const P = [A, B, C].map(t => ({ x: Math.round(CX + ox + cam.foc * t.q[0] / t.q[2]), y: Math.round(CY + oy - cam.foc * t.q[1] / t.q[2]), a: new Float64Array([1 / t.q[2]]) }));
    rasterTri(P, 1, (x, y, a) => { if (cl && (x < cl[0] || y < cl[1] || x >= cl[2] || y >= cl[3])) return; const idx = y * W + x; if (a[0] <= ZD[idx]) return; ZD[idx] = a[0]; FB[idx] = pc; });
  }
}
const LIVE = { cam: null, bg: null };
function showBackdrop(bg) { FB.set(bg.color); ZD.set(bg.depth); LIVE.cam = bg.cam; LIVE.bg = bg; }
// a soft blob shadow on the ground under a character (multiplies what is already there)
function liveShadow(p, rad, strength = .45) {
  const sp = project(LIVE.cam, [p[0], p[1] + .02, p[2]]); if (!sp) return; const rp = rad * LIVE.cam.foc / sp[2], rx = rp, ry = rp * .45;
  for (let y = Math.max(0, sp[1] - ry | 0); y < Math.min(H, sp[1] + ry + 1); y++) for (let x = Math.max(0, sp[0] - rx | 0); x < Math.min(W, sp[0] + rx + 1); x++) {
    const d = Math.hypot((x - sp[0]) / rx, (y - sp[1]) / ry); if (d >= 1) continue; const idx = y * W + x; if (1 / sp[2] < ZD[idx] * .985) continue;
    const k = (1 - d) * strength, [pr, pg, pb] = unpack(FB[idx]); FB[idx] = packD(pr * (1 - k), pg * (1 - k), pb * (1 - k), x, y);
  }
}
