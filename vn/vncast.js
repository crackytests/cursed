'use strict';
// ================= VISITOR: THE NORMALCY: the cast (sprites, true forms, speakers, portraits) =================
const SPEC = {
  carl: { kind: 'carl', skin: '#5ac8a8', hat: '#1c1c2a', hatBack: 1, coat: '#2a1a24', coatLen: .9, top: '#2a2a34', legs: '#1a1a22', shoes: '#0a0a10', bowtie: '#f0d020', hs: 'bald' },
  // humans
  civ1: { skin: '#e0b090', hair: '#5a3a1a', hs: 'short', top: '#4a6a9a', legs: '#2a2a3a' },
  civ2: { skin: '#a87050', hair: '#1a1410', hs: 'long', top: '#c06080', legs: '#2a2a3a', kind: 'woman', skirt: '#3a2a4a' },
  civ3: { skin: '#c8a090', hair: '#8a8a8a', hs: 'short', top: '#6a6a5a', legs: '#4a4a3a', coat: '#5a5a4a', coatLen: .6 },
  civ4: { skin: '#f0d0b8', hair: '#d8b060', hs: 'pony', top: '#e0e0d0', legs: '#4a5a8a', kind: 'woman' },
  civ5: { skin: '#8a5a3a', hair: '#1a1410', hs: 'bald', top: '#d07020', legs: '#3a3a3a' },
  civ6: { skin: '#e0b8a0', hair: '#2a1a10', hs: 'short', top: '#2a5a3a', legs: '#5a4a3a', glasses: '#202020' },
  civ7: { skin: '#f0c8b0', hair: '#1a1a1a', hs: 'long', top: '#202028', legs: '#202028', kind: 'woman', lips: '#c02040', skirt: '#a01830' },
  civ8: { skin: '#c89070', hair: '#e0d0a0', hs: 'spiky', top: '#40a0c0', legs: '#c0b080' },
  surfer: { skin: '#d8a070', hair: '#f0e090', hs: 'long', top: '#f08040', legs: '#3080c0' },
  patient: { skin: '#e0c8b8', hair: '#6a5a4a', hs: 'short', top: '#c8d8e0', legs: '#c8d8e0' },
  cop: { skin: '#c89070', hair: '#1a1410', hs: 'short', top: '#1a2a5a', legs: '#1a2448', hat: '#1a2a5a', hatBand: '#d8c040', belt: '#101010' },
  thug: { skin: '#a87050', hair: '#1a1410', hs: 'bald', top: '#d8d8d0', legs: '#2a3a5a', hat: '#a02020' },
  thug2: { skin: '#e0b090', hair: '#c8a040', hs: 'spiky', top: '#3a3a3a', legs: '#2a2a3a', coat: '#4a3a2a', coatLen: .4 },
  miws: { skin: '#e8dcd8', hair: '#e8e8f0', hs: 'short', top: '#ececf4', legs: '#e0e0e8', shoes: '#f0f0f8', tie: '#e8e8f0', glasses: '#101010', hat: '#f4f4fa' },
  humanunit: { skin: '#e8c0a0', hair: '#7a5a30', hs: 'short', top: '#e0d8c0', legs: '#b8a070', shoes: '#5a3a1a', belt: '#5a3a1a' },
  // visitors in their human suits
  suit: { skin: '#d8b8a0', hair: '#1a1a1a', hs: 'short', top: '#14141a', legs: '#14141a', tie: '#3a8a5a', glasses: '#0a0a0a' },
  // named
  pilotx: { skin: '#a87050', hair: '#14101a', hs: 'spiky', top: '#3a3448', legs: '#2a2438', coat: '#a8d8d0', coatLen: .7, glasses: '#e0ff40', extra: (cx, hy, d) => { if (d !== 1) rectF(cx - 4, hy - 3, 8, 1, hex('#c02020')); } },
  linda: { kind: 'woman', skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', top: '#18141c', legs: '#18141c', tie: '#ff70b0', lips: '#3a1020', skirt: '#18141c' },
  therese: { kind: 'woman', skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', top: '#2a2a3a', legs: '#2a2a3a', tie: '#c0c0d0', lips: '#5a2030', skirt: '#2a2a3a', glasses: '#303040' },
  jeanette: { kind: 'woman', skin: '#f4dcc8', hair: '#ff70b0', hs: 'pony', top: '#ff2a6a', legs: '#101010', lips: '#ff2050', skirt: '#101010' },
  jb: { skin: '#f09030', hair: '#f09030', hs: 'bald', hat: '#a8a090', hatBand: '#1a1a1a', coat: '#b8a888', coatLen: .85, top: '#d8d8d8', legs: '#3a3a3a', tie: '#1a1a1a', kind: 'big', extra: (cx, hy, d) => { if (d === 0) { rectF(cx - 2, hy + 1, 4, 1, hex('#f8f0e0')); } } },
  mrwhite: { skin: '#e0d0c8', hair: '#f0f0f0', hs: 'short', top: '#f8f8ff', legs: '#f0f0f8', shoes: '#ffffff', tie: '#ffffff', glasses: '#0a0a0a', coat: '#f4f4fc', coatLen: .5 },
  roscoe: { skin: '#e0b090', hair: '#1a1a1a', hs: 'up', top: '#f0f0f0', legs: '#2a3a6a', coat: '#1a1a1a', coatLen: .35, belt: '#c0c0c0' },
  tommy: { skin: '#e8c0a0', hair: '#c8a060', hs: 'spiky', top: '#6a8a5a', legs: '#4a4a5a', coat: '#7a6a5a', coatLen: .5 },
  kwan: { skin: '#e8c8a8', hair: '#2a2a2a', hs: 'short', top: '#f0f0f4', legs: '#3a3a4a', coat: '#f0f0f4', coatLen: .7, glasses: '#3a3a3a' },
  bartender: { skin: '#e0b090', hair: '#3a2a1a', hs: 'short', top: '#f0f0f0', legs: '#1a1a1a', vest: '#1a1a1a', bowtie: '#a02020' },
  yoko: { kind: 'woman', skin: '#f0c8a8', hair: '#8a4a2a', hs: 'long', top: '#a02030', legs: '#a02030', lips: '#c06060', skirt: '#701020', belt: '#e0b040' },
  yokoid: { kind: 'woman', skin: '#f0d8d0', hair: '#8a4a2a', hs: 'long', top: '#1a1a24', legs: '#1a1a24', lips: '#c06060', belt: '#60c0ff' },
  clerk: { skin: '#b0b8c8', headR: 4.6, top: '#e8e8f0', legs: '#c0c0c8', coat: '#f0f0f4', coatLen: .7, extra: (cx, hy, d) => greyEyes(cx, hy, d) },
  // true forms (drawn when Carl has a sight gift on, or in visitor places)
  v_grey: { skin: '#b0b8c8', headR: 4.8, top: '#9aa0b0', legs: '#9aa0b0', shoes: '#9aa0b0', extra: (cx, hy, d) => greyEyes(cx, hy, d) },
  v_nordic: { kind: 'big', skin: '#f8f0f0', hair: '#f8f0c0', hs: 'long', top: '#f0f0ff', legs: '#e0e0f0', coat: '#f4f4ff', coatLen: 1, shoes: '#e0e0f0', extra: (cx, hy, d) => { if (d === 0) { pset(cx - 1.5, hy, hex('#40a0ff')); pset(cx + 1.5, hy, hex('#40a0ff')); } } },
  v_reptilian: { skin: '#5a9a50', top: '#14141a', legs: '#14141a', tie: '#c0a030', extra: (cx, hy, d) => { for (let k = 0; k < 6; k++) pset(cx - 3 + hash(k, 3, 1) * 6, hy - 2 + hash(k, 4, 1) * 4, hex('#3a6a30')); if (d === 0) { rectF(cx - 2, hy, 1, 1, hex('#f0e040')); rectF(cx + 1, hy, 1, 1, hex('#f0e040')); } } },
  v_martian: { kind: 'kid', skin: '#80ff40', headR: 4.2, top: '#c0c0d0', legs: '#c0c0d0', belt: '#e04040', extra: (cx, hy, d) => { lineF(cx - 2, hy - 4, cx - 4, hy - 8, hex('#80ff40')); lineF(cx + 2, hy - 4, cx + 4, hy - 8, hex('#80ff40')); pset(cx - 4, hy - 9, hex('#ff4040')); pset(cx + 4, hy - 9, hex('#ff4040')); if (d === 0) { blob(cx - 1.8, hy, 1.4, 1.2, [INK, INK, hex('#202020'), hex('#404040')]); blob(cx + 1.8, hy, 1.4, 1.2, [INK, INK, hex('#202020'), hex('#404040')]); } } },
  v_cryptid: { kind: 'big', skin: '#3a2a2a', top: '#3a2a2a', legs: '#2a1a1a', coat: '#4a3030', coatLen: 1.1, extra: (cx, hy, d) => { if (d !== 1) { rectF(cx - 3, hy - 1, 2, 2, hex('#ff2020')); rectF(cx + 1, hy - 1, 2, 2, hex('#ff2020')); } polyF([[cx - 5, hy + 3], [cx - 10, hy + 1], [cx - 9, hy + 12], [cx - 5, hy + 9]], hex('#2a1a1a')); polyF([[cx + 5, hy + 3], [cx + 10, hy + 1], [cx + 9, hy + 12], [cx + 5, hy + 9]], hex('#2a1a1a')); } },
  v_broadcast: { skin: '#d8d8e0', top: '#a0a0b0', legs: '#808090', extra: (cx, hy, d) => { for (let k = 0; k < 30; k++) pset(cx - 5 + hash(k, 7, 2) * 10, hy - 4 + hash(k, 8, 2) * 24, hash(k, 9, 2) > .5 ? WHITE : hex('#404050')); } },
  v_pod: { skin: '#90b040', hs: 'bald', top: '#6a8a30', legs: '#5a7a20', extra: (cx, hy, d) => { lineF(cx, hy - 4, cx, hy + 3, hex('#3a5a10')); if (d === 0) { pset(cx - 1.5, hy, hex('#f0f080')); pset(cx + 1.5, hy, hex('#f0f080')); } } },
  v_invader: { skin: '#6a5a8a', top: '#2a1a3a', legs: '#2a1a3a', helmet: '#4a2a6a', visor: '#ff3060', gloves: 1 },
  invader: { skin: '#6a5a8a', top: '#2a1a3a', legs: '#2a1a3a', helmet: '#4a2a6a', visor: '#ff3060', gloves: 1, belt: '#ff3060' },
  husk: { kind: 'big', skin: '#8a7a6a', hs: 'bald', top: '#5a4a3a', legs: '#4a3a2a', extra: (cx, hy, d) => { for (let k = 0; k < 5; k++) pset(cx - 3 + hash(k, 2, 9) * 6, hy - 2 + hash(k, 5, 9) * 5, hex('#3a2a1a')); if (d === 0) { pset(cx - 1.5, hy, hex('#ff6020')); pset(cx + 1.5, hy, hex('#ff6020')); } } },
  returnee: { skin: '#c0c8b0', hair: '#5a5a4a', hs: 'short', top: '#a0b0c0', legs: '#a0b0c0', extra: (cx, hy, d) => { if (d === 0) { pset(cx - 1.5, hy, hex('#a0ffa0')); pset(cx + 1.5, hy, hex('#a0ffa0')); } } },
};
function greyEyes(cx, hy, d) { if (d === 1) return; if (d === 2) { blob(cx + 2.4, hy + .6, 1.6, 2, [INK, INK, hex('#101018'), hex('#3a3a50')]); return; } for (const sx of [-1, 1]) blob(cx + sx * 2.2, hy + .6, 1.8, 2.2, [INK, INK, hex('#101018'), hex('#3a3a50')]); }
function buildPeople() {
  for (const k in SPEC) personSprites(k, SPEC[k]);
  for (const k of ['grey', 'nordic', 'reptilian', 'martian', 'cryptid', 'broadcast', 'pod', 'invader']) SPRITES['v_' + k] = SPRITES['v_' + k];
  SPRITES.v_husk = SPRITES.husk;
  // SPOOKY GHOST: a sheet with a grin, floating
  animSprites('ghost', (d, f) => { const bob = Math.sin(f * 1.5) * 1.2; blob(10, 12 + bob, 8, 7, [hex('#8a8ab0'), hex('#c8c8e8'), hex('#f0f0ff'), WHITE]); rectF(2, 12 + bob, 17, 12, hex('#e8e8f8')); for (let x = 2; x < 19; x += 4) ellF(x + 2, 24 + bob + (x + f) % 2, 2, 2, hex('#e8e8f8')); if (d !== 1) { ellF(7, 11 + bob, 1.6, 2.2, INK); ellF(13, 11 + bob, 1.6, 2.2, INK); rectF(7, 16 + bob, 7, 1, INK); pset(8, 17 + bob, WHITE); pset(12, 17 + bob, WHITE); rectF(8, 19 + bob, 5, 1, INK); } }, 22, 30);
  SPRITES.ghost.fly = 1;
  // the Ocean House ghosts: a pale woman who is not quite there
  animSprites('haunt', (d, f) => { const bob = Math.sin(f * 1.5); for (let y = 0; y < 26; y++) for (let x = 0; x < 16; x++) { const dx = (x - 8) / (y < 8 ? 4 : 5 + y * .1), dy = y < 8 ? (y - 4) / 4 : 0; if (y < 8 ? dx * dx + dy * dy <= 1 : Math.abs(x - 8) < 3 + y * .18) if ((x + y + f) % 2 === 0 || y < 8) pset(x + 2, y + 2 + bob, y < 8 ? hex('#e8f0ff') : hex('#a0b8d8')); } if (d !== 1) { rectF(7, 6 + bob, 2, 2, INK); rectF(11, 6 + bob, 2, 2, INK); } for (let y = 3; y < 18; y++) pset(5 + (y % 3), y + bob, hex('#20283a')); }, 20, 30);
  SPRITES.haunt.fly = 1;
  // THE FLATWOODS: the spade-headed giant from the 1952 sighting
  animSprites('flatwoods', (d, f) => { const s = f & 1; polyF([[6, 24], [42, 24], [36, 58], [12, 58]], hex('#2a5a3a')); for (let y = 28; y < 58; y += 4) rectF(10, y, 28, 1, hex('#1a3a2a')); polyF([[24, 0], [40, 14], [34, 26], [14, 26], [8, 14]], hex('#5a1a2a')); ellF(24, 18, 7, 6, hex('#101010')); if (d !== 1) { ellF(21, 17, 1.6, 1.6, hex('#ff8020')); ellF(27, 17, 1.6, 1.6, hex('#ff8020')); } lineF(6, 30, 0, 44 + s, hex('#2a5a3a')); lineF(42, 30, 48, 44 - s, hex('#2a5a3a')); rectF(14, 58, 6, 2, INK); rectF(28, 58, 6, 2, INK); }, 50, 62);
  // CHUPACABRA: low, spined
  animSprites('chupa', (d, f) => { const s = f & 1; blob(11, 9, 8, 4, shadeTones('#5a5a4a')); for (let x = 5; x < 17; x += 2) pset(x, 4 + (x % 4 === 1 ? 0 : 1), hex('#2a2a1a')); blob(18, 7, 3, 2.4, shadeTones('#6a6a5a')); pset(20, 6, hex('#ff2020')); rectF(6 + s, 12, 1, 3, hex('#3a3a2a')); rectF(14 - s, 12, 1, 3, hex('#3a3a2a')); }, 24, 16);
  // screens and props for people who live on monitors
  prop('facescreen', 2, 1, 46, 40, () => { rectF(0, 0, 46, 34, hex('#14141c')); rectF(2, 2, 42, 28, hex('#05050a')); rectF(14, 34, 18, 6, hex('#2a2a34')); }, { light: [4, .8, '#c060ff'], comp: 0 });
  prop('dyslexio', 2, 1, 46, 40, () => { rectF(0, 0, 46, 34, hex('#2a1420')); rectF(2, 2, 42, 28, hex('#05050a')); rectF(14, 34, 18, 6, hex('#3a1a2a')); polyF([[6, 2], [23, -2], [40, 2], [38, 8], [23, 3], [8, 8]], hex('#a02040')); }, { light: [5, .9, '#ff4080'], comp: 0 });
  prop('pod', 2, 1, 46, 26, () => { ellF(23, 16, 22, 10, hex('#5a6270')); ellF(23, 14, 20, 8, hex('#8a92a0')); rectF(6, 13, 34, 1, hex('#c8d0dc')); ellF(23, 12, 8, 4, hex('#203040')); for (let x = 8; x < 40; x += 8) pset(x, 17, hex('#60ff90')); text('NV', 18, 16, hex('#3a4250'), 0); }, { low: 1, light: [3, .5, '#60ff90'] });
  prop('radio', 1, 1, 18, 14, () => { rectF(1, 3, 16, 10, hex('#5a3a2a')); rectF(3, 5, 7, 6, hex('#2a1a10')); for (let y = 6; y < 11; y += 2) rectF(3, y, 7, 1, hex('#8a6a4a')); rectF(12, 5, 3, 3, hex('#d8c040')); lineF(14, 3, 17, 0, hex('#a0a0a0')); }, { solid: 0, read: 1 });
}
// ---------- speakers ----------
defSpeaker('CARL', { name: 'CARL', col: hex('#60e0b0'), voice: [520, 120] });
defSpeaker('N', { name: '', col: hex('#a8e8ff') });
defSpeaker('PILOTX', { name: 'PILOT X', col: hex('#e0ff40'), voice: [300, 30] });
defSpeaker('FACE', { name: 'DIRECTOR FACE', col: hex('#ff40ff'), voice: [240, 60], screen: 1 });
defSpeaker('OLDFACE', { name: 'OLD FACE', col: hex('#40ff80'), voice: [200, 80], screen: 1 });
defSpeaker('DYSLEXIO', { name: 'DYSLEXIO', col: hex('#ff4080'), voice: [180, 40], screen: 1 });
defSpeaker('LINDA', { name: 'COMMISSIONER LINDA', col: hex('#ff70b0'), voice: [700, 20] });
defSpeaker('THERESE', { name: 'THERESE LINDA', col: hex('#c0c0ff'), voice: [640, 10], port: 'THERESE' });
defSpeaker('JEANETTE', { name: 'JEANETTE LINDA', col: hex('#ff4080'), voice: [820, 90], port: 'JEANETTE' });
defSpeaker('GHOST', { name: 'SPOOKY GHOST', col: hex('#e0e0ff'), voice: [420, 90] });
defSpeaker('JB', { name: 'JB GARFIELD', col: hex('#ffa040'), voice: [220, 20] });
defSpeaker('HUMAN', { name: 'HU-MAN', col: hex('#e0d8c0'), voice: [400, 0] });
defSpeaker('WHITE', { name: 'MR. WHITE', col: hex('#ffffff'), voice: [260, 10] });
defSpeaker('ROSCOE', { name: 'ROSCOE NINE-PLANETS', col: hex('#80ff40'), voice: [460, 140] });
defSpeaker('TOMMY', { name: 'TOMMY TWO-PILLS', col: hex('#e0c060'), voice: [600, 110] });
defSpeaker('GUS', { name: 'GUS THE MOTHMAN', col: hex('#ff6060'), voice: [180, 160] });
defSpeaker('YOKO', { name: 'EMPRESS YOKO', col: hex('#ff8080'), voice: [880, 30] });
defSpeaker('YOKOID', { name: 'YOKOID', col: hex('#c0d8ff'), voice: [950, 10] });
defSpeaker('DEB', { name: 'DEB (DEEP NIGHT)', col: hex('#ff70b0'), voice: [560, 60] });
defSpeaker('KWAN', { name: 'DR. KWAN', col: hex('#f0f0f0'), voice: [420, 40] });
defSpeaker('CLERK', { name: 'INTAKE CLERK', col: hex('#b0c0e0'), voice: [300, 0] });
defSpeaker('BARTENDER', { name: 'BARTENDER', col: hex('#d0b080'), voice: [350, 40], port: 'bartender' });

// ---------- portraits (procedural; tools/vngen.js + vnpack.py replace them with painted ones in vn/img) ----------
const PW2 = 88, PH2 = 108;
function bgPort(top, bot) { gradV(0, 0, PW2, PH2, hex(top), hex(bot), 10); for (let y = 0; y < PH2; y += 3) rectA(0, y, PW2, 1, BLACK, .18); }
function bust(o) {
  bgPort(o.bg0 || '#1a2440', o.bg1 || '#05070c');
  const sk = shadeTones(o.skin || '#e0b090'), cl = shadeTones(o.cloth || '#3a4a6a'), hc = o.hair ? shadeTones(o.hair) : null;
  polyF([[4, PH2], [10, 78], [30, 70], [58, 70], [78, 78], [84, PH2]], cl[2]); polyF([[60, 72], [78, 78], [84, PH2], [62, PH2]], cl[1]); polyF([[4, PH2], [10, 78], [26, 72], [24, PH2]], cl[3]);
  if (o.collar) { polyF([[30, 70], [44, 90], [58, 70], [52, 68], [44, 80], [36, 68]], hex(o.collar)); }
  if (o.tie) polyF([[42, 76], [46, 76], [48, 100], [44, 106], [40, 100]], hex(o.tie));
  rectF(37, 56, 14, 16, sk[1]); blob(44, 40, o.hw || 17, o.hh || 22, sk, { light: [-.5, -.5, .7] });
  if (hc && o.hs !== 'bald') { if (o.hs === 'long' || o.hs === 'up') { blob(44, 30, 20, 16, hc); rectF(25, 30, 8, o.hs === 'long' ? 40 : 18, hc[1]); rectF(55, 30, 8, o.hs === 'long' ? 40 : 18, hc[1]); if (o.hs === 'up') blob(58, 14, 12, 10, hc); }
    else if (o.hs === 'spiky') { blob(44, 26, 21, 14, hc); for (let i = 0; i < 9; i++) polyF([[22 + i * 5, 26], [26 + i * 5, 4 + (i % 2) * 6], [30 + i * 5, 26]], hc[(i % 2) + 1]); }
    else blob(44, 26, 18.5, 12, hc);
    rectF(27, 24, 34, 6, hc[2]); }
  const ey = o.ey || 42; if (!o.noFace) { rectF(34, ey, 6, 2, INK); rectF(48, ey, 6, 2, INK); pset(36, ey + 2, WHITE); pset(50, ey + 2, WHITE); rectF(33, ey - 4, 8, 1, hc ? hc[0] : sk[0]); rectF(47, ey - 4, 8, 1, hc ? hc[0] : sk[0]);
    rectF(43, ey + 6, 2, 4, sk[1]); rectF(39, ey + 13, 10, 1, o.lips ? hex(o.lips) : sk[0]); if (o.lips) rectF(40, ey + 14, 8, 1, shadeOf(hex(o.lips), .8)); }
  if (o.glasses) { rectF(31, ey - 2, 12, 6, hex(o.glasses)); rectF(45, ey - 2, 12, 6, hex(o.glasses)); rectF(43, ey, 2, 1, hex(o.glasses)); if (o.glow) { glow(37, ey + 1, 10, hex(o.glasses), .5); glow(51, ey + 1, 10, hex(o.glasses), .5); } }
  if (o.extra) o.extra(sk, cl, hc);
}
function buildPortraits() {
  const P_ = (id, fn) => { PORT[id] = offscreen(PW2, PH2, fn); };
  P_('CARL', () => { bgPort('#2a0a2a', '#020608'); const sk = shadeTones('#5ac8a8'), coat = shadeTones('#2a1a24');
    polyF([[2, PH2], [12, 84], [32, 78], [56, 78], [76, 84], [86, PH2]], coat[2]); polyF([[30, 80], [44, 104], [58, 80]], hex('#2a2a34'));
    polyF([[32, 80], [44, 86], [32, 92]], hex('#f0d020')); polyF([[56, 80], [44, 86], [56, 92]], hex('#f0d020')); rectF(42, 84, 4, 4, hex('#a08010'));
    rectF(38, 66, 12, 14, sk[1]); blob(44, 44, 32, 30, sk, { light: [-.5, -.5, .7] });
    for (const sx of [-1, 1]) { const ex = 44 + sx * 13; blob(ex, 48, 10, 9, [hex('#062a14'), hex('#128a40'), hex('#3ae070'), hex('#c0ffd0')]); blob(ex + 2, 49, 4, 4, [INK, INK, hex('#0a2010'), hex('#1a4020')]); pset(ex - 4, 44, WHITE); pset(ex - 3, 44, WHITE); }
    rectF(40, 64, 8, 1, sk[0]);
    const cp = shadeTones('#1c1c2a'); for (let y = 10; y < 28; y++) for (let x = 12; x < 77; x++) { const dx = (x - 44) / 33, dy = (y - 28) / 19; if (dx * dx + dy * dy <= 1) pset(x, y, (x + y) & 1 ? cp[2] : cp[1]); } rectF(36, 6, 16, 4, cp[0]); });
  P_('PILOTX', () => bust({ skin: '#a87050', hair: '#14101a', hs: 'spiky', cloth: '#a8d8d0', collar: '#3a3448', glasses: '#e0ff40', glow: 1, bg0: '#2a1a4a', bg1: '#08040c', extra: () => { rectF(24, 28, 40, 4, hex('#c02020')); } }));
  const faceScreen = (eye, col2, label) => () => { bgPort('#100818', '#000000'); polyF([[10, 100], [24, 20], [44, 6], [64, 20], [78, 100]], hex('#0a0810')); for (const sx of [-1, 1]) { const ex = 44 + sx * 14; for (let a = 0; a < 6.28; a += .1) pset(ex + Math.cos(a) * 9, 46 + Math.sin(a) * 5, hex(eye)); for (let k = -7; k <= 7; k++) pset(ex + k, 46 + Math.sin(k * 1.4) * 2, hex(col2)); } polyF([[44, 56], [40, 62], [48, 62]], hex(eye)); rectF(36, 72, 16, 2, hex(col2)); for (let y = 0; y < PH2; y += 2) rectA(0, y, PW2, 1, BLACK, .25); if (label) text(label, 20, 96, hex(col2), 0); };
  P_('FACE', faceScreen('#ff40ff', '#40ff60'));
  P_('OLDFACE', faceScreen('#ff40ff', '#40ff60', 'OLD SIGNAL'));
  P_('DYSLEXIO', () => { faceScreen('#ff40ff', '#40ff60')(); polyF([[14, 30], [44, 2], [74, 30], [70, 40], [44, 16], [18, 40]], hex('#a02040')); polyF([[18, 40], [24, 44], [24, 78], [16, 80]], hex('#8a1a34')); polyF([[70, 40], [64, 44], [64, 78], [72, 80]], hex('#8a1a34')); });
  P_('LINDA', () => bust({ skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', cloth: '#18141c', collar: '#18141c', tie: '#ff70b0', lips: '#3a1020', bg0: '#3a1028', bg1: '#08040a' }));
  P_('THERESE', () => bust({ skin: '#f4dcc8', hair: '#ff70b0', hs: 'up', cloth: '#2a2a3a', collar: '#e0e0f0', tie: '#c0c0d0', lips: '#5a2030', glasses: '#303040', bg0: '#20203a', bg1: '#06060c' }));
  P_('JEANETTE', () => bust({ skin: '#f4dcc8', hair: '#ff70b0', hs: 'long', cloth: '#ff2a6a', lips: '#ff2050', bg0: '#4a0a2a', bg1: '#0a0008' }));
  P_('GHOST', () => { bgPort('#3a0a1a', '#08000a'); blob(44, 46, 34, 32, [hex('#7a7aa8'), hex('#c0c0e8'), hex('#f0f0ff'), WHITE]); rectF(10, 46, 69, 62, hex('#e8e8f8')); for (let x = 10; x < 80; x += 10) ellF(x + 5, 104, 6, 5, hex('#e8e8f8')); ellF(32, 42, 6, 9, INK); ellF(56, 42, 6, 9, INK); rectF(30, 62, 28, 3, INK); polyF([[34, 72], [44, 76], [34, 80]], INK); polyF([[54, 72], [44, 76], [54, 80]], INK); });
  P_('JB', () => { bgPort('#3a1a3a', '#08040c'); const fur = shadeTones('#f09030'), coat = shadeTones('#b8a888'); polyF([[0, PH2], [8, 80], [30, 74], [58, 74], [80, 80], [88, PH2]], coat[2]); polyF([[34, 76], [44, 100], [54, 76]], hex('#d8d8d8')); polyF([[42, 80], [46, 80], [47, 100], [41, 100]], hex('#1a1a1a'));
    blob(44, 50, 30, 26, fur); ellF(44, 60, 16, 10, hex('#f8f0e0')); rectF(29, 42, 14, 5, hex('#1a1a20')); rectF(45, 42, 14, 5, hex('#1a1a20'));
    const h = shadeTones('#a8a090'); ellF(44, 26, 40, 7, h[1]); blob(44, 18, 22, 12, h); rectF(22, 22, 44, 4, hex('#1a1a1a')); });
  P_('HUMAN', () => bust({ skin: '#e8c0a0', hair: '#7a5a30', hs: 'short', cloth: '#e0d8c0', collar: '#f0e8d0', bg0: '#5a6a7a', bg1: '#2a3440' }));
  P_('WHITE', () => bust({ skin: '#e0d0c8', hair: '#f0f0f0', hs: 'short', cloth: '#f8f8ff', collar: '#ffffff', tie: '#ffffff', glasses: '#0a0a0a', bg0: '#d0d0d8', bg1: '#6a6a78' }));
  P_('ROSCOE', () => bust({ skin: '#80ff40', hair: '#1a1a1a', hs: 'up', cloth: '#1a1a1a', collar: '#f0f0f0', bg0: '#3a0a0a', bg1: '#0a0404', hw: 19, hh: 24, extra: () => { lineF(34, 22, 26, 2, hex('#80ff40')); lineF(54, 22, 62, 2, hex('#80ff40')); ellF(26, 2, 3, 3, hex('#ff4040')); ellF(62, 2, 3, 3, hex('#ff4040')); } }));
  P_('TOMMY', () => bust({ skin: '#e8c0a0', hair: '#c8a060', hs: 'spiky', cloth: '#7a6a5a', collar: '#6a8a5a', bg0: '#2a3a1a', bg1: '#080a04', extra: () => { for (let k = 0; k < 4; k++) ellF(20 + k * 14, 96, 3, 2, hex('#ff80c0')); } }));
  P_('GUS', () => { bgPort('#1a0a0a', '#000000'); blob(44, 56, 34, 40, shadeTones('#3a2a2a')); polyF([[4, 40], [24, 50], [20, 108], [0, 108]], hex('#2a1a1a')); polyF([[84, 40], [64, 50], [68, 108], [88, 108]], hex('#2a1a1a')); ellF(32, 44, 8, 6, hex('#ff2020')); ellF(56, 44, 8, 6, hex('#ff2020')); glow(32, 44, 14, hex('#ff2020'), .5); glow(56, 44, 14, hex('#ff2020'), .5); });
  P_('YOKO', () => bust({ skin: '#f0c8a8', hair: '#8a4a2a', hs: 'long', cloth: '#a02030', collar: '#e0b040', lips: '#c06060', bg0: '#4a0a1a', bg1: '#0a0004', extra: () => { polyF([[30, 18], [36, 4], [44, 14], [52, 4], [58, 18]], hex('#e0b040')); } }));
  P_('YOKOID', () => bust({ skin: '#f0d8d0', hair: '#8a4a2a', hs: 'long', cloth: '#1a1a24', lips: '#c06060', bg0: '#2a3a4a', bg1: '#0a0a18', extra: () => { rectF(30, 56, 28, 1, hex('#60c0ff')); } }));
  P_('DEB', () => { bgPort('#3a0a3a', '#0a000a'); rectF(36, 20, 16, 40, hex('#3a3a44')); for (let y = 22; y < 58; y += 3) rectF(38, y, 12, 1, hex('#6a6a74')); rectF(42, 60, 4, 30, hex('#2a2a30')); rectF(30, 90, 28, 6, hex('#2a2a30')); text('ON AIR', 26, 8, hex('#ff3030'), 0); });
  P_('KWAN', () => bust({ skin: '#e8c8a8', hair: '#2a2a2a', hs: 'short', cloth: '#f0f0f4', collar: '#d0d0d8', tie: '#3a6a8a', glasses: '#3a3a3a', bg0: '#2a3a3a', bg1: '#080c0c' }));
  P_('CLERK', () => bust({ skin: '#b0b8c8', hs: 'bald', cloth: '#f0f0f4', collar: '#d8d8e0', bg0: '#2a2a3a', bg1: '#06060a', hw: 22, hh: 26, noFace: 1, extra: () => { blob(34, 44, 7, 9, [INK, INK, hex('#101018'), hex('#3a3a50')]); blob(54, 44, 7, 9, [INK, INK, hex('#101018'), hex('#3a3a50')]); rectF(40, 62, 8, 1, hex('#808898')); } }));
  P_('BARTENDER', () => bust({ skin: '#e0b090', hair: '#3a2a1a', hs: 'short', cloth: '#1a1a1a', collar: '#f0f0f0', bg0: '#3a2a1a', bg1: '#0a0604' }));
  P_('_', () => bust({}));
  const gen = (id, spec, bg) => P_(id, () => bust({ skin: spec.skin, hair: spec.hair, hs: spec.hs === 'pony' ? 'up' : spec.hs, cloth: spec.coat || spec.top, collar: spec.top, tie: spec.tie, glasses: spec.glasses, lips: spec.lips, bg0: bg[0], bg1: bg[1] }));
  for (const [id, bg] of [['miws', ['#c8c8d0', '#5a5a68']], ['cop', ['#1a1a4a', '#04040c']], ['thug', ['#3a1a1a', '#0a0404']], ['thug2', ['#3a2a1a', '#0a0604']], ['civ1', ['#2a3a4a', '#060a0c']], ['civ2', ['#3a1a2a', '#0a0408']], ['civ3', ['#2a2a2a', '#080808']], ['civ4', ['#3a3a2a', '#0a0a06']], ['civ5', ['#3a2a1a', '#0a0604']], ['civ6', ['#1a3a2a', '#040a06']], ['civ7', ['#3a0a1a', '#0a0004']], ['civ8', ['#1a3a4a', '#04080c']], ['surfer', ['#4a3a1a', '#0a0804']], ['patient', ['#3a4a5a', '#080a0c']], ['suit', ['#1a2a1a', '#040804']], ['invader', ['#2a0a3a', '#06000a']], ['husk', ['#2a1a0a', '#060402']], ['returnee', ['#2a3a2a', '#060806']]])
    if (SPEC[id] && !PORT[id]) gen(id, SPEC[id], bg);
}
// Dyslexio lives on a screen like any Face (his helmet is part of the prop); his mouth moves when he talks
PAINTERS.dyslexio = (sx, sy, e) => { const w = CV.who; if (w === 'DYSLEXIO') CV.who = 'OLDFACE'; try { PAINTERS.facescreen(sx, sy, e); } finally { CV.who = w; } };

// a yellow cab: the red car, repainted
{ const _bp = buildPeople; buildPeople = function () { _bp(); const src = PROPS.car.img, d = src.d.map(c => { if (!c) return c; const r = c & 255, g = (c >> 8) & 255, b = (c >> 16) & 255; if (r > 60 && r > g * 1.6 && r > b * 1.6) return rgb(Math.min(255, r * 1.9 + 30), Math.min(255, r * 1.55 + 20), b * .4); return c; }); PROPS.cab = Object.assign({}, PROPS.car, { img: { w: src.w, h: src.h, d } }); }; }
