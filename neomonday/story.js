'use strict';
// ================= NEO MONDAY — core: cast, music, state, the command hub, THINK, PHONE, boot, title, saves =================
// Verbs follow the adventure-game bible: LOOK, INVESTIGATE, ASK, MOVE, THINK (a real recap), PHONE, ITEM.
CAST.JB = { col: hex('#ffb258'), voice: [140, 20] }; CAST.KUMA = { col: hex('#7ae0ff'), voice: [900, 200] }; CAST.VANE = { col: hex('#ff7ac8'), voice: [300, 15] };
CAST.MIRA = { col: hex('#a8ffd8'), voice: [500, 20] }; CAST.LUCKY = { col: hex('#ffd060'), voice: [210, 30] }; CAST.COPYCAT = { col: hex('#ff6060'), voice: [700, 500] };
CAST.HAROLD = { col: hex('#8ae8ff'), voice: [250, 10] }; CAST.CHIEF = CAST.VANE;

// ---------- music (FM patches from fm.js) ----------
const blk = (...a) => a.join(' ');
const R16 = '. . . . . . . . . . . . . . . .';
function track(bpm, parts) { return { bpm, ch: parts.map(p => Object.assign({}, p, { n: blk(...p.n) })) }; }
Object.assign(TRACKS, {
  title: track(76, [
    { ins: 'brass', vol: .5, n: ['A4 - - - - - C5 - - - E5 - - - D5 -', 'C5 - - - B4 - - - A4 - - - - - - -', 'F4 - - - A4 - - - C5 - - - B4 - A4 -', 'G#4 - - - B4 - - - E5 - - - - - - -'] },
    { ins: 'pad', vol: .35, n: ['A3 - - - - - - - - - - - - - - -', 'F3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'E3 - - - - - - - - - - - - - - -'] },
    { ins: 'bass', vol: .8, n: ['A2 - - A2 - - A2 - A2 - - A2 - - E2 -', 'F2 - - F2 - - F2 - F2 - - F2 - - C2 -', 'D2 - - D2 - - D2 - D2 - - D2 - - A1 -', 'E2 - - E2 - - E2 - E2 - - E2 - - B1 -'] },
    { drum: 1, vol: .4, n: ['k . . h s . . h k . . k s . h .', 'k . . h s . . h k . . k s . h .', 'k . . h s . . h k . . k s . h .', 'k . . h s . . h k . s s s . s s'] },
  ]),
  cold: track(60, [
    { ins: 'bell', vol: .35, n: ['E5 - - - - - - - B4 - - - - - - -', R16, 'G5 - - - - - - - D5 - - - - - - -', R16] },
    { ins: 'pad', vol: .4, n: ['E3 - - - - - - - - - - - - - - -', 'E3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -'] },
  ]),
  plant: track(110, [
    { ins: 'slap', vol: .8, n: ['E2 - E2 - E2 - G2 - E2 - E2 - B1 - D2 -', 'E2 - E2 - E2 - G2 - E2 - E2 - A2 - G2 -', 'C2 - C2 - C2 - E2 - C2 - C2 - G1 - B1 -', 'B1 - B1 - B1 - D2 - B1 - B1 - F#2 - E2 -'] },
    { ins: 'lead', vol: .35, n: [R16, 'B4 - - - - - - - - - - - E5 - - -', R16, 'D5 - - - - - - - - - - - B4 - - -'] },
    { drum: 1, vol: .5, n: ['k . h . s . h . k . h . s . h h', 'k . h . s . h . k . h . s . h h', 'k . h . s . h . k . h . s . h h', 'k . h . s . h . k k s s k k s s'] },
  ]),
  street: track(84, [
    { ins: 'epiano', vol: .5, n: ['A4 - - C5 - - E5 - - D5 - - C5 - - -', 'G4 - - B4 - - D5 - - C5 - - B4 - - -', 'F4 - - A4 - - C5 - - B4 - - A4 - - -', 'E4 - - G#4 - - B4 - - E5 - - - - - -'] },
    { ins: 'pad', vol: .3, n: ['A3 - - - - - - - - - - - - - - -', 'G3 - - - - - - - - - - - - - - -', 'F3 - - - - - - - - - - - - - - -', 'E3 - - - - - - - - - - - - - - -'] },
    { ins: 'bass', vol: .7, n: ['A2 - - - - - A2 - - - - - E2 - - -', 'G2 - - - - - G2 - - - - - D2 - - -', 'F2 - - - - - F2 - - - - - C2 - - -', 'E2 - - - - - E2 - - - - - B1 - - -'] },
    { drum: 1, vol: .3, n: ['k . . . . . h . s . . . . . h .', 'k . . . . . h . s . . . . . h .', 'k . . . . . h . s . . . . . h .', 'k . . . . . h . s . . . s . h .'] },
  ]),
  bar: track(70, [
    { ins: 'epiano', vol: .5, n: ['D5 - - - F5 - - - A5 - - - G5 - F5 -', 'E5 - - - D5 - - - C5 - - - - - - -', 'D5 - - - F5 - - - A5 - - - C6 - B5 -', 'A5 - - - G5 - - - D5 - - - - - - -'] },
    { ins: 'bass', vol: .7, n: ['D2 - - - A2 - - - D2 - - - A2 - - -', 'C2 - - - G2 - - - C2 - - - G2 - - -', 'D2 - - - A2 - - - D2 - - - A2 - - -', 'A1 - - - E2 - - - A1 - - - E2 - - -'] },
    { drum: 1, vol: .25, n: ['h . . h . . h . h . . h . . h .', 'h . . h . . h . h . . h . . h .', 'h . . h . . h . h . . h . . h .', 'h . . h . . h . h . . h . h h h'] },
  ]),
  morgue: track(54, [
    { ins: 'pad', vol: .4, n: ['D3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'A#2 - - - - - - - - - - - - - - -', 'A#2 - - - - - - - - - - - - - - -'] },
    { ins: 'bell', vol: .3, n: [R16, 'F5 - - - - - - - - - - - - - - -', R16, 'E5 - - - - - - - - - - - - - - -'] },
  ]),
  office: track(88, [
    { ins: 'brass', vol: .45, n: ['D5 - - - F5 - - - E5 - - - D5 - - -', 'C5 - - - E5 - - - D5 - - - - - - -', 'A4 - - - C5 - - - D5 - - - E5 - D5 -', 'C5 - - - A4 - - - G4 - - - - - - -'] },
    { ins: 'bass', vol: .75, n: ['D2 - - D2 - - A2 - D2 - - D2 - - F2 -', 'C2 - - C2 - - G2 - C2 - - C2 - - E2 -', 'A1 - - A1 - - E2 - A1 - - A1 - - C2 -', 'G1 - - G1 - - D2 - G1 - - G1 - - B1 -'] },
    { drum: 1, vol: .3, n: ['k . . h . . s h . . k h . . s h', 'k . . h . . s h . . k h . . s h', 'k . . h . . s h . . k h . . s h', 'k . . h . . s h . . k h s . s s'] },
  ]),
  combat: track(140, [
    { ins: 'slap', vol: .85, n: ['A1 A1 A2 A1 A1 A2 A1 C2 A1 A1 A2 A1 G1 A1 B1 C2', 'F1 F1 F2 F1 F1 F2 F1 A1 F1 F1 F2 F1 E1 F1 G1 A1', 'D2 D2 D3 D2 D2 D3 D2 F2 D2 D2 D3 D2 C2 D2 E2 F2', 'E2 E2 E3 E2 E2 E3 E2 G#2 E2 E2 E3 E2 D2 E2 F2 G#2'] },
    { ins: 'lead', vol: .4, n: ['A4 - C5 - E5 - C5 - A4 - C5 - E5 - G5 - ', 'F4 - A4 - C5 - A4 - F4 - A4 - C5 - E5 -', 'D5 - F5 - A5 - F5 - D5 - F5 - A5 - C6 -', 'E5 - G#5 - B5 - G#5 - E5 - G#5 - B5 - E6 -'].map(s => s.trim()) },
    { drum: 1, vol: .6, n: ['k . h . s . h . k . h k s . h h', 'k . h . s . h . k . h k s . h h', 'k . h . s . h . k . h k s . h h', 'k . h . s . h . k k s s k k s x'] },
  ]),
  basement: track(72, [
    { ins: 'pad', vol: .45, n: ['C3 - - - - - - - - - - - - - - -', 'C#3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'B2 - - - - - - - - - - - - - - -'] },
    { ins: 'slap', vol: .6, n: ['C2 - - - - - C2 - - - C2 - - - - -', 'C#2 - - - - - C#2 - - - C#2 - - - - -', 'C2 - - - - - C2 - - - C2 - - - - -', 'B1 - - - - - B1 - - - B1 - - - - -'] },
    { ins: 'bell', vol: .25, n: ['G5 - - - - - - - - - D#5 - - - - -', R16, 'G5 - - - - - - - - - D#5 - - - - -', R16] },
    { drum: 1, vol: .35, n: ['k . . . . . . . k . . . . . h .', 'k . . . . . . . k . . . . . h .', 'k . . . . . . . k . . . . . h .', 'k . . . . . . . k . . . s . s s'] },
  ]),
  end: track(66, [
    { ins: 'epiano', vol: .5, n: ['E5 - - - G5 - - - B5 - - - A5 - G5 -', 'F#5 - - - E5 - - - D5 - - - - - - -', 'C5 - - - E5 - - - G5 - - - F#5 - E5 -', 'D5 - - - B4 - - - E5 - - - - - - -'] },
    { ins: 'pad', vol: .35, n: ['E3 - - - - - - - - - - - - - - -', 'D3 - - - - - - - - - - - - - - -', 'C3 - - - - - - - - - - - - - - -', 'B2 - - - - - - - - - - - - - - -'] },
    { ins: 'bass', vol: .65, n: ['E2 - - - - - - - E2 - - - - - - -', 'D2 - - - - - - - D2 - - - - - - -', 'C2 - - - - - - - C2 - - - - - - -', 'B1 - - - - - - - B1 - - - - - - -'] },
  ]),
});
FM_TONE = { low: 3, high: -2, lp: 7000, room: .22, gain: 1 };

// ---------- state ----------
const newState = () => ({ scene: 'freezer', case: 1, f: {}, items: [], clues: [], seen: {}, time: 0, act: 1 });
let S = newState();
const F = k => S.f[k], setF = (k, v = 1) => { S.f[k] = v; };
const has = it => S.items.includes(it);
const give = (it, label) => { if (!has(it)) S.items.push(it); sfx('get'); banner('GOT: ' + (label || it), 110); };
const clue = (id, text) => { if (!S.clues.some(c => c[0] === id)) { S.clues.push([id, text]); sfx('ok'); banner('CLUE: ' + text.split('.')[0].toUpperCase().slice(0, 34), 110); } };
const lose = it => { S.items = S.items.filter(i => i !== it); };
const hasClue = id => S.clues.some(c => c[0] === id);
const nth = (k, arr) => { const n = S.seen[k] || 0; S.seen[k] = n + 1; return arr[Math.min(n, arr.length - 1)]; };
const J = (s, mood) => say(s, 'JB', { mood }), K_ = (s, mood) => say(s, 'KUMA', { mood });
function save() { try { S.time = S.time || 0; store('neomonday_sav', S); } catch (e) {} }

// ---------- the stage: picture window, portraits while people talk, then the hub ----------
const SC = {}; // scene definitions live in acts.js
let STAGE = null;
const stageScene = {
  update() { S.time += 1 / 60; },
  draw() {
    if (!STAGE) { cls(); return; }
    copyBuf(STAGE.art, 0, 0); if (STAGE.anim) STAGE.anim(frame);
    if (DLG && DLG.who && PORTS[DLG.who] && !DLG.narr) {
      const typing = DLG.n < DLG.lines.join('').length, talk = typing ? 1 + ((frame >> 3) & 1) : 0, right = DLG.who !== 'JB', x = right ? W - PW - 16 : 16, y = VH - PH - 2;
      const p = portrait(DLG.who, DLG.mood || undefined, talk); rectA(x - 4, y + 6, PW + 8, PH - 6, K.ink, .35); blit(p, x, y);
    }
    if (STAGE.overlay) STAGE.overlay();
    rectF(0, VH, W, H - VH, BLACK);
    if (!DLG && !CARD) { panel(4, VH + 2, W - 8, H - VH - 6); text(SC[S.scene] ? SC[S.scene].name : '', 20, VH + 12, hex('#ffd24a')); text('MONDAY  ' + (S.scene === 'basement' ? 'SUBLEVEL' : 'AM'), 20, VH + 28, hex('#a8c8ff')); text('PRESS A TO CHOOSE.  B TO BACK OUT.', 20, VH + 52, hex('#7a8ac8')); }
  },
};
async function setStage(id, quick) {
  const sc = SC[id]; S.scene = id;
  if (!quick) await fadeOut(.08);
  STAGE = { art: SCENES[sc.art || id](), anim: ANIM[sc.art || id], overlay: sc.overlay };
  scene = stageScene; music(sc.music || id); save();
  if (!quick) await fadeIn(.08);
  if (sc.name && !S.seen['name_' + id]) { S.seen['name_' + id] = 1; banner(sc.name, 150); }
}
async function goto(id) { await setStage(id); const sc = SC[id]; if (sc.enter) await sc.enter(); }

// ---------- THINK: a recap that does real work: what is known, what does not fit, where to go next ----------
function recap() {
  if (S.case === 2) return recap2();
  const known = [], odd = [];
  if (F('woke')) known.push('I woke in a freezer at Sunday\'s Frozen Foods with a name, a hat, and a preference for lasagna.');
  if (F('ambush')) known.push('The foreman at the plant was a copycat. They are being made here, under the lasagna.');
  if (F('badge')) { known.push('A LITTER badge: HAROLD, J.B. The photo is a man.'); odd.push('The badge has my initials and a face that is not mine.'); }
  if (F('office')) known.push('Chief Vane gave me a phone and a story: Harold died in the field, a hero.');
  if (hasClue('file')) { known.push('Harold\'s file ends: "If you find this, I\'m already someone else."'); odd.push('A hero who wrote his last note like a man being replaced.'); }
  if (F('lucky')) known.push('Lucky says the Chief has not eaten in nine years. Diet, she says.');
  if (F('accused') && !F('morgue')) odd.push('Lucky has a red eye and a bad attitude. That is not a crime. Kuma checked his pulse.');
  if (hasClue('transfer')) { known.push('Harold\'s transfer order was signed by D. VANE twelve minutes before he died.'); odd.push('The Chief called it a tragedy. She signed it.'); }
  if (hasClue('port')) { known.push('Harold had a port in his skull labeled GARFIELD. That is a backup, and the backup is me.'); odd.push('I remember a room I was never in.'); }
  let next;
  if (!F('woke')) next = 'Get out of the freezer.';
  else if (!F('door')) next = 'The door is sealed. Kuma says he can open it. Let him.';
  else if (!F('ambush')) next = 'The plant floor is through the door.';
  else if (!F('office')) next = 'Find out who I work for. The street, then the LITTER building.';
  else if (!F('lucky')) next = 'Harold drank somewhere. The bar on the street has his name on a stool.';
  else if (!F('morgue')) next = 'Mira at the morgue was sent a body from the plant.';
  else if (!F('knows')) next = 'Put the signature and the diet together. One person fits both.';
  else if (!F('basement')) next = 'Sunday\'s has a basement. The phone might know the code.';
  else next = 'Finish it downstairs.';
  return { known, odd, next };
}
async function think() {
  const r = recap();
  await N('I sat with it. Cats are good at that. Here is what I had.');
  if (!r.known.length) await N('Nothing. A hat and a hunger.');
  for (const k of r.known) await N('- ' + k);
  for (const o of r.odd) await N('Doesn\'t fit: ' + o);
  if (F('accused') && !F('morgue') && !F('knows')) await N('My theory was Lucky. I held onto it for exactly as long as the evidence let me.');
  await N('Next: ' + r.next);
}

// ---------- the hub ----------
const VERBS = ['LOOK', 'INVESTIGATE', 'ASK', 'MOVE', 'THINK', 'PHONE', 'ITEM', 'SYSTEM'];
let GEN = 0; // bumped by toTitle(): any hub still unwinding from an ending exits instead of drawing its menu over the title
async function hub() {
  const gen = ++GEN;
  for (;;) {
    if (gen !== GEN) return;
    const sc = SC[S.scene], ok = v => v === 'ASK' ? (sc.ask || []).some(a => !a.if || a.if()) : v === 'PHONE' ? F('phone') : v === 'MOVE' ? true : true;
    const verbs = VERBS.filter(ok), i = await choose(verbs, { x: 10, y: 14, title: 'COMMAND', cancel: 0 });
    const v = verbs[i];
    if (v === 'LOOK') await sc.look();
    else if (v === 'INVESTIGATE') { const t = (sc.inv || []).filter(a => !a.if || a.if()); if (!t.length) { await N('Nothing here I haven\'t already stared at.'); continue; } const j = await choose(t.map(a => a.name).concat(['BACK']), { x: 10, y: 14, title: 'INVESTIGATE', cancel: 1 }); if (j >= 0 && j < t.length) await t[j].fn(); }
    else if (v === 'ASK') { const t = (sc.ask || []).filter(a => !a.if || a.if()); const j = await choose(t.map(a => a.name).concat(['BACK']), { x: 10, y: 14, title: 'ASK', cancel: 1 }); if (j >= 0 && j < t.length) await t[j].fn(); }
    else if (v === 'MOVE') { const t = (sc.move || []).filter(a => !a.if || a.if()); const j = await choose(t.map(a => a[0]).concat(['BACK']), { x: 10, y: 14, title: 'MOVE', cancel: 1 }); if (j >= 0 && j < t.length) { const go = await (t[j][2] ? t[j][2]() : true); if (go !== false) { await goto(t[j][1]); return hub(); } } }
    else if (v === 'THINK') await think();
    else if (v === 'PHONE') await phone();
    else if (v === 'ITEM') await itemMenu();
    else if (v === 'SYSTEM') { const k = await choose(['SAVE', 'TO TITLE', 'BACK'], { x: 10, y: 14, cancel: 1 }); if (k === 0) { save(); sfx('get'); await N('SAVED. THE DISK LIGHT BLINKS.'); } else if (k === 1) { await fadeOut(.08); return toTitle(); } }
  }
}
async function itemMenu(forPresent) {
  const its = S.items.slice(), cl = S.clues.map(c => c[1]);
  if (!its.length && !cl.length) { await N('Pockets: a hat\'s worth of lint and one stubborn crumb.'); return null; }
  const opts = its.map(i => ITEMS[i] ? ITEMS[i][0] : i).concat(forPresent ? [] : ['CLUES']).concat(['BACK']);
  const i = await choose(opts, { x: 10, y: 14, title: forPresent ? 'PRESENT' : 'ITEMS', cancel: 1 });
  if (i < 0 || i === opts.length - 1) return null;
  if (i < its.length) { if (forPresent) return its[i]; await N(ITEMS[its[i]] ? ITEMS[its[i]][1] : its[i]); return its[i]; }
  for (const c of S.clues) await N('CLUE: ' + c[1]);
  return null;
}
const ITEMS = {};

// ---------- phone ----------
async function phone() {
  const book = [['MRS. ODELL', 'odell', () => S.case === 2 && F('c2odell')], ['LUCKY (THE LUKEWARM)', 'lucky', () => F('lucky')], ['DR. SOTO (MORGUE)', 'mira', () => F('morgue')], ['CHIEF VANE', 'chief', () => F('office')], ['SUNDAY\'S FOODS', 'sundays', () => S.case === 1 || F('c2odell')]].filter(b => b[2]());
  const i = await choose(book.map(b => b[0]).concat(['HANG UP']), { x: 10, y: 14, title: 'VIDEOPHONE', cancel: 1 });
  if (i < 0 || i >= book.length) return;
  await (PHONES[book[i][1]] || (() => N('Nobody home.')))();
}
const PHONES = {};

// ---------- boot / title / saves ----------
const asleep = ms => new Promise(r => setTimeout(r, ms));
async function boot() {
  fit(); requestAnimationFrame(loop); scene = { draw() { cls(); } };
  while (!anyKey) await nextFrame();
  await wait(10);
  const lines = ['68K-X SYSTEM ROM  v1.02', 'MEMORY CHECK ........ 4096K OK', 'FD0: NEO MONDAY SOFTWARE  DISK 1/3', 'FM SOUND CHIP ....... OK   PCM ....... OK', 'LOADING MONDAY.SYS'];
  const shown = [];
  scene = { draw() { cls(); shown.forEach((l, i) => text(l, 24, 24 + i * 14, hex('#9affc0'))); if (shown.length === lines.length) { frameR(24, 110, 300, 12, hex('#9affc0')); rectF(26, 112, Math.min(296, (frame % 600) * .9 | 0), 8, hex('#9affc0')); } } };
  for (const l of lines) { shown.push(l); sfx('tick'); await wait(26); }
  for (let i = 0; i < 18; i++) { sfx('step'); await wait(8); }
  await wait(30); await toTitle();
}
async function toTitle() {
  GEN++; S = newState(); STAGE = { art: SCENES.title(), anim: ANIM.title }; music('title'); post.fade = 1; DLG = null; MENUS.length = 0;
  let t = 0;
  scene = { update() { t++; if (!busy && t > 40 && (pressed.a || pressed.start)) { sfx('ok'); run(files); } },
    draw() {
      copyBuf(STAGE.art, 0, 0); STAGE.anim(t);
      const y = 30, w = 'NEO MONDAY', sc = 7, x0 = 46; for (let i = 0; i < 2; i++) bigText(w, x0 + i * 3, y + 3 + i * 3, i ? K.mag : K.ink, sc);
      for (let j = 0; j < 7 * sc; j++) { const c = mix(hex('#fff4c0'), hex('#ff8a30'), j / (7 * sc)); for (let ci = 0; ci < w.length; ci++) { const g = FONT[w[ci]]; if (g) for (let i = 0; i < 5; i++) if (g[(j / sc) | 0] & (16 >> i)) rectF(x0 + ci * 6 * sc + i * sc, y + j, sc, 1, c); } }
      ctext('A  JB  GARFIELD  CASE', 92, K.cyan); ctext('THE CAT WHO KNEW TOO LITTLE', 106, K.white[3]);
      blit(portrait('JB', 'dead'), 16, VH - PH + 8);
      rectF(0, VH, W, H - VH, K.ink); if ((t >> 5) & 1) ctext('PUSH START', VH + 20, UI.hi); ctext('(C)1993 MIDNIGHT MONDAY SOFT.   X68K DISK VERSION', VH + 44, hex('#7a8ac8'));
      ctext('IT IS MONDAY.', VH + 62, hex('#a0a8d8'));
    } };
  await fadeIn(.04);
}
async function files() {
  const sv = fetchStore('neomonday_sav'), meta = fetchStore('neomonday_meta') || { ends: {} }, solved = Object.keys(meta.ends || {}).length > 0, opts = sv ? ['CONTINUE', 'NEW CASE'] : ['NEW CASE'];
  const i = await choose(opts, { x: 190, y: 100, cancel: 1 }); if (i < 0) return;
  if (opts[i] === 'CONTINUE') { await fadeOut(.08); S = Object.assign(newState(), sv); await setStage(S.scene, false); await hub(); return; }
  const cases = ['CASE 1: THE LAYER', solved ? 'CASE 2: THE STATIC' : 'CASE 2: ??? (SOLVE CASE 1)'], c = await choose(cases, { x: 150, y: 100, cancel: 1 }); if (c < 0) return;
  if (c === 1 && !solved) { await N('The file is sealed. Solve the first one first. Cats are famously patient with other cats\' paperwork.'); return; }
  await fadeOut(.08); await (c === 1 ? newCase2() : newGame());
}
async function newGame() {
  S = newState(); DLG = null;
  await diskCard(1);
  await showCard(['NEO MONDAY', '2047', '', 'It is Monday. It is always Monday.', 'It says so in the city charter, page one, right under the part about the weather.'], 0, { col: hex('#ffd24a') });
  await showCard(['COPYCATS', '', 'Machines that kill you, wear your face, and take your seat at the table.', 'Nobody knows how many.', 'The LITTER hunts them.', 'Most of the LITTER is cats. That is a different story.'], 0, { col: hex('#ff6060') });
  await fadeOut(.5); await setStage('freezer', true); post.fade = 1; await fadeIn(.03);
  await SC.freezer.enter(); await hub();
}
async function diskCard(n) {
  music(null); sfx('door'); await showCard(['PLEASE INSERT DISK ' + n, '', 'PRESS A'], 0, { bg: BLACK, fg: hex('#9affc0') });
  for (let i = 0; i < 14; i++) { sfx('step'); await wait(6); }
}
