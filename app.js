const $=s=>document.querySelector(s),D=Math.PI/180,SQ=Math.sqrt(3),PI=Math.PI;
const T={
h1:{t:'1φ half-wave',N:1,p:1,sp:360,p0:0,ph:1,u:(k,t)=>Math.sin(t),on:[['1']],fl:()=>'M50 115V50H330V95M330 165V210H50V145',info:'One pulse per cycle. Textbook Vdc = Vm(1+cosα)/2π for an R load. With L, the device keeps conducting past 180° until current falls to zero (extinction angle β).'},
f1:{t:'1φ full-wave (bridge)',N:2,p:2,sp:180,p0:0,ph:1,u:(k,t)=>k?-Math.sin(t):Math.sin(t),on:[['1','2'],['3','4']],fl:k=>k?'M195 130H260L180 60H340V95M340 165V200H180L100 130H165':'M165 130H100L180 60H340V95M340 165V200H180L260 130H195',info:'Two pulses per cycle. With continuous conduction Vdc = (2Vm/π)cosα. For α>90° it can only run as a line-commutated inverter (negative Vdc) if the load has an EMF E<0, e.g. a regenerating DC machine.'},
h3:{t:'3φ half-wave',N:3,p:3,sp:120,p0:30,ph:3,u:(k,t)=>Math.sin(t-2*PI*k/3),on:[['1'],['2'],['3']],fl:k=>{const x=70+70*k;return `M${x} 145V50H340V95M340 165V215H${x}V175`},info:'Three pulses per cycle; each device conducts up to 120°. Natural firing point is 30° after the phase zero-crossing. CCM: Vdc = (3√3·Vm/2π)cosα.'},
f3:{t:'3φ full-wave (6-pulse bridge)',N:6,p:6,sp:60,p0:30,ph:3,u:(k,t)=>SQ*Math.sin(t+PI/6-PI*k/3),on:[['1','6'],['1','2'],['3','2'],['3','4'],['5','4'],['5','6']],fl:k=>{const p='aabbcc'[k],n='bcca ab'.replace(' ','')[k];return F3.o[p]+`V30H370V115M370 185V270H${F3.x[n]}V${F3.y[n]}`+F3.i[n]},info:'Six pulses per cycle, output follows the line-line voltage envelope (grey). CCM: Vdc = (3√3·Vm/π)cosα ≈ 1.654·Vm·cosα. Each pair conducts 60° (CCM).'}};
const F3={o:{a:'M60 150H150',b:'M60 128H145q5-9 10 0H220',c:'M60 106H145q5-9 10 0H215q5-9 10 0H290'},i:{a:'H60',b:'H155q-5-9 -10 0H60',c:'H225q-5-9 -10 0H155q-5-9 -10 0H60'},x:{a:150,b:220,c:290},y:{a:150,b:128,c:106}};
const Q=8,mod=(i,n)=>((i%n)+n)%n;let view={a:0,b:360},fitY=false,mode='';
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
const IDEAL=(t,V,a)=>{const c=Math.cos(a*D);return{h1:V*(1+c)/(2*PI),f1:2*V/PI*c,h3:3*SQ*V/(2*PI)*c,f3:3*SQ*V/PI*c}[t]};
const RLOAD=(t,V,a)=>{const c=Math.cos(a*D);return{h1:V*(1+c)/(2*PI),f1:V*(1+c)/PI,h3:a>=150?0:a<=30?3*SQ*V/(2*PI)*c:3*V/(2*PI)*(1+Math.cos((a+30)*D)),f3:a>=120?0:a<=60?3*SQ*V/PI*c:3*SQ*V/PI*(1+Math.cos((a+60)*D))}[t]};
function sim(){const o=T[topo],Vm=+$('#vm').value,R=+$('#r').value,L=+$('#l').value/1000,E=+$('#e').value,al=thy?+$('#al').value:0,M=360*Q,dt=1/(M*50),a=L>1e-7?Math.exp(-R*dt/L):0,W=Math.min(o.sp,180)*Q;
const fi=[];for(let k=0;k<o.N;k++)fi.push(Math.round(((o.p0+al+o.sp*k)%360)*Q)%M);
const g0=IDEAL(topo,Vm,al);let st=-1,i=0;
if(L>1e-6&&(g0-E)/R>0){i=(g0-E)/R;let b=-1e9;for(let k=0;k<o.N;k++){const u=o.u(k,0);if(u>b){b=u;st=k}}}
const vo=new Float32Array(M),io=new Float32Array(M),sk=new Int8Array(M);
let acc=0,prev=1e9,cy=0;for(let n=1;n<=M*400;n++){const m=n%M,t=m/Q*D;
for(let k=0;k<o.N;k++)if(st!==k&&(!thy||mod(m-fi[k],M)<W)){const uc=st<0?E:Vm*o.u(st,t);if(Vm*o.u(k,t)>=uc-1e-7)st=k}
let v=E;if(st>=0){const u=Vm*o.u(st,t),um=Vm*o.u(st,t-.5/Q*D),e=(um-E)/R;i=e+(i-e)*a;if(i<-1e-9){i=0;st=-1}else{if(i<0)i=0;v=u}}
vo[m]=v;io[m]=i;sk[m]=st;acc+=i;if(m===0){const cm=acc/M;if(++cy>=4&&Math.abs(cm-prev)<=1e-5*Math.max(1,Math.abs(cm)))break;prev=cm;acc=0}}
const mean=f=>f.reduce((q,x)=>q+x,0)/M,rms=f=>Math.sqrt(f.reduce((q,x)=>q+x*x,0)/M);
const vdc=mean(vo),vr=rms(vo),idc=mean(io),ir=rms(io),dcm=sk.some(x=>x<0);
const th=!dcm?(o.p>1?IDEAL(topo,Vm,al):null):(L<1e-6&&E==0?RLOAD(topo,Vm,al):null);
res={vo,io,sk,fi,Vm,E,al,vdc,vr,idc,ir,dcm,th};
const f=(x,u,d=1)=>isFinite(x)?x.toFixed(d)+' '+u:'—',ok=Math.abs(vdc)>1e-3,rf=ok?Math.sqrt(Math.max(0,(vr/vdc)**2-1)):NaN;
const mm=[['Vdc',f(vdc,'V')],['Vrms',f(vr,'V')],['Idc',f(idc,'A',2)],['Irms',f(ir,'A',2)],['Form factor Vrms/Vdc',ok?(vr/vdc).toFixed(3):'—'],['Ripple factor',ok?rf.toFixed(3):'—'],['Pdc = Vdc·Idc',f(vdc*idc,'W',0)],['Ripple frequency',o.p*50+' Hz'],['Conduction',dcm?'Discontinuous':'Continuous'],['Textbook Vdc'+(th==null?'':!dcm?' (CCM)':' (R load)'),th==null?'—':f(th,'V')]];
$('#st').textContent=Math.max(...io)<1e-6?'No current flows: with these settings no device is ever forward-biased while it is gated (E too high, or α too large for this load). Lower E or α, or raise Vm.':'';
$('#mt').innerHTML=mm.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');dirty=true}
function hl(){document.querySelectorAll('.d.on,.hb.on').forEach(e=>e.classList.remove('on'));const o=T[topo],fg=$('#fg'),k=res.sk[Math.round(cur*Q)%(360*Q)];fg.innerHTML='';if(k<0)return;
fg.innerHTML=[].concat(o.fl(k)).map(d=>`<path class="fl" d="${d}"/>`).join('');
o.on[k].forEach(i=>{const e=$('#d'+i);e&&e.classList.add('on')});$('#ld').classList.add('on');$(topo=='h3'?'#sc'+k:'#sc0').classList.add('on')}
function geom(){return{X0:54,X1:$('#cv').parentNode.clientWidth-46}}
function draw(){
const cv=$('#cv'),w=cv.parentNode.clientWidth-24,h=Math.max(500,Math.min(720,w*.85)),r=devicePixelRatio||1;
cv.width=w*r;cv.height=h*r;cv.style.height=h+'px';const g=cv.getContext('2d');g.scale(r,r);
const cs=getComputedStyle(document.documentElement),col=n=>cs.getPropertyValue(n).trim(),fg=col('--fg'),mut=col('--mut'),ln=col('--ln'),ac=col('--ac'),pc=[col('--a'),col('--b'),col('--c')],o=T[topo],M=360*Q,pre=thy?'T':'D';
const{X0,X1}=geom(),A=view.a,B=view.b,span=B-A,x=d=>X0+(X1-X0)*(d-A)/span;
g.font='11px system-ui,sans-serif';
const Vm=res.Vm,vmax=Math.max(Vm*(topo=='f3'?1.8:1.15),Math.abs(res.E)*1.1),gap=12,strip=30,axis=20,avail=h-strip-axis-gap*3-6,hs=[.3,.36,.34].map(f=>f*avail);
const i0=Math.floor(A*Q),i1=Math.ceil(B*Q),sd=Math.max(1,Math.floor((i1-i0)/(2*(X1-X0))));
let vl=1e9,vh=-1e9,il=1e9,ih=-1e9,imx=.1;
for(let i=i0;i<=i1;i+=sd){const m=mod(i,M),a=res.vo[m],b=res.io[m];if(a<vl)vl=a;if(a>vh)vh=a;if(b<il)il=b;if(b>ih)ih=b}
for(let m=0;m<M;m++)if(res.io[m]>imx)imx=res.io[m];
const fit=(lo,hi)=>{const q=Math.max((hi-lo)*.15,Math.abs(hi)*.01,1e-3);return[lo-q,hi+q]};
const P=[{t:'Source (V)',lo:-vmax,hi:vmax},{t:'vo (V)',lo:-vmax,hi:vmax},{t:'io (A)',lo:0,hi:imx*1.2}];
if(fitY){[P[1].lo,P[1].hi]=fit(vl,vh);[P[2].lo,P[2].hi]=fit(il,ih)}
const steps=[1,2,5,10,15,30,45,60,90,180,360],tk=steps.find(q=>span/q<=12)||360,ticks=[];for(let d=Math.ceil(A/tk-1e-9)*tk;d<=B+1e-9;d+=tk)ticks.push(d);
const nf=v=>Math.abs(v)<1e-9?'0':Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):v.toFixed(2);
const bg=col('--card'),lab=(t,X,Y,al)=>{g.textAlign=al;const tw=g.measureText(t).width;g.globalAlpha=.85;g.fillStyle=bg;g.fillRect(al=='left'?X-3:X-tw-3,Y-11,tw+6,15);g.globalAlpha=1;g.fillStyle=mut;g.fillText(t,X,Y)};
let y=6;
P.forEach((p,j)=>{p.y0=y;p.h=hs[j];const y0=y,yy=v=>y0+p.h*(1-(v-p.lo)/(p.hi-p.lo));p.yy=yy;
g.strokeStyle=ln;g.lineWidth=1;ticks.forEach(d=>{const X=x(d);g.beginPath();g.moveTo(X,y);g.lineTo(X,y+p.h);g.stroke()});
const mid=(p.lo+p.hi)/2,ys=[p.lo,mid,p.hi];if(p.lo<0&&p.hi>0&&Math.abs(mid)>(p.hi-p.lo)*.08)ys.push(0);
g.fillStyle=mut;g.textAlign='right';ys.forEach(v=>{g.beginPath();g.moveTo(X0,yy(v));g.lineTo(X1,yy(v));g.strokeStyle=Math.abs(v)<1e-9?mut:ln;g.stroke();g.fillText(nf(v),X0-4,Math.min(y+p.h-2,Math.max(y+10,yy(v)+4)))});
g.strokeStyle=ln;g.strokeRect(X0,y,X1-X0,p.h);y+=p.h+gap});
const clip=p=>{g.save();g.beginPath();g.rect(X0,p.y0,X1-X0,p.h);g.clip()},NP=Math.ceil(X1-X0);
const tr=(p,f,c,lw)=>{g.beginPath();for(let j=0;j<=NP;j++){const Y=p.yy(f((A+span*j/NP)*D));j?g.lineTo(X0+j,Y):g.moveTo(X0,Y)}g.strokeStyle=c;g.lineWidth=lw;g.stroke()};
clip(P[0]);if(topo=='f3')for(let k=0;k<6;k++)tr(P[0],t=>Vm*o.u(k,t),ln,1);
if(o.ph==1)tr(P[0],t=>Vm*Math.sin(t),pc[0],2);else for(let k=0;k<3;k++)tr(P[0],t=>Vm*Math.sin(t-2*PI*k/3),pc[k],2);g.restore();
const arr=(p,a,c,mean,lb)=>{clip(p);g.beginPath();let f=1,lx=X0;for(let i=i0;i<=i1;i+=sd){lx=x(i/Q);const Y=p.yy(a[mod(i,M)]);f?g.moveTo(lx,Y):g.lineTo(lx,Y);f=0}
g.strokeStyle=c;g.lineWidth=2;g.stroke();g.lineTo(lx,p.yy(0));g.lineTo(x(i0/Q),p.yy(0));g.closePath();g.globalAlpha=.15;g.fillStyle=c;g.fill();g.globalAlpha=1;
g.setLineDash([5,4]);g.strokeStyle=mut;g.lineWidth=1.2;g.beginPath();g.moveTo(X0,p.yy(mean));g.lineTo(X1,p.yy(mean));g.stroke();g.setLineDash([]);lab(lb,X1-4,p.yy(mean)-4,'right');g.restore()};
arr(P[1],res.vo,ac,res.vdc,'Vdc = '+res.vdc.toFixed(1));arr(P[2],res.io,col('--io'),res.idc,'Idc = '+res.idc.toFixed(2));
P.forEach(p=>lab(p.t,X0+6,p.y0+12,'left'));
if(thy)res.fi.forEach(f=>{const b=f/Q;for(let n=Math.ceil((A-b)/360);b+360*n<=B;n++){const X=x(b+360*n);g.beginPath();g.moveTo(X,6);g.lineTo(X,y-gap);g.strokeStyle=ac;g.globalAlpha=.4;g.lineWidth=1;g.setLineDash([5,4]);g.stroke();g.setLineDash([]);g.globalAlpha=1}});
const sy=y,pal=[...pc,col('--io'),ac,mut];g.strokeStyle=ln;g.lineWidth=1;g.strokeRect(X0,sy,X1-X0,strip);
let s0=i0;for(let i=i0+1;i<=i1+1;i++)if(i>i1||res.sk[mod(i,M)]!==res.sk[mod(s0,M)]){const k=res.sk[mod(s0,M)];if(k>=0){const xa=Math.max(X0,x(s0/Q)),xb=Math.min(X1,x(Math.min(i,i1)/Q));if(xb>xa){g.fillStyle=pal[k%pal.length];g.globalAlpha=.75;g.fillRect(xa,sy,xb-xa,strip);g.globalAlpha=1;if(xb-xa>34){g.fillStyle='#fff';g.textAlign='center';g.fillText(o.on[k].map(q=>pre+q).join(','),(xa+xb)/2,sy+19)}}}s0=i}
g.fillStyle=mut;g.textAlign='right';g.fillText('on',X0-4,sy+19);g.textAlign='center';ticks.forEach(d=>g.fillText(d+'°',x(d),sy+strip+14));
const m=Math.round(cur*Q)%M,k=res.sk[m];
{const n=(cur>=A&&cur<=B)?0:Math.ceil((A-cur)/360);if(cur+360*n<=B){const X=x(cur+360*n);g.strokeStyle=fg;g.lineWidth=1.2;g.beginPath();g.moveTo(X,6);g.lineTo(X,sy+strip);g.stroke();g.fillStyle=ac;[[1,res.vo[m]],[2,res.io[m]]].forEach(q=>{const p=P[q[0]],Y=p.yy(q[1]);if(Y>=p.y0&&Y<=p.y0+p.h){g.beginPath();g.arc(X,Y,4,0,7);g.fill()}})}}
$('#ro').textContent=`ωt = ${cur.toFixed(0)}°   vo = ${res.vo[m].toFixed(1)} V   io = ${res.io[m].toFixed(2)} A   conducting: ${k>=0?o.on[k].map(i=>pre+i).join(' + '):'none'}`;
$('#vw').textContent=`view ${A.toFixed(0)}° to ${B.toFixed(0)}°  (span ${span.toFixed(0)}°)`}
// UI
$('#tabs').innerHTML=Object.keys(T).map(k=>`<button data-k="${k}">${T[k].t}</button>`).join('');
$('#tabs').onclick=e=>{const k=e.target.dataset.k;if(!k)return;topo=k;mode=='v'?apply('v'):ui()};
function ui(){document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.k==topo));$('#bd').classList.toggle('on',!thy);$('#bt').classList.toggle('on',thy);$('#al').disabled=!thy;schem();upd();sim();document.querySelectorAll('.pb').forEach(b=>b.classList.toggle('on',b.dataset.m==mode));draw();hl();dirty=false}
function upd(){[['al','°'],['vm',' V'],['r',' Ω'],['l',' mH'],['e',' V']].forEach(p=>$('#'+p[0]).nextElementSibling.textContent=$('#'+p[0]).value+p[1])}
['al','vm','r','l','e'].forEach(i=>$('#'+i).oninput=()=>{if(mode=='v'&&i=='vm')$('#e').value=PRE.v().e;else if(mode){mode='';document.querySelectorAll('.pb').forEach(b=>b.classList.remove('on'))}upd();sim()});
$('#bd').onclick=()=>{thy=false;mode='';ui()};$('#bt').onclick=()=>{thy=true;pt=true;ui()};
const PRE={r:()=>({thy:thy,al:30,r:10,l:0,e:0}),l:()=>({thy:thy,al:30,r:10,l:1000,e:0}),c:()=>({thy:thy,al:30,r:10,l:50,e:150}),
v:()=>{const g=IDEAL(topo,+$('#vm').value,120);return{thy:true,al:120,r:10,l:1000,e:-Math.max(50,Math.round(1.3*Math.abs(g)/5)*5)}}};
let pt=true;function apply(m){if(m=='v'&&mode!='v')pt=thy;else if(m!='v'&&mode=='v')thy=pt;mode=m;const p=PRE[m]();Object.keys(p).forEach(k=>{if(k=='thy')thy=p[k];else $('#'+k).value=p[k]});ui()}
document.querySelectorAll('.pb').forEach(b=>b.onclick=()=>apply(b.dataset.m));
const TH=['auto','light','dark'];let ti=0;$('#th').onclick=()=>{ti=(ti+1)%3;const v=TH[ti],R=document.documentElement;v=='auto'?R.removeAttribute('data-theme'):R.setAttribute('data-theme',v);$('#th').textContent='Theme: '+v;dirty=true};
$('#cv').onkeydown=e=>{const k=e.key,sp=view.b-view.a;if(k=='+'||k=='=')zoom(.6,mid());else if(k=='-')zoom(1/.6,mid());else if(k=='ArrowLeft'){view.a-=sp*.1;view.b-=sp*.1}else if(k=='ArrowRight'){view.a+=sp*.1;view.b+=sp*.1}else if(k=='0')view={a:0,b:360};else return;e.preventDefault();dirty=true};
$('#pp').onclick=()=>{play=!play;$('#pp').textContent=play?'Pause':'Play'};
$('#sc').oninput=e=>{cur=+e.target.value;play=false;$('#pp').textContent='Play';const sp=view.b-view.a;let vis=false;for(let n=-3;n<=3;n++){const c=cur+360*n;if(c>=view.a&&c<=view.b)vis=true}if(!vis){view.a=cur-sp/2;view.b=view.a+sp}dirty=true};
const MINS=5,MAXS=720,degAt=px=>{const{X0,X1}=geom();return view.a+(px-X0)/(X1-X0)*(view.b-view.a)};
function zoom(f,c){const sp=view.b-view.a,ns=Math.min(MAXS,Math.max(MINS,sp*f)),t=(c-view.a)/sp;view.a=Math.max(-360,Math.min(1080,c-t*ns));view.b=view.a+ns;dirty=true}
const cvE=$('#cv'),mid=()=>(view.a+view.b)/2;
$('#zi').onclick=()=>zoom(.6,mid());$('#zo').onclick=()=>zoom(1/.6,mid());
$('#zr').onclick=cvE.ondblclick=()=>{view={a:0,b:360};dirty=true};
$('#vl').onclick=()=>{const d=(view.b-view.a)*.25;view.a-=d;view.b-=d;dirty=true};$('#vr').onclick=()=>{const d=(view.b-view.a)*.25;view.a+=d;view.b+=d;dirty=true};
$('#fy').onchange=e=>{fitY=e.target.checked;dirty=true};
cvE.addEventListener('wheel',e=>{e.preventDefault();const px=e.clientX-cvE.getBoundingClientRect().left;zoom(Math.exp(e.deltaY*(e.ctrlKey?.01:.0015)),degAt(px))},{passive:false});
const ptr=new Map();let ld0=0;const pd=()=>{const v=[...ptr.values()];return Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])};
cvE.onpointerdown=e=>{cvE.setPointerCapture(e.pointerId);ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size==2)ld0=pd()};
cvE.onpointermove=e=>{const p=ptr.get(e.pointerId);if(!p)return;const bx=cvE.getBoundingClientRect().left;
if(ptr.size==1){const{X0,X1}=geom(),sp=view.b-view.a,dd=(e.clientX-p[0])*sp/(X1-X0);view.a=Math.max(-360,Math.min(1080,view.a-dd));view.b=view.a+sp;dirty=true}
ptr.set(e.pointerId,[e.clientX,e.clientY]);
if(ptr.size==2){const d=pd(),v=[...ptr.values()];if(ld0>0)zoom(ld0/d,degAt((v[0][0]+v[1][0])/2-bx));ld0=d}};
cvE.onpointerup=cvE.onpointercancel=e=>{ptr.delete(e.pointerId);ld0=0};
addEventListener('resize',()=>dirty=true);
function loop(){if(play){cur=(cur+1.5)%360;$('#sc').value=cur;dirty=true}if(dirty){draw();hl();dirty=false}requestAnimationFrame(loop)}
ui();
requestAnimationFrame(loop);
