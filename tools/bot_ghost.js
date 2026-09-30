async function haunt(label) {
  let tries = 0; const skip = {};
  while (S.applause < M.def.quota || M.ents.some(e => e.talk === hauntMark && visible(e) && !F('meh_' + S.ep + '_' + e.id))) {
    if (++tries > 200) throw new Error('haunting stalled ' + S.applause + '/' + M.def.quota);
    const marks = M.ents.filter(e => e.talk === hauntMark && visible(e) && !F('meh_' + S.ep + '_' + e.id));
    marks.forEach(m => { m._pen = (skip[m.id] || 0) * 6; });
    if (!marks.length) break;
    marks.sort((a, b) => (Math.abs(a.x - P.x) + Math.abs(a.y - P.y) + a._pen) - (Math.abs(b.x - P.x) + Math.abs(b.y - P.y) + b._pen));
    const e = marks[0], [dx, dy] = DIRS[e.dir], bx = e.x - dx, by = e.y - dy;
    if (!passable(bx, by) && !(P.x === bx && P.y === by)) { await frames(30); continue; }
    try { await goTo(bx, by, { maxWait: 250 }); } catch (err) { skip[e.id] = (skip[e.id] || 0) + 1; await frames(20); continue; }
    if (P.x === bx && P.y === by && e.x === bx + dx && e.y === by + dy && !e.mv) {
      if (P.dir !== e.dir) { kb[e.dir] = 1; await fr(); kb[e.dir] = 0; await frames(2); }
      await tap('a'); await settle();
    }
  }
  say_(label + ': applause ' + S.applause + '/' + M.def.quota + ' (fronts: ' + Object.keys(S.flags).filter(k => k.startsWith('meh_' + S.ep)).length + ')');
}
async function cards() { for (const e of M.ents.filter(e => e.card !== undefined && visible(e))) { try { await goTo(e.x, e.y); await settle(); } catch (err) { say_('card ' + e.card + ' blocked for now: ' + err.message); } } }
const _haunt = haunt;
haunt = async label => { await _haunt(label); await cards(); check(!M.ents.some(e => e.card !== undefined && visible(e)), label + ' all 3 cue cards'); };
async function nextEp(n) { await waitFor(() => S.ep === n && M && M.id === EPS[n].map && scene === worldScene && !busy, 40000, 'episode ' + n); check(true, 'episode ' + n + ' stage: ' + M.id + ' (after cold open + entrance, applause ' + S.applause + ')'); }
async function RUNBOT() {
  await startGame('NEW SHOW');
  STEALTH = true; PHASE = true;
  WANT = ['ADMIT'];
  // EP1
  await nextEp(1);
  await menu('STATUS', 'CLOSE'); await menu('NARRATE');
  await cards();
  await talk(11, 2); check(F('sig1'), 'solved the EP1 sigil');
  await talk(8, 6);
  await haunt('EP1');
  WANT = ['ADMIT']; await talk(14, 1);
  // EP2
  await nextEp(2);
  await cards();
  await talk(8, 1); await talk(9, 1); await talk(10, 1); await talk(9, 6);
  await talk(6, 8); await talk(11, 8); check(F('sig2a') && F('sig2b'), 'solved both EP2 sigils');
  await haunt('EP2');
  WANT = ['ADMIT']; await talk(16, 1);
  // EP3
  await nextEp(3);
  await cards();
  await haunt('EP3');
  WANT = ['ADMIT']; await talk(7, 1);
  // EP4
  await nextEp(4);
  await cards();
  await talk(6, 8); await talk(13, 8);
  await haunt('EP4');
  WANT = ['ADMIT']; await talk(9, 1);
  // EP5
  await nextEp(5);
  await cards();
  await haunt('EP5');
  WANT = ['LET IT GO', 'ADMIT']; await talk(7, 5);
  await waitFor(() => !busy && scene.update && GMETA.endings === 1, 90000, 'finale + credits');
  check(S.cards.length === 15, 'all 15 cue cards');
  check(S.honesty >= 4, 'honest route (honesty ' + S.honesty + ') -> warm ending');
  check(!fetchStore('ghost_sav'), 'save cleared after ending');
  say_('career applause ' + S.total + ', stars ' + [1, 2, 3, 4, 5].map(n => F('stars' + n)).join(','));
}
