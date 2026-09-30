// render arbitrary draw code on top of a game's art files: node tools/g2sheet.js <game> "<draw code>" [scale] [out.png]
// <game> is face | yoko | pk (which script list to load)
const G = require('./g2vm'), path = require('path');
const LISTS = {
  face: ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart'],
  yoko: ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart'],
  cast: ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast'],
  pk: ['g2/engine2', 'g2/fm', 'pk/pkart'],
  carl2: ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'face/faceart', 'yoko/yart', 'carl2/c2art', 'carl2/c2tiles'],
};
const [game, code, sc, out] = process.argv.slice(2);
const files = (LISTS[game] || LISTS.cast).filter(f => { try { require('fs').accessSync(path.join(G.ROOT, f + '.js')); return true; } catch (e) { return false; } });
const ctx = G.load(files);
G.R(ctx, code || 'cls(hex("#808890"))');
G.png(ctx, path.join(__dirname, out || 'sheet.png'), +(sc || 3));
console.log('wrote', out || 'sheet.png');
