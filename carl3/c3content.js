'use strict';
// ================= CARL 3: content tables. side jobs, decoy crates, roadside stops, CB chatter =================
// Formats are documented in c3road.js. Every `at` must be walkable and reachable (node tools/c3reach.js checks).
// ---------------- side jobs ----------------
JOBS.push(
  { id: 'dice', from: 8, to: 3, scene: 'plaza_diner', at: [-2, 6.4], who: 'BOOTS', model: 'trucker', desc: 'FUZZY DICE, SEALED', pay: 25,
    lines: [['BOOTS', 'My dice. My lucky dice. I lost them at the Spur in 1991.'], ['CARL', 'How do you lose dice at a casino?'], ['BOOTS', 'You use them.']] },
  { id: 'chips', from: 1, to: 8, scene: 'spur_floor', at: [3, 4.6], who: 'DOT', model: 'waitress', desc: 'A LOCKBOX OF OLD CHIPS', pay: 30,
    lines: [['DOT', 'Chips from the Roadhouse in Box Canyon. It closed in 1979.'], ['DOT', 'The Spur honors them. The Spur honors everything. That\'s how it got like this.']] },
  { id: 'fern', from: 3, to: 4, scene: 'mall_hall', at: [-10, 8], who: 'A MALL WALKER', model: 'tourist', desc: 'A FERN, VERY ALIVE', pay: 20,
    lines: [['A MALL WALKER', 'For the fountain. It needs something green that isn\'t mold.'], ['CARL', 'The fountain doesn\'t have water.'], ['A MALL WALKER', 'Neither does the fern. It\'s a desert fern. We\'re all desert something.']] },
);
// ---------------- decoy crates (31 in all; the tall ones' notes, nineteen years old) ----------------
// Rules: never their names, never where they are now, never their faces. Two hands: one stiff, one round. Some notes are to Carl, some to whoever opens it.
CRATES.push(
  { n: 1, scene: 'spur_floor', at: [17.4, 3.2], note: 'We played one hand. We lost it on purpose so he would remember us. People remember who lost.' },
  { n: 8, scene: 'spur_lot', at: [30, 21], note: 'To the inspector who opens this one: there is nothing in here. We are sorry about your evening. Drive safe.' },
  { n: 3, scene: 'canyon_main', at: [30, 3.2], note: 'Box Canyon has eleven people and one water tower. We counted twice. The second time it was ten.' },
);
// busts for the small people below (regBust and VOICE live in c3ui/c3main, both loaded before this file)
regBust('BOOTS', genBust({ skin: '#db9249', hair: '#3a2a1a', top: '#8a5a28', cap: '#6d4924', beard: 1 }), '#ff7a40');
regBust('A BELIEVER', genBust({ skin: '#dbb692', hair: '#6d6d24', top: '#6d6d24', shades: 1 }), '#b6ff49');
regBust('A MALL WALKER', genBust({ skin: '#f0c8a8', hair: '#dbdbff', top: '#40b0d0', shades: 1 }), '#49dbff');
Object.assign(VOICE, { BOOTS: [300, 50], 'A BELIEVER': [520, 80], 'A MALL WALKER': [640, 40] });
JOBS.push(
  { id: 'sauce', from: 1, to: 3, scene: 'plaza_diner', at: [0, 8.8], who: 'DOT', model: 'waitress', desc: 'MARGE\'S CHILI RECIPE, SEALED', pay: 15,
    lines: [['DOT', 'She finally sent it. Nineteen years I asked.'], ['CARL', 'Is it good?'], ['DOT', 'I\'ll never cook it. I just wanted her to send it.']] },
  { id: 'pole', from: 1, to: 2, scene: 'motel_lot', at: [-14, 12], who: 'DOLORES', model: 'manager', desc: 'A FISHING POLE, UNSPOKEN-FOR', pay: 20,
    lines: [['DOLORES', 'Hank\'s pole. It\'s been leaning in his post office since the water table quit.'], ['DOLORES', 'He says whoever carries it out owes him a story. Fisherman\'s terms.']] },
  { id: 'sand', from: 1, to: 4, scene: 'mall_out', at: [5, 36.4], who: 'DENNIS', model: 'guard', desc: 'SOUVENIR SAND, CERTIFIED', pay: 10,
    lines: [['DENNIS', 'Certified Nevada sand. Box Canyon batch.'], ['CARL', 'It\'s sand.'], ['DENNIS', 'It\'s FROM somewhere. That\'s the souvenir part.'], ['DENNIS', '...I\'m putting it in the fountain. The desert\'s in the mall now. Officially.']] },
  { id: 'postcards', from: 2, to: 1, scene: 'canyon_main', at: [19, 11], who: 'NED', model: 'farmer', desc: 'POSTCARDS, BLANK', pay: 10,
    lines: [['NED', 'Blank postcards. The most honest paper you can sell.'], ['NED', 'Nothing on them yet means nothing on them is a lie. My mother would hate these. I\'ll take forty.']] },
  { id: 'lava', from: 2, to: 9, scene: 'lodge_lot', at: [-24, 10], who: 'CHIP', model: 'chip', desc: 'A LAMP SHAPED LIKE LAVA', pay: 25,
    lines: [['CHIP', 'It\'s for the kids\' corner! No kids have come. It\'s still for the kids\' corner.'], ['CARL', 'That\'s kind of beautiful.'], ['CHIP', 'It\'s kind of a lamp.']] },
  { id: 'stamps', from: 2, to: 5, scene: 'sort_dock', at: [0, 6], who: 'MARGO', model: 'clerk', desc: 'A ROLL OF 1981 COMMEMORATIVES', pay: 25,
    lines: [['MARGO', 'Commemoratives. Butterflies of statehood.'], ['MARGO', 'Nobody will ever use these, honey. That\'s what makes them commemorative. That\'s what makes them perfect.']] },
  { id: 'cream', from: 3, to: 9, scene: 'lodge_hall', at: [8, 3], who: 'JUNE', model: 'june', desc: 'COCOA, 24 PACK, VINTAGE', pay: 20,
    lines: [['JUNE', 'The skiers drank. The cocoa waited. Cocoa is very good at waiting.'], ['JUNE', 'Put it by the fire. Not too close. Everything here is about not being too close.']] },
  { id: 'peach', from: 3, to: 7, scene: 'inn_lot', at: [3.4, 27.2], who: 'EARL', model: 'earl', desc: 'A CRATE OF PEACHES', pay: 15,
    lines: [['EARL', 'Peaches. The most alien fruit. Fur on the outside, bone on the inside.'], ['CARL', 'It\'s just a peach.'], ['EARL', 'That\'s what the peaches would want you to say.']] },
  { id: 'film', from: 3, to: 10, scene: 'booth', at: [2, 2.2], who: 'ARLO', model: 'arlo', desc: 'SPOOLS OF TRAILERS, UNSHOWN', pay: 30,
    task: async () => await tune('TRAILER SPLICE'),
    lines: [['ARLO', 'Trailers for movies that never opened. The best kind. All promise, no third act.'], ['ARLO', 'I\'ll screen one to the fence tonight. The fence has taste.']] },
  { id: 'pepper', from: 4, to: 1, scene: 'canyon_main', at: [10, 12], who: 'MARGE', model: 'waitress', desc: 'A PEPPER GRINDER, BRASS', pay: 20,
    task: async () => { const c = await ask('GROUND OR WHOLE?', null, ['GROUND', 'WHOLE']); return true; },
    lines: [['MARGE', 'A brass grinder. Empty. Like the town, but shinier.'], ['MARGE', 'Listen to it. GRIND. That\'s the sound of a decision being made. I missed that sound.']] },
  { id: 'turtle', from: 4, to: 2, scene: 'motel_lot', at: [18, 8], who: 'DOLORES', model: 'manager', desc: 'A CERAMIC TURTLE, GLAZED', pay: 15,
    lines: [['DOLORES', 'For the pool. The flamingo needed a witness.'], ['CARL', 'The pool has no water.'], ['DOLORES', 'The turtle doesn\'t mind. Turtles are patient furniture.']] },
  { id: 'motape', from: 4, to: 3, scene: 'plaza_lounge', at: [2, 2.6], who: 'SLIM', model: 'trucker', desc: 'A MALL MUSIC CASSETTE', pay: 12, cond: () => F3('loungeOpen'),
    lines: [['SLIM', '(sniff) Pine and... escalator. That\'s mall music, kid.'], ['SLIM', 'VCR 3 can have it. Machines need lullabies too.']] },
  { id: 'orchid', from: 4, to: 8, scene: 'spur_floor', at: [-10, 15], who: 'DUKE', model: 'pitboss', desc: 'A SILK ORCHID, WHITE', pay: 20,
    lines: [['DUKE', 'An orchid that never dies. The house should sell these at the door.'], ['DUKE', 'I\'ll keep it in my shirt pocket. Behind the cigarettes I don\'t smoke. Room\'s getting crowded in there. Good.']] },
  { id: 'wax', from: 7, to: 10, scene: 'drivein_lot', at: [-10, 18], who: 'VEE', model: 'vee', desc: '3D GLASSES, BOX OF FIFTY', pay: 18,
    lines: [['VEE', 'Hand them out for the reel. Nobody told the reel it isn\'t 3D.'], ['CARL', 'Does it matter?'], ['VEE', 'Honey, the glasses are the 3D. Everything else is attitude.']] },
  { id: 'zine', from: 7, to: 1, scene: 'canyon_main', at: [-25, 10], who: 'A BELIEVER', model: 'tourist', desc: 'NEWSLETTER, MONTHLY', pay: 12, cond: () => F3('fakeStamp7'),
    lines: [['A BELIEVER', 'The Newsletter. Fresh off the mimeograph. Smell that ink. That\'s belief drying.'], ['A BELIEVER', 'I read every word standing right here. Then I\'ll read it again sitting. That\'s the life.']] },
  { id: 'dolls', from: 7, to: 8, scene: 'spur_floor', at: [-8, 3], who: 'DOT', model: 'waitress', desc: 'ALIEN DOLLS, CRATE OF TWELVE', pay: 30,
    lines: [['DOT', 'Little green guys for the lounge tables. Conversation starters.'], ['CARL', 'They have my eyes.'], ['DOT', 'Honey, everybody\'s got somebody\'s eyes. That\'s how eyes do.']] },
  { id: 'slides', from: 9, to: 7, scene: 'inn_shop', at: [6, 5], who: 'VERN', model: 'vern', desc: 'A CAROUSEL OF SKY SLIDES', pay: 25,
    lines: [['VERN', 'Slides. Labeled by county. I\'ll file these under weather.'], ['CARL', 'What are they really?'], ['VERN', 'Weather, the man said. I kept one out for the newsletter. The bright one.']] },
  { id: 'mitten', from: 9, to: 2, scene: 'motel_lot', at: [-6, 20], who: 'DOLORES', model: 'manager', desc: 'ONE MITTEN, TAGGED', pay: 10,
    lines: [['DOLORES', 'Lost and found travels one direction, honey. Out.'], ['DOLORES', 'I\'ll put it in Room 6\'s drawer. If its owner ever comes, they\'ll know where their hand has been.']] },
  { id: 'snowcone', from: 9, to: 3, scene: 'plaza_diner', at: [5, 9], who: 'BIG LEON', model: 'trucker', desc: 'A SNOWCONE MACHINE', pay: 30,
    task: async () => { const c = await ask('FIRST BATCH FLAVOR?', null, ['CHERRY', 'BLUE']); return true; },
    lines: [['LEON', 'A snowcone machine, in a desert, at a truck stop. People said I was crazy.'], ['LEON', 'People also said the lot was too big. The lot\'s doing fine. Cherry\'s the truth, blue is for the brave.']] },
  { id: 'splices', from: 10, to: 3, scene: 'plaza_diner', at: [5, 4.6], who: 'DOT', model: 'waitress', desc: 'A REEL OF 1998 PREVIEWS', pay: 20,
    lines: [['DOT', 'Previews from the year everything closed. Food ads, mostly.'], ['DOT', 'I\'ll watch them during the rush. The rush is theoretical, but I\'m consistent.']] },
  { id: 'speakers', from: 10, to: 4, scene: 'mall_hall', at: [-18, 6], who: 'A MALL WALKER', model: 'tourist', desc: 'TWO DRIVE-IN SPEAKERS', pay: 25,
    task: async () => await wires('SPEAKER WIRES', 4),
    lines: [['A MALL WALKER', 'Hang them in the fountain court. Facing each other.'], ['A MALL WALKER', 'They\'ll play the sound of nobody, in stereo. It\'s the best thing in the building now.']] },
  { id: 'boots', from: 10, to: 9, scene: 'lodge_lot', at: [12, 10], who: 'CHIP', model: 'chip', desc: 'SKI BOOTS, CHILD\'S', pay: 15,
    lines: [['CHIP', 'Kid\'s boots, size small. For the bunny hill.'], ['CHIP', 'Somebody\'s kid is going to learn here someday. The hill can wait. Hills are the waitingest thing there is.']] },
  { id: 'salt', from: 11, to: 9, scene: 'lodge_hall', at: [-8, 4], who: 'JUNE', model: 'june', desc: 'ROCK SALT, GENUINE, 25LB', pay: 35,
    task: async () => { const c = await ask('WHERE DOES SALT GO?', null, ['THE STEPS', 'A SHOTGUN']); return true; },
    lines: [['JUNE', 'Genuine rock salt, from a genuine ghost town. For the steps, when it ices.'], ['JUNE', 'The other kind is for shotguns, dear. I know a woman who\'d agree. I hope you meet her.']] },
  { id: 'bottle', from: 11, to: 7, scene: 'inn_lot', at: [-14, 12], who: 'DODIE', model: 'dodie', desc: 'A BOTTLE FROM THE BOTTLE HOUSE', pay: 30,
    lines: [['DODIE', 'A bottle from a bottle house! It\'s older than the state and twice as pretty.'], ['DODIE', 'It goes with the dolls. The dolls needed a grandma.']] },
  { id: 'quartz', from: 8, to: 11, scene: 'ghost_post', at: [0, 5], who: 'OPAL', model: 'opal', desc: 'A QUARTZ CLOCK MOVEMENT', pay: 40, cond: () => F3('done11'),
    lines: [['OPAL', 'A quartz movement. The honest kind of ticking.'], ['OPAL', 'The Service offered me one in the spring, along with everything else. I\'d rather take it from a courier. Set it by the six o\'clock reading.']] },
  { id: 'jackpot', from: 8, to: 2, scene: 'motel_lot', at: [24, 12], who: 'DOLORES', model: 'manager', desc: 'A FRAMED DOLLAR, FIRST WIN', pay: 20,
    lines: [['DOLORES', 'Somebody\'s first win, framed. You can smell the night on it.'], ['DOLORES', 'It goes behind the desk. Evidence that the desert pays out, occasionally, to prove it can.']] },
  { id: 'cigars', from: 8, to: 3, scene: 'plaza_lot', at: [30, 28], who: 'SLIM', model: 'trucker', desc: 'CIGARS, CELEBRATORY', pay: 25,
    lines: [['SLIM', 'One for each truck I don\'t own anymore. Nine cigars.'], ['CARL', 'That\'s a lot of trucks.'], ['SLIM', 'That\'s a lot of roads. The roads are what I kept.']] },
);
// ---------------- decoy crates: the tall ones' walk, boxes 2, 4-7, 9-31 (1, 3 and 8 are above) ----------------
CRATES.push(
  { n: 2, scene: 'canyon_post', at: [-6.8, 3.4], note: 'The postmaster keeps the town at eleven. It was ten when we came through. We did not ask who he added.' },
  { n: 4, scene: 'motel_lot', at: [-22, 15], note: 'To whoever opens this: the vending machine takes exact change. It took ours twice. Consider it a toll. Drive safe.' },
  { n: 5, scene: 'motel_room6', at: [3.6, 5.6], note: 'One night a year we keep a room nobody sleeps in. Not even us. Practice, he called it. For what, she wrote in the margin.' },
  { n: 6, scene: 'plaza_lot', at: [36, 26], note: 'Forty acres of nobody. He liked it here. She said the liking was the sad part. She was not wrong. She usually isn\'t.' },
  { n: 7, scene: 'plaza_diner', at: [-10, 6.6], note: 'To the waitress: your pie is honest and your coffee is a rumor. We paid in stamps. Sorry. Old habit.' },
  { n: 9, scene: 'mall_out', at: [-30, 30], note: 'The mall died before it finished opening. He wanted the photo booth anyway. She said the strip could wait for the boy.' },
  { n: 10, scene: 'mall_hall', at: [20, 17], note: 'To the little one, if it is you: label your wires. Label your years. We labeled ours too late and moved anyway.' },
  { n: 11, scene: 'mall_unit14', at: [-4, 2], note: 'Somebody left a deposit on a dream next door. We did not knock. Knocking is for people with news.' },
  { n: 12, scene: 'sort_dock', at: [-26, 4], note: 'The dock clerk whistles while she works. He learned the tune by the second bay. She caught him humming it a state later.' },
  { n: 13, scene: 'sort_hall', at: [-26, 25], note: 'To the inspector who opens this one: grief weighs the same as paper. Plan your lifting accordingly. We did.' },
  { n: 14, scene: 'inn_lot', at: [26, 20], note: 'The pie is cherry. The sky is patient. We took the corner booth and watched the road we would put you on.' },
  { n: 15, scene: 'inn_shop', at: [-10, 10], note: 'To Bev, if it is still Bev: leave the glasses where you left them. The short one comes in eventually. We mean the courier.' },
  { n: 16, scene: 'lodge_lot', at: [22, 16], note: 'The lake froze in June. She said it reminded her of a promise. He said it reminded him of a floor. They meant the same thing.' },
  { n: 17, scene: 'lodge_hall', at: [-12, 4], note: 'If the little one is reading: the man at this desk will practice the card every night. We asked him not to. Let him.' },
  { n: 18, scene: 'lodge_closet', at: [2, 2], note: 'One mitten since \'71. We asked whose. Nobody knew. That is this whole town, and most of the mail.' },
  { n: 19, scene: 'drivein_lot', at: [24, 8], note: 'Third row, second speaker still hums. We heard our own road hummed back at us and did not stay for the second feature.' },
  { n: 20, scene: 'booth', at: [3, 2.2], note: 'To the projectionist: the reel never turns around. Neither did we, in the end. Keep the leader. The blank holds the movie.' },
  { n: 21, scene: 'ghost_main', at: [-30, 20], note: 'To the inspectors: a town with no back is still a town. So is a family with no address. Mind the salt.' },
  { n: 22, scene: 'ghost_post', at: [-4.5, 5], note: 'Opal: keep the boards up and the bolts oiled. When the last stamp comes down you may rest. Not before.' },
  { n: 23, scene: 'canyon_post', at: [5, 9.5], note: 'Second box, same town. He wanted to be sure. She wanted to be sure he was sure. This took a while.' },
  { n: 24, scene: 'motel_lot', at: [12, 5], note: 'We hope you ate. The pie in the next county is cherry. The one after that is also cherry. It is a cherry state.' },
  { n: 25, scene: 'plaza_lot', at: [-20, 26], note: 'To whoever opens this: forty acres, three trucks, one waitress. Do the arithmetic on loneliness. Then tip her.' },
  { n: 26, scene: 'mall_out', at: [24, 20], note: 'The fountain is dry but it is still a fountain. That is the most Nevada thing there is. He said that. She wrote it down.' },
  { n: 27, scene: 'spur_floor', at: [16, 14], note: 'Machine 31. She put a quarter in and did not pull. Some levers are for the right hand. Ours were the wrong ones.' },
  { n: 28, scene: 'inn_lot', at: [-30, 14], note: 'The dolls face the door. Face something, always. It works for dolls and it works for people. He said that backwards.' },
  { n: 29, scene: 'lodge_lot', at: [-26, 18], note: 'If the little one is reading: skiing is falling with an argument attached. Keep the argument. We kept ours.' },
  { n: 30, scene: 'drivein_lot', at: [-24, 22], note: 'The screen shows whatever it is pointed at. Point yourself somewhere good, little one. We pointed you east.' },
  { n: 31, scene: 'ghost_main', at: [44, 10], note: 'Last box. We are still in transit. That is not a place, but it is an answer. Love, both hands: one stiff, one round.' },
);
// ---------------- roadside stops: fourteen more shoulders of highway ----------------
ROADSIDE.push(
  { id: 'rabbit', once: 1, run: async () => {
    rsPut('rabbit', null, 1.5, 6.4, 'A JACKRABBIT', { noShadow: 1, draw3: e => drawModel({ h: .5, parts: [{ m: 'sphere:.22:6:4', o: [0, .18, 0], col: [176, 144, 96] }, { m: 'box:.08:.24:.03', o: [-.07, .42, 0], col: [176, 144, 96] }, { m: 'box:.08:.24:.03', o: [.07, .42, 0], col: [176, 144, 96] }] }, { p: e.p, yaw: e.yaw }, liveLight(WX.sc, e.p)) });
    await say('A JACKRABBIT THE SIZE OF A BEAGLE STANDS IN THE MIDDLE OF THE SHOULDER. IT IS NOT MOVING. YOU ARE NOT MOVING. THE NIGHT HOLDS ITS BREATH.');
    await say2([['CARL', 'Chat, it\'s doing a bit. It\'s doing a standoff bit. I invented that bit.'], [U0, 'who blinks first']]);
    const c = await ask('THE RABBIT WAITS.', null, ['WAIT IT OUT', 'HONK']);
    if (c === 0) { await wait(60); await say2([['CARL', '...It nodded. It nodded and left. Nobody is going to believe me and that\'s fine, that\'s FINE.'], [U0, 'the rabbit respects you carl']]); addNote('A jackrabbit conceded a standoff. Nobody will believe him.'); }
    else { sfx('alert'); await say('YOU HONK. THE RABBIT DOES NOT FLINCH. IT LOOKS AT THE HORN, THEN AT YOU, THE WAY A CRAFTSMAN LOOKS AT AMATEUR WORK. THEN IT LEAVES WITHOUT CONCEDING ANYTHING.'); tickC('the rabbit won', 'nevada_local'); }
  } },
  { id: 'icecream', once: 1, run: async () => {
    rsCar('icevan', 5, 6, 1.57, '#ffdbff'); rsPut('hatman', 'tourist', 3, 4.6, 'A MAN IN A PAPER HAT');
    await say('AN ICE CREAM TRUCK ON THE SHOULDER, HEADLIGHTS ON, MUSIC DYING. A MAN IN A PAPER HAT LIFTS A PANEL THAT SHOULD NOT LIFT.');
    await say2([['A MAN IN A PAPER HAT', 'She quit mid-song. Do you know trucks?'], ['CARL', 'I know ships.'], ['A MAN IN A PAPER HAT', 'Cold is cold. Fix the cold and the music comes back. Kids three towns over are counting on you.']]);
    if (await ask('HELP THE TRUCK?', null, ['LOOK UNDER THE PANEL', 'KEEP DRIVING']) !== 0) return say2([['A MAN IN A PAPER HAT', 'Some courier.'], ['CARL', 'Ice cream is a WANT. I carry NEEDS.'], ['A MAN IN A PAPER HAT', 'Tell that to a kid in July.']]);
    if (!(await wires('ICE CREAM TRUCK', 4))) return say2([['A MAN IN A PAPER HAT', 'The song is slower now. That\'s worse. That\'s somehow worse.']]);
    C3.bux += 12; sfx('get');
    await say2([['A MAN IN A PAPER HAT', 'THERE she is. Twelve bucks, and the cone\'s on the house. Warm, but on the house.'], ['CARL', 'The cone is warm.'], ['A MAN IN A PAPER HAT', 'The friendship is cold. Take both.']]);
  } },
  { id: 'desertbus', once: 1, weight: .5, cond: next => [8, 9, 10].includes(next), run: async () => {
    rsCar('dbus', 8, 20, 1.57, '#c8c8d0');
    await say('A WHITE COACH PASSES AT EXACTLY FORTY-FIVE MILES PER HOUR. IT DOES NOT SPEED UP. IT DOES NOT SLOW DOWN. IT HAS NEVER DONE EITHER.');
    await say2([['CARL', 'The windows are full of people playing handheld games. One of them looks up. That\'s the most eventful thing that\'s ever happened on that bus.'], [U0, 'W'], ['CARL', 'W.']]);
    addNote('Passed the Desert Bus: 45 mph, forever, both directions of always.');
  } },
  { id: 'tourgroup', once: 1, cond: () => F3('arrived4'), run: async () => {
    rsPut('guide', 'tourist', 2.4, 5, 'A TOUR GUIDE'); rsPut('tguy', 'tourist', 4, 4.2, '', { yaw: 3.4 }); rsPut('tguy2', 'tourist', 6.4, 5.2, '', { yaw: 2.9 });
    await say('FOUR PEOPLE IN THE SAME ORANGE SHIRT STAND ON THE SHOULDER. THEIR GUIDE HOLDS A FLAG NOBODY IS FOLLOWING.');
    await say2([['A TOUR GUIDE', 'We were seeing the mall. The DESERT Palms mall. We parked to see the sunsets, and the bus... you haven\'t seen a bus.'], ['CARL', 'Which way is the mall?'], ['A TOUR GUIDE', 'That depends on which way the mall went.']]);
    const c = await ask('POINT THEM SOMEWHERE?', null, ['POINT AT THE MALL', 'POINT AT THE HORIZON']);
    await say(c === 0 ? 'YOU POINT EAST. THEY PHOTOGRAPH YOUR ARM.' : 'YOU POINT AT THE HORIZON. THEY PHOTOGRAPH THE HORIZON. THE HORIZON DOES NOT MIND.');
    await say2([['A TOUR GUIDE', 'The tour continues!'], ['CARL', 'It really doesn\'t.'], ['A TOUR GUIDE', 'It really doesn\'t!']]);
    addNote('A tour group, lost since the sunsets. The tour continues.');
  } },
  { id: 'ghosthh', once: 1, weight: 1.5, cond: () => F3('ghostOn'), run: async () => {
    rsPut('ghh', null, 1.8, 6, GH3, { noShadow: 1, draw3: e => drawModel(ghostBust(), { p: e.p, yaw: e.yaw, s: 1.4 }, liveLight(WX.sc, e.p)) });
    await say('A GHOST IN A BOW TIE STANDS ON THE SHOULDER WITH HIS THUMB OUT. HIS THUMB IS ALSO A GHOST.');
    await say2([[GH3, 'Carl! Bro! Don\'t— it\'s not weird.'], ['CARL', 'You\'re IN my radio. Why are you hitchhiking.'], [GH3, 'The frequency was full. I\'m between stations. It\'s a whole thing.'], ['CARL', 'Where are you even going?'], [GH3, 'The next reality over. Or Reno. Whichever has the better lounge.']]);
    const c = await ask('OFFER A RIDE?', null, ['OPEN THE DOOR', 'THE SHIP HAS NO PASSENGER SEAT']);
    if (c === 0) { await say2([['CARL', 'Get in. Wait. You\'re already in. Are you IN the seat or ON the radio?'], [GH3, 'Yes.'], ['CARL', 'Okay. Okay, that\'s a normal sentence now.'], [GH3, 'Drop me at the horizon, bro. I\'ll take it from there. It\'s what I do.']]); addNote('Picked up Spooky Ghost hitchhiking. He was also in the radio the whole time. He took it from there.'); }
    else await say2([['CARL', 'The ship has one seat. It\'s mine. It\'s a solo vehicle.'], [GH3, 'Harsh but fair. Tell the radio I said hi. I\'ll hear you say it.']]);
  } },
  { id: 'suits', once: 1, run: async () => {
    rsPut('sa1', 'suit', 2.6, 6.2, SV); rsPut('sa2', 'suit', 4.8, 6.8, '', { yaw: 2.6 });
    await say('TWO MEN IN WHITE STAND BY A SEDAN, ARGUING. NOT HEATEDLY. SINCERELY. THE WAY PEOPLE ARGUE ABOUT THINGS THAT MATTER TO NOBODY ALIVE.');
    await say2([[SV, 'Regulation 4.4 states "unattended." The parcel is attended. He IS the attendance.'], [SV, 'It says attended BY A PARTY OF RECORD. There is no party of record.'], [SV, 'The ADDRESSEE is the party of record.'], [SV, 'The addressee is the DRIVER. That can\'t be right. Nothing about this is right, Kevin.']]);
    await say2([['CARL', 'Chat, they\'re doing the thing I do. Arguing about a box. They\'re ME. I\'m THEM.'], [U0, 'carl no'], ['CARL', 'I have to pick a side. It\'s a compulsion. It\'s an ILLNESS.']]);
    const c = await ask('TAKE A SIDE?', null, ['THE FIRST ONE', 'THE SECOND ONE']);
    if (c === 0) await say2([[SV, 'Thank you. THANK you. Take this ten dollars, which I am not authorized to give, for a settlement, which I am not authorized to offer.'], [SV, 'Kevin. The courier rules for ME.'], [SV, 'The courier is not a regulation, Greg.']]);
    else await say2([[SV, 'See? SEE, Greg? The driver understands. Ten dollars for your silence, which I notice you accepted very fast.'], ['CARL', 'I accept all monies. That\'s also a regulation. Mine.']]);
    C3.bux += 10; sfx('get'); addNote('Two Service agents argued 4.4 "unattended" sincerely. One paid Carl $10 to be right. Their names were Kevin and Greg.');
  } },
  { id: 'cow', once: 1, run: async () => {
    rsPut('cow', null, 2, 6, 'A COW', { draw3: e => drawModel({ h: 1, parts: [{ m: 'box:1.1:1:2', o: [0, .5, 0], col: [240, 240, 240] }, { m: 'box:.9:.9:.2', o: [0, 1.2, 1], col: [240, 240, 240] }, { m: 'box:.9:.1:.9', o: [0, .96, 1.05], col: [255, 136, 48] }] }, { p: e.p, yaw: e.yaw + Math.PI }, liveLight(WX.sc, e.p)) });
    await say('A COW. ON THE CENTERLINE. FACING ONCOMING TRAFFIC, WHICH IS YOU. HER EXPRESSION SUGGESTS SHE HAS READ THE LAW.');
    const c = await ask('A COW.', null, ['WAIT', 'SHOO']);
    if (c === 0) { await wait(80); await say2([['CARL', 'She moved. Eventually. On her own schedule. I respect it. Fear it, but respect it.']]); }
    else { sfx('hurt'); await say2([['CARL', 'I said shoo. She looked at my FEET, chat. Like she was measuring them against a menu.'], [U0, 'never shoo a cow carl']]); }
    addNote('A cow, on the line, within her rights. She filed no report.');
  } },
  { id: 'rocks', once: 1, run: async () => {
    rsPut('rockman', 'farmer', 2.4, 5, 'A ROCK SALESMAN');
    await say('A FOLDING TABLE ON THE SHOULDER. A SIGN: "AUTHENTIC ALIEN ROCKS." THE MAN BEHIND IT SEES THE SHIP AND STANDS UP SO FAST HIS CHAIR FALLS.');
    await say2([['A ROCK SALESMAN', 'Oh. Oh, wow. Okay. Wow. You\'re... you\'re really—'], ['CARL', 'I\'m a tourist.'], ['A ROCK SALESMAN', 'You\'re GLOWING. Not glowing, but... present. You\'re very present.'], ['CARL', 'It\'s the lighting.'], ['A ROCK SALESMAN', 'It\'s NIGHT, man.']]);
    const c = await ask('BUY A ROCK? $5', null, ['BUY ONE', 'NO']);
    if (c === 0 && C3.bux >= 5) { C3.bux -= 5; sfx('get'); await say2([['CARL', 'It\'s a river rock.'], ['A ROCK SALESMAN', 'It\'s from a river NEAR aliens.'], ['CARL', '...Fine. It\'s a good rock. Keep the five.']]); addNote('Bought an authentic alien rock. It is a river rock. It is a good rock.'); }
    else if (c === 0) await say('NO $5. THE ROCK SALESMAN LOOKS AT THE SHIP, THEN AT YOU, AND DECIDES NOT TO OFFER FINANCING.');
    else await say2([['A ROCK SALESMAN', 'You of all people. You of ALL people.'], ['CARL', 'I know what rocks are, man. That\'s the problem.']]);
  } },
  { id: 'booth', once: 1, run: async () => {
    rsPut('booth', null, 3, 6.4, 'A PHONE BOOTH', { draw3: e => { const sp = project(LIVE.cam, [e.p[0], 1.2, e.p[2]]); if (sp) { rectF(sp[0] - 7, sp[1] - 26, 14, 34, hex('#496d92')); rectF(sp[0] - 5, sp[1] - 24, 10, 12, hex('#92dbff')); rectF(sp[0] - 5, sp[1] - 10, 10, 12, hex('#92dbff')); } } });
    await say('A PHONE BOOTH. NO ROAD, NO BUILDING, NO WIRES GOING ANYWHERE. IT IS RINGING.');
    const c = await ask('IT KEEPS RINGING.', null, ['ANSWER IT', 'LEAVE IT']);
    if (c !== 0) return say2([['CARL', 'Not my booth. Not my ringing. I have a rule about phones that ring for other people.'], [U0, 'it rang for you carl'], ['CARL', 'It rang NEAR me. That\'s different. That\'s legally different.']]);
    sfx('static'); await say2([['CARL', 'Hello?'], ['A VOICE', 'Is this the previous occupant?'], ['CARL', 'There\'s no occupant. It\'s a desert.'], ['A VOICE', 'Then the message is for whoever\'s standing there. "The tables are ours. Love, Mom."'], ['CARL', 'I... will pass that along. To no one. Forever.']]);
    addNote('A phone booth in nowhere: "The tables are ours. Love, Mom." For no one. Forever.');
  } },
  { id: 'backwards', once: 1, run: async () => {
    rsPut('mailwalk', 'clerk', 2, 5.4, 'A MAN WALKING BACKWARDS');
    await say('A MAN IN A MAIL UNIFORM WALKS BACKWARDS ALONG THE SHOULDER, SLOWLY, LIKE A MAN READING A ROOM HE ALREADY LEFT.');
    await say2([['A MAN WALKING BACKWARDS', 'Don\'t mind me. I walk the route backwards. That way, when I look back, it reads left to right, like it\'s supposed to.'], ['CARL', 'You retired. From the postal service.'], ['A MAN WALKING BACKWARDS', 'Thirty-one years. You don\'t stop. You just stop getting paid.'], ['CARL', 'I\'m sort of in the business.'], ['A MAN WALKING BACKWARDS', 'Then here. Free of charge: the mail goes where it\'s BEEN. You want to find where a thing\'s going, walk where it came from. Backwards works.']]);
    addNote('A retired mailman, walking his route backwards: "Want to find where a thing\'s going? Walk where it came from."');
    if (await ask('TIP HIM $2?', null, ['TIP', 'NO']) === 0 && C3.bux >= 2) { C3.bux -= 2; await say2([['A MAN WALKING BACKWARDS', 'A tip! For walking! The route provides. Take care now. I\'ll see you before you leave.'], ['CARL', 'I\'m going east.'], ['A MAN WALKING BACKWARDS', 'That\'s what I said.']]); }
  } },
  { id: 'air', once: 1, run: async () => {
    rsPut('airman', 'mechanic', 2.4, 5.2, 'THE ATTENDANT');
    await say('A ONE-PUMP STATION WITH A SIGN: "LAST GAS 40 MILES." UNDER IT, SMALLER: "PSYCH." THE PUMP HAS BEEN REPLACED BY AN AIR HOSE.');
    await say2([['THE ATTENDANT', 'Gas? No. Gas is gone. Air\'s free though. Air\'s the one thing they haven\'t figured out how to run out of.'], ['CARL', 'Who\'s they?'], ['THE ATTENDANT', 'Oh, you know. Them. The gas people. The sky people. Whoever.']]);
    const c = await ask('FREE AIR?', null, ['AIR UP', 'ASK ABOUT THE ROAD']);
    if (c === 0) { sfx('power'); await say2([['THE ATTENDANT', 'There. Right as rain, which it also isn\'t.'], ['CARL', 'The ship doesn\'t have tires.'], ['THE ATTENDANT', 'Everything\'s got tires somewhere in it, friend.']]); }
    else await say2([['THE ATTENDANT', 'Road\'s fine. Road\'s long. Long is fine, long is honest. Gas was a lie but the road never lied to me once.']]);
  } },
  { id: 'lemonade', once: 1, run: async () => {
    rsPut('stand', null, 2.6, 5, 'LEMONADE?', { draw3: e => { const sp = project(LIVE.cam, [e.p[0], .8, e.p[2]]); if (sp) { rectF(sp[0] - 8, sp[1] - 8, 16, 2, hex('#b6923a')); rectF(sp[0] - 1, sp[1] - 6, 2, 6, hex('#8a6a48')); rectF(sp[0] - 5, sp[1] - 12, 10, 4, hex('#ffdb24')); } } });
    await say('A LEMONADE STAND, AT TWO IN THE MORNING. JAR, SIGN, PITCHER. NO CHILDREN. THE LEMONADE IS FRESH. THE JAR IS EMPTY.');
    await say2([['CARL', 'Chat. The stand is running itself. The ice is still ice. WHERE IS THE ICE FROM.'], [U0, 'leave money']]);
    const c = await ask('THE SIGN SAYS 25¢.', null, ['PAY $1', 'TAKE A CUP, LEAVE A NOTE']);
    if (c === 0 && C3.bux >= 1) { C3.bux -= 1; sfx('get'); await say2([['CARL', 'Best lemonade I\'ve ever had, and I\'ve HAD lemonade. The cup refilled. Chat. THE CUP REFILLED. I put it back. You put back what refills.'], [U0, 'the desert keeps the change']]); addNote('Paid a self-running lemonade stand at 2 a.m. The cup refilled. He put it back.'); }
    else if (c === 0) await say('NOT EVEN $1. THE STAND DOES NOT JUDGE. THE STAND HAS NO FACE, AND YET.');
    else await say('YOU TAKE A CUP AND LEAVE A NOTE: "BACK TUESDAY." YOU WILL NOT BE BACK TUESDAY. THE LEMONADE KNOWS. IT\'S FINE WITH IT.');
  } },
  { id: 'coat', once: 1, run: async () => {
    rsPut('coat', null, 2.2, 5.6, 'A COAT', { draw3: e => { const sp = project(LIVE.cam, [e.p[0], .8, e.p[2]]); if (sp) { rectF(sp[0] - 4, sp[1] - 10, 8, 12, hex('#6d4924')); rectF(sp[0] - 3, sp[1] - 12, 6, 3, hex('#49361f')); } } });
    await say('A HITCHHIKER. EXCEPT IT\'S A COAT ON A POST. THE COAT HAS ITS THUMB OUT. THE THUMB IS A GLOVE WITH ONE FINGER UP.');
    const c = await ask('THE COAT WAITS.', null, ['OFFER A RIDE', 'LEAVE IT']);
    if (c !== 0) return say2([['CARL', 'I\'m not driving a coat around. I have STANDARDS, chat, I have a whole ledger of standards.'], [U0, 'the coat understands'], ['CARL', 'Does it? Does it REALLY?']]);
    await say2([['CARL', '...Get in. GET— okay, I\'m putting the coat in the cargo bay. It\'s riding in the back. It earned the back.'], ['CARL', 'It\'s a good coat. Somebody wore this coat to WORK, for years, and then the coat just kept going.']]);
    addNote('Gave a coat on a post a ride. Dropped it at the next stop. It\'s a good coat. It kept going.');
  } },
  { id: 'surveyor', once: 1, run: async () => {
    rsPut('surv', 'mechanic', 2.4, 5.4, 'A SURVEYOR');
    await say('A SURVEYOR WITH A THEODOLITE TAKES A READING, LOOKS AT IT, TAKES IT AGAIN. A LONG TAPE MEASURE RUNS OFF INTO THE DARK.');
    await say2([['A SURVEYOR', 'Hold this? Just for a second. Don\'t let it slack. The road slackens, the whole survey\'s off.'], ['CARL', 'Sure. Why twice?'], ['A SURVEYOR', 'Because it got LONGER. Roads do that. Nobody believes me. It was 411 miles on Tuesday.'], ['CARL', 'What is it now?'], ['A SURVEYOR', 'Don\'t ask questions you have to carry.']]);
    if (await ask('HOLD THE TAPE? ($8)', null, ['HOLD IT', 'NO']) === 0) { await wait(50); C3.bux += 8; sfx('get'); await say2([['A SURVEYOR', 'Good tension. You\'d have made a decent stake. Eight bucks. And a fact, free: the road to the ghost town grew the most. Towns that die keep growing. Roads included.'], ['CARL', 'That\'s not comforting.'], ['A SURVEYOR', 'It\'s not for comfort. It\'s surveying.']]); addNote('A surveyor: the road grew since Tuesday. "Towns that die keep growing."'); }
    else await say2([['A SURVEYOR', 'Nobody holds the tape. That\'s the whole problem with this state.']]);
  } },
);
// ---------------- CB chatter: lines for the ACT I stops too ----------------
Object.assign(CBTALK, {
  1: [['CH 19', '...Box Canyon\'s OPEN sign is lit, breaker. First time since Tuesday. Somebody finally touched the panel...'],
      ['CH 19', '...eleven people, one post office, no gas. And a green fella in the lot. Real friendly. Real SHORT...']],
  2: [['CH 19', '...Starlite\'s got a light on in Room 6. First time in years anybody\'s looked in there...'],
      ['CH 19', '...motel pink at night, breaker. You can read a map by it. Not a GOOD map. A map...']],
  3: [['CH 19', '...lounge channel at Leon\'s is playing something new. First tape that machine\'s eaten in a decade...'],
      ['CH 19', '...forty acres and nobody parks in \'em. You could land a SHIP in that lot. Breaker, somebody did...']],
  4: [['CH 19', '...mall\'s lit up. THE MALL. Every light, all at once. Check your mirrors, it\'s real...'],
      ['CH 19', '...fountain still don\'t work, but it\'s lit. That\'s Nevada for you: all presentation, no water...'],
      ['CH 19', '...unit 14\'s got its shutter up. Pink sign. Nobody knows from nothing...']],
});
CBTALK[8].push(['CH 19', '...somebody hit the jackpot on 31. Machine that wouldn\'t pay since \'97. Town\'s talking. Both of \'em...']);

// ---------------- roadside stops (ACT II and after; one per drive at most) ----------------
const rsCar = (id, x, z, yaw, col) => addEnt3({ id, kind: 'prop3', at: [x, 0, z], label: '', range: 0, draw3: e => drawModel({ h: 1.4, parts: [{ m: 'box:1.9:.8:4.2', o: [0, .3, 0], col: rgbh(col) }, { m: 'box:1.6:.6:2.2', o: [0, 1.1, -.2], col: [32, 40, 56] }, { m: 'box:1.7:.08:1.2', o: [0, 1.3, 1.6], col: rgbh(col) }] }, { p: e.p, yaw }, liveLight(WX.sc, e.p)) });
ROADSIDE.push(
  { id: 'minivan', once: 1, run: async () => {
    rsCar('van', 5, 6, 1.57, '#6d92b6'); rsPut('dad', 'tourist', 3, 4.6, 'A DAD'); rsPut('kid', 'kid', 6.8, 4.4, '', { yaw: 3.6 });
    await say('A MINIVAN ON THE SHOULDER, HOOD UP. A DAD STANDS IN FRONT OF IT LIKE IT OWES HIM AN APOLOGY.');
    await say2([['A DAD', 'Every light on the dash is on. Even the one that\'s a picture of a teapot. Do you know cars?'], ['CARL', 'I know ships.'], ['A DAD', 'Is it closer than me?']]);
    if (await ask('HELP?', null, ['LOOK UNDER THE HOOD', 'KEEP DRIVING']) !== 0) return say2([['CARL', 'I have a parcel. I\'m sorry. I\'ll send somebody.'], ['A DAD', 'Who?'], ['CARL', 'I don\'t know anybody.']]);
    if (!(await wires('MINIVAN', 4))) return say2([['A DAD', 'Now the teapot\'s blinking.'], ['CARL', 'That\'s progress. That\'s a different teapot.']]);
    C3.bux += 15; sfx('get');
    await say2([['A DAD', 'It started! Here. Fifteen bucks. And my kid drew you.'], ['CARL', 'It\'s a green guy in a saucer.'], ['A DAD', 'He draws everybody like that. It\'s a phase.'], ['CARL', 'It\'s a good phase.']]);
  } },
  { id: 'mailbox', once: 1, run: async () => {
    rsPut('mbman', 'farmer', 2.4, 5, 'A MAN WITH A MAILBOX');
    await say('A MAN IS STANDING ON THE SHOULDER HOLDING A MAILBOX. THE WHOLE MAILBOX. THE POST IS STILL ATTACHED.');
    await say2([['A MAN WITH A MAILBOX', 'You\'re a courier. I can tell. You have the posture.'], ['A MAN WITH A MAILBOX', 'Nobody\'s picked up from this box since 1988. It\'s full. I thought I\'d bring it to them.'], ['CARL', 'Walking?'], ['A MAN WITH A MAILBOX', 'I got a late start.']]);
    if (await ask('TAKE HIS LETTERS?', null, ['TAKE THEM', 'NO']) !== 0) return say2([['A MAN WITH A MAILBOX', 'That\'s fine. It\'s only another forty miles.']]);
    await say('FORTY-ONE LETTERS. THEY ARE ALL ADDRESSED TO THE SAME PERSON. CARL DOESN\'T READ THE NAME. THAT ISN\'T HIS TO READ.');
    C3.deliveries++; addNote('THE MAILBOX MAN: 41 letters, 1988. Taken. Not read.');
    await say2([['A MAN WITH A MAILBOX', 'Thank you. I\'ll keep the box. I\'ve gotten used to it.']]);
  } },
);
