'use strict';
// ================= NEO MONDAY — more fights for case 1, and CASE 2: THE STATIC =================
// A pirate station called JB GARFIELD FM is looping the city's Monday with JB's own voice. JB has to find the people
// walking out of their beds, the tape, the money, and then say something true into a microphone.
CAST.ODELL = { col: hex('#ffc8a0'), voice: [420, 20] }; CAST.FUSE = { col: hex('#c8f06a'), voice: [380, 40] }; CAST.SUNDAY = { col: hex('#ffb840'), voice: [130, 12] };
CAST.DJ = { col: hex('#ff7ae0'), voice: [600, 400] }; CAST.OCHOA = { col: hex('#a8b8d8'), voice: [320, 20] };
const DJ_NAME = 'DJ STATIC';
CAST[DJ_NAME] = CAST.DJ; PORTS[DJ_NAME] = PORTS.DJ;
Object.assign(ITEMS, {
  RADIO: ['RADIO', 'Raymond Odell\'s little transistor radio. Tuned to 88.1. When I switch it on, it plays static. Then a voice that sounds like a cat doing a very good impression of a cat.'],
  CAN: ['POWDER CAN', 'A can of SUNDAY\'S LASAGNA POWDER: JUST ADD MONDAY. Inside the lid there is a chip the size of a lentil. It is humming at 88.1.'],
  TAPE: ['MASTER TAPE', 'A reel of tape labeled in a hand I almost know: FOR THE SLEEPLESS. The label is old. The tape is much older than the station.'],
});

// ---------- more fights for case 1 ----------
const MORGUE_FIGHT = {
  scene: 'morgue', music: 'combat', slots: [{ x: 90, y: 172, cover: [0, 150, 512, 26] }, { x: 256, y: 172, cover: [0, 150, 512, 26] }, { x: 430, y: 172, cover: [0, 150, 512, 26] }, { x: 256, y: 62, r: 170 }],
  waves: [{ t: 40, slot: 3, kind: 'drone', aim: 95 }, { t: 110, slot: 0, aim: 85 }, { t: 170, slot: 3, kind: 'drone', aim: 90 }, { t: 240, slot: 2, aim: 80 }, { t: 290, slot: 1, hp: 3, aim: 75 }],
};
async function morgueAmbush() {
  if (F('ambushM')) return; setF('ambushM');
  await N('The lamp over the table dimmed. Somewhere behind drawer eleven something that wasn\'t a person said my name the way a bill says it.');
  await say('Shut the drawers, Doctor. We\'re here for the cat.', 'COPYCAT'); await say('Garfield! Down! Behind the table!', 'MIRA', { mood: 'grim' });
  await K_('DRONES! AND SOME OF THE LARGE KIND! Aim with the arrows. A fires!', 'err'); await J('A morgue. They\'re shooting up a morgue. Show some respect.', 'wide');
  await fight(MORGUE_FIGHT); music('morgue');
  await say('That\'s three drawers I\'ll have to explain to Facilities.', 'MIRA'); await J('Put it on my tab. The one that\'s on a chalkboard.', 'smug');
}
const BAR_FIGHT = {
  scene: 'bar', music: 'combat', slots: [{ x: 256, y: 178 }, { x: 110, y: 178 }, { x: 410, y: 178 }, { x: 256, y: 46, r: 160 }],
  waves: [{ t: 30, slot: 0, kind: 'brute', hp: 6, aim: 130 }, { t: 100, slot: 3, kind: 'drone', aim: 90 }, { t: 170, slot: 1, aim: 80 }, { t: 220, slot: 2, aim: 80 }],
};
async function barAmbush() {
  if (F('ambushB')) return; setF('ambushB');
  await N('Glass doesn\'t break that way for a customer. The front window came in like a verdict and something large came in after it.');
  await say('Detective. The Chief would like you to stop reading things.', 'COPYCAT'); await say('I\'m calling the Chief. Get behind the counter, Garfield.', 'LUCKY');
  await K_('A LARGE ONE! IT IS WEARING PLATING! Keep aiming at the head!', 'err'); await J('It has a lot of head. That helps.', 'dead');
  await fight(BAR_FIGHT); music('bar'); await say('That was a week of tips. I\'m going to need you to stop being so popular.', 'LUCKY'); await J('I\'ve got a hat. It does most of it.', 'smug');
}

// ---------- CASE 2 : THE STATIC ----------
async function newCase2() {
  S = newState(); S.case = 2; S.scene = 'office2'; DLG = null;
  await diskCard('A');
  await showCard(['CASE 02', 'THE STATIC', '', 'It is still Monday.', 'Somebody is making sure of it.'], 0, { col: hex('#c868ff') });
  await fadeOut(.5); await setStage('office2', true); post.fade = 1; await fadeIn(.03);
  await SC.office2.enter(); await hub();
}
function recap2() {
  const known = [], odd = []; const h = hasClue;
  if (F('c2odell')) known.push('Edna Odell\'s husband Raymond, a retired bus driver, walked out asleep after listening to a pirate station every night.');
  if (h('voice')) { known.push('The station is called JB GARFIELD FM. The voice on it matches mine at 99.8 percent.'); odd.push('I have a radio show I have never made.'); }
  if (h('sponsorTag')) known.push('The radio is stamped with a sponsor: SUNDAY\'S POWDER CO.');
  if (h('relay')) known.push('The street speakers repeat the station. The whole city is a receiver.');
  if (F('raymond')) known.push('Raymond is in the powder warehouse, asleep, stacking cans. He answers everything with "It is Monday."');
  if (h('can')) known.push('Every can of powder holds a chip tuned to 88.1.');
  if (F('arrested')) known.push('The desk sergeant had the same smile as the foreman. The police are not all police.');
  if (h('tower')) known.push('The station\'s transmitter is on a roof above its own studio.');
  if (h('lullaby')) { known.push('The tape: Harold recorded a bedtime story for sleepless detectives. Somebody turned it into a loop.'); odd.push('A kindness, run on repeat for nine years, stops being a kindness.'); }
  if (h('sponsor')) known.push('The contract that pays for the station is signed by MR. SUNDAY.');
  let next;
  if (!F('c2odell')) next = 'Hear the client out.'; else if (!h('voice')) next = 'Switch on the radio.'; else if (!F('raymond')) next = 'The radio was stamped for a warehouse on Dock Street.';
  else if (!F('arrested')) next = 'Look at the cans before anyone arrives.'; else if (!F('jailbreak')) next = 'Get out of the cell. The man in it knows the radio.'; else if (!F('studioFight')) next = 'The studio sits under the tower. Go see who is on the air.';
  else if (!F('c2knows')) next = 'Open the safe, play the tape, read the contract.'; else next = 'The roof. Say something true.';
  return { known, odd, next };
}

SC.office2 = {
  name: 'LITTER HQ: MY DESK', art: 'office', music: 'office',
  async enter() {
    if (F('c2odell')) return; setF('c2odell');
    await N('Case two began the way they all do: with somebody sitting down in the good chair and apologizing for bothering me.');
    await say('Detective Garfield? I\'m Edna Odell. It\'s about my husband. Raymond.', 'ODELL', { mood: 'worry' }); await J('Go on, Mrs. Odell.', 'dead');
    await say('He\'s been listening to the radio. A station called JB GARFIELD FM. All static, and a voice, and he falls asleep with it on.', 'ODELL'); await J('A station called what.', 'wide');
    await K_('You have a radio program. It is in your file under HOBBIES.', 'happy'); await J('I have a radio program.', 'dead'); await K_('It has been on air for nine years, three days after you were frozen.', 'scan'); await J('Coincidence is a word. I\'m not enjoying it.', 'think');
    await say('Three nights ago he got up out of bed with his eyes closed and walked out of the house. In his slippers. He has not come back. It\'s been three Mondays.', 'ODELL'); await say('I thought, who do you call when it\'s a cat on the radio? You call the cat.', 'ODELL');
    sfx('get'); give('RADIO'); await say('That\'s his radio. It was on the pillow.', 'ODELL');
    await J('We\'ll find him, Mrs. Odell.', 'smug'); await say('Thank you. I\'ll be at the kitchen window. The light stays on.', 'ODELL'); await N('She left the way people leave when they do not want to cry in front of a cat. I respected it. I looked at the radio.');
  },
  async look() { await N(nth('o2_look', ['My own office, back to normal: window, lamp, desk, nameplate. The good chair still has the shape of a worried person in it.', 'The window shows the neon, and above the skyline, a red light blinking on top of a tall black tower I do not remember noticing before.'])); },
  inv: [
    { name: 'THE RADIO', fn: async () => {
      if (!F('radioOn')) { setF('radioOn'); await N('I thumbed the dial to 88.1. Static, like frying. Then, under it, a voice I knew like a tooth.'); sfx('glitch'); await say('Good evening, Neo Monday. It is Monday. You can rest now.', 'JB', { mood: 'closed' });
        await J('That\'s me.', 'wide'); await K_('Voice match: 99.8 percent. It is you. Or an extremely patient impression.', 'scan'); await J('I never said that. I\'d remember. I remember almost nothing, and I\'d still remember that.', 'hurt'); clue('voice', 'The station\'s voice matches mine at 99.8 percent. I never said those words.'); await N('I turned the radio over in my hands. There was more on it than a voice.'); }
      else if (!hasClue('sponsorTag')) { await N('A stamp on the back of the radio, under the dust: SUNDAY\'S POWDER CO. - DOCK ST.'); clue('sponsorTag', 'The radio carries a stamp: SUNDAY\'S POWDER CO., DOCK ST.'); await J('Another Sunday\'s. This city has a lasagna problem.', 'dead'); }
      else await N('88.1. A voice telling me it is Monday. I turned it off. I turned it off faster than I turned it on.');
    } },
    { name: 'RAYMOND\'S PHOTO', fn: async () => { await N(nth('o2_photo', ['A photo Mrs. Odell left on the desk: a man in a bus driver\'s cap, grinning on the steps of a number 9. He has the smile of a man who\'s never been late and doesn\'t want you to find out how.', 'On the back: RAYMOND. HE HUMS WHEN HE DRIVES. Somebody underlined HUMS.'])); } },
    { name: 'THE WINDOW', fn: async () => { await N('A red light blinking above the skyline, on a tall black tower. Every four seconds.'); await K_('That is the Sundial Tower. It carries every broadcast in the district.', 'scan'); clue('tower', 'The Sundial Tower carries every broadcast in the district. A red light blinks on top.'); await J('Everything with a transmitter has a guy. Let\'s find the guy.', 'smug'); } },
    { name: 'DESK PLAQUE', fn: async () => { await N('Under the dust on my desk, a small plaque I hadn\'t looked at: JB GARFIELD FM. #1 IN STATIC.'); await J('Nobody told me I was number one. Nobody tells me anything.', 'dead'); } },
  ],
  ask: [
    { name: 'KUMA: THE STATION', fn: async () => { await K_(nth('o2_k', ['JB GARFIELD FM. Frequency 88.1. Format: ambient. Sponsor: SUNDAY\'S POWDER CO. Listeners: unknown. Complaints: zero. That is unusual for ambient.', 'There are no complaints because everyone who would file one is asleep. It is a perfect record.'])); } },
    { name: 'PHONE MRS. ODELL', if: () => F('phone') || true, fn: async () => { await say('Edna Odell. Is it Raymond? Please say it\'s Raymond.', 'ODELL'); await J('Not yet. I wanted to hear your voice. I\'ll call when I have something.', 'dead'); } },
  ],
  move: [['OUT TO THE STREET', 'street2']],
};

SC.street2 = {
  name: 'NEO MONDAY: DOCK DISTRICT', art: 'street', music: 'street',
  async enter() {
    if (!F('s2')) { setF('s2'); await N('Same rain. Different problem.'); await K_('Viewer suggestion: "follow the humming". I do not understand the suggestion. I am not going to ask.', 'happy'); await J('Listen.', 'think'); await N('Under the rain, from the lamp posts, from the doorways, from a thousand speakers nobody had ever noticed: a hum. Four notes. Over and over. 88.1.'); }
  },
  async look() { await N(nth('s2_look', ['The district runs downhill toward the water. Warehouses, blue light, wet iron. Every lamp post has a gray cone speaker bolted under the lamp, humming one soft note like a lullaby that\'s been left out in the rain.', 'Over everything, a red light blinking on the Sundial Tower.'])); },
  inv: [
    { name: 'LAMP POST SPEAKER', fn: async () => { await N('A cone speaker under the lamp. Stenciled on the bracket: SUNDAY\'S UTILITY. It hums four notes and, if you stand close, a voice underneath: "...can rest now..."'); clue('relay', 'The street speakers relay the station. The whole district is listening.'); await J('The city\'s lamp posts are the radio\'s ears. Subtle. They get a gold star for subtle.', 'smug'); } },
    { name: 'BILLBOARD', fn: async () => { await N('A billboard over the water: SUNDAY\'S LASAGNA POWDER. JUST ADD MONDAY. A cartoon pan smiles at me, a happy pan. I\'m not one to take a pan at face value.'); await J('A powder you add Monday to. I\'ll admit I\'m curious, and I\'ll admit that\'s the problem.', 'dead'); } },
  ],
  ask: [{ name: 'KUMA: WHERE NEXT', fn: async () => { await K_(nth('s2_k', ['Dock Street is on the stamp. The Sundial Tower is on the skyline. The Litter office is behind you. Viewers say warehouse first.', 'The warehouse is down the hill. Please be careful. I do not have a plan for carrying a cat.'])); } }],
  move: [['POWDER WAREHOUSE', 'warehouse', async () => { if (!hasClue('sponsorTag')) { await J('I want a reason to go in. A stamp, a name, something to say to the door.', 'dead'); return false; } return true; }],
    ['THE STUDIO (9TH + STATIC)', 'studio', async () => { if (!F('jailbreak')) { await J('I don\'t have an address for the studio yet. The man who does is not in the neighborhood.', 'dead'); return false; } return true; }],
    ['BACK TO MY DESK', 'office2']],
};

// ----- warehouse -----
const WAREHOUSE_FIGHT = {
  scene: 'warehouse', music: 'combat', slots: [{ x: 110, y: 168, cover: [40, 140, 150, 36] }, { x: 400, y: 168, cover: [330, 140, 150, 36] }, { x: 256, y: 56, r: 180 }, { x: 256, y: 78, r: 110 }],
  waves: [{ t: 40, slot: 2, kind: 'drone', aim: 95 }, { t: 100, slot: 0, aim: 85 }, { t: 150, slot: 3, kind: 'drone', aim: 85 }, { t: 220, slot: 1, aim: 80 }, { t: 280, slot: 2, kind: 'drone', aim: 75 }, { t: 320, slot: 0, hp: 3, aim: 70 }],
};
SC.warehouse = {
  name: 'SUNDAY\'S POWDER CO.: WAREHOUSE', art: 'warehouse', music: 'plant',
  async enter() {
    if (F('raymond')) return; setF('raymond');
    await N('The warehouse smelled like a pantry that had given up. Racks of yellow cans to the ceiling, each one stamped JUST ADD MONDAY, and down the middle aisle, a line of people carrying crates with their eyes shut.');
    await K_('They are asleep. They are walking. They are all humming the same four notes.', 'scan'); await N('At the end of the line: a man in a bus driver\'s cap, a number 9 pin on the collar, grinning softly at nothing.');
    await J('Raymond Odell?', 'dead'); await say('It is Monday.', 'JB', { mood: 'closed' }); await N('That wasn\'t me. It was his voice and my pitch, a thing his mouth did without him.'); await J('Raymond. Your wife left the kitchen light on.', 'hurt'); await N('Nothing. The hum. The crate. The shut eyes.');
    sfx('alert'); post.flash = .5; await K_('SECURITY DRONES! I SEE FIVE! SIX!', 'err'); await J('That\'s a lot of drones for a pantry.', 'wide');
    await fight(WAREHOUSE_FIGHT); music('plant');
    await N('When the last drone went down, the line of sleepers hadn\'t looked up. Not one head. They\'d kept walking through the whole thing.'); await K_('Eight drones down. Viewers say "good job" and "why are they not waking up".', 'happy'); await J('Because somebody turned their ears into a leash.', 'smug');
    await N('Two lines of blue light swept through the loading door. Sirens. Not the kind that mean help.');
    await say('Detective Garfield. Neo Monday Police. You\'re under arrest for disturbing a Monday.', 'OCHOA'); await J('Disturbing a... that\'s a charge?', 'wide'); await say('Everybody gets a Monday. You\'re getting one inside.', 'OCHOA');
    await N('He smiled while he said it. I knew the smile. I\'d seen it on a foreman at a lasagna plant right before his face came off.'); setF('arrested'); await J('Sergeant, you\'ve got something on your teeth.', 'smug');
    await goto('jail');
  },
  async look() { await N(nth('wh_look', ['Racks of yellow cans, floor to ceiling, in perspective. A banner at the end: JUST ADD MONDAY. The air is full of floating powder, drifting like pollen.', 'The sleepers keep stacking. A can goes up, a can goes down, and nobody ever finishes a row.'])); },
  inv: [
    { name: 'A CAN OF POWDER', fn: async () => { if (has('CAN')) return N('One can is enough for a conspiracy. I have one.'); give('CAN'); await N('I took a can off the rack. Under the lid, a chip the size of a lentil, humming. I held it to my ear. 88.1.'); await K_('It is a radio. A very small radio. In a lasagna ingredient.', 'scan'); clue('can', 'Every can of Sunday\'s powder holds a chip tuned to 88.1.'); await J('Everyone in this city eats the signal. That\'s a business model.', 'dead'); } },
    { name: 'CRATE LABELS', fn: async () => { await N(nth('wh_crate', ['SUNDAY\'S POWDER CO., a subsidiary of SUNDAY\'S FROZEN FOODS. Signed on every label: M. SUNDAY.', 'M. Sunday. The man the plant is named for. The man whose name is on every sign. Nobody\'s seen him in decades.'])); } },
    { name: 'RAYMOND', fn: async () => { await N('Raymond Odell, eyes shut, cap straight, a crate on his shoulder and the hum in his throat.'); await J('Raymond. Look at me. You drove a number 9 bus for thirty years. You know every pothole in this city by its first name.', 'dead'); await say('It is Monday.', 'JB', { mood: 'closed' }); await N('I can\'t wake him. The voice has his mouth. For now.'); } },
  ],
  ask: [{ name: 'KUMA: THE SLEEPERS', fn: async () => { await K_('They are not hypnotized. They are following a loop. Hum, lift, step, hum. The signal is not telling them what to do. It is telling them what day it is.', 'scan'); await J('And they agree.', 'hurt'); } }],
  move: [['OUT TO THE STREET', 'street2']],
};

// ----- jail -----
const JAIL_FIGHT = {
  scene: 'jail', music: 'combat', slots: [{ x: 110, y: 176, cover: [0, 150, 512, 26] }, { x: 256, y: 176, cover: [0, 150, 512, 26] }, { x: 410, y: 176, cover: [0, 150, 512, 26] }, { x: 256, y: 60, r: 170 }],
  waves: [{ t: 40, slot: 1, kind: 'brute', hp: 6, aim: 130 }, { t: 130, slot: 0, aim: 85 }, { t: 180, slot: 2, aim: 85 }, { t: 240, slot: 3, kind: 'drone', aim: 90 }, { t: 330, slot: 1, kind: 'brute', hp: 6, aim: 120 }],
};
SC.jail = {
  name: 'NEO MONDAY LOCK-UP', art: 'jail', music: 'morgue',
  async enter() {
    if (F('jailIn')) return; setF('jailIn');
    await N('The cell door shut with a clank I remembered, which is odd for someone with two percent of a memory.'); await J('I\'ve been behind bars before. I believe it was a live event. I locked up an entire audience once. They never forgave the clanking.', 'dead');
    await K_('That is in your file under BITS. The audience was the whole stream.', 'happy'); await J('Of course it is.', 'dead');
    await say('Psst. Is that the real JB Garfield? From the radio?', 'FUSE'); await J('I don\'t do radio.', 'dead'); await say('You do. I fixed your microphone for four years. Name is Fuse. Chief engineer, KLAS. Until they locked me in here for refusing to tune something.', 'FUSE');
  },
  async look() { await N(nth('j_look', ['A holding cell with a cot, a window the size of a postcard, and bars floor to ceiling. One bulb on a chain. A cell mate in a green jumpsuit with goggles pushed up on a head of hair that has opinions.', 'Tally marks scratched into the wall: a bunch of five, then another, then another. Fuse counts Mondays.'])); },
  inv: [
    { name: 'THE BARS', fn: async () => { await N(nth('j_bars', ['Steel, cold, bolted into concrete. They\'re the kind of bars that don\'t care whether you\'re a detective, a cat, or an audience.', 'There\'s a lock on the gate, a good one. The kind you can open if you know how, and the only thing in the cell who knows how has goggles and a grin.'])); } },
    { name: 'TALLY MARKS', fn: async () => { await N('Groups of five. Fuse marks every Monday. There are twenty-one groups.'); await J('That\'s a hundred and five Mondays.', 'dead'); await say('Three weeks in a cell feels longer when every day has the same name.', 'FUSE'); } },
    { name: 'THE COT', fn: async () => { await N('A cot with a thin blanket and a book with its cover torn off. The book is a manual for a radio transmitter. Someone has underlined THE SIGNAL MUST NEVER REPEAT. Someone else wrote beside it: it does.'); } },
  ],
  ask: [
    { name: 'FUSE: WHO ARE YOU?', fn: async () => { setF('fuseMet'); await say('Fuse. Chief engineer at KLAS. I built the station. I didn\'t build the signal. They brought that in on a reel and told me not to ask.', 'FUSE'); await say('You get a feel for these things. A signal that repeats isn\'t music. It\'s a leash.', 'FUSE'); } },
    { name: 'FUSE: THE TOWER', if: () => F('fuseMet'), fn: async () => { await say('The Sundial Tower, on the studio building. 9th and Static. The transmitter sits on the roof. You can\'t shut it off from the ground. Only the mic on the roof matters.', 'FUSE'); setF('fuseTower'); clue('tower2', 'The transmitter is on the studio roof at 9th and Static. The mic up there is the one that matters.'); } },
    { name: 'FUSE: THE LOOP', if: () => F('fuseMet'), fn: async () => { await say('The loop only breaks if the voice says something new. Something true. Anything it\'s already said, it just absorbs. You need a real person on that mic.', 'FUSE'); await J('Or a cat.', 'smug'); await say('Or a cat.', 'FUSE'); setF('fuseLoop'); clue('loop', 'The loop only breaks if the voice says something new and true.'); } },
    { name: 'FUSE: THE SAFE', if: () => F('fuseMet'), fn: async () => { await say('The master tape is in the studio safe. The combination is a day. The day nobody says. Not Sunday, that\'s the company. The one that doesn\'t happen.', 'FUSE'); setF('fuseSafe'); await J('Tuesday.', 'think'); await say('Don\'t say it too loud. The walls have an opinion.', 'FUSE'); } },
  ],
  move: [['ESCAPE (WITH FUSE)', 'street2', async () => {
    if (!F('fuseMet')) { await J('I should talk to my cell mate before I take up lock-picking.', 'dead'); return false; }
    if (!F('fuseTower') || !F('fuseLoop') || !F('fuseSafe')) { await J('Not yet. Fuse has more to tell me, and a prison is the one place I can actually listen.', 'dead'); return false; }
    await say('Kuma, little hum, left on three. One, two, three.', 'FUSE'); sfx('door'); await K_('Lock open! Also, there are guards.', 'err'); await say('Hello, Detective. We were hoping you\'d do that.', 'OCHOA');
    await N('Sergeant Ochoa and three friends in uniform. Their smiles all arrived at the same time.'); await J('Fuse, stay down.', 'wide'); await say('You don\'t get to tell me what to do. You\'re in my jail.', 'FUSE');
    await fight(JAIL_FIGHT); music('morgue'); setF('jailbreak');
    await say('Nine years of Mondays and I finally got to break something.', 'FUSE'); await J('Go home, Fuse. Tell Mrs. Odell her husband is alive.', 'smug'); await say('Where am I going to go? ...The studio. I have a key. I\'ll meet you at the door.', 'FUSE');
    return true; }]],
};

// ----- studio -----
const STUDIO_FIGHT = {
  scene: 'studio', music: 'combat', slots: [{ x: 110, y: 168, cover: [0, 138, 512, 38] }, { x: 400, y: 168, cover: [0, 138, 512, 38] }, { x: 256, y: 52, r: 190 }, { x: 256, y: 76, r: 120 }],
  waves: [{ t: 30, slot: 2, kind: 'drone', aim: 90 }, { t: 70, slot: 3, kind: 'drone', aim: 90 }, { t: 130, slot: 0, aim: 80 }, { t: 190, slot: 1, aim: 80 }, { t: 250, slot: 2, kind: 'drone', aim: 75 }, { t: 290, slot: 3, kind: 'drone', aim: 75 }, { t: 340, slot: 0, hp: 3, aim: 70 }],
};
SC.studio = {
  name: 'KLAS RADIO: STUDIO A', art: 'studio', music: 'cold',
  async enter() {
    if (F('studioFight')) return;
    await N('9th and Static. A radio studio the size of a closet that had been told it was a church. Foam on the walls, a console like a cockpit, and a red sign that said ON AIR in a way I felt in my teeth.');
    await say('...and that\'s Monday on JB Garfield FM. Hold your breath, we\'ll be right back to the nothing.', DJ_NAME); await N('Behind the glass, a figure in headphones. A chrome head with two sharp ears, and over the ears, the headphones fit exactly, like someone had taken measurements.');
    await say('Detective. You\'re late for your own show.', DJ_NAME); await J('I don\'t have a show.', 'dead'); await say('You do. I run it. Every night. You\'re the best thing that ever happened to my ratings.', DJ_NAME); sfx('alert');
    await K_('DRONES, DROPPING FROM THE CEILING TILES! AND A FEW OF THE ORDINARY KIND! GO GO GO!', 'err'); await J('The ceiling tiles were cheaper in the first draft.', 'smug');
    await fight(STUDIO_FIGHT); music('cold'); setF('studioFight');
    await say('Good set. I\'ll see you on the air, Garfield. Up the stairs. Come say something nice.', DJ_NAME); await N('The headphones went up the back stairs like they were on a hanger. Nobody on the air for ten seconds. Then a hum, and a voice that sounded like mine.');
  },
  async look() { await N(nth('stu_look', ['A studio with a console, a reel-to-reel, a boom mic like a question mark, and a wall of foam that swallows every sound I make. A red ON AIR sign blinks on the wall.', 'The headphones on the hook have a cat-ear cutout. Whoever wore them wore them every night.'])); },
  inv: [
    { name: 'THE SAFE', fn: async () => {
      if (F('safe')) return N('The safe is empty. A square of dust where something sat for nine years.');
      await N('A gray safe under the console. A dial with the days of the week instead of numbers.'); const days = ['MONDAY', 'WEDNESDAY', 'THURSDAY', 'TUESDAY'];
      for (;;) { const c = await choose(days, { x: 200, y: 30, title: 'THE DAY', cancel: 1 }); if (c < 0) return; if (days[c] === 'TUESDAY') break; await N(nth('safe_w', ['CLICK. No. That one is a day that happens.', 'CLICK. Nope. It\'s the day that does exist.', 'CLICK. The safe isn\'t offended. It\'s patient.'])); }
      setF('safe'); sfx('door'); give('TAPE'); await J('Tuesday. The day nobody says.', 'smug'); await N('The door swung open on one reel of tape, labeled in a hand I almost knew: FOR THE SLEEPLESS.');
    } },
    { name: 'THE REEL MACHINE', fn: async () => {
      if (!has('TAPE')) return N('A reel-to-reel with nothing on it. It looks lonely.');
      if (hasClue('lullaby')) return N('I\'ve heard the tape. I could play it again. I don\'t want to.');
      await N('I threaded the reel, thumbed the lever, and the machine started to turn.'); sfx('glitch');
      await say('If you can\'t sleep, I\'ll tell you a story. Good evening. It is Monday. You can rest now.', 'HAROLD'); await N('Not my voice. A voice underneath mine, the one I was built on, older, rougher, warm as a hand on a shoulder. Harold.');
      await say('...This one is for the sleepless detectives. The ones who can\'t stop working. Nine hours is the limit, then you stop. Okay? Nine hours.', 'HAROLD'); await J('He made it a bedtime story. For people who couldn\'t stop.', 'hurt');
      await K_('And somebody removed the nine hour limit and ran it forever.', 'scan'); await J('A kindness, run on repeat, stops being a kindness.', 'hurt'); clue('lullaby', 'The loop is Harold\'s bedtime story for sleepless detectives, with the nine-hour limit removed.');
    } },
    { name: 'THE CONSOLE', fn: async () => {
      if (hasClue('sponsor')) return N('The console has nothing else to say. The knobs are just knobs.');
      await N('Under the mixing board, a leather folder: ADVERTISING. A contract between KLAS and SUNDAY\'S POWDER CO. Three pages. Signed on the last: M. SUNDAY, in a hand that has been signing the same name for a hundred and fourteen years.'); clue('sponsor', 'The station\'s sponsor is SUNDAY\'S POWDER CO. The contract is signed M. SUNDAY.');
      await N('A clause on page two: "Should Tuesday occur, this agreement and its exclusivity terminate." I read it twice. Then a third time, out loud, to hear how stupid it sounded.'); await J('He pays to keep the week from moving.', 'think'); clue('tuesdayClause', 'Page two: if Tuesday ever happens, Sunday\'s exclusive contract with the city ends.');
    } },
    { name: 'THE MICROPHONE', fn: async () => { await N(nth('stu_mic', ['A big silver microphone on a boom. I stood in front of it. It stared back, quietly, like a fish.', 'I\'ve stood at a mic before, I think. I\'ve never been the mic.'])); } },
  ],
  ask: [{ name: 'KUMA: THE STUDIO', fn: async () => { await K_('This room has been running since nine years ago. The reel on the machine never finishes. The dial on the wall says there are no days. There is a Tuesday on the safe, which I find upsetting.', 'scan'); } },
    { name: 'FUSE (AT THE DOOR)', if: () => F('jailbreak'), fn: async () => { await say('Safe, tape, contract. Then the roof. I\'ll watch the stairs. If I hear anything with a smile I\'ll yell.', 'FUSE'); } }],
  move: [['BACK TO THE STREET', 'street2'], ['UP TO THE ROOF', 'tower', async () => {
    if (!F('studioFight')) return false; if (!(hasClue('lullaby') && hasClue('sponsor'))) { await J('Not with half a story. I want the tape and the contract before I go up and say anything to anybody.', 'dead'); return false; }
    setF('c2knows'); return true; }]],
};

// ----- the roof -----
const TOWER_FIGHT = {
  scene: 'tower', music: 'combat', boss: 1, bossName: 'DJ STATIC', slots: [{ x: 256, y: 170 }, { x: 256, y: 58, r: 210 }, { x: 256, y: 84, r: 130 }],
  waves: [{ t: 30, slot: 0, hp: 20, aim: 75, boss: 1 }, { t: 220, slot: 1, kind: 'drone', aim: 85 }, { t: 340, slot: 2, kind: 'drone', aim: 85 }, { t: 560, slot: 1, kind: 'drone', aim: 75 }, { t: 600, slot: 2, kind: 'drone', aim: 75 }],
};
const SPEECH = [
  { q: 'KUMA: YOU ARE LIVE. THE LOOP IS LISTENING. WHO ARE YOU TO IT?', right: 1, hint: 'Say who you are. Not who it needs.', opts: ['"Good evening, Neo Monday. It is Monday. You can rest now."', '"This is JB Garfield. I am a detective. I do not know what day it is."', '"Sleep tight, everybody. I have got this."'],
    bad: [['The loop swallowed it whole. It is a sentence it already knew.'], ['I said it with confidence. The hum said it back to me, more confidently.']], win: 'Something in the hum hiccuped. A note went missing from the four.' },
  { q: 'THE STATION SAYS YOU WROTE THIS. WHAT DO YOU TELL THEM?', right: 1, hint: 'Say what actually happened to the words.', opts: ['"I said these words. Every one of them."', '"I did not say these words tonight. A man recorded them long ago to help people sleep. Then somebody else used them."', '"Words are just static with a hat on."'],
    bad: [['It sounded good. It was a lie, and the loop likes lies; they scan.'], ['A line that wanted to be clever. The hum took it for decoration and went on.']], win: 'The hum slid sideways. Three of the four notes were out of step with each other.' },
  { q: 'THEY ARE WAITING TO BE TOLD WHAT TO DO. WHAT DO YOU SAY?', right: 1, hint: 'Give them their lives back, not another instruction to wait.', opts: ['"Stay right where you are. Help is on the way."', '"Turn me off. Go home. Tomorrow is Tuesday, and it is going to rain."', '"Call in with your theories. I will read them out loud."'],
    bad: [['Stay where you are. The same instruction in different clothes.'], ['A show for people already asleep. They\'d have called in, in their sleep.']], win: 'Silence. Real silence, the kind with weather in it. Then, very far away, rain.' },
];
SC.tower = {
  name: 'SUNDIAL TOWER: ROOF', art: 'tower', music: 'basement',
  async enter() {
    if (F('bossDone2')) return; await diskCard('B'); music('basement'); post.fade = 0;
    await N('Rain on the roof, and over the rain a tall black antenna with a red light on top, going on, off, on, off, like a pulse. At the foot of it, a transmitter box with a single microphone clamped to the side. Headphones, cat-ear cutouts and all, sat on the ledge.');
    await say('You came all the way up. I hoped you would. Every show needs a closer.', DJ_NAME); await J('You\'re a copycat. You\'ve been wearing a radio voice.', 'dead'); await say('Like a hat. I think it suits me.', DJ_NAME);
    await N('Above the dish, a rippling gold light: a man in a tall white chef\'s hat, bow tie, and spectacles, a hundred and fourteen years old and about eight feet tall in the rain.'); await say('Detective Garfield. Welcome to my Monday.', 'SUNDAY');
    await J('Mr. Sunday. You signed the contract.', 'dead'); await say('I sign everything. It\'s how a company stays a person.', 'SUNDAY'); await say('DJ, if you would. Show him how a loop gets closed.', 'SUNDAY');
    await K_('THIS IS THE BIG ONE. AIM. FIRE. HEADS. BREATHE.', 'err'); await fight(TOWER_FIGHT); setF('bossDone2'); music('basement');
    await N('DJ Static came apart like a radio does when you pull the plug: a hiss, a pop, and then a long, thin sound of something that had been trying to be a song.');
    await say('That\'s the thing about a copy. It sounds like the real one until it doesn\'t.', 'SUNDAY'); await J('Why Monday?', 'dead');
    await say('Because Monday is the only day nobody argues with. Because on a Tuesday, the city\'s charter renews to another bidder, and Sunday\'s becomes one more shop on a street. I built a day so it could not end.', 'SUNDAY');
    await say('And the voice?', 'SUNDAY'); await J('Harold\'s lullaby. With the limit taken out.', 'smug'); await say('It was so kind. It seemed a shame not to use it.', 'SUNDAY'); await J('You turned a kindness into a leash.', 'hurt');
    await say('Say something to them, then, Detective. They are all listening. See what you have.', 'SUNDAY'); await broadcast();
  },
  async look() { await N('The roof, the rain, the antenna with its red heartbeat, a microphone clamped to a box that I could hear humming from here.'); },
  inv: [], ask: [], move: [],
};
async function broadcast() {
  await N('I sat at the microphone. The rain was loud on the roof, and the mic made it louder. Somewhere under me, a city was asleep with its ears open.');
  await K_('You are live. The loop only breaks if the voice says something new and true. I will give you three lines to choose between. I do not know which one is right. I am just the navigation unit.', 'scan');
  let wrongs = 0;
  for (const r of SPEECH) {
    for (;;) {
      await N(r.q); const i = await choose(r.opts, { x: 8, y: 14, wrap: 58, title: 'ON AIR' });
      if (i === r.right) { await say(r.opts[i].replace(/"/g, ''), 'JB', { mood: 'dead' }); await N(r.win); break; }
      wrongs++; await say(r.opts[i].replace(/"/g, ''), 'JB', { mood: 'smug' }); for (const l of r.bad[i === 0 ? 0 : 1]) await N(l); if (wrongs > 1) await K_(r.hint, 'scan'); else await K_('Static is rising. Try again.', 'err');
    }
  }
  S.wrongs2 = wrongs;
  await N('The hum cracked and went. In the speakers on the lamp posts, in the cones under the eaves, in every kitchen and every cab, one note after another, going out like windows at dawn.');
  await say('...No.', 'SUNDAY'); await say('No. It\'s Monday. I paid for it to be Monday.', 'SUNDAY', { mood: 'calm' }); await J('The contract has a clause, Mr. Sunday. It says what happens if Tuesday occurs.', 'smug');
  await say('Detective...', 'SUNDAY'); await N('The hologram flickered. The old man in the toque looked down at his own hands, like he\'d just noticed them.'); await say('...I forgot what rain sounds like.', 'SUNDAY'); await N('It went out the way a pilot light goes out. Quiet, and with a small blue sound.');
  await fate();
}
async function fate() {
  await K_('Station status: OFF AIR. Signal source: dead. Calendar: undecided. What do you do, Detective?', 'scan');
  const c = await ask('What happens to the station?', null, ['SHUT IT DOWN. LET TUESDAY COME.', 'KEEP IT ON THE AIR. MY SHOW. LIVE.', 'LEAVE THE LOOP. MONDAY IS FINE.']);
  const kind = ['tuesday', 'live', 'monday'][c]; setF('ending2', kind); music('end'); const meta = fetchStore('neomonday_meta') || { ends: {} }; meta.ends2 = meta.ends2 || {}; meta.ends2[kind] = 1; meta.ends = meta.ends || {}; store('neomonday_meta', meta);
  if (c === 0) {
    await J('Pull it, Fuse.', 'dead'); await say('Pulling. Hold your hat.', 'FUSE'); await N('The red light went out. The city turned a page. I stood on a roof, and for the first time in the nine years that I had owned, the sky turned a different color.');
    await J('Kuma. What day is it?', 'smug'); await K_('Tuesday! Tuesday! It is Tuesday! I have never said that before! It is ridiculous! Also it is raining!', 'happy'); await N('Raymond Odell woke up in a warehouse holding a crate of lasagna powder and an impressive amount of confusion. He went home. The kitchen light was on.');
    await showCard(['ENDING A: TUESDAY', '', 'The charter went to another bidder. Sunday\'s sold the plant for scrap and a lot of lasagna.', 'JB opened his office on a Tuesday. He kept the hours: none.', 'It was cheap and ugly and the best day he ever had.'], 0, { col: hex('#c868ff') });
  } else if (c === 1) {
    await J('Leave the transmitter on. I\'ll run it.', 'smug'); await say('You? A show? Live?', 'FUSE'); await J('A real one. No static. A detective hour. People can call in with theories. I will read them out loud.', 'smug'); await K_('Sponsor inquiries: reconstituted lasagna powder, now with Tuesday!', 'happy');
    await N('The red light stayed lit. The first caller was Edna Odell. She said Raymond was home and wanted to know if the voice could say hello. I said hello. It was the first thing I had said into a microphone that I meant.');
    await showCard(['ENDING B: LIVE', '', 'JB GARFIELD FM went back on the air at 88.1.', 'No loop. No limit. A different day every night, and a voice that tells you which.', 'Closed Mondays.'], 0, { col: hex('#ff7ae0') });
  } else {
    await J('Leave it. Honestly. Monday is fine.', 'closed'); await K_('Detective?', 'err'); await J('I mean, what is the alternative? Tuesday? I haven\'t had time to meet it.', 'dead'); await N('I watched the red light for a long time. It blinked back, polite as a clock. Down in the city, a million people hummed.');
    await N('Fuse took me by the elbow and walked me down eight flights, talking the whole way. I only heard one word in four. They were all Monday.');
    await showCard(['ENDING C: MONDAY, FOREVER', '', 'The loop ran. The city hummed. Raymond Odell stacked cans until the end of the lease.', 'JB Garfield, detective, is closed Mondays.', 'It is always Monday. The office has never been open.'], 0, { col: hex('#7a8ac8') });
  }
  try { localStorage.removeItem('neomonday_sav'); } catch (e) {}
  await credits(); await toTitle();
}
Object.assign(PHONES, {
  async odell() { await say('Edna Odell. Is it Raymond?', 'ODELL', { mood: 'worry' }); await J(F('raymond') ? 'I found him, Mrs. Odell. He is alive. He is working on something. I am working on getting him to stop.' : 'Not yet. I wanted to hear your voice. I will call when I have something.', 'dead'); await say(F('raymond') ? 'Thank you. The light is still on.' : 'The light stays on.', 'ODELL'); },
});
