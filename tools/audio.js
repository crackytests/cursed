// Render a game's music offline in Chromium and measure its tone (how much low end vs. treble).
// Needs a local server (python3 -m http.server 8731 in the repo root).
//   node tools/audio.js yoko/ [track,track,...|all] [seconds] [wavDir]
// Prints, per track: loudness (RMS dBFS), spectral centroid, and the share of energy in each band.
// With wavDir, also writes a mono 16-bit WAV per track so you can listen.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const game = process.argv[2] || 'yoko/', which = process.argv[3] || 'all', secs = +(process.argv[4] || 16), wavDir = process.argv[5];
const base = process.env.BASE || 'http://localhost:8731/';

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage();
  pg.on('pageerror', e => console.log('PAGEERR', e.message));
  await pg.goto(base + game); await pg.waitForTimeout(800);
  const names = which === 'all' ? await pg.evaluate(() => Object.keys(TRACKS)) : which.split(',');
  const SR = 32000;
  console.log('track'.padEnd(10), 'rms dB', 'centroid', ' <250Hz', '250-2k', '2k-5k', ' >5k');
  for (const name of names) {
    const r = await pg.evaluate(async ([name, secs, SR]) => {
      const off = new OfflineAudioContext(2, SR * secs, SR), keep = AC;
      AC = off; audioGraph();
      const tr = compile(TRACKS[name]), sd = 60 / tr.bpm / 4;
      for (let n = 0, t = .05; t < secs - .4; n++, t += sd) playStep(tr, n, t, sd);
      const buf = await off.startRendering(); AC = keep;
      const L = buf.getChannelData(0), R = buf.getChannelData(1), N = L.length, m = new Float32Array(N);
      let ss = 0; for (let i = 0; i < N; i++) { m[i] = (L[i] + R[i]) / 2; ss += m[i] * m[i]; }
      // averaged power spectrum (4096-point Hann frames)
      const F = 4096, re = new Float64Array(F), im = new Float64Array(F), P = new Float64Array(F / 2);
      const fft = () => { for (let i = 1, j = 0; i < F; i++) { let bit = F >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
        for (let len = 2; len <= F; len <<= 1) { const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a); for (let i = 0; i < F; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr; re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } };
      for (let s = 0; s + F <= N; s += F / 2) { for (let i = 0; i < F; i++) { re[i] = m[s + i] * (.5 - .5 * Math.cos(2 * Math.PI * i / (F - 1))); im[i] = 0; } fft(); for (let k = 0; k < F / 2; k++) P[k] += re[k] * re[k] + im[k] * im[k]; }
      let tot = 0, cen = 0; const band = [0, 0, 0, 0];
      for (let k = 1; k < F / 2; k++) { const hz = k * SR / F, p = P[k]; tot += p; cen += p * hz; band[hz < 250 ? 0 : hz < 2000 ? 1 : hz < 5000 ? 2 : 3] += p; }
      const pcm = new Int16Array(N); let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(m[i]));
      for (let i = 0; i < N; i++) pcm[i] = Math.max(-32767, Math.min(32767, m[i] * 32767));
      let bin = ''; const u8 = new Uint8Array(pcm.buffer); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      return { rms: 10 * Math.log10(ss / N + 1e-12), cen: cen / tot, band: band.map(v => v / tot), peak: pk, b64: btoa(bin) };
    }, [name, secs, SR]);
    const pct = v => (100 * v).toFixed(1).padStart(5) + '%';
    console.log(name.padEnd(10), r.rms.toFixed(1).padStart(6), (r.cen | 0).toString().padStart(6) + 'Hz', r.band.map(pct).join(' '), r.peak > .99 ? 'CLIPS' : '');
    if (wavDir) {
      fs.mkdirSync(wavDir, { recursive: true });
      const data = Buffer.from(r.b64, 'base64'), h = Buffer.alloc(44);
      h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
      h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
      fs.writeFileSync(path.join(wavDir, name + '.wav'), Buffer.concat([h, data]));
    }
  }
  await b.close();
})().catch(e => { console.log('ERR', e); process.exit(1); });
