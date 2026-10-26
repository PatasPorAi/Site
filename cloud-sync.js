
(() => {
 const cfg=window.CAO_CLOUD_CONFIG||{};
 let client=null,session=null,remoteVersion=null,loading=true,pending=false,saving=false,timer=null,lastError='',channel=null,remoteCheck=null;
 const hasConfig=!!(cfg.url&&cfg.publishableKey);
 const root=()=>document.getElementById('app');
 function screen(title,body){
  root().innerHTML=`<div style="min-height:100vh;background:#f4f0e4;padding:30px 15px;display:grid;place-items:center;font-family:Arial,sans-serif;color:#30441c">
  <div style="background:white;border-radius:20px;padding:28px;width:min(100%,460px);box-shadow:0 8px 28px #30441c22">
  <h1 style="margin-top:0">${title}</h1>${body}</div></div>`;
 }
 function msg(text,isError=false){
  const el=document.getElementById('cloud-msg');
  if(el){el.style.color=isError?'#a32929':'#30441c';el.textContent=text}
 }
 function status(){
  let el=document.getElementById('cloud-status');
  if(!el){el=document.createElement('div');el.id='cloud-status';el.style.cssText='position:fixed;bottom:75px;right:10px;background:#f7f1e7;color:#30441c;border:1px solid #d3c7a9;border-radius:12px;padding:6px 10px;font:12px Arial;z-index:9999;max-width:240px';document.body.appendChild(el)}
  el.textContent=lastError?'⚠ Sincronização pendente: '+lastError:(saving||pending?'⟳ Salvando na nuvem':'☁ Dados sincronizados');
  el.title='Clique para sair da conta';el.style.cursor='pointer';el.onclick=()=>{if(confirm('Sair da conta?'))client?.auth.signOut()};
 }
 function loginUI(){
  screen('Cãoportamental ☁',`<p>Entre para acessar os mesmos registros no celular e no computador.</p>
  <form id="cloud-login" style="display:grid;gap:12px">
  <input name="email" type="email" placeholder="E-mail" required style="padding:12px;border-radius:8px;border:1px solid #aaa">
  <input name="password" type="password" placeholder="Senha (mínimo 6 caracteres)" minlength="6" required style="padding:12px;border-radius:8px;border:1px solid #aaa">
  <button type="submit" style="padding:12px;border:0;border-radius:8px;background:#394e21;color:white">Entrar</button>
  <button type="button" id="cloud-register" style="padding:12px;border:1px solid #394e21;border-radius:8px;background:white">Criar conta</button>
  </form><p id="cloud-msg" role="status"></p>`);
  const form=document.getElementById('cloud-login');
  form.onsubmit=async e=>{e.preventDefault();msg('Entrando...');const f=new FormData(form);const {error}=await client.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});if(error)msg(error.message,true)};
  document.getElementById('cloud-register').onclick=async()=>{
   const f=new FormData(form);if(!f.get('email')||String(f.get('password')).length<6){msg('Preencha e-mail e senha de pelo menos 6 caracteres.',true);return}
   msg('Criando conta...');const {data,error}=await client.auth.signUp({email:f.get('email'),password:f.get('password')});
   msg(error?error.message:(data.session?'Conta criada. Entrando...':'Conta criada. Confirme o e-mail, se solicitado, e entre.'),!!error);
  };
 }
 async function readRemote(){
  const {data,error}=await client.from('caoportamental_state').select('data,updated_at').eq('user_id',session.user.id).maybeSingle();
  if(error)throw error;
  return data;
 }
 async function startUser(){
  loading=true;pending=false;clearTimeout(timer);if(remoteCheck)clearInterval(remoteCheck);
  screen('Conectando à nuvem','<p>Carregando seus registros...</p>');
  try{
   const remote=await readRemote();
   if(remote){
    remoteVersion=remote.updated_at;
    // Never silently replace existing local data on first migration.
    const marker='cao_cloud_imported_'+session.user.id;
    if(!localStorage.getItem(marker)&&localStorage.getItem('patas_por_ai_v6_seeded')){
     const useLocal=confirm('Encontramos dados salvos neste navegador. Deseja enviar esses dados para a nuvem? OK = usar dados locais. Cancelar = carregar os dados que já estão na nuvem.');
     if(useLocal){remoteVersion=remote.updated_at;pending=true;await flush(true)}
     else{db=migrate(remote.data);localStorage.setItem(KEY,JSON.stringify(db))}
     localStorage.setItem(marker,'1');
    }else{db=migrate(remote.data);localStorage.setItem(KEY,JSON.stringify(db))}
   }else{
    // Existing V9 data are migrated into cloud only for this signed-in account.
    pending=true;await flush(true);
    localStorage.setItem('cao_cloud_imported_'+session.user.id,'1');
   }
   loading=false;lastError='';render();status();
   if(channel)client.removeChannel(channel);
   channel=client.channel('cao-sync-'+session.user.id).on('postgres_changes',{event:'*',schema:'public',table:'caoportamental_state',filter:'user_id=eq.'+session.user.id},()=>{if(!pending&&!saving)refresh()}).subscribe();
   remoteCheck=setInterval(()=>{if(!pending&&!saving&&!loading)refresh()},15000);
   document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!pending&&!saving&&!loading)refresh()});
  }catch(e){lastError=e.message||String(e);screen('Erro de conexão',`<p>Não foi possível carregar os dados: ${lastError}</p><button id="cloud-retry">Tentar novamente</button>`);document.getElementById('cloud-retry').onclick=startUser}
 }
 async function refresh(){
  if(pending||saving||loading||!session)return;
  try{
   const remote=await readRemote();
   if(remote&&remote.updated_at!==remoteVersion){
    remoteVersion=remote.updated_at;db=migrate(remote.data);localStorage.setItem(KEY,JSON.stringify(db));render();
   }
   lastError='';status();
  }catch(e){lastError=e.message;status()}
 }
 async function flush(force=false){
  if(!session||saving||(!pending&&!force))return;
  saving=true;status();
  const snapshot=JSON.parse(JSON.stringify(db));
  try{
   // Optimistic locking prevents silently overwriting changes made on another device.
   let query=client.from('caoportamental_state');
   let result;
   if(remoteVersion){
    result=await query.update({data:snapshot}).eq('user_id',session.user.id).eq('updated_at',remoteVersion).select('updated_at').maybeSingle();
    if(!result.error&&!result.data)throw Error('Os dados mudaram em outro aparelho. Recarregue a página para revisar antes de salvar.');
   }else{
    result=await query.insert({user_id:session.user.id,data:snapshot}).select('updated_at').single();
   }
   if(result.error)throw result.error;
   remoteVersion=result.data.updated_at;pending=false;lastError='';
  }catch(e){lastError=e.message||String(e);pending=true}
  saving=false;status();
  if(pending&&!lastError)setTimeout(()=>flush(),300);
 }
 async function start(){
  if(!hasConfig){
   screen('Configuração necessária',`<p>A V10 está preparada para sincronizar com Supabase, mas ainda precisa da URL e da chave publicável do seu projeto.</p><p>Preencha o arquivo <code>cloud-config.js</code> conforme o guia incluído no ZIP.</p>`);
   return;
  }
  if(!window.supabase){screen('Conexão indisponível','<p>Não foi possível carregar a biblioteca Supabase. Verifique a conexão com a internet.</p>');return}
  client=window.supabase.createClient(cfg.url,cfg.publishableKey);
  const {data}=await client.auth.getSession();
  session=data.session;
  client.auth.onAuthStateChange((_event,newSession)=>{
   const was=session?.user?.id;session=newSession;
   if(newSession&&was!==newSession.user.id)setTimeout(startUser,0);
   if(!newSession){clearInterval(remoteCheck);if(channel)client.removeChannel(channel);loginUI()}
  });
  if(session)await startUser();else loginUI();
 }
 window.cloudSync={start,scheduleSave(){
  if(!session||loading)return;
  pending=true;lastError='';status();clearTimeout(timer);timer=setTimeout(()=>flush(),650);
 },signOut:()=>client?.auth.signOut()};
})();
