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
  ['counter with ticket', 'C2.ep = 6; setF2("special"); setF2("hocDown"); C2.tapes = [0,1,2,3,4,5,6,7]; C2.human = 0; loadMap("lostfound", 7, 3, "d")', 'lostFoundTalk()', 'C2.ticket === 1 && WD.id === "studio"'],
  ['counter without ticket', 'C2.ep = 6; setF2("special"); setF2("hocDown"); C2.tapes = [0]; C2.human = 50; loadMap("lostfound", 7, 3, "d")', 'lostFoundTalk()', 'C2.ticket === 0 && WD.id === "studio"'],
  ['ending: renewed', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endRenewed()', 'C2META.ends.renewed && C2META.renewed'],
  ['ending: canceled', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endCanceled()', 'C2META.ends.canceled && !C2META.renewed'],
  ['ending: boogaloo', 'C2.ep = 7; C2.comp = "bruce"; loadMap("studio", 12, 12, "u")', 'endBoogaloo()', 'C2META.ends.boogaloo'],
  ['ending: below below', 'C2.ep = 7; C2.ticket = 1; loadMap("studio", 12, 12, "u")', 'endBelowBelow()', 'C2META.ends.belowbelow'],
  ['ending: dream', 'C2.ep = 7; loadMap("studio", 12, 12, "u")', 'endDream()', 'C2META.ends.dream'],
  ['final offer at HUMAN 80', 'C2.ep = 7; C2.human = 80; loadMap("studio", 12, 12, "u")', 'finalOffer()', 'C2META.last === "renewed"', 1],
  ['continue in the studio', 'C2.ep = 7; loadMap("ship", 7, 6, "d"); C2.map = "studio"; C2.x = 12; C2.y = 12; saveC2()', 'continueGame(fetchStore("carl2_save"))', 'F2("finaleOn") && WD.id === "studio"'],
  ['lost cool', 'C2.ep = 2; loadMap("desert", 23, 20, "u"); C2.hp = 1; PL.inv = 0', 'Promise.resolve(hurtPlayer(5, PL.x + 5, PL.y))', 'C2.hp === C2.maxhp && C2.cools === 1 && !PL.dead'],
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
