// CARL 3 headless loader. The script list is read from carl3/index.html, so new content files are picked up automatically.
const G = require('./g2vm');
const fs = require('fs'), path = require('path');
const FILES = [...fs.readFileSync(path.join(G.ROOT, 'carl3/index.html'), 'utf8').matchAll(/<script src="([^"]+)\.js"/g)].map(m => path.posix.normalize('carl3/' + m[1]));
const FAST = `loop = function (t) { acc = Math.min(acc + (t - lastT), 50); lastT = t; if (acc >= 16) { acc -= 16.667; pollInput(); frame++; if (scene && scene.update) scene.update(); const w = waiters; waiters = []; w.forEach(r => r()); } };`;
function load(LS = {}) { return G.load(FILES.filter(f => fs.existsSync(path.join(G.ROOT, f + '.js'))), LS); }
module.exports = { load, FILES, G, FAST };
