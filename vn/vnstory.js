'use strict';
// ================= VISITOR: THE NORMALCY: story framework (content helpers, flow, hooks, cutscenes) =================
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
const tape = (n) => item('warp', 1, { id: 'tape' + n, onTake: () => { F['tape' + n] = 1; msg('DEEP NIGHT TAPE ' + tapeCount() + '/8'); if (!F.tapeNote) { F.tapeNote = 1; addNote('DEEP NIGHT tapes: somebody has been taping Deb\'s show and hiding the cassettes around LA. Play them on any radio. (' + tapeCount() + '/8)'); } } });
const tapeCount = () => [1, 2, 3, 4, 5, 6, 7, 8].filter(n => F['tape' + n]).length;
// visitors in public: npc that looks human unless you look properly
const vnpc = (t, sp, o = {}) => npc(t, Object.assign({ vis: sp, knows: 1 }, o));
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
  // killing a human who did nothing to you costs humanity (draining handles its own)
  if (killed && !e.drainedDead && isHuman(e) && !e.badguy && !e.hurtFirst && (e.team === 'civ' || e.team === 'pill' || e.team === 'cop' || e.team === 'bouncer' || e.team === 'yard') && P && !P.dead) loseHumanity(e.team === 'cop' ? 'killed a cop' : 'killed an innocent');
  if (HUBS[G.hub] && HUBS[G.hub].down) HUBS[G.hub].down(M, e, killed);
}
function onProvoke(M, e) { if (HUBS[G.hub] && HUBS[G.hub].provoke) HUBS[G.hub].provoke(M, e); }
function onPlayerDeath(type, src) { }

// ---------- chapters: the radio and the viewer count follow the hubs ----------
{ const _goto = gotoMap; gotoMap = function (id, at, o) { const M = _goto(id, at, o); const h = { sm: 1, dt: 2, hw: 3, lt: 4, end: 5 }[M.d.hub]; if (h) G.hubIdx = Math.max(G.hubIdx || 0, h); return M; }; }
// ---------- THE BROADCAST hears the plot before it happens ----------
const SIGNALS = ['the box is not empty', 'the box is not what is in the box', 'something in the box ticks', 'the man in the red band wrote the label', 'old face is coming back through the wall', 'the cold man is still cold', 'two stations one face', 'the auction ends in teeth', 'nobody looks at the assistant', 'seven toes', 'do not open it', 'still in transit', 'it reads you like a label', 'the tallest one is sleeping under the stars'];
{ const _ct = chatTick; chatTick = function () { _ct(); if (P && species() === 'broadcast' && rnd(1400) === 0) chatSay(pick(SIGNALS), 0, '[SIGNAL]'); }; }
// ---------- the haven radio: DEEP NIGHT WITH DEB, a new segment per chapter ----------
const DEB = [];
function debSegment() { const h = G.hubIdx || 1; const seg = DEB.filter(d => d.hub <= h && !F['deb_' + d.id]); return seg[0] || null; }
async function playRadio() {
  const d = debSegment(); if (!d) { await vignette('DEEP NIGHT WITH DEB', 'KDNT 1340 AM', async () => { await T('DEB', pick(['...and that\'s the hour. Stay up with me, LA. Somebody has to.', 'Lines are open. Lines are always open. Call me if you see something. Call me if you ARE something.', 'This is Deb. It\'s late. Here\'s a song about it.'])); }, { left: 'DEB', bg: '#1a0418' }); return; }
  F['deb_' + d.id] = 1; await vignette('DEEP NIGHT WITH DEB', 'KDNT 1340 AM - ' + d.title, d.fn, { left: 'DEB', bg: '#1a0418' });
}
// ---------- the opening ----------
async function startGame() {
  G.hubIdx = 0; G.hub = 'pro'; music('night');
  await vignette('SANTA MONICA', 'A STUDIO APARTMENT, 3:12 AM', async () => {
    await T('N', 'Forty viewers. A ring light. A ship parked illegally behind a laundromat.');
    await T('CARL', '-and that\'s why, chat, if you think about it, a normal human would also have big eyes if they were looking at something really interesting, which I am, which is you guys. Okay. Okay. Prop Pills. The pretend company, a real compa-');
    await T('N', 'Someone knocks. Nobody has ever knocked.');
    await T('CARL', 'Chat. Chat, did anyone order- I didn\'t order anything. Did you order something to my house? You don\'t know my house. Why would you know my house.');
    await T('N', 'The door opens on its own. Two men in white suits stand in the hall. Behind them, a woman in black with pink hair does not come in. She does not need to.');
    await T('WHITE', 'Mr. Carl. You have been streaming your face.');
    await T('CARL', 'It\'s a model! It\'s a VTuber model. It\'s- there\'s a rig, there\'s a guy, I\'m the guy, the guy is normal, the guy is a normal hum-');
    await T('WHITE', 'Please bring the ring light. The Commissioner would like to see what the fuss is about.');
    await T('N', 'Chat assumes it is a bit. The stream ends.');
  }, { left: 'WHITE', bg: '#0a0614' });
  G.hub = 'pro'; gotoMap('pro_hearing', 'start'); post.fade = 1; await fadeIn(.03);
  setTimeout(autoSave, 50);
}
