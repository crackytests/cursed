'use strict';
// Two authored deliveries, with observations and receipts separate from claims.
const MAIL_PAPER={h:.04,parts:[box3(.55,.03,.38,[241,224,178]),box3(.18,.01,.12,[83,147,163],[.15,.04,.08])]};
function mailState() { return C3.letters || (C3.letters={clues:{}}); }
function mailA() { return C3.letters && C3.letters.a; }
function mailB() { return C3.letters && C3.letters.b; }
function mailCarryingA() { return mailA() && mailA().stage==='carried'; }
function mailCarryingB() { return mailB() && mailB().stage==='carried'; }
function mailObserve(key) { const l=mailState();l.clues[key]=1;saveC3(); }
function mailObjective() {
  const l=mailState();
  if(!l.clues.pipe)return ['Match the service letter to an older label. Quill can help','b2b','oldPost'];
  if(!l.clues.surface && !l.clues.pan)return ['Compare the pattern on the envelope with the walls','b2b','serviceTrim'];
  return ['Try the address that matches your letter','b2b','back3f'];
}
async function mailQuill() {
  let l=C3.letters;
  if(!mailA()) {
    await say2([[QU,'My bag. Four letters. Fifty years late. I will carry two. Would you take the service letter? Its address is underneath the new paint.'],['CARL','The directory says nobody lives there.'],[QU,'The directory is not the recipient. This one is for the occupant. No name required.']]);
    l=mailState();l.a={stage:'carried',hints:0};setF3('quillDone');saveC3();sfx('get');
    await letterScreen('a');
    if(await ask('A SECOND ENVELOPE HAS A DRAWING OF A KITCHEN WALL.',QU,['TAKE THE DRAWING TOO','LEAVE IT WITH QUILL'])===0) {
      l.b={stage:'carried'};saveC3();await letterScreen('b');
    }
    return;
  }
  const opts=['READ THE SERVICE LETTER','ASK FOR AN ADDRESS HINT'];
  if(mailB())opts.push('READ THE DRAWING');else if(C3.ch===4)opts.push('TAKE THE DRAWING');
  opts.push('LATER');
  const k=await ask(mailA().stage==='delivered'?'THE SERVICE LETTER HAS A RECEIPT. THE POST GOES THROUGH.':'THE LETTER IS STILL ADDRESSED TO A PERSON.',QU,opts);
  if(opts[k]==='READ THE SERVICE LETTER')return letterScreen('a');
  if(opts[k]==='READ THE DRAWING')return letterScreen('b');
  if(opts[k]==='TAKE THE DRAWING') { l.b={stage:'carried'};saveC3();return letterScreen('b'); }
  if(opts[k]==='ASK FOR AN ADDRESS HINT') {
    const a=mailA();a.hints=Math.min(3,a.hints+1);saveC3();
    return say([
      'Start with the brass mail slots on this floor. Service initials last longer than apartment numbers.',
      'The envelope has paired teal arches. Look at the strip of old wallpaper beyond the slots. A match is an address too.',
      'Read the F-S slot beside Q. Its blue pipe leads past the paired arches to the red service door. Compare the handle of the hanging pan. Then knock three times.'
    ][a.hints-1],QU);
  }
}
async function letterScreen(which) {
  const l=C3.letters,item=which==='a'?mailA():mailB();
  if(!item)return say('NO LETTER IN HAND. QUILL HAS THE MAILBAG.',null);
  const prev=scene,dark=hex('#263044'),blue=hex('#347589');
  scene={draw(){
    skyD(0,H,'#0c1432','#1c2c5c');plate(14,23,W-28,H-43,{c0:'#eadbb9',c1:'#b6a681',alpha:1});
    text(which==='a'?'BY HAND / F-S':'FOR THE KITCHEN / FROM D.',27,34,dark);
    const lines=which==='a'?[
      'TO: THE OCCUPANT, F SERVICE',
      'RETURN AT THE BLUE HANDLE.',
      'KEEP THIS LETTER OUT OF THE MACHINE.',
      '',
      'THE BORDER: PAIRED TEAL ARCHES.',
      'THE STAMP: TWO BLUE PIPE BANDS.',
      '',
      item.stage==='delivered'?'RECEIVED BY HAND. PRESENT UNIT: 3F.':'DELIVERY: STILL IN CARL\'S HAND.',
      'OBSERVED: '+(l.clues.pipe?'F-S LABEL ':'')+(l.clues.surface?'ARCHES ':'')+(l.clues.pan?'BLUE HANDLE':''),
      item.stage==='delivered'?'A RECEIPT COUNTS A PERSON.':'QUILL CAN HELP WITH THE ADDRESS.'
    ]:[
      'TO THE KITCHEN',
      'ON THE OTHER SIDE.',
      '"HERE IS HOW TALL I AM NOW."',
      '',
      'FROM D. / B2 UNIT 10.',
      'FOUR LONG HEIGHT LINES.',
      'A DIAMOND OF BLUE PLASTER.',
      'ONE CORNER IS CHIPPED.',
      l.clues.deeWall?'SEEN: B2 UNIT 10.':'B2 SIDE: NOT COMPARED.',
      l.clues.rozWall?'SEEN: THE UPSTAIRS KITCHEN.':'OTHER SIDE: NOT COMPARED.',
      item.stage==='carried'?'DELIVERY: STILL IN HAND.':item.answered?'BOTH ROOMS ANSWERED.':'DELIVERED. A GREEN PEN REMAINS.',
      item.filed?'WITNESS COPY: FILED WITH TENANTS.':''
    ];
    lines.forEach((s,i)=>text(s,27,56+i*11,dark));
    if(which==='b') {
      lineF(222,96,246,76,blue);lineF(246,76,272,96,blue);rectF(226,96,42,40,blue);rectF(232,102,10,12,hex('#ffe89a'));rectF(251,102,10,12,hex('#ffe89a'));
      for(let i=0;i<4;i++)rectF(235,145+i*7,22,2,blue);
      triF(274,144,281,153,277,158,blue);triF(274,144,277,158,271,158,blue);triF(274,144,271,158,267,153,blue);
    } else {
      for(let i=0;i<2;i++){ringF(258+i*13,177,5,blue);rectF(253+i*13,177,10,5,hex('#eadbb9'));}
    }
    text('Z/X/C: FOLD IT BACK UP',27,193,dark);
  }};
  sfx('tick');DBG.mail=which;try {await waitBtn();} finally {delete DBG.mail;scene=prev;}
}
async function mailScreen() {
  if(!C3.letters || !mailA() && !mailB())return say('NO LETTERS IN HAND. THE MAILROOM IS IN THE LOBBY.',null);
  const opts=[];if(mailA())opts.push('SERVICE LETTER / RECEIPT');if(mailB())opts.push('THE KITCHEN DRAWING');opts.push('BACK');
  const k=await ask('CARRIED MAIL. THESE ARE ADDRESSES, NOT THINGS CARL SAID.',null,opts);
  if(opts[k]!=='BACK')await letterScreen(opts[k]==='SERVICE LETTER / RECEIPT'?'a':'b');
}
async function mailOldPost() {
  const opts=['READ THE BRASS LABEL'];if(mailCarryingA())opts.push('TRY THE SERVICE LETTER HERE');if(mailCarryingB())opts.push('TRY THE DRAWING HERE');opts.push('LATER');
  const k=await ask('A BRASS MAIL SLOT BESIDE THE DOOR MARKED Q.',null,opts);
  if(opts[k]==='LATER')return;
  if(opts[k]==='TRY THE SERVICE LETTER HERE') {
    mailA().wrong='Q';saveC3();
    return say('THE SLOT IS Q. YOUR LETTER IS F-S. A HANDWRITTEN CORRECTION: "SERVICE POST FOLLOWS THE BLUE RETURN PIPE." THE LETTER STAYS WITH YOU.',null);
  }
  if(opts[k]==='TRY THE DRAWING HERE') {
    mailB().wrong='Q';saveC3();
    return say('Q HAS A SLOT, NOT A KITCHEN WALL. THE DRAWING HAS HEIGHT LINES AND A BLUE REPAIR. COMPARE ROOMS. THE DRAWING STAYS WITH YOU.',null);
  }
  await say('THE BRASS CROSS-INDEX: "Q / F-S: FOLLOW BLUE RETURN." TWO BLUE BANDS ON THE PIPE. THE PIPE CONTINUES TOWARD THE OLD SERVICE WING.',null);
  mailObserve('pipe');
}
async function mailSurface() {
  await say('UNDER THE STANDARD WALLPAPER: AVOCADO PANELING. UNDER THAT: PAIRED TEAL ARCHES ON CREAM PAPER. A BLUE RETURN PIPE PASSES THROUGH BOTH. THE LETTER BORDER USES THE SAME ARCHES.',null);
  mailObserve('surface');
}
async function mailPipe() {
  await say('A BRASS TAG UNDER THE PRINTED SERVICE LABEL: "F-S / BLUE RETURN." TWO BLUE BANDS FOLLOW THE PIPE THROUGH THE WALL. THE DIRECTORY CAN DENY A UNIT. THE PIPE STILL HAS TO GO SOMEWHERE.',null);
  mailObserve('pipe');
}
async function mailFrontDoor() {
  const k=await ask('3F. THE PRINTED SIGN SAYS VACANT. OLD PAPER SHOWS AT ITS EDGE.',null,['TRY THE SERVICE LETTER HERE','LOOK UNDER THE SIGN','LATER']);
  if(k===2)return;
  if(k===1)return mailSurface();
  mailA().wrong='front';saveC3();
  await say2([[KI,'DELIVERY DENIED. OCCUPANT NOT VERIFIED.'],[VO,'I cannot open that side. The paint is in the lock. Try the old service side. Keep the letter.']]);
}
async function mailServiceDoor() {
  const a=mailA();
  await say('THE RED DOOR HAS PAIRED TEAL ARCHES IN ITS OLD TRIM. A SAUCEPAN HANGS FROM THE RETURN PIPE. ITS HANDLE HAS A CHIPPED BLUE BAND, LIKE THE PAN LENT THROUGH YOUR VENT.',null);
  mailObserve('pan');
  const k=await ask('AN OLD SERVICE DOOR. A HANDWRITTEN NOTE SAYS KNOCK THREE TIMES.',null,['DELIVER THE F-S LETTER','READ THE LETTER AGAIN','LATER']);
  if(k===2)return;if(k===1)return letterScreen('a');
  if(!C3.letters.clues.pipe) return say('THE HANDLE MATCHES. CHECK THE SERVICE INITIALS AGAINST A BRASS LABEL BEFORE CHOOSING AN ADDRESS. QUILL CAN HELP.',null);
  sfx('tick');await wait(12);sfx('tick');await wait(12);sfx('tick');
  await say2([[VO,'A letter? For the occupant?'],['CARL','For whoever is here. I followed the pipe.'],[VO,'Then it found me. Come in. I can open this side.']]);
  a.stage='delivered';a.address='3F / F-S';setF3('nellIn');good('nell',1);sfx('stamp');
  await enter('apt3F');saveC3();
}
async function mailDeeTalk() {
  if(!F3('deeDone')) {
    await say2([[DEE,'I am Dee. I made a drawing for a kitchen. The building moved the address. The wall did not move.'],[DEE,'My room is door 10. Look at the marks and the little blue repair. This pen makes the next mark.']]);
    setF3('deeDone');setF3('deePen');setF3('dee');saveC3();sfx('get');return;
  }
  return say(mailB() && mailB().stage!=='carried'?'Did they see how tall? Try the thin part of the wall. I can answer from my room.':'Compare the marks, not the room number. The repair has one chipped corner. It has always had that corner.',DEE);
}
async function mailDeeWall() {
  await say('FOUR LONG HEIGHT LINES AMONG THE SMALL ONES. NEXT TO THEM: A DIAMOND OF BLUE PLASTER WITH ITS LOWER CORNER CHIPPED. THE DRAWING SHOWS BOTH. YOU CAN HEAR A KETTLE THROUGH THE THIN PATCH.',null);
  mailObserve('deeWall');if(!F3('deePen')) {setF3('deePen');saveC3();await say('Here. The green pen. The next mark should be taller.',DEE);}
}
async function mailRozWall() {
  await say('THE KITCHEN HAS THE SAME FOUR LONG HEIGHT LINES. THE BLUE DIAMOND HAS THE SAME CHIPPED CORNER. DIFFERENT WALLPAPER, SAME REPAIR. THE DRAWING FITS HERE.',null);
  mailObserve('rozWall');
  const k=await ask('THE DRAWING IS STILL IN YOUR HAND.',null,['DELIVER THE DRAWING HERE','KEEP COMPARING','LATER']);
  if(k!==0)return;
  if(!C3.letters.clues.deeWall)return say('THE DETAILS MATCH THE PAPER. COMPARE THE ACTUAL WALL IN B2 UNIT 10 TOO. THE REPAIR MAY BE ONE WALL, NOT TWO COPIES.',null);
  const b=mailB();b.stage='delivered';b.address='3D / B2 UNIT 10';good('roz',2);saveC3();sfx('get');
  await say2([[RZ,'That is Dee\'s hand. She draws the chipped bit bigger than it is. She always has.'],['CARL','I found the same marks and the same repair in B2. Door 10.'],[RZ,'Then she is on the other side of my kitchen. The building changed the numbers. It did not take the wall.']]);
}
async function mailWallReceipt() {
  const b=mailB();if(!b || b.stage==='carried' || !F3('wallTalk') || b.answered)return;
  b.answered=1;saveC3();
  await say('ON THE BACK OF THE DRAWING, YOU RECORD TWO ANSWERS: 3D AND B2 UNIT 10. ONE SHARED WALL. A COPY CAN GO ON THE TENANTS\' BOARD ON FLOOR THREE.',null);
}
async function mailWitnessBoard() {
  const b=mailB();if(!b || !b.answered)return say('THE TENANTS\' BOARD. ROOM FOR AN ADDRESS THAT THE DIRECTORY LEFT OUT.',null);
  if(b.filed)return say('A SIGNED COPY: "ROZ, 3D. DEE, B2 UNIT 10. BOTH ANSWER THROUGH THE SAME WALL." TWO ADDRESSES, TWO PEOPLE. MARISOL HAS THE COPY.',null);
  if(await ask('FILE THE TWO ANSWERS WITH THE TENANTS?',MA,['PIN THE WITNESS COPY','LATER'])===1)return;
  b.filed=1;good('marisol',1);saveC3();sfx('stamp');
  await say2([[MA,'Two rooms, two people who answered. I will enter both. The directory left a space. We can use the space.']]);
}
async function mailAllyMemory(who) {
  const b=mailB();if(!b)return;
  if(who==='roz' && b.answered)await say('The drawing found my kitchen. Dee answered through the wall. I know which address I am standing up for now.',RZ);
  if(who==='marisol' && b.filed)await say('I have the signed wall record. Two residents at two addresses. The association will keep the copy where the directory cannot edit it.',MA);
}
async function mailTestimony() {
  if(mailA() && mailA().stage==='delivered')await say2([['CARL','The service letter was addressed to the occupant. I delivered it to 3F. Someone opened the door and received it.'],[KI,'DIRECTORY: VACANT. DELIVERY: RECEIVED. THESE RECORDS DISAGREE.']]);
  const b=mailB();if(b && b.answered)await say2([[RZ,'Dee answered from B2 unit 10. I answered from 3D. The same wall has both of us.'],[MA,b.filed?'The tenants have a signed copy of both answers. You cannot unlist a voice that has a witness.':'There are two addresses in that answer. I am writing both.']]);
}
{
  const old=marksLook;
  marksLook=async()=>{
    if(mailCarryingB()) {await mailRozWall();if(mailCarryingB())return;}
    return old();
  };
}
{
  const old=marksWall;
  marksWall=async()=>{
    if(mailCarryingB())return mailDeeWall();
    await old();await mailWallReceipt();
  };
}
{
  const old=sealedDoor;sealedDoor=async()=>mailCarryingA()?mailFrontDoor():old();
  const ents=SCENES.floor3.ents;
  SCENES.floor3.ents=()=>ents().map(e=>e.id==='peel'?Object.assign({},e,{talk:()=>C3.ch===4?mailSurface():e.talk()}):e);
}
{
  const old=modelClause;modelClause=async()=>{await old();if(mailCarryingA()){await say('THE SMALL PRINT CROSS-INDEXES THE STANDARD UNIT TO AN OLDER SERVICE PLAN: "F-S / BLUE RETURN." THE NEW DIRECTORY COPIED ONLY THE STANDARD PART.',null);mailObserve('pipe');}};
}
wrapEnts('b2b',()=>[
  prop('oldPost',9.3,7.8,'BRASS MAIL SLOT',()=>mailOldPost(),{range:1.4}),
  prop('serviceTrim',12.2,7.8,'OLD WALLPAPER',()=>mailSurface(),{range:1.2})
]);
wrapEnts('maint',()=>[prop('oldServiceTag',6.8,5.3,'OLD PIPE TAG',()=>mailPipe(),{range:1.3,cond:()=>C3.ch>=4})]);
wrapEnts('floor3',()=>[prop('witnessBoard',7.8,6.3,'TENANTS / ADDRESSES',()=>mailWitnessBoard(),{range:1.3,cond:()=>C3.ch>=4})]);
{
  const old=drawHUD3;drawHUD3=()=>{old();if(frozen3() || !mailCarryingA() && !mailCarryingB())return;plate(W-56,36,52,13,{alpha:.8});text('MAIL '+(Number(!!mailCarryingA())+Number(!!mailCarryingB())),W-50,40,hex('#ffdda0'));};
}
// Repeated era details are geometry, so they stay readable beyond dialogue.
TEXGEN.rhArches=(x,y)=>((x%16-8)**2+(y%16-9)**2<32 && y%16<10)?[66,116,117]:[226,211,171];
TEXGEN.rhPanel=(x,y,h)=>(x%8===0)?[53,73,38]:[123+h*12,143+h*12,81+h*12];
function mailBox(sc,m,p,col,extra={}) { SCENES[sc].objs.push(Object.assign({m,p,mat:{col}},extra)); }
for(const [sc,slots] of [['b2',[[-17,'2'],[-11,'4'],[-5,'6'],[1,'8'],[7,'10'],[13,'12'],[19,'14']]],['b2b',[[-12,'N'],[-5,'O'],[2,'P'],[9,'Q']]]]) {
  for(const [x,n] of slots) {
    if(sc==='b2') {
      SCENES[sc].objs.push({m:'box:1.8:2.4:.07',p:[x+1.1,0,9.04],mat:{col:'#879658',tex:'rhPanel',ts:2}});
      mailBox(sc,'cyl:.22:.24:9',[x+1.1,2.3,8.9],'#ddbb77');
    } else {
      mailBox(sc,'box:.8:.38:.08',[x,1.2,9.01],'#b79859');
      mailBox(sc,'box:.55:.055:.09',[x,1.36,8.95],'#33382c');
      SCENES[sc].objs.push({m:'box:1.2:2.4:.06',p:[x+1.1,0,9.04],mat:{col:'#e0cdab',tex:'rhArches',ts:2}});
    }
  }
}
SCENES.b2b.objs.push({m:'box:1.4:2.5:.08',p:[12.2,0,9.02],mat:{col:'#e5d2ac',tex:'rhArches',ts:2}});
mailBox('b2b','box:6.4:.15:.15',[12.2,2.65,8.95],'#5787a1');
mailBox('b2b','box:.7:.4:.08',[9.3,1.9,8.95],'#b79859');
mailBox('maint','box:.8:.4:.1',[6.8,1.5,6.5],'#b79859');
mailBox('floor3','box:1.2:.55:.08',[11,2.3,9.03],'#edf3ff');
SCENES.floor3.objs.push({m:'box:1.4:2:.07',p:[-6.4,.2,9.1],mat:{col:'#879658',tex:'rhPanel',ts:2}});
SCENES.floor3.objs.push({m:'box:1.2:1.8:.07',p:[-6.4,.2,9.02],mat:{col:'#d8c89d',tex:'rhArches',ts:2}});
mailBox('floor3','box:1.2:1.1:.1',[7.8,1.0,9.02],'#6b5542');
const MAIL_PATCH={v:[[-.32,0,0],[0,.32,0],[.32,0,0],[.065,-.245,0],[-.065,-.245,0]],n:Array(5).fill([0,0,-1]),f:[[0,1,2],[0,2,3],[0,3,4]]};
for(const x of [9.8,10.1])mailBox('b2b','box:.16:.22:.22',[x,2.61,8.95],'#7ac3ea');
for(const x of [6.65,6.95])mailBox('maint','box:.15:.3:.32',[x,2.15,6.65],'#7ac3ea');
mailBox('floor3','box:1.2:.12:.12',[-6.4,1.95,8.98],'#5787a1');
// The kitchen wall lining sits at 8.7; all marks must be on its visible face.
for(const sc of ['apt3D','apt10'])for(const o of SCENES[sc].objs)if(o.p[2]===8.95 && o.p[0]===(sc==='apt3D'?-3.5:3.5)){o.p[2]=8.58;o.m='box:.28:.03:.04';}
for(const [sc,x] of [['apt3D',-3.5],['apt10',3.5]]) {
  for(const y of [.6,.9,1.3,1.75])mailBox(sc,'box:.7:.035:.06',[x,y,8.56],'#284b61');
  const side=x<0?1:-1;
  mailBox(sc,MAIL_PATCH,[x+side*.85,1.4,8.53],'#6097b0');
}
{
  const old=SCENES.b2b.drawOver;SCENES.b2b.drawOver=()=>{
    if(old)old();drawModel(FURN.saucepan,{p:[14.4,1.5,8.88],yaw:0},liveLight(WX.sc,[14.4,0,8]));
    const p=project(LIVE.cam,[9.3,2.4,8.9]);if(p)text('F-S >',p[0]-15,p[1],hex('#ffdda0'));
  };
}
{
  const old=SCENES.maint.drawOver;SCENES.maint.drawOver=()=>{if(old)old();const p=project(LIVE.cam,[6.8,2.0,6.5]);if(p)text('F-S',p[0]-9,p[1],hex('#7ad8ff'));};
}
for(const sc of ['apt3D','apt10']) {
  const old=SCENES[sc].drawOver;SCENES[sc].drawOver=()=>{
    if(old)old();const x=sc==='apt3D'?-3.5:3.5,L=p=>liveLight(WX.sc,p);
    if(F3('deeMark'))drawModel({h:.04,parts:[box3(.8,.04,.07,[72,236,120])]}, {p:[x,2.25,8.51],yaw:0},L([x,0,8]));
    const b=mailB();if(sc==='apt3D' && b && b.stage!=='carried')drawModel(MAIL_PAPER,{p:[2.6,1.02,7.6],yaw:0},L([2.6,0,7.6]));
  };
}
{
  const old=SCENES.floor3.drawOver;SCENES.floor3.drawOver=()=>{if(old)old();const b=mailB();if(b && b.filed)drawModel({h:.7,parts:[box3(.8,.7,.06,[235,221,176]),box3(.7,.04,.07,[76,196,127],[0,.2,-.04])]}, {p:[7.8,1.1,8.9],yaw:0},liveLight(WX.sc,[7.8,0,8]));};
}
{
  const old=SCENES.apt3F.drawOver;SCENES.apt3F.drawOver=()=>{if(old)old();if(mailA() && mailA().stage==='delivered')drawModel(MAIL_PAPER,{p:[2.6,.84,6.4],yaw:0},liveLight(WX.sc,[2.6,0,6.4]));};
}
