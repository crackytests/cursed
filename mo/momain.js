'use strict';
// ================= JB GARFIELD: THE MISSING ORIGINAL. boot, title, the phone call, results =================
const MOMETA = fetchStore('mo_meta') || { boots: 0, ends: {} };
const saveMOM = () => store('mo_meta', MOMETA);
const ENDNAME = { record: 'ON THE RECORD', copy: 'THE COPY', erased: 'ERASED', closed: 'CLOSED MONDAYS' };
async function boot() {
  MOMETA.boots++; saveMOM();
  scene = { draw() { cls(BLACK); } };
  while (!anyKey) await nextFrame();
  let t = 0; const cam = mkCam([0, 3.2, -30], [0, 3.2, 0], .8);
  scene = { update() { t++; }, draw() { cls(hex('#000000')); ZD.fill(0); LIVE.cam = cam; LIVE.ox = 0; LIVE.oy = 0; LIVE.clip = null; const k = Math.min(1, t / 90);
    drawVox('PRETEND', [0, 4.6, 0], -.9 + k * .9 + Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [210, 210, 210], VLIGHT); drawVox('CO.', [0, 1.2, 0], .9 - k * .9 - Math.sin(t * .02) * .06, .36 * (.4 + k * .6), [220, 40, 30], VLIGHT);
    if (t > 110) ctext('(R)', 190, UI.dim); } };
  post.fade = 1; await fadeIn(.06); await wait(110); sfx('ok'); speak('Pretend co!', { pitch: .9 }); await wait(70);
  await fadeOut(.06);
  scene = { draw() { cls(hex('#000000')); ctext('HYPER-32', 56, hex('#e8e8e4'), BLACK, 2); ctext('THIS CARTRIDGE CONTAINS THE', 100, UI.text); ctext('POLY-FX CHIP', 112, hex('#ff3a2a')); ctext('THIS GAME CONTAINS SCENES OF', 138, UI.dim); ctext('EXPLICIT NOIR.', 150, UI.dim); } };
  await fadeIn(.06); await wait(150); await fadeOut(.06);
  scene = { draw() { cls(BLACK); } }; post.fade = 0;
  run(titleScreen3);
}
async function titleScreen3() {
  const sv = fetchStore(MOSAVE), suspended = readSuspend(), done = Object.keys(MOMETA.ends).length > 0;
  post.fade = 1; post.shake = 0; post.flash = 0; post.wave = 0; WX.hold = 0; DLG = null; MENUS.length = 0; CARD = null; music('mo_title');
  let t = 0; const cam = mkCam([0, 1.1, -4.2], [0, 1.0, 0], .8), L = { amb: [.25, .25, .27], dir: v3.norm([.6, .5, -.6]), dcol: [.9, .7, .5], tint: [0, 0, 0] };
  scene = { update() { t++; }, draw() {
    cls(hex('#000000')); for (let y = 150; y < H; y++) rectF(0, y, W, 1, rgb(10 + (y - 150) * .2, 10 + (y - 150) * .2, 12 + (y - 150) * .2));
    if (((t >> 3) % 37) !== 0) { rectF(214, 40, 88, 14, hex('#3a0806')); text('WE KEEP YOU.', 222, 44, hex('#e81818'), hex('#3a0806')); }
    ZD.fill(0); LIVE.cam = cam; LIVE.ox = 0; LIVE.oy = 0; LIVE.clip = null;
    drawGlitch(MOM.jb, { p: [-1.1, 0, 1.2], yaw: .5 + Math.sin(t * .01) * .08, pose: { armL: -.15, armR: -.15, headYaw: Math.sin(t * .013) * .3 } }, L, ((t % 300) < 6) ? .5 : 0);
    rainFX(60, 1.2);
    text('JB GARFIELD', 150, 96, hex('#ff9a3a'), hex('#000000'), 2); text('THE MISSING', 150, 122, hex('#e8e8e4'), hex('#000000'), 2); text('ORIGINAL', 150, 142, hex('#e8e8e4'), hex('#000000'), 2);
    if ((t >> 5) & 1) ctext('PUSH START', 186, WHITE);
    ctext('(C)2003 PRETEND CO.  ' + (done ? 'CASE CLOSED' : 'CASE OPEN'), 208, UI.dim);
  } };
  await fadeIn(.05);
  await nextFrame(); while (!(pressed.start || pressed.a)) await nextFrame();
  sfx('ok');
  const opts = (suspended ? ['RESUME SUSPENDED CASE'] : []).concat(sv ? ['CONTINUE CASE'] : []).concat(['NEW GAME']).concat(done ? ['ENDINGS SEEN'] : []);
  const i = await choose(opts, { x: 96, y: 150, cancel: 1 });
  if (i < 0) return titleScreen3();
  if (opts[i] === 'RESUME SUSPENDED CASE') { await fadeOut(.06); if (await resumeSuspend(suspended)) return; return titleScreen3(); }
  if (opts[i] === 'CONTINUE CASE') {
    if (suspended && (await ask('CONTINUE THE TERMINAL BACKUP? SUSPENDED PROGRESS WILL BE DISCARDED.', null, ['NO', 'YES'])) !== 1) return titleScreen3();
    if (suspended) { try { localStorage.removeItem(MOSUSPEND); } catch (e) { await say('COULD NOT DISCARD SUSPEND. Both saved cases are still available.'); return titleScreen3(); } }
    await fadeOut(.06); return restoreGame(sv, false);
  }
  if (opts[i] === 'ENDINGS SEEN') { await showCard(['ENDINGS SEEN', '', ...Object.keys(ENDNAME).map(k => (MOMETA.ends[k] ? '* ' : '- ') + ENDNAME[k])], 0); return titleScreen3(); }
  if (sv || suspended) { const c = await ask('START A NEW CASE? YOUR SAVED CASE WILL BE ERASED.', null, ['NO', 'YES']); if (c !== 1) return titleScreen3(); }
  await fadeOut(.06); newGameMO();
}
async function newGameMO() {
  MO = C3 = newMO(); try { localStorage.removeItem(MOSAVE); localStorage.removeItem(MOSUSPEND); } catch (e) {}
  CARL.dead = CARL.inv = CARL.fire = CARL.sap = CARL.reload = CARL.reloadNext = CARL.aim = 0; CARL.target = null; CARL.p[1] = 0; WX.hold = 1;
  scene = { draw() { cls(hex('#000000')); } }; post.fade = 0; music('mo_rain');
  const d = await ask('HOW DO YOU TAKE YOUR NOIR?', null, ['WITH CREAM  (EASY)', 'BLACK  (NORMAL)', 'MONDAY  (HARD)']); MO.diff = d < 0 ? 1 : d;
  await showCard(['', 'SUNDAY.', '11:52 PM.'], 120, { fg: hex('#e8e8e4') });
  await say('The call came in at 11:52 on a Sunday. Eight minutes before my day off.', NARR);
  sfx('ring'); await wait(50);
  await say('Mr. Garfield? My name is Ruby Keel. My uncle Otis looks after the old Meridian place, out past the reservoir. He calls me every Sunday. He didn\'t call last Sunday. He didn\'t call tonight.', RU);
  await jb('Have you called the police?');
  await say('They said the building\'s been closed for years and nobody\'s in it. I said that isn\'t true. Otis is in it.', RU);
  await say('She had the gate code, a photo of a man in a cardigan, and a voice that had been calm for nine days and was tired of it.', NARR);
  await say('Please. Tonight.', RU); await jb('It\'s almost Monday.'); await say('Is that a problem?', RU); await jb('Only for me.');
  enterRoom('steps', MO.x, MO.z, MO.yaw); WX.banner = null; scene = moWorld; await fadeIn(.03);
  await say('By the time I parked, it was Monday. The Meridian Continuity Center sat in the rain like it was waiting for a ride.', NARR);
  await yokoSay([[YO, 'Radio check.'], ['JB', 'I hear you.'], [YO, 'You said you\'d call every half hour. I\'m setting a timer.'], ['JB', 'Set two.']]);
  await say('CONTROLS: UP WALKS, LEFT/RIGHT TURN, X RUNS, DOWN+X TURNS AROUND. Z EXAMINES. HOLD C ON ONE TARGET TO STEADY THE SIGHT; LEFT/RIGHT SWITCH TARGETS; Z FIRES. ENTER: INVENTORY. SHIFT: MAP.', null);
  WX.hold = 0;
}
async function results(k) {
  MOMETA.ends[k] = 1; saveMOM(); try { localStorage.removeItem(MOSAVE); localStorage.removeItem(MOSUSPEND); } catch (e) {}
  const mins = Math.floor(MO.time / 3600), secs = Math.floor(MO.time / 60) % 60, m = MO.mem;
  const pts = (k === 'record' ? 2 : 1) + (mins < 120 ? 1 : 0) + (MO.saves <= 6 ? 1 : 0) + ((MO.restores || 0) === 0 ? 1 : 0) + (F('maggieGiven') ? 1 : 0) + dk() - 1, rank = k === 'closed' ? '?' : pts >= 5 ? 'S' : pts >= 4 ? 'A' : pts >= 3 ? 'B' : 'C';
  music('mo_end'); scene = { draw() { cls(hex('#000000')); } }; post.fade = 0;
  await showCard([ENDNAME[k], 'NOIR: ' + DIFF[dk()], '', 'TIME  ' + mins + ':' + String(secs).padStart(2, '0'), 'BACKUPS MADE  ' + MO.saves, 'RESTORED FROM BACKUP  ' + (MO.restores || 0), 'BACKUPS DELETED  ' + MO.kills, 'THEATER SEATED AGAIN  ' + (F('audiencePreserved') || 0),
    'WHOSE MEMORY  MINE ' + m.mine + '  FACE ' + m.face + '  DON\'T KNOW ' + m.unk, '', 'RANK  ' + rank], 0, { fg: hex('#e8e8e4') });
  const note = { record: ['THE VOICE CAME BACK.', 'HE EARNED IT.'], copy: ['THE CASE IS CLOSED.', 'THE SUSPECT IS NOT CLEARED.'], erased: ['SUBJECT 41 IS NOT RUNNING.', 'SOMEBODY IS STILL NARRATING.'], closed: ['THERE IS ALWAYS NEXT FRIDAY.'] }[k];
  await showCard(['', ...note, '', (MO.restores || 0) ? 'YOU RESTORED HIM ' + MO.restores + ' TIME' + (MO.restores === 1 ? '' : 'S') + '.' : 'YOU NEVER HAD TO RESTORE HIM.', (MO.restores || 0) ? 'WHICH ONE CAME OUT?' : 'AS FAR AS YOU KNOW.'], 0, { fg: hex('#ff9a3a') });
  MO = C3 = null; return titleScreen3();
}
