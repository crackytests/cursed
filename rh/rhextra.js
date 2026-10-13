'use strict';
// ================= CARL: RESIDENT HUMAN. the content pass: NORMAL LIVING's petty failures, the directory, odd gifts, curtains, Dee's mark =================
// (later declarations replace the earlier ones of the same name)
async function enter(to) {
  const s = SCENES[to], a = s.arrive || [s.start[0], s.start[2], 0];
  if (C3.ch >= 3 && ['apt3B', 'apt3C', 'apt3D'].includes(to) && WX.id === 'floor3' && !F3('nld_' + to)) {
    setF3('nld_' + to); sfx('hurt');
    await say(`THIS UNIT IS NOT ACCEPTING VISITORS. THE STANDARD RESIDENT PREFERS PRIVACY.`, KI);
    const k = await ask(`THE DOOR HAS A LITTLE LIGHT THAT SAYS "PRIVACY".`, null, [`KNOCK ANYWAY`, `WAIT FIVE SECONDS`]);
    await say(k === 0 ? `YOU KNOCK. THE DOOR SAYS "KNOCKING IS NOISE." THEN IT OPENS, RESENTFULLY.` : `YOU WAIT. THE DOOR GETS BORED FIRST.`, null);
  }
  return goScene(to, a[0], a[1], a[2]);
}
async function kioskTalk() {
  if (!F3('lease')) return say(`WELCOME HOME. PLEASE SEE THE LEASING OFFICE. PLEASE BE A RESIDENT.`, KI);
  const opts=['DIRECTORY','HOW AM I DOING','NEVER MIND'];
  if (quietPolicyAvailable()) opts.unshift('QUIET POLICY');
  const k=await ask('NORMAL LIVING. HOW MAY I ADJUST YOU?',KI,opts);
  if (opts[k] === 'QUIET POLICY') return quietKiosk();
  if (opts[k] === 'NEVER MIND') return;
  if (opts[k] === 'HOW AM I DOING') { await say(pick(['YOU HAVE LIVED HERE ' + Math.max(1,Math.floor(C3.time/3600)) + ' MINUTES. YOUR NOISE LEVEL IS: A NUMBER. YOUR HEART RATE IS: ALSO A NUMBER.','PLEASE REMAIN STANDARD.','YOU ARE HOME.']),KI); return; }
  const gone = C3.ch >= 4, rows = [['3A', 'CARL (HUMAN)'], ['3B', 'ORRIN'], ['3C', 'BEA'], ['3D', C3.ch >= 5 ? 'ROZ (UNVERIFIED, REMAINS)' : 'ROZ'], ['3F', gone ? 'NOT FOUND' : 'VACANT (SEALED)'], ['B2', gone ? 'NOT FOUND' : 'UNDER RENOVATION'], ['B2', gone ? 'NOT FOUND' : 'PRINTING ERROR']];
  const prev = scene;
  scene = { draw() { prev.draw(); plate(30, 30, 260, 150, { alpha: .96 }); shadowText('DIRECTORY', 44, 38, UI3.name); rows.forEach(([u, n], i) => { text(u, 46, 62 + i * 14, UI3.dim); text(n.slice(0, 38), 80, 62 + i * 14, /NOT FOUND/.test(n) ? hex('#ff7ae0') : UI3.text); }); text(gone ? 'SEVERAL RESIDENTS WERE REMOVED FROM THIS LIST. THEY REMAIN.' : 'LAST UPDATED: STANDARD', 44, 166, UI3.dim); } };
  await waitBtn(); scene = prev;
}
async function mailroom() {
  if (C3.ch === 1 && F3('bong') && !F3('pkg')) return packageScene();
  if (C3.ch === 1) return say(`THE LOCKERS. ONE HAS A YELLOW LABEL: "3A. ALSO, PLEASE COLLECT." (NOT YET.)`, null);
  if (C3.ch === 3 && !F3('parcelRoz')) {
    setF3('parcelRoz'); sfx('hurt');
    await say(`A SMALL PARCEL IS STUCK IN THE LOCKER SLOT. THE SCREEN SAYS: "DELIVERY DENIED. SENDER NOT VERIFIED." THE LABEL SAYS: FOR ROZ, 3D. FROM: D.`, null);
    const k = await ask(`THE PARCEL IS HALF IN THE SLOT.`, null, [`TAKE IT TO ROZ`, `LEAVE IT TO THE SYSTEM`]);
    if (k === 0) { setF3('parcelHave'); sfx('get'); return say(`YOU PULL IT OUT. THE LOCKER SIGHS. IT'S A SMALL WARM BOX WITH A MARKER DRAWING OF A HOUSE ON IT.`, null); }
    return say(`THE PARCEL IS RETURNED TO SENDER. THE SENDER IS NOT AT ANY ADDRESS. IT FALLS DOWN A CHUTE.`, null);
  }
  await say(`THE MAIL LOCKERS. EVERYTHING IS ADDRESSED TO "THE STANDARD RESIDENT."`, null);
  if (F3('pkg') && C3.ch >= 2 && !F3('mailNote')) { setF3('mailNote'); await say(`THERE IS A NOTE ON LOCKER 3A: "YOUR PLANT HAS NOT BEEN WATERED. THIS IS NOT A REMINDER. IT IS A FINDING."`, null); }
}
async function marksLook() {
  await say(`HEIGHT MARKS ON THE KITCHEN WALL. THEY GO FROM KNEE-HIGH TO SHOULDER-HIGH. THERE ARE FORTY OF THEM. THE LAST ONE IS YEARS OLD.`, null);
  if (!F3('marksSeen')) { setF3('marksSeen'); await say2([['CARL', `Who's this?`], [RZ, `Dee. Dee grows in the wall, mostly. I stopped asking where.`]]); }
  if (F3('deePen') && !F3('deeMark')) {
    const k = await ask(`YOU HAVE DEE'S PEN. THE TOP MARK IS EIGHT YEARS OLD.`, null, [`DRAW A NEW MARK`, `NOT YET`]);
    if (k === 0) {
      setF3('deeMark'); sfx('get'); good('roz', 3);
      await say(`YOU DRAW A LINE FAR ABOVE THE LAST ONE. IT'S GREEN. YOU WRITE "THIS TALL." YOU DATE IT TODAY.`, null);
      await say2([[RZ, `Is that—`], [RZ, `That's tall. That's so tall. When did she get so tall?`], ['CARL', `She says to tell you she's okay. She's at door 10, on the seventies floor.`], [RZ, `...Door 10. I'll bring a casserole.`]]);
    }
  }
}
// ---------------- the corridor's walls, and what's under them ----------------
SCENES.floor3.ents = ((old) => () => old().concat([{ id: 'peel', kind: 'prop3', at: [-6.4, 0, 8.3], label: 'PEELING WALL', range: 1.6, draw3: () => {}, cond: () => C3.ch >= 4, talk: () => say(C3.ch >= 5 ? `THE WALLPAPER HAS PEELED FURTHER. UNDERNEATH IS TILE FROM A DIFFERENT BUILDING, AND UNDER THAT A DOOR WITH A BRASS 12 ON IT. THERE'S A DOORMAT.` : `A STRIP OF WALLPAPER IS CURLING OFF THE WALL. BEHIND IT: AVOCADO-GREEN PANELING AND A LIGHT SWITCH THAT ISN'T CONNECTED TO ANYTHING. YOU FLICK IT. SOMEWHERE BELOW, A LIGHT GOES ON.`, null) }]))(SCENES.floor3.ents);
// ---------------- Carl is particular about curtains ----------------
SCENES.apt3A.ents = ((old) => () => old().concat([{ id: 'curt', kind: 'prop3', at: [2, 0, 7.2], label: 'CURTAINS', range: 1.8, draw3: () => {}, cond: () => !!C3.decor.curtains, talk: () => curtainsCarl() }]))(SCENES.apt3A.ents);
async function curtainsCarl() {
  const n = C3.hem = (C3.hem || 0) + 1;
  const l = [`THE HEM IS A QUARTER INCH LOW ON THE LEFT. YOU FIX IT.`, `NOW THE RIGHT IS A QUARTER INCH LOW. YOU FIX IT. YOU STEP BACK. YOU FIX IT AGAIN.`, `THE CURTAINS HANG LIKE THEY WERE ASKED TO. YOU FEEL SEEN BY THEM.`, `YOU HAVE TAKEN THEM DOWN AND PUT THEM UP SEVEN TIMES. THE NEIGHBORS CAN HEAR IT. BEA ISN'T EVEN ASLEEP AND SHE'S PROUD OF YOU.`];
  await say(l[Math.min(n, 4) - 1], null);
  if (n === 4) { C3.gifts.push('A LEVEL (FOR THE CURTAIN ROD)'); sfx('get'); }
}
// ---------------- the parcel for Roz (rozTalk in rhstory.js calls this first) ----------------
async function rozParcel() {
  setF3('parcelGiven'); sfx('get'); good('roz', 2);
  await say(`ROZ OPENS THE BOX SLOWLY. INSIDE: A GREEN MARKER, AND A DRAWING OF A HOUSE WITH EVERY WINDOW LIT.`, null);
  return say2([[RZ, `That's Dee's hand. That's the way she does windows.`], [RZ, `Thank you for taking it out of the slot. The machine would have eaten it. It eats everything that isn't standard.`]]);
}
