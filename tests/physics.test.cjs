// Ejecutar con Node.js 18 o posterior: node --test tests/physics.test.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const js=html.split('<script>')[1].split('</script>')[0];
const context={window:{}};
vm.createContext(context);
// Se ejecuta la implementación real contenida en index.html, sin duplicarla.
vm.runInContext(js.slice(js.indexOf('const Physics='),js.indexOf('const $=')),context);
const P=context.window.Physics;
for(const m of [20,40,60,80,118])test(`Silla 1/6: masa ${m} kg, descarga 5/6 del peso`,()=>{
 const q=P.moon(m);assert.equal(q.mass,m);
 assert.ok(Math.abs(q.apparentWeight-m*9.81/6)<1e-9);
 assert.ok(Math.abs(q.support-m*9.81*5/6)<1e-9);
 assert.ok(Math.abs(q.support+q.apparentWeight-m*9.81)<1e-9);
});
test('5DF conserva cantidad de movimiento sin fuerzas ni contactos',()=>{
 const b=P.body();P.impulse(b,12,-6);for(let i=0;i<600;i++)P.step(b,1/60);
 assert.ok(Math.abs(b.vx*b.m-12)<1e-12);assert.ok(Math.abs(b.vy*b.m+6)<1e-12);
 assert.ok(Math.abs(b.x-(.17+.2*10))<1e-10);assert.ok(Math.abs(b.y-(.73-.1*10))<1e-10);
 P.impulse(b,-12,6);assert.equal(b.vx,0);assert.equal(b.vy,0);
});
test('5DF bloquea la vertical incluso con impulso vertical',()=>{
 const b=P.body();b.z=4;b.vz=3;P.impulse(b,0,0,100);P.step(b,10);assert.equal(b.z,0);assert.equal(b.vz,0);
});
test('5DF mantiene tres rotaciones independientes',()=>{
 const b=P.body();b.w=[.1,-.2,.3];P.step(b,2);[.2,-.4,.6].forEach((a,i)=>assert.ok(Math.abs(b.a[i]-a)<1e-12));assert.equal(b.z,0);
});
test('La aceleración por igual impulso horizontal depende de la masa',()=>{
 const a=P.body(),b=P.body();b.m=120;P.impulse(a,12,0);P.impulse(b,12,0);assert.equal(a.vx,.2);assert.equal(b.vx,.1);
});
test('Salto ideal con soporte constante conserva masa y reduce aceleración vertical',()=>{
 const j=P.jump(60,2);assert.equal(j.mass,60);assert.equal(j.acceleration,9.81/6);
 assert.ok(Math.abs(j.height/(4/(2*9.81))-6)<1e-12);assert.ok(Math.abs(j.duration/(4/9.81)-6)<1e-12);
});
