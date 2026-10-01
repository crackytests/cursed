// YOKO requests: walk every request's intended solution through the real scene code. node tools/yreq.js
// Dialogs, battles, menus and the mandolin lesson are stubbed to "succeed instantly"; everything else is the game's own logic.
const G = require('./g2vm');
const ctx = G.load(['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'yoko/battle', 'yoko/adv', 'yoko/chapters', 'yoko/chapters2', 'yoko/content', 'yoko/ymain'], { pk_meta: JSON.stringify({ cleared: 1, letgo: 1 }) });
G.R(ctx, `say = async () => {}; battle = async () => 'win'; choose = async () => 0; ask = async () => 0; mandolinLesson = async () => true; goScene = async id => { ADV.cur = id; }; music = () => {}; wait = async () => {}; resetRun();`);
const steps = {
  home: [1, "SCN.atrium.look()['THE SHOPPERS']()", "SCN.atrium.translate()['THE STILL SHOPPER']()", "SCN.atrium.suggest()['CARL: DON\\'T GIVE HIM A RIDE']()"],
  drink: [1, "setFL('metGarf')", "SCN.suitors.talk().BARTENDER()", "SCN.suitors.suggest()['GARFIELD: HAVE A DRINK']()"],
  coffee: [1, "SCN.office.look()['THE COFFEE MACHINE']()", "SCN.office.translate()['THE MACHINE\\'S DISPLAY']()"],
  returns: [1, "SCN.cooters.talk().JUAN()", "SCN.cooters.look()['THE BACK ROOM']()", "SCN.cooters.translate()['THE RETURN LABELS']()", "SCN.cooters.talk().JUAN()"],
  wives: [2, "setFL('ghostJoined')", "SCN.tower.look()['THE EX-WIVES']()", "SCN.tower.suggest()['GHOST: APOLOGIZE']()"],
  form: [2, "setFL('file')", "SCN.archive.talk()['BACKUP FACE']()", "SCN.archive.suggest()['CARL: DON\\'T SIGN FORM 27']()"],
  time: [2, "SCN.generator.talk()['PEE KID']()", "SCN.generator.look()['BEHIND THE GENERATOR']()"],
  delivery: [4, "SCN.plaza.talk().KARL()", "SCN.mdiner.talk()['JB GARFEILD']()"],
  song: [4, "SCN.school.talk()['SPOOKEY GHOST']()", "SCN.school.talk()['SPOOKEY GHOST']()"],
  pretzels: [5, "SCN.barracks.translate()['UNIT 0451']()", "SCN.deck.talk()['WARWORLD YOKO']()"],
};
(async () => {
  let ok = 0;
  for (const [id, [ch, ...js]] of Object.entries(steps)) {
    G.R(ctx, `ADV.ch = ${ch};`);
    let err = null;
    for (const s of js) { try { await G.R(ctx, `(async () => { await ${s}; })()`); } catch (e) { err = s + ' -> ' + e.message; break; } }
    const st = G.R(ctx, `reqState('${id}')`);
    console.log((st === 2 ? 'PASS ' : 'FAIL ') + id.padEnd(9) + (err ? '  ' + err : st === 2 ? '' : '  state=' + st));
    if (st === 2) ok++;
  }
  console.log(ok + '/' + Object.keys(steps).length + ' requests completable; YREC.helped=' + G.R(ctx, 'YREC.helped'));
  console.log('notes:', G.R(ctx, 'ADV.ch = 5; reqOpenList().length + " open, " + reqLapsed().length + " lapsed"'));
})();
