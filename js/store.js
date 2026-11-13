"use strict";
/* ===== STORE ===== */
let S={codex:[],mp:0,rolls:0,best:0,ach:{},cos:[],eq:[],arc:0,history:[],outbreaks:0};
const COSL=["bow","glasses","chef","crown","angelWings","devilWings","flowerCrown","halo","scarf","leaf","sunglasses","star","headphones","crystal","shell","ribbon","beanie","heart","sparkle","planet"];
const COSFREE=COSL.slice(0,10);
try{const x=JSON.parse(localStorage.getItem("amb")||"{}");if(Array.isArray(x.codex))S.codex=x.codex.slice(0,200).filter(e=>e&&(SP[e.s]||e.pathogenId||e.fict));S.mp=+x.mp||0;S.rolls=+x.rolls||0;S.best=+x.best||0;S.arc=+x.arc||0;S.outbreaks=+x.outbreaks||0;if(x.ach&&typeof x.ach=="object")S.ach=x.ach;if(Array.isArray(x.cos))S.cos=x.cos.filter(c=>COSL.includes(c));if(Array.isArray(x.history))S.history=x.history.slice(0,20);S.eq=Array.isArray(x.eq)?x.eq.filter(c=>COSL.includes(c)).slice(0,2):COSL.includes(x.eq)?[x.eq]:[]}catch(e){}
S.cos=[...new Set([...COSFREE,...S.cos])];
S.eq=[...new Set(S.eq)].slice(0,2);
const save=()=>{try{localStorage.setItem("amb",JSON.stringify(S))}catch(e){}};
