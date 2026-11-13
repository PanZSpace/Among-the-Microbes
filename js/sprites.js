"use strict";
/* ===== RENDER ===== */
function disc(c,x,y,rx,ry,col){c.fillStyle=col;for(let j=-ry;j<=ry;j++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry+.01))));c.fillRect(x-w,y+j,2*w+1,1)}}
function gramColor(g){return g=="Gram+"?"#b99df5":g=="Gram−"?"#8adcb5":g=="Gram-variable"?"#ffc3aa":g=="Gram-indeterminate"?"#b9edff":"#ffd27f"}
function virusCell(cv,id,t,mood){const c=cv.getContext("2d"),p=PATHOGENS.find(x=>x.id==id),col=p?p.accent:"#8be3e2",cx=64+(RM?0:Math.round(Math.sin(t/700)*3)),cy=48+(RM?0:Math.round(Math.sin(t/400)*2));c.clearRect(0,0,128,96);
for(let i=0;i<16;i++){const a=i/16*6.28+(RM?0:t/1600),x=Math.round(cx+Math.cos(a)*31),y=Math.round(cy+Math.sin(a)*25);c.fillStyle="#dce8f8";c.fillRect(x-1,y-5,3,7);c.fillStyle=col;c.fillRect(x-3,y-8,7,4)}
disc(c,cx,cy,28,23,col);disc(c,cx,cy,19,15,"#263854");for(let i=0;i<7;i++){const x=cx-12+i*4,y=cy+Math.round(Math.sin(i*1.3+t/700)*5);c.fillStyle=i%2?"#ffd27f":"#dce8f8";c.fillRect(x,y,2,2)}
const happy=mood=="happy"||mood=="excited",sad=mood=="sad"||mood=="worried"||mood=="dying",worried=mood=="worried",angry=mood=="angry",shy=mood=="shy",sly=mood=="sly",surprised=mood=="surprised"||mood=="excited";c.fillStyle="#fff";c.fillRect(cx-10,cy-7,5,6);c.fillRect(cx+5,cy-7,5,6);c.fillStyle="#111";if(mood=="dying"){c.fillRect(cx-10,cy-5,5,2);c.fillRect(cx+5,cy-5,5,2)}else if(sad){c.fillRect(cx-9,cy-5,3,3);c.fillRect(cx+6,cy-5,3,3)}else{c.fillRect(cx-9,cy-5,3,4);c.fillRect(cx+6,cy-5,3,4)}
c.fillStyle="#201e3c";if(mood=="dying"){c.fillRect(cx-4,cy+4,8,2)}else if(angry){c.fillRect(cx-6,cy+4,12,2);c.fillRect(cx-11,cy-10,7,2);c.fillRect(cx+4,cy-10,7,2)}else if(happy){c.fillRect(cx-5,cy+3,2,2);c.fillRect(cx-3,cy+5,6,2);c.fillRect(cx+3,cy+3,2,2)}else if(sad||worried){c.fillRect(cx-4,cy+5,8,2)}else if(shy){c.fillStyle="#ff8fa3";c.fillRect(cx-17,cy+2,5,2);c.fillRect(cx+12,cy+2,5,2);c.fillStyle="#201e3c";c.fillRect(cx-3,cy+5,6,2)}else if(sly){c.fillRect(cx-4,cy+5,8,2);c.fillRect(cx+2,cy+3,5,2)}else if(surprised){c.fillRect(cx-2,cy+3,5,5)}else c.fillRect(cx-5,cy+4,10,2)}
function cell(cv,sk,tier,t,mood="neutral"){if(typeof PATHOGENS!="undefined"&&PATHOGENS.some(p=>p.id==sk&&p.kind=="Virus"))return virusCell(cv,sk,t,mood);const c=cv.getContext("2d");c.clearRect(0,0,128,96);const s=sk=="Om"?{g:"x"}:SP[sk],col=sk=="Om"?"#ffd27f":gramColor(s.g),dk="#00000033";
const cy=50+(RM?0:Math.round(Math.sin(t/400)*2)),cx=64+(RM?0:Math.round(Math.sin(t/700)*3));
if(tier>=3&&!RM)for(let i=0;i<14;i++){const a=i/14*6.28+t/900;c.fillStyle=TC[Math.min(tier,6)];c.fillRect(Math.round(cx+Math.cos(a)*(42+tier)),Math.round(cy+Math.sin(a)*(30+tier)),2,2)}
let fx=cx,fy=cy;
if(sk=="Sa"){[[52,44],[72,44],[62,57],[62,34],[80,56],[46,58]].forEach(p=>disc(c,p[0],p[1]+cy-50,10,10,col));fx=62;fy=cy-6}
else if(sk=="Sp"){disc(c,cx-14,cy,14,14,col);disc(c,cx+14,cy,14,14,col);fx=cx-14}
else if(sk=="En"){[-22,0,22].forEach(x=>disc(c,cx+x,cy,10,10,col));fx=cx}
else if(sk=="Ab"){disc(c,cx-10,cy,12,9,col);disc(c,cx+10,cy,12,9,col);fx=cx-10}
else{const d={Ec:[24,13],Kp:[24,13],Pa:[26,10],Ab:[17,12],Hi:[14,11],Lb:[30,9],Bs:[28,10],Gv:[15,10],Mp:[15,11],Yp:[15,10],Vc:[20,10],Om:[26,18]}[sk];
if(sk=="Kp")disc(c,cx,cy,d[0]+5,d[1]+5,"#b99df555");if(sk=="Ec"){c.fillStyle="#8adcb599";for(let i=-5;i<=5;i++){c.fillRect(cx+i*5,cy-d[1]-4,1,4);c.fillRect(cx+i*5,cy+d[1]+1,1,4)}}
if(sk=="Pa"){c.fillStyle=col;for(let i=0;i<14;i++)c.fillRect(cx-d[0]-3-i*2,cy+Math.round(Math.sin(i+(RM?0:t/200))*3),2,2)}
if(sk=="Vc"){for(let i=0;i<8;i++){const x=cx-10+i*3,y=cy-Math.round(Math.sin(i/7*Math.PI)*6);disc(c,x,y,5,5,col)}}else disc(c,cx,cy,d[0],d[1],col)}
if(sk=="Bs"){disc(c,cx+10,cy,5,4,"#ffe9a8")}
const worn=Array.isArray(S.eq)?S.eq:S.eq?[S.eq]:[],q=worn[0]||"";
if(q=="angelWings"){
  const rows=[[-19,8],[-15,12],[-11,15],[-7,14],[-3,11],[1,6]],wing=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
  rows.forEach(([y,w],i)=>{wing(cx-22-w,cy+y,w,4,i%2?"#DCEEFF":"#FFFFFF");wing(cx+22,cy+y,w,4,i%2?"#FFFFFF":"#DCEEFF")});
  c.fillStyle="#648DBB";c.fillRect(cx-28,cy-7,7,3);c.fillRect(cx+21,cy-7,7,3)
}
if(q=="devilWings"){
  const rows=[[-22,5],[-17,9],[-12,14],[-7,15],[-2,11],[2,6]],wing=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h)};
  rows.forEach(([y,w],i)=>{wing(cx-22-w,cy+y,w,4,i%2?"#263F68":"#648DBB");wing(cx+22,cy+y,w,4,i%2?"#648DBB":"#263F68")});
  c.fillStyle="#D5DFEA";c.fillRect(cx-31,cy-8,5,2);c.fillRect(cx+26,cy-8,5,2)
}
const happy=mood=="happy"||mood=="excited",sad=mood=="sad"||mood=="worried"||mood=="dying",worried=mood=="worried",angry=mood=="angry",shy=mood=="shy",sly=mood=="sly",surprised=mood=="surprised"||mood=="excited";
c.fillStyle="#fff";c.fillRect(fx-9,fy-(surprised?7:6),5,surprised?7:6);c.fillRect(fx+4,fy-(surprised?7:6),5,surprised?7:6);
c.fillStyle="#111";if(mood=="dying"){c.fillRect(fx-8,fy-4,4,2);c.fillRect(fx-7,fy-5,2,4);c.fillRect(fx+5,fy-4,4,2);c.fillRect(fx+6,fy-5,2,4)}else if(sad){c.fillRect(fx-7,fy-4,3,3);c.fillRect(fx+6,fy-4,3,3)}else{c.fillRect(fx-7,fy-4,3,4);c.fillRect(fx+6,fy-4,3,4)}
c.fillStyle="#5e356b";
if(mood=="dying"){c.fillRect(fx-4,fy+4,8,2);c.fillStyle="#b9edff";c.fillRect(fx+12,fy+2,2,5);c.fillRect(fx+14,fy+5,2,3)}
else if(angry){c.fillRect(fx-10,fy-8,7,2);c.fillRect(fx+4,fy-8,7,2);c.fillRect(fx-5,fy+4,10,2)}
else if(happy){c.fillRect(fx-5,fy+3,2,2);c.fillRect(fx-3,fy+5,6,2);c.fillRect(fx+3,fy+3,2,2)}
else if(sad){c.fillRect(fx-5,fy+6,3,2);c.fillRect(fx-2,fy+4,5,2);c.fillRect(fx+3,fy+6,3,2)}
else if(shy){c.fillStyle="#ff8fa3";c.fillRect(fx-12,fy+2,5,2);c.fillRect(fx+7,fy+2,5,2);c.fillStyle="#5e356b";c.fillRect(fx-3,fy+5,6,2)}
else if(sly){c.fillRect(fx-5,fy+5,8,2);c.fillRect(fx+2,fy+3,4,2);c.fillRect(fx-9,fy-7,8,2)}
else if(worried){c.fillRect(fx-10,fy-8,7,2);c.fillRect(fx+4,fy-8,7,2);c.fillRect(fx-3,fy+5,6,2)}
else if(surprised){c.fillRect(fx-2,fy+3,5,5);c.fillStyle="#fff";c.font="9px monospace";c.fillText("!",fx+13,fy-12)}
else{c.fillRect(fx-5,fy+4,10,2);c.fillRect(fx-6,fy+3,2,1);c.fillRect(fx+4,fy+3,2,1)}
if(q=="flowerCrown"){disc(c,fx-8,fy-19,4,3,"#FFFFFF");disc(c,fx,fy-23,4,3,"#DCEEFF");disc(c,fx+8,fy-19,4,3,"#A9CFF2");c.fillStyle="#648DBB";c.fillRect(fx-9,fy-16,18,2);c.fillRect(fx-13,fy-18,3,3);c.fillRect(fx+10,fy-18,3,3)}
else if(q=="crown"||tier>=4){c.fillStyle="#ffd27f";c.fillRect(fx-8,fy-20,16,3);[-8,-1,6].forEach(x=>c.fillRect(fx+x,fy-24,3,4))}
if(q=="bow"){c.fillStyle="#c7b5ff";c.fillRect(fx+10,fy-18,5,5);c.fillRect(fx+17,fy-18,5,5);c.fillRect(fx+15,fy-16,3,3)}
if(q=="glasses"){c.fillStyle="#111";[-11,2].forEach(x=>{c.fillRect(fx+x,fy-8,9,1);c.fillRect(fx+x,fy+1,9,1);c.fillRect(fx+x,fy-8,1,10);c.fillRect(fx+x+8,fy-8,1,10)});c.fillRect(fx-2,fy-5,4,1)}
if(q=="chef"){c.fillStyle="#fff";c.fillRect(fx-7,fy-22,14,6);disc(c,fx-5,fy-24,4,3,"#fff");disc(c,fx+5,fy-24,4,3,"#fff");disc(c,fx,fy-26,4,3,"#fff")}
if(!["angelWings","devilWings","flowerCrown","crown","bow","glasses","chef"].includes(q))drawExtraAccessory(c,q,fx,fy,cx,cy);
if(worn.length>1)drawExtraAccessory(c,worn[1],fx,fy,cx,cy);
}
function drawExtraAccessory(c,id,x,y,cx,cy){
const pixel=(color,points)=>{c.fillStyle=color;points.forEach(([a,b,w,h])=>c.fillRect(x+a,y+b,w,h))};
if(id=="bow"){pixel("#c7b5ff",[[-18,-20,6,6],[-10,-20,6,6],[-14,-17,5,4]]);return}
if(id=="glasses"){pixel("#11182d",[[-11,-8,9,9],[2,-8,9,9],[-2,-5,4,2]]);pixel("#8be3e2",[[-9,-6,5,2],[4,-6,5,2]]);return}
if(id=="chef"){pixel("#fff",[[-7,-22,14,6],[-8,-24,5,4],[-2,-27,6,5],[4,-24,5,4]]);return}
if(id=="crown"){pixel("#ffd27f",[[-8,-20,16,4],[-8,-24,3,4],[-1,-26,3,6],[5,-24,3,4]]);return}
if(id=="flowerCrown"){pixel("#80dbe8",[[-9,-17,18,2]]);[[-8,-20,"#fff"],[0,-23,"#dceeff"],[8,-20,"#ffa88e"]].forEach(([a,b,color])=>pixel(color,[[a,b,5,4]]));return}
if(id=="angelWings"){pixel("#fff",[[-38,-15,11,4],[-35,-10,13,4],[-31,-5,10,4],[25,-15,11,4],[22,-10,13,4],[21,-5,10,4]]);return}
if(id=="devilWings"){pixel("#648dbb",[[-37,-17,12,4],[-33,-12,14,4],[-29,-7,11,4],[25,-17,12,4],[19,-12,14,4],[18,-7,11,4]]);return}
const p={halo:"#ffe48c",scarf:"#ff9eaa",leaf:"#8be3a5",sunglasses:"#29365e",star:"#ffe09a",headphones:"#ff8fc8",crystal:"#8be3e2",shell:"#ffc3aa",ribbon:"#c7b5ff",beanie:"#8be3e2",heart:"#ff758c",sparkle:"#fff0a8",planet:"#80dbe8"}[id];if(!p)return;
switch(id){
case"halo":pixel(p,[[-8,-24,16,2],[-10,-22,2,2],[8,-22,2,2]]);break;
case"scarf":pixel(p,[[-18,9,36,4],[-5,13,7,5],[2,13,5,3]]);break;
case"leaf":pixel(p,[[-10,-20,5,3],[-7,-23,6,3],[-4,-20,5,3],[0,-19,5,3],[4,-22,5,3],[8,-19,4,3]]);break;
case"sunglasses":pixel("#26324f",[[-11,-8,9,8],[2,-8,9,8],[-2,-6,4,2]]);pixel("#9ae7ff",[[-9,-6,5,2],[4,-6,5,2]]);break;
case"star":c.fillStyle=p;c.font="13px monospace";c.fillText("✦",x+16,y-20);break;
case"headphones":pixel(p,[[-17,-9,4,13],[13,-9,4,13],[-15,-14,3,4],[-12,-18,3,3],[-9,-20,18,3],[9,-18,3,3],[12,-14,3,4]]);break;
case"crystal":pixel(p,[[-6,-24,12,3],[-9,-21,18,5],[-5,-16,10,4]]);pixel("#fff7",[[-3,-20,3,5]]);break;
case"shell":pixel("#ffc3aa",[[-9,7,18,4],[-7,11,14,3],[-4,4,2,5],[0,2,2,7],[4,4,2,5]]);break;
case"ribbon":pixel(p,[[-18,-20,6,5],[-12,-17,4,3],[-5,-20,6,5],[-10,-17,7,4]]);break;
case"beanie":pixel(p,[[-10,-22,20,5],[-7,-26,14,4],[-2,-29,4,3]]);break;
case"heart":c.fillStyle=p;c.font="12px monospace";c.fillText("♥",x+15,y+12);break;
case"sparkle":c.fillStyle=p;c.font="12px monospace";c.fillText("✧",x-27,y-21);c.fillText("✦",x+19,y-22);break;
case"planet":c.strokeStyle=p;c.lineWidth=2;c.beginPath();c.ellipse(cx,cy,34,22,-.3,0,Math.PI*2);c.stroke();pixel("#ff9eaa",[[23,-5,4,4]]);break;
}
}
let raf=0;function anim(cv,sk,tier){cancelAnimationFrame(raf);let mood="neutral",reset=0;cv.setMood=value=>{mood=value;clearTimeout(reset);if(value!="neutral")reset=setTimeout(()=>mood="neutral",2600)};cv.onpointerenter=()=>{mood="surprised";clearTimeout(reset);reset=setTimeout(()=>mood="happy",850)};cv.onpointerleave=()=>{if(mood=="happy")mood="neutral"};cv.onclick=()=>cv.setMood("excited");const f=t=>{if(!cv.isConnected)return;cell(cv,sk,tier,t,mood);raf=requestAnimationFrame(f)};raf=requestAnimationFrame(f)}
