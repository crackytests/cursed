// contact sheet of the DARK MONDAY portraits: node tools/dmportsheet.js [scale] -> tools/shots/dm_ports.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load();
X.R(ctx, `cls(hex('#06040e')); let i = 0; for (const w of ['CARL','LINDA','GHOST','JB','FACE','YOKO','PEEKID','PILOTX']) { blit(portrait(w), (i % 4) * 126 + 8, ((i / 4) | 0) * 120 + 6); blit(smallPort(w), (i % 4) * 126 + 8 + 56, ((i / 4) | 0) * 120 + 6 + 62 + 0); i++; }`);
X.png(ctx, path.join(__dirname, 'shots', 'dm_ports.png')); console.log('ok');
