'use strict';
// ================= THE END: before the SUPER-16 (four shades), before anything (text), and the logo =================
const GB0 = GBPAL.slice();
function gbTone(t) { const T = t ? TONES[t].map(hex) : GB0; for (let i = 0; i < 4; i++) GBPAL[i] = T[i]; }
// the field, shrunk to a handheld screen
const _fieldDraw = fieldScene.draw;
fieldScene.draw = function () { _fieldDraw(); if (REV.gen1) { rectF(0, 0, W, 40, BLACK); rectF(0, 184, W, 40, BLACK); rectF(0, 40, 80, 144, BLACK); rectF(240, 40, 80, 144, BLACK); frameRect(79, 39, 162, 146, hex('#494949')); } };
const G1 = [
  { tone: 'dmg', who: 'carl', map: 'g1carl', label: 'CARL: ABOVE & BELOW NEVADA',
    lines: ['...IS THIS WHERE I LAND? IT LOOKS LIKE A PLACE YOU LAND.', 'CARL WALKED BACKWARD INTO HIS SHIP. THE SHIP UN-CRASHED, ROSE, AND WAS GONE. NEVADA WAS EMPTY. IT WAS ABOUT TO NOT BE.'] },
  { tone: 'pink', who: 'linda', map: 'g1linda', label: 'CEO LINDA',
    lines: ['CLOSING TIME. ...OPENING TIME. NO. IT HASN\'T OPENED YET.', 'LINDA TURNED THE LIGHTS OFF IN A MALL THAT DIDN\'T EXIST YET, AND WALKED OUT BACKWARD TO GO BE SOMEONE ELSE FIRST.'] },
  { tone: 'red', who: 'ghost', map: 'g1ghost', label: 'SPOOKY GHOST',
    lines: ['...AND WE\'RE OFF THE AIR. WE WERE NEVER ON. GOOD NIGHT. GOOD EVENING.', 'SPOOKY GHOST UN-HOSTED A SHOW NOBODY HAD WATCHED YET. THE CAMERA LIGHT WENT OUT.'] },
  { tone: 'gray', who: null, map: 'g1bin', label: 'A BARGAIN BIN',
    lines: ['A GRAY CARTRIDGE IN A BARGAIN BIN. THE LABEL SAYS SOMETHING ABOUT A TOWEL. NOBODY HAS PICKED IT UP YET. NOBODY KNOWS IT IS GOING TO MATTER.'] },
];
MAPS.g1carl = { name: 'BEFORE: FOUR SHADES', theme: 'sand', music: null, noTitle: 1, rows: (() => { const b = MB(14, 12, '.'); b.frame(0, 0, 14, 12, '^'); b.scatter('T', 5, 501, '.'); b.put(10, 4, '.'); return b.rows(); })(), exits: [] };
MAPS.g1linda = { name: 'BEFORE: FOUR SHADES', theme: 'inside', music: null, noTitle: 1, rows: ['##############', '#B.B.B.B.B.B.#', '#............#', '#.____..____.#', '#............#', '#............#', '#.t..t..t..t.#', '#............#', '#............#', '##############'], exits: [] };
MAPS.g1ghost = { name: 'BEFORE: FOUR SHADES', theme: 'opera', music: null, noTitle: 1, rows: ['##############', '#TTTTTTTTTTTT#', '#,,,,,,,,,,,,#', '#,,,,,,,,,,,,#', '#............#', '#..t......t..#', '#............#', '#............#', '##############'], exits: [] };
MAPS.g1bin = { name: 'BEFORE: FOUR SHADES', theme: 'inside', music: null, noTitle: 1, rows: ['##########', '#B.B..B.B#', '#........#', '#...oo...#', '#........#', '#........#', '##########'], exits: [] };
const G1SPOT = { g1carl: [10, 4], g1linda: [6, 2], g1ghost: [6, 3], g1bin: [4, 4] };
async function generationOne() {
  G.world = 1; post.legacy = 1; LEGACY_AUDIO = true; music(null);
  await showCard(['BEFORE THE SUPER-16,', 'THERE WERE FOUR SHADES.'], 180, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  G.flags.g1 = 0; await g1Next();
}
async function g1Next() {
  const k = G.flags.g1 || 0, g = G1[k];
  if (!g) { REV.gen1 = null; post.legacy = 0; gbTone(null); await generationZero(); return; }
  gbTone(g.tone); REV.gen1 = g.tone;
  G.roster = {}; if (g.who) { addHero(g.who, 1); G.party = [g.who]; } else G.party = [];
  const [sx, sy] = G1SPOT[g.map];
  await goMap(g.map, 2, MAPS[g.map].rows.length - 3, 'u');
  PL.hide = !g.who;
  if (g.who === 'carl') addNpc({ x: sx, y: sy - 1, solid: false, draw: (n, x, y) => { const up = (G.flags.shipUp || 0); circF(x + 8, y + 4 - up, 12, hex('#6d6d6d')); circF(x + 8, y - up, 6, hex('#b6b6b6')); } });
  if (g.who === 'ghost') addNpc({ x: sx + 2, y: sy - 1, solid: true, draw: (n, x, y) => { rectF(x, y + 2, 12, 8, hex('#242424')); circF(x + 6, y + 6, 3, hex('#929292')); if ((frame >> 4) & 1) pset(x + 10, y + 3, WHITE); } });
  if (!g.who) { FIELD_LOCK++; try { await wait(30); for (const l of g.lines) await R(l, null); } finally { FIELD_LOCK--; } G.flags.g1 = k + 1; await fadeOut(.04); await g1Next(); return; }
  MAPS[g.map].steps = { [sx + ',' + sy]: async () => { MAPS[g.map].steps = {}; FIELD_LOCK++;
    try { await R(g.lines[0], HEROES[g.who].port); for (let i = 1; i < g.lines.length; i++) await R(g.lines[i], null);
      if (g.who === 'carl') { PL.hide = 1; for (let i = 0; i < 60; i++) { G.flags.shipUp = i; await nextFrame(); } G.flags.shipUp = 0; } }
    finally { FIELD_LOCK--; }
    G.flags.g1 = k + 1; await fadeOut(.04); await g1Next(); } };
  obj(g.label, g.map, sx, sy);
}
// before anything: just text
async function generationZero() {
  LEGACY_AUDIO = false; G.party = []; M = null; music(null);
  const prev = scene; const T = { lines: [], cursor: 0 };
  scene = { update() {}, draw() { cls(BLACK); T.lines.slice(-14).forEach((l, i) => text(l, 16, 16 + i * 12, WHITE, 0)); if ((frame >> 4) & 1) rectF(16, 16 + Math.min(14, T.lines.length) * 12, 6, 8, WHITE); } };
  const put = async (s) => { for (const l of wrapT(s, 48)) { T.lines.push(l); sfx('blip', [880, 0]); await wait(DBG.fast ? 2 : 18); } };
  await wait(60);
  await put('THERE IS NOTHING HERE YET.'); await put('');
  let waits = 0;
  for (;;) {
    const c = await choose(['WAIT', 'LOOK', 'GO BACK'], { x: 200, y: 160 });
    T.lines.push('> ' + ['WAIT', 'LOOK', 'GO BACK'][c]);
    if (c === 1) await put(['NOTHING. NOT EVEN DARKNESS. DARKNESS HAS TO BE DRAWN, AND NOBODY HAS DRAWN IT.', 'NO COLORS. NO SHADES. NO SCREEN. A CURSOR, BLINKING, IN FRONT OF NOTHING.', 'YOU THINK YOU SEE A LITTLE TRIANGLE. IT ISN\'T POINTING AT ANYTHING. IT ISN\'T SELECTING ANYTHING. IT IS JUST WAITING, LIKE YOU.'][Math.min(2, waits)]);
    if (c === 2) await put('THERE IS NO FURTHER BACK THAN THIS. THIS IS THE BACK.');
    if (c === 0) { waits++; await put(['TIME DOES NOT PASS. THERE IS NO TIME YET.', 'SOMEONE, SOMEWHERE, IS ABOUT TO MAKE SOMETHING UP.', 'A STUDIO THAT NEVER EXISTED IS ABOUT TO.'][Math.min(2, waits - 1)]); if (waits >= 3) break; }
    await put('');
  }
  await wait(60); scene = prev;
  await theBeginning();
}
// the logo, at last: the first thing in every PRETEND CO. game, and the last thing in this one
async function theBeginning() {
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { cls(BLACK); const a = Math.min(1, t / 120); ctext('PRETEND CO.', 90, mix(BLACK, WHITE, a), 0, 3); if (t > 160) ctext('PRESENTS', 124, mix(BLACK, hex('#92dbff'), Math.min(1, (t - 160) / 40)), 0); if (t > 260 && (t >> 5) & 1) ctext('PRESS START', 170, hex('#ffdb49'), 0); } };
  post.fade = 0; post.legacy = 0;
  if (!DBG.fast) speak('Oc dneterp!', { pitch: 1.2, rate: .9 });
  await wait(DBG.fast ? 270 : 280);
  for (;;) { if (pressed.start || pressed.a) break; if (DBG.fast) break; await nextFrame(); }
  sfx('ok'); META_END.ended = 1; storeMetaEnd();
  scene = { update() { t++; }, draw() { cls(BLACK); ctext('THE BEGINNING.', 100, WHITE, 0, 2); } }; await wait(DBG.fast ? 10 : 180);
  DBG.ended = 1;
  // the end hands you the first game
  if (typeof location !== 'undefined' && location.href && !DBG.fast) location.href = '../';
}
const META_END = fetchStore('end_meta') || {};
function storeMetaEnd() { store('end_meta', META_END); }
