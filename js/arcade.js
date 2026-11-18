"use strict";
/* ===== ARCADE MINI-GAME SELECTOR ===== */
function arcade(){
  stopLife();
  set(`${nav()}<h2>Arcade · เลือกมินิเกม</h2><p class="mu">เลือกกิจกรรมที่พบได้ระหว่างการเดินทาง หรือสุ่มเล่นภารกิจควบคุมโรค</p><section class="minigame-grid"><button class="minigame-card" id="miniFood"><canvas data-icon="arcade" width="80" height="80" aria-hidden="true"></canvas><b>เก็บอาหาร</b><span>ขยับหลบสิ่งกีดขวาง · 30 วินาที</span></button><button class="minigame-card" id="miniDots"><canvas data-icon="genes" width="80" height="80" aria-hidden="true"></canvas><b>กินจุด</b><span>เดินในเขาวงกตเก็บสารอาหาร</span></button><button class="minigame-card" id="miniBlocks"><canvas data-icon="achievements" width="80" height="80" aria-hidden="true"></canvas><b>ต่อบล็อก</b><span>สร้างไบโอฟิล์มและเคลียร์แถว</span></button><button class="minigame-card" id="miniRhythm"><canvas data-icon="journey" width="80" height="80" aria-hidden="true"></canvas><b>จังหวะเซลล์</b><span>กดเมื่อแถบเลื่อนอยู่ในโซนสีทอง</span></button><button class="minigame-card" id="miniOutbreak"><canvas data-icon="pathogens" width="80" height="80" aria-hidden="true"></canvas><b>ภารกิจโรคสุ่ม</b><span>สุ่ม COVID-19, Ebola, cholera หรือ plague</span></button><button class="minigame-card" id="miniPattern"><canvas data-icon="genes" width="80" height="80" aria-hidden="true"></canvas><b>จำลำดับสัญญาณ</b><span>กด 4 ปุ่มให้ตรงแพทเทิลที่โชว์</span></button><button class="minigame-card" id="miniWords"><canvas data-icon="guide" width="80" height="80" aria-hidden="true"></canvas><b>เรียงคำศัพท์</b><span>แตะคำให้เป็นประโยคความรู้</span></button><button class="minigame-card" id="miniQuiz"><canvas data-icon="chronicles" width="80" height="80" aria-hidden="true"></canvas><b>ควิซง่าย ๆ</b><span>ตอบตัวเลือก พร้อมเกร็ดความรู้</span></button><button class="minigame-card" id="miniRunner"><canvas data-icon="journey" width="80" height="80" aria-hidden="true"></canvas><b>เชื้อวิ่งกระโดด</b><span>วิ่งหลบสิ่งกีดขวางแบบเกมออฟไลน์</span></button></section><p class="box fi">SARS-CoV-2 และ Ebola virus เป็นไวรัส ส่วนอหิวาตกโรคเกิดจากแบคทีเรีย <i>Vibrio cholerae</i> และกาฬโรคเกิดจากแบคทีเรีย <i>Yersinia pestis</i> เกมแยกวงจรไวรัสออกจากระบบแบคทีเรีย</p>`);
  bindNav();
  A.querySelectorAll("canvas[data-icon]").forEach(cv=>drawPixelIcon(cv,cv.dataset.icon));
  on("miniFood",()=>arcadeIntro("เก็บอาหาร",["ขยับซ้าย–ขวาเพื่อเก็บอาหารสีเขียว","หลบสิ่งกีดขวางจนหมดเวลา 30 วินาที"],arcadeFood));
  on("miniDots",()=>arcadeIntro("กินจุด",["ใช้ลูกศรหรือปุ่มบนจอเดินในเขาวงกต","เก็บจุดสีเขียวให้ได้ 24 จุดก่อนหมดเวลา"],arcadeDots));
  on("miniBlocks",()=>arcadeIntro("ต่อบล็อก",["เลื่อนและหมุนบล็อกให้เติมแถวแนวนอน","เคลียร์ให้ครบ 3 แถว หรือเล่นให้นานที่สุด"],arcadeBlocks));
  on("miniRhythm",()=>arcadeIntro("จังหวะเซลล์",["กดเมื่อแถบเลื่อนอยู่ในพื้นที่สีทอง","เล่น 30 วินาที พลาดได้โดยไม่เสียคะแนน"],arcadeRhythm));
  on("miniOutbreak",()=>arcadeIntro("ภารกิจโรคสุ่ม",["จัดการทรัพยากรและรับมือสถานการณ์จำลอง","โรคที่พบจะถูกสุ่มเมื่อเริ่มภารกิจ"],arcadeRandomOutbreak));
  on("miniPattern",()=>arcadeIntro("จำลำดับสัญญาณ",["ดูปุ่มที่สว่างแล้วกดตามลำดับ","เล่นด้วยการแตะหรือกดปุ่ม 1–4"],arcadePattern));
  on("miniWords",()=>arcadeIntro("เรียงคำศัพท์",["แตะคำด้านล่างเพื่อเรียงเป็นประโยค","แตะคำในช่องด้านบนเพื่อนำออกและจัดใหม่"],arcadeWords));
  on("miniQuiz",()=>arcadeIntro("ควิซง่าย ๆ",["เลือกคำตอบที่คิดว่าถูกที่สุด","อ่านเกร็ดสั้น ๆ หลังตอบแต่ละข้อ"],arcadeQuiz));
  on("miniRunner",()=>arcadeIntro("เชื้อวิ่งกระโดด",["กด Space, ↑ หรือ W เพื่อกระโดดหลบ","แตะจอหรือปุ่มบนหน้าจอก็ได้"],arcadeRunner));
}
function arcadeIntro(title,instructions,launch){const o=modal(`<div class="hd"><span>วิธีเล่น · ${title}</span><button id="introClose" aria-label="ปิด">×</button></div><div class="bd arcade-intro"><h3>${title}</h3><ul>${instructions.map(step=>`<li>${step}</li>`).join("")}</ul><button class="pk big" id="introStart">เข้าใจแล้ว · เริ่มเกม</button></div>`);o.querySelector("#introClose").onclick=o.close;o.querySelector("#introStart").onclick=()=>{o.close();launch()}}
function arcadeRandomOutbreak(){
  const p=PATHOGENS[Math.floor(rnd()*PATHOGENS.length)];
  outbreakGame(p);
}
function arcadeReward(score){
  score=Math.max(0,Math.floor(score||0));
  S.mp+=Math.floor(score/50);
  if(score>(S.arc||0))S.arc=score;
  save();
}
const ARCADE_SHUFFLE=a=>{const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
const PATTERN_PADS=[
  {icon:"🦠",label:"เชื้อ",color:"#8adcb5",freq:520},
  {icon:"🧬",label:"ยีน",color:"#8be3e2",freq:620},
  {icon:"💊",label:"ยา",color:"#ffe09a",freq:760},
  {icon:"🛡️",label:"ภูมิ",color:"#c7b5ff",freq:900}
];
function arcadePattern(){
  stopLife();
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>จำลำดับสัญญาณ</h2><p class="mu">ดูไฟกระพริบแล้วกดให้ตรงลำดับ 8 ขั้นถือว่าสำเร็จ · พลาดได้ 3 ครั้ง · ใช้เมาส์ แตะ หรือกด 1–4</p><section class="pattern-game" id="patternWrap"><p class="c">ขั้น <b id="patLevel">0</b>/8 · คะแนน <b id="patScore">0</b> · โอกาส <b id="patLives">♥♥♥</b></p><p class="c pat-status" id="patStatus" role="status" aria-live="polite">กดเริ่มเพื่อดูแพทเทิล</p><div class="pattern-pad">${PATTERN_PADS.map((p,i)=>`<button class="pat-pad" data-pad="${i}" style="--pad:${p.color}" aria-label="${p.label}" disabled><span>${p.icon}</span><small>${p.label}</small></button>`).join("")}</div><button class="pk big" id="patStart">▶ เริ่มเล่น</button><p class="box fi">สัญญาณในเกมนี้ใช้ฝึกความจำเท่านั้น ไม่ได้จำลองระบบส่งสัญญาณของเซลล์จริง</p></section>`);
  bindNav();on("arcadeMenu",arcade);
  const host=document.getElementById("patternWrap"),levelEl=document.getElementById("patLevel"),scoreEl=document.getElementById("patScore"),livesEl=document.getElementById("patLives"),statusEl=document.getElementById("patStatus"),startBtn=document.getElementById("patStart"),pads=[...host.querySelectorAll("[data-pad]")];
  let seq=[],step=0,lives=3,score=0,level=0,playing=false,busy=false,timers=[],guard=0,rewarded=false;
  const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const clearTimers=()=>{timers.forEach(clearTimeout);timers=[]};
  const sync=()=>{levelEl.textContent=level;scoreEl.textContent=score;livesEl.textContent="♥".repeat(lives)+"♡".repeat(Math.max(0,3-lives))};
  const enable=value=>pads.forEach(p=>p.disabled=!(value&&playing));
  const show=()=>{
    busy=true;enable(false);statusEl.textContent="จำลำดับให้ดี…";
    let at=0;
    seq.forEach(i=>{
      later(()=>{pads.forEach(p=>p.classList.remove("lit"));pads[i].classList.add("lit");beep(PATTERN_PADS[i].freq,.09);later(()=>pads[i].classList.remove("lit"),420)},at);
      at+=620;
    });
    later(()=>{busy=false;enable(true);statusEl.textContent="ทำตามลำดับได้เลย · กด "+seq.length+" ครั้ง"},at+220);
  };
  const kd=e=>{const i=["1","2","3","4"].indexOf(e.key);if(i>=0){e.preventDefault();pads[i].click()}};
  const finish=win=>{
    if(rewarded)return;rewarded=true;playing=false;busy=true;clearTimers();clearInterval(guard);removeEventListener("keydown",kd);
    pads.forEach(p=>{p.classList.remove("lit","wrong");p.disabled=true});
    startBtn.disabled=false;startBtn.textContent="↻ เล่นอีกครั้ง";
    statusEl.textContent=win?"สำเร็จ! จำครบ 8 ขั้นแล้ว":"จบเกม · ไปได้ "+level+" ขั้น";
    sync();arcadeReward(score);
  };
  addEventListener("keydown",kd);
  startBtn.onclick=()=>{
    clearTimers();seq=[];step=0;lives=3;score=0;level=0;playing=true;busy=false;rewarded=false;
    startBtn.disabled=true;startBtn.textContent="กำลังเล่น…";sync();
    level++;seq.push(Math.floor(rnd()*4));step=0;sync();show();
  };
  pads.forEach((p,i)=>p.onclick=()=>{
    if(!playing||busy)return;
    if(i===seq[step]){
      p.classList.add("lit");beep(PATTERN_PADS[i].freq,.07);later(()=>p.classList.remove("lit"),160);
      step++;
      if(step===seq.length){
        const gain=level*10;score+=gain;sync();statusEl.textContent="ถูกต้อง! +"+gain;busy=true;enable(false);
        if(level>=8)later(()=>finish(true),600);
        else later(()=>{level++;seq.push(Math.floor(rnd()*4));step=0;sync();show()},650);
      }
    }else{
      p.classList.add("wrong");later(()=>p.classList.remove("wrong"),350);beep(150,.16);
      lives--;sync();busy=true;enable(false);
      if(lives<=0)later(()=>finish(false),450);
      else{statusEl.textContent="ผิดแล้ว เหลือ "+lives+" โอกาส · แสดงลำดับอีกครั้ง";later(show,850)}
    }
  });
  guard=setInterval(()=>{if(!host.isConnected){clearTimers();clearInterval(guard);removeEventListener("keydown",kd)}},300);
}
const WORD_ROUNDS=[
  {words:["แบคทีเรีย","บางชนิด","สร้าง","ไบโอฟิล์ม","เพื่อ","เกาะกลุ่ม"],f:"ไบโอฟิล์มคือชุมชนเซลล์ที่เกาะผิวและหุ้มตัวเองด้วยเมือก ช่วยให้เซลล์บางส่วนทนต่อความเครียดได้มากขึ้น"},
  {words:["ไวรัส","ต้องอาศัย","เซลล์โฮสต์","ในการ","เพิ่มจำนวน"],f:"ไวรัสไม่ได้สร้างพลังงานและส่วนประกอบเองครบถ้วน จึงต้องใช้กลไกของเซลล์โฮสต์"},
  {words:["การกลายพันธุ์","เกิด","แบบสุ่ม","ไม่ใช่","เพราะ","เชื้อ","ต้องการ"],f:"การกลายพันธุ์เกิดจากความผิดพลาดหรือความเสียหายของกรดนิวคลีอิกแบบสุ่ม ยาอาจคัดเลือกเชื้อที่อยู่รอดได้มากกว่า"},
  {words:["ยาปฏิชีวนะ","ออกฤทธิ์กับ","แบคทีเรีย","ไม่ใช่","ไวรัส"],f:"ยาปฏิชีวนะออกฤทธิ์กับโครงสร้างหรือกระบวนการของแบคทีเรีย ไม่ได้ฆ่าไวรัส และต้องใช้ตามข้อบ่งชี้"},
  {words:["การล้างมือ","ช่วย","ลด","การแพร่กระจาย","ของเชื้อ","ได้"],f:"การล้างมือด้วยวิธีที่เหมาะสมช่วยลดจำนวนเชื้อบนมือและลดการแพร่กระจายได้"}
];
function arcadeWords(){
  stopLife();
  const rounds=ARCADE_SHUFFLE(WORD_ROUNDS).slice(0,4);
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>เรียงคำศัพท์</h2><p class="mu">แตะคำในแถวล่างเพื่อเรียงเป็นประโยค แล้วแตะคำในช่องบนเพื่อนำออก · 4 ประโยค</p><section class="word-game"><p class="c">ประโยค <b id="wordRound">1/4</b> · คะแนน <b id="wordScore">0</b></p><p class="c" id="wordStatus" role="status" aria-live="polite">เรียงคำให้เป็นประโยคที่ถูกต้อง</p><div class="word-slots" id="wordSlots" aria-label="ช่องสำหรับเรียงคำ"></div><div class="word-bank" id="wordBank" aria-label="คำที่เลือกได้"></div><div class="box fi" id="wordFact" hidden></div><button class="pk big" id="wordNext" disabled>ประโยคต่อไป →</button></section>`);
  bindNav();on("arcadeMenu",arcade);
  const roundEl=document.getElementById("wordRound"),scoreEl=document.getElementById("wordScore"),statusEl=document.getElementById("wordStatus"),slotsEl=document.getElementById("wordSlots"),bankEl=document.getElementById("wordBank"),factEl=document.getElementById("wordFact"),nextBtn=document.getElementById("wordNext");
  let index=0,score=0,picked=[],bankOrder=[],locked=false,wrongFlash=false,flashTimer=0,rewarded=false,round=rounds[0];
  const mk=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
  const render=()=>{
    slotsEl.replaceChildren();
    round.words.forEach((word,i)=>{
      const b=mk("button","word-slot"+(picked[i]?" filled":"")+(wrongFlash?" wrong":""),picked[i]||"…");
      b.disabled=locked;b.setAttribute("aria-label",picked[i]?"นำคำนี้ออก":"ช่องว่าง");
      b.onclick=()=>{if(locked||!picked[i])return;picked.splice(i,1);beep(420,.03);render()};
      slotsEl.appendChild(b);
    });
    bankEl.replaceChildren();
    bankOrder.forEach(word=>{
      if(picked.includes(word))return;
      const b=mk("button","word-tile",word);b.disabled=locked;
      b.onclick=()=>{if(locked)return;picked.push(word);beep(560,.03);render();check()};
      bankEl.appendChild(b);
    });
  };
  const check=()=>{
    if(picked.length!==round.words.length)return;
    if(picked.join("|")===round.words.join("|")){
      locked=true;score+=25;scoreEl.textContent=score;beep(800,.12);
      statusEl.textContent="ถูกต้อง! +25 แต้ม";factEl.textContent=round.f;factEl.hidden=false;
      nextBtn.disabled=false;nextBtn.textContent=index===rounds.length-1?"ดูผลลัพธ์":"ประโยคต่อไป →";
    }else{
      wrongFlash=true;beep(180,.13);statusEl.textContent="ยังไม่ใช่ · แตะคำในช่องเพื่อสลับแล้วลองใหม่";
      clearTimeout(flashTimer);flashTimer=setTimeout(()=>{wrongFlash=false;render()},600);
    }
    render();
  };
  const loadRound=()=>{
    clearTimeout(flashTimer);round=rounds[index];picked=[];bankOrder=ARCADE_SHUFFLE(round.words);locked=false;wrongFlash=false;
    roundEl.textContent=(index+1)+"/"+rounds.length;scoreEl.textContent=score;
    statusEl.textContent="เรียงคำให้เป็นประโยคที่ถูกต้อง";factEl.hidden=true;factEl.textContent="";
    nextBtn.disabled=true;nextBtn.textContent="ประโยคต่อไป →";render();
  };
  const finish=()=>{
    if(rewarded)return;rewarded=true;nextBtn.disabled=true;
    statusEl.textContent="จบเกม · ได้ "+score+" แต้ม";
    factEl.hidden=false;factEl.textContent="ประโยคทั้งหมดเป็นแบบจำลองเพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางการแพทย์";
    arcadeReward(score);
  };
  nextBtn.onclick=()=>{if(index<rounds.length-1){index++;loadRound()}else finish()};
  loadRound();
}
const QUIZ_BANK=[
  {q:"ไวรัสเพิ่มจำนวนได้อย่างไรในแบบจำลองนี้?",o:["ต้องอาศัยเซลล์โฮสต์","สร้างอาหารเองได้ทั้งหมด","แบ่งตัวได้โดยไม่มีโฮสต์"],a:0,f:"ไวรัสต้องใช้กลไกของเซลล์โฮสต์ในการสร้างอนุภาคใหม่"},
  {q:"ยาปฏิชีวนะใช้กับอะไรโดยตรง?",o:["แบคทีเรียบางชนิด","ไวรัสทุกชนิด","เชื้อราเท่านั้น"],a:0,f:"ยาปฏิชีวนะมีเป้าหมายที่แบคทีเรีย ไม่ใช่ไวรัส และผลขึ้นกับชนิดยาและเชื้อ"},
  {q:"ไบโอฟิล์มคืออะไร?",o:["ชุมชนเซลล์ที่เกาะผิวและมีเมือกหุ้ม","ชิ้นส่วน DNA ที่หลุดออกมา","น้ำยาฆ่าเชื้อชนิดหนึ่ง"],a:0,f:"ไบโอฟิล์มช่วยให้เซลล์บางส่วนอยู่รอดในสภาพแวดล้อมที่รบกวนได้"},
  {q:"การกลายพันธุ์เกิดขึ้นเมื่อไหร่?",o:["แบบสุ่ม ไม่ได้เกิดเพราะเชื้อต้องการ","เกิดขึ้นเมื่อเชื้ออยากดื้อยา","เกิดหลังให้ยาทุกครั้ง"],a:0,f:"ความแปรผันเกิดแบบสุ่ม การใช้ยาเป็นตัวคัดเลือกมากกว่าตัวเหตุให้เกิดการกลายพันธุ์ตามต้องการ"},
  {q:"SARS-CoV-2 จัดอยู่ในกลุ่มใด?",o:["ไวรัส","แบคทีเรีย","โปรโตซัว"],a:0,f:"SARS-CoV-2 เป็นไวรัสที่ต้องอาศัยเซลล์โฮสต์ จึงไม่ใช้วงจรแบคทีเรียในเกม"},
  {q:"การล้างมือช่วยอะไร?",o:["ลดเชื้อบนมือและการแพร่กระจาย","ฆ่าเชื้อในอากาศทั้งหมด","ทำให้เชื้อกลายพันธุ์น้อยลงโดยตรง"],a:0,f:"การล้างมือช่วยลดจำนวนเชื้อบนมือและเส้นทางการแพร่กระจายบางทาง"}
];
function arcadeQuiz(){
  stopLife();
  const qs=ARCADE_SHUFFLE(QUIZ_BANK).slice(0,5);
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>ควิซง่าย ๆ</h2><p class="mu">ตอบ 5 ข้อ ตัวละครจะบอกเฉลยพร้อมเกร็ดความรู้ · ตอบผิดไม่เสียคะแนน</p><section class="quiz-game"><p class="c">ข้อ <b id="quizNo">1/5</b> · คะแนน <b id="quizScore">0</b></p><p class="c" id="quizStatus" role="status" aria-live="polite">เลือกคำตอบที่ถูกที่สุด</p><h3 id="quizQuestion"></h3><div class="quiz-options" id="quizOptions"></div><div class="box fi" id="quizFact" hidden></div><button class="pk big" id="quizNext" disabled>ข้อต่อไป →</button></section>`);
  bindNav();on("arcadeMenu",arcade);
  const noEl=document.getElementById("quizNo"),scoreEl=document.getElementById("quizScore"),statusEl=document.getElementById("quizStatus"),questionEl=document.getElementById("quizQuestion"),optionsEl=document.getElementById("quizOptions"),factEl=document.getElementById("quizFact"),nextBtn=document.getElementById("quizNext");
  let index=0,score=0,answered=false,rewarded=false;
  const load=()=>{
    const q=qs[index];answered=false;
    noEl.textContent=(index+1)+"/"+qs.length;scoreEl.textContent=score;
    statusEl.textContent="เลือกคำตอบที่ถูกที่สุด";questionEl.textContent=q.q;
    factEl.hidden=true;factEl.textContent="";nextBtn.disabled=true;nextBtn.textContent="ข้อต่อไป →";
    optionsEl.replaceChildren();
    ARCADE_SHUFFLE(q.o.map((text,i)=>({text,ok:i===q.a}))).forEach(o=>{
      const b=document.createElement("button");b.className="big";b.textContent=o.text;
      b.onclick=()=>{
        if(answered)return;answered=true;
        optionsEl.querySelectorAll("button").forEach(x=>x.disabled=true);
        b.classList.add(o.ok?"correct":"wrong");
        if(o.ok){score+=20;scoreEl.textContent=score;statusEl.textContent="ถูกต้อง! +20";beep(820,.1)}
        else{statusEl.textContent="ยังไม่ใช่ · ดูเฉลยด้านล่าง";beep(180,.12)}
        const correct=[...optionsEl.querySelectorAll("button")].find(x=>x.textContent===q.o[q.a]);
        if(correct)correct.classList.add("correct");
        factEl.textContent=q.f;factEl.hidden=false;nextBtn.disabled=false;
        nextBtn.textContent=index===qs.length-1?"ดูผลลัพธ์":"ข้อต่อไป →";
      };
      optionsEl.appendChild(b);
    });
  };
  const finish=()=>{
    if(rewarded)return;rewarded=true;nextBtn.disabled=true;
    statusEl.textContent="จบควิซ · ได้ "+score+" แต้ม ("+qs.length+" ข้อ)";
    factEl.hidden=false;factEl.textContent="เกร็ดความรู้ในควิซเป็นแบบจำลองการเรียนรู้ ไม่ใช่คำแนะนำทางการแพทย์";
    arcadeReward(score);
  };
  nextBtn.onclick=()=>{if(index<qs.length-1){index++;load()}else finish()};
  load();
}
function arcadeRunner(){
  stopLife();
  const r=R0||roll(),sk=r.fict?"Om":r.virus?r.pathogenId:r.s,tr=Math.min(r.tier,6);
  set(`${nav()}<button class="codex-back" id="arcadeMenu">← เลือกมินิเกม</button><h2>เชื้อวิ่งกระโดด</h2><section class="arcade-layout"><canvas id="runnerBoard" width="420" height="240" aria-label="เกมวิ่งกระโดดหลบสิ่งกีดขวาง"></canvas><div class="arcade-controls"><div class="runner-controls"><button class="pk big" id="runnerJump">↑ กระโดด</button><button class="big" id="runnerAgain">↻ เริ่มใหม่</button></div><p class="mu">กด Space / ↑ / W หรือแตะจอเพื่อกระโดด หลบฟาจ ยา และเซลล์ภูมิคุ้มกัน เก็บจุดเขียวเพื่อแต้มเพิ่ม · เชื้อ: ${microbeName(r)} · คะแนนสูงสุด ${S.arc||0}</p><p class="box fi">สิ่งกีดขวางเป็นสัญลักษณ์ในแบบจำลอง ไม่ใช่การพยากรณ์การติดเชื้อหรือคำแนะนำทางการแพทย์</p></div></section>`);
  bindNav();on("arcadeMenu",arcade);
  const cv=document.getElementById("runnerBoard"),c=cv.getContext("2d"),sp=document.createElement("canvas"),GROUND=196;
  sp.width=128;sp.height=96;
  let raf=0,last=0,dist=0,score=0,speed=170,obstacles=[],picks=[],spawnIn=800,pickIn=1400,y=GROUND-38,vy=0,onGround=true,end=false,rewarded=false;
  const jump=()=>{if(end)return;if(onGround){vy=-470;onGround=false;beep(620,.07)}};
  const kd=e=>{if(e.code=="Space"||e.key==" "||e.key=="ArrowUp"||e.code=="ArrowUp"||e.key=="w"||e.key=="W"){e.preventDefault();end?start():jump()}};
  addEventListener("keydown",kd);
  const draw=ts=>{
    c.fillStyle="#11182d";c.fillRect(0,0,420,240);
    c.fillStyle="#ffffff1f";for(let i=0;i<26;i++)c.fillRect((i*67+Math.floor(dist*.22))%420,(i*41)%150,2,2);
    c.fillStyle="#1b2742";c.fillRect(0,GROUND-10,420,10);
    c.fillStyle="#8adcb5";c.fillRect(0,GROUND,420,3);
    c.fillStyle="#ffffff33";for(let x=-((dist*1.2)%40);x<420;x+=40)c.fillRect(x,GROUND+9,18,2);
    obstacles.forEach(o=>{
      const top=GROUND-o.h;
      if(o.type===0){c.fillStyle="#b99df5";c.fillRect(o.x,top,o.w,14);c.fillStyle="#dceeff";c.fillRect(o.x+3,top+3,Math.max(2,o.w-6),5);c.fillStyle="#b99df5";c.fillRect(o.x+o.w/2-2,top+14,4,o.h-14);c.fillRect(o.x+o.w/2-8,top+o.h-6,16,3)}
      else if(o.type===1){c.fillStyle="#ffe09a";c.fillRect(o.x,top,o.w,o.h);c.fillStyle="#ffa88e";c.fillRect(o.x,top,o.w/2,o.h);c.fillStyle="#fff";c.fillRect(o.x+o.w-4,top,2,o.h)}
      else{c.fillStyle="#8be3e2";c.fillRect(o.x,top,o.w,o.h);c.fillStyle="#fff";c.fillRect(o.x+4,top+5,3,3);c.fillRect(o.x+o.w-8,top+5,3,3);c.fillStyle="#27324d";c.fillRect(o.x+5,top+6,2,2);c.fillRect(o.x+o.w-7,top+6,2,2)}
    });
    picks.forEach(p=>{c.fillStyle="#8adcb5";c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill();c.fillStyle="#eafff6";c.fillRect(p.x-2,p.y-2,2,2)});
    cell(sp,sk,tr,ts,end?"sad":(!onGround?"excited":"neutral"));c.imageSmoothingEnabled=false;c.drawImage(sp,52,y-6,44,33);
    c.fillStyle="#f2f4fa";c.font="bold 13px monospace";c.fillText("Score "+score+"   Best "+S.arc,10,20);
    if(end){c.fillStyle="#000a";c.fillRect(0,0,420,240);c.fillStyle="#fff";c.textAlign="center";c.font="bold 20px sans-serif";c.fillText("โดนสิ่งกีดขวาง!",210,105);c.font="14px sans-serif";c.fillText("คะแนน "+score+" · แตะปุ่มกระโดดเพื่อเล่นอีกครั้ง",210,136);c.textAlign="left"}
  };
  const frame=ts=>{
    if(!cv.isConnected){removeEventListener("keydown",kd);cancelAnimationFrame(raf);return}
    if(!last)last=ts;const dt=Math.min(.04,(ts-last)/1000);last=ts;
    if(!end){
      speed=Math.min(330,170+dist/45);dist+=speed*dt;score=Math.floor(dist/12);
      if(!onGround){vy+=1500*dt;y+=vy*dt;if(y>=GROUND-38){y=GROUND-38;vy=0;onGround=true}}
      spawnIn-=dt*1000;if(spawnIn<=0){spawnIn=Math.max(620,1450-dist/24)*(.85+rnd()*.4);const h=24+Math.floor(rnd()*16);obstacles.push({x:430,w:18+Math.floor(rnd()*12),h,type:Math.floor(rnd()*3)})}
      pickIn-=dt*1000;if(pickIn<=0){pickIn=1700+rnd()*1800;picks.push({x:430,y:GROUND-54-rnd()*28,r:6})}
      obstacles.forEach(o=>o.x-=speed*dt);picks.forEach(p=>p.x-=speed*dt);
      obstacles=obstacles.filter(o=>o.x+o.w>-20);picks=picks.filter(p=>p.x+p.r>-20);
      const px=74,py=y+5,pw=30,ph=28;
      if(obstacles.some(o=>px+pw-6>o.x+3&&px+4<o.x+o.w-3&&py+ph>GROUND-o.h+4)){
        end=true;beep(120,.2);
        if(!rewarded){rewarded=true;arcadeReward(score)}
      }
      picks=picks.filter(p=>{
        if(px+pw>p.x-p.r&&px<p.x+p.r&&py+ph>p.y-p.r&&py<p.y+p.r){score+=25;beep(900,.07);return false}
        return true;
      });
    }
    draw(ts);if(!end)raf=requestAnimationFrame(frame);
  };
  const start=()=>{
    cancelAnimationFrame(raf);dist=0;score=0;speed=170;obstacles=[];picks=[];spawnIn=800;pickIn=1400;
    y=GROUND-38;vy=0;onGround=true;end=false;rewarded=false;last=0;
    raf=requestAnimationFrame(frame);
  };
  on("runnerAgain",start);on("runnerJump",()=>end?start():jump());
  cv.onpointerdown=e=>{e.preventDefault();end?start():jump()};
  start();
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
