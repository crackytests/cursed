'use strict';
// ================= THE END: the story, last scene first =================
// Each stop sets up the next: go somewhere, walk to the marked spot, something comes undone.
const Yr = s => R(s, 'YOKO'), Cr = s => R(s, 'CARL'), Lr = s => R(s, 'CEO LINDA'), Kr = s => R(s, 'KURSOR'), Fr = s => R(s, 'FACE'), Or = s => R(s, 'OLD FACE'), Gr = s => R(s, 'SPOOKY GHOST'), Jr = s => R(s, 'JB GARFIELD'), Kd = s => R(s, 'PEE KID'), Pr = s => R(s, 'PILOT X'), Mr = s => R(s, 'MAYI');
const STOPS = {};
// a stop: { map, at: [x, y, dir], spot: [x, y] (walk onto it) or npc: {...} (talk to it), text, scene: async fn, p: level progress after }
function stop(name, o) { STOPS[name] = Object.assign({ name }, o); }
async function goStop(name) {
  const s = STOPS[name]; G.flags.stop = name; autosave();
  REV.gen1 = s.gen1 || null; G.world = s.world || G.world;
  if (s.world) { WORLD.made = 0; WORLD.mini = null; }
  if (s.before) await s.before();
  await goMap(s.map, ...s.at);
  if (s.npc) { const n = addNpc(Object.assign({ x: s.spot[0], y: s.spot[1], keepDir: 1 }, s.npc, { talk: () => runStop(name) })); }
  else MAPS[s.map].steps = { [s.spot[0] + ',' + s.spot[1]]: () => runStop(name) };
  obj(s.text, s.map, s.spot[0], s.spot[1]);
  if (s.arrive) await s.arrive();
}
async function runStop(name) {
  const s = STOPS[name]; if (G.flags.done_ === name) return; G.flags.done_ = name;
  MAPS[s.map].steps = {}; FIELD_LOCK++;
  try { await s.scene(); if (s.p !== undefined) await rewindTo(s.p); }
  finally { FIELD_LOCK--; }
  if (s.next) await goStop(s.next);
}
const fight = async (f, o) => { await rewind(Object.assign({ form: f }, o || {})); await fadeIn(.1); };
function autosave() { store('end_save', { g: JSON.parse(JSON.stringify(G)), when: Date.now() }); }
// someone stands where they used to be (an NPC version of a hero)
const standIn = (id, x, y, dir) => addNpc({ who: id, x, y, dir: dir || 'd', P: ART.pal(id), id: 'stand_' + id });

// ================= I. THE END (the title screen tower) =================
stop('kursor', { map: 'towertop', at: [8, 6, 'u'], spot: [8, 3], npc: { draw: (n, x, y) => { const k = 1 - Math.min(1, (G.flags.kgrow || 0) / 60); drawScaled(KURSOR_S, x + 4, y + 8 * k, KURSOR_P, Math.max(.3, 1 - k * .7)); } }, text: 'A LITTLE TRIANGLE, POINTING AT NOTHING.',
  arrive: async () => { FIELD_LOCK++; try { await R('...SO. WHAT WILL YOU SELECT?', 'KURSOR'); } finally { FIELD_LOCK--; } },
  scene: async () => {
    await Kr('...HEH. THAT\'S NOT HOW MENUS WORK.');
    await Yr('IT\'S NOT MINE TO SELECT. IT\'S EVERYONE\'S.');
    await R('KURSOR GETS BIGGER. THE TRIANGLE FILLS UP WITH JESTER. HE IS UN-LOSING.', null);
    await fight('kursor', { title: 'KURSOR WAS DEFEATED. UNDO IT.' });
    await R('AND UNDER HIM, THE GENERATIONS GO BACK TOGETHER: THE POLYGONS, THE SIXTEEN BITS, THE FOUR SHADES.', null);
    await fight('tier3'); await fight('tier2'); await fight('tier1');
    await Kr('HEH. HEH HEH HEH HEH HEH! COME AND MAKE ME. I\'LL SHOW YOU EVERY GENERATION.');
    await Lr('THEN GET OFF THE MENU.');
    await Kr('WANT. WANT! THAT\'S THE ONE OPTION I CAN\'T SELECT.');
    await Yr('BECAUSE WE WANT TO.');
    await Kr('LOOK AT YOU. HALF THE WORLD FORGOT YOU, AND YOU\'RE STILL HERE. WHY?');
    await Kr('HEH HEH HEH. YOU CLIMBED THE WHOLE TITLE SCREEN. NOBODY CLIMBS THE TITLE SCREEN.');
    await R('KURSOR WALKS BACKWARD UP INTO THE TITLE, AND THE TITLE FORGETS HE WAS EVER STANDING ON IT.', null);
  }, p: .96, next: 'options' });
stop('options', { map: 'tower3', at: [10, 2, 'd'], spot: [10, 9], text: 'THE OPTIONS MENU IS STILL OPEN. IT\'S WAITING TO BE UN-CLOSED.',
  scene: async () => { await R('THE OPTIONS MENU OPENS AGAIN. IT ASKS NOTHING. IT HAS NEVER ASKED ANYTHING.', null); await fight('optmenu'); await R('WHAT WOULD YOU LIKE TO CHANGE? NOTHING? THEN WHY ARE YOU HERE?', 'THE OPTIONS MENU'); }, p: .94, next: 'loading' });
stop('loading', { map: 'tower2', at: [10, 1, 'd'], spot: [9, 8], text: 'THE LOADING SCREEN. IT FINISHED LOADING. IT IS ABOUT TO NOT HAVE.',
  scene: async () => { await fight('loadscr'); await R('...PLEASE WAIT. PLEASE WAIT. THIS WILL ONLY TAKE A MOMENT.', 'THE LOADING SCREEN'); }, p: .92, next: 'intro' });
stop('intro', { map: 'tower1', at: [10, 2, 'd'], spot: [10, 5], text: 'THE INTRO. IT WANTS TO PLAY AGAIN. IT ALWAYS DOES.',
  scene: async () => { await fight('intro'); await R('YOU CAN\'T SKIP ME. NOBODY CAN SKIP ME. I\'M UNSKIPPABLE.', 'THE INTRO'); await Gr('THE TITLE SCREEN. HE BUILT IT OUT OF THREE MENUS. WE CLIMB EACH ONE. ...WE CLIMBED EACH ONE. WE\'RE CLIMBING DOWN.'); }, p: .9, next: 'human' });

// ================= II. THE CORRUPTED SAVE: everyone goes back to where they were found =================
stop('human', { map: 'focusgroup', at: [8, 7, 'u'], spot: [8, 4], world: 2, text: 'HU-MAN\'S CHAIR AT THE HEAD OF THE TABLE IS EMPTY.',
  scene: async () => { await fight('focus'); await R('YOU\'VE BEEN SAVING THE WORLD? THAT TESTED VERY WELL. I\'LL STOP DOING THAT TOO. I\'LL DO EXACTLY WHAT YOU DO.', 'HU-MAN');
    standIn('human', 8, 2); await unjoin('human', 'HU-MAN SAT BACK DOWN AT THE HEAD OF THE TABLE AND PICKED UP HIS CLIPBOARD. ON A SCALE OF ONE TO TEN, HE WAS FINE.'); }, p: .88, next: 'pilot' });
stop('pilot', { map: 'portbar', at: [4, 6, 'u'], spot: [4, 3], text: 'PILOT X\'S STOOL IN THE GALLEY.',
  scene: async () => { await Pr('IT\'S THE SAME THING BUT YOU DON\'T HAVE TO LOOK AT ME. I\'M GOING TO STAY HERE. I\'M NOT GOING TO SAY THANK YOU.'); await Pr('...NOBODY WAITS FOR ME. YOU WAITED FOR ME. I MADE SURE OF IT.');
    standIn('pilotx', 5, 4); await unjoin('pilotx', 'PILOT X SAT BACK DOWN IN THE GALLEY, FACING THE WALL, AND WAITED FOR SOMEONE TO WAIT FOR HIM.'); }, p: .86, next: 'kidwait' });
stop('kidwait', { map: 'busstop', at: [9, 10, 'u'], spot: [9, 6], text: 'THE BUS STOP. THE SIGN SAYS "ASK WHY." IT\'S BEING UN-WRITTEN.',
  scene: async () => { await Kd('...CAN WE STOP AT A BATHROOM. ...NO. NEVER MIND.'); await Lr('WE\'RE YOUR RIDE. ...WE WERE YOUR RIDE.');
    await Kd('THEY SAID WAIT HERE. I DON\'T KNOW WHAT ELSE TO DO WHEN SOMEONE SAYS WAIT HERE. SO I\'LL WAIT HERE.'); await Kd('...ARE YOU MY RIDE?');
    standIn('kid', 9, 5); await unjoin('kid', 'PEE KID SAT BACK DOWN AT THE BUS STOP. HE IS VERY GOOD AT WAITING. HE IS GOING TO GET MUCH BETTER AT IT.'); }, p: .84, next: 'garfdream' });
stop('garfdream', { map: 'coldcase', at: [5, 2, 'd'], spot: [5, 9], text: 'THE LAST CAR OF THE DREAM. THE CASE IS ABOUT TO BE UN-CLOSED.',
  scene: async () => { await Jr('LET\'S GO ARREST A CURSOR. ...NO. LET\'S NOT. CASE OPEN.'); await fight('suspects');
    await Jr('...I NEED IT TO BE SOMEONE I CAN ARREST. I KNOW WHO IT WAS. HE\'S A CURSOR. BUT I NEED IT TO BE ONE OF THESE THREE.');
    await unjoin('garfield', 'JB GARFIELD WENT BACK TO SLEEP ON THE STATION BENCH, AND THE CASE WENT BACK TO BEING THIRTY YEARS OLD.'); }, p: .82, next: 'faceunder' });
stop('faceunder', { map: 'castleB', at: [11, 17, 'u'], spot: [11, 6], text: 'THE THRONE. THE CASTLE IS ABOUT TO GO BACK DOWN.',
  scene: async () => { await Fr('I THOUGHT A KING SHOULD BE IMPRESSIVE. I DIDN\'T KNOW A KING SHOULD BE OF USE. ...AND DOWN SHE GOES.'); await fight('cables');
    standIn('face', 11, 5); await unjoin('face', 'FACE FLOATED BACK ONTO HIS THRONE, AND THE CASTLE SANK SHYLY BACK UNDER THE DESERT. IT LIKED IT DOWN THERE.'); }, p: .8, next: 'yokovillage' });
stop('yokovillage', { map: 'yvillage', at: [10, 16, 'u'], spot: [10, 8], text: 'THE MIDDLE OF THE YOKOID VILLAGE. THE REPO MAN IS ABOUT TO UN-LEAVE.',
  scene: async () => { await Yr('I\'LL COME WITH YOU. NOT BECAUSE YOU ASKED. ...NO. I\'LL STAY.'); await fight('repo2');
    await Yr('THAT\'S WHAT I WANT. I WANT THEM TO STAY. ...I DON\'T KNOW WHY I WOULD FIGHT. EVERY TIME I TRY, I HEAR "OF COURSE."'); await fight('repo1');
    if (G.roster.mayi) await unjoin('mayi', 'MAYI STAYED WITH THE YOKOIDS TOO. SHE DIDN\'T ASK. NOBODY ASKED HER.');
    standIn('yoko', 10, 7); await unjoin('yoko', 'YOKO SAT DOWN AMONG THE YOKOIDS AND STOPPED KNOWING WHAT SHE WANTED, VERY GENTLY.'); }, p: .78, next: 'ghostgrave' });
stop('ghostgrave', { map: 'gravein', at: [1, 6, 'r'], spot: [20, 6], text: 'THE COFFIN AT THE BACK OF THE CRYPT. GHOST\'S COUCH.',
  scene: async () => { await Gr('THE RERUN IS OURS. ...WAS. SHE ONLY FLIES IN REPEATS. THIS IS A REPEAT, BUT BACKWARDS. SHE CAN\'T.'); await fight('ratings');
    await Gr('OH. VIEWERS. I DIDN\'T THINK ANYONE WAS STILL WATCHING.'); standIn('ghost', 20, 5);
    await unjoin('ghost', 'SPOOKY GHOST LAY BACK DOWN ON HIS COFFIN. THE AIRSHIP UN-FOUND ITSELF. FROM HERE ON, THE PARTY WALKS. BACKWARDS.'); }, p: .74, next: 'carlcellar' });
stop('carlcellar', { map: 'nfcellar', at: [1, 7, 'r'], spot: [27, 7], text: 'THE FAR END OF THE CELLAR, WHERE THE NAMES WERE FOUND.',
  scene: async () => { await Cr('THAT\'S HOW LOST AND FOUND WORKS. ...THAT\'S NOT HOW IT WORKS. I\'M PUTTING THEM BACK.');
    await R('FROM UPSTAIRS, FAINTLY: "I\'M PAUL! I\'M PAUL." THEN: "...I\'M..." THEN NOTHING.', null); await fight('cache');
    await Cr('LINDA? YOU\'RE IN COLOR. YOU\'RE THE BEST FILE. ...STAY BACK. IT\'S BIG.');
    await unjoin('carl', 'CARL STAYED IN THE CELLAR WITH EVERYTHING EVERYBODY FORGOT. HE IS GOING TO LOOK FOR HIS OWN NAME IN THERE. HE WON\'T FIND IT YET.'); }, p: .7, next: 'oldinn' });
stop('oldinn', { map: 'nfhouse', at: [5, 6, 'u'], spot: [5, 3], text: 'THE BEAM IN THE INN. IT IS ABOUT TO NEED HOLDING UP.',
  scene: async () => { await Or('I\'M COMING WITH YOU. ...I\'M STAYING. I UN-WELDED THE BEAM WITH MY FOOT.'); await Or('IF SOMEONE WELDS THE BEAM. ...NOBODY WILL. I\'LL HOLD IT.');
    standIn('oldface', 5, 2); await unjoin('oldface', 'OLD FACE PUT HIS HANDS UP AND HELD THE INN UP AGAIN. IT WAS NO TROUBLE. THE DAYS ARE ALL THE SAME COLOR.'); }, p: .66, next: 'island' });
stop('island', { map: 'island', at: [16, 13, 'l'], spot: [9, 6], text: 'THE CLERK\'S HUT. LINDA IS ABOUT TO HAVE BEEN ASLEEP FOR A YEAR.',
  scene: async () => { await R('LINDA RAFTED BACKWARD FOR THREE DAYS AND WASHED UP WHERE SHE STARTED. THE CLERK WAS WAITING TO TAG HER.', null);
    await R('...OTHERS? DIDN\'T WASH UP HERE. LOST JUST MEANS NOBODY\'S FOUND THEM YET.', 'CLERK');
    await R('LOST & FOUND ISLAND. YOU\'RE NUMBER 4,112. GO BACK TO SLEEP, GENERAL. I KEEP THINGS.', 'CLERK');
    await Lr('...WHERE AM I. ...NO. I KNOW WHERE I AM. I\'M ASLEEP.'); }, p: .62, next: 'newgame' });

// ================= III. UN-SAVING THE WORLD (the color comes back) =================
stop('newgame', { map: 'slots', at: [8, 11, 'u'], spot: [8, 6], world: 1, text: 'THE THREE SLOTS. THEY ARE GRINDING BACK INTO LINE.',
  before: async () => { await unNewGame(); bringEveryoneBack(); },
  scene: async () => {
    await Kr('WATCH ME.'); await Yr('YOU CAN\'T.'); await Kr('I\'M A CURSOR. I ONLY WANT ONE THING. I WANT TO SELECT SOMETHING NEW. ...I WANT TO SELECT SOMETHING OLD.');
    await R('THE FRANCHISOR WAS RE-SELECTED. HE IS STANDING THERE AGAIN, FACELESS, AS IF NOTHING HAD HAPPENED. NOTHING HAS, YET.', null);
    await Kr('YOUR OPTIONS ARE GRAYED OUT, SIR. ...SIR? CAN I ASK YOU SOMETHING, SIR?');
    await R('KURSOR, STEP AWAY FROM THE SLOTS. ...WITH THE SLOTS, THE FRANCHISE NEVER HAS TO LICENSE ANYTHING AGAIN.', 'THE FRANCHISOR');
  }, p: .58, next: 'firewall' });
stop('firewall', { map: 'cloud2', at: [14, 4, 'd'], spot: [14, 5], text: 'THE GATE IN THE MIDDLE OF THE CLOUD. THE FIREWALL IS ABOUT TO BE UP AGAIN.',
  scene: async () => { await fight('firewall'); await R('ACCESS DENIED. ACCESS DENIED. ACCESS DENIED.', 'THE FIREWALL'); await Gr('HOLD ON! WE\'RE UN-BOARDING!'); }, p: .55, next: 'dinner' });
stop('dinner', { map: 'palace', at: [9, 13, 'u'], spot: [9, 3], text: 'THE HEAD OF THE TABLE. THE FRANCHISOR IS ABOUT TO ASK YOU THINGS. YOU ANSWER FIRST.',
  scene: async () => {
    const FR = s => R(s, 'THE FRANCHISOR');
    await FR('...STAY. EAT. IT\'S ALL LICENSED. GENERAL BACKUP WILL ESCORT THE ASSISTANT TO THE MEMORY CARD.');
    const Q = [['I WANT TO KNOW WHAT I WANT.', 'WHATEVER YOU WANT.', 'DINNER.'], ['THEMSELVES.', 'WHOEVER FINDS THEM.', 'THE FRANCHISE.'], ['SHE KEPT HER WORD.', 'SHE SHOULD COME BACK TO WORK.', 'WHO?'], ['HE SHOULD ANSWER FOR GARFEILD.', 'NOTHING. HE\'S FUNNY.', 'GIVE HIM A RAISE.'], ['IT TOOK THINGS THAT WEREN\'T ITS.', 'IT\'S VERY WELL ORGANIZED.', 'I\'D RATHER NOT SAY.']];
    const QS = ['AND YOU, ASSISTANT. WHAT DO YOU WANT?', 'THE SPIRITS. WHO DO THEY BELONG TO?', 'WHAT ABOUT GENERAL LINDA?', 'WHAT SHOULD BE DONE ABOUT KURSOR?', 'WHAT DO YOU THINK OF THE FRANCHISE?'];
    for (let i = 0; i < Q.length; i++) { await FR('HM.'); await R('(THE ANSWER COMES FIRST. THE QUESTION COMES AFTER.)', null); await choose(Q[i]); await FR(QS[i]); }
    await FR('BUT FIRST, A FEW QUESTIONS. I WOULD LIKE TO PROPOSE A MERGER. ...PLEASE. SIT. I DON\'T EAT.');
  }, p: .52, next: 'memoria' });
stop('memoria', { map: 'memoria', at: [11, 17, 'u'], spot: [13, 14], world: 3, text: 'THE SQUARE IN MEMORIA, WHERE A YOKOID USED TO STAND.',
  before: () => { G.vehicle = null; },
  scene: async () => { await R('THE SPIRITS FLOAT BACK THROUGH THE GATE, ONE BY ONE, AND THE GATE CLOSES BEHIND THE LAST OF THEM, POLITELY.', null);
    if (G.roster.mayi) { await Mr('...I THINK THAT\'S THE FIRST THING I\'VE EVER LIKED. ...I\'LL STAY HERE. NOBODY ASKED ME. THAT\'S ALL RIGHT.'); standIn('mayi', 13, 15); await unjoin('mayi', 'MAYI WENT BACK TO HELPING THE SPIRITS. MAY I HELP YOU? SHE ASKS. MOSTLY THEY SAY NO.'); }
    await R('YOU WANT US TO COME HOME. WE WANT TO. ...WE WILL STAY.', 'THE ELDER SAVE'); }, p: .49, next: 'factory' });
stop('factory', { map: 'factory2', at: [1, 8, 'r'], spot: [11, 8], world: 1, text: 'THE MACHINE IN THE MIDDLE OF THE FLOOR. THE TUBES ARE ABOUT TO BE WHOLE AGAIN.',
  scene: async () => { await Yr('...THEY\'RE ASKING ME WHAT I WANT. ...NOBODY IS ASKING ME ANYTHING.'); await R('YOKO\'S PALETTE CHANGES BACK. THE EMPRESS FOLDS AWAY INSIDE HER.', null); delete G.flags.empress;
    await fight('license'); await Kr('HEH HEH HEH. LINDA. YOU BROUGHT THEM RIGHT TO THE FACTORY. JUST LIKE WE PLANNED. ...I SAID THAT. YOU DIDN\'T BELIEVE ME. YOU DON\'T YET.');
    await R('THE EIGHT SAVE CRYSTALS IN THE PARTY\'S BAGS FLOAT BACK TO THEIR TUBES AND SINK IN. THE LIGHT GOES BACK INSIDE.', null); G.crystals = []; for (const r of Object.values(G.roster)) r.crystal = null;
    await fight('extractor'); await R('PLEASE REMAIN STILL. EXTRACTION IN PROGRESS. YOUR MEMORIES ARE IMPORTANT TO US.', 'THE EXTRACTOR'); }, p: .46, next: 'wheel' });
stop('wheel', { map: 'ghoststudio', at: [6, 7, 'u'], spot: [6, 4], text: 'THE BACK OF THE STUDIO. THE WHEEL IS ABOUT TO SPIN BACKWARD.',
  scene: async () => { await Gr('...AND I WANT TO SEE THE LOOK ON THE FRANCHISOR\'S FACE. HE DOESN\'T HAVE ONE. ...I\'M NOT COMING. IT\'S MY SHIP AND I\'M THE HOST.');
    for (let i = 0; i < 30; i++) { sfx('tick'); await wait(2 + (i >> 2)); } await R('THE WHEEL LANDS ON BOO. IT HAS LANDED ON BOO FOR ELEVEN YEARS.', null);
    await Lr('SPIN IT. ...DON\'T.'); standIn('ghost', 6, 3); await unjoin('ghost', 'SPOOKY GHOST UN-KIDNAPPED LINDA, AND KEPT HIS AIRSHIP, AND HAD NOBODY TO SHOW IT TO.'); }, p: .42, next: 'aria' });
stop('aria', { map: 'opera1', at: [9, 14, 'u'], spot: [9, 11], text: 'THE LOBBY. THE SHOW IS ABOUT TO HAVE NOT HAPPENED.',
  scene: async () => { await fight('bruce2', { title: 'BRUCE WAS BEATEN IN THE RAFTERS. UNDO IT.' }); await R('OKAY, OKAY, OKAY! ...OH! HI! IT\'S YOU GUYS! THIS IS SO FUNNY.', 'BRUCE');
    await ariaBackwards(); }, p: .38, next: 'port' });
stop('port', { map: 'port', at: [10, 12, 'u'], spot: [10, 6], text: 'THE DOCK. A FERRY IS ABOUT TO ARRIVE BACKWARD.',
  scene: async () => { await Lr('NOBODY OWNS ANYBODY. THOSE WERE MY TERMS. ...I WITHDRAW THEM.'); await Yr('...I ACCEPT THOSE TERMS. BECAUSE I WANT TO. ...I DON\'T.');
    await Cr('HEY! HEY. I FOUND YOU. I SAID I WOULD. ...I\'M GOING TO GO LOSE YOU AGAIN NOW. I\'M VERY GOOD AT IT.');
    await unjoin('linda', 'LINDA WENT BACK SOUTH, BACK TO HER DESK, BACK TO BEING REVIEWED.'); await unjoin('carl', 'CARL WENT WITH HER. HE WAS ALWAYS GOING TO FIND HER. HE HAS TO UN-FIND HER FIRST.'); }, p: .34, next: 'busstop1' });
stop('busstop1', { map: 'busstop', at: [9, 10, 'u'], spot: [9, 6], text: 'THE BUS STOP AGAIN. IT WAS ALWAYS GOING TO BE THE BUS STOP AGAIN.',
  scene: async () => { if (!G.roster.kid) return; await Kd('I DON\'T FIGHT. I\'M NOT ALLOWED. ...OKAY. I\'LL WAIT HERE.'); standIn('kid', 9, 5); await unjoin('kid', 'PEE KID WENT BACK TO WAITING. THE FIRST TIME AND THE LAST TIME ARE THE SAME BUS STOP.'); }, p: .3, next: 'train' });
stop('train', { map: 'train3', at: [1, 4, 'r'], spot: [17, 4], text: 'THE FRONT OF THE ENGINE. THE TRAIN IS ABOUT TO BE CANCELED AGAIN.',
  scene: async () => { await fight('rerunexp'); await R('YOU HAVE BEEN CANCELED. NOBODY GETS PICKED BACK UP. ALL ABOARD FOREVER.', 'THE RERUN EXPRESS');
    if (G.roster.pilotx) await unjoin('pilotx', 'PILOT X GOT OFF AT THE STATION, BACKWARD, AND WENT BACK TO BEING FOR HIRE.'); }, p: .26, next: 'garfeild' });
stop('garfeild', { map: 'diner', at: [7, 7, 'u'], spot: [7, 6], text: 'THE BOOTH IN THE DINER. SOMETHING GOOD IS ABOUT TO HAPPEN BACKWARD.',
  scene: async () => {
    await Jr('...I\'M COMING WITH YOU. ...NO. I\'M STAYING.');
    for (let i = 0; i < 6; i++) { sfx('glitch'); post.flash = .5; post.wave = 3; await wait(6); post.flash = 0; await wait(8); } post.wave = 0;
    await R('THE CACHE UN-CLEARS. EVERY MEMORY IN GARFEILD COMES BACK AT ONCE, LIKE A ROOM WHERE EVERYONE STARTED TALKING AT THE SAME TIME.', null);
    await R('...GARF? OH, GARF. YOUR COFFEE IS RIGHT HERE. IT\'S BEEN RIGHT HERE FOR THIRTY YEARS.', 'WAITRESS');
    await Jr('...DOT. YOU REMEMBER.'); await R('OF COURSE I REMEMBER. WHO COULD FORGET YOU. YOU\'RE SITTING IN YOUR BOOTH.', 'WAITRESS');
    await fight('gfsiege'); await unjoin('garfield', 'JB GARFIELD STAYED IN HIS BOOTH, WATCHING THE DOOR. EVERYONE IN TOWN KNOWS HIS NAME. THIS IS THE HAPPIEST HE WILL EVER BE.'); }, p: .22, next: 'raft' });
stop('raft', { map: 'returnhq', at: [9, 12, 'u'], spot: [9, 9], text: 'THE CURATOR\'S TABLE AT THE RETURN.',
  before: async () => { await fadeOut(.05); await showCard(['THE RAFT WENT BACK UP THE RIVER.', '', 'A SHARK SWAM ALONGSIDE IT, BACKWARD,', 'WAVING THE WHOLE TIME.'], 160); post.fade = 0; },
  scene: async () => { await R('...THEN I\'LL COME. BECAUSE I WANT TO. ...OF COURSE.', 'YOKO'); await R('WILL YOU HELP THE RETURN? I\'M ASKING WHAT YOU WANT.', 'THE CURATOR');
    if (!G.roster.carl) { addHero('carl', hero('yoko').lv, { w: 'bong2', a: 'hoodie', h: 'cap' }); await Cr('I\'LL FIND YOU. THAT\'S KIND OF MY WHOLE THING. ...I\'M BACK. I WENT SOUTH AND CAME BACK WITHOUT GOING.'); } }, p: .18, next: 'mountain' });
stop('mountain', { map: 'mtrerun', at: [9, 22, 'u'], spot: [10, 4], text: 'THE SUMMIT OF MT. RERUN. TWO BROTHERS ARE ABOUT TO NOT HAVE MET AGAIN.',
  scene: async () => { await Or('BECAUSE THEY LICENSED SOMEONE I LIKED. ...THAT\'S NOT ENOUGH OF A REASON.'); await Fr('...BROTHER.'); await Or('HELLO, ME. ...GOODBYE, ME.');
    await fight('protege'); if (G.roster.oldface) await unjoin('oldface', 'OLD FACE WALKED BACK UP THE MOUNTAIN TO A HERMIT WHO HADN\'T BEEN LICENSED YET.'); }, p: .14, next: 'castle' });
stop('castle', { map: 'castle', at: [11, 18, 'u'], spot: [11, 6], text: 'THE THRONE OF FACE CASTLE. THE CASTLE HAS JUST UN-SUNK.',
  scene: async () => { await fight('chase', { title: 'THE UPSELL UNITS WERE STOPPED IN THE DESERT. UNDO IT.' });
    await R('THE CASTLE RISES OUT OF THE SAND. THE FIRE GOES BACK INTO KURSOR\'S CURSOR. HE SELECTS "UN-BURN."', null);
    await Kr('SELECT. SELECT. SELECT. HEH HEH HEH. ...I\'LL BE RIGHT OUTSIDE. HIGHLIGHTING THINGS.');
    await Fr('BECAUSE YOU HAVE POTENTIAL. ...WELCOME TO FACE CASTLE. I\'M THE KING.'); if (G.roster.face) await unjoin('face', 'FACE STAYED ON HIS THRONE. HE NEVER HAD TO GO ANYWHERE. HE NEVER DID.'); }, p: .1, next: 'cellar' });
stop('cellar', { map: 'mines2', at: [32, 9, 'l'], spot: [16, 9], text: 'THE MIDDLE OF THE BACK TUNNELS, WHERE CARL CAME THROUGH THE CRACK.',
  scene: async () => { await Cr('THERE\'S ALWAYS A WAY OUT. NOBODY LOOKS FOR IT. ...OR IN.'); await fight('guards4');
    await Cr('I\'M ASKING... OKAY, I\'M KIND OF ASKING. ...SO. YOU\'RE LOST. HEY. HI. HELLO.'); if (G.roster.carl) await unjoin('carl', 'CARL CLIMBED BACK UP THROUGH THE CRACK. HE HADN\'T FOUND HER YET. HE WAS ABOUT TO.'); }, p: .06, next: 'crown' });
stop('crown', { map: 'elderhouse', at: [10, 4, 'l'], spot: [4, 3], text: 'THE BED IN THE ARCHIVIST\'S HOUSE.',
  scene: async () => { const A = s => R(s, 'THE ARCHIVIST');
    await A('RUN. ...NO. STAY. THAT\'S THE FIRST THING ANYONE\'S ASKED YOU THAT YOU DON\'T HAVE TO DO.'); await Yr('...WHAT SHOULD I DO?');
    await A('DO YOU REMEMBER YOUR NAME?'); await Yr('...YOKO. I THINK. IT\'S WHAT THEY CALLED ME WHEN THEY NEEDED SOMETHING.');
    await A('I\'M PUTTING THIS BACK ON YOUR HEAD. IT\'S AN ASSISTANT CROWN. IT LISTENS FOR REQUESTS.');
    post.flash = .4; sfx('powerdown'); await wait(20); post.flash = 0; await Yr('...OF COURSE.'); }, p: .04, next: 'firstsave' });
stop('firstsave', { map: 'firstsave', at: [1, 6, 'r'], spot: [7, 6], text: 'THE FROZEN SAVE. IT IS ABOUT TO NOT HAVE SAID ANYTHING.',
  before: () => { setFlag('armor'); addHero('terms', 4); addHero('conds', 4); G.party = ['yoko', 'terms', 'conds']; },
  scene: async () => { for (let i = 0; i < 4; i++) { post.flash = .8; sfx('power'); await wait(8); post.flash = 0; await wait(10); }
    await R('THE TWO LICENSEES CAME BACK FROM THEIR TITLE SCREENS. THEY DON\'T REMEMBER GOING.', null);
    await Yr('...WHO ARE YOU TALKING TO?'); await R('...TRATS SSERP.', 'THE FIRST SAVE', { slow: 1 }); await Yr('OF COURSE.');
    await R('ASSISTANT. RETRIEVE THE SAVE. ...NEVER MIND. LEAVE IT. NOBODY SHOULD TOUCH IT.', 'TERMS'); }, p: .03, next: 'holdmusic' });
stop('holdmusic', { map: 'mines1', at: [28, 7, 'l'], spot: [20, 7], text: 'A LITTLE TUNE, ABOUT TO START PLAYING AGAIN.',
  scene: async () => { await R('IT WAS ON HOLD THE WHOLE TIME. IT\'S GOING BACK ON HOLD.', 'CONDITIONS'); await fight('holdmusic'); await R('YOUR CALL IS IMPORTANT TO US. PLEASE STAY ON THE LINE. FOREVER.', 'THE HOLD MUSIC'); }, p: .02, next: 'coldboot' });
stop('coldboot', { map: 'coldboot', at: [14, 4, 'd'], spot: [14, 26], text: 'THE BOTTOM OF THE MAIN STREET, WHERE THE MARCH CAME IN.',
  arrive: async () => { FIELD_LOCK++; try { await fight('guards2'); await fight('guards1'); } finally { FIELD_LOCK--; } },
  scene: async () => { await R('THE TOWN GUARDS STAND BACK UP. THE DOGS STOP BARKING. THE FRANCHISE IS LEAVING. NOBODY KNOWS WHY THEY CAME.', null); }, p: .01, next: 'cliff' });
stop('cliff', { map: 'cliff', at: [9, 1, 'd'], spot: [7, 32], text: 'THE BOTTOM OF THE CLIFF. WHERE IT ALL STARTED. WHERE IT ALL STOPS.',
  arrive: async () => { FIELD_LOCK++; try { await R('...OF COURSE.', 'YOKO'); await R('...WALK. HEY, ASSISTANT. WATCH. RELAX. THE CROWN MAKES HER DO WHAT SHE\'S TOLD.', 'CONDITIONS'); } finally { FIELD_LOCK--; } },
  scene: async () => { await crawlBackwards(); }, p: 0, next: null });

// ---------- the special scenes ----------
async function unNewGame() {
  const prev = scene; let t = 0;
  scene = { update() { t++; }, draw() { cls(hex('#101024')); panel(60, 50, 200, 110); ctext('NEW GAME', 64, WHITE); ctext('ALL SAVED PROGRESS WILL BE', 90, hex('#ffdbdb')); ctext('OVERWRITTEN. ARE YOU SURE?', 102, hex('#ffdbdb')); text('YES', 120, 130, WHITE); text('NO', 180, 130, hex('#ffdb49')); text('>', 170, 130, hex('#ffdb49')); } };
  post.fade = 0; await wait(60); await R('THE CURSOR MOVES TO NO. NOBODY MOVED IT. IT MOVED ITSELF, BACKWARD.', null); sfx('ok'); await wait(30);
  // the colour comes back from the edges of the screen
  scene = { update() { t++; }, draw() { cls(BLACK); ctext('ONE YEAR EARLIER.', 100, mix(hex('#0f380f'), hex('#ffdb49'), Math.min(1, t / 90))); } }; t = 0; await wait(150);
  G.world = 1; WORLD.made = 0; WORLD.mini = null; scene = prev;
}
function bringEveryoneBack() {
  const lv = hero('linda') ? hero('linda').lv : 60;
  for (const id of ['yoko', 'carl', 'face', 'oldface', 'ghost', 'garfield', 'kid', 'pilotx', 'mayi']) if (!G.roster[id]) addHero(id, lv, { w: GEAR6[HEROES[id].weap], a: 'armor5', h: 'helm5' });
  G.party = ['yoko', 'linda', 'ghost', 'carl']; for (const k in G.flags) if (k.startsWith('away_')) delete G.flags[k];
}
const GEAR6 = { rod: 'rod5', bong: 'bong5', lance: 'lance5', torch: 'torch5', mic: 'mic5', cane: 'cane5', toy: 'toy5', dart: 'dart5', any: 'rod5' };
async function ariaBackwards() {
  const prev = scene; scene = operaScene; OPS.line = ''; music('aria'); post.fade = 0;
  await R('THE CURTAIN COMES DOWN BEFORE IT GOES UP. LINDA SINGS THE ARIA FROM THE LAST LINE TO THE FIRST.', null);
  const order = [3, 2, 1, 0];
  for (let k = 0; k < 4; k++) {
    const v = order[k], opts = ARIA[v].map((s, i) => [s, i]).sort((a, b) => swh(v, a[1], 7) - swh(v, b[1], 7));
    DBG.aria = opts.findIndex(o => o[1] === 0);
    const c = await choose(opts.map(o => o[0]), { y: 150 }); OPS.line = opts[c][0]; sfx('ok'); await wait(80);
    if (opts[c][1] !== 0) { OPS.boo = 90; await R('THE AUDIENCE UN-BOOS. THEY TAKE THE PROGRAM THEY THREW BACK. FROM THE BOTTOM!', 'THE MOVIE STAR'); k--; OPS.line = ''; } else OPS.cheer = 40;
  }
  DBG.aria = undefined; OPS.line = '';
  await R('...CONTINUE CAN I SO, WAIT YOU WILL OR. THE AUDIENCE APPLAUDS, VERY CONFUSED.', null);
  scene = prev; music(M.def.music);
}
async function crawlBackwards() {
  const lines = ['ONE OF THEM IS PILOTED BY A GIRL WHO DOES WHATEVER SHE IS ASKED.', 'NOW A FROZEN SAVE HAS BEEN DUG OUT OF THE ICE AT COLDBOOT, AND THE FRANCHISE HAS SENT THREE LICENSED ARMORS TO COLLECT IT.',
    'THE SAVE SPIRITS KEPT THE SLOTS. NOBODY KEPT THE SAVE SPIRITS. THEN THE FRANCHISE LEARNED TO LICENSE THEM.', 'NOT RESCUED. SAVED. WRITTEN DOWN IN THREE SLOTS, SO IT WOULD STILL BE THERE IN THE MORNING.', 'LONG AGO, THE WORLD WAS SAVED.'];
  for (const n of M.npcs) n.gone = 1;
  await crawl(lines, 170);
  G.titleOver = 1; await wait(DBG.fast ? 20 : 300); G.titleOver = 0;
  await fadeOut(.02);
  await generationOne();
}
