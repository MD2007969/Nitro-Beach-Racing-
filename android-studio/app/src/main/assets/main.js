const B=window.BABYLON;
const canvas=document.getElementById('game'),engine=new B.Engine(canvas,true,{adaptToDeviceRatio:true});
const scene=new B.Scene(engine);scene.clearColor=new B.Color4(.48,.78,.95,1);
const camera=new B.FollowCamera('chase',new B.Vector3(0,12,-22),scene);
camera.radius=23;camera.heightOffset=10;camera.rotationOffset=180;camera.cameraAcceleration=.065;camera.maxCameraSpeed=60;scene.activeCamera=camera;
new B.HemisphericLight('sun',new B.Vector3(.3,1,.4),scene).intensity=1.25;
const mat=(name,color)=>{let m=new B.StandardMaterial(name,scene);m.diffuseColor=B.Color3.FromHexString(color);return m};
const road=mat('asphalt','#343c47'),sand=mat('sand','#e6c77d'),sea=mat('sea','#128cb1'),white=mat('paint','#f7f1d0'),green=mat('palm','#247a45'),brown=mat('trunk','#80552d');
const ground=B.MeshBuilder.CreateGround('island',{width:1100,height:1100},scene);ground.material=sand;
const water=B.MeshBuilder.CreateGround('ocean',{width:3000,height:3000},scene);water.position.y=-1.3;water.material=sea;
const N=160,rx=185,rz=125,points=[];
for(let i=0;i<N;i++){let a=i*2*Math.PI/N;points.push(new B.Vector3(rx*Math.cos(a)+19*Math.sin(3*a),.16,rz*Math.sin(a)+12*Math.sin(2*a)))}
function tangent(i){return points[(i+1)%N].subtract(points[(i+N-1)%N]).normalize()}
function offset(i,side){let t=tangent(i);return points[i].add(new B.Vector3(-t.z,0,t.x).scale(side))}
function ribbon(name,width,material,y=0){let path1=[],path2=[];for(let i=0;i<=N;i++){let k=i%N;path1.push(offset(k,-width/2).add(new B.Vector3(0,y,0)));path2.push(offset(k,width/2).add(new B.Vector3(0,y,0)))}let mesh=B.MeshBuilder.CreateRibbon(name,{pathArray:[path1,path2],sideOrientation:B.Mesh.DOUBLESIDE},scene);mesh.material=material;return mesh}
ribbon('road',21,road,.02);ribbon('center line',.3,white,.05);
for(let i=0;i<85;i++){let k=(i*17)%N,side=i%2?1:-1,p=offset(k,32+((i*13)%55)*side);if(Math.abs(p.x)<80&&Math.abs(p.z)<70)continue;let trunk=B.MeshBuilder.CreateCylinder('palm',{height:7,diameterTop:.6,diameterBottom:1.3,tessellation:6},scene);trunk.position=p.add(new B.Vector3(0,3.5,0));trunk.material=brown;let leaves=B.MeshBuilder.CreateSphere('canopy',{diameter:8,segments:5},scene);leaves.scaling.y=.4;leaves.position=p.add(new B.Vector3(0,8,0));leaves.material=green}
function car(name,color,index,lane){let root=new B.TransformNode(name,scene),body=B.MeshBuilder.CreateBox(name+' body',{width:3.4,height:1.25,depth:6},scene);body.parent=root;body.position.y=1.3;body.material=mat(name+' paint',color);let top=B.MeshBuilder.CreateBox(name+' cabin',{width:2.5,height:1.1,depth:2.6},scene);top.parent=root;top.position.set(0,2.3,-.4);top.material=mat(name+' glass','#152b43');for(let x of [-1.7,1.7])for(let z of [-2,2]){let wheel=B.MeshBuilder.CreateCylinder('wheel',{diameter:1.5,height:.6,tessellation:12},scene);wheel.parent=root;wheel.rotation.z=Math.PI/2;wheel.position.set(x,.8,z);wheel.material=mat('tire','#14171c')}let c={root,index,lane,speed:0,lap:0,progress:0,boost:0};place(c,index,lane);return c}
function place(c,index,lane){let p=offset((index+N)%N,lane);c.root.position.set(p.x,.1,p.z);let t=tangent((index+N)%N);c.root.rotation.y=Math.atan2(t.x,t.z)}
const player=car('YOU','#ff9f18',0,-3),bots=[car('RIVAL 1','#e83e64',N-3,3),car('RIVAL 2','#22bbd2',N-6,-3),car('RIVAL 3','#9b65ee',N-9,3)];camera.lockedTarget=player.root;
const pickups=[];for(let i=8;i<N;i+=16){let orb=B.MeshBuilder.CreateTorus('pickup',{diameter:3,thickness:.65},scene);orb.material=mat('pickup mat','#ffe028');orb.position=offset(i,i%3===0?5:-5).add(new B.Vector3(0,2,0));pickups.push({mesh:orb,active:true,cool:0})}
const keys={};window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key))e.preventDefault()});window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-key]').forEach(b=>{let k=b.dataset.key.toLowerCase();b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;b.setPointerCapture(e.pointerId)});for(let ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys[k]=false)});
const held=(...ks)=>ks.some(k=>keys[k]);let active=false,elapsed=0,countdown=0,inventory=0,coins=Number(localStorage.getItem('nbr_coins')||0),mode='quick',previous=0;
document.getElementById('progress').textContent='Career coins saved: '+coins;
function begin(m){mode=m;active=true;elapsed=0;countdown=3.5;inventory=2;previous=0;player.speed=0;player.lap=0;player.boost=100;place(player,0,-3);bots.forEach((b,i)=>{b.speed=0;b.progress=-(3+i*3);b.lap=0;b.lane=i%2?-3:3;b.stun=0;b.pulse=i*2.1;place(b,N-3-i*3,b.lane)});document.getElementById('menu').style.display='none';msg.textContent=''}
document.getElementById('start').onclick=()=>begin('quick');document.getElementById('career').onclick=()=>begin('career');
const hud=document.getElementById('hud'),msg=document.getElementById('message');
function nearest(pos){let best=Infinity,idx=0;for(let i=0;i<N;i++){let d=B.Vector3.DistanceSquared(pos,points[i]);if(d<best){best=d;idx=i}}return {idx,dist:Math.sqrt(best)}}
function finish(){active=false;let rank=1+bots.filter(b=>b.lap*N+b.progress>player.lap*N+nearest(player.root.position).idx).length;let reward=mode==='career'?Math.max(20,120-rank*20):0;coins+=reward;localStorage.setItem('nbr_coins',coins);if(mode==='career')localStorage.setItem('nbr_rookie','complete');document.getElementById('menu').style.display='flex';document.getElementById('progress').textContent='Career coins saved: '+coins;document.querySelector('#menu p').textContent='FINISHED #'+rank+' · '+elapsed.toFixed(1)+'s · +'+reward+' coins';msg.textContent='🏁 FINISH!';setTimeout(()=>msg.textContent='',2400)}

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
engine.runRenderLoop(()=>{let dt=Math.min(engine.getDeltaTime()/1000,.04);if(active){if(countdown>0){countdown-=dt;msg.textContent=countdown>1?Math.ceil(countdown):'GO!';if(countdown<=0)msg.textContent=''}else{elapsed+=dt;let turn=(held('a','arrowleft')?-1:0)+(held('d','arrowright')?1:0),accelerate=held('w','arrowup'),brake=held('s','arrowdown'),drift=held(' '),nitro=held('shift');let target=accelerate?53:brake?-13:0;player.boost=Math.min(100,player.boost+dt*5);if(nitro&&accelerate&&player.boost>0){target=95;player.boost=Math.max(0,player.boost-dt*23);msg.textContent='⚡ NITRO!'}else if(drift&&Math.abs(player.speed)>8){msg.textContent='💨 DRIFT!'}else if(msg.textContent==='⚡ NITRO!'||msg.textContent==='💨 DRIFT!'){msg.textContent=''}player.speed+=(target-player.speed)*Math.min(1,dt*(accelerate?1.5:2));player.root.rotation.y+=turn*dt*(.8+Math.min(Math.abs(player.speed)/42,1)*1.5)*(drift?2.1:1)*Math.sign(player.speed||1);let forward=new B.Vector3(Math.sin(player.root.rotation.y),0,Math.cos(player.root.rotation.y));player.root.position.addInPlace(forward.scale(player.speed*dt));let near=nearest(player.root.position);if(near.dist>15){player.speed*=1-dt*.9;if(near.dist>45){let p=offset(near.idx,0);player.root.position=B.Vector3.Lerp(player.root.position,p,.07)}}if(near.idx<12&&previous>N-16&&player.speed>0){player.lap++;if(player.lap>=3)finish()}previous=near.idx;for(let b of bots){
  const i=bots.indexOf(b), playerTotal=player.lap*N+near.idx, botTotal=b.lap*N+b.progress;
  const gap=playerTotal-botTotal;
  const catchup=Math.max(-7,Math.min(14,gap*.26));
  const cruise=42+i*2.4+catchup+Math.sin(elapsed*.42+b.pulse)*3.5;
  b.stun=Math.max(0,(b.stun||0)-dt);
  const desired=b.stun>0?cruise*.35:cruise;
  b.speed+=(desired-b.speed)*Math.min(1,dt*1.9);
  const oldProgress=b.progress;
  b.progress+=dt*b.speed*.13;
  if(b.progress>=N){b.progress-=N;b.lap++}
  if(b.progress<0){const k=((b.progress%N)+N)%N;b.root.position.copyFrom(offset(Math.floor(k),b.lane))}
  const k=((Math.floor(b.progress)%N)+N)%N;
  const fraction=((b.progress%1)+1)%1;
  const next=(k+1)%N;
  const sideShift=Math.sin(elapsed*.7+b.pulse)*1.4;
  const p0=offset(k,b.lane+sideShift),p1=offset(next,b.lane+sideShift);
  const targetPos=B.Vector3.Lerp(p0,p1,fraction);
  const dir=p1.subtract(p0);
  b.root.rotation.y=Math.atan2(dir.x,dir.z);
  b.root.position=B.Vector3.Lerp(b.root.position,targetPos,Math.min(1,dt*11));
  if(B.Vector3.Distance(player.root.position,b.root.position)<4)player.speed*=.96;
}for(let p of pickups){p.mesh.rotation.y+=dt*2;if(!p.active){p.cool-=dt;if(p.cool<=0){p.active=true;p.mesh.setEnabled(true)}}else if(B.Vector3.Distance(player.root.position,p.mesh.position)<4){p.active=false;p.cool=12;p.mesh.setEnabled(false);inventory=Math.min(3,inventory+1);player.boost=Math.min(100,player.boost+25)}}if(held('e')&&inventory>0&&!keys._used){inventory--;msg.textContent='💥 POWER!';setTimeout(()=>{if(msg.textContent==='💥 POWER!')msg.textContent=''},800);player.boost=Math.min(100,player.boost+35);bots.forEach(b=>{if(B.Vector3.Distance(player.root.position,b.root.position)<30)b.stun=2.5});keys._used=true}if(!held('e'))keys._used=false;let rank=1+bots.filter(b=>b.lap*N+b.progress>player.lap*N+near.idx).length;hud.innerHTML='🏁 POSITION '+rank+'/4 &nbsp; LAP '+Math.min(3,player.lap+1)+'/3<br>⚡ '+Math.round(Math.abs(player.speed)*3.6)+' km/h &nbsp; NITRO '+Math.round(player.boost)+'%<br>💥 POWER-UPS '+inventory+' &nbsp; ⏱ '+elapsed.toFixed(1)+'s'}}drawMinimap();scene.render()});window.addEventListener('resize',()=>engine.resize());
