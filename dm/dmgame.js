'use strict';
// ================= DARK MONDAY: party, messages, mouse =================
const CLASSES = {
  FIGHTER: { hp: 14, hit: 3, spd: 22 }, MAGE: { hp: 6, hit: 1, spd: 30 }, ROGUE: { hp: 9, hit: 2, spd: 18 }, CLERIC: { hp: 10, hit: 2, spd: 26 }, RANGER: { hp: 11, hit: 2, spd: 20 },
};
// base: hp at level 1. col: name-tag color
const ROSTER = {
  CARL:   { name: 'CARL',   cls: 'FIGHTER', base: 40, col: '#6dff9a', tag: 'DELIVERY DRIVER' },
  LINDA:  { name: 'LINDA',  cls: 'MAGE',    base: 20, col: '#ff78b4', tag: 'CEO' },
  GHOST:  { name: 'GHOST',  cls: 'ROGUE',   base: 18, col: '#e0e0ff', tag: 'SPOOKY' },
  JB:     { name: 'JB',     cls: 'RANGER',  base: 30, col: '#ffb258', tag: 'DETECTIVE' },
  FACE:   { name: 'FACE',   cls: 'CLERIC',  base: 26, col: '#70ff30', tag: 'ENGINEER' },
  YOKO:   { name: 'YOKO',   cls: 'MAGE',    base: 24, col: '#80e8ff', tag: 'ASSISTANT' },
  PEEKID: { name: 'PEE KID', cls: 'ROGUE',  base: 16, col: '#f6d8c0', tag: 'KID' },
  PILOTX: { name: 'PILOT X', cls: 'FIGHTER', base: 36, col: '#ff6070', tag: 'NO SPOILERS' },
};
const PARTY = []; // up to 6; slots 0,1 front, 2,3 back, 4,5 rear (recruits)
function mkChar(id) { const r = ROSTER[id]; return { id, name: r.name, cls: r.cls, col: hex(r.col), tag: r.tag, lvl: 1, xp: 0, hp: r.base, max: r.base, food: 100, hands: [START_GEAR[id] || null, null], cool: [0, 0], cmax: [40, 40], ac: 0, dead: 0, hurt: 0, eq: { head: null, neck: null, body: null, feet: null }, pack: new Array(PACK_N).fill(null), sp: 0, spMax: 0 }; }
function setParty(ids) { PARTY.length = 0; HELD = null; for (const id of ids) PARTY.push(mkChar(id)); PARTY.forEach(initCaster); PARTY.forEach((c, i) => { giveItem(c, 'RATION'); if (i === 0) { giveItem(c, 'LASAGNA'); giveItem(c, 'LASAGNA'); giveItem(c, 'PROP_PILLS'); } if (i === 1) giveItem(c, 'PROP_PILLS'); }); }

// ---------- message log ----------
const LOG = [];
function msg(s, c) { for (const l of wrapT(s, 50)) LOG.push({ s: l, c: c || UI.hi, t: 600 }); while (LOG.length > 5) LOG.shift(); }

// ---------- mouse ----------
const MOUSE = { x: 0, y: 0, down: 0, click: 0, rclick: 0, pad: null, on: 0, mv: 0 };
(() => {
  const cv = document.getElementById('c'); if (!cv || !cv.addEventListener) return;
  const pos = e => { if (typeof OPT !== 'undefined' && !OPT.mouse) return; MOUSE.mv = 1; const r = cv.getBoundingClientRect(); MOUSE.x = (e.clientX - r.left) / r.width * 512; MOUSE.y = (e.clientY - r.top) / r.height * 256; MOUSE.on = 1; anyKey = true; if (typeof audioInit === 'function') audioInit(); };
  cv.addEventListener('mousemove', pos);
  cv.addEventListener('mousedown', e => { pos(e); if (e.button === 2) { MOUSE.rclick = 1; } else { MOUSE.down = 1; MOUSE.click = 1; } e.preventDefault(); });
  addEventListener('mouseup', () => { MOUSE.down = 0; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
})();
// menus answer to the mouse too: hover to move the highlight, click to choose, right-click to cancel. a click also turns the page in dialogue and cards.
async function choose(opts, o = {}) {
  const rows = opts.map(s => wrapT(s, o.wrap || 30)), nR = rows.reduce((n, r) => n + r.length, 0);
  const w = Math.min(W - 8, Math.max(...rows.flat().map(s => s.length)) * 6 + 30), h = nR * 12 + 12;
  const m = { opts, rows, i: o.start || 0, x: o.x !== undefined ? o.x : W - w - 8, y: o.y !== undefined ? o.y : VH - h - 6, w, h, title: o.title };
  MENUS.push(m); await nextFrame();
  const out = i => { MENUS.splice(MENUS.indexOf(m), 1); return i; };
  for (;;) {
    if (pressed.up) { m.i = (m.i + opts.length - 1) % opts.length; sfx('move'); }
    if (pressed.down) { m.i = (m.i + 1) % opts.length; sfx('move'); }
    if (MOUSE.on) { let r = 0; for (let i = 0; i < rows.length; i++) { const ry = m.y + 5 + r * 12; if (hit(m.x + 4, ry, m.w - 8, rows[i].length * 12)) { if (MOUSE.mv && m.i !== i) { m.i = i; sfx('move'); } if (MOUSE.click) { MOUSE.click = 0; m.i = i; sfx('ok'); return out(i); } } r += rows[i].length; }
      if (MOUSE.rclick && o.cancel) { MOUSE.rclick = 0; sfx('tick'); return out(-1); } MOUSE.rclick = 0; MOUSE.click = 0; }
    MOUSE.mv = 0;
    if (pressed.a) { sfx('ok'); break; }
    if (pressed.b && o.cancel) { m.i = -1; sfx('tick'); break; }
    await nextFrame(); }
  return out(m.i);
}
{ const _poll = pollInput; pollInput = function () { _poll(); if (MOUSE.click && (DLG || CARD) && !MENUS.length) { pressed.a = true; MOUSE.click = 0; } }; }
const hit = (x, y, w, h) => MOUSE.x >= x && MOUSE.x < x + w && MOUSE.y >= y && MOUSE.y < y + h;
