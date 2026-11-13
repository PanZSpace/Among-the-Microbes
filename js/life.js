"use strict";
/* ===== LIFE ===== */
let L=null,tm=0,zr=0;
const STG=["ช่วง 1: ปรับตัว","ช่วง 2: เติบโต","ช่วง 3: เตรียมแบ่งตัว","ช่วง 4: แบ่งตัว"];
function stopLife(){clearInterval(tm);cancelAnimationFrame(zr);L=null}
function startLife(r,gen,fresh,fit){stopLife();const h=H[r.h];
L={r,gen,t:0,sp:1,pause:false,modal:false,res:r.virus?{host:100,load:0,immune:12,stability:100}:{en:60,nu:50,bio:10,int:100,st:10,dna:5},fit:fit||Math.max(.5,1-.04*(r.on||[]).length),aer:true,bf:false,pers:0,cd:{},auto:false,next:9+rnd()*5,cause:"",log:[],vStage:0,released:false,stats:{events:0,actions:0}};
render();tm=setInterval(tick,200);zrLoop()}
function recordLife(text,type="action"){if(!L)return;L.log.unshift({t:Math.floor(L.t),text,type});L.log=L.log.slice(0,40);if(type=="action")L.stats.actions++}
const stg=()=>Math.min(3,Math.floor(L.t/20));
function render(){const h=H[L.r.h],R=L.res;
const fict=L.r.fict,virus=!!L.r.virus,p=pathogenFor(L.r),nm=microbeName(L.r),stage=virus?["เกาะเซลล์โฮสต์","เพิ่มจำนวน","ปล่อยอนุภาค"][Math.min(2,L.vStage)]:STG[stg()];
set(`${nav()}<section class="life-layout biome-${h[0]}"><div class="life-creature"><canvas id="cv" width="128" height="96"></canvas><div class="emote-picker" aria-label="เลือกอารมณ์จุลชีพ">${[["happy","ดีใจ"],["sad","เศร้า"],["shy","เขิน"],["angry","โกรธ"],["sly","เจ้าเล่ห์"],["excited","ตื่นเต้น"],["worried","กังวล"],["dying","ใกล้หมดพลัง"]].map(([m,n])=>`<button type="button" data-mood="${m}" aria-label="แสดงอารมณ์${n}" title="${n}">${{happy:"☺",sad:"☹",shy:"♡",angry:"!",sly:"¬",excited:"✦",worried:"?",dying:"×"}[m]}</button>`).join("")}</div><p class="c"><b>${virus?"วงจรโฮสต์":"รุ่นที่ "+L.gen}</b> · <i>${nm}</i> · ${h[1]}<br><span class="px" style="font-size:9px;color:var(--cy)">${stage}</span></p><p class="environment-note">${virus?`🧬 ${p.name} เป็นไวรัส: ใช้แบบจำลองการเกาะเซลล์โฮสต์ เพิ่มจำนวน และแพร่ต่อ ไม่ใช้ระบบ ATP หรือยาปฏิชีวนะ`:`🌿 ${T("สภาพแวดล้อมจำลอง","Simulated habitat")}: ${h[1]} · ${T("ออกซิเจน","Oxygen")} ${h[6]?T("มาก","high"):T("น้อย","low")} · ${T("อาหาร","Nutrients")} ${Math.round(h[5]*100)}%`}</p></div>
<div class="life-controls"><div class="hud" id="hud"></div>${virus?"":`<div class="zone" id="zn"><b></b><i id="mk"></i></div>`}
<div class="act" id="acts"></div>
<section class="life-journal"><div class="journal-tabs"><button id="lifeStats" class="selected">📊 สถิติรอบนี้</button><button id="lifeHistory">📜 ประวัติเหตุการณ์</button></div><div id="journalPanel" class="journal-panel"></div></section>
<p><button id="pz">${L.pause?"▶ เล่นต่อ":"⏸ พักเกม"}</button><button id="sp">ความเร็วเกม ${L.sp}×</button><button id="au">ให้เกมช่วยเล่น: ${L.auto?"เปิด":"ปิด"}</button></p>
<p class="mu" id="eq">${virus?`วงจรจำลอง ${Math.floor(L.t)}/80 · ยังไม่พบการเพิ่มจำนวน`: `เวลาในเกม ${Math.floor(L.t)}/80 · ตัวคูณการเติบโตในเกม ${(L.fit*100).toFixed(0)}% · เวลาผ่านไปตามแบบจำลองประมาณ ${Math.round(L.t/80*(fict?0:1)*[40,40,60,50,120,60,45,60,70,60][L.r.h])} นาที`}</p></div></section>`);
bindNav();anim(document.getElementById("cv"),L.r.fict?"Om":virus?L.r.pathogenId:L.r.s,L.r.tier>6?6:L.r.tier);A.querySelectorAll("[data-mood]").forEach(b=>b.onclick=()=>document.getElementById("cv").setMood(b.dataset.mood));
on("pz",()=>{L.pause=!L.pause;document.getElementById("pz").textContent=L.pause?"▶ เล่นต่อ":"⏸ พักเกม"});
on("sp",()=>{L.sp=L.sp==1?2:L.sp==2?4:1;document.getElementById("sp").textContent="ความเร็วเกม "+L.sp+"×"});
on("au",()=>{L.auto=!L.auto;document.getElementById("au").textContent="ให้เกมช่วยเล่น: "+(L.auto?"เปิด":"ปิด")});
hud();acts();renderJournal();on("lifeStats",()=>showJournal("stats"));on("lifeHistory",()=>showJournal("history"));const cv=document.getElementById("cv");if(cv.setMood)cv.setMood("happy")}
function showJournal(tab){if(!L)return;document.querySelectorAll(".journal-tabs button").forEach(b=>b.classList.toggle("selected",b.id==(tab=="stats"?"lifeStats":"lifeHistory")));const panel=document.getElementById("journalPanel");if(!panel)return;if(tab=="stats"){const r=L.res;panel.innerHTML=L.r.virus?`<div class="stat-chips"><span>⏱ ${Math.floor(L.t)}/80</span><span>🧫 เซลล์โฮสต์ ${Math.round(r.host)}</span><span>🧬 อนุภาคจำลอง ${Math.round(r.load)}</span><span>🛡 ภูมิคุ้มกัน ${Math.round(r.immune)}</span><span>⚠ ${L.stats.events} อีเวนต์</span><span>✦ ${L.stats.actions} กิจกรรม</span></div><p class="mu"><i>${microbeName(L.r)}</i> · แบบจำลองวงจรโฮสต์เพื่อการเรียนรู้ ไม่มี ATP หรือยาปฏิชีวนะ</p>`:`<div class="stat-chips"><span>⏱ ${Math.floor(L.t)}/80</span><span>⚡ ${Math.round(r.en)} ATP</span><span>🧫 ${Math.round(r.bio)} มวลเซลล์</span><span>⚠ ${L.stats.events} อีเวนต์</span><span>✦ ${L.stats.actions} กิจกรรม</span></div><p class="mu">แหล่งอาศัย: ${H[L.r.h][1]} · สายพันธุ์: <i>${microbeName(L.r)}</i> · รุ่น ${L.gen}</p>`;return}panel.innerHTML=L.log.length?`<ol class="timeline">${L.log.map(x=>`<li class="timeline-${x.type}"><time>${String(Math.floor(x.t/60)).padStart(2,"0")}:${String(x.t%60).padStart(2,"0")}</time><span>${x.text}</span></li>`).join("")}</ol>`:`<p class="mu">ยังไม่มีเหตุการณ์ — บันทึกจะปรากฏที่นี่ระหว่างการเล่น</p>`}
function renderJournal(){showJournal("stats")}
function hud(){if(!L)return;const R=L.res,b=(k,n,c)=>`<div>${n} ${Math.round(R[k])}<div class="bar"><i style="width:${R[k]}%;background:${c}"></i></div></div>`;
const x=document.getElementById("hud");if(x)x.innerHTML=L.r.virus?b("host","เซลล์โฮสต์","#8adcb5")+b("load","อนุภาคไวรัสจำลอง","#80dbe8")+b("immune","แรงกดดันภูมิคุ้มกัน","#ffa88e")+b("stability","ความเสถียร","#b99df5"):b("en","พลังงาน (ATP)","#ffd27f")+b("nu","อาหาร","#8adcb5")+b("bio","มวลเซลล์","#80dbe8")+b("int","ความสมบูรณ์","#b99df5")+b("st","ความเครียด","#ffa88e")+b("dna","DNA เสียหาย","#c7b5ff")}
const ACTS=[["chemo","ว่ายไปหาอาหาร","+อาหาร 14 · −พลังงาน 4",r=>{r.nu+=14;r.en-=4}],["stress","ลดความเครียด","−ความเครียด 22 · −พลังงาน 8",r=>{r.st-=22;r.en-=8}],["bios","สร้างมวลเซลล์","+มวลเซลล์ 8 · −พลังงาน 12 · −อาหาร 6",r=>{r.bio+=8;r.en-=12;r.nu-=6}],["sos","ซ่อมแซม DNA","−DNA เสียหาย 25 · −พลังงาน 8 (เป็นผลจำลอง)",r=>{r.dna-=25;r.en-=8}],["aer","เปลี่ยนวิธีสร้างพลังงาน","ตอนนี้: ใช้ออกซิเจน (ได้พลังงานมากเมื่อมีออกซิเจน)"],["biof","สร้างเกราะเมือก (ไบโอฟิล์ม)","−พลังงาน 12 · ช่วยทนต่อสิ่งรบกวน แต่โตช้าลง"],["pers","เข้าสู่ภาวะพักชั่วคราว","ทนต่อยาในเกมประมาณ 8 วินาที แต่หยุดเติบโต"],["beat","กดจังหวะ ✦","กดตอนเส้นอยู่ในแถบสีเขียว"]];
function acts(){const x=document.getElementById("acts");if(!x||!L)return;if(L.r.virus){const options=[["bind","เกาะเซลล์โฮสต์",L.vStage?"เชื่อมต่อแล้ว":"ใช้เซลล์ที่ไวต่อการติดเชื้อในแบบจำลอง"],["replicate","เพิ่มจำนวนในโฮสต์","เพิ่มอนุภาคจำลอง · ใช้ทรัพยากรโฮสต์"],["evade","รับมือแรงกดดันภูมิคุ้มกัน","ลดแรงกดดันชั่วคราว · ความยากง่ายในเกม"],["assemble","ประกอบอนุภาค","ต้องมีอนุภาคจำลองอย่างน้อย 20"],["release","ปล่อยอนุภาคไปยังโฮสต์ใหม่","เป้าหมาย: สะสมอนุภาคจำลอง 75"]];x.innerHTML=options.map(([k,n,t])=>`<button data-k="${k}" ${L.cd[k]>L.t||k=="bind"&&L.vStage||k=="replicate"&&!L.vStage||k=="assemble"&&(L.res.load<20||!L.vStage)||k=="release"&&L.res.load<75?"disabled":""}>${n}<small>${t}</small></button>`).join("");x.querySelectorAll("button").forEach(button=>button.onclick=()=>act(button.dataset.k));return}x.innerHTML=ACTS.map(a=>{let t=a[2];if(a[0]=="aer")t=L.aer?"ตอนนี้ใช้ออกซิเจนสร้างพลังงาน → เปลี่ยนเป็นไม่ใช้ออกซิเจน":"ตอนนี้ไม่ใช้ออกซิเจนสร้างพลังงาน → เปลี่ยนเป็นใช้ออกซิเจน";if(a[0]=="biof")t=L.bf?"เปิดเกราะเมือกอยู่ (แตะเพื่อปิด)":a[2];return`<button data-k="${a[0]}" ${L.cd[a[0]]>L.t?"disabled":""}>${a[1]}<small>${t}</small></button>`}).join("");
x.querySelectorAll("button").forEach(b=>b.onclick=()=>act(b.dataset.k))}
function act(k){if(!L||L.pause||L.modal)return;if(L.r.virus)return virusAct(k);const R=L.res;beep(520,.05);recordLife("ทำกิจกรรม: "+(ACTS.find(a=>a[0]==k)||[])[1]);const cv=document.getElementById("cv");if(cv&&cv.setMood)cv.setMood("happy");
if(k=="aer")L.aer=!L.aer;else if(k=="biof"){if(!L.bf)R.en-=12;L.bf=!L.bf}else if(k=="pers"){L.pers=8;R.en-=4}
else if(k=="beat"){const p=mkPos(),ok=Math.abs(p-50)<12,s=stg();if(ok){beep(880,.08);if(s==2)R.dna-=12;else if(s==3){R.bio+=8;R.int+=6}else R.st-=3}else{R.dna+=8;beep(150,.1)}L.cd.beat=L.t+.7}
else{ACTS.find(a=>a[0]==k)[3](R);L.cd[k]=L.t+2.2}
for(const q in R)R[q]=cl(R[q]);hud();acts()}
const mkPos=()=>(Math.sin(Date.now()/380)+1)*50;
function virusAct(k){const R=L.res,cv=document.getElementById("cv");beep(520,.05);recordLife("วงจรโฮสต์: "+({bind:"เกาะเซลล์โฮสต์",replicate:"เพิ่มจำนวน",evade:"รับมือภูมิคุ้มกัน",assemble:"ประกอบอนุภาค",release:"ปล่อยอนุภาค"}[k]||k));if(cv&&cv.setMood)cv.setMood(k=="release"?"excited":"happy");
if(k=="bind"){L.vStage=1;R.host=cl(R.host-5);L.cd.bind=L.t+2}
else if(k=="replicate"&&L.vStage){R.host=cl(R.host-14);R.load=cl(R.load+28);R.immune=cl(R.immune+5);L.cd.replicate=L.t+3}
else if(k=="evade"){R.immune=cl(R.immune-22);R.stability=cl(R.stability-4);L.cd.evade=L.t+5}
else if(k=="assemble"&&R.load>=20){R.host=cl(R.host-10);R.load=cl(R.load+24);R.immune=cl(R.immune+7);L.vStage=2;L.cd.assemble=L.t+4}
else if(k=="release"&&R.load>=75){L.released=true;R.host=cl(R.host-5);recordLife("ปล่อยอนุภาคจำลองไปยังโฮสต์ใหม่","event");endLife();return}
hud();acts();renderJournal()}
function zrLoop(){const f=()=>{const m=document.getElementById("mk");if(!m||!L)return;m.style.left=mkPos()+"%";zr=requestAnimationFrame(f)};zr=requestAnimationFrame(f)}
function tick(){if(!L||L.pause||L.modal)return;if(L.r.virus)return tickVirus();const dt=.2*L.sp*.44,R=L.res,h=H[L.r.h];L.t+=dt;if(L.pers>0)L.pers-=dt;
if(L.t>=80)return endLife();
const pe=L.pers>0,g=pe?0:L.fit*(L.bf?.7:1)*(stg()==1?1.3:1);
R.nu+=(h[5]*3-1.2*(pe?.2:1))*dt;
const gain=R.nu>8?(L.aer?(h[6]?2.2:.8):1.2):0;R.en+=(gain*(pe?.3:1)-1.1*(pe?.4:1))*dt;
if(R.en>15&&R.nu>8)R.bio+=1.15*g*dt;
R.st+=(h[8]-.35)*dt*(L.bf?.6:1);R.dna+=(stg()==2?.5:.05)*dt;
if(R.st>60){R.int-=(R.st-60)*.03*dt;L.cause=L.cause||"ความเครียดสะสมจากสภาพแวดล้อม"}
if(R.dna>70)R.int-=.3*dt;if(R.en<=0){R.int-=1.2*dt;L.cause="พลังงานหมด (เซลล์ขาดพลังงาน)"}
for(const q in R)R[q]=cl(R[q]);
if(R.int<25){if(!L.nearDeathAt||Date.now()-L.nearDeathAt>2500){const cv=document.getElementById("cv");if(cv&&cv.setMood)cv.setMood("dying");L.nearDeathAt=Date.now()}}else L.nearDeathAt=0;
if(L.auto){if(R.st>55&&!(L.cd.stress>L.t))act("stress");else if(R.nu<30&&!(L.cd.chemo>L.t))act("chemo");else if(R.dna>50&&!(L.cd.sos>L.t))act("sos");else if(R.en>40&&R.nu>20&&!(L.cd.bios>L.t)&&stg()<3)act("bios")}
if(R.int<=0)return endLife();
if(L.t>=L.next){L.next=L.t+5+rnd()*5;event()}
hud();const q=document.getElementById("eq");if(q)q.firstChild.textContent="เวลาในเกม "+Math.floor(L.t)+"/80 · ตัวคูณการเติบโตในเกม "+(L.fit*100).toFixed(0)+"% · ";
const lbl=document.querySelector(".px[style*=cyan]");if(lbl)lbl.textContent=STG[stg()];if(L.t%1<dt)acts()}
function tickVirus(){const dt=.2*L.sp*.44,R=L.res;L.t+=dt;R.host=cl(R.host-.035*dt);R.immune=cl(R.immune+.11*dt);R.stability=cl(R.stability-.025*dt);
if(L.auto){if(!L.vStage&&!(L.cd.bind>L.t))virusAct("bind");else if(R.load<20&&!(L.cd.replicate>L.t))virusAct("replicate");else if(R.load<75&&!(L.cd.assemble>L.t))virusAct(R.load<20?"replicate":"assemble");else if(!(L.cd.release>L.t))virusAct("release")}if(!L)return;
if(R.immune>=100||R.host<=0||R.stability<=0||L.t>=80)return endLife();
if(L.t>=L.next){L.next=L.t+7+rnd()*6;event()}
hud();const q=document.getElementById("eq");if(q)q.textContent=`วงจรจำลอง ${Math.floor(L.t)}/80 · ${L.released?"แพร่ต่อสำเร็จ":"อนุภาคจำลอง "+Math.round(R.load)+"/75"}`;
const lbl=document.querySelector(".px[style*=cyan]");if(lbl)lbl.textContent=["เกาะเซลล์โฮสต์","เพิ่มจำนวน","ปล่อยอนุภาค"][Math.min(2,L.vStage)];if(L.t%1<dt)acts()}
