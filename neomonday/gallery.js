'use strict';
// ================= NEO MONDAY — the shooting gallery (light-gun sections) =================
// Move the sight with the arrows, A fires (hold B to creep the sight slowly). Enemies take aim (they blink red) and then shoot.
// Shoot first. Kinds: copy (rises from cover, head shots do double), drone (hovers and keeps harassing, one hit),
// brute (big, slow, takes a lot), boss (health bar, keeps firing). gallery(cfg) resolves { won, hits, shots }.
SFX.shot = () => { noise(.14, { lp: 2800, vol: .7 }); tone(190, .12, { slide: .25, vol: .45, type: 'sawtooth' }); };
SFX.hit = () => { noise(.08, { hp: 3000, vol: .5 }); tone(900, .06, { slide: .5, vol: .3, type: 'square' }); };
SFX.boom = () => { noise(.5, { lp: 1200, vol: .8 }); tone(90, .4, { slide: .3, vol: .5, type: 'sawtooth' }); };
SFX.alert = () => { tone(1100, .08, { vol: .25, type: 'square' }); tone(1100, .08, { vol: .25, type: 'square', delay: .12 }); };

const ES = {}; // sprite cache
function copycatSprite(big) {
  const k = big ? 'boss' : 'copy'; if (ES[k]) return ES[k]; const sc = big ? 1.5 : 1;
  const w = Math.round(48 * sc), h = Math.round(92 * sc);
  return ES[k] = outlineBuf(offscreen(w, h, () => {
    const s = v => Math.round(v * sc);
    blob(s(15), s(76), s(6), s(15), K.steel, RIM); blob(s(33), s(76), s(6), s(15), K.steel, RIM);                         // legs
    blob(s(24), s(52), s(17), s(22), big ? [K.ink, hex('#5a1020'), hex('#a02030'), hex('#d85060')] : K.steel, RIM);        // torso
    blob(s(7), s(52), s(5), s(15), K.steel, RIM); blob(s(41), s(52), s(5), s(15), K.steel, RIM);                           // arms
    for (let y = s(36); y < s(70); y += s(5)) lineF(s(10), y, s(38), y, K.steel[0]);                                       // ribs
    polyF([[s(8), s(26)], [s(11), s(4)], [s(19), s(20)]], K.steel[2]); polyF([[s(40), s(26)], [s(37), s(4)], [s(29), s(20)]], K.steel[1]); // ears
    blob(s(24), s(26), s(13), s(14), K.steel, RIM);                                                                         // head
    rectF(s(10), s(24), s(10), s(5), K.ink); rectF(s(28), s(24), s(10), s(5), K.ink); rectF(s(12), s(25), s(7), s(3), K.red); rectF(s(30), s(25), s(7), s(3), K.red);
    rectF(s(15), s(35), s(18), s(3), K.ink); for (let x = s(16); x < s(32); x += 3) pset(x, s(36), K.steel[3]);
    ellF(s(10), s(30), s(4), s(4), K.skin[2]); ellF(s(9), s(29), s(2), s(2), K.skin[3]);                                  // a patch of somebody's face, still stuck on
    rectF(s(2), s(40), s(6), s(4), K.ink); rectF(s(0), s(41), s(4), s(2), K.steel[3]);                                      // the gun
  }));
}
function droneSprite() { // a hovering camera-pod with one red eye and a rotor
  return ES.drone || (ES.drone = outlineBuf(offscreen(34, 24, () => {
    lineF(2, 4, 32, 4, K.steel[3], 2); lineF(17, 4, 17, 8, K.steel[1], 2);
    blob(17, 14, 13, 8, K.steel, RIM); ellF(17, 15, 5, 5, K.ink); ellF(17, 15, 3, 3, K.red); pset(16, 14, K.white[3]);
    rectF(5, 20, 5, 2, K.steel[1]); rectF(24, 20, 5, 2, K.steel[1]);
  })));
}
function bruteSprite() { // the heavy: armor plates over the usual
  if (ES.brute) return ES.brute; const base = copycatSprite(true);
  return ES.brute = outlineBuf(offscreen(base.w + 8, base.h, () => { blit(base, 4, 0); rectF(14, 38, base.w - 20, 6, K.steel[3]); rectF(10, 26, 8, 22, hex('#c8a020')); rectF(base.w - 12, 26, 8, 22, hex('#c8a020')); for (let y = 30; y < 46; y += 4) { rectF(11, y, 6, 1, K.ink); rectF(base.w - 11, y, 6, 1, K.ink); } }));
}
const flashOf = b => { const o = newBuf(b.w, b.h); for (let i = 0; i < b.d.length; i++) o.d[i] = b.d[i] ? K.white[3] : 0; return o; };
const busy_ui = () => !!(DLG || MENUS.length);
function ringR(cx, cy, r, c) { const n = Math.max(12, (r * 6.3) | 0); for (let i = 0; i < n; i++) { const a = i / n * 6.283; pset(cx + Math.cos(a) * r, cy + Math.sin(a) * r, c); } }
// where an enemy can be hit: [x0, y0, x1, y1]
const boxOf = e => e.fly ? [e.x - e.spr.w / 2, e.y - e.spr.h / 2, e.x + e.spr.w / 2, e.y + e.spr.h / 2] : [e.x - e.spr.w / 2, e.sl.y - e.spr.h * e.vis, e.x + e.spr.w / 2, e.sl.y];

async function gallery(cfg) {
  const art = SCENES[cfg.scene](), anim = ANIM[cfg.scene], prev = scene;
  const G = { cx: 256, cy: 80, hp: cfg.hp || 5, max: cfg.hp || 5, cool: 0, es: [], t: 0, kills: 0, total: cfg.waves.length, shots: 0, hits: 0, done: 0, hurt: 0, spawned: 0, pending: cfg.waves.slice().sort((a, b) => a.t - b.t) };
  DBG.mode = 'gal'; DBG.gal = G; music(cfg.music || 'combat');
  const SPR = { copy: copycatSprite(false), boss: copycatSprite(true), drone: droneSprite(), brute: bruteSprite() };
  scene = {
    update() {
      G.t++; if (G.cool > 0) G.cool--; if (G.hurt > 0) G.hurt--;
      const sp = held.b ? 1.6 : 4.2; if (held.left) G.cx -= sp; if (held.right) G.cx += sp; if (held.up) G.cy -= sp; if (held.down) G.cy += sp;
      G.cx = clamp(G.cx, 4, W - 5); G.cy = clamp(G.cy, 4, VH - 5);
      while (G.pending.length && G.pending[0].t <= G.t) {
        const w = G.pending.shift(), sl = cfg.slots[w.slot], kind = w.boss ? 'boss' : (w.kind || 'copy');
        G.es.push({ w, sl, kind, boss: kind === 'boss', fly: kind === 'drone', spr: SPR[kind], hp: w.hp || (kind === 'brute' ? 6 : kind === 'drone' ? 1 : 2), max: w.hp || 2, state: 'wait', timer: 0, vis: 0, flash: 0, x: sl.x, y: sl.y, id: ++G.spawned });
      }
      for (const e of G.es) {
        if (e.dead) continue; if (e.flash > 0) e.flash--; e.timer++;
        const aim = e.w.aim || (e.kind === 'brute' ? 120 : 70);
        if (e.fly) { e.x = e.sl.x + Math.sin(G.t * .028 + e.id * 2.1) * (e.sl.r || 90); e.y = e.sl.y + Math.cos(G.t * .05 + e.id) * 9; }
        if (e.state === 'wait') { if (e.timer > (e.w.delay || 1)) { e.state = 'rise'; e.timer = 0; } }
        else if (e.state === 'rise') { e.vis = Math.min(1, e.timer / 18); if (e.vis >= 1) { e.state = 'aim'; e.timer = 0; sfx('alert'); } }
        else if (e.state === 'aim') { if (e.boss) e.x = e.sl.x + Math.sin(G.t * .03) * 70; if (e.timer >= aim) { e.state = 'fire'; e.timer = 0; } }
        else if (e.state === 'fire') {
          if (e.timer === 1) { G.hp--; G.hurt = 14; post.flash = .55; post.shake = 3; sfx('hurt'); }
          if (e.timer > 10) { e.state = (e.boss || e.fly) ? 'aim' : 'hide'; e.timer = 0; post.shake = 0; }
        } else if (e.state === 'hide') { e.vis = Math.max(0, 1 - e.timer / 14); if (e.vis <= 0) { e.state = 'wait'; e.timer = 0; e.w = Object.assign({}, e.w, { delay: 50 }); } }
      }
      if (pressed.a && !G.cool && !busy_ui()) {
        G.cool = 10; G.shots++; sfx('shot'); post.flash = .18;
        const e = G.es.filter(e => !e.dead && e.vis > .4).reverse().find(e => { const b = boxOf(e); return G.cx >= b[0] && G.cx <= b[2] && G.cy >= b[1] && G.cy <= b[3]; });
        if (e) { const b = boxOf(e), head = !e.fly && G.cy < b[1] + e.spr.h * .38; e.hp -= head ? 2 : 1; e.flash = 4; G.hits++; sfx('hit');
          if (e.hp <= 0) { e.dead = 1; G.kills++; sfx('boom'); G.boom = { x: e.x, y: e.fly ? e.y : e.sl.y - e.spr.h / 2, t: 20 }; } }
      }
      if (G.hp <= 0 && !G.done) G.done = -1;
      if (!G.done && !G.pending.length && G.es.every(e => e.dead)) G.done = 1;
    },
    draw() {
      copyBuf(art, 0, 0); if (anim) anim(G.t);
      for (const e of G.es) {
        if (e.dead || e.vis <= 0) continue;
        const sp = e.flash ? flashOf(e.spr) : e.spr;
        if (e.fly) { const x = (e.x - e.spr.w / 2) | 0, y = (e.y - e.spr.h / 2) | 0; blit(sp, x, y); if (e.state === 'aim' && e.timer > (e.w.aim || 70) * .55 && (G.t >> 2) & 1) glow(e.x, e.y + 2, 24, K.red, .9); continue; }
        const x = (e.x - e.spr.w / 2) | 0, y = (e.sl.y - e.spr.h * e.vis) | 0;
        blit(sp, x, y, false, e.sl.y);
        if (e.state === 'aim' && e.timer > (e.w.aim || (e.kind === 'brute' ? 120 : 70)) * .55 && (G.t >> 2) & 1) glow(e.x, y + e.spr.h * .27, 30, K.red, .9);
        if (e.sl.cover) { const c = e.sl.cover; for (let j = c[1]; j < c[1] + c[3]; j++) for (let i = c[0]; i < c[0] + c[2]; i++) FB[j * W + i] = art.d[j * W + i]; }
        if (e.boss) { rectF(120, 6, 272, 8, K.ink); rectF(122, 8, ((e.hp / e.max) * 268) | 0, 4, K.red); text(cfg.bossName || 'BOSS', 122, 16, K.white[3]); }
      }
      if (G.boom && G.boom.t-- > 0) { const b = G.boom, r = 36 - b.t; glow(b.x, b.y, r * 2.2, K.amber, 1); for (let i = 0; i < 12; i++) { const a = i * .52; pset(b.x + Math.cos(a) * r, b.y + Math.sin(a) * r, K.white[3]); } }
      rectF(0, VH, W, H - VH, BLACK); panel(4, VH + 2, W - 8, H - VH - 6); text(cfg.boss ? (cfg.bossName || 'DANGER') : 'DANGER', 20, VH + 12, hex('#ff6060'));
      text('ARROWS AIM   A FIRE   HOLD B AIM SLOWLY   HEAD SHOTS DO DOUBLE', 20, VH + 34, hex('#a8c8ff')); text('SHOOT THEM WHEN THEY BLINK RED. THEY SHOOT BACK.', 20, VH + 50, hex('#7a8ac8'));
      const over = G.es.some(e => { if (e.dead || e.vis <= .4) return false; const b = boxOf(e); return G.cx >= b[0] && G.cx <= b[2] && G.cy >= b[1] && G.cy <= b[3]; }), c = over ? K.red : K.cyan;
      ringR(G.cx, G.cy, 9, c); lineF(G.cx - 14, G.cy, G.cx - 5, G.cy, c); lineF(G.cx + 5, G.cy, G.cx + 14, G.cy, c); lineF(G.cx, G.cy - 14, G.cx, G.cy - 5, c); lineF(G.cx, G.cy + 5, G.cx, G.cy + 14, c);
      text('COOL', 8, 6, K.white[3]); for (let i = 0; i < G.max; i++) { rectF(40 + i * 14, 5, 11, 8, i < G.hp ? hex('#40ff90') : hex('#1a2a3a')); frameR(40 + i * 14, 5, 11, 8, K.ink); }
      text('DOWN ' + G.kills + '/' + G.total, W - 90, 6, K.white[3]);
      if (G.hurt) rectA(0, 0, W, VH, K.red, .15 + G.hurt * .01);
    },
  };
  await fadeIn(.08);
  while (!G.done) await nextFrame();
  await wait(30); await fadeOut(.06); DBG.mode = null; post.shake = 0; post.flash = 0; scene = prev; await fadeIn(.08); // back to the story: the screen must come up again
  return { won: G.done === 1, hits: G.hits, shots: G.shots };
}
