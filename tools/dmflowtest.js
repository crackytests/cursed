// DARK MONDAY flow visibility tests (node tools/dmflowtest.js): stairs, the disk swap and every level change must leave the screen visible and the party free to move
const X = require('./dmvm.js');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const mk = async (lv, x, y, dir) => { const ctx = X.load(), R = s => X.R(ctx, s); R(`anyKey = true; newGame(${lv}, ['CARL','LINDA','JB','FACE'], true); scene = worldScene; GM.x = ${x}; GM.y = ${y}; GM.dir = ${dir}; GM.lv.mobs = [];`); return [ctx, R]; };
const lit = R => R('(() => { let n = 0; for (let i = 0; i < SCREEN.length; i += 37) if (SCREEN[i] !== 0xff000000 && ((SCREEN[i] & 0xffffff) !== 0x0c0406 && (SCREEN[i] & 0xffffff) !== 0x060406)) n++; return n; })()');
const clearTalk = async (ctx, R) => { for (let k = 0; k < 600 && R('!!DLG || !!MENUS.length || !!CARD || GM.hold'); k++) { R('kb.a = ' + (k % 6 === 0 ? 1 : 0)); await X.step(ctx, 1); } R('kb.a = 0'); };
(async () => {
  // level 1 -> 2: no disk swap
  let [c, R] = await mk(1, 14, 14, 2); R('startMove(0)'); await X.step(c, 200); ok(R('GM.n') === 2 && R('post.fade') < .05 && R('GM.hold') === 0, 'level 1 stairs land in level 2 with the screen back (fade ' + R('post.fade') + ')');
  // level 2 -> 3: the disk card shows, is visible, then level 3 appears
  [c, R] = await mk(2, 14, 19, 2); R('startMove(0)'); let sawDisk = false, diskLit = 0, diskFade = 9;
  for (let f = 0; f < 900 && !sawDisk; f++) { await X.step(c, 1); if (R('CARD ? CARD.lines[0] : ""').startsWith('PLEASE INSERT DISK')) { sawDisk = true; await X.step(c, 2); diskLit = lit(R); diskFade = R('post.fade'); } }
  ok(sawDisk, 'level 2 stairs show the INSERT DISK card'); ok(diskFade < .05 && diskLit > 20, 'the disk card is visible (fade ' + diskFade + ', lit ' + diskLit + ')');
  for (let k = 0; k < 900 && R('GM.n') !== 3; k++) { R('kb.a = ' + (k % 8 === 0 ? 1 : 0)); await X.step(c, 1); } R('kb.a = 0'); await X.step(c, 40);
  ok(R('GM.n') === 3 && R('post.fade') < .05, 'then the Server Crypt appears (fade ' + R('post.fade') + ', level ' + R('GM.n') + ')'); await clearTalk(c, R); ok(R('GM.hold') === 0 && !R('CARD'), 'and the party is free to move');
  // level 3 -> 4
  [c, R] = await mk(3, 20, 20, 1); R('startMove(0)'); for (let k = 0; k < 400 && R('GM.n') !== 4; k++) await X.step(c, 1); await X.step(c, 60);
  ok(R('GM.n') === 4 && R('post.fade') < .05, 'level 3 stairs land in the Sanctum (fade ' + R('post.fade') + ')'); await clearTalk(c, R); ok(lit(R) > 200, 'and the Sanctum is drawn (lit ' + lit(R) + ')');
  // the endings draw their cards visibly
  [c, R] = await mk(4, 17, 12, 2); R("fireTrig(GM, { scene: 'endCollect' }, 'x')"); let sawCard = 0, cardLit = 0;
  for (let f = 0; f < 600 && !sawCard; f++) { await X.step(c, 1); if (R('!!CARD')) { sawCard = 1; await X.step(c, 2); cardLit = lit(R); } }
  ok(sawCard && R('post.fade') < .05 && cardLit > 20, 'the ending card is visible (fade ' + R('post.fade') + ', lit ' + cardLit + ')');
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
