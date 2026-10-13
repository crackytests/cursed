'use strict';
// Inspection Day: the office advances the schedule, never the real-time clock.
const inspectionActive = () => !!(C3 && C3.ch === 2 && C3.inspection && !F3('inspectionDone'));
const inspectionConditions = () => {
  const i = C3.inspection;
  return { supper: !!(i.mealReady && (i.mode === 'oven' || i.mealPacked)), sleep: i.mode === 'rest' || !!i.wrapped, water: i.mode === 'water' };
};
async function startInspection() {
  C3.inspection = { phase: 1, mode: 'rest', surveyed: {}, checked: {} };
  setF3('inspectionStarted'); saveC3();
  await showCard(['INSPECTION DAY', '1. PREPARATION'], 100, { fg: hex('#ffd848'), sc: 2 });
  await say2([[LI3, 'One last inspection! NORMAL LIVING has generously budgeted services for one standard resident.'],
    ['CARL', 'There are several residents.'],
    [LI3, 'Then several people should be able to agree on being one. Marisol has the requests.'],
    [LI3, 'Preparation, room checks, then the report. Come to my office desk to advance each phase. Nothing starts until you say so.']]);
}
async function beginChapter3() {
  C3.ch = 3; setF3('ghostIn'); setF3('droneUp');
  await say('THE LOBBY INTERCOM CRACKLES: "UNAUTHORIZED VISITOR. UNIT 3A. PLEASE REPORT TO THE LOBBY."', null);
  await showCard(['CHAPTER 3', 'AUTHORIZED OCCUPANTS'], 110, { fg: hex('#ffd848'), sc: 2 }); saveC3();
}
async function inspectionBrief() {
  await say2([[MA, 'Roz is cooking supper for the mixer. Bea needs to sleep before her shift. Someone behind the wall needs water.'],
    [MA, 'Panel D now controls the shared service line. Quiet rest, oven heat, or running water. The building thinks nobody ever needs two things.'],
    ['CARL', 'I can probably handle three things.'],
    [MA, 'You can say that. Or you can ask what they actually need. Talk to all three, then use the office desk when you are ready.']]);
  setF3('inspectionBrief'); saveC3();
}
function inspectionObjective() {
  const i = C3.inspection;
  if (i.phase === 1) {
    if (!F3('inspectionBrief')) return ['Marisol has the inspection requests', 'floor3', 'marisol'];
    if (!i.surveyed.supper) return ['Ask Roz about the mixer supper', 'apt3D', 'roz'];
    if (!i.surveyed.sleep) return ['Ask Bea about her inspection day', 'apt3C', 'bea'];
    if (!i.surveyed.water) return ['The voice has a request. Maintenance vent', 'maint', 'vent'];
    return ['Prepare services; start checks at the office', 'office', 'desk'];
  }
  if (i.phase === 2) {
    if (!i.checked.supper) return ['Check the supper in 3D', 'apt3D', 'roz'];
    if (!i.checked.sleep) return ['Check whether Bea could sleep', 'apt3C', 'bea'];
    if (!i.checked.water) return ['Check the water at the vent', 'maint', 'vent'];
    return ['End the room checks at the office', 'office', 'desk'];
  }
  return ['File the inspection report at the office', 'office', 'desk'];
}
function drawInspectionHUD(y) {
  if (frozen3()) return;
  const i = C3.inspection, r = i.results || inspectionConditions();
  const e = nearest3(), p = e && project(LIVE.cam, [e.p[0], (entModel(e) ? entModel(e).h || 1.2 : 1.2) + (e.promptY || .3), e.p[2]]);
  // Keep the service display below any interaction cue crossing its position.
  if (p && p[0] - (e.label || '').length * 3 - 4 < 210 && p[0] + (e.label || '').length * 3 + 4 > 4 && p[1] - 29 < y + 38 && p[1] - 2 > y) y = Math.ceil(p[1] + 5);
  plate(4, y, 206, 38, { alpha: .85 });
  shadowText('INSPECTION: ' + ['','PREPARE','CHECKS','REPORT'][i.phase], 10, y + 5, UI3.name);
  text('FOOD ' + (r.supper ? 'HOT' : 'COLD') + '  WATER ' + (r.water ? 'ON' : 'OFF'), 10, y + 16, UI3.text);
  text('3C ' + (r.sleep ? 'QUIET' : 'RATTLING') + (i.phase === 1 ? '  CLOCK: OFFICE' : '  SERVICES SEALED'), 10, y + 27, UI3.dim);
}
async function inspectionRoz() {
  const i = C3.inspection;
  if (i.phase !== 1) return inspectionCheck('supper', RZ, 'Still hot. I made enough for everyone. I always make enough for someone who might arrive.', 'It is cold. We can eat it cold. I would rather call it cold than call it fine.');
  if (!i.surveyed.supper) {
    await say2([[RZ, 'The oven worked until they put it on the inspection line. I need heat for the mixer supper.'],
      [RZ, 'The diner has insulated delivery boxes. Heat it here, pack it hot, and the oven can give up its turn.']]);
    await sayMenu(RZ, 'Can you keep it hot?', [{ id: 'supper', label: "I'LL KEEP THE SUPPER HOT." }, { id: null, label: "I'LL SEE WHAT THE LINE CAN DO." }]);
    i.surveyed.supper = 1; saveC3();
  } else await say(i.mealPacked ? 'THE SUPPER IS PACKED HOT IN THE DELIVERY BOX.' : "Roz's oven is at the back counter. It needs Panel D set to OVEN.", null);
}
async function inspectionBea() {
  const i = C3.inspection;
  if (i.phase !== 1) return inspectionCheck('sleep', BE, 'I slept. A whole sleep. I might have a sentence left over for the mixer.', 'That pipe rattled through my whole nap. I will be at the mixer. Mostly in body.');
  if (!i.surveyed.sleep) {
    await say2([[BE, 'Quiet mode lets me sleep. Oven and water modes shake the pipe behind my bed.'],
      [BE, 'There is a clean service towel on the laundry washers. Wrap the loose pipe at Panel D. I do it at work. Pipes like being tucked in.']]);
    await sayMenu(BE, 'Do I get to sleep?', [{ id: 'sleep', label: 'YOU CAN SLEEP THROUGH THE INSPECTION.' }, { id: null, label: "I CAN'T PROMISE IT. I'LL LOOK." }]);
    i.surveyed.sleep = 1; saveC3();
  } else await say2([[BE, 'The laundry towel. Panel D. Or leave it on quiet. I can live with quiet.']]);
}
async function inspectionVoice() {
  const i = C3.inspection;
  if (i.phase !== 1) return inspectionCheck('water', VO, 'The tap stayed on. I washed a dish without negotiating with the building.', 'The tap went dry. I knocked. The inspector wrote down: PIPE NOISE.');
  if (!i.surveyed.water) {
    await say2([[VO, 'Your repair still works. The inspection overrides it. They turn my water off because my unit is not on the sheet.'],
      [VO, 'Panel D has a WATER setting. Leave it there when the checks begin. Put my tap on the report, even if you cannot keep it running.']]);
    await sayMenu(VO, 'Can you keep the water running?', [{ id: 'water', label: "I'LL KEEP YOUR WATER RUNNING." }, { id: null, label: "I'LL WRITE DOWN WHAT HAPPENS." }]);
    i.surveyed.water = 1; saveC3();
  } else await say2([[VO, 'Water mode, at Panel D. I am still here in all the other modes.']]);
}
async function inspectionCheck(id, who, success, failure) {
  const i = C3.inspection, ok = i.results[id];
  if (i.checked[id]) return say(ok ? success : failure, who);
  await say(ok ? success : failure, who);
  if (saidOf(id) && saidOf(id).st === 'OPEN') {
    await callback(id, who, () => say('The room check is recorded. Now there is the thing you said.', who), {
      doIt: async () => {
        if (!ok) { await say2([['CARL', 'I will fix it now.'], [who, 'The service controls are sealed until the report. Write down what happened. Saying it again will not change today.']]); return false; }
        await say2([['CARL', 'I said I would. It worked.'], [who, 'Yes. This time it did.']]);
      },
      admit: async () => { await say2([['CARL', 'I promised before I knew how. It was hypothetical.'], [who, ok ? 'It worked anyway. You can take credit for the work.' : 'Thank you for saying so. Put the failure on the report.']]); good(id === 'supper' ? 'roz' : id === 'sleep' ? 'bea' : 'nell', 1); },
      dbl: async () => { await say2([['CARL', 'I said it was handled. It is handled.'], [who, ok ? 'It is. You could have stopped at that.' : 'Then the report and the room will disagree. I live in the room.']]); if (!ok) good(id === 'supper' ? 'roz' : id === 'sleep' ? 'bea' : 'nell', -1); }
    });
  }
  i.checked[id] = 1; saveC3();
}
async function inspectionPanel() {
  const i = C3.inspection;
  if (i.phase !== 1) return say('PANEL D IS SEALED FOR THE ROOM CHECKS. THE REPORT WILL RELEASE IT.', null);
  await say('PANEL D: ONE RESIDENT, ONE SERVICE. REST IS QUIET. OVEN AND WATER RATTLE THE SHARED PIPE. CURRENT: ' + i.mode.toUpperCase() + '.', null);
  const opts = ['KEEP 3C QUIET', "HEAT ROZ'S OVEN", "RUN THE WALL'S WATER"];
  if (i.towel && !i.wrapped) opts.push('WRAP THE RATTLING PIPE');
  opts.push('LEAVE THE SETTINGS');
  const k = await ask('THE SHARED SERVICE LINE.', null, opts);
  if (k < 3) {
    i.mode = ['rest','oven','water'][k]; sfx('power');
    await say(['THE LINE GOES STILL. THE OVEN COOLS. THE TAP STOPS.', 'THE OVEN HEATS. THE TAP STOPS.' + (i.wrapped ? ' THE PIPE STAYS QUIET.' : ' THE PIPE RATTLES IN 3C.'), 'THE TAP RUNS. THE OVEN COOLS.' + (i.wrapped ? ' THE PIPE STAYS QUIET.' : ' THE PIPE RATTLES IN 3C.')][k], null);
  } else if (opts[k] === 'WRAP THE RATTLING PIPE') {
    i.wrapped = 1; sfx('get'); await say('YOU TUCK THE SERVICE TOWEL AROUND THE LOOSE PIPE. THE RATTLE STOPS. THE BUILDING HAS NO CATEGORY FOR TUCKING.', null);
  }
  saveC3();
}
async function inspectionTowel() {
  const i = C3.inspection;
  if (i.phase !== 1) return say('THE SERVICE TOWEL IS ' + (i.wrapped ? 'HOLDING THE PIPE QUIET.' : 'TOO LATE FOR THIS CHECK. THE CLOCK WAS THE OFFICE DESK.'), null);
  if (i.towel) return say(i.wrapped ? 'THE TOWEL IS WRAPPED AROUND PANEL D. THE PIPE HAS BEEN TUCKED IN.' : 'YOU HAVE THE SERVICE TOWEL. THE LOOSE PIPE IS AT PANEL D.', null);
  const k = await ask('A CLEAN SERVICE TOWEL. "FOR RATTLING PIPES."', null, ['BORROW THE SERVICE TOWEL', 'LEAVE IT']);
  if (k === 0) { i.towel = 1; sfx('get'); await say('YOU TAKE THE TOWEL. IT HAS A SMALL MAP: LAUNDRY -> PANEL D.', null); saveC3(); }
}
async function inspectionBox() {
  const i = C3.inspection;
  if (i.phase !== 1) return say('THE DELIVERY BOXES ARE BACK ON THE COUNTER. TODAY IS ALREADY ON THE REPORT.', null);
  if (i.box) return say(i.mealPacked ? 'THE DELIVERY BOX HAS THE SUPPER IN IT. IT IS STILL HOT.' : "YOU HAVE A DELIVERY BOX. TAKE IT TO ROZ'S OVEN AND PACK THE FOOD WHILE IT IS HOT.", null);
  const k = await ask('AN INSULATED BOX. "HOT FOOD STAYS HOT."', null, ['BORROW A DELIVERY BOX', 'LEAVE IT']);
  if (k === 0) { i.box = 1; sfx('get'); await say('YOU BORROW THE BOX. BEA LEFT A NOTE: "YOU CAN BORROW THIS. YOU CANNOT BORROW MY NAP."', null); saveC3(); }
}
async function inspectionOven() {
  const i = C3.inspection;
  if (i.phase !== 1) return say(i.results.supper ? 'THE SUPPER IS HOT. IT IS GOING TO THE MIXER.' : 'THE SUPPER IS COLD. THE CHECK IS ALREADY RECORDED.', null);
  if (i.mealPacked) return say('THE SUPPER IS PACKED HOT. THE OVEN CAN GIVE UP ITS TURN.', null);
  if (i.mode !== 'oven') return say('THE OVEN IS COLD. PANEL D, IN MAINTENANCE, MUST BE SET TO OVEN BEFORE YOU CAN COOK OR PACK HOT FOOD.', null);
  const opts = i.box ? ['COOK AND PACK THE SUPPER', 'LEAVE IT'] : ['COOK THE SUPPER', 'LEAVE IT'];
  if (await ask("ROZ'S OVEN IS HOT.", null, opts) === 1) return;
  i.mealReady = 1; i.mealPacked = !!i.box; sfx('get');
  await say(i.box ? 'ROZ COOKS. YOU PACK THE DISH INTO THE INSULATED BOX WHILE IT IS HOT. THE LINE CAN RUN WATER NOW.' : 'ROZ COOKS THE SUPPER. IT WILL STAY HOT ONLY WHILE THE LINE IS ON OVEN. THE DINER HAS DELIVERY BOXES.', null); saveC3();
}
async function inspectionDesk() {
  const i = C3.inspection;
  if (i.phase === 1) {
    if (!F3('inspectionBrief') || !i.surveyed.supper || !i.surveyed.sleep || !i.surveyed.water) return say('PREPARATION IS OPEN. MARISOL HAS THREE REQUESTS. TALK TO ROZ, BEA, AND THE VOICE AT THE VENT BEFORE STARTING THE CHECKS.', null);
    const r = inspectionConditions();
    await say('READY FOR ROOM CHECKS? SUPPER: ' + (r.supper ? 'HOT' : 'COLD') + '. 3C: ' + (r.sleep ? 'QUIET' : 'RATTLING') + '. WALL TAP: ' + (r.water ? 'RUNNING' : 'DRY') + '. THE SETTINGS WILL BE SEALED UNTIL THE REPORT.', null);
    if (await ask('ADVANCE THE INSPECTION CLOCK?', null, ['START THE CHECKS', 'KEEP PREPARING']) === 1) return;
    i.results = r; i.phase = 2; saveC3();
    await showCard(['INSPECTION DAY', '2. ROOM CHECKS'], 80, { fg: hex('#ffd848'), sc: 2 });
    await say2([[DR, 'SERVICE CONTROLS SEALED. PLEASE VERIFY WITH THE RESIDENTS.'], ['CARL', 'All of them.'], [DR, 'THAT IS NOT THE STANDARD QUANTITY.']]); return;
  }
  if (i.phase === 2) {
    if (!i.checked.supper || !i.checked.sleep || !i.checked.water) return say('THE ROOM CHECKS ARE STILL OPEN. ASK ROZ, BEA, AND THE VOICE WHAT ACTUALLY HAPPENED.', null);
    if (await ask('ALL THREE ROOM CHECKS ARE RECORDED.', null, ['END THE ROOM CHECKS', 'LOOK AROUND']) === 1) return;
    i.phase = 3; saveC3();
    await showCard(['INSPECTION DAY', '3. THE REPORT'], 80, { fg: hex('#ffd848'), sc: 2 });
    await say('THE REPORT HAS ONE BOX: STANDARD RESIDENT SATISFIED. YOUR NOTES HAVE THREE PEOPLE. RETURN TO THE DESK TO FILE THEM.', null); return;
  }
  const k = await ask('WHAT GOES ON THE INSPECTION REPORT?', null, ["FILE ALL THREE RESIDENTS' CHECKS", 'MARK STANDARD RESIDENT SATISFIED', 'KEEP THE REPORT OPEN']);
  if (k === 2) return;
  i.report = k === 0 ? 'residents' : 'standard';
  const r = i.results;
  for (const [id, who] of [['supper','roz'], ['sleep','bea'], ['water','nell']]) good(who, r[id] ? 1 : -1);
  if (k === 0) {
    good('marisol', 1); setF3('inspectionRecord');
    await say2([[MA, 'Three residents. Three different needs. That looks like a building to me.'],
      [LI3, 'There is no box for the voice.'],
      ['CARL', 'Then use the margin. The tap is in the building. So is the person using it.'],
      [LI3, '...I can use the margin. I can leave it in the file.']]);
  } else {
    good('marisol', -1);
    await say2([[LI3, 'Standard resident satisfied! Such an uncomplicated sentence.'],
      [MA, 'I kept your room notes. They are less uncomplicated. They are also what happened.']]);
  }
  await say("THE SEALS COME OFF. THE USUAL SERVICES RETURN. ROZ'S DISH IS ALREADY AT THE COMMUNITY TABLE. BEA'S AFTERNOON IS ALREADY OVER. TODAY IS IN THE FILE.", null);
  i.phase = 4; setF3('inspectionDone'); saveC3(); await beginChapter3();
}
async function inspectionMixer() {
  const i = C3.inspection;
  if (!i || !F3('inspectionDone')) return;
  await say(i.results.supper ? 'ROZ OPENS THE SUPPER DISH. STEAM RISES. THE STANDARD SNACKS LOOK NERVOUS.' : 'ROZ SETS DOWN THE COLD SUPPER. SHE HAS LABELLED IT: COLD SUPPER.', null);
  await say2([[BE, i.results.sleep ? 'I slept. I have enough energy to complain in full sentences.' : 'I heard that pipe all afternoon. If I fall asleep in a chair, please count it as attendance.'],
    [VO, i.results.water ? '(through the pipe) Thank you for the water. I washed the spoon. Someone will need it.' : '(through the pipe) My tap went dry. I am still here. Put that in the minutes.'],
    [MA, i.report === 'residents' ? 'Already in the file. Three residents. This meeting has a margin.' : 'The form says one resident was satisfied. My minutes say there were three. I kept the room notes.']]);
}
wrapEnts('apt3D', () => [
  prop('inspectionOven', 2.6, 6.4, 'SUPPER / OVEN', () => inspectionOven(), { cond: inspectionActive, draw3: e => {
    const i = C3.inspection, hot = (i.results || inspectionConditions()).supper;
    drawModel(FURN.saucepan, { p: [2.6, 1, 7.6], yaw: 0 }, liveLight(WX.sc, e.p));
    if (i.mealPacked) drawModel(MODEL.crate, { p: [3.8, 1, 7.6], yaw: 0 }, liveLight(WX.sc, e.p));
    if (hot) { const p = project(LIVE.cam, [2.6, 1.7, 7.6]); if (p) text('~', p[0], p[1] - (WX.t % 20) / 4, UI3.text); }
  } })
]);

// The same small props move from their shared rooms to the pipe and the mixer.
const serviceTowelModel = { h: .08, parts: [{ m: 'box:.9:.07:.5', o: [0, 0, 0], col: [220, 228, 240] }] };
for (const id of ['laundry', 'diner', 'maint', 'community']) {
  const old = SCENES[id].drawOver;
  SCENES[id].drawOver = () => {
    if (old) old();
    const i = C3.inspection; if (!i) return;
    const draw = (model, p) => drawModel(model, { p, yaw: 0 }, liveLight(WX.sc, p));
    if (inspectionActive()) {
      if (id === 'laundry' && !i.towel) draw(serviceTowelModel, [0, 1.52, 9.2]);
      if (id === 'diner' && !i.box) draw(MODEL.crate, [3.2, 1, 8.6]);
      if (id === 'maint' && i.wrapped) draw(serviceTowelModel, [2, 1.2, 6.6]);
    }
    if (id === 'community' && F3('inspectionDone')) {
      draw(FURN.saucepan, [6, .9, 6.3]);
      if (i.mealPacked) draw(MODEL.crate, [6.4, .9, 6.5]);
      const p = project(LIVE.cam, [6, 1.5, 6.3]);
      if (p) text(i.results.supper ? 'HOT' : 'COLD', p[0] - 9, p[1], i.results.supper ? UI3.name : UI3.dim);
    }
  };
}
