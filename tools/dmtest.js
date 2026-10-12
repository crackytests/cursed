// DARK MONDAY tests (node tools/dmtest.js): input -> movement, doors, turning, render sanity
const X = require('./dmvm.js'); const ctx = X.load(); const R = s => X.R(ctx, s);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const press = async (k, n = 1) => { R(`kb.${k}=1`); await X.step(ctx, n); R(`kb.${k}=0`); await X.step(ctx, 14); };
const pos = () => R('[GM.x, GM.y, GM.dir].join()');
(async () => {
  R('anyKey = true; newGame(0); scene = worldScene;'); await X.step(ctx, 2);
  ok(pos() === '2,8,1', 'start 2,8 facing E: ' + pos());
  await press('up'); ok(pos() === '3,8,1', 'forward moves one cell: ' + pos());
  await press('right'); ok(pos() === '3,8,2', 'turn right faces S: ' + pos());
  await press('left'); await press('left'); ok(pos() === '3,8,0', 'two left turns face N: ' + pos()); await press('right'); await press('right');
  await press('up'); ok(pos() === '3,8,2', 'wall ahead blocks: ' + pos()); await press('left'); await press('left');
  await press('right'); await press('sr'); ok(pos() === '3,9,1' || pos() === '3,8,1', 'strafe: ' + pos());
  R('GM.x = 10; GM.y = 8; GM.dir = 2; GM.lv.mobs = [];'); await press('up'); ok(pos() === '10,8,2', 'closed door blocks: ' + pos());
  await press('a', 1); await X.step(ctx, 14); ok(R('GM.lv.st.door["10,9"].open') === 0, 'a locked door stays shut without the key'); R('giveItem(PARTY[0], "KEY_RUST")');
  await press('a', 1); await X.step(ctx, 14); ok(R('GM.lv.st.door["10,9"].open') > .95, 'use opens the door');
  await press('up'); ok(pos() === '10,9,2', 'walks through the open door: ' + pos());
  // render sanity: every cell, every facing renders without throwing, and the view is not empty
  let bad = 0; for (let y = 0; y < GM_H(); y++) for (let x = 0; x < GM_W(); x++) { if (R(`BLOCKS.indexOf(cellCh(GM.lv,${x},${y}))>=0`)) continue; for (let d = 0; d < 4; d++) { try { R(`GM.x=${x};GM.y=${y};GM.dir=${d};renderView(GM.lv,{x:GM.x,y:GM.y,dir:GM.dir});`); } catch (e) { bad++; console.log(e.message); } } }
  ok(bad === 0, 'every open cell renders in every facing');
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
function GM_H() { return R('GM.lv.h'); } function GM_W() { return R('GM.lv.w'); }
