'use strict';
// ================= TP: THROWING IN THE TOWEL — core =================
// No story. No production. (A production.)
PALS.tp = [[222, 218, 205], [165, 160, 148], [99, 96, 92], [30, 28, 30]];
PALS.offTp = Array(4).fill([120, 118, 110]);
fx.pal = 'tp';
HERO = 'TP';
VOICE = Object.assign({}, VOICE, { TP: [760, 140], CHAT: [2000, 200], 'OLD WASHCLOTH': [500, 40], SOAP: [1400, 60], TOWEL: [1100, 80] });
const TPN = 'TP';

// ---------- memory: TP remembers you, even though there are no save files ----------
let TPM = Object.assign({ visits: 0, msgs: [], squares: 0, lore: 0, vault: false, done: 0, fx: 'FULL', meta: {}, stares: 0 }, fetchStore('tp_mem') || {});
const saveM = () => store('tp_mem', TPM);
const CARTS = [['CARL', 'carl_meta', '../index.html', 'dmg'], ['CEO LINDA', 'linda_meta', '../linda/index.html', 'pink'], ['SPOOKY GHOST', 'ghost_meta', '../ghost/index.html', 'red']];
const metaOf = k => fetchStore(k) || { boots: 0, endings: 0 };

// ---------- TP himself: a roll. drawn big, at runtime ----------
function rollSprite(mood) {
  return mk(32, 44, g => {
    g.r(2, 7, 28, 30, 3); g.r(3, 7, 26, 29, 0);
    g.e(16, 37, 14.5, 4.5, 3); g.e(16, 36, 13, 3.5, 0);
    g.r(3, 8, 2, 28, 1); g.r(27, 8, 2, 28, 1);
    for (const y of [15, 24, 33]) for (let x = 4; x < 28; x += 3) g.p(x, y, 1);
    g.e(16, 7, 14.5, 5.5, 3); g.e(16, 7, 13, 4.5, 0); g.e(16, 7, 6, 2.6, 2); g.e(16, 7, 4, 1.6, 3);
    g.r(27, 22, 5, 20, 3); g.r(28, 22, 3, 19, 0); for (let y = 26; y < 42; y += 4) g.p(29, y, 1); g.r(27, 41, 5, 1, 3);
    if (mood === 'blink') { g.r(10, 20, 4, 1, 3); g.r(18, 20, 4, 1, 3); }
    else { g.r(11, 18, 2, 4, 3); g.r(19, 18, 2, 4, 3); }
    if (mood === 'mad') { g.p(10, 16, 3); g.p(11, 17, 3); g.p(12, 17, 3); g.p(21, 16, 3); g.p(20, 17, 3); g.p(19, 17, 3); }
    if (mood === 'talk') { g.e(16, 27, 3, 2, 3); g.r(15, 27, 2, 1, 2); }
    else if (mood === 'worried') { g.r(13, 28, 6, 1, 3); g.p(12, 29, 3); g.p(19, 29, 3); }
    else g.r(13, 27, 6, 1, 3);
  });
}
const ROLL = { n: rollSprite('n'), blink: rollSprite('blink'), mad: rollSprite('mad'), talk: rollSprite('talk'), worried: rollSprite('worried') };
SPR.tp = ROLL.n;
SPR.mic = mk(12, 26, g => { g.e(6, 5, 5.5, 5.5, 3); g.e(6, 5, 4.5, 4.5, 2); for (let i = 2; i < 10; i += 2) { g.r(2, i, 8, 1, 1); } g.r(4, 10, 4, 3, 3); g.r(5, 13, 2, 12, 3); g.r(4, 24, 4, 2, 3); });
SPR.towel = (() => { const rows = ['................', '................', '..333333333333..', '..300000000003..', '..301111111103..', '..300000000003..', '..303300003303..', '..303000003003..', '..300000000003..', '..301111111103..', '..300000000003..', '..300033330003..', '..300000000003..', '..333333333333..', '..3.3.3..3.3.3..', '................'];
  const f = [R(rows), R(rowsSwap(rows, { 14: '...3.3.33.3.3...' }))]; return { down: [f[0], f[1], f[0]], up: [f[0], f[1], f[0]], side: [f[0], f[1], f[0]] }; })();
SPR.washcloth = R(['................', '................', '...3333333333...', '...3000000003...', '...3020202003...', '...3000000003...', '...3033003303...', '...3000000003...', '...3002222003...', '...3000000003...', '...3020202003...', '...3333333333...', '....3......3....', '...33......33...', '................', '................']);
SPR.soapy = [0, 1].map(k => mk(16, 16, g => { g.e(8, 10, 7, 5 - k, 3); g.e(8, 10, 6, 4 - k, 1); g.r(5, 8, 2, 2, 3); g.r(10, 8, 2, 2, 3); g.e(4, 3 - k, 2, 2, 2); g.e(12, 4, 1.5, 1.5, 2); }));
SPR.soap = { down: [SPR.soapy[0], SPR.soapy[1], SPR.soapy[0]], up: [SPR.soapy[0], SPR.soapy[1], SPR.soapy[0]], side: [SPR.soapy[0], SPR.soapy[1], SPR.soapy[0]] };
SPR.duck = mk(16, 16, g => { g.e(8, 10, 6, 4, 3); g.e(8, 10, 5, 3, 0); g.e(10, 5, 3.5, 3.5, 3); g.e(10, 5, 2.5, 2.5, 0); g.p(11, 4, 3); g.r(13, 5, 3, 2, 2); });
SPR.miniTP = mk(16, 16, g => { g.r(3, 3, 10, 11, 3); g.r(4, 3, 8, 10, 0); g.e(8, 3, 5, 2, 3); g.e(8, 3, 4, 1.4, 0); g.p(8, 3, 3); g.r(6, 7, 1, 2, 3); g.r(9, 7, 1, 2, 3); g.r(6, 10, 4, 1, 3); });

// ---------- Towel Quest tiles (the actual game, waiting behind him) ----------
const btile = g => g.each((x, y) => (x % 8 === 0 || y % 8 === 0) ? 1 : 0);
tile('btile', T(btile));
tile('bwall', T(g => { g.each((x, y) => (x % 8 === 0 || y % 5 === 0) ? 2 : 1); g.r(0, 13, 16, 3, 3); }), { solid: 1, look: ['Bathroom wall. Tiles. I drew every one of those tiles. Well. I drew one and copied it.', 'It\'s a wall, bro.'] });
tile('bmat', T(g => { btile(g); g.r(1, 3, 14, 10, 2); g.o(2, 4, 12, 8, 1); }));
tile('tub', T(g => { btile(g); g.r(0, 2, 16, 13, 3); g.r(2, 4, 12, 9, 0); g.r(3, 5, 10, 3, 1); }), { solid: 1, look: 'A bathtub. The towel\'s ancestral home. That\'s the lore. I made that up just now. That\'s the only lore.' });
tile('sink', T(g => { btile(g); g.e(8, 9, 7, 5, 3); g.e(8, 9, 5.5, 3.5, 0); g.r(7, 2, 2, 5, 3); }), { solid: 1, look: 'A sink. It\'s a sink, bro. Keep moving.' });
tile('rack', [0, 1].map(k => T(g => { btile(g); g.r(1, 3, 14, 2, 3); g.r(2, 1, 2, 12, 3); g.r(12, 1, 2, 12, 3); if (k) g.r(4, 4, 8, 7, 0); })), { solid: 1, spd: 40 });
tile('tqdoor', T(g => { g.fill(3); g.r(2, 1, 12, 15, 2); g.r(3, 2, 10, 13, 1); g.e(11, 9, 1, 1, 3); }), { solid: 1 });
tile('tqopen', T(g => { g.fill(3); g.r(2, 1, 12, 15, 3); }));
tile('tvset', [0, 1].map(k => T(g => { btile(g); g.r(1, 2, 14, 11, 3); g.r(2, 3, 12, 8, 1); g.r(6, 4, 4, 6, 0); g.e(8, 4, 2, 1, 2); g.p(7, 6, 3); g.p(9, 6, 3); if (k) g.r(7, 8, 2, 1, 3); g.r(4, 13, 2, 2, 3); g.r(10, 13, 2, 2, 3); })), { solid: 1, spd: 20 });

// ---------- music ----------
Object.assign(TRACKS, {
  hang: { bpm: 80, ch: [
    { w: 'p12', vol: .18, n: 'A4 - C5 - E5 - . . G4 - B4 - D5 - . . F4 - A4 - C5 - . . E4 - G4 - B4 - . .' },
    { w: 'p25', vol: .26, n: '. . . . . . . . . . . . E5 - D5 - . . . . . . . . . . . . C5 - - - . . . . . . . . . . . . A4 - G4 - . . . . . . . . . . . . A4 - - -' },
    { type: 'triangle', vol: .7, n: 'A2 - - - - - E2 - G2 - - - - - D2 - F2 - - - - - C2 - E2 - - - - - B1 -' },
    { drum: 1, vol: .45, n: 'k . . h s . . h k . k h s . . .' },
  ] },
  tq: { bpm: 144, ch: [
    { w: 'p50', vol: .3, n: 'C5 E5 G5 E5 C5 E5 G5 C6 B4 D5 G5 D5 B4 D5 G5 B5 A4 C5 F5 C5 A4 C5 F5 A5 G4 B4 D5 G5 F5 E5 D5 B4' },
    { type: 'triangle', vol: .8, n: 'C3 - C3 - G2 - G2 - G2 - G2 - D3 - D3 - F2 - F2 - C3 - C3 - G2 - G2 - B2 - G2 -' },
    { drum: 1, vol: .55, n: 'k . h . s . h . k k h . s . h h' },
  ] },
});

// ---------- settings: effects FULL / GENTLE / OFF ----------
const effLv = () => TPM.fx || 'FULL';
function clearFx() { fx.wave = 0; fx.roll = 0; fx.cycle = 0; fx.noise = 0; fx.shake = 0; fx.invert = 0; fx.lcd = 0; fx.pal = 'tp'; }
async function settings() {
  const cur = effLv();
  await say('EFFECTS: ' + cur + '. (GENTLE = no wobble or rolling. OFF = no screen effects at all.)', null, { keep: 1 });
  const i = await choose(['FULL', 'GENTLE', 'OFF'], { cancel: 1 }); dlg = null;
  if (i >= 0) { TPM.fx = ['FULL', 'GENTLE', 'OFF'][i]; saveM(); sfx('ok'); await say('Noted. I respect that. I\'m still going to do bits. They\'ll just be... quieter.', TPN); }
}

// ---------- on-screen keyboard (name-entry style) ----------
const KEYS_A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?\'- ';
async function keyboard(prompt, max = 24, digits = false) {
  const keys = (digits ? '0123456789' : KEYS_A).split('').concat(['DEL', 'END']);
  const cols = digits ? 6 : 9;
  let i = 0, s = '';
  const prev = scene;
  scene = { update() {}, draw() {
    cls(0); box(0, 0, W, H);
    wrap(prompt.toUpperCase(), 24).slice(0, 3).forEach((l, k) => text(l, 8, 6 + k * 10, 2));
    rect(6, 38, W - 12, 13, 3); text(s + ((frame >> 4) & 1 ? '_' : ''), 9, 41, 0);
    const nChars = keys.length - 2, rowsN = Math.ceil(nChars / cols);
    keys.forEach((k, n) => {
      let x = 10 + (n % cols) * (digits ? 22 : 16), y = 58 + ((n / cols) | 0) * 13;
      if (k.length > 1) { x = k === 'DEL' ? 88 : 120; y = 58 + rowsN * 13; } // DEL / END on their own row
      if (n === i) rect(x - 3, y - 3, k.length > 1 ? 22 : 11, 12, 1);
      text(k === ' ' ? '_' : k, x, y, 3);
    });
    text('A:TYPE B:DEL START:DONE', 10, 132, 2);
  } };
  await nextFrame();
  DBG.mode = 'kbd'; DBG.kb = { keys, i: () => i, s: () => s };
  for (;;) {
    await nextFrame();
    if (pressed.right) { i = (i + 1) % keys.length; sfx('move'); }
    if (pressed.left) { i = (i + keys.length - 1) % keys.length; sfx('move'); }
    if (pressed.down) { i = Math.min(keys.length - 1, i + cols); sfx('move'); }
    if (pressed.up) { i = Math.max(0, i - cols); sfx('move'); }
    if (pressed.b && s) { s = s.slice(0, -1); sfx('tick'); }
    if (pressed.start || (pressed.a && keys[i] === 'END')) { if (s.trim()) break; sfx('bump'); }
    else if (pressed.a) { if (keys[i] === 'DEL') s = s.slice(0, -1); else if (s.length < max) s += keys[i]; sfx('blip', 1200); }
  }
  DBG.mode = null; sfx('ok'); scene = prev;
  return s.trim();
}

// ---------- boot / title ----------
async function boot() {
  fx.pal = 'offTp'; fx.fade = 0;
  scene = { draw() { cls(0); } };
  fit(); requestAnimationFrame(loop);
  while (!anyKey) await nextFrame();
  await wait(20);
  fx.pal = 'tp';
  let y = -16, ty = -60;
  scene = { draw() {
    cls(0); bigtext('PRETEND CO', 21, y, 3, 2); if (y >= 60) text('(R)', 136, y + 1);
    if (ty > -60) { rect(10, ty, 140, 50, 3); rect(12, ty, 136, 48, 0); for (let x = 14; x < 146; x += 4) rect(x, ty + 48, 2, 5, 1); rect(12, ty + 8, 136, 2, 1); rect(12, ty + 38, 136, 2, 1); }
  } };
  while (y < 60) { y++; await wait(2); }
  await wait(12); sfx('ding'); await wait(60);
  while (ty < 44) { ty += 3; await nextFrame(); } // the towel lands on the logo
  sfx('door'); fx.shake = 1; await wait(8); fx.shake = 0;
  await wait(50);
  await say('No logo today.', TPN);
  await fadeOut(4); ttitle(); await fadeIn(4);
}
function ttitle() {
  music(null); clearFx();
  let t = 0;
  scene = {
    update() { t++; if (!busy && t > 30 && (pressed.start || pressed.a)) { sfx('ok'); run(enterShow); } if (!busy && pressed.select) run(settings); },
    draw() {
      cls(0);
      bigtext('TP', 10, 14, 3, 6);
      bigblit(ROLL[(t >> 6) % 7 === 0 ? 'blink' : 'n'], 104, 18, 1);
      ctext(TPM.done ? 'THE TOWEL HAS BEEN THROWN' : 'THROWING IN THE TOWEL', 70, 3);
      if ((t >> 5) & 1) ctext(TPM.vault ? 'HE IS IN THE VAULT' : (t >> 7) & 1 ? 'OR DON\'T' : 'PUSH START', 94, 2);
      text('SELECT: EFFECTS ' + effLv(), 20, 116, 1);
      ctext('(C)2001 PRETEND CO.', 130, 2);
    },
  };
}
