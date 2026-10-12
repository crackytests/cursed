'use strict';
// ================= SPOOKY GHOST 2: THE BOOGALOO. somebody moves first, you answer. on the beat =================
// modes: 'cr'   call and response: they dance a phrase, you dance it back
//        'fall' the steps scroll in from the right and you hit them as they cross the line (they dance them with you)
// gimmicks: o.feint (fake calls you must NOT answer), o.keys (adds B), o.tight (only perfects count), o.mirror (they dance when you do)
const DANCE = { t: 0, fpb: 32, meter: 50, ev: [], done: 0, res: {}, streak: 0, poseC: null, poseH: null, feed: [], want: null, judge: null, rounds: 0 };
const DKEYS5 = ['up', 'down', 'left', 'right', 'a'], DGLY = { up: '^', down: 'v', left: '<', right: '>', a: 'A', b: 'B' };
const DCOL = { up: '#24dbff', down: '#ffff49', left: '#ff24db', right: '#6dff24', a: '#ff9224', b: '#ffffff' };
const DCHAT = ['ghostfan666', 'spooky_stan', 'boogaloo_kid', 'VHS_andy', 'neon_gaming', 'linda_stan', 'sheet_enjoyer', 'lurker'];

function makeEvents(o) {
  const fpb = 3600 / o.bpm, hb = fpb / 2, ev = [], keys = o.keys || DKEYS5, t0 = (o.count || 4) * fpb, rl = 16 * hb;
  for (let r = 0; r < o.rounds; r++) {
    const base = t0 + r * rl, n = Math.min(8, (o.n ? o.n(r) : r < 2 ? 4 : r < 5 ? 5 : 6)), pos = new Set([0, 2, 4, 6]);
    while (pos.size < n) pos.add(1 + 2 * rnd(4));
    const slots = [...pos].sort((a, b) => a - b);
    slots.forEach((p, i) => {
      const k = r === 0 && !o.noEasy ? DKEYS5[(p / 2) % 4 | 0] : pick(r > 2 || o.hardKeys ? keys : keys.filter(x => x !== 'b'));
      const fake = o.feint && r > 0 && i > 0 && Math.random() < o.feint;
      if (o.mode === 'fall') ev.push({ k, cf: base + p * hb + (o.lead || 0), tf: base + p * hb + (o.lead || 0), fake, got: 0 });
      else ev.push({ k, cf: base + p * hb, tf: base + (p + 8) * hb, fake, got: 0 });
    });
  }
  return { ev, fpb, hb, t0, rl };
}
async function boogaloo(o) {
  const mk = makeEvents(o), D = DANCE, loss = (S && S.losses && S.losses[o.id]) || 0;
  Object.assign(D, { o, ev: mk.ev, fpb: mk.fpb, hb: mk.hb, t0: mk.t0, rl: mk.rl, t: 0, meter: o.startMeter || 50, done: 0, res: { perfect: 0, good: 0, miss: 0, clean: 0 }, streak: 0, poseC: null, poseH: null, feed: [], want: null, judge: null, rounds: o.rounds, assist: Math.min(3, loss), end: 0 });
  D.winP = (o.tight ? 2 : 3) + D.assist; D.winG = o.tight ? D.winP : 8 + D.assist * 2;
  D.last = Math.max(...mk.ev.map(e => e.tf)) + mk.fpb * 1.5;
  D.keys = o.keys || DKEYS5;
  DBG.mode = 'dance'; DBG.dance = D;
  const pv = scene, pm = curName; music(null); const trk = o.track;
  scene = {
    update() {
      D.t++; if (D.t === 1) music(trk); if (D.done) return;
      if (D.t > D.last || D.meter <= 0) { D.done = 1; D.res.win = D.meter >= 50 && D.meter > 0; D.res.meter = Math.round(D.meter); return; }
      const t = D.t; D.want = null;
      for (const e of D.ev) {
        if (e.cf !== null && !e.called && t >= e.cf) { e.called = 1; if (o.mode !== 'fall' || !o.mirrorOnly) D.poseH = { k: e.k, t: 14, fake: e.fake }; if (o.mode === 'cr') { D.meter = Math.max(0, D.meter - (e.fake ? .4 : 1.6)); sfx('blip', [300 + DKEYS5.indexOf(e.k) * 90, 10]); } else sfx('blip', [420 + DKEYS5.indexOf(e.k) * 70, 10]); }
        if (!e.got && t > e.tf + D.winG) { if (e.fake) { e.got = 3; D.res.clean++; D.meter = Math.min(100, D.meter + 1); } else { e.got = -1; judge('MISS'); } }
      }
      const near = D.ev.filter(e => !e.got && Math.abs(t - e.tf) <= D.winG);
      const nx = D.ev.find(e => !e.got && !e.fake && Math.abs(t - e.tf) <= 1); if (nx) D.want = nx.k;
      const pk = D.keys.find(k => pressed[k]);
      if (pk) {
        near.sort((a, b) => Math.abs(t - a.tf) - Math.abs(t - b.tf));
        const m = near[0];
        if (m && m.k === pk && !m.fake) { const d = Math.abs(t - m.tf); m.got = d <= D.winP ? 2 : 1; judge(m.got === 2 ? 'PERFECT' : 'GOOD'); D.poseC = { k: pk, t: 14 }; if (o.mode === 'fall') D.poseH = { k: pk, t: 14 }; }
        else if (m && m.fake) { m.got = -2; judge('BUSY SIGNAL!', 1); D.poseC = { k: pk, t: 8, off: 1 }; D.meter = Math.max(0, D.meter - 3); }
        else { D.poseC = { k: pk, t: 8, off: 1 }; judge('OOPS', 1); }
      }
      if (D.poseC && --D.poseC.t <= 0) D.poseC = null; if (D.poseH && --D.poseH.t <= 0) D.poseH = null;
      for (const f of D.feed) f.t--; D.feed = D.feed.filter(f => f.t > 0);
    },
    draw() { drawDance(); },
  };
  post.fade = 1; await fadeIn(.08);
  while (!D.done) await nextFrame();
  await wait(50); await fadeOut(.06); post.shake = 0; scene = pv; music(pm); DBG.mode = 'world'; await fadeIn(.08);
  if (S && o.id) { if (!D.res.win) S.losses[o.id] = (S.losses[o.id] || 0) + 1; }
  return D.res;
}
function judge(s, soft) {
  const D = DANCE;
  if (s === 'PERFECT') { D.res.perfect++; D.meter = Math.min(100, D.meter + 3.2); D.streak++; sfx('ok'); }
  else if (s === 'GOOD') { D.res.good++; D.meter = Math.min(100, D.meter + 1.8); D.streak++; sfx('tick'); }
  else { if (!soft) D.res.miss++; D.meter = Math.max(0, D.meter - (soft ? 1.5 : 3.5)); D.streak = 0; if (!soft) sfx('hurt'); }
  D.judge = { s, t: 26 };
  if (D.streak && D.streak % 6 === 0) { D.meter = Math.min(100, D.meter + 6); D.feed.push({ u: pick(DCHAT), m: (D.o.cheer || 'GHOST GHOST GHOST'), t: 120 }); sfx('crowd'); }
  if (s === 'MISS' && Math.random() < .4) D.feed.push({ u: pick(DCHAT), m: pick(['L', 'off beat', 'come on ghost', (D.o.name || 'she').toLowerCase() + ' is so smooth tho', 'the timing is humiliating']), t: 120 });
}
// arms and flourishes over a scaled sprite, by pose
function poseOverlay(cx, top, sc, pose, arm) {
  if (!pose) return; const k = pose.k, sy = top + 13 * sc, L = 8 * sc;
  if (k === 'up') { rectF(cx - 8 * sc, sy - L - 2 * sc, 2 * sc, L, arm); rectF(cx + 6 * sc, sy - L - 2 * sc, 2 * sc, L, arm); }
  if (k === 'down') { rectF(cx - 11 * sc, sy + 2 * sc, L, 2 * sc, arm); rectF(cx + 3 * sc, sy + 2 * sc, L, 2 * sc, arm); }
  if (k === 'left') rectF(cx - 7 * sc - L, sy - 2 * sc, L, 2 * sc, arm);
  if (k === 'right') rectF(cx + 7 * sc, sy - 2 * sc, L, 2 * sc, arm);
  if (k === 'a') for (let i = 0; i < 8; i++) { const a = i * .785 + frame * .1; lineF(cx, sy - 6 * sc, cx + Math.cos(a) * 14 * sc, sy - 6 * sc + Math.sin(a) * 14 * sc, hex('#ffff49')); }
  if (k === 'b') for (let i = 0; i < 12; i++) { const a = i * .52 + frame * .2; pset(cx + Math.cos(a) * 12 * sc, sy - 6 * sc + Math.sin(a) * 9 * sc, hex('#ffffff')); }
}
function danceBg(D, t, beat) {
  const o = D.o;
  if (o.bg) return o.bg(t, beat);
  skyD(0, 130, '#1a0036', '#6d2492');
  for (let i = 0; i < 5; i++) { const x = 40 + i * 60 + Math.sin(t * .02 + i) * 20; triF(x, 0, x - 30, 130, x + 30, 130, hex(['#ff24db', '#24dbff', '#ffdb24', '#6dff24', '#ff6d24'][i])); }
  rectA(0, 0, W, 130, BLACK, .55);
  for (let y = 130; y < 176; y += 12) for (let x = -((y - 130) / 2) | 0; x < W; x += 28) { const on = (((x / 28 | 0) + (y / 12 | 0) + beat) % 3 + 3) % 3 === 0; rectF(x, y, 27, 11, hex(on ? ['#ff24db', '#24dbff', '#ffdb24'][(((beat + x) % 3) + 3) % 3] : '#241040')); }
}
function drawDance() {
  const D = DANCE, o = D.o, t = D.t, beat = Math.floor(t / D.fpb);
  danceBg(D, t, beat);
  const bob = k => Math.abs(Math.sin(t / D.fpb * Math.PI)) * k;
  // the two dancers (ghost 3x on the left, partner on the right)
  const gy = 56 - bob(4) + (D.poseC && D.poseC.k === 'down' ? 8 : 0);
  const gs = SG.ghost.d[D.poseC ? 2 : beat % 3];
  drawScaled(gs, 52, gy, SGP.ghost, 3.4, D.poseC && D.poseC.k === 'left');
  poseOverlay(52 + 11 * 3.4, gy, 3.4, D.poseC, hex('#ffffff'));
  const hy = 50 - bob(3) + (D.poseH && D.poseH.k === 'down' ? 8 : 0);
  if (o.draw) o.draw(D, 200, hy, beat, t); else if (o.person) { const set = SG.people[o.person], s = set.d[D.poseH ? 1 : beat & 1]; drawScaled(s, 200, hy, s.P, 3.2, D.poseH && D.poseH.k === 'left'); poseOverlay(200 + 9 * 3.2, hy, 3.2, D.poseH, hex('#ffffff')); }
  text('SPOOKY GHOST', 56, 40, hex('#ff24db')); text(o.name || '', 200, 34, hex('#ffff49'));
  if (D.poseH && D.poseH.fake && (t >> 2) & 1) text('...?', 214, 28, hex('#ff4949'), BLACK, 2);
  // audience
  for (let i = 0; i < 22; i++) { const x = i * 15, h = 8 + ((i * 7) % 5) + (beat % 2 ? (i & 1) * 2 : 0); circF(x + 7, 218 - h, 6, hex('#0a0a1a')); rectF(x + 1, 218 - h + 4, 12, 20, hex('#0a0a1a')); }
  // the strip
  rectA(0, 172, W, 40, BLACK, .72);
  const hitX = 64;
  if (o.mode === 'fall') {
    text('STEPS', 4, 176, hex('#ffff49')); rectF(hitX - 8, 184, 1, 20, hex('#ffffff')); rectF(hitX + 14, 184, 1, 20, hex('#ffffff')); frameRect(hitX - 8, 184, 23, 20, hex('#ff24db'));
    for (const e of D.ev) { const x = hitX + (e.tf - t) * 2.2; if (x < -10 || x > W || e.got > 0) continue; const c = e.fake ? '#6d6d6d' : DCOL[e.k]; text(e.fake ? '?' : DGLY[e.k], x, 188, hex(c), BLACK, 2); }
    ctext(D.t < D.t0 ? 'GET READY' : 'HIT THEM ON THE LINE', 208, UI.dim);
  } else {
    const rl = D.rl, hb = D.hb, inR = (t - D.t0) % rl, r = Math.floor((t - D.t0) / rl);
    text('HIS', 4, 176, hex('#ffff49')); text('YOU', 4, 192, hex('#6dff24'));
    for (let i = 0; i <= 8; i++) rectF(30 + i * 35, 176, 1, 30, hex('#49496d'));
    for (const e of D.ev) {
      const rr = Math.floor((e.cf - D.t0) / rl); if (rr !== r) continue;
      const p = Math.round((e.cf - D.t0 - rr * rl) / hb), xs = 30 + p * 17.5;
      text(e.fake ? '?' : DGLY[e.k], xs + 2, 177, hex(e.fake ? '#ff4949' : '#ffff49'));
      const col = e.got === 2 ? '#ffffff' : e.got === 1 ? '#6dff24' : e.got < 0 ? '#ff4949' : '#6dff24';
      if (!e.fake) text(e.got > 0 ? '*' : DGLY[e.k], xs + 2 + 140, 193, hex(col)); else if (e.got === 3) text('-', xs + 142, 193, hex('#6dff24'));
    }
    if (t >= D.t0) { const px = 30 + (inR / hb) * 17.5; rectF(px, 175, 2, 32, inR >= 8 * hb ? hex('#6dff24') : hex('#ffff49')); ctext(inR >= 8 * hb ? 'YOUR TURN' : 'WATCH', 208, inR >= 8 * hb ? hex('#6dff24') : hex('#ffff49')); }
  }
  if (t < D.t0) { const c = 4 - Math.floor(t / D.fpb); ctext(String(Math.max(1, c)), 80, WHITE, BLACK, 4); }
  // meter: a tug of war
  rectA(0, 0, W, 18, BLACK, .7); text(o.title || 'THE BOOGALOO', 4, 5, hex('#ff49db'));
  rectF(150, 6, 160, 7, hex('#ffdb49')); rectF(150, 6, 160 * D.meter / 100, 7, hex('#6dff24')); rectF(150 + 80, 3, 1, 12, WHITE);
  if (D.judge && D.judge.t > 0) { D.judge.t--; ctext(D.judge.s, 124, D.judge.s === 'PERFECT' ? WHITE : D.judge.s === 'GOOD' ? hex('#6dff24') : hex('#ff4949'), BLACK, 2); }
  D.feed.slice(-3).forEach((f, i) => text((f.u + ': ' + f.m).toUpperCase().slice(0, 34), 4, 22 + i * 9, UI.dim));
  if (D.assist && t < 150) ctext('THE CROWD IS ON YOUR SIDE', 150, hex('#ffff49'));
  if (t < D.t0 && o.hint) ctext(o.hint, 100, UI.name);
}
