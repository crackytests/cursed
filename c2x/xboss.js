'use strict';
// ================= CARL 2 EXTREME: bosses =================
// each boss is an arena: walls close at LV.def.boss.at and 19 tiles later, the camera locks, the boss shows up.
function startArena() {
  const at = LV.def.boss.at;
  ARENA = { x0: at * TS, x1: (at + 20) * TS, saved: [] };
  for (const cx of [at, at + 19]) for (let y = 0; y < LV.h; y++) if (LV.g[y][cx] !== '#') { ARENA.saved.push([cx, y, LV.g[y][cx]]); LV.g[y][cx] = '#'; }
  LV.lock = ARENA.x0; music(null); sfx('alert');
  for (const e of ENTS) if (e.foe && !e.dead && e.x > ARENA.x0 - 8 && e.x < ARENA.x1) { e.dead = 1; FX.push({ k: 'puff', x: e.x + e.w / 2, y: e.y + e.h / 2, t: 20 }); }
  const me = ARENA;
  run(async () => {
    CUT = 1; await wait(40); if (ARENA !== me) { CUT = 0; return; }
    BOSS = BOSSES[LV.def.boss.id](); music(BOSS.music || 'boss');
    // CARL 2's focus group is still on payroll: every loss here makes the boss easier
    const n = Math.min(3, RUN.nerf[LV.def.id] || 0);
    if (n) { BOSS.hp = BOSS.max = Math.round(BOSS.max * (1 - .15 * n)); banner('FOCUS GROUP: TOO HARD. NERFED ' + n * 15 + '%', 160); } else banner(BOSS.name, 140);
    if (BOSS.intro) await BOSS.intro(); CUT = 0;
  });
}
function resetBoss() { // Carl died in the arena: open it back up; walking in again restarts the fight
  if (BOSS) RUN.nerf[LV.def.id] = (RUN.nerf[LV.def.id] || 0) + 1;
  if (ARENA) for (const [x, y, c] of ARENA.saved) LV.g[y][x] = c;
  ARENA = null; BOSS = null; LV.lock = null; SHOTS = [];
}
function openArena() { for (const [x, y, c] of ARENA.saved) if (x === LV.def.boss.at + 19) LV.g[y][x] = c; LV.lock = null; }
function bossDown(B, then) {
  B.dying = 1; music(null); sfx('crash'); post.shake = 4; SHAKE = 60; SHOTS = [];
  run(async () => {
    CUT = 1;
    for (let i = 0; i < 24; i++) { FX.push({ k: 'spark', x: B.x + rnd(B.w), y: B.y + rnd(B.h), vx: (Math.random() - .5) * 5, vy: -Math.random() * 4, t: 30 }); if (i % 4 === 0) sfx('stun'); await wait(4); }
    BOSS = null; await wait(30); CUT = 0;
    await then();
  });
}
function bossHitFlash(B) { B.flash = 12; sfx('stun'); post.shake = 2; SHAKE = 6; }

const BOSSES = {
  // ---------------- 2: ROBO MALL COP. walks, charges, stomps ----------------
  robo() {
    const x0 = ARENA.x0, floor = 12 * TS;
    const B = { name: 'ROBO MALL COP', hp: 12, max: 12, x: x0 + 15 * TS, y: floor - 40, w: 28, h: 40, dir: -1, st: 'walk', t: 0, flash: 0, vy: 0,
      hitbox() { return this.dying ? { x: -999, y: 0, w: 0, h: 0 } : { x: this.x + 2, y: this.y, w: this.w - 4, h: this.h }; },
      hit() { this.hp -= this.st === 'dizzy' ? 2 : 1; bossHitFlash(this); if (this.hp <= 0) bossDown(this, async () => { quip('HALL MONITOR. DOWN.'); openArena(); }); },
      fire(z) { if (!this.dying && frame % 10 === 0 && overlap(z, this.hitbox())) this.hit(); },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const s = this.st;
        if (s === 'walk') { this.dir = PL.x < this.x + 14 ? -1 : 1; this.x += this.dir * (this.hp < 7 ? 1.3 : .9); if (this.t > 110) { this.t = 0; this.st = Math.random() < .5 ? 'wind' : 'hop'; if (this.st === 'wind') sfx('alert'); } }
        else if (s === 'wind') { if (this.t > 34) { this.t = 0; this.st = 'charge'; } }
        else if (s === 'charge') { this.x += this.dir * 5.2; if (this.x < x0 + 16 || this.x > x0 + 18 * TS - this.w) { this.x = clamp(this.x, x0 + 16, x0 + 18 * TS - this.w); this.st = 'dizzy'; this.t = 0; sfx('crash'); post.shake = 3; SHAKE = 14; } }
        else if (s === 'dizzy') { if (this.t > 80) { this.st = 'walk'; this.t = 0; } }
        else if (s === 'hop') {
          if (this.t === 1) { this.vy = -7.5; this.tx = PL.x - 10; }
          this.vy += .3; this.y += this.vy; this.x += clamp(this.tx - this.x, -2.4, 2.4);
          if (this.y >= floor - 40) { this.y = floor - 40; this.st = 'walk'; this.t = 0; sfx('crash'); post.shake = 3; SHAKE = 10;
            for (const d of [-1, 1]) SHOTS.push({ x: this.x + 10 + d * 12, y: floor - 9, w: 10, h: 9, vx: d * 2.6, vy: 0, t: 140, wave: 1, solid: 0 }); }
        }
        if (!PL.dead && overlap(PL, this.hitbox())) ouch(1, 'boss', this.hitbox().x + this.hitbox().w / 2);
      },
      draw() {
        const f = this.st === 'charge' || this.st === 'wind' ? 2 : (this.t >> 3) & 1;
        draw(XS.robo[f], this.x - camX + (this.st === 'wind' ? rnd(3) - 1 : 0), this.y - camY, XP.robo, this.dir < 0, this.flash & 2 ? WHITE : 0);
        if (this.st === 'dizzy') for (let i = 0; i < 3; i++) text('*', this.x + 8 + Math.cos(frame * .1 + i * 2) * 10 - camX, this.y - 6 + Math.sin(frame * .1 + i * 2) * 3 - camY, hex('#ffdb24'));
        for (const s of SHOTS) if (s.wave) { rectF(s.x - camX, s.y - camY, s.w, s.h, hex('#ffdb24')); rectF(s.x + 2 - camX, s.y + 2 - camY, s.w - 4, s.h - 2, hex('#ff6d24')); }
      },
    };
    return B;
  },

  // ---------------- 4: MOBY DICK (UNABRIDGED). only the open mouth takes a hit ----------------
  moby() {
    const x0 = ARENA.x0, WORDS = ['CALL', 'ME', 'ISHMAEL', 'SOME', 'YEARS', 'AGO'];
    const B = { name: 'MOBY DICK (UNABRIDGED)', hp: 8, max: 8, x: x0 + 13 * TS, y: 5 * TS, w: 80, h: 42, dir: -1, t: 0, flash: 0, open: 0, wi: 0, by: 5 * TS,
      mouth() { return { x: this.dir < 0 ? this.x - 6 : this.x + this.w - 30, y: this.y + 14, w: 36, h: 26 }; },
      hitbox() { return this.dying ? { x: -999, y: 0, w: 0, h: 0 } : { x: this.x, y: this.y + 4, w: this.w, h: this.h - 8 }; },
      hit(b) {
        if (!this.open || !overlap({ x: b.x - 6, y: b.y - 6, w: 12, h: 12 }, this.mouth())) { sfx('land'); if (!FX.some(f => f.s === 'CLONK')) FX.push({ k: 'txt', s: 'CLONK', x: b.x - 10, y: b.y, t: 40 }); return; }
        this.hp--; this.open = 0; bossHitFlash(this);
        if (this.hp === 4) quip('THE END? NO. CHAPTER 2.', this);
        if (this.hp <= 0) bossDown(this, async () => { quip('SPARKNOTES\'D.'); openArena(); });
      },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        const sp = this.hp <= 4 ? 1.15 : .75;
        if (!this.open) this.x += this.dir * sp; // he stops to read aloud
        if (this.x < x0 + 20) this.dir = 1; if (this.x > x0 + 18 * TS - this.w) this.dir = -1;
        this.by += clamp(PL.y - 10 - this.by, -.13, .13) * (this.hp <= 4 ? 2 : 1); this.by = clamp(this.by, 4 * TS, 7 * TS); // the lakebed is always safe this.y = this.by + Math.sin(this.t * .03) * 10;
        if (this.t % 150 === 100) { this.open = 70; sfx('crowd'); }
        if (this.open > 0) {
          this.open--;
          if (this.open % 32 === 0) { const w = WORDS[this.wi++ % WORDS.length], m = this.mouth(); for (let i = 0; i < w.length; i++) SHOTS.push({ ch: w[i], x: m.x + 8 + (this.dir > 0 ? i : i - w.length + 1) * 10, y: m.y + 4 + i * 2, w: 9, h: 11, vx: this.dir * (.9 + i * .06), vy: (PL.y - m.y) / 320, t: 260, bongable: 1, solid: 0 }); }
        }
        if (!PL.dead && overlap(PL, this.hitbox())) ouch(1, 'boss', this.hitbox().x + this.hitbox().w / 2);
      },
      draw() {
        draw(XS.moby[this.open > 0 ? 1 : 0], this.x - camX, this.y - camY, XP.moby, this.dir < 0, this.flash & 2 ? WHITE : 0);
        if (this.open > 0 && (frame & 8)) { const m = this.mouth(); frameRect(m.x - camX, m.y - camY, m.w, m.h, hex('#ffdb24')); }
      },
    };
    return B;
  },

  // ---------------- 5: DYSLEXIO. burn the shield, then bong him ----------------
  // He's dyslexic, and he's Magneto about it: dyslexics are the superior life form, everyone else is HOMO BASIC.
  // His shield is a word; each time he raises it again it's rearranged into another word (DANGER, GARDEN...).
  dys() {
    const x0 = ARENA.x0, LINES = ['HOMO BASIC. LOOK UPON US.', 'WE ARE THE NEXT STEP, CARL.', 'YOU READ LEFT TO RIGHT. LIKE A PRISONER.', 'EVERY WORD IS EVERY OTHER WORD.', 'THE DICTIONARY IS INCOMPLETE.', 'THEY CALLED IT A DISORDER. IT IS AN ORDER.'],
      WORDS = ['DANGER', 'GARDEN', 'SILENT', 'LISTEN', 'REACTION', 'CREATION', 'EVIL', 'LIVE'];
    const B = { name: 'DYSLEXIO', music: 'human', hp: 12, max: 12, x: x0 + 12 * TS, y: 3 * TS, w: 40, h: 54, t: 0, flash: 0, low: 0, shield: [], regen: 0, cast: 0, wi: -1,
      hitbox() { return this.dying ? { x: -999, y: 0, w: 0, h: 0 } : { x: this.x + 8, y: this.y + 4, w: 24, h: 46 }; },
      raise() { const w = WORDS[this.wi = (this.wi + 1) % WORDS.length]; this.word = w; this.shield = w.split('').map((ch, i) => ({ ch, a: i / w.length * 6.283, alive: 1 })); sfx('glitch'); },
      async intro() { await wait(10);
        quip('CARL. YOU DO NOT READ EITHER.', this, 70); await wait(60); quip('NOPE.', PL, 40); await wait(35);
        quip('NOT READING IS NOT A GIFT, CARL.', this, 65); await wait(55); quip('IT IS JUST NOT READING.', this, 55); await wait(50);
        quip('...WE READ EVERY VERSION.', this, 90); await wait(40); },
      hit(b) {
        if (this.shield.some(s => s.alive)) { sfx('land'); if (!FX.some(f => f.s === 'CLINK')) FX.push({ k: 'txt', s: 'CLINK', x: b.x - 10, y: b.y, t: 40 }); if (!this.toldShield) { this.toldShield = 1; quip('BURN THE LETTERS.', PL); } return; }
        this.hp--; bossHitFlash(this);
        if (this.hp % 4 === 0 && this.hp > 0) { this.daze = 0; this.raise(); quip(pick(LINES), this, 100); this.t = 0; }
        if (this.hp <= 0) { quip('WE MEANT EVERY VERSION.', this, 120); bossDown(this, () => LV.finish('clear')); }
      },
      fire(z) {
        if (this.dying) return;
        z = { x: z.x, y: z.y - 14, w: z.w, h: z.h + 26 }; // the flame licks up a bit at a paper shield
        for (const s of this.shield) if (s.alive) { const p = this.sp(s); if (overlap(z, { x: p.x - 4, y: p.y - 5, w: 9, h: 11 })) { s.alive = 0; sfx('crash'); FX.push({ k: 'puff', x: p.x, y: p.y, t: 18 }); if (!this.shield.some(q => q.alive)) { this.daze = 240; carlSays('burn', 1); quip(this.word + '. GONE. FOR NOW.', this, 70); SHOTS = SHOTS.filter(q => !q.ch); } } }
      },
      sp(s) { return { x: this.x + 20 + Math.cos(s.a) * 30, y: this.y + 26 + Math.sin(s.a) * 22 }; },
      update() {
        if (this.dying) return; this.t++; if (this.flash > 0) this.flash--;
        for (const s of this.shield) s.a += .035;
        // no shield: he's dazed, sinks to the floor and can be bonged. then he rewrites himself
        if (this.daze > 0) {
          this.y += clamp(12 * TS - 54 - this.y, -3, 3); this.x += Math.sin(this.t * .2) * .4;
          if (--this.daze === 0) { const old = this.word; this.raise(); quip(old + '. ' + this.word + '. SAME LETTERS.', this, 100); this.t = 0; }
          return;
        }
        const phase = this.hp > 8 ? 1 : this.hp > 4 ? 2 : 3;
        // swoop low every so often so the lighter can reach the shield
        const cyc = this.t % 420;
        const side = this.x + 20 > PL.x + 5 ? 1 : -1; // hover beside Carl, not on him
        const tx = cyc > 260 && cyc < 380 ? clamp(PL.x + 5 + side * 58 - 20, x0 + 24, x0 + 17 * TS - 40) : x0 + 9 * TS + Math.sin(this.t * .012) * 6 * TS;
        const ty = cyc > 260 && cyc < 380 ? 12 * TS - 56 : 2 * TS + Math.sin(this.t * .025) * 18;
        this.x += clamp(tx - this.x, -2, 2); this.y += clamp(ty - this.y, -2, 2);
        if (cyc === 60 || (phase > 1 && cyc === 180)) { this.cast = 40; sfx('glitch');
          const n = 4 + phase * 2; for (let i = 0; i < n; i++) SHOTS.push({ ch: pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), x: x0 + 24 + rnd(16 * TS), y: -20 - i * 22, w: 9, h: 11, vx: 0, vy: 1.2, ay: .02, t: 300, burn: 1, bongable: 1, solid: 0 }); }
        if (phase >= 2 && cyc === 120) { PL.scr = 240; quip('LEFT IS RIGHT. IT ALWAYS WAS.', this, 90); sfx('glitch'); post.wave = 3; this.waveT = 60; }
        if (this.waveT > 0 && --this.waveT === 0) post.wave = 0;
        if (phase === 3 && this.t % 90 === 0) { const a = Math.atan2(PL.y - this.y - 20, PL.x - this.x - 20); SHOTS.push({ ch: 'Z', x: this.x + 16, y: this.y + 20, w: 9, h: 11, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, t: 200, burn: 1, bongable: 1, solid: 0 }); }
        if (this.cast > 0) this.cast--;
        if (!PL.dead && overlap(PL, this.hitbox())) ouch(1, 'boss', this.hitbox().x + this.hitbox().w / 2);
      },
      draw() {
        const f = this.cast > 0 ? 2 : (this.t >> 4) & 1;
        draw(XS.dys[f], this.x - camX, this.y - camY, XP.dyx, PL.x < this.x, this.flash & 2 ? WHITE : 0);
        for (const s of this.shield) if (s.alive) { const p = this.sp(s); draw(XS.letterShot[s.ch], p.x - 4 - camX, p.y - 5 - camY, XP.dys); }
        if (this.daze > 0) for (let i = 0; i < 3; i++) text('?', this.x + 16 + Math.cos(frame * .1 + i * 2) * 14 - camX, this.y - 4 + Math.sin(frame * .1 + i * 2) * 3 - camY, hex('#ffdb24'));
      },
    };
    B.raise();
    return B;
  },
};
