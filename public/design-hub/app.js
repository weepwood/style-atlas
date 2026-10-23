(function () {
"use strict";
var STORAGE_KEY = "weepwood-design-hub-v1";
var SCORE_LABELS = ["布局层次","字体排版","色彩系统","交互反馈","动效节奏","可访问性"];
var PALETTES = [
 ["#b6caff","#ebe5ff","#6575e1"],["#ffddc3","#fff2d9","#eaa68e"],
 ["#bce8dc","#e4f7ee","#48a597"],["#d3c8ff","#edeaff","#9074d4"],
 ["#bde1f7","#e8f2ff","#67a5d4"],["#e7c1d7","#f5e4f1","#b47ba5"]
];
function byId(id){return document.getElementById(id);}
function esc(value){return String(value == null ? "" : value).replace(/[&<>"']/g,function(s){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[s];});}
function urlOK(value){try{var u=new URL(String(value));return u.protocol==="https:" || u.protocol==="http:" ? u.href : null;}catch(e){return null;}}
function domain(value){try{return new URL(value).hostname.replace(/^www\./,"");}catch(e){return "";}}
function safeObj(raw){return raw && typeof raw==="object" && !Array.isArray(raw) ? raw : {};}
function readSaved(){try{return safeObj(JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"));}catch(e){return {};}}
var loaded=readSaved();
var resources=SEED_RESOURCES.concat(Array.isArray(loaded.custom)?loaded.custom.filter(function(r){return r && typeof r.name==="string" && urlOK(r.url);}).slice(0,500):[]);
var favorites=new Set(Array.isArray(loaded.favorites)?loaded.favorites:[]);
var reviews=safeObj(loaded.reviews);
var workbench=Object.assign({template:"glass",accent:"#6676ee",radius:18,space:20,brand:"Studio North"},safeObj(loaded.workbench));
var state={view:"discover",category:"all",query:"",priority:"all",sort:"recommended",selected:null,tab:"details",device:"desktop",previewRequested:false};
var shots={};
var toastTimer=null;
var uploadFor=null;
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({custom:resources.filter(function(r){return r.custom;}),favorites:Array.from(favorites),reviews:reviews,workbench:workbench}));return true;}catch(e){toast("本地存储空间不足，请导出备份后清理浏览器数据");return false;}}
function toast(message){var node=byId("toast");node.textContent=message;node.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(function(){node.classList.remove("visible");},2800);}
function priorityRank(v){return {S:0,A:1,B:2,C:3}[v] == null ? 4 : {S:0,A:1,B:2,C:3}[v];}
function getResource(id){return resources.find(function(r){return r.id===id;});}
function reviewed(id){var r=reviews[id];return !!(r && ((r.scores||[]).some(function(s){return Number(s)>0;}) || (r.notes||"").trim()));}
function getReview(id){var raw=safeObj(reviews[id]);return {scores:Array.isArray(raw.scores)?raw.scores.slice(0,6):[0,0,0,0,0,0],notes:typeof raw.notes==="string"?raw.notes:""};}
function reviewAverage(review){var scores=review.scores.map(Number).filter(function(v){return v>0 && v<=5;});return scores.length? (scores.reduce(function(a,b){return a+b;},0)/scores.length).toFixed(1):"—";}
function filtered(){
 var q=state.query.trim().toLocaleLowerCase();
 var list=resources.filter(function(r){
  if(state.category!=="all" && r.category!==state.category)return false;
  if(state.view==="favorites" && !favorites.has(r.id))return false;
  if(state.priority!=="all" && r.priority!==state.priority)return false;
  return !q || [r.name,r.description,r.category,r.tags.join(" "),domain(r.url)].join(" ").toLocaleLowerCase().includes(q);
 });
 return list.sort(function(a,b){
  if(state.sort==="name")return a.name.localeCompare(b.name);
  if(state.sort==="latest")return b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id);
  if(state.sort==="category")return a.category.localeCompare(b.category);
  return priorityRank(a.priority)-priorityRank(b.priority) || a.name.localeCompare(b.name);
 });
}
function categoryIndex(r){return Math.max(0,CATEGORIES.indexOf(r.category));}
function colorStyle(r){var p=PALETTES[categoryIndex(r)%PALETTES.length];return "--c1:"+p[0]+";--c2:"+p[1]+";--c3:"+p[2];}
function previewMarkup(){return '<div class="preview-window"><div class="preview-top"><i></i><i></i><i></i></div><div class="preview-title"></div><div class="preview-desc"></div><div class="preview-desc short"></div><div class="preview-layout"><i></i><i></i><i></i></div></div>';}
function header(title,desc,eyebrow,action){
 return '<div class="page-head"><div><div class="eyebrow">'+esc(eyebrow||"DESIGN COLLECTION")+'</div><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p></div>'+(action||"")+'</div>';
}
function statsHtml(){
 var favored=resources.filter(function(r){return favorites.has(r.id);}).length;
 var rated=resources.filter(function(r){return reviewed(r.id);}).length;
 return '<div class="stats">'+[
 ["设计资源",resources.length,"▦"],["资源分类",CATEGORIES.length,"◈"],["已收藏",favored,"♡"],["已分析",rated,"◫"]
 ].map(function(s){return '<div class="stat"><small>'+s[0]+'</small><strong>'+s[1]+'</strong><span class="stat-icon">'+s[2]+'</span></div>';}).join("")+'</div>';
}
function toolbar(){
 return '<div class="toolbar"><label class="searchbox"><span>⌕</span><input id="resource-search" type="search" placeholder="搜索网站、用途或标签..." value="'+esc(state.query)+'"></label>'+
 '<select id="priority-filter" aria-label="按优先级筛选"><option value="all">全部优先级</option>'+["S","A","B","C"].map(function(p){return '<option value="'+p+'" '+(state.priority===p?"selected":"")+'>'+p+' 级资源</option>';}).join("")+'</select>'+
 '<select id="sort-filter" aria-label="排序方式"><option value="recommended">按推荐优先级</option><option value="name" '+(state.sort==="name"?"selected":"")+'>按名称排序</option><option value="latest" '+(state.sort==="latest"?"selected":"")+'>最近添加</option><option value="category" '+(state.sort==="category"?"selected":"")+'>按分类排序</option></select></div>';
}
function chips(){
 return '<div class="chip-row"><button class="chip '+(state.category==="all"?"selected":"")+'" data-category="all">全部分类 · '+resources.length+'</button>'+
 CATEGORIES.map(function(c,i){var count=resources.filter(function(r){return r.category===c;}).length;return '<button class="chip '+(state.category===c?"selected":"")+'" data-category="'+esc(c)+'">'+esc(CATEGORY_SHORT[i])+' · '+count+'</button>';}).join("")+'</div>';
}
function resourceCard(r){
 var pattern=categoryIndex(r)%3;
 return '<article class="resource-card"><div class="resource-image" data-pattern="'+pattern+'" style="'+colorStyle(r)+'">'+
 previewMarkup()+'<span class="priority-flag '+esc(r.priority)+'">'+esc(r.priority)+' · '+(r.status==="active"?"资源参考":r.status==="redirect"?"已迁移":"已停用")+'</span>'+
 '<button class="card-bookmark '+(favorites.has(r.id)?"is-favorite":"")+'" aria-label="'+(favorites.has(r.id)?"取消收藏":"收藏资源")+'" data-favorite="'+esc(r.id)+'">'+(favorites.has(r.id)?"♥":"♡")+'</button></div>'+
 '<div class="resource-info"><div class="resource-main"><span class="resource-favicon">'+esc(r.name.slice(0,1).toUpperCase())+'</span><div class="resource-names"><strong>'+esc(r.name)+'</strong><span>'+esc(domain(r.url))+'</span></div></div>'+
 '<p class="resource-desc">'+esc(r.description)+'</p><div class="card-foot"><span class="category-tag">'+esc(r.category)+'</span><button class="card-open" data-detail="'+esc(r.id)+'">查看详情 ↗</button></div></div></article>';
}
function catalog(isDiscover){
 var list=filtered();
 if(isDiscover)list=list.slice(0,9);
 var title=state.view==="favorites"?"我的收藏":isDiscover?"精选设计资源":"全部设计资源";
 var main='<div class="section-head"><h2>'+title+' <small>· '+list.length+' 条</small></h2>'+(isDiscover?'<button data-view="library">浏览全部 →</button>':'<button data-export="json">导出资源 →</button>')+'</div>';
 main+=toolbar()+chips();
 if(!list.length)return main+'<div class="empty"><div class="empty-icon">⌕</div><h3>这里暂时没有匹配资源</h3><p>试试清除筛选，或者添加你的第一个设计参考。</p><button class="outline-btn" data-reset-filters>清除筛选</button></div>';
 return main+'<div class="grid">'+list.map(resourceCard).join("")+'</div>';
}
function discover(){
 return header("让灵感有迹可循。","收集值得研究的界面，拆解体验细节，将灵感转化为自己的 UI 组件。","WELCOME BACK","<button class=\"outline-btn\" data-export=\"json\">↓ 导出收藏数据</button>")+
 '<section class="hero"><div class="hero-copy"><div class="hero-kicker">YOUR DESIGN REFERENCE ATLAS</div><h2>Discover. Analyze. Recreate.</h2><p>从参考收集、结构化分析到可编辑的视觉复刻，让每一份设计灵感都能真正落地。</p><button class="hero-button" data-view="replica">探索复刻工作台 →</button></div><div class="hero-showcase" aria-hidden="true"><div class="showcase-back"></div><div class="showcase-front"><div class="mock-head"></div><div class="mock-line"></div><div class="mock-line short"></div><div class="mock-pill"></div></div></div></section>'+statsHtml()+catalog(true)+footer();
}
function footer(){return '<div class="footer-line"><span>© 2026 Weepwood · Design Hub</span><span>本地优先 · 示意预览并非网站原始截图 · 请尊重源站授权</span></div>';}
function library(){return header(state.view==="favorites"?"我的设计收藏":"设计资源目录",state.view==="favorites"?"快速访问收藏的灵感素材与产品案例。":"跨视觉风格、产品 UX、组件动效与 AI 工具检索你的资源。","RESOURCE LIBRARY","<button class=\"outline-btn\" data-export=\"json\">↓ 导出 JSON</button>")+catalog(false)+footer();}
function analysisView(){
 var counts=CATEGORIES.map(function(c){return resources.filter(function(r){return r.category===c;}).length;});
 var done=resources.filter(function(r){return reviewed(r.id);});
 var progress=resources.length?Math.round(done.length/resources.length*100):0;
 var bars='<div class="category-bars">'+counts.map(function(n,i){return '<div class="category-bar"><span>'+esc(CATEGORY_SHORT[i])+'</span><div class="bar-track"><div class="bar-fill" style="width:'+(n/Math.max(1,resources.length)*100)+'%"></div></div><b>'+n+'</b></div>';}).join("")+'</div>';
 var entries=done.length?done.map(function(r){return '<button data-detail="'+esc(r.id)+'"><span>'+esc(r.name)+'</span><b>'+esc(reviewAverage(getReview(r.id)))+' / 5 →</b></button>';}).join(""):'<p>尚未有设计分析。在资源详情中选择「设计分析」，即可开始逐项评分并撰写观察。</p>';
 return header("设计分析中心","用统一的六项维度和研究笔记，逐步形成可验证的设计判断。","RESEARCH & INSIGHTS")+
 statsHtml()+'<div class="dashboard-grid"><div class="panel"><h3>资源类别分布</h3><p>资源占比来自当前本地清单，不代表行业流行趋势。</p>'+bars+'</div><div class="panel"><h3>研究进度</h3><p>完成至少一项评分或笔记即计入已分析。</p><strong style="display:block;font-size:42px;color:var(--accent);margin:15px 0">'+progress+'%</strong><div class="bar-track"><div class="bar-fill" style="width:'+progress+'%"></div></div><p style="margin-top:15px">'+done.length+' / '+resources.length+' 份资源已记录研究</p></div>'+
 '<div class="panel"><h3>已建立的设计研究</h3><div class="analysis-list">'+entries+'</div></div><div class="panel"><h3>六维分析框架</h3><p>布局层次、字体排版、色彩系统、交互反馈、动效节奏与可访问性。评分由你亲自记录，不会伪装成 AI 自动识别结果。</p><p style="margin-top:18px">建议同时记录：设计目标、关键状态、可复用模式、实现成本与授权边界。</p><button class="outline-btn" data-view="library" style="margin-top:17px">选择资源开始分析 →</button></div></div>'+footer();
}
function wbControl(label,value,input){return '<div class="control-group"><label>'+label+'<b>'+value+'</b></label>'+input+'</div>';}
function replicaView(){
 var templates=[["glass","玻璃态工作台"],["minimal","极简产品页"],["dashboard","数据仪表盘"],["bento","Bento 卡片"]];
 return header("复刻工作台","使用原创模板进行布局和视觉 Token 实验，导出可继续编辑的独立 HTML。","RECREATE STUDIO")+
 '<div class="workbench"><div class="panel"><h3>01 · 选择视觉模板</h3><p>它们是原创教学模板，不会复制第三方网站的专有素材与代码。</p>'+
 '<div class="control-group template-options">'+templates.map(function(t){return '<button data-template="'+t[0]+'" class="'+(workbench.template===t[0]?"selected":"")+'">'+t[1]+'</button>';}).join("")+'</div>'+
 '<h3 style="margin-top:22px">02 · 调整 Design Tokens</h3>'+
 wbControl("品牌名称","",'<input id="replica-brand" type="text" maxlength="30" value="'+esc(workbench.brand)+'">')+
 wbControl("强调色","",'<input id="replica-accent" type="color" value="'+esc(workbench.accent)+'">')+
 wbControl("圆角半径",workbench.radius+"px",'<input id="replica-radius" type="range" min="0" max="32" step="1" value="'+workbench.radius+'">')+
 wbControl("空间密度",workbench.space+"px",'<input id="replica-space" type="range" min="8" max="36" step="2" value="'+workbench.space+'">')+
 '<p class="status-note">所有调整保存在当前浏览器内。导出文件可脱离本平台独立运行，后续可手动移植到 Vue 3 或 Storybook。</p></div>'+
 '<div class="panel"><div class="section-head"><h2>实时预览 <small>· sandbox iframe</small></h2><span class="category-tag">100% local</span></div>'+
 '<iframe class="workbench-preview" id="workbench-frame" title="复刻工作台预览" sandbox="allow-scripts"></iframe>'+
 '<div class="workbench-actions"><button class="primary-btn" data-export="html">↓ 导出 HTML</button><button class="subtle-btn" data-copy="css">复制 CSS Tokens</button><button class="subtle-btn" data-reset-workbench>恢复默认</button></div></div></div>'+footer();
}
function renderSidebar(){
 byId("nav-total").textContent=resources.length;
 byId("nav-favorites").textContent=resources.filter(function(r){return favorites.has(r.id);}).length;
 document.querySelectorAll(".nav-item[data-view]").forEach(function(b){b.classList.toggle("active",state.view===b.dataset.view);});
 byId("sidebar-categories").innerHTML=CATEGORIES.map(function(c,i){
  return '<button class="nav-item '+(state.view==="library" && state.category===c?"active":"")+'" data-category="'+esc(c)+'"><span class="nav-icon">'+CATEGORY_ICONS[i]+'</span>'+esc(CATEGORY_SHORT[i])+'</button>';
 }).join("");
 byId("new-category").innerHTML=CATEGORIES.map(function(c){return '<option value="'+esc(c)+'">'+esc(c)+'</option>';}).join("");
}
function render(){
 renderSidebar();
 var label={discover:"灵感发现",library:"资源目录",favorites:"我的收藏",analysis:"设计分析",replica:"复刻工作台"}[state.view]||"Design Hub";
 byId("breadcrumb").textContent=label;
 byId("view-root").innerHTML=state.view==="discover"?discover():state.view==="analysis"?analysisView():state.view==="replica"?replicaView():library();
 if(state.view==="replica")applyWorkbenchFrame();
}
function goView(view){state.view=view;state.query="";state.priority="all";if(view!=="library")state.category="all";render();window.scrollTo({top:0,behavior:"instant"});}
function showDetail(id,tab){
 var item=getResource(id);if(!item)return;
 state.selected=id;state.tab=tab||"details";state.device="desktop";state.previewRequested=false;
 byId("drawer-scrim").hidden=false;
 byId("detail-drawer").classList.add("open");
 byId("detail-drawer").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";
 renderDetail();
}
function closeDetail(){
 byId("detail-drawer").classList.remove("open");
 byId("detail-drawer").setAttribute("aria-hidden","true");
 byId("drawer-scrim").hidden=true;document.body.style.overflow="";
 state.selected=null;
}
function detailCover(r){return '<div class="drawer-cover" style="'+colorStyle(r)+'">'+(shots[r.id]?'<img alt="用户保存的网站截图" src="'+esc(shots[r.id])+'">':previewMarkup())+'</div>';}
function detailDetails(r){
 return '<div class="detail-block"><h3>资源介绍</h3><p>'+esc(r.description)+'</p></div>'+
 '<div class="detail-block"><h3>设计标签</h3><div class="meta-pills">'+r.tags.map(function(t){return '<span>#'+esc(t)+'</span>';}).join("")+'</div></div>'+
 '<div class="detail-block"><h3>使用建议</h3><p>先观察布局、信息层级与交互状态，再将可复用的设计原则转化为原创组件，而不是直接复制源站。</p></div>'+
 '<div class="detail-block"><h3>资源信息</h3><div class="meta-pills"><span>优先级 '+esc(r.priority)+'</span><span>状态 '+esc(r.status)+'</span><span>分类 '+esc(r.category)+'</span></div></div>'+
 '<div class="row-buttons"><button class="primary-btn" data-open-url="'+esc(r.id)+'">访问原站 ↗</button><button class="subtle-btn" data-tab="analysis">开始分析 →</button></div>';
}
function detailPreview(r){
 var img=shots[r.id] ? '<img src="'+esc(shots[r.id])+'" alt="用户上传的截图" style="width:100%;height:auto;max-height:350px;object-fit:contain;border:1px solid var(--line);border-radius:8px">' : "";
 var frame=state.previewRequested?'<iframe class="preview-frame" title="来源网站 '+esc(r.name)+'" src="'+esc(r.url)+'" sandbox="allow-scripts allow-forms" referrerpolicy="no-referrer"></iframe>':
 '<div class="preview-fallback"><strong>外站嵌入预览</strong><p>部分网站通过 CSP 或 X-Frame-Options 禁止被嵌入；点击后才会尝试访问原站。若加载失败，请在新标签页打开。</p><button class="outline-btn" data-try-embed>尝试嵌入预览</button></div>';
 return '<div class="detail-block"><p class="status-note">下方截图是你自行上传的素材；页面卡片里的图形仅为示意，不能当成真实网页截图。</p></div>'+
 '<div class="detail-block"><h3>本地截图</h3>'+(img||'<p>还没有截图。建议上传你有权保存和使用的页面图片。</p>')+
 '<div class="row-buttons" style="margin-top:10px"><button class="subtle-btn" data-upload-shot>上传 PNG / JPG / WebP</button>'+(shots[r.id]?'<button class="subtle-btn" data-delete-shot>移除截图</button>':"")+'</div></div>'+
 '<div class="detail-block"><h3>原站预览（可能被阻止）</h3>'+frame+'<div class="row-buttons" style="margin-top:10px"><button class="subtle-btn" data-open-url="'+esc(r.id)+'">在新标签页打开 ↗</button></div></div>';
}
function detailAnalysis(r){
 var review=getReview(r.id);while(review.scores.length<6)review.scores.push(0);
 var items=SCORE_LABELS.map(function(label,i){var score=Number(review.scores[i])||0;return '<div class="score-row"><span>'+esc(label)+'</span><input aria-label="'+esc(label)+'" data-score="'+i+'" type="range" min="0" max="5" step="1" value="'+score+'"><b id="score-label-'+i+'">'+(score?score:"未评")+'</b></div>';}).join("");
 return '<div class="analysis-summary"><div><small>个人研究评分（仅已评维度）</small><p style="font-size:11px;color:var(--muted);margin-top:5px">无评分时不作推断</p></div><strong id="average-score">'+esc(reviewAverage(review))+'</strong></div>'+
 '<div class="detail-block"><h3>六维设计评价 · 0 表示未评</h3>'+items+'</div>'+
 '<div class="detail-block"><h3>研究笔记</h3><textarea id="analysis-notes" class="analysis-textarea" maxlength="10000" placeholder="它解决了什么问题？关键组件、交互状态、视觉 Token、可访问性风险...">'+esc(review.notes)+'</textarea></div>'+
 '<div class="row-buttons"><button class="primary-btn" data-export="markdown">导出研究笔记 ↓</button><button class="subtle-btn" data-view="replica">进入复刻工作台 →</button></div>';
}
function renderDetail(){
 var r=getResource(state.selected);if(!r)return;
 var tabs=[["details","资源信息"],["preview","页面预览"],["analysis","设计分析"]];
 byId("detail-drawer").innerHTML='<div class="drawer-heading"><div class="resource-favicon" style="width:43px;height:43px;flex-basis:43px;font-size:18px">'+esc(r.name.slice(0,1))+'</div><div style="min-width:0"><h2>'+esc(r.name)+'</h2><p>'+esc(domain(r.url))+'</p></div><button class="icon-btn" data-close-detail aria-label="关闭详情">✕</button></div>'+
 detailCover(r)+'<div class="drawer-tabs">'+tabs.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(state.tab===t[0]?"active":"")+'">'+t[1]+'</button>';}).join("")+'</div>'+
 (state.tab==="details"?detailDetails(r):state.tab==="preview"?detailPreview(r):detailAnalysis(r));
}
function download(text,name,type){var blob=new Blob([text],{type:type||"text/plain;charset=utf-8"});var link=document.createElement("a");var url=URL.createObjectURL(blob);link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);}
function exportJson(){
 var backup={schema:"weepwood-design-hub/v1",exportedAt:new Date().toISOString(),resources:resources, favorites:Array.from(favorites),reviews:reviews,workbench:workbench};
 download(JSON.stringify(backup,null,2),"design-hub-backup.json","application/json");
 toast("已导出 JSON 备份（截图不包含在内）");
}
function exportMarkdown(){
 if(!state.selected)return;var r=getResource(state.selected),review=getReview(r.id);
 var lines=["# "+r.name,"","- URL: "+r.url,"- 分类: "+r.category,"- 优先级: "+r.priority,"- 个人评分: "+reviewAverage(review),"","## 六维分析",""];
 SCORE_LABELS.forEach(function(label,i){lines.push("- "+label+"： "+(Number(review.scores[i])||"未评") + (review.scores[i]?"/5":""));});
 lines.push("","## 研究笔记","",review.notes||"（暂无笔记）","","---","来源：Weepwood Design Hub；分数为个人评估，不代表自动测量。");
 download(lines.join("\n"),"analysis-"+r.id+".md","text/markdown;charset=utf-8");
}
function normalizeImport(raw){
 var input=Array.isArray(raw)?{resources:raw}:safeObj(raw);
 if(!Array.isArray(input.resources) || input.resources.length>1000)throw Error("资源条目缺失或数量超出限制（1000）");
 var list=[],seen=new Set();
 input.resources.forEach(function(r,i){
  if(!r || typeof r.name!=="string" || r.name.trim().length===0 || r.name.length>80 || !urlOK(r.url))return;
  var normalizedURL=urlOK(r.url);if(seen.has(normalizedURL))return;seen.add(normalizedURL);
  var existing=SEED_RESOURCES.find(function(s){return s.url===normalizedURL;});
  if(existing)return;
  list.push({id:"custom-"+(Date.now().toString(36))+"-"+i,name:r.name.trim(),url:normalizedURL,category:CATEGORIES.includes(r.category)?r.category:CATEGORIES[0],priority:["S","A","B","C"].includes(r.priority)?r.priority:"B",description:String(r.description||"").slice(0,360),tags:Array.isArray(r.tags)?r.tags.filter(function(t){return typeof t==="string";}).slice(0,10).map(function(t){return t.slice(0,40);}):[],status:"active",createdAt:new Date().toISOString().slice(0,10),custom:true});
 });
 return {list:list,input:input};
}
async function importJson(file){
 if(file.size>1024*1024)throw Error("JSON 文件超过 1MB");
 var raw=JSON.parse(await file.text());
 var normalized=normalizeImport(raw);
 var known=new Set(resources.map(function(r){return r.url;}));
 var added=normalized.list.filter(function(r){return !known.has(r.url);}).slice(0,500);
 resources=resources.concat(added);
 // 官方种子不允许被导入覆盖；收藏和笔记只还原现存合法 ID。
 if(raw && raw.schema==="weepwood-design-hub/v1"){
  var validIds=new Set(resources.map(function(r){return r.id;}));
  if(Array.isArray(raw.favorites))raw.favorites.forEach(function(id){if(validIds.has(id))favorites.add(id);});
  if(raw.reviews && typeof raw.reviews==="object")Object.keys(raw.reviews).forEach(function(id){
   if(!validIds.has(id))return;var x=raw.reviews[id];if(!x || typeof x!=="object")return;
   reviews[id]={scores:Array.isArray(x.scores)?x.scores.slice(0,6).map(function(v){return Math.max(0,Math.min(5,Number(v)||0));}):[0,0,0,0,0,0],notes:String(x.notes||"").slice(0,10000)};
  });
 }
 persist();render();toast("导入完成，新增 "+added.length+" 条有效资源");
}
function addResource(form){
 var name=String(form.name.value).trim(),url=urlOK(form.url.value),category=form.category.value;
 if(!name || !url || !CATEGORIES.includes(category)){toast("请填写有效的网站名称、HTTP(S) 地址和分类");return;}
 if(resources.some(function(r){return r.url===url;})){toast("此网址已在资源库中");return;}
 resources.unshift({id:"custom-"+Date.now().toString(36),name:name.slice(0,80),url:url,category:category,priority:"B",description:String(form.description.value||"").slice(0,360),tags:[],status:"active",custom:true,createdAt:new Date().toISOString().slice(0,10)});
 persist();byId("resource-modal").close();form.reset();goView("library");toast("资源已添加");
}
function wbCSS(){
 var c=/^#[\da-fA-F]{6}$/.test(workbench.accent)?workbench.accent:"#6676ee";
 var r=Math.max(0,Math.min(32,Number(workbench.radius)||0)),s=Math.max(8,Math.min(36,Number(workbench.space)||20));
 return ':root{--accent:'+c+';--radius:'+r+'px;--space:'+s+'px;--ink:#263047}';
}
function buildReplicaHtml(){
 var c=esc(workbench.brand.slice(0,30)),t=workbench.template;
 var base='<style>*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;color:var(--ink);background:#f0f3f9;font-size:14px}button{font:inherit;cursor:pointer}.demo{min-height:100vh;padding:calc(var(--space)*1.4);background:linear-gradient(135deg,#eff1fa,#e4e8f7)}.frame{max-width:840px;margin:0 auto;background:#ffffffda;border:1px solid #fff;border-radius:var(--radius);padding:var(--space);box-shadow:0 18px 55px #293b6820}.nav{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:calc(var(--space)*2)}.nav b{font-size:15px;letter-spacing:-.5px}.nav small{color:#8d96ab;font-size:10px}.chip{color:var(--accent);font-weight:800;font-size:10px;text-transform:uppercase;letter-spacing:1px}.hero{display:grid;grid-template-columns:1fr 1fr;gap:var(--space);align-items:center}.hero h1{font-size:clamp(23px,4vw,43px);line-height:1.14;letter-spacing:-2px;margin:12px 0}.hero p{color:#8490a5;line-height:1.8;font-size:11px}.cta{background:var(--accent);color:white;border:0;border-radius:calc(var(--radius)*.55);padding:11px 17px;font-weight:750;margin-top:14px;font-size:11px}.art{background:linear-gradient(130deg,var(--accent),#ab9af0 58%,#dfe4ff);border-radius:var(--radius);height:215px;position:relative;display:grid;place-items:center;overflow:hidden}.art:before{content:"";width:140px;height:140px;border-radius:26px;transform:rotate(22deg);border:1px solid #ffffffa8;background:linear-gradient(120deg,#ffffffa1,#ffffff1a);box-shadow:0 16px 34px #2230643a}.art:after{content:"✦";font-size:40px;color:#ffffffbd;position:absolute}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-top:var(--space)}.feature{border-radius:calc(var(--radius)*.7);background:#f3f5fc;padding:var(--space);font-size:12px}.feature p{font-size:10px;color:#8390a4;line-height:1.6}.feature strong{display:block;margin-bottom:8px}.feedback{font-size:10px;margin-top:10px;color:var(--accent);height:14px}@media(max-width:560px){.hero{grid-template-columns:1fr}.art{height:140px}.features{grid-template-columns:1fr}.nav{margin-bottom:20px}}</style>';
 var css='<style>'+wbCSS()+'</style>';
 var body='<div class="demo"><div class="frame"><div class="nav"><b>✳ '+c+'</b><small>Home　 Work　 About　 ↗</small></div>'+
 '<div class="hero"><div><span class="chip">DESIGN EXPERIENCE</span><h1>Make something<br>beautiful today.</h1><p>Thoughtful interfaces, clear hierarchy and delightful interactions — designed to be yours.</p><button id="demo-action" class="cta">Explore collection ↗</button><div id="demo-feedback" class="feedback"></div></div><div class="art"></div></div>'+
 '<div class="features"><div class="feature"><strong>◈ Intentional</strong><p>Clarity and purpose in every detail.</p></div><div class="feature"><strong>✳ Expressive</strong><p>Subtle motion and personality.</p></div><div class="feature"><strong>◎ Adaptable</strong><p>A flexible design foundation.</p></div></div></div></div>';
 if(t==="minimal")base+='<style>.demo{background:#f9f9f8}.frame{background:#fff;box-shadow:none;border:1px solid #eaeaea}.art{background:linear-gradient(135deg,#e3e8f4,#f5f2ed)}.art:before{border-radius:50%;background:#fffe}.features .feature{background:#f8f8f7}.chip{color:#5d6472}</style>';
 if(t==="dashboard")base+='<style>.demo{background:#eaf0f8}.frame{background:#fdfdff}.hero h1{font-size:clamp(19px,3vw,34px)}.art{background:linear-gradient(145deg,#1e2b4a,var(--accent))}.features .feature{border:1px solid #e5e9f5;background:#fff}</style>';
 if(t==="bento")base+='<style>.demo{background:linear-gradient(140deg,#f5efff,#edf4ff)}.frame{background:#ffffffa8;backdrop-filter:blur(18px)}.art{border-radius:calc(var(--radius)*1.5)}.features .feature:first-child{background:#e9e1ff}.features .feature:nth-child(2){background:#e1f4ef}.features .feature:nth-child(3){background:#f8ecdc}</style>';
 if(t==="glass")base+='<style>.frame{backdrop-filter:blur(24px);background:#ffffff9a}.features .feature{background:#ffffff8c;border:1px solid #ffffffa9}.demo{background:radial-gradient(circle at 90% 20%,#b7c0fb,transparent 38%),radial-gradient(circle at 10% 85%,#c5e9ea,transparent 40%),#eff1fc}</style>';
 var script='<script>document.getElementById("demo-action").addEventListener("click",function(){document.getElementById("demo-feedback").textContent="Interaction preview · button clicked ✓";});</'+'script>';
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+css+base+'</head><body>'+body+script+'</body></html>';
}
function applyWorkbenchFrame(){var frame=byId("workbench-frame");if(frame)frame.srcdoc=buildReplicaHtml();}
function applyWorkbenchParam(id,value){
 if(id==="replica-brand")workbench.brand=String(value).slice(0,30);
 if(id==="replica-radius")workbench.radius=Math.max(0,Math.min(32,Number(value)||0));
 if(id==="replica-space")workbench.space=Math.max(8,Math.min(36,Number(value)||20));
 if(id==="replica-accent" && /^#[\da-fA-F]{6}$/.test(value))workbench.accent=value;
 persist();if(id==="replica-radius" || id==="replica-space"){var b=byId(id).closest(".control-group").querySelector("label b");if(b)b.textContent=workbench[id==="replica-radius"?"radius":"space"]+"px";}
 applyWorkbenchFrame();
}
function copyText(text){
 if(!navigator.clipboard || !navigator.clipboard.writeText){toast("此环境不支持自动复制，请导出 HTML");return;}
 navigator.clipboard.writeText(text).then(function(){toast("已复制 CSS Tokens");}).catch(function(){toast("剪贴板不可用，请导出 HTML");});
}
function takeScreenshot(id,file){
 if(!file || !["image/png","image/jpeg","image/webp"].includes(file.type)){toast("仅支持 PNG、JPG、WebP");return;}
 if(file.size>5*1024*1024){toast("截图请小于 5 MB");return;}
 if(!window.indexedDB){toast("当前浏览器不支持 IndexedDB");return;}
 var req=indexedDB.open("weepwood-design-hub-shots",1);
 req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("shots"))req.result.createObjectStore("shots");};
 req.onerror=function(){toast("无法打开本地截图数据库");};
 req.onsuccess=function(){
  var db=req.result,tx=db.transaction("shots","readwrite");
  tx.objectStore("shots").put(file,id);
  tx.oncomplete=function(){if(shots[id])URL.revokeObjectURL(shots[id]);shots[id]=URL.createObjectURL(file);if(state.selected===id)renderDetail();toast("截图已保存到浏览器本地");db.close();};
  tx.onerror=function(){toast("截图保存失败，可能是存储空间不足");db.close();};
 };
}
function deleteScreenshot(id){
 var req=indexedDB.open("weepwood-design-hub-shots",1);
 req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("shots"))req.result.createObjectStore("shots");};
 req.onsuccess=function(){var db=req.result,tx=db.transaction("shots","readwrite");tx.objectStore("shots").delete(id);tx.oncomplete=function(){if(shots[id])URL.revokeObjectURL(shots[id]);delete shots[id];db.close();renderDetail();toast("截图已移除");};};
 req.onerror=function(){toast("无法移除截图");};
}
function loadScreenshots(){
 if(!window.indexedDB)return;
 var req=indexedDB.open("weepwood-design-hub-shots",1);
 req.onupgradeneeded=function(){if(!req.result.objectStoreNames.contains("shots"))req.result.createObjectStore("shots");};
 req.onsuccess=function(){var db=req.result,tx=db.transaction("shots","readonly");var store=tx.objectStore("shots");var cursor=store.openCursor();
 cursor.onsuccess=function(e){var cur=e.target.result;if(cur){if(cur.value instanceof Blob)shots[cur.key]=URL.createObjectURL(cur.value);cur.continue();}};
 tx.oncomplete=function(){db.close();if(state.selected)renderDetail();};};
}
document.addEventListener("click",function(e){
 var target=e.target.closest("button,a[data-view]");
 if(!target)return;
 if(target.dataset.view){closeDetail();goView(target.dataset.view);return;}
 if(target.dataset.category){state.category=target.dataset.category;state.view="library";render();return;}
 if(target.dataset.detail){showDetail(target.dataset.detail);return;}
 if(target.dataset.favorite){
  var id=target.dataset.favorite;if(favorites.has(id))favorites.delete(id);else favorites.add(id);
  persist();render();toast(favorites.has(id)?"已加入收藏":"已取消收藏");return;
 }
 if(target.hasAttribute("data-reset-filters")){state.query="";state.priority="all";state.category="all";render();return;}
 if(target.dataset.tab){state.tab=target.dataset.tab;renderDetail();return;}
 if(target.hasAttribute("data-close-detail")){closeDetail();return;}
 if(target.hasAttribute("data-close-modal")){byId("resource-modal").close();return;}
 if(target.hasAttribute("data-try-embed")){state.previewRequested=true;renderDetail();return;}
 if(target.dataset.openUrl){var r=getResource(target.dataset.openUrl);if(r && urlOK(r.url))window.open(r.url,"_blank","noopener,noreferrer");return;}
 if(target.hasAttribute("data-upload-shot")){uploadFor=state.selected;byId("screenshot-file").click();return;}
 if(target.hasAttribute("data-delete-shot")){deleteScreenshot(state.selected);return;}
 if(target.dataset.template){workbench.template=target.dataset.template;persist();render();return;}
 if(target.hasAttribute("data-reset-workbench")){workbench={template:"glass",accent:"#6676ee",radius:18,space:20,brand:"Studio North"};persist();render();toast("已恢复模板默认设置");return;}
 if(target.dataset.copy==="css"){copyText(wbCSS());return;}
 if(target.dataset.export==="json"){exportJson();return;}
 if(target.dataset.export==="markdown"){exportMarkdown();return;}
 if(target.dataset.export==="html"){download(buildReplicaHtml(),"design-hub-replica.html","text/html;charset=utf-8");toast("HTML 已导出");return;}
});
document.addEventListener("input",function(e){
 var target=e.target;
 if(target.id==="resource-search"){
  var v=target.value,selection=target.selectionStart;state.query=v;
  // 防止输入时重新挂载 input 导致光标和中文输入法丢失，只更新列表区域。
  if(!e.isComposing){var root=byId("view-root");var shell=root.querySelector(".grid"),empty=root.querySelector(".empty");var list=filtered();if(state.view==="discover")list=list.slice(0,9);
   var summary=root.querySelector(".section-head small");if(summary)summary.textContent="· "+list.length+" 条";
   if(shell){shell.innerHTML=list.map(resourceCard).join("");shell.hidden=!list.length;}
   if(empty)empty.hidden=!!list.length;
  }
  return;
 }
 if(target.hasAttribute("data-score") && state.selected){
  var idx=Number(target.dataset.score),rev=getReview(state.selected);rev.scores[idx]=Number(target.value);reviews[state.selected]=rev;persist();byId("score-label-"+idx).textContent=target.value==="0"?"未评":target.value;byId("average-score").textContent=reviewAverage(rev);return;
 }
 if(target.id==="analysis-notes" && state.selected){var review=getReview(state.selected);review.notes=target.value;reviews[state.selected]=review;persist();return;}
 if(["replica-brand","replica-radius","replica-space","replica-accent"].includes(target.id))applyWorkbenchParam(target.id,target.value);
});
document.addEventListener("change",function(e){
 if(e.target.id==="priority-filter"){state.priority=e.target.value;render();}
 if(e.target.id==="sort-filter"){state.sort=e.target.value;render();}
});
document.addEventListener("keydown",function(e){if(e.key==="Escape" && state.selected)closeDetail();});
byId("drawer-scrim").addEventListener("click",closeDetail);
byId("open-replica").addEventListener("click",function(){goView("replica");});
byId("add-resource-trigger").addEventListener("click",function(){byId("resource-modal").showModal();});
byId("import-trigger").addEventListener("click",function(){byId("import-file").click();});
byId("resource-form").addEventListener("submit",function(e){e.preventDefault();addResource(e.target);});
byId("import-file").addEventListener("change",async function(e){
 var file=e.target.files[0];if(!file)return;
 try{await importJson(file);}catch(err){toast("导入失败："+err.message);}e.target.value="";
});
byId("screenshot-file").addEventListener("change",function(e){if(e.target.files[0] && uploadFor)takeScreenshot(uploadFor,e.target.files[0]);e.target.value="";});
byId("theme-toggle").addEventListener("click",function(){document.body.classList.toggle("dark");try{localStorage.setItem("weepwood-design-hub-theme",document.body.classList.contains("dark")?"dark":"light");}catch(e){};});
try{if(localStorage.getItem("weepwood-design-hub-theme")==="dark")document.body.classList.add("dark");}catch(e){}
render();loadScreenshots();
})();