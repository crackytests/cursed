'use strict';
// ================= TP — the hangout (the part that isn't a production) =================
const TPS = { x: 48, y: 52, sc: 2, mood: 'n', bat: null, mic: 0, dbl: 0 };
let WAIT0 = 0, IDLEN = 0, HUDMSG = null, startTries = 0, QUEST_ON = false;
const TCHAT = ['lurker', 'shareholder_1', 'mallrat99', 'ghostfan666', 'carl_defender', 'towel_enjoyer', 'first_time_here'];
const TJUNK = ['is this the carl game', 'same studio!!', 'HI TP', 'can i have a square', 'start the game', 'what is towel quest', 'W', 'the roll is so real',
  'why is he toilet paper', 'the game is RIGHT THERE', 'low effort stream W', 'this is the best one', 'i have never seen this cartridge'];

// ---------- the set ----------
// the bat swings from off-camera (bottom right) across the whole screen, at you, getting closer
function drawBat(b) {
  const px0 = W + 30, py0 = H + 40, L = 200;
  for (let t = 0; t < L; t += 2) {
    const k = t / L, w = 3 + k * k * (10 + b.grow * 40), x = px0 + Math.cos(b.a) * t, y = py0 + Math.sin(b.a) * t;
    rect(x - w / 2 - 1, y - w / 2 - 1, w + 2, w + 2, 3); rect(x - w / 2, y - w / 2, w, w, k < .35 ? 3 : 2);
    if (k > .7) rect(x - w / 4, y - w / 2 + 2, w / 6, w - 4, 1);
  }
}
function drawSet() {
  const t = frame;
  cls(0);
  rect(6, 13, 148, 84, 2); rect(8, 15, 144, 80, 0);
  bigtext('TOWEL', 35, 20, 1, 3); bigtext('QUEST', 35, 44, 2, 3);
  blit(SPR.towel.down[(t >> 4) & 1], 14, 70);
  if ((t >> 5) & 1) text('PRESS START', 70, 78, 2);
  let mood = TPS.mood;
  if (mood === 'n' && t % 240 < 8) mood = 'blink';
  if (dlg && dlg.name === TPN && !dlg.arrow && (t >> 2) & 1) mood = 'talk';
  if (TPS.dbl) bigblit(ROLL[mood], TPS.x + TPS.dbl, TPS.y, TPS.sc, [0, 0, 1, 1]);
  bigblit(ROLL[mood], TPS.x, TPS.y, TPS.sc);
  if (TPS.bat) drawBat(TPS.bat);
  if (TPS.mic) bigblit(SPR.mic, 68, 70, 2);
  rect(0, 0, W, 10, 3); rect(3, 3, 4, 4, (t >> 5) & 1 ? 0 : 2); text('LIVE', 9, 2, 0);
  const s = Math.floor((t - WAIT0) / 60);
  text(HUDMSG || ('GAME WAITING ' + String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')), 46, 2, 1);
}
const setScene = {
  update() {
    if (busy) return;
    IDLEN_T++;
    if (pressed.a) { IDLEN_T = 0; run(chatMenu); }
    else if (pressed.start) { IDLEN_T = 0; run(tryStart); }
    else if (pressed.select) { IDLEN_T = 0; run(settings); }
    else if (IDLEN_T > 60 * 22) { IDLEN_T = 0; run(idleBit); }
  },
  draw: drawSet,
};
let IDLEN_T = 0;
async function approach(sc) {
  const from = { x: TPS.x, y: TPS.y, sc: TPS.sc }, to = sc >= 3 ? { x: 32, y: 14, sc: 3 } : { x: 48, y: 52, sc: 2 };
  for (let i = 1; i <= 12; i++) { const k = i / 12; TPS.x = Math.round(from.x + (to.x - from.x) * k); TPS.y = Math.round(from.y + (to.y - from.y) * k); TPS.sc = from.sc + (to.sc - from.sc) * k; await nextFrame(); }
}
async function hangoutEnter() {
  scene = setScene; music('hang'); clearFx(); QUEST_ON = false;
  if (!WAIT0) WAIT0 = frame;
  Object.assign(TPS, { x: 48, y: 52, sc: 2, mood: 'n', bat: null, mic: 0, dbl: 0 });
}
async function enterShow() {
  TPM.visits++; saveM();
  await fadeOut(4);
  if (TPM.vault) { vaultScene(); await fadeIn(4); await say('TP IS STILL IN THE VAULT FROM LAST TIME. PRESS A: KNOCK, SLIDE HIM A NOTE, OR JUST WAIT HIM OUT.'); return; }
  await hangoutEnter(); await fadeIn(4);
  await greet();
}
async function greet() {
  if (TPM.visits === 1) {
    await say('Oh. Hi. Welcome in.', TPN);
    await say('No story today. No production. No characters. Just me.', TPN);
    await say('Don\'t make the roll a whole thing.', TPN);
    await say('I\'m going to click that and we\'re going to play. Towel Quest. It\'s simple. It\'s right there.', TPN);
    await say('A: TYPE IN CHAT.   START: START THE GAME (TRY IT).   SELECT: EFFECTS.');
    if (CARTS.some(([, k]) => metaOf(k).boots)) await say('You\'ve been playing the other ones. The productions. I\'m not in those. I don\'t exist to those people. It\'s great.', TPN);
  } else {
    await say(pick(['Oh. You came back. Welcome in.', 'Hey. Hi. It\'s you again.', 'Welcome back. Nothing\'s changed. That\'s the brand.']), TPN);
    for (const [name, key] of CARTS) {
      const m = metaOf(key), o = TPM.meta[key] || { boots: 0, endings: 0 };
      if (m.endings > (o.endings || 0)) await say('You finished the ' + name + ' one. Did anyone clap? I\'ll clap. ...Clap.', TPN);
      else if (m.boots > (o.boots || 0)) { const d = m.boots - (o.boots || 0); await say('You booted the ' + name + ' one ' + d + ' time' + (d > 1 ? 's' : '') + ' since I saw you. I\'m not in that one. It\'s fine.', TPN); }
    }
    if (TPM.msgs.length) await say('Last time you told the people at home: "' + TPM.msgs[TPM.msgs.length - 1].toUpperCase() + '". Did they listen? They didn\'t listen.', TPN);
    if (TPM.done) await say('You already threw in the towel once. You know there\'s no more game, right? There was barely a game.', TPN);
  }
  for (const [, key] of CARTS) TPM.meta[key] = metaOf(key);
  saveM();
}

// ---------- chat (you are chat) ----------
function chatOptions() {
  const o = [['HI TP', hi], ['START THE GAME', tryStart], ['CAN I HAVE A SQUARE?', square], ['WHAT\'S YOUR LORE?', lore], ['HOW MANY WATCHING?', viewers],
    ['STARING CONTEST', stare], ['PLAY SOMETHING ELSE', shelf], ['TYPE SOMETHING...', typeMsg]];
  if (CARTS.some(([, k]) => metaOf(k).boots)) o.splice(6, 0, ['DO THE AWARDS', awards]);
  return o;
}
async function chatMenu() {
  const opts = chatOptions();
  const i = await choose(opts.map(o => o[0]), { x: 2, y: 12, cancel: 1 });
  if (i < 0) return;
  if (opts[i][0] !== 'TYPE SOMETHING...') await chat([{ u: 'YOU', m: opts[i][0], d: 20 }]);
  await opts[i][1]();
  TPS.mood = 'n';
}
async function hi() {
  await say(pick(['Hi. Hey. Welcome in.', 'Hello. Good to see you. Don\'t ask for anything.', 'Hey. We\'re just hanging out. It\'s a hangout. Look at us hang.', 'Hi! ...Sorry. That was a lot of energy for a roll.']), TPN);
}
async function tryStart() {
  startTries++;
  if (startTries < 3) {
    TPS.mood = 'mad'; sfx('bump');
    await say(pick(['Hold on, hold on. Don\'t touch that.', 'We\'re hanging out first. That\'s the whole thing.', 'I KNOW. I\'m getting there. I\'m going to click it. In a second.']), TPN);
    return;
  }
  await say(pick(['Fine. FINE. We\'re playing.', 'Okay. You win. Towel Quest. Here we go.']), TPN);
  await startQuest();
}
async function lore() {
  const n = ++TPM.lore; saveM();
  if (n === 1) return say('Bro, I picked this so I wouldn\'t have to answer that.', TPN);
  if (n === 2) return say('There\'s no lore. I\'m a roll. That\'s the lore. That\'s all of it. It\'s one sentence.', TPN);
  await vault();
}
async function viewers() {
  await say('How many people are watching? Tell me the number. Be honest. Round up.', TPN);
  const s = await keyboard('HOW MANY PEOPLE ARE WATCHING RIGHT NOW?', 6, true);
  const n = parseInt(s, 10) || 0;
  if (n === 0) return say('Zero. Just us. That\'s... honestly that\'s fine. That\'s a hangout.', TPN);
  if (n === 1) return say('One. That\'s you. Hi, you. You\'re watching yourself watch me. Don\'t think about it.', TPN);
  await say(n + ' people. ' + n + ' people are watching you do this. Hi. Welcome in. Ignore your vision.', TPN);
  if (n > 500) await say('That\'s a lot of people for a roll. I should have prepared something. I refuse to prepare something.', TPN);
}
async function stare() {
  const n = ++TPM.stares; saveM();
  await say('Staring contest. Don\'t blink. Blinking is pressing a button. Any button. Go.', TPN);
  TPS.mood = 'n'; await approach(3);
  let t = 0, you = false;
  while (t < 60 * 10) {
    await nextFrame(); t++;
    if (['a', 'b', 'start', 'select', 'up', 'down', 'left', 'right'].some(k => pressed[k])) { you = true; break; }
    if (t > 60 * 6) { TPS.mood = 'blink'; break; }
  }
  if (you && t < 60 * 6) { TPS.mood = 'mad'; await say('You blinked. I saw that. Everyone saw that. The people at home saw that.', TPN); }
  else { await wait(30); TPS.mood = 'n'; await say('...That doesn\'t count. That was a blink of respect. We\'re calling it a tie. I\'m calling it.', TPN); }
  await approach(2);
}
async function typeMsg() {
  const m = await keyboard('TYPE IN CHAT:', 24);
  await chat([{ u: 'YOU', m, d: 20 }]);
  const u = m.toUpperCase();
  if (/SQUARE|WIPE|TOILET|BUTT|POOP|BATHROOM|SHEET/.test(u)) { await say('You typed that. With the buttons. On purpose.', TPN); return square(); }
  if (/LORE|ORIGIN|BACKSTORY|WHO ARE YOU/.test(u)) return lore();
  if (/CARL|LINDA|GHOST|FACE|NEVADA|MALL/.test(u)) return say('I\'m not in those. I don\'t exist to them. Nobody asks me to deliver a parcel. It\'s great.', TPN);
  if (/START|PLAY|GAME|QUEST/.test(u)) return tryStart();
  if (/LOVE|THANK|GOOD|NICE|COOL|BEST/.test(u)) return say('Thanks. That\'s weird. Thanks.', TPN);
  if (/HOW ARE|YOU OK|OKAY/.test(u)) return say('I\'m a roll. I\'m fine. Rolls are always fine. We\'re rolled up about it.', TPN);
  await say('"' + u + '." ...Yeah. I hear you. I don\'t know what to do with that, but I hear you.', TPN);
  if (Math.random() < .4) { await say('Actually, say that to the people at home.', TPN); await peopleAtHome(m); }
}

// ---------- the square: boundary, bat, concern, vision, microphone ----------
async function square() {
  const n = ++TPM.squares; saveM();
  if (n >= 3 && Math.random() < .5) return say(pick(['No. Not tonight. We\'re playing.', 'I see it. I\'m letting it go. Look at me letting it go.', 'Bro. We established this. Your vision remembers.']), TPN);
  TPS.mood = 'mad';
  await approach(3);
  await say('We need to establish something.', TPN);
  if (n === 1) { await say('You don\'t come into somebody\'s stream and ask for pieces of them.', TPN); await say('I look like toilet paper. I get it. That doesn\'t make me yours.', TPN); }
  else await say('Again? We did this. You were there. Your vision was there.', TPN);
  if (await ask('...', null, ['ONE SQUARE?', 'OK, SORRY']) === 1) {
    TPS.mood = 'n'; await say('Thank you. That\'s all I wanted. See? We can have a normal evening.', TPN); return approach(2);
  }
  await swing(n === 2);
  TPS.mood = 'worried';
  const r = await ask('Are you okay?', TPN, ['I\'M FINE', 'YOU HIT ME', 'WHAT']);
  await say(['You look terrible. Come closer so I can check.', 'I\'m asking how you are. You can answer a question without starting another thing.', 'Exactly. That\'s what I thought. You\'re woozy.'][r], TPN);
  if (n === 1) await visionFix();
  else { await say('Let me— there.', TPN); clearFx(); TPS.dbl = 0; }
  await approach(2);
  if (n === 1 || Math.random() < .4) await micBit();
  await say('Anyway. The game.', TPN);
  TPS.mood = 'n';
}
async function swing(miss) {
  sfx('alert'); await wait(10);
  const sweep = async () => { for (let a = -1.35; a > -2.75; a -= .09) { TPS.bat = { a, grow: (-1.35 - a) / 1.4 }; await nextFrame(); } };
  await sweep();
  TPS.bat = null;
  if (miss) {
    sfx('bump'); await wait(20);
    await say('...', TPN); await say('Hold on. You should look worse than that.', TPN);
    await sweep();
    TPS.bat = null; hitFx(true);
    await wait(20); return say('There. That\'s correct.', TPN);
  }
  hitFx(false); await wait(30);
}
function hitFx(soft) {
  sfx('smash'); sfx('thump');
  const lv = effLv();
  if (lv === 'OFF') { banner('*THWACK*', 60); return; }
  fx.pal = pick(['dmg', 'pink', 'red']); fx.lcd = lv === 'FULL' && !soft ? .12 : .3;
  if (lv === 'FULL' && !soft) { fx.wave = 4; fx.roll = 24; TPS.dbl = 6; }
  fx.shake = lv === 'FULL' ? 3 : 1;
  run(async () => { await wait(14); fx.shake = 0; });
}
async function visionFix() {
  const lv = effLv();
  if (lv === 'OFF') return say('Your vision looks fine. That\'s suspicious. Moving on.', TPN);
  await say('Let me fix your vision here.', TPN);
  await say('Actually, you do it. LEFT/RIGHT: WOBBLE.  UP/DOWN: ROLL.  A: COLOR. Line yourself back up.', TPN);
  const PL = ['tp', 'dmg', 'pink', 'red'];
  let wv = fx.wave | 0, rl = fx.roll | 0, pl = Math.max(1, PL.indexOf(fx.pal)), t = 0;
  HUDMSG = 'FIX YOUR VISION';
  DBG.mode = 'vision'; DBG.vi = () => ({ wv, rl, pl });
  while (!(wv === 0 && rl === 0 && pl === 0)) {
    await nextFrame(); t++;
    if (pressed.left) wv = Math.max(0, wv - 1); if (pressed.right) wv = Math.min(8, wv + 1);
    if (pressed.up) rl = (rl + H - 4) % H; if (pressed.down) rl = (rl + 4) % H;
    if (pressed.a) pl = (pl + 1) % PL.length;
    if (t % 330 === 0 && t < 1000) { // he "helps"
      const k = rnd(3); if (k === 0 && lv === 'FULL') wv = Math.min(8, wv + 2); else if (k === 1 && lv === 'FULL') rl = (rl + 8) % H; else pl = (pl + 1) % PL.length;
      banner(pick(['HOLD ON. NO. THAT\'S WORSE.', 'LET ME HELP.', 'THERE. ...NO.']), 80); sfx('bump');
    }
    fx.wave = wv; fx.roll = rl; fx.pal = PL[pl]; TPS.dbl = wv ? Math.min(6, wv + 1) : 0;
    fx.lcd = wv || rl ? .15 : .55;
  }
  DBG.mode = null; HUDMSG = null; clearFx(); TPS.dbl = 0; sfx('get');
  await say('There. That\'s you again. You\'re welcome. I fixed that.', TPN);
}
async function micBit() {
  TPS.mic = 1; TPS.mood = 'n';
  await say('And I do want you to feel heard. I\'m a roll of the people.', TPN);
  await say('Go ahead. Tell the people at home what you\'d like them to know.', TPN);
  const m = await keyboard('TELL THE PEOPLE AT HOME WHAT YOU WOULD LIKE THEM TO KNOW:');
  TPM.msgs.push(m); TPM.msgs = TPM.msgs.slice(-10); saveM();
  TPS.mic = 0;
  await peopleAtHome(m);
  await say(pick(['Beautiful. Thanks for the feedback. I\'m going to do it. Anyway.', 'Powerful. The people at home are moved. I can tell. I can\'t tell.', 'Thank you. That\'s going in the record. There\'s no record.']), TPN);
}
async function peopleAtHome(m) {
  const prev = scene, ls = wrap(m.toUpperCase(), 12);
  scene = { draw() {
    cls(3); ctext('TO THE PEOPLE AT HOME:', 16, 1);
    ls.forEach((l, i) => bigtext(l, ((W - l.length * 12) / 2) | 0, 38 + i * 18, 0, 2));
    blit(SPR.miniTP, 4, 124); text('- A MESSAGE VIA TP', 22, 128, 2);
  } };
  sfx('ding');
  for (let i = 0; i < 360; i++) { await nextFrame(); if (i > 90 && (pressed.a || pressed.b)) break; }
  scene = prev;
}

// ---------- the vault ----------
async function vault() {
  await say('Okay. That\'s it. You keep asking. I\'m going in the vault. Knock if you need me. Or don\'t. I\'ll come out when I get bored.', TPN);
  TPM.vault = true; TPM.vaultAt = Date.now(); saveM();
  let d = 0; const prev = scene;
  scene = { draw() { prev.draw(); rect(0, 0, d, H, 3); rect(W - d, 0, d, H, 3); } };
  sfx('door'); while (d < 80) { d += 2; await nextFrame(); } sfx('thump');
  vaultScene();
}
function vaultScene() {
  music('suite'); clearFx();
  let alone = 0;
  scene = {
    update() {
      if (busy) return;
      if (pressed.a || pressed.start) { alone = 0; run(vaultKnock); }
      else if (++alone > 60 * 15) { alone = 0; run(() => vaultOpen('(FROM INSIDE THE VAULT) ...Hello? Is anyone still out there? It\'s really dark in here. I\'m coming out. Not because of you.')); }
    },
    draw() {
      cls(3); rect(20, 16, 120, 100, 2); rect(24, 20, 112, 92, 1);
      for (let a = 0; a < 40; a++) px(80 + Math.cos(a / 40 * 6.28) * 24, 66 + Math.sin(a / 40 * 6.28) * 24, 3);
      rect(78, 42, 4, 48, 3); rect(56, 64, 48, 4, 3); ctext('TP IS IN THE VAULT', 124, 1);
    },
  };
}
// the vault is a bit, not a lock: knocking, a note, or just waiting all get him out
async function vaultKnock() {
  const c = await ask('TP IS IN THE VAULT.', null, ['KNOCK', 'SLIDE A NOTE UNDER', 'WAIT']);
  if (c === 0) {
    const k = (TPM.knocks = (TPM.knocks || 0) + 1); saveM(); sfx('bump');
    if (k < 3) return say(['(FROM INSIDE THE VAULT) I\'m not here. I\'m in the vault. That\'s the opposite of here.', '(FROM INSIDE THE VAULT) Knocking is not a bit. Knocking is a door thing.'][k - 1], TPN);
    return vaultOpen('(FROM INSIDE THE VAULT) ...Fine. You\'re persistent. That\'s basically a bit.');
  }
  if (c === 1) {
    const m = await keyboard('WRITE A NOTE. SLIDE IT UNDER THE VAULT DOOR:');
    await say('(PAPER SOUNDS.)'); await wait(40);
    return vaultOpen('(FROM INSIDE THE VAULT) "' + m.toUpperCase() + '." ...Hm. ...Okay. That\'s a good bit. It isn\'t. But I respect the effort.');
  }
  await say('You wait outside the vault. It\'s very quiet.');
}
async function vaultOpen(line) {
  await say(line, TPN);
  TPM.vault = false; TPM.lore = 0; TPM.knocks = 0; saveM(); sfx('door');
  const secs = Math.max(1, Math.round((Date.now() - (TPM.vaultAt || Date.now())) / 1000));
  await fadeOut(4); await hangoutEnter(); await fadeIn(4);
  await say('I was in there for ' + (secs >= 120 ? Math.round(secs / 60) + ' minutes' : secs + ' seconds') + '. It felt like a week. Don\'t ask about my lore.', TPN);
}

// ---------- the shelf: go play a production ----------
async function shelf() {
  await say('You want a production? Go play a production. They\'re right here.', TPN);
  let i = 0; const prev = scene;
  scene = { update() {}, draw() {
    cls(0); ctext('THE SHELF', 6, 3);
    CARTS.forEach(([name, key], k) => {
      const x = 8 + k * 50, m = metaOf(key);
      rect(x, 24, 44, 60, k === i ? 3 : 2); rect(x + 3, 27, 38, 5, 1); rect(x + 4, 38, 36, 34, 0);
      name.split(' ').forEach((l, j) => text(l, x + 22 - l.length * 3, 46 + j * 10, 3));
      text('X' + m.boots, x + 4, 88, 2); if (m.endings) text('@', x + 34, 88, 3);
    });
    text('<> PICK  A PLAY  B BACK', 10, 104, 2);
    bigblit(SPR.miniTP, 72, 116, 1);
  } };
  for (;;) {
    await nextFrame();
    fx.pal = CARTS[i][3];
    if (pressed.left) { i = (i + 2) % 3; sfx('move'); }
    if (pressed.right) { i = (i + 1) % 3; sfx('move'); }
    if (pressed.b) break;
    if (pressed.a) {
      await say('Go. Have a production. I\'ll be here. I\'m always here.', TPN);
      TPM.left = CARTS[i][0]; saveM();
      await fadeOut(6);
      if (typeof location !== 'undefined' && location.href) { location.href = CARTS[i][2]; return; }
      fx.fade = 0; break;
    }
  }
  fx.pal = 'tp'; scene = prev;
  await say('Or stay. Staying is also good.', TPN);
}

// ---------- the Pretend Co. Awards (from your real save data) ----------
async function awards() {
  const played = CARTS.map(([n, k]) => [n, metaOf(k)]).filter(([, m]) => m.boots > 0);
  const prev = scene; let cardT = null, t = 0;
  music('entrance');
  scene = { update() { t++; }, draw() {
    cls(3); for (let x = 0; x < W; x += 8) { rect(x, 10, 4, 80, 2); rect(x + 4, 10, 4, 80, 1); }
    rect(18, 14, 124, 70, 0); ctext('THE PRETEND CO. AWARDS', 18, 3); rect(22, 27, 116, 1, 2);
    if (cardT) { wrap(cardT[0], 18).forEach((l, i) => ctext(l, 33 + i * 9, 2)); wrap(cardT[1], 18).forEach((l, i) => ctext(l, 55 + i * 10, 3)); }
    bigblit(ROLL[t % 200 < 6 ? 'blink' : 'n'], 4, 90, 1); bigblit(SPR.mic, 36, 104, 1);
  } };
  await say('Welcome to the first annual Pretend Co. Awards. I\'m hosting because I\'m not in any of these. That\'s the qualification.', TPN);
  const award = async (cat, who, line) => { cardT = [cat, who]; sfx('get'); await wait(30); await say(line, TPN); };
  const most = played.slice().sort((a, b) => b[1].boots - a[1].boots)[0];
  await award('MOST BOOTED', most[0] + ' (' + most[1].boots + ' BOOTS)', 'Booted ' + most[1].boots + ' times. Somebody loves you. Or you crashed a lot.');
  if (await ask('Accept on behalf of ' + most[0] + '?', TPN, ['GIVE A SPEECH', 'JUST WAVE']) === 0) {
    const m = await keyboard('YOUR ACCEPTANCE SPEECH FOR ' + most[0] + ':');
    TPM.msgs.push(m); saveM();
    await say('"' + m.toUpperCase() + '." ...Beautiful. Wrap it up. The music\'s playing. The music was always playing.', TPN);
  } else await say('A wave. Classic. Respect.', TPN);
  const fin = played.filter(([, m]) => m.endings > 0);
  await award('ACTUALLY FINISHED', fin.length ? fin.map(f => f[0]).join(', ') : 'NOBODY', fin.length === 3 ? 'All three. You finished all three. Go outside. Touch a towel.' : fin.length ? 'You finished something. That\'s more than I do.' : 'Nobody finished anything. Relatable.');
  if (metaOf('carl_meta').secret) await award('BEST SECRET', 'CARL', 'For the secret ending. I don\'t know what\'s in it. I\'m not in it.');
  const least = played.slice().sort((a, b) => a[1].boots - b[1].boots)[0];
  if (played.length > 1 && least[0] !== most[0]) await award('MOST IN NEED OF A HUG', least[0], 'Only ' + least[1].boots + ' boots. Go play it. It\'s lonely. I know lonely. I\'m on a cartridge by myself.');
  await award('THE TP AWARD FOR DOING NOTHING', 'TP', 'Oh. Oh wow. Me? I\'d like to thank nobody. I did this myself. Barely.');
  await say('That\'s the awards. They were stupid. I had a good time.', TPN);
  scene = prev; music('hang');
}

// ---------- when you do nothing: he hosts ----------
const IDLE = [
  () => say('Anyway. How\'s everyone doing. Genuinely.', TPN),
  () => say('It\'s ' + clock() + '. What are you doing with your night? This. You\'re doing this. Me too.', TPN),
  () => say('The game\'s still there. I can see it. It can see me. I\'m going to click it. In a second.', TPN),
  () => say('This is a low-effort stream. I want to be clear. Look how low. Look at the effort.', TPN),
  () => say('You ever just... not do the big thing? That\'s tonight. We\'re not doing the big thing.', TPN),
  () => say('Thanks for hanging out, by the way. I mean it. Don\'t make it weird.', TPN),
  async () => {
    const m = pick(TJUNK); await chat([{ u: pick(TCHAT), m }]);
    await say(m === 'can i have a square' ? 'Somebody asked for a square. I\'m going to let that go. Look at me letting it go.'
      : /start|game|RIGHT/.test(m) ? 'I KNOW. Everyone knows. The game knows.'
      : /carl|studio|cartridge/.test(m) ? 'Same studio. Different cartridge. I\'m the one where nothing happens.'
      : pick(['Thank you. Welcome in.', 'Yeah. Hi.', 'Correct.', 'That\'s chat. That\'s what chat does.']), TPN);
  },
];
async function idleBit() {
  const n = ++IDLEN;
  if ((frame - WAIT0) / 3600 > 8 && !TPM.offered) { TPM.offered = 1; return signOffOffer(); }
  if (n % 5 === 0) return say('You still there? Press something. Anything. ...Not START.', TPN);
  await pick(IDLE)();
}
async function signOffOffer() {
  await say('You know what? We never played the game. That\'s a TP night. That\'s what it is.', TPN);
  if (await ask('...', TPN, ['START THE GAME', 'SIGN OFF']) === 0) return startQuest();
  await say('Thanks for hanging out. This was stupid. I had a good time.', TPN);
  await say('Stream\'s over. You can turn it off. ...You have to actually turn it off. I can\'t do that part.', TPN);
  await tcredits('signoff');
}
