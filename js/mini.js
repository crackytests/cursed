'use strict';
// ================= NEW ART, MUSIC, MINIGAMES =================
SPR.tape = mk(16, 16, g => { g.r(1, 4, 14, 9, 3); g.r(2, 5, 12, 7, 1); g.r(3, 5, 10, 2, 0); g.e(5.5, 9, 2, 2, 3); g.e(10.5, 9, 2, 2, 3); g.p(5, 8, 0); g.p(10, 8, 0); g.r(4, 12, 8, 1, 2); });
SPR.pillG = mk(8, 8, g => { g.e(4, 4, 4, 2.6, 3); g.e(4, 4, 3, 1.7, 0); g.r(4, 3, 3, 2, 1); });
SPR.pillR = mk(8, 8, g => { g.e(4, 4, 4, 2.6, 3); g.e(4, 4, 3, 1.7, 2); g.p(2, 3, 0); g.p(3, 4, 0); g.p(4, 3, 0); g.p(5, 4, 0); });
SPR.busV = mk(16, 32, g => { g.r(1, 0, 14, 32, 3); g.r(2, 1, 12, 30, 1); g.r(3, 2, 10, 4, 0); for (let y = 9; y < 26; y += 5) g.r(4, y, 8, 2, 2); g.r(3, 28, 10, 2, 2); g.r(0, 4, 1, 3, 3); g.r(15, 4, 1, 3, 3); g.r(0, 24, 1, 3, 3); g.r(15, 24, 1, 3, 3); });
SPR.doorFoe = mk(32, 32, g => { g.r(0, 0, 32, 32, 3); g.r(2, 2, 13, 30, 0); g.r(17, 2, 13, 30, 0); g.r(4, 5, 1, 6, 1); g.r(5, 4, 1, 6, 1); g.r(19, 5, 1, 6, 1); g.r(20, 4, 1, 6, 1); g.r(12, 14, 2, 6, 3); g.r(18, 14, 2, 6, 3); g.r(6, 22, 20, 3, 2); });
SPR.garf = R(['.....333333.....', '....31111113....', '...3111111113...', '...3333113333...', '...3111111113...', '...3122222213...', '....32222223....', '.....322223.....', '....30000003....', '...3020020203...', '...3002002003...', '...1020020201...', '....30000003....', '....32222223....', '....3223.3223...', '....333..333....']);
SPR.suitBoss = SPR.suit;
SPR.bubbleFoe = SPR.bubble;
FOES.boss.pmap = [1, 0, 2, 3];

tile('acab', [0, 1].map(k => T(g => { g.fill(3); g.r(2, 1, 12, 2, 2); g.r(3, 4, 10, 6, k ? 1 : 0); g.r(5, 6, 2, 2, 3); g.r(9, 6 + k, 2, 2, 3); g.r(2, 11, 12, 2, 2); g.p(5, 12, 0); g.p(10, 12, 0); })), { solid: 1, spd: 16 });
tile('corral', T(g => { asph(g, 5); g.o(1, 1, 14, 14, 0); g.r(1, 1, 14, 1, 3); for (let x = 3; x < 14; x += 3) g.r(x, 2, 1, 12, 1); }));
tile('dinerW', T(g => { g.fill(1); g.r(0, 0, 16, 2, 3); g.r(2, 4, 12, 6, 3); g.r(3, 5, 10, 4, 0); g.r(0, 13, 16, 3, 2); }), { solid: 1, look: ['GARF\'S. OPEN. It\'s always open. Everything out here is always open.', 'A diner in the middle of the desert. That\'s normal. That\'s a normal amount of diner.'] });
tile('dinerSign', [0, 1].map(k => T(g => { g.fill(3); g.r(1, 3, 14, 9, k ? 0 : 2); g.r(3, 5, 2, 5, 3); g.r(3, 5, 4, 1, 3); g.r(3, 7, 3, 1, 3); g.r(3, 9, 4, 1, 3); g.r(8, 5, 1, 5, 3); g.r(11, 5, 2, 5, 3); })), { solid: 1, spd: 40 });
tile('jukebox', [0, 1].map(k => T(g => { g.fill(3); g.e(8, 6, 6, 6, 2); g.e(8, 6, 4, 4, k ? 0 : 1); g.r(2, 8, 12, 7, 2); g.r(4, 10, 8, 1, 0); g.r(4, 12, 8, 1, 0); })), { solid: 1, spd: 12 });
tile('barc', T(g => { g.fill(2); g.r(0, 0, 16, 4, 1); g.r(0, 4, 16, 1, 3); g.r(0, 15, 16, 1, 3); }), { solid: 1, look: ['The counter is sticky. Everything is sticky. That\'s how you know it\'s a real diner.', 'A napkin says: CARL OWES $14. There\'s a bong drawn on it.'] });
tile('stool', T(g => { mfloor(g); g.e(8, 6, 5, 4, 3); g.e(8, 6, 4, 3, 1); g.r(7, 9, 2, 6, 3); g.r(5, 14, 6, 1, 3); }), { solid: 1 });
tile('phone', T(g => { g.fill(1); g.r(0, 0, 16, 4, 3); g.r(3, 4, 10, 11, 3); g.r(4, 5, 8, 5, 2); g.r(5, 11, 6, 3, 1); g.r(12, 6, 2, 7, 3); }), { solid: 1 });
tile('mirror', T(g => { g.fill(2); g.r(0, 0, 16, 4, 3); g.r(2, 4, 12, 10, 3); g.r(3, 5, 10, 8, 0); g.r(5, 6, 1, 3, 1); g.r(6, 5, 1, 2, 1); }), { solid: 1 });
tile('photob', T(g => { mfloor(g); g.r(1, 0, 14, 16, 3); g.r(2, 1, 12, 4, 1); g.r(3, 2, 10, 1, 3); g.r(2, 6, 6, 10, 2); g.r(9, 7, 4, 3, 0); }), { solid: 1 });
tile('lnf', T(g => { mfloor(g); g.r(0, 4, 16, 10, 3); g.r(1, 5, 14, 3, 1); g.r(3, 1, 4, 4, 2); g.r(9, 2, 5, 3, 1); }), { solid: 1 });
Object.assign(LEGEND, { a: 'acab', g: 'corral', 2: 'dinerW', 3: 'dinerSign' });

Object.assign(TRACKS, {
  battle: { bpm: 150, ch: [
    { w: 'p25', vol: .38, n: 'A4 - C5 - E5 - A5 - G5 - E5 - C5 - D5 - E5 - - - D5 - C5 - B4 - G4 - A4 - - - - - E4 - G4 - A4 - C5 - B4 - G4 - E4 - F4 - G4 - - - A4 - B4 - C5 - D5 - E5 -' },
    { type: 'triangle', vol: .8, n: 'A2 A2 A3 A2 A2 A3 A2 A3 F2 F2 F3 F2 F2 F3 F2 F3 C3 C3 C4 C3 C3 C4 C3 C4 E2 E2 E3 E2 E2 E3 G#2 G#3' },
    { w: 'p12', vol: .14, n: 'A3 C4 E4 C4 A3 C4 E4 C4 F3 A3 C4 A3 F3 A3 C4 A3 C4 E4 G4 E4 C4 E4 G4 E4 E3 G#3 B3 G#3 E3 G#3 B3 G#3' },
    { drum: 1, vol: .7, n: 'k . h . s . h h k . k h s . h h' },
  ] },
  arcade: { bpm: 150, ch: [
    { w: 'p12', vol: .28, n: 'C5 E5 G5 C6 G5 E5 C5 E5 D5 F5 A5 D6 A5 F5 D5 F5 E5 G5 B5 E6 B5 G5 E5 G5 D5 F5 A5 D6 G5 F5 E5 D5' },
    { type: 'triangle', vol: .8, n: 'C3 - C3 - C3 - C3 - D3 - D3 - D3 - D3 - E3 - E3 - E3 - E3 - G2 - G2 - G2 - B2 -' },
    { drum: 1, vol: .6, n: 'k . h . s . h . k k h . s . h .' },
  ] },
  diner: { bpm: 100, ch: [
    { w: 'p25', vol: .35, n: 'G4 - B4 - D5 - - - B4 - D5 - G5 - - - E5 - D5 - B4 - G4 - A4 - - - - - - -' },
    { type: 'triangle', vol: .75, n: 'G2 - D3 - G2 - D3 - G2 - D3 - G2 - D3 - C3 - G2 - C3 - G2 - D3 - A2 - D3 - A2 -' },
    { drum: 1, vol: .5, n: 'k . s . k . s .' },
  ] },
});

// ---------- PILL CATCH '98 (mall arcade) ----------
async function pillCatch() {
  const prev = scene, pm = curName;
  let x = 72, t = 60 * 40, score = 0, items = [], lives = 3, over = false, go = false, sh = 0, wk = 0;
  music('arcade');
  scene = {
    update() {
      if (sh > 0 && --sh === 0) fx.shake = 0;
      if (!go || over) return;
      t--;
      if (held.left) { x -= 2.2; wk++; } if (held.right) { x += 2.2; wk++; }
      x = clamp(x, 0, W - 16);
      if (rnd(Math.max(9, 32 - score)) === 0) items.push({ x: 4 + rnd(W - 16), y: 12, bad: Math.random() < .18 + score / 160, v: .7 + Math.random() * .5 + score / 55 });
      for (const it of items) {
        it.y += it.v;
        if (!it.hit && it.y > 108 && it.y < 122 && it.x + 8 > x + 2 && it.x < x + 14) {
          it.hit = 1;
          if (it.bad) { lives--; sfx('bump'); fx.shake = 2; sh = 12; } else { score++; sfx('tick'); }
        }
      }
      items = items.filter(i => !i.hit && i.y < 130);
      if (t <= 0 || lives <= 0) over = true;
    },
    draw() {
      cls(0);
      for (let i = 0; i < 20; i++) px(hash(i, 5) * W, 14 + hash(i, 6) * 110, 1);
      rect(0, 128, W, 16, 2); rect(0, 128, W, 1, 3);
      for (const it of items) blit(it.bad ? SPR.pillR : SPR.pillG, it.x, it.y);
      blit(SPR.carl.down[wk & 8 ? 1 : 2], x, 112);
      rect(0, 0, W, 11, 3); text('SCORE ' + score, 3, 2, 0); text('@'.repeat(Math.max(0, lives)), 70, 2, 0); text('T' + Math.ceil(t / 60), 130, 2, 0);
    },
  };
  await say('PILL CATCH \'98! Catch the PROP PILLS. Avoid the REAL ones (dark). 3 lives. 40 seconds. HIGH SCORE: 25.');
  go = true; DBG.mode = 'pill'; DBG.pc = () => ({ x, items });
  while (!over) await nextFrame();
  DBG.mode = null;
  sfx(lives > 0 ? 'ok' : 'caught'); await wait(40);
  await say((lives > 0 ? 'TIME! ' : 'GAME OVER. ') + 'SCORE: ' + score + '.');
  if (score > (F('pillBest') || 0)) { setF('pillBest', score); await say('NEW PERSONAL BEST!'); }
  scene = prev; music(pm); fx.shake = 0;
  return score;
}

// ---------- DESERT BUS (for real) ----------
async function desertBus() {
  const prev = scene, pm = curName;
  let bx = 80, miles = 0, pts = 0, off = 0, over = false, quit = false, go = false, t = 0, splat = 0, fig = null;
  music('desert'); mus.rate = 1.3;
  scene = {
    update() {
      if (!go || over) return;
      t++;
      bx += .13 + Math.sin(t / 170) * .06 + (t % 900 < 60 ? .15 : 0);
      if (held.left) bx -= .55; if (held.right) bx += .35;
      miles += .03; off = (off + 2) % 16;
      if (rnd(700) === 0) { pts++; splat = 90; sfx('tick'); }
      if (splat) splat--;
      if (fig === null && rnd(1200) === 0) fig = -32;
      if (fig !== null && (fig += 2) > H) fig = null;
      if (bx < 58 || bx > 102) over = true;
      if (pressed.b) { over = true; quit = true; }
    },
    draw() {
      cls(0);
      for (let i = 0; i < 40; i++) px(hash(i, 1) * W, (hash(i, 2) * H + t * 2) % H, hash(i, 3) < .3 ? 2 : 1);
      rect(52, 0, 56, H, 2); rect(52, 0, 1, H, 3); rect(107, 0, 1, H, 3);
      for (let y = -16 + off; y < H; y += 16) rect(79, y, 2, 8, 0);
      if (fig !== null) blit(SPR.shadow, 128, fig);
      blit(SPR.busV, bx - 8, 100);
      if (splat) { px(bx - 2, 103, 3); px(bx - 1, 102, 3); px(bx, 104, 3); px(bx + 1, 103, 3); }
      rect(0, 0, W, 11, 3); text('MI ' + miles.toFixed(1), 3, 2, 0); text('PTS ' + pts, 110, 2, 0);
    },
  };
  await say('DESERT BUS. Tucson to Las Vegas. The bus pulls to the right. Hold LEFT. Don\'t leave the road. B to give up.');
  go = true; DBG.mode = 'bus'; DBG.bus = () => ({ bx, miles });
  while (!over) await nextFrame();
  DBG.mode = null;
  mus.rate = 1;
  if (!quit) { sfx('caught'); fx.shake = 3; await wait(20); fx.shake = 0; await say('THE BUS VEERED OFF THE ROAD. IT HAS BEEN TOWED BACK TO TUCSON. IN REAL TIME.'); }
  await say('MILES: ' + miles.toFixed(1) + '. POINTS: ' + pts + '.');
  if (miles > (F('busBest') || 0)) setF('busBest', +miles.toFixed(1));
  scene = prev; music(pm);
  return miles;
}
