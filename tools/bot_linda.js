async function retry(what, fn, ok, n = 4) { for (let i = 0; i < n && !ok(); i++) { if (i) say_('retrying ' + what); await fn(); } check(ok(), what); }
async function cams() { await menu('CAMERAS'); }
async function page(i, x, y) { if (pages().includes(i)) return; await cams(); await talk(x, y); check(pages().includes(i), 'diary page ' + (i + 1)); }
async function toAtriumFromOffice() { await walkOut(4, 7, 'down'); check(M.id === 'atrium', 'office -> atrium'); }
async function toOffice() { if (M.id !== 'atrium') throw new Error('toOffice from ' + M.id); await talk(9, 0); check(M.id === 'office', 'atrium -> office elevator'); }
async function endDay() { const d = S.day; WANT = ['END DAY']; await talk(4, 3); check(S.day === d + 1, 'ended day ' + d + ' (funds $' + S.funds + ', recog ' + S.rec + ')'); }
async function lease(u, x, name) { if (S.units[u]) return; WANT = [name, 'SIGN']; await talk(x, 1); check(S.units[u], 'leased ' + name + ' (funds $' + S.funds + ')'); }
async function RUNBOT() {
  await startGame('NEW GAME');
  check(M.id === 'office' && S.day === 1, 'day 1 in Suite 00');
  await talk(1, 2); check(esp() === 3, 'espresso machine refill');
  await talk(1, 0); await talk(5, 0); await talk(2, 0); await talk(8, 0); await talk(0, 5); await talk(7, 2);
  await menu('STATUS', 'CLOSE'); await menu('PORTFOLIO', 'CLOSE'); await menu('POLL CHAT');
  await page(0, 8, 6);
  await menu('DIARY', 'THE MAGICIAN', 'CLOSE');
  await toAtriumFromOffice();
  await stepOn(0, 5); check(M.id === 'studio', 'studio');
  await talk(5, 1); await talk(3, 7); await talk(6, 7); await talk(8, 7);
  await stepOn(5, 3); check(F('g_entrance'), 'entrance rhythm game (best ' + Math.round((F('bestEntrance') || 0) * 100) + '%)');
  await stepOn(11, 5);
  await lease('u3', 6, 'ARCADE'); await lease('u4', 13, 'PRETZELS');
  await talk(4, 6); await talk(15, 5); await talk(1, 2); await talk(18, 7);
  await walkOut(9, 9, 'down'); check(M.id === 'lot', 'parking lot');
  await talk(16, 12); await talk(15, 4); await talk(2, 12);
  await retry('negotiated with Carl', async () => { await talk(4, 12); }, () => F('g_carl'));
  await talk(9, 1); check(M.id === 'atrium', 'lot -> atrium');
  await toOffice(); await endDay();

  // DAY 2
  await toAtriumFromOffice();
  await stepOn(0, 5);
  await retry('got the ad on Face\'s show', async () => { await talk(5, 1); }, () => F('g_ad'));
  await page(5, 10, 7);
  await stepOn(11, 5);
  await stepOn(19, 5); check(M.id === 'rnd', 'R&D');
  WANT = ['RUN IT']; await talk(5, 2); check(F('g_rnd') && F('compUnlocked'), 'R&D test -> Perfect Impression');
  await talk(8, 4); await talk(9, 1);
  await page(2, 10, 5);
  await stepOn(0, 4);
  await retry('handled the bong incident', async () => { await talk(4, 2); }, () => F('g_bong'));
  await talk(5, 4); await talk(14, 6);
  if (S.funds >= 400) await lease('u5', 15, 'LINDA LITE');
  await page(1, 17, 8); await page(6, 1, 8);
  await walkOut(9, 9, 'down'); await page(4, 19, 14); await talk(9, 1);
  await toOffice(); await endDay();

  // DAY 3
  await retry('beat the auditor', async () => { await talk(4, 5); }, () => F('g_audit'));
  await toAtriumFromOffice();
  await cams(); await talk(11, 4); check(F('g_ghost'), 'ghost echo on camera');
  await page(3, 11, 4);
  await retry('ended the pretzel strike', async () => { await talk(1, 2); }, () => F('g_union'));
  await talk(6, 7); await talk(13, 3);
  if (!S.units.u5 && S.funds >= 400) await lease('u5', 15, 'LINDA LITE');
  await lease('u6', 17, 'PHOTO');
  await toOffice(); await endDay();

  // DAY 4
  await toAtriumFromOffice();
  await talk(16, 6);
  if (!S.units.u5 && S.funds >= 400) await lease('u5', 15, 'LINDA LITE');
  await stepOn(3, 7); check(M.id === 'eighty' || M.id === 'eighties', '80s department');
  await page(7, 12, 7); await talk(12, 1); await talk(11, 2);
  await retry('the trap: negotiated with Spooky Ghost', async () => { WANT = ['OPEN THE DOOR']; await talk(7, 4); }, () => F('g_trap'));
  check(F('allyFace'), 'opened the door (Face becomes an ally)');
  await stepOn(1, 1); check(M.id === 'atrium', 'back up the escalator');
  await toOffice(); await endDay();

  // DAY 5
  check(S.day === 5, 'day 5');
  say_('funds going into the takeover: $' + S.funds + ' (target $' + AUDIT_TARGET + ')');
  WANT = ['ENTER']; await talk(8, 0); check(M.id === 'box', 'into the box through the monitor');
  WANT = ['HIT IT']; await talk(8, 10); check(F('carlHit'), 'Carl helps');
  await retry('defended the mall against the Core', async () => { await talk(7, 2); }, () => F('won_core'), 5);
  await waitFor(() => !busy && scene.update && LMETA.endings === 1, 80000, 'ending + credits');
  check(pages().length === 8, 'all 8 diary pages');
  check(!fetchStore('linda_sav'), 'save cleared after ending');
  say_('negotiations won: ' + Object.keys(S.flags).filter(k => k.startsWith('won_')).join(','));
}
