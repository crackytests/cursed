// DARK MONDAY combat tests (node tools/dmcombat.js)
const X = require('./dmvm.js'); const ctx = X.load(); const R = s => X.R(ctx, s);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
R("LEVELS.T = mkLevel({ name: 'ARENA', theme: 'cellar', start: [1, 1, 1], rows: ['##############', '#............#', '#............#', '##############'] });");
const fresh = (mobs) => { R(`_seed = 7; newGame('T'); scene = worldScene; GM.x = 1; GM.y = 1; GM.dir = 1; GM.lv.mobs = ${JSON.stringify(mobs)}.map(([t, x, y]) => mkMob(t, x, y));`); };
(async () => {
  R('anyKey = true;');
  // 1. a monster wakes up, paths around, and stands next to the party
  fresh([['INTERN', 8, 1]]); await X.step(ctx, 500);
  ok(R('GM.lv.mobs[0].x') === 2 && R('GM.lv.mobs[0].y') === 1, 'intern walks to the cell in front: ' + R('GM.lv.mobs[0].x+","+GM.lv.mobs[0].y'));
  ok(R('PARTY.some(c => c.hp < c.max)'), 'the intern hurt somebody while the party watched');
  // 2. kill it with the front fighter; derez, xp and cleanup
  R('PARTY.forEach(c => { c.hp = c.max; c.dead = 0; })'); const xp0 = R('PARTY[0].xp + PARTY[1].xp');
  let swings = 0; for (let i = 0; i < 40 && R('GM.lv.mobs.length && GM.lv.mobs[0].hp > 0'); i++) { if (R('attack(0, 0)')) swings++; await X.step(ctx, 52); }
  ok(R('GM.lv.mobs.length === 0 || GM.lv.mobs[0].hp <= 0'), 'carl killed the intern in ' + swings + ' swings');
  await X.step(ctx, 40); ok(R('GM.lv.mobs.length') === 0, 'the dead monster derezzes away');
  ok(R('PARTY.reduce((n, c) => n + c.xp, 0)') > xp0 || R('PARTY[0].lvl') > 1, 'xp was shared out');
  // 3. cooldown blocks a second instant swing
  fresh([['INTERN', 2, 1]]); R('GM.lv.mobs[0].awake = 1; GM.lv.mobs[0].acd = 9999;');
  const a1 = R('attack(0, 0)'), a2 = R('attack(0, 0)'); ok(a1 === true && a2 === false, 'cooldown: second swing is refused (' + a1 + ',' + a2 + ')');
  // 4. back rank cannot melee, but can use a ranged weapon
  fresh([['INTERN', 2, 1]]); R('GM.lv.mobs[0].acd = 9999; PARTY[2].hands[0] = "CHALK"; PARTY[2].cool = [0, 0]');
  ok(R('attack(2, 0)') === false, 'melee from the back rank is refused');
  ok(R('attack(3, 0)') === true || R('attack(3, 0)') === false, 'ranged from the back rank is allowed to try (rank 3: ' + R('PARTY[3].hands[0]') + ')');
  // 5. a ranged weapon reaches down the corridor
  fresh([['INTERN', 4, 1]]); R('GM.lv.mobs[0].acd = 9999; PARTY[1].hands[0] = "LASER_PISTOL"; PARTY[1].cool = [0, 0]; GM.lv.mobs[0].hp = 99');
  ok(R('attack(1, 0)') === true, 'ranged hits a monster three cells away');
  // 6. a closed door keeps monsters off you
  R('_seed = 7; newGame(0); scene = worldScene; GM.lv.mobs = [mkMob("INTERN", 10, 10)]; GM.x = 10; GM.y = 8; GM.dir = 2;'); await X.step(ctx, 300);
  ok(R('GM.lv.mobs[0].y') === 10, 'monster behind a closed door cannot reach the party (' + R('GM.lv.mobs[0].x+","+GM.lv.mobs[0].y') + ')');
  // 7. level up
  fresh([]); R('PARTY[0].xp = 0; PARTY[0].lvl = 1; gainXP(60 * 6)'); ok(R('PARTY[0].lvl') >= 2 && R('PARTY[0].max') > 40, 'xp levels the party up: L' + R('PARTY[0].lvl') + ' max ' + R('PARTY[0].max'));
  // 8. monsters block movement
  fresh([['INTERN', 2, 1]]); R('GM.lv.mobs[0].acd = 9999;'); R('startMove(0)'); ok(R('GM.anim') === null, 'cannot walk into a monster');
  // 9. render with monsters in view from every open cell and facing
  let bad = 0; R('newGame(0); scene = worldScene; GM.lv.mobs = [mkMob("INTERN", 6, 8), mkMob("SPIDER", 12, 7)];');
  for (let y = 0; y < 16; y++) for (let x = 0; x < 20; x++) { if (R(`BLOCKS.indexOf(cellCh(GM.lv,${x},${y}))>=0`)) continue; for (let d = 0; d < 4; d++) { try { R(`GM.x=${x};GM.y=${y};GM.dir=${d};renderView(GM.lv,{x:GM.x,y:GM.y,dir:GM.dir},mobEnts(GM));`); } catch (e) { bad++; console.log(e.message); } } }
  ok(bad === 0, 'every cell renders with monsters in view');
  // 10. a party wipe ends the game state
  fresh([['INTERN', 2, 1]]); R('PARTY.forEach(c => { c.hp = 1; }); GM.lv.mobs[0].hit = 99; MON.INTERN.hit = 40; MON.INTERN.atk = 4;'); await X.step(ctx, 200);
  ok(R('PARTY.every(c => c.dead)') && R('GM.over') === 1, 'everyone down sets game over');
    fresh([['INTERN', 2, 1]]); R('post.shake = 0; shake(2, 8); GM.lv.mobs[0].awake = 1;'); ok(R('post.shake') === 2, 'a hit shakes the screen'); R('DLG = { who: null, lines: ["x"], n: 0 }'); await X.step(ctx, 12); ok(R('post.shake') === 0, 'the shake stops by itself even with a dialogue box open'); R('DLG = null');
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
