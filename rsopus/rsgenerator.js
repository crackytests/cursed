'use strict';
// The first dungeon: a readable lesson, a power-routing choice, then its exam.
const PANEL_WHACK = ['PANEL WHACK', 0, 1, 1.4, 'interrupt'];
function generatorRoom(F) {
  F.guard = null; F.chest = null;
  const cleared = GS.flags['k_generator:' + F.room] || [];
  F.mons = F.room < 2 && !GS.flags.generatordone && !cleared.includes(0) && !(F.room === 1 && GS.flags.genpower === 'vent')
    ? [{ i: 0, fam: F.room ? 'bot' : 'drone', x: F.room ? 310 : 240, y: 200, stun: 0, spr: bakeMon(F.room ? 'bot' : 'drone', 0) }] : [];
  if (F.room === 1 && GS.flags.genpower === 'lights') F.chest = { x: 248, y: 190, open: !!GS.flags.gensupplies };
  F.img = paintGeneratorRoom(F.room, GS.flags.generatordone ? 'off' : GS.flags.genpower || 'on');
}
function generatorFoe(f, boss = false) {
  f.machinePhase = 'charge'; f.interrupted = false;
  if (boss) { f.hp = f.mhp = Math.round(170 * (1 + Math.max(0, GS.br - 10) * .015)); f.def = 5; }
  else { f.hp = f.mhp = 34; f.str = 6; f.int = 4; f.def = 2; }
  return f;
}
async function generatorAct(f) {
  if (f.machinePhase === 'vent') {
    await msg('VENTS CLOSE. BUILDING CHARGE.', 32); f.machinePhase = 'charge'; f.interrupted = false; return;
  }
  if (f.interrupted) await msg('CHARGE CANCELLED. VENTS OPEN.', 32);
  else {
    await msg(f.boss ? 'REQUEST DENIED: POWER SURGE' : 'CHARGE RELEASED', 28);
    for (const id of alive()) { const [x, y] = posOf(id); fx('ring', x, y - 20, EL_COL.static, 26); hurtPC(id, f.boss ? 32 : 18); }
    await wait(24);
  }
  f.machinePhase = 'vent'; f.interrupted = false;
}
function drawGeneratorBattle() {
  const f = liveFoes().find(f => f.machinePhase); if (!f) return;
  const charging = f.machinePhase === 'charge', col = charging ? rgb(240, 170, 60) : rgb(90, 200, 185);
  ringF(f.x, f.y - 28, 24 + Math.sin(BT.t * .12) * 3, col);
  if (!charging) for (let i = 0; i < 3; i++) { const y = f.y - 38 - ((BT.t + i * 12) % 36); lineF(f.x - 26, y, f.x - 32, y - 7, PAPER); lineF(f.x + 26, y, f.x + 32, y - 7, PAPER); }
  panel(6, 143, 308, 24);
  ink(charging ? 'BUILDING CHARGE' : 'VENTING: EXPOSED', 12, 147, charging ? RUST : SEPIA);
  ink(charging ? 'PANEL WHACK: INTERRUPT / DEFEND: GUARD' : 'ATTACK NOW: DOUBLE DAMAGE', 12, 157, SEPIA);
}
async function generatorSwitch() {
  if (GS.flags.genpower) { await say('POWER ROUTED TO ' + (GS.flags.genpower === 'lights' ? 'LIGHTS. THE CLOSET IS OPEN.' : 'VENTILATION. THE HALL IS CLEAR.')); return; }
  if (GS.hero === 'carl') await say('ONE OF THESE IS PROBABLY ELECTRICITY.', 'CARL');
  await say('ONE CIRCUIT. CHOOSE LIGHTS FOR SUPPLIES, OR VENTILATION TO CLEAR THE PATROL.');
  const k = await choose(['LIGHTS: SUPPLY CLOSET', 'VENTILATION: CLEAR PATROL', 'NOT YET'], { x: 8, y: 40, w: 260, cancel: 1 });
  if (k < 0 || k === 2) return;
  GS.flags.genpower = k === 0 ? 'lights' : 'vent'; sfx('power');
  if (k === 1) { for (let t = 0; t < 45; t++) { FIELD.mons.forEach(m => m.x += 6); await nextFrame(); } }
  generatorRoom(FIELD);
  await say(k === 0 ? 'THE CLOSET LIGHT COMES ON. SO DOES THE CLOSET. TWO TONICS AND AN ENERGY DRINK, INSIDE.' : 'THE PATROL HAS BEEN REASSIGNED TO OUTSIDE. IT DID NOT APPLY.');
}
function drawGeneratorField(F) {
  const off = GS.flags.generatordone, sx = x => x - camX;
  panel(6, 6, 200, 17); ink(['01  CABLE GALLERY', '02  AIR / LIGHT', '03  THE ALMOST ENGINE'][F.room], 12, 11, RUST);
  if (F.room === 0) {
    panel(sx(42), 117, 118, 26); ink('MAINTENANCE', sx(48), 122); ink('HIT TO REPAIR', sx(48), 132, RUST);
    if (!off) for (let i = 0; i < 5; i++) { const y = 38 + ((F.t * .7 + i * 23) % 100); circF(sx(188 + i * 11), y, 1, GOLDC); }
  }
  if (F.room === 1) {
    const cx = sx(285), cy = 83, a = off ? 0 : F.t * (GS.flags.genpower === 'vent' ? .18 : .025);
    for (let i = 0; i < 4; i++) { const v = a + i * Math.PI / 2; lineF(cx, cy, cx + Math.cos(v) * 31, cy + Math.sin(v) * 31, SEPIA); }
    circF(cx, cy, 5, GOLDC);
    panel(sx(78), 117, 142, 33); ink('LIGHTS / VENTILATION', sx(84), 123); ink(GS.flags.genpower ? 'ROUTED: ' + GS.flags.genpower.toUpperCase() : 'ONE CIRCUIT. TWO JOBS.', sx(84), 136, RUST);
    if (GS.flags.genpower === 'vent' && !off) for (let i = 0; i < 7; i++) { const x = (F.t * 3 + i * 53) % F.w; lineF(sx(x), 160 + i * 6, sx(x + 19), 160 + i * 6, PAPER); }
    if (Math.abs(F.x - 145) < 28 && !DLG && !MENUS.length && !CARD) { panel(70, 30, 180, 17); ink('Z / X: ROUTE POWER', 82, 35, RUST); }
    if (F.chest && !F.chest.open) { panel(sx(216), 155, 78, 17); ink('SUPPLIES', sx(223), 160, RUST); }
  }
  if (F.room === 2) {
    const c = off ? rgb(80, 120, 110) : rgb(220, 160 + Math.sin(F.t * .08) * 35, 50);
    ringF(sx(294), 88, 35, c); circF(sx(294), 88, off ? 3 : 7, c);
    panel(6, 30, 168, 17); ink(off ? 'STOP REQUEST: ACCEPTED' : 'STOP REQUEST: PENDING', 12, 35, off ? SEPIA : RUST);
  }
  if (off) { panel(218, 6, 96, 17); ink('HUM: OFF', 226, 11); panel(44, 205, 232, 17); ink('LEFT: BACK THROUGH ROOMS TO LOT 9', 50, 210); }
}
function paintGeneratorRoom(room, power) {
  return painting('generator-v2:' + room + ':' + power, () => {
    const P = new Paint(400, H), off = power === 'off', dark = pg('#302f36'), metal = pg('#706e72'), cream = pg('#dbc598'), teal = pg('#568f88');
    P.rect(0, 0, 400, H, pg(room === 1 ? '#667b78' : '#79737a'), .65, { jit: 0 });
    P.rect(0, 178, 400, 46, pg('#8a8174'), .6, { jit: 1 });
    for (let y = 183; y < 224; y += 10) P.line([[0, y], [400, y]], dark, .3, .7);
    P.rect(0, 158, 400, 16, dark, .6);
    for (let x = 0; x < 400; x += 24) P.poly([[x, 174], [x + 10, 162], [x + 18, 162], [x + 8, 174]], cream, .6);
    if (room === 0) {
      for (let i = 0; i < 8; i++) { const x = 174 + i * 15; P.line([[x - 30, 0], [x - 30, 42 + i * 4], [x, 74 + i * 3], [x, 162]], dark, .85, 4); P.line([[x - 28, 0], [x - 28, 40 + i * 4], [x + 2, 73 + i * 3], [x + 2, 162]], off ? teal : cream, .5, 1); }
      P.rect(37, 70, 131, 85, dark, .7); P.reserve([[42,75],[163,75],[163,150],[42,150]]); P.rect(42, 75, 121, 75, metal, .6); P.ell(75, 96, 17, 14, cream, .8); P.line([[75, 96], [86, 88]], dark, .9, 2);
      for (let i = 0; i < 4; i++) P.rect(109 + i * 11, 84, 5, 22, teal, .85);
    } else if (room === 1) {
      P.rect(61, 82, 165, 78, dark, .7); P.reserve([[67,88],[220,88],[220,154],[67,154]]); P.rect(67, 88, 153, 66, metal, .6);
      P.ell(285, 83, 53, 53, dark, .85); P.ell(285, 83, 45, 45, teal, .65); P.ell(285, 83, 36, 36, dark, .8);
      P.rect(231, 151, 37, 27, dark, .9);
      if (power === 'lights' || off) { P.poly([[245, 121], [211, 178], [287, 178]], cream, .3); P.rect(238, 146, 20, 31, cream, .8); }
      P.line([[145, 0], [145, 65], [285, 65]], dark, .8, 7);
    } else {
      P.rect(213, 22, 163, 140, dark, .95); P.reserve([[221,28],[368,28],[368,156],[221,156]]); P.rect(221, 28, 147, 128, metal, .6);
      P.ell(294, 88, 48, 48, dark, .85); P.ell(294, 88, 40, 40, off ? teal : pg('#b68c50'), .65);
      for (let i = 0; i < 6; i++) { P.rect(228, 43 + i * 14, 15, 5, dark, .9); P.rect(346, 43 + i * 14, 15, 5, dark, .9); }
      for (let i = 0; i < 3; i++) P.line([[30, 36 + i * 26], [166, 36 + i * 26], [198, 61 + i * 26], [213, 61 + i * 26]], dark, .8, 8);
      P.rect(49, 126, 91, 31, dark, .8); P.rect(54, 131, 81, 21, teal, .7);
    }
    P.rect(0, 125, 15, 54, dark, .95); if (room < 2) P.rect(385, 125, 15, 54, dark, .95);
    return P.out();
  });
}
const generatorEntry = HOOKS['room:generator:0'];
HOOKS['room:generator:0'] = async () => {
  await generatorEntry();
  if (once('genmanual')) {
    await say('A MAINTENANCE LABEL: PERCUSSIVE MAINTENANCE AUTHORIZED.');
    await showCard(['LEARNED: PANEL WHACK', '', '1 WP. STRIKES BEFORE MACHINES.', 'CANCELS THEIR CHARGED ATTACK.', '', 'AMBER: INTERRUPT OR DEFEND.', 'TEAL: VENTS OPEN. HIT FOR DOUBLE.', '', 'Z / X: CONFIRM   C: BACK'], 0, { bg: PAPER, fg: SEPIA });
  }
};
HOOKS['room:generator:1'] = async () => { if (!GS.flags.generatordone && once('genpanelhint')) await say('A FAN, A DARK CLOSET, AND ONE WORKING CIRCUIT. THE SWITCH PANEL IS AHEAD.'); };
const generatorPre = HOOKS['preboss:generator'];
HOOKS['preboss:generator'] = async () => { await generatorPre(); await say('REQUEST TO STOP RECEIVED. INCREASING OUTPUT.', 'POTENTIAL GENERATOR'); };
const generatorPost = HOOKS['postboss:generator'];
HOOKS['postboss:generator'] = async () => {
  generatorRoom(FIELD); await generatorPost();
  await say('THE HUM STOPS. FOR THE FIRST TIME, YOU CAN HEAR THE ROOM.');
  if (GS.hero === 'carl') {
    await say('DELIVERY COMPLETE, I THINK.', 'CARL');
    const q = QUESTS.find(q => q.id === 'ch_carl'); if (qGet(q.id).s === 1) await finishQuest(q);
    GS.quests.carlparcel = { s: 1, n: 0 }; GS.open.depot = 1;
    await say('THE OTHER PACKAGE IS FOR THE DEPOT. IT IS STILL ABOARD MY SHIP.', 'CARL');
    await say('THE BUS DEPOT WEST OF LOT 9 STILL HAS YOUR PACKAGE COMING. THE ADDRESS IS STILL A SMELL.');
  }
};
const generatorLot = HOOKS['town:lot'];
HOOKS['town:lot'] = async () => {
  if (generatorLot) await generatorLot();
  if (GS.flags.generatordone && once('genquiet')) await say('SOMEBODY IS ASLEEP BESIDE THE SHIP. NOBODY HAS THE HEART TO ASK THEM TO SIGN.');
};

HOOKS['town:depot'] = async () => {
  if (GS.hero !== 'carl' || !GS.quests.carlparcel || GS.quests.carlparcel.s !== 1 || GS.flags.delivered_carlparcel) return;
  await sayAll([['THE DISPATCHER', 'FREIGHT WINDOW. PARCELS WITH NORMAL ADDRESSES LEFT. WE PUT THEM OVER THERE.'], ['THE DISPATCHER', 'THAT IS A NEW SMELL. YOU HAVE SOMETHING FOR US.']]);
};
const depotTalk = talkNpc;
talkNpc = async n => {
  if (!n.parcel) return depotTalk(n);
  const q = QUESTS.find(q => q.id === 'carlparcel');
  if (!q || qGet(q.id).s !== 1) return depotTalk(n);
  GS.busy = 1;
  try {
    const choice = await choose(['DELIVER THE LOT 9 PACKAGE', 'ASK ABOUT THE SMELL', 'NOT YET'], { x: 8, y: 52, cancel: 1 });
    if (choice === 0) {
      await sayAll([['CARL', 'PACKAGE FOR THE BUS DEPOT. THE ADDRESS IS A SMELL.'], ['THE DISPATCHER', 'THAT IS THE QUIET BEFORE THE FIRST DEPARTURE. WE HAVE BEEN EXPECTING THIS.'], ['CARL', 'WHO SENT IT?'], ['THE DISPATCHER', 'NO RETURN ADDRESS. JUST A SIGNATURE: NOBODY.']]);
      await finishQuest(q);
      await say('THE FREIGHT WINDOW CLOSES. A BUS PASS IS SLID UNDER IT.', 'THE DISPATCHER');
    } else if (choice === 1) await sayAll([['THE DISPATCHER', 'DUST, HOT METAL, AND FIVE MINUTES BEFORE A BUS LEAVES.'], ['CARL', 'THAT IS A LOT OF ADDRESS.']]);
  } finally { GS.busy = 0; }
};
