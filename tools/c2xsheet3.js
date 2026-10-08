const { load, G } = require('./c2xvm'), path = require('path');
const ctx = load();
G.R(ctx, `cls(hex('#5080a0'));
  let x = 2; for (const [s, P] of [[XS.goon[0], XP.foe], [XS.cop[0], XP.foe], [XS.bee[0], XP.foe], [XS.typo.Q[0], XP.foe], [XS.terms[0], XP.foe], [XS.para, XP.foe], [XS.fish[0], XP.sea], [XS.jelly[0], XP.sea], [XS.linda[0], XP.linda]]) { drawScaled(s, x, 2, P, 2); x += s.w * 2 + 3; }
  x = 2; for (const [s, P] of [[XS.post[1], XP.items], [XS.goal[0], XP.items], [XS.box[0], XP.items], [XS.pretzel, XP.items], [XS.bux[0], XP.items], [XS.letterShot.A, XP.dys], [XS.cage, XP.linda]]) { drawScaled(s, x, 70, P, 2); x += s.w * 2 + 3; }
  drawScaled(XS.robo[0], 2, 150, XP.robo, 1.5); drawScaled(XS.dys[0], 56, 140, XP.dys, 1.5); drawScaled(XS.moby[1], 120, 150, XP.moby, 1.5);`);
G.png(ctx, path.join(__dirname, 'shots', 'x_sheet3.png'), 3); console.log('ok');
