const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
let frames=new Map(),seq=0,time=0,errors=[];
const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'file:///camp/index.html',virtualConsole:vc,beforeParse(w){
 w.scrollTo=()=>{};w.matchMedia=()=>({matches:false});w.confirm=()=>true;
 w.requestAnimationFrame=fn=>{frames.set(++seq,fn);return seq};w.cancelAnimationFrame=id=>frames.delete(id);
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='measureText'?()=>({width:90}):()=>{}});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
}});
const w=dom.window,d=w.document,$=s=>{const el=d.querySelector(s);assert(el,'Missing '+s);return el},click=s=>$(s).click();
function pump(seconds){for(let j=0;j<Math.ceil(seconds/.04);j++){time+=40;let f=[...frames.values()];frames.clear();f.forEach(fn=>fn(time))}}
function key(k){d.body.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));d.body.dispatchEvent(new w.KeyboardEvent('keyup',{key:k,bubbles:true}))}
click('#introSkip');
assert.equal($('#practiceStation').options.length,6);
for(const level of [0,1,2]){
 $('#level').value=level;$('#level').dispatchEvent(new w.Event('change'));
 if(level===1)click('#motionToggle');
 const total=[5,7,9][level];
for(const mode of [0,1,2,4,5]){
 $('#practiceStation').value=mode;click('#pulseStart');click('[data-practice="0"]');click('#tutorialReady');click('#inspect');click('#operator');click('#fit');click('#enter');
 assert(d.querySelector('.arcade-session'),'Default task must open a circuit');assert.match(d.body.textContent,/PRÁCTICA LIBRE/);
 click('#arcadeLaunch');pump(.2);
 key('p');assert(!$('#arcadePausePanel').classList.contains('hidden'));const freeze=$('#arcadeWindow').textContent;pump(3);assert.equal($('#arcadeWindow').textContent,freeze);key('p');assert($('#arcadePausePanel').classList.contains('hidden'));
 // Wrong captures never erase earned points or complete an objective.
 if(mode===4)click('#arcadeAction');
 if(mode!==2)click('[data-arcade-lane="'+((+ $('[data-arcade-preview][data-match="true"]').dataset.arcadePreview+1)%3)+'"]');
 pump(7);assert.equal($('#arcadeCount').textContent,'0 / '+total);assert.equal($('#arcadeScore').textContent,'0');
 click('#arcadeRetry');assert.equal(frames.size,1,'Retry owns exactly one animation loop');click('#arcadeLaunch');pump(.04);
 if(mode===4){assert.match($('#arcadeTarget').textContent,/Primer ensayo/);click('#arcadeAction');assert.match($('#arcadeStatus').textContent,/inclinación/)}
 let count=0;
 while($('#finish').disabled){
  assert(++count<20,'Circuit must be finishable: '+mode+' '+$('#arcadeStatus').textContent);
  const before=$('#arcadeCount').textContent,target=+$('[data-arcade-preview][data-match="true"]').dataset.arcadePreview;
  if(mode===2){
   let attempts=0;
   while(+$('[data-arcade-lane].chosen').dataset.arcadeLane!==target){assert(++attempts<100);const current=+$('[data-arcade-lane].chosen').dataset.arcadeLane;click('[data-arcade-lane="'+(target===1?(current===0?2:0):target)+'"]');pump(.04)}
   click('#arcadeAction');
  }else click('[data-arcade-lane="'+target+'"]');
  if(mode===5){pump(2);click('#arcadeAction')}
  let wait=0;while(!$('#arcadeWindow').classList.contains('ready')){assert(++wait<200);pump(.04)}
  if(mode===1||mode===0||mode===4)click('#arcadeAction');
  let tail=0;while($('#arcadeCount').textContent===before&&$('#finish').disabled){assert(++tail<90,'Capture should succeed: '+mode+' '+$('#arcadeStatus').textContent);pump(.04)}
 }
 assert.equal($('#arcadeCount').textContent,total+' / '+total);assert(+$('#arcadeScore').textContent>0);
 const points=$('#arcadeScore').textContent;click('#stop');assert.equal(frames.size,0);assert.equal($('#arcadeScore').textContent,points);click('#stopDebrief');
 for(let q=0;q<5;q++){click('[data-answer="'+((mode+q)%2)+'"]');click('#nextQ')}
 assert.equal(d.querySelectorAll('.badge.earned').length,0,'Practice must preserve campaign progress');
 console.log('PASS level '+level+', circuit '+mode+': tutorial, pause, errors, retries, completion, stop, progress');
}
}
// Campaign uses the same circuit but actually records the completed day.
click('[data-day="0"]');click('[data-practice="0"]');click('#tutorialReady');click('#inspect');click('#operator');click('#fit');click('#enter');click('#observe');
for(let q=0;q<5;q++){click('[data-answer="'+q%2+'"]');click('#nextQ')}
assert.equal(d.querySelectorAll('.badge.earned').length,1);assert.equal($('[data-day="1"]').disabled,false);
assert.equal(errors.length,0,errors.map(e=>e.stack).join('\n'));dom.window.close();console.log('PASS campaign unlock and no runtime errors');
