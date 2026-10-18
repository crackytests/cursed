'use strict';
// ================= DEUS EX NEVADA: the cast (sprites, speakers, portraits) =================
const SPEC = {
  carl: { kind: 'carl', skin: '#5ac8a8', hat: '#1c1c2a', hatBack: 1, coat: '#1a1a24', coatLen: .9, top: '#2a2a34', legs: '#1a1a22', shoes: '#0a0a10', bowtie: '#f0d020', hs: 'bald' },
  fatco: { skin: '#e0b090', helmet: '#4a5a7a', visor: '#60e0ff', top: '#3a4a6a', legs: '#2a3448', belt: '#1a2030', gloves: 1 },
  fatcoagent: { skin: '#d8a888', hair: '#2a2018', hs: 'short', top: '#1a1a22', legs: '#14141c', tie: '#3a4a8a', glasses: '#101010' },
  ppf: { skin: '#c89070', hair: '#3a2a1a', hs: 'short', top: '#6a4a2a', legs: '#3a4a6a', mask: '#a02020', maskEye: '#2a1a10' },
  ppf2: { skin: '#e0b898', hair: '#5a3a1a', hs: 'long', top: '#3a5a3a', legs: '#4a3a2a', hat: '#2a2a2a' },
  mj: { skin: '#d0a080', helmet: '#22222c', visor: '#ff3030', top: '#1a1a22', legs: '#14141a', belt: '#3a3a44', gloves: 1 },
  mjelite: { skin: '#d0a080', helmet: '#d8d8e0', visor: '#ff40ff', top: '#2a1a3a', legs: '#1a1028', belt: '#5a4a6a', gloves: 1, kind: 'big' },
  miws: { skin: '#e8dcd8', hair: '#e8e8f0', hs: 'short', top: '#ececf4', legs: '#e0e0e8', shoes: '#f0f0f8', tie: '#e8e8f0', glasses: '#101010', hat: '#f4f4fa' },
  cop: { skin: '#c89070', hair: '#1a1410', hs: 'short', top: '#1a2a5a', legs: '#1a2448', hat: '#1a2a5a', hatBand: '#d8c040', belt: '#101010' },
  thug: { skin: '#a87050', hair: '#1a1410', hs: 'bald', top: '#d8d8d0', legs: '#2a3a5a', hat: '#a02020' },
  thug2: { skin: '#e0b090', hair: '#c8a040', hs: 'spiky', top: '#3a3a3a', legs: '#2a2a3a', coat: '#4a3a2a', coatLen: .4 },
  redchat: { skin: '#e8c0a0', hair: '#e02020', hs: 'spiky', top: '#c02020', legs: '#1a1a22', coat: '#a01818', coatLen: .3 },
  lurker: { skin: '#d0b098', hair: '#2a2a32', hs: 'long', top: '#2a2a32', legs: '#1a1a20', mask: '#1a1a20', maskEye: '#40ff80' },
  gatebox: { skin: '#e8c8b0', hair: '#1a1a20', hs: 'short', top: '#f0e0ec', legs: '#ff70b0', hat: '#ff70b0', belt: '#ff70b0' },
  casino: { skin: '#c89070', hair: '#1a1410', hs: 'short', top: '#14141a', legs: '#14141a', vest: '#a01828', bowtie: '#a01828' },
  tunnel: { skin: '#b08068', hair: '#4a3a2a', hs: 'long', top: '#5a5a4a', legs: '#3a3a30', coat: '#4a4a3a', coatLen: .6, hat: '#3a3a5a' },
  civ1: { skin: '#e0b090', hair: '#5a3a1a', hs: 'short', top: '#4a6a9a', legs: '#2a2a3a' },
  civ2: { skin: '#a87050', hair: '#1a1410', hs: 'long', top: '#c06080', legs: '#2a2a3a', kind: 'woman', skirt: '#3a2a4a' },
  civ3: { skin: '#c8a090', hair: '#8a8a8a', hs: 'short', top: '#6a6a5a', legs: '#4a4a3a', coat: '#5a5a4a', coatLen: .6 },
  civ4: { skin: '#f0d0b8', hair: '#d8b060', hs: 'pony', top: '#e0e0d0', legs: '#4a5a8a', kind: 'woman' },
  civ5: { skin: '#8a5a3a', hair: '#1a1410', hs: 'bald', top: '#d07020', legs: '#3a3a3a' },
  civ6: { skin: '#e0b8a0', hair: '#2a1a10', hs: 'short', top: '#2a5a3a', legs: '#5a4a3a', glasses: '#202020' },
  humanunit: { skin: '#e8c0a0', hair: '#7a5a30', hs: 'short', top: '#e0d8c0', legs: '#b8a070', shoes: '#5a3a1a', belt: '#5a3a1a' },
  // named
  pilotx: { skin: '#a87050', hair: '#14101a', hs: 'spiky', top: '#3a3448', legs: '#2a2438', coat: '#a8d8d0', coatLen: .7, glasses: '#e0ff40', hatBand: '#c02020', extra: (cx, hy, d) => { if (d !== 1) { rectF(cx - 3, hy - 3, 7, 1, hex('#c02020')); } } },
  yoko: { kind: 'woman', skin: '#f0c8a8', hair: '#8a4a2a', hs: 'long', top: '#8a90d0', legs: '#e8e8f0', lips: '#c06060' },
  yokoid: { kind: 'woman', skin: '#f0d8d0', hair: '#8a4a2a', hs: 'long', top: '#e8e8f0', legs: '#e8e8f0', lips: '#c06060', belt: '#60c0ff' },
  linda: { kind: 'woman', skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', top: '#18141c', legs: '#18141c', tie: '#ff70b0', lips: '#3a1020', skirt: '#18141c' },
  idol: { kind: 'woman', skin: '#f4dcc8', hair: '#ff90c8', hs: 'pony', top: '#ffe0f0', legs: '#ffffff', tie: '#ff40a0', lips: '#e04080', skirt: '#ff70b0' },
  jb: { skin: '#f09030', hair: '#f09030', hs: 'bald', hat: '#a8a090', hatBand: '#1a1a1a', coat: '#b8a888', coatLen: .85, top: '#d8d8d8', legs: '#3a3a3a', tie: '#1a1a1a', kind: 'big', extra: (cx, hy, d) => { if (d === 0) { rectF(cx - 3, hy - .5, 6, 2, hex('#f8f0e0')); pset(cx - 2, hy, INK); pset(cx + 1, hy, INK); pset(cx, hy + 2, INK); } } },
  takahashi: { skin: '#e8c0a0', hair: '#f0e080', hs: 'spiky', top: '#30b0a0', legs: '#2a2a3a', glasses: '#101010' },
  docproper: { skin: '#e0c0a8', hair: '#d8d8d8', hs: 'bald', top: '#f0f0f0', legs: '#3a3a4a', coat: '#f0f0f4', coatLen: .7, glasses: '#3a3a3a' },
  drdamm: { skin: '#c89070', hair: '#5a4a3a', hs: 'short', top: '#d07020', legs: '#3a4a6a', hat: '#f0d020', glasses: '#202020' },
  peekid: { kind: 'kid', skin: '#f0c8a8', hair: '#2a1a14', hs: 'short', top: '#f0f0f0', legs: '#3a4a6a', tie: '#a07040' },
  mrwhite: { skin: '#e0d0c8', hair: '#f0f0f0', hs: 'short', top: '#f8f8ff', legs: '#f0f0f8', shoes: '#ffffff', tie: '#ffffff', glasses: '#0a0a0a', coat: '#f4f4fc', coatLen: .5 },
  qm: { skin: '#a87050', hair: '#2a2a2a', hs: 'bald', top: '#4a5a3a', legs: '#3a4a2a', belt: '#2a2a1a', kind: 'big' },
  bartender: { skin: '#e0b090', hair: '#3a2a1a', hs: 'short', top: '#f0f0f0', legs: '#1a1a1a', vest: '#1a1a1a', bowtie: '#a02020' },
  ghostman: { skin: '#e8e8f8', hair: '#e8e8f8', hs: 'bald', top: '#14141c', legs: '#14141c', bowtie: '#f0f0f0', vest: '#f0f0f8', coat: '#14141c', coatLen: .5 },
};
function buildPeople() {
  for (const k in SPEC) personSprites(k, SPEC[k]);
  // HU-MAN: the normal human, identical every time
  SPRITES.human = SPRITES.humanunit;
  // ROBO MALL COP: a mall cop who is mostly robot
  personSprites('robocop', { skin: '#a8b0c0', helmet: '#c8d0dc', visor: '#ff3030', top: '#2a3a6a', legs: '#2a3a6a', belt: '#1a1a1a', hatBand: '#d8c040', gloves: 1, kind: 'big', extra: (cx, hy, d, ty) => { if (d === 0) { rectF(cx - 1, ty + 2, 3, 2, hex('#d8c040')); } } });
  // SPOOKY GHOST: a sheet with a grin, floating
  animSprites('ghost', (d, f) => { const bob = Math.sin(f * 1.5) * 1.2; blob(10, 12 + bob, 8, 7, [hex('#8a8ab0'), hex('#c8c8e8'), hex('#f0f0ff'), WHITE]); rectF(2, 12 + bob, 17, 12, hex('#e8e8f8')); for (let x = 2; x < 19; x += 4) ellF(x + 2, 24 + bob + ((x + f) % 3), 2, 2, hex('#e8e8f8')); if (d !== 1) { ellF(7, 10 + bob, 1.6, 2.2, INK); ellF(13, 10 + bob, 1.6, 2.2, INK); polyF([[6, 15 + bob], [14, 15 + bob], [10, 19 + bob]], INK); } }, 20, 32);
  SPRITES.ghost.fly = 1;
  // DIRECTOR FACE / OLD FACE live on screens: a monitor bank prop with a face
  prop('facescreen', 2, 1, 46, 40, () => { rectF(0, 0, 46, 34, hex('#14141c')); rectF(2, 2, 42, 28, hex('#05050a')); rectF(14, 34, 18, 6, hex('#2a2a34')); }, { light: [4, .8, '#c060ff'], comp: 0 });
  prop('dyslexio', 1, 1, 22, 34, () => { rectF(1, 8, 20, 26, hex('#3a1a40')); blob(11, 9, 10, 8, shadeTones('#8a2a6a')); rectF(3, 10, 16, 14, hex('#05050a')); ellF(7, 15, 2.5, 1.5, hex('#ff40ff')); ellF(15, 15, 2.5, 1.5, hex('#ff40ff')); pset(7, 15, hex('#40ff60')); pset(15, 15, hex('#40ff60')); rectF(8, 20, 6, 1, hex('#ff40ff')); polyF([[2, 6], [20, 6], [17, 0], [5, 0]], hex('#a02040')); }, { light: [3, .8, '#ff40ff'] });
  prop('peekidpod', 1, 1, 22, 40, () => { rectF(2, 2, 18, 36, hex('#2a3040')); rectF(4, 6, 14, 28, hex('#ffe060')); blob(11, 14, 3.4, 2.6, shadeTones('#f0c8a8')); blob(11, 12.6, 3.2, 1.8, shadeTones('#2a1a14')); rectF(8, 17, 6, 10, hex('#f0f0f0')); rectF(0, 0, 22, 4, hex('#5a6070')); rectF(0, 36, 22, 4, hex('#5a6070')); }, { light: [6, 1, '#fff080'], emissive: 1 });
}
// ---------- speakers ----------
defSpeaker('CARL', { name: 'CARL', col: hex('#60e0b0'), voice: [520, 120] });
defSpeaker('N', { name: '', col: hex('#a8e8ff') });
defSpeaker('YOKO', { name: 'YOKO', col: hex('#a0a8ff'), voice: [880, 40] });
defSpeaker('PILOTX', { name: 'PILOT X', col: hex('#e0ff40'), voice: [300, 30] });
defSpeaker('FACE', { name: 'DIRECTOR FACE', col: hex('#ff40ff'), voice: [240, 60], screen: 1 });
defSpeaker('OLDFACE', { name: '???', col: hex('#40ff80'), voice: [200, 80], screen: 1 });
defSpeaker('LINDA', { name: 'CEO LINDA', col: hex('#ff70b0'), voice: [700, 20] });
defSpeaker('IDOL', { name: 'IDOL LINDA', col: hex('#ffa0d0'), voice: [1000, 60] });
defSpeaker('GHOST', { name: 'SPOOKY GHOST', col: hex('#e0e0ff'), voice: [420, 90] });
defSpeaker('JB', { name: 'JB GARFIELD', col: hex('#ffa040'), voice: [220, 20] });
defSpeaker('HUMAN', { name: 'HU-MAN', col: hex('#e0d8c0'), voice: [400, 0] });
defSpeaker('ROBOCOP', { name: 'ROBO MALL COP', col: hex('#80a0ff'), voice: [160, 0] });
defSpeaker('TAKAHASHI', { name: 'TAKAHASHI', col: hex('#40e0d0'), voice: [760, 160] });
defSpeaker('DOC', { name: 'DOC PROPER', col: hex('#f0f0f0'), voice: [380, 40] });
defSpeaker('DAMM', { name: 'DR. DAMM', col: hex('#f0d020'), voice: [340, 50] });
defSpeaker('PEEKID', { name: 'PEE KID', col: hex('#f0f0f0'), voice: [1200, 80] });
defSpeaker('DYSLEXIO', { name: 'DYSLEXIO', col: hex('#ff40ff'), voice: [180, 40], screen: 1 });
defSpeaker('WHITE', { name: 'MR. WHITE', col: hex('#ffffff'), voice: [260, 10] });
defSpeaker('QM', { name: 'QUARTERMASTER HOLT', col: hex('#a0c070'), voice: [200, 30] });
defSpeaker('YOKOID', { name: 'NURSE YOKOID', col: hex('#c0d8ff'), voice: [950, 10] });
defSpeaker('HELIOS', { name: 'HELIOS', col: hex('#fff080'), voice: [500, 0], screen: 1 });

// ---------- portraits (procedural; tools/dxgen.js can replace them with painted ones in dx/img) ----------
const PW2 = 88, PH2 = 108;
function bgPort(top, bot) { gradV(0, 0, PW2, PH2, hex(top), hex(bot), 12); for (let y = 0; y < PH2; y += 3) rectA(0, y, PW2, 1, BLACK, .16); }
function bust(o) {
  bgPort(o.bg0 || '#1a2440', o.bg1 || '#05070c');
  const sk = shadeTones(o.skin || '#e0b090'), cl = shadeTones(o.cloth || '#3a4a6a'), hc = o.hair ? shadeTones(o.hair) : null;
  // Sculpted shoulders & lapels
  polyF([[4, PH2], [10, 78], [30, 70], [58, 70], [78, 78], [84, PH2]], cl[2]);
  polyF([[58, 70], [78, 78], [84, PH2], [58, PH2]], cl[1]);
  polyF([[4, PH2], [10, 78], [30, 70], [26, PH2]], cl[3]);
  lineF(28, 72, 36, PH2, cl[0]); lineF(60, 72, 52, PH2, cl[0]);
  if (o.collar) { polyF([[30, 70], [44, 90], [58, 70], [52, 68], [44, 80], [36, 68]], hex(o.collar)); }
  if (o.tie) { polyF([[42, 76], [46, 76], [48, 100], [44, 106], [40, 100]], hex(o.tie)); rectF(43, 76, 2, 4, shadeOf(hex(o.tie), 1.3)); }
  if (o.bowtie) { polyF([[34, 72], [44, 76], [34, 80]], hex(o.bowtie)); polyF([[54, 72], [44, 76], [54, 80]], hex(o.bowtie)); }
  // Neck + smooth cel-shaded head
  rectF(37, 56, 14, 16, sk[1]); rectF(37, 56, 5, 14, sk[2]);
  paintHead(44, 40, o.hw || 17, o.hh || 22, sk);
  if (hc && o.hs !== 'bald') {
    if (o.hs === 'long' || o.hs === 'up') {
      paintHead(44, 28, 20, 15, hc);
      rectF(25, 30, 7, o.hs === 'long' ? 40 : 18, hc[2]);
      rectF(56, 30, 7, o.hs === 'long' ? 40 : 18, hc[1]);
      if (o.hs === 'up') paintHead(58, 14, 11, 9, hc);
    } else if (o.hs === 'spiky') {
      paintHead(44, 26, 20, 13, hc);
      for (let i = 0; i < 9; i++) polyF([[22 + i * 5, 26], [26 + i * 5, 6 + (i % 2) * 5], [30 + i * 5, 26]], hc[(i % 2) + 2]);
    } else {
      paintHead(44, 25, 18.5, 12, hc);
    }
    rectF(28, 24, 32, 4, hc[2]);
  }
  // Crisp facial features
  const ey = o.ey || 42;
  if (!o.noFace) {
    // Sclera & iris/pupil with upper-left catchlight
    rectF(33, ey - 1, 7, 4, WHITE); rectF(48, ey - 1, 7, 4, WHITE);
    rectF(35, ey - 1, 4, 4, INK); rectF(50, ey - 1, 4, 4, INK);
    pset(35, ey - 1, WHITE); pset(50, ey - 1, WHITE);
    // Eyebrows
    rectF(32, ey - 4, 9, 2, hc ? hc[0] : sk[0]); rectF(47, ey - 4, 9, 2, hc ? hc[0] : sk[0]);
    // Nose bridge & shadow
    rectF(43, ey + 3, 2, 6, sk[1]); pset(42, ey + 7, sk[3]); pset(44, ey + 8, sk[0]);
    // Mouth / lips
    rectF(39, ey + 13, 10, 1, o.lips ? hex(o.lips) : sk[0]);
    if (o.lips) rectF(40, ey + 14, 8, 1, shadeOf(hex(o.lips), .8));
    else rectF(41, ey + 14, 6, 1, sk[1]);
  }
  if (o.glasses) {
    const gc = hex(o.glasses), ghi = shadeOf(gc, 1.7) || hex('#90c0ff');
    rectF(30, ey - 2, 13, 6, gc); rectF(45, ey - 2, 13, 6, gc); rectF(43, ey - 1, 2, 2, gc);
    lineF(32, ey - 1, 35, ey + 2, ghi); lineF(47, ey - 1, 50, ey + 2, ghi);
    if (o.glow) { glow(37, ey + 1, 10, gc, .45); glow(51, ey + 1, 10, gc, .45); }
  }
  if (o.extra) o.extra(sk, cl, hc);
}
function buildPortraits() {
  const P_ = (id, fn) => { PORT[id] = offscreen(PW2, PH2, fn); };
  P_('CARL', () => {
    bgPort('#0a282c', '#02060a');
    const sk = shadeTones('#5ac8a8'), coat = shadeTones('#1c2030');
    // High popped trenchcoat collar & shoulders (matching port_CARL.png!)
    polyF([[16, 86], [20, 56], [32, 64], [56, 64], [68, 56], [72, 86]], coat[1]);
    polyF([[2, PH2], [12, 82], [30, 76], [58, 76], [76, 82], [86, PH2]], coat[2]);
    polyF([[2, PH2], [12, 82], [28, 76], [24, PH2]], coat[3]);
    polyF([[60, 76], [76, 82], [86, PH2], [62, PH2]], coat[0]);
    polyF([[30, 78], [44, 104], [58, 78]], hex('#12141e'));
    // Iconic yellow bowtie
    polyF([[31, 80], [43, 85], [31, 91]], hex('#f0d020'));
    polyF([[57, 80], [45, 85], [57, 91]], hex('#f0d020'));
    rectF(42, 83, 4, 5, hex('#b88810')); rectF(32, 81, 5, 2, hex('#fff070'));
    // Neck & big sculpted teal-green alien head
    rectF(38, 66, 12, 14, sk[1]);
    paintHead(44, 44, 31, 28, sk);
    // Side-rear cap visor peeking out on right behind ear (like port_CARL.png)
    polyF([[72, 30], [85, 34], [84, 44], [70, 42]], hex('#121420'));
    lineF(72, 30, 84, 34, hex('#343e58'));
    // Large expressive emerald alien eyes with dark pupils & white catchlights
    for (const sx of [-1, 1]) {
      const ex = 44 + sx * 13;
      paintHead(ex, 47, 9.5, 8.5, [hex('#08381c'), hex('#169448'), hex('#32dc6c'), hex('#88ffaa')]);
      paintHead(ex + sx * 1, 47, 4.5, 4.5, [INK, INK, hex('#081810'), hex('#143020')]);
      rectF(ex - 4, 43, 3, 3, WHITE); pset(ex + 2, 50, hex('#90ffc0'));
      // Brow ridge
      lineF(ex - 8, 37 + (sx < 0 ? 0 : 2), ex + 8, 37 + (sx < 0 ? 2 : 0), sk[0], 2);
    }
    // Nose & subtle smirk
    pset(43, 55, sk[0]); pset(46, 55, sk[0]);
    lineF(38, 63, 49, 62, sk[0]);
    // Backwards black baseball cap with forehead snapback arch cutout!
    const cp = [hex('#0c0e16'), hex('#161a28'), hex('#242a3e'), hex('#38425e')];
    for (let y = 8; y < 31; y++) for (let x = 12; x < 77; x++) {
      const dx = (x - 44) / 32, dy = (y - 29) / 20;
      if (dx * dx + dy * dy <= 1) {
        pset(x, y, dx < -0.25 && dy < -0.3 ? cp[3] : dx > 0.35 ? cp[0] : cp[2]);
      }
    }
    rectF(13, 29, 63, 3, cp[0]);
    // Semi-circular forehead cutout & snapback strap across bottom
    paintHead(44, 28, 9, 6.5, [sk[1], sk[2], sk[3], sk[3]]);
    rectF(34, 29, 20, 3, cp[1]); rectF(41, 29, 6, 3, cp[2]);
  });
  P_('YOKO', () => bust({ skin: '#f0c8a8', hair: '#8a4a2a', hs: 'long', cloth: '#8a90d0', lips: '#c06060', bg0: '#2a2a4a', bg1: '#0a0a18', extra: () => { rectF(36, 66, 16, 6, hex('#8a90d0')); pset(44, 74, hex('#d8c040')); } }));
  P_('YOKOID', () => bust({ skin: '#f0d8d0', hair: '#8a4a2a', hs: 'long', cloth: '#e8e8f0', lips: '#c06060', bg0: '#2a3a4a', bg1: '#0a0a18', extra: () => { rectF(30, 56, 28, 1, hex('#60c0ff')); text('YK-7', 30, 96, hex('#60c0ff'), 0); } }));
  P_('PILOTX', () => bust({ skin: '#a87050', hair: '#14101a', hs: 'spiky', cloth: '#a8d8d0', collar: '#3a3448', glasses: '#e0ff40', glow: 1, bg0: '#2a1a4a', bg1: '#08040c', extra: () => { rectF(24, 28, 40, 4, hex('#c02020')); text('X', 41, 50, hex('#e0c890'), 0); } }));
  const faceScreen = (eye, col2, label) => () => { bgPort('#100818', '#000000'); polyF([[10, 100], [24, 20], [44, 6], [64, 20], [78, 100]], hex('#0a0810')); polyF([[24, 20], [44, 6], [36, 30]], hex('#1a1424')); for (const sx of [-1, 1]) { const ex = 44 + sx * 14; ellF(ex, 46, 11, 6, hex(eye)); ellF(ex, 46, 9, 4.5, hex('#05050a')); for (let k = -7; k < 8; k++) pset(ex + k, 46 + Math.sin(k * 1.7) * 2.5, hex(col2)); } text('え', 41, 58, hex(eye), 0); rectF(38, 60, 3, 4, hex(eye)); rectF(36, 74, 16, 2, hex(col2)); if (label) text(label, 4, 100, hex(eye), 0); for (let y = 0; y < PH2; y += 2) rectA(0, y, PW2, 1, BLACK, .3); };
  P_('FACE', faceScreen('#ff40ff', '#40ff60'));
  P_('OLDFACE', faceScreen('#ff40ff', '#40ff60', 'NO SIGNAL?'));
  P_('DYSLEXIO', () => { faceScreen('#ff40ff', '#40ff60')(); polyF([[14, 30], [44, 2], [74, 30], [70, 40], [44, 16], [18, 40]], hex('#a02040')); polyF([[18, 40], [24, 44], [24, 78], [16, 80]], hex('#8a1a34')); polyF([[70, 40], [64, 44], [64, 78], [72, 80]], hex('#8a1a34')); rectF(40, 4, 8, 6, hex('#c03050')); });
  P_('HELIOS', () => { bgPort('#3a3010', '#000000'); for (let k = 0; k < 24; k++) { const a = k / 24 * 6.28; lineF(44, 50, 44 + Math.cos(a) * 60, 50 + Math.sin(a) * 60, hex(k & 1 ? '#5a4810' : '#806820')); } glow(44, 50, 40, hex('#fff080'), .8); bust({ skin: '#f8e8c8', hair: '#c88a50', hs: 'long', cloth: '#fff0c0', lips: '#c06060', bg0: '#00000000', bg1: '#00000000', extra: () => {} }); });
  P_('LINDA', () => bust({ skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', cloth: '#18141c', collar: '#18141c', tie: '#ff70b0', lips: '#3a1020', bg0: '#3a1028', bg1: '#08040a', extra: () => { for (let x = 12; x < 80; x += 6) lineF(x, 82, x - 2, PH2, hex('#3a2a40')); rectF(29, 38, 10, 2, hex('#ff70b0')); rectF(49, 38, 10, 2, hex('#ff70b0')); } }));
  P_('IDOL', () => bust({ skin: '#f4dcc8', hair: '#ff90c8', hs: 'long', cloth: '#ffe0f0', tie: '#ff40a0', lips: '#e04080', bg0: '#ff70b0', bg1: '#3a1028', extra: () => { blob(64, 16, 8, 6, shadeTones('#ff40a0')); for (let i = 0; i < 12; i++) pset(hash(i, 3) * PW2, hash(i, 4) * 60, WHITE); } }));
  P_('GHOST', () => { bgPort('#3a0a1a', '#08000a'); blob(44, 46, 34, 32, [hex('#7a7aa8'), hex('#c0c0e8'), hex('#f0f0ff'), WHITE]); rectF(10, 46, 69, 62, hex('#e8e8f8')); for (let x = 10; x < 80; x += 10) ellF(x + 5, 104, 6, 5, hex('#e8e8f8')); ellF(32, 40, 6, 9, INK); ellF(56, 40, 6, 9, INK); polyF([[26, 58], [62, 58], [54, 72], [34, 72]], INK); rectF(36, 58, 4, 4, WHITE); rectF(48, 58, 4, 4, WHITE); polyF([[30, 84], [44, 90], [30, 96]], INK); polyF([[58, 84], [44, 90], [58, 96]], INK); glow(44, 50, 40, hex('#ff3060'), .25); });
  P_('JB', () => { bgPort('#3a1a3a', '#08040c'); const fur = shadeTones('#f09030'), coat = shadeTones('#b8a888'); polyF([[0, PH2], [8, 80], [30, 74], [58, 74], [80, 80], [88, PH2]], coat[2]); polyF([[34, 76], [44, 100], [54, 76]], hex('#d8d8d8')); polyF([[42, 80], [46, 80], [46, 100], [42, 100]], INK);
    blob(44, 50, 30, 26, fur); ellF(44, 60, 16, 10, hex('#f8f0e0')); ellF(36, 46, 9, 6, hex('#f8f0e0')); ellF(52, 46, 9, 6, hex('#f8f0e0')); rectF(29, 42, 14, 5, hex('#1a1a20')); rectF(45, 42, 14, 5, hex('#1a1a20')); rectF(33, 46, 3, 2, INK); rectF(51, 46, 3, 2, INK); ellF(44, 56, 3, 2, INK); lineF(40, 64, 44, 62, INK); lineF(44, 62, 48, 64, INK);
    const h = shadeTones('#a8a090'); ellF(44, 26, 40, 7, h[1]); blob(44, 18, 22, 12, h); rectF(22, 22, 44, 4, hex('#1a1a1a')); });
  P_('HUMAN', () => bust({ skin: '#e8c0a0', hair: '#7a5a30', hs: 'short', cloth: '#e0d8c0', collar: '#f0e8d0', bg0: '#5a6a7a', bg1: '#2a3440', extra: (sk) => { rectF(38, 54, 12, 2, hex('#a06050')); rectF(37, 53, 1, 1, hex('#a06050')); rectF(50, 53, 1, 1, hex('#a06050')); text('BATCH 5', 22, 96, hex('#5a5040'), 0); } }));
  P_('ROBOCOP', () => { bust({ skin: '#a8b0c0', noFace: 1, cloth: '#2a3a6a', collar: '#1a2a5a', bg0: '#1a2a4a', bg1: '#05080c', extra: () => { blob(44, 36, 18, 18, shadeTones('#c8d0dc')); rectF(28, 36, 32, 6, hex('#1a0808')); rectF(30, 38, 28, 2, hex('#ff3030')); glow(44, 39, 14, hex('#ff3030'), .4); rectF(38, 84, 12, 6, hex('#d8c040')); text('MALL', 32, 96, hex('#d8c040'), 0); } }); });
  P_('TAKAHASHI', () => bust({ skin: '#e8c0a0', hair: '#f0e080', hs: 'spiky', cloth: '#30b0a0', glasses: '#101010', bg0: '#4a1a4a', bg1: '#0a040c', extra: () => { for (let i = 0; i < 6; i++) blob(18 + i * 11, 90 + (i % 2) * 8, 3, 2, shadeTones('#ff70b0')); rectF(22, 34, 2, 14, hex('#3a3a3a')); rectF(22, 48, 8, 3, hex('#3a3a3a')); rectF(54, 54, 8, 1, hex('#a06050')); } }));
  P_('DOC', () => bust({ skin: '#e0c0a8', hair: '#d8d8d8', hs: 'bald', cloth: '#f0f0f4', collar: '#d0d0d8', tie: '#3a6a3a', glasses: '#8a8a8a', bg0: '#2a3a2a', bg1: '#080c08', extra: () => { rectF(24, 30, 6, 10, hex('#d8d8d8')); rectF(58, 30, 6, 10, hex('#d8d8d8')); text('Rx', 16, 90, hex('#3a6a3a'), 0); } }));
  P_('DAMM', () => bust({ skin: '#c89070', hair: '#5a4a3a', hs: 'short', cloth: '#d07020', collar: '#a05010', glasses: '#202020', bg0: '#3a4a5a', bg1: '#0a0c10', extra: () => { blob(44, 22, 22, 9, shadeTones('#f0d020')); rectF(20, 26, 48, 3, hex('#c0a010')); } }));
  P_('PEEKID', () => bust({ skin: '#f0c8a8', hair: '#2a1a14', hs: 'short', cloth: '#f0f0f0', collar: '#587098', tie: '#a07040', bg0: '#5a5020', bg1: '#1a1408', hw: 15, hh: 18, ey: 44 }));
  P_('WHITE', () => bust({ skin: '#e0d0c8', hair: '#f0f0f0', hs: 'short', cloth: '#f8f8ff', collar: '#ffffff', tie: '#ffffff', glasses: '#0a0a0a', bg0: '#d0d0d8', bg1: '#6a6a78' }));
  P_('QM', () => bust({ skin: '#a87050', hs: 'bald', cloth: '#4a5a3a', collar: '#3a4a2a', bg0: '#3a3a2a', bg1: '#0a0a08', hw: 19, extra: () => { rectF(30, 56, 28, 3, hex('#3a2a1a')); } }));
  P_('_', () => bust({}));
  const gen = (id, spec, bg) => P_(id, () => bust({ skin: spec.skin, hair: spec.hair, hs: spec.hs === 'pony' ? 'up' : spec.hs, cloth: spec.coat || spec.top, collar: spec.top, tie: spec.tie, glasses: spec.glasses, lips: spec.lips, bg0: bg[0], bg1: bg[1], extra: spec.helmet ? () => { blob(44, 34, 21, 18, shadeTones(spec.helmet)); if (spec.visor) rectF(26, 38, 36, 6, hex(spec.visor)); } : spec.mask ? () => rectF(26, 46, 36, 18, hex(spec.mask)) : null }));
  for (const [id, bg] of [['fatco', ['#1a2a4a', '#05080c']], ['fatcoagent', ['#1a2a4a', '#05080c']], ['ppf', ['#4a2a1a', '#0c0604']], ['ppf2', ['#2a4a2a', '#040c04']], ['mj', ['#2a0a0a', '#000000']], ['miws', ['#c8c8d0', '#5a5a68']], ['cop', ['#1a1a4a', '#04040c']], ['thug', ['#3a2a1a', '#0a0604']], ['redchat', ['#5a0a0a', '#0c0000']], ['lurker', ['#0a2a10', '#000400']], ['gatebox', ['#ff70b0', '#2a0a1a']], ['casino', ['#5a0a14', '#0c0004']], ['tunnel', ['#3a3a2a', '#0a0a06']], ['civ1', ['#2a3a5a', '#0a0c14']], ['civ2', ['#4a2a3a', '#0c060a']], ['civ3', ['#3a3a3a', '#0a0a0a']], ['civ4', ['#3a4a5a', '#0a0c10']], ['civ5', ['#4a3a2a', '#0c0a06']], ['civ6', ['#2a4a3a', '#060c0a']], ['bartender', ['#3a2a1a', '#0a0604']], ['drdamm', ['#3a4a5a', '#0a0c10']]])
    if (SPEC[id] && !PORT[id]) gen(id, SPEC[id], bg);
}
