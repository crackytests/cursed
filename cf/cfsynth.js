'use strict';
// ================= CHROME FORCE -- the "chromewave" sound board (CF only; g2/fm.js stays as every other cart has it) =================
// What the 1993 sound team bolted onto the SUPER-16 chip for this one cart:
//  - 4-op style FM (a second modulator + "feedback") for slap bass, chrome bells and brass; a waveshaper for FM guitar
//  - detuned 3-saw "supersaw" pads/leads through a swept lowpass, pumping against the kick
//  - per-channel stereo pan, a tempo-synced ping-pong echo and a big dark hall (sends: dly / rev / duck on a channel)
//  - crunchy 8-bit "PCM" drums: punch kick, GATED-REVERB snare, clap, three toms, crash, ride, orchestra hit
//  - chord tokens: 'E3+G3+B3' plays all three
// Channel fields: ins, vol, det, pan (-1..1), dly (0..1), rev (0..1), duck (0..1). Everything routes into musBus, so MUSIC OFF still mutes it.

const XP = { // x = 'fm' | 'saw' | 'sq'
  fmbass: { x: 'fm', r1: 1, i1: 4.5, r2: 2, i2: 1.6, md: .06, a: .003, d: .16, s: .35, vol: .62, sub: .5 },
  slap: { x: 'fm', r1: 1, i1: 7, r2: 3, i2: 2.5, md: .03, a: .002, d: .1, s: .25, vol: .6, sub: .45 },
  chrome: { x: 'fm', r1: 3.5, i1: 3.2, r2: 1, i2: 1.2, md: .25, a: .004, d: .5, s: .45, vol: .34, chorus: 7 },
  bellx: { x: 'fm', r1: 3.5, i1: 5, r2: 7, i2: 1.5, md: .02, a: .002, d: 1.1, s: 0, vol: .3, chorus: 5 },
  brassx: { x: 'fm', r1: 1, i1: 2.2, r2: 1, i2: 1.3, md: 1.3, a: .04, d: .3, s: .8, vol: .34, swell: 1, chorus: 6 },
  gtr: { x: 'fm', r1: 1, i1: 5.5, r2: 2, i2: 2.4, md: .6, a: .004, d: .35, s: .75, vol: .2, drive: 9, lp: 3600 },
  palm: { x: 'fm', r1: 1, i1: 6, r2: 2, i2: 2.5, md: .07, a: .002, d: .07, s: .06, vol: .3, drive: 11, lp: 1500 },
  epx: { x: 'fm', r1: 1, i1: 2, r2: 14, i2: .7, md: .08, a: .003, d: .8, s: .18, vol: .32, chorus: 6 },
  saw: { x: 'saw', spread: 11, a: .008, d: .35, s: .7, vol: .15, lp: 3400, lpEnv: 2.2, q: 2 },
  pad: { x: 'saw', spread: 14, a: .35, d: .6, s: .85, vol: .07, lp: 1700, lpEnv: 1.4, q: .7, rel: .5 },
  arp: { x: 'sq', a: .002, d: .11, s: 0, vol: .1, lp: 2800 },
  psg: { x: 'sq', a: .003, d: .2, s: .5, vol: .09, lp: 4200 },
};
Object.assign(LEGACY_WAVE, { fmbass: 'tri', slap: 'tri', chrome: 'p25', bellx: 'p12', brassx: 'p50', gtr: 'p25', palm: 'p50', epx: 'p25', saw: 'p25', pad: 'p12', arp: 'p12', psg: 'p50' });
for (const k in XP) if (!PATCH[k]) PATCH[k] = PATCH.lead; // legacy mode and anything that reads PATCH directly still works

// ---------- the effects rack, built once per audio context ----------
let XFX = null;
function xCurve(fn, n = 1024) { const c = new Float32Array(n); for (let i = 0; i < n; i++) c[i] = fn(i / (n - 1) * 2 - 1); return c; }
function xIR(sec, shape, dark = .2) {
  const n = AC.sampleRate * sec | 0, b = AC.createBuffer(2, n, AC.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); let lp = 0; for (let i = 0; i < n; i++) { lp += ((Math.random() * 2 - 1) - lp) * dark; d[i] = lp * shape(i / n); } }
  return b;
}
function xFx() {
  if (XFX && XFX.ac === AC) return XFX;
  const F = { ac: AC, chans: {} };
  // hall: long and dark, the synthwave wash
  F.hall = AC.createConvolver(); F.hall.buffer = xIR(2.6, t => Math.pow(1 - t, 2.4) * (t < .01 ? t / .01 : 1), .14);
  F.hallIn = AC.createGain(); F.hallOut = AC.createGain(); F.hallOut.gain.value = .55; const hlp = AC.createBiquadFilter(); hlp.type = 'highpass'; hlp.frequency.value = 220;
  F.hallIn.connect(hlp); hlp.connect(F.hall); F.hall.connect(F.hallOut); F.hallOut.connect(musBus);
  // gated reverb: dense, flat, then cut dead at 280ms (the 1984 snare)
  F.gate = AC.createConvolver(); F.gate.buffer = xIR(.3, t => t < .93 ? .8 : 0, .5);
  F.gateIn = AC.createGain(); F.gateOut = AC.createGain(); F.gateOut.gain.value = .5; F.gateIn.connect(F.gate); F.gate.connect(F.gateOut); F.gateOut.connect(musBus);
  // ping-pong echo, tempo synced (dotted eighth)
  F.dIn = AC.createGain(); F.dL = AC.createDelay(2); F.dR = AC.createDelay(2); F.fb = AC.createGain(); F.fb.gain.value = .38;
  const pl = AC.createStereoPanner(), pr = AC.createStereoPanner(), dlp = AC.createBiquadFilter(); pl.pan.value = -.8; pr.pan.value = .8; dlp.type = 'lowpass'; dlp.frequency.value = 2600;
  F.dOut = AC.createGain(); F.dOut.gain.value = .5;
  F.dIn.connect(F.dL); F.dL.connect(pl); pl.connect(F.dOut); F.dL.connect(dlp); dlp.connect(F.dR); F.dR.connect(pr); pr.connect(F.dOut); F.dR.connect(F.fb); F.fb.connect(F.dL); F.dOut.connect(musBus); F.dOut.connect(F.hallIn);
  F.setTempo = bpm => { if (F.bpm === bpm) return; F.bpm = bpm; const t = 60 / bpm * .75; F.dL.delayTime.value = t; F.dR.delayTime.value = t; };
  // drums: the 8-bit DAC (quantize + a 9k rolloff) -- the crunch of a Genesis sample
  F.drum = AC.createGain(); const crush = AC.createWaveShaper(); crush.curve = xCurve(x => Math.round(x * 24) / 24); const dlp2 = AC.createBiquadFilter(); dlp2.type = 'lowpass'; dlp2.frequency.value = 9000;
  F.drum.connect(crush); crush.connect(dlp2); dlp2.connect(musBus); F.drumRev = AC.createGain(); F.drumRev.gain.value = .12; F.drum.connect(F.drumRev); F.drumRev.connect(F.hallIn);
  F.drive = {}; // shared distortion curves by amount
  return (XFX = F);
}
function xStrip(key, c) { // a channel strip: duck -> pan -> musBus, with sends
  const F = xFx(); if (F.chans[key]) return F.chans[key];
  const duck = AC.createGain(), pan = AC.createStereoPanner(); pan.pan.value = c.pan || 0;
  duck.connect(pan); pan.connect(musBus);
  if (c.rev) { const s = AC.createGain(); s.gain.value = c.rev; pan.connect(s); s.connect(F.hallIn); }
  if (c.dly) { const s = AC.createGain(); s.gain.value = c.dly; pan.connect(s); s.connect(F.dIn); }
  return (F.chans[key] = { in: duck, duck: c.duck || 0, g: duck.gain });
}

// ---------- voices ----------
function xEnv(g, at, dur, P, peak) { const a = P.a || .004, top = a + (P.d || .2), st = Math.max(.0001, peak * (P.s || 0)), end = Math.max(top, dur), rel = P.rel || .06;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(peak, at + a); g.gain.linearRampToValueAtTime(st, at + top);
  g.gain.setValueAtTime(st, at + end); g.gain.linearRampToValueAtTime(0, at + end + rel); return at + end + rel + .02; }
function noteX(f, dur, P, at, dest, det = 0, vm = 1) {
  if (!AC || !f) return;
  const g = AC.createGain(), vol = P.vol * vm, stop = xEnv(g, at, dur, P, vol); let out = g;
  if (P.lp) { const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = P.q || .8;
    if (P.lpEnv) { lp.frequency.setValueAtTime(P.lp * P.lpEnv, at); lp.frequency.exponentialRampToValueAtTime(P.lp, at + (P.a || 0) + (P.d || .2)); } else lp.frequency.value = P.lp;
    g.connect(lp); out = lp; }
  out.connect(dest);
  let src = g; // distortion goes BEFORE the envelope, so a guitar note's loudness is still the patch's vol
  if (P.drive) { const ws = AC.createWaveShaper(), F = xFx(); ws.curve = F.drive[P.drive] || (F.drive[P.drive] = xCurve(x => Math.tanh(x * P.drive) / Math.tanh(P.drive))); ws.oversample = '2x';
    src = AC.createGain(); src.connect(ws); ws.connect(g); }
  const oscs = [];
  if (P.x === 'saw') for (const d of [-P.spread, 0, P.spread]) { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f, at); o.detune.value = det + d; o.connect(src); oscs.push(o); }
  else if (P.x === 'sq') { const o = AC.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(f, at); o.detune.value = det; o.connect(src); oscs.push(o); }
  else { // fm: m2 -> m1 -> carrier (a 3-operator chain; m2 at the same ratio stands in for operator feedback), optional chorus twin
    for (const cd of P.chorus ? [-P.chorus, P.chorus] : [0]) {
      const c = AC.createOscillator(), m1 = AC.createOscillator(), m2 = AC.createOscillator(), g1 = AC.createGain(), g2 = AC.createGain();
      c.frequency.setValueAtTime(f, at); m1.frequency.setValueAtTime(f * P.r1, at); m2.frequency.setValueAtTime(f * P.r1 * P.r2, at);
      for (const o of [c, m1, m2]) o.detune.value = det + cd;
      const i1 = f * P.i1, i2 = f * P.r1 * P.i2;
      if (P.swell) { g1.gain.setValueAtTime(i1 * .2, at); g1.gain.linearRampToValueAtTime(i1, at + .08); g1.gain.exponentialRampToValueAtTime(Math.max(1, i1 * .6), at + Math.max(.1, dur)); }
      else { g1.gain.setValueAtTime(i1, at); g1.gain.exponentialRampToValueAtTime(Math.max(1, i1 * P.md), at + Math.max(.05, Math.min(dur, .5))); }
      g2.gain.setValueAtTime(i2, at); g2.gain.exponentialRampToValueAtTime(Math.max(1, i2 * .2), at + .25);
      m2.connect(g2); g2.connect(m1.frequency); m1.connect(g1); g1.connect(c.frequency);
      const cg = AC.createGain(); cg.gain.value = P.chorus ? .6 : 1; c.connect(cg); cg.connect(src); oscs.push(c, m1, m2);
    }
    if (P.sub) { const s = AC.createOscillator(), sg = AC.createGain(); s.frequency.setValueAtTime(f / 2, at); s.type = 'sine'; sg.gain.value = P.sub; s.connect(sg); sg.connect(src); oscs.push(s); }
  }
  for (const o of oscs) { o.start(at); o.stop(stop); }
}

// ---------- drums ----------
function hitX(k, at, F, v, duckAll) {
  const D = F.drum, nz = (dur, o) => noise(dur, Object.assign({ at, dest: D }, o));
  const tom = (f0, vol) => { const c = AC.createOscillator(), g = AC.createGain(); c.frequency.setValueAtTime(f0, at); c.frequency.exponentialRampToValueAtTime(f0 * .45, at + .35);
    g.gain.setValueAtTime(vol * v, at); g.gain.exponentialRampToValueAtTime(.001, at + .45); c.connect(g); g.connect(D); g.connect(F.gateIn); c.start(at); c.stop(at + .5); nz(.08, { lp: 2500, vol: .25 * v }); };
  if (k === 'k') { // punch: click + pitched body + sub, and the pads duck
    const c = AC.createOscillator(), g = AC.createGain(); c.frequency.setValueAtTime(180, at); c.frequency.exponentialRampToValueAtTime(42, at + .11);
    g.gain.setValueAtTime(1.15 * v, at); g.gain.exponentialRampToValueAtTime(.001, at + .32); c.connect(g); g.connect(D); c.start(at); c.stop(at + .35);
    nz(.012, { hp: 3000, vol: .35 * v }); duckAll(at);
  } else if (k === 's') { // the gated snare: crack + body, a big send into the gate
    const c = AC.createOscillator(), g = AC.createGain(); c.type = 'triangle'; c.frequency.setValueAtTime(240, at); c.frequency.exponentialRampToValueAtTime(160, at + .08);
    g.gain.setValueAtTime(.45 * v, at); g.gain.exponentialRampToValueAtTime(.001, at + .12); c.connect(g); g.connect(D); c.start(at); c.stop(at + .15);
    nz(.16, { bp: 1900, vol: .55 * v }); noise(.09, { at, hp: 1200, vol: .7 * v, dest: F.gateIn });
  } else if (k === 'c') { for (let i = 0; i < 3; i++) nz(.05, { bp: 1300, vol: .4 * v, at: at + i * .011 }); noise(.12, { at, bp: 1500, vol: .5 * v, dest: F.gateIn }); }
  else if (k === 'h') nz(.035, { hp: 8500, vol: .2 * v });
  else if (k === 'o') nz(.22, { hp: 7000, vol: .17 * v });
  else if (k === 'r') nz(.4, { hp: 5000, vol: .1 * v });
  else if (k === 'C') { nz(1.4, { hp: 5000, vol: .22 * v }); noise(1.2, { at, hp: 3000, vol: .15 * v, dest: F.hallIn }); }
  else if (k === 't') tom(260, .7); else if (k === 'm') tom(180, .75); else if (k === 'l') tom(120, .8);
  else if (k === 'x') { // the orchestra hit every Genesis cart owned
    [0, 4, 7, 12].forEach(s => noteX(nf('C4') * Math.pow(2, s / 12), .3, XP.brassx, at, F.hallIn, 0, 1.2)); [0, 7].forEach(s => noteX(nf('C3') * Math.pow(2, s / 12), .3, XP.brassx, at, musBus, 0, 1));
    nz(.25, { hp: 1800, vol: .4 * v }); duckAll(at);
  }
}

// ---------- the step player (replaces fm.js's for this cart) ----------
function playStep(tr, n, at, sd) {
  if (LEGACY_AUDIO) { // the downgrade keeps the old chip path untouched
    for (const c of tr.ch) { const e = c.map[n % c.len]; if (!e) continue; if (c.drum) { if (e.k === 'k') kick(at, musBus, c.vol || 1); else if (e.k === 's' || e.k === 'c') noise(.14, { bp: 1800, vol: .45 * (c.vol || 1), at, dest: musBus }); else if (e.k !== '.') noise(.03, { hp: 8000, vol: .18 * (c.vol || 1), at, dest: musBus }); }
      else for (const k of e.k.split('+')) note(nf(k), e.len * sd * .95, c.ins in PATCH ? c.ins : 'lead', at, musBus, mus.det + (c.det || 0), c.vol || 1); }
    return;
  }
  const F = xFx(); F.setTempo(tr.bpm * mus.rate);
  const strips = tr.ch.map((c, i) => c.drum ? null : xStrip((curName || '?') + ':' + i, c));
  const duckAll = t => { for (const s of strips) if (s && s.duck) { s.g.cancelScheduledValues(t); s.g.setValueAtTime(1 - s.duck, t); s.g.linearRampToValueAtTime(1, t + sd * 3.2); } };
  tr.ch.forEach((c, i) => {
    const e = c.map[n % c.len]; if (!e) return;
    if (c.drum) { for (const k of e.k.split('+')) hitX(k, at, F, c.vol || 1, duckAll); return; }
    const dest = strips[i].in, dur = e.len * sd * .95;
    for (const k of e.k.split('+')) { const P = XP[c.ins]; if (P) noteX(nf(k), dur, P, at, dest, mus.det + (c.det || 0), c.vol || 1); else note(nf(k), dur, c.ins || 'lead', at, dest, mus.det + (c.det || 0), c.vol || 1); }
  });
}

// ---------- writing helpers for the score ----------
const XNN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const xMidi = k => { const m = /^([A-G]#?)(\d)$/.exec(k); return (+m[2] + 1) * 12 + XNN.indexOf(m[1]); }, xName = m => XNN[m % 12] + (Math.floor(m / 12) - 1);
const XQUAL = { m: [0, 3, 7], M: [0, 4, 7], m7: [0, 3, 7, 10], M7: [0, 4, 7, 11], s4: [0, 5, 7], s2: [0, 2, 7], m9: [0, 3, 7, 14], add9: [0, 4, 7, 14], p5: [0, 7, 12] };
const xChord = (root, q) => XQUAL[q].map(s => xName(xMidi(root) + s));
// seq = [[root, quality, beats], ...]; every helper returns a token string of 4 steps per beat
const xPad = seq => seq.map(([r, q, b]) => [xChord(r, q).join('+')].concat(Array(b * 4 - 1).fill('-')).join(' ')).join(' ');
const xArp = (seq, shape = [0, 1, 2, 3, 2, 1], up = 12) => seq.map(([r, q, b]) => { const ns = xChord(r, q).map(xMidi), ext = ns.concat(ns.map(m => m + up)), out = [];
  for (let i = 0; i < b * 4; i++) { const k = shape[i % shape.length]; out.push(k === '.' ? '.' : xName(ext[k % ext.length])); } return out.join(' '); }).join(' ');
const xOct = (seq, oct = 2) => seq.map(([r, q, b]) => { const lo = xName(xMidi(r.replace(/\d/, oct)) ), hi = xName(xMidi(lo) + 12); return Array(b).fill(lo + ' . ' + hi + ' .').join(' '); }).join(' ');
const xPulse = (seq, oct = 2) => seq.map(([r, q, b]) => { const lo = xName(xMidi(r.replace(/\d/, oct))); return Array(b * 2).fill(lo + ' .').join(' '); }).join(' ');
const xBars = (bars, main, fill) => Array(bars - 1).fill(main.trim()).concat([(fill || main).trim()]).join(' ');
