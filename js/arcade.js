"use strict";
/* ===== ARCADE MINI-GAME SELECTOR ===== */
function arcade(){
  stopLife();
  set(`${nav()}<h2>Arcade · เลือกมินิเกม</h2><p class="mu">เลือกกิจกรรมที่พบได้ระหว่างการเดินทาง หรือสุ่มเล่นภารกิจควบคุมโรค</p><section class="minigame-grid"><button class="minigame-card" id="miniFood"><canvas data-icon="arcade" width="80" height="80" aria-hidden="true"></canvas><b>เก็บอาหาร</b><span>ขยับหลบสิ่งกีดขวาง · 30 วินาที</span></button><button class="minigame-card" id="miniDots"><canvas data-icon="genes" width="80" height="80" aria-hidden="true"></canvas><b>กินจุด</b><span>เดินในเขาวงกตเก็บสารอาหาร</span></button><button class="minigame-card" id="miniBlocks"><canvas data-icon="achievements" width="80" height="80" aria-hidden="true"></canvas><b>ต่อบล็อก</b><span>สร้างไบโอฟิล์มและเคลียร์แถว</span></button><button class="minigame-card" id="miniRhythm"><canvas data-icon="journey" width="80" height="80" aria-hidden="true"></canvas><b>จังหวะเซลล์</b><span>กดเมื่อแถบเลื่อนอยู่ในโซนสีทอง</span></button><button class="minigame-card" id="miniOutbreak"><canvas data-icon="pathogens" width="80" height="80" aria-hidden="true"></canvas><b>ภารกิจโรคสุ่ม</b><span>สุ่ม COVID-19, Ebola, cholera หรือ plague</span></button></section><p class="box fi">SARS-CoV-2 และ Ebola virus เป็นไวรัส ส่วนอหิวาตกโรคเกิดจากแบคทีเรีย <i>Vibrio cholerae</i> และกาฬโรคเกิดจากแบคทีเรีย <i>Yersinia pestis</i> เกมแยกวงจรไวรัสออกจากระบบแบคทีเรีย</p>`);
  bindNav();
  A.querySelectorAll("canvas[data-icon]").forEach(cv=>drawPixelIcon(cv,cv.dataset.icon));
  on("miniFood",arcadeFood);
  on("miniDots",arcadeDots);
  on("miniBlocks",arcadeBlocks);
  on("miniRhythm",arcadeRhythm);
  on("miniOutbreak",arcadeRandomOutbreak);
}
function arcadeRandomOutbreak(){
  const p=PATHOGENS[Math.floor(rnd()*PATHOGENS.length)];
  outbreakGame(p);
}
function arcadeRhythm(){
  stopLife();
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>จังหวะเซลล์ · 30 วินาที</h2><p class="mu">กดปุ่มเมื่อแถบเลื่อนอยู่ใกล้โซนสีทอง ได้ 10 คะแนนต่อครั้ง พลาดได้แต่ไม่เสียคะแนน</p><section class="rhythm-game"><div class="challenge-track"><i id="rhythmMarker"></i><b></b></div><p class="c">เวลา <b id="rhythmTime">30</b> วินาที · คะแนน <b id="rhythmScore">0</b> · <span id="rhythmResult">กดเริ่มเพื่อเล่น</span></p><button class="pk big" id="rhythmHit" disabled>✦ กดจังหวะ!</button><button class="big" id="rhythmStart">▶ เริ่มเล่น</button></section>`);
  bindNav();
  on("arcadeMenu",arcade);
  const marker=document.getElementById("rhythmMarker"),time=document.getElementById("rhythmTime"),scoreText=document.getElementById("rhythmScore"),result=document.getElementById("rhythmResult"),hit=document.getElementById("rhythmHit"),start=document.getElementById("rhythmStart");
  let score=0,left=30,timer=0,frame=0,playing=false;
  const finish=()=>{playing=false;clearInterval(timer);cancelAnimationFrame(frame);hit.disabled=true;start.textContent="↻ เล่นอีกครั้ง";result.textContent="จบเกม · คะแนน "+score};
  const animate=()=>{if(!playing||!marker.isConnected)return;marker.style.left=mkPos()+"%";frame=requestAnimationFrame(animate)};
  on("rhythmStart",()=>{clearInterval(timer);cancelAnimationFrame(frame);score=0;left=30;playing=true;hit.disabled=false;start.disabled=true;result.textContent="กดตอนแถบอยู่ในโซน";scoreText.textContent=score;time.textContent=left;animate();timer=setInterval(()=>{left=Math.max(0,left-.1);time.textContent=Math.ceil(left);if(left<=0){start.disabled=false;finish()}},100)});
  on("rhythmHit",()=>{if(!playing)return;const ok=Math.abs(mkPos()-50)<14;if(ok){score+=10;result.textContent="ตรงจังหวะ! +10";beep(820,.05)}else{result.textContent="ยังไม่ตรง ลองใหม่";beep(180,.05)}scoreText.textContent=score});
}
function arcadeFood(){
  stopLife();const r=R0||roll(),sk=r.fict?"Om":r.virus?r.pathogenId:r.s,tr=r.tier>6?6:r.tier;
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>เกมเก็บอาหาร · 30 วินาที</h2><section class="arcade-layout"><canvas id="ar" width="360" height="420" aria-label="เกมเก็บอาหารและหลบสิ่งกีดขวาง"></canvas><div class="arcade-controls"><p class="c"><button id="al" aria-label="เลื่อนไปทางซ้าย" style="width:46%">◀</button><button id="aR" aria-label="เลื่อนไปทางขวา" style="width:46%">▶</button></p><button class="pk big" id="ag">▶ เล่นอีกรอบ</button><p class="mu">${r.virus?"เก็บเซลล์โฮสต์จำลองและหลบแรงกดดันภูมิคุ้มกัน":"เก็บอาหารสีเขียวเพื่อเพิ่มคะแนน หลบไวรัสฟาจสีม่วงและระวังยาสีส้ม"} · ใช้นิ้วลาก แตะปุ่ม หรือลูกศรบนแป้นพิมพ์ · เชื้อ: ${microbeName(r)} · คะแนนสูงสุด ${S.arc||0}</p><p class="mu">หมายเหตุ: ความเสียหายในเกมเป็นแบบจำลอง ไม่ใช่ผลทดสอบยาจริง</p></div></section>`);
  bindNav();on("arcadeMenu",arcade);on("ag",arcadeFood);
  const cv=document.getElementById("ar"),c=cv.getContext("2d"),sp=document.createElement("canvas");sp.width=128;sp.height=96;
  let x=180,dir=0,hp=100,sc=0,t0=null,lt=0,it=[],nx=0,end=false;
  const kd=e=>{if(e.key=="ArrowLeft"){dir=-1;e.preventDefault()}if(e.key=="ArrowRight"){dir=1;e.preventDefault()}},ku=e=>{if(e.key=="ArrowLeft"&&dir<0||e.key=="ArrowRight"&&dir>0)dir=0};
  addEventListener("keydown",kd);addEventListener("keyup",ku);
  cv.onpointermove=e=>{if(e.pointerType=="touch"&&e.buttons===0)return;const b=cv.getBoundingClientRect();x=Math.max(30,Math.min(330,(e.clientX-b.left)/b.width*360))};
  const hold=(id,d)=>{const b=document.getElementById(id);b.onpointerdown=e=>{e.preventDefault();dir=d;if(b.setPointerCapture)b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>dir=0};hold("al",-1);hold("aR",1);
  const f=ts=>{if(!cv.isConnected){removeEventListener("keydown",kd);removeEventListener("keyup",ku);return}
    if(t0==null){t0=ts;lt=ts}const dt=Math.min(.05,(ts-lt)/1000),el=(ts-t0)/1000;lt=ts;
    if(!end){x=Math.max(30,Math.min(330,x+dir*260*dt));nx-=dt;if(nx<=0){nx=.45+rnd()*.35;const q=rnd(),X=20+rnd()*320;it.push(r.virus?(q<.6?{k:"n",x:X,y:-10}:q<.82?{k:"h",x:X,y:-10}:{k:"i",x:X,y:-10}):q<.55?{k:"n",x:X,y:-10}:q<.85?{k:"d",d:Math.floor(rnd()*10),x:X,y:-10}:{k:"p",x:X,y:-10})}
      const v=90+el*3;it.forEach(o=>o.y+=v*dt);
      it=it.filter(o=>{if(o.y>350&&o.y<415&&Math.abs(o.x-x)<34){if(o.k=="n"){sc+=10;hp=Math.min(100,hp+2)}else if(o.k=="h"){sc+=15;hp=Math.min(100,hp+5)}else if(o.k=="p")hp-=15;else if(o.k=="i")hp-=12;else{const s=r.a[D10[o.d]];hp-=s=="S"?25:s=="I"?12:3;if(s=="R")sc+=5}beep(o.k=="n"||o.k=="h"?700:150,.05);return false}return o.y<440});
      if(hp<=0||el>=30){end=true;hp=Math.max(0,hp);sc+=Math.round(hp*2);S.mp+=Math.floor(sc/50);if(sc>(S.arc||0))S.arc=sc;save()}}
    c.fillStyle="#11182d";c.fillRect(0,0,360,420);
    it.forEach(o=>{if(o.k=="n"){c.fillStyle="#8adcb5";c.beginPath();c.arc(o.x,o.y,8,0,6.3);c.fill()}else if(o.k=="h"){c.fillStyle="#8be3e2";c.fillRect(o.x-10,o.y-7,20,14);c.fillStyle="#fff";c.fillRect(o.x-4,o.y-3,3,3);c.fillRect(o.x+3,o.y-3,3,3)}else if(o.k=="i"){c.fillStyle="#ffa88e";c.fillRect(o.x-8,o.y-8,16,16);c.fillStyle="#27324d";c.fillRect(o.x-2,o.y-5,4,10)}else if(o.k=="p"){c.fillStyle="#b99df5";c.fillRect(o.x-8,o.y-8,16,16);c.fillRect(o.x-2,o.y+8,4,10)}else{c.fillStyle="#e48895";c.fillRect(o.x-16,o.y-8,32,16);c.fillStyle="#fff";c.font="bold 11px sans-serif";c.textAlign="center";c.fillText(D10[o.d],o.x,o.y+4);c.textAlign="left"}});
    cell(sp,sk,tr,ts);c.imageSmoothingEnabled=false;c.drawImage(sp,x-48,340,96,72);
    c.fillStyle="#e8ecf5";c.font="bold 14px sans-serif";c.fillText("Score "+sc+"  Time "+Math.max(0,30-Math.floor(el)),8,20);c.fillStyle="#27324d";c.fillRect(8,28,120,8);c.fillStyle="#ffa88e";c.fillRect(8,28,1.2*hp,8);
    if(end){c.fillStyle="#000a";c.fillRect(0,0,360,420);c.fillStyle="#fff";c.textAlign="center";c.font="bold 20px sans-serif";c.fillText(hp<=0?"Integrity หมด":"หมดเวลา!",180,170);c.fillText("คะแนน "+sc+" · Best "+S.arc,180,205);c.textAlign="left"}
    requestAnimationFrame(f)};requestAnimationFrame(f)
}
function arcadeDots(){
  stopLife();const r=R0||roll(),sk=r.fict?"Om":r.virus?r.pathogenId:r.s,tr=Math.min(r.tier,6);
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>กินจุด · เขาวงกตสารอาหาร</h2><section class="arcade-layout"><canvas id="dotsBoard" width="360" height="408" aria-label="เขาวงกตพิกเซลสำหรับเก็บจุดสารอาหาร"></canvas><div class="arcade-controls"><div class="direction-pad"><button data-dir="up" aria-label="ขึ้น">▲</button><button data-dir="left" aria-label="ซ้าย">◀</button><button data-dir="down" aria-label="ลง">▼</button><button data-dir="right" aria-label="ขวา">▶</button></div><p class="mu">ใช้ลูกศรหรือปุ่มบนจอ เดินเก็บจุดสีเขียวให้ได้ 24 จุด · เชื้อ: ${microbeName(r)} · คะแนนสูงสุด ${S.arc||0}</p></div></section>`);
  bindNav();on("arcadeMenu",arcade);
  const cv=document.getElementById("dotsBoard"),c=cv.getContext("2d"),W=15,H=17,SZ=24,walls=new Set(),dots=new Set(),sp=document.createElement("canvas");sp.width=128;sp.height=96;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x==0||y==0||x==W-1||y==H-1)walls.add(y*W+x);else if((y%4==2&&x%4==2)||(y%4==2&&x%4==3)||(x%6==0&&y%4==0&&y>2))walls.add(y*W+x);else dots.add(y*W+x)}
  let px=1,py=1,dir={x:0,y:0},score=0,left=60,last=0,stamp=0,finished=false,timer=0,raf=0;
  dots.delete(py*W+px);
  const setDirection=name=>{dir=name=="left"?{x:-1,y:0}:name=="right"?{x:1,y:0}:name=="up"?{x:0,y:-1}:{x:0,y:1}};
  const kd=e=>{const key={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"left",d:"right",w:"up",s:"down"}[e.key];if(key){e.preventDefault();setDirection(key)}};
  addEventListener("keydown",kd);document.querySelectorAll("[data-dir]").forEach(b=>b.onclick=()=>setDirection(b.dataset.dir));
  const finish=()=>{if(finished)return;finished=true;removeEventListener("keydown",kd);S.mp+=Math.floor(score/20);if(score>S.arc)S.arc=score;save()};
  const frame=ts=>{if(!cv.isConnected){removeEventListener("keydown",kd);clearInterval(timer);cancelAnimationFrame(raf);return}if(!stamp)stamp=ts;const elapsed=(ts-stamp)/1000;
    if(!finished){left=Math.max(0,60-Math.floor(elapsed));if(ts-last>125){last=ts;const nx=px+dir.x,ny=py+dir.y,index=ny*W+nx;if(!walls.has(index)){px=nx;py=ny;if(dots.delete(index)){score+=10;beep(680,.025)}}if(score>=240)finish();if(left<=0)finish()}}
    c.fillStyle="#10182d";c.fillRect(0,0,cv.width,cv.height);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(walls.has(i)){c.fillStyle="#394668";c.fillRect(x*SZ,y*SZ,SZ,SZ);c.fillStyle="#52648e";c.fillRect(x*SZ+3,y*SZ+3,SZ-6,SZ-6)}else if(dots.has(i)){c.fillStyle="#8adcb5";c.fillRect(x*SZ+10,y*SZ+10,4,4)}}
    cell(sp,sk,tr,ts);c.imageSmoothingEnabled=false;c.drawImage(sp,px*SZ+2,py*SZ+2,SZ-4,SZ-4);c.fillStyle="#f2f4fa";c.font="bold 14px sans-serif";c.fillText("Score "+score+"   Time "+left,8,18);
    if(finished){c.fillStyle="#000b";c.fillRect(0,cv.height/2-40,cv.width,80);c.fillStyle="#fff";c.textAlign="center";c.font="bold 20px sans-serif";c.fillText(score>=240?"สำเร็จ!":"หมดเวลา · คะแนน "+score,cv.width/2,cv.height/2+6);c.textAlign="left"}raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);
}
function arcadeBlocks(){
  stopLife();const r=R0||roll(),sk=r.fict?"Om":r.virus?r.pathogenId:r.s,color=r.fict?"#ffd27f":r.virus?pathogenFor(r).accent:gramColor(SP[r.s].g);
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>ต่อบล็อก · สร้างไบโอฟิล์ม</h2><section class="arcade-layout"><canvas id="blockBoard" width="360" height="420" aria-label="เกมวางบล็อกพิกเซลเพื่อสร้างไบโอฟิล์ม"></canvas><div class="arcade-controls"><div class="block-controls"><button id="blockLeft" aria-label="เลื่อนไปซ้าย">◀</button><button id="blockRotate" aria-label="หมุนบล็อก">↻</button><button id="blockRight" aria-label="เลื่อนไปขวา">▶</button><button class="pk" id="blockDrop">▼ วางบล็อก</button></div><p class="mu">เติมแถวแนวนอนให้เต็มเพื่อเคลียร์บล็อก · เป้าหมาย 3 แถว หรือเล่นให้ได้นานที่สุด · เชื้อ: ${microbeName(r)}</p></div></section>`);
  bindNav();on("arcadeMenu",arcade);
  const cv=document.getElementById("blockBoard"),c=cv.getContext("2d"),W=8,H=10,SZ=32,ox=52,oy=42,board=Array.from({length:H},()=>Array(W).fill("")),timer=Date.now(),sp=document.createElement("canvas");sp.width=128;sp.height=96;
  let piece={x:3,y:0,v:false},lines=0,score=0,ended=false,lastDrop=0,raf=0;
  const shape=v=>v?[[0,0],[0,1]]:[[0,0],[1,0]];
  const can=(x,y,v)=>shape(v).every(([dx,dy])=>x+dx>=0&&x+dx<W&&y+dy<H&&(!board[y+dy]||!board[y+dy][x+dx]));
  const spawn=()=>{piece={x:3,y:0,v:false};if(!can(piece.x,piece.y,piece.v))finish()};
  const finish=()=>{if(ended)return;ended=true;removeEventListener("keydown",kd);S.mp+=Math.floor(score/40);if(score>S.arc)S.arc=score;save()};
  const lock=()=>{shape(piece.v).forEach(([dx,dy])=>board[piece.y+dy][piece.x+dx]=color);score+=2;for(let y=H-1;y>=0;y--)if(board[y].every(Boolean)){board.splice(y,1);board.unshift(Array(W).fill(""));lines++;score+=20;y++}if(lines>=3)finish();else spawn()};
  const move=(dx,dy)=>{if(ended)return;if(can(piece.x+dx,piece.y+dy,piece.v)){piece.x+=dx;piece.y+=dy}else if(dy>0)lock()};
  const kd=e=>{if(e.key=="ArrowLeft"){move(-1,0);e.preventDefault()}else if(e.key=="ArrowRight"){move(1,0);e.preventDefault()}else if(e.key=="ArrowDown"){move(0,1);e.preventDefault()}else if(e.key=="ArrowUp"){const v=!piece.v;if(can(piece.x,piece.y,v))piece.v=v;e.preventDefault()}else if(e.key==" "){e.preventDefault();while(can(piece.x,piece.y+1,piece.v))piece.y++;lock()}};
  addEventListener("keydown",kd);on("blockLeft",()=>move(-1,0));on("blockRight",()=>move(1,0));on("blockRotate",()=>{const v=!piece.v;if(can(piece.x,piece.y,v))piece.v=v});on("blockDrop",()=>{while(can(piece.x,piece.y+1,piece.v))piece.y++;lock()});
  const draw=ts=>{if(!cv.isConnected){removeEventListener("keydown",kd);cancelAnimationFrame(raf);return}if(!ended&&Date.now()-timer>45000)finish();if(!ended&&ts-lastDrop>420){lastDrop=ts;move(0,1)}
    c.fillStyle="#10182d";c.fillRect(0,0,cv.width,cv.height);c.fillStyle="#26324f";c.fillRect(ox-3,oy-3,W*SZ+6,H*SZ+6);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const colorAt=board[y][x];if(colorAt){c.fillStyle=colorAt;c.fillRect(ox+x*SZ+2,oy+y*SZ+2,SZ-4,SZ-4);c.fillStyle="#ffffff55";c.fillRect(ox+x*SZ+5,oy+y*SZ+5,SZ-10,3)}}
    shape(piece.v).forEach(([dx,dy])=>{c.fillStyle=color;c.fillRect(ox+(piece.x+dx)*SZ+2,oy+(piece.y+dy)*SZ+2,SZ-4,SZ-4);c.fillStyle="#fff8";c.fillRect(ox+(piece.x+dx)*SZ+5,oy+(piece.y+dy)*SZ+5,SZ-10,3)});
    c.fillStyle="#f2f4fa";c.font="bold 14px sans-serif";c.fillText("แถว "+lines+"/3   คะแนน "+score,14,20);cell(sp,sk,Math.min(r.tier,6),ts);c.imageSmoothingEnabled=false;c.drawImage(sp,295,4,52,39);
    if(ended){c.fillStyle="#000b";c.fillRect(0,cv.height/2-38,cv.width,76);c.fillStyle="#fff";c.textAlign="center";c.font="bold 19px sans-serif";c.fillText(lines>=3?"สร้างไบโอฟิล์มสำเร็จ!":"จบเกม · คะแนน "+score,cv.width/2,cv.height/2+6);c.textAlign="left"}raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw);
}
