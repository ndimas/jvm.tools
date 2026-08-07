
// ============================================================
// JVM Tools - Static site generator
// Run:  bun scripts/generate.ts   -> writes ./site (static HTML)
// ============================================================
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { SITE_NAME, SITE_URL, GITHUB_REPO, CATEGORIES } from "./data.ts";
import { TOOLS } from "./data.ts";
import { DEEP_DIVES, GUIDES, toolBySlug } from "./content.ts";
import { STYLES as importedStyles } from "./style.ts";

const ROOT = process.cwd();
const OUT = ROOT;
const LAST_BUILD = "2026-08-07";
const CSS_HREF = "/assets/jvm-tools.css";

// ---- CTA / lead capture (editable) ----
// Point SIGNUP_URL at your real list/CRM endpoint when you build one.
// Keep null to show a graceful "coming soon" state instead of submitting.
const SIGNUP_URL = null; // e.g. "https://formspree.io/f/yourid"
const CTA_TITLE = "Get the free JVM CLI cheat-sheet";
const CTA_BODY = "A one-page printable reference of the jcmd, jstat, jmap, jstack and JFR commands that solve most production problems. No spam.";
const CTA_BUTTON = "Send it to my inbox";

const UMAMI = '<script defer src="https://cloud.umami.is/script.js" data-website-id="d267be8f-610b-4f69-801b-2a4af8f1b98b"></script>';
const DARK_SCRIPT = '<script>function toggleTheme(){var b=document.body;b.classList.toggle("dark-mode");try{localStorage.setItem("darkMode",b.classList.contains("dark-mode"));}catch(e){}}(function(){try{if(localStorage.getItem("darkMode")==="true"){document.body.classList.add("dark-mode");}}catch(e){}})();</script>';
const FOOTER = '<footer class="site-footer"><div class="links"><a href="/">Home</a><a href="/guides/">Guides</a><a href="/books/">Books</a><a href="' + GITHUB_REPO + '" rel="noopener" target="_blank">GitHub</a></div><div>&copy; 2024 &ndash; 2026 ' + SITE_NAME + '. Built by hand, served fast. &middot; <a href="' + GITHUB_REPO + '" rel="noopener">Contribute</a></div></footer>';

function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function escHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function toolUrl(slug){ const t=TOOLS.find(x=>x.slug===slug); if(!t)return null; if(!DEEP_DIVES.some(d=>d.slug===slug))return null; return "/tools/"+t.category+"/"+t.slug+"/"; }

function navHTML(active){
  const links=[["/","Home"]];
  CATEGORIES.forEach(c=>links.push(["/tools/"+c.slug+"/", c.navLabel]));
  links.push(["/guides/","Guides"],["/books/","Books"]);
  let h='<nav class="nav" aria-label="Main navigation">';
  h+='<a class="nav-brand" href="/"><span class="logo" aria-hidden="true"></span>'+SITE_NAME+'</a>';
  h+='<span class="nav-tag">practical JVM tools & guides</span><span class="nav-toggle-wrap">';
  for(const l of links){ h+='<a class="nav-link '+(active===l[0]?"active":"")+'" href="'+l[0]+'">'+l[1]+'</a>'; }
  h+='<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button></span></nav>';
  return h;
}

function breadcrumbs(pathStr,currentTitle){
  const seg=pathStr.split("/").filter(Boolean);
  const crumbs=[{href:"/",label:"Home"}];
  let acc="";
  for(const s of seg){ acc+="/"+s; let lab=s; let href=acc+"/";
    if(s==="tools"){ lab="Tools"; href=null; }
    else if(s==="guides"){ lab="Guides"; href="/guides/"; }
    else if(s==="books"){ lab="Books"; href="/books/"; }
    else { const c=CATEGORIES.find(x=>x.slug===s); if(c)lab=c.navLabel; }
    crumbs.push({href,label:lab});
  }
  let h='<nav class="breadcrumbs" aria-label="Breadcrumb">';
  for(let k=0;k<crumbs.length-1;k++){ if(crumbs[k].href){ h+='<a href="'+crumbs[k].href+'">'+esc(crumbs[k].label)+'</a>'; } else { h+=esc(crumbs[k].label); } h+='<span class="sep">/</span>'; }
  h+='<span>'+esc(currentTitle.split(":")[0])+'</span></nav>';
  return h;
}
function breadcrumbSchema(pathStr){
  const seg=pathStr.split("/").filter(Boolean);
  const items=[{"@type":"ListItem",position:1,name:"Home",item:SITE_URL+"/"}];
  let acc="",pos=2;
  for(const s of seg){ acc+="/"+s; let name=s;
    if(s==="tools")name="Tools"; else if(s==="guides")name="Guides"; else if(s==="books")name="Books";
    else { const c=CATEGORIES.find(x=>x.slug===s); if(c)name=c.navLabel; }
    items.push({"@type":"ListItem",position:pos++,name:name,item:SITE_URL+acc+"/"});
  }
  return {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:items};
}
function webSchema(){ return {"@context":"https://schema.org","@type":"WebSite",name:SITE_NAME,url:SITE_URL}; }

function renderPage(o){
  const url=o.canonicalUrl||(o.path==="/"?SITE_URL:SITE_URL+o.path+"/");
  let jld="";
  if(o.jsonLd&&o.jsonLd.length){ jld='<script type="application/ld+json">'+JSON.stringify(o.jsonLd)+'</script>'; }
  let h='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">';
  h+='<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  h+='<title>'+esc(o.title)+'</title>';
  h+='<meta name="description" content="'+esc(o.description)+'">';
  h+='<link rel="canonical" href="'+esc(url)+'">';
  if(o.noindex)h+='<meta name="robots" content="noindex">';
  h+='<meta property="og:type" content="website"><meta property="og:site_name" content="'+SITE_NAME+'">';
  h+='<meta property="og:title" content="'+esc(o.title)+'"><meta property="og:description" content="'+esc(o.description)+'">';
  h+='<meta property="og:url" content="'+esc(url)+'"><meta name="twitter:card" content="summary">';
  h+='<meta name="twitter:title" content="'+esc(o.title)+'"><meta name="twitter:description" content="'+esc(o.description)+'">';
  h+='<link rel="stylesheet" href="'+CSS_HREF+'">';
  h+='<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232f5ba8%22/><text x=%2250%22 y=%2268%22 font-size=%2260%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22monospace%22>J</text></svg>">';
  h+=jld+UMAMI+'</head><body>';
  h+='<header class="site-header"><div class="container">'+navHTML(o.active)+'</div></header>';
  let bread="";
  if(o.path!=="/")bread=breadcrumbs(o.path,o.title);
  h+='<main class="container">'+bread+o.body+'</main>';
  h+=FOOTER+DARK_SCRIPT+'</body></html>';
  return h;
}

function dirnameP(p){ return p.slice(0,Math.max(p.lastIndexOf("/"),0)); }
function writeOut(rel, content){ const p=join(OUT,rel); mkdirSync(dirnameP(p),{recursive:true}); writeFileSync(p,content); }

// ============================================================
// Page generators
// ============================================================
function homepageBody(){
  const counts=CATEGORIES.map(c=>{ return {cat:c,n:TOOLS.filter(t=>t.category===c.slug).length}; });
  const featured=["jcmd","async-profiler","eclipse-mat","jfr","visualvm","jmh","maven","byte-buddy"];
  let hero='<section class="hero">';
  hero+='<h1>JVM Tools &mdash; the practical directory for working Java developers</h1>';
  hero+='<p class="subtitle">The independent, constantly-updated reference for JVM tooling: command-line diagnostics, profilers, memory &amp; GC analysis, bytecode, build and testing tools &mdash; with real examples, not just links.</p>';
  hero+='<div class="cta-row"><a class="btn btn-primary" href="#explore">Browse tools</a><a class="btn btn-ghost" href="/guides/jvm-flags/">Start with the JVM flags guide</a></div>';
  hero+='</section>';

  let cats='<div class="page-content" style="box-shadow:none;background:transparent;border:none;padding:0"><h2 id="explore" style="margin-top:4px">Explore by category</h2><div class="grid">';
  for(const {cat,n} of counts){
    cats+='<div class="card"><a class="cat-chip" href="/tools/'+cat.slug+'/">'+n+' tools</a>';
    cats+='<h3 style="margin-top:8px"><a href="/tools/'+cat.slug+'/">'+esc(cat.navLabel)+'</a></h3>';
    cats+='<p style="font-size:.88rem">'+esc(cat.intro[0])+'</p></div>';
  }
  cats+='</div></div>';

  let guides='<section class="page-content" style="margin-top:16px"><span class="section-kicker">Guides &amp; deep-dives</span><h2 style="margin-top:6px">Practical how-tos</h2><div class="grid">';
  const allPages=[];
  GUIDES.forEach(g=>allPages.push({href:"/guides/"+g.slug+"/",chip:"Guide",title:g.title,note:g.metaDescription}));
  const ddFeatured=DEEP_DIVES.filter(d=>["jcmd","jfr","heap-dump-analysis","thread-dump-analysis","async-profiler"].includes(d.slug));
  // ensure guides appear
  for(const g of GUIDES){ guides+='<div class="card"><a class="cat-chip" href="/guides/'+g.slug+'/">Guide</a><h3 style="margin-top:8px"><a href="/guides/'+g.slug+'/">'+esc(g.title)+'</a></h3><p style="font-size:.88rem">'+esc(g.metaDescription)+'</p></div>'; }
  for(const d of DEEP_DIVES){ if(["jcmd","async-profiler","eclipse-mat"].includes(d.slug)){
     guides+='<div class="card"><a class="cat-chip" href="/tools/'+d.category+'/'+d.slug+'/">Deep-dive</a><h3 style="margin-top:8px"><a href="/tools/'+d.category+'/'+d.slug+'/">'+esc(d.h1.split(":")[0])+'</a></h3><p style="font-size:.88rem">'+esc(d.metaDescription)+'</p></div>';
  }}
  guides+='</div></section>';

  let how='<section class="page-content" style="margin-top:16px"><h2>Don&apos;t install a tool until you need it</h2>';
  how+='<p>Most JVM diagnosis starts with tools already on your path. <a href="/tools/jvm-cli/jcmd/">jcmd</a>, <a href="/tools/jvm-cli/jstat/">jstat</a>, <a href="/tools/jvm-cli/jmap/">jmap</a> and <a href="/tools/jvm-cli/jstack/">jstack</a> ship with every JDK. The trick is knowing which question you are asking:</p>';
  how+='<ul class="tools" style="list-style:none;padding:0">';
  how+='<li class="tool-item"><div class="body"><h3>Is the JVM healthy right now?</h3><p><a href="/tools/jvm-cli/jstat/">jstat -gcutil</a> plus a quick <a href="/tools/jvm-cli/jfr/">JFR</a> recording answer this in under a minute.</p></div></li>';
  how+='<li class="tool-item"><div class="body"><h3>Why is the app slow?</h3><p>Profile with <a href="/tools/profiling/async-profiler/">async-profiler</a> for a CPU flame graph; for pauses check <a href=\"/tools/memory/gc-log-analysis/\">GC log analysis</a>.</p></div></li>';
  how+='<li class="tool-item"><div class="body"><h3>Is it a memory leak?</h3><p>Capture a heap dump (<a href="/tools/jvm-cli/jmap/">jmap -dump:live</a>) and analyze it with <a href="/tools/memory/eclipse-mat/">Eclipse MAT</a>.</p></div></li>';
  how+='<li class="tool-item"><div class="body"><h3>Is it a hang or deadlock?</h3><p>Take two <a href="/guides/thread-dump-analysis/">thread dumps</a> a few seconds apart and diff them.</p></div></li>';
  how+='</ul></section>';

  let picks='<section class="page-content" style="margin-top:16px"><h2>Quick picks: the tools most teams reach for</h2><div class="grid">';
  for(const slug of featured){ const u=toolUrl(slug); const t=TOOLS.find(x=>x.slug===slug);
    picks+='<div class="card"><h3><a href="'+u+'">'+esc(t?t.name:slug)+'</a></h3><p>'+esc(t?t.desc:"")+'</p></div>';
  }
  picks+='</div></section>';

  return hero+cats+guides+how+picks+ctaBand();
}

function homepage(){
  const body=homepageBody();
  const jsonLd=[webSchema(),
    {"@context":"https://schema.org","@type":"ItemList",name:"JVM Tools directory",
     itemListElement:CATEGORIES.map((c,i)=>({"@type":"ListItem",position:i+1,name:c.navLabel,url:SITE_URL+"/tools/"+c.slug+"/"}))}
  ];
  writeOut("index.html", renderPage({
    title:"JVM Tools - practical JVM tools, guides and resources",
    description:"The independent, practical guide to JVM tooling: jcmd, jstat, jmap, jstack, async-profiler, Eclipse MAT, JFR, GC analysis, bytecode, build and testing tools, with real command examples.",
    path:"/", active:"/", body, jsonLd
  }));
  console.log("-> site/index.html");
}

function categoryHub(cat){
  const tools=TOOLS.filter(t=>t.category===cat.slug);
  const deeps=DEEP_DIVES.filter(d=>d.category===cat.slug);
  let items='';
  for(const t of tools){
    const u=toolUrl(t.slug)||t.url;
    items+='<li class="tool-item"><div class="body"><h3><a href="'+esc(u)+'">'+esc(t.name)+'</a></h3>';
    items+='<p>'+esc(t.desc)+'</p><div class="tags"><span class="tag">'+t.kind+'</span><span class="tag">'+esc(t.license)+'</span>'+(cat.slug==="jvm-cli"?'<span class="tag">bundled with JDK</span>':"")+'</div></div></li>';
  }
  let introHTML='<div class="page-content"><span class="section-kicker">'+cat.navLabel+'</span><h1>'+esc(cat.title)+'</h1>';
  for(const p of cat.intro)introHTML+='<p>'+p+'</p>';
  introHTML+='<div class="callout"><strong>What you\'ll find here:</strong> '+cat.bullets.join(" &middot; ")+'</div></div>';
  let listHTML='';
  if(tools.length)listHTML='<section class="page-content" style="margin-top:16px"><h2>'+esc(cat.navLabel)+' tools</h2><ul class="tools">'+items+'</ul></section>';
  let deepHTML='';
  if(deeps.length){
    let dItems='';
    for(const d of deeps)dItems+='<li class="tool-item"><div class="body"><h3><a href="/tools/'+cat.slug+'/'+d.slug+'/">'+esc(d.h1.split(":")[0])+'</a></h3><p>'+esc(d.metaDescription)+'</p></div></li>';
    deepHTML='<section class="page-content" style="margin-top:16px"><h2>In-depth guides in this category</h2><ul class="tools">'+dItems+'</ul></section>';
  }
  const body=introHTML+listHTML+deepHTML;
  const jsonLd=[webSchema(),breadcrumbSchema("/tools/"+cat.slug),
    {"@context":"https://schema.org","@type":"CollectionPage",name:cat.title,description:cat.metaDescription,url:SITE_URL+"/tools/"+cat.slug+"/",
     mainEntity:{"@type":"ItemList",itemListElement:tools.map((t,i)=>({"@type":"ListItem",position:i+1,name:t.name,url:toolUrl(t.slug)||t.url,description:t.desc}))}}];
  writeOut("tools/"+cat.slug+"/index.html", renderPage({title:cat.metaTitle,description:cat.metaDescription,path:"/tools/"+cat.slug,active:"/tools/"+cat.slug+"/",body,jsonLd}));
  console.log("-> site/tools/"+cat.slug+"/index.html");
}


function deepDivePage(d){
  const t=toolBySlug(d.toolSlug);
  const official=t?t.url:null;
  let basics='';
  for(const b of d.basics){
    basics+='<h2>'+esc(b.title)+'</h2>';
    for(const p of b.body)basics+='<p>'+p+'</p>';
    if(b.code)basics+='<pre><code>'+escHtml(b.code)+'</code></pre>';
  }
  let quick='<span class="section-kicker">Quick start</span><h2 style="margin-top:6px">Get productive in minutes</h2>';
  for(const q of d.quickstart){ quick+='<h3>'+esc(q.title)+'</h3>'; for(const p of q.body)quick+='<p>'+p+'</p>'; quick+='<pre><code>'+escHtml(q.code)+'</code></pre>'; }
  let faqH='';
  if(d.faq&&d.faq.length){ faqH='<section class="faq"><h2>Frequently asked questions</h2>'; for(const f of d.faq)faqH+='<details><summary>'+esc(f.q)+'</summary><p>'+f.a+'</p></details>'; faqH+='</section>'; }
  let intro='<div class="page-content"><span class="section-kicker">JVM tool guide &middot; '+d.category.replace(/-/g," ")+'</span><h1>'+esc(d.h1)+'</h1>';
  for(const p of d.intro)intro+='<p>'+p+'</p>';
  if(official&&t)intro+='<p class="tags"><span class="tag">Official</span> <a href="'+esc(official)+'" rel="noopener" target="_blank">'+esc(t.name)+' project</a></p>';
  intro+='</div>';
  const uwh='<div class="page-content" style="margin-top:16px"><div class="grid" style="grid-template-columns:1fr 1fr;gap:18px"><div><span class="section-kicker">Use it when</span>'+d.useWhen.map(u=>'<p style="margin:.5rem 0">&bull; '+u+'</p>').join("")+'</div><div><span class="section-kicker">Skip it when</span>'+d.avoidWhen.map(a=>'<p style="margin:.5rem 0">&bull; '+a+'</p>').join("")+'</div></div></div>';
  const basicsH='<div class="page-content" style="margin-top:16px">'+basics+'</div>';
  const quickH='<div class="page-content" style="margin-top:16px">'+quick+'</div>';
  const faqHOut=faqH?'<div class="page-content" style="margin-top:16px">'+faqH+'</div>':"";
  const upd='<p class="updated" style="text-align:center">Last updated '+d.updated+' &middot; '+SITE_NAME+' is independent and not affiliated with Oracle.</p>';
  const body=intro+uwh+basicsH+quickH+faqHOut+upd+ctaBand();
  const path="/tools/"+d.category+"/"+d.slug;
  const jsonLd=[webSchema(),breadcrumbSchema(path),
    {"@context":"https://schema.org","@type":"TechArticle",headline:d.h1,description:d.metaDescription,url:SITE_URL+path+"/",dateModified:LAST_BUILD,author:{"@type":"Organization",name:SITE_NAME},publisher:{"@type":"Organization",name:SITE_NAME},inLanguage:"en"},
    ...(d.faq&&d.faq.length?[{"@context":"https://schema.org","@type":"FAQPage",mainEntity:d.faq.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}]:[])
  ];
  writeOut(path.slice(1)+"/index.html", renderPage({title:d.metaTitle,description:d.metaDescription,path,active:"/tools/"+d.category+"/",body,jsonLd}));
  console.log("-> site"+path+"/index.html");
}


// ---------------- GUIDES ----------------
const BOOKS=[
  {title:"Java Performance: The Definitive Guide",author:"Scott Oaks",url:"https://www.oreilly.com/library/view/java-performance-the/9781449363512/",note:"The practical performance bible - profiling, GC and JIT explained with real data."},
  {title:"Effective Java",author:"Joshua Bloch",url:"https://www.oreilly.com/library/view/effective-java-3rd/9781492069669/",note:"Third edition - the canonical set of best practices for robust, idiomatic Java."},
  {title:"Java Concurrency in Practice",author:"Brian Goetz et al.",url:"https://www.oreilly.com/library/view/java-concurrency-in/9780321349606/",note:"The definitive concurrency book - essential for reading thread dumps and writing correct parallel code."},
  {title:"Inside the Java Virtual Machine",author:"Bill Venners",url:"https://www.artima.com/insidejvm/ed2/",note:"A classic deep dive into class files, bytecode and JVM internals."}
];

function guideIndex(){
  let items='';
  for(const g of GUIDES)items+='<li class="tool-item"><div class="body"><h3><a href="/guides/'+g.slug+'/">'+esc(g.title)+'</a></h3><p>'+esc(g.metaDescription)+'</p></div></li>';
  const body='<div class="page-content"><h1>JVM Guides &amp; How-tos</h1><p>Practical, example-first guides for working with the JVM: reading thread and heap dumps, tuning JVM flags, and analyzing garbage collection - real commands, not just theory.</p></div><div class="page-content" style="margin-top:16px"><ul class="tools">'+items+'</ul></div>';
  const jsonLd=[webSchema(),breadcrumbSchema("/guides"),{"@context":"https://schema.org","@type":"ItemList",name:"JVM Guides",itemListElement:GUIDES.map((g,i)=>({"@type":"ListItem",position:i+1,name:g.title,url:SITE_URL+"/guides/"+g.slug+"/"}))}];
  writeOut("guides/index.html", renderPage({title:"JVM Guides & How-tos",description:"Practical JVM guides: thread dumps, heap dumps, JVM flags, GC analysis, with real command examples.",path:"/guides",active:"/guides/",body,jsonLd}));
  console.log("-> site/guides/index.html");
}

function guidePage(g){
  let secs='';
  for(const s of g.sections){
    secs+='<h2>'+esc(s.title)+'</h2>';
    for(const p of s.body)secs+='<p>'+p+'</p>';
    if(s.code)secs+='<pre><code>'+escHtml(s.code)+'</code></pre>';
    if(s.table){ secs+='<div class="tbl-wrap"><table><thead><tr>'+s.table.cols.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr></thead><tbody>'+s.table.rows.map(r=>'<tr>'+r.map(c=>'<td>'+esc(c)+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'; }
  }
  let faqH='';
  if(g.faq&&g.faq.length){ faqH='<section class="faq"><h2>Frequently asked questions</h2>'; for(const f of g.faq)faqH+='<details><summary>'+esc(f.q)+'</summary><p>'+f.a+'</p></details>'; faqH+='</section>'; }
  const body='<div class="page-content"><span class="section-kicker">JVM guide</span><h1>'+esc(g.title)+'</h1>'+g.intro.map(p=>'<p>'+p+'</p>').join("")+'</div><div class="page-content" style="margin-top:16px">'+secs+'</div>'+(faqH?'<div class="page-content" style="margin-top:16px">'+faqH+'</div>':"")+'<p class="updated" style="text-align:center">Last updated '+g.updated+' &middot; '+SITE_NAME+' is independent and not affiliated with Oracle.</p>'+ctaBand();
  const path="/guides/"+g.slug;
  const jsonLd=[webSchema(),breadcrumbSchema(path),{"@context":"https://schema.org","@type":"TechArticle",headline:g.title,description:g.metaDescription,url:SITE_URL+path+"/",dateModified:LAST_BUILD,author:{"@type":"Organization",name:SITE_NAME},publisher:{"@type":"Organization",name:SITE_NAME},inLanguage:"en"},...(g.faq&&g.faq.length?[{"@context":"https://schema.org","@type":"FAQPage",mainEntity:g.faq.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}]:[])];
  writeOut(path.slice(1)+"/index.html", renderPage({title:g.metaTitle,description:g.metaDescription,path,active:"/guides/",body,jsonLd}));
  console.log("-> site"+path+"/index.html");
}

// ---------------- BOOKS ----------------
function booksPage(){
  let items='';
  for(const b of BOOKS)items+='<li class="tool-item"><div class="body"><h3><a href="'+b.url+'" rel="noopener" target="_blank">'+esc(b.title)+'</a></h3><p><strong>'+esc(b.author)+'</strong> &mdash; '+esc(b.note)+'</p></div></li>';
  const body='<div class="page-content"><h1>Recommended Books for JVM Development</h1><p>A curated reading list for understanding JVM internals, performance and Java best practices.</p></div><div class="page-content" style="margin-top:16px"><ul class="tools">'+items+'</ul></div>';
  const jsonLd=[webSchema(),breadcrumbSchema("/books"),{"@context":"https://schema.org","@type":"ItemList",name:"JVM Books",itemListElement:BOOKS.map((b,i)=>({"@type":"ListItem",position:i+1,name:b.title,url:b.url}))}];
  writeOut("books/index.html", renderPage({title:"Recommended Books for JVM Development",description:"The best books for learning JVM internals, Java performance and concurrency.",path:"/books",active:"/books/",body,jsonLd}));
  console.log("-> site/books/index.html");
}

// ---------------- SITEMAP / ROBOTS ----------------
function sitemapRobots(){
  const paths=["/"];
  CATEGORIES.forEach(c=>paths.push("/tools/"+c.slug+"/"));
  DEEP_DIVES.forEach(d=>paths.push("/tools/"+d.category+"/"+d.slug+"/"));
  paths.push("/guides/");
  GUIDES.forEach(g=>paths.push("/guides/"+g.slug+"/"));
  paths.push("/books/");
  let x='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for(const p of paths)x+='\n  <url><loc>'+SITE_URL+p+'</loc></url>';
  x+='\n</urlset>\n';
  writeOut("sitemap.xml",x);
  writeOut("robots.txt","User-agent: *\nAllow: /\nSitemap: "+SITE_URL+"/sitemap.xml\n");
  console.log("-> site/sitemap.xml, site/robots.txt");
}


const STYLES = importedStyles; // see import below



// Renders the CTA band. Non-functional until SIGNUP_URL is set.
function ctaBand(){
  const action = SIGNUP_URL ? 'action="'+SIGNUP_URL+'" method="POST"' : 'onsubmit="return false"';
  const handler = `<script>
    (function(){
      var f=document.getElementById('jvmtool-cta-form');
      if(!f)return;
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var s=document.getElementById('cta-status');
        var email=f.querySelector('input[type=email]').value;
        if(!SIGNUP_BOOL || !/\\S+@\\S+\\S+/.test(email)){ s.textContent='Coming soon - we are wiring up signups.'; return; }
        var fd=new FormData(f);
        fetch(f.action,{method:'POST',body:new FormData(f),headers:{accept:'application/json'}})
          .then(r=>{ s.textContent=r.ok?'Thanks! Check your inbox.':'Something went wrong - try again.'; if(r.ok)f.reset(); })
          .catch(()=>{ s.textContent='Something went wrong - try again.'; });
      });
    })();
  <\/script>`;
  return '<section class="cta-band"><h2>'+CTA_TITLE+'</h2><p>'+CTA_BODY+'</p>'+
    '<form id="jvmtool-cta-form" class="cta-form" '+action+'><input type="email" name="email" placeholder="you@example.com" required><button>'+CTA_BUTTON+'</button></form>'+
    '<p id="cta-status" class="form-status"></p><p class="cta-note">One email. Free forever.</p>'+
    '<script>var SIGNUP_BOOL='+(SIGNUP_URL?'true':'false')+';</script>'+handler+'</section>';
}

// ---------------- MAIN ----------------
function run(){
  rmSync(join(OUT,"tools"),{recursive:true,force:true});
  rmSync(join(OUT,"guides"),{recursive:true,force:true});
  rmSync(join(OUT,"books"),{recursive:true,force:true});
  mkdirSync(join(OUT,"assets"),{recursive:true});
  writeFileSync(join(OUT,"assets","jvm-tools.css"), STYLES);
  homepage();
  CATEGORIES.forEach(categoryHub);
  DEEP_DIVES.forEach(deepDivePage);
  guideIndex();
  GUIDES.forEach(guidePage);
  booksPage();
  sitemapRobots();
  console.log("\nBuild complete -> " + OUT);
}
run();
