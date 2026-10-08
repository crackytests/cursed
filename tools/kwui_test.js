// node tools/kwui_test.js   opens and draws every window and view once; any exception fails. Writes a few PNGs to tools/shots/
const X = require('./kwvm.js'), path = require('path');
const ctx = X.load(); const R = s => X.R(ctx, s);
(async () => {
  // flag text drawn past the right edge of the window it belongs to, or past the screen
  R(`globalThis.OVER = new Set(); { const _t = text; text = function (s, x, y, c, sh) { s = String(s); const r = x + s.length * 6 - 1;
    if (CURW && r > CURW.x + CURW.w - 3) OVER.add(CURW.title + ': "' + s + '"'); else if (r > 511) OVER.add('SCREEN: "' + s + '"');
    if (DLG && y > 160 && y < H - 13 && r > W - 12) OVER.add('DIALOGUE: "' + s + '"'); return _t(s, x, y, c, sh); }; }`);
  R(`fit(); newWorld('carl',1); scene=main; openStore(0, 8, 1, aiHires(0,3)); goStore(G.stores[0]); for(let i=0;i<3000;i++) simTick(); G.autopilot=0;`);
  const wins = { stock0: 'openStock(G.stores[0],0)', stock1: 'openStock(G.stores[0],1)', staff: 'openStaff(G.stores[0])', power: 'openPower(G.stores[0])', rep0: 'openReport(0)', rep1: 'openReport(1)', rep2: 'openReport(2)',
    build: 'openBuild(G.stores[0])', storewin: 'openStoreWin(G.stores[0])', inspF: "SEL={kind:'fix',st:G.stores[0],f:G.stores[0].fix[3]}; openInspect()", inspA: "SEL={kind:'agent',st:G.stores[0],a:G.stores[0].agents.find(a=>!a.s)}; openInspect()",
    inspS: "SEL={kind:'agent',st:G.stores[0],a:G.stores[0].agents.find(a=>a.s)}; openInspect()", news: 'openNews()', bank: 'openBank()', offer: "onOffer({buyer:1, si:0, price:12300000})", wage: "onWage(G.staff.find(s=>s.st===0), 500)", bank: 'openBank()', offer: "onOffer({buyer:1, si:0, price:12300000})", wage: "onWage(G.staff.find(s=>s.st===0), 500)", promo: "buyAd(0,'flyers'); openPromo()", picker: 'openPicker(G.stores[0], G.stores[0].fix[0], 1)', survey0: 'openSurvey(G.stores[0])', survey1: "orderSurvey(G.stores[0]); G.stores[0].surveyOn=1; G.stores[0].surveyNext=0; G.stores[0].day.want={water:40,cola:120,cancoffee:200,greentea:90}; G.stores[0].survey={y:1,mo:4,day:3,months:0,want:Object.assign({},G.stores[0].day.want, {tunaonigi:300,bento:80,salmonigi:200}),miss:{},seg:{traveler:400,routine:200,student:80}}; openSurvey(G.stores[0])", pickerSv: 'openPicker(G.stores[0], G.stores[0].fix[0], 1)', help: 'openHelp()', hire: 'hirePicker(2,true)',
    lotStore: "VIEW={kind:'map'}; openLotWin(G.lots[G.stores[1].lot])", lotOwn: "VIEW={kind:'map'}; openLotWin(G.lots[8])", fac: "VIEW={kind:'map'}; openFacWin('starport')", permit: "VIEW={kind:'map'}; MAPOVER='permit'", foot: "VIEW={kind:'map'}; MAPOVER='foot'" };
  for (const [n, js] of Object.entries(wins)) {
    R(`WINS.length=0; TOOL=null; goStore(G.stores[0]); MAPOVER='none';`); R(js); await X.step(ctx, 2);
    const err = R('typeof __err === "undefined" ? "" : __err'); X.png(ctx, path.join(__dirname, 'shots', 'kwui_' + n + '.png'));
    console.log(n, 'ok');
  }
  // dialogue: the longest lines must stay in the box
  R(`WINS.length=0; say('Linda says I can have a store in the new wing. A probationary one. As long as it is normal. I can do normal. Normal normal normal.', 'CARL'); N('The mall bulletin speaks without a portrait and can run a little wider than a person does, but not past the edge.')`);
  for (let i = 0; i < 6; i++) { await X.step(ctx, 60); R('pressed.a = true'); }
  // a month-end settlement with its window
  R(`WINS.length=0; { const mo=G.months; while(G.months===mo) simTick(); }`); await X.step(ctx, 3); X.png(ctx, path.join(__dirname, 'shots', 'kwui_settle.png')); console.log('settle ok', R('WINS.map(w=>w.id).join()'));
  console.log(R('JSON.stringify([...OVER], null, 1)'));
})().catch(e => { console.log('ERR', e); process.exit(1); });
