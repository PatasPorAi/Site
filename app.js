const KEY='patas_por_ai_v6_seeded';
const OLD_KEY=null;
const WEEK=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const WEEK_FULL=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=(d=today())=>d.slice(0,7);
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0));
const fmtDate=s=>s?new Date(s+'T12:00:00').toLocaleDateString('pt-BR'):'';
const fmtShort=s=>s?new Date(s+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}):'';
const dateObj=s=>new Date(s+'T12:00:00');
const iso=d=>d.toISOString().slice(0,10);
const addDays=(s,n)=>{const d=dateObj(s);d.setDate(d.getDate()+n);return iso(d)};
const daysBetween=(a,b)=>Math.max(0,Math.round((dateObj(b)-dateObj(a))/86400000));
const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
const weekday=s=>dateObj(s).getDay();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const monthLabel=m=>new Date(m+'-01T12:00:00').toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const monthRange=m=>{const start=m+'-01';const d=dateObj(start);d.setMonth(d.getMonth()+1);return [start,iso(d)]};
const inMonth=(s,m)=>s&&s.startsWith(m);
const datesInRange=(a,b)=>{const out=[];for(let d=a;d<b;d=addDays(d,1))out.push(d);return out};

const seed={
 settings:{hotelBilling:'nights'},
 tutors:[
  {id:'t_rafael_flavia',name:'Rafael e Flavia'},
  {id:'t_duda',name:'Maria Eduarda - Duda'},
  {id:'t_vinicius',name:'Vinicius Alencar'},
  {id:'t_marcelo_bia_bella',name:'Marcelo, Bia e Bella'},
  {id:'t_carol_fernando',name:'Carol e Fernando'},
  {id:'t_leticia',name:'Leticia'},
  {id:'t_jaque',name:'Jaque'},
  {id:'t_yuri_nath_tomas',name:'Yuri, Nath e Tomas'}
 ],
 dogs:[
  {id:'d_leslie',tutorId:'t_rafael_flavia',name:'Leslie',active:true,crecheType:'schedule_monthly',scheduleDays:[1,2,3,4,5],monthlyValue:1800,referenceMonthlyValue:1800,crecheValue:90,extraDayValue:90,packageDays:0,packageValue:0,bathValue:85,hotelValue:95},
  {id:'d_mel',tutorId:'t_duda',name:'Mel',active:true,crecheType:'schedule_monthly',scheduleDays:[1,2,3,4,5],monthlyValue:1800,referenceMonthlyValue:1800,crecheValue:90,extraDayValue:90,packageDays:0,packageValue:0,bathValue:120,hotelValue:95},
  {id:'d_amora_v',tutorId:'t_vinicius',name:'Amora',active:true,crecheType:'schedule_monthly',scheduleDays:[1,2,3,4,5],monthlyValue:1800,referenceMonthlyValue:1800,crecheValue:90,extraDayValue:90,packageDays:0,packageValue:0,bathValue:75,hotelValue:90},
  {id:'d_blueberry',tutorId:'t_vinicius',name:'Blueberry',active:true,crecheType:'schedule_monthly',scheduleDays:[1,2,3,4,5],monthlyValue:900,referenceMonthlyValue:900,crecheValue:45,extraDayValue:45,packageDays:0,packageValue:0,bathValue:75,hotelValue:90},
  {id:'d_theo',tutorId:'t_marcelo_bia_bella',name:'Theo',active:true,crecheType:'schedule_monthly',scheduleDays:[1,2,3,4],monthlyValue:1400,referenceMonthlyValue:1400,crecheValue:87.5,extraDayValue:87.5,packageDays:0,packageValue:0,bathValue:85,hotelValue:95},
  {id:'d_capitu',tutorId:'t_carol_fernando',name:'Capitu',active:true,crecheType:'schedule_monthly',scheduleDays:[2,4],monthlyValue:740,referenceMonthlyValue:870,crecheValue:0,extraDayValue:0,packageDays:0,packageValue:0,bathValue:85,hotelValue:95},
  {id:'d_amora_l',tutorId:'t_leticia',name:'Amora',active:true,crecheType:'schedule_monthly',scheduleDays:[2,4],monthlyValue:555,referenceMonthlyValue:870,crecheValue:0,extraDayValue:0,packageDays:0,packageValue:0,bathValue:0,hotelValue:85},
  {id:'d_lican',tutorId:'t_jaque',name:'Lican',active:true,crecheType:'schedule_monthly',scheduleDays:[2],monthlyValue:400,referenceMonthlyValue:400,crecheValue:0,extraDayValue:0,packageDays:0,packageValue:0,bathValue:0,hotelValue:95},
  {id:'d_kobe',tutorId:'t_yuri_nath_tomas',name:'Kobe',active:true,crecheType:'schedule_monthly',scheduleDays:[3],monthlyValue:400,referenceMonthlyValue:400,crecheValue:0,extraDayValue:0,packageDays:0,packageValue:0,bathValue:80,hotelValue:95}
 ],
 attendance:[], daycareBookings:[], scheduleExceptions:[], hotel:[], extras:[], payments:[], adjustments:[]
};

function migrate(raw){
 const x=raw||{};
 x.settings=x.settings||{hotelBilling:'nights'};x.tutors=x.tutors||[];x.dogs=x.dogs||[];
 x.attendance=x.attendance||[];x.daycareBookings=x.daycareBookings||[];x.scheduleExceptions=x.scheduleExceptions||[];x.hotel=x.hotel||[];x.extras=x.extras||[];x.payments=x.payments||[];x.adjustments=x.adjustments||[];
 x.dogs=x.dogs.map(d=>({...d,scheduleDays:Array.isArray(d.scheduleDays)?d.scheduleDays:[],extraDayValue:Number(d.extraDayValue??d.crecheValue??0),bathValue:Number(d.bathValue??0),referenceMonthlyValue:Number(d.referenceMonthlyValue??d.monthlyValue??0),active:d.active!==false}));
 x.attendance=x.attendance.map(a=>({...a,kind:a.kind||(a.courtesy?'courtesy':'plan'),rate:Number(a.rate||0)}));
 x.hotel=x.hotel.map(h=>({...h,status:h.status||(h.checkout?'completed':'in_progress'),checkout:h.checkout||null,plannedCheckout:h.plannedCheckout||h.checkout||null,chargedDays:(h.chargedDays===null||h.chargedDays===undefined||h.chargedDays==='')?null:Number(h.chargedDays)}));
 return x;
}
function load(){try{const v=localStorage.getItem(KEY);if(v)return migrate(JSON.parse(v));if(OLD_KEY){const old=localStorage.getItem(OLD_KEY);if(old){const m=migrate(JSON.parse(old));localStorage.setItem(KEY,JSON.stringify(m));return m}}const fresh=structuredClone(seed);localStorage.setItem(KEY,JSON.stringify(fresh));return fresh}catch{return structuredClone(seed)}}
let db=load(),view='today',modal=null,selectedMonth=monthKey(),calendarMonth=monthKey(),calendarSelected=today(),todaySelected=today();
function save(){localStorage.setItem(KEY,JSON.stringify(db));render()}
function tutor(id){return db.tutors.find(x=>x.id===id)}
function dog(id){return db.dogs.find(x=>x.id===id)}
function activeDogs(){return db.dogs.filter(d=>d.active)}
function dogOptions(selected=''){return activeDogs().map(d=>`<option value="${d.id}" ${selected===d.id?'selected':''}>${esc(d.name)} · ${esc(tutor(d.tutorId)?.name||'')}</option>`).join('')}
function tutorOptions(selected=''){return db.tutors.map(t=>`<option value="${t.id}" ${selected===t.id?'selected':''}>${esc(t.name)}</option>`).join('')}
function isSchedulePlan(d){return d.crecheType==='schedule_monthly'}
function scheduleText(d){return (d.scheduleDays||[]).map(i=>WEEK[i]).join(', ')||'sem dias definidos'}
function crecheText(d){if(d.crecheType==='schedule_monthly')return `${(d.scheduleDays||[]).length}x/semana (${scheduleText(d)}) · ${money(d.monthlyValue)}/mês`;if(d.crecheType==='monthly')return `${money(d.monthlyValue)}/mês`;if(d.crecheType==='daily')return `${money(d.crecheValue)} por presença`;if(d.crecheType==='package')return `${d.packageDays||0} dias por ${money(d.packageValue)}`;return 'Sem plano'}

function exceptionForDogOn(dogId,date){return db.scheduleExceptions.find(e=>e.dogId===dogId&&(e.fromDate===date||e.toDate===date))}
function recurringPlanned(d,date){if(!d.active||!isSchedulePlan(d))return false;const w=weekday(date);if(!(d.scheduleDays||[]).includes(w))return false;const moved=db.scheduleExceptions.some(e=>e.dogId===d.id&&e.fromDate===date&&e.toDate!==date);return !moved}
function bookedDaycare(dogId,date){return db.daycareBookings.filter(b=>b.dogId===dogId&&b.date===date&&b.status!=='cancelled')}
function isPlannedDaycare(d,date){if(recurringPlanned(d,date))return true;if(db.scheduleExceptions.some(e=>e.dogId===d.id&&e.toDate===date))return true;return bookedDaycare(d.id,date).length>0}
function plannedDaycareForDate(date){return activeDogs().filter(d=>isPlannedDaycare(d,date)).map(d=>({dog:d,source:recurringPlanned(d,date)?'plano':db.scheduleExceptions.some(e=>e.dogId===d.id&&e.toDate===date)?'reposição':'avulso'}))}
function attendanceOn(dogId,date){return db.attendance.find(a=>a.dogId===dogId&&a.date===date)}
function attendanceLabel(a){return ({plan:'Plano',extra:'Diária extra',replacement:'Reposição',courtesy:'Cortesia',custom:'Valor personalizado'}[a?.kind]||'Presença')}
function attendanceValue(a,d){if(!a)return 0;if(a.kind==='courtesy'||a.kind==='replacement'||a.kind==='plan')return a.kind==='plan'&&d.crecheType==='daily'?Number((a.rate ?? d.crecheValue) || 0):0;return Number(a.rate||0)}
function bookingValue(b,d){if(b.status==='cancelled')return 0;if(['extra','custom'].includes(b.kind))return Number(b.rate??d.extraDayValue??d.crecheValue??0);if(d.crecheType==='daily')return Number(b.rate??d.crecheValue??0);return 0}

function hotelAutoNights(h){return daysBetween(h.checkin,h.plannedCheckout||h.checkout||h.checkin)}
function hotelNights(h){return h.chargedDays===null||h.chargedDays===undefined||h.chargedDays===''?hotelAutoNights(h):Math.max(0,Number(h.chargedDays)||0)}
function hotelTotal(h){return hotelNights(h)*Number(h.dailyRate??dog(h.dogId)?.hotelValue??0)}
function hotelCoversDate(h,date){const end=h.plannedCheckout||h.checkout;if(!end||h.status==='cancelled')return false;return date>=h.checkin&&date<end}
function hotelsOn(date){return db.hotel.filter(h=>hotelCoversDate(h,date))}
function hotelArrivals(date){return db.hotel.filter(h=>h.status!=='cancelled'&&h.checkin===date)}
function hotelDepartures(date){return db.hotel.filter(h=>h.status!=='cancelled'&&(h.plannedCheckout||h.checkout)===date)}
function activeHotelsAt(date=today()){return hotelsOn(date)}

function monthRecurringPlanValue(d,m){return isSchedulePlan(d)||d.crecheType==='monthly'?Number(d.monthlyValue||0):0}
function hotelOverlapNights(h,m){if(h.status==='cancelled')return 0;const end=h.plannedCheckout||h.checkout;if(!end)return 0;const [ms,me]=monthRange(m);const a=h.checkin>ms?h.checkin:ms;const b=end<me?end:me;return a<b?daysBetween(a,b):0}
function hotelMonthValue(h,m){const rate=Number(h.dailyRate??dog(h.dogId)?.hotelValue??0);if(h.chargedDays!==null&&h.chargedDays!==undefined&&h.chargedDays!=='')return inMonth(h.checkin,m)?hotelNights(h)*rate:0;return hotelOverlapNights(h,m)*rate}
function monthForecastDog(d,m){
 let total=monthRecurringPlanValue(d,m),details=[];
 if(monthRecurringPlanValue(d,m)){total=monthRecurringPlanValue(d,m);details.push(`Plano de creche (${scheduleText(d)}): ${money(total)}`)}
 const bookings=db.daycareBookings.filter(b=>b.dogId===d.id&&inMonth(b.date,m)&&b.status!=='cancelled');
 const bookValue=bookings.reduce((s,b)=>s+bookingValue(b,d),0);if(bookValue){total+=bookValue;details.push(`Creche avulsa/extra agendada: ${money(bookValue)}`)}
 const actualUnbooked=db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&!bookings.some(b=>b.date===a.date)&&['extra','custom'].includes(a.kind));
 const av=actualUnbooked.reduce((s,a)=>s+attendanceValue(a,d),0);if(av){total+=av;details.push(`Diárias extras realizadas: ${money(av)}`)}
 if(d.crecheType==='daily'){
   const dailyAtt=db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&!['courtesy','replacement'].includes(a.kind));
   const already=new Set(bookings.map(b=>b.date));const dv=dailyAtt.filter(a=>!already.has(a.date)).reduce((s,a)=>s+Number((a.rate ?? d.crecheValue) || 0),0);if(dv){total+=dv;details.push(`Creche por diária realizada: ${money(dv)}`)}
 }
 if(d.crecheType==='package'){
   const count=db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&a.kind!=='courtesy').length; if(count){const packs=Math.ceil(count/Math.max(1,Number(d.packageDays||1)));const pv=packs*Number(d.packageValue||0);total+=pv;details.push(`${packs} pacote(s) de creche: ${money(pv)}`)}
 }
 const hs=db.hotel.filter(h=>h.dogId===d.id&&h.status!=='cancelled'&&hotelMonthValue(h,m)>0);hs.forEach(h=>{const v=hotelMonthValue(h,m);total+=v;details.push(`Hotel ${fmtDate(h.checkin)} a ${fmtDate(h.plannedCheckout||h.checkout)} · ${hotelNights(h)} diária(s) cobrada(s): ${money(v)}`)});
 db.extras.filter(e=>e.dogId===d.id&&inMonth(e.date,m)).forEach(e=>{total+=Number(e.value);details.push(`${e.label}: ${money(e.value)}`)});
 db.adjustments.filter(a=>a.dogId===d.id&&a.month===m).forEach(a=>{total+=Number(a.value);details.push(`${a.label}: ${money(a.value)}`)});
 return {total,details};
}
function monthRealizedDog(d,m){
 let total=0,details=[];
 const at=db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&a.date<=today());
 if(isSchedulePlan(d)||d.crecheType==='monthly'){
   const regular=at.filter(a=>!['courtesy','replacement','extra','custom'].includes(a.kind));
   const v=regular.reduce((sum,a)=>sum+Number((a.rate??d.crecheValue)||0),0);
   total+=v;if(v)details.push(`${regular.length} diária(s) de creche realizada(s): ${money(v)}`);
 }
 if(d.crecheType==='daily'){
   const daily=at.filter(a=>!['courtesy','replacement','extra','custom'].includes(a.kind));
   const v=daily.reduce((sum,a)=>sum+Number((a.rate??d.crecheValue)||0),0);
   total+=v;if(v)details.push(`${daily.length} diária(s) de creche realizada(s): ${money(v)}`);
 }
 if(d.crecheType==='package'){
   const count=at.filter(a=>a.kind!=='courtesy').length;
   if(count){const packs=Math.ceil(count/Math.max(1,Number(d.packageDays||1)));const v=packs*Number(d.packageValue||0);total+=v;details.push(`${packs} pacote(s) de creche: ${money(v)}`)}
 }
 const extrasAtt=at.filter(a=>['extra','custom'].includes(a.kind));const ev=extrasAtt.reduce((sum,a)=>sum+attendanceValue(a,d),0);if(ev){total+=ev;details.push(`Diárias extras: ${money(ev)}`)}
 db.hotel.filter(h=>h.dogId===d.id&&h.status!=='cancelled'&&h.checkout&&h.checkout<=today()&&hotelOverlapNights(h,m)>0).forEach(h=>{const v=hotelMonthValue(h,m);total+=v;details.push(`Hotel concluído: ${money(v)}`)});
 db.extras.filter(e=>e.dogId===d.id&&inMonth(e.date,m)&&e.date<=today()).forEach(e=>{total+=Number(e.value);details.push(`${e.label}: ${money(e.value)}`)});
 db.adjustments.filter(a=>a.dogId===d.id&&a.month===m).forEach(a=>{total+=Number(a.value);details.push(`${a.label}: ${money(a.value)}`)});
 return {total,details};
}
function tutorTotals(t,m,mode='forecast'){let total=0,details=[];db.dogs.filter(d=>d.tutorId===t.id).forEach(d=>{const c=mode==='realized'?monthRealizedDog(d,m):monthForecastDog(d,m);if(c.total||c.details.length){total+=c.total;details.push({dog:d.name,...c})}});const paid=db.payments.filter(p=>p.tutorId===t.id&&p.month===m).reduce((s,p)=>s+Number(p.value),0);return {total,paid,due:Math.max(0,total-paid),details}}
function monthTotals(m){let forecast=0,realized=0,paid=0;db.tutors.forEach(t=>{const f=tutorTotals(t,m,'forecast'),r=tutorTotals(t,m,'realized');forecast+=f.total;realized+=r.total;paid+=f.paid});return {forecast,realized,paid,due:Math.max(0,forecast-paid),remaining:Math.max(0,forecast-realized)}}

function render(){document.getElementById('app').innerHTML=`<div class="shell">${header()}${page()}</div>${nav()}${modal?modalHtml():''}`;bind()}
function header(){return `<div class="topbar"><div class="brand"><div class="logo">🐾</div><div><h1>Patas por aí</h1><small>Agenda + financeiro</small></div></div><div class="pill">${new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</div></div>`}
function nav(){return `<nav class="nav">${[['today','Hoje','🏠'],['calendar','Agenda','📅'],['finance','Financeiro','💰'],['dogs','Cães','🐶'],['more','Mais','⚙️']].map(([v,l,i])=>`<button data-nav="${v}" class="${view===v?'active':''}"><div>${i}</div>${l}</button>`).join('')}</nav>`}
function page(){return ({today:todayPage,calendar:calendarPage,finance:financePage,dogs:dogsPage,more:morePage}[view]||todayPage)()}

function todayPage(){
 const d=todaySelected,plan=plannedDaycareForDate(d),att=db.attendance.filter(a=>a.date===d),hotels=hotelsOn(d),arr=hotelArrivals(d),dep=hotelDepartures(d),mt=monthTotals(monthKey(d));
 const plannedIds=new Set(plan.map(x=>x.dog.id));const extraPresent=att.filter(a=>!plannedIds.has(a.dogId));
 const dateLabel=new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
 return `<div class="today-navigator"><button class="btn small ghost" data-today-prev aria-label="Dia anterior">‹</button><div class="today-date"><strong>${dateLabel}</strong>${d!==today()?`<button class="today-link" data-today-reset>Voltar para hoje</button>`:'<span class="muted tiny">Hoje</span>'}</div><button class="btn small ghost" data-today-next aria-label="Dia seguinte">›</button></div>
 <div class="grid cols-4"><div class="card"><div class="kicker">Previstos na creche</div><div class="metric">${plan.length}</div><div class="muted">neste dia</div></div><div class="card"><div class="kicker">Hospedados</div><div class="metric">${hotels.length}</div><div class="muted">neste dia</div></div><div class="card"><div class="kicker">Entradas / saídas</div><div class="metric">${arr.length} / ${dep.length}</div><div class="muted">hotel</div></div><div class="card"><div class="kicker">Previsão do mês</div><div class="metric money-metric">${money(mt.forecast)}</div><div class="muted">${money(mt.due)} a receber</div></div></div>
 <div class="section-title"><h2>Buscar / creche</h2><button class="btn small secondary" data-open="daycare-booking">+ Agendar</button></div>
 <div class="card"><div class="dog-list">${plan.map(({dog:d,source})=>daycareRow(d,source,attendanceOn(d.id,todaySelected),todaySelected)).join('')||'<div class="empty">Nenhum cachorro previsto para este dia.</div>'}${extraPresent.length?`<div class="mini-title">Outros presentes</div>${extraPresent.map(a=>daycareRow(dog(a.dogId),'extra',a,todaySelected)).join('')}`:''}</div></div>
 <div class="section-title"><h2>Hotel</h2><button class="btn small" data-open="hotel">+ Reserva</button></div><div class="card">${hotels.length?hotels.map(h=>`<div class="dog-item"><div><strong>${esc(dog(h.dogId)?.name)}</strong><div class="muted tiny">${fmtDate(h.checkin)} → ${fmtDate(h.plannedCheckout||h.checkout)} · ${hotelNights(h)} diária(s)</div></div><span class="badge">${h.status==='completed'?'Concluído':h.status==='planned'?'Previsto':'Hospedado'}</span></div>`).join(''):'<div class="empty">Nenhum cachorro hospedado neste dia.</div>'}</div>
 ${(arr.length||dep.length)?`<div class="section-title"><h2>Movimentação do hotel</h2></div><div class="grid cols-2"><div class="card"><div class="kicker">Entradas</div>${arr.map(h=>`<div class="compact-line"><strong>${esc(dog(h.dogId)?.name)}</strong><span>${fmtShort(h.checkin)}</span></div>`).join('')||'<div class="muted">Nenhuma.</div>'}</div><div class="card"><div class="kicker">Saídas</div>${dep.map(h=>`<div class="compact-line"><strong>${esc(dog(h.dogId)?.name)}</strong><span>${fmtShort(h.plannedCheckout||h.checkout)}</span></div>`).join('')||'<div class="muted">Nenhuma.</div>'}</div></div>`:''}`
}
function dogAvatar(d){return d?.photo?`<div class="avatar dog-photo"><img src="${d.photo}" alt="Foto de ${esc(d.name||'cachorro')}"></div>`:`<div class="avatar">🐶</div>`}
function resizeDogPhoto(file){return new Promise((resolve,reject)=>{if(!file){resolve(null);return}const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=480,scale=Math.min(1,max/Math.max(img.width,img.height)),w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale));const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);resolve(c.toDataURL('image/jpeg',.82))};img.src=reader.result};reader.readAsDataURL(file)})}
function daycareRow(d,source,a,date=todaySelected){if(!d)return '';const present=!!a;return `<div class="dog-item"><div class="dog-main">${dogAvatar(d)}<div><strong>${esc(d.name)}</strong><div class="muted tiny">${esc(tutor(d.tutorId)?.name||'')} · ${source==='plano'?'Plano':source==='reposição'?'Reposição':'Avulso'}${a?` · ${attendanceLabel(a)}`:''}</div></div></div><button class="check ${present?'on':''}" data-day-presence="${d.id}" data-date="${date}">${present?'✓':''}</button></div>`}


function calendarPage(){
 const m=calendarMonth,[ms,me]=monthRange(m),first=dateObj(ms).getDay(),days=daysBetween(ms,me),cells=[];for(let i=0;i<first;i++)cells.push('<div class="cal-cell empty-cell"></div>');for(let n=1;n<=days;n++){const ds=`${m}-${String(n).padStart(2,'0')}`,pc=plannedDaycareForDate(ds).length,hc=hotelsOn(ds).length;cells.push(`<button class="cal-cell ${ds===calendarSelected?'selected':''} ${ds===today()?'today':''}" data-cal-day="${ds}"><strong>${n}</strong><span>🐾 ${pc}</span><span>🏨 ${hc}</span></button>`)}
 const plan=plannedDaycareForDate(calendarSelected),hs=hotelsOn(calendarSelected),arr=hotelArrivals(calendarSelected),dep=hotelDepartures(calendarSelected);
 return `<div class="section-title"><h2>Agenda</h2><button class="btn" data-open="daycare-booking">+ Agendamento</button></div><div class="calendar-toolbar"><button class="btn small ghost" data-cal-prev>‹</button><strong>${monthLabel(m)}</strong><button class="btn small ghost" data-cal-next>›</button></div><div class="calendar card"><div class="cal-head">${WEEK.map(x=>`<span>${x}</span>`).join('')}</div><div class="cal-grid">${cells.join('')}</div></div>
 <div class="section-title"><h2>${new Date(calendarSelected+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</h2></div><div class="grid cols-2"><div class="card"><div class="kicker">Creche · ${plan.length}</div>${plan.map(({dog:d,source})=>`<div class="compact-line"><span><strong>${esc(d.name)}</strong><small>${source==='plano'?'Plano':source==='reposição'?'Reposição':'Avulso'}</small></span><button class="btn tiny-btn ghost" data-plan-action="${d.id}" data-date="${calendarSelected}">Alterar</button></div>`).join('')||'<div class="empty small-empty">Nenhum previsto.</div>'}</div><div class="card"><div class="kicker">Hotel · ${hs.length}</div>${hs.map(h=>`<div class="compact-line"><span><strong>${esc(dog(h.dogId)?.name)}</strong><small>${fmtShort(h.checkin)} → ${fmtShort(h.plannedCheckout||h.checkout)}</small></span><span class="badge">${h.status==='planned'?'Previsto':'Hotel'}</span></div>`).join('')||'<div class="empty small-empty">Nenhum hospedado.</div>'}</div></div>${(arr.length||dep.length)?`<div class="card" style="margin-top:14px"><div class="row"><div><div class="kicker">Entradas</div>${arr.map(h=>esc(dog(h.dogId)?.name)).join(', ')||'—'}</div><div class="right"><div class="kicker">Saídas</div>${dep.map(h=>esc(dog(h.dogId)?.name)).join(', ')||'—'}</div></div></div>`:''}`
}

function financePage(){const m=selectedMonth,mt=monthTotals(m);let rows='';db.tutors.forEach(t=>{const f=tutorTotals(t,m,'forecast'),r=tutorTotals(t,m,'realized');if(f.total||f.paid)rows+=`<tr><td>${esc(t.name)}</td><td>${money(f.total)}</td><td>${money(r.total)}</td><td>${money(f.paid)}</td><td><strong>${money(f.due)}</strong></td><td><button class="btn small ghost" data-fin="${t.id}">Detalhes</button></td></tr>`});return `<div class="section-title"><h2>Financeiro</h2><input class="input month-picker" id="financeMonth" type="month" value="${m}"></div><div class="grid cols-4"><div class="card featured"><div class="kicker">Previsão de faturamento</div><div class="metric money-metric">${money(mt.forecast)}</div><div class="muted">planos + reservas + extras conhecidos</div></div><div class="card"><div class="kicker">Já realizado</div><div class="metric money-metric">${money(mt.realized)}</div><div class="muted">serviços já ocorridos</div></div><div class="card"><div class="kicker">Já recebido</div><div class="metric money-metric">${money(mt.paid)}</div></div><div class="card"><div class="kicker">A receber previsto</div><div class="metric money-metric">${money(mt.due)}</div><div class="muted">${money(mt.remaining)} ainda previsto</div></div></div><div class="card" style="margin-top:14px"><div class="table-wrap"><table class="table"><thead><tr><th>Tutor</th><th>Previsto</th><th>Realizado</th><th>Pago</th><th>A receber</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="6" class="empty">Sem valores para este mês.</td></tr>'}</tbody></table></div></div>`}

function dogsPage(){return `<div class="section-title"><h2>Cães e tutores</h2><button class="btn" data-open="dog">+ Cadastrar</button></div><div class="grid cols-2">${db.dogs.map(d=>`<div class="card"><div class="row"><div class="dog-main">${dogAvatar(d)}<div><h3 style="margin:0">${esc(d.name)}</h3><div class="muted">${esc(tutor(d.tutorId)?.name||'')}</div></div></div><span class="badge ${d.active?'ok':'danger'}">${d.active?'Ativo':'Inativo'}</span></div><div class="divider"></div><div class="stack small-text"><div><strong>Creche:</strong> ${crecheText(d)}</div>${isSchedulePlan(d)?`<div><strong>Diária extra:</strong> ${money(d.extraDayValue)}</div>`:''}<div><strong>Hotel:</strong> ${money(d.hotelValue)}/diária</div></div><div class="actions"><button class="btn small ghost" data-edit-dog="${d.id}">Editar</button><button class="btn small secondary" data-plan-dog="${d.id}">Agenda</button></div></div>`).join('')||'<div class="card empty">Nenhum cachorro cadastrado.</div>'}</div>`}
function morePage(){return `<div class="section-title"><h2>Mais</h2></div><div class="grid cols-2"><div class="card stack"><h3>Cadastros e lançamentos</h3><button class="btn secondary" data-open="tutor">+ Cadastrar tutor</button><button class="btn ghost" data-open="bath">+ Banho</button><button class="btn ghost" data-open="extra">+ Serviço extra</button><button class="btn ghost" data-open="adjustment">+ Desconto / acréscimo</button><button class="btn ghost" data-open="payment">+ Registrar pagamento</button></div><div class="card stack"><h3>Hospedagens</h3><button class="btn" data-open="hotel">+ Nova reserva de hotel</button><button class="btn ghost" data-open="hotel-list">Ver reservas e alterar status</button><div class="notice">As datas registram a estadia, e o campo “Diárias cobradas” permite ajustar a quantidade efetivamente cobrada.</div></div><div class="card stack"><h3>Registros</h3><button class="btn ghost" data-open="records">Ver, alterar e cancelar registros</button><div class="notice">Agendamentos, presenças, hospedagens, banhos, extras, ajustes e pagamentos podem ser apagados individualmente.</div></div><div class="card stack"><h3>Backup</h3><button class="btn ghost" data-export>Exportar backup (.json)</button><label class="btn ghost" style="text-align:center">Importar backup<input id="importFile" type="file" accept="application/json" hidden></label><button class="btn danger" data-reset>Restaurar dados de exemplo</button></div><div class="card"><h3>Sobre esta versão</h3><p class="muted">V9: subtotais na imagem e edição/cancelamento de registros. V8: fechamento com altura dinâmica, versão padrão e completa. V7: navegação diária na aba Hoje, banhos, exclusão de registros, imagem de cobrança revisada e cálculo do “Já realizado” por diária efetivamente marcada.</p></div></div>`}
function modalHtml(){const titles={tutor:'Novo tutor',dog:'Novo cachorro',editdog:'Editar cachorro',hotel:'Reserva de hotel',edithotel:'Editar hospedagem','hotel-list':'Hospedagens',records:'Registros',editrecord:'Alterar serviço',bath:'Registrar banho',extra:'Serviço extra',adjustment:'Desconto / acréscimo',payment:'Registrar pagamento',finance:'Detalhes financeiros','daycare-booking':'Agendar creche',presence:'Registrar presença','plan-action':'Alterar dia da creche','dog-plan':'Agenda do cachorro'};return `<div class="modal-wrap"><div class="modal"><div class="modal-head"><h2>${titles[modal.type]||'Patas por aí'}</h2><button class="icon-btn" data-close>×</button></div>${modalBody()}</div></div>`}
function modalBody(){switch(modal.type){case'tutor':return formTutor();case'dog':return formDog();case'editdog':return formDog(dog(modal.id));case'hotel':return formHotel();case'edithotel':return formHotel(db.hotel.find(h=>h.id===modal.id));case'hotel-list':return hotelList();case'records':return recordsList();case'editrecord':return editRecordForm();case'bath':return formBath();case'extra':return formExtra();case'adjustment':return formAdjustment();case'payment':return formPayment();case'finance':return financeDetail();case'daycare-booking':return formDaycareBooking();case'presence':return formPresence();case'plan-action':return formPlanAction();case'dog-plan':return dogPlanDetail();default:return''}}
function formTutor(){return `<form id="tutorForm" class="stack"><div class="field"><label>Nome do tutor</label><input class="input" name="name" required></div><button class="btn">Salvar tutor</button></form>`}
function formDog(d){return `<form id="dogForm" class="stack"><input type="hidden" name="id" value="${d?.id||''}"><div class="field"><label>Foto do cachorro</label><div class="photo-field">${dogAvatar(d)}<input class="input" name="photo" type="file" accept="image/*"></div><div class="muted tiny">Opcional. A foto aparecerá na lista de buscas do dia.</div></div><div class="form-grid"><div class="field"><label>Nome do cachorro</label><input class="input" name="name" required value="${esc(d?.name||'')}"></div><div class="field"><label>Tutor</label><select class="select" name="tutorId" required>${tutorOptions(d?.tutorId)}</select></div><div class="field"><label>Tipo de cobrança da creche</label><select class="select" name="crecheType" id="crecheType"><option value="schedule_monthly" ${d?.crecheType==='schedule_monthly'?'selected':''}>Plano com dias fixos (ex.: 3x/semana)</option><option value="monthly" ${d?.crecheType==='monthly'?'selected':''}>Mensalidade sem dias fixos</option><option value="daily" ${d?.crecheType==='daily'?'selected':''}>Por diária/presença</option><option value="package" ${d?.crecheType==='package'?'selected':''}>Pacote de dias</option><option value="none" ${d?.crecheType==='none'?'selected':''}>Não faz creche</option></select></div><div class="field"><label>Mensalidade da creche</label><input class="input" name="monthlyValue" type="number" step="0.01" value="${d?.monthlyValue||0}"></div><div class="field"><label>Valor da diária normal</label><input class="input" name="crecheValue" type="number" step="0.01" value="${d?.crecheValue||0}"></div><div class="field"><label>Valor da diária extra</label><input class="input" name="extraDayValue" type="number" step="0.01" value="${d?.extraDayValue??d?.crecheValue??0}"></div><div class="field"><label>Pacote: quantidade de dias</label><input class="input" name="packageDays" type="number" value="${d?.packageDays||0}"></div><div class="field"><label>Pacote: valor</label><input class="input" name="packageValue" type="number" step="0.01" value="${d?.packageValue||0}"></div><div class="field"><label>Valor do banho</label><input class="input" name="bathValue" type="number" step="0.01" value="${d?.bathValue??0}"></div><div class="field"><label>Valor da diária de hotel</label><input class="input" name="hotelValue" type="number" step="0.01" value="${d?.hotelValue||0}"></div></div><div class="field"><label>Dias habituais da creche</label><div class="weekday-picks">${[1,2,3,4,5,6,0].map(i=>`<label><input type="checkbox" name="scheduleDays" value="${i}" ${(d?.scheduleDays||[]).includes(i)?'checked':''}><span>${WEEK[i]}</span></label>`).join('')}</div><div class="muted tiny">Ex.: plano 3x/semana pode ser Seg, Qua e Sex.</div></div><label><input type="checkbox" name="active" ${d?.active!==false?'checked':''}> Cachorro ativo</label><button class="btn">Salvar cachorro</button></form>`}
function formDaycareBooking(){return `<form id="daycareBookingForm" class="stack"><div class="field"><label>Cachorro</label><select class="select" name="dogId">${dogOptions()}</select></div><div class="form-grid"><div class="field"><label>Data</label><input class="input" type="date" name="date" value="${calendarSelected||today()}" required></div><div class="field"><label>Como tratar</label><select class="select" name="kind"><option value="plan">Plano</option><option value="extra">Diária extra</option><option value="replacement">Reposição</option><option value="courtesy">Cortesia</option><option value="custom">Valor personalizado</option></select></div><div class="field"><label>Valor (se extra/personalizado)</label><input class="input" type="number" step="0.01" name="rate" placeholder="usa a diária extra do cadastro"></div></div><button class="btn">Salvar agendamento</button></form>`}
function formHotel(h=null){const checkin=h?.checkin||today(),out=h?.plannedCheckout||h?.checkout||addDays(checkin,1),auto=daysBetween(checkin,out),charged=h?.chargedDays===null||h?.chargedDays===undefined?'':h.chargedDays;return `<form id="hotelForm" class="stack"><input type="hidden" name="id" value="${h?.id||''}"><div class="field"><label>Cachorro</label><select class="select" name="dogId">${dogOptions(h?.dogId||'')}</select></div><div class="form-grid"><div class="field"><label>Entrada</label><input class="input" type="date" name="checkin" value="${checkin}" required></div><div class="field"><label>Saída prevista</label><input class="input" type="date" name="plannedCheckout" value="${out}" required></div><div class="field"><label>Diárias cobradas</label><input class="input" type="number" min="0" step="1" name="chargedDays" value="${charged}" placeholder="Automático: ${auto}"></div><div class="field"><label>Valor da diária</label><input class="input" type="number" step="0.01" name="dailyRate" value="${h?.dailyRate??''}" placeholder="usa o valor do cadastro"></div><div class="field"><label>Status</label><select class="select" name="status"><option value="planned" ${!h||h.status==='planned'?'selected':''}>Previsto / reservado</option><option value="in_progress" ${h?.status==='in_progress'?'selected':''}>Já está hospedado</option><option value="completed" ${h?.status==='completed'?'selected':''}>Concluído</option><option value="cancelled" ${h?.status==='cancelled'?'selected':''}>Cancelado</option></select></div></div><div class="notice">As datas registram a estadia, mas a quantidade cobrada pode ser ajustada manualmente. Se “Diárias cobradas” ficar em branco, o app usa automaticamente a diferença entre entrada e saída.</div><button class="btn">${h?'Salvar alterações':'Salvar hospedagem'}</button></form>`}
function hotelList(){return `<div class="stack">${db.hotel.slice().sort((a,b)=>b.checkin.localeCompare(a.checkin)).map(h=>`<div class="card"><div class="row"><div><strong>${esc(dog(h.dogId)?.name)}</strong><div class="muted tiny">${fmtDate(h.checkin)} → ${fmtDate(h.plannedCheckout||h.checkout)} · ${hotelNights(h)} diária(s) cobrada(s) · ${money(hotelTotal(h))}</div></div><span class="badge ${h.status==='cancelled'?'danger':h.status==='completed'?'ok':''}">${({planned:'Previsto',in_progress:'Hospedado',completed:'Concluído',cancelled:'Cancelado'}[h.status]||h.status)}</span></div><div class="actions"><button class="btn small ghost" data-edit-hotel="${h.id}">Editar</button><button class="btn small danger" data-delete-record="${h.id}" data-record-kind="hotel">Apagar</button>${h.status==='planned'?`<button class="btn small secondary" data-hotel-status="${h.id}" data-status="in_progress">Iniciar</button>`:''}${h.status!=='completed'&&h.status!=='cancelled'?`<button class="btn small ghost" data-hotel-status="${h.id}" data-status="completed">Concluir</button><button class="btn small danger" data-hotel-status="${h.id}" data-status="cancelled">Cancelar</button>`:''}</div></div>`).join('')||'<div class="empty">Nenhuma hospedagem.</div>'}</div>`}
function formPresence(){const d=dog(modal.id),date=modal.date||today(),planned=isPlannedDaycare(d,date);return `<form id="presenceForm" class="stack"><input type="hidden" name="dogId" value="${d.id}"><input type="hidden" name="date" value="${date}"><div class="card"><strong>${esc(d.name)}</strong><div class="muted">${fmtDate(date)} · ${planned?'estava previsto':'fora da agenda habitual'}</div></div><div class="field"><label>Classificar presença</label><select class="select" name="kind"><option value="plan" ${planned?'selected':''}>Plano</option><option value="extra" ${!planned?'selected':''}>Diária extra</option><option value="replacement">Reposição</option><option value="courtesy">Cortesia</option><option value="custom">Valor personalizado</option></select></div><div class="field"><label>Valor (extra/personalizado)</label><input class="input" type="number" step="0.01" name="rate" value="${d.extraDayValue||d.crecheValue||0}"></div><button class="btn">Registrar presença</button></form>`}
function formPlanAction(){const d=dog(modal.id),date=modal.date;return `<form id="planActionForm" class="stack"><input type="hidden" name="dogId" value="${d.id}"><input type="hidden" name="fromDate" value="${date}"><div><strong>${esc(d.name)}</strong><div class="muted">Previsto em ${fmtDate(date)}</div></div><div class="field"><label>Ação</label><select class="select" name="action"><option value="move">Alterar somente esta ocorrência</option><option value="extra">Manter e marcar outro dia como extra</option><option value="courtesy">Adicionar outro dia como cortesia</option></select></div><div class="field"><label>Novo/outro dia</label><input class="input" type="date" name="toDate" value="${addDays(date,1)}" required></div><button class="btn">Salvar alteração</button></form>`}
function dogPlanDetail(){const d=dog(modal.id);return `<div class="stack"><div class="card"><strong>${esc(d.name)}</strong><div class="muted">${crecheText(d)}</div></div><div class="card"><div class="kicker">Dias habituais</div><div class="weekday-view">${(d.scheduleDays||[]).map(i=>`<span>${WEEK_FULL[i]}</span>`).join('')||'<span>Não definidos</span>'}</div></div><div class="card"><div class="kicker">Exceções futuras</div>${db.scheduleExceptions.filter(e=>e.dogId===d.id&&e.fromDate>=today()).map(e=>`<div class="compact-line"><span>${fmtDate(e.fromDate)} → ${fmtDate(e.toDate)}</span><span class="badge">Reposição</span></div>`).join('')||'<div class="muted">Nenhuma.</div>'}</div></div>`}
function formBath(){return `<form id="bathForm" class="stack"><div class="field"><label>Cachorro</label><select class="select" name="dogId">${dogOptions()}</select></div><div class="form-grid"><div class="field"><label>Valor do banho</label><input class="input" type="number" step="0.01" name="value" required></div><div class="field"><label>Data</label><input class="input" type="date" name="date" value="${todaySelected||today()}" required></div></div><button class="btn">Registrar banho</button></form>`}
function recordsList(){
 const items=[];
 db.daycareBookings.forEach(x=>items.push({kind:'daycareBookings',id:x.id,date:x.date,title:`Agendamento de creche · ${dog(x.dogId)?.name||'Cão'}`,detail:`${fmtDate(x.date)} · ${x.kind==='extra'?'Diária extra':x.kind==='replacement'?'Reposição':x.kind==='courtesy'?'Cortesia':'Plano/avulso'}`}));
 db.attendance.forEach(x=>items.push({kind:'attendance',id:x.id,date:x.date,title:`Presença · ${dog(x.dogId)?.name||'Cão'}`,detail:`${fmtDate(x.date)} · ${attendanceLabel(x)}`}));
 db.hotel.forEach(x=>items.push({kind:'hotel',id:x.id,date:x.checkin,title:`Hospedagem · ${dog(x.dogId)?.name||'Cão'}`,detail:`${fmtDate(x.checkin)} → ${fmtDate(x.plannedCheckout||x.checkout)} · ${hotelNights(x)} diária(s) cobrada(s)`}));
 db.extras.forEach(x=>items.push({kind:'extras',id:x.id,date:x.date,title:`${x.label} · ${dog(x.dogId)?.name||'Cão'}`,detail:`${fmtDate(x.date)} · ${money(x.value)}`}));
 db.adjustments.forEach(x=>items.push({kind:'adjustments',id:x.id,date:x.month+'-01',title:`Ajuste · ${dog(x.dogId)?.name||'Cão'}`,detail:`${x.label} · ${money(x.value)} · ${monthLabel(x.month)}`}));
 db.payments.forEach(x=>items.push({kind:'payments',id:x.id,date:x.date,title:`Pagamento · ${tutor(x.tutorId)?.name||'Tutor'}`,detail:`${fmtDate(x.date)} · ${money(x.value)} · ${monthLabel(x.month)}`}));
 db.scheduleExceptions.forEach(x=>items.push({kind:'scheduleExceptions',id:x.id,date:x.fromDate,title:`Alteração de agenda · ${dog(x.dogId)?.name||'Cão'}`,detail:`${fmtDate(x.fromDate)} → ${fmtDate(x.toDate)}`}));
 items.sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 return `<div class="stack">${items.map(x=>`<div class="card"><div class="row"><div><strong>${esc(x.title)}</strong><div class="muted tiny">${esc(x.detail)}</div></div><div class="actions"><button class="btn small ghost" data-edit-record="${x.id}" data-record-kind="${x.kind}">Alterar</button><button class="btn small danger" data-delete-record="${x.id}" data-record-kind="${x.kind}">Apagar</button></div></div></div>`).join('')||'<div class="empty">Nenhum registro para apagar.</div>'}</div>`;
}

function editRecordForm(){
 const kind=modal.kind,record=(db[kind]||[]).find(x=>x.id===modal.id);
 if(!record)return '<div class="empty">Registro não encontrado.</div>';
 const fields={
  daycareBookings:[['dogId','Cachorro','dog'],['date','Data','date'],['kind','Classificação','bookingKind'],['rate','Valor','number'],['status','Status','bookingStatus']],
  attendance:[['dogId','Cachorro','dog'],['date','Data','date'],['kind','Classificação','attendanceKind'],['rate','Valor','number']],
  scheduleExceptions:[['dogId','Cachorro','dog'],['fromDate','Data original','date'],['toDate','Nova data','date']],
  hotel:[['dogId','Cachorro','dog'],['checkin','Entrada','date'],['plannedCheckout','Saída','date'],['chargedDays','Diárias cobradas','number'],['dailyRate','Valor da diária','number'],['status','Status','hotelStatus']],
  extras:[['dogId','Cachorro','dog'],['label','Serviço','text'],['date','Data','date'],['value','Valor','number']],
  adjustments:[['dogId','Cachorro','dog'],['label','Descrição','text'],['month','Mês','month'],['value','Valor','number']],
  payments:[['tutorId','Tutor','tutor'],['month','Mês','month'],['date','Data','date'],['value','Valor','number']]
 };
 const choices={
 bookingKind:[['plan','Plano'],['extra','Diária extra'],['replacement','Reposição'],['courtesy','Cortesia'],['custom','Personalizado']],
 attendanceKind:[['plan','Plano'],['extra','Diária extra'],['replacement','Reposição'],['courtesy','Cortesia'],['custom','Personalizado']],
 bookingStatus:[['planned','Agendado'],['completed','Realizado'],['cancelled','Cancelado']],
 hotelStatus:[['planned','Previsto'],['in_progress','Hospedado'],['completed','Concluído'],['cancelled','Cancelado']]
 };
 const field=([name,label,type])=>{
  let input;
  if(type==='dog')input=`<select class="select" name="${name}">${dogOptions(record[name])}</select>`;
  else if(type==='tutor')input=`<select class="select" name="${name}">${tutorOptions(record[name])}</select>`;
  else if(choices[type])input=`<select class="select" name="${name}">${choices[type].map(([v,l])=>`<option value="${v}" ${record[name]===v?'selected':''}>${l}</option>`).join('')}</select>`;
  else input=`<input class="input" name="${name}" type="${type}" ${type==='number'?'step="0.01"':''} value="${esc(record[name]??'')}">`;
  return `<div class="field"><label>${label}</label>${input}</div>`;
 };
 return `<form id="editRecordForm" class="stack">${(fields[kind]||[]).map(field).join('')}<div class="actions"><button class="btn" type="submit">Salvar alterações</button><button class="btn secondary" type="button" data-cancel-record="${record.id}" data-record-kind="${kind}">Cancelar serviço</button></div></form>`;
}

function formExtra(){return `<form id="extraForm" class="stack"><div class="field"><label>Cachorro</label><select class="select" name="dogId">${dogOptions()}</select></div><div class="form-grid"><div class="field"><label>Serviço/extra</label><input class="input" name="label" placeholder="Banho, transporte..." required></div><div class="field"><label>Valor</label><input class="input" type="number" step="0.01" name="value" required></div><div class="field"><label>Data</label><input class="input" type="date" name="date" value="${today()}" required></div></div><button class="btn">Registrar extra</button></form>`}
function formAdjustment(){return `<form id="adjustmentForm" class="stack"><div class="field"><label>Cachorro</label><select class="select" name="dogId">${dogOptions()}</select></div><div class="form-grid"><div class="field"><label>Descrição</label><input class="input" name="label" placeholder="Desconto, acréscimo..." required></div><div class="field"><label>Valor</label><input class="input" type="number" step="0.01" name="value" placeholder="Use negativo para desconto" required></div><div class="field"><label>Competência</label><input class="input" type="month" name="month" value="${selectedMonth}" required></div></div><button class="btn">Salvar ajuste</button></form>`}
function formPayment(){return `<form id="paymentForm" class="stack"><div class="field"><label>Tutor</label><select class="select" name="tutorId">${tutorOptions()}</select></div><div class="form-grid"><div class="field"><label>Valor recebido</label><input class="input" type="number" step="0.01" name="value" required></div><div class="field"><label>Competência</label><input class="input" type="month" name="month" value="${selectedMonth}" required></div><div class="field"><label>Data do pagamento</label><input class="input" type="date" name="date" value="${today()}" required></div></div><button class="btn">Registrar pagamento</button></form>`}
function billingItemsDog(d,m){
 const items=[];
 const plan=monthRecurringPlanValue(d,m);
 if(plan){items.push({description:`Plano creche${isSchedulePlan(d)?` ${(d.scheduleDays||[]).length}x/semana`:''}`,details:isSchedulePlan(d)?`${(d.scheduleDays||[]).map(i=>WEEK[i]).join(' • ')} (mensal)`:'Mensal',value:plan})}
 const bookings=db.daycareBookings.filter(b=>b.dogId===d.id&&inMonth(b.date,m)&&b.status!=='cancelled');
 bookings.forEach(b=>{const v=bookingValue(b,d);if(v)items.push({description:b.kind==='extra'?'Diária extra':b.kind==='custom'?'Creche avulsa':'Creche',details:fmtDate(b.date),value:v})});
 const bookedDates=new Set(bookings.map(b=>b.date));
 if(d.crecheType==='daily'){
  db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&!['courtesy','replacement'].includes(a.kind)&&!bookedDates.has(a.date)).forEach(a=>items.push({description:'Creche por diária',details:fmtDate(a.date),value:Number((a.rate??d.crecheValue)||0)}));
 }else{
  db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&!bookedDates.has(a.date)&&['extra','custom'].includes(a.kind)).forEach(a=>items.push({description:a.kind==='extra'?'Diária extra':'Valor personalizado',details:fmtDate(a.date),value:attendanceValue(a,d)}));
 }
 if(d.crecheType==='package'){
  const count=db.attendance.filter(a=>a.dogId===d.id&&inMonth(a.date,m)&&a.kind!=='courtesy').length;
  if(count){const packs=Math.ceil(count/Math.max(1,Number(d.packageDays||1)));items.push({description:`Pacote de creche`,details:`${packs} pacote(s) • ${count} presença(s)`,value:packs*Number(d.packageValue||0)})}
 }
 db.hotel.filter(h=>h.dogId===d.id&&h.status!=='cancelled'&&hotelMonthValue(h,m)>0).forEach(h=>{items.push({description:'Hospedagem',details:`${fmtDate(h.checkin)} a ${fmtDate(h.plannedCheckout||h.checkout)} (${hotelNights(h)} diária${hotelNights(h)===1?'':'s'})`,value:hotelMonthValue(h,m)})});
 db.extras.filter(e=>e.dogId===d.id&&inMonth(e.date,m)).forEach(e=>items.push({description:e.label,details:fmtDate(e.date),value:Number(e.value)}));
 db.adjustments.filter(a=>a.dogId===d.id&&a.month===m).forEach(a=>items.push({description:a.label,details:'Ajuste',value:Number(a.value)}));
 return items;
}
function billingData(t,m){const c=tutorTotals(t,m,'forecast');const dogs=db.dogs.filter(d=>d.tutorId===t.id).map(d=>({dog:d,items:billingItemsDog(d,m),subtotal:monthForecastDog(d,m).total})).filter(x=>x.items.length||x.subtotal);return {tutor:t,month:m,dogs,total:c.total,paid:c.paid,due:c.due}}
function roundRect(ctx,x,y,w,h,r,fill,stroke){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.stroke()}}
function fitText(ctx,text,maxWidth){let out=String(text);if(ctx.measureText(out).width<=maxWidth)return out;while(out.length>3&&ctx.measureText(out+'…').width>maxWidth)out=out.slice(0,-1);return out+'…'}
function loadCanvasImage(src){return new Promise(resolve=>{if(!src){resolve(null);return}const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=src})}
function drawLeafSprig(ctx,x,y,flip=1){ctx.save();ctx.translate(x,y);ctx.scale(flip,1);ctx.strokeStyle='#526b32';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(55,55,95,132);ctx.stroke();for(let i=0;i<5;i++){const px=15+i*17,py=18+i*22;ctx.fillStyle=i%2?'#8b956b':'#667c48';ctx.save();ctx.translate(px,py);ctx.rotate(-.55);ctx.beginPath();ctx.ellipse(0,0,11,27,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.save();ctx.translate(px+24,py+8);ctx.rotate(.65);ctx.beginPath();ctx.ellipse(0,0,10,24,0,0,Math.PI*2);ctx.fill();ctx.restore()}ctx.restore()}
function drawPaw(ctx,x,y,s=1,color='#4f642d'){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,10,15,13,0,0,Math.PI*2);ctx.fill();[[-14,-4],[-5,-13],[6,-13],[15,-4]].forEach(([px,py])=>{ctx.beginPath();ctx.ellipse(px,py,6,8,0,0,Math.PI*2);ctx.fill()});ctx.restore()}
function drawBone(ctx,x,y,s=1,color='#a7a582'){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-.2);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(18,0);ctx.stroke();[[-22,-5],[-22,5],[22,-5],[22,5]].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,6,0,Math.PI*2);ctx.stroke()});ctx.restore()}

function billingRows(items,mode){
 if(mode==='complete')return items.map(i=>({...i}));
 const groups=[];
 for(const item of items){
  const key=item.description;
  let g=groups.find(x=>x.description===key);
  if(!g){g={description:key,details:[],value:0};groups.push(g)}
  g.value+=Number(item.value)||0;
  if(item.details&&!g.details.includes(item.details))g.details.push(item.details);
 }
 return groups.map(g=>({...g,details:g.details.join(' • ')}));
}
function billingWrappedLines(ctx,text,maxWidth){
 const words=String(text||'').split(/\s+/),out=[];let line='';
 for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){out.push(line);line=word}else line=next}
 if(line)out.push(line);return out.length?out:[''];
}
function billingHeart(ctx,x,y,size=27){
 ctx.save();ctx.translate(x,y);ctx.scale(size/30,size/30);ctx.strokeStyle='#445c2a';ctx.lineWidth=2.7;ctx.beginPath();ctx.moveTo(0,9);ctx.bezierCurveTo(-31,-9,-17,-27,0,-11);ctx.bezierCurveTo(17,-27,31,-9,0,9);ctx.stroke();ctx.restore()
}
async function createBillingCanvas(t,m,mode='standard'){
 const data=billingData(t,m),W=1080,headerH=465,gap=14,margin=50,footH=206;
 const measuring=document.createElement('canvas').getContext('2d');
 measuring.font='21px Arial';
 const blocks=data.dogs.map(d=>{
  const rows=billingRows(d.items,mode);
  const heights=rows.map(i=>Math.max(48,22+Math.max(billingWrappedLines(measuring,i.details,270).length,billingWrappedLines(measuring,i.description,230).length)*25));
  return {...d,rows,heights,height:142+heights.reduce((a,b)=>a+b,0)+92};
 });
 const contentH=blocks.reduce((a,b)=>a+b.height,0)+Math.max(0,blocks.length-1)*gap;
 const H=headerH+contentH+footH+20;
 const c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d');
 const bg='#f7f1e7',ink='#30441c',brown='#513522',olive='#394e21',soft='#e9dfca',line='#dbc8aa';
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 // Header: fixed geometry, only month/year changes.
 ctx.textBaseline='middle';ctx.textAlign='center';
 drawPaw(ctx,272,88,1.5,olive);
 ctx.fillStyle=olive;ctx.font='italic 76px Georgia, serif';ctx.fillText('Cãoportamental',590,90);
 ctx.fillStyle=brown;ctx.font='23px Arial';ctx.fillText('CRECHE & BEM-ESTAR',W/2,159);ctx.fillText('PARA SEU MELHOR AMIGO  ♡',W/2,190);
 billingHeart(ctx,110,157,36);billingHeart(ctx,930,116,39);
 drawPaw(ctx,55,340,1.2,'#dfd0b4');drawPaw(ctx,1015,300,1.15,'#dfd0b4');
 roundRect(ctx,310,221,460,59,17,olive);ctx.fillStyle='#fff';ctx.font='34px Arial';ctx.fillText('FECHAMENTO',W/2,252);
 ctx.fillStyle=ink;ctx.font='bold 53px Arial';ctx.fillText(monthLabel(m).toUpperCase(),W/2,323);
 roundRect(ctx,205,364,670,81,19,'#eee4d3');
 ctx.fillStyle=brown;ctx.font='23px Arial';ctx.fillText('Obrigado pela confiança!',W/2,388);
 ctx.fillText('Cuidar do seu melhor amigo é o que nos move.',W/2,418);
 billingHeart(ctx,240,402,27);billingHeart(ctx,836,402,19);
 let y=headerH;
 const photos=await Promise.all(blocks.map(b=>loadCanvasImage(b.dog.photo)));
 for(let k=0;k<blocks.length;k++){
  const b=blocks[k],h=b.height;
  roundRect(ctx,margin,y,W-2*margin,h,23,'#fcfaf6','#e7d5bb');
  const cx=162,cy=y+87,r=87;
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.clip();
  const img=photos[k];
  if(img){const sc=Math.max(2*r/img.width,2*r/img.height);ctx.drawImage(img,cx-img.width*sc/2,cy-img.height*sc/2,img.width*sc,img.height*sc)}
  else {ctx.fillStyle=soft;ctx.fillRect(cx-r,cy-r,2*r,2*r)}
  ctx.restore();if(!img)drawPaw(ctx,cx,cy,.95,olive);
  ctx.textAlign='left';ctx.fillStyle=ink;ctx.font='bold 43px Arial';ctx.fillText(b.dog.name,293,y+58);
  drawPaw(ctx,Math.min(870,315+ctx.measureText(b.dog.name).width),y+54,.45,olive);
  ctx.strokeStyle=line;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(292,y+99);ctx.lineTo(975,y+99);ctx.stroke();ctx.setLineDash([]);
  ctx.font='bold 17px Arial';ctx.fillText('DESCRIÇÃO',310,y+127);ctx.fillText('DETALHES',566,y+127);ctx.textAlign='right';ctx.fillText('VALOR',967,y+127);
  let ry=y+142;
  for(let i=0;i<b.rows.length;i++){
   const item=b.rows[i],rh=b.heights[i];
   ctx.strokeStyle=line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(285,ry);ctx.lineTo(970,ry);ctx.stroke();
   ctx.fillStyle=brown;ctx.font='20px Arial';ctx.textAlign='left';
   const desc=billingWrappedLines(ctx,item.description,230),details=billingWrappedLines(ctx,item.details,270);
   desc.forEach((line,j)=>ctx.fillText(line,310,ry+23+j*25));
   details.forEach((line,j)=>ctx.fillText(line,566,ry+23+j*25));
   ctx.textAlign='right';ctx.fillText(money(item.value),967,ry+23);
   const label=item.description.toLowerCase();
   ctx.fillStyle=olive;
   if(label.includes('banho'))ctx.fillText('✦',275,ry+23);
   else if(label.includes('hosped'))ctx.fillText('⌂',275,ry+23);
   else ctx.fillText('●',275,ry+23);
   ry+=rh;
  }
  ctx.textAlign='right';ctx.fillStyle=olive;ctx.font='bold 20px Arial';
  ctx.fillText('SUBTOTAL '+b.dog.name.toUpperCase(),782,ry+47);
  roundRect(ctx,798,ry+20,170,54,12,soft);ctx.fillStyle=ink;ctx.font='bold 24px Arial';ctx.textAlign='right';ctx.fillText(money(b.subtotal),957,ry+48);
  y+=h+gap;
 }
 if(blocks.length)y-=gap;
 // Fixed footer: same geometry for every statement; only total changes.
 const fy=y+14;
 roundRect(ctx,margin,fy,W-2*margin,139,20,'#efe6d5',line);
 billingHeart(ctx,125,fy+76,58);
 ctx.fillStyle=brown;ctx.textAlign='center';ctx.font='italic 21px Georgia';
 ctx.fillText('Mais que uma creche,',293,fy+47);
 ctx.fillText('uma segunda casa',293,fy+73);
 ctx.fillText('para o seu melhor amigo!',293,fy+99);
 ctx.fillStyle=olive;ctx.font='bold 29px Arial';ctx.fillText('TOTAL GERAL',688,fy+36);
 roundRect(ctx,503,fy+58,365,71,15,olive);
 ctx.fillStyle='#fff';ctx.font='bold 43px Arial';ctx.fillText(money(data.total),685,fy+94);
 drawPaw(ctx,931,fy+76,1.1,olive);
 roundRect(ctx,203,fy+147,680,43,14,'#eee4d3');
 ctx.fillStyle=brown;ctx.font='18px Arial';ctx.fillText('Dúvidas ou ajustes? Fale com a gente! Estamos aqui para ajudar.',W/2,fy+169);
 return c;
}
async function billingBlob(t,m,mode='standard'){const c=await createBillingCanvas(t,m,mode);return new Promise(resolve=>c.toBlob(resolve,'image/png'))}
async function downloadBillingImage(t,m,mode='standard'){
 const blob=await billingBlob(t,m,mode);if(!blob)throw Error('Falha ao gerar PNG');
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);
 a.download=`Fechamento-Caoportamental-${mode==='complete'?'completo-':'padrao-'}${m}-${t.name.replace(/[^a-z0-9]+/gi,'-')}.png`;
 a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)
}
async function shareBillingImage(t,m){
 const blob=await billingBlob(t,m,'standard'),file=new File([blob],`Fechamento-Caoportamental-${m}.png`,{type:'image/png'});
 if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],title:'Fechamento Cãoportamental',text:`Fechamento referente a ${monthLabel(m)}.`});
 else {await downloadBillingImage(t,m,'standard');alert('A imagem foi baixada. Você pode anexá-la no aplicativo de mensagens.')}
}
function financeDetail(){const t=tutor(modal.id),m=selectedMonth,c=tutorTotals(t,m,'forecast'),r=tutorTotals(t,m,'realized');const lines=c.details.map(x=>`<div class="card"><strong>${esc(x.dog)}</strong>${x.details.map(z=>`<div class="muted detail-line">${esc(z)}</div>`).join('')}<div class="right"><strong>${money(x.total)}</strong></div></div>`).join('');return `<div class="stack">${lines||'<div class="empty">Sem lançamentos.</div>'}<div class="card"><div class="row"><span>Previsto</span><strong>${money(c.total)}</strong></div><div class="row"><span>Realizado</span><span>${money(r.total)}</span></div><div class="row"><span>Pago</span><span>${money(c.paid)}</span></div><div class="row"><span>A receber</span><strong>${money(c.due)}</strong></div></div><div class="billing-actions"><button class="btn" data-billing-download="${t.id}">Baixar padrão (com datas)</button><button class="btn secondary" data-billing-download-complete="${t.id}">Baixar completo</button><button class="btn secondary" data-billing-share="${t.id}">Compartilhar imagem</button></div><div class="notice">A imagem usa as fotos cadastradas dos cães e discrimina plano, diárias, hospedagem, banhos e demais serviços. Em celulares compatíveis, “Compartilhar imagem” abre as opções de compartilhamento do aparelho.</div></div>`}

function bind(){
 document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{view=b.dataset.nav;modal=null;render()});
 document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{modal={type:b.dataset.open};render()});
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>{modal=null;render()});
 const tprev=document.querySelector('[data-today-prev]');if(tprev)tprev.onclick=()=>{todaySelected=addDays(todaySelected,-1);render()};
 const tnext=document.querySelector('[data-today-next]');if(tnext)tnext.onclick=()=>{todaySelected=addDays(todaySelected,1);render()};
 const treset=document.querySelector('[data-today-reset]');if(treset)treset.onclick=()=>{todaySelected=today();render()};
 document.querySelectorAll('[data-day-presence]').forEach(b=>b.onclick=()=>{const id=b.dataset.dayPresence,date=b.dataset.date,a=attendanceOn(id,date);if(a){if(confirm('Remover a presença registrada?')){db.attendance=db.attendance.filter(x=>x.id!==a.id);save()}}else{modal={type:'presence',id,date};render()}});
 document.querySelectorAll('[data-fin]').forEach(b=>b.onclick=()=>{modal={type:'finance',id:b.dataset.fin};render()});
 document.querySelectorAll('[data-billing-download]').forEach(b=>b.onclick=async()=>{const t=tutor(b.dataset.billingDownload);b.disabled=true;const old=b.textContent;b.textContent='Gerando...';try{await downloadBillingImage(t,selectedMonth)}finally{b.disabled=false;b.textContent=old}});
 document.querySelectorAll('[data-billing-download-complete]').forEach(b=>b.onclick=async()=>{const t=tutor(b.dataset.billingDownloadComplete);b.disabled=true;try{await downloadBillingImage(t,selectedMonth,'complete')}catch(e){alert('Não foi possível gerar a imagem completa.')}finally{b.disabled=false}});
 document.querySelectorAll('[data-billing-share]').forEach(b=>b.onclick=async()=>{const t=tutor(b.dataset.billingShare);b.disabled=true;const old=b.textContent;b.textContent='Preparando...';try{await shareBillingImage(t,selectedMonth)}catch(e){if(e?.name!=='AbortError')alert('Não foi possível compartilhar a imagem.')}finally{b.disabled=false;b.textContent=old}});
 document.querySelectorAll('[data-edit-dog]').forEach(b=>b.onclick=()=>{modal={type:'editdog',id:b.dataset.editDog};render()});
 document.querySelectorAll('[data-plan-dog]').forEach(b=>b.onclick=()=>{modal={type:'dog-plan',id:b.dataset.planDog};render()});
 document.querySelectorAll('[data-plan-action]').forEach(b=>b.onclick=()=>{modal={type:'plan-action',id:b.dataset.planAction,date:b.dataset.date};render()});
 document.querySelectorAll('[data-cal-day]').forEach(b=>b.onclick=()=>{calendarSelected=b.dataset.calDay;render()});
 const prev=document.querySelector('[data-cal-prev]');if(prev)prev.onclick=()=>{const d=dateObj(calendarMonth+'-01');d.setMonth(d.getMonth()-1);calendarMonth=monthKey(iso(d));calendarSelected=calendarMonth+'-01';render()};
 const next=document.querySelector('[data-cal-next]');if(next)next.onclick=()=>{const d=dateObj(calendarMonth+'-01');d.setMonth(d.getMonth()+1);calendarMonth=monthKey(iso(d));calendarSelected=calendarMonth+'-01';render()};
 const fm=document.querySelector('#financeMonth');if(fm)fm.onchange=e=>{selectedMonth=e.target.value;render()};
 document.querySelectorAll('[data-edit-hotel]').forEach(b=>b.onclick=()=>{modal={type:'edithotel',id:b.dataset.editHotel};render()});
 document.querySelectorAll('[data-hotel-status]').forEach(b=>b.onclick=()=>{const h=db.hotel.find(x=>x.id===b.dataset.hotelStatus);if(!h)return;h.status=b.dataset.status;if(h.status==='completed')h.checkout=h.plannedCheckout||today();if(h.status==='cancelled')h.checkout=null;save()});
 document.querySelectorAll('[data-edit-record]').forEach(b=>b.onclick=()=>{modal={type:'editrecord',id:b.dataset.editRecord,kind:b.dataset.recordKind};render()});
 document.querySelectorAll('[data-cancel-record]').forEach(b=>b.onclick=()=>{if(!confirm('Cancelar este serviço?'))return;const kind=b.dataset.recordKind,id=b.dataset.cancelRecord,r=(db[kind]||[]).find(x=>x.id===id);if(!r)return;if(kind==='hotel'||kind==='daycareBookings')r.status='cancelled';else {db[kind]=db[kind].filter(x=>x.id!==id);if(kind==='attendance'){const booking=db.daycareBookings.find(x=>x.dogId===r.dogId&&x.date===r.date&&x.status==='completed');if(booking)booking.status='planned'}}modal={type:'records'};save()});
 const editForm=document.querySelector('#editRecordForm');if(editForm)editForm.onsubmit=e=>{e.preventDefault();const kind=modal.kind,r=(db[kind]||[]).find(x=>x.id===modal.id);if(!r)return;const f=new FormData(e.target);for(const [key,value] of f.entries()){r[key]=['value','rate','dailyRate','chargedDays'].includes(key)?(value===''&&key==='chargedDays'?null:Number(value)):value}if(kind==='hotel'){if(r.plannedCheckout<=r.checkin){alert('A saída deve ser posterior à entrada.');return}r.checkout=r.status==='completed'?r.plannedCheckout:null}modal={type:'records'};save()};
 document.querySelectorAll('[data-delete-record]').forEach(b=>b.onclick=()=>{const kind=b.dataset.recordKind,id=b.dataset.deleteRecord;if(!confirm('Apagar este registro? Esta ação não pode ser desfeita.'))return;if(!Array.isArray(db[kind]))return;db[kind]=db[kind].filter(x=>x.id!==id);save()});
 if(document.querySelector('#tutorForm'))document.querySelector('#tutorForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.tutors.push({id:uid(),name:f.get('name')});modal=null;save()};
 if(document.querySelector('#dogForm'))document.querySelector('#dogForm').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),id=f.get('id')||uid(),days=f.getAll('scheduleDays').map(Number),i=db.dogs.findIndex(x=>x.id===id),previous=i>=0?db.dogs[i]:null,file=f.get('photo');let photo=previous?.photo||null;if(file&&file.size)photo=await resizeDogPhoto(file);const obj={id,name:f.get('name'),tutorId:f.get('tutorId'),crecheType:f.get('crecheType'),scheduleDays:days,crecheValue:+f.get('crecheValue')||0,extraDayValue:+f.get('extraDayValue')||0,monthlyValue:+f.get('monthlyValue')||0,packageDays:+f.get('packageDays')||0,packageValue:+f.get('packageValue')||0,hotelValue:+f.get('hotelValue')||0,bathValue:+f.get('bathValue')||0,referenceMonthlyValue:previous?.referenceMonthlyValue??(+f.get('monthlyValue')||0),active:f.get('active')==='on',photo};if(i>=0)db.dogs[i]=obj;else db.dogs.push(obj);modal=null;save()};
 if(document.querySelector('#daycareBookingForm'))document.querySelector('#daycareBookingForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),d=dog(f.get('dogId')),kind=f.get('kind'),rate=+f.get('rate')||((kind==='extra'||kind==='custom')?(d.extraDayValue||d.crecheValue):0);db.daycareBookings.push({id:uid(),dogId:d.id,date:f.get('date'),kind,rate,status:'planned'});modal=null;save()};
 if(document.querySelector('#presenceForm'))document.querySelector('#presenceForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),d=dog(f.get('dogId')),kind=f.get('kind');let rate=0;if(kind==='plan')rate=Number(d.crecheValue||0);else if(kind==='extra'||kind==='custom')rate=+f.get('rate')||d.extraDayValue||d.crecheValue||0;db.attendance.push({id:uid(),dogId:d.id,date:f.get('date'),kind,rate});const b=db.daycareBookings.find(x=>x.dogId===d.id&&x.date===f.get('date')&&x.status==='planned');if(b)b.status='completed';modal=null;save()};
 if(document.querySelector('#planActionForm'))document.querySelector('#planActionForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),action=f.get('action'),d=dog(f.get('dogId')),from=f.get('fromDate'),to=f.get('toDate');if(action==='move')db.scheduleExceptions.push({id:uid(),dogId:d.id,fromDate:from,toDate:to});else db.daycareBookings.push({id:uid(),dogId:d.id,date:to,kind:action==='courtesy'?'courtesy':'extra',rate:action==='courtesy'?0:(d.extraDayValue||d.crecheValue||0),status:'planned'});modal=null;save()};
 if(document.querySelector('#hotelForm'))document.querySelector('#hotelForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),d=dog(f.get('dogId')),a=f.get('checkin'),b=f.get('plannedCheckout'),id=f.get('id'),rawDays=f.get('chargedDays'),chargedDays=rawDays===''?null:Math.max(0,Math.floor(Number(rawDays)||0));if(b<=a){alert('A saída precisa ser posterior à entrada.');return}const previous=id?db.hotel.find(h=>h.id===id):null,obj={id:id||uid(),dogId:d.id,checkin:a,plannedCheckout:b,checkout:previous?.checkout||null,chargedDays,dailyRate:+f.get('dailyRate')||d.hotelValue||0,status:f.get('status')};if(obj.status==='completed'&&!obj.checkout)obj.checkout=b;if(obj.status!=='completed')obj.checkout=null;const i=id?db.hotel.findIndex(h=>h.id===id):-1;if(i>=0)db.hotel[i]=obj;else db.hotel.push(obj);modal=null;save()};
 if(document.querySelector('#bathForm'))document.querySelector('#bathForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.extras.push({id:uid(),dogId:f.get('dogId'),label:'Banho',value:+f.get('value'),date:f.get('date')});modal=null;save()};
 if(document.querySelector('#extraForm'))document.querySelector('#extraForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.extras.push({id:uid(),dogId:f.get('dogId'),label:f.get('label'),value:+f.get('value'),date:f.get('date')});modal=null;save()};
 if(document.querySelector('#adjustmentForm'))document.querySelector('#adjustmentForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.adjustments.push({id:uid(),dogId:f.get('dogId'),label:f.get('label'),value:+f.get('value'),month:f.get('month')});modal=null;save()};
 if(document.querySelector('#paymentForm'))document.querySelector('#paymentForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);db.payments.push({id:uid(),tutorId:f.get('tutorId'),value:+f.get('value'),month:f.get('month'),date:f.get('date')});modal=null;save()};
 const reset=document.querySelector('[data-reset]');if(reset)reset.onclick=()=>{if(confirm('Apagar todos os dados locais e restaurar o exemplo?')){db=structuredClone(seed);save()}};
 const exp=document.querySelector('[data-export]');if(exp)exp.onclick=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='caoportamental-v2-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 const imp=document.querySelector('#importFile');if(imp)imp.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{db=migrate(JSON.parse(await f.text()));save()}catch{alert('Arquivo inválido')}};
}
render();
