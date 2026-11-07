const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const source=html.slice(html.indexOf('const PulseAudio='),html.indexOf('function pulseChrome()'));
const stats={started:0,stopped:0,resumed:0,buffers:0};
const param=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}});
function node(){return {gain:param(),frequency:param(),threshold:param(),ratio:param(),connect(target){return target},start(){stats.started++},stop(){stats.stopped++}}}
class FakeContext{
 constructor(){this.currentTime=0;this.sampleRate=48000;this.destination=node()}
 resume(){stats.resumed++}createGain(){return node()}createDynamicsCompressor(){return node()}
 createOscillator(){return node()}createBiquadFilter(){return node()}createBufferSource(){return node()}
 createBuffer(channels,length){stats.buffers++;return {getChannelData(){return new Float32Array(Math.floor(length))}}}
}
const context={window:{AudioContext:FakeContext},stats};vm.createContext(context);
vm.runInContext('let audioCtx;const state={music:false};let paused=false,current=3;'+source+';globalThis.audio=PulseAudio;globalThis.preferences=state;globalThis.setPaused=v=>paused=v;',context);
test('La base rítmica no arranca sin activación y sus voces se detienen al pausar',()=>{
 const audio=context.audio;audio.update(.04);assert.equal(stats.started,0);
 assert.equal(audio.init(),true);assert.equal(stats.buffers,1);audio.update(.2);assert.equal(stats.started,0);
 context.preferences.music=true;for(let i=0;i<100;i++)audio.update(.04);assert(stats.started>10);assert(audio.voices.size>0);
 context.setPaused(true);const before=stats.started;audio.update(.4);assert.equal(stats.started,before);
 audio.hush();assert.equal(audio.voices.size,0);assert.equal(audio.clock,0);assert(stats.stopped>=before);
 context.setPaused(false);context.preferences.music=false;audio.update(.4);assert.equal(stats.started,before);
});
test('Reactivar audio reutiliza el buffer de ruido original',()=>{context.audio.init();assert.equal(stats.buffers,1);assert(stats.resumed>=2)});
