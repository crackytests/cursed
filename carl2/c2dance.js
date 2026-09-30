'use strict';
// ================= CARL 2: THE BOOGALOO. he dances a phrase, you dance it back. on the beat =================
const DANCE = { t: 0, fpb: 32, meter: 50, round: 0, rounds: 8, phrases: [], hits: [], judge: null, want: null, done: 0, res: {}, streak: 0, poseC: null, poseH: null, feed: [] };
const DKEYS = ['up', 'down', 'left', 'right', 'a'], DGLY = { up: '^', down: 'v', left: '<', right: '>', a: 'A' };
function makePhrase(r) { // positions in half-beats (0..7) inside the four-beat call
  const n = r < 2 ? 4 : r < 5 ? 5 : 6, pos = new Set([0, 2, 4, 6]); while (pos.size < n) pos.add(1 + 2 * rnd(4));
  return [...pos].sort((a, b) => a - b).map(p => ({ p, k: r === 0 ? DKEYS[p / 2 % 4] : pick(r > 3 ? DKEYS : DKEYS.slice(0, 4)) }));
}
async function boogaloo(o = {}) {
  const fpb = 3600 / 112, pre = 4; // 4 beats of count-in
  Object.assign(DANCE, { t: 0, fpb, meter: 50, round: -1, rounds: o.rounds || 8, done: 0, res: { perfect: 0, good: 0, miss: 0 }, streak: 0, poseC: null, poseH: null, feed: [], want: null, cur: null });
  DANCE.phrases = []; for (let r = 0; r < DANCE.rounds; r++) DANCE.phrases.push(makePhrase(r));
  DBG.mode = 'dance'; DBG.dance = DANCE;
  const pv = scene, pm = curName; music(null);
  const hb = fpb / 2, roundLen = 16 * hb; // 8 beats: 4 his, 4 yours
  scene = {
    update() {
      const D = DANCE; D.t++; shakeDecay(); if (D.done) return;
      if (D.t === 1) music('boogaloo');
      const tt = D.t - pre * fpb; if (tt < 0) { D.count = 4 - Math.floor(D.t / fpb); return; } D.count = 0;
      const r = Math.floor(tt / roundLen), inR = tt - r * roundLen;
      if (r >= D.rounds) { D.done = 1; D.res.win = D.meter > 50; D.res.meter = Math.round(D.meter); return; }
      if (r !== D.round) { D.round = r; D.cur = D.phrases[r].map(m => Object.assign({}, m, { hf: m.p * hb, cf: (m.p + 8) * hb, got: 0 })); }
      // his call: poses on the beat, perfect every time (he was focus-tested)
      for (const m of D.cur) if (Math.abs(inR - m.hf) < .5) { D.poseH = { k: m.k, t: 14 }; D.meter = Math.max(0, D.meter - 1.6); sfx('blip', [300 + DKEYS.indexOf(m.k) * 90, 10]); }
      // your answer
      const open = D.cur.filter(m => !m.got && inR > m.cf - 9 && inR < m.cf + 9);
      D.want = null; const nx = D.cur.find(m => !m.got && inR < m.cf + 9); if (nx && inR > m8(nx.cf) - 1) D.want = Math.abs(inR - nx.cf) <= 2 ? nx.k : null;
      const pk = DKEYS.find(k => pressed[k]);
      if (pk) {
        const m = open.sort((a, b) => Math.abs(inR - a.cf) - Math.abs(inR - b.cf))[0];
        if (m && m.k === pk) { const d = Math.abs(inR - m.cf); m.got = d <= 3.5 ? 2 : 1; judge(m.got === 2 ? 'PERFECT' : 'GOOD'); D.poseC = { k: pk, t: 14 }; }
        else { D.poseC = { k: pk, t: 8, off: 1 }; judge('OOPS', 1); }
      }
      for (const m of D.cur) if (!m.got && inR > m.cf + 9) { m.got = -1; judge('MISS'); }
      if (D.poseC && --D.poseC.t <= 0) D.poseC = null; if (D.poseH && --D.poseH.t <= 0) D.poseH = null;
      for (const f of D.feed) f.t--; D.feed = D.feed.filter(f => f.t > 0);
    },
    draw() { drawDance(); },
  };
  post.fade = 1; await fadeIn(.08);
  while (!DANCE.done) await nextFrame();
  await wait(50); await fadeOut(.06); WD.shake = 0; post.shake = 0; scene = pv; music(pm); DBG.mode = 'world'; await fadeIn(.08);
  return DANCE.res;
}
const m8 = cf => cf - 9;
function judge(s, soft) {
  const D = DANCE;
  if (s === 'PERFECT') { D.res.perfect++; D.meter = Math.min(100, D.meter + 3.2); D.streak++; sfx('ok'); }
  else if (s === 'GOOD') { D.res.good++; D.meter = Math.min(100, D.meter + 1.8); D.streak++; sfx('tick'); }
  else { D.res.miss++; D.meter = Math.max(0, D.meter - (soft ? 1.5 : 3.5)); D.streak = 0; if (!soft) sfx('hurt'); }
  D.judge = { s, t: 26 };
  if (D.streak && D.streak % 6 === 0) { D.meter = Math.min(100, D.meter + 6); D.feed.push({ u: pick(CHATTERS2), m: 'CARL CARL CARL', t: 120 }); laugh('[THE AUDIENCE GOES WILD]'); }
  if (s === 'MISS' && Math.random() < .4) D.feed.push({ u: pick(CHATTERS2), m: pick(['L', 'he\'s off beat', 'come on carl', 'HU-MAN is so smooth tho', 'smooth is boring']), t: 120 });
}
function poseOverlay(x, y, sc, pose, arm, flip) { // arms drawn over a scaled sprite, by pose
  const k = pose && pose.k, c = arm, sx = x + 8 * sc, sy = y + 15 * sc, L = 7 * sc;
  if (!k) return;
  if (k === 'up') { rectF(sx - 6 * sc, sy - L - 4 * sc, 2 * sc, L, c); rectF(sx + 4 * sc, sy - L - 4 * sc, 2 * sc, L, c); }
  if (k === 'down') { rectF(sx - 9 * sc, sy + 2 * sc, L, 2 * sc, c); rectF(sx + 2 * sc, sy + 2 * sc, L, 2 * sc, c); }
  if (k === 'left') rectF(sx - 5 * sc - L, sy - 2 * sc, L, 2 * sc, c);
  if (k === 'right') rectF(sx + 5 * sc, sy - 2 * sc, L, 2 * sc, c);
  if (k === 'a') { for (let i = 0; i < 8; i++) { const a = i * .785 + frame * .1; lineF(sx, sy - 6 * sc, sx + Math.cos(a) * 16 * sc, sy - 6 * sc + Math.sin(a) * 16 * sc, hex('#ffdb24')); } }
}
function drawDance() {
  const D = DANCE, t = D.t;
  skyD(0, 120, '#1a0036', '#6d2492');
  for (let i = 0; i < 5; i++) { const x = 40 + i * 60 + Math.sin(t * .02 + i) * 20; triF(x, 0, x - 30, 150, x + 30, 150, hex(['#ff24db', '#24dbff', '#ffdb24', '#6dff24', '#ff6d24'][i])); }
  rectA(0, 0, W, 150, BLACK, .55);
  const beat = Math.floor(t / D.fpb);
  for (let y = 120; y < 176; y += 14) for (let x = -((y - 120) / 2) | 0; x < W; x += 28) { const on = (((x / 28 | 0) + (y / 14 | 0) + beat) % 3 + 3) % 3 === 0; rectF(x, y, 27, 13, hex(on ? ['#ff24db', '#24dbff', '#ffdb24'][(((beat + x) % 3) + 3) % 3] : '#241040')); }
  // the two dancers
  const bob = (k) => Math.abs(Math.sin(t / D.fpb * Math.PI)) * k;
  const cy = 64 - bob(4) + (D.poseC && D.poseC.k === 'down' ? 8 : 0), hy = 48 - bob(3) + (D.poseH && D.poseH.k === 'down' ? 8 : 0);
  drawScaled(CS.carl.d[D.poseC ? 2 : (beat & 1)], 50, cy, C2 && C2.human >= 70 ? CP.human : CP.carl, 3.2, D.poseC && D.poseC.k === 'left');
  poseOverlay(50, cy, 3.2, D.poseC, hex('#242449'));
  drawScaled(CS.human.d[D.poseH ? 2 : (beat & 1)], 200, hy, CP.human, 3, D.poseH && D.poseH.k === 'left');
  poseOverlay(200 + 2, hy, 3, D.poseH, hex('#dbb692'));
  text('CARL', 70, 52, hex('#6dff24')); text('HU-MAN', 226, 40, hex('#ffdb49'));
  // audience
  for (let i = 0; i < 22; i++) { const x = i * 15, h = 8 + ((i * 7) % 5) + (beat % 2 ? (i & 1) * 2 : 0); circF(x + 7, 214 - h, 6, hex('#101020')); rectF(x + 1, 214 - h + 4, 12, 20, hex('#101020')); }
  // the phrase track
  rectA(0, 176, W, 22, BLACK, .7);
  if (D.cur) {
    const tt = t - 4 * D.fpb, inR = tt - D.round * 16 * D.fpb / 2, hb = D.fpb / 2;
    text('HIS', 4, 179, hex('#ffdb49')); text('YOU', 4, 189, hex('#6dff24'));
    for (let i = 0; i < 8; i++) { const x = 30 + i * 36; rectF(x, 178, 1, 18, hex('#49496d')); }
    for (const m of D.cur) { const x = 30 + m.p * 36 / 2 * 2 / 2 * 1; const xs = 30 + m.p * 18; text(DGLY[m.k], xs + 2, 179, hex('#ffdb49')); const col = m.got === 2 ? '#ffffff' : m.got === 1 ? '#6dff24' : m.got === -1 ? '#ff4949' : '#6dff24'; text(m.got > 0 ? '*' : DGLY[m.k], xs + 2, 189, hex(col)); }
    const px = 30 + (inR / hb) * 18 - (inR >= 8 * hb ? 144 : 0); rectF(px, 177, 2, 20, inR >= 8 * hb ? hex('#6dff24') : hex('#ffdb49'));
    ctext(inR >= 8 * hb ? 'YOUR TURN' : 'WATCH HIM', 160, inR >= 8 * hb ? hex('#6dff24') : hex('#ffdb49'));
  }
  if (D.count > 0) ctext(D.count <= 4 ? String(D.count) : '', 90, WHITE, BLACK, 4);
  // meter: a tug of war
  rectA(0, 0, W, 16, BLACK, .7); text('THE BOOGALOO', 4, 4, hex('#ff49db')); text('ROUND ' + Math.max(1, D.round + 1) + '/' + D.rounds, 90, 4, WHITE);
  rectF(160, 5, 150, 6, hex('#ffdb49')); rectF(160, 5, 150 * D.meter / 100, 6, hex('#6dff24')); rectF(160 + 75, 3, 1, 10, WHITE);
  if (D.judge && D.judge.t > 0) { D.judge.t--; ctext(D.judge.s, 110, D.judge.s === 'PERFECT' ? hex('#ffffff') : D.judge.s === 'GOOD' ? hex('#6dff24') : hex('#ff4949'), BLACK, 2); }
  D.feed.slice(-3).forEach((f, i) => text((f.u + ': ' + f.m).toUpperCase().slice(0, 30), 4, 20 + i * 9, UI.dim));
  if (WD.laugh && WD.laugh.t > 0) { WD.laugh.t--; ctext(WD.laugh.s, 150, hex('#ffffdb')); }
  if (t < 4 * D.fpb) ctext('HE DANCES. YOU DANCE IT BACK. ON THE BEAT.', 100, UI.name);
}
