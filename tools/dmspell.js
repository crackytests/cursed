// DARK MONDAY spell and status tests (node tools/dmspell.js)
const X = require('./dmvm.js'); const ctx = X.load(); const R = s => X.R(ctx, s);
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
R("LEVELS.P = mkLevel({ name: 'SPELLS', theme: 'cellar', start: [1, 1, 1], darkZones: [[9, 1, 10, 2]], rows: ['############', '#..#...S...#', '#..........#', '############'] });");
// party order: 0 CARL 1 LINDA 2 JB 3 YOKO 4 GHOST 5 FACE. mobs start asleep with a long attack timer unless a test wakes them
const fresh = (mobs = []) => R(`_seed = 11; newGame('P'); scene = worldScene; anyKey = true; GM.x = 1; GM.y = 1; GM.dir = 1; GM.lv.mobs = ${JSON.stringify(mobs)}.map(([t, x, y]) => { const m = mkMob(t, x, y); m.acd = 99999; m.awake = 0; return m; });`);
const ready = (ci, sp = 9, lvl) => R(`PARTY[${ci}].sp = ${sp}; PARTY[${ci}].cool = [0, 0]; ${lvl ? `PARTY[${ci}].lvl = ${lvl};` : ''}`);
(async () => {
  fresh(); ok(R('spMaxOf(PARTY[1])') === 4 && R('PARTY[1].sp') === 4, 'linda starts with 4 spell points');
  fresh([['INTERN', 5, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs[0].hp = 99; GM.lv.mobs[0].max = 99;');
  ok(R('castSpell(1, "MEMO")') === true && R('GM.lv.mobs[0].hp') < 99 && R('PARTY[1].sp') === 2, 'MEMO hits for damage and costs 2 SP: hp ' + R('GM.lv.mobs[0].hp') + ' sp ' + R('PARTY[1].sp'));
  ok(R('castSpell(1, "MEMO")') === false, 'the caster is busy right after a cast');
  await X.step(ctx, 60); R('PARTY[1].sp = 0'); ok(R('castSpell(1, "MEMO")') === false && R('PARTY[1].sp') === 0, 'no SP, no spell');
  ready(1, 4, 3); const ac0 = R('acOf(PARTY[0])'); R('castSpell(1, "SYNERGY")'); ok(R('acOf(PARTY[0])') === ac0 + 2, 'SYNERGY adds 2 AC to the party'); R('GM.buffT = 3'); await X.step(ctx, 6); ok(R('acOf(PARTY[0])') === ac0, 'SYNERGY wears off');
  fresh([['INTERN', 4, 2], ['SPIDER', 5, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs.forEach(m => { m.hp = 99; m.max = 99; });'); ready(1, 9, 3);
  ok(R('castSpell(1, "LAYOFFS")') && R('GM.lv.mobs.every(m => m.hp < 99)'), 'LAYOFFS hits both monsters in the corridor');
  fresh(); R('PARTY[0].hp = 3; PARTY[0].poison = 500;'); ready(5, 9, 3); ok(R('castSpell(5, "BACKUP", 0)') && R('PARTY[0].hp') > 3, 'BACKUP heals the chosen member: ' + R('PARTY[0].hp'));
  ready(5); R('castSpell(5, "PATCH", 0)'); ok(R('PARTY[0].poison') === 0, 'PATCH cures poison');
  R('PARTY[2].dead = 1; PARTY[2].hp = 0;'); ready(5); ok(R('castSpell(5, "REBOOT", 2)') && R('PARTY[2].dead') === 0 && R('PARTY[2].hp') > 0, 'REBOOT revives a fallen member: hp ' + R('PARTY[2].hp'));
  R('PARTY[0].hold = 5; PARTY[0].hp = 2;'); ready(3, 9, 2); ok(R('castSpell(3, "SECOND CHANCE", 0)') && R('PARTY[0].hold') === 0 && R('PARTY[0].hp') > 2, 'SECOND CHANCE heals and clears hold');
  fresh([['INTERN', 3, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs[0].hp = 99;'); ready(3, 9, 2); R('castSpell(3, "ASSIST")'); R('attack(0, 0)'); ok(R('PARTY[0].cool[0]') <= Math.round(48 * .6) + 1, 'ASSIST speeds up cooldowns: ' + R('PARTY[0].cool[0]'));
  fresh(); R('GM.x = 9; GM.y = 1;'); ok(R('inDark(GM)') === true, 'the dark wing is dark'); ready(3); R('castSpell(3, "LUMEN")'); ok(R('inDark(GM)') === false, 'LUMEN lights it');
  let threw = false; try { R('renderView(GM.lv, { x: 9, y: 1, dir: 1, dark: true });'); } catch (e) { threw = true; } ok(!threw, 'the dark view renders');
  fresh([['INTERN', 3, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs[0].awake = 1; GM.lv.mobs[0].acd = 5;'); ready(4); R('castSpell(4, "SCARE")'); const hp0 = R('PARTY.reduce((n, c) => n + c.hp, 0)'); await X.step(ctx, 200);
  ok(R('PARTY.reduce((n, c) => n + c.hp, 0)') === hp0, 'SCARE keeps a monster from attacking for its duration');
  fresh([['INTERN', 3, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs[0].awake = 1; GM.lv.mobs[0].acd = 5;'); ready(4, 9, 2); R('castSpell(4, "ENTRANCE")'); const hp1 = R('PARTY.reduce((n, c) => n + c.hp, 0)'); await X.step(ctx, 200);
  ok(R('PARTY.reduce((n, c) => n + c.hp, 0)') === hp1, 'ENTRANCE stuns for its duration');
  fresh(); R('GM.x = 2; GM.y = 1; GM.dir = 1;'); ready(4); ok(R('castSpell(4, "PHASE")') === true, 'PHASE accepts a thin wall'); await X.step(ctx, 20); ok(R('GM.x') === 4 && R('GM.y') === 1, 'the party comes out the other side: ' + R('GM.x+","+GM.y'));
  ready(4); R('GM.x = 9; GM.y = 1; GM.dir = 1;'); ok(R('castSpell(4, "PHASE")') === false, 'PHASE refuses with no wall ahead');
  fresh(); R('GM.x = 5; GM.y = 1; GM.dir = 1;'); ready(2); ok(R('castSpell(2, "DEDUCE")') === true && R('cellCh(GM.lv, 7, 1)') === 'D', 'DEDUCE turns a secret wall into a door');
  fresh(); R('GM.lv.decor = { "3,0,S": { k: "rune" } }; GM.lv.ev = { translate: { "3,0,S": g => { g.flags.read = 1; } } }; GM.x = 3; GM.y = 1; GM.dir = 0;'); ready(3); ok(R('castSpell(3, "TRANSLATE")') && R('GM.flags.read') === 1, 'TRANSLATE reads the glyph ahead');
  ready(3); R('GM.x = 5; GM.y = 1;'); ok(R('castSpell(3, "TRANSLATE")') === false, 'TRANSLATE refuses when there is nothing to read');
  fresh([['SPIDER', 3, 2]]); R('GM.x = 2; GM.y = 2; GM.dir = 1; GM.lv.mobs[0].awake = 1; GM.lv.mobs[0].acd = 3; MON.SPIDER.poison = 1; MON.SPIDER.hit = 40; PARTY.forEach((c, i) => { if (i > 1) c.dead = 1; });'); await X.step(ctx, 400);
  ok(R('PARTY.some(c => c.poison > 0 || c.hp < c.max)'), 'a spider bite poisons somebody'); R('MON.SPIDER.poison = .4; MON.SPIDER.hit = 3');
  fresh(); R('PARTY[1].lvl = 1; PARTY[1].xp = 0; PARTY[1].sp = 0; gainXP(60 * 6);'); ok(R('PARTY[1].spMax') > 4, 'a level up raises max SP: ' + R('PARTY[1].spMax'));
  ok(Object.keys(R('SPELLS')).every(n => R(`!!Object.values(CASTERS).find(c => c.spells.includes(${JSON.stringify(n)}))`) && R(`!!SPELLS[${JSON.stringify(n)}].desc`)), 'every spell has a caster and a description');
  console.log(fails ? fails + ' FAILED' : 'ALL OK'); process.exit(fails ? 1 : 0);
})();
