'use strict';
// ================= DEUS EX NEVADA: story framework (content helpers, flow, hooks, cutscenes) =================
// ---------- content helpers for the hub files ----------
const npc = (t, o = {}) => Object.assign({ k: 'npc', t }, o);
const door = (o = {}) => Object.assign({ k: 'door' }, o);
const pr = (p, o = {}) => Object.assign({ k: 'prop', p }, o);
const item = (id, n = 1, o = {}) => Object.assign({ k: 'item', item: id, n }, o);
const exitTo = (to, at, o = {}) => Object.assign({ k: 'exit', to, at }, o);
const spawnPt = (id, face, o = {}) => Object.assign({ k: 'spawn', id, face }, o);
const cam = (ang, o = {}) => Object.assign({ k: 'cam', ang, team: 'fatco' }, o);
const turret = (o = {}) => Object.assign({ k: 'turret', ang: 0, team: 'fatco' }, o);
const comp = (accounts, o = {}) => Object.assign({ k: 'prop', p: 'computer', comp: Object.assign({ accounts }, o.c || {}) }, o);
const seccomp = (accounts, o = {}) => Object.assign({ k: 'prop', p: 'seccomp', comp: Object.assign({ accounts, banner: 'SECURITY TERMINAL' }, o.c || {}) }, o);
const reader = (text, o = {}) => Object.assign({ k: 'prop', p: o.p || 'sign', text }, o);
const keypad = (code, doorId, o = {}) => Object.assign({ k: 'prop', p: 'keypad', code, door: doorId, frob: (M, e) => keypadUI(e), label: 'KEYPAD' }, o);
const trig = (fn, o = {}) => Object.assign({ k: 'trigger', fn }, o);
const use = (label, fn, o = {}) => Object.assign({ k: 'use', label, fn }, o);
const light = (r, k, o = {}) => Object.assign({ k: 'light', light: [r, k] }, o);
const warpPart = (n) => item('warp', 1, { id: 'warp' + n, onTake: () => { F['warp' + n] = 1; chatSay('an A.S.S. part!!', 1); if (!F.warpNote) { F.warpNote = 1; addNote('A.S.S. warp parts: pieces of Carl\'s own ship, scattered across Nevada and further. Why are they here? Collect them. (' + warpCount() + '/7)'); } else msg('A.S.S. PART ' + warpCount() + '/7'); } });
const warpCount = () => [1, 2, 3, 4, 5, 6, 7].filter(n => F['warp' + n]).length;
function txt(id, title, text, o = {}) { TEXTS[id] = Object.assign({ id, title, text }, o); return id; }
function mail(id, from, to, subj, text, o = {}) { MAIL[id] = Object.assign({ from, to, subj, text }, o); return id; }
const find = id => P.map.ents.find(e => e.id === id);
const doorById = id => Object.values(P.map.doors).find(d => d.id === id);
// ---------- cutscenes ----------
async function cutscene(fn) { G.cut = 1; G.cutBars = 1; try { await fn(); } finally { G.cut = 0; G.cutBars = 0; G.camFocus = null; } }
async function talkTo(e, fn) { await startConv(fn, e); }
// a conversation away from any map: two portraits over a painted card (Linda's office, the endings)
async function vignette(title, sub, fn, o = {}) {
  const prev = scene; const bg = o.bg || '#140a14';
  scene = { update() {}, draw() { cls(hex(bg)); for (let y = 0; y < H; y += 2) rectF(0, y, W, 1, mix(hex(bg), BLACK, .3)); if (o.paint) o.paint(); ctext(title, 30, UIC.hi, INK); if (sub) ctext(sub, 42, UIC.dim, INK); drawConv(); drawModals(); } };
  await fadeIn(.06); CV.left = o.left || null;
  await startConv(fn, null); await fadeOut(.06); scene = prev; post.fade = 0;
}
// a chat poll: the chat votes; the player still decides
function chatPoll(q, opts) { const n = opts.length; let left = 100; const pct = opts.map((o, i) => { const v = i === n - 1 ? left : Math.min(left, 10 + rnd(60)); left -= v; return v; }); chatSay('POLL: ' + q, 0, 'POLLBOT'); opts.forEach((o, i) => chatSay(o + ' ' + pct[i] + '%', 0, 'POLLBOT')); }
async function delay(sec) { await wait(Math.round(sec * 60)); }
async function waitUntil(fn) { while (!fn()) await nextFrame(); }
// travel between hubs: a card, maybe a disk swap, an autosave
async function travel(map, at, o = {}) {
  if (o.disk) await diskSwap(o.disk, o.diskLabel); else { await fadeOut(.05); }
  gotoMap(map, at); post.fade = 0; if (!o.noSave) setTimeout(autoSave, 50);
}
// ---------- hooks the engine calls ----------
function onNPCDown(M, e, killed) {
  const k = killed ? 'dead_' : 'ko_'; if (e.id) F[k + e.id] = 1;
  if (killed) F.kills = (F.kills || 0) + 1; else F.kos = (F.kos || 0) + 1;
  F['k_' + G.hub] = (F['k_' + G.hub] || 0) + (killed ? 1 : 0);
  if (HUBS[G.hub] && HUBS[G.hub].down) HUBS[G.hub].down(M, e, killed);
}
function onProvoke(M, e) { if (HUBS[G.hub] && HUBS[G.hub].provoke) HUBS[G.hub].provoke(M, e); }
function onPlayerDeath(type, src) { }

// ---------- the opening ----------
async function startGame() {
  G.hubIdx = 1; music('night');
  await vignette('CEO LINDA\'S OFFICE', 'MALL OF THE FUTURE, TOP FLOOR', async () => {
    CV.left = 'LINDA';
    await T('WHITE', 'The new agent passed, ma\'am.');
    await T('LINDA', 'Passed what?');
    await T('WHITE', 'The species review.');
    await T('LINDA', 'Did he.');
    await T('WHITE', 'We stamped it.');
    await T('LINDA', '...Then he\'s human. Laminate it. Give him a gun and send him to the island.');
    await T('WHITE', 'And if he reads the stamp?');
    await T('LINDA', 'Nobody reads the stamp, Mr. White. They read the word. He has wanted that word his whole life. He will do anything we ask to keep it.');
    await T('LINDA', 'That is what a brand is.');
  }, { left: 'LINDA', bg: '#1a0a14' });
  await vignette('NEVADA, NOW', 'THE BUFFERING', async () => {
    await T('N', 'It started in the malls. People slowed down. They stuttered mid-sentence, like a bad stream. Then they stopped.');
    await T('N', 'Doctors called it the Buffering. There was a cure: a cheap little pill called Prop Pills, made by Pretend Co., "the pretend company, a real company."');
    await T('N', 'Pretend Co. recalled it. The official reason: it was more effective than placebo, which was not what it said on the box.');
    await T('N', 'The pills went into warehouses. The Buffered went into the parking lots. A group calling itself the Prop Pills Front started taking the pills back.');
    await T('N', 'Fascism Inc. called them terrorists, and founded a coalition to stop them. FATCO needed agents.');
    await T('N', 'It found one in a parking lot, living in his ship.');
  }, { bg: '#08080e' });
  G.hub = 'mall'; gotoMap('mall_island', 'boat'); post.fade = 1; await fadeIn(.03);
  setTimeout(autoSave, 50);
}
