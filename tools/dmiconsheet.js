// contact sheet of every item icon at 4x: node tools/dmiconsheet.js -> tools/shots/dm_icons.png
const X = require('./dmvm.js'), path = require('path'); const ctx = X.load();
X.R(ctx, `cls(hex('#0a0814')); let i = 0; for (const id of Object.keys(ITEMS).filter(k => !ITEMS[k].hidden)) { const b = itemIcon(id), x = 6 + (i % 12) * 42, y = 6 + ((i / 12) | 0) * 36; panel(x - 2, y - 2, 30, 30); blit(b, x + 2, y + 2); text(String(i), x + 2, y + 22, hex('#6a7cc8'), null); i++; }`);
X.png(ctx, path.join(__dirname, 'shots', 'dm_icons.png')); console.log('ok', X.R(ctx, 'Object.keys(ITEMS).filter(k => !ITEMS[k].hidden).length'));
