// screenshots of the DARK MONDAY flow screens: node tools/dmflowshots.js  -> tools/shots/dmf_*.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load(), R = s => X.R(ctx, s);
const shot = n => X.png(ctx, path.join(__dirname, 'shots', 'dmf_' + n + '.png'));
(async () => {
  R('anyKey = true; post.fade = 0; run(titleScreen);'); await X.step(ctx, 80); shot('title');
  R('MENUS.length = 0; DLG = null; scene = null; run(async () => { await partySelect(); });'); await X.step(ctx, 6); shot('select');
  R("scene = null; run(async () => { backdrop('diner'); post.fade = 0; await N(\"OUT IN THE NEVADA DESERT, GARF'S DINER IS OPEN TWENTY-FOUR HOURS. THE LASAGNA IS A FOOD GROUP.\"); });"); await X.step(ctx, 80); shot('intro_diner');
  R("DLG = null; scene = null; run(async () => { backdrop('door'); post.fade = 0; await N('ON SUNDAY NIGHT A DOOR APPEARED UNDER THE FREEZER. IT WASN\\'T THERE ON SATURDAY. IT HUMS.'); });"); await X.step(ctx, 80); shot('intro_door');
  // a conversation with a portrait over the world
  R("DLG = null; newGame(2, ['CARL','LINDA','JB','FACE'], true); scene = worldScene; GM.x = 8; GM.y = 12; GM.dir = 3; GM.hold = 1; run(async () => { await say('Hello. Do you know what a generator is?', 'FACE'); });"); await X.step(ctx, 70); shot('talk');
  console.log('ok');
})();
