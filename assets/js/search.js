(()=>{"use strict";
const D=window.IMOS;if(!D)return;
const root=document.documentElement.dataset.root||"";
const CM=Object.fromEntries(D.cats.map(c=>[c.id,c.n]));
const M={"ي":"ی","ى":"ی","ك":"ک","ة":"ه","ۀ":"ه","أ":"ا","إ":"ا","ؤ":"و","\u200c":" ","\u200f":" ","\u200e":" ","_":" ","-":" "};
const n1=s=>String(s).replace(/[يىكةۀأإؤ\u200c\u200f\u200e_-]/g,m=>M[m]).replace(/[۰-۹]/g,d=>d.charCodeAt(0)-1776).replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632).toLowerCase();
const nq=q=>n1(q).replace(/[\u064B-\u0652\u0640]/g,"").trim().split(/\s+/).filter(Boolean);
const esc=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sq=s=>s.replace(/ /g,"");
const IDX=D.services.map(s=>{const f=x=>{const a=n1(x);return[a,sq(a)]};return{s,t:f(s.t),c:f(CM[s.c]),k:f(s.k),d:f(s.d),p:f(s.p)}});
const has=(f,t)=>f[0].includes(t)||f[1].includes(t);
function score(e,toks){let tot=0;for(const t of toks){let b=0;
if(has(e.t,t))b=Math.max(b,10+(e.t[0].startsWith(t)||e.t[0].includes(" "+t)?4:0));
if(has(e.c,t))b=Math.max(b,6);if(has(e.k,t))b=Math.max(b,5);if(has(e.d,t))b=Math.max(b,3);if(has(e.p,t))b=Math.max(b,2);
if(!b)return 0;tot+=b}return tot}
function run(q,cat){const toks=nq(q);
return IDX.filter(e=>!cat||e.s.c===cat).map(e=>({s:e.s,r:toks.length?score(e,toks):1})).filter(x=>x.r>0)}
function hl(text,toks){const n=n1(text),m=new Array(text.length).fill(0);
toks.forEach(t=>{let i=n.indexOf(t);while(t&&i>=0){for(let j=i;j<i+t.length;j++)m[j]=1;i=n.indexOf(t,i+1)}});
let o="",on=0;for(let i=0;i<text.length;i++){if(m[i]&&!on){o+="<mark>";on=1}if(!m[i]&&on){o+="</mark>";on=0}o+=esc(text[i])}return o+(on?"</mark>":"")}
const url=s=>`${root}services/${s.s}/index.html`;

// home suggestions
const inp=document.querySelector("[data-suggest]");
if(inp){const ul=document.getElementById(inp.getAttribute("aria-controls"));let sel=-1,items=[];
const close=()=>{ul.hidden=true;inp.setAttribute("aria-expanded","false");sel=-1};
const mark=()=>{[...ul.children].forEach((li,i)=>li.setAttribute("aria-selected",i===sel));inp.setAttribute("aria-activedescendant",sel>=0?ul.children[sel].id:"")};
inp.addEventListener("input",()=>{const q=inp.value;if(!q.trim()){close();return}
items=run(q).sort((a,b)=>b.r-a.r).slice(0,6);const toks=nq(q);
ul.innerHTML=items.length?items.map((x,i)=>`<li role="option" id="sg${i}" aria-selected="false" data-u="${url(x.s)}">${hl(x.s.t,toks)}<small>${esc(CM[x.s.c])}</small></li>`).join(""):`<li role="option" aria-disabled="true">نتیجه‌ای نیست؛ Enter را بزنید تا همه خدمات جستجو شود</li>`;
ul.hidden=false;inp.setAttribute("aria-expanded","true");sel=-1});
inp.addEventListener("keydown",e=>{const L=ul.children.length;
if(e.key==="ArrowDown"&&!ul.hidden){e.preventDefault();sel=(sel+1)%L;mark()}
else if(e.key==="ArrowUp"&&!ul.hidden){e.preventDefault();sel=(sel-1+L)%L;mark()}
else if(e.key==="Escape")close();
else if(e.key==="Enter"&&sel>=0&&items[sel]){e.preventDefault();location.href=url(items[sel].s)}});
ul.addEventListener("mousedown",e=>{const li=e.target.closest("li[data-u]");if(li)location.href=li.dataset.u});
document.addEventListener("click",e=>{if(!e.target.closest(".search"))close()})}

// services browser
const B=document.querySelector("[data-browser]");
if(B){const q=B.querySelector("#q"),g=document.getElementById("grid"),cnt=document.getElementById("count"),em=document.getElementById("empty"),so=document.getElementById("sort"),chips=[...B.querySelectorAll(".chip")];
let cat="";const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const p=new URLSearchParams(location.search);q.value=p.get("q")||"";const c0=p.get("cat");if(c0&&CM[c0])cat=c0;
function render(){const toks=nq(q.value);let r=run(q.value,cat);
const fl=(a,b)=>a.localeCompare(b,"fa");
if(so.value==="alpha")r.sort((a,b)=>fl(a.s.t,b.s.t));else if(so.value==="cat")r.sort((a,b)=>fl(CM[a.s.c],CM[b.s.c])||fl(a.s.t,b.s.t));else r.sort((a,b)=>b.r-a.r||fl(a.s.t,b.s.t));
g.innerHTML=r.map(x=>`<article class="card"><span class="tag">${esc(CM[x.s.c])}</span><h3><a href="${url(x.s)}">${hl(x.s.t,toks)}</a></h3><p>${hl(x.s.d,toks)}</p><span class="more">مشاهده خدمت</span></article>`).join("");
em.hidden=r.length>0;cnt.textContent=`${fa(r.length)} خدمت`;
chips.forEach(c=>c.setAttribute("aria-pressed",c.dataset.cat===cat))}
q.addEventListener("input",render);so.addEventListener("change",render);
chips.forEach(c=>c.addEventListener("click",()=>{cat=c.dataset.cat;render()}));
document.getElementById("reset").addEventListener("click",()=>{q.value="";cat="";so.value="rel";render();q.focus()});
render()}
})();
