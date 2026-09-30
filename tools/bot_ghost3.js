async function RUNBOT_FROM3() {
  await startGame('CONTINUE');
  STEALTH = true; PHASE = true;
  WANT = ['ADMIT'];
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
  check(S.cards.length === 15 - 6, 'all 9 cue cards from EP3-5');
  check(S.honesty >= 4, 'honest route (honesty ' + S.honesty + ') -> warm ending');
  check(!fetchStore('ghost_sav'), 'save cleared after ending');
  say_('career applause ' + S.total + ', stars ' + [1, 2, 3, 4, 5].map(n => F('stars' + n)).join(','));
}

RUNBOT = RUNBOT_FROM3;
