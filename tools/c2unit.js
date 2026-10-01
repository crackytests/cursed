// CARL 2 branch tests: call story functions directly in odd states and make sure nothing throws or hangs.
// node tools/c2unit.js   (each case auto-advances dialog and custom screens, picks menu option `pick` (default 0; an array is a
// sequence, one per menu, then the last option), has a frame budget, and lets any story the call kicked off settle before the check)
const { load, G } = require('./c2vm');
const DBG_ENDING = ctx => G.R(ctx, '!!DBG.ending');
const cases = [
  ['delivery: mall cop', 'C2.ep = 4; setF2("dq_0", 1); loadMap("mall", 30, 9, "u")', 'copNPCTalk()', 'dq(0) === 2'],
  ['delivery: face', 'C2.ep = 4; setF2("dq_1", 1); loadMap("lostfound", 6, 5, "u")', 'lostFoundTalk().then(() => facelessTalk2())', 'dq(1) === 2'],
  ['delivery: tab', 'C2.ep = 4; setF2("dq_2", 1); loadMap("mall", 22, 6, "u")', 'lindaScreenTalk()', 'dq(2) === 2'],
  ['delivery: ticket', 'C2.ep = 4; setF2("dq_3", 1); loadMap("desert", 27, 22, "u")', 'hitchTalk2()', 'dq(3) === 2 && C2.tapes.includes(3)'],
  ['delivery: fan mail', 'C2.ep = 4; setF2("dq_4", 1); loadMap("lot", 14, 19, "u")', 'fanTalk().then(() => ghostTalk2())', 'dq(4) === 2'],
  ['dispatch menu', 'C2.ep = 4; setF2("ep4start"); loadMap("ship", 8, 4, "u")', 'dispatchRadio()', 'true'],
  ['swap companion', 'C2.ep = 4; setF2("ep4start"); setF2("garfJoined"); setF2("bruceMet"); C2.comp = "garf"; loadMap("ship", 8, 4, "u")', 'swapComp()', 'C2.comp === "garf"'],
  ['nav', 'C2.ep = 5; setF2("ship"); setF2("moonOpen"); setF2("moonVisited"); C2.visited = { lot: 1, desert: 1, lake: 1 }; loadMap("ship", 2, 4, "u")', 'navConsole()', 'true'],
  ['face talk (nothing ending)', 'C2.ep = 4; setF2("faceClear"); OTHER.face = { ending: "nothing" }; loadMap("setface", 12, 7, "u")', 'faceTalk2()', 'F2("sig_face")'],
  ['pk talk (let go)', 'C2.ep = 4; setF2("pkClear"); OTHER.pk = { letgo: 1 }; loadMap("setpk", 26, 5, "u")', 'pkTalk2()', 'F2("sig_pk")'],
  ['yoko talk', 'C2.ep = 4; setF2("yokoClear"); loadMap("setyoko", 12, 5, "u")', 'yokoTalk2()', 'F2("sig_yoko")'],
  ['bargain bin', 'C2.ep = 4; loadMap("backlot", 34, 25, "u")', 'bargainBin()', 'C2.tapes.includes(5)'],
  ['clip show', 'C2.ep = 4; loadMap("ship", 7, 6, "d")', 'clipShow()', 'true'],
  ['bong shop', 'C2.ep = 2; C2.bux = 500; loadMap("emporium", 3, 5, "u")', 'bongShop()', 'C2.bongs.length === 2 && C2.bux < 500', [0, 0]],
  ['bong-o-matic', 'C2.ep = 3; C2.bux = 100; C2.bongs.push(genBong(3), genBong(3)); loadMap("emporium", 10, 5, "u")', 'bongOMatic()', 'C2.bongs.length === 2'],
  ['photo booth', 'C2.ep = 1; loadMap("mall", 33, 19, "u")', 'photoBooth2()', 'F2("photo") === 1'],
  ['tape menu', 'C2.tapes = [0, 3, 7]; loadMap("ship", 7, 6, "d")', 'tapeMenu2()', 'true'],
  ['status', 'loadMap("ship", 7, 6, "d")', 'statusScreen2()', 'true'],
  ['committee notes (accept)', 'C2.ep = 2; loadMap("desert", 23, 27, "u")', 'committeeNote(2).then(() => committeeNote(3)).then(() => committeeNote(4)).then(() => committeeNote(5))', 'C2.dmgMul > 1 && C2.spdMul > 1 && C2.catch && C2.human >= 28'],
  ['counter with ticket', 'C2.ep = 6; setF2("special"); setF2("hocDown"); C2.tapes = [0,1,2,3,4,5,6,7]; C2.human = 0; loadMap("lostfound", 7, 3, "d")', 'lostFoundTalk()', 'C2.ticket === 1 && WD.id === "backstage"'],
  ['counter without ticket', 'C2.ep = 6; setF2("special"); setF2("hocDown"); C2.tapes = [0]; C2.human = 50; loadMap("lostfound", 7, 3, "d")', 'lostFoundTalk()', 'C2.ticket === 0 && WD.id === "backstage"'],
  ['ending: renewed', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endRenewed()', 'C2META.ends.renewed && C2META.renewed'],
  ['ending: canceled', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endCanceled()', 'C2META.ends.canceled && !C2META.renewed'],
  ['ending: boogaloo', 'C2.ep = 7; C2.comp = "bruce"; loadMap("studio", 12, 12, "u")', 'endBoogaloo()', 'C2META.ends.boogaloo'],
  ['ending: below below', 'C2.ep = 7; C2.ticket = 1; loadMap("studio", 12, 12, "u")', 'endBelowBelow()', 'C2META.ends.belowbelow'],
  ['ending: dream', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endDream()', 'C2META.ends.dream'],
  ['final offer at HUMAN 80', 'C2.ep = 7; C2.human = 80; loadMap("studio", 12, 12, "u")', 'finalOffer()', 'C2META.last === "renewed"', 1],
  ['continue in the studio', 'C2.ep = 7; loadMap("ship", 7, 6, "d"); C2.map = "studio"; C2.x = 12; C2.y = 12; saveC2()', 'continueGame(fetchStore("carl2_save"))', 'F2("finaleOn") && WD.id === "studio"'],
  ['lost cool', 'C2.ep = 2; loadMap("desert", 23, 20, "u"); C2.hp = 1; PL.inv = 0', 'Promise.resolve(hurtPlayer(5, PL.x + 5, PL.y))', 'C2.hp === C2.maxhp && C2.cools === 1 && !PL.dead'],
  ['marina: committee (first)', 'C2.ep = 3; setF2("lakeIntro"); loadMap("lake", 14, 11, "u")', 'lakeCommittee()', 'F2("marinaQuest") && OBJ.map === "marina"'],
  ['marina: committee (all three)', 'C2.ep = 3; for (const f of ["marinaQuest","gotJacket","gotSkis","gotRamp"]) setF2(f); loadMap("lake", 14, 11, "u")', 'lakeCommittee()', 'F2("jacket") && OBJ.map === "lake"'],
  ['marina: cool guy (argument stubbed to a win)', 'C2.ep = 3; setF2("marinaQuest"); argue2 = async () => true; loadMap("marina", 9, 4, "u")', 'coolGuyTalk()', 'F2("gotJacket")'],
  ['marina: old salt', 'C2.ep = 3; setF2("marinaQuest"); setF2("gotJacket"); loadMap("marina", 20, 4, "u")', 'oldSaltTalk()', 'F2("rampAsked") && OBJ.map === "boathouse"'],
  ['marina: take the ramp', 'C2.ep = 3; for (const f of ["marinaQuest","rampAsked","gullsDown"]) setF2(f); loadMap("boathouse", 10, 4, "u")', 'takeRamp()', 'F2("gotRamp")'],
  ['marina: lifeguard down', 'C2.ep = 3; setF2("marinaQuest"); loadMap("marina", 27, 13, "u")', 'lifeguardDown()', 'F2("gotSkis")'],
  ['moon: comrade wants a shift', 'C2.ep = 5; setF2("moonIntro"); loadMap("moon", 17, 12, "u")', 'comradeTalk()', 'F2("shiftAsked") && !F2("comradeDone")'],
  ['moon: work board', 'C2.ep = 5; setF2("shiftAsked"); setF2("shiftField"); loadMap("moonhall", 5, 4, "u")', 'workBoard()', 'true'],
  ['moon: valves', 'C2.ep = 5; for (const f of ["shiftAsked","shiftField","shiftChoir"]) setF2(f); loadMap("reactor", 3, 10, "u")', 'turnValve(1).then(() => turnValve(2)).then(() => turnValve(3)).then(() => turnValve(3))', 'valvesOpen() === 3 && !live(ent("blast") || { gone: 1 }) && OBJ.text.includes("core")'],
  ['moon: plan down', 'C2.ep = 5; for (const f of ["shiftAsked","shiftField","shiftChoir"]) setF2(f); loadMap("reactor", 12, 5, "u")', 'planDown()', 'F2("collective") && OBJ.map === "moon"'],
  ['moon: soup', 'C2.ep = 5; loadMap("moonhall", 9, 6, "u"); C2.hp = 3', 'ent("soup").talk()', 'C2.hp === C2.maxhp'],
  ['loot crate', 'C2.ep = 5; loadMap("moonhall", 2, 10, "d")', 'ent("loot_hall1").talk()', 'C2.bongs.length === 2 && F2("loot_hall1")'],
  ['backstage: stage door shut', 'C2.ep = 7; loadMap("backstage", 14, 3, "u")', 'stageDoorNo().then(() => stageMgrTalk())', 'OBJ.map === "segA"'],
  ['backstage: craft services', 'C2.ep = 7; C2.bux = 0; loadMap("backstage", 4, 5, "u")', 'craftServices()', 'C2.pretzels >= 2 && F2("craftPretzel")', [4]],
  ['backstage: cameos', 'C2.ep = 7; setF2("garfJoined"); setF2("bruceMet"); loadMap("backstage", 14, 8, "u")', '["face","pk","yoko","ghost","linda","garf","bruce"].reduce((p, k) => p.then(() => backstageCameo(k)), Promise.resolve())', 'true'],
  ['backstage: segments done', 'C2.ep = 7; setF2("segA"); setF2("segB"); loadMap("segB", 10, 7, "u")', 'segDone("B")', 'OBJ.map === "studio"'],
  ['studio: live intro', 'C2.ep = 7; setF2("segA"); setF2("segB"); loadMap("studio", 12, 15, "u")', 'studioEnter()', 'F2("finaleOn")'],
  ['start of episode 7', 'C2.ep = 6; loadMap("lostfound", 7, 3, "d")', 'startEp7()', 'WD.id === "backstage" && C2.ep === 7 && OBJ.map === "segA"'],
  ['humanTransform', 'C2.ep = 2; setF2("power"); C2.meter = 100; loadMap("desert", 23, 20, "u")', 'humanTransform()', 'PL.humanT > 0 && C2.transforms === 1'],
];
(async () => {
  let fails = 0;
  for (const [name, setup, call, check, pickIdx] of cases) {
    const ctx = load({ carl_meta: '{"endings":1}' });
    try {
      G.R(ctx, `anyKey = true; C2 = newC2(); scene = worldScene; ${setup}; DBG.unitDone = 0; DBG.unitErr = null; run(async () => { try { await ${call}; } catch (e) { DBG.unitErr = String(e && e.stack || e); } DBG.unitDone = 1; });`);
      let T = 0, f = 0, settle = 0, seen = 0;
      const seq = Array.isArray(pickIdx) ? pickIdx : null;
      G.R(ctx, 'DBG.unitMenu = null');
      for (; f < 12000; f++) {
        const inMenu = G.R(ctx, 'MENUS.length'), k = f % 4 === 0;
        if (inMenu) {
          if (G.R(ctx, 'DBG.unitMenu !== MENUS[MENUS.length - 1] && (DBG.unitMenu = MENUS[MENUS.length - 1], true)')) seen++;
          const want = seq ? (seen - 1 < seq.length ? seq[seen - 1] : 99) : (pickIdx || 0);
          G.R(ctx, `(() => { const m = MENUS[MENUS.length - 1]; const want = Math.min(${want}, m.opts.length - 1); for (const q of ['up','down','a','b','c']) kb[q] = 0; if (${k}) { if (m.i !== want) kb.down = 1; else kb.a = 1; } })()`);
        } else G.R(ctx, `for (const q of ['up','down','a','b','c','start']) kb[q] = 0; if (${k} && (DLG || CARD || CHATBOX || DBG.credits || scene !== worldScene)) { kb.a = 1; kb.start = DBG.credits ? 1 : 0; }`);
        T += 16.7; G.R(ctx, `loop(${T})`); await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r));
        // after the call resolves, give whatever it started (map enter scripts, lost-cool) time to finish
        if (G.R(ctx, 'DBG.unitDone')) { if (G.R(ctx, '!WD.hold && !DLG && !CARD && !MENUS.length && scene === worldScene') || DBG_ENDING(ctx)) { if (++settle > 30) break; } else settle = 0; }
      }
      const err = G.R(ctx, 'DBG.unitErr'), done = G.R(ctx, 'DBG.unitDone'), ok = done && !err && G.R(ctx, check);
      if (!ok) fails++;
      console.log((ok ? 'ok   ' : 'FAIL ') + name + (done ? '' : ' (TIMEOUT at ' + f + ')') + (err ? ' ' + err.split('\n').slice(0, 3).join(' | ') : '') + (!ok && done && !err ? ' check failed: ' + check : ''));
    } catch (e) { fails++; console.log('FAIL ' + name + ' threw ' + e); }
  }
  console.log(fails ? fails + ' FAILED' : 'ALL OK');
})();
