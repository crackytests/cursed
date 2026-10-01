'use strict';
// ================= THE END: a Pretend Co. gaiden that plays backwards. Core: the reversed world =================
// It loads SAVE THE WORLD whole, then turns it around: the music plays backwards, people talk backwards,
// the hero walks backwards, chests take things back, levels and money go down, and every map forgets its old story.
const REV = { raw: 0, progress: 0 };
// ---------- talking backwards: in the background, every line's sentences come out in reverse order ----------
const _sayF = say;
function revSentences(s) { const parts = String(s).match(/[^.!?]+[.!?]*\s*/g); return parts && parts.length > 1 ? parts.map(p => p.trim()).reverse().join(' ') : String(s); }
say = function (s, who, o = {}) { return _sayF(REV.raw || o.raw ? s : revSentences(s), who, o); };
// scenes in THE END are written already reversed, so they talk plainly
const R = (s, who, o) => _sayF(s, who, o || {});
// ---------- the soundtrack, played backwards ----------
(() => {
  for (const k in TRACKS) {
    const t = TRACKS[k]; if (!t.ch) continue;
    for (const c of t.ch) {
      const toks = c.n.trim().split(/\s+/), L = toks.length, ev = [];
      for (let i = 0; i < L; i++) { if (toks[i] === '-' || toks[i] === '.') continue; let len = 1; while (i + len < L && toks[i + len] === '-') len++; ev.push([i, len, toks[i]]); }
      const out = Array(L).fill('.');
      for (const [i, len, k2] of ev) { const s = L - (i + len); out[s] = k2; for (let j = 1; j < len; j++) out[s + j] = '-'; }
      c.n = out.join(' ');
    }
  }
})();
// ---------- walking backwards: the sprite faces the way it came ----------
const FLIPDIR = { u: 'd', d: 'u', l: 'r', r: 'l' };
drawLead = function (x, y) {
  const id = G.party[0] || 'yoko', who = id === 'kid' ? (hero('kid').aspect || 'kid') : flag('armor') && ART.hero['armor_' + id] ? 'armor_' + id : id;
  const f = PL.mv ? 3 - ((PL.f >> 3) & 3) : 0, d = FLIPDIR[PL.dir];
  draw(ART.field(who, d, f), x, y, REV.gen1 ? legacyPal(ART.pal(who), REV.gen1) : ART.pal(who), d === 'r');
};
// ---------- every map forgets its old story (THE END gives them new, backwards ones) ----------
function forgetStories() {
  for (const id in MAPS) {
    const d = MAPS[id];
    d.enter = null; d.steps = {}; d.onStep = null; d.signs = {};
    d.exits = (d.exits || []).filter(e => !e.run).map(e => Object.assign({}, e, { no: null, if: null }));
    if (d.npcs) { const orig = d.npcs; d.npcs = () => orig().filter(n => !(n.who && HEROES[n.who]) && !n.id).map(n => { const n2 = Object.assign({}, n); delete n2.if;
      const src = n.talk ? n.talk.toString() : '';
      if (n.talk && !/for \(const l of lines\)|inn\(/.test(src)) n2.talk = /shop\(/.test(src) ? async () => { await say('THANK YOU. COME AGAIN. ...THEY HAND YOU A REFUND FOR SOMETHING YOU HAVEN\'T BOUGHT YET.', 'SHOPKEEPER'); } : async () => { await say(pick(['...SEE YOU. HELLO.', 'WHO WERE YOU AGAIN? OH. IT\'S YOU.', 'GOODBYE. I MEAN HELLO. I MEAN, NOT YET.', 'WE ALREADY HAD THIS CONVERSATION. WE\'RE ABOUT TO.'])); };
      return n2; }); }
    if (REV.extra[id]) REV.extra[id](d);
  }
  for (const k in PLACES) { const p = PLACES[k]; if (p.run) { p.run = null; p.to = null; } }
  for (const k in PLACES) if (!PLACES[k].to) delete PLACES[k];
}
REV.extra = {};
// ---------- chests take things back ----------
openChest = async function ([x, y, item, n = 1]) {
  const k = M.id + ':' + x + ',' + y;
  if (!G.chests[k]) { await R('THE CHEST IS EMPTY. IT IS WAITING FOR SOMETHING TO BE PUT IN IT.'); return; }
  if (item === 'gp' || GADGETS[item] || invHas(item, n)) {
    if (item === 'gp') G.gp = Math.max(0, G.gp - n); else if (!GADGETS[item]) invAdd(item, -n);
    delete G.chests[k]; sfx('door'); await R('YOU PUT ' + (item === 'gp' ? n + ' GP' : itemName(item) + (n > 1 ? ' x' + n : '')) + ' BACK. SOMEONE WILL FIND IT LATER.');
  } else await R('THIS CHEST IS MISSING ' + itemName(item) + '. YOU DON\'T HAVE IT ANYMORE. IT WILL HAVE TO STAY OPEN.');
};
// ---------- levels go down as the story goes back ----------
function setLevels(lv) {
  const msgs = [];
  for (const r of Object.values(G.roster)) {
    if (!HEROES[r.id] || HEROES[r.id].temp) continue;
    const old = r.lv; lv = Math.max(1, Math.round(lv)); if (lv >= old) continue;
    r.lv = lv; r.xp = totalXP(lv); r.bonus = { str: 0, mag: 0, spd: 0, vit: 0, mdef: 0, hp: 0 };
    r.mhp = heroHP(HEROES[r.id], lv); r.mmp = heroMP(HEROES[r.id], lv); r.hp = Math.min(r.hp, r.mhp); r.mp = Math.min(r.mp, r.mmp);
    for (const s in r.spells) if (!(NATURAL[r.id] || []).some(([l, x]) => x === s && l <= lv) && !r.crystal) delete r.spells[s];
    msgs.push(HEROES[r.id].name + ' IS NOW LEVEL ' + lv + '.');
  }
  return msgs;
}
// the run goes from 1 (the end) down to 0 (the beginning); levels follow it from 99 to 1
async function rewindTo(p) {
  REV.progress = p; const lv = 1 + 98 * p;
  const before = Math.max(0, ...Object.values(G.roster).map(r => r.lv)); setLevels(lv); G.gp = Math.max(0, Math.floor(G.gp * .8));
  const now = Math.max(0, ...Object.values(G.roster).map(r => r.lv));
  if (G.party.length && Math.floor(before / 10) !== Math.floor(now / 10)) { sfx('powerdown'); await R('LEVEL DOWN. EVERYONE IS NOW LEVEL ' + now + '. THEY ARE FORGETTING HOW.'); }
}
// leave someone behind (the opposite of joining)
async function unjoin(id, line) {
  if (!G.roster[id]) return;
  G.party = G.party.filter(k => k !== id); delete G.roster[id];
  if (!G.party.length) { const any = Object.keys(G.roster)[0]; if (any) G.party = [any]; }
  sfx('powerdown'); music(M ? M.def.music : null);
  await R(line || (HEROES[id].name + ' LEFT THE PARTY. THEY WERE ALWAYS GOING TO.'));
}
