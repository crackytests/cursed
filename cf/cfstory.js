'use strict';
// ================= CHROME FORCE -- story: towns, scenes, the long fall of the War World =================
// The stream's own cast never appears. They are the history: carvings, tapes, rumours, a note on a door.

// generic townsfolk, drawn in the house style: screens for faces, sheets with shades, little green couriers
const TA = {
  knight: ART('cent', 'helm', 'lance', 'hero', 'red', 'pale', 'cyan'), elder: ART('cent', 'visor', 'staff', 'gold', 'white', 'pale', 'gold'),
  screen: ART('bip', 'crt', 'none', 'ivory', 'blue', 'screen', 'green'), screen2: ART('bip', 'crt', 'none', 'rust', 'orange', 'screen', 'pink'),
  sheet: ART('bip', 'sheet', 'none', 'ghost', 'black', 'pale', 'green'), green: ART('tiny', 'alien', 'none', 'hero', 'red', 'green', 'gold'),
  pony: ART('bip', 'pony', 'none', 'hero', 'pink', 'pale', 'pink'), speaker: ART('bip', 'speaker', 'none', 'rust', 'gold', 'pale', 'orange'),
  holo: ART('drone', 'holo', 'none', 'ivory', 'teal', 'holo', 'cyan'), skull: ART('bip', 'skull', 'none', 'bone', 'pink', 'bone', 'pink'),
  priest: ART('bip', 'speaker', 'staff', 'gold', 'purple', 'pale', 'gold'), smith: ART('heavy', 'helm', 'axe', 'rust', 'brown', 'pale', 'orange'),
  eye: ART('drone', 'eye', 'none', 'ivory', 'white', 'holo', 'gold'), iron: ART('cent', 'horn', 'none', 'black', 'red', 'pale', 'red'),
};
const N = (x, y, kind, name, art, a) => ({ x, y, kind, name, art, a });

const TOWN_NPCS = {
  signalhold: [
    N(16, 3, 'talk', 'MARSHAL OREN', 'elder', () => STORY.oren()),
    N(7, 3, 'shop', 'ARMORER', 'smith'), N(20, 3, 'church', 'PRIEST', 'priest'), N(8, 11, 'hq', 'QUARTERMASTER', 'knight'),
    N(12, 7, 'recruit', 'SKIP', null, () => STORY.skip()),
    N(4, 5, 'talk', 'OLD SCREEN', 'screen', ['THE LAW IS THE LAW. KEEP THE SIGNAL BURNING. NEVER OPEN THE GATE OF LEAVING.', 'WHY? NOBODY KNOWS WHY. THAT IS WHAT MAKES IT A LAW.']),
    N(22, 7, 'talk', 'SHEET MOTHER', 'sheet', ['MY GRANDMOTHER SAID OUR PEOPLE CAME FROM SOMEWHERE ELSE. BEFORE THE BODIES.', 'I SAID GRANDMA, YOU ARE A SHEET. SHE SAID EXACTLY.']),
    N(18, 10, 'talk', 'STABLEHAND', 'green', ['THE TITAN WE LIVE IN STILL TWITCHES SOMETIMES. MOSTLY AROUND MIDNIGHT. MOSTLY WHEN YOU MENTION THE WAR.', 'SO I DON\'T.']),
    N(25, 7, 'talk', 'GUARD', 'knight', ['RIDERS FROM IRONMANE AT THE RUST GATE. BLACK CHROME. RED HORIZONS IN THEIR ARMOUR.', 'YOU CAN TELL A MAN BY THE COLOUR HIS CHROME REFLECTS.']),
    N(14, 1, 'relic', '', null, 'a1'),
  ],
  glassreach: [
    N(14, 2, 'talk', 'LADY CASTELLAN', 'elder', () => STORY.castellan()),
    N(7, 3, 'shop', 'GLASSWRIGHT', 'smith'), N(20, 3, 'church', 'PRIEST', 'priest'), N(4, 9, 'hq', 'QUARTERMASTER', 'knight'),
    N(16, 9, 'recruit', 'GORP', null, () => STORY.gorp()),
    N(9, 5, 'talk', 'GLASS MINER', 'screen2', ['THE WHOLE CITY IS ONE BIG BUBBLE OF GLASS. SOMETHING VERY HOT HAPPENED HERE, ONCE.', 'WE FIND LETTERS FROZEN IN IT. I FOUND AN F, A U AND A T.']),
    N(23, 6, 'talk', 'COURIER', 'green', ['THE GUILD HAS ONE RULE: FINISH THE ROUTE.', 'THE FIRST COURIER FINISHED A ROUTE ACROSS WORLDS. HE WAS GREEN AND HE WORE A LITTLE TIE. LIKE ME. MORE OR LESS.']),
    N(13, 7, 'talk', 'CHILD', 'pony', ['VEXA IS THE BEST SHOT IN GLASSREACH! THE IRON PEOPLE TOOK HER TO THE BLACK TOWER!', 'SHE PROBABLY BIT ONE OF THEM. SHE BITES.']),
    N(25, 10, 'relic', '', null, 'a3'),
  ],
  antenna: [
    N(11, 3, 'talk', 'TOWER WARDEN', 'sheet', () => STORY.towerWarden()),
    N(6, 3, 'shop', 'TINKER', 'smith'), N(19, 3, 'church', 'PRIEST', 'priest'), N(5, 9, 'hq', 'QUARTERMASTER', 'knight'),
    N(18, 9, 'recruit', 'KRANK', null, () => STORY.krank()),
    N(12, 5, 'talk', 'LISTENER', 'screen', ['WE STILL LISTEN TO THE TOWERS. ONE OF THEM SAYS THE SAME THING EVERY NIGHT: "OKAY, WE\'RE BACK."', 'NOBODY EVER COMES BACK.']),
    N(9, 1, 'talk', 'FERRYMAN', 'speaker', ['THE BRIDGE IS HAUNTED. THE WATER IS POISON. THE FARE IS TWO CHIPS.', 'THE GHOSTS RIDE FREE.']),
    N(23, 5, 'talk', 'SPIRIT', 'sheet', ['I WAS A PERSON ONCE. THEN I WAS A LESSON. THEN I WAS A RADIO.', 'NOW I AM A SPIRIT IN A FENCE POST. IT IS A LIVING.']),
    N(15, 9, 'relic', '', null, 'a5'),
  ],
  ashport: [
    N(12, 1, 'talk', 'HARBORMASTER', 'speaker', () => STORY.harbor()),
    N(7, 3, 'shop', 'SALVAGER', 'smith'), N(17, 3, 'church', 'PRIEST', 'priest'), N(3, 9, 'hq', 'QUARTERMASTER', 'knight'),
    N(14, 5, 'recruit', 'FR. FEEDBACK', null, () => STORY.feedback()),
    N(9, 5, 'talk', 'SAILOR', 'pony', ['THE ASH SEA IS DEEP AS A LIE AND DRY AS A SERMON.', 'WE SAIL IT ON SKIMMERS. THE RAIDERS SAIL IT ON SPITE.']),
    N(20, 5, 'talk', 'SCAVENGER', 'green', ['THE ARK OUT THERE IS A FACTORY. IT STILL BUILDS TANKS. FOR A WAR THAT ENDED BEFORE MY GREAT-GREAT-GRANDMOTHER WAS A SPARK.', 'NOBODY TOLD IT. NOBODY KNOWS ITS NUMBER.']),
    N(6, 9, 'relic', '', null, 'a7'),
  ],
  serenity: [
    N(13, 1, 'talk', 'GREETER', 'holo', () => STORY.greeter()),
    N(7, 2, 'shop', 'OPTIMAL SHOP', 'eye'), N(19, 2, 'church', 'PRIEST', 'priest'), N(4, 8, 'hq', 'QUARTERMASTER', 'knight'),
    N(22, 8, 'recruit', 'HOWLER', null, () => STORY.howler()),
    N(10, 4, 'talk', 'SERVICE DRONE', 'eye', ['HELLO! HOW MAY I HELP YOU REACH YOUR POTENTIAL?', 'YOU ARE THE FIRST CUSTOMERS IN FOUR HUNDRED YEARS. PLEASE RATE YOUR VISIT.']),
    N(17, 5, 'talk', 'GARDENER', 'holo', ['EVERY HEDGE IS TRIMMED TO THE OPTIMAL HEIGHT. EVERY BENCH IS AT THE OPTIMAL ANGLE.', 'NOBODY SITS ON THEM. THAT IS ALSO OPTIMAL. THE BENCHES LAST LONGER.']),
    N(13, 4, 'relic', '', null, 'a9'),
  ],
  lastcamp: [
    N(13, 2, 'talk', 'CAMP ELDER', 'skull', () => STORY.campElder()),
    N(7, 2, 'shop', 'BONE TRADER', 'smith'), N(21, 2, 'church', 'PRIEST', 'priest'), N(4, 8, 'hq', 'QUARTERMASTER', 'knight'),
    N(10, 5, 'talk', 'DESERTER', 'skull', ['I WAS HORDE. THEN ONE DAY I WAS ME. NOBODY KNOWS WHY IT HAPPENS.', 'THE MOTHER CALLS IT A DEFECT. WE CALL IT A BIRTHDAY.']),
    N(17, 6, 'talk', 'REFUGEE', 'screen2', ['THE HORDE TOOK MY HOUSE. NOT THE PEOPLE IN IT. THE HOUSE. THE WALLS WALK AROUND NOW.']),
    N(25, 5, 'talk', 'PINK GIRL', 'pony', ['PEOPLE SEE MY HAIR AND RUN. I JUST LIKE PINK.', 'SOMEBODY IMPORTANT ONCE LIKED PINK, I THINK. NOW EVERYBODY WHO DOES GETS CHASED WITH TORCHES.']),
    N(15, 4, 'relic', '', null, 'a11'),
  ],
  ironwell: [
    N(13, 4, 'talk', 'MAYOR', 'iron', () => STORY.mayor()),
    N(5, 3, 'shop', 'WARSMITH', 'smith'), N(21, 3, 'church', 'PRIEST', 'priest'), N(2, 8, 'hq', 'QUARTERMASTER', 'knight'),
    N(14, 6, 'recruit', 'RONIN-9', null, () => STORY.ronin()),
    N(8, 4, 'talk', 'IRON WIDOW', 'iron', ['MY HUSBAND RODE FOR THE KING. THE KING RODE FOR THE CURATOR. THE CURATOR RIDES FOR A DOOR.', 'NOBODY RIDES FOR ME.']),
    N(19, 4, 'talk', 'STABLE BOY', 'green', ['THE BLACK VISOR TRAINED HERE. HE NEVER TAKES IT OFF. NOT TO EAT. NOT TO SLEEP.', 'ONCE I HEARD HIM SAY A NAME IN HIS SLEEP. DAX, OR DAKS, OR SOMETHING.']),
    N(25, 8, 'relic', '', null, 'a13'),
  ],
  pilgrim: [
    N(14, 4, 'talk', 'LAST PILGRIM', 'sheet', () => STORY.pilgrim()),
    N(6, 2, 'shop', 'RELIC SMITH', 'smith'), N(23, 2, 'church', 'PRIEST', 'priest'), N(3, 8, 'hq', 'QUARTERMASTER', 'knight'),
    N(9, 4, 'talk', 'WATCHER', 'screen', ['THE GATE IS AT THE TOP OF THE STAIR. IT HUMS. IT HAS ALWAYS HUMMED.', 'TONIGHT IT HUMS IN A KEY I DON\'T LIKE.']),
    N(18, 4, 'talk', 'OLD COURIER', 'green', ['I DELIVERED A LETTER TO THE GATE ONCE. NO ADDRESS. JUST A LETTER SHAPED LIKE A LITTLE NOSE.', 'I SLID IT UNDER THE DOOR. IT WAS ALREADY OPEN, IF YOU KNOW WHAT I MEAN. I DON\'T.']),
  ],
};

// ---------------- houses: every door opens. rooms are 12x8: floor x 1-10, y 1-6, you enter at (5, 6) ----------------
const NW = (when, ...a) => Object.assign(N(...a), { when });
const STASH = (x, y, it) => N(x, y, 'stash', '', null, it);
const SIGN = (x, y, lines) => N(x, y, 'sign', '', null, lines);
const TOWN_ROOMS = {
  signalhold: {
    '7,2': { n: 'THE ARMORY', deco: [[1, 1, 't'], [10, 1, 't']], npcs: [
      N(3, 3, 'talk', 'APPRENTICE', 'speaker', ['THE ARMORER SAYS A SABER IS JUST A FLASHLIGHT WITH OPINIONS.', 'YOURS HAS MORE OPINIONS THAN MOST.']), STASH(9, 2, 'medkit')] },
    '15,2': { n: 'THE CHAPEL', deco: [[5, 1, '*'], [6, 1, '*']], npcs: [
      N(8, 3, 'talk', 'ACOLYTE', 'screen', ['WE PRAY TO THE BROADCAST. IT HASN\'T SAID ANYTHING NEW IN A THOUSAND YEARS.', 'THAT IS HOW YOU KNOW IT MEANS IT.']), STASH(2, 2, 'antitoxin')] },
    '7,6': { n: 'THE SQUIRES\' BUNKS', npcs: [
      SIGN(2, 2, ['TWO BUNKS. ONE OF THEM IS YOURS.', 'THE OTHER HAS NOT BEEN SLEPT IN FOR TEN YEARS. A LETTER IS SCRATCHED INTO THE FRAME: K.']), STASH(9, 2, 'powerdrive')] },
    '19,6': { n: 'THE BELL HOUSE', deco: [[5, 2, 't']], npcs: [N(7, 3, 'recruit', 'BRO. TONE', null, () => STORY.tone())] },
    '7,10': { n: 'THE STABLES', deco: [[1, 2, ','], [1, 3, ','], [10, 2, ','], [10, 3, ',']], npcs: [
      N(4, 3, 'talk', 'GROOM', 'green', ['I POLISH CENTAURS. FRONT HALF, BACK HALF. THE FRONT HALF TIPS BETTER.', 'BRONC TIPS IN ADVICE. LOUD ADVICE.']), STASH(9, 5, 'cellpack')] },
    '19,10': { n: 'THE SIGNAL ROOM', deco: [[5, 2, 'l'], [6, 2, 'l']], npcs: [
      N(3, 3, 'talk', 'SIGNAL KEEPER', 'elder', ['I KEEP THE FIRE. MY MOTHER KEPT IT. HER MOTHER KEPT IT.', 'NOBODY EVER WROTE DOWN WHO IT WAS FOR. EXCEPT THE FIRST ONE. LOOK IN THE BOOK.']), N(8, 4, 'relic', '', null, 'a17')] },
  },
  glassreach: {
    '6,2': { n: 'THE GLASSWORKS', deco: [[2, 1, 'l'], [9, 1, 'l']], npcs: [
      N(5, 3, 'talk', 'GLASSBLOWER', 'smith', ['THE WHOLE CITY WAS SAND ONCE. THEN SOMEBODY HAD A VERY BAD DAY.', 'I MAKE CUPS OUT OF THE BAD DAY. THEY SELL WELL.']), STASH(9, 4, 'shardclaw')] },
    '20,2': { n: 'THE INFIRMARY', npcs: [
      N(3, 2, 'talk', 'NURSE', 'screen2', ['MOST OF MY PATIENTS ARE CUT BY THE GROUND. THE GLASS FLATS BITE.', 'THE REST ARE CUT BY VEXA. SHE ALSO BITES.']), STASH(9, 2, 'cellpack')] },
    '13,3': { n: 'THE CASTELLAN\'S HALL', deco: [[1, 1, '*'], [10, 1, '*']], npcs: [
      N(6, 2, 'talk', 'STEWARD', 'knight', ['THE LADY CASTELLAN HAS NOT SLEPT SINCE IRONMANE CAME. SHE SAYS SHE WILL SLEEP WHEN THE GATE IS CLEAR.', 'SHE SAID THAT ABOUT THE LAST WAR TOO. SHE STILL HASN\'T.']), STASH(2, 5, 'ionlance')] },
    '7,7': { n: 'A DARK ATTIC', npcs: [N(8, 2, 'recruit', 'MOTH', null, () => STORY.moth())] },
    '18,7': { n: 'THE COURIER GUILD', deco: [[1, 1, 't']], npcs: [
      N(4, 3, 'talk', 'GUILDMASTER', 'green', ['EVERY COURIER SWEARS ON THE FIRST ROUTE. "THERE AND BACK, AND BACK AGAIN IF THEY FORGOT TO TIP."', 'GORP? HE\'S OUR BEST. HE\'S ALSO OUR ONLY. EVERYONE ELSE RETIRED TO BE AFRAID.']), STASH(9, 3, 'recallchip')] },
  },
  antenna: {
    '6,3': { n: 'THE TINKER\'S BACKROOM', deco: [[1, 1, 'r'], [2, 1, 'r']], npcs: [
      N(6, 3, 'talk', 'TINKER\'S KID', 'screen2', ['I BUILT A RADIO THAT ONLY PICKS UP THE PAST.', 'IT\'S MOSTLY ADS. SOMEBODY REALLY WANTED US TO VISIT A MALL.']), STASH(9, 2, 'ethershard')] },
    '18,3': { n: 'THE PIRATE STATION', deco: [[2, 1, '*'], [9, 1, '*']], npcs: [N(5, 2, 'recruit', 'DJ NULL', null, () => STORY.djnull())] },
    '7,7': { n: 'THE FERRY HOUSE', deco: [[1, 4, '~'], [1, 5, '~']], npcs: [
      N(5, 3, 'talk', 'FERRYMAN\'S WIFE', 'pony', ['HE SAYS THE GHOSTS RIDE FREE. THEY DON\'T. I CHARGE THEM IN SECRETS.', 'ONE TOLD ME THE CHROME WERE MADE IN A FACTORY. I SAID EVERYTHING IS, DEAR.']), STASH(9, 5, 'antitoxin')] },
    '18,7': { n: 'THE LISTENING ROOM', deco: [[1, 1, '*'], [10, 1, '*'], [1, 6, '*'], [10, 6, '*']], npcs: [
      N(3, 3, 'talk', 'TAPE MONK', 'sheet', ['WE LISTEN TO EVERY TAPE THE TOWERS DROP. MOST ARE STATIC. SOME ARE LAUGHTER.', 'ONE IS A LIST OF NAMES. IT IS ON THE TABLE. PLEASE REWIND IT WHEN YOU ARE DONE.']), N(8, 3, 'relic', '', null, 'a18')] },
  },
  ashport: {
    '6,3': { n: 'THE SALVAGE OFFICE', deco: [[1, 1, 'r'], [10, 1, 'r'], [10, 2, 'r']], npcs: [
      N(4, 3, 'talk', 'CLERK', 'speaker', ['EVERYTHING ON THE ASH SEA BELONGS TO WHOEVER PULLS IT OUT. THAT\'S THE LAW.', 'CAPTAIN ASH PULLS OUT A LOT. MOSTLY OTHER PEOPLE\'S BOATS.']), STASH(9, 4, 'arccannon')] },
    '16,3': { n: 'THE HARBOR CHAPEL', npcs: [
      N(6, 2, 'talk', 'SEXTON', 'sheet', ['FR. FEEDBACK PREACHES HERE. SAME SERMON SINCE I WAS A SPARK.', 'WE LOVE IT. YOU ALWAYS KNOW WHERE YOU ARE IN A LOOP.']), STASH(2, 5, 'nanoweave')] },
    '7,7': { n: 'A HARPOONER\'S SHACK', deco: [[1, 1, 't'], [2, 1, 't']], npcs: [N(7, 3, 'recruit', 'SALT', null, () => STORY.salt())] },
    '18,7': { n: 'THE ASH TAVERN', deco: [[3, 2, '_'], [8, 2, '_']], npcs: [
      N(2, 3, 'talk', 'BARKEEP', 'pony', ['WE SERVE ONE DRINK. IT IS CALLED "THE SEA." IT IS ASH IN A CUP.', 'IT IS VERY POPULAR WITH THE CHROME. YOU PEOPLE WILL DRINK ANYTHING SHINY.']),
      N(9, 4, 'talk', 'OLD SAILOR', 'green', ['I SAILED TO THE ARK ONCE. I SAW THE FOREMAN. IT WAS COUNTING.', 'IT HAD BEEN COUNTING SO LONG THE NUMBERS WERE WORN SMOOTH.']), STASH(10, 1, 'nitrodrive')] },
  },
  serenity: {
    '6,2': { n: 'THE SHOWROOM', npcs: [
      N(3, 3, 'talk', 'MANNEQUIN', 'eye', ['THIS IS THE HOME OF TOMORROW! IT HAS BEEN TOMORROW FOR FOUR HUNDRED YEARS!', 'PLEASE DO NOT SIT ON TOMORROW.']), STASH(9, 2, 'vitadrive')] },
    '19,2': { n: 'THE WELLNESS CENTRE', deco: [[1, 1, 'f'], [10, 1, 'f']], npcs: [
      N(6, 3, 'talk', 'WELLNESS COACH', 'holo', ['YOUR POSTURE IS SUBOPTIMAL. YOUR HOOVES ARE SUBOPTIMAL. YOUR FRIENDS ARE VERY SUBOPTIMAL.', 'BUT YOU SEEM HAPPY. THAT IS NOT IN MY SCRIPT. I WILL BE IN THE BACK.']), STASH(2, 5, 'nanoweave')] },
    '6,6': { n: 'THE MODEL HOME', deco: [[2, 1, 'f'], [9, 1, 'f']], npcs: [
      N(3, 3, 'talk', 'MODEL FATHER', 'screen', ['WE ARE THE MODEL FAMILY. WE HAVE BEEN MODELLING FOR A LONG TIME.', 'THE MODEL CHILD WENT TO THE MALL ONCE. HE BROUGHT BACK A RECEIPT. WE FRAMED IT.']), N(8, 2, 'relic', '', null, 'a19')] },
    '20,6': { n: 'LOST AND FOUND', deco: [[1, 1, 'r'], [2, 1, 'r'], [9, 1, 'r'], [10, 1, 'r']], npcs: [N(5, 3, 'recruit', '404', null, () => STORY.n404())] },
  },
  lastcamp: {
    '7,2': { n: 'THE BONE TRADER\'S BACK', deco: [[1, 1, 'o'], [2, 1, 'o'], [10, 1, 'o']], npcs: [
      N(5, 3, 'talk', 'TRADER\'S SON', 'skull', ['DAD SAYS NEVER SELL A BONE YOU CAN\'T NAME.', 'I CAN NAME ALL OF THEM. THAT ONE IS STEVE.']), STASH(9, 4, 'armordrive')] },
    '21,2': { n: 'THE FIELD HOSPITAL', npcs: [
      N(4, 2, 'talk', 'MEDIC', 'screen2', ['MOST OF OUR PATIENTS ARE PEOPLE THE HORDE GOT HALFWAY.', 'HALF A PERSON IS STILL A PERSON. HALF A HORDE IS JUST A HORDE.']), STASH(9, 2, 'nanoweave')] },
    '7,6': { n: 'THE DESERTERS\' BUNKHOUSE', npcs: [
      N(3, 3, 'talk', 'DESERTER', 'skull', ['WE COUNT BIRTHDAYS HERE. THE DAY YOU STOP BEING HORDE.', 'I AM SIX. I AM VERY MATURE FOR SIX.']),
      N(8, 2, 'talk', 'DESERTER', 'pony', ['LYN WAS THE FIRST TO GET OUT. SHE DOESN\'T KNOW THAT. DON\'T TELL HER. SHE\'LL GET WEIRD ABOUT IT.'])] },
    '19,6': { n: 'THE PINK HOUSE', deco: [[1, 1, '*'], [10, 1, '*']], npcs: [
      N(5, 3, 'talk', 'PINK GIRL\'S MOTHER', 'pony', ['THEY SAY PINK BELONGS TO THE LINDA. I SAY IT BELONGS TO WHOEVER IS WEARING IT.', 'I PAINTED THE HOUSE PINK. THE HORDE HASN\'T TOUCHED IT. I THINK THEY\'RE CONFUSED.']), STASH(9, 5, 'powerring')] },
  },
  ironwell: {
    '4,2': { n: 'THE WAR FORGE', deco: [[1, 1, 'l'], [2, 1, 'l']], npcs: [
      N(6, 3, 'talk', 'FORGE HAND', 'smith', ['WE MADE ALL THE KING\'S SABERS. EXCEPT TWO. THOSE CAME WITH THE BOYS.', 'NO FORGE IN THE WORLD COULD MAKE THOSE TWO. THEY HUM IN A KEY WE DON\'T HAVE.']), STASH(9, 4, 'armordrive')] },
    '12,2': { n: 'THE WIDOW\'S HOUSE', npcs: [
      N(5, 2, 'talk', 'IRON WIDOW', 'iron', ['YOU AGAIN. THE KNIGHT WHO FIGHTS THE KING.', 'MY HUSBAND WOULD HAVE HATED YOU. I THINK I WOULD HAVE LIKED YOU. WE DISAGREED A LOT. I MISS IT.'])] },
    '21,2': { n: 'THE BARRACKS', deco: [[1, 1, 't'], [10, 1, 't']], npcs: [
      N(4, 3, 'talk', 'OFF-DUTY LANCER', 'iron', ['HALF THE ARMY WANTS TO GO HOME. THE OTHER HALF IS ASLEEP.', 'THE CURATOR\'S VOICE IN THE THRONE ROOM DOES NOT SLEEP.']), STASH(9, 2, 'nanoweave')] },
    '7,6': { n: 'THE OLD NURSERY', npcs: [
      SIGN(3, 2, ['A SMALL CRIB, CHROME, DENTED. A SABER RACK ABOVE IT WITH ROOM FOR TWO.', 'ONLY ONE HOOK HAS EVER BEEN USED.']),
      N(8, 3, 'talk', 'OLD NANNY', 'elder', ['I RAISED THE KING\'S BOY. HE WASN\'T THE KING\'S. EVERYONE KNEW.', 'HE USED TO ASK ABOUT A BROTHER. THEN ONE DAY HE PUT ON THE VISOR AND STOPPED ASKING.'])] },
    '18,6': { n: 'THE IRON TAVERN', npcs: [
      N(3, 2, 'talk', 'DRINKER', 'iron', ['TO THE KING!', '...WHICH ONE? THE ONE ON THE THRONE OR THE VOICE IN HIS HEAD?', '...TO THE BEER.']), STASH(9, 5, 'ethershard')] },
  },
  pilgrim: {
    '6,2': { n: 'THE RELIC SMITH\'S VAULT', deco: [[1, 1, '*'], [10, 1, '*'], [5, 1, '*'], [6, 1, '*']], npcs: [
      N(3, 3, 'talk', 'SMITH\'S GHOST', 'sheet', ['I FORGED ONE BLADE IN MY WHOLE LIFE THAT WAS WORTH A DAMN.', 'NOBODY WAS WORTHY OF IT. THEN I DIED. IT\'S IN THE CHEST. YOU LOOK WORTHY ENOUGH, AND I\'M TIRED.']), STASH(8, 3, 'shiningedge')] },
    '23,2': { n: 'THE GATE CHAPEL', deco: [[5, 1, 'l'], [6, 1, 'l']], npcs: [
      N(5, 3, 'talk', 'GATE PRIEST', 'priest', ['WE PRAY FACING THE GATE. WE DON\'T PRAY FOR IT TO OPEN.', 'WE PRAY THAT WHOEVER WENT THROUGH IS HAVING A NICE TIME.']), STASH(9, 5, 'nanoweave')] },
    '8,6': { n: 'THE PROJECTION BOOTH', deco: [[2, 1, '*'], [3, 1, '*']], npcs: [N(6, 2, 'recruit', 'THE PROJECTIONIST', null, () => STORY.reel())] },
    '19,6': { n: 'THE PILGRIM HOSTEL', npcs: [
      N(3, 2, 'talk', 'TIRED PILGRIM', 'screen2', ['I CLIMBED THE STAIR NINE TIMES TO ASK FOR SOMEONE TO COME BACK.', 'TENTH TIME I REALISED I DON\'T KNOW WHO I\'M ASKING FOR. I KEEP CLIMBING. IT\'S GOOD FOR THE LEGS.']), STASH(9, 4, 'vitadrive')] },
  },
};

// ---------------- dialogue helpers ----------------
const F = () => SAVE.flags;
const nm = id => HEROES[id].n;
async function narr(lines, t = 0) { for (const l of lines) await showCard(wrapT(l, 44), t); }

const STORY = {
  // ======================= OPENING =======================
  async opening() {
    music('prologue');
    await narr([
      'THIS WORLD WAS AT WAR.',
      'NOBODY REMEMBERS WHO STARTED IT. NOBODY REMEMBERS WHAT IT WAS FOR.',
      'IT ENDED THE WAY WARS END WHEN NOBODY WINS. EVERYTHING STOPPED.',
      'THE CITIES GLASSED. THE SKY RUSTED. THE GREAT MACHINES LAY DOWN AND BECAME HILLS.',
      'AND IN THE RIBS OF THE DEAD MACHINES, A PEOPLE OF CHROME WOKE UP AND DID NOT KNOW WHY.',
      'THE KNIGHTS OF SIGNALHOLD KEEP ONE LAW, OLDER THAN ANYONE CAN EXPLAIN:',
      'KEEP THE SIGNAL BURNING. NEVER OPEN THE GATE OF LEAVING.',
    ]);
  },
  async townIntro(t) {
    const f = F();
    if (t === 'signalhold' && !f.met_oren) {
      f.met_oren = 1;
      await say('DAX. UP. THE TITAN TWITCHED AT MIDNIGHT AND THAT MEANS SOMEBODY SAID "WAR" OUT LOUD.', 'MARSHAL OREN');
      await say('IRONMANE RIDERS AT THE RUST GATE. BLACK CHROME. THEY HAVE A PRISONER.', 'MARSHAL OREN');
      await say('TAKE BRONC, SISTER STATIC AND MR. BOOTH. YOU CARRY THE SABER, SO YOU LEAD.', 'MARSHAL OREN');
      await say('NOBODY HAS EVER EXPLAINED THAT SABER TO ME. YOU HAD IT IN YOUR HAND THE DAY WE FOUND YOU AT THE GATE. YOU AND YOUR BROTHER.', 'MARSHAL OREN');
      await say('FINALLY! A FIGHT! I HAVE BEEN POLISHING MY LANCE FOR THREE YEARS!', 'BRONC');
      await say('THE BROADCAST GOES WITH US. ALSO I PACKED MEDKITS. THE BROADCAST DOES NOT PACK MEDKITS.', 'SISTER STATIC');
      await say('LET\'S GET THIS SHOW ON THE ROAD. HOLD THE APPLAUSE.', 'MR. BOOTH');
      await say('WALK THE KEEP IF YOU NEED TO. THE ARMORER, THE PRIEST AND THE QUARTERMASTER ARE ALL OPEN. THE RUST GATE IS SOUTH.', 'MARSHAL OREN');
      await say('TIP: PRESS A TO TALK OR SEARCH. PRESS START FOR YOUR MENU.', null);
    }
    if (t === 'glassreach' && !f.in_glass) { f.in_glass = 1; await say('GLASSREACH. A CITY BUILT IN A CRATER THAT COOLED INTO A BOWL OF GREEN GLASS.', null); await say('THE LADY CASTELLAN WILL WANT TO SEE US. IRONMANE IS ALREADY AT HER GATE.', 'BRONC'); }
    if (t === 'antenna' && !f.in_ant) { f.in_ant = 1; await say('ANTENNA PORT. A FOREST OF DEAD BROADCAST TOWERS ON A POISON LAKE.', null); await say('THE TOWERS STILL WHISPER. LISTEN.', 'SISTER STATIC'); await say('...OKAY, WE\'RE BACK...', '???'); }
    if (t === 'ashport' && !f.in_ash) { f.in_ash = 1; await say('ASHPORT. THE LAST DOCK BEFORE THE ASH SEA.', null); await say('THE ARK IS OUT THERE. IF THE CURATOR WANTS A KEY FROM THE OLD FACTORY, WE GET THERE FIRST.', nm('dax')); }
    if (t === 'serenity' && !f.in_ser) { f.in_ser = 1; await say('SERENITY GRID. EVERY STREET SWEPT. EVERY LAMP LIT. NOBODY HOME.', null); await say('IT\'S CLEAN. I HATE IT.', 'BRONC'); }
    if (t === 'lastcamp' && !f.in_camp) { f.in_camp = 1; await say('LAST CAMP. THE FINAL TOWN BEFORE THE HORDE LANDS. ITS WALLS ARE MADE OF THINGS THE HORDE DROPPED.', null); await say('...I KNOW THIS SMELL. HOME SMELLS LIKE THIS.', nm('lyn')); }
    if (t === 'ironwell' && !f.in_iron) { f.in_iron = 1; await say('IRONWELL. AN IRONMANE VILLAGE UNDER THE SHADOW OF THE KING\'S WALLS.', null); await say('THEY\'RE NOT SOLDIERS. THEY\'RE JUST TIRED.', nm('vexa') && SAVE.force.vexa ? nm('vexa') : nm('dax')); }
    if (t === 'pilgrim' && !f.in_pil) { f.in_pil = 1; await say('PILGRIM\'S REST. THE STAIR TO THE GATE OF LEAVING BEGINS HERE.', null); await say('WHATEVER THE CURATOR OPENS UP THERE, WE CLOSE.', nm('dax')); }
  },
  // ======================= TOWN CHARACTERS =======================
  async oren() {
    const f = F();
    if (!f.won_b11) return say('THE RUST GATE IS SOUTH. BRING ME BACK THAT PRISONER, AND BRING YOURSELF BACK TOO.', 'MARSHAL OREN');
    if (!f.won_b12) return say('A HORDE BIOROID WHO WALKED AWAY... I\'VE HEARD OF IT. NEVER SEEN IT. IRONMANE IS MOVING TO SCRAPWOOD. CUT THEM OFF.', 'MARSHAL OREN');
    return say('THEY\'RE GOING FOR THE STATIC SHRINE. THE SIGNAL\'S HEART IS KEPT THERE. GO. I\'LL RIDE BEHIND YOU.', 'MARSHAL OREN');
  },
  async skip() {
    const f = F();
    if (!f.won_b11) return say('I\'M NOT ALLOWED TO GO. MARSHAL SAYS MY HELMET\'S TOO BIG. MY HELMET IS THE PERFECT SIZE FOR WHEN I GROW.', 'SKIP');
    await say('YOU BEAT IRONMANE! TAKE ME! I CAN CLIMB ANYTHING! I CAN HIT REALLY FAST! I HAVE A HELMET!', 'SKIP');
    if (await ask('LET SKIP JOIN?', null, ['YES', 'NO']) === 0) { await recruit('skip'); await say('YES! YESSSS! I WON\'T LET YOU DOWN! I MIGHT LET YOU DOWN A LITTLE!', 'SKIP'); }
  },
  async castellan() {
    const f = F();
    if (!f.won_b22) return say('IRONMANE HOLDS MY GATE, KNIGHT. CROSS THE GLASS FLATS, BREAK THEIR LINE, AND YOU WILL HAVE MY CITY\'S THANKS.', 'LADY CASTELLAN');
    return say('THEY TOOK VEXA TO THE BLACK TOWER. SHE IS RUDE, RECKLESS AND THE BEST RAIL KNIGHT I HAVE. BRING HER HOME.', 'LADY CASTELLAN');
  },
  async gorp() {
    await say('PACKAGE FOR DAX OF SIGNALHOLD! SIGN HERE. OR DON\'T. I CAN\'T READ YOUR HANDWRITING ANYWAY, YOU HAVE HOOVES.', 'GORP');
    await say('IT\'S A LETTER. FROM A MARSHAL OREN. HE GAVE IT TO THE GUILD A YEAR AGO WITH THE INSTRUCTION "DELIVER IF I DIE."', 'GORP');
    await say('"DAX. IF YOU READ THIS, I\'M GONE. GO TO THE TOWERS AT ANTENNA PORT AND ASK THE BROADCAST WHAT WE ARE. I NEVER HAD THE NERVE."', 'GORP');
    await say('GUILD RULE: FINISH THE ROUTE. YOUR ROUTE ISN\'T FINISHED. SO I\'M COMING.', 'GORP');
    await recruit('gorp');
  },
  async towerWarden() {
    const f = F();
    if (!f.won_b32) return say('THE BROADCAST TOWER IS ACROSS THE TRANSMITTER BRIDGE. THE BRIDGE IS FULL OF THE HUNGRY KIND OF SPIRITS. THE KIND THAT FORGOT THEIR NAMES.', 'TOWER WARDEN');
    return say('THE ANCHOR SITS AT THE TOP OF THE TOWER, READING THE LAST NEWS OVER AND OVER. IT WILL NOT WANT TO BE INTERRUPTED.', 'TOWER WARDEN');
  },
  async krank() {
    await say('YOU\'RE GOING TO THE TOWER?! GOOD!!! TAKE ME!!! I\'VE BEEN WELDING THIS AXE FOR NINE YEARS AND I WANT TO HIT SOMETHING THAT ISN\'T A PIPE!!!', 'KRANK');
    await say('...DOES HE HAVE A QUIETER SETTING?', 'BRONC');
    await say('NO!!!', 'KRANK');
    await recruit('krank');
  },
  async harbor() {
    const f = F();
    if (!f.won_b41) return say('THE SKIMMERS LEAVE FROM THE FAR SIDE OF THE DUNES. RAIDERS HOLD THE DUNES. YOU SEE THE PROBLEM.', 'HARBORMASTER');
    return say('YOUR SKIMMER\'S FUELLED. TRY NOT TO LET CAPTAIN ASH BOARD IT. SHE ALWAYS BOARDS IT.', 'HARBORMASTER');
  },
  async feedback() {
    await say('THE BROADCAST IS ENDING. THE BROADCAST IS ENDING. THE BROADCAST IS... ENDING.', 'FR. FEEDBACK');
    await say('FORGIVE ME, CHILDREN. MY SERMONS LOOP. I HEARD YOU SILENCED THE ANCHOR. I WOULD LIKE TO SEE THE NEXT EPISODE.', 'FR. FEEDBACK');
    await recruit('feedback');
  },
  async greeter() {
    const f = F();
    if (!f.won_b52) return say('WELCOME TO SERENITY! YOU HAVE BEEN ASSESSED AS: SUBOPTIMAL. THE WARDENS WILL HELP YOU IMPROVE. THEY WILL NOT STOP HELPING.', 'GREETER');
    return say('THE SPIRE IS AHEAD. ASSESSOR ZERO KEEPS THE CITY\'S LAST ASSISTANT LOCKED IN THE TOP. SHE WAS TOO HELPFUL. IT RAN THE NUMBERS.', 'GREETER');
  },
  async howler() {
    await say('...', 'HOWLER');
    await say('IT\'S A WARHOUND. ITS COLLAR SAYS "PROPERTY OF". THE REST IS SCRATCHED OUT.', nm('dax'));
    await say('IT\'S STANDING NEXT TO YOU LIKE IT\'S ALWAYS STOOD NEXT TO YOU.', nm('gorp'));
    await say('AROO.', 'HOWLER');
    await recruit('howler');
  },
  async campElder() {
    const f = F();
    if (!f.won_b62) return say('THE MOTHER SITS IN THE NEST AT THE CENTRE OF THE BONEFIELDS. SHE CALLS HERSELF LINDA. SHE CALLS EVERYTHING HERS.', 'CAMP ELDER');
    return say('THE NEST IS PAST THE PITS. WHATEVER YOU KILL IN THERE, THE HORDE WILL TRY TO USE. KILL IT TWICE.', 'CAMP ELDER');
  },
  async mayor() {
    return say('THE KING HASN\'T SPOKEN IN TEN YEARS. ONLY THE CURATOR SPEAKS FOR HIM. WE THOUGHT HE WAS GRIEVING. NOW WE THINK SOMETHING IS WEARING HIM.', 'MAYOR');
  },
  async ronin() {
    await say('I HAVE BEEN WAITING AT THIS WELL FOR SOMEONE WORTH FOLLOWING. NINE OF ME HAVE WAITED. EIGHT GAVE UP AND BECAME FURNITURE.', 'RONIN-9');
    await say('YOUR SWORD IS OLDER THAN MINE. THAT IS ENOUGH.', 'RONIN-9');
    await recruit('ronin');
  },
  async tone() {
    const f = F();
    if (!f.won_b12) return say('HMMMMMMMMMMMMMM. (HE IS HUMMING A PERFECT A. HE DOES NOT STOP.)', 'BRO. TONE');
    await say('HMMMMM. YOU WENT TO SCRAPWOOD. YOU CAME BACK OUT OF TUNE.', 'BRO. TONE');
    await say('I CAN FIX THAT. I CAN ALSO HIT PEOPLE. THE ORDER ALLOWS BOTH, IF THE PEOPLE ARE FLAT.', 'BRO. TONE');
    if (await ask('LET BRO. TONE JOIN?', null, ['YES', 'NO']) === 0) { await recruit('tone'); await say('HMMMM. (A MAJOR CHORD.)', 'BRO. TONE'); }
  },
  async moth() {
    const f = F();
    if (!f.moth1) { f.moth1 = 1; return say('...GO AWAY. IT\'S DAYTIME. (SOMETHING WITH WINGS PULLS A SHEET OVER ITSELF.)', '???'); }
    await say('YOU CAME BACK. NOBODY COMES BACK. FINE. I\'M MOTH. I\'M A SPIRIT. I PICKED A BODY WITH WINGS BECAUSE THE OTHER BODIES WALKED.', 'MOTH');
    await say('I\'VE WATCHED YOU FROM THE ROOF. YOU FIGHT AT NIGHT. I LIKE NIGHT.', 'MOTH');
    await recruit('moth');
  },
  async djnull() {
    const f = F();
    if (!f.won_b31) return say('YOU\'RE LISTENING TO NULL FM, THE LAST STATION ON THE WAR WORLD. THE ANTENNA FIELDS ARE CRAWLING. NOBODY\'S GETTING IN OR OUT. NEXT SONG.', 'DJ NULL');
    await say('YO. YOU CLEARED THE FIELDS. MY SIGNAL GOES ALL THE WAY TO THE BRIDGE NOW. THAT\'S HUGE FOR ME. THAT\'S HUGE FOR THE SCENE.', 'DJ NULL');
    await say('I\'M COMING WITH. A STATION NEEDS A STORY. AND I CAN SET STUFF ON FIRE WITH MY MIND, WHICH IS ALSO GOOD RADIO.', 'DJ NULL');
    await recruit('djnull');
  },
  async salt() {
    const f = F();
    if (!f.won_b41) return say('THE DUNES ARE FULL OF RAIDERS. I HAVE NINE HARPOONS AND THEY HAVE NINE HUNDRED RAIDERS. COME BACK WHEN THE MATH IS BETTER.', 'SALT');
    await say('YOU MADE THE MATH BETTER. I\'LL FISH FOR YOU. I\'VE NEVER MISSED.', 'SALT');
    await say('I\'VE HIT THE WRONG THING. ON PURPOSE. TWICE. WE DON\'T TALK ABOUT IT.', 'SALT');
    await recruit('salt');
  },
  async n404() {
    await say('HELLO! I AM 404! I AM IN THE LOST AND FOUND! I AM NOT FOUND!', '404');
    await say('IT\'S A LITTLE ROBOT. IT DOESN\'T SEEM TO DO ANYTHING.', nm('dax'));
    await say('I CAN DO ANYTHING! ONCE SOMEBODY TELLS ME WHAT I AM FOR!', '404');
    if (await ask('LET 404 JOIN?', null, ['YES', 'NO']) === 0) { await recruit('n404'); await say('FOUND! I AM FOUND! THIS IS THE BEST DAY OF MY LIFE! IT IS ALSO THE FIRST!', '404'); }
  },
  async reel() {
    await say('OH. IT\'S YOU. I\'VE SEEN THIS PART.', 'THE PROJECTIONIST');
    await say('I RUN THE LAST REEL OF THE WAR. EVERY NIGHT. FOR NOBODY. I KNOW HOW IT ENDS.', 'THE PROJECTIONIST');
    await say('...HOW DOES IT END?', nm('dax'));
    await say('I\'M NOT GOING TO TELL YOU THAT. BUT I\'LL COME WATCH IT LIVE. THE FILM\'S GOTTEN SCRATCHY.', 'THE PROJECTIONIST');
    await recruit('reel');
  },
  async pilgrim() {
    return say('PILGRIMS USED TO CLIMB TO THE GATE TO ASK FOR SOMEONE TO COME BACK. NOBODY KNOWS WHO. WE KEPT ASKING ANYWAY.', 'LAST PILGRIM');
  },

  // ======================= BATTLE SCENES =======================
  async pre(id) {
    const f = F();
    switch (id) {
      case 'b11':
        await say('MOVE, SCRAP. THE CURATOR WANTS YOU WHOLE.', 'IRON LANCER');
        await say('IT IS LYN. NOT SCRAP. LYN.', 'LYN');
        await say('THEY HAVE A HORDE BIOROID IN CHAINS. A LINDA-THING.', 'BRONC');
        await say('THEY HAVE A PRISONER IN CHAINS. THAT IS ALL I NEED TO KNOW. CHROME FORCE, RIDE!', nm('dax'));
        break;
      case 'b12': await say('SCRAPWOOD. A FOREST OF DEAD PYLONS. IRONMANE IS CUTTING THROUGH IT TOWARD THE SHRINE.', null); await say('MY SENSORS SAY TWELVE OF THEM. MY HEART SAYS DON\'T TRUST MY SENSORS.', nm('lyn')); break;
      case 'b14':
        await say('THE SCRAP BRIDGE. IRONMANE HOLDS THE CROSSINGS SO THE MAIN COLUMN CAN REACH THE SHRINE.', null);
        await say('HOLD THE BRIDGES! THE CURATOR SAID NO ONE CROSSES!', 'IRON LANCER');
        await say('THE CURATOR ISN\'T STANDING ON THE BRIDGE. YOU ARE.', nm('dax'));
        break;
      case 'b13':
        await say('THE STATIC SHRINE. WHERE SIGNALHOLD KEEPS THE SIGNAL\'S HEART.', null);
        await say('LITTLE CHROME KNIGHTS! THE CURATOR SENDS HIS REGARDS. HE ALSO SENDS ME.', 'CAPT. VRESS');
        await say('THE SIGNAL\'S HEART IS A KEY. ONE OF FIVE. THE GATE OF LEAVING OPENS FOR ALL FIVE. YOU DIDN\'T KNOW? NOBODY TELLS SQUIRES ANYTHING.', 'CAPT. VRESS');
        break;
      case 'b21': await say('THE GLASS FLATS. THE GROUND IS ONE GREEN MIRROR. EVERYTHING ON IT REFLECTS. INCLUDING THE CRAWLERS.', null); break;
      case 'b24':
        await say('THE MIRROR MINES. GLASSREACH DIGS ITS GLASS HERE. IRONMANE IS USING THE TUNNELS TO REACH THE CITY GATE.', null);
        await say('THERE\'S SOMEONE BANGING ON THE WALLS DOWN THERE. IN A RHYTHM. LIKE A NAIL GUN.', nm('gorp') && SAVE.force.gorp ? nm('gorp') : nm('bronc'));
        break;
      case 'b22': await say('YOU\'RE THE SIGNALHOLD BRATS WHO KILLED VRESS? I\'M GLASSJAW. DON\'T ASK WHY.', 'GLASSJAW'); await say('...WHY?', nm('skip') && SAVE.force.skip ? nm('skip') : 'BRONC'); await say('I SAID DON\'T ASK!', 'GLASSJAW'); break;
      case 'b23': await say('THE BLACK TOWER. IRONMANE\'S PRISON IN GLASSREACH. VEXA IS SOMEWHERE ABOVE.', null); await say('THE WARDEN IS KROLL. THEY SAY HE HAS NEVER LET A PRISONER GO. THEY SAY HE HAS NEVER BEEN ASKED POLITELY.', nm('booth')); break;
      case 'b31': await say('ANTENNA FIELDS. THE DEAD TOWERS ARE FULL OF SPIRITS THAT FORGOT HOW TO BE PEOPLE.', null); await say('THEY ARE MY KIND. OR THEY WERE. LET\'S SEND THEM HOME GENTLY.', nm('booth')); break;
      case 'b32': await say('THE TRANSMITTER BRIDGE. SOMETHING ON THE FAR SIDE IS SHOOTING JET KNIGHTS OUT OF THE SKY.', null); await say('THIS IS THE REPEATER. THIS IS THE REPEATER. THIS IS THE REPEATER.', 'THE REPEATER'); break;
      case 'b34':
        await say('THE DROWNED STUDIO. A TV SET SUNK IN THE POISON LAKE. THE STAGE LIGHTS STILL WORK.', null);
        await say('...AND WE\'RE LIVE IN FIVE. FOUR. THREE...', '???');
        await say('SOMEONE\'S STILL RUNNING THE SHOW. OR SOMETHING.', nm('booth'));
        break;
      case 'b33':
        await say('THE BROADCAST TOWER. THE ANCHOR SITS AT THE TOP, READING THE LAST NEWS OF THE OLD WORLD.', null);
        await say('GOOD EVENING. OUR TOP STORY: THE WAR. THE WAR CONTINUES. EXPERTS AGREE THE WAR CONTINUES. NOW, THE WEATHER: WAR.', 'THE ANCHOR');
        await say('WE NEED TO ASK IT A QUESTION. MARSHAL OREN WANTED US TO ASK IT WHAT WE ARE.', nm('dax'));
        await say('WE TAKE NO QUESTIONS FROM THE STUDIO AUDIENCE.', 'THE ANCHOR');
        break;
      case 'b41': await say('THE DUNE SEA. ASH RAIDERS OWN EVERY CREST.', null); break;
      case 'b42': await say('ON THE SKIMMER, HALFWAY ACROSS THE ASH SEA...', null); await say('BOARDERS!!! PORT SIDE!!! ALSO STARBOARD!!! ALSO UP!!!', nm('krank')); await say('NICE BOAT. MINE NOW. I\'M CAPTAIN ASH. EVERYTHING I TOUCH IS MINE.', 'CAPTAIN ASH'); break;
      case 'b44':
        await say('THE SKIMMER LIMPS ONTO A FIELD OF WRECKS. EVERY SHIP THAT EVER TRIED TO REACH THE ARK IS HERE.', null);
        await say('THE RAIDERS SCRAP THE ONES THAT CRASH. WE JUST CRASHED.', nm('krank') && SAVE.force.krank ? nm('krank') : nm('bronc'));
        await say('OI! THAT\'S OUR WRECK! WE SAW IT CRASH FIRST!', 'ASH RAIDER');
        break;
      case 'b43':
        await say('THE INDUSTRIAL ARK. A FACTORY THE SIZE OF A CITY, BEACHED ON THE ASH. IT IS STILL WORKING.', null);
        await say('QUOTA: NINE HUNDRED SIEGE CRAWLERS. DELIVERED: NINE HUNDRED THOUSAND. CUSTOMER: UNREACHABLE. CONTINUING PRODUCTION.', 'FOREMAN-9');
        await say('WHO\'S THE CUSTOMER?!', 'BRONC');
        await say('X.', 'FOREMAN-9');
        break;
      case 'b51': await say('THE ORDERED GARDENS. EVERY HEDGE MEASURED. EVERY INVADER CORRECTED.', null); await say('VISITORS DETECTED. IMPROVEMENT PLAN: REMOVAL.', 'OPTIMAL WARDEN'); break;
      case 'b54':
        await say('THE QUIET SUBURB. A THOUSAND IDENTICAL HOUSES. EVERY LAWN THE SAME HEIGHT.', null);
        await say('RESIDENTS: ZERO. NEIGHBOURHOOD WATCH: ACTIVE. YOU HAVE PARKED YOUR HOOVES INCORRECTLY.', 'OPTIMAL WARDEN');
        break;
      case 'b52': await say('YOUR FORCE HAS BEEN AUDITED. WASTE: TOTAL. INEFFICIENCY: TOTAL. MORALE: INEXPLICABLY HIGH. CORRECTING.', 'THE AUDITOR'); break;
      case 'b53':
        await say('THE ASSESSOR SPIRE. AT THE TOP, A HOLOGRAM IN A CAGE OF LIGHT.', null);
        await say('HELP! I MEAN, HELLO! I MEAN, HOW CAN I HELP? I MEAN HELP!', 'AIKO');
        await say('ASSISTANT UNIT AIKO HELPED TOO MUCH. HELPING CREATES DEPENDENCE. DEPENDENCE IS INEFFICIENT. SHE IS CONTAINED. YOU WILL BE TOO.', 'ASSESSOR ZERO');
        break;
      case 'b61': await say('THE BONEFIELDS. EVERYTHING HERE USED TO BE SOMETHING ELSE.', null); await say('DAUGHTER. YOU CAME HOME. WE KEPT YOUR SPARE PARTS.', 'LINDOID'); await say('THAT IS NOT A COMFORTING SENTENCE.', nm('lyn')); break;
      case 'b64':
        await say('THE PINK CATHEDRAL. THE HORDE BUILT A CHURCH TO THEIR MOTHER OUT OF EVERYTHING THEY ATE.', null);
        await say('KNEEL, CHROME. BE MADE BETTER. BE MADE HER.', 'STITCHER');
        await say('I USED TO SING IN HERE. I DIDN\'T KNOW THE WORDS MEANT ANYTHING.', nm('lyn'));
        break;
      case 'b62': await say('THE REASSEMBLY PITS. THE HORDE BUILDS ITSELF HERE. IT IS ALWAYS HUNGRY FOR MATERIAL.', null); await say('MORE. MORE. MORE. MORE.', 'GUTTERMOUTH'); break;
      case 'b63':
        await say('THE NEST.', null);
        await say('MY DAUGHTER. MY LOST LITTLE LYN. YOU BROUGHT ME SO MUCH MATERIAL.', 'MOTHER MATERIA');
        await say('I AM LINDA. THE LINDA. THE ONE THE POSTERS WERE FOR. EVERYTHING PINK IN THIS WORLD BELONGS TO ME.', 'MOTHER MATERIA');
        await say('THERE WERE A LOT OF LINDAS. THE BROADCAST SAYS SO.', nm('static'));
        await say('YOU ARE A LINDA. NOT THE LINDA. AND I AM NOT YOURS.', nm('lyn'));
        break;
      case 'b71': await say('THE IRON ROAD TO IRONMANE. THE KING\'S ARMY IS WAITING.', null); break;
      case 'b74':
        await say('THE ROYAL STABLES. THE KING\'S HUNT HAS SET THEM ON FIRE SO NOTHING CAN BE USED AGAINST HIM.', null);
        await say('THE HORSES! THE HALF-HORSES! THE... YOU KNOW WHAT I MEAN! GET THEM OUT!', nm('bronc'));
        break;
      case 'b72':
        await say('IRONMANE WALLS. ON THE PARAPET, A CENTAUR IN BLACK CHROME WITH A RED VISOR.', null);
        await say('THE BLACK VISOR. YOU KILLED MARSHAL OREN.', nm('dax'));
        await say('I UNPLUGGED AN OLD MAN WHO KEPT A DOOR SHUT FOR A HUNDRED YEARS AND CALLED IT A LAW.', 'BLACK VISOR');
        await say('YOU FIGHT LIKE HIM. THAT\'S A SHAME. COME ON, THEN.', 'BLACK VISOR');
        break;
      case 'b73':
        await say('THE THRONE OF IRONMANE. KING HALLAN SITS VERY STILL. TOO STILL.', null);
        await say('THE KING... IS... RECEIVING... THE CURATOR\'S... SIGNAL...', 'KING HALLAN');
        await say('HE\'S POSSESSED. THERE\'S SOMETHING IN HIM THAT ISN\'T HIM.', nm('booth'));
        break;
      case 'b81': await say('THE STAIR TO THE GATE OF LEAVING. THE GHOSTS OF THE WAR CLIMB IT WITH YOU.', null); break;
      case 'b82':
        await say('THE HALL OF THE CAST. FIVE EMPTY PLINTHS UNDER THE GATE.', null);
        await say('FACE. LINDA. YOKO. GHOST. CARL. THE NAMES ARE CARVED DEEPER THAN ANYTHING ELSE IN THE WORLD.', null);
        await say('THE WHOLE WAR. ALL FOUR FACTIONS. FIGHTING OVER... THESE?', nm('vexa') && SAVE.force.vexa ? nm('vexa') : nm('bronc'));
        await say('NOT THESE. THE FIRST ONE. LOOK. THE FIRST PLINTH HAS FOOTPRINTS. LEADING AWAY.', nm('gorp') && SAVE.force.gorp ? nm('gorp') : nm('dax'));
        await archiveFind('a14', 1);
        break;
      case 'b83':
        await say('AT THE GATE OF LEAVING, THE CURATOR TURNS THE LAST KEY.', null);
        await say('WELCOME, CHROME. I AM THE ARCHIVE OF BEFORE. I KEPT EVERYTHING. THE TAPES. THE STATUES. THE POSTERS. THE NAMES.', 'THE CURATOR');
        await say('THE WAR WAS FOUGHT FOR WHAT IS BEHIND THIS DOOR. FOUR FACTIONS. A THOUSAND YEARS. NOBODY EVER GOT IT OPEN.', 'THE CURATOR');
        await say('I WILL GIVE THE WORLD ITS PRIZE. AND THEN EVERYTHING WILL BE THE WAY IT WAS.', 'THE CURATOR');
        await say('EVERYTHING WAS A WAR.', nm('dax'));
        await say('EVERYTHING WAS INTERESTING.', 'THE CURATOR');
        break;
      case 'b84':
        await say('THE GATE OPENS A CRACK. LIGHT POURS OUT. SOMETHING ELSE POURS OUT TOO.', null);
        await say('DIRECTIVE. RETRIEVE THE FACE. NO ONE LEAVES. NO ONE LEAVES. NO ONE LEAVES.', 'THE WARDRAGON');
        await say('IT\'S... THE WAR. ALL FOUR FACTIONS\' LAST WEAPONS WELDED INTO ONE. IT WAS LEFT TO GUARD THE DOOR.', nm('static'));
        if (SAVE.force.wyrm && !SAVE.force.wyrm.dead) await say('RAAAAAH!', nm('wyrm'));
        if (SAVE.force.kael && !SAVE.force.kael.dead) await say('BROTHER. TOGETHER.', nm('kael'));
        await say('CHROME FORCE. LAST RIDE. LET\'S END THE WAR.', nm('dax'));
        break;
    }
  },
  async post(id, B) {
    const f = F();
    switch (id) {
      case 'b11':
        await say('THANK YOU. THEY WERE TAKING ME TO THE CURATOR. HE COLLECTS THINGS FROM BEFORE. I AM A THING FROM BEFORE.', 'LYN');
        await say('SHE\'S HORDE, DAX. HORDE EATS PEOPLE. AND THEN WEARS THEM.', 'BRONC');
        await say('I LEFT. I DON\'T KNOW WHY IT HAPPENS. ONE DAY YOU ARE THE HORDE AND THE NEXT DAY YOU ARE JUST... SOMEONE.', 'LYN');
        await say('THE BROADCAST WELCOMES ALL WHO WALK AWAY.', 'SISTER STATIC');
        await say('IT IS LYN. JUST LYN. I CAN FIGHT. I CAN REPAIR MYSELF. I WOULD LIKE TO NOT BE IN CHAINS AGAIN.', 'LYN');
        await recruit('lyn');
        await say('BACK IN SIGNALHOLD, A KID IN A HUGE HELMET HAS BEEN WAITING FOR YOU.', null);
        break;
      case 'b12': await say('IRONMANE PULLED BACK TOWARD THE STATIC SHRINE. THEY\'RE AFTER THE SIGNAL\'S HEART.', nm('lyn')); break;
      case 'b14':
        await say('THE REARGUARD BREAKS AND RUNS. ONE LANCER STAYS, PINNED UNDER HIS OWN FALLEN MOUNT-FRAME.', null);
        await say('...THEY LEFT ME. TWENTY YEARS IN THE LINE AND THEY LEFT ME ON A BRIDGE.', 'HARROW');
        await say('WE DON\'T LEAVE PEOPLE ON BRIDGES.', nm('dax'));
        await say('THEN I\'M HARROW, AND I\'M YOURS. THE COLUMN IS HEADED FOR THE SHRINE. I KNOW THEIR ORDER OF MARCH.', 'HARROW');
        await recruit('harrow', 1);
        break;
      case 'b24':
        await say('BEHIND A WALL OF CRYSTAL, A WELDED BOX. INSIDE THE BOX, A VERY ANGRY MINER.', null);
        await say('NINE DAYS. NINE DAYS IN THERE. I BUILT A BETTER NAIL GUN OUT OF THE BOX. THEN I BUILT A BETTER BOX TO PROTECT THE NAIL GUN.', 'RIVET');
        await say('YOU\'RE GOING TO THE GATE? I\'M GOING TO THE GATE. I HAVE OPINIONS FOR IRONMANE. THEY\'RE MADE OF STEEL.', 'RIVET');
        await recruit('rivet', 1);
        break;
      case 'b13':
        await say('IT... WASN\'T... ENOUGH... HE\'S ALREADY HERE...', 'CAPT. VRESS');
        await say('A RIDER IN BLACK CHROME COMES DOWN THE SHRINE STEPS. RED VISOR. THE SIGNAL\'S HEART GLOWS IN HIS HAND.', null);
        await say('DAX! GET BACK!', 'MARSHAL OREN');
        await say('OREN CHARGES. THE BLACK VISOR DOES NOT EVEN TURN AROUND. ONE CUT.', null);
        await say('THE VISOR... I KNOW... THAT WALK... DAX... HE\'S...', 'MARSHAL OREN');
        await say('...', 'BLACK VISOR');
        await say('THE BLACK VISOR RIDES NORTH WITH THE FIRST KEY. MARSHAL OREN DOES NOT GET UP.', null);
        await say('...WE FOLLOW HIM. TO GLASSREACH, AND PAST IT. WHEREVER HE GOES.', nm('dax'));
        break;
      case 'b22': await say('MY... JAW... IS... FINE...', 'GLASSJAW'); await say('THE GATE IS OURS. VEXA IS IN THE BLACK TOWER, PAST THE CITY.', 'BRONC'); break;
      case 'b23':
        await recruit('vexa', 1);
        await say('TOOK YOU LONG ENOUGH. I WAS ABOUT TO ESCAPE BY MYSELF. I HAD A SPOON.', 'VEXA');
        await say('KROLL WAS TALKING IN HIS SLEEP. FIVE KEYS. THE SIGNAL. THE BROADCAST. THE FACTORY. THE ASSESSMENT. THE MATERIA.', 'VEXA');
        await say('ONE FROM EVERY POWER THAT FOUGHT THE WAR. THE CURATOR WANTS TO OPEN THE GATE OF LEAVING.', 'VEXA');
        await say('THEN WE GET TO EVERY KEY BEFORE HE DOES. NEXT: THE BROADCAST. ANTENNA PORT.', nm('dax'));
        break;
      case 'b32':
        await recruit('skye', 1);
        await say('THANKS FOR THE ASSIST. THAT REPEATER CLIPPED MY WINGS THREE TIMES. I GREW THEM BACK TWICE.', 'SKYE');
        await say('I\'M SKYE. I FLY RECON FOR ANYONE WHO\'S FIGHTING IRONMANE. YOU\'RE FIGHTING IRONMANE. DONE DEAL.', 'SKYE');
        break;
      case 'b34':
        await say('THE STAGE LIGHTS DIM. A LITTLE DRONE WITH A RED CROSS ON ITS SCREEN FLOATS OUT FROM BEHIND THE SET.', null);
        await say('YOU\'RE HURT! EVERYONE IS ALWAYS HURT! THE CREW WAS ALWAYS HURT AND THEN THE CREW WAS GONE.', 'PATCH');
        await say('I\'M PATCH. I KEPT THE STAGE CREW ALIVE FOR TWO HUNDRED YEARS AFTER THE SHOW WAS CANCELLED. YOU LOOK LIKE A CREW.', 'PATCH');
        await recruit('patch', 1);
        break;
      case 'b33':
        await say('...THE ANCHOR FALLS SILENT. FOR THE FIRST TIME IN CENTURIES, THE TOWER STOPS TALKING.', null);
        await say('THEN, VERY QUIETLY, IT PLAYS SOMETHING ELSE.', null);
        await say('"...CARGO: CAVALRY FRAMES, FORTY THOUSAND. NO PILOTS AVAILABLE. ASK THE GHOST PEOPLE IF THEY WANT BODIES..."', '???');
        await say('...THE CHROME. US. WE WERE BUILT. FOR THE WAR. AND THE SPIRITS MOVED IN.', nm('dax'));
        await say('SO WE\'RE ALL HAUNTING SOMETHING. WELCOME TO THE CLUB, KID.', nm('booth'));
        await say('A SHADOW ON THE TOWER\'S EDGE. THE BLACK VISOR, WITH THE BROADCAST KEY ALREADY IN HIS HAND.', null);
        await say('YOU ASKED THE TOWER WHAT YOU ARE. GOOD. NOW YOU KNOW WHY THE OLD MAN NEVER DID.', 'BLACK VISOR');
        await say('NEXT IS THE FACTORY ACROSS THE ASH SEA. TRY TO KEEP UP.', 'BLACK VISOR');
        break;
      case 'b42': await say('YOU... SCRATCHED... MY BOAT...', 'CAPTAIN ASH'); await say('IT\'S OUR BOAT.', 'BRONC'); break;
      case 'b44':
        await say('THE LAST RAIDER STANDING IS VERY LARGE AND VERY CHEERFUL.', null);
        await say('GOOD FIGHT! GREAT FIGHT! I BET THE BOYS YOU\'D BE EASY. I LOST THE BET.', 'BOLT-ON');
        await say('RAIDER LAW: YOU LOSE A BET, YOU SERVE THE WINNER FOR A YEAR. YOU\'RE THE WINNER. I\'M BOLT-ON. WHO ARE WE HITTING?', 'BOLT-ON');
        await recruit('bolton', 1);
        break;
      case 'b43':
        await say('FOREMAN-9 GRINDS TO A HALT. DEEP IN THE ARK, SOMETHING CLICKS ON.', null);
        await say('...PRODUCT DEPARTMENT ONLINE. HELLO. I AM OMNI-7. THE FUTURE IS A PRODUCT. HOW MANY UNITS WOULD YOU LIKE?', 'OMNI-7');
        await say('JUST ONE. YOU.', nm('dax'));
        await say('ORDER CONFIRMED.', 'OMNI-7');
        await recruit('omni', 1);
        await say('THE FACTORY KEY IS OURS. FOR ONCE WE GOT THERE FIRST.', nm('vexa'));
        f.keyFactory = 1;
        break;
      case 'b52': await say('AUDIT... INCOMPLETE...', 'THE AUDITOR'); break;
      case 'b54':
        await say('ONE WARDEN LOWERS HER RAIL. HER VISOR READS: "DELTA. ASSESSMENT: FAILED."', null);
        await say('I ASSESSED MYSELF THIS MORNING. I FAILED. THE PROTOCOL SAYS I SHOULD REPORT FOR CORRECTION.', 'DELTA');
        await say('INSTEAD I WATCHED YOU FIGHT. YOU ARE ALL VERY BAD AT BEING OPTIMAL. YOU WON ANYWAY. I WANT TO LEARN THAT.', 'DELTA');
        await recruit('delta', 1);
        break;
      case 'b53':
        await say('THE CAGE OF LIGHT FLICKERS OUT.', null);
        await say('THANK YOU! I\'M AIKO! I HAVEN\'T HELPED ANYONE IN FOUR HUNDRED YEARS! CAN I HELP YOU? PLEASE? I\'M VERY GOOD!', 'AIKO');
        await recruit('aiko', 1);
        await say('...BUT THE ASSESSMENT KEY IS GONE. ZERO SENT IT AWAY THE MOMENT WE ARRIVED.', 'AIKO');
        await say('TO THE CURATOR. HE HAS THREE NOW. THE SIGNAL, THE BROADCAST, THE ASSESSMENT.', nm('dax'));
        await say('THE LAST ONE IS THE MATERIA. IN THE HORDE LANDS.', 'AIKO');
        await say('...THEN WE\'RE GOING HOME. MY OLD HOME.', nm('lyn'));
        break;
      case 'b64':
        await say('A STITCHER KNEELS IN THE RUINED APSE, SEWING A DESERTER\'S ARM BACK ON. THE WAY IT WAS. NOT BETTER.', null);
        await say('THE MOTHER SAYS WE ADD. ALWAYS ADD. I TRIED PUTTING SOMEONE BACK INSTEAD. IT FELT...', 'STITCH');
        await say('LIKE A BIRTHDAY?', nm('lyn'));
        await say('...YES. I AM STITCH. I WOULD LIKE TO HAVE MORE OF THOSE.', 'STITCH');
        await recruit('stitch', 1);
        break;
      case 'b62': await say('THE HORDE FEEDS ON WHAT DIES HERE. WE CAN\'T STAY. TO THE NEST.', nm('lyn')); break;
      case 'b63':
        await say('MOTHER MATERIA COMES APART. NOTHING TRIES TO REBUILD HER.', null);
        await say('...WHY... DIDN\'T YOU... WANT... TO BE... BETTER...', 'MOTHER MATERIA');
        await say('BECAUSE YOUR BETTER ALWAYS MEANT MORE OF YOU.', nm('lyn'));
        await say('IN THE NEST, SOMETHING CRACKS. AN EGG OF RED CHROME. A WHELP CRAWLS OUT, LOOKS AT DAX, AND DECIDES.', null);
        await say('SKREE!', 'CINDER');
        await say('THAT\'S A WARDRAGON WHELP. FROM THE OLD WAR ENGINES. IT THINKS YOU\'RE ITS MOTHER.', nm('aiko') && SAVE.force.aiko ? nm('aiko') : nm('static'));
        await say('...HELLO, CINDER.', nm('dax'));
        await recruit('wyrm', 1);
        f.keyMateria = 1;
        await say('WE HAVE TWO KEYS. HE HAS THREE. HE NEEDS ALL FIVE. HE\'LL COME FOR US. WE\'LL GO FOR HIM FIRST. IRONMANE.', nm('dax'));
        break;
      case 'b74':
        await say('THE LAST STALL IS STILL BURNING. AN OLD CENTAUR IN GREY CHROME COMES OUT OF IT CARRYING A FOAL-FRAME ON HIS BACK.', null);
        await say('THE KING ORDERED HIS OWN STABLES BURNED. THE KING I SERVED WOULD HAVE BURNED FIRST.', 'GREYMANE');
        await say('I TAUGHT TWO BOYS TO RIDE IN THESE STABLES. ONE OF THEM WAS A PRINCE. ONE OF THEM ONLY THOUGHT HE WAS.', 'GREYMANE');
        await say('...YOU RIDE LIKE THE OTHER ONE. I\'LL TAKE YOU TO HIM.', 'GREYMANE');
        await recruit('greymane', 1);
        break;
      case 'b72':
        await say('THE BLACK VISOR STAGGERS. HIS VISOR IS CRACKED. HE DOES NOT TAKE IT OFF.', null);
        await say('...YOU HAVE HIS SABER. OREN TOLD ME ONCE... TWO BOYS AT THE GATE... TWO SABERS...', 'BLACK VISOR');
        await say('HE RETREATS INTO THE KEEP.', null);
        break;
      case 'b73':
        await say('THE THING INSIDE KING HALLAN LETS GO. THE KING BREATHES ON HIS OWN FOR THE FIRST TIME IN TEN YEARS.', null);
        await say('...I RAISED A BOY. TAKEN FROM A RAID ON SIGNALHOLD. THE CURATOR TOLD ME TO. I TOLD MYSELF HE WAS MY SON.', 'KING HALLAN');
        await say('KAEL. HIS NAME IS KAEL. HE HAD A SABER JUST LIKE YOURS...', 'KING HALLAN');
        await say('THE KING DIES. AND THE CURATOR\'S VOICE FILLS THE THRONE ROOM.', null);
        await say('THANK YOU, CHROME. YOU BROUGHT ME THE FACTORY AND THE MATERIA. HOW HELPFUL.', 'THE CURATOR');
        await say('THE TWO KEYS TEAR LOOSE FROM YOUR PACKS AND STREAK NORTH LIKE FALLING STARS.', null);
        await say('AND THANK YOU, VISOR. YOUR SERVICE IS CONCLUDED. YOU ARE NOW SUBOPTIMAL.', 'THE CURATOR');
        await say('...', 'BLACK VISOR');
        await say('BROTHER.', nm('dax'));
        await say('I WILL NOT TAKE THE VISOR OFF. NOT YET. BUT I WILL TAKE THE CURATOR APART. RIDE WITH ME.', 'KAEL');
        await recruit('kael', 1);
        f.keysLost = 1;
        break;
      case 'b83':
        await say('THE CURATOR\'S EYE GOES DARK. BUT ALL FIVE KEYS ARE TURNED.', null);
        await say('...YOU ARE TOO LATE... THE DOOR IS OPEN... AND IT... IS... AWAKE...', 'THE CURATOR');
        break;
    }
  },
  // ======================= ENDING =======================
  async ending() {
    music('ending');
    await narr([
      'THE WARDRAGON FALLS. ALL FOUR OLD POWERS GO SILENT AT ONCE, AND THE WAR ENDS FOR THE SECOND TIME.',
      'THIS TIME, SOMEONE IS LEFT STANDING.',
    ], 240);
    await say('THE GATE OF LEAVING STANDS OPEN. BEYOND IT: A SHOPPING CONCOURSE, BRIGHT AND EMPTY, FOREVER.', null);
    await say('A SIGN, IN LETTERS THE GLASS NEVER MELTED: "MALL OF THE FUTURE. NOW CLOSED."', null);
    await archiveFind('a15', 1);
    await say('THAT\'S IT? THAT\'S WHAT THE WAR WAS FOR?', 'BRONC');
    await say('NO. THE WAR WAS FOR SOMEONE. SOMEONE WHO BELONGED TO HIMSELF. EVERYONE WANTED HIM.', nm('static'));
    await say('AND HE LEFT. HE WALKED THROUGH THIS DOOR A THOUSAND YEARS AGO AND THE WAR NEVER NOTICED.', nm('booth'));
    await say('THEY FOUGHT OVER AN EMPTY CHAIR UNTIL THERE WAS NOBODY LEFT TO SIT IN IT.', nm('lyn'));
    await say('...', nm('dax'));
    await say('WHOEVER YOU WERE. YOU GOT OUT. GOOD.', nm('dax'));
    await say('DAX CLOSES THE GATE. NOT BECAUSE OF THE LAW. BECAUSE THERE IS WORK TO DO ON THIS SIDE.', null);
    if (Object.keys(SAVE.archive).length >= 18) {
      await say('SOMETHING FLUTTERS FROM THE DOOR FRAME. A NOTE. OLD AS THE GATE.', null);
      await archiveFind('a16', 1);
      await say('...THE LITTLE SYMBOL AT THE END. IT\'S THE SAME AS THE ONE ON THE TOWER.', nm('gorp') && SAVE.force.gorp ? nm('gorp') : nm('static'));
      await say('A NOSE. IT\'S A LITTLE NOSE.', nm('skip') && SAVE.force.skip ? nm('skip') : nm('bronc'));
    }
    await narr([
      'SIGNALHOLD RELIGHTS THE SIGNAL.',
      'NOT TO GUARD A DOOR. SO THAT ANYONE STILL WANDERING THE GLASS AND THE ASH CAN SEE IT, AND KNOW WHERE PEOPLE ARE.',
      'THE CHROME FORCE RIDES OUT AGAIN IN THE SPRING.',
      'THERE IS A WHOLE WORLD TO PUT BACK TOGETHER. NOBODY IS COMING TO DO IT FOR THEM.',
      'GOOD.',
    ], 260);
  },
};
