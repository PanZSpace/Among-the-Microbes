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
function drawPixelIcon(canvas,kind){
  const c=canvas.getContext("2d");c.clearRect(0,0,canvas.width,canvas.height);
  const p=(x,y,w,h,color)=>codexPixel(c,x,y,w,h,color);
  const navy="#26324f",ice="#dceeff",cyan="#80dbe8",green="#8adcb5",gold="#ffd27f",pink="#ffc3aa",purple="#b99df5";
  p(8,8,64,64,"#10182d");p(11,11,58,58,navy);p(14,14,52,52,"#1a2540");
  if(kind=="journey"){
    p(19,22,17,17,green);p(44,40,17,17,cyan);p(19,43,17,17,"#648dbb");
    p(36,24,7,5,gold);p(42,30,5,8,gold);p(36,37,8,5,gold);p(32,42,6,9,gold);p(34,52,6,5,gold);
  }else if(kind=="arcade"){
    p(24,16,32,49,purple);p(28,20,24,23,navy);p(31,23,18,16,cyan);p(32,49,6,6,gold);p(30,52,10,3,gold);p(45,49,5,5,pink);p(32,62,7,4,ice);p(46,62,7,4,ice);
  }else if(kind=="friends"){
    codexCircle(c,31,34,11,cyan);codexCircle(c,50,37,10,pink);p(27,31,3,5,navy);p(34,31,3,5,navy);p(46,34,3,4,navy);p(52,34,3,4,navy);p(25,49,23,8,green);p(45,51,17,7,purple);p(30,42,4,2,navy);p(49,44,4,2,navy);
  }else if(kind=="guide"||kind=="journal"){
    p(19,20,24,40,ice);p(42,20,20,40,"#a9cff2");p(39,20,4,40,purple);p(23,26,13,3,cyan);p(23,33,13,2,cyan);p(23,39,13,2,cyan);p(46,27,11,3,cyan);p(46,34,11,2,cyan);p(46,40,11,2,cyan);p(22,58,40,4,gold);
  }else if(kind=="genes"){
    for(let i=0;i<5;i++){const y=19+i*9;p(24+(i%2)*18,y,24,3,i%2?cyan:purple);p(22+(i%2)*18,y+3,4,3,ice);p(51-(i%2)*18,y+3,4,3,ice)}
    p(27,16,5,5,green);p(48,58,5,5,pink);
  }else if(kind=="pathogens"){
    codexCircle(c,40,40,20,purple);codexCircle(c,40,40,14,"#dbe6ff");codexCircle(c,40,40,8,cyan);
    for(let i=0;i<8;i++){const a=i*Math.PI/4,x=Math.round(40+Math.cos(a)*25),y=Math.round(40+Math.sin(a)*25);p(x-2,y-2,5,5,gold)}
    p(37,36,3,7,navy);p(42,36,3,7,navy);p(37,46,8,3,navy);
  }else if(kind=="chronicles"){
    p(23,18,36,47,ice);p(20,21,36,43,"#a9cff2");p(26,26,23,3,purple);p(26,34,24,2,navy);p(26,41,20,2,navy);p(26,48,22,2,navy);p(26,55,14,2,navy);p(52,30,7,7,gold);p(52,44,7,7,cyan);
  }else if(kind=="achievements"){
    p(31,16,18,7,gold);p(26,22,28,21,gold);p(21,27,8,16,pink);p(51,27,8,16,pink);p(32,43,7,16,cyan);p(42,43,7,16,purple);p(34,26,12,12,ice);p(38,28,4,8,gold);
  }else{
    codexCircle(c,40,40,22,gold);codexCircle(c,40,40,15,ice);p(37,27,6,26,purple);p(29,37,22,6,purple);
  }
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
