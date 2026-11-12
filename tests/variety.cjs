const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
let frames=new Map(),seq=0,time=0,errors=[];
const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
const dom=new JSDOM(html,{runScripts:'dangerously',url:'file:///camp/index.html',virtualConsole:vc,beforeParse(w){
 w.scrollTo=()=>{};w.matchMedia=()=>({matches:false});w.confirm=()=>true;
 w.requestAnimationFrame=fn=>{frames.set(++seq,fn);return seq};w.cancelAnimationFrame=id=>frames.delete(id);
 w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(_,key)=>key==='measureText'?()=>({width:90}):key==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
}});
const w=dom.window,d=w.document,$=s=>{const el=d.querySelector(s);assert(el,'Missing '+s);return el},click=s=>$(s).click();
function pump(seconds){for(let j=0;j<Math.ceil(seconds/.02);j++){time+=20;let f=[...frames.values()];frames.clear();f.forEach(fn=>fn(time))}}
let pressed=new Set();
function setKeys(keys=[]){const next=new Set(keys);for(const k of pressed)if(!next.has(k))d.body.dispatchEvent(new w.KeyboardEvent('keyup',{key:k,bubbles:true}));for(const k of next)if(!pressed.has(k))d.body.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));pressed=next}
function tap(k){setKeys([k]);setKeys([]);pump(.02)}
function data(){return Object.fromEntries(Object.entries($('#gameTelemetry').dataset).map(([k,v])=>[k,v==='true'?true:v==='false'?false:Number(v)]))}
function enter(mode){$('#practiceStation').value=mode;click('#pulseStart');click('[data-practice="0"]');click('#tutorialReady');click('#inspect');click('#operator');click('#fit');click('#enter');assert(!d.querySelector('.velocity-session'),'No reused corridor in new games');click('#gameStart');pump(.04);assert.equal(frames.size,1);}
function stopAndReflect(mode){setKeys([]);assert.equal($('#finish').disabled,false);const score=$('#gameScore').textContent;click('#stop');assert.equal(frames.size,0);assert.equal($('#gameScore').textContent,score);click('#stopDebrief');for(let q=0;q<5;q++){click('[data-answer="'+((mode+q)%2)+'"]');click('#nextQ')}assert.equal(d.querySelectorAll('.badge.earned').length,0)}
click('#introSkip');assert.equal($('#practiceStation').options.length,6);
enter(0);tap(' ');assert.equal(data().count,0,'Unaligned orientation must fail');
tap('p');const frozen=$('#gameTelemetry').textContent;pump(2);assert.equal($('#gameTelemetry').textContent,frozen);tap('p');
for(let n=0;n<5;n++){let loops=0;while(true){const t=data(),diff=Math.atan2(Math.sin(t.target-t.angle),Math.cos(t.target-t.angle));if(Math.abs(diff)<.10)break;assert(++loops<240);setKeys([diff>0?'ArrowRight':'ArrowLeft']);pump(.02)}setKeys([]);tap(' ')}
stopAndReflect(0);console.log('PASS orientation: angular alignment, failure, pause and five locks');
enter(1);
let loops=0;
while($('#finish').disabled){assert(++loops<6000,'Moon route must be playable: '+JSON.stringify(data()));const t=data(),target=[790,1260,1800][t.count],dx=target-t.x,desired=Math.min(130,Math.max(-130,dx*1.4)),keys=[];if(t.vx<desired-7)keys.push('ArrowRight');else if(t.vx>desired+7){if(t.vx*desired>=0)keys.push('b');else keys.push('ArrowLeft')}setKeys(keys);
 if(t.ground&&Math.abs(dx)<55&&Math.abs(t.vx)<75){setKeys([]);tap(' ')}else if(t.ground&&((t.count===0&&t.x>380&&t.x<470)||(t.count===1&&t.x>860&&t.x<950)||(t.count===2&&t.x>1340&&t.x<1440))){const saved=[...keys];tap(' ');setKeys(saved)}pump(.02)}
assert.equal(data().falls,0,'Intended route clears the gaps');stopAndReflect(1);console.log('PASS platformer: three gaps, landings, braking and activated checkpoints');
enter(2);
function navigateInertia(tx,ty){let n=0;while(true){const t=data(),dx=tx-t.x,dy=ty-t.y,speed=Math.hypot(t.vx,t.vy);if(Math.hypot(dx,dy)<20&&speed<12)break;assert(++n<1800,'Workshop waypoint '+tx+','+ty+' '+JSON.stringify(t));const desiredX=Math.max(-70,Math.min(70,dx*.8)),desiredY=Math.max(-70,Math.min(70,dy*.8));if(Math.abs(dx)<20&&Math.abs(dy)<20&&speed>12)tap('b');else{if(desiredX-t.vx>10)tap('ArrowRight');if(desiredX-t.vx< -10)tap('ArrowLeft');if(desiredY-t.vy>10)tap('ArrowDown');if(desiredY-t.vy< -10)tap('ArrowUp')}pump(.10)}tap('b')}
function orient(target){for(let n=0;n<30;n++){let diff=Math.atan2(Math.sin(target-data().angle),Math.cos(target-data().angle));if(Math.abs(diff)<.12)return;tap(diff>0?'e':'q')}assert.fail('Orientation did not converge')}
tap('ArrowRight');pump(.3);assert(data().vx>17,'Momentum persists after releasing the key');tap('b');
for(let n=0;n<3;n++){if(n<2){navigateInertia(150,470);navigateInertia(890,470);navigateInertia(890,[170,400][n]);navigateInertia([730,660][n],[170,400][n])}else{navigateInertia(150,155);navigateInertia(300,155)}orient([0,Math.PI/2,Math.PI][n]);tap(' ');assert(data().carrying);if(n<2){navigateInertia(890,[170,400][n]);navigateInertia(890,470);navigateInertia(150,470)}else navigateInertia(150,155);navigateInertia(150,390);orient(0);tap(' ')}
stopAndReflect(2);console.log('PASS workshop: persistent impulses, obstacle detours, rotation and three deliveries');
enter(4);$('#designRight').value=40;$('#designRight').dispatchEvent(new w.Event('input'));click('#rocketLaunch');pump(.04);loops=0;
while($('#finish').disabled){assert(++loops<4000,'Rocket must be finishable: '+JSON.stringify(data()));const t=data(),desired=Math.max(-110,Math.min(110,(t.targetX-t.x)*1.6)),keys=[];if(t.vx<desired-8)keys.push('ArrowRight');else if(t.vx>desired+8)keys.push('ArrowLeft');if(Math.abs(t.targetX-t.x)<45&&Math.abs(t.vx)>15)keys.push(' ');setKeys(keys);pump(.02)}
setKeys([]);assert.equal(data().gate,3);stopAndReflect(4);console.log('PASS rocket: construction, steering, three rings and controlled platform arrival');
enter(5);
function navigateWater(tx,ty){let n=0;while(true){const t=data(),dx=tx-t.x,dy=ty-t.y;if(Math.hypot(dx,dy)<24&&Math.hypot(t.vx,t.vy)<35)break;assert(++n<1500,'ROV waypoint '+tx+','+ty+' '+JSON.stringify(t));const keys=[],desiredX=Math.max(-95,Math.min(95,dx*.9)),desiredY=Math.max(-95,Math.min(95,dy*.9));if(t.vx<desiredX-13)keys.push('ArrowRight');if(t.vx>desiredX+13)keys.push('ArrowLeft');if(t.vy<desiredY-13)keys.push('ArrowDown');if(t.vy>desiredY+13)keys.push('ArrowUp');setKeys(keys);pump(.04)}setKeys([]);pump(.3)}
setKeys(['ArrowRight']);pump(.3);setKeys([]);const speed=data().vx;pump(1);assert(data().vx<speed*.3,'Water slows the robot when motors are released');
for(let n=0;n<2;n++){navigateWater(145,465);navigateWater(890,465);navigateWater(890,[420,145][n]);navigateWater([760,740][n],[420,145][n]);tap(' ');assert(data().carrying);navigateWater(890,[420,145][n]);navigateWater(890,465);navigateWater(145,465);navigateWater(145,170);tap(' ')}
stopAndReflect(5);console.log('PASS ROV: drag, obstacle detours, two recovered instruments and delivery');
enter(0);click('#laboratoryMode');assert(d.querySelector('#supports'));click('#returnCircuit');assert(d.querySelector('#gyroLock'));assert.equal(frames.size,1);click('#gameRetry');assert.equal(frames.size,1);click('#back');assert.equal(frames.size,0);
click('[data-day="0"]');click('[data-practice="0"]');click('#tutorialReady');click('#inspect');click('#operator');click('#fit');click('#enter');click('#observe');for(let q=0;q<5;q++){click('[data-answer="'+q%2+'"]');click('#nextQ')}assert.equal(d.querySelectorAll('.badge.earned').length,1);assert.equal($('[data-day="1"]').disabled,false);
assert.equal(errors.length,0,errors.map(e=>e.stack).join('\n'));dom.window.close();console.log('PASS scene cleanup, original simulators, campaign progress and zero runtime errors');
