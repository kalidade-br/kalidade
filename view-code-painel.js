javascript:(async()=>{if(document.getElementById("__MDT"))return;const root=document.createElement("div");root.id="__MDT";root.innerHTML=`
<style>
*{box-sizing:border-box}
html,body{overflow:hidden!important}
#__MDT{position:fixed;inset:0;width:100vw;height:100dvh;max-width:100vw;max-height:100dvh;z-index:2147483647;background:#0b0e13;color:#dce2ec;font:12px ui-monospace,SFMono-Regular,Consolas,monospace;display:flex;flex-direction:column;overflow:hidden}
#__MDT button,#__MDT input,#__MDT textarea{font:inherit}
#__MDT button{border:1px solid #303744;background:#1a2029;color:#dce2ec;border-radius:6px;padding:7px 9px;cursor:pointer;white-space:nowrap}
#__MDT button:active{background:#303847}
#__MDT header{height:54px;min-height:54px;width:100%;display:flex;align-items:center;gap:6px;padding:7px 8px;background:#151922;border-bottom:1px solid #292f39;overflow:hidden}
#__MDT .logo{font-weight:800;color:#fff;white-space:nowrap;font-size:14px}
#__MDT input{background:#0c1016;border:1px solid #303744;color:#fff;border-radius:6px;padding:8px 9px;outline:0;min-width:0}
#__MDT #search{flex:1;width:100%;min-width:0}
#__MDT .tabs{height:40px;min-height:40px;width:100%;display:flex;align-items:center;gap:4px;padding:4px 7px;background:#11151b;border-bottom:1px solid #292f39;overflow-x:auto;overflow-y:hidden;flex-shrink:0}
#__MDT .tab{padding:6px 11px}
#__MDT .tab.on{background:#303847;color:#fff}
#__MDT main{position:relative;display:flex;flex:1;min-height:0;width:100%;max-width:100%;overflow:hidden}
#__MDT aside{width:280px;min-width:0;max-width:80vw;flex-shrink:0;background:#101319;border-right:1px solid #292f39;display:flex;flex-direction:column;overflow:hidden}
#__MDT #filter{margin:7px;width:calc(100% - 14px);flex-shrink:0}
#__MDT #files{overflow:auto;min-height:0;flex:1}
#__MDT .fh{padding:9px 10px;color:#707a8b;font-size:10px;letter-spacing:.06em}
#__MDT .file{padding:8px 10px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:2px solid transparent}
#__MDT .file:hover{background:#1a2029}
#__MDT .file.sel{background:#202733;border-left-color:#72a7ff;color:#fff}
#__MDT .ico{display:inline-block;width:21px}
#__MDT .center{position:relative;display:flex;flex:1 1 auto;min-width:0;max-width:100%;height:100%;flex-direction:column;overflow:hidden}
#__MDT .toolbar{height:42px;min-height:42px;width:100%;display:flex;align-items:center;gap:5px;padding:5px 7px;background:#101319;border-bottom:1px solid #292f39;overflow-x:auto;overflow-y:hidden}
#__MDT .toolbar span{color:#929baa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:70px;margin-right:auto}
#__MDT #editor{display:block;flex:1;width:100%;height:100%;min-width:0;min-height:0;resize:none;border:0;outline:0;background:#0b0e13;color:#dce2ec;padding:13px;line-height:1.55;font-size:12px;white-space:pre;overflow:auto;tab-size:2}
#__MDT .view{display:none;flex:1;width:100%;height:100%;min-width:0;min-height:0;background:#fff;overflow:hidden}
#__MDT iframe{display:block;width:100%;height:100%;min-width:0;min-height:0;border:0;background:#fff}
#__MDT .results{position:absolute;z-index:50;inset:0;background:#0d1015;display:none;overflow:auto}
#__MDT .result{padding:9px 11px;border-bottom:1px solid #252b34;cursor:pointer;overflow:hidden}
#__MDT .result:hover{background:#191f28}
#__MDT .result b{display:block;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#__MDT .result small{display:block;color:#7d8797;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#__MDT .empty{padding:30px 15px;text-align:center;color:#737d8c}
#__MDT .mobileMenu{display:none}
#__MDT .close{font-size:17px;padding:4px 10px}
@media(max-width:700px){
#__MDT .logo{display:none}
#__MDT header{height:52px;min-height:52px}
#__MDT main{position:relative}
#__MDT aside{position:absolute;z-index:100;left:0;top:0;bottom:0;width:min(82vw,310px);max-width:310px;transform:translateX(-105%);transition:transform .2s ease;box-shadow:8px 0 25px #0008}
#__MDT aside.open{transform:translateX(0)}
#__MDT .mobileMenu{display:block}
#__MDT .toolbar{height:42px;min-height:42px}
#__MDT .toolbar span{max-width:28vw}
#__MDT #editor{font-size:11px;padding:9px}
}
@media(max-width:380px){
#__MDT header{gap:4px;padding:6px}
#__MDT header button{padding:7px}
#__MDT .tabs{padding-left:5px}
#__MDT .tab{padding:5px 8px;font-size:11px}
#__MDT .toolbar{gap:3px;padding:4px}
#__MDT .toolbar button{padding:6px 7px;font-size:10px}
}
</style>

<header>
<button class="mobileMenu" id="menu">☰</button>
<span class="logo">◈ Mobile DevTools</span>
<input id="search" placeholder="🔎 Buscar no conteúdo...">
<button id="global">Busca</button>
<button id="close" class="close">×</button>
</header>

<div class="tabs">
<button class="tab on" data-t="all">Todos</button>
<button class="tab" data-t="html">HTML</button>
<button class="tab" data-t="js">JS</button>
<button class="tab" data-t="css">CSS</button>
<button class="tab" data-t="img">IMG</button>
<button class="tab" data-t="other">OUTROS</button>
</div>

<main>
<aside id="side">
<input id="filter" placeholder="🔎 Filtrar arquivos...">
<div id="files"></div>
</aside>

<div class="center">

<div class="toolbar">
<span id="fname">Nenhum arquivo</span>
<button id="save">Salvar</button>
<button id="render">▶ Render</button>
<button id="download">↓</button>
<button id="copy">⧉</button>
<button id="open">↗</button>
</div>

<textarea id="editor" spellcheck="false" placeholder="Selecione um arquivo..."></textarea>

<div class="view">
<iframe id="frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"></iframe>
</div>

<div class="results" id="results"></div>

</div>
</main>
`;

document.documentElement.appendChild(root);

const $=s=>root.querySelector(s);
const base=location.href;
const files=[];
let current=null;
let tab="all";

function escapeHTML(s){
 return String(s)
 .replace(/&/g,"&amp;")
 .replace(/</g,"&lt;")
 .replace(/>/g,"&gt;");
}

function getType(url){
 const x=url.split("?")[0].split("#")[0].toLowerCase();

 if(/\.html?$/.test(x)||x===location.origin+"/")return"html";
 if(/\.m?js$/.test(x)||x.includes(".js"))return"js";
 if(/\.css$/.test(x))return"css";
 if(/\.(png|jpe?g|gif|webp|svg|ico|avif)$/.test(x))return"img";

 return"other";
}

function icon(t){
 return t==="html"?"🌐":
        t==="js"?"📜":
        t==="css"?"🎨":
        t==="img"?"🖼️":"📄";
}

function addFile(name,url,type,content=null){
 if(files.some(f=>f.url===url&&f.type===type))return;

 files.push({
  name:name||"arquivo",
  url,
  type,
  content,
  changed:false
 });
}

function renderList(){
 const q=$("#filter").value.toLowerCase();

 const arr=files.filter(f=>
  (tab==="all"||f.type===tab)&&
  (f.name+" "+f.url).toLowerCase().includes(q)
 );

 const box=$("#files");

 box.innerHTML=
  "<div class=fh>PROJECT · "+arr.length+" FILES</div>";

 arr.forEach(f=>{
  const d=document.createElement("div");

  d.className="file"+(f===current?" sel":"");

  d.innerHTML=
   "<span class=ico>"+icon(f.type)+"</span>"+
   escapeHTML(f.name)+
   (f.changed?" •":"");

  d.onclick=()=>{
   selectFile(f);
   if(innerWidth<=700)$("#side").classList.remove("open");
  };

  box.appendChild(d);
 });
}

async function getContent(f){

 if(f.content!==null)return f.content;

 try{
  const response=await fetch(f.url,{
   credentials:"include"
  });

  if(!response.ok)
   throw new Error("HTTP "+response.status);

  f.content=await response.text();

  return f.content;

 }catch(e){

  f.content=
   "/* Não foi possível carregar este arquivo.\n"+
   "   "+e+"\n*/";

  return f.content;
 }
}

async function selectFile(f){

 current=f;

 renderList();

 $("#fname").textContent=f.name;

 const content=await getContent(f);

 $("#editor").value=content;

 $("#editor").style.display="block";
 $(".view").style.display="none";
}

async function scan(){

 files.length=0;

 $("#files").innerHTML=
  "<div class=empty>Escaneando página...</div>";

 try{

  const response=await fetch(base,{
   credentials:"include"
  });

  if(!response.ok)
   throw new Error("HTTP "+response.status);

  const html=await response.text();

  const doc=new DOMParser()
   .parseFromString(html,"text/html");

  const indexName=
   location.pathname.split("/").pop()||
   "index.html";

  addFile(
   indexName,
   base,
   "html",
   html
  );

  /*
   JavaScript externo
  */
  doc.querySelectorAll("script[src]")
   .forEach((script,i)=>{

    try{

     const url=
      new URL(
       script.getAttribute("src"),
       base
      ).href;

     addFile(
      url.split("/").pop().split("?")[0]||
      "script-"+i+".js",
      url,
      "js"
     );

    }catch(_){}
   });

  /*
   CSS
  */
  doc.querySelectorAll("link[href]")
   .forEach((link,i)=>{

    try{

     const url=
      new URL(
       link.getAttribute("href"),
       base
      ).href;

     const type=getType(url);

     if(type==="css"||type==="other"){

      addFile(
       url.split("/").pop().split("?")[0]||
       "resource-"+i,
       url,
       type
      );
     }

    }catch(_){}
   });

  /*
   Imagens
  */
  doc.querySelectorAll(
   "img[src],source[src]"
  ).forEach((el,i)=>{

   try{

    const url=
     new URL(
      el.getAttribute("src"),
      base
     ).href;

    addFile(
     url.split("/").pop().split("?")[0]||
     "image-"+i,
     url,
     "img"
    );

   }catch(_){}
  });

  /*
   JS inline
  */
  doc.querySelectorAll(
   "script:not([src])"
  ).forEach((script,i)=>{

   addFile(
    "inline-script-"+(i+1)+".js",
    base+"#inline-script-"+i,
    "js",
    script.textContent
   );
  });

  /*
   CSS inline
  */
  doc.querySelectorAll("style")
   .forEach((style,i)=>{

    addFile(
     "inline-style-"+(i+1)+".css",
     base+"#inline-style-"+i,
     "css",
     style.textContent
    );
   });

  renderList();

  const first=
   files.find(f=>
    f.name.toLowerCase()==="index.html"
   )||files.find(f=>f.type==="html")||files[0];

  if(first)selectFile(first);

 }catch(e){

  $("#files").innerHTML=
   "<div class=empty>⚠️ "+
   escapeHTML(String(e))+
   "</div>";
 }
}

/*
 BUSCA REAL DENTRO DOS ARQUIVOS
*/
async function globalSearch(){

 const query=
  $("#search").value.trim().toLowerCase();

 const results=$("#results");

 if(!query){
  results.style.display="none";
  return;
 }

 results.style.display="block";

 results.innerHTML=
  "<div class=fh>PROCURANDO...</div>";

 const found=[];

 for(const f of files){

  if(f.type==="img")continue;

  const content=await getContent(f);

  const lines=content.split("\n");

  lines.forEach((line,i)=>{

   if(line.toLowerCase().includes(query)){

    found.push({
     file:f,
     line,
     number:i
    });

   }
  });
 }

 results.innerHTML=
  "<div class=fh>"+
  found.length+
  " RESULTADOS PARA \""+
  escapeHTML(query)+
  "\"</div>";

 if(!found.length){

  results.innerHTML+=
   "<div class=empty>🔎 Nenhum resultado encontrado.</div>";

  return;
 }

 found.slice(0,1000).forEach(item=>{

  const d=document.createElement("div");

  d.className="result";

  d.innerHTML=
   "<b>"+
   icon(item.file.type)+
   " "+
   escapeHTML(item.file.name)+
   " : linha "+
   (item.number+1)+
   "</b>"+
   "<small>"+
   escapeHTML(item.line.trim())+
   "</small>";

  d.onclick=async()=>{

   results.style.display="none";

   await selectFile(item.file);

   const lines=$("#editor")
    .value.split("\n");

   let position=0;

   for(let i=0;i<item.number;i++)
    position+=lines[i].length+1;

   $("#editor").focus();

   $("#editor").setSelectionRange(
    position,
    position+lines[item.number].length
   );

   $("#editor").scrollTop=
    Math.max(0,item.number*18-120);
  };

  results.appendChild(d);
 });
}

/*
 RENDERIZADOR
*/
async function renderSite(){

 let htmlFile=
  current&&current.type==="html"
   ?current
   :files.find(f=>f.type==="html");

 if(!htmlFile)return;

 let html=
  await getContent(htmlFile);

 const doc=
  new DOMParser()
   .parseFromString(html,"text/html");

 /*
  CSS externo -> style inline
 */
 const styles=
  [...doc.querySelectorAll(
   'link[rel="stylesheet"][href]'
  )];

 for(const link of styles){

  try{

   const url=
    new URL(
     link.getAttribute("href"),
     base
    ).href;

   const file=
    files.find(f=>f.url===url);

   if(file){

    const css=await getContent(file);

    const style=
     doc.createElement("style");

    style.textContent=css;

    link.replaceWith(style);
   }

  }catch(_){}
 }

 /*
  JS externo -> script inline
 */
 const scripts=
  [...doc.querySelectorAll(
   "script[src]"
  )];

 for(const script of scripts){

  try{

   const url=
    new URL(
     script.getAttribute("src"),
     base
    ).href;

   const file=
    files.find(f=>f.url===url);

   if(file){

    const js=await getContent(file);

    const replacement=
     doc.createElement("script");

    replacement.textContent=js;

    script.replaceWith(replacement);
   }

  }catch(_){}
 }

 /*
  BASE para imagens/fontes/etc.
 */
 const baseTag=
  doc.createElement("base");

 baseTag.href=base;

 if(doc.head)
  doc.head.prepend(baseTag);

 const finalHTML=
  "<!doctype html>"+
  doc.documentElement.outerHTML;

 const blob=
  new Blob(
   [finalHTML],
   {type:"text/html"}
  );

 const url=
  URL.createObjectURL(blob);

 $("#frame").src=url;

 $("#editor").style.display="none";

 $(".view").style.display="flex";
}

/*
 SALVAR ALTERAÇÃO NO PROJETO LOCAL
*/
$("#save").onclick=()=>{

 if(!current)return;

 current.content=
  $("#editor").value;

 current.changed=true;

 renderList();

 $("#fname").textContent=
  current.name+" • salvo";
};

/*
 RENDER
*/
$("#render").onclick=renderSite;

/*
 COPIAR
*/
$("#copy").onclick=async()=>{

 try{

  await navigator.clipboard
   .writeText($("#editor").value);

  $("#fname").textContent=
   current.name+" • copiado";

 }catch(_){}
};

/*
 DOWNLOAD
*/
$("#download").onclick=()=>{

 if(!current)return;

 const blob=
  new Blob(
   [$("#editor").value],
   {type:"text/plain;charset=utf-8"}
  );

 const url=
  URL.createObjectURL(blob);

 const a=document.createElement("a");

 a.href=url;
 a.download=current.name;

 document.body.appendChild(a);
 a.click();
 a.remove();

 setTimeout(
  ()=>URL.revokeObjectURL(url),
  1000
 );
};

/*
 ABRIR ORIGINAL
*/
$("#open").onclick=()=>{

 if(current)
  window.open(current.url,"_blank");
};

/*
 BUSCA
*/
$("#global").onclick=globalSearch;

$("#search").addEventListener(
 "keydown",
 e=>{
  if(e.key==="Enter")
   globalSearch();
 }
);

/*
 FILTRO DE ARQUIVOS
*/
$("#filter").oninput=renderList;

/*
 TABS
*/
root.querySelectorAll(".tab")
 .forEach(button=>{

  button.onclick=()=>{

   root.querySelectorAll(".tab")
    .forEach(x=>
     x.classList.remove("on")
    );

   button.classList.add("on");

   tab=button.dataset.t;

   renderList();
  };
 });

/*
 MENU MOBILE
*/
$("#menu").onclick=()=>
 $("#side").classList.toggle("open");

/*
 FECHAR
*/
$("#close").onclick=()=>{
 root.remove();
};

/*
 ATALHO ESC
*/
document.addEventListener(
 "keydown",
 function escKey(e){

  if(e.key==="Escape"){

   if($("#results").style.display==="block")
    $("#results").style.display="none";
   else
    root.remove();

   document.removeEventListener(
    "keydown",
    escKey
   );
  }
 }
);

/*
 INICIAR
*/
scan();

})();
