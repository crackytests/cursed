'use strict';
// ================= CARL 3: arguments. the same fight as always: he talks until the other person runs out of patience =================
// foe: { name, port, patience, weak: { LOGIC|GRIEVANCE|DENIAL|RANT: mult }, immune, atk: [lines], hit: damage to composure (1-2), win: line, id }
const ARG = { composure: 6, max: 6, patience: 10, pmax: 10, log: '', foe: null, turn: 0 };
async function argue3(foe) {
  const loss = (C3.losses = C3.losses || {})[foe.id || foe.name] || 0, A = ARG;
  Object.assign(A, { composure: 6 + Math.min(3, loss), max: 6 + Math.min(3, loss), patience: foe.patience, pmax: foe.patience, foe, log: foe.open || '', turn: 0, flash: 0, shake: 0, carlFlash: 0, done: 0, res: {} });
  DBG.mode = 'argue'; DBG.arg = A;
  const prev = scene, pm = curName; music('argue');
  scene = { update() { if (A.flash > 0) A.flash--; if (A.carlFlash > 0) A.carlFlash--; }, draw() { drawArgue(); } };
  post.fade = 1; await fadeIn(.08);
  for (;;) {
    const moves = ['LOGIC', 'GRIEVANCE', 'DENIAL', 'RANT', 'DEFLECT', 'ASK CHAT'];
    A.menu = true; const i = await choose(moves, { x: 12, y: 130 }); A.menu = false;
    const m = moves[i]; let dmg = 0, line = '';
    if (m === 'DEFLECT') { A.composure = Math.min(A.max, A.composure + 2); line = pick(['I\'m fine. Why does everybody say I\'m not fine.', 'Sorry, what? Say it again, but nicer.']); sfx('ok'); }
    else if (m === 'ASK CHAT') { const h = foe.hint || 'try a different one'; tickC(h, 'user_000'); line = 'CHAT: ' + h.toUpperCase(); A.composure = Math.min(A.max, A.composure + 1); sfx('chat'); }
    else {
      const base = { LOGIC: 3, GRIEVANCE: 4, DENIAL: 3, RANT: 5 }[m], mult = (foe.weak && foe.weak[m]) || 1; dmg = (foe.immune && foe.immune.includes(m)) ? 0 : Math.round(base * mult);
      if (m === 'RANT' && !(foe.weak && foe.weak.RANT)) A.composure -= 1;
      A.patience = Math.max(0, A.patience - dmg); A.flash = 10; sfx(dmg ? 'hurt' : 'tick');
      line = (CARLARG[m] || [''])[rnd((CARLARG[m] || ['']).length)] + (mult > 1 ? '  ...IT WORKED.' : dmg === 0 ? '  ...NOTHING.' : '');
    }
    A.log = line; await readWait(36, line.length);   // carl's line stays up long enough to read; A skips
    if (A.patience <= 0) break;
    const hit = foe.hit || 1; A.composure -= hit; A.carlFlash = 12; A.log = (foe.atk[A.turn++ % foe.atk.length]); sfx('hurt'); WX.shake = 6; await readWait(40, A.log.length);
    if (A.composure <= 0) { A.done = -1; break; }
  }
  const win = A.patience <= 0;
  if (win) { A.log = foe.win || 'THEY GIVE UP.'; await readWait(50, A.log.length); } else { C3.losses[foe.id || foe.name] = loss + 1; A.log = 'CARL LOST HIS COOL.'; await readWait(50, A.log.length); }
  await fadeOut(.06); scene = prev; music(pm); DBG.mode = null; await fadeIn(.08);
  return { win };
}
const CARLARG = {
  LOGIC: ['IT\'S A BOX. A BOX CAN GO WHERE IT WANTS.', 'IF I LIVE HERE THEN I\'M HERE, SO I\'M ALLOWED.', 'THAT DOESN\'T FOLLOW. I CHECKED.'],
  GRIEVANCE: ['YOU WALKED OVER HERE AND NOW IT\'S A PROBLEM.', 'IT WAS FINE A MINUTE AGO. CHAT, WAS IT FINE?', 'YOU DID THIS LAST TIME TOO.'],
  DENIAL: ['I\'M A NORMAL HUMAN. THIS IS A NORMAL HUMAN FACE.', 'THE GREEN IS THE LIGHTING.', 'WHO SAID ALIEN. I DIDN\'T SAY ALIEN.'],
  RANT: ['NO. NO, LISTEN. HOLD ON. SO. THERE\'S A THING. AND IT\'S A BOX. AND...', 'I HAVE A JOB. I HAVE A JOB AND A SHIP AND A SIGNED RECEIPT.', 'DO YOU KNOW HOW LONG I\'VE BEEN DOING THIS?!'],
};
function drawArgue() {
  const A = ARG, f = A.foe, t = frame;
  skyD(0, H, '#241040', '#6d2492'); for (let i = 0; i < 9; i++) triF(160, 80, 160 + Math.cos(i * .7 + t * .01) * 300, 80 + Math.sin(i * .7 + t * .01) * 300, 160 + Math.cos(i * .7 + .35 + t * .01) * 300, 80 + Math.sin(i * .7 + .35 + t * .01) * 300, hex(i & 1 ? '#3a1068' : '#2a0c52'));
  rectF(0, 150, W, 74, hex('#100828'));
  const fx = 218 + (A.flash > 0 && (A.flash & 2) ? 4 : 0), cx = 22 + (A.carlFlash > 0 && (A.carlFlash & 2) ? -4 : 0);
  drawBust(f.port || f.name, fx - 20, 26, 92, 92, A.flash > 0, t); frameRect(fx - 21, 25, 94, 94, hex(BACC[f.port || f.name] || '#ffffff'));
  drawBust('CARL', cx, 36, 92, 92, A.carlFlash > 0, t); frameRect(cx - 1, 35, 94, 94, hex('#6dff92'));
  text(f.name, fx - 22, 12, hex('#ffdb49')); text('CARL', cx + 2, 24, hex('#6dff24'));
  text('PATIENCE', 150, 4, UI.dim); rectF(150, 14, 160, 6, hex('#301010')); rectF(150, 14, 160 * A.patience / A.pmax, 6, hex('#ff6d49'));
  text('COMPOSURE', 4, 4, UI.dim); for (let i = 0; i < A.max; i++) rectF(4 + i * 12, 14, 10, 6, i < A.composure ? hex('#6dff92') : hex('#102010'));
  plate(4, 160, W - 8, 60); shadowText(A.log.slice(0, 50), 14, 170, UI3.text); if (A.log.length > 50) shadowText(A.log.slice(50, 100), 14, 182, UI3.text);
  if (A.menu) text('A: SAY IT', 220, 208, UI.dim);
}
