'use strict';
// ================= SUPER-16 SOUND: 2-operator FM synth + noise/PCM drums + digitized voice =================
// LEGACY mode swaps every instrument for the old square waves: the downgrade is audible.
let AC = null, master, musBus, sfxBus, noiseBuf, SQ = {};
let LEGACY_AUDIO = false;
const mus = { rate: 1, det: 0 };
function audioInit() {
  if (AC) { if (AC.state === 'suspended') AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = .55;
  const comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
  musBus = AC.createGain(); musBus.gain.value = .32; musBus.connect(master);
  sfxBus = AC.createGain(); sfxBus.gain.value = .35; sfxBus.connect(master);
  noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  for (const [k, duty] of [['p12', .125], ['p25', .25], ['p50', .5]]) { const n = 32, re = new Float32Array(n), im = new Float32Array(n); for (let i = 1; i < n; i++) re[i] = 2 * Math.sin(i * Math.PI * duty) / (i * Math.PI); SQ[k] = AC.createPeriodicWave(re, im); }
  nextT = AC.currentTime + .05; setInterval(sched, 25);
}
// FM patches: ratio (mod:carrier), index (mod depth), mdecay (index falloff), a/d/s (envelope), wave (carrier)
const PATCH = {
  bass: { ratio: 1, index: 3.2, mdecay: .15, d: .22, s: .45, vol: .9 },
  slap: { ratio: 2, index: 5, mdecay: .05, d: .12, s: .2, vol: .9 },
  lead: { ratio: 1, index: 1.6, mdecay: .6, d: .4, s: .7, vol: .55 },
  brass: { ratio: 1, index: 2.4, mdecay: 1.2, a: .03, d: .3, s: .8, vol: .5 },
  bell: { ratio: 3.5, index: 4, mdecay: .03, d: .9, s: .0, vol: .45 },
  epiano: { ratio: 1, index: 2, mdecay: .08, d: .7, s: .15, vol: .45, ratio2: 14 },
  pad: { ratio: 2, index: .8, mdecay: 1, a: .25, d: .5, s: .8, vol: .3 },
  organ: { ratio: 2, index: 1.2, mdecay: 1, a: .01, d: .1, s: .9, vol: .35 },
  pluck: { ratio: 1, index: 3, mdecay: .02, d: .18, s: 0, vol: .5 },
};
const LEGACY_WAVE = { bass: 'tri', slap: 'tri', lead: 'p25', brass: 'p50', bell: 'p12', epiano: 'p25', pad: 'p12', organ: 'p50', pluck: 'p12' };
function note(f, dur, patch, at, dest, det = 0) {
  if (!AC || !f) return;
  const p = PATCH[patch] || PATCH.lead, g = AC.createGain(), c = AC.createOscillator();
  const vol = p.vol * (dest === sfxBus ? 1 : .9);
  if (LEGACY_AUDIO) { // the downgrade: plain square/triangle, like the old cartridges
    const lw = LEGACY_WAVE[patch] || 'p25';
    if (lw === 'tri') c.type = 'triangle'; else c.setPeriodicWave(SQ[lw]);
    c.frequency.setValueAtTime(f, at); c.detune.value = det;
    g.gain.setValueAtTime(vol * .6, at); g.gain.setValueAtTime(vol * .6, at + dur * .7); g.gain.linearRampToValueAtTime(0, at + dur);
    c.connect(g); g.connect(dest); c.start(at); c.stop(at + dur + .05); return;
  }
  const m = AC.createOscillator(), mg = AC.createGain();
  m.frequency.setValueAtTime(f * p.ratio, at); c.frequency.setValueAtTime(f, at); c.detune.value = det; m.detune.value = det;
  mg.gain.setValueAtTime(f * p.index, at); mg.gain.exponentialRampToValueAtTime(Math.max(1, f * p.index * p.mdecay), at + Math.max(.05, dur));
  m.connect(mg); mg.connect(c.frequency);
  if (p.ratio2) { const m2 = AC.createOscillator(), g2 = AC.createGain(); m2.frequency.value = f * p.ratio2; g2.gain.setValueAtTime(f * .6, at); g2.gain.exponentialRampToValueAtTime(1, at + .08); m2.connect(g2); g2.connect(c.frequency); m2.start(at); m2.stop(at + dur + .1); }
  const a = p.a || .004;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + a);
  g.gain.linearRampToValueAtTime(vol * Math.max(.001, p.s), at + a + p.d);
  g.gain.setValueAtTime(vol * Math.max(.001, p.s), at + Math.max(a + p.d, dur)); g.gain.linearRampToValueAtTime(0, at + Math.max(a + p.d, dur) + .06);
  c.connect(g); g.connect(dest); m.start(at); c.start(at); m.stop(at + dur + .15); c.stop(at + dur + .15);
}
function noise(dur, o = {}) {
  if (!AC) return; const t = o.at || AC.currentTime;
  const s = AC.createBufferSource(), g = AC.createGain(), f = AC.createBiquadFilter();
  s.buffer = noiseBuf; s.playbackRate.value = o.rate || 1; f.type = o.lp ? 'lowpass' : o.bp ? 'bandpass' : 'highpass'; f.frequency.value = o.lp || o.bp || o.hp || 300;
  g.gain.setValueAtTime(o.vol || .5, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(o.dest || sfxBus); s.start(t); s.stop(t + dur + .05);
}
function tone(f, dur, o = {}) { if (!AC) return; const t = o.at || AC.currentTime + (o.delay || 0); const c = AC.createOscillator(), g = AC.createGain(); c.type = o.type || 'square'; c.frequency.setValueAtTime(f, t); if (o.slide) c.frequency.exponentialRampToValueAtTime(Math.max(20, f * o.slide), t + dur); g.gain.setValueAtTime(o.vol || .4, t); g.gain.linearRampToValueAtTime(0, t + dur); c.connect(g); g.connect(o.dest || sfxBus); c.start(t); c.stop(t + dur + .05); }
function kick(at, dest, v = 1) { if (!AC) return; const c = AC.createOscillator(), g = AC.createGain(); c.frequency.setValueAtTime(160, at); c.frequency.exponentialRampToValueAtTime(40, at + .12); g.gain.setValueAtTime(v, at); g.gain.exponentialRampToValueAtTime(.001, at + .22); c.connect(g); g.connect(dest); c.start(at); c.stop(at + .25); }
const SFX = {
  blip: v => { if (!AC) return; const [f, j] = v; note(f + (Math.random() - .5) * j, .035, 'pluck', AC.currentTime, sfxBus); },
  tick: () => note(1800, .03, 'pluck', AC.currentTime, sfxBus),
  move: () => note(1200, .03, 'pluck', AC.currentTime, sfxBus),
  ok: () => { note(988, .06, 'bell', AC.currentTime, sfxBus); note(1480, .12, 'bell', AC.currentTime + .06, sfxBus); },
  jump: () => tone(300, .12, { slide: 2.2, vol: .25, type: 'square' }),
  land: () => noise(.05, { lp: 600, vol: .3 }),
  hurt: () => { tone(500, .3, { slide: .3, vol: .35, type: 'sawtooth' }); noise(.2, { lp: 1500, vol: .4 }); },
  ask: () => { note(660, .06, 'pluck', AC.currentTime, sfxBus); note(990, .1, 'pluck', AC.currentTime + .05, sfxBus); },
  stun: () => { note(1400, .2, 'bell', AC.currentTime, sfxBus); },
  get: () => [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, .12, 'bell', AC.currentTime + i * .07, sfxBus)),
  door: () => noise(.4, { lp: 1200, vol: .5, rate: .6 }),
  power: () => { tone(80, .8, { slide: 4, vol: .3, type: 'sawtooth' }); },
  powerdown: () => { tone(600, 1.2, { slide: .08, vol: .35, type: 'sawtooth' }); noise(.8, { lp: 800, vol: .3 }); },
  flush: () => { noise(1.4, { bp: 900, vol: .5, rate: .7 }); noise(.8, { lp: 400, vol: .4 }); },
  switch: () => { note(440, .06, 'epiano', AC.currentTime, sfxBus); note(880, .06, 'epiano', AC.currentTime + .05, sfxBus); note(1320, .1, 'epiano', AC.currentTime + .1, sfxBus); },
  chat: () => note(2400, .03, 'pluck', AC.currentTime, sfxBus),
  object: () => { [392, 523, 659].forEach(f => note(f, .35, 'brass', AC.currentTime, sfxBus)); noise(.15, { hp: 3000, vol: .4 }); },
  crowd: () => { for (let i = 0; i < 6; i++) noise(.3, { bp: 900 + Math.random() * 1500, vol: .15, at: AC.currentTime + i * .05 }); },
  glitch: () => { for (let i = 0; i < 8; i++) tone(200 + Math.random() * 2400, .03, { vol: .3, delay: i * .03 }); },
  step: () => noise(.03, { lp: 900, vol: .12 }),
};
function sfx(n, a) { if (AC && SFX[n]) SFX[n](a); }

// ---------- sequencer (same token format as the old cartridges, plus FM patches) ----------
const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function nf(k) { const m = /^([A-G]#?)(\d)$/.exec(k); return m ? 440 * Math.pow(2, ((+m[2] + 1) * 12 + NOTE[m[1]] - 69) / 12) : 0; }
const TRACKS = {};
let cur = null, curName = null, stepN = 0, nextT = 0;
function compile(tr) { return { bpm: tr.bpm, ch: tr.ch.map(c => { const t = c.n.trim().split(/\s+/), map = []; for (let i = 0; i < t.length; i++) { if (t[i] === '-' || t[i] === '.') continue; let len = 1; while (i + len < t.length && t[i + len] === '-') len++; map[i] = { k: t[i], len }; } return Object.assign({}, c, { len: t.length, map }); }) }; }
function music(name) { if (name === curName) return; curName = name; cur = name && TRACKS[name] ? compile(TRACKS[name]) : null; stepN = 0; if (AC) nextT = AC.currentTime + .08; }
function sched() {
  if (!AC || !cur) return;
  const sd = 60 / (cur.bpm * mus.rate) / 4;
  if (nextT < AC.currentTime - .2) nextT = AC.currentTime + .02;
  while (nextT < AC.currentTime + .12) {
    for (const c of cur.ch) {
      const e = c.map[stepN % c.len]; if (!e) continue;
      if (c.drum) {
        const v = c.vol || 1;
        if (e.k === 'k') kick(nextT, musBus, v);
        else if (e.k === 's') { noise(.14, { bp: 1800, vol: .45 * v, at: nextT, dest: musBus }); tone(200, .08, { vol: .2 * v, at: nextT, dest: musBus, type: 'triangle' }); }
        else if (e.k === 'h') noise(.03, { hp: 8000, vol: .18 * v, at: nextT, dest: musBus });
        else if (e.k === 'o') noise(.2, { hp: 6000, vol: .15 * v, at: nextT, dest: musBus });
        else if (e.k === 'x') { [0, 4, 7].forEach(s => note(nf('C5') * Math.pow(2, s / 12), .25, 'brass', nextT, musBus)); noise(.2, { hp: 2000, vol: .3, at: nextT, dest: musBus }); } // orchestra hit
      } else note(nf(e.k), e.len * sd * .95, c.ins || 'lead', nextT, musBus, mus.det + (c.det || 0));
    }
    stepN++; nextT += sd;
  }
}

// ---------- digitized voice (the "PRETEND CO!" shout; Takahashi's text-to-speech) ----------
function speak(txt, o = {}) {
  return new Promise(res => {
    try {
      if (typeof speechSynthesis === 'undefined' || !window.SpeechSynthesisUtterance) return res();
      const u = new SpeechSynthesisUtterance(txt);
      u.pitch = o.pitch === undefined ? 1 : o.pitch; u.rate = o.rate || 1; u.volume = o.volume === undefined ? .9 : o.volume;
      u.onend = res; u.onerror = res; speechSynthesis.cancel(); speechSynthesis.speak(u);
      setTimeout(res, 2500 + txt.length * 90);
    } catch (e) { res(); }
  });
}
