// usage: node tools/origshot.js apt|hall|shop|title|say [flagsJSON] -> tools/shots/orig_<name>.png
const G = require('./g2vm'), fs = require('fs'), path = require('path');
const ctx = G.load(['g2/engine2', 'g2/fm', 'orig/oart', 'orig/ostory', 'orig/omain']);
const name = process.argv[2] || 'apt', flags = process.argv[3] ? JSON.parse(process.argv[3]) : {};
const t = +(process.env.T || 100);
G.R(ctx, `Object.assign(OS.flags, ${JSON.stringify(flags)}); if (OS.flags.circleOkTest) {}`);
let code;
if (name === 'title') code = `cls(BLACK); ctext('FACE', 40, hex('#00dbdb'), hex('#db49db'), 7); ctext('BEFORE THE STREAM', 110, WHITE, hex('#db49db'), 2); ctext('PRESS START_', 156, hex('#ffdb49')); ctext('(C) 1983 PRETEND CO.  HOME-8', 200, hex('#00dbdb'));`;
else if (name === 'say') code = `cls(BLACK); drawShop(${t}); chrome(); DLG = { who: 'MAGICIAN', lines: ['YOU ARE LATE. THE SYSTEM IS UP.', 'SORT OF. MOSTLY IT IS UP.'], n: 99, arrow: 1, hasP: true }; drawOverlay();`;
else if (name === 'menu') code = `cls(BLACK); drawApt(${t}); chrome(); MENUS.push({ opts: ['MIMI','FRONT DOOR','WINDOW','SHELF','COUCH','COUNTER','ITEMS','THINK'], i: 1, x: 220, y: 8, w: 96, h: 108 }); drawOverlay();`;
else code = `cls(BLACK); draw${name[0].toUpperCase() + name.slice(1)}(${t}); chrome();`;
G.R(ctx, code);
fs.mkdirSync(path.join(G.ROOT, 'tools/shots'), { recursive: true });
G.png(ctx, path.join(G.ROOT, 'tools/shots/orig_' + name + '.png'), 3);
console.log('ok');
