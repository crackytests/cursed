// CHROME FORCE input-flow test: drives the real UI with key presses (title -> town -> shop -> church -> gate -> battle turns).
// node tools/cfflow.js   (SHOTS=1 writes tools/shots/cfflow_*.png at checkpoints)
const G = require('./g2vm'), path = require('path');
const FILES = ['g2/engine2', 'g2/fm', 'cf/cfsynth', 'cf/cfscore', 'cf/cfart', 'cf/cfports', 'cf/cfdata', 'cf/cfrules', 'cf/cfmaps', 'cf/cfstory', 'cf/cfbanter', 'cf/cfui', 'cf/cfbattle', 'cf/cftown', 'cf/cfmain'];
const ctx = G.load(FILES), R = s => G.R(ctx, s);
let fails = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++; };
const tap = async (k, hold = 2, after = 3) => { R(`kb.${k} = 1`); await G.step(ctx, hold); R(`kb.${k} = 0`); await G.step(ctx, after); };
const shot = n => { if (process.env.SHOTS) G.png(ctx, path.join(__dirname, 'shots', 'cfflow_' + n + '.png'), 2); };
// keep tapping A until a predicate holds (dialogue, cards)
async function until(pred, key = 'a', max = 400) { for (let i = 0; i < max; i++) { if (R(`!!(${pred})`)) return true; await tap(key, 2, 2); } return false; }

(async () => {
  R('Math.random = mulberry(11); run(boot)');
  await G.step(ctx, 30);
  await tap('start');
  ok(R('WINS.length') === 1, 'title menu open');
  await tap('a'); // NEW GAME
  ok(await until('scene === townScene && !DLG', 'a', 600), 'opening crawl -> Signalhold');
  shot('town');
  ok(R('Object.keys(SAVE.force).length') === 4, 'starting force of four');
  // walk to the armorer: armorer NPC at (7,3) snapped; just open the shop directly through interact by teleporting next to it
  R(`(() => { const n = TV.npcs.find(n => n.kind === 'shop'); TV.px = n.x; TV.py = n.y + 1; TV.dir = 'up'; })()`);
  await tap('a'); ok(await until('WINS.length > 0 && !DLG'), 'shop opened after greeting');
  shot('shop');
  await tap('a'); // BUY WEAPONS
  const g0 = R('SAVE.gold');
  await tap('a'); // SHORT SABER (60)
  await tap('a'); // first member (Dax) -> can't equip, buys anyway
  await G.step(ctx, 5);
  await until('WINS.length >= 1 && !WINS.some(w => w.toString().includes("ctext(l, 87"))', 'a', 20);
  ok(R('SAVE.gold') < g0, 'bought something (' + g0 + ' -> ' + R('SAVE.gold') + ')');
  for (let i = 0; i < 6; i++) await tap('b');
  await until('WINS.length === 0 && !DLG', 'b', 40);
  // church: save
  R(`(() => { const n = TV.npcs.find(n => n.kind === 'church'); TV.px = n.x; TV.py = n.y + 1; TV.dir = 'up'; })()`);
  await tap('a'); await until('WINS.length > 0 && !DLG');
  await tap('a'); await until('WINS.length > 0 && !DLG'); // SAVE
  ok(!!R('localStorage.getItem("cf_save")'), 'church saved the game');
  await tap('down'); await tap('down'); await tap('down'); await tap('a'); await until('WINS.length === 0 && !DLG');
  // START menu -> FORCE -> status
  await tap('start'); ok(R('WINS.length') === 1, 'field menu');
  await tap('a'); await G.step(ctx, 3); await tap('a'); await G.step(ctx, 3); shot('status');
  ok(R('WINS.length') >= 1, 'status screen up');
  for (let i = 0; i < 4; i++) await tap('b');
  await until('WINS.length === 0', 'b', 10);
  // walk into a house for real: the armory door is just above the street
  const stepUntil = async (pred, max = 60) => { for (let k = 0; k < max; k++) { if (R(`!!(${pred})`)) return true; await G.step(ctx, 1); } return false; };
  R("TV.px = 8; TV.py = 3; TV.dir = 'up'");
  R('kb.up = 1'); await G.step(ctx, 8); R('kb.up = 0'); await stepUntil('TV.room');  await G.step(ctx, 20);
  ok(R('TV.room') === '7,2' && R('TV.map.length') === 8, 'walked through a door into ' + R('TV.room && TOWN_ROOMS.signalhold[TV.room].n'));
  R("TV.px = 9; TV.py = 3; TV.dir = 'up'"); const items0 = R('JSON.stringify(allRecs().map(r => r.items.length).concat(SAVE.depot.length))');
  await tap('a'); await until('!DLG && !WINS.length', 'a', 60);
  ok(R("!!SAVE.flags['st_signalhold_7,2_9_2']") && R('JSON.stringify(allRecs().map(r => r.items.length).concat(SAVE.depot.length))') !== items0, 'opened the stash in the armory');
  R("TV.px = 5; TV.py = 6; TV.dir = 'down'");
  R('kb.down = 1'); await G.step(ctx, 8); R('kb.down = 0'); await stepUntil('!TV.room'); await G.step(ctx, 20);
  ok(!R('TV.room') && R('TV.py') === 3, 'walked back out to the street');
  // walk to the gate for real: spawn is right above the gate
  R(`TV.px = TOWNS.signalhold.gate[0]; TV.py = TOWNS.signalhold.gate[1] - 1; TV.dir = 'down'`);
  R('kb.down = 1'); await G.step(ctx, 8); R('kb.down = 0'); await G.step(ctx, 4);
  if (!R('WINS.length')) console.log('  town state', JSON.stringify(R('({ px: TV.px, py: TV.py, dir: TV.dir, wins: WINS.length, dlg: !!DLG, scene: scene === townScene, tile: TV.map[TV.py][TV.px], below: TV.map[TV.py + 1][TV.px], walk: walkable(TV.px, TV.py + 1), npc: (npcAt(TV.px, TV.py + 1) || {}).name, rows: TV.map.length, busy })')));
  ok(R('WINS.length') >= 1, 'gate prompt');
  await tap('a'); // YES
  ok(await until('typeof scene.draw === "function" && WINS.length === 1 && scene !== townScene', 'c', 60), 'route screen');
  shot('route');
  await tap('a'); // MARCH
  ok(await until('scene === battleScene && B && B.turnUnit && !DLG && BV.hl', 'a', 800), 'battle b11 started, a player turn is waiting');
  shot('battle');
  // play turns by hand: on each of our turns, walk toward the nearest foe, attack if the diamond allows, else stay
  let turns = 0, attacks = 0;
  for (let k = 0; k < 6000 && R('B && !B.exit && !battleOver(B)'); k++) {
    if (!R('scene === battleScene && !!BV.hl && !DLG')) { if (R('!!DLG')) await tap('a', 1, 2); else await G.step(ctx, 3); continue; }
    turns++;
    const plan = R(`(() => { const u = B.units.find(v => v.id === B.turnUnit), p = planAI(B, u, {}); return p ? { x: p.x, y: p.y, ux: u.x, uy: u.y, act: p.act } : null; })()`);
    if (plan) { // walk there with the d-pad, one tile at a time along the path
      const path = R(`(() => { const u = B.units.find(v => v.id === B.turnUnit); return reach(B, u).path(${plan.x}, ${plan.y}); })()`);
      for (let i = 1; i < path.length; i++) { const [x, y] = path[i], [px, py] = path[i - 1]; await tap(x > px ? 'right' : x < px ? 'left' : y > py ? 'down' : 'up', 1, 1); if (process.env.DBGT) console.log('   step', x, y, '->', R('[BV.cx, BV.cy, BV.hl ? BV.hl.size : -1, pressed.up, held.up]')); }
    }
    if (process.env.DBGT) console.log('turn', R('B.turnUnit'), JSON.stringify(plan), R('[BV.cx,BV.cy]'));
    await tap('a'); // open diamond
    if (process.env.DBGT) console.log('  after a: diamond', R('!!BV.diamond'), 'wins', R('WINS.length'), 'hl', R('!!BV.hl'));
    if (plan && plan.act && plan.act.type === 'attack') {
      await tap('up'); await tap('a'); // ATTACK
      const tid = plan.act.target;
      for (let c = 0; c < 8 && R(`!(BV.info && BV.info.id === '${tid}')`); c++) await tap('right');
      await tap('a'); attacks++;
    } else { await tap('down'); await tap('a'); } // STAY / SEARCH
    await G.step(ctx, 4);
  }
  console.log('state:', JSON.stringify(R(`({ scene: scene === battleScene ? 'battle' : scene === cutScene ? 'cut' : '?', hl: !!BV.hl, dlg: !!DLG, msg: !!BV.msg, wins: WINS.length, diamond: !!BV.diamond, turn: B.turnUnit, round: B.round, busy })`)));
  const res = R('battleOver(B)');
  ok(attacks > 0, 'attacked through the diamond menu (' + attacks + ' attacks over ' + turns + ' turns)');
  ok(res === 'win' || res === 'lose', 'battle resolved by hand: ' + res);
  shot('end');
  console.log(fails ? fails + ' FAILURES' : 'OK');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
