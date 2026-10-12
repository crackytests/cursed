// contact sheet of monster and NPC sprites: node tools/dmmonsheet.js -> tools/shots/dm_mons.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load();
X.R(ctx, `cls(hex('#0a0814')); let x = 8; for (const t of ['INTERN', 'SPIDER', 'COLLECTOR']) { const s = monSprite(t); blit(s, x, 120 - s.h + 40); x += s.w + 14; } const k = npcSprite('PEEKID'); blit(k, x, 120 - k.h + 40);`);
X.png(ctx, path.join(__dirname, 'shots', 'dm_mons.png')); console.log('ok');
