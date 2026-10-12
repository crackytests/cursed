// node tools/shot.js "<js that draws into SCREEN>" out.png
const X = require('./vm.js'), path = require('path'); const ctx = X.load();
X.R(ctx, process.argv[2]); X.png(ctx, path.join(__dirname, 'shots', process.argv[3] || 'shot.png')); console.log('wrote', process.argv[3]);
