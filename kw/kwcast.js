'use strict';
// ================= KONBINI WARS: the six managers (voices, power windows, power effects) =================
// All dialogue is new writing, following the character bibles: Carl's anxious defense, Ghost's presenter's need,
// Linda's competence and vanity under pressure, Face's sincere curiosity, Yoko's clear practicality, JB's noir that notices things.
const PORTKEY = { carl: 'CARL', ghost: 'GHOST', linda: 'LINDA', face: 'FACE', yoko: 'YOKO', jb: 'JB' };
CAST['CEO LINDA'] = { col: C('#ff5aa8'), voice: [620, 60], port: m => portrait('LINDA', m) };
CAST['THE FACE'] = { col: C('#40a8ff'), voice: [440, 30], port: m => portrait('FACE', m) };
CAST.YOKO = { col: C('#30a898'), voice: [760, 40], port: m => portrait('YOKO', m) };
CAST['JB GARFIELD'] = { col: C('#f08a30'), voice: [260, 40], port: m => portrait('JB', m) };

Object.assign(LINES.welcome, { linda: ['WELCOME TO LINDA SELECT', 'YOU HAVE CHOSEN WELL', 'WELCOME, VALUED GUEST'], face: ['WELCOME! TRY SOMETHING NEW!', 'HELLO! WELCOME IN!'],
  yoko: ['WELCOME! NEED HELP?', 'HELLO! LOOKING FOR SOMETHING?'], jb: ['EVENING.', 'COME IN OUT OF THE RAIN', 'WELCOME, STRANGER'] });
Object.assign(LINES.thanks, { linda: ['THANK YOU FOR CHOOSING LINDA', 'COME BACK. SHE INSISTS.'], face: ['THANKS! TELL US WHAT WORKED!', 'THANK YOU!'],
  yoko: ['THANK YOU! TAKE CARE!', 'HAVE A GOOD TRIP!'], jb: ['STAY OUT OF TROUBLE', 'SEE YOU AROUND, PAL'] });
Object.assign(LINES, { face: ['FASCINATING. EVERYONE WANTS ONIGIRI.', 'NOTE TO SELF: MORE SHELVES.', 'IT WORKS! MOSTLY!'],
  yoko: ['EVERYTHING WHERE IT SHOULD BE.', 'FIND EVERYTHING OKAY?', 'LET ME FIX THAT SIGN.'], jb: ['THIS STORE HAS SECRETS.', 'THE LASAGNA IS FRESH. GOOD.', 'NICE NIGHT FOR IT.'] });

// ---------- what each manager says ({R} is the main rival's name) ----------
const TALK = {
  carl: { mood: 'nervous',
    intro: ['Linda says I can have a store in the new wing. A probationary one. As long as it is normal. I can do normal.', '{R} is opening one too. Which is fine. It is a free mall.', 'First, a lot. Click one on the map. Busy corridors mean more customers. The Arrival Concourse is all travelers. Travelers are my people. Human ones.'],
    first: ['A store. My own store. With a door. Okay. This is a normal amount of excitement for a normal human.', 'The little people are customers. If they stand at an empty shelf, click the shelf. It says if we ran out or if the stuff is just sitting in the back.',
      'There is way more stuff in the catalogue than fits on the shelves. I just put out whatever came first. A survey tells us what people actually want. STOCK menu. It costs money but it is like asking, which is normal.',
      'MANAGER on the menu bar has my backdoor delivery. It is a normal delivery. Through a normal door.', 'The arrows at the bottom run time. Two arrows is faster. I would start with one arrow. One arrow is calm.'],
    profit: 'We made money! Real money! Linda, if you are reading the report, that was on purpose.', loss: 'We lost money. That is fine. Humans lose money all the time. It is one of their main hobbies.',
    why: { empty: 'The report says empty shelves cost us the most. We need more stuff on the shelves, or somebody carrying it out faster.', queue: 'People left because the line was too long. Maybe another register. Or a faster person on the register.',
      price: 'Some people said we are too expensive. I said we are normally expensive. The report says lower the markup.', missing: 'People wanted stuff we don\'t sell. A survey would say what. Then we click the shelves and swap things.' },
    win: 'Linda signs the permanent deed. Carl reads it four times.' },
  ghost: { mood: 'proud',
    intro: ['The Mall of the Future. A new wing. A new audience. And at last, a stage that cannot cancel me.', '{R} is opening a shop as well. {R}.', 'Choose a lot on the map. The Occult Passage is where my public walks. Adventurers. Spirits. People who stay up late.'],
    first: ['Ladies. Gentlemen. Restless dead. Welcome... to SPOOKY MART.', 'Click any shelf and it will confess why it is empty. Click any customer and they will tell you their desires. Within reason.',
      'The shelves hold a fraction of the catalogue. I have filled them on instinct. To learn what the public truly desires: a survey, from the STOCK menu. Then click a shelf and recast it.',
      'MANAGER on the menu bar: the Grand Demonstration. Schedule it, staff the registers, and watch them come. They always come.'],
    profit: 'Profit. Naturally. Put it on the poster.', loss: 'A loss. The great ones always have a loss in the second act.',
    why: { empty: 'The empty shelves wounded us most. An empty shelf is a stage with no performer.', queue: 'They fled the line. Even a legend needs a second register.',
      price: 'Some found our prices too high. Art has a price. Apparently it is lower than mine.', missing: 'They asked for things we do not carry. A survey would name them. Then we recast the shelves.' },
    win: 'Ghost has the opening night he always said he had.' },
  linda: { mood: 'smug',
    intro: ['I built this mall. I wrote its rules. And to prove the rules are fair, I will win under them.', '{R} has opened a store in MY wing. Charming. Let us see whether charm survives a quarterly report.', 'Select a lot. Somewhere worthy of the brand. Footfall is merely people who have not yet chosen me.'],
    first: ['Linda Select is open. Do try to keep the shelves as immaculate as the signage.', 'If a shelf is empty, click it. It will explain itself. Everything in my mall explains itself to me.',
      'The catalogue is larger than our shelves. A survey, from the STOCK menu, tells you what they want. Then you give them the version with my name on it.',
      'MANAGER: the Brand Contract. Cheaper premium lines, a fee for every store, and a specialty display in each one. Sign when the numbers say yes. Only then.'],
    profit: 'Profit. As forecast. Frame the report.', loss: 'A loss. Unacceptable, and also temporary. Find the cause before I do.',
    why: { empty: 'Empty shelves. In a Linda Select. Restock faster, or order deeper.', queue: 'My customers waited in line. Customers do not wait for me. Another register.',
      price: 'They called my prices high. My prices are correct. Lower them anyway.', missing: 'They asked for products we do not carry. A survey. Then the shelves.' },
    win: 'The wing is hers. Fairly, this time, which she finds she enjoys.' },
  face: { mood: 'idea',
    intro: ['A store! A real one. A place where an idea meets a customer and finds out if it was any good.', '{R} is opening nearby. Excellent. A control group.', 'First we need a lot. Somewhere with lots of students. They\'re the ones who try new things.'],
    first: ['The Potential Store is open. I want to watch everything at once. I can\'t. That\'s a design problem for later.', 'Click a shelf to see why it\'s empty. Click a person to see what they came for. It\'s like reading minds, with less paperwork.',
      'There\'s more in the catalogue than fits. A survey from the STOCK menu tells us what people actually want, which is rarely what I\'d guess.',
      'MANAGER: the Pilot Batch. We test one of our own products for a day. It might get better. It might get recalled. That\'s what testing is for.'],
    profit: 'We made money. I\'d like to know exactly why, so we can do it on purpose.', loss: 'We lost money. Data! Unpleasant data, but data.',
    why: { empty: 'The best sellers ran out. The fix is boring: more stock, faster restocking. I respect boring fixes.', queue: 'People left the line. Throughput problem. More registers, or faster hands.',
      price: 'Too expensive, they said. A price is a hypothesis. Let\'s lower it and test.', missing: 'People came for things we don\'t carry. Survey first, then rearrange.' },
    win: 'He built something people come back to. That was the real experiment.' },
  yoko: { mood: 'happy',
    intro: ['A store for people who came here to get something done. Let\'s make it easy for them.', '{R} is opening too. That\'s fine. We\'ll just be the place that has what they need.', 'Pick a lot on the map. Travelers pass through the Arrival Concourse. They need a lot, and they\'re in a hurry.'],
    first: ['We\'re open. Signs first, then everything where people expect it.', 'If a shelf is empty, click it. It tells you if we\'re out, or if the stock is waiting in the back.',
      'We can\'t carry everything. A survey, from STOCK, tells us what people came in for. I\'d rather ask than guess.',
      'MANAGER: Need Kits. Two things people buy together, one sign, one price. Only if both are in stock. Otherwise it\'s just a sign.'],
    profit: 'We came out ahead. Mostly by having the right things on the shelves.', loss: 'We lost money this month. Let\'s read the report before we change anything.',
    why: { empty: 'They needed it and it was gone. Order deeper on the fast sellers.', queue: 'The line was too long. Another register, or a faster cashier. Kits take a little longer at the till, too.',
      price: 'Our prices pushed people away. Let\'s bring them down a little.', missing: 'They wanted things we don\'t stock. A survey will say which.' },
    win: 'Everyone who came in left with what they needed. That\'s the whole job, really.' },
  jb: { mood: 'cool',
    intro: ['The mall. Neon and fluorescent. A man could lose himself here. A cat could open a store.', '{R} set up shop across the way. Every story needs a rival. Mine just has worse coffee.', 'First, a location. Somewhere the night people walk. I\'ll know it when I see it.'],
    first: ['Midnight Convenience. Open for business. The coffee\'s hot and the lasagna\'s hotter.', 'An empty shelf is a clue. Click it. It\'ll talk. They always talk.',
      'There\'s more product than shelf. A survey, from the STOCK menu, tells you what the public wants. Some guys need a survey. I need a case.',
      'MANAGER: the Customer Case. Once a day I dig into what we\'re missing. A few hours later I come back with a name. Stock it fast and they come back as regulars.'],
    profit: 'The numbers came back black. I didn\'t even have to lean on anybody.', loss: 'Red ink. The city doesn\'t care how cool you look doing the books.',
    why: { empty: 'The shelf was empty. The customers were gone. Somewhere a delivery schedule knew more than it was saying.', queue: 'They walked out of a line. A line, kid. Get another register.',
      price: 'Prices too steep. Even in this town, people have limits.', missing: 'They came in for something we don\'t carry. Open a case. Or run a survey, if you like your clues in bulk.' },
    win: 'The neighborhood is his. Not because he was loud. Because he was there when they needed him.' },
};
const rivalName = () => { const r = G.chains.find(c => !c.player); return r ? MGRS[r.mgr].n.replace('CEO ', '').replace('THE ', '') : 'NOBODY'; };
const tline = s => s.replace(/\{R\}/g, rivalName().replace(/\b\w+/g, w => w[0] + w.slice(1).toLowerCase()));
async function talkList(lines, mood) { const who = BOSS(); for (const l of lines) await say(tline(l), who, { mood }); }

// ---------- the power windows for the four new managers ----------
const POWERUI = {
  linda(st, x, y, w, h) {
    const c = playerChain(), ss = storesOf(0), fee = CONTRACT.fee * ss.length;
    wrapT('Supplier-backed: your lines and every PREMIUM item cost ' + Math.round(CONTRACT.cut * 100) + '% less, for ' + CONTRACT.months + ' months. Fee ' + mc(CONTRACT.fee) + ' per store per month. Every store must keep a specialty display, or pays triple.', 33).forEach((l, i) => ink(l, x + 2, y + 2 + i * 9, WIN.dim));
    let save = 0; for (const s of ss) for (const pid of carried(s)) { const p = PRODUCTS[pid]; if (p.mgr === 'linda' || p.tags.includes('premium')) save += (s.sold[pid] || 0) * 32 * p.cost * CONTRACT.cut; }
    ink('FEE / MONTH', x + 2, y + 66); ink(mc(fee), x + 90, y + 66, WIN.red); ink('EST. SAVING', x + 2, y + 76); ink(mc(save), x + 90, y + 76, save > fee ? WIN.green : WIN.red);
    if (c.contract) { ink('SIGNED. ' + (c.contract.until - G.months) + ' MONTH(S) LEFT.', x + 2, y + 90, WIN.title); if (btn(x + 2, y + h - 16, w - 4, 'CANCEL  (' + mc(fee) + ')', { h: 14 })) { const r = cancelContract(0); if (r) alertBox(r); } }
    else if (btn(x + 2, y + h - 16, w - 4, 'SIGN THE CONTRACT', { h: 14, off: !ss.length })) { const r = signContract(0); if (r) alertBox(r); else sfx('cash'); }
  },
  face(st, x, y, w, h) {
    const c = playerChain(), ps = prodsIn('spec', 'face', G.months); POWERUI.sel = POWERUI.sel || ps[0].id;
    wrapT('Test one of our products for a day (' + mc(PILOT.cost) + '). ' + Math.round(PILOT.good * 100) + '% it gets better for good, ' + Math.round(PILOT.meh * 100) + '% no change, ' + Math.round((1 - PILOT.good - PILOT.meh) * 100) + '% recall (refunds ' + mc(PILOT.refund) + ').', 33).forEach((l, i) => ink(l, x + 2, y + 2 + i * 9, WIN.dim));
    ps.forEach((p, i) => { const yy = y + 40 + i * 11, b = (G.boost || {})[p.id] || 1; if (POWERUI.sel === p.id) rectF(x, yy - 1, w, 11, mix(WIN.sel, WIN.face, .65)); if (!c.pilot && rowHit(x, yy - 1, w, 11)) POWERUI.sel = p.id;
      ink(p.n, x + 4, yy); if (b !== 1) ink((b > 1 ? '+' : '') + Math.round((b - 1) * 100) + '%', x + 150, yy, b > 1 ? WIN.green : WIN.red); });
    if (c.pilot) ink('TESTING ' + PRODUCTS[c.pilot.pid].n + '...', x + 2, y + 88, WIN.title); else if (c.lastPilot) ink('LAST: ' + PRODUCTS[c.lastPilot.pid].n.slice(0, 14) + ' ' + { good: 'BETTER', meh: 'SAME', bad: 'RECALLED' }[c.lastPilot.res], x + 2, y + 88, WIN.dim);
    if (btn(x + 2, y + h - 16, w - 4, 'RUN THE PILOT', { h: 14, off: !!c.pilot || c.cash < PILOT.cost })) { const r = startPilot(0, POWERUI.sel); if (r) alertBox(r); else sfx('ok'); }
  },
  yoko(st, x, y, w, h) {
    const c = playerChain(), have = new Set(carried(st));
    ink('KIT (BOTH IN STOCK HERE?)  ' + (c.kits || []).length + '/' + KIT_MAX, x + 2, y + 2, WIN.dim);
    KITS.forEach((k, i) => { const yy = y + 13 + i * 11, on = (c.kits || []).includes(k.id), ok = have.has(k.a) && have.has(k.b);
      if (on) rectF(x, yy - 1, w, 11, mix(C('#30a898'), WIN.face, .55)); if (rowHit(x, yy - 1, w, 11)) { const r = toggleKit(0, k.id); if (r) alertBox(r); else sfx(on ? 'tick' : 'cash'); }
      ink(k.n, x + 4, yy, on ? WIN.ink : WIN.ink); ink(ok ? 'YES' : 'NO', x + 96, yy, ok ? WIN.green : WIN.red); ink((PRODUCTS[k.a].n.split(' ')[0] + '+' + PRODUCTS[k.b].n.split(' ')[0]).slice(0, 15), x + 120, yy, WIN.dim); });
    wrapT('Click to start or stop a kit (' + mc(KIT_SETUP) + ' for signs). ' + Math.round(KIT_DISC * 100) + '% off both. Slower checkout.', 33).forEach((l, i) => ink(l, x + 2, y + h - 19 + i * 9, WIN.dim));
  },
  jb(st, x, y, w, h) {
    const c = playerChain();
    wrapT('Once a day, JB works a case on this store (' + mc(CASE_COST) + '). In ' + CASE_HOURS + ' hours he comes back with one precise clue. Stock a missing product within two days and the regulars come back.', 33).forEach((l, i) => ink(l, x + 2, y + 2 + i * 9, WIN.dim));
    if (st.caseAt) ink('ON THE CASE. BACK AT ' + ((st.caseAt % TPD) / 300 | 0) + ':00.', x + 2, y + 52, WIN.title);
    else if (st.clue) { wrapT('"' + st.clue.s + '"', 33).forEach((l, i) => ink(l, x + 2, y + 52 + i * 9, st.clue.done ? WIN.green : WIN.title)); if (st.clue.done) ink('CASE CLOSED.', x + 2, y + 80, WIN.green); }
    if (btn(x + 2, y + h - 16, w - 4, 'OPEN A CASE', { h: 14, off: !!c.usedPower || !!st.caseAt })) { const r = openCase(st); if (r) alertBox(r); else sfx('ok'); }
  },
};
function onClue(st) { if (st.chain !== 0) return; run(async () => { const was = SPEED; SPEED = 0; await say(st.clue.s + (st.clue.kind === 'miss' ? ' Stock it in the next two days and they\'ll come back. Click a shelf to swap it in.' : ''), 'JB GARFIELD', { mood: 'cool' }); SPEED = was; }); }

// ---------- power effects on screen ----------
{ const _fx = onFx; onFx = function (st, k, a, b) { _fx(st, k, a, b); if (st !== curStore()) return;
  const [ox, oy, sw] = storeOrigin(st);
  if (k === 'contract') { BANNERFX = { s: 'BRAND CONTRACT SIGNED', t: 150, col: '#c09020' }; confetti(ox + sw / 2, oy + 40, 20); sfx('cash'); }
  if (k === 'pilot') { if (b === 'start') { BANNERFX = { s: 'PILOT BATCH: TESTING', t: 130, col: '#2070c0' }; st.labT = TPD; }
    else { st.labT = 0; BANNERFX = { s: { good: 'PILOT: IT WORKS!', meh: 'PILOT: NO CHANGE', bad: 'PILOT: RECALL!' }[b], t: 150, col: b === 'good' ? '#20a040' : b === 'meh' ? '#707070' : '#c02020' }; if (b === 'good') confetti(ox + sw / 2, oy + 40, 24); else if (b === 'bad') st.redT = 30; } }
  if (k === 'kit') { const [px, py] = agentXY(st, a); P({ kind: 'text', s: 'KIT!', x: px - 2, y: py - 4, vy: -.4, max: 45, c: C('#20a090') }); if (Math.random() < .3) say2(st, a, pick2(['BOTH? PERFECT.', 'THAT\'S EASY.', 'JUST WHAT I NEEDED']), '#208070', 55); }
  if (k === 'case') { if (b === 'open') { st.caseT = 1; BANNERFX = { s: 'JB IS ON THE CASE', t: 120, col: '#a05020' }; } else if (b === 'clue') { st.caseT = 0; BANNERFX = { s: 'CASE NOTES', t: 120, col: '#704020' }; } else if (b === 'closed') { BANNERFX = { s: 'CASE CLOSED', t: 150, col: '#c07020' }; confetti(ox + sw / 2, oy + 40, 20); } }
}; }
{ const _top = fxTop; fxTop = function (st, ox, oy, sw, sh) {
  // Face's lab: sparks off the specialty display while a pilot runs
  if (chainOf(st).pilot && (frame & 7) === 0) { const sp = st.fix.find(f => f.k === 'spec'); if (sp) { const [x, y] = fixXY(st, sp); P({ kind: 'spark', x: x + Math.random() * 24, y: y + Math.random() * 6, vy: -.4, max: 24, c: C('#80e0ff') }); } }
  // Linda's contract: gold on every specialty display
  if (chainOf(st).contract && (frame & 15) === 0) for (const f of st.fix) if (f.k === 'spec') { const [x, y] = fixXY(st, f); P({ kind: 'spark', x: x + Math.random() * 24, y: y + Math.random() * 14, vy: -.2, max: 20, c: C('#ffe060') }); }
  // Yoko's kits: a little teal tag on any shelf holding half of an active kit
  const kits = chainOf(st).kits || []; if (kits.length && (frame >> 5) & 1) for (const f of st.fix) if (f.p.some(p => kits.some(id => { const k = KITS.find(k => k.id === id); return k.a === p || k.b === p; }))) { const [x, y] = fixXY(st, f); rectF(x + 14, y - 2, 10, 7, C('#30a898')); text('K', x + 16, y - 2, C('#ffffff'), 0); }
  // JB's magnifying glass, sweeping the floor while he works the case
  if (st.caseAt) { const t = frame * .03, mx = ox + sw / 2 + Math.cos(t) * (sw / 3), my = oy + BACK_H + 40 + Math.sin(t * 1.3) * 30; ellF(mx, my, 5, 3.5, C('#a0c8ff')); frameR(mx - 5, my - 4, 10, 8, C('#604020')); lineF(mx + 4, my + 3, mx + 9, my + 8, C('#604020'), 2); }
  _top(st, ox, oy, sw, sh);
}; }
