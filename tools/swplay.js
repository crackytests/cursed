// SAVE THE WORLD headless runner. node tools/swplay.js [maxFrames]
// env: BOT=mash (default: the real bot in swbot.js), SHOTS=f1,f2 (png frames), SETUP='js' (runs after load), LOG=1
const G2 = require('./g2vm'), path = require('path'), fs = require('fs');
const files = require('./swvm').filter(f => fs.existsSync(path.join(G2.ROOT, f + '.js')));
const LS = {}; const ctx = G2.load(files, LS);
const R = s => G2.R(ctx, s);
const max = +(process.argv[2] || 20000), shots = (process.env.SHOTS || '').split(',').filter(Boolean).map(Number);
let errors = 0;
ctx.console = { log: (...a) => console.log(...a), error: (...a) => { errors++; console.log('ERR', ...a.map(x => x && x.stack || x)); }, warn: () => {} };
R(`DBG.fast = 1; const _say1 = say1; say1 = async function (s, who, o) { __log('[' + frame + '] ' + (who ? who + ': ' : '') + String(s).split(String.fromCharCode(10)).join(' ')); return _say1(s, who, o); };
  const _card = showCard; showCard = async function (l, t, o) { __log('[' + frame + '] CARD ' + l.join(' / ')); return _card(l, t, o); };
  const _bat = battle; battle = async function (f, o) { const ff = typeof f === 'string' ? FORMS[f] : f; __log('[' + frame + '] BATTLE ' + ff.foes.map(x => x[0]).join(',')); const r = await _bat(f, o); __log('[' + frame + '] -> ' + r + ' party ' + partyHeroes().map(h => h.id + ':' + h.hp + '/' + h.mhp + ' L' + h.lv).join(' ')); return r; };`);
ctx.__log = s => console.log(s);
if (process.env.SETUP) R(process.env.SETUP);
const botFile = process.env.BOT === 'mash' ? null : path.join(__dirname, 'swbot.js');
if (botFile && fs.existsSync(botFile)) R(fs.readFileSync(botFile, 'utf8'));
if (process.env.STATE) R(require('./swstates')[process.env.STATE]); else R('run(boot)');
if (process.env.OBJ) R('obj("TEST", ' + process.env.OBJ + ')');
if (process.env.UNTIL) R('BOT.until = () => ' + process.env.UNTIL);
(async () => {
  let T = 0;
  for (let f = 0; f < max; f++) {
    R(`for (const k of BTNS) kb[k] = 0;`);
    if (botFile) R('BOT && BOT.tick()'); else R(`if (frame % 6 === 0) kb.a = 1; if (frame % 200 < 3) kb.start = 0;`);
    T += 16.7; const shot = shots.includes(f);
    R(`acc = 16.7; lastT = ${T}; pollInput(); frame++; if (scene && scene.update) scene.update(); { const w = waiters; waiters = []; w.forEach(r => r()); } ${shot ? 'if (scene && scene.draw) scene.draw(); else cls(BLACK); drawOverlay();' : ''}`);
    for (let j = 0; j < 3; j++) await new Promise(r => setImmediate(r));
    if (shot) { G2.png(ctx, path.join(__dirname, 'shots', 'sw_' + f + '.png'), 2); console.log('shot', f); }
    if (R('typeof BOT !== "undefined" && BOT.done')) break;
  }
  console.log('END frame', R('frame'), 'map', R('G && G.map'), 'world', R('G && G.inWorld'), 'errors', errors);
})().catch(e => console.log('FATAL', e.stack));
