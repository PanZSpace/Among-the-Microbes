(()=>{"use strict";
if(window.__microbePointerFx)return;
window.__microbePointerFx=true;

const motion=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");
if(motion&&motion.matches)return;

const timers=new WeakMap(),scale=2.5,maxParticles=80;
const heart=[".HH..HH.","HHHHHHHH","HHHHHHHH",".HHHHHH.","..HHHH..","...HH..."];
const sparkle=["...W...","...H...","H..H..H",".HHHHH.","HHHHHHH",".HHHHH.","H..H..H","...H..."];
const colors=["#ffb3e6","#ffe66d","#7ff0ee","#d4b9ff","#8bf2b5"];
const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
let width=0,height=0,particles=[],frameId=0,lastTrail=0,lastFrame=0;

canvas.className="fx";
canvas.setAttribute("aria-hidden","true");
canvas.style.cssText="position:fixed;inset:0;z-index:30;width:100%;height:100%;max-width:none;margin:0;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;pointer-events:none;image-rendering:pixelated";

function resize(){
  width=Math.max(1,Math.ceil(window.innerWidth/scale));
  height=Math.max(1,Math.ceil(window.innerHeight/scale));
  canvas.width=width;canvas.height=height
}
function schedule(){
  if(ctx&&!frameId)frameId=requestAnimationFrame(draw)
}
function spawn(x,y,count,isTrail){
  if(!ctx||motion&&motion.matches)return;
  for(let i=0;i<count;i++){
    const isHeart=!isTrail&&Math.random()<.62;
    const angle=isTrail?-Math.PI/2+(Math.random()-.5)*1.2:Math.random()*Math.PI*2;
    const speed=isTrail?.25+Math.random()*.35:.55+Math.random()*.9;
    particles.push({
      x:x/scale,y:y/scale,
      vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(isTrail?.15:.1),
      gravity:isTrail?-.002:.012,age:0,life:isTrail?22+Math.random()*12:34+Math.random()*18,
      size:isTrail?1:1+Math.random()*.6,color:colors[Math.random()*colors.length|0],
      sprite:isHeart?heart:sparkle
    })
  }
  if(particles.length>maxParticles)particles.splice(0,particles.length-maxParticles);
  schedule()
}
function drawSprite(particle){
  const fade=Math.min(1,(1-particle.age/particle.life)*1.4);
  ctx.globalAlpha=fade;
  particle.sprite.forEach((row,rowIndex)=>{
    for(let column=0;column<row.length;column++){
      const pixel=row[column];
      if(pixel==".")continue;
      ctx.fillStyle=pixel=="W"?"#ffffff":particle.color;
      ctx.fillRect(
        Math.round(particle.x+column*particle.size),
        Math.round(particle.y+rowIndex*particle.size),
        particle.size,particle.size
      )
    }
  })
}
function draw(now){
  frameId=0;
  if(document.hidden){particles=[];lastFrame=0;ctx.clearRect(0,0,width,height);return}
  const dt=lastFrame?Math.min(2,(now-lastFrame)/16.67):1;
  lastFrame=now;ctx.clearRect(0,0,width,height);
  for(let i=particles.length-1;i>=0;i--){
    const particle=particles[i];
    particle.age+=dt;particle.vy+=particle.gravity*dt;
    particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vx*=.99;
    if(particle.age>=particle.life){particles.splice(i,1);continue}
    drawSprite(particle)
  }
  ctx.globalAlpha=1;
  if(particles.length)frameId=requestAnimationFrame(draw)
}
function buttonFor(target){
  if(!(target instanceof Element))return null;
  const button=target.closest("button");
  return button&&!button.disabled&&button.getAttribute("aria-disabled")!="true"?button:null
}
function animateButton(button){
  if(!button||motion&&motion.matches)return;
  const previous=timers.get(button);
  if(previous)clearTimeout(previous);
  button.classList.remove("button-feedback");
  void button.offsetWidth;
  button.classList.add("button-feedback");
  timers.set(button,setTimeout(()=>{
    button.classList.remove("button-feedback");
    timers.delete(button)
  },460))
}

if(ctx){
  document.body.appendChild(canvas);
  resize();
  window.addEventListener("resize",resize,{passive:true});
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){
      particles=[];lastFrame=0;
      if(frameId)cancelAnimationFrame(frameId);
      frameId=0;ctx.clearRect(0,0,width,height)
    }
  })
}

window.addEventListener("pointermove",event=>{
  if((event.pointerType!="mouse"&&event.pointerType!="pen")||motion&&motion.matches)return;
  const now=performance.now();
  if(now-lastTrail<65)return;
  lastTrail=now;spawn(event.clientX,event.clientY,1,true)
},{passive:true});
window.addEventListener("pointerdown",event=>{
  animateButton(buttonFor(event.target));
  spawn(event.clientX,event.clientY,9,false)
},{passive:true});
window.addEventListener("keydown",event=>{
  if(event.repeat||(event.key!="Enter"&&event.key!=" "))return;
  const button=buttonFor(event.target);
  animateButton(button);
  if(button){
    const rect=button.getBoundingClientRect();
    spawn(rect.left+rect.width/2,rect.top+rect.height/2,7,false)
  }
});
})();
