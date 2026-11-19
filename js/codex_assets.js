"use strict";
/* ===== CODEX PIXEL ITEMS ===== */
function codexPixel(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function codexDot(ctx,x,y,color,size=2){codexPixel(ctx,x,y,size,size,color)}
function codexCircle(ctx,cx,cy,r,color){for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(Math.max(0,r*r-y*y)));codexPixel(ctx,cx-w,cy+y,w*2+1,1,color)}}
function codexMolecule(ctx,x,y,color){
  codexPixel(ctx,x+2,y+2,9,2,color);codexPixel(ctx,x+5,y-1,2,8,color);
  codexPixel(ctx,x,y,4,4,color);codexPixel(ctx,x+9,y,4,4,color);codexPixel(ctx,x+4,y+8,4,4,color)
}
function drawJournalArt(ctx){
  const navy="#263F68",steel="#648DBB",ice="#DCEEFF",light="#A9CFF2",white="#FFFFFF",gray="#D5DFEA",shadow="#172944";
  codexPixel(ctx,21,16,48,49,shadow);
  codexPixel(ctx,57,14,9,45,gray);codexPixel(ctx,59,12,8,47,white);codexPixel(ctx,62,14,4,43,gray);
  codexPixel(ctx,22,10,37,5,navy);codexPixel(ctx,18,15,43,5,navy);codexPixel(ctx,15,20,47,34,navy);codexPixel(ctx,18,54,43,5,navy);codexPixel(ctx,22,59,36,3,navy);
  codexPixel(ctx,16,20,4,34,steel);codexPixel(ctx,20,15,3,39,steel);codexPixel(ctx,23,11,34,3,steel);
  codexPixel(ctx,23,19,36,31,steel);codexPixel(ctx,21,22,37,27,navy);
  codexPixel(ctx,26,22,29,2,light);codexPixel(ctx,24,24,2,22,light);codexPixel(ctx,55,24,2,22,shadow);
  codexPixel(ctx,43,60,5,8,light);codexPixel(ctx,43,66,5,4,steel);codexPixel(ctx,44,68,3,2,ice);
  for(const y of [20,29,38,47]){codexPixel(ctx,17,y,5,2,ice);codexPixel(ctx,20,y-1,2,4,white);codexPixel(ctx,17,y+2,4,2,steel)}
  codexMolecule(ctx,28,27,light);codexMolecule(ctx,46,27,light);
  codexPixel(ctx,35,27,2,5,light);codexPixel(ctx,36,31,7,2,light);
  codexPixel(ctx,29,44,18,2,light);codexPixel(ctx,30,46,16,2,steel);
  codexPixel(ctx,38,29,7,2,white);codexPixel(ctx,35,31,3,2,white);codexPixel(ctx,45,31,3,2,white);
  codexPixel(ctx,32,33,3,8,white);codexPixel(ctx,48,33,3,8,white);
  codexPixel(ctx,35,41,3,2,white);codexPixel(ctx,45,41,3,2,white);codexPixel(ctx,38,43,7,2,white);
  codexPixel(ctx,38,31,7,2,light);codexPixel(ctx,35,33,3,2,light);codexPixel(ctx,45,33,3,2,light);
  codexPixel(ctx,34,35,15,4,light);codexPixel(ctx,35,39,3,2,light);codexPixel(ctx,45,39,3,2,light);codexPixel(ctx,38,41,7,2,light);
  codexPixel(ctx,39,30,5,5,white);codexPixel(ctx,37,32,2,3,white);codexPixel(ctx,44,32,2,3,white);
  codexPixel(ctx,40,33,3,3,navy);codexPixel(ctx,39,34,5,2,white);
  codexPixel(ctx,31,37,5,6,white);codexPixel(ctx,33,35,5,3,white);codexPixel(ctx,33,42,5,3,white);
  codexPixel(ctx,33,38,3,4,navy);codexPixel(ctx,45,37,5,6,white);codexPixel(ctx,44,35,5,3,white);
  codexPixel(ctx,44,42,5,3,white);codexPixel(ctx,46,38,3,4,navy);
  codexPixel(ctx,38,36,7,2,white);codexPixel(ctx,37,38,2,3,white);codexPixel(ctx,44,38,2,3,white);
  codexPixel(ctx,39,41,5,2,white);codexPixel(ctx,40,38,3,3,navy);
  codexPixel(ctx,53,31,5,12,light);codexPixel(ctx,55,33,4,8,steel);codexPixel(ctx,56,35,2,4,white);
  codexPixel(ctx,28,49,8,2,light);codexPixel(ctx,28,49,2,4,light);codexPixel(ctx,34,49,2,4,light);
  codexPixel(ctx,48,46,8,1,light);codexPixel(ctx,46,47,12,2,white);codexPixel(ctx,48,49,8,1,steel);
  codexPixel(ctx,50,47,2,1,navy);codexPixel(ctx,53,48,2,1,navy);
  codexPixel(ctx,27,18,28,1,white);codexPixel(ctx,22,20,2,25,light);
}
function codexDish(ctx,cx,cy){
  const dark="#263F68",steel="#648DBB",white="#FFFFFF",ice="#DCEEFF",light="#A9CFF2";
  const outer=[8,12,16,18,20,22,22,22,20,18,16,12,8];
  outer.forEach((width,i)=>codexPixel(ctx,cx-Math.floor(width/2),cy+i-6,width,1,i<2||i>10?dark:steel));
  const inside=[0,8,12,14,16,18,18,18,16,14,12,8,0];
  inside.forEach((width,i)=>{if(width)codexPixel(ctx,cx-Math.floor(width/2),cy+i-6,width,1,white)});
  const liquid=[0,0,8,12,14,16,16,16,14,12,8,0,0];
  liquid.forEach((width,i)=>{if(width)codexPixel(ctx,cx-Math.floor(width/2),cy+i-6,width,1,i<5?ice:light)});
  [[-8,-1],[0,2],[8,-2],[-3,5],[7,4],[3,-3]].forEach(([dx,dy],i)=>codexDot(ctx,cx+dx,cy+dy,i%2?steel:dark,2));
  codexPixel(ctx,cx-10,cy-3,8,1,white);codexPixel(ctx,cx-12,cy-2,3,1,white);
}
function codexCollectionCard(ctx){
  const navy="#263F68",steel="#648DBB",ice="#DCEEFF",light="#A9CFF2",white="#FFFFFF",gray="#D5DFEA",shadow="#172944";
  codexPixel(ctx,26,14,46,54,shadow);
  codexPixel(ctx,24,10,44,56,navy);codexPixel(ctx,27,7,38,3,navy);codexPixel(ctx,21,13,3,48,navy);codexPixel(ctx,26,66,38,3,navy);
  codexPixel(ctx,26,13,39,49,white);codexPixel(ctx,29,16,33,43,ice);
  codexPixel(ctx,30,17,31,3,steel);codexPixel(ctx,30,20,3,2,navy);codexPixel(ctx,58,20,3,2,navy);
  codexDish(ctx,45,31);
  codexPixel(ctx,31,42,18,2,steel);codexPixel(ctx,31,46,13,2,light);codexPixel(ctx,31,50,16,2,light);
  codexPixel(ctx,31,56,18,8,white);codexPixel(ctx,32,57,16,6,ice);
  codexPixel(ctx,34,60,3,2,steel);codexPixel(ctx,39,58,3,4,steel);codexPixel(ctx,44,56,3,6,steel);
  codexPixel(ctx,50,58,12,2,navy);codexPixel(ctx,50,62,12,2,navy);
  codexMolecule(ctx,54,43,steel);
  for(let i=0;i<5;i++){
    const x=67+(i%2),y=27+i*5;
    codexDot(ctx,x,y,steel,2);codexDot(ctx,71-x+67,y+1,light,2);
    codexPixel(ctx,68,y,3,1,steel);
  }
  codexPixel(ctx,59,9,4,10,gray);codexPixel(ctx,62,7,5,4,white);codexPixel(ctx,65,10,3,9,steel);
  codexPixel(ctx,60,17,4,3,white);codexPixel(ctx,62,20,3,3,gray);
  codexPixel(ctx,29,14,31,1,white);codexPixel(ctx,27,17,1,44,light);
}
const CUTE_PAL={o:"#3d2c6b",k:"#3d2c6b",w:"#ffffff",r:"#ff8fb0",y:"#ffd84d",c:"#7de8f2",g:"#8ef0b8",v:"#b79bff",P:"#ff7fa8",s:"#fff7b0"};
const CUTE_ICONS={
  journey:{bg:"#c9ffe3",map:{p:"#7debb5"},rows:[
    "........",".....ooo","...ooppp","..oppppp",".oppwwpp",".opwppppp",".opppkpp",".opppkpp",
    ".oprrppk","..oppppp","...ooppp",".....opp","......op",".......o"],extra:[[21,9,"s"]]},
  arcade:{bg:"#e6dcff",map:{v:"#b79bff"},rows:[
    "........","..oooooo",".ovvvvvv","ovwvvvvv","ovvooooo","ovvocccc","ovvockcc","ovvockcc",
    "ovvocrck","ovvooooo","ovvvvvvv","ovyvvvpv",".ovvvvvv","..oooooo"],extra:[]},
  friends:{bg:"#ffe0ec",map:{p:"#ff9cc2"},rows:[
    "........",".oooo...","oppppoo.","opwppppo","opwppppp","opppkppp","opppkppp","oprrpppk",
    ".opppppp","..oppppp","...opppp","....oppp",".....opp","......op",".......o"],extra:[]},
  guide:{bg:"#dbeaff",map:{v:"#8fa8ff"},rows:[
    "........","..oooooo",".owwwwww",".owwwwww",".owwwkww",".owwwkww",".owrrwwk",".owwwwww",
    ".owwwwww",".ovvvvvy","..oooooy",".......y",".......o"],extra:[]},
  pathogens:{bg:"#efe3ff",map:{p:"#c3a6ff"},rows:[
    "........","..y.oooo","..oopppp",".oppwppp","yppwpppp","oppppppp","opppkppp","opppkppp",
    "oprrpppk","yppppppp",".opppppp","..oopppp","..y.oooo"],extra:[]},
  chronicles:{bg:"#fff3d1",map:{w:"#fff6dc"},rows:[
    "........","..oooooo",".owwwwww","owwwwwww","owwwwwww","owwwkwww","owwwkwww","owwrrwwk",
    "owwwwwww","owcccccc","owwwwwww","owcccccc",".owwwwww","..oooooo"],extra:[]},
  achievements:{bg:"#fff0b8",map:{y:"#ffd84d"},rows:[
    "......oo","......oy",".....oyy","oooooyyy","oyyyywyy",".oyyyyyy","..oyykyy","..oyykyy",
    "...orryk","...oyyyy","..oyyyoo","..oyyoo.",".oyyo...",".oooo..."]},
  _:{bg:"#ffe8d9",map:{p:"#ffc08a"},rows:[
    "........","...ooooo","..oppppp",".opwpppp",".opppppp","opppkppp","opppkppp","oprrpppk",
    ".opppppp",".opppppp","..oppppp","...ooooo"],extra:[]}
};
function cuteSprite(ctx,definition,x,y,scale,shadow){
  const palette=Object.assign({},CUTE_PAL,definition.map||{});
  definition.rows.forEach((sourceRow,rowIndex)=>{
    const row=sourceRow.padEnd(8,".")+[...sourceRow.padEnd(8,".")].reverse().join("");
    for(let column=0;column<16;column++){
      const pixel=row[column];
      if(pixel=="."||!pixel)continue;
      ctx.fillStyle=shadow?"#2a1a5a40":(palette[pixel]||"#f0f");
      ctx.fillRect(x+column*scale,y+rowIndex*scale,scale,scale)
    }
  });
  (definition.extra||[]).forEach(([px,py,color])=>{
    ctx.fillStyle=palette[color];
    ctx.fillRect(x+px,y+py,scale,scale)
  })
}
function cuteSpark(ctx,x,y,color){
  codexPixel(ctx,x-2,y,5,1,color);codexPixel(ctx,x,y-2,1,5,color)
}
function cuteTile(ctx,color,size){
  const margin=size==80?0:2,paint=(x,y,width,height,fill)=>codexPixel(ctx,x+margin,y+margin,width,height,fill);
  paint(8,6,64,68,"#5b4aa8");paint(6,8,68,64,"#5b4aa8");
  paint(10,8,60,64,"#ffffff");paint(8,10,64,60,"#ffffff");
  paint(12,10,56,60,color);paint(10,12,60,56,color);
  paint(12,64,56,6,"#5b4aa81c");paint(14,12,26,3,"#ffffffcc");paint(12,15,3,10,"#ffffffaa");
  cuteSpark(ctx,64+margin,16+margin,"#ffffff");codexDot(ctx,15+margin,63+margin,"#ffffff",2)
}
function drawPixelIcon(canvas,kind){
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);
  if(kind=="journal")kind="guide";
  const definition=CUTE_ICONS[kind],tileColor=definition?definition.bg:(kind=="genes"?"#d6fff6":"#ffe8d9");
  cuteTile(ctx,tileColor,80);
  if(kind=="genes"){
    for(let y=17;y<=61;y+=3){
      const phase=(y-17)/44*Math.PI*2.2,x1=40+Math.round(Math.sin(phase)*13),x2=80-x1;
      if(Math.abs(x1-x2)>6&&(y-17)%6==0)codexPixel(ctx,Math.min(x1,x2)+2,y+1,Math.abs(x1-x2)-3,2,"#ffffff");
      codexPixel(ctx,x1-3,y-1,7,6,"#3d2c6b");codexPixel(ctx,x2-3,y-1,7,6,"#3d2c6b");
      codexPixel(ctx,x1-2,y,5,4,"#3fd0ea");codexPixel(ctx,x2-2,y,5,4,"#ff7fa8");
      codexPixel(ctx,x1-2,y,2,1,"#d9fbff");codexPixel(ctx,x2-2,y,2,1,"#ffe1ee")
    }
    return
  }
  cuteSprite(ctx,definition||CUTE_ICONS._,18,19,3,true);
  cuteSprite(ctx,definition||CUTE_ICONS._,16,16,3,false)
}
function drawBadgeArt(canvas,key,earned){
  const c=canvas.getContext("2d");c.clearRect(0,0,canvas.width,canvas.height);
  const p=(x,y,w,h,color)=>codexPixel(c,x,y,w,h,color),accent=earned?"#ffd27f":"#596581";
  p(8,8,48,48,"#10182d");p(11,11,42,42,"#26324f");p(19,39,11,15,earned?"#80dbe8":"#3b4660");p(35,39,11,15,earned?"#b99df5":"#3b4660");
  codexCircle(c,32,28,19,earned?"#fff0ae":"#7d879e");codexCircle(c,32,28,14,accent);
  codexCircle(c,32,28,9,earned?"#dceeff":"#596581");
  const motif={first:"✦",g10:"★",species:"●",gene:"⌁",arcade:"◆",lives:"♥",genes:"✚",explorer:"✧",outbreak:"＋",chronicle:"≋"}[key]||"•";
  c.fillStyle=earned?"#26324f":"#333d55";c.font="bold 13px monospace";c.textAlign="center";c.textBaseline="middle";c.fillText(motif,32,28);
}
function drawGeneArt(canvas,gene){
  const c=canvas.getContext("2d");c.clearRect(0,0,canvas.width,canvas.height);
  const palette=["#80dbe8","#b99df5","#8adcb5","#ffc3aa"],hash=[...gene].reduce((n,ch)=>n+ch.charCodeAt(0),0),a=palette[hash%palette.length],b=palette[(hash+1)%palette.length];
  codexPixel(c,6,6,52,52,"#10182d");codexPixel(c,9,9,46,46,"#26324f");
  for(let i=0;i<5;i++){const y=15+i*8,x=i%2?34:20;codexPixel(c,x,y,18,3,a);codexPixel(c,x-4,y+3,4,3,b);codexPixel(c,x+18,y+3,4,3,b)}
  codexPixel(c,14,13,4,4,"#dceeff");codexPixel(c,46,47,4,4,"#ffd27f");
}
function drawPathogenArt(canvas,id){
  const c=canvas.getContext("2d");c.clearRect(0,0,canvas.width,canvas.height);
  const palette={covid:"#80dbe8",ebola:"#ffc3aa",cholera:"#8adcb5",plague:"#b99df5"},color=palette[id]||"#ffd27f";
  const spriteId={covid:"sars2",ebola:"ebola",cholera:"vibrio",plague:"yersinia"}[id];
  if(typeof MicrobeSprites!="undefined"&&spriteId){codexPixel(c,6,6,52,52,"#10182d");codexPixel(c,9,9,46,46,"#26324f");const bug=MicrobeSprites.make(spriteId,{autoExpression:false});bug.setExpression("smile");bug.draw(c,4,4,.875);return}
  codexPixel(c,6,6,52,52,"#10182d");codexPixel(c,9,9,46,46,"#26324f");
  if(id=="covid"||id=="ebola"){
    if(id=="covid"){codexCircle(c,32,32,13,color);codexCircle(c,32,32,7,"#dceeff")}
    else{codexPixel(c,16,27,32,11,color);codexPixel(c,20,23,24,4,color);codexPixel(c,20,38,24,4,color)}
    for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.round(32+Math.cos(a)*20),y=Math.round(32+Math.sin(a)*20);codexPixel(c,x-2,y-2,5,5,color)}
  }else{
    codexPixel(c,17,26,30,13,color);codexPixel(c,20,23,24,3,color);codexPixel(c,20,39,24,3,color);
    codexPixel(c,23,30,3,3,"#26324f");codexPixel(c,37,33,3,3,"#26324f");codexPixel(c,49,31,5,3,"#dceeff");
  }
}
function drawCodexItem(canvas,kind){
  const ctx=canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(kind=="journal")drawJournalArt(ctx);
  else if(kind=="collection-card")codexCollectionCard(ctx);
}
