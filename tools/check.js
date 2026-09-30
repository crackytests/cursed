const fs=require('fs'),vm=require('vm');
const el=()=>({style:{},getContext:()=>({createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){}})});
const ctx={document:{getElementById:el,documentElement:{}},addEventListener(){},innerWidth:800,innerHeight:720,performance:{now:()=>0},
 requestAnimationFrame(){},navigator:{},localStorage:{getItem:()=>null,setItem(){},removeItem(){}},console,Math,setInterval(){},Date,Promise,JSON};
ctx.window=ctx;vm.createContext(ctx);
let src="";const run1=s=>vm.runInContext(s,ctx);
for(const f of ['engine','audio','art','story','world','world2','battle','mini','extra'])run1(fs.readFileSync('js/'+f+'.js','utf8').replace(/\nboot\(\);\s*$/,'\n'));
src+=`
var errs=[];
for(const id in MAPS){const d=MAPS[id];const w=d.rows[0].length;
 d.rows.forEach((r,i)=>{if(r.length!==w)errs.push(id+' row '+i+' len '+r.length);});
 const leg=Object.assign({},LEGEND,d.legend||{});for(const r of d.rows)for(const ch of r)if(!leg[ch])errs.push(id+' bad char '+ch);
 for(const r of d.rows)for(const ch of r){const t=leg[ch];if(t&&!TILES[t])errs.push(id+' missing tile '+t);}
 S=newState();loadMap(id,1,1,'down');
 for(const e of M.ents){if(!SPR[e.spr])errs.push(id+' missing spr '+e.spr+' for '+e.id);}
 for(let i=0;i<5;i++){frame++;worldScene.update();worldScene.draw();drawOverlay();present();}
}
for(const k in FOES){const f=FOES[k];if(!SPR[f.spr])errs.push('foe spr '+f.spr);}
errs.join(' | ')||'ALL OK';`;
console.log(run1(src));
