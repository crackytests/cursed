// CARL 2 headless loader: shared file list + helpers
const G = require('./g2vm');
const FILES = ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'carl2/c2art', 'carl2/c2tiles', 'carl2/c2bong', 'carl2/c2world', 'carl2/c2argue',
  'carl2/c2road', 'carl2/c2dance', 'carl2/c2maps', 'carl2/c2maps2', 'carl2/c2story', 'carl2/c2story2', 'carl2/c2more', 'carl2/c2main'];
const fs = require('fs'), path = require('path');
function load(LS = {}) { return G.load(FILES.filter(f => fs.existsSync(path.join(G.ROOT, f + '.js'))), LS); }
module.exports = { load, FILES, G };
