'use strict';
// ================= NEO MONDAY — the case. Three acts, three disks. =================
// JB's rules (from his bible): he wants the case solved AND wants to sound cool solving it. The noir is specific, the
// deductions are earned, and when a clue contradicts him he adjusts. His name never opens a door. He likes lasagna on purpose.
const FOREMAN = 'FOREMAN'; CAST.FOREMAN = { col: hex('#c8c8d8'), voice: [300, 30] };
Object.assign(ITEMS, {
  BADGE: ['BADGE', 'LITTER badge 0009. HAROLD, J.B. The photo is a human man with a good chin and a worse hat.'],
  LASAGNA: ['LASAGNA', 'Nine-year-old lasagna from my own desk drawer. It looks exactly as it did the day I put it there. That is either good storage or a warning.'],
});

// a fight you can lose: each loss gives you a little more cool for the retry
async function fight(cfg) {
  let bonus = 0;
  for (;;) {
    const r = await gallery(Object.assign({}, cfg, { hp: (cfg.hp || 5) + bonus }));
    if (r.won) return r;
    await showCard(['YOU LOST YOUR COOL', '', 'It happens. The trick is to lose it after the shooting.'], 140, { col: hex('#ff6060') });
    bonus = Math.min(3, bonus + 1); await N('I got up. Slower. A little less cool and a lot more careful. That is the better way up.');
  }
}

// ---------- ACT 1 : DISK 1 : THE FREEZER ----------
SC.freezer = {
  name: 'SUNDAY\'S FROZEN FOODS: WALK-IN', art: 'freezer', music: 'cold',
  async enter() {
    if (F('woke')) return;
    await N('Cold. Not the kind you complain about. The kind that files a report.');
    await N('I was on my back on a steel floor with a hat on my chest. I know a hint when I am holding one.');
    await K_('Good morning! Systems nominal! I am KUMA, your LITTER navigation unit. You have been frozen for nine years, four months and one Monday.');
    await J('Which Monday.', 'dead'); await K_('All of them. It is always Monday.');
    await J('Then I\'m not late.', 'dead');
    await J('Who am I?', 'wide');
    await K_('Subject: J.B. GARFIELD. Occupation: detective, LITTER division. Species: cat. Preferred food: lasagna. Memory restoration: two percent.');
    await J('Two percent. A name, a hat and a craving. I\'ve solved cases with less.', 'smug');
    await J('Why am I in a freezer?', 'dead'); await K_('Unknown! Viewer suggestions: "ask nicely" and "check the lockers". I will pass the second one along as a recommendation.', 'happy');
    setF('woke'); await N('Fine. Start with the room. Rooms are honest. It is the people in them.');
  },
  async look() {
    await N(nth('fz_look', ['A walk-in freezer the size of a church. Racks of SUNDAY\'S LASAGNA climb both walls into the fog, every tray stamped with the same line: EVERY LAYER COUNTS.', 'At the far end, a steel door with one red lamp. Everything else is frost and trays. It is the best-organized dead end I have been in.']));
  },
  inv: [
    { name: 'LASAGNA TRAYS', fn: async () => { await N(nth('fz_tray', ['The label on the nearest tray: LAYERS: 11. BEST BEFORE: MONDAY.', 'Same label on every tray. Every tray expires on Monday. In a city where it is always Monday, that is either a joke or a threat, and I do not like either one in a freezer.', 'Eleven layers. Somebody counted. Somebody always counts.'])); await J('I was hungry before I woke up. Hunger is the one thing that makes sense.', 'smug'); } },
    { name: 'LOCKER', fn: async () => {
      if (F('dressed')) return N('The locker is empty now. It had one job and it did it.');
      setF('dressed'); await N('A steel locker, half open. A tan trench coat torn at the elbows. A grey fedora. A black tie knotted by somebody who knew how.');
      await J('It fits. Better than that: it fits like it was waiting.', 'smug'); await N('I put it all on. A cat in a coat looks like he knows what he\'s doing. That is half the job. The other half is doing it.'); await K_('You look 40 percent more competent!', 'happy'); await J('Only 40?', 'dead');
    } },
    { name: 'FROST ON THE FLOOR', fn: async () => { await N(nth('fz_frost', ['Frost on steel. One set of small prints leading from the door to the middle of the floor and stopping. Then a long smooth drag.', 'Nobody walked me in. Somebody carried me, laid me down, and put a hat on my chest. Gentle. That is worse than rough. Rough is a mistake. Gentle is a plan.'])); } },
    { name: 'STEEL DOOR', fn: async () => {
      if (F('door')) return N('The door is open. Beyond it, noise and orange light and the smell of a lot of cheese.');
      await N('Sealed. The panel wants a code, a card, or a better personality.'); await K_('I can open this. It will take forty seconds.');
      await J('Take your time. I\'ll look at something while you work and pretend it was my idea.', 'dead'); await N('I used the forty seconds to look composed. It almost worked.');
      await wait(50); sfx('door'); setF('door'); await K_('Done!'); await J('Ah. Good. That was going to be my idea.', 'smug'); await K_('You were facing the wrong wall.', 'happy');
    } },
  ],
  ask: [
    { name: 'KUMA: WHO AM I?', fn: async () => { await K_(nth('k_who', ['I only have your service file. Detective. Cat. Reliable on Mondays, which is every day. No next of kin on record.', 'The file says you wear a hat "unreasonably well". That is the only personality note.'])); } },
    { name: 'KUMA: THE LITTER?', fn: async () => { await K_('The Law-Intelligence Task-force for Troublesome Electronic Replicants. LITTER. Mostly cats, so the name was inevitable.'); await J('Troublesome replicants. Copycats.', 'dead'); await K_('Correct. Machines wearing people. You hunt them. You were good at it, I am told.'); } },
    { name: 'KUMA: LASAGNA?', fn: async () => { await K_('Your service file lists lasagna as "emotional support, and also lunch".'); await J('A man needs a hobby.', 'smug'); await K_('You are a cat.'); await J('A cat needs a lunch.', 'dead'); } },
    { name: 'KUMA: VIEWERS?', fn: async () => { await K_('Viewers are the people who help me help you! They send suggestions. I am very grateful and I have never once been paid.', 'happy'); await J('I know the feeling. I don\'t know how I know it.', 'dead'); } },
  ],
  move: [['PLANT FLOOR', 'plant', async () => { if (!F('door')) { await N('The door is sealed. Doors are the one thing in this city that mean exactly what they say.'); return false; } if (!F('dressed')) { await J('Wait. I should look like I belong on the plant floor. The coat. The locker.', 'dead'); return false; } return true; }]],
};

// ---------- the plant floor ----------
const PLANT_FIGHT = {
  scene: 'plant', music: 'combat', slots: [{ x: 90, y: 142, cover: [0, 124, 512, 22] }, { x: 256, y: 142, cover: [0, 124, 512, 22] }, { x: 420, y: 142, cover: [0, 124, 512, 22] }],
  waves: [{ t: 40, slot: 1, hp: 2, aim: 95 }, { t: 150, slot: 0, hp: 2, aim: 85 }, { t: 210, slot: 2, hp: 2, aim: 85 }, { t: 330, slot: 1, hp: 3, aim: 75 }, { t: 360, slot: 0, hp: 2, aim: 70 }],
};
SC.plant = {
  name: 'SUNDAY\'S: PLANT FLOOR', art: 'plant', music: 'plant',
  async enter() {
    if (F('ambush')) return;
    await N('The plant floor hummed the way a lie does: steady, and ready for questions.');
    await N('Conveyor belts, six deep. Trays of lasagna marching toward a freezer I had just left. One worker at the end, with his back to me, putting sauce on things that did not need sauce.');
    await say('You are not on the shift list.', FOREMAN);
    await J('I\'m not on a lot of lists.', 'dead'); await say('Neither was the last one.', FOREMAN);
    await N('He turned around. His face kept turning after his head stopped. Then it fell off, and what was under it was chrome with a pair of pointed ears.');
    sfx('alert'); post.flash = .6;
    await say('Eleven layers. Twelve with you.', 'COPYCAT'); await K_('COPYCAT! THIS IS THE PART WHERE YOU SHOOT! Use the arrow keys to aim and A to fire!', 'err');
    await J('I hate this part.', 'wide');
    await fight(PLANT_FIGHT);
    setF('ambush'); music('plant'); await N('Chrome and wet latex all over the floor. A dozen faces on the belt, still warm, waiting to be worn.');
    await K_('Five copycats down! Viewer suggestion: "nice shooting". I am forwarding it with enthusiasm.', 'happy');
    await J('The face on the belt. The one he was wearing. It\'s a person. It was a person.', 'hurt'); await N('Nobody ever warns you that the worst part of a copycat is how well it listens.');
  },
  async look() { await N(nth('pl_look', ['A factory floor, orange-lit, where the lasagna goes in one end and a freezer waits at the other. The machines are the size of houses and the same temperature as a grudge.', 'Hazard stripes on the floor. A catwalk overhead. Every machine has a red lamp and every lamp is on. Somebody is monitoring all of it and not one of them is here.'])); },
  inv: [
    { name: 'LAYERING MACHINE', fn: async () => { await N(nth('pl_mach', ['A machine as big as a barn. It lays sheets of pasta, sauce, cheese, sheet, sauce, cheese. A plate on the side: LAYERS: THE ONLY HONEST FOOD.', 'It is making lasagna. It is also making something else on the lower belt: a sheet that is not pasta. Thin. Pinkish. Warm. It comes out in sheets, eleven at a time.', 'Eleven layers of lasagna. Eleven layers of skin. I stood there and let that sit for a moment before it sat on me.'])); if (S.seen.pl_mach > 1) clue('layers', 'Copycat skin is grown in layered sheets on the plant\'s lasagna line.'); } },
    { name: 'THE BELT', fn: async () => { await N(nth('pl_belt', ['Trays march by. Every sixth one has the usual red label. Every thirteenth one has the label turned the other way. Somebody is counting something besides lasagna.'])); } },
    { name: 'WRECKAGE', if: () => F('ambush'), fn: async () => {
      if (!F('badge')) { setF('badge'); give('BADGE'); await N('Under the chrome, in the wreck of what was the foreman: a small flat badge pinned to a latex shoulder.'); await N('LITTER. HAROLD, J.B. BADGE 0009. A photo of a man. Square chin. Good coat. Not a cat.'); await J('J.B. Same as me.', 'wide'); await J('It\'s a coincidence. The initials. They\'re common. Very common. I\'m going to look at this badge for a while.', 'hurt'); clue('badge', 'Harold, J.B. LITTER badge 0009. The photo is a human man.'); }
      else if (!F('chassis')) { setF('chassis'); await N('A strip of chassis plate. Stamped SF-0412. SF for what, Kuma?'); await K_('SUNDAY\'S FOODS, I believe.', 'scan'); clue('chassis', 'Copycat chassis are stamped SF. Sunday\'s Frozen Foods makes them.'); await J('A lasagna company builds the machines that eat people.', 'dead'); await K_('Their slogan is EVERY LAYER COUNTS.', 'happy'); await J('Yes. I\'m beginning to see that.', 'dead'); }
      else await N('Nothing else in the wreckage. I checked. I checked it in a way that I\'d like to be remembered for.');
    } },
    { name: 'LIFT TO SUBLEVEL 12', if: () => F('knows'), fn: async () => { await liftDown(); } },
  ],
  ask: [{ name: 'KUMA: THIS PLACE', fn: async () => { await K_(nth('pl_k', ['This is the Sunday\'s plant. It is the largest employer in Neo Monday. Nine thousand workers, three shifts, and no sick days on record.', 'No sick days on record is statistically impossible. I flagged it. The flag was deleted. I flagged the deletion. That was deleted too.'])); await J('Somebody is very tidy.', 'dead'); } }],
  move: [['BACK TO THE FREEZER', 'freezer'], ['OUT TO THE STREET', 'street', async () => { if (!F('ambush')) return false; if (!F('badge')) { await J('I should look through the wreckage before I leave. Detectives who leave evidence get ghosted by it.', 'dead'); return false; } return true; }]],
};

// ---------- ACT 2 : DISK 2 : THE DISTRICT ----------
const STREET_FIGHT = {
  scene: 'street', music: 'combat', slots: [{ x: 255, y: 175, cover: [205, 150, 100, 26] }, { x: 60, y: 175, cover: [0, 158, 130, 18] }, { x: 440, y: 175, cover: [380, 158, 132, 18] }],
  waves: [{ t: 40, slot: 0, hp: 2, aim: 90 }, { t: 110, slot: 1, hp: 2, aim: 80 }, { t: 170, slot: 2, hp: 2, aim: 80 }, { t: 270, slot: 0, hp: 3, aim: 70 }, { t: 300, slot: 1, hp: 2, aim: 60 }, { t: 330, slot: 2, hp: 2, aim: 60 }],
};
SC.street = {
  name: 'NEO MONDAY: THE DISTRICT', art: 'street', music: 'street',
  async enter() {
    if (!F('street')) {
      setF('street'); await diskCard(2); music('street'); post.fade = 0;
      await N('Rain, the color of a bruise. Neon in every puddle. A city where somebody left the weather on.');
      await K_('It is raining! Also it is Monday.', 'happy'); await J('It\'s always Monday, Kuma.', 'dead'); await K_('Yes! I enjoy saying it.');
      await N('Three signs I could read from where I stood: THE LUKEWARM. LITTER. And the giant one on the tower: SUNDAY\'S LASAGNA.');
      await N('I had a badge in my pocket, a hat I could not account for, and a feeling I wanted to be a theory. Time to find out which.');
    }
    if (F('lucky') && !F('ambush2')) {
      setF('ambush2'); await N('I was one step out of the bar when the street went quiet. A rain that stops mid-drop is not weather.');
      await say('Detective. Garfield. We\'ve been looking for you.', 'COPYCAT'); await J('I get that a lot. Usually from people who want to sell me something.', 'smug'); await say('We\'re selling. A new face.', 'COPYCAT');
      await K_('THREE SIDES! ANOTHER SHOOTING!', 'err'); await fight(STREET_FIGHT); music('street');
      await N('Six down. A rain that\'s stopped starting again. The puddles took the sparks and gave back neon.'); await K_('Viewer suggestion: "watch the Chief".'); await J('The Chief? Why would viewers say that?', 'think'); await K_('I do not know. They never explain. It is part of their charm.');
    }
  },
  async look() { await N(nth('st_look', ['A wet canyon of towers and signs. THE LUKEWARM glows over a doorway to my left. A big blue LITTER shield on a building to my right. Over everything, the sign: SUNDAY\'S LASAGNA, in cyan, three stories tall, buzzing like it has an opinion.', 'Rain on the street, rain on the signs, rain in my fur. A parked LITTER cruiser sits halfway up the curb like it gave up.'])); },
  inv: [
    { name: 'BILLBOARD', fn: async () => { await N('A billboard, magenta border: IT\'S ALWAYS MONDAY! and smaller, THE CITY CHARTER, PAGE ONE.'); await J('A slogan, a promise and a threat. Rarely all three before breakfast.', 'smug'); } },
    { name: 'LITTER CRUISER', fn: async () => { await N(nth('st_car', ['A LITTER cruiser, door ajar, radio hissing. Nobody inside. On the dash: a sticker that says MY OTHER CAR IS ALSO A CRUISER.', 'The radio picks up a voice: "...Garfield is active. I repeat, Garfield is active. Do not engage until he reaches the sublevel." Then static. Then a polite cough. Then static.'])); if (S.seen.st_car > 1) { clue('radio', 'A LITTER radio said Garfield must reach "the sublevel" before anyone engages him.'); await J('Do not engage until he reaches the sublevel. So somebody wants me to go down there on my own two feet.', 'think'); } } },
    { name: 'PUDDLE', fn: async () => { await N('A puddle. A cat in a hat looks up out of it, wet around the whiskers.'); await J('He looks familiar. That is the problem. He looks like he has been somebody before.', 'hurt'); } },
    { name: 'SUNDAY\'S SIGN', fn: async () => { await N(nth('st_sign', ['SUNDAY\'S LASAGNA. EVERY LAYER COUNTS. The sign flickers. Every third flicker spells the word LAYER wrong, and every fourth spells it right.', 'The sign tower sits on the plant. Below the plant there are sublevels, the kind that show up on a blueprint as a line, not a floor.'])); } },
  ],
  ask: [{ name: 'KUMA: THE DISTRICT', fn: async () => { await K_(nth('st_k', ['Three destinations of interest: a bar called THE LUKEWARM, LITTER headquarters, and the morgue on Fifth. The Chief has requested your presence.', 'Viewers say go to the bar first. Viewers say a lot of things. This one has been consistent.'])); } }],
  move: [['THE LUKEWARM (BAR)', 'bar'], ['LITTER HEADQUARTERS', 'office'], ['THE MORGUE', 'morgue', async () => { if (!F('lucky')) { await J('I want to know what I\'m asking the morgue about first. Let me find somebody who drinks.', 'dead'); return false; } return true; }], ['BACK TO THE PLANT', 'plant']],
};

SC.bar = {
  name: 'THE LUKEWARM', art: 'bar', music: 'bar',
  async enter() {
    if (F('barMet')) return; setF('barMet');
    await N('A bar that has been exactly lukewarm since before I got here. Which is not that long. The man behind the counter has a red eye, a mustache like a sentence he never finished, and a rag in his hand.');
    await say('Cat in a hat. We don\'t serve cats in hats.', 'LUCKY'); await J('Tell him I sent you.', 'smug'); await say('That\'ll get you served. Slower.', 'LUCKY');
  },
  async look() { await N(nth('br_look', ['Bottles of every color on shelves nobody dusts. A neon sign: OPEN-ISH. Stools bolted to the floor in case of customers. The kind of place where nothing happens by design.', 'The bar has been here so long it has opinions. Mostly about the people who sit at it.'])); },
  inv: [
    { name: 'LUCKY\'S EYE', fn: async () => {
      if (F('accused')) return N('Lucky\'s eye is a red lens in a human socket. I\'ve apologized to it. It did not accept.');
      await J('That eye. Red. A man who blinks that slow is either tired or built that way.', 'think');
      const c = await ask('Do you want to accuse the bartender of being a copycat?', null, ['NO. THE EYE IS A COINCIDENCE.', 'YES. THE EYE IS A CLUE.']); if (c === 0) return N('I let it go. For now. Detectives are allowed to hold a thought and not throw it.');
      await J('Lucky. I know what you are.', 'smug'); await say('I hope it\'s "a customer".', 'LUCKY'); await J('Kuma. Scan him.', 'dead'); await K_('Scanning! Pulse: 74. Temperature: warm. Mood: rude.', 'scan');
      await say('Seventy-four? I thought it was higher.', 'LUCKY'); await J('My theory was that the red eye made you a copycat.', 'dead'); await say('That\'s a good theory. For a different bartender. The eye\'s from a card game. I lost. They had a very good surgeon.', 'LUCKY');
      await J('Noted. I withdraw the theory.', 'hurt'); await N('A detective who can\'t be wrong can\'t be right. I\'d like to say I learned that. I had to be told.'); setF('accused');
    } },
    { name: 'HAROLD\'S STOOL', fn: async () => {
      if (!F('lucky')) return N('A stool with a small brass plate: RESERVED. The plate does not say for whom. It does not have to.');
      if (!F('stool')) { setF('stool'); await N('A brass plate on the end stool: J.B. H. Under the seat, taped there like a love letter, a folded matchbook.'); await N('SUNDAY\'S FROZEN FOODS. And in pencil: "SUBLEVEL 12. ASK THE DAY."'); clue('stool', 'Harold hid a note: SUBLEVEL 12 under Sunday\'s. "Ask the day."'); await J('Ask the day. What day?', 'think'); await K_('It is Monday.', 'happy'); await J('Hm.', 'think'); await barAmbush(); }
      else await N('Nothing else under the stool. I looked the way you look at a mother\'s grave, which is to say I knew.');
    } },
    { name: 'JUKEBOX', fn: async () => { await N('A jukebox playing a song with no words on the label. It starts to play. I know every word. I have never heard it before.'); await J('...Lucky. What is this song?', 'hurt'); await say('Something Harold put on every Monday. Told me nobody else was allowed.', 'LUCKY'); await J('Huh.', 'hurt'); await N('A cat doesn\'t cry in a bar. A cat looks at a glass for a while.'); } },
    { name: 'THE TAB', fn: async () => { await N('A chalkboard behind the bar: NAMES THAT OWE US. At the top, in big letters: GARFIELD. Credit denied. Next to it, in smaller letters: LOL.'); await J('My name is a debt. That\'s the most official I\'ve felt all day.', 'smug'); } },
  ],
  ask: [
    { name: 'HAROLD', fn: async () => { if (!F('lucky')) setF('lucky'); await J('Lucky. A man named Harold. J.B. Detective.', 'dead'); await say('Harold. Sure. Ginger ale on Mondays, which was every day. Brought a hat in here every time and never took it off.', 'LUCKY'); await say('He got quiet the last month. Said the Sunday\'s plant was building something and the only people hired were people he couldn\'t find after.', 'LUCKY'); await J('Where is he now?', 'dead'); await say('Nine years ago he walked out of here and the next day I heard he was in the field. In the ground, I mean. Chief said so.', 'LUCKY'); clue('lucky', 'Harold said Sunday\'s was hiring people who disappeared. Nine years ago the Chief said he died "in the field".'); } },
    { name: 'THE CHIEF', if: () => F('lucky'), fn: async () => { await say('Vane? Comes in once a month. Orders a ginger ale. Holds it. Doesn\'t drink it. Says she\'s dieting.', 'LUCKY'); await J('Dieting.', 'think'); await say('Nine years running. Best diet I ever saw. Not one calorie.', 'LUCKY'); clue('diet', 'Chief Vane orders a drink every month and has not swallowed one in nine years.'); } },
    { name: 'COPYCATS', if: () => F('lucky'), fn: async () => { await say('They sit in the dark. They don\'t blink right. They always want the same thing: to be seated next to somebody they like and eat nothing.', 'LUCKY'); await J('That\'s every date I\'ve ever been on.', 'smug'); await say('That\'s the nicest thing you\'ve said about yourself all night.', 'LUCKY'); } },
    { name: 'MY NAME', fn: async () => { await J('Does my name carry any weight in this place?', 'dead'); await say('It carries a tab.', 'LUCKY'); await J('So it doesn\'t get me a discount.', 'dead'); await say('It gets you a very specific look from the cook.', 'LUCKY'); } },
  ],
  move: [['OUT TO THE STREET', 'street', async () => { if (!F('lucky')) { await J('I haven\'t learned a thing yet. I came in for answers and I\'m leaving with a smell.', 'dead'); return false; } return true; }]],
};

SC.office = {
  name: 'LITTER HEADQUARTERS', art: 'office', music: 'office',
  async enter() {
    if (F('office')) return; setF('office');
    await N('The LITTER building smelled like a typewriter that had been to law school. Fourth floor, corner office, a window with half-open blinds and a woman behind the desk who did not look up until she had finished looking.');
    await say('You\'re early, Detective.', 'VANE'); await J('Nine years early. I was in a freezer.', 'dead'); await say('Yes. I put you there.', 'VANE', { mood: 'cool' }); await J('You what.', 'wide'); await say('To keep you safe. Harold ordered it. Dying will do that to a man.', 'VANE');
    await say('I\'m Chief Dorothy Vane. You work for me. You have a case: Sunday\'s Foods. People who go in and come out wearing themselves, but wrong.', 'VANE'); await J('Copycats.', 'dead');
    await say('Find the source. Report to me. Here.', 'VANE'); sfx('get'); setF('phone'); banner('GOT: VIDEOPHONE', 110);
    await say('Harold\'s badge. Kuma says you found one. Hand it over. It belongs to the dead.', 'VANE');
    const c = await ask('Give Vane the badge?', null, ['GIVE IT TO HER', 'KEEP IT. IT HAS MY INITIALS.']);
    if (c === 0) { await J('Sure. Fine. Take it.', 'dead'); await say('Thank you. You\'re very obedient for a cat.', 'VANE'); lose('BADGE'); setF('gaveBadge'); await J('It was the first time anybody told me I was obedient. I did not like how it felt.', 'hurt'); }
    else { await J('It\'s in the manual. Finders keepers.', 'smug'); await say('There is no such section.', 'VANE'); await J('There\'s a section for everything. Check page one.', 'smug'); await N('Her face didn\'t move. It never does when it\'s thinking. I added that to a list I had not yet started.'); }
    await N('She poured herself a ginger ale from a glass pitcher. She did not drink it. She held it and looked at the window like it owed her money.');
  },
  async look() { await N(nth('of_look', ['Corner office. A window onto the neon, blinds half down, the city laid out in stripes. A desk with a lamp, a phone, and a nameplate: J.B. GARFIELD. Mine. Under nine years of dust. Chief Vane sits behind a smaller desk like she\'s waiting for somebody to ask her for something.', 'The whole room has the energy of a person who told you everything except the one thing.'])); },
  inv: [
    { name: 'MY DESK', fn: async () => { await N(nth('of_desk', ['A nameplate, a lamp, and nine years of dust. The nameplate says J.B. GARFIELD, DETECTIVE. It also, in very small letters, says (REPUTATION NOT INCLUDED).', 'Somebody wrote REPUTATION NOT INCLUDED in tiny letters and was either being funny or being accurate.'])); } },
    { name: 'DESK DRAWER', fn: async () => { if (has('LASAGNA') || F('lasagna')) return N('Empty drawer. Empty like a man after a favorite meal.'); setF('lasagna'); give('LASAGNA'); await N('A drawer with exactly one thing in it: a lasagna. Foil-covered. Labeled in my own handwriting: DO NOT EAT. DO NOT EVEN THINK ABOUT IT.'); await J('Nine years. It looks exactly as it did the day I put it here.', 'dead'); await K_('That is either excellent storage or a threat.', 'scan'); await J('It\'s lasagna. It\'s fine.', 'smug'); } },
    { name: 'FILE CABINET', fn: async () => {
      if (F('file')) return N('The cabinet has nothing more to say. It\'s a cabinet.');
      setF('file'); await N('A file cabinet, third drawer labeled HAROLD, J.B. Inside: one folder, thin as a lie.'); await N('J.B. HAROLD. Human. LITTER detective. Missing nine years. Last investigation: Sunday\'s Frozen Foods. Final note, handwritten:'); await N('"If you find this, I\'m already someone else. The backup is in the walk-in. Trust the cat. Don\'t trust the Chief. I think she knows."');
      await J('The backup is in the walk-in.', 'wide'); await K_('That is where I found you.', 'scan'); await J('Don\'t. I need a minute with that sentence.', 'hurt'); clue('file', 'Harold\'s last note: the backup is in the walk-in, trust the cat, and "I think the Chief knows."');
      await N('I did not need a minute. I needed a different universe. I took the minute anyway.');
    } },
    { name: 'WINDOW', fn: async () => { await N('Blinds, bars of light, neon. The city looks like a cassette tape from the inside. A big cyan SUNDAY\'S sign sits on the skyline like it\'s waiting to be named in a will.'); } },
  ],
  ask: [
    { name: 'CHIEF VANE: THE MISSION', fn: async () => { await say(nth('v_m', ['Find the source of the copycats. Sunday\'s plant. Go down. Everything points down.', 'I do not give a pep talk. I give a mission. Pep is a department I cut.']), 'VANE'); } },
    { name: 'CHIEF VANE: HAROLD', fn: async () => { await J('Tell me about Harold.', 'dead'); await say('He was brilliant. He was reckless. He signed his own transfer and went in alone. A tragedy.', 'VANE'); await J('Signed his own transfer.', 'think'); await say('Yes. Is there an echo in here?', 'VANE'); } },
    { name: 'CHIEF VANE: LASAGNA', if: () => has('LASAGNA'), fn: async () => { await J('Chief. Lasagna? Nine years old. It\'s mine.', 'smug'); await say('I don\'t eat layered pasta products.', 'VANE'); await J('It\'s lasagna.', 'dead'); await say('It is a layered pasta product.', 'VANE'); await N('She said it the way you say a word you had to look up. I kept the foil on. I kept the thought off.'); clue('noeat', 'Vane refuses lasagna and calls it "a layered pasta product".'); } },
  ],
  move: [['OUT TO THE STREET', 'street']],
};

SC.morgue = {
  name: 'NEO MONDAY MORGUE', art: 'morgue', music: 'morgue',
  async enter() {
    if (F('morgue')) return; setF('morgue');
    await N('The morgue kept its own weather. Colder than the freezer and a lot less friendly about it. A woman in a white coat and round glasses was working at a table, humming something she hadn\'t decided on.');
    await say('Detective Garfield. I was told you were dead.', 'MIRA'); await J('People keep telling me I\'m something.', 'dead'); await say('I\'m Dr. Mira Soto. I have what you\'re here for. Come around. Don\'t touch the sheet.', 'MIRA');
  },
  async look() { await N(nth('mo_look', ['Steel drawers, a table, a lamp bright enough to cross-examine you. Eighteen drawers, each with a name card, each name card in the same neat hand.', 'One drawer, number seven, is slightly out of line. Somebody opens it a lot.'])); },
  inv: [
    { name: 'THE BODY ON THE TABLE', fn: async () => { await N('Under the sheet: a copycat shell, opened like a lunchbox. Chassis stamped SF. Under the chrome, a layer of pink bio-sheet printed in rows.'); await say('Same sheet as the plant\'s lasagna line. The only difference is the sauce.', 'MIRA'); await J('I asked for one body. You\'ve given me the whole business model.', 'smug'); } },
    { name: 'DRAWER 07', fn: async () => {
      if (F('drawer')) return N('Drawer seven is open. I don\'t need to look again. I don\'t think I could.');
      setF('drawer'); await N('She slid the drawer out herself. The man inside was human, forty-something, square chin, a coat I knew the cut of. A fedora on his chest like a medal.');
      await J('That\'s... his hat. That\'s my hat.', 'hurt'); await say('Harold. J.B. Harold. Recovered nine years ago from the plant\'s sublevel. He was sitting at a desk with a terminal. He was still typing.', 'MIRA');
      await say('Look at the back of his neck.', 'MIRA'); await N('At the base of the skull, a small port with a label in steel: GARFIELD. Not a name. A file.');
      await J('A port. For a backup.', 'wide'); await K_('Subject J.B. GARFIELD. System type: backup of a human mind, stored as a detective persona in cat form. Origin: J.B. HAROLD.', 'err'); await J('I\'m a copy.', 'hurt');
      await say('You\'re a detective. A copy of one. He built you to carry what he knew, Garfield. Not to stand in for him.', 'MIRA'); await N('I\'d like to say something wise. I said nothing. Sometimes the cleverest thing a cat can do is sit.'); clue('port', 'Harold has a port in his skull labeled GARFIELD. The backup of a human mind. Me.');
    } },
    { name: 'TOE TAG', if: () => F('drawer'), fn: async () => {
      if (hasClue('transfer')) return N('The toe tag has said everything it\'s going to say. It\'s a tag. It has good penmanship.');
      await N('A toe tag. Name, time, cause. Time of death: Monday. Cause: terminal failure. Authorizing signature on the transfer order that sent him down: D. VANE, 12 minutes before he died.'); await J('Twelve minutes.', 'think');
      await say('The transfer order. She signed the paper that put him in the room where he died. Twelve minutes later, he died in it.', 'MIRA'); await J('And she told Lucky he died "in the field".', 'dead'); await J('The field was a basement.', 'smug'); clue('transfer', 'The transfer sending Harold to the plant sublevel was signed by D. VANE twelve minutes before he died.');
      setF('knows'); await morgueAmbush(); await K_('That is two clues pointing at the same person.', 'scan'); await J('That\'s what I was afraid of. Two clues is where a theory starts to get a personality.', 'dead');
    } },
  ],
  ask: [
    { name: 'MIRA: THE COPYCATS', fn: async () => { await say(nth('mi_c', ['They\'re grown. The face, the skin, even the fingerprints. The chassis is metal, but the person on top is a print. That\'s what the lasagna line is for. Eleven layers: bone-sheet, sinew-sheet, skin, sauce.', 'The sauce is not part of the process. The sauce is just there. I don\'t know why.']), 'MIRA'); await J('I\'ll never look at a trattoria the same way.', 'dead'); } },
    { name: 'MIRA: THE CHIEF', fn: async () => { await say('Chief Vane? She hasn\'t been to a physical in nine years. Says she\'s too busy. I\'ve been sending reminders to her spam folder.', 'MIRA'); await J('Does she have a spam folder?', 'dead'); await say('She does now.', 'MIRA'); } },
    { name: 'MIRA: ME', fn: async () => { await say('I\'m a pathologist. I talk to people who are done talking. You\'re my first live customer this decade. Try not to make it a habit.', 'MIRA'); await J('I\'ll do my best. Cats are famously cooperative.', 'smug'); } },
  ],
  move: [['OUT TO THE STREET', 'street']],
};

// ---------- the phone ----------
Object.assign(PHONES, {
  async lucky() { await N('A two-tone ring. A screen that shows a red eye and a very wet glass.'); await say('Lukewarm. We\'re open-ish.', 'LUCKY'); await J('It\'s me. The cat who owes you.', 'dead'); await say('Everybody owes me. You owe me least.', 'LUCKY'); },
  async mira() { await say('Soto. Whatever it is, I\'m at the table. Don\'t call during lunch. I never take lunch. Call during the thing after.', 'MIRA'); await J('Understood.', 'dead'); },
  async chief() { await N('The line connects to a blank screen. A voice, cool and level, says "State your business and keep it under a minute."'); await J('Just checking in.', 'dead'); await say('You\'re not checking in. You\'re checking on me. Both of those are on the record.', 'VANE'); await N('The line went dead the way a cat goes still.'); },
  async sundays() {
    await N('A cheerful jingle. A recorded voice: "Thank you for calling Sunday\'s Frozen Foods, where every layer counts."'); await say('Press one for orders. Press two for complaints. Press three if you are a copycat. Press four for the employee hotline.', 'KUMA');
    const c = await choose(['1: ORDERS', '2: COMPLAINTS', '3: I AM A COPYCAT', '4: EMPLOYEE HOTLINE'], { x: 180, y: 40, cancel: 1 }); if (c < 0) return;
    if (c === 0) { await N('"Your order has been received. Your order has always been received."'); }
    else if (c === 1) { await N('"Your complaint is important to us. Please hold. Please hold. Please hold. We\'ll wait."'); await J('I\'m going to hang up on a recording and it\'s going to feel good.', 'smug'); }
    else if (c === 2) { await N('"Welcome home. Please proceed to Sublevel Twelve. The code of the day is on your forehead."'); await J('I... don\'t have a forehead. I have a hat.', 'dead'); await K_('That is a clue about hats!', 'happy'); setF('code'); }
    else { await N('"Employee hotline. For the door code of the day, please state the day."'); await J('Monday.', 'dead'); await N('"Correct! Have a lovely Monday."'); setF('code'); clue('code', 'The sublevel door code is the day. The day is Monday. Every day.'); await J('Of course. The only secret in this city is the thing they said on page one.', 'smug'); }
  },
});

// ---------- ACT 3 : DISK 3 : THE LAYER ----------
async function liftDown() {
  await N('A service lift behind the layering machine. A keypad and a small plaque: SUBLEVEL 12. ENTER THE DAY.');
  const days = ['FRIDAY', 'SUNDAY', 'MONDAY', 'TUESDAY'];
  for (;;) { const c = await choose(days, { x: 200, y: 30, title: 'THE DAY', cancel: 1 }); if (c < 0) return; if (days[c] === 'MONDAY') break; await N(nth('lift_wrong', ['WRONG. The lift buzzes the way a vending machine says no.', 'WRONG. The plate has an opinion about my choice.', 'WRONG. It\'s Monday. It has always been Monday. Why am I trying other days?'])); }
  setF('basement'); sfx('door'); await J('Monday. Of course.', 'smug'); await N('It\'s the one word the city never lies about. The lift began to fall.'); await goto('basement');
}
const BOSS_FIGHT = {
  scene: 'basement', music: 'combat', boss: 1, bossName: 'THE CHIEF', slots: [{ x: 256, y: 176 }, { x: 100, y: 176 }, { x: 410, y: 176 }],
  waves: [{ t: 30, slot: 0, hp: 18, aim: 80, boss: 1 }, { t: 240, slot: 1, hp: 2, aim: 80 }, { t: 360, slot: 2, hp: 2, aim: 80 }, { t: 600, slot: 1, hp: 3, aim: 70 }, { t: 640, slot: 2, hp: 3, aim: 70 }],
};
SC.basement = {
  name: 'SUBLEVEL 12: THE LAYER', art: 'basement', music: 'basement',
  async enter() {
    if (F('bossDone')) return;
    await diskCard(3); music('basement'); post.fade = 0;
    await N('The lift opened onto a corridor of vats. In each vat, in a soup of pink sheet and pale light, a copycat shell, hanging. Waiting for a face.'); await K_('Sublevel Twelve. Population: lots of people who are not people.', 'scan');
    await J('Walk softly. Cats are good at it. I\'m going to ask you to not narrate it.', 'dead'); await K_('Understood. I will whisper.', 'happy');
    await N('At the end of the corridor, a terminal glowed green. In front of it, a woman in a blue uniform. She poured something from a glass pitcher into a glass. She did not drink it.');
    await say('You came down. I thought you would. The radio said you would.', 'VANE'); await J('You were the radio.', 'dead'); await say('A good one.', 'VANE', { mood: 'cool' });
    await J('Chief. We need to talk about nine years of a diet.', 'smug');
    await say('Do we.', 'VANE'); await accusation(); await bossAndEnding();
  },
  async look() { await N('A long cold corridor of vats. A green glow at the end. The only sound is the sound of everything running.'); },
  inv: [], ask: [], move: [],
};
async function accusation() {
  const need = { transfer: 0, noeat: 0, file: 0 }; let wrong = 0;
  const E_ = {
    transfer: ['You signed Harold\'s transfer twelve minutes before he died.', 'The signature is mine. As Chief, I sign things. It is a long, tedious part of my job.', 'And it\'s the one time you signed something that sent a man to his own funeral.'],
    noeat: ['You haven\'t had a drink in nine years. You called lasagna a "layered pasta product".', 'I\'m a woman of discipline.', 'You\'re a woman of no stomach.'],
    file: ['Harold\'s last note said: "I think the Chief knows."', 'A man who died in a basement is hardly an authority on anything.', 'He was an authority on you.'],
  };
  await J('Let me lay it out. In order. A good detective does it in order.', 'smug');
  while (Object.values(need).some(v => !v)) {
    const clues = S.clues.map(c => c[0]), opts = ['badge', 'chassis', 'layers', 'radio', 'stool', 'lucky', 'diet', 'port', 'transfer', 'noeat', 'file'].filter(c => clues.includes(c));
    const labels = opts.map(c => S.clues.find(x => x[0] === c)[1]);
    const i = await choose(labels, { x: 8, y: 14, wrap: 54, title: 'PRESENT EVIDENCE', cancel: 0 }), k = opts[i];
    if (E_[k] && !need[k]) { need[k] = 1; await J(E_[k][0], 'smug'); await say(E_[k][1], 'VANE'); await J(E_[k][2], 'smug'); sfx('object'); post.flash = .3; await N('Her face didn\'t move. The glass in her hand did. Just a little. It\'s the only thing I got that wasn\'t a line.'); }
    else if (E_[k]) { await say('You\'ve said that already. Cats repeat. Why is that?', 'VANE'); }
    else { wrong++; await say(nth('vane_wrong', ['A cat with a theory. How novel. Is there another part?', 'That\'s true, and it points at somebody else. Try again.', 'You\'re not guessing. You\'re rummaging.']), 'VANE'); if (wrong > 1) await K_('That clue is real, but it points at the plant, not the person. Try the ones about her.', 'scan'); }
  }
  await say('Well. That is three. I\'d clap, but I\'ve never learned.', 'VANE'); await say('You\'re a backup, Garfield. Of a man I buried. Only Harold\'s mind opens Sublevel Twelve. Only you carry it. I woke you for the door.', 'VANE');
  await J('And the copycats?', 'dead'); await say('Layers, Detective. That\'s how you build a person. Eleven layers, and a little sauce. Everybody I turn is a person who was already gone.', 'VANE'); await J('You\'re one of them.', 'hurt');
  await say('The first one. Dorothy Vane died nine years ago in a car on the way to a meeting. I took her seat.', 'VANE', { mood: 'copy' }); post.flash = .8; sfx('boom');
  await say('You are a very good listener. It\'s the only thing I ever liked about you.', 'COPYCAT');
}
async function bossAndEnding() {
  await K_('OH NO. OH NO. THIS IS THE LARGE ONE. Arrows to aim, A to fire, hold B to aim slowly! Her weak spot is her head!', 'err'); await J('Her weak spot is a surprisingly large number of things.', 'dead');
  await fight(BOSS_FIGHT); setF('bossDone'); music('basement');
  await N('She came apart the way a bad idea does: all at once, and then a long time of small noises. Chrome on the floor. A pitcher of ginger ale rolling in slow circles, intact.'); await K_('Target neutralized! The Layer is down!', 'happy');
  await J('The Layer. She was the first one.', 'hurt'); await N('The terminal at the end of the corridor flickered green. A face resolved on it: a man, square chin, a hat that I knew the way you know a language you were born into.');
  await say('Detective Garfield.', 'HAROLD'); await J('Harold.', 'hurt');
  await say('I built you in the last twelve minutes. I thought you\'d be a tool. A mask. A good coat on a good cat. You weren\'t. You were a person the second you woke.', 'HAROLD');
  await say('I can come back. The system has my mind, and the port at your neck is the way in. I\'d wake, and you\'d be a file.', 'HAROLD'); await J('That\'s one option.', 'dead'); await say('Or I can be deleted. Clean. You\'d keep every bit of what you are, and I\'d stop being anywhere.', 'HAROLD'); await J('That\'s two.', 'dead');
  await say('Or I can be a file you open. When you want. You keep going as you.', 'HAROLD'); await J('That\'s three.', 'dead'); await say('I\'ll be fine with any of them. I\'ve been dead for nine years. I\'m a very patient man.', 'HAROLD');
  const c = await ask('Which one?', null, ['MERGE. LET HAROLD WAKE.', 'DELETE. I\'M ENOUGH.', 'KEEP GOING. AS ME.']);
  await ending(c);
}
async function ending(c) {
  const kind = ['merge', 'delete', 'keep'][c]; setF('ending', kind); music('end'); const meta = fetchStore('neomonday_meta') || { ends: {} }; meta.ends[kind] = 1; store('neomonday_meta', meta);
  if (c === 0) {
    await J('Wake up, Harold. Nobody\'s been playing your song.', 'hurt'); await say('Thank you, Garfield. I\'ll keep the hat. Close the file when it\'s done.', 'HAROLD'); await N('There was a long hum. Then a longer one. Then a man in a cat\'s coat stood in a corridor that smelled of cheese and sauce.');
    await say('...Is it Monday?', 'HAROLD'); await K_('It is always Monday.', 'happy'); await say('I never liked lasagna.', 'HAROLD'); await N('It was the first and last thing JB Garfield would have disagreed with.');
    await showCard(['ENDING 1: MERGE', '', 'Harold walked out of Sublevel Twelve in a borrowed coat.', 'The Litter hired a cat to replace him.', 'Nobody has seen the cat since. He is, they say, enjoying a long lunch.'], 0, { col: hex('#8ae8ff') });
  } else if (c === 1) {
    await J('I\'m enough. I\'d like to keep being enough.', 'dead'); await say('Understood. It\'s been a pleasure being the original.', 'HAROLD'); await N('The face on the terminal smiled once, a little crooked, and went out like a lamp.');
    await K_('File deleted! You are now the only copy! Statistically a bit lonely!', 'happy'); await J('Statistically. Great.', 'dead'); await N('I walked out of that basement under my own power. In the elevator I found the half-eaten lasagna I\'d been carrying in my coat and ate it. All of it. It was delicious.');
    await showCard(['ENDING 2: DELETE', '', 'The Layer is closed. The vats are empty.', 'JB opened an office with his name on the door and a sign: CLOSED MONDAYS.', 'It is the only sign in the city that is true.'], 0, { col: hex('#ffb258') });
  } else {
    await J('Keep going. Both of us. You\'re a file I open when I need to hear it from somebody who was there.', 'smug'); await say('That\'s the nicest thing anybody\'s done with my death.', 'HAROLD'); await N('The port at my neck clicked once, and closed. Not locked. Closed. There\'s a difference.');
    await say('Garfield. What are you going to do now?', 'HAROLD'); await J('Same as before. Find out who I am. Who I want to be. It\'s a long case.', 'smug'); await say('That sounds like a good one.', 'HAROLD'); await J('The best ones don\'t close. They just stop being urgent.', 'smug');
    await N('Upstairs, a rain that had finally decided to be rain. A kind of Monday that was only partly a Monday. A cat in a coat with a name he picked. I lit a cigarette I didn\'t have. I had a lasagna I did.');
    await showCard(['ENDING 3: KEEP GOING. AS ME.', '', 'JB GARFIELD, detective.', 'Reputation not included.', 'Lasagna, always.', 'Mondays, closed.'], 0, { col: hex('#7ae0ff') });
  }
  try { localStorage.removeItem('neomonday_sav'); } catch (e) {}
  await credits(); await toTitle();
}
async function credits() {
  const L = ['NEO MONDAY', 'THE CAT WHO KNEW TOO LITTLE', '', 'JB GARFIELD', '...DETECTIVE. REPUTATION NOT INCLUDED', '', 'KUMA', '...HELPFUL. UNPAID', '', 'CHIEF VANE', '...EVERY LAYER COUNTS', '', 'DR. SOTO', '...AT THE TABLE. NEVER LUNCH', '', 'LUCKY', '...OPEN-ISH', '', 'J.B. HAROLD', '...A PATIENT MAN', '', 'SPECIAL THANKS', 'THE VIEWERS', '(THEY KNOW WHAT THEY DID)', '', '', '(C)1993 MIDNIGHT MONDAY SOFT.', 'IT IS MONDAY.'];
  let y = H + 10; scene = { draw() { cls(); L.forEach((l, i) => { const yy = y + i * 14; if (yy > -8 && yy < H) ctext(l, yy, l === 'NEO MONDAY' || l === 'JB GARFIELD' ? hex('#ffd24a') : hex('#c8d4ff')); }); } };
  await fadeIn(.1); while (y > -L.length * 14 + 80) { y -= .5; await nextFrame(); } await wait(120); await fadeOut(.04);
}

boot();
