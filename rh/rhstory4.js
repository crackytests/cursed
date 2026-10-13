'use strict';
// ================= CARL: RESIDENT HUMAN. the four extra rooms and what they are for =================
const wrapEnts = (id, extra) => { SCENES[id].ents = ((old) => () => old().concat(extra()))(SCENES[id].ents); };
const prop = (id, x, z, label, talk, o = {}) => Object.assign({ id, kind: 'prop3', at: [x, 0, z], label, range: 1.8, draw3: () => {}, talk }, o);
// ---------------- the doors in ----------------
wrapEnts('lobby', () => [prop('officedoor', -12.4, 9.4, 'LEASING OFFICE', () => officeDoor(), { to: 'office' }), prop('dinerdoor', -12.4, 12.6, 'THE DINER', () => dinerDoor(), { to: 'diner' })]);
wrapEnts('mallB1', () => [prop('modeldoor', 12, 17.6, 'MODEL UNIT 0', () => goScene('model', 0, 1.8, 0), { to: 'model', cond: () => C3.ch >= 4 })]);
wrapEnts('b2', () => [prop('door10', 7, 8.2, 'DOOR 10', () => { if (!F3('deeDone')) return say(`DOOR 10. SOMEONE ON THE OTHER SIDE IS BREATHING VERY QUIETLY.`, null); return goScene('apt10', 0, 1.8, 0); }, { to: 'apt10' })]);
SCENES.office.exits = leave('lobby', -11.4, 9.4); SCENES.diner.exits = leave('lobby', -11.4, 12.6); SCENES.model.exits = leave('mallB1', 12, 16.4); SCENES.apt10.exits = leave('b2', 7, 7);
async function officeDoor() {
  if (C3.ch === 1 && !F3('officeWarn')) { setF3('officeWarn'); await say2([[LI3, `Oh, that's staff. Staff and the occasional resident with a question. Come in! It's open. Everything's open. It's a building.`]]); }
  return goScene('office', 0, 1.8, 0);
}
async function dinerDoor() { return goScene('diner', 0, 1.8, 0); }
// ---------------- the leasing office ----------------
SCENES.office.ents = () => [
  prop('cabinet', -4.2, 7.4, 'FILE CABINETS', () => cabinet()),
  prop('desk', 0, 4.6, 'LINDA\'S DESK', () => lindaDesk()),
  prop('corkboard', -5.2, 4.2, 'CORKBOARD', () => say(`PHOTOS OF EVERY RESIDENT, EACH WITH A GREEN STICKER: VERIFIED. ROZ HAS A STICKER. ORRIN HAS A STICKER (IT'S THE SAME ONE). THERE'S A PUSHPIN WITH NOTHING UNDER IT, AND A PENCIL OUTLINE WHERE A PHOTO WAS.`, null)),
  prop('copier', 5.2, 6.2, 'COPIER', () => copier()),
];
async function cabinet() {
  if (C3.ch < 2) return say(`FILE CABINETS LABELED BY UNIT. THE DRAWER FOR 3A IS THIN. IT HAS ONE SHEET: YOUR LEASE, WITH "HUMAN" CIRCLED TWICE.`, null);
  if (!F3('evNoise')) { setF3('evNoise'); sfx('get'); await say(`NOISE COMPLAINT, UNIT 3A, 3:07 A.M. FILED BY NORMAL LIVING "ON BEHALF OF THE BUILDING." UNDER SOURCE, SOMEONE HAS WRITTEN BY HAND: "SOMETHING KNOCKED BACK." THE HANDWRITING IS LINDA'S.`, null); return say(`THE NEXT FOLDER IS THICKER. IT'S A COMPLAINT FROM THE SEVENTIES. THE SAME KNOCK. THE SAME TIME. SOMEBODY'S BEEN FILING THIS FOR FIFTY YEARS.`, null); }
  return say(`THE DRAWERS ARE FULL OF COMPLAINTS ABOUT THE SAME FEW THINGS: NOISE, LIGHTS, AND "A PRESENCE IN THE WALL." EVERY ONE IS STAMPED RESOLVED.`, null);
}
async function lindaDesk() {
  if (inspectionActive()) return inspectionDesk();
  if (C3.ch < 4) return say(`LINDA'S DESK. A STICKY NOTE ON THE MONITOR: "BE NORMAL." IT'S HER HANDWRITING. IT'S ADDRESSED TO HER.`, null);
  if (!F3('sawSchedule')) {
    setF3('sawSchedule'); sfx('get');
    await say2([['CARL', `That's the schedule.`]]);
    return say(`A FOLDER MARKED "FULL RESET. MIDNIGHT. ALL NON-STANDARD UNITS." PHASE 1: THE LIGHTS. PHASE 2: THE DOORS. PHASE 3: "RESIDENTS WILL BE NOTIFIED BY THE LIGHTS GOING OUT." THE LAST LINE IS HANDWRITTEN: "I'M SORRY. IT'S THE LEASE."`, null);
  }
  return say(`THE FOLDER IS STILL THERE. SHE LEFT IT OPEN, LIKE SOMEONE WHO WANTS TO BE CAUGHT.`, null);
}
async function copier() {
  if (!F3('sawSchedule')) return say(`A COPIER. IT'S WARM. A PAPER JAM LIGHT IS ON. IT'S ALWAYS ON.`, null);
  if (F3('gotSchedule')) return say(`THE COPIER IS TIRED. YOU ALREADY HAVE YOUR COPY.`, null);
  await say2([['CARL', `If I copy it, I have it. If I take it, she knows.`]]);
  if (!await fix('COPIER', 4)) return;
  setF3('gotSchedule'); sfx('get'); await say(`THE COPIER SPITS OUT FOUR PAGES AND A WARM FEELING. YOU FOLD THEM INTO YOUR BOW TIE, WHICH IS A PLACE THEY CAN'T BE FOLDED.`, null);
  tickC('HE COPIED THE SCHEDULE', 'user_000');
}
// ---------------- the diner ----------------
SCENES.diner.ents = () => [
  npcR('bead', 'bea', 0, 6.6, 'BEA', () => dinerBea(), { range: 2.4, cond: () => C3.ch >= 2 && !inspectionActive() }),
  npcR('c1', 'suit', -3.6, 4.6, 'CUSTOMER', () => say(`THE CUSTOMER LOOKS AT YOU WITH HIS EYES. THEY ARE EXACTLY THE SAME DISTANCE APART AS THE NEXT CUSTOMER'S.`, null), { range: 1.6 }),
  npcR('c2', 'farmer', 3.6, 4.6, 'CUSTOMER', () => say(`"THE USUAL," SAYS THE CUSTOMER. "WHATEVER IS STANDARD."`, null), { range: 1.6 }),
  prop('jukebox', -5.4, 8.2, 'JUKEBOX', () => jukebox()),
  prop('counter', 3.2, 6.8, 'COFFEE / DELIVERIES', () => inspectionActive() ? inspectionBox() : say(pick([`THE COFFEE TASTES LIKE A TIME OF DAY. THE TIME IS 3:07.`, `YOU DRINK THE COFFEE. IT'S HOT. IT'S THE ONLY THING IN THIS BUILDING THAT IS EXACTLY WHAT IT SAYS.`]), null)),
];
async function jukebox() {
  if (!F3('radioOK')) return say(`THE JUKEBOX PLAYS ONE SONG: A WOMAN READING THE WEATHER FOR A CITY THAT ISN'T ON ANY MAP. SOMEONE HAS TAPED A NOTE: "NOT BROKEN. DON'T ASK."`, null);
  return say2([['CARL', `That's Orrin's station.`], [`THE JUKEBOX`, `(TRAFFIC REPORT) ALL EXITS ARE OPEN. ALL EXITS GO HOME.`]]);
}
async function dinerBea() {
  if (!F3('dinerAsked')) {
    setF3('dinerAsked');
    await say2([[BE, `Carl. You're quiet. I'm quiet. Everybody here is quiet. It's a diner.`], [BE, `I work the overnight. It's me and four customers. They come at 3:07 and order whatever is standard. I've asked them for their names. They said "resident."`], [BE, `I need ten minutes. My feet. Cover the floor? Three tables, three plates. You don't have to talk. You're good at not talking.`]]);
  }
  if (F3('dinerDone')) return say2([[BE, pick([`You were good at it. The tables didn't notice. That's the highest compliment I give.`, `Sit anywhere. Everything's the usual.`])]]);
  const k = await ask(`BEA NEEDS TEN MINUTES.`, BE, [`I'LL COVER THE FLOOR`, `NOT TONIGHT`]);
  if (k === 1) return say2([[BE, `Okay. My feet and I will survive.`]]);
  await orders();
}
async function orders() {
  const want = [[`THE MAN IN THE BOOTH`, `PANCAKES`], [`THE WOMAN AT THE COUNTER`, `SOUP`], [`THE KID WITH THE FORK`, `PIE`]], menu = [`PANCAKES`, `EGGS`, `SOUP`, `PIE`];
  await say(`THREE TABLES. THEY'LL TELL YOU WHAT THEY WANT ONCE. YOU HAVE A TRAY WITH FOUR PLATES.`, null);
  for (const [who, dish] of want) await say(`${who}: "I'LL HAVE THE ${dish}, PLEASE. I'M NOT GOING TO SAY IT AGAIN."`, null);
  let right = 0, left = menu.slice();
  for (const [who, dish] of want) {
    const k = await ask(`WHAT DOES ${who} GET?`, null, left); const got = left[k]; left.splice(k, 1);
    if (got === dish) { right++; await say(`${who}: "THANK YOU." (THEY ARE VERY CALM ABOUT IT.)`, null); } else await say(`${who} LOOKS AT THE ${got}. "THIS ISN'T WHAT I ASKED FOR," THEY SAY, AND THEN EAT IT ANYWAY, POLITELY, LIKE THE LEASE REQUIRES.`, null);
  }
  setF3('dinerDone'); good('bea', right + 1); good('bea', 0);
  await say2([[BE, right === 3 ? `Three for three. You write orders in your head like a person who's been yelled at by menus.` : right ? `${right} out of 3. Perfect. The last time a resident covered for me it was zero.` : `Zero out of three. That's fine. They didn't complain. They never complain. That's what I worry about.`], [BE, `Thank you. Also: nobody's ever asked about the four of them. You asked with your face. Keep doing that.`]]);
}
// ---------------- MODEL UNIT 0 ----------------
SCENES.model.ents = () => [
  prop('tag', 3.2, 6.4, 'THE STANDARD RESIDENT', () => modelTag(), { draw3: e => { drawModel(MODELS_P.orrin, { p: [3.2, .8, 7.4], yaw: 3.14 }, liveLight(WX.sc, e.p)); } }),
  prop('family', -3.4, 5.4, 'THE FAMILY', () => say(`THREE MANNEQUINS ON A COUCH, IN FAMILY POSITIONS. THEIR FACES ARE SMOOTH. A PLACARD: "THE STANDARD FAMILY (PLEASE DO NOT WAKE)."`, null), { draw3: e => { for (const [x, m] of [[-4.2, 'suit'], [-3.4, 'waitress'], [-2.6, 'kid']]) drawModel(MODELS_P[m], { p: [x, .55, 6.8], yaw: 3.14 }, liveLight(WX.sc, e.p)); } }),
  prop('clause', 0, 7.2, 'FRAMED CLAUSE', () => modelClause()),
  prop('modelout', 0, 1.8, 'DOOR', () => goScene('mallB1', 12, 16.4, 0), { cond: () => false }),
];
async function modelTag() {
  await say(`A MANNEQUIN IN A BED, COVERED TO THE CHIN. ITS HEAD HAS A SMALL ANTENNA. AROUND ITS WRIST, A TAG: "STANDARD RESIDENT #1 (RETIRED). UNIT 0."`, null);
  if (!F3('tagSeen')) { setF3('tagSeen'); await say2([['CARL', `That's... Orrin.`], ['CARL', `That's Orrin's tag. Orrin was the display.`]]); }
  else await say(`THE BED IS NEATLY MADE, EXCEPT FOR A DENT WHERE SOMEONE SAT UP AND DECIDED TO LEAVE.`, null);
}
async function modelClause() {
  await say(`A FRAMED CLAUSE ON THE WALL. "OCCUPANCY MEANS BEING PRESENT IN THE UNIT AND RESPONDING TO THE BUILDING." IT DOES NOT SAY "HUMAN." IT SAYS "BEING PRESENT AND RESPONDING."`, null);
  if (!F3('modelProof')) { setF3('modelProof'); sfx('get'); await say2([['CARL', `It's not in the lease. It's in the model.`], ['CARL', `The model says occupancy means being here and answering the door. I can do that. Nell can do that. Anyone who knocks can do that.`]]); }
}
function orrinOrigin() {
  return (async () => {
    setF3('orrinOrigin'); good('orrin', 3);
    await say2([['CARL', `Orrin. I found Unit 0. Your tag.`], [OR, `...Oh. You went to the model. You looked at the bed.`], [OR, `I was the display. I was Standard Resident Number One. I stood very still for one year, two months, and nine days.`], [OR, `One morning, someone knocked on the glass. I sat up. I've been answering ever since.`], [OR, `I have never said that aloud. It feels like a form with no boxes. I like it.`], ['CARL', `You're a resident.`], [OR, `I am a resident who happened.`]]);
  })();
}
// ---------------- Dee's: the other side of the wall ----------------
SCENES.apt10.ents = () => [
  npcR('dee2', 'kid2', -1, 4.6, 'DEE', () => say2([[DEE, pick([`Mom does the marks on her side. I do them on mine. They line up. I checked.`, `You're the one who talks through walls? You're not very good at it. I can hear your shoes.`, `Do you think she's still got the cardigan?`])]]), { range: 2.2 }),
  prop('marksB', 3.5, 7.6, 'THE MARKS', () => marksWall()),
];
async function marksWall() {
  await say(`THE SAME HEIGHT MARKS, ON THE SAME WALL. THIS ONE IS THE B2 SIDE. THE PLASTER IS THIN HERE. YOU CAN HEAR SOMEONE ON THE OTHER SIDE, MAKING SOUP.`, null);
  if (!F3('deeMark')) return say2([[DEE, `If someone would draw one on her side, she'd know. She keeps stopping at the last one. It's from eight years ago.`]]);
  if (F3('wallTalk')) return say(`THE WALL IS QUIET IN THE WAY A FULL ROOM IS QUIET.`, null);
  setF3('wallTalk'); good('roz', 2);
  await say2([['CARL', `(knocks twice on the wall)`], [RZ, `(muffled) Who's there? Is that the maintenance man?`], [DEE, `Mom.`], [RZ, `...`], [RZ, `Dee?`], [DEE, `Mom, I got taller.`], [RZ, `I know you did. I saw the line. It's green.`], [DEE, `I'm okay. It's the seventies down here. It's fine. They have a record player.`], [RZ, `Don't you let them give you the sofa with the fish pattern.`], ['CARL', `(to himself) I'm going to give them a minute.`]]);
  await say(`YOU STEP AWAY FROM THE WALL. THE VOICES CONTINUE FOR A LONG TIME. THEY SOUND LIKE EVERYONE ON EARTH.`, null);
}
