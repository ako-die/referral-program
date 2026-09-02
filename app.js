let currentUser={name:"",role:""}; let referrals=JSON.parse(localStorage.getItem("referrals")||"[]");
const $=id=>document.getElementById(id);
function showLogin(){$("splash").classList.add("hidden");$("login").classList.remove("hidden")}
function backSplash(){$("login").classList.add("hidden");$("splash").classList.remove("hidden")}
function login(){let n=$("loginName").value.trim();if(!n){alert("Nama user wajib diisi.");return}currentUser={name:n,role:$("loginRole").value};localStorage.setItem("currentUser",JSON.stringify(currentUser));$("login").classList.add("hidden");$("app").classList.remove("hidden");$("activeName").textContent=n;$("activeRole").textContent=currentUser.role==="pejabat"?"Pejabat":"Petugas";$("userInfo").textContent=n+" • "+$("activeRole").textContent;$("dailyMenu").style.display=currentUser.role==="pejabat"?"flex":"none";$("allReportBtn").style.display=currentUser.role==="pejabat"?"inline-block":"none";goHome()}
function logout(){currentUser={name:"",role:""};$("app").classList.add("hidden");$("login").classList.remove("hidden");$("loginName").value=""}
function hidePages(){document.querySelectorAll(".page").forEach(x=>x.classList.add("hidden"))}
function goHome(){hidePages();$("home").classList.remove("hidden")}
function openPage(id){hidePages();$(id).classList.remove("hidden");if(id==="printPage")renderReport("user");if(id==="dailyPage")renderDaily("user")}
$("refForm").addEventListener("submit",e=>{e.preventDefault();let r={id:Date.now(),tanggal:$("tanggal").value,nama:$("nama").value.trim(),unit:$("unit").value.trim(),customer:$("customer").value.trim(),produk:$("produk").value,status:$("status").value,user:currentUser.name};referrals.push(r);localStorage.setItem("referrals",JSON.stringify(referrals));alert("Referral berhasil disimpan.");e.target.reset();$("tanggal").value=new Date().toISOString().slice(0,10)})
function dataFor(mode){return mode==="all"?referrals:referrals.filter(r=>r.user===currentUser.name)}
function table(rows){if(!rows.length)return '<div class="empty">Belum ada data referral.</div>';return '<div class="tablewrap"><table><thead><tr><th>Tanggal</th><th>User</th><th>Nama</th><th>Unit</th><th>Customer</th><th>Produk</th><th>Status</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r.tanggal}</td><td>${esc(r.user)}</td><td>${esc(r.nama)}</td><td>${esc(r.unit)}</td><td>${esc(r.customer)}</td><td>${esc(r.produk)}</td><td>${esc(r.status)}</td></tr>`).join("")+'</tbody></table></div>'}
function renderDaily(mode){if(currentUser.role!=="pejabat"){alert("Menu ini khusus Pejabat.");goHome();return}let rows=dataFor(mode);let counts={};rows.forEach(r=>counts[r.user]=(counts[r.user]||0)+1);let summary=Object.entries(counts).map(([u,c])=>`<p><b>${esc(u)}</b>: ${c} referral</p>`).join("")||'<p class="empty">Belum ada data.</p>';$("dailyContent").innerHTML='<h3>Ringkasan</h3>'+summary+table(rows)}
function renderReport(mode){if(mode==="all"&&currentUser.role!=="pejabat"){alert("Laporan semua petugas khusus Pejabat.");return}let rows=dataFor(mode);$("reportContent").innerHTML=`<p><b>${mode==="all"?"Semua Petugas":"User: "+esc(currentUser.name)}</b> — ${rows.length} referral</p>`+table(rows)}
function printReport(){window.print()}
async function shareReport(){let rows=dataFor("user");let text="Referral Program\\nUser: "+currentUser.name+"\\nTotal referral: "+rows.length+"\\n\\n"+rows.map(r=>`${r.tanggal} | ${r.customer} | ${r.produk} | ${r.status}`).join("\\n");if(navigator.share){try{await navigator.share({title:"Referral Program",text})}catch(e){}}else{await navigator.clipboard.writeText(text);alert("Laporan disalin ke clipboard.")}}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("tanggal").value=new Date().toISOString().slice(0,10);
document.querySelectorAll(".tabs button").forEach(btn=>btn.addEventListener("click",()=>{
  btn.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
}));
