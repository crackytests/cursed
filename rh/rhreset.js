'use strict';
// Authored checkpoints: time never advances a reset stage.
const resetActive=()=>!!(C3 && C3.ch===5 && C3.resetRun && !F3('intercomDone') && !F3('finale'));
const resetHelp=who=>!!(F3('a_'+who) && !F3('a_'+who+'_weak'));
const resetMainDoor=()=>resetHelp('orrin') && resetHelp('bea');
function resetObjective() {
  const r=C3.resetRun;
  if(r.phase===1)return !resetHelp('nell') && !r.lamp?['Borrow an emergency lamp','laundry','resetLamp']:['Signal at Panel F; keep a route lit','maint','panelF'];
  if(r.phase===2) {
    if(!r.access)return ['File a stay at the service checkpoint','floor3','resetPermit'];
    return resetMainDoor()?['Signal Bea and pass the held door','floor3','staff']:['Release the laundry service door','laundry','serviceIn'];
  }
  if(r.phase===3) {
    if(!r.record) {
      if(r.sheet && !r.response)return ['Get an answer at 3F','apt3F','nell'];
      return ['Keep resident answers on the tenants board','floor3','witnessBoard'];
    }
    if(!r.wall)return ['Preserve the connection at Roz\'s wall','apt3D','marks'];
    if(!r.wallAnswer)return ['Hear the older room answer','apt10','marksB'];
    return ['Open verification at the tenants board','floor3','witnessBoard'];
  }
  return ['Carry the answers to the control-room intercom','control','desk'];
}
async function resetBrief() {
  await showCard(['RESET', '1. LIGHTS'],85,{fg:hex('#ffd848'),sc:2});
  await say2([[MA,'Lights, doors, then verification. First keep a route lit at Panel F. Then secure a service door. Last, keep the residents\' answers on this side of the directory.'],
    [MA,'Ask everyone. They can choose their part. If someone cannot help, there is a lamp, a hand release, and a response sheet. We advance each stage when you act. Take the time you need.']]);
}
async function resetLamp() {
  if(!resetActive() || C3.resetRun.phase!==1)return;
  const r=C3.resetRun;if(r.lamp)return say('THE EMERGENCY LAMP IS WITH YOU. CLIP IT TO THE BLUE RETURN PIPE AT PANEL F.',null);
  if(await ask('A BATTERY LAMP ON THE LAUNDRY SHELF. IT NEEDS NO BUILDING PERMISSION.',null,['BORROW THE EMERGENCY LAMP','LATER'])===1)return;
  r.lamp=1;sfx('get');saveC3();await say('YOU TAKE THE LAMP. ITS BRACKET FITS THE BLUE RETURN PIPE AT PANEL F.',null);
}
async function resetLights() {
  const r=C3.resetRun;if(r.phase!==1)return say(r.light==='nell'?'NELL\'S VALVE KEEPS THE CORRIDOR LIT.':'THE BATTERY LAMP STILL LIGHTS THE PIPE AND DOOR NUMBERS.',null);
  const helped=resetHelp('nell');
  await say2([[KI,'RESET / LIGHTS. SERVICE CORRIDOR SUPPLY CLOSED.'],[NL,helped?'I can turn the old valve. Give me three knocks when you are ready.': 'I cannot take the valve tonight. There is a battery lamp on the laundry shelf. The blue pipe can hold it.']]);
  if(!helped && !r.lamp)return;
  if(await ask('THE NEXT STAGE WAITS UNTIL THIS ROUTE HAS LIGHT.',null,[helped?'SIGNAL NELL: THREE KNOCKS':'CLIP THE LAMP TO THE PIPE','LATER'])===1)return;
  if(helped) {
    const e=ent3('resetNell');if(e)e.pose={armR:-1.2};
    for(let i=0;i<3;i++){sfx('tick');await wait(12);}
    await say('NELL TURNS THE VALVE BELOW THE RETURN PIPE. THE OLD GENERATOR CATCHES.',null);
    r.light='nell';
  }else {await say('YOU CLIP THE BATTERY LAMP TO THE PIPE AND TURN ITS BEAM TOWARD THE SERVICE DOORS.',null);r.light='lamp';}
  r.phase=2;sfx('power');relight();saveC3();
  await say(r.light==='nell'?'THE CORRIDOR LIGHTS COME BACK. THE BLUE BANDS AND DOOR NUMBERS ARE READABLE.':'A SMALL POOL OF LIGHT HOLDS THE BLUE BANDS AND DOOR NUMBERS. THE BUILDING SUPPLY STAYS OFF.',null);
  await showCard(['RESET','2. DOORS'],80,{fg:hex('#ffd848'),sc:2});
}
async function resetPermit() {
  const r=C3.resetRun;if(!resetActive() || r.phase<2)return say('THE SERVICE CHECKPOINT. FIRST KEEP THE PIPE ROUTE LIT.',null);
  if(r.access)return say(r.access==='orrin'?'ORRIN\'S STAY IS STAMPED: SERVICE ACCESS REMAINS OPEN.':'THE HANDWRITTEN PLAN MARKS THE LAUNDRY RELEASE. IT OPENS FROM THIS SIDE.',null);
  const helped=resetHelp('orrin');
  await say(helped?'Orrin has a stack of forms beside the closure reader.':'A closure reader has canceled the staff override. An old service plan is folded under its new sign.',null);
  if(await ask('RESET / DOORS. A JOB TITLE IS NOT A WAY THROUGH.',null,[helped?'ASK ORRIN TO FILE THE STAY':'COPY THE MANUAL SERVICE ROUTE','LATER'])===1)return;
  if(helped) {
    const e=ent3('resetOrrin');if(e)e.pose={armL:-.7};
    await say2([[OR,homeRadio() && homeRadio().stage==='done'?'You let an evening be an evening. I can let a door be a door.':'I am filing a stay of closure. There is no box for frightened. I am using the margin.']]);
    sfx('stamp');r.access='orrin';
    await say('ORRIN SLIDES THE CARBON COPY UNDER THE READER. CLOSURE CHANGES TO HELD. HE KEEPS WRITING.',null);
  }else {
    r.access='manual';sfx('get');
    await say('YOU COPY THE HAND RELEASE BESIDE THE LAUNDRY SERVICE DOOR. A BLUE LINE LEADS DIRECTLY TO PANEL F. THE STAFF DOOR STAYS CLOSED.',null);
  }
  saveC3();
}
async function resetStaffDoor() {
  const r=C3.resetRun;
  if(!r.access)return say('RESET SHUTTER: CLOSED. THE SERVICE CHECKPOINT IS BESIDE THIS DOOR.',null);
  if(!resetMainDoor())return say('THE SHUTTER CANNOT STAY OPEN HERE. USE THE LAUNDRY HAND RELEASE; IT LEADS TO PANEL F.',null);
  if(r.phase===2) {
    if(await ask('BEA HAS HER SHOULDER AGAINST THE DOOR. ORRIN\'S STAY IS ON THE READER.',null,['SIGNAL BEA AND PASS','LATER'])===1)return;
    const e=ent3('resetBea');if(e)e.pose={armL:-1.3,armR:-1.3};
    await say2([[BE,C3.inspection && C3.inspection.results && C3.inspection.results.sleep?'I got my sleep. I can hold this. Go.':homeMeal() && homeMeal().to==='bea' && homeMeal().method==='quiet'?'You listened at my door. I am listening at yours. Go.':'I hold doors all night at work. I can hold this one. Go.']]);
    r.door='bea';r.route='staff';r.phase=3;sfx('door');
  }
  await goScene('maint',-18,4,0);saveC3();
  if(r.phase===3 && !r.record)await say('RESET / VERIFICATION. THE HELD DOOR STAYS AVAILABLE. THE TENANTS\' BOARD NEEDS THE RESIDENTS\' ANSWERS.',null);
}
async function resetServiceDoor() {
  const r=C3.resetRun;
  if(r.phase<2 || !r.access)return say('RESET HAND RELEASE: FIND THE SERVICE PLAN AT THE FLOOR-THREE CHECKPOINT FIRST.',null);
  if(r.phase===2) {
    const helped=resetHelp('bea');
    if(await ask('THE LAUNDRY SERVICE DOOR HAS A MECHANICAL RELEASE.',null,[helped?'ASK BEA TO HOLD THE SERVICE DOOR':'TURN THE HAND RELEASE AND PASS','LATER'])===1)return;
    if(helped){const e=ent3('resetBeaService');if(e)e.pose={armR:-1.3};await say('BEA PULLS THE DOOR CLEAR OF THE SHUTTER AND WEDGES IT WITH THE FOLDING STOOL. SHE WAITS WHILE YOU PASS.',null);}
    else await say('YOU TURN THE HAND RELEASE, PULL THE DOOR OPEN, AND SET ITS MECHANICAL STOP. IT OPENS DIRECTLY ONTO PANEL F.',null);
    r.door=helped?'bea':'release';r.route='laundry';r.phase=3;
  }
  await goScene('maint',14.2,4.2,0);saveC3();
  if(r.phase===3 && !r.record)await say('RESET / VERIFICATION. THE SERVICE STOP STAYS SET. TAKE THE RESIDENTS\' ANSWERS TO THE TENANTS\' BOARD.',null);
}
async function resetNellResponse() {
  const r=C3.resetRun;
  if(!r.sheet || r.response)return say('THE RESPONSE SHEET WAITS AT THE TENANTS\' BOARD.',NL);
  await say2([['CARL','For the response sheet: who is here?'],[NL,'Nell. 3F. I am here, and I am answering. Put the saucepan beside that if they need a second answer.']]);
  r.response=1;saveC3();await say('YOU WRITE HER ANSWER BESIDE YOUR OWN: CARL, 3A. TWO RESIDENTS ANSWERED IN PERSON.',null);
}
async function resetBoard() {
  const r=C3.resetRun;
  if(r.phase<3)return say('THE BOARD HAS ROOM FOR ANSWERS. KEEP A ROUTE LIT AND A DOOR OPEN FIRST.',null);
  if(!r.record) {
    const helped=resetHelp('marisol');
    if(!helped && !r.response) {
      if(r.sheet)return say('THE RESPONSE SHEET HAS YOUR NAME. ASK NELL IN 3F FOR HER ANSWER.',null);
      if(await ask('THE ASSOCIATION CANNOT BACK THE RECORD YET. YOU CAN ASK IN PERSON.',null,['TAKE A RESPONSE SHEET','LATER'])===1)return;
      r.sheet=1;saveC3();return say('YOU ENTER CARL, 3A. THE NEXT LINE IS FOR AN ANSWER FROM 3F.',null);
    }
    if(await ask('KEEP THE RESIDENTS ON THE RECORD?',null,[helped?'GATHER ANSWERS WITH MARISOL':'PIN THE TWO RESPONSE SHEETS','LATER'])===1)return;
    if(helped)await say2([[MA,F3('inspectionRecord')?'I kept the inspection report, including the tap the directory omitted. I will keep this set of answers too.':'I am asking the residents, not asking the directory. Carl, 3A?'],['CARL','Here.'],[NL,'(through the old speaker) Nell, 3F. Here.'],[MA,mailB() && mailB().filed?'The signed wall copy is on this board too. Two more addresses with witnesses.':'Two people answered. That is what the file will say.']]);
    else await say('YOU PIN YOUR RESPONSE AND NELL\'S ANSWER UNDER THE PRINTED VACANCY NOTICE. THE NOTICE NO LONGER HAS THE WHOLE BOARD.',null);
    r.record=helped?'marisol':'carl';sfx('stamp');saveC3();return;
  }
  if(!r.wallAnswer)return say('THE TWO ANSWERS ARE PINNED. KEEP THE OLDER ROOM CONNECTED: ROZ\'S KITCHEN WALL.',null);
  if(r.phase>=4)return say('VERIFICATION IS OPEN. THE ANSWERS STAY HERE; YOU CARRY THE COPY TO THE INTERCOM.',null);
  if(await ask('LIGHTS KEPT. A DOOR OPEN. RESIDENTS ANSWERED ON BOTH SIDES.',null,['OPEN VERIFICATION','KEEP EXPLORING'])===1)return;
  r.phase=4;saveC3();await showCard(['RESET','3. VERIFICATION','THE MIC IS WAITING'],100,{fg:hex('#6dff92'),sc:2});
}
async function resetWall() {
  const r=C3.resetRun;
  if(!r.record)return say('FIRST KEEP THE RESIDENT ANSWERS AT THE TENANTS\' BOARD. THE OLD REPAIR IS STILL HERE.',null);
  if(!r.wall) {
    const helped=resetHelp('roz');
    if(await ask('THE RESET IS TRYING TO SEPARATE THE SAME WALL INTO TWO ADDRESSES.',null,[helped?'ASK ROZ TO MARK THE CONNECTION':'KNOCK AND CHALK THE OLD REPAIR','LATER'])===1)return;
    if(helped) {
      const original=ent3('roz');if(original)original.gone=1;
      const e=addEnt3(npcR('resetRoz','roz',-4.5,7.2,'ROZ',()=>{},{range:.1,pose:{armR:-1.1}}));
      await say2([[RZ,mailB() && mailB().answered?'The drawing found us. I can keep its address here.':'The old blue patch has stayed through every wallpaper. I will put the address where they cannot peel it off.']]);
      r.wall='roz';
      await say('ROZ MARKS THE THIN PATCH: 3D / B2 UNIT 10. SHE HOLDS THE PAPER CLEAR AS THE OLD SEAM OPENS.',null);e.gone=1;if(original)original.gone=0;
    }else {await say('YOU KNOCK ON THE CHIPPED BLUE PATCH. SOMEONE KNOCKS BACK. YOU CHALK A LINE AROUND THE REPAIR; THE OLD SEAM OPENS.',null);r.wall='carl';}
    sfx('get');
  }
  if(r.wallAnswer)return say('THE SHARED SEAM STAYS MARKED. 3D AND B2 UNIT 10 STILL CONNECT.',null);
  await goScene('apt10',0,2,0);saveC3();
  await say('YOU STEP THROUGH THE OLD SEAM INTO THE ROOM ON THE OTHER SIDE. THE SAME BLUE PATCH IS HERE. KNOCK AT THE MARKS.',null);
}
async function resetWallAnswer() {
  const r=C3.resetRun;
  await say2([[DEE,F3('wallTalk')?'Mom. I am still here. The green line is still here too.':'Dee. Door 10. I heard the knock. Tell the kitchen I am here.'],['CARL','Dee, B2 unit 10. I am carrying the answer upstairs.']]);
  r.wallAnswer=1;setF3('deeDone');setF3('dee');sfx('tick');
  await goScene('apt3D',-3.5,6.6,0);saveC3();
  await say('YOU RETURN THROUGH THE MARKED SEAM. BOTH ADDRESSES REMAIN ON THE WALL.',null);
}
async function resetTestimony() {
  const r=C3.resetRun;if(!r)return;
  if(F3('inspectionRecord') && C3.inspection && C3.inspection.results) {
    const i=C3.inspection.results;
    await say('THE RESIDENT INSPECTION REPORT: SUPPER '+(i.supper?'HOT':'COLD')+', 3C '+(i.sleep?'QUIET':'RATTLING')+', UNLISTED TAP '+(i.water?'RUNNING':'DRY')+'. THE UNLISTED RESIDENT REMAINED IN THE REPORT.',MA);
  }
  await say2([['CARL',r.light==='nell'?'Nell turned the valve. The corridor lights came back.':'I clipped a battery lamp to the pipe. We found a route while the supply stayed off.'],
    [r.access==='orrin'?OR:'CARL',r.access==='orrin'?'The service closure is held. My carbon copy is still in the reader.':'The staff override was closed. I used the mechanical service release.'],
    [r.door==='bea'?BE:'CARL',r.door==='bea'?'I held the door while Carl passed. It stayed open.':'I set the service-door stop. There is a way back.'],
    [r.record==='marisol'?MA:'CARL','Carl, 3A. Nell, 3F. Both answered. The two responses are pinned to the board.'],
    [r.wall==='roz'?RZ:'CARL','The shared wall still connects 3D to B2 unit 10. Dee answered from the other side.']]);
}
{
  const old=staffDoor;staffDoor=async()=>resetActive() && C3.resetRun.phase>=2?resetStaffDoor():old();
  const pf=panelF;panelF=async()=>resetActive()?resetLights():pf();
  const n=nell;nell=async()=>resetActive() && C3.resetRun.phase===3 && C3.resetRun.sheet && !C3.resetRun.response?resetNellResponse():n();
  const b=mailWitnessBoard;mailWitnessBoard=async()=>resetActive()?resetBoard():b();
  const m=marksLook;marksLook=async()=>resetActive() && C3.resetRun.phase>=3?resetWall():m();
  const w=marksWall;marksWall=async()=>resetActive() && C3.resetRun.wall && !C3.resetRun.wallAnswer?resetWallAnswer():w();
}
{
  const old=SCENES.floor3.ents;SCENES.floor3.ents=()=>old().map(e=>{
    if(e.id==='staff' && resetActive() && C3.resetRun.phase>=2)return Object.assign({},e,{label:resetMainDoor()?'BEA / HELD DOOR':'RESET / SHUTTER',to:resetMainDoor()?'maint':undefined});
    if(e.id==='marisol')return Object.assign({},e,{cond:()=>!resetActive() || C3.resetRun.phase<3});
    return e;
  });
}
const resetLampModel={h:.4,parts:[box3(.4,.3,.22,[255,190,65]),box3(.28,.18,.05,[255,245,171],[0,.08,-.13]),box3(.16,.08,.16,[82,93,116],[0,.3,0])]};
wrapEnts('laundry',()=>[
  prop('resetLamp',-3,4.1,'EMERGENCY LAMP',()=>resetLamp(),{range:1.3,cond:()=>resetActive() && C3.resetRun.phase===1,draw3:e=>{if(!C3.resetRun.lamp)drawModel(resetLampModel,{p:[-3,.4,4.1],yaw:0},liveLight(WX.sc,e.p));}}),
  npcR('resetBeaService','bea',3.4,7.4,'BEA',()=>say('The release is beside me. You can pass; I will keep it clear.',BE),{range:.5,pose:{armR:-1.2},cond:()=>resetActive() && C3.resetRun.phase>=2 && resetHelp('bea')})
]);
wrapEnts('maint',()=>[npcR('resetNell','nell',12.3,5.1,'NELL / VALVE',()=>resetLights(),{range:.6,pose:{armR:-.7},cond:()=>resetActive() && resetHelp('nell')})]);
wrapEnts('floor3',()=>[
  prop('resetPermit',18.4,6.2,'SERVICE CHECKPOINT',()=>resetPermit(),{range:1.2,cond:()=>resetActive() && C3.resetRun.phase>=2}),
  npcR('resetOrrin','orrin',18.4,8.2,'ORRIN / FILING',()=>resetPermit(),{range:.5,pose:{armL:-.7},cond:()=>resetActive() && C3.resetRun.phase>=2 && resetHelp('orrin')}),
  npcR('resetBea','bea',21.9,7.8,'BEA / HOLDING',()=>resetStaffDoor(),{range:.5,pose:{armR:-1.2},cond:()=>resetActive() && C3.resetRun.phase>=2 && resetMainDoor()}),
  npcR('resetMarisol','marisol',6.6,7.7,'MARISOL / RESPONSES',()=>resetBoard(),{range:.5,pose:{armL:-.8},cond:()=>resetActive() && C3.resetRun.phase>=3 && resetHelp('marisol')})
]);
{
  const key=SCENES.maint.variantKey,variant=SCENES.maint.variantScene;
  SCENES.maint.variantKey=()=>resetActive()?'/reset-'+(C3.resetRun.light || 'off')+(homeGhostGuideAvailable() && homeGhost().guided?'-guided':''):key();
  SCENES.maint.variantScene=()=>{
    if(!resetActive())return variant();
    const s=Object.assign({},SCENES.maint),r=C3.resetRun;
    s.lights=r.light==='nell'?s.lights:s.lights.filter(l=>l.p[0]===-10);
    if(r.light==='lamp')s.lights=s.lights.concat([{p:[12,1.6,4],col:[1,.85,.4],rad:8,int:1.6,glow:.5}]);
    if(homeGhostGuideAvailable() && homeGhost().guided)s.lights=s.lights.concat([11,14,17].map(x=>({p:[x,1.4,4],col:[.55,.65,1],rad:4,int:1.2,glow:.5})));
    return s;
  };
}
{
  const old=SCENES.maint.drawOver;SCENES.maint.drawOver=()=>{if(old)old();if(resetActive() && C3.resetRun.light==='lamp')drawModel(resetLampModel,{p:[11.3,1.4,6.5],yaw:0},liveLight(WX.sc,[11.3,0,5]));};
}
for(const sc of ['apt3D','apt10']) {
  const old=SCENES[sc].drawOver;SCENES[sc].drawOver=()=>{if(old)old();if(C3.resetRun && C3.resetRun.wall){
    const x=sc==='apt3D'?-3.5:3.5,noteX=x+(x<0?1.6:-1.6);
    drawModel({h:.9,parts:[box3(1.7,.9,.05,[218,213,151])]}, {p:[noteX,.9,8.45],yaw:0},liveLight(WX.sc,[x,0,7]));
    drawModel({h:2,parts:[box3(.04,2,.06,[104,207,158])]}, {p:[x+.55,.25,8.45],yaw:0},liveLight(WX.sc,[x,0,7]));
    const p=project(LIVE.cam,[noteX,1.7,8.35]);if(p){text('3D /',p[0]-12,p[1],hex('#244c62'));text('B2 10',p[0]-15,p[1]+9,hex('#244c62'));}
  }};
}
{
  const old=SCENES.floor3.drawOver;SCENES.floor3.drawOver=()=>{if(old)old();if(!resetActive())return;
    const r=C3.resetRun,draw=(m,p)=>drawModel(m,{p,yaw:0},liveLight(WX.sc,p));
    draw({h:1,parts:[box3(1,.65,.07,[81,97,111]),box3(.8,.15,.09,r.access?[93,244,155]:[244,94,93],[0,.35,-.06])]},[18.4,1,8.9]);
    if(r.access==='orrin')draw(MAIL_PAPER,[18.4,.4,7.7]);
    if(r.record)draw({h:.8,parts:[box3(.85,.8,.08,[241,224,178]),box3(.7,.06,.1,[76,196,127],[0,.55,-.03])]},[7.8,1.2,8.75]);
    if(resetMainDoor() && r.access)draw({h:.2,parts:[box3(.35,.16,.3,[223,189,101])]},[21,.03,8.7]);
  };
}
{
  const old=drawHUD3;drawHUD3=()=>{old();if(resetActive() && !frozen3()){
    const s=['','1 LIGHTS','2 DOORS','3 VERIFY','MIC READY'][C3.resetRun.phase];
    let y=mailCarryingA() || mailCarryingB()?52:36;
    const e=nearest3(),p=e && project(LIVE.cam,[e.p[0],(entModel(e)?entModel(e).h || 1.2:1.2)+(e.promptY || .3),e.p[2]]);
    if(p && p[0]+(e.label || '').length*3+4>W-74 && p[1]-29<y+13 && p[1]-2>y)y=Math.ceil(p[1]+5);
    plate(W-74,y,70,13,{alpha:.8});text(s,W-68,y+4,hex('#ffdda0'));
  }};
}
{
  const old=SCENES.apt3A.drawOver;SCENES.apt3A.drawOver=()=>{if(old)old();if(F3('finale') && C3.resetRun && C3.resetRun.record)drawModel(HOME_NOTE,{p:[3.4,.65,4.4],yaw:0},liveLight(WX.sc,[3.4,0,4.4]));};
}

{
  const key=SCENES.floor3.variantKey,variant=SCENES.floor3.variantScene;
  SCENES.floor3.variantKey=()=>key()+(resetActive()?'/reset-door-'+(C3.resetRun.access || 'closed')+(resetMainDoor()?'-held':'-shut'):'');
  SCENES.floor3.variantScene=()=>{
    const s=C3.workOrders?variant():Object.assign({},SCENES.floor3);
    if(resetActive() && C3.resetRun.access && resetMainDoor())s.objs=s.objs.filter(o=>!(o.p[0]===21 && o.p[2]===9.18)).concat([{m:'box:1.5:2.5:.14',p:[21.75,0,8.6],r:1.1,mat:{col:'#505860',shiny:.5}}]);
    return s;
  };
}

{
  const old=SCENES.laundry.drawOver;SCENES.laundry.drawOver=()=>{if(old)old();if(!resetActive())return;
    const r=C3.resetRun,open=r.route==='laundry' && r.door,p=open?[5.35,0,9.15]:[4.8,0,9.8];
    drawModel({h:2.4,parts:[box3(1.1,2.2,.12,[70,92,110]),box3(.6,.2,.14,r.access?[90,248,158]:[248,94,86],[0,1.8,-.08])]}, {p,yaw:open?1.1:0},liveLight(WX.sc,p));
    if(open)drawModel({h:.2,parts:[box3(.35,.16,.3,[223,189,101])]}, {p:[4.8,.03,9.2],yaw:0},liveLight(WX.sc,[4.8,0,7]));
  };
}
