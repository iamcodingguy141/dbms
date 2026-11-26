const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
function setupAdmin_() {
  // Run once from Apps Script editor; then remove this function or its password literal.
  PropertiesService.getScriptProperties().setProperties({ADMIN_USER:'meenamontu',ADMIN_PASSWORD:'20LvWDvWHXj2E_F4RtXk'});
}
function doGet(){return HtmlService.createHtmlOutput(`<!doctype html><html><head><style>
*{box-sizing:border-box}body{margin:0;background:#e6e0ff;color:#1a1033;font:16px system-ui;padding:24px}main{max-width:650px;margin:32px auto}section{background:white;border:2px solid #1a1033;border-radius:20px;padding:24px;box-shadow:5px 5px #1a1033}h1{font-size:32px;line-height:1.1}label{display:block;font-weight:700;margin:12px 0 6px}input,button{font:inherit;border:2px solid #1a1033;border-radius:10px;padding:12px;width:100%}button{background:#ffd23f;font-weight:800;cursor:pointer;margin-top:12px}button:disabled{opacity:.5}table{border-collapse:collapse;width:100%;text-align:left}td,th{padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}small{font-weight:800;color:#7050a8}#count{font-size:48px;font-weight:900;color:#523387}[hidden]{display:none!important}</style></head><body><main><small>DBMS VIVA / CREATOR ONLY</small><h1>Private access.</h1><section id="login"><form id="form"><label for="user">Username</label><input id="user" autocomplete="username" required><label for="pass">Password</label><input id="pass" type="password" autocomplete="current-password" required><button id="submit">Sign in</button><p id="status" role="status"></p></form></section><section id="dash" hidden><small>WELCOME, MEENA MONTU</small><h1>Student registrations</h1><div id="count"></div><p>Registered profiles</p><table><thead><tr><th>No.</th><th>Student name</th></tr></thead><tbody id="rows"></tbody></table><button id="refresh">Refresh names</button><button id="logout">Log out</button></section><p>Designed &amp; Developed by Meena Montu</p></main><script>
const $=id=>document.getElementById(id);let session=null;
function render(data){$('submit').disabled=false;if(!data.ok){$('status').textContent=data.message||'Invalid credentials.';return;}session=data.token;$('pass').value='';$('login').hidden=true;$('dash').hidden=false;$('count').textContent=data.names.length;$('rows').replaceChildren();data.names.forEach((name,i)=>{const tr=document.createElement('tr');[String(i+1).padStart(3,'0'),name].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});$('rows').append(tr)});}
function error(){ $('submit').disabled=false;$('status').textContent='Request failed. Try again.'; }
$('form').onsubmit=e=>{e.preventDefault();$('submit').disabled=true;$('status').textContent='Signing in…';google.script.run.withSuccessHandler(render).withFailureHandler(error).login($('user').value,$('pass').value)};
function clear(){session=null;$('dash').hidden=true;$('rows').replaceChildren();$('count').textContent='';$('login').hidden=false;$('status').textContent='Signed out.';}
$('refresh').onclick=()=>google.script.run.withSuccessHandler(d=>{if(d.ok)render(d);else clear()}).withFailureHandler(()=>alert('Refresh failed.')).readNames(session);
$('logout').onclick=()=>{const old=session;clear();google.script.run.logout(old)};
</script></body></html>`).setTitle('Creator Access').addMetaTag('viewport','width=device-width, initial-scale=1');}
function login(user,password){
 const props=PropertiesService.getScriptProperties();
 if(!props.getProperty('ADMIN_PASSWORD'))return {ok:false,message:'Creator setup is incomplete.'};
 const cache=CacheService.getUserCache();const attempts=Number(cache.get('attempts')||0);
 if(attempts>=5)return {ok:false,message:'Too many attempts. Try again in 5 minutes.'};
 if(user!==props.getProperty('ADMIN_USER')||password!==props.getProperty('ADMIN_PASSWORD')){cache.put('attempts',String(attempts+1),300);return {ok:false,message:'Invalid username or password.'};}
 cache.remove('attempts');const token=Utilities.getUuid()+Utilities.getUuid();cache.put('session',token,1800);return readNames(token);
}
function readNames(token){if(!token||CacheService.getUserCache().get('session')!==token)return {ok:false,message:'Session expired.'};const sh=SpreadsheetApp.openById(SHEET_ID).getSheetByName('Registrations');return {ok:true,token:token,names:sh&&sh.getLastRow()>1?sh.getRange(2,2,sh.getLastRow()-1,1).getDisplayValues().map(r=>r[0]):[]};}
function logout(token){const c=CacheService.getUserCache();if(token&&c.get('session')===token)c.remove('session');}
