'use strict';
// ================= AUDIO (DMG-ish: 2 pulse, wave, noise) =================
let AC = null, master, musGain, sfxGain, noiseBuf;
const WAVES = {};
const mus = { rate: 1, det: 0, wob: 0 };
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = 0.5; master.connect(AC.destination);
  musGain = AC.createGain(); musGain.gain.value = 0.2; musGain.connect(master);
  sfxGain = AC.createGain(); sfxGain.gain.value = 0.25; sfxGain.connect(master);
  noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  for (const [k, duty] of [['p12', .125], ['p25', .25], ['p50', .5]]) {
    const n = 32, re = new Float32Array(n), im = new Float32Array(n);
    for (let i = 1; i < n; i++) re[i] = 2 * Math.sin(i * Math.PI * duty) / (i * Math.PI);
    WAVES[k] = AC.createPeriodicWave(re, im);
  }
  nextT = AC.currentTime + .05;
  setInterval(sched, 25);
}
function tone(f, dur, o = {}) {
  if (!AC || !f) return;
  const t = o.at || AC.currentTime + (o.delay || 0);
  const osc = AC.createOscillator(), g = AC.createGain();
  if (o.w && WAVES[o.w]) osc.setPeriodicWave(WAVES[o.w]); else osc.type = o.type || 'square';
  osc.frequency.setValueAtTime(f, t);
  if (o.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, f * o.slide), t + dur);
  osc.detune.value = o.det || 0;
  const v = o.vol === undefined ? 1 : o.vol;
  g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + dur * .6); g.gain.linearRampToValueAtTime(0, t + dur);
  osc.connect(g); g.connect(o.dest || sfxGain); osc.start(t); osc.stop(t + dur + .05);
}
function nz(dur, o = {}) {
  if (!AC) return;
  const t = o.at || AC.currentTime + (o.delay || 0);
  const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
  s.buffer = noiseBuf; s.playbackRate.value = o.rate || 1;
  f.type = o.lp ? 'lowpass' : 'highpass'; f.frequency.value = o.lp || o.hp || 200;
  g.gain.setValueAtTime(o.vol || .5, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(o.dest || sfxGain); s.start(t); s.stop(t + dur + .05);
}
const SFX = {
  blip: f => tone(f || 900, .03, { w: 'p25', vol: .45 }),
  tick: () => tone(1800, .03, { w: 'p12', vol: .35 }),
  move: () => tone(1250, .03, { w: 'p50', vol: .3 }),
  ok: () => { tone(1400, .05, { w: 'p25', vol: .4 }); tone(2100, .08, { w: 'p25', vol: .4, delay: .05 }); },
  bump: () => tone(85, .09, { w: 'p50', vol: .6 }),
  door: () => nz(.3, { lp: 1800, vol: .5, rate: .5 }),
  alert: () => { tone(1600, .06, { w: 'p25' }); tone(2400, .14, { w: 'p25', delay: .07 }); },
  chat: () => { tone(2600, .02, { w: 'p12', vol: .3 }); tone(3200, .03, { w: 'p12', vol: .3, delay: .03 }); },
  get: () => [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, i === 5 ? .4 : .09, { w: 'p25', vol: .5, delay: i * .09 })),
  ding: () => { tone(1046, .07, { w: 'p50', vol: .5 }); tone(2093, 1.1, { w: 'p50', vol: .5, delay: .08 }); },
  dingbad: () => { tone(1046, .07, { w: 'p50', vol: .5 }); tone(1975, 1.4, { w: 'p50', vol: .5, delay: .08, slide: .92 }); },
  smoke: () => { nz(1.4, { lp: 900, vol: .35, rate: .3 }); tone(110, 1.2, { type: 'sine', vol: .4, slide: .5 }); },
  caught: () => { tone(900, .7, { w: 'p50', slide: .15, vol: .5 }); nz(.5, { lp: 600, vol: .4 }); },
  glitch: () => { for (let i = 0; i < 8; i++) tone(200 + Math.random() * 3000, .03, { w: 'p12', vol: .4, delay: i * .03 }); },
  thump: () => { tone(70, .18, { type: 'sine', vol: 1, slide: .5 }); tone(60, .2, { type: 'sine', vol: .8, slide: .5, delay: .22 }); },
  ring: () => { for (let i = 0; i < 6; i++) tone(i % 2 ? 1320 : 1760, .06, { w: 'p50', vol: .35, delay: i * .07 }); },
  smash: () => { nz(.6, { hp: 800, vol: .8 }); tone(3000, .3, { w: 'p12', slide: .3, vol: .3 }); },
  step: () => nz(.04, { lp: 500, vol: .25 }),
  static: () => nz(1.5, { hp: 2000, vol: .25 }),
  hum: () => tone(55, 3, { type: 'sine', vol: .5 }),
};
function sfx(n, a) { if (AC && SFX[n]) SFX[n](a); }

// ---------- sequencer ----------
const NOTE = { C:0, 'C#':1, D:2, 'D#':3, E:4, F:5, 'F#':6, G:7, 'G#':8, A:9, 'A#':10, B:11 };
function nf(k) { const m = /^([A-G]#?)(\d)$/.exec(k); return m ? 440 * Math.pow(2, ((+m[2] + 1) * 12 + NOTE[m[1]] - 69) / 12) : 0; }
function compile(tr) {
  return { bpm: tr.bpm, ch: tr.ch.map(c => {
    const t = c.n.trim().split(/\s+/), map = [];
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '-' || t[i] === '.') continue;
      let len = 1; while (i + len < t.length && t[i + len] === '-') len++;
      map[i] = { k: t[i], len };
    }
    return Object.assign({}, c, { len: t.length, map });
  }) };
}
let cur = null, curName = null, stepN = 0, nextT = 0;
function music(name) {
  if (name === curName) return;
  curName = name; cur = name && TRACKS[name] ? compile(TRACKS[name]) : null; stepN = 0;
  if (AC) nextT = AC.currentTime + .08;
}
function sched() {
  if (!AC || !cur) return;
  const sd = 60 / (cur.bpm * mus.rate) / 4;
  if (nextT < AC.currentTime - .2) nextT = AC.currentTime + .02;
  while (nextT < AC.currentTime + .12) {
    for (const c of cur.ch) {
      const e = c.map[stepN % c.len]; if (!e) continue;
      if (c.drum) {
        if (e.k === 'k') tone(150, .12, { type: 'sine', slide: .3, vol: (c.vol || 1) * 1.2, at: nextT, dest: musGain });
        else if (e.k === 's') nz(.12, { hp: 1200, vol: (c.vol || 1) * .5, at: nextT, dest: musGain });
        else if (e.k === 'h') nz(.03, { hp: 7000, vol: (c.vol || 1) * .3, at: nextT, dest: musGain });
      } else {
        const det = mus.det + (mus.wob ? (Math.random() - .5) * mus.wob : 0);
        tone(nf(e.k), e.len * sd * .92, { w: c.w, type: c.type, vol: c.vol || .5, at: nextT, dest: musGain, det });
      }
    }
    stepN++; nextT += sd;
  }
}
const TRACKS = {
  title: { bpm: 92, ch: [
    { w: 'p25', vol: .5, n: 'A4 - - - C5 - E5 - D5 - - - C5 - B4 - A4 - - - - - G4 - A4 - - - - - - - F4 - - - A4 - C5 - B4 - - - G4 - E4 - F4 - - - E4 - - - D#4 - - - E4 - - -' },
    { w: 'p12', vol: .18, n: 'A3 E4 A4 E4 A3 E4 A4 E4 A3 E4 A4 E4 A3 E4 A4 E4 F3 C4 F4 C4 F3 C4 F4 C4 F3 C4 F4 C4 F3 C4 F4 C4 D3 A3 D4 A3 D3 A3 D4 A3 D3 A3 D4 A3 D3 A3 D4 A3 E3 B3 E4 G#3 E3 B3 E4 G#3 E3 B3 E4 G#3 E3 B3 E4 G#3' },
    { type: 'triangle', vol: .7, n: 'A2 - - - A2 - - - A2 - - - A2 - - - F2 - - - F2 - - - F2 - - - F2 - - - D2 - - - D2 - - - D2 - - - D2 - - - E2 - - - E2 - - - E2 - - - G#2 - - -' },
  ] },
  ship: { bpm: 76, ch: [
    { w: 'p12', vol: .22, n: 'G4 - B4 - D5 - . . F#4 - A4 - D5 - . . E4 - G4 - B4 - . . D4 - F#4 - A4 - . .' },
    { type: 'triangle', vol: .7, n: 'G2 - - - - - - - D2 - - - - - - - E2 - - - - - - - D2 - - - - - - -' },
    { drum: 1, vol: .6, n: 'k . . . s . . h k . k . s . h .' },
  ] },
  lot: { bpm: 84, ch: [
    { w: 'p25', vol: .38, n: '. . . . . . . . D5 - - - C5 - A4 - . . . . . . . . G4 - A4 - - - - - . . . . . . . . D5 - - - F5 - E5 - . . . . D5 - C5 - A4 - - - - - - -' },
    { w: 'p12', vol: .18, n: 'F4 - A4 - . . . . E4 - G4 - . . . . F4 - A4 - . . . . E4 - C#4 - . . . .' },
    { type: 'triangle', vol: .75, n: 'D2 - - D2 - - F2 - G2 - - - A2 - C3 - D2 - - D2 - - F2 - G2 - - - F2 - E2 -' },
    { drum: 1, vol: .7, n: 'k . h . s . h k . k h . s . h .' },
  ] },
  mall: { bpm: 108, ch: [
    { w: 'p50', vol: .3, n: 'E5 - - D5 - - C5 - - - G4 - A4 - - - F5 - - E5 - - D5 - - - A4 - B4 - - - E5 - - D5 - - C5 - - - E5 - G5 - - - F5 - E5 - D5 - C5 - - - - - - - - -' },
    { w: 'p12', vol: .15, n: 'E4 . G4 . B4 . G4 . E4 . G4 . B4 . G4 . F4 . A4 . C5 . A4 . F4 . A4 . C5 . A4 . E4 . G4 . B4 . G4 . E4 . G4 . B4 . G4 . F4 . B4 . D5 . B4 . F4 . B4 . D5 . B4 .' },
    { type: 'triangle', vol: .7, n: 'C3 - . G2 - . C3 - . . G2 - C3 - . . D3 - . A2 - . D3 - . . A2 - D3 - . . C3 - . G2 - . C3 - . . G2 - C3 - . . G2 - . D3 - . G2 - . . D3 - B2 - . .' },
    { drum: 1, vol: .5, n: 'k . h h s . h . k k h . s . h h' },
  ] },
  desert: { bpm: 70, ch: [
    { w: 'p25', vol: .35, n: 'E4 - - - - - - - F4 - - - - - - - E4 - - - - - - - . . . . . . . . B4 - - - - - A4 - G4 - - - F4 - - - E4 - - - - - - - - - - - - - - -' },
    { type: 'triangle', vol: .7, n: 'E2 - - - - - - - - - - - - - - - F2 - - - - - - - - - - - - - - - E2 - - - - - - - - - - - - - - - D2 - - - - - - - - - - - - - - -' },
    { drum: 1, vol: .25, n: 'h . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' },
  ] },
  lab: { bpm: 120, ch: [
    { w: 'p12', vol: .3, n: 'C3 . C3 . C3 . C#3 . C3 . C3 . C3 . D3 . C3 . C3 . C3 . C#3 . C3 . C3 . G2 . F#2 .' },
    { type: 'triangle', vol: .7, n: 'C2 - - - - - - - - - - - - - - - F#2 - - - - - - - - - - - - - - -' },
    { w: 'p25', vol: .25, n: '. . . . . . . . . . . . . . . . G5 - - - - - F#5 - - - - - - - - - . . . . . . . . . . . . . . . . . . . . . . . . C#6 - - - - - - -' },
    { drum: 1, vol: .6, n: 'k . . . h . . . k . k . h . . .' },
  ] },
  box: { bpm: 140, ch: [
    { w: 'p12', vol: .25, n: 'C4 D#4 F#4 A4 C5 A4 F#4 D#4 C4 D#4 F#4 A4 C5 A4 F#4 D#4 B3 D4 F4 G#4 B4 G#4 F4 D4 B3 D4 F4 G#4 B4 G#4 F4 D4' },
    { type: 'triangle', vol: .7, n: 'C2 - - - - - - - - - - - - - - - B1 - - - - - - - - - - - - - - -' },
    { w: 'p50', vol: .22, n: '. . . . C6 - - - . . . . . . . . . . . . B5 - - - . . . . F#5 - - -' },
    { drum: 1, vol: .6, n: 'k . h s k h . s k . h s . s h h' },
  ] },
  suite: { bpm: 60, ch: [
    { type: 'triangle', vol: .8, n: 'C2 - - - - - - - - - - - - - - -' },
    { w: 'p12', vol: .12, n: 'F#4 - - - - - - - - - - - - - - - . . . . . . . . . . . . . . . .' },
  ] },
  mout: { bpm: 60, ch: [{ w: 'p50', vol: .15, n: 'A5 . . . . . . . . . . . . . . .' }] },
  end: { bpm: 66, ch: [
    { w: 'p25', vol: .4, n: 'E5 - - - D5 - - - C5 - - - D5 - E5 - G5 - - - E5 - - - D5 - - - - - - - C5 - - - A4 - - - G4 - - - A4 - C5 - D5 - - - C5 - - - C5 - - - - - - -' },
    { w: 'p12', vol: .15, n: 'C4 . G4 . E4 . G4 . C4 . G4 . E4 . G4 .' },
    { type: 'triangle', vol: .7, n: 'C3 - - - - - - - G2 - - - - - - - A2 - - - - - - - E2 - - - - - - - F2 - - - - - - - C3 - - - - - - - G2 - - - - - - - C3 - - - - - - -' },
  ] },
};
