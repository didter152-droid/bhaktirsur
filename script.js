/* ভক্তির সুর – script.js (data.js age load hote hobe) */
(function(){const bg=document.querySelector('.bg');BG_IMAGES.forEach((u,i)=>bg.style.setProperty('--i'+(i+1),'url('+u+')'))})();
const PLAY=`<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`,PAUSE=`<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>`;
const $=id=>document.getElementById(id), au=$('audio');
let shuf=false,rep=false,tab="Durga Puja", cur={pl:"Durga Puja",i:0}, playing=false, pos=0, timer=null;
const fmt=s=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
const song=()=>PLAYLISTS[cur.pl][cur.i];

function cover(el,s){const g=`linear-gradient(135deg,${s.c},#1a1411)`;
 if(s.thumb){el.style.background=`url("${s.thumb}") center/cover no-repeat,${g}`;el.textContent="";const im=new Image();im.onerror=()=>{el.style.background=g;el.textContent="♫"};im.src=s.thumb}
 else{el.style.background=g;el.textContent="♫"}}
function load(){const s=song();$('title').textContent=s.t;$('artist').textContent=s.a;cover($('cov'),s);
 $('dur').textContent=fmt(s.d);$('seek').max=s.d;pos=0;$('seek').value=0;prog();$('cur').textContent="0:00";
 if(s.src){au.src=s.src}else{au.removeAttribute('src')}renderList()}
function setPlaying(p){playing=p;$('play').innerHTML=p?PAUSE:PLAY;$('play').setAttribute('aria-label',p?'Pause':'Play');clearInterval(timer);renderList();
 if(p){if(song().src){au.play().catch(()=>{})}
  timer=setInterval(()=>{pos=song().src?au.currentTime:pos+1;if(!song().src&&pos>=song().d){if(rep){pos=0;if(song().src)au.currentTime=0}else step(1);return}
   $('seek').value=pos;prog();$('cur').textContent=fmt(pos)},1000)}else au.pause()}
function step(n){const L=PLAYLISTS[cur.pl].length;cur.i=(shuf&&n>0&&L>1)?(cur.i+1+Math.floor(Math.random()*(L-1)))%L:(cur.i+n+L)%L;load();if(playing)setPlaying(true)}
function pick(pl,i){cur={pl,i};load();setPlaying(true)}

function selectTab(k,scroll){tab=k;renderGrid();renderList();if(scroll)$('plhead').scrollIntoView({behavior:'smooth',block:'start'})}
function renderGrid(){const g=$('grid'),c=$('chips');g.innerHTML="";c.innerHTML="";
 Object.keys(PLAYLISTS).forEach(k=>{const L=PLAYLISTS[k];
  const t=document.createElement('button');t.className='tile'+(k===tab?' on':'');
  t.innerHTML='<span class="tc">♫</span><span class="tn"><b></b><small>'+L.length+' gaan</small></span>';
  t.querySelector('b').textContent=k;cover(t.querySelector('.tc'),L[0]);
  t.onclick=()=>selectTab(k,true);g.appendChild(t);
  const ch=document.createElement('button');ch.className='chip'+(k===tab?' on':'');ch.textContent=k;ch.onclick=()=>selectTab(k,false);c.appendChild(ch)})}
function setShuf(v){shuf=v;$('shuf').classList.toggle('on',v);$('plShuf').classList.toggle('on',v)}
function renderList(){const el=$('list');el.innerHTML="";$('plName').textContent=tab;$('plCount').textContent=PLAYLISTS[tab].length+' gaan';
 $('plPlay').innerHTML=(playing&&cur.pl===tab)?PAUSE:PLAY;PLAYLISTS[tab].forEach((s,i)=>{
 const on=cur.pl===tab&&cur.i===i;const b=document.createElement('button');b.className='song'+(on?' on':'');
 b.innerHTML=`<span class="n">${String(i+1).padStart(2,"0")}</span><span class="cov" style="width:52px;height:52px"></span>
 <span class="meta"><b class="t"></b><span></span></span><span class="d">${on&&playing?"♪":fmt(s.d)}</span>`;
 cover(b.querySelector('.cov'),s);b.querySelector('.t').textContent=s.t;b.querySelector('.meta span').textContent=s.a;
 b.onclick=()=>pick(tab,i);el.appendChild(b)})}

$('play').onclick=()=>setPlaying(!playing);
$('next').onclick=()=>step(1);$('prev').onclick=()=>step(-1);
$('seek').oninput=e=>{pos=+e.target.value;if(song().src)au.currentTime=pos;$('cur').textContent=fmt(pos);prog()};
$('plPlay').onclick=()=>{if(cur.pl===tab)setPlaying(!playing);else pick(tab,0)};
$('plShuf').onclick=()=>setShuf(!shuf);
$('theme').onclick=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='light'?'dark':'light'};

function tick(){const n=new Date();$('clock').textContent=n.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
 $('date').textContent=n.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}
/* Festival day auto-change (Durga Puja 2026 dates, IST) */
function festival(auto){const n=new Date(),k=String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
 const d=DAYS.find(x=>x[0]===k),sub=document.querySelector('.sub'),fd=$('festDay');
 const word=d?d[1]:"পুজো",line=d?d[2].toUpperCase()+" • DURGA PUJA 2026":"DURGA PUJA 2026";
 if(fd.textContent!==word){fd.style.opacity=0;setTimeout(()=>{fd.textContent=word;fd.style.opacity=1},auto?350:0)}
 sub.textContent=line;window.TODAY=d||null;
 if(d&&!auto)maybeCelebrate(d,k)}
festival();setInterval(()=>festival(true),60000);

/* Parallax: panels move with finger/mouse and scroll */
(function(){const r=document.documentElement;let tx=0,ty=0,x=0,y=0;
 function mv(cx,cy){tx=(cx/innerWidth-.5)*40;ty=(cy/innerHeight-.5)*40}
 addEventListener('pointermove',e=>{if(e.pointerType==='mouse')mv(e.clientX,e.clientY)},{passive:true});
 addEventListener('scroll',()=>{ty=Math.min(20,scrollY*.08)},{passive:true});
 addEventListener('deviceorientation',e=>{if(e.gamma!=null){tx=Math.max(-20,Math.min(20,e.gamma))*1.2;ty=Math.max(-20,Math.min(20,(e.beta-45)))*1}},{passive:true});
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches)(function f(){x+=(tx-x)*.06;y+=(ty-y)*.06;r.style.setProperty('--px',x.toFixed(2));r.style.setProperty('--py',y.toFixed(2));requestAnimationFrame(f)})();
})();


function prog(){const v=$('seek');v.style.setProperty('--p',(v.max?v.value/v.max*100:0)+'%')}
$('shuf').onclick=()=>setShuf(!shuf);
$('rep').onclick=e=>{rep=!rep;e.currentTarget.classList.toggle('on',rep)};
$('pclose').onclick=e=>{e.stopPropagation();$('player').classList.toggle('mini');document.body.classList.toggle('mini',$('player').classList.contains('mini'))};
$('player').addEventListener('click',e=>{const p=$('player');if(p.classList.contains('mini')&&!e.target.closest('.pclose')){p.classList.remove('mini');document.body.classList.remove('mini')}});
/* Pic slots: paste your image (data URI) here */
if(PICS.logo)$('logo').style.backgroundImage=`url(${PICS.logo})`;
if(PICS.hero)$('hero').style.backgroundImage=`url(${PICS.hero})`;
/* Song download button */
let toastT;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2800)}
$('pdl').onclick=e=>{e.stopPropagation();const s=song();
 if(!s.src){toast('Ei gaan e mp3 link deoa nei');return}
 const a=document.createElement('a');a.href=s.src;a.download=s.t+'.mp3';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
 toast('Download shuru hocche…')};

/* Festival-day celebration: greeting + fireworks on entry */
function maybeCelebrate(d,k){let seen=false;try{seen=localStorage.getItem('cele-'+k)==='1';localStorage.setItem('cele-'+k,'1')}catch(e){}
 if(!seen)celebrate(d)}
function celebrate(d){const box=$('cele'),cv=$('fw');if(!box)return;
 $('c2').textContent=d[1];$('c1').textContent=d[0]==='10-21'?'শুভ বিজয়া':'শুভ';
 if(d[0]==='10-21')$('c2').textContent='দশমী';
 box.hidden=false;requestAnimationFrame(()=>box.classList.add('show'));
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const ctx=cv.getContext&&cv.getContext('2d');let raf=0,alive=true,rockets=[],parts=[],last=0,next=0;
 const cols=['#ffcf5c','#f5a623','#ff5a3c','#ff8fab','#ffe3b0','#7dd3fc','#c4b5fd'];
 function size(){const r=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*r;cv.height=innerHeight*r;ctx&&ctx.setTransform(r,0,0,r,0,0)}
 function burst(x,y){const c=cols[Math.floor(Math.random()*cols.length)],c2=cols[Math.floor(Math.random()*cols.length)],n=70+Math.floor(Math.random()*30);
  for(let i=0;i<n;i++){const a=Math.PI*2*i/n,v=1.5+Math.random()*3.2;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,c:i%3?c:c2})}}
 function frame(t){if(!alive)return;const dt=Math.min(32,t-(last||t))/16;last=t;
  ctx.globalCompositeOperation='destination-out';ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(0,0,innerWidth,innerHeight);
  ctx.globalCompositeOperation='lighter';
  if(t>next){rockets.push({x:innerWidth*(.12+Math.random()*.76),y:innerHeight,ty:innerHeight*(.12+Math.random()*.35),vy:-(7+Math.random()*3)});next=t+450+Math.random()*500}
  rockets=rockets.filter(r=>{r.y+=r.vy*dt;ctx.fillStyle='#ffe3b0';ctx.fillRect(r.x,r.y,2.5,8);if(r.y<=r.ty){burst(r.x,r.y);return false}return true});
  if(parts.length>700)parts.splice(0,parts.length-700);
  parts=parts.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.045*dt;p.vx*=.992;p.l-=.011*dt;if(p.l<=0)return false;ctx.globalAlpha=Math.max(p.l,0);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,6.3);ctx.fill();return true});
  ctx.globalAlpha=1;raf=requestAnimationFrame(frame)}
 function close(){if(!alive)return;alive=false;cancelAnimationFrame(raf);box.classList.remove('show');setTimeout(()=>{box.hidden=true},500)}
 if(ctx&&!reduce){size();addEventListener('resize',size);raf=requestAnimationFrame(frame)}
 $('cgo').onclick=close;box.onclick=e=>{if(e.target===box||e.target===cv)close()};
 setTimeout(close,reduce?5000:12000)}

/* Rotating greeting lines */
(function(){const L=GREETINGS;
 const el=$('tag');let i=0;
 setInterval(()=>{el.classList.add('out');setTimeout(()=>{i=(i+1)%L.length;el.textContent=L[i];el.classList.remove('out');el.classList.add('pre');void el.offsetWidth;el.classList.remove('pre')},600)},4500);
})();

/* Dhak: tap to start, tap again to stop (synthesised, no audio file) */
(function(){const btn=$('dhak');let fa=null,fT=null;let ctx=null,master=null,timer=null,on=false,step=0,nextT=0,noise=null;
 const PAT="B.tt B.tt BtBt tRtR B.tt BtRt BBtt RRRR".replace(/ /g,"");
 const BPM=150,SP=60/BPM/4;
 function mkNoise(){const n=ctx.createBuffer(1,ctx.sampleRate*.3,ctx.sampleRate),d=n.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return n}
 function bass(t,v){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(65,t+.2);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.45);o.connect(g);g.connect(master);o.start(t);o.stop(t+.5)}
 function tak(t,v,f){const s=ctx.createBufferSource(),b=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;b.type='bandpass';b.frequency.value=f;b.Q.value=1.4;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.09);s.connect(b);b.connect(g);g.connect(master);s.start(t,Math.random()*.1);s.stop(t+.12)}
 function hit(c,t){const h=(Math.random()-.5)*.008;t+=h;
  if(c==='B'){bass(t,.95);tak(t,.55,2400)}else if(c==='t'){tak(t,.5,3200)}else if(c==='R'){tak(t,.22,3800)}}
 function sched(){while(nextT<ctx.currentTime+.12){hit(PAT[step%PAT.length],nextT);nextT+=SP;step++}}
 function fade(to,ms,done){clearInterval(fT);const a=fa,from=a.volume,n=Math.max(1,ms/30);let i=0;fT=setInterval(()=>{i++;a.volume=Math.min(1,Math.max(0,from+(to-from)*i/n));if(i>=n){clearInterval(fT);done&&done()}},30)}
 function ui(p){btn.classList.toggle('on',p);btn.setAttribute('aria-pressed',p?'true':'false');btn.setAttribute('aria-label',p?'Dhak bondho korun':'Dhak bajao')}
 function startFile(){if(!fa){fa=new Audio(DHAK_SRC);fa.loop=true;fa.preload='auto'}fa.volume=0;const p=fa.play();if(p&&p.catch)p.catch(()=>{toast('ঢাক চালানো যাচ্ছে না');on=false;ui(false)});on=true;ui(true);fade(1,300)}
 function stopFile(){on=false;ui(false);fade(0,250,()=>fa.pause())}
 function start(){if(DHAK_SRC)return startFile();const AC=window.AudioContext||window.webkitAudioContext;if(!AC){toast('এই ফোনে ঢাকের আওয়াজ চলছে না');return}
  if(!ctx){ctx=new AC();master=ctx.createGain();master.connect(ctx.destination);noise=mkNoise()}
  ctx.resume&&ctx.resume();master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0,ctx.currentTime);master.gain.linearRampToValueAtTime(.9,ctx.currentTime+.08);
  step=0;nextT=ctx.currentTime+.05;sched();timer=setInterval(sched,25);on=true;btn.classList.add('on');btn.setAttribute('aria-pressed','true');btn.setAttribute('aria-label','Dhak bondho korun')}
 function stop(){if(!on)return;if(DHAK_SRC)return stopFile();on=false;clearInterval(timer);if(master){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.linearRampToValueAtTime(0,ctx.currentTime+.2)}
  btn.classList.remove('on');btn.setAttribute('aria-pressed','false');btn.setAttribute('aria-label','Dhak bajao')}
 btn.onclick=()=>on?stop():start();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();

/* Live "online" count: everyone with the page open right now */
(async()=>{let room=null;try{room=await claude.use("room")}catch(e){}
 if(!room)return;
 const show=()=>{try{const n=room.peers().filter(p=>p.kind==='viewer').length;
   if(n>0){$('onN').textContent=n;$('online').hidden=false}}catch(e){}};
 try{await room.presence({here:true})}catch(e){}
 room.onPeers(show,()=>{});
 room.onConnection(c=>{if(!c&&!room.connected())setTimeout(()=>{if(!room.connected())$('online').hidden=true},2500);else show()},()=>{});
 show();
})();
/* Asol mp3 er jonno: asol dorghyo, shesh hole porer gaan, error hole message */
au.addEventListener('loadedmetadata',()=>{if(isFinite(au.duration)&&au.duration>0){song().d=Math.round(au.duration);$('dur').textContent=fmt(song().d);$('seek').max=song().d;prog();renderList()}});
au.addEventListener('ended',()=>{if(rep){au.currentTime=0;au.play()}else step(1)});
au.addEventListener('error',()=>{if(au.getAttribute('src'))toast('এই গানটা চালানো যাচ্ছে না')});
tick();setInterval(tick,30000);
renderGrid();
(function(){const h=document.querySelector('h1');h.style.cursor='pointer';h.title='Celebrate';h.onclick=()=>{if(window.TODAY)celebrate(window.TODAY)}})();
load();
