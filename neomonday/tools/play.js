// node tools/play.js <name> "<async js run after load>" [frames]   -> tools/shots/<name>.png (real dialogue, real menus)
const X = require('./vm.js'), path = require('path'); const ctx = X.load();
(async () => {
  X.R(ctx, 'post.fade = 0; DLG = null;'); X.R(ctx, 'run(async () => {' + process.argv[3] + '})'); await X.step(ctx, +process.argv[4] || 120);
  X.png(ctx, path.join(__dirname, 'shots', process.argv[2] + '.png')); console.log('wrote', process.argv[2]);
})();
