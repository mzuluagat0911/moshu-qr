(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LS={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('moshu_demo_'+k))??d}catch(e){return d}},set:(k,v)=>localStorage.setItem('moshu_demo_'+k,JSON.stringify(v))};
const code=p=>p+'-'+String(Math.floor(1000+Math.random()*9000));
const phoneOk=v=>v.replace(/\D/g,'').length>=8;
function validate(f){let ok=true;f.querySelectorAll('[required]').forEach(i=>{const bad=i.type==='checkbox'?!i.checked:(i.name==='wa'?!phoneOk(i.value):!i.value.trim());(i.type==='checkbox'?i.parentElement:i.parentElement).classList.toggle('err',bad);if(bad)ok=false});return ok}

/* tabs */
const secs=['lab','lab-vivo','togo'].map(id=>document.getElementById(id));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.tabs a').forEach(a=>a.classList.toggle('on',a.dataset.route===e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>io.observe(s));

/* LAB counter */
const START=37;let left=LS.get('left',START);
const el=$('#labLeft');
(function count(){let n=100;const t=setInterval(()=>{n-=Math.max(1,Math.round((n-left)/6));if(n<=left){n=left;clearInterval(t);drip()}el.textContent=n},28)})();
function drip(){setInterval(()=>{if(left>12&&Math.random()<.35){left--;LS.set('left',left);el.textContent=left;el.parentElement.classList.remove('bump');void el.offsetWidth;el.parentElement.classList.add('bump')}},6000)}
function showLab(d){$('#labForm').hidden=true;$('#labOk').hidden=false;$('[data-name]').textContent=d.nombre.split(' ')[0].toLowerCase();$('#labCode').textContent=d.code;const v=LS.get('vote');if(v)showVote(v)}
$('#labForm').addEventListener('submit',e=>{e.preventDefault();const f=e.target;if(!validate(f))return;const d={nombre:f.nombre.value.trim(),wa:f.wa.value.trim(),code:code('MOSHU-LAB'),t:Date.now()};LS.set('lab',d);left=Math.max(0,left-1);LS.set('left',left);el.textContent=left;showLab(d)});
const saved=LS.get('lab');if(saved)showLab(saved);
function showVote(v){$$('.vbtn').forEach(b=>b.classList.toggle('on',b.dataset.vote===v));const base={venta:64,ajustar:36};const r=$('#voteRes');r.hidden=false;r.innerHTML=Object.entries(base).map(([k,p])=>`<div class="vr"><span>${k==='venta'?'A la venta':'Ajustalo'}</span><div class="bar"><i style="width:0"></i></div><span>${p}%</span></div>`).join('')+'<p class="hand" style="color:var(--cream)">gracias. lo leemos todo.</p>';requestAnimationFrame(()=>r.querySelectorAll('.bar i').forEach((i,n)=>i.style.width=Object.values(base)[n]+'%'))}
$$('.vbtn').forEach(b=>b.addEventListener('click',()=>{LS.set('vote',b.dataset.vote);showVote(b.dataset.vote)}));

/* LAB VIVO feed */
const feed=[
 {t:'Hoy · 08:12',h:'Primera horneada de prueba',p:'Salió la tanda 7 del prototipo. Le bajamos el azúcar. Mañana vemos si lo extrañan.',img:'img/fam0108.jpg',n:'tanda 7 de 7. por ahora.',live:1},
 {t:'Ayer · 17:40',h:'Llegaron los ventanales',p:'Marco rojo, como tenía que ser. Ahora entra luz de verdad.',img:'img/lab3_1.jpg'},
 {t:'Mar · 11:05',h:'El piso ya está',p:'Calcáreo original, restaurado baldosa por baldosa.',img:'img/lab4_1.jpg',n:'no se tocaba. se recuperaba.'},
 {t:'Lun · 09:30',h:'La casona, desde atrás',p:'Así arrancamos. Una casa vieja con ganas de hornear.',img:'img/lab2_1.jpg'},
 {t:'Sáb · 16:20',h:'Obra, día 1',p:'Polvo, cables y una pava. Lo básico.',img:'img/lab1_1.jpg'}
];
$('#feed').innerHTML=feed.map(f=>`<li class="${f.live?'live':''}"><time>${f.t}</time><h4>${f.h}</h4><p>${f.p}</p><img src="${f.img}" alt="" loading="lazy">${f.n?`<p class="hand">${f.n}</p>`:''}</li>`).join('');
$('#notifyBtn').addEventListener('click',()=>{$('#notifyForm').hidden=false;$('#notifyForm input').focus()});
$('#notifyForm').addEventListener('submit',e=>{e.preventDefault();if(!validate(e.target))return;LS.set('notify',{wa:e.target.wa.value,t:Date.now()});e.target.hidden=true;$('#notifyOk').hidden=false});
if(LS.get('notify'))$('#notifyOk').hidden=false;

/* TO GO quiz */
const P={
 social:{n:'Disfrutador social',img:'img/fam0102.jpg',prod:'Torta para compartir + 2 cafés',d:'Lo rico es mejor de a dos (o de a seis). Vos ponés la excusa, nosotros la torta.'},
 ritual:{n:'Ritualista cotidiano',img:'img/fam0042.jpg',prod:'Tu café de siempre + algo al lado',d:'Mismo horario, misma mesa. No es rutina: es tu momento y no se negocia.'},
 antojo:{n:'Comprador por antojo',img:'img/a2.jpg',prod:'Café + muffin del día',d:'Lo viste, lo quisiste, lo tenés. Y está perfecto.'},
 func:{n:'Funcional con criterio',img:'img/fam0203.jpg',prod:'Café + sándwich para llevar',d:'Poco tiempo, cero ganas de comer cualquier cosa. Rápido, pero bien.'},
 explo:{n:'Explorador de gusto',img:'img/fam0108.jpg',prod:'Lo nuevo de la vitrina + café',d:'Si es nuevo, es tuyo. Lo obvio ya lo hizo otro.'}
};
function profile([a,b,c]){if(c==='nuevo')return(a==='dulce'&&b==='caminando')?'antojo':'explo';if(b==='aca')return a==='dulce'?'social':'ritual';return a==='dulce'?'antojo':'func'}
let ans=[];
$$('.q').forEach((q,i)=>q.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{b.classList.add('pick');ans[i]=b.dataset.a;setTimeout(()=>{q.hidden=true;if(i<2){$$('.q')[i+1].hidden=false;$('#qnum').textContent=(i+2)+'/3';$('#qbar').style.width=((i+2)*33.4)+'%'}else{const k=profile(ans);LS.set('quiz',{ans,k});showResult(k)}},320)})));
function showResult(k){const p=P[k];$('#quiz').hidden=true;$('#result').hidden=false;$('#rProfile').innerHTML=p.n.replace(' ','<br>');$('#rImg').src=p.img;$('#rProd').textContent=p.prod;$('#rDesc').textContent=p.d;$('#tProf').textContent=p.n;$('#tProd').textContent=p.prod;const t=LS.get('togo');if(t&&t.k===k)showTicket(t)}
function showTicket(t){$('#togoForm').hidden=true;$('#togoOk').hidden=false;$('#togoCode').textContent=t.code}
$('#togoForm').addEventListener('submit',e=>{e.preventDefault();if(!validate(e.target))return;const q=LS.get('quiz',{});const t={wa:e.target.wa.value,k:q.k,code:code('MOSHU-TOGO'),t:Date.now()};LS.set('togo',t);showTicket(t)});
$('#retry').addEventListener('click',()=>{ans=[];$$('.tiles button').forEach(b=>b.classList.remove('pick'));$$('.q').forEach((q,i)=>q.hidden=i>0);$('#qnum').textContent='1/3';$('#qbar').style.width='33%';$('#quiz').hidden=false;$('#result').hidden=true;$('#togoForm').hidden=false;$('#togoOk').hidden=true});
$('#shareBtn').addEventListener('click',async()=>{const q=LS.get('quiz',{});const txt=`Mi antojo es ${P[q.k]?.n}. ¿Y el tuyo? Moshu To Go`;try{if(navigator.share)await navigator.share({title:'Moshu',text:txt,url:location.href.split('#')[0]+'#togo'});else{await navigator.clipboard.writeText(txt+' '+location.href);$('#shareBtn').textContent='Copiado ✓'}}catch(e){}});
const qz=LS.get('quiz');if(qz&&qz.k)showResult(qz.k);
})();
