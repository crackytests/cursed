'use strict';
// ================= CHROME FORCE -- art: chrome material painter, rigs, heads, tiles, portraits =================
// Every figure is painted from shapes into MATERIALS, then each material is shaded by its own local
// coordinates: chrome gets the airbrushed-album-cover look (sky, hard horizon line, burning ground).
// Palette swaps make the enemy versions: same rig, black chrome with a red horizon.

const MT = { OUT: 1, CH: 2, AC: 3, SK: 4, GL: 5, GLC: 6, DK: 7, CL: 8, ACD: 9, SKD: 10, CHD: 11, ACL: 12 };
// k: paint resolution (battle sprites paint at 2x so the outlines are fine-lined, not chunky)
function P8(w, h, k = 1, oy = 0) { const W2 = Math.round(w * k), H2 = Math.round(h * k); return { w: W2, h: H2, k, oy, m: new Uint8Array(W2 * H2), t: new Float32Array(W2 * H2), u: new Float32Array(W2 * H2) }; }
function fillP(c, x0, y0, x1, y1, inside0, mat, ink) {
  const k = c.k || 1, oy = c.oy || 0, inside = k === 1 && !oy ? inside0 : (x, y) => inside0(x / k, y / k - oy); x0 *= k; y0 = (y0 + oy) * k; x1 *= k; y1 = (y1 + oy) * k;
  const ax = Math.max(0, Math.floor(x0)), ay = Math.max(0, Math.floor(y0)), bx = Math.min(c.w - 1, Math.ceil(x1)), by = Math.min(c.h - 1, Math.ceil(y1));
  const hh = Math.max(1, y1 - y0), ww = Math.max(1, x1 - x0);
  for (let y = ay; y <= by; y++) for (let x = ax; x <= bx; x++) {
    const px = x + .5, py = y + .5; if (!inside(px, py)) continue;
    const o = y * c.w + x;
    const edge = ink && (!inside(px - 1, py) || !inside(px + 1, py) || !inside(px, py - 1) || !inside(px, py + 1));
    c.m[o] = edge ? MT.OUT : mat; c.t[o] = (py - y0) / hh; c.u[o] = (px - x0) / ww;
  }
}
const pEll = (c, cx, cy, rx, ry, mat, ink = 1) => fillP(c, cx - rx, cy - ry, cx + rx, cy + ry, (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1, mat, ink);
function pCap(c, x0, y0, x1, y1, r0, r1, mat, ink = 1) {
  const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1, R = Math.max(r0, r1);
  fillP(c, Math.min(x0, x1) - R, Math.min(y0, y1) - R, Math.max(x0, x1) + R, Math.max(y0, y1) + R, (x, y) => {
    const k = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / L)), qx = x0 + dx * k - x, qy = y0 + dy * k - y;
    return qx * qx + qy * qy <= (r0 + (r1 - r0) * k) ** 2;
  }, mat, ink);
}
function pPoly(c, pts, mat, ink = 1) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  fillP(c, Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (x, y) => {
    let inside = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside; }
    return inside;
  }, mat, ink);
}
const pRect = (c, x, y, w, h, mat, ink = 0) => fillP(c, x, y, x + w, y + h, (px, py) => px >= x && px <= x + w && py >= y && py <= y + h, mat, ink);
function pDot(c, x, y, mat) { const k = c.k || 1; if (k > 1) return pRect(c, x - .5, y - .5, 1, 1, mat); x |= 0; y |= 0; if (x >= 0 && y >= 0 && x < c.w && y < c.h) { c.m[y * c.w + x] = mat; c.t[y * c.w + x] = .5; } }
function pLine(c, x0, y0, x1, y1, mat) { if ((c.k || 1) > 1) return pCap(c, x0, y0, x1, y1, .5, .5, mat, 0); const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) pDot(c, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, mat); }

// material + local shading -> palette index (see makePal for the slots)
function shadeIdx(m, t, u) {
  switch (m) {
    case MT.OUT: return 1;
    case MT.CH: { let i = t < .2 ? 2 : t < .4 ? 3 : t < .5 ? 4 : t < .57 ? 5 : t < .8 ? 6 : 7; if (u > .86 && i < 5) i++; return i; }
    case MT.CHD: return t < .4 ? 4 : t < .58 ? 5 : 7;
    case MT.AC: return t < .3 ? 8 : t < .72 ? 9 : 10;
    case MT.ACL: return t < .6 ? 8 : 9;
    case MT.ACD: return 10;
    case MT.SK: return t < .62 && u < .8 ? 11 : 12;
    case MT.SKD: return 12;
    case MT.GL: return 14; case MT.GLC: return 13; case MT.DK: return 15;
    case MT.CL: return t < .45 ? 2 : t < .8 ? 3 : 4;
  }
  return 0;
}
function resolveP(c, post) {
  const s = { w: c.w, h: c.h, d: new Uint8Array(c.w * c.h) };
  for (let i = 0; i < s.d.length; i++) if (c.m[i]) s.d[i] = shadeIdx(c.m[i], c.t[i], c.u[i]);
  if (post) post(s);
  return outline(s, 1);
}

// ---------- palettes (9-bit grid: 00 24 49 6d 92 b6 db ff) ----------
const CHROME = {
  hero: ['#ffffff', '#b6dbff', '#4992db', '#002449', '#ff9249', '#6d2400'],
  black: ['#b692db', '#6d49b6', '#242449', '#000000', '#ff2424', '#490000'],
  gold: ['#ffffdb', '#ffdb6d', '#db9224', '#492400', '#ffb649', '#6d2400'],
  bone: ['#ffffdb', '#dbdbb6', '#92926d', '#242424', '#db6d92', '#490024'],
  rust: ['#ffdbb6', '#db926d', '#924924', '#240000', '#dbb649', '#492400'],
  jade: ['#dbffdb', '#92dbb6', '#249292', '#002424', '#ffdb92', '#244924'],
  ivory: ['#ffffff', '#dbdbff', '#9292db', '#242449', '#ffb6db', '#6d2449'],
  ghost: ['#ffffff', '#dbffff', '#92b6db', '#244949', '#b6db92', '#244924'],
  void: ['#ff92ff', '#b624db', '#490092', '#000000', '#24ffdb', '#002449'],
  ember: ['#ffffb6', '#ffb649', '#db4900', '#240000', '#ff2400', '#490000'],
};
const ACC = { // accent ramps (light, mid, dark)
  red: ['#ff6d49', '#db2400', '#6d0000'], blue: ['#6db6ff', '#2449db', '#000092'], pink: ['#ffb6db', '#ff49b6', '#920049'],
  green: ['#b6ff6d', '#49b600', '#004900'], gold: ['#ffff92', '#dbb600', '#6d4900'], purple: ['#db92ff', '#9224db', '#490092'],
  white: ['#ffffff', '#dbdbdb', '#929292'], black: ['#6d6d6d', '#242424', '#000000'], teal: ['#92ffff', '#00b6b6', '#004949'],
  orange: ['#ffdb6d', '#ff9200', '#924900'], brown: ['#dbb66d', '#926d24', '#492400'], cyan: ['#dbffff', '#49dbff', '#0049b6'],
};
const SKIN = { pale: ['#ffdbb6', '#db926d'], tan: ['#dbb692', '#926d49'], green: ['#92ff92', '#249249'], screen: ['#24496d', '#002449'], bone: ['#ffffdb', '#b6b692'], grey: ['#b6b6b6', '#6d6d6d'], holo: ['#b6ffff', '#49b6db'], dark: ['#926d49', '#492400'] };
const GLOW = { cyan: ['#ffffff', '#24dbff'], red: ['#ffdbdb', '#ff0000'], pink: ['#ffdbff', '#ff24db'], green: ['#dbffdb', '#24ff24'], gold: ['#ffffdb', '#ffdb00'], violet: ['#ffdbff', '#b624ff'], white: ['#ffffff', '#b6dbff'], orange: ['#ffffb6', '#ff9200'] };
function makePal(ch, ac, sk, gl, dk = '#000024', ol = '#000024') {
  const C = CHROME[ch] || CHROME.hero, A = ACC[ac] || ACC.red, S = SKIN[sk] || SKIN.pale, G = GLOW[gl] || GLOW.cyan;
  return pal(ol, ...C, ...A, ...S, G[0], G[1], dk);
}

// ---------- heads (scale s: 1 = battle size) ----------
function paintHead(c, kind, cx, cy, s, o = {}) {
  const S = v => v * s;
  switch (kind) {
    case 'helm': case 'visor': {
      pCap(c, cx - S(1), cy - S(5.5), cx - S(7), cy - S(9), S(1.6), S(.8), MT.AC, s > 1.5); // plume
      pEll(c, cx, cy, S(5.2), S(5.8), MT.CH);
      pPoly(c, [[cx - S(4), cy + S(2)], [cx + S(5.5), cy + S(1)], [cx + S(3), cy + S(6)], [cx - S(2), cy + S(5.5)]], MT.CH); // jaw guard
      if (kind === 'visor') pRect(c, cx - S(3.5), cy - S(1.6), S(9), S(2.6), MT.GL); else { pRect(c, cx - S(1), cy - S(1), S(6.5), S(1.3), MT.GL); pRect(c, cx + S(1), cy - S(.6), S(3), S(.5), MT.GLC); }
      pCap(c, cx - S(2), cy - S(6.5), cx + S(4), cy - S(5), S(.8), S(.6), MT.CHD, 0); // crest ridge
      break;
    }
    case 'horn': { // dark-knight horned helm
      pCap(c, cx - S(2), cy - S(4), cx - S(6), cy - S(11), S(1.6), S(.4), MT.CH, 1);
      pCap(c, cx + S(2), cy - S(4), cx + S(5), cy - S(11), S(1.6), S(.4), MT.CH, 1);
      pEll(c, cx, cy, S(5.2), S(5.8), MT.CH);
      pRect(c, cx - S(3.5), cy - S(1.4), S(9), S(2.2), MT.GL); pRect(c, cx + S(1), cy - S(1), S(3), S(.7), MT.GLC);
      break;
    }
    case 'crt': { // screen-faced: a human expression coming through a machine
      pCap(c, cx + S(2), cy - S(6), cx + S(5), cy - S(10), S(.5), S(.5), MT.CHD, 0); pDot(c, cx + S(5), cy - S(10.5), MT.GL);
      pPoly(c, [[cx - S(6), cy - S(5.5)], [cx + S(6), cy - S(5.5)], [cx + S(6.5), cy + S(5)], [cx - S(6.5), cy + S(5)]], MT.CH);
      pRect(c, cx - S(4.5), cy - S(4), S(9.5), S(7.5), MT.DK);
      const ey = cy - S(1.5), m = o.mood || 0;
      for (const ex of [cx - S(1.8), cx + S(2.8)]) { if (s >= 2) { pEll(c, ex, ey, S(1.3), S(1.1), MT.GL, 0); pEll(c, ex, ey, S(.5), S(.5), MT.GLC, 0); } else pRect(c, ex - S(.6), ey - S(.5), Math.max(1, S(1.2)), Math.max(1, S(1)), MT.GL); }
      if (m === 1) pCap(c, cx - S(1.5), cy + S(1.4), cx + S(2.5), cy + S(1.4), S(.35), S(.35), MT.GL, 0);
      else for (let i = 0; i < 5; i++) pDot(c, cx - S(1.6) + S(i), cy + S(1.6) + (i % 2 ? -S(.3) : S(.3)), MT.GL);
      if (s >= 2) for (let y = cy - S(4); y < cy + S(3.5); y += 2) for (let x = cx - S(4.5); x < cx + S(5); x++) { const o2 = (y | 0) * c.w + (x | 0); if (c.m[o2] === MT.DK) c.t[o2] = 1; }
      break;
    }
    case 'pony': { // swept-up ponytail warrior-woman
      pCap(c, cx - S(3), cy - S(5), cx - S(8), cy - S(12), S(2.6), S(1.6), MT.AC);
      pCap(c, cx - S(8), cy - S(12), cx - S(12), cy - S(9), S(1.6), S(.8), MT.AC);
      pEll(c, cx - S(.5), cy - S(1), S(5.2), S(5.6), MT.AC);
      pEll(c, cx + S(1), cy + S(.5), S(4.2), S(5), MT.SK);
      pPoly(c, [[cx - S(4), cy - S(5)], [cx + S(5.5), cy - S(4.5)], [cx + S(4.5), cy - S(1.5)], [cx + S(1), cy - S(3)], [cx - S(2), cy + S(1)]], MT.AC, 0); // bangs
      pRect(c, cx + S(2), cy - S(1.2), S(2.2), S(1), MT.GL); pRect(c, cx + S(2.6), cy - S(.4), S(1.2), S(1), MT.DK); // eyeshadow + eye
      pRect(c, cx + S(2.2), cy + S(3), S(1.8), S(.7), MT.ACD); // dark lips
      if (o.collar !== false) pPoly(c, [[cx - S(2), cy + S(4)], [cx + S(4), cy + S(4)], [cx + S(4.5), cy + S(7)], [cx - S(3), cy + S(7)]], MT.DK);
      break;
    }
    case 'skull': { // horde bioroid: bone face, fiber-optic pink ponytail
      pCap(c, cx - S(3), cy - S(4), cx - S(9), cy - S(9), S(2), S(1), MT.AC);
      pEll(c, cx, cy, S(5), S(5.6), MT.SK);
      pRect(c, cx + S(1), cy - S(1.6), S(2.2), S(2), MT.DK); pDot(c, cx + S(2), cy - S(.8), MT.GL);
      pRect(c, cx + S(-2.5), cy - S(1.6), S(2), S(2), MT.DK);
      for (let i = 0; i < 4; i++) pRect(c, cx - S(1.5) + S(i * 1.6), cy + S(3), Math.max(1, S(.8)), S(1.5), MT.DK);
      break;
    }
    case 'sheet': { // the old ghost look: a sheet with shades, cool as anything
      pPoly(c, [[cx - S(6.2), cy], [cx + S(6.4), cy], [cx + S(7.5), cy + S(9)], [cx + S(4), cy + S(7.5)], [cx + S(1), cy + S(10)], [cx - S(2.5), cy + S(8)], [cx - S(7), cy + S(10)]], MT.CL);
      pEll(c, cx, cy - S(.5), S(6.3), S(6.5), MT.CL);
      pRect(c, cx - S(2), cy - S(1.5), S(9), S(2.2), MT.DK); pRect(c, cx - S(1), cy - S(1.2), S(2), S(.6), MT.GLC); pRect(c, cx + S(3.5), cy - S(1.2), S(2), S(.6), MT.GLC);
      if (s >= 2) pCap(c, cx + S(1), cy + S(3.5), cx + S(4), cy + S(3), S(.35), S(.35), MT.CHD, 0);
      break;
    }
    case 'alien': { // little green courier: huge eyes, backwards cap, bow tie
      pEll(c, cx, cy + S(.5), S(6.5), S(6), MT.SK);
      pEll(c, cx - S(1.5), cy - S(3.5), S(5.5), S(3.2), MT.AC); pCap(c, cx - S(5), cy - S(3), cx - S(9), cy - S(1.5), S(1.1), S(.8), MT.ACD, 0); // cap, brim to the back
      for (const ex of [cx + S(.5), cx + S(4.2)]) { pEll(c, ex, cy + S(.8), S(1.7), S(2.3), MT.DK, 0); pDot(c, ex - S(.4), cy - S(.2), MT.GLC); }
      pRect(c, cx + S(1), cy + S(4.2), S(2.5), S(.6), MT.SKD);
      pPoly(c, [[cx - S(1.5), cy + S(6)], [cx + S(.5), cy + S(7)], [cx - S(1.5), cy + S(8)]], MT.GL, 0); pPoly(c, [[cx + S(2.5), cy + S(6)], [cx + S(.5), cy + S(7)], [cx + S(2.5), cy + S(8)]], MT.GL, 0);
      break;
    }
    case 'holo': { // assistant hologram: long hair, kind eyes
      pCap(c, cx - S(3), cy - S(2), cx - S(4), cy + S(9), S(3.6), S(2.4), MT.AC);
      pEll(c, cx, cy - S(1), S(5.3), S(5.6), MT.AC);
      pEll(c, cx + S(1.2), cy + S(.6), S(4), S(4.8), MT.SK);
      pPoly(c, [[cx - S(3), cy - S(5.5)], [cx + S(5.6), cy - S(4)], [cx + S(5), cy - S(1.5)], [cx + S(.5), cy - S(3)]], MT.AC, 0);
      pRect(c, cx + S(2.3), cy - S(.6), S(1.4), S(1.6), MT.DK); pDot(c, cx + S(2.6), cy - S(.4), MT.GLC);
      pRect(c, cx + S(2.6), cy + S(3), S(1.4), S(.5), MT.SKD);
      pEll(c, cx - S(1), cy + S(.5), S(1.3), S(1.3), MT.GL, 0); // headset light
      break;
    }
    case 'speaker': {
      pEll(c, cx, cy, S(6), S(6), MT.CH);
      pEll(c, cx + S(.5), cy, S(4.4), S(4.4), MT.DK, 0); pEll(c, cx + S(.5), cy, S(3), S(3), MT.CHD, 0); pEll(c, cx + S(.5), cy, S(1.4), S(1.4), MT.GL, 0);
      break;
    }
    case 'eye': {
      pEll(c, cx, cy, S(6), S(6), MT.CH);
      pEll(c, cx + S(1.5), cy, S(3.6), S(3.6), MT.DK, 0); pEll(c, cx + S(2), cy, S(2.2), S(2.2), MT.GL, 0); pEll(c, cx + S(2.6), cy - S(.6), S(.8), S(.8), MT.GLC, 0);
      break;
    }
    case 'wolf': {
      pPoly(c, [[cx - S(4), cy - S(3)], [cx - S(2), cy - S(10)], [cx + S(1), cy - S(4)]], MT.CH);
      pEll(c, cx, cy, S(5), S(4.5), MT.CH);
      pCap(c, cx + S(2), cy + S(1), cx + S(8), cy + S(2), S(2.6), S(1.6), MT.CH);
      pRect(c, cx + S(1), cy - S(1.6), S(2.5), S(1.2), MT.GL); pRect(c, cx + S(7), cy + S(3), S(2), S(.8), MT.DK);
      break;
    }
    case 'tiny': pEll(c, cx, cy, S(3), S(3), MT.CH); pDot(c, cx + S(1), cy, MT.GL); break;
  }
}

// ---------- weapons ----------
function paintWeapon(c, kind, hx, hy, a, s = 1, o = {}) {
  const dx = Math.cos(a), dy = Math.sin(a), at = L => [hx + dx * L * s, hy + dy * L * s];
  switch (kind) {
    case 'saber': { const [x0, y0] = at(-3), [x1, y1] = at(2), [x2, y2] = at(o.long || 26);
      pCap(c, x0, y0, x1, y1, 1.3 * s, 1.3 * s, MT.DK, 0); pCap(c, x1 - dy * 3 * s, y1 + dx * 3 * s, x1 + dy * 3 * s, y1 - dx * 3 * s, .9 * s, .9 * s, MT.CHD, 0);
      pCap(c, x1, y1, x2, y2, 2 * s, 1.6 * s, MT.GL, 0); pCap(c, x1, y1, x2, y2, .7 * s, .5 * s, MT.GLC, 0); break; }
    case 'lance': { const [x0, y0] = at(-12), [x1, y1] = at(24), [x2, y2] = at(34);
      pCap(c, x0, y0, x1, y1, 1.1 * s, 1.1 * s, MT.CHD, 0); pCap(c, x1, y1, x2, y2, 2.4 * s, .3 * s, MT.GL, 0); pCap(c, x1, y1, x2, y2, .8 * s, .2 * s, MT.GLC, 0);
      pCap(c, ...at(20), ...at(24), 2.2 * s, 1.2 * s, MT.CH, 0); break; }
    case 'axe': { const [x0, y0] = at(-6), [x1, y1] = at(22); pCap(c, x0, y0, x1, y1, 1.2 * s, 1.2 * s, MT.CHD, 0);
      const [bx, by] = at(17), nx = -dy, ny = dx; pPoly(c, [[bx, by], [bx + nx * 10 * s - dx * 4 * s, by + ny * 10 * s - dy * 4 * s], [bx + nx * 10 * s + dx * 7 * s, by + ny * 10 * s + dy * 7 * s], [bx + dx * 5 * s, by + dy * 5 * s]], MT.CH);
      pLine(c, bx + nx * 9.5 * s - dx * 3 * s, by + ny * 9.5 * s - dy * 3 * s, bx + nx * 9.5 * s + dx * 6 * s, by + ny * 9.5 * s + dy * 6 * s, MT.GL); break; }
    case 'staff': { const [x0, y0] = at(-10), [x1, y1] = at(20); pCap(c, x0, y0, x1, y1, 1 * s, 1 * s, MT.CHD, 0);
      pEll(c, ...at(22), 3 * s, 3 * s, MT.CH); pEll(c, ...at(22), 1.6 * s, 1.6 * s, MT.GL, 0); pDot(c, ...at(21.5), MT.GLC); break; }
    case 'rail': { const nx = -dy, ny = dx; pCap(c, ...at(-4), ...at(18), 2.2 * s, 1.6 * s, MT.CH); pCap(c, ...at(0), ...at(18), .7 * s, .7 * s, MT.GL, 0);
      pCap(c, hx + nx * 3 * s, hy + ny * 3 * s, ...at(-2), 1 * s, 1 * s, MT.CHD, 0); break; }
    case 'gun': { pCap(c, ...at(-2), ...at(14), 3 * s, 2.4 * s, MT.CH); pCap(c, ...at(12), ...at(17), 1.4 * s, 1.4 * s, MT.DK, 0); pDot(c, ...at(17), MT.GL); break; }
    case 'claw': { const nx = -dy, ny = dx; for (const k of [-2, 0, 2]) pCap(c, hx + nx * k * s, hy + ny * k * s, ...at(10).map((v, i) => v + (i ? ny : nx) * k * 1.6 * s), .7 * s, .3 * s, MT.GL, 0); break; }
  }
}

// ---------- rigs (all face right; ground at c.h-4) ----------
// pose: { arm: weapon angle (rad), lean, step (gait phase 0..1), wind: 0..1 }
function paintRig(c, sp, pose) {
  const G = c.h / (c.k || 1) - 4, st = pose.step || 0, ar = pose.arm === undefined ? -1.2 : pose.arm, lean = pose.lean || 0;
  const leg = (hx, hy, ph, len, r, mat = MT.CH) => { // two-segment leg, knee forward
    const sw = Math.sin(ph * 6.283) * 3, fx = hx + sw, kx = hx + sw * .5 + 2.5, ky = hy + len * .5;
    pCap(c, hx, hy, kx, ky, r, r * .8, mat); pCap(c, kx, ky, fx, G - 1, r * .8, r * .6, mat); pRect(c, fx - 2, G - 2, 4.5, 2.5, MT.DK);
  };
  const arm = (sx, sy, a, len, r, weapon, mat = MT.CH) => {
    const ex = sx + Math.cos(a + .9) * len * .5, ey = sy + Math.sin(a + .9) * len * .5, hx = ex + Math.cos(a + .2) * len * .5, hy = ey + Math.sin(a + .2) * len * .5;
    pCap(c, sx, sy, ex, ey, r, r * .85, mat); pCap(c, ex, ey, hx, hy, r * .85, r * .7, mat);
    if (weapon) paintWeapon(c, weapon, hx, hy, a, sp.ws || 1, sp.wo || {});
    pEll(c, hx, hy, r * .9, r * .9, MT.AC);
  };
  const body = sp.body;
  if (body === 'cent') { // chrome centaur: war-horse barrel, armoured knight torso, cape streaming back
    const bx = 32 + lean * .4, by = G - 27, tx = bx + 15 + lean * .6, ty = by - 15;
    pCap(c, bx - 17, by - 3, bx - 28, by + 8, 3.2, 1.6, MT.AC); pCap(c, bx - 27, by + 7, bx - 25, by + 19, 1.8, .6, MT.AC); // tail plume
    leg(bx - 12, by + 4, st + .5, 23, 3, MT.CHD); leg(bx + 10, by + 4, st, 23, 3, MT.CHD);
    pPoly(c, [[tx - 4, ty - 6], [bx - 20, by - 9 + Math.sin(st * 6.28) * 2], [bx - 24, by + 4], [bx - 10, by - 2], [tx - 2, ty + 4]], MT.AC); // cape
    pEll(c, bx - 1, by, 18, 8.5, MT.CH);
    pEll(c, bx + 12, by - 2, 8.5, 9, MT.CH); // chest of the horse
    pCap(c, bx - 14, by - 1, bx + 6, by - 1, 1, 1, MT.ACD, 0); pRect(c, bx - 6, by - 3, 4, 4, MT.GL); // girth strap + power cell
    leg(bx - 14, by + 4, st, 23, 3.4, MT.CH); leg(bx + 12, by + 4, st + .5, 23, 3.4, MT.CH);
    arm(tx - 3, ty - 4, ar + .3, 15, 2.6, null, MT.CHD);
    pCap(c, bx + 12, by - 4, tx, ty, 7.5, 6.5, MT.CH); // human torso
    pPoly(c, [[tx - 3, ty + 1], [tx + 4, ty + 1], [tx + 2, ty + 7], [tx - 2, ty + 7]], MT.AC, 0); pRect(c, tx - .5, ty + 2, 2, 2, MT.GL);
    pEll(c, tx - 3, ty - 5, 6, 4.5, MT.CH); pEll(c, tx + 4, ty - 5, 6, 4.5, MT.CH); // pauldrons
    paintHead(c, sp.head, tx + 1.5 + lean * .3, ty - 14, sp.hs || 1.15, sp.ho || {});
    arm(tx + 4, ty - 4, ar, 16, 2.9, sp.weap);
  } else if (body === 'bip' || body === 'heavy' || body === 'bird') {
    const hv = body === 'heavy', hx = 36 + lean * .3, hy = G - 22, tx = 36 + lean, ty = G - 38;
    if (body === 'bird') { pPoly(c, [[tx - 4, ty - 4], [tx - 26, ty - 18 + st * 4], [tx - 22, ty - 4], [tx - 28, ty + 4], [tx - 6, ty + 6]], MT.AC); pPoly(c, [[tx - 6, ty - 2], [tx - 18, ty - 8], [tx - 14, ty + 2]], MT.CHD, 0); pCap(c, tx - 10, ty + 8, tx - 12, ty + 14, 2, 3.4, MT.GL, 0); }
    leg(hx - 3, hy, st + .5, 20, hv ? 4.5 : 3, MT.CHD);
    arm(tx - 3, ty - 8, ar + .3, 15, hv ? 3.4 : 2.4, null, MT.CHD);
    leg(hx + 2, hy, st, 20, hv ? 4.8 : 3.2, MT.CH);
    pCap(c, hx, hy - 2, tx, ty, hv ? 9 : 6, hv ? 10 : 7, MT.CH);
    pPoly(c, [[tx - 2, ty + 6], [tx + 4, ty + 6], [tx + 3, ty + 18], [tx - 1, ty + 18]], MT.AC, 0); pRect(c, tx - 4, ty + 5, 10, 2, MT.ACD); pRect(c, tx, ty - 1, 2.5, 2.5, MT.GL);
    pEll(c, tx - 3, ty - 7, hv ? 7 : 5, hv ? 5.5 : 4, MT.CH); pEll(c, tx + 5, ty - 7, hv ? 7 : 5, hv ? 5.5 : 4, MT.CH);
    paintHead(c, sp.head, tx + 2, ty - (hv ? 17 : 15), sp.hs || 1, sp.ho || {});
    arm(tx + 3, ty - 7, ar, 15, hv ? 3.6 : 2.6, sp.weap);
  } else if (body === 'tiny') { // little alien courier on a hover-sled
    const tx = 38 + lean, ty = G - 22;
    pPoly(c, [[tx - 16, G - 8], [tx + 14, G - 8], [tx + 18, G - 4], [tx - 14, G - 2]], MT.CH); pRect(c, tx - 12, G - 3, 22, 1.5, MT.GL);
    pCap(c, tx, ty + 8, tx, ty, 4.5, 4, MT.AC); pCap(c, tx - 2, ty + 9, tx - 4, G - 8, 1.6, 1.4, MT.CHD); pCap(c, tx + 2, ty + 9, tx + 3, G - 8, 1.6, 1.4, MT.CH);
    paintHead(c, sp.head, tx + 1, ty - 9, sp.hs || 1.1, sp.ho || {});
    arm(tx + 2, ty + 1, ar, 11, 1.7, sp.weap, MT.SK);
  } else if (body === 'walker') { // junk walker with a spirit inside
    const tx = 36 + lean, ty = G - 34;
    leg(tx - 7, ty + 10, st + .5, 18, 3, MT.CHD); leg(tx + 7, ty + 10, st, 18, 3.2, MT.CH);
    pPoly(c, [[tx - 12, ty - 6], [tx + 12, ty - 8], [tx + 13, ty + 12], [tx - 13, ty + 12]], MT.CH);
    pRect(c, tx - 8, ty + 4, 6, 4, MT.DK); pRect(c, tx + 2, ty + 4, 6, 4, MT.DK); pDot(c, tx - 5, ty + 6, MT.GL); pDot(c, tx + 5, ty + 6, MT.GL);
    paintHead(c, sp.head, tx + 1, ty - 12, sp.hs || 1.25, sp.ho || {});
    arm(tx + 10, ty - 2, ar, 15, 2.6, sp.weap);
  } else if (body === 'drone') { // hover disc projecting a figure
    const tx = 38 + lean, ty = G - 34 + Math.sin(st * 6.28) * 1.5;
    pEll(c, tx, G - 10, 14, 4, MT.CH); pEll(c, tx, G - 8, 8, 2, MT.GL, 0);
    pPoly(c, [[tx - 7, G - 12], [tx + 7, G - 12], [tx + 4, ty + 6], [tx - 4, ty + 6]], MT.ACL, 0);
    pCap(c, tx, ty + 8, tx, ty - 2, 4, 5, MT.AC);
    paintHead(c, sp.head, tx + 1, ty - 10, sp.hs || 1, sp.ho || {});
    arm(tx + 3, ty - 1, ar, 12, 1.8, sp.weap, MT.SK);
  } else if (body === 'beast') {
    const bx = 34 + lean, by = G - 18;
    leg(bx - 10, by + 2, st + .5, 14, 2.5, MT.CHD); leg(bx + 9, by + 2, st, 14, 2.5, MT.CHD);
    pCap(c, bx - 13, by - 2, bx - 24, by - 10, 2.5, 1, MT.AC);
    pEll(c, bx, by, 14, 7, MT.CH); pRect(c, bx - 8, by - 4, 12, 1, MT.GL);
    leg(bx - 12, by + 2, st, 14, 2.8); leg(bx + 11, by + 2, st + .5, 14, 2.8);
    paintHead(c, sp.head || 'wolf', bx + 15, by - 7, sp.hs || 1.15, sp.ho || {});
  } else if (body === 'tank') {
    const tx = 38;
    pCap(c, tx - 22, G - 8, tx + 22, G - 8, 6, 6, MT.CHD); for (let i = -18; i <= 18; i += 6) pEll(c, tx + i + (st * 6 % 6), G - 8, 2.4, 2.4, MT.DK, 0);
    pPoly(c, [[tx - 20, G - 14], [tx + 20, G - 14], [tx + 15, G - 28], [tx - 16, G - 28]], MT.CH);
    pEll(c, tx - 2, G - 30, 11, 7, MT.CH); pCap(c, tx + 6, G - 32, tx + 32, G - 36 + (pose.wind || 0) * 4, 2.6, 2, MT.CH); pDot(c, tx + 33, G - 36, MT.GL);
    paintHead(c, sp.head || 'tiny', tx - 4, G - 40, sp.hs || 1, sp.ho || {});
    pRect(c, tx - 14, G - 22, 26, 2, MT.GL);
  } else if (body === 'blob') { // horde reassembly mass: bodies inside bodies
    const tx = 36 + lean;
    pEll(c, tx, G - 14, 22, 13, MT.SK); for (let i = 0; i < 5; i++) pCap(c, tx - 18 + i * 9, G - 6, tx - 20 + i * 9 + Math.sin(i + st * 6) * 3, G - 1, 2.4, 2, MT.CHD);
    pEll(c, tx - 8, G - 18, 6, 5, MT.CH); pEll(c, tx + 9, G - 16, 7, 6, MT.CH);
    paintHead(c, sp.head || 'skull', tx + 4, G - 30, sp.hs || 1.1, sp.ho || {});
    arm(tx + 12, G - 18, ar, 16, 2.6, sp.weap || 'claw');
  } else if (body === 'wyrm') { // a dragon whelp of the old war-engines
    const tx = 34 + lean, ty = G - 30 + Math.sin(st * 6.28) * 2;
    pPoly(c, [[tx - 2, ty - 4], [tx - 24, ty - 22 + st * 6], [tx - 16, ty - 6], [tx - 28, ty - 2], [tx - 6, ty + 4]], MT.AC);
    pCap(c, tx - 8, ty + 6, tx - 26, ty + 16, 5, 1.5, MT.CH); pEll(c, tx, ty + 4, 11, 8, MT.CH);
    pCap(c, tx + 6, ty, tx + 12, ty - 10, 4.5, 3.5, MT.CH);
    pCap(c, tx + 12, ty - 12, tx + 22, ty - 10, 4.5, 2.6, MT.CH); pCap(c, tx + 10, ty - 15, tx + 4, ty - 21, 1.6, .4, MT.CHD);
    pRect(c, tx + 13, ty - 14, 3, 1.4, MT.GL); pRect(c, tx - 6, ty + 2, 12, 1, MT.GL);
    pCap(c, tx - 3, ty + 10, tx - 4, G - 2, 2.4, 2, MT.CHD); pCap(c, tx + 5, ty + 10, tx + 6, G - 2, 2.6, 2, MT.CH);
  } else if (body === 'dragon') { // the WARDRAGON (boss canvas)
    const tx = 64, ty = G - 60;
    pPoly(c, [[tx - 10, ty - 10], [tx - 60, ty - 48 + st * 8], [tx - 44, ty - 14], [tx - 66, ty - 4], [tx - 18, ty + 12]], MT.AC);
    pPoly(c, [[tx - 14, ty - 6], [tx - 46, ty - 30 + st * 8], [tx - 36, ty - 8]], MT.CHD, 0);
    pCap(c, tx - 20, ty + 20, tx - 60, ty + 44, 12, 3, MT.CH);
    for (const lx of [-16, 20]) { pCap(c, tx + lx, ty + 24, tx + lx + 4, G - 2, 7, 5, lx < 0 ? MT.CHD : MT.CH); pRect(c, tx + lx - 4, G - 4, 14, 4, MT.DK); }
    pEll(c, tx, ty + 14, 30, 20, MT.CH);
    for (let i = 0; i < 4; i++) pRect(c, tx - 20 + i * 12, ty + 8, 8, 2, MT.GL);
    pCap(c, tx + 20, ty + 4, tx + 30, ty - 24, 10, 7, MT.CH);
    pCap(c, tx + 30, ty - 28, tx + 52, ty - 22 + (pose.wind || 0) * 6, 9, 5, MT.CH); // head
    pCap(c, tx + 26, ty - 34, tx + 14, ty - 50, 2.6, .5, MT.CHD); pCap(c, tx + 32, ty - 34, tx + 30, ty - 52, 2.4, .5, MT.CHD);
    pRect(c, tx + 36, ty - 31, 8, 3, MT.GL); pRect(c, tx + 40, ty - 30, 3, 1, MT.GLC);
    // the four old factions welded into its chest: a screen, a pink cable braid, a ghost-light, an eye
    pRect(c, tx - 6, ty + 18, 10, 8, MT.DK); pRect(c, tx - 4, ty + 20, 2, 1.5, MT.GL); pRect(c, tx + 0, ty + 20, 2, 1.5, MT.GL); pRect(c, tx - 4, ty + 23, 6, 1, MT.GL);
    pCap(c, tx + 10, ty + 10, tx + 20, ty + 30, 2.2, 2.2, MT.ACL, 0);
    pEll(c, tx - 18, ty + 20, 4, 4, MT.CL, 0); pEll(c, tx + 18, ty + 6, 4, 4, MT.GLC, 0);
  } else if (body === 'throne') { // the Curator: an archive that learned to pray
    const tx = 48, ty = G - 52;
    pPoly(c, [[tx - 26, G], [tx + 26, G], [tx + 18, ty], [tx - 18, ty]], MT.CHD);
    for (let i = 0; i < 6; i++) pCap(c, tx - 22 + i * 9, G - 2, tx - 16 + i * 7, ty + 4, 1.2, 1.2, MT.AC, 0);
    pPoly(c, [[tx - 14, G - 4], [tx + 14, G - 4], [tx + 8, ty - 4], [tx - 8, ty - 4]], MT.CH);
    pEll(c, tx, ty - 6, 10, 6, MT.CH);
    paintHead(c, sp.head || 'eye', tx + 2, ty - 18, 1.5, {});
    arm(tx + 8, ty - 4, ar, 22, 3, sp.weap || 'staff');
    for (let i = 0; i < 5; i++) pRect(c, tx - 10 + i * 4, ty + 10 + (i % 2) * 6, 2, 8, MT.GL);
  }
}

// ---------- battle sprites (cached by spec + pose) ----------
const SPRC = {}, BK = 1.4; // battle sprites paint at 1.4x: vector rigs rasterize clean at any scale
const POSES = { idle: { arm: -1.1 }, idle2: { arm: -1.15, step: .25 }, wind: { arm: -2.4, lean: -3, wind: 1 }, strike: { arm: .5, lean: 5 }, hurt: { arm: -1.6, lean: -4 }, cast: { arm: -2.0, lean: -1 }, run: { arm: -1, step: .5 } };
function bSprite(sp, pose) {
  const k = sp.key + '|' + pose; if (SPRC[k]) return SPRC[k];
  const big = sp.body === 'dragon' ? [150, 110] : sp.body === 'throne' ? [100, 96] : [84, 84];
  const c = P8(big[0], big[1], BK); paintRig(c, sp, POSES[pose] || POSES.idle);
  return (SPRC[k] = resolveP(c, sp.body === 'drone' ? s => { for (let y = 1; y < s.h; y += 3) for (let x = 0; x < s.w; x++) if (s.d[y * s.w + x] >= 8 && s.d[y * s.w + x] <= 12) s.d[y * s.w + x] = 0; } : null));
}

// ---------- map sprites: 24x24 chibi (32x32 for the giants), 2-frame march ----------
// They stand on their 16px tile and overhang upward, like the old carts. Big heads carry the identity.
// Shapes are painted as materials (no per-part ink), then detail pixels go on, then one outline.
function chibiHead(c, D, kind, hx, hy) {
  switch (kind) {
    case 'helm': case 'visor': case 'horn':
      if (kind !== 'horn') pCap(c, hx - 2, hy - 4, hx - 6, hy - 6.5, 1.3, .7, MT.AC, 0);
      else { pCap(c, hx - 2, hy - 3, hx - 4, hy - 8, 1, .4, MT.CH, 0); pCap(c, hx + 2, hy - 3, hx + 3, hy - 8, 1, .4, MT.CH, 0); }
      pEll(c, hx, hy, 4.3, 4.3, MT.CH, 0); pRect(c, hx - 3, hy + 1.5, 7.5, 2.5, MT.CH);
      if (kind === 'visor') { for (let x = hx - 2; x <= hx + 4; x++) { D(x, hy - 1, 14); D(x, hy, 14); } D(hx + 2, hy - 1, 13); D(hx + 3, hy - 1, 13); }
      else { for (let x = hx; x <= hx + 4; x++) D(x, hy, 14); D(hx + 2, hy, 13); for (let x = hx; x <= hx + 3; x++) D(x, hy - 1, 5); }
      break;
    case 'crt':
      pRect(c, hx - 4.5, hy - 4, 10, 8.5, MT.CH);
      for (let y = hy - 2; y <= hy + 2; y++) for (let x = hx - 3; x <= hx + 3; x++) D(x, y, 15);
      D(hx - 1, hy - 1, 14); D(hx + 2, hy - 1, 14); D(hx - 1, hy + 1, 14); D(hx, hy + 2, 14); D(hx + 1, hy + 2, 14); D(hx + 2, hy + 1, 14);
      D(hx + 3, hy - 5, 4); D(hx + 4, hy - 6, 14);
      break;
    case 'pony': case 'skull':
      pCap(c, hx - 2, hy - 3, hx - 7, hy - 7, 1.8, 1, MT.AC, 0); pCap(c, hx - 7, hy - 7, hx - 8, hy - 3, 1, .6, MT.AC, 0);
      if (kind === 'pony') { pEll(c, hx - .5, hy, 4.3, 4.4, MT.AC, 0); pEll(c, hx + 1.2, hy + .7, 3.2, 3.6, MT.SK, 0); pRect(c, hx - 2, hy - 4.5, 5.5, 2, MT.AC); D(hx + 2, hy, 15); D(hx + 2, hy - 1, 14); D(hx + 3, hy + 2, 10); }
      else { pEll(c, hx, hy, 4, 4.3, MT.SK, 0); D(hx + 1, hy - 1, 15); D(hx + 2, hy - 1, 14); D(hx - 1, hy - 1, 15); for (let x = hx - 1; x <= hx + 2; x += 2) D(x, hy + 2, 15); }
      break;
    case 'sheet':
      pEll(c, hx, hy - .5, 4.6, 4.6, MT.CL, 0); pPoly(c, [[hx - 4.6, hy - .5], [hx + 4.6, hy - .5], [hx + 5.5, hy + 6], [hx + 2, hy + 5], [hx, hy + 7], [hx - 3, hy + 5], [hx - 5, hy + 6.5]], MT.CL, 0);
      for (let x = hx - 1; x <= hx + 4; x++) { D(x, hy - 1, 15); D(x, hy, 15); } D(hx, hy - 1, 13); D(hx + 3, hy - 1, 13);
      break;
    case 'alien':
      pEll(c, hx, hy + .5, 5.2, 4.8, MT.SK, 0); pEll(c, hx - 1, hy - 3, 4.6, 2.3, MT.AC, 0); pRect(c, hx - 7, hy - 3, 3, 1.3, MT.ACD);
      for (const ex of [hx, hx + 3]) { for (let y = hy - 1; y <= hy + 1; y++) { D(ex, y, 15); D(ex + 1, y, 15); } D(ex, hy - 1, 2); }
      D(hx - 1, hy + 5, 14); D(hx + 1, hy + 5, 14); D(hx, hy + 5, 13);
      break;
    case 'holo':
      pCap(c, hx - 2, hy, hx - 3, hy + 6, 2.6, 1.8, MT.AC, 0); pEll(c, hx, hy - .5, 4.3, 4.3, MT.AC, 0); pEll(c, hx + 1.3, hy + .7, 3, 3.5, MT.SK, 0); pRect(c, hx - 2, hy - 4.5, 6, 2, MT.AC);
      D(hx + 2, hy, 15); D(hx + 2, hy - 1, 2); D(hx + 3, hy + 2, 12); D(hx - 1, hy + 1, 14);
      break;
    case 'speaker': case 'eye':
      pEll(c, hx, hy, 4.5, 4.5, MT.CH, 0);
      for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) { const r = x * x + y * y; if (r <= 6) D(hx + 1 + x, hy + y, kind === 'eye' ? (r <= 2 ? 14 : 15) : r <= 1 ? 14 : r <= 3 ? 4 : 15); }
      D(hx + 2, hy - 1, 13);
      break;
  }
}
function chibiWeapon(c, D, kind, wx, wy) {
  switch (kind) {
    case 'saber': pCap(c, wx + 1, wy - 1, wx + 5, wy - 9, 1, .8, MT.GL, 0); for (let i = 1; i <= 7; i++) D(wx + 1 + i * .5, wy - 1 - i, 13); D(wx, wy, 15); D(wx - 1, wy + 1, 15); break;
    case 'lance': pCap(c, wx - 4, wy + 4, wx + 5, wy - 7, .6, .6, MT.CHD, 0); pCap(c, wx + 5, wy - 7, wx + 8, wy - 11, 1.3, .2, MT.GL, 0); D(wx + 6, wy - 9, 13); break;
    case 'staff': pCap(c, wx, wy + 6, wx + 1, wy - 7, .6, .6, MT.CHD, 0); pEll(c, wx + 1, wy - 8, 1.7, 1.7, MT.GL, 0); D(wx + 1, wy - 8, 13); break;
    case 'rail': pCap(c, wx - 3, wy + 1, wx + 7, wy - 1, 1.1, .8, MT.CH, 0); D(wx + 7, wy - 1, 14); D(wx + 8, wy - 1, 13); break;
    case 'gun': pCap(c, wx - 2, wy, wx + 6, wy, 1.6, 1.4, MT.CH, 0); D(wx + 6, wy, 15); D(wx + 7, wy, 14); break;
    case 'axe': pCap(c, wx - 1, wy + 4, wx + 2, wy - 7, .6, .6, MT.CHD, 0); pPoly(c, [[wx + 1, wy - 9], [wx + 6, wy - 8], [wx + 5, wy - 3], [wx + 1, wy - 4]], MT.CH, 0); for (let y = wy - 8; y <= wy - 4; y++) D(wx + 5, y, 14); break;
    case 'claw': for (const k of [-1, 0, 1]) for (let i = 1; i <= 3; i++) D(wx + i, wy + k * 1.5 - i * .3, 14); D(wx + 3, wy - 1, 13); break;
  }
}
function wyrmShape(c, D, f, s, chest) {
  const P = (x, y) => [x * s, y * s];
  pPoly(c, [P(10, 12), P(3, 3 + f * 2), P(5, 10), P(1, 13), P(10, 16)], MT.AC, 0);
  pCap(c, ...P(7, 17), ...P(2, 20), 1.8 * s, .6 * s, MT.CH, 0);
  pCap(c, ...P(10, 18), ...P(10, 22.5), .9 * s, .8 * s, MT.CHD, 0); pCap(c, ...P(13, 18), ...P(13, 22.5), 1 * s, .9 * s, MT.CH, 0);
  pEll(c, ...P(11, 16), 5 * s, 3.5 * s, MT.CH, 0);
  pCap(c, ...P(14, 14), ...P(16, 9), 1.9 * s, 1.6 * s, MT.CH, 0); pCap(c, ...P(16, 8), ...P(21, 9), 2.1 * s, 1.2 * s, MT.CH, 0);
  pCap(c, ...P(16, 7), ...P(13, 3), .7 * s, .3 * s, MT.CHD, 0);
  const [ex, ey] = P(18, 8); D(ex, ey, 14); D(ex + 1, ey, 13);
  if (chest) { const [cx, cy] = P(10, 15); for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) D(cx + x, cy + y, 15); D(cx, cy, 14); D(cx + 2, cy, 14); D(cx + 1, cy + 2, 14); }
}
function mSprite(sp, f) {
  const k = sp.key + '|M' + f; if (SPRC[k]) return SPRC[k];
  const b = sp.body, S = b === 'dragon' || b === 'throne' ? 32 : 24, OY = b === 'cent' ? 3 : 0, c = P8(S, S + OY, 1, OY), dots = [], D = (x, y, i) => dots.push([Math.round(x), Math.round(y) + OY, i]);
  const up = f ? -1 : 0, lp = f ? 1 : -1; // upper-body bob, leg phase
  let hand = null, head = null;
  if (b === 'cent') {
    pCap(c, 3, 14, 1, 19, 1.3, .6, MT.AC, 0);
    for (const [x, p, m] of [[6, 1, MT.CHD], [14, 0, MT.CHD], [4, 0, MT.CH], [12, 1, MT.CH]]) { const d = (p ? lp : -lp) * .8; pCap(c, x, 17, x + d, 22.4, .9, .8, m, 0); D(x + d, 23, 15); }
    pEll(c, 9.5, 15.5, 7, 3.4, MT.CH, 0); pRect(c, 6, 15, 6, 1, MT.ACD);
    pPoly(c, [[13, 7 + up], [6, 12], [4, 15], [11, 13.5]], MT.AC, 0);
    pCap(c, 14, 14, 15, 7.5 + up, 2.8, 2.4, MT.CH, 0); pRect(c, 13, 11 + up, 4, 1, MT.ACD); D(15, 9 + up, 14);
    pEll(c, 13.5, 7 + up, 2, 1.5, MT.CH, 0); pEll(c, 16.5, 7 + up, 2.2, 1.6, MT.CH, 0);
    pCap(c, 17, 8 + up, 19, 10 + up, .9, .8, MT.CH, 0);
    hand = [19.5, 9.5 + up]; head = [15.5, 2.5 + up];
  } else if (b === 'bip' || b === 'heavy' || b === 'bird') {
    const h = b === 'heavy';
    if (b === 'bird') { pPoly(c, [[10, 10 + up], [2, 3 + f * 2], [4, 10], [1, 14], [10, 14 + up]], MT.AC, 0); D(9, 18, 14); D(9, 19, 13); }
    pCap(c, 10, 17, 10 - lp, 22.4, h ? 1.5 : 1.1, 1, MT.CHD, 0); D(10 - lp, 23, 15); D(11 - lp, 23, 15);
    pCap(c, 10.5, 12 + up, 8.5, 15 + up, .9, .8, MT.CHD, 0);
    pCap(c, 13, 17, 13 + lp, 22.4, h ? 1.6 : 1.2, 1.1, MT.CH, 0); D(13 + lp, 23, 15); D(14 + lp, 23, 15);
    pCap(c, 11.5, 16, 11.5, 11 + up, h ? 3.6 : 2.7, h ? 3.8 : 2.9, MT.CH, 0);
    pRect(c, 11, 13 + up, 2, 4, MT.AC); pRect(c, h ? 8 : 9, 15.5, h ? 8 : 6, 1, MT.ACD); D(12, 12 + up, 14);
    pEll(c, 9.5, 10.5 + up, h ? 2.4 : 1.8, 1.5, MT.CH, 0); pEll(c, 13.5, 10.5 + up, h ? 2.4 : 1.8, 1.5, MT.CH, 0);
    pCap(c, 14, 11 + up, 16, 12.5 + up, .9, .8, MT.CH, 0);
    hand = [16.5, 12 + up]; head = [12, 5.5 + up];
  } else if (b === 'tiny') {
    pPoly(c, [[3, 19], [20, 19], [22, 21.5], [5, 21.5]], MT.CH, 0); for (let x = 6; x <= 18; x += 2) D(x, 23, (x + f * 2) % 4 ? 14 : 13);
    pCap(c, 11, 18, 11, 15 + up, 2, 2, MT.AC, 0);
    hand = [14, 16 + up]; head = [12, 9 + up];
  } else if (b === 'walker') {
    pCap(c, 8, 17, 8 - lp, 22.4, 1.2, 1.1, MT.CHD, 0); pCap(c, 15, 17, 15 + lp, 22.4, 1.3, 1.2, MT.CH, 0); D(8 - lp, 23, 15); D(15 + lp, 23, 15);
    pRect(c, 6, 10 + up, 12, 8, MT.CH); for (const x of [8, 15]) { D(x, 14 + up, 15); D(x, 15 + up, 14); }
    hand = [18, 12 + up]; head = [12, 5.5 + up];
  } else if (b === 'drone') {
    pEll(c, 12, 21, 6, 1.8, MT.CH, 0); for (let x = 10; x <= 14; x++) D(x, 23, f ? 13 : 14);
    pPoly(c, [[9, 20], [15, 20], [14, 14 + up], [10, 14 + up]], MT.ACL, 0); pCap(c, 12, 15 + up, 12, 11 + up, 2.4, 2.4, MT.AC, 0);
    hand = [15, 13 + up]; head = [12.5, 6 + up];
  } else if (b === 'beast') {
    for (const [x, p, m] of [[7, 1, MT.CHD], [16, 0, MT.CHD], [5, 0, MT.CH], [14, 1, MT.CH]]) { const d = (p ? lp : -lp) * .8; pCap(c, x, 16, x + d, 22.4, .9, .8, m, 0); D(x + d, 23, 15); }
    pCap(c, 4, 14, 1, 10, 1, .5, MT.AC, 0);
    pEll(c, 10.5, 15 + up * .5, 7, 3, MT.CH, 0); D(9, 14, 14); D(11, 14, 14);
    if (sp.head === 'eye') chibiHead(c, D, 'eye', 18.5, 12 + up);
    else { pPoly(c, [[16, 11 + up], [17, 6 + up], [19, 10 + up]], MT.CH, 0); pEll(c, 18, 12 + up, 3.3, 3, MT.CH, 0); pCap(c, 19, 13 + up, 23, 14 + up, 1.6, 1, MT.CH, 0); D(19, 11 + up, 14); D(23, 14 + up, 15); }
  } else if (b === 'tank') {
    pCap(c, 3, 20, 20, 20, 2.6, 2.6, MT.CHD, 0); for (let x = 4; x <= 19; x += 4) D(x + (f ? 2 : 0), 20, 15);
    pPoly(c, [[3, 17.5], [20, 17.5], [18, 13], [5, 13]], MT.CH, 0); for (let x = 6; x <= 16; x++) D(x, 15, x % 2 ? 14 : 15);
    pEll(c, 11, 11.5, 4.6, 2.7, MT.CH, 0); pCap(c, 14, 11, 22.5, 10 + up * .5, 1, .9, MT.CH, 0); D(23, 10, 14);
    D(10, 9, 14); D(11, 9, 13);
  } else if (b === 'blob') {
    pEll(c, 11, 18.5, 9, 4.6, MT.SK, 0); pEll(c, 6, 17, 2.6, 2, MT.CH, 0); pEll(c, 16, 18, 3, 2.2, MT.CH, 0);
    for (let x = 4; x <= 18; x += 3) D(x + (f ? 1 : 0), 23, 15);
    pCap(c, 17, 16, 20, 12 + up, 1.1, .9, MT.SK, 0); hand = [20, 12 + up]; head = [12, 10 + up];
  } else if (b === 'wyrm') wyrmShape(c, D, f, 1);
  else if (b === 'dragon') wyrmShape(c, D, f, 1.36, 1);
  else if (b === 'throne') {
    pPoly(c, [[4, 31], [28, 31], [24, 15], [8, 15]], MT.CHD, 0); for (let i = 0; i < 5; i++) pCap(c, 7 + i * 4.5, 30, 10 + i * 3, 17, .6, .6, MT.AC, 0);
    pPoly(c, [[9, 29], [23, 29], [20, 14 + up], [12, 14 + up]], MT.CH, 0); for (let i = 0; i < 4; i++) D(12 + i * 3, 20 + (i % 2) * 3, 14);
    pCap(c, 20, 16 + up, 24, 15 + up, 1, .9, MT.CH, 0);
    chibiHead(c, D, 'eye', 16, 9 + up); chibiWeapon(c, D, 'staff', 25, 15 + up);
  }
  if (head) chibiHead(c, D, sp.head, head[0], head[1]);
  if (hand) { chibiWeapon(c, D, sp.weap, hand[0], hand[1]); pEll(c, hand[0], hand[1], 1, 1, MT.AC, 0); }
  return (SPRC[k] = resolveP(c, s => { for (const [x, y, i] of dots) if (x >= 0 && y >= 0 && x < s.w && y < s.h) s.d[y * s.w + x] = i; }));
}
// draw a map sprite with its feet on the 16px tile at (px, py)
function drawUnit(s, px, py, P, flip) { draw(s, px - ((s.w - 16) >> 1), py + 16 - s.h, P, flip); }

// ---------- portraits 48x48 ----------
function portraitOf(sp, mood) {
  const k = sp.key + '|p' + (mood || 0); if (SPRC[k]) return SPRC[k];
  const c = P8(48, 48), hk = sp.head;
  // shoulders: chrome pauldrons + accent gorget, then the head big
  pEll(c, 24, 52, 26, 14, MT.CH); pPoly(c, [[14, 40], [34, 40], [30, 48], [18, 48]], MT.AC, 1); pRect(c, 21, 43, 6, 3, MT.GL);
  pEll(c, 6, 42, 9, 7, MT.CH); pEll(c, 43, 42, 9, 7, MT.CH);
  const s = hk === 'alien' ? 3 : hk === 'sheet' ? 2.8 : hk === 'dragonhead' ? 3 : 3.1;
  paintHead(c, hk, hk === 'pony' || hk === 'holo' ? 22 : 23, hk === 'alien' ? 21 : 20, s, Object.assign({}, sp.ho, { mood }));
  return (SPRC[k] = resolveP(c));
}
function portraitBG(seed) { // starfield / burning sky behind every portrait
  return spr(48, 48, g => { for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) g.p(x, y, y < 30 ? (((x * 7 + y * 13 + seed) % 53) === 0 ? 3 : 1) : y < 34 ? 4 : 2); });
}

// ---------- terrain tiles 16x16 ----------
// codes: . waste  , scrub  f forest-of-pylons  h hill  M cliff  ~ toxic water  = road  r rubble  g glass  _ deck  # wall
//        s ash  b bridge  o bones  l embers  t titan-rib  c chest(on '.')  ^ gate  d door  w window wall  * crystal
const TILEPAL = {
  waste: pal('#6d4924', '#924924', '#b66d49', '#492400', '#dbb66d', '#4f6d24', '#244924', '#92926d', '#242424', '#000000', '#6d6d6d', '#2449b6', '#24b6db', '#b6dbff', '#ff9224'),
  glass: pal('#24496d', '#49926d', '#92dbb6', '#002424', '#dbffff', '#496d49', '#244924', '#9292b6', '#242449', '#000000', '#6d6d92', '#2449b6', '#49dbff', '#ffffff', '#ff49db'),
  ash: pal('#494949', '#6d6d6d', '#929292', '#242424', '#b6b6b6', '#49496d', '#242449', '#6d6d92', '#242424', '#000000', '#494949', '#490024', '#ff2449', '#ffb6b6', '#ff6d00'),
  flesh: pal('#6d2449', '#922449', '#b64992', '#240024', '#ffb6db', '#6d4949', '#492424', '#dbb6b6', '#242424', '#000000', '#6d4949', '#922400', '#ff2492', '#ffdbff', '#ff9249'),
  grid: pal('#244949', '#246d6d', '#49b6b6', '#002424', '#dbffff', '#24926d', '#004924', '#b6dbdb', '#242449', '#000000', '#6d9292', '#2449b6', '#24ffdb', '#ffffff', '#ffdb24'),
  iron: pal('#492424', '#6d2424', '#924949', '#240000', '#db9292', '#4f4924', '#242400', '#929292', '#242424', '#000000', '#6d6d6d', '#490000', '#ff2400', '#ffb692', '#ff6d00'),
  void: pal('#240049', '#490092', '#6d24b6', '#000024', '#db92ff', '#244949', '#002424', '#9292db', '#242449', '#000000', '#49496d', '#002449', '#24ffdb', '#ffffff', '#ff24db'),
};
const hsh = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function tileSprite(code, x, y) {
  return spr(16, 16, g => {
    const n = (i, j) => hsh(x * 16 + i, y * 16 + j);
    const ground = (a, b, c) => g.each((i, j) => { const X = x * 16 + i, Y = y * 16 + j, v = n(i, j), blob = Math.sin(X * .21 + Math.sin(Y * .15) * 2) + Math.sin(Y * .27 + Math.sin(X * .12) * 2); return v < .03 ? c : blob + v * 1.1 > 1.25 ? b : a; });
    switch (code) {
      case '.': case 'c': ground(1, 2, 3); if (n(3, 3) < .3) { g.p(4 + (n(1, 1) * 8 | 0), 6 + (n(2, 2) * 6 | 0), 5); g.p(5 + (n(1, 1) * 8 | 0), 6 + (n(2, 2) * 6 | 0), 4); } break;
      case ',': ground(1, 2, 3); for (let k = 0; k < 7; k++) { const i = n(k, 9) * 15 | 0, j = n(9, k) * 13 + 2 | 0; g.p(i, j, 6); g.p(i, j - 1, 6); g.p(i + 1, j - 2, 7); } break;
      case 's': g.each((i, j) => ((i + (j >> 2) * 3 + (n(0, j) * 4 | 0)) % 8 < 2) ? 3 : n(i, j) < .5 ? 2 : 1); break;
      case 'f': ground(1, 2, 3); g.r(6, 3, 3, 12, 9); g.r(7, 3, 1, 12, 11); g.r(2, 4, 12, 1, 9); g.r(3, 8, 10, 1, 9); g.line(2, 5, 7, 14, 9); g.line(13, 5, 8, 14, 9); g.p(2, 3, 15); g.p(13, 3, 15); g.p(7, 1, 15); g.p(7, 2, 9); break;
      case 'h': ground(1, 2, 3); g.e(8.5, 11, 8, 5.5, 4); g.e(8, 10.5, 7.5, 5, 2); g.e(6.5, 9, 5, 3.4, 3); g.e(5.5, 8, 2.5, 1.4, 5); g.e(13, 13, 3, 1.5, 4); break;
      case 'M': g.r(0, 0, 16, 16, 11); g.each((i, j) => ((j + (i >> 2) * 2 + x * 3) % 5 === 0) ? 9 : (i + j * .3 < 5 ? 8 : 0)); g.line(4 + (x & 3), 0, 2 + (x & 3), 15, 9); g.line(11, 0, 13, 15, 10); g.r(0, 0, 16, 1, 8); break;
      case '~': g.each((i, j) => ((i + j * 2 + ((x + y) & 3) * 4) % 9 < 1) ? 14 : ((i * 3 + j) % 7 < 1) ? 13 : 12); break;
      case '=': g.r(0, 0, 16, 16, 11); g.each((i, j) => n(i, j) < .08 ? 9 : n(i, j) < .3 ? 8 : 0); if (((x + y) & 1) === 0) g.r(6, 7, 4, 2, 5); break;
      case 'r': ground(1, 2, 3); g.r(2, 7, 6, 5, 11); g.r(2, 7, 6, 1, 8); g.r(9, 3, 5, 4, 8); g.r(9, 3, 5, 1, 11); g.line(4, 12, 13, 13, 9); g.p(12, 9, 15); g.r(3, 2, 1, 5, 9); break;
      case 'g': g.each((i, j) => ((i - j + 32 + (n(0, 0) * 8 | 0)) % 11 < 1) ? 14 : ((i + j) % 13 < 1) ? 13 : n(i >> 2, j >> 2) < .5 ? 12 : 11); break;
      case '_': g.r(0, 0, 16, 16, 8); g.r(0, 0, 16, 1, 11); g.r(0, 0, 1, 16, 11); g.p(2, 2, 13); g.p(13, 13, 13); if (((x ^ y) & 3) === 0) g.r(6, 6, 4, 4, 9); break;
      case '#R': case 'wR': g.r(0, 0, 16, 16, 8); g.r(0, 0, 16, 5, 9); g.r(0, 0, 16, 1, 11); g.r(0, 5, 16, 1, 10); for (let i = 1; i < 16; i += 3) g.p(i, 2, 11); g.r(3, 8, 1, 8, 9); g.r(11, 8, 1, 8, 9); g.r(0, 11, 16, 1, 9);
        if (code === 'wR') { g.r(4, 8, 8, 5, 9); g.r(5, 9, 6, 3, (x + y) % 3 ? 15 : 13); } break;
      case '#': case 'w': g.r(0, 0, 16, 16, 8); g.r(0, 0, 16, 2, 11); g.r(0, 7, 16, 1, 9); g.r(7, 2, 1, 5, 9); g.r(3, 8, 1, 8, 9); g.r(11, 8, 1, 8, 9); if (code === 'w') { g.r(4, 9, 8, 5, 9); g.r(5, 10, 6, 3, (x + y) % 3 ? 15 : 13); } break;
      case 'b': g.r(0, 0, 16, 16, 12); g.r(0, 2, 16, 12, 9); for (let i = 0; i < 16; i += 4) g.r(i, 2, 1, 12, 8); g.r(0, 2, 16, 1, 11); g.r(0, 13, 16, 1, 3); break;
      case 'o': ground(1, 2, 3); g.e(5, 9, 3, 2.5, 4); g.r(4, 9, 1, 1, 3); g.r(6, 9, 1, 1, 3); g.line(9, 12, 14, 7, 4); g.line(10, 13, 14, 9, 4); g.p(14, 7, 13); break;
      case 'l': g.each((i, j) => { const v = n(i, j); return v < .15 ? 15 : v < .3 ? 14 : v < .7 ? 3 : 9; }); break;
      case 't': ground(1, 2, 3); g.e(8, 18, 9, 16, 8); g.e(8, 18, 6, 13, 0); g.each((i, j) => g.get(i, j) === 0 && j < 16 ? (n(i, j) < .5 ? 1 : 2) : 0); g.r(1, 6, 2, 10, 11); break;
      case '^': g.r(0, 0, 16, 16, 9); g.r(2, 0, 12, 16, 8); g.r(4, 2, 8, 14, 15); g.r(5, 3, 6, 13, 14); g.r(7, 4, 2, 12, 13); break;
      case 'd': g.r(0, 0, 16, 16, 8); g.r(0, 0, 16, 2, 11); g.r(3, 4, 10, 12, 9); g.r(4, 5, 8, 11, 3); g.r(10, 10, 1, 2, 14); break;
      case '*': ground(1, 2, 3); g.line(5, 14, 7, 3, 13); g.line(6, 14, 8, 4, 12); g.line(10, 14, 12, 6, 14); g.line(9, 14, 11, 7, 12); g.p(7, 3, 13); break;
      default: g.r(0, 0, 16, 16, 9);
    }
  });
}
const TILEC = {};
const isWallC = c => c === '#' || c === 'w' || c === 'd';
function tileAtMap(map, x, y, theme) { const c = map[y][x], up = y > 0 ? map[y - 1][x] : ' '; return tileFor((c === '#' || c === 'w') && !isWallC(up) ? c + 'R' : c, x, y, theme); }
function tileFor(code, x, y, theme) { const k = code + (hsh(x, y, 7) * 4 | 0) + theme; return TILEC[k] || (TILEC[k] = { s: tileSprite(code, (hsh(x, y, 7) * 4 | 0), 1), P: TILEPAL[theme] || TILEPAL.waste }); }

// chest sprite (on top of the tile)
const CHEST = spr(16, 16, g => { g.r(2, 6, 12, 8, 9); g.r(2, 6, 12, 2, 8); g.r(3, 9, 10, 4, 11); g.r(7, 8, 2, 3, 14); g.r(2, 13, 12, 1, 3); });
const CHEST_OPEN = spr(16, 16, g => { g.r(2, 9, 12, 5, 9); g.r(3, 10, 10, 3, 3); g.r(2, 4, 12, 3, 8); g.r(2, 13, 12, 1, 3); });

// ---------- menu icons (SF diamond menu): 24x24 ----------
const ICONPAL = pal('#000024', '#ffffff', '#b6dbff', '#4992db', '#002449', '#ff9249', '#24dbff', '#ffffff', '#ff2449', '#ffdb00', '#24ff6d', '#b624ff', '#6d2400');
const ICON = {
  attack: spr(24, 24, g => { g.line(4, 20, 18, 6, 6); g.line(5, 20, 19, 6, 6); g.line(6, 20, 20, 6, 7); g.line(3, 16, 8, 21, 3); g.line(3, 17, 7, 21, 2); g.r(2, 20, 3, 3, 4); }),
  magic: spr(24, 24, g => { g.line(5, 21, 15, 9, 3); g.line(6, 21, 16, 9, 3); g.e(17, 7, 5, 5, 11); g.e(17, 7, 3, 3, 7); for (const [x, y] of [[8, 4], [21, 15], [12, 2]]) { g.p(x, y, 9); g.p(x - 1, y, 9); g.p(x + 1, y, 9); g.p(x, y - 1, 9); g.p(x, y + 1, 9); } }),
  item: spr(24, 24, g => { g.r(4, 9, 16, 12, 12); g.r(5, 10, 14, 10, 5); g.r(4, 6, 16, 4, 3); g.r(5, 7, 14, 2, 2); g.r(10, 12, 4, 4, 9); g.r(11, 13, 2, 2, 1); }),
  stay: spr(24, 24, g => { g.e(12, 12, 9, 9, 3); g.e(12, 12, 7, 7, 4); g.r(11, 6, 2, 7, 10); g.r(11, 11, 6, 2, 10); g.e(12, 12, 1.5, 1.5, 1); }),
  search: spr(24, 24, g => { g.e(10, 10, 7, 7, 3); g.e(10, 10, 5, 5, 4); g.e(8, 8, 1.5, 1.5, 1); g.line(15, 15, 21, 21, 5); g.line(16, 15, 22, 21, 5); g.line(15, 16, 21, 22, 12); }),
};
