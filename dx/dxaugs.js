'use strict';
// ================= DEUS EX NEVADA: augmentations and skills =================
// FATCO says these are nano-augmentations. The canisters say otherwise, if you read the fine print (disk 4).
const AUGS = {
  light: { name: 'EYE GLOW', slot: 'default', drain: 0, max: 1, desc: "Carl's eyes. They glow. FATCO wrote it down as an augmentation because it was easier than writing down what it actually is. Lights the area in front of him; guards can see it." },
  infolink: { name: 'INFOLINK (CHAT)', slot: 'default', drain: 0, max: 1, passive: 1, desc: 'FATCO encrypted comms, routed through what the techs keep calling "the chat." Nobody can explain who the other users are.' },
  drone: { name: 'LITTLE CARL', slot: 'cranial', drain: 12, max: 4, desc: 'A spy drone the size of a fist with two big eyes. Fly it ahead, then detonate it as an EMP blast. Higher levels: faster, bigger blast.' },
  aggdef: { name: 'AGGRESSIVE DEFENSE', slot: 'cranial', drain: 8, max: 4, desc: 'Detonates rockets and grenades before they reach Carl. Higher levels: wider radius.' },
  vision: { name: 'VISION ENHANCEMENT', slot: 'eyes', drain: 5, max: 4, desc: 'See in the dark. Level 3 sees people through walls nearby. Level 4 sees further.' },
  target: { name: 'TARGETING', slot: 'eyes', drain: 3, max: 4, desc: 'Tighter aim and target readout: name, health, weapon. Higher levels: more accuracy.' },
  strength: { name: 'COMBAT STRENGTH', slot: 'arms', drain: 4, max: 4, desc: 'Melee damage up. Throw objects. Break crates with a punch.' },
  muscle: { name: 'MICROFIBRAL MUSCLE', slot: 'arms', drain: 3, max: 4, desc: 'Lift and push heavy crates, carry bodies at full speed.' },
  speed: { name: 'SPEED ENHANCEMENT', slot: 'legs', drain: 6, max: 4, desc: 'Run faster. Level 2+: vault rails and fences. Level 4: very fast.' },
  silent: { name: 'RUN SILENT', slot: 'legs', drain: 2, max: 4, desc: 'Footsteps make no noise. Higher levels: even sprinting is quiet.' },
  ballistic: { name: 'BALLISTIC PROTECTION', slot: 'subdermal', drain: 4, max: 4, desc: 'Reduces bullet damage by 20/35/50/65%.' },
  emp: { name: 'EMP SHIELD', slot: 'subdermal', drain: 2, max: 4, passive: 1, desc: 'Passive: resists EMP, electric damage and energy drain.' },
  regen: { name: 'REGENERATION', slot: 'torso1', drain: 14, max: 4, desc: 'Heals body parts over time. Expensive.' },
  recirc: { name: 'POWER RECIRCULATOR', slot: 'torso1', drain: 0, max: 4, passive: 1, desc: 'Passive: every other augmentation drains less energy.' },
  envres: { name: 'ENVIRONMENTAL RESISTANCE', slot: 'torso2', drain: 3, max: 4, desc: 'Resist gas, smoke, fire and radiation. Hold your breath longer.' },
  shield: { name: 'ENERGY SHIELD', slot: 'torso2', drain: 5, max: 4, desc: 'Reduces fire, plasma and explosive damage.' },
  cloak: { name: 'CLOAK', slot: 'skin', drain: 20, max: 4, desc: 'Invisible to people and animals. Machines still see you. Shooting breaks it for a moment.' },
  radar: { name: 'RADAR TRANSPARENCY', slot: 'skin', drain: 10, max: 4, desc: 'Invisible to cameras, turrets and bots. People still see you.' },
};
const AUG_SLOTS = [['cranial', 'CRANIAL'], ['eyes', 'EYES'], ['arms', 'ARMS'], ['legs', 'LEGS'], ['subdermal', 'SUBDERMAL'], ['torso1', 'TORSO'], ['torso2', 'TORSO'], ['skin', 'SKIN']];
const AUG_PAIRS = { cranial: ['drone', 'aggdef'], eyes: ['vision', 'target'], arms: ['strength', 'muscle'], legs: ['speed', 'silent'], subdermal: ['ballistic', 'emp'], torso1: ['regen', 'recirc'], torso2: ['envres', 'shield'], skin: ['cloak', 'radar'] };
const augLvl = id => (P.augs[id] || 0);
const augActive = id => !!(P.augOn[id]);

const SKILLS = {
  computer: { name: 'COMPUTER', cost: [1125, 1800, 3000], desc: 'Hack computers, ATMs and security terminals. Untrained: you need a login. Trained: hacking. Master: turn turrets on their owners.' },
  electronics: { name: 'ELECTRONICS', cost: [900, 1350, 2475], desc: 'Fewer multitools to bypass keypads, cameras, alarms, lasers and turrets.' },
  environmental: { name: 'ENVIRONMENTAL', cost: [675, 1350, 2700], desc: 'Hazmat suits, armor, rebreathers and camo last longer.' },
  lockpicking: { name: 'LOCKPICKING', cost: [1800, 2700, 4500], desc: 'Fewer lockpicks per lock.' },
  medicine: { name: 'MEDICINE', cost: [900, 1800, 3000], desc: 'Medkits heal more.' },
  swimming: { name: 'SWIMMING', cost: [675, 1350, 2700], desc: 'Swim faster and hold your breath longer. Lake Mead is deep.' },
  pistol: { name: 'WEAPONS: PISTOL', cost: [1575, 2250, 3750], desc: 'Pistols and the mini-crossbow: accuracy, damage, reload.' },
  rifle: { name: 'WEAPONS: RIFLE', cost: [1575, 2250, 3750], desc: 'Rifles and shotguns: accuracy, damage, reload.' },
  heavy: { name: 'WEAPONS: HEAVY', cost: [1350, 2250, 3750], desc: 'GEP, LAW, flamethrower, plasma: accuracy, damage, and you move faster carrying them.' },
  lowtech: { name: 'WEAPONS: LOW-TECH', cost: [1350, 2250, 3750], desc: 'Knives, batons, prods, crowbars, the smoke cannon, the Dragon\'s Bong.' },
  demo: { name: 'WEAPONS: DEMOLITION', cost: [900, 1800, 3000], desc: 'Grenades: throw range, damage, and disarming planted mines.' },
  denial: { name: 'DENIAL', cost: [900, 1800, 3000], desc: '(new) Talk past people by being so insistently human they give up. Opens conversation options. Civilians stop staring.' },
};
const SKILL_LV = ['UNTRAINED', 'TRAINED', 'ADVANCED', 'MASTER'];
const sk = id => (P.skills[id] || 0);
const skMul = id => [1, .75, .52, .32][sk(id)]; // spread / tool use multiplier
function buySkill(id) { const s = SKILLS[id], l = sk(id); if (l >= 3) return false; const c = s.cost[l]; if (P.sp < c) return false; P.sp -= c; P.skills[id] = l + 1; sfx('ok'); return true; }
function giveSP(n, why) { P.sp += n; msg('+' + n + ' SKILL POINTS' + (why ? ': ' + why : '')); sfx('get'); chatSay(pick(['pog', 'POINTS', 'spend them on lockpicking', 'spend them on denial lmao', 'swimming is useless dont', 'rifle rifle rifle']), 1); }

// ---------- energy ----------
function augTick() {
  if (!P) return;
  const rec = augLvl('recirc'), mult = 1 - rec * .12;
  let drain = 0;
  for (const id in P.augOn) { const a = AUGS[id], l = augLvl(id) || (a.slot === 'default' ? 1 : 0); if (!l) { delete P.augOn[id]; continue; } drain += a.drain * (1 + (l - 1) * .2) * mult; }
  if (drain > 0) { P.bio -= drain * DT * .5; if (P.bio <= 0) { P.bio = 0; for (const id in P.augOn) if (AUGS[id].drain) delete P.augOn[id]; msg('BIOELECTRIC ENERGY DEPLETED'); sfx('powerdown'); } }
  // effects
  if (P.augOn.regen && P.bio > 0) { const rate = [0, 4, 6, 9, 13][augLvl('regen')] * DT; for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + rate); }
}
function toggleAug(id) {
  const a = AUGS[id]; if (!a || a.passive) return; const l = augLvl(id) || (a.slot === 'default' ? 1 : 0); if (!l) return;
  if (P.augOn[id]) { delete P.augOn[id]; sfx('powerdown'); msg(a.name + ' OFF'); }
  else { if (P.bio <= 0 && a.drain) { msg('NOT ENOUGH ENERGY'); return; } P.augOn[id] = l; sfx('power'); msg(a.name + ' ON'); if (id === 'drone') launchDrone(); }
}
// the order augs appear on the HUD and their F-keys
function augHotkeys() { const out = ['light']; for (const [s] of AUG_SLOTS) for (const id of AUG_PAIRS[s]) if (augLvl(id) && !AUGS[id].passive) out.push(id); return out; }
function installAug(id) { P.augs[id] = 1; msg('INSTALLED: ' + AUGS[id].name); sfx('get'); chatSay(pick(['AUGMENTED', 'hes getting upgrades', 'is that even legal', 'carl is becoming the machine', 'they put WHAT in him']), 1); }
function upgradeAug(id) { const it = invFind('upg'); if (!it) return false; if (!P.augs[id] || P.augs[id] >= AUGS[id].max) return false; P.augs[id]++; removeItem(it); sfx('get'); msg(AUGS[id].name + ' LEVEL ' + P.augs[id]); return true; }
