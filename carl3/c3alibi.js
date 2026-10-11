'use strict';
// ================= CARL 3: parcels, alibis (his explanations become jobs), the route card, and the little jobs themselves =================
// A claim Carl makes to get past somebody is written in the ledger and becomes a task. Two claims that can't both be true raise SUSPICION.
const CLAIMS = {
  maintenance: { name: 'MAINTENANCE WORKER', short: 'I\'M WITH MAINTENANCE', with: ['resident', 'inspector'] },
  resident: { name: 'A RESIDENT', short: 'I LIVE HERE', with: ['maintenance'] },
  inspector: { name: 'AN INSPECTOR', short: 'I\'M AN INSPECTOR', with: ['maintenance', 'resident'] },
  trucker: { name: 'A TRUCKER', short: 'I\'M A TRUCKER', with: [] },
  relative: { name: 'FAMILY OF THE GUEST', short: 'I\'M FAMILY', with: [] },
  investor: { name: 'AN INVESTOR', short: 'I\'M HERE TO REOPEN IT', with: [] },
  shopper: { name: 'A SHOPPER', short: 'I\'M JUST SHOPPING', with: ['maintenance'] },
  sorter: { name: 'THE NEW SORTER', short: 'I\'M THE NEW SORTER', with: ['maintenance'] },
  courier: { name: 'A COURIER (TRUE)', short: 'I\'M A DELIVERY DRIVER', with: ['maintenance', 'resident', 'inspector', 'trucker', 'relative', 'investor', 'shopper'], truth: 1 },
};
// ask a gatekeeper's question: the player picks an explanation. returns the claim id (and records it)
async function claimMenu(who, q, options, o = {}) {
  await say(q, who, { keep: 1 });
  const labels = options.map(c => CLAIMS[c].short).concat(o.noChat ? [] : ['ASK CHAT']);
  for (;;) {
    DBG.claims = options;
    const i = await choose(labels);
    if (i >= options.length) { DLG = null; await askChat3(); await say(q, who, { keep: 1 }); continue; }
    DLG = null; DBG.claims = null;
    const id = options[i]; recordClaim(id, o.stop || C3.stop); return id;
  }
}
function recordClaim(id, stop) {
  const c = CLAIMS[id];
  if (c.truth) return;
  const clash = C3.alibis.filter(a => a.stop === stop && !a.retracted && id !== a.id && !(c.with || []).includes(a.id));
  C3.alibis.push({ id, stop, task: '', done: 0, retracted: 0, t: C3.time }); C3.lies++;
  if (clash.length) { C3.suspicion++; sfx('alert'); tickC('wait did he say something different earlier'); }
}
const alibiOf = id => C3.alibis.find(a => a.id === id && !a.retracted);
function finishAlibi(id, task) { const a = alibiOf(id); if (a) { a.done = 1; if (task) a.task = task; } }
async function alibiScreen() {
  const prev = scene;
  scene = { draw() {
    skyD(0, H, '#101028', '#24244a'); panel(8, 8, W - 16, H - 16); text('THE LEDGER', 24, 18, hex('#ffd848')); text('WHAT CARL HAS TOLD PEOPLE', 24, 30, UI.dim);
    if (!C3.alibis.length) text('NOTHING YET. HE IS BEING VERY HONEST.', 24, 60, UI.text);
    C3.alibis.slice(-9).forEach((a, i) => { const y = 50 + i * 16, c = CLAIMS[a.id]; text(c.name, 24, y, a.retracted ? UI.dim : a.done ? hex('#6dff92') : WHITE); text('STOP ' + a.stop, 200, y, UI.dim); text(a.retracted ? 'TAKEN BACK' : a.done ? 'DONE' : 'OPEN', 250, y, a.done ? hex('#6dff92') : UI.name); if (a.task) text('- ' + a.task, 30, y + 8, UI.dim); });
    text('SUSPICION: ' + C3.suspicion + '/5', 24, H - 24, C3.suspicion >= 3 ? hex('#ff4949') : UI.text);
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}
// ---------------- parcels ----------------
function addParcel(p) { C3.parcels.push(Object.assign({ status: 'carry', stop: C3.stop }, p)); sfx('get'); tickC('new parcel: ' + p.desc.toLowerCase()); }
const parcel = id => C3.parcels.find(p => p.id === id);
async function parcelsScreen() {
  const prev = scene;
  scene = { draw() {
    skyD(0, H, '#101028', '#24244a'); panel(8, 8, W - 16, H - 16); text('PARCELS', 24, 18, hex('#ffd848'));
    C3.parcels.slice(-9).forEach((p, i) => { const y = 38 + i * 18; text(p.desc, 24, y, p.status === 'carry' ? WHITE : UI.dim); text('TO: ' + p.toName, 30, y + 8, UI.dim); text(p.status === 'carry' ? 'ON BOARD' : p.status === 'delivered' ? 'DELIVERED' : p.status === 'returned' ? 'RETURNED' : p.status.toUpperCase(), 230, y, p.status === 'delivered' ? hex('#6dff92') : UI.name); });
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}
// ---------------- the route card ----------------
const STOPS = [
  { id: 'lot', name: 'THE LOT', x: 40, y: 190 }, { id: 'canyon', name: 'BOX CANYON', x: 80, y: 130 }, { id: 'motel', name: 'STARLITE MOTOR COURT', x: 130, y: 90 },
  { id: 'plaza', name: 'BIG LEON\'S', x: 190, y: 120 }, { id: 'mall', name: 'DESERT PALMS MALL', x: 240, y: 80 }, { id: 'sorting', name: 'SORTING CENTER', x: 270, y: 150 }, { id: 'dlo', name: 'DEAD LETTER OFFICE', x: 200, y: 190 },
];
function addNote(n) { if (!C3.notes.includes(n)) C3.notes.push(n); }
async function routeScreen() {
  const prev = scene;
  scene = { draw() {
    skyD(0, H, '#d8c898', '#b09868'); frameRect(6, 6, W - 12, H - 12, hex('#6d4924')); text('ROUTE CARD', 16, 12, hex('#6d2a10'));
    for (let i = 0; i < STOPS.length - 1; i++) lineF(STOPS[i].x, STOPS[i].y, STOPS[i + 1].x, STOPS[i + 1].y, i < C3.stop ? hex('#b62424') : hex('#a89868'));
    STOPS.forEach((s, i) => { const got = i <= C3.stop; circF(s.x, s.y, 5, got ? hex('#b62424') : hex('#a89868')); if (got && i > 0) { ringF(s.x, s.y, 8, hex('#b62424')); } text(got || i === C3.stop + 1 ? s.name : '?????', s.x - 20, s.y + 8, hex('#3a2410'), 0); });
    C3.notes.slice(-4).forEach((n, i) => text(n.slice(0, 50), 14, H - 54 + i * 10, hex('#3a2410'), 0));
  } };
  sfx('tick'); await waitBtn(); sfx('tick'); scene = prev;
}
// ---------------- little jobs ----------------
// WIRES: match each plug to the socket of the same color. UP/DOWN moves, A or X connects (either button), C closes it.
// sockets show color only. a fuse burns down; a wrong plug costs a strike and reshuffles the open sockets. three strikes or the fuse = the panel resets.
const WCOL = [['RED', '#ff4949'], ['CYAN', '#24dbff'], ['YELLOW', '#ffdb24'], ['GREEN', '#6dff24'], ['PINK', '#ff49db']];
async function wires(title, n = 4) {
  const left = WCOL.slice(0, n), right = left.map((_, i) => i).sort(() => Math.random() - .5);
  if (n > 1 && right.every((r, i) => r === i)) right.reverse();
  let sel = 0, picked = -1, done = new Set(), bad = 0, rs = 0, t = 0, msg = '', msgT = 0, flash = 0;
  const MAXB = 3, FUSE = Math.round(60 * (4 + n * 2.5)), prev = scene;
  scene = { update() { t++; if (msgT > 0) msgT--; if (flash > 0) flash--; }, draw() {
    prev.draw(); plate(40, 18, 240, 176, { alpha: .95 });
    shadowText(title, 160 - title.length * 3, 26, UI3.name); text('MATCH EACH PLUG TO ITS COLOR', 160 - 14 * 6, 38, UI3.dim);
    const top = 56, row = n > 4 ? 18 : 24;
    for (let i = 0; i < n; i++) {
      const y = top + i * row, lc = hex(left[i][1]), rc = hex(left[right[i]][1]);
      rectF(70, y, 56, 16, hex('#0a0e24')); frameRect(70, y, 56, 16, picked === i ? WHITE : done.has(i) ? hex('#6dff92') : UI3.edge2); rectF(74, y + 3, 10, 10, lc); text(left[i][0], 88, y + 5, done.has(i) ? UI3.dim : UI3.text);
      rectF(194, y, 56, 16, hex('#0a0e24')); frameRect(194, y, 56, 16, UI3.edge2); rectF(236, y + 3, 10, 10, rc); if (done.has(right[i])) text(left[right[i]][0], 198, y + 5, UI3.dim);
      if (done.has(i)) lineF(126, y + 8, 194, top + right.indexOf(i) * row + 8, lc);
    }
    const cy = top + (picked < 0 ? sel : rs) * row;
    if (picked < 0) { triF(60, cy + 4, 60, cy + 12, 67, cy + 8, UI3.name); frameRect(69, cy - 1, 58, 18, UI3.name); }
    else { lineF(126, top + picked * row + 8, 194, cy + 8, hex(left[picked][1])); triF(260, cy + 4, 260, cy + 12, 253, cy + 8, UI3.name); frameRect(193, cy - 1, 58, 18, UI3.name); }
    for (let i = 0; i < MAXB; i++) rectF(70 + i * 12, 164, 9, 6, i < bad ? hex('#ff4949') : hex('#243050'));
    text('STRIKES', 110, 164, UI3.dim); const f = Math.max(0, 1 - t / FUSE); rectF(160, 164, 90, 6, hex('#243050')); rectF(160, 164, 90 * f, 6, hex(f < .3 && (t & 8) ? '#ffffff' : '#ffb030'));
    if (msgT > 0) shadowText(msg, 160 - msg.length * 3, 150, (flash & 2) ? hex('#ff9a9a') : hex('#ff4949')); else text(picked < 0 ? 'PICK A PLUG ON THE LEFT' : 'NOW ITS MATCHING SOCKET', 160 - (picked < 0 ? 23 : 24) * 3, 150, UI3.text);
    text('Z / X: CONNECT    C: CLOSE', 160 - 12 * 6, 178, UI3.dim);
  } };
  DBG.mode = 'wires'; DBG.wr = { right: () => right, sel: () => sel, picked: () => picked, n }; DBG.wrDone = done; DBG.wrRs = () => rs;
  const fin = r => { DBG.mode = null; scene = prev; return r; };
  while (done.size < n) {
    await nextFrame();
    if (pressed.c || pressed.start) return fin(false);
    if (t > FUSE) { msg = 'THE FUSE BLEW'; msgT = 90; sfx('hurt'); WX.shake = 8; await wait(40); return fin(false); }
    if (pressed.up) { if (picked < 0) sel = (sel + n - 1) % n; else rs = (rs + n - 1) % n; sfx('move'); }
    if (pressed.down) { if (picked < 0) sel = (sel + 1) % n; else rs = (rs + 1) % n; sfx('move'); }
    if (pressed.a || pressed.b) {
      if (picked < 0) { if (!done.has(sel)) { picked = sel; rs = 0; sfx('tick'); } }
      else if (right[rs] === picked) { done.add(picked); picked = -1; sfx('ok'); msg = ''; msgT = 0; sel = [...Array(n).keys()].find(i => !done.has(i)) || 0; }
      else { bad++; msg = 'NO: ' + left[picked][0] + ' IS NOT ' + left[right[rs]][0]; msgT = 90; flash = 24; picked = -1; sfx('hurt'); WX.shake = 6;
        const open = right.map((r, i) => done.has(r) ? -1 : i).filter(i => i >= 0), vals = open.map(i => right[i]).sort(() => Math.random() - .5); open.forEach((i, k) => right[i] = vals[k]);   // the open sockets shuffle
        if (bad >= MAXB) { await wait(30); return fin(false); } }
    }
  }
  await wait(20); sfx('get'); return fin(true);
}
// TUNE: hold LEFT/RIGHT until the picture stops rolling. A locks it in.
async function tune(title) {
  let dial = rnd(100) / 100, target = .25 + Math.random() * .5, t = 0, lock = 0, ok = false;
  const prev = scene;
  scene = { update() { t++; }, draw() {
    prev.draw(); panel(50, 20, 220, 170); ctext(title, 28, UI.name); const q = 1 - Math.min(1, Math.abs(dial - target) * 6);
    rectF(70, 44, 180, 100, BLACK);
    for (let y = 0; y < 100; y += 2) { const off = Math.round((1 - q) * Math.sin(y * .3 + t * .4) * 18); rectF(70 + 10 + off, 44 + y, 160, 1, hex(q > .85 ? '#92dbff' : '#6d6d92')); }
    if (q > .85) { circF(160, 94, 26, hex('#d8d8d0')); rectF(148, 86, 6, 6, BLACK); rectF(166, 86, 6, 6, BLACK); rectF(150, 102, 20, 3, BLACK); } else for (let i = 0; i < 160; i++) pset(70 + rnd(180), 44 + rnd(100), WHITE);
    rectF(70, 156, 180, 6, hex('#242424')); rectF(70 + dial * 174, 154, 6, 10, hex('#ffdb24')); ctext('TRACKING  ' + Math.round(q * 100) + '%   A: LOCK', 172, UI.dim);
  } };
  DBG.mode = 'tune'; DBG.tn = { dial: () => dial, target };
  for (;;) {
    await nextFrame();
    if (held.left) dial = Math.max(0, dial - .006); if (held.right) dial = Math.min(1, dial + .006);
    if (pressed.a) { if (Math.abs(dial - target) < .035) { ok = true; break; } sfx('hurt'); }
    if (pressed.b) break;
  }
  if (ok) sfx('get'); await wait(20); DBG.mode = null; scene = prev; return ok;
}
