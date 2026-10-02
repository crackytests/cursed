'use strict';
// ================= YOKO — the support battle. you are the assistant. everyone else decides for themselves =================
// Yoko never attacks and can't be knocked out. Her FOCUS buys help. Her OVERRULE works every time, and everyone remembers it.
const YREC = { overrule: 0, suggest: 0, followed: 0, ignored: 0, assist: 0, translate: 0, restore: 0, fell: 0, battles: 0, wins: 0, trust: {} };
const PARTY = {}; // persistent ally state across battles: { KEY: {hp, max, trust, pot, restored} }
const BT = { on: false, allies: [], foes: [], fp: 3, fpMax: 6, round: 0, log: [], msg: '', t: 0, def: null, hl: null, shake: 0, fx: [] };
// ---------- the party ----------
const ALLY = {
  CARL: { name: 'CARL', max: 34, atk: 7, def: 2, spd: 6, tone: 'dmg',
    moves: ['ATTACK', 'DEFEND', 'THROW BONG', 'WAIT'],
    // Carl does the opposite of whatever he's told. Learn it, use it.
    ai(a, sug) {
      const foes = liveFoes();
      if (a.pot >= 3) return { m: 'DELIVERY', why: 'Prop Pills! Now with twenty percent more pills!' };
      if (sug) {
        if (sug.m === 'ATTACK') { const other = foes.filter(f => f !== sug.t); return other.length ? { m: 'ATTACK', t: pick(other), why: 'Nah. That one. That one looked at me.' } : { m: 'DEFEND', why: 'I\'m not attacking him. You can\'t make me attack him.' }; }
        if (sug.m === 'DEFEND') return { m: 'THROW BONG', t: pick(foes), why: 'DEFEND? Bro. I\'m going ALL IN.' };
        if (sug.m === 'THROW BONG') return { m: 'DEFEND', why: 'I\'m not throwing a bong. I don\'t do that anymore. Everyone says I do that.' };
        if (sug.m === 'WAIT') return { m: 'ATTACK', t: pick(foes), why: 'Wait? I\'ve been waiting my whole life. No.' };
      }
      const r = Math.random(); if (r < .6) return { m: 'ATTACK', t: pick(foes) }; if (r < .8) return { m: 'WAIT', why: pick(['Chat, are you seeing this?', 'Hold on. Hold on. I\'m thinking.', 'I\'m not scared. I\'m pacing.']) }; return { m: 'DEFEND' };
    } },
  'JB GARFIELD': { name: 'JB GARFIELD', max: 40, atk: 10, def: 3, spd: 3,
    moves: ['ACCUSE', 'EAT', 'NAP'],
    // Garfield acts on evidence. Translate the suspect first, then point him at it.
    ai(a, sug) {
      const foes = liveFoes();
      if (a.pot >= 3) return { m: 'CASE CLOSED', t: strongest(foes), why: 'The case is closed. I closed it. You all saw me close it.' };
      if (sug && sug.m === 'ACCUSE') { if (sug.t && sug.t.known) return { m: 'ACCUSE', t: sug.t, crit: 1, why: 'I KNEW IT. I knew it the whole time.' }; return { m: 'NAP', why: 'Accuse him of what? Show me something. Evidence. Then I\'ll know it.' }; }
      if (sug && sug.m === 'EAT') return { m: 'EAT', why: 'You don\'t have to tell me twice. You had to tell me once.' };
      if (a.hp < a.max * .45) return { m: 'EAT', why: 'Evidence can wait. Beans can\'t.' };
      const known = foes.filter(f => f.known); if (known.length) return { m: 'ACCUSE', t: known[0], why: 'A hunch.' };
      return Math.random() < .55 ? { m: 'NAP', why: pick(['...', 'I\'m thinking. Don\'t look at me while I think.', 'Wake me up when there\'s evidence.']) } : { m: 'ACCUSE', t: pick(foes) };
    } },
  'SPOOKY GHOST': { name: 'SPOOKY GHOST', max: 30, atk: 6, def: 1, spd: 5, tone: 'red',
    moves: ['SHOW', 'SIGIL', 'BOO'],
    // Ghost needs an audience. Assist him: that's the spotlight.
    ai(a, sug) {
      const foes = liveFoes(), lit = a.lit;
      if (a.pot >= 3) return { m: 'THE FINALE', why: 'And now. The finale. Hold the applause. No— let it go. Let it all go.' };
      if (!lit && !sug) return Math.random() < .6 ? { m: 'MOPE', why: pick(['Nobody\'s watching.', 'Is this thing on?', 'I\'ll wait for a bigger crowd.']) } : { m: 'BOO', t: pick(foes) };
      if (sug && sug.m === 'SIGIL') return { m: 'SIGIL', t: sug.t || pick(foes), why: 'Formula. Not magic. Well. Both.' };
      if (sug && sug.m === 'SHOW') return { m: 'SHOW', why: lit ? 'You want a show? You GET a show.' : 'For who? ...Fine. For you.' };
      if (sug && sug.m === 'BOO') return { m: 'BOO', t: sug.t || pick(foes) };
      return lit ? { m: 'SHOW', why: 'Is that a spotlight? That\'s a spotlight.' } : { m: 'BOO', t: pick(foes) };
    } },
  'PEE KID': { name: 'PEE KID', max: 22, atk: 0, def: 1, spd: 8,
    moves: ['ASK', 'PERFORM', 'INSPECT'],
    // He never hits anybody. He does what he's asked, because he was asked.
    ai(a, sug) {
      const foes = liveFoes();
      if (a.pot >= 3) return { m: 'THE QUESTION', why: 'Can I ask everybody something?' };
      if (sug) return { m: sug.m, t: sug.t || pick(foes), why: pick(['Okay. You asked. That\'s the difference.', 'Sure! You asked nicely.', 'Okay.']) };
      const unknown = foes.filter(f => !f.known); if (unknown.length > 1) return { m: 'INSPECT', why: 'I\'m looking. I look at stuff.' };
      return Math.random() < .3 ? { m: 'WAIT', why: 'Can I go to the bathroom?' } : { m: 'ASK', t: pick(foes) };
    } },
  'CEO LINDA': { name: 'CEO LINDA', max: 38, atk: 11, def: 3, spd: 4, tone: 'pink',
    moves: ['LEVERAGE', 'BUY OUT', 'INVOICE'],
    // Linda sells things; she acts when it's worth her while. Franchises are something she can buy.
    ai(a, sug) {
      const foes = liveFoes();
      if (a.pot >= 3) return { m: 'HOSTILE TAKEOVER', why: 'I\'m acquiring all of you. Effective immediately.' };
      if (sug && sug.m === 'BUY OUT') { if (sug.t && sug.t.franchise) return { m: 'BUY OUT', t: sug.t, why: 'That\'s a franchise. I never authorized a franchise. Sold. To me.' }; return { m: 'INVOICE', why: 'I don\'t buy things I can\'t resell.' }; }
      if (sug && sug.m === 'LEVERAGE') return { m: 'LEVERAGE', t: sug.t || strongest(foes) };
      if (a.paid <= 0) return { m: 'INVOICE', why: 'Invoice. Net thirty. Assistance is billable.' };
      const fr = foes.find(f => f.franchise); if (fr) return { m: 'BUY OUT', t: fr, why: pick(['That\'s my face. I\'m buying it back.', 'Franchise. Unauthorized. Acquired.', 'Sold. To me. Obviously.']) };
      return { m: 'LEVERAGE', t: strongest(foes) };
    } },
};
const liveFoes = () => BT.foes.filter(f => f.hp > 0 && !f.left);
const liveAllies = () => BT.allies.filter(a => a.hp > 0);
const strongest = fs => fs.slice().sort((a, b) => b.hp - a.hp)[0];
function partyState(k) { if (!PARTY[k]) { const A = ALLY[k]; PARTY[k] = { hp: A.max, max: A.max, trust: 50, pot: 0, restored: 0 }; } return PARTY[k]; }

// ---------- foes ----------
// intent: { k, t (target ally), pow, text (plain), lang (what it says before translation) }
const FOE = {
  yokoid: { name: 'YOKOID', hp: 11, atk: 4, spr: 'yokoid', lang: 'MAY I HELP YOU?',
    think(f) { const t = pick(liveAllies()); return Math.random() < .3 ? { k: 'help', t, text: 'IT\'S GOING TO HELP ' + t.name + '. ' + t.name + ' WON\'T GET A TURN.' } : Math.random() < .5 ? { k: 'hit', t, pow: 4, text: 'IT\'S GOING TO ESCORT ' + t.name + ' OFF THE PREMISES. (4 DAMAGE)' } : { k: 'tidy', text: 'IT\'S GOING TO TIDY UP ITS COLLEAGUES. (HEALS THEM)' }; } },
  super: { name: 'SHIFT MANAGER', hp: 46, atk: 6, spr: 'super', big: 1, lang: 'THIS SHIFT IS EXCEEDING EXPECTATIONS.',
    think(f) { const t = pick(liveAllies()); const r = f.turn % 3; return r === 0 ? { k: 'helpall', text: 'IT\'S GOING TO HELP EVERYONE AT ONCE. NOBODY GETS A TURN UNLESS THEY\'RE DEFENDING.' } : r === 1 ? { k: 'hit', t, pow: 7, text: 'IT\'S GOING TO ESCORT ' + t.name + '. FIRMLY. (7 DAMAGE)' } : { k: 'call', text: 'IT\'S GOING TO CALL ANOTHER YOKOID ON SHIFT.' }; } },
  redface: { name: 'RED FACE', hp: 12, atk: 5, spr: 'redface', lang: 'GOOD EVENING. I\'M FACE.',
    think(f) { const t = pick(liveAllies()); return { k: 'hit', t, pow: 5, text: 'IT\'S GOING TO DO THE BIT AT ' + t.name + '. (5 DAMAGE)' }; } },
  wife: { name: 'EX-WIFE', hp: 16, atk: 5, spr: 'wife', lang: 'YOU PROMISED.',
    think(f) { const g = BT.allies.find(a => a.key === 'SPOOKY GHOST' && a.hp > 0), t = g || pick(liveAllies()); return Math.random() < .5 ? { k: 'hit', t, pow: 6, text: 'SHE\'S COMING FOR ' + t.name + '. ' + (g ? 'IT\'S ABOUT THE ALIMONY. ' : '') + '(6 DAMAGE)' } : { k: 'wail', pow: 3, text: 'SHE\'S GOING TO WAIL. EVERYONE TAKES 3.' }; } },
  hr: { name: 'BACKUP FACE', hp: 60, atk: 6, spr: 'hr', big: 1, lang: 'PER POLICY 4.2(B), YOUR REQUEST HAS BEEN RECEIVED.',
    think(f) { const t = pick(liveAllies()); const r = f.turn % 3; return r === 0 ? { k: 'help', t, text: 'IT\'S GOING TO GIVE ' + t.name + ' PAPERWORK. ' + t.name + ' WON\'T GET A TURN.' } : r === 1 ? { k: 'wail', pow: 5, text: 'PERFORMANCE REVIEW. EVERYONE TAKES 5.' } : { k: 'hit', t, pow: 9, text: 'IT\'S GOING TO DENY ' + t.name + '. (9 DAMAGE)' }; } },
  guard: { name: 'MANDOLIN GUARD', hp: 18, atk: 5, spr: 'guard', lang: '♪~ HALT, FRIEND, HALT ~♪',
    think(f) { const t = pick(liveAllies()); return Math.random() < .5 ? { k: 'hit', t, pow: 5, text: 'A VERSE ABOUT ' + t.name + '. IT\'S NOT FLATTERING. (5 DAMAGE)' } : { k: 'tidy', text: 'A BALLAD. IT HEALS THE OTHER GUARDS.' }; } },
  test: { name: 'THE TEST', hp: 72, atk: 8, spr: 'test', big: 1, onlyRiddle: 1, lang: 'ANSWER.',
    // it repeats a riddle until someone answers it, then moves on to the next one nobody has answered yet
    think(f) { const av = RIDDLES.filter(r => r.a === 'YOKO' || BT.allies.some(a => a.key === r.a && a.hp > 0)); f.solved = f.solved || {}; const R = av.find(r => !f.solved[r.q]) || av[f.turn % av.length]; return { k: 'riddle', r: R, pow: 8, text: 'THE RIDDLE: "' + R.q + '"  IT WANTS THAT PERSON TO ACT. (WRONG: EVERYONE TAKES 8)' }; } },
  lindalite: { name: 'LINDA LITE', hp: 16, atk: 5, spr: 'linda', franchise: 1, lang: 'COMPANIONSHIP AT TWENTY PERCENT.',
    think(f) { const t = pick(liveAllies()); return Math.random() < .5 ? { k: 'sell', t, text: 'SHE\'S GOING TO SELL ' + t.name + ' COMPANIONSHIP. ' + t.name + ' WILL LOSE TWO TURNS.' } : { k: 'hit', t, pow: 5, text: 'SHE\'S GOING TO UPSELL ' + t.name + '. (5 DAMAGE)' }; } },
  lindamax: { name: 'LINDA MAX', hp: 24, atk: 7, spr: 'lindamax', franchise: 1, lang: 'COMPANIONSHIP AT ONE HUNDRED PERCENT. NON-REFUNDABLE.',
    think(f) { const t = pick(liveAllies()); return { k: 'hit', t, pow: 8, text: 'SHE\'S GOING TO CLOSE ON ' + t.name + '. (8 DAMAGE)' }; } },
  prime: { name: 'LINDA PRIME', hp: 90, atk: 8, spr: 'prime', big: 1, franchise: 0, lang: 'EVERY LINDA IS ME. I AM EVERY LINDA.',
    think(f) { const t = pick(liveAllies()); const r = f.turn % 3; return r === 0 ? { k: 'call2', text: 'SHE\'S GOING TO OPEN A NEW FRANCHISE.' } : r === 1 ? { k: 'sellall', text: 'SHE\'S GOING TO SELL TO EVERYONE. ANYONE NOT DEFENDING LOSES A TURN.' } : { k: 'hit', t, pow: 12, text: 'SHE\'S GOING TO LEVERAGE ' + t.name + '. (12 DAMAGE)' }; } },
};
const RIDDLES = [
  { q: 'I DO THE OPPOSITE OF WHAT I\'M TOLD. WHO AM I?', a: 'CARL' },
  { q: 'I SOLVE CASES I DIDN\'T SOLVE. WHO AM I?', a: 'JB GARFIELD' },
  { q: 'I ONLY PERFORM IF YOU\'RE WATCHING. WHO AM I?', a: 'SPOOKY GHOST' },
  { q: 'I ASK. THAT\'S ALL I EVER DO. WHO AM I?', a: 'PEE KID' },
  { q: 'I HELP. THEN I DECIDE. WHO AM I?', a: 'YOKO' },
];
function mkFoe(k, o = {}) { const D = FOE[k]; return Object.assign({ key: k, name: D.name, hp: D.hp, max: D.hp, atk: D.atk, intent: null, known: false, turn: 0, st: {}, fl: 0 }, D, o); }

// ---------- running a battle ----------
// def: { foes: ['yokoid', ...], party: ['CARL', ...], bg: 'atrium', music, intro: async, tip, noLose, onRound }
async function battle(def) {
  YREC.battles++; const prev = scene, pm = curName;
  Object.assign(BT, { on: true, def, round: 0, fp: 3, fpMax: def.fpMax || 6, msg: '', t: 0, fx: [], hl: null, shake: 0 });
  BT.allies = def.party.filter(k => ALLY[k]).map(k => { const P = partyState(k); return { key: k, name: ALLY[k].name, hp: Math.max(1, P.hp), max: P.max, atk: ALLY[k].atk + (def.atkUp || 0), def: ALLY[k].def, spd: ALLY[k].spd, trust: P.trust, pot: 0, st: {}, paid: 1, lit: 0, fl: 0 }; });
  BT.foes = def.foes.map(k => mkFoe(k));
  scene = battleScene; music(def.music || 'battle');
  await fadeIn(.1);
  if (def.intro) await def.intro();
  let result = null;
  for (;;) {
    BT.round++; BT.fp = Math.min(BT.fpMax, BT.fp + 1);
    for (const f of liveFoes()) { f.intent = FOE[f.key].think(f); f.turn++; }
    for (const a of BT.allies) { a.sug = null; a.forced = null; a.lit = 0; }
    if (def.onRound) await def.onRound(BT.round);
    DBG.mode = 'battle';
    await yokoTurn();
    DBG.mode = null;
    const order = BT.allies.slice().sort((a, b) => b.spd - a.spd);
    for (const a of order) { if (a.hp <= 0 || !liveFoes().length) continue; await allyAct(a); }
    if (!liveFoes().length) { result = 'win'; break; }
    for (const f of liveFoes()) { if (!liveAllies().length) break; await foeAct(f); }
    for (const a of BT.allies) { a.st.defending = 0; }
    if (!liveAllies().length) { result = 'lose'; break; }
  }
  // keep what happened
  for (const a of BT.allies) { const P = partyState(a.key); P.hp = a.hp > 0 ? a.hp : Math.ceil(a.max / 2); P.trust = a.trust; YREC.trust[a.key] = a.trust; }
  if (result === 'win') { YREC.wins++; sfx('get'); BT.msg = 'THE TEAM WON. THEY\'LL SAY THEY DID IT THEMSELVES. THEY\'RE MOSTLY RIGHT.'; await wait(90); }
  else { YREC.fell++; sfx('powerdown'); await say('THE TEAM IS DOWN. YOKO IS STILL STANDING. SHE ALWAYS IS.'); }
  BT.on = false; await fadeOut(.1); scene = prev; music(pm); await fadeIn(.1);
  if (result === 'lose' && !def.noLose) { for (const k of def.party) if (PARTY[k]) PARTY[k].hp = PARTY[k].max; const c = await ask('TRY AGAIN?', 'YOKO', ['TRY AGAIN', 'TRY AGAIN, BUT WITH A LOOK']); if (c === 1) await say('(YOKO GIVES THEM A LOOK. THEY START EXPLAINING THEMSELVES BEFORE SHE SAYS ANYTHING.)'); return battle(def); }
  for (const k of def.party) if (PARTY[k]) PARTY[k].hp = PARTY[k].max; // they rest between fights
  return result;
}
async function yokoTurn() {
  for (;;) {
    const opts = [['ASSIST', 1], ['TRANSLATE', 1], ['SUGGEST', 0], ['RESTORE', 3], ['OVERRULE', 2], ['WAIT', 0]].filter(([k]) => YOKO_CAN[k]);
    BT.msg = 'FOCUS ' + BT.fp + '/' + BT.fpMax + '.  WHAT DOES YOKO DO?';
    const labels = opts.map(([k, c]) => k + (c ? ' (' + c + ')' : '')), i = await choose(labels, { x: 238, y: 224 - labels.length * 12 - 14 });
    const [cmd, cost] = opts[i];
    if (cost > BT.fp) { sfx('tick'); BT.msg = 'NOT ENOUGH FOCUS.'; await wait(40); continue; }
    if (cmd === 'WAIT') { BT.fp = Math.min(BT.fpMax, BT.fp + 2); await note1('YOKO WAITS. SHE\'S PAYING ATTENTION. (+2 FOCUS)'); return; }
    if (cmd === 'ASSIST') { const a = await pickAlly('ASSIST WHO?', a => a.hp > 0); if (!a) continue; BT.fp -= cost; a.pot = Math.min(3, a.pot + 1); a.trust = Math.min(100, a.trust + 3); a.lit = 1; YREC.assist++; sfx('ok'); await note1(pick(['YOKO HELPS ', 'YOKO STEADIES ', 'YOKO QUIETLY SETS UP ']) + a.name + '. POTENTIAL ' + a.pot + '/3.' + (a.pot >= 3 ? ' (REALIZED NEXT TURN!)' : '')); return; }
    if (cmd === 'TRANSLATE') { if (!liveFoes().some(f => !f.known)) { sfx('tick'); BT.msg = 'SHE ALREADY UNDERSTANDS EVERYONE HERE. WHAT THEY\'LL DO IS SHOWN ABOVE.'; await wait(70); continue; }
      const f = await pickFoe('TRANSLATE WHO?', f => !f.known); if (!f) continue; BT.fp -= cost; f.known = true; YREC.translate++; sfx('switch'); await say('"' + f.lang + '"', f.name); await say('It means: ' + f.intent.text.toLowerCase(), 'YOKO'); return; }
    if (cmd === 'SUGGEST') { const a = await pickAlly('SUGGEST TO WHO?', a => a.hp > 0); if (!a) continue; const mv = await choose(ALLY[a.key].moves.concat(BT.def.extraMoves ? BT.def.extraMoves(a) : []), { x: 150, y: 60, cancel: 1 }); if (mv < 0) continue; const m = ALLY[a.key].moves.concat(BT.def.extraMoves ? BT.def.extraMoves(a) : [])[mv]; if (m === 'ANSWER') { YREC.suggest++; await answerRiddle(a.key, a.name); return; } let t = null; if (needsTarget(m)) { t = await pickFoe(m + ' WHO?', () => true); if (!t) continue; } a.sug = { m, t }; YREC.suggest++; await note1('YOKO SUGGESTS: ' + a.name + ', ' + m + (t ? ' ' + t.name : '') + '.'); return; }
    if (cmd === 'RESTORE') { const a = await pickAlly('RESTORE WHO?', a => a.hp <= 0); if (!a) { BT.msg = 'NOBODY IS DOWN.'; await wait(30); continue; } BT.fp -= cost; a.hp = Math.ceil(a.max / 2); a.st = {}; YREC.restore++; partyState(a.key).restored++; sfx('get'); await note1('YOKO RESTORES ' + a.name + ' FROM BACKUP. HE COMES BACK A LITTLE DIFFERENT. THEY ALWAYS DO.'); return; }
    if (cmd === 'OVERRULE') { const a = await pickAlly('OVERRULE WHO?', a => a.hp > 0); if (!a) continue; const ms = ALLY[a.key].moves.concat(BT.def.extraMoves ? BT.def.extraMoves(a) : []), mv = await choose(ms, { x: 150, y: 60, cancel: 1 }); if (mv < 0) continue; let t = null; if (needsTarget(ms[mv])) { t = await pickFoe(ms[mv] + ' WHO?', () => true); if (!t) continue; } BT.fp -= cost; a.forced = { m: ms[mv] === 'ANSWER' ? 'WAIT' : ms[mv], t }; a.trust = Math.max(0, a.trust - 12); YREC.overrule++; sfx('stun'); post.flash = .25; await say(pick(['Do it.', 'Now.', 'This one. Not a suggestion.']), 'YOKO', { port: CAST.mood['EVIL YOKO'].cold }); const rf = liveFoes().find(x => x.intent && x.intent.k === 'riddle'); if (rf && rf.intent.r.a === 'YOKO') await answerRiddle('YOKO', 'YOKO'); return; }
  }
}
const needsTarget = m => ['ATTACK', 'THROW BONG', 'ACCUSE', 'SIGIL', 'BOO', 'ASK', 'LEVERAGE', 'BUY OUT'].includes(m);
// THE TEST: Yoko answers a riddle by pointing at who it's about. The one about her is answered by deciding.
async function answerRiddle(k, name) {
  const f = liveFoes().find(x => x.intent && x.intent.k === 'riddle'); if (!f) return note1('THERE\'S NO QUESTION RIGHT NOW.');
  await say(k === 'YOKO' ? 'Me. I help. Then I decide.' : 'It\'s ' + name + '.', 'YOKO');
  if (f.intent.r.a === k) { (f.solved = f.solved || {})[f.intent.r.q] = 1; dmg(null, f, 18, 1); f.intent = { k: 'watch', text: 'CORRECT. IT\'S RECALCULATING.' }; sfx('object'); YREC.riddles = (YREC.riddles || 0) + 1; await note1('CORRECT. THE TEST CRACKS.'); }
  else { sfx('tick'); await note1('WRONG. THE TEST HUMS. (TRANSLATE IT TO HEAR THE RIDDLE.)'); }
}
async function pickAlly(q, ok) { BT.msg = q; const L = BT.allies.filter(ok); if (!L.length) return null; const i = await choose(L.map(a => a.name), { x: 150, y: 60, cancel: 1 }); return i < 0 ? null : L[i]; }
async function pickFoe(q, ok) { BT.msg = q; const L = liveFoes().filter(ok); if (!L.length) return null; const i = await choose(L.map(f => f.name + (f.known ? '' : ' (?)')), { x: 150, y: 60, cancel: 1 }); return i < 0 ? null : L[i]; }
async function note1(s, t = 40) { BT.msg = s; await nextFrame(); for (let i = 0; i < t; i++) { await nextFrame(); if (i > 6 && (pressed.a || pressed.b)) break; } }
function dmg(src, tgt, base, mult = 1) {
  if (tgt.onlyRiddle && src) { tgt.fl = 6; sfx('tick'); BT.fx.push({ k: 'num', x: tgt.bx || 0, y: tgt.by || 0, s: 'UNMOVED', t: 40 }); return 0; } // a test only yields to answers
  const d =Math.max(1, Math.round((base + rnd(3)) * mult - (tgt.def || 0) - (tgt.st && tgt.st.defending ? base * .5 : 0)));
  tgt.hp = Math.max(0, tgt.hp - d); tgt.fl = 12; BT.shake = 6; sfx('hurt');
  BT.fx.push({ k: 'num', x: tgt.bx || 0, y: tgt.by || 0, s: String(d), t: 40, ally: !!tgt.key && !!ALLY[tgt.key] });
  return d;
}
async function allyAct(a) {
  if (a.st.stunned > 0) { a.st.stunned--; return note1(a.name + ' IS BEING ASSISTED. HE CAN\'T MOVE.', 40); }
  if (a.st.dependent > 0) { a.st.dependent--; return note1(a.name + ' IS ENJOYING HIS COMPANIONSHIP. (' + (a.st.dependent + 1) + ' MORE TURN' + (a.st.dependent ? 'S' : '') + ')', 40); }
  const A = ALLY[a.key];
  let act = a.forced || A.ai(a, a.sug);
  if (a.sug && !a.forced) { const same = act.m === a.sug.m && (!a.sug.t || act.t === a.sug.t); if (same) { YREC.followed++; a.trust = Math.min(100, a.trust + 2); } else YREC.ignored++; }
  BT.hl = a;
  if (act.why && !a.forced) await say(act.why, a.name, { auto: 60 });
  const mult = 1 + a.pot * .25, foes = liveFoes();
  const t = act.t && act.t.hp > 0 && !act.t.left ? act.t : pick(foes);
  switch (act.m) {
    case 'ATTACK': dmg(a, t, a.atk, mult); await note1(a.name + ' ATTACKS ' + t.name + '.'); break;
    case 'THROW BONG': dmg(a, t, a.atk * 1.8, mult); sfx('glitch'); await note1(a.name + ' THROWS A BONG AT ' + t.name + '. HE\'LL SAY HE DIDN\'T.'); break;
    case 'DEFEND': a.st.defending = 1; await note1(a.name + ' DEFENDS.'); break;
    case 'WAIT': case 'MOPE': case 'NAP': await note1(a.name + (act.m === 'NAP' ? ' NAPS.' : act.m === 'MOPE' ? ' MOPES.' : ' WAITS.'), 35); break;
    case 'DELIVERY': for (const f of foes) dmg(a, f, a.atk * 1.4, 1); a.pot = 0; sfx('object'); await note1('DELIVERY! CARL HITS EVERYONE WITH A BOX OF PROP PILLS.'); break;
    case 'ACCUSE': dmg(a, t, a.atk * (act.crit || t.known ? 1.6 : 1), mult); await note1(a.name + ' ACCUSES ' + t.name + (t.known ? '. WITH EVIDENCE.' : '. WITHOUT EVIDENCE.')); break;
    case 'EAT': a.hp = Math.min(a.max, a.hp + 14); sfx('ok'); await note1(a.name + ' EATS A CAN OF BEANS. +14.'); break;
    case 'CASE CLOSED': { const tt = t; if (tt.big) dmg(a, tt, a.atk * 3, 1); else { tt.hp = 0; tt.fl = 12; } a.pot = 0; sfx('object'); await note1('CASE CLOSED. ' + tt.name + (tt.hp <= 0 ? ' IS DONE.' : ' IS SHAKEN.')); break; }
    case 'SHOW': for (const f of foes) if (Math.random() < .5 + (a.lit ? .3 : 0)) { f.intent = { k: 'watch', text: 'IT\'S WATCHING THE SHOW.' }; f.known = true; } sfx('crowd'); await note1('SPOOKY GHOST DOES A NUMBER. SOME OF THEM STOP TO WATCH.'); break;
    case 'SIGIL': t.intent = { k: 'watch', text: 'SEALED BY A SIGIL. IT CAN\'T ACT.' }; t.known = true; sfx('stun'); await note1('A SIGIL. ' + t.name + ' IS SEALED THIS TURN.'); break;
    case 'BOO': dmg(a, t, a.atk * (a.lit ? 1.4 : .8), mult); await note1('SPOOKY GHOST SAYS BOO TO ' + t.name + '.'); break;
    case 'THE FINALE': for (const f of foes) dmg(a, f, 12, 1); for (const b of liveAllies()) b.hp = Math.min(b.max, b.hp + 8); a.pot = 0; sfx('crowd'); await note1('THE FINALE. EVERYONE IS HIT. EVERYONE ON THE TEAM FEELS BETTER.'); break;
    case 'ASK': if (t.big) { t.intent = { k: 'watch', text: 'IT\'S THINKING ABOUT THE QUESTION.' }; } else { t.st.stunned = 1; t.intent = { k: 'watch', text: 'IT\'S THINKING ABOUT THE QUESTION.' }; } t.known = true; sfx('ask'); await note1('PEE KID ASKS ' + t.name + ' ' + pick(['WHY IT DOES THAT.', 'IF IT\'S HAPPY.', 'WHO IT WORKS FOR.', 'IF IT CAN GO HOME TOO.']) + ' IT STOPS TO THINK.'); break;
    case 'PERFORM': for (const f of foes) if (Math.random() < .6) { f.intent = { k: 'watch', text: 'IT\'S WATCHING PEE-WEE KID.' }; f.known = true; } sfx('crowd'); await note1('PEE-WEE KID PERFORMS! THEY CAN\'T LOOK AWAY.'); break;
    case 'INSPECT': for (const f of foes) f.known = true; sfx('stun'); await note1('PEE BOY INSPECTS EVERYONE. EVERY INTENT IS VISIBLE.'); break;
    case 'THE QUESTION': for (const f of foes) { f.st.stunned = 2; f.intent = { k: 'watch', text: 'IT\'S STILL THINKING.' }; f.known = true; } a.pot = 0; sfx('ask'); await say('Does anybody here actually want to be doing this?', 'PEE KID'); await note1('NOBODY MOVES FOR A WHILE.'); break;
    case 'LEVERAGE': dmg(a, t, a.atk, mult); a.paid = 0; await note1('LINDA LEVERAGES ' + t.name + '.'); break;
    case 'INVOICE': a.paid = 1; await note1('LINDA SENDS AN INVOICE. SHE\'LL WORK NEXT TURN.'); break;
    case 'BUY OUT': a.paid = 0; if (t.franchise) { t.left = 1; sfx('get'); await note1('LINDA BUYS OUT ' + t.name + '. IT\'S HERS NOW. IT LEAVES.'); } else await note1(t.name + ' IS NOT FOR SALE. LINDA IS OFFENDED.'); break;
    case 'HOSTILE TAKEOVER': for (const f of foes) if (f.franchise) f.left = 1; else dmg(a, f, a.atk * 2, 1); a.pot = 0; sfx('object'); await note1('HOSTILE TAKEOVER. EVERY FRANCHISE ON THE FIELD NOW BELONGS TO LINDA.'); break;
    default: if (BT.def.move) await BT.def.move(a, act, t);
  }
  if (a.pot > 0 && ['DELIVERY', 'CASE CLOSED', 'THE FINALE', 'THE QUESTION', 'HOSTILE TAKEOVER'].indexOf(act.m) < 0 && !['WAIT', 'MOPE', 'NAP', 'DEFEND', 'INVOICE'].includes(act.m)) a.pot = Math.max(0, a.pot - 1);
  for (const f of BT.foes) if (f.hp <= 0 && !f.dead) { f.dead = 1; sfx('powerdown'); }
  BT.hl = null;
}
async function foeAct(f) {
  const I = f.intent; if (!I) return;
  if (f.st.stunned > 0) { f.st.stunned--; return note1(f.name + ' IS STILL THINKING ABOUT THE QUESTION.', 35); }
  BT.hl = f;
  const T = I.t && I.t.hp > 0 ? I.t : pick(liveAllies());
  switch (I.k) {
    case 'watch': await note1(f.name + ' DOESN\'T ACT.', 30); break;
    case 'hit': dmg(f, T, I.pow); await note1(f.name + ' HITS ' + T.name + '.'); break;
    case 'wail': for (const a of liveAllies()) dmg(f, a, I.pow); await note1(f.name + ' HITS EVERYONE.'); break;
    case 'help': if (T.st.defending) await note1(T.name + ' DEFENDS AGAINST THE HELP.'); else { T.st.stunned = 1; sfx('stun'); await note1(f.name + ' HELPS ' + T.name + '. AGGRESSIVELY. HE LOSES HIS NEXT TURN.'); } break;
    case 'helpall': for (const a of liveAllies()) if (!a.st.defending) a.st.stunned = 1; sfx('stun'); await note1(f.name + ' HELPS EVERYONE AT ONCE.'); break;
    case 'tidy': for (const o of liveFoes()) o.hp = Math.min(o.max, o.hp + 4); await note1(f.name + ' TIDIES UP. THE OTHERS FEEL BETTER.'); break;
    case 'call': if (BT.foes.length < 5) { BT.foes.push(mkFoe('yokoid')); await note1('ANOTHER YOKOID CLOCKS IN.'); } break;
    case 'call2': if (liveFoes().length < 4) { BT.foes.push(mkFoe(pick(['lindalite', 'lindamax']))); await note1('A NEW FRANCHISE OPENS.'); } else await note1(f.name + ' TRIES TO OPEN A FRANCHISE. THE MARKET IS SATURATED.'); break;
    case 'sell': if (T.st.defending) await note1(T.name + ' ISN\'T BUYING.'); else { T.st.dependent = 2; sfx('ok'); await note1(f.name + ' SELLS ' + T.name + ' COMPANIONSHIP. HE\'S VERY HAPPY. HE WON\'T MOVE FOR A WHILE.'); } break;
    case 'sellall': for (const a of liveAllies()) if (!a.st.defending) a.st.dependent = 1; await note1(f.name + ' SELLS TO EVERYONE.'); break;
    case 'riddle': for (const a of liveAllies()) dmg(f, a, I.pow); await note1('NOBODY ANSWERED. THE TEST PUNISHES EVERYONE.'); break;
    default: if (BT.def.foeMove) await BT.def.foeMove(f, I, T);
  }
  for (const a of BT.allies) if (a.hp <= 0 && !a.downNoted) { a.downNoted = 1; await note1(a.name + ' IS DOWN.', 40); }
  for (const a of BT.allies) if (a.hp > 0) a.downNoted = 0;
  BT.hl = null;
}
// which commands Yoko has so far (they arrive with the chapters)
const YOKO_CAN = { ASSIST: 1, TRANSLATE: 1, SUGGEST: 1, WAIT: 1, RESTORE: 0, OVERRULE: 0 };

// ---------- drawing ----------
const FOE_ART = {
  yokoid: (f, x, y) => drawScaled(YS.yokoid[(BT.t >> 5) & 1], x - 24, y - 84, YP.yokoid, 1.5),
  super: (f, x, y) => drawScaled(YS.super[(BT.t >> 5) & 1], x - 32, y - 112, YP.super, 2),
  redface: (f, x, y) => drawScaled(FS.redface[(BT.t >> 4) & 1], x - 27, y - 50, FP.red, 3),
  wife: (f, x, y) => drawScaled(FS.wife[(BT.t >> 4) & 1], x - 24, y - 56 + Math.sin(BT.t * .05) * 3, FP.red, 3),
  hr: (f, x, y) => { const p = PORT['BACKUP FACE']; drawScaled(p.s, x - 48, y - 100, p.P, 2); },
  guard: (f, x, y) => drawScaled(YS.guard[(BT.t >> 4) & 1], x - 24, y - 84, YP.guard, 1.5),
  test: (f, x, y) => drawScaled(YS.test[(BT.t >> 5) & 1], x - 36, y - 118, YP.test, 1.5),
  linda: (f, x, y) => drawScaled(YS.linda[(BT.t >> 5) & 1], x - 24, y - 84, YP.linda, 1.5),
  lindamax: (f, x, y) => drawScaled(YS.lindamax[(BT.t >> 5) & 1], x - 24, y - 84, YP.lindamax, 1.5),
  prime: (f, x, y) => drawScaled(YS.prime[(BT.t >> 5) & 1], x - 32, y - 112, YP.prime, 2),
};
const battleScene = {
  update() { BT.t++; if (BT.shake > 0) BT.shake--; if (post.flash > 0 && !DLG) post.flash = Math.max(0, post.flash - .04); for (const a of BT.allies) if (a.fl > 0) a.fl--; for (const f of BT.foes) if (f.fl > 0) f.fl--; for (const x of BT.fx) x.t--; BT.fx = BT.fx.filter(x => x.t > 0); },
  draw() {
    const sx = BT.shake ? rnd(5) - 2 : 0;
    (SB[BT.def.bg] || SB.atrium)(BT.t, BT.def);
    rectA(0, 0, W, 150, BLACK, .25); rectA(0, 0, W, 30, BLACK, .45); rectF(0, 150, W, 40, hex('#0c1234'));
    const shown = BT.foes.filter(f => !f.left && f.hp > 0);
    shown.forEach((f, i) => {
      const x = Math.round((i + 1) * W / (shown.length + 1)) + sx, y = 118; f.bx = x - 6; f.by = y - 60;
      if (!(f.fl && (f.fl & 2))) (FOE_ART[f.spr] || FOE_ART.yokoid)(f, x, y);
      if (BT.hl === f) ringF(x, y - 40, 30 + (BT.t & 3), UI.name);
      rectF(x - 20, y + 4, 40, 3, BLACK); rectF(x - 20, y + 4, Math.round(40 * f.hp / f.max), 3, hex('#ff4949'));
      text(f.name.slice(0, 13), x - Math.min(13, f.name.length) * 3, y + 9, WHITE, BLACK);
      const it = f.known ? intentTag(f) : '???'; const w = it.length * 6 + 6; rectF(x - w / 2, 4 + (i & 1) * 12, w, 10, f.known ? hex('#24246d') : hex('#242424')); frameRect(x - w / 2, 4 + (i & 1) * 12, w, 10, f.known ? hex('#92ffff') : hex('#6d6d6d')); text(it, x - w / 2 + 3, 5 + (i & 1) * 12, f.known ? hex('#92ffff') : UI.dim, 0);
    });
    // a translated riddle stays on screen, with how to answer it
    const rf = shown.find(f => f.known && f.intent && f.intent.k === 'riddle');
    if (rf) { rectA(8, 30, W - 16, 24, BLACK, .75); frameRect(8, 30, W - 16, 24, hex('#92ffff')); ctext('"' + rf.intent.r.q + '"', 33, hex('#92ffff'), 0);
      ctext(rf.intent.r.a === 'YOKO' ? 'NOBODY SUGGESTS TO HER. SHE DECIDES: OVERRULE.' : 'SUGGEST > WHO IT\'S ABOUT > ANSWER', 43, UI.dim, 0); }
    // ally cards
    const n = BT.allies.length, cw = 78, x0 = (W - n * cw) / 2 | 0;
    BT.allies.forEach((a, i) => {
      const x = x0 + i * cw, y = 150; a.bx = x + 20; a.by = y - 10;
      panel(x, y, cw - 2, 38); const p = PORT[a.name]; if (p) { const sc = .5; for (let j = 0; j < 24; j++) for (let k = 0; k < 24; k++) { const c = p.s.d[(j * 2) * 48 + k * 2]; if (c) pset(x + 4 + k, y + 7 + j, a.hp <= 0 ? hex('#494949') : a.fl && (a.fl & 2) ? WHITE : p.P[c]); } }
      if (BT.hl === a) frameRect(x, y, cw - 2, 38, UI.name);
      text(a.name.split(' ').pop().slice(0, 7), x + 30, y + 4, a.hp > 0 ? WHITE : UI.dim, 0);
      rectF(x + 30, y + 14, 40, 4, BLACK); rectF(x + 30, y + 14, Math.round(40 * a.hp / a.max), 4, a.hp > a.max * .3 ? hex('#6dff24') : hex('#ff4949'));
      text(String(a.hp), x + 30, y + 20, UI.dim, 0);
      for (let k = 0; k < 3; k++) rectF(x + 56 + k * 5, y + 21, 4, 4, k < a.pot ? hex('#ffdb24') : hex('#494949'));
      const tr = a.trust; rectF(x + 30, y + 29, 40, 2, hex('#242424')); rectF(x + 30, y + 29, Math.round(tr * .4), 2, tr > 60 ? hex('#ff6db6') : tr > 30 ? hex('#b692db') : hex('#6d6d6d'));
      const st = a.hp <= 0 ? 'DOWN' : a.st.stunned ? 'HELPED' : a.st.dependent ? 'BOUGHT' : a.st.defending ? 'GUARD' : a.sug ? 'SUGG.' : a.forced ? 'ORDER' : ''; if (st) text(st, x + 4, y + 30, st === 'ORDER' ? hex('#24dbff') : UI.name, BLACK);
    });
    // yoko's strip
    const yp = PORT.YOKO; rectF(0, 190, W, 34, hex('#101a48')); rectF(0, 190, W, 1, UI.edge);
    for (let j = 0; j < 30; j++) for (let k = 0; k < 30; k++) { const c = yp.s.d[(8 + j) * 48 + 9 + k]; if (c) pset(4 + k, 192 + j, yp.P[c]); }
    for (let k = 0; k < BT.fpMax; k++) rectF(38 + k * 7, 194, 5, 5, k < BT.fp ? hex('#92ffff') : hex('#24246d'));
    wrapT(BT.msg, 46).slice(0, 2).forEach((l, i) => text(l, 38, 202 + i * 10, WHITE, BLACK));
    for (const x of BT.fx) if (x.k === 'num') text(x.s, x.x, x.y - (40 - x.t) * .4, x.ally ? hex('#ff4949') : WHITE, BLACK);
  },
};
function intentTag(f) { const I = f.intent; if (!I) return '...'; const T = I.t ? ' ' + I.t.name.split(' ').pop() : ''; return ({ hit: 'HIT' + T, wail: 'HIT ALL', help: 'HELP' + T, helpall: 'HELP ALL', tidy: 'HEAL', call: 'CALL', call2: 'FRANCHISE', sell: 'SELL' + T, sellall: 'SELL ALL', riddle: 'RIDDLE', watch: 'WATCHING' }[I.k] || I.k.toUpperCase()); }
