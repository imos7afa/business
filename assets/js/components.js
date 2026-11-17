(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s);
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove("show"),2200)};
const copy=async txt=>{try{await navigator.clipboard.writeText(txt);return true}catch(e){const a=document.createElement("textarea");a.value=txt;document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand("copy")}catch(_){}a.remove();return ok}};
// menu
const b=$(".burger"),nav=$("#nav");
const setMenu=o=>{nav.classList.toggle("open",o);b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"بستن منو":"باز کردن منو")};
b.addEventListener("click",()=>setMenu(b.getAttribute("aria-expanded")!=="true"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){setMenu(false);b.focus()}});
nav.addEventListener("click",e=>{if(e.target.closest("a"))setMenu(false)});
// scroll
const h=$("#hdr"),t=$(".totop");
const on=()=>{h.classList.toggle("scrolled",scrollY>10);t.hidden=scrollY<600};on();addEventListener("scroll",on,{passive:true});
t.addEventListener("click",()=>scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"}));
// copy buttons
document.querySelectorAll("[data-copy]").forEach(x=>x.addEventListener("click",async()=>toast(await copy(x.dataset.copy)?"شماره کپی شد":"کپی انجام نشد؛ شماره را دستی انتخاب کنید")));
// contact form
const f=$("#msgform");
if(f){const ms=$("#ms"),mt=$("#mt");const sv=new URLSearchParams(location.search).get("service");if(sv&&[...ms.options].some(o=>o.value===sv))ms.value=sv;
const msg=()=>{const s=ms.selectedOptions[0];const head=s&&s.value?`سلام، درباره خدمت «${s.textContent}» پیام می‌دهم.`:"سلام، یک سؤال درباره خدمات دارم.";return head+(mt.value.trim()?"\n"+mt.value.trim():"")};
$("#tgbtn").addEventListener("click",async()=>{const ok=await copy(msg());toast(ok?"پیام کپی شد؛ در تلگرام جای‌گذاری کنید":"تلگرام باز شد؛ پیام را دستی بنویسید");window.open("https://t.me/imos7afa","_blank","noopener")});
$("#smsbtn").addEventListener("click",()=>{location.href="sms:09044745346?body="+encodeURIComponent(msg())})}
})();
