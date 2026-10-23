/* 首批资源根据 2026-10-23 收藏清单整理，信息是简介而非自动抓取的实时内容。 */
const CATEGORIES = [
  "设计灵感与网站案例","真实产品 UI 与 UX","可复用 UI 组件","动效与微交互",
  "AI 设计与应用生成","视觉素材与 Figma","提示词、工作流与发布"
];
const CATEGORY_SHORT = ["设计灵感","产品 UX","UI 组件","交互动效","AI 设计","视觉素材","工作流"];
const CATEGORY_ICONS = ["▧","◈","▦","◉","✳","◐","⌘"];
const ENTRIES = [
 ["Landdding","https://landdding.com",0,"A","Landing Page、Framer 和 Webflow 设计精选","landing,web"],
 ["Landbook","https://land-book.com",0,"S","按风格、配色与行业检索网站设计案例","landing,website,filter"],
 ["Recent","https://recent.design",0,"S","跨网站、品牌与动效的综合视觉灵感","visual,inspiration,design"],
 ["Inspora","https://inspora.design",0,"A","网页、品牌、动效与插画灵感合集","inspiration,branding"],
 ["Minimal Gallery","https://minimal.gallery",0,"A","极简风格页面、留白与排版参考","minimal,website"],
 ["Landing Gallery","https://landing.gallery",0,"A","产品官网和定价页设计灵感","landing,saas"],
 ["Footer Design","https://footer.design",0,"A","专注网站页脚区块的设计图库","footer,layout"],
 ["on.design","https://on.design",0,"B","设计作品分享与设计师社区","community,portfolio"],
 ["Godly","https://godly.website",0,"C","旧灵感站点，现跳转至 Recent", "legacy,redirect"],
 ["Mobbin","https://mobbin.com",1,"S","真实 App 与 Web 产品界面及用户流程","app,ux,screens"],
 ["Refero","https://refero.design",1,"S","真实产品截图、UX 模式与流程研究","ux,webapp,flow"],
 ["21st.dev","https://21st.dev",2,"S","社区 UI 组件、交互范例与 AI 提示词","components,community"],
 ["Kokonut UI","https://kokonutui.com",2,"S","React 动态组件与精细交互演示","react,motion,components"],
 ["ObsidianUI","https://obsidianui.dev",2,"A","React 动画组件与创意布局","react,animated,components"],
 ["Bencho","https://bencho.dev",2,"S","Hover、拖拽、加载等微交互组件","interaction,react"],
 ["60fps","https://60fps.design",3,"S","真实产品动画、微交互和运动细节","motion,mobile,ux"],
 ["Motionin","https://motionin.design",3,"S","交互式网页区块和动态设计参考","motion,prompt,sections"],
 ["Transitions.dev","https://transitions.dev",3,"S","转场效果、动效库与 Agent 技能","transition,motion,skills"],
 ["Modulify","https://modulify.ai",4,"A","通过自然语言构建网站与 Web 应用","ai,website,app"],
 ["UX Pilot","https://uxpilot.ai",4,"A","AI 生成 UI、原型与产品流程","ai,prototype,ux"],
 ["v0","https://v0.app",4,"A","AI UI 生成与代码协作平台","ai,code,components"],
 ["Base44","https://base44.com",4,"B","使用自然语言构建应用及后端","ai,app,builder"],
 ["Wonderlist","https://wonderlist.design",5,"B","Figma 网站设计与版式资源合集","figma,template"],
 ["Iconly","https://iconly.design",5,"A","应用图标和产品视觉设计灵感","icons,app"],
 ["Font In Logo","https://fontinlogo.com",5,"B","知名品牌字体与标志排版研究","fonts,branding"],
 ["Backgrounds Supply","https://backgrounds.supply",5,"A","渐变、纹理和背景设计素材","background,texture"],
 ["VibePrompts","https://vibeprompts.dev",6,"A","AI 编码场景的 UI 提示词库","prompt,ai,layout"],
 ["Skill Issue","https://skill-issue.in",6,"A","设计与前端开发的 AI Agent 技能目录","agent,skills"],
 ["Reelfolio","https://reelfolio.io",6,"B","用录屏和截图制作产品展示视频","showreel,motion"],
 ["Is Ready For Launch","https://isreadyforlaunch.com",6,"B","产品上线前 SEO、性能和体验检查","checklist,launch"],
 ["Open Design","https://opendesign.dev",6,"C","历史项目，当前服务已停止","legacy,sunset"]
];
const SEED_RESOURCES = ENTRIES.map(function(e,i) {
  return {
    id: "seed-" + (i + 1), name: e[0], url: e[1], category: CATEGORIES[e[2]],
    description: e[4], priority: e[3], tags: e[5].split(","),
    status: e[0] === "Godly" ? "redirect" : e[0] === "Open Design" ? "sunset" : "active",
    custom: false, createdAt: "2026-10-23"
  };
});