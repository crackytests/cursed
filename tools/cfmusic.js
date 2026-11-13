// CHROME FORCE soundtrack check: renders each track offline in Chromium with the game's own synth (cfsynth + cfscore),
// writes WAVs, and prints peak / loudness / stereo width / low-high balance per track.
// usage: node tools/cfmusic.js [outdir] [track,track] [seconds=20] [LEGACY=1]
const path = require('path'), fs = require('fs');
const PW = process.env.PLAYWRIGHT_PATH || 'C:/Users/jeremy/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright';
const { chromium } = require(PW);
const out = process.argv[2] || path.join(__dirname, '..', 'cf', 'music'); fs.mkdirSync(out, { recursive: true });
const only = process.argv[3] ? process.argv[3].split(',') : null, SECS = +(process.argv[4] || 20);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file:///' + path.resolve(__dirname, '..', 'cf', 'index.html').split(path.sep).join('/'));
  await p.waitForTimeout(800);
  const names = only || await p.evaluate(() => Object.keys(TRACKS));
  for (const name of names) {
    const r = await p.evaluate(async ([name, secs, legacy]) => {
      const SR = 44100, off = new OfflineAudioContext(2, SR * secs, SR), keep = AC; AC = off; audioGraph(); LEGACY_AUDIO = !!legacy;
      curName = name; const tr = compile(TRACKS[name]), sd = 60 / tr.bpm / 4;
      for (let n = 0, t = .05; t < secs - .5; n++, t += sd) playStep(tr, n, t, sd);
      const buf = await off.startRendering(); AC = keep; LEGACY_AUDIO = false;
      const L = buf.getChannelData(0), R = buf.getChannelData(1), N = L.length; let pk = 0, sL = 0, sR = 0, sS = 0, lo = 0, hi = 0, pl = 0, ph = 0, clip = 0;
      for (let i = 0; i < N; i++) { const l = L[i], r = R[i], m = (l + r) / 2; pk = Math.max(pk, Math.abs(l), Math.abs(r)); if (Math.abs(l) > .99 || Math.abs(r) > .99) clip++;
        sL += l * l; sR += r * r; sS += ((l - r) / 2) ** 2; pl += (m - pl) * .02; lo += pl * pl; ph = m - pl; hi += ph * ph; }
      const g = pk > .95 ? .95 / pk : 1, pcm = new Int16Array(N * 2); for (let i = 0; i < N; i++) { pcm[i * 2] = L[i] * g * 32767; pcm[i * 2 + 1] = R[i] * g * 32767; }
      const bytes = new Uint8Array(pcm.buffer); let s = ''; for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
      const db = x => (10 * Math.log10(x / N + 1e-12)).toFixed(1);
      return { pk: pk.toFixed(2), rmsL: db(sL), rmsR: db(sR), side: db(sS), lowHigh: (10 * Math.log10((lo + 1e-12) / (hi + 1e-12))).toFixed(1), clip, pcm: btoa(s) };
    }, [name, SECS, !!process.env.LEGACY]);
    const pcm = Buffer.from(r.pcm, 'base64'), hdr = Buffer.alloc(44);
    hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVEfmt ', 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22);
    hdr.writeUInt32LE(44100, 24); hdr.writeUInt32LE(44100 * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
    fs.writeFileSync(path.join(out, name + '.wav'), Buffer.concat([hdr, pcm]));
    console.log(name.padEnd(9), 'peak', r.pk, ' rms L/R', r.rmsL, r.rmsR, ' side', r.side, ' low/high', r.lowHigh, r.clip ? ' CLIPPED ' + r.clip : '');
  }
  console.log('errors', errs.length ? errs.slice(0, 5) : 'none'); await b.close();
})();
