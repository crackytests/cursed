'use strict';
// ================= STICK UP: the rest of the city indoors. hospital, police station, casinos, houses, warehouses =================
const iRand = seed => { let s = (seed | 0) || 1; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; };
async function nurseCheckup() {
  if (SU.inMission) return; SU.cut = 1;
  const c = await ask('Check-up is $50. It is the same pills every time. They are free if you bleed on the floor.', 'NURSE', ['CHECK-UP ($50)', 'NOT NOW']);
  if (c === 0) { if (SU.cash < 50) await say('You have $' + SU.cash + '. Come back after a stick-up. We will pretend we did not hear that.', 'NURSE'); else { SU.cash -= 50; await fadeOut(.08); sfx('flush'); await wait(40); SU.hp = 100; if (!SU.tripLock) SU.trip = Math.min(SU.trip, .15); await fadeIn(.08); pop(PL.x, PL.y, 'PATCHED UP', '#9fe0ff'); } }
  SU.cut = 0;
}
async function slotsPlay() {
  if (SU.cut || SU.inMission) return;
  if (SU.cash < 50) { pop(PL.x, PL.y, 'SLOTS: $50 A PULL', '#ffdb49'); return; }
  SU.cash -= 50; SU.cut = 1; const sym = ['7', 'BAR', 'STICK', 'EYE', 'Z'];
  for (let i = 0; i < 8; i++) { sfx('tick'); pop(PL.x, PL.y - 6, pick(sym) + ' ' + pick(sym) + ' ' + pick(sym), '#9fb8ff'); await wait(7); }
  const r = Math.random(), a = pick(sym); let win = 0, line;
  if (r < .03) { win = 2000; line = '7 7 7'; } else if (r < .12) { win = 400; line = a + ' ' + a + ' ' + a; } else if (r < .3) { win = 100; line = a + ' ' + a + ' ' + pick(sym.filter(s => s !== a)); } else { const t = sym.slice().sort(() => Math.random() - .5); line = t[0] + ' ' + t[1] + ' ' + t[2]; }
  await wait(10); SU.cut = 0;
  if (win) { SU.cash += win; sfx('get'); pop(PL.x, PL.y, line + '  WIN $' + win, '#6dff92'); if (win >= 2000) bigText('JACKPOT', '#ffdb49', 150, '$2000. THE STICK BROUGHT LUCK.'); } else pop(PL.x, PL.y, line + '  NO.', '#ff6d6d');
}
async function robCasino(RM) {
  if (SU.inMission || SU.cut) return;
  if ((RM.robbed || 0) > frame) { pop(PL.x, PL.y, 'THE CAGE IS EMPTY. (YOU ROBBED IT.)', '#ffdb49'); return; }
  SU.cut = 1; await say('This is a stick up. Put the chips in the bag. All the chips.', 'CARL'); await say(pick(['That is a stick.', 'Security! ...Security is on break.', 'Do you want the comp drink or the cash?']), 'CASHIER'); SU.cut = 0;
  const n = 500 + rnd(700); SU.cash += n; pop(PL.x, PL.y, '$' + n, '#6dff92'); RM.robbed = frame + 60 * 150; SU.stat.stickups++; crime(26, PL.x, PL.y, 1);
}
function iHospital(ix, iy) {
  const R = iShell('HOSPITAL', ix, iy, 5, 3, { z: 64, wall: '#f0f0f0', roof: '#dbdbdb', sign: '+', inner: '#b6c8c8', floor: 'hospital' });
  iPart(R, 104, 6, 6, 34); iPart(R, 104, 62, 6, 28);
  iProp(R, 'counterW', 14, 24, 54, 10); iProp(R, 'bench', 12, 60, 36, 8); iProp(R, 'plant', 8, 76, 10, 10); iProp(R, 'plant', 90, 40, 10, 10);
  iProp(R, 'hbed', 112, 10, 16, 30); iProp(R, 'hbed', 134, 10, 16, 30); iProp(R, 'hbed', 112, 54, 16, 30); iProp(R, 'hbed', 134, 54, 16, 30);
  iFolk(R, 41, 16, { role: 'nurse', who: 'NURSE', sh: '#9fe0ff', hat: '#b6b6b6', mode: 'face', onHold: heldUp(['THE REGISTER IS A DRAWER OF PILLS.', 'I HAVE SEEN WORSE THINGS ARRIVE ON GURNEYS.', 'PLEASE DO NOT STICK THE PATIENTS.']) });
  iFolk(R, 30, 46, { sh: '#6d9ac0' }); iFolk(R, 126, 47, { sh: '#6d9ac0' });
  iPoi(R, 41, 40, 'NURSE', () => nurseCheckup());
  place('hosp', ix + 2, iy + 3); place('hospBed', ix, iy); PLACES.hospBed.x = R.x + 131; PLACES.hospBed.y = R.y + 47;
}
function iPolice(ix, iy) {
  const R = iShell('POLICE', ix, iy, 5, 3, { z: 50, wall: '#24496d', roof: '#2449b6', sign: 'POLICE', inner: '#8a9ab0', floor: 'lino' });
  iProp(R, 'bars', 110, 6, 4, 38); iProp(R, 'bars', 110, 62, 4, 28); iProp(R, 'bars', 114, 34, 40, 4);
  iProp(R, 'bench', 120, 12, 30, 8); iProp(R, 'bench', 120, 70, 30, 8);
  iProp(R, 'counterW', 44, 34, 60, 10); iProp(R, 'cabinet', 10, 8, 14, 30); iProp(R, 'board', 30, 7, 50, 6); iProp(R, 'plant', 8, 74, 10, 10);
  iFolk(R, 74, 26, { role: 'sergeant', who: 'DESK SERGEANT', sh: '#24246d', hat: '#101024', mode: 'face', onHold: q => { pop(q.x, q.y - 10, "THAT'S A STICK. THAT'S A... STICK. HELP.", '#9fb8ff'); crime(12, q.x, q.y, 1); } });
  iFolk(R, 40, 56, { sh: '#24246d', hat: '#101024' }); iFolk(R, 134, 27, { sh: '#24b649', mode: 'wander' });
  iPoi(R, 74, 52, 'WANTED BOARD', () => pop(PL.x, PL.y, pick(['WANTED: CARL. SKI MASK. "FASHION."', 'WANTED: A MAN WITH A STICK', 'REWARD: ONE (1) STICK', 'WANTED: GHOST (DEAD) (STILL)']), '#9fb8ff'));
  place('cops', ix + 2, iy + 3); place('cell', ix, iy); PLACES.cell.x = R.x + 134; PLACES.cell.y = R.y + 60;
}
function iCasino(ix, iy, depth, z, wall, roof, name) {
  const R = iShell(name, ix, iy, 5, 3, { z, wall, roof, sign: name, neon: 1, inner: '#8a6a5a', floor: 'redcarpet', doorW: 34 });
  [10, 26, 42, 58].forEach((x, i) => iProp(R, 'slot', x, 7, 12, 9, { seed: i })); [100, 116, 132, 146].forEach((x, i) => iProp(R, 'slot', x, 7, 12, 9, { seed: i + 4 }));
  iProp(R, 'bars', 62, 7, 36, 5); iProp(R, 'counterW', 62, 20, 36, 10); iProp(R, 'roulette', 20, 44, 40, 28); iProp(R, 'roulette', 100, 44, 40, 28);
  iFolk(R, 80, 15, { role: 'cashier', who: 'CASHIER', sh: '#24246d', hat: '#ffdb49', mode: 'face', onHold: () => robCasino(R) });
  iFolk(R, 36, 80, { sh: '#db2424' }); iFolk(R, 120, 80, { sh: '#2492db' }); iFolk(R, 80, 56, { sh: '#924992' });
  iPoi(R, 34, 28, 'PLAY SLOTS ($50)', () => slotsPlay()); iPoi(R, 124, 28, 'PLAY SLOTS ($50)', () => slotsPlay());
  return R;
}
function iHouse(tx, ty, tw, th, z, wall, roof, kind) {
  const r = iRand(tx * 131 + ty * 977), big = kind === 'mansion';
  const R = iShell(big ? 'MANSION' : 'HOUSE', tx, ty, tw, th, { z, wall, roof, inner: ['#b69a6d', '#a8b4c0', '#b6a6c8', '#c8b0a0'][(r() * 4) | 0], floor: big ? 'marble' : ['wood', 'carpet', 'lino'][(r() * 3) | 0], doorW: 24 });
  const plan = (r() * 3) | 0;
  if (big) {
    iRug(R, 14, 24, 40, 22, '#6a2a3a', '#dbb649');
    iProp(R, 'couch', 8, 10, 40, 12, { back: 'n' }); iProp(R, 'tv', 56, 8, 30, 8); iProp(R, 'table', 20, 28, 26, 12); iProp(R, 'plant', 8, 44, 10, 10); iProp(R, 'plant', 76, 44, 10, 10);
  } else if (plan === 0) { iProp(R, 'bed', 8, 8, 22, 34); iProp(R, 'cabinet', 38, 8, 18, 8); iProp(R, 'plant', 44, 28, 10, 10); }
  else if (plan === 1) { iProp(R, 'couch', 8, 8, 34, 10, { back: 'n' }); iProp(R, 'tv', 44, 24, 8, 18); iProp(R, 'table', 14, 24, 20, 10); }
  else { iProp(R, 'kitchen', 8, 7, 48, 10); iProp(R, 'table', 14, 26, 22, 14); iProp(R, 'fridge', 44, 22, 12, 10); }
  const spot = [[24, 48], [40, 48], [32, 44], [20, 36], [44, 36], [60, 46], [76, 46], [30, 50]].find(([x, y]) => x < R.w - 10 && pedOK(R.x + x, R.y + y));
  if (spot && r() < .7) iFolk(R, spot[0], spot[1], { sh: pick(SHIRTS), mode: r() < .5 ? 'wander' : 'face' });
  return R;
}
function iWarehouse(ix, iy, depth, z, wall, roof) {
  const r = iRand(ix * 53 + iy * 311), R = iShell('WAREHOUSE', ix, iy, 5, 3, { z, wall, roof, inner: '#9a9a8a', floor: 'conc', door: 2, doorW: 44 });
  for (let n = 0; n < 8; n++) { const w = 12 + ((r() * 8) | 0), h = 10 + ((r() * 6) | 0), x = 10 + ((r() * 120) | 0), y = 8 + ((r() * 46) | 0); if (x + w > 150 || (x + w > 54 && x < 106 && y + h > 44)) continue; iProp(R, 'crate', x, y, w, h); }
  iProp(R, 'shelf', 10, 7, 60, 6, { seed: 3 }); iProp(R, 'shelf', 90, 7, 60, 6, { seed: 5 });
  iFolk(R, 60, 66, { sh: '#db9224', hat: '#dbb624', mode: 'wander' }); iFolk(R, 108, 60, { sh: '#6d6d6d', hat: '#dbb624', mode: 'wander' });
  return R;
}
