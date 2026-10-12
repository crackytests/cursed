'use strict';
// ================= DARK MONDAY: boot, title, party select, intro, disk swaps =================
function bigText(s, x, y, c, sc = 3, sh) { // the 5x7 font drawn big, with an optional drop shadow
  for (let pass = 0; pass < (sh ? 2 : 1); pass++) { let xx = x; for (const ch of s) { const g = FONT[ch]; if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) rectF(xx + i * sc + (pass === 0 && sh ? sc : 0), y + j * sc + (pass === 0 && sh ? sc : 0), sc, sc, pass === 0 && sh ? sh : c); xx += 6 * sc; } }
}
const bigW = (s, sc) => s.length * 6 * sc;

// ---------- boot ----------
async function boot() {
  fit(); requestAnimationFrame(loop); let w0 = 0; scene = { update() { w0++; }, draw() { cls(); if ((w0 >> 5) & 1) ctext('PRESS ANY KEY', 120, hex('#4a5a9a')); ctext('PRETEND CO. SOFT  X68K DISK 1/3', 236, hex('#2a3260')); } };
  while (!anyKey) await nextFrame();
  await wait(10);
  const lines = ['68K-X SYSTEM ROM  v1.02', 'MEMORY CHECK ........ 4096K OK', 'FD0: PRETEND CO. SOFT  DISK 1/3', 'FM SOUND CHIP ....... OK   PCM ....... OK', 'LOADING DARKMONDAY.SYS'], shown = [];
  scene = { draw() { cls(); shown.forEach((l, i) => text(l, 24, 24 + i * 14, hex('#9affc0'))); if (shown.length === lines.length) { frameR(24, 110, 300, 12, hex('#9affc0')); rectF(26, 112, Math.min(296, (frame % 600) * 1.6), 8, hex('#9affc0')); } } };
  for (const l of lines) { shown.push(l); sfx('tick'); await wait(26); }
  for (let i = 0; i < 18; i++) { sfx('step'); await wait(8); }
  await wait(20); await fadeOut(.08); await protection(); post.fade = 1;
  scene = { draw() { cls(hex('#06040e')); ctext('PRETEND CO. SOFT', 100, WHITE, null, 256); ctext('PRESENTS', 120, hex('#7a8ac8')); } }; await fadeIn(.06); sfx('ok'); await wait(90); await fadeOut(.06);
  await titleScreen();
}
async function titleScreen() {
  GM = null; music('title'); DLG = null; MENUS.length = 0; post.fade = 1; post.shake = 0; let t = 0;
  scene = { update() { t++; }, draw() {
    cls(hex('#02010a')); gridFloor(150, hex('#4a1a7a'), t); drawEye(256, 88, 30, t);
    const w = 'BEHOLDEN II', sc = 4, x = (W - bigW(w, sc)) / 2; ctext('EYE OF THE', 14, hex('#ff9a20'), BLACK); bigText(w, x, 150 - 4, hex('#20e0ff'), sc, hex('#d020b0'));
    ctext('THE LEGEND OF DARK MONDAY', 188, hex('#ffe040'), BLACK);
    if ((t >> 5) & 1) ctext('PUSH START', 212, WHITE, BLACK); ctext('(C)1992 PRETEND CO. SOFT.  X68K DISK VERSION.  NOT AFFILIATED WITH ANY BEHOLDER.', 242, hex('#6a7cc8'));
  } };
  await fadeIn(.04);
  for (;;) {
    await nextFrame(); if (!(pressed.a || pressed.start || MOUSE.click)) continue; MOUSE.click = 0; sfx('ok');
    const opts = ['NEW GAME'].concat(hasSave() ? ['CONTINUE'] : [], ['MANUAL', 'OPTIONS', 'ENDINGS']);
    const i = await choose(opts, { x: 392, y: 90, cancel: 1 }); if (i < 0) continue;
    if (opts[i] === 'MANUAL') { await manual(0); continue; } if (opts[i] === 'OPTIONS') { await optionsMenu(); continue; } if (opts[i] === 'ENDINGS') { await endingsList(); continue; }
    if (opts[i] === 'CONTINUE') { const s = await choose([0, 1, 2].map(k => 'SLOT ' + (k + 1) + (fetchStore('dm_save' + k) ? '' : '  (EMPTY)')), { x: 340, y: 90, cancel: 1 }); if (s < 0) continue; await fadeOut(.06); if (loadGame(s)) { scene = worldScene; await fadeIn(.06); banner(GM.lv.name, 120); return; } await fadeIn(.06); continue; }
    const ids = await partySelect(); if (!ids) continue;
    await fadeOut(.06); await intro(ids); await startRun(ids); return;
  }
}
async function startRun(ids) {
  music(null); newGame(1, ids, true); scene = worldScene; post.fade = 1; await fadeIn(.05); banner(GM.lv.name, 160);
  const lv = GM.lv; fireTrig(GM, lv.trig.step[GM.x + ',' + GM.y], 'step' + GM.x + ',' + GM.y);
}

// ---------- party select ----------
const SELECT_BLURB = {
  CARL: ['FIGHTER. HITS HARD.', 'CARRIES THE PILLS.', 'IS HUMAN.'], LINDA: ['MAGE. MEMO, SYNERGY,', 'LAYOFFS. WILL TELL YOU', 'WHAT YOU DID WRONG.'], GHOST: ['ROGUE-MAGE. SCARE,', 'PHASE, ENTRANCE.', 'DOES THE VOICE.'],
  JB: ['RANGER. FINDS HIDDEN', 'DOORS. LOVES LASAGNA.', 'FEDORA.'], FACE: ['CLERIC. BACKUP, PATCH,', 'REBOOT. WHAT DOES THIS', 'DO?'], YOKO: ['MAGE-CLERIC. READS THE', 'GLYPHS. HEALS. SPEEDS', 'EVERYONE UP.'],
};
function partySelect() {
  return new Promise(res => {
    const ids = ['CARL', 'LINDA', 'GHOST', 'JB', 'FACE', 'YOKO'], pick = []; let cur = 0, t = 0;
    const rect = i => ({ x: 14 + (i % 2) * 246, y: 34 + ((i / 2) | 0) * 68, w: 240, h: 64 });
    const done = ok => { scene = null; res(ok); };
    scene = { update() {
      t++;
      const dir = pressed.left ? -1 : pressed.right ? 1 : 0, vr = pressed.up ? -2 : pressed.down ? 2 : 0; if (dir || vr) { cur = clamp(cur + dir + vr, 0, 5); sfx('move'); }
      if (MOUSE.on) ids.forEach((id, i) => { const r = rect(i); if (hit(r.x, r.y, r.w, r.h)) cur = i; });
      const click = MOUSE.click; MOUSE.click = 0; const a = pressed.a || (click && ids.some((id, i) => { const r = rect(i); return hit(r.x, r.y, r.w, r.h); }));
      if (a) { const k = pick.indexOf(ids[cur]); if (k >= 0) pick.splice(k, 1); else if (pick.length < 4) pick.push(ids[cur]); else sfx('bump'); sfx('tick'); }
      if (pressed.start || (click && pick.length === 4 && hit(190, 238, 132, 14))) { if (pick.length === 4) { sfx('ok'); done(pick.slice()); } else sfx('bump'); }
      if (pressed.b) done(null);
    }, draw() {
      cls(hex('#02010a')); panel(4, 4, W - 8, H - 8); ctext('CHOOSE YOUR PARTY', 12, hex('#ffe040')); ctext('PICK FOUR. THE FIRST TWO FIGHT IN FRONT.', 22, hex('#6a7cc8'));
      ids.forEach((id, i) => { const r = rect(i), sel = pick.indexOf(id); panel(r.x, r.y, r.w, r.h, i === cur ? hex('#2a2a70') : null); blit(smallPort(id, 48, 56), r.x + 6, r.y + 4);
        text(ROSTER[id].name, r.x + 62, r.y + 8, hex(ROSTER[id].col)); (SELECT_BLURB[id] || []).forEach((l, j) => text(l, r.x + 62, r.y + 22 + j * 11, hex('#a8b8ff')));
        if (sel >= 0) { rectF(r.x + r.w - 74, r.y + 6, 68, 12, hex('#20e0ff')); text(sel < 2 ? 'FRONT ' + (sel + 1) : 'BACK ' + (sel - 1), r.x + r.w - 70, r.y + 8, BLACK, null); } });
      ctext('PARTY ' + pick.length + '/4', 238, pick.length === 4 ? hex('#7affb0') : hex('#6a7cc8')); if (pick.length === 4 && ((t >> 4) & 1)) ctext('PRESS START', 226, WHITE);
      text('A: CHOOSE   START: GO   X: BACK', 14, 242, hex('#6a7cc8')); drawCursor();
    } };
  });
}

// ---------- intro and disk swaps ----------
async function intro(ids) {
  if (ids) INTRO_PARTY = ids; music('title'); post.fade = 1; backdrop('desert'); await fadeIn(.05);
  await N('IT HAS BEEN A MONDAY FOR AS LONG AS ANYBODY CAN CHECK.');
  await N('OUT PAST THE LAST EXIT IN THE NEVADA DESERT, ONE LIGHT IS STILL ON.');
  backdrop('diner'); await N('GARF\'S DINER IS OPEN TWENTY-FOUR HOURS. THE LASAGNA IS A FOOD GROUP.');
  backdrop('inside'); await N('ON SUNDAY NIGHT, THE FREEZER STARTED TO HUM.'); await say('IT IS NOT SUPPOSED TO DO THAT.', 'GARF');
  backdrop('door'); await N('UNDER THE FREEZER, A DOOR WAS THERE THAT WASN\'T THERE ON SATURDAY.');
  await N('PEOPLE WHO GO DOWN COME BACK ON A MONDAY, OWING MONEY TO NOBODY.'); await say('SOMEBODY HAS TO GO LOOK.', 'GARF');
  const names = INTRO_PARTY.map(id => ROSTER[id].name), who = names.length > 1 ? names.slice(0, -1).join(', ') + ' AND ' + names[names.length - 1] : names[0];
  backdrop('party'); await N('IT IS GOING TO BE ' + who + '.');
  backdrop('vista'); await N('DOWN THERE, SOMETHING HAS BEEN KEEPING COUNT.');
  await showCard(['NOTICE FROM THE SEQUEL COMMITTEE', '', 'THE TEMPLE OF DARK MONDAY', 'HAS BEEN ASSIGNED A SEQUEL.', '', 'PLEASE SURVIVE.'], 0, { fg: hex('#ffe040') });
  backdrop('stairs'); await wait(50); await fadeOut(.05);
}
async function diskSwap(n) {
  post.fade = 0; music(null); sfx('door'); // the cards draw their own black, so the fade must be off or they are invisible
  await showCard(['PLEASE INSERT DISK ' + n, '', 'PRESS Z'], 0, { bg: BLACK, fg: hex('#9affc0') });
  let p = 0; scene = { draw() { cls(); text('FD0: PRETEND CO. SOFT  DISK ' + n + '/3', 24, 24, hex('#9affc0')); text('READING ......', 24, 40, hex('#9affc0')); frameR(24, 60, 300, 12, hex('#9affc0')); rectF(26, 62, Math.min(296, p * 296), 8, hex('#9affc0')); } };
  for (let i = 0; i < 50; i++) { p += (i % 7 === 3 ? .0 : .02); sfx('step'); await wait(i % 9 === 4 ? 24 : 5); } p = 1; await wait(20);
  scene = worldScene; post.fade = 1;
}
async function endOfDemo() {
  post.fade = 0; music(null); await showCard(['END OF DISK ' + (GM ? GM.disk : 1), '', 'TO BE CONTINUED'], 0, { fg: hex('#ffe040') }); await titleScreen();
}
boot();
