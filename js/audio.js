"use strict";
/* ===== AUDIO ===== */
let ac;function beep(f=440,d=.08){if(mute)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.value=f;g.gain.value=.04;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
