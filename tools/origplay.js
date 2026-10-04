// Headless playthrough of FACE: BEFORE THE STREAM (Act I). Menu choices are scripted by label substring.
// usage: node tools/origplay.js            (full run, prints transcript)
//        SHOT=name node tools/origplay.js  (not used; see tools/origshot.js)
const G = require('./g2vm');
const FILES = ['g2/engine2', 'g2/fm', 'orig/oart', 'orig/ostory', 'orig/oact2', 'orig/oact3', 'orig/omain'];
const LS = {};
const ctx = G.load(FILES, LS);
const out = [];
const log = s => { out.push(s); if (process.env.QUIET !== '1') console.log(s); };
ctx.__log = log;
// instant, scripted versions of the UI functions
G.R(ctx, `
  say = async (s, who) => { __log((who || '*') + ': ' + s); };
  chat = async (m) => { __log('CHAT: ' + m.map(x => x.u + ': ' + x.m).join(' | ')); };
  showCard = async (l) => { __log('CARD: ' + l.join(' / ')); };
  wait = async () => {}; fadeTo = async () => {};
`);
const script = (process.env.PATH_ === 'cushion') ? null : null;
// each entry is a label substring; a choose() call consumes the next entry that matches one of its options
const S = [
  'MIMI', 'TALK', 'LEMON', 'BACK', // order the lemon
  'SHELF', 'TAKE', // binder
  'WINDOW', 'WINDOW', // look twice: the bird
  'COUCH', 'TAKE', // the cushion (the wrong thing first)
  'FRONT DOOR', 'USE', 'CUSHION', // drone has arrived: cushion in the doorway, door shuts
  'MIMI', 'TALK', 'LEMON', 'BACK', // order again
  'WINDOW', 'WINDOW',
  'FRONT DOOR', 'USE', 'BINDER', // binder in the doorway
  'FRONT DOOR', 'USE', 'BARE HANDS', // leave
  'NEIGHBOR', 'NEIGHBOR',
  'STAIRS DOWN', '(SAY NOTHING)', // hall: Mimi asks; then down
  'THE MACHINE', 'USE', 'REMOVE THE RING', // lesson
  'THE MACHINE', 'USE', 'RUN TEST', // fails
  'WHITEBOARD', 'LOOK',
  'NOTEBOOK', 'TAKE', 'IT IS GOOD WORK',
  'WHITEBOARD', 'USE', 'WRITE HIS NAME',
  'CHALK CIRCLE', 'USE', 'MARK 2', 'SALT', 'MARK 3', 'BRIDGE', // solves
  'THE MACHINE', 'USE', 'RUN TEST',
  'WHAT DID I BUILD', 'WHO IS THE MAGICIAN', 'ASK ARE YOU THERE',
  // ACT II
  'STAGE TRUNK', 'TAKE', 'BRASS HANDBELL', 'STAGE TRUNK', 'TAKE', 'IRON BELL', 'STAGE TRUNK', 'TAKE', 'GLITTER JAR',
  'STAGE TRUNK', 'TAKE', 'ROCK SALT', 'STAGE TRUNK', 'TAKE', 'IRON KEY',
  'THE MACHINE', 'USE', 'FIREWALL',
  'STAIR DOOR', 'USE', 'ROCK SALT', 'STAIR DOOR', 'USE', 'IRON BELL', 'THE FLUE', 'USE', 'ROCK SALT', 'SPEAKER CABLE', 'USE', 'IRON KEY',
  'THE MACHINE', 'USE', 'CONTINUITY TEST', 'WAIT AND WATCH',
  'CHALK CIRCLE', 'USE', 'BEGIN THE WORKING', 'TO BE HERE',
  // ACT III
  'THE DOOR', 'TALK', 'WHAT DID YOU SEE?', 'I AM GOING TO LEAVE', 'BACK',
  'CHALK CIRCLE', 'USE', 'MARK 1', 'EARTH', 'MARK 2', 'SALT', 'MARK 3', 'BRIDGE', 'MARK 4', 'SEAL',
  'THE MAGICIAN', 'TALK', 'I SHOULD BE THE ONE', 'BACK',
  'CHALK CIRCLE', 'USE', 'BEGIN THE WORKING', 'I WILL COME BACK',
  'LOOK CLOSER', 'THE WOMAN', 'TALK', 'CAN YOU MAKE TEA?', 'BACK',
  'THE KETTLE', 'USE', 'SWITCH IT ON', 'FILL IT WITH WATER', 'SWITCH IT ON', 'WAIT FOR THE CLICK', 'WILL YOU COME WITH US?',
  'THE DOOR', 'USE', 'TELL THEM ABOUT THE KETTLE',
];
if (process.env.ACT3) { // start at Act III with a chosen ending: ACT3=stayed|demo|warning
  S.length = 0; const e = process.env.ACT3;
  if (e === 'stayed') S.push('THE DOOR', 'USE', 'OPEN THE DOOR');
  else S.push('CHALK CIRCLE', 'USE', 'MARK 1', 'EARTH', 'MARK 2', 'SALT', 'MARK 3', 'BRIDGE', 'MARK 4', 'SEAL', 'THE MAGICIAN', 'TALK', 'I SHOULD BE THE ONE', 'BACK', 'CHALK CIRCLE', 'USE', 'BEGIN THE WORKING', '(SAY NOTHING)',
    'THE WOMAN', 'TALK', 'CAN YOU MAKE TEA?', 'BACK', 'THE KETTLE', 'USE', 'FILL IT WITH WATER', 'SWITCH IT ON', 'WAIT FOR THE CLICK', '(LET HER CHOOSE)', 'THE DOOR', 'USE', e === 'warning' ? 'ABOUT THE FUTURE' : 'DEMONSTRATION');
}
let si = 0, stuck = 0;
ctx.__pick = (opts) => {
  // find the next script entry (within the next 3) that matches an option
  for (let k = si; k < Math.min(S.length, si + 3); k++) {
    const j = opts.findIndex(o => o.includes(S[k]));
    if (j >= 0) { si = k + 1; log('  > ' + opts[j]); return j; }
  }
  log('  ! no match for [' + opts.join(' | ') + '] at script step ' + si + ' (' + S[si] + ')');
  if (++stuck > 3) { log('STUCK'); process.exit(1); }
  return opts.length - 1;
};
G.R(ctx, `choose = async (opts) => __pick(opts);`);
(async () => {
  if (process.env.ACT3) G.R(ctx, 'act3Seed(); OS.flags.a3intro = 1;'); else G.R(ctx, 'Object.assign(OS, { room: "apt", flags: {}, inv: [], t: 0 }); OS.room = "apt";');
  G.R(ctx, 'scene = { draw() {} };');
  await G.R(ctx, process.env.ACT3 ? '(async () => { await startAct3(); await roomLoop(); })()' : '(async () => { await goRoom("apt"); await roomLoop(); })()');
  const st = JSON.parse(JSON.stringify(G.R(ctx, 'OS')));
  log('STATE ' + JSON.stringify({ room: st.room, curseDone: st.flags.curseDone, gave: st.gave, wedged: st.flags.wedged, honest: st.honest, lies: st.lies, rapport: st.rapport, noticed: st.noticed, tries: st.tries, inv: st.inv, ends: G.R(ctx, 'OMETA').ends }));
  const ok = process.env.ACT3 ? st.room === 'END' && G.R(ctx, 'OMETA').ends.act3 : st.room === 'END' && st.flags.curseDone && G.R(ctx, 'OMETA').ends.broadcast && G.R(ctx, 'OMETA').ends.act1 && G.R(ctx, 'OMETA').ends.act2;
  log(ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(2); });
