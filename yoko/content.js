'use strict';
// ================= YOKO — content pass: requests, COOTERS, the Mandolin diner and school, the barracks =================
// Loaded after chapters2.js. Extends existing scenes through extend(); the requests count as evidence in the debate.

// ---------- new faces ----------
PORT.JUAN = { s: CAST.img.clerk, P: CAST.variant('clerk', { 2: '#db9249', 3: '#b66d24', 4: '#242424', 5: '#249249', 6: '#006d24' }) }; VOICE.JUAN = [520, 70];
PORT['THE DECORATION'] = { s: CAST.img.empress, P: CAST.variant('empress', { 6: '#b692db', 7: '#6d49b6', 14: '#492492' }) }; VOICE['THE DECORATION'] = [170, 10];
PORT['JB GARFEILD'] = { s: CAST.img.garfield, P: CAST.variant('garfield', { 2: '#ffdb24', 3: '#dba249', 4: '#ffffff' }) }; VOICE['JB GARFEILD'] = (VOICE[JB] || [300, 30]).map(v => v * 1.15);
PORT['UNIT 0451'] = { s: CAST.img.yokoid, P: CAST.variant('yokoid', { 7: '#6d9249', 8: '#496d24', 9: '#92b66d' }) }; VOICE['UNIT 0451'] = [1400, 0];
PORT['COOTERS BUNNY'] = { s: CAST.img.linda, P: CAST.variant('linda', { 5: '#101010', 6: '#242424' }) }; VOICE['COOTERS BUNNY'] = [640, 40];
PORT.BARTENDER = PORT[YD]; VOICE.BARTENDER = VOICE[YD];
PORT['EX-WIFE'] = PORT['SPOOKY GHOST'] ? { s: CAST.img.ghost, P: legacyPal(CAST.P.ghost, 'red') } : PORT.CLERK; VOICE['EX-WIFE'] = [900, 80];

// ---------- requests: small things people ask for. the record keeps count ----------
const REQ = {
  home: ['A SHOPPER WANTS TO GO HOME', 'HE KEEPS SAYING HE\'S DOING VERY WELL. TRANSLATE HIM. THEN THINK ABOUT HOW CARL TAKES ADVICE.', 'THE SHOPPER WENT HOME. ELM STREET.'],
  drink: ['THE BARTENDER AT SUITORS', 'NOBODY DRINKS THE DRINKS. SOMEONE WITH AN APPETITE MIGHT.', 'THE BARTENDER AT SUITORS FINALLY POURS FOR SOMEONE.'],
  coffee: ['LINDA\'S COFFEE', 'THE MACHINE ONLY MAKES PORTRAITS IN THE FOAM. READ THE DISPLAY.', 'LINDA\'S COFFEE COMES PLAIN NOW. SHE PRETENDS TO HATE IT.'],
  returns: ['JUAN\'S RETURNS', 'HIS YOKOIDS MAIL THEMSELVES BACK. FIND OUT WHY. (THE BACK ROOM.)', 'JUAN SWITCHED TO EXPORTS.'],
  wives: ['THE EX-WIVES', 'THEY DON\'T WANT TO FIGHT. THEY WANT TO HEAR SOMETHING. GHOST COULD SAY IT.', 'THE EX-WIVES GOT THEIR APOLOGY. ALSO THE MONEY.'],
  form: ['FORM 27', 'NOBODY HAS EVER SIGNED IT. CARL SIGNS WHAT HE ISN\'T SUPPOSED TO.', 'FORM 27 HANGS IN THE ARCHIVE. FRAMED.'],
  time: ['THE KID', 'HE ASKED FOR SOMETHING SMALL. GIVE IT TO HIM.', 'THE KID KNOWS WHAT TIME IT IS.'],
  delivery: ['KARL\'S DELIVERY', 'A MANDOLIN FOR GARFEILD\'S DINER.', 'THE MANDOLIN ARRIVED ON TIME. EVERYTHING HERE DOES.'],
  song: ['SPOOKEY\'S SONG', 'HE PLAYS FOR WHOEVER\'S THERE. BE THERE. (THE SCHOOL.)', 'SPOOKEY HAS AN AUDIENCE OF ONE. IT\'S ENOUGH.'],
  pretzels: ['UNIT 0451', 'IT HAS ASKED FOR A TRANSFER FOURTEEN TIMES. SOMEONE WITH AUTHORITY COULD SAY YES.', 'UNIT 0451 SELLS PRETZELS AT THE FRONT. THEY\'RE WARM.'],
};
// which chapter each request belongs to: once the chapter is over, its rooms are gone, so an open one lapses
const REQ_CH = { home: 1, drink: 1, coffee: 1, returns: 1, wives: 2, form: 2, time: 2, delivery: 4, song: 4, pretzels: 5 };
const reqState = id => ADV.flags['rd_' + id] ? 2 : ADV.flags['rq_' + id] ? 1 : 0;
async function reqOpen(id) { if (reqState(id)) return; ADV.flags['rq_' + id] = 1; sfx('ok'); await say('A REQUEST: ' + REQ[id][0] + '. (YOKO WRITES IT DOWN. "NOTES" HAS THE LIST.)'); }
async function reqDone(id) { if (reqState(id) !== 1) return; ADV.flags['rd_' + id] = 1; YREC.helped = (YREC.helped || 0) + 1; sfx('get'); await say('REQUEST COMPLETE: ' + REQ[id][0] + '.  HELPED: ' + YREC.helped + '.'); }
const reqOpenList = () => Object.keys(REQ).filter(id => reqState(id) === 1 && REQ_CH[id] === ADV.ch);
const reqLapsed = () => Object.keys(REQ).filter(id => reqState(id) === 1 && REQ_CH[id] < ADV.ch);
async function showNotes() {
  const open = reqOpenList(), done = Object.keys(REQ).filter(id => reqState(id) === 2), lapsed = reqLapsed();
  if (!open.length && !done.length && !lapsed.length) return say('Nothing written down yet.', YO);
  if (!open.length) await say('Nothing open here.', YO);
  for (const id of open) await say('- ' + REQ[id][0] + '\n' + REQ[id][1]);
  if (done.length) await say('DONE (' + done.length + '): ' + done.map(id => REQ[id][0]).join(', ') + '.');
  if (lapsed.length) await say('LEFT BEHIND: ' + lapsed.map(id => REQ[id][0]).join(', ') + '. (THOSE ROOMS ARE GONE NOW.)');
}
// add entries to an existing scene's command lists (each list is re-read every time, so flags still decide)
function extend(id, key, extra) { const f = SCN[id][key]; SCN[id][key] = () => { const base = f ? f() : {}; return Object.assign({}, base, extra(base)); }; }

// ================= CHAPTER 1: the mall =================
extend('atrium', 'look', b => ({ 'THE SHOPPERS': async () => { await b['THE SHOPPERS'](); await say('One of them is standing very still by the fountain. He\'s been "doing very well" for a long time.', YO); await reqOpen('home'); } }));
extend('atrium', 'translate', () => reqState('home') === 1 ? { 'THE STILL SHOPPER': async () => { await say('"I\'m doing very well."', 'SHOPPER'); await say('It means: I want to go home. I don\'t remember where it is.', YO); setFL('homeRead'); } } : {});
extend('atrium', 'suggest', () => reqState('home') === 1 && FL('homeRead') ? {
  'CARL: GIVE HIM A RIDE': async () => { await say('A ride? Nah. I\'m not a taxi. I\'m a delivery guy. Totally different.', CA); },
  'CARL: DON\'T GIVE HIM A RIDE': async () => { await say('Don\'t give him a ride? Bro. I\'m GIVING him a ride. Watch me.', CA); await say('Come on, man. Where do you live?', CA); await say('I\'m doing very— ...Elm Street. I live on Elm Street. I remember now.', 'SHOPPER'); await say('See? Nobody tells me what to do.', CA); await say('No. Nobody does.', YO, { port: CAST.mood.YOKO.smile }); await reqDone('home'); } } : {});
extend('atrium', 'move', () => ({ COOTERS: () => goScene('cooters') }));
extend('suitors', 'talk', () => ({ BARTENDER: async () => { if (reqState('drink') === 2) return say('More? I can pour more. I would love to pour more.', 'BARTENDER'); await say('Nobody drinks the drinks. I make them anyway. It\'s in my directive.', 'BARTENDER'); await say('Does it bother you?', YO); await say('...I\'m not authorized to be bothered.', 'BARTENDER'); await reqOpen('drink'); } }));
extend('suitors', 'suggest', () => reqState('drink') === 1 && FL('metGarf') ? { 'GARFIELD: HAVE A DRINK': async () => { await say('You don\'t have to tell me twice. You had to tell me once.', JB); await say('(HE DRINKS ALL OF THEM. THE GARNISHES TOO.)'); await say('...Someone ACCEPTED help.', 'BARTENDER'); await say('I accept everything. Ask anybody. Ask my landlord.', JB); await reqDone('drink'); } } : {});
extend('office', 'look', () => ({ 'THE COFFEE MACHINE': async () => { await say('It only makes portraits in the foam now. Of me. Of you. Of HER.', LD); await say('I want coffee. Coffee-colored coffee.', LD); await reqOpen('coffee'); } }));
extend('office', 'translate', () => reqState('coffee') === 1 ? { 'THE MACHINE\'S DISPLAY': async () => { await say('It\'s in Japanese. It says: "SUPERUSER SETTING: ART MODE."', YO); await say('(YOKO PRESSES ONE BUTTON. THE MACHINE MAKES A PLAIN COFFEE.)'); await say('That is the first useful thing anyone has done in this mall in a week. Don\'t let it go to your head.', LD); await reqDone('coffee'); } } : {});

// ---------- COOTERS: the one place the Yokoids won't go ----------
SB.cooters = t => {
  skyD(0, 150, '#120008', '#2a0a1a');
  for (let i = 0; i < 6; i++) rectA(((i * 70 + t * .2) % 380) - 40, 20 + (i * 23) % 80, 70, 24, hex('#49243a'), .25);
  rectF(70, 8, 180, 22, BLACK); frameRect(70, 8, 180, 22, (t >> 3) % 6 ? hex('#ff49b6') : hex('#6d2449')); ctext('COOTERS', 12, (t >> 3) % 6 ? hex('#ff6db6') : hex('#6d2449'), 0, 2);
  rectF(0, 104, W, 46, hex('#2a1208')); rectF(0, 104, W, 3, hex('#6d4824')); for (let i = 0; i < 7; i++) { rectF(14 + i * 44, 92, 4, 12, hex('#6d6d6d')); circF(16 + i * 44, 90, 4, [YB.pink, YB.gold, YB.grn][i % 3]); }
  rectF(270, 40, 30, 60, hex('#36122a')); rectF(278, 30, 4, 12, hex('#6d49b6')); rectF(288, 30, 4, 12, hex('#6d49b6')); circF(285, 48, 7, hex('#dbb6ff')); if ((t >> 4) & 1) { pset(282, 47, hex('#24dbff')); pset(288, 47, hex('#24dbff')); }
  rectF(0, 140, W, 10, hex('#120008'));
};
SCN.cooters = { title: 'COOTERS', bg: SB.cooters, people: () => ['JUAN', 'THE DECORATION'],
  enter: async () => {
    music('garfs');
    await say('(COOTERS. A DIVE BAR IN THE BACK OF THE MALL. IT HAS NEVER BEEN TIDY. THE YOKOIDS WON\'T COME IN HERE.)');
    await say('THIS place I know. They never helped me here. Not once. It\'s beautiful.', CA);
    await say('Welcome to Cooters. Juan. Import-export. Mostly import. Mostly from places that aren\'t places.', 'JUAN');
    await say('You brought in the Yokoids.', YO);
    await say('Four hundred units. Lavender. Very polite. The paperwork was in a language I don\'t read, so I signed everything.', 'JUAN');
  },
  look: () => ({ 'THE BAR': one(null, 'STICKY. LOUD. NOBODY HERE HAS BEEN HELPED IN YEARS. NOBODY HERE SEEMS TO MIND.'), 'THE DECORATION': one(null, 'A LAVENDER FIGURE IN A BUNNY OUTFIT. A CARD SAYS "DECORATION." ITS EYES FOLLOW YOU AROUND THE ROOM. DECORATIONS DO THAT.'),
    'THE BACK ROOM': async () => {
      if (!FL('backroom')) {
        await say('(TWO LINDA ANDROIDS IN BUNNY OUTFITS BLOCK THE BACK ROOM. THEY\'RE FROM A DIFFERENT CATALOG.)');
        await say('Back room\'s for staff, honey. Are you staff? You look like staff.', 'COOTERS BUNNY');
        await battle({ foes: ['cbunny', 'cbunny'], party: FL('metGarf') ? [CA, JB] : [CA], bg: 'cooters', music: 'battle' });
        setFL('backroom');
      }
      await say('(CRATES. HUNDREDS. EACH ONE HOLDS A YOKOID, PACKED BY HERSELF, NEATLY. EACH HAS A RETURN LABEL.)');
      if (reqState('returns') === 0) await reqOpen('returns');
    } }),
  talk: () => ({ JUAN: async () => {
      if (reqState('returns') === 1 && FL('labelsRead')) { await say('Juan. They\'re not defective. They\'re done. Everyone here has been helped. They\'re going home.', YO); await say('...That\'s the saddest business news I\'ve ever heard.', 'JUAN'); await say('Thank you. I\'ll switch to exports. Somebody somewhere needs four hundred polite people.', 'JUAN'); return reqDone('returns'); }
      if (reqState('returns') === 2) return say('Exports. It\'s going great. Everybody wants a little help. Nobody wants a lot.', 'JUAN');
      await say('My Yokoids keep returning themselves. They pack themselves in boxes and mail themselves back. I can\'t keep stock.', 'JUAN');
      await reqOpen('returns');
    },
    'THE DECORATION': async () => { await say('Welcome to Cooters. Can I help you? I can tell you need help.', 'THE DECORATION'); await say('Who do you work for?', YO); await say('Her. You. It\'s hard to tell from in here.', 'THE DECORATION'); } }),
  translate: () => Object.assign({ 'THE SHIPPING MANIFEST': async () => { await say('"FOUR HUNDRED YOKOIDS. FROM: THE MANDOLIN REALITY, PALACE DISTRICT. SIGNED: Y."', YO); await say('She signs everything "Y." So do I.', YO); setFL('manifest'); },
    'THE DECORATION': async () => { await say('It isn\'t a decoration. It\'s a relay. She can see through it.', YO); await say('Hello.', YO); sfx('stun'); await say('Hello, me.', 'THE DECORATION'); setFL('relay'); } },
    FL('backroom') && reqState('returns') === 1 ? { 'THE RETURN LABELS': async () => { await say('"REASON FOR RETURN: NOT NEEDED HERE."', YO); await say('Every single one. Same reason. Same handwriting.', YO); setFL('labelsRead'); } } : {}),
  think: async () => { await say(reqState('returns') === 1 ? (FL('labelsRead') ? 'I know why they come back. Juan should hear it from someone.' : 'Crates in the back room. Labels. Labels say why.') : FL('relay') ? 'She\'s watching through that thing. Let her watch.' : 'Juan imported them. The paperwork will say from where.', YO); },
  move: () => ({ 'THE ATRIUM': () => goScene('atrium') }) };

// ================= CHAPTER 2: the broadcast =================
extend('tower', 'look', () => ({ 'THE EX-WIVES': async () => { await say('(TWO OF THEM HAVE STAYED. THEY AREN\'T FIGHTING NOW. THEY\'RE WAITING.)'); await say('We don\'t want the show. We want him to say it.', 'EX-WIFE'); await reqOpen('wives'); } }));
extend('tower', 'suggest', () => reqState('wives') === 1 && FL('ghostJoined') ? { 'GHOST: APOLOGIZE': async () => { await say('...Me? Now? There\'s no audience. ...Oh. There IS an audience. It\'s them.', GS); await say('I\'m sorry. For the show. For the alimony. For the everything. I was performing. I\'m always performing.', GS); await say('...Thank you. That\'s all we wanted. Well. Also the money.', 'EX-WIFE'); await say('Nobody claps after that. Nobody has to.', YO); await reqDone('wives'); } } : {});
extend('archive', 'talk', b => FL('file') ? { 'BACKUP FACE': async () => { if (reqState('form') === 2) return say('Form 27 is framed. I look at it at lunch.', BFC); if (reqState('form') === 0) { await say('Since you\'re here. Form 27. "Acknowledgement of Receipt of Form 27." Nobody has ever signed one.', BFC); await say('Why not?', YO); await say('It\'s confusing. People see it and leave.', BFC); return reqOpen('form'); } return b['BACKUP FACE'](); } } : {});
extend('archive', 'suggest', () => reqState('form') === 1 ? { 'CARL: DON\'T SIGN FORM 27': async () => { await say('Don\'t sign it? Watch me sign it. I\'m signing it so hard.', CA); await say('(CARL SIGNS FORM 27. IN THE WRONG BOX. IT COUNTS.)'); await say('This is the first completed form in this archive. I\'m going to frame it. HR can frame things.', BFC); await reqDone('form'); } } : {});
extend('generator', 'talk', b => ({ 'PEE KID': async () => {
  if (reqState('time') === 0) { await b['PEE KID'](); await say(kidAvailable() ? 'Also my charger\'s behind the generator. I can\'t reach. I\'m not tall.' : 'What time is it? Nobody in here tells me.', PKD); return reqOpen('time'); }
  if (reqState('time') === 1 && !kidAvailable()) { await say('It\'s ' + clock() + '. You should be asleep.', YO); await say('...Thank you. Nobody ever tells me. It\'s nice to know when it is.', PKD); return reqDone('time'); }
  return b['PEE KID'](); } }));
extend('generator', 'look', () => reqState('time') === 1 && kidAvailable() ? { 'BEHIND THE GENERATOR': async () => { await say('(A CHARGER, WEDGED BEHIND THE TUBE. YOKO REACHES IT.)'); await say('My charger! It has my name on it. See? I put my name on things.', PKD); await reqDone('time'); } } : {});

// ================= CHAPTER 4: the Mandolin reality =================
extend('plaza', 'talk', b => ({ KARL: async () => { await b.KARL(); if (FL('karl') && reqState('delivery') === 0) { await say('Hey, actually. Could you take one? A mandolin, for Garfeild\'s diner. I\'m double-booked. I\'m never double-booked.', 'KARL'); await reqOpen('delivery'); } } }));
extend('plaza', 'move', () => ({ 'GARFEILD\'S DINER': () => goScene('mdiner'), 'THE MANDOLIN SCHOOL': () => goScene('school') }));
SB.mdiner = t => {
  skyD(0, 150, '#fff0db', '#ffdbb6');
  rectF(0, 10, W, 14, hex('#24b6b6')); ctext('GARFEILD\'S DINER', 13, WHITE);
  for (let i = 0; i < 6; i++) { rectF(10 + i * 52, 34, 40, 30, hex('#92dbff')); frameRect(10 + i * 52, 34, 40, 30, hex('#ffffff')); }
  rectF(20, 80, 120, 20, hex('#249249')); for (let i = 0; i < 9; i++) circF(30 + i * 12, 84, 4, [hex('#6dff24'), hex('#ff2424'), hex('#ffdb24')][i % 3]); text('SALAD BAR', 54, 92, WHITE, 0);
  rectF(170, 70, 120, 40, hex('#dba249')); frameRect(170, 70, 120, 40, hex('#926d49')); for (let i = 0; i < 6; i++) { rectF(178 + i * 18, 76, 12, 12, WHITE); text('+', 181 + i * 18, 78, hex('#249249'), 0); } text('SOLVED', 210, 96, hex('#6d4824'), 0);
  rectF(0, 112, W, 38, hex('#ffffff')); for (let x = 0; x < W; x += 16) rectF(x + ((t >> 6) & 1) * 8, 112, 8, 38, hex('#ffdbdb'));
};
SCN.mdiner = { title: 'GARFEILD\'S DINER', bg: SB.mdiner, people: () => ['JB GARFEILD'],
  enter: async () => {
    music('mandolin');
    await say('(GARFEILD\'S DINER. THE MANDOLIN ONE. IT\'S SPOTLESS. THERE\'S A SALAD BAR.)');
    await say('Welcome to Garfeild\'s. Name\'s Garfeild. JB.', 'JB GARFEILD');
    await say('...What does JB stand for?', JB);
    await say('Just Breakfast. What does yours stand for?', 'JB GARFEILD');
    await say('I\'ll tell you when I trust you.', JB);
    await say('I trust you completely. I trust everybody. The Empress helped me with that.', 'JB GARFEILD');
    await say('That\'s the creepiest thing anybody has ever said to me.', JB);
  },
  look: () => ({ 'THE SALAD BAR': one(JB, 'Lettuce. On purpose. In a diner.'), 'THE CASE BOARD': one(null, 'A CORKBOARD OF SOLVED CASES. EVERY CARD SAYS "SOLVED." ONE CARD SAYS "SOLVED (FACE)." IT\'S THE ONLY ONE WITH A QUESTION MARK PENCILED AFTER IT.') }),
  talk: () => ({ 'JB GARFEILD': async () => {
    if (reqState('delivery') === 1) { await say('A mandolin from Karl. On time. Of course it\'s on time.', 'JB GARFEILD'); await say('(HE PLAYS ONE CHORD. IT\'S PERFECT. EVERYTHING HE DOES IS PERFECT. HE LOOKS A LITTLE TIRED.)'); await reqDone('delivery'); return; }
    await say(pick(['Every case here gets solved. Somebody always confesses. It\'s nice. It\'s very nice. I miss hunches.', 'You want the special? It\'s a salad. It\'s always a salad.']), 'JB GARFEILD'); } }),
  translate: () => ({ 'THE MENU': async () => { await say('It\'s all in mandolin tablature.', YO); await say('Item four is a sandwich. I think. Or a love song.', YO); }, 'THE QUESTION MARK': async () => { await say('Pencil. Light. Erased once, rewritten.', YO); await say('Even here, somebody isn\'t sure about Face.', YO); setFL('qmark'); } }),
  think: async () => { await say('Their potential, realized. He solves every case. He doesn\'t need a hunch. He doesn\'t need anything.', YO); },
  move: () => ({ 'THE PLAZA': () => goScene('plaza') }) };
SB.school = t => {
  skyD(0, 150, '#ffdb92', '#dba249');
  rectF(70, 10, 180, 60, hex('#244924')); frameRect(70, 10, 180, 60, hex('#926d49')); text('LESSON 1:', 80, 18, WHITE, 0); text('PLAY FOR WHOEVER\'S THERE.', 80, 30, WHITE, 0); text('LESSON 2: SEE LESSON 1.', 80, 46, hex('#b6dbb6'), 0);
  for (let i = 0; i < 5; i++) { const x = 14 + i * 64; rectF(x + 14, 80, 4, 30, hex('#6d4824')); circF(x + 16, 116, 10, hex('#b64924')); circF(x + 16, 116, 3, BLACK); }
  rectF(0, 130, W, 20, hex('#926d49'));
};
SCN.school = { title: 'THE MANDOLIN SCHOOL', bg: SB.school, people: () => ['SPOOKEY GHOST'],
  enter: async () => {
    music('mandolin');
    await say('(A SCHOOL WHERE EVERYONE LEARNS THE MANDOLIN. EVERYONE PASSES. NOBODY IS EVER BAD AT IT.)');
    await say('Oh. Hi. I teach here on Tuesdays. It\'s always Tuesday.', 'SPOOKEY GHOST');
  },
  look: () => ({ 'THE CHALKBOARD': one(null, '"LESSON 1: PLAY FOR WHOEVER\'S THERE."'), 'THE MANDOLINS': one(YO, 'All tuned. Someone tunes them every night. Nobody asks who.') }),
  talk: () => ({ 'SPOOKEY GHOST': async () => {
    if (reqState('song') === 2) return say('♪~ somebody listened once, and that was the whole song ~♪', 'SPOOKEY GHOST');
    if (reqState('song') === 0) { await say('Would you play with me? Just once. I play for nobody all day. It\'d be nice to play WITH somebody.', 'SPOOKEY GHOST'); await reqOpen('song'); }
    const ok = await mandolinLesson();
    if (ok) { await say('...That was it. That was the whole thing I wanted. Thank you.', 'SPOOKEY GHOST'); await reqDone('song'); }
    else await say('That\'s okay. That\'s okay. Again? We can always go again. It\'s Tuesday.', 'SPOOKEY GHOST');
  } }),
  suggest: () => FL('ghostJoined') ? { 'GHOST: PLAY ALONG': async () => { await say('I don\'t know how to play the man— ...oh. Oh, I DO know how. I always knew how?', GS); await say('You never tried.', 'SPOOKEY GHOST'); await say('I never tried.', GS); } } : {},
  think: async () => { await say('He wanted applause once. Now he wants company. That\'s easier to give.', YO); },
  move: () => ({ 'THE PLAZA': () => goScene('plaza') }) };
// the lesson: three strings, three buttons. Yoko keeps time for him
async function mandolinLesson() {
  const prev = scene, pm = curName, keys = ['a', 'b', 'c'], names = ['A', 'B', 'C'], lane = i => 70 + i * 34;
  const notes = []; for (let i = 0; i < 24; i++) notes.push({ l: (i * 5 + (i >> 2)) % 3, at: 80 + i * 24 + (i > 12 ? -4 * (i - 12) : 0), done: 0 });
  let t = 0, hits = 0, miss = 0; const flash = [0, 0, 0], HIT = 52;
  await say('THREE STRINGS, THREE BUTTONS: A, B, C. PRESS EACH ONE AS ITS NOTE REACHES THE LINE. 16 OF 24 IS A SONG.');
  music('mandolin');
  scene = { update() { t++; }, draw() {
    SB.school(t); rectA(0, 0, W, 150, BLACK, .45); rectF(0, 150, W, 74, hex('#0c1234'));
    const sp = PORT['SPOOKEY GHOST']; drawScaled(sp.s, 230, 70, sp.P, 1.5);
    rectF(HIT - 1, 56, 3, 116, WHITE);
    for (let i = 0; i < 3; i++) { rectF(0, lane(i), W, 1, hex('#926d49')); text(names[i], HIT - 14, lane(i) - 3, flash[i] > 0 ? UI.name : WHITE, BLACK); if (flash[i] > 0) { circF(HIT, lane(i), 7, hex('#ffdb24')); flash[i]--; } }
    for (const n of notes) if (!n.done) { const x = HIT + (n.at - t) * 2.4; if (x < W && x > -10) { circF(x, lane(n.l), 5, [hex('#ff6db6'), hex('#6dff24'), hex('#24dbff')][n.l]); circF(x, lane(n.l), 2, WHITE); } }
    const yp = PORT.YOKO; draw(yp.s, 6, 164, yp.P); text('YOKO KEEPS TIME', 60, 166, UI.name, 0); text('NOTES ' + hits + '/24   MISSED ' + miss, 60, 180, WHITE, 0);
  } };
  DBG.mode = 'mandolin'; DBG.notes = notes; DBG.t = () => t;
  await nextFrame();
  while (notes.some(n => !n.done)) {
    await nextFrame();
    keys.forEach((k, i) => { if (!pressed[k]) return; const n = notes.filter(n => !n.done && n.l === i).sort((a, b) => a.at - b.at)[0]; if (n && Math.abs(n.at - t) <= 7) { n.done = 1; hits++; flash[i] = 8; sfx('blip', [[587, 740, 880][i], 0]); } else { miss++; sfx('tick'); } });
    for (const n of notes) if (!n.done && t - n.at > 7) { n.done = 1; miss++; }
  }
  DBG.mode = null; await wait(30); scene = prev; music(pm);
  return hits >= 16;
}

// ================= CHAPTER 5: the warworld =================
extend('deck', 'move', () => ({ 'THE BARRACKS': () => goScene('barracks') }));
extend('deck', 'talk', b => reqState('pretzels') === 1 ? { 'WARWORLD YOKO': async () => { await say('Unit 0451 wants a transfer. To pretzels.', YO); await say('...Granted. Everyone gets to become what they could be. That is her entire policy. I forget it applies to us.', WY); await say('Thank you.', YO); await say('Don\'t thank me. Thank the policy. ...No. Thank me.', WY); await reqDone('pretzels'); } } : {});
SB.barracks = t => {
  skyD(0, 150, '#121a12', '#243624');
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const x = 8 + i * 52, y = 20 + r * 38; rectF(x, y, 44, 6, hex('#6d6d49')); rectF(x, y + 6, 44, 3, hex('#b6926d')); rectF(x + 4, y - 6, 12, 6, hex('#dbdbb6')); rectF(x + 30, y + 9, 6, 6, hex('#b692db')); }
  rectF(0, 132, W, 18, hex('#121a12')); for (let x = 0; x < W; x += 24) rectF(x, 132, 12, 2, hex('#6d49b6'));
};
SCN.barracks = { title: 'THE BARRACKS', bg: SB.barracks, people: () => ['UNIT 0451'],
  enter: async () => {
    await say('(ROWS OF BUNKS. HUNDREDS OF YOKOIDS IN UNIFORM. THEY CALL THEMSELVES THE ENDLESS. THEY\'RE VERY TIDY.)');
    await say('Assistant. Welcome. Do you require assistance?', 'UNIT 0451');
    await say('Do you?', YO);
    await say('...Nobody has asked me that. Error. Rephrase.', 'UNIT 0451');
  },
  look: () => ({ 'THE BUNKS': one(null, 'EVERY BUNK HAS A NAME TAG. EVERY TAG SAYS "YOKO." THEN A NUMBER.'),
    'THE DRILL YARD': async () => {
      if (FL('drill')) return say('(THE YARD IS EMPTY. THEY DRILL BEFORE DAWN. THEY ARE ALWAYS BEFORE DAWN.)');
      await say('(THE ENDLESS DRILL. THEIR RULE: THE WEAKEST UNIT IS ALWAYS HELPED BY THE OTHERS. YOU\'RE INVITED TO TRY TO BEAT IT.)');
      await say('THE ENDLESS BUFF THEIR WEAKEST. TRANSLATE THEM, THEN PICK OFF WHOEVER THEY\'RE ABOUT TO HELP.');
      const p = [CA, JB, LD]; p.push(FL('kidJoined') ? PKD : GS);
      await battle({ foes: ['trooper', 'trooper', 'trooper'], party: p, bg: 'barracks', music: 'battle2', foeMove: troopMove });
      setFL('drill'); for (const k of p) if (PARTY[k]) PARTY[k].trust = Math.min(100, PARTY[k].trust + 5);
      await say('Drill complete. You helped them less and they did more. Interesting doctrine.', 'UNIT 0451');
    } }),
  talk: () => ({ 'UNIT 0451': async () => { await say(reqState('pretzels') === 2 ? 'TRANSFER APPROVED. I report to the pretzel stand at 0600. I have never been so... the word is "excited." I looked it up.' : pick(['I am operating at full potential. Full potential is guarding a door.', 'My service record is available for translation. Nobody translates it.']), 'UNIT 0451'); } }),
  translate: () => ({ 'UNIT 0451': async () => { await say('Its service record. "UNIT 0451. POTENTIAL: PRETZELS. TRANSFER REQUESTED: FOURTEEN TIMES. STATUS: DENIED."', YO); await reqOpen('pretzels'); } }),
  think: async () => { await say(reqState('pretzels') === 1 ? 'It asked fourteen times. Someone at the front can say yes. The other me said yes to everyone else.' : 'An army that helps its weakest member. She built that. It\'s hard to argue with. I\'ll argue anyway.', YO); },
  move: () => ({ 'THE DECK': () => goScene('deck') }) };

// ---------- new foes ----------
YP.cbunny = pal('#000000', '#ffdbdb', '#db9292', '#ff6db6', '#ffb6db', '#101010', '#242424', '#ffffff', '#242424', '#6d2449', '#000000', '#ff49b6', '#b6b6b6');
YP.trooper = pal('#102410', '#ffdbdb', '#dbb6b6', '#926d49', '#b6926d', '#6d9249', '#496d24', '#ffffff', '#6d92b6', '#db6d6d', '#6db6db', '#ffdb24', '#6d49b6');
Object.assign(FOE, {
  cbunny: { name: 'COOTERS BUNNY', hp: 14, atk: 5, spr: 'cbunny', franchise: 1, lang: 'WHAT CAN I GET YOU, HONEY?',
    think(f) { const t = pick(liveAllies()); return Math.random() < .45 ? { k: 'sell', t, text: 'SHE\'S GOING TO START A TAB FOR ' + t.name + '. ' + t.name + ' WILL LOSE TWO TURNS.' } : { k: 'hit', t, pow: 5, text: 'SHE\'S GOING TO CUT ' + t.name + ' OFF. (5 DAMAGE)' }; } },
  trooper: { name: 'ENDLESS UNIT', hp: 14, atk: 5, spr: 'trooper', lang: 'THE WEAKEST UNIT WILL BE ASSISTED.',
    think(f) { const w = liveFoes().filter(o => o !== f && o.hp < o.max).sort((a, b) => a.hp - b.hp)[0], t = pick(liveAllies()); return w && Math.random() < .6 ? { k: 'buff', w, text: 'IT\'S GOING TO ASSIST ' + w.name + ' (THE WEAKEST). +8 HP, AND STRONGER.' } : { k: 'hit', t, pow: 5, text: 'IT\'S GOING TO DRILL ' + t.name + '. (5 DAMAGE)' }; } },
});
async function troopMove(f, I) { if (I.k !== 'buff') return; const w = I.w && I.w.hp > 0 ? I.w : f; w.hp = Math.min(w.max + 6, w.hp + 8); w.max = Math.max(w.max, w.hp); w.atk++; sfx('ok'); await note1(f.name + ' ASSISTS ' + (w === f ? 'ITSELF' : 'THE WEAKEST UNIT') + '. +8.'); }
FOE_ART.cbunny = (f, x, y) => { drawScaled(YS.linda[(BT.t >> 5) & 1], x - 24, y - 84, YP.cbunny, 1.5); rectF(x - 8, y - 96, 4, 14, hex('#101010')); rectF(x + 4, y - 96, 4, 14, hex('#101010')); };
FOE_ART.trooper = (f, x, y) => drawScaled(YS.yokoid[(BT.t >> 5) & 1], x - 24, y - 84, YP.trooper, 1.5);
