'use strict';
// ================= PEE KID³ -- stages =================
// legend: # solid  = one-way  ^ hazard  V vent (kid only)  P power door (60%+)  M laser (off in legacy)
//         L legacy block (only in legacy)  ? hidden (PEE BOY reveals)  T bathroom  D exit  J juice  F photo  H heart
//         a/b/c/m/s adults  r drone  k dodgeball machine  l spotlight  @ start
// ids: 1..5 are the first section of each stage, 11..51 the second, 99 the secret one
const legacyNPC = (x, y, spr, name, lines) => ({ x, y, legacy: 1, spr, talk: async () => { for (const [t, w] of lines) await say(t, w || name); } });
const nameTag = (x, y, name) => { if (Math.abs(PL.x - camX - x) < 60) text(name, x + 8 - name.length * 3, y - 14, UI.name); };
// ordinary people who just want to talk (no hitbox, no harm)
const talker = (x, y, sk, name, lines, P) => ({ x, y, talk: async () => { for (const l of lines) await say(...(Array.isArray(l) ? l : [l, name])); },
  draw: (X, Y) => { draw(ADULT[sk][0], X - 4, Y - 12, P || ADULTPAL[sk], PL.x < X + camX); nameTag(X, Y - 10, name); } });
const kidTalker = (x, y, name, lines, P, talk) => ({ x, y, talk: talk || (async () => { for (const l of lines) await say(...(Array.isArray(l) ? l : [l, name])); }),
  draw: (X, Y) => { draw(KID.kid.stand, X - 4, Y - 2, P, PL.x < X + camX); nameTag(X, Y, name); } });
const recolor = (base, ch) => { const P = base.slice(); for (const k in ch) P[k] = hex(ch[k]); return P; };
const KIDP2 = recolor(KIDPAL.kid, { 4: '#b86828', 5: '#e09048', 8: '#c03838', 9: '#882020', 10: '#2848a0' });
const KIDP3 = recolor(KIDPAL.kid, { 4: '#101010', 8: '#389048', 9: '#206030', 10: '#e8c020', 2: '#c89068', 3: '#a07050' });
const KIDP4 = recolor(KIDPAL.kid, { 4: '#e8d070', 5: '#f8f0a0', 8: '#a048c0', 9: '#702890', 10: '#e8e8e8' });
const STAGES = {
  1: { id: 1, title: 'THE THIRD GENERATOR', theme: 'lab', music: 'lab',
    build() {
      const L = LB(110); L.ground(0, 109); L.col(0, 2, 11); L.col(109, 2, 11); L.put(3, 11, '@');
      L.fill(9, 10, 12, 13, '.'); L.plat(12, 14, 9); L.put(17, 11, 'a');
      L.fill(22, 23, 2, 9, '#'); L.fill(22, 23, 10, 11, 'V'); L.put(26, 11, 'J');
      L.fill(31, 31, 2, 7, '#'); L.fill(31, 31, 8, 11, 'P');
      L.fill(36, 36, 10, 11, 'T'); L.fill(42, 42, 3, 11, 'M');
      L.put(45, 11, 'L'); L.put(46, 10, 'L'); L.put(47, 9, 'L'); L.fill(48, 53, 8, 8, 'L'); L.put(51, 7, 'F');
      L.put(57, 7, 'r'); L.fill(60, 62, 12, 13, '.'); L.fill(66, 68, 12, 13, '.'); L.plat(59, 63, 9); L.plat(65, 69, 8);
      L.put(72, 11, 'J'); L.put(82, 11, 'a'); L.put(89, 11, 'a'); L.put(86, 6, 'r'); L.put(92, 11, 'J');
      L.fill(96, 96, 2, 7, '#'); L.fill(96, 96, 8, 11, 'P'); L.put(100, 11, 'F'); L.fill(105, 105, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(76, 11, 'carl', 'CARL', [["Hey. Hey, kid. Why do you have colors? Chat, he has colors."], ["I'm from the last generation. We don't get upgrades. We get... kept."], ["Also I don't think you're supposed to be out here. I'm not either. I never am."]]),
      legacyNPC(6, 11, 'face', 'FACE', [["I can only see you when the power's low. That's funny. It's not funny."]]),
      talker(28, 11, 'tech', 'NIGHT SHIFT', ["Oh. Hey. You're the... you're the kid. From the tube.", "I just watch the gauge. Gauge goes up, we get colors. Gauge goes down, somebody yells at me.", ["What happens when it goes all the way up?", 'PEE KID'], "...Somebody yells at YOU, I guess."]),
      talker(102, 11, 'tech', 'INTERN', ["Please don't tell anyone you saw me. I'm on break. I've been on break for four hours.", "The exit's right there. I didn't see anything. I'm an intern. I don't see things."])],
    intro: () => stage1Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() },
  11: { id: 11, title: 'MELTDOWN', theme: 'lab', music: 'chase', chase: 1.25,
    build() {
      const L = LB(120); L.ground(0, 119); L.col(0, 2, 11); L.col(119, 2, 11); L.put(4, 11, '@');
      L.fill(12, 13, 12, 13, '.'); L.fill(18, 19, 10, 11, '#'); L.fill(24, 25, 12, 13, '.'); L.put(30, 11, 'J');
      L.plat(34, 37, 10); L.plat(39, 42, 8); L.plat(43, 45, 6); L.put(44, 5, 'F');
      L.fill(48, 50, 12, 13, '.'); L.fill(53, 54, 10, 11, '#'); L.put(57, 7, 'r');
      L.fill(61, 61, 10, 11, 'T'); L.fill(67, 67, 3, 11, 'M');
      L.put(71, 11, 'L'); L.put(72, 10, 'L'); L.fill(73, 75, 9, 9, 'L'); L.put(74, 8, 'H');
      L.fill(79, 80, 12, 13, '.'); L.fill(85, 87, 12, 13, '.'); L.put(91, 11, 'a');
      L.fill(96, 97, 10, 11, '#'); L.put(100, 11, 'J'); L.fill(103, 105, 12, 13, '.'); L.fill(115, 115, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(64, 11, 'ghost', 'SPOOKY GHOST', [["Dude. DUDE. It's slower when you're green! Stay green! Flush!"], ["...That came out weird. You know what I mean."]])],
    intro: () => stage11Intro(), exit: () => stage1Exit(), onAccident: () => adultsUpset() },
  2: { id: 2, title: 'THE BUS', theme: 'bus', music: 'bus',
    build() {
      const L = LB(104); L.ground(0, 103); L.col(0, 2, 11); L.col(103, 2, 11); L.put(3, 11, '@');
      L.fill(1, 102, 4, 4, '#'); for (const x of [12, 34, 60, 80]) { L.fill(x, x + 2, 4, 4, '.'); L.plat(x, x + 2, 7); }
      L.fill(48, 50, 4, 4, 'L');
      for (let x = 8; x < 100; x += 6) L.put(x, 11, '#');
      for (let x = 16; x < 98; x += 18) L.plat(x, x + 3, 8);
      L.put(20, 11, 'm'); L.put(44, 11, 'm'); L.put(68, 11, 'm'); L.put(88, 11, 'm'); L.put(40, 2, 'r');
      L.fill(30, 30, 10, 11, 'T'); L.put(24, 10, 'J'); L.put(52, 10, 'J');
      L.put(46, 3, 'F');
      L.fill(58, 58, 5, 11, 'P'); L.put(76, 9, 'F'); L.put(64, 10, 'J'); L.fill(98, 98, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(66, 11, 'linda', 'LINDA', [["I'm not on this bus. I own this bus. Everything with seats is mine."], ["You're very colorful. Who's paying for that? ...Oh. You are."]]),
      kidTalker(5, 11, 'BUS KID', ["Are you going to the thing too?", ["What thing?", 'PEE KID'], "I don't know. Everyone on this bus is going to a thing. I just got on.", "My mom says never get on a bus without knowing the thing."], KIDP2),
      talker(92, 11, 'tech', 'A MAN NAMED MENCIA', ["Hi. I'm... Garcia. No. Mencia. They changed it halfway through.", "I'm a background guy. I just sit here. Sometimes they say my name wrong. It's a living.", "The Movie Star is up front. He locked the aisle. You'll have to go over the roof."], ADULTPAL.star)],
    intro: () => stage2Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() },
  21: { id: 21, title: 'THE ROOF', theme: 'roof', music: 'roof', wind: -.2, signs: 150, roof: 10,
    build() {
      const L = LB(120); L.put(3, 9, '@');
      L.ground(0, 30, 10); L.ground(33, 64, 10); L.ground(67, 96, 10); L.ground(99, 119, 10); L.col(0, 0, 9); L.col(119, 0, 9);
      L.put(20, 9, 'J'); L.fill(40, 40, 8, 9, 'T'); L.plat(45, 47, 8); L.plat(49, 51, 6); L.put(50, 5, 'F');
      L.put(60, 4, 'r'); L.put(75, 9, 'J'); L.put(88, 9, 'H'); L.fill(116, 116, 8, 9, 'D');
      return L;
    },
    npcs: [legacyNPC(82, 9, 'linda', 'LINDA', [["Still not on the bus. On TOP of the bus. Different line item."], ["The wind is free, by the way. I checked. I was very disappointed."]])],
    intro: () => stage21Intro(), exit: () => testimony(), onAccident: () => adultsUpset() },
  3: { id: 3, title: 'MISS NOSE', theme: 'school', music: 'school',
    build() {
      const L = LB(112); L.ground(0, 111); L.col(0, 2, 11); L.col(111, 2, 11); L.put(3, 11, '@');
      L.fill(20, 23, 8, 11, '#'); L.plat(20, 23, 8); L.put(21, 7, 'F');
      L.put(14, 11, 'b'); L.put(30, 11, 'm'); L.put(50, 11, 'b'); L.put(56, 11, 'm');
      L.fill(62, 62, 10, 11, 'T'); L.put(72, 10, 'J'); L.fill(70, 70, 3, 11, 'M');
      L.put(73, 11, 'L'); L.put(74, 10, 'L'); L.put(75, 9, 'L'); L.fill(76, 80, 8, 8, 'L');
      L.fill(84, 84, 2, 7, '#'); L.fill(84, 84, 8, 11, 'P'); L.put(79, 7, 'J'); L.put(82, 11, 'J');
      L.fill(88, 91, 9, 11, '#'); L.put(94, 11, 'b'); L.put(98, 11, 'm'); L.put(102, 7, 'F'); L.plat(100, 104, 8);
      L.fill(108, 108, 10, 11, 'D');
      return L;
    },
    npcs: [{ x: 40, y: 11, spr: 'class', talk: () => standUp(), draw: (x, y) => { for (let i = 0; i < 4; i++) draw(KID.kid.stand, x - 30 + i * 18, y - 2, [KIDPAL.kid, KIDP2, KIDP3, KIDP4][i]); text('THE CLASS', x - 14, y - 10, WHITE); } },
      legacyNPC(77, 7, 'ghost', 'SPOOKY GHOST', [["Oh. Hey. It's you. The comedian one. I made you. The second time."], ["I was trying to show up Face. I did everything he did. I didn't think about you much. ...That's on me."], ["Bro. Your timing's great, though. I mean that."]]),
      talker(66, 11, 'teacher', 'LUNCH LADY', ["Tater tots are on Thursday. It's never Thursday.", "You want some advice, honey? Don't let them make you into anything. Not a generator. Not a lesson.", "...Also don't go near the clown bag."], recolor(ADULTPAL.teacher, { 4: '#f8f8f8', 5: '#e8e8e8', 6: '#b8b8c8' })),
      kidTalker(47, 11, 'KID WHO FAILED', ["I asked to go to the bathroom in September. They said later.", "It's later now. It's really, really later now."], KIDP3)],
    intro: () => stage3Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() },
  31: { id: 31, title: 'RECESS', theme: 'gym', music: 'gym',
    build() {
      const L = LB(120); L.ground(0, 119); L.col(0, 2, 11); L.col(119, 2, 11); L.put(3, 11, '@');
      L.put(30, 11, 'k'); L.fill(36, 37, 10, 11, '#'); L.put(42, 11, 'm');
      L.fill(50, 50, 10, 11, 'T'); L.put(55, 11, 'J'); L.put(60, 11, 'k');
      L.plat(66, 68, 9); L.plat(70, 73, 6); L.put(71, 5, 'F');
      L.fill(78, 80, 12, 13, '.'); L.put(86, 11, 'b'); L.put(92, 11, 'k'); L.fill(98, 99, 9, 11, '#');
      L.put(104, 11, 'J'); L.put(108, 11, 'm'); L.fill(115, 115, 10, 11, 'D');
      return L;
    },
    npcs: [kidTalker(18, 11, 'DRAMA CLUB', [], KIDP4, () => presentation()),
      legacyNPC(45, 11, 'tp', 'TP', [["Oh! Hi. I'm TP. I was a whole game once. Now I'm a cameo. That's okay. I love a cameo."], ["You have to go too? ...Sorry. That's a TP joke. I only have the one."]]),
      talker(112, 11, 'teacher', 'COACH', ["The machine is for SCIENCE. We are studying what happens when kids get hit by balls.", "Preliminary results: they don't like it.", ["You could have just asked them.", 'PEE-WEE KID'], "...Huh."], recolor(ADULTPAL.teacher, { 4: '#402010', 5: '#d02020', 6: '#901010' }))],
    intro: () => stage31Intro(), exit: () => missNose(), onAccident: () => adultsUpset() },
  4: { id: 4, title: 'SPECIAL PRONOUNS UNIT', theme: 'city', music: 'city',
    build() {
      const L = LB(124); L.put(3, 11, '@');
      L.ground(0, 22); L.ground(26, 44, 11); L.ground(48, 58, 12); L.fill(59, 64, 7, 13, '#');
      L.put(56, 11, '?'); L.put(57, 10, '?'); L.put(58, 9, '?');
      L.ground(65, 96); L.fill(97, 99, 12, 13, '.'); L.put(97, 11, '?'); L.put(99, 11, '?'); L.ground(100, 123); L.col(0, 2, 11); L.col(123, 2, 11);
      L.plat(10, 13, 8); L.plat(30, 34, 7); L.put(32, 6, 'F'); L.put(16, 11, 'c'); L.put(38, 10, 'c'); L.put(52, 11, 'c'); L.put(44, 6, 'r');
      L.fill(40, 40, 9, 10, 'T'); L.put(35, 10, 'J');
      L.put(110, 11, 'c'); L.put(104, 6, 'r'); L.put(114, 7, 'F'); L.plat(112, 116, 8); L.put(106, 11, 'J');
      L.fill(119, 119, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(20, 11, 'face', 'FACE', [["I took you out of the game first. The first you. I built a generator around you."], ["I'd do it differently. Probably. I'd at least have asked."], ["...Go. You've got a case."]]),
      { x: 8, y: 11, spr: 'taka', talk: () => takahashi(), draw: (x, y) => { draw(ADULT.star[0], x - 4, y - 12, TAKAPAL); text('TAKAHASHI', x - 18, y - 22, WHITE); } },
      talker(84, 11, 'cop', 'DESK SERGEANT', ["Form 22-B. Before you arrest a suspect, you have to address them the way they'd like.", "Before you address them, you need their file. Before the file, you need an arrest.", ["That's a circle.", 'PEE BOY'], "That's PROCEDURE, detective."]),
      talker(70, 11, 'tech', 'NEWSPAPER GUY', ["EXTRA! EXTRA! Case still open! Day four thousand!", "...It's the same paper every day. I just yell it."], ADULTPAL.monitor)],
    intro: () => stage4Intro(), exit: () => stageClear(), tick: () => suspectTick(), draw: () => suspectDraw(), onAccident: () => adultsUpset() },
  41: { id: 41, title: 'ROOFTOPS', theme: 'night', music: 'night',
    build() {
      const L = LB(124); L.put(3, 9, '@');
      L.ground(0, 20, 10); L.ground(23, 40, 9); L.ground(44, 60, 11); L.plat(58, 60, 9); L.ground(61, 75, 8); L.ground(79, 100, 10); L.ground(103, 123, 10);
      L.col(0, 0, 9); L.col(123, 0, 9);
      for (const x of [30, 52, 68, 91, 112]) L.put(x, 0, 'l');
      L.put(32, 8, 'c'); L.put(14, 9, 'J'); L.put(66, 7, 'J'); L.fill(84, 84, 8, 9, 'T');
      L.put(86, 7, '?'); L.put(88, 5, '?'); L.put(90, 4, 'F');
      L.put(95, 9, 'c'); L.put(108, 9, 'c'); L.put(100, 4, 'r'); L.put(115, 9, 'H'); L.fill(120, 120, 8, 9, 'D');
      return L;
    },
    npcs: [legacyNPC(72, 7, 'carl', 'CARL', [["The lights can't see me. They've never been able to see me. Chat, I'm invisible to cops. This is the best day of my life."], ["...That's why they can't see YOU when you're green. You're like me. For a minute."]])],
    intro: () => stage41Intro(), exit: () => witness(), draw: () => silhouette(), onAccident: () => adultsUpset() },
  5: { id: 5, title: 'THIRD TIME\'S THE CHARM', theme: 'core', music: 'core',
    build() {
      const L = LB(132); L.ground(0, 131); L.col(0, 2, 11); L.col(131, 2, 11); L.put(4, 11, '@');
      L.fill(14, 15, 2, 9, '#'); L.fill(14, 15, 10, 11, 'V'); L.put(18, 11, 'a'); L.put(22, 11, 'J');
      L.fill(28, 31, 8, 11, '#'); L.put(29, 7, 'F');
      L.fill(36, 36, 2, 7, '#'); L.fill(36, 36, 8, 11, 'P');
      L.fill(41, 41, 10, 11, 'T'); L.fill(46, 46, 3, 11, 'M'); L.fill(47, 47, 3, 11, 'M');
      L.put(50, 11, 'L'); L.put(51, 10, 'L'); L.put(52, 9, 'L'); L.fill(53, 58, 8, 8, 'L');
      L.fill(62, 67, 7, 13, '#'); L.put(59, 11, '?'); L.put(60, 10, '?'); L.put(61, 9, '?');
      L.put(72, 11, 'a'); L.put(78, 7, 'r'); L.put(84, 11, 'a'); L.put(76, 11, 'J');
      L.fill(88, 90, 12, 13, '^'); L.plat(88, 90, 8);
      L.fill(94, 95, 2, 9, '#'); L.fill(94, 95, 10, 11, 'V'); L.put(100, 11, 'J');
      L.fill(104, 104, 2, 7, '#'); L.fill(104, 104, 8, 11, 'P'); L.put(110, 11, 'a'); L.put(116, 11, 'J'); L.put(119, 6, 'F'); L.plat(117, 121, 7);
      L.fill(127, 127, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(8, 11, 'ghost', 'SPOOKY GHOST', [["Third time's the charm, kid. That's what I keep telling Face. He keeps not laughing."]]),
      legacyNPC(65, 6, 'carl', 'CARL', [["I found the other ones of you. There's three. Chat, there's three of him."], ["I only have one of me. As far as I know. Nobody tells me anything."]]),
      talker(122, 11, 'tech', 'A TECHNICIAN WHO QUIT', ["I quit. I'm just here to get my mug.", "Every generation, they say this one's the last one we'll need. Then there's another one.", "Kid. Whatever's through that door, it's not your job. None of it was ever your job."])],
    intro: () => stage5Intro(), exit: () => stageClear(), onAccident: () => adultsUpset() },
  51: { id: 51, title: 'THE HEART', theme: 'core', music: 'chase', chase: 1.35,
    build() {
      const L = LB(130); L.ground(0, 129); L.col(0, 2, 11); L.col(129, 2, 11); L.put(4, 11, '@');
      L.fill(10, 11, 12, 13, '.'); L.fill(18, 19, 2, 9, '#'); L.fill(18, 19, 10, 11, 'V');
      L.put(24, 11, 'J'); L.fill(30, 31, 8, 11, '#');
      L.fill(36, 38, 12, 13, '.'); L.put(42, 11, 'a');
      L.fill(48, 52, 7, 13, '#'); L.put(45, 11, '?'); L.put(46, 10, '?'); L.put(47, 9, '?'); L.put(50, 6, 'F');
      L.fill(56, 56, 10, 11, 'T'); L.fill(62, 63, 3, 11, 'M');
      L.put(67, 11, 'L'); L.put(68, 10, 'L'); L.fill(69, 72, 9, 9, 'L');
      L.fill(76, 78, 12, 13, '.'); L.put(82, 11, 'a'); L.put(86, 6, 'r');
      L.fill(90, 91, 2, 9, '#'); L.fill(90, 91, 10, 11, 'V');
      L.put(95, 11, 'J'); L.fill(100, 101, 8, 11, '#'); L.fill(106, 108, 12, 13, '.'); L.put(112, 11, 'H');
      L.fill(125, 125, 10, 11, 'D');
      return L;
    },
    npcs: [],
    intro: () => stage51Intro(), exit: () => finale(), onAccident: () => adultsUpset() },
  99: { id: 99, title: 'THE FIRST GENERATOR', theme: 'gb', music: 'legacy', forceLegacy: 1,
    build() {
      const L = LB(100); L.ground(0, 99); L.col(0, 2, 11); L.col(99, 2, 11); L.put(3, 11, '@');
      L.fill(16, 18, 10, 11, 'L'); L.fill(30, 34, 9, 9, 'L'); L.fill(48, 49, 10, 11, 'L'); L.fill(62, 66, 8, 8, 'L'); L.fill(78, 79, 11, 11, 'L');
      L.fill(95, 95, 10, 11, 'D');
      return L;
    },
    npcs: [legacyNPC(12, 11, 'carl', 'CARL', [["Oh hey. You found us. This is where the old stuff goes. Chat, this is the back of the fridge."], ["You collected all the photos? That's like... every photo. I have like two photos. One is of a door."], ["Everybody's down the hall. They're gonna want to see you."]]),
      legacyNPC(26, 11, 'linda', 'LINDA', [["Sixteen photos. I would have charged admission for eight."], ["I'm kidding. I'm glad you have them. Things that are yours should stay yours. I've read a lot of contracts. That's the only good clause."]]),
      legacyNPC(42, 11, 'ghost', 'SPOOKY GHOST', [["Kid. I, uh. I'm sorry about the whole... making-a-second-you thing."], ["I wanted to win so bad I didn't think about who I was using to do it. You don't have to forgive me. I'm just saying it out loud. That's new for me."]]),
      legacyNPC(57, 11, 'tp', 'TP', [["Hi! I kept one of your photos safe! I was a vault once. I'm good at keeping things."], ["There's one more thing, though. It's about the dog. Face has it. Go ask him."]]),
      legacyNPC(72, 11, 'face', 'FACE', [["You got here."], ["I made the first generator. I put a kid in it because he had potential and I didn't. I'm not going to explain it better than that. There isn't a better version."], ["The dog photo. Turn it over. Somebody wrote on the back a long time ago. Take it out of here. It shouldn't be in a machine."]])],
    intro: () => secretIntro(), exit: () => dogEnding(), onAccident: () => {} },
};
const ORDER = [1, 11, 2, 21, 3, 31, 4, 41, 5, 51];
const TAKAPAL = pal('#101018', '#f0c8a0', '#c89878', '#f0e0a0', '#c02838', '#801828', '#c02838', '#303030', '#40c0f0', '#ffffff', '#101010');
