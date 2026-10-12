// the intro illustrations: node tools/dmstillshots.js -> tools/shots/dms_*.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load({}), R = s => X.R(ctx, s);
(async () => {
  R("INTRO_PARTY = ['CARL','LINDA','GHOST','JB']; post.fade = 0;");
  for (const name of Object.keys(R('BACKDROPS'))) { R(`scene = null; backdrop(${JSON.stringify(name)})`); await X.step(ctx, 50); X.png(ctx, path.join(__dirname, 'shots', 'dms_' + name + '.png')); }
  console.log('ok');
})();
