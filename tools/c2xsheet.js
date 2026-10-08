// CARL 2 EXTREME art sheet: every Carl pose per outfit + foes + bosses -> tools/shots/x_sheet.png
const { load, G } = require('./c2xvm'), path = require('path');
const ctx = load();
G.R(ctx, `cls(hex('#406080'));
  OUTFITS.forEach((o, r) => { const S = carlSet(o); POSES.forEach((p, i) => drawScaled(S[p][1], 4 + i * 31, 2 + r * 30, S.P, 1.5)); });
  let x = 4; for (const [s, P] of [[XS.goon[0], XP.foe], [XS.cop[0], XP.foe], [XS.bee[0], XP.foe], [XS.typo.Q[0], XP.foe], [XS.terms[0], XP.foe], [XS.fish[0], XP.sea], [XS.jelly[0], XP.sea], [XS.linda[0], XP.linda], [XS.post[1], XP.items], [XS.goal[0], XP.items], [XS.box[0], XP.items], [XS.pretzel, XP.items]]) { draw(s, x, 190, P); x += s.w + 4; }
  draw(XS.robo[0], 240, 2, XP.robo); draw(XS.dys[0], 276, 2, XP.dys); draw(XS.moby[1], 236, 60, XP.moby); draw(XS.cage, 290, 110, XP.linda); draw(XS.bong[0], 240, 120, XP.bong); draw(XS.ring, 260, 120, XP.bong);`);
G.png(ctx, path.join(__dirname, 'shots', 'x_sheet.png'), 3); console.log('ok');
