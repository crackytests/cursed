// full playthrough test for NEO MONDAY: dialogue stubbed, fights played frame by frame by a bot that reads DBG.gal.
const X = require('./vm.js');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const texts = new Set();
async function fresh() {
  const ctx = X.load(), R = s => X.R(ctx, s); ctx.QUEUE = []; ctx.LOG = [];
  R(`say = async (s, who) => { LOG.push([who || 'N', String(s)]); };
     choose = async (opts, o = {}) => { LOG.push(['MENU', opts.join('|')]); const q = QUEUE.shift(); if (q === undefined || q === null) return o.cancel !== undefined ? -1 : opts.length - 1;
       const i = typeof q === 'number' ? q : opts.findIndex(x => x.toUpperCase().startsWith(String(q).toUpperCase())); if (i < 0) throw new Error('menu has no option ' + q + ' in [' + opts.join('|') + ']'); return i; };
     showCard = async l => { LOG.push(['CARD', l.join(' ')]); }; wait = async () => {}; fadeTo = async v => { post.fade = v; }; diskCard = async n => { LOG.push(['DISK', n]); };
     scene = stageScene; S = newState();`);
  return { ctx, R };
}
const harvest = T => { for (const [k, s] of T.ctx.LOG) (k === 'MENU' ? s.split('|') : [s]).forEach(t => texts.add(String(t))); };
// drive real frames until an async game call settles; the bot aims at whatever is shooting
async function drive(T, code, max = 40000) {
  let done = false, err; const p = T.R(code); p.then(() => done = true, e => { err = e; done = true; });
  let n = 0;
  while (!done && n < max) {
    if (T.R('DBG.mode') === 'gal') {
      const es = T.R('DBG.gal.es.filter(e => !e.dead && e.vis > .5).map(e => [e.x, e.sl.y - e.spr.h * e.vis + 8, e.state === "aim" ? 1 : 0])');
      if (es.length) { const t = es.find(e => e[2]) || es[0]; T.R(`DBG.gal.cx = ${t[0]}; DBG.gal.cy = ${t[1]}; kb.a = ${n % 2}`); } else T.R('kb.a = 0');
    }
    await X.step(T.ctx, 1); n++;
  }
  T.R('kb.a = 0'); if (err) throw err; return n;
}
const Q = (T, ...q) => { T.ctx.QUEUE.length = 0; T.ctx.QUEUE.push(...q); };

// plays acts 1 and 2 through the scene functions; returns the state at the lift
async function toLift() {
  const T = await fresh(), R = T.R;
  await R('SC.freezer.enter()'); ok(R('F("woke")'), 'wakes in the freezer');
  ok(await R('SC.freezer.move[0][2]()') === false, 'sealed door, no coat: cannot leave yet');
  await R('SC.freezer.inv[1].fn()'); ok(R('F("dressed")'), 'locker gives the coat');
  await R('SC.freezer.inv[3].fn()'); ok(R('F("door")'), 'Kuma opens the door');
  ok(await R('SC.freezer.move[0][2]()') === true, 'now the plant is open');
  let n = await drive(T, 'SC.plant.enter()'); ok(R('F("ambush")'), 'plant ambush won by the bot (' + n + ' frames)'); ok(R('post.fade') === 0 && R('scene === stageScene'), 'screen is visible again after the fight');
  ok(await R('SC.plant.move[1][2]()') === false, 'cannot leave the plant before searching the wreckage');
  await R('SC.plant.inv[2].fn()'); ok(R('has("BADGE")'), 'badge found'); await R('SC.plant.inv[2].fn()'); ok(R('hasClue("chassis")'), 'chassis clue found');
  ok(await R('SC.plant.move[1][2]()') === true, 'street open');
  await R('SC.street.enter()'); ok(R('F("street")'), 'street intro + disk 2');
  ok(await R('SC.street.move[2][2]()') === false, 'morgue is closed until we have asked around');
  await R('SC.bar.enter()'); await R('SC.bar.ask[0].fn()'); ok(R('F("lucky")'), 'Lucky talks about Harold');
  await R('SC.bar.ask[1].fn()'); ok(R('hasClue("diet")'), 'diet clue');
  Q(T, 1); await R('SC.bar.inv[0].fn()'); ok(R('F("accused")'), 'wrong theory (Lucky) is tried and exposed');
  await drive(T, 'SC.bar.inv[1].fn()'); ok(R('hasClue("stool")') && R('F("ambushB")'), 'stool clue, and the bar ambush was fought'); await R('SC.bar.inv[2].fn()'); await R('SC.bar.inv[3].fn()');
  n = await drive(T, 'SC.street.enter()'); ok(R('F("ambush2")'), 'street ambush won (' + n + ' frames)');
  Q(T, 0); await R('SC.office.enter()'); ok(R('F("phone")') && R('F("gaveBadge")') && !R('has("BADGE")'), 'office: handing over the badge works');
  await R('SC.office.inv[1].fn()'); ok(R('has("LASAGNA")'), 'lasagna in the drawer');
  await R('SC.office.inv[2].fn()'); ok(R('hasClue("file")'), 'Harold\'s file');
  await R('SC.office.ask[2].fn()'); ok(R('hasClue("noeat")'), 'Vane refuses lasagna');
  await R('SC.morgue.enter()'); await R('SC.morgue.inv[1].fn()'); ok(R('hasClue("port")'), 'port clue');
  await drive(T, 'SC.morgue.inv[2].fn()'); ok(R('hasClue("transfer")') && R('F("knows")') && R('F("ambushM")'), 'transfer clue; we know; the morgue ambush was fought');
  ok(R('recap().next.length') > 0 && R('recap().known.length') >= 6, 'THINK recaps what we know');
  Q(T, 3, 3); await R('phone()'); ok(R('F("code")'), 'phone code obtained via the employee hotline');
  return T;
}

(async () => {
  for (const ec of [2, 0, 1]) {
    const T = await toLift(), R = T.R, kind = ['merge', 'delete', 'keep'][ec];
    // keypad (wrong day first, then the right one), the three right pieces of evidence, then the ending choice
    Q(T, 'FRIDAY', 'MONDAY', 'The transfer', 'Vane refuses', 'Harold\'s last note', ec);
    let n; try { n = await drive(T, 'liftDown()', 90000); } catch (e) { console.log('CRASH finale', e.stack || e); fails++; continue; }
    ok(n < 90000, 'boss fight and ending finished (' + n + ' frames)');
    ok(R('(fetchStore("neomonday_meta")||{ends:{}}).ends["' + kind + '"]') === 1, 'ending "' + kind + '" recorded');
    ok(R('scene !== stageScene'), 'returned to the title after the ending, no hub left running');
    harvest(T);
  }
  for (const ec of [0, 1, 2]) { // CASE 2
    const T = await fresh(), R = T.R, kind = ['tuesday', 'live', 'monday'][ec];
    R('S = newState(); S.case = 2; S.scene = "office2"');
    await R('SC.office2.enter()'); ok(R('F("c2odell")') && R('has("RADIO")'), 'case 2: Mrs. Odell hires JB and hands over the radio');
    await R('SC.office2.inv[0].fn()'); ok(R('hasClue("voice")'), 'the radio plays a voice that matches JB'); await R('SC.office2.inv[0].fn()'); ok(R('hasClue("sponsorTag")'), 'the radio carries the sponsor stamp');
    await R('SC.office2.inv[2].fn()'); ok(R('hasClue("tower")'), 'the window shows the tower');
    await R('SC.street2.enter()'); await R('SC.street2.inv[0].fn()'); ok(R('hasClue("relay")'), 'the street speakers are the relay');
    ok(await R('SC.street2.move[0][2]()') === true && await R('SC.street2.move[1][2]()') === false, 'warehouse open, studio not yet');
    let n = await drive(T, 'SC.warehouse.enter()'); ok(R('F("raymond")') && R('F("arrested")') && R('S.scene') === 'jail', 'warehouse fight won, JB arrested and in the cell (' + n + ' frames)');
    await R('SC.warehouse.inv[0].fn()'); ok(R('hasClue("can")'), 'the powder can holds a chip');
    ok(await R('SC.jail.move[0][2]()') === false, 'cannot break out before talking to Fuse');
    for (let i = 0; i < 4; i++) await R('SC.jail.ask[' + i + '].fn()'); ok(R('F("fuseTower") && F("fuseLoop") && F("fuseSafe")'), 'Fuse gives the tower, the loop rule and the safe hint');
    Q(T); n = await drive(T, 'SC.jail.move[0][2]()'); ok(R('F("jailbreak")'), 'jail break fought and won (' + n + ' frames)');
    n = await drive(T, 'SC.studio.enter()'); ok(R('F("studioFight")'), 'studio fight won (' + n + ' frames)');
    ok(await R('SC.studio.move[1][2]()') === false, 'the roof is closed until we have the tape and the contract');
    Q(T, 'MONDAY', 'TUESDAY'); await R('SC.studio.inv[0].fn()'); ok(R('has("TAPE")'), 'the safe opens on TUESDAY after a wrong day');
    await R('SC.studio.inv[1].fn()'); ok(R('hasClue("lullaby")'), 'the tape is Harold\'s lullaby'); await R('SC.studio.inv[2].fn()'); ok(R('hasClue("sponsor")') && R('hasClue("tuesdayClause")'), 'the contract and the Tuesday clause');
    ok(await R('SC.studio.move[1][2]()') === true && R('F("c2knows")'), 'the roof opens');
    ok(R('recap().known.length') >= 8 && R('recap().next.length') > 0, 'case 2 THINK recaps what we know');
    Q(T, 0, 1, 1, 1, ec); n = await drive(T, 'SC.tower.enter()', 120000);
    ok(R('(fetchStore("neomonday_meta")||{}).ends2["' + kind + '"]') === 1, 'case 2 ending "' + kind + '" recorded (' + n + ' frames)'); ok(R('scene !== stageScene'), 'returned to the title after case 2'); harvest(T);
  }
  { // wrong evidence is answered, not punished
    const T = await fresh(); T.R("S.clues = [['badge','A badge.'],['chassis','Chassis.'],['transfer','The transfer.'],['noeat','Noeat.'],['file','The file.']]; S.f.knows = 1;");
    T.ctx.QUEUE.push('A badge', 'Chassis', 'The transfer', 'The transfer', 'Noeat', 'The file'); await T.R('accusation()');
    ok(T.ctx.LOG.some(l => /rummaging|novel|points at somebody/.test(l[1])), 'wrong evidence gets an answer and the scene continues'); harvest(T);
  }
  { // every verb on every scene runs
    const T = await fresh(); let bad = 0;
    for (const id of Object.keys(T.R('SC'))) { T.R(`S.items = ['BADGE','LASAGNA']; S.f = { woke: 1, door: 1, dressed: 1, ambush: 1, lucky: 1, knows: 1, drawer: 1, phone: 1, office: 1, ambushM: 1, ambushB: 1, c2odell: 1, raymond: 1, arrested: 1, fuseMet: 1, jailbreak: 1, studioFight: 1 }; S.clues = []; STAGE = { art: SCENES[SC['${id}'].art || '${id}']() }`);
      for (const v of ['look']) try { await T.R(`SC['${id}'].look()`); } catch (e) { bad++; console.log(id, v, e.message); }
      for (const [k, list] of [['inv', 'inv'], ['ask', 'ask']]) { const len = T.R(`SC['${id}'].${list}.length`); for (let i = 0; i < len; i++) for (let r = 0; r < 3; r++) { T.R('S.clues = []; S.f.office = 1'); Q(T); try { await T.R(`SC['${id}'].${list}[${i}].fn()`); } catch (e) { if (!/menu has no option/.test(e.message)) { bad++; console.log(id, k, i, e.message); } } } }
    }
    for (const c of ['lucky', 'mira', 'chief', 'odell']) try { await T.R(`PHONES.${c}()`); } catch (e) { bad++; console.log('phone', c, e.message); }
    for (const c of [0, 1, 2, 3]) { Q(T, c); try { await T.R('PHONES.sundays()'); } catch (e) { bad++; console.log('sundays', c, e.message); } }
    ok(!bad, 'every look / investigate / ask / phone call runs without throwing'); harvest(T);
  }
  const T = await fresh(); const font = new Set(T.R('Object.keys(FONT).join("")').split('')); const bad = new Set();
  for (const s of texts) { for (const ch of s.replace(/\n/g, ' ')) if (!font.has(ch) && ch !== ' ') bad.add(JSON.stringify(ch) + ' in "' + s.slice(0, 60) + '"'); for (const w of s.split(/\s+/)) if (w.length > 74) bad.add('long word ' + w); }
  ok(!bad.size, 'all ' + texts.size + ' spoken lines use drawable characters' + (bad.size ? '\n  ' + [...bad].slice(0, 15).join('\n  ') : ''));
  const TR = JSON.parse(T.R('JSON.stringify(TRACKS)')), mb = [];
  for (const [n, t] of Object.entries(TR)) { const lens = t.ch.map(c => c.n.trim().split(/ +/).length); if (new Set(lens).size > 1 || lens[0] % 16) mb.push(n + ':' + lens); }
  ok(!mb.length, 'every track loops evenly' + (mb.length ? ' ' + mb.join(' ') : ''));
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('CRASH', e.stack || e); process.exit(1); });
