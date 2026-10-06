const $=s=>document.querySelector(s),D=Math.PI/180,SQ=Math.sqrt(3),PI=Math.PI;
const T={
h1:{t:'1φ half-wave',N:1,sp:360,p0:0,ph:1,u:(k,t)=>Math.sin(t),on:[['1']],fl:()=>'M50 115V50H330V95M330 165V210H50V145',info:'One pulse per cycle. Textbook Vdc = Vm(1+cosα)/2π for an R load. With L, the device keeps conducting past 180° until current falls to zero (extinction angle β).'},
f1:{t:'1φ full-wave (bridge)',N:2,sp:180,p0:0,ph:1,u:(k,t)=>k?-Math.sin(t):Math.sin(t),on:[['1','2'],['3','4']],fl:k=>k?'M195 130H260L180 60H340V95M340 165V200H180L100 130H165':'M165 130H100L180 60H340V95M340 165V200H180L260 130H195',info:'Two pulses per cycle. With continuous conduction Vdc = (2Vm/π)cosα. For α>90° and large L the bridge works as a line-commutated inverter (negative Vdc).'},
h3:{t:'3φ half-wave',N:3,sp:120,p0:30,ph:3,u:(k,t)=>Math.sin(t-2*PI*k/3),on:[['1'],['2'],['3']],fl:k=>{const x=70+70*k;return `M${x} 145V50H340V95M340 165V215H${x}V175`},info:'Three pulses per cycle; each device conducts up to 120°. Natural firing point is 30° after the phase zero-crossing. CCM: Vdc = (3√3·Vm/2π)cosα.'},
f3:{t:'3φ full-wave (6-pulse bridge)',N:6,sp:60,p0:30,ph:3,u:(k,t)=>SQ*Math.sin(t+PI/6-PI*k/3),on:[['1','6'],['1','2'],['3','2'],['3','4'],['5','4'],['5','6']],fl:k=>{const p='aabbcc'[k],n='bcca ab'.replace(' ','')[k];return F3.o[p]+`V30H370V115M370 185V270H${F3.x[n]}V${F3.y[n]}`+F3.i[n]},info:'Six pulses per cycle, output follows the line-line voltage envelope (grey). CCM: Vdc = (3√3·Vm/π)cosα ≈ 1.654·Vm·cosα. Each pair conducts 60° (CCM).'}};
const F3={o:{a:'M60 150H150',b:'M60 128H145q5-9 10 0H220',c:'M60 106H145q5-9 10 0H215q5-9 10 0H290'},i:{a:'H60',b:'H155q-5-9 -10 0H60',c:'H225q-5-9 -10 0H155q-5-9 -10 0H60'},x:{a:150,b:220,c:290},y:{a:150,b:128,c:106}};
let topo='f3',thy=true,res,cur=0,play=true,dirty=true;
const wp=d=>`<path class="w" d="${d}"/>`;
const sc=(x,y,l,id)=>`<circle class="w hb" id="${id}" cx="${x}" cy="${y}" r="15" fill="var(--card)"/><path class="w" d="M${x-8} ${y}q4-9 8 0t8 0"/><text class="t" x="${x}" y="${y+28}" text-anchor="middle">${l}</text>`;
const ld=(x,y)=>`<rect class="w hb" id="ld" x="${x-20}" y="${y-35}" width="40" height="70" rx="4" fill="var(--card)"/><text class="t" x="${x}" y="${y+4}" text-anchor="middle">R-L</text><text class="t" x="${x+25}" y="${y-38}">+</text>`;
const dv=(id,x,y,r,lx,ly,an)=>`<g class="d" id="d${id}" transform="translate(${x} ${y}) rotate(${r})"><path d="M-14 0H-9M9 0H14M-9-8V8L9 0ZM9-8V8"/>${thy?'<path d="M1 4L8 12H13"/>':''}</g><text class="t" x="${lx}" y="${ly}" text-anchor="${an||'start'}">${thy?'T':'D'}${id}</text>`;
function schem(){let s;
if(topo=='h1')s=`<svg viewBox="0 0 380 240">${wp('M50 115V50H330V95M330 165V210H50V145')}${sc(50,130,'vs','sc0')}${ld(330,130)}${dv(1,115,50,0,115,34,'middle')}</svg>`;
if(topo=='f1')s=`<svg viewBox="0 0 400 250">${wp('M100 130L180 60L260 130L180 200ZM100 130H165M195 130H260M180 60H340V95M340 165V200H180')}${sc(180,130,'vs','sc0')}${ld(340,130)}${dv(1,140,95,-41,128,86,'end')}${dv(3,220,95,-139,232,86)}${dv(2,220,165,-41,232,182)}${dv(4,140,165,-139,128,182,'end')}</svg>`;
if(topo=='h3')s=`<svg viewBox="0 0 400 240">${wp('M70 145V50M140 145V50M210 145V50M70 50H340V95M340 165V215H70M70 175V215M140 175V215M210 175V215')}${sc(70,160,'a','sc0')}${sc(140,160,'b','sc1')}${sc(210,160,'c','sc2')}${ld(340,130)}${[1,2,3].map((i,j)=>dv(i,70+70*j,100,-90,84+70*j,104)).join('')}</svg>`;
if(topo=='f3')s=`<svg viewBox="0 0 420 290">${wp('M150 30V270M220 30V270M290 30V270M150 30H370V115M370 185V270H150M60 150H150M60 128H145q5-9 10 0H220M60 106H145q5-9 10 0H215q5-9 10 0H290')}<rect class="w hb" id="sc0" x="14" y="88" width="46" height="74" rx="4" fill="var(--card)"/><text class="t" x="37" y="130" text-anchor="middle">3φ AC</text><text class="t" x="66" y="146">a</text><text class="t" x="66" y="124">b</text><text class="t" x="66" y="102">c</text>${[[150,150],[220,128],[290,106]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="var(--fg)"/>`).join('')}${ld(370,150)}${[[1,150],[3,220],[5,290]].map(p=>dv(p[0],p[1],75,-90,p[1]+14,79)).join('')}${[[4,150],[6,220],[2,290]].map(p=>dv(p[0],p[1],210,-90,p[1]+14,214)).join('')}</svg>`;
s=s.replace(/(<svg[^>]*>)(<path[^>]*\/>)/,'$1$2<g id="fg"></g>');$('#sch').innerHTML=s;$('#info').textContent=T[topo].info}
function sim(){const o=T[topo],Vm=+$('#vm').value,R=+$('#r').value,L=+$('#l').value/1000,al=thy?+$('#al').value:0,M=1440,C=90,dt=1/(M*50),a=L>1e-7?Math.exp(-R*dt/L):0;
const fi=[];for(let k=0;k<o.N;k++)fi.push(Math.round(((o.p0+al+o.sp*k)%360)*4)%M);
let st=-1,i=0;const vo=new Float32Array(M),io=new Float32Array(M),sk=new Int8Array(M);
for(let n=1;n<=M*C;n++){const m=n%M,t=m*.25*D;
for(let k=0;k<o.N;k++)if(fi[k]===m&&st!==k){const uc=st<0?0:Vm*o.u(st,t);if(Vm*o.u(k,t)>=uc-1e-6)st=k}
let v=0;if(st>=0){const u=Vm*o.u(st,t);i=u/R+(i-u/R)*a;if(i<0){i=0;st=-1}else v=u}
if(n>M*(C-1)){vo[m]=v;io[m]=i;sk[m]=st}}
const mean=f=>f.reduce((s,x)=>s+x,0)/M,rms=f=>Math.sqrt(f.reduce((s,x)=>s+x*x,0)/M);
const vdc=mean(vo),vr=rms(vo),idc=mean(io),ir=rms(io),dcm=sk.some(x=>x<0),c=Math.cos(al*D);
const th={h1:L<1e-6?Vm*(1+c)/(2*PI):null,f1:2*Vm/PI*c,h3:3*SQ*Vm/(2*PI)*c,f3:3*SQ*Vm/PI*c}[topo];
res={vo,io,sk,fi,Vm,al,vdc,vr,idc,ir,dcm,th};
const f=(x,u,d=1)=>isFinite(x)?x.toFixed(d)+' '+u:'—';
const rf=Math.abs(vdc)>1e-3?Math.sqrt(Math.max(0,(vr/vdc)**2-1)):NaN;
const mm=[['Vdc',f(vdc,'V')],['Vrms',f(vr,'V')],['Idc',f(idc,'A',2)],['Irms',f(ir,'A',2)],['Ripple factor',isFinite(rf)?rf.toFixed(3):'—'],['Conduction',dcm?'Discontinuous':'Continuous'],['Textbook Vdc',th==null?'—':f(th,'V')],['Pdc (Vdc·Idc)',f(vdc*idc,'W',0)]];
$('#mt').innerHTML=mm.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');dirty=true}
function hl(){document.querySelectorAll('.d.on,.hb.on').forEach(e=>e.classList.remove('on'));const o=T[topo],fg=$('#fg'),k=res.sk[Math.round(cur*4)%1440];fg.innerHTML='';if(k<0)return;
fg.innerHTML=[].concat(o.fl(k)).map(d=>`<path class="fl" d="${d}"/>`).join('');
o.on[k].forEach(i=>{const e=$('#d'+i);e&&e.classList.add('on')});$('#ld').classList.add('on');$(topo=='h3'?'#sc'+k:'#sc0').classList.add('on')}
function draw(){const cv=$('#cv'),w=cv.parentNode.clientWidth-24,h=Math.max(500,Math.min(720,w*.85)),r=devicePixelRatio||1;
cv.width=w*r;cv.height=h*r;cv.style.height=h+'px';const g=cv.getContext('2d');g.scale(r,r);
const cs=getComputedStyle(document.documentElement),col=n=>cs.getPropertyValue(n).trim(),fg=col('--fg'),mut=col('--mut'),ln=col('--ln'),ac=col('--ac');
const pc=[col('--a'),col('--b'),col('--c')],o=T[topo],X0=54,X1=w-10,x=d=>X0+(X1-X0)*d/360,M=1440;
g.font='11px system-ui,sans-serif';const Vm=res.Vm,vmax=Vm*(topo=='f3'?1.8:1.15),gap=12,strip=30,axis=20,avail=h-strip-axis-gap*3-6,hs=[.3,.36,.34].map(f=>f*avail);
const imax=Math.max(.1,...res.io)*1.2,P=[{t:'Source (V)',lo:-vmax,hi:vmax},{t:'vo (V)',lo:-vmax,hi:vmax},{t:'io (A)',lo:0,hi:imax}];
let y=6;const ys=[];
P.forEach((p,j)=>{p.y0=y;p.h=hs[j];ys.push(y);
g.strokeStyle=ln;g.lineWidth=1;g.fillStyle=mut;g.strokeRect(X0,y,X1-X0,p.h);
for(let d=60;d<360;d+=60){g.beginPath();g.moveTo(x(d),y);g.lineTo(x(d),y+p.h);g.stroke()}
const y0=y,yy=v=>y0+p.h*(1-(v-p.lo)/(p.hi-p.lo));p.yy=yy;
g.beginPath();g.moveTo(X0,yy(0));g.lineTo(X1,yy(0));g.strokeStyle=mut;g.stroke();
g.textAlign='right';g.fillText(p.hi.toFixed(p.hi>20?0:1),X0-4,y+10);if(p.lo<0)g.fillText(p.lo.toFixed(0),X0-4,y+p.h-2);g.fillText('0',X0-4,yy(0)+4);
g.textAlign='left';g.fillText(p.t,X0+6,y+12);y+=p.h+gap});
const tr=(p,f,c,lw,dash)=>{g.beginPath();for(let d=0;d<=360;d+=1){const v=f(d*D),X=x(d),Y=p.yy(v);d?g.lineTo(X,Y):g.moveTo(X,Y)}g.strokeStyle=c;g.lineWidth=lw;g.setLineDash(dash||[]);g.stroke();g.setLineDash([])};
if(topo=='f3')for(let k=0;k<6;k++)tr(P[0],t=>Vm*o.u(k,t),ln,1);
if(o.ph==1)tr(P[0],t=>Vm*Math.sin(t),pc[0],2);else for(let k=0;k<3;k++)tr(P[0],t=>Vm*Math.sin(t-2*PI*k/3),pc[k],2);
const arr=(p,a,c,fill)=>{g.beginPath();for(let m=0;m<=M;m++){const X=x(m/4),Y=p.yy(a[m%M]);m?g.lineTo(X,Y):g.moveTo(X,Y)}g.strokeStyle=c;g.lineWidth=2;g.stroke();if(fill){g.lineTo(X1,p.yy(0));g.lineTo(X0,p.yy(0));g.closePath();g.globalAlpha=.15;g.fillStyle=c;g.fill();g.globalAlpha=1}};
arr(P[1],res.vo,ac,1);arr(P[2],res.io,col('--io'),1);
g.setLineDash([5,4]);g.strokeStyle=mut;g.beginPath();g.moveTo(X0,P[1].yy(res.vdc));g.lineTo(X1,P[1].yy(res.vdc));g.stroke();g.fillStyle=mut;g.textAlign='right';g.fillText('Vdc = '+res.vdc.toFixed(1),X1-4,P[1].yy(res.vdc)-4);
g.beginPath();g.moveTo(X0,P[2].yy(res.idc));g.lineTo(X1,P[2].yy(res.idc));g.stroke();g.fillText('Idc = '+res.idc.toFixed(2),X1-4,P[2].yy(res.idc)-4);
if(thy)res.fi.forEach(f=>{const X=x(f/4);g.beginPath();g.moveTo(X,6);g.lineTo(X,y-gap);g.strokeStyle=ac;g.globalAlpha=.4;g.stroke();g.globalAlpha=1});g.setLineDash([]);
// conduction strip
const sy=y,pal=[...pc,col('--io'),ac,mut],pre=thy?'T':'D';g.strokeStyle=ln;g.strokeRect(X0,sy,X1-X0,strip);
let s0=0;for(let m=1;m<=M;m++){if(m==M||res.sk[m]!==res.sk[s0]){const k=res.sk[s0];if(k>=0){g.fillStyle=pal[k%pal.length];g.globalAlpha=.75;g.fillRect(x(s0/4),sy,x(m/4)-x(s0/4),strip);g.globalAlpha=1;if(x(m/4)-x(s0/4)>30){g.fillStyle='#fff';g.textAlign='center';g.fillText(o.on[k].map(i=>pre+i).join(','),(x(s0/4)+x(m/4))/2,sy+19)}}s0=m}}
g.fillStyle=mut;g.textAlign='right';g.fillText('on',X0-4,sy+19);
g.textAlign='center';for(let d=0;d<=360;d+=60)g.fillText(d+'°',x(d),sy+strip+14);
const m=Math.round(cur*4)%M,X=x(cur);g.strokeStyle=fg;g.lineWidth=1.2;g.beginPath();g.moveTo(X,6);g.lineTo(X,sy+strip);g.stroke();
g.fillStyle=ac;[[1,res.vo[m]],[2,res.io[m]]].forEach(q=>{g.beginPath();g.arc(X,P[q[0]].yy(q[1]),4,0,7);g.fill()});
const k=res.sk[m];$('#ro').textContent=`ωt = ${cur.toFixed(0)}°   vo = ${res.vo[m].toFixed(1)} V   io = ${res.io[m].toFixed(2)} A   conducting: ${k>=0?o.on[k].map(i=>pre+i).join(' + '):'none'}`}
// UI
$('#tabs').innerHTML=Object.keys(T).map(k=>`<button data-k="${k}">${T[k].t}</button>`).join('');
$('#tabs').onclick=e=>{const k=e.target.dataset.k;if(!k)return;topo=k;ui()};
function ui(){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k==topo));$('#bd').classList.toggle('on',!thy);$('#bt').classList.toggle('on',thy);$('#al').disabled=!thy;schem();upd();sim()}
function upd(){[['al','°'],['vm',' V'],['r',' Ω'],['l',' mH']].forEach(p=>$('#'+p[0]).nextElementSibling.textContent=$('#'+p[0]).value+p[1])}
['al','vm','r','l'].forEach(i=>$('#'+i).oninput=()=>{upd();sim()});
$('#bd').onclick=()=>{thy=false;ui()};$('#bt').onclick=()=>{thy=true;ui()};
$('#pr').onclick=()=>{$('#l').value=0;upd();sim()};$('#pl').onclick=()=>{$('#l').value=1000;upd();sim()};
$('#pp').onclick=()=>{play=!play;$('#pp').textContent=play?'Pause':'Play'};
$('#sc').oninput=e=>{cur=+e.target.value;play=false;$('#pp').textContent='Play';dirty=true};
addEventListener('resize',()=>dirty=true);
function loop(){if(play){cur=(cur+1.5)%360;$('#sc').value=cur;dirty=true}if(dirty){draw();hl();dirty=false}requestAnimationFrame(loop)}
ui();
requestAnimationFrame(loop);
