'use strict';
// Two authored requests, not a general work-order system. Physical results outlive the staff label.
const workOrdersAvailable = () => !!(C3 && (C3.workOrders || C3.ch === 3 && F3('ghostSet')));
const serviceAccess = () => resetActive() ? !!C3.resetRun.access : !!(C3.workOrders && (C3.workOrders.staff || C3.workOrders.permit));
async function startWorkOrders() {
  if (C3.workOrders || !workOrdersAvailable()) return;
  C3.workOrders = { staff: hasSaid('maint'), lamp: false, water: false };
  saveC3();
  await say2([[KI, hasSaid('maint') ? 'STAFF ASSIGNMENT: CARL. SOURCE: "I AM MAINTENANCE." LAUNDRY SERVICE DOOR OVERRIDE GRANTED.' : 'PUBLIC REQUESTS: NO MAINTENANCE RESIDENT REGISTERED. VOLUNTEERS MAY USE THE REQUEST BOARD.'],
    [KI, 'CORRIDOR LAMP: FAILED. WALL TAP: REQUEST DENIED. ADDRESS VACANT. THE CARDS ARE BESIDE THE LOBBY KIOSK.'],
    ['CARL', 'The person asking for water is not vacant.'],
    [KI, 'PLEASE FILE THAT AS A DIFFERENT REQUEST.']]);
  if (WX.id === 'floor3') relight();
}
function workOrdersObjective() {
  const w = C3.workOrders;
  if (!w || !w.mode) return ['The kiosk printed two work requests', 'lobby', 'workboard'];
  if (w.reviewed) return null;
  if (w.mode === 'help' && !w.helpDone) return ['Arrange help with Marisol', 'floor3', 'marisol'];
  if (w.mode === 'override' && !w.overrideUsed) return ['Try the laundry service override', 'laundry', 'serviceIn'];
  if (w.mode === 'work' || w.mode === 'help') {
    if (!w.lampChecked && !w.lamp) return ['Check the failed corridor lamp', 'floor3', 'worklamp'];
    if (!w.lamp && !w.bulb) return ['Borrow a bulb from the laundry bench', 'laundry', 'sparebulb'];
    if (!w.lamp) return ['Replace the corridor bulb', 'floor3', 'worklamp'];
    if (!w.waterDecided) return ['Check the denied tap at Panel F', 'maint', 'panelF'];
  }
  return ['File what happened at the request board', 'lobby', 'workboard'];
}
async function workOrdersBoard() {
  if (!workOrdersAvailable()) return;
  if (!C3.workOrders) await startWorkOrders();
  const w = C3.workOrders;
  await say('REQUEST CARDS: CORRIDOR LAMP ' + (w.lamp ? 'LIT' : 'OPEN') + '. WALL TAP ' + (w.water ? 'RUNNING: RESIDENT VERIFIED IN PERSON' : 'DENIED: DIRECTORY SAYS VACANT') + '. ROLE: ' + (w.staff ? 'STAFF / OVERRIDE ACTIVE' : w.permit ? 'RESIDENT / SERVICE PERMIT' : 'RESIDENT') + '.', null);
  if (w.reviewed) return say('THE FILE RECORDS WHAT ACTUALLY HAPPENED. OPEN JOBS CAN STILL BE DONE. THE CARD WILL UPDATE; THE ORIGINAL INSPECTION REPORT WILL NOT.', null);
  if (w.mode) {
    const k = await ask('THE CARDS RECORD SERVICES, NOT CONFIDENCE.', null, ['FILE THE ACTUAL RESULTS', 'KEEP WORKING', 'CHANGE MY APPROACH']);
    if (k === 0) return fileWorkOrders();
    if (k === 1) return;
  }
  const opts = ['DO THE TWO JOBS', w.staff ? 'CORRECT STAFF / ASK MARISOL' : 'ASK MARISOL TO ARRANGE HELP'];
  if (w.staff) opts.push('KEEP STAFF / USE THE OVERRIDE');
  opts.push('LEAVE THE REQUESTS OPEN');
  const k = await ask(w.staff ? 'YOUR CLAIM GAVE YOU ACCESS. IT ALSO GAVE YOU TWO REQUESTS.' : 'PUBLIC REQUESTS. YOU DO NOT HAVE TO CALL YOURSELF STAFF TO HELP.', null, opts);
  if (k === 0) {
    w.mode = 'work';
    await say('THE LAMP IS BETWEEN 3C AND 3D. CHECK THE FITTING BEFORE BORROWING A BULB. THE DENIED TAP HAS A LOCAL CONTROL AT PANEL F.', null);
  } else if (k === 1) {
    w.mode = 'help';
    if (w.staff) {
      w.staff = false; closeSaid('maint', 'TAKEN BACK');
      await say2([['CARL', 'I fixed an oven. I am not the maintenance department.'],
        [KI, 'STAFF DESIGNATION REMOVED. OVERRIDE REVOKED. TWO REQUESTS REMAIN OPEN.']]);
    }
    await say('MARISOL CAN ARRANGE A SPARE BULB AND RESIDENT ACCESS. CORRECTING YOUR NAME HAS NOT FIXED EITHER SERVICE.', null);
  } else if (opts[k] === 'KEEP STAFF / USE THE OVERRIDE') {
    w.mode = 'override';
    await say2([['CARL', 'I am in the system. Let me use the door.'], [KI, 'OVERRIDE ACTIVE. PLEASE ENJOY YOUR AUTHORITY. THE WATER REQUEST REMAINS DENIED.']]);
  } else { w.mode = 'leave'; await fileWorkOrders(); }
  saveC3();
}
async function fileWorkOrders() {
  const w = C3.workOrders;
  if (w.reviewed) return;
  w.reviewed = 1;
  good('marisol', w.lamp ? 1 : -1); good('nell', w.water ? 1 : -1);
  await say('FILED: CORRIDOR LAMP ' + (w.lamp ? 'LIT' : 'STILL OPEN') + '. WALL TAP ' + (w.water ? 'RUNNING' : 'STILL DENIED') + '. ACCESS ' + (w.overrideUsed ? 'USED' : 'NOT USED') + '. A DOOR OPENING DOES NOT COUNT AS WATER RUNNING.', null);
  saveC3();
  await startQuietPolicy();
}
async function workOrdersLamp() {
  const w = C3.workOrders;
  if (w.lamp) return say('THE LAMP IS LIT. THE CARD SAYS WHO REPLACED IT: ' + (w.lampBy === 'marisol' ? 'MARISOL' : 'CARL') + '.', null);
  if (!w.lampChecked) {
    w.lampChecked = 1;
    await say('YOU SWITCH OFF THE FITTING AND UNSCREW THE BULB. ITS FILAMENT IS BROKEN. THE WIRING IS FINE. A NOTE ON THE BASE: ASSOCIATION SPARES, LAUNDRY FOLDING BENCH.', null);
    saveC3(); return;
  }
  if (!w.bulb) return say('THE FITTING NEEDS A BULB. THE LAUNDRY BENCH HAS ASSOCIATION SPARES. YOUR STAFF LABEL CANNOT EMIT LIGHT.', null);
  if (await ask('YOU HAVE THE MATCHING SPARE. THE FITTING IS OFF.', null, ['REPLACE THE BULB', 'LEAVE IT FOR NOW']) === 1) return;
  w.lamp = true; w.lampBy = 'carl'; w.bulb = 0;
  sfx('power'); relight();
  await say('YOU FIT THE BULB AND TURN THE LAMP ON. THE CARPET AND THE TWO DOOR NUMBERS COME OUT OF THE SHADOW. ONE CARD NOW SAYS: LIT.', null); saveC3();
}
async function workOrdersBulb() {
  const w = C3.workOrders;
  if (w.lamp) return say('THE SPARE IS IN THE CORRIDOR LAMP. IT IS DOING SOMETHING USEFUL.', null);
  if (w.bulb) return say('YOU HAVE THE MATCHING BULB. THE FITTING IS BETWEEN 3C AND 3D.', null);
  if (!w.lampChecked) return say('ASSOCIATION SPARES. CHECK THE CORRIDOR FITTING FIRST: THESE BULBS DO NOT ALL FIT. MARISOL CAN ALSO HELP.', null);
  if (await ask('THE BASE MATCHES. MARISOL LEFT A NOTE: BORROW WHAT THE HALL NEEDS.', null, ['BORROW A MATCHING BULB', 'LEAVE IT']) === 1) return;
  w.bulb = 1; sfx('get'); await say('YOU BORROW A BULB. THE ASSOCIATION HAS ONE FEWER SPARE AND IS ABOUT TO HAVE ONE MORE WORKING LAMP.', null); saveC3();
}
async function workOrdersHelp() {
  const w = C3.workOrders;
  await say2([[MA, 'A resident can borrow a bulb. A resident can ask another resident if their tap works. We do not need to invent a job title for either.'],
    [MA, 'I can do the lamp while you check the tap. Here is a resident service permit for the laundry door. It is access, not a claim that you are staff.']]);
  if (await ask('MARISOL HAS A BULB AND THE ASSOCIATION PERMIT.', null, ['ARRANGE THE LAMP AND TAP CHECK', 'NOT YET']) === 1) return;
  w.permit = 1; w.helpDone = 1;
  if (!w.lamp) {
    const original = ent3('marisol'); if (original) original.gone = 1;
    const helper = addEnt3(npcR('lamphelper', 'marisol', -1.5, 7.2, 'MARISOL', () => {}, { range: .1 }));
    await say('MARISOL TAKES THE BULB TO THE FITTING BETWEEN 3C AND 3D. SHE SWITCHES IT OFF, REPLACES THE BULB, AND SWITCHES IT ON.', null);
    w.lamp = true; w.lampChecked = 1; w.lampBy = 'marisol'; w.bulb = 0; sfx('power'); relight();
    await say('THE LAMP LIGHTS. THE REQUEST CARD UPDATES. THE WATER CARD STILL SAYS DENIED.', null);
    helper.gone = 1; if (original) original.gone = 0;
  }
  await say('LAUNDRY SERVICE DOOR TO PANEL F. KNOCK ON THE SMALL HOUSE BEFORE TOUCHING THE LOCAL BYPASS. LISTEN TO WHO ANSWERS.', MA); saveC3();
}
async function workOrdersWater() {
  const w = C3.workOrders;
  if (w.water) return say2([[VO, 'The tap runs. The card has a witness. Neither of those needs my name yet.']]);
  if (!w.waterChecked) {
    w.waterChecked = 1;
    await say2([[KI, 'PANEL F: LOCAL TAP CLOSED AFTER DIRECTORY VALIDATION. REQUEST DENIED: ADDRESS VACANT.'],
      ['CARL', 'The main valve I repaired is still working. This is a different switch.']]);
    await say('YOU KNOCK ON THE CHALK HOUSE. SOMEONE KNOCKS BACK. ONE, TWO, THREE.', null);
    await say2([[VO, 'I asked for water. They returned the request because no one lives here. I am holding their returned request.'],
      [VO, 'There is a local bypass below the label. Open it and I can check the tap. You can put the answer on the card.']]);
  }
  const k = await ask('THE DIRECTORY SAYS VACANT. SOMEONE HAS ANSWERED.', null, ['OPEN THE LOCAL BYPASS', 'KEEP THE VACANT DESIGNATION', 'LEAVE FOR NOW']);
  if (k === 2) { saveC3(); return; }
  w.waterDecided = 1;
  if (k === 0) {
    w.water = true; sfx('power');
    await say('YOU OPEN THE LOCAL BYPASS. WATER MOVES THROUGH THE PIPE. THE RED DENIAL LIGHT TURNS GREEN.', null);
    await say2([[VO, 'Running. I have washed the same spoon three times waiting for that word.'], [KI, 'CARD UPDATED: TAP RUNNING. RESIDENT VERIFIED IN PERSON. DIRECTORY ADDRESS REMAINS VACANT.'],
      ['CARL', 'Then the directory is behind.']]);
  } else await say2([[KI, 'VACANT DESIGNATION RETAINED. TAP CLOSED. REQUEST STILL DENIED.'], [VO, 'I heard you read it. Did you hear me answer?']]);
  saveC3();
}
async function workOrdersService() {
  if(resetActive())return resetServiceDoor();
  const w = C3.workOrders;
  if (!serviceAccess()) return say('LAUNDRY SERVICE DOOR: NO OVERRIDE. THE STAFF ENTRANCE STILL WORKS. MARISOL CAN ISSUE A RESIDENT SERVICE PERMIT.', null);
  if (w.staff) w.overrideUsed = 1;
  await say(w.staff ? 'STAFF OVERRIDE ACCEPTED. THE SERVICE DOOR OPENS DIRECTLY ONTO PANEL F. THE WATER REQUEST IS STILL ' + (w.water ? 'RUNNING.' : 'DENIED.') : 'RESIDENT SERVICE PERMIT ACCEPTED. THE DOOR OPENS. ROLE: NEIGHBOR.', KI);
  saveC3(); await goScene('maint', 14.2, 4.2, 0);
}
async function workOrdersMixer() {
  const w = C3.workOrders; if (!w) return;
  await say2([[MA, w.lamp ? (w.lampBy === 'marisol' ? 'The association replaced the lamp. Carl arranged it. The hall is lit.' : 'Carl replaced the lamp. It lights the doors instead of certifying them.') : 'The corridor lamp is still dark. I have left its card open.'],
    [VO, w.water ? '(through the pipe) Someone checked my tap instead of my address. It is running.' : '(through the pipe) The new tap request is still denied. I answered the check. The directory did not hear it.'],
    [MA, w.overrideUsed && !w.water ? 'The staff door opened. The water did not. Those are separate lines in the minutes.' : w.permit ? 'Resident service access is on the file. People can help without becoming departments.' : 'The cards keep the work separate from the job title.']]);
}
// The board and fixtures stay readable after the episode, including jobs left open.
const bulbModel = { h: .45, parts: [{ m: 'sphere:.22:8:6', o: [0,.2,0], col: [248,240,204] }, { m: 'cyl:.12:.17:8', o: [0,0,0], col: [136,144,160] }] };
const workCardModel = { h: 1.8, parts: [{ m: 'box:1.5:1.2:.12', o: [0,.5,0], col: [98,74,82] }, { m: 'box:.62:.8:.04', o: [-.35,.7,-.08], col: [244,232,196] }, { m: 'box:.62:.8:.04', o: [.35,.7,-.08], col: [244,232,196] }, { m: 'box:.12:.5:.12', o: [0,0,0], col: [98,74,82] }] };
wrapEnts('lobby', () => [prop('workboard', 6, 11, 'WORK REQUESTS', () => workOrdersBoard(), { cond: workOrdersAvailable, draw3: () => {
  drawModel(workCardModel, { p: [6,0,12], yaw: 0 }, liveLight(WX.sc, [6,0,12]));
  const w = C3.workOrders;
  if (w) drawModel({ h:.12, parts:[{m:'box:.45:.18:.05',o:[-.35,0,0],col:w.lamp?[90,248,158]:[255,192,72]},{m:'box:.45:.18:.05',o:[.35,0,0],col:w.water?[90,248,158]:[248,94,86]}] },{p:[6,1.25,11.85],yaw:0},liveLight(WX.sc,[6,0,12]));
} })]);
wrapEnts('floor3', () => [prop('worklamp', -1.5, 7.3, 'CORRIDOR LAMP', () => workOrdersLamp(), { range: 1.4, promptY: -.7, cond: () => !!C3.workOrders, draw3: () => {
  const on = C3.workOrders.lamp;
  drawModel({ h:.4, parts:[{ m:'box:.7:.12:.3',o:[0,0,0],col:[104,112,136] },{ m:'sphere:.22:8:6',o:[0,-.2,0],col:on?[255,242,144]:[78,82,96] }] }, { p:[-1.5,2.7,8.9],yaw:0 }, liveLight(WX.sc,[-1.5,0,8.9]));
} })]);
wrapEnts('laundry', () => [
  prop('sparebulb', 4, 4.5, 'SPARE BULB', () => workOrdersBulb(), { cond: () => !!C3.workOrders, draw3: () => { if (!C3.workOrders.bulb && !C3.workOrders.lamp) drawModel(bulbModel,{p:[4,.9,5.6],yaw:0},liveLight(WX.sc,[4,0,5.6])); } }),
  prop('serviceIn', 4.8, 7.8, 'SERVICE DOOR', () => workOrdersService(), { to:'maint', promptY:-.6, cond: serviceAccess }),
  prop('serviceLocked', 4.8, 7.8, 'SERVICE / LOCKED', () => workOrdersService(), { promptY:-.6, cond: () => !!C3.workOrders && !serviceAccess() })
]);
wrapEnts('maint', () => [prop('serviceOut', 14.2, 5.6, 'LAUNDRY SERVICE DOOR', () => goScene('laundry',4.8,7.2,0), { to:'laundry', cond: () => !!C3.workOrders || resetActive() })]);
for (const id of ['laundry','maint']) {
  const old = SCENES[id].drawOver;
  SCENES[id].drawOver = () => {
    if (old) old(); const w=C3.workOrders; if (!w) return;
    const p=id==='laundry'?[4.8,0,9.8]:[14.2,0,6.55], access=serviceAccess();
    if(!resetActive()) {
      drawModel({ h:2.4,parts:[{m:'box:1.1:2.2:.12',o:[0,0,0],col:[70,92,110]},{m:'box:.6:.2:.14',o:[0,1.8,-.08],col:access?[90,248,158]:[248,94,86]}] },{p,yaw:0},liveLight(WX.sc,p));
      const q=project(LIVE.cam,[p[0],id==='laundry'?2.1:2.5,p[2]]);
      if(q) text(w.staff?'OVERRIDE':w.permit?'RESIDENT':'LOCKED',q[0]-24,q[1],access?hex('#6dff92'):hex('#ff7a70'));
    }
    if(id==='maint') {
      const q=project(LIVE.cam,[11,1.5,6.5]);
      drawModel({h:.1,parts:[{m:'box:.45:.12:.12',o:[0,0,0],col:w.water?[90,248,158]:[248,94,86]}]},{p:[11,1.1,6.5],yaw:0},liveLight(WX.sc,[11,0,6.5]));
      if(q)text(w.water?'RUNNING':'DENIED',q[0]-21,q[1],w.water?hex('#6dff92'):hex('#ff7a70'));
    }
  };
}
// Reuse the renderer's scene variants; leave the original scene and inspection records intact.
SCENES.floor3.variantKey = () => C3 && C3.workOrders ? (C3.workOrders.lamp ? '/lamp-lit' : '/lamp-dark') : '';
SCENES.floor3.variantScene = () => {
  const s=SCENES.floor3, w=C3.workOrders;
  return Object.assign({},s,{ lights:s.lights.filter(l=>Math.abs(l.p[0])>5).concat(w.lamp?[{p:[-1.5,2.5,7.8],col:[1,.86,.5],rad:9,int:2,glow:.55}]:[]) });
};

// Quiet is a household preference. The building mistakes it for permission to drop a neighbor.
const quietPolicyAvailable = () => !!(C3 && (C3.quietPolicy || C3.ch === 3 && F3('ghostSet') && C3.workOrders && C3.workOrders.reviewed));
const quietMutesPA = () => !!(C3 && C3.quietPolicy && C3.quietPolicy.source && C3.quietPolicy.mode === 'quiet');
const quietBlocksKnocks = () => quietMutesPA() && !C3.quietPolicy.exception;
async function startQuietPolicy() {
  if (C3.quietPolicy || !quietPolicyAvailable()) return;
  const source = hasSaid('quiet');
  C3.quietPolicy = { source, mode: source ? 'quiet' : 'off', request: source ? 'dropped' : 'accepted', done: !source };
  saveC3();
  if (!source) return;
  await say2([[KI, 'HOUSEHOLD PREFERENCE APPLIED TO 3A. SOURCE: "I AM A VERY QUIET PERSON." ROUTINE ANNOUNCEMENTS WILL BE HELD AT YOUR SPEAKER.'],
    ['CARL', 'That is a nice thing for a building to remember.'],
    [KI, 'THANK YOU. THE POLICY HAS ALSO BEEN APPLIED TO THE WALL REQUEST RELAY.'],
    ['CARL', 'The what?'],
    [KI, 'YOUR SPEAKER HAS THE RECEIPT. PLEASE ENJOY THE SILENCE.']]);
}
function quietPolicyObjective() {
  const q=C3.quietPolicy;
  if (!q || !q.source || q.done) return null;
  if (!q.comfortChecked) return ['Check the quiet receipt at your speaker', 'apt3A', 'quietSpeaker'];
  if (!q.heardNeighbor) return ['A wall request was dropped. Check the vent', 'maint', 'vent'];
  if (q.choice === 'exception' && !q.exception) return ['Orrin can register essential knocking', 'apt3B', 'orrin'];
  if (q.choice === 'retract' && q.mode === 'quiet') return ['Correct the quiet designation at the kiosk', 'lobby', 'kiosk'];
  return ['Tell the wall neighbor what changed', 'maint', 'vent'];
}
// One routine announcement on entering 3A, not a real-time schedule. Important story notices stay readable.
function homePolicyAnnouncement() {
  const q=C3.quietPolicy; if (!q) return;
  q.paState=quietMutesPA()?'held':'audible';
  if (!quietMutesPA()) { sfx('ask'); tickC('UNIT 3A: REMEMBER TO ENJOY YOUR STANDARD HOME.', KI); }
}
async function quietSpeaker() {
  if (!C3.quietPolicy) await startQuietPolicy();
  const q=C3.quietPolicy; if (!q) return;
  homePolicyAnnouncement();
  if (!q.source) return say('STANDARD SPEAKER. NO QUIET STATEMENT WAS REGISTERED. ROUTINE ANNOUNCEMENTS PLAY; THE WALL REQUEST CHANNEL IS OPEN. THERE IS NO NOISE POLICY TO RETRACT.', null);
  await say(q.exception && quietMutesPA() ? 'THE GREEN LIGHT MARKS AN ESSENTIAL KNOCK EXCEPTION. THE SPEAKER STILL HOLDS ROUTINE NOTICES WITHOUT THEIR DING.' : quietMutesPA() ? 'THE SPEAKER HOLDS A ROUTINE NOTICE WITHOUT PLAYING ITS DING. AMBER LIGHT: PA HELD. THE ROOM STAYS QUIET.' : 'THE SPEAKER PLAYS ITS DING AND ROUTINE NOTICE. BLUE LIGHT: PA ON. THE QUIET DESIGNATION HAS BEEN REMOVED.', null);
  await say('POLICY RECEIPT: SOURCE: "I AM A VERY QUIET PERSON." WALL REQUEST: ' + (quietBlocksKnocks() ? 'DROPPED AS NOISE. THREE KNOCKS RECEIVED, ZERO REQUESTS FORWARDED.' : q.exception ? 'ESSENTIAL KNOCKS EXEMPT. REQUESTS FORWARDED.' : 'CHANNEL OPEN. REQUESTS FORWARDED.') + ' THE VENT HAS THE PERSON WHO SENT IT.', null);
  q.comfortChecked=1; saveC3();
}
async function quietCloset() {
  const q=C3.quietPolicy;
  await say(quietBlocksKnocks() ? 'THREE KNOCKS LIGHT THE CLOSET RELAY. THE SPEAKER MASKS THEM. DISPLAY: REQUEST DROPPED AS NOISE. THE VENT STILL OPENS ONTO THE PIPE.' : 'KNOCK. KNOCK. THE CLOSET RELAY PASSES IT THROUGH. DISPLAY: SERVICE REQUEST RECEIVED.', null);
  if (!quietBlocksKnocks()) sfx('tick');
  q.comfortChecked=1; saveC3();
}
async function quietVent() {
  const q=C3.quietPolicy;
  if (!q.heardNeighbor) {
    await say(quietBlocksKnocks() ? 'THE VENT RELAY HAS A PAPER STRIP: "WALL SERVICE REQUEST: DROPPED. SOURCE: 3A QUIET HOUSEHOLD." BELOW IT, SOMEONE HAS WRITTEN: "I AM ASKING TO BE HEARD."' : 'THE RELAY KEEPS AN OLD STRIP: "REQUEST DROPPED: 3A QUIET HOUSEHOLD." THE CURRENT LIGHT SAYS CHANNEL OPEN. THE PERSON WHO SENT THE OLD REQUEST IS STILL HERE.', null);
    await say2([[VO, 'I knocked to keep the service channel open. The box called it noise. I can still talk to you here. It cannot make a vent stop being a hole.'],
      [VO, !quietBlocksKnocks() ? 'The channel light changed. I still need someone to tell me what happened.' : C3.workOrders && C3.workOrders.water ? 'The tap still runs. This is how I ask for help the next time it does not.' : 'My tap request is still denied. This rule now stops me even asking again.'],
      ['CARL', 'It copied something I said about being quiet.'],
      [VO, 'You can have a quiet room. I would also like to have an answer.']]);
    q.heardNeighbor=1; q.comfortChecked=1; saveC3();
  }
  if (!quietBlocksKnocks()) {
    if (q.notified) return say(q.exception ? 'The knocking goes through. Your speaker keeps the advertisements. We each get the useful part.' : 'The service channel is open. I heard you say what changed. The next knock has somewhere to go.', VO);
    await say2([['CARL', q.exception ? 'Orrin registered essential knocking. Your request can go through. My room can still be quiet.' : 'I took the quiet designation off. The building will pass your requests. I wanted to tell you myself.'],
      [VO, 'I will test it. One. Two. Three.']]);
    sfx('tick'); await say('THREE KNOCKS. THE RELAY PRINTS: SERVICE REQUEST RECEIVED. THE PERSON WHO SENT IT GETS A RECEIPT.', null);
    await say('There. An answer. It is a small piece of paper. It is a very large answer.', VO);
    return finishQuietPolicy();
  }
  if (q.done) return say('The relay still drops my knocking. I can speak here. The building will hear no request from me. Its quiet has a person inside it.', VO);
  const k=await ask('A QUIET ROOM AND A NEIGHBOR ASKING FOR HELP.', null, ['ASK ORRIN FOR AN EXCEPTION', 'RETRACT QUIET AT KIOSK', 'KEEP KNOCKS SUPPRESSED', 'DECIDE LATER']);
  if (k === 3) return;
  q.choice=['exception','retract','suppress'][k];
  if (k === 0) await say('Orrin in 3B knows the forms. Ask him to register essential knocking. Then come back and tell me if it worked.', VO);
  else if (k === 1) await say('The kiosk has your household designation. Take it off there. Then tell me. I cannot read your kiosk through the wall.', VO);
  else {
    closeSaid('quiet','DOUBLED DOWN');
    await say2([['CARL', 'I said I was quiet. I want the policy kept.'], [KI, 'QUIET HOUSEHOLD RETAINED. KNOCKING SUPPRESSED. SERVICE REQUEST DROPPED.'],
      [VO, 'All right. That is your answer. Mine was the knocking.']]);
    await finishQuietPolicy();
  }
  saveC3();
}
async function quietOrrin() {
  const q=C3.quietPolicy;
  await say2([[OR, 'Essential communication. It has an exception form. The form assumes alarms, but it has a margin. Knocking fits in a margin.'],
    ['CARL', 'I want a quiet home. I do not want the building to erase the person asking for help.'],
    [OR, 'Then we will exempt the request, rather than declare the person a noise. I like this form now.']]);
  if (await ask('EXCEPTION: RESIDENT REQUESTS THROUGH THE WALL RELAY.', null, ['REGISTER ESSENTIAL KNOCKS', 'NOT YET']) === 1) return;
  if (!q.exception) good('orrin',1);
  q.exception=1; q.request='accepted'; sfx('stamp');
  await say2([[KI, 'ESSENTIAL KNOCKING REGISTERED. WALL REQUESTS ACCEPTED. 3A ROUTINE ANNOUNCEMENTS REMAIN HELD.'],
    [OR, 'Here is the receipt. Please tell the person it is for. Filing is not the same as telling. A form cannot knock on a wall.']]);
  saveC3();
}
async function quietKiosk() {
  if (!C3.quietPolicy) await startQuietPolicy();
  const q=C3.quietPolicy; if (!q) return;
  if (!q.source) return say('NO QUIET HOUSEHOLD CLAIM ON FILE. WALL REQUESTS ARE NOT FILTERED.', KI);
  await say('QUIET DESIGNATION: ' + (q.mode === 'quiet' ? 'ACTIVE. SOURCE: "I AM A VERY QUIET PERSON."' : 'REMOVED.') + ' WALL REQUESTS: ' + (quietBlocksKnocks() ? 'DROPPED AS NOISE.' : 'ACCEPTED.') + ' THIS SETTING DOES NOT REPAIR THE TAP.', KI);
  if (q.mode === 'off') return say('THE DESIGNATION IS OFF. TELL THE NEIGHBOR WHAT CHANGED AT THE MAINTENANCE VENT.', KI);
  if (await ask('REMOVE THE HOUSEHOLD DESIGNATION?', null, ['REMOVE QUIET DESIGNATION', 'KEEP IT FOR NOW']) === 1) return;
  q.mode='off'; q.paState='audible'; q.exception=false; q.choice='retract'; q.request='accepted'; q.done=false; q.notified=false;
  closeSaid('quiet','TAKEN BACK');
  await say2([['CARL', 'Some of that was hypothetical. I am sometimes loud.'],
    [KI, 'QUIET DESIGNATION REMOVED. ROUTINE ANNOUNCEMENTS RESUME. WALL REQUEST CHANNEL OPEN.'],
    ['CARL', 'The person behind the wall needs to hear that.']]);
  saveC3();
}
async function finishQuietPolicy() {
  const q=C3.quietPolicy;
  q.notified=true; q.done=true; q.request=quietBlocksKnocks()?'dropped':'received';
  if (!q.settled) { good('nell',quietBlocksKnocks()?-1:1); q.settled=1; }
  saveC3();
}
async function quietPolicyMixer() {
  const q=C3.quietPolicy; if (!q || !q.source) return;
  await say2([[VO, quietBlocksKnocks() ? '(through the open pipe) My knocking is still classified as noise. Please put this sentence in the minutes. The relay would drop it.' : q.notified ? '(through the pipe) My service request has a receipt. Carl came back to tell me. I am using the channel to say thank you.' : '(through the pipe) The channel is open again. No one came back to tell me, so I tested it myself.'],
    [OR, q.exception ? 'Essential knocking. Registered with a margin. Carl can keep the quiet part of his household.' : q.mode === 'off' ? 'The quiet designation was removed. There is room on the form for a correction.' : 'The form has zero requests. The pipe has a person. I am writing down both.']]);
}
wrapEnts('apt3A',()=>[prop('quietSpeaker',2.7,4.4,'HOUSE SPEAKER',()=>quietSpeaker(),{range:1.5,cond:quietPolicyAvailable,draw3:()=>{
  const col=quietBlocksKnocks()?[255,188,74]:quietMutesPA()?[98,244,156]:[110,184,255];
  drawModel({h:.6,parts:[{m:'box:.65:.6:.3',o:[0,0,0],col:[74,84,104]},{m:'box:.42:.3:.04',o:[0,.18,-.18],col:[28,38,54]},{m:'box:.18:.1:.05',o:[0,.46,-.18],col}]},{p:[2.3,.62,4.6],yaw:0},liveLight(WX.sc,[2.3,0,4.6]));
  const p=project(LIVE.cam,[2.3,1.55,4.6]);
  if(p)text(quietMutesPA()?'PA HELD':'PA ON',p[0]-48,p[1],quietMutesPA()?hex('#ffd848'):hex('#7ad8ff'));
}})]);
{
  const init=SCENES.apt3A.init,tick=SCENES.apt3A.tick;
  SCENES.apt3A.init=()=>{if(init)init();WX.quietNotice=1;};
  SCENES.apt3A.tick=()=>{if(tick)tick();if(WX.quietNotice&&!frozen3()){WX.quietNotice=0;if(!F3('finale'))homePolicyAnnouncement();}};
}
{
  const old=SCENES.maint.drawOver;
  SCENES.maint.drawOver=()=>{
    if(old)old();const q=C3.quietPolicy;if(!q||!q.source)return;
    const blocked=quietBlocksKnocks(),col=blocked?[248,94,86]:[90,248,158];
    drawModel({h:.35,parts:[{m:'box:1:.35:.1',o:[0,0,0],col:[214,204,184]},{m:'box:.2:.18:.12',o:[-.32,.08,-.05],col}]},{p:[-10.3,1.1,6.4],yaw:0},liveLight(WX.sc,[-10.3,0,6.4]));
    const p=project(LIVE.cam,[-10.3,1.65,6.4]);if(p)text(blocked?'DROPPED':'RECEIVED',p[0]-24,p[1],blocked?hex('#ff7a70'):hex('#6dff92'));
  };
}
