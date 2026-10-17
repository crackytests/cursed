'use strict';
// ================= VISITOR: THE NORMALCY: HUD, chat, infolink, screens, terminals, keypads, conversations, shops =================
const UIC = { bg: hex('#0a0e18'), bg2: hex('#121a2c'), line: hex('#3a5a8a'), hi: hex('#ffd24a'), dim: hex('#6a7a9a'), txt: hex('#d8e0f0'), red: hex('#ff4040'), grn: hex('#40ff80'), cyan: hex('#60e0ff'), amber: hex('#ffb040'), mag: hex('#ff60c0') };
function box(x, y, w, h, title, o = {}) {
  rectA(x, y, w, h, UIC.bg, o.alpha === undefined ? .88 : o.alpha); frameR(x, y, w, h, UIC.line); rectF(x + 1, y + 1, w - 2, 1, mix(UIC.line, WHITE, .3));
  if (title) { rectF(x, y, w, 10, UIC.bg2); frameR(x, y, w, 10, UIC.line); text(title, x + 4, y + 2, o.tc || UIC.hi, 0); }
}
function btn(x, y, w, label, o = {}) { // returns true when clicked (or its hotkey tapped)
  const hov = MOUSE.on && MOUSE.x >= x && MOUSE.x < x + w && MOUSE.y >= y && MOUSE.y < y + 11, dis = o.dis;
  rectF(x, y, w, 11, dis ? hex('#1a1e28') : hov || o.sel ? hex('#2a4a7a') : hex('#18243c')); frameR(x, y, w, 11, dis ? hex('#2a2e38') : hov || o.sel ? UIC.hi : UIC.line);
  text(label, x + ((w - tw(label)) >> 1), y + 2, dis ? hex('#4a4e58') : hov || o.sel ? WHITE : UIC.txt, 0);
  if (dis) return false; if (hov && MOUSE.click) { sfx('ok'); return true; } if (o.key && tapAny(...[].concat(o.key))) { sfx('ok'); return true; } return false;
}
const inRect = (x, y, w, h) => MOUSE.on && MOUSE.x >= x && MOUSE.x < x + w && MOUSE.y >= y && MOUSE.y < y + h;
function wrapText(s, x, y, n, c = UIC.txt, lh = 9, max = 99) { const ls = wrapT(s, n); ls.slice(0, max).forEach((l, i) => text(l, x, y + i * lh, c, 0)); return ls.length; }

// ---------- messages, chat, infolink, logs ----------
const CHATLOG = [], CONVLOG = [];
function msg(s) { G.msg.push({ s: String(s), t: 220 }); if (G.msg.length > 4) G.msg.shift(); }
function logConv(s) { CONVLOG.push(s); if (CONVLOG.length > 400) CONVLOG.shift(); }
const CHATNAMES = ['propfan99', 'xX_LA_Xx', 'linda_stan', 'lights_over_LA', 'ghostposting', 'normalcy_enjoyer', 'lurker_420', 'pilotXfan', 'yokohelps', 'trueHUMAN', 'facewatcher', 'tp_irl', 'bongripper', 'denial_main', 'stealthonly', 'pacifist_run', 'chaos_carl', 'mothman_irl', 'definitelyhuman', 'vtuber_truther', 'deb_of_night', 'santamonica', 'crasher4life', 'greyarea'];
const CHATCOL = ['#ff8080', '#80ff80', '#80c0ff', '#ffd060', '#ff80ff', '#80ffff', '#ffa060', '#c0a0ff', '#a0ff40', '#ff6090'];
function chatSay(s, auto, user) {
  if (!OPT.chat && auto) return; const u = user || pick(CHATNAMES); const c = hex(CHATCOL[(u.length * 7 + u.charCodeAt(0)) % CHATCOL.length]);
  CHATLOG.push({ u, s: String(s), c, t: G.t, f: frame }); if (CHATLOG.length > 300) CHATLOG.shift(); if (!auto || rnd(3) === 0) sfx('chat');
}
const CHATR = {
  kill: ['F', 'rip', 'carl NO', 'thats a body', 'he killed him', 'so much for pacifist', 'violence carl', 'skill issue (his)', 'ok that was clean'],
  civkill: ['CARL', 'that was a civilian', 'bro', 'chat is that allowed', 'the game will remember that', 'yikes'],
  ko: ['nonlethal king', 'night night', 'eepy', 'pacifist run still alive', 'clean takedown', 'he is sleeping'],
  spotted: ['HE SAW YOU', 'spotted lol', 'run', 'stealth run over', 'abort abort', 'shoot first', 'nice going', '!!!'],
  alarm: ['ALARM', 'there goes the stealth bonus', 'hit the panel carl', 'bro set off the alarm', 'wee woo wee woo'],
  hurt: ['ow', 'medkit', 'use a medkit', 'hes bleeding', 'that looked bad', 'HP'],
  death: ['RIP', 'F', 'reload', 'quickload', 'skill issue', 'carl no', 'he was so young', 'did you save'],
  smoke: ['420 gift', 'medicinal', 'vitality +20 lmao', 'hit it', 'carl the canon smoker', 'the game encourages it'],
  enter: ['new area', 'explore everything', 'talk to everybody', 'read everything', 'who here is a visitor', 'look at their faces carl', 'everyone here is SUSPICIOUS'],
  hack: ['hacker', 'im in', 'hackerman', 'read the emails', 'turn off the cameras'],
  read: ['lore', 'reading is gameplay', 'skip', 'no read it', 'write that down'],
  idle: ['carl?', 'what are we doing', 'go left', 'go right', 'is this game finished', 'how is this a 1995 game', 'this game is so good', 'this game shouldnt exist', 'what year did this come out', 'whats the pretend soft logo', 'the music in this', 'the lighting tho', 'is this the x68000', 'is carl ok', 'feed carl', 'carl you look hungry', 'be normal carl', 'normal human moment', 'L.A. at night is a vibe', 'who is deb', 'deep night is my favorite show', 'is that a vtuber', 'carl is a vtuber (real)', 'nobody believes us lol', 'what species is carl', 'my money is on grey', 'he is obviously a martian', 'pod person behavior', 'mothman when', 'pilot x knows something', 'spoilers'],
  lockpick: ['click click', 'lockpicking skill paying off', 'just use the multitool'],
  loot: ['loot goblin', 'take it all', 'inventory tetris', 'yoink'],
};
let chatIdle = 300;
function chatReact(kind, e) { const set = CHATR[kind]; if (!set) return; const n = kind === 'kill' || kind === 'death' || kind === 'alarm' ? 2 + rnd(3) : 1; for (let k = 0; k < n; k++) setTimeout(() => chatSay(pick(set), 1), k * 350 + rnd(300)); }
function chatTick() { if (--chatIdle <= 0) { chatIdle = 400 + rnd(900); chatSay(pick(CHATR.idle), 1); if (rnd(40) === 0) chatSay(pick(['it is not 1995', 'who is watching this', 'the parcel is still in transit', 'hello carl', 'the box is not empty', 'something in the box ticks']), 1, '[[[[['); } }
// infolink: non-blocking radio messages with a portrait
const IL = { q: [], cur: null };
function infolink(who, s, o = {}) { const p = new Promise(r => IL.q.push({ who, s, r, o, hub: G.hub, at: G.t })); return p; }
function infolinkTick() {
  const c = IL.cur; if (!c) { // stale messages (from another hub, or queued too long ago) are logged and skipped
    while (IL.q.length && (IL.q[0].hub !== G.hub || G.t - IL.q[0].at > 90) && !IL.q[0].o.keep) { const d = IL.q.shift(); logConv(spk(d.who).name + ' (INFOLINK): ' + d.s); d.r(); }
    if (IL.q.length) { IL.cur = IL.q.shift(); IL.cur.n = 0; IL.cur.t = 0; sfx('infolink'); logConv(spk(IL.cur.who).name + ' (INFOLINK): ' + IL.cur.s); } return; }
  c.n += 1.2; c.t++; const len = c.s.length; if (c.n < len && frame % 3 === 0 && c.s[c.n | 0] !== ' ') sfx('blip', spk(c.who).voice || [600, 40]);
  if (c.n >= len && c.t > len / 1.2 + 90 + len * (IL.q.length ? .7 : 1.1)) { IL.cur = null; c.r(); }
}
// ---------- speakers ----------
const SPK = {};
function spk(id) { return SPK[id] || { name: id, col: WHITE, voice: [600, 40] }; }
function defSpeaker(id, o) { SPK[id] = Object.assign({ name: id, col: WHITE, voice: [600, 40] }, o); }

// ---------- portraits ----------
const PORT = {};
function drawPortrait(id, x, y, w, h, o = {}) {
  let b = (SPK[id] && SPK[id].port && PORT[SPK[id].port] && PORT[SPK[id].port].painted ? PORT[SPK[id].port] : null) || PORT[id] || (SPK[id] && PORT[SPK[id].port]); if (!b) b = PORT._ || null;
  rectF(x, y, w, h, hex('#05070c')); if (b && b.painted) { const c = (SPK[id] && SPK[id].col) || UIC.line; gradV(x, y, w, h, mix(c, BLACK, .62), mix(c, BLACK, .92), 8); for (let yy = y; yy < y + h; yy += 3) rectA(x, yy, w, 1, BLACK, .2); } if (b) { for (let j = 0; j < h; j++) { const sy = (j * b.h / h) | 0; for (let i = 0; i < w; i++) { const sx = ((o.flip ? w - 1 - i : i) * b.w / w) | 0, c = b.d[sy * b.w + sx]; if (c) pset(x + i, y + j, c); } } }
  frameR(x - 1, y - 1, w + 2, h + 2, UIC.line); if (o.static) for (let k = 0; k < 40; k++) pset(x + rnd(w), y + rnd(h), WHITE);
}

// ---------- the HUD ----------
function partCol(v) { return v > 66 ? hex('#30e060') : v > 33 ? hex('#f0d020') : v > 0 ? hex('#f04020') : hex('#3a1010'); }
function drawBody(x, y) { // Carl's silhouette, big head and all, each part coloured by health
  const p = P.parts; ellF(x + 10, y + 5, 7, 5, partCol(p.head)); rectF(x + 6, y + 11, 9, 10, partCol(p.torso)); rectF(x + 2, y + 11, 3, 9, partCol(p.armL)); rectF(x + 16, y + 11, 3, 9, partCol(p.armR)); rectF(x + 6, y + 22, 4, 9, partCol(p.legL)); rectF(x + 11, y + 22, 4, 9, partCol(p.legR));
  if (P.lastHurt && P.lastHurt.t > 0) { P.lastHurt.t--; }
}
function drawHUD() {
  if (!P || !P.map) return; const M = P.map;
  // crosshair
  if (OPT.crosshair && MOUSE.on && !G.ui && !P.dead) { const it = heldWeapon(), wp = it ? WPN[ITEMS[it.id].weapon] : null; const sp = wp && !wp.melee ? playerSpread(wp, it) : 0, g = 3 + sp * 60, mx = MOUSE.x | 0, my = MOUSE.y | 0;
    let col = hex('#e0e0e0'); for (const s of SHOWN.actors) if (s.a !== P && MOUSE.x > s.x - s.w / 2 && MOUSE.x < s.x + s.w / 2 && MOUSE.y > s.y && MOUSE.y < s.y + s.h && !s.a.dead) col = hostileTo(s.a, P) ? UIC.red : hex('#40ff60');
    rectF(mx - g - 4, my, 4, 1, col); rectF(mx + g + 1, my, 4, 1, col); rectF(mx, my - g * .6 - 3, 1, 3, col); rectF(mx, my + g * .6 + 1, 1, 3, col);
    if (P.augOn.target) for (const s of SHOWN.actors) if (s.a !== P && !s.a.dead && Math.hypot(MOUSE.x - s.x, MOUSE.y - s.y - s.h / 2) < 20) { const a = s.a; text((a.name || '') + ' ' + Math.max(0, Math.round(a.hp / a.hpMax * 100)) + '%', mx + 8, my + 6, col, INK); if (a.wpn && WPN[a.wpn]) text(WPN[a.wpn].name, mx + 8, my + 14, UIC.dim, INK); } }
  // body + bio
  rectA(2, 2, 66, 46, UIC.bg, .6); frameR(2, 2, 66, 46, UIC.line); drawBody(6, 6);
  { const vc = hex(SP().col); text('VIT', 32, 4, vc, 0); rectF(32, 12, 32, 4, hex('#200810')); rectF(32, 12, Math.round(P.bio * .32), 4, P.bio < 15 && (frame >> 3) & 1 ? UIC.red : vc);
    for (let k = 0; k < 5; k++) { const on = k < (P.viol || 0); rectF(32 + k * 6, 19, 5, 4, on ? UIC.red : hex('#203040')); if (on) pset(34 + k * 6, 20, WHITE); }
    text('HUM ' + (P.hum === undefined ? 7 : P.hum), 32, 26, (P.hum || 7) <= 3 ? UIC.red : UIC.txt, 0); }
  if (tAt(M, P.x, P.y) === T_DEEP || P.breath < 100) { rectF(32, 36, 32, 3, hex('#102030')); rectF(32, 36, Math.round(P.breath * .32), 3, hex('#80c0ff')); }
  if (P.freak) text('FREAKOUT', 6, 40, (frame >> 2) & 1 ? UIC.red : UIC.amber, INK);
  if (P.crouch) text('CROUCH', 30, 38, UIC.dim, 0);
  if (M.alarm > 0 && (frame >> 4) & 1) text('ALARM', 74, 4, UIC.red, INK);
  // stealth eye: how visible Carl is right now
  { const v = clamp(playerVisibility(), 0, 1.2); const ex = 74, ey = 14; ellF(ex + 7, ey + 3, 7, 3, hex('#101820')); ellF(ex + 7, ey + 3, Math.max(1, v * 6), 2.4, v > .7 ? hex('#ff6040') : v > .35 ? hex('#f0d020') : hex('#40a0ff')); frameR(ex, ey - 1, 15, 9, UIC.line);
    let sus = 0; for (const e of M.ents) if (e.k === 'npc' && !e.dead && !e.down && hostileTo(e, P)) sus = Math.max(sus, e.state === 'combat' ? 2 : e.sus); if (sus >= 2) text('!', ex + 18, ey, UIC.red, INK); else if (sus > .05) text('?', ex + 18, ey, UIC.amber, INK); }
  // messages
  let my = 52; for (const m of G.msg) { if (m.t > 0) { m.t--; text(m.s, 4, my, m.t < 40 ? UIC.dim : UIC.txt, INK); my += 9; } }
  // augs (right column)
  const hk = augHotkeys(); hk.forEach((id, k) => { const y = 4 + k * 12, on = P.augOn[id]; rectA(W - 72, y, 70, 11, on ? hex('#183a28') : UIC.bg, .75); frameR(W - 72, y, 70, 11, on ? UIC.grn : UIC.line); text('F' + (k + 1), W - 70, y + 2, on ? UIC.grn : UIC.dim, 0); text(AUGS[id].name.slice(0, 9), W - 56, y + 2, on ? WHITE : UIC.dim, 0); });
  // infolink
  const c = IL.cur; if (c) { const s = spk(c.who), x = 112, y = 4, w = 290; box(x, y, w, 44, 'INFOLINK: ' + s.name, { tc: s.col }); drawPortrait(c.who, x + 3, y + 12, 30, 30, { static: frame % 40 < 3 }); const ls = wrapT(c.s.slice(0, c.n | 0), 41), from = Math.max(0, ls.length - 4); ls.slice(from).forEach((l, i) => text(l, x + 34, y + 13 + i * 8, UIC.txt, 0)); }
  // chat (bottom right)
  if (OPT.chat) { const cw = 150, ch = OPT.chat === 2 ? 110 : 58, cx = W - cw - 2, cy = H - 26 - ch; rectA(cx, cy, cw, ch, hex('#06080e'), .62); frameR(cx, cy, cw, ch, hex('#22304a')); text('CHAT', cx + 3, cy + 2, hex('#a070ff'), 0); text(G.viewers + ' watching', cx + 40, cy + 2, UIC.dim, 0);
    const lines = []; for (let k = CHATLOG.length - 1; k >= 0 && lines.length < (ch - 12) / 8; k--) { const m = CHATLOG[k], ls = wrapT(m.u + ': ' + m.s, 24); for (let j = ls.length - 1; j >= 0 && lines.length < (ch - 12) / 8; j--) lines.unshift({ s: ls[j], c: j === 0 ? m.c : UIC.txt, u: j === 0 ? m.u.length + 1 : 0 }); }
    lines.forEach((l, i) => { const y = cy + 11 + i * 8; if (l.u) { text(l.s.slice(0, l.u), cx + 3, y, l.c, 0); text(l.s.slice(l.u), cx + 3 + l.u * 6, y, UIC.txt, 0); } else text(l.s, cx + 3, y, UIC.txt, 0); }); }
  // belt
  const bx = 4, by = H - 22; for (let k = 1; k <= 10; k++) { const s = k % 10, x = bx + (k - 1) * 30, it = P.belt[s] && itemByUid(P.belt[s]), sel = it && P.held === it;
    rectA(x, by, 28, 20, sel ? hex('#203a5a') : UIC.bg, .8); frameR(x, by, 28, 20, sel ? UIC.hi : UIC.line); text(String(s), x + 2, by + 2, sel ? UIC.hi : UIC.dim, 0);
    if (it) { const ic = iconOf(it.id), sc = Math.min(1, 24 / ic.w, 14 / ic.h); for (let j = 0; j < ic.h * sc; j++) for (let i = 0; i < ic.w * sc; i++) { const cc = ic.d[((j / sc) | 0) * ic.w + ((i / sc) | 0)]; if (cc) pset(x + 3 + i + (24 - ic.w * sc) / 2, by + 4 + j, cc); } if (it.n > 1) text(String(it.n), x + 28 - tw(String(it.n)), by + 12, WHITE, INK); } }
  // ammo
  { const it = heldWeapon(); const x = bx + 302; rectA(x, by, 74, 20, UIC.bg, .8); frameR(x, by, 74, 20, UIC.line);
    if (it) { const w = WPN[ITEMS[it.id].weapon]; text(w.name.slice(0, 12), x + 3, by + 2, UIC.txt, 0); if (w.ammo && !w.thrown) { const a = ammoType(it); text((P.reloadT > 0 ? 'RELOAD' : it.clip + '/' + (P.ammo[a] || 0)), x + 3, by + 11, it.clip ? UIC.hi : UIC.red, 0); text(AMMO[a].name.slice(0, 5), x + 44, by + 11, UIC.dim, 0); } else if (w.thrown) text('x' + (P.ammo[w.ammo[0]] || 0), x + 3, by + 11, UIC.hi, 0); }
    else if (P.held) text(ITEMS[P.held.id].name.slice(0, 12), x + 3, by + 6, UIC.txt, 0); else text('HANDS', x + 3, by + 6, UIC.dim, 0);
    text(fmtc(P.cred), x + 78, by + 6, hex('#80e080'), INK); }
  // frob prompt
  if (FROB && FROB.label && !G.ui) { const [v, n] = FROB.label, s = '[E] ' + v + (n ? ': ' + n : ''); const w = tw(s) + 10, x = (W - w) >> 1, y = H - 40; rectA(x, y, w, 11, UIC.bg, .8); frameR(x, y, w, 11, UIC.hi); text(s, x + 5, y + 2, UIC.hi, 0);
    // DX brackets around the thing
    const fx = FROB.x * TW - G.cam.x, fy = FROB.y * TH - G.cam.y - 10, r = 10; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { rectF(fx + sx * r - (sx > 0 ? 3 : 0), fy + sy * r * .8, 4, 1, UIC.hi); rectF(fx + sx * r - (sx > 0 ? 0 : 0), fy + sy * r * .8 - (sy > 0 ? 3 : 0), 1, 4, UIC.hi); } }
  if (P.busy) { const b = P.busy, x = 200, y = H - 54; box(x, y, 112, 12); rectF(x + 2, y + 2, Math.round(108 * b.t), 8, UIC.amber); text(b.kind === 'pick' ? 'PICKING ' + Math.round((b.target.str || 0) * 100) + '%' : 'BYPASSING ' + Math.round((b.target.str || 0) * 100) + '%', x + 6, y + 3, WHITE, INK); }
  if (P.carry) text('CARRYING ' + (P.carry.name || 'BODY'), 200, H - 52, UIC.amber, INK);
  if (P.feeding) { const e = P.feeding.e, x = 196, y = H - 66, v = clamp(e.vit / 100, 0, 1); box(x, y, 120, 22, 'FEEDING: ' + SP().feed, { tc: hex(SP().col) }); rectF(x + 3, y + 13, 114, 5, hex('#200810')); rectF(x + 3, y + 13, Math.round(114 * v), 5, e.vit <= 0 ? UIC.red : hex(SP().fx)); if (e.vit <= 0 && (frame >> 3) & 1) ctext('LET GO', y - 9, UIC.red, INK); }
  else if (!G.ui && !P.freak) { const e = feedTarget(M); if (e && !canFeed(e) && !e.down || (e && e.down && !e.dead && !canFeed(e))) { const s = '[F] FEED' + (e.name ? ': ' + e.name : ''); const w = tw(s) + 10, x = (W - w) >> 1, y = H - 52; rectA(x, y, w, 11, UIC.bg, .8); frameR(x, y, w, 11, hex(SP().col)); text(s, x + 5, y + 2, hex(SP().col), 0); } }
  if (P.drone) { ctext('LITTLE CARL  [FIRE] EMP  [E] RECALL', 60, UIC.grn, INK); }
  if (P.lastHurt && P.lastHurt.t > 0 && P.lastHurt.from !== null) { const a = P.lastHurt.from, sx = P.x * TW - G.cam.x + Math.cos(a) * 40, sy = P.y * TH - G.cam.y - 12 + Math.sin(a) * 26; rectF(sx - 2, sy - 1, 5, 3, UIC.red); }
  if (G.hubName && G.hubT > 0) { G.hubT--; const a = Math.min(1, G.hubT / 30); if (a > .1) { box(W / 2 - 120, 70, 240, 34); ctext(G.hubName, 78, UIC.hi, 0); ctext(G.hubSub || '', 90, UIC.txt, 0); } }
}

// ---------- modal UI runner ----------
// a modal is an async function; while G.ui is set the world is frozen and UIDRAW paints on top
const UIDRAW = [];
// a frame whose input was polled after now: a waiter added during update resolves in that same frame, while the opening tap is still visible
async function freshFrame() { const f0 = frame; do await nextFrame(); while (frame === f0); }
async function modal(draw, step) { // step() returns undefined to keep going, anything else to finish
  const m = { draw }; UIDRAW.push(m); G.ui = (G.ui || 0) + 1; let r;
  try { await freshFrame(); for (;;) { r = step(); if (r !== undefined) break; await nextFrame(); } }
  finally { UIDRAW.splice(UIDRAW.indexOf(m), 1); G.ui--; }
  return r;
}
function drawModals() { for (const m of UIDRAW) m.draw(); if (MOUSE.on && UIDRAW.length) { rectF(MOUSE.x | 0, MOUSE.y | 0, 1, 6, WHITE); rectF(MOUSE.x | 0, MOUSE.y | 0, 4, 1, WHITE); pset(MOUSE.x + 1, MOUSE.y + 1, WHITE); pset(MOUSE.x + 2, MOUSE.y + 2, WHITE); } }
const backTap = () => tapAny('Escape', 'Backspace') || MOUSE.rclick;

// ---------- reading ----------
async function readText(id, e) {
  const t = typeof id === 'string' ? TEXTS[id] : id; if (!t) { msg('Nothing written here.'); return; }
  const title = t.title || 'DATACUBE', body = typeof t.text === 'function' ? t.text() : t.text, lines = wrapT(body, 66); let sc = 0;
  if (t.onRead) t.onRead(); if (e && e.onRead) e.onRead(); if (t.note) addNote(t.note); if (t.code) learnCode(t.code); if (t.login) learnLogin(...t.login); if (t.logins) for (const l of t.logins) learnLogin(...l); if (!F['read_' + (t.id || title)]) { F['read_' + (t.id || title)] = 1; if (rnd(3) === 0) chatReact('read'); }
  sfx('read');
  await modal(() => { box(40, 20, 432, 212, title); const vis = lines.slice(sc, sc + 20); vis.forEach((l, i) => text(l, 50, 36 + i * 9, UIC.txt, 0)); if (lines.length > 20) text((sc + 1) + '-' + Math.min(lines.length, sc + 20) + '/' + lines.length, 420, 224, UIC.dim, 0); text('[ESC] CLOSE', 48, 222, UIC.dim, 0); },
    () => { if (tapAny('ArrowDown', 'KeyS') || MOUSE.wheel > 0) sc = Math.min(Math.max(0, lines.length - 20), sc + 3); if (tapAny('ArrowUp', 'KeyW') || MOUSE.wheel < 0) sc = Math.max(0, sc - 3); if (backTap() || tapAny('Enter', 'KeyE', 'Space') || (MOUSE.click && !inRect(40, 20, 432, 212))) return 1; });
}
function addNote(s) { if (P.notes.includes(s)) return; P.notes.unshift(s); msg('NOTE ADDED'); sfx('note'); }
function learnCode(c) { P.codes[c] = 1; }
function learnLogin(u, p) { if (!P.logins.find(l => l[0] === u && l[1] === p)) P.logins.push([u, p]); }
// ---------- goals ----------
function goal(id, s, sec) { if (P.goals.find(g => g.id === id)) return; P.goals.unshift({ id, s, done: 0, sec: !!sec, hub: G.hub }); msg((sec ? 'SECONDARY' : 'GOAL') + ': ' + s); sfx('goal'); }
function goalDone(id, sp) { if (F['gd_' + id]) return; F['gd_' + id] = 1; const g = P.goals.find(g => g.id === id); if (!g) { if (sp) giveSP(sp); return; } if (g.done) return; g.done = 1; msg('COMPLETED: ' + g.s); sfx('goal'); if (sp) giveSP(sp); }
function goalFail(id) { const g = P.goals.find(g => g.id === id); if (g && !g.done) { g.done = -1; msg('FAILED: ' + g.s); } }
const hasGoal = id => P.goals.find(g => g.id === id), goalIsDone = id => !!F['gd_' + id];

// ---------- the tabbed screens (inventory, augs, skills, goals, notes, map, log) ----------
const TABS = ['INVENTORY', 'GIFTS', 'SKILLS', 'GOALS', 'NOTES', 'MAP', 'LOG'];
async function openScreen(tab = 'inventory') {
  let ti = Math.max(0, TABS.indexOf(tab.toUpperCase())), sel = null, cur = [0, 0], sk_i = 0, aug_i = 0, sc = 0, assign = null; sfx('menu');
  const R = { x: 6, y: 6, w: 500, h: 244 };
  const draw = () => {
    rectA(0, 0, W, H, hex('#000008'), .55); box(R.x, R.y, R.w, R.h);
    TABS.forEach((t, i) => { const x = R.x + 4 + i * 70; if (btn(x, R.y + 3, 66, t, { sel: i === ti })) { ti = i; sc = 0; } });
    const T = TABS[ti], x0 = R.x + 6, y0 = R.y + 20;
    if (T === 'INVENTORY') drawInv(x0, y0); else if (T === 'GIFTS') drawAugs(x0, y0); else if (T === 'SKILLS') drawSkills(x0, y0); else if (T === 'GOALS') drawGoals(x0, y0); else if (T === 'NOTES') drawNotes(x0, y0); else if (T === 'MAP') drawAutomap(x0, y0); else drawLog(x0, y0);
    text('[TAB] NEXT  [ESC] CLOSE', R.x + R.w - 150, R.y + R.h - 10, UIC.dim, 0);
  };
  // --- inventory ---
  const CW = 26, CH = 16;
  const drawInv = (x0, y0) => {
    for (let y = 0; y < GRID_H; y++) for (let x = 0; x < GRID_W; x++) { rectF(x0 + x * CW, y0 + y * CH, CW - 1, CH - 1, hex('#101828')); if (cur[0] === x && cur[1] === y && !MOUSE.on) frameR(x0 + x * CW - 1, y0 + y * CH - 1, CW + 1, CH + 1, UIC.dim); }
    for (const it of P.inv) { const d = ITEMS[it.id], ic = iconOf(it.id), x = x0 + it.x * CW, y = y0 + it.y * CH; rectF(x, y, d.w * CW - 1, d.h * CH - 1, sel === it ? hex('#2a4a7a') : hex('#18243c')); blit(ic, x + ((d.w * CW - ic.w) >> 1), y + ((d.h * CH - ic.h) >> 1));
      if (it.n > 1) text(String(it.n), x + d.w * CW - 1 - tw(String(it.n)), y + d.h * CH - 9, WHITE, INK); const bs = P.belt.indexOf(it.uid); if (bs >= 0) text(String(bs), x + 1, y + 1, UIC.hi, INK); if (P.held === it) frameR(x, y, d.w * CW - 1, d.h * CH - 1, UIC.grn);
      if (inRect(x, y, d.w * CW, d.h * CH) && MOUSE.click) { if (sel && ITEMS[sel.id].mod && d.weapon && sel !== it) { applyMod(sel, it); sel = null; } else sel = it; } }
    // info panel
    const ix = x0 + GRID_W * CW + 8, iw = R.w - (ix - R.x) - 8; box(ix, y0, iw, 128, sel ? ITEMS[sel.id].name : 'INVENTORY');
    if (sel) { const d = ITEMS[sel.id]; let ly = y0 + 14; ly += wrapText(d.desc || '', ix + 4, ly, Math.floor((iw - 8) / 6), UIC.txt, 9, 7) * 9 + 3;
      if (d.weapon) { const w = WPN[d.weapon]; text('DMG ' + (w.dmg * (w.pellets || 1)) + '  SKILL ' + SKILLS[w.skill].name.replace('WEAPONS: ', ''), ix + 4, ly, UIC.dim, 0); ly += 9; if (w.clip) text('CLIP ' + clipSize(sel) + '  AMMO ' + w.ammo.map(a => AMMO[a].name.split(' ')[0]).join('/'), ix + 4, ly, UIC.dim, 0); ly += 9; const mods = Object.entries(sel.mods || {}).filter(([, v]) => v).map(([k, v]) => k.toUpperCase() + (v > 1 ? v : '')); if (mods.length) text('MODS: ' + mods.join(' '), ix + 4, ly, UIC.cyan, 0); }
      if (sel.charge !== undefined) text('CHARGE ' + Math.round(sel.charge) + '%' + (P.charged[sel.id] && P.charged[sel.id].on ? '  ON' : ''), ix + 4, ly, UIC.cyan, 0);
      const by = y0 + 104; let bx = ix + 4;
      if (d.use && btn(bx, by, 42, 'USE', { key: 'Enter' })) { useItem(sel); if (!P.inv.includes(sel)) sel = null; } bx += 46;
      if ((d.weapon || d.tool || d.use) && btn(bx, by, 48, 'EQUIP', { key: 'KeyE' })) { autoBelt(sel); P.held = sel; msg('EQUIPPED ' + d.name); } bx += 52;
      if (d.mod) { text('CLICK A WEAPON TO APPLY', ix + 4, by - 10, UIC.hi, 0); }
      if (btn(bx, by, 44, 'DROP', { key: 'Delete' })) { if (sel.id === 'idcard' || d.quest) msg("Carl won't drop that."); else { dropItem(sel); sel = null; } }
      if (sel && !d.mod) for (let k = 0; k <= 9; k++) if (tap('Digit' + k)) { for (let j = 0; j < 10; j++) if (P.belt[j] === sel.uid) P.belt[j] = null; P.belt[k] = sel.uid; msg('BELT ' + k + ': ' + d.name); }
      if (sel) text('[1-0] PUT ON BELT', ix + 4, by + 14, UIC.dim, 0); }
    else { let ly = y0 + 14; text('CREDITS ' + fmtc(P.cred), ix + 4, ly, hex('#80e080'), 0); ly += 10; text('AMMO', ix + 4, ly, UIC.hi, 0); ly += 9; let col = 0; for (const a in P.ammo) if (P.ammo[a] > 0) { text(AMMO[a].name.slice(0, 13) + ' ' + P.ammo[a], ix + 4 + (col % 2) * 92, ly + ((col / 2) | 0) * 8, UIC.txt, 0); col++; } }
    // nanokeys + body
    const ky = y0 + 134; box(ix, ky, iw, R.y + R.h - ky - 14, 'KEYS'); let k = 0; for (const id in P.keys) { if (k < 9) text(KEYNAMES[id] || id, ix + 4, ky + 13 + k * 8, UIC.txt, 0); k++; } if (!k) text('(empty)', ix + 4, ky + 13, UIC.dim, 0);
    const hy = y0 + GRID_H * CH + 6; box(x0, hy, GRID_W * CW, R.y + R.h - hy - 14, 'HEALTH'); drawBody(x0 + 6, hy + 14); const p = P.parts; [['HEAD', p.head], ['TORSO', p.torso], ['L ARM', p.armL], ['R ARM', p.armR], ['L LEG', p.legL], ['R LEG', p.legR]].forEach(([n, v], i) => text(n + ' ' + Math.round(v), x0 + 40 + (i % 2) * 70, hy + 14 + ((i / 2) | 0) * 10, partCol(v), 0));
    text('VITALITY ' + Math.round(P.bio) + '%', x0 + 40, hy + 46, hex(SP().col), 0); if (P.pillT > 0) text('PROP PILLS ACTIVE', x0 + 100, hy + 46, hex('#ff80c0'), 0);
    if (!MOUSE.on) { if (tap('ArrowRight')) cur[0] = Math.min(GRID_W - 1, cur[0] + 1); if (tap('ArrowLeft')) cur[0] = Math.max(0, cur[0] - 1); if (tap('ArrowDown')) cur[1] = Math.min(GRID_H - 1, cur[1] + 1); if (tap('ArrowUp')) cur[1] = Math.max(0, cur[1] - 1); sel = P.inv.find(it => cur[0] >= it.x && cur[0] < it.x + ITEMS[it.id].w && cur[1] >= it.y && cur[1] < it.y + ITEMS[it.id].h) || null; }
  };
  // --- gifts: the species, its feeding, three gifts ---
  const drawAugs = (x0, y0) => {
    const S = SP(), sc = hex(S.col), ids = S.gifts;
    text('SPECIES: ' + S.name + '  (PROVISIONAL)', x0, y0, sc, 0); text('XP: ' + P.sp, x0 + 300, y0, UIC.hi, 0);
    text('FEEDS ON: ' + S.feed, x0, y0 + 11, UIC.txt, 0); wrapText(S.feedVerb, x0 + 120, y0 + 11, 44, UIC.dim, 9, 2);
    text('VITALITY ' + Math.round(P.bio) + '%   HUMANITY ' + (P.hum === undefined ? 7 : P.hum) + '/10   NORMALCY BREACHES ' + (P.viol || 0) + '/5', x0, y0 + 32, UIC.txt, 0);
    ids.forEach((id, i) => { const y = y0 + 46 + i * 34, l = augLvl(id), on = P.augOn[id], a = AUGS[id];
      rectF(x0, y, 360, 30, aug_i === i ? hex('#2a2040') : hex('#16142a')); frameR(x0, y, 360, 30, on ? UIC.grn : aug_i === i ? sc : UIC.line);
      text((l ? 'F' + (augHotkeys().indexOf(id) + 1) + '  ' : '') + a.name, x0 + 4, y + 3, l ? WHITE : UIC.dim, 0); text(a.kind === 'cast' ? 'COST ' + a.cost : 'DRAIN ' + a.drain + '/s', x0 + 230, y + 3, UIC.dim, 0);
      for (let k = 0; k < 5; k++) { rectF(x0 + 4 + k * 12, y + 15, 10, 6, k < l ? sc : hex('#3c3c66')); frameR(x0 + 4 + k * 12, y + 15, 10, 6, hex('#5a5a90')); }
      if (l < 5) { if (btn(x0 + 74, y + 14, 130, (l ? 'RAISE ' : 'LEARN ') + GIFT_COST[l] + ' XP', { dis: P.sp < GIFT_COST[l] })) raiseGift(id); } else text('MASTERED', x0 + 80, y + 16, UIC.grn, 0);
      if (l && a.kind === 'toggle' && btn(x0 + 212, y + 14, 70, on ? 'TURN OFF' : 'TURN ON')) toggleAug(id);
      if (inRect(x0, y, 360, 30) && MOUSE.click) aug_i = i; });
    text('[F] FEED (HOLD)   [Q] MEND (HOLD): VITALITY INTO HEALTH', x0, y0 + 152, UIC.txt, 0);
    wrapText(S.desc, x0, y0 + 166, 60, UIC.dim, 9, 6);
    const id = ids[Math.min(aug_i, 2)], a = AUGS[id], ix = x0 + 370; box(ix, y0 + 44, 118, 156, a.name, { tc: sc }); wrapText(a.desc + (a.visible ? ' VISIBLE: humans who see it count as a breach.' : ''), ix + 4, y0 + 58, 18, UIC.txt, 9, 16);
    if (tap('ArrowDown')) aug_i = Math.min(2, aug_i + 1); if (tap('ArrowUp')) aug_i = Math.max(0, aug_i - 1);
  };
  // --- skills ---
  const drawSkills = (x0, y0) => {
    text('XP: ' + P.sp, x0, y0, UIC.hi, 0); const ids = Object.keys(SKILLS);
    ids.forEach((id, i) => { const y = y0 + 12 + i * 16, l = sk(id), s = SKILLS[id]; rectF(x0, y, 300, 14, sk_i === i ? hex('#2a4a7a') : hex('#18243c')); text(s.name, x0 + 4, y + 4, WHITE, 0); for (let k = 0; k < 3; k++) rectF(x0 + 170 + k * 14, y + 4, 12, 6, k < l ? UIC.hi : hex('#2a3448')); text(SKILL_LV[l], x0 + 216, y + 4, UIC.dim, 0); if (inRect(x0, y, 300, 14) && MOUSE.click) sk_i = i; });
    const id = ids[sk_i], s = SKILLS[id], l = sk(id), ix = x0 + 310; box(ix, y0 + 10, 178, 190, s.name); wrapText(s.desc, ix + 4, y0 + 24, 28, UIC.txt, 9, 12);
    if (l < 3) { text('NEXT: ' + SKILL_LV[l + 1] + ' ' + s.cost[l], ix + 4, y0 + 150, UIC.hi, 0); if (btn(ix + 4, y0 + 170, 110, 'UPGRADE', { dis: P.sp < s.cost[l], key: 'Enter' })) buySkill(id); } else text('MASTERED', ix + 4, y0 + 150, UIC.grn, 0);
    if (tap('ArrowDown')) sk_i = Math.min(ids.length - 1, sk_i + 1); if (tap('ArrowUp')) sk_i = Math.max(0, sk_i - 1);
  };
  let gs = 0;   // goals list: active first, completed last, arrows scroll
  const drawGoals = (x0, y0) => {
    const rows = [], mk = (sec, h) => { rows.push({ h }); const a = P.goals.filter(g => !!g.sec === sec); for (const g of a.filter(g => !g.done)) rows.push({ g }); return a.filter(g => g.done); }, d1 = mk(false, 'PRIMARY GOALS'), d2 = mk(true, 'SECONDARY GOALS');
    if (d1.length + d2.length) rows.push({ h: 'COMPLETED' }); for (const g of d1.concat(d2)) rows.push({ g });
    gs = Math.max(0, Math.min(rows.length - 1, gs + (tap('ArrowDown') ? 1 : 0) - (tap('ArrowUp') ? 1 : 0))); let y = y0;
    for (let i = gs; i < rows.length; i++) { const r = rows[i]; if (y > R.y + R.h - 30) { text('[UP/DOWN] MORE...', x0, R.y + R.h - 10, UIC.hi, 0); break; }
      if (r.h) { if (i > gs) y += 3; text(r.h, x0, y, UIC.hi, 0); y += 10; } else { const g = r.g, n = wrapText((g.done === 1 ? '[X] ' : g.done === -1 ? '[-] ' : '[ ] ') + g.s, x0 + 4, y, 78, g.done ? UIC.dim : UIC.txt, 9, 3); y += n * 9 + 2; } }
    if (gs > 0) text('^ MORE', x0 + 400, y0 - 10, UIC.hi, 0); };
  const drawNotes = (x0, y0) => { const all = []; for (const n of P.notes) for (const l of wrapT('- ' + n, 80)) all.push(l); if (!all.length) all.push('(Codes, logins and things people tell you end up here.)'); all.slice(sc, sc + 24).forEach((l, i) => text(l, x0, y0 + i * 9, UIC.txt, 0)); if (MOUSE.wheel || tap('ArrowDown') || tap('ArrowUp')) sc = clamp(sc + (MOUSE.wheel || (tap('ArrowDown') ? 3 : -3)), 0, Math.max(0, all.length - 24)); };
  const drawLog = (x0, y0) => { const all = []; for (const s of CONVLOG) for (const l of wrapT(s, 80)) all.push(l); const n = 24, start = Math.max(0, all.length - n - sc); all.slice(start, start + n).forEach((l, i) => text(l, x0, y0 + i * 9, UIC.txt, 0)); if (MOUSE.wheel || tap('ArrowDown') || tap('ArrowUp')) sc = clamp(sc - (MOUSE.wheel || (tap('ArrowDown') ? 3 : -3)), 0, Math.max(0, all.length - n)); };
  const drawAutomap = (x0, y0) => { const M = P.map, mw = 486, mh = 210, s = Math.min(mw / M.w, mh / M.h, 6), sx = x0 + (mw - M.w * s) / 2, sy = y0 + (mh - M.h * s) / 2;
    text(M.d.name || M.id, x0, y0 - 2, UIC.hi, 0);
    for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) { const i = y * M.w + x; if (!M.seen[i]) continue; const t = M.t[i]; const c = t === T_WALL ? hex('#6a8ab0') : t === T_DOOR ? hex('#ffd24a') : t === T_WATER || t === T_DEEP ? hex('#2a4a8a') : t === T_VENT ? hex('#8a6a3a') : t === T_WIN || t === T_FENCE ? hex('#4a6a8a') : hex('#1a2438'); rectF(sx + x * s, sy + y * s, Math.ceil(s), Math.ceil(s), c); }
    for (const e of M.ents) if (e.k === 'exit' && M.seen[(e.y | 0) * M.w + (e.x | 0)]) { rectF(sx + e.x * s - 1, sy + e.y * s - 1, 3, 3, UIC.grn); }
    if ((frame >> 3) & 1) rectF(sx + P.x * s - 1, sy + P.y * s - 1, 3, 3, UIC.red);
    for (const g of (M.d.marks || [])) if (!g.when || g.when()) { text('x', sx + g[0] * s - 2, sy + g[1] * s - 4, UIC.mag, 0); } };
  await modal(draw, () => {
    if (tap('Tab')) { ti = (ti + (key('ShiftLeft') ? TABS.length - 1 : 1)) % TABS.length; sc = 0; sfx('move'); }
    if (assign) {}
    if (backTap() || tap('KeyI') && TABS[ti] === 'INVENTORY' || tap('KeyG') && TABS[ti] === 'GOALS') return 1;
  });
}
function dropItem(it) { const M = P.map; removeItem(it, it.n || 1); spawnEnt(M, { k: 'item', item: it.id, n: it.n || 1, x: P.x + Math.cos(P.aim) * .6, y: P.y + Math.sin(P.aim) * .6, data: it }); sfx('drop'); }
function applyMod(mod, wit) { const w = WPN[ITEMS[wit.id].weapon]; if (!w.mods) { msg("That weapon can't be modified."); return; } const k = ITEMS[mod.id].mod; wit.mods = wit.mods || {}; if (['las', 'sil', 'sco'].includes(k) && wit.mods[k]) { msg('Already has one.'); return; } if ((wit.mods[k] || 0) >= 5) { msg('Maxed out.'); return; } wit.mods[k] = (wit.mods[k] || 0) + 1; removeItem(mod); msg(ITEMS[mod.id].name + ' -> ' + w.name); sfx('get'); }

// ---------- computers, ATMs, security terminals ----------
// e.comp = { accounts: [[user, pass, { mail: [ids], special: [ [label, fn] ], atm: credits }]], banner, hackStr (0..1) }
async function computerUI(e) {
  const C = e.comp || { accounts: [], banner: 'PRETEND SOFT TERMINAL' }; e.comp = C; const kind = e.p === 'atm' ? 'ATM' : e.p === 'seccomp' ? 'SECURITY' : 'COMPUTER';
  let out = null, user = '', pass = '', field = 0, acct = null, view = 'login', mailI = 0, err = '', hacking = null, detect = 0, hacked = false;
  const known = P.logins.filter(([u]) => C.accounts.some(a => a[0].toLowerCase() === u.toLowerCase()));
  sfx('boot');
  const X = 56, Y = 16, Wd = 400, Hd = 224;
  const tryLogin = (u, p) => { const a = C.accounts.find(a => a[0].toLowerCase() === u.toLowerCase() && a[1].toLowerCase() === p.toLowerCase()); if (a) { acct = a; view = 'menu'; sfx('ok'); learnLogin(a[0], a[1]); return true; } err = 'LOGIN INCORRECT'; sfx('locked'); return false; };
  const draw = () => {
    rectF(X, Y, Wd, Hd, hex('#02080a')); frameR(X, Y, Wd, Hd, hex('#40c080')); frameR(X + 2, Y + 2, Wd - 4, Hd - 4, hex('#205a40'));
    const G1 = hex('#60ff90'), G2 = hex('#30a060'); text(C.banner || (kind === 'ATM' ? 'PRETEND BANK ATM' : kind === 'SECURITY' ? 'SECURITY NET' : 'PRETEND SOFT OS 2.1'), X + 8, Y + 6, G1, 0);
    for (let y = Y + 4; y < Y + Hd; y += 2) for (let x = X + 4; x < X + Wd - 4; x += 97) pset(x + (y % 7), y, hex('#04140c'));
    if (hacking) { text('INTRUSION IN PROGRESS', X + 8, Y + 20, G1, 0); rectF(X + 8, Y + 32, 200, 6, hex('#103020')); rectF(X + 8, Y + 32, Math.round(200 * hacking.p), 6, G1); for (let k = 0; k < 14; k++) text(Math.random().toString(16).slice(2, 34), X + 8, Y + 44 + k * 9, G2, 0); return; }
    if (view === 'login') {
      text('USER:', X + 20, Y + 40, G1, 0); text(user + (field === 0 && (frame >> 4) & 1 ? '_' : ''), X + 70, Y + 40, WHITE, 0); text('PASS:', X + 20, Y + 54, G1, 0); text('*'.repeat(pass.length) + (field === 1 && (frame >> 4) & 1 ? '_' : ''), X + 70, Y + 54, WHITE, 0);
      if (err) text(err, X + 20, Y + 70, UIC.red, 0);
      if (known.length) { text('KNOWN LOGINS (NOTES):', X + 20, Y + 90, G2, 0); known.forEach(([u, p], i) => { if (btn(X + 20, Y + 100 + i * 13, 160, u.toUpperCase() + ' / ' + p.toUpperCase())) tryLogin(u, p); }); }
      if (btn(X + 20, Y + Hd - 40, 80, 'LOGIN', { key: 'Enter' })) { if (field === 0 && user && !pass) field = 1; else tryLogin(user, pass); }
      if (sk('computer') > 0 && btn(X + 110, Y + Hd - 40, 80, 'HACK', { key: 'KeyH' })) { hacking = { p: 0 }; sfx('hack'); }
      if (!sk('computer')) text('COMPUTER SKILL NEEDED TO HACK', X + 110, Y + Hd - 38, G2, 0);
      text('TYPE TO ENTER, TAB SWITCHES FIELD, ESC LEAVES', X + 20, Y + Hd - 16, G2, 0);
      return; }
    if (hacked && C.hackT !== undefined) { rectF(X + Wd - 110, Y + 6, 100, 5, hex('#301010')); rectF(X + Wd - 110, Y + 6, Math.round(100 * detect), 5, UIC.red); text('TRACE', X + Wd - 146, Y + 5, UIC.red, 0); }
    text('LOGGED IN: ' + (acct ? acct[0].toUpperCase() : 'ROOT'), X + 8, Y + 18, G2, 0);
    const opt = acct ? acct[2] || {} : { mail: C.accounts.flatMap(a => (a[2] || {}).mail || []), special: C.accounts.flatMap(a => (a[2] || {}).special || []), atm: C.accounts.reduce((s, a) => s + ((a[2] || {}).atm || 0), 0) };
    if (view === 'menu') {
      let y = Y + 34; const mails = opt.mail || [];
      if (mails.length) { text('MAIL', X + 12, y, G1, 0); y += 10; mails.forEach((id, i) => { const m = MAIL[id]; if (!m) return; if (btn(X + 12, y, Wd - 24, (m.from || '').toUpperCase().slice(0, 16).padEnd(17) + (m.subj || '').toUpperCase().slice(0, 40))) { view = 'mail'; mailI = id; if (!F['mail_' + id]) { F['mail_' + id] = 1; if (m.onRead) m.onRead(); if (m.note) addNote(m.note); if (m.login) learnLogin(...m.login); } sfx('read'); } y += 13; }); y += 4; }
      for (const [label, fn, cond] of opt.special || []) { if (cond && !cond()) continue; if (btn(X + 12, y, Wd - 24, label.toUpperCase())) { const r = fn(e); if (r) msg(r); } y += 13; }
      if (opt.atm) { const left = opt.atm - (e.withdrawn || 0); if (btn(X + 12, y, Wd - 24, left > 0 ? 'WITHDRAW ' + fmtc(left) : 'ACCOUNT EMPTY', { dis: left <= 0 })) { P.cred += left; e.withdrawn = opt.atm; msg('+' + fmtc(left)); sfx('vend'); } y += 13; }
      if (btn(X + 12, Y + Hd - 18, 70, 'LOGOUT', { key: 'Escape' })) out = 'out';
    } else if (view === 'mail') { const m = MAIL[mailI]; text('FROM: ' + (m.from || '').toUpperCase(), X + 12, Y + 32, G1, 0); text('TO: ' + (m.to || '').toUpperCase(), X + 12, Y + 41, G1, 0); text('SUBJ: ' + (m.subj || '').toUpperCase(), X + 12, Y + 50, G1, 0); wrapText(typeof m.text === 'function' ? m.text() : m.text, X + 12, Y + 64, 62, hex('#c0ffd0'), 9, 16); if (btn(X + 12, Y + Hd - 18, 60, 'BACK', { key: 'Escape' })) view = 'menu'; }
  };
  return modal(draw, () => {
    if (hacking) { hacking.p += DT * (.25 + sk('computer') * .2) / (1 + (C.hackStr || .3)); if (hacking.p >= 1) { hacking = null; hacked = true; view = 'menu'; acct = null; C.hackT = (8 + sk('computer') * 7); detect = 0; sfx('ok'); chatReact('hack'); if (!e.hackedOnce) { e.hackedOnce = 1; P.xp.hack = (P.xp.hack || 0) + 1; } } return; }
    if (hacked && C.hackT !== undefined) { detect += DT / C.hackT; if (detect >= 1) { msg('TRACE COMPLETE. DISCONNECTED.'); sfx('alarm'); hurtPlayer(4, 'zap'); if (C.alarmOnTrace) triggerAlarm(P.map, e, P.x, P.y, C.team || 'fatco'); return 'traced'; } }
    if (view === 'login') { for (const ch of TYPED) { if (ch === 'BS') { if (field === 0) user = user.slice(0, -1); else pass = pass.slice(0, -1); } else if (ch.length === 1 && /[\w\-.@!]/.test(ch)) { if (field === 0) user = (user + ch).slice(0, 20); else pass = (pass + ch).slice(0, 20); } err = ''; } if (tap('Tab')) field ^= 1; if (tap('Escape') || MOUSE.rclick) return 'out'; }
    else if (view === 'menu' && (MOUSE.rclick)) return 'out';
    if (out) return out;
  });
}
// keypads: e.code, e.door (door id in the map), e.onOpen
async function keypadUI(e) {
  let typed = ''; const X = 196, Y = 40; sfx('menu'); let res = '';
  await modal(() => { box(X, Y, 120, 150, 'KEYPAD'); rectF(X + 10, Y + 16, 100, 14, hex('#102010')); text(res || typed.replace(/./g, '*') + ((frame >> 4) & 1 ? '_' : ''), X + 14, Y + 20, res === 'ACCEPTED' ? UIC.grn : res ? UIC.red : UIC.grn, 0);
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '#']; keys.forEach((k, i) => { const bx = X + 14 + (i % 3) * 32, by = Y + 38 + ((i / 3) | 0) * 22; if (btn(bx, by, 28, k)) press(k); });
    if (hasItem('multitool') && btn(X + 10, Y + 132, 100, 'BYPASS (MULTITOOL)')) { e.bypassT = 1; } },
  () => { for (const ch of TYPED) if (/[0-9]/.test(ch)) press(ch); else if (ch === 'BS') typed = typed.slice(0, -1); if (tap('Enter')) press('#'); if (res && frame % 60 === 0 && res !== 'ACCEPTED') res = ''; if (e.bypassT) { e.bypassT = 0; return 'bypass'; } if (res === 'ACCEPTED' && e.okT-- <= 0) return 'ok'; if (backTap()) return 'out'; })
    .then(r => { if (r === 'ok' || r === 'bypass') { if (r === 'bypass') { useTools(P.map, e, 'multi', () => openKeypadTarget(e)); } else openKeypadTarget(e); } });
  function press(k) { sfx('beep'); if (k === 'C') { typed = ''; res = ''; return; } if (k === '#') { if (typed === String(e.code)) { res = 'ACCEPTED'; e.okT = 20; sfx('ok'); } else { res = 'DENIED'; typed = ''; sfx('locked'); } return; } if (typed.length < 8) typed += k; }
}
function hasItem(id) { return !!invFind(id); }
function openKeypadTarget(e) { const M = P.map; e.used = 1; learnCode(e.code); if (e.door) { const d = Object.values(M.doors).find(d => d.id === e.door); if (d) { d.unlocked = 1; openDoor(M, d, P); } } if (e.onOpen) e.onOpen(M, e); msg('ACCESS GRANTED'); }

// ---------- shops ----------
// shop = { name, items: [[id, price, qty]] , sell: true }
async function shopUI(shop, e) {
  let i = 0; sfx('menu'); const X = 70, Y = 24, Wd = 372, Hd = 200;
  await modal(() => { box(X, Y, Wd, Hd, shop.name || 'SHOP'); text('YOUR CREDITS: ' + fmtc(P.cred), X + 8, Y + 14, hex('#80e080'), 0);
    const top = Math.max(0, Math.min(i - 5, shop.items.length - 11)); if (shop.items.length > 11) text((top + 1) + '-' + Math.min(shop.items.length, top + 11) + '/' + shop.items.length, X + Wd - 70, Y + 14, UIC.dim, 0);
    shop.items.forEach(([id, price, qty], k) => { if (k < top || k >= top + 11) return; const y = Y + 26 + (k - top) * 13, d = ITEMS[id], left = qty === undefined ? 1 : qty;
      if (btn(X + 8, y, 230, (d ? d.name : id) + (left <= 0 ? ' (SOLD OUT)' : ''), { sel: k === i, dis: left <= 0 })) { i = k; buy(k); } text(fmtc(price), X + 246, y + 2, P.cred >= price ? UIC.hi : UIC.red, 0); });
    const d = shop.items[i] && ITEMS[shop.items[i][0]]; if (d) wrapText(d.desc || '', X + 8, Y + Hd - 36, 60, UIC.dim, 9, 2);
    if (btn(X + Wd - 64, Y + Hd - 16, 56, 'DONE', { key: 'Escape' })) shop._done = 1; },
  () => { if (tap('ArrowDown') || MOUSE.wheel > 0) i = Math.min(shop.items.length - 1, i + 1); if (tap('ArrowUp') || MOUSE.wheel < 0) i = Math.max(0, i - 1); if (tap('Enter')) buy(i); if (shop._done || MOUSE.rclick) { shop._done = 0; return 1; } });
  function buy(k) { const it = shop.items[k]; if (!it) return; const [id, price, qty] = it; if (qty !== undefined && qty <= 0) return; if (P.cred < price) { msg('Not enough credits.'); sfx('locked'); return; } if (!giveItem(id, 1)) return; P.cred -= price; if (qty !== undefined) it[2]--; sfx('vend'); if (shop.onBuy) shop.onBuy(id); }
}
// ---------- the medical bot and the repair bot ----------
async function medbotUI(e) {
  const cans = P.inv.filter(it => it.id === 'aug'); let sel = 0; sfx('menu');
  await modal(() => { box(80, 20, 352, 210, 'MEDICAL BOT'); if (btn(90, 36, 160, 'HEAL ALL WOUNDS')) { for (const k in P.parts) P.parts[k] = 100; sfx('heal'); msg('Healed.'); }
    text('AUGMENTATION CANISTERS: ' + cans.length, 90, 54, UIC.hi, 0);
    cans.forEach((it, k) => { const pair = it.pair || AUG_PAIRS[it.slot] || AUG_PAIRS.legs, slotName = AUG_SLOTS.find(s => s[0] === (it.slot || 'legs'))[1]; const y = 66 + k * 36; if (y > 190) return; text(slotName + ' CANISTER', 90, y, UIC.dim, 0);
      pair.forEach((id, j) => { const have = Object.keys(AUG_PAIRS).some(s => s === it.slot && AUG_PAIRS[s].some(a => augLvl(a))); if (btn(90 + j * 166, y + 10, 160, AUGS[id].name, { dis: have })) { installAug(id); removeItem(it); cans.splice(k, 1); } }); });
    if (!cans.length) text('No canisters. Find them, buy them, earn them.', 90, 70, UIC.dim, 0);
    if (btn(360, 214, 64, 'DONE', { key: 'Escape' })) e._done = 1; }, () => { if (e._done || MOUSE.rclick) { e._done = 0; return 1; } });
}
async function repairUI(e) { if (P.bio >= 100) { msg('Energy is full.'); return; } if ((e.charges === undefined ? (e.charges = 3) : e.charges) <= 0) { msg('REPAIR BOT: RECHARGING. COME BACK LATER.'); return; } e.charges--; P.bio = 100; sfx('power'); msg('BIOELECTRIC ENERGY RESTORED (' + e.charges + ' charges left)'); }

// ---------- conversations ----------
// a conversation is an async function. T(who, line) speaks; C(options) asks; the speaker portrait shows big.
const CV = { who: null, line: '', n: 0, opts: null, sel: 0, left: null, right: null, active: 0 };
let CONVLOCK = Promise.resolve();
function startConv(id, e) { const p = CONVLOCK.then(() => startConv1(id, e)); CONVLOCK = p.catch(() => {}); return p; }
async function startConv1(id, e) {
  const fn = typeof id === 'function' ? id : CONV[id]; if (!fn) { msg('...'); return; }
  CV.active = 1; CV.e = e; CV.left = e && (e.port || e.id) || null; G.ui = (G.ui || 0) + 1; if (e) { e.prevState = e.state; e.state = 'talk'; e.face = angTo(e, P); }
  try { await fn(e); } catch (er) { console.error(er); } finally { CV.active = 0; CV.who = null; CV.opts = null; G.ui--; if (e && e.state === 'talk') e.state = e.prevState === 'talk' ? 'idle' : (e.prevState || 'idle'); if (e) e.met = (e.met || 0) + 1; }
}
async function T(who, line, o = {}) {
  if (typeof o === 'string') o = { bc: o }; if (o.sp && o.sp[species()]) line = o.sp[species()]; else if (o.bc && species() === 'broadcast') line = o.bc;
  CV.who = who; CV.line = line; CV.n = 0; CV.opts = null; if (who !== 'CARL' && who !== 'N') CV.left = who; logConv((who === 'N' ? '' : spk(who).name + ': ') + line); await freshFrame();
  const v = spk(who).voice || [600, 40]; let last = -1;
  while (CV.n < line.length) { if (MOUSE.click || tapAny('Enter', 'Space', 'KeyE', 'KeyJ')) { CV.n = line.length; break; } CV.n += 1.3 * (OPT.textSpeed || 1); const i = CV.n | 0; if (i !== last && i % 2 === 0 && line[i] && line[i] !== ' ' && who !== 'N') sfx('blip', v); last = i; await nextFrame(); }
  await nextFrame(); while (!(MOUSE.click || tapAny('Enter', 'Space', 'KeyE', 'KeyJ'))) await nextFrame(); sfx('tick');
}
const N2 = (line) => T('N', line);
// options: strings, or { t, if: fn, req: ['denial', 1], hide: bool }
async function C(opts) {
  const list = opts.map((o, i) => typeof o === 'string' ? { t: o, i } : Object.assign({ i }, o)).filter(o => (!o.if || o.if()) && (!o.sp || [].concat(o.sp).includes(species()))).map(o => o.sp ? Object.assign({}, o, { t: '[' + SPECIES[species()].name + '] ' + o.t }) : o);
  const shown = list.map(o => { if (o.req) { const [s, l] = o.req; const ok = (SKILLS[s] ? sk(s) : augLvl(s)) >= l; const tag = '[' + (SKILLS[s] ? SKILLS[s].name.replace('WEAPONS: ', '') : AUGS[s].name) + '] '; return Object.assign({}, o, { t: o.t.startsWith(tag) ? o.t : tag + o.t, dis: !ok }); } return o; }).filter(o => !(o.dis && o.hide));
  CV.opts = shown; CV.sel = shown.findIndex(o => !o.dis); CV.line = ''; CV.who = 'CARL'; await nextFrame();
  for (;;) {
    if (tap('ArrowDown') || tap('KeyS')) { do CV.sel = (CV.sel + 1) % shown.length; while (shown[CV.sel].dis); sfx('move'); }
    if (tap('ArrowUp') || tap('KeyW')) { do CV.sel = (CV.sel + shown.length - 1) % shown.length; while (shown[CV.sel].dis); sfx('move'); }
    for (let k = 0; k < shown.length; k++) if (tap('Digit' + (k + 1)) && !shown[k].dis) { CV.sel = k; CV.pick = 1; }
    if (CV.hover !== undefined && MOUSE.click && !shown[CV.hover].dis) { CV.sel = CV.hover; CV.pick = 1; }
    if (CV.pick || tapAny('Enter', 'Space', 'KeyE')) { CV.pick = 0; break; }
    await nextFrame(); }
  sfx('ok'); if (!shown[CV.sel]) CV.sel = Math.max(0, shown.findIndex(o => !o.dis)); const o = shown[CV.sel]; CV.opts = null; logConv('> ' + o.t); return o.i;
}
// reply options wrap onto extra lines and the box grows upward to the portrait line; past that, the list scrolls to keep the selection in view
function convOptLayout() {
  const top0 = 150, lh = 10;
  const rows = CV.opts.map((o, k) => { const ls = wrapT((k + 1) + '. ' + o.t, 80); for (let i = 1; i < ls.length; i++) ls[i] = ls[i].trim(); return { k, ls: ls.length > 1 ? [ls[0]].concat(wrapT(ls.slice(1).join(' '), 77)) : ls, h: 0 }; });
  let need = 8; for (const r of rows) { r.h = r.ls.length * lh + 1; need += r.h; }
  const top = Math.max(top0, H - Math.max(86, need)); let yy = top + 6;
  for (const r of rows) { r.y = yy; yy += r.h; }
  const sel = rows[CV.sel] || rows[0], over = yy - (H - 2); let sh = 0, more = '';
  if (over > 0) { sh = Math.min(over, Math.max(0, sel.y + sel.h - (H - 2))); for (const r of rows) r.y -= sh; more = (sh > 0 ? '^' : '') + (sh < over ? 'v' : ''); }
  return { top, lh, rows, more };
}
function drawConv() {
  if (!CV.active) return;
  const ol = CV.opts && convOptLayout(); rectA(0, 0, W, 22, BLACK, .9); rectA(0, ol ? ol.top : H - 86, W, ol ? H - ol.top : 86, BLACK, .9);
  const who = CV.who, s = spk(who), leftWho = CV.left;
  if (leftWho && leftWho !== 'CARL') { drawPortrait(leftWho, 6, 26, 108, 108, { static: frame % 90 < 2 && SPK[leftWho] && SPK[leftWho].screen }); text(spk(leftWho).name, 8, 138, spk(leftWho).col, INK); if (who === leftWho) frameR(4, 24, 112, 112, spk(leftWho).col); }
  drawPortrait('CARL', W - 114, 26, 108, 108); text('CARL', W - 112, 138, spk('CARL').col, INK); if (who === 'CARL') frameR(W - 116, 24, 112, 112, spk('CARL').col);
  const x = 12, y = H - 80;
  if (ol) { CV.hover = undefined; ol.rows.forEach(r => { if (r.y < ol.top + 4 || r.y + r.h > H - 2) return; const k = r.k, o = CV.opts[k], hov = inRect(x, r.y - 1, 490, r.h); if (hov) CV.hover = k; if (k === CV.sel || hov) rectA(x - 2, r.y - 2, 492, r.h, hex('#2a4a7a'), .8); r.ls.forEach((l, i) => text(l, x + (i ? 18 : 0), r.y + i * ol.lh, o.dis ? hex('#4a4e58') : k === CV.sel ? WHITE : UIC.txt, 0)); }); if (ol.more) text(ol.more, W - 22, ol.top + 4, UIC.hi, 0); return; }
  if (who === 'N') { wrapText(CV.line.slice(0, CV.n | 0), x, y + 6, 82, hex('#a8e8ff'), 10, 6); }
  else { text(s.name, x, y, s.col, 0); wrapText(CV.line.slice(0, CV.n | 0), x, y + 12, 82, WHITE, 10, 6); }
  if (CV.n >= CV.line.length && (frame >> 4) & 1) text('v', W - 16, H - 12, UIC.hi, 0);
}

// ---------- pause menu ----------
async function pauseMenu() {
  let r = null; sfx('menu');
  await modal(() => { box(176, 50, 160, 156, 'PAUSED'); const items = [['RESUME', 'resume'], ['SAVE GAME', 'save'], ['LOAD GAME', 'load'], ['OPTIONS', 'opt'], ['MANUAL', 'manual'], ['QUIT TO TITLE', 'quit']]; items.forEach(([l, k], i) => { if (btn(190, 66 + i * 18, 132, l)) r = k; }); text(G.hubName || '', 186, 186, UIC.dim, 0); text(fmtTime(P.timeT), 186, 195, UIC.dim, 0); },
    () => { if (backTap()) r = 'resume'; if (r) return r; });
  if (r === 'save') await saveUI(true); else if (r === 'load') await saveUI(false); else if (r === 'opt') await optionsUI(); else if (r === 'manual') await manualUI(); else if (r === 'quit') { if (await confirmUI('Quit to title? Unsaved progress is lost.')) toTitle(); }
}
const fmtTime = t => { const m = (t / 60) | 0, h = (m / 60) | 0; return (h ? h + 'h ' : '') + (m % 60) + 'm'; };
async function confirmUI(q) { let r; await modal(() => { box(126, 90, 260, 60, 'CONFIRM'); wrapText(q, 136, 104, 40, UIC.txt); if (btn(146, 132, 90, 'YES', { key: 'KeyY' })) r = true; if (btn(276, 132, 90, 'NO', { key: ['KeyN', 'Escape'] })) r = false; }, () => r === undefined ? undefined : r); return r; }
async function optionsUI() {
  await modal(() => { box(116, 30, 280, 190, 'OPTIONS'); const rows = [['CHAT WINDOW', ['OFF', 'SMALL', 'BIG'][OPT.chat], () => OPT.chat = (OPT.chat + 1) % 3], ['VISION CONES', OPT.cones ? 'ON' : 'OFF', () => OPT.cones ^= 1], ['CROSSHAIR', OPT.crosshair ? 'ON' : 'OFF', () => OPT.crosshair ^= 1], ['AUTO-AIM (NO MOUSE)', OPT.autoaim ? 'ON' : 'OFF', () => OPT.autoaim ^= 1], ['DIFFICULTY', ['EASY', 'NORMAL', 'HARD'][OPT.diff], () => OPT.diff = (OPT.diff + 1) % 3], ['TEXT SPEED', ['', 'NORMAL', 'FAST', 'FASTER'][OPT.textSpeed] || 'NORMAL', () => OPT.textSpeed = OPT.textSpeed >= 3 ? 1 : OPT.textSpeed + 1], ['MUSIC', OPT.music ? 'ON' : 'OFF', () => { OPT.music ^= 1; if (musBus) musBus.gain.value = OPT.music ? .32 : 0; }]];
    rows.forEach(([n, v, f], i) => { text(n, 128, 50 + i * 18, UIC.txt, 0); if (btn(300, 48 + i * 18, 84, v)) { f(); saveOpt(); } }); if (btn(316, 202, 70, 'DONE', { key: 'Escape' })) OPT._d = 1; }, () => { if (OPT._d || MOUSE.rclick) { delete OPT._d; return 1; } });
}
