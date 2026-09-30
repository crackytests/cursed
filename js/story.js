'use strict';
// ================= SYSTEM SCRIPTS: boot, title, files, menu, chat =================
VOICE = { _: [700, 80], CARL: [980, 180], LINDA: [330, 0], DISPATCH: [520, 20], 'SPOOKY GHOST': [1300, 500], '???': [180, 40],
  ATTENDANT: [600, 60], CLERK: [760, 60], FACE: [450, 40], HITCHHIKER: [400, 50], SCANNER: [1500, 0], CARTMAN: [800, 90], VOICE: [1250, 600] };

const ITEMS = {
  BAGGIE: 'Weed. The baggie never runs out. Carl says that is normal for a baggie.',
  PARCEL: 'PROP PILLS parcel. TO: SUITE 00, MALL OF THE FUTURE. Something inside rattles. Just one thing.',
  RECEIPT: 'RECEIPT. ITEMS: 1. TOTAL: $0.00. PAID WITH: SOMETHING ELSE. THANK YOU FOR SHOPPING IN THE FUTURE.',
  BLANKET: 'A blanket. It is red. You can tell because Carl keeps saying it is red.',
  KEYCARD: 'An old keycard. The photo is scratched out. On the back: "for when you come back. -F"',
  BLACKJACK: 'A blackjack. Leather, heavy. Carl says he has only used it one time. That anyone saw.',
  'PROP PILL': 'One PROP PILL. "IT\'S ONLY PRETEND." It is slightly more than pretend.',
};
async function get(it, quiet) { if (!has(it)) S.items.push(it); sfx('get'); await wait(10); if (!quiet) await say('CARL GOT ' + it + '!'); }
const lose = it => { S.items = S.items.filter(i => i !== it); };
const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toUpperCase();

function bigtext(s, x, y, c, sc) {
  for (const ch of s) {
    const g = FONT[ch.toUpperCase()];
    if (g) for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) if (g[j] & (16 >> i)) rect(x + i * sc, y + j * sc, sc, sc, c);
    x += 6 * sc;
  }
}
function bigblit(s, x, y, sc, map) {
  for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const c = s.d[j * s.w + i]; if (c !== 255) rect(x + i * sc, y + j * sc, sc, sc, map ? map[c] : c); }
}

// ---------- START MENU ----------
async function startMenu() {
  sfx('tick');
  for (;;) {
    const i = await choose(['ITEMS', 'TAPES', 'SMOKE', 'ASK CHAT', 'STATUS', 'SAVE', 'CLOSE'], { x: W - 76, y: 4, cancel: 1 });
    if (i === 1) { await tapeMenu(); continue; }
    if (i === 4) { await statusScreen(); continue; }
    if (i === 0) {
      if (!S.items.length) { await say('Nothing. Empty pockets. Humans have pockets. Look how empty they are.', 'CARL'); continue; }
      const j = await choose(S.items, { x: 4, y: 4, cancel: 1 });
      if (j >= 0) await say((ITEMS[S.items[j]] || '???') + (S.items[j] === 'PRETZEL' ? ' YOU HAVE ' + pretzels() + '.' : ''));
      continue;
    }
    if (i === 2) return smoke();
    if (i === 3) return askChat();
    if (i === 5) return doSave();
    return;
  }
}
async function doSave() {
  saveGame(); sfx('ok');
  await say(F('act') >= 4 ? 'SAVED. HE IS SAVED. YOU ARE SAVED. EVERYONE WHO IS WATCHING IS SAVED.' : F('act') >= 3 ? 'GAME SAVED. WE SAVED YOUR SPOT.' : 'GAME SAVED.');
}
const SMOKELINES = ['Just a little. For my nerves. My regular human nerves.', 'Okay. Okay. Better. Everything\'s wobbly, but better.',
  'Chat, is it doing the thing? The wavy thing? Just me? Cool. Cool cool.', 'You can\'t have any, chat. You\'re in a computer. I\'m not in a computer.',
  'Hold on. Hold on. I think I see... no. Yeah. No. Hold on.'];
async function smoke() {
  if (M.def.onSmoke) { const r = await M.def.onSmoke(); if (r === false) return; }
  sfx('smoke');
  fxAdd.wave = 4; await wait(30); fxAdd.wave = 0;
  await say(pick(SMOKELINES), 'CARL');
  S.haze = 1800; setF('smoked', (F('smoked') || 0) + 1);
  if (M.def.afterSmoke) await M.def.afterSmoke();
}

// ---------- CHAT ----------
const CHATTERS = ['xX_gamer_Xx', 'propPillsFan', 'nevada_local', 'spookyfan99', 'mallwalker', 'bongwater', 'alienFACTS', 'desertbus8h', 'lurker', 'garf_ield'];
const JUNK = ['KEKW', 'carl is an alien', 'first', 'is this a real game??', 'what game is this', 'LOL', 'hes so short', 'W', 'nevada mentioned',
  'hi carl!!', 'CARL CARL CARL', 'bro is NOT human', 'this game is so weird', 'i had this as a kid', 'never heard of this game', 'the music tho',
  'ears under the hat confirmed', 'prop pills sponsor this?', 'is this on the gameboy', 'my cousin had this one'];
const CREEPY = [() => 'who is playing', () => 'he can hear us', () => 'dont let him look behind him', () => 'its ' + clock() + ' where you are',
  () => 'turn around', () => 'thats not carl', () => 'why is the chat in the game', () => 'we are right here', () => 'look at the camera', () => 'this cartridge was never sold'];
const HINTS = {
  start: ['grab the parcel from the console', 'leave through the hatch at the bottom'],
  door: ['go to the big mall doors up top', 'deliver the parcel dude'],
  rear: ['sign says DELIVERIES AT REAR', 'go right from the lot, east side'],
  scan: ['use the scanner panel next to the shutter'],
  suite: ['suite 00 is past the escalators on the right', 'the escalators in the mall. top right'],
  loop: ['the down escalator doesnt go anywhere', 'the rope says dont go down the UP one... so do that', 'do the opposite of what it says lol'],
  pill: ['talk to linda', 'take the pill carl'],
  desert: ['smoke and look for footprints', 'the road goes forever. go SOUTH', 'below nevada...'],
  lab: ['find the room with the tv', 'dont let the white suits see you', 'theres a keycard somewhere'],
  lab2: ['elevator at the far end', 'use the keycard on the elevator'],
  box: ['go up to linda', 'the ghost is in the cage', 'smoke in here?'],
  home: ['go to the ship', 'go home carl'],
};
async function askChat() {
  await say(pick(['Chat. Chat. What do I do.', 'Okay, chat, help me out here.', 'Chat, real talk. Where am I going?', 'Chat, I\'m asking for a friend. The friend is me.']), 'CARL');
  const act = F('act') || 0, obj = F('obj') || 'start';
  const msgs = [];
  const n = 2 + rnd(2);
  for (let i = 0; i < n; i++) msgs.push({ u: pick(CHATTERS), m: pick(JUNK) });
  msgs.splice(1 + rnd(msgs.length - 1), 0, { u: pick(CHATTERS), m: pick(HINTS[obj] || HINTS.start) });
  if (act >= 2) msgs.push({ u: act >= 3 ? 'you' : 'user_000', m: pick(CREEPY)(), d: 70 });
  const tpm = fetchStore('tp_mem'); // what you told the people at home, on another cartridge
  if (tpm && tpm.msgs && tpm.msgs.length && Math.random() < .35) msgs.push({ u: 'you', m: pick(tpm.msgs).toLowerCase(), d: 70 });
  await chat(msgs);
  if (act >= 3 && Math.random() < .5) { await say('Who\'s "you"? Chat. Who is that. Ban that guy. Can I ban? I can\'t ban.', 'CARL'); return; }
  await say(pick(['Okay. Somebody said something useful. I\'m not saying who. I\'m not giving you the satisfaction.',
    'Half of that was about me being short. The other half was fine.', 'Okay, yeah, I was gonna do that. I was already doing that.',
    'Why do you guys keep saying alien. Say the other thing. The useful thing. Okay you did. Thank you.']), 'CARL');
}

// ---------- BOOT / TITLE / FILES ----------
async function boot() {
  fx.pal = 'off'; fx.fade = 0;
  scene = { draw() { cls(0); } };
  fit(); requestAnimationFrame(loop);
  while (!anyKey) await nextFrame();
  await wait(20);
  fx.pal = 'dmg'; META.boots++; saveMeta();
  const bad = (META.endings > 0 && Math.random() < .6) || Math.random() < .07;
  const logo = bad ? 'PRETEND C0' : 'PRETEND CO';
  let y = -16;
  scene = { draw() { cls(0); bigtext(logo, 21, y, 3, 2); if (y >= 60) text('(R)', 136, y + 1); } };
  while (y < 60) { y++; await wait(2); }
  await wait(12); sfx(bad ? 'dingbad' : 'ding');
  if (bad) { await wait(40); fx.pal = 'red'; await wait(2); fx.pal = 'dmg'; }
  await wait(bad ? 60 : 90);
  await fadeOut(4); title(); await fadeIn(4);
}
function title() {
  const after = META.endings > 0;
  music('title');
  if (after) { mus.rate = .9; mus.det = -40; mus.wob = 30; } else { mus.rate = 1; mus.det = 0; mus.wob = 0; }
  let t = 0, flash = 0;
  scene = {
    update() {
      t++;
      if (!busy && t > 30 && (pressed.start || pressed.a)) { sfx('ok'); run(fileSelect); }
      if (rnd(1400) === 0) flash = 2;
    },
    draw() {
      cls(0);
      for (let i = 0; i < 40; i++) { const sx = (hash(i, 1) * W + t * (hash(i, 2) * .3)) % W, sy = hash(i, 3) * 60; px(sx, sy, 1); }
      rect(0, 96, W, 48, 1); rect(0, 96, W, 1, 2);
      bigtext('CARL', 32, 10, 3, 4); bigtext('CARL', 30, 8, 2, 4);
      ctext(after ? 'BELOW AND BELOW NEVADA' : 'ABOVE & BELOW NEVADA', 42, 3);
      if (flash > 0) { flash--; bigblit(SPR.shadowEyes, 56, 40, 3); }
      bigblit(after ? SPR.carlback : SPR.carl.down[((t >> 5) & 1) ? 0 : 0], 56, 52 + (Math.sin(t * .05) * 2 | 0), 3);
      if ((t >> 5) & 1) ctext(after && (t >> 7) % 3 === 2 ? 'HE IS LOOKING' : 'PUSH START', 114, 3);
      ctext('(C)1998 PRETEND CO.', 130, 2);
    },
  };
}
let secretTries = 0;
async function fileSelect() {
  const sv = fetchStore('carl_sav');
  const hm = s => { const m = Math.floor((s || 0) / 60); return String(Math.floor(m / 60)).padStart(2, ' ') + ':' + String(m % 60).padStart(2, '0'); };
  const prev = scene.draw;
  scene = { draw() {
    prev(); box(8, 20, 144, 60);
    text('FILE 1  ' + (sv ? 'CARL' : '-EMPTY-'), 18, 28); if (sv) text('TIME ' + hm(sv.time), 66, 38, 2);
    text('FILE 2  ' + (META.endings ? 'HIM' : '????'), 18, 52); text('TIME 999:59', 66, 62, 2);
  } };
  const opts = sv ? ['CONTINUE', 'NEW GAME', 'FILE 2'] : ['NEW GAME', 'FILE 2'];
  const i = await choose(opts, { x: 40, y: 86, cancel: 1 });
  const o = opts[i];
  if (i < 0) { title(); return; }
  if (o === 'FILE 2') { await file2(); title(); return; }
  if (o === 'NEW GAME' && sv) {
    await say('ERASE CARL?', null, { keep: 1 });
    const c = await choose(['NO', 'YES']); dlg = null;
    if (c !== 1) { title(); return; }
    sfx('glitch'); fx.noise = .3; await wait(20); fx.noise = 0;
    await say(META.endings ? 'YOU CAN\'T. BUT OKAY.' : 'CARL ERASED.');
  }
  await fadeOut(4);
  mus.rate = 1; mus.det = 0; mus.wob = 0;
  if (o === 'CONTINUE') { S = sv; scene = worldScene; loadMap(S.map, S.x, S.y, S.dir); await fadeIn(4); return; }
  newGame();
}
async function file2() {
  secretTries++;
  sfx('glitch'); music(null); fx.noise = .25; await wait(15); fx.noise = 0;
  const lines = META.endings ? ['THANK YOU FOR', 'PLAYING WITH HIM.'] : secretTries === 1 ? ['THIS IS NOT', 'YOUR FILE.'] : secretTries === 2 ? ['STOP.'] : ['HE IS STILL', 'IN THERE.'];
  let t = 0;
  scene = { draw() { t++; cls(3); blit(SPR.carlback, 72, 56 + (t > 150 ? 0 : 0)); lines.forEach((l, i) => ctext(l, 96 + i * 10, 1)); if (t > 170 && t < 174) bigblit(SPR.shadowEyes, 48, 16, 2); } };
  sfx('hum');
  await wait(200);
  await fadeOut(2); await wait(30); fx.fade = 0;
  music('title');
}
async function newGame() {
  S = newState(); S.items = ['BAGGIE']; setF('obj', 'start'); setF('act', 1);
  if (META.endings) setF('again', META.endings);
  music(null);
  scene = { draw() { cls(3); } };
  fx.fade = 0;
  await showCard(['NEVADA.'], 120);
  await showCard(['ABOVE AND BELOW.'], 120);
  if (META.endings) await showCard(['AGAIN.'], 90);
  await showCard(['CHAPTER 1', '', 'THE PARCEL'], 150);
  scene = worldScene;
  loadMap('ship', 4, 3, 'down');
  fx.fade = 3; await fadeIn(6);
  run(MAPS.ship.intro);
}
