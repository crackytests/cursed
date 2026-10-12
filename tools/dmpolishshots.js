// screenshots of the polish screens: node tools/dmpolishshots.js -> tools/shots/dmp_*.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load({}), R = s => X.R(ctx, s);
const shot = n => X.png(ctx, path.join(__dirname, 'shots', 'dmp_' + n + '.png'));
(async () => {
  R("anyKey = true; newGame(1, ['CARL','LINDA','JB','FACE'], true); scene = worldScene; OPT.notebook = 1;");
  R('run(protection)'); await X.step(ctx, 40); shot('wheel'); R('kb.c = 1'); await X.step(ctx, 2); R('kb.c = 0'); await X.step(ctx, 10); shot('wheel_manual');
  R('kb.b = 1'); await X.step(ctx, 2); R('kb.b = 0'); await X.step(ctx, 2); R("dmMeta().protect = 1; store('dm_meta', { protect: 1, ends: {} }); scene = worldScene; MENUS.length = 0; DLG = null;");
  R('run(async () => { await manual(1); })'); await X.step(ctx, 6); shot('manual_controls'); R('kb.b = 1'); await X.step(ctx, 2); R('kb.b = 0'); await X.step(ctx, 4);
  R('run(async () => { await manual(4); })'); await X.step(ctx, 6); shot('manual_spells'); R('kb.b = 1'); await X.step(ctx, 2); R('kb.b = 0'); await X.step(ctx, 4);
  R("scene = worldScene; GM.x = 14; GM.y = 10; GM.dir = 2; markSeen(GM); for (const [x, y] of [[9,2],[9,5],[8,8],[12,2],[14,3],[14,6],[14,8]]) { GM.x = x; GM.y = y; markSeen(GM); } GM.x = 14; GM.y = 8; run(showMap);"); await X.step(ctx, 25); shot('map');
  R('kb.b = 1'); await X.step(ctx, 2); R('kb.b = 0'); await X.step(ctx, 4);
  R("scene = worldScene; globalThis.__c = 0; run(async () => { await SCENES.chatButton(GM); });"); for (let k = 0; k < 400 && !R('CHATQ'); k++) { R('kb.a = ' + (k % 6 === 0 ? 1 : 0)); await X.step(ctx, 1); } R('kb.a = 0'); await X.step(ctx, 30); shot('chat');
  R('CHATQ.res(0); CHATQ = null; GM.hold = 0; DLG = null; MENUS.length = 0'); await X.step(ctx, 3);
  R('scene = null; run(titleScreen)'); await X.step(ctx, 60); R('kb.a = 1'); await X.step(ctx, 2); R('kb.a = 0'); await X.step(ctx, 8); shot('title_menu');
  R('MENUS.length = 0; run(optionsMenu)'); await X.step(ctx, 8); shot('options');
  console.log('ok');
})();
