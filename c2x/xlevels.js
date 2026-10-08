'use strict';
// ================= CARL 2 EXTREME: the five levels =================
// legend: '#' ground '=' one-way '^' spikes 'W' wall of text (burn it) 'o' hook ring 'R'+'|' rope (anchor + length)
// '@' start '$' bux '+' pretzel 'X' outfit box 'C' checkpoint bong 'E' goal 'v' bubble vent
// foes: g goon, k mall cop, e spelling bee, y typo, t terms & conditions, f fish, j jelly
const LEVELS = [
  { id: 'lot', tag: '1', name: 'THE PARKING LOT', theme: 'lot', outfit: 'extreme',
    signs: [[6, 12, 'B=^'], [23, 12, 'A=>'], [48, 12, 'C=*'], [94, 12, '^+A']],
    build() {
      const b = LB(200);
      b.ground(0, 30).put(3, 11, '@').row(8, 9, '$$$$$').put(15, 11, 'g').ground(19, 20, 10).row(19, 9, '$$').put(27, 11, 'g');
      b.ground(34, 60).plat(37, 40, 9).row(37, 8, '$$$$').put(44, 11, 'e').fill(52, 52, 8, 11, 'W').put(57, 11, 'C');
      b.plat(62, 63, 10).row(62, 9, '$$');
      b.ground(65, 100).put(70, 11, '+').put(76, 11, 't').ground(81, 92, 10).put(85, 9, 'g').put(90, 9, 'g');
      b.put(96, 6, 'o').plat(98, 102, 6).put(101, 5, 'X').row(98, 5, '$$$');
      b.ground(105, 150).put(110, 11, 'k').put(118, 8, 'y').fill(124, 125, 7, 11, 'W').put(129, 11, 'C').row(132, 8, '$$$$$$').put(136, 11, 'g').put(142, 11, 't');
      b.ground(151, 155, 11).ground(156, 160, 10).ground(161, 165, 9).row(156, 7, '$$$$$');
      b.ground(170, 199, 10).put(175, 6, 'y').put(181, 9, 'g').put(186, 9, 'e').put(193, 9, 'E');
      return b;
    } },
  { id: 'mall', tag: '2', name: 'MALL OF THE FUTURE', theme: 'mall', outfit: 'plumber', boss: { id: 'robo', at: 182 },
    signs: [[26, 12, '^+A']],
    build() {
      const b = LB(212);
      b.ground(0, 28).put(2, 11, '@').put(10, 11, 'k').plat(13, 16, 9).row(13, 8, '$$$$').fill(22, 22, 7, 11, 'W');
      b.put(32, 6, 'o').row(31, 9, '$$$');
      b.ground(37, 70).put(50, 11, 'k').put(52, 11, 'e').plat(56, 59, 9).plat(60, 63, 6).row(60, 5, '$$$$').put(66, 5, 'y').put(68, 11, 'C');
      b.put(74, 5, 'o').put(79, 5, 'o').row(75, 8, '$$$$');
      b.ground(83, 120).put(90, 11, 't').fill(96, 96, 6, 11, 'W').put(100, 11, '+').put(104, 11, 'k').put(108, 5, 'o').plat(110, 113, 4).put(112, 3, 'X').row(110, 3, '$$').put(111, 11, 'g').put(115, 11, 'g').put(118, 11, 'C');
      b.put(123, 6, 'o');
      b.ground(127, 211).put(135, 6, 'y').put(140, 7, 'y').put(145, 11, 'e').fill(150, 150, 8, 11, 'W').plat(152, 155, 8).row(152, 7, '$$$$').put(158, 11, 't').put(165, 11, 'k').put(170, 11, '+').put(176, 11, 'C');
      b.put(186, 5, 'o').put(197, 5, 'o').put(206, 11, 'E');
      return b;
    } },
  { id: 'canyon', tag: '3', name: 'ROPE CANYON', theme: 'canyon', outfit: 'hog',
    signs: [[22, 9, '->|']],
    build() {
      const b = LB(210);
      b.ground(0, 24, 9).put(2, 8, '@').row(8, 6, '$$$$').put(14, 8, 'e');
      b.rope(28, 1, 5);
      b.ground(32, 55, 9).put(38, 8, 'e').put(45, 4, 'y').row(40, 6, '$$$').put(52, 8, 'C');
      b.rope(59, 1, 5).rope(64, 1, 6).row(61, 2, '$$');
      b.ground(67, 90, 9).put(72, 8, 'g').fill(80, 80, 5, 8, 'W').put(77, 8, '+').put(86, 8, 't');
      b.rope(94, 1, 5).put(95, 3, 'y');
      b.ground(98, 120, 9).fill(105, 107, 9, 9, '^').row(104, 5, '$$$$$').put(112, 8, 'g').put(117, 8, 'C');
      b.rope(124, 1, 5).rope(129, 1, 5).rope(134, 1, 5).put(131, 2, 'y');
      b.ground(140, 170, 9).put(143, 2, 'o').ground(145, 147, 4).put(146, 3, 'X').row(145, 2, '$$').put(150, 8, 'k').put(156, 8, 'e').put(160, 8, 'k').put(165, 8, 'C');
      b.rope(174, 1, 6).rope(180, 1, 6).put(177, 4, 'y');
      b.ground(185, 209, 9).put(190, 8, 'g').row(192, 6, '$$$$$').put(200, 8, 'E');
      return b;
    } },
  { id: 'lake', tag: '4', name: 'LAKE EXTREME', theme: 'lake', outfit: 'scuba', water: 3, boss: { id: 'moby', at: 168 },
    signs: [[5, 3, 'B=^']],
    build() {
      const b = LB(200);
      b.ground(0, 199, 12).fill(0, 8, 3, 3, '#').put(2, 2, '@');
      b.ground(18, 20, 8).put(15, 6, 'f').put(25, 9, 'f').put(30, 6, 'j').row(10, 7, '$$$$$').row(22, 10, '$$$');
      b.fill(41, 80, 3, 6, '#').fill(41, 80, 11, 11, '#').put(55, 10, 'v').put(62, 9, '+').put(50, 8, 'j').put(65, 8, 'j').put(60, 9, 'f').put(72, 7, 'f').row(44, 8, '$$$$').put(76, 10, 'C');
      b.ground(88, 90, 9).put(85, 5, 'j').ground(98, 98, 9).ground(102, 102, 9).put(100, 11, 'X').put(94, 7, 'f').put(106, 6, 'f').row(84, 9, '$$$');
      b.fill(111, 160, 3, 5, '#').fill(111, 160, 11, 11, '#').put(125, 10, 'v').put(145, 10, 'v');
      for (const x of [118, 130, 142, 154]) b.fill(x, x + 1, 6, 7, '#'); for (const x of [124, 136, 148]) b.fill(x, x + 1, 9, 10, '#');
      b.put(121, 8, 'j').put(133, 8, 'f').put(140, 7, 'j').put(151, 8, 'f').row(127, 8, '$$$$').put(137, 10, 'C').put(146, 9, '+').put(158, 10, '+').put(163, 11, 'C');
      b.put(172, 11, 'v').put(183, 11, 'v');
      b.fill(191, 199, 3, 3, '#').put(196, 2, 'E');
      return b;
    } },
  { id: 'keep', tag: '5', name: 'DYSLEXIO\'S KEEP', theme: 'keep', outfit: 'legacy', boss: { id: 'dys', at: 192 }, cage: [206, 1],
    build() {
      const b = LB(214);
      b.ground(0, 33).put(2, 11, '@').put(12, 6, 'y').put(17, 11, 't').fill(28, 28, 7, 11, 'W').row(14, 9, '$$$$');
      b.rope(39, 1, 8);
      b.ground(45, 74).put(48, 11, 'e').put(52, 5, 'o').plat(54, 62, 5).put(60, 4, 'X').row(55, 4, '$$$$').put(57, 11, 'k').fill(66, 66, 4, 11, 'W').put(72, 11, 'C');
      b.put(78, 6, 'o').put(83, 6, 'o').put(80, 3, 'y');
      b.ground(87, 120).fill(95, 97, 12, 12, '^').put(105, 11, 't').put(100, 6, 'y').fill(112, 112, 8, 11, 'W').put(115, 11, '+').put(118, 11, 'C');
      b.rope(125, 1, 8).rope(131, 1, 8).put(137, 6, 'o').put(128, 4, 'y');
      b.ground(141, 213).put(146, 11, 'k').put(152, 11, 'e').fill(158, 159, 7, 11, 'W').put(164, 11, 't').put(170, 6, 'y').put(174, 11, 'k').put(178, 11, '+').plat(166, 170, 8).row(166, 7, '$$$$$').put(184, 11, 'C');
      b.put(196, 6, 'o').put(207, 6, 'o').plat(193, 195, 8).plat(208, 210, 8);
      return b;
    } },
];
