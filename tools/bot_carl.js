async function retry(what, fn, ok, n = 4) { for (let i = 0; i < n && !ok(); i++) { if (i) say_('retrying ' + what); await fn(); } check(ok(), what); }
async function RUNBOT() {
  await startGame('NEW GAME');
  check(M.id === 'ship', 'new game starts in the A.S.S.');
  await talk(5, 2); check(has('PARCEL'), 'picked up the parcel');
  await menu('STATUS', 'CLOSE'); await menu('ITEMS', 'BAGGIE', 'CLOSE');
  await menu('ASK CHAT');
  await stepOn(4, 6); check(M.id === 'lot', 'left ship through the hatch');

  // --- LOT ---
  await talk(16, 11); await talk(16, 11); await talk(15, 4);
  for (let i = 0; i < 30 && !F('cartDone'); i++) {
    const c = ent('cart'); let px, py;
    if (c.y > 7) { px = c.x; py = c.y + 1; } else if (c.y < 7) { px = c.x; py = c.y - 1; } else { px = c.x + 1; py = c.y; }
    await goTo(px, py); await face(c.x, c.y); WANT = ['PUSH']; await tap('a'); await settle(); WANT = [];
  }
  check(F('cartDone') && hasTape(1), 'pushed the cart into the corral (tape 2)');
  await menu('SMOKE'); check(S.haze > 0, 'smoking works');
  await talk(19, 13); check(hasTape(0), 'found space 219 while high (tape 1)');
  await talk(9, 1); check(F('won_door') && F('obj') === 'rear', 'argued with the mall door and won');
  await walkOut(19, 7, 'right'); check(M.id === 'dock', 'walked to the loading dock');

  // --- DOCK / MALL ---
  WANT = ['HUMAN']; await talk(5, 1); check(F('scanned'), 'scanner scene');
  await stepOn(6, 1); check(M.id === 'mall', 'entered the mall');
  for (let i = 0; i < 3; i++) await talk(1, 3); check(pretzels() === 3, 'collected 3 pretzels');
  await talk(5, 6); await talk(18, 6); check(has('A FACE'), 'got a face from lost & found');
  await talk(5, 6); check(hasTape(2), 'returned the face (tape 3)');
  WANT = ['SMILE']; await talk(1, 6); check(F('photo') === 1, 'photo booth');
  await stepOn(13, 1); check(M.id === 'arcade', 'entered the arcade');
  await retry('beat the Pill Catch high score (tape 4)', async () => { WANT = ['PLAY']; await talk(5, 1); say_('pill catch score ' + F('pillBest')); }, () => hasTape(3), 6);
  await walkOut(3, 5, 'down');
  await stepOn(9, 1); check(M.id === 'bongs', 'entered Bong Emporium');
  await retry('won the bong clerk argument (tape 5)', async () => { WANT = ['ARGUE']; await talk(2, 3); }, () => hasTape(4));
  await walkOut(3, 6, 'down');
  await stepOn(17, 1); check(F('floor') === 1, 'down escalator loops to B1');
  // "more outside" branch: smoke three times in the mall
  for (let i = 0; i < 3; i++) await menu('SMOKE');
  check(M.id === 'moreout', 'thrown MORE OUTSIDE');
  await talk(3, 4); await talk(10, 8);
  WANT = ['YES']; await talk(6, 2); check(M.id === 'lot', 'door frame back to the lot');
  await walkOut(19, 7, 'right'); await stepOn(6, 1); check(M.id === 'mall', 'back in the mall');
  await retry('stepped over the rope and beat the mall cop', async () => { WANT = ['STEP OVER']; await talk(18, 2); }, () => F('won_cop'));
  WANT = ['TAKE IT']; await stepOn(18, 1);
  check(M.id === 'desert' && F('delivered'), 'Suite 00 -> took the pill -> desert');

  // --- DESERT ---
  await talk(1, 12); check(has('BLANKET'), 'found the pod and the blanket');
  for (let i = 0; i < 4; i++) await talk(19, 5);
  await retry('beat the hitchhiker', async () => { WANT = ['ARGUE']; await talk(19, 5); }, () => F('won_hitch'));
  await retry('drove the Desert Bus 50 miles (tape 6)', async () => { WANT = ['DRIVE']; await talk(9, 6); say_('bus best ' + F('busBest')); }, () => hasTape(5));
  await stepOn(25, 4); check(M.id === 'diner', 'entered Garf\'s diner');
  await talk(6, 4); await talk(1, 1); await talk(8, 1); await talk(6, 1);
  await retry('won the JB Garfield argument (tape 7)', async () => { WANT = ['ARGUE']; await talk(3, 3); }, () => hasTape(6));
  await walkOut(4, 6, 'down'); check(M.id === 'desert', 'left the diner');
  await walkOut(27, 9, 'right'); check(P.x <= 1, 'the road wraps forever');
  await menu('SMOKE');
  WANT = ['OPEN']; await talk(22, 15); check(M.id === 'lab', 'found the hatch while high -> facility');

  // --- FACILITY (stealth) ---
  STEALTH = true;
  await talk(4, 10); check(has('KEYCARD'), 'Face\'s TV -> keycard');
  await talk(1, 10); check(hasTape(7), 'tape under the bed (tape 8)');
  await talk(1, 8);
  await talk(18, 1); check(has('BLACKJACK'), 'blackjack from the records drawer');
  await talk(15, 1);
  await retry('beat the Head of Containment', async () => { WANT = ['UP']; await talk(13, 14); }, () => M.id === 'box', 5);
  STEALTH = false;
  say_('times caught by white suits: ' + (F('caught') || 0));

  // --- THE BOX ---
  await talk(13, 7); await retry('beat USER_000', async () => { WANT = ['ARGUE']; await talk(13, 7); }, () => F('won_troll'));
  await menu('SMOKE'); await talk(4, 8);
  await talk(7, 2); check(F('cageOpen'), 'answered Linda\'s verification');
  await talk(2, 5); check(F('ghostFree'), 'freed Spooky Ghost');
  await retry('beat Linda (final boss)', async () => { WANT = ['HIT HER']; await talk(7, 2); }, () => F('ending'), 5);
  check(M.id === 'lot' && F('ghostBye'), 'epilogue in the lot');
  check(tapes().length === 8, 'all 8 tapes');
  await talk(2, 12);
  await waitFor(() => !busy && scene.update && META.endings === 1, 60000, 'credits');
  check(META.secret === 1, 'secret ending played');
  check(!fetchStore('carl_sav'), 'save cleared after ending');
  say_('arguments won: ' + Object.keys(S.flags).filter(k => k.startsWith('won_')).join(','));
}
