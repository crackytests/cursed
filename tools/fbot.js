// FACE bot: runs inside the game context. BOT.tick() is called once per frame before loop().
var BOT = (() => {
  let F = 0, last = {}, want = {}, lastSay = '', W8 = {}, stuck = 0, lastT = -1, stallF = 0;
  const L = s => console.log('[' + F + '] ' + s);
  const press = k => { if (!last[k]) want[k] = 1; };
  const hold = k => { want[k] = 1; };
  function menuPick(m) {
    const o = m.opts.join('|');
    if (o.includes('NEW GAME')) return m.opts.indexOf(W8.start === 'cont' && o.includes('CONTINUE') ? m.opts.find(x => x.startsWith('CONTINUE')) : 'NEW GAME');
    if (o.includes('TAKE THE SPONSORSHIP')) return W8.sponsor === '0' ? 1 : 0;
    if (o.includes('THE TRUTH')) return W8.ghost === 'lie' ? 1 : 0;
    if (o.includes('TAKE HIS POTENTIAL')) return W8.kid === 'free' ? 1 : 0;
    if (o.includes('APOLOGIZE')) return W8.apology === '0' ? 1 : 0;
    if (o.includes('NOTHING. LET IT END.')) { const want = { core: 'YOKO', kid: 'THE KID', viewers: 'EVERYONE', nothing: 'NOTHING', dyslexio: 'D-Y-S' }[W8.soul || 'core']; const i = m.opts.findIndex(x => x.startsWith(want)); return i < 0 ? 0 : i; }
    if (o.includes('SAVE AND QUIT')) return W8.quitLab && !BOT.quitDone ? (BOT.quitDone = 1, 1) : 0;
    if (o.includes('RESTORE') && o.includes('LET HIM GO')) return 0;
    if (o.includes('RESUME')) return 0;
    return 0;
  }
  let blackF = 0, flashF = 0, shakeF = 0;
  function watch() { // things a human would see that a bot can't: dialogs on a black screen, a flash that never ends, a shake that never stops
    if (post.fade > .95 && (DLG || MENUS.length || CARD)) { if (++blackF === 20) L('WARN FADE-BLACK while ' + (DLG ? 'DLG ' + DLG.lines[0] : MENUS.length ? 'MENU ' + MENUS[0].opts[0] : 'CARD ' + CARD.lines[0])); } else blackF = 0;
    if (post.flash > .25) { if (++flashF === 180) L('WARN FLASH STUCK at ' + post.flash); } else flashF = 0;
    if (post.shake > 0) { if (++shakeF === 120) L('WARN SHAKE STUCK at ' + post.shake + (scene === gameScene ? '' : ' (outside gameplay)')); } else shakeF = 0;
  }
  function tick() {
    F++; want = {}; watch();
    if (!anyKey) { anyKey = true; }
    if (MENUS.length) { const m = MENUS[MENUS.length - 1], t = menuPick(m); if (m._logged !== m) { m._logged = m; L('MENU [' + m.opts.join(' / ') + '] -> ' + m.opts[t]); } if (F % 3 === 0) { if (m.i !== t) press(m.i < t ? 'down' : 'up'); else press('a'); } apply(); return; }
    if (DLG) { const s = DLG.lines.join(' '); if (s !== lastSay) { lastSay = s; L((DLG.who ? DLG.who + ': ' : '') + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (CARD) { const s = CARD.lines.join('/'); if (s !== lastSay) { lastSay = s; L('CARD ' + s); } if (F % 4 === 0) press('a'); apply(); return; }
    if (DBG.credits) { if (F % 2) hold('start'); apply(); return; }
    if (SH.cm && SH.cm.t === 1) L('COMM ' + SH.cm.who + ': ' + SH.cm.text);
    if (scene === gameScene && !frozen()) shmupAI();
    else if (scene === fx3Scene && !frozen()) fx3AI();
    else if (F % 8 === 0) press('a');
    apply();
  }
  function apply() { for (const k of ['up', 'down', 'left', 'right', 'a', 'b', 'c', 'start']) kb[k] = want[k] ? 1 : 0; last = Object.assign({}, want); }
  function shmupAI() {
    if (SH.t !== lastT) { lastT = SH.t; stallF = 0; } else if (++stallF === 600) L('STALL at stage ' + SH.stage.id + ' t=' + SH.t);
    if (PLR.dead) return;
    const hx = PLR.x, hy = PLR.y; let fx = 0, fy = 0, danger = 0;
    for (const b of SH.eb) {
      for (let k = 0; k <= 12; k += 4) { const px = b.x + b.vx * k, py = b.y + b.vy * k, dx = hx - px, dy = hy - py, d2 = dx * dx + dy * dy; if (d2 < 34 * 34) { const d = Math.max(3, Math.sqrt(d2)); fx += dx / d * (40 / d) * (1.4 - k / 16); fy += dy / d * (40 / d) * (1.4 - k / 16); if (d2 < 14 * 14) danger++; } }
    }
    for (const e of SH.ents) { if (e.benign || e.harmless || e.ghost || e.dying) continue; const R = (e.box ? Math.max(e.box[0], e.box[1]) / 2 : e.hit ? 26 : e.r) + 16, dx = hx - e.x, dy = hy - e.y, d = Math.hypot(dx, dy); if (d < R) { fx += dx / Math.max(4, d) * 3; fy += dy / Math.max(4, d) * 3; } }
    // aim: line up with a target to the right
    let tgt = null, best = 1e9;
    for (const e of SH.ents) { if (e.benign || e.ghost || e.dying || e.x < hx || e.x > W) continue; if (e.k === 'spot' && PLR.form === 'pilot') continue; const pr = (e.boss ? -500 : 0) + (e.k === 'skip' ? -2000 : 0) + (e.word && PLR.form === 'dys' ? -300 : 0) + Math.abs(e.y - hy) + (e.x - hx) * .3; if (pr < best) { best = pr; tgt = e; } }
    let ty = tgt ? tgt.y : 112;
    for (const it of SH.items) if ((it.k === 'bulb' || it.k === 'letter' || it.k === 'backup') && it.x > 0 && it.x < W) { ty = it.y; fx += (it.x - hx) * .02; }
    const tx = tgt && tgt.boss ? Math.min(110, tgt.x - 120) : 80;
    fx += clamp((tx - hx) * .02, -1, 1); fy += clamp((ty - hy) * .05, -1.5, 1.5);
    if (fx > .25) hold('right'); else if (fx < -.25) hold('left');
    if (fy > .25) hold('down'); else if (fy < -.25) hold('up');
    hold('a');
    if (danger >= 2 && PLR.pot >= 50 && F % 2 === 0) press('b');
    // forms
    const words = SH.ents.some(e => e.word && !e.benign && e.x < W);
    const want = SH.stage.id === 4 && SH.stage.dysPart && (words || SH.boss) && PLR.pot > 25 ? 'dys' : SH.stage.id === 3 && PLR.forms.includes('pilot') ? 'pilot' : SH.boss ? (PLR.forms.includes('old') ? 'old' : 'new') : 'new';
    if (PLR.form !== want && PLR.forms.includes(want) && F % 6 === 0 && !(want === 'dys' && PLR.pot < 12)) press('c');
  }
  function fx3AI() {
    const [px, py] = fx3World(); let fx = 0, fy = 0;
    for (const b of FX3.eb) { if (b.z > 260) continue; const k = (b.z - FX3.ZP) / Math.max(1, -b.vz), bx = b.x + b.vx * k, by = b.y + b.vy * k, dx = px - bx, dy = py - by, d = Math.hypot(dx, dy); if (d < 12) { fx += dx / Math.max(1, d) * 3; fy += dy / Math.max(1, d) * 3; } }
    for (const o of FX3.objs) { if (!o.hp || o.z > 200) continue; const dx = px - o.x, dy = py - o.y, d = Math.hypot(dx, dy); if (d < 20) { fx += dx / Math.max(1, d) * 2; fy += dy / Math.max(1, d) * 2; } }
    let tgt = null; for (const o of FX3.objs) if (o.hp && o.z > 80 && o.z < 500 && (!tgt || o.z < tgt.z)) tgt = o;
    if (tgt) { fx += clamp((tgt.x - px) * .05, -1, 1); fy += clamp((tgt.y - py) * .05, -1, 1); }
    if (fx > .2) hold('right'); else if (fx < -.2) hold('left'); if (fy > .2) hold('down'); else if (fy < -.2) hold('up');
    hold('a');
  }
  return { tick, set(w) { W8 = w; }, get F() { return F; }, quitDone: 0 };
})();
