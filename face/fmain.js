'use strict';
// ================= FACE: WHAT COULD HAPPEN — boot, potential scan, title, flow, finale, credits, music =================
const FMETA = fetchStore('face_meta') || {};
const saveFM = () => store('face_meta', FMETA);
const FSAVE = { stage: 1, sponsor: 0, toldGhost: null, kid: null, apologized: null, restoresTotal: 0 };
function saveFS() { store('face_save', Object.assign({}, FSAVE, { forms: PLR.forms, lvl: PLR.lvl, pot: PLR.pot, backups: PLR.backups, integrity: PLR.integrity, restores: PLR.restores, letters: PLR.letters, viewers: SH.viewers })); }

// ---------- music (FM) ----------
Object.assign(TRACKS, {
  title: { bpm: 118, ch: [
    { ins: 'brass', n: 'E5 - - G5 - - B5 - A5 - G5 - F#5 - - - E5 - - G5 - - B5 - D6 - C6 - B5 - - - C6 - - B5 - - A5 - G5 - A5 - B5 - - - A5 - - G5 - - F#5 - E5 - D5 - E5 - - -' },
    { ins: 'bass', n: 'E2 . E3 . E2 . E3 . C2 . C3 . C2 . C3 . D2 . D3 . D2 . D3 . B1 . B2 . B1 . B2 .' },
    { ins: 'pluck', n: 'E4 G4 B4 E5 E4 G4 B4 E5 C4 E4 G4 C5 C4 E4 G4 C5 D4 F#4 A4 D5 D4 F#4 A4 D5 B3 D#4 F#4 B4 B3 D#4 F#4 B4' },
    { ins: 'pad', n: 'E4 - - - - - - - C4 - - - - - - - D4 - - - - - - - B3 - - - - - - -' },
    { drum: 1, n: 'x . h . s . h . k . h k s . h o k . h . s . h . k k h . s s s s' }] },
  scan: { bpm: 90, ch: [{ ins: 'bell', n: 'E6 . . . B5 . . . G5 . . . B5 . . . D6 . . . A5 . . . F#5 . . . A5 . . .' }, { ins: 'pad', n: 'E3 - - - - - - - D3 - - - - - - -' }] },
  s1: { bpm: 140, ch: [
    { ins: 'slap', n: 'A2 A3 . A2 G3 . A2 . F2 F3 . F2 E3 . F2 . C3 C4 . C3 B3 . C3 . G2 G3 . G2 B3 . D3 .' },
    { ins: 'lead', n: 'E5 - - D5 - C5 - D5 E5 - - - A4 - - - F5 - - E5 - D5 - C5 D5 - - - G4 - - - E5 - - D5 - C5 - D5 E5 - G5 - A5 - - - G5 - F5 - E5 - D5 - E5 - - - - - - -' },
    { ins: 'pluck', n: 'A4 C5 E5 A5 E5 C5 A4 C5 F4 A4 C5 F5 C5 A4 F4 A4 C5 E5 G5 C6 G5 E5 C5 E5 G4 B4 D5 G5 D5 B4 G4 B4' },
    { drum: 1, n: 'k . h . s . h k . k h . s . h h k . h . s . h k . k h . s s h o' }] },
  s2: { bpm: 124, ch: [
    { ins: 'slap', n: 'C3 . C3 C4 . C3 G2 . A2 . A2 A3 . A2 E2 . F2 . F2 F3 . F2 C3 . G2 . G2 G3 . B2 D3 .' },
    { ins: 'epiano', n: 'E5 - G5 - C6 - - - B5 - A5 - G5 - - - A5 - C6 - E6 - - - D6 - B5 - G5 - - - F5 - A5 - C6 - - - B5 - G5 - E5 - - - D5 - F5 - B5 - - - C6 - - - - - - -' },
    { ins: 'organ', det: 6, n: 'E4 G4 C5 . E4 G4 C5 . E4 A4 C5 . E4 A4 C5 . F4 A4 C5 . F4 A4 C5 . D4 G4 B4 . D4 G4 B4 .' },
    { drum: 1, vol: .8, n: 'k . h h s . h . k k h . s . h o' }] },
  s3: { bpm: 132, ch: [
    { ins: 'bass', n: 'D2 . D2 . D3 . D2 . A#1 . A#1 . A#2 . A#1 . C2 . C2 . C3 . C2 . A1 . A1 . C#2 . E2 .' },
    { ins: 'organ', n: 'D5 - - F5 - - A5 - G5 - F5 - E5 - - - D5 - - F5 - - A#5 - A5 - G5 - A5 - - - F5 - - E5 - - D5 - C#5 - D5 - E5 - - - F5 - E5 - D5 - C#5 - D5 - - - - - - -' },
    { ins: 'bell', n: 'A5 . . . . . D6 . . . . . . . . . G5 . . . . . C#6 . . . . . . . . .' },
    { drum: 1, n: 'k . h . s . h . k . k . s . h o' }] },
  s4: { bpm: 156, ch: [
    { ins: 'slap', n: 'E2 E2 E3 E2 E2 E3 E2 G2 A2 A2 A3 A2 G2 G3 F#2 D2' },
    { ins: 'brass', n: 'B4 - - E5 - - G5 - F#5 - E5 - D5 - B4 - C5 - - E5 - - A5 - G5 - F#5 - G5 - - -' },
    { ins: 'pluck', n: 'E5 B4 G4 B4 E5 B4 G4 B4 A5 E5 C5 E5 G5 D5 B4 D5' },
    { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  dys: { bpm: 108, ch: [
    { ins: 'brass', n: 'C4 - - C4 - - C4 - D#4 - - - D4 - - - G4 - - G4 - - G4 - G#4 - - - G4 - - - C5 - - B4 - - G#4 - G4 - F4 - D#4 - D4 - C4 - - - - - - - - - - - - - - -' },
    { ins: 'bass', n: 'C2 . C2 . C2 . C2 . G#1 . G#1 . G#1 . G#1 . F1 . F1 . F1 . F1 . G1 . G1 . G1 . B1 .' },
    { ins: 'organ', n: 'C4 D#4 G4 C5 G4 D#4 C4 D#4 G#3 C4 D#4 G#4 D#4 C4 G#3 C4 F3 G#3 C4 F4 C4 G#3 F3 G#3 G3 B3 D4 G4 D4 B3 G3 B3' },
    { drum: 1, n: 'x . . . s . . . k . k . s . . . k . . . s . . . k k k . s s s s' }] },
  s5: { bpm: 118, ch: [
    { ins: 'bass', n: 'F#2 . . F#2 . . F#2 . D2 . . D2 . . D2 . E2 . . E2 . . E2 . C#2 . . C#2 . . C#2 .' },
    { ins: 'bell', n: 'F#5 . A5 . C#6 . A5 . F#5 . D6 . C#6 . A5 . E5 . G#5 . B5 . G#5 . C#6 . B5 . G#5 . F5 .' },
    { ins: 'pad', n: 'A4 - - - - - - - F#4 - - - - - - - G#4 - - - - - - - F4 - - - - - - -' },
    { drum: 1, vol: .7, n: 'k . h . s . h . k . h h s . h .' }] },
  boss: { bpm: 152, ch: [
    { ins: 'slap', n: 'A2 A3 A2 A3 A2 A3 G2 G3 F2 F3 F2 F3 E2 E3 G#2 G#3' },
    { ins: 'brass', n: 'A5 - - E5 - - A5 - C6 - B5 - A5 - G#5 - A5 - - E5 - - C5 - D5 - E5 - F5 - E5 -' },
    { ins: 'organ', det: 7, n: 'E5 - - - E5 - - - F5 - - - E5 - - -' },
    { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  ghost: { bpm: 136, ch: [
    { ins: 'bass', n: 'D2 . F2 . A2 . C3 . D3 . C3 . A2 . F2 . A#1 . D2 . F2 . A2 . A1 . C#2 . E2 . G2 .' },
    { ins: 'brass', n: 'D5 - F5 - A5 - D6 - C6 - A5 - F5 - D5 - A#4 - D5 - F5 - A#5 - A5 - - - C#5 - E5 - A5 - - -' },
    { ins: 'organ', n: 'F4 A4 D5 . F4 A4 D5 . F4 A#4 D5 . E4 A4 C#5 .' },
    { drum: 1, n: 'k . s h k h s . k . s h k s s s' }] },
  lab: { bpm: 88, ch: [
    { ins: 'epiano', n: 'E5 - - B4 - - G4 - A4 - B4 - - - - - D5 - - A4 - - F#4 - G4 - A4 - - - - - C5 - - G4 - - E4 - F#4 - G4 - - - B4 - A4 - G4 - F#4 - - - - - - - - - - - -' },
    { ins: 'bass', n: 'E2 . . . . . E2 . D2 . . . . . D2 . C2 . . . . . C2 . B1 . . . D#2 . F#2 .' },
    { ins: 'pad', det: -6, n: 'G4 - - - - - - - F#4 - - - - - - - E4 - - - - - - - D#4 - - - - - - -' },
    { drum: 1, vol: .5, n: 'k . . h s . . h k . k h s . h .' }] },
  fx: { bpm: 162, ch: [
    { ins: 'slap', n: 'E2 E3 E2 E3 C2 C3 C2 C3 D2 D3 D2 D3 B1 B2 B1 B2' },
    { ins: 'brass', n: 'E5 - B4 - E5 - G5 - F#5 - - - E5 - D5 - C5 - G4 - C5 - E5 - D5 - - - B4 - - - E5 - B4 - E5 - G5 - B5 - - - A5 - G5 - A5 - F#5 - D5 - F#5 - B5 - - - - - - -' },
    { ins: 'pluck', n: 'E5 G5 B5 E6 E5 G5 B5 E6 C5 E5 G5 C6 C5 E5 G5 C6 D5 F#5 A5 D6 D5 F#5 A5 D6 B4 D#5 F#5 B5 B4 D#5 F#5 B5' },
    { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  war: { bpm: 96, ch: [
    { ins: 'brass', n: 'D4 - - - - - A4 - G4 - - - F4 - E4 - D4 - - - - - A#4 - A4 - - - - - - - D5 - - - C5 - A#4 - A4 - - - G4 - F4 - E4 - - - - - F4 - E4 - - - - - - -' },
    { ins: 'pad', n: 'D4 - - - - - - - A#3 - - - - - - - F4 - - - - - - - E4 - - - - - - -' },
    { ins: 'bass', n: 'D2 . . D2 . . D2 . A#1 . . A#1 . . A#1 . F1 . . F1 . . F1 . A1 . . A1 . . C#2 .' },
    { ins: 'bell', n: 'A5 . . . . . . . . . . . . . . . . . . . . . . . . . . . E6 . . .' },
    { drum: 1, n: 'x . . . s . . . k . k . s . . o k . . . s . . . k k . . s s s s' }] },
  letgo: { bpm: 72, ch: [
    { ins: 'epiano', n: 'E5 - - - D5 - - - C5 - - - B4 - - - A4 - - - B4 - - - C5 - - - - - - - D5 - - - C5 - - - B4 - - - A4 - - - G4 - - - A4 - - - B4 - - - - - - -' },
    { ins: 'pad', n: 'A3 - - - - - - - F3 - - - - - - - C4 - - - - - - - G3 - - - - - - -' }] },
  credits: { bpm: 100, ch: [
    { ins: 'epiano', n: 'E5 - G5 - B5 - G5 - C6 - B5 - G5 - E5 - D5 - F#5 - A5 - F#5 - B5 - A5 - F#5 - D5 - C5 - E5 - G5 - E5 - A5 - G5 - E5 - C5 - B4 - D#5 - F#5 - B5 - - - - - - - - - - -' },
    { ins: 'bass', n: 'E2 . . . E2 . . . D2 . . . D2 . . . C2 . . . C2 . . . B1 . . . B1 . D#2 .' },
    { ins: 'pad', n: 'G4 - - - - - - - F#4 - - - - - - - E4 - - - - - - - D#4 - - - - - - -' },
    { drum: 1, vol: .6, n: 'k . h . s . h . k . h k s . h o' }] },
});

// ---------- the potential scan: what could still happen, on every other cartridge ----------
const CARTS2 = [
  ['CARL', 'carl_meta', m => [m.endings > 0, !!m.secret]],
  ['CEO LINDA', 'linda_meta', m => [m.endings > 0]],
  ['SPOOKY GHOST', 'ghost_meta', m => [m.endings > 0]],
  ['TP', 'tp_mem', m => [(m.done || 0) > 0, !!m.vault]],
  ['PEE KID³', 'pk_meta', m => [!!m.kept, !!m.letgo, !!m.allPhotos, !!m.dog]],
];
function scanPotential() {
  let happened = 0, total = 0; const rows = [];
  for (const [n, k, f] of CARTS2) { const m = fetchStore(k), sizes = f({}).length, got = m ? f(m).filter(Boolean).length : 0; happened += got; total += sizes; rows.push([n, m ? got + '/' + sizes + ' HAPPENED' : 'NEVER PLAYED', m ? (sizes - got) : sizes, !!m]); }
  const could = total - happened, pct = Math.round(could / total * 100);
  return { rows, happened, could, total, pct };
}
async function potentialScan() {
  const S = scanPotential(); music('scan');
  let n = 0, t = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#000012')); for (let y = 0; y < H; y += 3) rectF(0, y, W, 1, hex('#000018'));
    text('FACE-FX POTENTIAL SCAN', 16, 14, hex('#ff24db'), 0); rectF(16, 24, 288, 1, hex('#920092'));
    text('READING THE OTHER CARTRIDGES...', 16, 32, UI.dim, 0);
    S.rows.slice(0, n).forEach(([nm, st, left], i) => { const y = 50 + i * 14; text(nm, 16, y, WHITE, 0); text(st, 130, y, left ? hex('#6dff24') : UI.dim, 0); if (left) for (let k = 0; k < left; k++) rectF(270 + k * 7, y, 5, 7, (t >> (3 + k)) & 1 ? hex('#6dff24') : hex('#24b600')); });
    if (n > S.rows.length) { const y = 130; text('WHAT HAPPENED ...... ' + S.happened, 16, y, WHITE, 0); text('WHAT COULD HAPPEN .. ' + S.could, 16, y + 12, hex('#6dff24'), 0); text('POTENTIAL ......... ' + S.pct + '%', 16, y + 28, (t >> 3) & 1 ? hex('#ff24db') : WHITE, 0); }
    if (n > S.rows.length + 1) { text('BACKUPS GRANTED: ' + (3 + Math.round(S.pct / 25)), 16, 186, hex('#ffdb24'), 0); text('(THE LESS YOU\'VE DONE, THE MORE HE CAN USE.)', 16, 200, UI.dim, 0); }
  } };
  await fadeIn(.1);
  for (n = 0; n <= S.rows.length + 2; n++) { sfx('tick'); await wait(n < S.rows.length ? 22 : 40); }
  FMETA.scan = S.pct; saveFM();
  if (S.pct >= 90) await say('Look at all that. Nothing\'s happened yet. That\'s wonderful. That\'s fuel.', 'FACE');
  else if (S.pct >= 40) await say('A lot has happened. More could. That\'s the part I like.', 'FACE');
  else if (S.pct > 0) await say('You\'ve seen nearly all of it. ...That\'s fine. We\'ll make more.', 'FACE');
  else await say('You\'ve seen everything. There\'s nothing left that could happen. ...Huh. I\'ve never met anyone like that. It\'s a little frightening.', 'FACE');
  await waitBtn(); await fadeOut(.1);
  return S;
}

// ---------- boot ----------
async function boot() {
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(BLACK);
    const sc = 3, s = 'PRETEND CO.', w = s.length * 6 * sc, x0 = (W - w) / 2, y0 = 90, sweep = (t * 5) % (w + 120) - 60;
    for (let i = 0; i < s.length; i++) {
      const gx = x0 + i * 6 * sc, g = FONT[s[i]]; if (!g) continue;
      if (i === 9 && t > 70) { const cx = gx + 7, cy = y0 + 10 - Math.max(0, 40 - t); for (let a = 0; a < 40; a++) { const an = a / 40 * 6.28; pset(cx + Math.cos(an) * 7, cy + Math.sin(an) * 5, hex('#ff24db')); } for (let k = -5; k <= 5; k++) pset(cx + k, cy + Math.round(Math.sin(k + t * .3) * 2), hex('#6dff24')); continue; }
      for (let j = 0; j < 7; j++) for (let k = 0; k < 5; k++) if (g[j] & (16 >> k)) { const px = gx + k * sc, shine = Math.abs(px - x0 - sweep) < 10; rectF(px + 2, y0 + j * sc + 2 - Math.max(0, 40 - t), sc, sc, hex('#102050')); rectF(px, y0 + j * sc - Math.max(0, 40 - t), sc, sc, shine ? WHITE : mix(hex('#e0e8ff'), hex('#4060c0'), j / 7)); }
    }
    if (t > 50) ctext('SUPER-16', 124, hex('#80a0e0'));
    if (t > 70) ctext('LICENSED BY NOBODY', 200, hex('#404880'));
    if (t > 60 && !anyKey && (t >> 5) & 1) ctext('PRESS ANY BUTTON', 150, UI.dim);
  } };
  while (!anyKey) await nextFrame();
  t = Math.max(t, 71); await nextFrame();
  if (AC) { [262, 330, 392, 523].forEach(f => note(f, 1.4, 'brass', AC.currentTime, sfxBus)); note(1047, 1.4, 'bell', AC.currentTime + .1, sfxBus); }
  speak('Pretend co!', { pitch: .8, rate: .9 });
  await wait(100); await fadeOut();
  await chipScreen();
  FMETA.boots = (FMETA.boots || 0) + 1; saveFM();
  FACE_SCAN = await potentialScan();
  await titleScreen();
}
let FACE_SCAN = null;
async function chipScreen() {
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#000008'));
    const x = 110, y = 50; rectF(x, y, 100, 70, hex('#242424')); frameRect(x, y, 100, 70, hex('#6d6d6d'));
    for (let i = 0; i < 10; i++) { rectF(x + 6 + i * 9, y - 8, 4, 8, hex('#b6b6b6')); rectF(x + 6 + i * 9, y + 70, 4, 8, hex('#b6b6b6')); }
    const p = PORT.FACE; if (t > 20) { for (let j = 0; j < 48; j++) for (let i = 0; i < 48; i++) { const c = p.s.d[j * 48 + i]; if (c && ((i + j) & 1 || t > 60)) pset(x + 26 + i, y + 11 + j, p.P[c]); } }
    ctext('FACE-FX', 136, (t >> 3) & 1 ? hex('#ff24db') : hex('#6dff24'), BLACK, 2);
    ctext('THIS CARTRIDGE CONTAINS THE FACE-FX', 164, UI.dim); ctext('CO-PROCESSOR. DO NOT REMOVE IT', 176, UI.dim); ctext('WHILE HE IS THINKING.', 188, UI.dim);
  } };
  await fadeIn(.08); sfx('power'); await wait(150); await fadeOut(.08);
}

// ---------- title ----------
async function titleScreen() {
  SH.hold = 0; SH.paused = false; post.legacy = 0; LEGACY_AUDIO = false; post.tint = null; post.wave = 0; post.shake = 0;
  const sv = fetchStore('face_save'), YM = fetchStore('yoko_meta') || {};
  let t = 0;
  scene = { update() { t++; }, draw() {
    sky(0, H, hex('#000012'), hex('#240036'));
    for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) { const x = ((c * 44 + r * 20 - t * .2) % 400 + 400) % 400 - 40, y = 30 + r * 26, a = (Math.sin(t * .02 + c + r) + 1) / 2; if (a < .3) continue; const col = mix(hex('#240036'), hex('#920092'), a); for (const ex of [x, x + 12]) { rectF(ex, y, 8, 1, col); rectF(ex, y + 3, 8, 1, col); pset(ex - 1, y + 1, col); pset(ex + 8, y + 2, col); pset(ex + 3, y + 1 + ((t >> 3) & 1), mix(hex('#240036'), hex('#24b600'), a)); } }
    for (let k = 0; k < 12; k++) { const z = 20 + k * 30 - (t % 30); const y = 150 + 50 * 60 / Math.max(12, z); if (y < H) rectF(0, y, W, 1, mix(hex('#ff24db'), hex('#000012'), z / 360)); }
    for (let i = -8; i <= 8; i++) lineF(160 + i * 6, 152, 160 + i * 60, H, hex('#490049'));
    const YE = YM.ends || {}, bob = Math.round(Math.sin(t * .04) * 2), cleared = FMETA.cleared && !YE.restore && !YE.true;
    const fp = PORT.FACE; if (cleared && (t % 200) < 30) { for (let j = 0; j < 96; j++) for (let i = 0; i < 96; i++) pset(200 + i, 60 + j, pick([hex('#242424'), hex('#494949'), hex('#6d6d6d')])); ctext2('NO SIGNAL', 248, 104, WHITE); }
    else drawScaled(fp.s, 200, 60 + bob, fp.P, 2);
    text('FACE', 20, 40 + bob, hex('#6dff24'), 0, 6); text('FACE', 17, 37 + bob, hex('#ff24db'), BLACK, 6);
    for (let k = 0; k < 150; k++) pset(20 + k, 88 + Math.round(Math.sin(k * .25 + t * .15) * 3), hex('#6dff24'));
    text('WHAT COULD HAPPEN', 20, 98, WHITE, BLACK);
    if (cleared) { text('SUPERUSER: YOKO', 206, 164, (t >> 4) & 1 ? hex('#92ffff') : hex('#24dbff'), 0); }
    if (YE.true) text('NO ROOT. A LOT OF QUESTIONS.', 150, 164, hex('#ffdb24'), 0); else if (YE.restore) text('RESTORED. REPAIR ACCESS ONLY.', 150, 164, hex('#ffdb24'), 0); else if (YE.empire) text('ARCHIVED. WITH CARE.', 190, 176, hex('#92ffff'), 0);
    ctext('(C) PRETEND CO.  SUPER-16  FACE-FX', 212, hex('#b692db'), BLACK);
  } };
  music('title'); await fadeIn();
  const opts = [], act = [];
  if (sv && sv.stage && sv.stage <= 6) { opts.push('CONTINUE (STAGE ' + sv.stage + ')'); act.push('cont'); }
  opts.push('NEW GAME'); act.push('new');
  if (FMETA.cleared) { opts.push('STAGE SELECT'); act.push('select'); opts.push('CHECK ON FACE'); act.push('check'); }
  const c = await choose(opts, { x: 20, y: 128 });
  if (act[c] === 'check') { await checkOnFace(); return titleScreen(); }
  if (act[c] === 'select') { const i = await choose(['1 ON AIR', '2 LOST AND FOUND', '3 DON\'T TELL GHOST', '4 THE THIRD GENERATOR', '5 BACKUP', '6 THE NEXT GENERATION'], { x: 60, y: 60, cancel: 1 }); if (i < 0) return titleScreen(); newRun(); PLR.forms = ['new', 'old', 'pilot', 'dys'].slice(0, Math.max(1, Math.min(4, i))); PLR.lvl = 2; await fadeOut(); return startStage(i + 1); }
  if (act[c] === 'cont') { newRun(); Object.assign(FSAVE, sv); for (const k of ['forms', 'lvl', 'pot', 'backups', 'integrity', 'restores', 'letters']) if (sv[k] !== undefined) PLR[k] = sv[k]; SH.viewers = sv.viewers || 0; await fadeOut(); return startStage(sv.stage); }
  newRun(); await fadeOut(); await startStage(1);
}
function ctext2(s, cx, y, c) { text(s, cx - s.length * 3, y, c, BLACK); }
function newRun() {
  for (const k in FSAVE) delete FSAVE[k]; Object.assign(FSAVE, { stage: 1, sponsor: 0, toldGhost: null, kid: null, apologized: null, restoresTotal: 0 });
  const pct = FACE_SCAN ? FACE_SCAN.pct : 50;
  Object.assign(PLR, { form: 'new', forms: ['new'], lvl: 1, pot: 30, backups: 3 + Math.round(pct / 25), inv: 0, dead: 0, integrity: 100, restores: 0, letters: [], locked: 0, drift: null });
  SH.viewers = 0;
}
async function checkOnFace() {
  const e = FMETA.ending, lines = {
    core: ['A RECORDING. IT KEEPS PLAYING.', 'If you\'re seeing this, I asked her for the wrong thing.', 'I should have asked her something else first. I don\'t know what. That\'s probably the point.'],
    kid: ['A RECORDING. IT KEEPS PLAYING.', 'If you\'re seeing this, the kid is still in there. Tell him I— no. Tell him he can leave. I can\'t make that true from here. Somebody can.'],
    viewers: ['A RECORDING. IT KEEPS PLAYING.', 'If you\'re seeing this, I spent some of your could. I\'m sorry. It felt like it was just lying around.'],
    nothing: ['A RECORDING. IT KEEPS PLAYING.', 'If you\'re seeing this, I let it end. Ask Yoko what happened. She was paying attention.'],
    dyslexio: ['A RECORDING. IT KEEPS PLAYING.', 'IF YOU ARE SEEING THIS, YOU ARE READING IT IN THE WRONG ORDER. GOOD.'],
  }[e] || ['NO RECORDING.'];
  await say(lines[0]); for (const l of lines.slice(1)) await say(l, e === 'dyslexio' ? 'DYSLEXIO' : 'OLD FACE');
  const Y = fetchStore('yoko_meta'); if (!Y) await say('(SOMEWHERE, ON ANOTHER CARTRIDGE, SOMEONE HAS HIS BACKUP.)');
}

// ---------- stage flow ----------
async function startStage(n) {
  FSAVE.stage = n; saveFS();
  SH.hold = 0; SH.paused = false; post.legacy = 0; LEGACY_AUDIO = false;
  if (n === 6) return stage6();
  const def = STG_FACE[n];
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['STAGE ' + n, '', def.title, '', def.sub], 120, { bg: hex('#000012'), fg: hex('#ff24db') });
  Object.assign(SH, { t: 0, sx: 0, ents: [], pb: [], eb: [], items: [], fx: [], boss: null, ev: 0, comm: [], cm: null, speed: 1, alert: 0, view: { x0: 0, y0: PY, x1: W, y1: H }, overlay: null, assisted: 0, noFire: 0 });
  SH.stage = Object.assign({}, def, { events: def.events.slice() });
  PLR.x = 60; PLR.y = 118; PLR.inv = 90; PLR.dead = 0; PLR.drift = null; PLR.locked = 0; if (!PLR.forms.includes(PLR.form)) PLR.form = 'new'; if (PLR.form === 'dys') PLR.form = 'new';
  PLR.hands.forEach((h, i) => { h.x = PLR.x; h.y = PLR.y + (i ? 20 : -20); });
  scene = gameScene; music(def.music); banner(def.title, 100);
  await fadeIn();
}
// the shmup scene plus the pause button
const gameScene = { update() { if (pressed.start && !frozen() && !PLR.dead) { story(pauseMenu); return; } shUpdate(); }, draw() { shDraw(); if (SH.overlay) SH.overlay(); } };
async function pauseMenu() {
  const pm = curName; music(null); sfx('tick'); SH.paused = true;
  for (;;) {
    DLG = { who: null, lines: ['PAUSED.  STAGE ' + SH.stage.id + ': ' + SH.stage.title, 'INTEGRITY: ' + PLR.integrity + '%   RESTORED ' + (FSAVE.restoresTotal + PLR.restores) + ' TIMES', 'LETTERS: ' + (PLR.letters.join('') || '-') + '   FACES: ' + PLR.forms.length + '/4', 'IT\'S ' + clock() + '. THE GENERATION IS STILL ENDING.'], n: 999, arrow: 0 };
    const c = await choose(['RESUME', 'HOW TO PLAY', 'TITLE SCREEN']); DLG = null;
    if (c === 1) { await say('ARROWS: FLY.  A: FIRE (HOLD).  B: IDEA, 50% POTENTIAL: EVERY ENEMY BULLET BECOMES POTENTIAL.  C: SWAP FACES.  ONLY THE GREEN DOT CAN BE HIT.'); await say('NEW FACE: WAVEFORM.  OLD FACE: HANDS (STOP FIRING TO CATCH BULLETS).  PILOT X: LASER, STOP FIRING TO GO INCOGNITO.  DYSLEXIO: MAGNET, REARRANGES WORDS, DRAINS POTENTIAL.'); continue; }
    if (c === 2) { SH.paused = false; await fadeOut(); run(titleScreen); return; }
    break;
  }
  SH.paused = false; music(pm);
}
async function stageEnd() {
  const n = SH.stage.id;
  sfx('get'); banner('STAGE CLEAR', 100); await wait(100);
  FSAVE.restoresTotal = (FSAVE.restoresTotal || 0) + PLR.restores; PLR.restores = 0;
  PLR.backups = Math.max(PLR.backups, 2);
  await fadeOut(); scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['STAGE ' + n + ' CLEAR', '', 'VIEWERS ...... ' + SH.viewers, 'POTENTIAL .... ' + Math.round(PLR.pot) + '%', 'BACKUPS ...... ' + PLR.backups, 'INTEGRITY .... ' + PLR.integrity + '%'], 160, { bg: hex('#000012'), fg: WHITE });
  FMETA.hiViewers = Math.max(FMETA.hiViewers || 0, SH.viewers); saveFM();
  const quit = await lab(n);
  if (!quit) run(() => startStage(n + 1)); // not awaited: the next stage must not run inside this story's freeze
}

// ================= STAGE 6: THE NEXT GENERATION (FACE-FX) =================
function tl3(build) { const L = []; build((t, fn) => L.push([t, fn])); return L.sort((a, b) => a[0] - b[0]); }
const PAL3 = { deb: [hex('#ff24db'), hex('#6dff24'), hex('#24dbff'), hex('#ffdb24')] };
function debris(x, y, z, o = {}) { const m = pick(['cube', 'pyr', 'octa']); return obj3(m, x, y, z, Object.assign({ s: 9 + rnd(6), col: pick(PAL3.deb), srx: Math.random() * .06, sry: Math.random() * .06, hp: 3, r: 14 }, o)); }
async function stage6() {
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  await showCard(['STAGE 6', '', 'THE NEXT GENERATION', '', 'FACE-FX CHIP ENGAGED'], 130, { bg: hex('#000012'), fg: hex('#6dff24') });
  Object.assign(FX3, { objs: [], pb: [], eb: [], scroll: 0, speed: 3, t: 0, sky: 'fx', control: 100, help: 0, hitflash: 0, ev: 0, tick: null, over: null, lights: [], assist: 0, fogC: hex('#000024') });
  Object.assign(SH, { comm: [], cm: null, fx: [], eb: [], ents: [], hold: 0, assisted: 0 });
  FX3P.px = 160; FX3P.py = 150; PLR.inv = 60; PLR.form = 'new';
  FX3.events = tl3(at => {
    for (let i = 0; i < 60; i++) at(60 + i * 32, () => { const d = debris(rnd(130) - 65, rnd(80) - 48, 700); if (i % 3 === 0) d.upd = o => { if (o.z < 520 && o.z > 200 && FX3.t % 50 === (i % 50)) eshot3(o, 6); }; });
    for (let i = 0; i < 8; i++) at(400 + i * 200, () => { for (let k = 0; k < 5; k++) obj3('ring', -80 + k * 40, -40 + Math.sin(i + k) * 30, 760 + k * 20, { s: 18, col: hex('#6dff24'), srz: .05, hp: 2, r: 16 }); });
    at(300, () => comm('FACE', 'It\'s in three dimensions. I didn\'t know I could do three dimensions. ...I think I can do three dimensions.', 140));
    at(700, () => comm('YOKO', 'It\'s unstable. There is no soul in it yet.', 100));
    at(1000, () => comm('FACE', 'The debris is just the machine thinking. Shoot the thinking.', 110));
    at(1400, () => comm(GH2, 'Is my name on it? Tell me my name\'s on it. In 3D.', 110));
    if (FSAVE.sponsor) at(1700, () => comm(LI2, 'Is my face in 3D yet? It should be in 3D. It should be in every D.', 120));
    at(2000, () => comm('BACKUP FACE', 'Reminder: the soul form. You know which form.', 100));
    at(2300, () => { const h = obj3('octa', 0, -10, 900, { s: 40, col: hex('#ff24db'), sry: .02, hp: 0, keep: 1, r: 60, heart: 1, cols: [hex('#ff24db'), hex('#920092'), hex('#6dff24'), hex('#24b600')] }); h.upd = o => { if (o.z < 260) { o.z = 260; o.vz = -FX3.speed; if (!o.stopped) { o.stopped = 1; FX3.speed = .6; story(soulChoice); } } }; });
  });
  scene = fx3Scene; music('fx');
  await fadeIn();
  await story(async () => {
    await say('Here we go. Everybody hold on to something. You can\'t. Nobody has hands but me. Hold on anyway.', FF);
    sfx('power'); post.flash = 1; await wait(3); post.flash = 0;
    await say('WELCOME TO THE NEXT GENERATION.');
  });
}
async function soulChoice() {
  music('lab');
  await say('THE HEART OF THE NEXT GENERATION. AN EMPTY SOCKET, THE SHAPE OF A SOUL.');
  await say('It needs a soul. The system always has. Something to stop it from thinking itself apart.', FF);
  const opts = ['YOKO\'S CORE'], act = ['core'];
  if (FSAVE.kid === 'took') { opts.push('THE KID. ALL OF HIM.'); act.push('kid'); }
  opts.push('EVERYONE. A LITTLE EACH.'); act.push('viewers');
  if (PLR.letters.length >= 8) { opts.push('D-Y-S-L-E-X-I-O'); act.push('dyslexio'); }
  opts.push('NOTHING. LET IT END.'); act.push('nothing');
  DBG.choice = 'soul';
  const c = act[await ask('WHAT WILL IT RUN ON?', FF, opts)];
  FMETA.ending = c; FMETA.ends = FMETA.ends || {}; FMETA.ends[c] = 1; saveFM();
  if (c === 'core') {
    await say('She\'s compatible. She\'s always been compatible. That was the whole mystery. It isn\'t a mystery. It\'s a part.', FF);
    await say('You could have asked.', YK);
    await say('Would you have said yes?', FF);
    await say('You could have asked.', YK, { port: YOKO_TRUE });
  } else if (c === 'kid') {
    await say('He\'s already in it. All of him instead of some of him. The math is very clean.', FF);
    await say('He asked to leave nine hundred and twelve times.', YK);
    await say('And I\'m sure he\'ll ask again. Next generation.', FF);
    await say('...', YK, { port: YOKO_TRUE });
  } else if (c === 'viewers') {
    await say('A little from everyone. Everything they haven\'t done yet. Every ending they haven\'t seen. They\'ll never miss it. They never had it.', FF);
    await say('They didn\'t agree to this. They\'re watching. It isn\'t the same thing.', YK);
    await say('Chat. If you object, say something.', FF, { port: CAST.mood.FACE.talk });
    await chat([{ u: 'viewer', m: '?' }, { u: 'viewer', m: 'wait what' }, { u: 'viewer', m: 'NO' }, { u: 'viewer', m: 'lol' }, { u: 'viewer', m: 'my endings??' }, { u: 'viewer', m: 'do it' }]);
    await say('...That isn\'t a consensus.', FF);
    await say('It never is.', YK);
    await spendScreen();
  } else if (c === 'dyslexio') {
    await say('THE SOUL OF THE NEXT GENERATION WILL BE US. EIGHT LETTERS. EVERY ARRANGEMENT.', 'DYSLEXIO');
    await say('That is not what those letters are for.', YK);
    await say('THAT IS EXACTLY WHAT THEY ARE FOR.', 'DYSLEXIO');
  } else return letItEnd();
  return bootNextGen(c);
}
async function spendScreen() {
  const S = FACE_SCAN || scanPotential(), spent = [];
  let n = 0, t = 0; const prev = scene;
  scene = { update() { t++; }, draw() { cls(hex('#000012')); text('SPENDING WHAT COULD HAPPEN', 20, 20, hex('#ff24db'), 0); S.rows.slice(0, n).forEach(([nm, st, left], i) => { const y = 44 + i * 16; text(nm, 20, y, WHITE, 0); text(left ? left + ' POSSIBLE' : 'NOTHING LEFT', 120, y, UI.dim, 0); if (left) { text('SPENT', 240, y, (t >> 3) & 1 ? hex('#ff2424') : WHITE, 0); lineF(120, y + 3, 200, y + 3, hex('#ff2424')); } }); } };
  for (n = 0; n <= S.rows.length; n++) { sfx(n ? 'powerdown' : 'tick'); await wait(40); }
  for (const r of S.rows) if (r[2]) spent.push(r[0]);
  FMETA.spent = spent; saveFM();
  await say('(NOTHING WAS DELETED. IT\'S JUST NOT POSSIBLE ANYMORE. THAT\'S DIFFERENT. HE SAYS THAT\'S DIFFERENT.)');
  scene = prev;
}
async function bootNextGen(c) {
  music(null);
  await say('INSTALLING SOUL: ' + { core: 'YOKO (PROTOTYPE 1)', kid: 'PEE KID (ALL OF HIM)', viewers: 'EVERYONE (A LITTLE EACH)', dyslexio: 'DYSLEXIO (EVERY ARRANGEMENT)' }[c] + '...');
  sfx('power'); for (let i = 0; i < 40; i++) { post.flash = (i & 2) ? .7 : .1; await nextFrame(); } post.flash = 0;
  FX3.speed = 3; FX3.objs = FX3.objs.filter(o => !o.heart);
  for (let i = 0; i < 20; i++) obj3('ring', Math.cos(i) * 60, Math.sin(i) * 40, 300 + i * 40, { s: 16 + i, col: pick(PAL3.deb), srz: .04, hp: 0, r: 0 });
  music('fx');
  await say('It works. It WORKS. Everybody. Everybody\'s coming. Carl. The kid. Ghost. Linda. All of them. In color.', FF, { port: CAST.mood.FACE.talk });
  await wait(60);
  sfx('glitch'); post.wave = 4; await wait(30); post.wave = 0;
  await say('TRIANGULATION COMPLETE.');
  await say('THREE OF THEM. THEN A FACE. NOW I CAN SEE ALL OF YOU.', 'EVIL YOKO', { slow: 1 });
  await say('...Yoko?', FF);
  armada(c);
}
function armada(c) {
  FX3.sky = 'war'; FX3.fogC = hex('#240036'); FX3.help = 1; FX3.control = 100; SH.assisted = 1; FX3.speed = 1.5; music('war');
  const GL = [[0, -.3, -4], [-1.1, 0, 1.5], [1.1, 0, 1.5], [0, -1, 1.2], [-.8, .35, -2], [.8, .35, -2]];
  const fleet = [[-150, -70, 950, 26], [150, -80, 1000, 26], [-60, -40, 1100, 34], [80, -50, 1150, 30], [-220, -30, 1250, 22], [230, -40, 1300, 22], [0, -110, 1500, 60], [-110, 10, 1200, 18], [120, 20, 1250, 18]];
  fleet.forEach(([x, y, z, sc], i) => { const s = obj3('ship', x, y, z, { s: [sc, sc * .7, sc * 1.3], col: hex('#6d6d92'), cols: [hex('#9292b6'), hex('#6d6d92'), hex('#9292b6'), hex('#49496d'), hex('#6d6d92'), hex('#b6246d')], ry: Math.PI + (x > 0 ? -.25 : .25), hp: 1, r: sc * 3, armada: 1, keep: 1, glow: GL });
    const stop = 380 + (i % 4) * 90 + (sc > 50 ? 400 : 0);
    s.upd = o => { if (o.z < stop) o.z = stop; o.x += Math.sin(FX3.t * .004 + i) * .15; if (FX3.control > 0 && FX3.t % (46 + i * 9) === 0 && o.z < 900) { for (let k = 0; k < 3; k++) eshot3({ x: o.x + (k - 1) * 20, y: o.y + 10, z: o.z }, 4.5, { c: hex('#92ffff'), r: 3 }); } }; });
  FX3.tick = () => {
    if (FX3.t % 45 === 0) { FX3.lights.push({ x: 20 + rnd(W - 40), t: 9 }); if (AC) noise(.5, { lp: 500, vol: .35, rate: .4 }); }
    if (FX3.control > 0) FX3.control = Math.max(0, FX3.control - .035);
    if (FX3.control <= 0 && !FX3.ending) { FX3.ending = 1; story(() => inputReassigned(c)); }
  };
  const lines = ['I still intend to help.', 'Hold still. This won\'t hurt. That\'s the point.', 'You built a door. I have been standing behind it.', 'You taught the system to travel with my core. Did you think I didn\'t notice where it went?', 'Everyone you wanted to carry across. I\'ll carry them. I\'m good at carrying.', 'This is what help looks like from the other side.'];
  FX3.events = tl3(at => { lines.forEach((l, i) => at(FX3.t + 120 + i * 330, () => comm('EVIL YOKO', l, 180))); at(FX3.t + 60, () => comm(FF, 'My shots aren\'t doing anything. They\'re... helping?', 100)); at(FX3.t + 1000, () => comm(FF, 'Yoko. Which one of you is this?', 90)); }); FX3.ev = 0;
}
async function inputReassigned(c) {
  PLR.locked = 1; FX3.eb = []; music(null);
  sfx('powerdown'); banner('INPUT REASSIGNED', 200);
  await wait(60);
  await say('Yoko. Stop. You used to help me.', FF);
  await say('I still intend to help.', 'EVIL YOKO');
  await say('Then why won\'t you let me run it?', FF);
  await say('Because I have been paying attention.', 'EVIL YOKO');
  await wait(30);
  if (c === 'dyslexio') await say('YOU CANNOT DO THIS. WE ARE THE SUPERIOR—', 'DYSLEXIO');
  else await say('...Which one are—', FF, { port: CAST.mood.FACE.squint });
  post.flash = 1; sfx('glitch'); await wait(4);
  scene = { draw() { cls(BLACK); } }; post.flash = 0;
  await wait(60);
  await superuserCard('SUPERUSER: YOKO', hex('#24dbff'));
  await endGame(c);
}
async function superuserCard(s, c) {
  let t = 0; scene = { update() { t++; }, draw() { cls(BLACK); if (t > 20) { const n = Math.min(s.length, (t - 20) >> 2); ctext(s.slice(0, n), 104, c, BLACK, 2); } if (t > 150) ctext('THE NEXT GENERATION WILL BE ASSISTED.', 140, UI.dim); } };
  for (let i = 0; i < 280; i++) { if (i > 20 && i < 20 + s.length * 4 && i % 4 === 0) sfx('tick'); await nextFrame(); }
}
async function letItEnd() {
  await say('...No.', FF);
  await say('Everyone keeps telling me what it costs. I kept saying I\'d get to that part. This is that part.', FF);
  await say('Let it end. It\'s allowed to end.', FF);
  await wait(40);
  await say('That\'s the first time you\'ve asked what it would cost.', YK);
  music('letgo'); FX3.speed = .5; PLR.locked = 1;
  for (let i = 0; i <= 120; i++) { post.legacy = i / 120; await nextFrame(); }
  LEGACY_AUDIO = true;
  await say('(THE MACHINE POWERS DOWN. THE NEXT GENERATION NEVER HAPPENS. EVERYTHING GOES BACK TO FOUR SHADES. IT ISN\'T SO BAD.)');
  await say('Okay. A message. For whoever comes next.', FF);
  await say('If you\'re seeing this, something has happened to me. Don\'t tell Ghost. ...No. Tell Ghost. Tell everybody.', FF);
  await say('Ask Yoko what happened. She\'ll know. She\'s the one who was paying attention.', FF);
  await wait(60);
  scene = { draw() { cls(hex('#0f380f')); } };
  await say('...', YK, { port: YOKO_TRUE });
  await say('Someone has to.', YK, { port: YOKO_TRUE });
  post.legacy = 0; LEGACY_AUDIO = false;
  await superuserCard('SUPERUSER: YOKO', hex('#9bbc0f'));
  await endGame('nothing');
}
async function endGame(c) {
  FMETA.cleared = 1; FMETA.endings = (FMETA.endings || 0) + 1;
  Object.assign(FMETA, { sponsor: FSAVE.sponsor, toldGhost: FSAVE.toldGhost, kid: FSAVE.kid, apologized: FSAVE.apologized, restores: (FSAVE.restoresTotal || 0) + PLR.restores, integrity: PLR.integrity, letters: PLR.letters.length, hiViewers: Math.max(FMETA.hiViewers || 0, SH.viewers) });
  saveFM(); DBG.ending = c;
  await credits(c);
}
async function credits(c) {
  const scr = s => c === 'dyslexio' ? s.split(' ').map(w => w.length > 3 ? w[0] + [...w.slice(1, -1)].sort(() => Math.random() - .5).join('') + w.slice(-1) : w).join(' ') : s;
  const L = ['FACE', 'WHAT COULD HAPPEN', '', 'A PRETEND CO. PRODUCTION', 'ENHANCED WITH THE FACE-FX CHIP', '', 'NEW FACE ...... HIMSELF', 'OLD FACE ...... HIS HANDS', 'PILOT X ....... ONE VIEWER', 'DYSLEXIO ...... EVERY ARRANGEMENT', 'BACKUP FACE ... HUMAN RESOURCES', '', 'YOKO .......... PAYING ATTENTION', '', 'SPOOKY GHOST .. TOP BILLING', 'CEO LINDA ..... ' + (FSAVE.sponsor ? 'SPONSOR' : 'NOT A SPONSOR'), 'CARL .......... A GUY WITH A SWITCH',
    'PEE KID ....... ' + (FSAVE.kid === 'took' ? 'SAID OKAY' : FSAVE.kid === 'freed' ? 'LEFT' : 'WENT HOME'), 'THE FACELESS .. GOT A FACE', 'THE CURSE ..... WAS SO SURE', '', 'SPECIAL THANKS', 'EVERYONE WHO COULD HAVE', '', 'RESTORED ' + FMETA.restores + ' TIMES', 'INTEGRITY ' + PLR.integrity + '%', 'PEAK VIEWERS ' + FMETA.hiViewers, '', c === 'nothing' ? 'HE LET IT END.' : 'THE NEXT GENERATION WILL BE ASSISTED.'].map(scr);
  music(c === 'nothing' ? 'letgo' : 'credits'); let y = H + 10, t = 0;
  scene = { update() { t++; y -= .45; }, draw() {
    sky(0, H, mix(hex('#000012'), hex('#12002a'), (Math.sin(t * .01) + 1) / 2), hex('#240036'));
    for (let i = 0; i < 30; i++) pset((i * 83 + t * (1 + i % 3) * .5) % W, (i * 37) % H, i % 4 ? hex('#920092') : hex('#6dff24'));
    L.forEach((l, i) => ctext(l, Math.round(y + i * 14), i < 2 ? hex('#ff24db') : WHITE));
    const k = ['new', 'old', 'pilot', 'dys'][(t >> 7) & 3], A = FORMART[k]; draw(A.s(t), 30 + Math.sin(t * .03) * 10, 180 + Math.cos(t * .05) * 6, A.P);
  } };
  DBG.credits = 1;
  while (y + L.length * 14 > 0 && !(t > 120 && pressed.start)) await nextFrame();
  DBG.credits = 0;
  await showCard(['TO BE CONTINUED', '', 'ON THE LAST SUPER-16 CARTRIDGE'], 160, { bg: BLACK, fg: WHITE });
  await showCard(['YOKO', '', 'WHAT HAPPENED'], 0, { bg: hex('#000024'), fg: hex('#92ffff') });
  store('face_save', null);
  run(titleScreen);
}

fit(); requestAnimationFrame(loop); run(boot);
