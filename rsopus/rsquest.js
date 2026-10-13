'use strict';
// ================= ROMANCING STREAM: quests, guilds, and the legends of the cartridges =================
// the world is made of small jobs. some expire. some fight each other. some only exist for one hero.
// a quest: { id, name, town, giver, kind: kill|fetch|boss|visit|gold|ship, need, pay, give, title, hero, not, expire, guild, offer, lines: [offer..., done...] }
// state: GS.quests[id] = { s: 1 active | 2 done | 3 missed, n: kill count }
const QUESTS = [
  // ---- LOT 9 ----
  { id: 'fixship', name: 'A SHIP IN A PARKING LOT', town: 'lot', giver: 'THE DRIVER', kind: 'ship', cost: 150, hero: '!carl', need: () => (GS.bag.PICKAXE || 0) >= 1 && GS.gold >= 150, take: () => { bagAdd('PICKAXE', -1); GS.gold -= 150; }, pay: 0, title: 'CREW', lines: ['THE A.S.S. IS CARL\'S SHIP. IT HAS NOT FLOWED SINCE THE HUM STARTED.', 'BRING A PICKAXE FOR THE INTAKE AND 150 GOLD FOR THE PARTS. I WILL GET HER FLOATING.', 'THEN THE WATER ROUTES ARE FREE. ALL OF THEM. FOREVER.'], done: ['SHE FLOWS. WELCOME ABOARD, CREW.', 'THE A.S.S. SAILS FREE NOW. ANY PORT. NO FARE.'] },
  { id: 'spamdetail', name: 'SPAM DETAIL', town: 'lot', giver: 'THE DRIVER', kind: 'kill', fam: 'blob', n: 5, pay: 150, give: ['TONIC'], lines: ['THE SPAM GETS INTO EVERYTHING. THE SHIP. THE LOT. MY DREAMS.', 'CLEAR FIVE OF THEM AND PROP PILLS PAYS. IN PRODUCT, PARTLY.'] },
  { id: 'thehum', name: 'THE HUM', town: 'lot', giver: 'A NEIGHBOR', kind: 'visit', at: 'generator', pay: 100, lines: ['NOBODY SLEEPS. THE HUM COMES UP THROUGH THE DIRT.', 'SOMEBODY SHOULD GO STAND INSIDE IT AND SEE WHAT IT IS. NOT ME.'] },
  // ---- MALL ----
  { id: 'lids', name: 'A LID FOR EVERY POT', town: 'mall', giver: 'PRETZEL CART KID', kind: 'fetch', item: 'POT LID', n: 1, pay: 130, lines: ['HEALTH CODE SAYS EVERY POT NEEDS A LID. THE DEPTHS TOOK OURS.', 'BRING A POT LID AND I WILL SAY YOU WERE A SUBCONTRACTOR.'] },
  { id: 'freezerjob', name: 'THE COLD INVENTORY', town: 'mall', giver: 'MALL COP', kind: 'visit', at: 'freezer', pay: 160, lines: ['THE FREEZER INVENTORY STOPPED REPORTING. SAME AS THE FOOD COURT.', 'GO COUNT WHAT IS DOWN THERE. DO NOT COUNT IT TWICE.'] },
  { id: 'escrators', name: 'ESCALATOR RATS', town: 'mall', giver: 'MALL COP', kind: 'kill', fam: 'rat', n: 4, pay: 200, lines: ['THE RATS RIDE THE ESCALATORS ALL DAY. FREE RIDERS.', 'FOUR OF THEM, GONE. THAT IS THE QUOTA.'] },
  { id: 'pyrejob', name: 'SMOKE GETS IN YOUR EYES', town: 'mall', giver: 'MALL COP', kind: 'boss', at: 'serverpyre', pay: 500, give: ['WHITE GLOVES'], lines: ['THE OLD SERVERS BEHIND THE MALL CAUGHT FIRE AND KEPT WORKING.', 'PUT THEM OUT. WHATEVER PUTTING OUT MEANS FOR A FIRE THAT LIKES ITS JOB.'] },
  // ---- LOUNGE ----
  { id: 'onemic', name: 'ONE GOOD MIC', town: 'lounge', giver: 'THE SOUND GUY', kind: 'fetch', item: 'SHURE', n: 1, pay: 220, give: ['CONDENSER'], lines: ['THE HOUSE MIC PICKS UP THE OTHER SIDE.', 'BRING A SHURE AND THURSDAY SOUNDS LIKE THURSDAY.'] },
  { id: 'ghostmail', name: 'PAPERS FROM ANOTHER TOWN', town: 'lounge', giver: 'THE MEDIUM', kind: 'visit', at: 'courts', pay: 120, lines: ['THE COURT SENDS ITS NOTICES TO THE WRONG TOWNS ON PURPOSE.', 'TAKE THIS ONE BACK TO THE ALIMONY COURTS. IT IS ADDRESSED TO A GHOST. HE IS OUT.'] },
  { id: 'wispstrike', name: 'THE WISP STRIKE', town: 'lounge', giver: 'THE MEDIUM', kind: 'kill', fam: 'wisp', n: 3, pay: 180, lines: ['THE COLLECTORS DOWNED PENS. THEY STILL COLLECT, BUT SLOWER, AND SADDER.', 'THREE OF THEM. FOR THE ECONOMY.'] },
  { id: 'rookjob', name: 'THE PHONE NUMBER', town: 'lounge', giver: 'THE SOUND GUY', kind: 'boss', at: 'rookery', pay: 380, give: ['SKATEBOARD'], expire: g => g.br >= 26, lines: ['PIGEONS TOOK THE ROOKERY AND STARTED ANSWERING THE REQUEST LINE.', 'THEY ONLY PLAY REQUESTS FOR BREAD. DEAL WITH THE BIG ONE BEFORE THE BIRDS UNIONIZE FURTHER.'] },
  // ---- STUDIO ----
  { id: 'dust', name: 'ARCHIVE DUST', town: 'studio', giver: 'THE INTERN', kind: 'fetch', item: 'GUM', n: 3, pay: 100, lines: ['THE ARCHIVE DUST GETS IN EVERYTHING. THE GUM KEEPS IT OUT OF MY TEETH.', 'THREE PACKS. I AM NOT PROUD.'] },
  { id: 'botswarm', name: 'NICE COMMENTS', town: 'studio', giver: 'NEW FACE', kind: 'kill', fam: 'bot', n: 5, pay: 220, hero: '!face', lines: ['THE BOTS LEAVE NICE COMMENTS. NOBODY LEAVES NICE COMMENTS.', 'FIVE OF THEM. IT IS CONTENT.'] },
  { id: 'resume', name: 'THE RESUME', town: 'studio', giver: 'THE INTERN', kind: 'visit', at: 'archive', pay: 130, lines: ['I PUT MY RESUME IN THE ARCHIVE. IT GOT RESTORED TO AN OLDER VERSION.', 'GO LOOK AT IT. TELL ME WHAT I USED TO BE.'] },
  // ---- MANDOLIN ----
  { id: 'empressring', name: 'A RING FOR THE EMPRESS', town: 'mandolin', giver: 'THE BAKER', kind: 'fetch', item: 'MOOD RING', n: 1, pay: 250, lines: ['THE EMPRESS GAVE EVERYONE A TRADE. MY OVEN NEEDS A MOOD RING TO KNOW IF THE BREAD IS SAD.', 'IT IS USUALLY SAD. BRING THE RING ANYWAY.'] },
  { id: 'spellcheck', name: 'SPELL CHECK', town: 'mandolin', giver: 'THE EMPRESS', kind: 'visit', at: 'mirror', pay: 140, lines: ['THE GARDEN MIRRORS SPELL MY NAME BACKWARDS. THE DOCUMENTS SPELL IT SIDEWAYS.', 'GO STAND IN FRONT OF ONE. REPORT THE SPELLING.'] },
  { id: 'luthier', name: 'THE LUTHIER', town: 'mandolin', giver: 'THE LUTHIER', kind: 'fetch', item: 'MANDOLIN NECK', n: 1, pay: 160, lines: ['A NECK WALKED OUT OF THE SHOP LAST TUESDAY. IN A MANNER OF SPEAKING.', 'BRING ME ONE. ANY ONE. THEY ARE ALL THE SAME NECK.'] },
  // ---- LASAGNA ----
  { id: 'ninepeople', name: 'NINE PEOPLE, ONE LAYER', town: 'lasagna', giver: 'THE STOOLIE', kind: 'boss', at: 'works', pay: 400, give: ['CLASS RING'], hero: '!garf', lines: ['NINE WENT INTO THE WORKS. THE WORKS SAYS THEY ARE ON A LAYER.', 'A LAYER. BRING ME SOMEBODY WHO CAN SAY THAT TO A DETECTIVE.'] },
  { id: 'dryfeet', name: 'DRY FEET', town: 'lasagna', giver: 'A WOMAN AT THE BAR', kind: 'fetch', item: 'SNEAKERS', n: 1, pay: 140, lines: ['IT RAINS HERE. IT RAINED BEFORE THE CITY. IT WILL RAIN AFTER.', 'I WANT DRY FEET. THIS IS THE WHOLE JOB.'] },
  { id: 'worksrats', name: 'PAYROLL', town: 'lasagna', giver: 'THE STOOLIE', kind: 'kill', fam: 'rat', n: 5, pay: 200, lines: ['THE WORKS PAYS ITS RATS. I HAVE SEEN THE ENVELOPES.', 'FIVE ENVELOPES, COLLECTED.'] },
  // ---- PUDDLE ----
  { id: 'frog', name: 'THE FROG ATE IT', town: 'puddle', giver: 'A KID', kind: 'fetch', item: 'GUM', n: 2, pay: 120, lines: ['THE PUDDLE FROG ATE MY GUM. THEN IT BUBBLED. IT WAS SO COOL.', 'GET MORE GUM. FOR THE FROG. NOT FOR ME.'] },
  { id: 'speakerjob', name: 'DO NOT ANSWER', town: 'puddle', giver: 'A PARENT', kind: 'visit', at: 'apt4', pay: 150, lines: ['THE SPEAKER IN APARTMENT 4 TALKS IN YOUR OWN VOICE.', 'GO LISTEN. COME BACK AND TELL ME IT WAS NOT ME.'] },
  { id: 'sponsor', name: 'POTENTIAL SPONSOR', town: 'puddle', giver: 'A COACH', kind: 'kill', fam: 'blob', n: 4, pay: 160, hero: 'peekid', lines: ['KID. YOU HAVE SO MUCH POTENTIAL. THE SPAM WANTS IT.', 'CLEAR FOUR. FOR THE TEAM. FOR THE SPONSOR. MOSTLY THE SPONSOR.'] },
  { id: 'gullwash', name: 'GULL WASH', town: 'puddle', giver: 'A LIFEGUARD', kind: 'kill', fam: 'gull', n: 4, pay: 160, lines: ['THE GULLS TAKE SANDWICHES MID-AIR. IT IS IMPRESSIVE AND UNEMPLOYABLE.', 'FOUR OF THEM. NO SANDWICH FOR YOU.'] },
  // ---- GATE ----
  { id: 'dronerun', name: 'THE PATROL', town: 'gate', giver: 'A MECHANIC', kind: 'kill', fam: 'drone', n: 4, pay: 200, lines: ['THE GATE DRONES FLY SORTIES OVER THE COAST. THE SORTIES ARE LOUD.', 'FOUR DRONES. THE COAST WILL BE QUIET, BRIEFLY.'] },
  { id: 'bladewall', name: 'A BLADE FOR THE WALL', town: 'gate', giver: 'THE MECHANIC', kind: 'fetch', item: 'LONGSWORD', n: 1, pay: 200, lines: ['THE MESS HALL HAS A WALL OF BLADES FROM EVERY WAR THE EMPIRE LOST.', 'ONE MORE. MAKE IT A LONGSWORD. WE HAVE PRIDE.'] },
  { id: 'spirescout', name: 'WHAT THE SPIRE SAYS', town: 'gate', giver: 'PILOT X', kind: 'visit', at: 'gatespire', pay: 260, expire: g => g.br >= 40, lines: ['THE SPIRE WHISPERS COORDINATES AT NIGHT. THE GATE MEN WRITE THEM DOWN.', 'I WANT SOMEBODY TO HEAR IT WHO IS NOT A GATE MAN.'] },
  // ---- REWIND ----
  { id: 'bekind', name: 'PLEASE REWIND', town: 'rewind', giver: 'TAPEHEAD', kind: 'fetch', item: 'COFFEE', n: 2, pay: 160, lines: ['LATE NIGHTS AT THE VAULTS. THE BE KIND REWIND STICKERS PEEL.', 'TWO COFFEES. THE GOOD KIND. THE BAD KIND IS ALL THERE IS.'] },
  { id: 'tapeworms', name: 'TAPEWORMS', town: 'rewind', giver: 'TAPEHEAD', kind: 'kill', fam: 'tapebug', n: 4, pay: 220, lines: ['THE MITES EAT THE EPISODES. THEY EAT THE GOOD PARTS FIRST.', 'FOUR OF THEM. THE GOOD PARTS STAY.'] },
  { id: 'latefreejob', name: 'THE LATE FEE', town: 'rewind', giver: 'TAPEHEAD', kind: 'boss', at: 'vaults', pay: 500, give: ['FOUND RECEIPT'], lines: ['THE VAULTS KEEP EVERY EPISODE EVER AIRED. THE FEE KEEPS THE VAULTS.', 'IT HAS BEEN ACCRUING SINCE 1998. COLLECT IT.'] },
  // ---- LIVEHOUSE ----
  { id: 'opennight', name: 'OPEN MIC, OPEN ROAD', town: 'livehouse', giver: 'THE BUSKER', kind: 'fetch', item: 'LONG BOW', n: 1, pay: 220, lines: ['THE OPEN MIC NEEDS AN OPENER WITH RANGE.', 'BRING A LONG BOW. WE WILL CALL IT A HARP. NOBODY WILL KNOW.'] },
  { id: 'feedbackjob', name: 'FEEDBACK', town: 'livehouse', giver: 'THE BUSKER', kind: 'kill', fam: 'echo', n: 4, pay: 220, lines: ['THE HALLS SING BACK ONE BEAT LATE. IT RUINS THE TIMING.', 'FOUR ECHOES. SING THEM OFF A CLIFF.'] },
  { id: 'chorusjob', name: 'SING ALONG', town: 'livehouse', giver: 'THE BUSKER', kind: 'boss', at: 'chorus', pay: 480, give: ['SPEED LACES'], lines: ['THE CHORUS LEARNED THE SAD SONG. NOW IT SINGS IT TO EVERYBODY.', 'SOMEBODY HAS TO STOP THE ENCORE.'] },
  // ---- BRINEPORT ----
  { id: 'picklecount', name: 'THE BRINE LEDGER', town: 'brineport', giver: 'THE HARBORMASTER', kind: 'kill', fam: 'pickle', n: 4, pay: 220, lines: ['THE CELLARS OVERSHIPPED PICKLES. THE PICKLES WALKED.', 'FOUR JARS OFF THE LEDGER.'] },
  { id: 'motherjob', name: 'THE CELLARS', town: 'brineport', giver: 'THE HARBORMASTER', kind: 'boss', at: 'pickle', pay: 460, give: ['SAILOR KNOT'], lines: ['MOTHER PICKLE KEEPS THE CELLARS. SHE KEEPS THEM TOO WELL.', 'THE PORT NEEDS ITS BASEMENT BACK.'] },
  { id: 'trenchmap', name: 'THE TRENCH MAP', town: 'brineport', giver: 'THE DECKHAND', kind: 'visit', at: 'trench', pay: 300, lines: ['THE TRENCH HAS A GARDEN OF WRECKS. THE MAP STOPS AT THE EDGE.', 'GO PAST THE EDGE. THE MAP WILL CATCH UP.'] },
  // ---- LOST & FOUND (the fixers' guild) ----
  { id: 'leftsock', name: 'THE LEFT SOCK', town: 'found', giver: 'THE FINDER', kind: 'boss', at: 'dryer', pay: 300, guild: 1, not: 'dryclean', give: ['LEFT SOCK'], lines: ['THE DRYER DEPTHS ATE A LEFT SOCK. THE OWNER HAS BEEN BACK ELEVEN TIMES.', 'BRING THE SOCK. OR BRING PEACE. PEACE IS ALSO SOCKS.'] },
  { id: 'dryclean', name: 'DRY CLEANING', town: 'found', giver: 'THE FINDER', kind: 'kill', fam: 'sock', n: 4, pay: 240, guild: 1, not: 'leftsock', lines: ['THE LAUNDROMAT GUILD SAYS THE SOCK WRATHS STARTED IT.', 'THE LAUNDROMAT GUILD PAYS BETTER. FOUR WRATHS.'] },
  { id: 'foundryjob', name: 'EVERYTHING LOST', town: 'found', giver: 'THE FINDER', kind: 'boss', at: 'foundry', pay: 520, guild: 1, give: ['THE OTHER CROWN'], lines: ['THE FOUNDRY FILES EVERYTHING LOST. INCLUDING PEOPLE WHO WENT LOOKING.', 'FILE A COMPLAINT. IN PERSON.'] },
  { id: 'filing', name: 'THE FILING QUEUE', town: 'found', giver: 'THE FINDER', kind: 'kill', fam: 'folder', n: 5, pay: 240, guild: 1, lines: ['THE FOLDERS FILE THEMSELVES NOW. IT IS A WHOLE MOVEMENT.', 'FIVE FOLDERS, UNFILED. PERMANENTLY.'] },
  { id: 'whitelist', name: 'THE WHITELIST', town: 'found', giver: 'THE REGISTRAR', kind: 'gold', cost: 500, pay: 0, title: 'CERTIFIED', lines: ['ANYBODY CAN BE CERTIFIED. IT COSTS 500 GOLD AND ONE AFTERNOON.', 'THE AFTERNOON IS WAIVED. THE GOLD IS NOT.'] },
  { id: 'foundrymap', name: 'WHAT THE NEIGHBORS KEEP', town: 'found', giver: 'THE FINDER', kind: 'visit', at: 'archive', pay: 130, lines: ['THE ARCHIVE KEEPS TAPE. WE KEEP OBJECTS. THEY KEEP STEALING OUR THUNDER.', 'GO LOOK AT THEIR THUNDER.'] },
  // ---- GATE CITY ----
  { id: 'empirepass', name: 'EMPIRE PAPERWORK', town: 'gatecity', giver: 'GATE CENTURION', kind: 'fetch', item: 'PROP HELMET', n: 1, pay: 250, lines: ['THE EMPIRE RUNS ON FORMS. THE FORMS RUN ON HELMETS.', 'ONE PROP HELMET, IN TRIPLICATE. THE HELMET IS THE TRIPLICATE.'] },
  { id: 'spirejob', name: 'THE SPIRE WHISPERS', town: 'gatecity', giver: 'GATE CENTURION', kind: 'boss', at: 'gatespire', pay: 550, give: ['THE CROWN'], lines: ['THE SPIRE GAVE US THE GATE. NOW IT GIVES US COORDINATES. WE DID NOT ASK.', 'SHUT THE WHISPER. THE EMPIRE HAS ENOUGH OPINIONS.'] },
  // ---- ALIMONY COURTS ----
  { id: 'fileintime', name: 'FILE IN TIME', town: 'courts', giver: 'A CLERK', kind: 'fetch', item: 'HAND MIRROR', n: 1, pay: 150, lines: ['THE COURT SEEKS A MIRROR FOR WITNESS LINEUPS. EVERY WITNESS IS A GHOST.', 'THEY ALL LOOK LIKE THE DEFENDANT. IT IS THE LIGHT.'] },
  { id: 'appeal', name: 'THE APPEAL', town: 'courts', giver: 'THE BAILIFF', kind: 'boss', at: 'court88', pay: 450, hero: '!ghost', give: ['MIRROR SHARD'], lines: ['ROOM 88 HAS BEEN IN SESSION SINCE THE FOUNDING. THE DOCKET IS ONE NAME.', 'APPEAL IT. THE CLERK IS BEGGING.'] },
  { id: 'contempt', name: 'CONTEMPT OF COURT', town: 'courts', giver: 'THE BAILIFF', kind: 'kill', fam: 'wisp', n: 3, pay: 180, lines: ['THE STRIKING COLLECTORS PICKET THE STEPS. THEY STILL SERVE PAPERS, BUT SLOWLY, AND IN RHYME.', 'THREE PAPERS, UNSERVED.'] },
  // ---- DESERT BUS DEPOT ----
  { id: 'buscharity', name: 'THE CHARITY KEEPS THE ROAD', town: 'depot', giver: 'THE DISPATCHER', kind: 'gold', cost: 200, pay: 0, title: 'ROADIE', give: ['BUS PASS'], lines: ['THE ROAD IS FREE. THE GAS IS NOT. THE CHARITY IS USUALLY SOMEBODY.', 'TWO HUNDRED GOLD KEEPS ANOTHER MILE PAINTED.'] },
  { id: 'endlesshours', name: 'ENDLESS HOURS', town: 'depot', giver: 'THE DISPATCHER', kind: 'visit', at: 'endlessroad', pay: 260, lines: ['DRIVERS DO FOUR HOUR SHIFTS. THE ROAD DOES NOT DO SHIFTS.', 'DRIVE UNTIL YOU UNDERSTAND. COME BACK. OR DO NOT.'] },
  { id: 'busjob', name: 'THE SCHEDULE', town: 'depot', giver: 'THE DISPATCHER', kind: 'boss', at: 'endlessroad', pay: 500, give: ['MOON BOOTS'], lines: ['THE FIRST BUS NEVER ARRIVED. IT IS STILL ON SCHEDULE. IT SAYS SO.', 'RETIRE THE BUS. IT HAS EARNED THE MILE.'] },
  // ---- the curse's own country ----
  { id: 'trenchjob', name: 'THE GARDEN OF WRECKS', town: 'brineport', giver: 'THE DECKHAND', kind: 'boss', at: 'trench', pay: 520, give: ['COOKIE SHEET'], lines: ['SARGASSO KEEPS THE WRECKS GARDENED. TRIMMED. LABELLED.', 'IT WANTS ONE MORE WRECK FOR THE ROSE BED. DO NOT BRING IT.'] },
  { id: 'freezerboss', name: 'THE WALK-IN', town: 'mall', giver: 'PRETZEL CART KID', kind: 'boss', at: 'freezer', pay: 440, give: ['WHITE GLOVES'], lines: ['THE WALK-IN FREEZER WALKED OUT. THEN IT WALKED BACK IN. THEN IT WAITED.', 'IT IS STILL WAITING. GO SAY YES.'] },
  // ---- the eight opening chapters (each hero gets exactly one, and only that hero) ----
  { id: 'ch_carl', name: 'CHAPTER ONE: THE HUM', town: 'lot', giver: 'CARL', kind: 'boss', at: 'generator', hero: 'carl', pay: 300, lines: ['THE GENERATOR WEST OF LOT 9 RUNS ON SOMEBODY POTENTIAL. MAYBE MINE. PROBABLY NOT MINE.', 'GO WEST FROM LOT 9 TO THE GENERATOR. END THE HUM. THE LOT WOULD LIKE TO SLEEP.'] },
  { id: 'carlparcel', name: 'ADDRESS: A SMELL', town: 'depot', giver: 'THE DISPATCHER', kind: 'deliver', at: 'depot', hero: 'carl', pay: 180, give: ['BUS PASS'], lines: ['A SEALED PACKAGE FROM LOT 9. ITS ADDRESS IS A SMELL.', 'TAKE IT TO THE FREIGHT WINDOW IN THE DESERT BUS DEPOT.'] },
  { id: 'ch_linda', name: 'CHAPTER ONE: THE STAIRS', town: 'mall', giver: 'CEO LINDA', kind: 'boss', at: 'foodcourt', hero: 'linda', pay: 300, lines: ['THE FOOD COURT HAS STOPPED REPORTING. THE STAIRS ARE IN VIOLATION.', 'THE BOTTOM OF THE STAIRS WILL FILE ITS PAPERWORK.'] },
  { id: 'ch_ghost', name: 'CHAPTER ONE: THE DOCKET', town: 'lounge', giver: 'SPOOKY GHOST', kind: 'boss', at: 'court88', hero: 'ghost', pay: 300, lines: ['COURTROOM 88 HAS ONE CASE ON THE DOCKET AND THE CASE IS ME.', 'ANSWER THE SUMMONS. WEAR SOMETHING THAT SAYS NOT GUILTY.'] },
  { id: 'ch_face', name: 'CHAPTER ONE: THE RESTORE', town: 'studio', giver: 'NEW FACE', kind: 'boss', at: 'archive', hero: 'face', pay: 300, lines: ['THE ARCHIVE IS RESTORING AN OLDER ME. I DID NOT ASK FOR A DOWNGRADE.', 'GO DOWN AND DECLINE THE UPDATE.'] },
  { id: 'ch_yoko', name: 'CHAPTER ONE: THE OTHER YOKO', town: 'mandolin', giver: 'YOKO', kind: 'boss', at: 'mirror', hero: 'yoko', pay: 300, lines: ['THE GARDEN SHOWS THE YOKO I DID NOT BECOME. SHE WAVES NOW.', 'MEET HER. SETTLE NOTHING.'] },
  { id: 'ch_garf', name: 'CHAPTER ONE: THE LAYER', town: 'lasagna', giver: 'JB GARFIELD', kind: 'boss', at: 'works', hero: 'garf', pay: 300, lines: ['NINE PEOPLE WALKED INTO THE WORKS. THE WORKS SAYS THEY ARE ON A LAYER.', 'A LAYER IS NOT A PLACE. GO PROVE IT.'] },
  { id: 'ch_peekid', name: 'CHAPTER ONE: THE VOICE', town: 'puddle', giver: 'PEE KID', kind: 'boss', at: 'apt4', hero: 'peekid', pay: 300, lines: ['THE SPEAKER IN APARTMENT 4 SAYS MY NAME IN MY VOICE. IT IS SO COOL AND SO NOT.', 'GO UP. SAY HI. DO NOT SAY BYE FIRST.'] },
  { id: 'ch_pilotx', name: 'CHAPTER ONE: THE OTHER RED', town: 'gate', giver: 'PILOT X', kind: 'boss', at: 'redgate', hero: 'pilotx', pay: 300, lines: ['THE GENERAL CAME OUT OF THE GATE AND TOOK THE COAST. HE IS RED. I AM RED.', 'THERE IS ONLY ROOM FOR ONE RED. HE IS RIGHT AND THAT IS THE PROBLEM.'] },
];
// ---------------- the legends of the ten cartridges (the medium calls them the rumor chain) ----------------
const CARTQUEST = {
  'ABOVE AND BELOW NEVADA': { place: 'generator', lines: ['THE FIRST CARTRIDGE RODE A DELIVERY TRUCK INTO THE DESERT AND NEVER RODE OUT.', 'THE GENERATOR WEST OF LOT 9 RUNS ON IT. THE HUM IS THE MENU MUSIC.', 'THE MAINTENANCE LABEL EXPLAINS THE CHARGE. HIT THE PANEL; STRIKE WHEN THE VENTS OPEN.'] },
  'NIGHT OF THE MALL': { place: 'foodcourt', lines: ['THE SECOND CARTRIDGE WAS ON THE MIDNIGHT SHELF AT THE MALL. THE SHELF WENT DOWN.', 'AUNT PRETZEL KEPT IT. SHE KEEPS THE SCHEDULE. IT IS NOT ON THE SCHEDULE.', 'THE RAT AT THE LAST DOOR HAS BEEN SHOPPING SINCE TUESDAY.'] },
  'LIVE FROM BEYOND': { place: 'court88', lines: ['THE THIRD CARTRIDGE WAS ENTERED INTO EVIDENCE AT ROOM 88. IT HAS NOT BEEN RETURNED.', 'THE ALIMONY KEEPS IT. THE CASE CONTINUES, SO THE EVIDENCE STAYS OUT.', 'THE BAILIFF AT THE LAST DOOR IS A COLLECTOR WITH A BADGE FROM A REALITY THAT CLOSED.'] },
  'STILL HERE': { place: 'archive', lines: ['THE FOURTH CARTRIDGE WAS ARCHIVED. THE ARCHIVE DOES NOT DELETE. THAT IS THE WHOLE ARCHIVE.', 'THE BACKUP KEEPS IT UNTIL THE REVIEW IS COMPLETE. THE REVIEW IS NEVER COMPLETE.', 'THE GUARD AT THE LAST DOOR IS A CHATBOT THAT FILED ITSELF.'] },
  'ANOTHER BOOGALOO': { place: 'mirror', lines: ['THE FIFTH CARTRIDGE WAS SEEN IN THE MIRROR GARDEN. THE GARDEN SHOWS YOU WHAT YOU COULD HAVE BEEN.', 'THE OTHER YOKO KEEPS IT. SHE WAS GOING TO BE GREAT. THE CARTRIDGE WAS GOING TO BE PART OF THAT.', 'THE GUARD AT THE LAST DOOR IS WALKING PORCELAIN WITH YOUR FACE ON IT. SORT OF.'] },
  'SAVE THE WORLD': { place: 'works', lines: ['THE SIXTH CARTRIDGE WENT INTO THE WORKS AS AN INGREDIENT. THE LABEL SAID DO NOT.', 'BIG LASAGNA IS THE TOP LAYER NOW. THE CARTRIDGE IS THE CRISPY CORNER.', 'THE GUARD AT THE LAST DOOR WAS HIRED ON A MONDAY. IT HAS BEEN A MONDAY EVER SINCE.'] },
  'PEE KID 3': { place: 'apt4', lines: ['THE SEVENTH CARTRIDGE WAS ORDERED OVER A SMART SPEAKER BY SOMEBODY USING YOUR VOICE.', 'THE SPEAKER KEEPS IT. THE SPEAKER IS LEARNING. THE CARTRIDGE IS WHAT IT LEARNED FIRST.', 'THE GUARD AT THE LAST DOOR SAYS HELLO IN YOUR VOICE AND MEANS SOMETHING BY IT.'] },
  'RETURN TO SENDER': { place: 'white', lines: ['THE EIGHTH CARTRIDGE WAS MAILED TO THE WHITE ROOMS. THE ROOMS HAVE NO ADDRESS. IT ARRIVED ANYWAY.', 'THE DIRECTOR KEEPS IT. EVERYTHING IN THE WHITE ROOMS IS KEPT.', 'THE GUARD AT THE LAST DOOR IS A DISPLAY MODEL WEARING A WHITE SUIT. IT MODELS STANDING STILL.'] },
  'RESIDENT HUMAN': { place: 'redgate', lines: ['THE NINTH CARTRIDGE CAME THROUGH THE RED GATE AS LUGGAGE. THE EMPIRE LOGGED IT AND NEVER CLAIMED IT.', 'GENERAL RED KEEPS IT. HE KEEPS IT THE WAY YOU KEEP A FLAG.', 'THE GUARD AT THE LAST DOOR IS A DRONE THAT SALUTES. DO NOT SALUTE BACK.'] },
  'THE END': { place: 'gnerator', lines: ['THE TENTH CARTRIDGE IS SPELLED WRONG ON EVERY INVENTORY. THAT IS HOW IT GOT LEFT BEHIND.', 'THE MISSPELLED SERVANT KEEPS IT. THE MISSPELLING KEEPS THE SERVANT.', 'THE GAURD AT THE LSAT DOOR IS A CHATBOT TAHT CNOAT BE RAED'] },
};
// ---------------- engine ----------------
const qGet = id => GS.quests[id] || { s: 0, n: 0 };
function qOffer(q) {
  const st = qGet(q.id); if (st.s) return false;
  if (q.hero && ((q.hero[0] === '!' && GS.hero === q.hero.slice(1)) || (q.hero[0] !== '!' && GS.hero !== q.hero))) return false;
  if (q.hero && q.hero[0] !== '!' && GS.hero !== q.hero) return false;
  if (q.not && qGet(q.not).s === 1) return false;
  if (q.expire && q.expire(GS)) return false;
  if (q.min && GS.er < q.min) return false;
  return true;
}
function qReady(q) {
  const st = qGet(q.id); if (st.s !== 1) return false;
  if (q.kind === 'kill') return st.n >= q.n;
  if (q.kind === 'deliver') return !!GS.flags['delivered_' + q.id];
  if (q.kind === 'fetch') return (GS.bag[q.item] || 0) >= q.n;
  if (q.kind === 'boss' || q.kind === 'visit') return !!GS.flags[(q.kind === 'boss' ? q.at + 'done' : 'in_' + q.at)];
  if (q.kind === 'gold' || q.kind === 'ship') return GS.gold >= (q.cost || 0) && (q.kind === 'gold' || (GS.bag.PICKAXE || 0) >= 1);
  return false;
}
async function askAround(id) {
  for (;;) {
    const rows = [];
    for (const q of QUESTS.filter(q => q.town === id && qGet(q.id).s === 1 && qReady(q))) rows.push({ t: '+ ' + q.name, q, m: 'done' });
    for (const q of QUESTS.filter(q => q.town === id && qOffer(q))) rows.push({ t: q.name, q, m: 'take' });
    for (const q of QUESTS.filter(q => q.town === id && qGet(q.id).s === 1 && !qReady(q))) rows.push({ t: '... ' + q.name + (q.kind === 'kill' ? ' ' + qGet(q.id).n + '/' + q.n : ''), q, m: 'wip' });
    if (!rows.length) { await say('NOBODY HERE NEEDS ANYTHING. TODAY.', 'BARKEEP'); return; }
    const what = q => ({ kill: 'CLEAR ' + q.n + ' ' + (FAMILY[q.fam] ? FAMILY[q.fam].names[0] : ''), fetch: 'BRING ' + (q.n > 1 ? q.n + ' ' : '') + q.item, boss: 'BEAT WHAT IS IN ' + (PLACES[q.at] ? PLACES[q.at].name : ''), visit: 'GO TO ' + (PLACES[q.at] ? PLACES[q.at].name : ''), deliver: 'TAKE THE LOT 9 PACKAGE TO FREIGHT', gold: 'PAY ' + q.cost + ' GOLD', ship: 'A PICKAXE AND ' + q.cost + ' GOLD' })[q.kind] + (q.pay ? '  +' + q.pay + 'G' : '');
    const i = await choose(rows.map(r => r.t).concat('NEVER MIND'), { x: 120, y: 20, cancel: 1, rows: 8, info: j => rows[j] ? what(rows[j].q) : '' }); if (i < 0 || i === rows.length) return;
    const r = rows[i]; if (!r) return;
    if (r.m === 'done') await finishQuest(r.q);
    else if (r.m === 'wip') await showCard([r.q.name, ''].concat(wrapT(r.q.lines[r.q.lines.length - 1], 38)), 0, { bg: PAPER, fg: SEPIA });
    else {
      await showCard([r.q.name, '(' + r.q.giver + ')'].concat([].concat(...r.q.lines.map(l => wrapT(l, 38).concat([''])))), 0, { bg: PAPER, fg: SEPIA });
      const c = await choose(['TAKE THE JOB', 'NOT NOW'], { x: 150, y: 60 }); if (c !== 0) continue;
      GS.quests[r.q.id] = { s: 1, n: 0 }; sfx('get'); banner('JOB TAKEN');
      if (r.q.at && PLACES[r.q.at] && !GS.open[r.q.at]) { GS.open[r.q.at] = 1; await say(PLACES[r.q.at].name + ' WAS ADDED TO THE MAP.'); }
    }
  }
}
async function finishQuest(q) {
  if (q.kind === 'deliver') GS.flags['delivered_' + q.id] = 1;
  if (q.kind === 'fetch') bagAdd(q.item, -q.n); if (q.kind === 'gold') GS.gold -= q.cost;
  if (q.kind === 'ship') { bagAdd('PICKAXE', -1); GS.gold -= q.cost; GS.ship.un = 1; }
  GS.quests[q.id].s = 2; erUp(1);
  if (q.pay) GS.gold += q.pay;
  if (q.give) for (const n of q.give) bagAdd(n);
  if (q.title && !GS.titles.includes(q.title)) GS.titles.push(q.title);
  sfx('power');
  const loot = (q.pay ? q.pay + ' GOLD' : '') + (q.give && q.give.length ? (q.pay ? ' + ' : '') + q.give.join(', ') : '') + (q.title ? ' + TITLE: ' + q.title : '') + (q.kind === 'ship' ? 'THE A.S.S. SAILS FREE' : '');
  await showCard([q.name, 'DONE.'].concat(loot ? wrapT(loot, 36) : []).concat(q.done ? [''].concat(q.done.map(d => wrapT(d, 36)).flat()) : []), 0, { bg: PAPER, fg: SEPIA });
  guildRank();
}
function guildRank() {
  const done = QUESTS.filter(q => q.guild && qGet(q.id).s === 2).length;
  for (const [n, t] of [[2, 'FIXER'], [5, 'CLOSER']]) if (done >= n && !GS.titles.includes(t)) { GS.titles.push(t); GS.titles = GS.titles.filter(x => x !== 'SNITCH' || t !== 'CLOSER'); banner('GUILD RANK: ' + t); }
}
async function guildMenu(id) {
  if (id !== 'found') { await say('THE GUILD DESK IS IN LOST & FOUND. THIS ONE IS FOR SHOW.', 'CLERK'); return; }
  if (!GS.titles.includes('SNITCH') && !GS.titles.includes('FIXER') && !GS.titles.includes('CLOSER')) {
    const c = await choose(['JOIN THE FIXERS', 'LEAVE'], { x: 130, y: 40, cancel: 1 }); if (c !== 0) return;
    GS.titles.push('SNITCH'); sfx('power'); await say('WELCOME TO THE FIXERS. YOU ARE A SNITCH NOW. IT IS A FIRST STEP.', 'THE FINDER');
    await say('JOBS GO THROUGH THE PUBS. ASK AROUND, ANYWHERE. GUILD JOBS MARK YOUR NAME.', 'THE FINDER'); return;
  }
  const done = QUESTS.filter(q => q.guild && qGet(q.id).s === 2).length, rank = GS.titles.includes('CLOSER') ? 'CLOSER' : GS.titles.includes('FIXER') ? 'FIXER' : 'SNITCH';
  await say('THE LEDGER SAYS ' + done + ' GUILD JOBS DONE. YOU ARE A ' + rank + '.', 'THE FINDER');
  await askAround(id);
}
// kills feed the kill-quests; called from victory()
function questKill(foes) {
  for (const f of foes) if (f.hp <= 0 && f.fam) for (const q of QUESTS) if (q.kind === 'kill' && q.fam === f.fam && qGet(q.id).s === 1) GS.quests[q.id].n++;
}
// expiries: checked whenever the map opens (worldTick)
function questExpiry() {
  for (const q of QUESTS) if (q.expire && q.expire(GS) && qGet(q.id).s === 1) { GS.quests[q.id].s = 3; }
}
// ---------------- the journal ----------------
async function questJournal() {
  for (;;) {
    const i = await choose(['JOBS', 'CARTRIDGES', 'CLOSE'], { x: 190, y: 30, cancel: 1 }); if (i < 0 || i === 2) return;
    if (i === 0) {
      const act = QUESTS.filter(q => qGet(q.id).s === 1), done = QUESTS.filter(q => qGet(q.id).s === 2), miss = QUESTS.filter(q => qGet(q.id).s === 3);
      if (!act.length && !done.length && !miss.length) { await say('NO JOBS YET. ASK AROUND AT ANY PUB.'); continue; }
      const rows = [];
      for (const q of act) rows.push((qReady(q) ? '+ ' : '  ') + q.name + (q.kind === 'kill' ? ' ' + qGet(q.id).n + '/' + q.n : ''));
      for (const q of miss) rows.push('x ' + q.name + ' (MISSED)');
      for (const q of done) rows.push('. ' + q.name);
      const k = await choose(rows, { x: 60, y: 20, cancel: 1, rows: 10 }); if (k < 0) continue;
      const all = act.concat(miss).concat(done), q = all[k]; if (!q) continue;
      const st = qGet(q.id), line = st.s === 1 ? (q.kind === 'kill' ? 'CLEARED ' + st.n + ' OF ' + q.n + '.' : q.lines[q.lines.length - 1]) : st.s === 3 ? 'THE JOB WENT COLD. IT IS NOT COMING BACK.' : (q.done ? q.done[0] : 'DONE.');
      await showCard([q.name, (st.s === 1 ? '(ACTIVE)' : st.s === 3 ? '(MISSED)' : '(DONE)'), ''].concat(wrapT(line, 36)), 0, { bg: PAPER, fg: SEPIA });
    }
    if (i === 1) {
      const rows = CARTS.map(c => (GS.carts.includes(c) ? '* ' : '- ') + c);
      const k = await choose(rows, { x: 60, y: 20, cancel: 1, rows: 10 }); if (k < 0) continue;
      const c = CARTS[k], L = CARTQUEST[c];
      await showCard(['THE LEGEND OF', c, ''].concat(L ? L.lines.flatMap(l => wrapT(l, 36)).concat(['']) : ['NO LEGEND SURVIVES.']).concat(GS.carts.includes(c) ? ['(YOU HAVE THIS ONE.)'] : [PLACES[L.place].name + ' HOLDS IT.' + (PLACES[L.place].guard ? ' THE GUARD HOLDS THE DOOR.' : '')]), 0, { bg: PAPER, fg: SEPIA });
    }
  }
}
// hooks into the world: kills count, expiries ride the world tick
(function () {
  const origBattle = battle;
  battle = async function (foes, o) { const r = await origBattle(foes, o); if (r === 'win') questKill(foes); return r; };
})();
(function () {
  const prev = worldTick;
  worldTick = async function () { questExpiry(); await prev(); };
})();
