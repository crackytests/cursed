'use strict';
// ================= THE END: rewinding a battle. The fight already happened; you undo it, last thing first =================
// The log says what happened, but not who did it. Work out who, and how, and the moment comes undone.
const WEAPON_CLUE = { rod: 'A WAND', bong: 'A BONG', lance: 'AN ANTENNA', torch: 'A WELDING TORCH', mic: 'A MICROPHONE', cane: 'A CANE', dart: 'A DART', toy: 'A YO-YO', any: 'SOMETHING GENERIC', none: 'A FIST' };
// what each hero could have done, and how the log describes it
function heroMoves(id) {
  const h = HEROES[id], L = [{ cmd: 'FIGHT', clue: f => 'SOMEONE HIT THE ' + f + ' WITH ' + WEAPON_CLUE[h.weap] + '.' }];
  const U = {
    carl: { cmd: 'FIND', clue: f => 'SOMEONE WENT THROUGH THE ' + f + '\'S POCKETS. AND HIT IT A BIT.' },
    face: { cmd: 'INVENT', clue: f => 'AN INVENTION WENT OFF IN THE ' + f + '\'S FACE.' },
    oldface: { cmd: 'WELD', clue: f => 'THE ' + f + ' WAS WELDED. FIRMLY.' },
    linda: { cmd: 'MAGIC', clue: f => 'THE ' + f + ' WAS FROZEN SOLID BY A SPELL.' },
    yoko: { cmd: 'MAGIC', clue: f => 'THE ' + f + ' CAUGHT FIRE. NOBODY TOUCHED IT.' },
    ghost: { cmd: 'SEGMENT', clue: f => 'A SEGMENT AIRED AT THE ' + f + '. IT DID NOT TEST WELL.' },
    garfield: { cmd: 'ACCUSE', clue: f => 'THE ' + f + ' WAS ACCUSED OF SOMETHING. THE CASE HELD UP.' },
    kid: { cmd: 'ASK', clue: f => 'SOMEONE SMALL ASKED THE ' + f + ' WHY. IT HAD NO ANSWER.' },
    pilotx: { cmd: 'INCOGNITO', clue: f => 'SOMETHING HIT THE ' + f + ' OUT OF NOWHERE.' },
    mayi: { cmd: 'HELP', clue: f => 'SOMEONE ASKED THE ' + f + ' "MAY I HELP YOU?" IT FROZE.' },
    human: { cmd: 'MIMIC', clue: f => 'SOMEONE COPIED WHAT SOMEONE ELSE DID TO THE ' + f + '. EXACTLY.' },
  }[id];
  if (U) L.push(U);
  if (id === 'kid') L.shift(); // the kid never hit anyone, not even backwards
  return L;
}
// make up the battle that already happened: the foes went down, the party took some hits
function makeLog(foes, party, o = {}) {
  const log = [], left = foes.map(f => f.mhp);
  const n = o.boss ? 8 : 2 + rnd(3);
  // spread each foe's whole HP over the hero entries, then sprinkle in the foes' own attacks
  const entries = [];
  for (let k = 0; k < Math.max(n, foes.length); k++) {
    const fi = k < foes.length ? k : rnd(foes.length), h = pickOne(party), mv = pickOne(heroMoves(h.id));
    entries.push({ hero: h.id, cmd: mv.cmd, foe: fi, clue: mv.clue(foes[fi].name) });
  }
  foes.forEach((f, i) => { const mine = entries.filter(e => e.foe === i); let rest = f.mhp; mine.forEach((e, j) => { const amt = j === mine.length - 1 ? rest : Math.max(1, Math.floor(rest * (.3 + Math.random() * .4))); e.amt = amt; rest -= amt; }); });
  for (const e of entries) {
    log.push(e);
    if (rnd(3) === 0 || o.boss) { const f = foes[e.foe], t = pickOne(party); log.push({ foeHit: e.foe, hero: t.id, amt: Math.floor(t.mhp * (.08 + Math.random() * .14)), clue: 'THE ' + f.name + ' HIT ' + t.name + '.' }); }
  }
  // a foe can't hit anyone after it's down: keep each foe's attacks before its final blow
  const lastBlow = foes.map((f, i) => Math.max(...log.map((e, k) => (e.foe === i && !e.foeHit) ? k : -1)));
  return log.filter((e, k) => !e.foeHit || k < lastBlow[e.foeHit]);
}
// the rewind itself. spec: { foes: [ids] or form id, bg, boss, music, title }
async function rewind(spec) {
  if (typeof spec === 'string') spec = { form: spec };
  const form = spec.form ? FORMS[spec.form] : { foes: layout(spec.foes) };
  const prevScene = scene, prevMusic = curName;
  B = { form: Object.assign({ noRun: 1 }, form), foes: form.foes.map(([id, x, y]) => mkFoeUnit(id, x, y)), party: partyHeroes().map(mkHeroUnit), actQ: [], readyQ: [], pops: [], fx: [], msg: null,
    menu: null, cursor: null, bg: spec.bg || form.bg || 'grass', acting: 0, intro: 1, runHold: 0, t: 0, results: null, banner: null, rewind: 1, paradox: 0 };
  for (const f of B.foes) { G.seen[f.id] = 1; f.hp = 0; f.alpha = .06; }
  B.log = makeLog(B.foes, B.party, { boss: spec.boss || form.boss });
  // the party ends the battle as the log left it: take its damage back off them first
  for (const e of B.log) if (e.foeHit !== undefined) { const u = B.party.find(p => p.id === e.hero); if (u) u.hp = Math.max(0, u.hp - e.amt); }
  B.pos = B.log.length - 1;
  scene = { update() { battleUpdate(); for (const f of B.foes) if (f.hp > 0) f.alpha = Math.min(1, .06 + .94 * f.hp / f.mhp); }, draw() { battleDraw(); drawLog(); } };
  music(spec.music || (spec.boss || form.boss ? 'boss' : 'battle'));
  post.fade = 1; sfx('glitch'); await fadeIn(.12);
  bmsg(spec.title || 'THE BATTLE IS OVER. UNDO IT.', 120); await wait(30);
  while (B.pos >= 0) {
    const e = B.log[B.pos];
    if (e.foeHit !== undefined) { await undoFoeHit(e); B.pos--; continue; }
    const choice = await askWho(e);
    if (choice && choice.hero === e.hero && choice.cmd === e.cmd && choice.foe === e.foe) { await undoHeroHit(e); B.pos--; }
    else await paradox();
  }
  await wait(20);
  bmsg('THE BATTLE NEVER HAPPENED.', 120); sfx('ok');
  for (const f of B.foes) { f.hp = f.mhp; f.alpha = 1; }
  await wait(60);
  for (let i = 0; i < 30; i++) { for (const f of B.foes) f.dx = (f.dx || 0) - 4; await nextFrame(); }
  for (const u of B.party) { u.r.hp = Math.max(1, u.hp); u.r.mp = u.mp; }
  const back = B.foes.reduce((a, f) => a + (f.d.xp || 0), 0), gpBack = B.foes.reduce((a, f) => a + (f.d.gp || 0), 0);
  B.results = { lines: ['UN-VICTORY.', '', 'GAVE BACK ' + back + ' EXP', 'GAVE BACK ' + gpBack + ' GP', B.paradox ? 'PARADOXES: ' + B.paradox : 'NO PARADOXES.'] };
  G.gp = Math.max(0, G.gp - gpBack); music('victory'); await wait(20); await waitBtn();
  B.results = null; await fadeOut(.08);
  scene = prevScene; B.done = 1; B = null; music(prevMusic);
  return 'win';
}
// pick who did it and how; the log names the foe, so the target comes for free
async function askWho(e) {
  B.menu = null; await nextFrame();
  const L = B.party.filter(u => u.hp > 0 || true);
  const i = await bList(L.map(u => ({ t: u.name })), { x: 4, y: BWIN + 2, w: 100, rows: Math.min(5, L.length), title: 'WHO DID IT?', help: () => e.clue });
  if (i < 0) return null;
  const u = L[i], moves = heroMoves(u.id);
  const j = await bList(moves.map(m => ({ t: 'UN-' + m.cmd })), { x: 4, y: BWIN + 2, w: 120, rows: moves.length, title: u.name, help: () => e.clue });
  if (j < 0) return null;
  return { hero: u.id, cmd: moves[j].cmd, foe: e.foe };
}
async function undoHeroHit(e) {
  const u = B.party.find(p => p.id === e.hero), f = B.foes[e.foe];
  bmsg(e.clue + ' ...UNDONE.', 80);
  if (u) { u.pose = 'atk'; u.poseT = 20; } sfx('switch');
  // the effect runs backwards: the hit flies out of the foe and back into the hero
  for (let i = 0; i < 14; i++) { B.fx.push({ kind: 'heal', x: f.x + f.w / 2, y: f.y + f.h / 2, t: 0, n: 20 }); await nextFrame(); }
  f.hp = Math.min(f.mhp, f.hp + e.amt); pop(f, '+' + e.amt, BCOL.heal); f.flash = 6;
  await wait(30);
}
async function undoFoeHit(e) {
  const f = B.foes[e.foeHit], u = B.party.find(p => p.id === e.hero);
  bmsg(e.clue + ' ...UNDONE.', 70); f.flash = 8; await wait(12);
  if (u) { const was = u.hp; u.hp = Math.min(u.mhp, u.hp + e.amt); pop(u, '+' + e.amt, BCOL.heal); if (was <= 0 && u.hp > 0) pop(u, 'UN-KO', BCOL.st); fx('heal', u, 24); }
  await wait(30);
}
async function paradox() {
  B.paradox++; sfx('glitch'); post.wave = 4; bmsg('PARADOX. THAT IS NOT HOW IT HAPPENED.', 90);
  for (let i = 0; i < 24; i++) { post.flash = i & 2 ? .2 : 0; await nextFrame(); } post.flash = 0; post.wave = 0;
}
// the log, newest at the top: the next thing to undo is highlighted
function drawLog() {
  if (!B || !B.log || B.results) return;
  const x = 6, y = 4, w = 196, rows = Math.min(5, B.pos + 1);
  if (rows <= 0 || B.menu || (B.msg && B.msg.t > 0)) return;
  panel(x, y, w, rows * 10 + 16); text('THE LOG (UNDO FROM THE TOP)', x + 6, y + 4, UI.name);
  for (let k = 0; k < rows; k++) { const e = B.log[B.pos - k]; const s = e.clue.length > 31 ? e.clue.slice(0, 30) + '.' : e.clue; text(s, x + 6, y + 15 + k * 10, k === 0 ? WHITE : UI.dim); }
}
