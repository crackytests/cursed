// contact sheet of every scene: node tools/scenes.js
const X = require('./vm.js'), path = require('path'); const ctx = X.load();
X.R(ctx, `cls(hex('#000')); const names = Object.keys(SCENES); names.forEach((s, i) => { const b = SCENES[s](); const x = (i % 2) * 256, y = ((i / 2) | 0) % 2 * 128; for (let j = 0; j < 128; j++) for (let k = 0; k < 256; k++) pset(x + k, y + j, b.d[((j * 176 / 128) | 0) * 512 + k * 2]); });`);
X.png(ctx, path.join(__dirname, 'shots', 'scenes.png'));
for (const [n, a] of [['a', 0], ['b', 4]]) { X.R(ctx, `cls(hex('#000')); Object.keys(SCENES).slice(${a}, ${a + 4}).forEach((s, i) => { const b = SCENES[s](); const x = (i % 2) * 256, y = ((i / 2) | 0) * 128; for (let j = 0; j < 128; j++) for (let k = 0; k < 256; k++) pset(x + k, y + j, b.d[((j * 176 / 128) | 0) * 512 + k * 2]); });`); X.png(ctx, path.join(__dirname, 'shots', 'scenes_' + n + '.png')); }
console.log('ok');
