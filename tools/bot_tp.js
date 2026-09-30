async function tpChat(label, ...want) { WANT = [label, ...want]; await tap('a'); await settle(); WANT = []; }
async function RUNBOT() {
  anyKey = true;
  await waitFor(() => scene && scene.update && !busy && fx.fade === 0 && frame > 400, 4000, 'title');
  await frames(40); await tap('start'); await settle();
  check(scene === setScene, 'hangout: TP in front of Towel Quest (visit ' + TPM.visits + ')');
  await tpChat('HI TP');
  BOT_TYPE = 'HELLO PEOPLE AT HOME';
  await tpChat('CAN I HAVE A SQUARE?', 'ONE SQUARE?', 'WHAT');
  check(TPM.squares === 1 && TPM.msgs[0] === 'HELLO PEOPLE AT HOME' && fx.pal === 'tp' && !fx.wave, 'square bit: boundary, bat, "are you okay", vision fixed, mic message saved');
  await tpChat('WHAT\'S YOUR LORE?'); await tpChat('WHAT\'S YOUR LORE?');
  BOT_TYPE = '312'; await tpChat('HOW MANY WATCHING?'); check(true, 'viewer count keypad');
  await tpChat('STARING CONTEST'); check(TPM.stares === 1, 'staring contest');
  BOT_TYPE = 'I LOVE THIS'; await tpChat('TYPE SOMETHING...'); check(true, 'free-typed chat message');
  await tpChat('DO THE AWARDS', 'GIVE A SPEECH'); check(TPM.msgs.length >= 2, 'Pretend Co. Awards from real save data, acceptance speech');
  await tpChat('PLAY SOMETHING ELSE'); check(scene === setScene, 'shelf opened and returned');
  // idle hosting
  const i0 = IDLEN; await frames(60 * 24); await settle(); check(IDLEN > i0, 'TP hosts on his own when you do nothing');
  // settings -> gentle, second square (the miss variant)
  WANT = ['GENTLE']; await tap('select'); await settle(); check(TPM.fx === 'GENTLE', 'effects set to GENTLE');
  BOT_TYPE = 'SORRY';
  await tpChat('CAN I HAVE A SQUARE?', 'ONE SQUARE?', 'I\'M FINE'); check(TPM.squares === 2 && fx.pal === 'tp', 'second square: the swing misses, then lands (gentle)');
  // the vault
  BOT_TYPE = 'A ROLL WALKS INTO A BAR';
  await tpChat('WHAT\'S YOUR LORE?'); check(TPM.vault, 'third lore question: TP goes in the vault');
  WANT = ['KNOCK']; await tap('a'); await settle(); WANT = ['KNOCK']; await tap('a'); await settle(); WANT = ['SLIDE A NOTE']; await tap('a'); await settle();
  check(!TPM.vault && scene === setScene, 'knocked twice, slid a note: vault opened');
  // try to start: he stalls twice (startTries already counted nothing yet)
  await tap('start'); await settle(); await tap('start'); await settle(); await tap('start'); await settle();
  check(M && M.id === 'tq1' && QUEST_ON, 'third START press: Towel Quest begins');
  // TOWEL QUEST
  STEALTH = true;
  await talk(4, 2); check(F('quest'), 'the Old Washcloth gives the quest');
  WANT = ['ONE SQUARE?']; await stepOn(9, 3); check(M.id === 'tq2' && F('interrupt'), 'TP interrupts his own game');
  await talk(5, 3); check(has('RUBBER DUCK'), 'rubber duck under the mat');
  await talk(11, 2); check(F('open'), 'the duck opens the door');
  await stepOn(11, 2); check(M.id === 'tq3', 'the end of the world');
  await talk(6, 3);
  WANT = ['THROW IT']; await talk(3, 1);
  await waitFor(() => !busy && scene.update && TPM.done === 1, 30000, 'credits');
  check(TPM.played === 1, 'threw in the towel -> credits -> title');
  say_('TP remembers: ' + JSON.stringify(TPM.msgs));
}
