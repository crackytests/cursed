// node tools/dmshot.js <out.png> "<js to run after load>" [frames]   writes a 2x3 PNG of the screen into tools/shots/
const X = require('./dmvm.js'), path = require('path');
const [out = 'dm.png', js = '', fr = '4'] = process.argv.slice(2);
const ctx = X.load();
(async () => { X.R(ctx, 'anyKey = true;' + js); await X.step(ctx, +fr); const p = path.join(__dirname, 'shots', out); X.png(ctx, p); console.log('wrote', p); })().catch(e => console.log('ERR', e));
