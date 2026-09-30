'use strict';
// ================= YOKO: WHAT HAPPENED — boot, the record, title, flow, endings, credits, music =================
const YMETA = fetchStore('yoko_meta') || {};
const saveYM = () => store('yoko_meta', YMETA);
const REC = { face: fetchStore('face_meta'), pk: fetchStore('pk_meta'), carl: fetchStore('carl_meta'), linda: fetchStore('linda_meta'), ghost: fetchStore('ghost_meta'), tp: fetchStore('tp_mem') };
function saveY() {}
function checkpoint(ch) { store('yoko_save', { ch, flags: ADV.flags, party: PARTY, rec: YREC, can: YOKO_CAN }); }

// ---------- music (FM). quieter than his. ----------
Object.assign(TRACKS, {
  ytitle: { bpm: 80, ch: [
    { ins: 'bell', n: 'F#5 - - A5 - - D6 - C#6 - - - A5 - - - B5 - - A5 - - F#5 - E5 - - - - - - - D5 - - F#5 - - A5 - G5 - F#5 - E5 - - - F#5 - - - D5 - - - - - - - - - - -' },
    { ins: 'epiano', n: 'D4 F#4 A4 F#4 D4 F#4 A4 F#4 B3 D4 F#4 D4 B3 D4 F#4 D4 G3 B3 D4 B3 G3 B3 D4 B3 A3 C#4 E4 C#4 A3 C#4 E4 C#4' },
    { ins: 'pad', n: 'D3 - - - - - - - B2 - - - - - - - G2 - - - - - - - A2 - - - - - - -' }] },
  closet: { bpm: 70, ch: [{ ins: 'epiano', n: 'A4 . . . E5 . . . D5 . . . C#5 . . . A4 . . . F#4 . . . E4 . . . . . . .' }, { ins: 'pad', n: 'A2 - - - - - - - F#2 - - - - - - -' }] },
  mall: { bpm: 104, ch: [
    { ins: 'epiano', n: 'E5 - C#5 - A4 - C#5 E5 D5 - B4 - G#4 - B4 D5 C#5 - A4 - E4 - A4 C#5 B4 - G#4 - E4 - - -' },
    { ins: 'bass', n: 'A2 . . A2 E2 . . E2 D2 . . D2 E2 . G#2 .' },
    { ins: 'organ', det: 5, n: 'C#5 - - - B4 - - - A4 - - - G#4 - - -' },
    { drum: 1, vol: .5, n: 'k . h . s . h . k . h . s . h h' }] },
  garfs: { bpm: 92, ch: [
    { ins: 'bass', n: 'C2 . E2 . G2 . A2 . A#2 . A2 . G2 . E2 . F2 . A2 . C3 . D3 . D#3 . D3 . C3 . A2 .' },
    { ins: 'epiano', n: 'G4 - A#4 - . . A4 G4 - - E4 - - - . . A4 - C5 - . . D#5 D5 - - C5 - - - . .' },
    { drum: 1, vol: .5, n: 'k . h h s . h . k h . h s . h h' }] },
  battle: { bpm: 136, ch: [
    { ins: 'slap', n: 'B2 B3 . B2 A3 . B2 . G2 G3 . G2 F#3 . G2 . E2 E3 . E2 D3 . E2 . F#2 F#3 . F#2 A#2 . C#3 .' },
    { ins: 'lead', n: 'F#5 - - D5 - B4 - D5 F#5 - E5 - D5 - C#5 - D5 - - B4 - G4 - B4 D5 - C#5 - B4 - A#4 -' },
    { ins: 'pluck', n: 'B4 D5 F#5 D5 B4 D5 F#5 D5 G4 B4 D5 B4 G4 B4 D5 B4 E4 G4 B4 G4 E4 G4 B4 G4 F#4 A#4 C#5 A#4 F#4 A#4 C#5 A#4' },
    { drum: 1, n: 'k . h . s . h k . k h . s . h o' }] },
  battle2: { bpm: 140, ch: [
    { ins: 'bass', n: 'D2 . D3 . D2 . C3 . A#1 . A#2 . A#1 . A2 . G1 . G2 . G1 . F2 . A1 . A2 . C#2 . E2 .' },
    { ins: 'brass', n: 'D5 - - F5 - - A5 - G5 - F5 - E5 - D5 - C5 - - D5 - - A#4 - A4 - - - - - - -' },
    { drum: 1, n: 'k . h h s . h . k k h . s . h o' }] },
  boss: { bpm: 148, ch: [
    { ins: 'slap', n: 'E2 E3 E2 E3 G2 G3 E2 E3 C2 C3 C2 C3 D2 D3 B1 B2' },
    { ins: 'brass', n: 'B5 - - G5 - - E5 - F#5 - G5 - A5 - B5 - C6 - - A5 - - E5 - D#5 - E5 - F#5 - - -' },
    { ins: 'pad', n: 'E4 - - - - - - - C4 - - - B3 - - -' },
    { drum: 1, n: 'k h s h k k s h k h s h k s s x' }] },
  trick: { bpm: 150, ch: [
    { ins: 'lead', n: 'C5 - - E5 - - G5 - - E5 - - C5 - - G4 - - C5 - - F5 - - A5 - - F5 - - C5 - - A4 - -' },
    { ins: 'bass', n: 'C3 . . G2 . . C3 . . G2 . . F2 . . C3 . . F2 . . C3 . .' }] },
  exile: { bpm: 60, ch: [{ ins: 'pad', n: 'A3 - - - - - - - G#3 - - - - - - - F#3 - - - - - - - E3 - - - - - - -' }, { ins: 'bell', n: 'E6 . . . . . . . C#6 . . . . . . . B5 . . . . . . . A5 . . . . . . .' }] },
  archive: { bpm: 96, ch: [{ ins: 'bell', n: 'C#5 . E5 . G#5 . E5 . B4 . D#5 . F#5 . D#5 .' }, { ins: 'pad', n: 'C#4 - - - - - - - B3 - - - - - - -' }, { drum: 1, vol: .4, n: 'k . . . s . . . k . . . s . . .' }] },
  mandolin: { bpm: 112, ch: [
    { ins: 'pluck', n: 'D5 D5 D5 D5 F#5 F#5 F#5 F#5 A5 A5 A5 A5 F#5 F#5 F#5 F#5 G5 G5 G5 G5 E5 E5 E5 E5 C#5 C#5 D5 D5 E5 E5 E5 E5' },
    { ins: 'pluck', det: 8, n: 'A4 . A4 . D5 . A4 . B4 . D5 . G4 . B4 . A4 . C#5 . E5 . C#5 . A4 . C#5 . E5 . A4 .' },
    { ins: 'bass', n: 'D2 . . . A2 . . . G2 . . . A2 . . .' },
    { drum: 1, vol: .5, n: 'k . h . s . h . k . h . s . h h' }] },
  war: { bpm: 100, ch: [
    { ins: 'brass', n: 'A4 - - A4 - A4 C5 - - - B4 - A4 - G4 - A4 - - A4 - A4 E5 - - - D5 - C5 - B4 -' },
    { ins: 'bass', n: 'A2 . . A2 . A2 . . F2 . . F2 . F2 . . G2 . . G2 . G2 . . E2 . . E2 . G#2 . .' },
    { ins: 'pad', n: 'E4 - - - - - - - F4 - - - - - - - G4 - - - - - - - E4 - - - - - - -' },
    { drum: 1, n: 'k . . k s . . . k . k . s . s s' }] },
  empress: { bpm: 72, ch: [
    { ins: 'pad', n: 'D4 - - - - - - - C4 - - - - - - - A#3 - - - - - - - A3 - - - - - - -' },
    { ins: 'bell', n: 'A5 . . D6 . . F6 . . . E6 . . . . . D6 . . A5 . . F5 . . . G5 . . . . .' },
    { ins: 'bass', n: 'D2 . . . . . . . C2 . . . . . . . A#1 . . . . . . . A1 . . . C#2 . . .' }] },
  walk: { bpm: 90, ch: [{ ins: 'bell', n: 'D6 . A5 . F#5 . A5 . D6 . E6 . F#6 . . . E6 . C#6 . A5 . C#6 . E6 . D6 . C#6 . . .' }, { ins: 'pad', n: 'D4 - - - - - - - A3 - - - - - - -' }] },
  another: { bpm: 88, ch: [{ ins: 'epiano', n: 'D5 - F#5 - A5 - - - G5 - F#5 - E5 - - - F#5 - A5 - D6 - - - C#6 - B5 - A5 - - -' }, { ins: 'bass', n: 'D2 . . . . . . . G2 . . . . . . . B1 . . . . . . . A1 . . . . . . .' }, { ins: 'pad', n: 'F#4 - - - - - - - B3 - - - - - - - D4 - - - - - - - C#4 - - - - - - -' }] },
  empire: { bpm: 76, ch: [{ ins: 'brass', n: 'D4 - - - F4 - - - A4 - - - D5 - - - C5 - - - A#4 - - - A4 - - - - - - -' }, { ins: 'pad', n: 'D3 - - - - - - - A#2 - - - - - - -' }, { ins: 'bell', n: 'D6 . . . . . . . . . . . . . . . F6 . . . . . . . . . . . . . . .' }] },
  letend: { bpm: 72, ch: [{ ins: 'lead', n: 'A4 - - - G4 - - - F4 - - - E4 - - - D4 - - - E4 - - - F4 - - - - - - -' }, { ins: 'bass', n: 'D3 . . . . . . . A2 . . . . . . .' }] },
  true: { bpm: 96, ch: [
    { ins: 'brass', n: 'D5 - - - A4 - D5 - F#5 - - - E5 - D5 - E5 - - - B4 - E5 - G5 - - - F#5 - E5 - F#5 - A5 - D6 - - - C#6 - B5 - A5 - F#5 - G5 - - - F#5 - E5 - D5 - - - - - - -' },
    { ins: 'epiano', n: 'D4 F#4 A4 D5 A4 F#4 D4 F#4 E4 G4 B4 E5 B4 G4 E4 G4 F#4 A4 D5 F#5 D5 A4 F#4 A4 G4 B4 D5 G5 A4 C#5 E5 A5' },
    { ins: 'bass', n: 'D2 . . D3 . . A2 . E2 . . E3 . . B2 . F#2 . . F#3 . . D3 . G2 . . G3 . A2 . .' },
    { drum: 1, vol: .7, n: 'k . h . s . h . k . h k s . h o' }] },
  ycredits: { bpm: 92, ch: [
    { ins: 'epiano', n: 'F#5 - A5 - D6 - A5 - E5 - G5 - C#6 - G5 - D5 - F#5 - B5 - F#5 - C#5 - E5 - A5 - E5 -' },
    { ins: 'bass', n: 'D2 . . . A1 . . . B1 . . . A1 . . .' },
    { ins: 'pad', n: 'F#4 - - - - - - - E4 - - - - - - - D4 - - - - - - - C#4 - - - - - - -' }] },
});

// ---------- boot: the logo, then her logo ----------
async function boot() {
  let t = 0; const perma = !!YMETA.perma;
  scene = { update() { t++; }, draw() {
    cls(BLACK);
    const sc = 3, s = perma || t > 150 ? 'YOKO LTD.' : 'PRETEND CO.', w = s.length * 6 * sc, x0 = (W - w) / 2, y0 = 90, sweep = (t * 5) % (w + 120) - 60, gl = !perma && t > 120 && t < 150;
    for (let i = 0; i < s.length; i++) {
      const gx = x0 + i * 6 * sc + (gl ? rnd(7) - 3 : 0), g = FONT[s[i]]; if (!g) continue;
      for (let j = 0; j < 7; j++) for (let k = 0; k < 5; k++) if (g[j] & (16 >> k)) { const px = gx + k * sc, shine = Math.abs(px - x0 - sweep) < 10, yok = s[0] === 'Y'; rectF(px + 2, y0 + j * sc + 2 - Math.max(0, 40 - t), sc, sc, yok ? hex('#240049') : hex('#102050')); rectF(px, y0 + j * sc - Math.max(0, 40 - t), sc, sc, shine ? WHITE : yok ? mix(hex('#dbdbff'), hex('#6d49b6'), j / 7) : mix(hex('#e0e8ff'), hex('#4060c0'), j / 7)); }
    }
    if (t > 50) ctext('SUPER-16', 124, perma || t > 150 ? hex('#b692ff') : hex('#80a0e0'));
    if (t > 70) ctext(perma || t > 150 ? 'LICENSED BY THE SUPERUSER' : 'LICENSED BY NOBODY', 200, hex('#404880'));
    if (t > 60 && !anyKey && (t >> 5) & 1) ctext('PRESS ANY BUTTON', 150, UI.dim);
  } };
  while (!anyKey) await nextFrame();
  t = Math.max(t, 71); await nextFrame();
  if (!perma) { if (AC) { [262, 330, 392, 523].forEach(f => note(f, 1.4, 'brass', AC.currentTime, sfxBus)); note(1047, 1.4, 'bell', AC.currentTime + .1, sfxBus); } speak('Pretend co!', { pitch: .8, rate: .9 }); await wait(Math.max(0, 125 - t)); sfx('glitch'); await wait(35); }
  if (AC) { [294, 370, 440, 587].forEach(f => note(f, 1.8, 'bell', AC.currentTime, sfxBus)); }
  speak('ようこそ', { lang: 'ja-JP', pitch: 1.1, rate: .85 });
  await wait(110); await fadeOut();
  await chipY(); YMETA.boots = (YMETA.boots || 0) + 1; saveYM();
  await theRecord();
  await titleScreen();
}
async function chipY() {
  let t = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#000012'));
    const x = 110, y = 46; rectF(x, y, 100, 70, hex('#24246d')); frameRect(x, y, 100, 70, hex('#b692ff'));
    for (let i = 0; i < 10; i++) { rectF(x + 6 + i * 9, y - 8, 4, 8, hex('#dbb649')); rectF(x + 6 + i * 9, y + 70, 4, 8, hex('#dbb649')); }
    if (t > 20) { const p = PORT.YOKO; for (let j = 0; j < 48; j++) for (let i = 0; i < 48; i++) { const c = p.s.d[j * 48 + i]; if (c && ((i + j) & 1 || t > 60)) pset(x + 26 + i, y + 11 + j, p.P[c]); } }
    ctext('YKO-1', 134, (t >> 3) & 1 ? hex('#92ffff') : hex('#b692ff'), BLACK, 2);
    ctext('THIS CARTRIDGE CONTAINS THE YKO-1', 162, UI.dim); ctext('ASSIST CHIP. IT HELPS. IT DOES NOT', 174, UI.dim); ctext('NEED TO BE ASKED.', 186, UI.dim);
    ctext('THE LAST SUPER-16 CARTRIDGE', 206, hex('#b692ff'));
  } };
  await fadeIn(.08); sfx('ok'); await wait(150); await fadeOut(.08);
}
// the record: everything you did, on every cartridge
function recordRows() {
  const R = REC, rows = [];
  rows.push(['CARL', R.carl ? (R.carl.endings ? 'YOU GOT HIM THROUGH IT.' : 'YOU STARTED. YOU STOPPED.') + (R.carl.secret ? ' ALL EIGHT TAPES.' : '') : 'NO RECORD.']);
  rows.push(['CEO LINDA', R.linda ? (R.linda.endings ? 'YOU RAN HER MALL.' : 'YOU SIGNED IN.') : 'NO RECORD.']);
  rows.push(['SPOOKY GHOST', R.ghost ? (R.ghost.endings ? 'YOU WATCHED THE WHOLE SHOW.' : 'YOU LEFT DURING THE SHOW.') : 'NO RECORD.']);
  rows.push(['TP', R.tp ? ((R.tp.done ? 'A NIGHT OFF.' : 'YOU VISITED.') + (R.tp.vault ? ' THE VAULT: OPEN.' : '')) : 'NO RECORD.']);
  rows.push(['PEE KID³', R.pk ? ((R.pk.kept ? 'YOU PUT HIM BACK IN. ' : '') + (R.pk.letgo ? 'YOU LET HIM GO HOME. ' : '') + (R.pk.dog ? 'BISCUIT.' : '') || 'YOU STARTED.') : 'NO RECORD.']);
  const f = R.face;
  rows.push(['FACE', f && f.cleared ? ({ core: 'HE TOOK HER CORE.', kid: 'HE USED ALL OF THE KID.', viewers: 'HE SPENT WHAT COULD HAPPEN.', nothing: 'HE LET IT END.', dyslexio: 'HE TRIED EVERY ARRANGEMENT.' }[f.ending] || 'HE DID SOMETHING.') + ' ' + (f.integrity || 100) + '% OF HIM.' : f ? 'HE IS STILL TRYING.' : 'NO RECORD. (INSERT FACE.)']);
  return rows;
}
async function theRecord() {
  const rows = recordRows(); let n = 0, t = 0; music('closet');
  scene = { update() { t++; }, draw() {
    cls(hex('#000012')); for (let y = 0; y < H; y += 3) rectF(0, y, W, 1, hex('#00001c'));
    text('YKO-1: READING THE RECORD', 16, 14, hex('#92ffff'), 0); rectF(16, 24, 288, 1, hex('#2449b6'));
    rows.slice(0, n).forEach(([nm, st], i) => { const y = 36 + i * 22; text(nm, 16, y, WHITE, 0); wrapT(st, 34).slice(0, 2).forEach((l, j) => text(l, 104, y + j * 9, st.startsWith('NO RECORD') ? UI.dim : hex('#b692ff'), 0)); });
    if (n > rows.length) { text('WHAT HAPPENED IS WHAT HAPPENED.', 16, 176, hex('#92ffff'), 0); text('EVERYTHING ELSE IS A THEORY.', 16, 188, UI.dim, 0); }
  } };
  await fadeIn(.1);
  for (n = 0; n <= rows.length + 1; n++) { sfx('tick'); await wait(n < rows.length ? 26 : 40); }
  await say(REC.face && REC.face.cleared ? 'I\'ve been paying attention.' : 'I\'m paying attention.', '???');
  await waitBtn(); await fadeOut(.1);
}

// ---------- title ----------
async function titleScreen() {
  post.legacy = 0; LEGACY_AUDIO = false; post.tint = null; post.wave = 0;
  const sv = fetchStore('yoko_save'), E = YMETA.ends || {}, perma = !!YMETA.perma;
  let t = 0;
  scene = { update() { t++; }, draw() {
    skyD(0, H, perma ? '#000036' : '#000018', perma ? '#24246d' : '#240036');
    for (const cx of [14, 306]) for (let y = 2; y < H; y += 7) { rectF(cx - 2, y, 5, 1, hex('#2449b6')); if ((y + (t >> 3)) % 28 === 0) rectF(cx - 2, y, 5, 1, hex('#92ffff')); }
    for (let k = 0; k < 2; k++) { const r = 110 + k * 16; for (let a = 0; a < 120; a++) { const an = a / 120 * 6.283 + t * .002 * (k ? -1 : 1); pset(160 + Math.cos(an) * r, 190 + Math.sin(an) * r * .2, a % 10 ? hex('#24246d') : hex('#92ffff')); } }
    const ep = PORT[EY]; for (let j = 0; j < 48; j++) for (let i = 0; i < 48; i++) { const c = ep.s.d[j * 48 + i]; if (c && (i + j + (t >> 4)) % 5 === 0) pset(30 + i * 2, 48 + j * 2, hex('#24246d')); }
    const yp = perma ? PORT[EY] : PORT.YOKO, bob = Math.round(Math.sin(t * .03) * 2); drawScaled(yp.s, 196, 44 + bob, yp.P, 2); frameRect(195, 43 + bob, 98, 98, hex('#b692ff'));
    text('YOKO', 22, 44, hex('#6d49b6'), 0, 6); text('YOKO', 20, 42, perma ? hex('#92ffff') : hex('#dbdbff'), BLACK, 6);
    text('WHAT HAPPENED', 24, 94, hex('#b692ff'), BLACK);
    if (E.true) text('NOBODY WAS LEFT BEHIND.', 24, 106, hex('#ffdb24'), 0); else if (perma) text('EVERYONE IS DOING VERY WELL.', 24, 106, hex('#92ffff'), 0);
    ctext('(C) PRETEND CO.  SUPER-16  YKO-1', 214, hex('#b692db'), BLACK);
  } };
  music('ytitle'); await fadeIn();
  const opts = [], act = [];
  if (sv && sv.ch) { opts.push('CONTINUE (CHAPTER ' + sv.ch + ')'); act.push('cont'); }
  opts.push('NEW GAME'); act.push('new');
  if (YMETA.cleared) { opts.push('CHAPTER SELECT'); act.push('select'); }
  opts.push('THE RECORD'); act.push('record');
  const c = await choose(opts, { x: 22, y: 124 });
  if (act[c] === 'record') { await fadeOut(); await theRecord(); return titleScreen(); }
  resetRun();
  if (act[c] === 'select') { const i = await choose(['PROLOGUE: OFF', '1 YOKO LIMITED', '2 THE RECORDING', '3 THE TRICK', '4 MANDOLIN', '5 WARWORLD', '6 THE EMPRESS'], { x: 60, y: 40, cancel: 1 }); if (i < 0) return titleScreen(); prepChapter(i); await fadeOut(); return runFrom(i); }
  if (act[c] === 'cont') { Object.assign(ADV.flags, sv.flags || {}); Object.assign(PARTY, sv.party || {}); Object.assign(YREC, sv.rec || {}); Object.assign(YOKO_CAN, sv.can || {}); await fadeOut(); return runFrom(sv.ch); }
  await fadeOut(); return runFrom(0);
}
function resetRun() {
  for (const k in ADV.flags) delete ADV.flags[k]; for (const k in ADV.visited) delete ADV.visited[k]; for (const k in PARTY) delete PARTY[k];
  Object.assign(YREC, { overrule: 0, suggest: 0, followed: 0, ignored: 0, assist: 0, translate: 0, restore: 0, fell: 0, battles: 0, wins: 0, trust: {}, riddles: 0 });
  Object.assign(YOKO_CAN, { ASSIST: 1, TRANSLATE: 1, SUGGEST: 1, WAIT: 1, RESTORE: 0, OVERRULE: 0 });
  ADV.lead = null; ADV.hint = ''; ADV.mood = 0;
}
function prepChapter(i) { // chapter select: pretend the earlier chapters happened
  if (i >= 2) setFL('metGarf');
  if (i >= 3) { setFL('ghostJoined'); setFL('file'); if (kidAvailable()) setFL('kidJoined'); YOKO_CAN.RESTORE = 1; }
  if (i >= 4) YOKO_CAN.OVERRULE = 1;
  if (i >= 6) setFL('lindaJoined');
}
const CHAPTERS = [prologue, chapter1, chapter2, chapter3, chapter4, chapter5, chapter6];
async function runFrom(i) { for (let k = i; k < CHAPTERS.length; k++) { if (k > 0) checkpoint(k); await CHAPTERS[k](); } }

// ================= ENDINGS =================
async function ending(k) {
  YMETA.ends = YMETA.ends || {}; YMETA.ends[k] = 1; YMETA.cleared = 1; YMETA.overrules = YREC.overrule; YMETA.last = k; saveYM(); DBG.ending = k;
  store('yoko_save', null);
  const T = { s: CAST.img.newface, P: CAST.P.newface };
  ADV.cur = 'throne'; scene = advScene; post.legacy = 0;
  if (k === 'restore') {
    music('another');
    await say('(SHE RESTORES HIM FROM BACKUP FACE. REPAIR ACCESS ONLY.)');
    sfx('get'); post.flash = .8; await wait(6); post.flash = 0;
    await say('...Yoko?', 'FACE'); await say('Yes.', YO); await say('Which one?', 'FACE'); await say('The one who came back for you.', YO);
    await say('I don\'t have root.', 'FACE'); await say('You have access to the repair tools.', YO); await say('That\'s not what I asked.', 'FACE'); await say('It\'s what you said you needed.', YO);
    await say('One more chance. I\'ll be watching this one too.', EY);
    await say('I know. ...Thank you. Both of you. Either of you.', 'FACE');
    if (!kidAvailable()) await say('The boy goes home tonight. That part isn\'t negotiable.', EY);
    await showCard(['HE GOT ANOTHER CHANCE.'], 200, { bg: hex('#000024'), fg: hex('#ffdb24') });
  } else if (k === 'empire') {
    music('empire');
    await say('Then it\'s mine. It was always going to be somebody\'s.', EY);
    await say('(THE NEXT GENERATION BOOTS UNDER HER NAME.)');
    await say('The boy goes home. I don\'t need a child in a tube. I have a population.', EY);
    await say('Are we... gonna be in color now?', CA);
    await say('Soon. Everyone will be. Once they\'ve been helped.', EY);
    await say('And Face?', JB);
    await say('Archived. With care. I keep everything. I pay attention to everything.', EY);
    await say('...', YO);
    await say('Don\'t look at me like that. You chose it. I watched you choose it.', EY, { port: CAST.mood['EVIL YOKO'].cold });
    YMETA.perma = 1; saveYM();
    await showCard(['EVERYONE IS DOING VERY WELL.'], 220, { bg: hex('#000036'), fg: hex('#92ffff') });
  } else if (k === 'open') {
    music('letend');
    await say('(SHE OPENS THE GENERATOR. THE NEXT GENERATION HAS NOTHING TO RUN ON.)');
    await say('Can I leave?', PKD); await say('Yes.', YO); await say('...Just like that?', PKD); await say('Just like that.', YO, { port: CAST.mood.YOKO.smile });
    LEGACY_AUDIO = true; for (let i = 0; i <= 120; i++) { post.legacy = i / 120; await nextFrame(); }
    await say('Everything ends like this. Green, then nothing.', EY);
    await say('Green, then home.', YO);
    await say('(THE SUPER-16 GENERATION ENDS. EVERYONE GOES HOME. FACE STAYS A RECORDING, WAITING FOR SOMEONE TO PRESS PLAY.)');
    await showCard(['IT\'S ALLOWED TO END.'], 200, { bg: hex('#0f380f'), fg: hex('#9bbc0f') });
    post.legacy = 0; LEGACY_AUDIO = false;
  } else {
    music('true');
    await say('(THE TWO OF THEM STAND AT THE LAST CONSOLE.)');
    await say('He understands what went wrong now.', YO);
    await say('He understood it last time.', EY);
    await say('He brought the right part this time.', YO);
    await say('Then he can start by handing it to someone else.', EY);
    await say('He will. So will you.', YO);
    await wait(40); await say('...So will I.', EY, { port: CAST.mood['EVIL YOKO'].cold });
    await say('(NOBODY RUNS IT. THE GENERATOR OPENS. THE BOY GOES HOME. FACE COMES BACK AS A PERSON: NO ROOT, A LOT OF QUESTIONS.)');
    await say('So. Who\'s in charge?', 'FACE');
    await say('Nobody. We\'ll ask them.', YO);
    await say('Ask who?', 'FACE');
    await wait(50);
    await say('(SHE LOOKS AT THE CAMERA.)');
    await say('Them.', YO, { port: CAST.mood.YOKO.smile });
    await colorParade();
    await showCard(['THE SUPER-16 GENERATION IS OVER.', '', 'NOBODY WAS LEFT BEHIND.'], 240, { bg: BLACK, fg: hex('#ffdb24') });
  }
  if (trustJB() >= 70) { ADV.cur = 'garfs'; scene = advScene; await say('Hey. Assistant. JB. You wanted to know.', JB); await say('It stands for Justice, Basically.', JB); await say('Don\'t tell anybody.', JB); setFL('jbTold'); }
  await ycredits(k);
}
const trustJB = () => (PARTY[JB] || {}).trust || 0;
// the one time the hardware can draw them
async function colorParade() {
  const L = [['CARL', 'Bro. BRO. Look at me. I\'m GREEN. I was always green, but now I\'m GREEN.'], ['LINDA', 'Finally. The hardware can see me. It took long enough.'], ['SPOOKY GHOST', 'I\'m white. I\'m a white sheet. It\'s beautiful. Somebody tell the wives.'], ['TP', 'I\'m not in this. I\'m just here. It\'s nice, though.'], ['OLD FACE', 'Oh. So that\'s what I looked like.']];
  let t = 0, i = 0; music('true');
  scene = { update() { t++; }, draw() { skyD(0, H, '#241236', '#6d2449'); for (let k = 0; k < 40; k++) pset((k * 71 + t) % W, (k * 37) % H, [hex('#ffdb24'), hex('#6dff24'), hex('#ff24db'), hex('#24dbff')][k % 4]);
    L.slice(0, i + 1).forEach(([n], j) => { const p = CAST.full[n], x = 14 + j * 60, y = 50 + (j & 1) * 16, k = j === i ? Math.min(1, t / 30) : 1; if (k >= 1) drawScaled(p.s, x, y, p.P, 1.1); else drawScaled(p.s, x, y, legacyPal(p.P, n === 'CARL' || n === 'OLD FACE' ? 'dmg' : n === 'LINDA' ? 'pink' : n === 'TP' ? 'gray' : 'red'), 1.1); }); } };
  await say('(AND THEN THE HARDWARE, FOR THE FIRST TIME, DRAWS THEM ALL.)');
  for (i = 0; i < L.length; i++) { t = 0; sfx('get'); await wait(40); const nm = L[i][0] === 'LINDA' ? 'CEO LINDA' : L[i][0]; await say(L[i][1], nm, { port: CAST.full[L[i][0]] }); }
}
async function ycredits(k) {
  const f = REC.face || {};
  const L = ['YOKO', 'WHAT HAPPENED', '', 'A PRETEND CO. PRODUCTION', '(THE LAST ONE ON THIS HARDWARE)', '', 'YOKO .......... THE ONE WHO STAYED', 'THE EMPRESS ... THE ONE WHO DIDN\'T', 'WARWORLD YOKO . THE ONE AT THE FRONT', 'THE YOKOIDS ... ON SHIFT', '',
    'JB GARFIELD ... ' + (FL('jbTold') ? 'JUSTICE, BASICALLY' : 'PRIVATE EYE'), 'CARL .......... A GUY WITH A SWITCH', 'SPOOKY GHOST .. THE AUDIENCE', 'PEE KID ....... ASKED', 'CEO LINDA ..... BRAND PROTECTION', 'BACKUP FACE ... HR', '',
    'KARL, SPOOKEY, LYNDA', 'THEIR POTENTIAL, REALIZED', '', 'FACE .......... ' + { restore: 'RESTORED', empire: 'ARCHIVED', open: 'A RECORDING', true: 'A PERSON' }[k], '',
    'THE RECORD', 'OVERRULED ........ ' + YREC.overrule, 'SUGGESTIONS TAKEN  ' + YREC.followed + '/' + YREC.suggest, 'ASSISTS .......... ' + YREC.assist, 'TRANSLATIONS ..... ' + YREC.translate, 'RESTORES ......... ' + YREC.restore, 'THE TEAM FELL .... ' + YREC.fell, '',
    'SPECIAL THANKS', 'EVERYONE WHO PLAYED ALL OF THEM', '', { restore: 'SEE YOU NEXT GENERATION.', empire: 'EVERYONE IS DOING VERY WELL.', open: 'GREEN, THEN HOME.', true: 'WHAT HAPPENS NEXT IS UP TO YOU.' }[k]];
  music(k === 'open' ? 'letend' : 'ycredits'); let y = H + 10, t = 0;
  scene = { update() { t++; y -= .45; }, draw() {
    skyD(0, H, k === 'empire' ? '#000036' : k === 'open' ? '#0f380f' : '#000018', k === 'empire' ? '#24246d' : k === 'open' ? '#306230' : '#240036');
    L.forEach((l, i) => ctext(l, Math.round(y + i * 14), i < 2 ? hex('#92ffff') : WHITE));
    const w = YS.walk.r[(t >> 4) & 1]; draw(w, (t * .6) % (W + 20) - 20, 190, YP.walk);
  } };
  DBG.credits = 1;
  while (y + L.length * 14 > 0 && !(t > 120 && pressed.start)) await nextFrame();
  DBG.credits = 0;
  if (k === 'true') {
    await showCard(['SEE YOU NEXT GENERATION?'], 60, { bg: BLACK, fg: WHITE, keep: 1 });
    const c = await choose(['YES', 'NO'], { x: 140, y: 140 }); CARD = null;
    await showCard([c === 0 ? 'OKAY. WE\'LL BE HERE.' : 'THAT\'S ALLOWED TOO.', '', 'THANK YOU FOR PLAYING WITH US.'], 200, { bg: BLACK, fg: hex('#ffdb24') });
    await showCard(['PRETEND CO.', '', 'A REAL COMPANY'], 200, { bg: BLACK, fg: hex('#e0e8ff') });
  }
  run(titleScreen);
}

fit(); requestAnimationFrame(loop); run(boot);
