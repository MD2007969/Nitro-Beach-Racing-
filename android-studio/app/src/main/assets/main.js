const B=window.BABYLON;
const canvas=document.getElementById('game'),engine=new B.Engine(canvas,true,{adaptToDeviceRatio:true});
const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.48,.78,.95,1);
const camera=new B.FollowCamera('chase',new B.Vector3(0,12,-22),scene);
camera.radius=23;camera.heightOffset=10;camera.rotationOffset=180;camera.cameraAcceleration=.065;camera.maxCameraSpeed=60;scene.activeCamera=camera;
const sunlight=new B.HemisphericLight('sun',new B.Vector3(.3,1,.4),scene);sunlight.intensity=1.25;
const mat=(name,color)=>{let m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(color);return m};
const road=mat('asphalt','#343c47'),sand=mat('sand','#e6c77d'),sea=mat('sea','#128cb1'),white=mat('paint','#f7f1d0'),green=mat('palm','#247a45'),brown=mat('trunk','#80552d');
const themes={
 day:{sky:[.48,.78,.95],sand:'#e6c77d',sea:'#128cb1',road:'#343c47',green:'#247a45',light:1.25},
 sunset:{sky:[.97,.49,.33],sand:'#e7a86b',sea:'#84558b',road:'#493b50',green:'#426348',light:.85},
 neon:{sky:[.035,.045,.15],sand:'#575078',sea:'#153d77',road:'#22283f',green:'#23566b',light:.62}
};
let selectedTheme=localStorage.getItem('nbr_theme')||'day';
if(!themes[selectedTheme])selectedTheme='day';
function applyTheme(name){
 selectedTheme=name;localStorage.setItem('nbr_theme',name);
 const t=themes[name];scene.clearColor=new B.Color4(...t.sky,1);
 for(const [m,key] of [[sand,'sand'],[sea,'sea'],[road,'road'],[green,'green']])m.diffuseColor=B.Color3.FromHexString(t[key]);
 sunlight.intensity=t.light;
 if(selectedMap!==0){const mc=mapColors[selectedMap];sand.diffuseColor=B.Color3.FromHexString(mc.sand);sea.diffuseColor=B.Color3.FromHexString(mc.sea);green.diffuseColor=B.Color3.FromHexString(mc.green);road.diffuseColor=B.Color3.FromHexString(mc.road)}
 document.querySelectorAll('[data-theme]').forEach(b=>{b.style.outline=b.dataset.theme===name?'3px solid white':'none';b.setAttribute('aria-pressed',String(b.dataset.theme===name))});
}
const ground=B.MeshBuilder.CreateGround('island',{width:1100,height:1100},scene);ground.material=sand;
const water=B.MeshBuilder.CreateGround('ocean',{width:3000,height:3000},scene);water.position.y=-1.3;water.material=sea;
const mapCatalog=[
 {name:'Tropical Paradise',unlock:0,desc:'Palm-lined coastal circuit'},
 {name:'Neon City',unlock:0,desc:'Bright city skyline'},
 {name:'Desert Rush',unlock:1,desc:'Sand dunes and rocky roads'},
 {name:'Mountain Fury',unlock:2,desc:'Highland forest and sharp bends'},
 {name:'Coastal Highway',unlock:3,desc:'Open ocean and bridge views'}
];
let selectedMap=Math.max(0,Math.min(4,Number(localStorage.getItem('nbr_map')||0)));
const unlockedStage=Math.max(0,Math.min(3,Number(localStorage.getItem('nbr_career_stage')||0)));
if(mapCatalog[selectedMap].unlock>unlockedStage)selectedMap=0;
const N=160,rx=185,rz=125,points=[];
for(let i=0;i<N;i++){
 let a=i*2*Math.PI/N,x,z;
 if(selectedMap===1){x=188*Math.cos(a)+26*Math.sin(4*a);z=112*Math.sin(a)+24*Math.sin(3*a)}
 else if(selectedMap===2){x=200*Math.cos(a)+33*Math.sin(3*a);z=127*Math.sin(a)+23*Math.cos(5*a)}
 else if(selectedMap===3){x=170*Math.cos(a)+38*Math.sin(5*a);z=135*Math.sin(a)+21*Math.sin(4*a)}
 else if(selectedMap===4){x=210*Math.cos(a)+28*Math.sin(2*a);z=110*Math.sin(a)+28*Math.cos(3*a)}
 else{x=rx*Math.cos(a)+19*Math.sin(3*a);z=rz*Math.sin(a)+12*Math.sin(2*a)}
 points.push(new B.Vector3(x,.16,z))
}
const mapColors=[
 {sand:'#e6c77d',sea:'#128cb1',green:'#247a45',road:'#343c47'},
 {sand:'#35465e',sea:'#1a2e4f',green:'#4f86a4',road:'#292c40'},
 {sand:'#ce9c61',sea:'#ba8255',green:'#957343',road:'#554b47'},
 {sand:'#73936f',sea:'#42728a',green:'#255b40',road:'#3a4248'},
 {sand:'#e9cf9a',sea:'#1286a9',green:'#367b5c',road:'#384652'}
];
if(selectedMap!==0){const mc=mapColors[selectedMap];sand.diffuseColor=B.Color3.FromHexString(mc.sand);sea.diffuseColor=B.Color3.FromHexString(mc.sea);green.diffuseColor=B.Color3.FromHexString(mc.green);road.diffuseColor=B.Color3.FromHexString(mc.road)}

function tangent(i){return points[(i+1)%N].subtract(points[(i+N-1)%N]).normalize()}
function offset(i,side){let t=tangent(i);return points[i].add(new B.Vector3(-t.z,0,t.x).scale(side))}
function ribbon(name,width,material,y=0){let path1=[],path2=[];for(let i=0;i<=N;i++){let k=i%N;path1.push(offset(k,-width/2).add(new B.Vector3(0,y,0)));path2.push(offset(k,width/2).add(new B.Vector3(0,y,0)))}let mesh=B.MeshBuilder.CreateRibbon(name,{pathArray:[path1,path2],sideOrientation:B.Mesh.DOUBLESIDE},scene);mesh.material=material;return mesh}
ribbon('road',21,road,.02);
const shoulder=mat('warm shoulder','#f3e5bc'),stripe=mat('lane dash','#fff5d4');
for(let i=0;i<N;i+=4){
  for(const side of [-1,1]){const p=offset(i,side*10);const t=tangent(i);
    const line=B.MeshBuilder.CreateBox('edge',{width:.32,height:.08,depth:5.6},scene);
    line.position=p.add(new B.Vector3(0,.23,0));line.rotation.y=Math.atan2(t.x,t.z);line.material=shoulder;
  }
}
for(let i=0;i<N;i+=8){const p=points[i],t=tangent(i);const dash=B.MeshBuilder.CreateBox('dash',{width:.28,height:.08,depth:7},scene);dash.position=p.add(new B.Vector3(0,.25,0));dash.rotation.y=Math.atan2(t.x,t.z);dash.material=stripe}

for(let i=0;i<85;i++){let k=(i*17)%N,side=i%2?1:-1,p=offset(k,32+((i*13)%55)*side);if(Math.abs(p.x)<80&&Math.abs(p.z)<70)continue;let trunk=B.MeshBuilder.CreateCylinder('palm',{height:7,diameterTop:.6,diameterBottom:1.3,tessellation:6},scene);trunk.position=p.add(new B.Vector3(0,3.5,0));trunk.material=brown;let leaves=B.MeshBuilder.CreateSphere('canopy',{diameter:8,segments:5},scene);leaves.scaling.y=.4;leaves.position=p.add(new B.Vector3(0,8,0));leaves.material=green}
if(selectedMap!==0){
 const accent=mat('map accent',selectedMap===1?'#48c7e9':selectedMap===2?'#a67c52':selectedMap===3?'#345b40':'#a1d3d9');
 for(let i=0;i<35;i++){
  const k=(i*11)%N,p=offset(k,44+(i%4)*14*(i%2?1:-1));
  if(selectedMap===1){
   const tower=B.MeshBuilder.CreateBox('city tower',{width:9+(i%3)*5,height:20+(i%6)*9,depth:10},scene);
   tower.position.set(p.x,12+(i%6)*4.5,p.z);tower.material=accent;
  }else if(selectedMap===2){
   const rock=B.MeshBuilder.CreateSphere('desert rock',{diameter:9+(i%5)*3,segments:5},scene);
   rock.scaling.y=.55;rock.position.set(p.x,2,p.z);rock.material=accent;
  }else if(selectedMap===3){
   const peak=B.MeshBuilder.CreateCylinder('mountain peak',{diameterBottom:22,diameterTop:0,height:24+(i%4)*8,tessellation:5},scene);
   peak.position.set(p.x,10+(i%4)*4,p.z);peak.material=accent;
  }else{
   const post=B.MeshBuilder.CreateCylinder('coastal pillar',{diameter:3,height:10,tessellation:6},scene);
   post.position.set(p.x,4,p.z);post.material=accent;
  }
 }
}
function car(name,color,index,lane){
 let root=new B.TransformNode(name,scene),paint=mat(name+' paint',color),glass=mat(name+' glass','#142d46'),dark=mat(name+' trim','#161b24'),light=mat(name+' lights','#fff8c7'),tail=mat(name+' taillights','#e32742');
 function part(label,options,material,x,y,z){let mesh=B.MeshBuilder.CreateBox(name+' '+label,options,scene);mesh.parent=root;mesh.position.set(x,y,z);mesh.material=material;return mesh}
 part('body',{width:3.5,height:.95,depth:6.4},paint,0,1.25,0);
 part('front hood',{width:3.2,height:.32,depth:1.75},paint,0,1.78,2.05);
 part('rear deck',{width:3.25,height:.34,depth:1.35},paint,0,1.78,-2.35);
 part('cabin',{width:2.65,height:1.15,depth:2.85},glass,0,2.22,-.3);
 part('roof',{width:2.5,height:.15,depth:1.55},paint,0,2.88,-.58);
 part('front grille',{width:2.3,height:.33,depth:.12},dark,0,1.22,3.23);
 part('spoiler',{width:3.8,height:.19,depth:.52},dark,0,2.35,-3.0);
 for(const x of [-1.32,1.32]){
  part('headlamp',{width:.72,height:.23,depth:.14},light,x,1.58,3.2);
  part('taillamp',{width:.73,height:.23,depth:.14},tail,x,1.52,-3.2);
  part('mirror',{width:.48,height:.28,depth:.46},paint,x*1.16,2.15,.5);
  for(const z of [-2.12,2.12]){let wheel=B.MeshBuilder.CreateCylinder(name+' wheel',{diameter:1.55,height:.65,tessellation:12},scene);wheel.parent=root;wheel.rotation.z=Math.PI/2;wheel.position.set(x*1.33,.82,z);wheel.material=dark}
 }
 const c={root,index,lane,speed:0,lap:0,progress:0,boost:0};place(c,index,lane);return c
}
function place(c,index,lane){let p=offset((index+N)%N,lane);c.root.position.set(p.x,.1,p.z);let t=tangent((index+N)%N);c.root.rotation.y=Math.atan2(t.x,t.z)}
const player=car('YOU','#ff9f18',0,-3),bots=[car('RIVAL 1','#e83e64',N-3,3),car('RIVAL 2','#22bbd2',N-6,-3),car('RIVAL 3','#9b65ee',N-9,3)];camera.lockedTarget=player.root;

const fxBlue=mat('nitro glow','#15b9ff'),fxOrange=mat('nitro core','#ffe2a2'),smokeMat=mat('drift dust','#e9e5d5');
const flames=[],smoke=[];
for(const x of [-.85,.85]){
 let f=B.MeshBuilder.CreateCylinder('nitro flame',{height:2.2,diameterTop:.3,diameterBottom:.8,tessellation:8},scene);
 f.parent=player.root;f.rotation.x=Math.PI/2;f.position.set(x,.95,-4.0);f.material=fxBlue;f.setEnabled(false);flames.push(f);
}
for(const x of [-1.4,1.4]){
 let puff=B.MeshBuilder.CreateSphere('drift dust',{diameter:1.1,segments:6},scene);
 puff.parent=player.root;puff.position.set(x,.5,-2.65);puff.material=smokeMat;puff.setEnabled(false);smoke.push(puff)
}
function renderCarEffects(){
 const boost=active&&countdown<=0&&held('shift')&&!held('s','arrowdown')&&player.boost>0;
 const drifting=active&&countdown<=0&&held(' ')&&Math.abs(player.speed)>8;
 flames.forEach((f,i)=>{f.setEnabled(boost);f.scaling.y=1+Math.sin(elapsed*28+i)*.25});
 smoke.forEach((p,i)=>{p.setEnabled(drifting);p.scaling.set(1.1+Math.abs(Math.sin(elapsed*7+i))*.65,.6,1.3)});
}
const pickups=[];for(let i=8;i<N;i+=16){let orb=B.MeshBuilder.CreateTorus('pickup',{diameter:3,thickness:.65},scene);orb.material=mat('pickup mat','#ffe028');orb.position=offset(i,i%3===0?5:-5).add(new B.Vector3(0,2,0));pickups.push({mesh:orb,active:true,cool:0})}
const keys={};window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault()});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{
 const k=b.dataset.key.toLowerCase();const pointers=new Set();
 const press=e=>{e.preventDefault();e.stopPropagation();pointers.add(e.pointerId);keys[k]=true;b.classList.add('pressed');try{b.setPointerCapture(e.pointerId)}catch(_){}};
 const release=e=>{e.preventDefault();pointers.delete(e.pointerId);if(!pointers.size){keys[k]=false;b.classList.remove('pressed')}};
 b.addEventListener('pointerdown',press,{passive:false});
 for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,release,{passive:false});
 b.addEventListener('contextmenu',e=>e.preventDefault());
 b.addEventListener('selectstart',e=>e.preventDefault());
 b.addEventListener('dragstart',e=>e.preventDefault());
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'));for(const k of ['w','a','s','d','shift','e',' '])keys[k]=false}});
const difficultySettings={
 easy:{speed:39,spread:1.2,catchup:3,rate:.14},
 normal:{speed:51,spread:2.3,catchup:7,rate:.155},
 hard:{speed:64,spread:3.5,catchup:9,rate:.165},
 expert:{speed:61,spread:2.8,catchup:5,rate:.155}
};
let difficulty=localStorage.getItem('nbr_difficulty')||'normal';
if(!difficultySettings[difficulty])difficulty='normal';
function setDifficulty(value){
 if(!difficultySettings[value])return;
 difficulty=value;localStorage.setItem('nbr_difficulty',value);
 document.querySelectorAll('[data-difficulty]').forEach(b=>{const selected=b.dataset.difficulty===value;b.style.outline=selected?'3px solid white':'none';b.setAttribute('aria-pressed',String(selected))});
}
document.querySelectorAll('[data-difficulty]').forEach(b=>b.onclick=()=>setDifficulty(b.dataset.difficulty));
setDifficulty(difficulty);
const held=(...ks)=>ks.some(k=>keys[k]);let active=false,elapsed=0,countdown=0,inventory=0,coins=Number(localStorage.getItem('nbr_coins')||0),mode='quick',previous=0;
const carsCatalog=[
 {name:'Beach Runner',price:0,color:'#ff9f18',speed:1,handling:1},
 {name:'Coastal GT',price:250,color:'#25c8d8',speed:1.10,handling:1.06},
 {name:'Sunset Viper',price:650,color:'#ee4c70',speed:1.18,handling:1.12},
 {name:'Nitro Phantom',price:1300,color:'#a06dff',speed:1.27,handling:1.16}
];
let ownedCars=JSON.parse(localStorage.getItem('nbr_owned_cars')||'[0]');
if(!Array.isArray(ownedCars))ownedCars=[0];
let selectedCar=Number(localStorage.getItem('nbr_selected_car')||0);
if(!ownedCars.includes(selectedCar))selectedCar=0;
let speedLevel=Math.max(0,Math.min(3,Number(localStorage.getItem('nbr_speed_level')||0)));
let handlingLevel=Math.max(0,Math.min(3,Number(localStorage.getItem('nbr_handling_level')||0)));
let careerWins=Math.max(0,Number(localStorage.getItem('nbr_career_wins')||0));
let careerStage=Math.max(0,Math.min(3,Number(localStorage.getItem('nbr_career_stage')||0)));
const championship=[
 {name:'Rookie Cup',difficulty:'easy',bonus:80,rounds:1,laps:2,rule:'SPRINT · 2 laps · finish 1st to advance',nitroRate:23,boostRecharge:7},
 {name:'Coastal Challenge',difficulty:'normal',bonus:130,rounds:2,laps:3,rule:'ENDURANCE · 2 races · total points decide the winner',nitroRate:23,boostRecharge:4},
 {name:'Sunset Championship',difficulty:'hard',bonus:210,rounds:3,laps:3,rule:'CHAMPIONSHIP · 3 races · placement points determine champion',nitroRate:23,boostRecharge:5},
 {name:'Nitro Masters',difficulty:'expert',bonus:350,rounds:3,laps:3,rule:'MASTERS · 3 races · limited Nitro recharge · points decide',nitroRate:31,boostRecharge:2}
];
let seriesRound=0,seriesScores=[0,0,0,0],seriesActive=false;
const pointsAwarded=[10,7,5,3];
function seriesText(){
 if(!seriesActive)return '';
 return championship[careerStage].name+' · Race '+(seriesRound+1)+'/'+championship[careerStage].rounds+' · Points '+seriesScores.join('/');
}
function saveGarage(){
 localStorage.setItem('nbr_owned_cars',JSON.stringify(ownedCars));
 localStorage.setItem('nbr_selected_car',String(selectedCar));
 localStorage.setItem('nbr_speed_level',String(speedLevel));
 localStorage.setItem('nbr_handling_level',String(handlingLevel));
 localStorage.setItem('nbr_coins',String(coins));
}
function applyCar(){const spec=carsCatalog[selectedCar];player.root.getChildMeshes().forEach(m=>{if(m.name==='YOU body'||m.name==='YOU front hood'||m.name==='YOU rear deck'||m.name==='YOU roof'||m.name==='YOU mirror')m.material.diffuseColor=B.Color3.FromHexString(spec.color)})}
function refreshMaps(){
 const el=document.getElementById('mapOptions');
 if(!el)return;
 el.innerHTML=mapCatalog.map((m,i)=>'<button data-map="'+i+'" style="margin:3px;background:'+(selectedMap===i?'#35a86c':'#263e57')+';color:white;border:1px solid #8ca4ba">'+(m.unlock>careerStage?'🔒 ':'')+m.name+'</button>').join('');
 document.getElementById('mapDescription').textContent=mapCatalog[selectedMap].desc+' · '+(selectedMap<2?'Available immediately':'Career stage '+(mapCatalog[selectedMap].unlock+1));
 document.querySelectorAll('[data-map]').forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.map);
  if(mapCatalog[i].unlock>careerStage){document.getElementById('mapDescription').textContent='🔒 Win more Career championships to unlock '+mapCatalog[i].name;return}
  if(selectedMap===i)return;
  localStorage.setItem('nbr_map',String(i));location.reload()
 });
}
function refreshGarage(){
 document.getElementById('garageCoins').textContent='🪙 '+coins+' coins';
 document.getElementById('garageCars').innerHTML=carsCatalog.map((spec,i)=>'<button data-car="'+i+'" style="background:'+(selectedCar===i?'#35a86c':'#263e57')+';color:white;margin:4px;border:1px solid #8ca4ba">'+spec.name+' · '+(ownedCars.includes(i)?selectedCar===i?'SELECTED':'OWNED':spec.price+' coins')+'</button>').join('');
 document.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.car),spec=carsCatalog[i];if(!ownedCars.includes(i)){if(coins<spec.price){alert('Not enough coins! Race in Career to earn more.');return}coins-=spec.price;ownedCars.push(i)}selectedCar=i;saveGarage();applyCar();refreshGarage()});
 const speedCost=100*(speedLevel+1),handlingCost=100*(handlingLevel+1);
 document.getElementById('upgradeSpeed').textContent=speedLevel>=3?'SPEED MAXED':'⚡ Speed Lv '+speedLevel+'/3 · '+speedCost+' coins';
 document.getElementById('upgradeHandling').textContent=handlingLevel>=3?'HANDLING MAXED':'🎯 Handling Lv '+handlingLevel+'/3 · '+handlingCost+' coins';
 document.getElementById('progress').textContent='🪙 '+coins+' coins · '+careerWins+' career wins';
 document.getElementById('career').textContent=seriesActive?'CONTINUE: '+championship[careerStage].name+' '+(seriesRound+1)+'/'+championship[careerStage].rounds:'CAREER: '+championship[careerStage].name;
 document.getElementById('careerRules').textContent=championship[careerStage].rule;
 document.getElementById('seriesStandings').textContent=seriesActive?'🏆 '+seriesText()+' (YOU / RIVAL 1 / RIVAL 2 / RIVAL 3)':'';
}
document.getElementById('garageOpen').onclick=()=>{refreshGarage();document.getElementById('garage').style.display='flex'};
document.getElementById('garageClose').onclick=()=>document.getElementById('garage').style.display='none';
for(const [id,kind] of [['upgradeSpeed','speed'],['upgradeHandling','handling']]){
 document.getElementById(id).onclick=()=>{const level=kind==='speed'?speedLevel:handlingLevel,cost=100*(level+1);if(level>=3||coins<cost)return;if(kind==='speed')speedLevel++;else handlingLevel++;coins-=cost;saveGarage();refreshGarage()}
}
refreshGarage();refreshMaps();applyCar();
document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>applyTheme(b.dataset.theme));applyTheme(selectedTheme);
function begin(m){
 mode=m;
 if(m==='career'){
  setDifficulty(championship[careerStage].difficulty);
  if(!seriesActive){seriesRound=0;seriesScores=[0,0,0,0];seriesActive=true}
 }
 active=true;elapsed=0;countdown=3.5;inventory=2;previous=0;player.speed=0;player.lap=0;player.boost=100;place(player,0,-3);bots.forEach((b,i)=>{b.speed=0;b.progress=-(3+i*3);b.lap=0;b.lane=i%2?-3:3;b.stun=0;b.pulse=i*2.1;b.personality=i;place(b,N-3-i*3,b.lane)});document.getElementById('menu').style.display='none';msg.textContent=''}
document.getElementById('start').onclick=()=>begin('quick');document.getElementById('career').onclick=()=>begin('career');
const hud=document.getElementById('hud'),msg=document.getElementById('message');
function nearest(pos){let best=Infinity,idx=0;for(let i=0;i<N;i++){let d=B.Vector3.DistanceSquared(pos,points[i]);if(d<best){best=d;idx=i}}return {idx,dist:Math.sqrt(best)}}
function finish(){
 active=false;
 const playerTotal=player.lap*N+nearest(player.root.position).idx;
 const competitors=[{id:0,total:playerTotal},...bots.map((b,i)=>({id:i+1,total:b.lap*N+b.progress}))].sort((a,b)=>b.total-a.total);
 const rank=competitors.findIndex(x=>x.id===0)+1;
 let reward=mode==='career'?Math.max(30,120-rank*20):0;
 let result='FINISHED #'+rank+' · '+elapsed.toFixed(1)+'s';
 if(mode==='career'){
  const cup=championship[careerStage];
  competitors.forEach((x,i)=>seriesScores[x.id]+=pointsAwarded[i]);
  seriesRound++;
  const scoreLine=' · POINTS YOU '+seriesScores[0]+' / RIVALS '+seriesScores.slice(1).join(', ');
  if(seriesRound>=cup.rounds){
   const champion=seriesScores.every((score,i)=>i===0||seriesScores[0]>score);
   if(champion){
    reward+=cup.bonus;careerWins++;
    careerStage=Math.min(3,careerStage+1);
    localStorage.setItem('nbr_career_stage',String(careerStage));
    localStorage.setItem('nbr_career_wins',String(careerWins));
   }
   result=(champion?'🏆 CHAMPION! ':'CHAMPIONSHIP LOST · RETRY ') +cup.name+scoreLine;
   seriesActive=false;seriesRound=0;seriesScores=[0,0,0,0];
  }else result='RACE '+seriesRound+'/'+cup.rounds+' · POSITION #'+rank+scoreLine+' · Next race ready!';
 }
 coins+=reward;saveGarage();
 document.getElementById('menu').style.display='flex';
 refreshGarage();refreshMaps();
 document.querySelector('#menu p').textContent=result+' · +'+reward+' coins';
 msg.textContent='🏁 FINISH!';
 setTimeout(()=>msg.textContent='',2400)
}

// Lightweight live minimap: yellow player marker and three colored rival markers.
const mapCanvas=document.createElement('canvas');mapCanvas.width=180;mapCanvas.height=130;
mapCanvas.style.cssText='position:absolute;right:10px;top:10px;width:160px;height:116px;border:2px solid #ffffff88;border-radius:12px;background:#041522bb;pointer-events:none;z-index:3';
document.body.appendChild(mapCanvas);
const mapCtx=mapCanvas.getContext('2d');
function drawMinimap(){
  const ctx=mapCtx;ctx.clearRect(0,0,180,130);
  const project=p=>[90+p.x*.38,65+p.z*.38];
  ctx.strokeStyle='#e7f2f7';ctx.lineWidth=7;ctx.lineJoin='round';ctx.beginPath();
  points.forEach((p,i)=>{const [x,y]=project(p);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.closePath();ctx.stroke();
  for(const [root,color,radius] of [[...bots.map((b,i)=>[b.root,['#ff5476','#20d8fa','#b984ff'][i],4]),[player.root,'#ffce30',6]]].flat()){
    const [x,y]=project(root.position);ctx.beginPath();ctx.fillStyle=color;ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#07131c';ctx.lineWidth=1.5;ctx.stroke();
  }
}
engine.runRenderLoop(()=>{let dt=Math.min(engine.getDeltaTime()/1000,.04);if(active){if(countdown>0){countdown-=dt;msg.textContent=countdown>1?Math.ceil(countdown):'GO!';if(countdown<=0)msg.textContent=''}else{elapsed+=dt;let turn=(held('a','arrowleft')?-1:0)+(held('d','arrowright')?1:0),accelerate=true,brake=held('s','arrowdown'),drift=held(' '),nitro=held('shift');let target=(brake?9:53)*(carsCatalog[selectedCar].speed+speedLevel*.045);player.boost=Math.min(100,player.boost+dt*(mode==='career'?championship[careerStage].boostRecharge:5));if(nitro&&!brake&&player.boost>0){target=95*(carsCatalog[selectedCar].speed+speedLevel*.045);player.boost=Math.max(0,player.boost-dt*(mode==='career'?championship[careerStage].nitroRate:23));msg.textContent='⚡ NITRO!'}else if(drift&&Math.abs(player.speed)>8){msg.textContent='💨 DRIFT!'}else if(msg.textContent==='⚡ NITRO!'||msg.textContent==='💨 DRIFT!'){msg.textContent=''}player.speed+=(target-player.speed)*Math.min(1,dt*(brake?3.5:1.5));player.root.rotation.y+=turn*dt*(.8+Math.min(Math.abs(player.speed)/42,1)*1.5)*(drift?2.1:1)*(carsCatalog[selectedCar].handling+handlingLevel*.06)*Math.sign(player.speed||1);let forward=new B.Vector3(Math.sin(player.root.rotation.y),0,Math.cos(player.root.rotation.y));player.root.position.addInPlace(forward.scale(player.speed*dt));let near=nearest(player.root.position);if(near.dist>15){player.speed*=1-dt*.9;if(near.dist>45){let p=offset(near.idx,0);player.root.position=B.Vector3.Lerp(player.root.position,p,.07)}}if(near.idx<12&&previous>N-16&&player.speed>0){player.lap++;if(player.lap>=(mode==='career'?championship[careerStage].laps:3))finish()}previous=near.idx;for(let b of bots){
  const i=bots.indexOf(b);
  const playerTotal=player.lap*N+near.idx;
  const botTotal=b.lap*N+b.progress;
  const gap=playerTotal-botTotal;
  // Faster opponents with restrained catch-up: rivals can lead, but never teleport.
  const cfg=difficultySettings[difficulty];
  const catchup=Math.max(-3,Math.min(cfg.catchup,gap*.11));
  // Distinct personalities: sprinter, overtaker, and consistent racer.
  const personalitySpeed=[3.5,0,-1.5][i];
  const surge=i===0?Math.max(0,Math.sin(elapsed*.33+b.pulse))*3:0;
  const mistake=(difficulty==='expert'&&Math.sin(elapsed*.24+b.pulse)>0.92)?-7:0;
  const cruise=cfg.speed+i*cfg.spread+personalitySpeed+catchup+surge+mistake+Math.sin(elapsed*.48+b.pulse)*(i===2?1:2.5);
  b.stun=Math.max(0,(b.stun||0)-dt);
  const desired=b.stun>0?cruise*.3:cruise;
  b.speed+=(desired-b.speed)*Math.min(1,dt*2.1);
  b.progress+=dt*b.speed*cfg.rate;
  if(b.progress>=N){b.progress-=N;b.lap++}
  const k=((Math.floor(b.progress)%N)+N)%N;
  const fraction=((b.progress%1)+1)%1;
  const next=(k+1)%N;
  // Lane changes create overtakes and prevent opponents forming a single-file train.
  const laneTarget=b.lane+Math.sin(elapsed*(i===1?.63:.35)+b.pulse)*(i===1?3.3:1.7);
  const p0=offset(k,laneTarget),p1=offset(next,laneTarget);
  const targetPos=B.Vector3.Lerp(p0,p1,fraction);
  const dir=p1.subtract(p0);
  b.root.rotation.y=Math.atan2(dir.x,dir.z);
  b.root.position=B.Vector3.Lerp(b.root.position,targetPos,Math.min(1,dt*12));
  if(B.Vector3.Distance(player.root.position,b.root.position)<4)player.speed*=.965;
}for(let p of pickups){p.mesh.rotation.y+=dt*2;if(!p.active){p.cool-=dt;if(p.cool<=0){p.active=true;p.mesh.setEnabled(true)}}else if(B.Vector3.Distance(player.root.position,p.mesh.position)<4){p.active=false;p.cool=12;p.mesh.setEnabled(false);inventory=Math.min(3,inventory+1);player.boost=Math.min(100,player.boost+25)}}if(held('e')&&inventory>0&&!keys._used){inventory--;msg.textContent='💥 POWER!';setTimeout(()=>{if(msg.textContent==='💥 POWER!')msg.textContent=''},800);player.boost=Math.min(100,player.boost+35);bots.forEach(b=>{if(B.Vector3.Distance(player.root.position,b.root.position)<30)b.stun=2.5});keys._used=true}if(!held('e'))keys._used=false;let rank=1+bots.filter(b=>b.lap*N+b.progress>player.lap*N+near.idx).length;hud.innerHTML='🏁 '+difficulty.toUpperCase()+' · POSITION '+rank+'/4 &nbsp; LAP '+Math.min(mode==='career'?championship[careerStage].laps:3,player.lap+1)+'/'+(mode==='career'?championship[careerStage].laps:3)<br>⚡ '+Math.round(Math.abs(player.speed)*3.6)+' km/h &nbsp; NITRO '+Math.round(player.boost)+'%<br>💥 POWER-UPS '+inventory+' &nbsp; ⏱ '+elapsed.toFixed(1)+'s'}}renderCarEffects();drawMinimap();scene.render()});window.addEventListener('resize',()=>engine.resize());
