"use strict";
/* ===== ENGINE ===== */
const rnd=Math.random,cl=v=>Math.max(0,Math.min(100,v));
function pick(a,w){let t=0;for(const x of w)t+=x;let r=rnd()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]}
function intr(s){const r={};if(["Ec","Kp","Pa","Ab","Hi"].includes(s))r.P=r.Cx=r.Va="R";if(s=="Kp")r.Am="R";if(s=="Pa"||s=="Ab")r.Am=r.Ct="R";if(s=="En")r.Ct="R";if(["Sa","Sp","En","Lb","Bs"].includes(s))r.Co="R";if(s=="Mp")r.P=r.Cx=r.Am=r.Ct=r.Me="R";return r}
function ast(s,on){const a={};D10.forEach(d=>a[d]="S");Object.assign(a,intr(s));on.forEach(g=>g.e.forEach(x=>{const[d,v]=x.split(":");if(v=="I"){if(a[d]!="R")a[d]="I"}else a[d]="R"}));return a}
function label(s,on,a){const has=n=>on.some(g=>g.n==n);if(s=="Lb"||s=="Bs")return"Friendly";if(has("mecA"))return"MRSA";if(has("vanA"))return"VRE";
if((s=="Ec"||s=="Kp")&&(has("KPC-2")||has("NDM-1")))return"CRE";if(s=="Ab"&&a.Me=="R")return"CRAB";if(s=="Pa"&&(has("oprD+mexAB")||has("NDM-1")))return"CRPA";
if(s=="Sp"&&has("pbp-mosaic"))return"PRSP";if(has("CTX-M-15"))return"ESBL";const I=intr(s);if(D10.filter(d=>a[d]!="S"&&!I[d]).length>=5)return"MDR-like (game panel)";return on.length?"Acquired-R":"Wild-type"}
const DC={};
function dist(s,h){const k=s+h;if(DC[k])return DC[k];const gs=GN.filter(g=>g.p[s]),out=[];for(let m=0;m<1<<gs.length;m++){let p=1;const on=[];gs.forEach((g,i)=>{const q=Math.min(.95,g.p[s]*H[h][3]);if(m>>i&1){p*=q;on.push(g)}else p*=1-q});const a=ast(s,on);out.push({p,on,a,l:label(s,on,a)})}return DC[k]=out}
const psh=(s,h)=>{const t=SK.reduce((a,k)=>a+SP[k].w[h],0);return SP[s].w[h]/t};
const SPECIES_PROB={};
function speciesProbability(s){if(SPECIES_PROB[s]!=null)return SPECIES_PROB[s];return SPECIES_PROB[s]=H.reduce((sum,_,h)=>sum+HP[h]*psh(s,h),0)}
function speciesTier(s){return tierOf(1/speciesProbability(s))}
const BACTERIA_TIER_SHARE=[.90,.09,.01],BACTERIA_TIER_PROB={};
function bacteriaTierProbability(tier){if(BACTERIA_TIER_PROB[tier]!=null)return BACTERIA_TIER_PROB[tier];return BACTERIA_TIER_PROB[tier]=SK.filter(s=>speciesTier(s)==tier).reduce((sum,s)=>sum+speciesProbability(s),0)}
function bacteriaSpeciesProbability(s){const tier=speciesTier(s);return speciesProbability(s)*BACTERIA_TIER_SHARE[tier]/bacteriaTierProbability(tier)}
function pickBacteriaSpecies(){const tiers=[...new Set(SK.map(speciesTier))],tier=pick(tiers,tiers.map(t=>BACTERIA_TIER_SHARE[t])),species=SK.filter(s=>speciesTier(s)==tier);return pick(species,species.map(speciesProbability))}
const pHabitatGivenSpecies=(s,h)=>HP[h]*psh(s,h)/speciesProbability(s);
const PL=(s,h,l)=>dist(s,h).filter(o=>o.l==l).reduce((a,o)=>a+o.p,0);
const PGC={};function PG(s,l){const k=s+l;if(PGC[k]!=null)return PGC[k];let t=0;for(let h=0;h<H.length;h++)t+=pHabitatGivenSpecies(s,h)*PL(s,h,l);return PGC[k]=bacteriaSpeciesProbability(s)*t}
const OMEGA={s:"Om",fict:true,label:"Omega (FICTIONAL)",tier:7,on:[],a:Object.fromEntries(D10.map(d=>[d,"R"]))};
window.__forceOmega=false;
const BACTERIA_RATE=.95;
function roll(){if(window.__forceOmega||rnd()<1/8.2e9){const c=pick(C.map((x,i)=>i),CP),h=pick(H.map((x,i)=>i),HP);return Object.assign({},OMEGA,{c,h,no:docNo(c)})}
if(rnd()<.05&&typeof rollVirusPathogen=="function")return rollVirusPathogen();
const c=pick(C.map((x,i)=>i),CP),s=pickBacteriaSpecies(),h=pick(H.map((x,i)=>i),H.map((_,i)=>HP[i]*psh(s,i))),d=dist(s,h),o=pick(d,d.map(x=>x.p)),pl=PL(s,h,o.l),Pb=CP[c]*BACTERIA_RATE*bacteriaSpeciesProbability(s)*pHabitatGivenSpecies(s,h)*pl,Ns=1/PG(s,o.l);
return{s,c,h,label:o.l,on:o.on,a:o.a,Nb:1/Pb,Ns,tier:speciesTier(s),no:docNo(c)}}
const docNo=c=>C[c][0]+"-2026-"+String(Math.floor(rnd()*1e7)).padStart(7,"0");
window.__simulateRolls=(n=1e5)=>{const tiers={},species={};for(let i=0;i<n;i++){const r=roll(),tier=r.virus?"Virus":TIER[r.tier]||"Omega";tiers[tier]=(tiers[tier]||0)+1;species[r.s]=(species[r.s]||0)+1}console.table(Object.entries(tiers).map(([tier,count])=>({tier,count,proportion:+(count/n).toFixed(5),SE:+Math.sqrt(count/n*(1-count/n)/n).toFixed(5)})));return{data_version:DATA_VERSION,samples:n,tiers,species}};
