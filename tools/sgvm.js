// SPOOKY GHOST 2 headless loader: shared file list + helpers
const G = require('./g2vm');
const FILES = ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'sg2/sgart', 'sg2/sgtiles', 'sg2/sgworld', 'sg2/sgdance', 'sg2/sgmaps', 'sg2/sgmaps2', 'sg2/sgstory', 'sg2/sgstory2', 'sg2/sgend', 'sg2/sgmain', 'sg2/sgmusic'];
const fs = require('fs'), path = require('path');
function load(LS = {}) { return G.load(FILES.filter(f => fs.existsSync(path.join(G.ROOT, f + '.js'))), LS); }
// skip drawing: the logic never depends on it (banner timers and fx are cosmetic)
const FAST = `loop = function (t) { acc = Math.min(acc + (t - lastT), 50); lastT = t; if (acc >= 16) { acc -= 16.667; pollInput(); frame++; if (scene && scene.update) scene.update(); const w = waiters; waiters = []; w.forEach(r => r()); } };`;
module.exports = { load, FILES, G, FAST };
