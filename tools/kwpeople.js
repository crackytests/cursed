// node tools/kwpeople.js   a sheet of every kind of little person: 4 directions x 4 walk frames per look, plus variants (front and back)
const X = require('./kwvm.js'), path = require('path');
const ctx = X.load();
X.R(ctx, `fit(); scene = null; cls(hex('#3a8a58'));
  const looks = ['routine', 'traveler', 'adventurer', 'student', 'thief', 'cat', 'android', 'spirit'];
  looks.forEach((lk, i) => { const y = 4 + i * 29; text(lk.slice(0, 9).toUpperCase(), 2, y + 6, WHITE, INKC);
    for (let d = 0; d < 4; d++) for (let f = 0; f < 4; f++) blit(person(lk, d === 1 ? 3 : d, f, null, i * 5 + 1), 62 + d * 58 + f * 14, y, d === 1);
    for (let v = 0; v < 12; v++) { blit(person(lk, 0, 0, null, v * 5 + 2), 302 + v * 17, y); blit(person(lk, 2, 0, null, v * 5 + 2), 302 + v * 17, y + 13); } });
  text('STAFF', 2, 240, WHITE, INKC);
  ['human', 'human', 'cat', 'android', 'spirit'].forEach((lk, i) => { for (let d = 0; d < 4; d++) blit(person(lk, d === 1 ? 3 : d, 0, '#38c8a0', i * 7 + 3), 62 + i * 60 + d * 14, 238, d === 1); });`);
X.png(ctx, path.join(__dirname, 'shots', 'kw_people.png'), 2, 3, 'SCREEN'); console.log('ok');
