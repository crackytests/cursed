'use strict';
// Optional, once-only visits. Physical outcomes live apart from Carl's claims.
const HOME_BOWL = {h:.25,parts:[{m:'cyl:.25:.16:10:.34',o:[0,0,0],col:[212,226,238]},{m:'cyl:.28:.02:10',o:[0,.17,0],col:[198,132,62]}]};
const HOME_EMPTY_BOWL = {h:HOME_BOWL.h,parts:[HOME_BOWL.parts[0],Object.assign({},HOME_BOWL.parts[1],{col:[70,88,108]})]};
const HOME_NOTE = {h:.04,parts:[box3(.5,.03,.36,[244,226,178]),box3(.3,.01,.025,[70,88,114],[0,.04,0])]};
function homeActivitiesAvailable() { return (C3.ch===3 || C3.ch===4) && F3('ghostSet'); }
function homeVisits() { return C3.homeVisits || (C3.homeVisits={}); }
function homeMeal() { return C3.homeVisits && C3.homeVisits.meal; }
function homeRadio() { return C3.homeVisits && C3.homeVisits.radio; }
function homeGhost() { return C3.homeVisits && C3.homeVisits.ghost; }
function homeOrrinReady() {
  return homeActivitiesAvailable() && (homeMeal() && homeMeal().to==='orrin' && homeMeal().stage==='cooked' || homeRadio() && homeRadio().stage==='ready');
}
function homeGhostSpot() { const g=homeGhost(); return !g?[1.4,0,6.6]:g.mode==='company'?[.8,0,6.8]:g.mode==='helper'?[3.8,0,4.9]:[1.8,0,2.5]; }
function refreshHomeGhost() {
  const e=ent3('ghost'); if(e && WX.id==='apt3A') { e.p=homeGhostSpot().slice(); e.label=homeGhost() && homeGhost().mode==='boundary'?'VISITING HOURS':'SPOOKY GHOST'; }
}
async function homeKitchen() {
  const m=homeMeal();
  if(m && m.stage==='done') return say(m.to==='bea'?'BEA\'S EMPTY BOWL IS BACK. '+(m.method==='quiet'?'A NOTE: "THANKS FOR NOT KNOCKING."':'A NOTE: "FOOD GOOD. KNOCKING BAD."'):'TWO BOWLS. '+(m.method==='company'?'ORRIN WASHED HIS. HE SAID HE WOULD LIKE TO DO THIS AGAIN.':'ORRIN LEFT A NOTE: "THANK YOU FOR THE FOOD. PERHAPS COMPANY NEXT TIME."'),null);
  if(!homeActivitiesAvailable()) return say('THE SAUCEPAN IS STILL HERE. THE RESET IS NOT A GOOD TIME TO START SUPPER.',null);
  if(!m) {
    const k=await ask('BORROWED SAUCEPAN. TWO TINS, WATER, AND A POSSIBLE NEIGHBOR.',null,['MAKE A MEAL FOR BEA','MAKE A MEAL FOR ORRIN','ANOTHER TIME']);
    if(k===2)return;
    homeVisits().meal={to:k===0?'bea':'orrin',stage:'ask'};saveC3();
    return say(k===0?'ASK BEA IN 3C WHAT WOULD HELP. THE PAN DOES NOT KNOW HER SHIFT.':'ASK ORRIN IN 3B WHAT WOULD HELP. A PORTION IS NOT AN INVITATION.',null);
  }
  if(m.stage==='ask') return say(m.to==='bea'?'BEA IS IN 3C. ASK BEFORE COOKING.':'ORRIN IS IN 3B. ASK BEFORE COOKING.',null);
  if(m.stage==='cooked') return m.to==='bea'?homeBeaReminder():homeServeOrrin();
  if(m.stage==='cook' && await ask('BEANS, WATER, AND A PINCH OF SOMETHING THAT SMELLS LIKE EARTH.',null,['COOK THE SOUP','LATER'])===1)return;
  m.stage='cooking';saveC3();sfx('tick');
  await say('YOU PUT THE TINS IN THE SAUCEPAN. IT IS ALREADY THE RIGHT SHAPE FOR THIS.',null);
  WX.homeCooking=1;try { await wait(75); } finally { WX.homeCooking=0; }
  m.stage='cooked';saveC3();sfx('get');
  await say(m.to==='bea'?'A COVERED BOWL FOR 3C. TAKE IT TO HER DOOR. NO KNOCKING, SHE SAID.':'TWO BOWLS. ORRIN IS AT THE SOFA. THE INVITATION HAS A PLACE TO SIT.',null);
}
async function homeAskBea() {
  await say2([['CARL','Bea? I can make soup. Would that help?'],[BE,'(without opening her eyes) Yes. Outside the door. Covered. No knocking. The nice part would be no knocking.']]);
  if(await ask('BEA ASKED FOR A QUIET DELIVERY.',null,['MAKE IT FOR HER DOOR','ASK LATER'])===1)return;
  homeMeal().stage='cook';saveC3();
  await say('BACK TO YOUR KITCHEN. THE ORDER IS SOUP, THEN SILENCE.',null);
}
async function homeBeaReminder() { await say('THE BOWL IS COVERED. BEA ASKED YOU TO LEAVE IT OUTSIDE 3C WITHOUT KNOCKING.',null); }
async function homeDeliverBea() {
  const m=homeMeal();
  const k=await ask('3C. DAY SLEEPER. ONE COVERED BOWL.',null,['LEAVE IT QUIETLY','KNOCK AND HAND IT OVER','LATER']);
  if(k===2)return;
  m.stage='done';m.method=k===0?'quiet':'knock';good('bea',k===0?1:-1);saveC3();
  if(k===0)await say('YOU SET DOWN THE BOWL. NO KNOCK. A HAND COLLECTS IT AFTER YOU STEP AWAY. THE EMPTY BOWL WILL FIND ITS WAY BACK.',null);
  else await say2([['CARL','Bea. Soup.'],[BE,'Yes. You asked. I answered. I said no knocking.'],['CARL','...Right.'],[BE,'Thank you for the soup. Please leave it there.']]);
}
async function homeAskOrrin() {
  const m=homeMeal(),r=homeRadio();
  if(m && m.to==='orrin' && m.stage==='ask') {
    await say2([['CARL','I have the neighbor\'s saucepan. Would soup help?'],[OR,'Soup would be good. Having someone to eat it with would be better. May I come to 3A?']]);
    if(await ask('ORRIN ASKED FOR COMPANY WITH THE MEAL.',null,['INVITE HIM FOR SUPPER','ANOTHER EVENING'])===1)return;
    m.stage='cook';saveC3();
    return say('I will come when the bowls are ready. Two bowls. I know how many that is without a form.',OR);
  }
  if(r && r.stage==='invited') {
    const claim=saidOf('radio');
    await say2([['CARL','Come over and listen to the radio with me?'],[OR,F3('radioOK')?'You repaired the antenna. I remember the traffic. I would like to hear it in a room where I am invited.':!claim || claim.st==='TAKEN BACK'?'You said you did not know what it receives. We could listen without first naming it normal.':claim.st==='DOUBLED DOWN'?'You said it was normal, and that I was tuning it wrong. I can come over. I would like this to be a visit, rather than another test.':'The station is still unresolved. Is this an invitation or a request to verify it?']]);
    if(await ask('AN EVENING TO LISTEN, WITHOUT A FORM.',null,['COME LISTEN WITH ME','ANOTHER EVENING'])===1)return;
    r.stage='ready';saveC3();
    return say('Then I will meet you by the sofa. I will bring no forms. I will bring one mug.',OR);
  }
}
async function homeServeOrrin() {
  const m=homeMeal();if(!m || m.stage!=='cooked')return;
  const k=await ask('ORRIN HAS COME FOR SUPPER.',null,['SHARE THE MEAL','LEAVE HIM A BOWL','LATER']);
  if(k===2)return;
  m.stage='done';m.method=k===0?'company':'alone';good('orrin',k===0?1:0);saveC3();
  await say2(k===0?[[OR,'This is good soup. It tastes like two tins.'],['CARL','It is two tins.'],[OR,'I can see why people do this. The eating takes time. There is someone there for the time.']]:[['CARL','Here. I have something to do.'],[OR,'Thank you for the food. I did want the company. Another time, perhaps.']]);
  await homeOrrinGoodbye();
}
async function homeRadioVisit() {
  let r=homeRadio();
  if(r && r.stage==='done') return say('ORRIN\'S MUG. YOU HEARD '+({traffic:'TRAFFIC',weather:'WEATHER FOR AN UNMAPPED CITY',static:'A STATION THAT NEVER QUITE ARRIVED'})[r.station]+'. '+(r.clue?'THE CARD SAYS: "B2 (AGAIN). TRY THE OLDER LABELS."':'THE CARD SAYS: "A VISIT. NO VERIFICATION REQUIRED."'),null);
  if(!homeActivitiesAvailable())return say('THE RADIO CAN WAIT UNTIL THE BUILDING HAS A MORNING AGAIN.',null);
  if(!r) {
    if(await ask('THE RADIO HAS BEEN AN OBJECT. IT COULD BE AN EVENING.',null,['INVITE ORRIN TO LISTEN','NOT TONIGHT'])===1)return;
    r=homeVisits().radio={stage:'invited'};saveC3();
    return say('ASK ORRIN IN 3B. AN INVITATION NEEDS TO REACH A PERSON.',null);
  }
  if(r.stage==='invited')return say('ORRIN HAS NOT BEEN ASKED YET. HIS DOOR IS 3B.',null);
  if(await ask('ORRIN IS HERE. THE RADIO IS WARM.',null,['LISTEN TOGETHER','LATER'])===1)return;
  const claim=saidOf('radio');
  r.station=F3('radioOK')?'traffic':!claim || claim.st==='TAKEN BACK'?'weather':'static';
  sfx('tick');
  await say2(r.station==='traffic'?[[null,'A MAN READS TRAFFIC FOR A HIGHWAY WITH EXITS FOR ONLY GOOD THINGS.'],[OR,'We could take the exit for an uneventful afternoon. It sounds well maintained.']]:r.station==='weather'?[[null,'A WOMAN READS WEATHER FOR A CITY THAT IS NOT ON ANY MAP. "LIGHT RAIN IN ROOMS THAT HAVE BEEN FORGOTTEN."'],[OR,'It sounds as if someone is still there. I hope they have windows.']]:[[null,'STATIC. A VOICE ALMOST ARRIVES, THEN FALLS BETWEEN THE STATIONS.'],[OR,'I can hear it too. You do not have to tell me I am doing it wrong. We can just sit here.']]);
  await wait(45);
  await say('BETWEEN BROADCASTS: "DELIVERIES FOR B2. AGAIN. PLEASE USE THE OLDER LABELS."',null);
  r.clue=await ask('ORRIN TURNS THE MUG IN HIS HANDS. THE RADIO KEEPS GOING.',null,['WRITE DOWN THE ODD ADDRESS','LET IT BE COMPANY'])===0;
  if(r.clue)await say2([['CARL','B2. Again. There is a second address hiding in the word.'],[OR,'We can write it down. We do not have to leave a perfectly good evening to investigate it.']]);
  else await say2([['CARL','It can wait.'],[OR,'Yes. I like being here. That was the whole invitation.']]);
  r.stage='done';good('orrin',1);saveC3();await homeOrrinGoodbye();
}
async function homeOrrinGoodbye() {
  await say(homeOrrinReady()?'We still have the other part of the evening. I will stay by the sofa.':'Thank you for having me over. I will take the short walk home.',OR);
}
async function homeOrrinTalk() {
  const m=homeMeal(),r=homeRadio(),meal=m && m.to==='orrin' && m.stage==='cooked',radio=r && r.stage==='ready';
  if(meal && radio) {
    const k=await ask('THE TABLE HAS BOWLS. THE CRATE HAS A RADIO.',null,['EAT THE MEAL','LISTEN TO THE RADIO','LATER']);
    if(k===2)return;return k===0?homeServeOrrin():homeRadioVisit();
  }
  return meal?homeServeOrrin():homeRadioVisit();
}
async function homeGhostEvening() {
  const g=homeGhost();
  if(g)return say(g.mode==='company'?'We sat here! Together! I did not have to be a disturbance to be noticed!':g.mode==='helper'?'These are the radio labels! This one says ODD STATION. That means we know where it goes, even if we do not know what it is!':'VISITING HOURS: KNOCK FIRST. SOMETIMES CARL NEEDS HIS ROOM. A GHOST DREW A SMILE UNDER IT.',g.mode==='boundary'?null:GH3);
  const k=await ask('GHOST HAS GUEST PAPERWORK. WHAT WOULD MAKE THIS A HOME FOR AN EVENING?',null,['SIT WITH GHOST','GIVE HIM A HOUSEHOLD JOB','I NEED THE ROOM TONIGHT','ANOTHER EVENING']);
  if(k===3)return;
  await say2(k===0?[['CARL','You can sit here. You do not have to do a noise.'],[GH3,'I like doing a noise! But I can like this too!'],[null,'YOU SIT FOR A WHILE. THE COUCH STAYS STILL. GHOST DOES TOO.']]:k===1?[['CARL','Will you sort the radio labels? The spares are in the crate.'],[GH3,'I have a household job! I have always wanted a household verb!'],[null,'GHOST MAKES TWO PILES: SPARES, AND ODD STATION. HE DOES NOT REPAIR THE STATION. HE FINDS A PLACE FOR THE LABEL.']]:[['CARL','I need the room to myself tonight. Knock before you visit?'],[GH3,'Okay! I can knock on purpose! I will make visiting hours!'],[null,'GHOST LEAVES A NOTE BY THE DOOR. HE TAKES THE WORD "GUEST" SERIOUSLY.']]);
  homeVisits().ghost={mode:['company','helper','boundary'][k]};good('ghost',1);refreshHomeGhost();saveC3();
}
function homeGhostEntity() {
  return prop('ghost',homeGhostSpot()[0],homeGhostSpot()[2],homeGhost() && homeGhost().mode==='boundary'?'VISITING HOURS':'SPOOKY GHOST',()=>ghostHome(),{
    range:1.5,cond:()=>C3.ch>=3 && F3('ghostHome') && C3.ch<5,
    draw3:e=>{if(homeGhost() && homeGhost().mode==='boundary')return;drawModel(MODELS_P.ghost,{p:[e.p[0],.18+Math.sin(WX.t*.04)*.06,e.p[2]],yaw:3.14},liveLight(WX.sc,e.p));}
  });
}
async function homeNellRecipe() {
  const m=homeMeal();if(!m || m.stage!=='done')return;
  await say2([[NL,m.to==='bea'?'You made soup for the day sleeper. '+(m.method==='quiet'?'I heard the bowl go down. I did not hear you knock. Good.':'I heard the knock too. Next time, listen to the order.'):'You made supper for Orrin. '+(m.method==='company'?'I heard two spoons. That is what the pan is for.':'He wanted someone there. The pan is only half the invitation.')],[NL,'Here. My recipe. Two tins, water, salt. Make another portion for whoever is there. Leave the pan upstairs.']]);
  homeVisits().recipe=1;
}
async function homeMealTestimony() {
  const m=homeMeal();if(!m || m.stage!=='done')return;
  await say2([['CARL',m.to==='bea'?'I used it to make soup for Bea. '+(m.method==='quiet'?'She asked for it at her door, without a knock. I listened.':'She asked for no knocking. I got that part wrong. The food was there.'):'I used it to make supper for Orrin. '+(m.method==='company'?'We ate together in 3A.':'I gave him food. He wanted company too.')],[NL,'That is my saucepan. It is being used. Someone lives with it.']]);
}
function homeGhostGuideAvailable() {
  const g=homeGhost();return C3.ch===5 && F3('reset') && !F3('intercomDone') && g && g.mode!=='boundary';
}
async function homeGhostGuide() {
  const g=homeGhost();if(!homeGhostGuideAvailable())return;
  if(g.guided)return say(C3.resetRun && C3.resetRun.light==='nell'?'The control door is here! Nell has the lights on. My marks can stay with them!':'The control door is here! I can see in this dark! You found a place for me. I found a place for your feet!',GH3);
  await say2([[GH3,g.mode==='helper'?'Carl! This pipe has the same label as the spares! I followed it!':'Carl! I remembered the way here while we were sitting! It is easier without feet!'],[GH3,C3.resetRun && C3.resetRun.light==='nell'?'The lights are back. I can still mark the pipe to the control door!':'The middle light is out. I can show you the pipe to the control door!']]);
  if(await ask('GHOST CAN LIGHT A WAY THROUGH THE CORRIDOR.',null,['FOLLOW GHOST','I CAN FIND MY WAY'])===1)return;
  g.guided=1;const e=ent3('ghostGuide');if(e)e.p=[15.5,0,3];relight();saveC3();
  await say('THREE PALE MARKS LIGHT THE PIPE. GHOST WAITS BY THE CONTROL DOOR.',null);
}
wrapEnts('apt3A',()=>[
  prop('homeKitchen',4,6.4,F3('nellMet')?'NELL\'S SAUCEPAN':'BORROWED SAUCEPAN',()=>homeKitchen(),{range:1.5,cond:()=>C3.decor.saucepan && (homeActivitiesAvailable() || homeMeal())}),
  prop('homeRadio',4,4.1,'YOUR RADIO',()=>homeRadioVisit(),{range:1.2,cond:()=>C3.decor.radio && (homeActivitiesAvailable() || homeRadio())}),
  npcR('homeOrrin','orrin',-1.7,6.5,'ORRIN (VISITING)',()=>homeOrrinTalk(),{range:1.4,cond:homeOrrinReady})
]);
{
  const old=SCENES.apt3A.drawOver;
  SCENES.apt3A.drawOver=()=>{
    if(old)old();const m=homeMeal(),r=homeRadio(),g=homeGhost(),draw=(model,p)=>drawModel(model,{p,yaw:0},liveLight(WX.sc,p));
    if(m && (m.stage==='cooked' || m.stage==='done')) {
      const bowl=m.stage==='done'?HOME_EMPTY_BOWL:HOME_BOWL;
      draw(bowl,[4.1,1.03,7.2]);if(m.to==='orrin')draw(bowl,[4.9,1.03,7.2]);
    }
    if(C3.homeVisits && C3.homeVisits.recipe)draw(HOME_NOTE,[4.4,1.04,8.25]);
    if(r && r.stage==='done') {draw({h:.28,parts:[{m:'cyl:.12:.25:8',o:[0,0,0],col:[120,180,205]}]},[2.9,.66,4.35]);draw(HOME_NOTE,[3.6,.65,4.6]);}
    if(g) {
      if(g.mode==='company')draw({h:.1,parts:[box3(.8,.1,.65,[210,195,245])]},[.8,.05,7.2]);
      else draw(HOME_NOTE,g.mode==='helper'?[3,.64,4.6]:[1.8,.05,2.5]);
    }
    if(WX.homeCooking)for(let i=0;i<3;i++)draw({h:.1,parts:[{m:'sphere:.07:5:4',o:[0,0,0],col:[224,224,239]}]},[4.6+Math.sin(WX.t*.09+i)*.12,1.3+((WX.t+i*20)%60)/80,7.8]);
  };
}
{
  const old=SCENES.floor3.drawOver;
  SCENES.floor3.drawOver=()=>{if(old)old();const m=homeMeal();if(m && m.to==='bea' && m.stage==='done')drawModel(HOME_NOTE,{p:[-4,.04,7.9],yaw:0},liveLight(WX.sc,[-4,0,7.9]));};
}
wrapEnts('maint',()=>[prop('ghostGuide',homeGhost() && homeGhost().guided?15.5:8,homeGhost() && homeGhost().guided?3:4.5,'GHOST\'S LIGHT',()=>homeGhostGuide(),{range:1.8,cond:homeGhostGuideAvailable,draw3:e=>drawModel(MODELS_P.ghost,{p:[e.p[0],.2,e.p[2]],yaw:3.14},liveLight(WX.sc,e.p))})]);
SCENES.maint.variantKey=()=>C3 && C3.ch===5 && F3('reset') && !F3('intercomDone')?(homeGhostGuideAvailable() && homeGhost().guided?'/reset-guided':'/reset-dim'):'';
SCENES.maint.variantScene=()=>{
  const s=Object.assign({},SCENES.maint);s.lights=s.lights.filter(l=>l.p[0]!==4);
  if(homeGhostGuideAvailable() && homeGhost().guided)s.lights=s.lights.concat([11,14,17].map(x=>({p:[x,1.4,4],col:[.55,.65,1],rad:4,int:1.2,glow:.5})));
  return s;
};
{
  const old=SCENES.maint.drawOver;
  SCENES.maint.drawOver=()=>{if(old)old();if(homeGhostGuideAvailable() && homeGhost().guided)for(const x of [11,14,17])drawModel({h:.15,parts:[box3(.45,.15,.12,[168,190,255])]}, {p:[x,2.2,6.45],yaw:0},liveLight(WX.sc,[x,0,4]));};
}
