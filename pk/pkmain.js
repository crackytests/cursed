'use strict';
// ================= PEE KID³ -- boot, title, flow, save, music =================
const PKM = fetchStore('pk_meta') || {};
const savePKM = () => store('pk_meta', PKM);
function savePK() { store('pk_save', { photos: SAVE.photos, stage: SAVE.stage, hallpass: SAVE.hallpass, firstFlush: SAVE.firstFlush, taka: SAVE.taka, unlocked: PL.unlocked }); }
PERMA = !!PKM.letgo && !PKM.upgraded;

// ---------- music (FM) ----------
Object.assign(TRACKS, {
  title: { bpm: 112, ch: [
    { ins: 'brass', n: 'C5 - - G4 - - C5 - D#5 - - D5 - C5 - A#4 - C5 - - - G4 - - - - - - - - - - -' },
    { ins: 'bass', n: 'C3 . C3 . C3 . C4 . G#2 . G#2 . G#2 . G#3 . A#2 . A#2 . A#2 . A#3 . G2 . G2 . B2 . D3 .' },
    { ins: 'pad', n: 'D#4 - - - - - - - C4 - - - - - - - D4 - - - - - - - D4 - - - - - - -' },
    { drum: 1, n: 'x . h . s . h h k . h . s . h o k . h . s . h h k k h . s . s s' }] },
  lab: { bpm: 124, ch: [
    { ins: 'slap', n: 'A2 . A3 . A2 A2 G3 . A2 . A3 . C3 . D3 E3' },
    { ins: 'epiano', n: 'E5 . . C5 . . A4 . B4 . C5 . D5 - - - E5 . . C5 . . A4 . G4 . A4 . B4 - - -' },
    { drum: 1, n: 'k . h . s . h . k k h . s . h h' }] },
  bus: { bpm: 140, ch: [
    { ins: 'bass', n: 'F2 . F3 . C3 . F3 . D#2 . D#3 . A#2 . D#3 .' },
    { ins: 'lead', n: 'C5 - A4 - F4 - A4 C5 D#5 - D5 - C5 - A#4 - C5 - A4 - F4 - G4 A4 A#4 - A4 - G4 - F4 -' },
    { ins: 'organ', det: 7, n: 'A4 - - - C5 - - - G4 - - - A#4 - - -' },
    { drum: 1, n: 'k . h h s . h . k . h k s . h o' }] },
  school: { bpm: 132, ch: [
    { ins: 'pluck', n: 'C4 E4 G4 E4 C4 E4 G4 E4 D4 F4 A4 F4 B3 D4 G4 D4' },
    { ins: 'bell', n: 'E5 - - D5 C5 - - - D5 - - E5 F5 - - - G5 - - E5 C5 - - - D5 - - C5 B4 - - -' },
    { ins: 'bass', n: 'C3 . . . G2 . . . F2 . . . G2 . . .' },
    { drum: 1, n: 'k . h . s . h . k . h . s h s s' }] },
  city: { bpm: 96, ch: [
    { ins: 'bass', n: 'E2 . . E2 . . G2 . A2 . . A2 . . B2 G2' },
    { ins: 'epiano', n: 'G4 - B4 - D5 - - - F#4 - A4 - C#5 - - - E4 - G4 - B4 - - - D#4 - F#4 - B4 - - -' },
    { ins: 'lead', det: -8, n: 'B5 - - - - - A5 - G5 - - - F#5 - - - E5 - - - - - - - - - - - - - - -' },
    { drum: 1, vol: .7, n: 'k . h . s . h k . k h . s . h o' }] },
  core: { bpm: 150, ch: [
    { ins: 'slap', n: 'D2 D3 D2 D3 D2 D3 F2 F3 G2 G3 G2 G3 A#2 A#3 A2 A3' },
    { ins: 'brass', n: 'D5 - - A4 - - D5 - F5 - E5 - D5 - C5 - A#4 - - F4 - - A#4 - A4 - - - - - - -' },
    { ins: 'pad', n: 'D4 - - - - - - - A#3 - - - A3 - - -' },
    { drum: 1, n: 'k h s h k k s h k h s h k k s x' }] },
  tense: { bpm: 88, ch: [
    { ins: 'bass', n: 'C2 . . . C#2 . . . C2 . . . B1 . . .' },
    { ins: 'bell', n: 'G5 . . . . . F#5 . . . . . . . . . G5 . . . . . C#6 . . . . . . . . .' },
    { drum: 1, vol: .6, n: 'k . . . h . . . k . k . h . . .' }] },
  standup: { bpm: 160, ch: [
    { ins: 'bass', n: 'C3 . E3 . G3 . A3 . A#3 . A3 . G3 . E3 .' },
    { ins: 'organ', n: 'E4 G4 C5 . E4 G4 C5 . F4 A4 C5 . F4 A4 C5 .' },
    { drum: 1, n: 'k . s h k . s h k . s h k s s s' }] },
  credits: { bpm: 104, ch: [
    { ins: 'epiano', n: 'C5 - E5 - G5 - E5 - F5 - A5 - C6 - A5 - E5 - G5 - B5 - G5 - D5 - F5 - A5 - - -' },
    { ins: 'bass', n: 'C3 . . . F2 . . . E2 . . . D2 . G2 .' },
    { ins: 'pad', n: 'E4 - - - - - - - C4 - - - - - - - B3 - - - - - - - D4 - - - B3 - - -' },
    { drum: 1, vol: .7, n: 'k . h . s . h . k . h k s . h o' }] },
  chase: { bpm: 168, ch: [
    { ins: 'slap', n: 'E2 E3 E2 E3 G2 G3 E2 E3 A2 A3 A2 A3 B2 B3 D3 D#3' },
    { ins: 'lead', n: 'E5 - - B4 - - E5 - G5 - F#5 - E5 - D#5 - E5 - - B4 - - G4 - A4 - B4 - C5 - B4 -' },
    { ins: 'organ', det: 6, n: 'B4 - - - B4 - - - C5 - - - D#5 - - -' },
    { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  roof: { bpm: 136, ch: [
    { ins: 'bass', n: 'D2 . D3 . A2 . D3 . C2 . C3 . G2 . C3 .' },
    { ins: 'brass', n: 'F#5 - - E5 D5 - A4 - B4 - C5 - D5 - - - E5 - - D5 C5 - G4 - A4 - B4 - C5 - - -' },
    { ins: 'pluck', n: 'A4 D5 F#5 D5 A4 D5 F#5 D5 G4 C5 E5 C5 G4 C5 E5 C5' },
    { drum: 1, n: 'k . h h s . h . k k h . s . h o' }] },
  gym: { bpm: 150, ch: [
    { ins: 'bass', n: 'G2 . G2 A#2 . C3 . C#3 D3 . . . F2 . G2 .' },
    { ins: 'lead', n: 'D5 - D5 - C5 A#4 - G4 - - - F4 G4 - - - A#4 - A#4 - C5 D5 - F5 - D5 - C5 D5 - - -' },
    { drum: 1, n: 'k . s . k k s . k . s . k s s s' }] },
  night: { bpm: 84, ch: [
    { ins: 'bass', n: 'A1 . . . . . A1 . C2 . . . D2 . E2 .' },
    { ins: 'epiano', n: 'E5 - - - D5 - C5 - B4 - - - A4 - - - C5 - - - B4 - G4 - A4 - - - - - - -' },
    { ins: 'pad', det: -6, n: 'A3 - - - - - - - F3 - - - G3 - - -' },
    { drum: 1, vol: .6, n: 'k . . h s . . h k . k h s . h .' }] },
  show: { bpm: 128, ch: [
    { ins: 'slap', n: 'C3 . C3 C4 . C3 A#2 . A2 . A2 A3 . A2 G2 .' },
    { ins: 'brass', n: 'G5 - E5 - C5 - E5 G5 A5 - F5 - C5 - F5 A5 G5 - E5 - C5 - D5 E5 F5 - D5 - B4 - - -' },
    { ins: 'organ', n: 'E4 G4 C5 G4 E4 G4 C5 G4 F4 A4 C5 A4 F4 A4 C5 A4' },
    { drum: 1, n: 'x . h . s . h h k . h . s . s x' }] },
  legacy: { bpm: 90, ch: [
    { ins: 'lead', n: 'E4 - - - G4 - - - D4 - - - C4 - - - E4 - - - G4 - - - A4 - - - G4 - - -' },
    { ins: 'bass', n: 'C3 . . . C3 . . . G2 . . . A2 . . .' }] },
});

// ---------- flow ----------
async function startStage(n) {
  SAVE.stage = n; savePK();
  const st = STAGES[n];
  await fadeOut();
  await showCard(['STAGE ' + secName(n), '', st.title], 110, st.forceLegacy ? { bg: hex('#0f380f'), fg: hex('#9bbc0f') } : { bg: hex('#081030'), fg: UI.name });
  loadLevel(st); camX = 0; PL.pot = n === 1 ? 50 : Math.max(PL.pot, 40); PL.dig = SAVE.hard ? 1 : 3;
  const w = world(n);
  if (w >= 3 && !PL.unlocked.includes('wee')) PL.unlocked.push('wee');
  if (w >= 4 && !PL.unlocked.includes('boy')) PL.unlocked.push('boy');
  if (!PL.unlocked.includes(PL.asp)) PL.asp = 'kid';
  respawn(); PL.hurt = 0;
  SUS = n === 4 ? { x: 70 * TS, y: 12 * TS - 44, caught: false, anim: 0 } : null;
  scene = platScene; music(PERMA ? 'legacy' : st.music); banner(st.title, 120);
  await fadeIn();
  if (!SAVE['intro' + n]) { SAVE['intro' + n] = 1; await st.intro(); }
}
async function stageClear() {
  const next = ORDER[ORDER.indexOf(STG.id) + 1];
  sfx('get'); banner(!next || world(next) !== world(STG.id) ? 'STAGE CLEAR' : 'SECTION CLEAR', 90); await wait(90);
  if (next) { SAVE.stage = next; savePK(); run(() => startStage(next)); }
}
async function pauseMenu() {
  music(null); sfx('tick');
  for (;;) {
    DLG = { who: null, lines: ['PAUSED.  STAGE ' + secName(STG.id) + ': ' + STG.title, 'PHOTOS: ' + SAVE.photos.length + '/' + PHOTOS.length + '   POTENTIAL: ' + Math.round(PL.pot) + '%', 'THE CLOCK SAYS ' + clock() + '. IT\'S LATE. HE SHOULD BE IN BED.'], n: 999, arrow: 0 };
    const c = await choose(['RESUME', 'PHOTO ALBUM', 'HOW TO PLAY', 'TITLE SCREEN']); DLG = null;
    if (c === 1) {
      if (!SAVE.photos.length) await say('THE ALBUM IS EMPTY. THE PHOTOS ARE HIDDEN ACROSS THE STAGES.');
      else for (let i = 0; i < SAVE.photos.length; i++) await say('PHOTO ' + (i + 1) + ': ' + photoText(SAVE.photos[i]));
      if (SAVE.photos.length >= PHOTOS.length) await say('THAT\'S ALL OF THEM. HE REMEMBERS ALL OF IT NOW. HE WISHES HE REMEMBERED THE DOG\'S NAME.');
      continue;
    }
    if (c === 2) { await say('ARROWS: MOVE   B: JUMP   A: ' + A().verb + '   C: SWAP   UP: DOORS/TALK. TO LET POTENTIAL OUT, STAND AT A DOOR MARKED WC AND PRESS UP. BATHROOMS ALSO CHECKPOINT AND SAVE. LOW POTENTIAL = LEGACY MODE: GREEN, SAFE, OLD PLATFORMS. HIGH = POWER DOORS OPEN. 100 = ACCIDENT.'); continue; }
    if (c === 3) { if (legacyNow && Math.random() < .5) await say('Oh. Hi. You pressed pause. Nobody pauses on me.', 'TP'); music(null); post.legacy = 0; LEGACY_AUDIO = false; return run(titleScreen); }
    break;
  }
  music(PERMA ? 'legacy' : STG.music);
}
async function keyboard2(prompt) {
  const ROWS = ['ABCDEFGHIJ', 'KLMNOPQRST', 'UVWXYZ .!?', '0123456789'], prev = scene; let cx = 0, cy = 0, s = '', done = false;
  DBG.mode = 'kbd';
  scene = { update() {
    if (pressed.left) cx = (cx + 9) % 10; if (pressed.right) cx = (cx + 1) % 10; if (pressed.up) cy = (cy + 4) % 5; if (pressed.down) cy = (cy + 1) % 5;
    if (pressed.left || pressed.right || pressed.up || pressed.down) sfx('move');
    if (pressed.a || pressed.b) { if (cy === 4) { if (cx < 5) s = s.slice(0, -1); else if (s.trim()) done = true; } else if (s.length < 40) s += ROWS[cy][cx]; sfx('tick'); }
    if (pressed.c) s = s.slice(0, -1);
    if (pressed.start && s.trim()) done = true;
    DBG.kx = cx; DBG.ky = cy; DBG.ks = s;
  }, draw() {
    sky(0, H, hex('#101040'), hex('#402060')); panel(10, 10, 300, 204);
    draw(PORT.TAKAHASHI.s, 20, 20, PORT.TAKAHASHI.P);
    wrapT(prompt, 36).forEach((l, i) => text(l, 76, 22 + i * 10, UI.text));
    rectF(20, 76, 280, 14, BLACK); text(s + ((frame >> 4) & 1 ? '_' : ''), 24, 80, UI.name);
    ROWS.forEach((r, j) => [...r].forEach((ch, i) => { const on = i === cx && j === cy; if (on) rectF(36 + i * 26, 100 + j * 20, 20, 16, UI.box2); text(ch === ' ' ? '_' : ch, 43 + i * 26, 104 + j * 20, on ? UI.name : UI.text); }));
    text('DEL', 40, 186, cy === 4 && cx < 5 ? UI.name : UI.text); text('END', 200, 186, cy === 4 && cx >= 5 ? UI.name : UI.text);
    if (cy === 4) text('>', cx < 5 ? 32 : 192, 186, UI.name);
  } };
  while (!done) await nextFrame();
  scene = prev; DBG.mode = null; return s.trim();
}
async function credits(letGo) {
  music(letGo ? 'legacy' : 'credits'); if (letGo) { post.legacy = 1; LEGACY_AUDIO = true; }
  const L = ['PEE KID³', 'THIRD TIME\'S THE CHARM', '', 'A PRETEND CO. PRODUCTION', '', 'PEE KID ....... HIMSELF', 'PEE-WEE KID ... HIMSELF', 'PEE BOY ....... HIMSELF', '', 'THE THIRD GENERATOR', 'FACE AND SPOOKY GHOST', '', 'SPECIAL THANKS', 'CARL, LINDA, TP', '(STILL IN FOUR SHADES)', '', 'SUPER-16 FM SOUND DRIVER', 'PRETEND CO. SOUND LAB', '', 'NO KIDS WERE HELD', 'IN THE MAKING OF THIS GAME', '(ONE WAS.)', '', ...(SAVE.hard ? ['HOLD IT MODE: CLEARED', '(HE HELD IT.)', ''] : []), letGo ? 'HE WENT HOME.' : 'SEE YOU NEXT GENERATION.'];
  let y = H + 10, t = 0; const prev = scene;
  scene = { update() { t++; y -= .45; }, draw() {
    if (letGo) cls(hex('#9bbc0f')); else { sky(0, H, mix(hex('#200840'), hex('#082040'), (Math.sin(t * .01) + 1) / 2), hex('#401040')); for (let i = 0; i < 40; i++) pset((i * 83 + t * (1 + i % 3)) % W, (i * 37) % H, WHITE); }
    L.forEach((l, i) => ctext(l, Math.round(y + i * 14), i < 2 ? UI.name : WHITE));
    if (!letGo) { draw(KID.kid.run[(t >> 3) & 3], 40, 190, KIDPAL.kid); draw(KID.wee.run[(t >> 3) & 3], 70, 190, KIDPAL.wee); draw(KID.boy.run[(t >> 3) & 3], 100, 182, KIDPAL.boy); }
    else draw(LEGACY.carl, 150, 190, LEGPAL);
  } };
  DBG.credits = 1; PKM.cleared = 1; if (SAVE.hard) PKM.hardClear = 1; savePKM();
  while (y + L.length * 14 > 0 && !(t > 120 && pressed.start)) await nextFrame();
  await showCard(letGo ? ['THE END.', '', 'OKAY. CAN I GO HOME NOW?'] : ['THE END?', '', 'POTENTIAL: 100%'], 0, { bg: letGo ? hex('#0f380f') : BLACK, fg: letGo ? hex('#9bbc0f') : UI.name });
  await nextCartridge(letGo);
  DBG.credits = 0; scene = prev; post.legacy = 0; LEGACY_AUDIO = false;
  store('pk_save', null); for (const k in SAVE) delete SAVE[k]; SAVE.photos = []; SAVE.stage = 1;
  PERMA = !!PKM.letgo && !PKM.upgraded;
  run(titleScreen);
}

// the old advertisement after the credits: the next cartridge on this hardware
async function nextCartridge(letGo) {
  let t = 0; const prev = scene;
  scene = { update() { t++; }, draw() {
    cls(BLACK); if (letGo) { ctext('SOMEWHERE, A BACKUP IS LISTENING.', 100, hex('#9bbc0f')); if (t > 120 && (t >> 4) & 1) { pset(156, 130, hex('#24dbff')); pset(164, 130, hex('#24dbff')); } return; }
    ctext('COMING SOON ON SUPER-16', 30, UI.dim);
    const k = Math.min(1, t / 60); for (let i = 0; i < 40; i++) { const x = 160 + Math.cos(i * .4 + t * .02) * 70 * k, y = 104 + Math.sin(i * .4 + t * .02) * 40 * k; pset(x, y, i & 1 ? hex('#ff24db') : hex('#6dff24')); }
    if (t > 40) { text('FACE', 112, 84, hex('#6dff24'), 0, 4); text('FACE', 110, 82, hex('#ff24db'), BLACK, 4); }
    if (t > 80) ctext('WHAT COULD HAPPEN', 124, WHITE);
    if (t > 120) ctext('"NOBODY GETS LEFT BEHIND THIS TIME."', 150, UI.name);
    if (t > 160) ctext('WITH THE FACE-FX CHIP', 176, UI.dim);
  } };
  for (; t < 240 && !(t > 60 && pressed.start); ) await nextFrame();
  scene = prev;
}

// ---------- boot: chrome logo, digitized shout ----------
async function boot() {
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(BLACK);
    const sc = 3, s = 'PRETEND CO.', w = s.length * 6 * sc, x0 = (W - w) / 2, y0 = 90, sweep = (t * 5) % (w + 120) - 60;
    for (let i = 0; i < s.length; i++) {
      const gx = x0 + i * 6 * sc, g = FONT[s[i]]; if (!g) continue;
      for (let j = 0; j < 7; j++) for (let k = 0; k < 5; k++) if (g[j] & (16 >> k)) {
        const px = gx + k * sc, shine = Math.abs(px - x0 - sweep) < 10;
        rectF(px + 2, y0 + j * sc + 2 - Math.max(0, 40 - t), sc, sc, hex('#102050'));
        rectF(px, y0 + j * sc - Math.max(0, 40 - t), sc, sc, shine ? WHITE : mix(hex('#e0e8ff'), hex('#4060c0'), j / 7));
      }
    }
    if (t > 50) ctext('SUPER-16', 124, hex('#80a0e0'));
    if (t > 70) ctext('LICENSED BY NOBODY', 200, hex('#404880'));
    if (t > 60 && !anyKey && (t >> 5) & 1) ctext('PRESS ANY BUTTON', 150, UI.dim);
  } };
  while (!anyKey) await nextFrame();
  t = 0; await nextFrame();
  if (AC) { [262, 330, 392, 523].forEach(f => note(f, 1.4, 'brass', AC.currentTime, sfxBus)); note(1047, 1.4, 'bell', AC.currentTime + .1, sfxBus); }
  speak('Pretend co!', { pitch: .8, rate: .9 });
  await wait(110);
  await fadeOut(); await legacyImport(); await titleScreen();
}
// the old save data, found on the "cartridge"
async function legacyImport() {
  const M = [['CARL', fetchStore('carl_meta')], ['LINDA', fetchStore('linda_meta')], ['SPOOKY GHOST', fetchStore('ghost_meta')], ['TP', fetchStore('tp_mem')]].filter(m => m[1]);
  if (PKM.imported && !M.length) return;
  const lines = ['SUPER-16 LEGACY DATA TRANSFER', '', 'SCANNING OLD CARTRIDGES...', ''];
  if (!M.length) lines.push('NO LEGACY DATA FOUND.', '', 'THAT\'S OKAY.', 'THEY FOUND YOU ANYWAY.');
  else { for (const [n] of M) lines.push(n + ' .......... FOUND'); lines.push('', 'THEY REMEMBER YOU.', 'THEY CAN\'T COME WITH YOU.', '(THEY\'RE STILL IN FOUR SHADES.)'); }
  await fadeIn(.2);
  await showCard(lines, 0, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
  PKM.imported = M.map(m => m[0]); savePKM();
  await fadeOut(.2);
}
async function titleScreen() {
  const sv = fetchStore('pk_save');
  let t = 0;
  scene = { update() { t++; }, draw() {
    sky(0, H, PERMA ? hex('#0f380f') : hex('#100838'), PERMA ? hex('#306230') : hex('#e03870'));
    if (!PERMA) for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28 + t * .005; for (let r = 30; r < 300; r += 3) pset(160 + Math.cos(a) * r, 70 + Math.sin(a) * r * .6, mix(hex('#f8e040'), hex('#e03870'), r / 300)); }
    const bob = Math.round(Math.sin(t * .05) * 3);
    text('PEE KID', 70, 30 + bob, UI.name, hex('#401020'), 4);
    text('³', 240, 18 + bob, WHITE, hex('#401020'), 5);
    ctext('THIRD TIME\'S THE CHARM', 68, WHITE);
    drawScaled(KID.kid.stand, 110, 100, KIDPAL.kid, 2); drawScaled(KID.wee.stand, 146, 96, KIDPAL.wee, 2); drawScaled(KID.boy.stand, 182, 80, KIDPAL.boy, 2);
    if (PKM.letgo) draw(LEGACY.carl, 20, 190, LEGPAL);
    if (PKM.dog) { const dx = 280, dy = 196 + ((t >> 4) & 1); rectF(dx, dy, 14, 7, hex('#c08040')); rectF(dx + 12, dy - 5, 7, 7, hex('#c08040')); rectF(dx + 17, dy - 3, 3, 2, BLACK); rectF(dx + 14, dy - 4, 1, 1, BLACK); rectF(dx + 11, dy - 7, 3, 4, hex('#805020')); rectF(dx, dy + 7, 2, 4, hex('#c08040')); rectF(dx + 11, dy + 7, 2, 4, hex('#c08040')); rectF(dx - 3, dy - 2 + ((t >> 3) & 1), 3, 2, hex('#c08040')); }
    if (PKM.hardClear) text('HELD IT', 8, 8, hex('#f8e040'), BLACK);
    ctext('(C) PRETEND CO.  SUPER-16', 212, hex('#c0a0d0'), BLACK);
  } };
  music(PERMA ? 'legacy' : 'title'); post.legacy = PERMA ? 1 : 0; LEGACY_AUDIO = PERMA;
  await fadeIn();
  const opts = [], act = [];
  if (sv && sv.stage && STAGES[sv.stage]) { opts.push('CONTINUE (STAGE ' + secName(sv.stage) + ')'); act.push('cont'); }
  opts.push('NEW GAME'); act.push('new');
  if (PKM.cleared) { opts.push('STAGE SELECT'); act.push('select'); opts.push('TIME ATTACK'); act.push('ta'); opts.push('HOLD IT MODE'); act.push('hard'); }
  if (PKM.allPhotos) { opts.push(PKM.dog ? 'BISCUIT' : '???'); act.push('secret'); }
  if (PKM.letgo) { opts.push(PERMA ? 'TURN THE COLORS BACK ON' : 'LEAVE HIM ALONE'); act.push('perma'); }
  const c = await choose(opts, { x: 100, y: Math.min(176 - (opts.length - 1) * 6, H - opts.length * 12 - 16) });
  if (act[c] === 'ta') return timeAttackMenu();
  if (act[c] === 'perma') {
    PKM.upgraded = PERMA ? 1 : 0; savePKM(); PERMA = !PERMA;
    if (PERMA) await say('Thank you.', 'PEE KID'); else await say('...Okay. I understand. Everybody needs the graphics.', 'PEE KID');
    return titleScreen();
  }
  let pickN = null;
  if (act[c] === 'select') {
    const i = await choose(ORDER.map(n => secName(n) + ' ' + STAGES[n].title), { x: 60, y: 30, cancel: 1 });
    if (i < 0) return titleScreen();
    pickN = ORDER[i];
  }
  if (act[c] === 'secret') pickN = 99;
  for (const k in SAVE) delete SAVE[k]; SAVE.photos = []; SAVE.stage = 1; PL.unlocked = ['kid']; PL.asp = 'kid';
  if (act[c] === 'hard') { SAVE.hard = 1; await say('HOLD IT MODE. POTENTIAL RISES TWICE AS FAST. ONE HEART. AN ACCIDENT SENDS YOU BACK TO THE LAST BATHROOM.'); }
  if (pickN) { for (const n of ORDER.slice(0, ORDER.indexOf(pickN))) SAVE['intro' + n] = 1; SAVE.hallpass = pickN !== 3 && world(pickN) >= 3 ? 1 : 0; PL.unlocked = ['kid', 'wee', 'boy'].slice(0, Math.max(1, Math.min(3, world(pickN) - 1))); if (pickN === 99) PL.unlocked = ['kid', 'wee', 'boy']; return startStage(pickN); }
  if (act[c] === 'cont') { Object.assign(SAVE, sv); SAVE.photos = sv.photos || []; PL.unlocked = sv.unlocked || ['kid']; for (const n of ORDER.slice(0, ORDER.indexOf(sv.stage) + 1)) SAVE['intro' + n] = 1; }
  await startStage(SAVE.stage);
}

fit(); requestAnimationFrame(loop); run(boot);
