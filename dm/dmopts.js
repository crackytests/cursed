'use strict';
// ================= DARK MONDAY: options, the manual, the code wheel, CHAT DECIDES, JB's notebook =================
const OPT_DEFAULT = { speed: 0, music: 2, sfx: 2, mouse: 1, chat: 1, notebook: 0 };
const OPT = Object.assign({}, OPT_DEFAULT, fetchStore('dm_opts') || {});
let TSPEED = 1;
const SPEEDS = ['NORMAL', 'FAST', 'INSTANT'], LEVELS3 = ['OFF', 'LOW', 'FULL'], ONOFF = ['OFF', 'ON'];
function applyOpts() {
  TSPEED = [1, 2.4, 12][OPT.speed];
  if (typeof musBus !== 'undefined' && musBus && musBus.gain) { musBus._g0 = musBus._g0 === undefined ? musBus.gain.value : musBus._g0; musBus.gain.value = musBus._g0 * [0, .45, 1][OPT.music]; }
  if (typeof sfxBus !== 'undefined' && sfxBus && sfxBus.gain) { sfxBus._g0 = sfxBus._g0 === undefined ? sfxBus.gain.value : sfxBus._g0; sfxBus.gain.value = sfxBus._g0 * [0, .45, 1][OPT.sfx]; }
  if (!OPT.mouse) MOUSE.on = 0;
}
const saveOpts = () => store('dm_opts', OPT);
applyOpts();
const dmMeta = () => { const m = fetchStore('dm_meta') || {}; m.ends = m.ends || {}; return m; };

// ---------- options screen ----------
async function optionsMenu() {
  for (;;) {
    const rows = ['TEXT SPEED    ' + SPEEDS[OPT.speed], 'MUSIC         ' + LEVELS3[OPT.music], 'SOUND FX      ' + LEVELS3[OPT.sfx], 'MOUSE         ' + ONOFF[OPT.mouse], 'CHAT PROMPTS  ' + ONOFF[OPT.chat], 'MAP           ' + (OPT.notebook ? 'JB\'S NOTEBOOK' : 'RETAIL MODE'), 'DONE'];
    const i = await choose(rows, { x: 150, y: 60, cancel: 1, title: 'OPTIONS', wrap: 40 });
    if (i < 0 || i === 6) break;
    if (i === 0) OPT.speed = (OPT.speed + 1) % 3; else if (i === 1) OPT.music = (OPT.music + 1) % 3; else if (i === 2) { OPT.sfx = (OPT.sfx + 1) % 3; applyOpts(); sfx('ok'); } else if (i === 3) OPT.mouse = OPT.mouse ? 0 : 1; else if (i === 4) OPT.chat = OPT.chat ? 0 : 1; else if (i === 5) OPT.notebook = OPT.notebook ? 0 : 1;
    applyOpts(); saveOpts();
  }
}

// ---------- the manual (also the thing you look at during copy protection) ----------
const GLYPHS = ['TRIANGLE', 'SQUARE', 'CIRCLE', 'CROSS', 'DIAMOND', 'STAR', 'BOLT', 'EYE'];
const WHEEL_TABLE = [['THE BEHOLDEN', 3, 4], ['THE COLLECTOR PRIME', 1, 6], ['A MIDDLE MANAGER', 2, 1], ['GARF', 3, 0], ['A PHONE SPIDER', 1, 7], ['THE SEQUEL COMMITTEE', 2, 5]]; // [name, window, glyph index]
function manualPages() {
  const casters = Object.keys(CASTERS).map(id => ROSTER[id].name + ': ' + CASTERS[id].spells.map(n => n + ' (' + SPELLS[n].cost + ')').join(', '));
  const sp1 = Object.keys(SPELLS).slice(0, 7).map(n => n + ' ' + SPELLS[n].cost + 'SP. ' + SPELLS[n].desc), sp2 = Object.keys(SPELLS).slice(7).map(n => n + ' ' + SPELLS[n].cost + 'SP. ' + SPELLS[n].desc);
  return [
    ['THE STORY SO FAR', ['It is Monday. It has been Monday for as long as anyone can check.', '', 'Under Garf\'s Diner there is a door that was not there on Saturday. It hums. Somebody has to go and look.', '', 'The Temple of Dark Monday keeps a count of everything anybody owes: a call, a thank-you, a sorry, a building. At the bottom of it, an eye keeps the books.', '', 'Please survive.']],
    ['CONTROLS', ['ARROWS: move and turn.  A / D: step sideways.', 'Z or click: use, open, take, drop.', 'X: put back what is in your hand.', '1-6: that character attacks with their right hand.', 'F: cast a program.  M: the map.', 'TAB: party menu (inventory, rest, save).', 'CLICK a portrait: inventory.  RIGHT-CLICK: spells.', 'CLICK a hand slot: attack with it.', '', 'The first two characters fight in front. The rest can only use ranged weapons and spells.']],
    ['THE PARTY', ['CARL: fighter. Hits hard. Is human.', 'LINDA: mage. Has a memo for everything.', 'SPOOKY GHOST: rogue-mage. Walks through thin walls.', 'JB GARFIELD: ranger. Finds hidden doors.', 'FACE: cleric. Heals. Operates consoles.', 'YOKO: mage-cleric. Reads glyphs. Speeds you up.', 'PEE KID: small. Brave. Needs a bathroom.', '', 'Nobody is required for anything. Some things are easier with the right person.']],
    ['PROGRAMS 1', sp1], ['PROGRAMS 2', sp2.concat(['', 'WHO CASTS WHAT:'], casters)],
    ['FOOD, REST AND PILLS', ['Everyone gets hungrier as you walk. Eat before the bar runs out. Lasagna is a food group.', '', 'Rest from the TAB menu. It heals and restores SP, but not with a monster nearby, and sometimes something finds the camp.', '', 'PROP PILLS heal a little. BIG PILLS heal a lot. Click an item and then a hurt member, or use it from their pack.', '', 'Pits, spinners, plates and levers are all in the map. Read the signs.']],
    ['THE CODE WHEEL', ['Find the name, then the window, and read the glyph. For example:', ...WHEEL_TABLE.map(([n, w, g]) => n + '  WINDOW ' + w + ' = ' + GLYPHS[g]), '', 'THE TABLE IS CORRECT EXCEPT WHERE IT IS NOT. IF STUCK, SHOUT AT THE SCREEN.']],
    ['LEGAL', ['EYE OF THE BEHOLDEN II is a product of PRETEND CO. SOFT. It is not affiliated with any beholder, dungeon, or master.', '', 'The Sequel Committee is not responsible for lost time, lost Mondays, or lost Tuesdays.', '', 'No refunds. Take a towel.']],
  ];
}
async function manual(start = 0) {
  const P = manualPages(); let i = clamp(start, 0, P.length - 1), t = 0, done = false;
  const prev = scene, sdlg = DLG; DLG = null;
  return new Promise(res => {
    scene = { update() { t++; if (pressed.right || pressed.sr || (MOUSE.click && MOUSE.x > 256)) { i = Math.min(P.length - 1, i + 1); sfx('move'); } if (pressed.left || pressed.sl || (MOUSE.click && MOUSE.x <= 256)) { i = Math.max(0, i - 1); sfx('move'); } MOUSE.click = 0; if (pressed.b || pressed.a || pressed.start) { done = true; scene = prev; DLG = sdlg; res(); } },
      draw() { cls(hex('#02010a')); panel(4, 4, W - 8, H - 8); ctext('THE MANUAL', 10, hex('#ffe040')); text('PAGE ' + (i + 1) + ' OF ' + P.length, 20, 24, hex('#6a7cc8')); text(P[i][0], 20, 38, UI.hi);
        let y = 56; for (const para of P[i][1]) { if (!para) { y += 6; continue; } for (const l of wrapT(para, 78)) { text(l, 20, y, WHITE); y += 11; } }
        text('LEFT / RIGHT: PAGES     Z OR X: CLOSE', 20, 240, hex('#6a7cc8')); drawCursor(); } };
  });
}

// ---------- copy protection: the code wheel ----------
function glyphIcon(g, x, y, c = WHITE, s = 7) { // eight little symbols, drawn on the spot
  const P = [[[0, -s], [s, s], [-s, s]], [[-s, -s], [s, -s], [s, s], [-s, s]], null, null, [[0, -s - 1], [s, 0], [0, s + 1], [-s, 0]], null, [[2, -s], [-s, 1], [0, 1], [-2, s], [s, -1], [0, -1]], null][g];
  if (P) polyF(P.map(p => [x + p[0], y + p[1]]), c); else if (g === 2) { ellF(x, y, s, s, c); ellF(x, y, s - 3, s - 3, hex('#06040e')); } else if (g === 3) { rectF(x - 2, y - s, 4, s * 2, c); rectF(x - s, y - 2, s * 2, 4, c); }
  else if (g === 5) { const q = []; for (let k = 0; k < 10; k++) { const r = k & 1 ? s * .45 : s * 1.15, a = k / 10 * 6.283 - 1.57; q.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } polyF(q, c); }
  else { ellF(x, y, s + 2, s - 2, c); ellF(x, y, s - 2, s - 4, hex('#06040e')); ellF(x, y, 2, 2, c); }
}
async function protection() {
  const meta = dmMeta(); if (meta.protect) return;
  const [name, win, ans] = WHEEL_TABLE[(Date.now() >> 4) % WHEEL_TABLE.length]; let tries = 0, sel = 0, t = 0;
  const opts = [ans]; while (opts.length < 4) { const g = (ans + 1 + Math.floor(Math.random() * 7)) % 8; if (!opts.includes(g)) opts.push(g); } opts.sort(() => Math.random() - .5);
  post.fade = 0; music(null);
  return new Promise(res => {
    const finish = async (ok) => { meta.protect = 1; store('dm_meta', meta); scene = { draw() { cls(hex('#06040e')); ctext(ok ? 'ACCEPTED.' : 'THIS IS A LEGITIMATE COPY.', 100, hex('#9affc0')); ctext(ok ? 'HAVE A NICE MONDAY.' : 'THE PROTECTION IS EMBARRASSED.', 120, hex('#a8b8ff')); } }; sfx(ok ? 'get' : 'ok'); await wait(110); res(); };
    let msgT = 0, msgS = '';
    scene = { update() { t++; if (msgT > 0) msgT--;
        const mv = pressed.left ? -1 : pressed.right ? 1 : 0; if (mv) { sel = (sel + 4 + mv) % 4; sfx('move'); }
        if (MOUSE.on) opts.forEach((g, k) => { if (hit(80 + k * 96, 150, 80, 50) && MOUSE.mv) sel = k; });
        if (pressed.c || pressed.start) { run(async () => { await manual(6); }); return; }
        const click = MOUSE.click && opts.some((g, k) => hit(80 + k * 96, 150, 80, 50)); MOUSE.click = 0;
        if (pressed.a || click) { if (opts[sel] === ans) finish(true); else { tries++; sfx('bump'); if (tries >= 3) finish(false); else { msgS = tries === 1 ? 'WRONG. THE MANUAL IS ON PAGE SEVEN (PRESS C).' : 'WRONG AGAIN. ONE MORE.'; msgT = 160; } } } },
      draw() { cls(hex('#06040e')); gridFloor(170, hex('#2a1a5a'), t); ctext('COPY PROTECTION', 10, hex('#ffe040'), BLACK); ctext('ALIGN THE CODE WHEEL. READ WINDOW ' + win + ' FOR:', 30, WHITE); ctext(name, 46, hex('#20e0ff'), BLACK, 256);
        for (let r = 0; r < 3; r++) { const rad = 26 + r * 15; for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + t * (r % 2 ? .006 : -.009); glyphIcon((k + r * 3) % 8, 256 + Math.cos(a) * rad, 105 + Math.sin(a) * rad * .62, mix(hex('#6a7cc8'), hex('#20e0ff'), r / 2), 3); } }
        opts.forEach((g, k) => { panel(80 + k * 96, 150, 80, 50, k === sel ? hex('#2a2a70') : null); glyphIcon(g, 120 + k * 96, 172, k === sel ? WHITE : hex('#a8b8ff'), 10); });
        ctext('PICK THE SYMBOL.  C: OPEN THE MANUAL.', 214, hex('#a8b8ff')); text('TRY ' + (tries + 1) + ' OF 3', 20, 236, hex('#6a7cc8')); if (msgT > 0) ctext(msgS, 226, hex('#ff6a7a')); drawCursor(); } };
  });
}

// ---------- CHAT DECIDES ----------
let CHATQ = null;
function chatDecide(title, opts, def = 0, secs = 40) {
  if (!OPT.chat) return Promise.resolve(def);
  return new Promise(res => { CHATQ = { title, opts, def, t: secs * 60, max: secs * 60, i: 0, res }; sfx('alert'); });
}
function updateChat() {
  const q = CHATQ; q.t--;
  if (pressed.up) { q.i = (q.i + q.opts.length - 1) % q.opts.length; sfx('move'); } if (pressed.down) { q.i = (q.i + 1) % q.opts.length; sfx('move'); }
  q.opts.forEach((o, k) => { if (pressed['c' + (k + 1)]) { q.i = k; q.pick = 1; } if (MOUSE.on && hit(40, 96 + k * 22, 432, 20)) { if (MOUSE.mv) q.i = k; if (MOUSE.click) { q.i = k; q.pick = 1; } } });
  MOUSE.click = 0; MOUSE.mv = 0;
  if (pressed.a) q.pick = 1;
  if (q.pick) { CHATQ = null; sfx('ok'); q.res(q.i); } else if (q.t <= 0) { CHATQ = null; sfx('ok'); msg('CHAT WENT QUIET. THE GAME CHOSE.', hex('#ffb040')); q.res(Math.floor(crand() * q.opts.length)); }
}
function drawChat() {
  const q = CHATQ; rectA(0, 0, W, VH, hex('#02010a'), .7); panel(30, 30, W - 60, 40 + q.opts.length * 22 + 60); bigText('CHAT DECIDES', 256 - bigW('CHAT DECIDES', 2) / 2, 38, hex('#20e0ff'), 2, hex('#d020b0'));
  ctext(q.title, 62, hex('#ffe040'));
  q.opts.forEach((o, k) => { const y = 96 + k * 22; if (k === q.i) rectA(40, y - 2, 432, 20, hex('#3a6cff'), .5); text((k + 1) + '.  ' + o, 56, y + 3, k === q.i ? WHITE : hex('#b8c8ff')); });
  const y = 96 + q.opts.length * 22 + 8, f = clamp(q.t / q.max, 0, 1); rectF(50, y, 412, 8, hex('#14081c')); rectF(50, y, Math.round(412 * f), 8, mix(hex('#ff3050'), hex('#40ff80'), f)); frameR(49, y - 1, 414, 10, UI.frame2);
  ctext('READ CHAT. KEYS 1-' + q.opts.length + ' OR CLICK.  ' + Math.ceil(q.t / 60) + ' SECONDS.', y + 16, hex('#a8b8ff')); drawCursor();
}
SCENES.chatButton = async g => { // a big red button in the freezer
  g.hold = 1; await say('THERE IS A BIG RED BUTTON ON THE WALL OF THE FREEZER. IT HAS A LABEL. THE LABEL SAYS "DO NOT". THE BUTTON LOOKS LIKE IT WANTS TO BE PRESSED.');
  const i = await chatDecide('THE BUTTON SAYS "DO NOT". DO WE?', ['PRESS IT', 'LEAVE IT ALONE'], 1);
  if (i === 0) { sfx('alert'); post.flash = .6; shake(3, 24); await say('IT PRESSES BACK. AN ALARM RINGS ACROSS THE FREEZER, AND THE ROOM WAKES UP.'); for (const m of g.lv.mobs) if (m.hp > 0) m.awake = 1; giveOrDrop(g, 'BIG_PILLS'); giveOrDrop(g, 'BIG_PILLS'); msg('SOMETHING CLATTERS OUT OF THE VENT.', hex('#ffe040')); }
  else await say('YOU LEAVE IT ALONE. THE BUTTON LOOKS A LITTLE HURT.');
  g.hold = 0;
};
SCENES.chatBottle = async g => { // an unlabeled bottle in the tunnels
  g.hold = 1; await say('A BOTTLE ON THE FLOOR. NO LABEL. IT IS WARM. IT SMELLS LIKE A COUNTER AT A DINER.');
  const i = await chatDecide('WHAT DO WE DO WITH THE BOTTLE?', ['DRINK IT', 'POUR IT ON THE FLOOR', 'PUT IT IN THE PACK'], 2);
  if (i === 0) { const r = crand(); if (r < .5) { for (const c of PARTY) if (!c.dead) c.hp = Math.min(c.max, c.hp + 12); await say('IT IS SOUP. IT IS VERY GOOD SOUP. EVERYONE FEELS BETTER.'); } else if (r < .8) { const c = PARTY.find(p => !p.dead); if (c) { c.poison = 360; } await say('IT IS NOT SOUP. SOMEBODY LOOKS GREEN.'); } else { for (const c of PARTY) if (c.spMax) c.sp = c.spMax; await say('IT TASTES LIKE A GOOD IDEA. EVERYONE\'S PROGRAMS COME BACK.'); } }
  else if (i === 1) { await say('THE FLOOR TAKES IT. A TILE NEARBY LIGHTS UP FOR A MOMENT, THEN POLITELY DOES NOT.'); giveOrDrop(g, 'PROP_PILLS'); }
  else { giveOrDrop(g, 'BIG_PILLS'); await say('YOU PUT IT AWAY. IT TURNS OUT TO BE MEDICINE, WHICH IS MORE USEFUL THAN SOUP.'); }
  g.hold = 0;
};
SCENES.chatVend = async g => { // a vending machine on the road below
  g.hold = 1; await say('A VENDING MACHINE STANDS IN THE NOOK, LIT LIKE A SMALL CHURCH. IT ACCEPTS NAMES. IT SELLS NOTHING YOU CAN SEE.');
  const i = await chatDecide('WHAT DO WE BUY?', ['A LASAGNA', 'BIG PILLS', 'WALK AWAY'], 0);
  if (i === 0) { giveOrDrop(g, 'LASAGNA'); await say('IT TAKES A NAME FOR THE RECEIPT. NOBODY CAN SEE WHICH. THE LASAGNA IS HOT.'); }
  else if (i === 1) { giveOrDrop(g, 'BIG_PILLS'); await say('IT TAKES A NAME FOR THE RECEIPT. THE PILLS ARE BIG. THE RECEIPT IS BIGGER.'); }
  else await say('YOU WALK AWAY. THE MACHINE HUMS A LITTLE LOWER, LIKE IT WAS EXPECTING THAT.');
  g.hold = 0;
};

// ---------- JB's notebook: a map that fills in as you look ----------
function markSeen(g) {
  const lv = g.lv; if (!lv.seen) lv.seen = new Uint8Array(lv.w * lv.h); const set = (x, y) => { if (x >= 0 && y >= 0 && x < lv.w && y < lv.h) lv.seen[y * lv.w + x] = 1; };
  set(g.x, g.y); const rx = DX[(g.dir + 1) & 3], ry = DY[(g.dir + 1) & 3];
  for (let d = 0; d <= 4; d++) { const x = g.x + DX[g.dir] * d, y = g.y + DY[g.dir] * d; set(x, y); for (const s of [-1, 1]) set(x + rx * s, y + ry * s); if (d > 0 && isBlock(lv, x, y)) break; if (cellCh(lv, x, y) === 'D' && lv.st.door[x + ',' + y].open < .5 && d > 0) break; }
  for (let k = 0; k < 4; k++) set(g.x + DX[k], g.y + DY[k]);
}
async function showMap() {
  const g = GM, lv = g.lv, prev = scene, sdlg = DLG; DLG = null;
  return new Promise(res => {
    scene = { update() { MOUSE.click = 0; if (pressed.b || pressed.a || pressed.start || pressed.map) { scene = prev; DLG = sdlg; res(); } },
      draw() { cls(hex('#02010a')); panel(4, 4, W - 8, H - 8);
        if (!OPT.notebook) { ctext('RETAIL MODE', 14, hex('#ffe040')); for (let x = 20; x < 490; x += 14) rectF(x, 30, 1, 190, hex('#14204a')); for (let y = 30; y < 222; y += 14) rectF(20, y, 470, 1, hex('#14204a')); ctext('YOU HAVE A PENCIL AND A PAGE OF GRAPH PAPER.', 110, WHITE, BLACK); ctext('DRAW YOUR OWN MAP. IT IS HOW IT WAS DONE.', 126, hex('#a8b8ff')); ctext('(OPTIONS: MAP > JB\'S NOTEBOOK)', 150, hex('#6a7cc8')); text('Z OR X: CLOSE', 20, 238, hex('#6a7cc8')); return; }
        const s = Math.max(5, Math.min(Math.floor(440 / lv.w), Math.floor(200 / lv.h))), ox = 16, oy = 30; ctext('JB\'S NOTEBOOK: ' + lv.name, 12, hex('#ffb040'));
        for (let y = 0; y < lv.h; y++) for (let x = 0; x < lv.w; x++) { if (!(lv.seen && lv.seen[y * lv.w + x])) continue; const c = cellCh(lv, x, y), px = ox + x * s, py = oy + y * s;
          if ('#SX'.includes(c)) { rectF(px, py, s, s, hex('#0e1642')); } else { rectF(px, py, s, s, hex('#2a4aa0')); frameR(px, py, s, s, hex('#4a6ad0')); if (c === 'D') { rectF(px + 1, py + 1, s - 2, s - 2, hex('#ffb040')); } else if (c === '>') rectF(px + 1, py + 1, s - 2, s - 2, hex('#40ff80')); else if (c === '<') rectF(px + 1, py + 1, s - 2, s - 2, hex('#20e0ff')); else if (c === 'P') rectF(px + 1, py + 1, s - 2, s - 2, hex('#000000')); else if (c === 'p') frameR(px + 1, py + 1, s - 2, s - 2, hex('#ff40d0')); else if (c === 'T') ellF(px + s / 2, py + s / 2, s / 2 - 1, s / 2 - 1, hex('#80e8ff')); else if (c === 'O') ellF(px + s / 2, py + s / 2, s / 2 - 1, s / 2 - 1, hex('#ff40d0')); } }
        for (const it of lv.items || []) if (lv.seen[it.y * lv.w + it.x]) rectF(ox + it.x * s + s / 2 - 1, oy + it.y * s + s / 2 - 1, 2, 2, hex('#ffe040'));
        if ((frame >> 4) & 1) { const px = ox + g.x * s + s / 2, py = oy + g.y * s + s / 2, d = g.dir, ax = DX[d], ay = DY[d]; polyF([[px + ax * s * .5, py + ay * s * .5], [px - ay * s * .4 - ax * s * .3, py + ax * s * .4 - ay * s * .3], [px + ay * s * .4 - ax * s * .3, py - ax * s * .4 - ay * s * .3]], WHITE); }
        text('YELLOW: DOOR   GREEN: STAIRS DOWN   CYAN: STAIRS UP   .: ITEM', 16, 238, hex('#6a7cc8')); text('Z OR X: CLOSE', 400, 238, hex('#6a7cc8')); drawCursor(); } };
  });
}

// ---------- endings seen (title screen) ----------
async function endingsList() {
  const m = dmMeta(), names = { COLLECT: 'COLLECT: THE DEBT WAS COLLECTED', FORGIVE: 'FORGIVE: NOTHING IS OWED', JOB: 'SIGN ON: EMPLOYEE OF THE MONTH' };
  await showCard(['ENDINGS SEEN', '', ...Object.keys(names).map(k => (m.ends[k] ? '* ' : '- ') + (m.ends[k] ? names[k] : '??????????')), '', Object.keys(m.ends).length + ' OF 3'], 0, { fg: hex('#ffe040') });
}
