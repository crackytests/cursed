'use strict';
// ================= YOKO — adventure scenes: the detective-game half =================
// A scene: { title, bg, people(), look(), talk(), translate(), think(), suggest(), move(), enter() }
// Each list function returns { 'LABEL': async () => {...} } and is re-read every time, so flags change what's there.
const ADV = { cur: null, flags: {}, visited: {}, t: 0, loop: false, hint: '', mood: 0, lead: null };
const SCN = {};
const FL = k => !!ADV.flags[k];
const setFL = (k, v = 1) => { ADV.flags[k] = v; };
async function goScene(id) {
  sfx('door'); await fadeOut(.12);
  ADV.cur = id; ADV.t = 0; scene = advScene;
  const S = SCN[id]; await fadeIn(.12);
  if (!ADV.visited[id]) { ADV.visited[id] = 1; if (S.enter) await S.enter(); }
  saveY();
}
const endChapter = () => { ADV.loop = false; };
const CMDS = [['LOOK', 'look'], ['TALK', 'talk'], ['TRANSLATE', 'translate'], ['THINK', 'think'], ['SUGGEST', 'suggest'], ['MOVE', 'move']];
async function advLoop() {
  ADV.loop = true;
  while (ADV.loop) {
    const S = SCN[ADV.cur];
    const avail = CMDS.filter(([, k]) => S[k] && (k === 'think' || Object.keys(S[k]()).length));
    DBG.mode = 'adv';
    const i = await choose(avail.map(c => c[0]));
    DBG.mode = null;
    const [label, key] = avail[i];
    if (key === 'think') { await S.think(); continue; }
    const L = S[key](), names = Object.keys(L);
    const j = names.length === 1 && key !== 'move' ? 0 : await choose(names, { y: 24, cancel: 1 });
    if (j < 0) continue;
    DBG.last = label + ' ' + names[j];
    await L[names[j]]();
  }
}
// the busts on stage (up to three), and Yoko's own face, bottom left, always
const advScene = {
  update() { ADV.t++; },
  draw() {
    const S = SCN[ADV.cur]; if (!S) return cls(BLACK);
    S.bg(ADV.t, S);
    const P = S.people ? S.people() : [];
    P.forEach((n, i) => { const p = (S.portOf && S.portOf(n)) || PORT[n]; if (!p) return; const x = Math.round((i + 1) * W / (P.length + 1)) - 36, y = 150 - 72; rectF(x - 2, y - 2, 76, 74, BLACK); drawScaled(p.s, x, y, p.P, 1.5); frameRect(x - 2, y - 2, 76, 74, UI.edge); rectF(x - 2, y + 64, 76, 10, hex('#101a48')); text(n.length > 12 ? n.split(' ').pop() : n, x + 36 - Math.min(12, n.length > 12 ? n.split(' ').pop().length : n.length) * 3, y + 65, UI.name, 0); });
    rectF(0, 0, S.title.length * 6 + 10, 11, BLACK); text(S.title, 4, 2, UI.name, 0);
    // bottom: Yoko, and what she's thinking about
    rectF(0, 150, W, 74, hex('#0c1234')); rectF(0, 150, W, 1, UI.edge);
    const yp = ADV.mood ? CAST.mood.YOKO.smile : PORT.YOKO; draw(yp.s, 6, 164, yp.P); frameRect(6, 164, 48, 48, UI.edge);
    text('YOKO', 12, 154, UI.name, 0);
    if (ADV.hint) wrapT('NOW: ' + ADV.hint, 18).slice(0, 5).forEach((l, i) => text(l, 60, 160 + i * 11, UI.dim, 0));
    if (ADV.lead) { const lp = PORT[ADV.lead]; if (lp) { text('WITH', 176, 154, UI.dim, 0); for (let j = 0; j < 30; j++) for (let k = 0; k < 30; k++) { const c = lp.s.d[(8 + j) * 48 + 9 + k]; if (c) pset(178 + k, 164 + j, lp.P[c]); } frameRect(177, 163, 32, 32, UI.edge); } }
  },
};
// a line said "to the room": the lead reacts
async function lead(s) { if (ADV.lead) await say(s, ADV.lead); }
