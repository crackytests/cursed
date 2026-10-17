'use strict';
// ================= VISITOR: THE NORMALCY: species, gifts, vitality, feeding, the Normalcy, humanity, freakouts =================
// Replaces DX's augmentations. The engine still asks for AUGS / augLvl / P.augOn[...] for its effects (speed, cloak,
// vision, strength, ballistic...), so toggle gifts mirror themselves onto those engine names while they run.

// ---------- species (new lore: the clerk guessed; nobody confirms Carl is theirs) ----------
const SPECIES = {
  reptilian: { name: 'REPTILIAN', plural: 'REPTILIANS', col: '#60d090', fx: '#a0e0ff', gifts: ['command', 'scales', 'boardroom'],
    feed: 'BODY HEAT', feedVerb: 'A hand on the shoulder. A long, warm hug. They go cold and sleepy.', feedTxt: ['brr', '*shiver*', 'is it cold in here', 'I need a sweater'],
    desc: 'The Board. Lizard people in good suits, exactly like the pamphlets say. They feed on body heat, which is why the people who work for them are always cold. They run companies because companies are cold places.' },
  nordic: { name: 'NORDIC', plural: 'NORDICS', col: '#f0e0a0', fx: '#ffc0e0', gifts: ['starspeed', 'starsight', 'radiance'],
    feed: 'ADMIRATION', feedVerb: 'Eye contact. They drink the look.', feedTxt: ['wow', '...who are you', 'I feel like I know you', 'are you famous'],
    desc: 'Tall, pale, perfect, very sad. They feed on being looked at, so they live in Hollywood, where looking is an industry. They fall in love with beautiful things and then stand in front of them for a week.' },
  grey: { name: 'GREY', plural: 'GREYS', col: '#b0b8c8', fx: '#60ff90', gifts: ['probe', 'missingtime', 'scan'],
    feed: 'A SAMPLE', feedVerb: 'A quiet probe. They wake up with missing time.', feedTxt: ['...', 'what time is it', 'how did I get here', 'I lost an hour'],
    desc: 'The Clinic. Big heads, lab coats, a strict hierarchy of who gets to hold the clipboard. They take a small sample and leave the human with missing time. The probing jokes are, unfortunately, accurate.' },
  martian: { name: 'MARTIAN', plural: 'MARTIANS', col: '#80ff40', fx: '#ff6040', gifts: ['atomic', 'jet', 'leader'],
    feed: 'OUTRAGE', feedVerb: 'Start an argument. Drink the heat of it.', feedTxt: ['oh YEAH?', 'says WHO', 'unbelievable', "that's not what I SAID"],
    desc: 'Little green men from the 1950s who never got their invasion. They became a punchline and never forgave anyone. They feed on outrage, so they start fights in bars and in comment sections. They are the backbone of the Crashers.' },
  cryptid: { name: 'CRYPTID', plural: 'CRYPTIDS', col: '#a07050', fx: '#c0a080', gifts: ['blurry', 'swarm', 'bigfoot'],
    feed: 'FEAR', feedVerb: 'Be glimpsed. Drink the scream they swallow.', feedTxt: ['!!!', 'w-what was', 'did you see', '...nothing. nothing.'],
    desc: 'Mothmen, bigfoots, things in blurry photos. They cannot pass as human at all, so they live in the storm drains and run SewerNet. They feed on fear. A human who sees one up close is a Normalcy strike.' },
  broadcast: { name: 'BROADCAST', plural: 'THE BROADCAST', col: '#c0a0ff', fx: '#ffffff', gifts: ['interference', 'deadair', 'signal'],
    feed: 'LOST THOUGHTS', feedVerb: 'The "what was I saying?" moment. They take the thought.', feedTxt: ['what was I...', 'I had it a second ago', 'where was I', 'the word is on the tip of'],
    desc: 'Beings of radio static who came in on a signal and never fully tuned in. They feed on lost thoughts. They hear the plot before it happens. The other species call them mad. Nobody calls them wrong.' },
  pod: { name: 'POD PERSON', plural: 'POD PEOPLE', col: '#90b040', fx: '#c0e060', gifts: ['spores', 'husk', 'sprout'],
    feed: 'SLEEP', feedVerb: 'Sit by them. They get very, very tired.', feedTxt: ['*yawn*', 'so sleepy', 'I could just lie down', 'zzz'],
    desc: 'Desert drifters out of the old body-snatcher movies. They feed on sleep, which is why they wait by beds. Loners. Bad at parties. They will not tell you what is in the pods.' },
};
const species = () => (P && P.species) || 'grey';
const SP = () => SPECIES[species()];

// ---------- gifts ----------
// kind: toggle (drains vitality while on; `as` mirrors engine effects) | cast (costs vitality once). visible: a human who sees it is a Normalcy strike.
const AUGS = {
  light: { name: 'EYE GLOW', kind: 'toggle', drain: 0, max: 1, desc: "Carl's eyes. They glow. Lights the area in front of him. Guards can see it. So can everyone else." },
  command: { sp: 'reptilian', name: 'COLD COMMAND', kind: 'cast', cost: 12, desc: 'Look a human in the eye and tell them. Level 1-2: FORGET (they stand down and forget you, and stop being a witness). Level 3+: SLEEP (they lie down). Level 5: works on people already fighting you. Opens conversation options.' },
  scales: { sp: 'reptilian', name: 'SCALES', kind: 'toggle', drain: 3, as: ['ballistic'], desc: 'The suit hides them. Bullets find them. Reduces bullet damage by 20-65%.' },
  boardroom: { sp: 'reptilian', name: 'BOARDROOM', kind: 'toggle', drain: 5, aura: 1, desc: 'The feeling of being called into a meeting. Hostile people near Carl hesitate and do not shoot unless he hurts them. Wider at higher levels.' },
  starspeed: { sp: 'nordic', name: 'STARSPEED', kind: 'toggle', drain: 5, as: ['speed'], visible: 1, desc: 'Move faster than people can follow. They notice. Level 2+ vaults rails.' },
  starsight: { sp: 'nordic', name: 'STARSIGHT', kind: 'toggle', drain: 2, as: ['vision', 'target'], desc: 'See in the dark, see true forms, read people. Level 3+: see people through walls.' },
  radiance: { sp: 'nordic', name: 'RADIANCE', kind: 'toggle', drain: 5, aura: 1, desc: 'Be so beautiful nobody can shoot you. Hostile people near Carl hesitate unless he hurts them. Opens conversation options.' },
  probe: { sp: 'grey', name: 'PROBE', kind: 'cast', cost: 10, visible: 1, desc: 'A green beam. Takes a sample at range: damages the target and heals Carl. Higher levels: more.' },
  missingtime: { sp: 'grey', name: 'MISSING TIME', kind: 'cast', cost: 15, desc: 'The target loses the last few minutes. Erase every witness to a Normalcy strike and the strike goes away. Level 3+: everyone nearby. Opens conversation options.' },
  scan: { sp: 'grey', name: 'SCAN', kind: 'toggle', drain: 2, as: ['vision', 'target'], desc: 'See in the dark, see true forms, read health and weapons. Level 3+: through walls.' },
  atomic: { sp: 'martian', name: 'ATOMIC MUSCLE', kind: 'toggle', drain: 3, as: ['strength', 'muscle'], desc: 'Hit like a 1950s poster. Melee damage up, carry bodies at full speed, smash crates.' },
  jet: { sp: 'martian', name: 'JET', kind: 'toggle', drain: 5, as: ['speed', 'silent'], visible: 1, desc: 'A little rocket noise nobody else can hear. Move fast and quiet. People notice the fast part.' },
  leader: { sp: 'martian', name: 'TAKE ME TO YOUR LEADER', kind: 'cast', cost: 15, visible: 1, desc: 'Drop the act for one second. Hostile people nearby run. Wider and longer at higher levels. Opens conversation options.' },
  blurry: { sp: 'cryptid', name: 'BLURRY PHOTO', kind: 'toggle', drain: 8, as: ['cloak'], desc: 'Go out of focus. People and animals cannot see Carl. Machines still can. Attacking blurs him back in for a moment.' },
  swarm: { sp: 'cryptid', name: 'MOTH SWARM', kind: 'cast', cost: 18, visible: 1, desc: 'A cloud of moths at the crosshair. Everyone in it is blinded and stumbling. Bigger at higher levels.' },
  bigfoot: { sp: 'cryptid', name: 'BIGFOOT', kind: 'toggle', drain: 3, as: ['strength', 'muscle'], visible: 1, desc: 'Let the shoulders out. Melee damage up, carry anything. Very visible.' },
  interference: { sp: 'broadcast', name: 'INTERFERENCE', kind: 'cast', cost: 15, desc: 'Cross their wires. The target forgets whose side they are on and fights whoever is nearest. Level 3+: everyone near the target.' },
  deadair: { sp: 'broadcast', name: 'DEAD AIR', kind: 'toggle', drain: 8, as: ['cloak'], desc: 'Become the gap between stations. People cannot see Carl. Machines can.' },
  signal: { sp: 'broadcast', name: 'SIGNAL', kind: 'toggle', drain: 2, as: ['vision', 'target'], desc: 'Tune in. See in the dark, see true forms, hear what people are about to say. Level 3+: through walls.' },
  spores: { sp: 'pod', name: 'SPORES', kind: 'toggle', drain: 3, as: ['strength'], claws: 1, visible: 1, desc: 'Bare hands become something that is not hands. Lethal unarmed attacks. Level 3+: crouch and hold still to TAKE ROOT: invisible, healing.' },
  husk: { sp: 'pod', name: 'HUSK', kind: 'toggle', drain: 4, as: ['ballistic', 'regen'], desc: 'Harden the outside. Less bullet damage, slow healing.' },
  sprout: { sp: 'pod', name: 'SPROUT', kind: 'cast', cost: 20, visible: 1, desc: 'Grow a pod double of Carl where you aim. Enemies attack it instead. Lasts longer and takes more at higher levels.' },
};
for (const k in AUGS) if (AUGS[k].max === undefined) AUGS[k].max = 5;
const GIFT_COST = [1000, 1000, 1500, 2200, 3000]; // to reach level 1..5
const augLvl = id => (P.augs[id] || 0);
const augActive = id => !!(P.augOn[id]);
function speciesGifts() { return SP().gifts; }
function augHotkeys() { return speciesGifts().filter(id => augLvl(id)).concat(['light']); }
function raiseGift(id) { const l = augLvl(id); if (l >= 5) return false; const c = GIFT_COST[l]; if (P.sp < c) return false; P.sp -= c; P.augs[id] = l + 1; sfx('get'); msg(AUGS[id].name + ' LEVEL ' + (l + 1)); if (P.augOn[id]) { toggleAug(id); toggleAug(id); } return true; }
function installAug(id) { P.augs[id] = Math.max(1, P.augs[id] || 0); }
function upgradeAug() { return false; }

const SKILLS = {
  denial: { name: 'DENIAL', cost: [800, 1500, 2600], desc: 'Persuasion. Insist so hard on being a normal human that people give up. Opens conversation options.' },
  rant: { name: 'RANT', cost: [800, 1500, 2600], desc: 'Intimidation. Carl keeps talking past the point where a sane person would stop, and that is frightening. Opens conversation options.' },
  charm: { name: 'CHARM', cost: [800, 1500, 2600], desc: 'Seduction, in the loosest sense. Carl is awkward and somehow it works. Opens conversation options, and charmed people let you feed.' },
  computer: { name: 'COMPUTER', cost: [1000, 1700, 2800], desc: 'Hack computers and security terminals without a login.' },
  electronics: { name: 'ELECTRONICS', cost: [800, 1300, 2300], desc: 'Fewer multitools to bypass keypads, cameras, alarms and lasers.' },
  lockpicking: { name: 'LOCKPICKING', cost: [1000, 1700, 2800], desc: 'Fewer lockpicks per lock.' },
  medicine: { name: 'MEDICINE', cost: [700, 1400, 2400], desc: 'First aid kits heal more. MEND costs less vitality.' },
  pistol: { name: 'FIREARMS: PISTOL', cost: [1200, 2000, 3200], desc: 'Revolvers, pistols and the crossbow: accuracy, damage, reload.' },
  rifle: { name: 'FIREARMS: LONG', cost: [1200, 2000, 3200], desc: 'Shotguns, rifles and SMGs: accuracy, damage, reload.' },
  heavy: { name: 'FIREARMS: HEAVY', cost: [1100, 2000, 3200], desc: 'Flamethrower, ray gun, rocket launcher.' },
  lowtech: { name: 'MELEE', cost: [1000, 1800, 3000], desc: 'Tire irons, axes, katanas, bats, fists and claws.' },
  demo: { name: 'EXPLOSIVES', cost: [800, 1500, 2600], desc: 'Pipe bombs and tear gas: throw range and damage.' },
};
const SKILL_LV = ['UNTRAINED', 'TRAINED', 'ADVANCED', 'MASTER'];
const sk = id => (P.skills[id] || 0);
const skMul = id => [1, .75, .52, .32][sk(id)];
function buySkill(id) { const s = SKILLS[id], l = sk(id); if (l >= 3) return false; const c = s.cost[l]; if (P.sp < c) return false; P.sp -= c; P.skills[id] = l + 1; sfx('ok'); return true; }
function giveSP(n, why) { P.sp += n; msg('+' + n + ' XP' + (why ? ': ' + why : '')); sfx('get'); chatSay(pick(['XP', 'pog', 'spend it on charm', 'spend it on DENIAL lmao', 'gifts gifts gifts', 'level up carl']), 1); }

// ---------- toggles and casts ----------
function mirrorOn(id, l) { for (const a of AUGS[id].as || []) { P.augOn[a] = Math.min(4, l); P.augs[a] = Math.max(P.augs[a] || 0, Math.min(4, l)); } if (AUGS[id].aura) P.augOn.awe = l; if (AUGS[id].claws) P.augOn.claws = l; }
function mirrorOff(id) { for (const a of AUGS[id].as || []) if (!Object.keys(P.augOn).some(o => o !== id && AUGS[o] && AUGS[o].as && AUGS[o].as.includes(a))) delete P.augOn[a]; if (AUGS[id].aura) delete P.augOn.awe; if (AUGS[id].claws) delete P.augOn.claws; }
function toggleAug(id) {
  const a = AUGS[id]; if (!a) return; const l = augLvl(id) || (id === 'light' ? 1 : 0); if (!l) return;
  if (a.kind === 'cast') { castGift(id, l); return; }
  if (P.augOn[id]) { delete P.augOn[id]; mirrorOff(id); sfx('powerdown'); msg(a.name + ' OFF'); return; }
  if (P.bio <= 0 && a.drain) { msg('NO VITALITY. FEED.'); sfx('locked'); return; }
  P.augOn[id] = l; mirrorOn(id, l); sfx('power'); msg(a.name + ' ON'); if (a.visible) visibleGift(a.name);
}
function augTick() {
  if (!P) return; let drain = 0;
  for (const id in P.augOn) { const a = AUGS[id]; if (!a || a.kind !== 'toggle') continue; drain += a.drain * (1 + (P.augOn[id] - 1) * .15); }
  if (drain > 0) { P.bio -= drain * DT * .45; if (P.bio <= 0) { P.bio = 0; for (const id in P.augOn) if (AUGS[id] && AUGS[id].drain) { delete P.augOn[id]; mirrorOff(id); } msg('VITALITY GONE. FEED.'); sfx('powerdown'); } }
  if (P.augOn.regen) { const rate = [0, 3, 5, 7, 10][P.augOn.regen] * DT; for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + rate); }
  // visible toggles: a witness while Carl uses them (and moves) is a strike
  if (frame % 90 === 0 && P.moving) for (const id in P.augOn) if (AUGS[id] && AUGS[id].visible && AUGS[id].kind === 'toggle') { visibleGift(AUGS[id].name); break; }
  // auras: hostile people nearby hesitate
  if (P.augOn.awe) { const M = P.map, r = 3 + P.augOn.awe; for (const e of M.ents) if (e.k === 'npc' && !e.dead && !e.down && !e.mech && !e.animal && hostileTo(e, P) && dist(e, P) < r && !e.hurtByP) { e.fireT = Math.max(e.fireT, 12); e.sus = Math.min(e.sus, .9); if (frame % 120 === 0 && rnd(2) === 0) M.fx.push({ txt: pick(['...', 'I c-can\'t', 'wow', 'sir?']), x: e.x, y: e.y, t: 50, t0: 50, c: hex(SP().fx) }); } }
  // CRYPTIDS can't pass: a human who sees one up close, in the light, is a breach
  if (species() === 'cryptid' && frame % 60 === 30 && !P.augOn.cloak && !P.rooted && !P.crouch && lightAt(P.map, P.x, P.y) > .35) { const w = witnesses(P.map, P.x, P.y).filter(e => dist(e, P) < 2.2 && e.ai === 'civ'); if (w.length) breach('A CRYPTID WAS SEEN', w); }
  // TAKE ROOT: crouched and still with SPORES 3+
  P.rooted = P.augOn.claws >= 3 && P.crouch && P.stillT > 1;
  if (P.rooted) { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + 4 * DT); }
  // pod doubles wither
  for (const e of P.map.ents) if (e.decoy && !e.dead && (e.life -= DT) <= 0) { P.map.fx.push({ gas: 1, smoke: 1, col: '#90b040', x: e.x, y: e.y, r: .8, t: 60, t0: 60, s: rnd(999) }); removeEnt(P.map, e); }
}
function giftTarget(range, cone = .5) {
  const M = P.map; let best = null, bd = 1e9;
  if (MOUSE.on) for (const s of SHOWN.actors) { const a = s.a; if (a === P || a.dead || a.down || a.k !== 'npc') continue; if (MOUSE.x > s.x - s.w / 2 - 2 && MOUSE.x < s.x + s.w / 2 + 2 && MOUSE.y > s.y - 2 && MOUSE.y < s.y + s.h + 2 && dist(a, P) < range && clearLine(M, P.x, P.y, a.x, a.y)) return a; }
  for (const e of M.ents) { if (e.k !== 'npc' || e.dead || e.down || e.decoy) continue; const d = dist(e, P); if (d > range || Math.abs(angDiff(P.aim, angTo(P, e))) > cone) continue; if (!clearLine(M, P.x, P.y, e.x, e.y)) continue; if (d < bd) { bd = d; best = e; } }
  return best;
}
const isHuman = e => e && e.k === 'npc' && !e.mech && !e.animal && !e.vis && !e.ghost;
function castGift(id, l) {
  const a = AUGS[id], M = P.map; if (P.bio < a.cost) { msg('NOT ENOUGH VITALITY (' + a.cost + ')'); sfx('locked'); return; }
  if (P.castT > 0) return;
  const spend = () => { P.bio = Math.max(0, P.bio - a.cost); P.castT = 20; P.reachT = 12; P.reachA = P.aim; sfx('power'); if (a.visible) visibleGift(a.name); };
  const col = hex(SP().fx);
  if (id === 'command') { const t = giftTarget(7); if (!t || !isHuman(t)) { msg('COLD COMMAND: look at a person.'); return; } spend(); M.fx.push({ tracer: 1, x: P.x, y: P.y, x2: t.x, y2: t.y, t: 10, t0: 10, col: '#a0e0ff' });
    if (t.state === 'combat' && l < 5) { msg('They are too worked up to listen.'); M.fx.push({ txt: 'NO!', x: t.x, y: t.y, t: 40, t0: 40, c: UIC.red }); return; }
    if (l >= 3) { t.hostile = 0; knockOut(M, t); t.wakeT = 40; M.fx.push({ txt: 'SLEEP.', x: t.x, y: t.y, t: 60, t0: 60, c: col }); } else { forget(t); M.fx.push({ txt: 'FORGET.', x: t.x, y: t.y, t: 60, t0: 60, c: col }); } return; }
  if (id === 'probe') { const t = giftTarget(9); if (!t) { msg('PROBE: aim at someone.'); return; } spend(); const dmg = 10 + l * 7; M.fx.push({ tracer: 1, x: P.x, y: P.y, x2: t.x, y2: t.y, t: 14, t0: 14, col: '#60ff90', thick: 1 }); damageNPC(M, t, dmg, P, {}); t.hurtByP = 1; if (!t.mech) { for (const k in P.parts) P.parts[k] = Math.min(100, P.parts[k] + dmg * .4); P.bio = Math.min(100, P.bio + dmg * .25); } sfx('zap'); return; }
  if (id === 'missingtime') { const ts = l >= 3 ? M.ents.filter(e => isHuman(e) && !e.dead && !e.down && dist(e, P) < 4 + l && clearLine(M, P.x, P.y, e.x, e.y)) : [giftTarget(7)].filter(isHuman); if (!ts.length) { msg('MISSING TIME: look at a person.'); return; } spend(); for (const t of ts) { forget(t); M.fx.push({ txt: '...?', x: t.x, y: t.y, t: 60, t0: 60, c: col }); } eraseWitnesses(ts); return; }
  if (id === 'leader') { spend(); const r = 3 + l; let n = 0; M.fx.push({ flash: 1, x: P.x, y: P.y, t: 16, t0: 16, r: r * 14, col: '#80ff40' }); for (const e of M.ents) if (e.k === 'npc' && !e.dead && !e.down && !e.mech && dist(e, P) < r) { e.state = 'flee'; e.threat = P; e.fleeT = 0; e.cower = -(2 + l); n++; } if (n) chatSay(pick(['TAKE ME TO YOUR LEADER', 'they RAN', 'the little green menace']), 1); return; }
  if (id === 'swarm') { spend(); const d = Math.min(7, MOUSE.on ? Math.hypot((MOUSE.x + G.cam.x) / TW - P.x, (MOUSE.y + G.cam.y + 12) / TH - P.y) : 4); const x = P.x + Math.cos(P.aim) * d, y = P.y + Math.sin(P.aim) * d; M.fx.push({ gas: 1, smoke: 1, moth: 1, col: '#c0a880', x, y, r: 1 + l * .35, t: 240 + l * 60, t0: 240 + l * 60, s: rnd(999) }); sfx('gas'); return; }
  if (id === 'interference') { const t0 = giftTarget(8); if (!t0) { msg('INTERFERENCE: aim at someone.'); return; } spend(); const ts = l >= 3 ? M.ents.filter(e => e.k === 'npc' && !e.dead && !e.down && dist(e, t0) < 3) : [t0]; for (const t of ts) { t.scrambled = 4 + l * 2; t.state = 'idle'; t.target = null; t.path = null; M.fx.push({ txt: pick(['#@!', '...who?', 'kzzt', 'WHO ARE YOU']), x: t.x, y: t.y, t: 50, t0: 50, c: col }); } sfx('zap'); return; }
  if (id === 'sprout') { spend(); let x = P.x + Math.cos(P.aim) * 1.2, y = P.y + Math.sin(P.aim) * 1.2; if (!passable(M, x, y, {})) { x = P.x; y = P.y; } const e = spawnEnt(M, { k: 'npc', t: 'decoy', x, y, decoy: 1, life: 12 + l * 5, hp: 30 + l * 20 }); e.face = P.aim; sfx('thud'); return; }
}
function forget(t) { t.sus = 0; t.alerted = 0; t.hostile = 0; t.lastSeen = null; t.target = null; if (t.state === 'combat' || t.state === 'search' || t.state === 'sus' || t.state === 'flee') { t.state = 'return'; t.path = null; } t.forgot = G.t; }

// ---------- the Normalcy ----------
const VIOL = { lastT: -99, wit: [], undone: 1 };
function witnesses(M, x, y, ignore) {
  if (P.augOn.cloak || P.rooted) return [];
  const out = []; for (const e of M.ents) { if (!isHuman(e) || e.dead || e.down || e === ignore || e.knows || e.stunT > 0 || e.scrambled > 0 || e.decoy || e.state === 'talk') continue;
    const d = Math.hypot(e.x - x, e.y - y); if (d > 9) continue; const lit = lightAt(M, x, y) > .18 || d < 3;
    if (lit && (d < 1.6 || seesPoint(M, e, x, y, e.viewR || 8, 1.4))) out.push(e); }
  return out;
}
function visibleGift(name) { const w = witnesses(P.map, P.x, P.y); if (w.length) breach(name + ' WITNESSED', w); }
function breach(why, wit) {
  if (G.t - VIOL.lastT < 5 || G.noBreach) return; VIOL.lastT = G.t; VIOL.wit = wit.map(e => e.uid); VIOL.undone = 0; VIOL.map = P.map.id;
  P.viol = (P.viol || 0) + 1; post.flash = Math.max(post.flash, .3); sfx('alarm');
  msg('NORMALCY BREACH: ' + why + ' (' + P.viol + '/5)'); chatSay(pick(['THE NORMALCY', 'carl thats a breach', 'they SAW that', 'men in white suits incoming', 'BREACH', 'not very normal of you']), 1);
  for (const e of wit) { if (e.ai === 'civ') { e.state = 'flee'; e.threat = P; bark(P.map, e, 'scream'); } else if (e.ai === 'guard' && !hostileTo(e, P)) { e.state = 'combat'; e.hostile = 1; e.target = P; e.lastSeen = [P.x, P.y]; } }
  if (P.viol >= 5) run(normalcyOver);
  else if (P.viol === 3) infolink(G.hub === 'pro' ? 'PILOTX' : 'TOMMY', pick(['Three strikes, little brother. Two more and the suits come for you. Spoilers: you won\'t like them.', 'Carl, buddy. Three. That\'s three. The Consulate counts. Lay low.']));
}
function eraseWitnesses(ts) {
  if (VIOL.undone || G.t - VIOL.lastT > 40 || VIOL.map !== P.map.id) return; const gone = new Set(ts.map(e => e.uid)); VIOL.wit = VIOL.wit.filter(u => !gone.has(u) && P.map.ents.some(e => e.uid === u && !e.dead));
  if (!VIOL.wit.length) { VIOL.undone = 1; P.viol = Math.max(0, P.viol - 1); msg('NOBODY REMEMBERS. NORMALCY ' + P.viol + '/5'); sfx('goal'); }
}
function restoreNormalcy(n = 1, why) { if (!P.viol) return; P.viol = Math.max(0, P.viol - n); msg('NORMALCY RESTORED' + (why ? ': ' + why : '') + ' (' + P.viol + '/5)'); sfx('goal'); }
function loseHumanity(why) {
  P.hum = Math.max(0, (P.hum === undefined ? 7 : P.hum) - 1); msg('HUMANITY LOST: ' + why + ' (' + P.hum + '/10)'); sfx('hurt'); post.flash = Math.max(post.flash, .25);
  chatSay(pick(['carl...', 'that cost you', 'humanity going DOWN', 'he felt that one', 'the game is judging you', 'not very human of you']), 1);
  if (P.hum <= 0) run(humanityOver);
}
function gainHumanity(why) { if (P.hum >= 10) return; P.hum++; msg('HUMANITY: ' + why + ' (' + P.hum + '/10)'); sfx('goal'); }
async function normalcyOver() {
  if (G.over) return; G.over = 1; await wait(30); P.dead = 1; G.deathShown = 1;
  await vignette('THE NORMALCY', 'FIVE STRIKES', async () => { await T('N', 'The van has no markings. It never does.'); await T('WHITE', 'Mr. Carl. You have been very visible.'); await T('CARL', 'I\'m a normal human! I\'m a VTuber! It\'s a model! It\'s a, a rig, it\'s a, there\'s a guy in a, I\'m the guy!'); await T('WHITE', 'Of course you are. Please get in the van.'); await T('N', 'Carl\'s stream goes offline. Chat assumes it is a bit. It is not a bit.'); }, { left: 'WHITE', bg: '#e0e0e8' });
  G.over = 0; G.deathShown = 0; run(deathScreen);
}
async function humanityOver() {
  if (G.over) return; G.over = 1; await wait(30); P.dead = 1; G.deathShown = 1;
  await vignette('HUMANITY 0', 'SPECIES: VISITOR', async () => { await T('N', 'There is a moment when Carl stops saying it.'); await T('N', 'He has said "I\'m a normal human" every day of his life. He opens his mouth to say it, and nothing comes out, because he does not believe it any more.'); await T('N', 'The thing that walks out of the alley is very good at being a visitor. It is not Carl.'); }, { bg: '#100008' });
  G.over = 0; G.deathShown = 0; run(deathScreen);
}

// ---------- feeding (hold F) ----------
function feedTarget(M) { let best = null, bd = 1.3; for (const e of M.ents) { if (e.k !== 'npc' || e.dead || e.decoy) continue; const d = dist(e, P); if (d > bd) continue; if (Math.abs(angDiff(P.aim, angTo(P, e))) > 1.3 && d > .6) continue; best = e; bd = d; } return best; }
function canFeed(e) {
  if (!e) return 'nobody'; if (e.mech || e.ghost) return 'that is not a person'; if (e.animal) return 'no'; if (e.vis) return 'not on a visitor'; if (e.yokoid) return 'that is software';
  if (e.down || e.feedOK || e.charmed) return null; if (e.state === 'combat' || e.state === 'flee') return 'they are too alert'; if (e.drained) return 'they have nothing left';
  return null;
}
function feedTick(M) {
  const want = key('KeyF') || (P.freak && P.freakTgt);
  if (!P.feeding) {
    if (!want || P.carry || P.drone) return false; const e = P.freak ? P.freakTgt : feedTarget(M); const why = canFeed(e);
    if (why) { if (tap('KeyF') && !P.freak) msg('CAN\'T FEED: ' + why.toUpperCase()); return false; }
    P.feeding = { e, t: 0, wasDown: e.down, wit: 0 }; e.feeding = 1; if (!e.down) { e.state = 'talk'; e.moving = 0; e.face = angTo(e, P); } e.vit = e.vit === undefined ? 100 : e.vit; sfx('feed');
    if (!F.fedOnce) { F.fedOnce = 1; chatSay(pick(['HE\'S FEEDING', 'carl what are you DOING', 'is this allowed on stream', 'chat he is eating that man\'s ' + SP().feed.toLowerCase()]), 1); }
  }
  const f = P.feeding, e = f.e; P.moving = 0; P.face = P.aim = angTo(P, e);
  if ((!want && !P.freak) || e.dead || e.gone || dist(e, P) > 1.6) { endFeed(M); return true; }
  f.t += DT; const gain = 22 * DT * (1 + sk('medicine') * 0), take = 26 * DT;
  if (P.bio < 100 || e.vit <= 0) { P.bio = Math.min(100, P.bio + gain); e.vit -= take; }
  else if (!P.freak && f.t > .4) { msg('FULL. LET GO.'); }
  // the look of it, per species
  if (frame % 6 === 0) { const sc = SP(), c = sc.fx, k = Math.random(); M.fx.push({ spark: 1, x: e.x + (Math.random() - .5) * .5, y: e.y - .2 + (Math.random() - .5) * .3, t: 10, t0: 10, s: rnd(999), col: c });
    if (species() === 'grey' || species() === 'reptilian') M.fx.push({ tracer: 1, x: P.x, y: P.y, x2: e.x, y2: e.y, t: 3, t0: 3, col: c }); }
  if (frame % 50 === 0) M.fx.push({ txt: pick(SP().feedTxt), x: e.x, y: e.y, t: 46, t0: 46, c: hex(SP().fx) });
  if (frame % 30 === 0) { const w = witnesses(M, P.x, P.y, e); if (w.length && !f.wit) { f.wit = 1; breach('FEEDING WITNESSED', w); } }
  if (e.vit <= 0) { if ((frame >> 3) & 1) msg('TOO DEEP - LET GO'); if (e.vit < -30) { const civ = !hostileTo(e, P) || e.down; e.drainedDead = 1; kill(M, e, P, { drain: 1 }); endFeed(M); if (civ && !e.badguy) loseHumanity('drained a person'); else if (P.hum > 3) loseHumanity('drained someone dry'); } }
  if (P.freak && P.bio >= 45) endFeed(M);
  return true;
}
function endFeed(M) {
  const f = P.feeding; if (!f) return; const e = f.e; P.feeding = null; e.feeding = 0;
  if (!e.dead) { if (e.vit < 40) e.drained = 1; if (!f.wasDown) { e.down = 0; knockOut(M, e); e.wakeT = 25 + rnd(15); e.fedSleep = 1; } e.hostile = 0; e.sus = 0; e.alerted = 0; }
  if (P.freak) { P.freak = 0; P.freakTgt = null; msg('...okay. okay. I\'m okay.'); chatSay(pick(['he is NOT okay', 'breathe carl', 'that was scary', 'freakout over']), 1); }
  sfx('ok');
}
// ---------- mend (hold Q) ----------
function mendTick() {
  if (!key('KeyQ') || P.feeding) { P.mending = 0; return; } let need = 0; for (const k in P.parts) need += 100 - P.parts[k]; if (need < 1) { if (tap('KeyQ')) msg('Nothing to mend.'); P.mending = 0; return; }
  if (P.bio <= 0) { if (tap('KeyQ')) msg('NO VITALITY TO MEND WITH. FEED.'); P.mending = 0; return; }
  P.mending = 1; const h = 32 * DT, cost = h * (.45 - sk('medicine') * .07); for (const k in P.parts) if (P.parts[k] > 0 || k === 'legL' || k === 'legR' || k === 'armL' || k === 'armR') P.parts[k] = Math.min(100, P.parts[k] + h); P.bio = Math.max(0, P.bio - cost);
  if (frame % 10 === 0) P.map.fx.push({ spark: 1, x: P.x + (Math.random() - .5) * .4, y: P.y - .3, t: 10, t0: 10, s: rnd(999), col: SP().fx });
}
// ---------- freakout (frenzy, as anxiety) ----------
function freakTick(M) {
  if (P.feeding || G.cut) return false;
  if (!P.freak && frame % 60 === 0 && P.bio < 6 && Math.random() < .25 + (10 - (P.hum || 7)) * .04) startFreak(M, 'HUNGER');
  if (!P.freak) return false;
  P.freakT -= DT; if (P.freakT <= 0) { P.freak = 0; P.freakTgt = null; msg('...it passes.'); return false; }
  let t = P.freakTgt; if (!t || t.dead || canFeed(t) === 'not on a visitor') { t = null; let bd = 12; for (const e of M.ents) if (isHuman(e) && !e.dead && dist(e, P) < bd && clearLine(M, P.x, P.y, e.x, e.y)) { bd = dist(e, P); t = e; } P.freakTgt = t; }
  if (!t) { P.face = P.aim = P.aim + Math.sin(G.t * 9) * .3; return true; }
  const d = dist(t, P); P.aim = P.face = angTo(P, t);
  if (d > 1.1) { const sp = playerSpeed() * 1.25 * DT; moveBody(M, P, Math.cos(P.aim) * sp, Math.sin(P.aim) * sp); P.moving = 1; P.walkPh += sp * 3.2; return true; }
  t.feedOK = 1; if (!t.down) knockOut(M, t); return false; // feedTick takes over on the next frame
}
function startFreak(M, why) { if (P.freak) return; P.freak = 1; P.freakT = 7; P.freakTgt = null; msg('FREAKOUT: ' + why); sfx('alarm'); post.flash = .4; chatSay(pick(['CARL??', 'hes freaking out', 'FREAKOUT', 'oh no he\'s hungry', 'chat hold him back']), 1); }
// called from hurtPlayer: a big hit at low humanity can set it off
function freakOnHurt(dmg) { if (!P.freak && dmg > 14 && (P.hum || 7) < 5 && Math.random() < (5 - P.hum) * .08) startFreak(P.map, 'PANIC'); }
