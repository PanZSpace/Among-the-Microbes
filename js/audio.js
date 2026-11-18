"use strict";
/* ===== AUDIO ===== */
let ac=null,musicBus=null,musicTimer=0,musicStep=0;
function audioContext(){const AudioCtor=window.AudioContext||window.webkitAudioContext;if(!AudioCtor)return null;ac=ac||new AudioCtor();if(ac.state=="suspended")ac.resume();return ac}
function playTone(freq,at,duration,volume,type,bus){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(volume,at+.035);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(bus||ac.destination);o.start(at);o.stop(at+duration+.02)}
function startMusic(){if(mute||musicTimer)return;const ctx=audioContext();if(!ctx)return;musicBus=ctx.createGain();musicBus.gain.setValueAtTime(.48,ctx.currentTime);musicBus.connect(ctx.destination);const melody=[392,523.25,587.33,523.25,440,523.25,392,329.63,349.23,440,523.25,440,392,329.63,293.66,329.63],bass=[130.81,146.83,110,123.47];musicStep=0;musicTimer=setInterval(()=>{if(mute||!ac||ac.state!="running")return;const at=ac.currentTime+.04,i=musicStep%melody.length;playTone(melody[i],at,.34,.075,"sine",musicBus);if(musicStep%4===0){const chord=bass[Math.floor(musicStep/4)%bass.length];playTone(chord,at,.8,.055,"triangle",musicBus);playTone(chord*1.5,at,.65,.025,"sine",musicBus)}musicStep++},480)}
function stopMusic(){clearInterval(musicTimer);musicTimer=0;if(musicBus&&ac){musicBus.gain.cancelScheduledValues(ac.currentTime);musicBus.gain.setTargetAtTime(.0001,ac.currentTime,.045)}musicBus=null}
function setMuted(value){mute=!!value;if(mute)stopMusic();else startMusic()}
function beep(f=440,d=.08){if(mute)return;const ctx=audioContext();if(!ctx)return;playTone(f,ctx.currentTime,d,.045,"square");startMusic()}
function rarityJingle(tier){if(mute)return;const ctx=audioContext();if(!ctx)return;const notes=[523.25,659.25,783.99,1046.5,1318.51],count=Math.max(2,Math.min(5,tier+2));for(let i=0;i<count;i++)playTone(notes[i],ctx.currentTime+.06+i*.105,.22,.07,"triangle")}
document.addEventListener("pointerdown",()=>{if(!mute)startMusic()},{once:true});
document.addEventListener("keydown",()=>{if(!mute)startMusic()},{once:true});
