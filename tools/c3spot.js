// spot checks for content the route bot doesn't drive: job deliveries, roadside events, ACT I side scenes, crate integrity.
// each check runs in a fresh vm context with a monotonic clock, so tests can't contaminate each other.
const { load, G, FAST } = require('./c3vm'), fs = require('fs');
const BOT = fs.readFileSync(__dirname + '/c3bot.js', 'utf8');
const assert = (c, m) => { if (!c) { console.log('FAIL: ' + m); process.exitCode = 1; } else console.log('ok: ' + m); };
const PROLOGUE = `anyKey = true; C3 = newC3(); ensure3(); C3.bux = 60; C3.stop = 3;
  for (const i of [1,2,3]) { setF3('done' + i); setF3('arrived' + i); }
  setF3('seenP0'); setF3('ghostOn'); setF3('lindaOn'); C3.route = [1,1,1,1];
  jobNpc = id => WX.ents.find(e => e.id === 'job_' + id) || WX.ents.find(e => e.label === JOBS.find(j => j.id === id).who && live3(e));`;
async function drive(body, extra = '') {
  const ctx = load({}); G.R(ctx, BOT); G.R(ctx, FAST); G.R(ctx, 'BOT.set({})');
  G.R(ctx, PROLOGUE + extra);
  let T = 1000;
  const p = G.R(ctx, `(async () => { WX.hold++; try { ${body} } finally { WX.hold = Math.max(0, WX.hold - 1); } })()`);
  const frames = (async () => {
    for (let f = 0; f < 12000; f++) {
      T += 16.7; G.R(ctx, 'BOT.tick()'); G.R(ctx, `loop(${T})`);
      for (let j = 0; j < 2; j++) await new Promise(r => setImmediate(r));
    }
    return 'exhausted';
  })();
  const res = await Promise.race([p.then(() => 'resolved'), frames]);
  if (res === 'exhausted') { console.log('FAIL: frame exhausted in: ' + body.slice(0, 60)); process.exitCode = 1; }
  return ctx;
}
(async () => {
  // table integrity
  {
    const ctx = await drive('await wait(10);');
    const ci = G.R(ctx, `(() => { const ns = CRATES.map(c => c.n).sort((a,b) => a-b); return { uniq: new Set(ns).size === 31, all: ns.length === 31 && ns[0] === 1 && ns[30] === 31, words: CRATES.every(c => c.note && c.note.split(' ').length <= 27), scenes: CRATES.every(c => SCENES[c.scene]) }; })()`);
    assert(ci.uniq && ci.all && ci.words && ci.scenes, 'crates: 31 unique, numbered 1-31, notes <=27 words, known scenes');
    assert(G.R(ctx, `JOBS.length === 30 && JOBS.every(j => j.lines.length >= 2 && j.pay >= 10 && j.pay <= 40 && SCENES[j.scene] && STOPTAB[j.to])`), 'jobs: 30 total, lines/pay/scene/to all sane');
    console.log('job spread:', G.R(ctx, `(() => { const from = {}, to = {}; for (const j of JOBS) { from[j.from] = (from[j.from]||0)+1; to[j.to] = (to[j.to]||0)+1; } return JSON.stringify({from, to}); })()`));
    const tasks = G.R(ctx, `JOBS.filter(j => j.task).length`), conds = G.R(ctx, `JOBS.filter(j => j.cond).length`);
    assert(tasks >= 5, 'jobs with task minigames: ' + tasks + ' (>=5)');
    assert(conds >= 3, 'jobs with cond gates: ' + conds + ' (>=3)');
  }
  // job deliveries: plain, tune-task, wires-task, cond-gated
  {
    const ctx = await drive(`const e = jobNpc('wax'); await e.talk(e);`,
      `C3.stop = 10; addParcel({ id: 'job_wax', job: 'wax', desc: 'W', toName: 'VEE', from: 'I', model: 'parcel' }); scene = worldScene3; loadScene('drivein_lot', -10, 16, 0);`);
    assert(G.R(ctx, `C3.jobsDone.wax === 1 && C3.parcels.find(p => p.job === 'wax').status === 'delivered'`), 'job wax delivered in a new scene, paid');
  }
  {
    const ctx = await drive(`const e = jobNpc('film'); await e.talk(e);`,
      `C3.stop = 10; addParcel({ id: 'job_film', job: 'film', desc: 'T', toName: 'ARLO', from: 'X', model: 'parcel' }); scene = worldScene3; loadScene('booth', 2, 1.6, 0);`);
    assert(G.R(ctx, `C3.jobsDone.film === 1`), 'job film (tune task) delivered');
  }
  {
    const ctx = await drive(`const e = jobNpc('speakers'); await e.talk(e);`,
      `C3.stop = 4; addParcel({ id: 'job_speakers', job: 'speakers', desc: 'S', toName: 'MW', from: 'Y', model: 'parcel' }); scene = worldScene3; loadScene('mall_hall', -18, 8, 0);`);
    assert(G.R(ctx, `C3.jobsDone.speakers === 1`), 'job speakers (wires task) delivered');
  }
  {
    const ctx = await drive(`const e = jobNpc('quartz'); await e.talk(e);`,
      `C3.stop = 8; setF3('done11'); setF3('arrived11'); addParcel({ id: 'job_quartz', job: 'quartz', desc: 'Q', toName: 'OPAL', from: 'S', model: 'parcel' }); scene = worldScene3; loadScene('ghost_post', 0, 4, 0);`);
    assert(G.R(ctx, `C3.jobsDone.quartz === 1`), 'job quartz (cond-gated) delivered to Opal');
  }
  {
    const ctx = await drive(`const e = WX.ents.find(e => e.id === 'ned'); await e.talk(e);`,
      `C3.stop = 1; addParcel({ id: 'cactus', desc: 'C', toName: 'NED', from: '?', model: 'parcel' }); parcel('cactus').status = 'delivered'; addParcel({ id: 'job_postcards', job: 'postcards', desc: 'P', toName: 'NED', from: 'M', model: 'parcel' }); scene = worldScene3; loadScene('canyon_main', 19, 12, 0);`);
    assert(G.R(ctx, `C3.jobsDone.postcards === 1 && WX.ents.filter(e => e.label === 'NED').length === 1`), 'job postcards delivered through story Ned after the cactus, no clone Ned');
  }
  {
    const ctx = await drive(`const e = WX.ents.find(e => e.id === 'slim2'); await e.talk(e);`,
      `C3.stop = 3; setF3('loungeOpen'); addParcel({ id: 'job_motape', job: 'motape', desc: 'T', toName: 'SLIM', from: 'M', model: 'parcel' }); scene = worldScene3; loadScene('plaza_lounge', 0, 1.4, 0);`);
    assert(G.R(ctx, `C3.jobsDone.motape === 1 && WX.ents.filter(e => e.label === 'SLIM').length === 1`), 'job motape delivered to sleeping Slim in the lounge, no clone Slim');
  }
  {
    const ctx = await drive(`const e = WX.ents.find(e => e.id === 'dennis'); await e.talk(e);`,
      `C3.stop = 4; setF3('mallOpen'); addParcel({ id: 'job_sand', job: 'sand', desc: 'S', toName: 'DENNIS', from: 'B', model: 'parcel' }); scene = worldScene3; loadScene('mall_out', 5, 34, 0);`);
    assert(G.R(ctx, `C3.jobsDone.sand === 1 && WX.ents.filter(e => e.label === 'DENNIS').length === 1`), 'job sand delivered to Dennis at the mall door, no clone');
  }
  {
    const ctx = load({}); G.R(ctx, BOT); G.R(ctx, FAST); G.R(ctx, PROLOGUE);
    const open1 = G.R(ctx, `C3.stop = 8; jobOpen(JOBS.find(j => j.id === 'quartz'))`);
    G.R(ctx, `setF3('done11'); setF3('arrived11');`);
    const open2 = G.R(ctx, `jobOpen(JOBS.find(j => j.id === 'quartz'))`);
    assert(!open1 && open2, 'job quartz gated behind done11');
  }
  // every roadside event, each in a fresh context
  {
    const probe = load({}); G.R(probe, PROLOGUE);
    const ids = G.R(probe, `ROADSIDE.map(e => e.id)`);
    for (const id of ids) {
      await drive(`await ROADSIDE.find(e => e.id === '${id}').run();`,
        `scene = worldScene3; loadScene('roadside', -1, 3, 0);`);
      if (process.exitCode) break;
    }
    if (!process.exitCode) assert(true, 'all ' + ids.length + ' roadside events complete: ' + ids.join(','));
  }
  // ACT I side scenes
  {
    const ctx = await drive(`await SCENES.canyon_main.ents().find(e => e.id === 'census').talk();`,
      `C3.stop = 1; scene = worldScene3; loadScene('canyon_main', -12, 8, 0);`);
    assert(G.R(ctx, `F3('censusDone')`), 'census lady completes');
  }
  {
    const ctx = await drive(`await SCENES.motel_lot.ents().find(e => e.id === 'mitch').talk();`,
      `C3.stop = 2; scene = worldScene3; loadScene('motel_lot', -5, 16, 0);`);
    assert(G.R(ctx, `F3('mitchDone')`), 'mitch completes');
  }
  {
    const ctx = await drive(`await SCENES.plaza_lot.ents().find(e => e.id === 'bud').talk();`,
      `C3.stop = 3; scene = worldScene3; loadScene('plaza_lot', 32, 22, 0);`);
    assert(G.R(ctx, `F3('budDone')`), 'preacher bud completes');
  }
  // crate open in a new scene
  {
    const ctx = await drive(`const e = WX.ents.find(e => e.id === 'crate17'); await e.talk(e);`,
      `C3.stop = 9; scene = worldScene3; loadScene('lodge_hall', -8, 5, 0);`);
    assert(G.R(ctx, `C3.crates[17] === 1`), 'crate 17 opens in lodge_hall');
  }
  console.log(process.exitCode ? 'SPOT FAILURES' : 'ALL SPOT CHECKS PASS');
})().catch(e => console.log('ERR', e && e.stack || e));
