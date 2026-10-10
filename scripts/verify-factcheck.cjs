const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, 'chapters', name + '.html'), 'utf8');
function fn(source, name) {
  const start = source.indexOf('  function ' + name + '(');
  assert(start >= 0, name);
  const end = source.indexOf('\n  }', start);
  assert(end >= 0, name);
  return source.slice(start, end + 4);
}
let checks = 0;
function close(a, b, tolerance = 1e-10) { assert(Math.abs(a - b) <= tolerance, `${a} != ${b}`); checks++; }
// NET-01: enumerate the probability of every possible flip count independently.
const signal = read('signal');
const expression = signal.match(/const p1 = Q\(1 \/ sg\), pN = ([^;]+);/)[1];
for (const N of [1, 2, 3, 10, 30]) for (const p1 of [0, 1e-12, 0.01, 0.1, 0.4, 0.5]) {
  let binomial = 0, coefficient = 1;
  for (let k = 0; k <= N; k++) {
    if (k % 2) binomial += coefficient * p1 ** k * (1 - p1) ** (N - k);
    coefficient *= (N - k) / (k + 1);
  }
  const actual = vm.runInNewContext(expression, {N, p1});
  close(actual, binomial, 3e-15); assert(actual >= 0 && actual <= 0.5);
}
// NET-04: normal probabilities from independent numerical integration, not erfc approximation.
const mod = read('modulation');
const context = vm.createContext({});
vm.runInContext(mod.slice(mod.indexOf('  const gray ='), mod.indexOf('  function conRun()')) + '\nthis.ber = conBer;', context);
const cdfCache = new Map();
function cdf(z) {
  if (z === Infinity || z > 12) return 1;
  if (z === -Infinity || z < -12) return 0;
  if (cdfCache.has(z)) return cdfCache.get(z);
  const n = 2400, h = (z + 12) / n, density = (x) => Math.exp(-x*x/2) / Math.sqrt(2*Math.PI);
  let sum = density(-12) + density(z);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * density(-12+i*h);
  const result = sum*h/3; cdfCache.set(z,result); return result;
}
function integratedBer(M, snr) {
  if (M === 2) return cdf(-Math.sqrt(2*snr));
  const levels = Math.sqrt(M), bits = Math.log2(levels), scale = Math.sqrt(3/(2*(M-1)));
  const sigma = Math.sqrt(1/(2*snr)); let error = 0;
  for (let sent=0; sent<levels; sent++) for(let got=0; got<levels; got++) {
    const x=(2*sent-levels+1)*scale;
    const low=got===0 ? -Infinity : (2*got-levels)*scale;
    const high=got===levels-1 ? Infinity : (2*got-levels+2)*scale;
    const probability=cdf((high-x)/sigma)-cdf((low-x)/sigma);
    const a=sent^(sent>>>1), b=got^(got>>>1);
    for (let bit=0;bit<bits;bit++) if (((a>>>bit)&1)!==((b>>>bit)&1)) error+=probability;
  }
  return error/(levels*bits);
}
for (const M of [2, 4, 16, 64, 256, 1024, 4096]) for(const db of [-20, 0, 10, 20, 35, 50]) {
  const snr=10**(db/10), actual=context.ber(M,snr);
  close(actual,integratedBer(M,snr),1e-7); assert(actual>=0 && actual<=0.5+1e-7);
}
assert(context.ber(4096,1) > 0.3); checks++;
// NET-02: actual link model with every input combination and independent unamplified budget.
const optical = read('optical');
const state = {tx:0, km:400, wl:'0.35', con:4, sens:-24, amp:true};
const bc = vm.createContext({MARGIN:3, bdTx:()=>state.tx, bdKm:()=>state.km, bdWl:()=>state.wl,
  bdCon:()=>state.con, bdRx:()=>String(state.sens), $:()=>({checked:state.amp})});
vm.runInContext(fn(optical,'bdModel')+'\nthis.model=bdModel;',bc);
let budgets=0;
for(const tx of [-6,0,10])for(const km of [1,60,200,400])for(const wl of ['0.35','0.2'])for(const con of [0,4,10])for(const sens of [-14,-24])for(const amp of [false,true]) {
  Object.assign(state,{tx,km,wl,con,sens,amp}); const m=bc.model();
  if(!amp||wl==='0.35') { assert.equal(m.amps,0); close(m.rx,tx-(Number(wl)+.025)*km-.5*con); }
  if(wl==='0.35')assert.equal(m.edfaSupported,false);
  if(m.amps) { assert.equal(wl,'0.2'); assert(m.rx >= sens+3-1e-9); }
  assert(m.pts.every(p=>p.every(Number.isFinite))); budgets++;
}
// NET-03: actual switch reset callback, including its visible statistics.
const eth=read('ethernet'); let offered=1.6; const stats={};
const ec=vm.createContext({csN:()=>8,csG:()=>offered,csMode:()=> 'sw',csCurve:[],
  makeSim:()=>({}),NB:{stat:(id,value)=>stats[id]=value}});
vm.runInContext(fn(eth,'csReset')+'\nthis.reset=csReset;',ec);
for(const g of [.1,.5,1,1.2,1.6]) { offered=g; ec.reset(); assert.equal(parseInt(stats['cs-o-thr']),Math.round(Math.min(g,1)*100)); checks++; }
assert(stats['cs-o-wait'].includes('과부하'));
// NET-06: temperature, threshold and optical output must refer to the same junction.
const photo=read('photonics');
const pc=vm.createContext({});
vm.runInContext(photo.slice(photo.indexOf('  const ITH0 ='),photo.indexOf('  const liI ='))+'\nthis.laser=laserP;',pc);
let laserCases=0;
for(const temp of [20,25,55,85,95])for(let i=0;i<=100;i+=.25){
 const r=pc.laser(i,temp); close(r.ith,10*Math.exp((r.T-25)/55));
 close(r.T,temp+.08*Math.max(0,1.2*i-r.P)); assert(r.P>=0&&r.P<=1.2*i+1e-9); laserCases++;
}
const hot=pc.laser(30,85); assert(hot.ith>30); close(hot.P,.004*30);
assert(photo.includes('I <= ith ?')); assert(photo.includes('광 출력(L)과 구동 전류(I)'));
assert(!photo.includes('자체 발열로 곡선이 꺾여 내려온다'));
// NET-08: queued load-balancer jobs must survive worker completion.
const cloud=read('cloud'); const qc=vm.createContext({});
vm.runInContext(fn(cloud,'drainJobs')+'\nthis.drain=drainJobs;',qc);
let completed=[];
const server={done:0,busy:[{arr:0,svc:1,end:1}],q:[{arr:.5,svc:1},{arr:.6,svc:1}]};
qc.drain(server,1.5,j=>completed.push(j)); assert.equal(server.done,1);
assert.equal(server.busy.length,1); assert.equal(server.q.length,1); close(server.busy[0].end,2);
qc.drain(server,3,j=>completed.push(j)); assert.equal(server.done,3); assert.equal(server.busy.length,0);
const late={done:0,busy:[{arr:0,svc:1,end:1}],q:[{arr:1.8,svc:.4}]};
qc.drain(late,2,j=>{}); close(late.busy[0].end,2.2);
const parallel={done:0,busy:[{arr:0,svc:2,end:2},{arr:0,svc:1,end:1}],q:[{arr:.5,svc:.2},{arr:.6,svc:1}]};
qc.drain(parallel,1.5,j=>{}); assert.equal(parallel.done,2); assert.equal(parallel.busy.length,2);
close(parallel.busy[0].end,2);close(parallel.busy[1].end,2.2);
// Every chapter script must still parse; metadata must remain valid JSON.
let scripts=0, chapters=0;
for(const file of fs.readdirSync(path.join(root,'chapters')).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,'chapters',file),'utf8');chapters++;
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(match[1].includes('application/ld+json'))JSON.parse(match[2]);
  else if(match[2].trim()){new vm.Script(match[2],{filename:file});scripts++;}
 }
}
console.log(JSON.stringify({checks,budgets,laserCases,chapters,scripts,grayQamCases:42,flipCases:30}));
