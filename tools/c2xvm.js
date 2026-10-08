// CARL 2 EXTREME headless loader
const G = require('./g2vm');
const FILES = ['g2/engine2', 'g2/fm', 'pk/pkart', 'g2/cast', 'carl2/c2art', 'c2x/xmusic', 'c2x/xart', 'c2x/xplat', 'c2x/xboss', 'c2x/xlevels', 'c2x/xbart', 'c2x/xbonus', 'c2x/xmain'];
const load = (LS = {}) => G.load(FILES, LS);
module.exports = { load, FILES, G };
