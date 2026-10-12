// node tools/kwshot.js <out.png> "<js to run after load>" [frames]   2x3 PNG into tools/shots/ (boot() is stripped: the js sets up the scene)
const X = require('./kwvm.js'), path = require('path');
const [out = 'kw.png', js = 'boot()', fr = '4'] = process.argv.slice(2);
const ctx = X.load();
(async () => { X.R(ctx, js); await X.step(ctx, +fr); const p = path.join(__dirname, 'shots', out); X.png(ctx, p); console.log('wrote', p); })().catch(e => console.log('ERR', e));
