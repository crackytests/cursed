'use strict';
// ================= DARK MONDAY: the HUD. party panel, arrow pad, compass, message log =================
const PAD = { x: 10, y: 182, bw: 28, bh: 28 };
const PAD_KEYS = [['left', 'turn'], ['up', 'fwd'], ['right', 'turn'], ['sl', 'str'], ['down', 'back'], ['sr', 'str']];
const padRect = i => ({ x: PAD.x + (i % 3) * (PAD.bw + 3), y: PAD.y + ((i / 3) | 0) * (PAD.bh + 3), w: PAD.bw, h: PAD.bh });
const PX0 = 264, PY0 = 8, CW = 120, CH = 52;
const cellRect = i => ({ x: PX0 + (i % 2) * (CW + 4), y: PY0 + ((i / 2) | 0) * (CH + 2), w: CW, h: CH });

function drawArrow(cx, cy, kind, lit) { // little glyphs on the pad buttons
  const c = lit ? WHITE : UI.hi, k = kind;
  if (k === 'fwd') polyF([[cx, cy - 8], [cx + 7, cy + 4], [cx - 7, cy + 4]], c);
  else if (k === 'back') polyF([[cx, cy + 8], [cx + 7, cy - 4], [cx - 7, cy - 4]], c);
  else if (k === 'turnL') { polyF([[cx - 8, cy], [cx, cy - 7], [cx, cy + 7]], c); rectF(cx, cy - 2, 8, 4, c); }
  else if (k === 'turnR') { polyF([[cx + 8, cy], [cx, cy - 7], [cx, cy + 7]], c); rectF(cx - 8, cy - 2, 8, 4, c); }
  else if (k === 'strL') { polyF([[cx - 8, cy], [cx - 1, cy - 6], [cx - 1, cy + 6]], c); rectF(cx + 2, cy - 1, 6, 2, c); }
  else if (k === 'strR') { polyF([[cx + 8, cy], [cx + 1, cy - 6], [cx + 1, cy + 6]], c); rectF(cx - 8, cy - 1, 6, 2, c); }
}
function drawPad() {
  PAD_KEYS.forEach(([key], i) => { const r = padRect(i), lit = held[key] || MOUSE.pad === key; panel(r.x, r.y, r.w, r.h, lit ? hex('#2a4aa0') : null);
    drawArrow(r.x + r.w / 2, r.y + r.h / 2, [ 'turnL', 'fwd', 'turnR', 'strL', 'back', 'strR' ][i], lit); });
}
function drawCompass(dir) {
  const cx = 150, cy = 214, R = 22; panel(cx - 30, cy - 30, 60, 60);
  const pts = []; for (let i = 0; i < 24; i++) pts.push([cx + Math.cos(i / 24 * 6.283) * R, cy + Math.sin(i / 24 * 6.283) * R]); for (let i = 0; i < 24; i += 1) { const a = pts[i], b = pts[(i + 1) % 24]; lineF(a[0], a[1], b[0], b[1], UI.frame2); }
  const L = ['N', 'E', 'S', 'W'];
  for (let k = 0; k < 4; k++) { const a = (k - dir) * Math.PI / 2 - Math.PI / 2, x = cx + Math.cos(a) * 17, y = cy + Math.sin(a) * 17; text(L[k], (x - 2) | 0, (y - 3) | 0, k === dir ? UI.hi : UI.frame, null); }
  polyF([[cx, cy - 8], [cx + 4, cy + 3], [cx - 4, cy + 3]], UI.hi);
}
function bar(x, y, w, h, v, max, c0, c1) { rectF(x, y, w, h, hex('#14081c')); const f = clamp(v / max, 0, 1); rectF(x, y, Math.round(w * f), h, mix(c0, c1, f)); frameR(x - 1, y - 1, w + 2, h + 2, UI.frame2); }
function drawMember(c, i, sel) {
  const r = cellRect(i); panel(r.x, r.y, r.w, r.h, sel ? hex('#2a2a70') : null);
  const sp = smallPort(c.id); blit(sp, r.x + 5, r.y + 4);
  if (c.dead) { rectA(r.x + 5, r.y + 4, 40, 47, hex('#200008'), .7); for (let y = r.y + 4; y < r.y + 50; y += 3) rectF(r.x + 5, y, 40, 1, BLACK); text('DOWN', r.x + 12, r.y + 24, hex('#ff3050')); }
  else if (c.hurt > 0) { rectA(r.x + 5, r.y + 4, 40, 47, hex('#ff2040'), .35); c.hurt--; }
  text(c.name, r.x + 50, r.y + 5, c.col);
  bar(r.x + 51, r.y + 16, 62, 5, c.hp, c.max, hex('#ff3050'), hex('#40ff80'));
  text(c.hp + '/' + c.max, r.x + 50, r.y + 24, hex('#a8b8ff')); if (c.spMax) text('SP' + c.sp, r.x + 88, r.y + 24, hex('#80e8ff'));
  if (c.poison > 0) text('PSN', r.x + 50, r.y + 30, hex('#9aff40')); if (c.hold > 0) text('HELD', r.x + 74, r.y + 30, hex('#ffb040'));
  bar(r.x + 51, r.y + 36, 62, 3, c.food, 100, hex('#a05020'), hex('#ffb040'));
  for (let h = 0; h < 2; h++) { const hx = r.x + 51 + h * 20, hy = r.y + 40; rectF(hx, hy, 16, 10, hex('#0a0820')); frameR(hx, hy, 16, 10, c.cool[h] > 0 ? UI.hi : UI.frame2);
    const hid = h === 0 ? (c.hands[0] || 'FISTS') : c.hands[1]; if (hid && ITEMS[hid] && !(hid === 'FISTS')) blit(smallIcon(hid), hx + 1, hy);
    if (c.cool[h] > 0) rectF(hx + 1, hy + 8, Math.round(14 * (1 - c.cool[h] / c.cmax[h])), 1, UI.hi); }
  text('L' + c.lvl, r.x + 98, r.y + 41, hex('#6a7cc8'));
}
function handAt() { for (let i = 0; i < PARTY.length; i++) { const r = cellRect(i); for (let h = 0; h < 2; h++) if (hit(r.x + 51 + h * 20, r.y + 40, 16, 10)) return [i, h]; } return null; }
function drawCursor() { if (!MOUSE.on) return; const x = MOUSE.x | 0, y = MOUSE.y | 0; polyF([[x, y], [x + 7, y + 6], [x + 3, y + 7], [x + 5, y + 12], [x + 3, y + 13], [x + 1, y + 8], [x - 1, y + 10]], BLACK); polyF([[x + 1, y + 2], [x + 5, y + 6], [x + 2, y + 6], [x + 4, y + 10], [x + 3, y + 10], [x + 1, y + 6]], UI.hi); }
function drawLog() {
  const x = 190, y = 178; panel(x, y, W - x - 6, 72);
  LOG.forEach((m, i) => { if (m.t > 0) m.t--; const a = m.t > 120 ? 1 : Math.max(.3, m.t / 120); text(m.s, x + 8, y + 7 + i * 12, mix(BLACK, m.c, a)); });
}
function drawHUD(g) {
  PARTY.forEach((c, i) => drawMember(c, i, i === (g.sel | 0)));
  for (let i = PARTY.length; i < 6; i++) { const r = cellRect(i); panel(r.x, r.y, r.w, r.h); text('EMPTY', r.x + 44, r.y + 22, hex('#3a4a88')); }
  drawPad(); drawCompass(g.dir); drawLog();
}
