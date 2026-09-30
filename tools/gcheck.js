const fs=require('fs'),vm=require('vm');
process.chdir('J:/games/gameboycarl');
const el=()=>({style:{},getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}})});
const ctx={document:{getElementById:el,documentElement:{}},addEventListener(){},innerWidth:800,innerHeight:720,performance:{now:()=>0},
 requestAnimationFrame(){},navigator:{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},console,Math,setInterval(){},Date,Promise,JSON,Object};
ctx.window=ctx;vm.createContext(ctx);
let src="";const run1=s=>vm.runInContext(s,ctx);
for(const f of ['js/engine','js/audio','js/art','linda/lcore','ghost/gcore','ghost/gworld','ghost/gshow'])run1(fs.readFileSync(f+'.js','utf8').replace(/\nboot\(\);\s*$/,'\n'));
src+=`
var errs=[];
S=gState();
for(const id in MAPS){const d=MAPS[id];const w=d.rows[0].length;
 d.rows.forEach((r,i)=>{if(r.length!==w)errs.push(id+' row '+i+' len '+r.length);});
 const leg=Object.assign({},LEGEND,d.legend||{});for(const r of d.rows)for(const ch of r){if(!leg[ch])errs.push(id+' bad char '+ch);else if(!TILES[leg[ch]])errs.push(id+' missing tile '+leg[ch]);}
 for(const day of [1,2,3,4,5]){S=gState();S.day=day;loadMap(id,1,1,'down');
  for(const e of M.ents){if(!SPR[e.spr])errs.push(id+' missing spr '+e.spr+' for '+e.id);
   if(e.x<0||e.y<0||e.x>=M.w||e.y>=M.h)errs.push(id+' ent out of map '+e.id); else if(TILES[M.t[e.y][e.x]].solid && !e.w)errs.push(id+' ent on solid tile '+e.id+' '+M.t[e.y][e.x]);}
  for(let i=0;i<5;i++){frame++;worldScene.update();worldScene.draw();drawOverlay();present();}}
 for(const k in (d.signs||{})){const [x,y]=k.split(',').map(Number);if(x>=w||y>=d.rows.length)errs.push(id+' sign oob '+k);}
}



errs.join(' | ')||'ALL OK';`;
console.log(run1(src));
