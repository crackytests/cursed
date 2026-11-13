// CHROME FORCE screenshots: node tools/cfshot.js <what> [out.png]
// what: title | talk:<SPEAKER NAME> | town:<id> | room:<town>:<doorx,y> | map:<battle> | cut:<battle> | spell:<battle> | route:<ch> | status | shop:<downs>[:buy]
const G = require('./g2vm'), path = require('path');
const FILES = ['g2/engine2', 'g2/fm', 'cf/cfsynth', 'cf/cfscore', 'cf/cfart', 'cf/cfports', 'cf/cfdata', 'cf/cfrules', 'cf/cfmaps', 'cf/cfstory', 'cf/cfbanter', 'cf/cfui', 'cf/cfbattle', 'cf/cftown', 'cf/cfmain'];
const [what = 'title', out] = process.argv.slice(2);
const ctx = G.load(FILES), R = s => G.R(ctx, s);
const OUT = out || path.join(__dirname, 'shots', 'cf_' + what.replace(/:/g, '_') + '.png');
require('fs').mkdirSync(path.dirname(OUT), { recursive: true });
const press = async (k, n = 2) => { R(`kb.${k} = 1`); await G.step(ctx, n); R(`kb.${k} = 0`); await G.step(ctx, 2); };
(async () => {
  const [kind, arg] = what.split(':');
  R(`Math.random = mulberry(3); regAll(); SAVE = newSave(); for (const k of FORCE_ORDER.slice(0, +'${kind === 'title' ? 4 : 12}')) { const r = newRecord(k); SAVE.force[k] = r; SAVE.active.push(k); }`);
  if (kind === 'title') { R('run(boot)'); await G.step(ctx, 90); }
  if (kind === 'town') { R(`say = async () => {}; SAVE.flags.met_oren = 1; SAVE.ch = ${+process.env.CH || 1}; SAVE.bi = ${+process.env.BI || 0}; Math.random = mulberry(${+process.env.SEED || 3}); run(() => runTown('${arg || 'signalhold'}'))`); await G.step(ctx, +(process.env.F || 40)); }
  if (kind === 'pick') { R(`SAVE.flags.met_oren = 1; run(() => runTown('signalhold'))`); await G.step(ctx, 30); R(`run(() => pickMember('FORCE', allRecs()))`); await G.step(ctx, 6); for (let i = 0; i < (+arg || 2); i++) await press('down'); await G.step(ctx, 6); }
  if (kind === 'magic') { // magic menu with a 3-level spell, after pressing LEFT once
    R(`say = async () => {}; banner = () => {}; run(() => runBattle('b11'))`); await G.step(ctx, 120);
    R(`(() => { const u = B.units.find(v => v.id === B.turnUnit); u.spells = { PLASMA: 3, MEND: 2 }; u.mp = u.mmp = 30; })()`);
    await press('a'); await G.step(ctx, 6); await press('left'); await press('a'); await G.step(ctx, 6); await press('left'); await G.step(ctx, 8);
  }
  if (kind === 'room') { const [, t, k] = what.split(':'); R(`say = async () => {}; SAVE.flags.met_oren = 1; run(() => runTown('${t}'))`); await G.step(ctx, 30); R(`enterRoom('${k}')`); await G.step(ctx, 30); }
  if (kind === 'talk') { const who = what.slice(5); R(`SAVE.flags.met_oren = 1; run(() => runTown('signalhold'))`); await G.step(ctx, 30); R(`say('THE SIGNAL STILL BURNS. KEEP IT BURNING, AND NEVER OPEN THE GATE OF LEAVING.', ${JSON.stringify(who)})`); await G.step(ctx, 120); }
  if (kind === 'route') { R(`SAVE.ch = ${+arg || 1}; SAVE.bi = 1; run(() => routeMenu(CHAPTERS[${(+arg || 1) - 1}]))`); await G.step(ctx, 40); }
  if (kind === 'map' || kind === 'cut' || kind === 'spell') {
    R(`say = async () => {}; banner = () => {}; run(() => runBattle('${arg || 'b11'}'))`);
    await G.step(ctx, 120);
    if (kind === 'map') { await press('right'); await press('up'); await press('up'); await G.step(ctx, 10); }
    else {
      // put the hero next to a foe and attack through the real menu
      R(`(() => { const u = B.units.find(v => v.id === B.turnUnit) || B.units[0], f = B.units.find(v => v.side === 'foe'); ${kind === 'spell' ? "const c = B.units.find(v => v.id === 'booth');" : 'const c = u;'} })()`);
      R(`(() => { const u = B.units.find(v => v.id === B.turnUnit), f = B.units.find(v => v.side === 'foe' && v.hp > 0); f.x = u.x; f.y = u.y - 1; if (${kind === 'spell'}) { u.spells = { PLASMA: 2 }; u.mp = u.mmp = 20; u.wr = [1, 1]; } })()`);
      await press('a'); await G.step(ctx, 6);
      if (kind === 'spell') await press('left');
      await press('a'); await G.step(ctx, 6); await press('a');
      await G.step(ctx, +(process.env.F || 70));
    }
  }
  if (kind === 'fx') { // fx:SPELL:LV:battle -- cast directly and catch the cut-in mid-effect
    const [, sp, lv, bid] = what.split(':');
    R(`say = async () => {}; banner = () => {}; CF_FAST = true; run(() => runBattle('${bid || 'b11'}'))`); await G.step(ctx, 5);
    R(`CF_FAST = false; (() => { const u = B.units.find(v => v.side === 'ally'), f = B.units.find(v => v.side === 'foe' && v.hp > 0), heal = SPELLS['${sp}'].kind === 'heal' || SPELLS['${sp}'].kind === 'buff'; const t = heal ? B.units.find(v => v.side === 'ally' && v !== u) : f; t.x = u.x; t.y = u.y - 1; if (heal) t.hp = 3; u.mp = 99; run(() => playRecord(doSpell(B, u, spellInfo('${sp}', ${+lv || 1}), t.x, t.y, B.rng))); })()`);
    await G.step(ctx, +(process.env.F || 60));
  }
  if (kind === 'shop') { // shop:<n downs>[:buy] -- browse the weapon list, optionally open FOR WHOM
    const [, n, buy] = what.split(':'); R(`say = async () => {}; SAVE.gold = 5000; SAVE.flags.met_oren = 1; run(() => runTown('signalhold'))`); await G.step(ctx, 30);
    R(`run(() => shop('SHOPKEEP'))`); await G.step(ctx, 10); await press('a'); await G.step(ctx, 6);
    for (let i = 0; i < (+n || 0); i++) await press('down');
    if (buy) { await press('a'); await G.step(ctx, 6); }
    await G.step(ctx, 6);
  }
  if (kind === 'status') { R(`SAVE.flags.met_oren = 1; run(() => runTown('signalhold'))`); await G.step(ctx, 30); R(`run(() => showStatus(SAVE.force.${arg || 'dax'}))`); await G.step(ctx, 10); }
  G.png(ctx, OUT, 3); console.log('wrote', OUT);
  process.exit(0);
})();
