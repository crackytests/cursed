async function RUNBOT_FROM5() {
  await startGame('CONTINUE');
  STEALTH = true; PHASE = true;
  WANT = ['ADMIT'];
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

RUNBOT = RUNBOT_FROM5;
